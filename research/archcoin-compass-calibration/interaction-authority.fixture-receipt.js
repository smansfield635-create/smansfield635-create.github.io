export const UNIVERSAL_COMPASS_INTERACTION_AUTHORITY_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_INTERACTION_AUTHORITY_FIXTURE_EXECUTION_RECEIPT_v1",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  status: "SOURCE_READY_EXECUTION_PENDING",
  sourcePath:
    "/research/archcoin-compass-calibration/interaction-authority.fixtures.js",
  targetPath: "/assets/compass-model/compass.interactions.js",
  testCount: 12,
  declaredCases: Object.freeze([
    "POINTER_DOWN_CREATES_PENDING_WITHOUT_TRANSACTION",
    "NEUTRAL_BAND_REMAINS_PENDING",
    "DRAG_THRESHOLD_STARTS_TRANSACTION_ONCE",
    "WORLD_EVALUATION_SUPPLIES_CONTROLLER_PREVIEW",
    "REDUCED_MOTION_REMAINS_FUNCTIONAL",
    "TAP_RELEASE_DOES_NOT_ROTATE_OR_COMMIT",
    "DRAG_RELEASE_COMMITS",
    "DRAG_CANCEL_AND_INTERRUPT_CANCEL_CONTROLLER",
    "PENDING_INTERRUPT_HAS_ZERO_CONTROLLER_SIDE_EFFECT",
    "MISMATCHED_POINTER_IS_REJECTED_WITHOUT_MUTATION",
    "UNSUPPORTED_POINTER_KIND_REJECTED",
    "COMPOSITOR_PRIMARY_API_IS_NOT_REQUIRED"
  ]),
  sourceFetchBackVerified: true,
  repositoryNativeFixtureExecution: false,
  localNetworkedCheckoutAvailable: false,
  passClaimed: false,
  failClaimed: false,
  authorityBoundaries: Object.freeze({
    interactionAuthorityCreatesCanonicalWorldTruth: false,
    interactionAuthorityCreatesCanonicalPrimaryIdentity: false,
    interactionAuthorityCommitsNavigation: false,
    worldProposalEvaluationRequired: true,
    controllerPreviewAcceptanceRequired: true,
    compositorPrimaryInferenceRequired: false,
    reducedMotionRemainsFunctional: true,
    productionAuthority: false,
    liveRebuildAuthority: false,
    referenceModelAuthority: false
  }),
  nextExecutionRequirement:
    "RUN_COMMITTED_FIXTURE_SOURCE_IN_REPOSITORY_NATIVE_NODE_ENVIRONMENT"
});
