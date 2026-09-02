# Mirror Manor carousel culling correction

Root cause: the canonical Manor mesh contains mixed/inward triangle winding while the carousel WebGL consumer enabled back-face culling. Exterior-facing Manor surfaces were therefore removed by the GPU despite the carousel card, caption, and controls remaining functional.

Correction boundary:
- geometry unchanged
- camera unchanged (`distance = 94`)
- principal span unchanged (`27`)
- Phase 3 asset authority unchanged
- depth testing retained
- back-face culling disabled only in the carousel House consumer
- renderer declares `houseCullPolicy = two-sided-mixed-winding`

Expected result: the canonical Phase 3 estate becomes visible in the existing House carousel viewport without altering carousel interaction or architectural geometry.
