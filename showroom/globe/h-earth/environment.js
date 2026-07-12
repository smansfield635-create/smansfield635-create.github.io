/**
 * /showroom/globe/h-earth/environment.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v1
 *
 * Renews:
 * H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_PRECHECK_GROUND_CELL_001_SUBSTRATE_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Role:
 * FRAME_BASED_GROUND_CELL_001_SUBSTRATE_PROVIDER
 *
 * Purpose:
 * Define the bounded Ground Cell 001 environmental substrate consumed by the
 * frame-based H-Earth compositor.
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
 * - environment-to-compositor handoff
 * - environment receipts and claim ceilings
 *
 * This file does not own:
 * - Path 3 authority
 * - matrix authority
 * - Ground Cell binding admission
 * - boundary, object, zone, or landscape-lattice truth
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
  'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v1';

export const H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION = 2;

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
  checks.every(
    (check) =>
      check.passed === true
  );

const CAPACITY_CONTRACT =
  getHEarth3DCapacityContract();

const CAPACITY_RECEIPT =
  getHEarth3DCapacityReceipt();

const CAPACITY_PREFLIGHT =
  getHEarth3DCapacityPreflight();

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
      'claim ceilings'
    ])
  }),

  acceptedSourceSpine: deepFreeze({
    groundCell: deepFreeze({
      role:
        'GROUND_CELL',

      expectedPath:
        '/h-earth-3d/cells/ground-cell-001.js',

      expectedId:
        'H_EARTH_GROUND_CELL_001',

      directlyImported: false
    }),

    boundaries: deepFreeze({
      role:
        'BOUNDARIES',

      expectedPath:
        '/h-earth-3d/boundaries/matrix-boundaries.js',

      expectedStep:
        'STEP_034I',

      directlyImported: false
    }),

    objects: deepFreeze({
      role:
        'OBJECTS',

      expectedPath:
        '/h-earth-3d/objects/ground-cell-001.objects.js',

      expectedStep:
        'STEP_034J',

      directlyImported: false
    }),

    zones: deepFreeze({
      role:
        'ZONES',

      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.zones.js',

      expectedStep:
        'STEP_034K',

      directlyImported: false
    }),

    landscapeLattice: deepFreeze({
      role:
        'LANDSCAPE_LATTICE',

      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

      expectedStep:
        'STEP_034L',

      directlyImported: false
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

    required:
      true,

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

    required:
      true,

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

    required:
      true,

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

    required:
      true,

    members: deepFreeze([
      'INSPECTION_ANCHOR',
      'ACTOR_READY_GROUND_CANDIDATE'
    ])
  }),

  excludedExpansion: deepFreeze({
    id:
      'H_EARTH_ENVIRONMENT_TIER_EXCLUDED_EXPANSION',

    required:
      false,

    admitted:
      false,

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

const createMaterialIdentity = ({
  id,
  label,
  semanticRole,
  materialClass,
  opacityPolicy,
  surfaceResponse,
  rendererPresentationHints = {}
}) =>
  deepFreeze({
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

/**
 * Material identities.
 */
export const H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES = deepFreeze({
  sky: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_SKY',

    label:
      'H-Earth sky',

    semanticRole:
      'SKY',

    materialClass:
      'BACKGROUND_ATMOSPHERE',

    opacityPolicy:
      'OPAQUE_BACKGROUND',

    surfaceResponse:
      'NON_SURFACE_BACKGROUND',

    rendererPresentationHints: {
      gradientPermitted: true,
      fullStageCoverageCandidate: true,
      depthSortWithinLayer: false
    }
  }),

  atmosphere: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_ATMOSPHERE',

    label:
      'H-Earth atmosphere',

    semanticRole:
      'ATMOSPHERE',

    materialClass:
      'ATMOSPHERIC_OVERLAY',

    opacityPolicy:
      'TRANSLUCENT',

    surfaceResponse:
      'DISTANCE_HAZE',

    rendererPresentationHints: {
      fullStageOverlayCandidate: true,
      pointerEventsNone: true
    }
  }),

  haze: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_HAZE',

    label:
      'H-Earth horizon haze',

    semanticRole:
      'HORIZON_HAZE',

    materialClass:
      'DISTANCE_HAZE',

    opacityPolicy:
      'TRANSLUCENT',

    surfaceResponse:
      'HORIZON_SOFTENING',

    rendererPresentationHints: {
      horizontalBandCandidate: true,
      pointerEventsNone: true
    }
  }),

  islet: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_OFFSHORE_ISLET',

    label:
      'Offshore islet',

    semanticRole:
      'OFFSHORE_ISLET',

    materialClass:
      'DISTANT_SOLID_CONTEXT',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'ROCK_SILHOUETTE',

    rendererPresentationHints: {
      polygonCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  manorContext: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_MANOR_CONTEXT',

    label:
      'Manor and bluff context',

    semanticRole:
      'MANOR_BLUFF_CONTEXT',

    materialClass:
      'DISTANT_ARCHITECTURAL_CONTEXT',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'DISTANT_SILHOUETTE',

    rendererPresentationHints: {
      clusteredPrimitiveCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  openWater: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_OPEN_WATER',

    label:
      'Open water',

    semanticRole:
      'OPEN_WATER',

    materialClass:
      'WATER_SURFACE',

    opacityPolicy:
      'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',

    surfaceResponse:
      'DISTANT_WATER_SURFACE',

    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      horizontalContinuityPreferred: true
    }
  }),

  nearshoreWater: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_NEARSHORE_WATER',

    label:
      'Nearshore water',

    semanticRole:
      'NEARSHORE_WATER',

    materialClass:
      'WATER_SURFACE',

    opacityPolicy:
      'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',

    surfaceResponse:
      'SHALLOW_WATER_SURFACE',

    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      shorelineContactRequired: true
    }
  }),

  wave: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_WAVE',

    label:
      'Wave band',

    semanticRole:
      'WAVE_BAND',

    materialClass:
      'WATER_RIBBON',

    opacityPolicy:
      'TRANSLUCENT',

    surfaceResponse:
      'WAVE_HIGHLIGHT',

    rendererPresentationHints: {
      projectedCurveRibbonCandidate: true,
      pointerEventsNone: true
    }
  }),

  foam: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_FOAM',

    label:
      'Shoreline foam',

    semanticRole:
      'FOAM_CONTACT',

    materialClass:
      'SHORELINE_CONTACT_RIBBON',

    opacityPolicy:
      'TRANSLUCENT_TO_OPAQUE',

    surfaceResponse:
      'FOAM_CONTACT',

    rendererPresentationHints: {
      projectedCurveRibbonCandidate: true,
      shorelineAlignmentRequired: true
    }
  }),

  wetSand: createMaterialIdentity({
    id:
      'H_EARTH_WET_SAND_DOMAIN',

    label:
      'Wet sand',

    semanticRole:
      'WET_SAND',

    materialClass:
      'GROUND_SURFACE',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'DAMP_REFLECTIVE_GROUND',

    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      inspectionGroundCandidate: true
    }
  }),

  drySand: createMaterialIdentity({
    id:
      'H_EARTH_DRY_SAND_DOMAIN',

    label:
      'Dry sand',

    semanticRole:
      'DRY_SAND',

    materialClass:
      'GROUND_SURFACE',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'DRY_DIFFUSE_GROUND',

    rendererPresentationHints: {
      projectedSurfaceBandCandidate: true,
      transitionGroundCandidate: true
    }
  }),

  tidePool: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_TIDE_POOL',

    label:
      'Tide pool',

    semanticRole:
      'TIDE_POOL',

    materialClass:
      'GROUND_EMBEDDED_WATER',

    opacityPolicy:
      'TRANSLUCENT',

    surfaceResponse:
      'SHALLOW_REFLECTIVE_WATER',

    rendererPresentationHints: {
      projectedEllipseCandidate: true,
      groundEmbedded: true
    }
  }),

  stone: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_STONE',

    label:
      'Beach stone',

    semanticRole:
      'STONE',

    materialClass:
      'GROUNDED_DETAIL',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'SMOOTH_STONE',

    rendererPresentationHints: {
      groundedDetailCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  rock: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_JAGGED_ROCK',

    label:
      'Jagged rock',

    semanticRole:
      'JAGGED_ROCK',

    materialClass:
      'GROUNDED_DETAIL',

    opacityPolicy:
      'OPAQUE',

    surfaceResponse:
      'FACETED_ROCK',

    rendererPresentationHints: {
      polygonCandidate: true,
      cameraDepthSortPermitted: true
    }
  }),

  inspectionAnchor: createMaterialIdentity({
    id:
      'H_EARTH_MATERIAL_INSPECTION_ANCHOR',

    label:
      'Inspection anchor',

    semanticRole:
      'INSPECTION_ANCHOR',

    materialClass:
      'INTERACTION_TARGET',

    opacityPolicy:
      'RENDERER_SELECTED',

    surfaceResponse:
      'NON_PHYSICAL_INTERACTION_TARGET',

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

  continuityRequired:
    true,

  groundContactProofProvided:
    false,

  domains: deepFreeze({
    wetSand: deepFreeze({
      id:
        'H_EARTH_GROUND_WET_SAND_FIELD',

      objectId:
        'OBJ_002_FOREGROUND_WET_SAND',

      primaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      latticeRows:
        'R01-R05',

      role:
        'PRIMARY_FOREGROUND_INSPECTION_GROUND',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,

      surfaceFamily:
        'wetSand'
    }),

    drySand: deepFreeze({
      id:
        'H_EARTH_GROUND_DRY_SAND_TRANSITION',

      objectId:
        'OBJ_003_DRY_SAND_TRANSITION',

      primaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      latticeRows:
        'R06-R07',

      role:
        'DRY_WET_TRANSITION_GROUND',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.drySand.id,

      surfaceFamily:
        'drySand'
    })
  }),

  transition: deepFreeze({
    id:
      'H_EARTH_GROUND_DRY_WET_TRANSITION',

    from:
      'WET_SAND',

    to:
      'DRY_SAND',

    boundaryClass:
      'GRADUAL_SHORELINE_GROUND_TRANSITION',

    abruptSeamRequired:
      false
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

  latticeRows:
    'R08-R09',

  shorelineContact: deepFreeze({
    id:
      'H_EARTH_SHORELINE_CONTACT_FIELD',

    role:
      'WATER_GROUND_CONTACT_DESCRIPTOR',

    groundContactProofProvided:
      false,

    physicalFluidBoundaryProvided:
      false
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

    hardBoundary:
      false
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
      id:
        'H_EARTH_WAVE_BAND_001',

      sourceObjectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,

      role:
        'PRIMARY_NEARSHORE_WAVE_BAND'
    }),

    deepFreeze({
      id:
        'H_EARTH_WAVE_BAND_002',

      sourceObjectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wave.id,

      role:
        'SECONDARY_NEARSHORE_WAVE_BAND'
    }),

    deepFreeze({
      id:
        'H_EARTH_WAVE_BAND_003',

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

    latticeRows:
      'R08-R09',

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

    latticeRows:
      'R08-R09',

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

    latticeRows:
      'R08-R09',

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

    latticeRows:
      'R14-R15',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.manorContext.id,

    role:
      'DISTANT_MANOR_AND_BLUFF_CONTEXT',

    detailedArchitectureAdmitted:
      false
  }),

  offshoreIslets: deepFreeze([
    deepFreeze({
      id:
        'H_EARTH_OFFSHORE_ISLET_001',

      sourceFamily:
        'OFFSHORE_ROCK_STACKS_AND_ISLETS',

      primaryZoneId:
        'ZONE_005_OFFSHORE_CONTEXT_ZONE',

      latticeRows:
        'R14-R15',

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

      latticeRows:
        'R14-R15',

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

  latticeRows:
    'R01-R05',

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

  actionExecutionOwnedHere:
    false,

  readoutConstructionOwnedHere:
    false,

  receiptIssuanceOwnedHere:
    false
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

  continuousGroundRequired:
    true,

  actorCreated:
    false,

  actorReadyClaim:
    false,

  collisionCreated:
    false,

  groundContactProven:
    false,

  traversalActivated:
    false
});

/**
 * Primitive accounting.
 *
 * estimatedEnvironmentPrimitiveCount remains the canonical count field.
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

  semanticLayerContainerEstimate:
    15,

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

/**
 * Environment primitive-plan evaluation.
 */
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

        environmentPrimitives:
          count,

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

    worldBoundsReferenced:
      true,

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

    compositorFrameProviderRolePreserved:
      true,

    rendererProjectionBoundaryPreserved:
      true,

    controllerIntentBoundaryPreserved:
      true,

    compositorFrameConstructed:
      false,

    rendererFrameConsumed:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false
  });

/**
 * Evaluates environment/capacity alignment.
 */
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
      .filter(
        (check) =>
          !check.passed
      )
      .map(
        (check) =>
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

/**
 * Evaluates the compositor-ready environment handoff.
 */
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
    'primitivePlan',
    'frameCapacityAlignment',
    'compositorRules',
    'rendererRules',
    'controllerRules',
    'claimCeilings'
  ];

  for (
    const field
    of requiredObjectFields
  ) {
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

  for (
    const field
    of requiredArrayFields
  ) {
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
      (value) =>
        value === false
    );

  checks.push(
    createEnvironmentCheck(
      'ENVIRONMENT_CLAIM_CEILINGS_PRESERVED',
      claimCeilingsPreserved
    )
  );

  for (
    const check
    of checks
  ) {
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
    'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_PRECHECK_GROUND_CELL_001_SUBSTRATE_v1',

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

  nextRequired:
    'BACK_UP_RENEWED_ENVIRONMENT_THEN_FINALIZE_COMPOSITOR_AGAINST_CAPACITY_AND_ENVIRONMENT',

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
    'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_PRECHECK_GROUND_CELL_001_SUBSTRATE_v1',

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

/**
 * Returns the immutable environment contract.
 */
export function getHEarth3DEnvironmentContract() {
  return H_EARTH_3D_ENVIRONMENT_CONTRACT;
}

/**
 * Returns the immutable environment receipt.
 */
export function getHEarth3DEnvironmentReceipt() {
  return H_EARTH_3D_ENVIRONMENT_RECEIPT;
}

/**
 * Returns the immutable environment-to-compositor handoff.
 */
export function getHEarth3DEnvironmentHandoff() {
  return H_EARTH_3D_ENVIRONMENT_HANDOFF;
}

/**
 * Returns the static frame-based environment preflight.
 */
export function getHEarth3DEnvironmentPreflight() {
  return H_EARTH_3D_ENVIRONMENT_PREFLIGHT;
}

export default H_EARTH_3D_ENVIRONMENT_CONTRACT;
