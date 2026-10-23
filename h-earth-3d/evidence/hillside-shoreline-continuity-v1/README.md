# Connected hillside and shoreline candidate

Admitted operation H_EARTH_HILLSIDE_SHORELINE_CONTINUITY_20261023_001, generation 2874. Governing baseline c64e78d5a05711f0b2ec7e98fb400c65d8e430df.

The pictured coastal side is addressed as the previously surveyed coastal component and shoulder, world bounds [-136,-253,249,-101]. Named spatial witnesses are woodland edge (-125,-200), inlet bank (15,-190), central ridge (86,-235), and eastern hill (148,-224). These are terrain survey coordinates, not recovered camera poses from the photos. Exact photo-to-camera correspondence remains unverified.

A 16 m scope feather bounds changes. Flat beach sand stays governed by the existing exposed-contact signal. Within this region, sand influence fades between normal-derived slopes of approximately 9 and 21 degrees; steep exposed shoreline ground uses earth/stone shading. Root generation independently requires actual visible support, existing water/structure/estate/tree exclusions, soil depth and support slope<=1.6. Slope and water distance alone never grant root admission.

The largest four-connected eligible component has 37,006 cells. A disconnected 17-cell component receives no additions. Deterministic infill targets 10 roots/m² at lower elevations, tapering to 4 at 46 m and reducing with slope and shore proximity. Existing roots remain exact. The new population is 1,568,999, below the existing 1,575,168 cap. Maximum tile population stays 816. All 35,536 nonzero quota cells meet quota. Grass on true beaches/water remains excluded.

The atlas retains woodland and ravine panels byte-for-byte. Coastal soil shading follows admitted root occupancy; no new terrain or trees are generated. Prepared procedural vegetation assets, input bindings, canonical geometry, interaction and tree model bytes are unchanged.

## Evidence

- request.json, procedure.json, admission.json: scope and authentic admission.
- checkpoint.json: exact population and payload hashes.
- compile.mjs --verify: byte-identical deterministic reproduction from immutable baseline.
- support-fixture.mjs: established exact terrain fixture with current timing instrumentation supplied; CPU-only.
- coverage-comparison.png: same-coordinate census comparison, **not GPU imagery**.
- loader-comparison.json: local Node CPU loading comparison, **not device performance**.
- review.json: independent West permission for read-only preflight, **not visual/publication acceptance**.

The final compressed payload adds 2,548,503 bytes (~7.7%). One local baseline/candidate measurement was 1048/998 ms, but this does not establish a speedup or mobile loading impact.

## Current boundary

Local root, integrity, budget, prepared-source/input and deterministic checks pass. Four historical test assertions were stale relative to the already released gen 2873 loader/importmap/silhouette; they now check those actual released contracts. No runtime behavior was changed to satisfy them.

Next: immutable candidate read-only preflight. Fixed-view GPU comparison, owner KEEP/ONE_REPAIR/REJECT disposition and experience-anchor receipt remain pending. Do not merge or deploy based on this evidence alone. Return the remote run link and stop once started; do not poll.
