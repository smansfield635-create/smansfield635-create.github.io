__H_EARTH_CAPACITY_PART_01__
    span: 512
  }),

  origin: deepFreeze({
    x: 0,
    y: 0,
    z: 0
  }),

  regionDimensions: deepFreeze({
    width: 512,
    height: 160,
    depth: 512
  }),

  controllerMayExpandBounds: false,
  compositorMayExpandBounds: false,
  rendererMayExpandBounds: false
});

/**
 * Viewport capacity.
 */
export const H_EARTH_3D_VIEWPORT_CAPACITY = deepFreeze({
  rendererMountId:
    H_EARTH_3D_PUBLIC_STAGE_IDS.rendererMountId,

  minimumUsableViewport: deepFreeze({
    widthPx: 320,
    heightPx: 320,

    status:
      'MINIMUM_USABLE_PUBLIC_STAGE_VIEWPORT'
  }),

  preferredMinimumViewport: deepFreeze({
    widthPx: 720,
    heightPx: 480,

    status:
      'PREFERRED_MINIMUM_PUBLIC_STAGE_VIEWPORT'
  }),

  preferredDesignViewport: deepFreeze({
    widthPx: 1440,
    heightPx: 900,

    aspectRatio: 1.6,

    status:
      'PREFERRED_DESIGN_VIEWPORT'
  }),

  maximumEvaluatedViewport: deepFreeze({
    widthPx: 7680,
    heightPx: 4320,

    status:
      'MAXIMUM_STATIC_CAPACITY_EVALUATION_VIEWPORT'
  }),

  minimumWidthPx: 320,
  minimumHeightPx: 320,
  maximumWidthPx: 7680,
  maximumHeightPx: 4320,

  supportedAspectRatio: deepFreeze({
    minimum: 0.5625,
    maximum: 2.4,
    preferredMinimum: 1.2,
    preferredMaximum: 1.9
  }),

  pixelRatioCapacity: deepFreeze({
    minimum: 1,
    preferredMaximum: 2,
    absoluteMaximum: 3,

    highDensityPermitted: true,
    unboundedDevicePixelRatioPermitted: false,

    normalizationRule:
      'CLAMP_DEVICE_PIXEL_RATIO_TO_CAPACITY'
  }),

  orientationCapacity: deepFreeze({
    landscape: true,
    portrait: true,
    square: true,

    landscapePreferred: true,

    unsupportedOrientation:
      'NONE_WITHIN_ASPECT_RATIO_CAPACITY'
  }),

  resizeCapacity: deepFreeze({
    observationPermitted: true,
    zeroDimensionFramePermitted: false,
    repeatedSameSizeRevisionRequired: false,
    viewportRevisionRequiredOnDimensionChange: true,
    viewportRevisionRequiredOnPixelRatioChange: true,
    rendererMayMeasureMount: true,
    compositorMustOwnAcceptedViewportState: true
  }),

  unresolvedViewportPolicy:
    'FRAME_DESCRIPTOR_MAY_EXIST_BUT_RENDERER_MOUNT_ELIGIBILITY_REMAINS_FALSE'
});

/**
 * Camera capacity.
 */
export const H_EARTH_3D_CAMERA_CAPACITY = deepFreeze({
  cameraModel:
    'PERSPECTIVE_LOOK_AT_CAMERA',

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  initialProjectionCandidate: deepFreeze({
    position: deepFreeze({
      x: 0,
      y: 24,
      z: 64
    }),

    target: deepFreeze({
      x: 0,
      y: 0.5,
      z: -128
    }),

    up: deepFreeze({
      x: 0,
      y: 1,
      z: 0
    }),

    verticalFovDegrees: 52,
    nearPlane: 0.25,
    farPlane: 512,

    cameraStateAuthority:
      'COMPOSITOR',

    projectionAuthority:
      'RENDERER'
  }),

  futureControllerCapacity: deepFreeze({
    positionBounds: deepFreeze({
      xMin: -256,
      xMax: 256,

      yMin: -80,
      yMax: 120,

      zMin: -256,
      zMax: 256
    }),

    targetBounds: deepFreeze({
      xMin: -96,
      xMax: 96,

      yMin: -1,
      yMax: 8,

      zMin: -256,
      zMax: 24
    }),

    yawDegrees: deepFreeze({
      minimum: -38,
      maximum: 38,

      maximumDeltaPerIntent: 8,

      wrapPermitted: false
    }),

    pitchDegrees: deepFreeze({
      minimum: -24,
      maximum: 12,

      maximumDeltaPerIntent: 8
    }),

    verticalFovDegrees: deepFreeze({
      minimum: 38,
      maximum: 68,

      maximumDeltaPerIntent: 6
    }),

    zoomScale: deepFreeze({
      minimum: 0.72,
      maximum: 1.42,

      maximumDeltaPerIntent: 0.14,

      initial: 1,

      interpretation:
        'INITIAL_CAMERA_DISTANCE_MULTIPLIER'
    }),

    panWorldUnits: deepFreeze({
      horizontalMinimum: -2,
      horizontalMaximum: 2,

      verticalMinimum: -1.25,
      verticalMaximum: 1.25,

      depthMinimum: -2,
      depthMaximum: 2
    }),

    resetViewPermitted: true,
    setCameraStatePermitted: true,

    controllerOwnsCameraState: false,
    compositorOwnsCameraState: true,
    rendererOwnsCameraState: false
  }),

  resolvedCameraPoseEligibility: deepFreeze({
    finitePositionRequired: true,
    finiteTargetRequired: true,
    finiteBasisRequired: true,

    positionBoundsRequired: true,
    targetBoundsRequired: true,

    normalizedForwardVectorRequired: true,
    normalizedRightVectorRequired: true,
    normalizedUpVectorRequired: true,

    orthogonalBasisTolerance: 0.001,

    nearPlaneMinimum: 0.01,
    farPlaneMaximum: 512,

    farPlaneMustExceedNearPlane: true,

    cameraRevisionRequired: true
  }),

  authorityBoundary: deepFreeze({
    capacityDeclaresLimits: true,
    compositorOwnsState: true,
    compositorResolvesPose: true,
    rendererConsumesPose: true,
    rendererOwnsProjectionMathematics: true,
    controllerEmitsIntentsOnly: true
  })
});

/**
 * Render-stage limits.
 */
export const H_EARTH_3D_RENDER_STAGE_LIMITS = deepFreeze({
  permittedOutputModel:
    'DOM_CSS3D_PROJECTED_ENVIRONMENT',

  permittedOutputModels: deepFreeze([
    'DOM_CSS3D_PROJECTED_ENVIRONMENT'
  ]),

  prohibitedOutputModels: deepFreeze([
    'WEBGL',
    'CANVAS_2D',
    'CANVAS_WEBGL',
    'SVG_SCENE_RENDERER',
    'EXTERNAL_GAME_ENGINE'
  ]),

  semanticLayerContainerMinimum: 15,
  semanticLayerContainerMaximum: 16,

  environmentLayerMaximum: 15,
  routeOverlayLayerMaximum: 1,

  maximumMountedRendererInstances: 1,

  maximumActiveRenderFrames: 1,

  maximumPendingFrameApplications: 2,

  maximumFrameRevisionGapBeforeFullRebuild: 32,

  fullRebuildPermitted: true,
  incrementalReprojectionPermitted: true,
  duplicateStageRootsPermitted: false,

  rendererMustConsumeCompositorFrame: true,
  rendererMayConstructIndependentCamera: false,
  rendererMayConstructIndependentViewport: false,
  rendererMayInventSemanticOrder: false,

  depthSorting: deepFreeze({
    primitiveDepthSortingPermitted: true,
    semanticLayerReorderingPermitted: false,

    source:
      'COMPOSITOR_RESOLVED_CAMERA_POSE'
  })
});

/**
 * Node and primitive budget.
 */
export const H_EARTH_3D_NODE_BUDGET = deepFreeze({
  semanticLayerContainers: deepFreeze({
    minimum: 15,
    preferred: 15,
    maximum: 16
  }),

  environmentPrimitives: deepFreeze({
    minimum: 1,
    preferredMaximum: 256,
    absoluteMaximum: 384
  }),

  interactionNodes: deepFreeze({
    minimum: 1,
    preferredMaximum: 8,
    absoluteMaximum: 16
  }),

  routeOverlayNodes: deepFreeze({
    minimum: 0,
    preferredMaximum: 24,
    absoluteMaximum: 48
  }),

  diagnosticOwnedNodes: deepFreeze({
    minimum: 0,
    preferredMaximum: 0,
    absoluteMaximum: 0
  }),

  totalRendererOwnedNodes: deepFreeze({
    preferredMaximum: 304,
    absoluteMaximum: 448
  }),

  countingPolicy:
    'COUNT_RENDERER_OWNED_LAYER_CONTAINERS_PRIMITIVES_AND_INTERACTION_NODES',

  routeShellExcludedFromRendererBudget: true,
  hiddenNodesStillCount: true,
  detachedNodesDoNotCount: true
});

/**
 * Interaction capacity.
 */
export const H_EARTH_3D_INTERACTION_CAPACITY = deepFreeze({
  enabled:
    true,

  pointer: deepFreeze({
    permitted: true,

    acceptedPointerTypes: deepFreeze([
      'mouse',
      'touch',
      'pen'
    ]),

    maximumConcurrentPointers: 2,

    primaryButtonOrbitPermitted: true,
    auxiliaryButtonPanPermitted: true,
    secondaryButtonPanPermitted: true,

    pointerCapturePermitted: true,
    contextMenuSuppressionPermittedOnStage: true,

    maximumDeltaPxPerEvent: 512,

    normalizedOrbitDegreesPerPixel: deepFreeze({
      minimum: 0.02,
      preferred: 0.16,
      maximum: 0.5
    }),

    normalizedPanWorldUnitsPerPixel: deepFreeze({
      minimum: 0.001,
      preferred: 0.012,
      maximum: 0.05
    })
  }),

  touch: deepFreeze({
    permitted: true,

    singlePointerOrbitPermitted: true,
    twoPointerPanPermitted: true,
    pinchZoomPermitted: true,

    maximumConcurrentTouches: 2,

    minimumPinchDistancePx: 8,
    maximumPinchDeltaPxPerEvent: 512,

    normalizedPinchZoomScalePerPixel: deepFreeze({
      minimum: 0.0005,
      preferred: 0.0035,
      maximum: 0.02
    })
  }),

  wheel: deepFreeze({
    permitted: true,

    zoomPermitted: true,
    preventDefaultPermittedOnStage: true,

    acceptedDeltaModes: deepFreeze([
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
__H_EARTH_CAPACITY_PART_10__
