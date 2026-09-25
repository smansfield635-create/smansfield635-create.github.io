# H-Earth Water Representation Ownership Findings — 2026-09-25

Status: READ_ONLY_FINDINGS_FROZEN
Product mutation authorized by this artifact: NO

## Immutable coordinates

- Frozen visual authority/control: `53305f5dfcdce51406363cba21c665d4e44701ad`
- Bounded FAR-ocean all-land-underlay exclusion experiment: `dee6ab9f45990279770b4e4b9e08d81082584386`
- Experiment disposition: diagnostic evidence only; not promoted as successor.
- Browser qualification run: `36156128300` — SUCCESS.
- Physical inspection evidence: `27138.mp4`.

## Findings

1. The functional shoreline constructor contains three water-bearing near/mid primitives:
   - `SHALLOW_WATER`
   - `NEARSHORE_WATER`
   - `OPEN_WATER`

2. Those three primitives remain geometrically constructed, but their current render material is deliberately invisible:
   `rgba=[0,0,0,0]`, `transparencyClass=TRANSLUCENT`.
   Their metadata explicitly delegates visible water presentation to the continuous ocean.

3. `FAR_OCEAN_CONTINUATION` is a real indexed triangle mesh constructed by
   `showroom/globe/h-earth/render/geometry-distant-context.js`.
   It is an opaque continuous-ocean surface and is permitted to extend through the nearshore domain.

4. Control behavior at `53305f5d...` emitted FAR-ocean triangles for every ocean-grid cell, including cells with zero WATER votes (all-land underlay), mixed coast cells, and full-water cells.

5. Experiment `dee6ab9f...` changed only FAR-ocean cell admission:
   `waterVotes===0` cells were no longer emitted.
   Mixed cells (`waterVotes=1..3`) and full-water cells (`waterVotes=4`) remained emitted.
   No global density increase, Run8B mutation, Packet-001 mutation, renderer redesign, shader redesign, camera mutation, or navigation mutation was introduced.

6. Physical inspection of `27138.mp4` showed a real coastal-composition change with healthy performance, proving the bounded FAR-ocean admission mutation reached the visible representation system.

7. The target large ocean facets remained visible after all-land FAR-ocean underlay cells were removed.
   Therefore all-land underlay ownership is not sufficient to explain the remaining water facets.

8. The remaining FAR-ocean mixed and full-water cells remain a live causal candidate because they are still emitted to South as triangles and carry opaque water material.

9. R2 preserves primitive identity in `primitiveSpans`, but its GPU role taxonomy contains only `TERRAIN`, `SHORELINE`, and `VEGETATION`.
   `FAR_OCEAN_CONTINUATION` therefore enters R2 under the generic `SHORELINE` role rather than a dedicated WATER role.

10. The existing near/mid water geometry and the FAR continuation currently do not form an explicit visible representation handoff: near/mid water is invisible while visible presentation is delegated to FAR ocean.

## Current evidence boundary

NOT PROVEN:
- Pixel-level depth ownership of every remaining visible facet.
- That FAR-ocean mixed/full-water triangles alone cause every remaining artifact.
- That making near/mid ribbons visible and excluding FAR ocean from their domain will necessarily solve the artifact.

SUPPORTED:
- FAR ocean physically participates in the near/coastal representation.
- Removing its all-land cells visibly changes the environment.
- The remaining artifact survives that exclusion.
- Near/mid water primitives already exist but are presentation-disabled.
- A bounded near/mid-to-FAR representation handoff is justified as the next causal experiment.

## Next lawful action

Construct one bounded A/B candidate from the frozen authority that tests only:

1. restore visible presentation for the existing `SHALLOW_WATER`, `NEARSHORE_WATER`, and `OPEN_WATER` primitives using their existing defined water materials; and
2. exclude `FAR_OCEAN_CONTINUATION` from the same near/mid water domain while preserving its distant continuation role.

Hard holds:
- no global densification;
- no Run8B rewrite;
- no Packet-001 mutation;
- no South/West kernel mutation;
- no renderer redesign;
- no camera/navigation mutation;
- no promotion without mechanical/browser qualification and physical inspection.

GEOMETRY_MUTATION = HELD
REPRESENTATION_HANDOFF_EXPERIMENT = AUTHORIZED_NEXT
