# H-Earth ocean recovery progress — 2026-09-26

Base: 533714a3a8e3995ed67ea07c99a56a698946c105

Superseded candidate: 5f61189148538de6e92839c9c04c4a3e07ca21fe
Reason: duplicate ocean-presentation binding declarations prevented renderer construction.

Recovered candidate: 8a2fed2f70ea2b2ef0b55df96dc4edc1c410cbd4

Proven on exact-head browser execution with ocean-presentation=v1:
- ocean presentation renderer selected
- ocean presentation requested
- continuous animation running
- animation frames advanced 12 -> 25
- render calls advanced 13 -> 26
- framebuffer presentations advanced 13 -> 26
- world rebuild count remained 0 -> 0
- visible screenshot changed without user navigation
- page errors: 0
- console errors: 0
- failed requests: 0

Relevant runs:
- historical (0,-96) operand diagnostic: 36251705045
- neutral control at 533714a3: 36252596932
- defective 5f611891 candidate: 36252858724
- repaired 8a2fed2f boot pass: 36253263302
- repaired 8a2fed2f motion extraction: 36253807467

Current issue:
The product motion evidence passed. The neutral runner still classifies the latest run as failed because stale startup-overlay timeout text overrides the already-active public runtime evidence.

Next deterministic step:
1. Repair neutral-runner readiness classification only.
2. Rerun exact 8a2fed2f with ocean-presentation=v1.
3. Require a clean green receipt with the same motion and zero-world-rebuild evidence.
4. Then materialize only the proven product delta onto a fresh branch from current main.
5. Qualify that materialized exact-head candidate before any promotion.

This file is progress history only. It does not create product, merge, deployment, publication, canonicalization, or acceptance authority.
