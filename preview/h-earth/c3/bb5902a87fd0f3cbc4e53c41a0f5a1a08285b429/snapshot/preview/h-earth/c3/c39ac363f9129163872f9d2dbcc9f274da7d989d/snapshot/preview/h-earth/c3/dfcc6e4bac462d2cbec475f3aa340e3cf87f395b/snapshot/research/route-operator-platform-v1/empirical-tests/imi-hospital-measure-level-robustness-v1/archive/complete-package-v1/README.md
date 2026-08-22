# HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B — Complete Archive Package v1

This package closes the previously incomplete Extension 1B archive as far as the available evidence permits.

## Included

- Recovered controlling test report.
- Exact recovered primary-route summary table.
- Recovered-core sensitivity table.
- Route profile and source identity receipt.
- Executable standard-library reconstruction script.
- Resolved additive-comparator and collapse-tier receipt.
- File Library custody pointers for the original full outputs.
- SHA-256 manifest and ZIP carrier.

## Resolved questions

`ADDITIVE_COMPARATOR_FORMULA = (MORT_nonworse + SAFETY_nonworse) / (MORT_comparable + SAFETY_comparable)`

`COLLAPSE_CASE_COVERAGE_TIER = ANY_COMPARABLE_ONLY`

The three hard-collapse cases were not numeric at 50%, 75%, or complete coverage.

## Reproduce

Place the exact source file beside the script and run:

```bash
python run_hospital_measure_level_imi_extension_1b.py Complications_and_Deaths-Hospital.csv --out reproduced_outputs
```

The script rejects a source whose SHA-256 differs from `0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5` unless `--skip-hash-check` is explicitly supplied.

## Custody boundary

The original full `IMI_Hospital_Level_Results.csv` and original full `IMI_Hospital_Sensitivity_Results.csv` remain preserved in ChatGPT File Library. The Drive package contains their identity pointers and an executable capable of reconstructing them from the exact source. The recovered-core CSVs are not represented as byte-identical replacements for the original output files.
