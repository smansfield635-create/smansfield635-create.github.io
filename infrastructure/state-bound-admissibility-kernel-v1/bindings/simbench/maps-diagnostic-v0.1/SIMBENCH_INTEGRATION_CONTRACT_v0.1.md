# SimBench MAPS Integration Contract v0.1

**Attachment ID:** `SIMBENCH_MAPS_SOURCE_BINDING_ATTACHMENT_v0.1`  
**Instrument:** `MAPS_DIAGNOSTIC_v0.1`  
**Parent:** `SIMBENCH_LVTG_KERNEL_INCREMENTAL_VALUE_PREREGISTRATION_v1`  
**Standing:** `READY_FOR_PARENT_SOURCE_ATTACHMENT_NOT_PARENT_FROZEN`

## 1. Attachment effect

When the package manifest and verification receipt pass and are attached by
digest, this contract can close one parent freeze-gate item:

```text
exact MAPS diagnostic definitions and SHA-256 attached
```

It cannot close any other item. In particular, it does not supply LVTG-v1.1,
VOER, physical viability, transition identity, the PROBE/CHALLENGE partition,
SimBench source identities, solver identity, model environment, outcome custody,
the parent preregistration receipt, or repository admission.

## 2. Required upstream sequence

For each time index, the upstream executor must:

1. load the frozen BASE state without CHALLENGE access;
2. run only the frozen PROBE registry under the separately frozen AC solver;
3. apply the separately frozen physical-viability law;
4. classify every PROBE as `VIABLE`, `PHYSICAL_FAILURE`, or
   `NONINTERPRETABLE_SIMULATION`;
5. preserve the complete ordered registry and issue the source receipt;
6. use `simbench_maps_adapter.py` only to extract already-solved values; and
7. invoke `ai_entry.py compute` or `compute-batch`.

MAPS must never call the solver, open an asset, select a transition, inspect a
CHALLENGE identity, or alter an upstream classification.

## 3. Adapter configuration to freeze

Before parent freeze, the source manifest must record:

```yaml
bus_indices: exact ordered in-service AC bus indices
bus_ids: exact stable string identities in the same order
phase_reference_bus_id: one frozen slack/reference bus identity
probe_ids: exact ordered PROBE transition identities
served_demand_sources: exact ordered result-table/column pairs
active_loss_sources: exact ordered result-table/column pairs
requested_demand_source: exact BASE active-demand construction
source_receipt_schema: exact upstream receipt identity and digest
```

The default adapter supplies no silent table list. Every result source must be
passed explicitly, and a missing table or column fails closed.

## 4. Feature-table binding

For each lawful row \(t\), the four numeric values become the exact MAPS lane:

```text
maps.E_sup[t]
maps.C_coh[t]
maps.H_ent[t]
maps.phi_phase[t]
```

The model-feature constructor then applies the parent protocol's predeclared
history treatment. It may not change the MAPS values, derive a replacement
component, or impute an uninterpretable row. The parent protocol must declare
whether any uninterpretable required MAPS row makes the relevant anchor or the
entire secondary analysis uninterpretable; it may not choose that rule after
outcomes are seen.

## 5. Model-arm and reveal binding

MAPS appears only in:

\[
M_D=X_H+\mathcal D_K,
\qquad
M_K=X_H+\{\mathrm{LVTG},\mathrm{VOER}\}+\mathcal D_K.
\]

No MAPS result may be displayed until the primary \(M_L\) versus \(M_H\)
receipt is frozen. The parent secondary estimands, 5% materiality law,
moving-block bootstrap, Holm-Bonferroni correction, dual-family conjunction,
and claim ceiling remain unchanged.

## 6. Freeze attachment set

The exact attachment must include:

```text
MAPS_DIAGNOSTIC_NORMATIVE_SPECIFICATION_v0.1.md
SOURCE_AUTHORITY_BINDING.json
maps_diagnostic.py
simbench_maps_adapter.py
ai_entry.py
schemas/maps_input.schema.json
schemas/maps_output.schema.json
fixtures/*
tests/*
receipts/SOURCE_MANIFEST.json
receipts/SELF_TEST_REPORT.json
receipts/PACKAGE_VERIFICATION_RECEIPT.json
```

The parent source manifest must bind the file hashes and package source-root
hash without copying experimental outcomes into the source package.

## 7. Present disposition

```text
MAPS SOURCE DEFINITION: CONSTRUCTION COMPLETE, VERIFICATION REQUIRED
MAPS CALCULATOR: OPERATIONAL ON DECLARED INPUTS
PARENT PREREGISTRATION: NOT FROZEN
PARENT EXECUTION: DO NOT EXECUTE
EMPIRICAL CLAIM: NOT ENTITLED
REPOSITORY ADOPTION: OPEN
```

