# H-Earth Terrain-Supported R3A Camera Reconciliation Successor Contract v1

Operation: `H_EARTH_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_SUCCESSOR_20260819_001`

Protected parent: `579820ddeea71362a3b2087e8aec38ee5eb0baab`.

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.

Owner/browser failure evidence: `23893.mp4`, SHA-256 `542142acd58c4764d7711466caef67892861d67a9900d49d37da9ba5f0f1920c`.

## Causal failure

Generation 324 proved terrain-supported locomotion inside `functional-landscape/navigation.js`, but the live Run 8E presentation chain subsequently called `reconcileHEarthRun8ER3APresentationState()` and replaced the supported camera Y with `Run8B terrain elevation + 2.25` before the GPU frame packet was built. The machine proof therefore stopped upstream of the actual presentation failure.

The required chain is now:

`input -> navigation terrain support -> R3A reconciliation -> frame uniform packet -> GPU camera`

The downstream presentation layer may preserve or raise a lawful supported Y for an independent safety floor. It may never lower or replace that Y with an older terrain representation.

## Governing invariant

For every accepted navigation state `N` and its corresponding R3A frame packet `P`:

`P.camera.position.y >= N.position.y`.

When the navigation-supported Y is already above the retained Run8B safety floor, R3A must preserve it exactly:

`P.camera.position.y = N.position.y`.

Run8B terrain may remain diagnostic provenance. It is not authority to replace the presented-terrain-supported camera elevation.

## Required behavior

- generation-324 navigation and visible-terrain-clearance bytes remain immutable;
- deliberately below-ground requested Y is repaired by navigation and remains repaired after R3A;
- a real state where presented-relief support exceeds the old Run8B floor must be discovered and exercised;
- that higher supported Y must survive R3A exactly;
- rising terrain must raise both navigation Y and final packet camera Y;
- reversing/downhill traversal must lower both coherently;
- no frame packet may contain camera Y below its corresponding supported navigation Y;
- public pointer/touch intake, live GPU binding, persistent renderer, terrain, route HTML, deployment, geography and topology remain outside mutation scope.

## Qualification

`node h-earth-3d/validation/h-earth.terrain-supported-r3a-camera.harness.mjs`

The harness must exercise the full navigation-to-frame-packet chain and report operation `H_EARTH_R3A_TERRAIN_SUPPORTED_CAMERA_RECONCILIATION_SUCCESSOR_20260819_001`, result `PASS`, and zero issues. It must include a regression case where the Gen324 supported Y is materially above the old Run8B floor, because that is the exact state that the predecessor presentation layer incorrectly collapsed.

A machine PASS does not authorize merge or production. Owner/browser inspection remains mandatory. The decisive browser test is whether ordinary forward traversal into visible rising terrain now physically carries the presented camera upward instead of allowing the observer to pass through the mountain.
