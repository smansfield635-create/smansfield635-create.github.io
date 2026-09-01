# H-Earth Deep-Change Discovery Manifest v1

## Purpose

This manifest is the reusable orientation map for deep H-Earth changes. It exists so future rooms do not rediscover the rendering stack by trial and error or mutate a non-governing layer while the live product consumes another authority.

The governing question for every deep repair is:

> What exact source controls the pixels the owner is seeing?

A change is not considered materially installed merely because code or geometry exists. The discovery chain must identify the source authority, every downstream consumer, the live transport, and the final rendered expression.

## Core law

`SOURCE AUTHORITY -> CONSUMER -> LIVE PACKAGE -> GPU TRANSPORT -> SHADER / COMPOSITION -> CAMERA / ATMOSPHERE -> OWNER PIXELS`

If any link is unproven, the room must not claim that a deep change is visually installed.

## Discovery Layer D0 — project and baseline authority

Questions:
- What owner-inspected baseline is being preserved?
- What exact candidate/commit is under repair?
- What objective is changing and what strengths must not regress?

Required evidence:
- exact baseline identity;
- exact candidate SHA;
- explicit objective;
- preservation anchors.

Failure mode prevented: perspective change or unrelated visual difference being mistaken for objective improvement.

## Discovery Layer D1 — world / planet frame

Current authority:
- `showroom/globe/h-earth/render/planetary-world-frame.js`

Responsibility:
- region-to-planet mapping;
- planetary radius;
- local tangent protection;
- transition annulus;
- planet surface normal;
- tangent basis;
- geometric horizon derivation.

Known historical failure:
- `x/z unchanged + y sag` was not a true planetary transform and produced a bent planar sheet rather than a globe.

Deep-change rule:
- any globe/world-shape repair starts here before shoreline decoration or terminal scenery.

## Discovery Layer D2 — local tangent / playable region

Authorities include:
- canonical H-Earth terrain/world-domain contracts;
- navigation and collision capacity;
- local accessible-region bounds.

Responsibility:
- preserve ordinary H-Earth navigation and collision as a local Cartesian tangent patch;
- prevent planetary visual continuation from silently expanding playable authority.

Deep-change rule:
- visible planetary continuation and playable authority are separate concerns.

## Discovery Layer D3 — structural terrain topology

There are multiple terrain-related providers. A future room MUST determine which one is actually consumed by the target live package.

Known providers:
- `showroom/globe/h-earth/render/geometry-landscape.js` — functional-landscape terrain provider with C3C3R3 16x16 perceptual grid relief;
- `showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js` — Run 8B successor terrain/mountain geometry used by the canonical Run 8E live package.

Critical discovery from C3C3R5:
- restoring the grid only in `geometry-landscape.js` did not guarantee live expression because the canonical Run 8E package renders the Run 8B successor terrain path.

Current live-depth law:
- 16x16 recessed world-space grid relief belongs in the actual live structural terrain path;
- seam depth target: 0.72 world units;
- shoulder lift target: 0.14 world units;
- literal line/grid overlay prohibited;
- mountain/planetary continuation must not be warped merely to manufacture local grid cues.

Failure mode prevented: fixing a parallel/non-governing geometry layer.

## Discovery Layer D4 — material / environmental color authority

Current authority:
- `h-earth-3d/environment/h-earth.successor-surface-material.run8c.js`

Responsibility:
- intrinsic surface classification;
- structural material properties;
- subtropical environmental chromatic expression;
- spatial variation from shoreline moisture, elevation, slope, curvature, rock exposure and world position.

Current composition law:

`OPAQUE STRUCTURAL TERRAIN + TRANSLUCENT SPATIALLY-VARIANT COLOR CONTRIBUTION`

The translucent color contribution is mathematically composited into terrain material response; it must not make the physical ground framebuffer-transparent.

Governing visual law:

`GRID OWNS DEPTH; COLOR OWNS CHROMATIC EXPRESSION; NEITHER MAY ERASE THE OTHER.`

Failure mode prevented: broad opaque color fields perceptually erasing terrain depth.

## Discovery Layer D5 — live render-package material projection

Current authority:
- `showroom/globe/h-earth/render/live-render-package.run8e-r2.js`

Responsibility:
- identify the actual terrain primitive used by the live package;
- sample Run 8C material per terrain vertex;
- encode base color and material parameters;
- classify draw ranges and roles.

Audit requirements:
- prove the intended structural terrain primitive is the terrain source;
- prove spatially variant material samples survive packaging;
- prove alpha/tint semantics are not collapsed into an unintended broad opaque replacement;
- prove normals and material parameters correspond to the same geometry.

Failure mode prevented: correct upstream material logic being flattened during package construction.

## Discovery Layer D6 — GPU transport

Current authority:
- `showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js`

Buffers of interest:
- positions;
- normals;
- baseColorsLinear;
- materialParameters;
- materialModelCodes;
- surfaceClassCodes;
- primitiveIndices;
- roleCodes;
- indices.

Audit requirements:
- prove topology, normals, colors and material parameters reach the GPU without semantic loss;
- treat canonicalization as transport encoding only;
- verify that a future material channel is not invented upstream but discarded here.

Failure mode prevented: source signal exists but never reaches the shader.

## Discovery Layer D7 — lighting / normal response

Current live shader authority:
- `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js`

Responsibility:
- consume world-space normals;
- express directional light, ambient response and terrain form;
- preserve local relief under environmental color;
- apply distance effects without destroying near-field depth.

Audit requirements:
- ordinary owner camera heights/headings must reveal grid relief and slope variation;
- seam/shoulder geometry must produce visible local contrast through real normals/lighting, not debug lines;
- material color must not dominate normal response;
- lighting must remain coherent with the planet-relative frame where applicable.

Failure mode prevented: physically present depth becoming visually flat at the shader.

## Discovery Layer D8 — atmosphere / fog / horizon composition

Authorities include:
- atmospheric state/environment uniforms;
- `persistent-live-renderer.run8e-r3c.js` presentation and fog logic.

Current law:
- atmosphere may provide sky, haze, sun and aerial depth;
- viewport-space fake planetary curvature is prohibited;
- planetary horizon silhouette must come from world-space geometry + planet-relative camera + depth occlusion.

Audit requirements:
- near-field terrain relief must not be washed out by fog/haze;
- atmosphere must support distance without creating a fake wall/dome;
- horizon must agree with actual world geometry.

Failure mode prevented: atmosphere visually overriding the true world frame.

## Discovery Layer D9 — camera / projection consumption

Current frame authority:
- `showroom/globe/h-earth/render/functional-landscape-frame.js`

Planetary dependencies:
- planet-relative up;
- tangent basis;
- observer height;
- geometric horizon distance;
- local-navigation preservation.

Audit requirement:
- do not stop at a camera contract existing in a frame object; trace the exact inspection/live renderer packet and prove that its view/projection path consumes the intended camera state.

Failure mode prevented: a repaired camera model existing in parallel while the inspected environment still uses an older Cartesian camera path.

## Discovery Layer D10 — landscape assembly / draw-set custody

Responsibility:
- determine which geometry providers actually enter the final admitted primitive set;
- determine which are diagnostic, historical, preview-only or unused;
- prove ocean, distant land, structural terrain, shoreline and continuation primitives coexist in the rendered draw set intended for inspection.

Audit requirement:
- a constructible geometry provider is not evidence of rendered presence.

Failure mode prevented: testing an isolated provider that the live landscape never draws.

## Discovery Layer D11 — macro composition

This is a construction/composition layer after the deeper authorities are proven.

Required objectives:
- former rectangular corners become intentional coastline wrap, headland, valley, distant silhouette, atmospheric occlusion or planetary fall-away;
- the mountain/pass ocean-reveal corridor is deliberately composed and preserved;
- neighboring-region continuation is visible but inaccessible;
- the environment reads as a region embedded in a world, not a decorated box.

Failure mode prevented: technically correct geometry with no meaningful experiential improvement.

## Discovery Layer D12 — qualification and visual evidence

Required sequence:

`FUNCTIONAL QUALIFICATION -> LIVE-PATH PROVENANCE CHECK -> VISUAL / EXPERIENTIAL QUALITY AUDIT -> IMMUTABLE INTERACTIVE PREVIEW -> OWNER INSPECTION`

Machine qualification must prove:
- exact candidate SHA;
- correct live source authorities;
- required buffers/signals reach the renderer;
- no prohibited navigation/collision expansion;
- no obsolete rectangular/fake-horizon authority remains.

Visual audit must prove:
- objective material improvement against the preserved baseline;
- perspective change alone does not count as improvement;
- preserved strengths remain preserved;
- depth + color coexist;
- globe/world perception is materially improved;
- composed reveal/corner objectives are visible.

## Dependency map

`BASELINE / OBJECTIVE`
`-> WORLD / PLANET FRAME`
`-> LOCAL TANGENT / PLAYABLE AUTHORITY`
`-> STRUCTURAL TERRAIN TOPOLOGY`
`-> MATERIAL / COLOR AUTHORITY`
`-> LIVE PACKAGE PROJECTION`
`-> GPU TRANSPORT`
`-> LIGHTING / NORMAL RESPONSE`
`-> ATMOSPHERE / FOG`
`-> CAMERA / PROJECTION`
`-> LANDSCAPE ASSEMBLY / DRAW SET`
`-> MACRO COMPOSITION`
`-> FUNCTIONAL + VISUAL QUALIFICATION`
`-> OWNER PIXELS`

The ordering is a provenance orientation, not a claim that every repair must mutate every layer.

## Deep-change operating procedure

When a future owner request requires a deep visual/world change:

1. Freeze the current owner-inspected baseline and objective.
2. Start at the owner-visible symptom and trace backward until the earliest controlling authority is identified.
3. Mark every parallel/non-governing implementation discovered during the trace.
4. Identify the exact live consumer path before mutation.
5. Freeze unaffected good layers.
6. Replace or repair the earliest deficient controlling layer.
7. Propagate/rebuild only dependent downstream layers.
8. Prove the signal survives live package construction and GPU transport.
9. Prove shader, atmosphere and camera do not suppress or contradict it.
10. Perform macro composition only after underlying authority is coherent.
11. Run exact-head functional qualification.
12. Run a separate baseline-bound visual/experiential audit.
13. Materialize an immutable interactive inspection route.
14. Deliver the full inspection link to the owner.
15. Merge only after owner acceptance.

## Restacking law

`FREEZE GOOD LAYERS -> REPLACE DEFICIENT LAYER -> RECOMPOSE DEPENDENTS -> QUALIFY INTERFACES -> VISUALLY COMPARE`

A lower-layer change may require deterministic downstream regeneration. It does not authorize unrelated upstream or sibling mutation.

## Anti-recurrence rules

- Never infer live authority from a filename or conceptual role.
- Never treat provider construction success as rendered presence.
- Never treat metadata saying a feature exists as visual proof.
- Never count camera/perspective change as product improvement.
- Never repair a parallel layer without proving the live consumer uses it.
- Never let color erase topology.
- Never let atmosphere manufacture planetary geometry.
- Never expand navigation/collision merely to create visible continuation.
- Never deliver owner inspection immediately after machine PASS; perform the visual/experiential audit first.

## Current C3C3R5 orientation

Implemented/discovered:
- D1 true region-to-planet spherical frame;
- D3 actual live structural terrain path identified and grid relief installed there;
- D4 layered environmental color composition installed in Run 8C;
- planet-relative camera contract installed;
- fake viewport-space curved horizon retired.

Still requiring explicit closure proof before owner inspection:
- D5 live material projection preserves the layered signal;
- D6 GPU transport preserves required signal channels;
- D7 lighting/normal response visibly exposes topology from owner viewpoints;
- D8 atmosphere/fog does not wash out terrain or contradict the globe;
- D9 exact inspection renderer consumes the intended planet-relative camera path;
- D10 final draw-set custody is proven;
- D11 mountain-pass ocean reveal and former-corner macro composition are intentionally resolved;
- D12 functional + visual qualification closes on the exact candidate.

## Governing outcome

This manifest is the first-stop orientation document for future deep H-Earth visual/spatial reconstruction. It should be updated when a newly discovered controlling layer materially changes the provenance chain.
