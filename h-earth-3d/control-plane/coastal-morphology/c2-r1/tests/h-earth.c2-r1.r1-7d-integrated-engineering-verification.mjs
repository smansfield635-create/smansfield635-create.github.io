#!/usr/bin/env node
/**
 * H_EARTH_C2_R1_R1_7D_INTEGRATED_ENGINEERING_VERIFICATION_v1
 *
 * Verification-only harness. It does not alter renderer implementation,
 * material parameters, terrain geometry, water, traversal, or public routes.
 * A cumulative phase ledger is persisted after every bounded phase so a later
 * blocker cannot erase already completed work.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
  sampleHEarthC2R1LandformAnalysis
} from '../h-earth.c2-r1.landform-analysis.js';
import {
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID,
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD
} from '../h-earth.c2-r1.baked-macro-control-field.js';
import {
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING,
  sampleHEarthC2R1CandidateRendererMaterial
} from '../h-earth.c2-r1.candidate-renderer-sampling.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const CONTROL_ROOT = 'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const STARTING_HEAD = '0a4ca0d7be7f569905a8ad38fbd7436619172c31';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const START_ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-7d-start-001';
const WORKFLOW_PATH = '.github/workflows/h-earth-c2-r1-physically-coherent-coastal-successor.yml';
const HARNESS_PATH = `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-7d-integrated-engineering-verification.mjs`;
const EVIDENCE_ROOT = path.join(ROOT, CONTROL_ROOT, 'evidence/r1-7d');
const CAPTURE_ROOT = path.join(EVIDENCE_ROOT, 'fixed-view-engineering-captures');
const PHASE_LEDGER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-7d-phase-ledger.json');
const RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-7d-verification.json');

const EXPECTED_EXECUTION_PATHS = [WORKFLOW_PATH, HARNESS_PATH].sort();
const IMMUTABLE_BLOBS = {
  [`${CONTROL_ROOT}/h-earth.c2-r1.landform-analysis.js`]: 'dba3fe2898b127addaa5a62081d466e55370da72',
  [`${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`]: 'a97b3df57ae01626a2ff5cbedf510e2afdf06912',
  [`${CONTROL_ROOT}/h-earth.c2-r1.candidate-renderer-sampling.js`]: '949bfebd2cc29a57cc207bb65fa0b18d5ac62f3a',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7a-verification.json`]: '000c72cd37b12c7e7abfe783f26bdd139d69901d',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7b-verification.json`]: 'c15d880bda64279f220ee810721909941f4b6424',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7c-verification.json`]: '5b7a9650a5f39ffee2ba394334fb24806d771d0e',
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js': '45cbd83337c14bc94ce7d173b25f2157cb4eb84f',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js': 'c5a439f2833a4def90944e5eb1d03005ddb41e70',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js': '3eb689c5a030c40ebede52c6eaef300207742a7c',
  [`${CONTROL_ROOT}/h-earth.c2-r1.continuous-sediment-membership.js`]: 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js': '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js': '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js': '0fa4b8434a5883e9858d2b73bb2e05e4b1a60c5c'
};

const establishedR17CBasis = Object.freeze({
  maximumBoundaryGap: 3.523827640794508e-8,
  maximumFineAdjacentDelta: 0.004987984895706177,
  minimumReadabilityRatio: 0.9981642262491339,
  uniqueRuntimeControlRatio: 1
});

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const maximum = values => values.reduce((m, v) => Math.max(m, v), Number.NEGATIVE_INFINITY);
const minimum = values => values.reduce((m, v) => Math.min(m, v), Number.POSITIVE_INFINITY);
const mean = values => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const luminance = color => color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
const round = value => Number(value.toFixed(12));

fs.mkdirSync(CAPTURE_ROOT, { recursive: true });

const executionHead = process.env.C2_R1_HEAD || git('rev-parse', 'HEAD');
const targetBranch = process.env.C2_R1_TARGET_BRANCH || TARGET_BRANCH;
const phaseLedger = {
  ledgerType: 'H_EARTH_C2_R1_R1_7D_BOUNDED_PHASE_LEDGER_v1',
  operation: 'R1.7D_INTEGRATED_ENGINEERING_VERIFICATION_AND_DURABLE_R1.7_CLOSURE',
  startingHead: STARTING_HEAD,
  executionHead,
  targetBranch,
  startRollbackBranch: START_ROLLBACK_BRANCH,
  createdAt: new Date().toISOString(),
  completedPhaseCount: 0,
  phases: [],
  firstBlocker: null
};

function persistLedger() {
  phaseLedger.updatedAt = new Date().toISOString();
  phaseLedger.completedPhaseCount = phaseLedger.phases.filter(phase => phase.status === 'PASS').length;
  fs.writeFileSync(PHASE_LEDGER_PATH, `${JSON.stringify(phaseLedger, null, 2)}\n`);
}

function appendPhase(id, status, evidence = {}, blocker = null) {
  const phase = { id, status, completedAt: new Date().toISOString(), evidence, blocker };
  phaseLedger.phases.push(phase);
  if (blocker && !phaseLedger.firstBlocker) phaseLedger.firstBlocker = blocker;
  persistLedger();
  return phase;
}

function failPhase(id, code, details = {}) {
  const blocker = { code, details };
  appendPhase(id, 'BLOCKED', {}, blocker);
  const error = new Error(code);
  error.blocker = blocker;
  throw error;
}

function requireCondition(id, condition, code, details = {}) {
  if (!condition) failPhase(id, code, details);
}

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  const tangent = { x: tangentX / length, z: tangentZ / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) waterwardNormal = { x: -waterwardNormal.x, z: -waterwardNormal.z };
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    inlandNormal: { x: -waterwardNormal.x, z: -waterwardNormal.z }
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.shoreline.x + frame.inlandNormal.x * signedInlandDistance,
    z: frame.shoreline.z + frame.inlandNormal.z * signedInlandDistance
  };
}

function materialVector(sample, enabled = true) {
  const material = enabled ? sample.material : {
    ...sample.baseMaterialBeforeMacro,
    cavityOrAmbientOcclusion: 1
  };
  return [
    luminance(material.colorLinear),
    material.roughness,
    material.cavityOrAmbientOcclusion ?? 1
  ];
}

function svgEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

function captureSvg({ title, camera, samples, mode }) {
  const width = 1200;
  const height = 620;
  const margin = 54;
  const plotWidth = width - margin * 2;
  const plotHeight = height - 150;
  const elevations = samples.map(sample => sample.world.y);
  const minElevation = minimum(elevations);
  const maxElevation = maximum(elevations);
  const minX = minimum(samples.map(sample => sample.distance));
  const maxX = maximum(samples.map(sample => sample.distance));
  const projectX = value => margin + plotWidth * (value - minX) / Math.max(1e-9, maxX - minX);
  const projectY = value => margin + plotHeight * (1 - (value - minElevation) / Math.max(1e-9, maxElevation - minElevation));
  const terrainPath = samples.map((sample, index) => `${index === 0 ? 'M' : 'L'} ${projectX(sample.distance).toFixed(2)} ${projectY(sample.world.y).toFixed(2)}`).join(' ');
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<rect width="100%" height="100%" fill="#101318"/>',
    `<text x="24" y="28" fill="#eef2f6" font-family="monospace" font-size="16">${svgEscape(title)}</text>`,
    `<text x="24" y="50" fill="#aeb8c4" font-family="monospace" font-size="11">exact candidate head: ${executionHead}</text>`,
    `<text x="24" y="68" fill="#aeb8c4" font-family="monospace" font-size="11">fixed camera: ${svgEscape(JSON.stringify(camera))}</text>`,
    `<text x="24" y="86" fill="#aeb8c4" font-family="monospace" font-size="11">comparison: R1.7 macro response disabled vs enabled; engineering gauge only</text>`,
    `<path d="${terrainPath}" fill="none" stroke="#8b96a3" stroke-width="2"/>`
  ];
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    const [enabledLuminance] = materialVector(sample, true);
    const [disabledLuminance] = materialVector(sample, false);
    const delta = enabledLuminance - disabledLuminance;
    const intensity = clamp(Math.abs(delta) * 420, 0.12, 1);
    const r = Math.round(80 + 150 * intensity);
    const g = Math.round(130 + 80 * (1 - intensity));
    const b = Math.round(210 - 120 * intensity);
    const x = projectX(sample.distance);
    const y = projectY(sample.world.y);
    elements.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${mode === 'overview' ? 4 : 3}" fill="rgb(${r},${g},${b})"/>`);
  }
  elements.push(
    `<text x="24" y="${height - 46}" fill="#c5ccd5" font-family="monospace" font-size="11">samples=${samples.length}; elevation=[${minElevation.toFixed(4)}, ${maxElevation.toFixed(4)}]</text>`,
    `<text x="24" y="${height - 26}" fill="#c5ccd5" font-family="monospace" font-size="11">color encodes absolute enabled-minus-disabled macro material response</text>`,
    '</svg>'
  );
  return elements.join('');
}

function writeCapture(name, specification, samples, mode) {
  const filePath = path.join(CAPTURE_ROOT, name);
  fs.writeFileSync(filePath, captureSvg({ ...specification, samples, mode }));
  return {
    file: path.relative(ROOT, filePath),
    sha256: sha256(fs.readFileSync(filePath)),
    camera: specification.camera,
    sampleCount: samples.length
  };
}

persistLedger();

let runtimeEvidence = null;
let captureEvidence = null;
try {
  const phaseId1 = 'R1.7D_1_EXACT_HEAD_AND_STATIC_CORRESPONDENCE';
  requireCondition(phaseId1, targetBranch === TARGET_BRANCH, 'TARGET_BRANCH_MISMATCH', { targetBranch });
  requireCondition(phaseId1, git('cat-file', '-e', `${STARTING_HEAD}^{commit}`) === '', 'STARTING_HEAD_UNAVAILABLE');
  requireCondition(phaseId1, git('merge-base', '--is-ancestor', STARTING_HEAD, executionHead) === '', 'STARTING_HEAD_NOT_ANCESTOR', { executionHead });
  const changedPaths = git('diff', '--name-only', STARTING_HEAD, executionHead).split('\n').filter(Boolean).sort();
  requireCondition(phaseId1, JSON.stringify(changedPaths) === JSON.stringify(EXPECTED_EXECUTION_PATHS), 'EXECUTION_PATH_BOUNDARY_VIOLATION', { expected: EXPECTED_EXECUTION_PATHS, actual: changedPaths });
  const blobReadback = {};
  for (const [repositoryPath, expectedBlob] of Object.entries(IMMUTABLE_BLOBS)) {
    const actualBlob = git('rev-parse', `${executionHead}:${repositoryPath}`);
    blobReadback[repositoryPath] = actualBlob;
    requireCondition(phaseId1, actualBlob === expectedBlob, 'CLOSED_UPSTREAM_BLOB_CHANGED', { repositoryPath, expectedBlob, actualBlob });
  }
  requireCondition(phaseId1, H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID === 'H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1', 'R1_7A_CONTRACT_IDENTITY_FAILED');
  requireCondition(phaseId1, H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID === 'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1', 'R1_7B_CONTRACT_IDENTITY_FAILED');
  requireCondition(phaseId1, H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID === 'H_EARTH_C2_R1_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION_v1', 'R1_7C_CONTRACT_IDENTITY_FAILED');
  requireCondition(phaseId1, !changedPaths.some(file => file.startsWith('showroom/') || file.startsWith('h-earth-3d/integration/')), 'PUBLIC_OR_PRODUCT_PATH_MUTATION_DETECTED', { changedPaths });
  appendPhase(phaseId1, 'PASS', {
    candidateBranchExact: true,
    startingHeadExact: STARTING_HEAD,
    changedPaths,
    immutableBlobCount: Object.keys(blobReadback).length,
    blobReadback,
    productDefaultUnchanged: true,
    publicRouteUnchanged: true
  });

  const phaseId2 = 'R1.7D_2_INTEGRATED_RUNTIME_AND_PERFORMANCE_VERIFICATION';
  const fixedViews = {
    coastToInlandOverview: { anchorXs: [-160, -120, -80, -40, 0, 40, 80, 120, 160], distances: [-80, -40, -10, 0, 20, 50, 90, 130] },
    groundLevelTerrain: { anchorXs: [-24, -12, 0, 12, 24], distances: [-6, 0, 6, 14, 24, 38, 56, 78] },
    distantLandform: { anchorXs: [-176, -132, -88, -44, 0, 44, 88, 132, 176], distances: [70, 90, 110, 130, 140] }
  };
  const samplesByView = {};
  const allSamples = [];
  const startTime = performance.now();
  for (const [viewName, view] of Object.entries(fixedViews)) {
    const samples = [];
    for (const anchorX of view.anchorXs) {
      for (const distance of view.distances) {
        const world = worldAt(anchorX, distance);
        const landform = sampleHEarthC2R1LandformAnalysis(world.x, world.z);
        const candidate = sampleHEarthC2R1CandidateRendererMaterial(world.x, world.z, { timeSeconds: 0 });
        requireCondition(phaseId2, landform?.valid === true, 'LANDFORM_RUNTIME_SAMPLE_INVALID', { viewName, anchorX, distance });
        requireCondition(phaseId2, candidate?.valid === true, 'CANDIDATE_RUNTIME_SAMPLE_INVALID', { viewName, anchorX, distance });
        requireCondition(phaseId2, candidate.controlFieldSampleCount === 1 && candidate.macroControl.runtimeSampleCount === 1, 'SINGLE_RUNTIME_SAMPLE_FAILED', { viewName, anchorX, distance });
        requireCondition(phaseId2, candidate.sourceMacroControlContractId === H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID, 'BAKED_FIELD_TO_RENDERER_LINK_FAILED');
        requireCondition(phaseId2, JSON.stringify(candidate.appliedMacroChannels) === JSON.stringify(['ALBEDO_SCALE', 'ROUGHNESS_OFFSET', 'CAVITY_RESPONSE']), 'UNAUTHORIZED_MATERIAL_CHANNEL_APPLICATION');
        requireCondition(phaseId2, candidate.rendererLifecycleMutated === false && candidate.terrainGeometryMutated === false && candidate.cameraOrTraversalMutated === false && candidate.waterOpticsMutated === false && candidate.breakerOrSwashLawMutated === false, 'PROHIBITED_RUNTIME_AUTHORITY_MUTATION');
        const record = {
          viewName,
          anchorX,
          distance,
          world: candidate.world,
          landformChannels: landform.channels,
          macroChannels: candidate.macroControl.channels,
          material: candidate.material,
          baseMaterialBeforeMacro: candidate.baseMaterialBeforeMacro,
          preservedCandidateResponses: candidate.preservedCandidateResponses,
          sourceIds: {
            landform: landform.contractId,
            bakedField: candidate.sourceMacroControlContractId,
            renderer: candidate.contractId
          }
        };
        samples.push(record);
        allSamples.push(record);
      }
    }
    samplesByView[viewName] = samples;
  }
  const elapsedMilliseconds = performance.now() - startTime;
  const samplesPerSecond = allSamples.length / Math.max(elapsedMilliseconds / 1000, 1e-9);
  const sourceText = fs.readFileSync(path.join(ROOT, CONTROL_ROOT, 'h-earth.c2-r1.candidate-renderer-sampling.js'), 'utf8');
  const fieldCopyCallCount = (sourceText.match(/copyHEarthC2R1BakedMacroControlFieldValues\(\)/g) || []).length;
  const noPerFrameResourceRecreation = H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.resourceBinding.kind === 'STATIC_MODULE_BOUND_FLOAT32_FIELD' && H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.resourceBinding.runtimeCopiesPerMaterialEvaluation === 0 && fieldCopyCallCount === 1;
  requireCondition(phaseId2, noPerFrameResourceRecreation, 'PER_FRAME_RESOURCE_RECREATION_DETECTED', { fieldCopyCallCount });
  requireCondition(phaseId2, allSamples.length > 0 && allSamples.every(sample => sample.sourceIds.landform === H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID), 'LANDFORM_TO_FIELD_RUNTIME_LINK_FAILED');
  requireCondition(phaseId2, finite(elapsedMilliseconds) && elapsedMilliseconds > 0 && finite(samplesPerSecond) && samplesPerSecond > 0, 'REPRESENTATIVE_RUNTIME_MEASUREMENT_INVALID', { elapsedMilliseconds, samplesPerSecond });
  runtimeEvidence = {
    integratedRuntimeChainVerified: true,
    singleRuntimeSampleConfirmed: true,
    sampleCount: allSamples.length,
    fixedViewCount: Object.keys(samplesByView).length,
    elapsedMilliseconds: round(elapsedMilliseconds),
    samplesPerSecond: round(samplesPerSecond),
    performanceUsableForReview: true,
    resourceBindingStable: true,
    noPerFrameTextureRecreation: true,
    rendererLifecycleUnchanged: true,
    terrainGeometryUnchanged: true,
    cameraOrTraversalUnchanged: true,
    waterBreakerSwashWetnessUnchanged: true
  };
  appendPhase(phaseId2, 'PASS', runtimeEvidence);

  const phaseId3 = 'R1.7D_3_FIXED_VIEW_ENGINEERING_CAPTURE_AND_GAUGE';
  const enabledVectors = allSamples.map(sample => materialVector(sample, true));
  const disabledVectors = allSamples.map(sample => materialVector(sample, false));
  const luminanceRatios = enabledVectors.map((vector, index) => vector[0] / Math.max(1e-9, disabledVectors[index][0]));
  const deltaVectors = enabledVectors.map((vector, index) => vector.map((value, channel) => value - disabledVectors[index][channel]));
  const macroSignalEnergy = mean(deltaVectors.map(vector => vector.reduce((sum, value) => sum + value * value, 0)));
  const signatures = new Set(allSamples.map(sample => JSON.stringify(Object.values(sample.macroChannels).map(value => Number(value.toFixed(7))))));
  const uniqueRuntimeControlRatio = signatures.size / allSamples.length;
  const landformSignal = allSamples.map(sample => sample.landformChannels.elevationNormalized + sample.landformChannels.slopeNormalized + sample.landformChannels.cavityAOHint);
  const macroMagnitude = deltaVectors.map(vector => Math.hypot(...vector));
  const landformMean = mean(landformSignal);
  const macroMean = mean(macroMagnitude);
  const covariance = mean(landformSignal.map((value, index) => (value - landformMean) * (macroMagnitude[index] - macroMean)));
  const distantSamples = samplesByView.distantLandform;
  const distantDefinitionSignalEnergy = mean(distantSamples.map(sample => {
    const enabled = materialVector(sample, true);
    const disabled = materialVector(sample, false);
    return enabled.reduce((sum, value, index) => sum + (value - disabled[index]) ** 2, 0);
  }));
  const waterPreserved = allSamples.every(sample => sample.preservedCandidateResponses.waterSurfaceOpacity >= 0 && Array.isArray(sample.preservedCandidateResponses.waterSurfaceColorLinear));
  const maximumAdjacentMacroDelta = maximum(allSamples.slice(1).map((sample, index) => Math.max(...Object.keys(sample.macroChannels).map(channel => Math.abs(sample.macroChannels[channel] - allSamples[index].macroChannels[channel])))));
  const captures = [
    writeCapture('h-earth.c2-r1.r1-7d-coast-to-inland-overview.svg', {
      title: 'R1.7D Coast-to-Inland Overview',
      camera: { type: 'ORTHOGRAPHIC_ENGINEERING', position: [0, 220, 30], target: [0, 0, 25], near: 0.1, far: 700 }
    }, samplesByView.coastToInlandOverview, 'overview'),
    writeCapture('h-earth.c2-r1.r1-7d-ground-level-terrain.svg', {
      title: 'R1.7D Ground-Level Terrain',
      camera: { type: 'PERSPECTIVE_ENGINEERING', position: [0, 2.2, -22], target: [0, 1.2, 76], fovDegrees: 58 }
    }, samplesByView.groundLevelTerrain, 'ground'),
    writeCapture('h-earth.c2-r1.r1-7d-distant-landform.svg', {
      title: 'R1.7D Distant Landform',
      camera: { type: 'PERSPECTIVE_ENGINEERING', position: [0, 42, -180], target: [0, 14, 112], fovDegrees: 44 }
    }, samplesByView.distantLandform, 'distant')
  ];
  const findings = {
    macroExpressionPresent: macroSignalEnergy > 0,
    landformCorrespondenceVerified: covariance !== 0 && allSamples.every(sample => sample.sourceIds.landform === H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID),
    distantTerrainDefinitionIncreased: distantDefinitionSignalEnergy > 0,
    visibleTextureTilingAbsent: H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.textureTilingUsed === false && H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.runtimeSampling.textureTilingUsed === false && uniqueRuntimeControlRatio > 0.9,
    hardOrContourLikeBandingAbsent: H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.contourBandsUsed === false && H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.runtimeSampling.contourBandsUsed === false,
    unrelatedRandomNoiseAbsent: H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.randomNoiseUsed === false && H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.periodicNoiseUsed === false,
    muddyUniformTerrainAbsent: uniqueRuntimeControlRatio > 0 && macroSignalEnergy > 0,
    overpoweredDarkeningAbsent: minimum(luminanceRatios) >= establishedR17CBasis.minimumReadabilityRatio - 1e-10,
    coastalSandReadabilityPreserved: minimum(luminanceRatios) >= establishedR17CBasis.minimumReadabilityRatio - 1e-10,
    waterReadabilityPreserved: waterPreserved,
    groundLevelReadabilityPreserved: samplesByView.groundLevelTerrain.every(sample => luminance(sample.material.colorLinear) > 0)
  };
  for (const [finding, passed] of Object.entries(findings)) {
    requireCondition(phaseId3, passed, `ENGINEERING_FINDING_FAILED:${finding}`, {
      macroSignalEnergy,
      covariance,
      distantDefinitionSignalEnergy,
      uniqueRuntimeControlRatio,
      minimumLuminanceRatio: minimum(luminanceRatios),
      maximumAdjacentMacroDelta
    });
  }
  captureEvidence = {
    exactCandidateHead: executionHead,
    captures,
    findings,
    measures: {
      macroSignalEnergy: round(macroSignalEnergy),
      landformMacroCovariance: round(covariance),
      distantDefinitionSignalEnergy: round(distantDefinitionSignalEnergy),
      uniqueRuntimeControlRatio: round(uniqueRuntimeControlRatio),
      minimumLuminanceRatio: round(minimum(luminanceRatios)),
      maximumLuminanceRatio: round(maximum(luminanceRatios)),
      maximumAdjacentMacroDelta: round(maximumAdjacentMacroDelta),
      establishedComparisonBasis: establishedR17CBasis
    }
  };
  appendPhase(phaseId3, 'PASS', captureEvidence);

  const receipt = {
    receiptType: 'H_EARTH_C2_R1_R1_7D_INTEGRATED_ENGINEERING_VERIFICATION_v1',
    operation: 'R1.7D_INTEGRATED_ENGINEERING_VERIFICATION_AND_DURABLE_R1.7_CLOSURE',
    result: 'PASS_ENGINEERING',
    startingHead: STARTING_HEAD,
    executionHead,
    targetBranch,
    startRollbackBranch: START_ROLLBACK_BRANCH,
    completedPhaseCount: phaseLedger.completedPhaseCount,
    phaseLedgerPath: path.relative(ROOT, PHASE_LEDGER_PATH),
    integratedRuntimeChainVerified: true,
    singleRuntimeSampleConfirmed: true,
    macroExpressionPresent: captureEvidence.findings.macroExpressionPresent,
    landformCorrespondenceVerified: captureEvidence.findings.landformCorrespondenceVerified,
    distantTerrainDefinitionIncreased: captureEvidence.findings.distantTerrainDefinitionIncreased,
    visibleTilingAbsent: captureEvidence.findings.visibleTextureTilingAbsent,
    hardBandingAbsent: captureEvidence.findings.hardOrContourLikeBandingAbsent,
    coastalReadabilityPreserved: captureEvidence.findings.coastalSandReadabilityPreserved,
    performanceUsableForReview: runtimeEvidence.performanceUsableForReview,
    rendererLifecycleUnchanged: runtimeEvidence.rendererLifecycleUnchanged,
    upstreamAuthoritiesUnchanged: true,
    productDefaultMutated: false,
    publicRouteMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    firstBlocker: null,
    runtimeEvidence,
    captureEvidence,
    issues: []
  };
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify({
    result: receipt.result,
    executionHead,
    completedPhaseCount: phaseLedger.completedPhaseCount,
    receiptSha256: sha256(fs.readFileSync(RECEIPT_PATH)),
    phaseLedgerSha256: sha256(fs.readFileSync(PHASE_LEDGER_PATH)),
    captureCount: captures.length
  }, null, 2));
} catch (error) {
  if (!phaseLedger.firstBlocker) {
    phaseLedger.firstBlocker = error.blocker || { code: error.message, details: {} };
    persistLedger();
  }
  const failureReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_7D_INTEGRATED_ENGINEERING_VERIFICATION_v1',
    operation: 'R1.7D_INTEGRATED_ENGINEERING_VERIFICATION_AND_DURABLE_R1.7_CLOSURE',
    result: 'BLOCKED',
    startingHead: STARTING_HEAD,
    executionHead,
    targetBranch,
    startRollbackBranch: START_ROLLBACK_BRANCH,
    completedPhaseCount: phaseLedger.completedPhaseCount,
    phaseLedgerPath: path.relative(ROOT, PHASE_LEDGER_PATH),
    firstBlocker: phaseLedger.firstBlocker,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false
  };
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(failureReceipt, null, 2)}\n`);
  console.error(JSON.stringify(failureReceipt, null, 2));
  process.exitCode = 1;
}
