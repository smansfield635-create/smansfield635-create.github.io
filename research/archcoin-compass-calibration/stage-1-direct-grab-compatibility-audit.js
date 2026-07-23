/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1A direct-grab compatibility audit.
 * Research authority only. No live mutation or production authority.
 */

export const ARCHCOIN_STAGE_1_DIRECT_GRAB_COMPATIBILITY_AUDIT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_DIRECT_GRAB_COMPATIBILITY_AUDIT_v1",
  status: "PASS_WITH_SINGLE_BUILDER_AND_POST_COMPOSITION_PITCH_CLAMP_REQUIRED",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  liveMutationAuthorized: false,
  productionAuthority: false,

  evidenceSource: Object.freeze({
    path: "/products/archcoin/index.interactions.js",
    blob: "c425ece001586db09aeb7353bfde2ab8177db7c3",
    relevantFunctions: Object.freeze([
      "createGrabRecord",
      "latestProjectionForGrab",
      "grabbedCorrectionDelta",
      "filteredPointerIncrement",
      "buildIncrementalQuaternion",
      "submitPreview"
    ])
  }),

  restoredBehavior: Object.freeze({
    grabIdentity: "RETAINED_SEMANTIC_TARGET_ID_AND_KIND",
    pointerOffset: "POINTER_MINUS_PROJECTED_TARGET_AT_GRAB_TIME",
    correctionDelta: "DESIRED_PROJECTED_POSITION_MINUS_LATEST_PROJECTED_POSITION",
    activationThresholdPx: 0.75,
    correctionSensitivityRadiansPerPixel: 0.0021,
    maximumCorrectionAngleRadians: 0.085,
    reducedMotionMultiplierPreserved: true,
    targetSwitchRebindsGrabRecord: true,
    correctionCurrentlyUsesSameFree_SCREEN_INCREMENT_BUILDER_AS_ORDINARY_MOTION: true
  }),

  compatibilityFinding: Object.freeze({
    directGrabMayRemain: true,
    correctionGeometryMayRemainScreenSpace: true,
    freeAxisQuaternionBuilderMayNotRemainForClusterCorrection: true,
    ordinaryClusterMotionAndGrabCorrectionMustUseSameAdmittedFixedBasis: true,
    correctionMustNotReintroduceRoll: true,
    correctionMustNotBypassCumulativePitchLimit: true,
    orbitDirectGrabMappingRemainsUnchanged: true,
    targetCustodyAndSwitchHysteresisRemainUnchanged: true
  }),

  admittedCandidateComposition: Object.freeze({
    movement: "movementCandidate = fixedBasisDelta(filteredDx, filteredDy) * currentQuaternion",
    correction: "correctionCandidate = fixedBasisDelta(correctionDx, correctionDy, grabbedCorrectionSensitivity, maximumGrabCorrectionAngle) * movementCandidate",
    finalClamp: "previewQuaternion = pitchClamp(normalize(correctionCandidate), gestureOriginQuaternion, cumulativePitchLimit)",
    ordering: "CORRECTION_LEFT_MULTIPLIES_MOVEMENT_CANDIDATE_THEN_FINAL_PITCH_CLAMP",
    fallback: "IF_NO_ACTIVE_GRAB_OR_CORRECTION_LENGTH_LESS_THAN_OR_EQUAL_TO_0_75_USE_MOVEMENT_CANDIDATE",
    prohibition: "DO_NOT_APPLY_FREE_SCREEN_PLANE_AXIS_AFTER_FIXED_BASIS_MOVEMENT"
  }),

  preservationLocks: Object.freeze([
    "DIRECT_GRAB_ENABLED",
    "POINTER_OFFSET_PRESERVED",
    "LATEST_PROJECTION_RECONCILIATION_PRESERVED",
    "TARGET_SWITCH_REBINDS_GRAB_RECORD",
    "GRABBED_CORRECTION_SENSITIVITY_0_0021_PRESERVED",
    "MAXIMUM_GRAB_CORRECTION_ANGLE_0_085_PRESERVED",
    "REDUCED_MOTION_MULTIPLIER_PRESERVED",
    "ACTIVE_TARGET_CUSTODY_PRESERVED",
    "RUNNER_UP_CONFIDENCE_PRESERVED",
    "SWITCH_MARGIN_PERSISTENCE_FRAME_AND_COOLDOWN_PRESERVED",
    "PREVIEW_PAYLOAD_REMAINS_QUATERNION_AND_PRIMARY_ID"
  ]),

  requiredTestsBeforeAdmission: Object.freeze([
    "DIRECT_GRAB_HORIZONTAL_CORRECTION_USES_WORLD_Y_ONLY",
    "DIRECT_GRAB_VERTICAL_CORRECTION_USES_RESOLVED_CAMERA_RIGHT_ONLY",
    "DIRECT_GRAB_MIXED_CORRECTION_NORMALIZES_OUTPUT",
    "DIRECT_GRAB_CORRECTION_CANNOT_CREATE_ROLL",
    "DIRECT_GRAB_CORRECTION_RESPECTS_CUMULATIVE_PITCH_LIMIT",
    "DIRECT_GRAB_TARGET_SWITCH_REBINDS_POINTER_OFFSET",
    "DIRECT_GRAB_REDUCED_MOTION_REMAINS_FUNCTIONAL",
    "ORBIT_DIRECT_GRAB_BEHAVIOR_UNCHANGED",
    "CANCEL_RESTORES_GESTURE_ORIGIN_AFTER_GRAB_CORRECTION"
  ]),

  implementationBoundary: Object.freeze({
    primaryOwner: "/products/archcoin/index.interactions.js",
    controllerMutationRequired: false,
    compositorMutationRequired: false,
    crystalsMutationRequired: false,
    proposalSchemaChangeRequired: false,
    requiredRefactor: "ONE_CLUSTER_FIXED_BASIS_INCREMENT_BUILDER_CONSUMED_BY_MOVEMENT_AND_GRAB_CORRECTION",
    requiredClampPlacement: "AFTER_MOVEMENT_AND_CORRECTION_COMPOSITION_BEFORE_PREVIEW_PUBLICATION"
  }),

  auditConclusion: Object.freeze({
    compatible: true,
    compatibilityIsConditionalOnSingleFixedBasisBuilder: true,
    blockerSuperseded: "DIRECT_GRAB_CORRECTION_COMPATIBILITY_NOT_PROVEN",
    fixedAxisSourceChangeConstructed: false,
    mathematicalAdmissionComplete: false,
    liveMutationAuthorized: false
  })
});
