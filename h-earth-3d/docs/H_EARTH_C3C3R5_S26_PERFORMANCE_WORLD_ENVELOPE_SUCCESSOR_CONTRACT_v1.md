# H-Earth C3C3R5 S26 Performance + World-Envelope Successor Contract v1

## Governing operation

- Operation: `H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_SUCCESSOR_20260817_001`
- Lock generation: `305`
- Frozen C3C3R5 subject: `2152ad18c1691c4056e9ae39795ad44228dbdc19`
- Governing private control-plane head after transport repair: `9d7c73e6ab93a6402b74e8d763f3844e0fd7a3b4`
- Authoritative H-Earth preflight tooling: `8c451f13bc468a6bc9c4729789938c17a134d1da`
- Authoritative seven-path preflight: run `32073173178`, job `95520632277`, native disposition `PASS`.

This is one bounded performance-and-world-envelope strike. Performance repair and world-envelope construction MUST NOT be separated into sequential full cycles.

## Governing law

> **Visual distance may increase while computational density decreases with distance.**

For distance `d` from the playable region:

`d ↑ => geometry density ↓, shader cost ↓, interaction authority -> 0`.

The horizon interaction authority MUST equal zero.

## Frozen three-zone model

### NEAR_FIELD

The near field is the exact existing playable C3C3R5 geography. It retains the highest visual fidelity and the existing navigation/collision authority. This successor MUST NOT shrink, relocate, flatten, simplify, or semantically redefine the playable geography to obtain performance.

Protected identity includes:

- playable terrain bounds;
- shoreline topology and open-ocean orientation;
- existing navigation envelope;
- existing collision envelope;
- existing planet-relative camera/world composition;
- the single existing world-space renderer authority.

### TRANSITION_FIELD

The transition field is visual continuation only. It MUST be cheaper than the near field and MUST NOT create collision, navigation, semantic-address expansion, full-detail 16×16 terrain, or high-frequency procedural relief.

### HORIZON_BOUNDARY_FIELD

The horizon/boundary field is the cheapest field and is visual-only by contract. It MUST NOT create collision, navigation, semantic-address expansion, full-detail 16×16 terrain, expensive procedural terrain shading, or screen-space world-shape authority.

The boundary MUST be composed from all three of:

1. sparse world-space silhouette geometry;
2. depth ordering;
3. atmospheric occlusion.

Fog/haze alone does not satisfy the boundary requirement.

## S26 interaction-performance contract

The baseline and successor MUST be compared under identical conditions:

- viewport: `390 × 844` CSS pixels;
- device class: touch-capable phone profile;
- same public H-Earth route and visual selection;
- same scripted one-pointer touch trace;
- same trace duration and settling interval;
- same Chromium/Playwright runtime within a single qualification occurrence.

The receipt MUST record for both baseline and successor:

- requestAnimationFrame pacing samples during active interaction;
- median and p95 active frame pacing;
- maximum active frame pacing;
- long-frame count;
- dropped-frame count;
- navigation proposal count;
- accepted one-finger-look proposal count;
- visible frame delta.

The successor MUST additionally expose from the renderer receipt:

- maximum synchronous proposal-to-present time;
- active interaction render scale;
- active shader mode;
- full-quality recovery interval;
- recovery-frame count;
- settled shader mode and render scale.

## Permitted active-drag quality tier

During active one-finger drag only, the renderer MAY:

- use a reduced interaction resolution;
- bypass expensive terrain micro-relief/structural/specular shader work;
- retain the exact same world-space draw set, camera, navigation state, and GPU context.

The current successor policy is:

- interaction scale: `0.70`;
- interaction shader mode: `INTERACTION_SIMPLIFIED_TERRAIN`;
- settled shader mode: `FULL_C3C3R5`;
- deterministic full-quality recovery bound: `96 ms` after motion settles.

Permanent quality downgrade is prohibited.

## Exact preservation law

At qualification, the successor MUST prove that the following baseline files remain byte-identical unless separately justified by this exact operation:

- `showroom/globe/h-earth/render/functional-landscape-frame.js`
- `showroom/globe/h-earth/functional-landscape/navigation.js`
- `h-earth-3d/terrain/h-earth.terrain-field.js`
- the public route host and pointer/touch intake.

The only intended product implementation deltas are the distant visual-envelope provider and the existing persistent-renderer path/adapter, plus this contract and its qualification harness.

## World-envelope acceptance

The successor MUST prove:

- explicit first-class `NEAR_FIELD`, `TRANSITION_FIELD`, and `HORIZON_BOUNDARY_FIELD` contracts;
- geometry density rank strictly decreases from near -> transition -> horizon;
- shader-cost rank strictly decreases from near -> transition -> horizon;
- interaction authority is zero in the horizon field;
- no horizon navigation/collision/semantic-address authority;
- no east/northeast opposing landmass across the protected open ocean;
- no rectangular terminal geometry or screen-space fake horizon;
- composed silhouette + depth + atmospheric boundary system is present.

## Performance acceptance

`S26_MEASURABLE_FLUIDITY_PASS` requires all of:

1. successor active-drag p95 frame pacing does not regress versus the exact baseline under the identical trace;
2. successor active-drag maximum frame pacing does not materially regress versus baseline;
3. successor dropped/long-frame counts do not increase versus baseline;
4. the renderer reports the bounded reduced interaction tier during motion;
5. after release, the renderer deterministically returns to `FULL_C3C3R5` at scale `1` within the declared recovery bound;
6. no new WebGL context, parallel renderer, or per-frame GPU resource recreation is introduced.

This comparative gate is intentionally stricter than a standalone nominal threshold. A later room MAY NOT substitute an easier viewport, shorter trace, different device class, or different timing window.

## Closure equation

`PASS iff GEOGRAPHY_IDENTITY_PRESERVED && S26_MEASURABLE_FLUIDITY_PASS && WORLD_ENVELOPE_EDGE_ELIMINATED && POST_INTERACTION_FULL_QUALITY_RESTORED`.

A visually improved horizon with an S26 interaction regression is `REPAIR_REQUIRED`. A faster renderer obtained by shrinking or degrading playable geography is `REPAIR_REQUIRED`. A performant interaction tier that fails to restore full quality is `REPAIR_REQUIRED`.

## Authority boundary

This contract authorizes only the bounded Gen305 successor construction and qualification already admitted by lock generation 305. It creates no merge, deployment, release, or production-promotion authority.
