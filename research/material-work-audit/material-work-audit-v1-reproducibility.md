# Material-work audit v1 reproducibility result

## Disposition

**REPRODUCIBILITY_FAIL_CLOSED**

The independent v1 pass completed **906/906** rows and was frozen at commit `bebb401aa0d2486f7c0d67504c1413efb356f131` before any v0 inspection. After that freeze, the repository record was unblinded. Issue #2052 preserves the v0 aggregate totals but explicitly identifies persistence of the per-PR dataset as remaining work; no durable 906-row v0 classification record exists in the audit directory or issue record. Therefore row-paired agreement must not be fabricated.

## v1 result

| Class | v1 | v0 aggregate | Delta |
|---|---:|---:|---:|
| PARAMOUNT | 16 | 143 | -127 |
| STANDARD | 623 | 253 | +370 |
| SUPPORT | 267 | 510 | -243 |
| Material | 639 | 396 | +243 |
| Total | 906 | 906 | 0 |

## Reproducibility thresholds

The frozen targets were 90% exact three-class agreement and 85% PARAMOUNT/non-PARAMOUNT agreement. Exact paired values are unavailable because v0 row identities were never persisted. Marginal totals still impose rigorous bounds:

- exact three-class agreement can be at most **59.16%** and at least **0.00%**; threshold status: **FAIL_CLOSED_FROM_MARGINAL_UPPER_BOUND**;
- PARAMOUNT/non-PARAMOUNT agreement can be at most **85.98%** and at least **82.45%**; threshold status: **UNEVALUABLE_PAIRING_MISSING**.

If an upper bound is below its frozen target, that criterion fails regardless of the missing pairing. Otherwise that criterion remains unevaluable until a genuine historical row-level v0 record is recovered. The disagreement ledger deliberately records every row as `UNRECOVERABLE_ROW_LEVEL_V0`; it does not reverse-engineer labels from aggregate counts.

## Equal-window v1 recomputation

- Pre-transition 2026-07-25..2026-08-03: 4 PARAMOUNT + 193 STANDARD + 41 SUPPORT = 238; material 197 (19.7/day).
- Installation 2026-08-04..2026-08-13: 3 PARAMOUNT + 130 STANDARD + 74 SUPPORT = 207; material 133 (13.3/day).
- Mature 2026-08-15..2026-08-24: 7 PARAMOUNT + 257 STANDARD + 134 SUPPORT = 398; material 264 (26.4/day).

Installation vs pre material-rate change under v1: **-32.49%**. Mature vs pre: **34.01%**. These are repository-description/diff-derived Layer-A results; they do not establish causal productivity or operator-attention efficiency.

## Methodological consequence

The experiment successfully produced an independent, repository-evidence-based v1 ledger. The reproducibility comparison is constrained by a v0 evidence-custody failure: the first audit preserved aggregate totals but not the row-level labels needed for inter-pass pairing. This is itself a reproducibility finding and must remain visible rather than being repaired by inference.

The accidental placeholder ancestry event `cab6c3d31f200d79f66fc82878a44ed020cee9c3` followed by removal at `52915a8082255a319670b744eeae15e86fe7b049` remains recorded; net audit artifact content was unchanged.

## Claim ceiling

No world-record, causal-productivity, or externally benchmarked operator-efficiency claim is authorized by this audit.
