# H-EARTH LANDSCAPE DEFINITION PHASE 1 — FIVE-CLASS CROSSWALK v1

STATUS: READ-ONLY AUTHORITY CROSSWALK
BASELINE: ADAPTIVE C
PRODUCT MUTATION: NONE

## PIPELINE
Canonical terrain field -> G_world/world manifold -> Run8B derivative/canonicalization -> Gen311 regional articulation -> Gen311 regional relief materialization -> Adaptive-C geometry sampling -> spherical presentation -> immutable package/GPU.

Run8B does not own geography. It samples G_world and adds representation normalization plus derived landform semantics.

Gen311 has two distinct roles:
1. derive semantic signals (ridge/pass/valley/watershed/foothill);
2. materialize an additional regional relief delta in landscape-preview.js.

This second role is important because Phase-1 meso structure can currently be composed twice: once in canonical elevation and again through Gen311 derived relief.

## CLASS 1 — MOUNTAIN

Canonical sources:
- hill Gaussian: center (72,-172), radii 62/50, amplitude +27
- ridge east: (148,-224), 66/34, +38
- ridge central: (86,-235), 68/37, +34
- ridge west: (18,-226), 76/43, +29
- ridge shoulder: (-52,-208), 82/52, +21
- pass east: (119,-226), 19/23, -14
- pass central: (52,-230), 20/25, -12
- positive composition: strongest local positive relief + 22% secondary overlap

Gen311:
- derives ridge/watershed/pass semantics at 8-unit analysis step
- landscape-preview then adds ridge*24 + watershed*9 + foothill*13 - valley*14 - pass*7 plus positive-elevation feedback

Disposition:
EXISTS_AND_WORKS for broad mountain identity.
EXISTS_BUT_INSUFFICIENT for geological hierarchy.
REDUNDANT_OR_COMPETING risk exists because canonical ridges are subsequently amplified by derived Gen311 ridge/watershed relief.

Witness:
primary approach around (72,-172) toward (86,-235), with passes around (119,-226) and (52,-230).

## CLASS 2 — FOOTHILL

Canonical source:
- foothill taper Gaussian centered (-12,-176), radii 126/62, amplitude +8.5
- ridge shoulder at (-52,-208), +21
- coastRise and rolling terrain also contribute to transition.

Gen311:
- foothillSignal derives from positive elevation, low ridge signal and moderate gradient
- materialization adds foothillSignal*13.

Disposition:
EXISTS_BUT_INSUFFICIENT.
The current foothill system is dominated by one broad positive Gaussian/taper plus Gen311 amplification. It lacks an explicit bench/secondary-low-ridge/slope-break hierarchy.
REDUNDANT_OR_COMPETING risk: Gen311 can re-amplify the same elevation context from which foothillSignal was derived.

Witness:
(-12,-176) westward/southward transition toward lowland around (-92,-152).

## CLASS 3 — VALLEY / DRAINAGE

Canonical sources:
- valley Gaussian centered (2,-198), radii 44/82, amplitude -11.5
- receiving basin centered (18,-192), 66/46, -7.5
- passes provide additional negative relief
- watershed law is declared, but the canonical field does not contain an explicit routed drainage trajectory.

Gen311:
- valleySignal from neighbor shoulders/laplacian
- flowVector = negative regional gradient
- materialization subtracts valleySignal*14 and passSignal*7.

Disposition:
EXISTS_BUT_INSUFFICIENT.
Valley/basin relief exists and flow direction is derived, but coherent routed drainage/banks/downstream widening are not explicit geometry laws.
The negative Gaussian valley remains exactly the type of isolated analytic depression the Phase-1 contract warns against.
Gen311 supplies useful semantics but does not create a routed drainage network.

Witness:
(2,-198) through receiving basin (18,-192), oriented toward lower coastal terrain.

## CLASS 4 — PLAIN / LOWLAND

Canonical sources:
- lowland Gaussian centered (-92,-152), radii 70/58, amplitude -6.5
- coastRise = 0.025 * inland distance
- rolling terms:
  1.7*sin((x+22)/48)
  1.2*sin((z+140)/29)
  activated progressively inland.

Gen311:
- LOWLAND is the fallback landform class
- no dedicated positive lowland structure signal exists
- regional relief mask can leave lowland largely dependent on canonical field.

Disposition:
EXISTS_BUT_INSUFFICIENT.
The lowland has broad grade and sinusoidal undulation, but no explicit shallow swales, broad rises, terraces/benches or drainage-linked low relief.
This is likely the weakest class for landscape definition away from mountains.

Witness:
(-92,-152), extending west/east across the lowland before foothill rise.

## CLASS 5 — COAST / SHORE TRANSITION

Canonical sources:
- shoreline backbone baseline Z -82
- multiple peninsulas/gulfs/bays/headlands
- coastRise inland
- wet-sand compression
- broad dune centered approximately x=6, shorelineZ-34, radii 190/22, amplitude +5.8
- explicit waterward depth law.

Shoreline is separately materialized downstream by the established shoreline authority.

Disposition:
EXISTS_AND_WORKS for macro coastal identity.
EXISTS_BUT_INSUFFICIENT for meso inland-to-shore terrain transition.
The coast has strong planform complexity but the landward cross-section is still primarily coastRise + one broad dune + wet-sand compression. Berm/bank/shelf variation is not yet a rich meso system.

Witness:
coastal entry around (0,-96) and adjacent shoreline defined by getHEarthCanonicalShorelineZ(0).

## CROSS-CLASS FINDINGS

1. The canonical field already contains all five terrain classes. Phase 1 does not need a new geography authority.

2. Run8B should remain representation-only. It is not the correct place to invent new landforms.

3. Gen311 semantic derivation is useful and should be retained.

4. Gen311 relief materialization is a potential competing elevation layer. It derives signals from terrain that already contains mountains/foothills/valleys and then adds large relief coefficients back onto the presented terrain. Before new meso construction, this feedback must be quantified by class.

5. Mountain development is no longer the primary gap. Foothill, valley/drainage, plain/lowland and coast cross-section have substantially thinner structural vocabularies.

6. Adaptive C can express 4-unit near-field information, so additional meso structure is no longer blocked by the previous 8-unit representation ceiling.

## CAPABILITY MATRIX

MOUNTAIN:
broad identity = EXISTS_AND_WORKS
meso hierarchy = EXISTS_BUT_INSUFFICIENT
Gen311 amplification = REDUNDANT_OR_COMPETING risk

FOOTHILL:
broad taper = EXISTS_AND_WORKS
benches/secondary ridges/slope breaks = MISSING
Gen311 foothill semantics = EXISTS_AND_WORKS
Gen311 relief amplification = REDUNDANT_OR_COMPETING risk

VALLEY/DRAINAGE:
broad valley/basin = EXISTS_AND_WORKS
flow-vector semantics = EXISTS_AND_WORKS
routed drainage corridor = MISSING
banks/downstream widening = MISSING
Gen311 valley relief = REDUNDANT_OR_COMPETING risk

PLAIN/LOWLAND:
broad lowland/grade = EXISTS_AND_WORKS
rolling undulation = EXISTS_AND_WORKS
meso swales/rises/terraces = MISSING
dedicated Gen311 lowland structure = MISSING

COAST:
planform/coastline identity = EXISTS_AND_WORKS
water depth = EXISTS_AND_WORKS
broad dune = EXISTS_AND_WORKS
meso berm/bank/shelf cross-section diversity = EXISTS_BUT_INSUFFICIENT

## NEXT DETERMINISTIC OPERATION

Before product mutation, quantify the Gen311 regional-relief contribution at the five witness regions and compare:
canonical/Run8B elevation -> Gen311 delta -> presented elevation.

Also measure slope, curvature, 8/16/32-unit local relief and the derived ridge/valley/foothill signals.

This will determine whether Phase-1 construction should:
A. modify canonical meso morphology,
B. rebalance Gen311 relief materialization,
C. do both under a single bounded correspondence contract.

Until that measurement exists, product mutation remains HELD.
