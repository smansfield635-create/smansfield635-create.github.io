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
      minimum: 0.0001,
      preferred: 0.00085,
      maximum: 0.004
    })
  }),

  keyboard: deepFreeze({
    permitted: true,

    orbitPermitted: true,
    panPermitted: true,
    zoomPermitted: true,
    resetPermitted: true,
    inspectionIntentPermitted: true,

    acceptedKeys: deepFreeze([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      '+',
      '=',
      '-',
      '_',
      'Home',
      '0',
      'Enter',
      ' '
    ]),

    orbitDegreesPerIntent: deepFreeze({
      minimum: 0.25,
      preferred: 2.25,
      maximum: 8
    }),

    panWorldUnitsPerIntent: deepFreeze({
      minimum: 0.05,
      preferred: 0.35,
      maximum: 2
    }),

    zoomScalePerIntent: deepFreeze({
      minimum: 0.01,
      preferred: 0.05,
      maximum: 0.14
    })
  }),

  controllerIntentTypes: deepFreeze([
    'H_EARTH_COMPOSITOR_INTENT_ORBIT',
    'H_EARTH_COMPOSITOR_INTENT_PAN',
    'H_EARTH_COMPOSITOR_INTENT_ZOOM',
    'H_EARTH_COMPOSITOR_INTENT_RESET_VIEW',
    'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE',
    'H_EARTH_COMPOSITOR_INTENT_SET_VIEWPORT',
    'H_EARTH_COMPOSITOR_INTENT_SET_VISIBLE_LAYERS',
    'H_EARTH_COMPOSITOR_INTENT_START_INERTIA',
    'H_EARTH_COMPOSITOR_INTENT_ADVANCE_INERTIA',
    'H_EARTH_COMPOSITOR_INTENT_STOP_INERTIA'
  ]),

  intentRateCapacity: deepFreeze({
    maximumAcceptedIntentsPerAnimationFrame: 4,
    maximumQueuedIntents: 16,
    staleIntentRevisionGap: 32
  }),

  inspectionIntentCapacity: deepFreeze({
    permitted: true,

    actionId:
      'H_EARTH_INSPECT_GROUND_ACTION',

    readoutId:
      'GROUND_CONDITION_READ',

    receiptId:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    controllerMayDispatchIntent: true,
    controllerMayExecuteAction: false,
    controllerMayConstructReadout: false,
    controllerMayIssueReceipt: false
  }),

  inertiaDamping: 0.88,
  inertiaMinimumVelocity: 0.018,
  inertiaMaximumFrames: 90,

  inertia: deepFreeze({
    permitted: true,

    damping: 0.88,
    dampingMinimum: 0.72,
    dampingMaximum: 0.96,

    minimumVelocity: 0.018,
    maximumInitialVelocity: 8,

    maximumFrames: 90,

    controllerMayEstimateReleaseVelocity: true,
    compositorOwnsInertiaState: true,
    compositorOwnsInertiaAdvancement: true,
    controllerOwnsInertiaLoop: false,
    rendererOwnsInertia: false
  }),

  authorityBoundary: deepFreeze({
    controllerNormalizesInput: true,
    controllerEmitsIntent: true,
    compositorEvaluatesIntent: true,
    compositorMutatesCompositionState: true,
    rendererConsumesResultingFrame: true
  })
});

/**
 * Controller-intent eligibility limits.
 */
export const H_EARTH_3D_CONTROLLER_INTENT_CAPACITY = deepFreeze({
  acceptedIntentTypes:
    H_EARTH_3D_INTERACTION_CAPACITY.controllerIntentTypes,

  commonRequiredFields: deepFreeze([
    'type'
  ]),

  orbit: deepFreeze({
    yawDeltaDegrees: deepFreeze({
      minimum:
        -H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .yawDegrees
          .maximumDeltaPerIntent,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .yawDegrees
          .maximumDeltaPerIntent
    }),

    pitchDeltaDegrees: deepFreeze({
      minimum:
        -H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .pitchDegrees
          .maximumDeltaPerIntent,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .pitchDegrees
          .maximumDeltaPerIntent
    })
  }),

  pan: deepFreeze({
    horizontalDelta: deepFreeze({
      minimum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .horizontalMinimum,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .horizontalMaximum
    }),

    verticalDelta: deepFreeze({
      minimum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .verticalMinimum,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .verticalMaximum
    }),

    depthDelta: deepFreeze({
      minimum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .depthMinimum,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .panWorldUnits
          .depthMaximum
    })
  }),

  zoom: deepFreeze({
    zoomScaleDelta: deepFreeze({
      minimum:
        -H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .zoomScale
          .maximumDeltaPerIntent,

      maximum:
        H_EARTH_3D_CAMERA_CAPACITY
          .futureControllerCapacity
          .zoomScale
          .maximumDeltaPerIntent
    })
  }),

  setViewport: deepFreeze({
    viewportEvaluationRequired: true
  }),

  setCameraState: deepFreeze({
    cameraEvaluationRequired: true
  }),

  setVisibleLayers: deepFreeze({
    compositorVisibilityEvaluationRequired: true
  }),

  inertia: deepFreeze({
    finiteVelocityFieldsRequired: true,

    acceptedVelocityFields: deepFreeze([
      'yawVelocity',
      'pitchVelocity',
      'panHorizontalVelocity',
      'panVerticalVelocity',
      'panDepthVelocity',
      'zoomVelocity'
    ])
  }),

  malformedIntentPolicy:
    'FAIL_CLOSED',

  unknownIntentPolicy:
    'REJECT'
});

/**
 * Render-frame capacity.
 */
export const H_EARTH_3D_RENDER_FRAME_CAPACITY = deepFreeze({
  frameType:
    'H_EARTH_3D_COMPOSITOR_RENDER_FRAME',

  minimumSchemaVersion: 1,
  maximumSchemaVersion: 2,

  maximumActiveFrames: 1,
  maximumPendingFrames: 2,

  revisions: deepFreeze({
    minimum: 0,
    maximumSafeInteger:
      Number.MAX_SAFE_INTEGER,

    monotonicRequired: true,
    duplicateRevisionPermitted: true,
    decreasingRevisionPermitted: false,

    maximumIncrementalRevisionGap: 32,

    fullRebuildRequiredBeyondIncrementalGap: true
  }),

  requiredTopLevelFields: deepFreeze([
    'frameType',
    'contractId',
    'frameId',
    'frameRevision',
    'cameraRevision',
    'viewportRevision',
    'visibilityRevision',
    'inertiaRevision',
    'bindingIdentity',
    'coordinateFrame',
    'worldBounds',
    'viewport',
    'resolvedCameraPose',
    'navigationTransform',
    'composition',
    'environment',
    'rendererRules',
    'claimCeilings'
  ]),

  bindingRequirements: deepFreeze({
    activeCell:
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell,

    spatialCellId:
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId,

    sceneIdentity:
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity,

    coordinateFrame:
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.coordinateFrame
  }),

  viewportRequirements: deepFreeze({
    resolvedForRendererConsumption: true,
    withinCapacityRequired: true,
    positiveDimensionsRequired: true,
    finiteAspectRatioRequired: true,
    finitePixelRatioRequired: true
  }),

  cameraRequirements: deepFreeze({
    eligiblePoseRequired: true,
    positionWithinCapacityRequired: true,
    finiteBasisRequired: true,
    cameraRevisionRequired: true
  }),

  compositionRequirements: deepFreeze({
    orderedLayerIdsRequired: true,
    orderedLayersRequired: true,
    visibleLayerIdsRequired: true,

    minimumSemanticLayers:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        .semanticLayerContainerMinimum,

    maximumSemanticLayers:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        .semanticLayerContainerMaximum,

    duplicateLayerIdsPermitted: false,
    unknownLayerIdsPermitted: false
  }),

  environmentRequirements: deepFreeze({
    contractIdRequired: true,
    primitivePlanRequired: true,
    materialIdentitiesRequired: true,
    inspectionAnchorRequired: true
  }),

  rendererRulesRequirements: deepFreeze({
    projectionOwnedByRenderer: true,
    primitiveConstructionOwnedByRenderer: true,
    DOMCSSMaterializationOwnedByRenderer: true,

    cameraStateOwnedByRenderer: false,
    viewportStateOwnedByRenderer: false,
    navigationConstraintsOwnedByRenderer: false,
    semanticLayerOrderOwnedByRenderer: false
  }),

  eligibilityPolicy:
    'ALL_REQUIRED_FRAME_CHECKS_MUST_PASS'
});

/**
 * Compositor-frame eligibility limits.
 */
export const H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY = deepFreeze({
  capacityContractRequired:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractRequired: true,
  environmentPrimitivePlanEligibilityRequired: true,
  nodeBudgetEligibilityRequired: true,
  semanticLayerOrderEligibilityRequired: true,
  cameraPoseEligibilityRequired: true,

  viewportMayBeUnresolvedBeforeMount: true,
  viewportMustBeResolvedBeforeRendererConsumption: true,

  frameContractMustMatchCompositor: true,
  frameRevisionMustBeFiniteInteger: true,

  rendererPassClaimCreated: false,
  visualPassClaimCreated: false
});

/**
 * Renderer-frame-consumption eligibility limits.
 */
export const H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY =
  deepFreeze({
    compositorFrameRequired: true,
    compositorFrameEligibleRequired: true,

    compositorContractIdRequired: true,
    capacityContractIdRequired: true,
    environmentContractIdRequired: true,

    bindingIdentityMatchRequired: true,
    coordinateFrameMatchRequired: true,

    viewportResolvedRequired: true,
    cameraPoseResolvedRequired: true,
    layerOrderConsumedRequired: true,
    requiredLayersPresentRequired: true,
    primitiveBudgetWithinCapacityRequired: true,
    outputModelAllowedRequired: true,

    frameRevisionRecordedRequired: true,

    sameRevisionReapplicationPermitted: true,
    olderRevisionApplicationPermitted: false,

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
