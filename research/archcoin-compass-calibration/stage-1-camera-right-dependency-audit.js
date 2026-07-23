/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1A camera-right dependency compatibility audit.
 * Research authority only. No live mutation or production authority.
 */

export const ARCHCOIN_STAGE_1_CAMERA_RIGHT_DEPENDENCY_AUDIT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_CAMERA_RIGHT_DEPENDENCY_AUDIT_v1",
  status: "PASS_NO_COMPOSITOR_SCHEMA_CHANGE_REQUIRED",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  liveMutationAuthorized: false,
  productionAuthority: false,

  evidenceSources: Object.freeze({
    interactions: Object.freeze({
      path: "/products/archcoin/index.interactions.js",
      blob: "c425ece001586db09aeb7353bfde2ab8177db7c3",
      currentDependencyState: "DOES_NOT_CONSUME_COMPOSITOR_CAMERA_DIRECTLY"
    }),
    compositor: Object.freeze({
      path: "/products/archcoin/index.compositor.js",
      blob: "594eefa10bb7ad0583f7c3284a1e0daf28f34960",
      publicSurface: "DGB_ARCHCOIN_COMPOSITOR",
      publicMethods: Object.freeze([
        "getCamera",
        "getViewMatrix",
        "getProjectionMatrix",
        "projectWorldPoint"
      ]),
      cameraRecordFields: Object.freeze([
        "eye",
        "target",
        "targetEye",
        "targetTarget",
        "fieldOfView",
        "near",
        "far"
      ])
    })
  }),

  sourceFindings: Object.freeze([
    "COMPOSITOR_ALREADY_OWNS_CAMERA_STATE_AND_PRESETS",
    "GET_CAMERA_IS_ALREADY_PUBLIC_AND_RETURNS_FINITE_EYE_AND_TARGET_VECTORS_AFTER_INITIALIZATION",
    "VIEW_MATRIX_IS_ALREADY_PUBLIC_BUT_IS_NOT_REQUIRED_FOR_RIGHT_AXIS_DERIVATION",
    "NO_CAMERA_RIGHT_FIELD_EXISTS",
    "NO_CAMERA_RIGHT_FIELD_IS_REQUIRED_BECAUSE_RIGHT_CAN_BE_DERIVED_FROM_EXISTING_CAMERA_FACTS",
    "COMPOSITOR_SOURCE_MUTATION_IS_NOT_REQUIRED",
    "COMPOSITOR_PROJECTION_OR_DEPTH_BEHAVIOR_MUST_REMAIN_UNCHANGED"
  ]),

  derivationContract: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    worldUp: Object.freeze([0, 1, 0]),
    forward: "normalize(camera.target - camera.eye)",
    unprojectedRight: "normalize(cross(forward, worldUp))",
    admittedRight: "normalize([unprojectedRight.x, 0, unprojectedRight.z])",
    fallback: Object.freeze([1, 0, 0]),
    fallbackConditions: Object.freeze([
      "COMPOSITOR_UNAVAILABLE_DURING_BOUNDED_STARTUP",
      "GET_CAMERA_NOT_AVAILABLE",
      "NONFINITE_CAMERA_FACTS",
      "CAMERA_FORWARD_DEGENERATE",
      "PROJECTED_RIGHT_XZ_LENGTH_BELOW_EPSILON"
    ]),
    signCheck: "For the restored camera looking approximately toward negative world Z, cross(forward, worldUp) resolves positive world X.",
    prohibition: "CAMERA_FORWARD_OR_SCREEN_NORMAL_CANNOT_BECOME_A_ROLL_AXIS"
  }),

  lifecycleCompatibility: Object.freeze({
    initialization: "INTERACTIONS_MAY_RESOLVE_THE_PUBLIC_COMPOSITOR_AT_RUNTIME_WITH_WORLD_X_FALLBACK",
    frameUse: "RESOLVE_RIGHT_FROM_CURRENT_CAMERA_FACTS_AT_CLUSTER_PREVIEW_TIME_OR_CACHE_PER_FRAME",
    heldState: "NO_PREVIEW_WHILE_HELD",
    compositorFailure: "FALLBACK_AXIS_PRESERVES_FUNCTION_WITHOUT_GRANTING_NAVIGATION_AUTHORITY",
    disposal: "NO_COMPOSITOR_RESOURCE_OWNERSHIP_TRANSFER",
    reducedMotion: "AXIS_UNCHANGED_SENSITIVITY_MULTIPLIER_PRESERVED"
  }),

  implementationBoundary: Object.freeze({
    primaryOwner: "/products/archcoin/index.interactions.js",
    compositorDisposition: "VERIFY_ONLY_NO_MUTATION",
    controllerDisposition: "UNCHANGED_UNLESS_PROPOSAL_SCHEMA_IS_EXPANDED",
    crystalsDisposition: "VERIFY_ONLY_NO_MUTATION",
    htmlDisposition: "NO_MUTATION",
    cssDisposition: "NO_MUTATION",
    permittedInteractionAddition: "READ_ONLY_CONSUMPTION_OF_DGB_ARCHCOIN_COMPOSITOR_GET_CAMERA",
    prohibitedAddition: "INTERACTIONS_MUST_NOT_OWN_CAMERA_STATE_CAMERA_PRESETS_OR_PROJECTION"
  }),

  requiredTestsBeforeAdmission: Object.freeze([
    "CAMERA_RIGHT_DEFAULT_PRESET_EQUALS_POSITIVE_WORLD_X_WITHIN_TOLERANCE",
    "CAMERA_RIGHT_MOBILE_PRESET_SIGN_AND_NORMALIZATION_PASS",
    "CAMERA_RIGHT_CLUSTER_PRESET_SIGN_AND_NORMALIZATION_PASS",
    "CAMERA_RIGHT_FALLBACK_PASS_WHEN_COMPOSITOR_UNAVAILABLE",
    "CAMERA_TRANSITION_DOES_NOT_INTRODUCE_AXIS_FLIP",
    "NO_ROLL_COMPONENT_FROM_VERTICAL_ONLY_CLUSTER_DRAG"
  ]),

  auditConclusion: Object.freeze({
    dependencyAvailable: true,
    compositorSchemaChangeRequired: false,
    compositorMutationAuthorized: false,
    interactionReadOnlyDependencyRequired: true,
    blockerSuperseded: "CAMERA_RIGHT_DEPENDENCY_COMPATIBILITY_NOT_PROVEN",
    admissionComplete: false,
    liveMutationAuthorized: false
  })
});
