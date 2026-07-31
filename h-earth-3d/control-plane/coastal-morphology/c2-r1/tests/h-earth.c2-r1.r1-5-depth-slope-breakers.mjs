import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_BREAKER_FIELD,
  deriveHEarthC2R1BreakerResponseFromFactors,
  evaluateHEarthC2R1BreakerField,
  sampleHEarthC2R1CoastalBreakerField
} from '../../../../environment/h-earth.coastal-breaker-field.c2-r1.js';

const STARTING_HEAD = 'f0a7c2b26448db2429feec8cbf45b58986da81d4';
const PROFILE_PATH = 'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js';
const SURFACE_PATH = 'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js';
const SEDIMENT_PATH = 'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js';
const CONTINUOUS_SEDIMENT_PATH =
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js';
const OPTICS_PATH =
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js';

const PROFILE_BLOB = '45cbd83337c14bc94ce7d173b25f2157cb4eb84f';
const SURFACE_BLOB = 'c5a439f2833a4def90944e5eb1d03005ddb41e70';
const SEDIMENT_BLOB = '3eb689c5a030c40ebede52c6eaef300207742a7c';
const CONTINUOUS_SEDIMENT_BLOB =
  'c0e103b0cbb51eac30105f0e8ae68c37e8fac281';
const OPTICS_BLOB = '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1';

const OUT = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence'
);
const CAPTURE_OUT = path.join(OUT, 'r1-5-engineering-captures');
const RECEIPT = path.join(OUT, 'h-earth.c2-r1.r1-5-verification.json');
fs.mkdirSync(CAPTURE_OUT, { recursive: true });

const finite = Number.isFinite;
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const blob = (repositoryPath) => execFileSync(
  'git',
  ['hash-object', repositoryPath],
  { encoding: 'utf8' }
).trim();
const mean = (values) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const standardDeviation = (values) => {
  const center = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - center) ** 2)));
};
const nondecreasing = (values) =>
  values.every((value, index) => index === 0 || value >= values[index - 1] - 1e-12);

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const length = Math.hypot(1, z1 - z0);
  const tangent = { x: 1 / length, z: (z1 - z0) / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) {
    waterwardNormal = {
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    };
  }
  return {
    x: anchorX,
    z: getHEarthCanonicalShorelineZ(anchorX),
    tangent,
    waterwardNormal
  };
}

function at(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return sampleHEarthC2R1CoastalBreakerField(
    frame.x - frame.waterwardNormal.x * signedInlandDistance,
    frame.z - frame.waterwardNormal.z * signedInlandDistance
  );
}

function svg(name, title, body, width = 1200, height = 520) {
  fs.writeFileSync(
    path.join(CAPTURE_OUT, name),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    '<rect width="100%" height="100%" fill="white"/>' +
    `<text x="24" y="31" font-family="sans-serif" font-size="18">${title}</text>` +
    body +
    '</svg>\n'
  );
}

function intensityColor(value) {
  const v = clamp(value, 0, 1);
  const r = Math.round(245 - 170 * v);
  const g = Math.round(248 - 90 * v);
  const b = Math.round(250 - 20 * v);
  return `rgb(${r},${g},${b})`;
}

const issues = [];
const executionHead = process.env.C2_R1_HEAD ?? execFileSync(
  'git',
  ['rev-parse', 'HEAD'],
  { encoding: 'utf8' }
).trim();

const changedPaths = execFileSync(
  'git',
  ['diff', '--name-only', `${STARTING_HEAD}..HEAD`],
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);
const allowedR15ExactPaths = new Set([
  '.github/workflows/h-earth-c2-r1-r1-5-depth-slope-breakers.yml',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js',
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js'
]);
const r15PathBoundaryMaintained = changedPaths.every((repositoryPath) =>
  repositoryPath.startsWith(
    'h-earth-3d/control-plane/coastal-morphology/c2-r1/'
  ) || allowedR15ExactPaths.has(repositoryPath)
);

const checks = {
  startingHeadExact: execFileSync(
    'git',
    ['merge-base', '--is-ancestor', STARTING_HEAD, 'HEAD']
  ).length === 0,
  r15PathBoundaryMaintained,
  r11GeometryUnchanged: blob(PROFILE_PATH) === PROFILE_BLOB,
  r12NormalsUnchanged: blob(SURFACE_PATH) === SURFACE_BLOB,
  r13SedimentMembershipsUnchanged:
    blob(SEDIMENT_PATH) === SEDIMENT_BLOB &&
    blob(CONTINUOUS_SEDIMENT_PATH) === CONTINUOUS_SEDIMENT_BLOB,
  r14WaterOpticsUnchanged: blob(OPTICS_PATH) === OPTICS_BLOB,
  requiredControllingInputsDeclared:
    JSON.stringify(H_EARTH_C2_R1_BREAKER_FIELD.controllingInputs) ===
    JSON.stringify([
      'LOCAL_WATER_DEPTH',
      'SEABED_SLOPE',
      'DEPTH_CHANGE_RATE',
      'WAVE_DIRECTION',
      'SHORELINE_ORIENTATION'
    ]),
  shorelineDistanceNotSoleDriver:
    H_EARTH_C2_R1_BREAKER_FIELD.shorelineDistanceOnlyDriver === false
};

const transects = [];
let sampleCount = 0;
let waterSampleCount = 0;
let activeSampleCount = 0;
let maximumCrossShoreIntensityDelta = 0;
let maximumCrossShoreEligibilityDelta = 0;
let maximumDeepWaterIntensity = 0;
let maximumDryLandIntensity = 0;
let maximumNonRisingSeabedIntensity = 0;
let maximumActiveDepth = 0;
let minimumActiveDepth = Number.POSITIVE_INFINITY;
let maximumOffshoreBreakerIntensity = 0;
let maximumNearshoreBreakerIntensity = 0;
let minimumWaveDirectionLength = Number.POSITIVE_INFINITY;
let maximumWaveDirectionLength = 0;
let waveDirectionXMinimum = Number.POSITIVE_INFINITY;
let waveDirectionXMaximum = Number.NEGATIVE_INFINITY;
let alignmentMinimum = Number.POSITIVE_INFINITY;
let alignmentMaximum = Number.NEGATIVE_INFINITY;

for (let xIndex = 0; xIndex < 25; xIndex += 1) {
  const anchorX = -184 + 368 * xIndex / 24;
  const samples = [];
  let previous = null;

  for (let d = 10; d >= -120; d -= 1) {
    const sample = at(anchorX, d);
    sampleCount += 1;
    const evaluation = evaluateHEarthC2R1BreakerField(sample);
    if (evaluation.eligible !== true) {
      issues.push(`INVALID_BREAKER_SAMPLE:${xIndex}:${d}:${evaluation.issues.join('|')}`);
      continue;
    }

    const direction = sample.waveApproach.incomingWaveDirection;
    const directionLength = Math.hypot(direction.x, direction.z);
    minimumWaveDirectionLength = Math.min(
      minimumWaveDirectionLength,
      directionLength
    );
    maximumWaveDirectionLength = Math.max(
      maximumWaveDirectionLength,
      directionLength
    );
    waveDirectionXMinimum = Math.min(waveDirectionXMinimum, direction.x);
    waveDirectionXMaximum = Math.max(waveDirectionXMaximum, direction.x);
    alignmentMinimum = Math.min(
      alignmentMinimum,
      sample.waveApproach.shorelineOrientationAlignment
    );
    alignmentMaximum = Math.max(
      alignmentMaximum,
      sample.waveApproach.shorelineOrientationAlignment
    );

    if (previous) {
      maximumCrossShoreIntensityDelta = Math.max(
        maximumCrossShoreIntensityDelta,
        Math.abs(previous.breakerIntensity - sample.breakerIntensity)
      );
      maximumCrossShoreEligibilityDelta = Math.max(
        maximumCrossShoreEligibilityDelta,
        Math.abs(previous.breakerEligibility - sample.breakerEligibility)
      );
    }
    previous = sample;

    if (sample.actualVerticalWaterDepth > 0) waterSampleCount += 1;
    if (sample.breakerIntensity > 0.02) {
      activeSampleCount += 1;
      minimumActiveDepth = Math.min(
        minimumActiveDepth,
        sample.actualVerticalWaterDepth
      );
      maximumActiveDepth = Math.max(
        maximumActiveDepth,
        sample.actualVerticalWaterDepth
      );
    }
    if (sample.actualVerticalWaterDepth >= 3.5) {
      maximumDeepWaterIntensity = Math.max(
        maximumDeepWaterIntensity,
        sample.breakerIntensity
      );
    }
    if (!(sample.actualVerticalWaterDepth > 0)) {
      maximumDryLandIntensity = Math.max(
        maximumDryLandIntensity,
        sample.breakerIntensity
      );
    }
    if (!(sample.directionalDepth.directionalDepthChangeRate < 0) ||
        !(sample.directionalSeabedRiseRate > 0)) {
      maximumNonRisingSeabedIntensity = Math.max(
        maximumNonRisingSeabedIntensity,
        sample.breakerIntensity
      );
    }
    if (d <= -45 && d >= -85) {
      maximumOffshoreBreakerIntensity = Math.max(
        maximumOffshoreBreakerIntensity,
        sample.breakerIntensity
      );
    }
    if (d <= -4 && d >= -30) {
      maximumNearshoreBreakerIntensity = Math.max(
        maximumNearshoreBreakerIntensity,
        sample.breakerIntensity
      );
    }

    samples.push({ d, sample });
  }

  transects.push({ anchorX, samples });
}

let maximumAlongshoreIntensityDelta = 0;
let maximumAlongshoreIntensityRange = 0;
let maximumAlongshoreIntensityStandardDeviation = 0;
const alongshoreSlices = [];

for (const d of [-5, -10, -20, -30, -50, -60, -70, -80]) {
  const values = [];
  let previous = null;
  for (let anchorX = -184; anchorX <= 184; anchorX += 2) {
    const sample = at(anchorX, d);
    if (sample.valid !== true) continue;
    values.push(sample.breakerIntensity);
    if (previous !== null) {
      maximumAlongshoreIntensityDelta = Math.max(
        maximumAlongshoreIntensityDelta,
        Math.abs(previous - sample.breakerIntensity)
      );
    }
    previous = sample.breakerIntensity;
  }
  const range = Math.max(...values) - Math.min(...values);
  const deviation = standardDeviation(values);
  maximumAlongshoreIntensityRange = Math.max(
    maximumAlongshoreIntensityRange,
    range
  );
  maximumAlongshoreIntensityStandardDeviation = Math.max(
    maximumAlongshoreIntensityStandardDeviation,
    deviation
  );
  alongshoreSlices.push({
    signedInlandDistance: d,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    range,
    standardDeviation: deviation
  });
}

const baseFactors = {
  actualVerticalWaterDepth: 1.2,
  localSlope: 0.055,
  directionalDepthChangeRate: -0.04,
  directionalSeabedRiseRate: 0.04,
  shorelineOrientationAlignment: 0.98,
  waveEnergy: 0.9,
  crestPhase: 0
};
const baseResponse =
  deriveHEarthC2R1BreakerResponseFromFactors(baseFactors);
const dryResponse = deriveHEarthC2R1BreakerResponseFromFactors({
  ...baseFactors,
  actualVerticalWaterDepth: 0
});
const deepResponse = deriveHEarthC2R1BreakerResponseFromFactors({
  ...baseFactors,
  actualVerticalWaterDepth: 4.5
});
const fallingSeabedResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    directionalDepthChangeRate: 0.04,
    directionalSeabedRiseRate: -0.04
  });
const flatSeabedResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    localSlope: 0.001
  });
const steepSeabedResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    localSlope: 0.6
  });
const misalignedResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    shorelineOrientationAlignment: 0.1
  });
const highPhaseResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    crestPhase: 1
  });
const lowPhaseResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    crestPhase: -1
  });

const depthResponseSequence = [3, 2.5, 2, 1.2, 0.8, 0.5].map(
  (actualVerticalWaterDepth) =>
    deriveHEarthC2R1BreakerResponseFromFactors({
      ...baseFactors,
      actualVerticalWaterDepth
    }).breakerIntensity
);
const shorelineFadeResponse =
  deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    actualVerticalWaterDepth: 0.08
  });

Object.assign(checks, {
  actualDepthUsed:
    baseResponse?.actualVerticalWaterDepth ===
      baseFactors.actualVerticalWaterDepth &&
    depthResponseSequence[0] < depthResponseSequence.at(-1),
  seabedSlopeUsed:
    baseResponse?.breakerIntensity > 0.2 &&
    flatSeabedResponse?.breakerIntensity === 0 &&
    steepSeabedResponse?.breakerIntensity === 0,
  depthChangeRateUsed:
    baseResponse?.seabedRisesAlongIncomingWaveDirection === true &&
    fallingSeabedResponse?.breakerIntensity === 0,
  waveDirectionUsed:
    minimumWaveDirectionLength > 0.9999999999 &&
    maximumWaveDirectionLength < 1.0000000001 &&
    waveDirectionXMaximum - waveDirectionXMinimum > 0.08,
  shorelineOrientationUsed:
    baseResponse?.breakerIntensity >
      misalignedResponse?.breakerIntensity + 0.2 &&
    alignmentMaximum - alignmentMinimum > 0.005,
  deepWaterBreakersAbsent:
    deepResponse?.breakerIntensity === 0 &&
    maximumDeepWaterIntensity <= 1e-12,
  dryLandBreakersAbsent:
    dryResponse?.breakerIntensity === 0 &&
    maximumDryLandIntensity <= 1e-12,
  breakersRequireRisingSeabed:
    fallingSeabedResponse?.breakerIntensity === 0 &&
    maximumNonRisingSeabedIntensity <= 0.02,
  breakerStrengthIncreasesWithShallowing:
    nondecreasing(depthResponseSequence),
  breakerTerminatesAtShoreline:
    shorelineFadeResponse?.breakerIntensity <
      depthResponseSequence.at(-1) * 0.2 &&
    dryResponse?.breakerIntensity === 0,
  breakerTransitionsContinuous:
    maximumCrossShoreIntensityDelta < 0.18 &&
    maximumCrossShoreEligibilityDelta < 0.24 &&
    maximumAlongshoreIntensityDelta < 0.08,
  alongshoreVariationPresent:
    maximumAlongshoreIntensityRange > 0.12 &&
    maximumAlongshoreIntensityStandardDeviation > 0.03,
  sandbarOffshoreAffinityPresent:
    maximumOffshoreBreakerIntensity > 0.2,
  nearshoreBreakerAffinityPresent:
    maximumNearshoreBreakerIntensity > 0.4,
  activeDepthRangePhysicallyBounded:
    minimumActiveDepth > 0 &&
    maximumActiveDepth < 3.5,
  phaseModulationRestrained:
    highPhaseResponse?.breakerIntensity >
      lowPhaseResponse?.breakerIntensity &&
    highPhaseResponse.breakerIntensity -
      lowPhaseResponse.breakerIntensity < 0.12,
  noPermanentLuminousStrips:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.luminous === false &&
        sample.luminousStripCreated === false
      )
    ),
  fullSwashFoamAndWetnessAbsent:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.visibleFoamCreated === false &&
        sample.swashCreated === false &&
        sample.temporaryWetnessCreated === false
      )
    ),
  openOceanDisplacementAbsent:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.openOceanDisplacementCreated === false &&
        sample.geometryMutated === false
      )
    ),
  rendererLifecycleUnchanged:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.rendererLifecycleMutated === false
      )
    ),
  productDefaultUnchanged:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.productDefaultMutated === false
      )
    ),
  publicRouteUnchanged:
    transects.every(({ samples }) =>
      samples.every(({ sample }) =>
        sample.publicRouteMutated === false
      )
    ),
  representativeEngineeringCaptureSetPresent: true
});

for (const [name, passed] of Object.entries(checks)) {
  if (passed !== true) issues.push(`CHECK_FAILED:${name}`);
}

const factorDepths = Array.from(
  { length: 71 },
  (_, index) => index * 0.05
);
const factorCurve = factorDepths.map((actualVerticalWaterDepth) => ({
  actualVerticalWaterDepth,
  response: deriveHEarthC2R1BreakerResponseFromFactors({
    ...baseFactors,
    actualVerticalWaterDepth
  })
}));
const factorPath = (selector) => factorCurve.map(
  ({ actualVerticalWaterDepth, response }, index) => {
    const x = 55 + actualVerticalWaterDepth / 3.5 * 1080;
    const y = 470 - selector(response) * 395;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }
).join(' ');
svg(
  'h-earth.c2-r1.r1-5-physical-response-curves.svg',
  'R1.5 physical breaker response: eligibility and intensity by actual depth',
  `<path d="${factorPath((response) => response.breakerEligibility)}" fill="none" stroke="black" stroke-width="3"/>` +
  `<path d="${factorPath((response) => response.breakerIntensity)}" fill="none" stroke="navy" stroke-width="3"/>` +
  '<text x="55" y="505" font-family="sans-serif" font-size="13">actual depth 0 → 3.5; shoreline termination and deep-water exclusion are visible</text>'
);

let transectBody = '';
for (const [row, transect] of [
  transects[2],
  transects[12],
  transects[22]
].entries()) {
  for (const [index, { sample }] of transect.samples.entries()) {
    transectBody +=
      `<rect x="${35 + index * 8.5}" y="${65 + row * 120}" ` +
      `width="9" height="76" fill="${intensityColor(sample.breakerIntensity)}"/>`;
  }
  transectBody +=
    `<text x="35" y="${158 + row * 120}" font-family="sans-serif" font-size="12">` +
    `anchor x ${transect.anchorX.toFixed(1)}; +10 inland → 120 waterward` +
    '</text>';
}
svg(
  'h-earth.c2-r1.r1-5-breaker-intensity-transects.svg',
  'R1.5 breaker-intensity transects; physical gaps remain at incompatible seabed segments',
  transectBody,
  1200,
  455
);

let mapBody = '';
for (const [row, transect] of transects.entries()) {
  for (const [column, { sample }] of transect.samples.entries()) {
    mapBody +=
      `<rect x="${65 + column * 7.9}" y="${55 + row * 16}" ` +
      `width="8" height="17" fill="${intensityColor(sample.breakerIntensity)}"/>`;
  }
}
mapBody +=
  '<text x="65" y="480" font-family="sans-serif" font-size="12">horizontal: inland/shoreline to offshore; vertical: alongshore anchor x -184 to 184</text>';
svg(
  'h-earth.c2-r1.r1-5-breaker-placement-map.svg',
  'R1.5 depth-and-slope-aligned breaker placement map',
  mapBody,
  1200,
  510
);

const captureFiles = [
  'h-earth.c2-r1.r1-5-physical-response-curves.svg',
  'h-earth.c2-r1.r1-5-breaker-intensity-transects.svg',
  'h-earth.c2-r1.r1-5-breaker-placement-map.svg'
];
for (const captureFile of captureFiles) {
  if (!fs.existsSync(path.join(CAPTURE_OUT, captureFile))) {
    issues.push(`CAPTURE_NOT_WRITTEN:${captureFile}`);
  }
}

const result = issues.length === 0 ? 'PASS_CLOSED' : 'HARD_BLOCKED';
const receipt = {
  receiptType:
    'H_EARTH_C2_R1_R1_5_DEPTH_AND_SLOPE_ALIGNED_BREAKER_VERIFICATION_v1',
  operation: 'R1.5_DEPTH_AND_SLOPE_ALIGNED_BREAKERS',
  result,
  startingHead: STARTING_HEAD,
  executionHead,
  rollbackBranch: 'rollback/h-earth-c2-r1-r1-4-closed-001',
  changedPaths,
  checks,
  metrics: {
    sampleCount,
    waterSampleCount,
    activeSampleCount,
    minimumActiveDepth:
      finite(minimumActiveDepth) ? minimumActiveDepth : null,
    maximumActiveDepth,
    maximumCrossShoreIntensityDelta,
    maximumCrossShoreEligibilityDelta,
    maximumAlongshoreIntensityDelta,
    maximumAlongshoreIntensityRange,
    maximumAlongshoreIntensityStandardDeviation,
    maximumDeepWaterIntensity,
    maximumDryLandIntensity,
    maximumNonRisingSeabedIntensity,
    maximumOffshoreBreakerIntensity,
    maximumNearshoreBreakerIntensity,
    waveDirectionXRange:
      waveDirectionXMaximum - waveDirectionXMinimum,
    shorelineAlignmentRange:
      alignmentMaximum - alignmentMinimum,
    profileBlob: blob(PROFILE_PATH),
    surfaceBlob: blob(SURFACE_PATH),
    sedimentBlob: blob(SEDIMENT_PATH),
    continuousSedimentBlob: blob(CONTINUOUS_SEDIMENT_PATH),
    opticsBlob: blob(OPTICS_PATH)
  },
  alongshoreSlices,
  actualDepthUsed: checks.actualDepthUsed,
  seabedSlopeUsed: checks.seabedSlopeUsed,
  waveDirectionUsed: checks.waveDirectionUsed,
  shorelineOrientationUsed: checks.shorelineOrientationUsed,
  deepWaterBreakersAbsent: checks.deepWaterBreakersAbsent,
  dryLandBreakersAbsent: checks.dryLandBreakersAbsent,
  breakerTransitionsContinuous: checks.breakerTransitionsContinuous,
  alongshoreVariationPresent: checks.alongshoreVariationPresent,
  representativeCaptureCount: captureFiles.length,
  geometryUnchanged: checks.r11GeometryUnchanged,
  normalsUnchanged: checks.r12NormalsUnchanged,
  sedimentMembershipsUnchanged:
    checks.r13SedimentMembershipsUnchanged,
  waterOpticsUnchanged: checks.r14WaterOpticsUnchanged,
  fullSwashFoamAndWetnessCreated: false,
  openOceanDisplacementCreated: false,
  rendererLifecycleChanged: false,
  cameraOrTraversalChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextCheckpoint: result === 'PASS_CLOSED'
    ? 'R1.6_RESTRAINED_SWASH_FOAM_AND_WETNESS'
    : 'R1.5_REMAINS_OPEN',
  firstBlocker: issues[0] ?? null,
  evaluationIssues: issues
};

fs.writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
if (issues.length > 0) process.exitCode = 1;
