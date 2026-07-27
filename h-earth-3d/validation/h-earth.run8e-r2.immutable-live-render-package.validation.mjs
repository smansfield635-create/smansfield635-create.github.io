import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_RUN_8E_R2_CONTRACT_ID,
  H_EARTH_RUN_8E_R2_CONTROL,
  evaluateHEarthRun8ER2Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js';
import {
  buildHEarthRun8ER2ImmutableLiveRenderPackage,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews,
  getHEarthRun8ER2ImmutableLiveRenderPackage
} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID } from '../../showroom/globe/h-earth/render/renderer.functional-landscape.js';

const FAILURE_RECEIPT_PATH = new URL(
  './run-8e-r2/h-earth.run8e-r2a.attempt-001.failure.receipt.json',
  import.meta.url
);
const PASS_RECEIPT_PATH = new URL(
  './run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
  import.meta.url
);
const failureReceipt = JSON.parse(fs.readFileSync(FAILURE_RECEIPT_PATH, 'utf8'));
const passReceipt = JSON.parse(fs.readFileSync(PASS_RECEIPT_PATH, 'utf8'));

const control = evaluateHEarthRun8ER2Control(H_EARTH_RUN_8E_R2_CONTROL);
assert.equal(control.eligible, true, `R2_CONTROL_FAILED:${control.issues.join(',')}`);
assert.equal(control.status, 'RUN_8E_R2A_CONTROL_PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.boundedSubcheckpoints[0].currentStatus, 'PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.boundedSubcheckpoints[1].currentStatus, 'NOT_STARTED');
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.stoppingBoundary.currentCheckpoint, 'RUN_8E_R2A_PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.stoppingBoundary.nextCheckpoint, 'RUN_8E_R2B_NOT_STARTED');

assert.equal(failureReceipt.status, 'RUN_8E_R2A_ATTEMPT_001_FAIL_OPEN_RECONCILED');
assert.equal(failureReceipt.failure.causeDisposition, 'RESOLVED');
assert.equal(failureReceipt.failure.affectedPrimitiveIds.length, 7);
assert.equal(failureReceipt.successfulSuccessorAttempt.correctedSourceHead, 'e0403370b888f0478ec51cdd96cc2fcdd267e25b');
assert.equal(failureReceipt.boundaries.run8ER2BStarted, false);

assert.equal(passReceipt.eligible, true);
assert.equal(passReceipt.status, 'RUN_8E_R2A_PASS_CLOSED');
assert.equal(passReceipt.execution.runId, 30235565337);
assert.equal(passReceipt.execution.jobId, 89882629845);
assert.equal(passReceipt.artifact.artifactId, 8641519551);
assert.equal(passReceipt.artifact.artifactDigest,
  'sha256:605f28dd6e2eb6410126773cee6dc672ff40f964d88e4a7ffbfbf223ecfe095c');
assert.equal(passReceipt.validatedPackage.packageIdentity,
  'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25');
assert.equal(passReceipt.validatedPackage.contentDigest, 'fnv1a32:fd913c25');
assert.equal(passReceipt.executedSourceIdentities.packageGitBlobSha,
  '1699654f39c9e183f4cfc6f75b20ba051641b763');
assert.equal(passReceipt.executedSourceIdentities.validationGitBlobSha,
  '5fb4eeea7fb6d67633677ca5328e1c7500c2df81');
assert.equal(passReceipt.checkpointDisposition.run8ER2A, 'PASS_CLOSED');
assert.equal(passReceipt.checkpointDisposition.run8ER2B, 'NOT_STARTED');
assert.equal(passReceipt.boundaries.run8ER2BStarted, false);
assert.equal(passReceipt.boundaries.run8ER3Started, false);
assert.equal(passReceipt.boundaries.run8EPassClosed, false);

const explicitA = buildHEarthRun8ER2ImmutableLiveRenderPackage({
  packageOccurrenceId: 'H_EARTH_RUN_8E_R2_VALIDATION_EXPLICIT_A'
});
assert.equal(explicitA.eligible, true, `R2_EXPLICIT_A_FAILED:${explicitA.issues?.join(',')}`);
const explicitEvaluationA = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(explicitA);
assert.equal(explicitEvaluationA.eligible, true, `R2_EXPLICIT_A_EVALUATION_FAILED:${explicitEvaluationA.issues.join(',')}`);

const explicitB = buildHEarthRun8ER2ImmutableLiveRenderPackage({
  packageOccurrenceId: 'H_EARTH_RUN_8E_R2_VALIDATION_EXPLICIT_B'
});
assert.equal(explicitB.eligible, true, `R2_EXPLICIT_B_FAILED:${explicitB.issues?.join(',')}`);
assert.notEqual(explicitA, explicitB, 'R2_EXPLICIT_BUILDS_MUST_BE_DISTINCT_OBJECTS');
assert.equal(explicitA.packageIdentity, explicitB.packageIdentity, 'R2_PACKAGE_IDENTITY_NOT_DETERMINISTIC');
assert.equal(explicitA.contentDigest, explicitB.contentDigest, 'R2_CONTENT_DIGEST_NOT_DETERMINISTIC');
assert.deepEqual(explicitA.primitiveIds, explicitB.primitiveIds, 'R2_PRIMITIVE_ORDER_NOT_DETERMINISTIC');
assert.deepEqual(explicitA.primitiveSpans, explicitB.primitiveSpans, 'R2_PRIMITIVE_SPANS_NOT_DETERMINISTIC');
assert.deepEqual(explicitA.drawRanges, explicitB.drawRanges, 'R2_DRAW_RANGES_NOT_DETERMINISTIC');

const cachedA = getHEarthRun8ER2ImmutableLiveRenderPackage();
const cachedB = getHEarthRun8ER2ImmutableLiveRenderPackage();
assert.equal(cachedA, cachedB, 'R2_CACHED_PACKAGE_OBJECT_NOT_STABLE');
assert.equal(cachedA.packageIdentity, explicitA.packageIdentity, 'R2_CACHED_PACKAGE_IDENTITY_MISMATCH');
assert.equal(cachedA.packageIdentity, passReceipt.validatedPackage.packageIdentity);
assert.equal(cachedA.contentDigest, passReceipt.validatedPackage.contentDigest);
assert.equal(Object.isFrozen(cachedA), true, 'R2_PACKAGE_NOT_FROZEN');
assert.equal(Object.isFrozen(cachedA.buffers), true, 'R2_BUFFER_RECORD_NOT_FROZEN');
Object.values(cachedA.buffers).forEach((buffer) => assert.equal(Object.isFrozen(buffer), true, 'R2_SOURCE_BUFFER_NOT_FROZEN'));

assert.equal(cachedA.contractId, H_EARTH_RUN_8E_R2_CONTRACT_ID);
assert.equal(cachedA.primitiveCount, 35);
assert.equal(cachedA.vertexCount, 25524);
assert.equal(cachedA.roleCounts.TERRAIN, 1);
assert.equal(cachedA.roleCounts.SHORELINE, 7);
assert.equal(cachedA.roleCounts.VEGETATION, 27);
const shorelineSpans = cachedA.primitiveSpans.filter((span) => span.role === 'SHORELINE');
assert.equal(shorelineSpans.length, 7, 'R2A_SHORELINE_SPAN_COUNT_INVALID');
assert.equal(shorelineSpans.every((span) =>
  span.materialProjectionAuthorityContractId === H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID &&
  span.materialProjectionModel === 'EXACT_RUN_6D_MATERIAL_DEFAULTS' &&
  typeof span.materialReference === 'string' && span.materialReference.length > 0 &&
  typeof span.materialIntent === 'string' && span.materialIntent.length > 0), true,
'R2A_SHORELINE_MATERIAL_AUTHORITY_NOT_PRESERVED');
assert.equal(shorelineSpans.filter((span) => span.transparencyClass === 'TRANSLUCENT').length, 4,
  'R2A_SHORELINE_TRANSLUCENT_RANGE_COUNT_INVALID');
assert.equal(shorelineSpans.filter((span) => span.transparencyClass === 'OPAQUE').length, 3,
  'R2A_SHORELINE_OPAQUE_RANGE_COUNT_INVALID');
assert.equal(cachedA.triangleCount, 49040);
assert.equal(cachedA.indexCount, 147120);
assert.equal(cachedA.sourceAuthorities.semanticAddressCount, 256);
assert.equal(cachedA.sourceAuthorities.terrainAddressCount, 124);
assert.equal(cachedA.sourceAuthorities.shorelineWaterAddressCount, 96);
assert.equal(cachedA.sourceAuthorities.proxySummarizedAddressCount, 36);
assert.equal(cachedA.sourceAuthorities.legacyProxyIncluded, false);
assert.equal(cachedA.sourceAuthorities.successorMountainIncluded, true);
assert.equal(cachedA.cameraIndependent, true);
assert.equal(cachedA.viewportIndependent, true);
assert.equal(cachedA.webglContextCreated, false);
assert.equal(cachedA.renderLoopCreated, false);
assert.equal(cachedA.publicRouteBound, false);
assert.equal(cachedA.deploymentAuthority, false);
assert.equal('camera' in cachedA, false);
assert.equal('viewport' in cachedA, false);

const viewsA = createHEarthRun8ER2GPUBufferViews(cachedA);
const viewsB = createHEarthRun8ER2GPUBufferViews(cachedA);
for (const key of [
  'positions', 'normals', 'baseColorsLinear', 'materialParameters',
  'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
]) {
  assert.notEqual(viewsA[key], viewsB[key], `R2_GPU_VIEW_NOT_COPY_ON_REQUEST:${key}`);
  assert.equal(viewsA[key].length, cachedA.buffers[key].length, `R2_GPU_VIEW_LENGTH_MISMATCH:${key}`);
}
const sourceFirstPosition = cachedA.buffers.positions[0];
viewsA.positions[0] = sourceFirstPosition + 1000;
assert.equal(cachedA.buffers.positions[0], sourceFirstPosition, 'R2_GPU_VIEW_MUTATED_PACKAGE_SOURCE');
assert.equal(viewsB.positions[0], sourceFirstPosition, 'R2_GPU_VIEW_MUTATED_LATER_VIEW');

let expectedIndexStart = 0;
for (const range of cachedA.drawRanges) {
  assert.equal(range.indexStart, expectedIndexStart, 'R2_DRAW_RANGE_GAP_OR_OVERLAP');
  expectedIndexStart += range.indexCount;
}
assert.equal(expectedIndexStart, cachedA.indexCount, 'R2_DRAW_RANGE_COVERAGE_INCOMPLETE');
assert.equal(cachedA.primitiveSpans.reduce((sum, span) => sum + span.indexCount, 0), cachedA.indexCount);
assert.equal(cachedA.buffers.indices.every((index) => index >= 0 && index < cachedA.vertexCount), true);

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R2A_FINAL_HEAD_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2A_PASS_CLOSED_FINAL_HEAD_VALIDATION',
  generatedAt: new Date().toISOString(),
  contractId: cachedA.contractId,
  packageIdentity: cachedA.packageIdentity,
  contentDigest: cachedA.contentDigest,
  counts: {
    primitiveCount: cachedA.primitiveCount,
    vertexCount: cachedA.vertexCount,
    triangleCount: cachedA.triangleCount,
    indexCount: cachedA.indexCount,
    drawRangeCount: cachedA.drawRanges.length,
    roleCounts: cachedA.roleCounts,
    normalSourceCounts: cachedA.normalSourceCounts
  },
  constructionMilliseconds: {
    explicitA: explicitA.constructionMilliseconds,
    explicitB: explicitB.constructionMilliseconds,
    cached: cachedA.constructionMilliseconds
  },
  closure: {
    run8ER2A: 'PASS_CLOSED',
    run8ER2B: 'NOT_STARTED',
    temporaryCorrectionScriptPresent: false,
    workflowReadOnly: true
  },
  boundaries: {
    cameraIndependent: cachedA.cameraIndependent,
    viewportIndependent: cachedA.viewportIndependent,
    webglContextCreated: cachedA.webglContextCreated,
    renderLoopCreated: cachedA.renderLoopCreated,
    publicRouteBound: cachedA.publicRouteBound,
    deploymentAuthority: cachedA.deploymentAuthority,
    run8ER2BStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  },
  deterministicIdentityAcrossExplicitBuilds: true,
  cachedObjectIdentityStable: true,
  copyOnRequestGpuViewsValidated: true,
  sourcePackageMutationFromGpuViews: false,
  issues: []
};

const outputDirectory = process.env.H_EARTH_RUN8E_R2_OUTPUT;
if (outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2a.final-head.validation.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
}
console.log(JSON.stringify(receipt, null, 2));
