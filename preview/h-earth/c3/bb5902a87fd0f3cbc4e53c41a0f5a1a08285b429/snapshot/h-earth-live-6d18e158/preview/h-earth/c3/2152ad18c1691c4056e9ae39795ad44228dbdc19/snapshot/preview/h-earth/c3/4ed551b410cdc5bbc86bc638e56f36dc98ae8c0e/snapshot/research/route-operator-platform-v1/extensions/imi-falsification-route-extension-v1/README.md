# IMI Falsification Route Extension v1

This repository directory binds the separately versioned `IMI_FALSIFICATION_ROUTE_EXTENSION_v1` package to the frozen `IMI_OBSERVER_GRADE_INSTRUMENT_v1` authority.

## Authority boundary

- The frozen IMI core calculates the admitted system state and emits the immutable core receipt.
- The extension consumes that receipt, freezes a discriminating prediction, validates event and outcome custody, compares preregistered competitors, and emits a claim-scoped theory disposition.
- The extension does not modify the core package, reference scorer, snapshot schema, factor definitions, normalization rules, or output schema.

## Operational state

The packaged reference implementation is `PASS_CLOSED` and `ACTIVE_READY_FOR_FIRST_FROZEN_PILOT`. Its verifier executed 52 checks: 19 fail-closed negative fixtures, one prospective positive fixture, nine schemas, package checksums, manifest integrity, core nonmutation, and command-line execution.

`REAL_OUTCOME_ADJUDICATION` remains `HELD`. Operational readiness means the extension can now classify cases, freeze an exact prediction contract, and adjudicate a separately authorized pilot. It does not mean that the scientific theory has already survived or failed a real severe test.

## Custody

The complete 21-file package is stored in the same Drive-backed instrument folder as the frozen core. `EXTENSION_PACKAGE_POINTER.json` records the exact Drive identity, archive SHA-256, size, core dependency, and operational state. `RATIFICATION_POINTER.json` records the bounded verification and ratification result.

Run the repository pointer verifier from the repository root:

```bash
python research/route-operator-platform-v1/extensions/imi-falsification-route-extension-v1/verify_extension_pointer_v1.py
```

After downloading and extracting the package, run its complete verifier from the extracted extension directory:

```bash
python verify_extension_v1.py --package-dir .
```
