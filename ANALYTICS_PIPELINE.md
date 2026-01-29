# Geodiametrics — ANALYTICS PIPELINE (Layer 6)

> Scope: Define how gauges become authoritative without violating constraints.

This document specifies **collection, aggregation, and publication rules**.
It does not implement tooling.

---

## Pipeline Stages

### 1) Capture (Local)
- Device-local capture (views, clicks, time)
- Stored in localStorage
- No identity, no cross-device stitching
- Purpose: intuition + spot checks

Artifacts:
- /assets/capture.js
- /capture/index.html

---

### 2) Snapshot (Manual)
- Local snapshot exported as JSON
- Operator reviews and pastes into public feed

Artifacts:
- /assets/site_metrics.json

---

### 3) Publish (Public Gauge)
- Control reads public JSON feeds
- Read-only rendering
- No mutation on read

Artifacts:
- /control/index.html
- /assets/site_metrics.json
- /assets/osf_metrics.json

---

## OSF Metrics

- Source of truth: OSF dashboards
- Method: manual transcription into JSON
- Cadence: as observed
- No scraping, no automation implied

Artifacts:
- /assets/osf_metrics.json

---

## Attribution Rules

- Source labels are descriptive, not inferred
- Allowed labels:
  - Direct
  - OSF
  - GitHub
  - Other
- No retroactive reassignment

---

## Integrity Constraints

- No hidden aggregation
- No silent normalization
- No inferred intent
- All public numbers traceable to a file

---

## Versioning

- Any metrics change requires:
  - timestamp update
  - version bump (minor)
  - changelog entry

---

## Status

Layer 6 defined.
Implementation optional.
