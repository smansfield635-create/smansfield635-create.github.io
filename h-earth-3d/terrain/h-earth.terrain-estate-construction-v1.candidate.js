/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1
 *
 * First product carrier for the fresh map-wide H-Earth environment redevelopment.
 *
 * This candidate preserves the current Run 8B terrain field as geometric truth and
 * adds a deterministic, band-limited virtual-relief presentation contract derived
 * from the user-accepted V2 relief direction at commit
 * 97003e9de386a8962fb46d0b370005b900a167d6.
 *
 * It does not mutate terrain elevation, camera, navigation, water, runtime,
 * registry, manor geometry, Frontier Plains, Cavern interior, deployment, or
 * release state.
 */

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from './h-earth.successor-terrain-field.run8b.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID =
  'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID =
  'H_EARTH_MAP_WIDE_BAND_LIMITED_VIRTUAL_RELIEF_PROFILE_v1';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE = freeze({
  profileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  sourceIdentity: {
    classification: 'POSITIVE_DESIGN_SOURCE_NOT_MERGED_MAIN_NOT_AUTOMATIC_TRANSPLANT',
    commit: '97003e9de386a8962fb46d0b370005b900a167d6',
    tree: '7cd51523649788ad6fb226aea16f6799a5c58177',
    sourceProfileId: 'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2'
  },
  implementationClass:
    'ADDITIVE_BAND_LIMITED_VIRTUAL_RELIEF_ON_UNCHANGED_RUN8B_GEOMETRIC_TRUTH',
  directionalPhases: [
    {
      id: 'A',
      direction: {
        x: 0.8164965809277260,
        y: 0.4082482904638630,
        z: 0.4082482904638630
      },
      frequency: 3.306939635357677,
      offset: 0.37,
      weight: 0.50
    },
    {
      id: 'B',
      direction: {
        x: -0.4082482904638630,
        y: 0.8164965809277260,
        z: 0.4082482904638630
      },
      frequency: 2.7318196987737333,
      offset: 2.17,
      weight: 0.30
    },
    {
      id: 'C',
      direction: {
        x: 0.4082482904638630,
        y: -0.4082482904638630,
        z: 0.8164965809277260
      },
      frequency: 2.243994752564138,
      offset: 4.11,
      weight: 0.20
    }
  ],
  virtualReliefHeightAmplitude: 0.22,
  maximumNormalDeviationDegrees: 22,
  maximumNormalDeviationCosine: 0.9271838545667874,
  maximumNormalDeviationSine: 0.3746065934159120,
  antialiasFootprint: {
    fullThrough: 0.45,
    zeroBy: 0.95
  },
  distanceEnvelope: {
    fullInfluenceThrough: 120,
    zeroInfluenceBy: 300
  },
  slopeEnvelope: {
    minimumInfluence: 0.82,
    maximumInfluence: 1.0,
    responseStart: 0.05,
    responseEnd: 0.55
  },
  geometricElevationMutation: false,
  geometricNormalMutation: false,
  presentationNormalPerturbation: true,
  deterministic: true
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE = freeze({
  contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  governingHead: '3f51f0cd159df33571905c6cb14253ebdd137e3b',
  baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  baseTerrainFieldGenerationRevision:
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  worldDomain: {
    ...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain
  },
  reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  mapWideApplication: 'ALL_VALID_RUN8B_TERRAIN_SAMPLES',
  reservedEstateEnvelope: {
    center: { x: 80, z: -172 },
    bounds: {
      xMinimum: 64,
      xMaximum: 96,
      zMinimum: -188,
      zMaximum: -156
    },
    effect: 'PROTECTED_FUTURE_CONSTRUCTION_ENVELOPE_ONLY',
    manorGeometryConstructed: false
  },
  preservation: {
    run8BGeometryElevationMutated: false,
    run8BSourceMutated: false,
    liveRuntimeMutated: false,
    cameraMutated: false,
    navigationMutated: false,
    waterMutated: false,
    registryMutated: false,
    manorGeometryConstructed: false,
    frontierPlainsConstructed: false,
    cavernInteriorConstructed: false,
    deploymentOrReleaseCreated: false
  }
});

export function sampleHEarthMapWideReliefSignal(worldX, worldY, worldZ) {
  if (![worldX, worldY, worldZ].every(finite)) return Number.NaN;
  let signal = 0;
  for (const phase of H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.directionalPhases) {
    const dot =
      worldX * phase.direction.x +
      worldY * phase.direction.y +
      worldZ * phase.direction.z;
    signal += Math.sin(dot * phase.frequency + phase.offset) * phase.weight;
  }
  return signal;
}

export function sampleHEarthMapWideVirtualReliefHeight(worldX, worldY, worldZ) {
  const signal = sampleHEarthMapWideReliefSignal(worldX, worldY, worldZ);
  return finite(signal)
    ? signal * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualReliefHeightAmplitude
    : Number.NaN;
}

export function resolveHEarthMapWideReliefEnvelope({
  distanceToCamera,
  slope,
  maximumPhaseFootprint = 0
} = {}) {
  if (![distanceToCamera, slope, maximumPhaseFootprint].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  const distanceEnvelope = 1 - smoothstep(
    profile.distanceEnvelope.fullInfluenceThrough,
    profile.distanceEnvelope.zeroInfluenceBy,
    Math.max(0, distanceToCamera)
  );
  const slopeEnvelope = mix(
    profile.slopeEnvelope.minimumInfluence,
    profile.slopeEnvelope.maximumInfluence,
    smoothstep(
      profile.slopeEnvelope.responseStart,
      profile.slopeEnvelope.responseEnd,
      clamp(slope, 0, 1)
    )
  );
  const antialiasEnvelope = 1 - smoothstep(
    profile.antialiasFootprint.fullThrough,
    profile.antialiasFootprint.zeroBy,
    Math.max(0, maximumPhaseFootprint)
  );
  return clamp(distanceEnvelope * slopeEnvelope * antialiasEnvelope, 0, 1);
}

export function isInsideHEarthReservedEstateEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return false;
  const bounds =
    H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE
      .reservedEstateEnvelope.bounds;
  return worldX >= bounds.xMinimum &&
    worldX <= bounds.xMaximum &&
    worldZ >= bounds.zMinimum &&
    worldZ <= bounds.zMaximum;
}

export function sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ) {
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) {
    return freeze({
      valid: false,
      status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_REJECTED',
      contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      worldX,
      worldZ,
      sourceStatus: source?.status ?? null
    });
  }

  const reliefSignal = sampleHEarthMapWideReliefSignal(
    source.world.x,
    source.elevation,
    source.world.z
  );
  const virtualReliefHeight =
    reliefSignal *
    H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualReliefHeightAmplitude;

  return freeze({
    valid: true,
    status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    sourceContractId: source.contractId,
    sourceGenerationRevision: source.generationRevision,
    world: { ...source.world },
    elevation: source.elevation,
    geometricElevation: source.elevation,
    geometricElevationMutated: false,
    normal: source.normal ? { ...source.normal } : null,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    reliefSignal,
    virtualReliefHeight,
    virtualReliefOnly: true,
    insideReservedEstateEnvelope:
      isInsideHEarthReservedEstateEnvelope(source.world.x, source.world.z),
    manorGeometryConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentTerrainCandidate() {
  const domain = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE.worldDomain;
  const issues = [];
  const witnesses = [
    [domain.xMinimum, domain.zMinimum],
    [-224, -292],
    [-92, -271],
    [0, -256],
    [76, -168],
    [80, -172],
    [112.41666666666667, -194.83333333333334],
    [152, -224],
    [0, -96],
    [domain.xMaximum, domain.zMaximum]
  ].map(([x, z]) => sampleHEarthMapWideEnvironmentTerrainCandidate(x, z));

  if (witnesses.some((sample) => sample.valid !== true)) {
    issues.push('MAP_WIDE_WITNESS_SAMPLE_INVALID');
  }
  if (witnesses.some((sample) => !finite(sample.elevation))) {
    issues.push('MAP_WIDE_WITNESS_ELEVATION_NONFINITE');
  }
  if (witnesses.some((sample) => sample.geometricElevationMutated !== false)) {
    issues.push('RUN8B_GEOMETRIC_TRUTH_MUTATED');
  }
  if (witnesses.some((sample) => !finite(sample.virtualReliefHeight))) {
    issues.push('VIRTUAL_RELIEF_WITNESS_NONFINITE');
  }

  const estateWitness = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  if (estateWitness.insideReservedEstateEnvelope !== true) {
    issues.push('RESERVED_ESTATE_ENVELOPE_IDENTITY_FAILED');
  }
  if (estateWitness.manorGeometryConstructed !== false) {
    issues.push('MANOR_GEOMETRY_SCOPE_VIOLATION');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_PASS'
      : 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_FAIL',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    mapWideWitnessCount: witnesses.length,
    witnesses,
    geometryElevationMutation: false,
    manorGeometryConstructed: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE;
