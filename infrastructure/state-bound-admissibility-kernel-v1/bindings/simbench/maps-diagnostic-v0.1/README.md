# MAPS Diagnostic v0.1

This package turns the previously conceptual MAPS interface into a prospective,
deterministic secondary SimBench instrument. It is operational for frozen
BASE/PROBE records and deliberately cannot execute the parent experiment.

The four outputs are:

| Output | Meaning | Unit | Range |
|---|---|---|---|
| `E_sup` | viability-weighted safe delivery support | `1` | `[0, 1]` |
| `C_coh` | viability-weighted AC phasor agreement with BASE | `1` | `[0, 1]` |
| `H_ent` | normalized distribution entropy of support across the full PROBE registry | `1` | `[0, 1]` |
| `phi_phase` | reference-free RMS BASE voltage-phase increment | `rad` | `[0, pi]` |

`MAPS` is intentionally not expanded into a new acronym.

## AI entry commands

All supported operations use `ai_entry.py`:

```bash
python3 ai_entry.py self-test --report receipts/SELF_TEST_REPORT.json
python3 ai_entry.py compute \
  --input fixtures/valid_mixed.json \
  --output receipts/VALID_MIXED_OUTPUT.json \
  --receipt receipts/VALID_MIXED_COMPUTATION_RECEIPT.json
python3 ai_entry.py compute-batch \
  --input fixtures/example_batch.json \
  --output receipts/EXAMPLE_BATCH_OUTPUT.json \
  --receipt receipts/EXAMPLE_BATCH_COMPUTATION_RECEIPT.json
python3 ai_entry.py build-manifest --output receipts/SOURCE_MANIFEST.json
python3 ai_entry.py verify-package \
  --manifest receipts/SOURCE_MANIFEST.json \
  --report receipts/PACKAGE_VERIFICATION_RECEIPT.json
```

The calculator does not import SimBench or pandapower. The optional adapter
converts an already-solved pandapower object into the exact state record. It
does not run a solver or adjudicate physical viability.

## Scientific status

The instrument source can be complete while the parent experiment remains
unfrozen. Current parent disposition is `DO_NOT_EXECUTE`; remaining gates include
LVTG/VOER source recovery, physical viability, package/data/environment locks,
transition partitioning, custody, preregistration receipt, and canonical
repository AI-entry admission.

## Authoritative technical references

- [SimBench grids and full-year profiles](https://simbench.readthedocs.io/en/stable/networks.html)
- [SimBench profile interface](https://simbench.readthedocs.io/en/stable/profiles.html)
- [pandapower bus-result fields](https://pandapower.readthedocs.io/en/latest/elements/bus.html)
- [pandapower line-result fields](https://pandapower.readthedocs.io/en/latest/elements/line.html)
