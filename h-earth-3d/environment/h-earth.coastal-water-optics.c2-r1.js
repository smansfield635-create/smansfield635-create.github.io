/**
 * H_EARTH_C2_R1_ACTUAL_DEPTH_WATER_OPTICS_v1
 *
 * Isolated R1.4 optical field. It consumes the accepted R1.1 coastal profile
 * and accepted R1.3 sediment memberships. Actual vertical water depth is the
 * controlling optical quantity. This file creates no geometry, wave, breaker,
 * foam, animation, renderer-loop, camera, traversal, route, or product authority.
 */

import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from '../terrain/h-earth.coastal-profile.c2-r1.js';

import {
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sampleHEarthC2R1ContinuousCoastalSedimentMembership
} from '../control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const mixColor = (a, b, t) => Object.freeze([
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t)
]);
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

export const H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID =
  'H_EARTH_C2_R1_ACTUAL_DEPTH_WATER_OPTICS_v1';

export const H_EARTH_C2_R1_WATER_OPTICS = freeze({
  contractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
  checkpoint: 'R1.4_ACTUAL_DEPTH_WATER_OPTICS',
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceSedimentContractId: H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  depthLaw: 'MAX_0_WATER_SURFACE_HEIGHT_MINUS_TERRAIN_HEIGHT',
  controllingQuantity: 'ACTUAL_VERTICAL_WATER_DEPTH',
  absorptionPerWorldUnit: freeze([0.34, 0.16, 0.075]),
  scatteringPerWorldUnit: 0.18,
  shallowVolumeColorLinear: freeze([0.035, 0.34, 0.40]),
  deepVolumeColorLinear: freeze([0.008, 0.045, 0.115]),
  neutralSurfaceReflectionLinear: freeze([0.055, 0.09, 0.13]),
  waterPresenceRampDepth: freeze({ start: 0.01, fullPresence: 0.34 }),
  ownership: freeze({
    ownsCandidateWaterOpticalProjection: true,
    ownsProductionWaterState: false,
    ownsGeometry: false,
    ownsNormals: false,
    ownsLighting: false,
    ownsSedimentMemberships: false,
    ownsBreakersOrFoam: false,
    ownsOceanAnimation: false,
    ownsRendererLifecycle: false,
    ownsCameraOrTraversal: false,
    ownsPublicRouteOrProductDefault: false
  })
});

function reject(worldX, worldZ, issues) {
  return freeze({
    valid: false,
    status: 'C2_R1_WATER_OPTICS_REJECTED',
    contractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
    worldX,
    worldZ,
    issues: freeze(issues)
  });
}

export function deriveHEarthC2R1WaterOpticsFromFactors({
  actualVerticalWaterDepth,
  seabedColorLinear,
  localSlope,
  signedInlandDistance,
  saturatedSedimentWeight,
  moistureEnvelope
}) {
  if (!finite(actualVerticalWaterDepth) || actualVerticalWaterDepth < 0 ||
      !Array.isArray(seabedColorLinear) || seabedColorLinear.length !== 3 ||
      !seabedColorLinear.every(finite) || !finite(localSlope) ||
      !finite(signedInlandDistance) || !finite(saturatedSedimentWeight) ||
      !finite(moistureEnvelope)) {
    return null;
  }

  const depth = actualVerticalWaterDepth;
  if (depth <= 0.01) {
    return freeze({
      waterPresent: false,
      actualVerticalWaterDepth: depth,
      spectralTransmission: freeze([1, 1, 1]),
      meanTransmission: 1,
      seabedVisibility: 1,
      shallowTurquoiseStrength: 0,
      deepWaterDarkening: 0,
      suspendedSediment: 0,
      surfaceOpacity: 0,
      surfaceColorLinear: freeze([0, 0, 0]),
      absorptionDepthDriven: true,
      transparencyDepthDriven: true,
      deepWaterDarkeningDepthDriven: true
    });
  }

  const slope = Math.max(0, localSlope);
  const saturated = clamp01(saturatedSedimentWeight);
  const moisture = clamp01(moistureEnvelope);
  const shorelineContact = Math.exp(
    -0.5 * Math.pow(signedInlandDistance / 22, 2)
  );
  const suspendedSediment = clamp01(
    0.025 +
    0.10 * shorelineContact +
    0.12 * saturated * smoothstep(0.02, 0.18, slope) +
    0.05 * moisture
  );

  const shallowTurquoiseStrength =
    smoothstep(0.03, 0.35, depth) *
    (1 - smoothstep(1.4, 3.8, depth));
  const deepWaterDarkening = smoothstep(1.2, 6.0, depth);

  const spectralTransmission = H_EARTH_C2_R1_WATER_OPTICS.absorptionPerWorldUnit
    .map((coefficient) =>
      Math.exp(-(coefficient + suspendedSediment * 0.42) * depth)
    );
  const meanTransmission =
    spectralTransmission.reduce((sum, value) => sum + value, 0) / 3;
  const seabedVisibility = clamp01(
    Math.exp(-(0.40 + 1.35 * suspendedSediment) * depth) *
    (0.96 - 0.35 * suspendedSediment)
  );

  const volumeColor = mixColor(
    H_EARTH_C2_R1_WATER_OPTICS.shallowVolumeColorLinear,
    H_EARTH_C2_R1_WATER_OPTICS.deepVolumeColorLinear,
    deepWaterDarkening
  ).map((channel) => channel * (0.75 + 0.25 * shallowTurquoiseStrength));

  const reflectionStrength = 0.06 + 0.05 * (1 - deepWaterDarkening);
  const surfaceColorLinear = freeze([0, 1, 2].map((channel) => clamp01(
    seabedColorLinear[channel] * spectralTransmission[channel] * seabedVisibility +
    volumeColor[channel] * (1 - seabedVisibility) +
    H_EARTH_C2_R1_WATER_OPTICS.neutralSurfaceReflectionLinear[channel] *
      reflectionStrength
  )));

  const waterPresence = smoothstep(
    H_EARTH_C2_R1_WATER_OPTICS.waterPresenceRampDepth.start,
    H_EARTH_C2_R1_WATER_OPTICS.waterPresenceRampDepth.fullPresence,
    depth
  );
  const surfaceOpacity = waterPresence * clamp(
    0.14 + 0.75 * (1 - seabedVisibility) + 0.08 * deepWaterDarkening,
    0,
    0.96
  );

  return freeze({
    waterPresent: true,
    actualVerticalWaterDepth: depth,
    spectralTransmission: freeze(spectralTransmission),
    meanTransmission,
    seabedVisibility,
    shallowTurquoiseStrength,
    deepWaterDarkening,
    suspendedSediment,
    waterPresence,
    surfaceOpacity,
    surfaceColorLinear,
    absorptionDepthDriven: true,
    transparencyDepthDriven: true,
    deepWaterDarkeningDepthDriven: true
  });
}

export function sampleHEarthC2R1CoastalWaterOptics(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return reject(worldX, worldZ, ['WATER_OPTICS_INPUT_NOT_FINITE']);
  }

  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  const sediment = sampleHEarthC2R1ContinuousCoastalSedimentMembership(worldX, worldZ);
  if (terrain?.valid !== true || sediment?.valid !== true || !terrain.coastalFrame) {
    return reject(worldX, worldZ, ['R1_1_OR_R1_3_INPUT_NOT_ELIGIBLE']);
  }

  const exactDepth = Math.max(0, terrain.seaLevelY - terrain.elevation);
  if (Math.abs(exactDepth - terrain.actualVerticalWaterDepth) > 1e-12) {
    return reject(worldX, worldZ, ['ACTUAL_VERTICAL_DEPTH_IDENTITY_MISMATCH']);
  }

  const factors = deriveHEarthC2R1WaterOpticsFromFactors({
    actualVerticalWaterDepth: exactDepth,
    seabedColorLinear: sediment.material.colorLinear,
    localSlope: sediment.localSlope,
    signedInlandDistance: terrain.coastalFrame.signedInlandDistance,
    saturatedSedimentWeight:
      sediment.weights.SATURATED_OR_SUBMERGED_SAND,
    moistureEnvelope: sediment.moistureEnvelope
  });

  if (!factors) {
    return reject(worldX, worldZ, ['WATER_OPTICS_FACTOR_DERIVATION_FAILED']);
  }

  return freeze({
    valid: true,
    status: 'C2_R1_WATER_OPTICS_SAMPLE_COMPLETE',
    contractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
    sourceProfileContractId: terrain.contractId,
    sourceSedimentContractId: sediment.contractId,
    world: freeze({ x: worldX, y: terrain.seaLevelY, z: worldZ }),
    terrainElevation: terrain.elevation,
    waterSurfaceHeight: terrain.seaLevelY,
    actualVerticalWaterDepth: exactDepth,
    signedInlandDistance: terrain.coastalFrame.signedInlandDistance,
    seabedMaterialColorLinear: sediment.material.colorLinear,
    ...factors,
    breakerEligibilityDeferredToCheckpoint:
      'R1.5_DEPTH_AND_SLOPE_ALIGNED_BREAKERS',
    geometryMutated: false,
    normalsMutated: false,
    lightingMutated: false,
    sedimentMembershipsMutated: false,
    breakersOrFoamCreated: false,
    oceanAnimationCreated: false,
    rendererLifecycleMutated: false,
    cameraOrTraversalMutated: false,
    productDefaultMutated: false,
    publicRouteMutated: false,
    issues: freeze([])
  });
}

export function evaluateHEarthC2R1WaterOptics(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('WATER_OPTICS_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID) {
    issues.push('WATER_OPTICS_CONTRACT_MISMATCH');
  }
  for (const field of [
    'actualVerticalWaterDepth',
    'meanTransmission',
    'seabedVisibility',
    'shallowTurquoiseStrength',
    'deepWaterDarkening',
    'suspendedSediment',
    'surfaceOpacity'
  ]) {
    if (!finite(sample?.[field])) issues.push(`WATER_OPTICS_NONFINITE:${field}`);
  }
  for (const field of [
    'meanTransmission',
    'seabedVisibility',
    'shallowTurquoiseStrength',
    'deepWaterDarkening',
    'suspendedSediment',
    'surfaceOpacity'
  ]) {
    if (finite(sample?.[field]) && (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`WATER_OPTICS_RANGE:${field}`);
    }
  }
  if (!Array.isArray(sample?.surfaceColorLinear) ||
      sample.surfaceColorLinear.length !== 3 ||
      !sample.surfaceColorLinear.every((value) => finite(value) && value >= 0 && value <= 1)) {
    issues.push('WATER_OPTICS_COLOR_INVALID');
  }
  if (sample?.geometryMutated !== false || sample?.normalsMutated !== false ||
      sample?.sedimentMembershipsMutated !== false ||
      sample?.breakersOrFoamCreated !== false ||
      sample?.rendererLifecycleMutated !== false ||
      sample?.productDefaultMutated !== false ||
      sample?.publicRouteMutated !== false) {
    issues.push('WATER_OPTICS_AUTHORITY_LEAK');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'C2_R1_WATER_OPTICS_PASS'
      : 'C2_R1_WATER_OPTICS_FAIL',
    contractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
    issues: freeze(issues)
  });
}

export default sampleHEarthC2R1CoastalWaterOptics;
