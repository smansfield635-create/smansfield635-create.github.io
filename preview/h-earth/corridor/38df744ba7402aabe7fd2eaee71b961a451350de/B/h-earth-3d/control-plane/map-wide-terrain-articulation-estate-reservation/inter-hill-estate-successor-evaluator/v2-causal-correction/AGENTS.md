# V2 causal correction evaluator

This directory is an additive, nonproduct causal-instrumentation successor to the frozen V1 evaluator.

Mandatory rules:

- Preserve every V1 source and analytical output unchanged.
- A zero passing-arrangement count is never terrain or estate infeasibility by itself.
- Keep generation failure, constraint rejection, measurement failure, terrain infeasibility, and estate infeasibility distinct.
- Emit deterministic machine-readable causal traces for every rejected candidate.
- Assert terrain or estate infeasibility only through the exact exhaustive proof rules in `causal-rules.v2.json`.
- Unknown, missing, or incomplete evidence is `UNEVALUABLE`; it is never silently converted to infeasibility.
- The exact path boundary is the 13 additive paths in `changed-path-manifest.v1.json`.
- Product, terrain, live environment, camera, navigation, water, placement, manor, V1 evaluator, ledger, and lock-manager mutation are prohibited.
- Role 1 has no merge or lock-closure authority.
