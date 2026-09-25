/**
 * /h-earth-3d/environment/h-earth.surface-state-field.js
 *
 * H_EARTH_CANONICAL_SURFACE_STATE_FIELD_RUN_7B_v1
 *
 * Canonical intrinsic surface-state authority. It consumes the accepted
 * terrain field and semantic/formation context. It creates no traversal,
 * hydrology, biome, population, audio-projection, spatial-lifecycle,
 * geometry, renderer, admission, frame, compositor, controller, or route
 * authority.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
  resolveHEarthFormationMembershipForAddress
} from '../terrain/h-earth.terrain-formations.js';

import {
  H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../integration/h-earth.landscape-realization-planner.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

export const H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID =
  'H_EARTH_CANONICAL_SURFACE_STATE_FIELD_RUN_7B_v1';

export const H_EARTH_SURFACE_STATE_REVISION = 1;

export const H_EARTH_SURFACE_CLASSES = deepFreeze([
  'OPEN_WATER',
  'NEARSHORE_WATER',
  'WET_SAND',
  'DRY_SAND',
  'LOWLAND_SOIL',
  'COASTAL_SOIL',
  'STONE_AND_SPARSE_SOIL'
]);

export const H_EARTH_SURFACE_STATE_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'traversalClass',
  'traversalCost',
  'ambientAudioClass',
  'audioLayerSelection',
  'biomeClass',
  'populationEligibility',
  'requiredPopulationInstances',
  'waterDepth',
  'flowDirection',
  'flowSpeed',
  'waveAmplitude',
  'underwaterState',
  'chunkState',
  'proxyState',
  'loadingState'
]);

const BASE_PROFILES = deepFreeze({
  OPEN_WATER: {
    baseColorProfile: { profileId: 'OPEN_WATER_BLUE_GREEN_v1', linearR: 0.035, linearG: 0.165, linearB: 0.235, alpha: 1 },
    roughness: 0.12,
    reflectance: 0.78,
    wetness: 1,
    waterSaturation: 1,
    sedimentClass: 'SUSPENDED_FINE_MARINE',
    rockExposure: 0,
    soilDepth: 0,
    vegetationSupport: 0.01,
    footingStability: 0,
    friction: 0.04,
    soundResponse: 'DEEP_WATER_CONTACT'
  },
  NEARSHORE_WATER: {
    baseColorProfile: { profileId: 'NEARSHORE_TURQUOISE_v1', linearR: 0.055, linearG: 0.255, linearB: 0.305, alpha: 1 },
    roughness: 0.2,
    reflectance: 0.7,
    wetness: 1,
    waterSaturation: 1,
    sedimentClass: 'SUSPENDED_COASTAL_SAND',
    rockExposure: 0.02,
    soilDepth: 0,
    vegetationSupport: 0.02,
    footingStability: 0.04,
    friction: 0.08,
    soundResponse: 'SHALLOW_WATER_CONTACT'
  },
  WET_SAND: {
    baseColorProfile: { profileId: 'WET_SAND_UMBER_v1', linearR: 0.26, linearG: 0.19, linearB: 0.11, alpha: 1 },
    roughness: 0.38,
    reflectance: 0.42,
    wetness: 0.86,
    waterSaturation: 0.82,
    sedimentClass: 'SATURATED_FINE_SAND',
    rockExposure: 0.04,
    soilDepth: 0.7,
    vegetationSupport: 0.08,
    footingStability: 0.58,
    friction: 0.46,
    soundResponse: 'WET_SAND'
  },
  DRY_SAND: {
    baseColorProfile: { profileId: 'DRY_SAND_OCHRE_v1', linearR: 0.52, linearG: 0.38, linearB: 0.18, alpha: 1 },
    roughness: 0.72,
    reflectance: 0.18,
    wetness: 0.18,
    waterSaturation: 0.16,
    sedimentClass: 'LOOSE_MEDIUM_SAND',
    rockExposure: 0.05,
    soilDepth: 1.3,
    vegetationSupport: 0.2,
    footingStability: 0.48,
    friction: 0.58,
    soundResponse: 'SOFT_SAND'
  },
  LOWLAND_SOIL: {
    baseColorProfile: { profileId: 'LOWLAND_SOIL_BROWN_v1', linearR: 0.2, linearG: 0.16, linearB: 0.08, alpha: 1 },
    roughness: 0.76,
    reflectance: 0.11,
    wetness: 0.42,
    waterSaturation: 0.38,
    sedimentClass: 'FINE_ALLUVIAL_SOIL',
    rockExposure: 0.08,
    soilDepth: 3.8,
    vegetationSupport: 0.76,
    footingStability: 0.74,
    friction: 0.7,
    soundResponse: 'COMPACT_SOIL'
  },
  COASTAL_SOIL: {
    baseColorProfile: { profileId: 'COASTAL_SOIL_BROWN_GREEN_v1', linearR: 0.23, linearG: 0.2, linearB: 0.09, alpha: 1 },
    roughness: 0.7,
    reflectance: 0.13,
    wetness: 0.31,
    waterSaturation: 0.27,
    sedimentClass: 'SANDY_COASTAL_LOAM',
    rockExposure: 0.18,
    soilDepth: 2.4,
    vegetationSupport: 0.68,
    footingStability: 0.78,
    friction: 0.74,
    soundResponse: 'FIRM_COASTAL_SOIL'
  },
  STONE_AND_SPARSE_SOIL: {
    baseColorProfile: { profileId: 'EXPOSED_STONE_GRAY_BROWN_v1', linearR: 0.25, linearG: 0.24, linearB: 0.2, alpha: 1 },
    roughness: 0.64,
    reflectance: 0.2,
    wetness: 0.16,
    waterSaturation: 0.12,
    sedimentClass: 'COARSE_COLLUVIAL_STONE',
    rockExposure: 0.78,
    soilDepth: 0.35,
    vegetationSupport: 0.16,
    footingStability: 0.66,
    friction: 0.82,
    soundResponse: 'LOOSE_STONE'
  }
});

export const H_EARTH_SURFACE_STATE_FIELD = deepFreeze({
  contractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  surfaceStateRevision: H_EARTH_SURFACE_STATE_REVISION,
  coordinateFrame: H_EARTH_TERRAIN_FIELD.coordinateFrame,
  surfaceClasses: H_EARTH_SURFACE_CLASSES,
  semanticContextProjection: 'PHYSICAL_CHUNK_BOUNDS_TO_NEAREST_MEMBER_ADDRESS',
  ownership: {
    ownsIntrinsicSurfaceCondition: true,
    ownsSurfaceMaterialProperties: true,
    ownsSoilAndSedimentCondition: true,
    ownsRockExposure: true,
    ownsVegetationSupport: true,
    ownsFootingStability: true,
    ownsFriction: true,
    ownsIntrinsicSoundResponse: true,
    ownsTerrainTruth: false,
    ownsSemanticAddressIdentity: false,
    ownsFormationIdentity: false,
    ownsWaterState: false,
    ownsTraversal: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsAdmission: false,
    ownsFrame: false,
    ownsCompositor: false,
    ownsController: false,
    ownsPublicRoute: false
  }
});

function parseAddress(address) {
  const match = /:R(\d+):C(\d+)$/.exec(address ?? '');
  return match
    ? { address, row: Number(match[1]), column: Number(match[2]) }
    : null;
}

function resolveChunk(worldX, worldZ) {
  const epsilon = 1e-8;
  return H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
    .filter((chunk) =>
      worldX >= chunk.worldBounds.xMin - epsilon &&
      worldX <= chunk.worldBounds.xMax + epsilon &&
      worldZ >= chunk.worldBounds.zMin - epsilon &&
      worldZ <= chunk.worldBounds.zMax + epsilon)
    .sort((left, right) => left.chunkId.localeCompare(right.chunkId))[0] ?? null;
}

function resolveSemanticContext(chunk, worldX, worldZ) {
  if (!chunk || !Array.isArray(chunk.memberAddressIds) || chunk.memberAddressIds.length === 0) {
    return null;
  }
  const candidates = chunk.memberAddressIds.map(parseAddress).filter(Boolean);
  const xProgress = clamp(
    (worldX - chunk.worldBounds.xMin) /
      Math.max(1e-8, chunk.worldBounds.xMax - chunk.worldBounds.xMin),
    0,
    0.999999
  );
  const zProgress = clamp(
    (worldZ - chunk.worldBounds.zMin) /
      Math.max(1e-8, chunk.worldBounds.zMax - chunk.worldBounds.zMin),
    0,
    0.999999
  );
  const targetColumn = chunk.addressRange.columnMin + Math.floor(xProgress * 4);
  const targetRow = chunk.addressRange.rowMin + Math.floor(zProgress * 4);
  const selected = [...candidates].sort((left, right) => {
    const leftDistance = Math.abs(left.row - targetRow) + Math.abs(left.column - targetColumn);
    const rightDistance = Math.abs(right.row - targetRow) + Math.abs(right.column - targetColumn);
    return leftDistance - rightDistance || left.address.localeCompare(right.address);
  })[0];
  return deepFreeze({
    semanticAddressId: selected.address,
    row: selected.row,
    column: selected.column,
    chunkId: chunk.chunkId,
    formationIds: resolveHEarthFormationMembershipForAddress(selected)
  });
}

function modulateProfile(surfaceClass, terrainSample) {
  const base = BASE_PROFILES[surfaceClass];
  const slopePressure = clamp01(terrainSample.slope / 0.7);
  const curvaturePressure = clamp01(Math.abs(terrainSample.curvature) / 0.2);
  const shorelineMoisture = clamp01(1 - Math.max(0, terrainSample.shorelineDistance) / 90);
  const elevationDrying = clamp01(Math.max(0, terrainSample.elevation) / 48);

  const wetness = surfaceClass.includes('WATER')
    ? 1
    : clamp01(base.wetness + shorelineMoisture * 0.18 - elevationDrying * 0.12);
  const waterSaturation = surfaceClass.includes('WATER')
    ? 1
    : clamp01(base.waterSaturation + shorelineMoisture * 0.2 - elevationDrying * 0.15);
  const rockExposure = clamp01(
    base.rockExposure + slopePressure * 0.32 + curvaturePressure * 0.12
  );
  const soilDepth = surfaceClass.includes('WATER')
    ? 0
    : Math.max(0, base.soilDepth * (1 - rockExposure * 0.68));
  const vegetationMoistureFit = 1 - Math.abs(wetness - 0.48);
  const vegetationSupport = surfaceClass.includes('WATER')
    ? base.vegetationSupport
    : clamp01(
        base.vegetationSupport * vegetationMoistureFit *
        (1 - slopePressure * 0.58) * (1 - rockExposure * 0.5)
      );
  const footingStability = surfaceClass.includes('WATER')
    ? base.footingStability
    : clamp01(
        base.footingStability *
        (1 - waterSaturation * 0.22) *
        (1 - slopePressure * 0.42)
      );
  const friction = clamp01(
    base.friction * (1 - wetness * 0.12) + rockExposure * 0.08
  );
  const roughness = clamp01(
    base.roughness + rockExposure * 0.1 - wetness * 0.08
  );
  const reflectance = clamp01(
    base.reflectance + wetness * 0.1 - rockExposure * 0.04
  );

  return deepFreeze({
    baseColorProfile: base.baseColorProfile,
    roughness,
    reflectance,
    wetness,
    waterSaturation,
    sedimentClass: base.sedimentClass,
    rockExposure,
    soilDepth,
    vegetationSupport,
    footingStability,
    friction,
    soundResponse: base.soundResponse
  });
}

export function sampleHEarthSurfaceState(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return deepFreeze({
      valid: false,
      status: 'SURFACE_STATE_REJECTED_NONFINITE',
      worldX,
      worldZ,
      issues: ['WORLD_COORDINATE_NONFINITE']
    });
  }

  const terrainSample = sampleHEarthTerrainField(worldX, worldZ);
  if (terrainSample.valid !== true) {
    return deepFreeze({
      valid: false,
      status: 'SURFACE_STATE_REJECTED_TERRAIN_SAMPLE',
      worldX,
      worldZ,
      issues: ['CANONICAL_TERRAIN_SAMPLE_INVALID']
    });
  }

  const chunk = resolveChunk(worldX, worldZ);
  const semanticContext = resolveSemanticContext(chunk, worldX, worldZ);
  if (!semanticContext) {
    return deepFreeze({
      valid: false,
      status: 'SURFACE_STATE_REJECTED_SEMANTIC_CONTEXT_UNAVAILABLE',
      world: terrainSample.world,
      terrainElevation: terrainSample.elevation,
      issues: ['NO_AUTHORIZED_PHYSICAL_CHUNK_CONTEXT']
    });
  }

  const surfaceClass = terrainSample.materialProfile;
  const intrinsic = modulateProfile(surfaceClass, terrainSample);

  return deepFreeze({
    valid: true,
    status: 'SURFACE_STATE_SAMPLE_COMPLETE',
    contractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    surfaceStateRevision: H_EARTH_SURFACE_STATE_REVISION,
    world: terrainSample.world,
    terrainElevation: terrainSample.elevation,
    normal: terrainSample.normal,
    slope: terrainSample.slope,
    curvature: terrainSample.curvature,
    shorelineDistance: terrainSample.shorelineDistance,
    surfaceClass,
    ...intrinsic,
    semanticAddressId: semanticContext.semanticAddressId,
    chunkId: semanticContext.chunkId,
    formationIds: semanticContext.formationIds,
    sourceIdentities: deepFreeze({
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      terrainFieldGenerationRevision: H_EARTH_TERRAIN_FIELD.generationRevision,
      terrainFormationsContractId: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
      landscapeRealizationPlannerContractId:
        H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
      landscapeRealizationPlanDigest:
        H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.deterministicDigest
    }),
    nativeTruthOwnership: 'INTRINSIC_SURFACE_STATE_ONLY',
    issues: []
  });
}

function isDeepFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) &&
    Object.values(value).every((nested) => isDeepFrozen(nested, seen));
}

export function evaluateHEarthSurfaceStateSample(sample) {
  const issues = [];
  if (!sample || sample.valid !== true) {
    issues.push('SURFACE_SAMPLE_NOT_VALID');
  } else {
    if (sample.contractId !== H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID) {
      issues.push('SURFACE_CONTRACT_ID_MISMATCH');
    }
    if (!H_EARTH_SURFACE_CLASSES.includes(sample.surfaceClass)) {
      issues.push('SURFACE_CLASS_UNKNOWN');
    }
    for (const key of ['terrainElevation', 'slope', 'curvature', 'shorelineDistance',
      'roughness', 'reflectance', 'wetness', 'waterSaturation', 'rockExposure',
      'soilDepth', 'vegetationSupport', 'footingStability', 'friction']) {
      if (!finite(sample[key])) issues.push(`NONFINITE_CHANNEL:${key}`);
    }
    for (const key of ['roughness', 'reflectance', 'wetness', 'waterSaturation',
      'rockExposure', 'vegetationSupport', 'footingStability', 'friction']) {
      if (finite(sample[key]) && (sample[key] < 0 || sample[key] > 1)) {
        issues.push(`CHANNEL_OUT_OF_RANGE:${key}`);
      }
    }
    if (!sample.baseColorProfile || ['linearR','linearG','linearB','alpha']
      .some((key) => !finite(sample.baseColorProfile[key]) ||
        sample.baseColorProfile[key] < 0 || sample.baseColorProfile[key] > 1)) {
      issues.push('BASE_COLOR_PROFILE_INVALID');
    }
    if (typeof sample.semanticAddressId !== 'string') issues.push('SEMANTIC_ADDRESS_MISSING');
    if (typeof sample.chunkId !== 'string') issues.push('CHUNK_ID_MISSING');
    if (!Array.isArray(sample.formationIds)) issues.push('FORMATION_IDS_INVALID');
    if (!sample.sourceIdentities ||
      sample.sourceIdentities.terrainFieldContractId !== H_EARTH_TERRAIN_FIELD_CONTRACT_ID ||
      sample.sourceIdentities.terrainFormationsContractId !== H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID ||
      sample.sourceIdentities.landscapeRealizationPlannerContractId !==
        H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID) {
      issues.push('SOURCE_IDENTITIES_INVALID');
    }
    for (const forbidden of H_EARTH_SURFACE_STATE_FORBIDDEN_NATIVE_OUTPUTS) {
      if (Object.prototype.hasOwnProperty.call(sample, forbidden)) {
        issues.push(`FORBIDDEN_NATIVE_OUTPUT:${forbidden}`);
      }
    }
    if (!isDeepFrozen(sample)) issues.push('SURFACE_SAMPLE_NOT_DEEP_FROZEN');
  }

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'SURFACE_STATE_SAMPLE_PASS'
      : 'SURFACE_STATE_SAMPLE_FAIL',
    issues
  });
}

export function getHEarthSurfaceStateFieldReceipt() {
  return deepFreeze({
    receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7B_SOURCE_RECEIPT',
    contractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    surfaceStateRevision: H_EARTH_SURFACE_STATE_REVISION,
    sourceContracts: {
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      terrainFormationsContractId: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
      landscapeRealizationPlannerContractId:
        H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID
    },
    surfaceClasses: H_EARTH_SURFACE_CLASSES,
    forbiddenNativeOutputs: H_EARTH_SURFACE_STATE_FORBIDDEN_NATIVE_OUTPUTS,
    ownsNativeEnvironmentalTruth: true,
    nativeTruthScope: 'INTRINSIC_SURFACE_STATE_ONLY',
    ownsTerrainTruth: false,
    ownsTraversal: false,
    ownsWaterState: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    productPromotionClaim: false
  });
}
