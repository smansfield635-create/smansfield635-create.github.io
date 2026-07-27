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

const control = evaluateHEarthRun8ER2Control(H_EARTH_RUN_8E_R2_CONTROL);
assert.equal(control.eligible, true, `R2_CONTROL_FAILED:${control.issues.join(',')}`);

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
assert.equal(Object.isFrozen(cachedA), true, 'R2_PACKAGE_NOT_FROZEN');
assert.equal(Object.isFrozen(cachedA.buffers), true, 'R2_BUFFER_RECORD_NOT_FROZEN');
Object.values(cachedA.buffers).forEach((buffer) => assert.equal(Object.isFrozen(buffer), true, 'R2_SOURCE_BUFFER_NOT_FROZEN'));

assert.equal(cachedA.contractId, H_EARTH_RUN_8E_R2_CONTRACT_ID);
assert.equal(cachedA.primitiveCount, 35);
assert.equal(cachedA.roleCounts.TERRAIN, 1);
assert.equal(cachedA.roleCounts.SHORELINE, 7);
assert.equal(cachedA.roleCounts.VEGETATION, 27);
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
  receiptType: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_PASS',
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
  boundaries: {
    cameraIndependent: cachedA.cameraIndependent,
    viewportIndependent: cachedA.viewportIndependent,
    webglContextCreated: cachedA.webglContextCreated,
    renderLoopCreated: cachedA.renderLoopCreated,
    publicRouteBound: cachedA.publicRouteBound,
    deploymentAuthority: cachedA.deploymentAuthority,
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
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2.validation.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
}
console.log(JSON.stringify(receipt, null, 2));
