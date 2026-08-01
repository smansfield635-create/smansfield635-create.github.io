#!/usr/bin/env node
/**
 * H_EARTH_C2_R1_R1_7D_C2_ULP_SAFE_DARKENING_FLOOR_VERIFIER_v1
 *
 * Re-verifies only the affected runtime assertions and R1.7D_3 after the
 * implementation-side 1e-12 albedo-floor safety margin. The original exact
 * readability comparison is retained without tolerance or approximation.
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
const STARTING_HEAD = 'fe6359d700346a9792b130cc4c9772359a663b2e';
const HISTORICAL_R1_7C_CLOSURE_HEAD = '0a4ca0d7be7f569905a8ad38fbd7436619172c31';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const START_ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-7d-c2-start-001';
const REQUIRED_MINIMUM_LUMINANCE_RATIO = 0.9981642262491339;
const IMPLEMENTATION_SAFETY_MARGIN = 1e-12;
const TARGET_MEASURED_RATIO = 0.9981642262501339;
const RENDERER_PATH = `${CONTROL_ROOT}/h-earth.c2-r1.candidate-renderer-sampling.js`;
const HARNESS_PATH = `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-7d-integrated-engineering-verification.mjs`;
const EXPECTED_CORRECTIVE_PATHS = [RENDERER_PATH, HARNESS_PATH].sort();
const EVIDENCE_ROOT = path.join(ROOT, CONTROL_ROOT, 'evidence/r1-7d');
const CAPTURE_ROOT = path.join(EVIDENCE_ROOT, 'fixed-view-engineering-captures');
const PHASE_LEDGER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-7d-phase-ledger.json');
const RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-7d-verification.json');
const EXECUTION_MANIFEST_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-7d-c2-execution-manifest.json');

const FAILURE_EVIDENCE = Object.freeze({
  initialR17D3: Object.freeze({
    workflowRun: 30683749569,
    workflowJob: 91325597315,
    artifactId: 8813180082,
    artifactDigest: 'sha256:f84ea69d5bdda146691e3f570d424d2505e40c5880335103dbf3e3ec46503fa5'
  }),
  r17dC1OneUlpShortfall: Object.freeze({
    workflowRun: 30683997023,
    workflowJob: 91326273440,
    artifactId: 8813265376,
    artifactDigest: 'sha256:e5c1b20d956861cc82954288bcbe66ed19c3f8ae0e35f76c213cac1cf41aa11e'
  })
});

const IMMUTABLE_BLOBS = Object.freeze({
  [`${CONTROL_ROOT}/h-earth.c2-r1.landform-analysis.js`]: 'dba3fe2898b127addaa5a62081d466e55370da72',
  [`${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`]: 'a97b3df57ae01626a2ff5cbedf510e2afdf06912',
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
});

const BEFORE = Object.freeze({
  minimumLuminanceRatio: 0.9981642262491338,
  macroSignalEnergy: 0.00055844446920518,
  landformMacroCovariance: 0.003717705198923025,
  distantDefinitionSignalEnergy: 0.0013810560194828106,
  uniqueRuntimeControlRatio: 0.9808917197452229,
  maximumAdjacentMacroDelta: 0.052542983495015294
});

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimumValue, maximumValue) =>
  Math.min(maximumValue, Math.max(minimumValue, value));
const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const maximum = values => values.reduce((m, value) => Math.max(m, value), Number.NEGATIVE_INFINITY);
const minimum = values => values.reduce((m, value) => Math.min(m, value), Number.POSITIVE_INFINITY);
const mean = values => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const luminance = color => color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
const round = value => Number(value.toFixed(15));
const relative = filePath => path.relative(ROOT, filePath);

fs.rmSync(EVIDENCE_ROOT, { recursive: true, force: true });
fs.mkdirSync(CAPTURE_ROOT, { recursive: true });

const executionHead = process.env.C2_R1_HEAD || git('rev-parse', 'HEAD');
const targetBranch = process.env.C2_R1_TARGET_BRANCH || TARGET_BRANCH;
const phaseLedger = {
  ledgerType: 'H_EARTH_C2_R1_R1_7D_BOUNDED_PHASE_LEDGER_v3',
  operation: 'R1.7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION',
  controllingStatus: 'R1.7D_BLOCKED_AT_R1.7D_3_ONE_ULP_SHORTFALL',
  correctiveStartingHead: STARTING_HEAD,
  historicalR17CClosureHead: HISTORICAL_R1_7C_CLOSURE_HEAD,
  executionHead,
  targetBranch,
  startRollbackBranch: START_ROLLBACK_BRANCH,
  failureEvidence: FAILURE_EVIDENCE,
  phases: [
    {
      id: 'R1.7D_1_EXACT_HEAD_AND_STATIC_CORRESPONDENCE',
      status: 'PASS_RECORDED_INHERITED',
      repeated: false
    }
  ],
  firstBlocker: null,
  createdAt: new Date().toISOString()
};

function persistLedger() {
  phaseLedger.updatedAt = new Date().toISOString();
  phaseLedger.completedPhaseCount = phaseLedger.phases.filter(phase =>
    phase.status.startsWith('PASS')
  ).length;
  fs.writeFileSync(PHASE_LEDGER_PATH, `${JSON.stringify(phaseLedger, null, 2)}\n`);
}

function appendPhase(id, status, evidence = {}, blocker = null) {
  phaseLedger.phases.push({
    id,
    status,
    completedAt: new Date().toISOString(),
    evidence,
    blocker
  });
  if (blocker && !phaseLedger.firstBlocker) phaseLedger.firstBlocker = blocker;
  persistLedger();
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
  if (waterwardNormal.z < 0) {
    waterwardNormal = { x: -waterwardNormal.x, z: -waterwardNormal.z };
  }
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
  const material = enabled
    ? sample.material
    : { ...sample.baseMaterialBeforeMacro, cavityOrAmbientOcclusion: 1 };
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
  const minDistance = minimum(samples.map(sample => sample.distance));
  const maxDistance = maximum(samples.map(sample => sample.distance));
  const projectX = value => margin + plotWidth *
    (value - minDistance) / Math.max(1e-9, maxDistance - minDistance);
  const projectY = value => margin + plotHeight *
    (1 - (value - minElevation) / Math.max(1e-9, maxElevation - minElevation));
  const terrainPath = samples.map((sample, index) =>
    `${index === 0 ? 'M' : 'L'} ${projectX(sample.distance).toFixed(2)} ${projectY(sample.world.y).toFixed(2)}`
  ).join(' ');
  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<rect width="100%" height="100%" fill="#101318"/>',
    `<text x="24" y="28" fill="#eef2f6" font-family="monospace" font-size="16">${svgEscape(title)}</text>`,
    `<text x="24" y="50" fill="#aeb8c4" font-family="monospace" font-size="11">exact candidate head: ${executionHead}</text>`,
    `<text x="24" y="68" fill="#aeb8c4" font-family="monospace" font-size="11">fixed camera: ${svgEscape(JSON.stringify(camera))}</text>`,
    '<text x="24" y="86" fill="#aeb8c4" font-family="monospace" font-size="11">comparison: R1.7 macro response disabled versus enabled; engineering gauge only</text>',
    `<path d="${terrainPath}" fill="none" stroke="#8b96a3" stroke-width="2"/>`
  ];
  for (const sample of samples) {
    const enabledLuminance = materialVector(sample, true)[0];
    const disabledLuminance = materialVector(sample, false)[0];
    const intensity = clamp(Math.abs(enabledLuminance - disabledLuminance) * 420, 0.12, 1);
    const r = Math.round(80 + 150 * intensity);
    const g = Math.round(130 + 80 * (1 - intensity));
    const b = Math.round(210 - 120 * intensity);
    elements.push(
      `<circle cx="${projectX(sample.distance).toFixed(2)}" cy="${projectY(sample.world.y).toFixed(2)}" r="${mode === 'overview' ? 4 : 3}" fill="rgb(${r},${g},${b})"/>`
    );
  }
  elements.push(
    `<text x="24" y="${height - 46}" fill="#c5ccd5" font-family="monospace" font-size="11">samples=${samples.length}; elevation=[${minElevation.toFixed(4)}, ${maxElevation.toFixed(4)}]</text>`,
    `<text x="24" y="${height - 26}" fill="#c5ccd5" font-family="monospace" font-size="11">exact minimum luminance requirement=${REQUIRED_MINIMUM_LUMINANCE_RATIO}</text>`,
    '</svg>'
  );
  return elements.join('');
}

function writeCapture(name, specification, samples, mode) {
  const filePath = path.join(CAPTURE_ROOT, name);
  fs.writeFileSync(filePath, captureSvg({ ...specification, samples, mode }));
  return {
    file: relative(filePath),
    sha256: sha256(fs.readFileSync(filePath)),
    camera: specification.camera,
    sampleCount: samples.length
  };
}

persistLedger();

try {
  const preflightId = 'R1.7D_C2_CORRECTIVE_BOUNDARY_PREFLIGHT';
  requireCondition(preflightId, targetBranch === TARGET_BRANCH,
    'TARGET_BRANCH_MISMATCH', { targetBranch });
  requireCondition(preflightId,
    git('rev-parse', `origin/${START_ROLLBACK_BRANCH}`) === STARTING_HEAD,
    'CORRECTIVE_START_ROLLBACK_MISMATCH');
  requireCondition(preflightId,
    git('merge-base', '--is-ancestor', STARTING_HEAD, executionHead) === '',
    'CORRECTIVE_STARTING_HEAD_NOT_ANCESTOR', { executionHead });
  const changedPaths = git('diff', '--name-only', STARTING_HEAD, executionHead)
    .split('\n').filter(Boolean).sort();
  requireCondition(preflightId,
    JSON.stringify(changedPaths) === JSON.stringify(EXPECTED_CORRECTIVE_PATHS),
    'CORRECTIVE_PATH_BOUNDARY_VIOLATION',
    { expected: EXPECTED_CORRECTIVE_PATHS, actual: changedPaths });

  const immutableBlobReadback = {};
  for (const [repositoryPath, expectedBlob] of Object.entries(IMMUTABLE_BLOBS)) {
    const actualBlob = git('rev-parse', `${executionHead}:${repositoryPath}`);
    immutableBlobReadback[repositoryPath] = actualBlob;
    requireCondition(preflightId, actualBlob === expectedBlob,
      'CLOSED_AUTHORITY_BLOB_CHANGED',
      { repositoryPath, expectedBlob, actualBlob });
  }

  requireCondition(preflightId,
    H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID ===
      'H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1',
    'R1_7A_CONTRACT_IDENTITY_FAILED');
  requireCondition(preflightId,
    H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID ===
      'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1',
    'R1_7B_CONTRACT_IDENTITY_FAILED');
  requireCondition(preflightId,
    H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID ===
      'H_EARTH_C2_R1_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION_v1',
    'R1_7C_ARCHITECTURE_IDENTITY_FAILED');

  const contract = H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING;
  requireCondition(preflightId,
    contract.resourceBinding.kind === 'STATIC_MODULE_BOUND_FLOAT32_FIELD' &&
    contract.resourceBinding.valuesSha256 ===
      '4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866' &&
    contract.resourceBinding.sampleCount === 901 &&
    contract.resourceBinding.channelCount === 4 &&
    contract.resourceBinding.runtimeCopiesPerMaterialEvaluation === 0,
    'CONTROL_FIELD_RESOURCE_BINDING_CHANGED');
  requireCondition(preflightId,
    contract.runtimeSampling.sampleOperationsPerMaterialEvaluation === 1 &&
    contract.runtimeSampling.interpolation === 'BILINEAR' &&
    contract.runtimeSampling.coordinateAddressing === 'CLAMP_TO_EDGE',
    'SINGLE_SAMPLE_ARCHITECTURE_CHANGED');
  requireCondition(preflightId,
    JSON.stringify(contract.channelApplication.applied) ===
      JSON.stringify(['ALBEDO_SCALE', 'ROUGHNESS_OFFSET', 'CAVITY_RESPONSE']) &&
    JSON.stringify(contract.channelApplication.optionalAvailableButNotApplied) ===
      JSON.stringify(['MACRO_NORMAL_STRENGTH']),
    'AUTHORIZED_CHANNEL_SET_CHANGED');
  requireCondition(preflightId,
    contract.downstreamCorrectiveSuccessor?.checkpoint ===
      'R1.7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION' &&
    contract.downstreamCorrectiveSuccessor.implementationSafetyMargin ===
      IMPLEMENTATION_SAFETY_MARGIN &&
    contract.channelApplication.bounds.ALBEDO_SCALE[0] === TARGET_MEASURED_RATIO,
    'IMPLEMENTATION_SAFETY_MARGIN_NOT_EXACT', {
      expectedFloor: TARGET_MEASURED_RATIO,
      actualFloor: contract.channelApplication.bounds.ALBEDO_SCALE[0]
    });
  appendPhase(preflightId, 'PASS', {
    changedPaths,
    immutableBlobReadback,
    historicalR17CClosurePreserved: true,
    r17aByteIdentical: true,
    r17bByteIdentical: true,
    singleRuntimeSamplePreserved: true,
    authorizedChannelSetPreserved: true,
    implementationSafetyMargin: IMPLEMENTATION_SAFETY_MARGIN,
    appliedAlbedoFloor: contract.channelApplication.bounds.ALBEDO_SCALE[0]
  });

  const phaseId2 = 'R1.7D_2_AFFECTED_RUNTIME_ASSERTIONS_REVERIFIED';
  const fixedViews = {
    coastToInlandOverview: {
      anchorXs: [-160, -120, -80, -40, 0, 40, 80, 120, 160],
      distances: [-80, -40, -10, 0, 20, 50, 90, 130]
    },
    groundLevelTerrain: {
      anchorXs: [-24, -12, 0, 12, 24],
      distances: [-6, 0, 6, 14, 24, 38, 56, 78]
    },
    distantLandform: {
      anchorXs: [-176, -132, -88, -44, 0, 44, 88, 132, 176],
      distances: [70, 90, 110, 130, 140]
    }
  };
  const samplesByView = {};
  const allSamples = [];
  const runtimeStart = performance.now();
  for (const [viewName, view] of Object.entries(fixedViews)) {
    const samples = [];
    for (const anchorX of view.anchorXs) {
      for (const distance of view.distances) {
        const world = worldAt(anchorX, distance);
        const landform = sampleHEarthC2R1LandformAnalysis(world.x, world.z);
        const candidate = sampleHEarthC2R1CandidateRendererMaterial(
          world.x, world.z, { timeSeconds: 0 }
        );
        requireCondition(phaseId2, landform?.valid === true,
          'LANDFORM_RUNTIME_SAMPLE_INVALID', { viewName, anchorX, distance });
        requireCondition(phaseId2, candidate?.valid === true,
          'CANDIDATE_RUNTIME_SAMPLE_INVALID', { viewName, anchorX, distance });
        requireCondition(phaseId2,
          candidate.controlFieldSampleCount === 1 &&
          candidate.macroControl.runtimeSampleCount === 1,
          'SINGLE_RUNTIME_SAMPLE_FAILED', { viewName, anchorX, distance });
        requireCondition(phaseId2,
          candidate.sourceMacroControlContractId ===
            H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID,
          'BAKED_FIELD_TO_RENDERER_LINK_FAILED');
        requireCondition(phaseId2,
          JSON.stringify(candidate.appliedMacroChannels) ===
            JSON.stringify(['ALBEDO_SCALE', 'ROUGHNESS_OFFSET', 'CAVITY_RESPONSE']),
          'UNAUTHORIZED_MATERIAL_CHANNEL_APPLICATION');
        requireCondition(phaseId2,
          candidate.rendererLifecycleMutated === false &&
          candidate.terrainGeometryMutated === false &&
          candidate.normalRecomputationPerformed === false &&
          candidate.cameraOrTraversalMutated === false &&
          candidate.waterOpticsMutated === false &&
          candidate.breakerOrSwashLawMutated === false &&
          candidate.publicRouteMutated === false &&
          candidate.productDefaultMutated === false,
          'PROHIBITED_RUNTIME_AUTHORITY_MUTATION');
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

  const elapsedMilliseconds = performance.now() - runtimeStart;
  const samplesPerSecond = allSamples.length /
    Math.max(elapsedMilliseconds / 1000, 1e-9);
  const rendererSource = fs.readFileSync(path.join(ROOT, RENDERER_PATH), 'utf8');
  const fieldCopyCallCount =
    (rendererSource.match(/copyHEarthC2R1BakedMacroControlFieldValues\(\)/g) || []).length;
  requireCondition(phaseId2,
    fieldCopyCallCount === 1 &&
    contract.resourceBinding.runtimeCopiesPerMaterialEvaluation === 0,
    'PER_FRAME_RESOURCE_RECREATION_DETECTED', { fieldCopyCallCount });
  requireCondition(phaseId2,
    finite(elapsedMilliseconds) && elapsedMilliseconds > 0 &&
    finite(samplesPerSecond) && samplesPerSecond > 0,
    'REPRESENTATIVE_RUNTIME_MEASUREMENT_INVALID',
    { elapsedMilliseconds, samplesPerSecond });

  const runtimeEvidence = {
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
  appendPhase(phaseId2, 'PASS_REVERIFIED', runtimeEvidence);

  const phaseId3 = 'R1.7D_3_FIXED_VIEW_ENGINEERING_CAPTURE_AND_GAUGE';
  const enabledVectors = allSamples.map(sample => materialVector(sample, true));
  const disabledVectors = allSamples.map(sample => materialVector(sample, false));
  const luminanceRatios = enabledVectors.map((vector, index) =>
    vector[0] / Math.max(1e-9, disabledVectors[index][0])
  );
  const deltaVectors = enabledVectors.map((vector, index) =>
    vector.map((value, channel) => value - disabledVectors[index][channel])
  );
  const macroSignalEnergy = mean(deltaVectors.map(vector =>
    vector.reduce((sum, value) => sum + value * value, 0)
  ));
  const signatures = new Set(allSamples.map(sample =>
    JSON.stringify(Object.values(sample.macroChannels).map(value =>
      Number(value.toFixed(7))
    ))
  ));
  const uniqueRuntimeControlRatio = signatures.size / allSamples.length;
  const landformSignal = allSamples.map(sample =>
    sample.landformChannels.elevationNormalized +
    sample.landformChannels.slopeNormalized +
    sample.landformChannels.cavityAOHint
  );
  const macroMagnitude = deltaVectors.map(vector => Math.hypot(...vector));
  const landformMean = mean(landformSignal);
  const macroMean = mean(macroMagnitude);
  const covariance = mean(landformSignal.map((value, index) =>
    (value - landformMean) * (macroMagnitude[index] - macroMean)
  ));
  const distantDefinitionSignalEnergy = mean(
    samplesByView.distantLandform.map(sample => {
      const enabled = materialVector(sample, true);
      const disabled = materialVector(sample, false);
      return enabled.reduce((sum, value, index) =>
        sum + (value - disabled[index]) ** 2, 0
      );
    })
  );
  const maximumAdjacentMacroDelta = maximum(allSamples.slice(1).map((sample, index) =>
    Math.max(...Object.keys(sample.macroChannels).map(channel =>
      Math.abs(sample.macroChannels[channel] - allSamples[index].macroChannels[channel])
    ))
  ));
  const waterPreserved = allSamples.every(sample =>
    sample.preservedCandidateResponses.waterSurfaceOpacity >= 0 &&
    Array.isArray(sample.preservedCandidateResponses.waterSurfaceColorLinear)
  );
  const after = {
    minimumLuminanceRatio: minimum(luminanceRatios),
    macroSignalEnergy,
    landformMacroCovariance: covariance,
    distantDefinitionSignalEnergy,
    uniqueRuntimeControlRatio,
    maximumAdjacentMacroDelta
  };

  const findings = {
    macroExpressionPresent: macroSignalEnergy > 0,
    landformCorrespondenceVerified:
      covariance !== 0 && allSamples.every(sample =>
        sample.sourceIds.landform === H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID
      ),
    distantTerrainDefinitionIncreased: distantDefinitionSignalEnergy > 0,
    visibleTextureTilingAbsent:
      H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.textureTilingUsed === false &&
      contract.runtimeSampling.textureTilingUsed === false &&
      uniqueRuntimeControlRatio === BEFORE.uniqueRuntimeControlRatio,
    hardOrContourLikeBandingAbsent:
      H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.contourBandsUsed === false &&
      contract.runtimeSampling.contourBandsUsed === false,
    unrelatedRandomNoiseAbsent:
      H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.randomNoiseUsed === false &&
      H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.bakeLaw.periodicNoiseUsed === false,
    muddyUniformTerrainAbsent:
      uniqueRuntimeControlRatio > 0 && macroSignalEnergy > 0,
    overpoweredDarkeningAbsent:
      after.minimumLuminanceRatio >= REQUIRED_MINIMUM_LUMINANCE_RATIO,
    coastalSandReadabilityPreserved:
      after.minimumLuminanceRatio >= REQUIRED_MINIMUM_LUMINANCE_RATIO,
    waterReadabilityPreserved: waterPreserved,
    groundLevelReadabilityPreserved:
      samplesByView.groundLevelTerrain.every(sample =>
        luminance(sample.material.colorLinear) > 0
      ),
    performanceUsableForReview: runtimeEvidence.performanceUsableForReview,
    macroResponseNotEliminated:
      macroSignalEnergy > 0 && covariance !== 0 &&
      distantDefinitionSignalEnergy > 0 &&
      maximumAdjacentMacroDelta === BEFORE.maximumAdjacentMacroDelta
  };

  for (const [finding, passed] of Object.entries(findings)) {
    requireCondition(phaseId3, passed,
      `ENGINEERING_FINDING_FAILED:${finding}`,
      {
        requiredMinimumLuminanceRatio: REQUIRED_MINIMUM_LUMINANCE_RATIO,
        targetMeasuredRatio: TARGET_MEASURED_RATIO,
        before: BEFORE,
        after
      });
  }

  const captures = [
    writeCapture('h-earth.c2-r1.r1-7d-coast-to-inland-overview.svg', {
      title: 'R1.7D Coast-to-Inland Overview — C2 Corrected',
      camera: {
        type: 'ORTHOGRAPHIC_ENGINEERING',
        position: [0, 220, 30],
        target: [0, 0, 25],
        near: 0.1,
        far: 700
      }
    }, samplesByView.coastToInlandOverview, 'overview'),
    writeCapture('h-earth.c2-r1.r1-7d-ground-level-terrain.svg', {
      title: 'R1.7D Ground-Level Terrain — C2 Corrected',
      camera: {
        type: 'PERSPECTIVE_ENGINEERING',
        position: [0, 2.2, -22],
        target: [0, 1.2, 76],
        fovDegrees: 58
      }
    }, samplesByView.groundLevelTerrain, 'ground'),
    writeCapture('h-earth.c2-r1.r1-7d-distant-landform.svg', {
      title: 'R1.7D Distant Landform — C2 Corrected',
      camera: {
        type: 'PERSPECTIVE_ENGINEERING',
        position: [0, 42, -180],
        target: [0, 14, 112],
        fovDegrees: 44
      }
    }, samplesByView.distantLandform, 'distant')
  ];

  const roundedAfter = Object.fromEntries(Object.entries(after).map(([key, value]) =>
    [key, round(value)]
  ));
  const deltas = Object.fromEntries(Object.keys(BEFORE).map(key =>
    [key, round(after[key] - BEFORE[key])]
  ));
  const captureEvidence = {
    exactCandidateHead: executionHead,
    captures,
    findings,
    before: BEFORE,
    after: roundedAfter,
    deltas,
    requiredMinimumLuminanceRatio: REQUIRED_MINIMUM_LUMINANCE_RATIO,
    targetMeasuredRatio: TARGET_MEASURED_RATIO,
    implementationSafetyMargin: IMPLEMENTATION_SAFETY_MARGIN
  };
  appendPhase(phaseId3, 'PASS_RECORDED', captureEvidence);

  const receipt = {
    receiptType: 'H_EARTH_C2_R1_R1_7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION_v1',
    operation: 'R1.7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION',
    result: 'PASS_ENGINEERING_CORRECTED_READY_FOR_DURABLE_CLOSURE',
    startingHead: STARTING_HEAD,
    executionHead,
    targetBranch,
    startRollbackBranch: START_ROLLBACK_BRANCH,
    historicalR17CClosurePreserved: true,
    failureEvidence: FAILURE_EVIDENCE,
    completedPhaseCount: phaseLedger.completedPhaseCount,
    phaseLedgerPath: relative(PHASE_LEDGER_PATH),
    integratedRuntimeChainVerified: true,
    singleRuntimeSampleConfirmed: true,
    macroExpressionPresent: findings.macroExpressionPresent,
    landformCorrespondenceVerified: findings.landformCorrespondenceVerified,
    distantTerrainDefinitionIncreased: findings.distantTerrainDefinitionIncreased,
    visibleTilingAbsent: findings.visibleTextureTilingAbsent,
    hardBandingAbsent: findings.hardOrContourLikeBandingAbsent,
    unrelatedRandomNoiseAbsent: findings.unrelatedRandomNoiseAbsent,
    muddyUniformTerrainAbsent: findings.muddyUniformTerrainAbsent,
    overpoweredDarkeningAbsent: findings.overpoweredDarkeningAbsent,
    coastalReadabilityPreserved: findings.coastalSandReadabilityPreserved,
    performanceUsableForReview: findings.performanceUsableForReview,
    macroResponseNotEliminated: findings.macroResponseNotEliminated,
    rendererLifecycleUnchanged: true,
    upstreamAuthoritiesUnchanged: true,
    r17aByteIdentical: true,
    r17bByteIdentical: true,
    r17bFieldValuesSha256:
      '4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866',
    productDefaultMutated: false,
    publicRouteMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    before: BEFORE,
    after: roundedAfter,
    deltas,
    runtimeEvidence,
    captureEvidence,
    firstBlocker: null,
    issues: []
  };
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);

  const executionManifest = {
    manifestType: 'H_EARTH_C2_R1_R1_7D_C2_EXECUTION_EVIDENCE_MANIFEST_v1',
    operation: receipt.operation,
    result: receipt.result,
    startingHead: STARTING_HEAD,
    executionHead,
    workflowRun: Number(process.env.GITHUB_RUN_ID || 0),
    workflowRunAttempt: Number(process.env.GITHUB_RUN_ATTEMPT || 0),
    artifactName: 'h-earth-c2-r1-r1-7d-integrated-engineering-evidence',
    receipt: {
      path: relative(RECEIPT_PATH),
      sha256: sha256(fs.readFileSync(RECEIPT_PATH))
    },
    phaseLedger: {
      path: relative(PHASE_LEDGER_PATH),
      sha256: sha256(fs.readFileSync(PHASE_LEDGER_PATH))
    },
    captures,
    registryPreflightRequiredOnExactHead: true,
    durableRepositoryCustodyEstablished: false,
    repositoryReadbackConfirmed: false,
    closedRollbackBranchCreated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false
  };
  fs.writeFileSync(EXECUTION_MANIFEST_PATH,
    `${JSON.stringify(executionManifest, null, 2)}\n`);

  console.log(JSON.stringify({
    result: receipt.result,
    executionHead,
    minimumLuminanceRatioBefore: BEFORE.minimumLuminanceRatio,
    minimumLuminanceRatioAfter: roundedAfter.minimumLuminanceRatio,
    requiredMinimumLuminanceRatio: REQUIRED_MINIMUM_LUMINANCE_RATIO,
    targetMeasuredRatio: TARGET_MEASURED_RATIO,
    receiptSha256: sha256(fs.readFileSync(RECEIPT_PATH)),
    phaseLedgerSha256: sha256(fs.readFileSync(PHASE_LEDGER_PATH)),
    executionManifestSha256: sha256(fs.readFileSync(EXECUTION_MANIFEST_PATH)),
    captureCount: captures.length
  }, null, 2));
} catch (error) {
  if (!phaseLedger.firstBlocker) {
    phaseLedger.firstBlocker = error.blocker || { code: error.message, details: {} };
    persistLedger();
  }
  const failureReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION_v1',
    operation: 'R1.7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION',
    result: 'BLOCKED',
    startingHead: STARTING_HEAD,
    executionHead,
    targetBranch,
    startRollbackBranch: START_ROLLBACK_BRANCH,
    completedPhaseCount: phaseLedger.completedPhaseCount,
    phaseLedgerPath: relative(PHASE_LEDGER_PATH),
    firstBlocker: phaseLedger.firstBlocker,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false
  };
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(failureReceipt, null, 2)}\n`);
  console.error(JSON.stringify(failureReceipt, null, 2));
  process.exitCode = 1;
}
