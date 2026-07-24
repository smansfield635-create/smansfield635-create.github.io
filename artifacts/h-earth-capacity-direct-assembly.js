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
  });

/**
 * Mount eligibility.
 */
export const H_EARTH_3D_MOUNT_ELIGIBILITY = deepFreeze({
  requiredPublicStageIds: deepFreeze([
    H_EARTH_3D_PUBLIC_STAGE_IDS.routeRootId,
    H_EARTH_3D_PUBLIC_STAGE_IDS.rendererMountId
  ]),

  optionalPublicStageIds: deepFreeze([
    H_EARTH_3D_PUBLIC_STAGE_IDS.statusId,
    H_EARTH_3D_PUBLIC_STAGE_IDS.fallbackId,
    H_EARTH_3D_PUBLIC_STAGE_IDS.hudId,
    H_EARTH_3D_PUBLIC_STAGE_IDS.inspectionPanelId
  ]),

  routeRootRequired: true,
  rendererMountRequired: true,

  rendererMountMustBeHTMLElement: true,
  routeRootMustContainRendererMount: true,

  duplicateRendererMountIdsPermitted: false,
  duplicateRouteRootIdsPermitted: false,

  nonZeroViewportRequired: true,
  viewportCapacityEligibilityRequired: true,
  compositorFrameEligibilityRequired: true,
  rendererFrameConsumptionEligibilityRequired: true,

  oneRendererInstanceMaximum: true,

  detachedMountPermitted: false,
  hiddenMountPermitted: false,

  routeActivationImplied: false,
  rendererPassImplied: false,
  visualPassImplied: false
});

/**
 * Claim ceilings.
 */
export const H_EARTH_3D_CAPACITY_CLAIM_CEILINGS = deepFreeze({
  runtimeActivationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  playableEnvironmentClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  routeMountClaim: false,
  rendererMountClaim: false,
  compositorFrameConsumptionClaim: false,
  controllerIntentDispatchClaim: false,

  actionExecutionClaim: false,
  readoutConstructionClaim: false,
  inspectionReceiptConstructionClaim: false,

  actorClaim: false,
  groundContactClaim: false,
  collisionClaim: false,
  traversalClaim: false,
  gameplayClaim: false,
  fluidSimulationClaim: false,

  matrixCollapse: false
});

/**
 * Evaluates viewport capacity.
 */
export function evaluateHEarth3DViewportCapacity(
  viewportCandidate = {}
) {
  const issues = [];
  const checks = [];

  const widthPx =
    viewportCandidate.widthPx;

  const heightPx =
    viewportCandidate.heightPx;

  const suppliedPixelRatio =
    viewportCandidate.pixelRatio ??
    1;

  const widthFinite =
    isPositiveFiniteNumber(
      widthPx
    );

  const heightFinite =
    isPositiveFiniteNumber(
      heightPx
    );

  const pixelRatioFinite =
    isPositiveFiniteNumber(
      suppliedPixelRatio
    );

  checks.push(
    createCapacityCheck(
      'VIEWPORT_WIDTH_POSITIVE_FINITE',
      widthFinite,
      widthPx
    )
  );

  checks.push(
    createCapacityCheck(
      'VIEWPORT_HEIGHT_POSITIVE_FINITE',
      heightFinite,
      heightPx
    )
  );

  checks.push(
    createCapacityCheck(
      'VIEWPORT_PIXEL_RATIO_POSITIVE_FINITE',
      pixelRatioFinite,
      suppliedPixelRatio
    )
  );

  if (!widthFinite) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_WIDTH_INVALID',
        'Viewport width must be a positive finite number.',
        widthPx
      )
    );
  }

  if (!heightFinite) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_HEIGHT_INVALID',
        'Viewport height must be a positive finite number.',
        heightPx
      )
    );
  }

  if (!pixelRatioFinite) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_PIXEL_RATIO_INVALID',
        'Viewport pixel ratio must be a positive finite number.',
        suppliedPixelRatio
      )
    );
  }

  if (
    !widthFinite ||
    !heightFinite ||
    !pixelRatioFinite
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_CAPACITY_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues),

      normalizedViewport: null
    });
  }

  const viewport =
    H_EARTH_3D_VIEWPORT_CAPACITY;

  const aspectRatio =
    widthPx /
    heightPx;

  const withinDimensionCapacity =
    widthPx >=
      viewport.minimumUsableViewport.widthPx &&
    heightPx >=
      viewport.minimumUsableViewport.heightPx &&
    widthPx <=
      viewport.maximumEvaluatedViewport.widthPx &&
    heightPx <=
      viewport.maximumEvaluatedViewport.heightPx;

  const withinAspectRatioCapacity =
    aspectRatio >=
      viewport.supportedAspectRatio.minimum &&
    aspectRatio <=
      viewport.supportedAspectRatio.maximum;

  const normalizedPixelRatio =
    clamp(
      suppliedPixelRatio,
      viewport.pixelRatioCapacity.minimum,
      viewport.pixelRatioCapacity.absoluteMaximum
    );

  const pixelRatioWithinCapacity =
    suppliedPixelRatio >=
      viewport.pixelRatioCapacity.minimum &&
    suppliedPixelRatio <=
      viewport.pixelRatioCapacity.absoluteMaximum;

  const preferredMinimumMet =
    widthPx >=
      viewport.preferredMinimumViewport.widthPx &&
    heightPx >=
      viewport.preferredMinimumViewport.heightPx;

  checks.push(
    createCapacityCheck(
      'VIEWPORT_DIMENSIONS_WITHIN_CAPACITY',
      withinDimensionCapacity,
      deepFreeze({
        widthPx,
        heightPx
      })
    )
  );

  checks.push(
    createCapacityCheck(
      'VIEWPORT_ASPECT_RATIO_WITHIN_CAPACITY',
      withinAspectRatioCapacity,
      aspectRatio
    )
  );

  checks.push(
    createCapacityCheck(
      'VIEWPORT_PIXEL_RATIO_WITHIN_CAPACITY',
      pixelRatioWithinCapacity,
      suppliedPixelRatio
    )
  );

  if (!withinDimensionCapacity) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_DIMENSIONS_OUTSIDE_CAPACITY',
        'Viewport dimensions fall outside the permitted capacity envelope.',
        deepFreeze({
          widthPx,
          heightPx,

          minimum:
            viewport.minimumUsableViewport,

          maximum:
            viewport.maximumEvaluatedViewport
        })
      )
    );
  }

  if (!withinAspectRatioCapacity) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_ASPECT_RATIO_OUTSIDE_CAPACITY',
        'Viewport aspect ratio falls outside the permitted capacity envelope.',
        deepFreeze({
          aspectRatio,

          supported:
            viewport.supportedAspectRatio
        })
      )
    );
  }

  if (!pixelRatioWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'VIEWPORT_PIXEL_RATIO_OUTSIDE_CAPACITY',
        'Viewport pixel ratio falls outside the permitted capacity envelope.',
        deepFreeze({
          suppliedPixelRatio,

          normalizedPixelRatio,

          capacity:
            viewport.pixelRatioCapacity
        }),
        'WARNING'
      )
    );
  }

  const eligible =
    withinDimensionCapacity &&
    withinAspectRatioCapacity;

  return deepFreeze({
    eligible,

    status:
      eligible
        ? preferredMinimumMet
          ? 'VIEWPORT_CAPACITY_ELIGIBLE_PREFERRED_MINIMUM_MET'
          : 'VIEWPORT_CAPACITY_ELIGIBLE_MINIMUM_ONLY'
        : 'VIEWPORT_CAPACITY_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    normalizedViewport: deepFreeze({
      widthPx,
      heightPx,
      aspectRatio,

      pixelRatio:
        normalizedPixelRatio,

      suppliedPixelRatio,

      orientation:
        getOrientation(
          widthPx,
          heightPx
        ),

      preferredMinimumMet,

      designViewportMatch:
        widthPx ===
          viewport.preferredDesignViewport.widthPx &&
        heightPx ===
          viewport.preferredDesignViewport.heightPx,

      capacityStatus:
        eligible
          ? 'WITHIN_CAPACITY'
          : 'OUTSIDE_CAPACITY'
    })
  });
}

/**
 * Compatibility viewport evaluator alias.
 */
export function evaluateHEarth3DViewport(
  viewportCandidate = {}
) {
  return evaluateHEarth3DViewportCapacity(
    viewportCandidate
  );
}

/**
 * Evaluates a camera-state candidate.
 */
export function evaluateHEarth3DCameraCapacity(
  cameraCandidate = {}
) {
  const issues = [];
  const checks = [];

  const controllerCapacity =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity;

  const requiredFiniteFields = [
    [
      'yawDegrees',
      cameraCandidate.yawDegrees
    ],
    [
      'pitchDegrees',
      cameraCandidate.pitchDegrees
    ],
    [
      'zoomScale',
      cameraCandidate.zoomScale
    ],
    [
      'verticalFovDegrees',
      cameraCandidate.verticalFovDegrees
    ],
    [
      'nearPlane',
      cameraCandidate.nearPlane
    ],
    [
      'farPlane',
      cameraCandidate.farPlane
    ],
    [
      'target.x',
      cameraCandidate.target?.x
    ],
    [
      'target.y',
      cameraCandidate.target?.y
    ],
    [
      'target.z',
      cameraCandidate.target?.z
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
__H_EARTH_CAPACITY_PART_10__
