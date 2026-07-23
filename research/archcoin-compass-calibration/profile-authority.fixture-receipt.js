/*
 * Universal Compass profile-authority fixture receipt.
 * Candidate research evidence only. No reference-model, rebuild, or production authority.
 */

export const UNIVERSAL_COMPASS_PROFILE_AUTHORITY_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_PROFILE_AUTHORITY_FIXTURE_RECEIPT_v1",
  status: "PASS_BOUNDED",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  profileArtifact: "/assets/compass-model/compass.profiles.js",
  fixtureArtifact:
    "/research/archcoin-compass-calibration/profile-authority.fixtures.js",
  executionEnvironment: "Node.js",
  executionMode: "DETERMINISTIC_LOCAL_SEMANTIC_MIRROR_VALIDATION",
  repositoryNativeFixtureExecution: false,
  committedFixtureSourcePresent: true,
  sourceFetchBackVerified: true,
  productionAuthority: false,
  referenceModelAuthority: false,

  summary: Object.freeze({
    testCount: 12,
    passed: 12,
    failed: 0
  }),

  passedCases: Object.freeze([
    "PARTIAL_SMOOTHING_OVERRIDE_PRESERVES_TOUCH_AND_PEN",
    "PARTIAL_PRESENTATION_OVERRIDE_PRESERVES_OTHER_PRESENTATION",
    "UNKNOWN_PROFILE_FIELD_REJECTED",
    "UNKNOWN_NESTED_PROFILE_FIELD_REJECTED",
    "NEGATIVE_RADIUS_REJECTED",
    "ZERO_PRIMARY_ANCHOR_REJECTED",
    "INCOMPLETE_DIRECT_PROFILE_SMOOTHING_REJECTED",
    "DRAG_THRESHOLD_MUST_EXCEED_TAP_THRESHOLD",
    "REDUCED_MOTION_MULTIPLIER_MUST_REMAIN_FUNCTIONAL",
    "DEPTH_CONVENTION_REQUIRED",
    "OPTIONAL_CAPABILITIES_MUST_BE_BOOLEAN",
    "PROFILE_IS_DEEPLY_IMMUTABLE"
  ]),

  classification: Object.freeze({
    recursiveSchemaAwareMergeImplemented: true,
    unknownFieldRejectionImplemented: true,
    canonicalPresentationConfigurationRequired: true,
    positiveRadiiRequired: true,
    nonzeroPrimaryAnchorsRequired: true,
    completePointerSmoothingRequired: true,
    reducedMotionMultiplierFunctional: true,
    interactionThresholdOrderingRequired: true,
    positiveCameraForwardDepthConventionRequired: true,
    optionalCapabilitiesBooleanOnly: true,
    profileDeepImmutabilityImplemented: true,
    repositoryNativeFixtureExecutionComplete: false,
    liveRebuildAuthority: false,
    productionAuthority: false
  })
});
