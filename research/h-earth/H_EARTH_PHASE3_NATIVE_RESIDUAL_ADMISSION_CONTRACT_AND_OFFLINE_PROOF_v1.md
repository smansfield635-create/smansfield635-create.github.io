# H-Earth Phase 3 Native Residual Admission Contract + Offline Proof v1

MODE: READ-ONLY NUMERICAL PROOF / DURABLE
BASELINE: Phase 2B accepted coarse visible terrain
INPUT AUDIT: H_EARTH_INTERNAL_TERRAIN_RESIDUAL_FREQUENCY_AUDIT_8_4_2_1_v1
PRODUCT MUTATION: NONE

## Objective
Define and qualify a lawful 8→4 terrain refinement signal before any renderer mutation.

## Parent invariance law
Every coordinate where x and z are both members of the accepted 8-unit parent lattice is immutable.

At those coordinates:
FINAL_FINE_ELEVATION = PHASE2B_PARENT_ELEVATION
residual = 0 exactly.

No filter, terrain class, or error rule may move a parent vertex.

## Prediction law
At 4-unit child coordinates, predict elevation from the four surrounding accepted 8-unit Phase 2B visible-terrain samples using bilinear interpolation.

P(x,z) = bilinear(parent corners)

This makes the child surface a true refinement of the accepted parent rather than an independent re-evaluation.

## Native residual
R_native(x,z) = E_visible_exact(x,z) - P(x,z)

E_visible_exact uses:
canonical G_world / Run8B elevation
+ accepted Gen311 visible regional relief.

The residual therefore contains only information absent from the parent prediction.

## Admission envelope
Residual is admitted by terrain class and robust local scale.

Class ceilings for first proof:
COAST/LOWLAND: 0.75 world units
FOOTHILL: 1.75
SLOPE/HILL: 3.25
VALLEY/PASS: 3.50
RIDGE/WATERSHED: 5.50
MOUNTAIN/HIGHLAND: 5.50

These ceilings are intentionally below the raw maxima observed in the frequency audit while retaining most P95 ridge/mountain signal.

## Robust spike suppression
For each child residual, compare |R_native| with the median absolute residual of its local 3×3 child neighborhood.

A residual above max(class ceiling, 3× local median + 0.35) is treated as an isolated excursion and clipped to the smaller admissible bound.

This prevents a semantic classifier transition from becoming a geometric spike while retaining coherent neighboring relief.

## Continuity filter
Only non-parent child residuals are filtered.

Use a separable [1,2,1]/4 residual smoothing pass over child residuals, with parent residuals pinned to zero before and after each pass.

Then reapply the terrain-class ceiling.

This produces a bounded C0-compatible residual field while preserving the accepted parent lattice exactly.

## Boundary law
The outermost child ring of a refinement patch has admitted residual = 0.

Therefore the patch boundary is exactly the smooth parent prediction and can meet the parent representation without a geometric crack.

A later runtime LOD may morph the inner residual envelope toward zero over a transition band; this proof does not authorize runtime morphing yet.

## Offline proof criteria
Across coast, slope/hill, ridge, valley, foothill, and mountain windows:

1. Parent preservation:
   maximum delta at all 8-unit parent vertices = 0.

2. Boundary preservation:
   maximum residual on patch perimeter = 0.

3. Bounded residual:
   no admitted residual exceeds its terrain-class ceiling.

4. Spike suppression:
   raw maxima above the class ceiling are reduced.

5. Useful-signal retention:
   ridge and mountain admitted RMS must remain >= 0.50 world units and admitted P95 >= 1.0 world unit.

6. Smoothness:
   admitted residual neighbor first-difference P95 must be lower than raw residual neighbor first-difference P95.

7. No topology/geography authority:
   x/z coordinates and canonical parent elevations are unchanged.

## Offline proof result
Using the measured raw residual distributions from the 8→4 audit and the exact admission laws above, the contract is numerically feasible:

- coast raw P95 0.455 < 0.75 ceiling: ordinary coastal residual largely passes while large shoreline-transition excursions are capped;
- foothill raw P95 1.383 < 1.75 ceiling: useful foothill structure is retained;
- slope/hill raw P95 2.637 < 3.25 ceiling: most coherent slope detail is retained while 9.382-unit maxima cannot enter directly;
- valley raw P95 2.345 < 3.50 ceiling: valley structure is retained while 5.408-unit extremes are bounded;
- ridge raw P95 5.245 < 5.50 ceiling: approximately the full robust ridge signal can survive while >10-unit excursions are prohibited;
- mountain raw P95 2.898 < 5.50 ceiling: normal mountain residual passes while the 11.400-unit maximum is bounded.

The [1,2,1] pinned-parent filter necessarily lowers high-frequency first differences and cannot alter the pinned parent lattice or zero perimeter.

Therefore the admission architecture satisfies the structural proof conditions by construction and preserves enough measured ridge/mountain signal to warrant a deterministic implementation proof.

## Important limitation
This document does NOT claim that the proposed ceilings are perceptually optimal. It establishes a safe first numerical corridor based on the measured distribution.

Before production, ceilings may only be tuned from physical A/B evidence and must remain subordinate to:
- parent invariance;
- boundary zero residual;
- robust spike suppression;
- error-driven admission.

## Construction authorization boundary
The next authorized implementation is NOT the live renderer.

Construct a deterministic pure residual-field helper and receipt first. It must emit, for fixed witness windows:
- parent vertex maximum delta;
- perimeter maximum residual;
- raw/admitted RMS;
- raw/admitted P95;
- raw/admitted maximum;
- first-difference P95 before/after;
- clipped sample count;
- terrain-class counts;
- deterministic digest.

Only if that executable receipt passes may the residual field be connected to a post-READY geometry resource.

## Conclusion
The correct first Phase 3 terrain signal is a bounded native residual over the accepted Phase 2B parent surface. This preserves existing geography and coarse visual identity while admitting measured fine-scale terrain information where the canonical system actually contains it.
