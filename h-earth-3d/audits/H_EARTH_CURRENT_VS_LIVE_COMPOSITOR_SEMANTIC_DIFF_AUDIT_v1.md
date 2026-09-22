# H-Earth Current vs Live Compositor Semantic Diff Audit v1

Status: FROZEN READ-ONLY
Disposition: ONE PRESENTATION-RELEVANT SEMANTIC DIFFERENCE FOUND; ONE FORMAT-ONLY DIFFERENCE FOUND.

## Compared authorities

Current public compositor:
`showroom/globe/h-earth/compositor.js`
blob: `ae69d5a26604a7bd12a685c283211afe61b46dbd`

Preserved live-snapshot compositor:
`h-earth-live-6d18e158/showroom/globe/h-earth/compositor.js`
blob: `3764f0d53b0564de7a5e983bd339dda75017bc82`

Comparison base:
`d0dddd9c7dbe183033e8eb2c892bcd6f711c0543`

## Deterministic line comparison

Live length: 9028 lines.
Current length: 9038 lines.
Identical prefix: 944 lines.
Identical suffix: 6251 lines.

A line-level LCS comparison found only two change hunks.

### Hunk 1 — formatting only

Inside `strictSnapshot()`, the closing `};` for the accessor-property rejection branch changed indentation only.

Live:
`      };`

Current:
`        };`

Classification:
FORMAT_ONLY.
No execution or presentation semantics change.

### Hunk 2 — semantic camera-target change

Function:
`clampTarget(target)`

Preserved live behavior fixes the Y component to:
`GROUND_OBSERVER_EYE_HEIGHT`

Current behavior instead preserves the caller-provided `target.y`, bounded by the intersection of `TARGET_BOUNDS` and `POSITION_BOUNDS`.

Live:
```js
GROUND_OBSERVER_EYE_HEIGHT,
```

Current:
```js
clamp(
  target.y,
  Math.max(
    TARGET_BOUNDS.yMin,
    POSITION_BOUNDS.yMin
  ),
  Math.min(
    TARGET_BOUNDS.yMax,
    POSITION_BOUNDS.yMax
  )
),
```

Classification:
CAMERA_GEOMETRY / VIEW_ORIENTATION SEMANTICS.

This does not alter renderer bytes, terrain geometry, materials, DOM/CSS materialization code, or source geography. It changes the compositor's normalized vertical camera target and can therefore change the view ray / pitch relationship and visible framing when a non-live-equivalent target.y enters the compositor.

## Semantic classification matrix

- Renderer implementation: IDENTICAL / NOT A DIFFERENCE.
- Terrain/source geometry: NOT CHANGED BY THIS DIFF.
- Materialization: NOT CHANGED BY THIS DIFF.
- Layer ordering: NOT CHANGED BY THIS DIFF.
- Lighting/shading inputs: NO DIRECT DIFFERENCE FOUND.
- View/camera geometry: DIFFERENT.
- Formatting: ONE NON-SEMANTIC DIFFERENCE.

## Deterministic conclusion

The compositor divergence is extremely narrow. The current compositor is not a wholesale replacement of the live presentation compositor.

There is exactly one identified execution-semantic difference: live forces `clampTarget().y` to the fixed ground-observer eye height; current admits a bounded variable `target.y`.

That difference is presentation-relevant because it can alter camera orientation/framing, but this audit does not claim that it alone explains the previously observed flat/cartoon R3C screenshots. Those screenshots remain invalid public-route parity evidence because they were produced through a different renderer corridor.

## Required next gate

Construct an exact-SHA public-route preview using the current public corridor and test two compositor states under otherwise identical bytes:

A. current `clampTarget()` behavior;
B. preserved-live `GROUND_OBSERVER_EYE_HEIGHT` behavior.

The public `renderer.js` must remain byte-identical and protected.

Matched physical inspection must determine whether the camera-target difference is visibly material. No terrain morphology or renderer redesign is authorized before this gate.

## Protection

- READ-ONLY audit only.
- No production mutation authorized.
- No renderer mutation authorized.
- No claim that current compositor is visually inferior is established without same-corridor inspection.
