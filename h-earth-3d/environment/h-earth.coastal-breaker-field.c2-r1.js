/**
 * H_EARTH_C2_R1_DEPTH_AND_SLOPE_ALIGNED_BREAKER_FIELD_v1
 *
 * Isolated R1.5 breaker-eligibility and breaker-intensity projection. It
 * consumes accepted R1.1 geometry, R1.2 surface gradients, and R1.4 actual-
 * depth water optics as immutable inputs. Breaking activity is admitted only
 * where incoming waves encounter shallow water and a rising, physically
 * compatible seabed. This authority creates no visible foam, swash, wetness,
 * open-ocean displacement, renderer lifecycle, camera, route, or product
 * mutation.
 */

import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from '../terrain/h-earth.coastal-profile.c2-r1.js';

import {
  H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
  sampleHEarthC2R1CoastalSurfaceFrame
} from '../terrain/h-earth.coastal-surface-frame.c2-r1.js';

import {
  H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
  sampleHEarthC2R1CoastalWaterOptics
} from './h-earth.coastal-water-optics.c2-r1.js';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const normalizeXZ = ({ x, z }) => {
  const length = Math.hypot(x, z);
  if (!(length > Number.EPSILON)) return null;
  return freeze({ x: x / length, z: z / length });
};
const dotXZ = (left, right) => left.x * right.x + left.z * right.z;

export const H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID =
  'H_EARTH_C2_R1_DEPTH_AND_SLOPE_ALIGNED_BREAKER_FIELD_v1';

export const H_EARTH_C2_R1_BREAKER_FIELD = freeze({
  contractId: H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
  checkpoint: 'R1.5_DEPTH_AND_SLOPE_ALIGNED_BREAKERS',
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceSurfaceFrameContractId:
    H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
  sourceWaterOpticsContractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
  controllingInputs: freeze([
    'LOCAL_WATER_DEPTH',
    'SEABED_SLOPE',
    'DEPTH_CHANGE_RATE',
    'WAVE_DIRECTION',
    'SHORELINE_ORIENTATION'
  ]),
  shorelineDistanceOnlyDriver: false,
  directionalDepthSampleStepWorldUnits: 1,
  depthThresholds: freeze({
    shorelineTerminationStart: 0.02,
    fullWaterPresenceDepth: 0.36,
    upperBreakingFadeStart: 2.45,
    maximumBreakingDepth: 3.35,
    deepWaterAbsenceDepth: 3.5
  }),
  slopeThresholds: freeze({
    minimumCompatibleSlope: 0.004,
    fullCompatibleSlope: 0.045,
    steepFadeStart: 0.24,
    maximumCompatibleSlope: 0.44
  }),
  riseThresholds: freeze({
    minimumDirectionalRise: 0.003,
    fullDirectionalRise: 0.045,
    agreementToleranceStart: 0.012,
    agreementToleranceEnd: 0.06
  }),
  waveApproach: freeze({
    regionalBaseDirection: freeze({ x: 0.16, z: -1 }),
    broadAlongshoreVariation: 0.07,
    secondaryAlongshoreVariation: 0.025,
    shallowRefractionMinimum: 0.18,
    shallowRefractionMaximum: 0.73,
    shallowRefractionStartDepth: 0.55,
    shallowRefractionEndDepth: 4.8
  }),
  crestPhase: freeze({
    wavelengthWorldUnits: 19,
    broadPhaseWarp: 0.4,
    minimumIntensityMultiplier: 0.9,
    maximumIntensityMultiplier: 1
  }),
  ownership: freeze({
    ownsBreakerEligibilityField: true,
    ownsBreakerIntensityField: true,
    ownsWaveApproachDirection: true,
    ownsBreakerCrestPhaseParameters: true,
    ownsVisibleFoam: false,
    ownsSwash: false,
    ownsTemporaryWetness: false,
    ownsGeometry: false,
    ownsNormals: false,
    ownsSedimentMemberships: false,
    ownsWaterOptics: false,
    ownsOpenOceanDisplacement: false,
    ownsRendererLifecycle: false,
    ownsCameraOrTraversal: false,
    ownsPublicRouteOrProductDefault: false
  })
});

function zeroResponse(depth = 0) {
  return freeze({
    waterPresent: false,
    actualVerticalWaterDepth: Math.max(0, depth),
    depthWithinBreakingRange: false,
    seabedRisesAlongIncomingWaveDirection: false,
    localSlopePhysicallyCompatible: false,
    breakerEligibility: 0,
    breakerIntensity: 0,
    shorelineTermination: 0,
    depthCompatibility: 0,
    shallownessStrength: 0,
    sampledSeabedRiseRate: 0,
    projectedSeabedRiseRate: 0,
    physicalSeabedRiseRate: 0,
    riseAgreement: 0,
    riseCompatibility: 0,
    slopeCompatibility: 0,
    orientationCompatibility: 0,
    phaseIntensityMultiplier: 0,
    luminous: false
  });
}

export function deriveHEarthC2R1BreakerResponseFromFactors({
  actualVerticalWaterDepth,
  localSlope,
  directionalDepthChangeRate,
  directionalSeabedRiseRate,
  shorelineOrientationAlignment,
  waveEnergy = 1,
  crestPhase = 0
}) {
  if (!finite(actualVerticalWaterDepth) || actualVerticalWaterDepth < 0 ||
      !finite(localSlope) || localSlope < 0 ||
      !finite(directionalDepthChangeRate) ||
      !finite(directionalSeabedRiseRate) ||
      !finite(shorelineOrientationAlignment) ||
      !finite(waveEnergy) ||
      !finite(crestPhase)) {
    return null;
  }

  const depth = actualVerticalWaterDepth;
  if (!(depth > 0)) return zeroResponse(depth);

  const slope = Math.max(0, localSlope);
  const alignment = clamp01(shorelineOrientationAlignment);
  const energy = clamp(waveEnergy, 0, 1.25);
  const phase = clamp(crestPhase, -1, 1);

  const sampledSeabedRiseRate = Math.max(0, -directionalDepthChangeRate);
  const projectedSeabedRiseRate = Math.max(0, directionalSeabedRiseRate);
  const riseDifference = Math.abs(
    sampledSeabedRiseRate - projectedSeabedRiseRate
  );
  const riseAgreement = 1 - smoothstep(
    H_EARTH_C2_R1_BREAKER_FIELD.riseThresholds.agreementToleranceStart,
    H_EARTH_C2_R1_BREAKER_FIELD.riseThresholds.agreementToleranceEnd,
    riseDifference
  );
  const physicalSeabedRiseRate =
    Math.min(sampledSeabedRiseRate, projectedSeabedRiseRate) *
    (0.78 + 0.22 * riseAgreement);

  const depthThresholds = H_EARTH_C2_R1_BREAKER_FIELD.depthThresholds;
  const shorelineTermination = smoothstep(
    depthThresholds.shorelineTerminationStart,
    depthThresholds.fullWaterPresenceDepth,
    depth
  );
  const deepWaterExclusion = 1 - smoothstep(
    depthThresholds.upperBreakingFadeStart,
    depthThresholds.maximumBreakingDepth,
    depth
  );
  const depthCompatibility = shorelineTermination * deepWaterExclusion;
  const shallownessStrength = 1 - smoothstep(0.55, 3.2, depth);

  const riseThresholds = H_EARTH_C2_R1_BREAKER_FIELD.riseThresholds;
  const riseCompatibility = smoothstep(
    riseThresholds.minimumDirectionalRise,
    riseThresholds.fullDirectionalRise,
    physicalSeabedRiseRate
  );

  const slopeThresholds = H_EARTH_C2_R1_BREAKER_FIELD.slopeThresholds;
  const slopeCompatibility =
    smoothstep(
      slopeThresholds.minimumCompatibleSlope,
      slopeThresholds.fullCompatibleSlope,
      slope
    ) *
    (1 - smoothstep(
      slopeThresholds.steepFadeStart,
      slopeThresholds.maximumCompatibleSlope,
      slope
    ));

  const orientationCompatibility = smoothstep(0.35, 0.92, alignment);
  const breakerEligibility = clamp01(
    depthCompatibility *
    riseCompatibility *
    slopeCompatibility *
    orientationCompatibility
  );

  const phaseIntensityMultiplier = mix(
    H_EARTH_C2_R1_BREAKER_FIELD.crestPhase.minimumIntensityMultiplier,
    H_EARTH_C2_R1_BREAKER_FIELD.crestPhase.maximumIntensityMultiplier,
    0.5 + 0.5 * phase
  );

  const breakerIntensity = clamp01(
    breakerEligibility *
    (0.42 + 0.58 * shallownessStrength) *
    (0.45 + 0.55 * riseCompatibility) *
    energy *
    phaseIntensityMultiplier
  );

  return freeze({
    waterPresent: true,
    actualVerticalWaterDepth: depth,
    depthWithinBreakingRange: depthCompatibility > 0,
    seabedRisesAlongIncomingWaveDirection:
      sampledSeabedRiseRate > 0 && projectedSeabedRiseRate > 0,
    localSlopePhysicallyCompatible: slopeCompatibility > 0,
    breakerEligibility,
    breakerIntensity,
    shorelineTermination,
    depthCompatibility,
    shallownessStrength,
    sampledSeabedRiseRate,
    projectedSeabedRiseRate,
    physicalSeabedRiseRate,
    riseAgreement,
    riseCompatibility,
    slopeCompatibility,
    orientationCompatibility,
    phaseIntensityMultiplier,
    luminous: false
  });
}

function deriveRegionalIncomingWaveDirection(anchorX) {
  const wave = H_EARTH_C2_R1_BREAKER_FIELD.waveApproach;
  return normalizeXZ({
    x:
      wave.regionalBaseDirection.x +
      wave.broadAlongshoreVariation * Math.sin((anchorX + 21) / 113) +
      wave.secondaryAlongshoreVariation * Math.sin((anchorX - 37) / 61),
    z: wave.regionalBaseDirection.z
  });
}

function deriveWaveApproach(terrain) {
  const frame = terrain.coastalFrame;
  if (!frame) return null;

  const shorewardNormal = freeze({
    x: -frame.waterwardNormal.x,
    z: -frame.waterwardNormal.z
  });
  const regionalIncomingDirection =
    deriveRegionalIncomingWaveDirection(frame.anchorX);
  if (!regionalIncomingDirection) return null;

  const wave = H_EARTH_C2_R1_BREAKER_FIELD.waveApproach;
  const shallowRefraction =
    1 - smoothstep(
      wave.shallowRefractionStartDepth,
      wave.shallowRefractionEndDepth,
      terrain.actualVerticalWaterDepth
    );
  const refractionStrength = mix(
    wave.shallowRefractionMinimum,
    wave.shallowRefractionMaximum,
    shallowRefraction
  );
  const incomingWaveDirection = normalizeXZ({
    x:
      regionalIncomingDirection.x * (1 - refractionStrength) +
      shorewardNormal.x * refractionStrength,
    z:
      regionalIncomingDirection.z * (1 - refractionStrength) +
      shorewardNormal.z * refractionStrength
  });
  if (!incomingWaveDirection) return null;

  const shorelineOrientationAlignment = clamp01(
    dotXZ(incomingWaveDirection, shorewardNormal)
  );
  const crestDirection = freeze({
    x: -incomingWaveDirection.z,
    z: incomingWaveDirection.x
  });

  return freeze({
    regionalIncomingDirection,
    incomingWaveDirection,
    crestDirection,
    shorelineTangent: frame.tangent,
    shorewardNormal,
    shorelineOrientationAlignment,
    refractionStrength
  });
}

function sampleDirectionalDepthChange(worldX, worldZ, incomingWaveDirection) {
  const step =
    H_EARTH_C2_R1_BREAKER_FIELD.directionalDepthSampleStepWorldUnits;
  const ahead = sampleHEarthC2R1CoastalTerrainField(
    worldX + incomingWaveDirection.x * step,
    worldZ + incomingWaveDirection.z * step
  );
  const behind = sampleHEarthC2R1CoastalTerrainField(
    worldX - incomingWaveDirection.x * step,
    worldZ - incomingWaveDirection.z * step
  );
  if (ahead?.valid !== true || behind?.valid !== true) return null;

  return freeze({
    step,
    depthAhead: ahead.actualVerticalWaterDepth,
    depthBehind: behind.actualVerticalWaterDepth,
    directionalDepthChangeRate:
      (ahead.actualVerticalWaterDepth - behind.actualVerticalWaterDepth) /
      (2 * step)
  });
}

function deriveWaveEnergy(anchorX, shorelineOrientationAlignment) {
  const broad =
    0.82 +
    0.10 * Math.sin((anchorX + 11) / 83) +
    0.05 * Math.sin((anchorX - 27) / 37);
  return clamp(
    broad * (0.82 + 0.18 * shorelineOrientationAlignment),
    0.65,
    1
  );
}

function deriveCrestPhase(worldX, worldZ, waveApproach, anchorX) {
  const phase = H_EARTH_C2_R1_BREAKER_FIELD.crestPhase;
  const coordinate =
    worldX * waveApproach.crestDirection.x +
    worldZ * waveApproach.crestDirection.z;
  const radians =
    coordinate * (2 * Math.PI / phase.wavelengthWorldUnits) +
    phase.broadPhaseWarp * Math.sin((anchorX + 8) / 71);
  return Math.sin(radians);
}

function reject(worldX, worldZ, issues) {
  return freeze({
    valid: false,
    status: 'C2_R1_BREAKER_FIELD_REJECTED',
    contractId: H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
    worldX,
    worldZ,
    issues: freeze(issues)
  });
}

export function sampleHEarthC2R1CoastalBreakerField(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return reject(worldX, worldZ, ['BREAKER_FIELD_INPUT_NOT_FINITE']);
  }

  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  const surface = sampleHEarthC2R1CoastalSurfaceFrame(worldX, worldZ);
  const optics = sampleHEarthC2R1CoastalWaterOptics(worldX, worldZ);
  if (terrain?.valid !== true || surface?.valid !== true ||
      optics?.valid !== true || !terrain.coastalFrame) {
    return reject(worldX, worldZ, [
      'R1_1_R1_2_OR_R1_4_INPUT_NOT_ELIGIBLE'
    ]);
  }

  if (Math.abs(
    terrain.actualVerticalWaterDepth - optics.actualVerticalWaterDepth
  ) > 1e-12) {
    return reject(worldX, worldZ, ['R1_4_ACTUAL_DEPTH_IDENTITY_MISMATCH']);
  }

  const waveApproach = deriveWaveApproach(terrain);
  if (!waveApproach) {
    return reject(worldX, worldZ, ['WAVE_APPROACH_DIRECTION_INVALID']);
  }

  const directionalDepth = sampleDirectionalDepthChange(
    worldX,
    worldZ,
    waveApproach.incomingWaveDirection
  );
  if (!directionalDepth) {
    return reject(worldX, worldZ, ['DIRECTIONAL_DEPTH_SAMPLE_INVALID']);
  }

  const directionalSeabedRiseRate =
    surface.gradient.x * waveApproach.incomingWaveDirection.x +
    surface.gradient.z * waveApproach.incomingWaveDirection.z;
  const waveEnergy = deriveWaveEnergy(
    terrain.coastalFrame.anchorX,
    waveApproach.shorelineOrientationAlignment
  );
  const crestPhase = deriveCrestPhase(
    worldX,
    worldZ,
    waveApproach,
    terrain.coastalFrame.anchorX
  );

  const response = deriveHEarthC2R1BreakerResponseFromFactors({
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    localSlope: surface.slope,
    directionalDepthChangeRate:
      directionalDepth.directionalDepthChangeRate,
    directionalSeabedRiseRate,
    shorelineOrientationAlignment:
      waveApproach.shorelineOrientationAlignment,
    waveEnergy,
    crestPhase
  });
  if (!response) {
    return reject(worldX, worldZ, ['BREAKER_RESPONSE_DERIVATION_FAILED']);
  }

  return freeze({
    valid: true,
    status: 'C2_R1_BREAKER_FIELD_SAMPLE_COMPLETE',
    contractId: H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
    sourceProfileContractId: terrain.contractId,
    sourceSurfaceFrameContractId: surface.contractId,
    sourceWaterOpticsContractId: optics.contractId,
    world: freeze({
      x: worldX,
      y: optics.waterSurfaceHeight,
      z: worldZ
    }),
    signedInlandDistance: terrain.coastalFrame.signedInlandDistance,
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    localSlope: surface.slope,
    waveApproach,
    directionalDepth,
    directionalSeabedRiseRate,
    waveEnergy,
    crestPhase,
    ...response,
    breakerEligible: response.breakerEligibility > 0.05,
    fullSwashDeferredToCheckpoint:
      'R1.6_RESTRAINED_SWASH_FOAM_AND_WETNESS',
    visibleFoamCreated: false,
    swashCreated: false,
    temporaryWetnessCreated: false,
    luminousStripCreated: false,
    geometryMutated: false,
    normalsMutated: false,
    sedimentMembershipsMutated: false,
    waterOpticsMutated: false,
    openOceanDisplacementCreated: false,
    rendererLifecycleMutated: false,
    cameraOrTraversalMutated: false,
    productDefaultMutated: false,
    publicRouteMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    issues: freeze([])
  });
}

export function evaluateHEarthC2R1BreakerField(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('BREAKER_FIELD_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID) {
    issues.push('BREAKER_FIELD_CONTRACT_MISMATCH');
  }

  for (const field of [
    'actualVerticalWaterDepth',
    'localSlope',
    'directionalSeabedRiseRate',
    'waveEnergy',
    'crestPhase',
    'breakerEligibility',
    'breakerIntensity'
  ]) {
    if (!finite(sample?.[field])) issues.push(`BREAKER_FIELD_NONFINITE:${field}`);
  }

  for (const field of [
    'breakerEligibility',
    'breakerIntensity',
    'shorelineTermination',
    'depthCompatibility',
    'shallownessStrength',
    'riseAgreement',
    'riseCompatibility',
    'slopeCompatibility',
    'orientationCompatibility',
    'phaseIntensityMultiplier'
  ]) {
    if (finite(sample?.[field]) && (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`BREAKER_FIELD_RANGE:${field}`);
    }
  }

  const direction = sample?.waveApproach?.incomingWaveDirection;
  if (!direction || !finite(direction.x) || !finite(direction.z) ||
      Math.abs(Math.hypot(direction.x, direction.z) - 1) > 1e-10) {
    issues.push('BREAKER_FIELD_WAVE_DIRECTION_INVALID');
  }

  if (sample?.breakerIntensity > 0.02) {
    if (!(sample.actualVerticalWaterDepth > 0) ||
        sample.depthWithinBreakingRange !== true ||
        sample.seabedRisesAlongIncomingWaveDirection !== true ||
        sample.localSlopePhysicallyCompatible !== true ||
        !(sample.directionalDepth.directionalDepthChangeRate < 0) ||
        !(sample.directionalSeabedRiseRate > 0)) {
      issues.push('BREAKER_FIELD_PHYSICAL_ELIGIBILITY_VIOLATION');
    }
  }

  if (sample?.visibleFoamCreated !== false ||
      sample?.swashCreated !== false ||
      sample?.temporaryWetnessCreated !== false ||
      sample?.luminousStripCreated !== false ||
      sample?.geometryMutated !== false ||
      sample?.normalsMutated !== false ||
      sample?.sedimentMembershipsMutated !== false ||
      sample?.waterOpticsMutated !== false ||
      sample?.openOceanDisplacementCreated !== false ||
      sample?.rendererLifecycleMutated !== false ||
      sample?.productDefaultMutated !== false ||
      sample?.publicRouteMutated !== false) {
    issues.push('BREAKER_FIELD_AUTHORITY_LEAK');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'C2_R1_BREAKER_FIELD_PASS'
      : 'C2_R1_BREAKER_FIELD_FAIL',
    contractId: H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
    issues: freeze(issues)
  });
}

export default sampleHEarthC2R1CoastalBreakerField;
