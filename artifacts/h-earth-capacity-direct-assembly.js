/**
 * /showroom/globe/h-earth/capacity.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v2
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Renews:
 * H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v1
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
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_EXECUTION_CAPACITY_v2';

export const H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 2;

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
      '/showroom/globe/h-earth/region-foundation.js',

    domainConsumerPreflight:
      '/showroom/globe/h-earth/region-domain-consumer-preflight.js',

    matrix:
      '/h-earth-3d/h-earth.matrix.js',

    cell:
      '/h-earth-3d/cells/ground-cell-001.js',

    familyIntegrity:
      '/h-earth-3d/h-earth.integrity.js'
  }),

  publicStageSourceSpine: deepFreeze({
    boundaries:
      '/h-earth-3d/boundaries/matrix-boundaries.js',

    objects:
      '/h-earth-3d/objects/ground-cell-001.objects.js',

    zones:
      '/h-earth-3d/zones/ground-cell-001.zones.js',

    landscapeLattice:
      '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

    directlyImported: false
  }),

  layer4Consumers: deepFreeze({
    environment:
      '/showroom/globe/h-earth/environment.js',

    compositor:
      '/showroom/globe/h-earth/compositor.js',

    renderer:
      '/showroom/globe/h-earth/renderer.js',

    controller:
      '/showroom/globe/h-earth/controller.js',

    index:
      '/showroom/globe/h-earth/index.js',

    diagnostic:
      '/showroom/globe/h-earth/diagnostic/index.js'
  }),

  interactionAuthorities: deepFreeze({
    inspectGround:
      '/h-earth-3d/actions/inspect-ground.js',

    groundConditionRead:
      '/h-earth-3d/readouts/ground-condition-read.js',

    receipts:
      '/h-earth-3d/h-earth.receipts.js',

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
__H_EARTH_CAPACITY_PART_10__
