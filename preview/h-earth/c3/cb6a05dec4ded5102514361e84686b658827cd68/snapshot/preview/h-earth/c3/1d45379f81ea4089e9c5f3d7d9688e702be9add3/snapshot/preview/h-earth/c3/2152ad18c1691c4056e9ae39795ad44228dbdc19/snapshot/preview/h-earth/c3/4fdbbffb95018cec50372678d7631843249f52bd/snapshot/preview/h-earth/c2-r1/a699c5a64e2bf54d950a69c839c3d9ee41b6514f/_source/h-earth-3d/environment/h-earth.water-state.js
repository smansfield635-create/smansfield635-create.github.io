/**
 * /h-earth-3d/environment/h-earth.water-state.js
 *
 * H_EARTH_CANONICAL_WATER_STATE_RUN_7D_v1
 *
 * Canonical H-Earth water-state authority. It consumes terrain, intrinsic
 * surface state, and atmosphere wind context while owning only water-body
 * identity, water-surface and bed correspondence, depth, flow, waves,
 * turbidity, shoreline transfer, buoyancy eligibility, and underwater
 * classification. It creates no geometry, renderer, camera, traversal,
 * biome, population, audio, spatial-lifecycle, route, or deployment authority.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  H_EARTH_SURFACE_STATE_REVISION,
  sampleHEarthSurfaceState
} from './h-earth.surface-state-field.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  H_EARTH_ATMOSPHERE_STATE_REVISION,
  sampleHEarthAtmosphereState
} from './h-earth.atmosphere-state.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const normalizeXZ = ({ x, z }) => {
  const magnitude = Math.hypot(x, z);
  return magnitude > Number.EPSILON
    ? deepFreeze({ x: x / magnitude, z: z / magnitude })
    : deepFreeze({ x: 1, z: 0 });
};

export const H_EARTH_WATER_STATE_CONTRACT_ID =
  'H_EARTH_CANONICAL_WATER_STATE_RUN_7D_v1';

export const H_EARTH_WATER_STATE_REVISION = 1;

export const H_EARTH_WATER_BODY_ID = 'H_EARTH_COASTAL_OCEAN_001';

export const H_EARTH_WATER_CLASSES = deepFreeze([
  'NO_WATER',
  'SHORELINE_CONTACT',
  'SHALLOW_WATER',
  'NEARSHORE_WATER',
  'OPEN_WATER'
]);

export const H_EARTH_UNDERWATER_STATES = deepFreeze([
  'UNSPECIFIED',
  'NO_WATER',
  'ABOVE_WATER',
  'CONTACT_ZONE',
  'SUBMERGED'
]);

export const H_EARTH_WATER_STATE_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'terrainElevation',
  'surfaceClass',
  'baseColorProfile',
  'roughness',
  'reflectance',
  'vegetationSupport',
  'traversalClass',
  'traversalCost',
  'biomeClass',
  'populationEligibility',
  'requiredPopulationInstances',
  'ambientAudioClass',
  'audioLayerSelection',
  'chunkState',
  'proxyState',
  'loadingState',
  'sunDirection',
  'sunIntensity',
  'windDirection',
  'windSpeed',
  'timeOfDay',
  'geometry',
  'renderPlan',
  'cameraState'
]);

const CLASS_PROFILES = deepFreeze({
  NO_WATER: {
    baseFlowSpeed: 0,
    baseWaveAmplitude: 0,
    waveFrequency: 0,
    turbidity: 0,
    foamBase: 0
  },
  SHORELINE_CONTACT: {
    baseFlowSpeed: 0.08,
    baseWaveAmplitude: 0.08,
    waveFrequency: 0.62,
    turbidity: 0.9,
    foamBase: 0.88
  },
  SHALLOW_WATER: {
    baseFlowSpeed: 0.18,
    baseWaveAmplitude: 0.18,
    waveFrequency: 0.5,
    turbidity: 0.72,
    foamBase: 0.54
  },
  NEARSHORE_WATER: {
    baseFlowSpeed: 0.28,
    baseWaveAmplitude: 0.34,
    waveFrequency: 0.4,
    turbidity: 0.48,
    foamBase: 0.2
  },
  OPEN_WATER: {
    baseFlowSpeed: 0.36,
    baseWaveAmplitude: 0.52,
    waveFrequency: 0.3,
    turbidity: 0.26,
    foamBase: 0.05
  }
});

export const H_EARTH_WATER_STATE = deepFreeze({
  contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
  waterStateRevision: H_EARTH_WATER_STATE_REVISION,
  coordinateFrame: H_EARTH_TERRAIN_FIELD.coordinateFrame,
  waterBodyId: H_EARTH_WATER_BODY_ID,
  seaLevelY: H_EARTH_TERRAIN_FIELD.worldDomain.seaLevelY,
  waterClasses: H_EARTH_WATER_CLASSES,
  shorelineBandOffsets: {
    contactLandwardMaximum: 2,
    contactWaterwardMaximum: -3.2,
    shallowWaterwardMaximum: -22,
    nearshoreWaterwardMaximum: -58
  },
  ownership: {
    ownsWaterBodyIdentity: true,
    ownsWaterSurfaceElevation: true,
    ownsBedElevationCorrespondence: true,
    ownsDepth: true,
    ownsFlow: true,
    ownsWaves: true,
    ownsTurbidity: true,
    ownsFoamIntensity: true,
    ownsWetnessTransfer: true,
    ownsUnderwaterState: true,
    ownsBuoyancyEligibility: true,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsAtmosphereState: false,
    ownsSemanticAddressIdentity: false,
    ownsFormationIdentity: false,
    ownsTraversal: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsAdmission: false,
    ownsFrame: false,
    ownsCompositor: false,
    ownsController: false,
    ownsPublicRoute: false
  }
});

function classifyWater(shorelineDistance) {
  if (shorelineDistance > H_EARTH_WATER_STATE.shorelineBandOffsets.contactLandwardMaximum) {
    return 'NO_WATER';
  }
  if (shorelineDistance > H_EARTH_WATER_STATE.shorelineBandOffsets.contactWaterwardMaximum) {
    return 'SHORELINE_CONTACT';
  }
  if (shorelineDistance > H_EARTH_WATER_STATE.shorelineBandOffsets.shallowWaterwardMaximum) {
    return 'SHALLOW_WATER';
  }
  if (shorelineDistance > H_EARTH_WATER_STATE.shorelineBandOffsets.nearshoreWaterwardMaximum) {
    return 'NEARSHORE_WATER';
  }
  return 'OPEN_WATER';
}

function shorelineFrame(worldX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(worldX - step);
  const z1 = getHEarthCanonicalShorelineZ(worldX + step);
  const tangent = normalizeXZ({ x: 2 * step, z: z1 - z0 });
  let waterwardNormal = normalizeXZ({ x: -tangent.z, z: tangent.x });
  if (waterwardNormal.z < 0) {
    waterwardNormal = deepFreeze({
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    });
  }
  return deepFreeze({ tangent, waterwardNormal });
}

function resolveFlowAndWave({ waterClass, worldX, atmosphereState }) {
  const profile = CLASS_PROFILES[waterClass];
  if (waterClass === 'NO_WATER') {
    return deepFreeze({
      flowDirection: { x: 0, z: 0 },
      flowSpeed: 0,
      waveDirection: { x: 0, z: 0 },
      waveAmplitude: 0,
      waveFrequency: 0
    });
  }

  const frame = shorelineFrame(worldX);
  const atmosphericWind = atmosphereState.windDirection;
  const waveDirection = normalizeXZ({
    x: atmosphericWind.x * 0.72 + frame.waterwardNormal.x * 0.28,
    z: atmosphericWind.z * 0.72 + frame.waterwardNormal.z * 0.28
  });
  const flowDirection = normalizeXZ({
    x: frame.tangent.x * 0.78 + frame.waterwardNormal.x * 0.22,
    z: frame.tangent.z * 0.78 + frame.waterwardNormal.z * 0.22
  });
  const windPressure = clamp(atmosphereState.windSpeed / 8, 0.45, 1.65);
  const gustPressure = 1 + atmosphereState.windGustStrength * 0.35;

  return deepFreeze({
    flowDirection,
    flowSpeed: profile.baseFlowSpeed * (0.82 + windPressure * 0.18),
    waveDirection,
    waveAmplitude: profile.baseWaveAmplitude * windPressure * gustPressure,
    waveFrequency: profile.waveFrequency * (0.86 + windPressure * 0.14)
  });
}

function classifyUnderwater({ waterClass, surfaceElevation, observerY }) {
  if (observerY === null) return 'UNSPECIFIED';
  if (waterClass === 'NO_WATER') return 'NO_WATER';
  const relative = observerY - surfaceElevation;
  if (relative > 0.35) return 'ABOVE_WATER';
  if (relative >= -0.25) return 'CONTACT_ZONE';
  return 'SUBMERGED';
}

function rejectWaterState({ worldX, worldZ, observerY, issues }) {
  return deepFreeze({
    valid: false,
    status: 'WATER_STATE_REJECTED_INVALID_INPUT',
    contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    waterStateRevision: H_EARTH_WATER_STATE_REVISION,
    worldX,
    worldZ,
    observerY,
    issues
  });
}

export function sampleHEarthWaterState(
  worldX,
  worldZ,
  {
    atmosphereState = null,
    observerY = null
  } = {}
) {
  if (!finite(worldX) || !finite(worldZ) ||
      (observerY !== null && !finite(observerY))) {
    return rejectWaterState({
      worldX,
      worldZ,
      observerY,
      issues: ['WATER_INPUT_NOT_FINITE']
    });
  }

  const consumedAtmosphere = atmosphereState ?? sampleHEarthAtmosphereState();
  if (consumedAtmosphere?.valid !== true ||
      consumedAtmosphere?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return rejectWaterState({
      worldX,
      worldZ,
      observerY,
      issues: ['ATMOSPHERE_STATE_NOT_ELIGIBLE']
    });
  }

  const terrain = sampleHEarthTerrainField(worldX, worldZ);
  const surface = sampleHEarthSurfaceState(worldX, worldZ);
  if (terrain?.valid !== true || surface?.valid !== true) {
    return rejectWaterState({
      worldX,
      worldZ,
      observerY,
      issues: ['UPSTREAM_TERRAIN_OR_SURFACE_STATE_NOT_ELIGIBLE']
    });
  }

  const waterClass = classifyWater(terrain.shorelineDistance);
  const profile = CLASS_PROFILES[waterClass];
  const waterPresent = waterClass !== 'NO_WATER';
  const surfaceElevation = waterPresent
    ? H_EARTH_WATER_STATE.seaLevelY
    : null;
  const bedElevation = terrain.elevation;
  const depth = waterPresent
    ? Math.max(0, surfaceElevation - bedElevation)
    : 0;
  const waterwardDistance = Math.max(0, -terrain.shorelineDistance);
  const shorelineContact = clamp01(
    1 - Math.abs(terrain.shorelineDistance) / 18
  );
  const wetnessTransfer = clamp01(
    smoothstep(36, -4, terrain.shorelineDistance)
  );
  const foamIntensity = waterPresent
    ? clamp01(profile.foamBase * (0.72 + shorelineContact * 0.46))
    : 0;
  const turbidity = waterPresent
    ? clamp01(
        profile.turbidity + shorelineContact * 0.1 +
        clamp01(surface.rockExposure) * 0.03
      )
    : 0;
  const motion = resolveFlowAndWave({
    waterClass,
    worldX,
    atmosphereState: consumedAtmosphere
  });
  const underwaterState = classifyUnderwater({
    waterClass,
    surfaceElevation,
    observerY
  });
  const buoyancyEligibility = waterPresent && depth >= 0.75;

  return deepFreeze({
    valid: true,
    status: 'WATER_STATE_SAMPLE_COMPLETE',
    contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    waterStateRevision: H_EARTH_WATER_STATE_REVISION,
    world: { x: worldX, y: surfaceElevation, z: worldZ },
    waterBodyId: waterPresent ? H_EARTH_WATER_BODY_ID : null,
    waterClass,
    waterPresent,
    surfaceElevation,
    bedElevation,
    depth,
    shorelineDistance: terrain.shorelineDistance,
    shorelineZ: terrain.shorelineZ,
    waterwardDistance,
    flowDirection: motion.flowDirection,
    flowSpeed: motion.flowSpeed,
    waveDirection: motion.waveDirection,
    waveAmplitude: motion.waveAmplitude,
    waveFrequency: motion.waveFrequency,
    turbidity,
    foamIntensity,
    wetnessTransfer,
    underwaterState,
    buoyancyEligibility,
    semanticAddressId: surface.semanticAddressId,
    chunkId: surface.chunkId,
    formationIds: surface.formationIds,
    sourceIdentities: {
      waterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
      waterStateRevision: H_EARTH_WATER_STATE_REVISION,
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      terrainFieldRevision: H_EARTH_TERRAIN_FIELD.generationRevision,
      surfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      surfaceStateRevision: H_EARTH_SURFACE_STATE_REVISION,
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION
    },
    correspondenceStatus: 'WATER_UPSTREAM_CORRESPONDENCE_PASS',
    issues: []
  });
}

export function evaluateHEarthWaterStateSample(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('WATER_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_WATER_STATE_CONTRACT_ID) {
    issues.push('WATER_CONTRACT_ID_MISMATCH');
  }
  if (!H_EARTH_WATER_CLASSES.includes(sample?.waterClass)) {
    issues.push('WATER_CLASS_INVALID');
  }
  if (!H_EARTH_UNDERWATER_STATES.includes(sample?.underwaterState)) {
    issues.push('UNDERWATER_STATE_INVALID');
  }

  for (const field of [
    'bedElevation',
    'depth',
    'shorelineDistance',
    'shorelineZ',
    'waterwardDistance',
    'flowSpeed',
    'waveAmplitude',
    'waveFrequency',
    'turbidity',
    'foamIntensity',
    'wetnessTransfer'
  ]) {
    if (!finite(sample?.[field])) issues.push(`NONFINITE_FIELD:${field}`);
  }

  if (sample?.waterPresent === true) {
    if (sample.waterBodyId !== H_EARTH_WATER_BODY_ID) {
      issues.push('WATER_BODY_ID_MISMATCH');
    }
    if (!finite(sample.surfaceElevation)) {
      issues.push('WATER_SURFACE_ELEVATION_NONFINITE');
    }
    if (sample.depth < 0) issues.push('WATER_DEPTH_NEGATIVE');
  } else {
    if (sample?.waterBodyId !== null) issues.push('LAND_SAMPLE_HAS_WATER_BODY');
    if (sample?.surfaceElevation !== null) issues.push('LAND_SAMPLE_HAS_WATER_SURFACE');
    if (sample?.depth !== 0) issues.push('LAND_SAMPLE_HAS_DEPTH');
  }

  for (const field of ['turbidity', 'foamIntensity', 'wetnessTransfer']) {
    if (finite(sample?.[field]) && (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`FIELD_OUT_OF_RANGE:${field}`);
    }
  }

  for (const vectorField of ['flowDirection', 'waveDirection']) {
    const vector = sample?.[vectorField];
    if (!vector || !finite(vector.x) || !finite(vector.z)) {
      issues.push(`VECTOR_INVALID:${vectorField}`);
    } else if (sample?.waterPresent === true &&
        Math.abs(Math.hypot(vector.x, vector.z) - 1) > 1e-10) {
      issues.push(`VECTOR_NOT_NORMALIZED:${vectorField}`);
    }
  }

  H_EARTH_WATER_STATE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(sample ?? {}, field)) {
      issues.push(`FORBIDDEN_NATIVE_OUTPUT:${field}`);
    }
  });

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'WATER_STATE_SAMPLE_PASS'
      : 'WATER_STATE_SAMPLE_FAIL',
    contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    waterClass: sample?.waterClass ?? null,
    issues
  });
}

export function getHEarthWaterStateReceipt() {
  const sample = sampleHEarthWaterState(0, getHEarthCanonicalShorelineZ(0) + 36);
  const evaluation = evaluateHEarthWaterStateSample(sample);
  return deepFreeze({
    receiptType: 'H_EARTH_WATER_STATE_RUN_7D_SOURCE_RECEIPT',
    contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    waterStateRevision: H_EARTH_WATER_STATE_REVISION,
    eligible: evaluation.eligible,
    status: evaluation.eligible
      ? 'WATER_STATE_SOURCE_ELIGIBLE'
      : 'WATER_STATE_SOURCE_NOT_ELIGIBLE',
    waterClasses: H_EARTH_WATER_CLASSES,
    sourceContractIdentities: sample.sourceIdentities ?? null,
    rendererMutation: false,
    geometryMutation: false,
    publicRouteMutation: false,
    productPromotionClaim: false,
    liveVerificationClaim: false,
    issues: evaluation.issues
  });
}
