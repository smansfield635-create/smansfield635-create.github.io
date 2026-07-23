/*
 * ARCHCOIN Cross-Compass Calibration Chamber
 * Closed four-family compatibility matrix.
 * Research and admission-candidate evidence only.
 */

export const ARCHCOIN_CROSS_COMPASS_CAPABILITY_MATRIX = Object.freeze({
  schema: "ARCHCOIN_CROSS_COMPASS_CAPABILITY_MATRIX_v2",
  status: "FOUR_FAMILY_MATRIX_COMPLETE",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  comparisonRule: "COMPARE_BY_CAPABILITY_NOT_PAGE_IDENTITY",
  admissionAuthority: "WITHHELD",
  productionAuthority: false,
  liveProductMutationAuthorized: false,

  sourceFamilies: Object.freeze({
    main: Object.freeze({
      id: "MAIN_COMPASS_SOURCE_FAMILY",
      extractionStatus: "FILE_LEVEL_EXTRACTION_COMPLETE",
      extractionArtifact: "/research/archcoin-compass-calibration/main-compass-extraction.js",
      strongestEvidence: Object.freeze([
        "transactional orientation custody",
        "rigid spherical constellation and cluster transforms",
        "world-space primary-anchor settlement",
        "multi-signal drag/flick classification",
        "interruption-safe lifecycle",
        "passage and navigation custody"
      ])
    }),
    law: Object.freeze({
      id: "LAW_COMPASS_SOURCE_FAMILY",
      extractionStatus: "FILE_LEVEL_EXTRACTION_COMPLETE",
      extractionArtifact: "/research/archcoin-compass-calibration/law-compass-extraction.js",
      strongestEvidence: Object.freeze([
        "strict controller/interactions/crystals/compositor separation",
        "complete quaternion proposal contract",
        "high-sensitivity bounded incremental motion",
        "direct-grab correction",
        "projection-derived hit corridors",
        "synchronized camera and visual interpolation"
      ])
    }),
    showroom: Object.freeze({
      id: "SHOWROOM_COMPASS_SOURCE_FAMILY",
      extractionStatus: "FILE_LEVEL_AND_OWNERSHIP_EXTRACTION_COMPLETE",
      extractionArtifact: "/research/archcoin-compass-calibration/showroom-compass-extraction.js",
      strongestEvidence: Object.freeze([
        "page-neutral gesture support",
        "single-frame compositor custody",
        "independent center-world participant",
        "public-stage scale and readability",
        "protected-target exclusion",
        "decorative-system independence"
      ])
    }),
    archcoin: Object.freeze({
      id: "ARCHCOIN_SOURCE_FAMILY",
      extractionStatus: "COMPLETE_RESTORED_BASELINE_EXTRACTION",
      extractionArtifact: "/research/archcoin-compass-calibration/archcoin-compass-extraction.js",
      strongestEvidence: Object.freeze([
        "literal cardinal financial semantics",
        "transactional navigation authority",
        "target custody and switch hysteresis",
        "pointer-type adaptive smoothing",
        "explicit Home Compass semantic return",
        "compact financial presentation"
      ])
    })
  }),

  dimensions: Object.freeze([
    "WORLD_AND_GEOMETRY_AUTHORITY",
    "CONTROLLER_STATE_AND_NAVIGATION",
    "POINTER_AND_GESTURE_INTERPRETATION",
    "ORIENTATION_CUSTODY",
    "SELECTION_AND_SETTLEMENT",
    "INTERRUPTION_RECOVERY",
    "CAMERA_AND_PROJECTION",
    "VISUAL_SEMANTIC_ALIGNMENT",
    "READABILITY_AND_PUBLIC_STAGE_SCALE",
    "CENTER_PARTICIPANT",
    "PASSAGE_AND_RETURN_CUSTODY",
    "ACCESSIBILITY_AND_REDUCED_MOTION"
  ]),

  rows: Object.freeze([
    Object.freeze({
      dimension: "WORLD_AND_GEOMETRY_AUTHORITY",
      main: "Crystal runtime combines canonical vectors, projection, gestures, and rendering.",
      law: "Crystal runtime owns visual geometry; compositor owns projection; optional planet remains independent.",
      showroom: "Gesture math, compositor, crystals, planet, Cosmos, Window, and Diamond are separately bounded.",
      archcoin: "Restored baseline mixes canonical world reconstruction into crystals; planet source is absent.",
      universalFinding: "World truth, visual interpretation, projection, input, and navigation must have explicit non-overlapping custody.",
      archcoinCompatibility: "REQUIRES_CORRECTIVE_SEPARATION_WITHOUT_VISUAL_BASELINE_REPLACEMENT"
    }),
    Object.freeze({
      dimension: "CONTROLLER_STATE_AND_NAVIGATION",
      main: "Strongest passage custody across focus, cluster, panel, Mirrorland, return, and route states.",
      law: "Strict canonical state, legal transitions, declared-route admission, and proposal acceptance.",
      showroom: "Controller owns four-cardinal/sixteen-child records, return passages, held state, and navigation.",
      archcoin: "Strong transactional navigation and selection authority already present.",
      universalFinding: "Controller owns canonical state, legal transitions, semantic commitment, cancellation, and route execution.",
      archcoinCompatibility: "PRESERVE_AND_EXTEND_SURGICALLY"
    }),
    Object.freeze({
      dimension: "POINTER_AND_GESTURE_INTERPRETATION",
      main: "Renderer-integrated pointer capture, sampling, drag/flick classification, and recovery.",
      law: "Dedicated interactions module owns pointer lifecycle, complete quaternion proposals, direct grab, and hit arbitration.",
      showroom: "Page-neutral gesture support is separated from DOM interaction lifecycle.",
      archcoin: "Dedicated interactions module already owns target custody, adaptive smoothing, confidence switching, and gesture proposals.",
      universalFinding: "Interactions propose motion and semantic intent; they never own canonical state or route authority.",
      archcoinCompatibility: "PRESERVE_TARGET_CUSTODY_AND_ADOPT_FIXED_AXIS_CALIBRATION"
    }),
    Object.freeze({
      dimension: "ORIENTATION_CUSTODY",
      main: "Separate committed, preview, origin, phase, and revision records for constellation and clusters.",
      law: "Controller validates complete normalized quaternion payloads and stores origin, preview, and committed state.",
      showroom: "Controller owns orientation transactions; gesture support constructs page-neutral quaternions.",
      archcoin: "Controller already validates and stores quaternion transactions, but current cluster mapping permits unwanted axis drift.",
      universalFinding: "Constellation and cluster orientation domains remain independent, complete, normalized, revisioned, and cancellable.",
      archcoinCompatibility: "KEEP_CUSTODY_REPLACE_ONLY_AXIS_MAPPING"
    }),
    Object.freeze({
      dimension: "SELECTION_AND_SETTLEMENT",
      main: "Nearest-node primary-anchor settlement and clear separation between settlement, selection, and navigation.",
      law: "Projection hit corridors, front/Compass/rear priority, direct-grab retention, and canonical primary inference.",
      showroom: "Protected-target exclusion, projection-aware semantic arbitration, and readiness gating.",
      archcoin: "Best existing target-custody system: switch margin, persistence, frame threshold, cooldown, and pointer smoothing.",
      universalFinding: "Selection must be stable, projection-grounded, hysteretic, and independent from uncontrolled ambient motion.",
      archcoinCompatibility: "PRESERVE_ARCHCOIN_HYSTERESIS_AND_IMPORT_MAIN_LAW_SETTLEMENT_DISCIPLINE"
    }),
    Object.freeze({
      dimension: "INTERRUPTION_RECOVERY",
      main: "Broadest explicit recovery coverage for pointer, visibility, renderer, and partial initialization failure.",
      law: "Pointer transaction cancellation and page-runtime cleanup are separated from controller authority.",
      showroom: "Independent subsystems pause, resume, fail, and dispose without becoming Compass dependencies.",
      archcoin: "Pointer capture, release, cancellation, and suppression behavior are present but require complete cross-subsystem validation.",
      universalFinding: "Every active gesture and visual participant requires deterministic cancel, cleanup, and non-navigation failure behavior.",
      archcoinCompatibility: "PRESERVE_AND_TEST"
    }),
    Object.freeze({
      dimension: "CAMERA_AND_PROJECTION",
      main: "Camera and hit projection are coupled into the crystal runtime.",
      law: "Compositor owns camera matrices, depth layers, viewport, and projection records.",
      showroom: "Single-frame compositor publishes one camera truth and depth classification with hysteresis.",
      archcoin: "Compositor correctly owns camera and projection, but center overlap is measured against a fixed sibling visual.",
      universalFinding: "One compositor frame must govern camera, projection, depth, hit records, and front/rear classification.",
      archcoinCompatibility: "PRESERVE_COMPOSITOR_AND_REPLACE_CENTER_OVERLAP_MODEL_WHEN_GLOBE_IS_ADMITTED"
    }),
    Object.freeze({
      dimension: "VISUAL_SEMANTIC_ALIGNMENT",
      main: "Visual depth, scale, labels, semantic stacking, and hit priority derive from rotated vectors.",
      law: "Projection records drive semantic controls; categories receive a bounded overlap exception.",
      showroom: "Semantic fallback controls remain aligned with compositor records and protected visual zones.",
      archcoin: "Semantic-control association exists, but detached labels and fixed-center overlap create competing coordinate systems.",
      universalFinding: "Visible objects, labels, and semantic hit regions derive from the same projection record and retained target identity.",
      archcoinCompatibility: "REQUIRES_LABEL_ATTACHMENT_AND_DUPLICATE_MARKER_SUPPRESSION"
    }),
    Object.freeze({
      dimension: "READABILITY_AND_PUBLIC_STAGE_SCALE",
      main: "Strong functional readability and cluster capacity.",
      law: "Compact scale with responsive camera and projected hit enlargement.",
      showroom: "Strongest public-stage scale, responsive framing, fallback visibility, and narrative readability.",
      archcoin: "Compact financial presentation is strong, but cluster labels compete during motion.",
      universalFinding: "Readability parameters are profile-specific; semantic clarity and accessible hit size are invariant.",
      archcoinCompatibility: "PRESERVE_COMPACT_PROFILE_WITH_STATE_DRIVEN_LABEL_STABILITY"
    }),
    Object.freeze({
      dimension: "CENTER_PARTICIPANT",
      main: "Center Compass is an independent semantic and visual control.",
      law: "Optional non-routing planet participant can enter the shared render pass.",
      showroom: "Independent Audralia-derived rotating planet is visible but has no navigation authority.",
      archcoin: "Visible center is a fixed sibling Compass fallback bound to an upstream semantic return control.",
      universalFinding: "Center visual participation and center semantic navigation authority must remain separate contracts.",
      archcoinCompatibility: "ADOPT_SHOWROOM_STYLE_ROTATING_GLOBE_AS_VISUAL_PARTICIPANT_WHILE_PRESERVING_HOME_RETURN_AUTHORITY"
    }),
    Object.freeze({
      dimension: "PASSAGE_AND_RETURN_CUSTODY",
      main: "Explicitly separates cluster return, Return To Orbit, constellation restoration, Mirrorland restoration, and navigation.",
      law: "Release-only cluster swipe requests return; controller decides legality.",
      showroom: "Explicit return-to-orbit and return-to-Main-Compass passages are controller owned.",
      archcoin: "Explicit Home Compass semantic return and cluster swipe proposals already exist.",
      universalFinding: "Return gestures propose a passage; controller validates the exact destination and preserved state.",
      archcoinCompatibility: "PRESERVE_AUTHORITY_AND_RECALIBRATE_GESTURE_THRESHOLDS_ONLY"
    }),
    Object.freeze({
      dimension: "ACCESSIBILITY_AND_REDUCED_MOTION",
      main: "Keyboard correspondence, semantic controls, reduced motion, and recovery are integrated.",
      law: "Declared DOM controls, widened mobile corridors, reduced-motion multiplier, and ambient shutdown.",
      showroom: "Fallback controls, responsive hit targets, protected controls, and independent decorative suspension.",
      archcoin: "Accessible controls, keyboard lens tabs, compact responsive presentation, and pointer-adaptive behavior exist.",
      universalFinding: "Reduced motion may remove ambient animation but cannot remove selection, rotation, return, labels, or semantic access.",
      archcoinCompatibility: "PRESERVE_AND_VALIDATE"
    })
  ]),

  universalCandidates: Object.freeze([
    "EXPLICIT_AUTHORITY_SEPARATION",
    "TRANSACTIONAL_QUATERNION_CUSTODY",
    "INDEPENDENT_CONSTELLATION_AND_CLUSTER_ORIENTATION",
    "SHARED_CLUSTER_WORLD_RELATION",
    "PROJECTION_GROUNDED_VISUAL_AND_SEMANTIC_ALIGNMENT",
    "HYSTERETIC_TARGET_CUSTODY",
    "SETTLEMENT_SELECTION_AND_NAVIGATION_SEPARATION",
    "CENTER_VISUAL_AND_CENTER_NAVIGATION_SEPARATION",
    "DETERMINISTIC_INTERRUPTION_RECOVERY",
    "PROFILED_NOT_UNIVERSAL_NUMERICAL_CONSTANTS"
  ]),

  completeness: Object.freeze({
    main: true,
    law: true,
    showroom: true,
    archcoin: true,
    rowsComplete: true,
    conflictsResolved: false,
    universalAdmissionComplete: false
  })
});