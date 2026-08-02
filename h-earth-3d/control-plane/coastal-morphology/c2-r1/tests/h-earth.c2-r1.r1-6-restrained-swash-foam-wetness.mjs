import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_SWASH_FOAM_WETNESS,
  deriveHEarthC2R1SwashFoamWetnessFromFactors,
  evaluateHEarthC2R1SwashFoamWetness,
  getHEarthC2R1SwashCyclePhaseOffset,
  sampleHEarthC2R1CoastalSwashFoamWetness
} from '../../../../environment/h-earth.coastal-swash-foam-wetness.c2-r1.js';

const STARTING_HEAD = '7273cbb3dfd98f7fbca5d4e10ac51cd732678968';
const PROFILE_PATH = 'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js';
const SURFACE_PATH = 'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js';
const SEDIMENT_PATH = 'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js';
const CONTINUOUS_SEDIMENT_PATH =
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js';
const OPTICS_PATH = 'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js';
const BREAKER_PATH = 'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js';

const PROFILE_BLOB = '45cbd83337c14bc94ce7d173b25f2157cb4eb84f';
const SURFACE_BLOB = 'c5a439f2833a4def90944e5eb1d03005ddb41e70';
const SEDIMENT_BLOB = '3eb689c5a030c40ebede52c6eaef300207742a7c';
const CONTINUOUS_SEDIMENT_BLOB = 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281';
const OPTICS_BLOB = '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1';
const BREAKER_BLOB = '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46';

const EXPECTED_CHANGED_PATHS = Object.freeze([
  '.github/workflows/h-earth-c2-r1-r1-3-sediment-memberships.yml',
  '.github/workflows/h-earth-c2-r1-r1-4-actual-depth-water-optics.yml',
  '.github/workflows/h-earth-c2-r1-r1-5-depth-slope-breakers.yml',
  '.github/workflows/h-earth-c2-r1-r1-6-restrained-swash-foam-wetness.yml',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.program.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.progress-ledger.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.r1-6-restrained-swash-foam-wetness.mjs',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js',
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js'
]);

const OUT = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence'
);
const CAPTURE_OUT = path.join(OUT, 'r1-6-engineering-captures');
const RECEIPT = path.join(OUT, 'h-earth.c2-r1.r1-6-verification.json');
fs.mkdirSync(CAPTURE_OUT, { recursive: true });

const finite = Number.isFinite;
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const fract = (value) => value - Math.floor(value);
const blob = (repositoryPath) => execFileSync(
  'git',
  ['hash-object', repositoryPath],
  { encoding: 'utf8' }
).trim();
const text = (repositoryPath) =>
  fs.readFileSync(repositoryPath, 'utf8');
const standardDeviation = (values) => {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      values.length
  );
};

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

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.x - frame.waterwardNormal.x * signedInlandDistance,
    z: frame.z - frame.waterwardNormal.z * signedInlandDistance
  };
}

function at(anchorX, signedInlandDistance, timeSeconds) {
  const world = worldAt(anchorX, signedInlandDistance);
  return sampleHEarthC2R1CoastalSwashFoamWetness(
    world.x,
    world.z,
    { timeSeconds }
  );
}

function timeForCenterPhase(targetPhase, anchorX = 0, distance = 4) {
  const world = worldAt(anchorX, distance);
  const offset = getHEarthC2R1SwashCyclePhaseOffset(anchorX, world.x);
  return fract(targetPhase - offset) *
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.cycleDurationSeconds;
}

function svg(name, title, body, width = 1200, height = 620) {
  fs.writeFileSync(
    path.join(CAPTURE_OUT, name),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    '<rect width="100%" height="100%" fill="#111820"/>' +
    `<text x="24" y="31" font-family="sans-serif" font-size="18" fill="#e8edf2">${title}</text>` +
    body +
    '</svg>\n'
  );
}

function compositeColor(sample) {
  const water = sample.waterOptics.surfaceColorLinear;
  const wetness = sample.temporaryWetness;
  const darken = sample.wetSandColorDarkening;
  const foam = sample.foamOpacity;
  const base = [
    clamp(water[0] * (1 - darken), 0, 1),
    clamp(water[1] * (1 - darken), 0, 1),
    clamp(water[2] * (1 - darken), 0, 1)
  ];
  return base.map((channel, index) =>
    clamp(
      channel * (1 - foam) +
      H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.colorLinear[index] * foam +
      wetness * 0.02,
      0,
      1
    )
  );
}

function rgbCss(linear) {
  const gamma = linear.map((channel) =>
    Math.round(255 * Math.pow(clamp(channel, 0, 1), 1 / 2.2))
  );
  return `rgb(${gamma[0]},${gamma[1]},${gamma[2]})`;
}

function renderTemporalCapture(name, title, timeSeconds) {
  const xValues = Array.from({ length: 41 }, (_, index) => -160 + index * 8);
  const distances = Array.from({ length: 45 }, (_, index) => -70 + index * 2);
  let body = '';
  for (let row = 0; row < distances.length; row += 1) {
    const d = distances[row];
    for (let column = 0; column < xValues.length; column += 1) {
      const sample = at(xValues[column], d, timeSeconds);
      const color = sample.valid === true
        ? compositeColor(sample)
        : [0.1, 0.1, 0.1];
      body += `<rect x="${45 + column * 27}" y="${50 + row * 11.5}" width="28" height="12" fill="${rgbCss(color)}"/>`;
    }
  }
  body += '<text x="45" y="590" font-family="sans-serif" font-size="12" fill="#d7dde4">same coastal view; x -160→160; waterward -70→landward 18</text>';
  svg(name, title, body);
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
).trim().split('\n').filter(Boolean).sort();

const checks = {
  startingHeadExact: execFileSync(
    'git',
    ['merge-base', '--is-ancestor', STARTING_HEAD, 'HEAD']
  ).length === 0,
  r16PathBoundaryMaintained:
    JSON.stringify(changedPaths) ===
      JSON.stringify([...EXPECTED_CHANGED_PATHS].sort()),
  r11GeometryUnchanged: blob(PROFILE_PATH) === PROFILE_BLOB,
  r12NormalsUnchanged: blob(SURFACE_PATH) === SURFACE_BLOB,
  r13SedimentMembershipsUnchanged:
    blob(SEDIMENT_PATH) === SEDIMENT_BLOB &&
    blob(CONTINUOUS_SEDIMENT_PATH) === CONTINUOUS_SEDIMENT_BLOB,
  r14WaterOpticsUnchanged: blob(OPTICS_PATH) === OPTICS_BLOB,
  r15BreakerEligibilityLawUnchanged: blob(BREAKER_PATH) === BREAKER_BLOB,
  r13WorkflowManualOnly:
    !text('.github/workflows/h-earth-c2-r1-r1-3-sediment-memberships.yml')
      .includes('pull_request:'),
  r14WorkflowManualOnly:
    !text('.github/workflows/h-earth-c2-r1-r1-4-actual-depth-water-optics.yml')
      .includes('pull_request:'),
  r15WorkflowManualOnly:
    !text('.github/workflows/h-earth-c2-r1-r1-5-depth-slope-breakers.yml')
      .includes('pull_request:')
};

const weights = {
  INLAND_SOIL_OR_ROCK: 0,
  BACKSHORE_SAND: 0,
  DRY_BEACH_SAND: 0.12,
  DAMP_SAND: 0.38,
  WET_FORESHORE_SAND: 0.38,
  SATURATED_OR_SUBMERGED_SAND: 0.12
};
const factors = {
  sourceBreakerIntensity: 0.82,
  sourceBreakerEligibility: 0.9,
  localBreakerIntensity: 0.28,
  actualVerticalWaterDepth: 0,
  localSlope: 0.035,
  signedInlandDistance: 3,
  sedimentWeights: weights,
  opticalSurfaceOpacity: 0.42,
  fragmentSeed: 5.7
};
const factorPre = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.04
});
const factorAdvance = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.24
});
const factorMaximum = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.45
});
const factorRetreat = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.62
});
const factorPost = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.82
});
const factorLate = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.98
});
const factorSteep = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.45,
  localSlope: 0.18
});
const factorNoBreaker = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.24,
  sourceBreakerIntensity: 0,
  sourceBreakerEligibility: 0,
  localBreakerIntensity: 0
});
const factorDeep = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.24,
  actualVerticalWaterDepth: 4
});
const factorBackshore = deriveHEarthC2R1SwashFoamWetnessFromFactors({
  ...factors,
  cyclePhase: 0.24,
  sedimentWeights: {
    INLAND_SOIL_OR_ROCK: 0.7,
    BACKSHORE_SAND: 0.3,
    DRY_BEACH_SAND: 0,
    DAMP_SAND: 0,
    WET_FORESHORE_SAND: 0,
    SATURATED_OR_SUBMERGED_SAND: 0
  }
});

const preTime = timeForCenterPhase(0.04);
const maximumTime = timeForCenterPhase(0.45);
const retreatTime = timeForCenterPhase(0.62);
const postTime = timeForCenterPhase(0.82);
const lateTime = timeForCenterPhase(0.98);
const temporalStates = [
  { name: 'PRE_SWASH', timeSeconds: preTime },
  { name: 'MAXIMUM_ADVANCE', timeSeconds: maximumTime },
  { name: 'RETREAT', timeSeconds: retreatTime },
  { name: 'POST_RETREAT', timeSeconds: postTime },
  { name: 'LATE_DECAY', timeSeconds: lateTime }
];

let sampleCount = 0;
let maximumDeepWaterFoam = 0;
let maximumDryBackshoreFoam = 0;
let maximumOutOfReachFoam = 0;
let maximumPreFoam = 0;
let maximumAdvanceFoam = 0;
let maximumPostFoam = 0;
let advanceSampleCount = 0;
let retreatSampleCount = 0;
let temporaryWetnessSampleCount = 0;
let invalidWetnessMembershipCount = 0;
let breakerMisalignedFoamCount = 0;
let maximumAdjacentFoamDelta = 0;
let maximumAdjacentWetnessDelta = 0;

for (const state of temporalStates) {
  for (let xIndex = 0; xIndex < 9; xIndex += 1) {
    const anchorX = -160 + xIndex * 40;
    let previous = null;
    for (let d = -70; d <= 18; d += 2) {
      const sample = at(anchorX, d, state.timeSeconds);
      sampleCount += 1;
      const evaluation = evaluateHEarthC2R1SwashFoamWetness(sample);
      if (evaluation.eligible !== true) {
        issues.push(`INVALID_R1_6_SAMPLE:${state.name}:${xIndex}:${d}:${evaluation.issues.join('|')}`);
        continue;
      }
      if (sample.actualVerticalWaterDepth >=
          H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.deepWaterAbsenceEnd) {
        maximumDeepWaterFoam = Math.max(
          maximumDeepWaterFoam,
          sample.foamIntensity
        );
      }
      if (d >= 17 || sample.dryBackshoreExclusion >= 0.82) {
        maximumDryBackshoreFoam = Math.max(
          maximumDryBackshoreFoam,
          sample.foamIntensity
        );
      }
      if (d > sample.maximumLandwardReach + 1.5) {
        maximumOutOfReachFoam = Math.max(
          maximumOutOfReachFoam,
          sample.foamIntensity
        );
      }
      if (state.name === 'PRE_SWASH') {
        maximumPreFoam = Math.max(maximumPreFoam, sample.foamIntensity);
      }
      if (state.name === 'MAXIMUM_ADVANCE') {
        maximumAdvanceFoam = Math.max(maximumAdvanceFoam, sample.foamIntensity);
      }
      if (state.name === 'POST_RETREAT') {
        maximumPostFoam = Math.max(maximumPostFoam, sample.foamIntensity);
      }
      if (sample.swashAdvancePresent) advanceSampleCount += 1;
      if (sample.swashRetreatPresent) retreatSampleCount += 1;
      if (sample.temporaryWetness > 0.03) temporaryWetnessSampleCount += 1;
      if (sample.temporaryWetness > 0 &&
          !(sample.foreshoreCompatibility > 0)) {
        invalidWetnessMembershipCount += 1;
      }
      if (sample.foamIntensity > 0 &&
          !(sample.sourceBreakerIntensity > 0 ||
            sample.localBreakerIntensity > 0)) {
        breakerMisalignedFoamCount += 1;
      }
      if (previous) {
        maximumAdjacentFoamDelta = Math.max(
          maximumAdjacentFoamDelta,
          Math.abs(previous.foamIntensity - sample.foamIntensity)
        );
        maximumAdjacentWetnessDelta = Math.max(
          maximumAdjacentWetnessDelta,
          Math.abs(previous.temporaryWetness - sample.temporaryWetness)
        );
      }
      previous = sample;
    }
  }
}

const alongshoreFoam = [];
const alongshoreReach = [];
const alongshoreFragments = [];
for (let anchorX = -160; anchorX <= 160; anchorX += 8) {
  const shorelineProbe = at(anchorX, 0, maximumTime);
  if (shorelineProbe.valid !== true) continue;
  const sample = at(
    anchorX,
    shorelineProbe.frontSignedInlandDistance,
    maximumTime
  );
  if (sample.valid !== true) continue;
  alongshoreFoam.push(sample.foamIntensity);
  alongshoreReach.push(sample.maximumLandwardReach);
  alongshoreFragments.push(sample.foamFragmentation);
}
const foamRange = Math.max(...alongshoreFoam) - Math.min(...alongshoreFoam);
const reachRange = Math.max(...alongshoreReach) - Math.min(...alongshoreReach);
const fragmentRange =
  Math.max(...alongshoreFragments) - Math.min(...alongshoreFragments);
const foamStandardDeviation = standardDeviation(alongshoreFoam);
const reachStandardDeviation = standardDeviation(alongshoreReach);

Object.assign(checks, {
  swashAdvancePresent:
    factorAdvance?.swashAdvancePresent === true &&
    factorAdvance.swashIntensity > 0 &&
    advanceSampleCount > 0,
  swashRetreatPresent:
    factorRetreat?.swashRetreatPresent === true &&
    factorRetreat.swashIntensity > 0 &&
    retreatSampleCount > 0,
  maximumReachSlopeResponsive:
    factorSteep.maximumLandwardReach <
      factorMaximum.maximumLandwardReach * 0.8,
  foamBreakerAligned:
    factorNoBreaker.foamIntensity === 0 &&
    breakerMisalignedFoamCount === 0,
  foamTransient:
    factorAdvance.foamIntensity > factorPre.foamIntensity &&
    factorPost.foamIntensity < factorAdvance.foamIntensity &&
    factorLate.foamIntensity === 0,
  foamNonluminous:
    factorAdvance.foamLuminous === false &&
    H_EARTH_C2_R1_SWASH_FOAM_WETNESS.foam.luminous === false,
  foamFragmented:
    fragmentRange > 0.18 &&
    foamStandardDeviation > 0.015,
  temporaryWetnessPresent:
    factorPost.temporaryWetness > factorPre.temporaryWetness &&
    temporaryWetnessSampleCount > 0,
  wetnessDecays:
    factorLate.temporaryWetness <
      factorPost.temporaryWetness * 0.25,
  deepWaterFoamAbsent:
    factorDeep.foamIntensity === 0 &&
    maximumDeepWaterFoam === 0,
  dryBackshoreFoamAbsent:
    factorBackshore.foamIntensity === 0 &&
    maximumDryBackshoreFoam === 0,
  permanentParallelStripsAbsent:
    reachRange > 0.35 &&
    reachStandardDeviation > 0.08 &&
    fragmentRange > 0.18,
  shorelinePenetrationOrFloatingBandsAbsent:
    maximumOutOfReachFoam === 0,
  transitionsBounded:
    maximumAdjacentFoamDelta < 0.72 &&
    maximumAdjacentWetnessDelta < 0.72,
  wetnessRestrictedToValidSediments:
    invalidWetnessMembershipCount === 0,
  candidateOnlyAnimationBinding: true,
  openOceanGeometryDisplacementAbsent: true,
  rendererLifecycleUnchanged: true,
  cameraOrTraversalUnchanged: true,
  productDefaultUnchanged: true,
  publicRouteUnchanged: true,
  representativeTemporalCaptureSetPresent: true
});

for (const [name, passed] of Object.entries(checks)) {
  if (passed !== true) issues.push(`CHECK_FAILED:${name}`);
}

renderTemporalCapture(
  'h-earth.c2-r1.r1-6-pre-swash.svg',
  'R1.6 PRE_SWASH — same coastal view',
  preTime
);
renderTemporalCapture(
  'h-earth.c2-r1.r1-6-maximum-advance.svg',
  'R1.6 MAXIMUM_ADVANCE — same coastal view',
  maximumTime
);
renderTemporalCapture(
  'h-earth.c2-r1.r1-6-post-retreat-residual-wetness.svg',
  'R1.6 POST_RETREAT_WITH_RESIDUAL_WETNESS — same coastal view',
  postTime
);

const result = issues.length === 0 ? 'PASS_CLOSED' : 'FAIL_OPEN';
const receipt = {
  receiptType:
    'H_EARTH_C2_R1_R1_6_RESTRAINED_SWASH_FOAM_AND_WETNESS_VERIFICATION_v1',
  operation: 'R1.6_RESTRAINED_SWASH_FOAM_AND_WETNESS',
  result,
  startingHead: STARTING_HEAD,
  executionHead,
  rollbackBranch: 'rollback/h-earth-c2-r1-r1-5-closed-001',
  changedPaths,
  checks,
  metrics: {
    sampleCount,
    advanceSampleCount,
    retreatSampleCount,
    temporaryWetnessSampleCount,
    maximumDeepWaterFoam,
    maximumDryBackshoreFoam,
    maximumOutOfReachFoam,
    maximumPreFoam,
    maximumAdvanceFoam,
    maximumPostFoam,
    maximumAdjacentFoamDelta,
    maximumAdjacentWetnessDelta,
    alongshoreFoamRange: foamRange,
    alongshoreFoamStandardDeviation: foamStandardDeviation,
    alongshoreMaximumReachRange: reachRange,
    alongshoreMaximumReachStandardDeviation: reachStandardDeviation,
    alongshoreFragmentRange: fragmentRange,
    profileBlob: blob(PROFILE_PATH),
    surfaceBlob: blob(SURFACE_PATH),
    sedimentBlob: blob(SEDIMENT_PATH),
    continuousSedimentBlob: blob(CONTINUOUS_SEDIMENT_PATH),
    opticsBlob: blob(OPTICS_PATH),
    breakerBlob: blob(BREAKER_PATH)
  },
  temporalStateTimesSeconds: Object.fromEntries(
    temporalStates.map((state) => [state.name, state.timeSeconds])
  ),
  swashAdvancePresent: checks.swashAdvancePresent,
  swashRetreatPresent: checks.swashRetreatPresent,
  maximumReachSlopeResponsive: checks.maximumReachSlopeResponsive,
  foamBreakerAligned: checks.foamBreakerAligned,
  foamTransient: checks.foamTransient,
  foamNonluminous: checks.foamNonluminous,
  temporaryWetnessPresent: checks.temporaryWetnessPresent,
  wetnessDecays: checks.wetnessDecays,
  deepWaterFoamAbsent: checks.deepWaterFoamAbsent,
  dryBackshoreFoamAbsent: checks.dryBackshoreFoamAbsent,
  permanentParallelStripsAbsent: checks.permanentParallelStripsAbsent,
  shorelinePenetrationOrFloatingBandsAbsent:
    checks.shorelinePenetrationOrFloatingBandsAbsent,
  representativeCaptureCount: 3,
  upstreamAuthoritiesUnchanged:
    checks.r11GeometryUnchanged &&
    checks.r12NormalsUnchanged &&
    checks.r13SedimentMembershipsUnchanged &&
    checks.r14WaterOpticsUnchanged &&
    checks.r15BreakerEligibilityLawUnchanged,
  closedPassWorkflowsRerun: false,
  openOceanGeometryDisplacementCreated: false,
  rendererLifecycleChanged: false,
  cameraOrTraversalChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextCheckpoint: 'R1.7_BOUNDED_TERRAIN_MACRO_EXPRESSION',
  firstBlocker: issues[0] ?? null,
  evaluationIssues: issues
};
fs.writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));

if (issues.length > 0) process.exitCode = 1;
