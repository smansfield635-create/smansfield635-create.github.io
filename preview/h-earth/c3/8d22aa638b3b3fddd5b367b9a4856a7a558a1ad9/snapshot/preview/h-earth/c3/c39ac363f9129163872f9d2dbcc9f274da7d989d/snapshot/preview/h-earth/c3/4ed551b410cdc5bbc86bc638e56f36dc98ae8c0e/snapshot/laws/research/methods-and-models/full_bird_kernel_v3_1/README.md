# Full Bird Kernel v3.1 — Canonical Executable Reference

```text
STATUS = CANONICAL_EXECUTABLE_REFERENCE_CANDIDATE
PREDECESSOR = FULL_BIRD_KERNEL_COMPUTABLE_MAPS_CYCLE_v3_CONTROL_LAYER_COMPLETE
KERNEL_VERSION = 3.1.0
RUNTIME = PYTHON_STANDARD_LIBRARY_ONLY
EMPIRICAL_VALIDATION = NOT_CLAIMED
DOMAIN_VALIDATION = NOT_CLAIMED
AUTONOMOUS_SEMANTIC_DERIVATION = NOT_CLAIMED
```

## Authority

This package converts the v3 control-layer specification into an executable, deterministic reference. It preserves the v3 separation between numeric admissibility, semantic and governance authority, forward-route authority, and lifecycle/final-claim authority.

The package is canonical for executable behavior only after repository review and merge. It does not convert externally supplied semantic facts into autonomous machine judgments and does not create empirical or cross-domain validation.

## Included artifacts

- `fbk_v3_1.py` — standard-library reference engine;
- `test_fbk_v3_1.py` — executable conformance suite;
- `requirements_registry.json` — numbered normative requirements;
- `claim_manifest.json` — machine-readable claim boundaries;
- `schemas.json` — structural schemas and enumerations;
- `fixtures/conformance.json` — fixture catalog and expected dispositions;
- GitHub Actions workflow — executes the conformance suite on every relevant change.

## Canonical behavior

The reference engine validates all fifteen governance predicates; validates semantic adjudication receipts; computes `HFgov`, `HFdisp`, `HFv3`, `Av3`, the ordered disposition, and `F`; emits deterministic hashed edge records; blocks missing, duplicated, mismatched, unverified, false, or tampered receipts; preserves nonpass history requirements; blocks rejected histories from closure; tests closure-suffix eligibility; and enforces the non-skippable lifecycle:

```text
EXECUTING
→ GLOCK_QUALIFIED
→ PROVISIONALLY_SEALED
→ HOME_RETURN_VERIFIED
→ FINAL_CLOSED
```

## Run locally

From this directory:

```bash
python -m unittest -v test_fbk_v3_1.py
```

No third-party dependencies are required.

## Canonical serialization

Records use UTF-8 JSON with sorted keys, compact separators, Unicode preservation, no NaN values, and SHA-256 hashing. A record hash is computed before the hash field is inserted. Any later mutation causes correspondence failure.

## Current conformance result

The initial suite contains thirteen passing tests covering forward passage, all nonpass dispositions, missing and tampered receipts, lifecycle ordering, claim authority, closure admission, and rejection-history blocking.

## Remaining work

This executable reference is not yet an externally reviewed formal proof. Open obligations include independent mathematical review, threshold calibration, issuer trust and cryptographic signature policy, second-team replication, empirical calibration, and domain-specific validation.
