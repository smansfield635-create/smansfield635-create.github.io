# Geodiametrics — REPLICATION

## Purpose
Define how independent observers can replicate the structure, signals, and conclusions
without access to private data or execution privileges.

Replication here means **structural equivalence**, not identical outcomes.

---

## What Can Be Replicated

### Site Structure
- Surface separation (Orientation, Control, Reference, Artifacts, Problem, Execution)
- Read-only Control surface
- Static, inspectable assets
- Versioned documentation

### Public Signals
- Metrics exposed via public JSON files
- OSF-linked canonical records
- Manual update cadence and timestamps

### Interaction Layer
- Device-local analytics capture
- Local what-if simulations
- No cross-user aggregation

---

## What Cannot Be Replicated

- Private observations
- Operator judgment
- Manual curation choices
- External traffic sources

Replication does not require identity matching or outcome matching.

---

## Replication Steps (High Level)

1. Fork the repository
2. Preserve surface boundaries
3. Host on static infrastructure
4. Replace metrics JSON with local observations
5. Link to canonical records
6. Compare structure and behavior

---

## Validation Criteria

A replication is valid if:
- Surfaces enforce the same constraints
- Control remains read-only
- Metrics are inspectable
- Canonical anchors are external
- No hidden execution exists

---

## Failure Modes

Replication fails if:
- Execution is enabled without disclosure
- Metrics mutate automatically
- Private data is introduced
- Interpretation is enforced

---

## Status
Layer 6 replication protocol established.
