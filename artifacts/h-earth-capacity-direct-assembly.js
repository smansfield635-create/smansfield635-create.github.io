__H_EARTH_CAPACITY_PART_01__
    span: 512
  }),

  origin: deepFreeze({
    x: 0,
    y: 0,
    z: 0
  }),
__H_EARTH_CAPACITY_PART_02__
      0,
      1,
      2
    ]),

    maximumNormalizedDeltaPxPerEvent: 1200,

    normalizedZoomScalePerPixel: deepFreeze({
__H_EARTH_CAPACITY_PART_03__

    rendererMayOwnCameraState: false,
    rendererMayOwnViewportState: false,
    rendererMayOwnNavigationConstraints: false,
    rendererMayInventLayerOrder: false,

    rendererPassClaimCreated: false,
    visualPassClaimCreated: false
__H_EARTH_CAPACITY_PART_04__
    ]
  ];

  for (
    const [field, value]
    of requiredFiniteFields
  ) {
    const passed =
__H_EARTH_CAPACITY_PART_05__
      vector.x,
      vector.y,
      vector.z
    );

  const tolerance =
    H_EARTH_3D_CAMERA_CAPACITY
      .resolvedCameraPoseEligibility
__H_EARTH_CAPACITY_PART_06__
        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE',
            cameraEvaluation.eligible,
            cameraEvaluation
          )
        );

__H_EARTH_CAPACITY_PART_07__
    )
  );

  if (!requiredFieldsPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REQUIRED_FIELDS_MISSING',
        'The compositor frame is missing required fields.',
__H_EARTH_CAPACITY_PART_08__
  rendererImportedSuccessfully = false,
  rendererConstructedSuccessfully = false,
  compositorFrameConsumed = false,
  compositorFrameRevisionRecorded = false,
  appliedFrameRevision = null,
  previouslyAppliedFrameRevision = null
} = {}) {
  const checks = [];
__H_EARTH_CAPACITY_PART_09__
      cameraStateAuthorityDenied: true
    }),

    index: deepFreeze({
      publicStageIdsProvided: true,
      mountEligibilityEvaluatorProvided: true,
      routeActivationClaimNotProvided: true
    }),

    diagnostic: deepFreeze({
      capacityReadSurfacesProvided: true,
      runtimeValidationClaimNotProvided: true
    })
  });

/**
 * Static capacity preflight.
 */
export const H_EARTH_3D_CAPACITY_PREFLIGHT = (() => {
  const issues = [];
  const checks = [];

  const publicIdsComplete =
    Object.values(
      H_EARTH_3D_PUBLIC_STAGE_IDS
    ).every(
      isNonEmptyString
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_PUBLIC_STAGE_IDS_COMPLETE',
      publicIdsComplete
    )
  );

  const viewportShapeComplete =
    isPlainObject(
      H_EARTH_3D_VIEWPORT_CAPACITY
        .minimumUsableViewport
    ) &&
    isPlainObject(
      H_EARTH_3D_VIEWPORT_CAPACITY
        .preferredMinimumViewport
    ) &&
    isPlainObject(
      H_EARTH_3D_VIEWPORT_CAPACITY
        .preferredDesignViewport
    ) &&
    isPlainObject(
      H_EARTH_3D_VIEWPORT_CAPACITY
        .supportedAspectRatio
    ) &&
    isPlainObject(
      H_EARTH_3D_VIEWPORT_CAPACITY
        .pixelRatioCapacity
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_VIEWPORT_SHAPE_COMPLETE',
      viewportShapeComplete
    )
  );

  const cameraShapeComplete =
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .initialProjectionCandidate
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .positionBounds
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .targetBounds
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .yawDegrees
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .pitchDegrees
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .verticalFovDegrees
    ) &&
    isPlainObject(
      H_EARTH_3D_CAMERA_CAPACITY
        .futureControllerCapacity
        .zoomScale
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_CAMERA_SHAPE_COMPLETE',
      cameraShapeComplete
    )
  );

  const interactionShapeComplete =
    isPlainObject(
      H_EARTH_3D_INTERACTION_CAPACITY.pointer
    ) &&
    isPlainObject(
      H_EARTH_3D_INTERACTION_CAPACITY.touch
    ) &&
    isPlainObject(
      H_EARTH_3D_INTERACTION_CAPACITY.wheel
    ) &&
    isPlainObject(
      H_EARTH_3D_INTERACTION_CAPACITY.keyboard
    ) &&
    isPlainObject(
      H_EARTH_3D_INTERACTION_CAPACITY.inertia
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_INTERACTION_SHAPE_COMPLETE',
      interactionShapeComplete
    )
  );

  const renderFrameShapeComplete =
    isPlainObject(
      H_EARTH_3D_RENDER_FRAME_CAPACITY
    ) &&
    isPlainObject(
      H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY
    ) &&
    isPlainObject(
      H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_RENDER_FRAME_SHAPE_COMPLETE',
      renderFrameShapeComplete
    )
  );

  const controllerIntentShapeComplete =
    isPlainObject(
      H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
    ) &&
    Array.isArray(
      H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
        .acceptedIntentTypes
    );

  checks.push(
    createCapacityCheck(
      'CAPACITY_CONTROLLER_INTENT_SHAPE_COMPLETE',
      controllerIntentShapeComplete
    )
  );

  const evaluatorsAvailable = [
    evaluateHEarth3DViewportCapacity,
    evaluateHEarth3DCameraCapacity,
    evaluateHEarth3DCameraPose,
    evaluateHEarth3DInteractionIntent,
    evaluateHEarth3DControllerIntentEligibility,
    evaluateHEarth3DNodeBudget,
    evaluateHEarth3DCompositorFrameEligibility,
    evaluateHEarth3DRendererFrameConsumption,
    evaluateHEarth3DMountEligibility
  ].every(
    (evaluator) =>
      typeof evaluator ===
      'function'
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_EVALUATORS_AVAILABLE',
      evaluatorsAvailable
    )
  );

  for (
    const check
    of checks
  ) {
    if (!check.passed) {
      issues.push(
        createCapacityIssue(
          'CAPACITY_PREFLIGHT_CHECK_FAILED',
          `Capacity preflight check ${check.id} failed.`
        )
      );
    }
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'FRAME_BASED_CAPACITY_PREFLIGHT_ELIGIBLE'
        : 'FRAME_BASED_CAPACITY_PREFLIGHT_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    compositorFrameConstructed: false,
    rendererFrameConsumed: false,
    controllerIntentDispatched: false,
    routeMounted: false,

    runtimeActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
})();

/**
 * Static capacity receipt.
 */
export const H_EARTH_3D_CAPACITY_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_FRAME_BASED_EXECUTION_CAPACITY_RECEIPT',

  contractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  renewsContractId:
    'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v1',

  file:
    '/showroom/globe/h-earth/capacity.js',

  publicStageIdsDefined: true,
  routeRootIdDefined: true,
  rendererMountIdDefined: true,

  worldBoundsDefined: true,

  minimumUsableViewportDefined: true,
  preferredMinimumViewportDefined: true,
  preferredDesignViewportDefined: true,
  supportedAspectRatioDefined: true,
  pixelRatioCapacityDefined: true,
  resizeCapacityDefined: true,

  initialProjectionCandidateDefined: true,
  positionBoundsDefined: true,
  targetBoundsDefined: true,
  yawBoundsDefined: true,
  pitchBoundsDefined: true,
  verticalFovBoundsDefined: true,
  zoomScaleBoundsDefined: true,
  panCapacityDefined: true,
  resolvedCameraPoseEligibilityDefined: true,

  pointerEnvelopeDefined: true,
  touchEnvelopeDefined: true,
  wheelEnvelopeDefined: true,
  keyboardEnvelopeDefined: true,
  controllerIntentCapacityDefined: true,
  inertiaCapacityDefined: true,

  renderStageLimitsDefined: true,
  nodeBudgetDefined: true,
  renderFrameCapacityDefined: true,
  compositorFrameEligibilityDefined: true,
  rendererFrameConsumptionEligibilityDefined: true,
  mountEligibilityDefined: true,

  viewportEvaluatorDefined: true,
  cameraEvaluatorDefined: true,
  cameraPoseEvaluatorDefined: true,
  interactionIntentEvaluatorDefined: true,
  controllerIntentEvaluatorDefined: true,
  nodeBudgetEvaluatorDefined: true,
  compositorFrameEvaluatorDefined: true,
  rendererFrameConsumptionEvaluatorDefined: true,
  mountEligibilityEvaluatorDefined: true,

  providerConsumerAlignmentDefined: true,

  capacityPreflightStatus:
    H_EARTH_3D_CAPACITY_PREFLIGHT.status,

  capacityPreflightEligible:
    H_EARTH_3D_CAPACITY_PREFLIGHT.eligible,

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  compositorFrameConstructionVerified: false,
  rendererFrameConsumptionVerified: false,
  controllerIntentDispatchVerified: false,
  routeIntegrationVerified: false,
  rendererMountVerified: false,
  visualOutputInspected: false,

  nextRequired:
    'RE_EXECUTE_COMPOSITOR_AND_RENDERER_GAUGE_AGAINST_RECONCILED_CAMERA_ENVELOPE',

  ...H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
});

/**
 * Complete capacity contract.
 */
export const H_EARTH_3D_CAPACITY_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_CAPACITY_SCHEMA_VERSION,

  renewsContractId:
    'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v1',

  file:
    '/showroom/globe/h-earth/capacity.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'FRAME_BASED_EXECUTION_CAPACITY_AUTHORITY',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  bindingIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY,

  sourceReferences:
    H_EARTH_3D_CAPACITY_SOURCE_REFERENCES,

  publicStageIds:
    H_EARTH_3D_PUBLIC_STAGE_IDS,

  publicStageWorldBounds:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

  viewportCapacity:
    H_EARTH_3D_VIEWPORT_CAPACITY,

  cameraCapacity:
    H_EARTH_3D_CAMERA_CAPACITY,

  renderStageLimits:
    H_EARTH_3D_RENDER_STAGE_LIMITS,

  nodeBudget:
    H_EARTH_3D_NODE_BUDGET,

  interactionCapacity:
    H_EARTH_3D_INTERACTION_CAPACITY,

  controllerIntentCapacity:
    H_EARTH_3D_CONTROLLER_INTENT_CAPACITY,

  renderFrameCapacity:
    H_EARTH_3D_RENDER_FRAME_CAPACITY,

  compositorFrameEligibility:
    H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY,

  rendererFrameConsumptionEligibility:
    H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY,

  mountEligibility:
    H_EARTH_3D_MOUNT_ELIGIBILITY,

  providerConsumerAlignment:
    H_EARTH_3D_CAPACITY_PROVIDER_CONSUMER_ALIGNMENT,

  preflight:
    H_EARTH_3D_CAPACITY_PREFLIGHT,

  boundaryFlags:
    H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS,

  claimCeilings:
    H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
});

/**
 * Returns the immutable capacity contract.
 */
export function getHEarth3DCapacityContract() {
  return H_EARTH_3D_CAPACITY_CONTRACT;
}

/**
 * Returns the immutable capacity receipt.
 */
export function getHEarth3DCapacityReceipt() {
  return H_EARTH_3D_CAPACITY_RECEIPT;
}

/**
 * Returns the static frame-based capacity preflight.
 */
export function getHEarth3DCapacityPreflight() {
  return H_EARTH_3D_CAPACITY_PREFLIGHT;
}

/**
 * Compatibility aggregate.
 */
export const H_EARTH_3D_PUBLIC_STAGE_CAPACITY =
  H_EARTH_3D_CAPACITY_CONTRACT;

export default H_EARTH_3D_CAPACITY_CONTRACT;
