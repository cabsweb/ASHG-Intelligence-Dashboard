# ASHG Intelligence Dashboard

A public, source-grounded annual intelligence dashboard that translates ASHG meeting programs into decision-ready signals for CABS members and biotech leaders.

## Features

- Year selector with published, backfill, and upcoming coverage states
- 12 curated 2026 scientific, translational, clinical, and policy signals
- Search plus theme and priority filters
- Evidence, implications, and suggested CABS actions kept distinct
- Direct links to primary ASHG sources on every signal
- Responsive dark/light interface with accessible controls
- No build step or runtime dependencies

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Annual data model

[`data/years.json`](data/years.json) is the coverage manifest. It defines each year's status, meeting metadata, official sources, executive readout, and signal-data path. Published signal records live under `data/<year>/signals.json`.

Current coverage:

| Year | State | Purpose |
|---|---|---|
| 2025 | Backfill planned | Source-grounded historical retrospective |
| 2026 | Published | Complete initial intelligence brief |
| 2027 | Upcoming watch | Rolling capture when official materials appear |

## Add or update a year

1. Add or update the year entry in `data/years.json`.
2. Collect official ASHG sources and record them in that entry's source ledger.
3. Download every linked PDF, XLS, and XLSX file into `assets/sources/<year>/` and record its original URL, byte size, and SHA-256 checksum in that folder's `manifest.json`.
4. Create `data/<year>/signals.json` using the same schema as the 2026 dataset. Prefer repository copies for file links while preserving the official URL in the archive manifest.
5. Set the entry's `status` to `published` and add its `data` path, scale metrics, readout, and sources.
6. Run the local server and verify the year selector, filters, archived files, links, mobile layout, and source provenance before publishing.

Never copy scale metrics or interpretations across years without year-specific evidence.

## Source-file preservation

Official web pages can move or disappear. Every PDF/XLS/XLSX used by the dashboard must therefore be committed under `assets/sources/<year>/` before publication. The archive keeps both a repository copy and the original ASHG URL, plus a checksum that detects corruption or silent replacement.

To verify an existing archive or restore missing files from their recorded original URLs:

```bash
python3 scripts/archive_sources.py 2026
```

Use `--refresh` only when intentionally capturing a new upstream revision; review and commit the resulting checksum change. The 2026 archive inventory is documented in [`assets/sources/2026/README.md`](assets/sources/2026/README.md). No XLS or XLSX files were discovered in the reviewed 2026 source pages as of the archived retrieval time.

## Methodology

This is a curated intelligence layer, not a complete program index or bibliometric analysis. “Signal” and “priority” labels are CABS editorial judgments. Meeting facts and session evidence are sourced from official ASHG materials; interpretation is visibly separated from evidence.

## Sources

- [Archived ASHG 2026 Program at a Glance](assets/sources/2026/ASHG-2026-Program-at-a-Glance.pdf)
- [Archived CE-Eligible GenomeCast Sessions](assets/sources/2026/ASHG-2026-CE-Eligible-Sessions-GenomeCast.pdf)
- [Archived Annual Meeting Learner Notification](assets/sources/2026/ASHG-2026-Learner-Notification.pdf)
- [ASHG 2026 GenomeCast schedule](https://ashgmeeting.ashg.org/attend/genomecast/)
- [ASHG 2026 meeting page](https://www.ashg.org/annual-meeting-2026)
- [ASHG 2026 press announcement](https://www.ashg.org/publications-news/press-releases/ashg-2026-press-registration-announcement/)

## License

Content and code are available under the [MIT License](LICENSE). ASHG names and source materials belong to their respective owners. This independent CABS resource is not affiliated with or endorsed by ASHG.
