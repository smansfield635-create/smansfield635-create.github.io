# Geometry Kernel passage consumer v1

Opt-in engineering reference consumer of the frozen sweep in draft PR #6404. It creates a West-admitted closed convex straight prism, exposes copied inward-facing GPU buffers and conservatively certifies sphere moves against private supporting planes.

Supported geometry: exactly two finite centerline stations, constant positive scales and a convex CCW profile. Certificates cover linear translation of a finite-radius sphere inside the finite passage, including end planes. Contact and numerically ambiguous clearances are held. Bent passages, varying sections, capsules, rotation and arbitrary mesh intersection are unsupported.

40 Node tests pass: 17 consumer tests and 23 sweep regressions, including 450 independently derived rectangular-clearance comparisons. Independent Soren source review and execution pass. Adjacent JSON records preserve hashes and admission.

GPU qualification remains held: Playwright Chromium is absent; the standard installation attempt received an invalid ZIP archive. The targeted WebGL script was not executed. It uploads real buffers, enables back-face culling and checks an outward-winding negative control. Physical device, performance and visual quality acceptance are absent.

Run component checks:

```sh
node --test h-earth-3d/validation/geometry-kernel-passage-consumer.v1.test.mjs h-earth-3d/validation/geometry-kernel-sweep.v1.test.mjs
```

The next checkpoint, on a host with Playwright Chromium available, is:

```sh
node h-earth-3d/validation/geometry-kernel-passage-consumer.webgl.v1.mjs
```

Execute the unchanged script at the saved candidate head. Product adoption requires a separately bounded scope. No live H-Earth, geological candidate PR #6345, navigation or Laws consumer files are changed.
