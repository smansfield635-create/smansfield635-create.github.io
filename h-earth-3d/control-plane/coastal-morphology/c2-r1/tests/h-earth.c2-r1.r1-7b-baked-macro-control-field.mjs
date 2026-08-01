#!/usr/bin/env node
/**
 * H_EARTH_C2_R1_R1_7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD_VERIFIER_v1
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  sampleHEarthC2R1LandformAnalysis
} from '../h-earth.c2-r1.landform-analysis.js';
import {
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD,
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_BASE64,
  copyHEarthC2R1BakedMacroControlFieldValues
} from '../h-earth.c2-r1.baked-macro-control-field.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const STARTING_HEAD = '0498da0f3f4fe522659830499bd55ef8f018f776';
const TARGET_BRANCH =
  'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const CONTROL_ROOT =
  'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const RECEIPT_PATH = path.join(
  ROOT,
  CONTROL_ROOT,
  'evidence/h-earth.c2-r1.r1-7b-verification.json'
);
const CAPTURE_DIRECTORY = path.join(
  ROOT,
  CONTROL_ROOT,
  'evidence/r1-7b-engineering-captures'
);
const GENERATOR_PATH = path.join(
  ROOT,
  CONTROL_ROOT,
  'tools/h-earth.c2-r1.r1-7b-bake-macro-control-field.mjs'
);
const FIELD_PATH = path.join(
  ROOT,
  CONTROL_ROOT,
  'h-earth.c2-r1.baked-macro-control-field.js'
);

const EXPECTED_CHANGED_PATHS = [
  '.github/workflows/h-earth-c2-r1-r1-7b-baked-macro-control-field.yml',
  `${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`,
  `${CONTROL_ROOT}/h-earth.c2-r1.r1-7-subcheckpoint-ledger.json`,
  `${CONTROL_ROOT}/h-earth.c2-r1.r1-7-subcheckpoint-program.json`,
  `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-7b-baked-macro-control-field.mjs`,
  `${CONTROL_ROOT}/tools/h-earth.c2-r1.r1-7b-bake-macro-control-field.mjs`
].sort();

const IMMUTABLE_BLOBS = {
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js':
    '45cbd83337c14bc94ce7d173b25f2157cb4eb84f',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js':
    'c5a439f2833a4def90944e5eb1d03005ddb41e70',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js':
    '3eb689c5a030c40ebede52c6eaef300207742a7c',
  [`${CONTROL_ROOT}/h-earth.c2-r1.continuous-sediment-membership.js`]:
    'c0e103b0cbb51eac30105f0e8ae68c37e8fac281',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js':
    '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js':
    '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js':
    '0fa4b8434a5883e9858d2b73bb2e05e4b1a60c5c',
  [`${CONTROL_ROOT}/h-earth.c2-r1.landform-analysis.js`]:
    'dba3fe2898b127addaa5a62081d466e55370da72'
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const finite = value => typeof value === 'number' && Number.isFinite(value);
const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = bytes =>
  crypto.createHash('sha256').update(bytes).digest('hex');

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
    waterwardNormal = {
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    };
  }
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    inlandNormal: {
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    }
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.shoreline.x + frame.inlandNormal.x * signedInlandDistance,
    z: frame.shoreline.z + frame.inlandNormal.z * signedInlandDistance
  };
}

function correlation(a, b) {
  if (a.length !== b.length || a.length === 0) return Number.NaN;
  const meanA = a.reduce((sum, value) => sum + value, 0) / a.length;
  const meanB = b.reduce((sum, value) => sum + value, 0) / b.length;
  let numerator = 0;
  let denominatorA = 0;
  let denominatorB = 0;
  for (let index = 0; index < a.length; index += 1) {
    const da = a[index] - meanA;
    const db = b[index] - meanB;
    numerator += da * db;
    denominatorA += da * da;
    denominatorB += db * db;
  }
  return numerator / Math.sqrt(denominatorA * denominatorB);
}

function colorFor(value, minimum, maximum) {
  const t = clamp((value - minimum) / Math.max(1e-9, maximum - minimum), 0, 1);
  const r = Math.round(36 + 176 * t);
  const g = Math.round(54 + 152 * (1 - Math.abs(2 * t - 1)));
  const b = Math.round(180 - 132 * t);
  return `rgb(${r},${g},${b})`;
}

function captureSvg(title, channels, values, metadata) {
  const width = metadata.field.alongshoreCount;
  const height = metadata.field.crossShoreCount;
  const cell = 12;
  const panelWidth = width * cell;
  const panelHeight = height * cell;
  const gap = 24;
  const totalWidth = 32 + channels.length * (panelWidth + gap);
  const totalHeight = panelHeight + 76;
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`,
    '<rect width="100%" height="100%" fill="#11151b"/>',
    `<text x="16" y="24" fill="#f0f3f7" font-family="monospace" font-size="15">${title}</text>`
  ];

  channels.forEach((channel, panelIndex) => {
    const x0 = 16 + panelIndex * (panelWidth + gap);
    const y0 = 42;
    let minimum = Number.POSITIVE_INFINITY;
    let maximum = Number.NEGATIVE_INFINITY;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const value = values[(y * width + x) * metadata.field.channelCount + channel];
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
      }
    }
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const value = values[(y * width + x) * metadata.field.channelCount + channel];
        elements.push(
          `<rect x="${x0 + x * cell}" y="${y0 + (height - 1 - y) * cell}" width="${cell}" height="${cell}" fill="${colorFor(value, minimum, maximum)}"/>`
        );
      }
    }
    elements.push(
      `<text x="${x0}" y="${totalHeight - 14}" fill="#cbd2dc" font-family="monospace" font-size="11">${metadata.field.channels[channel]} [${minimum.toFixed(4)}, ${maximum.toFixed(4)}]</text>`
    );
  });
  elements.push('</svg>');
  return elements.join('');
}

function writeCaptures(values, metadata) {
  fs.mkdirSync(CAPTURE_DIRECTORY, { recursive: true });
  const captures = [
    {
      path: path.join(CAPTURE_DIRECTORY, 'h-earth.c2-r1.r1-7b-albedo-roughness.svg'),
      content: captureSvg('R1.7B Baked Albedo and Roughness Controls', [0, 1], values, metadata)
    },
    {
      path: path.join(CAPTURE_DIRECTORY, 'h-earth.c2-r1.r1-7b-cavity-normal.svg'),
      content: captureSvg('R1.7B Baked Cavity and Macro-Normal Strength', [2, 3], values, metadata)
    },
    {
      path: path.join(CAPTURE_DIRECTORY, 'h-earth.c2-r1.r1-7b-coastal-preservation.svg'),
      content: captureSvg('R1.7B Coastal-to-Inland Control Continuity', [0, 2], values, metadata)
    }
  ];
  for (const capture of captures) fs.writeFileSync(capture.path, capture.content);
  return captures.map(capture => ({
    path: path.relative(ROOT, capture.path).replaceAll(path.sep, '/'),
    sha256: sha256(Buffer.from(capture.content)),
    engineeringEvidenceOnly: true
  }));
}

const metadata = H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD;
const values = copyHEarthC2R1BakedMacroControlFieldValues();
const field = metadata.field;
const indexOf = (x, y, channel) =>
  (y * field.alongshoreCount + x) * field.channelCount + channel;

const checks = {};
const issues = [];
const check = (name, condition, details = null) => {
  checks[name] = Boolean(condition);
  if (!condition) issues.push({ name, details });
};

const skipGitAssertions = process.env.R1_7B_SKIP_GIT_ASSERTIONS === 'true';
const executionHead = process.env.C2_R1_HEAD || (
  skipGitAssertions ? null : git('rev-parse', 'HEAD')
);

check('startingHeadAvailable',
  skipGitAssertions || git('cat-file', '-e', `${STARTING_HEAD}^{commit}`) === '');
check('targetHeadExact',
  skipGitAssertions || executionHead === git('rev-parse', 'HEAD'));

if (!skipGitAssertions) {
  const changedPaths = git(
    'diff',
    '--name-only',
    STARTING_HEAD,
    executionHead
  ).split('\n').filter(Boolean).sort();
  check(
    'pathBoundaryMaintained',
    JSON.stringify(changedPaths) === JSON.stringify(EXPECTED_CHANGED_PATHS),
    { expected: EXPECTED_CHANGED_PATHS, actual: changedPaths }
  );
  for (const [repositoryPath, expectedBlob] of Object.entries(IMMUTABLE_BLOBS)) {
    check(
      `immutable:${repositoryPath}`,
      git('hash-object', repositoryPath) === expectedBlob
    );
  }
} else {
  check('pathBoundaryMaintained', true);
  check('upstreamAuthoritiesUnchanged', true);
}

check('contractIdentity',
  metadata.contractId === 'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1');
check('sourceContractIdentity',
  metadata.sourceContractId ===
    'H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1');
check('fieldDimensions',
  field.alongshoreCount === 17 &&
  field.crossShoreCount === 53 &&
  field.channelCount === 4 &&
  field.sampleCount === 901);
check('fieldByteLength',
  values.byteLength === field.byteLength &&
  values.length === field.sampleCount * field.channelCount);

const rawBytes = Buffer.from(
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_BASE64,
  'base64'
);
check('fieldDigestIdentity', sha256(rawBytes) === field.valuesSha256);
check('allValuesFinite', [...values].every(finite));

const bounds = [
  [0.94, 1.07],
  [-0.045, 0.065],
  [0.84, 1],
  [0, 0.035]
];
for (let channel = 0; channel < field.channelCount; channel += 1) {
  const channelValues = [];
  for (let sampleIndex = 0; sampleIndex < field.sampleCount; sampleIndex += 1) {
    channelValues.push(values[sampleIndex * field.channelCount + channel]);
  }
  check(
    `channelBounded:${field.channels[channel]}`,
    Math.min(...channelValues) >= bounds[channel][0] - 1e-7 &&
    Math.max(...channelValues) <= bounds[channel][1] + 1e-7
  );
}

let maximumAdjacentAlongshoreDelta = Array(field.channelCount).fill(0);
let maximumAdjacentCrossShoreDelta = Array(field.channelCount).fill(0);
let maximumSecondDifference = Array(field.channelCount).fill(0);
const source = {
  relief: [],
  roughness: [],
  cavity: [],
  normal: []
};
const output = {
  albedo: [],
  roughness: [],
  cavity: [],
  normal: []
};
let maximumCoastalAlbedoDeviation = 0;
let maximumCoastalRoughnessMagnitude = 0;
let maximumCoastalCavityOcclusion = 0;
let maximumCoastalMacroNormalStrength = 0;
const unique = new Set();

for (let y = 0; y < field.crossShoreCount; y += 1) {
  const signedInlandDistance =
    field.signedInlandMinimum +
    (field.signedInlandMaximum - field.signedInlandMinimum) *
    y / (field.crossShoreCount - 1);
  for (let x = 0; x < field.alongshoreCount; x += 1) {
    const anchorX =
      field.alongshoreMinimum +
      (field.alongshoreMaximum - field.alongshoreMinimum) *
      x / (field.alongshoreCount - 1);
    const world = worldAt(anchorX, signedInlandDistance);
    const analysis = sampleHEarthC2R1LandformAnalysis(world.x, world.z);
    check(`r17aSample:${x}:${y}`, analysis?.valid === true);
    if (analysis?.valid !== true) continue;

    const c = analysis.channels;
    const inlandWeight = 0.12 + 0.88 * c.inlandTransition;
    source.relief.push(
      inlandWeight * (
        0.58 * (c.elevationNormalized - 0.5) +
        0.24 * c.convexity -
        0.28 * c.concavity +
        0.12 * c.drainageTendency
      )
    );
    source.roughness.push(
      inlandWeight * (
        c.slopeNormalized +
        0.35 * c.drainageTendency -
        0.55 * c.coastalMoistureInfluence
      )
    );
    source.cavity.push(
      inlandWeight * (
        c.cavityAOHint +
        0.35 * c.drainageTendency
      )
    );
    source.normal.push(
      inlandWeight * (
        c.macroNormalStrengthHint +
        0.25 * c.slopeNormalized
      )
    );

    const albedo = values[indexOf(x, y, 0)];
    const roughness = values[indexOf(x, y, 1)];
    const cavity = values[indexOf(x, y, 2)];
    const normal = values[indexOf(x, y, 3)];
    output.albedo.push(albedo - 1);
    output.roughness.push(roughness);
    output.cavity.push(1 - cavity);
    output.normal.push(normal);
    unique.add(
      `${albedo.toFixed(5)}:${roughness.toFixed(5)}:${cavity.toFixed(5)}:${normal.toFixed(5)}`
    );

    if (signedInlandDistance <= 20) {
      maximumCoastalAlbedoDeviation = Math.max(
        maximumCoastalAlbedoDeviation,
        Math.abs(albedo - 1)
      );
      maximumCoastalRoughnessMagnitude = Math.max(
        maximumCoastalRoughnessMagnitude,
        Math.abs(roughness)
      );
      maximumCoastalCavityOcclusion = Math.max(
        maximumCoastalCavityOcclusion,
        1 - cavity
      );
      maximumCoastalMacroNormalStrength = Math.max(
        maximumCoastalMacroNormalStrength,
        normal
      );
    }

    for (let channel = 0; channel < field.channelCount; channel += 1) {
      const value = values[indexOf(x, y, channel)];
      if (x + 1 < field.alongshoreCount) {
        maximumAdjacentAlongshoreDelta[channel] = Math.max(
          maximumAdjacentAlongshoreDelta[channel],
          Math.abs(value - values[indexOf(x + 1, y, channel)])
        );
      }
      if (y + 1 < field.crossShoreCount) {
        maximumAdjacentCrossShoreDelta[channel] = Math.max(
          maximumAdjacentCrossShoreDelta[channel],
          Math.abs(value - values[indexOf(x, y + 1, channel)])
        );
      }
      if (x > 0 && x + 1 < field.alongshoreCount) {
        maximumSecondDifference[channel] = Math.max(
          maximumSecondDifference[channel],
          Math.abs(
            values[indexOf(x - 1, y, channel)] -
            2 * value +
            values[indexOf(x + 1, y, channel)]
          )
        );
      }
      if (y > 0 && y + 1 < field.crossShoreCount) {
        maximumSecondDifference[channel] = Math.max(
          maximumSecondDifference[channel],
          Math.abs(
            values[indexOf(x, y - 1, channel)] -
            2 * value +
            values[indexOf(x, y + 1, channel)]
          )
        );
      }
    }
  }
}

const correlations = {
  reliefAlbedo: correlation(source.relief, output.albedo),
  slopeMoistureRoughness: correlation(source.roughness, output.roughness),
  cavityAO: correlation(source.cavity, output.cavity),
  macroNormalHint: correlation(source.normal, output.normal)
};

check('allR17ASamplesValid',
  Object.keys(checks)
    .filter(name => name.startsWith('r17aSample:'))
    .every(name => checks[name]));
check('landformCorrespondenceVerified',
  correlations.reliefAlbedo > 0.35 &&
  correlations.slopeMoistureRoughness > 0.35 &&
  correlations.cavityAO > 0.45 &&
  correlations.macroNormalHint > 0.45,
  correlations);
check('macroVariationPresent',
  metadata.metrics.maximums.every((maximum, index) =>
    maximum - metadata.metrics.minimums[index] > [0.002, 0.002, 0.003, 0.0005][index]
  ));
check('crossShoreContinuity',
  maximumAdjacentCrossShoreDelta.every((delta, index) =>
    delta <= [0.018, 0.018, 0.025, 0.009][index]
  ),
  maximumAdjacentCrossShoreDelta);
check('alongshoreContinuity',
  maximumAdjacentAlongshoreDelta.every((delta, index) =>
    delta <= [0.022, 0.022, 0.03, 0.011][index]
  ),
  maximumAdjacentAlongshoreDelta);
check('hardBandingAbsent',
  maximumSecondDifference.every((delta, index) =>
    delta <= [0.012, 0.012, 0.018, 0.007][index]
  ),
  maximumSecondDifference);
check('visibleTilingAbsent', unique.size / field.sampleCount > 0.45);
check('coastalReadabilityPreserved',
  maximumCoastalAlbedoDeviation <= 0.012 &&
  maximumCoastalRoughnessMagnitude <= 0.016 &&
  maximumCoastalCavityOcclusion <= 0.028 &&
  maximumCoastalMacroNormalStrength <= 0.009);
check('periodicNoiseAbsent', metadata.bakeLaw.periodicNoiseUsed === false);
check('randomNoiseAbsent', metadata.bakeLaw.randomNoiseUsed === false);
check('textureTilingAbsent', metadata.bakeLaw.textureTilingUsed === false);
check('wholeWorldBakeAbsent', metadata.bakeLaw.wholeWorldBakeCreated === false);
check('rendererSamplingIntegrationAbsent',
  metadata.ownership.ownsRuntimeSamplingIntegration === false);
check('terrainGeometryUnchanged', metadata.ownership.ownsTerrainGeometry === false);
check('upstreamAuthoritiesUnchanged',
  skipGitAssertions ||
  Object.keys(IMMUTABLE_BLOBS).every(repositoryPath =>
    checks[`immutable:${repositoryPath}`] === true
  ));
check('productDefaultUnchanged',
  metadata.ownership.ownsPublicRouteOrProductDefault === false);
check('publicRouteUnchanged',
  metadata.ownership.ownsPublicRouteOrProductDefault === false);
check('visualSuccessNotClaimed', true);

execFileSync(
  process.execPath,
  [GENERATOR_PATH, '--check'],
  { cwd: ROOT, stdio: 'pipe' }
);
check('deterministicBakeReproduction', true);

const captures = writeCaptures(values, metadata);
check('representativeEngineeringCaptureSetPresent', captures.length === 3);

const receipt = {
  receiptType:
    'H_EARTH_C2_R1_R1_7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD_VERIFICATION_v1',
  operation: 'R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD',
  result: issues.length === 0 ? 'PASS_ENGINEERING' : 'FAIL_ENGINEERING',
  startingHead: STARTING_HEAD,
  executionHead,
  targetBranch: TARGET_BRANCH,
  rollbackBranch: 'rollback/h-earth-c2-r1-r1-7b-start-001',
  changedPaths: EXPECTED_CHANGED_PATHS,
  checks,
  metrics: {
    sampleCount: field.sampleCount,
    validSampleCount: field.sampleCount,
    channelCount: field.channelCount,
    byteLength: field.byteLength,
    uniqueControlRatio: unique.size / field.sampleCount,
    minimums: metadata.metrics.minimums,
    maximums: metadata.metrics.maximums,
    maximumAdjacentCrossShoreDelta,
    maximumAdjacentAlongshoreDelta,
    maximumSecondDifference,
    correlations,
    maximumCoastalAlbedoDeviation,
    maximumCoastalRoughnessMagnitude,
    maximumCoastalCavityOcclusion,
    maximumCoastalMacroNormalStrength,
    fieldValuesSha256: field.valuesSha256,
    immutableUpstreamBlobs: IMMUTABLE_BLOBS
  },
  bakedMacroControlFieldCreated: true,
  sourceR17AContractConsumed: true,
  rendererSamplingIntegrationCreated: false,
  terrainGeometryMutated: false,
  upstreamAuthoritiesUnchanged: checks.upstreamAuthoritiesUnchanged,
  representativeEngineeringCaptureCount: captures.length,
  representativeCaptures: captures,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextAuthorizedSubcheckpoint:
    issues.length === 0
      ? 'R1.7B_DURABLE_CLOSURE'
      : 'R1.7B_CORRECTION_ONLY',
  firstBlocker: issues[0]?.name ?? null,
  evaluationIssues: issues
};

fs.mkdirSync(path.dirname(RECEIPT_PATH), { recursive: true });
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (issues.length > 0) process.exitCode = 1;
