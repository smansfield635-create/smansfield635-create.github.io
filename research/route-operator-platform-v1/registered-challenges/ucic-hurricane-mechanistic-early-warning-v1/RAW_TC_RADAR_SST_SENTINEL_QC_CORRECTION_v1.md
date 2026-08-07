# RAW_TC_RADAR_SST_SENTINEL_QC_CORRECTION_v1

STATUS = QC_FAILURE_IDENTIFIED

AFFECTED_EXECUTION_HEAD = `42a772525620d430bc6a980f4268f61f8ed902ab`

AFFECTED_WORKFLOW_RUN = `31190146280`

AFFECTED_TERMINAL_DISPOSITION = `RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED`

ADMISSIBILITY = QUARANTINED_NOT_TERMINAL

## Defect

The frozen BASE comparator includes `sst_ships(0h)`. The execution parser used a generic numerical cleaner that rejected values only when `abs(x) >= 9000`. The source uses an SST missing-value sentinel near `999.9`, so the affected run treated missing SST as a physical predictor.

Audit of the preserved feature artifact found, within the original 138-row primary holdout sample, 51 rows with `sst0 >= 900` (36.96%), including 20/20 primary rows in 2023 and 31/31 primary rows in 2024. The corresponding original primary calibration sample contained zero such rows.

This contaminates every model containing BASE and prevents the affected terminal disposition from being admitted as the definitive hurricane standing.

## Frozen scientific semantics preserved

The scientific protocol is unchanged. The following remain frozen:

- five raw-field mechanistic relations;
- calibration years 2004-2018;
- holdout years 2019-2024;
- RI outcome threshold of +30 kt over 24 h;
- calibration-only normalization;
- noncompensatory `C_t = min(R1_score,...,R5_score)`;
- `M_t` temporal rule;
- additive and component comparators;
- model specification;
- 2,000-replicate storm-cluster bootstrap and seed;
- terminal decision rules;
- prohibition on post-result scientific retuning.

The existing protocol already states: `missing = UNEVALUABLE for the affected model; no imputation`.

## Authorized technical correction

Apply only the following parser/QC correction:

1. For `sst_ships` only, any non-finite value or value with `abs(x) >= 900` is missing/unevaluable.
2. Do not alter the generic cleaner used for pressure or other variables, because physically valid sea-level pressure can exceed 900.
3. Do not impute missing SST.
4. Drop affected observations from models requiring BASE according to the frozen complete-case eligibility rule.
5. Add an execution assertion that no primary-model row contains `abs(sst0) >= 900`.
6. Rerun the exact frozen analysis and reapply the original terminal rules without reinterpretation.

No hypothesis, structural formula, cohort, comparator, outcome, threshold, normalization direction, bootstrap rule, or terminal rule may change as part of this correction.

## Standing until corrected rerun

`RAW_TC_RADAR_EXECUTION = COMPLETE`

`RAW_RELATION_EXTRACTION = PRESERVED`

`PRIMARY_RESULT_QC = FAILED_PENDING_TECHNICAL_CORRECTION`

`RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED = NOT_ADMISSIBLE_AS_TERMINAL_STANDING`

`POST_RESULT_SCIENTIFIC_RETUNING = PROHIBITED`

`TECHNICAL_SENTINEL_CORRECTION = AUTHORIZED_WITH_PROTOCOL_SEMANTICS_UNCHANGED`
