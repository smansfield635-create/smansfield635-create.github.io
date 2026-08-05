# IMI Empirical Platform v1

Status: `1.0.0-preofficial`.

This module promotes the scratch prototype into the active H-Earth tool base. It pairs the Intrinsic Maneuverability Index instrument with an empirical portfolio receipt system, so every formal study run can produce both calculations and a durable study record.

## Operational meaning

This is not a live website claim. Operational here means repository-branch empirical operation:

1. a route file is explicitly selected;
2. a dataset row file is explicitly selected;
3. the repository-based IMI engine runs the route;
4. case-level IMI outputs are generated;
5. a study receipt is generated;
6. a portfolio registry entry is appended;
7. the generated output files are written to an output directory.

Main-branch merger, production release, public release, final IMI scale admission, route certification, and real empirical validation remain separate gates.

## Purpose

The platform supports route-specific IMI studies across domains. A route defines a trajectory, the required factors for that trajectory, the normalizers for those factors, missingness rules, terminal-lock handling, and the comparator fields used for empirical review.

## Core outputs

For every case, the engine can produce:

- `IMI`: multiplicative trajectory maneuverability.
- `CS`: constraint severity, defined as `1 - IMI`.
- `WMI`: weakest maneuverability factor.
- `additiveMean`: comparator score.
- `imiGeometricMean`: factor-count comparability comparator.
- `hardCollapse`: true when a required availability factor equals zero.
- `ordinalLevel`: exploratory IMI level assignment.
- `UNEVALUABLE`: returned when a required factor is missing or invalid.

For every repository intake run, the engine produces a study receipt, case-level output, and a portfolio registry entry.

## Generic empirical intake runner

Run from the repository root:

```bash
node h-earth-3d/validation/imi-empirical-platform/imi.empirical-intake.runner.mjs \
  --route h-earth-3d/tools/imi-empirical-platform/routes/example-hospital-route.v1.json \
  --rows h-earth-3d/tools/imi-empirical-platform/examples/example-hospital-rows.v1.json \
  --output-dir /tmp/imi-empirical-intake \
  --strict
```

The intake runner writes:

- `imi-study-run-output.v1.json`
- `imi-study-receipt.v1.json`
- `imi-case-results.v1.json`
- `imi-portfolio-registry.v1.json`
- `imi-portfolio-summary.v1.json`
- `imi-empirical-intake-operational-receipt.v1.json`

Optional inputs:

- `--study-meta <json>`
- `--dataset-meta <json>`
- `--portfolio-in <json>`
- `--clock <iso-date>`

## Existing-study backfill runner

The repository also contains a legacy backfill manifest for the already executed IMI empirical studies:

- hospital measure-level robustness;
- spontaneous speech/language structure;
- agricultural colony resilience;
- sovereign debt-service schedule dispersion.

The backfill runner converts preserved study reports and derived outputs into repository-produced receipts and a portfolio registry entry:

```bash
node h-earth-3d/validation/imi-empirical-platform/imi.existing-studies-backfill.runner.mjs \
  --output-dir /tmp/imi-existing-studies
```

This is not a raw-data rerun unless the historical source rows are later placed in the branch and explicitly rerun through the generic intake runner.

## Fixture and operational validation runners

Run from the repository root:

```bash
node h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs
node h-earth-3d/validation/imi-empirical-platform/imi.empirical-operational-suite.runner.mjs \
  --output-dir /tmp/imi-operational-suite
```

Expected fixture behavior:

- total cases: 4
- valid cases: 3
- unevaluable cases: 1
- hard-collapse cases: 1
- portfolio study count: 1

Expected existing-study backfill behavior:

- imported studies: 4
- imported domains: healthcare, speech/language, agricultural colony resilience, sovereign debt-service finance
- raw historical rerun: false
- derived output available: true for the preserved studies

## Boundary

This module does not certify any route, dataset, empirical result, production release, public release, or final IMI scale. It is a repository-integrated preofficial empirical tool for continued IMI study construction.
