/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_v1
 *
 * Non-live environment presentation profile for the map-wide redevelopment
 * candidate. Historical path naming is retained by the admitted scope. No manor
 * geometry, runtime, camera, navigation, water, deployment, or release mutation
 * is performed.
 */

import {
  sampleHEarthMapWideEnvironmentPrecinct
} from '../zones/h-earth.gratitude-region-mirror-manor-precinct.v1.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const mix3 = (a, b, amount) => [
  a[0] * (1 - amount) + b[0] * amount,
  a[1] * (1 - amount) + b[1] * amount,
  a[2] * (1 - amount) + b[2] * amount
];

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_ID =
  'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_v1';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT = freeze({
  environmentId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_ID,
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  palette: {
    coastalLowland: [0.24, 0.34, 0.22],
    openMeadow: [0.36, 0.46, 0.25],
    estateMeadow: [0.43, 0.50, 0.29],
    woodland: [0.12, 0.24, 0.15],
    upland: [0.31, 0.35, 0.28],
    highlandRock: [0.36, 0.36, 0.34],
    exposedStone: [0.29, 0.30, 0.29],
    earth: [0.31, 0.25, 0.17]
  },
  atmosphere: {
    skyZenith: [0.29, 0.50, 0.74],
    skyHorizon: [0.72, 0.78, 0.76],
    groundHaze: [0.54, 0.59, 0.53],
    sunDirection: [-0.38, -0.82, -0.43],
    sunIntensity: 1.08,
    distanceHazeStart: 240,
    distanceHazeEnd: 610
  },
  vegetation: {
    meadowDensity: 0.58,
    woodlandDensity: 0.72,
    estateContextDensity: 0.66,
    highlandDensity: 0.18,
    treeScaleRange: [0.72, 1.48],
    noHardPlantingLayout: true,
    deterministicSamplingRequired: true
  },
  terrainMaterial: {
    macroContrast: 0.18,
    slopeRockStart: 0.34,
    slopeRockFull: 0.68,
    contourInterval: 4.5,
    contourStrength: 0.055,
    virtualNormalReliefProfile: 'H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v2'
  },
  limitations: [
    'NONPUBLIC_CANDIDATE_ONLY',
    'NO_LIVE_RUNTIME_MUTATION',
    'NO_WATER_MUTATION',
    'NO_MANOR_GEOMETRY_OR_ARCHITECTURE',
    'NO_DEPLOYMENT_OR_RELEASE'
  ]
});

function deterministicSignal(worldX, worldZ) {
  const signal = Math.sin(worldX * 12.9898 + worldZ * 78.233) * 43758.5453;
  return signal - Math.floor(signal);
}

export function sampleHEarthMapWideEnvironmentPresentation(worldX, worldZ) {
  const precinct = sampleHEarthMapWideEnvironmentPrecinct(worldX, worldZ);
  if (precinct?.valid !== true) {
    return freeze({
      valid: false,
      status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_PRESENTATION_REJECTED',
      worldX,
      worldZ,
      precinct
    });
  }

  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT;
  const weights = precinct.environmentalWeights;
  const terrain = precinct.terrain;
  const elevation = terrain.presentationElevation;
  const slope = terrain.normal
    ? clamp01(1 - Math.max(0, terrain.normal.y ?? 1))
    : 0;

  let base = profile.palette.openMeadow;
  base = mix3(base, profile.palette.coastalLowland, clamp01(weights.lowland * 0.72));
  base = mix3(base, profile.palette.woodland, clamp01(weights.woodland * 0.58));
  base = mix3(base, profile.palette.upland, clamp01(weights.highland * 0.55));
  base = mix3(base, profile.palette.highlandRock, clamp01(weights.highland * 0.78));
  base = mix3(base, profile.palette.exposedStone, clamp01(slope * 1.2));
  if (precinct.classId === 'ESTATE_CONTEXT' || precinct.classId === 'RESERVED_ESTATE_CORE') {
    base = mix3(base, profile.palette.estateMeadow, clamp01(0.42 + weights.estateContext * 0.34));
  }

  const naturalVariation = (deterministicSignal(worldX, worldZ) - 0.5) * 0.075;
  base = base.map((component) => clamp01(component + naturalVariation));

  const treeSuitability = clamp01(
    weights.woodland *
    (1 - weights.highland * 0.72) *
    (precinct.classId === 'ENTRY_REGION' ? 0.42 : 1) *
    (precinct.classId === 'RESERVED_ESTATE_CORE' ? 0.62 : 1)
  );
  const meadowSuitability = clamp01(
    weights.meadow *
    (precinct.classId === 'RESERVED_ESTATE_CORE' ? 1 : 0.84)
  );

  return freeze({
    valid: true,
    status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_PRESENTATION_COMPLETE',
    environmentId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_ID,
    worldX,
    worldZ,
    precinctClass: precinct.classId,
    presentationElevation: elevation,
    baseColorLinear: base,
    treeSuitability,
    meadowSuitability,
    estateContextWeight: weights.estateContext,
    terrain,
    manorGeometryConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentPresentation() {
  const witnesses = [
    [0, -96],
    [80, -172],
    [112.41666666666667, -194.83333333333334],
    [-64, -274],
    [-184, -212],
    [196, -252],
    [-120, -160]
  ].map(([x, z]) => sampleHEarthMapWideEnvironmentPresentation(x, z));

  const issues = [];
  if (witnesses.some((sample) => sample.valid !== true)) issues.push('ENVIRONMENT_WITNESS_INVALID');
  if (witnesses.some((sample) => !Array.isArray(sample.baseColorLinear) || sample.baseColorLinear.length !== 3)) {
    issues.push('ENVIRONMENT_COLOR_INVALID');
  }
  if (witnesses.some((sample) => sample.manorGeometryConstructed !== false)) issues.push('MANOR_SCOPE_VIOLATION');
  if (!witnesses.some((sample) => Math.abs(sample.terrain.presentationReliefOffset) >= 4)) {
    issues.push('MATERIAL_RELIEF_NOT_PRESENT_IN_ENVIRONMENT_WITNESSES');
  }

  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_EVALUATION_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    witnessCount: witnesses.length,
    witnesses,
    issues: freeze(issues)
  });
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT;
