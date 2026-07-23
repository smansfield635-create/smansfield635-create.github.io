/*
 * ARCHCOIN Cross-Compass Calibration Chamber
 * Bounded readiness contract for the first live-calibration lane.
 * Audit pass does not grant live mutation authority.
 */

export const ARCHCOIN_STAGE_1_READINESS_CONTRACT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_READINESS_CONTRACT_v1",
  status: "CONDITIONAL_RESEARCH_READINESS_LIVE_MUTATION_BLOCKED",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  targetBaseline: "RESTORED_FUNCTIONAL_ARCHCOIN_SIX_FILE_BASELINE",
  sevenFileArchitectureImplemented: false,
  liveArchcoinMutationAuthorized: false,
  productionAuthority: false,

  controllingCorrection: Object.freeze({
    originalStageName: "FIXED_AXIS_AND_SHARED_CLUSTER_ORBIT",
    auditFinding: "The original stage combines two different authorities and cannot be admitted as one controller/interactions-only change.",
    requiredSplit: Object.freeze([
      "STAGE_1A_FIXED_AXIS_GESTURE_BASIS",
      "STAGE_1B_SHARED_CLUSTER_SEAT_AND_ORBIT_RELATION"
    ])
  }),

  mathematicalContractRequiredBeforeMutation: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "COMPLETE_NORMALIZED_UNIT_QUATERNION",
    domainsIndependent: Object.freeze(["CONSTELLATION", "ACTIVE_CLUSTER"]),
    clusterFrameRequired: true,
    exactAxisBasis: "UNRESOLVED",
    exactPitchPolicy: "UNRESOLVED",
    exactSeatPolicy: "UNRESOLVED",
    exactRadiusPolicy: "UNRESOLVED",
    exactPrimaryAnchorRelation: "UNRESOLVED",
    cumulativeRollPolicy: "PROHIBITED_FOR_ARCHCOIN_CLUSTER",
    independentMemberDrift: "PROHIBITED",
    signConvention: "UNRESOLVED",
    cameraBasisDependency: "MUST_BE_EXPLICIT_IF_USED",
    reducedMotionBehavior: "FUNCTIONAL_ROTATION_AND_SELECTION_MUST_REMAIN_AVAILABLE"
  }),

  stage1A: Object.freeze({
    id: "STAGE_1A_FIXED_AXIS_GESTURE_BASIS",
    purpose: "Replace only the cluster pointer-to-quaternion basis while preserving controller authority and all target-custody behavior.",
    candidateMinimumMutationFiles: Object.freeze([
      "/products/archcoin/index.interactions.js"
    ]),
    conditionalMutationFiles: Object.freeze([
      "/products/archcoin/index.controller.js"
    ]),
    controllerMutationAllowedOnlyWhen: Object.freeze([
      "the accepted payload schema must declare an axis or frame identity",
      "orientation revision or stale-preview validation must change",
      "canonical commit validation must enforce the admitted cluster-frame contract"
    ]),
    requiredReadOnlyDependencies: Object.freeze([
      "/products/archcoin/index.controller.js",
      "/products/archcoin/index.crystals.js",
      "/products/archcoin/index.compositor.js"
    ]),
    preservationLocks: Object.freeze([
      "orbit motion mapping remains unchanged unless separately authorized",
      "tap and drag thresholds remain unchanged",
      "pointer-specific smoothing remains unchanged",
      "target switch margin remains 0.12",
      "target persistence remains 90 ms",
      "target switch requires three frames",
      "target cooldown remains 120 ms",
      "direct-grab correction remains active",
      "open-space rotation remains active",
      "cluster return swipe classification remains unchanged",
      "controller selection, passage, and navigation authority remain unchanged"
    ]),
    requiredTests: Object.freeze([
      "identity quaternion remains identity",
      "positive and negative horizontal motion produce opposite signed rotations about one admitted axis",
      "vertical-only motion follows the admitted pitch policy and cannot introduce roll",
      "mixed diagonal motion cannot escape the admitted cluster frame",
      "increment caps remain enforced",
      "quaternion output remains finite and normalized",
      "direct-grab correction uses the same admitted frame",
      "cancel restores the exact gesture origin",
      "mouse, touch, and pen preserve smoothing and target custody",
      "ordinary drag cannot trigger return or navigation"
    ]),
    readiness: "BLOCKED_PENDING_EXACT_AXIS_AND_PITCH_DECISION"
  }),

  stage1B: Object.freeze({
    id: "STAGE_1B_SHARED_CLUSTER_SEAT_AND_ORBIT_RELATION",
    purpose: "Prove or correct the crystal-owned canonical room-seat relation after the gesture frame is defined.",
    currentOwnerAtBaseline: "/products/archcoin/index.crystals.js",
    baselineEvidence: Object.freeze({
      clusterRadii: Object.freeze([1.04, 0.90, 0.84]),
      clusterCenterRadius: 0.26,
      clusterPrimaryAnchor: Object.freeze([0, 0.70, 0.714]),
      latitudeAmplitude: 0.48,
      latitudeFrequency: 1.73,
      mixedAuthority: true
    }),
    candidateMinimumMutationFiles: Object.freeze([
      "/products/archcoin/index.crystals.js"
    ]),
    noMutationException: "Crystals may remain unchanged only if a source-level and executable proof establishes that all four seats already share one coherent admitted relation and that the observed defect is exclusively input-axis mapping.",
    currentNoMutationProof: false,
    conditionalMutationFiles: Object.freeze([
      "/products/archcoin/index.interactions.js",
      "/products/archcoin/index.controller.js"
    ]),
    requiredReadOnlyDependencies: Object.freeze([
      "/products/archcoin/index.compositor.js"
    ]),
    requiredTests: Object.freeze([
      "all four members consume one cluster quaternion",
      "pairwise seat relations remain constant through full permitted rotation",
      "seat angular order never swaps",
      "cluster center remains stable",
      "radius policy remains within admitted tolerance",
      "no member-specific phase or ambient offset moves a target independently during acquisition",
      "primary inference is deterministic for identical world and projection facts",
      "projection remains finite through the entire admitted motion corridor"
    ]),
    readiness: "BLOCKED_PENDING_SEAT_GEOMETRY_PROOF_OR_CRYSTALS_SCOPE_AUTHORIZATION"
  }),

  twoFileAssumptionAudit: Object.freeze({
    assumption: "STAGE_1_CAN_BE_CONTROLLER_AND_INTERACTIONS_ONLY",
    result: "NOT_ESTABLISHED_FOR_COMBINED_STAGE",
    boundedFinding: "Interactions can own fixed-axis gesture generation. Controller can remain unchanged or enforce acceptance. Shared cluster-seat geometry is currently crystal-owned. Therefore the combined fixed-axis/shared-orbit stage cannot be honestly limited to controller and interactions without first proving the existing crystal seat relation already satisfies the admitted mathematical contract.",
    permittedConclusion: "STAGE_1A_MAY_BE_INTERACTIONS_ONLY_OR_INTERACTIONS_PLUS_CONTROLLER",
    prohibitedConclusion: "STAGE_1_COMBINED_TWO_FILE_SCOPE_IS_ALREADY_VALID"
  }),

  minimumFileScopeByOutcome: Object.freeze({
    fixedAxisGestureGeneration: Object.freeze({
      required: Object.freeze(["index.interactions.js"]),
      conditional: Object.freeze(["index.controller.js"]),
      verifyOnly: Object.freeze(["index.crystals.js", "index.compositor.js"])
    }),
    canonicalOrientationAcceptance: Object.freeze({
      requiredWhenContractChanges: Object.freeze(["index.controller.js"]),
      otherwise: "VERIFY_ONLY"
    }),
    sharedClusterWorldRelation: Object.freeze({
      requiredUnlessExistingRelationIsProven: Object.freeze(["index.crystals.js"]),
      verifyOnly: Object.freeze(["index.compositor.js"])
    }),
    worldToScreenConsequences: Object.freeze({
      default: "COMPOSITOR_VERIFY_ONLY_DURING_STAGE_1",
      mutationCondition: "Projection schema, stale-revision rejection, or depth policy changes; otherwise defer to Foundation B."
    })
  }),

  baselinePreservationTests: Object.freeze([
    "literal cardinal and financial identities unchanged",
    "sixteen route records unchanged",
    "Home Compass semantic return unchanged",
    "controller state machine and route authority unchanged",
    "constellation behavior unchanged during Stage 1A and 1B",
    "target hysteresis constants unchanged",
    "pointer smoothing constants unchanged",
    "tap/drag neutral band unchanged",
    "direct-grab behavior preserved",
    "return-swipe thresholds unchanged",
    "accessible controls and keyboard tabs unchanged",
    "HTML and CSS byte-identical unless a later stage explicitly authorizes them",
    "no planet file introduced",
    "no center visual substitution introduced"
  ]),

  acceptanceSequence: Object.freeze([
    "admit exact mathematical axis, sign, pitch, seat, radius, and anchor contract in research workspace",
    "record exact baseline blobs for every potentially affected file",
    "construct complete replacement body for one authorized file at a time",
    "reverse-diff preservation audit against the locked source",
    "syntax and static contract validation",
    "executable quaternion and seat-relation tests",
    "mouse, touch, pen, interruption, and reduced-motion tests",
    "branch-only live visual and physical-device inspection",
    "explicit retain or complete revert",
    "new accepted baseline identity before proceeding"
  ]),

  blockers: Object.freeze([
    "EXACT_FIXED_AXIS_BASIS_NOT_ADMITTED",
    "EXACT_PITCH_POLICY_NOT_ADMITTED",
    "EXACT_CLUSTER_SEAT_RELATION_NOT_ADMITTED",
    "CRYSTALS_NO_MUTATION_PROOF_ABSENT",
    "STAGE_1A_AND_1B_TEST_FIXTURES_NOT_CREATED",
    "LIVE_VISUAL_AND_PHYSICAL_DEVICE_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_MUTATION_AUTHORITY_WITHHELD"
  ]),

  auditClassification: Object.freeze({
    workspaceAuditPassed: true,
    stage1ResearchContractComplete: true,
    stage1ImplementationReady: false,
    liveMutationAuthority: false,
    productionAuthority: false
  })
});