# H-Earth C2-R1 IMI V4 reconciliation gate correction — successor 1.0.1

Status: `BOUNDED_RECONCILIATION_GATE_CORRECTION_SUCCESSOR_COMPLETE`

This nonproduct record publishes the bounded correction authorized by operation `H_EARTH_C2_R1_IMI_V4_RECONCILIATION_GATE_LOGIC_CORRECTION_001`.

The correction preserves all V4 factors, formulas, thresholds, state precedence, observer receipts, observer kits, evidence, and product bytes. It changes only reconciliation and downstream gate logic so that observer agreement cannot open Role 5 while an unresolved controlling defect remains.

## Corrected current case

- Observer agreement gate: `PASS_CLOSED`
- Third observer required: `FALSE`
- IMI: `0.8`
- Unobstructed fraction: `0.6959409401844713`
- Controlling factor: `INLAND_ANCHOR_OCCLUSION_CLEARANCE`
- Controlling factor value: `0.8`
- Unresolved controlling defect: `TRUE`
- Reconciliation result: `VALID_CONCORDANT_CONTROLLING_DEFECT`
- Reconciliation receipt freezable: `TRUE`
- Role 5 gate: `HOLD`

## Custody

- Source package SHA-256: `5193b73129d75ce167ec62ba89115f916ffbcb7b837f0935ef828b2d62d2f6d0`
- Successor package SHA-256: `e206ba9999b743525825e3601daabb1c77d6346c77144d462e44f2b5ccf4fe2c`
- Successor size: `14831861` bytes
- Successor file count: `44`
- Package manifest SHA-256: `542b882eb51e6b30cba5266cf5e8781c3585df52292e74e7adf29b7d00621e7b`
- Drive folder: `1bkoI2lHPu-kWV0-KNeXLjPmGuS0Q6ye8`
- Drive master file: `1boVLcZaApCrjTOtnAjVy52-1_DVVrKot`
- Fetchback validation: `PASS`

## Scope

PR #512 remains draft and unmerged. No product, Role 3, observer, V4 scoring, Role 5 execution, or user-differential surface is changed or activated. The next authority is `ROLE_4_PROJECT_GOVERNANCE_AND_CROSS_ROOM_COORDINATION_AUTHORITY`.
