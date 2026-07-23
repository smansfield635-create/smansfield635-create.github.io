/*
 * ARCHCOIN Compass Calibration Workspace
 * Complete restored-baseline ARCHCOIN source extraction.
 * Research evidence only. No live product, admission, or production authority.
 */

export const ARCHCOIN_COMPASS_EXTRACTION = Object.freeze({
  schema: "ARCHCOIN_COMPASS_EXTRACTION_v2",
  status: "COMPLETE_RESTORED_BASELINE_EXTRACTION",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
  admissionState: "EXTRACTED_NOT_ADMITTED",
  liveProductMutationAuthorized: false,
  productionAuthority: false,

  baselineClassification: Object.freeze({
    actualImplementedArchitecture: "SIX_FILE_PRODUCT_PLUS_SHARED_UPSTREAM_COMPASS",
    sevenFilePlanetArchitectureImplementedAtEvidenceBase: false,
    planetFileStatus: "ABSENT_AT_EVIDENCE_BASE",
    planetAuthorityStatus: "PROPOSED_LATER_NOT_BASELINE_IMPLEMENTED",
    mixedAuthorityBaselinePresent: true,
    restoredInteractionsBaselinePresent: true
  }),

  sourceFiles: Object.freeze({
    planet: Object.freeze({
      path: "/products/archcoin/index.planet.js",
      status: "ABSENT",
      blob: null,
      evidence: "GitHub contents lookup returned 404 at the fixed evidence base."
    }),

    controller: Object.freeze({
      path: "/products/archcoin/index.controller.js",
      blob: "8d60a21863012d4a5ec8b6224cee845a2fd7178d",
      module: "DGB_ARCHCOIN_CONTROLLER",
      version: "7.0.0-controller-interaction-semantic-priority",
      contract: "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
      ownership: Object.freeze([
        "canonical navigation and selection state",
        "legal state and transaction transitions",
        "canonical room and route registry",
        "gesture transaction begin, preview acceptance, commit, and cancel",
        "complete-quaternion validation and normalization",
        "preview, committed, and origin quaternion custody",
        "primary-wing and primary-room validation",
        "navigation authorization and execution",
        "panel and viewport choreography",
        "reduced-motion and held-state authority",
        "semantic projection validation, storage, and publication",
        "receipts and validation"
      ]),
      explicitNonownership: Object.freeze([
        "pointer lifecycle",
        "tap-versus-drag arbitration",
        "swipe classification",
        "gesture-axis selection",
        "gesture quaternion construction",
        "direct manipulation",
        "quaternion-to-primary inference",
        "projection-to-interaction DOM application"
      ]),
      preservedCapabilities: Object.freeze([
        "ORIENTATION_TRANSACTION_PHASES",
        "ADDITIVE_FINANCIAL_TRANSACTION_PHASE_LAYER",
        "SEPARATE_NAVIGATION_AND_GESTURE_AUTHORITY",
        "EXPLICIT_HOME_COMPASS_ROUTE_AUTHORITY",
        "CANONICAL_SIXTEEN_ROOM_REGISTRY",
        "SEMANTIC_PROJECTION_STORAGE"
      ])
    }),

    interactions: Object.freeze({
      path: "/products/archcoin/index.interactions.js",
      blob: "c425ece001586db09aeb7353bfde2ab8177db7c3",
      module: "DGB_ARCHCOIN_INTERACTIONS",
      version: "2.0.0-live-product-interaction-hysteresis",
      ownership: Object.freeze([
        "pointer lifecycle",
        "tap, drag, open-space rotation, and cluster-swipe arbitration",
        "world-space quaternion proposal construction",
        "target-confidence scoring",
        "active-target custody",
        "runner-up tracking",
        "persistent target-switch hysteresis",
        "direct-grab correction",
        "pointer smoothing",
        "overlap and depth-priority interpretation",
        "release and cancellation proposals"
      ]),
      explicitNonownership: Object.freeze([
        "transaction acceptance",
        "navigation authorization",
        "route commitment",
        "canonical renderer geometry",
        "camera matrices"
      ]),
      motionEvidence: Object.freeze({
        tapMaximumDistancePx: 7,
        dragActivationDistancePx: 11,
        tapMaximumDurationMs: 650,
        touchDistanceMultiplier: 1.18,
        penDistanceMultiplier: 1.08,
        orbitRadiansPerPixel: 0.0056,
        clusterRadiansPerPixel: 0.0062,
        grabbedCorrectionRadiansPerPixel: 0.0021,
        maximumIncrementalAngle: 0.18,
        maximumGrabCorrectionAngle: 0.085,
        pointerSmoothingAlphaMouse: 0.58,
        pointerSmoothingAlphaTouch: 0.42,
        pointerSmoothingAlphaPen: 0.50,
        candidateSwitchMinimumMargin: 0.12,
        candidateSwitchMinimumPersistenceMs: 90,
        candidateSwitchMinimumFrames: 3,
        candidateSwitchCooldownMs: 120,
        minimumCommitConfidence: 0.20,
        clusterSwipeMinimumHorizontalDistancePx: 72,
        clusterSwipeMaximumVerticalDistancePx: 92,
        clusterSwipeHorizontalDominanceRatio: 1.6,
        clusterSwipeMaximumDurationMs: 560,
        clusterSwipeMinimumHorizontalVelocityPxPerMs: 0.30
      })
    }),

    crystals: Object.freeze({
      path: "/products/archcoin/index.crystals.js",
      blob: "570c8b64f803b46c3ff2eb22d650596d832467af",
      module: "DGB_ARCHCOIN_CRYSTALS",
      version: "2.0.0-controller-decoupled-crystal-renderer",
      ownership: Object.freeze([
        "crystal meshes and materials",
        "cardinal and room geometry",
        "controller-state visual interpolation",
        "crystal target positions and animation",
        "WebGL programs, buffers, and crystal drawing",
        "canonical crystal-to-semantic-control association",
        "visible-node delivery to compositor",
        "projection-record forwarding to controller",
        "renderer lifecycle and failure reporting"
      ]),
      sphereEvidence: Object.freeze({
        coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
        orientationRepresentation: "UNIT_QUATERNION",
        constellationRadii: Object.freeze([1.46, 1.28, 1.14]),
        clusterRadii: Object.freeze([1.04, 0.90, 0.84]),
        clusterCenterRadius: 0.26,
        constellationPrimaryAnchor: Object.freeze([0, 0.78, 0.625]),
        clusterPrimaryAnchor: Object.freeze([0, 0.70, 0.714]),
        latitudeAmplitude: 0.48,
        latitudeFrequency: 1.73
      }),
      visualEvidence: Object.freeze({
        cardinalScale: 0.72,
        focusedCardinalScale: 0.94,
        roomScale: 0.68,
        primaryRoomScale: 0.84,
        selectedRoomScale: 0.91,
        visualSettleSpeed: 7.4,
        transformSettleSpeed: 6.2,
        maximumYaw: 0.20,
        maximumPitch: 0.13,
        bloomDisableWidthPx: 420
      }),
      mixedAuthorityFindings: Object.freeze([
        "owns canonical sphere vectors and radii",
        "applies controller quaternions to reconstruct world positions",
        "selects visual primary identity",
        "calculates depth and alignment",
        "owns frame scheduling and WebGL draw passes",
        "mediates compositor projection records to controller"
      ])
    }),

    compositor: Object.freeze({
      path: "/products/archcoin/index.compositor.js",
      blob: "594eefa10bb7ad0583f7c3284a1e0daf28f34960",
      module: "DGB_ARCHCOIN_COMPOSITOR",
      version: "1.0.0-camera-depth-layer-orchestration",
      ownership: Object.freeze([
        "camera state and presets",
        "view and projection matrices",
        "viewport and pixel-ratio management",
        "fixed Compass-plane depth",
        "world-to-screen projection",
        "projected Compass-overlap measurement",
        "rear/front depth classification with hysteresis",
        "rear/front canvas construction",
        "rear / Compass / front / semantic layer ordering",
        "composite-pass orchestration",
        "style rollback and owned-layer disposal"
      ]),
      cameraEvidence: Object.freeze({
        transitionSpeed: 6.2,
        near: 0.1,
        far: 60,
        normalFieldOfViewDivisor: 4.85,
        mobileFieldOfViewDivisor: 4.45,
        mobileAspectThreshold: 0.82,
        depthHysteresis: 0.025,
        normalDevicePixelRatioCap: 2,
        lowPowerDevicePixelRatioCap: 1.5,
        constellationNormalEye: Object.freeze([0, 0.76, 6.05]),
        constellationMobileEye: Object.freeze([0, 0.76, 7.10]),
        constellationTarget: Object.freeze([0, 0.03, 0.06]),
        clusterNormalEye: Object.freeze([0, 0.62, 6.28]),
        clusterMobileEye: Object.freeze([0, 0.62, 7.68]),
        clusterTarget: Object.freeze([0, 0.02, 0.04])
      }),
      baselineLimitation: "Center depth and overlap are tied to the old fixed Compass visual rather than an actual world participant."
    }),

    html: Object.freeze({
      path: "/products/archcoin/index.html",
      blob: "fc1c0872fee5d0fc0caae5767cc9fb72e6850d8f",
      ownership: Object.freeze([
        "literal North, East, South, and West semantic controls",
        "Contract, Receivable, Payable, and Allocation domain identity",
        "sixteen declared room routes",
        "Home Compass semantic control",
        "scene, panel, guidance, receipt, and lens-tab surfaces",
        "accessible tab interaction in bounded page presentation runtime"
      ]),
      centerModel: Object.freeze({
        visibleModel: "FIXED_CENTER_INDEPENDENT_SIBLING",
        mount: "[data-upstream-compass-mount]",
        semanticControl: "[data-upstream-compass-control]",
        fallbackVisibleGeometryPresent: true
      }),
      preservedAccessibility: Object.freeze([
        "four cardinal buttons",
        "sixteen room declarations",
        "ARIA-controlled panel",
        "polite guidance region",
        "click tabs",
        "ArrowLeft and ArrowRight tab navigation",
        "Home and End tab navigation"
      ])
    }),

    css: Object.freeze({
      path: "/products/archcoin/index.css",
      blob: "cade394b5b1e009430a561e6c86711502f8a72a8",
      ownership: Object.freeze([
        "compact financial estate presentation",
        "fixed-center Main Compass sizing",
        "rear / Compass / front / semantic stacking",
        "responsive scene and hit-target sizing",
        "visible cardinal labels",
        "suppressed room labels",
        "focus-visible and reduced-motion presentation"
      ]),
      presentationEvidence: Object.freeze({
        maximumPageWidthPx: 1180,
        sceneHeight: "clamp(560px, 68vh, 760px)",
        compassSize: "clamp(126px, 15vw, 184px)",
        roomHitSizePx: 64,
        roomHitSizeMobilePx: 58,
        roomHitSizeCompactPx: 54,
        rearZ: 1,
        compassZ: 2,
        frontZ: 3,
        semanticZ: 4,
        guidanceZ: 7
      }),
      explicitBoundary: "CSS does not assign pointer authorization."
    })
  }),

  extractedCapabilities: Object.freeze([
    Object.freeze({
      capabilityId: "LITERAL_CARDINAL_DOMAIN_SEMANTICS",
      classification: "CANDIDATE_STANDARD",
      evidence: "North, East, South, and West map literally to Contract, Receivable, Payable, and Allocation.",
      portabilityBoundary: "Literal cardinal naming must remain a configurable semantic mode, not a universal Compass identity."
    }),
    Object.freeze({
      capabilityId: "TRANSACTIONAL_NAVIGATION_AUTHORITY_LAYER",
      classification: "EXTRACTED_CAPABILITY",
      evidence: "Controller preserves orientation, allocation, selection, preview, confirmation, settlement, route-commit, and cancellation phases.",
      portabilityBoundary: "Financial transaction semantics are page-specific; phase separation is reusable."
    }),
    Object.freeze({
      capabilityId: "TARGET_CUSTODY_AND_SWITCH_HYSTERESIS",
      classification: "EXTRACTED_CAPABILITY",
      evidence: "Interactions preserves active target, runner-up, confidence, persistence, frame-count, margin, and cooldown state.",
      portabilityBoundary: "Thresholds remain calibration evidence until cross-source tests complete."
    }),
    Object.freeze({
      capabilityId: "POINTER_TYPE_ADAPTIVE_SMOOTHING",
      classification: "EXTRACTED_CAPABILITY",
      evidence: "Mouse, touch, and pen use separate smoothing and distance multipliers.",
      portabilityBoundary: "Values require device and accessibility testing."
    }),
    Object.freeze({
      capabilityId: "EXPLICIT_HOME_COMPASS_SEMANTIC_RETURN",
      classification: "EXTRACTED_CAPABILITY",
      evidence: "Home Compass remains an explicit controller-authorized destination separate from cardinal and room targets.",
      portabilityBoundary: "Route and label remain adapter-owned."
    }),
    Object.freeze({
      capabilityId: "SEMANTIC_CONTROL_TO_RENDERED_CRYSTAL_ASSOCIATION",
      classification: "EXTRACTED_CAPABILITY",
      evidence: "Crystals relocate and associate canonical controls while CSS preserves accessible targets above visual layers.",
      portabilityBoundary: "Association is reusable; ARCHCOIN labels and routes are not."
    }),
    Object.freeze({
      capabilityId: "COMPACT_FINANCIAL_COMPASS_PRESENTATION_PROFILE",
      classification: "OPTIONAL_PRESENTATION_CAPABILITY",
      evidence: "Page and CSS preserve a compact estate, bounded scene height, reduced crystal scales, and explicit reading hierarchy.",
      portabilityBoundary: "Presentation values are optional calibration evidence."
    }),
    Object.freeze({
      capabilityId: "SEVEN_FILE_WORLD_VISUAL_PROJECTION_SEPARATION_REQUIREMENT",
      classification: "CANDIDATE_STANDARD_DERIVED_FROM_BASELINE_DEFECT",
      evidence: "The restored baseline lacks index.planet.js and leaves world geometry, world projection, and frame publication mixed across crystals and compositor.",
      portabilityBoundary: "The seven-file architecture is a corrective candidate, not an implemented baseline capability."
    })
  ]),

  preservedSuccessfulBehavior: Object.freeze([
    "canonical controller transaction and route authority",
    "literal cardinal navigation",
    "sixteen-room route registry",
    "Home Compass semantic return",
    "pointer capture and deterministic cancellation",
    "tap/drag neutral band",
    "active target custody",
    "runner-up confidence",
    "switch persistence and cooldown",
    "pointer smoothing by pointer type",
    "cluster swipe return",
    "GPU resource and context-loss handling",
    "camera presets and depth hysteresis",
    "semantic controls above visual layers",
    "keyboard-accessible lens tabs"
  ]),

  deficiencies: Object.freeze([
    "planet world authority is absent",
    "crystals owns canonical sphere geometry",
    "crystals applies quaternions to derive world positions",
    "crystals infers primary identity",
    "crystals forwards projection truth to controller",
    "crystals owns frame scheduling and draw-pass clearing",
    "compositor center reference is an old fixed Compass plane",
    "visible Home Compass geometry and semantic return control are coupled",
    "interaction motion uses pixels rather than a fully viewport-normalized camera-basis contract",
    "screen-derived projection and overlap remain part of target arbitration without world-revision custody"
  ]),

  conflicts: Object.freeze([
    "The restored baseline is not the later seven-file planet-authority architecture.",
    "Crystals is described as controller-decoupled but still owns canonical world geometry and projection mediation.",
    "Compositor owns projection but does not publish directly to controller.",
    "The fixed center is a separate Compass visual rather than the actual Audralia world participant.",
    "Controller stores semantic projection but has no canonical world or projection revision chain.",
    "Interaction quality is strong, but world-primary inference and stale-revision handling remain incomplete."
  ]),

  admissionBlockedBy: Object.freeze([
    "CROSS_COMPASS_COMPATIBILITY_MATRIX",
    "SOURCE_CONFLICT_LEDGER",
    "REFERENCE_MODEL_AUTHORITY_CONTRACT",
    "ARCHCOIN_SEVEN_FILE_INTEGRATED_IMPLEMENTATION",
    "WORLD_AND_PROJECTION_REVISION_TESTS",
    "FIXED_AXIS_AND_CAMERA_BASIS_CALIBRATION",
    "MOUSE_TOUCH_PEN_BEHAVIORAL_TESTS",
    "MOBILE_VISUAL_AND_ACCESSIBILITY_ACCEPTANCE",
    "PRESERVATION_AUDIT"
  ])
});
