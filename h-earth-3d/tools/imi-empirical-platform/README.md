# IMI Empirical Platform v1

Status: `1.0.0-preofficial`.

This module promotes the scratch prototype into the active H-Earth tool base. It pairs the Intrinsic Maneuverability Index instrument with an empirical portfolio receipt system, so every study run produces both the calculations and a durable study record.

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

For every study run, the engine produces a study receipt and a portfolio registry entry.

## Boundary

This module does not certify any route, dataset, empirical result, production release, public release, or final IMI scale. It is a repository-integrated preofficial empirical tool for continued IMI study construction.

## Validation runner

Run from the repository root:

```bash
node h-earth-3d/validation/imi-empirical-platform/imi.empirical-platform.runner.mjs
```

Expected fixture behavior:

- total cases: 4
- valid cases: 3
- unevaluable cases: 1
- hard-collapse cases: 1
- portfolio study count: 1
