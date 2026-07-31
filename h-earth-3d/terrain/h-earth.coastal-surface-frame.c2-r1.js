/**
 * H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_v1
 *
 * Candidate-only normal and lighting projection derived from the closed R1.1
 * continuous coastal profile. It recomputes geometric normals after the
 * candidate displacement and exposes bounded lighting incidence facts. It
 * creates no material, water-optics, wave, renderer, camera, route, or
 * deployment authority.
 */

import {
  getHEarthCanonicalShorelineZ
} from './h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from './h-earth.coastal-profile.c2-r1.js';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const dot = (left, right) =>
  left.x * right.x + left.y * right.y + left.z * right.z;
const normalize = vector => {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (!(length > Number.EPSILON)) return null;
  return freeze({
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  });
};
const angleDegrees = (left, right) =>
  Math.acos(clamp(dot(left, right), -1, 1)) * 180 / Math.PI;

export const H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID =
  'H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_v1';

export const H_EARTH_C2_R1_COASTAL_SURFACE_FRAME = freeze({
  contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceCheckpoint: 'R1.1_CONTINUOUS_BEACH_AND_BATHYMETRY',
  checkpoint: 'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING',
  derivativeStepWorldUnits: 0.5,
  normalRule: 'CENTRAL_DIFFERENCE_FROM_DISPLACED_C2_R1_PROFILE_WITH_ONE_SIDED_DOMAIN_FALLBACK',
  lightingRule: 'NORMALIZED_SUN_INCIDENCE_PLUS_BOUNDED_SKY_HEMISPHERE',
  defaultSunDirection: freeze({ x: -0.31, y: 0.84, z: 0.445 }),
  ownership: freeze({
    ownsCandidateRecomputedNormals: true,
    ownsCandidateLightingProjection: true,
    ownsProductionTerrain: false,
    ownsMaterials: false,
    ownsWaterOptics: false,
    ownsWavesOrFoam: false,
    ownsRenderer: false,
    ownsCameraOrNavigation: false,
    ownsPublicRoute: false
  })
});

function axisDerivative(center, minus, plus, step) {
  if (finite(minus) && finite(plus)) return (plus - minus) / (2 * step);
  if (finite(plus)) return (plus - center) / step;
  if (finite(minus)) return (center - minus) / step;
  return Number.NaN;
}

function elevationAt(worldX, worldZ) {
  const sample = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  return sample?.valid === true && finite(sample.elevation)
    ? sample.elevation
    : Number.NaN;
}

function deriveDisplacedGradient(worldX, worldZ, centerElevation) {
  const step = H_EARTH_C2_R1_COASTAL_SURFACE_FRAME.derivativeStepWorldUnits;
  const left = elevationAt(worldX - step, worldZ);
  const right = elevationAt(worldX + step, worldZ);
  const back = elevationAt(worldX, worldZ - step);
  const front = elevationAt(worldX, worldZ + step);
  return freeze({
    x: axisDerivative(centerElevation, left, right, step),
    z: axisDerivative(centerElevation, back, front, step),
    step,
    xMode: finite(left) && finite(right) ? 'CENTRAL' : 'ONE_SIDED',
    zMode: finite(back) && finite(front) ? 'CENTRAL' : 'ONE_SIDED'
  });
}

function resolveLighting(normal, sunDirectionInput) {
  const sunDirection = normalize(sunDirectionInput);
  if (!sunDirection || sunDirection.y <= 0) return null;
  const directIncidence = Math.max(0, dot(normal, sunDirection));
  const skyHemisphere = clamp(normal.y, 0, 1);
  const ambientContribution = 0.24 + skyHemisphere * 0.28;
  const directContribution = directIncidence * 0.72;
  return freeze({
    sunDirection,
    directIncidence,
    skyHemisphere,
    ambientContribution,
    directContribution,
    scalar: clamp(ambientContribution + directContribution, 0, 1.25),
    invertedLighting: false,
    materialIndependent: true,
    rendererIndependent: true
  });
}

export function sampleHEarthC2R1CoastalSurfaceFrame(
  worldX,
  worldZ,
  {
    sunDirection = H_EARTH_C2_R1_COASTAL_SURFACE_FRAME.defaultSunDirection
  } = {}
) {
  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  if (terrain?.valid !== true || !finite(terrain.elevation)) {
    return freeze({
      valid: false,
      status: 'C2_R1_COASTAL_SURFACE_FRAME_REJECTED',
      contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
      worldX,
      worldZ
    });
  }

  const gradient = deriveDisplacedGradient(worldX, worldZ, terrain.elevation);
  if (!finite(gradient.x) || !finite(gradient.z)) {
    return freeze({
      valid: false,
      status: 'C2_R1_COASTAL_SURFACE_FRAME_REJECTED',
      contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
      worldX,
      worldZ,
      issues: freeze(['DISPLACED_GRADIENT_NONFINITE'])
    });
  }

  const normal = normalize({ x: -gradient.x, y: 1, z: -gradient.z });
  const lighting = normal ? resolveLighting(normal, sunDirection) : null;
  if (!normal || !lighting) {
    return freeze({
      valid: false,
      status: 'C2_R1_COASTAL_SURFACE_FRAME_REJECTED',
      contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
      worldX,
      worldZ,
      issues: freeze(['NORMAL_OR_LIGHTING_PROJECTION_INVALID'])
    });
  }

  const slope = Math.hypot(gradient.x, gradient.z);
  return freeze({
    valid: true,
    status: 'C2_R1_COASTAL_SURFACE_FRAME_COMPLETE',
    contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
    sourceProfileContractId: terrain.contractId,
    world: terrain.world,
    elevation: terrain.elevation,
    actualVerticalWaterDepth: terrain.actualVerticalWaterDepth,
    candidateWeight: terrain.candidateWeight,
    gradient,
    slope,
    slopeDegrees: Math.atan(slope) * 180 / Math.PI,
    normal,
    normalLength: Math.hypot(normal.x, normal.y, normal.z),
    normalRecomputedAfterDisplacement: true,
    normalSource: 'C2_R1_DISPLACED_PROFILE_CENTRAL_DIFFERENCE',
    lighting,
    materialsDeferredToCheckpoint: 'R1.3_GRADUAL_SEDIMENT_MEMBERSHIPS',
    waterOpticsDeferredToCheckpoint: 'R1.4_ACTUAL_DEPTH_WATER_OPTICS',
    productionTerrainMutated: false,
    rendererMutated: false,
    publicRouteMutated: false
  });
}

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  let normalX = -tangentZ / length;
  let normalZ = tangentX / length;
  if (normalZ < 0) {
    normalX *= -1;
    normalZ *= -1;
  }
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    waterwardNormal: { x: normalX, z: normalZ }
  };
}

function sampleAtDistance(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return sampleHEarthC2R1CoastalSurfaceFrame(
    frame.shoreline.x - frame.waterwardNormal.x * signedInlandDistance,
    frame.shoreline.z - frame.waterwardNormal.z * signedInlandDistance
  );
}

export function evaluateHEarthC2R1CoastalSurfaceFrame({
  xSamples = 25,
  crossShoreStep = 1
} = {}) {
  const issues = [];
  const transects = [];
  let maximumNormalLengthError = 0;
  let minimumNormalY = Number.POSITIVE_INFINITY;
  let maximumAdjacentNormalAngleDegrees = 0;
  let maximumAlongshoreNormalAngleDegrees = 0;
  let maximumBlendSeamNormalAngleDegrees = 0;
  let maximumAdjacentLightingDelta = 0;
  let minimumLightingScalar = Number.POSITIVE_INFINITY;
  let maximumLightingScalar = Number.NEGATIVE_INFINITY;
  let sampleCount = 0;
  let previousTransect = null;

  for (let xIndex = 0; xIndex < xSamples; xIndex += 1) {
    const anchorX = -184 + (368 * xIndex) / Math.max(1, xSamples - 1);
    const samples = [];
    for (let distance = -120; distance <= 96 + 1e-9; distance += crossShoreStep) {
      const sample = sampleAtDistance(anchorX, distance);
      samples.push({ distance, sample });
      sampleCount += 1;
      if (sample.valid !== true) {
        issues.push(`SURFACE_FRAME_INVALID:${xIndex}:${distance}`);
        continue;
      }
      maximumNormalLengthError = Math.max(
        maximumNormalLengthError,
        Math.abs(sample.normalLength - 1)
      );
      minimumNormalY = Math.min(minimumNormalY, sample.normal.y);
      minimumLightingScalar = Math.min(minimumLightingScalar, sample.lighting.scalar);
      maximumLightingScalar = Math.max(maximumLightingScalar, sample.lighting.scalar);
    }

    for (let index = 1; index < samples.length; index += 1) {
      const left = samples[index - 1].sample;
      const right = samples[index].sample;
      if (left.valid !== true || right.valid !== true) continue;
      maximumAdjacentNormalAngleDegrees = Math.max(
        maximumAdjacentNormalAngleDegrees,
        angleDegrees(left.normal, right.normal)
      );
      maximumAdjacentLightingDelta = Math.max(
        maximumAdjacentLightingDelta,
        Math.abs(left.lighting.scalar - right.lighting.scalar)
      );
    }

    if (previousTransect) {
      for (let index = 0; index < Math.min(previousTransect.length, samples.length); index += 1) {
        const previous = previousTransect[index].sample;
        const current = samples[index].sample;
        if (previous.valid !== true || current.valid !== true) continue;
        maximumAlongshoreNormalAngleDegrees = Math.max(
          maximumAlongshoreNormalAngleDegrees,
          angleDegrees(previous.normal, current.normal)
        );
      }
    }
    previousTransect = samples;

    for (const boundary of [-120, 96]) {
      const left = sampleAtDistance(anchorX, boundary - 0.25);
      const right = sampleAtDistance(anchorX, boundary + 0.25);
      if (left.valid !== true || right.valid !== true) {
        issues.push(`BLEND_NORMAL_SAMPLE_INVALID:${xIndex}:${boundary}`);
        continue;
      }
      maximumBlendSeamNormalAngleDegrees = Math.max(
        maximumBlendSeamNormalAngleDegrees,
        angleDegrees(left.normal, right.normal)
      );
    }

    const shoreline = sampleAtDistance(anchorX, 0);
    transects.push(freeze({
      anchorX,
      shorelineNormal: shoreline.valid ? shoreline.normal : null,
      shorelineLightingScalar: shoreline.valid ? shoreline.lighting.scalar : null
    }));
  }

  if (maximumNormalLengthError > 1e-10) {
    issues.push(`NORMAL_LENGTH_ERROR_EXCEEDED:${maximumNormalLengthError}`);
  }
  if (!(minimumNormalY >= 0.9)) {
    issues.push(`COASTAL_NORMAL_TOO_HORIZONTAL:${minimumNormalY}`);
  }
  if (maximumAdjacentNormalAngleDegrees > 8) {
    issues.push(`CROSS_SHORE_NORMAL_DISCONTINUITY:${maximumAdjacentNormalAngleDegrees}`);
  }
  if (maximumAlongshoreNormalAngleDegrees > 12) {
    issues.push(`ALONGSHORE_NORMAL_DISCONTINUITY:${maximumAlongshoreNormalAngleDegrees}`);
  }
  if (maximumBlendSeamNormalAngleDegrees > 25) {
    issues.push(`BLEND_SEAM_NORMAL_DISCONTINUITY:${maximumBlendSeamNormalAngleDegrees}`);
  }
  if (maximumAdjacentLightingDelta > 0.16) {
    issues.push(`LIGHTING_DISCONTINUITY:${maximumAdjacentLightingDelta}`);
  }
  if (!(minimumLightingScalar >= 0.2) || !(maximumLightingScalar <= 1.25)) {
    issues.push(`LIGHTING_RANGE_INVALID:${minimumLightingScalar}:${maximumLightingScalar}`);
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'C2_R1_COASTAL_SURFACE_FRAME_PASS'
      : 'C2_R1_COASTAL_SURFACE_FRAME_FAIL',
    contractId: H_EARTH_C2_R1_COASTAL_SURFACE_FRAME_CONTRACT_ID,
    sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
    xSamples,
    crossShoreStep,
    sampleCount,
    maximumNormalLengthError,
    minimumNormalY,
    maximumAdjacentNormalAngleDegrees,
    maximumAlongshoreNormalAngleDegrees,
    maximumBlendSeamNormalAngleDegrees,
    maximumAdjacentLightingDelta,
    minimumLightingScalar,
    maximumLightingScalar,
    normalsRecomputed: true,
    normalContinuityChecked: true,
    lightingProjectionChecked: true,
    materialsChanged: false,
    waterOpticsChanged: false,
    rendererChanged: false,
    productionTerrainMutated: false,
    publicRouteMutated: false,
    issues: freeze(issues),
    transects: freeze(transects)
  });
}

export default sampleHEarthC2R1CoastalSurfaceFrame;
