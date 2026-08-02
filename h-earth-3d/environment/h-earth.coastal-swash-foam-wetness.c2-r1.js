/**
 * H_EARTH_C2_R1_RESTRAINED_SWASH_FOAM_AND_WETNESS_v1
 *
 * Candidate-only R1.6 temporal coastal-response field. It consumes the
 * accepted R1.3 sediment memberships, R1.4 actual-depth optics, and R1.5
 * breaker eligibility/intensity as immutable inputs. It creates deterministic
 * transient swash, nonluminous fragmented foam, and temporary wet-sand
 * response without changing geometry, upstream physical laws, renderer
 * lifecycle, camera, traversal, routes, or product defaults.
 */

import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from '../terrain/h-earth.coastal-profile.c2-r1.js';

import {
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sampleHEarthC2R1ContinuousCoastalSedimentMembership
} from '../control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js';

import {
  H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
  sampleHEarthC2R1CoastalWaterOptics
} from './h-earth.coastal-water-optics.c2-r1.js';

import {
  H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
  sampleHEarthC2R1CoastalBreakerField
} from './h-earth.coastal-breaker-field.c2-r1.js';

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
const fract = (value) => value - Math.floor(value);
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const gaussian = (value, center, width) => {
  const normalized = (value - center) / Math.max(1e-6, width);
  return Math.exp(-0.5 * normalized * normalized);
};

export const H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID =
  'H_EARTH_C2_R1_RESTRAINED_SWASH_FOAM_AND_WETNESS_v1';

export const H_EARTH_C2_R1_SWASH_FOAM_WETNESS = freeze({
  contractId: H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
  checkpoint: 'R1.6_RESTRAINED_SWASH_FOAM_AND_WETNESS',
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceSedimentContractId: H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sourceWaterOpticsContractId: H_EARTH_C2_R1_WATER_OPTICS_CONTRACT_ID,
  sourceBreakerContractId: H_EARTH_C2_R1_BREAKER_FIELD_CONTRACT_ID,
  cycleDurationSeconds: 11.5,
  sourceSearchSignedInlandDistances: freeze([-10, -26, -60]),
  stages: freeze({
    preSwashEnd: 0.10,
    maximumAdvanceStart: 0.42,
    maximumAdvanceEnd: 0.48,
    retreatEnd: 0.76
  }),
  reach: freeze({
    minimumWorldUnits: 1.8,
    maximumWorldUnits: 15,
    breakerScaleWorldUnits: 13,
    slopeResistance: 8
  }),
  foam: freeze({
    maximumOpacity: 0.68,
    deepWaterAbsenceStart: 2.9,
    deepWaterAbsenceEnd: 3.5,
    frontWidthWorldUnits: 1.45,
    breakerPulseEnd: 0.36,
    luminous: false,
    colorLinear: freeze([0.72, 0.755, 0.74])
  }),
  wetness: freeze({
    decayRatePerNormalizedPostRetreat: 3.6,
    maximumColorDarkening: 0.18,
    maximumRoughnessReduction: 0.24,
    luminous: false
  }),
  ownership: freeze({
    ownsSwashPhaseAndReachFields: true,
    ownsFoamGenerationAndDecay: true,
    ownsFoamFragmentation: true,
    ownsTemporaryWetnessState: true,
    ownsWetnessDecay: true,
    ownsCandidateOnlyAnimationBinding: true,
    ownsCoastalGeometry: false,
    ownsNormals: false,
    ownsSedimentMemberships: false,
    ownsWaterOptics: false,
    ownsBreakerEligibilityLaw: false,
    ownsOpenOceanGeometryDisplacement: false,
    ownsRendererLifecycle: false,
    ownsCameraOrTraversal: false,
    ownsPublicRouteOrProductDefault: false
  })
});

function sedimentEnvelope(weights = {}) {
  const inland = clamp01(weights.INLAND_SOIL_OR_ROCK ?? 0);
  const backshore = clamp01(weights.BACKSHORE_SAND ?? 0);
  const dry = clamp01(weights.DRY_BEACH_SAND ?? 0);
  const damp = clamp01(weights.DAMP_SAND ?? 0);
  const wet = clamp01(weights.WET_FORESHORE_SAND ?? 0);
  const saturated = clamp01(weights.SATURATED_OR_SUBMERGED_SAND ?? 0);
  return freeze({
    inland,
    backshore,
    dry,
    damp,
    wet,
    saturated,
    foreshoreCompatibility: clamp01(
      dry * 0.24 + damp * 0.72 + wet + saturated * 0.82
    ),
    dryBackshoreExclusion: clamp01(inland + backshore * 0.88)
  });
}

function temporalStage(cyclePhase, maximumReach) {
  const stages = H_EARTH_C2_R1_SWASH_FOAM_WETNESS.stages;
  const phase = fract(cyclePhase);

  if (phase < stages.preSwashEnd) {
    return freeze({
      name: 'PRE_SWASH',
      phase,
      advancePresent: false,
      retreatPresent: false,
      advanceProgress: 0,
      retreatProgress: 0,
      frontSignedInlandDistance: 0,
      temporalSwashStrength: 0,
      wetnessMemory: 0,
      motionDirection: 'NONE'
    });
  }

  if (phase < stages.maximumAdvanceStart) {
    const progress = smoothstep(
      stages.preSwashEnd,
      stages.maximumAdvanceStart,
      phase
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    return freeze({
      name: 'ADVANCE',
      phase,
      advancePresent: true,
      retreatPresent: false,
      advanceProgress: progress,
      retreatProgress: 0,
      frontSignedInlandDistance: maximumReach * eased,
      temporalSwashStrength: smoothstep(0, 0.18, progress),
      wetnessMemory: mix(0.28, 0.92, progress),
      motionDirection: 'SHOREWARD'
    });
  }

  if (phase < stages.maximumAdvanceEnd) {
    return freeze({
      name: 'MAXIMUM_ADVANCE',
      phase,
      advancePresent: true,
      retreatPresent: false,
      advanceProgress: 1,
      retreatProgress: 0,
      frontSignedInlandDistance: maximumReach,
      temporalSwashStrength: 1,
      wetnessMemory: 1,
      motionDirection: 'DECELERATING_SHOREWARD'
    });
  }

  if (phase < stages.retreatEnd) {
    const progress = smoothstep(
      stages.maximumAdvanceEnd,
      stages.retreatEnd,
      phase
    );
    return freeze({
      name: 'RETREAT',
      phase,
      advancePresent: false,
      retreatPresent: true,
      advanceProgress: 1,
      retreatProgress: progress,
      frontSignedInlandDistance:
        maximumReach * (1 - progress * progress),
      temporalSwashStrength: 1 - 0.42 * progress,
      wetnessMemory: 1,
      motionDirection: 'WATERWARD'
    });
  }

  const postProgress = smoothstep(stages.retreatEnd, 1, phase);
  return freeze({
    name: 'POST_RETREAT',
    phase,
    advancePresent: false,
    retreatPresent: false,
    advanceProgress: 1,
    retreatProgress: 1,
    frontSignedInlandDistance: 0,
    temporalSwashStrength: 0,
    wetnessMemory: Math.exp(
      -H_EARTH_C2_R1_SWASH_FOAM_WETNESS.wetness
        .decayRatePerNormalizedPostRetreat * postProgress
    ),
    motionDirection: 'NONE'
  });
}

function irregularFragment(fragmentSeed, signedInlandDistance, cyclePhase) {
  const broad = 0.5 + 0.5 * Math.sin(
    fragmentSeed * 0.73 +
    signedInlandDistance * 0.61 +
    cyclePhase * Math.PI * 3.7
  );
  const cross = 0.5 + 0.5 * Math.sin(
    fragmentSeed * 1.91 -
    signedInlandDistance * 1.47 +
    cyclePhase * Math.PI * 7.1
  );
  const cellular = fract(Math.sin(
    fragmentSeed * 12.9898 +
    signedInlandDistance * 78.233 +
    cyclePhase * 39.425
  ) * 43758.5453);
  const combined = broad * 0.42 + cross * 0.33 + cellular * 0.25;
  return smoothstep(0.28, 0.78, combined);
}

export function getHEarthC2R1SwashCyclePhaseOffset(anchorX, worldX = anchorX) {
  if (!finite(anchorX) || !finite(worldX)) return Number.NaN;
  return fract(
    0.17 +
    0.045 * Math.sin((anchorX + 29) / 67) +
    0.025 * Math.sin((worldX - 13) / 31)
  );
}

export function resolveHEarthC2R1SwashCyclePhase({
  anchorX,
  worldX = anchorX,
  timeSeconds
}) {
  if (!finite(anchorX) || !finite(worldX) || !finite(timeSeconds)) {
    return Number.NaN;
  }
  return fract(
    timeSeconds / H_EARTH_C2_R1_SWASH_FOAM_WETNESS.cycleDurationSeconds +
    getHEarthC2R1SwashCyclePhaseOffset(anchorX, worldX)
  );
}

export function deriveHEarthC2R1SwashFoamWetnessFromFactors({
  cyclePhase,
  sourceBreakerIntensity,
  sourceBreakerEligibility,
  localBreakerIntensity,
  actualVerticalWaterDepth,
  localSlope,
  signedInlandDistance,
  sedimentWeights,
  opticalSurfaceOpacity,
  fragmentSeed
}) {
  if (!finite(cyclePhase) ||
      !finite(sourceBreakerIntensity) ||
      !finite(sourceBreakerEligibility) ||
      !finite(localBreakerIntensity) ||
      !finite(actualVerticalWaterDepth) ||
      actualVerticalWaterDepth < 0 ||
      !finite(localSlope) ||
      localSlope < 0 ||
      !finite(signedInlandDistance) ||
      !sedimentWeights ||
      !finite(opticalSurfaceOpacity) ||
      !finite(fragmentSeed)) {
    return null;
  }

  const sourceIntensity = clamp01(sourceBreakerIntensity);
  const sourceEligibility = clamp01(sourceBreakerEligibility);
  const localIntensity = clamp01(localBreakerIntensity);
  const sourceStrength = clamp01(
    sourceIntensity * (0.72 + 0.28 * sourceEligibility)
  );
  const slopeResistance =
    1 / (1 + H_EARTH_C2_R1_SWASH_FOAM_WETNESS.reach.slopeResistance *
      localSlope);
  const maximumReach = sourceStrength > 0
    ? clamp(
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.reach.minimumWorldUnits +
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.reach.breakerScaleWorldUnits *
          Math.sqrt(sourceStrength) * slopeResistance,
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.reach.minimumWorldUnits,
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.reach.maximumWorldUnits
      )
    : 0;

  const stage = temporalStage(cyclePhase, maximumReach);
  const sediment = sedimentEnvelope(sedimentWeights);
  const deepWaterSuppression = 1 - smoothstep(
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.deepWaterAbsenceStart,
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.deepWaterAbsenceEnd,
    actualVerticalWaterDepth
  );
  const shorelineEntry = smoothstep(-4.5, -0.35, signedInlandDistance);
  const frontContainment = 1 - smoothstep(
    stage.frontSignedInlandDistance + 0.25,
    stage.frontSignedInlandDistance + 1.35,
    signedInlandDistance
  );
  const maximumReachContainment = 1 - smoothstep(
    maximumReach + 0.25,
    maximumReach + 1.5,
    signedInlandDistance
  );
  const backshoreSuppression = 1 - smoothstep(
    0.45,
    0.82,
    sediment.dryBackshoreExclusion
  );
  const fragment = irregularFragment(
    fragmentSeed,
    signedInlandDistance,
    stage.phase
  );

  const swashSpatialEnvelope = clamp01(
    shorelineEntry *
    frontContainment *
    maximumReachContainment *
    sediment.foreshoreCompatibility *
    backshoreSuppression *
    deepWaterSuppression
  );
  const swashIntensity = clamp01(
    sourceStrength *
    stage.temporalSwashStrength *
    swashSpatialEnvelope
  );

  const breakerPulse =
    smoothstep(0.02, 0.12, stage.phase) *
    (1 - smoothstep(
      0.22,
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.breakerPulseEnd,
      stage.phase
    ));
  const localBreakerFoam = clamp01(
    localIntensity *
    breakerPulse *
    (0.32 + 0.68 * fragment) *
    deepWaterSuppression
  );
  const frontFoam = clamp01(
    swashIntensity *
    gaussian(
      signedInlandDistance,
      stage.frontSignedInlandDistance,
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.frontWidthWorldUnits
    ) *
    (0.22 + 0.78 * fragment)
  );
  const foamIntensity = clamp01(
    (localBreakerFoam + frontFoam) *
    maximumReachContainment *
    backshoreSuppression
  );
  const foamOpacity =
    foamIntensity *
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.maximumOpacity;

  const washedReach = stage.name === 'ADVANCE'
    ? stage.frontSignedInlandDistance
    : (stage.name === 'PRE_SWASH' ? 0 : maximumReach);
  const washedMask = clamp01(
    smoothstep(-1.2, 0.15, signedInlandDistance) *
    (1 - smoothstep(
      washedReach + 0.15,
      washedReach + 1.25,
      signedInlandDistance
    )) *
    sediment.foreshoreCompatibility *
    backshoreSuppression
  );
  const temporaryWetness = clamp01(
    sourceStrength *
    washedMask *
    stage.wetnessMemory *
    (0.86 + 0.14 * fragment) *
    deepWaterSuppression
  );
  const wetSandColorDarkening =
    temporaryWetness *
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.wetness.maximumColorDarkening;
  const wetSandRoughnessReduction =
    temporaryWetness *
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.wetness.maximumRoughnessReduction;

  return freeze({
    cyclePhase: stage.phase,
    stage: stage.name,
    motionDirection: stage.motionDirection,
    swashAdvancePresent: stage.advancePresent && swashIntensity > 0,
    swashRetreatPresent: stage.retreatPresent && swashIntensity > 0,
    maximumLandwardReach: maximumReach,
    frontSignedInlandDistance: stage.frontSignedInlandDistance,
    sourceBreakerIntensity: sourceIntensity,
    sourceBreakerEligibility: sourceEligibility,
    localBreakerIntensity: localIntensity,
    sourcePhysicallyEligible: sourceStrength > 0,
    slopeResponsiveReach: true,
    swashIntensity,
    foamIntensity,
    foamOpacity,
    foamFragmentation: fragment,
    foamTransient: true,
    foamLuminous: false,
    foamColorLinear:
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.colorLinear,
    temporaryWetness,
    wetnessMemory: stage.wetnessMemory,
    wetnessDecays: stage.name === 'POST_RETREAT',
    wetSandColorDarkening,
    wetSandRoughnessReduction,
    opticalSurfaceOpacity: clamp01(opticalSurfaceOpacity),
    foreshoreCompatibility: sediment.foreshoreCompatibility,
    dryBackshoreExclusion: sediment.dryBackshoreExclusion,
    deepWaterFoamAbsent:
      actualVerticalWaterDepth >=
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.deepWaterAbsenceEnd
        ? foamIntensity === 0
        : true,
    dryBackshoreFoamAbsent:
      sediment.dryBackshoreExclusion >= 0.82
        ? foamIntensity === 0
        : true,
    permanentParallelStrip: false,
    shorelinePenetrationOrFloatingBand: false
  });
}

function shorelinePositionFromTerrain(terrain) {
  const frame = terrain.coastalFrame;
  return freeze({
    x: terrain.world.x + frame.waterwardNormal.x *
      frame.signedInlandDistance,
    z: terrain.world.z + frame.waterwardNormal.z *
      frame.signedInlandDistance
  });
}

function findPhysicalBreakerSource(terrain) {
  const shoreline = shorelinePositionFromTerrain(terrain);
  const normal = terrain.coastalFrame.waterwardNormal;
  let selected = null;

  for (const signedDistance of
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.sourceSearchSignedInlandDistances) {
    const sample = sampleHEarthC2R1CoastalBreakerField(
      shoreline.x - normal.x * signedDistance,
      shoreline.z - normal.z * signedDistance
    );
    if (sample?.valid !== true ||
        sample.breakerEligible !== true ||
        !(sample.breakerIntensity > 0)) {
      continue;
    }
    if (!selected || sample.breakerIntensity > selected.breakerIntensity) {
      selected = sample;
    }
  }

  return selected;
}

function reject(worldX, worldZ, issues) {
  return freeze({
    valid: false,
    status: 'C2_R1_SWASH_FOAM_WETNESS_REJECTED',
    contractId: H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
    worldX,
    worldZ,
    issues: freeze(issues)
  });
}

export function sampleHEarthC2R1CoastalSwashFoamWetness(
  worldX,
  worldZ,
  { timeSeconds = 0 } = {}
) {
  if (!finite(worldX) || !finite(worldZ) || !finite(timeSeconds)) {
    return reject(worldX, worldZ, ['SWASH_FOAM_WETNESS_INPUT_NOT_FINITE']);
  }

  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  const sediment =
    sampleHEarthC2R1ContinuousCoastalSedimentMembership(worldX, worldZ);
  const optics = sampleHEarthC2R1CoastalWaterOptics(worldX, worldZ);
  const localBreaker = sampleHEarthC2R1CoastalBreakerField(worldX, worldZ);

  if (terrain?.valid !== true || sediment?.valid !== true ||
      optics?.valid !== true || localBreaker?.valid !== true ||
      !terrain.coastalFrame) {
    return reject(worldX, worldZ, [
      'R1_1_R1_3_R1_4_OR_R1_5_INPUT_NOT_ELIGIBLE'
    ]);
  }

  const sourceBreaker = findPhysicalBreakerSource(terrain);
  const cyclePhase = resolveHEarthC2R1SwashCyclePhase({
    anchorX: terrain.coastalFrame.anchorX,
    worldX,
    timeSeconds
  });
  const fragmentSeed =
    worldX * 0.17 +
    worldZ * 0.11 +
    terrain.coastalFrame.anchorX * 0.07;

  const response = deriveHEarthC2R1SwashFoamWetnessFromFactors({
    cyclePhase,
    sourceBreakerIntensity: sourceBreaker?.breakerIntensity ?? 0,
    sourceBreakerEligibility: sourceBreaker?.breakerEligibility ?? 0,
    localBreakerIntensity: localBreaker.breakerIntensity,
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    localSlope: localBreaker.localSlope,
    signedInlandDistance: terrain.coastalFrame.signedInlandDistance,
    sedimentWeights: sediment.weights,
    opticalSurfaceOpacity: optics.surfaceOpacity,
    fragmentSeed
  });
  if (!response) {
    return reject(worldX, worldZ, ['SWASH_FOAM_WETNESS_DERIVATION_FAILED']);
  }

  const sourceWaveDirection =
    sourceBreaker?.waveApproach?.incomingWaveDirection ??
    localBreaker.waveApproach.incomingWaveDirection;
  const shorewardNormal = freeze({
    x: -terrain.coastalFrame.waterwardNormal.x,
    z: -terrain.coastalFrame.waterwardNormal.z
  });
  const motionDirectionXZ = response.motionDirection === 'SHOREWARD'
    ? shorewardNormal
    : response.motionDirection === 'WATERWARD'
      ? terrain.coastalFrame.waterwardNormal
      : freeze({ x: 0, z: 0 });

  return freeze({
    valid: true,
    status: 'C2_R1_SWASH_FOAM_WETNESS_SAMPLE_COMPLETE',
    contractId: H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
    sourceProfileContractId: terrain.contractId,
    sourceSedimentContractId: sediment.contractId,
    sourceWaterOpticsContractId: optics.contractId,
    sourceBreakerContractId: localBreaker.contractId,
    world: freeze({ x: worldX, y: optics.waterSurfaceHeight, z: worldZ }),
    timeSeconds,
    animationBinding: freeze({
      candidateOnly: true,
      deterministic: true,
      cycleDurationSeconds:
        H_EARTH_C2_R1_SWASH_FOAM_WETNESS.cycleDurationSeconds,
      cyclePhase: response.cyclePhase,
      stage: response.stage,
      motionDirectionXZ
    }),
    signedInlandDistance: terrain.coastalFrame.signedInlandDistance,
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    localSlope: localBreaker.localSlope,
    sourceBreaker: sourceBreaker
      ? freeze({
          world: sourceBreaker.world,
          signedInlandDistance: sourceBreaker.signedInlandDistance,
          breakerEligibility: sourceBreaker.breakerEligibility,
          breakerIntensity: sourceBreaker.breakerIntensity,
          incomingWaveDirection: sourceWaveDirection
        })
      : null,
    localBreakerIntensity: localBreaker.breakerIntensity,
    sedimentWeights: sediment.weights,
    waterOptics: freeze({
      surfaceOpacity: optics.surfaceOpacity,
      surfaceColorLinear: optics.surfaceColorLinear
    }),
    ...response,
    coastalGeometryMutated: false,
    normalsMutated: false,
    sedimentMembershipsMutated: false,
    waterOpticsMutated: false,
    breakerEligibilityLawMutated: false,
    openOceanGeometryDisplacementCreated: false,
    rendererLifecycleMutated: false,
    cameraOrTraversalMutated: false,
    publicRouteMutated: false,
    productDefaultMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    issues: freeze([])
  });
}

export function evaluateHEarthC2R1SwashFoamWetness(sample) {
  const issues = [];
  if (sample?.valid !== true) {
    issues.push('SWASH_FOAM_WETNESS_SAMPLE_NOT_VALID');
  }
  if (sample?.contractId !==
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID) {
    issues.push('SWASH_FOAM_WETNESS_CONTRACT_MISMATCH');
  }

  for (const field of [
    'cyclePhase',
    'actualVerticalWaterDepth',
    'localSlope',
    'sourceBreakerIntensity',
    'sourceBreakerEligibility',
    'localBreakerIntensity',
    'maximumLandwardReach',
    'frontSignedInlandDistance',
    'swashIntensity',
    'foamIntensity',
    'foamOpacity',
    'foamFragmentation',
    'temporaryWetness',
    'wetSandColorDarkening',
    'wetSandRoughnessReduction'
  ]) {
    if (!finite(sample?.[field])) {
      issues.push(`SWASH_FOAM_WETNESS_NONFINITE:${field}`);
    }
  }

  for (const field of [
    'cyclePhase',
    'sourceBreakerIntensity',
    'sourceBreakerEligibility',
    'localBreakerIntensity',
    'swashIntensity',
    'foamIntensity',
    'foamOpacity',
    'foamFragmentation',
    'temporaryWetness',
    'wetSandColorDarkening',
    'wetSandRoughnessReduction'
  ]) {
    if (finite(sample?.[field]) &&
        (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`SWASH_FOAM_WETNESS_RANGE:${field}`);
    }
  }

  if (sample?.foamIntensity > 0 &&
      !(sample.sourceBreakerIntensity > 0 ||
        sample.localBreakerIntensity > 0)) {
    issues.push('FOAM_NOT_BREAKER_ALIGNED');
  }
  if (sample?.foamLuminous !== false ||
      sample?.permanentParallelStrip !== false ||
      sample?.shorelinePenetrationOrFloatingBand !== false) {
    issues.push('REJECTED_VISUAL_BEHAVIOR_PRESENT');
  }
  if (sample?.temporaryWetness > 0 &&
      !(sample.foreshoreCompatibility > 0)) {
    issues.push('WETNESS_OUTSIDE_VALID_SEDIMENT_MEMBERSHIP');
  }
  if (sample?.actualVerticalWaterDepth >=
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.deepWaterAbsenceEnd &&
      sample?.foamIntensity !== 0) {
    issues.push('DEEP_WATER_FOAM_PRESENT');
  }
  if (sample?.dryBackshoreExclusion >= 0.82 &&
      sample?.foamIntensity !== 0) {
    issues.push('DRY_BACKSHORE_FOAM_PRESENT');
  }

  if (sample?.coastalGeometryMutated !== false ||
      sample?.normalsMutated !== false ||
      sample?.sedimentMembershipsMutated !== false ||
      sample?.waterOpticsMutated !== false ||
      sample?.breakerEligibilityLawMutated !== false ||
      sample?.openOceanGeometryDisplacementCreated !== false ||
      sample?.rendererLifecycleMutated !== false ||
      sample?.cameraOrTraversalMutated !== false ||
      sample?.publicRouteMutated !== false ||
      sample?.productDefaultMutated !== false) {
    issues.push('SWASH_FOAM_WETNESS_AUTHORITY_LEAK');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'C2_R1_SWASH_FOAM_WETNESS_PASS'
      : 'C2_R1_SWASH_FOAM_WETNESS_FAIL',
    contractId: H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
    issues: freeze(issues)
  });
}

export default sampleHEarthC2R1CoastalSwashFoamWetness;
