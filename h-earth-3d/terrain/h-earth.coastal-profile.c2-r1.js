/**
 * H_EARTH_C2_R1_CONTINUOUS_COASTAL_PROFILE_v1
 *
 * Isolated C2-R1 candidate projection. It consumes the accepted pre-C2 Run 8B
 * terrain field and replaces only a bounded coastal corridor with a continuous
 * inland-to-deep-water elevation profile. It creates no renderer, material,
 * water-optics, wave, camera, navigation, route, or deployment authority.
 */

import { getHEarthCanonicalShorelineZ } from './h-earth.terrain-field.js';
import {
  sampleHEarthRun8BSuccessorTerrainField
} from './h-earth.successor-terrain-field.run8b.js';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = value => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const gaussian = (value, center, sigma) => {
  const normalized = (value - center) / Math.max(Number.EPSILON, sigma);
  return Math.exp(-0.5 * normalized * normalized);
};
const freeze = value => Object.freeze(value);

export const H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID =
  'H_EARTH_C2_R1_CONTINUOUS_COASTAL_PROFILE_v1';

export const H_EARTH_C2_R1_COASTAL_PROFILE = freeze({
  contractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  startingBaselineHead: '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  startingSource: 'ACCEPTED_PRE_C2_RUN_8B_SUCCESSOR_TERRAIN_FIELD',
  failedC2GeometryConsumed: false,
  seaLevelY: 0,
  corridor: freeze({
    alongshoreAnchorMinimum: -184,
    alongshoreAnchorMaximum: 184,
    fullCandidateInlandDistance: 96,
    blendToBaselineInlandDistance: 136,
    fullCandidateWaterwardDistance: 120,
    blendToBaselineWaterwardDistance: 134
  }),
  profileSequence: freeze([
    'INLAND_TERRAIN',
    'BACKSHORE',
    'DRY_BEACH',
    'WET_FORESHORE',
    'SHORELINE',
    'SHALLOW_SUBMERGED_SLOPE',
    'OPTIONAL_BROAD_SANDBAR',
    'DEEPER_WATER'
  ]),
  ownership: freeze({
    ownsCandidateCoastalElevationProjection: true,
    ownsProductionTerrain: false,
    ownsNormals: false,
    ownsMaterials: false,
    ownsWaterOptics: false,
    ownsWavesOrFoam: false,
    ownsRenderer: false,
    ownsCameraOrNavigation: false,
    ownsPublicRoute: false
  })
});

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  const tangent = { x: tangentX / length, z: tangentZ / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) {
    waterwardNormal = { x: -waterwardNormal.x, z: -waterwardNormal.z };
  }
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    tangent,
    waterwardNormal
  };
}

/** Positive signed distance is inland; negative signed distance is waterward. */
export function resolveHEarthC2R1CoastalFrame(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) return null;
  let anchorX = worldX;
  let frame = shorelineFrame(anchorX);
  for (let iteration = 0; iteration < 4; iteration += 1) {
    frame = shorelineFrame(anchorX);
    const deltaX = worldX - frame.shoreline.x;
    const deltaZ = worldZ - frame.shoreline.z;
    const tangentOffset = deltaX * frame.tangent.x + deltaZ * frame.tangent.z;
    anchorX += tangentOffset;
  }
  frame = shorelineFrame(anchorX);
  const deltaX = worldX - frame.shoreline.x;
  const deltaZ = worldZ - frame.shoreline.z;
  const waterwardDistance =
    deltaX * frame.waterwardNormal.x + deltaZ * frame.waterwardNormal.z;
  return freeze({
    anchorX,
    shoreline: freeze({ ...frame.shoreline }),
    tangent: freeze({ ...frame.tangent }),
    waterwardNormal: freeze({ ...frame.waterwardNormal }),
    signedInlandDistance: -waterwardDistance,
    waterwardDistance: Math.max(0, waterwardDistance),
    inlandDistance: Math.max(0, -waterwardDistance)
  });
}

function alongshoreParameters(anchorX) {
  const broadA = Math.sin((anchorX + 18) / 88);
  const broadB = Math.sin((anchorX - 41) / 137);
  return {
    beachScale: 1 + 0.075 * broadA + 0.035 * broadB,
    barCenter: 73 + 7 * Math.sin((anchorX - 12) / 104),
    barSigma: 27 + 3.5 * Math.sin((anchorX + 36) / 131),
    barAmplitude: 1.05 + 0.14 * Math.sin((anchorX - 24) / 79),
    offshoreSlopeScale: 1 + 0.07 * Math.sin((anchorX + 9) / 121)
  };
}

function candidateProfileElevation(signedInlandDistance, anchorX) {
  const parameters = alongshoreParameters(anchorX);
  if (signedInlandDistance >= 0) {
    const inland = signedInlandDistance / parameters.beachScale;
    const baseRise = 0.034 * inland + 0.000115 * inland * inland;
    const backshoreBerm =
      0.48 * gaussian(inland, 62, 29) * smoothstep(18, 44, inland);
    return baseRise + backshoreBerm;
  }

  const waterward = -signedInlandDistance;
  const baseDepth =
    (0.036 * waterward + 0.000145 * waterward * waterward) *
    parameters.offshoreSlopeScale;
  const broadSandbar =
    parameters.barAmplitude *
    gaussian(waterward, parameters.barCenter, parameters.barSigma) *
    smoothstep(24, 48, waterward);
  return -baseDepth + broadSandbar;
}

function corridorWeight(signedInlandDistance) {
  const corridor = H_EARTH_C2_R1_COASTAL_PROFILE.corridor;
  if (signedInlandDistance >= 0) {
    return 1 - smoothstep(
      corridor.fullCandidateInlandDistance,
      corridor.blendToBaselineInlandDistance,
      signedInlandDistance
    );
  }
  const waterward = -signedInlandDistance;
  return 1 - smoothstep(
    corridor.fullCandidateWaterwardDistance,
    corridor.blendToBaselineWaterwardDistance,
    waterward
  );
}

export function sampleHEarthC2R1CoastalElevation(worldX, worldZ) {
  const baseline = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  const frame = resolveHEarthC2R1CoastalFrame(worldX, worldZ);
  if (baseline?.valid !== true || !frame) return Number.NaN;
  const candidate = candidateProfileElevation(frame.signedInlandDistance, frame.anchorX);
  const weight = corridorWeight(frame.signedInlandDistance);
  return baseline.elevation * (1 - weight) + candidate * weight;
}

export function sampleHEarthC2R1CoastalTerrainField(worldX, worldZ) {
  const baseline = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  const frame = resolveHEarthC2R1CoastalFrame(worldX, worldZ);
  if (baseline?.valid !== true || !frame) {
    return freeze({
      valid: false,
      status: 'C2_R1_COASTAL_PROFILE_SAMPLE_REJECTED',
      contractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
      worldX,
      worldZ
    });
  }
  const elevation = sampleHEarthC2R1CoastalElevation(worldX, worldZ);
  const candidateWeight = corridorWeight(frame.signedInlandDistance);
  return freeze({
    valid: finite(elevation),
    status: finite(elevation)
      ? 'C2_R1_COASTAL_PROFILE_SAMPLE_COMPLETE'
      : 'C2_R1_COASTAL_PROFILE_SAMPLE_REJECTED',
    contractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
    world: freeze({ x: worldX, y: elevation, z: worldZ }),
    elevation,
    seaLevelY: H_EARTH_C2_R1_COASTAL_PROFILE.seaLevelY,
    actualVerticalWaterDepth: Math.max(
      0,
      H_EARTH_C2_R1_COASTAL_PROFILE.seaLevelY - elevation
    ),
    coastalFrame: frame,
    candidateWeight,
    baselineElevation: baseline.elevation,
    baselineContractId: baseline.contractId,
    normalsDeferredToCheckpoint: 'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING',
    materialsDeferredToCheckpoint: 'R1.3_GRADUAL_SEDIMENT_MEMBERSHIPS',
    waterOpticsDeferredToCheckpoint: 'R1.4_ACTUAL_DEPTH_WATER_OPTICS',
    productionTerrainMutated: false,
    publicRouteMutated: false
  });
}

export function evaluateHEarthC2R1CoastalProfile({
  xSamples = 17,
  crossShoreStep = 0.5
} = {}) {
  const issues = [];
  const transects = [];
  let maximumAbsoluteSlope = 0;
  let maximumAbsoluteCurvature = 0;
  let maximumAdjacentStep = 0;
  let minimumSandbarWidth = Number.POSITIVE_INFINITY;
  let maximumShorelineElevationError = 0;
  const corridor = H_EARTH_C2_R1_COASTAL_PROFILE.corridor;

  for (let xIndex = 0; xIndex < xSamples; xIndex += 1) {
    const anchorX = corridor.alongshoreAnchorMinimum +
      ((corridor.alongshoreAnchorMaximum - corridor.alongshoreAnchorMinimum) * xIndex) /
      Math.max(1, xSamples - 1);
    const frame = shorelineFrame(anchorX);
    const samples = [];

    for (let d = -132; d <= 120 + 1e-9; d += crossShoreStep) {
      const worldX = frame.shoreline.x - frame.waterwardNormal.x * d;
      const worldZ = frame.shoreline.z - frame.waterwardNormal.z * d;
      const elevation = sampleHEarthC2R1CoastalElevation(worldX, worldZ);
      samples.push({ d, elevation });
      if (!finite(elevation)) issues.push(`NONFINITE_ELEVATION:${xIndex}:${d}`);
    }

    const finiteSamples = samples.filter(sample => finite(sample.elevation));
    if (finiteSamples.length !== samples.length) {
      issues.push(`TRANSECT_LEFT_VALID_WORLD_DOMAIN:${xIndex}`);
      continue;
    }

    const shoreline = finiteSamples.reduce((best, sample) =>
      Math.abs(sample.d) < Math.abs(best.d) ? sample : best, finiteSamples[0]);
    maximumShorelineElevationError = Math.max(
      maximumShorelineElevationError,
      Math.abs(shoreline.elevation)
    );

    for (let index = 1; index < finiteSamples.length; index += 1) {
      maximumAdjacentStep = Math.max(
        maximumAdjacentStep,
        Math.abs(finiteSamples[index].elevation - finiteSamples[index - 1].elevation)
      );
    }
    for (let index = 1; index + 1 < finiteSamples.length; index += 1) {
      const left = finiteSamples[index - 1];
      const center = finiteSamples[index];
      const right = finiteSamples[index + 1];
      const slope = (right.elevation - left.elevation) / (2 * crossShoreStep);
      const curvature =
        (left.elevation - 2 * center.elevation + right.elevation) /
        (crossShoreStep * crossShoreStep);
      maximumAbsoluteSlope = Math.max(maximumAbsoluteSlope, Math.abs(slope));
      maximumAbsoluteCurvature = Math.max(maximumAbsoluteCurvature, Math.abs(curvature));
    }

    const parameters = alongshoreParameters(anchorX);
    const barSamples = finiteSamples.filter(sample => {
      if (sample.d >= 0) return false;
      const waterward = -sample.d;
      const baseDepth =
        (0.036 * waterward + 0.000145 * waterward * waterward) *
        parameters.offshoreSlopeScale;
      return sample.elevation + baseDepth >= parameters.barAmplitude * 0.5;
    });
    if (barSamples.length > 1) {
      minimumSandbarWidth = Math.min(
        minimumSandbarWidth,
        Math.abs(barSamples[barSamples.length - 1].d - barSamples[0].d)
      );
    } else {
      issues.push(`SANDBAR_NOT_MEASURABLE:${xIndex}`);
    }

    const shallow = finiteSamples.find(
      sample => Math.abs(sample.d + 18) < crossShoreStep / 2
    );
    const offshore = finiteSamples.find(
      sample => Math.abs(sample.d + 126) < crossShoreStep / 2
    );
    if (!(shallow?.elevation < -0.25)) {
      issues.push(`SHALLOW_SEABED_NOT_SUBMERGED:${xIndex}`);
    }
    if (!(offshore?.elevation < shallow?.elevation - 3)) {
      issues.push(`OFFSHORE_DEPTH_NOT_INCREASED:${xIndex}`);
    }

    transects.push(freeze({
      anchorX,
      shorelineElevation: shoreline.elevation,
      sandbarCenter: parameters.barCenter,
      sandbarSigma: parameters.barSigma,
      sandbarAmplitude: parameters.barAmplitude
    }));
  }

  if (maximumShorelineElevationError > 0.08) {
    issues.push(`SHORELINE_ELEVATION_ERROR_EXCEEDED:${maximumShorelineElevationError}`);
  }
  if (maximumAdjacentStep > 0.09) {
    issues.push(`PROFILE_STEP_EXCEEDED:${maximumAdjacentStep}`);
  }
  if (maximumAbsoluteSlope > 0.22) {
    issues.push(`PROFILE_SLOPE_EXCEEDED:${maximumAbsoluteSlope}`);
  }
  if (maximumAbsoluteCurvature > 0.08) {
    issues.push(`PROFILE_CURVATURE_EXCEEDED:${maximumAbsoluteCurvature}`);
  }
  if (!(minimumSandbarWidth >= 28)) {
    issues.push(`SANDBAR_TOO_NARROW:${minimumSandbarWidth}`);
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'C2_R1_CONTINUOUS_COASTAL_PROFILE_PASS'
      : 'C2_R1_CONTINUOUS_COASTAL_PROFILE_FAIL',
    contractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
    xSamples,
    crossShoreStep,
    transectCount: transects.length,
    maximumShorelineElevationError,
    maximumAdjacentStep,
    maximumAbsoluteSlope,
    maximumAbsoluteCurvature,
    minimumSandbarWidth,
    actualDepthLawAvailable: true,
    continuousProfileUsed: true,
    normalsRecomputed: false,
    productionTerrainMutated: false,
    publicRouteMutated: false,
    issues: freeze(issues),
    transects: freeze(transects)
  });
}

export default sampleHEarthC2R1CoastalTerrainField;
