import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from '../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {
  H_EARTH_RUN_8E_R2D_CONTRACT_ID,
  H_EARTH_RUN_8E_R2D_CONTROL,
  evaluateHEarthRun8ER2DControl
} from '../../control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js';

const EXPECTED_PACKAGE_IDENTITY = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25';
const EXPECTED_CONTENT_DIGEST = 'fnv1a32:fd913c25';
const VIEW_KEYS = Object.freeze([
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

const statusElement = document.querySelector('[data-r2d-status]');
const receiptElement = document.querySelector('[data-r2d-receipt]');
const canvas = document.querySelector('canvas');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const setStatus = (value) => {
  if (statusElement) statusElement.textContent = value;
};

async function sha256TypedArray(view) {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')}`;
}

async function digestViews(views) {
  const result = {};
  for (const key of VIEW_KEYS) result[key] = await sha256TypedArray(views[key]);
  return result;
}

function instrumentForbiddenCalls(gl) {
  const methods = [
    'createShader', 'createProgram', 'createVertexArray', 'createTexture',
    'createFramebuffer', 'createRenderbuffer', 'drawArrays', 'drawElements',
    'drawArraysInstanced', 'drawElementsInstanced'
  ];
  const counts = Object.fromEntries(methods.map((method) => [method, 0]));
  for (const method of methods) {
    const original = gl[method];
    if (typeof original !== 'function') continue;
    gl[method] = function instrumentedForbiddenMethod(...args) {
      counts[method] += 1;
      return original.apply(this, args);
    };
  }
  return counts;
}

function webglErrorName(gl, code) {
  const names = new Map([
    [gl.NO_ERROR, 'NO_ERROR'],
    [gl.INVALID_ENUM, 'INVALID_ENUM'],
    [gl.INVALID_VALUE, 'INVALID_VALUE'],
    [gl.INVALID_OPERATION, 'INVALID_OPERATION'],
    [gl.INVALID_FRAMEBUFFER_OPERATION, 'INVALID_FRAMEBUFFER_OPERATION'],
    [gl.OUT_OF_MEMORY, 'OUT_OF_MEMORY'],
    [gl.CONTEXT_LOST_WEBGL, 'CONTEXT_LOST_WEBGL']
  ]);
  return names.get(code) ?? `UNKNOWN_${code}`;
}

function requireNoError(gl, stage) {
  const error = gl.getError();
  assert(error === gl.NO_ERROR, `R2D_WEBGL_ERROR:${stage}:${webglErrorName(gl, error)}`);
}

function createUploadCycle(gl, cycleId, packageRecord) {
  const views = createHEarthRun8ER2GPUBufferViews(packageRecord);
  const resources = [];
  let totalByteLength = 0;
  let arrayBufferCount = 0;
  let elementArrayBufferCount = 0;

  for (const key of VIEW_KEYS) {
    const view = views[key];
    const target = key === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    const targetName = key === 'indices' ? 'ELEMENT_ARRAY_BUFFER' : 'ARRAY_BUFFER';
    const buffer = gl.createBuffer();
    assert(buffer, `R2D_CREATE_BUFFER_FAILED:${cycleId}:${key}`);
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, view, gl.STATIC_DRAW);
    requireNoError(gl, `${cycleId}:UPLOAD:${key}`);
    const gpuByteLength = gl.getBufferParameter(target, gl.BUFFER_SIZE);
    const gpuUsage = gl.getBufferParameter(target, gl.BUFFER_USAGE);
    assert(gpuByteLength === view.byteLength,
      `R2D_GPU_BYTE_LENGTH_MISMATCH:${cycleId}:${key}:${gpuByteLength}:${view.byteLength}`);
    assert(gpuUsage === gl.STATIC_DRAW, `R2D_GPU_USAGE_MISMATCH:${cycleId}:${key}:${gpuUsage}`);
    assert(gl.isBuffer(buffer), `R2D_GPU_BUFFER_NOT_RECOGNIZED:${cycleId}:${key}`);
    resources.push({
      key,
      target,
      targetName,
      buffer,
      typedArrayConstructor: view.constructor.name,
      elementCount: view.length,
      byteLength: view.byteLength,
      gpuByteLength,
      usageName: 'STATIC_DRAW'
    });
    totalByteLength += view.byteLength;
    if (target === gl.ELEMENT_ARRAY_BUFFER) elementArrayBufferCount += 1;
    else arrayBufferCount += 1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.finish();
  requireNoError(gl, `${cycleId}:FINISH`);

  return {
    cycleId,
    views,
    resources,
    summary: {
      resourceCount: resources.length,
      arrayBufferCount,
      elementArrayBufferCount,
      totalByteLength,
      allRecognizedBeforeDelete: resources.every(({ buffer }) => gl.isBuffer(buffer))
    }
  };
}

function deleteUploadCycle(gl, cycle) {
  for (const resource of cycle.resources) gl.deleteBuffer(resource.buffer);
  gl.finish();
  requireNoError(gl, `${cycle.cycleId}:DELETE`);
  const remaining = cycle.resources.filter(({ buffer }) => gl.isBuffer(buffer));
  assert(remaining.length === 0, `R2D_BUFFER_DELETE_FAILED:${cycle.cycleId}:${remaining.map(({ key }) => key).join(',')}`);
  return {
    deletedResourceCount: cycle.resources.length,
    recognizedAfterDeleteCount: remaining.length,
    deletePass: remaining.length === 0
  };
}

function waitForContextLoss(canvasElement, timeoutMilliseconds = 5000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('R2D_CONTEXT_LOSS_EVENT_TIMEOUT')), timeoutMilliseconds);
    canvasElement.addEventListener('webglcontextlost', (event) => {
      clearTimeout(timeout);
      event.preventDefault();
      resolve({ defaultPrevented: event.defaultPrevented });
    }, { once: true });
  });
}

function waitForContextRestore(canvasElement, timeoutMilliseconds = 8000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('R2D_CONTEXT_RESTORE_EVENT_TIMEOUT')), timeoutMilliseconds);
    canvasElement.addEventListener('webglcontextrestored', () => {
      clearTimeout(timeout);
      resolve(true);
    }, { once: true });
  });
}

async function runProbe() {
  setStatus('R2D resource lifecycle probe running.');
  const control = evaluateHEarthRun8ER2DControl(H_EARTH_RUN_8E_R2D_CONTROL);
  assert(control.eligible === true, `R2D_CONTROL_FAILED:${control.issues.join(',')}`);

  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  assert(packageRecord.eligible === true, 'R2D_PACKAGE_NOT_ELIGIBLE');
  const predecessorPackageIdentityMatch = packageRecord.packageIdentity === EXPECTED_PACKAGE_IDENTITY;
  const predecessorContentDigestMatch = packageRecord.contentDigest === EXPECTED_CONTENT_DIGEST;

  const sourceObject = packageRecord;
  const beforeViews = createHEarthRun8ER2GPUBufferViews(packageRecord);
  const beforeDigests = await digestViews(beforeViews);

  const contextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
  };
  const gl = canvas.getContext('webgl2', contextAttributes);
  assert(gl, 'R2D_WEBGL2_CONTEXT_UNAVAILABLE');
  const forbiddenCallCounts = instrumentForbiddenCalls(gl);
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const loseContextExtension = gl.getExtension('WEBGL_lose_context');
  assert(loseContextExtension, 'R2D_WEBGL_LOSE_CONTEXT_EXTENSION_UNAVAILABLE');

  const context = {
    created: true,
    lostAtStart: gl.isContextLost(),
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
    unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    maximumVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maximumElementIndex: gl.getParameter(gl.MAX_ELEMENT_INDEX),
    contextAttributes: gl.getContextAttributes(),
    loseContextExtensionAvailable: true
  };
  assert(context.lostAtStart === false, 'R2D_CONTEXT_LOST_AT_START');

  const first = createUploadCycle(gl, 'UPLOAD_CYCLE_1', packageRecord);
  const firstDeletion = deleteUploadCycle(gl, first);

  const second = createUploadCycle(gl, 'UPLOAD_CYCLE_2', packageRecord);
  const distinctFromFirst = second.resources.every((resource, index) =>
    resource.buffer !== first.resources[index].buffer);
  assert(distinctFromFirst, 'R2D_SECOND_CYCLE_BUFFER_OBJECT_REUSE');
  const secondDeletion = deleteUploadCycle(gl, second);

  const lossPromise = waitForContextLoss(canvas);
  loseContextExtension.loseContext();
  const lossEvent = await lossPromise;
  assert(gl.isContextLost(), 'R2D_CONTEXT_NOT_LOST_AFTER_EVENT');

  const restorePromise = waitForContextRestore(canvas);
  loseContextExtension.restoreContext();
  await restorePromise;
  assert(!gl.isContextLost(), 'R2D_CONTEXT_STILL_LOST_AFTER_RESTORE');
  requireNoError(gl, 'POST_CONTEXT_RESTORE');

  const restored = createUploadCycle(gl, 'UPLOAD_CYCLE_3_AFTER_CONTEXT_RESTORE', packageRecord);
  const restoredDeletion = deleteUploadCycle(gl, restored);

  const afterPackage = getHEarthRun8ER2ImmutableLiveRenderPackage();
  const afterViews = createHEarthRun8ER2GPUBufferViews(afterPackage);
  const afterDigests = await digestViews(afterViews);
  assert(afterPackage === sourceObject, 'R2D_CACHED_PACKAGE_OBJECT_CHANGED');
  assert(afterPackage.packageIdentity === packageRecord.packageIdentity, 'R2D_RUNTIME_PACKAGE_IDENTITY_CHANGED');
  assert(afterPackage.contentDigest === packageRecord.contentDigest, 'R2D_RUNTIME_PACKAGE_DIGEST_CHANGED');
  assert(JSON.stringify(afterDigests) === JSON.stringify(beforeDigests), 'R2D_SOURCE_BUFFER_DIGESTS_CHANGED');

  const forbiddenTotal = Object.values(forbiddenCallCounts).reduce((sum, value) => sum + value, 0);
  assert(forbiddenTotal === 0, `R2D_FORBIDDEN_WEBGL_CALL_OBSERVED:${JSON.stringify(forbiddenCallCounts)}`);

  const serializeCycle = (cycle, deletion) => ({
    cycleId: cycle.cycleId,
    resourceCount: cycle.summary.resourceCount,
    arrayBufferCount: cycle.summary.arrayBufferCount,
    elementArrayBufferCount: cycle.summary.elementArrayBufferCount,
    totalByteLength: cycle.summary.totalByteLength,
    allRecognizedBeforeDelete: cycle.summary.allRecognizedBeforeDelete,
    resources: cycle.resources.map(({ key, targetName, typedArrayConstructor, elementCount, byteLength, gpuByteLength, usageName }) => ({
      key,
      targetName,
      typedArrayConstructor,
      elementCount,
      byteLength,
      gpuByteLength,
      usageName
    })),
    deletion
  });

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R2D_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R2D_GPU_RESOURCE_LIFECYCLE_PASS_RUNTIME_IDENTITY_RECORDED',
    generatedAt: new Date().toISOString(),
    contractId: H_EARTH_RUN_8E_R2D_CONTRACT_ID,
    expectedPredecessorPackageIdentity: EXPECTED_PACKAGE_IDENTITY,
    expectedPredecessorContentDigest: EXPECTED_CONTENT_DIGEST,
    runtimePackageIdentity: packageRecord.packageIdentity,
    runtimeContentDigest: packageRecord.contentDigest,
    predecessorPackageIdentityMatch,
    predecessorContentDigestMatch,
    sourceBufferDigestsBefore: beforeDigests,
    sourceBufferDigestsAfter: afterDigests,
    sourceBufferDigestsStable: true,
    cachedPackageObjectStable: true,
    context,
    lifecycle: {
      cycleCount: 3,
      first: serializeCycle(first, firstDeletion),
      second: serializeCycle(second, secondDeletion),
      restored: serializeCycle(restored, restoredDeletion),
      secondCycleBufferObjectsDistinctFromFirst: distinctFromFirst,
      contextLossObserved: true,
      contextLossDefaultPrevented: lossEvent.defaultPrevented,
      contextRestoreObserved: true,
      contextRestored: !gl.isContextLost(),
      totalCreatedBufferCount: first.resources.length + second.resources.length + restored.resources.length,
      totalDeletedBufferCount: firstDeletion.deletedResourceCount + secondDeletion.deletedResourceCount + restoredDeletion.deletedResourceCount
    },
    forbiddenCallCounts,
    shaderOrProgramCreated: false,
    vertexArrayTextureFramebufferOrRenderbufferCreated: false,
    drawCallCount: 0,
    visiblePresentationCreated: false,
    renderLoopCreated: false,
    ciPerformanceAuthority: false,
    physicalMobilePerformanceAuthority: false,
    issues: predecessorPackageIdentityMatch && predecessorContentDigestMatch
      ? []
      : ['FLOAT64_PACKAGE_IDENTITY_DIFFERS_FROM_NODE_PREDECESSOR_PENDING_TYPED_UPLOAD_BYTE_COMPARISON']
  };

  window.__H_EARTH_RUN_8E_R2D_RESULT__ = { ok: true, receipt };
  if (receiptElement) receiptElement.textContent = JSON.stringify(receipt, null, 2);
  setStatus('R2D GPU resource lifecycle probe complete.');
}

runProbe().catch((error) => {
  const failure = {
    ok: false,
    error: error?.message ?? String(error),
    stack: error?.stack ?? null,
    generatedAt: new Date().toISOString()
  };
  window.__H_EARTH_RUN_8E_R2D_RESULT__ = failure;
  if (receiptElement) receiptElement.textContent = JSON.stringify(failure, null, 2);
  setStatus(`R2D probe failed: ${failure.error}`);
});
