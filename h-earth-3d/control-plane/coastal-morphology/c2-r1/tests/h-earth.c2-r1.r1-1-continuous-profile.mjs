import fs from 'node:fs';
import path from 'node:path';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_COASTAL_PROFILE,
  sampleHEarthC2R1CoastalTerrainField
} from '../../../../terrain/h-earth.coastal-profile.c2-r1.js';

const outputPath = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/',
  'h-earth.c2-r1.r1-1-verification.json'
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const finite = value => typeof value === 'number' && Number.isFinite(value);

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
  return sampleHEarthC2R1CoastalTerrainField(
    frame.shoreline.x - frame.waterwardNormal.x * signedInlandDistance,
    frame.shoreline.z - frame.waterwardNormal.z * signedInlandDistance
  );
}

function alongshoreParameters(anchorX) {
  return {
    barCenter: 73 + 7 * Math.sin((anchorX - 12) / 104),
    barSigma: 27 + 3.5 * Math.sin((anchorX + 36) / 131),
    barAmplitude: 1.05 + 0.14 * Math.sin((anchorX - 24) / 79),
    offshoreSlopeScale: 1 + 0.07 * Math.sin((anchorX + 9) / 121)
  };
}

const corridor = H_EARTH_C2_R1_COASTAL_PROFILE.corridor;
const xSamples = 25;
const crossShoreStep = 0.5;
const transects = [];
const issues = [];
let maximumOwnedAdjacentStep = 0;
let maximumOwnedAbsoluteSlope = 0;
let maximumOwnedAbsoluteCurvature = 0;
let maximumShorelineElevationError = 0;
let maximumBlendSeamDelta = 0;
let minimumSandbarWidth = Number.POSITIVE_INFINITY;
let minimumOffshoreDepthGain = Number.POSITIVE_INFINITY;

for (let xIndex = 0; xIndex < xSamples; xIndex += 1) {
  const anchorX = corridor.alongshoreAnchorMinimum +
    ((corridor.alongshoreAnchorMaximum - corridor.alongshoreAnchorMinimum) * xIndex) /
    Math.max(1, xSamples - 1);
  const samples = [];
  for (let d = -132; d <= 136 + 1e-9; d += crossShoreStep) {
    const sample = sampleAtDistance(anchorX, d);
    samples.push({ d, sample });
    if (sample.valid !== true || !finite(sample.elevation)) {
      issues.push(`NONFINITE_OR_INVALID_SAMPLE:${xIndex}:${d}`);
    }
  }

  const owned = samples.filter(({ sample }) => sample.candidateWeight >= 0.999999);
  if (owned.length < 3) issues.push(`OWNED_PROFILE_SAMPLE_COUNT_INVALID:${xIndex}`);

  const shoreline = samples.reduce((best, candidate) =>
    Math.abs(candidate.d) < Math.abs(best.d) ? candidate : best, samples[0]);
  maximumShorelineElevationError = Math.max(
    maximumShorelineElevationError,
    Math.abs(shoreline.sample.elevation)
  );

  for (let index = 1; index < owned.length; index += 1) {
    maximumOwnedAdjacentStep = Math.max(
      maximumOwnedAdjacentStep,
      Math.abs(owned[index].sample.elevation - owned[index - 1].sample.elevation)
    );
  }
  for (let index = 1; index + 1 < owned.length; index += 1) {
    const left = owned[index - 1].sample.elevation;
    const center = owned[index].sample.elevation;
    const right = owned[index + 1].sample.elevation;
    maximumOwnedAbsoluteSlope = Math.max(
      maximumOwnedAbsoluteSlope,
      Math.abs((right - left) / (2 * crossShoreStep))
    );
    maximumOwnedAbsoluteCurvature = Math.max(
      maximumOwnedAbsoluteCurvature,
      Math.abs((left - 2 * center + right) / (crossShoreStep ** 2))
    );
  }

  const parameters = alongshoreParameters(anchorX);
  const broadBarSamples = owned.filter(({ d, sample }) => {
    if (d >= -24 || d < -120) return false;
    const waterward = -d;
    const noBarElevation = -(
      0.036 * waterward + 0.000145 * waterward * waterward
    ) * parameters.offshoreSlopeScale;
    const uplift = sample.elevation - noBarElevation;
    return uplift >= parameters.barAmplitude * 0.5;
  });
  if (broadBarSamples.length > 1) {
    minimumSandbarWidth = Math.min(
      minimumSandbarWidth,
      Math.abs(
        broadBarSamples[broadBarSamples.length - 1].d - broadBarSamples[0].d
      )
    );
  } else {
    issues.push(`BROAD_SANDBAR_NOT_MEASURABLE:${xIndex}`);
  }

  const shallow = sampleAtDistance(anchorX, -18);
  const offshore = sampleAtDistance(anchorX, -126);
  minimumOffshoreDepthGain = Math.min(
    minimumOffshoreDepthGain,
    offshore.actualVerticalWaterDepth - shallow.actualVerticalWaterDepth
  );

  for (const boundary of [-134, -120, 96, 136]) {
    const left = sampleAtDistance(anchorX, boundary - 0.05);
    const right = sampleAtDistance(anchorX, boundary + 0.05);
    if (left.valid !== true || right.valid !== true) {
      issues.push(`BLEND_SEAM_SAMPLE_INVALID:${xIndex}:${boundary}`);
      continue;
    }
    maximumBlendSeamDelta = Math.max(
      maximumBlendSeamDelta,
      Math.abs(right.elevation - left.elevation)
    );
  }

  transects.push({
    anchorX,
    ownedSampleCount: owned.length,
    shorelineElevation: shoreline.sample.elevation,
    shallowDepth: shallow.actualVerticalWaterDepth,
    offshoreDepth: offshore.actualVerticalWaterDepth,
    barCenter: parameters.barCenter,
    barSigma: parameters.barSigma,
    barAmplitude: parameters.barAmplitude
  });
}

const witnessCoordinates = [
  [-192, -72],
  [-96, -84],
  [0, -82],
  [96, -84],
  [192, -72]
];
const witnesses = witnessCoordinates.map(([x, z]) =>
  sampleHEarthC2R1CoastalTerrainField(x, z)
);
const boundaryWeights = {
  waterwardBlendEnd: sampleAtDistance(0, -134).candidateWeight,
  waterwardOwnedStart: sampleAtDistance(0, -120).candidateWeight,
  inlandOwnedEnd: sampleAtDistance(0, 96).candidateWeight,
  inlandBlendEnd: sampleAtDistance(0, 136).candidateWeight
};

const checks = {
  sourceBaselineExact:
    H_EARTH_C2_R1_COASTAL_PROFILE.startingBaselineHead ===
      '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  failedC2GeometryExcluded:
    H_EARTH_C2_R1_COASTAL_PROFILE.failedC2GeometryConsumed === false,
  finiteTransects: issues.every(issue => !issue.startsWith('NONFINITE_OR_INVALID')),
  finiteWitnesses: witnesses.every(sample => sample.valid === true),
  shorelineContinuous: maximumShorelineElevationError <= 0.08,
  ownedProfileAdjacentStepBounded: maximumOwnedAdjacentStep <= 0.09,
  ownedProfileSlopeBounded: maximumOwnedAbsoluteSlope <= 0.22,
  ownedProfileCurvatureBounded: maximumOwnedAbsoluteCurvature <= 0.08,
  blendSeamsContinuous: maximumBlendSeamDelta <= 0.25,
  blendWeightsWithinCurvedProjectionTolerance:
    boundaryWeights.waterwardBlendEnd <= 0.02 &&
    boundaryWeights.waterwardOwnedStart >= 0.999 &&
    boundaryWeights.inlandOwnedEnd >= 0.999 &&
    boundaryWeights.inlandBlendEnd <= 0.02,
  broadSandbarMeasurable: minimumSandbarWidth >= 28,
  offshoreDepthIncreases: minimumOffshoreDepthGain >= 3,
  actualVerticalDepthAvailable:
    witnesses.every(sample => Number.isFinite(sample.actualVerticalWaterDepth)),
  actualDepthIdentity:
    witnesses.every(sample => Math.abs(
      sample.actualVerticalWaterDepth - Math.max(0, sample.seaLevelY - sample.elevation)
    ) <= 1e-10),
  normalsDeferredToR12:
    witnesses.every(sample =>
      sample.normalsDeferredToCheckpoint ===
        'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING'
    ),
  productDefaultUnchanged:
    witnesses.every(sample => sample.productionTerrainMutated === false),
  publicRouteUnchanged:
    witnesses.every(sample => sample.publicRouteMutated === false)
};

const failedChecks = Object.entries(checks)
  .filter(([, passed]) => passed !== true)
  .map(([name]) => name);
const result = failedChecks.length === 0 && issues.length === 0
  ? 'PASS_CLOSED'
  : 'HARD_BLOCKED';

const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_1_CONTINUOUS_PROFILE_VERIFICATION_v3',
  operation: 'R1.1_CONTINUOUS_BEACH_AND_BATHYMETRY',
  result,
  startingBaselineHead:
    '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  candidateHead: process.env.C2_R1_HEAD ?? null,
  verificationBoundary: {
    strictProfileMetrics: 'FULLY_OWNED_COASTAL_PROFILE_ONLY',
    acceptedInlandTerrain: 'SEPARATE_BLEND_SEAM_CONTINUITY_ONLY',
    curvedProjectionWeightTolerance: 0.02,
    laterPassesStarted: false
  },
  checks,
  metrics: {
    transectCount: transects.length,
    crossShoreStep,
    maximumShorelineElevationError,
    maximumOwnedAdjacentStep,
    maximumOwnedAbsoluteSlope,
    maximumOwnedAbsoluteCurvature,
    maximumBlendSeamDelta,
    minimumSandbarWidth,
    minimumOffshoreDepthGain,
    boundaryWeights
  },
  actualDepthUsed: true,
  continuousProfileUsed: true,
  normalsRecomputed: false,
  materialsChanged: false,
  waterOpticsChanged: false,
  breakersChanged: false,
  rendererChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  nextCheckpoint:
    result === 'PASS_CLOSED'
      ? 'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING'
      : 'R1.1_REMAINS_OPEN',
  firstBlocker: failedChecks[0] ?? issues[0] ?? null,
  evaluationIssues: issues,
  witnessCount: witnesses.length,
  transects
};

fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (result !== 'PASS_CLOSED') process.exitCode = 1;
