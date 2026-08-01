/**
 * H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1
 *
 * Candidate-only R1.7A analysis authority. It derives bounded, continuous
 * landform signals from the closed R1.1 coastal geometry, R1.2 recomputed
 * surface frame, and R1.3 continuous sediment memberships. It creates no
 * baked texture, material mutation, renderer binding, geometry displacement,
 * route mutation, deployment authority, or visual-success classification.
 */

import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from '../../../terrain/h-earth.coastal-profile.c2-r1.js';
import {
  H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
  sampleHEarthC2R1CoastalSurfaceFrame
} from '../../../terrain/h-earth.coastal-surface-frame.c2-r1.js';
import {
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sampleHEarthC2R1ContinuousCoastalSedimentMembership
} from './h-earth.c2-r1.continuous-sediment-membership.js';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = value => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const boundedHint = (value, scale, maximum = 0.48) => {
  const positive = Math.max(0, value);
  return maximum * positive / (positive + scale);
};

export const H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID =
  'H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1';

export const H_EARTH_C2_R1_LANDFORM_ANALYSIS = freeze({
  contractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
  checkpoint: 'R1.7A_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT',
  startingHead: '59d84592039fae226b17ae2b1c6610144059cb61',
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceSurfaceFrameContractId:
    H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
  sourceSedimentContractId: H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  derivativeStepWorldUnits: 8,
  maximumShapeHintAmplitude: 0.48,
  fieldChannels: freeze([
    'ELEVATION_NORMALIZED',
    'SLOPE_NORMALIZED',
    'CONCAVITY',
    'CONVEXITY',
    'DRAINAGE_TENDENCY',
    'COASTAL_MOISTURE_INFLUENCE',
    'INLAND_TRANSITION',
    'CAVITY_AO_HINT',
    'MACRO_NORMAL_STRENGTH_HINT'
  ]),
  derivationLaw: freeze({
    geometrySource: 'CLOSED_R1_1_CONTINUOUS_COASTAL_PROFILE',
    slopeSource: 'CLOSED_R1_2_RECOMPUTED_SURFACE_FRAME',
    curvatureSource: 'MACRO_SCALE_SECOND_DERIVATIVE_OF_CLOSED_R1_1_PROFILE',
    drainageSource: 'SLOPE_PLUS_POSITIVE_CONCAVITY_TENDENCY',
    moistureSource: 'CLOSED_R1_3_CONTINUOUS_SEDIMENT_MEMBERSHIPS',
    transitionSource: 'ACCEPTED_SIGNED_COASTAL_FRAME_DISTANCE',
    channelEnvelope:
      'BOUNDED_MONOTONE_MACRO_HINTS_WITHOUT_THRESHOLD_BANDING',
    periodicNoiseUsed: false,
    randomNoiseUsed: false,
    textureTilingUsed: false,
    wholeWorldBakeCreated: false
  }),
  ownership: freeze({
    ownsCandidateLandformAnalysis: true,
    ownsMacroFieldChannelContract: true,
    ownsBakedTexture: false,
    ownsRuntimeMaterialSampling: false,
    ownsTerrainGeometry: false,
    ownsNormals: false,
    ownsSedimentMemberships: false,
    ownsWaterOptics: false,
    ownsBreakerOrSwashLaw: false,
    ownsRendererLifecycle: false,
    ownsCameraOrTraversal: false,
    ownsPublicRouteOrProductDefault: false
  })
});

function elevationAt(worldX, worldZ) {
  const sample = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  return sample?.valid === true && finite(sample.elevation)
    ? sample.elevation
    : Number.NaN;
}

function deriveCurvature(worldX, worldZ, centerElevation) {
  const step = H_EARTH_C2_R1_LANDFORM_ANALYSIS.derivativeStepWorldUnits;
  const stepSquared = step * step;
  const xMinus = elevationAt(worldX - step, worldZ);
  const xPlus = elevationAt(worldX + step, worldZ);
  const zMinus = elevationAt(worldX, worldZ - step);
  const zPlus = elevationAt(worldX, worldZ + step);
  const minusMinus = elevationAt(worldX - step, worldZ - step);
  const minusPlus = elevationAt(worldX - step, worldZ + step);
  const plusMinus = elevationAt(worldX + step, worldZ - step);
  const plusPlus = elevationAt(worldX + step, worldZ + step);
  const values = [
    xMinus,
    xPlus,
    zMinus,
    zPlus,
    minusMinus,
    minusPlus,
    plusMinus,
    plusPlus
  ];
  if (!values.every(finite)) return null;

  const secondX = (xPlus - 2 * centerElevation + xMinus) / stepSquared;
  const secondZ = (zPlus - 2 * centerElevation + zMinus) / stepSquared;
  const mixedXZ =
    (plusPlus - plusMinus - minusPlus + minusMinus) /
    (4 * stepSquared);
  const laplacian = secondX + secondZ;
  const magnitude = Math.hypot(secondX, secondZ, Math.SQRT2 * mixedXZ);

  return freeze({
    step,
    secondX,
    secondZ,
    mixedXZ,
    laplacian,
    magnitude,
    macroGradientX: (xPlus - xMinus) / (2 * step),
    macroGradientZ: (zPlus - zMinus) / (2 * step),
    concavity: boundedHint(laplacian, 0.035),
    convexity: boundedHint(-laplacian, 0.035)
  });
}

function deriveMoisture(weights, actualVerticalWaterDepth) {
  const dry = clamp01(weights.DRY_BEACH_SAND ?? 0);
  const damp = clamp01(weights.DAMP_SAND ?? 0);
  const wet = clamp01(weights.WET_FORESHORE_SAND ?? 0);
  const saturated = clamp01(weights.SATURATED_OR_SUBMERGED_SAND ?? 0);
  const submergedContribution = smoothstep(0.05, 2.5, actualVerticalWaterDepth);
  const rawMoisture = clamp01(
    dry * 0.08 +
    damp * 0.48 +
    wet * 0.82 +
    saturated +
    submergedContribution * 0.18
  );
  return 0.1 + 0.5 * rawMoisture;
}

export function sampleHEarthC2R1LandformAnalysis(worldX, worldZ) {
  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  const surface = sampleHEarthC2R1CoastalSurfaceFrame(worldX, worldZ);
  const sediment =
    sampleHEarthC2R1ContinuousCoastalSedimentMembership(worldX, worldZ);

  if (terrain?.valid !== true ||
      surface?.valid !== true ||
      sediment?.valid !== true ||
      !terrain.coastalFrame ||
      !finite(terrain.elevation) ||
      !finite(surface.slope)) {
    return freeze({
      valid: false,
      status: 'C2_R1_LANDFORM_ANALYSIS_REJECTED',
      contractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
      worldX,
      worldZ
    });
  }

  const curvature = deriveCurvature(worldX, worldZ, terrain.elevation);
  if (!curvature) {
    return freeze({
      valid: false,
      status: 'C2_R1_LANDFORM_ANALYSIS_REJECTED',
      contractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
      worldX,
      worldZ,
      issues: freeze(['CURVATURE_NEIGHBORHOOD_INVALID'])
    });
  }

  const elevationNormalized =
    0.25 + 0.5 * smoothstep(-12, 30, terrain.elevation);
  const macroSlope = Math.hypot(
    curvature.macroGradientX,
    curvature.macroGradientZ
  );
  const slopeNormalized = boundedHint(macroSlope, 0.16);
  const drainageTendency = boundedHint(
    slopeNormalized * (0.3 + 0.7 * curvature.concavity),
    0.12
  );
  const coastalMoistureInfluence = deriveMoisture(
    sediment.weights,
    terrain.actualVerticalWaterDepth
  );
  const signedInlandDistance = terrain.coastalFrame.signedInlandDistance;
  const inlandTransition = smoothstep(18, 118, signedInlandDistance);
  const cavityAOHint = boundedHint(
    curvature.concavity * 0.72 + drainageTendency * 0.28,
    0.1
  );
  const curvatureNormalized = boundedHint(curvature.magnitude, 0.05);
  const macroNormalStrengthHint = boundedHint(
    slopeNormalized * 0.6 + curvatureNormalized * 0.4,
    0.12
  );

  const channels = freeze({
    elevationNormalized,
    slopeNormalized,
    concavity: curvature.concavity,
    convexity: curvature.convexity,
    drainageTendency,
    coastalMoistureInfluence,
    inlandTransition,
    cavityAOHint,
    macroNormalStrengthHint
  });

  return freeze({
    valid: true,
    status: 'C2_R1_LANDFORM_ANALYSIS_COMPLETE',
    contractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
    world: terrain.world,
    elevation: terrain.elevation,
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    signedInlandDistance,
    slope: surface.slope,
    macroSlope,
    gradient: surface.gradient,
    normal: surface.normal,
    curvature,
    sedimentWeights: sediment.weights,
    channels,
    macroFieldSourceVector: freeze([
      elevationNormalized,
      slopeNormalized,
      curvature.concavity,
      curvature.convexity,
      drainageTendency,
      coastalMoistureInfluence,
      inlandTransition,
      cavityAOHint,
      macroNormalStrengthHint
    ]),
    bakedTextureCreated: false,
    runtimeMaterialSamplingCreated: false,
    terrainGeometryMutated: false,
    normalsMutated: false,
    sedimentMembershipsMutated: false,
    waterOpticsMutated: false,
    breakerOrSwashLawMutated: false,
    rendererLifecycleMutated: false,
    productDefaultMutated: false,
    publicRouteMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false
  });
}

export default sampleHEarthC2R1LandformAnalysis;
