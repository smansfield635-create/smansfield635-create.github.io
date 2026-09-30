/**
 * /h-earth-3d/environment/h-earth.biome-field.js
 *
 * H_EARTH_CANONICAL_BIOME_FIELD_RUN_7E_v1
 *
 * Canonical H-Earth biome-classification authority. It consumes the accepted
 * terrain, intrinsic surface, water, and atmosphere authorities and owns only
 * biome classification, ecological eligibility, and vegetation-capacity
 * projection. It creates no population instances, traversal, audio,
 * spatial-lifecycle, geometry, renderer, route, or deployment authority.
 */

import {
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  sampleHEarthSurfaceState
} from './h-earth.surface-state-field.js';

import {
  H_EARTH_WATER_STATE_CONTRACT_ID,
  sampleHEarthWaterState
} from './h-earth.water-state.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState
} from './h-earth.atmosphere-state.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);

export const H_EARTH_BIOME_FIELD_CONTRACT_ID =
  'H_EARTH_CANONICAL_BIOME_FIELD_RUN_7E_v1';

export const H_EARTH_BIOME_FIELD_REVISION = 1;

export const H_EARTH_BIOME_CLASSES = deepFreeze([
  'OPEN_COASTAL_WATER',
  'SHALLOW_COASTAL_WATER',
  'INTERTIDAL_SHORE',
  'COASTAL_DUNE',
  'LOWLAND_MEADOW',
  'COASTAL_GRASSLAND',
  'COASTAL_SHRUBLAND',
  'ROCKY_UPLAND',
  'BARREN_OR_UNSUPPORTED'
]);

export const H_EARTH_BIOME_FIELD_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'populationInstances',
  'instancePlan',
  'requiredPopulationInstances',
  'traversalClass',
  'traversalCost',
  'ambientAudioClass',
  'audioLayerSelection',
  'chunkState',
  'proxyState',
  'loadingState',
  'geometry',
  'renderPlan',
  'cameraState'
]);

const BIOME_PROFILES = deepFreeze({
  OPEN_COASTAL_WATER: {
    ecologicalEligibility: 0.72,
    vegetationCapacity: 0.02,
    canopyCapacity: 0,
    groundCoverCapacity: 0,
    moistureBand: 'SATURATED_SUBMERGED',
    exposureBand: 'OPEN_MARINE',
    speciesGuilds: ['PELAGIC_MICROHABITAT']
  },
  SHALLOW_COASTAL_WATER: {
    ecologicalEligibility: 0.86,
    vegetationCapacity: 0.22,
    canopyCapacity: 0,
    groundCoverCapacity: 0.28,
    moistureBand: 'SATURATED_SHALLOW',
    exposureBand: 'NEARSHORE_EXPOSED',
    speciesGuilds: ['SHALLOW_SEAGRASS', 'TIDAL_ALGAE']
  },
  INTERTIDAL_SHORE: {
    ecologicalEligibility: 0.78,
    vegetationCapacity: 0.18,
    canopyCapacity: 0,
    groundCoverCapacity: 0.24,
    moistureBand: 'INTERTIDAL_VARIABLE',
    exposureBand: 'SURF_CONTACT',
    speciesGuilds: ['SALT_TOLERANT_SEDGE', 'TIDAL_ALGAE']
  },
  COASTAL_DUNE: {
    ecologicalEligibility: 0.68,
    vegetationCapacity: 0.48,
    canopyCapacity: 0.06,
    groundCoverCapacity: 0.58,
    moistureBand: 'DRY_COASTAL',
    exposureBand: 'WIND_EXPOSED',
    speciesGuilds: ['DUNE_GRASS', 'SAND_BINDING_GROUNDCOVER']
  },
  LOWLAND_MEADOW: {
    ecologicalEligibility: 0.94,
    vegetationCapacity: 0.9,
    canopyCapacity: 0.28,
    groundCoverCapacity: 0.96,
    moistureBand: 'MESIC_LOWLAND',
    exposureBand: 'SHELTERED_TO_MODERATE',
    speciesGuilds: ['MEADOW_GRASS', 'LOWLAND_FORB', 'RIPARIAN_SEDGE']
  },
  COASTAL_GRASSLAND: {
    ecologicalEligibility: 0.88,
    vegetationCapacity: 0.78,
    canopyCapacity: 0.18,
    groundCoverCapacity: 0.9,
    moistureBand: 'MESIC_COASTAL',
    exposureBand: 'MODERATE_COASTAL',
    speciesGuilds: ['COASTAL_GRASS', 'COASTAL_FORB', 'LOW_SHRUB']
  },
  COASTAL_SHRUBLAND: {
    ecologicalEligibility: 0.76,
    vegetationCapacity: 0.6,
    canopyCapacity: 0.44,
    groundCoverCapacity: 0.66,
    moistureBand: 'SEASONALLY_DRY',
    exposureBand: 'EXPOSED_INLAND',
    speciesGuilds: ['COASTAL_SHRUB', 'UPLAND_GRASS', 'LICHEN']
  },
  ROCKY_UPLAND: {
    ecologicalEligibility: 0.54,
    vegetationCapacity: 0.3,
    canopyCapacity: 0.1,
    groundCoverCapacity: 0.36,
    moistureBand: 'DRY_ROCKY',
    exposureBand: 'RIDGE_EXPOSED',
    speciesGuilds: ['ROCK_LICHEN', 'UPLAND_SHRUB', 'CREVICE_GRASS']
  },
  BARREN_OR_UNSUPPORTED: {
    ecologicalEligibility: 0.08,
    vegetationCapacity: 0.02,
    canopyCapacity: 0,
    groundCoverCapacity: 0.02,
    moistureBand: 'UNSUPPORTED',
    exposureBand: 'UNSUPPORTED',
    speciesGuilds: []
  }
});

export const H_EARTH_BIOME_FIELD = deepFreeze({
  contractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
  biomeFieldRevision: H_EARTH_BIOME_FIELD_REVISION,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  biomeClasses: H_EARTH_BIOME_CLASSES,
  ownership: {
    ownsBiomeClassification: true,
    ownsBiomeEligibility: true,
    ownsVegetationCapacityProjection: true,
    ownsSpeciesGuildEligibility: true,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsAtmosphereState: false,
    ownsPopulationInstances: false,
    ownsTraversal: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsPublicRoute: false
  }
});

function rejectBiomeSample(worldX, worldZ, issues) {
  return deepFreeze({
    valid: false,
    status: 'BIOME_FIELD_SAMPLE_REJECTED',
    contractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
    biomeFieldRevision: H_EARTH_BIOME_FIELD_REVISION,
    worldX,
    worldZ,
    issues
  });
}

function resolveBiomeClass({ terrain, surface, water }) {
  if (water.waterClass === 'OPEN_WATER') return 'OPEN_COASTAL_WATER';
  if (water.waterClass === 'SHALLOW_WATER' ||
      water.waterClass === 'NEARSHORE_WATER') {
    return 'SHALLOW_COASTAL_WATER';
  }
  if (water.waterClass === 'SHORELINE_CONTACT' ||
      surface.surfaceClass === 'WET_SAND') {
    return 'INTERTIDAL_SHORE';
  }
  if (surface.surfaceClass === 'DRY_SAND') return 'COASTAL_DUNE';
  if (surface.surfaceClass === 'STONE_AND_SPARSE_SOIL' ||
      terrain.elevation > 24 || terrain.slope > 0.35) {
    return 'ROCKY_UPLAND';
  }
  if (surface.vegetationSupport >= 0.62 && terrain.elevation <= 8) {
    return 'LOWLAND_MEADOW';
  }
  if (surface.vegetationSupport >= 0.48) return 'COASTAL_GRASSLAND';
  if (surface.vegetationSupport >= 0.12) return 'COASTAL_SHRUBLAND';
  return 'BARREN_OR_UNSUPPORTED';
}

function modulateProfile(profile, { terrain, surface, water, atmosphere }) {
  const windPressure = clamp01(atmosphere.windSpeed / 18);
  const slopePressure = clamp01(terrain.slope / 0.65);
  const rockPressure = clamp01(surface.rockExposure);
  const wetnessFit = 1 - Math.abs(clamp01(surface.wetness) - 0.48);
  const waterPressure = water.waterPresent
    ? clamp01(0.32 + water.depth / 8)
    : 0;

  const vegetationCapacity = clamp01(
    profile.vegetationCapacity *
    (0.66 + surface.vegetationSupport * 0.46) *
    (1 - slopePressure * 0.34) *
    (1 - rockPressure * 0.28) *
    (1 - windPressure * 0.12)
  );
  const canopyCapacity = clamp01(
    profile.canopyCapacity *
    (0.7 + wetnessFit * 0.3) *
    (1 - windPressure * 0.22) *
    (1 - slopePressure * 0.3)
  );
  const groundCoverCapacity = clamp01(
    profile.groundCoverCapacity *
    (0.72 + surface.vegetationSupport * 0.34) *
    (1 - rockPressure * 0.22)
  );
  const ecologicalEligibility = clamp01(
    profile.ecologicalEligibility *
    (0.76 + Math.max(surface.vegetationSupport, waterPressure) * 0.28)
  );

  return deepFreeze({
    ecologicalEligibility,
    vegetationCapacity,
    canopyCapacity,
    groundCoverCapacity,
    moistureBand: profile.moistureBand,
    exposureBand: windPressure > 0.55
      ? `${profile.exposureBand}_HIGH_WIND`
      : profile.exposureBand,
    speciesGuilds: profile.speciesGuilds
  });
}

export function sampleHEarthBiomeField(worldX, worldZ, {
  atmosphereState = null
} = {}) {
  if (!finite(worldX) || !finite(worldZ)) {
    return rejectBiomeSample(worldX, worldZ, ['BIOME_COORDINATE_NOT_FINITE']);
  }

  const atmosphere = atmosphereState ?? sampleHEarthAtmosphereState();
  if (atmosphere?.valid !== true ||
      atmosphere?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return rejectBiomeSample(worldX, worldZ, ['ATMOSPHERE_STATE_INVALID']);
  }

  const terrain = sampleHEarthTerrainField(worldX, worldZ);
  const surface = sampleHEarthSurfaceState(worldX, worldZ);
  const water = sampleHEarthWaterState(worldX, worldZ, {
    atmosphereState: atmosphere
  });
  const issues = [];
  if (terrain?.valid !== true) issues.push('TERRAIN_SAMPLE_INVALID');
  if (surface?.valid !== true) issues.push('SURFACE_SAMPLE_INVALID');
  if (water?.valid !== true) issues.push('WATER_SAMPLE_INVALID');
  if (issues.length > 0) return rejectBiomeSample(worldX, worldZ, issues);

  const biomeClass = resolveBiomeClass({ terrain, surface, water });
  const profile = modulateProfile(BIOME_PROFILES[biomeClass], {
    terrain,
    surface,
    water,
    atmosphere
  });

  return deepFreeze({
    valid: true,
    status: 'BIOME_FIELD_SAMPLE_COMPLETE',
    contractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
    biomeFieldRevision: H_EARTH_BIOME_FIELD_REVISION,
    world: { x: worldX, y: terrain.elevation, z: worldZ },
    terrainElevation: terrain.elevation,
    slope: terrain.slope,
    shorelineDistance: terrain.shorelineDistance,
    surfaceClass: surface.surfaceClass,
    waterClass: water.waterClass,
    waterPresent: water.waterPresent,
    biomeClass,
    ecologicalEligibility: profile.ecologicalEligibility,
    vegetationCapacity: profile.vegetationCapacity,
    canopyCapacity: profile.canopyCapacity,
    groundCoverCapacity: profile.groundCoverCapacity,
    moistureBand: profile.moistureBand,
    exposureBand: profile.exposureBand,
    speciesGuilds: profile.speciesGuilds,
    semanticAddressId: surface.semanticAddressId,
    chunkId: surface.chunkId,
    formationIds: surface.formationIds,
    sourceIdentities: {
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      surfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      waterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      biomeFieldContractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
      biomeFieldRevision: H_EARTH_BIOME_FIELD_REVISION
    },
    correspondenceStatus: 'BIOME_UPSTREAM_CORRESPONDENCE_PASS',
    issues: []
  });
}

export function evaluateHEarthBiomeFieldSample(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('BIOME_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_BIOME_FIELD_CONTRACT_ID) {
    issues.push('BIOME_CONTRACT_ID_MISMATCH');
  }
  if (!H_EARTH_BIOME_CLASSES.includes(sample?.biomeClass)) {
    issues.push('BIOME_CLASS_INVALID');
  }
  for (const field of [
    'terrainElevation',
    'slope',
    'shorelineDistance',
    'ecologicalEligibility',
    'vegetationCapacity',
    'canopyCapacity',
    'groundCoverCapacity'
  ]) {
    if (!finite(sample?.[field])) issues.push(`NONFINITE_FIELD:${field}`);
  }
  for (const field of [
    'ecologicalEligibility',
    'vegetationCapacity',
    'canopyCapacity',
    'groundCoverCapacity'
  ]) {
    if (finite(sample?.[field]) && (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`OUT_OF_RANGE_FIELD:${field}`);
    }
  }
  H_EARTH_BIOME_FIELD_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(sample ?? {}, field)) {
      issues.push(`FORBIDDEN_NATIVE_OUTPUT:${field}`);
    }
  });
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'BIOME_FIELD_SAMPLE_PASS'
      : 'BIOME_FIELD_SAMPLE_FAIL',
    issues
  });
}

export function getHEarthBiomeFieldReceipt() {
  const issues = [];
  if (H_EARTH_BIOME_CLASSES.length !== 9) issues.push('BIOME_CLASS_COUNT_MISMATCH');
  if (H_EARTH_BIOME_FIELD.ownership.ownsPopulationInstances !== false) {
    issues.push('POPULATION_INSTANCE_AUTHORITY_LEAK');
  }
  return deepFreeze({
    receiptType: 'H_EARTH_BIOME_FIELD_RECEIPT',
    contractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
    biomeFieldRevision: H_EARTH_BIOME_FIELD_REVISION,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'BIOME_FIELD_READY'
      : 'BIOME_FIELD_HELD',
    biomeClassCount: H_EARTH_BIOME_CLASSES.length,
    issues
  });
}

export default H_EARTH_BIOME_FIELD;
