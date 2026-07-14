/**
 * /showroom/globe/h-earth/environment.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2
 *
 * Renews:
 * H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Role:
 * FRAME_BASED_GROUND_CELL_001_SUBSTRATE_PROVIDER
 *
 * Purpose:
 * Define the bounded Ground Cell 001 environmental substrate consumed by the
 * frame-based H-Earth compositor, while adding the environment-owned numeric
 * wet-sand construction profile required downstream of Packet 001 semantic
 * source resolution and upstream of provider-local geometry construction.
 *
 * This file owns:
 * - environment identity
 * - environment tier identity
 * - material identity
 * - ground substrate descriptors
 * - shoreline descriptors
 * - water descriptors
 * - atmosphere descriptors
 * - grounded-detail descriptors
 * - background-context descriptors
 * - inspection-anchor descriptor
 * - actor-ready ground candidate descriptor
 * - environment primitive accounting
 * - capacity-alignment evaluation
 * - wet-sand numeric construction profile
 * - environment-to-compositor handoff
 * - environment receipts and claim ceilings
 *
 * This file does not own:
 * - Path 3 authority
 * - matrix authority
 * - Ground Cell binding admission
 * - boundary, object, zone, or landscape-lattice truth
 * - Packet 001 semantic source resolution authority
 * - provider selection authority
 * - provider implementation authority
 * - geometry provider invocation
 * - geometry construction
 * - West admission
 * - geometry-index mutation
 * - correspondence registration
 * - camera state
 * - camera pose
 * - viewport state
 * - navigation state
 * - inertia state
 * - compositor state
 * - render-frame sequencing
 * - semantic layer order
 * - visibility mutation
 * - projection mathematics
 * - projected primitive construction
 * - DOM/CSS materialization
 * - renderer mount lifecycle
 * - controller input normalization
 * - controller intent dispatch
 * - route bootstrap
 * - action execution
 * - readout construction
 * - receipt issuance
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
  H_EARTH_3D_PUBLIC_STAGE_IDS,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_VIEWPORT_CAPACITY,
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_RENDER_STAGE_LIMITS,
  H_EARTH_3D_NODE_BUDGET,
  H_EARTH_3D_INTERACTION_CAPACITY,
  H_EARTH_3D_RENDER_FRAME_CAPACITY,
  H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY,
  H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY,
  H_EARTH_3D_MOUNT_ELIGIBILITY,
  H_EARTH_3D_CAPACITY_CLAIM_CEILINGS,
  evaluateHEarth3DNodeBudget,
  getHEarth3DCapacityContract,
  getHEarth3DCapacityReceipt,
  getHEarth3DCapacityPreflight
} from './capacity.js';

export const H_EARTH_3D_ENVIRONMENT_CONTRACT_ID =
  'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2';

export const H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION = 3;

export const H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID =
  'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

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

const isFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);

const isPositiveFiniteNumber = (value) =>
  isFiniteNumber(value) &&
  value > 0;

const isNonNegativeInteger = (value) =>
  Number.isInteger(value) &&
  value >= 0;

const createEnvironmentIssue = (
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

const createEnvironmentCheck = (
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
  checks.every((check) => check.passed === true);

const arraysEqual = (left, right) =>
  Array.isArray(left) &&
  Array.isArray(right) &&
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const CAPACITY_CONTRACT =
  getHEarth3DCapacityContract();

const CAPACITY_RECEIPT =
  getHEarth3DCapacityReceipt();

const CAPACITY_PREFLIGHT =
  getHEarth3DCapacityPreflight();

const STAGE_X_BOUNDS =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.x;

const STAGE_Y_BOUNDS =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.y;

const STAGE_Z_BOUNDS =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.z;

const H_EARTH_NUMERIC_LATTICE_DIMENSION = 16;

const H_EARTH_WET_SAND_SOURCE_OBJECT_ID =
  'OBJ_002_FOREGROUND_WET_SAND';

const H_EARTH_WET_SAND_PRIMARY_ZONE_ID =
  'ZONE_001_FOREGROUND_INSPECTION_ZONE';

const H_EARTH_WET_SAND_REGION_ID =
  'FOREGROUND_INSPECTION_GROUND';

const H_EARTH_WET_SAND_PROVIDER_ID =
  'H_EARTH_GROUND_GEOMETRY_PROVIDER';

const H_EARTH_WET_SAND_PROVIDER_IMPLEMENTATION_FILE =
  '/showroom/globe/h-earth/render/geometry-ground.js';

const H_EARTH_WET_SAND_ROW_INDICES = deepFreeze([
  1, 2, 3, 4, 5
]);

const H_EARTH_WET_SAND_COLUMN_INDICES = deepFreeze([
  6, 7, 8, 9, 10, 11
]);

const H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_X = 4;
const H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_Z = 4;

const H_EARTH_WET_SAND_BASE_ELEVATION =
  STAGE_Y_BOUNDS.surfaceBaseline;

const H_EARTH_WET_SAND_RELIEF_AMPLITUDE = 1.25;
const H_EARTH_WET_SAND_HEIGHT_EPSILON = 0.0001;

function getLatticeStepSize(axisBounds) {
  if (
    !isPlainObject(axisBounds) ||
    !isFiniteNumber(axisBounds.minimum) ||
    !isFiniteNumber(axisBounds.maximum) ||
    !isFiniteNumber(axisBounds.span) ||
    axisBounds.span <= 0
  ) {
    return null;
  }

  return axisBounds.span / H_EARTH_NUMERIC_LATTICE_DIMENSION;
}

function deriveAxisBoundsFromLatticeIndices({
  axisBounds,
  indices
}) {
  if (
    !isPlainObject(axisBounds) ||
    !Array.isArray(indices) ||
    indices.length === 0
  ) {
    return null;
  }

  const stepSize =
    getLatticeStepSize(axisBounds);

  if (!isPositiveFiniteNumber(stepSize)) {
    return null;
  }

  const minimumIndex =
    Math.min(...indices);

  const maximumIndex =
    Math.max(...indices);

  if (
    !Number.isInteger(minimumIndex) ||
    !Number.isInteger(maximumIndex) ||
    minimumIndex < 1 ||
    maximumIndex > H_EARTH_NUMERIC_LATTICE_DIMENSION
  ) {
    return null;
  }

  const minimum =
    axisBounds.minimum +
    (minimumIndex - 1) * stepSize;

  const maximum =
    axisBounds.minimum +
    maximumIndex * stepSize;

  return deepFreeze({
    minimum,
    maximum,
    span:
      maximum - minimum
  });
}

function buildNumericSampleAxis({
  minimum,
  maximum,
  sampleCount
}) {
  if (
    !isFiniteNumber(minimum) ||
    !isFiniteNumber(maximum) ||
    !isNonNegativeInteger(sampleCount) ||
    sampleCount < 2 ||
    minimum >= maximum
  ) {
    return null;
  }

  return deepFreeze({
    minimum,
    maximum,
    sampleCount,
    step:
      (maximum - minimum) / (sampleCount - 1),
    inclusiveEndpoints: true
  });
}

function createMaterialIdentity({
  id,
  label,
  semanticRole,
  materialClass,
  opacityPolicy,
  surfaceResponse,
  rendererPresentationHints = {}
}) {
  return deepFreeze({
    id,
    label,
    semanticRole,
    materialClass,
    opacityPolicy,
    surfaceResponse,

    rendererPresentationHints:
      deepFreeze(rendererPresentationHints),

    rendererMaySelectDOMRepresentation: true,
    rendererMaySelectProjectionGeometry: true,
    rendererMayChangeSemanticIdentity: false,

    textureRequired: false,
    shaderRequired: false,
    imageRequired: false,

    rendererPassClaim: false,
    visualPassClaim: false
  });
}

/**
 * Environment ownership boundary.
 */
export const H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS = deepFreeze({
  ownsEnvironmentIdentity: true,
  ownsEnvironmentTierIdentity: true,
  ownsMaterialIdentity: true,
  ownsGroundSubstrateDescriptors: true,
  ownsShorelineDescriptors: true,
  ownsWaterDescriptors: true,
  ownsAtmosphereDescriptors: true,
  ownsGroundDetailDescriptors: true,
  ownsBackgroundContextDescriptors: true,
  ownsInspectionAnchorDescriptor: true,
  ownsActorReadyGroundCandidateDescriptor: true,
  ownsEnvironmentPrimitiveAccounting: true,
  ownsEnvironmentCapacityAlignment: true,
  ownsWetSandNumericConstructionProfile: true,
  ownsEnvironmentHandoff: true,
  ownsEnvironmentReceipts: true,

  ownsCapacityAuthority: false,
  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsBoundaryAuthority: false,
  ownsObjectAuthority: false,
  ownsZoneAuthority: false,
  ownsLandscapeLatticeAuthority: false,
  ownsPacket001SemanticResolutionAuthority: false,
  ownsProviderSelectionAuthority: false,
  ownsProviderImplementationAuthority: false,

  ownsSemanticComposition: false,
  ownsSemanticLayerOrder: false,
  ownsVisibilityState: false,
  ownsCameraState: false,
  ownsCameraPose: false,
  ownsViewportState: false,
  ownsNavigationState: false,
  ownsInertiaState: false,
  ownsRenderFrameState: false,
  ownsProjectionMathematics: false,
  ownsProjectedPrimitiveConstruction: false,
  ownsDOMCSSMaterialization: false,
  ownsRendererLifecycle: false,
  ownsControllerInputNormalization: false,
  ownsControllerIntentDispatch: false,
  ownsRouteBootstrap: false,

  invokesGeometryProvider: false,
  constructsGeometry: false,
  performsWestAdmission: false,
  mutatesGeometryIndex: false,
  mutatesCorrespondenceRegistry: false,

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
export const H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY = deepFreeze({
  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

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

  bindingClass:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.bindingClass,

  sceneIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  sourceAuthorityExternal: true,
  descriptorOnlyAtEnvironmentLayer: true,

  matrixCollapse: false
});

/**
 * Source requirements.
 */
export const H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS = deepFreeze({
  controllingCapacity: deepFreeze({
    path:
      '/showroom/globe/h-earth/capacity.js',

    contractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    required: true,

    usage: deepFreeze([
      'binding identity',
      'public-stage IDs',
      'world bounds',
      'render-stage limits',
      'node budget',
      'render-frame capacity context',
      'compositor-frame eligibility context',
      'renderer-consumption context',
      'claim ceilings',
      'numeric wet-sand world-space derivation'
    ])
  }),

  acceptedSourceSpine: deepFreeze({
    groundCell: deepFreeze({
      role: 'GROUND_CELL',
      expectedPath:
        '/h-earth-3d/cells/ground-cell-001.js',
      expectedId:
        'H_EARTH_GROUND_CELL_001',
      directlyImported: false
    }),

    boundaries: deepFreeze({
      role: 'BOUNDARIES',
      expectedPath:
        '/h-earth-3d/boundaries/matrix-boundaries.js',
      expectedStep:
        'STEP_034I',
      directlyImported: false
    }),

    objects: deepFreeze({
      role: 'OBJECTS',
      expectedPath:
        '/h-earth-3d/objects/ground-cell-001.objects.js',
      expectedStep:
        'STEP_034J_V2',
      directlyImported: false
    }),

    zones: deepFreeze({
      role: 'ZONES',
      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.zones.js',
      expectedStep:
        'STEP_034K',
      directlyImported: false
    }),

    landscapeLattice: deepFreeze({
      role: 'LANDSCAPE_LATTICE',
      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
      expectedStep:
        'STEP_034L',
      directlyImported: false
    }),

    packet001Resolver: deepFreeze({
      role:
        'SEMANTIC_SOURCE_RESOLUTION',
      expectedPath:
        '/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js',
      expectedContractId:
        H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID,
      directlyImported: false,
      requiredForProviderTranslation: true
    })
  }),

  admittedBinding: deepFreeze({
    spatialCellId:
      'H_EARTH_REGION_CELL_X07_Z08',
    groundCellId:
      'H_EARTH_GROUND_CELL_001',
    bindingExpression:
      'H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001'
  }),

  downstreamProviderTarget: deepFreeze({
    path:
      '/showroom/globe/h-earth/render/geometry-ground.js',
    expectedContractId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID,
    directlyImported: false,
    providerInvocationOwnedHere: false
  }),

  downstreamConsumer: deepFreeze({
    path:
      '/showroom/globe/h-earth/compositor.js',
    expectedRole:
      'CAMERA_VIEWPORT_NAVIGATION_AND_RENDER_FRAME_COMPOSITION_AUTHORITY',
    directlyImported: false
  })
});

/**
 * Environment tier identity.
 */
export const H_EARTH_3D_ENVIRONMENT_TIER_IDS = deepFreeze({
  essential:
    'H_EARTH_ENVIRONMENT_TIER_1_ESSENTIAL',
  detail:
    'H_EARTH_ENVIRONMENT_TIER_2_DETAIL',
  context:
    'H_EARTH_ENVIRONMENT_TIER_3_CONTEXT',
  interaction:
    'H_EARTH_ENVIRONMENT_TIER_4_INTERACTION'
});

export const H_EARTH_3D_ENVIRONMENT_TIER_ORDER = deepFreeze([
  H_EARTH_3D_ENVIRONMENT_TIER_IDS.essential,
  H_EARTH_3D_ENVIRONMENT_TIER_IDS.detail,
  H_EARTH_3D_ENVIRONMENT_TIER_IDS.context,
  H_EARTH_3D_ENVIRONMENT_TIER_IDS.interaction
]);

export const H_EARTH_3D_ENVIRONMENT_TIERS = deepFreeze({
  essential: deepFreeze({
    id:
      H_EARTH_3D_ENVIRONMENT_TIER_IDS.essential,
    label:
      'Essential environment',
    role:
      'PRIMARY_ENVIRONMENT_READABILITY',
    required: true,
    members: deepFreeze([
      'SKY',
      'ATMOSPHERE',
      'HORIZON',
      'DRY_SAND',
      'WET_SAND',
      'SHORELINE',
      'FOAM_CONTACT',
      'NEARSHORE_WATER',
      'OPEN_WATER',
      'BASIC_WAVE_BANDS'
    ])
  }),

  detail: deepFreeze({
    id:
      H_EARTH_3D_ENVIRONMENT_TIER_IDS.detail,
    label:
      'Grounded environmental detail',
    role:
      'LOCAL_SURFACE_READABILITY',
    required: true,
    members: deepFreeze([
      'TIDE_POOLS',
      'STONES',
      'JAGGED_ROCKS'
    ])
  }),

  context: deepFreeze({
    id:
      H_EARTH_3D_ENVIRONMENT_TIER_IDS.context,
    label:
      'Distant environmental context',
    role:
      'SCENE_DEPTH_AND_IDENTITY_CONTEXT',
    required: true,
    members: deepFreeze([
      'MANOR_BLUFF_CONTEXT',
      'OFFSHORE_ISLETS'
    ])
  }),

  interaction: deepFreeze({
    id:
      H_EARTH_3D_ENVIRONMENT_TIER_IDS.interaction,
    label:
      'Inspection interaction substrate',
    role:
      'PRIMARY_INSPECTION_TARGET_CONTEXT',
    required: true,
    members: deepFreeze([
      'INSPECTION_ANCHOR',
      'ACTOR_READY_GROUND_CANDIDATE'
    ])
  }),

  excludedExpansion: deepFreeze({
    id:
      'H_EARTH_ENVIRONMENT_TIER_EXCLUDED_EXPANSION',
    required: false,
    admitted: false,
    members: deepFreeze([
      'DETAILED_MANOR_ARCHITECTURE',
      'EXPANDED_STONE_FIELD',
      'EXPANDED_ROCK_FACETS',
      'EXPANDED_TIDE_POOL_FIELD',
      'EXPANDED_ISLET_FIELD',
      'ATMOSPHERIC_POLISH',
      'DECORATIVE_REFINEMENT'
    ])
  })
});

/**
 * Material identities.
 */
export const H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES = deepFreeze({
  sky: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_SKY',
    label: 'H-Earth sky',
    semanticRole: 'SKY',
    materialClass: 'BACKGROUND_ATMOSPHERE',
    opacityPolicy: 'OPAQUE_BACKGROUND',
    surfaceResponse: 'NON_SURFACE_BACKGROUND',
    rendererPresentationHints: {
      gradientPermitted: true,
      fullStageCoverageCandidate: true,
      depthSortWithinLayer: false
    }
  }),

  atmosphere: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_ATMOSPHERE',
    label: 'H-Earth atmosphere',
    semanticRole: 'ATMOSPHERE',
    materialClass: 'ATMOSPHERIC_OVERLAY',
    opacityPolicy: 'TRANSLUCENT',
    surfaceResponse: 'DISTANCE_HAZE',
    rendererPresentationHints: {
      fullStageOverlayCandidate: true,
      pointerEventsNone: true
    }
  }),

  haze: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_HAZE',
    label: 'H-Earth horizon haze',
    semanticRole: 'HORIZON_HAZE',
    materialClass: 'DISTANCE_HAZE',
    opacityPolicy: 'TRANSLUCENT',
    surfaceResponse: 'HORIZON_SOFTENING',
    rendererPresentationHints: {
      horizontalBandCandidate: true,
      pointerEventsNone: true
    }
  }),

  islet: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_OFFSHORE_ISLET',
    label: 'Offshore islet',
    semanticRole: 'OFFSHORE_ISLET',
    materialClass: 'DISTANT_SOLID_CONTEXT',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'ROCK_SILHOUETTE',
    rendererPresentationHints: {
      polygonCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  manorContext: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_MANOR_CONTEXT',
    label: 'Manor and bluff context',
    semanticRole: 'MANOR_BLUFF_CONTEXT',
    materialClass: 'DISTANT_ARCHITECTURAL_CONTEXT',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'DISTANT_SILHOUETTE',
    rendererPresentationHints: {
      clusteredPrimitiveCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  openWater: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_OPEN_WATER',
    label: 'Open water',
    semanticRole: 'OPEN_WATER',
    materialClass: 'WATER_SURFACE',
    opacityPolicy: 'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',
    surfaceResponse: 'DISTANT_WATER_SURFACE',
    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      horizontalContinuityPreferred: true
    }
  }),

  nearshoreWater: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_NEARSHORE_WATER',
    label: 'Nearshore water',
    semanticRole: 'NEARSHORE_WATER',
    materialClass: 'WATER_SURFACE',
    opacityPolicy: 'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',
    surfaceResponse: 'SHALLOW_WATER_SURFACE',
    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      shorelineContactRequired: true
    }
  }),

  wave: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_WAVE',
    label: 'Wave band',
    semanticRole: 'WAVE_BAND',
    materialClass: 'WATER_RIBBON',
    opacityPolicy: 'TRANSLUCENT',
    surfaceResponse: 'WAVE_HIGHLIGHT',
    rendererPresentationHints: {
      projectedCurveRibbonCandidate: true,
      pointerEventsNone: true
    }
  }),

  foam: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_FOAM',
    label: 'Shoreline foam',
    semanticRole: 'FOAM_CONTACT',
    materialClass: 'SHORELINE_CONTACT_RIBBON',
    opacityPolicy: 'TRANSLUCENT_TO_OPAQUE',
    surfaceResponse: 'FOAM_CONTACT',
    rendererPresentationHints: {
      projectedCurveRibbonCandidate: true,
      shorelineAlignmentRequired: true
    }
  }),

  wetSand: createMaterialIdentity({
    id: 'H_EARTH_WET_SAND_DOMAIN',
    label: 'Wet sand',
    semanticRole: 'WET_SAND',
    materialClass: 'GROUND_SURFACE',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'DAMP_REFLECTIVE_GROUND',
    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      inspectionGroundCandidate: true
    }
  }),

  drySand: createMaterialIdentity({
    id: 'H_EARTH_DRY_SAND_DOMAIN',
    label: 'Dry sand',
    semanticRole: 'DRY_SAND',
    materialClass: 'GROUND_SURFACE',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'DRY_DIFFUSE_GROUND',
    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      transitionGroundCandidate: true
    }
  }),

  tidePool: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_TIDE_POOL',
    label: 'Tide pool',
    semanticRole: 'TIDE_POOL',
    materialClass: 'GROUND_EMBEDDED_WATER',
    opacityPolicy: 'TRANSLUCENT',
    surfaceResponse: 'SHALLOW_REFLECTIVE_WATER',
    rendererPresentationHints: {
      projectedEllipseCandidate: true,
      groundEmbedded: true
    }
  }),

  stone: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_STONE',
    label: 'Beach stone',
    semanticRole: 'STONE',
    materialClass: 'GROUNDED_DETAIL',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'SMOOTH_STONE',
    rendererPresentationHints: {
      groundedDetailCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  rock: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_JAGGED_ROCK',
    label: 'Jagged rock',
    semanticRole: 'JAGGED_ROCK',
    materialClass: 'GROUNDED_DETAIL',
    opacityPolicy: 'OPAQUE',
    surfaceResponse: 'FACETED_ROCK',
    rendererPresentationHints: {
      polygonCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  inspectionAnchor: createMaterialIdentity({
    id: 'H_EARTH_MATERIAL_INSPECTION_ANCHOR',
    label: 'Inspection anchor',
    semanticRole: 'INSPECTION_ANCHOR',
    materialClass: 'INTERACTION_TARGET',
    opacityPolicy: 'RENDERER_SELECTED',
    surfaceResponse: 'NON_PHYSICAL_INTERACTION_TARGET',
    rendererPresentationHints: {
      projectedInteractionTargetCandidate: true,
      mayBeVisuallySubtle: true
    }
  })
});

/**
 * Ground substrate.
 */
export const H_EARTH_3D_GROUND_SUBSTRATE = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_CONTINUOUS_GROUND_SUBSTRATE',
  cellId:
    'H_EARTH_GROUND_CELL_001',
  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,
  continuityRequired: true,
  groundContactProofProvided: false,

  domains: deepFreeze({
    wetSand: deepFreeze({
      id:
        'H_EARTH_GROUND_WET_SAND_FIELD',
      objectId:
        H_EARTH_WET_SAND_SOURCE_OBJECT_ID,
      primaryZoneId:
        H_EARTH_WET_SAND_PRIMARY_ZONE_ID,
      latticeRows: 'R01-R05',
      role:
        'PRIMARY_FOREGROUND_INSPECTION_GROUND',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,
      surfaceFamily: 'wetSand'
    }),

    drySand: deepFreeze({
      id:
        'H_EARTH_GROUND_DRY_SAND_TRANSITION',
      objectId:
        'OBJ_003_DRY_SAND_TRANSITION',
      primaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',
      latticeRows: 'R06-R07',
      role:
        'DRY_WET_TRANSITION_GROUND',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.drySand.id,
      surfaceFamily: 'drySand'
    })
  }),

  transition: deepFreeze({
    id:
      'H_EARTH_GROUND_DRY_WET_TRANSITION',
    from: 'WET_SAND',
    to: 'DRY_SAND',
    boundaryClass:
      'GRADUAL_SHORELINE_GROUND_TRANSITION',
    abruptSeamRequired: false
  }),

  rendererRules: deepFreeze({
    continuousProjectionPreferred: true,
    competingGroundPlanesPermitted: false,
    rendererMaySubdivideForProjection: true,
    rendererMayChangeDomainIdentity: false
  })
});

/**
 * Shoreline model.
 */
export const H_EARTH_3D_SHORELINE_MODEL = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_SHORELINE_MODEL',
  primaryZoneId:
    'ZONE_002_SHORELINE_CONTACT_ZONE',
  latticeRows: 'R08-R09',

  shorelineContact: deepFreeze({
    id:
      'H_EARTH_SHORELINE_CONTACT_FIELD',
    role:
      'WATER_GROUND_CONTACT_DESCRIPTOR',
    groundContactProofProvided: false,
    physicalFluidBoundaryProvided: false
  }),

  foamContact: deepFreeze({
    id:
      'H_EARTH_SHORELINE_FOAM_CONTACT',
    objectId:
      'OBJ_005_SHORELINE_FOAM_LINE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.foam.id,
    role:
      'VISIBLE_SHORELINE_CONTACT_CANDIDATE'
  }),

  dryWetBoundary: deepFreeze({
    id:
      'H_EARTH_SHORELINE_DRY_WET_BOUNDARY',
    role:
      'GROUND_DOMAIN_RELATIONSHIP',
    hardBoundary: false
  }),

  rendererRules: deepFreeze({
    preserveGroundWaterAdjacency: true,
    preserveFoamContactRelation: true,
    rendererMaySelectCurveSegmentation: true,
    rendererMayInventNewShorelineTopology: false
  })
});

/**
 * Water substrate.
 */
export const H_EARTH_3D_WATER_SUBSTRATE = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_WATER_SUBSTRATE',
  primaryZoneId:
    'ZONE_003_WATER_SURFACE_ZONE',
  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  nearshore: deepFreeze({
    id:
      'H_EARTH_NEARSHORE_WATER_FIELD',
    objectId:
      'OBJ_006_NEARSHORE_WAVE_BAND',
    role:
      'NEARSHORE_WATER_AND_WAVE_RELATION',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.nearshoreWater.id
  }),

  openWater: deepFreeze({
    id:
      'H_EARTH_OPEN_WATER_FIELD',
    objectId:
      'OBJ_007_WATER_SURFACE_PLANE',
    role:
      'OPEN_WATER_SURFACE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.openWater.id
  }),

  waveBands: deepFreeze([
    deepFreeze({
      id: 'H_EARTH_WAVE_BAND_001',
      sourceObjectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,
      role:
        'PRIMARY_NEARSHORE_WAVE_BAND'
    }),

    deepFreeze({
      id: 'H_EARTH_WAVE_BAND_002',
      sourceObjectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,
      role:
        'SECONDARY_NEARSHORE_WAVE_BAND'
    }),

    deepFreeze({
      id: 'H_EARTH_WAVE_BAND_003',
      sourceObjectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,
      role:
        'DISTANT_NEARSHORE_WAVE_BAND'
    })
  ]),

  rendererRules: deepFreeze({
    preserveNearshoreOpenWaterRelationship: true,
    preserveShorelineContactRelationship: true,
    rendererMaySegmentWaterSurface: true,
    rendererMayCreateFluidSimulation: false
  })
});

/**
 * Atmosphere model.
 */
export const H_EARTH_3D_ATMOSPHERE_MODEL = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_ATMOSPHERE_MODEL',
  primaryZoneId:
    'ZONE_003_WATER_SURFACE_ZONE',

  sky: deepFreeze({
    id:
      'H_EARTH_SKY_BACKGROUND',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.sky.id,
    role:
      'FULL_STAGE_SKY_BACKGROUND'
  }),

  atmosphere: deepFreeze({
    id:
      'H_EARTH_ATMOSPHERE_OVERLAY',
    objectId:
      'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.atmosphere.id,
    role:
      'AIR_HAZE_LIGHT_RELATION'
  }),

  horizon: deepFreeze({
    id:
      'H_EARTH_WATER_HORIZON',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.haze.id,
    role:
      'DERIVED_WATER_HORIZON'
  }),

  rendererRules: deepFreeze({
    fullStageSkyPermitted: true,
    hazeOverlayPermitted: true,
    horizonBandPermitted: true,
    rendererMayCreateWeatherSimulation: false
  })
});

/**
 * Tide pools.
 */
export const H_EARTH_3D_TIDE_POOL_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id:
      'H_EARTH_TIDE_POOL_001',
    sourceObjectId:
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    primaryZoneId:
      'ZONE_002_SHORELINE_CONTACT_ZONE',
    latticeRows: 'R08-R09',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.tidePool.id,
    role:
      'PRIMARY_GROUND_EMBEDDED_TIDE_POOL'
  }),

  deepFreeze({
    id:
      'H_EARTH_TIDE_POOL_002',
    sourceObjectId:
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    primaryZoneId:
      'ZONE_002_SHORELINE_CONTACT_ZONE',
    latticeRows: 'R08-R09',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.tidePool.id,
    role:
      'SECONDARY_GROUND_EMBEDDED_TIDE_POOL'
  }),

  deepFreeze({
    id:
      'H_EARTH_TIDE_POOL_003',
    sourceObjectId:
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    primaryZoneId:
      'ZONE_002_SHORELINE_CONTACT_ZONE',
    latticeRows: 'R08-R09',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.tidePool.id,
    role:
      'TERTIARY_GROUND_EMBEDDED_TIDE_POOL'
  })
]);

/**
 * Beach stones.
 */
export const H_EARTH_3D_STONE_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id:
      'H_EARTH_BEACH_STONE_001',
    sourceObjectId:
      'OBJ_010_SMALL_BEACH_STONES',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,
    role:
      'FOREGROUND_GROUNDED_STONE'
  }),

  deepFreeze({
    id:
      'H_EARTH_BEACH_STONE_002',
    sourceObjectId:
      'OBJ_010_SMALL_BEACH_STONES',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,
    role:
      'FOREGROUND_GROUNDED_STONE'
  }),

  deepFreeze({
    id:
      'H_EARTH_BEACH_STONE_003',
    sourceObjectId:
      'OBJ_010_SMALL_BEACH_STONES',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,
    role:
      'FOREGROUND_GROUNDED_STONE'
  }),

  deepFreeze({
    id:
      'H_EARTH_BEACH_STONE_004',
    sourceObjectId:
      'OBJ_010_SMALL_BEACH_STONES',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.stone.id,
    role:
      'FOREGROUND_GROUNDED_STONE'
  })
]);

/**
 * Jagged rocks.
 */
export const H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id:
      'H_EARTH_JAGGED_ROCK_001',
    sourceObjectId:
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.rock.id,
    role:
      'FOREGROUND_JAGGED_ROCK'
  }),

  deepFreeze({
    id:
      'H_EARTH_JAGGED_ROCK_002',
    sourceObjectId:
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.rock.id,
    role:
      'FOREGROUND_JAGGED_ROCK'
  }),

  deepFreeze({
    id:
      'H_EARTH_JAGGED_ROCK_003',
    sourceObjectId:
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.rock.id,
    role:
      'FOREGROUND_JAGGED_ROCK'
  })
]);

/**
 * Background context.
 */
export const H_EARTH_3D_BACKGROUND_CONTEXT = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_BACKGROUND_CONTEXT',

  manorBluff: deepFreeze({
    id:
      'H_EARTH_MANOR_BLUFF_CONTEXT',
    sourceObjectId:
      'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    primaryZoneId:
      'ZONE_004_MANOR_CONTEXT_ZONE',
    latticeRows: 'R14-R15',
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.manorContext.id,
    role:
      'DISTANT_MANOR_AND_BLUFF_CONTEXT',
    detailedArchitectureAdmitted: false
  }),

  offshoreIslets: deepFreeze([
    deepFreeze({
      id:
        'H_EARTH_OFFSHORE_ISLET_001',
      sourceFamily:
        'OFFSHORE_ROCK_STACKS_AND_ISLETS',
      primaryZoneId:
        'ZONE_005_OFFSHORE_CONTEXT_ZONE',
      latticeRows: 'R14-R15',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.islet.id,
      role:
        'DISTANT_OFFSHORE_ISLET'
    }),

    deepFreeze({
      id:
        'H_EARTH_OFFSHORE_ISLET_002',
      sourceFamily:
        'OFFSHORE_ROCK_STACKS_AND_ISLETS',
      primaryZoneId:
        'ZONE_005_OFFSHORE_CONTEXT_ZONE',
      latticeRows: 'R14-R15',
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.islet.id,
      role:
        'DISTANT_OFFSHORE_ISLET'
    })
  ]),

  rendererRules: deepFreeze({
    preserveDistanceRole: true,
    preserveManorContextIdentity: true,
    preserveOffshoreContextIdentity: true,
    rendererMayCreateDetailedManorArchitecture: false
  })
});

/**
 * Inspection anchor.
 */
export const H_EARTH_3D_INSPECTION_ANCHOR = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_INSPECTION_ANCHOR',
  sourceObjectId:
    'OBJ_001_GROUND_SPAWN_ANCHOR',
  primaryZoneId:
    'ZONE_001_FOREGROUND_INSPECTION_ZONE',
  latticeRows: 'R01-R05',
  materialId:
    H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.inspectionAnchor.id,
  actionId:
    'H_EARTH_INSPECT_GROUND_ACTION',
  readoutId:
    'GROUND_CONDITION_READ',
  receiptId:
    'H_EARTH_GROUND_INSPECTION_RECEIPT',
  role:
    'PRIMARY_INSPECTION_INTENT_TARGET',
  actionExecutionOwnedHere: false,
  readoutConstructionOwnedHere: false,
  receiptIssuanceOwnedHere: false
});

/**
 * Actor-ready ground candidate.
 */
export const H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE = deepFreeze({
  id:
    'H_EARTH_GROUND_CELL_001_ACTOR_READY_GROUND_CANDIDATE',
  sourceGroundId:
    H_EARTH_3D_GROUND_SUBSTRATE.id,
  primaryDomainId:
    H_EARTH_3D_GROUND_SUBSTRATE.domains.wetSand.id,
  inspectionAnchorId:
    H_EARTH_3D_INSPECTION_ANCHOR.id,
  role:
    'FUTURE_ACTOR_GROUND_REFERENCE_CANDIDATE',
  continuousGroundRequired: true,
  actorCreated: false,
  actorReadyClaim: false,
  collisionCreated: false,
  groundContactProven: false,
  traversalActivated: false
});

/**
 * Wet-sand numeric construction profile constants.
 */
const H_EARTH_WET_SAND_X_WORLD_BOUNDS =
  deriveAxisBoundsFromLatticeIndices({
    axisBounds: STAGE_X_BOUNDS,
    indices: H_EARTH_WET_SAND_COLUMN_INDICES
  });

const H_EARTH_WET_SAND_Z_WORLD_BOUNDS =
  deriveAxisBoundsFromLatticeIndices({
    axisBounds: STAGE_Z_BOUNDS,
    indices: H_EARTH_WET_SAND_ROW_INDICES
  });

const H_EARTH_WET_SAND_CELL_WIDTH =
  getLatticeStepSize(STAGE_X_BOUNDS);

const H_EARTH_WET_SAND_CELL_DEPTH =
  getLatticeStepSize(STAGE_Z_BOUNDS);

const H_EARTH_WET_SAND_WORLD_WIDTH =
  H_EARTH_WET_SAND_X_WORLD_BOUNDS?.span ?? null;

const H_EARTH_WET_SAND_WORLD_DEPTH =
  H_EARTH_WET_SAND_Z_WORLD_BOUNDS?.span ?? null;

const H_EARTH_WET_SAND_LOCAL_X_MINIMUM =
  H_EARTH_WET_SAND_WORLD_WIDTH !== null
    ? -H_EARTH_WET_SAND_WORLD_WIDTH / 2
    : null;

const H_EARTH_WET_SAND_LOCAL_X_MAXIMUM =
  H_EARTH_WET_SAND_WORLD_WIDTH !== null
    ? H_EARTH_WET_SAND_WORLD_WIDTH / 2
    : null;

const H_EARTH_WET_SAND_LOCAL_Z_MINIMUM =
  H_EARTH_WET_SAND_WORLD_DEPTH !== null
    ? -H_EARTH_WET_SAND_WORLD_DEPTH / 2
    : null;

const H_EARTH_WET_SAND_LOCAL_Z_MAXIMUM =
  H_EARTH_WET_SAND_WORLD_DEPTH !== null
    ? H_EARTH_WET_SAND_WORLD_DEPTH / 2
    : null;

const H_EARTH_WET_SAND_X_SAMPLE_COUNT =
  H_EARTH_WET_SAND_COLUMN_INDICES.length *
    H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_X +
  1;

const H_EARTH_WET_SAND_Z_SAMPLE_COUNT =
  H_EARTH_WET_SAND_ROW_INDICES.length *
    H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_Z +
  1;

const H_EARTH_WET_SAND_LOCAL_X_AXIS =
  buildNumericSampleAxis({
    minimum:
      H_EARTH_WET_SAND_LOCAL_X_MINIMUM,
    maximum:
      H_EARTH_WET_SAND_LOCAL_X_MAXIMUM,
    sampleCount:
      H_EARTH_WET_SAND_X_SAMPLE_COUNT
  });

const H_EARTH_WET_SAND_LOCAL_Z_AXIS =
  buildNumericSampleAxis({
    minimum:
      H_EARTH_WET_SAND_LOCAL_Z_MINIMUM,
    maximum:
      H_EARTH_WET_SAND_LOCAL_Z_MAXIMUM,
    sampleCount:
      H_EARTH_WET_SAND_Z_SAMPLE_COUNT
  });

const H_EARTH_WET_SAND_WORLD_CENTER_X =
  H_EARTH_WET_SAND_X_WORLD_BOUNDS
    ? (
        H_EARTH_WET_SAND_X_WORLD_BOUNDS.minimum +
        H_EARTH_WET_SAND_X_WORLD_BOUNDS.maximum
      ) / 2
    : null;

const H_EARTH_WET_SAND_WORLD_CENTER_Z =
  H_EARTH_WET_SAND_Z_WORLD_BOUNDS
    ? (
        H_EARTH_WET_SAND_Z_WORLD_BOUNDS.minimum +
        H_EARTH_WET_SAND_Z_WORLD_BOUNDS.maximum
      ) / 2
    : null;

/**
 * Numeric wet-sand construction profile.
 *
 * This profile is environment-owned numeric intent only. It is not a semantic
 * source resolver, not a provider request, not a provider call, and not
 * geometry construction. Packet 001 remains the controlling semantic
 * source-resolution surface.
 */
export const H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_v1',

    profileRole:
      'ENVIRONMENT_OWNED_NUMERIC_GROUND_CONSTRUCTION_INTENT',

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

    sourceObjectId:
      H_EARTH_WET_SAND_SOURCE_OBJECT_ID,

    primaryZoneId:
      H_EARTH_WET_SAND_PRIMARY_ZONE_ID,

    regionId:
      H_EARTH_WET_SAND_REGION_ID,

    semanticDependencies: deepFreeze({
      packet001ExpectedContractId:
        H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID,
      providerId:
        H_EARTH_WET_SAND_PROVIDER_ID,
      providerImplementationFile:
        H_EARTH_WET_SAND_PROVIDER_IMPLEMENTATION_FILE,
      providerImplementationContractId:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID,
      semanticResolutionRequiredBeforeProviderTranslation: true,
      semanticResolutionConsumedHereByDefault: false,
      semanticResolutionAuthorityOwnedHere: false
    }),

    latticeDerivation: deepFreeze({
      latticeDimension:
        H_EARTH_NUMERIC_LATTICE_DIMENSION,

      rowIndices:
        H_EARTH_WET_SAND_ROW_INDICES,

      columnIndices:
        H_EARTH_WET_SAND_COLUMN_INDICES,

      rowDirectionLawId:
        'H_EARTH_STAGE_Z_AXIS_ROW_ORDER_POLICY_v1',

      columnDirectionLawId:
        'H_EARTH_STAGE_X_AXIS_COLUMN_ORDER_POLICY_v1',

      rowOrigin:
        'ROW_01_BEGINS_AT_STAGE_Z_MINIMUM_EDGE',

      columnOrigin:
        'COLUMN_01_BEGINS_AT_STAGE_X_MINIMUM_EDGE',

      boundsConvention:
        'CELL_EDGE_INCLUSIVE_SELECTION',

      extentInterpretation:
        'CURRENT_COLUMNS_ARE_TREATED_AS_FULL_NUMERIC_CONSTRUCTION_EXTENT_FOR_WET_SAND_PROFILE',

      orientationAuthorityStatus:
        'DECLARED_ENVIRONMENT_MAPPING_POLICY_PENDING_LATTICE_CORRESPONDENCE_CHECK',

      extentAuthorityStatus:
        'DECLARED_ENVIRONMENT_MAPPING_POLICY_PENDING_LATTICE_CORRESPONDENCE_CHECK',

      cellWidth:
        H_EARTH_WET_SAND_CELL_WIDTH,

      cellDepth:
        H_EARTH_WET_SAND_CELL_DEPTH,

      derivedWorldBounds: deepFreeze({
        minimumX:
          H_EARTH_WET_SAND_X_WORLD_BOUNDS?.minimum ?? null,
        maximumX:
          H_EARTH_WET_SAND_X_WORLD_BOUNDS?.maximum ?? null,
        minimumZ:
          H_EARTH_WET_SAND_Z_WORLD_BOUNDS?.minimum ?? null,
        maximumZ:
          H_EARTH_WET_SAND_Z_WORLD_BOUNDS?.maximum ?? null
      }),

      derivationInputs: deepFreeze({
        stageXMinimum:
          STAGE_X_BOUNDS.minimum,
        stageXMaximum:
          STAGE_X_BOUNDS.maximum,
        stageXSpan:
          STAGE_X_BOUNDS.span,
        stageZMinimum:
          STAGE_Z_BOUNDS.minimum,
        stageZMaximum:
          STAGE_Z_BOUNDS.maximum,
        stageZSpan:
          STAGE_Z_BOUNDS.span
      }),

      derivationStatus:
        'DERIVED_FROM_CAPACITY_WORLD_BOUNDS_AND_DECLARED_ENVIRONMENT_MAPPING_POLICY'
    }),

    constructionStrategy:
      'HEIGHT_FIELD',

    coordinatePolicy: deepFreeze({
      policyId:
        'H_EARTH_WET_SAND_LOCAL_HEIGHT_DESCRIPTOR_POLICY_v1',

      descriptorCoordinateSpace:
        'LOCAL',

      transformApplication:
        'TRANSLATE_LOCAL_PROFILE_TO_SELECTED_WORLD_BOUNDS_CENTER',

      worldCoordinateSamplesCreatedHere:
        false,

      localCoordinateSamplesCreatedHere:
        false,

      providerMatrixConstructionOwnedHere:
        false
    }),

    samplingPolicy: deepFreeze({
      policyId:
        'H_EARTH_WET_SAND_HEIGHT_FIELD_SAMPLING_POLICY_v1',

      xSampleCount:
        H_EARTH_WET_SAND_X_SAMPLE_COUNT,

      zSampleCount:
        H_EARTH_WET_SAND_Z_SAMPLE_COUNT,

      samplesPerLatticeCellX:
        H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_X,

      samplesPerLatticeCellZ:
        H_EARTH_WET_SAND_SAMPLES_PER_LATTICE_CELL_Z,

      xAxis:
        H_EARTH_WET_SAND_LOCAL_X_AXIS,

      zAxis:
        H_EARTH_WET_SAND_LOCAL_Z_AXIS,

      inclusiveEndpoints: true
    }),

    elevationIntent: deepFreeze({
      policyId:
        'H_EARTH_WET_SAND_ELEVATION_INTENT_v1',

      baseElevation:
        H_EARTH_WET_SAND_BASE_ELEVATION,

      reliefAmplitude:
        H_EARTH_WET_SAND_RELIEF_AMPLITUDE,

      minimumHeightClamp:
        H_EARTH_WET_SAND_BASE_ELEVATION -
        H_EARTH_WET_SAND_RELIEF_AMPLITUDE,

      maximumHeightClamp:
        H_EARTH_WET_SAND_BASE_ELEVATION +
        H_EARTH_WET_SAND_RELIEF_AMPLITUDE
    }),

    heightLaw: deepFreeze({
      lawId:
        'H_EARTH_WET_SAND_HEIGHT_LAW_v1',

      inputSpace:
        'NORMALIZED_LOCAL_SELECTED_BOUNDS',

      shorelineAxis:
        'Z',

      shorelineDirection:
        'INCREASING_Z',

      gradient: deepFreeze({
        function:
          'LINEAR',
        coefficient:
          0.35
      }),

      microRelief: deepFreeze({
        function:
          'PRODUCT_OF_SINE_WAVES',
        amplitude:
          0.18,
        frequencyX:
          2.0,
        frequencyZ:
          1.5,
        phaseSeed:
          'H_EARTH_WET_SAND_001'
      }),

      evaluationOrder: deepFreeze([
        'BASE_ELEVATION',
        'SHORELINE_GRADIENT',
        'MICRO_RELIEF',
        'HEIGHT_CLAMP'
      ]),

      sampledElevationValuesCreatedHere:
        false
    }),

    transformIntent: deepFreeze({
      policyId:
        'H_EARTH_WET_SAND_PROVIDER_SPACE_TRANSFORM_INTENT_v1',

      representation:
        'POLICY_ONLY',

      localOrigin: deepFreeze({
        x: 0,
        y: 0,
        z: 0
      }),

      worldTranslation: deepFreeze({
        x:
          H_EARTH_WET_SAND_WORLD_CENTER_X,
        y:
          H_EARTH_WET_SAND_BASE_ELEVATION,
        z:
          H_EARTH_WET_SAND_WORLD_CENTER_Z
      }),

      rotationEulerXYZ: deepFreeze({
        x: 0,
        y: 0,
        z: 0
      }),

      scaleXYZ: deepFreeze({
        x: 1,
        y: 1,
        z: 1
      }),

      providerMatrixConstructionOwnedHere:
        false
    }),

    toleranceIntent: deepFreeze({
      policyId:
        'H_EARTH_WET_SAND_NUMERIC_TOLERANCE_CONTEXT_v1',

      worldPositionEpsilon:
        0.001,

      worldNormalEpsilon:
        0.001,

      heightEpsilon:
        H_EARTH_WET_SAND_HEIGHT_EPSILON
    }),

    materialIntentId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,

    environmentOwnsNumericProfile:
      true,

    providerInvocationOwnedHere:
      false,

    geometryConstructionOwnedHere:
      false,

    sampledElevationValuesCreatedHere:
      false,

    topologyCreatedHere:
      false
  });

function recomputeWetSandExpectedWorldBounds() {
  return deepFreeze({
    x:
      deriveAxisBoundsFromLatticeIndices({
        axisBounds:
          STAGE_X_BOUNDS,
        indices:
          H_EARTH_WET_SAND_COLUMN_INDICES
      }),
    z:
      deriveAxisBoundsFromLatticeIndices({
        axisBounds:
          STAGE_Z_BOUNDS,
        indices:
          H_EARTH_WET_SAND_ROW_INDICES
      })
  });
}

export function evaluateHEarth3DWetSandNumericConstructionProfile(
  profile =
    H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE
) {
  const checks = [];
  const issues = [];

  const profilePresent =
    isPlainObject(profile);

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_PRESENT',
      profilePresent
    )
  );

  if (!profilePresent) {
    issues.push(
      createEnvironmentIssue(
        'WET_SAND_NUMERIC_PROFILE_MISSING',
        'A wet-sand numeric construction profile is required.'
      )
    );

    return deepFreeze({
      eligible: false,
      status:
        'WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_NOT_ELIGIBLE',
      checks:
        deepFreeze(checks),
      issues:
        deepFreeze(issues)
    });
  }

  const coordinateFrameMatches =
    profile.coordinateFrame ===
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_COORDINATE_FRAME_MATCHES',
      coordinateFrameMatches,
      profile.coordinateFrame
    )
  );

  const sourceIdentityMatches =
    profile.sourceObjectId ===
      H_EARTH_WET_SAND_SOURCE_OBJECT_ID &&
    profile.primaryZoneId ===
      H_EARTH_WET_SAND_PRIMARY_ZONE_ID &&
    profile.regionId ===
      H_EARTH_WET_SAND_REGION_ID;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SOURCE_IDENTITY_MATCHES',
      sourceIdentityMatches
    )
  );

  const semanticDependencyIdsMatch =
    profile.semanticDependencies?.packet001ExpectedContractId ===
      H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID &&
    profile.semanticDependencies?.providerImplementationContractId ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID &&
    profile.semanticDependencies?.providerImplementationFile ===
      H_EARTH_WET_SAND_PROVIDER_IMPLEMENTATION_FILE &&
    profile.semanticDependencies?.providerId ===
      H_EARTH_WET_SAND_PROVIDER_ID;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SEMANTIC_DEPENDENCY_IDS_MATCH',
      semanticDependencyIdsMatch,
      profile.semanticDependencies
    )
  );

  const expectedWorldBounds =
    recomputeWetSandExpectedWorldBounds();

  const derivedBounds =
    profile.latticeDerivation?.derivedWorldBounds;

  const derivedBoundsValid =
    isPlainObject(derivedBounds) &&
    isFiniteNumber(derivedBounds.minimumX) &&
    isFiniteNumber(derivedBounds.maximumX) &&
    isFiniteNumber(derivedBounds.minimumZ) &&
    isFiniteNumber(derivedBounds.maximumZ) &&
    derivedBounds.minimumX < derivedBounds.maximumX &&
    derivedBounds.minimumZ < derivedBounds.maximumZ;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_DERIVED_BOUNDS_VALID',
      derivedBoundsValid,
      derivedBounds
    )
  );

  const derivedBoundsRecomputedMatch =
    derivedBoundsValid &&
    expectedWorldBounds.x !== null &&
    expectedWorldBounds.z !== null &&
    derivedBounds.minimumX ===
      expectedWorldBounds.x.minimum &&
    derivedBounds.maximumX ===
      expectedWorldBounds.x.maximum &&
    derivedBounds.minimumZ ===
      expectedWorldBounds.z.minimum &&
    derivedBounds.maximumZ ===
      expectedWorldBounds.z.maximum;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_DERIVED_BOUNDS_RECOMPUTED_MATCH',
      derivedBoundsRecomputedMatch,
      deepFreeze({
        declared:
          derivedBounds,
        recomputed:
          expectedWorldBounds
      })
    )
  );

  const rowIndicesMatch =
    arraysEqual(
      profile.latticeDerivation?.rowIndices,
      H_EARTH_WET_SAND_ROW_INDICES
    );

  const columnIndicesMatch =
    arraysEqual(
      profile.latticeDerivation?.columnIndices,
      H_EARTH_WET_SAND_COLUMN_INDICES
    );

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_ROW_INDICES_MATCH_EXPECTED',
      rowIndicesMatch,
      profile.latticeDerivation?.rowIndices
    )
  );

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_COLUMN_INDICES_MATCH_EXPECTED',
      columnIndicesMatch,
      profile.latticeDerivation?.columnIndices
    )
  );

  const samplePolicy =
    profile.samplingPolicy;

  const samplePolicyValid =
    isPlainObject(samplePolicy) &&
    isNonNegativeInteger(samplePolicy.xSampleCount) &&
    isNonNegativeInteger(samplePolicy.zSampleCount) &&
    samplePolicy.xSampleCount >= 2 &&
    samplePolicy.zSampleCount >= 2 &&
    isPlainObject(samplePolicy.xAxis) &&
    isPlainObject(samplePolicy.zAxis);

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SAMPLING_POLICY_VALID',
      samplePolicyValid,
      samplePolicy
    )
  );

  const sampleCountsMatchExpected =
    samplePolicyValid &&
    samplePolicy.xSampleCount ===
      H_EARTH_WET_SAND_X_SAMPLE_COUNT &&
    samplePolicy.zSampleCount ===
      H_EARTH_WET_SAND_Z_SAMPLE_COUNT;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SAMPLE_COUNTS_MATCH_EXPECTED',
      sampleCountsMatchExpected,
      deepFreeze({
        declared: deepFreeze({
          xSampleCount:
            samplePolicy?.xSampleCount ?? null,
          zSampleCount:
            samplePolicy?.zSampleCount ?? null
        }),
        expected: deepFreeze({
          xSampleCount:
            H_EARTH_WET_SAND_X_SAMPLE_COUNT,
          zSampleCount:
            H_EARTH_WET_SAND_Z_SAMPLE_COUNT
        })
      })
    )
  );

  const localAxisEndpointsMatch =
    samplePolicyValid &&
    samplePolicy.xAxis.minimum ===
      H_EARTH_WET_SAND_LOCAL_X_MINIMUM &&
    samplePolicy.xAxis.maximum ===
      H_EARTH_WET_SAND_LOCAL_X_MAXIMUM &&
    samplePolicy.zAxis.minimum ===
      H_EARTH_WET_SAND_LOCAL_Z_MINIMUM &&
    samplePolicy.zAxis.maximum ===
      H_EARTH_WET_SAND_LOCAL_Z_MAXIMUM;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SAMPLE_AXIS_ENDPOINTS_MATCH',
      localAxisEndpointsMatch,
      deepFreeze({
        declared: deepFreeze({
          xAxis:
            samplePolicy?.xAxis ?? null,
          zAxis:
            samplePolicy?.zAxis ?? null
        }),
        expected: deepFreeze({
          xMinimum:
            H_EARTH_WET_SAND_LOCAL_X_MINIMUM,
          xMaximum:
            H_EARTH_WET_SAND_LOCAL_X_MAXIMUM,
          zMinimum:
            H_EARTH_WET_SAND_LOCAL_Z_MINIMUM,
          zMaximum:
            H_EARTH_WET_SAND_LOCAL_Z_MAXIMUM
        })
      })
    )
  );

  const sampleAxisStepMatches =
    samplePolicyValid &&
    isFiniteNumber(samplePolicy.xAxis.step) &&
    isFiniteNumber(samplePolicy.zAxis.step) &&
    samplePolicy.xAxis.step ===
      (
        H_EARTH_WET_SAND_LOCAL_X_MAXIMUM -
        H_EARTH_WET_SAND_LOCAL_X_MINIMUM
      ) /
        (H_EARTH_WET_SAND_X_SAMPLE_COUNT - 1) &&
    samplePolicy.zAxis.step ===
      (
        H_EARTH_WET_SAND_LOCAL_Z_MAXIMUM -
        H_EARTH_WET_SAND_LOCAL_Z_MINIMUM
      ) /
        (H_EARTH_WET_SAND_Z_SAMPLE_COUNT - 1);

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_SAMPLE_AXIS_STEP_MATCHES',
      sampleAxisStepMatches,
      deepFreeze({
        xStep:
          samplePolicy?.xAxis?.step ?? null,
        zStep:
          samplePolicy?.zAxis?.step ?? null
      })
    )
  );

  const elevationIntent =
    profile.elevationIntent;

  const elevationIntentValid =
    isPlainObject(elevationIntent) &&
    isFiniteNumber(elevationIntent.baseElevation) &&
    isPositiveFiniteNumber(elevationIntent.reliefAmplitude) &&
    isFiniteNumber(elevationIntent.minimumHeightClamp) &&
    isFiniteNumber(elevationIntent.maximumHeightClamp) &&
    elevationIntent.minimumHeightClamp <
      elevationIntent.maximumHeightClamp;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_ELEVATION_INTENT_VALID',
      elevationIntentValid,
      elevationIntent
    )
  );

  const elevationWithinCapacityYBounds =
    elevationIntentValid &&
    elevationIntent.baseElevation >=
      STAGE_Y_BOUNDS.minimum &&
    elevationIntent.baseElevation <=
      STAGE_Y_BOUNDS.maximum &&
    elevationIntent.minimumHeightClamp >=
      STAGE_Y_BOUNDS.minimum &&
    elevationIntent.maximumHeightClamp <=
      STAGE_Y_BOUNDS.maximum;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_ELEVATION_WITHIN_CAPACITY_Y_BOUNDS',
      elevationWithinCapacityYBounds,
      deepFreeze({
        baseElevation:
          elevationIntent?.baseElevation ?? null,
        minimumHeightClamp:
          elevationIntent?.minimumHeightClamp ?? null,
        maximumHeightClamp:
          elevationIntent?.maximumHeightClamp ?? null,
        yBounds:
          STAGE_Y_BOUNDS
      })
    )
  );

  const heightLaw =
    profile.heightLaw;

  const heightLawComplete =
    isPlainObject(heightLaw) &&
    isNonEmptyString(heightLaw.lawId) &&
    heightLaw.inputSpace ===
      'NORMALIZED_LOCAL_SELECTED_BOUNDS' &&
    heightLaw.shorelineAxis === 'Z' &&
    heightLaw.shorelineDirection === 'INCREASING_Z' &&
    isPlainObject(heightLaw.gradient) &&
    heightLaw.gradient.function === 'LINEAR' &&
    isFiniteNumber(heightLaw.gradient.coefficient) &&
    isPlainObject(heightLaw.microRelief) &&
    heightLaw.microRelief.function ===
      'PRODUCT_OF_SINE_WAVES' &&
    isFiniteNumber(heightLaw.microRelief.amplitude) &&
    isFiniteNumber(heightLaw.microRelief.frequencyX) &&
    isFiniteNumber(heightLaw.microRelief.frequencyZ) &&
    isNonEmptyString(heightLaw.microRelief.phaseSeed) &&
    arraysEqual(
      heightLaw.evaluationOrder,
      deepFreeze([
        'BASE_ELEVATION',
        'SHORELINE_GRADIENT',
        'MICRO_RELIEF',
        'HEIGHT_CLAMP'
      ])
    ) &&
    heightLaw.sampledElevationValuesCreatedHere === false;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_HEIGHT_LAW_COMPLETE',
      heightLawComplete,
      heightLaw
    )
  );

  const coordinatePolicy =
    profile.coordinatePolicy;

  const coordinatePolicyUnambiguous =
    isPlainObject(coordinatePolicy) &&
    coordinatePolicy.descriptorCoordinateSpace ===
      'LOCAL' &&
    coordinatePolicy.transformApplication ===
      'TRANSLATE_LOCAL_PROFILE_TO_SELECTED_WORLD_BOUNDS_CENTER' &&
    coordinatePolicy.worldCoordinateSamplesCreatedHere === false &&
    coordinatePolicy.localCoordinateSamplesCreatedHere === false &&
    coordinatePolicy.providerMatrixConstructionOwnedHere === false;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_COORDINATE_POLICY_UNAMBIGUOUS',
      coordinatePolicyUnambiguous,
      coordinatePolicy
    )
  );

  const transformIntent =
    profile.transformIntent;

  const transformIntentValid =
    isPlainObject(transformIntent) &&
    transformIntent.representation ===
      'POLICY_ONLY' &&
    isPlainObject(transformIntent.localOrigin) &&
    transformIntent.localOrigin.x === 0 &&
    transformIntent.localOrigin.y === 0 &&
    transformIntent.localOrigin.z === 0 &&
    isPlainObject(transformIntent.worldTranslation) &&
    isFiniteNumber(transformIntent.worldTranslation.x) &&
    isFiniteNumber(transformIntent.worldTranslation.y) &&
    isFiniteNumber(transformIntent.worldTranslation.z) &&
    transformIntent.providerMatrixConstructionOwnedHere === false;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_TRANSFORM_INTENT_VALID',
      transformIntentValid,
      transformIntent
    )
  );

  const materialIntentMatches =
    profile.materialIntentId ===
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_MATERIAL_ID_MATCHES',
      materialIntentMatches,
      profile.materialIntentId
    )
  );

  const authorityBoundaryPreserved =
    profile.environmentOwnsNumericProfile === true &&
    profile.providerInvocationOwnedHere === false &&
    profile.geometryConstructionOwnedHere === false &&
    profile.sampledElevationValuesCreatedHere === false &&
    profile.topologyCreatedHere === false;

  checks.push(
    createEnvironmentCheck(
      'WET_SAND_NUMERIC_PROFILE_AUTHORITY_BOUNDARY_PRESERVED',
      authorityBoundaryPreserved
    )
  );

  for (const check of checks) {
    if (!check.passed) {
      issues.push(
        createEnvironmentIssue(
          'WET_SAND_NUMERIC_PROFILE_CHECK_FAILED',
          `Wet-sand numeric construction profile check ${check.id} failed.`,
          check.details
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
        ? 'WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_ELIGIBLE'
        : 'WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    providerInvocationOwnedHere: false,
    geometryConstructionOwnedHere: false
  });
}

/**
 * Primitive accounting.
 */
const ENVIRONMENT_SUBSTRATE_PRIMITIVE_COUNT =
  2 +
  3 +
  2 +
  H_EARTH_3D_WATER_SUBSTRATE.waveBands.length;

const ENVIRONMENT_DETAIL_PRIMITIVE_COUNT =
  H_EARTH_3D_TIDE_POOL_DESCRIPTORS.length +
  H_EARTH_3D_STONE_DESCRIPTORS.length +
  H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS.length;

const ENVIRONMENT_CONTEXT_PRIMITIVE_COUNT =
  1 +
  H_EARTH_3D_BACKGROUND_CONTEXT.offshoreIslets.length;

const ENVIRONMENT_INTERACTION_PRIMITIVE_COUNT =
  1;

const ESTIMATED_ENVIRONMENT_PRIMITIVE_COUNT =
  ENVIRONMENT_SUBSTRATE_PRIMITIVE_COUNT +
  ENVIRONMENT_DETAIL_PRIMITIVE_COUNT +
  ENVIRONMENT_CONTEXT_PRIMITIVE_COUNT +
  ENVIRONMENT_INTERACTION_PRIMITIVE_COUNT;

const ENVIRONMENT_NODE_BUDGET_EVALUATION =
  evaluateHEarth3DNodeBudget({
    semanticLayerContainers: 15,
    environmentPrimitives:
      ESTIMATED_ENVIRONMENT_PRIMITIVE_COUNT,
    interactionNodes: 1,
    routeOverlayNodes: 0,
    diagnosticOwnedNodes: 0
  });

export const H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN = deepFreeze({
  planId:
    'H_EARTH_GROUND_CELL_001_FRAME_BASED_ENVIRONMENT_PRIMITIVE_PLAN',

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  outputModel:
    H_EARTH_3D_RENDER_STAGE_LIMITS.permittedOutputModel,

  semanticLayerContainerEstimate: 15,

  substrate: deepFreeze({
    atmosphericOverlays: 2,
    horizonBands: 1,
    groundSurfaces: 2,
    shorelineContactRibbons: 1,
    waterSurfaces: 2,
    waveBands:
      H_EARTH_3D_WATER_SUBSTRATE.waveBands.length
  }),

  detail: deepFreeze({
    tidePools:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS.length,
    stones:
      H_EARTH_3D_STONE_DESCRIPTORS.length,
    jaggedRocks:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS.length
  }),

  context: deepFreeze({
    manorBluffClusters: 1,
    offshoreIslets:
      H_EARTH_3D_BACKGROUND_CONTEXT.offshoreIslets.length
  }),

  interaction: deepFreeze({
    inspectionAnchors: 1
  }),

  tierAccounting: deepFreeze({
    essential:
      ENVIRONMENT_SUBSTRATE_PRIMITIVE_COUNT,
    detail:
      ENVIRONMENT_DETAIL_PRIMITIVE_COUNT,
    context:
      ENVIRONMENT_CONTEXT_PRIMITIVE_COUNT,
    interaction:
      ENVIRONMENT_INTERACTION_PRIMITIVE_COUNT
  }),

  estimatedEnvironmentPrimitiveCount:
    ESTIMATED_ENVIRONMENT_PRIMITIVE_COUNT,

  totalEnvironmentPrimitives:
    ESTIMATED_ENVIRONMENT_PRIMITIVE_COUNT,

  estimatedInteractionNodeCount: 1,
  estimatedRouteOverlayNodeCount: 0,
  estimatedDiagnosticOwnedNodeCount: 0,

  nodeBudgetEvaluation:
    ENVIRONMENT_NODE_BUDGET_EVALUATION,

  eligible:
    ENVIRONMENT_NODE_BUDGET_EVALUATION.eligible === true,

  status:
    ENVIRONMENT_NODE_BUDGET_EVALUATION.eligible === true
      ? 'ENVIRONMENT_PRIMITIVE_PLAN_ELIGIBLE'
      : 'ENVIRONMENT_PRIMITIVE_PLAN_NOT_ELIGIBLE',

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false
});

export function evaluateHEarth3DEnvironmentPrimitivePlan(
  plan =
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
) {
  const checks = [];
  const issues = [];

  const planPresent =
    isPlainObject(plan);

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_PLAN_PRESENT',
      planPresent
    )
  );

  if (!planPresent) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_PRIMITIVE_PLAN_MISSING',
        'An environment primitive plan object is required.'
      )
    );

    return deepFreeze({
      eligible: false,
      status:
        'ENVIRONMENT_PRIMITIVE_PLAN_NOT_ELIGIBLE',
      checks:
        deepFreeze(checks),
      issues:
        deepFreeze(issues)
    });
  }

  const count =
    plan.estimatedEnvironmentPrimitiveCount;

  const countEligible =
    isNonNegativeInteger(count);

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_COUNT_ELIGIBLE',
      countEligible,
      count
    )
  );

  if (!countEligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_PRIMITIVE_COUNT_INVALID',
        'estimatedEnvironmentPrimitiveCount must be a non-negative integer.',
        count
      )
    );
  }

  const semanticLayerContainerEstimate =
    plan.semanticLayerContainerEstimate;

  const semanticLayerEstimateEligible =
    isNonNegativeInteger(
      semanticLayerContainerEstimate
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_SEMANTIC_LAYER_ESTIMATE_ELIGIBLE',
      semanticLayerEstimateEligible,
      semanticLayerContainerEstimate
    )
  );

  if (!semanticLayerEstimateEligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_SEMANTIC_LAYER_ESTIMATE_INVALID',
        'semanticLayerContainerEstimate must be a non-negative integer.',
        semanticLayerContainerEstimate
      )
    );
  }

  let nodeBudgetEvaluation = null;

  if (
    countEligible &&
    semanticLayerEstimateEligible
  ) {
    nodeBudgetEvaluation =
      evaluateHEarth3DNodeBudget({
        semanticLayerContainers:
          semanticLayerContainerEstimate,
        environmentPrimitives: count,
        interactionNodes:
          plan.estimatedInteractionNodeCount ?? 0,
        routeOverlayNodes:
          plan.estimatedRouteOverlayNodeCount ?? 0,
        diagnosticOwnedNodes:
          plan.estimatedDiagnosticOwnedNodeCount ?? 0
      });
  }

  const nodeBudgetEligible =
    nodeBudgetEvaluation?.eligible === true;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_NODE_BUDGET_ELIGIBLE',
      nodeBudgetEligible,
      nodeBudgetEvaluation
    )
  );

  if (!nodeBudgetEligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_NODE_BUDGET_NOT_ELIGIBLE',
        'The environment primitive plan is outside the node-budget capacity.',
        nodeBudgetEvaluation
      )
    );
  }

  const coordinateFrameMatches =
    plan.coordinateFrame ===
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_PLAN_COORDINATE_FRAME_MATCHES',
      coordinateFrameMatches,
      plan.coordinateFrame
    )
  );

  if (!coordinateFrameMatches) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_PRIMITIVE_PLAN_COORDINATE_FRAME_MISMATCH',
        'The primitive-plan coordinate frame does not match capacity.',
        plan.coordinateFrame
      )
    );
  }

  const outputModelPermitted =
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .permittedOutputModels
      .includes(
        plan.outputModel
      );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_PLAN_OUTPUT_MODEL_PERMITTED',
      outputModelPermitted,
      plan.outputModel
    )
  );

  if (!outputModelPermitted) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_PRIMITIVE_PLAN_OUTPUT_MODEL_NOT_PERMITTED',
        'The primitive-plan output model is not permitted by capacity.',
        plan.outputModel
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'ENVIRONMENT_PRIMITIVE_PLAN_ELIGIBLE'
        : 'ENVIRONMENT_PRIMITIVE_PLAN_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    count,
    nodeBudgetEvaluation,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Environment alignment with the frame-based capacity corridor.
 */
export const H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT =
  deepFreeze({
    capacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    capacityContractIdMatches:
      CAPACITY_CONTRACT.contractId ===
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    activeCellMatches:
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell,

    spatialCellMatches:
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId,

    sceneIdentityMatches:
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity,

    coordinateFrameMatches:
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.coordinateFrame ===
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

    worldBoundsReferenced: true,

    outputModelPermitted:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        .permittedOutputModels
        .includes(
          H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN.outputModel
        ),

    primitiveBudgetEligible:
      H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
        .nodeBudgetEvaluation
        .eligible === true,

    semanticLayerCapacitySupported:
      H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
        .semanticLayerContainerEstimate <=
      H_EARTH_3D_RENDER_STAGE_LIMITS
        .semanticLayerContainerMaximum,

    inspectionAnchorCapacitySupported:
      H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
        .estimatedInteractionNodeCount >= 1,

    wetSandNumericProfileEligible:
      evaluateHEarth3DWetSandNumericConstructionProfile()
        .eligible === true,

    compositorFrameProviderRolePreserved: true,
    rendererProjectionBoundaryPreserved: true,
    controllerIntentBoundaryPreserved: true,

    compositorFrameConstructed: false,
    rendererFrameConsumed: false,

    rendererPassClaim: false,
    visualPassClaim: false
  });

export function evaluateHEarth3DEnvironmentCapacityAlignment(
  alignment =
    H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT
) {
  const checks = [
    createEnvironmentCheck(
      'ENVIRONMENT_CAPACITY_CONTRACT_ID_MATCHES',
      alignment.capacityContractIdMatches === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_ACTIVE_CELL_MATCHES',
      alignment.activeCellMatches === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_SPATIAL_CELL_MATCHES',
      alignment.spatialCellMatches === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_SCENE_IDENTITY_MATCHES',
      alignment.sceneIdentityMatches === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_COORDINATE_FRAME_MATCHES',
      alignment.coordinateFrameMatches === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_WORLD_BOUNDS_REFERENCED',
      alignment.worldBoundsReferenced === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_OUTPUT_MODEL_PERMITTED',
      alignment.outputModelPermitted === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_BUDGET_ELIGIBLE',
      alignment.primitiveBudgetEligible === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_SEMANTIC_LAYER_CAPACITY_SUPPORTED',
      alignment.semanticLayerCapacitySupported === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_INSPECTION_ANCHOR_CAPACITY_SUPPORTED',
      alignment.inspectionAnchorCapacitySupported === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_WET_SAND_NUMERIC_PROFILE_ELIGIBLE',
      alignment.wetSandNumericProfileEligible === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_COMPOSITOR_PROVIDER_ROLE_PRESERVED',
      alignment.compositorFrameProviderRolePreserved === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_RENDERER_BOUNDARY_PRESERVED',
      alignment.rendererProjectionBoundaryPreserved === true
    ),

    createEnvironmentCheck(
      'ENVIRONMENT_CONTROLLER_BOUNDARY_PRESERVED',
      alignment.controllerIntentBoundaryPreserved === true
    )
  ];

  const issues =
    checks
      .filter((check) => !check.passed)
      .map((check) =>
        createEnvironmentIssue(
          'ENVIRONMENT_CAPACITY_ALIGNMENT_CHECK_FAILED',
          `Environment capacity-alignment check ${check.id} failed.`,
          check.details
        )
      );

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'ENVIRONMENT_CAPACITY_ALIGNMENT_ELIGIBLE'
        : 'ENVIRONMENT_CAPACITY_ALIGNMENT_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Environment claim ceilings.
 */
export const H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS = deepFreeze({
  runtimeActivationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  playableEnvironmentClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  compositorFrameConstructionClaim: false,
  rendererFrameConsumptionClaim: false,
  controllerIntentDispatchClaim: false,
  routeMountClaim: false,

  packet001SemanticResolutionClaim: false,
  providerSelectionClaim: false,
  providerInvocationClaim: false,
  geometryConstructionClaim: false,
  WestAdmissionClaim: false,
  geometryIndexMutationClaim: false,

  actionExecutionClaim: false,
  readoutConstructionClaim: false,
  inspectionReceiptConstructionClaim: false,

  actorClaim: false,
  actorReadyClaim: false,
  groundContactClaim: false,
  collisionClaim: false,
  traversalClaim: false,
  gameplayClaim: false,
  fluidSimulationClaim: false,

  matrixCollapse: false
});

/**
 * Environment-to-compositor handoff.
 */
export const H_EARTH_3D_ENVIRONMENT_HANDOFF = deepFreeze({
  handoffType:
    'H_EARTH_LAYER_4_ENVIRONMENT_TO_COMPOSITOR_FRAME_INPUT_HANDOFF',

  compatibilityHandoffType:
    'H_EARTH_GROUND_CELL_001_ENVIRONMENT_TO_COMPOSITOR',

  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  bindingIdentity:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  worldBounds:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

  publicStageIds:
    H_EARTH_3D_PUBLIC_STAGE_IDS,

  environmentTierOrder:
    H_EARTH_3D_ENVIRONMENT_TIER_ORDER,

  environmentTiers:
    H_EARTH_3D_ENVIRONMENT_TIERS,

  materialIdentities:
    H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,

  groundSubstrate:
    H_EARTH_3D_GROUND_SUBSTRATE,

  shorelineModel:
    H_EARTH_3D_SHORELINE_MODEL,

  waterSubstrate:
    H_EARTH_3D_WATER_SUBSTRATE,

  atmosphereModel:
    H_EARTH_3D_ATMOSPHERE_MODEL,

  tidePoolDescriptors:
    H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

  stoneDescriptors:
    H_EARTH_3D_STONE_DESCRIPTORS,

  jaggedRockDescriptors:
    H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

  backgroundContext:
    H_EARTH_3D_BACKGROUND_CONTEXT,

  inspectionAnchor:
    H_EARTH_3D_INSPECTION_ANCHOR,

  actorReadyGroundCandidate:
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,

  wetSandNumericConstructionProfile:
    H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,

  primitivePlan:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN,

  frameCapacityAlignment:
    H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT,

  capacityContext: deepFreeze({
    renderStageLimits:
      H_EARTH_3D_RENDER_STAGE_LIMITS,
    renderFrameCapacity:
      H_EARTH_3D_RENDER_FRAME_CAPACITY,
    compositorFrameEligibility:
      H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY,
    rendererFrameConsumptionEligibility:
      H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY
  }),

  compositorRules: deepFreeze({
    compositorMayOwnCameraState: true,
    compositorMayOwnViewportState: true,
    compositorMayOwnNavigationState: true,
    compositorMayOwnInertiaState: true,
    compositorMayOwnVisibilityState: true,
    compositorMayOwnFrameSequencing: true,

    compositorMayAlterEnvironmentTruth: false,
    compositorMayInventMaterials: false,
    compositorMayInventEnvironmentDescriptors: false,
    compositorMayExpandWorldBounds: false
  }),

  rendererRules: deepFreeze({
    rendererMayOwnProjectionMathematics: true,
    rendererMayOwnProjectedPrimitiveConstruction: true,
    rendererMayOwnDOMCSSMaterialization: true,

    rendererMayOwnEnvironmentTruth: false,
    rendererMayOwnCameraState: false,
    rendererMayOwnViewportState: false,
    rendererMayInventSemanticOrder: false
  }),

  providerTranslationRules: deepFreeze({
    packet001SemanticResolutionRequired: true,
    environmentNumericProfileRequired: true,
    providerInvocationOwnedHere: false,
    geometryConstructionOwnedHere: false,
    WestAdmissionOwnedHere: false
  }),

  controllerRules: deepFreeze({
    controllerMayNormalizeInput: true,
    controllerMayDispatchCompositorIntent: true,

    controllerMayOwnEnvironmentTruth: false,
    controllerMayOwnCameraState: false,
    controllerMayMutateEnvironmentDescriptors: false
  }),

  claimCeilings:
    H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
});

export function evaluateHEarth3DEnvironmentHandoff(
  handoff =
    H_EARTH_3D_ENVIRONMENT_HANDOFF
) {
  const checks = [];
  const issues = [];

  const handoffPresent =
    isPlainObject(handoff);

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_PRESENT',
      handoffPresent
    )
  );

  if (!handoffPresent) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_MISSING',
        'An environment handoff object is required.'
      )
    );

    return deepFreeze({
      eligible: false,
      status:
        'ENVIRONMENT_HANDOFF_NOT_ELIGIBLE',
      checks:
        deepFreeze(checks),
      issues:
        deepFreeze(issues)
    });
  }

  const requiredObjectFields = [
    'bindingIdentity',
    'worldBounds',
    'environmentTiers',
    'materialIdentities',
    'groundSubstrate',
    'shorelineModel',
    'waterSubstrate',
    'atmosphereModel',
    'backgroundContext',
    'inspectionAnchor',
    'actorReadyGroundCandidate',
    'wetSandNumericConstructionProfile',
    'primitivePlan',
    'frameCapacityAlignment',
    'compositorRules',
    'rendererRules',
    'providerTranslationRules',
    'controllerRules',
    'claimCeilings'
  ];

  for (const field of requiredObjectFields) {
    const passed =
      isPlainObject(
        handoff[field]
      );

    checks.push(
      createEnvironmentCheck(
        `ENVIRONMENT_HANDOFF_${field.toUpperCase()}_PRESENT`,
        passed
      )
    );

    if (!passed) {
      issues.push(
        createEnvironmentIssue(
          'ENVIRONMENT_HANDOFF_REQUIRED_OBJECT_MISSING',
          `Environment handoff field ${field} must be an object.`,
          field
        )
      );
    }
  }

  const requiredArrayFields = [
    'environmentTierOrder',
    'tidePoolDescriptors',
    'stoneDescriptors',
    'jaggedRockDescriptors'
  ];

  for (const field of requiredArrayFields) {
    const passed =
      Array.isArray(
        handoff[field]
      );

    checks.push(
      createEnvironmentCheck(
        `ENVIRONMENT_HANDOFF_${field.toUpperCase()}_PRESENT`,
        passed
      )
    );

    if (!passed) {
      issues.push(
        createEnvironmentIssue(
          'ENVIRONMENT_HANDOFF_REQUIRED_ARRAY_MISSING',
          `Environment handoff field ${field} must be an array.`,
          field
        )
      );
    }
  }

  const contractIdMatches =
    handoff.contractId ===
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID;

  const capacityContractIdMatches =
    handoff.capacityContractId ===
      H_EARTH_3D_CAPACITY_CONTRACT_ID;

  const coordinateFrameMatches =
    handoff.coordinateFrame ===
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame;

  const primitivePlanEvaluation =
    evaluateHEarth3DEnvironmentPrimitivePlan(
      handoff.primitivePlan
    );

  const capacityAlignmentEvaluation =
    evaluateHEarth3DEnvironmentCapacityAlignment(
      handoff.frameCapacityAlignment
    );

  const wetSandProfileEvaluation =
    evaluateHEarth3DWetSandNumericConstructionProfile(
      handoff.wetSandNumericConstructionProfile
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_CONTRACT_ID_MATCHES',
      contractIdMatches,
      handoff.contractId
    )
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_CAPACITY_CONTRACT_ID_MATCHES',
      capacityContractIdMatches,
      handoff.capacityContractId
    )
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_COORDINATE_FRAME_MATCHES',
      coordinateFrameMatches,
      handoff.coordinateFrame
    )
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_PRIMITIVE_PLAN_ELIGIBLE',
      primitivePlanEvaluation.eligible,
      primitivePlanEvaluation
    )
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_CAPACITY_ALIGNMENT_ELIGIBLE',
      capacityAlignmentEvaluation.eligible,
      capacityAlignmentEvaluation
    )
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_WET_SAND_NUMERIC_PROFILE_ELIGIBLE',
      wetSandProfileEvaluation.eligible,
      wetSandProfileEvaluation
    )
  );

  if (!contractIdMatches) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_CONTRACT_ID_MISMATCH',
        'Environment handoff contract ID does not match the renewed environment contract.',
        handoff.contractId
      )
    );
  }

  if (!capacityContractIdMatches) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_CAPACITY_CONTRACT_ID_MISMATCH',
        'Environment handoff capacity contract ID does not match.',
        handoff.capacityContractId
      )
    );
  }

  if (!coordinateFrameMatches) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_COORDINATE_FRAME_MISMATCH',
        'Environment handoff coordinate frame does not match capacity.',
        handoff.coordinateFrame
      )
    );
  }

  if (!primitivePlanEvaluation.eligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_PRIMITIVE_PLAN_NOT_ELIGIBLE',
        'Environment handoff primitive plan is not eligible.',
        primitivePlanEvaluation
      )
    );
  }

  if (!capacityAlignmentEvaluation.eligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_CAPACITY_ALIGNMENT_NOT_ELIGIBLE',
        'Environment handoff capacity alignment is not eligible.',
        capacityAlignmentEvaluation
      )
    );
  }

  if (!wetSandProfileEvaluation.eligible) {
    issues.push(
      createEnvironmentIssue(
        'ENVIRONMENT_HANDOFF_WET_SAND_NUMERIC_PROFILE_NOT_ELIGIBLE',
        'Environment handoff wet-sand numeric construction profile is not eligible.',
        wetSandProfileEvaluation
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'ENVIRONMENT_HANDOFF_ELIGIBLE'
        : 'ENVIRONMENT_HANDOFF_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    primitivePlanEvaluation,
    capacityAlignmentEvaluation,
    wetSandProfileEvaluation,

    compositorFrameConstructed: false,
    rendererFrameConsumed: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Required material-key compatibility.
 */
const REQUIRED_MATERIAL_KEYS = deepFreeze([
  'sky',
  'atmosphere',
  'haze',
  'islet',
  'manorContext',
  'openWater',
  'nearshoreWater',
  'wave',
  'foam',
  'wetSand',
  'drySand',
  'tidePool',
  'stone',
  'rock',
  'inspectionAnchor'
]);

/**
 * Static frame-based environment preflight.
 */
export const H_EARTH_3D_ENVIRONMENT_PREFLIGHT = (() => {
  const checks = [];
  const issues = [];

  const capacityContractAvailable =
    isPlainObject(
      CAPACITY_CONTRACT
    ) &&
    CAPACITY_CONTRACT.contractId ===
      H_EARTH_3D_CAPACITY_CONTRACT_ID;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CAPACITY_CONTRACT_AVAILABLE',
      capacityContractAvailable
    )
  );

  const capacityReceiptAvailable =
    isPlainObject(
      CAPACITY_RECEIPT
    ) &&
    CAPACITY_RECEIPT.contractId ===
      H_EARTH_3D_CAPACITY_CONTRACT_ID;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CAPACITY_RECEIPT_AVAILABLE',
      capacityReceiptAvailable
    )
  );

  const capacityPreflightAvailable =
    isPlainObject(
      CAPACITY_PREFLIGHT
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CAPACITY_PREFLIGHT_AVAILABLE',
      capacityPreflightAvailable
    )
  );

  const bindingIdentityAligned =
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.activeCell ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.activeCell &&
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.spatialCellId ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.spatialCellId &&
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.sceneIdentity ===
      H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_BINDING_IDENTITY_ALIGNED',
      bindingIdentityAligned
    )
  );

  const coordinateFrameAligned =
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY.coordinateFrame ===
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame;

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_COORDINATE_FRAME_ALIGNED',
      coordinateFrameAligned
    )
  );

  const worldBoundsAvailable =
    isPlainObject(
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_WORLD_BOUNDS_AVAILABLE',
      worldBoundsAvailable
    )
  );

  const requiredSubstrateDescriptorsPresent = [
    H_EARTH_3D_GROUND_SUBSTRATE,
    H_EARTH_3D_SHORELINE_MODEL,
    H_EARTH_3D_WATER_SUBSTRATE,
    H_EARTH_3D_ATMOSPHERE_MODEL,
    H_EARTH_3D_BACKGROUND_CONTEXT,
    H_EARTH_3D_INSPECTION_ANCHOR,
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE
  ].every(
    isPlainObject
  );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_REQUIRED_SUBSTRATE_DESCRIPTORS_PRESENT',
      requiredSubstrateDescriptorsPresent
    )
  );

  const wetSandNumericProfileEvaluation =
    evaluateHEarth3DWetSandNumericConstructionProfile();

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_WET_SAND_NUMERIC_PROFILE_ELIGIBLE',
      wetSandNumericProfileEvaluation.eligible,
      wetSandNumericProfileEvaluation
    )
  );

  const materialKeysPresent =
    REQUIRED_MATERIAL_KEYS.every(
      (key) =>
        isPlainObject(
          H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES[
            key
          ]
        ) &&
        isNonEmptyString(
          H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES[
            key
          ].id
        )
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_REQUIRED_MATERIAL_KEYS_PRESENT',
      materialKeysPresent,
      REQUIRED_MATERIAL_KEYS
    )
  );

  const primitivePlanEvaluation =
    evaluateHEarth3DEnvironmentPrimitivePlan();

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_PRIMITIVE_PLAN_ELIGIBLE',
      primitivePlanEvaluation.eligible,
      primitivePlanEvaluation
    )
  );

  const capacityAlignmentEvaluation =
    evaluateHEarth3DEnvironmentCapacityAlignment();

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CAPACITY_ALIGNMENT_ELIGIBLE',
      capacityAlignmentEvaluation.eligible,
      capacityAlignmentEvaluation
    )
  );

  const handoffEvaluation =
    evaluateHEarth3DEnvironmentHandoff();

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_HANDOFF_ELIGIBLE',
      handoffEvaluation.eligible,
      handoffEvaluation
    )
  );

  const claimCeilingsPreserved =
    Object.values(
      H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
    ).every(
      (value) => value === false
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CLAIM_CEILINGS_PRESERVED',
      claimCeilingsPreserved
    )
  );

  for (const check of checks) {
    if (!check.passed) {
      issues.push(
        createEnvironmentIssue(
          'ENVIRONMENT_PREFLIGHT_CHECK_FAILED',
          `Environment preflight check ${check.id} failed.`,
          check.details
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
        ? 'FRAME_BASED_ENVIRONMENT_PREFLIGHT_ELIGIBLE'
        : 'FRAME_BASED_ENVIRONMENT_PREFLIGHT_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    wetSandNumericProfileEvaluation,
    primitivePlanEvaluation,
    capacityAlignmentEvaluation,
    handoffEvaluation,

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
 * Static environment receipt.
 */
export const H_EARTH_3D_ENVIRONMENT_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_FRAME_BASED_GROUND_CELL_001_ENVIRONMENT_SUBSTRATE_RECEIPT',

  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  renewsContractId:
    'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v1',

  file:
    '/showroom/globe/h-earth/environment.js',

  capacityContractConsumed: true,
  capacityBindingIdentityConsumed: true,
  capacityWorldBoundsConsumed: true,
  renderStageLimitsConsumed: true,
  nodeBudgetEvaluatorConsumed: true,
  renderFrameCapacityContextConsumed: true,

  environmentTierIdentityDefined: true,
  environmentTierOrderDefined: true,
  materialIdentityDefined: true,

  groundSubstrateDefined: true,
  shorelineModelDefined: true,
  waterSubstrateDefined: true,
  atmosphereModelDefined: true,

  tidePoolDescriptorsDefined: true,
  stoneDescriptorsDefined: true,
  jaggedRockDescriptorsDefined: true,

  backgroundContextDefined: true,
  inspectionAnchorDefined: true,
  actorReadyGroundCandidateDefined: true,

  wetSandNumericConstructionProfileDefined: true,
  packet001SemanticResolutionConsumedHere: false,
  packet001SemanticResolutionRequiredBeforeProviderTranslation: true,

  primitivePlanDefined: true,

  canonicalPrimitiveCountField:
    'estimatedEnvironmentPrimitiveCount',

  estimatedEnvironmentPrimitiveCount:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
      .estimatedEnvironmentPrimitiveCount,

  capacityAlignmentDefined: true,
  compositorReadyHandoffDefined: true,

  preflightStatus:
    H_EARTH_3D_ENVIRONMENT_PREFLIGHT.status,

  preflightEligible:
    H_EARTH_3D_ENVIRONMENT_PREFLIGHT.eligible,

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  compositorFrameConstructionVerified: false,
  rendererFrameConsumptionVerified: false,
  controllerIntentDispatchVerified: false,
  routeIntegrationVerified: false,
  rendererMountVerified: false,
  visualOutputInspected: false,
  providerInvocationVerified: false,
  geometryConstructionVerified: false,
  WestAdmissionVerified: false,

  nextRequired:
    'RESOLVE_PACKET_001_SEMANTIC_RESULT_THEN_TRANSLATE_ENVIRONMENT_NUMERIC_PROFILE_INTO_GEOMETRY_GROUND_PROVIDER_CALL_SURFACE',

  ...H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
});

/**
 * Complete environment contract.
 */
export const H_EARTH_3D_ENVIRONMENT_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION,

  renewsContractId:
    'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v1',

  file:
    '/showroom/globe/h-earth/environment.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'FRAME_BASED_GROUND_CELL_001_SUBSTRATE_PROVIDER',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  bindingIdentity:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,

  sourceRequirements:
    H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS,

  tierIds:
    H_EARTH_3D_ENVIRONMENT_TIER_IDS,

  tierOrder:
    H_EARTH_3D_ENVIRONMENT_TIER_ORDER,

  tiers:
    H_EARTH_3D_ENVIRONMENT_TIERS,

  materialIdentities:
    H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,

  groundSubstrate:
    H_EARTH_3D_GROUND_SUBSTRATE,

  shorelineModel:
    H_EARTH_3D_SHORELINE_MODEL,

  waterSubstrate:
    H_EARTH_3D_WATER_SUBSTRATE,

  atmosphereModel:
    H_EARTH_3D_ATMOSPHERE_MODEL,

  tidePoolDescriptors:
    H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

  stoneDescriptors:
    H_EARTH_3D_STONE_DESCRIPTORS,

  jaggedRockDescriptors:
    H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

  backgroundContext:
    H_EARTH_3D_BACKGROUND_CONTEXT,

  inspectionAnchor:
    H_EARTH_3D_INSPECTION_ANCHOR,

  actorReadyGroundCandidate:
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,

  wetSandNumericConstructionProfile:
    H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,

  primitivePlan:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN,

  frameCapacityAlignment:
    H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT,

  compositorHandoff:
    H_EARTH_3D_ENVIRONMENT_HANDOFF,

  preflight:
    H_EARTH_3D_ENVIRONMENT_PREFLIGHT,

  boundaryFlags:
    H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS,

  claimCeilings:
    H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
});

export function getHEarth3DEnvironmentContract() {
  return H_EARTH_3D_ENVIRONMENT_CONTRACT;
}

export function getHEarth3DEnvironmentReceipt() {
  return H_EARTH_3D_ENVIRONMENT_RECEIPT;
}

export function getHEarth3DEnvironmentHandoff() {
  return H_EARTH_3D_ENVIRONMENT_HANDOFF;
}

export function getHEarth3DEnvironmentPreflight() {
  return H_EARTH_3D_ENVIRONMENT_PREFLIGHT;
}

export function getHEarth3DWetSandNumericConstructionProfile() {
  return H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE;
}

export default H_EARTH_3D_ENVIRONMENT_CONTRACT;
