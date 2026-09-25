# H-Earth R2 Depth Ownership — Epistemic Control Envelope

Status: FROZEN PRE-EXECUTION MEASUREMENT CONTRACT  
Immutable subject: `53305f5dfcdce51406363cba21c665d4e44701ad`  
Prior durable audit: `3cc6873748aef88d06099ee60b8b23d5a0f18aff`

## Purpose

Qualify one read-only measurement: which physical primitive owns the suspect raster pixels under the frozen renderer/camera law.

The epistemic control plane qualifies the measurement and conclusion. It does not replace the calculation and does not authorize geometry mutation by itself.

## Frozen hypotheses

H1: `FAR_OCEAN_CONTINUATION` wins suspect near-field pixels.

H2: Run8B successor terrain wins those pixels.

H3: `FAR_LAND_CONTINUATION` wins those pixels.

No other hypothesis may be introduced without a new evidence-boundary record.

## Frozen ocean witnesses

`5937 / 6160 / 5936 / 5935 / 5713`

## Frozen competitors

- Run8B successor terrain
- `FAR_LAND_CONTINUATION`

Shoreline bands remain controls. Invisible delegated water ribbons do not become substitute visible-ocean authority.

## Frozen camera

- position: `(28, 10.5, -82)`
- target: `(-34, 5.5, -214)`
- up: `(0, 1, 0)`
- vertical FOV: `56°`
- near: `0.25`
- far: `512`

## Measurement law

For every raster pixel covered by each frozen ocean witness:

1. preserve source `primitiveId` and `sourceTriangleIndex`;
2. transform through the frozen camera basis;
3. apply the renderer's six clipping planes;
4. preserve clipping-generated vertices;
5. project using the frozen viewport/raster convention;
6. identify Run8B and FAR-land fragments covering the identical pixel center;
7. compute depth using the renderer-equivalent perspective/depth interpolation law;
8. select the minimum eligible opaque depth;
9. record the winning primitive and source triangle;
10. aggregate won-pixel counts and coverage per witness.

Triangle-average depth, world-space distance, semantic layer order, representation label, and bounding-box overlap are inadmissible substitutes for pixel-level depth ownership.

## Required raw evidence

For every shared pixel retained in the evidence output:

- pixel coordinate
- ocean witness source triangle
- ocean interpolated depth
- every eligible Run8B/FAR-land competitor source triangle
- competitor interpolated depth
- winning primitive
- winning source triangle
- winning depth
- depth delta to runner-up

A compact machine-readable raw artifact may accompany the human-readable summary.

## Required winner table

| Ocean witness | covered pixels | pixels shared with Run8B | pixels shared with FAR land | ocean wins | Run8B wins | FAR-land wins | ocean win % | dominant winning competitor | minimum depth delta | median depth delta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |

## Epistemic qualification checks

The measurement qualifies only if all are true:

- immutable subject SHA corresponds exactly;
- source constructors correspond to the frozen subject;
- camera correspondence is exact;
- primitive-span identity is preserved;
- witness source-triangle identity is preserved;
- clipping law corresponds to the renderer;
- raster sample convention is declared and deterministic;
- depth interpolation law corresponds to the renderer;
- all eligible opaque competitors are included;
- no semantic/label inference substitutes for physical depth;
- raw evidence reconciles exactly to aggregate counts;
- rerun produces identical aggregate ownership;
- conclusion does not exceed the measured pixels.

## Decision dispositions

### OCEAN_DEPTH_OWNERSHIP_CONFIRMED

Permitted only if FAR ocean wins the suspect pixel population materially represented by the frozen witnesses.

This disposition authorizes investigation of a bounded representation/overlap-law repair. It does not authorize global ocean densification automatically.

### RUN8B_DEPTH_OWNERSHIP_CONFIRMED

Permitted only if Run8B wins the suspect pixel population. Follow the exact winning Run8B source triangles upstream.

### FAR_LAND_DEPTH_OWNERSHIP_CONFIRMED

Permitted only if FAR land wins the suspect pixel population. Follow the exact winning FAR-land source triangles upstream.

### MIXED_OR_NONIDENTIFIABLE

Required if ownership is materially mixed, raster correspondence is incomplete, required competitors are absent, or the measurement cannot distinguish the visible culprit.

No repair authorization follows from this state.

## Claim ceiling

This measurement may establish pixel ownership for the frozen camera, renderer law, geometry occurrence, viewport/raster convention, and witness set only.

It may not establish universal ownership across arbitrary camera poses, future geometry occurrences, other renderer laws, or unrelated visual defects.

## Mutation gate

`GEOMETRY_MUTATION = HELD`

`REPRESENTATION_LAW_REPAIR = HELD`

Release requires:

`RAW_DEPTH_EVIDENCE_COMPLETE`
→ `AGGREGATE_RECONCILED`
→ `REPRODUCIBLE`
→ `EPISTEMIC_QUALIFICATION_PASS`
→ one of the four decision dispositions above.

## Next execution

Materialize and execute exactly one read-only depth-ownership instrument against the frozen subject. Persist its raw evidence, winner table, reproducibility result, and epistemic qualification receipt. Do not broaden the program.
