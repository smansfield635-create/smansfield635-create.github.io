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

## READY correspondence recovery closure — 2026-09-26

Status: CLOSED / PROMOTED / POST-MERGE VERIFIED

The later recovery narrowed the remaining defect away from ocean, terrain, shaders, and loader suppression. The broken boundary was the correspondence between successful first-frame presentation and publication of the existing authoritative Run 8E READY state.

Final invariant restored:
- FIRST_FRAME_DRAWN = PASS
- existing live-world readiness authority completes
- READY_PUBLISHED = PASS / run8eReady becomes observable
- arrival loader can dismiss through the existing contract
- world remains visible
- no parallel readiness system was created

CI governance repair:
- PR #5026
- merge SHA: b98b82a7b4056b58e166ab6510379b12924d4957
- narrowed unrelated Showroom Compass and historical H-Earth qualification triggers
- CP3D narrowed to its consumed H-Earth runtime/dependency surfaces
- H-Earth Experience Anchor intentionally remains broad
- H-Earth Neutral Exact Head Runner intentionally remains workflow_dispatch-only

Final READY promotion:
- PR #5027
- exact promoted candidate before squash: a2689d19888218f5c2e0bed526149e49aec0d54d
- merge SHA / current promoted recovery coordinate: e326745f227670c3c43803a76760d79cc780edd2
- changed product implementation: showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js
- durable runtime evidence and corrected Experience Anchor acceptance receipt were carried with the promotion

Final neutral exact-head proof:
- bridge carrier PR #5028, auto-closed unmerged as required
- bridge run: 36269485473
- native neutral run: 36269497811
- evidence artifact: 10914976642
- artifact digest: sha256:06eb5149ecfdff103a8cb00b206bc198626f17968c81c5dfca0c3f82ab2ae7f7
- exact checkout: a2689d19888218f5c2e0bed526149e49aec0d54d
- readinessDiagnostic: READY
- materialized: true
- routeReady: true
- READY_PUBLISHED: PASS
- page errors: 0
- console errors: 0
- failed requests: 0
- worldRebuildCount: 0
- worldRebuildStayedZero: true

Experience Anchor:
- pre-promotion exact-head gate passed after correcting the receipt to the gate-computed raw-file SHA-256
- post-merge H-Earth Experience Anchor Gate run 36269781095: success
- post-merge H-Earth Automatic Repository Registry Preflight run 36269781081: success

Known non-blocking historical assertion:
- CP3D continues to report CP3D_BINDING_BASELINE_SELECTION_CORRESPONDENCE_MISSING.
- This assertion pre-existed the final candidate and was not treated as evidence that the READY correspondence repair failed.

Post-merge note:
- compass-live-byte-verification workflow-run listener recorded a separate failure at the same main head. It is downstream of Exact Head Pages Deploy v3 and outside the H-Earth READY promotion boundary.

Resume coordinate:
- main = e326745f227670c3c43803a76760d79cc780edd2
- READY correspondence recovery is closed.
- Do not reopen ocean, terrain, shader, loader-polling, or READY-system redesign work to solve this closed defect.
- Subsequent H-Earth visual/product development should start from this promoted main coordinate and preserve the restored first-frame-to-READY invariant.

This closure record remains progress history and evidence routing. It does not independently create product, deployment, publication, canonicalization, or acceptance authority.
