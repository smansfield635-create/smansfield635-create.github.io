import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {
  H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
  createHEarthRun8ER2DCanonicalGPUUploadViews,
  evaluateHEarthRun8ER2DCanonicalGPUUploadViews
} from '../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import {
  H_EARTH_RUN_8E_R2D_CONTRACT_ID,
  H_EARTH_RUN_8E_R2D_CONTROL,
  evaluateHEarthRun8ER2DControl
} from '../../control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js';

const KEYS = Object.freeze([
  'positions', 'normals', 'baseColorsLinear', 'materialParameters',
  'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
]);
const canvas = document.querySelector('canvas');
const statusNode = document.querySelector('[data-r2d-status]');
const receiptNode = document.querySelector('[data-r2d-receipt]');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const status = (message) => { if (statusNode) statusNode.textContent = message; };

async function sha256(view) {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const value = await crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${Array.from(new Uint8Array(value), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

async function digests(views) {
  const output = {};
  for (const key of KEYS) output[key] = await sha256(views[key]);
  return output;
}

function assertNoError(gl, stage) {
  const error = gl.getError();
  assert(error === gl.NO_ERROR, `R2D_WEBGL_ERROR:${stage}:${error}`);
}

function upload(gl, cycleId, packageRecord) {
  const views = createHEarthRun8ER2DCanonicalGPUUploadViews(packageRecord);
  const evaluation = evaluateHEarthRun8ER2DCanonicalGPUUploadViews(views);
  assert(evaluation.eligible, `R2D_CANONICAL_VIEW_INVALID:${evaluation.issues.join(',')}`);
  const resources = [];
  let totalByteLength = 0;
  for (const key of KEYS) {
    const view = views[key];
    const target = key === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    const buffer = gl.createBuffer();
    assert(buffer, `R2D_CREATE_BUFFER_FAILED:${cycleId}:${key}`);
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, view, gl.STATIC_DRAW);
    assertNoError(gl, `${cycleId}:UPLOAD:${key}`);
    const gpuByteLength = gl.getBufferParameter(target, gl.BUFFER_SIZE);
    const usage = gl.getBufferParameter(target, gl.BUFFER_USAGE);
    assert(gpuByteLength === view.byteLength, `R2D_GPU_SIZE:${cycleId}:${key}`);
    assert(usage === gl.STATIC_DRAW, `R2D_GPU_USAGE:${cycleId}:${key}`);
    assert(gl.isBuffer(buffer), `R2D_GPU_RECOGNITION:${cycleId}:${key}`);
    resources.push({
      key,
      buffer,
      targetName: key === 'indices' ? 'ELEMENT_ARRAY_BUFFER' : 'ARRAY_BUFFER',
      typedArrayConstructor: view.constructor.name,
      elementCount: view.length,
      byteLength: view.byteLength,
      gpuByteLength,
      usageName: 'STATIC_DRAW'
    });
    totalByteLength += view.byteLength;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.finish();
  assertNoError(gl, `${cycleId}:FINISH`);
  return { cycleId, views, resources, totalByteLength };
}

function dispose(gl, cycle) {
  for (const resource of cycle.resources) gl.deleteBuffer(resource.buffer);
  gl.finish();
  assertNoError(gl, `${cycle.cycleId}:DELETE`);
  const recognizedAfterDelete = cycle.resources.filter(({ buffer }) => gl.isBuffer(buffer)).length;
  assert(recognizedAfterDelete === 0, `R2D_DELETE_FAILED:${cycle.cycleId}`);
  return { deletedResourceCount: cycle.resources.length, recognizedAfterDelete, pass: true };
}

function waitForLoss(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('R2D_CONTEXT_LOSS_TIMEOUT')), timeoutMs);
    canvas.addEventListener('webglcontextlost', (event) => {
      clearTimeout(timer);
      event.preventDefault();
      resolve(event.defaultPrevented);
    }, { once: true });
  });
}

function waitForRestore(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('R2D_CONTEXT_RESTORE_TIMEOUT')), timeoutMs);
    canvas.addEventListener('webglcontextrestored', () => {
      clearTimeout(timer);
      resolve(true);
    }, { once: true });
  });
}

function serialize(cycle, deletion) {
  return {
    cycleId: cycle.cycleId,
    resourceCount: cycle.resources.length,
    arrayBufferCount: cycle.resources.filter(({ targetName }) => targetName === 'ARRAY_BUFFER').length,
    elementArrayBufferCount: cycle.resources.filter(({ targetName }) => targetName === 'ELEMENT_ARRAY_BUFFER').length,
    totalByteLength: cycle.totalByteLength,
    resources: cycle.resources.map(({ key, targetName, typedArrayConstructor, elementCount, byteLength, gpuByteLength, usageName }) => ({
      key, targetName, typedArrayConstructor, elementCount, byteLength, gpuByteLength, usageName
    })),
    deletion
  };
}

async function run() {
  status('Running canonical GPU upload lifecycle.');
  const control = evaluateHEarthRun8ER2DControl(H_EARTH_RUN_8E_R2D_CONTROL);
  assert(control.eligible, `R2D_CONTROL:${control.issues.join(',')}`);
  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  assert(packageRecord.eligible, 'R2D_PACKAGE_NOT_ELIGIBLE');
  const sourceObject = packageRecord;
  const beforeViews = createHEarthRun8ER2DCanonicalGPUUploadViews(packageRecord);
  const beforeEvaluation = evaluateHEarthRun8ER2DCanonicalGPUUploadViews(beforeViews);
  assert(beforeEvaluation.eligible, `R2D_CANONICAL_SOURCE:${beforeEvaluation.issues.join(',')}`);
  const beforeDigests = await digests(beforeViews);

  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: false, preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false, powerPreference: 'default'
  });
  assert(gl, 'R2D_WEBGL2_UNAVAILABLE');
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const loseContext = gl.getExtension('WEBGL_lose_context');
  assert(loseContext, 'R2D_LOSE_CONTEXT_EXTENSION_UNAVAILABLE');

  const forbiddenMethods = [
    'createShader', 'createProgram', 'createVertexArray', 'createTexture',
    'createFramebuffer', 'createRenderbuffer', 'drawArrays', 'drawElements',
    'drawArraysInstanced', 'drawElementsInstanced'
  ];
  const forbiddenCallCounts = Object.fromEntries(forbiddenMethods.map((name) => [name, 0]));
  for (const name of forbiddenMethods) {
    const original = gl[name];
    if (typeof original !== 'function') continue;
    gl[name] = function tracked(...args) {
      forbiddenCallCounts[name] += 1;
      return original.apply(this, args);
    };
  }

  const first = upload(gl, 'UPLOAD_CYCLE_1', packageRecord);
  const firstDeletion = dispose(gl, first);
  const second = upload(gl, 'UPLOAD_CYCLE_2', packageRecord);
  assert(second.resources.every((resource, index) => resource.buffer !== first.resources[index].buffer),
    'R2D_BUFFER_OBJECT_REUSE');
  const secondDeletion = dispose(gl, second);

  const lossPromise = waitForLoss();
  loseContext.loseContext();
  const lossDefaultPrevented = await lossPromise;
  assert(gl.isContextLost(), 'R2D_CONTEXT_NOT_LOST');
  const restorePromise = waitForRestore();
  loseContext.restoreContext();
  await restorePromise;
  assert(!gl.isContextLost(), 'R2D_CONTEXT_NOT_RESTORED');
  assertNoError(gl, 'RESTORED');

  const restored = upload(gl, 'UPLOAD_CYCLE_3_AFTER_CONTEXT_RESTORE', packageRecord);
  const restoredDeletion = dispose(gl, restored);
  const afterPackage = getHEarthRun8ER2ImmutableLiveRenderPackage();
  const afterViews = createHEarthRun8ER2DCanonicalGPUUploadViews(afterPackage);
  const afterDigests = await digests(afterViews);
  assert(afterPackage === sourceObject, 'R2D_PACKAGE_OBJECT_CHANGED');
  assert(JSON.stringify(beforeDigests) === JSON.stringify(afterDigests), 'R2D_CANONICAL_DIGEST_CHANGED');
  assert(Object.values(forbiddenCallCounts).every((count) => count === 0), 'R2D_FORBIDDEN_WEBGL_CALL');

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R2D_CANONICAL_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R2D_CANONICAL_GPU_RESOURCE_LIFECYCLE_PASS',
    generatedAt: new Date().toISOString(),
    contractId: H_EARTH_RUN_8E_R2D_CONTRACT_ID,
    gpuUploadViewContractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
    runtimePackageIdentity: packageRecord.packageIdentity,
    runtimeContentDigest: packageRecord.contentDigest,
    canonicalUploadDigestsBefore: beforeDigests,
    canonicalUploadDigestsAfter: afterDigests,
    canonicalUploadDigestsStable: true,
    canonicalizationReceipt: beforeViews.canonicalizationReceipt,
    context: {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
      unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      restoreDelayMilliseconds: window.__H_EARTH_RUN_8E_R2D_RESTORE_DELAY_MILLISECONDS__ ?? null
    },
    lifecycle: {
      first: serialize(first, firstDeletion),
      second: serialize(second, secondDeletion),
      restored: serialize(restored, restoredDeletion),
      contextLossObserved: true,
      contextLossDefaultPrevented: lossDefaultPrevented,
      contextRestoreObserved: true,
      totalCreatedBufferCount: 27,
      totalDeletedBufferCount: 27
    },
    forbiddenCallCounts,
    shaderOrProgramCreated: false,
    drawCallCount: 0,
    visiblePresentationCreated: false,
    renderLoopCreated: false,
    ciPerformanceAuthority: false,
    issues: []
  };
  window.__H_EARTH_RUN_8E_R2D_RESULT__ = { ok: true, receipt };
  receiptNode.textContent = JSON.stringify(receipt, null, 2);
  status('Canonical GPU upload lifecycle complete.');
}

run().catch((error) => {
  const failure = {
    ok: false,
    error: error?.message ?? String(error),
    stack: error?.stack ?? null,
    generatedAt: new Date().toISOString()
  };
  window.__H_EARTH_RUN_8E_R2D_RESULT__ = failure;
  receiptNode.textContent = JSON.stringify(failure, null, 2);
  status(`R2D canonical probe failed: ${failure.error}`);
});
