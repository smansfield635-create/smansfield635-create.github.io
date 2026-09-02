# Exploratory software bridge protocol

Four installed, externally authored packages are used as bounded systems:

- `cryptography`: Ed25519 signing and verification;
- `jsonschema`: Draft 2020-12 validation;
- `networkx`: weighted directed routing;
- `Pillow`: PNG/RGBA image identity roundtrip.

For each system, five opaque candidate relations are supplied. Three are constitutive and two are decoys. Single-relation ablations form the training evidence. Six held-out conditions test external support, decoy removal, unrelated capacity, functional substitution, restoration, and support withdrawal.

The observer infers constitutive relations only from original-challenge loss under ablation. The result is compared with output-continuity-as-identity and additive-capacity comparators.

Development execution preceded repository freeze. The result is therefore exploratory. The exact-head workflow confirms reproducibility but does not retroactively make the first run preregistered.
