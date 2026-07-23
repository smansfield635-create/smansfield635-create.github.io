/*
 * ARCHCOIN Cross-Compass Calibration Chamber
 * Dependency graph for bounded ARCHCOIN calibration.
 * Research-only execution map. No live mutation authority.
 */

export const ARCHCOIN_STAGE_DEPENDENCY_MAP = Object.freeze({
  schema: "ARCHCOIN_STAGE_DEPENDENCY_MAP_v1",
  status: "CORRECTED_DEPENDENCY_GRAPH_COMPLETE",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  liveArchcoinMutationAuthorized: false,
  productionAuthority: false,

  controllingDependencies: Object.freeze([
    "WORLD_AXIS_AND_SEAT_GEOMETRY_PRECEDE_PROJECTED_POSITION",
    "PROJECTED_POSITION_PRECEDES_DEPTH_LABEL_HIT_AND_CONFIDENCE",
    "TARGET_CONFIDENCE_PRECEDES_SELECTION_DAMPING_POLICY",
    "SELECTION_AND_CANCELLATION_STABILITY_PRECEDE_RETURN_RECALIBRATION",
    "CENTER_PARTICIPATION_DEPENDS_ON_PROJECTION_OVERLAP_HIT_AND_LABEL_CLEARANCE"
  ]),

  stages: Object.freeze([
    Object.freeze({
      id: "FOUNDATION_A",
      name: "WORLD_AXIS_AND_CLUSTER_SEAT_MATHEMATICAL_CONTRACT",
      purpose: "Define the exact cluster frame before changing behavior.",
      subStages: Object.freeze([
        Object.freeze({
          id: "A1",
          name: "FIXED_AXIS_GESTURE_BASIS",
          requiredDecisions: Object.freeze([
            "world-axis or camera-basis definition",
            "sign convention",
            "pointer-to-angle mapping",
            "pitch permitted, bounded, or prohibited",
            "direct-grab correction basis",
            "normalization and incremental-angle cap"
          ]),
          minimumMutationScopeCandidate: Object.freeze([
            "/products/archcoin/index.interactions.js"
          ]),
          conditionalMutationScope: Object.freeze([
            "/products/archcoin/index.controller.js"
          ]),
          controllerMutationCondition: "Only if canonical acceptance, revision, or payload validation must change; otherwise controller remains verified but unchanged.",
          requiredReadOnlyValidation: Object.freeze([
            "/products/archcoin/index.controller.js",
            "/products/archcoin/index.crystals.js",
            "/products/archcoin/index.compositor.js"
          ]),
          independentRollback: true
        }),
        Object.freeze({
          id: "A2",
          name: "SHARED_CLUSTER_SEAT_AND_ORBIT_RELATION",
          requiredDecisions: Object.freeze([
            "cluster center",
            "radius policy",
            "seat angular order",
            "seat latitude or planar policy",
            "shared transform relation",
            "primary anchor relation",
            "no independent member drift"
          ]),
          minimumMutationScopeCandidate: Object.freeze([
            "/products/archcoin/index.crystals.js"
          ]),
          conditionalMutationScope: Object.freeze([
            "/products/archcoin/index.controller.js",
            "/products/archcoin/index.interactions.js"
          ]),
          conditionForNoCrystalMutation: "A source-level proof must show that existing canonical seats already satisfy the admitted shared-orbit contract and only the input quaternion basis is defective.",
          currentProofStatus: "NOT_ESTABLISHED",
          independentRollback: true
        })
      ]),
      dependsOn: Object.freeze([]),
      blocks: Object.freeze(["FOUNDATION_B", "BEHAVIOR_C", "GESTURE_D", "CENTER_E"]),
      acceptanceGate: "A1 and A2 must each pass independently; combining them in one unreviewable Stage 1 is prohibited."
    }),

    Object.freeze({
      id: "FOUNDATION_B",
      name: "PROJECTION_DEPTH_LABEL_ANCHOR_AND_HIT_RECORD_CONTRACT",
      purpose: "Establish one frame truth after the world-seat relation is stable.",
      dependsOn: Object.freeze(["FOUNDATION_A.A1", "FOUNDATION_A.A2"]),
      requiredDecisions: Object.freeze([
        "projection-record schema",
        "world and projection revision relation",
        "stale record rejection",
        "front/rear hysteresis",
        "center overlap record",
        "label anchor record",
        "semantic hit-region derivation",
        "duplicate marker suppression state"
      ]),
      minimumMutationScopeCandidate: Object.freeze([
        "/products/archcoin/index.crystals.js",
        "/products/archcoin/index.compositor.js"
      ]),
      conditionalMutationScope: Object.freeze([
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.html",
        "/products/archcoin/index.css"
      ]),
      htmlCssCondition: "Only when projection-bound labels or duplicate-marker policy cannot be expressed through existing semantic controls and styles.",
      blocks: Object.freeze(["BEHAVIOR_C", "CENTER_E"]),
      independentRollback: true
    }),

    Object.freeze({
      id: "BEHAVIOR_C",
      name: "TARGET_CUSTODY_AMBIENT_DAMPING_SELECTION_AND_SETTLEMENT",
      purpose: "Calibrate acquisition only after projected facts are stable.",
      dependsOn: Object.freeze(["FOUNDATION_A", "FOUNDATION_B"]),
      requiredDecisions: Object.freeze([
        "target score inputs",
        "retention and switch rules",
        "settlement target and authority",
        "ambient damping trigger",
        "ambient damping rate",
        "locked, settled, keyboard-focus, and reduced-motion behavior"
      ]),
      minimumMutationScopeCandidate: Object.freeze([
        "/products/archcoin/index.interactions.js"
      ]),
      conditionalMutationScope: Object.freeze([
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.crystals.js"
      ]),
      preservationLocks: Object.freeze([
        "0.12 switch margin",
        "90 ms persistence",
        "three-frame switch requirement",
        "120 ms cooldown",
        "pointer-specific smoothing",
        "direct-grab correction"
      ]),
      preservationRule: "These values remain locked unless the stage explicitly tests and supersedes one value.",
      blocks: Object.freeze(["GESTURE_D"]),
      independentRollback: true
    }),

    Object.freeze({
      id: "GESTURE_D",
      name: "RETURN_SWIPE_RECALIBRATION_AND_CANCELLATION",
      purpose: "Recalibrate return only after ordinary drag, selection, and cancellation are stable.",
      dependsOn: Object.freeze(["FOUNDATION_A", "BEHAVIOR_C"]),
      requiredDecisions: Object.freeze([
        "distance threshold",
        "duration threshold",
        "velocity threshold",
        "directional dominance",
        "release-only requirement",
        "ordinary-drag exclusion",
        "cancel and interruption restoration"
      ]),
      minimumMutationScopeCandidate: Object.freeze([
        "/products/archcoin/index.interactions.js"
      ]),
      conditionalMutationScope: Object.freeze([
        "/products/archcoin/index.controller.js"
      ]),
      authorityLock: "Interactions propose return; controller alone validates and commits passage state.",
      independentRollback: true
    }),

    Object.freeze({
      id: "CENTER_E",
      name: "ROTATING_GLOBE_PARTICIPANT_AND_CENTER_OVERLAP_RECALIBRATION",
      purpose: "Introduce the optional center participant only after all spatial and selection contracts are stable.",
      dependsOn: Object.freeze(["FOUNDATION_A", "FOUNDATION_B", "BEHAVIOR_C", "GESTURE_D"]),
      requiredDecisions: Object.freeze([
        "center participant interface",
        "geometry source and custody",
        "scale and world depth",
        "rotation and reduced-motion policy",
        "front/rear and overlap classification",
        "center hit region",
        "label clearance",
        "failure isolation",
        "Home Compass semantic-control preservation"
      ]),
      minimumMutationScopeCandidate: Object.freeze([
        "/products/archcoin/index.planet.js",
        "/products/archcoin/index.compositor.js",
        "/products/archcoin/index.html",
        "/products/archcoin/index.css"
      ]),
      conditionalMutationScope: Object.freeze([
        "/products/archcoin/index.crystals.js",
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.interactions.js"
      ]),
      navigationLock: "The globe is visual by default and cannot acquire Home Compass navigation authority.",
      independentRollback: true
    })
  ]),

  correctedExecutionOrder: Object.freeze([
    "A1_FIXED_AXIS_GESTURE_BASIS",
    "A2_SHARED_CLUSTER_SEAT_AND_ORBIT_RELATION",
    "B_PROJECTION_DEPTH_LABEL_AND_HIT_RECORDS",
    "C_TARGET_CUSTODY_DAMPING_SELECTION_AND_SETTLEMENT",
    "D_RETURN_SWIPE_AND_CANCELLATION",
    "E_CENTER_GLOBE_AND_OVERLAP"
  ]),

  originalFiveStageAssessment: Object.freeze({
    stage1: "COMPOSITE_AND_MUST_SPLIT",
    stage2: "DEPENDS_ON_FOUNDATION_B_AND_MUST_MOVE_AFTER_IT",
    stage3: "ORDER_VALID_AFTER_SELECTION_STABILITY",
    stage4: "PART_OF_FOUNDATION_B_NOT_A_LATE_PRESENTATION_ONLY_STAGE",
    stage5: "CORRECTLY_LAST_BUT_REQUIRES_B_C_AND_D_ACCEPTANCE"
  }),

  isolationProtocol: Object.freeze([
    "One substage branch or commit corridor at a time.",
    "Complete replacement bodies only for authorized files.",
    "No later-stage constants or interfaces introduced early.",
    "Exact baseline blobs recorded before each substage.",
    "Static diff, syntax, contract, behavioral, interruption, reduced-motion, and live visual checks before retention.",
    "Rejected substage reverts completely to its recorded baseline.",
    "Accepted substage establishes a new baseline before the next begins."
  ])
});