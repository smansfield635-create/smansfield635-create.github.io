# H_EARTH_C3C3_OWNER_DEFICIENCY_STRATEGY_AND_DETERMINISTIC_HANDOFF_v1

Status: GOVERNING OWNER-INSPECTION REPAIR STRATEGY / FAIL-CLOSED
Date: 2026-08-16
Active construction PR: `#1198`
Frozen inspected candidate: `02910f254778438aba851e6031bf297568c9cc17`
Frozen candidate tree: `9884fe23572c87e23d10ef4f821daba695ecd02e`
Immutable owner inspection route: `/preview/h-earth/c3/02910f254778438aba851e6031bf297568c9cc17/`
Owner inspection video: `23750.mp4`
Owner inspection video duration: `84.687125s`
Owner inspection video bytes: `17461972`
Owner inspection video SHA-256: `a6525664d11b9cc576f6d3b859e93d73d87f6c2c2f6323973028b5857de2fd83`
Owner disposition: `SIGNIFICANT_IMPROVEMENT / REPAIR_REQUIRED_BEFORE_CLOSE`

## 1. Purpose

This document is the deterministic continuation authority for the H-Earth C3C3 owner-inspection repair. It binds the exact successful baseline, the exact remaining deficiencies, the strategy for each deficiency, the dependencies among those strategies, the prohibited regressions, the qualification sequence, and the terminal closure predicate.

No room may reinterpret the current state as a fresh design exercise. The next construction is a bounded repair against the exact owner-inspected candidate above.

Governing target:

`PLAYABLE H-EARTH REGION INSIDE A VISIBLY CONTINUOUS PLANET`

Rejected substitute:

`PLAYABLE REGION CONCEALED BY SCENERY`

## 2. Frozen positive baseline

The inspected C3C3 candidate is a major improvement and SHALL be treated as a positive baseline, not discarded or broadly rebuilt.

The following are preservation anchors:

- `B1 ATMOSPHERIC_WORLD_PRESENT`: the environment no longer collapses into a gray/empty construction canvas; sky, horizon atmosphere, and depth are materially present.
- `B2 WORLD_LOCKED_CELESTIAL_REFERENCE`: the sun no longer behaves as a camera-following screen ornament and is materially tied to world/camera geometry.
- `B3 RESTORED_DEPTH_HIERARCHY`: near, middle, and far landscape layers read with materially improved separation.
- `B4 ENLARGED_NAVIGABLE_SCALE`: the enlarged H-Earth region remains a positive scale baseline and SHALL NOT be shrunk merely to simplify enclosure.
- `B5 COASTAL_TOPOLOGY`: the north-to-east coastal turn remains intact.
- `B6 OPEN_OCEAN_TRUTH`: east/northeast remains genuine open ocean; no opposite landmass may be reintroduced.
- `B7 NAVIGATION_COLLISION_AUTHORITY`: current playable navigation, collision, and semantic region extent remain unchanged unless a separately authorized safety defect requires alteration.
- `B8 INTERACTIVE_INSPECTION`: exact-candidate direct owner navigation remains mandatory before any production merge.

Any repair that improves a remaining deficiency while regressing B1-B8 is `REPAIR_REQUIRED`.

## 3. Remaining deficiency register

### D1 — FAKE_MOUNTAIN_BOUNDARY_WEST_LANDWARD

Observed condition:

A landward termination is visually masked by a mountain mass that reads as a scenery barricade. The viewer cannot distinguish an intentional boundary between regions from an artificial mountain wall placed to conceal the finite edge of the authored world.

Why this is deficient:

The world still communicates `terrain ends here` rather than `H-Earth ends here and another region continues beyond`.

Required correction:

Replace the mountain-barricade logic with an explicit connected-region threshold. Terrain/world context may remain visible beyond the playable line, but traversal authority stops at the H-Earth boundary.

### D2 — FAKE_MOUNTAIN_BOUNDARY_OPPOSITE_LANDWARD

Observed condition:

The corresponding landward/lateral side has the same conceptual defect: mountain scenery is doing the job of topology.

Why this is deficient:

Symmetric use of distant mountains as concealment leaves the playable region reading as a finite diorama surrounded by masking geometry.

Required correction:

Apply the same connected-region boundary grammar independently to this side. The two sides may use different world-appropriate forms, but both must communicate a region threshold rather than a renderer edge.

### D3 — FLAT_OCEAN_HORIZON / PLANETARY_CURVATURE_MISSING

Observed condition:

Open ocean now correctly continues without an opposing continent, but the terminal horizon still reads predominantly as a flat planar line.

Why this is deficient:

The environment is intended to read as a location on a planet. A flat infinite water plane weakens the planetary scale cue and leaves the ocean side less resolved than the landward side.

Required correction:

Introduce a shallow, continuous planetary curvature cue at atmospheric distance so ocean and atmosphere resolve as the visible limb of a globe. This SHALL be world/camera coherent and SHALL NOT be a screen-space decorative arc.

### D4 — REGION_BOUNDARY_SEMANTICS_NOT_LEGIBLE

Observed condition:

Even where landward threshold silhouettes are present, the owner cannot yet reliably read them as an actual boundary to another region.

Why this is deficient:

A boundary that is technically present but perceptually indistinguishable from decorative landscape does not close the experience.

Required correction:

Give each landward threshold unmistakable regional semantics. Acceptable mechanisms include a named region marker, boundary architecture, gate, pass, escarpment transition, material shift, boundary monolith, territorial line, or another in-world device. A text label is optional, not mandatory. The semantic result is mandatory.

User-facing interpretation must be:

`THE WORLD CONTINUES THERE; THIS REGION ENDS HERE.`

### D5 — WORLD_CONTINUATION_MUST_REMAIN_VISIBLE_BUT_INACCESSIBLE

Observed condition:

The current cycle has solved much of the blank-canvas problem, but the final boundary architecture must not regress into either a hard technical wall or an accidentally traversable adjacent world.

Required correction:

Beyond-boundary space remains visual context only. It may contain terrain silhouettes, atmosphere, structures, or regional identity cues, but it gains no H-Earth navigation address, collision authority, interaction authority, or semantic ownership in this cycle.

### D6 — MULTI-HEADING ENCLOSURE ROBUSTNESS

Observed condition:

A boundary can appear convincing from one heading and expose the construction box, terrain slab, horizon artifact, or masking geometry from another.

Required correction:

Qualification must inspect the full accessible heading ring and representative translated positions, not one hero view. Every landward approach must remain coherent and every ocean-facing heading must remain unboxed.

### D7 — AWARDS/SOUND WORK IS PREMATURE

Observed condition:

The environment is approaching a quality level where sound and final polish could make it award-ready, but foundational world closure is not yet complete.

Required correction:

No awards-specific polish, soundtrack, ambient sound program, cinematic finishing, or submission-oriented work enters the active repair. These are deferred until environmental closure passes direct owner inspection.

This is a sequencing deficiency, not a product defect.

## 4. Strategy pinned directly to deficiencies

No deficiency may be repaired by an unbound aesthetic change. Every construction object must state which deficiency it closes and which baseline anchors it preserves.

### S1 — CONNECTED_REGION_THRESHOLD_SYSTEM

Closes: `D1`, `D2`, `D4`, `D5`, contributes to `D6`.

Construction intent:

- retire mountain-wall-as-boundary behavior;
- define explicit H-Earth regional terminal corridors on both landward sides;
- preserve visible continuation beyond each terminal corridor;
- stop H-Earth traversal at the regional threshold without exposing a technical collision wall;
- make boundary semantics legible from ordinary approach distance;
- optional region naming is permitted when it improves clarity;
- adjacent-region identity must read as diegetic world structure, never as `under construction`, `coming soon`, or implementation status.

Preferred hierarchy:

1. world-continuation terrain/context beyond boundary;
2. region-specific threshold form at the H-Earth limit;
3. subtle atmospheric depth tying threshold to distant world;
4. optional region name or emblem as reinforcement, not as the sole boundary mechanism.

Pass predicate:

`BOTH_LANDWARD_SIDES_READ_AS_CONNECTED_REGION_THRESHOLDS && NO_FAKE_MOUNTAIN_BARRICADE && VISUAL_WORLD_CONTINUES && ADJACENT_REGION_NOT_TRAVERSABLE`

### S2 — PLANETARY_OCEAN_LIMB

Closes: `D3`, contributes to `D6`.

Construction intent:

- preserve existing open-ocean topology and shoreline geometry;
- express shallow planetary falloff only at sufficient distance from the playable coast;
- bind curvature to world/camera projection rather than viewport coordinates;
- couple the ocean limb to atmosphere/haze so the curvature reads as planetary scale, not as a bent sheet;
- avoid introducing visible seams, clipping, steep water deformation, or a false opposite shoreline.

Implementation may use geometric water curvature, projected planetary falloff, depth-based ocean displacement, horizon-space spherical approximation, or another physically coherent method. The visible predicate governs; no specific implementation is mandatory.

Pass predicate:

`OPEN_OCEAN_PRESERVED && HORIZON_READS_PLANETARY && NO_SCREEN_SPACE_ARC && NO_NEAR_SHORE_WATER_DISTORTION && NO_OPPOSING_LANDMASS`

### S3 — CONTINUATION_WITHOUT_AUTHORITY_EXPANSION

Closes: `D5`; protects `B4`, `B5`, `B6`, `B7`.

Construction intent:

- separate visible-world extent from playable-region authority;
- retain or increase visual-only context only where required for enclosure;
- do not enlarge the navigable envelope;
- do not add collision or semantic addresses to adjacent-region visual context;
- prevent the player from crossing the threshold while avoiding an obvious invisible-wall presentation.

Pass predicate:

`VISIBLE_WORLD_EXTENT >= PLAYABLE_WORLD_EXTENT && PLAYABLE_EXTENT_UNCHANGED && NAVIGATION_AUTHORITY_UNCHANGED && COLLISION_AUTHORITY_UNCHANGED`

### S4 — FULL_RING OWNER-VISIBLE QUALIFICATION

Closes: `D6`; protects every baseline anchor.

Construction intent:

Qualification must include:

- multiple translated positions within the playable region;
- west/landward boundary approach and oblique headings;
- opposite landward boundary approach and oblique headings;
- north/east/northeast open-ocean headings;
- coastal turn views;
- return headings for celestial consistency;
- near/mid/far depth inspection;
- explicit search for exposed terrain slab edges, background canvas, region-mask seams, water curvature seams, and accidental traversability.

Machine evidence may prove execution and invariants. It may not pronounce final perceptual closure.

Pass predicate:

`MACHINE_MULTI_HEADING_PASS && EXACT_CANDIDATE_INTERACTIVE_PREVIEW && OWNER_INTERACTIVE_PASS`

### S5 — DEFERRED_AWARDS_AND_SOUND_GATE

Closes: `D7`.

Strategy:

Awards/sound work is admitted only after the environmental terminal predicate is satisfied. The first subsequent enhancement cycle may evaluate ambient environmental sound, spatial audio, musical restraint, cinematic polish, performance, accessibility, and awards-standard experience review.

Current status:

`DEFERRED_NOT_AUTHORIZED`

## 5. Deficiency-to-strategy binding matrix

The following bindings are mandatory:

- `D1 -> S1 + S3 + S4`
- `D2 -> S1 + S3 + S4`
- `D3 -> S2 + S4`
- `D4 -> S1 + S4`
- `D5 -> S1 + S3 + S4`
- `D6 -> S4`
- `D7 -> S5`

No deficiency is considered closed unless every strategy listed for that deficiency passes.

No strategy is considered successful if it regresses any baseline anchor B1-B8.

## 6. Inter-strategy dependency law

The strategies are not independent aesthetic tasks. They must be executed and evaluated as one coupled world-closure system.

### Dependency A — S1 depends on S3

A regional threshold without frozen navigation/collision authority risks accidentally constructing the adjacent region as playable. Therefore S1 cannot pass unless S3 passes.

### Dependency B — S2 depends on B6 and B5

Planetary curvature is invalid if it closes the ocean with land, damages the established coast, or destroys the atmospheric field. Therefore S2 cannot pass unless open ocean and atmospheric immersion remain preserved.

### Dependency C — S4 evaluates S1-S3 together

A boundary solution that works only from a single camera position is not acceptable. S4 is the anti-cheat layer preventing local visual fixes from masquerading as world closure.

### Dependency D — S5 depends on terminal closure

Sound and awards polish cannot begin merely because S1 or S2 looks promising. S5 remains deferred until all required product strategies and owner inspection pass.

## 7. Prohibited repair shortcuts

The next room SHALL NOT:

- restore a mountain curtain merely because it hides the edge;
- place a giant opaque wall at the region boundary without visible world continuation;
- add a flat billboard, skybox seam, or screen-space mask to cover termination;
- create land across east/northeast open ocean;
- shrink the region to move the edge out of view;
- enlarge the playable region again to postpone boundary design;
- use fog opacity alone to hide world edges;
- curve the entire nearby shoreline/water plane enough to visibly deform local geography;
- implement a viewport-fixed circular horizon graphic;
- expose `under construction`, `coming soon`, technical IDs, or engineering status to the player;
- authorize awards/sound work before environmental closure;
- merge #1198 or any successor merely because automated qualification passes.

## 8. Construction scope for the immediate successor

The current exact inspected candidate `02910f254778438aba851e6031bf297568c9cc17` remains the positive product baseline.

Because its exact-head machine evidence and immutable preview are frozen, the next product mutation SHALL be a successor candidate, not an in-place reinterpretation of the qualified SHA.

Immediate construction scope is limited to:

1. `C3C3R-O1`: replace landward mountain masking with connected-region threshold architecture on both sides (`S1`).
2. `C3C3R-O2`: add coherent planetary ocean-limb curvature at atmospheric distance (`S2`).
3. `C3C3R-O3`: enforce visible-continuation/non-traversable authority separation (`S3`).
4. `C3C3R-Q1`: extend machine qualification for multi-position/full-heading robustness and planetary-limb invariants (`S4`).

No sound, awards polish, unrelated terrain redesign, or general aesthetic expansion belongs in this successor.

## 9. Machine qualification requirements for the successor

The successor qualification must bind to the exact successor SHA and prove at minimum:

- exact checkout identity;
- renderer initialization and successful visible presentation;
- B1-B8 preservation where machine-testable;
- both landward boundary systems materialized;
- no navigable/collision/semantic authority expansion;
- open-ocean headings remain free of land boxing;
- planetary ocean curvature is world/camera-derived and active only at distant range;
- local shoreline vertices/authority remain unchanged unless explicitly justified;
- no screen-fixed horizon arc;
- full heading scan encounters both boundary classes and open-ocean class;
- no renderer void, terrain slab edge, resource failure, page error, console error, or failed request;
- immutable same-domain interactive preview generated from the exact qualified successor tree.

Machine success yields only:

`OWNER_INSPECTION_ELIGIBLE`

It does not yield production merge authority.

## 10. Owner inspection requirements for closure

Owner PASS must establish all of the following from direct navigation:

- neither landward side reads as a fake mountain wall;
- both landward sides clearly read as boundaries to continuing regions;
- optional region naming, if used, reinforces rather than substitutes for the spatial boundary;
- the world appears to continue beyond H-Earth while remaining inaccessible in this cycle;
- east/northeast remains true open ocean;
- the ocean horizon has a convincing shallow planetary/globe edge;
- the planetary horizon does not look like a screen overlay or bent local water sheet;
- the coast, scale, atmosphere, sun behavior, and terrain depth remain at least as strong as the `23750.mp4` baseline;
- no construction box, blank canvas, terrain termination, or masking seam is visible during ordinary traversal;
- no new severe visual defect appears elsewhere in the accessible environment.

## 11. Terminal environmental closure predicate

The H-Earth environment cycle may close only when:

`B1 && B2 && B3 && B4 && B5 && B6 && B7 && B8`

AND

`S1_PASS && S2_PASS && S3_PASS && S4_PASS`

AND

`D1_CLOSED && D2_CLOSED && D3_CLOSED && D4_CLOSED && D5_CLOSED && D6_CLOSED`

AND

`EXACT_SUCCESSOR_MACHINE_PASS && EXACT_SUCCESSOR_OWNER_INTERACTIVE_PASS`

Then and only then:

`H_EARTH_ENVIRONMENT_CYCLE = PASS_CLOSED / PRODUCTION_PROMOTION_ELIGIBLE`

After production promotion and post-merge identity verification, a separate enhancement cycle may consider:

`SOUND + SPATIAL_AUDIO + FINAL POLISH + ACCESSIBILITY + PERFORMANCE + AWARDS_STANDARD_REVIEW`

## 12. Deterministic room handoff

Any fresh room must recover the state in this order:

1. Read this document in full.
2. Read `H_EARTH_C3C3_REGIONAL_BOUNDARY_CLOSURE_CONSTRUCTION_CONTRACT_v1.md` for the parent cycle law.
3. Inspect PR #1198 but DO NOT merge it; its frozen head is the inspected positive baseline, not the final production candidate.
4. Bind owner evidence to `23750.mp4`, SHA-256 `a6525664d11b9cc576f6d3b859e93d73d87f6c2c2f6323973028b5857de2fd83`.
5. Preserve candidate `02910f254778438aba851e6031bf297568c9cc17` as the baseline that established B1-B8.
6. Create the next bounded successor from the appropriate lineage without overwriting the frozen candidate identity.
7. Implement only `C3C3R-O1`, `C3C3R-O2`, `C3C3R-O3`, and their qualification support.
8. Run exact-head machine qualification.
9. Publish an immutable exact-candidate interactive inspection surface.
10. Stop for direct owner inspection.
11. Merge to production only after explicit owner PASS and exact-candidate promotion qualification.

Single next lawful product action:

`CONSTRUCT THE BOUNDED C3C3R SUCCESSOR THAT REPLACES FAKE LANDWARD MOUNTAIN BARRIERS WITH LEGIBLE CONNECTED-REGION THRESHOLDS, ADDS A WORLD-COHERENT PLANETARY OCEAN LIMB, PRESERVES THE 23750.mp4 POSITIVE BASELINE, AND DOES NOT EXPAND PLAYABLE AUTHORITY.`

No alternate interpretation is authorized by this strategy.