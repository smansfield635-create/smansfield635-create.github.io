# H-EARTH 4-UNIT DEFINITION EVIDENCE CLOSURE AND ADAPTIVE PERFORMANCE CONTRACT v1

STATUS: BINDING DEVELOPMENT EVIDENCE / MEASUREMENT CONTRACT
DATE: 2026-09-23
PRODUCT MUTATION: NONE

## AUTHORITIES

Observer-scale geometry contract: PR #4621.
4-unit construction/qualification: PR #4622.
Qualified B product blob: 56475897bfbf57a3fd3335db0d849e1d576ec97b.
Stage-1 PASS run: 35931784626.
Immutable owner-inspection candidate: 55892ee3df8d9a65625f64fad1e8ea589a5ec019.

## QUALIFIED GEOMETRY EVIDENCE

A — uniform 8-unit current Run8B:
- terrain vertices: 10,573
- terrain triangles: 20,736
- 0..18 envelope vertices: 21
- 0..18 envelope triangles: 60
- median world-space facet area: approximately 32 square units

B — uniform 4-unit candidate:
- terrain vertices: 41,881
- terrain triangles: 82,944
- 0..18 envelope vertices: 69
- 0..18 envelope triangles: 170
- median world-space facet area: approximately 8 square units

Correspondence:
- shared 8-unit parent elevation maximum delta: 0
- post-Gen311 + spherical presentation -> immutable package: exact in Stage-1 qualification
- immutable package -> GPU: Float32 precision only

## OWNER VISUAL EVIDENCE

Owner inspected immutable 4-unit candidate and supplied a traversal video.

Owner disposition:
- significant visual upgrade;
- mountains readable from every side;
- landscape definition materially improved;
- performance materially degraded.

Development interpretation:
4_UNIT_DEFINITION = VISUALLY_VALIDATED
UNIFORM_4_UNIT_COST = PERFORMANCE_UNSUITABLE
MORPHOLOGY = FROZEN
4_UNIT_VISUAL_RESULT = DEFINITION_REFERENCE

## TRANSIENT STARTUP EVIDENCE

During the same successful 4-unit inspection session, initialization temporarily reported:

firstFailureStage: FIRST_FRAME_PRESENTED
failureClass: DRAW_COMPLETED_NO_PRESENTATION
exceptionName: null
exceptionMessage: null
shaderLog: null
programLinkLog: null
webglError: null
framebufferStatus: null
contextLost: false

The environment subsequently initialized and produced the successful owner traversal.

Interpretation boundary:
- do not classify this as a renderer crash;
- do not increase the watchdog timeout as the primary repair;
- measure first-frame latency and stage timing;
- treat the event as evidence of a possible startup-performance/watchdog boundary.

## REQUIRED PERFORMANCE TRACE — NO PRODUCT MUTATION

Measure A and B under equivalent browser/runtime conditions.

Required stages where instrumentation is available without changing product semantics:
1. Run8B terrain construction
2. Gen311 regional-relief materialization
3. spherical presentation projection
4. immutable package construction
5. GPU upload-view preparation
6. renderer initialization
7. first draw completion
8. first frame presented
9. steady-state frame timing

Required outputs:
- elapsed milliseconds per stage;
- total initialization time;
- draw-to-presentation latency;
- generated terrain vertex/triangle counts;
- package/GPU buffer byte sizes;
- steady-state frame-time median/p95/max over a fixed sample window;
- dropped/late-frame count if exposed;
- watchdog threshold and whether it fires;
- device/browser/viewport context sufficient to compare A/B without identifying the owner.

Missing instrumentation must be reported MISSING rather than estimated.

## ADAPTIVE CANDIDATE GATE

Do not construct C until A/B performance evidence identifies the dominant cost boundary.

First adaptive candidate C is intentionally conservative:
- morphology identical to A/B;
- 4-unit observer-near geometry;
- 8-unit outer geometry;
- deterministic watertight transition/stitch band;
- no 2-unit geometry;
- no curvature/slope/formation-trigger expansion yet;
- no renderer/material/lighting/vegetation retuning.

C must be compared against:
A = uniform 8
B = uniform 4

C target:
- preserve the owner-validated near-field definition benefit of B;
- materially reduce B's startup and steady-state cost;
- maintain CPU -> presentation -> package -> GPU correspondence;
- no cracks, gaps, overlaps, or visible transition discontinuity.

## STOPPING LAW

Further B2 morphology work remains HELD.
Do not merge/publish uniform 4-unit B as final architecture from visual success alone.
Do not build a full clipmap/quadtree/Nanite analogue before the bounded 4/8 C experiment.
Do not mask startup cost by timeout inflation before timing evidence exists.

## NEXT DETERMINISTIC OPERATION

Construct measurement-only A/B performance instrumentation and execute it against the exact qualified 8-unit A and 4-unit B authorities.
