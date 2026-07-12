/**
 * /showroom/globe/h-earth/compositor.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_3_CAMERA_VIEWPORT_FRAME_COMPOSITION_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Renews:
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_PRECHECK_ENVIRONMENT_FIRST_RENDERER_HANDOFF_v1
 *
 * Purpose:
 * Preserve environment-first semantic composition while adding the missing
 * camera, viewport, navigation, inertia, visibility, frame-sequencing, and
 * resolved renderer-handoff authority required by the H-Earth Layer 4
 * architecture.
 *
 * Direct dependencies:
 * - /showroom/globe/h-earth/capacity.js
 * - /showroom/globe/h-earth/environment.js
 *
 * This file owns:
 * - environment-first semantic composition
 * - semantic layer identity and order
 * - render-tier admission
 * - visibility policy
 * - camera composition state
 * - viewport composition state
 * - navigation constraints
 * - normalized compositor-intent evaluation
 * - bounded pan, orbit, zoom, and reset interpretation
 * - bounded inertia state and advancement
 * - resolved camera-pose construction
 * - scene-navigation transform construction
 * - render-frame sequencing
 * - compositor-to-renderer frame handoff
 * - compositor receipts
 *
 * This file does not own:
 * - Path 3 authority
 * - matrix authority
 * - Ground Cell binding authority
 * - boundary, object, zone, or landscape-lattice truth
 * - environment descriptor truth
 * - renderer projection mathematics
 * - renderer primitive construction
 * - DOM/CSS materialization
 * - renderer mount lifecycle
 * - controller event normalization
 * - action execution
 * - Ground Condition Read construction
 * - inspection receipt construction
 * - route bootstrap
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

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_CAPACITY_CONTRACT,
  H_EARTH_3D_CAPACITY_BINDING_IDENTITY,
  H_EARTH_3D_CAPACITY_SOURCE_REFERENCES,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_VIEWPORT_CAPACITY,
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_RENDER_STAGE_LIMITS,
  H_EARTH_3D_NODE_BUDGET,
  H_EARTH_3D_INTERACTION_CAPACITY,
  H_EARTH_3D_MOUNT_ELIGIBILITY,
  H_EARTH_3D_CAPACITY_CLAIM_CEILINGS,
  getHEarth3DCapacityContract,
  getHEarth3DCapacityReceipt,
  evaluateHEarth3DNodeBudget
} from './capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
  H_EARTH_3D_ENVIRONMENT_CONTRACT,
  H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,
  H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS,
  H_EARTH_3D_ENVIRONMENT_TIERS,
  H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,
  H_EARTH_3D_GROUND_SUBSTRATE,
  H_EARTH_3D_SHORELINE_MODEL,
  H_EARTH_3D_WATER_SUBSTRATE,
  H_EARTH_3D_ATMOSPHERE_MODEL,
  H_EARTH_3D_TIDE_POOL_DESCRIPTORS,
  H_EARTH_3D_STONE_DESCRIPTORS,
  H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,
  H_EARTH_3D_BACKGROUND_CONTEXT,
  H_EARTH_3D_INSPECTION_ANCHOR,
  H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,
  H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN,
  H_EARTH_3D_ENVIRONMENT_HANDOFF,
  H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS,
  getHEarth3DEnvironmentContract,
  getHEarth3DEnvironmentReceipt,
  getHEarth3DEnvironmentHandoff,
  evaluateHEarth3DEnvironmentPrimitivePlan
} from './environment.js';

export const H_EARTH_3D_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_3_CAMERA_VIEWPORT_FRAME_COMPOSITION_v1';

export const H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION = 2;

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

const clonePlain = (value) => {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(clonePlain);
  }

  const output = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    output[key] = clonePlain(nestedValue);
  }

  return output;
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const lerp = (start, end, amount) =>
  start + (end - start) * amount;

const isFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);

const isNonEmptyString = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0;

const normalizeAngleDegrees = (degrees) => {
  let normalized = degrees % 360;

  if (normalized > 180) {
    normalized -= 360;
  }

  if (normalized < -180) {
    normalized += 360;
  }

  return normalized;
};

const toRadians = (degrees) =>
  degrees * Math.PI / 180;

const toDegrees = (radians) =>
  radians * 180 / Math.PI;

const round = (
  value,
  precision = 5
) => {
  const factor = 10 ** precision;

  return Math.round(value * factor) / factor;
};

const createVector = (
  x = 0,
  y = 0,
  z = 0
) => ({
  x,
  y,
  z
});

const cloneVector = (vector) =>
  createVector(
    vector.x,
    vector.y,
    vector.z
  );

const addVector = (
  left,
  right
) =>
  createVector(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
  );

const subtractVector = (
  left,
  right
) =>
  createVector(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );

const scaleVector = (
  vector,
  scalar
) =>
  createVector(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );

const getVectorLength = (vector) =>
  Math.hypot(
    vector.x,
    vector.y,
    vector.z
  );

const normalizeVector = (vector) => {
  const length = getVectorLength(vector);

  if (length <= Number.EPSILON) {
    return createVector(0, 0, 0);
  }

  return scaleVector(
    vector,
    1 / length
  );
};

const crossVector = (
  left,
  right
) =>
  createVector(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );

const createCompositorIssue = (
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

const CAPACITY_CONTRACT =
  getHEarth3DCapacityContract();

const CAPACITY_RECEIPT =
  getHEarth3DCapacityReceipt();

const ENVIRONMENT_CONTRACT =
  getHEarth3DEnvironmentContract();

const ENVIRONMENT_RECEIPT =
  getHEarth3DEnvironmentReceipt();

const ENVIRONMENT_HANDOFF =
  getHEarth3DEnvironmentHandoff();

const INITIAL_PROJECTION =
  H_EARTH_3D_CAMERA_CAPACITY
    .initialProjectionCandidate;

const FUTURE_CONTROLLER_CAPACITY =
  H_EARTH_3D_CAMERA_CAPACITY
    .futureControllerCapacity;

const INITIAL_POSITION =
  cloneVector(
    INITIAL_PROJECTION.position
  );

const INITIAL_TARGET =
  cloneVector(
    INITIAL_PROJECTION.target
  );

const INITIAL_UP =
  cloneVector(
    INITIAL_PROJECTION.up
  );

const INITIAL_OFFSET =
  subtractVector(
    INITIAL_POSITION,
    INITIAL_TARGET
  );

const INITIAL_DISTANCE =
  getVectorLength(
    INITIAL_OFFSET
  );

const INITIAL_YAW_DEGREES =
  toDegrees(
    Math.atan2(
      INITIAL_OFFSET.x,
      INITIAL_OFFSET.z
    )
  );

const INITIAL_PITCH_DEGREES =
  toDegrees(
    Math.asin(
      clamp(
        INITIAL_OFFSET.y /
          Math.max(
            INITIAL_DISTANCE,
            Number.EPSILON
          ),
        -1,
        1
      )
    )
  );

const POSITION_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .positionBounds;

const TARGET_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .targetBounds;

const YAW_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .yawDegrees;

const PITCH_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .pitchDegrees;

const FOV_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .verticalFovDegrees;

const ZOOM_SCALE_BOUNDS =
  FUTURE_CONTROLLER_CAPACITY
    .zoomScale;

/**
 * Boundary flags.
 */
export const H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS = deepFreeze({
  ownsSemanticComposition: true,
  ownsSemanticLayerOrder: true,
  ownsRenderTierAdmission: true,
  ownsVisibilityPolicy: true,

  ownsCameraCompositionState: true,
  ownsViewportCompositionState: true,
  ownsNavigationConstraints: true,
  ownsIntentEvaluation: true,
  ownsInertiaState: true,
  ownsRenderFrameSequencing: true,
  ownsResolvedRendererHandoff: true,

  ownsProjectionMathematics: false,
  ownsProjectedPrimitiveConstruction: false,
  ownsDOMCSSMaterialization: false,
  ownsRendererMountLifecycle: false,
  ownsControllerInputNormalization: false,

  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsBoundaryAuthority: false,
  ownsObjectAuthority: false,
  ownsZoneAuthority: false,
  ownsLandscapeLatticeAuthority: false,
  ownsEnvironmentDescriptorTruth: false,

  ownsActionExecution: false,
  ownsReadoutConstruction: false,
  ownsInspectionReceiptConstruction: false,
  ownsRouteBootstrap: false,
  ownsDiagnosticJudgment: false,

  createsActor: false,
  createsCollisionSystem: false,
  createsGroundContactSystem: false,
  createsTraversalSystem: false,
  createsGameplayLoop: false,
  createsFluidSimulation: false,

  matrixCollapse: false
});

/**
 * Binding identity.
 */
export const H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY = deepFreeze({
  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  matrix:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.matrix,

  matrixRole:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.matrixRole,

  activeCell:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell,

  domainCellId:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.domainCellId,

  spatialCellId:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId,

  bindingExpression:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.bindingExpression,

  sceneIdentity:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity,

  coordinateFrame:
    H_EARTH_3D_ENVIRONMENT_HANDOFF.coordinateFrame,

  descriptorOnlyUpstream: true,

  rendererMounted: false,
  controllerInitialized: false,
  runtimeActivationClaim: false
});

/**
 * Source references.
 */
export const H_EARTH_3D_COMPOSITOR_SOURCE_REFERENCES = deepFreeze({
  capacity: deepFreeze({
    path:
      '/showroom/globe/h-earth/capacity.js',

    contractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    backedOccurrenceRecorded: true,

    usage: deepFreeze([
      'public-stage world bounds',
      'viewport capacity',
      'camera capacity',
      'future controller capacity',
      'render-stage limits',
      'node budget',
      'interaction capacity',
      'mount eligibility',
      'claim ceilings'
    ])
  }),

  environment: deepFreeze({
    path:
      '/showroom/globe/h-earth/environment.js',

    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

    backedOccurrenceRecorded: true,

    usage: deepFreeze([
      'environment handoff',
      'environment tiers',
      'material identities',
      'ground substrate',
      'shoreline model',
      'water substrate',
      'atmosphere model',
      'tide-pool descriptors',
      'stone descriptors',
      'jagged-rock descriptors',
      'background context',
      'inspection anchor',
      'primitive plan'
    ])
  }),

  normalizedSourceSpine: deepFreeze({
    path3Binding:
      'H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001',

    step034I:
      '/h-earth-3d/boundaries/matrix-boundaries.js',

    step034J:
      '/h-earth-3d/objects/ground-cell-001.objects.js',

    step034K:
      '/h-earth-3d/zones/ground-cell-001.zones.js',

    step034L:
      '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

    directlyImported: false
  })
});

/**
 * Semantic composition groups.
 */
export const H_EARTH_3D_COMPOSITION_GROUPS = deepFreeze({
  background: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_BACKGROUND',

    label:
      'Background and atmosphere'
  }),

  distance: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_DISTANCE',

    label:
      'Distant context'
  }),

  water: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_WATER',

    label:
      'Water and shoreline transition'
  }),

  ground: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_GROUND',

    label:
      'Ground substrate'
  }),

  details: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_DETAILS',

    label:
      'Grounded environmental details'
  }),

  interaction: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_INTERACTION',

    label:
      'Inspection interaction'
  }),

  overlay: deepFreeze({
    id:
      'H_EARTH_COMPOSITION_GROUP_OVERLAY',

    label:
      'Route-owned overlay'
  })
});

/**
 * Semantic layer IDs.
 */
export const H_EARTH_3D_COMPOSITION_LAYER_IDS = deepFreeze({
  sky:
    'H_EARTH_COMPOSITION_LAYER_SKY',

  atmosphere:
    'H_EARTH_COMPOSITION_LAYER_ATMOSPHERE',

  horizon:
    'H_EARTH_COMPOSITION_LAYER_HORIZON',

  offshoreIslets:
    'H_EARTH_COMPOSITION_LAYER_OFFSHORE_ISLETS',

  manorBluffContext:
    'H_EARTH_COMPOSITION_LAYER_MANOR_BLUFF_CONTEXT',

  openWater:
    'H_EARTH_COMPOSITION_LAYER_OPEN_WATER',

  nearshoreWater:
    'H_EARTH_COMPOSITION_LAYER_NEARSHORE_WATER',

  waveBands:
    'H_EARTH_COMPOSITION_LAYER_WAVE_BANDS',

  shorelineFoam:
    'H_EARTH_COMPOSITION_LAYER_SHORELINE_FOAM',

  wetSand:
    'H_EARTH_COMPOSITION_LAYER_WET_SAND',

  drySand:
    'H_EARTH_COMPOSITION_LAYER_DRY_SAND',

  tidePools:
    'H_EARTH_COMPOSITION_LAYER_TIDE_POOLS',

  stones:
    'H_EARTH_COMPOSITION_LAYER_STONES',

  jaggedRocks:
    'H_EARTH_COMPOSITION_LAYER_JAGGED_ROCKS',

  inspectionAnchor:
    'H_EARTH_COMPOSITION_LAYER_INSPECTION_ANCHOR',

  overlay:
    'H_EARTH_COMPOSITION_LAYER_ROUTE_OVERLAY'
});

/**
 * Environment-first semantic layer order.
 */
export const H_EARTH_3D_COMPOSITION_LAYER_ORDER = deepFreeze([
  H_EARTH_3D_COMPOSITION_LAYER_IDS.sky,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.stones,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor,
  H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
]);

const makeLayer = ({
  id,
  key,
  groupId,
  semanticRole,
  materialId,
  required,
  environmentSource,
  rendererPrimitiveClass,
  interactive = false,
  routeOwned = false
}) =>
  deepFreeze({
    id,
    key,
    groupId,
    semanticRole,
    materialId,
    required,
    environmentSource,
    rendererPrimitiveClass,
    interactive,
    routeOwned
  });

/**
 * Semantic layer descriptors.
 */
export const H_EARTH_3D_COMPOSITION_LAYERS = deepFreeze([
  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.sky,

    key:
      'sky',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.background.id,

    semanticRole:
      'FULL_STAGE_SKY_BACKGROUND',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.sky.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_ATMOSPHERE_MODEL.sky',

    rendererPrimitiveClass:
      'FULL_STAGE_BACKGROUND'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere,

    key:
      'atmosphere',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.background.id,

    semanticRole:
      'ATMOSPHERE_AND_DISTANCE_HAZE',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.atmosphere.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_ATMOSPHERE_MODEL',

    rendererPrimitiveClass:
      'FULL_STAGE_OVERLAY'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon,

    key:
      'horizon',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.background.id,

    semanticRole:
      'DERIVED_WATER_HORIZON',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.haze.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_ATMOSPHERE_MODEL.horizon',

    rendererPrimitiveClass:
      'HORIZON_BAND'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets,

    key:
      'offshore-islets',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.distance.id,

    semanticRole:
      'DISTANT_OFFSHORE_CONTEXT',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.islet.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_BACKGROUND_CONTEXT.offshoreIslets',

    rendererPrimitiveClass:
      'DISTANT_POLYGON_CONTEXT'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext,

    key:
      'manor-bluff-context',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.distance.id,

    semanticRole:
      'DISTANT_MANOR_AND_BLUFF_CONTEXT',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.manorContext.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_BACKGROUND_CONTEXT.manorBluff',

    rendererPrimitiveClass:
      'DISTANT_CONTEXT_CLUSTER'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater,

    key:
      'open-water',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.water.id,

    semanticRole:
      'OPEN_WATER_SUBSTRATE',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.openWater.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_WATER_SUBSTRATE.openWater',

    rendererPrimitiveClass:
      'PROJECTED_SURFACE_BANDS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater,

    key:
      'nearshore-water',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.water.id,

    semanticRole:
      'NEARSHORE_WATER_SUBSTRATE',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.nearshoreWater.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_WATER_SUBSTRATE.nearshore',

    rendererPrimitiveClass:
      'PROJECTED_SURFACE_BANDS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands,

    key:
      'wave-bands',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.water.id,

    semanticRole:
      'NEARSHORE_WAVE_RIBBONS',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_WATER_SUBSTRATE.waveBands',

    rendererPrimitiveClass:
      'PROJECTED_CURVE_RIBBONS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam,

    key:
      'shoreline-foam',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.water.id,

    semanticRole:
      'SHORELINE_CONTACT_FOAM',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.foam.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_SHORELINE_MODEL.foamContact',

    rendererPrimitiveClass:
      'PROJECTED_CURVE_RIBBON'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand,

    key:
      'wet-sand',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.ground.id,

    semanticRole:
      'PRIMARY_INSPECTION_GROUND',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_GROUND_SUBSTRATE.wetSand',

    rendererPrimitiveClass:
      'PROJECTED_SURFACE_BANDS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand,

    key:
      'dry-sand',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.ground.id,

    semanticRole:
      'DRY_SAND_TRANSITION_GROUND',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.drySand.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_GROUND_SUBSTRATE.drySand',

    rendererPrimitiveClass:
      'PROJECTED_SURFACE_BANDS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools,

    key:
      'tide-pools',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.details.id,

    semanticRole:
      'GROUND_EMBEDDED_TIDE_POOLS',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.tidePool.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_TIDE_POOL_DESCRIPTORS',

    rendererPrimitiveClass:
      'PROJECTED_ELLIPTICAL_DETAILS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.stones,

    key:
      'stones',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.details.id,

    semanticRole:
      'SPARSE_GROUNDED_STONES',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_STONE_DESCRIPTORS',

    rendererPrimitiveClass:
      'PROJECTED_GROUNDED_DETAILS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks,

    key:
      'jagged-rocks',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.details.id,

    semanticRole:
      'SPARSE_JAGGED_ROCKS',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.rock.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS',

    rendererPrimitiveClass:
      'PROJECTED_POLYGON_DETAILS'
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor,

    key:
      'inspection-anchor',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.interaction.id,

    semanticRole:
      'PRIMARY_INSPECTION_INTENT_TARGET',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.inspectionAnchor.id,

    required: true,

    environmentSource:
      'H_EARTH_3D_INSPECTION_ANCHOR',

    rendererPrimitiveClass:
      'PROJECTED_INTERACTION_ANCHOR',

    interactive: true
  }),

  makeLayer({
    id:
      H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay,

    key:
      'route-overlay',

    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.overlay.id,

    semanticRole:
      'ROUTE_OWNED_OVERLAY_PLACEHOLDER',

    materialId: null,

    required: false,

    environmentSource: null,

    rendererPrimitiveClass:
      'ROUTE_OWNED_NOT_ENVIRONMENT',

    routeOwned: true
  })
]);

export const H_EARTH_3D_COMPOSITION_LAYER_MAP = deepFreeze(
  Object.fromEntries(
    H_EARTH_3D_COMPOSITION_LAYERS.map(
      (layer) => [
        layer.id,
        layer
      ]
    )
  )
);

/**
 * Render tiers.
 */
export const H_EARTH_3D_COMPOSITOR_RENDER_TIERS = deepFreeze({
  tier1: deepFreeze({
    id:
      'H_EARTH_COMPOSITOR_RENDER_TIER_1',

    label:
      'Essential environment',

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.sky,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor
    ])
  }),

  tier2: deepFreeze({
    id:
      'H_EARTH_COMPOSITOR_RENDER_TIER_2',

    label:
      'Environmental readability',

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.stones
    ])
  }),

  tier3: deepFreeze({
    id:
      'H_EARTH_COMPOSITOR_RENDER_TIER_3',

    label:
      'Context and silhouette',

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks
    ])
  }),

  tier4: deepFreeze({
    id:
      'H_EARTH_COMPOSITOR_RENDER_TIER_4',

    label:
      'Route overlay',

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
    ])
  })
});

/**
 * Visibility policy.
 */
export const H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY = deepFreeze({
  requiredLayerIds: deepFreeze(
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => layer.required)
      .map((layer) => layer.id)
  ),

  optionalLayerIds: deepFreeze(
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => !layer.required)
      .map((layer) => layer.id)
  ),

  defaultVisibleLayerIds: deepFreeze(
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => !layer.routeOwned)
      .map((layer) => layer.id)
  ),

  hiddenByDefaultLayerIds: deepFreeze([
    H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
  ]),

  semanticOrderMutable: false,
  requiredLayerSuppressionAllowed: false,
  routeOverlayEnvironmentOwned: false
});

/**
 * Primitive accounting.
 */
export const H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING = deepFreeze({
  semanticLayerContainers:
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => !layer.routeOwned)
      .length,

  environmentPrimitives:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
      .estimatedEnvironmentPrimitiveCount,

  interactionNodes: 1,
  diagnosticOwnedNodes: 0
});

/**
 * Camera-capacity normalization.
 */
export const H_EARTH_3D_COMPOSITOR_CAMERA_CAPACITY = deepFreeze({
  source:
    'H_EARTH_3D_CAMERA_CAPACITY',

  initialProjectionCandidate:
    H_EARTH_3D_CAMERA_CAPACITY
      .initialProjectionCandidate,

  positionBounds:
    FUTURE_CONTROLLER_CAPACITY
      .positionBounds,

  targetBounds:
    FUTURE_CONTROLLER_CAPACITY
      .targetBounds,

  yawDegrees:
    FUTURE_CONTROLLER_CAPACITY
      .yawDegrees,

  pitchDegrees:
    FUTURE_CONTROLLER_CAPACITY
      .pitchDegrees,

  verticalFovDegrees:
    FUTURE_CONTROLLER_CAPACITY
      .verticalFovDegrees,

  zoomScale:
    FUTURE_CONTROLLER_CAPACITY
      .zoomScale,

  distanceModel:
    'INITIAL_RENDERER_DISTANCE_MULTIPLIED_BY_ZOOM_SCALE',

  initialDistance:
    INITIAL_DISTANCE,

  minimumDistance:
    INITIAL_DISTANCE *
    ZOOM_SCALE_BOUNDS.minimum,

  maximumDistance:
    INITIAL_DISTANCE *
    ZOOM_SCALE_BOUNDS.maximum
});

/**
 * Camera state schema.
 */
export const H_EARTH_3D_COMPOSITOR_CAMERA_STATE_SCHEMA = deepFreeze({
  requiredFields: deepFreeze([
    'yawDegrees',
    'pitchDegrees',
    'zoomScale',
    'target',
    'verticalFovDegrees',
    'nearPlane',
    'farPlane'
  ]),

  targetFields: deepFreeze([
    'x',
    'y',
    'z'
  ]),

  derivedFields: deepFreeze([
    'distance',
    'position',
    'forward',
    'right',
    'up'
  ])
});

/**
 * Camera constraints.
 */
export const H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS = deepFreeze({
  yawDegrees:
    YAW_BOUNDS,

  pitchDegrees:
    PITCH_BOUNDS,

  zoomScale:
    ZOOM_SCALE_BOUNDS,

  targetBounds:
    TARGET_BOUNDS,

  positionBounds:
    POSITION_BOUNDS,

  verticalFovDegrees:
    FOV_BOUNDS,

  nearPlane:
    INITIAL_PROJECTION.nearPlane,

  farPlane:
    INITIAL_PROJECTION.farPlane,

  positionViolationPolicy:
    'REDUCE_ZOOM_SCALE_THEN_CLAMP_TARGET_THEN_REJECT_IF_UNRESOLVED',

  malformedIntentPolicy:
    'FAIL_CLOSED'
});

/**
 * Initial camera state.
 */
export const H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE = deepFreeze({
  yawDegrees:
    clamp(
      normalizeAngleDegrees(
        INITIAL_YAW_DEGREES
      ),
      YAW_BOUNDS.minimum,
      YAW_BOUNDS.maximum
    ),

  pitchDegrees:
    clamp(
      INITIAL_PITCH_DEGREES,
      PITCH_BOUNDS.minimum,
      PITCH_BOUNDS.maximum
    ),

  zoomScale: 1,

  target: deepFreeze({
    x:
      clamp(
        INITIAL_TARGET.x,
        TARGET_BOUNDS.xMin,
        TARGET_BOUNDS.xMax
      ),

    y:
      clamp(
        INITIAL_TARGET.y,
        TARGET_BOUNDS.yMin,
        TARGET_BOUNDS.yMax
      ),

    z:
      clamp(
        INITIAL_TARGET.z,
        TARGET_BOUNDS.zMin,
        TARGET_BOUNDS.zMax
      )
  }),

  verticalFovDegrees:
    clamp(
      INITIAL_PROJECTION
        .verticalFovDegrees,
      FOV_BOUNDS.minimum,
      FOV_BOUNDS.maximum
    ),

  nearPlane:
    INITIAL_PROJECTION.nearPlane,

  farPlane:
    INITIAL_PROJECTION.farPlane
});

/**
 * Viewport state schema.
 */
export const H_EARTH_3D_COMPOSITOR_VIEWPORT_STATE_SCHEMA = deepFreeze({
  requiredFields: deepFreeze([
    'widthPx',
    'heightPx',
    'pixelRatio'
  ]),

  derivedFields: deepFreeze([
    'aspectRatio',
    'orientation',
    'capacityStatus',
    'revision'
  ])
});

/**
 * Initial viewport state.
 */
export const H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE = deepFreeze({
  widthPx: 0,
  heightPx: 0,
  aspectRatio: 0,
  pixelRatio: 1,
  orientation: 'UNRESOLVED',
  capacityStatus: 'UNRESOLVED',
  revision: 0
});

/**
 * Intent types.
 */
export const H_EARTH_3D_COMPOSITOR_INTENT_TYPES = deepFreeze({
  orbit:
    'H_EARTH_COMPOSITOR_INTENT_ORBIT',

  pan:
    'H_EARTH_COMPOSITOR_INTENT_PAN',

  zoom:
    'H_EARTH_COMPOSITOR_INTENT_ZOOM',

  resetView:
    'H_EARTH_COMPOSITOR_INTENT_RESET_VIEW',

  setCameraState:
    'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE',

  setViewport:
    'H_EARTH_COMPOSITOR_INTENT_SET_VIEWPORT',

  setVisibleLayers:
    'H_EARTH_COMPOSITOR_INTENT_SET_VISIBLE_LAYERS',

  startInertia:
    'H_EARTH_COMPOSITOR_INTENT_START_INERTIA',

  advanceInertia:
    'H_EARTH_COMPOSITOR_INTENT_ADVANCE_INERTIA',

  stopInertia:
    'H_EARTH_COMPOSITOR_INTENT_STOP_INERTIA'
});

/**
 * Intent schema.
 */
export const H_EARTH_3D_COMPOSITOR_INTENT_SCHEMA = deepFreeze({
  commonRequiredFields: deepFreeze([
    'type'
  ]),

  acceptedTypes: deepFreeze(
    Object.values(
      H_EARTH_3D_COMPOSITOR_INTENT_TYPES
    )
  ),

  orbitFields: deepFreeze([
    'yawDeltaDegrees',
    'pitchDeltaDegrees'
  ]),

  panFields: deepFreeze([
    'horizontalDelta',
    'verticalDelta',
    'depthDelta'
  ]),

  zoomFields: deepFreeze([
    'zoomScaleDelta'
  ]),

  viewportFields: deepFreeze([
    'widthPx',
    'heightPx',
    'pixelRatio'
  ]),

  visibilityFields: deepFreeze([
    'visibleLayerIds'
  ])
});

/**
 * Inertia policy.
 */
export const H_EARTH_3D_COMPOSITOR_INERTIA_POLICY = deepFreeze({
  enabled: true,

  damping:
    H_EARTH_3D_INTERACTION_CAPACITY
      .inertiaDamping ??
    0.88,

  minimumVelocity:
    H_EARTH_3D_INTERACTION_CAPACITY
      .inertiaMinimumVelocity ??
    0.018,

  maximumFrames:
    H_EARTH_3D_INTERACTION_CAPACITY
      .inertiaMaximumFrames ??
    90,

  acceptedVelocityFields: deepFreeze([
    'yawVelocity',
    'pitchVelocity',
    'panHorizontalVelocity',
    'panVerticalVelocity',
    'panDepthVelocity',
    'zoomVelocity'
  ])
});

/**
 * Navigation constraints.
 */
export const H_EARTH_3D_COMPOSITOR_NAVIGATION_CONSTRAINTS = deepFreeze({
  camera:
    H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,

  inertia:
    H_EARTH_3D_COMPOSITOR_INERTIA_POLICY,

  semanticOrderMutable: false,
  requiredLayerSuppressionAllowed: false,

  projectionOwnedByRenderer: true,
  inputNormalizationOwnedByController: true
});

const initialState = {
  camera:
    clonePlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE
    ),

  viewport:
    clonePlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE
    ),

  visibility: {
    visibleLayerIds: [
      ...H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
        .defaultVisibleLayerIds
    ],

    revision: 0
  },

  inertia: {
    active: false,
    mode: 'IDLE',

    yawVelocity: 0,
    pitchVelocity: 0,

    panHorizontalVelocity: 0,
    panVerticalVelocity: 0,
    panDepthVelocity: 0,

    zoomVelocity: 0,

    damping:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY.damping,

    frameCount: 0,

    maximumFrames:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .maximumFrames,

    minimumVelocity:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .minimumVelocity
  }
};

/**
 * Controlled module state.
 */
const compositorState = {
  camera:
    clonePlain(initialState.camera),

  viewport:
    clonePlain(initialState.viewport),

  visibility:
    clonePlain(initialState.visibility),

  inertia:
    clonePlain(initialState.inertia),

  cameraRevision: 0,
  viewportRevision: 0,
  visibilityRevision: 0,
  inertiaRevision: 0,
  frameRevision: 0,
  intentSequence: 0,

  lastAcceptedIntent: null,
  lastRejectedIntent: null,
  lastIntentReceipt: null,
  lastFrameReceipt: null,
  lastViewportReceipt: null,
  lastVisibilityReceipt: null,
  lastResetReceipt: null
};

const cloneCameraState = () =>
  clonePlain(
    compositorState.camera
  );

const cloneViewportState = () =>
  clonePlain(
    compositorState.viewport
  );

const cloneVisibilityState = () =>
  clonePlain(
    compositorState.visibility
  );

const cloneInertiaState = () =>
  clonePlain(
    compositorState.inertia
  );

const isWithinBounds = (
  value,
  minimum,
  maximum
) =>
  value >= minimum &&
  value <= maximum;

const isPositionWithinBounds = (
  position
) =>
  isWithinBounds(
    position.x,
    POSITION_BOUNDS.xMin,
    POSITION_BOUNDS.xMax
  ) &&
  isWithinBounds(
    position.y,
    POSITION_BOUNDS.yMin,
    POSITION_BOUNDS.yMax
  ) &&
  isWithinBounds(
    position.z,
    POSITION_BOUNDS.zMin,
    POSITION_BOUNDS.zMax
  );

const clampTarget = (
  target
) =>
  createVector(
    clamp(
      target.x,
      TARGET_BOUNDS.xMin,
      TARGET_BOUNDS.xMax
    ),

    clamp(
      target.y,
      TARGET_BOUNDS.yMin,
      TARGET_BOUNDS.yMax
    ),

    clamp(
      target.z,
      TARGET_BOUNDS.zMin,
      TARGET_BOUNDS.zMax
    )
  );

const deriveCameraPosition = ({
  yawDegrees,
  pitchDegrees,
  zoomScale,
  target
}) => {
  const yawRadians =
    toRadians(yawDegrees);

  const pitchRadians =
    toRadians(pitchDegrees);

  const distance =
    INITIAL_DISTANCE *
    zoomScale;

  const horizontalDistance =
    distance *
    Math.cos(pitchRadians);

  const offset =
    createVector(
      Math.sin(yawRadians) *
        horizontalDistance,

      Math.sin(pitchRadians) *
        distance,

      Math.cos(yawRadians) *
        horizontalDistance
    );

  return {
    distance,

    position:
      addVector(
        target,
        offset
      )
  };
};

const fitCameraToPositionBounds = (
  candidate
) => {
  const normalized = {
    ...candidate,

    target:
      clampTarget(
        candidate.target
      ),

    zoomScale:
      clamp(
        candidate.zoomScale,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      )
  };

  const initialDerived =
    deriveCameraPosition(
      normalized
    );

  if (
    isPositionWithinBounds(
      initialDerived.position
    )
  ) {
    return {
      eligible: true,
      adjusted: false,
      cameraState: normalized,
      derived: initialDerived
    };
  }

  const minimumScale =
    ZOOM_SCALE_BOUNDS.minimum;

  const maximumAttempts = 24;

  let fittedScale =
    normalized.zoomScale;

  for (
    let attempt = 0;
    attempt < maximumAttempts;
    attempt += 1
  ) {
    fittedScale =
      lerp(
        fittedScale,
        minimumScale,
        0.24
      );

    const fittedCandidate = {
      ...normalized,

      zoomScale:
        clamp(
          fittedScale,
          minimumScale,
          ZOOM_SCALE_BOUNDS.maximum
        )
    };

    const fittedDerived =
      deriveCameraPosition(
        fittedCandidate
      );

    if (
      isPositionWithinBounds(
        fittedDerived.position
      )
    ) {
      return {
        eligible: true,
        adjusted: true,

        adjustment:
          'ZOOM_SCALE_REDUCED_TO_RESOLVE_POSITION_BOUNDS',

        cameraState:
          fittedCandidate,

        derived:
          fittedDerived
      };
    }
  }

  return {
    eligible: false,
    adjusted: true,

    issue:
      createCompositorIssue(
        'CAMERA_POSITION_OUTSIDE_CAPACITY_BOUNDS',
        'The proposed camera state cannot be resolved inside capacity position bounds.',
        deepFreeze({
          proposedPosition:
            initialDerived.position,

          positionBounds:
            POSITION_BOUNDS
        })
      )
  };
};

/**
 * Evaluates and normalizes a camera state.
 */
export function evaluateHEarth3DCompositorCameraState(
  cameraCandidate
) {
  const issues = [];

  if (
    !cameraCandidate ||
    typeof cameraCandidate !== 'object'
  ) {
    issues.push(
      createCompositorIssue(
        'CAMERA_STATE_MISSING',
        'A camera state object is required.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  const requiredNumbers = [
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
    of requiredNumbers
  ) {
    if (!isFiniteNumber(value)) {
      issues.push(
        createCompositorIssue(
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
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  const normalizedCandidate = {
    yawDegrees:
      clamp(
        normalizeAngleDegrees(
          cameraCandidate.yawDegrees
        ),
        YAW_BOUNDS.minimum,
        YAW_BOUNDS.maximum
      ),

    pitchDegrees:
      clamp(
        cameraCandidate.pitchDegrees,
        PITCH_BOUNDS.minimum,
        PITCH_BOUNDS.maximum
      ),

    zoomScale:
      clamp(
        cameraCandidate.zoomScale,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      ),

    target:
      clampTarget(
        cameraCandidate.target
      ),

    verticalFovDegrees:
      clamp(
        cameraCandidate.verticalFovDegrees,
        FOV_BOUNDS.minimum,
        FOV_BOUNDS.maximum
      ),

    nearPlane:
      INITIAL_PROJECTION.nearPlane,

    farPlane:
      INITIAL_PROJECTION.farPlane
  };

  const fit =
    fitCameraToPositionBounds(
      normalizedCandidate
    );

  if (!fit.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues: deepFreeze([
        fit.issue
      ])
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      fit.adjusted
        ? 'CAMERA_STATE_ELIGIBLE_WITH_CAPACITY_ADJUSTMENT'
        : 'CAMERA_STATE_ELIGIBLE',

    adjusted:
      fit.adjusted,

    adjustment:
      fit.adjustment ??
      null,

    cameraState:
      deepFreeze(
        clonePlain(
          fit.cameraState
        )
      ),

    derived: deepFreeze({
      distance:
        fit.derived.distance,

      position:
        deepFreeze(
          cloneVector(
            fit.derived.position
          )
        )
    }),

    issues:
      deepFreeze([])
  });
}

/**
 * Resolves compositor-owned camera pose.
 */
export function resolveHEarth3DCompositorCameraPose(
  cameraState =
    compositorState.camera
) {
  const evaluation =
    evaluateHEarth3DCompositorCameraState(
      cameraState
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        evaluation.status,

      issues:
        evaluation.issues
    });
  }

  const position =
    cloneVector(
      evaluation.derived.position
    );

  const target =
    cloneVector(
      evaluation.cameraState.target
    );

  const forward =
    normalizeVector(
      subtractVector(
        target,
        position
      )
    );

  const worldUp =
    cloneVector(
      INITIAL_UP
    );

  const right =
    normalizeVector(
      crossVector(
        worldUp,
        forward
      )
    );

  const up =
    normalizeVector(
      crossVector(
        forward,
        right
      )
    );

  return deepFreeze({
    eligible: true,

    status:
      'COMPOSITOR_CAMERA_POSE_RESOLVED',

    model:
      H_EARTH_3D_CAMERA_CAPACITY
        .cameraModel,

    yawDegrees:
      evaluation.cameraState
        .yawDegrees,

    pitchDegrees:
      evaluation.cameraState
        .pitchDegrees,

    zoomScale:
      evaluation.cameraState
        .zoomScale,

    distance:
      evaluation.derived.distance,

    position:
      deepFreeze(position),

    target:
      deepFreeze(target),

    forward:
      deepFreeze(forward),

    right:
      deepFreeze(right),

    up:
      deepFreeze(up),

    verticalFovDegrees:
      evaluation.cameraState
        .verticalFovDegrees,

    nearPlane:
      evaluation.cameraState
        .nearPlane,

    farPlane:
      evaluation.cameraState
        .farPlane,

    positionWithinCapacityBounds:
      isPositionWithinBounds(
        position
      ),

    cameraRevision:
      compositorState.cameraRevision
  });
}

/**
 * Evaluates a viewport candidate.
 */
export function evaluateHEarth3DCompositorViewport(
  viewportCandidate
) {
  const issues = [];

  if (
    !viewportCandidate ||
    typeof viewportCandidate !== 'object'
  ) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_MISSING',
        'A viewport object is required.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  const widthPx =
    viewportCandidate.widthPx;

  const heightPx =
    viewportCandidate.heightPx;

  const pixelRatio =
    viewportCandidate.pixelRatio ??
    1;

  if (
    !isFiniteNumber(widthPx) ||
    widthPx <= 0
  ) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_WIDTH_INVALID',
        'Viewport width must be a positive finite number.',
        widthPx
      )
    );
  }

  if (
    !isFiniteNumber(heightPx) ||
    heightPx <= 0
  ) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_HEIGHT_INVALID',
        'Viewport height must be a positive finite number.',
        heightPx
      )
    );
  }

  if (
    !isFiniteNumber(pixelRatio) ||
    pixelRatio <= 0
  ) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_PIXEL_RATIO_INVALID',
        'Viewport pixel ratio must be a positive finite number.',
        pixelRatio
      )
    );
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  const minimumWidth =
    H_EARTH_3D_VIEWPORT_CAPACITY
      .minimumWidthPx ??
    1;

  const minimumHeight =
    H_EARTH_3D_VIEWPORT_CAPACITY
      .minimumHeightPx ??
    1;

  const maximumWidth =
    H_EARTH_3D_VIEWPORT_CAPACITY
      .maximumWidthPx ??
    Number.POSITIVE_INFINITY;

  const maximumHeight =
    H_EARTH_3D_VIEWPORT_CAPACITY
      .maximumHeightPx ??
    Number.POSITIVE_INFINITY;

  const withinCapacity =
    widthPx >= minimumWidth &&
    heightPx >= minimumHeight &&
    widthPx <= maximumWidth &&
    heightPx <= maximumHeight;

  if (!withinCapacity) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_OUTSIDE_CAPACITY',
        'Viewport dimensions fall outside the renewed capacity envelope.',
        deepFreeze({
          widthPx,
          heightPx,
          minimumWidth,
          minimumHeight,
          maximumWidth,
          maximumHeight
        })
      )
    );
  }

  const aspectRatio =
    widthPx /
    heightPx;

  const orientation =
    aspectRatio > 1.05
      ? 'LANDSCAPE'
      : aspectRatio < 0.95
        ? 'PORTRAIT'
        : 'SQUARE';

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'VIEWPORT_ELIGIBLE'
        : 'VIEWPORT_NOT_ELIGIBLE',

    viewport: deepFreeze({
      widthPx,
      heightPx,
      pixelRatio,
      aspectRatio,
      orientation,

      capacityStatus:
        withinCapacity
          ? 'WITHIN_CAPACITY'
          : 'OUTSIDE_CAPACITY'
    }),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Sets compositor-owned viewport state.
 */
export function setHEarth3DCompositorViewport(
  viewportCandidate
) {
  const evaluation =
    evaluateHEarth3DCompositorViewport(
      viewportCandidate
    );

  if (!evaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_VIEWPORT_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        updated: false,

        status:
          'VIEWPORT_UPDATE_REJECTED',

        evaluation,

        rendererPassClaim: false,
        visualPassClaim: false
      });

    compositorState.lastViewportReceipt =
      receipt;

    return receipt;
  }

  compositorState.viewport = {
    ...clonePlain(
      evaluation.viewport
    ),

    revision:
      compositorState.viewportRevision +
      1
  };

  compositorState.viewportRevision += 1;
  compositorState.frameRevision += 1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_VIEWPORT_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      updated: true,

      status:
        'VIEWPORT_STATE_UPDATED',

      viewport:
        deepFreeze(
          cloneViewportState()
        ),

      viewportRevision:
        compositorState.viewportRevision,

      frameRevision:
        compositorState.frameRevision,

      rendererPassClaim: false,
      visualPassClaim: false
    });

  compositorState.lastViewportReceipt =
    receipt;

  return receipt;
}

/**
 * Evaluates semantic layer order.
 */
export function evaluateHEarth3DCompositionLayerOrder() {
  const issues = [];

  const layerIds =
    H_EARTH_3D_COMPOSITION_LAYERS
      .map((layer) => layer.id);

  const uniqueLayerIds =
    new Set(layerIds);

  if (
    uniqueLayerIds.size !==
    layerIds.length
  ) {
    issues.push(
      createCompositorIssue(
        'DUPLICATE_LAYER_ID_IN_ORDER',
        'The semantic layer order contains duplicate layer IDs.'
      )
    );
  }

  const unorderedDescriptors =
    layerIds.filter(
      (layerId) =>
        !H_EARTH_3D_COMPOSITION_LAYER_ORDER
          .includes(layerId)
    );

  if (
    unorderedDescriptors.length > 0
  ) {
    issues.push(
      createCompositorIssue(
        'LAYER_DESCRIPTOR_NOT_ORDERED',
        'One or more layer descriptors are absent from semantic order.',
        deepFreeze({
          unorderedDescriptors
        })
      )
    );
  }

  const orderedUnknownIds =
    H_EARTH_3D_COMPOSITION_LAYER_ORDER
      .filter(
        (layerId) =>
          !H_EARTH_3D_COMPOSITION_LAYER_MAP[
            layerId
          ]
      );

  if (
    orderedUnknownIds.length > 0
  ) {
    issues.push(
      createCompositorIssue(
        'ORDERED_LAYER_DESCRIPTOR_MISSING',
        'One or more ordered layer IDs do not have descriptors.',
        deepFreeze({
          orderedUnknownIds
        })
      )
    );
  }

  const requiredMissingFromOrder =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .requiredLayerIds
      .filter(
        (layerId) =>
          !H_EARTH_3D_COMPOSITION_LAYER_ORDER
            .includes(layerId)
      );

  if (
    requiredMissingFromOrder.length > 0
  ) {
    issues.push(
      createCompositorIssue(
        'REQUIRED_LAYER_MISSING_FROM_ORDER',
        'One or more required semantic layers are absent from order.',
        deepFreeze({
          requiredMissingFromOrder
        })
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'SEMANTIC_LAYER_ORDER_COHERENT'
        : 'SEMANTIC_LAYER_ORDER_NOT_COHERENT',

    issues:
      deepFreeze(issues),

    orderedLayerIds:
      H_EARTH_3D_COMPOSITION_LAYER_ORDER
  });
}

/**
 * Evaluates a visibility request.
 */
export function evaluateHEarth3DCompositionVisibility({
  visibleLayerIds
} = {}) {
  const issues = [];

  if (
    !Array.isArray(
      visibleLayerIds
    )
  ) {
    issues.push(
      createCompositorIssue(
        'VISIBLE_LAYER_IDS_NOT_ARRAY',
        'Visible layer IDs must be supplied as an array.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITION_VISIBILITY_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  const normalizedIds =
    [...new Set(visibleLayerIds)];

  const unknownIds =
    normalizedIds.filter(
      (layerId) =>
        !H_EARTH_3D_COMPOSITION_LAYER_MAP[
          layerId
        ]
    );

  if (
    unknownIds.length > 0
  ) {
    issues.push(
      createCompositorIssue(
        'UNKNOWN_VISIBLE_LAYER_ID',
        'The visibility request includes unknown layer IDs.',
        deepFreeze({
          unknownIds
        })
      )
    );
  }

  const missingRequiredIds =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .requiredLayerIds
      .filter(
        (layerId) =>
          !normalizedIds.includes(
            layerId
          )
      );

  if (
    missingRequiredIds.length > 0
  ) {
    issues.push(
      createCompositorIssue(
        'REQUIRED_VISIBLE_LAYER_MISSING',
        'The visibility request suppresses one or more required layers.',
        deepFreeze({
          missingRequiredIds
        })
      )
    );
  }

  const orderedVisibleLayerIds =
    H_EARTH_3D_COMPOSITION_LAYER_ORDER
      .filter(
        (layerId) =>
          normalizedIds.includes(
            layerId
          )
      );

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'COMPOSITION_VISIBILITY_ELIGIBLE'
        : 'COMPOSITION_VISIBILITY_NOT_ELIGIBLE',

    visibleLayerIds:
      deepFreeze(
        normalizedIds
      ),

    orderedVisibleLayerIds:
      deepFreeze(
        orderedVisibleLayerIds
      ),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Applies a visibility request.
 */
export function setHEarth3DCompositorVisibleLayers(
  visibleLayerIds
) {
  const evaluation =
    evaluateHEarth3DCompositionVisibility({
      visibleLayerIds
    });

  if (!evaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_VISIBILITY_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        updated: false,

        status:
          'VISIBILITY_UPDATE_REJECTED',

        evaluation,

        rendererPassClaim: false,
        visualPassClaim: false
      });

    compositorState.lastVisibilityReceipt =
      receipt;

    return receipt;
  }

  compositorState.visibility = {
    visibleLayerIds: [
      ...evaluation.orderedVisibleLayerIds
    ],

    revision:
      compositorState.visibilityRevision +
      1
  };

  compositorState.visibilityRevision += 1;
  compositorState.frameRevision += 1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_VISIBILITY_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      updated: true,

      status:
        'VISIBILITY_STATE_UPDATED',

      visibleLayerIds:
        deepFreeze([
          ...compositorState
            .visibility
            .visibleLayerIds
        ]),

      visibilityRevision:
        compositorState.visibilityRevision,

      frameRevision:
        compositorState.frameRevision,

      semanticOrderChanged: false,

      rendererPassClaim: false,
      visualPassClaim: false
    });

  compositorState.lastVisibilityReceipt =
    receipt;

  return receipt;
}

/**
 * Resolves camera-relative planar movement axes.
 */
const resolveNavigationAxes = (
  cameraState
) => {
  const yawRadians =
    toRadians(
      cameraState.yawDegrees
    );

  const right =
    normalizeVector(
      createVector(
        Math.cos(yawRadians),
        0,
        -Math.sin(yawRadians)
      )
    );

  const forward =
    normalizeVector(
      createVector(
        -Math.sin(yawRadians),
        0,
        -Math.cos(yawRadians)
      )
    );

  return {
    right,
    forward,
    up:
      createVector(0, 1, 0)
  };
};

/**
 * Resolves navigation transform.
 */
export function resolveHEarth3DCompositorSceneTransform() {
  const pose =
    resolveHEarth3DCompositorCameraPose();

  if (!pose.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'SCENE_TRANSFORM_NOT_RESOLVED',

      issues:
        pose.issues
    });
  }

  const viewport =
    cloneViewportState();

  return deepFreeze({
    eligible: true,

    status:
      'SCENE_NAVIGATION_TRANSFORM_RESOLVED',

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame,

    cameraPosition:
      pose.position,

    cameraTarget:
      pose.target,

    forward:
      pose.forward,

    right:
      pose.right,

    up:
      pose.up,

    yawDegrees:
      pose.yawDegrees,

    pitchDegrees:
      pose.pitchDegrees,

    zoomScale:
      pose.zoomScale,

    distance:
      pose.distance,

    verticalFovDegrees:
      pose.verticalFovDegrees,

    nearPlane:
      pose.nearPlane,

    farPlane:
      pose.farPlane,

    viewport,

    aspectRatio:
      viewport.aspectRatio,

    semanticLayerOrder:
      H_EARTH_3D_COMPOSITION_LAYER_ORDER,

    cameraRevision:
      compositorState.cameraRevision,

    viewportRevision:
      compositorState.viewportRevision
  });
}

/**
 * Evaluates a normalized compositor intent.
 */
export function evaluateHEarth3DCompositorIntent(
  intent
) {
  const issues = [];

  if (
    !intent ||
    typeof intent !== 'object'
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_INTENT_MISSING',
        'A compositor intent object is required.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_INTENT_NOT_ELIGIBLE',

      issues:
        deepFreeze(issues)
    });
  }

  if (
    !isNonEmptyString(
      intent.type
    )
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_INTENT_TYPE_MISSING',
        'Compositor intent type is required.'
      )
    );
  }

  if (
    isNonEmptyString(
      intent.type
    ) &&
    !Object.values(
      H_EARTH_3D_COMPOSITOR_INTENT_TYPES
    ).includes(
      intent.type
    )
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_INTENT_TYPE_UNKNOWN',
        'The compositor intent type is not recognized.',
        intent.type
      )
    );
  }

  const requireFiniteFields = (
    fields
  ) => {
    for (
      const field
      of fields
    ) {
      if (
        intent[field] !== undefined &&
        !isFiniteNumber(
          intent[field]
        )
      ) {
        issues.push(
          createCompositorIssue(
            'COMPOSITOR_INTENT_FIELD_NOT_FINITE',
            `Intent field ${field} must be finite when supplied.`,
            deepFreeze({
              field,
              value:
                intent[field]
            })
          )
        );
      }
    }
  };

  switch (intent.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      requireFiniteFields([
        'yawDeltaDegrees',
        'pitchDeltaDegrees'
      ]);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      requireFiniteFields([
        'horizontalDelta',
        'verticalDelta',
        'depthDelta'
      ]);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      requireFiniteFields([
        'zoomScaleDelta'
      ]);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      {
        const viewportEvaluation =
          evaluateHEarth3DCompositorViewport(
            intent.viewport ??
            intent
          );

        if (!viewportEvaluation.eligible) {
          issues.push(
            ...viewportEvaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      {
        const visibilityEvaluation =
          evaluateHEarth3DCompositionVisibility({
            visibleLayerIds:
              intent.visibleLayerIds
          });

        if (!visibilityEvaluation.eligible) {
          issues.push(
            ...visibilityEvaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      {
        const cameraEvaluation =
          evaluateHEarth3DCompositorCameraState(
            intent.cameraState
          );

        if (!cameraEvaluation.eligible) {
          issues.push(
            ...cameraEvaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      requireFiniteFields(
        H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
          .acceptedVelocityFields
      );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
      break;

    default:
      break;
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'COMPOSITOR_INTENT_ELIGIBLE'
        : 'COMPOSITOR_INTENT_NOT_ELIGIBLE',

    intent:
      deepFreeze(
        clonePlain(intent)
      ),

    issues:
      deepFreeze(issues)
  });
}

const acceptCameraState = (
  candidate,
  reason
) => {
  const evaluation =
    evaluateHEarth3DCompositorCameraState(
      candidate
    );

  if (!evaluation.eligible) {
    return {
      accepted: false,
      evaluation
    };
  }

  compositorState.camera =
    clonePlain(
      evaluation.cameraState
    );

  compositorState.cameraRevision += 1;
  compositorState.frameRevision += 1;

  return {
    accepted: true,
    reason,
    evaluation
  };
};

const applyOrbitIntent = (
  intent
) => {
  const candidate =
    cloneCameraState();

  candidate.yawDegrees +=
    intent.yawDeltaDegrees ??
    0;

  candidate.pitchDegrees +=
    intent.pitchDeltaDegrees ??
    0;

  return acceptCameraState(
    candidate,
    'ORBIT_INTENT_APPLIED'
  );
};

const applyPanIntent = (
  intent
) => {
  const candidate =
    cloneCameraState();

  const axes =
    resolveNavigationAxes(
      candidate
    );

  const horizontal =
    scaleVector(
      axes.right,
      intent.horizontalDelta ??
      0
    );

  const vertical =
    scaleVector(
      axes.up,
      intent.verticalDelta ??
      0
    );

  const depth =
    scaleVector(
      axes.forward,
      intent.depthDelta ??
      0
    );

  candidate.target =
    addVector(
      candidate.target,
      addVector(
        horizontal,
        addVector(
          vertical,
          depth
        )
      )
    );

  return acceptCameraState(
    candidate,
    'PAN_INTENT_APPLIED'
  );
};

const applyZoomIntent = (
  intent
) => {
  const candidate =
    cloneCameraState();

  candidate.zoomScale +=
    intent.zoomScaleDelta ??
    0;

  return acceptCameraState(
    candidate,
    'ZOOM_INTENT_APPLIED'
  );
};

const applyResetIntent = () => {
  const result =
    acceptCameraState(
      clonePlain(
        H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE
      ),
      'RESET_VIEW_INTENT_APPLIED'
    );

  compositorState.inertia =
    clonePlain(
      initialState.inertia
    );

  compositorState.inertiaRevision += 1;

  return result;
};

/**
 * Starts compositor-owned inertia.
 */
export function startHEarth3DCompositorInertia(
  velocityCandidate = {}
) {
  if (
    !H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
      .enabled
  ) {
    return deepFreeze({
      started: false,

      status:
        'COMPOSITOR_INERTIA_DISABLED'
    });
  }

  const normalized = {
    active: true,

    mode:
      velocityCandidate.mode ??
      'COMPOSITOR_NAVIGATION_INERTIA',

    yawVelocity:
      velocityCandidate.yawVelocity ??
      0,

    pitchVelocity:
      velocityCandidate.pitchVelocity ??
      0,

    panHorizontalVelocity:
      velocityCandidate.panHorizontalVelocity ??
      0,

    panVerticalVelocity:
      velocityCandidate.panVerticalVelocity ??
      0,

    panDepthVelocity:
      velocityCandidate.panDepthVelocity ??
      0,

    zoomVelocity:
      velocityCandidate.zoomVelocity ??
      0,

    damping:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .damping,

    frameCount: 0,

    maximumFrames:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .maximumFrames,

    minimumVelocity:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .minimumVelocity
  };

  for (
    const field
    of H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
      .acceptedVelocityFields
  ) {
    if (
      !isFiniteNumber(
        normalized[field]
      )
    ) {
      return deepFreeze({
        started: false,

        status:
          'COMPOSITOR_INERTIA_VELOCITY_INVALID',

        issue:
          createCompositorIssue(
            'INERTIA_VELOCITY_NOT_FINITE',
            `Inertia velocity ${field} must be finite.`,
            normalized[field]
          )
      });
    }
  }

  compositorState.inertia =
    normalized;

  compositorState.inertiaRevision += 1;
  compositorState.frameRevision += 1;

  return deepFreeze({
    started: true,

    status:
      'COMPOSITOR_INERTIA_STARTED',

    inertia:
      deepFreeze(
        cloneInertiaState()
      ),

    inertiaRevision:
      compositorState.inertiaRevision,

    frameRevision:
      compositorState.frameRevision
  });
}

/**
 * Stops compositor-owned inertia.
 */
export function stopHEarth3DCompositorInertia() {
  const wasActive =
    compositorState.inertia.active;

  compositorState.inertia =
    clonePlain(
      initialState.inertia
    );

  compositorState.inertiaRevision += 1;
  compositorState.frameRevision += 1;

  return deepFreeze({
    stopped:
      wasActive,

    status:
      wasActive
        ? 'COMPOSITOR_INERTIA_STOPPED'
        : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

    inertiaRevision:
      compositorState.inertiaRevision,

    frameRevision:
      compositorState.frameRevision
  });
}

/**
 * Advances one compositor-owned inertia frame.
 */
export function advanceHEarth3DCompositorInertia() {
  const inertia =
    compositorState.inertia;

  if (!inertia.active) {
    return deepFreeze({
      advanced: false,

      status:
        'COMPOSITOR_INERTIA_NOT_ACTIVE'
    });
  }

  const maximumVelocity =
    Math.max(
      Math.abs(
        inertia.yawVelocity
      ),
      Math.abs(
        inertia.pitchVelocity
      ),
      Math.abs(
        inertia.panHorizontalVelocity
      ),
      Math.abs(
        inertia.panVerticalVelocity
      ),
      Math.abs(
        inertia.panDepthVelocity
      ),
      Math.abs(
        inertia.zoomVelocity
      )
    );

  if (
    maximumVelocity <
      inertia.minimumVelocity ||
    inertia.frameCount >=
      inertia.maximumFrames
  ) {
    return stopHEarth3DCompositorInertia();
  }

  const candidate =
    cloneCameraState();

  candidate.yawDegrees +=
    inertia.yawVelocity;

  candidate.pitchDegrees +=
    inertia.pitchVelocity;

  const axes =
    resolveNavigationAxes(
      candidate
    );

  candidate.target =
    addVector(
      candidate.target,
      addVector(
        scaleVector(
          axes.right,
          inertia.panHorizontalVelocity
        ),
        addVector(
          scaleVector(
            axes.up,
            inertia.panVerticalVelocity
          ),
          scaleVector(
            axes.forward,
            inertia.panDepthVelocity
          )
        )
      )
    );

  candidate.zoomScale +=
    inertia.zoomVelocity;

  const cameraResult =
    acceptCameraState(
      candidate,
      'INERTIA_FRAME_APPLIED'
    );

  if (!cameraResult.accepted) {
    stopHEarth3DCompositorInertia();

    return deepFreeze({
      advanced: false,

      status:
        'COMPOSITOR_INERTIA_CAMERA_UPDATE_REJECTED',

      cameraEvaluation:
        cameraResult.evaluation
    });
  }

  inertia.yawVelocity *=
    inertia.damping;

  inertia.pitchVelocity *=
    inertia.damping;

  inertia.panHorizontalVelocity *=
    inertia.damping;

  inertia.panVerticalVelocity *=
    inertia.damping;

  inertia.panDepthVelocity *=
    inertia.damping;

  inertia.zoomVelocity *=
    inertia.damping;

  inertia.frameCount += 1;

  compositorState.inertiaRevision += 1;

  return deepFreeze({
    advanced: true,

    status:
      'COMPOSITOR_INERTIA_FRAME_ADVANCED',

    frameCount:
      inertia.frameCount,

    cameraRevision:
      compositorState.cameraRevision,

    inertiaRevision:
      compositorState.inertiaRevision,

    frameRevision:
      compositorState.frameRevision,

    inertia:
      deepFreeze(
        cloneInertiaState()
      )
  });
}

/**
 * Applies one normalized compositor intent.
 */
export function applyHEarth3DCompositorIntent(
  intent
) {
  compositorState.intentSequence += 1;

  const evaluation =
    evaluateHEarth3DCompositorIntent(
      intent
    );

  if (!evaluation.eligible) {
    const rejectedIntent =
      deepFreeze({
        sequence:
          compositorState.intentSequence,

        intent:
          deepFreeze(
            clonePlain(intent)
          ),

        evaluation
      });

    compositorState.lastRejectedIntent =
      rejectedIntent;

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_INTENT_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        sequence:
          compositorState.intentSequence,

        accepted: false,

        status:
          'COMPOSITOR_INTENT_REJECTED',

        evaluation,

        cameraRevision:
          compositorState.cameraRevision,

        viewportRevision:
          compositorState.viewportRevision,

        visibilityRevision:
          compositorState.visibilityRevision,

        inertiaRevision:
          compositorState.inertiaRevision,

        frameRevision:
          compositorState.frameRevision,

        rendererPassClaim: false,
        visualPassClaim: false,
        validationClaim: false
      });

    compositorState.lastIntentReceipt =
      receipt;

    return receipt;
  }

  let operationResult;

  switch (intent.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      operationResult =
        applyOrbitIntent(intent);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      operationResult =
        applyPanIntent(intent);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      operationResult =
        applyZoomIntent(intent);
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
      operationResult =
        applyResetIntent();
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      operationResult =
        acceptCameraState(
          intent.cameraState,
          'SET_CAMERA_STATE_INTENT_APPLIED'
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      operationResult =
        setHEarth3DCompositorViewport(
          intent.viewport ??
          intent
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      operationResult =
        setHEarth3DCompositorVisibleLayers(
          intent.visibleLayerIds
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      operationResult =
        startHEarth3DCompositorInertia(
          intent
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
      operationResult =
        advanceHEarth3DCompositorInertia();
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
      operationResult =
        stopHEarth3DCompositorInertia();
      break;

    default:
      operationResult = {
        accepted: false,

        status:
          'COMPOSITOR_INTENT_OPERATION_UNRESOLVED'
      };
      break;
  }

  const accepted =
    operationResult.accepted === true ||
    operationResult.updated === true ||
    operationResult.started === true ||
    operationResult.stopped === true ||
    operationResult.advanced === true ||
    operationResult.reason !== undefined;

  const recordedIntent =
    deepFreeze({
      sequence:
        compositorState.intentSequence,

      intent:
        deepFreeze(
          clonePlain(intent)
        ),

      operationResult:
        deepFreeze(
          clonePlain(
            operationResult
          )
        )
    });

  if (accepted) {
    compositorState.lastAcceptedIntent =
      recordedIntent;
  } else {
    compositorState.lastRejectedIntent =
      recordedIntent;
  }

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INTENT_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      sequence:
        compositorState.intentSequence,

      accepted,

      status:
        accepted
          ? 'COMPOSITOR_INTENT_ACCEPTED'
          : 'COMPOSITOR_INTENT_OPERATION_REJECTED',

      intent:
        deepFreeze(
          clonePlain(intent)
        ),

      operationResult:
        deepFreeze(
          clonePlain(
            operationResult
          )
        ),

      cameraRevision:
        compositorState.cameraRevision,

      viewportRevision:
        compositorState.viewportRevision,

      visibilityRevision:
        compositorState.visibilityRevision,

      inertiaRevision:
        compositorState.inertiaRevision,

      frameRevision:
        compositorState.frameRevision,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });

  compositorState.lastIntentReceipt =
    receipt;

  return receipt;
}

/**
 * Composes ordered semantic layers.
 */
export function composeHEarth3DRendererLayers({
  visibleLayerIds =
    compositorState
      .visibility
      .visibleLayerIds,

  includeOverlay = false
} = {}) {
  const requestedIds =
    includeOverlay
      ? [
          ...visibleLayerIds,
          H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
        ]
      : visibleLayerIds.filter(
          (layerId) =>
            layerId !==
            H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
        );

  const visibilityEvaluation =
    evaluateHEarth3DCompositionVisibility({
      visibleLayerIds:
        requestedIds
    });

  if (!visibilityEvaluation.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'RENDERER_LAYER_COMPOSITION_NOT_ELIGIBLE',

      visibilityEvaluation,

      orderedLayerIds:
        deepFreeze([]),

      orderedLayers:
        deepFreeze([])
    });
  }

  const orderedLayers =
    visibilityEvaluation
      .orderedVisibleLayerIds
      .map(
        (layerId) =>
          H_EARTH_3D_COMPOSITION_LAYER_MAP[
            layerId
          ]
      );

  return deepFreeze({
    eligible: true,

    status:
      'RENDERER_LAYER_COMPOSITION_ELIGIBLE',

    orderedLayerIds:
      visibilityEvaluation
        .orderedVisibleLayerIds,

    orderedLayers:
      deepFreeze(
        orderedLayers
      ),

    visibilityEvaluation
  });
}

/**
 * Static identity alignment.
 */
export const H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT = deepFreeze({
  capacityEnvironmentIdentityAligned:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity,

  coordinateFrameMatches:
    H_EARTH_3D_ENVIRONMENT_HANDOFF.coordinateFrame ===
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  activeCell:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell,

  spatialCellId:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId
});

export const H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION =
  deepFreeze(
    evaluateHEarth3DNodeBudget({
      semanticLayerContainers:
        H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
          .semanticLayerContainers,

      environmentPrimitives:
        H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
          .environmentPrimitives,

      interactionNodes:
        H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
          .interactionNodes,

      diagnosticOwnedNodes:
        H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
          .diagnosticOwnedNodes
    })
  );

export const H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION =
  deepFreeze(
    evaluateHEarth3DEnvironmentPrimitivePlan()
  );

export const H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION =
  evaluateHEarth3DCompositionLayerOrder();

/**
 * Renderer preflight.
 */
export const H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT = (() => {
  const issues = [];

  if (
    !H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT
      .capacityEnvironmentIdentityAligned
  ) {
    issues.push(
      createCompositorIssue(
        'CAPACITY_ENVIRONMENT_IDENTITY_MISMATCH',
        'Capacity and environment binding identities do not align.'
      )
    );
  }

  if (
    !H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT
      .coordinateFrameMatches
  ) {
    issues.push(
      createCompositorIssue(
        'CAPACITY_ENVIRONMENT_COORDINATE_FRAME_MISMATCH',
        'Capacity and environment coordinate frames do not align.'
      )
    );
  }

  if (
    !H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION
      .eligible
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_NODE_BUDGET_NOT_ELIGIBLE',
        'The compositor primitive plan exceeds the renewed node budget.',
        H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION
      )
    );
  }

  if (
    !H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION
      .eligible
  ) {
    issues.push(
      createCompositorIssue(
        'ENVIRONMENT_PRIMITIVE_PLAN_NOT_ELIGIBLE',
        'The environment primitive plan is not eligible.',
        H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION
      )
    );
  }

  if (
    !H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION
      .eligible
  ) {
    issues.push(
      createCompositorIssue(
        'SEMANTIC_LAYER_ORDER_NOT_ELIGIBLE',
        'The semantic layer order is not eligible.',
        H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION
      )
    );
  }

  const cameraEvaluation =
    evaluateHEarth3DCompositorCameraState(
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE
    );

  if (!cameraEvaluation.eligible) {
    issues.push(
      createCompositorIssue(
        'INITIAL_CAMERA_STATE_NOT_ELIGIBLE',
        'The initial compositor camera state is not eligible.',
        cameraEvaluation
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'COMPOSITOR_RENDERER_PREFLIGHT_ELIGIBLE'
        : 'COMPOSITOR_RENDERER_PREFLIGHT_NOT_ELIGIBLE',

    issues:
      deepFreeze(issues),

    primitivePlanWithinCapacity:
      H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION
        .eligible === true,

    semanticLayerOrderEligible:
      H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION
        .eligible === true,

    initialCameraStateEligible:
      cameraEvaluation.eligible ===
      true,

    viewportResolved: false,

    rendererImported: false,
    rendererMounted: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
})();

/**
 * Claim ceilings.
 */
export const H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS = deepFreeze({
  runtimeActivationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  playableEnvironmentClaim: false,
  validationClaim: false,
  productionClaim: false,

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
 * Produces the current immutable render frame.
 */
export function composeHEarth3DRenderFrame({
  includeOverlay = false
} = {}) {
  const cameraPose =
    resolveHEarth3DCompositorCameraPose();

  const navigationTransform =
    resolveHEarth3DCompositorSceneTransform();

  const layerComposition =
    composeHEarth3DRendererLayers({
      visibleLayerIds:
        compositorState
          .visibility
          .visibleLayerIds,

      includeOverlay
    });

  const issues = [];

  if (!cameraPose.eligible) {
    issues.push(
      createCompositorIssue(
        'RENDER_FRAME_CAMERA_POSE_NOT_ELIGIBLE',
        'The render frame camera pose is not eligible.',
        cameraPose
      )
    );
  }

  if (
    !navigationTransform.eligible
  ) {
    issues.push(
      createCompositorIssue(
        'RENDER_FRAME_NAVIGATION_TRANSFORM_NOT_ELIGIBLE',
        'The render frame navigation transform is not eligible.',
        navigationTransform
      )
    );
  }

  if (
    !layerComposition.eligible
  ) {
    issues.push(
      createCompositorIssue(
        'RENDER_FRAME_LAYER_COMPOSITION_NOT_ELIGIBLE',
        'The render frame semantic layer composition is not eligible.',
        layerComposition
      )
    );
  }

  const viewport =
    cloneViewportState();

  if (
    viewport.capacityStatus ===
    'OUTSIDE_CAPACITY'
  ) {
    issues.push(
      createCompositorIssue(
        'RENDER_FRAME_VIEWPORT_OUTSIDE_CAPACITY',
        'The current viewport is outside capacity.',
        viewport
      )
    );
  }

  const eligible =
    issues.length === 0;

  const frame = deepFreeze({
    frameType:
      'H_EARTH_3D_COMPOSITOR_RENDER_FRAME',

    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    frameId:
      `H_EARTH_3D_RENDER_FRAME_${String(
        compositorState.frameRevision
      ).padStart(6, '0')}`,

    frameRevision:
      compositorState.frameRevision,

    cameraRevision:
      compositorState.cameraRevision,

    viewportRevision:
      compositorState.viewportRevision,

    visibilityRevision:
      compositorState.visibilityRevision,

    inertiaRevision:
      compositorState.inertiaRevision,

    eligible,

    status:
      eligible
        ? 'COMPOSITOR_RENDER_FRAME_ELIGIBLE'
        : 'COMPOSITOR_RENDER_FRAME_NOT_ELIGIBLE',

    issues:
      deepFreeze(issues),

    bindingIdentity:
      H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame,

    worldBounds:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

    viewport:
      deepFreeze(viewport),

    resolvedCameraPose:
      cameraPose,

    navigationTransform,

    inertiaState:
      deepFreeze(
        cloneInertiaState()
      ),

    composition: deepFreeze({
      orderedLayerIds:
        layerComposition
          .orderedLayerIds,

      orderedLayers:
        layerComposition
          .orderedLayers,

      visibilityPolicy:
        H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY,

      visibleLayerIds:
        deepFreeze([
          ...compositorState
            .visibility
            .visibleLayerIds
        ]),

      renderTiers:
        H_EARTH_3D_COMPOSITOR_RENDER_TIERS
    }),

    environment: deepFreeze({
      contractId:
        H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

      tiers:
        H_EARTH_3D_ENVIRONMENT_TIERS,

      materials:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,

      ground:
        H_EARTH_3D_GROUND_SUBSTRATE,

      shoreline:
        H_EARTH_3D_SHORELINE_MODEL,

      water:
        H_EARTH_3D_WATER_SUBSTRATE,

      atmosphere:
        H_EARTH_3D_ATMOSPHERE_MODEL,

      tidePools:
        H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

      stones:
        H_EARTH_3D_STONE_DESCRIPTORS,

      jaggedRocks:
        H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

      backgroundContext:
        H_EARTH_3D_BACKGROUND_CONTEXT,

      inspectionAnchor:
        H_EARTH_3D_INSPECTION_ANCHOR,

      actorReadyGroundCandidate:
        H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,

      primitivePlan:
        H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
    }),

    rendererRules: deepFreeze({
      outputModel:
        H_EARTH_3D_RENDER_STAGE_LIMITS
          .permittedOutputModel,

      projectionOwnedByRenderer: true,
      primitiveConstructionOwnedByRenderer: true,
      DOMCSSMaterializationOwnedByRenderer: true,

      cameraStateOwnedByRenderer: false,
      viewportStateOwnedByRenderer: false,
      navigationConstraintsOwnedByRenderer: false,
      semanticLayerOrderOwnedByRenderer: false,

      rendererMustConsumeFrameRevision: true
    }),

    claimCeilings:
      H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
  });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_RENDER_FRAME_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      frameId:
        frame.frameId,

      frameRevision:
        frame.frameRevision,

      eligible:
        frame.eligible,

      status:
        frame.status,

      cameraRevision:
        frame.cameraRevision,

      viewportRevision:
        frame.viewportRevision,

      visibilityRevision:
        frame.visibilityRevision,

      inertiaRevision:
        frame.inertiaRevision,

      rendererConsumed: false,
      rendererMounted: false,
      visualOutputInspected: false,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false
    });

  compositorState.lastFrameReceipt =
    receipt;

  return frame;
}

/**
 * Returns the current compositor render frame.
 */
export function getHEarth3DCompositorRenderFrame() {
  return composeHEarth3DRenderFrame();
}

/**
 * Compatibility renderer-consumption evaluator.
 */
export function evaluateHEarth3DRendererConsumption({
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
  compositorFrameRevisionRecorded = false
} = {}) {
  const checks = deepFreeze({
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
  });

  const rendererPreflightEligible =
    Object.values(checks)
      .every(Boolean);

  return deepFreeze({
    rendererPreflightEligible,

    status:
      rendererPreflightEligible
        ? 'RENDERER_CONSUMPTION_ELIGIBLE'
        : 'RENDERER_CONSUMPTION_NOT_ELIGIBLE',

    checks,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

/**
 * Current compositor state.
 */
export function getHEarth3DCompositorState() {
  return deepFreeze({
    camera:
      deepFreeze(
        cloneCameraState()
      ),

    viewport:
      deepFreeze(
        cloneViewportState()
      ),

    visibility:
      deepFreeze(
        cloneVisibilityState()
      ),

    inertia:
      deepFreeze(
        cloneInertiaState()
      ),

    revisions: deepFreeze({
      camera:
        compositorState.cameraRevision,

      viewport:
        compositorState.viewportRevision,

      visibility:
        compositorState.visibilityRevision,

      inertia:
        compositorState.inertiaRevision,

      frame:
        compositorState.frameRevision
    }),

    intentSequence:
      compositorState.intentSequence,

    lastAcceptedIntent:
      compositorState.lastAcceptedIntent,

    lastRejectedIntent:
      compositorState.lastRejectedIntent
  });
}

/**
 * Operational receipts.
 */
export function getHEarth3DCompositorOperationalReceipts() {
  return deepFreeze({
    intent:
      compositorState
        .lastIntentReceipt,

    frame:
      compositorState
        .lastFrameReceipt,

    viewport:
      compositorState
        .lastViewportReceipt,

    visibility:
      compositorState
        .lastVisibilityReceipt,

    reset:
      compositorState
        .lastResetReceipt
  });
}

/**
 * Resets all mutable compositor state.
 */
export function resetHEarth3DCompositorState() {
  compositorState.camera =
    clonePlain(
      initialState.camera
    );

  compositorState.viewport =
    clonePlain(
      initialState.viewport
    );

  compositorState.visibility =
    clonePlain(
      initialState.visibility
    );

  compositorState.inertia =
    clonePlain(
      initialState.inertia
    );

  compositorState.cameraRevision += 1;
  compositorState.viewportRevision += 1;
  compositorState.visibilityRevision += 1;
  compositorState.inertiaRevision += 1;
  compositorState.frameRevision += 1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_RESET_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      reset: true,

      status:
        'COMPOSITOR_STATE_RESET',

      cameraRevision:
        compositorState.cameraRevision,

      viewportRevision:
        compositorState.viewportRevision,

      visibilityRevision:
        compositorState.visibilityRevision,

      inertiaRevision:
        compositorState.inertiaRevision,

      frameRevision:
        compositorState.frameRevision,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });

  compositorState.lastResetReceipt =
    receipt;

  return receipt;
}

/**
 * Renderer handoff.
 */
export const H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF = deepFreeze({
  handoffType:
    'H_EARTH_LAYER_4_COMPOSITOR_TO_RENDERER_RESOLVED_FRAME_HANDOFF',

  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  bindingIdentity:
    H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
      .coordinateFrame,

  worldBounds:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

  cameraCapacity:
    H_EARTH_3D_COMPOSITOR_CAMERA_CAPACITY,

  cameraConstraints:
    H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,

  viewportSchema:
    H_EARTH_3D_COMPOSITOR_VIEWPORT_STATE_SCHEMA,

  intentTypes:
    H_EARTH_3D_COMPOSITOR_INTENT_TYPES,

  navigationConstraints:
    H_EARTH_3D_COMPOSITOR_NAVIGATION_CONSTRAINTS,

  composition: deepFreeze({
    orderedLayerIds:
      H_EARTH_3D_COMPOSITION_LAYER_ORDER,

    layers:
      H_EARTH_3D_COMPOSITION_LAYERS,

    layerMap:
      H_EARTH_3D_COMPOSITION_LAYER_MAP,

    visibilityPolicy:
      H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY,

    renderTiers:
      H_EARTH_3D_COMPOSITOR_RENDER_TIERS
  }),

  environment: deepFreeze({
    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

    tiers:
      H_EARTH_3D_ENVIRONMENT_TIERS,

    materials:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,

    ground:
      H_EARTH_3D_GROUND_SUBSTRATE,

    shoreline:
      H_EARTH_3D_SHORELINE_MODEL,

    water:
      H_EARTH_3D_WATER_SUBSTRATE,

    atmosphere:
      H_EARTH_3D_ATMOSPHERE_MODEL,

    tidePools:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

    stones:
      H_EARTH_3D_STONE_DESCRIPTORS,

    jaggedRocks:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

    backgroundContext:
      H_EARTH_3D_BACKGROUND_CONTEXT,

    inspectionAnchor:
      H_EARTH_3D_INSPECTION_ANCHOR,

    actorReadyGroundCandidate:
      H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,

    primitivePlan:
      H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
  }),

  preflight:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT,

  currentFrameGetter:
    'getHEarth3DCompositorRenderFrame',

  rendererMustConsumeCurrentFrame: true,

  rendererMayOwnCameraState: false,
  rendererMayOwnViewportState: false,
  rendererMayOwnNavigationConstraints: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false
});

/**
 * Static compositor receipt.
 */
export const H_EARTH_3D_COMPOSITOR_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_CAMERA_VIEWPORT_FRAME_COMPOSITOR_RECEIPT',

  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  renewsContractId:
    'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_PRECHECK_ENVIRONMENT_FIRST_RENDERER_HANDOFF_v1',

  file:
    '/showroom/globe/h-earth/compositor.js',

  capacityContractConsumed: true,
  environmentContractConsumed: true,
  environmentHandoffConsumed: true,

  semanticCompositionDefined: true,
  semanticLayerOrderDefined: true,
  renderTierAdmissionDefined: true,
  visibilityPolicyDefined: true,

  environmentPrimitiveAccountingField:
    'estimatedEnvironmentPrimitiveCount',

  cameraCompositionStateDefined: true,
  capacityCameraShapeConsumed: true,
  futureControllerCapacityConsumed: true,
  positionBoundsConsumed: true,
  targetBoundsConsumed: true,
  yawBoundsConsumed: true,
  pitchBoundsConsumed: true,
  verticalFovBoundsConsumed: true,
  zoomScaleBoundsConsumed: true,

  viewportCompositionDefined: true,
  navigationConstraintsDefined: true,
  compositorIntentEvaluationDefined: true,
  orbitIntentDefined: true,
  panIntentDefined: true,
  zoomIntentDefined: true,
  resetIntentDefined: true,
  visibilityIntentDefined: true,
  viewportIntentDefined: true,

  inertiaStateDefined: true,
  inertiaAdvanceDefined: true,
  inertiaStopDefined: true,

  resolvedCameraPoseDefined: true,
  sceneNavigationTransformDefined: true,
  renderFrameSequencingDefined: true,
  resolvedRendererFrameHandoffDefined: true,

  rendererProjectionAuthorityPreserved: true,
  rendererCameraStateAuthorityRemovedByContract: true,
  controllerInputNormalizationBoundaryPreserved: true,

  dependencyPreflightStatus:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT
      .status,

  dependencyPreflightEligible:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT
      .eligible,

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  rendererFrameConsumptionVerified: false,
  rendererMountVerified: false,
  controllerIntentDispatchVerified: false,
  routeIntegrationVerified: false,
  visualOutputInspected: false,

  nextRequired:
    'BACK_UP_RENEWED_COMPOSITOR_THEN_RENEW_RENDERER_FOR_COMPOSITOR_FRAME_CONSUMPTION',

  ...H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
});

/**
 * Complete compositor contract.
 */
export const H_EARTH_3D_COMPOSITOR_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION,

  renewsContractId:
    'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_PRECHECK_ENVIRONMENT_FIRST_RENDERER_HANDOFF_v1',

  file:
    '/showroom/globe/h-earth/compositor.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'ENVIRONMENT_SEMANTIC_CAMERA_VIEWPORT_AND_RENDER_FRAME_COMPOSITION_AUTHORITY',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  bindingIdentity:
    H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY,

  sourceReferences:
    H_EARTH_3D_COMPOSITOR_SOURCE_REFERENCES,

  compositionGroups:
    H_EARTH_3D_COMPOSITION_GROUPS,

  compositionLayerIds:
    H_EARTH_3D_COMPOSITION_LAYER_IDS,

  compositionLayerOrder:
    H_EARTH_3D_COMPOSITION_LAYER_ORDER,

  compositionLayers:
    H_EARTH_3D_COMPOSITION_LAYERS,

  compositionLayerMap:
    H_EARTH_3D_COMPOSITION_LAYER_MAP,

  renderTiers:
    H_EARTH_3D_COMPOSITOR_RENDER_TIERS,

  visibilityPolicy:
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY,

  primitiveAccounting:
    H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING,

  cameraCapacity:
    H_EARTH_3D_COMPOSITOR_CAMERA_CAPACITY,

  cameraStateSchema:
    H_EARTH_3D_COMPOSITOR_CAMERA_STATE_SCHEMA,

  cameraConstraints:
    H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,

  initialCameraState:
    H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

  viewportStateSchema:
    H_EARTH_3D_COMPOSITOR_VIEWPORT_STATE_SCHEMA,

  initialViewportState:
    H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE,

  intentTypes:
    H_EARTH_3D_COMPOSITOR_INTENT_TYPES,

  intentSchema:
    H_EARTH_3D_COMPOSITOR_INTENT_SCHEMA,

  inertiaPolicy:
    H_EARTH_3D_COMPOSITOR_INERTIA_POLICY,

  navigationConstraints:
    H_EARTH_3D_COMPOSITOR_NAVIGATION_CONSTRAINTS,

  rendererPreflight:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT,

  rendererHandoff:
    H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF,

  boundaryFlags:
    H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS,

  claimCeilings:
    H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
});

/**
 * Returns the immutable compositor contract.
 */
export function getHEarth3DCompositorContract() {
  return H_EARTH_3D_COMPOSITOR_CONTRACT;
}

/**
 * Returns the immutable static compositor receipt.
 */
export function getHEarth3DCompositorReceipt() {
  return H_EARTH_3D_COMPOSITOR_RECEIPT;
}

/**
 * Returns the normalized compositor-to-renderer handoff.
 */
export function getHEarth3DCompositorRendererHandoff() {
  return deepFreeze({
    ...H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF,

    currentFrame:
      getHEarth3DCompositorRenderFrame()
  });
}

/**
 * Returns current compositor renderer preflight.
 */
export function getHEarth3DCompositorRendererPreflight() {
  return H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT;
}

/**
 * Compatibility composition getter.
 */
export function getHEarth3DComposition() {
  return getHEarth3DCompositorRendererHandoff();
}

/**
 * Compatibility public-stage composition surface.
 */
export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION =
  H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF;

/**
 * Compatibility alias for visibility evaluation.
 */
export function evaluateHEarth3DCompositorVisibility(
  options = {}
) {
  return evaluateHEarth3DCompositionVisibility(
    options
  );
}

/**
 * Compatibility alias for frame construction.
 */
export function composeHEarth3DRendererFrame(
  options = {}
) {
  return composeHEarth3DRenderFrame(
    options
  );
}

export default H_EARTH_3D_COMPOSITOR_CONTRACT;
