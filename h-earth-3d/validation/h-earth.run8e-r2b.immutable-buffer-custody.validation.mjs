import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_RUN_8E_R2_CONTROL,
  evaluateHEarthRun8ER2Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js';
import {
  H_EARTH_RUN_8E_R2B_CONTROL,
  H_EARTH_RUN_8E_R2B_CONTRACT_ID,
  evaluateHEarthRun8ER2BControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2b.immutable-buffer-custody.js';
import {
  buildHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews,
  getHEarthRun8ER2ImmutableLiveRenderPackage
} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';

const R2A_RECEIPT_PATH = new URL(
  './run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
  import.meta.url
);
const r2aReceipt = JSON.parse(fs.readFileSync(R2A_RECEIPT_PATH, 'utf8'));
const BUFFER_KEYS = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters',
  'materialModelCodes',
  'surfaceClassCodes',
  'primitiveIndices',
  'roleCodes',
  'indices'
]);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(stableValue(value));
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function sha256Numbers(values) {
  const hash = crypto.createHash('sha256');
  const bytes = Buffer.allocUnsafe(8);
  for (const value of values) {
    bytes.writeDoubleLE(value, 0);
    hash.update(bytes);
  }
  return hash.digest('hex');
}

function createFNVWriter() {
  let hash = 0x811c9dc5;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const encoder = new TextEncoder();
  const byte = (value) => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  return {
    string(value) {
      for (const item of encoder.encode(String(value))) byte(item);
      byte(0xff);
    },
    numbers(values) {
      for (const value of values) {
        numberView.setFloat64(0, value, true);
        for (let index = 0; index < 8; index += 1) byte(numberView.getUint8(index));
      }
      byte(0xfe);
    },
    digest() {
      return hash.toString(16).padStart(8, '0');
    }
  };
}

function recomputePackageDigest(packageRecord) {
  const writer = createFNVWriter();
  writer.string(packageRecord.contractId);
  writer.string(packageRecord.sourceAuthorities.packet002TransferContractId);
  writer.string(packageRecord.sourceAuthorities.run8CMaterialContractId);
  writer.string(packageRecord.sourceAuthorities.atmosphereContractId);
  packageRecord.primitiveIds.forEach((primitiveId) => writer.string(primitiveId));
  BUFFER_KEYS.forEach((key) => writer.numbers(packageRecord.buffers[key]));
  return `fnv1a32:${writer.digest()}`;
}

function bufferDigests(packageRecord) {
  return Object.freeze(Object.fromEntries(
    BUFFER_KEYS.map((key) => [key, `sha256:${sha256Numbers(packageRecord.buffers[key])}`])
  ));
}

function auditFrozenGraph(value, label, seen = new WeakSet(), counts = { objects: 0, arrays: 0 }) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return counts;
  seen.add(value);
  assert.equal(Object.isFrozen(value), true, `R2B_MUTABLE_CUSTODY_SURFACE:${label}`);
  if (Array.isArray(value)) counts.arrays += 1;
  else counts.objects += 1;
  for (const [key, nested] of Object.entries(value)) {
    auditFrozenGraph(nested, `${label}.${key}`, seen, counts);
  }
  return counts;
}

function assertSourceArraysDistinct(left, right, label) {
  BUFFER_KEYS.forEach((key) => {
    assert.notEqual(left.buffers[key], right.buffers[key], `R2B_SOURCE_ARRAY_ALIAS:${label}:${key}`);
  });
}

function attemptFrozenSourceMutation(packageRecord) {
  let rejectedAssignmentCount = 0;
  let rejectedStructuralMutationCount = 0;
  for (const key of BUFFER_KEYS) {
    const source = packageRecord.buffers[key];
    const firstBefore = source[0];
    assert.throws(() => {
      source[0] = firstBefore === 0 ? 1 : 0;
    }, TypeError, `R2B_SOURCE_ASSIGNMENT_NOT_REJECTED:${key}`);
    rejectedAssignmentCount += 1;
    assert.throws(() => {
      source.push(firstBefore);
    }, TypeError, `R2B_SOURCE_PUSH_NOT_REJECTED:${key}`);
    rejectedStructuralMutationCount += 1;
    assert.equal(source[0], firstBefore, `R2B_SOURCE_MUTATED:${key}`);
  }
  const packageIdentityBefore = packageRecord.packageIdentity;
  assert.throws(() => {
    packageRecord.packageIdentity = 'MUTATED';
  }, TypeError, 'R2B_PACKAGE_RECORD_MUTATION_NOT_REJECTED');
  assert.equal(packageRecord.packageIdentity, packageIdentityBefore);
  const spanBefore = packageRecord.primitiveSpans[0].indexStart;
  assert.throws(() => {
    packageRecord.primitiveSpans[0].indexStart = spanBefore + 1;
  }, TypeError, 'R2B_PRIMITIVE_SPAN_MUTATION_NOT_REJECTED');
  assert.equal(packageRecord.primitiveSpans[0].indexStart, spanBefore);
  return { rejectedAssignmentCount, rejectedStructuralMutationCount, rejectedObjectMutationCount: 2 };
}

function mutateGpuViewsAndVerifyIsolation(sourcePackage) {
  const viewsA = createHEarthRun8ER2GPUBufferViews(sourcePackage);
  const viewsB = createHEarthRun8ER2GPUBufferViews(sourcePackage);
  assert.equal(Object.isFrozen(viewsA), true, 'R2B_GPU_VIEW_RECORD_NOT_FROZEN');
  assert.equal(Object.isFrozen(viewsB), true, 'R2B_GPU_VIEW_RECORD_NOT_FROZEN');
  assert.equal(new Set(BUFFER_KEYS.map((key) => viewsA[key].buffer)).size, BUFFER_KEYS.length,
    'R2B_GPU_VIEW_INTERNAL_ARRAY_BUFFER_ALIAS');
  assert.equal(new Set(BUFFER_KEYS.flatMap((key) => [viewsA[key].buffer, viewsB[key].buffer])).size,
    BUFFER_KEYS.length * 2, 'R2B_GPU_VIEW_CROSS_REQUEST_ARRAY_BUFFER_ALIAS');

  let mutationCount = 0;
  for (const key of BUFFER_KEYS) {
    const source = sourcePackage.buffers[key];
    const indices = [0, Math.floor(viewsA[key].length / 2), viewsA[key].length - 1];
    for (const index of indices) {
      const sourceBefore = source[index];
      const laterViewBefore = viewsB[key][index];
      const candidate = viewsA[key][index] === 0 ? 1 : 0;
      viewsA[key][index] = candidate;
      assert.equal(source[index], sourceBefore, `R2B_GPU_VIEW_MUTATED_SOURCE:${key}:${index}`);
      assert.equal(viewsB[key][index], laterViewBefore, `R2B_GPU_VIEW_MUTATED_LATER_VIEW:${key}:${index}`);
      mutationCount += 1;
    }
  }
  return {
    requestCount: 2,
    typedArrayCountPerRequest: BUFFER_KEYS.length,
    uniqueArrayBufferCount: BUFFER_KEYS.length * 2,
    mutationCount,
    sourceMutationCount: 0,
    laterViewMutationCount: 0
  };
}

assert.equal(r2aReceipt.status, 'RUN_8E_R2A_PASS_CLOSED');
assert.equal(r2aReceipt.checkpointDisposition.run8ER2B, 'NOT_STARTED');
assert.equal(r2aReceipt.validatedPackage.packageIdentity,
  'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25');
assert.equal(r2aReceipt.validatedPackage.contentDigest, 'fnv1a32:fd913c25');

const parentControl = evaluateHEarthRun8ER2Control(H_EARTH_RUN_8E_R2_CONTROL);
assert.equal(parentControl.eligible, true, `R2B_PARENT_CONTROL_FAILED:${parentControl.issues.join(',')}`);
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.boundedSubcheckpoints[0].currentStatus, 'PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2_CONTROL.boundedSubcheckpoints[1].currentStatus, 'NOT_STARTED');

const r2bControl = evaluateHEarthRun8ER2BControl(H_EARTH_RUN_8E_R2B_CONTROL);
assert.equal(r2bControl.eligible, true, `R2B_CONTROL_FAILED:${r2bControl.issues.join(',')}`);
assert.equal(H_EARTH_RUN_8E_R2B_CONTROL.currentStatus, 'EXECUTION_OPEN');

const explicitPackages = [0, 1, 2, 3].map((index) =>
  buildHEarthRun8ER2ImmutableLiveRenderPackage({
    packageOccurrenceId: `H_EARTH_RUN_8E_R2B_CUSTODY_RECONSTRUCTION_${index + 1}`
  })
);
explicitPackages.forEach((packageRecord, index) => {
  assert.equal(packageRecord.eligible, true, `R2B_EXPLICIT_BUILD_REJECTED:${index}`);
  assert.equal(packageRecord.packageIdentity, r2aReceipt.validatedPackage.packageIdentity);
  assert.equal(packageRecord.contentDigest, r2aReceipt.validatedPackage.contentDigest);
  assert.equal(recomputePackageDigest(packageRecord), packageRecord.contentDigest,
    `R2B_INDEPENDENT_DIGEST_MISMATCH:${index}`);
});
for (let left = 0; left < explicitPackages.length; left += 1) {
  for (let right = left + 1; right < explicitPackages.length; right += 1) {
    assert.notEqual(explicitPackages[left], explicitPackages[right], `R2B_PACKAGE_OBJECT_ALIAS:${left}:${right}`);
    assertSourceArraysDistinct(explicitPackages[left], explicitPackages[right], `${left}:${right}`);
  }
}
assert.equal(new Set(explicitPackages.map((item) => item.packageOccurrenceId)).size, explicitPackages.length);
assert.equal(new Set(explicitPackages.map((item) => item.packageIdentity)).size, 1);
assert.equal(new Set(explicitPackages.map((item) => item.contentDigest)).size, 1);

const explicitBufferDigests = explicitPackages.map(bufferDigests);
explicitBufferDigests.slice(1).forEach((digests, index) => {
  assert.deepEqual(digests, explicitBufferDigests[0], `R2B_BUFFER_DIGEST_DRIFT:${index + 1}`);
});

const cachedA = getHEarthRun8ER2ImmutableLiveRenderPackage();
const cachedB = getHEarthRun8ER2ImmutableLiveRenderPackage();
assert.equal(cachedA, cachedB, 'R2B_CACHED_PACKAGE_IDENTITY_UNSTABLE');
assert.equal(cachedA.packageIdentity, explicitPackages[0].packageIdentity);
assert.equal(cachedA.contentDigest, explicitPackages[0].contentDigest);
assert.deepEqual(bufferDigests(cachedA), explicitBufferDigests[0]);

const frozenGraphCounts = auditFrozenGraph(cachedA, 'package');
const sourceMutationEvidence = attemptFrozenSourceMutation(cachedA);
const gpuViewIsolation = mutateGpuViewsAndVerifyIsolation(cachedA);
assert.equal(recomputePackageDigest(cachedA), r2aReceipt.validatedPackage.contentDigest,
  'R2B_SOURCE_DIGEST_CHANGED_AFTER_MUTATION_ATTEMPTS');

const postMutationPackage = buildHEarthRun8ER2ImmutableLiveRenderPackage({
  packageOccurrenceId: 'H_EARTH_RUN_8E_R2B_POST_MUTATION_RECONSTRUCTION'
});
assert.equal(postMutationPackage.packageIdentity, r2aReceipt.validatedPackage.packageIdentity);
assert.equal(postMutationPackage.contentDigest, r2aReceipt.validatedPackage.contentDigest);
assert.deepEqual(bufferDigests(postMutationPackage), explicitBufferDigests[0]);
assertSourceArraysDistinct(cachedA, postMutationPackage, 'CACHED:POST_MUTATION');

const custodyManifest = {
  contractId: H_EARTH_RUN_8E_R2B_CONTRACT_ID,
  predecessorHead: H_EARTH_RUN_8E_R2B_CONTROL.predecessor.exactHead,
  packageIdentity: cachedA.packageIdentity,
  contentDigest: cachedA.contentDigest,
  primitiveIdsDigest: `sha256:${sha256Text(stableJson(cachedA.primitiveIds))}`,
  primitiveSpansDigest: `sha256:${sha256Text(stableJson(cachedA.primitiveSpans))}`,
  drawRangesDigest: `sha256:${sha256Text(stableJson(cachedA.drawRanges))}`,
  environmentDefaultsDigest: `sha256:${sha256Text(stableJson(cachedA.environmentDefaults))}`,
  sourceAuthoritiesDigest: `sha256:${sha256Text(stableJson(cachedA.sourceAuthorities))}`,
  bufferDigests: explicitBufferDigests[0]
};
const custodyManifestDigest = `sha256:${sha256Text(stableJson(custodyManifest))}`;

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R2B_IMMUTABLE_BUFFER_CUSTODY_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2B_EXECUTION_PASS',
  generatedAt: new Date().toISOString(),
  contractId: H_EARTH_RUN_8E_R2B_CONTRACT_ID,
  predecessor: {
    checkpoint: 'RUN_8E_R2A',
    status: 'PASS_CLOSED',
    exactHead: H_EARTH_RUN_8E_R2B_CONTROL.predecessor.exactHead
  },
  deterministicConstruction: {
    explicitReconstructionCount: explicitPackages.length,
    postMutationReconstructionCount: 1,
    distinctPackageObjects: true,
    distinctSourceArraysAcrossBuilds: true,
    occurrenceIdentityIndependentFromContentIdentity: true,
    packageIdentity: cachedA.packageIdentity,
    contentDigest: cachedA.contentDigest,
    independentlyRecomputedContentDigest: recomputePackageDigest(cachedA),
    independentDigestMatch: true
  },
  immutableCustody: {
    sourceBufferCount: BUFFER_KEYS.length,
    frozenGraphObjectCount: frozenGraphCounts.objects,
    frozenGraphArrayCount: frozenGraphCounts.arrays,
    deepFrozenCustodySurfaces: true,
    ...sourceMutationEvidence
  },
  gpuViewIsolation,
  custodyManifest,
  custodyManifestDigest,
  corpus: {
    primitiveCount: cachedA.primitiveCount,
    vertexCount: cachedA.vertexCount,
    triangleCount: cachedA.triangleCount,
    indexCount: cachedA.indexCount
  },
  boundaries: {
    packageSourceMutated: false,
    sourceAuthorityCorrespondenceDispositionIssued: false,
    gpuResourceCreated: false,
    webglContextCreated: false,
    renderLoopCreated: false,
    publicRouteBound: false,
    run8ER2CStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  },
  issues: []
};

const outputDirectory = process.env.H_EARTH_RUN8E_R2B_OUTPUT;
if (outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2b.immutable-buffer-custody.validation.receipt.json'),
    `${JSON.stringify(receipt, null, 2)}\n`
  );
}
console.log(JSON.stringify(receipt, null, 2));
