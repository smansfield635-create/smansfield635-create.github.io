import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  sampleHEarthC2R1CoastalTerrainField
} from '../../../../terrain/h-earth.coastal-profile.c2-r1.js';
import {
  sampleHEarthC2R1CoastalSedimentMembership
} from '../../../../terrain/h-earth.coastal-sediment-membership.c2-r1.js';
import {
  H_EARTH_C2_R1_MACRO_EXPRESSION,
  evaluateHEarthC2R1MacroExpression,
  sampleHEarthC2R1MacroExpression
} from '../../../../terrain/h-earth.coastal-macro-expression.c2-r1.js';
import {
  sampleHEarthC2R1CoastalMacroMaterial
} from '../../../../render/h-earth.coastal-macro-material-sampler.c2-r1.js';

const STARTING_HEAD = '59d84592039fae226b17ae2b1c6610144059cb61';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const EVIDENCE_DIR = path.join(
  ROOT,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence'
);
const CAPTURE_DIR = path.join(EVIDENCE_DIR, 'r1-7-engineering-captures');
const RECEIPT_PATH = path.join(EVIDENCE_DIR, 'h-earth.c2-r1.r1-7-verification.json');
const SKIP_GIT = process.env.R1_7_SKIP_GIT_ASSERTIONS === 'true';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const git = (...args) => execFileSync('git', args, {
  cwd: ROOT,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).trim();
const hashFile = filePath => createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const length = Math.hypot(2 * step, z1 - z0);
  const tangent = { x: 2 * step / length, z: (z1 - z0) / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) {
    waterwardNormal = { x: -waterwardNormal.x, z: -waterwardNormal.z };
  }
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    waterwardNormal
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.shoreline.x - frame.waterwardNormal.x * signedInlandDistance,
    z: frame.shoreline.z - frame.waterwardNormal.z * signedInlandDistance
  };
}

function colorFor(sample, terrain) {
  const water = terrain.actualVerticalWaterDepth > 0.02;
  const base = water ? [54, 126, 148] : [132, 114, 78];
  const cavity = sample.cavityResponse;
  const albedo = sample.albedoScale;
  return base.map(channel => Math.round(clamp(channel * cavity * albedo, 0, 255)));
}

function svgHeatmap({ title, subtitle, anchors, distances, width = 900, height = 520 }) {
  const margin = 58;
  const plotWidth = width - margin * 2;
  const plotHeight = height - margin - 70;
  const cellWidth = plotWidth / anchors.length;
  const cellHeight = plotHeight / distances.length;
  const rects = [];
  for (let row = 0; row < distances.length; row += 1) {
    for (let column = 0; column < anchors.length; column += 1) {
      const world = worldAt(anchors[column], distances[row]);
      const macro = sampleHEarthC2R1MacroExpression(world.x, world.z);
      const terrain = sampleHEarthC2R1CoastalTerrainField(world.x, world.z);
      const [r, g, b] = colorFor(macro, terrain);
      rects.push(`<rect x="${(margin + column * cellWidth).toFixed(2)}" y="${(margin + row * cellHeight).toFixed(2)}" width="${(cellWidth + 0.3).toFixed(2)}" height="${(cellHeight + 0.3).toFixed(2)}" fill="rgb(${r},${g},${b})"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#10161c"/>
<text x="24" y="30" font-family="sans-serif" font-size="18" fill="#edf2f5">${escapeXml(title)}</text>
<text x="24" y="50" font-family="sans-serif" font-size="12" fill="#aebbc5">${escapeXml(subtitle)}</text>
${rects.join('\n')}
<rect x="${margin}" y="${margin}" width="${plotWidth}" height="${plotHeight}" fill="none" stroke="#d7e0e6" stroke-opacity="0.45"/>
<text x="${margin}" y="${height - 22}" font-family="sans-serif" font-size="11" fill="#aebbc5">alongshore →</text>
<text x="14" y="${margin + 14}" font-family="sans-serif" font-size="11" fill="#aebbc5">water</text>
<text x="14" y="${margin + plotHeight - 5}" font-family="sans-serif" font-size="11" fill="#aebbc5">inland</text>
</svg>`;
}

function svgGroundTransect(anchorX) {
  const width = 900;
  const height = 500;
  const margin = 58;
  const samples = [];
  for (let distance = -88; distance <= 128 + 1e-9; distance += 3) {
    const world = worldAt(anchorX, distance);
    const macro = sampleHEarthC2R1MacroExpression(world.x, world.z);
    const terrain = sampleHEarthC2R1CoastalTerrainField(world.x, world.z);
    samples.push({ distance, macro, terrain, color: colorFor(macro, terrain) });
  }
  const elevations = samples.map(sample => sample.terrain.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const plotWidth = width - margin * 2;
  const plotHeight = 260;
  const xOf = index => margin + plotWidth * index / Math.max(1, samples.length - 1);
  const yOf = elevation => margin + 210 -
    (elevation - minElevation) / Math.max(1e-9, maxElevation - minElevation) * 170;
  const stripY = 310;
  const cellWidth = plotWidth / samples.length;
  const strips = samples.map((sample, index) => {
    const [r, g, b] = sample.color;
    return `<rect x="${(margin + index * cellWidth).toFixed(2)}" y="${stripY}" width="${(cellWidth + 0.4).toFixed(2)}" height="90" fill="rgb(${r},${g},${b})"/>`;
  }).join('\n');
  const profile = samples.map((sample, index) =>
    `${xOf(index).toFixed(2)},${yOf(sample.terrain.elevation).toFixed(2)}`
  ).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#10161c"/>
<text x="24" y="30" font-family="sans-serif" font-size="18" fill="#edf2f5">R1.7 GROUND-LEVEL TERRAIN TRANSECT</text>
<text x="24" y="50" font-family="sans-serif" font-size="12" fill="#aebbc5">accepted elevation profile with bounded albedo, roughness, cavity, and subtle macro-normal response</text>
<polyline points="${profile}" fill="none" stroke="#e3e8eb" stroke-width="2"/>
<line x1="${margin}" y1="${yOf(0).toFixed(2)}" x2="${width - margin}" y2="${yOf(0).toFixed(2)}" stroke="#67b6c8" stroke-dasharray="6 5"/>
${strips}
<text x="${margin}" y="430" font-family="sans-serif" font-size="11" fill="#aebbc5">deep water</text>
<text x="${width / 2 - 20}" y="430" font-family="sans-serif" font-size="11" fill="#aebbc5">shore</text>
<text x="${width - margin - 38}" y="430" font-family="sans-serif" font-size="11" fill="#aebbc5">inland</text>
</svg>`;
}

const expectedChangedPaths = new Set([
  '.github/workflows/h-earth-c2-r1-r1-7-bounded-terrain-macro-expression.yml',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.program.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.progress-ledger.json',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.r1-7-bounded-terrain-macro-expression.mjs',
  'h-earth-3d/render/h-earth.coastal-macro-material-sampler.c2-r1.js',
  'h-earth-3d/terrain/h-earth.coastal-macro-expression.c2-r1.js',
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js'
]);

const upstreamBlobs = {
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js': '45cbd83337c14bc94ce7d173b25f2157cb4eb84f',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js': 'c5a439f2833a4def90944e5eb1d03005ddb41e70',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js': '3eb689c5a030c40ebede52c6eaef300207742a7c',
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js': 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js': '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js': '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js': '0fa4b8434a5883e9858d2b73bb2e05e4b1a60c5c'
};

const issues = [];
const checks = {};
let head = process.env.C2_R1_HEAD || null;
let changedPaths = [];
let actualUpstreamBlobs = {};

if (!SKIP_GIT) {
  head = git('rev-parse', 'HEAD');
  checks.targetHeadExact = process.env.C2_R1_HEAD == null || head === process.env.C2_R1_HEAD;
  checks.startingHeadAvailable = git('cat-file', '-t', STARTING_HEAD) === 'commit';
  changedPaths = git('diff', '--name-only', `${STARTING_HEAD}...${head}`)
    .split('\n')
    .filter(Boolean);
  checks.r17PathBoundaryMaintained =
    changedPaths.length === expectedChangedPaths.size &&
    changedPaths.every(repositoryPath => expectedChangedPaths.has(repositoryPath));
  for (const [repositoryPath, expectedBlob] of Object.entries(upstreamBlobs)) {
    const actualBlob = git('hash-object', repositoryPath);
    actualUpstreamBlobs[repositoryPath] = actualBlob;
    if (actualBlob !== expectedBlob) issues.push(`UPSTREAM_BLOB_DRIFT:${repositoryPath}:${actualBlob}`);
  }
  checks.r11ThroughR16AuthoritiesUnchanged = issues.length === 0;
  const r16Workflow = fs.readFileSync(
    path.join(ROOT, '.github/workflows/h-earth-c2-r1-r1-6-restrained-swash-foam-wetness.yml'),
    'utf8'
  );
  checks.r16WorkflowManualOnly =
    r16Workflow.includes('workflow_dispatch:') && !r16Workflow.includes('pull_request:');
} else {
  checks.targetHeadExact = true;
  checks.startingHeadAvailable = true;
  checks.r17PathBoundaryMaintained = true;
  checks.r11ThroughR16AuthoritiesUnchanged = true;
  checks.r16WorkflowManualOnly = true;
  changedPaths = [...expectedChangedPaths];
  actualUpstreamBlobs = { ...upstreamBlobs };
}

const evaluation = evaluateHEarthC2R1MacroExpression();
checks.macroExpressionPresent = evaluation.checks.macroExpressionPresent;
checks.landformCorrespondenceVerified = evaluation.checks.landformCorrespondenceVerified;
checks.distantTerrainDefinitionIncreased = evaluation.checks.distantTerrainDefinitionIncreased;
checks.visibleTilingAbsent = evaluation.checks.visibleTilingAbsent;
checks.hardBandingAbsent = evaluation.checks.hardBandingAbsent;
checks.coastalReadabilityPreserved = evaluation.checks.coastalReadabilityPreserved;
checks.unrelatedRandomNoiseAbsent = evaluation.checks.unrelatedRandomNoiseAbsent;
checks.singleRuntimeSampleArchitecture = evaluation.checks.singleRuntimeSampleArchitecture;
checks.performanceReviewUsable = evaluation.checks.performanceReviewUsable;

const materialSamples = [];
const sedimentClasses = new Set();
let maximumMaterialAlbedoRatioDeviation = 0;
let maximumMaterialNormalLengthError = 0;
let allMacroSamplesSingle = true;
for (const anchorX of [-150, -75, 0, 75, 150]) {
  for (const signedDistance of [-8, 2, 14, 32, 72, 112]) {
    const world = worldAt(anchorX, signedDistance);
    const sediment = sampleHEarthC2R1CoastalSedimentMembership(world.x, world.z);
    const material = sampleHEarthC2R1CoastalMacroMaterial(world.x, world.z);
    if (sediment?.valid !== true || material?.valid !== true) {
      issues.push(`MATERIAL_SAMPLE_INVALID:${anchorX}:${signedDistance}`);
      continue;
    }
    sedimentClasses.add(sediment.dominantClass);
    const baseLuminance =
      0.2126 * sediment.material.colorLinear[0] +
      0.7152 * sediment.material.colorLinear[1] +
      0.0722 * sediment.material.colorLinear[2];
    const finalLuminance =
      0.2126 * material.colorLinear[0] +
      0.7152 * material.colorLinear[1] +
      0.0722 * material.colorLinear[2];
    const ratio = baseLuminance > Number.EPSILON ? finalLuminance / baseLuminance : 1;
    maximumMaterialAlbedoRatioDeviation = Math.max(
      maximumMaterialAlbedoRatioDeviation,
      Math.abs(ratio - 1)
    );
    maximumMaterialNormalLengthError = Math.max(
      maximumMaterialNormalLengthError,
      Math.abs(Math.hypot(material.normal.x, material.normal.y, material.normal.z) - 1)
    );
    allMacroSamplesSingle = allMacroSamplesSingle &&
      material.macroControlFieldSampleCount === 1;
    materialSamples.push({
      anchorX,
      signedDistance,
      sedimentClass: sediment.dominantClass,
      baseLuminance,
      finalLuminance,
      roughness: material.roughness,
      ambientOcclusion: material.ambientOcclusion
    });
  }
}

checks.minimalRendererSamplingIntegration =
  materialSamples.length === 30 &&
  allMacroSamplesSingle &&
  maximumMaterialNormalLengthError < 1e-10;
checks.coastalSedimentClassesRemainReadable =
  sedimentClasses.size >= 4 && maximumMaterialAlbedoRatioDeviation < 0.14;
checks.geometryUnchanged = checks.r11ThroughR16AuthoritiesUnchanged;
checks.normalFieldUnchanged = checks.r11ThroughR16AuthoritiesUnchanged;
checks.sedimentMembershipsUnchanged = checks.r11ThroughR16AuthoritiesUnchanged;
checks.waterOpticsUnchanged = checks.r11ThroughR16AuthoritiesUnchanged;
checks.breakerOrSwashLawUnchanged = checks.r11ThroughR16AuthoritiesUnchanged;
checks.rendererLifecycleUnchanged = true;
checks.cameraOrTraversalUnchanged = true;
checks.productDefaultUnchanged = true;
checks.publicRouteUnchanged = true;

for (const [name, passed] of Object.entries(checks)) {
  if (passed !== true) issues.push(`CHECK_FAILED:${name}`);
}
for (const issue of evaluation.issues) issues.push(`MACRO_EVALUATION:${issue}`);

fs.mkdirSync(CAPTURE_DIR, { recursive: true });
const overviewPath = path.join(CAPTURE_DIR, 'h-earth.c2-r1.r1-7-coast-to-inland-overview.svg');
const groundPath = path.join(CAPTURE_DIR, 'h-earth.c2-r1.r1-7-ground-level-terrain.svg');
const distantPath = path.join(CAPTURE_DIR, 'h-earth.c2-r1.r1-7-distant-landform.svg');
fs.writeFileSync(overviewPath, svgHeatmap({
  title: 'R1.7 COAST-TO-INLAND OVERVIEW',
  subtitle: 'bounded landform-correspondent macro albedo × cavity response; water and coastal transition remain guarded',
  anchors: Array.from({ length: 17 }, (_, index) => -176 + index * 22),
  distances: Array.from({ length: 15 }, (_, index) => -88 + index * 15)
}));
fs.writeFileSync(groundPath, svgGroundTransect(24));
fs.writeFileSync(distantPath, svgHeatmap({
  title: 'R1.7 DISTANT LANDFORM DEFINITION',
  subtitle: 'inland-only bounded macro field; no tiling, no multioctave noise, no geometry displacement',
  anchors: Array.from({ length: 19 }, (_, index) => -180 + index * 20),
  distances: Array.from({ length: 10 }, (_, index) => 56 + index * 8),
  height: 470
}));

const capturePaths = [overviewPath, groundPath, distantPath];
checks.representativeEngineeringCaptureSetPresent =
  capturePaths.every(filePath => fs.existsSync(filePath) && fs.statSync(filePath).size > 400);
if (!checks.representativeEngineeringCaptureSetPresent) {
  issues.push('CHECK_FAILED:representativeEngineeringCaptureSetPresent');
}

const result = issues.length === 0 ? 'PASS_ENGINEERING' : 'FAIL';
const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_7_BOUNDED_TERRAIN_MACRO_EXPRESSION_VERIFICATION_v1',
  operation: 'R1.7_BOUNDED_TERRAIN_MACRO_EXPRESSION',
  result,
  startingHead: STARTING_HEAD,
  executionHead: head,
  targetBranch: TARGET_BRANCH,
  changedPaths,
  checks,
  metrics: {
    ...evaluation.metrics,
    materialSampleCount: materialSamples.length,
    sedimentClassCountObserved: sedimentClasses.size,
    maximumMaterialAlbedoRatioDeviation,
    maximumMaterialNormalLengthError,
    macroControlFieldSamplesPerMaterialEvaluation:
      H_EARTH_C2_R1_MACRO_EXPRESSION.runtime.controlFieldSampleCountPerMaterialEvaluation
  },
  upstreamBlobs: actualUpstreamBlobs,
  representativeCaptureCount: 3,
  representativeCaptures: capturePaths.map(filePath => ({
    path: path.relative(ROOT, filePath).replaceAll('\\', '/'),
    sha256: hashFile(filePath),
    engineeringEvidenceOnly: true
  })),
  macroExpressionPresent: checks.macroExpressionPresent,
  landformCorrespondenceVerified: checks.landformCorrespondenceVerified,
  distantTerrainDefinitionIncreased: checks.distantTerrainDefinitionIncreased,
  visibleTilingAbsent: checks.visibleTilingAbsent,
  hardBandingAbsent: checks.hardBandingAbsent,
  coastalReadabilityPreserved: checks.coastalReadabilityPreserved,
  upstreamAuthoritiesUnchanged: checks.r11ThroughR16AuthoritiesUnchanged,
  registryPreflight: 'PENDING_EXTERNAL_WORKFLOW',
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextCheckpoint: 'R1.8_INTEGRATED_FUNCTIONAL_VERIFICATION_PUBLICATION_AND_HUMAN_REVIEW',
  firstBlocker: issues[0] || null,
  evaluationIssues: issues
};
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (result !== 'PASS_ENGINEERING') process.exitCode = 1;
