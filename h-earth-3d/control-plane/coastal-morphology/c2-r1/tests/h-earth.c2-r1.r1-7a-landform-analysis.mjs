import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_LANDFORM_ANALYSIS,
  sampleHEarthC2R1LandformAnalysis
} from '../h-earth.c2-r1.landform-analysis.js';

const STARTING_HEAD = '59d84592039fae226b17ae2b1c6610144059cb61';
const ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-7a-start-001';
const EXPECTED_CHANGED_PATHS = Object.freeze([
  '.github/workflows/h-earth-c2-r1-r1-7a-landform-analysis.yml',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.landform-analysis.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.r1-7a-landform-analysis.mjs'
]);
const UPSTREAM_PATHS = Object.freeze([
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js'
]);

const OUT = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence'
);
const CAPTURE_OUT = path.join(OUT, 'r1-7a-engineering-captures');
const RECEIPT = path.join(OUT, 'h-earth.c2-r1.r1-7a-verification.json');
fs.mkdirSync(CAPTURE_OUT, { recursive: true });

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const finite = Number.isFinite;
const mean = values => values.length === 0
  ? 0
  : values.reduce((sum, value) => sum + value, 0) / values.length;
const range = values => values.length === 0
  ? 0
  : Math.max(...values) - Math.min(...values);
const blob = repositoryPath => execFileSync(
  'git',
  ['hash-object', repositoryPath],
  { encoding: 'utf8' }
).trim();
const unchangedFromStartingHead = repositoryPath =>
  spawnSync(
    'git',
    ['diff', '--quiet', STARTING_HEAD, 'HEAD', '--', repositoryPath]
  ).status === 0;

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
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    waterwardNormal
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.shoreline.x -
      frame.waterwardNormal.x * signedInlandDistance,
    z: frame.shoreline.z -
      frame.waterwardNormal.z * signedInlandDistance
  };
}

function at(anchorX, signedInlandDistance) {
  const world = worldAt(anchorX, signedInlandDistance);
  return sampleHEarthC2R1LandformAnalysis(world.x, world.z);
}

function rgbCss(channels) {
  return `rgb(${channels.map(channel =>
    Math.round(255 * clamp(channel, 0, 1))).join(',')})`;
}

function renderCapture(fileName, title, colorForSample) {
  const anchors = Array.from({ length: 41 }, (_, index) => -160 + index * 8);
  const distances = Array.from({ length: 53 }, (_, index) => -96 + index * 4);
  let body = '';
  for (let row = 0; row < distances.length; row += 1) {
    for (let column = 0; column < anchors.length; column += 1) {
      const sample = at(anchors[column], distances[row]);
      const color = sample.valid === true
        ? colorForSample(sample)
        : [0.08, 0.08, 0.08];
      body += `<rect x="${44 + column * 27}" y="${50 + row * 9.6}" width="28" height="10" fill="${rgbCss(color)}"/>`;
    }
  }
  body += '<text x="44" y="585" font-family="sans-serif" font-size="12" fill="#d7dde4">bounded analysis corridor; x -160→160; waterward -96→inland 112</text>';
  fs.writeFileSync(
    path.join(CAPTURE_OUT, fileName),
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="610" viewBox="0 0 1200 610">` +
    '<rect width="100%" height="100%" fill="#111820"/>' +
    `<text x="24" y="31" font-family="sans-serif" font-size="18" fill="#e8edf2">${title}</text>` +
    body +
    '</svg>\n'
  );
}

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
const sourceText = fs.readFileSync(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.landform-analysis.js',
  'utf8'
);

const anchors = Array.from({ length: 17 }, (_, index) => -160 + index * 20);
const distances = Array.from({ length: 53 }, (_, index) => -96 + index * 4);
const samples = [];
const issues = [];
let maximumCrossShoreChannelDelta = 0;
let maximumAlongshoreChannelDelta = 0;
let previousTransect = null;
const channelNames = [
  'elevationNormalized',
  'slopeNormalized',
  'concavity',
  'convexity',
  'drainageTendency',
  'coastalMoistureInfluence',
  'inlandTransition',
  'cavityAOHint',
  'macroNormalStrengthHint'
];

for (const anchorX of anchors) {
  const transect = [];
  for (const distance of distances) {
    const sample = at(anchorX, distance);
    transect.push({ distance, sample });
    samples.push({ anchorX, distance, sample });
    if (sample.valid !== true) {
      issues.push(`INVALID_SAMPLE:${anchorX}:${distance}`);
      continue;
    }
    for (const channelName of channelNames) {
      const value = sample.channels[channelName];
      if (!finite(value) || value < 0 || value > 1) {
        issues.push(`INVALID_CHANNEL:${channelName}:${anchorX}:${distance}`);
      }
    }
    if (!finite(sample.curvature.laplacian) ||
        !finite(sample.curvature.magnitude)) {
      issues.push(`INVALID_CURVATURE:${anchorX}:${distance}`);
    }
  }

  for (let index = 1; index < transect.length; index += 1) {
    const left = transect[index - 1].sample;
    const right = transect[index].sample;
    if (left.valid !== true || right.valid !== true) continue;
    for (const channelName of channelNames) {
      maximumCrossShoreChannelDelta = Math.max(
        maximumCrossShoreChannelDelta,
        Math.abs(left.channels[channelName] - right.channels[channelName])
      );
    }
  }

  if (previousTransect) {
    for (let index = 0; index < transect.length; index += 1) {
      const left = previousTransect[index].sample;
      const right = transect[index].sample;
      if (left.valid !== true || right.valid !== true) continue;
      for (const channelName of channelNames) {
        maximumAlongshoreChannelDelta = Math.max(
          maximumAlongshoreChannelDelta,
          Math.abs(left.channels[channelName] - right.channels[channelName])
        );
      }
    }
  }
  previousTransect = transect;
}

const validSamples = samples.filter(entry => entry.sample.valid === true);
const valuesByChannel = Object.fromEntries(channelNames.map(channelName => [
  channelName,
  validSamples.map(entry => entry.sample.channels[channelName])
]));
const nearCoastMoisture = validSamples
  .filter(entry => entry.distance >= -12 && entry.distance <= 34)
  .map(entry => entry.sample.channels.coastalMoistureInfluence);
const deepInlandMoisture = validSamples
  .filter(entry => entry.distance >= 84)
  .map(entry => entry.sample.channels.coastalMoistureInfluence);
const nearCoastTransition = validSamples
  .filter(entry => entry.distance >= 0 && entry.distance <= 20)
  .map(entry => entry.sample.channels.inlandTransition);
const deepInlandTransition = validSamples
  .filter(entry => entry.distance >= 88)
  .map(entry => entry.sample.channels.inlandTransition);

const checks = {
  startingHeadExact: spawnSync(
    'git',
    ['merge-base', '--is-ancestor', STARTING_HEAD, 'HEAD']
  ).status === 0,
  pathBoundaryMaintained:
    JSON.stringify(changedPaths) ===
      JSON.stringify([...EXPECTED_CHANGED_PATHS].sort()),
  upstreamAuthoritiesUnchanged:
    UPSTREAM_PATHS.every(unchangedFromStartingHead),
  sourceContractsPresent:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.sourceProfileContractId != null &&
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.sourceSurfaceFrameContractId != null &&
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.sourceSedimentContractId != null,
  allSamplesValid: validSamples.length === samples.length,
  allChannelsFiniteAndBounded: issues.length === 0,
  elevationVariationPresent:
    range(valuesByChannel.elevationNormalized) > 0.2,
  slopeVariationPresent:
    range(valuesByChannel.slopeNormalized) > 0.08,
  concavityVariationPresent:
    range(valuesByChannel.concavity) > 0.08,
  convexityVariationPresent:
    range(valuesByChannel.convexity) > 0.08,
  drainageVariationPresent:
    range(valuesByChannel.drainageTendency) > 0.05,
  moistureVariationPresent:
    range(valuesByChannel.coastalMoistureInfluence) > 0.25,
  coastalMoistureCorrespondence:
    mean(nearCoastMoisture) > mean(deepInlandMoisture) + 0.12,
  inlandTransitionCorrespondence:
    mean(deepInlandTransition) > mean(nearCoastTransition) + 0.55,
  cavityVariationPresent:
    range(valuesByChannel.cavityAOHint) > 0.05,
  macroNormalHintVariationPresent:
    range(valuesByChannel.macroNormalStrengthHint) > 0.08,
  crossShoreContinuity:
    maximumCrossShoreChannelDelta <= 0.62,
  alongshoreContinuity:
    maximumAlongshoreChannelDelta <= 0.52,
  periodicNoiseAbsent:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.derivationLaw.periodicNoiseUsed === false &&
    !sourceText.includes('Math.sin') &&
    !sourceText.includes('Math.cos'),
  randomNoiseAbsent:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.derivationLaw.randomNoiseUsed === false &&
    !sourceText.includes('Math.random'),
  textureTilingAbsent:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.derivationLaw.textureTilingUsed === false,
  bakedTextureNotCreated:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.derivationLaw.wholeWorldBakeCreated === false,
  rendererSamplingNotCreated:
    H_EARTH_C2_R1_LANDFORM_ANALYSIS.ownership.ownsRuntimeMaterialSampling === false,
  productDefaultUnchanged:
    validSamples.every(entry => entry.sample.productDefaultMutated === false),
  publicRouteUnchanged:
    validSamples.every(entry => entry.sample.publicRouteMutated === false),
  visualSuccessNotClaimed:
    validSamples.every(entry =>
      entry.sample.visualSuccessorStatus === 'NOT_ESTABLISHED' &&
      entry.sample.userDifferentialReady === false)
};

for (const [name, passed] of Object.entries(checks)) {
  if (!passed) issues.push(`CHECK_FAILED:${name}`);
}

renderCapture(
  'h-earth.c2-r1.r1-7a-elevation-slope.svg',
  'R1.7A elevation / slope analysis — engineering only',
  sample => [
    sample.channels.elevationNormalized,
    sample.channels.slopeNormalized,
    0.18
  ]
);
renderCapture(
  'h-earth.c2-r1.r1-7a-curvature-drainage.svg',
  'R1.7A curvature / drainage analysis — engineering only',
  sample => [
    sample.channels.convexity,
    sample.channels.drainageTendency,
    sample.channels.concavity
  ]
);
renderCapture(
  'h-earth.c2-r1.r1-7a-moisture-transition.svg',
  'R1.7A coastal moisture / inland transition — engineering only',
  sample => [
    sample.channels.inlandTransition * 0.65,
    sample.channels.coastalMoistureInfluence,
    0.18 + sample.channels.cavityAOHint * 0.55
  ]
);

const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_7A_LANDFORM_ANALYSIS_VERIFICATION_v1',
  operation: 'R1.7A_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT',
  result: issues.length === 0 ? 'PASS_ENGINEERING' : 'FAIL',
  startingHead: STARTING_HEAD,
  executionHead,
  rollbackBranch: ROLLBACK_BRANCH,
  changedPaths,
  checks,
  metrics: {
    sampleCount: samples.length,
    validSampleCount: validSamples.length,
    transectCount: anchors.length,
    channelCount: channelNames.length,
    channelRanges: Object.fromEntries(channelNames.map(channelName => [
      channelName,
      range(valuesByChannel[channelName])
    ])),
    maximumCrossShoreChannelDelta,
    maximumAlongshoreChannelDelta,
    meanNearCoastMoisture: mean(nearCoastMoisture),
    meanDeepInlandMoisture: mean(deepInlandMoisture),
    meanNearCoastTransition: mean(nearCoastTransition),
    meanDeepInlandTransition: mean(deepInlandTransition),
    upstreamBlobs: Object.fromEntries(UPSTREAM_PATHS.map(repositoryPath => [
      repositoryPath,
      blob(repositoryPath)
    ]))
  },
  macroFieldContractPresent: true,
  bakedMacroControlFieldCreated: false,
  rendererSamplingIntegrationCreated: false,
  terrainGeometryMutated: false,
  upstreamAuthoritiesUnchanged: checks.upstreamAuthoritiesUnchanged,
  representativeEngineeringCaptureCount: 3,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextAuthorizedSubcheckpoint:
    issues.length === 0
      ? 'R1.7A_DURABLE_CLOSURE'
      : 'NONE_STOP_ON_FIRST_BLOCKER',
  firstBlocker: issues[0] ?? null,
  evaluationIssues: issues
};

fs.writeFileSync(RECEIPT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (issues.length > 0) process.exitCode = 1;
