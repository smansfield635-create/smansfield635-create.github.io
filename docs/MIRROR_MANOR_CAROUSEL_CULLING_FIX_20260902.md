# Mirror Manor carousel visibility root cause

Observed live symptom: House carousel card, caption, and action buttons render, but the Manor graphic is absent.

Deterministic cause: the canonical Manor mesh families include mixed/inward triangle winding, while the new WebGL carousel consumer enabled back-face culling. Exterior faces were therefore discarded from the outside view.

Bounded repair: disable back-face culling only in `assets/compass/compass.house-scene.js`, retaining depth testing and all canonical Phase 3 geometry/camera values. This is intentionally not a geometry rewrite.
