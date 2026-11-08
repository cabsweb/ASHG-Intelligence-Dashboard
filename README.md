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
3. Create `data/<year>/signals.json` using the same schema as the 2026 dataset.
4. Set the entry's `status` to `published` and add its `data` path, scale metrics, readout, and sources.
5. Run the local server and verify the year selector, filters, links, mobile layout, and source provenance before publishing.

Never copy scale metrics or interpretations across years without year-specific evidence.

## Methodology

This is a curated intelligence layer, not a complete program index or bibliometric analysis. “Signal” and “priority” labels are CABS editorial judgments. Meeting facts and session evidence are sourced from official ASHG materials; interpretation is visibly separated from evidence.

## Sources

- [ASHG 2026 Program at a Glance](https://www.ashg.org/wp-content/uploads/2026/10/2026-ASHG-Program-at-a-Glance.pdf)
- [ASHG 2026 GenomeCast schedule](https://ashgmeeting.ashg.org/attend/genomecast/)
- [ASHG 2026 meeting page](https://www.ashg.org/annual-meeting-2026)
- [ASHG 2026 press announcement](https://www.ashg.org/publications-news/press-releases/ashg-2026-press-registration-announcement/)

## License

Content and code are available under the [MIT License](LICENSE). ASHG names and source materials belong to their respective owners. This independent CABS resource is not affiliated with or endorsed by ASHG.
