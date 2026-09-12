# RTS24 Gen428 Source Binding Search Log

**Status:** `BOUNDED_RECOVERY_EXECUTED / SOURCE_BINDING_INCOMPLETE`  
**Date:** `2026-09-04`

This log enforces the repository retrieval budget and prevents repeated evidence-free searches.

## Retrieval budget applied

Repository AI-entry law permits at most two equivalent probes for the same missing object, requires a strategy change after the first failed retrieval, and prohibits same-probe repetition without new evidence.

### Probe family A — direct default-branch code retrieval

1. Exact phrase probe: `659 RTS24 states` -> no indexed repository result.
2. Broader object probe: `RTS24` -> no indexed repository result.

Disposition:

`DEFAULT_BRANCH_CODE_SEARCH = NO_NEW_EVIDENCE_DO_NOT_REPEAT`

No additional synonym search against default-branch code is authorized unless a new path/ref/identifier is recovered.

### Probe family B — exact repository-history/source lineage

Historical maneuverability branches were inspected as a changed strategy rather than another synonym search.

Recovered examples include:

- `research/grid-stressed-maneuverability-replication-v1`
- `research/grid-exact-maneuverability-execution-v1`

Those branches preserve earlier grid-maneuverability protocols/runners, but their inspected protocol uses IEEE 14/30/39/57/118 benchmark systems rather than RTS24. They are donor/provenance context only and are not Gen428 execution authority.

Disposition:

`HISTORICAL_GRID_BRANCHES = NOT_GEN428_SOURCE_BINDING`

### False-lead rejection — issues 2687–2690

The neighboring-room search path through issues 2687–2690 was checked. The inspected issues are Compass/cinematic publication or cinematic-intake carriers, not RTS24 scientific execution carriers.

Disposition:

`ISSUES_2687_2690_AS_RTS24_SOURCE = REJECTED_FALSE_LEAD`

Do not repeat that issue-number path for Gen428.

## External durable artifact discovered

File Library contains `lvtg-pair-vectors.v1.csv`, a 119-pair artifact with state-pair identifiers, cluster labels, five LVTG component values on each side, component differences, `discord`, and `maxdiff` fields.

This is material evidence of a prior pair-construction stage, but it is **not yet bound as the final Gen426/Gen428 executable artifact**. Its rows include both `discord=False` exact-equality pairs and `discord=True` nonzero-difference pairs. That conflicts with the separately preserved prior Gen426 terminal description of an equivalence-corrected 119-pair population with zero LVTG discordance.

Disposition:

`LVTG_PAIR_VECTORS_V1 = DISCOVERED_PROVENANCE_UNRESOLVED`

It may be used as a provenance lead only until its generating receipt/manifest or exact lineage is recovered.

## Exact frozen objects still unresolved

1. deterministic recipe that generates the 659 RTS24 states;
2. frozen physical-equivalence quotient definition;
3. frozen X8 representation implementation/source identity;
4. frozen deterministic nearest-state matcher and tie-breaking rules;
5. frozen support-gate implementation;
6. exact RTS24 source-data and solver/environment identity;
7. exact Gen427/Gen428 preregistration/receipt proving the nearest-state successor was frozen before outcome exposure.

## Scientific custody consequence

`Y_ACCESS = PROHIBITED`

`PAIR_SEAL_EXECUTION = PROHIBITED`

No scientific outcome may be computed from an inferred or reconstructed contract.

## Next lawful action

`RECOVER_PROVENANCE_FROM_PRIOR_EXECUTION_ARTIFACTS_OR_COMPANION_MANIFESTS`

The next retrieval must use a genuinely new evidence source—such as companion File Library artifacts, a named prior execution packet, or an exact historical ref recovered from provenance—not another broad GitHub search.