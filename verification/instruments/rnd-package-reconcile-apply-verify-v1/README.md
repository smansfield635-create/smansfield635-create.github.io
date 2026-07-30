# R&D Package Reconcile Apply Verify v1

Permanent, project-agnostic package application corridor. The core validates profiles and immutable packages, classifies freshness, creates plan-only receipts, applies bounded path sets sequentially, verifies readback hashes, invokes profile-selected benchmarks, and issues application receipts.

Checkpoint numbers are profile-mapped semantic labels. The universal core does not assign a global meaning to CP5 or CP6. This allows the Laws reconciliation protocol to map application to Checkpoint 5, exact-head verification to repeated Checkpoint 3, and physical acceptance to Checkpoint 6 without changing the separate bounded live-publication protocol.

The core contains no Laws paths, package IDs, object identities, object counts, benchmark assertions, or product geometry. Fixed-count instrument and model contracts live under `adapters/`; project configuration lives under `profiles/`.
