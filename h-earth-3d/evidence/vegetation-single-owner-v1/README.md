# Isolated single-owner woodland prototype

Operation: H_EARTH_ISOLATED_VEGETATION_PROTOTYPE_20261017_002, generation2790.
Baseline: `3ca258e1e67fe16ed5eb73b4cd883c66af6b4909` (PR6460).
Source architecture audit: https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6236265916

This candidate is an isolated woodland replacement experiment. It is not a full-world vegetation replacement, production release, accepted visual improvement or measured speedup.

## Boundary

Route: `/showroom/globe/h-earth/vegetation-prototype.html`
Query: `arrival=approved-four-trees&prototype=single-owner-v1&performance=1`

The default route keeps its existing preparation/draw behavior. The prototype selects an explicit renderer strategy and never invokes the legacy residency survey or canonical vegetation GPU batch materialization. It retains accepted base-world initialization: terrain, water, geology, four trees, rock and boulder presentation, base shaders/materials and navigation. It derives the identical shoreline soil mask from the existing oasis primitives and uploads it separately. Oasis preparation remains a startup cost; this is deliberately included in timing rather than hidden. Other deferred canonical vegetation outside the woodland is not installed in this bounded experiment, so a whole-world visual equivalence claim would be invalid.

Prototype-only import-map aliases normalize the two existing raw/canonical package URL identities. This does not modify the reference route or introduce a different world asset. Worker mode URLs keep their intended identities.

## Replacement ownership

The existing accepted woodland admission/generator produces one population using the actual rendered surface. No nearby cache, global-cover population, planting pilot or capacity-ranked fine selection is installed. Each accepted root has a stable ID derived from its Float32 contact and seed. Immutable tile ranges share one static vertex buffer. All installed roots receive a persistent coarse blade; nearby roots receive a second lobe with a smooth14–24m morph. Both representations address the same root ranges. Changing detail cannot remove the coarse representation.

Maximum450,000roots/7,200,000GPUbytes, maximum1,600roots/25,600bytes per tile upload. Initial upload is bounded per tile, then camera movement updates uniforms and draw ranges only. Coarse cover is one draw. Fine draws merge consecutive selected tile ranges. The owner reports its own objects/uploads separately from legacy renderer counters; add them when comparing total resource counts.

This version still generates woodland and the accepted oasis mask in the browser. It does not yet supply build-time vegetation assets. No GPU execution time or Android performance is inferred from CPU submit duration.

## Evidence contract

Independent local command:

```
node --test h-earth-3d/validation/h-earth.vegetation-single-owner.v1.test.mjs
```

Existing registered exact-head runner: `.github/workflows/h-earth-neutral-exact-head-runner.yml`, capability `H_EARTH_NEUTRAL_EXACT_HEAD_RUN`. The candidate route provides the runner's existing read-only receipt adapter. It reports ready only after the populated replay completes; no new workflow/transport is introduced.

The route uses the approved four-tree arrival, eight4m forward steps and eight4m return steps through the real wheel intake. Every observation contains actual frame/position, immutable fixed-control IDs (radius2m around x=-139.40267987050615,z=-194.5), installed/coarse/fine counts, actual uploads/draw submissions, and CPU render/present-call duration. It rejects empty control, changed installed IDs, lost coarse submission, movement uploads and incorrect route positions. These assertions establish submission/identity behavior, not visible-pixel continuity. Final image and artifact require inspection after the run.

Comparison reference: run39046344101, populated-entry diagnostic, same arrival and route. Hardware, viewport and capture scheduling must be checked before timing comparisons. The new route is a bounded woodland scope; its reduced outside-woodland workload must be disclosed. Publication, device acceptance and migration remain separate decisions.

Generation2790 supersedes the unwritten2789 scope solely to locate the isolated HTML at the H-Earth root, matching the existing runner's relative source-identity probe. No runner bytes or default route were changed.
