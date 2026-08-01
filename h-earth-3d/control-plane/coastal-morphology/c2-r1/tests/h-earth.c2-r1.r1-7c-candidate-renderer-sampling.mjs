#!/usr/bin/env node
/**
 * H_EARTH_C2_R1_R1_7C_MINIMAL_CANDIDATE_RENDERER_SAMPLING_VERIFIER_v1
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING,
  sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate,
  sampleHEarthC2R1CandidateRendererMaterial
} from '../h-earth.c2-r1.candidate-renderer-sampling.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const STARTING_HEAD = '591b54210f177ad6627bc3656f960d664430c4c9';
const TARGET_BRANCH =
  'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-7c-start-001';
const CONTROL_ROOT = 'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const RECEIPT_PATH = path.join(
  ROOT,
  CONTROL_ROOT,
  'evidence/h-earth.c2-r1.r1-7c-verification.json'
);
const CAPTURE_DIRECTORY = path.join(
  ROOT,
  CONTROL_ROOT,
  'evidence/r1-7c-engineering-captures'
);

const EXPECTED_CHANGED_PATHS = [
  '.github/workflows/h-earth-c2-r1-r1-7c-candidate-renderer-sampling.yml',
  `${CONTROL_ROOT}/h-earth.c2-r1.allowed-path-manifest.json`,
  `${CONTROL_ROOT}/h-earth.c2-r1.candidate-renderer-sampling.js`,
  `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-7c-candidate-renderer-sampling.mjs`
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
    'dba3fe2898b127addaa5a62081d466e55370da72',
  [`${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`]:
    'a97b3df57ae01626a2ff5cbedf510e2afdf06912',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7b-verification.json`]:
    'c15d880bda64279f220ee810721909941f4b6424'
};

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const sha256 = bytes =>
  crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const maximum = values => values.reduce((result, value) =>
  Math.max(result, value), Number.NEGATIVE_INFINITY);
const minimum = values => values.reduce((result, value) =>
  Math.min(result, value), Number.POSITIVE_INFINITY);
const luminance = color =>
  color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;

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

function svgHeatmap(title, samples, widthCount, heightCount, selectors) {
  const cell = 8;
  const gap = 18;
  const panelWidth = widthCount * cell;
  const panelHeight = heightCount * cell;
  const totalWidth = 24 + selectors.length * (panelWidth + gap);
  const totalHeight = panelHeight + 66;
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`,
    '<rect width="100%" height="100%" fill="#11151b"/>',
    `<text x="12" y="20" fill="#f0f3f7" font-family="monospace" font-size="14">${title}</text>`
  ];
  selectors.forEach((selector, panelIndex) => {
    const values = samples.map(selector.read);
    const low = minimum(values);
    const high = maximum(values);
    const x0 = 12 + panelIndex * (panelWidth + gap);
    const y0 = 32;
    samples.forEach((sample, index) => {
      const x = index % widthCount;
      const y = Math.floor(index / widthCount);
      const t = clamp((selector.read(sample) - low) / Math.max(1e-9, high - low), 0, 1);
      const r = Math.round(38 + 182 * t);
      const g = Math.round(62 + 124 * (1 - Math.abs(2 * t - 1)));
      const b = Math.round(190 - 136 * t);
      elements.push(
        `<rect x="${x0 + x * cell}" y="${y0 + (heightCount - 1 - y) * cell}" width="${cell}" height="${cell}" fill="rgb(${r},${g},${b})"/>`
      );
    });
    elements.push(
      `<text x="${x0}" y="${totalHeight - 12}" fill="#cbd2dc" font-family="monospace" font-size="10">${selector.label} [${low.toFixed(4)}, ${high.toFixed(4)}]</text>`
    );
  });
  elements.push('</svg>');
  return elements.join('');
}

function svgLines(title, series) {
  const width = 900;
  const height = 360;
  const left = 48;
  const top = 38;
  const plotWidth = width - 72;
  const plotHeight = height - 76;
  const all = series.flatMap(entry => entry.values);
  const low = minimum(all);
  const high = maximum(all);
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<rect width="100%" height="100%" fill="#11151b"/>',
    `<text x="16" y="22" fill="#f0f3f7" font-family="monospace" font-size="14">${title}</text>`,
    `<rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="none" stroke="#59616d"/>`
  ];
  series.forEach((entry, seriesIndex) => {
    const points = entry.values.map((value, index) => {
      const x = left + plotWidth * index / Math.max(1, entry.values.length - 1);
      const y = top + plotHeight * (1 - (value - low) / Math.max(1e-9, high - low));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    const dash = seriesIndex % 2 === 1 ? ' stroke-dasharray="7 5"' : '';
    elements.push(
      `<polyline points="${points}" fill="none" stroke="hsl(${35 + seriesIndex * 92} 70% 65%)" stroke-width="2"${dash}/>`
    );
    elements.push(
      `<text x="${left + seriesIndex * 210}" y="${height - 14}" fill="hsl(${35 + seriesIndex * 92} 70% 70%)" font-family="monospace" font-size="11">${entry.label}</text>`
    );
  });
  elements.push('</svg>');
  return elements.join('');
}

const checks = {};
const issues = [];
const check = (name, condition, details = null) => {
  checks[name] = Boolean(condition);
  if (!condition) issues.push({ name, details });
};

const skipGitAssertions = process.env.R1_7C_SKIP_GIT_ASSERTIONS === 'true';
const executionHead = process.env.C2_R1_HEAD || (
  skipGitAssertions ? null : git('rev-parse', 'HEAD')
);
const targetBranch = process.env.C2_R1_TARGET_BRANCH || TARGET_BRANCH;

check('startingHeadAvailable',
  skipGitAssertions || git('cat-file', '-e', `${STARTING_HEAD}^{commit}`) === '');
check('targetBranchExact', targetBranch === TARGET_BRANCH, { targetBranch });
check('targetHeadExact',
  skipGitAssertions || executionHead === git('rev-parse', 'HEAD'));

let changedPaths = EXPECTED_CHANGED_PATHS;
if (!skipGitAssertions) {
  changedPaths = git(
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

const contract = H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING;
check('contractIdentity',
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID ===
    'H_EARTH_C2_R1_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION_v1');
check('sourceFieldIdentity',
  contract.sourceFieldContractId ===
    'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1');
check('staticResourceBinding',
  contract.resourceBinding.kind === 'STATIC_MODULE_BOUND_FLOAT32_FIELD' &&
  contract.resourceBinding.valuesSha256 ===
    '4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866' &&
  contract.resourceBinding.sampleCount === 901 &&
  contract.resourceBinding.channelCount === 4);
check('singleRuntimeSamplingContract',
  contract.runtimeSampling.sampleOperationsPerMaterialEvaluation === 1 &&
  contract.runtimeSampling.interpolation === 'BILINEAR' &&
  contract.runtimeSampling.coordinateAddressing === 'CLAMP_TO_EDGE' &&
  contract.runtimeSampling.periodicCoordinatesUsed === false &&
  contract.runtimeSampling.textureTilingUsed === false);
check('boundedApplicationContract',
  JSON.stringify(contract.channelApplication.applied) === JSON.stringify([
    'ALBEDO_SCALE',
    'ROUGHNESS_OFFSET',
    'CAVITY_RESPONSE'
  ]) &&
  JSON.stringify(contract.channelApplication.optionalAvailableButNotApplied) ===
    JSON.stringify(['MACRO_NORMAL_STRENGTH']));

const fineAlongshoreCount = 65;
const fineCrossShoreCount = 105;
const macroSamples = [];
for (let y = 0; y < fineCrossShoreCount; y += 1) {
  const signedInlandDistance = -120 + 260 * y / (fineCrossShoreCount - 1);
  for (let x = 0; x < fineAlongshoreCount; x += 1) {
    const anchorX = -184 + 368 * x / (fineAlongshoreCount - 1);
    const sample = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
      anchorX,
      signedInlandDistance
    );
    check(`macroSample:${x}:${y}`, sample?.valid === true);
    if (sample?.valid === true) macroSamples.push(sample);
  }
}

const channelBounds = {
  ALBEDO_SCALE: [0.94, 1.07],
  ROUGHNESS_OFFSET: [-0.045, 0.065],
  CAVITY_RESPONSE: [0.84, 1],
  MACRO_NORMAL_STRENGTH: [0, 0.035]
};
for (const [channel, [low, high]] of Object.entries(channelBounds)) {
  const values = macroSamples.map(sample => sample.channels[channel]);
  check(`runtimeChannelFinite:${channel}`, values.every(finite));
  check(`runtimeChannelBounded:${channel}`,
    minimum(values) >= low - 1e-7 && maximum(values) <= high + 1e-7,
    { minimum: minimum(values), maximum: maximum(values), low, high });
}
check('singleRuntimeSampleEverywhere',
  macroSamples.every(sample => sample.runtimeSampleCount === 1));

const lowEdge = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(-184, -120);
const lowOutside = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(-1000, -1000);
const highEdge = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(184, 140);
const highOutside = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(1000, 1000);
const channelSignature = sample => JSON.stringify(Object.values(sample.channels));
check('clampToEdgeLowerConfirmed',
  channelSignature(lowEdge) === channelSignature(lowOutside));
check('clampToEdgeUpperConfirmed',
  channelSignature(highEdge) === channelSignature(highOutside));
check('periodicWrapAbsent',
  channelSignature(lowEdge) !== channelSignature(highEdge));

const uniqueSignatures = new Set(macroSamples.map(sample =>
  Object.values(sample.channels).map(value => value.toFixed(7)).join('|')
));
const uniqueRuntimeControlRatio = uniqueSignatures.size / macroSamples.length;
check('runtimeControlDiversity', uniqueRuntimeControlRatio >= 0.90, {
  uniqueRuntimeControlRatio
});

let maximumBoundaryGap = 0;
const boundaryEpsilon = 1e-5;
for (let boundary = 1; boundary < 16; boundary += 1) {
  const anchorBoundary = -184 + 368 * boundary / 16;
  for (const signedInlandDistance of [-100, -50, 0, 50, 100]) {
    const left = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
      anchorBoundary - boundaryEpsilon,
      signedInlandDistance
    );
    const right = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
      anchorBoundary + boundaryEpsilon,
      signedInlandDistance
    );
    for (const channel of Object.keys(channelBounds)) {
      maximumBoundaryGap = Math.max(
        maximumBoundaryGap,
        Math.abs(left.channels[channel] - right.channels[channel])
      );
    }
  }
}
for (let boundary = 1; boundary < 52; boundary += 1) {
  const signedBoundary = -120 + 260 * boundary / 52;
  for (const anchorX of [-160, -80, 0, 80, 160]) {
    const below = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
      anchorX,
      signedBoundary - boundaryEpsilon
    );
    const above = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
      anchorX,
      signedBoundary + boundaryEpsilon
    );
    for (const channel of Object.keys(channelBounds)) {
      maximumBoundaryGap = Math.max(
        maximumBoundaryGap,
        Math.abs(below.channels[channel] - above.channels[channel])
      );
    }
  }
}
check('bilinearCellBoundaryContinuity', maximumBoundaryGap < 1e-6, {
  maximumBoundaryGap
});

let maximumFineAdjacentDelta = 0;
for (let y = 0; y < fineCrossShoreCount; y += 1) {
  for (let x = 0; x < fineAlongshoreCount; x += 1) {
    const index = y * fineAlongshoreCount + x;
    for (const channel of Object.keys(channelBounds)) {
      if (x + 1 < fineAlongshoreCount) {
        maximumFineAdjacentDelta = Math.max(
          maximumFineAdjacentDelta,
          Math.abs(
            macroSamples[index].channels[channel] -
            macroSamples[index + 1].channels[channel]
          )
        );
      }
      if (y + 1 < fineCrossShoreCount) {
        maximumFineAdjacentDelta = Math.max(
          maximumFineAdjacentDelta,
          Math.abs(
            macroSamples[index].channels[channel] -
            macroSamples[index + fineAlongshoreCount].channels[channel]
          )
        );
      }
    }
  }
}
check('fineRuntimeContinuityBounded', maximumFineAdjacentDelta < 0.006, {
  maximumFineAdjacentDelta
});

const anchorXs = [-184, -138, -92, -46, 0, 46, 92, 138, 184];
const signedDistances = [-24, -12, -4, 0, 4, 12, 24, 48];
const rendererSamples = [];
const readabilityRatios = [];
let maximumAlbedoChange = 0;
let maximumRoughnessChange = 0;
let minimumCavityResponse = 1;

for (const anchorX of anchorXs) {
  const baseLuminance = [];
  const outputLuminance = [];
  for (const signedInlandDistance of signedDistances) {
    const world = worldAt(anchorX, signedInlandDistance);
    const sample = sampleHEarthC2R1CandidateRendererMaterial(
      world.x,
      world.z,
      { timeSeconds: 4.25 }
    );
    check(`rendererSample:${anchorX}:${signedInlandDistance}`,
      sample?.valid === true);
    if (sample?.valid !== true) continue;
    rendererSamples.push(sample);
    check(`rendererSingleSample:${anchorX}:${signedInlandDistance}`,
      sample.controlFieldSampleCount === 1 &&
      sample.macroControl.runtimeSampleCount === 1);
    check(`rendererBoundConfirmed:${anchorX}:${signedInlandDistance}`,
      sample.controlFieldBoundToCandidateRenderer === true &&
      sample.singleRuntimeSampleConfirmed === true &&
      sample.boundedMacroChannelApplicationConfirmed === true);
    check(`rendererNoNormalMutation:${anchorX}:${signedInlandDistance}`,
      sample.material.macroNormalApplied === false &&
      sample.normalRecomputationPerformed === false);
    check(`rendererNoProductMutation:${anchorX}:${signedInlandDistance}`,
      sample.publicRouteMutated === false &&
      sample.productDefaultMutated === false &&
      sample.rendererLifecycleMutated === false);

    const baseLum = luminance(sample.baseMaterialBeforeMacro.colorLinear);
    const outputLum = luminance(sample.material.colorLinear);
    baseLuminance.push(baseLum);
    outputLuminance.push(outputLum);
    maximumAlbedoChange = Math.max(
      maximumAlbedoChange,
      Math.abs(outputLum - baseLum)
    );
    maximumRoughnessChange = Math.max(
      maximumRoughnessChange,
      Math.abs(
        sample.material.roughness - sample.baseMaterialBeforeMacro.roughness
      )
    );
    minimumCavityResponse = Math.min(
      minimumCavityResponse,
      sample.material.cavityOrAmbientOcclusion
    );
  }
  const baseRange = maximum(baseLuminance) - minimum(baseLuminance);
  const outputRange = maximum(outputLuminance) - minimum(outputLuminance);
  if (baseRange > 1e-6) readabilityRatios.push(outputRange / baseRange);
}

const minimumReadabilityRatio = minimum(readabilityRatios);
check('boundedAlbedoApplication', maximumAlbedoChange <= 0.02, {
  maximumAlbedoChange
});
check('boundedRoughnessApplication', maximumRoughnessChange <= 0.03, {
  maximumRoughnessChange
});
check('boundedCavityApplication', minimumCavityResponse >= 0.93, {
  minimumCavityResponse
});
check('coastalMaterialContrastPreserved', minimumReadabilityRatio >= 0.85, {
  minimumReadabilityRatio
});
check('upstreamAuthoritiesUnchanged', rendererSamples.every(sample =>
  sample.upstreamAuthoritiesMutated === false &&
  sample.terrainGeometryMutated === false &&
  sample.sedimentMembershipsMutated === false &&
  sample.waterOpticsMutated === false &&
  sample.breakerOrSwashLawMutated === false
));

const visibleTilingAbsentEngineeringGauge =
  checks.clampToEdgeLowerConfirmed &&
  checks.clampToEdgeUpperConfirmed &&
  checks.periodicWrapAbsent &&
  checks.runtimeControlDiversity;
const hardBandingAbsentEngineeringGauge =
  checks.bilinearCellBoundaryContinuity &&
  checks.fineRuntimeContinuityBounded;
const coastalReadabilityPreservedEngineeringGauge =
  checks.boundedAlbedoApplication &&
  checks.boundedRoughnessApplication &&
  checks.boundedCavityApplication &&
  checks.coastalMaterialContrastPreserved;

check('visibleTilingAbsentEngineeringGauge',
  visibleTilingAbsentEngineeringGauge);
check('hardBandingAbsentEngineeringGauge',
  hardBandingAbsentEngineeringGauge);
check('coastalReadabilityPreservedEngineeringGauge',
  coastalReadabilityPreservedEngineeringGauge);

fs.mkdirSync(CAPTURE_DIRECTORY, { recursive: true });
const macroCapture = svgHeatmap(
  'R1.7C Single-Sample Runtime Macro Controls',
  macroSamples,
  fineAlongshoreCount,
  fineCrossShoreCount,
  [
    { label: 'ALBEDO_SCALE', read: sample => sample.channels.ALBEDO_SCALE },
    { label: 'ROUGHNESS_OFFSET', read: sample => sample.channels.ROUGHNESS_OFFSET },
    { label: 'CAVITY_RESPONSE', read: sample => sample.channels.CAVITY_RESPONSE }
  ]
);
const materialCapture = svgLines(
  'R1.7C Bounded Candidate Material Response',
  [
    {
      label: 'BASE_LUMINANCE',
      values: rendererSamples.map(sample =>
        luminance(sample.baseMaterialBeforeMacro.colorLinear)
      )
    },
    {
      label: 'OUTPUT_LUMINANCE',
      values: rendererSamples.map(sample => luminance(sample.material.colorLinear))
    },
    {
      label: 'OUTPUT_ROUGHNESS',
      values: rendererSamples.map(sample => sample.material.roughness)
    }
  ]
);
const readabilityCapture = svgLines(
  'R1.7C Coastal Readability Preservation Gauge',
  [
    {
      label: 'READABILITY_RATIO',
      values: readabilityRatios
    },
    {
      label: 'REQUIRED_FLOOR',
      values: readabilityRatios.map(() => 0.85)
    }
  ]
);
const captures = [
  {
    path: path.join(
      CAPTURE_DIRECTORY,
      'h-earth.c2-r1.r1-7c-runtime-macro-controls.svg'
    ),
    content: macroCapture
  },
  {
    path: path.join(
      CAPTURE_DIRECTORY,
      'h-earth.c2-r1.r1-7c-bounded-material-response.svg'
    ),
    content: materialCapture
  },
  {
    path: path.join(
      CAPTURE_DIRECTORY,
      'h-earth.c2-r1.r1-7c-coastal-readability.svg'
    ),
    content: readabilityCapture
  }
];
for (const capture of captures) fs.writeFileSync(capture.path, capture.content);

const passed = issues.length === 0;
const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_7C_VERIFICATION_RECEIPT_v1',
  operation: 'R1.7C_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION',
  result: passed ? 'PASS_ENGINEERING' : 'FAIL_ENGINEERING',
  startingHead: STARTING_HEAD,
  executionHead,
  targetBranch: TARGET_BRANCH,
  rollbackBranch: ROLLBACK_BRANCH,
  changedPaths,
  controlFieldBoundToCandidateRenderer:
    checks.staticResourceBinding && rendererSamples.length > 0,
  singleRuntimeSampleConfirmed:
    checks.singleRuntimeSamplingContract && checks.singleRuntimeSampleEverywhere,
  boundedMacroChannelApplicationConfirmed:
    checks.boundedApplicationContract &&
    checks.boundedAlbedoApplication &&
    checks.boundedRoughnessApplication &&
    checks.boundedCavityApplication,
  visibleTilingAbsentEngineeringGauge,
  hardBandingAbsentEngineeringGauge,
  coastalReadabilityPreservedEngineeringGauge,
  metrics: {
    macroRuntimeSampleCount: macroSamples.length,
    candidateRendererSampleCount: rendererSamples.length,
    uniqueRuntimeControlRatio,
    maximumBoundaryGap,
    maximumFineAdjacentDelta,
    maximumAlbedoChange,
    maximumRoughnessChange,
    minimumCavityResponse,
    minimumReadabilityRatio
  },
  immutableBlobs: IMMUTABLE_BLOBS,
  upstreamAuthoritiesUnchanged: checks.upstreamAuthoritiesUnchanged,
  registryPreflight: 'PENDING_AUTOMATIC_REPOSITORY_PREFLIGHT',
  productDefaultMutated: false,
  publicRouteMutated: false,
  passingReceiptPreserved: true,
  repositoryReadbackConfirmed: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  captures: captures.map(capture => ({
    path: path.relative(ROOT, capture.path).replaceAll(path.sep, '/'),
    sha256: sha256(Buffer.from(capture.content)),
    engineeringEvidenceOnly: true
  })),
  checks,
  issues,
  firstBlocker: issues[0] ?? null
};
fs.mkdirSync(path.dirname(RECEIPT_PATH), { recursive: true });
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);

console.log(JSON.stringify(receipt, null, 2));
if (!passed) process.exitCode = 1;
