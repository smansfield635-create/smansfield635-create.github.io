/**
 * /showroom/globe/h-earth/capacity.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Renews:
 * H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v4
 *
 * Purpose:
 * Define the complete bounded execution-capacity constitution for the
 * frame-based H-Earth public-stage corridor.
 *
 * This file provides the exact limits consumed by:
 * - environment.js
 * - compositor.js
 * - renderer.js
 * - controller.js
 * - index.js
 * - diagnostic/index.js
 *
 * This file owns:
 * - public-stage element identity
 * - public-stage world bounds
 * - viewport capacity
 * - pixel-ratio capacity
 * - camera and navigation capacity
 * - controller-intent capacity
 * - interaction and inertia capacity
 * - semantic-layer capacity
 * - primitive and node budgets
 * - compositor-frame capacity
 * - renderer-frame-consumption capacity
 * - mount and resize eligibility
 * - bounded capacity evaluators
 * - capacity receipts and claim ceilings
 *
 * This file does not own:
 * - Path 3 region truth
 * - matrix truth
 * - Ground Cell binding admission
 * - boundary, object, zone, or landscape-lattice truth
 * - environment descriptor truth
 * - semantic composition
 * - camera state
 * - viewport state
 * - navigation state
 * - render-frame state
 * - projection mathematics
 * - projected primitive construction
 * - DOM/CSS materialization
 * - renderer mount execution
 * - controller event normalization
 * - route bootstrap
 * - action execution
 * - readout construction
 * - receipt persistence
 * - diagnostic judgment
 * - actor creation
 * - collision
 * - ground-contact proof
 * - traversal
 * - gameplay
 * - fluid simulation
 * - renderer-pass approval
 * - visual-pass approval
 */

export const H_EARTH_3D_CAPACITY_CONTRACT_ID =
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5';

export const H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 5;

const deepFreeze = (value) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
};

const isFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);

const isPositiveFiniteNumber = (value) =>
  isFiniteNumber(value) &&
  value > 0;

const isNonNegativeFiniteNumber = (value) =>
  isFiniteNumber(value) &&
  value >= 0;

const isNonEmptyString = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0;

const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value);

const clamp = (
  value,
  minimum,
  maximum
) =>
  Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );

const getVectorDistance = (
  left,
  right
) =>
  Math.hypot(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );

const createCapacityIssue = (
  code,
  message,
  details = null,
  severity = 'ERROR'
) =>
  deepFreeze({
    code,
    severity,
    message,
    details
  });

const createCapacityCheck = (
  id,
  passed,
  details = null
) =>
  deepFreeze({
    id,
    passed: passed === true,
    details
  });

const allChecksPass = (checks) =>
  checks.every(
    (check) =>
      check.passed === true
  );

const getOrientation = (
  widthPx,
  heightPx
) => {
  const aspectRatio =
    widthPx /
    heightPx;

  if (aspectRatio > 1.05) {
    return 'LANDSCAPE';
  }

  if (aspectRatio < 0.95) {
    return 'PORTRAIT';
  }

  return 'SQUARE';
};

/**
 * Capacity boundary declaration.
 */
export const H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS = deepFreeze({
  ownsPublicStageIdentityCapacity: true,
  ownsWorldBoundsCapacity: true,
  ownsViewportCapacity: true,
  ownsPixelRatioCapacity: true,
  ownsCameraCapacity: true,
  ownsNavigationCapacity: true,
  ownsInteractionCapacity: true,
  ownsInertiaCapacity: true,
  ownsIntentCapacity: true,
  ownsSemanticLayerCapacity: true,
  ownsPrimitiveCapacity: true,
  ownsNodeBudget: true,
  ownsRenderFrameCapacity: true,
  ownsCompositorFrameEligibility: true,
  ownsRendererFrameConsumptionEligibility: true,
  ownsControllerIntentEligibility: true,
  ownsMountEligibility: true,
  ownsResizeEligibility: true,
  ownsCapacityReceipts: true,

  ownsEnvironmentTruth: false,
  ownsSemanticComposition: false,
  ownsSemanticLayerOrder: false,
  ownsCameraState: false,
  ownsViewportState: false,
  ownsNavigationState: false,
  ownsInertiaState: false,
  ownsRenderFrameState: false,
  ownsProjectionMathematics: false,
  ownsProjectedPrimitiveConstruction: false,
  ownsDOMCSSMaterialization: false,
  ownsRendererLifecycle: false,
  ownsControllerInputNormalization: false,
  ownsRouteBootstrap: false,

  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsBoundaryAuthority: false,
  ownsObjectAuthority: false,
  ownsZoneAuthority: false,
  ownsLandscapeLatticeAuthority: false,

  matrixCollapse: false
});

/**
 * Binding identity.
 *
 * This records the admitted upstream relationship consumed by the Layer 4
 * corridor. It does not create or alter that relationship.
 */
export const H_EARTH_3D_CAPACITY_BINDING_IDENTITY = deepFreeze({
  matrix:
    'H-Earth',

  matrixRole:
    'Ground-View Matrix',

  activeCell:
    'H_EARTH_GROUND_CELL_001',

  domainCellId:
    'H_EARTH_GROUND_CELL_001',

  spatialCellId:
    'H_EARTH_REGION_CELL_X07_Z08',

  bindingExpression:
    'H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001',

  bindingClass:
    'ADMITTED_PATH3_TO_GROUND_CELL_BINDING',

  sceneIdentity:
    'earth-water-air-survival-shoreline-manor',

  coordinateFrame:
    'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',

  sourceAuthorityExternal: true,
  descriptorOnlyAtCapacityLayer: true,

  matrixCollapse: false
});

/**
 * Source references.
 */
export const H_EARTH_3D_CAPACITY_SOURCE_REFERENCES = deepFreeze({
  controllingArchitecture: deepFreeze({
    layers1To3Accepted: true,

    path3RegionShell:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/region-foundation.js',

    domainConsumerPreflight:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/region-domain-consumer-preflight.js',

    matrix:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.matrix.js',

    cell:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/cells/ground-cell-001.js',

    familyIntegrity:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.integrity.js'
  }),

  publicStageSourceSpine: deepFreeze({
    boundaries:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/boundaries/matrix-boundaries.js',

    objects:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',

    zones:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.zones.js',

    landscapeLattice:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

    directlyImported: false
  }),

  layer4Consumers: deepFreeze({
    environment:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/environment.js',

    compositor:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/compositor.js',

    renderer:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/renderer.js',

    controller:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/controller.js',

    index:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/index.js',

    diagnostic:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/diagnostic/index.js'
  }),

  interactionAuthorities: deepFreeze({
    inspectGround:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/actions/inspect-ground.js',

    groundConditionRead:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/readouts/ground-condition-read.js',

    receipts:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',

    directlyImported: false
  })
});

/**
 * Public-stage IDs.
 *
 * These values establish the permitted compatibility surface. Their presence
 * does not prove that corresponding DOM elements exist.
 */
export const H_EARTH_3D_PUBLIC_STAGE_IDS = deepFreeze({
  routeRootId:
    'h-earth-3d-route-root',

  rendererMountId:
    'h-earth-3d-renderer-mount',

  statusId:
    'h-earth-3d-status',

  fallbackId:
    'h-earth-3d-fallback',

  hudId:
    'h-earth-3d-hud',

  inspectionPanelId:
    'h-earth-3d-inspection-panel',

  sceneStageId:
    'h-earth-3d-scene-stage',

  environmentLayerRootId:
    'h-earth-3d-environment-layer-root',

  overlayLayerRootId:
    'h-earth-3d-overlay-layer-root'
});

/**
 * Public-stage world bounds.
 */
export const H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS = deepFreeze({
  coordinateFrame:
    'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',

  units:
    'WORLD_UNITS',

  axisMeaning: deepFreeze({
    x:
      'WEST_EAST',

    y:
      'DEPTH_ELEVATION',

    z:
      'SOUTH_NORTH'
  }),

  x: deepFreeze({
    minimum: -256,
    maximum: 256,
    span: 512
  }),

  y: deepFreeze({
    minimum: -40,
    maximum: 120,
    span: 160,
    surfaceBaseline: 0
  }),

  z: deepFreeze({
    minimum: -256,
    maximum: 256,
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
      x: 28,
      y: 10.5,
      z: -82
    }),

    target: deepFreeze({
      x: -34,
      y: 5.5,
      z: -214
    }),

    up: deepFreeze({
      x: 0,
      y: 1,
      z: 0
    }),

    verticalFovDegrees: 56,
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

      yMin: -32,
      yMax: 32,

      zMin: -256,
      zMax: 24
    }),

    yawDegrees: deepFreeze({
      minimum: -180,
      maximum: 180,

      maximumDeltaPerIntent: 8,

      wrapPermitted: true,
      initialWaterwardYawDegrees: 180,
      compositionArcDegrees: 76
    }),

    pitchDegrees: deepFreeze({
      minimum: -80,
      maximum: 80,

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
        'GROUND_OBSERVER_VERTICAL_FIELD_OF_VIEW_MULTIPLIER'
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
 * Land-side camera composition and bounded living-presentation capacity.
 * These declarations create no animation runtime and mutate no admitted geometry.
 */
export const H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID =
  'H_EARTH_GROUND_OBSERVER_ESTATE_ENTRY_CAMERA_ENVELOPE_v4_SINGLE_MODULE';

export const H_EARTH_3D_CAMERA_COMPOSITION_INTENT = deepFreeze({
  compositionId:
    H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,
  compositionRole:
    'GROUND_OBSERVER_ENTRY_LOOKING_LANDWARD_WITH_BOUNDED_YAW_PITCH_AND_FOV',
  cameraSide:
    'SHORELINE_WATERWARD_EDGE_NEAR_NEGATIVE_Z_LAND',
  viewDirection:
    'TOWARD_NEGATIVE_Z_LAND_MANOR_AND_OBJECT_CONTEXT',
  shorelineReferenceZ: -96,
  wetSandForegroundRequired: true,
  foamContactSeamRequired: false,
  waterRecessionRequired: false,
  shorelineBehindOrPeripheralRequired: true,
  manorContextForwardReserved: true,
  futureContextDepthReserved: true,
  admittedGeometryMutationPermitted: false,
  animationStandardPreparationOnly: true,
  moduleGraphPolicy:
    'EXISTING_NINETEEN_MODULE_BROWSER_GRAPH_ONLY'
});

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID =
  'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v2_SINGLE_MODULE';

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY = deepFreeze({
  capacityId:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,
  status:
    'CAPACITY_STANDARD_DEFINED_RUNTIME_NOT_CREATED',
  sourceObjectIds: deepFreeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_007_WATER_SURFACE_PLANE'
  ]),
  moduleGraph: deepFreeze({
    canonicalCapacityPath:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/capacity.js',
    auxiliaryCapacityModulePermitted: false,
    governedBrowserRowCount: 19,
    graphExpansionPermitted: false
  }),
  geometryBoundary: deepFreeze({
    admittedGeometryMutationPermitted: false,
    admittedVertexMutationPermitted: false,
    admittedIndexMutationPermitted: false,
    admittedBoundsMutationPermitted: false,
    primitiveIdentityMutationPermitted: false,
    sourceObjectIdentityMutationPermitted: false,
    sharedShorelineBoundaryMutationPermitted: false,
    materialPresentationMutationPermitted: true
  }),
  scheduler: deepFreeze({
    singleCoordinatorRequired: true,
    requestAnimationFrameRequired: true,
    maximumActiveFramesPerSecond: 30,
    nominalFrameIntervalMilliseconds: 1000 / 30,
    maximumMainThreadWorkMillisecondsPerFrame: 8,
    unboundedTimersPermitted: false,
    duplicateAnimationLoopsPermitted: false,
    deterministicPhaseSeedsRequired: true
  }),
  suspension: deepFreeze({
    suspendWhenDocumentHidden: true,
    suspendWhenStageOffscreen: true,
    suspendOnPageHide: true,
    controlledResumeRequired: true,
    backgroundAnimationWorkPermitted: false
  }),
  reducedMotion: deepFreeze({
    operatingSystemPreferenceRequired: true,
    staticEquivalentRequired: true,
    animationLoopsMustStop: true,
    timersMustStop: true,
    semanticInformationMustRemainAvailable: true
  }),
  permittedMotionChannels: deepFreeze([
    'TRANSFORM',
    'OPACITY',
    'BACKGROUND_POSITION',
    'BOUNDED_CSS_CUSTOM_PROPERTY'
  ]),
  prohibitedMotionChannels: deepFreeze([
    'LAYOUT_GEOMETRY',
    'DOM_NODE_CHURN',
    'ADMITTED_VERTEX_REWRITE',
    'ADMITTED_INDEX_REWRITE',
    'SHORELINE_BOUNDARY_REWRITE',
    'PHYSICAL_FLUID_SIMULATION'
  ]),
  materialMotionIntent: deepFreeze({
    wetSand:
      'SUBTLE_REFLECTED_LIGHT_AND_DAMP_SHEEN_VARIATION',
    foam:
      'GENTLE_CONTACT_BRIGHTNESS_AND_LATERAL_PHASE_MOTION',
    water:
      'SLOW_SURFACE_SHIMMER_AND_DIRECTIONAL_HIGHLIGHT_DRIFT'
  }),
  qualityCapacity: deepFreeze({
    maximumConcurrentMaterialAnimations: 3,
    devicePixelRatioMustRemainWithinViewportCapacity: true,
    adaptiveQualityPermitted: true,
    frameCostSamplingRequired: true,
    qualityMayDecreaseToProtectFrameBudget: true,
    qualityMayIncreaseOnlyWithinDeclaredCapacity: true
  }),
  lifecycleStates: deepFreeze([
    'IDLE',
    'RUNNING',
    'SUSPENDED',
    'REDUCED_MOTION_STATIC',
    'DISPOSED'
  ]),
  claimCeilings: deepFreeze({
    animationRuntimeCreated: false,
    animationExecuted: false,
    fluidSimulationCreated: false,
    physicalWaveSimulationCreated: false,
    weatherSimulationCreated: false,
    traversalCreated: false,
    gameplayCreated: false,
    visualPassClaim: false,
    productionClaim: false
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
 * Stage-separated primitive and node budgets.
 *
 * These three capacity domains are independent and noninterchangeable:
 *
 * admitted source primitives
 * != post-clipping projected fragments
 * != final physical renderer-owned DOM nodes.
 *
 * The legacy environmentPrimitives and totalRendererOwnedNodes fields remain as
 * compatibility aliases for existing consumers. They do not collapse the three
 * governed domains.
 */
export const H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET = deepFreeze({
  budgetId:
    'ADMITTED_PRIMITIVE_BUDGET',

  stage:
    'POST_WEST_ADMITTED_FRAME',

  countingUnit:
    'ADMITTED_SOURCE_PRIMITIVE',

  productionOccurrenceExpected: 3,
  minimum: 1,
  preferredMaximum: 256,
  absoluteMaximum: 384
});

export const H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET = deepFreeze({
  budgetId:
    'PROJECTED_FRAGMENT_BUDGET',

  stage:
    'POST_CLIPPING_RENDERER_PROJECTION_PLAN',

  countingUnit:
    'PROJECTED_OR_CLIPPED_RENDER_FRAGMENT',

  minimum: 0,
  preferredMaximum: 800,
  absoluteMaximum: 1024,

  lawfulEmptyScenePermittedByRenderer: true
});

export const H_EARTH_3D_FINAL_DOM_NODE_BUDGET = deepFreeze({
  budgetId:
    'FINAL_DOM_NODE_BUDGET',

  stage:
    'POST_MATERIALIZATION_RENDERER_MOUNT',

  countingUnit:
    'PHYSICAL_RENDERER_OWNED_DOM_NODE',

  rendererInfrastructureNodeCount: 2,
  semanticLayerContainerCount: 15,
  interactionNodeCount: 1,

  preferredMaximum: 818,
  absoluteMaximum: 1042,

  accountingPolicy:
    'RENDERER_INFRASTRUCTURE_PLUS_SEMANTIC_CONTAINERS_PLUS_INTERACTION_NODES_PLUS_MOUNTED_PROJECTED_FRAGMENTS',

  routeShellExcluded: true,
  detachedNodesExcluded: true,
  hiddenMountedNodesIncluded: true
});

export const H_EARTH_3D_STAGE_SEPARATED_BUDGETS = deepFreeze({
  admittedPrimitiveBudget:
    H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET,

  projectedFragmentBudget:
    H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET,

  finalDomNodeBudget:
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET,

  invariant:
    'ADMITTED_PRIMITIVE_BUDGET != PROJECTED_FRAGMENT_BUDGET != FINAL_DOM_NODE_BUDGET'
});

/**
 * Node and primitive budget compatibility surface.
 */
export const H_EARTH_3D_NODE_BUDGET = deepFreeze({
  admittedPrimitives:
    H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET,

  projectedFragments:
    H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET,

  finalRendererOwnedDom:
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET,

  semanticLayerContainers: deepFreeze({
    minimum: 15,
    preferred: 15,
    maximum: 16
  }),

  environmentPrimitives:
    H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET,

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

  totalRendererOwnedNodes:
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET,

  compatibilityPolicy: deepFreeze({
    environmentPrimitivesFieldRepresents:
      'PROJECTED_FRAGMENT_COUNT_FOR_LEGACY_RENDERER_CONSUMERS',

    totalRendererOwnedNodesFieldRepresents:
      'FINAL_RENDERER_OWNED_DOM_CAPACITY_CEILING',

    admittedPrimitiveBudgetMayBeInferredFromEnvironmentPrimitives:
      false,

    projectedFragmentBudgetMayBeInferredFromAdmittedPrimitiveBudget:
      false,

    finalDomNodeBudgetMayBeInferredFromProjectedFragmentBudget:
      false
  }),

  countingPolicy:
    'COUNT_LEGACY_RENDERER_OWNED_LAYER_CONTAINERS_PROJECTED_FRAGMENTS_INTERACTION_ROUTE_OVERLAY_AND_DIAGNOSTIC_NODES',

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
      isFiniteNumber(value);

    checks.push(
      createCapacityCheck(
        `CAMERA_${field.toUpperCase().replace('.', '_')}_FINITE`,
        passed,
        value
      )
    );

    if (!passed) {
      issues.push(
        createCapacityIssue(
          'CAMERA_FIELD_NOT_FINITE',
          `Camera field ${field} must be finite.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_CAPACITY_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues),

      normalizedCameraState: null
    });
  }

  const normalizedCameraState =
    deepFreeze({
      yawDegrees:
        clamp(
          cameraCandidate.yawDegrees,
          controllerCapacity.yawDegrees.minimum,
          controllerCapacity.yawDegrees.maximum
        ),

      pitchDegrees:
        clamp(
          cameraCandidate.pitchDegrees,
          controllerCapacity.pitchDegrees.minimum,
          controllerCapacity.pitchDegrees.maximum
        ),

      zoomScale:
        clamp(
          cameraCandidate.zoomScale,
          controllerCapacity.zoomScale.minimum,
          controllerCapacity.zoomScale.maximum
        ),

      target: deepFreeze({
        x:
          clamp(
            cameraCandidate.target.x,
            controllerCapacity.targetBounds.xMin,
            controllerCapacity.targetBounds.xMax
          ),

        y:
          clamp(
            cameraCandidate.target.y,
            controllerCapacity.targetBounds.yMin,
            controllerCapacity.targetBounds.yMax
          ),

        z:
          clamp(
            cameraCandidate.target.z,
            controllerCapacity.targetBounds.zMin,
            controllerCapacity.targetBounds.zMax
          )
      }),

      verticalFovDegrees:
        clamp(
          cameraCandidate.verticalFovDegrees,
          controllerCapacity.verticalFovDegrees.minimum,
          controllerCapacity.verticalFovDegrees.maximum
        ),

      nearPlane:
        H_EARTH_3D_CAMERA_CAPACITY
          .initialProjectionCandidate
          .nearPlane,

      farPlane:
        H_EARTH_3D_CAMERA_CAPACITY
          .initialProjectionCandidate
          .farPlane
    });

  const yawWithinCapacity =
    cameraCandidate.yawDegrees >=
      controllerCapacity.yawDegrees.minimum &&
    cameraCandidate.yawDegrees <=
      controllerCapacity.yawDegrees.maximum;

  const pitchWithinCapacity =
    cameraCandidate.pitchDegrees >=
      controllerCapacity.pitchDegrees.minimum &&
    cameraCandidate.pitchDegrees <=
      controllerCapacity.pitchDegrees.maximum;

  const zoomWithinCapacity =
    cameraCandidate.zoomScale >=
      controllerCapacity.zoomScale.minimum &&
    cameraCandidate.zoomScale <=
      controllerCapacity.zoomScale.maximum;

  const targetWithinCapacity =
    cameraCandidate.target.x >=
      controllerCapacity.targetBounds.xMin &&
    cameraCandidate.target.x <=
      controllerCapacity.targetBounds.xMax &&
    cameraCandidate.target.y >=
      controllerCapacity.targetBounds.yMin &&
    cameraCandidate.target.y <=
      controllerCapacity.targetBounds.yMax &&
    cameraCandidate.target.z >=
      controllerCapacity.targetBounds.zMin &&
    cameraCandidate.target.z <=
      controllerCapacity.targetBounds.zMax;

  const fovWithinCapacity =
    cameraCandidate.verticalFovDegrees >=
      controllerCapacity.verticalFovDegrees.minimum &&
    cameraCandidate.verticalFovDegrees <=
      controllerCapacity.verticalFovDegrees.maximum;

  const planesEligible =
    cameraCandidate.nearPlane >=
      H_EARTH_3D_CAMERA_CAPACITY
        .resolvedCameraPoseEligibility
        .nearPlaneMinimum &&
    cameraCandidate.farPlane <=
      H_EARTH_3D_CAMERA_CAPACITY
        .resolvedCameraPoseEligibility
        .farPlaneMaximum &&
    cameraCandidate.farPlane >
      cameraCandidate.nearPlane;

  checks.push(
    createCapacityCheck(
      'CAMERA_YAW_WITHIN_CAPACITY',
      yawWithinCapacity,
      cameraCandidate.yawDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_PITCH_WITHIN_CAPACITY',
      pitchWithinCapacity,
      cameraCandidate.pitchDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_ZOOM_WITHIN_CAPACITY',
      zoomWithinCapacity,
      cameraCandidate.zoomScale
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_TARGET_WITHIN_CAPACITY',
      targetWithinCapacity,
      cameraCandidate.target
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_FOV_WITHIN_CAPACITY',
      fovWithinCapacity,
      cameraCandidate.verticalFovDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_PLANES_ELIGIBLE',
      planesEligible,
      deepFreeze({
        nearPlane:
          cameraCandidate.nearPlane,

        farPlane:
          cameraCandidate.farPlane
      })
    )
  );

  if (!yawWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_YAW_OUTSIDE_CAPACITY',
        'Camera yaw falls outside capacity.',
        cameraCandidate.yawDegrees
      )
    );
  }

  if (!pitchWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_PITCH_OUTSIDE_CAPACITY',
        'Camera pitch falls outside capacity.',
        cameraCandidate.pitchDegrees
      )
    );
  }

  if (!zoomWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_ZOOM_OUTSIDE_CAPACITY',
        'Camera zoom scale falls outside capacity.',
        cameraCandidate.zoomScale
      )
    );
  }

  if (!targetWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_TARGET_OUTSIDE_CAPACITY',
        'Camera target falls outside capacity.',
        cameraCandidate.target
      )
    );
  }

  if (!fovWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_FOV_OUTSIDE_CAPACITY',
        'Camera vertical field of view falls outside capacity.',
        cameraCandidate.verticalFovDegrees
      )
    );
  }

  if (!planesEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_PLANES_NOT_ELIGIBLE',
        'Camera near and far planes are not eligible.',
        deepFreeze({
          nearPlane:
            cameraCandidate.nearPlane,

          farPlane:
            cameraCandidate.farPlane
        })
      )
    );
  }

  const eligible =
    yawWithinCapacity &&
    pitchWithinCapacity &&
    zoomWithinCapacity &&
    targetWithinCapacity &&
    fovWithinCapacity &&
    planesEligible;

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CAMERA_CAPACITY_ELIGIBLE'
        : 'CAMERA_CAPACITY_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    normalizedCameraState,

    adjustmentRequired:
      JSON.stringify(
        cameraCandidate
      ) !==
      JSON.stringify(
        normalizedCameraState
      )
  });
}

/**
 * Evaluates a resolved camera pose.
 */
export function evaluateHEarth3DCameraPose(
  poseCandidate = {}
) {
  const issues = [];
  const checks = [];

  const position =
    poseCandidate.position;

  const target =
    poseCandidate.target;

  const forward =
    poseCandidate.forward;

  const right =
    poseCandidate.right;

  const up =
    poseCandidate.up;

  const vectors = [
    ['position', position],
    ['target', target],
    ['forward', forward],
    ['right', right],
    ['up', up]
  ];

  for (
    const [name, vector]
    of vectors
  ) {
    const valid =
      isPlainObject(vector) &&
      isFiniteNumber(vector.x) &&
      isFiniteNumber(vector.y) &&
      isFiniteNumber(vector.z);

    checks.push(
      createCapacityCheck(
        `CAMERA_POSE_${name.toUpperCase()}_FINITE`,
        valid,
        vector
      )
    );

    if (!valid) {
      issues.push(
        createCapacityIssue(
          'CAMERA_POSE_VECTOR_INVALID',
          `Camera pose vector ${name} must contain finite x, y, and z values.`,
          deepFreeze({
            name,
            vector
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_POSE_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const bounds =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity
      .positionBounds;

  const positionWithinCapacity =
    position.x >= bounds.xMin &&
    position.x <= bounds.xMax &&
    position.y >= bounds.yMin &&
    position.y <= bounds.yMax &&
    position.z >= bounds.zMin &&
    position.z <= bounds.zMax;

  const targetBounds =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity
      .targetBounds;

  const targetWithinCapacity =
    target.x >= targetBounds.xMin &&
    target.x <= targetBounds.xMax &&
    target.y >= targetBounds.yMin &&
    target.y <= targetBounds.yMax &&
    target.z >= targetBounds.zMin &&
    target.z <= targetBounds.zMax;

  const vectorLength = (vector) =>
    Math.hypot(
      vector.x,
      vector.y,
      vector.z
    );

  const tolerance =
    H_EARTH_3D_CAMERA_CAPACITY
      .resolvedCameraPoseEligibility
      .orthogonalBasisTolerance;

  const forwardNormalized =
    Math.abs(
      vectorLength(forward) -
      1
    ) <= tolerance;

  const rightNormalized =
    Math.abs(
      vectorLength(right) -
      1
    ) <= tolerance;

  const upNormalized =
    Math.abs(
      vectorLength(up) -
      1
    ) <= tolerance;

  const revisionEligible =
    Number.isInteger(
      poseCandidate.cameraRevision
    ) &&
    poseCandidate.cameraRevision >= 0;

  const distanceEligible =
    isPositiveFiniteNumber(
      poseCandidate.distance
    ) &&
    Math.abs(
      poseCandidate.distance -
      getVectorDistance(
        position,
        target
      )
    ) <= 0.01;

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_POSITION_WITHIN_CAPACITY',
      positionWithinCapacity,
      position
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_TARGET_WITHIN_CAPACITY',
      targetWithinCapacity,
      target
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_FORWARD_NORMALIZED',
      forwardNormalized,
      vectorLength(forward)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_RIGHT_NORMALIZED',
      rightNormalized,
      vectorLength(right)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_UP_NORMALIZED',
      upNormalized,
      vectorLength(up)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_REVISION_ELIGIBLE',
      revisionEligible,
      poseCandidate.cameraRevision
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_DISTANCE_ELIGIBLE',
      distanceEligible,
      poseCandidate.distance
    )
  );

  if (!positionWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_POSITION_OUTSIDE_CAPACITY',
        'Resolved camera position falls outside capacity.',
        position
      )
    );
  }

  if (!targetWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_TARGET_OUTSIDE_CAPACITY',
        'Resolved camera target falls outside capacity.',
        target
      )
    );
  }

  if (
    !forwardNormalized ||
    !rightNormalized ||
    !upNormalized
  ) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_BASIS_NOT_NORMALIZED',
        'Resolved camera basis vectors must be normalized.'
      )
    );
  }

  if (!revisionEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_REVISION_INVALID',
        'Resolved camera pose requires a non-negative integer camera revision.',
        poseCandidate.cameraRevision
      )
    );
  }

  if (!distanceEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_DISTANCE_INVALID',
        'Resolved camera distance is invalid or inconsistent with position and target.',
        poseCandidate.distance
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CAMERA_POSE_ELIGIBLE'
        : 'CAMERA_POSE_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Evaluates controller/compositor interaction intent capacity.
 */
export function evaluateHEarth3DInteractionIntent(
  intent = {}
) {
  const issues = [];
  const checks = [];

  const intentType =
    intent.type;

  const typePresent =
    isNonEmptyString(
      intentType
    );

  const typeAccepted =
    typePresent &&
    H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
      .acceptedIntentTypes
      .includes(
        intentType
      );

  checks.push(
    createCapacityCheck(
      'CONTROLLER_INTENT_TYPE_PRESENT',
      typePresent,
      intentType
    )
  );

  checks.push(
    createCapacityCheck(
      'CONTROLLER_INTENT_TYPE_ACCEPTED',
      typeAccepted,
      intentType
    )
  );

  if (!typePresent) {
    issues.push(
      createCapacityIssue(
        'CONTROLLER_INTENT_TYPE_MISSING',
        'Controller intent type is required.'
      )
    );
  } else if (!typeAccepted) {
    issues.push(
      createCapacityIssue(
        'CONTROLLER_INTENT_TYPE_UNKNOWN',
        'Controller intent type is not accepted by capacity.',
        intentType
      )
    );
  }

  if (!typeAccepted) {
    return deepFreeze({
      eligible: false,

      status:
        'CONTROLLER_INTENT_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const finiteWithin = (
    field,
    minimum,
    maximum,
    defaultValue = 0
  ) => {
    const value =
      intent[field] ??
      defaultValue;

    const finite =
      isFiniteNumber(
        value
      );

    const within =
      finite &&
      value >= minimum &&
      value <= maximum;

    checks.push(
      createCapacityCheck(
        `CONTROLLER_INTENT_${field.toUpperCase()}_FINITE`,
        finite,
        value
      )
    );

    checks.push(
      createCapacityCheck(
        `CONTROLLER_INTENT_${field.toUpperCase()}_WITHIN_CAPACITY`,
        within,
        deepFreeze({
          value,
          minimum,
          maximum
        })
      )
    );

    if (!finite) {
      issues.push(
        createCapacityIssue(
          'CONTROLLER_INTENT_FIELD_NOT_FINITE',
          `Controller intent field ${field} must be finite.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    } else if (!within) {
      issues.push(
        createCapacityIssue(
          'CONTROLLER_INTENT_FIELD_OUTSIDE_CAPACITY',
          `Controller intent field ${field} falls outside capacity.`,
          deepFreeze({
            field,
            value,
            minimum,
            maximum
          })
        )
      );
    }
  };

  switch (intentType) {
    case 'H_EARTH_COMPOSITOR_INTENT_ORBIT':
      finiteWithin(
        'yawDeltaDegrees',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .yawDeltaDegrees
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .yawDeltaDegrees
          .maximum
      );

      finiteWithin(
        'pitchDeltaDegrees',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .pitchDeltaDegrees
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .pitchDeltaDegrees
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_PAN':
      finiteWithin(
        'horizontalDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .horizontalDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .horizontalDelta
          .maximum
      );

      finiteWithin(
        'verticalDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .verticalDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .verticalDelta
          .maximum
      );

      finiteWithin(
        'depthDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .depthDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .depthDelta
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_ZOOM':
      finiteWithin(
        'zoomScaleDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .zoom
          .zoomScaleDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .zoom
          .zoomScaleDelta
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_VIEWPORT':
      {
        const viewportEvaluation =
          evaluateHEarth3DViewportCapacity(
            intent.viewport ??
            intent
          );

        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_VIEWPORT_ELIGIBLE',
            viewportEvaluation.eligible,
            viewportEvaluation
          )
        );

        if (!viewportEvaluation.eligible) {
          issues.push(
            ...viewportEvaluation.issues
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE':
      {
        const cameraEvaluation =
          evaluateHEarth3DCameraCapacity(
            intent.cameraState
          );

        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE',
            cameraEvaluation.eligible,
            cameraEvaluation
          )
        );

        if (!cameraEvaluation.eligible) {
          issues.push(
            ...cameraEvaluation.issues
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_VISIBLE_LAYERS':
      {
        const visibleLayerIds =
          intent.visibleLayerIds;

        const eligible =
          Array.isArray(
            visibleLayerIds
          ) &&
          visibleLayerIds.every(
            isNonEmptyString
          );

        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_VISIBLE_LAYER_IDS_STRUCTURALLY_ELIGIBLE',
            eligible,
            visibleLayerIds
          )
        );

        if (!eligible) {
          issues.push(
            createCapacityIssue(
              'CONTROLLER_INTENT_VISIBLE_LAYER_IDS_INVALID',
              'Visible layer IDs must be an array of non-empty strings.',
              visibleLayerIds
            )
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_START_INERTIA':
      {
        for (
          const field
          of H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
            .inertia
            .acceptedVelocityFields
        ) {
          finiteWithin(
            field,
            -H_EARTH_3D_INTERACTION_CAPACITY
              .inertia
              .maximumInitialVelocity,
            H_EARTH_3D_INTERACTION_CAPACITY
              .inertia
              .maximumInitialVelocity
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_ADVANCE_INERTIA':
    case 'H_EARTH_COMPOSITOR_INTENT_STOP_INERTIA':
    case 'H_EARTH_COMPOSITOR_INTENT_RESET_VIEW':
      break;

    default:
      break;
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CONTROLLER_INTENT_ELIGIBLE'
        : 'CONTROLLER_INTENT_NOT_ELIGIBLE',

    intentType,

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Explicit controller-intent evaluator alias.
 */
export function evaluateHEarth3DControllerIntentEligibility(
  intent = {}
) {
  return evaluateHEarth3DInteractionIntent(
    intent
  );
}

/**
 * Evaluates the node and primitive budget.
 */
export function evaluateHEarth3DNodeBudget({
  semanticLayerContainers = 0,
  environmentPrimitives = 0,
  interactionNodes = 0,
  routeOverlayNodes = 0,
  diagnosticOwnedNodes = 0
} = {}) {
  const issues = [];
  const checks = [];

  const inputs = {
    semanticLayerContainers,
    environmentPrimitives,
    interactionNodes,
    routeOverlayNodes,
    diagnosticOwnedNodes
  };

  for (
    const [field, value]
    of Object.entries(inputs)
  ) {
    const eligible =
      Number.isInteger(value) &&
      value >= 0;

    checks.push(
      createCapacityCheck(
        `NODE_BUDGET_${field.toUpperCase()}_NON_NEGATIVE_INTEGER`,
        eligible,
        value
      )
    );

    if (!eligible) {
      issues.push(
        createCapacityIssue(
          'NODE_BUDGET_FIELD_INVALID',
          `Node-budget field ${field} must be a non-negative integer.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'NODE_BUDGET_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const budget =
    H_EARTH_3D_NODE_BUDGET;

  const semanticLayerContainersEligible =
    semanticLayerContainers >=
      budget.semanticLayerContainers.minimum &&
    semanticLayerContainers <=
      budget.semanticLayerContainers.maximum;

  const environmentPrimitivesEligible =
    environmentPrimitives >=
      budget.environmentPrimitives.minimum &&
    environmentPrimitives <=
      budget.environmentPrimitives.absoluteMaximum;

  const interactionNodesEligible =
    interactionNodes >=
      budget.interactionNodes.minimum &&
    interactionNodes <=
      budget.interactionNodes.absoluteMaximum;

  const routeOverlayNodesEligible =
    routeOverlayNodes >=
      budget.routeOverlayNodes.minimum &&
    routeOverlayNodes <=
      budget.routeOverlayNodes.absoluteMaximum;

  const diagnosticOwnedNodesEligible =
    diagnosticOwnedNodes >=
      budget.diagnosticOwnedNodes.minimum &&
    diagnosticOwnedNodes <=
      budget.diagnosticOwnedNodes.absoluteMaximum;

  const totalRendererOwnedNodes =
    semanticLayerContainers +
    environmentPrimitives +
    interactionNodes +
    routeOverlayNodes +
    diagnosticOwnedNodes;

  const totalEligible =
    totalRendererOwnedNodes <=
      budget.totalRendererOwnedNodes.absoluteMaximum;

  checks.push(
    createCapacityCheck(
      'SEMANTIC_LAYER_CONTAINER_BUDGET_ELIGIBLE',
      semanticLayerContainersEligible,
      semanticLayerContainers
    )
  );

  checks.push(
    createCapacityCheck(
      'ENVIRONMENT_PRIMITIVE_BUDGET_ELIGIBLE',
      environmentPrimitivesEligible,
      environmentPrimitives
    )
  );

  checks.push(
    createCapacityCheck(
      'INTERACTION_NODE_BUDGET_ELIGIBLE',
      interactionNodesEligible,
      interactionNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'ROUTE_OVERLAY_NODE_BUDGET_ELIGIBLE',
      routeOverlayNodesEligible,
      routeOverlayNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'DIAGNOSTIC_NODE_BUDGET_ELIGIBLE',
      diagnosticOwnedNodesEligible,
      diagnosticOwnedNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'TOTAL_RENDERER_NODE_BUDGET_ELIGIBLE',
      totalEligible,
      totalRendererOwnedNodes
    )
  );

  if (!semanticLayerContainersEligible) {
    issues.push(
      createCapacityIssue(
        'SEMANTIC_LAYER_CONTAINER_BUDGET_EXCEEDED',
        'Semantic layer-container count falls outside capacity.',
        semanticLayerContainers
      )
    );
  }

  if (!environmentPrimitivesEligible) {
    issues.push(
      createCapacityIssue(
        'ENVIRONMENT_PRIMITIVE_BUDGET_EXCEEDED',
        'Environment primitive count falls outside capacity.',
        environmentPrimitives
      )
    );
  }

  if (!interactionNodesEligible) {
    issues.push(
      createCapacityIssue(
        'INTERACTION_NODE_BUDGET_EXCEEDED',
        'Interaction node count falls outside capacity.',
        interactionNodes
      )
    );
  }

  if (!routeOverlayNodesEligible) {
    issues.push(
      createCapacityIssue(
        'ROUTE_OVERLAY_NODE_BUDGET_EXCEEDED',
        'Route overlay node count falls outside capacity.',
        routeOverlayNodes
      )
    );
  }

  if (!diagnosticOwnedNodesEligible) {
    issues.push(
      createCapacityIssue(
        'DIAGNOSTIC_NODE_BUDGET_EXCEEDED',
        'Diagnostic-owned node count falls outside capacity.',
        diagnosticOwnedNodes
      )
    );
  }

  if (!totalEligible) {
    issues.push(
      createCapacityIssue(
        'TOTAL_RENDERER_NODE_BUDGET_EXCEEDED',
        'Total renderer-owned node count exceeds capacity.',
        totalRendererOwnedNodes
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'NODE_BUDGET_ELIGIBLE'
        : 'NODE_BUDGET_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    accounting: deepFreeze({
      semanticLayerContainers,
      environmentPrimitives,
      interactionNodes,
      routeOverlayNodes,
      diagnosticOwnedNodes,
      totalRendererOwnedNodes
    }),

    budget
  });
}

/**
 * Evaluates all three capacity domains without collapsing their counting units.
 */
export function evaluateHEarth3DStageSeparatedCapacity({
  admittedPrimitiveCount = 0,
  projectedFragmentCount = 0,
  semanticLayerContainerCount =
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET
      .semanticLayerContainerCount,
  interactionNodeCount =
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET
      .interactionNodeCount,
  rendererInfrastructureNodeCount =
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET
      .rendererInfrastructureNodeCount,
  mountedProjectedFragmentNodeCount =
    projectedFragmentCount,
  finalRendererOwnedDomNodeCount = null
} = {}) {
  const issues = [];
  const checks = [];

  const counts = {
    admittedPrimitiveCount,
    projectedFragmentCount,
    semanticLayerContainerCount,
    interactionNodeCount,
    rendererInfrastructureNodeCount,
    mountedProjectedFragmentNodeCount
  };

  for (
    const [field, value]
    of Object.entries(counts)
  ) {
    const eligible =
      Number.isSafeInteger(value) &&
      value >= 0;

    checks.push(
      createCapacityCheck(
        `STAGE_SEPARATED_${field.toUpperCase()}_NON_NEGATIVE_SAFE_INTEGER`,
        eligible,
        value
      )
    );

    if (!eligible) {
      issues.push(
        createCapacityIssue(
          'STAGE_SEPARATED_CAPACITY_COUNT_INVALID',
          `Stage-separated capacity field ${field} must be a non-negative safe integer.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,
      status:
        'STAGE_SEPARATED_CAPACITY_NOT_ELIGIBLE',
      counts:
        deepFreeze(counts),
      checks:
        deepFreeze(checks),
      issues:
        deepFreeze(issues),
      budgets:
        H_EARTH_3D_STAGE_SEPARATED_BUDGETS
    });
  }

  const admittedEligible =
    admittedPrimitiveCount >=
      H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET.minimum &&
    admittedPrimitiveCount <=
      H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET.absoluteMaximum;

  const projectedEligible =
    projectedFragmentCount >=
      H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET.minimum &&
    projectedFragmentCount <=
      H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET.absoluteMaximum;

  const semanticEligible =
    semanticLayerContainerCount >=
      H_EARTH_3D_NODE_BUDGET.semanticLayerContainers.minimum &&
    semanticLayerContainerCount <=
      H_EARTH_3D_NODE_BUDGET.semanticLayerContainers.maximum;

  const interactionEligible =
    interactionNodeCount >=
      H_EARTH_3D_NODE_BUDGET.interactionNodes.minimum &&
    interactionNodeCount <=
      H_EARTH_3D_NODE_BUDGET.interactionNodes.absoluteMaximum;

  const infrastructureMatches =
    rendererInfrastructureNodeCount ===
      H_EARTH_3D_FINAL_DOM_NODE_BUDGET
        .rendererInfrastructureNodeCount;

  const mountedProjectedMatchesPlan =
    mountedProjectedFragmentNodeCount ===
      projectedFragmentCount;

  const calculatedFinalRendererOwnedDomNodeCount =
    rendererInfrastructureNodeCount +
    semanticLayerContainerCount +
    interactionNodeCount +
    mountedProjectedFragmentNodeCount;

  const resolvedFinalRendererOwnedDomNodeCount =
    finalRendererOwnedDomNodeCount === null
      ? calculatedFinalRendererOwnedDomNodeCount
      : finalRendererOwnedDomNodeCount;

  const finalAccountingExact =
    resolvedFinalRendererOwnedDomNodeCount ===
      calculatedFinalRendererOwnedDomNodeCount;

  const finalDomEligible =
    resolvedFinalRendererOwnedDomNodeCount <=
      H_EARTH_3D_FINAL_DOM_NODE_BUDGET.absoluteMaximum;

  checks.push(
    createCapacityCheck(
      'ADMITTED_PRIMITIVE_BUDGET_ELIGIBLE',
      admittedEligible,
      admittedPrimitiveCount
    ),
    createCapacityCheck(
      'PROJECTED_FRAGMENT_BUDGET_ELIGIBLE',
      projectedEligible,
      projectedFragmentCount
    ),
    createCapacityCheck(
      'SEMANTIC_CONTAINER_BUDGET_ELIGIBLE',
      semanticEligible,
      semanticLayerContainerCount
    ),
    createCapacityCheck(
      'INTERACTION_NODE_BUDGET_ELIGIBLE',
      interactionEligible,
      interactionNodeCount
    ),
    createCapacityCheck(
      'RENDERER_INFRASTRUCTURE_COUNT_EXACT',
      infrastructureMatches,
      rendererInfrastructureNodeCount
    ),
    createCapacityCheck(
      'MOUNTED_PROJECTED_FRAGMENT_COUNT_MATCHES_PLAN',
      mountedProjectedMatchesPlan,
      mountedProjectedFragmentNodeCount
    ),
    createCapacityCheck(
      'FINAL_RENDERER_OWNED_DOM_ACCOUNTING_EXACT',
      finalAccountingExact,
      resolvedFinalRendererOwnedDomNodeCount
    ),
    createCapacityCheck(
      'FINAL_DOM_NODE_BUDGET_ELIGIBLE',
      finalDomEligible,
      resolvedFinalRendererOwnedDomNodeCount
    )
  );

  if (!admittedEligible) {
    issues.push(
      createCapacityIssue(
        'ADMITTED_PRIMITIVE_BUDGET_EXCEEDED',
        'The admitted source-primitive count falls outside its independent capacity domain.',
        admittedPrimitiveCount
      )
    );
  }

  if (!projectedEligible) {
    issues.push(
      createCapacityIssue(
        'PROJECTED_FRAGMENT_BUDGET_EXCEEDED',
        'The post-clipping projected-fragment count falls outside its independent capacity domain.',
        projectedFragmentCount
      )
    );
  }

  if (!semanticEligible) {
    issues.push(
      createCapacityIssue(
        'SEMANTIC_LAYER_CONTAINER_BUDGET_EXCEEDED',
        'Semantic layer-container count falls outside capacity.',
        semanticLayerContainerCount
      )
    );
  }

  if (!interactionEligible) {
    issues.push(
      createCapacityIssue(
        'INTERACTION_NODE_BUDGET_EXCEEDED',
        'Interaction node count falls outside capacity.',
        interactionNodeCount
      )
    );
  }

  if (!infrastructureMatches) {
    issues.push(
      createCapacityIssue(
        'RENDERER_INFRASTRUCTURE_NODE_COUNT_MISMATCH',
        'Renderer infrastructure-node count does not match the final-DOM accounting contract.',
        rendererInfrastructureNodeCount
      )
    );
  }

  if (!mountedProjectedMatchesPlan) {
    issues.push(
      createCapacityIssue(
        'PROJECTED_PLAN_AND_MOUNTED_FRAGMENT_COUNT_DIVERGE',
        'Mounted projected-fragment nodes do not correspond exactly to the eligible projection plan.',
        deepFreeze({
          projectedFragmentCount,
          mountedProjectedFragmentNodeCount
        })
      )
    );
  }

  if (!finalAccountingExact) {
    issues.push(
      createCapacityIssue(
        'FINAL_DOM_NODE_ACCOUNTING_MISMATCH',
        'Final physical renderer-owned DOM does not equal infrastructure plus semantic containers plus interaction nodes plus mounted projected fragments.',
        deepFreeze({
          expected:
            calculatedFinalRendererOwnedDomNodeCount,
          actual:
            resolvedFinalRendererOwnedDomNodeCount
        })
      )
    );
  }

  if (!finalDomEligible) {
    issues.push(
      createCapacityIssue(
        'FINAL_DOM_NODE_BUDGET_EXCEEDED',
        'Final physical renderer-owned DOM node count exceeds its independent capacity domain.',
        resolvedFinalRendererOwnedDomNodeCount
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'STAGE_SEPARATED_CAPACITY_ELIGIBLE'
        : 'STAGE_SEPARATED_CAPACITY_NOT_ELIGIBLE',
    counts: deepFreeze({
      ...counts,
      finalRendererOwnedDomNodeCount:
        resolvedFinalRendererOwnedDomNodeCount
    }),
    accounting: deepFreeze({
      calculatedFinalRendererOwnedDomNodeCount,
      formula:
        H_EARTH_3D_FINAL_DOM_NODE_BUDGET.accountingPolicy
    }),
    checks:
      deepFreeze(checks),
    issues:
      deepFreeze(issues),
    budgets:
      H_EARTH_3D_STAGE_SEPARATED_BUDGETS
  });
}

/**
 * Evaluates compositor-frame capacity.
 */
export function evaluateHEarth3DCompositorFrameEligibility(
  frameCandidate = {}
) {
  const issues = [];
  const checks = [];

  const frameCapacity =
    H_EARTH_3D_RENDER_FRAME_CAPACITY;

  const objectEligible =
    isPlainObject(
      frameCandidate
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_OBJECT_PRESENT',
      objectEligible
    )
  );

  if (!objectEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_MISSING',
        'A compositor render-frame object is required.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_FRAME_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const missingFields =
    frameCapacity.requiredTopLevelFields
      .filter(
        (field) =>
          frameCandidate[field] ===
          undefined
      );

  const requiredFieldsPresent =
    missingFields.length === 0;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_REQUIRED_FIELDS_PRESENT',
      requiredFieldsPresent,
      deepFreeze({
        missingFields
      })
    )
  );

  if (!requiredFieldsPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REQUIRED_FIELDS_MISSING',
        'The compositor frame is missing required fields.',
        deepFreeze({
          missingFields
        })
      )
    );
  }

  const frameTypeMatches =
    frameCandidate.frameType ===
      frameCapacity.frameType;

  const frameIdEligible =
    isNonEmptyString(
      frameCandidate.frameId
    );

  const frameRevisionEligible =
    Number.isInteger(
      frameCandidate.frameRevision
    ) &&
    frameCandidate.frameRevision >=
      frameCapacity.revisions.minimum;

  const componentRevisionsEligible = [
    frameCandidate.cameraRevision,
    frameCandidate.viewportRevision,
    frameCandidate.visibilityRevision,
    frameCandidate.inertiaRevision
  ].every(
    (revision) =>
      Number.isInteger(revision) &&
      revision >= 0
  );

  const bindingIdentityEligible =
    frameCandidate.bindingIdentity
      ?.activeCell ===
      frameCapacity.bindingRequirements.activeCell &&
    frameCandidate.bindingIdentity
      ?.spatialCellId ===
      frameCapacity.bindingRequirements.spatialCellId &&
    frameCandidate.bindingIdentity
      ?.sceneIdentity ===
      frameCapacity.bindingRequirements.sceneIdentity;

  const coordinateFrameEligible =
    frameCandidate.coordinateFrame ===
      frameCapacity.bindingRequirements.coordinateFrame;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_TYPE_MATCHES',
      frameTypeMatches,
      frameCandidate.frameType
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_ID_ELIGIBLE',
      frameIdEligible,
      frameCandidate.frameId
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_REVISION_ELIGIBLE',
      frameRevisionEligible,
      frameCandidate.frameRevision
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COMPONENT_REVISIONS_ELIGIBLE',
      componentRevisionsEligible
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_BINDING_IDENTITY_ELIGIBLE',
      bindingIdentityEligible,
      frameCandidate.bindingIdentity
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COORDINATE_FRAME_ELIGIBLE',
      coordinateFrameEligible,
      frameCandidate.coordinateFrame
    )
  );

  if (!frameTypeMatches) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_TYPE_MISMATCH',
        'Compositor frame type does not match capacity.',
        frameCandidate.frameType
      )
    );
  }

  if (!frameIdEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_ID_INVALID',
        'Compositor frame ID must be a non-empty string.',
        frameCandidate.frameId
      )
    );
  }

  if (!frameRevisionEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REVISION_INVALID',
        'Compositor frame revision must be a non-negative integer.',
        frameCandidate.frameRevision
      )
    );
  }

  if (!componentRevisionsEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COMPONENT_REVISION_INVALID',
        'All compositor component revisions must be non-negative integers.'
      )
    );
  }

  if (!bindingIdentityEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_BINDING_IDENTITY_MISMATCH',
        'Compositor frame binding identity does not match capacity.',
        frameCandidate.bindingIdentity
      )
    );
  }

  if (!coordinateFrameEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COORDINATE_FRAME_MISMATCH',
        'Compositor frame coordinate frame does not match capacity.',
        frameCandidate.coordinateFrame
      )
    );
  }

  let viewportEvaluation = null;

  if (
    isPlainObject(
      frameCandidate.viewport
    )
  ) {
    viewportEvaluation =
      evaluateHEarth3DViewportCapacity(
        frameCandidate.viewport
      );
  }

  const viewportEligible =
    viewportEvaluation
      ?.eligible === true;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_VIEWPORT_ELIGIBLE',
      viewportEligible,
      viewportEvaluation
    )
  );

  if (!viewportEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_VIEWPORT_NOT_ELIGIBLE',
        'Compositor frame viewport is not eligible.',
        viewportEvaluation
      )
    );
  }

  const cameraEvaluation =
    evaluateHEarth3DCameraPose(
      frameCandidate.resolvedCameraPose
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_CAMERA_POSE_ELIGIBLE',
      cameraEvaluation.eligible,
      cameraEvaluation
    )
  );

  if (!cameraEvaluation.eligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_CAMERA_POSE_NOT_ELIGIBLE',
        'Compositor frame camera pose is not eligible.',
        cameraEvaluation
      )
    );
  }

  const orderedLayerIds =
    frameCandidate.composition
      ?.orderedLayerIds;

  const orderedLayers =
    frameCandidate.composition
      ?.orderedLayers;

  const visibleLayerIds =
    frameCandidate.composition
      ?.visibleLayerIds;

  const compositionArraysPresent =
    Array.isArray(
      orderedLayerIds
    ) &&
    Array.isArray(
      orderedLayers
    ) &&
    Array.isArray(
      visibleLayerIds
    );

  const layerCountEligible =
    compositionArraysPresent &&
    orderedLayerIds.length >=
      frameCapacity
        .compositionRequirements
        .minimumSemanticLayers &&
    orderedLayerIds.length <=
      frameCapacity
        .compositionRequirements
        .maximumSemanticLayers;

  const layerIdsUnique =
    compositionArraysPresent &&
    new Set(
      orderedLayerIds
    ).size ===
      orderedLayerIds.length;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COMPOSITION_ARRAYS_PRESENT',
      compositionArraysPresent
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_LAYER_COUNT_ELIGIBLE',
      layerCountEligible,
      orderedLayerIds?.length
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_LAYER_IDS_UNIQUE',
      layerIdsUnique
    )
  );

  if (!compositionArraysPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COMPOSITION_MISSING',
        'Compositor frame composition arrays are required.'
      )
    );
  }

  if (!layerCountEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_LAYER_COUNT_OUTSIDE_CAPACITY',
        'Compositor frame semantic-layer count falls outside capacity.',
        orderedLayerIds?.length
      )
    );
  }

  if (!layerIdsUnique) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_LAYER_IDS_NOT_UNIQUE',
        'Compositor frame semantic-layer IDs must be unique.'
      )
    );
  }

  const environmentEligible =
    isNonEmptyString(
      frameCandidate.environment
        ?.contractId
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.primitivePlan
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.materials
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.inspectionAnchor
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_ENVIRONMENT_ENVELOPE_ELIGIBLE',
      environmentEligible
    )
  );

  if (!environmentEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_ENVIRONMENT_ENVELOPE_INVALID',
        'Compositor frame environment envelope is incomplete.'
      )
    );
  }

  const rendererRules =
    frameCandidate.rendererRules;

  const rendererRulesEligible =
    rendererRules
      ?.projectionOwnedByRenderer === true &&
    rendererRules
      ?.primitiveConstructionOwnedByRenderer === true &&
    rendererRules
      ?.DOMCSSMaterializationOwnedByRenderer === true &&
    rendererRules
      ?.cameraStateOwnedByRenderer === false &&
    rendererRules
      ?.viewportStateOwnedByRenderer === false &&
    rendererRules
      ?.navigationConstraintsOwnedByRenderer === false &&
    rendererRules
      ?.semanticLayerOrderOwnedByRenderer === false;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_RENDERER_RULES_ELIGIBLE',
      rendererRulesEligible,
      rendererRules
    )
  );

  if (!rendererRulesEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_RENDERER_RULES_INVALID',
        'Compositor frame renderer rules violate the frame-based corridor boundary.',
        rendererRules
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'COMPOSITOR_FRAME_ELIGIBLE'
        : 'COMPOSITOR_FRAME_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    viewportEvaluation,
    cameraEvaluation,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates renderer consumption of a compositor frame.
 */
export function evaluateHEarth3DRendererFrameConsumption({
  frame = null,
  rendererContractId = null,
  compositorContractIdMatches = false,
  capacityContractIdMatches = false,
  environmentContractIdMatches = false,
  bindingIdentityMatches = false,
  coordinateFrameMatches = false,
  requiredLayerOrderConsumed = false,
  requiredLayersPresent = false,
  primitiveBudgetWithinCapacity = false,
  rendererOutputModelAllowed = false,
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
      admittedPrimitiveBudgetProvided: true,
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
      projectedFragmentBudgetProvided: true,
      finalDomNodeBudgetProvided: true,
      stageSeparatedCapacityEvaluatorProvided: true,
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

  checks.push(
    createCapacityCheck(
      'CAPACITY_LANDWARD_CAMERA_ENVELOPE_DEFINED',
      H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.position.z <
        H_EARTH_3D_CAMERA_CAPACITY.initialProjectionCandidate.target.z
    )
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_WATERWARD_YAW_ELIGIBLE',
      H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.yawDegrees.minimum <= 180 &&
        H_EARTH_3D_CAMERA_CAPACITY.futureControllerCapacity.yawDegrees.maximum >= 180
    )
  );

  checks.push(
    createCapacityCheck(
      'CAPACITY_LIVING_PRESENTATION_STANDARD_DEFINED',
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings.animationRuntimeCreated === false
    )
  );

  const evaluatorsAvailable = [
    evaluateHEarth3DViewportCapacity,
    evaluateHEarth3DCameraCapacity,
    evaluateHEarth3DCameraPose,
    evaluateHEarth3DInteractionIntent,
    evaluateHEarth3DControllerIntentEligibility,
    evaluateHEarth3DNodeBudget,
    evaluateHEarth3DStageSeparatedCapacity,
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
    'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v2',

  file:
    '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/capacity.js',

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
  cameraEnvelopeCorrectionId:
    H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,
  cameraCompositionIntentDefined: true,
  livingPresentationCapacityId:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,
  livingPresentationCapacityDefined: true,
  animationRuntimeCreated: false,
  auxiliaryCapacityModuleRequired: false,
  governedBrowserModuleCount: 19,
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
  admittedPrimitiveBudgetDefined: true,
  projectedFragmentBudgetDefined: true,
  finalDomNodeBudgetDefined: true,
  capacityDomainsSeparated: true,
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
  stageSeparatedCapacityEvaluatorDefined: true,
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
    'EXECUTE_FIVE_PROFILE_RENDERER_CORRIDOR_AND_POST_MERGE_DEPLOYED_ROUTE_VERIFICATION',

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
    'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v2',

  file:
    '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/capacity.js',

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

  cameraCompositionIntent:
    H_EARTH_3D_CAMERA_COMPOSITION_INTENT,

  livingPresentationCapacity:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY,

  renderStageLimits:
    H_EARTH_3D_RENDER_STAGE_LIMITS,

  admittedPrimitiveBudget:
    H_EARTH_3D_ADMITTED_PRIMITIVE_BUDGET,

  projectedFragmentBudget:
    H_EARTH_3D_PROJECTED_FRAGMENT_BUDGET,

  finalDomNodeBudget:
    H_EARTH_3D_FINAL_DOM_NODE_BUDGET,

  stageSeparatedBudgets:
    H_EARTH_3D_STAGE_SEPARATED_BUDGETS,

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
