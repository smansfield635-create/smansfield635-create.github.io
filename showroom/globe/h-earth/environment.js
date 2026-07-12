/**
 * /showroom/globe/h-earth/environment.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_PRECHECK_GROUND_CELL_001_SUBSTRATE_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Purpose:
 * Define the bounded Ground Cell 001 environmental substrate consumed by the
 * renewed Layer 4 compositor.
 *
 * Controlling source truth:
 * - Accepted H-Earth Layers 1–3.
 * - Accepted Path 3 → /h-earth-3d/ binding chain.
 * - H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001.
 * - Step 034I boundaries.
 * - Step 034J objects.
 * - Step 034K zones.
 * - Step 034L landscape lattice.
 * - Renewed Layer 4 capacity contract.
 *
 * This file owns:
 * - Ground Cell 001 environmental meaning.
 * - Continuous substrate descriptors.
 * - Dry-sand and wet-sand domains.
 * - Shoreline and foam-contact descriptors.
 * - Nearshore and open-water descriptors.
 * - Atmosphere and horizon descriptors.
 * - Minimal grounded-detail admission.
 * - Simplified background-context admission.
 * - Inspection-anchor environmental eligibility.
 * - Environment-to-compositor handoff.
 * - Conservative environment receipts.
 *
 * This file does not own:
 * - Path 3 or matrix authority.
 * - Ground Cell binding admission.
 * - Global coordinate constitution.
 * - Camera projection.
 * - Semantic render order.
 * - DOM or CSS3D construction.
 * - Renderer mounting.
 * - Controller behavior.
 * - Actor creation.
 * - Collision.
 * - Ground-contact proof.
 * - Fluid simulation.
 * - Visual-pass judgment.
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
  getHEarth3DCapacityReceipt
} from './capacity.js';

export const H_EARTH_3D_ENVIRONMENT_CONTRACT_ID =
  'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_PRECHECK_GROUND_CELL_001_SUBSTRATE_v1';

export const H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION = 1;

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

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const isFiniteNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value);

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

const approximatelyEqual = (
  left,
  right,
  tolerance = 0.000001
) =>
  Math.abs(left - right) <= tolerance;

const CAPACITY_CONTRACT =
  getHEarth3DCapacityContract();

const CAPACITY_RECEIPT =
  getHEarth3DCapacityReceipt();

const CAPACITY_WORLD_BOUNDS =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.bounds;

const CAPACITY_SPAN =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.span;

/**
 * Environment boundary flags.
 */
export const H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS = deepFreeze({
  ownsEnvironmentMeaning: true,
  ownsEnvironmentSubstrateDescriptors: true,
  ownsMaterialIdentityDescriptors: true,
  ownsMinimalDetailAdmission: true,
  ownsBackgroundContextAdmission: true,
  ownsInspectionEnvironmentalEligibility: true,

  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsCoordinateConstitution: false,
  ownsLandscapeLatticeAuthority: false,

  ownsCameraProjection: false,
  ownsSemanticLayerOrder: false,
  ownsRendererGeometry: false,
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
 * Binding identity consumed from the renewed capacity contract.
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

  sceneIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY.sceneIdentity,

  acceptedSourceBindingRecorded:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .bindingChainAcceptedForSourceIdentity,

  descriptorOnly: true,

  rendererExecutionAuthorized: false,
  runtimeActivationAuthorized: false
});

/**
 * Source-spine requirements.
 *
 * Exact source-module export consumption remains subject to installed-source
 * verification. This renewed environment contract records the required
 * authorities without fabricating import names that have not been bound.
 */
export const H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS = deepFreeze({
  capacity: deepFreeze({
    path:
      '/showroom/globe/h-earth/capacity.js',

    contractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    consumedByCurrentModule: true
  }),

  acceptedBindingChain: deepFreeze({
    regionPreflight:
      '/showroom/globe/h-earth/region-domain-consumer-preflight.js',

    matrix:
      '/h-earth-3d/h-earth.matrix.js',

    groundCell:
      '/h-earth-3d/cells/ground-cell-001.js',

    integrity:
      '/h-earth-3d/h-earth.integrity.js',

    bindingExpression:
      'H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001'
  }),

  publicStageSourceSpine: deepFreeze({
    step034I: deepFreeze({
      role: 'BOUNDARIES',
      expectedPath:
        '/h-earth-3d/boundaries/matrix-boundaries.js',

      requiredForEnvironmentAdmission: true,
      directInstalledExportVerified: false
    }),

    step034J: deepFreeze({
      role: 'OBJECTS',
      expectedPath:
        '/h-earth-3d/objects/ground-cell-001.objects.js',

      requiredForEnvironmentAdmission: true,
      directInstalledExportVerified: false
    }),

    step034K: deepFreeze({
      role: 'ZONES',
      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.zones.js',

      requiredForEnvironmentAdmission: true,
      directInstalledExportVerified: false
    }),

    step034L: deepFreeze({
      role: 'LANDSCAPE_LATTICE',

      expectedPath:
        '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

      expectedContractId:
        'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1',

      requiredForEnvironmentAdmission: true,
      directInstalledExportVerified: false
    })
  }),

  sourcePolicy: deepFreeze({
    environmentMayNormalizeAdmittedDescriptors: true,
    environmentMayCreateSourceAuthority: false,
    environmentMayInventLatticeIdentity: false,
    environmentMayInventBoundaryIdentity: false,
    environmentMayInventZoneIdentity: false,
    environmentMayInventObjectMembership: false
  })
});

/**
 * Environment-standard tier model.
 */
export const H_EARTH_3D_ENVIRONMENT_TIERS = deepFreeze({
  tier1: deepFreeze({
    id: 'ENVIRONMENT_SUBSTRATE',
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

  tier2: deepFreeze({
    id: 'MINIMAL_GROUNDED_DETAILS',
    required: true,

    members: deepFreeze([
      'TIDE_POOLS',
      'STONES',
      'JAGGED_ROCKS',
      'INSPECTION_ANCHOR'
    ]),

    detailDensity: 'SPARSE'
  }),

  tier3: deepFreeze({
    id: 'SIMPLIFIED_BACKGROUND_CONTEXT',
    required: true,

    members: deepFreeze([
      'MANOR_BLUFF_CONTEXT',
      'OFFSHORE_ISLETS'
    ]),

    detailDensity: 'SILHOUETTE_ONLY'
  }),

  tier4: deepFreeze({
    id: 'DEFERRED_REFINEMENT',
    required: false,

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
 * Ground Cell 001 environmental material identities.
 *
 * These are semantic material identities. They do not define final CSS,
 * shaders, images, textures, or rendering techniques.
 */
export const H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES = deepFreeze({
  sky: deepFreeze({
    id: 'H_EARTH_MATERIAL_SKY',
    semanticRole: 'SKY'
  }),

  atmosphere: deepFreeze({
    id: 'H_EARTH_MATERIAL_ATMOSPHERE',
    semanticRole: 'ATMOSPHERIC_DEPTH'
  }),

  haze: deepFreeze({
    id: 'H_EARTH_MATERIAL_HAZE',
    semanticRole: 'DISTANCE_COMPRESSION'
  }),

  drySand: deepFreeze({
    id: 'H_EARTH_MATERIAL_DRY_SAND',
    semanticRole: 'DRY_GROUND'
  }),

  wetSand: deepFreeze({
    id: 'H_EARTH_MATERIAL_WET_SAND',
    semanticRole: 'WET_GROUND'
  }),

  foam: deepFreeze({
    id: 'H_EARTH_MATERIAL_FOAM',
    semanticRole: 'SHORELINE_CONTACT'
  }),

  nearshoreWater: deepFreeze({
    id: 'H_EARTH_MATERIAL_NEARSHORE_WATER',
    semanticRole: 'NEARSHORE_WATER'
  }),

  openWater: deepFreeze({
    id: 'H_EARTH_MATERIAL_OPEN_WATER',
    semanticRole: 'OPEN_WATER'
  }),

  wave: deepFreeze({
    id: 'H_EARTH_MATERIAL_WAVE',
    semanticRole: 'WAVE_BAND'
  }),

  tidePool: deepFreeze({
    id: 'H_EARTH_MATERIAL_TIDE_POOL',
    semanticRole: 'GROUND_ATTACHED_WATER_DETAIL'
  }),

  stone: deepFreeze({
    id: 'H_EARTH_MATERIAL_STONE',
    semanticRole: 'GROUNDED_STONE'
  }),

  rock: deepFreeze({
    id: 'H_EARTH_MATERIAL_JAGGED_ROCK',
    semanticRole: 'GROUNDED_ROCK'
  }),

  bluff: deepFreeze({
    id: 'H_EARTH_MATERIAL_BLUFF',
    semanticRole: 'BACKGROUND_TERRAIN_CONTEXT'
  }),

  manorContext: deepFreeze({
    id: 'H_EARTH_MATERIAL_MANOR_CONTEXT',
    semanticRole: 'DISTANT_MANOR_CONTEXT'
  }),

  islet: deepFreeze({
    id: 'H_EARTH_MATERIAL_OFFSHORE_ISLET',
    semanticRole: 'DISTANT_OFFSHORE_CONTEXT'
  }),

  inspectionAnchor: deepFreeze({
    id: 'H_EARTH_MATERIAL_INSPECTION_ANCHOR',
    semanticRole: 'INSPECTION_REFERENCE'
  })
});

/**
 * Continuous ground model.
 *
 * This defines environmental domains and relationships only. The renderer
 * decides how these domains become projected polygons.
 */
export const H_EARTH_3D_GROUND_SUBSTRATE = deepFreeze({
  id: 'H_EARTH_GROUND_CELL_001_CONTINUOUS_GROUND_SUBSTRATE',

  model: 'CONTINUOUS_BOUNDED_SAND_SYSTEM',

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  localGroundDatumY:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.localGroundDatumY,

  domain: deepFreeze({
    xMin: CAPACITY_WORLD_BOUNDS.xMin,
    xMax: CAPACITY_WORLD_BOUNDS.xMax,

    zMin: -2,
    zMax: 14.25
  }),

  drySand: deepFreeze({
    id: 'H_EARTH_DRY_SAND_DOMAIN',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .drySand
        .id,

    xMin: CAPACITY_WORLD_BOUNDS.xMin,
    xMax: CAPACITY_WORLD_BOUNDS.xMax,

    zMin: -2,
    zMax: 7.75,

    transitionOverlap: deepFreeze({
      zMin: 6.25,
      zMax: 7.75
    })
  }),

  wetSand: deepFreeze({
    id: 'H_EARTH_WET_SAND_DOMAIN',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .wetSand
        .id,

    xMin: CAPACITY_WORLD_BOUNDS.xMin,
    xMax: CAPACITY_WORLD_BOUNDS.xMax,

    zMin: 6.25,
    zMax: 14.25,

    transitionOverlap: deepFreeze({
      zMin: 6.25,
      zMax: 7.75
    })
  }),

  elevationModel: deepFreeze({
    modelId:
      'H_EARTH_GROUND_CELL_001_SHALLOW_SURFACE_CANDIDATE',

    baseElevationY: 0,

    minimumCandidateElevationY: -0.18,
    maximumCandidateElevationY: 0.12,

    rendererMaySampleElevation: true,
    environmentDefinesExactMesh: false,

    collisionSurfaceClaim: false,
    groundContactSurfaceClaim: false
  }),

  continuityRequirements: deepFreeze({
    dryWetDomainsMustOverlap: true,
    visibleHardSeamPermitted: false,
    floatingGroundCardsPermitted: false,
    independentScreenPlacementPermitted: false
  }),

  actorCandidateRelationship: deepFreeze({
    maySupportActorReadyGroundCandidateLater: true,
    actorReadyGroundDefinedNow: false,
    groundContactProven: false,
    collisionProven: false
  })
});

/**
 * Shoreline model.
 */
export const H_EARTH_3D_SHORELINE_MODEL = deepFreeze({
  id: 'H_EARTH_GROUND_CELL_001_SHORELINE_MODEL',

  model:
    'BOUNDED_WORLD_SPACE_SHORELINE_PROFILE',

  xMin: CAPACITY_WORLD_BOUNDS.xMin,
  xMax: CAPACITY_WORLD_BOUNDS.xMax,

  nominalDepthZ: 13.25,

  permittedDepthRange: deepFreeze({
    zMin: 12.35,
    zMax: 14.15
  }),

  profileCapacity: deepFreeze({
    primaryAmplitudeMaximum: 0.65,
    secondaryAmplitudeMaximum: 0.3,

    minimumSampleCount: 17,
    preferredSampleCount: 33,
    maximumSampleCount: 49
  }),

  foamContact: deepFreeze({
    id: 'H_EARTH_SHORELINE_FOAM_CONTACT',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .foam
        .id,

    model: 'CONTINUOUS_SHORELINE_RIBBON',

    minimumWidth: 0.35,
    preferredWidth: 0.7,
    maximumWidth: 1.1,

    attachedToShoreline: true,
    independentFoamCardsPermitted: false
  }),

  fluidSimulationClaim: false,
  shorelinePhysicsClaim: false,
  tideSimulationClaim: false
});

/**
 * Water substrate.
 */
export const H_EARTH_3D_WATER_SUBSTRATE = deepFreeze({
  id: 'H_EARTH_GROUND_CELL_001_WATER_SUBSTRATE',

  waterDatumY: -0.18,

  nearshore: deepFreeze({
    id: 'H_EARTH_NEARSHORE_WATER_DOMAIN',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .nearshoreWater
        .id,

    zMin: 13.35,
    zMax: 19.25,

    xMin: CAPACITY_WORLD_BOUNDS.xMin,
    xMax: CAPACITY_WORLD_BOUNDS.xMax,

    shorelineOverlapMinimum: 0.1,
    openWaterOverlap: deepFreeze({
      zMin: 18,
      zMax: 19.25
    })
  }),

  openWater: deepFreeze({
    id: 'H_EARTH_OPEN_WATER_DOMAIN',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .openWater
        .id,

    zMin: 18,
    zMax: CAPACITY_WORLD_BOUNDS.zMax,

    xMin: CAPACITY_WORLD_BOUNDS.xMin,
    xMax: CAPACITY_WORLD_BOUNDS.xMax
  }),

  waveBands: deepFreeze({
    id: 'H_EARTH_BASIC_WAVE_BANDS',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .wave
        .id,

    count: 2,

    depthCandidates: deepFreeze([
      15.2,
      17.4
    ]),

    minimumRibbonWidth: 0.1,
    preferredRibbonWidth: 0.18,
    maximumRibbonWidth: 0.32,

    decorativeOnly: true,
    simulationClaim: false
  }),

  traversal: deepFreeze({
    swimmingAuthorized: false,
    waterTraversalAuthorized: false,
    actorWaterContactProven: false
  }),

  simulation: deepFreeze({
    fluidSimulation: false,
    buoyancySimulation: false,
    wavePhysics: false,
    tidePhysics: false
  })
});

/**
 * Atmosphere and horizon context.
 */
export const H_EARTH_3D_ATMOSPHERE_MODEL = deepFreeze({
  id: 'H_EARTH_GROUND_CELL_001_ATMOSPHERE',

  sky: deepFreeze({
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .sky
        .id,

    rootBackgroundCandidate: true,
    independentBackdropCardPermitted: false
  }),

  horizon: deepFreeze({
    model:
      'FAR_WATER_AND_ATMOSPHERE_INTEGRATION',

    hardRectangularBackdropPermitted: false,

    derivedFromFarWaterEdge: true,
    derivedFromCameraProjection: true
  }),

  haze: deepFreeze({
    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .haze
        .id,

    minimumDepthZ: 18,
    maximumDepthZ: CAPACITY_WORLD_BOUNDS.zMax,

    distanceCompressionRequired: true
  }),

  overlays: deepFreeze({
    targetCount: 2,
    maximumCount: 3,

    pointerEventsPermitted: false
  }),

  atmosphericSimulationClaim: false,
  weatherSimulationClaim: false
});

/**
 * Sparse tide-pool descriptors.
 */
export const H_EARTH_3D_TIDE_POOL_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id: 'H_EARTH_TIDE_POOL_001',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .tidePool
        .id,

    center: deepFreeze({
      x: -4.5,
      z: 8.8
    }),

    radiusX: 1.1,
    radiusZ: 0.42,
    rotationDegrees: -14,

    candidateDepressionDepth: 0.07,

    attachedToGround: true,
    detailTier: 2
  }),

  deepFreeze({
    id: 'H_EARTH_TIDE_POOL_002',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .tidePool
        .id,

    center: deepFreeze({
      x: 0.7,
      z: 9.8
    }),

    radiusX: 1.35,
    radiusZ: 0.5,
    rotationDegrees: 8,

    candidateDepressionDepth: 0.08,

    attachedToGround: true,
    detailTier: 2
  }),

  deepFreeze({
    id: 'H_EARTH_TIDE_POOL_003',

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .tidePool
        .id,

    center: deepFreeze({
      x: 5.1,
      z: 11.15
    }),

    radiusX: 0.92,
    radiusZ: 0.36,
    rotationDegrees: -11,

    candidateDepressionDepth: 0.06,

    attachedToGround: true,
    detailTier: 2
  })
]);

/**
 * Sparse grounded-stone descriptors.
 */
export const H_EARTH_3D_STONE_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id: 'H_EARTH_STONE_001',
    x: -6.4,
    z: 7.5,
    radiusX: 0.24,
    radiusZ: 0.17,
    height: 0.13
  }),

  deepFreeze({
    id: 'H_EARTH_STONE_002',
    x: -2.1,
    z: 10.9,
    radiusX: 0.18,
    radiusZ: 0.13,
    height: 0.1
  }),

  deepFreeze({
    id: 'H_EARTH_STONE_003',
    x: 1.8,
    z: 8.1,
    radiusX: 0.28,
    radiusZ: 0.19,
    height: 0.16
  }),

  deepFreeze({
    id: 'H_EARTH_STONE_004',
    x: 4.3,
    z: 12.05,
    radiusX: 0.16,
    radiusZ: 0.11,
    height: 0.09
  }),

  deepFreeze({
    id: 'H_EARTH_STONE_005',
    x: 7.1,
    z: 9.45,
    radiusX: 0.22,
    radiusZ: 0.15,
    height: 0.12
  })
].map((stone) =>
  deepFreeze({
    ...stone,

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .stone
        .id,

    attachedToGround: true,
    detailTier: 2
  })
));

/**
 * Sparse jagged-rock descriptors.
 */
export const H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS = deepFreeze([
  deepFreeze({
    id: 'H_EARTH_JAGGED_ROCK_001',

    center: deepFreeze({
      x: -7.8,
      z: 9
    }),

    width: 1.15,
    depth: 0.78,
    height: 1.05,

    rotationDegrees: -8
  }),

  deepFreeze({
    id: 'H_EARTH_JAGGED_ROCK_002',

    center: deepFreeze({
      x: 3,
      z: 7.4
    }),

    width: 0.94,
    depth: 0.72,
    height: 0.88,

    rotationDegrees: 13
  }),

  deepFreeze({
    id: 'H_EARTH_JAGGED_ROCK_003',

    center: deepFreeze({
      x: 7.8,
      z: 12.25
    }),

    width: 1.2,
    depth: 0.84,
    height: 1.18,

    rotationDegrees: -5
  })
].map((rock) =>
  deepFreeze({
    ...rock,

    materialId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
        .rock
        .id,

    attachedToGround: true,
    detailTier: 2
  })
));

/**
 * Simplified background context.
 */
export const H_EARTH_3D_BACKGROUND_CONTEXT = deepFreeze({
  manorBluff: deepFreeze({
    id: 'H_EARTH_MANOR_BLUFF_CONTEXT',

    contextOnly: true,
    detailTier: 3,

    bluff: deepFreeze({
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
          .bluff
          .id,

      center: deepFreeze({
        x: 7.5,
        z: 23.25
      }),

      width: 11,
      depth: 5.5,

      baseElevationY: -0.1,
      plateauElevationY: 2.8
    }),

    manor: deepFreeze({
      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
          .manorContext
          .id,

      center: deepFreeze({
        x: 7.5,
        z: 23.8
      }),

      baseElevationY: 2.8,

      silhouetteWidth: 5.8,
      silhouetteHeight: 4.5,

      geometryDetail:
        'SIMPLIFIED_CONTEXT_SILHOUETTE',

      interiorAuthorized: false,
      traversalAuthorized: false
    }),

    primarySceneWorkload: false
  }),

  offshoreIslets: deepFreeze([
    deepFreeze({
      id: 'H_EARTH_OFFSHORE_ISLET_001',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
          .islet
          .id,

      center: deepFreeze({
        x: -9.25,
        z: 25
      }),

      width: 2,
      height: 2.7,

      contextOnly: true,
      detailTier: 3
    }),

    deepFreeze({
      id: 'H_EARTH_OFFSHORE_ISLET_002',

      materialId:
        H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
          .islet
          .id,

      center: deepFreeze({
        x: -4.9,
        z: 26.4
      }),

      width: 1.25,
      height: 1.75,

      contextOnly: true,
      detailTier: 3
    })
  ]),

  refinementDeferred: true
});

/**
 * Inspection anchor environmental eligibility.
 */
export const H_EARTH_3D_INSPECTION_ANCHOR = deepFreeze({
  id: 'H_EARTH_GROUND_INSPECTION_ANCHOR',

  actionId: 'INSPECT_GROUND',

  readoutId: 'GROUND_CONDITION_READ',

  receiptId:
    'H_EARTH_GROUND_INSPECTION_RECEIPT',

  materialId:
    H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES
      .inspectionAnchor
      .id,

  positionCandidate: deepFreeze({
    x: 0,
    z: 6.8
  }),

  radius: 0.42,

  environmentallyEligible: true,
  descriptorIntentEligible: true,
  readoutIntentEligible: true,

  liveInspectionExecuted: false,
  groundSampleExecuted: false,
  actorInteractionExecuted: false,

  collisionProof: false,
  groundContactProof: false,
  gameplayProof: false
});

/**
 * Actor-ready ground candidate envelope.
 *
 * This only narrows where a future environment-derived ground candidate may be
 * evaluated. It does not create a walkable or collidable surface.
 */
export const H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE = deepFreeze({
  status: 'CANDIDATE_ENVELOPE_ONLY',

  bounds: deepFreeze({
    xMin:
      H_EARTH_3D_ACTOR_CANDIDATE_LIMITS
        .futureCandidateEnvelope
        .xMin,

    xMax:
      H_EARTH_3D_ACTOR_CANDIDATE_LIMITS
        .futureCandidateEnvelope
        .xMax,

    zMin:
      H_EARTH_3D_ACTOR_CANDIDATE_LIMITS
        .futureCandidateEnvelope
        .zMin,

    zMax: 10
  }),

  shorelineClearanceMinimum: 1.2,

  maximumCandidateSlopeDegrees:
    H_EARTH_3D_ACTOR_CANDIDATE_LIMITS
      .futureActorCapacity
      .maximumCandidateSlopeDegrees,

  mayBeSampledByFutureRendererOrActorStep: true,

  actorReadyGroundProven: false,
  collisionProven: false,
  groundContactProven: false,
  traversalProven: false
});

/**
 * Environment primitive plan.
 */
export const H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN = deepFreeze({
  substrate: deepFreeze({
    atmosphericOverlays: 2,
    drySandBands: 3,
    wetSandBands: 4,
    foamRibbons: 1,
    nearshoreWaterBands: 3,
    openWaterBands: 4,
    waveRibbons: 2
  }),

  minimalDetails: deepFreeze({
    tidePools:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS.length,

    stones:
      H_EARTH_3D_STONE_DESCRIPTORS.length,

    jaggedRocks:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS.length,

    inspectionAnchors: 1
  }),

  backgroundContext: deepFreeze({
    manorBluffGroups: 1,

    offshoreIslets:
      H_EARTH_3D_BACKGROUND_CONTEXT
        .offshoreIslets
        .length
  }),

  estimatedEnvironmentPrimitiveCount:
    2 +
    3 +
    4 +
    1 +
    3 +
    4 +
    2 +
    H_EARTH_3D_TIDE_POOL_DESCRIPTORS.length +
    H_EARTH_3D_STONE_DESCRIPTORS.length +
    H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS.length +
    1 +
    3 +
    H_EARTH_3D_BACKGROUND_CONTEXT
      .offshoreIslets
      .length,

  withinCapacityTarget: true,

  rendererGeometryDefined: false,
  DOMNodesCreated: false
});

/**
 * Environment handoff supplied to the compositor.
 *
 * This preserves environmental meaning and tier membership without deciding
 * final visual order or projection geometry.
 */
export const H_EARTH_3D_ENVIRONMENT_HANDOFF = deepFreeze({
  handoffType:
    'H_EARTH_GROUND_CELL_001_ENVIRONMENT_TO_COMPOSITOR',

  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  bindingIdentity:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  environmentTiers:
    H_EARTH_3D_ENVIRONMENT_TIERS,

  materials:
    H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,

  substrate: deepFreeze({
    ground:
      H_EARTH_3D_GROUND_SUBSTRATE,

    shoreline:
      H_EARTH_3D_SHORELINE_MODEL,

    water:
      H_EARTH_3D_WATER_SUBSTRATE,

    atmosphere:
      H_EARTH_3D_ATMOSPHERE_MODEL
  }),

  minimalDetails: deepFreeze({
    tidePools:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

    stones:
      H_EARTH_3D_STONE_DESCRIPTORS,

    jaggedRocks:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

    inspectionAnchor:
      H_EARTH_3D_INSPECTION_ANCHOR
  }),

  backgroundContext:
    H_EARTH_3D_BACKGROUND_CONTEXT,

  actorReadyGroundCandidate:
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE,

  primitivePlan:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN,

  compositorMustDefineSemanticOrder: true,
  rendererMustDefineProjection: true,

  environmentCreatesGeometry: false,
  environmentCreatesDOM: false,
  environmentMountsRenderer: false
});

/**
 * Claim ceilings.
 */
export const H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS = deepFreeze({
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
 * Environment contract.
 */
export const H_EARTH_3D_ENVIRONMENT_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION,

  file:
    '/showroom/globe/h-earth/environment.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'GROUND_CELL_001_ENVIRONMENT_SUBSTRATE_AUTHORITY',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  capacityContract:
    H_EARTH_3D_CAPACITY_CONTRACT,

  bindingIdentity:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,

  sourceRequirements:
    H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS,

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
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN,

  compositorHandoff:
    H_EARTH_3D_ENVIRONMENT_HANDOFF,

  boundaryFlags:
    H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS,

  claimCeilings:
    H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
});

/**
 * Static environment receipt.
 */
export const H_EARTH_3D_ENVIRONMENT_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_GROUND_CELL_001_ENVIRONMENT_SUBSTRATE_RECEIPT',

  contractId:
    H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,

  file:
    '/showroom/globe/h-earth/environment.js',

  capacityContractConsumed: true,

  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  acceptedBindingIdentityConsumed: true,

  bindingExpression:
    H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY
      .bindingExpression,

  currentSourceSpineReferenced: true,

  directStep034IExportVerified: false,
  directStep034JExportVerified: false,
  directStep034KExportVerified: false,
  directStep034LExportVerified: false,

  continuousGroundSubstrateDefined: true,
  drySandDomainDefined: true,
  wetSandDomainDefined: true,
  shorelineModelDefined: true,
  foamContactDefined: true,
  waterDatumDefined: true,
  nearshoreWaterDefined: true,
  openWaterDefined: true,
  atmosphereModelDefined: true,

  minimalGroundedDetailsDefined: true,
  simplifiedBackgroundContextDefined: true,

  inspectionEnvironmentalEligibilityDefined: true,
  actorReadyGroundCandidateEnvelopeDefined: true,

  compositorHandoffDefined: true,

  semanticCompositionDefined: false,
  rendererProjectionDefined: false,
  rendererGeometryDefined: false,
  controllerBehaviorDefined: false,

  environmentPrimitiveCount:
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
      .estimatedEnvironmentPrimitiveCount,

  environmentPrimitiveBudgetTarget:
    H_EARTH_3D_NODE_BUDGET
      .environmentPrimitives
      .target,

  environmentPrimitiveBudgetMaximum:
    H_EARTH_3D_NODE_BUDGET
      .environmentPrimitives
      .maximum,

  compositorRenewalStatus:
    'REQUIRED_NEXT',

  rendererPreflightStatus:
    'NOT_COMPLETE',

  rendererMayMount: false,

  nextRequired:
    'RENEW_COMPOSITOR_JS_FROM_CURRENT_CAPACITY_AND_ENVIRONMENT_HANDOFF',

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  sourceSpineReadbackVerified: false,
  compositorConsumptionVerified: false,
  rendererConsumptionVerified: false,
  routeMountVerified: false,
  visualOutputInspected: false,

  ...H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
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
 * Returns the environment-to-compositor handoff.
 */
export function getHEarth3DEnvironmentHandoff() {
  return H_EARTH_3D_ENVIRONMENT_HANDOFF;
}

/**
 * Returns the continuous ground substrate descriptor.
 */
export function getHEarth3DGroundSubstrate() {
  return H_EARTH_3D_GROUND_SUBSTRATE;
}

/**
 * Returns the shoreline descriptor.
 */
export function getHEarth3DShorelineModel() {
  return H_EARTH_3D_SHORELINE_MODEL;
}

/**
 * Returns the water substrate descriptor.
 */
export function getHEarth3DWaterSubstrate() {
  return H_EARTH_3D_WATER_SUBSTRATE;
}

/**
 * Returns the atmosphere descriptor.
 */
export function getHEarth3DAtmosphereModel() {
  return H_EARTH_3D_ATMOSPHERE_MODEL;
}

/**
 * Returns minimal grounded-detail descriptors.
 */
export function getHEarth3DMinimalGroundedDetails() {
  return deepFreeze({
    tidePools:
      H_EARTH_3D_TIDE_POOL_DESCRIPTORS,

    stones:
      H_EARTH_3D_STONE_DESCRIPTORS,

    jaggedRocks:
      H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS,

    inspectionAnchor:
      H_EARTH_3D_INSPECTION_ANCHOR
  });
}

/**
 * Returns simplified background-context descriptors.
 */
export function getHEarth3DBackgroundContext() {
  return H_EARTH_3D_BACKGROUND_CONTEXT;
}

/**
 * Returns the actor-ready ground candidate envelope.
 */
export function getHEarth3DActorReadyGroundCandidate() {
  return H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE;
}

/**
 * Evaluates whether a local x/z point lies within the continuous ground domain.
 *
 * This is environmental-domain evaluation only. It does not prove walkability,
 * collision, or ground contact.
 */
export function evaluateHEarth3DGroundDomainPoint({
  x,
  z
} = {}) {
  if (
    !isFiniteNumber(x) ||
    !isFiniteNumber(z)
  ) {
    return deepFreeze({
      eligible: false,
      status: 'INVALID_GROUND_DOMAIN_POINT',

      issues: deepFreeze([
        createEnvironmentIssue(
          'INVALID_GROUND_DOMAIN_COORDINATES',
          'Ground-domain x and z values must be finite numbers.'
        )
      ]),

      groundContactClaim: false,
      collisionClaim: false
    });
  }

  const domain =
    H_EARTH_3D_GROUND_SUBSTRATE.domain;

  const inside =
    x >= domain.xMin &&
    x <= domain.xMax &&
    z >= domain.zMin &&
    z <= domain.zMax;

  let surfaceClass = 'OUTSIDE_GROUND_DOMAIN';

  if (inside) {
    const dry =
      H_EARTH_3D_GROUND_SUBSTRATE.drySand;

    const wet =
      H_EARTH_3D_GROUND_SUBSTRATE.wetSand;

    const insideDry =
      z >= dry.zMin &&
      z <= dry.zMax;

    const insideWet =
      z >= wet.zMin &&
      z <= wet.zMax;

    if (insideDry && insideWet) {
      surfaceClass = 'DRY_WET_TRANSITION';
    } else if (insideWet) {
      surfaceClass = 'WET_SAND';
    } else if (insideDry) {
      surfaceClass = 'DRY_SAND';
    } else {
      surfaceClass = 'GROUND_SUBSTRATE';
    }
  }

  return deepFreeze({
    eligible: inside,

    status:
      inside
        ? 'POINT_WITHIN_GROUND_ENVIRONMENT_DOMAIN'
        : 'POINT_OUTSIDE_GROUND_ENVIRONMENT_DOMAIN',

    point: deepFreeze({
      x,
      z
    }),

    surfaceClass,

    groundContactClaim: false,
    collisionClaim: false,
    walkabilityClaim: false
  });
}

/**
 * Evaluates whether a local point lies within the actor-ready ground candidate
 * envelope.
 *
 * This remains candidate evaluation only.
 */
export function evaluateHEarth3DActorReadyGroundCandidate({
  x,
  z,
  shorelineDepthZ = null
} = {}) {
  if (
    !isFiniteNumber(x) ||
    !isFiniteNumber(z)
  ) {
    return deepFreeze({
      candidate: false,
      status: 'INVALID_ACTOR_GROUND_CANDIDATE_POINT',

      issues: deepFreeze([
        createEnvironmentIssue(
          'INVALID_ACTOR_GROUND_COORDINATES',
          'Actor-ground candidate x and z values must be finite numbers.'
        )
      ]),

      actorReadyGroundProven: false,
      groundContactProven: false,
      collisionProven: false
    });
  }

  const bounds =
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE.bounds;

  const insideCandidateBounds =
    x >= bounds.xMin &&
    x <= bounds.xMax &&
    z >= bounds.zMin &&
    z <= bounds.zMax;

  const effectiveShorelineDepth =
    isFiniteNumber(shorelineDepthZ)
      ? shorelineDepthZ
      : H_EARTH_3D_SHORELINE_MODEL.nominalDepthZ;

  const shorelineClearance =
    effectiveShorelineDepth - z;

  const clearsShoreline =
    shorelineClearance >=
    H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE
      .shorelineClearanceMinimum;

  const candidate =
    insideCandidateBounds &&
    clearsShoreline;

  return deepFreeze({
    candidate,

    status:
      candidate
        ? 'ACTOR_READY_GROUND_CANDIDATE_POINT'
        : 'POINT_OUTSIDE_ACTOR_READY_GROUND_CANDIDATE',

    point: deepFreeze({
      x,
      z
    }),

    shorelineDepthZ:
      effectiveShorelineDepth,

    shorelineClearance,

    insideCandidateBounds,
    clearsShoreline,

    actorReadyGroundProven: false,
    groundContactProven: false,
    collisionProven: false,
    traversalProven: false
  });
}

/**
 * Evaluates a supplied Step 034I–034L source handoff.
 *
 * This function does not fetch or import source files. The caller supplies
 * observed facts from installed source or backed-file review.
 */
export function evaluateHEarth3DEnvironmentSourceHandoff({
  bindingIdentityMatches = false,

  step034IBoundariesPresent = false,
  step034JObjectsPresent = false,
  step034KZonesPresent = false,
  step034LLandscapeLatticePresent = false,

  groundCellIdentityMatches = false,
  spatialCellIdentityMatches = false,

  sourceSpineContradictionDetected = false
} = {}) {
  const issues = [];

  if (!bindingIdentityMatches) {
    issues.push(
      createEnvironmentIssue(
        'BINDING_IDENTITY_UNVERIFIED',
        'The environment handoff does not yet verify the accepted matrix/cell binding.'
      )
    );
  }

  if (!step034IBoundariesPresent) {
    issues.push(
      createEnvironmentIssue(
        'STEP_034I_BOUNDARIES_MISSING',
        'Step 034I boundary authority is missing or unverified.'
      )
    );
  }

  if (!step034JObjectsPresent) {
    issues.push(
      createEnvironmentIssue(
        'STEP_034J_OBJECTS_MISSING',
        'Step 034J object authority is missing or unverified.'
      )
    );
  }

  if (!step034KZonesPresent) {
    issues.push(
      createEnvironmentIssue(
        'STEP_034K_ZONES_MISSING',
        'Step 034K zone authority is missing or unverified.'
      )
    );
  }

  if (!step034LLandscapeLatticePresent) {
    issues.push(
      createEnvironmentIssue(
        'STEP_034L_LANDSCAPE_LATTICE_MISSING',
        'Step 034L landscape-lattice authority is missing or unverified.'
      )
    );
  }

  if (!groundCellIdentityMatches) {
    issues.push(
      createEnvironmentIssue(
        'GROUND_CELL_IDENTITY_MISMATCH',
        'The supplied environment source does not match H_EARTH_GROUND_CELL_001.'
      )
    );
  }

  if (!spatialCellIdentityMatches) {
    issues.push(
      createEnvironmentIssue(
        'SPATIAL_CELL_IDENTITY_MISMATCH',
        'The supplied environment source does not match H_EARTH_REGION_CELL_X07_Z08.'
      )
    );
  }

  if (sourceSpineContradictionDetected) {
    issues.push(
      createEnvironmentIssue(
        'SOURCE_SPINE_CONTRADICTION',
        'A contradiction was detected among the supplied source-spine facts.'
      )
    );
  }

  const admitted =
    issues.length === 0;

  return deepFreeze({
    admitted,

    status:
      admitted
        ? 'ENVIRONMENT_SOURCE_HANDOFF_ADMITTED'
        : 'ENVIRONMENT_SOURCE_HANDOFF_NOT_ADMITTED',

    observed: deepFreeze({
      bindingIdentityMatches,

      step034IBoundariesPresent,
      step034JObjectsPresent,
      step034KZonesPresent,
      step034LLandscapeLatticePresent,

      groundCellIdentityMatches,
      spatialCellIdentityMatches,

      sourceSpineContradictionDetected
    }),

    issues: deepFreeze(issues),

    environmentHandoffPresent: admitted,

    compositorMayConsume:
      admitted,

    rendererMayMount: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

/**
 * Evaluates environment primitive counts against the renewed capacity budget.
 *
 * This does not materialize primitives.
 */
export function evaluateHEarth3DEnvironmentPrimitivePlan(
  plan =
    H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
) {
  const count =
    plan?.estimatedEnvironmentPrimitiveCount;

  if (
    !Number.isInteger(count) ||
    count < 0
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'INVALID_ENVIRONMENT_PRIMITIVE_PLAN',

      issues: deepFreeze([
        createEnvironmentIssue(
          'INVALID_ENVIRONMENT_PRIMITIVE_COUNT',
          'Environment primitive count must be a non-negative integer.'
        )
      ]),

      rendererPassClaim: false,
      validationClaim: false
    });
  }

  const budget =
    H_EARTH_3D_NODE_BUDGET.environmentPrimitives;

  const exceedsMaximum =
    count > budget.maximum;

  const exceedsWarning =
    count > budget.warning;

  return deepFreeze({
    eligible: !exceedsMaximum,

    status:
      exceedsMaximum
        ? 'ENVIRONMENT_PRIMITIVE_BUDGET_EXCEEDED'
        : exceedsWarning
          ? 'ENVIRONMENT_PRIMITIVE_BUDGET_WARNING'
          : 'ENVIRONMENT_PRIMITIVE_PLAN_WITHIN_CAPACITY',

    count,

    target: budget.target,
    warning: budget.warning,
    maximum: budget.maximum,

    rendererGeometryCreated: false,
    rendererPassClaim: false,
    performanceClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates whether the environment handoff is suitable for compositor renewal.
 */
export function evaluateHEarth3DEnvironmentCompositorEligibility({
  capacityContractMatches = false,
  bindingIdentityMatches = false,
  sourceHandoffAdmitted = false,
  groundSubstratePresent = false,
  shorelineModelPresent = false,
  waterSubstratePresent = false,
  atmosphereModelPresent = false,
  primitivePlanWithinCapacity = false
} = {}) {
  const failures = [];

  if (!capacityContractMatches) {
    failures.push('capacity-contract-mismatch-or-unverified');
  }

  if (!bindingIdentityMatches) {
    failures.push('binding-identity-mismatch-or-unverified');
  }

  if (!sourceHandoffAdmitted) {
    failures.push('source-handoff-not-admitted');
  }

  if (!groundSubstratePresent) {
    failures.push('ground-substrate-missing');
  }

  if (!shorelineModelPresent) {
    failures.push('shoreline-model-missing');
  }

  if (!waterSubstratePresent) {
    failures.push('water-substrate-missing');
  }

  if (!atmosphereModelPresent) {
    failures.push('atmosphere-model-missing');
  }

  if (!primitivePlanWithinCapacity) {
    failures.push('primitive-plan-outside-capacity');
  }

  const eligible =
    failures.length === 0;

  return deepFreeze({
    compositorMayConsume: eligible,

    status:
      eligible
        ? 'ENVIRONMENT_HANDOFF_ELIGIBLE_FOR_COMPOSITOR'
        : 'ENVIRONMENT_HANDOFF_NOT_ELIGIBLE_FOR_COMPOSITOR',

    failures: deepFreeze(failures),

    compositorMounted: false,
    rendererMayMount: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    playableEnvironmentClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

export default H_EARTH_3D_ENVIRONMENT_CONTRACT;
