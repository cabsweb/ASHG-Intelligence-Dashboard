#!/usr/bin/env python3
"""Download or verify archived ASHG source files for one year."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def digest(path: Path) -> str:
    sha = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            sha.update(chunk)
    return sha.hexdigest()


def download(url: str, target: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "CABS-ASHG-Archive/1.0"})
    target.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(request, timeout=90) as response:
        content_type = response.headers.get("Content-Type", "").lower()
        if not any(kind in content_type for kind in ("pdf", "spreadsheet", "excel", "octet-stream")):
            raise RuntimeError(f"Unexpected content type for {url}: {content_type}")
        suffix = target.suffix or ".download"
        with tempfile.NamedTemporaryFile(dir=target.parent, suffix=suffix, delete=False) as temp:
            while chunk := response.read(1024 * 1024):
                temp.write(chunk)
            temp_path = Path(temp.name)
    if target.suffix.lower() == ".pdf" and temp_path.read_bytes()[:5] != b"%PDF-":
        temp_path.unlink(missing_ok=True)
        raise RuntimeError(f"Downloaded file is not a PDF: {url}")
    os.replace(temp_path, target)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("year", type=int)
    parser.add_argument("--refresh", action="store_true", help="Redownload existing files")
    args = parser.parse_args()

    archive_dir = ROOT / "assets" / "sources" / str(args.year)
    manifest_path = archive_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    changed = False

    for entry in manifest["files"]:
        target = archive_dir / entry["localPath"]
        if args.refresh or not target.exists():
            print(f"download {entry['originalUrl']} -> {target.relative_to(ROOT)}")
            download(entry["originalUrl"], target)
            changed = True
        actual_bytes = target.stat().st_size
        actual_hash = digest(target)
        expected_hash = entry.get("sha256")
        if expected_hash and actual_hash != expected_hash and not args.refresh:
            raise SystemExit(f"checksum mismatch: {target.relative_to(ROOT)}")
        if entry.get("bytes") != actual_bytes or entry.get("sha256") != actual_hash:
            entry["bytes"] = actual_bytes
            entry["sha256"] = actual_hash
            changed = True
        print(f"ok {target.relative_to(ROOT)} {actual_bytes} bytes {actual_hash}")

    if changed:
        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
        print(f"updated {manifest_path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
