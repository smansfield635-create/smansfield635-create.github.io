/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1A exact fixed-axis gesture-basis candidate.
 * Research contract only. No live mutation or admission authority.
 */

export const ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT_v1",
  status: "EXACT_CANDIDATE_DEFINED_NOT_ADMITTED",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  targetBaseline: "RESTORED_FUNCTIONAL_ARCHCOIN_SIX_FILE_BASELINE",
  liveMutationAuthorized: false,
  admissionAuthority: "WITHHELD",

  coordinateContract: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "COMPLETE_NORMALIZED_UNIT_QUATERNION_XYZW",
    vectorConvention: "COLUMN_VECTOR_CONCEPTUAL_MODEL",
    quaternionComposition: "WORLD_SPACE_DELTA_LEFT_MULTIPLIES_CURRENT_ORIENTATION",
    screenXAxis: "POSITIVE_RIGHT",
    screenYAxis: "POSITIVE_DOWN",
    worldUpAxis: Object.freeze([0, 1, 0]),
    worldRightAxis: Object.freeze([1, 0, 0]),
    worldForwardAxis: Object.freeze([0, 0, 1])
  }),

  admittedCandidateBasis: Object.freeze({
    horizontalMotionAxis: "WORLD_POSITIVE_Y",
    horizontalSignConvention: "POSITIVE_SCREEN_DX_PRODUCES_POSITIVE_YAW_ABOUT_WORLD_Y",
    verticalMotionAxis: "CAMERA_RIGHT_PROJECTED_INTO_WORLD_XZ_PLANE_WITH_WORLD_X_FALLBACK",
    verticalSignConvention: "POSITIVE_SCREEN_DY_PRODUCES_POSITIVE_PITCH_ABOUT_ADMITTED_RIGHT_AXIS",
    rollAxis: "NONE",
    cumulativeRoll: "PROHIBITED",
    yawPitchCoupling: "SEPARATE_AXIS_INCREMENTS_COMPOSED_IN_FIXED_ORDER",
    compositionOrder: "PITCH_DELTA_TIMES_YAW_DELTA_TIMES_CURRENT_ORIENTATION"
  }),

  cameraRightResolution: Object.freeze({
    input: "COMPOSITOR_CAMERA_RIGHT_UNIT_VECTOR_IF_AVAILABLE",
    projection: "REMOVE_WORLD_Y_COMPONENT_THEN_NORMALIZE",
    fallback: Object.freeze([1, 0, 0]),
    prohibition: "CAMERA_FORWARD_OR_SCREEN_NORMAL_MUST_NOT_BECOME_A_ROLL_AXIS"
  }),

  pitchPolicy: Object.freeze({
    mode: "BOUNDED_FUNCTIONAL_PITCH",
    incrementalPitchAllowed: true,
    cumulativePitchLimitRadians: Math.PI * 0.32,
    cumulativePitchMeasurement: "SIGNED_SWING_ABOUT_ADMITTED_RIGHT_AXIS_RELATIVE_TO_GESTURE_ORIGIN",
    clampPolicy: "CLAMP_CANDIDATE_PITCH_BEFORE_PREVIEW_PUBLICATION",
    poleCrossing: "PROHIBITED",
    reducedMotion: "PRESERVE_FUNCTIONAL_ROTATION_WITH_EXISTING_0_72_SENSITIVITY_MULTIPLIER"
  }),

  preservedBaselineParameters: Object.freeze({
    clusterRadiansPerPixel: 0.0062,
    grabbedCorrectionRadiansPerPixel: 0.0021,
    maximumIncrementalAngle: 0.18,
    maximumGrabCorrectionAngle: 0.085,
    reducedMotionMultiplier: 0.72,
    maximumEffectiveDeltaPx: 34,
    pointerSmoothingAlphaMouse: 0.58,
    pointerSmoothingAlphaTouch: 0.42,
    pointerSmoothingAlphaPen: 0.50
  }),

  mathematicalDefinition: Object.freeze({
    yawAngle: "clamp(filteredDx * clusterRadiansPerPixel * reducedMotionMultiplier, -maximumIncrementalAngle, maximumIncrementalAngle)",
    pitchAngle: "clamp(filteredDy * clusterRadiansPerPixel * reducedMotionMultiplier, -maximumIncrementalAngle, maximumIncrementalAngle)",
    yawQuaternion: "quaternionFromAxisAngle([0,1,0], yawAngle)",
    pitchQuaternion: "quaternionFromAxisAngle(resolvedCameraRightXZ, pitchAngle)",
    deltaQuaternion: "normalize(pitchQuaternion * yawQuaternion)",
    candidateQuaternion: "normalize(deltaQuaternion * currentQuaternion)",
    directGrabCorrection: "normalize(grabCorrectionQuaternionInSameFixedBasis * candidateQuaternion)",
    previewQuaternion: "pitchClamped(candidateQuaternion, gestureOriginQuaternion, cumulativePitchLimitRadians)"
  }),

  proposalContract: Object.freeze({
    minimumPayload: Object.freeze(["quaternion", "primaryId"]),
    optionalResearchFields: Object.freeze([
      "basisId",
      "gestureOriginRevision",
      "sourceProjectionRevision"
    ]),
    basisId: "ARCHCOIN_CLUSTER_FIXED_YAW_CAMERA_RIGHT_PITCH_v1",
    controllerMutationRequired: false,
    controllerMutationCondition: "ONLY_IF_OPTIONAL_RESEARCH_FIELDS_BECOME_REQUIRED_ACCEPTANCE_FIELDS"
  }),

  invariants: Object.freeze([
    "OUTPUT_QUATERNION_FINITE",
    "OUTPUT_QUATERNION_NORMALIZED",
    "HORIZONTAL_ONLY_MOTION_HAS_NO_PITCH_OR_ROLL_COMPONENT_BEYOND_NUMERICAL_EPSILON",
    "VERTICAL_ONLY_MOTION_HAS_NO_YAW_OR_ROLL_COMPONENT_BEYOND_NUMERICAL_EPSILON",
    "MIXED_MOTION_USES_ONE_FIXED_COMPOSITION_ORDER",
    "NO_CUMULATIVE_CLUSTER_ROLL",
    "CANCEL_RESTORES_EXACT_GESTURE_ORIGIN",
    "ORBIT_MAPPING_UNCHANGED",
    "TARGET_CUSTODY_UNCHANGED",
    "RETURN_SWIPE_CLASSIFICATION_UNCHANGED"
  ]),

  tolerances: Object.freeze({
    quaternionNorm: 1e-9,
    forbiddenAxisComponent: 1e-8,
    pitchClamp: 1e-8
  }),

  unresolvedBeforeAdmission: Object.freeze([
    "LIVE_MOUSE_TOUCH_PEN_DIRECTION_ACCEPTANCE",
    "CAMERA_RIGHT_DEPENDENCY_AVAILABLE_WITHOUT_COMPOSITOR_SCHEMA_CHANGE",
    "PHYSICAL_DEVICE_PITCH_LIMIT_ACCEPTANCE",
    "DIRECT_GRAB_CORRECTION_COMPATIBILITY_TEST"
  ])
});
