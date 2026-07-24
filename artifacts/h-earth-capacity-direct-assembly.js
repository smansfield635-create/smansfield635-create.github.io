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
  const issues = [];

  const frameEvaluation =
    frame
      ? evaluateHEarth3DCompositorFrameEligibility(
          frame
        )
      : deepFreeze({
          eligible: false,
          status:
            'COMPOSITOR_FRAME_NOT_SUPPLIED'
        });

  checks.push(
    createCapacityCheck(
      'RENDERER_COMPOSITOR_FRAME_ELIGIBLE',
      frameEvaluation.eligible,
      frameEvaluation
    )
  );

  const suppliedChecks = {
    compositorContractIdMatches,
    capacityContractIdMatches,
    environmentContractIdMatches,
    bindingIdentityMatches,
    coordinateFrameMatches,
    requiredLayerOrderConsumed,
    requiredLayersPresent,
    primitiveBudgetWithinCapacity,
    rendererOutputModelAllowed,
    rendererImportedSuccessfully,
    rendererConstructedSuccessfully,
    compositorFrameConsumed,
    compositorFrameRevisionRecorded
  };

  for (
    const [id, passed]
    of Object.entries(suppliedChecks)
  ) {
    checks.push(
      createCapacityCheck(
        `RENDERER_${id
          .replace(/([A-Z])/g, '_$1')
          .toUpperCase()}`,
        passed,
        passed
      )
    );

    if (!passed) {
      issues.push(
        createCapacityIssue(
          'RENDERER_FRAME_CONSUMPTION_CHECK_FAILED',
          `Renderer frame-consumption check ${id} failed.`,
          id
        )
      );
    }
  }

  const revisionValuesEligible =
    (
      appliedFrameRevision ===
      null ||
      (
        Number.isInteger(
          appliedFrameRevision
        ) &&
        appliedFrameRevision >= 0
      )
    ) &&
    (
      previouslyAppliedFrameRevision ===
      null ||
      (
        Number.isInteger(
          previouslyAppliedFrameRevision
        ) &&
        previouslyAppliedFrameRevision >= 0
      )
    );

  const revisionMonotonic =
    revisionValuesEligible &&
    (
      appliedFrameRevision ===
      null ||
      previouslyAppliedFrameRevision ===
      null ||
      appliedFrameRevision >=
        previouslyAppliedFrameRevision
    );

  checks.push(
    createCapacityCheck(
      'RENDERER_FRAME_REVISION_VALUES_ELIGIBLE',
      revisionValuesEligible,
      deepFreeze({
        appliedFrameRevision,
        previouslyAppliedFrameRevision
      })
    )
  );

  checks.push(
    createCapacityCheck(
      'RENDERER_FRAME_REVISION_MONOTONIC',
      revisionMonotonic,
      deepFreeze({
        appliedFrameRevision,
        previouslyAppliedFrameRevision
      })
    )
  );

  if (!revisionValuesEligible) {
    issues.push(
      createCapacityIssue(
        'RENDERER_FRAME_REVISION_INVALID',
        'Renderer frame revisions must be non-negative integers when supplied.'
      )
    );
  }

  if (!revisionMonotonic) {
    issues.push(
      createCapacityIssue(
        'RENDERER_FRAME_REVISION_REGRESSION',
        'Renderer may not apply a compositor frame older than its previously applied frame.'
      )
    );
  }

  const rendererContractRecorded =
    rendererContractId === null ||
    isNonEmptyString(
      rendererContractId
    );

  checks.push(
    createCapacityCheck(
      'RENDERER_CONTRACT_ID_RECORDED',
      rendererContractRecorded,
      rendererContractId
    )
  );

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    rendererPreflightEligible:
      eligible,

    status:
      eligible
        ? 'RENDERER_FRAME_CONSUMPTION_ELIGIBLE'
        : 'RENDERER_FRAME_CONSUMPTION_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    frameEvaluation,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

/**
 * Compatibility renderer-consumption alias.
 */
export function evaluateHEarth3DRendererConsumption(
  options = {}
) {
  return evaluateHEarth3DRendererFrameConsumption(
    options
  );
}

/**
 * Evaluates mount eligibility.
 *
 * DOM existence and containment facts must be supplied by the route/index
 * consumer. This evaluator does not query or mutate the document.
 */
export function evaluateHEarth3DMountEligibility({
  routeRootPresent = false,
  rendererMountPresent = false,
  routeRootContainsRendererMount = false,
  routeRootIsHTMLElement = false,
  rendererMountIsHTMLElement = false,
  duplicateRouteRootCount = 0,
  duplicateRendererMountCount = 0,
  mountConnected = false,
  mountVisible = false,
  viewportEligible = false,
  compositorFrameEligible = false,
  rendererFrameConsumptionEligible = false,
  existingRendererInstanceCount = 0
} = {}) {
  const checks = [
    createCapacityCheck(
      'MOUNT_ROUTE_ROOT_PRESENT',
      routeRootPresent
    ),

    createCapacityCheck(
      'MOUNT_RENDERER_MOUNT_PRESENT',
      rendererMountPresent
    ),

    createCapacityCheck(
      'MOUNT_ROUTE_ROOT_CONTAINS_RENDERER_MOUNT',
      routeRootContainsRendererMount
    ),

    createCapacityCheck(
      'MOUNT_ROUTE_ROOT_IS_HTML_ELEMENT',
      routeRootIsHTMLElement
    ),

    createCapacityCheck(
      'MOUNT_RENDERER_MOUNT_IS_HTML_ELEMENT',
      rendererMountIsHTMLElement
    ),

    createCapacityCheck(
      'MOUNT_ROUTE_ROOT_NOT_DUPLICATED',
      duplicateRouteRootCount <= 1,
      duplicateRouteRootCount
    ),

    createCapacityCheck(
      'MOUNT_RENDERER_MOUNT_NOT_DUPLICATED',
      duplicateRendererMountCount <= 1,
      duplicateRendererMountCount
    ),

    createCapacityCheck(
      'MOUNT_CONNECTED',
      mountConnected
    ),

    createCapacityCheck(
      'MOUNT_VISIBLE',
      mountVisible
    ),

    createCapacityCheck(
      'MOUNT_VIEWPORT_ELIGIBLE',
      viewportEligible
    ),

    createCapacityCheck(
      'MOUNT_COMPOSITOR_FRAME_ELIGIBLE',
      compositorFrameEligible
    ),

    createCapacityCheck(
      'MOUNT_RENDERER_FRAME_CONSUMPTION_ELIGIBLE',
      rendererFrameConsumptionEligible
    ),

    createCapacityCheck(
      'MOUNT_RENDERER_INSTANCE_LIMIT_ELIGIBLE',
      Number.isInteger(
        existingRendererInstanceCount
      ) &&
      existingRendererInstanceCount >= 0 &&
      existingRendererInstanceCount <
        H_EARTH_3D_RENDER_STAGE_LIMITS
          .maximumMountedRendererInstances,
      existingRendererInstanceCount
    )
  ];

  const issues =
    checks
      .filter(
        (check) =>
          !check.passed
      )
      .map(
        (check) =>
          createCapacityIssue(
            'MOUNT_ELIGIBILITY_CHECK_FAILED',
            `Mount eligibility check ${check.id} failed.`,
            check.details
          )
      );

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'MOUNT_ELIGIBLE'
        : 'MOUNT_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    routeActivationClaim: false,
    rendererMountClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false
  });
}

/**
 * Compatibility mount evaluator alias.
 */
export function getHEarth3DMountEligibility() {
  return H_EARTH_3D_MOUNT_ELIGIBILITY;
}

/**
 * Returns render-stage limits.
 */
export function getHEarth3DRenderStageLimits() {
  return H_EARTH_3D_RENDER_STAGE_LIMITS;
}

/**
 * Returns node budget.
 */
export function getHEarth3DNodeBudget() {
  return H_EARTH_3D_NODE_BUDGET;
}

/**
 * Returns viewport capacity.
 */
export function getHEarth3DViewportCapacity() {
  return H_EARTH_3D_VIEWPORT_CAPACITY;
}

/**
 * Returns camera capacity.
 */
export function getHEarth3DCameraCapacity() {
  return H_EARTH_3D_CAMERA_CAPACITY;
}

/**
 * Returns interaction capacity.
 */
export function getHEarth3DInteractionCapacity() {
  return H_EARTH_3D_INTERACTION_CAPACITY;
}

/**
 * Returns render-frame capacity.
 */
export function getHEarth3DRenderFrameCapacity() {
  return H_EARTH_3D_RENDER_FRAME_CAPACITY;
}

/**
 * Static provider/consumer alignment.
 */
export const H_EARTH_3D_CAPACITY_PROVIDER_CONSUMER_ALIGNMENT =
  deepFreeze({
    environment: deepFreeze({
      primitivePlanCapacityProvided: true,
      nodeBudgetEvaluatorProvided: true,
      worldBoundsProvided: true
    }),

    compositor: deepFreeze({
      viewportCapacityProvided: true,
      initialProjectionCandidateProvided: true,
      positionBoundsProvided: true,
      targetBoundsProvided: true,
      yawBoundsProvided: true,
      pitchBoundsProvided: true,
      verticalFovBoundsProvided: true,
      zoomScaleBoundsProvided: true,
      interactionCapacityProvided: true,
      inertiaCapacityProvided: true,
      frameCapacityProvided: true,
      compositorFrameEvaluatorProvided: true
    }),

    renderer: deepFreeze({
      outputModelCapacityProvided: true,
      nodeBudgetProvided: true,
      frameConsumptionCapacityProvided: true,
      frameConsumptionEvaluatorProvided: true,
      mountEligibilityProvided: true
    }),

    controller: deepFreeze({
      publicStageIdsProvided: true,
      routeRootIdProvided: true,
      rendererMountIdProvided: true,
      inputPermissionEnvelopesProvided: true,
      intentCapacityProvided: true,
      intentEvaluatorProvided: true,
      cameraStateAuthorityDenied: true
    }),

    index: deepFreeze({
      publicStageIdsProvided: true,
      mountEligibilityEvaluatorProvided: true,
      routeActivationClaimNotProvided: true
    }),
__H_EARTH_CAPACITY_PART_10__
