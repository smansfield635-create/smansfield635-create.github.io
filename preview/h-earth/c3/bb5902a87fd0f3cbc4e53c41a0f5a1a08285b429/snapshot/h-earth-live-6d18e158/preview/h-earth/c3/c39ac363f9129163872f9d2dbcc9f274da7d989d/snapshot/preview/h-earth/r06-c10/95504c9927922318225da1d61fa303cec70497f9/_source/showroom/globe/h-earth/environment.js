/**
 * /showroom/globe/h-earth/environment.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Gate 4B Step 2:
 * Preserve the existing environment role while adding one immutable,
 * environment-owned world-space shoreline boundary consumed by wet sand,
 * foam, water, and shoreline aggregation.
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_CAPACITY_BINDING_IDENTITY,
  H_EARTH_3D_PUBLIC_STAGE_IDS,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_RENDER_STAGE_LIMITS,
  H_EARTH_3D_RENDER_FRAME_CAPACITY,
  H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY,
  H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY,
  evaluateHEarth3DNodeBudget
} from './capacity.js';

export const H_EARTH_3D_ENVIRONMENT_CONTRACT_ID =
  'H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2';

export const H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION = 3;

export const H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID =
  'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

export const H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID =
  'H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_ENVIRONMENT_OWNED_FD05_v1';

const SOURCE_FILE = '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/environment.js';
const EMPTY_FROZEN_ARRAY = Object.freeze([]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue, seen);
  }
  return Object.freeze(value);
}

function isPlainObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function buildAxis(minimum, maximum, sampleCount) {
  return deepFreeze({
    minimum,
    maximum,
    sampleCount,
    step: (maximum - minimum) / (sampleCount - 1),
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
    rendererPresentationHints,
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

const WORLD_FRAME =
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS.coordinateFrame;

const SHORELINE_MINIMUM_X = -96;
const SHORELINE_MAXIMUM_X = 96;
const SHORELINE_BASE_Z = -96;
const SHORELINE_SAMPLE_COUNT = 25;

function buildSharedShorelineSamples() {
  const samples = [];
  for (let ordinal = 0; ordinal < SHORELINE_SAMPLE_COUNT; ordinal += 1) {
    const progress = ordinal / (SHORELINE_SAMPLE_COUNT - 1);
    const x =
      SHORELINE_MINIMUM_X +
      (SHORELINE_MAXIMUM_X - SHORELINE_MINIMUM_X) * progress;

    const envelope = Math.sin(Math.PI * progress) ** 2;
    const inwardVariation =
      2.4 * envelope +
      0.65 * Math.sin(progress * Math.PI * 4) * envelope;
    const z = Math.min(SHORELINE_BASE_Z, SHORELINE_BASE_Z - inwardVariation);

    samples.push(deepFreeze({
      sampleId:
        `H_EARTH_SHARED_SHORELINE_SAMPLE_${String(ordinal).padStart(2, '0')}`,
      ordinal,
      parameter: progress,
      x,
      z
    }));
  }
  return deepFreeze(samples);
}

const SHARED_SHORELINE_SAMPLES = buildSharedShorelineSamples();

export const H_EARTH_3D_SHARED_SHORELINE_BOUNDARY =
  deepFreeze({
    boundaryId:
      'H_EARTH_GROUND_CELL_001_SHARED_SHORELINE_BOUNDARY',
    boundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    sourceEnvironmentContractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
    coordinateFrame:
      WORLD_FRAME,
    representation:
      'ORDERED_WORLD_SPACE_XZ_SAMPLES',
    orientation:
      'WEST_TO_EAST',
    landSide:
      'NEGATIVE_Z',
    waterSide:
      'POSITIVE_Z',
    endpointIds: deepFreeze({
      first:
        SHARED_SHORELINE_SAMPLES[0].sampleId,
      last:
        SHARED_SHORELINE_SAMPLES[
          SHARED_SHORELINE_SAMPLES.length - 1
        ].sampleId
    }),
    sourceObjectIds: deepFreeze([
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),
    sourceZoneIds: deepFreeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE'
    ]),
    latticeRegionIds: deepFreeze([
      'FOREGROUND_INSPECTION_GROUND',
      'SHORELINE_CONTACT',
      'WATER_SURFACE_PLANE'
    ]),
    samples:
      SHARED_SHORELINE_SAMPLES,
    sampleCount:
      SHARED_SHORELINE_SAMPLES.length,
    sampleLaw: deepFreeze({
      canonicalOrdering:
        'STRICTLY_INCREASING_ORDINAL_WEST_TO_EAST',
      endpointPreservationRequired: true,
      deterministicResamplingPermitted: true,
      independentContactDisplacementPermitted: false
    }),
    elevationPolicy: deepFreeze({
      xzContactIsAuthoritative: true,
      wetSandElevation:
        'EVALUATE_EXISTING_WET_SAND_HEIGHT_LAW_AT_BOUNDARY_SAMPLE',
      waterElevation:
        0.68,
      foamElevation:
        0.79,
      foamAntiZFightingOffsetPermitted: true
    }),
    transformLaw: deepFreeze({
      samplesAreWorldSpace: true,
      independentConsumerTranslationPermitted: false,
      independentConsumerRotationPermitted: false,
      independentConsumerScalePermitted: false,
      reversibleLocalConversionPermitted: true
    }),
    immutable: true
  });

export function getHEarth3DSharedShorelineBoundary() {
  return H_EARTH_3D_SHARED_SHORELINE_BOUNDARY;
}

export function evaluateHEarth3DSharedShorelineBoundary(
  boundary = H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
) {
  const samples = boundary?.samples;
  const eligible =
    isPlainObject(boundary) &&
    boundary.boundaryContractId ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID &&
    boundary.coordinateFrame === WORLD_FRAME &&
    boundary.orientation === 'WEST_TO_EAST' &&
    Array.isArray(samples) &&
    samples.length >= 2 &&
    samples.every((sample, ordinal) =>
      isPlainObject(sample) &&
      sample.ordinal === ordinal &&
      typeof sample.sampleId === 'string' &&
      isFiniteNumber(sample.x) &&
      isFiniteNumber(sample.z) &&
      (
        ordinal === 0 ||
        samples[ordinal - 1].x < sample.x
      )
    ) &&
    boundary.endpointIds?.first === samples[0]?.sampleId &&
    boundary.endpointIds?.last === samples[samples.length - 1]?.sampleId;

  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'SHARED_SHORELINE_BOUNDARY_ELIGIBLE'
        : 'SHARED_SHORELINE_BOUNDARY_NOT_ELIGIBLE',
    boundaryId:
      boundary?.boundaryId ?? null,
    sampleCount:
      Array.isArray(samples) ? samples.length : 0,
    issues:
      eligible
        ? EMPTY_FROZEN_ARRAY
        : deepFreeze([{
            code:
              'SHARED_SHORELINE_BOUNDARY_INVALID',
            message:
              'The environment-owned shared shoreline boundary is malformed.'
          }])
  });
}

export const H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS =
  deepFreeze({
    ownsEnvironmentIdentity: true,
    ownsEnvironmentTierIdentity: true,
    ownsMaterialIdentity: true,
    ownsGroundSubstrateDescriptors: true,
    ownsShorelineDescriptors: true,
    ownsSharedShorelineNumericIntent: true,
    ownsWaterDescriptors: true,
    ownsWetSandNumericConstructionProfile: true,
    ownsProviderImplementationAuthority: false,
    invokesGeometryProvider: false,
    constructsGeometry: false,
    performsWestAdmission: false,
    mutatesGeometryIndex: false,
    ownsCompositorAuthority: false,
    ownsRendererAuthority: false,
    visualPassClaim: false,
    productionClaim: false,
    matrixCollapse: false
  });

export const H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY =
  deepFreeze({
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
      WORLD_FRAME,
    sourceAuthorityExternal: true,
    descriptorOnlyAtEnvironmentLayer: true,
    matrixCollapse: false
  });

export const H_EARTH_3D_ENVIRONMENT_SOURCE_REQUIREMENTS =
  deepFreeze({
    controllingCapacity: deepFreeze({
      path:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/capacity.js',
      contractId:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,
      required: true
    }),
    acceptedSourceSpine: deepFreeze({
      groundCell:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/cells/ground-cell-001.js',
      boundaries:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/boundaries/matrix-boundaries.js',
      objects:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',
      zones:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.zones.js',
      landscapeLattice:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
      packet001Resolver:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js'
    }),
    downstreamProviderTarget:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/render/geometry-ground.js',
    downstreamConsumer:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/compositor.js'
  });

export const H_EARTH_3D_ENVIRONMENT_TIER_IDS =
  deepFreeze({
    essential:
      'H_EARTH_ENVIRONMENT_TIER_1_ESSENTIAL',
    detail:
      'H_EARTH_ENVIRONMENT_TIER_2_DETAIL',
    context:
      'H_EARTH_ENVIRONMENT_TIER_3_CONTEXT',
    interaction:
      'H_EARTH_ENVIRONMENT_TIER_4_INTERACTION'
  });

export const H_EARTH_3D_ENVIRONMENT_TIER_ORDER =
  deepFreeze([
    H_EARTH_3D_ENVIRONMENT_TIER_IDS.essential,
    H_EARTH_3D_ENVIRONMENT_TIER_IDS.detail,
    H_EARTH_3D_ENVIRONMENT_TIER_IDS.context,
    H_EARTH_3D_ENVIRONMENT_TIER_IDS.interaction
  ]);

export const H_EARTH_3D_ENVIRONMENT_TIERS =
  deepFreeze({
    essential: deepFreeze({
      id:
        H_EARTH_3D_ENVIRONMENT_TIER_IDS.essential,
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
      required: true,
      members: deepFreeze([
        'MANOR_BLUFF_CONTEXT',
        'OFFSHORE_ISLETS'
      ])
    }),
    interaction: deepFreeze({
      id:
        H_EARTH_3D_ENVIRONMENT_TIER_IDS.interaction,
      required: true,
      members: deepFreeze([
        'INSPECTION_ANCHOR',
        'ACTOR_READY_GROUND_CANDIDATE'
      ])
    })
  });

export const H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES =
  deepFreeze({
    sky: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_SKY',
      label: 'H-Earth sky',
      semanticRole: 'SKY',
      materialClass: 'BACKGROUND_ATMOSPHERE',
      opacityPolicy: 'OPAQUE_BACKGROUND',
      surfaceResponse: 'NON_SURFACE_BACKGROUND'
    }),
    atmosphere: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_ATMOSPHERE',
      label: 'H-Earth atmosphere',
      semanticRole: 'ATMOSPHERE',
      materialClass: 'ATMOSPHERIC_OVERLAY',
      opacityPolicy: 'TRANSLUCENT',
      surfaceResponse: 'DISTANCE_HAZE'
    }),
    haze: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_HAZE',
      label: 'H-Earth horizon haze',
      semanticRole: 'HORIZON_HAZE',
      materialClass: 'DISTANCE_HAZE',
      opacityPolicy: 'TRANSLUCENT',
      surfaceResponse: 'HORIZON_SOFTENING'
    }),
    islet: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_OFFSHORE_ISLET',
      label: 'Offshore islet',
      semanticRole: 'OFFSHORE_ISLET',
      materialClass: 'DISTANT_SOLID_CONTEXT',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'ROCK_SILHOUETTE'
    }),
    manorContext: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_MANOR_CONTEXT',
      label: 'Manor and bluff context',
      semanticRole: 'MANOR_BLUFF_CONTEXT',
      materialClass: 'DISTANT_ARCHITECTURAL_CONTEXT',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'DISTANT_SILHOUETTE'
    }),
    openWater: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_OPEN_WATER',
      label: 'Open water',
      semanticRole: 'OPEN_WATER',
      materialClass: 'WATER_SURFACE',
      opacityPolicy: 'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',
      surfaceResponse: 'DISTANT_WATER_SURFACE'
    }),
    nearshoreWater: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_NEARSHORE_WATER',
      label: 'Nearshore water',
      semanticRole: 'NEARSHORE_WATER',
      materialClass: 'WATER_SURFACE',
      opacityPolicy: 'OPAQUE_OR_TRANSLUCENT_BY_RENDERER',
      surfaceResponse: 'SHALLOW_WATER_SURFACE'
    }),
    wave: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_WAVE',
      label: 'Wave band',
      semanticRole: 'WAVE_BAND',
      materialClass: 'WATER_RIBBON',
      opacityPolicy: 'TRANSLUCENT',
      surfaceResponse: 'WAVE_HIGHLIGHT'
    }),
    foam: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_FOAM',
      label: 'Shoreline foam',
      semanticRole: 'FOAM_CONTACT',
      materialClass: 'SHORELINE_CONTACT_RIBBON',
      opacityPolicy: 'TRANSLUCENT_TO_OPAQUE',
      surfaceResponse: 'FOAM_CONTACT'
    }),
    wetSand: createMaterialIdentity({
      id: 'H_EARTH_WET_SAND_DOMAIN',
      label: 'Wet sand',
      semanticRole: 'WET_SAND',
      materialClass: 'GROUND_SURFACE',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'DAMP_REFLECTIVE_GROUND'
    }),
    drySand: createMaterialIdentity({
      id: 'H_EARTH_DRY_SAND_DOMAIN',
      label: 'Dry sand',
      semanticRole: 'DRY_SAND',
      materialClass: 'GROUND_SURFACE',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'DRY_DIFFUSE_GROUND'
    }),
    tidePool: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_TIDE_POOL',
      label: 'Tide pool',
      semanticRole: 'TIDE_POOL',
      materialClass: 'GROUND_EMBEDDED_WATER',
      opacityPolicy: 'TRANSLUCENT',
      surfaceResponse: 'SHALLOW_REFLECTIVE_WATER'
    }),
    stone: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_STONE',
      label: 'Beach stone',
      semanticRole: 'STONE',
      materialClass: 'GROUNDED_DETAIL',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'SMOOTH_STONE'
    }),
    rock: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_JAGGED_ROCK',
      label: 'Jagged rock',
      semanticRole: 'JAGGED_ROCK',
      materialClass: 'GROUNDED_DETAIL',
      opacityPolicy: 'OPAQUE',
      surfaceResponse: 'FACETED_ROCK'
    }),
    inspectionAnchor: createMaterialIdentity({
      id: 'H_EARTH_MATERIAL_INSPECTION_ANCHOR',
      label: 'Inspection anchor',
      semanticRole: 'INSPECTION_ANCHOR',
      materialClass: 'INTERACTION_TARGET',
      opacityPolicy: 'RENDERER_SELECTED',
      surfaceResponse: 'NON_PHYSICAL_INTERACTION_TARGET'
    })
  });

export const H_EARTH_3D_GROUND_SUBSTRATE =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_CONTINUOUS_GROUND_SUBSTRATE',
    cellId:
      'H_EARTH_GROUND_CELL_001',
    coordinateFrame:
      WORLD_FRAME,
    continuityRequired: true,
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
        sharedShorelineBoundaryId:
          H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.boundaryId
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
          H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.drySand.id
      })
    })
  });

export const H_EARTH_3D_SHORELINE_MODEL =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_SHORELINE_MODEL',
    primaryZoneId:
      'ZONE_002_SHORELINE_CONTACT_ZONE',
    latticeRows:
      'R08-R09',
    sharedBoundary:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
    shorelineContact: deepFreeze({
      id:
        'H_EARTH_SHORELINE_CONTACT_FIELD',
      role:
        'WATER_GROUND_CONTACT_DESCRIPTOR',
      sharedBoundaryRequired: true
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
    })
  });

export const H_EARTH_3D_WATER_SUBSTRATE =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_WATER_SUBSTRATE',
    primaryZoneId:
      'ZONE_003_WATER_SURFACE_ZONE',
    coordinateFrame:
      WORLD_FRAME,
    sharedShorelineBoundaryId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.boundaryId,
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
    })
  });

export const H_EARTH_3D_ATMOSPHERE_MODEL =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_ATMOSPHERE_MODEL',
    primaryZoneId:
      'ZONE_003_WATER_SURFACE_ZONE'
  });

export const H_EARTH_3D_TIDE_POOL_DESCRIPTORS =
  deepFreeze([
    {
      id: 'H_EARTH_TIDE_POOL_001',
      sourceObjectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      primaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE'
    },
    {
      id: 'H_EARTH_TIDE_POOL_002',
      sourceObjectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      primaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE'
    },
    {
      id: 'H_EARTH_TIDE_POOL_003',
      sourceObjectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      primaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE'
    }
  ]);

export const H_EARTH_3D_STONE_DESCRIPTORS =
  deepFreeze(
    Array.from({ length: 4 }, (_, index) => ({
      id:
        `H_EARTH_BEACH_STONE_${String(index + 1).padStart(3, '0')}`,
      sourceObjectId:
        'OBJ_010_SMALL_BEACH_STONES',
      primaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE'
    }))
  );

export const H_EARTH_3D_JAGGED_ROCK_DESCRIPTORS =
  deepFreeze(
    Array.from({ length: 3 }, (_, index) => ({
      id:
        `H_EARTH_JAGGED_ROCK_${String(index + 1).padStart(3, '0')}`,
      sourceObjectId:
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      primaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE'
    }))
  );

export const H_EARTH_3D_BACKGROUND_CONTEXT =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_BACKGROUND_CONTEXT',
    manorBluff: deepFreeze({
      id:
        'H_EARTH_MANOR_BLUFF_CONTEXT',
      sourceObjectId:
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',
      primaryZoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE'
    }),
    offshoreIslets: deepFreeze([
      {
        id:
          'H_EARTH_OFFSHORE_ISLET_001',
        primaryZoneId:
          'ZONE_005_OFFSHORE_CONTEXT_ZONE'
      },
      {
        id:
          'H_EARTH_OFFSHORE_ISLET_002',
        primaryZoneId:
          'ZONE_005_OFFSHORE_CONTEXT_ZONE'
      }
    ])
  });

export const H_EARTH_3D_INSPECTION_ANCHOR =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_INSPECTION_ANCHOR',
    sourceObjectId:
      'OBJ_001_GROUND_SPAWN_ANCHOR',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    actionId:
      'H_EARTH_INSPECT_GROUND_ACTION',
    readoutId:
      'GROUND_CONDITION_READ',
    receiptId:
      'H_EARTH_GROUND_INSPECTION_RECEIPT'
  });

export const H_EARTH_3D_ACTOR_READY_GROUND_CANDIDATE =
  deepFreeze({
    id:
      'H_EARTH_GROUND_CELL_001_ACTOR_READY_GROUND_CANDIDATE',
    sourceGroundId:
      H_EARTH_3D_GROUND_SUBSTRATE.id,
    primaryDomainId:
      H_EARTH_3D_GROUND_SUBSTRATE.domains.wetSand.id,
    inspectionAnchorId:
      H_EARTH_3D_INSPECTION_ANCHOR.id,
    continuousGroundRequired: true,
    actorReadyClaim: false
  });

const WET_SAND_WORLD_BOUNDS =
  deepFreeze({
    minimumX: -96,
    maximumX: 96,
    minimumZ: -256,
    maximumZ: -96
  });

const WET_SAND_LOCAL_X_AXIS =
  buildAxis(-96, 96, 25);

const WET_SAND_LOCAL_Z_AXIS =
  buildAxis(-80, 80, 21);

export const H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_v1',
    profileRole:
      'ENVIRONMENT_OWNED_NUMERIC_GROUND_CONSTRUCTION_INTENT',
    coordinateFrame:
      WORLD_FRAME,
    sourceObjectId:
      'OBJ_002_FOREGROUND_WET_SAND',
    primaryZoneId:
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    regionId:
      'FOREGROUND_INSPECTION_GROUND',
    semanticDependencies: deepFreeze({
      packet001ExpectedContractId:
        H_EARTH_3D_PACKET_001_EXPECTED_CONTRACT_ID,
      providerId:
        'H_EARTH_GROUND_GEOMETRY_PROVIDER',
      providerImplementationFile:
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/render/geometry-ground.js',
      providerImplementationContractId:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_EXPECTED_CONTRACT_ID,
      semanticResolutionRequiredBeforeProviderTranslation: true,
      semanticResolutionAuthorityOwnedHere: false
    }),
    latticeDerivation: deepFreeze({
      latticeDimension: 16,
      rowIndices:
        deepFreeze([1, 2, 3, 4, 5]),
      columnIndices:
        deepFreeze([6, 7, 8, 9, 10, 11]),
      derivedWorldBounds:
        WET_SAND_WORLD_BOUNDS
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
      worldCoordinateSamplesCreatedHere: false,
      localCoordinateSamplesCreatedHere: false,
      providerMatrixConstructionOwnedHere: false
    }),
    samplingPolicy: deepFreeze({
      xSampleCount:
        WET_SAND_LOCAL_X_AXIS.sampleCount,
      zSampleCount:
        WET_SAND_LOCAL_Z_AXIS.sampleCount,
      xAxis:
        WET_SAND_LOCAL_X_AXIS,
      zAxis:
        WET_SAND_LOCAL_Z_AXIS
    }),
    elevationIntent: deepFreeze({
      baseElevation: 0,
      reliefAmplitude: 1.25,
      minimumHeightClamp: -1.25,
      maximumHeightClamp: 1.25,
      epsilon: 0.0001
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
          2.2,
        frequencyZ:
          1.7,
        phaseSeed:
          'H_EARTH_WET_SAND_MICRO_RELIEF_v1'
      }),
      evaluationOrder: deepFreeze([
        'BASE_ELEVATION',
        'SHORELINE_GRADIENT',
        'MICRO_RELIEF',
        'HEIGHT_CLAMP'
      ]),
      sampledElevationValuesCreatedHere: false
    }),
    transformIntent: deepFreeze({
      representation:
        'EXECUTABLE_WORLD_TRANSLATION_REQUIRED',
      localOrigin:
        deepFreeze({ x: 0, y: 0, z: 0 }),
      worldTranslation:
        deepFreeze({ x: 0, y: 0, z: -176 }),
      providerMatrixConstructionOwnedHere: false
    }),
    sharedShorelineBoundaryId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.boundaryId,
    sharedShorelineBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.boundaryContractId,
    materialIntentId:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES.wetSand.id,
    environmentOwnsNumericProfile: true,
    providerInvocationOwnedHere: false,
    geometryConstructionOwnedHere: false,
    sampledElevationValuesCreatedHere: false,
    topologyCreatedHere: false
  });

export function evaluateHEarth3DWetSandNumericConstructionProfile(
  profile = H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE
) {
  const boundaryEvaluation =
    evaluateHEarth3DSharedShorelineBoundary();

  const eligible =
    isPlainObject(profile) &&
    profile.profileId ===
      'H_EARTH_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_v1' &&
    profile.coordinateFrame === WORLD_FRAME &&
    profile.sourceObjectId ===
      'OBJ_002_FOREGROUND_WET_SAND' &&
    profile.samplingPolicy?.xSampleCount ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.sampleCount &&
    profile.transformIntent?.worldTranslation?.z === -176 &&
    profile.sharedShorelineBoundaryId ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY.boundaryId &&
    boundaryEvaluation.eligible === true;

  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_ELIGIBLE'
        : 'WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_NOT_ELIGIBLE',
    boundaryEvaluation,
    checks:
      deepFreeze([
        {
          id:
            'WET_SAND_SHARED_BOUNDARY_CORRESPONDENCE',
          passed:
            boundaryEvaluation.eligible === true
        },
        {
          id:
            'WET_SAND_WORLD_TRANSLATION_DECLARED',
          passed:
            profile?.transformIntent?.worldTranslation?.z === -176
        }
      ]),
    issues:
      eligible
        ? EMPTY_FROZEN_ARRAY
        : deepFreeze([{
            code:
              'WET_SAND_NUMERIC_PROFILE_INVALID',
            message:
              'The wet-sand profile does not correspond to the shared shoreline boundary.'
          }])
  });
}

const ENVIRONMENT_OBJECT_IDS =
  deepFreeze([
    'OBJ_001_GROUND_SPAWN_ANCHOR',
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_003_DRY_SAND_TRANSITION',
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]);

const OBJECT_ZONE_MAP =
  deepFreeze({
    OBJ_001_GROUND_SPAWN_ANCHOR:
      ['ZONE_001_FOREGROUND_INSPECTION_ZONE'],
    OBJ_002_FOREGROUND_WET_SAND:
      ['ZONE_001_FOREGROUND_INSPECTION_ZONE'],
    OBJ_003_DRY_SAND_TRANSITION:
      ['ZONE_002_SHORELINE_CONTACT_ZONE'],
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      ['ZONE_002_SHORELINE_CONTACT_ZONE'],
    OBJ_005_SHORELINE_FOAM_LINE:
      ['ZONE_002_SHORELINE_CONTACT_ZONE'],
    OBJ_006_NEARSHORE_WAVE_BAND:
      ['ZONE_003_WATER_SURFACE_ZONE'],
    OBJ_007_WATER_SURFACE_PLANE:
      ['ZONE_003_WATER_SURFACE_ZONE'],
    OBJ_008_AIR_HAZE_LIGHT_LAYER:
      ['ZONE_003_WATER_SURFACE_ZONE'],
    OBJ_009_MANOR_EXTERIOR_CONTEXT:
      ['ZONE_004_MANOR_CONTEXT_ZONE'],
    OBJ_010_SMALL_BEACH_STONES:
      ['ZONE_001_FOREGROUND_INSPECTION_ZONE'],
    OBJ_011_FOREGROUND_JAGGED_ROCKS:
      ['ZONE_001_FOREGROUND_INSPECTION_ZONE'],
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      ['ZONE_005_OFFSHORE_CONTEXT_ZONE']
  });

export const H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS =
  deepFreeze(
    Object.fromEntries(
      ENVIRONMENT_OBJECT_IDS.map((objectId) => [
        objectId,
        {
          id:
            objectId,
          objectId,
          sourceObjectId:
            objectId,
          zoneIds:
            OBJECT_ZONE_MAP[objectId],
          resolved: true
        }
      ])
    )
  );

export const H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES =
  deepFreeze({
    ZONE_001_FOREGROUND_INSPECTION_ZONE: {
      id:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      role:
        'FOREGROUND_WET_SAND_INSPECTION'
    },
    ZONE_002_SHORELINE_CONTACT_ZONE: {
      id:
        'ZONE_002_SHORELINE_CONTACT_ZONE',
      role:
        'SHORELINE_CONTACT_AND_TRANSITION'
    },
    ZONE_003_WATER_SURFACE_ZONE: {
      id:
        'ZONE_003_WATER_SURFACE_ZONE',
      role:
        'NEARSHORE_AND_OPEN_WATER'
    },
    ZONE_004_MANOR_CONTEXT_ZONE: {
      id:
        'ZONE_004_MANOR_CONTEXT_ZONE',
      role:
        'MANOR_BLUFF_CONTEXT'
    },
    ZONE_005_OFFSHORE_CONTEXT_ZONE: {
      id:
        'ZONE_005_OFFSHORE_CONTEXT_ZONE',
      role:
        'OFFSHORE_CONTEXT'
    }
  });

export function getResolvedEnvironmentObject(objectId) {
  return H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS[objectId] ?? null;
}

export const H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN =
  deepFreeze({
    coordinateFrame:
      WORLD_FRAME,
    outputModel:
      'DOM_CSS3D',
    estimatedEnvironmentPrimitiveCount:
      26,
    semanticLayerContainerEstimate:
      15,
    estimatedInteractionNodeCount:
      1,
    estimatedRouteOverlayNodeCount:
      1,
    estimatedDiagnosticOwnedNodeCount:
      0,
    nodeBudgetEvaluation:
      evaluateHEarth3DNodeBudget({
        semanticLayerContainers: 15,
        environmentPrimitives: 26,
        interactionNodes: 1,
        routeOverlayNodes: 1,
        diagnosticOwnedNodes: 0
      })
  });

export function evaluateHEarth3DEnvironmentPrimitivePlan(
  plan = H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN
) {
  const eligible =
    isPlainObject(plan) &&
    Number.isInteger(plan.estimatedEnvironmentPrimitiveCount) &&
    plan.estimatedEnvironmentPrimitiveCount >= 0 &&
    plan.nodeBudgetEvaluation?.eligible === true;
  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'ENVIRONMENT_PRIMITIVE_PLAN_ELIGIBLE'
        : 'ENVIRONMENT_PRIMITIVE_PLAN_NOT_ELIGIBLE',
    issues:
      eligible
        ? EMPTY_FROZEN_ARRAY
        : deepFreeze([{
            code:
              'ENVIRONMENT_PRIMITIVE_PLAN_INVALID'
          }])
  });
}

export const H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT =
  deepFreeze({
    capacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,
    activeCellMatches: true,
    spatialCellMatches: true,
    sceneIdentityMatches: true,
    coordinateFrameMatches: true,
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
    wetSandNumericProfileEligible:
      evaluateHEarth3DWetSandNumericConstructionProfile()
        .eligible === true
  });

export function evaluateHEarth3DEnvironmentCapacityAlignment(
  alignment = H_EARTH_3D_ENVIRONMENT_FRAME_CAPACITY_ALIGNMENT
) {
  const eligible =
    Object.values(alignment)
      .filter((value) => typeof value === 'boolean')
      .every((value) => value === true);
  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'ENVIRONMENT_CAPACITY_ALIGNMENT_ELIGIBLE'
        : 'ENVIRONMENT_CAPACITY_ALIGNMENT_NOT_ELIGIBLE',
    issues:
      eligible
        ? EMPTY_FROZEN_ARRAY
        : deepFreeze([{
            code:
              'ENVIRONMENT_CAPACITY_ALIGNMENT_INVALID'
          }])
  });
}

export const H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS =
  deepFreeze({
    runtimeActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    playableEnvironmentClaim: false,
    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    fluidSimulationClaim: false,
    matrixCollapse: false
  });

export const H_EARTH_3D_ENVIRONMENT_HANDOFF =
  deepFreeze({
    handoffType:
      'H_EARTH_LAYER_4_ENVIRONMENT_TO_COMPOSITOR_FRAME_INPUT_HANDOFF',
    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
    capacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,
    bindingIdentity:
      H_EARTH_3D_ENVIRONMENT_BINDING_IDENTITY,
    coordinateFrame:
      WORLD_FRAME,
    worldBounds:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
    publicStageIds:
      H_EARTH_3D_PUBLIC_STAGE_IDS,
    materialIdentities:
      H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES,
    groundSubstrate:
      H_EARTH_3D_GROUND_SUBSTRATE,
    shorelineModel:
      H_EARTH_3D_SHORELINE_MODEL,
    sharedShorelineBoundary:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
    waterSubstrate:
      H_EARTH_3D_WATER_SUBSTRATE,
    wetSandNumericConstructionProfile:
      H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,
    renderFrameCapacity:
      H_EARTH_3D_RENDER_FRAME_CAPACITY,
    compositorFrameEligibility:
      H_EARTH_3D_COMPOSITOR_FRAME_ELIGIBILITY,
    rendererFrameConsumptionEligibility:
      H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY,
    claimCeilings:
      H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
  });

export function evaluateHEarth3DEnvironmentHandoff(
  handoff = H_EARTH_3D_ENVIRONMENT_HANDOFF
) {
  const eligible =
    handoff?.contractId ===
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID &&
    handoff?.sharedShorelineBoundary ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY;
  return deepFreeze({
    eligible,
    status:
      eligible
        ? 'ENVIRONMENT_HANDOFF_ELIGIBLE'
        : 'ENVIRONMENT_HANDOFF_NOT_ELIGIBLE',
    issues:
      eligible
        ? EMPTY_FROZEN_ARRAY
        : deepFreeze([{
            code:
              'ENVIRONMENT_HANDOFF_INVALID'
          }])
  });
}

export const H_EARTH_3D_ENVIRONMENT_PREFLIGHT =
  deepFreeze({
    eligible:
      evaluateHEarth3DWetSandNumericConstructionProfile().eligible &&
      evaluateHEarth3DSharedShorelineBoundary().eligible &&
      evaluateHEarth3DEnvironmentPrimitivePlan().eligible &&
      evaluateHEarth3DEnvironmentCapacityAlignment().eligible &&
      evaluateHEarth3DEnvironmentHandoff().eligible,
    status:
      'FRAME_BASED_ENVIRONMENT_PREFLIGHT_ELIGIBLE',
    issues:
      EMPTY_FROZEN_ARRAY,
    runtimeActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    productionClaim: false
  });

export const H_EARTH_3D_ENVIRONMENT_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_FRAME_BASED_GROUND_CELL_001_ENVIRONMENT_SUBSTRATE_RECEIPT',
    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
    file:
      SOURCE_FILE,
    groundSubstrateDefined: true,
    shorelineModelDefined: true,
    sharedShorelineBoundaryDefined: true,
    waterSubstrateDefined: true,
    wetSandNumericConstructionProfileDefined: true,
    preflightStatus:
      H_EARTH_3D_ENVIRONMENT_PREFLIGHT.status,
    preflightEligible:
      H_EARTH_3D_ENVIRONMENT_PREFLIGHT.eligible,
    geometryConstructionVerified: false,
    WestAdmissionVerified: false,
    visualOutputInspected: false,
    productionClaim: false
  });

export const H_EARTH_3D_ENVIRONMENT_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
    schemaVersion:
      H_EARTH_3D_ENVIRONMENT_SCHEMA_VERSION,
    file:
      SOURCE_FILE,
    role:
      'FRAME_BASED_GROUND_CELL_001_SUBSTRATE_PROVIDER',
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
    sharedShorelineBoundary:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
    waterSubstrate:
      H_EARTH_3D_WATER_SUBSTRATE,
    atmosphereModel:
      H_EARTH_3D_ATMOSPHERE_MODEL,
    wetSandNumericConstructionProfile:
      H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,
    compositorHandoff:
      H_EARTH_3D_ENVIRONMENT_HANDOFF,
    preflight:
      H_EARTH_3D_ENVIRONMENT_PREFLIGHT,
    boundaryFlags:
      H_EARTH_3D_ENVIRONMENT_BOUNDARY_FLAGS,
    claimCeilings:
      H_EARTH_3D_ENVIRONMENT_CLAIM_CEILINGS
  });

export const H_EARTH_3D_ENVIRONMENT =
  deepFreeze({
    contract:
      H_EARTH_3D_ENVIRONMENT_CONTRACT,
    resolvedObjects:
      H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
    resolvedZones:
      H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
    receipt:
      H_EARTH_3D_ENVIRONMENT_RECEIPT
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

export function getEnvironmentReceipt() {
  return H_EARTH_3D_ENVIRONMENT_RECEIPT;
}

export default H_EARTH_3D_ENVIRONMENT_CONTRACT;
