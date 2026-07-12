/**
 * /showroom/globe/h-earth/compositor.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_PRECHECK_ENVIRONMENT_FIRST_RENDERER_HANDOFF_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Purpose:
 * Consume the renewed Layer 4 capacity and Ground Cell 001 environment
 * contracts, establish environment-first semantic composition, admit bounded
 * render tiers, and expose the normalized handoff required by renderer.js.
 *
 * Controlling inputs:
 * - /showroom/globe/h-earth/capacity.js
 * - /showroom/globe/h-earth/environment.js
 * - Accepted H-Earth Layers 1–3 source truth.
 * - Accepted Path 3 → /h-earth-3d/ binding chain.
 * - H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001.
 * - Steps 034I–034L public-stage source spine, as recorded upstream.
 *
 * This file owns:
 * - Capacity/environment identity alignment.
 * - Environment-first semantic scene order.
 * - Semantic layer identity and grouping.
 * - Render-tier admission.
 * - Visibility and required/optional layer policy.
 * - Primitive-budget preflight.
 * - Renderer input normalization.
 * - Renderer-preflight disposition.
 * - Compositor-specific receipts.
 * - Conservative claim ceilings.
 *
 * This file does not own:
 * - Path 3 spatial authority.
 * - Matrix or Ground Cell binding authority.
 * - Environment content.
 * - Global or local coordinate constitution.
 * - Camera projection mathematics.
 * - Polygon construction.
 * - DOM/CSS3D creation.
 * - Renderer mounting.
 * - Controller behavior.
 * - Route bootstrap.
 * - Diagnostic judgment.
 * - Visual-pass approval.
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
  H_EARTH_3D_ACTOR_CANDIDATE_LIMITS,
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
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_PRECHECK_ENVIRONMENT_FIRST_RENDERER_HANDOFF_v1';

export const H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION = 1;

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

const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value);

const isNonEmptyString = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0;

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

/**
 * Compositor boundary flags.
 */
export const H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS = deepFreeze({
  ownsSemanticComposition: true,
  ownsSemanticLayerOrder: true,
  ownsRenderTierAdmission: true,
  ownsVisibilityPolicy: true,
  ownsRendererHandoffNormalization: true,
  ownsRendererPreflightDisposition: true,
  ownsCompositorReceipt: true,

  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsCoordinateConstitution: false,
  ownsLandscapeLatticeAuthority: false,

  ownsEnvironmentContent: false,
  ownsMaterialRenderingTechnique: false,
  ownsCameraProjection: false,
  ownsGeometryConstruction: false,
  ownsDOMConstruction: false,
  ownsRendererMount: false,
  ownsControllerBehavior: false,
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
 * Binding identity consumed from capacity and environment.
 */
export const H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY = deepFreeze({
  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  matrix:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.matrix,

  matrixRole:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.matrixRole,

  activeCell:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell,

  domainCellId:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.domainCellId,

  spatialCellId:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId,

  bindingExpression:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.bindingExpression,

  sceneIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity,

  capacityEnvironmentIdentityAligned:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.domainCellId ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.domainCellId &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.bindingExpression ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.bindingExpression &&
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity ===
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity,

  acceptedSourceBindingRecorded:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .bindingChainAcceptedForSourceIdentity === true &&
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY
      .acceptedSourceBindingRecorded === true,

  descriptorOnly: true,

  rendererExecutionAuthorized: false,
  runtimeActivationAuthorized: false
});

/**
 * Upstream dependency record.
 */
export const H_EARTH_3D_COMPOSITOR_SOURCE_REFERENCES = deepFreeze({
  capacity: deepFreeze({
    path:
      '/showroom/globe/h-earth/capacity.js',

    contractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    backedOccurrenceRecorded: true,
    consumedByCurrentModule: true
  }),

  environment: deepFreeze({
    path:
      '/showroom/globe/h-earth/environment.js',

    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

    backedOccurrenceRecorded: true,
    consumedByCurrentModule: true
  }),

  acceptedBindingChain:
    H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS
      .acceptedBindingChain,

  publicStageSourceSpine:
    H_EARTH_3D_CAPACITY_SOURCE_REFERENCES
      .publicStageSourceSpine,

  sourcePolicy: deepFreeze({
    compositorMayConsumeCapacity: true,
    compositorMayConsumeEnvironment: true,
    compositorMayNormalizeRendererHandoff: true,

    compositorMayCreateSourceAuthority: false,
    compositorMayCreateEnvironmentContent: false,
    compositorMayInventObjectMembership: false,
    compositorMayInventZoneMembership: false,
    compositorMayInventLatticeIdentity: false,
    compositorMayInventCoordinateLaw: false
  })
});

/**
 * Semantic composition groups.
 *
 * Groups define meaning and renderer handoff structure. They do not define
 * screen coordinates, projected polygons, CSS, DOM nodes, or camera depth.
 */
export const H_EARTH_3D_COMPOSITION_GROUPS = deepFreeze({
  atmosphere: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_ATMOSPHERE',
    role: 'ATMOSPHERIC_CONTEXT',
    tier: 1,
    required: true
  }),

  distantContext: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_DISTANT_CONTEXT',
    role: 'DISTANT_WORLD_CONTEXT',
    tier: 3,
    required: true
  }),

  water: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_WATER',
    role: 'WATER_DEPTH_SYSTEM',
    tier: 1,
    required: true
  }),

  shoreline: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_SHORELINE',
    role: 'GROUND_WATER_CONTACT_SYSTEM',
    tier: 1,
    required: true
  }),

  ground: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_GROUND',
    role: 'CONTINUOUS_GROUND_SYSTEM',
    tier: 1,
    required: true
  }),

  localDetails: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_LOCAL_DETAILS',
    role: 'SPARSE_GROUNDED_DETAIL_SYSTEM',
    tier: 2,
    required: true
  }),

  interaction: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_INTERACTION',
    role: 'DESCRIPTOR_INTERACTION_REFERENCE',
    tier: 2,
    required: true
  }),

  overlay: deepFreeze({
    id: 'H_EARTH_COMPOSITION_GROUP_OVERLAY',
    role: 'NON_WORLD_STATUS_SURFACE',
    tier: 0,
    required: false
  })
});

/**
 * Canonical semantic layer IDs.
 */
export const H_EARTH_3D_COMPOSITION_LAYER_IDS = deepFreeze({
  sky: 'H_EARTH_LAYER_SKY',
  atmosphere: 'H_EARTH_LAYER_ATMOSPHERE',
  horizon: 'H_EARTH_LAYER_HORIZON',

  offshoreIslets: 'H_EARTH_LAYER_OFFSHORE_ISLETS',
  manorBluffContext: 'H_EARTH_LAYER_MANOR_BLUFF_CONTEXT',

  openWater: 'H_EARTH_LAYER_OPEN_WATER',
  nearshoreWater: 'H_EARTH_LAYER_NEARSHORE_WATER',
  waveBands: 'H_EARTH_LAYER_WAVE_BANDS',

  shorelineFoam: 'H_EARTH_LAYER_SHORELINE_FOAM',

  wetSand: 'H_EARTH_LAYER_WET_SAND',
  drySand: 'H_EARTH_LAYER_DRY_SAND',

  tidePools: 'H_EARTH_LAYER_TIDE_POOLS',
  stones: 'H_EARTH_LAYER_STONES',
  jaggedRocks: 'H_EARTH_LAYER_JAGGED_ROCKS',

  inspectionAnchor: 'H_EARTH_LAYER_INSPECTION_ANCHOR',

  overlay: 'H_EARTH_LAYER_OVERLAY'
});

/**
 * Environment-first semantic layer order.
 *
 * The order is semantic back-to-front intent. Renderer camera-depth sorting may
 * resolve overlap within this authority but must not invent a competing scene
 * order.
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

/**
 * Canonical semantic layer descriptors.
 */
export const H_EARTH_3D_COMPOSITION_LAYERS = deepFreeze([
  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.sky,
    key: 'sky',
    label: 'Sky',
    semanticRole: 'SKY',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.atmosphere.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.sky.id,
    sourceDescriptor:
      H_EARTH_3D_ATMOSPHERE_MODEL.sky,
    rendererPrimitiveClass: 'ROOT_BACKGROUND',
    rendererMayDepthSortWithinLayer: false
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere,
    key: 'atmosphere',
    label: 'Atmosphere',
    semanticRole: 'ATMOSPHERIC_DEPTH',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.atmosphere.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .atmosphere
        .id,
    sourceDescriptor:
      H_EARTH_3D_ATMOSPHERE_MODEL,
    rendererPrimitiveClass: 'ATMOSPHERIC_OVERLAY_SET',
    rendererMayDepthSortWithinLayer: false
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon,
    key: 'horizon',
    label: 'Horizon',
    semanticRole: 'HORIZON_INTEGRATION',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.atmosphere.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.haze.id,
    sourceDescriptor:
      H_EARTH_3D_ATMOSPHERE_MODEL.horizon,
    rendererPrimitiveClass: 'DERIVED_HORIZON_CONTEXT',
    rendererMayDepthSortWithinLayer: false
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets,
    key: 'offshoreIslets',
    label: 'Offshore Islets',
    semanticRole: 'DISTANT_OFFSHORE_CONTEXT',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.distantContext.id,
    tier: 3,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.islet.id,
    sourceDescriptor:
      H_EARTH_3D_BACKGROUND_CONTEXT.offshoreIslets,
    rendererPrimitiveClass: 'SIMPLIFIED_DISTANT_SILHOUETTES',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext,
    key: 'manorBluffContext',
    label: 'Manor Bluff Context',
    semanticRole: 'DISTANT_MANOR_TERRAIN_CONTEXT',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.distantContext.id,
    tier: 3,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .manorContext
        .id,
    sourceDescriptor:
      H_EARTH_3D_BACKGROUND_CONTEXT.manorBluff,
    rendererPrimitiveClass: 'SIMPLIFIED_CONTEXT_GROUP',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater,
    key: 'openWater',
    label: 'Open Water',
    semanticRole: 'OPEN_WATER',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.water.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .openWater
        .id,
    sourceDescriptor:
      H_EARTH_3D_WATER_SUBSTRATE.openWater,
    rendererPrimitiveClass: 'PROJECTED_SURFACE_BANDS',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater,
    key: 'nearshoreWater',
    label: 'Nearshore Water',
    semanticRole: 'NEARSHORE_WATER',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.water.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .nearshoreWater
        .id,
    sourceDescriptor:
      H_EARTH_3D_WATER_SUBSTRATE.nearshore,
    rendererPrimitiveClass: 'PROJECTED_SURFACE_BANDS',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands,
    key: 'waveBands',
    label: 'Wave Bands',
    semanticRole: 'BASIC_WAVE_BANDS',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.water.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,
    sourceDescriptor:
      H_EARTH_3D_WATER_SUBSTRATE.waveBands,
    rendererPrimitiveClass: 'PROJECTED_RIBBON_SET',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam,
    key: 'shorelineFoam',
    label: 'Shoreline Foam',
    semanticRole: 'SHORELINE_CONTACT',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.shoreline.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.foam.id,
    sourceDescriptor:
      H_EARTH_3D_SHORELINE_MODEL.foamContact,
    rendererPrimitiveClass: 'PROJECTED_SHORELINE_RIBBON',
    rendererMayDepthSortWithinLayer: false
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand,
    key: 'wetSand',
    label: 'Wet Sand',
    semanticRole: 'WET_GROUND',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.ground.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,
    sourceDescriptor:
      H_EARTH_3D_GROUND_SUBSTRATE.wetSand,
    rendererPrimitiveClass: 'PROJECTED_CONTINUOUS_GROUND_BANDS',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand,
    key: 'drySand',
    label: 'Dry Sand',
    semanticRole: 'DRY_GROUND',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.ground.id,
    tier: 1,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.drySand.id,
    sourceDescriptor:
      H_EARTH_3D_GROUND_SUBSTRATE.drySand,
    rendererPrimitiveClass: 'PROJECTED_CONTINUOUS_GROUND_BANDS',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools,
    key: 'tidePools',
    label: 'Tide Pools',
    semanticRole: 'GROUND_ATTACHED_WATER_DETAILS',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.localDetails.id,
    tier: 2,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.tidePool.id,
    sourceDescriptor:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS,
    rendererPrimitiveClass: 'PROJECTED_GROUND_ATTACHED_ELLIPSE_SET',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.stones,
    key: 'stones',
    label: 'Stones',
    semanticRole: 'GROUNDED_STONE_DETAILS',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.localDetails.id,
    tier: 2,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,
    sourceDescriptor:
      H_EARTH_3D_STONE_DESCRIPTORS,
    rendererPrimitiveClass: 'PROJECTED_GROUNDED_DETAIL_SET',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks,
    key: 'jaggedRocks',
    label: 'Jagged Rocks',
    semanticRole: 'GROUNDED_ROCK_DETAILS',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.localDetails.id,
    tier: 2,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.rock.id,
    sourceDescriptor:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,
    rendererPrimitiveClass: 'PROJECTED_GROUNDED_POLYGON_SET',
    rendererMayDepthSortWithinLayer: true
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor,
    key: 'inspectionAnchor',
    label: 'Inspection Anchor',
    semanticRole: 'INSPECTION_REFERENCE',
    groupId:
      H_EARTH_3D_COMPOSITION_GROUPS.interaction.id,
    tier: 2,
    required: true,
    visibleByDefault: true,
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .inspectionAnchor
        .id,
    sourceDescriptor:
      H_EARTH_3D_INSPECTION_ANCHOR,
    rendererPrimitiveClass: 'PROJECTED_WORLD_ANCHOR',
    rendererMayDepthSortWithinLayer: false
  }),

  deepFreeze({
    id: H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay,
    key: 'overlay',
    label: 'Overlay',
    semanticRole: 'PUBLIC_STATUS_AND_READOUT_SURFACE',
    groupId: H_EARTH_3D_COMPOSITION_GROUPS.overlay.id,
    tier: 0,
    required: false,
    visibleByDefault: false,
    materialId: null,
    sourceDescriptor: deepFreeze({
      statusSurfaceId:
        H_EARTH_3D_CAPACITY_CONTRACT.publicStageIds.statusId,

      inspectionPanelId:
        H_EARTH_3D_CAPACITY_CONTRACT
          .publicStageIds
          .inspectionPanelId,

      rendererOwned: false,
      routeOwned: true
    }),
    rendererPrimitiveClass: 'NON_RENDERER_ROUTE_SURFACE',
    rendererMayDepthSortWithinLayer: false
  })
]);

/**
 * Layer lookup map.
 */
export const H_EARTH_3D_COMPOSITION_LAYER_MAP = deepFreeze(
  Object.fromEntries(
    H_EARTH_3D_COMPOSITION_LAYERS.map((layer) => [
      layer.id,
      layer
    ])
  )
);

/**
 * Render-tier policy.
 */
export const H_EARTH_3D_COMPOSITOR_RENDER_TIERS = deepFreeze({
  tier1: deepFreeze({
    id: 'ENVIRONMENT_SUBSTRATE',
    required: true,
    admitted: true,

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.sky,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand
    ]),

    admissionReason:
      'REQUIRED_TO_ESTABLISH_CONTINUOUS_BOUNDED_ENVIRONMENT'
  }),

  tier2: deepFreeze({
    id: 'MINIMAL_GROUNDED_DETAILS',
    required: true,
    admitted: true,

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.stones,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor
    ]),

    densityPolicy: 'SPARSE',

    admissionReason:
      'REQUIRED_TO_TEST_OBJECT_GROUNDING_WITHOUT_DOMINATING_SUBSTRATE'
  }),

  tier3: deepFreeze({
    id: 'SIMPLIFIED_BACKGROUND_CONTEXT',
    required: true,
    admitted: true,

    layerIds: deepFreeze([
      H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets,
      H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext
    ]),

    densityPolicy: 'SIMPLIFIED_CONTEXT_ONLY',

    admissionReason:
      'REQUIRED_TO_PRESERVE_SCENE_IDENTITY_AND_DEPTH_CONTEXT'
  }),

  tier4: deepFreeze({
    id: 'DEFERRED_REFINEMENT',
    required: false,
    admitted: false,

    members:
      H_EARTH_3D_ENVIRONMENT_TIERS.tier4.members,

    admissionReason:
      'DEFERRED_UNTIL_ENVIRONMENT_SUBSTRATE_READS_AS_BOUNDED_PLACE'
  })
});

/**
 * Composition visibility policy.
 */
export const H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY = deepFreeze({
  defaultVisibleLayerIds: deepFreeze(
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => layer.visibleByDefault)
      .map((layer) => layer.id)
  ),

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

  hiddenByDefaultLayerIds: deepFreeze(
    H_EARTH_3D_COMPOSITION_LAYERS
      .filter((layer) => !layer.visibleByDefault)
      .map((layer) => layer.id)
  ),

  rendererMayHideRequiredLayers: false,
  rendererMayHideOptionalLayers: true,

  controllerMayRequestVisibilityChangesLater: true,
  activeVisibilityControllerPresent: false
});

/**
 * Primitive accounting.
 */
export const H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING = deepFreeze({
  environmentPrimitiveCount:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
      .estimatedEnvironmentPrimitiveCount,

  semanticLayerContainerCount:
    H_EARTH_3D_COMPOSITION_LAYERS.length,

  interactionNodeCandidateCount: 1,

  diagnosticOwnedNodeCandidateCount: 0,

  estimatedTotalRendererOwnedNodeCount:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
      .estimatedEnvironmentPrimitiveCount +
    H_EARTH_3D_COMPOSITION_LAYERS.length +
    1,

  capacityTargets: deepFreeze({
    semanticLayerContainers:
      H_EARTH_3D_NODE_BUDGET.semanticLayerContainers.target,

    environmentPrimitives:
      H_EARTH_3D_NODE_BUDGET.environmentPrimitives.target,

    totalRendererOwnedNodes:
      H_EARTH_3D_NODE_BUDGET.totalRendererOwnedNodes.target
  }),

  capacityWarnings: deepFreeze({
    semanticLayerContainers:
      H_EARTH_3D_NODE_BUDGET.semanticLayerContainers.warning,

    environmentPrimitives:
      H_EARTH_3D_NODE_BUDGET.environmentPrimitives.warning,

    totalRendererOwnedNodes:
      H_EARTH_3D_NODE_BUDGET.totalRendererOwnedNodes.warning
  }),

  capacityMaximums: deepFreeze({
    semanticLayerContainers:
      H_EARTH_3D_NODE_BUDGET.semanticLayerContainers.maximum,

    environmentPrimitives:
      H_EARTH_3D_NODE_BUDGET.environmentPrimitives.maximum,

    totalRendererOwnedNodes:
      H_EARTH_3D_NODE_BUDGET.totalRendererOwnedNodes.maximum
  }),

  accountingIsPerformanceProof: false,
  accountingIsVisualProof: false,
  accountingIsValidationProof: false
});

/**
 * Static upstream identity alignment check.
 */
export const H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT = deepFreeze({
  capacityEnvironmentContractIdsPresent:
    isNonEmptyString(H_EARTH_3D_CAPACITY_CONTRACT_ID) &&
    isNonEmptyString(H_EARTH_3D_ENVIRONMENT_CONTRACT_ID),

  activeCellMatches:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell ===
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell,

  domainCellMatches:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.domainCellId ===
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.domainCellId,

  spatialCellMatches:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId ===
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId,

  sceneIdentityMatches:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity ===
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity,

  bindingExpressionMatches:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.bindingExpression ===
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.bindingExpression,

  coordinateFrameMatches:
    H_EARTH_3D_ENVIRONMENT_HANDOFF.coordinateFrame ===
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  aligned:
    H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY
      .capacityEnvironmentIdentityAligned === true &&
    H_EARTH_3D_ENVIRONMENT_HANDOFF.coordinateFrame ===
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame
});

/**
 * Static primitive-budget evaluation.
 */
export const H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION =
  evaluateHEarth3DNodeBudget({
    semanticLayerContainers:
      H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
        .semanticLayerContainerCount,

    environmentPrimitives:
      H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
        .environmentPrimitiveCount,

    interactionNodes:
      H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
        .interactionNodeCandidateCount,

    diagnosticOwnedNodes:
      H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
        .diagnosticOwnedNodeCandidateCount
  });

export const H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION =
  evaluateHEarth3DEnvironmentPrimitivePlan(
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
  );

/**
 * Static layer-order evaluation.
 */
export const H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION = (() => {
  const issues = [];

  const orderedIds =
    H_EARTH_3D_COMPOSITION_LAYER_ORDER;

  const layerIds =
    H_EARTH_3D_COMPOSITION_LAYERS.map((layer) => layer.id);

  const uniqueOrderedIds =
    new Set(orderedIds);

  const uniqueLayerIds =
    new Set(layerIds);

  if (orderedIds.length !== uniqueOrderedIds.size) {
    issues.push(
      createCompositorIssue(
        'DUPLICATE_LAYER_ID_IN_ORDER',
        'The semantic layer order contains duplicate layer IDs.'
      )
    );
  }

  if (layerIds.length !== uniqueLayerIds.size) {
    issues.push(
      createCompositorIssue(
        'DUPLICATE_LAYER_DESCRIPTOR_ID',
        'The semantic layer descriptors contain duplicate IDs.'
      )
    );
  }

  const missingDescriptors =
    orderedIds.filter(
      (layerId) =>
        !H_EARTH_3D_COMPOSITION_LAYER_MAP[layerId]
    );

  if (missingDescriptors.length > 0) {
    issues.push(
      createCompositorIssue(
        'ORDERED_LAYER_DESCRIPTOR_MISSING',
        'One or more ordered layers do not have descriptors.',
        deepFreeze({
          missingDescriptors
        })
      )
    );
  }

  const unorderedDescriptors =
    layerIds.filter(
      (layerId) =>
        !uniqueOrderedIds.has(layerId)
    );

  if (unorderedDescriptors.length > 0) {
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

  const requiredMissingFromOrder =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .requiredLayerIds
      .filter(
        (layerId) =>
          !uniqueOrderedIds.has(layerId)
      );

  if (requiredMissingFromOrder.length > 0) {
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
    eligible: issues.length === 0,

    status:
      issues.length === 0
        ? 'SEMANTIC_LAYER_ORDER_COHERENT'
        : 'SEMANTIC_LAYER_ORDER_NOT_COHERENT',

    orderedLayerCount:
      orderedIds.length,

    descriptorLayerCount:
      layerIds.length,

    issues: deepFreeze(issues)
  });
})();

/**
 * Renderer-preflight disposition.
 *
 * The renewed compositor supplies the renderer handoff, but renderer preflight
 * remains pending until renderer.js consumes and evaluates this contract.
 */
export const H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT = deepFreeze({
  capacityContractPresent:
    Boolean(CAPACITY_CONTRACT),

  capacityReceiptPresent:
    Boolean(CAPACITY_RECEIPT),

  environmentContractPresent:
    Boolean(ENVIRONMENT_CONTRACT),

  environmentReceiptPresent:
    Boolean(ENVIRONMENT_RECEIPT),

  environmentHandoffPresent:
    Boolean(ENVIRONMENT_HANDOFF),

  identityAlignment:
    H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT.aligned,

  semanticLayerOrderEligible:
    H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION.eligible,

  primitivePlanWithinCapacity:
    H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION.eligible,

  nodeBudgetWithinCapacity:
    H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION.eligible,

  renderOutputModel:
    H_EARTH_3D_RENDER_STAGE_LIMITS.permittedOutputModel,

  rendererHandoffDefined: true,

  rendererPreflightStatus:
    'HANDOFF_DEFINED_RENDERER_CONSUMPTION_PENDING',

  rendererMayMount: false,

  blockingReasons: deepFreeze([
    'renderer-renewal-not-yet-complete',
    'renderer-consumption-not-yet-verified',
    'renderer-module-execution-not-yet-verified',
    'route-mount-not-yet-verified'
  ]),

  rendererPassClaim: false,
  visualPassClaim: false,
  playableEnvironmentClaim: false,
  validationClaim: false,
  productionClaim: false
});

/**
 * Normalized renderer handoff.
 *
 * This is the only compositor-approved scene input the renewed renderer should
 * need for semantic membership, order, and descriptor access.
 */
export const H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF = deepFreeze({
  handoffType:
    'H_EARTH_LAYER_4_COMPOSITOR_TO_RENDERER_ENVIRONMENT_HANDOFF',

  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  bindingIdentity:
    H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY,

  sourceReferences:
    H_EARTH_3D_COMPOSITOR_SOURCE_REFERENCES,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  worldBounds:
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

  actorCandidateLimits:
    H_EARTH_3D_ACTOR_CANDIDATE_LIMITS,

  environment: deepFreeze({
    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

    handoffType:
      H_EARTH_3D_ENVIRONMENT_HANDOFF.handoffType,

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

  composition: deepFreeze({
    groups:
      H_EARTH_3D_COMPOSITION_GROUPS,

    layerIds:
      H_EARTH_3D_COMPOSITION_LAYER_IDS,

    orderedLayerIds:
      H_EARTH_3D_COMPOSITION_LAYER_ORDER,

    layers:
      H_EARTH_3D_COMPOSITION_LAYERS,

    layerMap:
      H_EARTH_3D_COMPOSITION_LAYER_MAP,

    renderTiers:
      H_EARTH_3D_COMPOSITOR_RENDER_TIERS,

    visibilityPolicy:
      H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
  }),

  accounting:
    H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING,

  preflight:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT,

  rendererRules: deepFreeze({
    mustConsumeOrderedLayers: true,
    mustPreserveRequiredLayers: true,
    mustUseSharedCoordinateFrame: true,
    mustUseCapacityCameraModel: true,
    mayConstructInternalProjectionGeometry: true,
    mayResolveDepthWithinSemanticOrder: true,

    mayInventSemanticOrder: false,
    mayInventEnvironmentContent: false,
    mayInventSourceAuthority: false,
    mayRedefineBindingIdentity: false,
    mayRedefineWorldBounds: false,
    mayClaimGroundContact: false,
    mayClaimCollision: false,
    mayClaimVisualPass: false
  }),

  rendererGeometryDefined: false,
  DOMCreated: false,
  rendererMounted: false
});

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

  actorClaim: false,
  groundContactClaim: false,
  collisionClaim: false,
  traversalClaim: false,
  gameplayClaim: false,
  fluidSimulationClaim: false,

  matrixCollapse: false
});

/**
 * Complete compositor contract.
 */
export const H_EARTH_3D_COMPOSITOR_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION,

  file:
    '/showroom/globe/h-earth/compositor.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'ENVIRONMENT_FIRST_SEMANTIC_COMPOSITION_AND_RENDERER_HANDOFF_AUTHORITY',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  capacityContract:
    H_EARTH_3D_CAPACITY_CONTRACT,

  environmentContract:
    H_EARTH_3D_ENVIRONMENT_CONTRACT,

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

  identityAlignment:
    H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT,

  nodeBudgetEvaluation:
    H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION,

  environmentPlanEvaluation:
    H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION,

  layerOrderEvaluation:
    H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION,

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
 * Static compositor receipt.
 */
export const H_EARTH_3D_COMPOSITOR_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_ENVIRONMENT_FIRST_COMPOSITOR_RECEIPT',

  contractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  file:
    '/showroom/globe/h-earth/compositor.js',

  capacityContractConsumed: true,
  environmentContractConsumed: true,
  environmentHandoffConsumed: true,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentContractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  acceptedBindingIdentityConsumed: true,

  bindingExpression:
    H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY
      .bindingExpression,

  capacityEnvironmentIdentityAligned:
    H_EARTH_3D_COMPOSITOR_IDENTITY_ALIGNMENT.aligned,

  environmentFirstCompositionDefined: true,
  semanticLayerGroupsDefined: true,
  semanticLayerOrderDefined: true,
  renderTierAdmissionDefined: true,
  visibilityPolicyDefined: true,
  primitiveAccountingDefined: true,
  rendererHandoffDefined: true,

  semanticLayerCount:
    H_EARTH_3D_COMPOSITION_LAYERS.length,

  requiredLayerCount:
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .requiredLayerIds
      .length,

  admittedRenderTierCount: 3,
  deferredRenderTierCount: 1,

  estimatedEnvironmentPrimitiveCount:
    H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
      .environmentPrimitiveCount,

  estimatedTotalRendererOwnedNodeCount:
    H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING
      .estimatedTotalRendererOwnedNodeCount,

  layerOrderStatus:
    H_EARTH_3D_COMPOSITOR_LAYER_ORDER_EVALUATION
      .status,

  nodeBudgetStatus:
    H_EARTH_3D_COMPOSITOR_NODE_BUDGET_EVALUATION
      .status,

  environmentPlanStatus:
    H_EARTH_3D_COMPOSITOR_ENVIRONMENT_PLAN_EVALUATION
      .status,

  rendererPreflightStatus:
    H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT
      .rendererPreflightStatus,

  rendererMayMount: false,

  environmentContentCreated: false,
  rendererGeometryCreated: false,
  DOMCreated: false,
  rendererMounted: false,
  controllerMounted: false,

  nextRequired:
    'RENEW_RENDERER_JS_TO_CONSUME_COMPOSITOR_APPROVED_ENVIRONMENT_HANDOFF',

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  environmentConsumptionRuntimeVerified: false,
  rendererConsumptionVerified: false,
  routeMountVerified: false,
  visualOutputInspected: false,

  ...H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
});

/**
 * Returns the immutable compositor contract.
 */
export function getHEarth3DCompositorContract() {
  return H_EARTH_3D_COMPOSITOR_CONTRACT;
}

/**
 * Returns the immutable compositor receipt.
 */
export function getHEarth3DCompositorReceipt() {
  return H_EARTH_3D_COMPOSITOR_RECEIPT;
}

/**
 * Returns the normalized compositor-to-renderer handoff.
 */
export function getHEarth3DCompositorRendererHandoff() {
  return H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF;
}

/**
 * Compatibility alias for earlier renderer-consumption naming.
 */
export function getHEarth3DComposition() {
  return H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF;
}

/**
 * Returns the canonical semantic layer order.
 */
export function getHEarth3DCompositionLayerOrder() {
  return H_EARTH_3D_COMPOSITION_LAYER_ORDER;
}

/**
 * Returns all semantic layer descriptors.
 */
export function getHEarth3DCompositionLayers() {
  return H_EARTH_3D_COMPOSITION_LAYERS;
}

/**
 * Returns one semantic layer descriptor.
 */
export function getHEarth3DCompositionLayerById(layerId) {
  if (!isNonEmptyString(layerId)) {
    return null;
  }

  return (
    H_EARTH_3D_COMPOSITION_LAYER_MAP[layerId] ??
    null
  );
}

/**
 * Returns admitted render tiers.
 */
export function getHEarth3DCompositorRenderTiers() {
  return H_EARTH_3D_COMPOSITOR_RENDER_TIERS;
}

/**
 * Returns compositor visibility policy.
 */
export function getHEarth3DCompositorVisibilityPolicy() {
  return H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY;
}

/**
 * Returns compositor primitive accounting.
 */
export function getHEarth3DCompositorPrimitiveAccounting() {
  return H_EARTH_3D_COMPOSITOR_PRIMITIVE_ACCOUNTING;
}

/**
 * Returns the current renderer-preflight disposition.
 */
export function getHEarth3DCompositorRendererPreflight() {
  return H_EARTH_3D_COMPOSITOR_RENDERER_PREFLIGHT;
}

/**
 * Evaluates supplied compositor dependency facts.
 *
 * This does not import, execute, mount, or render anything. Callers supply
 * facts observed from installed source, backed-file review, or a later
 * diagnostic harness.
 */
export function evaluateHEarth3DCompositorDependencyHandoff({
  capacityContractPresent = false,
  capacityContractIdMatches = false,
  environmentContractPresent = false,
  environmentContractIdMatches = false,
  environmentHandoffPresent = false,
  bindingIdentityMatches = false,
  coordinateFrameMatches = false,
  sourceContradictionDetected = false
} = {}) {
  const issues = [];

  if (!capacityContractPresent) {
    issues.push(
      createCompositorIssue(
        'CAPACITY_CONTRACT_MISSING',
        'The renewed capacity contract is missing or unverified.'
      )
    );
  }

  if (!capacityContractIdMatches) {
    issues.push(
      createCompositorIssue(
        'CAPACITY_CONTRACT_ID_MISMATCH',
        'The supplied capacity contract ID does not match the backed dependency.'
      )
    );
  }

  if (!environmentContractPresent) {
    issues.push(
      createCompositorIssue(
        'ENVIRONMENT_CONTRACT_MISSING',
        'The renewed environment contract is missing or unverified.'
      )
    );
  }

  if (!environmentContractIdMatches) {
    issues.push(
      createCompositorIssue(
        'ENVIRONMENT_CONTRACT_ID_MISMATCH',
        'The supplied environment contract ID does not match the backed dependency.'
      )
    );
  }

  if (!environmentHandoffPresent) {
    issues.push(
      createCompositorIssue(
        'ENVIRONMENT_HANDOFF_MISSING',
        'The environment-to-compositor handoff is missing or unverified.'
      )
    );
  }

  if (!bindingIdentityMatches) {
    issues.push(
      createCompositorIssue(
        'BINDING_IDENTITY_MISMATCH',
        'Capacity and environment binding identities do not match or remain unverified.'
      )
    );
  }

  if (!coordinateFrameMatches) {
    issues.push(
      createCompositorIssue(
        'COORDINATE_FRAME_MISMATCH',
        'The environment handoff coordinate frame does not match capacity.'
      )
    );
  }

  if (sourceContradictionDetected) {
    issues.push(
      createCompositorIssue(
        'UPSTREAM_SOURCE_CONTRADICTION',
        'A contradiction was detected in the supplied upstream handoff facts.'
      )
    );
  }

  const admitted =
    issues.length === 0;

  return deepFreeze({
    admitted,

    status:
      admitted
        ? 'COMPOSITOR_DEPENDENCY_HANDOFF_ADMITTED'
        : 'COMPOSITOR_DEPENDENCY_HANDOFF_NOT_ADMITTED',

    observed: deepFreeze({
      capacityContractPresent,
      capacityContractIdMatches,
      environmentContractPresent,
      environmentContractIdMatches,
      environmentHandoffPresent,
      bindingIdentityMatches,
      coordinateFrameMatches,
      sourceContradictionDetected
    }),

    issues: deepFreeze(issues),

    rendererHandoffMayBeIssued: admitted,

    rendererMayMount: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

/**
 * Evaluates a proposed layer-visibility selection.
 */
export function evaluateHEarth3DCompositionVisibility({
  visibleLayerIds =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .defaultVisibleLayerIds
} = {}) {
  if (!Array.isArray(visibleLayerIds)) {
    return deepFreeze({
      eligible: false,
      status: 'INVALID_VISIBILITY_SELECTION',

      issues: deepFreeze([
        createCompositorIssue(
          'VISIBLE_LAYER_IDS_NOT_ARRAY',
          'Visible layer IDs must be supplied as an array.'
        )
      ]),

      rendererPassClaim: false,
      validationClaim: false
    });
  }

  const normalizedLayerIds = [
    ...new Set(
      visibleLayerIds.filter(isNonEmptyString)
    )
  ];

  const unknownLayerIds =
    normalizedLayerIds.filter(
      (layerId) =>
        !H_EARTH_3D_COMPOSITION_LAYER_MAP[layerId]
    );

  const missingRequiredLayerIds =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .requiredLayerIds
      .filter(
        (layerId) =>
          !normalizedLayerIds.includes(layerId)
      );

  const issues = [];

  if (unknownLayerIds.length > 0) {
    issues.push(
      createCompositorIssue(
        'UNKNOWN_VISIBLE_LAYER_IDS',
        'One or more requested visible layers are unknown.',
        deepFreeze({
          unknownLayerIds
        })
      )
    );
  }

  if (missingRequiredLayerIds.length > 0) {
    issues.push(
      createCompositorIssue(
        'REQUIRED_LAYERS_HIDDEN',
        'One or more required environment layers are absent.',
        deepFreeze({
          missingRequiredLayerIds
        })
      )
    );
  }

  return deepFreeze({
    eligible: issues.length === 0,

    status:
      issues.length === 0
        ? 'VISIBILITY_SELECTION_ELIGIBLE'
        : 'VISIBILITY_SELECTION_NOT_ELIGIBLE',

    visibleLayerIds:
      deepFreeze(normalizedLayerIds),

    unknownLayerIds:
      deepFreeze(unknownLayerIds),

    missingRequiredLayerIds:
      deepFreeze(missingRequiredLayerIds),

    issues: deepFreeze(issues),

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Produces an ordered renderer layer selection from a visibility request.
 *
 * The returned result remains descriptor data only.
 */
export function composeHEarth3DRendererLayers({
  visibleLayerIds =
    H_EARTH_3D_COMPOSITOR_VISIBILITY_POLICY
      .defaultVisibleLayerIds,

  includeOverlay = false
} = {}) {
  const requestedLayerIds =
    includeOverlay
      ? [
          ...visibleLayerIds,
          H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
        ]
      : visibleLayerIds;

  const visibilityEvaluation =
    evaluateHEarth3DCompositionVisibility({
      visibleLayerIds: requestedLayerIds
    });

  if (!visibilityEvaluation.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'RENDERER_LAYER_COMPOSITION_NOT_ELIGIBLE',

      visibilityEvaluation,

      orderedLayers: deepFreeze([]),

      rendererGeometryCreated: false,
      DOMCreated: false,
      rendererMounted: false
    });
  }

  const visibleSet =
    new Set(
      visibilityEvaluation.visibleLayerIds
    );

  const orderedLayers =
    H_EARTH_3D_COMPOSITION_LAYER_ORDER
      .filter((layerId) => visibleSet.has(layerId))
      .map(
        (layerId) =>
          H_EARTH_3D_COMPOSITION_LAYER_MAP[layerId]
      );

  return deepFreeze({
    eligible: true,

    status:
      'RENDERER_LAYER_COMPOSITION_ELIGIBLE',

    bindingIdentity:
      H_EARTH_3D_COMPOSITOR_BINDING_IDENTITY,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame,

    orderedLayerIds:
      deepFreeze(
        orderedLayers.map((layer) => layer.id)
      ),

    orderedLayers:
      deepFreeze(orderedLayers),

    rendererGeometryCreated: false,
    DOMCreated: false,
    rendererMounted: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates whether a supplied renderer-consumption report satisfies the
 * compositor handoff.
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
  rendererConstructedSuccessfully = false
} = {}) {
  const failures = [];

  if (!compositorContractIdMatches) {
    failures.push('compositor-contract-id-mismatch-or-unverified');
  }

  if (!capacityContractIdMatches) {
    failures.push('capacity-contract-id-mismatch-or-unverified');
  }

  if (!environmentContractIdMatches) {
    failures.push('environment-contract-id-mismatch-or-unverified');
  }

  if (!bindingIdentityMatches) {
    failures.push('binding-identity-mismatch-or-unverified');
  }

  if (!coordinateFrameMatches) {
    failures.push('coordinate-frame-mismatch-or-unverified');
  }

  if (!requiredLayerOrderConsumed) {
    failures.push('required-layer-order-not-consumed');
  }

  if (!requiredLayersPresent) {
    failures.push('required-layers-missing');
  }

  if (!primitiveBudgetWithinCapacity) {
    failures.push('primitive-budget-outside-capacity');
  }

  if (!rendererOutputModelAllowed) {
    failures.push('renderer-output-model-not-authorized');
  }

  if (!rendererImportedSuccessfully) {
    failures.push('renderer-import-not-verified');
  }

  if (!rendererConstructedSuccessfully) {
    failures.push('renderer-construction-not-verified');
  }

  const rendererPreflightEligible =
    failures.length === 0;

  return deepFreeze({
    rendererPreflightEligible,

    status:
      rendererPreflightEligible
        ? 'RENDERER_CONSUMPTION_PREFLIGHT_ELIGIBLE'
        : 'RENDERER_CONSUMPTION_PREFLIGHT_NOT_ELIGIBLE',

    failures: deepFreeze(failures),

    rendererMayMount:
      rendererPreflightEligible,

    rendererMounted: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    playableEnvironmentClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

/**
 * Compatibility projection for earlier compositor consumers.
 *
 * This alias exposes the renewed compositor-approved handoff and does not
 * revive prior compositor architecture.
 */
export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION =
  H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF;

/**
 * Compatibility getter for earlier public-stage composition consumers.
 */
export function getHEarth3DPublicStageComposition() {
  return H_EARTH_3D_PUBLIC_STAGE_COMPOSITION;
}

export default H_EARTH_3D_COMPOSITOR_CONTRACT;
