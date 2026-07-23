/*
 * ARCHCOIN Compass Calibration Workspace
 * Law Compass file-level extraction.
 * Research evidence only. No live implementation or production authority.
 */

export const ARCHCOIN_LAW_COMPASS_EXTRACTION = Object.freeze({
  schema: "ARCHCOIN_LAW_COMPASS_EXTRACTION_v2",
  status: "FILE_LEVEL_EXTRACTION_COMPLETE",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  sourceFamily: "LAW_COMPASS_SOURCE_FAMILY",

  sourceFiles: Object.freeze({
    controller: Object.freeze({
      path: "/laws/index.controller.js",
      blob: "5711c261d7fac96a3622ef80e98dacca845f7d96",
      module: "DGB_LAWS_CONTROLLER",
      version: "1.0.0-law-compass-controller-authority"
    }),

    interactions: Object.freeze({
      path: "/laws/index.interactions.js",
      blob: "6ee820886846cfe102d030389ca18ed4a13a1a23",
      module: "DGB_LAWS_INTERACTIONS",
      version: "1.0.1-pointer-gesture-interpreter-category-admission-tune"
    }),

    crystals: Object.freeze({
      path: "/laws/index.crystals.js",
      blob: "3483e4a08913eb02f48fb2f981b1f7bcce1a5d4d",
      module: "DGB_LAWS_CRYSTALS",
      version: "1.1.0-controller-decoupled-crystal-renderer-with-planet-participant"
    }),

    compositor: Object.freeze({
      path: "/laws/index.compositor.js",
      blob: "66ca5b4f1fd25c591e74b109ba9ab6368b2c64aa",
      module: "DGB_LAWS_COMPOSITOR",
      version: "1.0.0-camera-depth-layer-orchestration"
    }),

    pageRuntime: Object.freeze({
      path: "/laws/index.js",
      blob: "cf3aa03f9330f1bba05fd02a32657173a5a37ee4",
      receipt: "LAWS_PURPLE_RULE_CHAMBER_PAIR_RUNTIME_TNT_v1"
    }),

    html: Object.freeze({
      path: "/laws/index.html",
      blob: "28c1041d0ad75f03a39092dc04b8785769ef4a6f",
      contract: "LAWS_COMPASS_WORLD_PASS_PLANET_AND_SHOWROOM_COSMOS_READY_HTML_TNT_v2_3_0"
    }),

    css: Object.freeze({
      path: "/laws/index.css",
      inspectionRole: "presentation, responsive scale, semantic label and page-shell behavior"
    })
  }),

  evidenceClasses: Object.freeze({
    SOURCE_EVIDENCE: "verified source behavior and constants",
    EXTRACTED_CAPABILITY: "page-neutral mechanism recovered from evidence",
    CANDIDATE_STANDARD: "proposed reusable rule requiring cross-compass review",
    ADMITTED_STANDARD: "not established by this artifact"
  }),

  responsibilitySeparation: Object.freeze({
    controllerOwns: Object.freeze([
      "canonical navigation state",
      "legal state transitions",
      "route-registry admission from declared DOM placeholders",
      "category and law selection authority",
      "gesture transaction begin, preview acceptance, commit, and cancel",
      "complete-quaternion validation and normalization",
      "preview, committed, and gesture-origin orientation custody",
      "explicit primary-direction and primary-law validation",
      "panel choreography",
      "reduced-motion and held-state authority",
      "semantic projection fact storage and publication",
      "receipts and validation"
    ]),

    interactionsOwns: Object.freeze([
      "pointer lifecycle",
      "tap-versus-drag arbitration",
      "orbit and cluster gesture proposals",
      "drag-axis and sensitivity selection",
      "quaternion construction",
      "direct-grab tracking and grabbed-object correction",
      "projected hit testing",
      "front, Compass, rear interaction priority",
      "release-swipe classification",
      "click suppression following motion"
    ]),

    crystalsOwns: Object.freeze([
      "category and law visual geometry",
      "materials and shaders",
      "controller-state visual interpolation",
      "world target generation",
      "canonical semantic-control association",
      "optional planet-participant admission",
      "projection-record forwarding"
    ]),

    compositorOwns: Object.freeze([
      "camera presets and transitions",
      "view and projection matrices",
      "pixel-ratio and viewport management",
      "fixed Compass visual-plane depth",
      "world-to-screen projection",
      "Compass-overlap measurement",
      "rear and front classification with hysteresis",
      "rear, Compass, front, semantic layer ordering",
      "style rollback and owned-layer disposal"
    ]),

    pageRuntimeOwns: Object.freeze([
      "lightweight law-diamond drift variables",
      "single-open law cards",
      "hash-open card behavior",
      "route status receipts",
      "reduced-motion shutdown",
      "pagehide animation cleanup",
      "visible debug-receipt suppression"
    ]),

    htmlOwns: Object.freeze([
      "declared category and law identities",
      "declared routes",
      "accessible controls",
      "page-specific law copy and evidence posture",
      "mounting surfaces and data contracts"
    ])
  }),

  motionAndSensitivityEvidence: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION",

    gestureParameters: Object.freeze({
      dragActivationDistancePx: 7,
      tapMaximumDistancePx: 8,
      tapMaximumDurationMs: 650,
      orbitRadiansPerPixel: 0.0062,
      clusterRadiansPerPixel: 0.007,
      grabbedCorrectionRadiansPerPixel: 0.0028,
      maximumIncrementalAngle: 0.24,
      maximumGrabCorrectionAngle: 0.12,
      reducedMotionMultiplier: 0.72,
      clusterSwipeMinimumHorizontalDistancePx: 72,
      clusterSwipeMaximumVerticalDistancePx: 92,
      clusterSwipeHorizontalDominanceRatio: 1.6,
      clusterSwipeMaximumDurationMs: 560,
      clusterSwipeMinimumHorizontalVelocityPxPerMs: 0.3
    }),

    ambientMotionParameters: Object.freeze({
      timeScale: 0.52,
      horizontalAmplitudePx: "clamp(8, fieldWidth * 0.022, 18)",
      verticalAmplitudePx: "clamp(6, fieldHeight * 0.015, 13)",
      foregroundAmplitudeMultiplier: 0.58,
      motionPatterns: Object.freeze([
        "sin(p) by sin(2p)",
        "sin(2p) by sin(p)"
      ]),
      reducedMotionDisablesAmbientMotion: true,
      pagehideStopsAnimationFrame: true
    }),

    dragMapping: Object.freeze({
      horizontalPointerAxis: "WORLD_Y",
      verticalPointerAxis: "WORLD_X",
      ordinaryDragWorldZRoll: false,
      worldSpaceComposition: "DELTA_QUATERNION_MULTIPLIES_CURRENT_QUATERNION"
    }),

    visualInterpolation: Object.freeze({
      crystalVisualSettleSpeed: 7.4,
      crystalTransformSettleSpeed: 6.2,
      compositorCameraTransitionSpeed: 6.2,
      maximumDeltaSeconds: 0.05
    })
  }),

  hitCorridorEvidence: Object.freeze({
    priorityOrder: Object.freeze([
      "FRONT_CRYSTAL",
      "COMPASS",
      "REAR_CRYSTAL"
    ]),

    priorityWeights: Object.freeze({
      front: 300,
      compass: 200,
      rear: 100,
      inactive: 0
    }),

    projectedHitRadius: Object.freeze({
      minimumPx: 32,
      maximumPx: 124,
      scale: 1.36
    }),

    categoryFallbackCorridor: Object.freeze({
      enabledInConstellation: true,
      scale: 1.18,
      minimumPx: 42,
      maximumPx: 148
    }),

    compassHitZoneCalibration: Object.freeze({
      verticalShiftPx: -44,
      heightScale: 0.64,
      widthScale: 0.86
    }),

    overlapPolicy: Object.freeze([
      "front records remain highest priority",
      "rear category records remain tappable in constellation even when Compass-overlapping",
      "rear law records retain stricter Compass-overlap suppression",
      "semantic controls consume the same projection facts used by visual classification"
    ])
  }),

  cameraAndProjectionEvidence: Object.freeze({
    fieldOfViewDivisors: Object.freeze({
      normal: 4.85,
      mobile: 4.45
    }),

    mobileAspectThreshold: 0.82,
    depthHysteresis: 0.025,
    normalDevicePixelRatioCap: 2,
    lowPowerDevicePixelRatioCap: 1.5,
    lowPowerHardwareConcurrencyThreshold: 4,

    constellationCamera: Object.freeze({
      normalEye: Object.freeze([0, 0.76, 6.05]),
      mobileEye: Object.freeze([0, 0.76, 7.10]),
      target: Object.freeze([0, 0.03, 0.06])
    }),

    clusterCamera: Object.freeze({
      normalEye: Object.freeze([0, 0.62, 6.28]),
      mobileEye: Object.freeze([0, 0.62, 7.68]),
      target: Object.freeze([0, 0.02, 0.04])
    })
  }),

  extractedCapabilities: Object.freeze([
    Object.freeze({
      capabilityId: "STRICT_CONTROLLER_INTERACTION_RENDERER_COMPOSITOR_SEPARATION",
      candidateStandard: "Canonical state, pointer interpretation, visual geometry, and camera projection should remain separately owned and communicate through explicit records and proposals.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "COMPLETE_QUATERNION_PROPOSAL_CONTRACT",
      candidateStandard: "Interactions should propose complete normalized quaternions and primary identities; controllers should validate, accept, commit, or cancel them without reconstructing pointer intent.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "HIGH_SENSITIVITY_BOUNDED_INCREMENTAL_MOTION_PROFILE",
      candidateStandard: "Fast motion may be provided through calibrated radians-per-pixel and bounded incremental angles rather than by weakening transaction or normalization requirements.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "DIRECT_GRAB_WITH_BOUNDED_CORRECTION",
      candidateStandard: "A grabbed projected target may remain under pointer custody through a smaller bounded correction quaternion distinct from general orbit sensitivity.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "PROJECTION_DERIVED_HIT_CORRIDORS",
      candidateStandard: "Hit corridors should derive from current projection records, depth class, visible radius, overlap state, and page-calibrated minimum and maximum bounds.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "CATEGORY_SPECIFIC_OVERLAP_EXCEPTION",
      candidateStandard: "A page may calibrate limited overlap exceptions for essential top-level targets without granting the same exception to deeper semantic members.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "SYNCHRONIZED_CAMERA_AND_VISUAL_INTERPOLATION",
      candidateStandard: "Camera transition and node interpolation should use bounded frame deltas and compatible settle rates so visual motion remains coherent without sharing authority.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "OPTIONAL_NON_ROUTING_CENTER_PARTICIPANT",
      candidateStandard: "A center planet or other participant may join the shared visual pass while remaining non-routing, non-click-authoritative, and external to crystal geometry authority.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "LIGHTWEIGHT_AMBIENT_PRESENTATION_RUNTIME",
      candidateStandard: "Ambient page motion may remain a separate lightweight optional layer with reduced-motion disablement and deterministic pagehide cleanup.",
      admissionState: "EXTRACTED"
    }),

    Object.freeze({
      capabilityId: "DECLARED_DOM_ROUTE_REGISTRY",
      candidateStandard: "Page-specific routes and semantic identities should be declared by the page shell and admitted by the controller rather than invented inside reusable motion or rendering code.",
      admissionState: "EXTRACTED"
    })
  ]),

  conflictsAndLimits: Object.freeze([
    "Law Compass direction names, law identities, routes, copy, evidence posture, and visual theme are page-specific identity.",
    "Exact sensitivity, radius, camera, and interpolation values are calibration evidence, not universal constants.",
    "The general screen-derived drag axis permits both orbit and cluster motion across changing axes; this is a capability fact, not an admitted fixed-axis cluster standard.",
    "The category overlap exception is useful only when bounded by semantic level and page context; a universal overlap bypass would be unsafe.",
    "The lightweight index.js ambient drift is separate from the quaternion compass engine and must not be confused with canonical orientation state.",
    "The planet participant is optional and non-routing; it must not become mandatory center authority for every Compass.",
    "No source file claims runtime, visual, production, or deployment acceptance through this extraction."
  ]),

  admissionBlockedBy: Object.freeze([
    "SHOWROOM_COMPASS_FILE_LEVEL_EXTRACTION",
    "ARCHCOIN_COMPASS_FILE_LEVEL_EXTRACTION",
    "CROSS_COMPASS_CAPABILITY_MATRIX_COMPLETION",
    "CROSS_COMPASS_CONFLICT_LEDGER_COMPLETION",
    "UNIVERSAL_STANDARD_ADMISSION_DECISIONS"
  ]),

  admissionState: "EXTRACTED_NOT_ADMITTED",
  productionAuthority: false,
  liveProductMutationAuthorized: false
});
