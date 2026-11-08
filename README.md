# ASHG Intelligence Dashboard

A public, source-grounded intelligence dashboard that translates the ASHG 2026 Annual Meeting program into decision-ready signals for CABS members and biotech leaders.

## Features

- 12 curated scientific, translational, clinical, and policy signals
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

## Data model

Dashboard content lives in [`data/signals.json`](data/signals.json). Each record contains source evidence, an editorial implication, a suggested action, program metadata, and a primary-source URL.

## Methodology

This is a curated intelligence layer, not a complete program index or bibliometric analysis. “Signal” and “priority” labels are CABS editorial judgments. Meeting facts and session evidence are sourced from official ASHG materials; interpretation is visibly separated from evidence.

## Sources

- [ASHG 2026 Program at a Glance](https://www.ashg.org/wp-content/uploads/2026/10/2026-ASHG-Program-at-a-Glance.pdf)
- [ASHG 2026 GenomeCast schedule](https://ashgmeeting.ashg.org/attend/genomecast/)
- [ASHG 2026 meeting page](https://www.ashg.org/annual-meeting-2026)
- [ASHG 2026 press announcement](https://www.ashg.org/publications-news/press-releases/ashg-2026-press-registration-announcement/)

## License

Content and code are available under the [MIT License](LICENSE). ASHG names and source materials belong to their respective owners. This independent CABS resource is not affiliated with or endorsed by ASHG.
