/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_v1
 * Non-live environment presentation profile for terrain authoring. This
 * revision adds coastline/beach readability and hydrology-context materials
 * without mutating the live water, camera, navigation, or runtime systems.
 */

import { sampleHEarthMapWideEnvironmentPrecinct } from '../zones/h-earth.gratitude-region-mirror-manor-precinct.v1.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
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
  successorRepairRevision: 3,
  palette: {
    coastalLowland: [0.28, 0.38, 0.24],
    beachSand: [0.54, 0.47, 0.34],
    wetShore: [0.37, 0.36, 0.28],
    formerWaterline: [0.33, 0.39, 0.27],
    openMeadow: [0.35, 0.46, 0.25],
    estateMeadow: [0.42, 0.50, 0.29],
    preparedEarth: [0.35, 0.29, 0.19],
    reservoirBank: [0.30, 0.35, 0.23],
    cavernApproach: [0.28, 0.30, 0.25],
    woodland: [0.13, 0.25, 0.16],
    upland: [0.31, 0.35, 0.29],
    highlandRock: [0.39, 0.39, 0.37],
    exposedStone: [0.31, 0.32, 0.31],
    earth: [0.31, 0.25, 0.18]
  },
  waterPresentation: {
    ocean: [0.07, 0.30, 0.43, 0.74],
    reservoir: [0.08, 0.28, 0.34, 0.82],
    waterfall: [0.56, 0.76, 0.80, 0.90],
    staticAuthoringContextOnly: true,
    liveWaterMutation: false
  },
  atmosphere: {
    skyZenith: [0.29, 0.50, 0.74],
    skyHorizon: [0.72, 0.78, 0.76],
    groundHaze: [0.54, 0.59, 0.53],
    sunDirection: [-0.38, -0.82, -0.43],
    sunIntensity: 1.08,
    distanceHazeStart: 280,
    distanceHazeEnd: 690
  },
  vegetation: {
    meadowDensity: 0.58,
    woodlandDensity: 0.72,
    estateContextDensity: 0.66,
    highlandDensity: 0.18,
    preparedSiteTreeSuppression: 0.92,
    preparedSiteMeadowSuppression: 0.52,
    reservoirBankTreeSuppression: 0.74,
    treeScaleRange: [0.72, 1.48],
    noHardPlantingLayout: true,
    deterministicSamplingRequired: true
  },
  terrainMaterial: {
    macroContrast: 0.15,
    slopeRockStart: 0.32,
    slopeRockFull: 0.66,
    contourInterval: 0,
    contourStrength: 0,
    virtualNormalReliefProfile: 'H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v3',
    inspectorVirtualReliefScale: 0.42,
    geologicalContinuityPriority: true,
    preparedSiteMaterialVisibleWithoutOverlay: true
  },
  limitations: [
    'NONPUBLIC_CANDIDATE_ONLY',
    'NO_LIVE_RUNTIME_MUTATION',
    'NO_LIVE_WATER_MUTATION',
    'NO_MANOR_GEOMETRY_OR_ARCHITECTURE',
    'NO_CAVERN_OR_VAULT_INTERIOR',
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
  const sitePreparationWeight = clamp01(terrain.sitePreparation?.weight ?? 0);
  const slope = terrain.normal ? clamp01(1 - Math.max(0, terrain.normal.y ?? 1)) : 0;
  const reservoirWeight = clamp01(terrain.hydrology?.reservoirWeight ?? 0);
  const cavernWeight = clamp01(terrain.hydrology?.cavernReserveWeight ?? 0);

  const shoreHeightWeight = 1 - smoothstep(0.6, 6.4, Math.abs(elevation - 1.2));
  const beachWeight = clamp01(weights.coastal * shoreHeightWeight);
  const wetShoreWeight = clamp01(weights.coastal * (1 - smoothstep(0.2, 2.2, Math.abs(elevation - 0.35))));
  const formerWaterlineWeight = clamp01(weights.formerInundation * (1 - beachWeight * 0.55));

  let base = profile.palette.openMeadow;
  base = mix3(base, profile.palette.coastalLowland, clamp01(weights.lowland * 0.68));
  base = mix3(base, profile.palette.formerWaterline, formerWaterlineWeight * 0.34);
  base = mix3(base, profile.palette.beachSand, beachWeight * 0.92);
  base = mix3(base, profile.palette.wetShore, wetShoreWeight * 0.84);
  base = mix3(base, profile.palette.woodland, clamp01(weights.woodland * 0.56));
  base = mix3(base, profile.palette.upland, clamp01(weights.highland * 0.50));
  base = mix3(base, profile.palette.highlandRock, clamp01(weights.highland * 0.78));
  base = mix3(base, profile.palette.exposedStone, clamp01(slope * 1.12));
  base = mix3(base, profile.palette.reservoirBank, clamp01(reservoirWeight * 0.68));
  base = mix3(base, profile.palette.cavernApproach, clamp01(cavernWeight * 0.44));

  if (precinct.classId.startsWith('ESTATE_')) {
    base = mix3(base, profile.palette.estateMeadow, clamp01(0.34 + weights.estateContext * 0.32));
  }
  base = mix3(base, profile.palette.preparedEarth, sitePreparationWeight * 0.58);

  const naturalVariation =
    (deterministicSignal(worldX, worldZ) - 0.5) *
    0.048 *
    (1 - sitePreparationWeight * 0.58) *
    (1 - beachWeight * 0.55);
  base = base.map((component) => clamp01(component + naturalVariation));

  const treeSuitability = clamp01(
    weights.woodland *
    (1 - weights.highland * 0.70) *
    (precinct.classId === 'ENTRY_REGION' ? 0.46 : 1) *
    (1 - sitePreparationWeight * profile.vegetation.preparedSiteTreeSuppression) *
    (1 - reservoirWeight * profile.vegetation.reservoirBankTreeSuppression) *
    (1 - beachWeight * 0.92)
  );
  const meadowSuitability = clamp01(
    weights.meadow *
    (1 - sitePreparationWeight * profile.vegetation.preparedSiteMeadowSuppression) *
    (1 - beachWeight * 0.78)
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
    beachWeight,
    wetShoreWeight,
    formerWaterlineWeight,
    treeSuitability,
    meadowSuitability,
    estateContextWeight: weights.estateContext,
    sitePreparationWeight,
    terrain,
    manorGeometryConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentPresentation() {
  const witnesses = [
    [0, -96],
    [80, -172],
    [112.41666666666667, -194.83333333333334],
    [136, -208],
    [-44, -216],
    [-48, -250],
    [-16, -236],
    [-64, -300],
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
  if (!(witnesses[1].sitePreparationWeight > 0.9)) issues.push('ATRIUM_TERRAIN_PREPARATION_NOT_VISIBLE');
  if (!(witnesses[4].terrain.hydrology?.reservoirWeight > 0.9)) issues.push('RESERVOIR_CONTEXT_NOT_VISIBLE');

  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT_EVALUATION_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    successorRepairRevision: 3,
    witnessCount: witnesses.length,
    witnesses,
    issues: freeze(issues)
  });
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT;
