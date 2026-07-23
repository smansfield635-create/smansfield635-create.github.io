/*
 * ARCHCOIN Compass Calibration Workspace
 * Main Compass file-level extraction.
 * Research evidence only. No live implementation or production authority.
 */

export const ARCHCOIN_MAIN_COMPASS_EXTRACTION = Object.freeze({
  schema: "ARCHCOIN_MAIN_COMPASS_EXTRACTION_v1",
  status: "FILE_LEVEL_EXTRACTION_COMPLETE",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  sourceFamily: "MAIN_COMPASS_SOURCE_FAMILY",
  sourceFiles: Object.freeze({
    controller: Object.freeze({
      path: "/assets/compass/compass.controller.js",
      blob: "259e0d16b55c3986fec57db37fc057861483344a",
      contract: "DGB_COMPASS_CONTROLLER_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3"
    }),
    crystals: Object.freeze({
      path: "/assets/compass/compass.crystals.js",
      blob: "3d6427cbdb961576468d4aab05c0e4987549cea3",
      contract: "DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_HARDENED_v4"
    }),
    pageMount: Object.freeze({
      path: "/index.html",
      role: "semantic declarations, mounting, routes, and accessible controls"
    })
  }),
  evidenceClasses: Object.freeze({
    SOURCE_EVIDENCE: "verified source behavior and constants",
    EXTRACTED_CAPABILITY: "page-neutral mechanism recovered from evidence",
    CANDIDATE_STANDARD: "proposed reusable rule requiring compatibility testing",
    ADMITTED_STANDARD: "not established by this artifact"
  }),
  controllerExtraction: Object.freeze({
    ownership: Object.freeze([
      "constellation state",
      "cluster state",
      "selection state",
      "panel presentation",
      "orientation preview, commit, and cancellation",
      "Mirrorland lifecycle preservation",
      "route navigation",
      "return-to-orbit behavior",
      "receipts and failure state"
    ]),
    explicitNonOwnership: Object.freeze([
      "crystal rendering",
      "rendered hit-target calculation",
      "pointer binding",
      "drag-velocity classification",
      "spherical projection",
      "Mirrorland geometry"
    ]),
    stateMachine: Object.freeze([
      "CONSTELLATION",
      "CLUSTER_OPEN",
      "ROOM_SELECTED",
      "MIRRORLAND_REVEALING",
      "MIRRORLAND_FOCUSED",
      "MIRRORLAND_WITHDRAWING",
      "NAVIGATING",
      "HELD"
    ]),
    orientationPhases: Object.freeze([
      "IDLE",
      "PREVIEW",
      "SETTLING",
      "COMMITTED",
      "CANCELLED"
    ]),
    custodyMechanisms: Object.freeze([
      "separate constellation orientation and committed constellation orientation",
      "independent orientation, committed orientation, gesture origin, phase, and revision per cardinal cluster",
      "preview does not itself open a cluster, select a room, descend a panel, or navigate",
      "commit increments the relevant orientation revision",
      "cancel restores the gesture origin or last committed orientation",
      "direct cardinal selection may commit canonical focus through the controller",
      "room selection remains distinct from cluster manipulation",
      "return-to-orbit remains distinct from constellation restoration"
    ]),
    navigationMechanisms: Object.freeze([
      "cardinal selection opens the corresponding cluster after controller validation",
      "room selection validates membership in the selected cluster",
      "panel descent occurs only after room selection and a deferred state recheck",
      "return-to-orbit restores the cluster scene and scroll position without silently restoring the constellation",
      "route entry remains a separate explicit controller action",
      "Mirrorland withdrawal and renderer failure restore preserved Compass state"
    ])
  }),
  motionExtraction: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION",
    constellation: Object.freeze({
      radii: Object.freeze({
        horizontal: 1.50,
        vertical: 1.34,
        depth: 1.16
      }),
      primaryAnchor: Object.freeze([0, 0.78, 0.625]),
      cardinalVectors: Object.freeze({
        north: Object.freeze([0, 1, 0]),
        east: Object.freeze([1, 0, 0]),
        south: Object.freeze([0, -1, 0]),
        west: Object.freeze([-1, 0, 0])
      })
    }),
    cluster: Object.freeze({
      radii: Object.freeze({
        horizontal: 1.36,
        vertical: 1.18,
        depth: 1.04
      }),
      primaryAnchor: Object.freeze([0, 0.70, 0.714]),
      latitudeAmplitude: 0.48,
      latitudeFrequency: 1.73
    }),
    gestureParameters: Object.freeze({
      dragDeadZonePx: 6,
      maximumTapDistancePx: 12,
      minimumDragDistancePx: 8,
      radiansPerViewport: "Math.PI * 1.12",
      settleSpeed: 7.4,
      sampleWindowMs: 140,
      maximumSamples: 18,
      flickMaximumDurationMs: 260,
      flickMinimumDistancePx: 52,
      flickMinimumAverageVelocityPxPerMs: 0.55,
      flickMinimumReleaseVelocityPxPerMs: 0.72,
      flickMinimumDirectionalRatio: 1.28,
      flickMaximumPauseBeforeReleaseMs: 90,
      flickMaximumPathEfficiencyLoss: 0.22
    }),
    extractedMechanisms: Object.freeze([
      "one rigid constellation sphere rather than independent screen-position drift",
      "one rigid room-cluster sphere for the active wing",
      "viewport-normalized quaternion motion",
      "world-space primary-anchor alignment",
      "target-to-anchor release settlement",
      "rotated-vector depth, scale, prominence, halo, semantic stacking, and hit priority",
      "tap, controlled drag, settlement, and quick return flick as separate gesture outcomes",
      "pointer capture and interruption recovery",
      "suppression of accidental semantic clicks after rendered motion"
    ])
  }),
  extractedCapabilities: Object.freeze([
    Object.freeze({
      capabilityId: "SEPARATE_CONSTELLATION_AND_CLUSTER_ORIENTATION_CUSTODY",
      candidateStandard: "A reusable compass controller should preserve constellation and cluster orientation domains independently and revision them independently.",
      dependencies: Object.freeze([
        "controller state machine",
        "quaternion orientation records",
        "renderer preview proposals"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "PREVIEW_COMMIT_CANCEL_TRANSACTION_BOUNDARY",
      candidateStandard: "Manipulation preview, canonical orientation commitment, cancellation, semantic selection, and route navigation must remain distinct operations.",
      dependencies: Object.freeze([
        "gesture origin custody",
        "committed orientation custody",
        "revision increments",
        "state eligibility checks"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "SHARED_RIGID_SPHERICAL_TRANSFORM",
      candidateStandard: "Members of a constellation or active cluster should transform through one shared quaternion world relation rather than independent screen-space motion.",
      dependencies: Object.freeze([
        "canonical unit vectors",
        "quaternion normalization",
        "world-position projection"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "WORLD_SPACE_PRIMARY_ANCHOR_SETTLEMENT",
      candidateStandard: "Controlled drag release should settle a retained or selected world target toward a defined world-space primary anchor without authorizing navigation.",
      dependencies: Object.freeze([
        "primary anchor",
        "target custody",
        "quaternion-from-unit-vectors settlement",
        "controller commit validation"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "MULTI_SIGNAL_DRAG_FLICK_CLASSIFICATION",
      candidateStandard: "A return flick should require bounded duration, travel, velocity, directional dominance, path efficiency, and release-pause evidence rather than release alone.",
      dependencies: Object.freeze([
        "recent pointer samples",
        "path metrics",
        "cluster-state eligibility"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "DEPTH_AWARE_VISUAL_AND_SEMANTIC_PROJECTION",
      candidateStandard: "Visual prominence and semantic hit priority should derive from the same rotated three-dimensional node relation.",
      dependencies: Object.freeze([
        "camera projection",
        "depth calculation",
        "semantic proxy positioning"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "INTERRUPTION_SAFE_POINTER_AND_RENDERER_LIFECYCLE",
      candidateStandard: "Pointer cancellation, lost capture, blur, visibility changes, page hiding, partial initialization failure, reduced motion, and renderer context loss require deterministic recovery paths.",
      dependencies: Object.freeze([
        "gesture cancellation API",
        "resource rollback",
        "click suppression",
        "receipt publication"
      ]),
      admissionState: "EXTRACTED"
    }),
    Object.freeze({
      capabilityId: "NAVIGATION_SEPARATION_AND_PASSAGE_CUSTODY",
      candidateStandard: "Visual settlement, semantic selection, panel movement, return-to-orbit, constellation restoration, Mirrorland restoration, and route navigation must remain separate controller-governed passages.",
      dependencies: Object.freeze([
        "controller state machine",
        "preserved-state record",
        "route registry",
        "viewport scheduling"
      ]),
      admissionState: "EXTRACTED"
    })
  ]),
  conflictsAndLimits: Object.freeze([
    "The Main Compass renderer combines world geometry, camera projection, hit testing, gesture interpretation, and rendering in one source; this is evidence of capability, not an automatically reusable authority layout.",
    "Main Compass cardinal names are page identity and must not become mandatory reusable semantics.",
    "Exact numeric constants are source evidence and calibration candidates, not admitted universal constants.",
    "The extraction does not authorize changes to Main Compass, ARCHCOIN, Laws, Mirrorland, or any production route."
  ]),
  admissionBlockedBy: Object.freeze([
    "CROSS_COMPASS_DEPENDENCY_MAP",
    "LAW_COMPASS_MOTION_EXTRACTION",
    "MIRRORLAND_READABILITY_EXTRACTION",
    "ARCHCOIN_COMPATIBILITY_MATRIX",
    "FIXED_AXIS_CALIBRATION_ANALYSIS",
    "BEHAVIORAL_TEST_CORRIDOR",
    "VISUAL_AND_ACCESSIBILITY_ACCEPTANCE"
  ]),
  productionAuthority: false,
  liveProductMutationAuthorized: false
});
