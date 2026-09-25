import {
  buildHEarthRun8ENeutralPackage,
  constructHEarthRun8ESuccessorEnvironmentFrame,
  prepareHEarthRun8ERenderPlan,
  rasterizeHEarthRun8ERenderPlan
} from '../../render/run8e-successor-environment.js';
import { admitHEarthPrimitiveBatch } from '../../render/geometry-kernel.js';
import { buildHEarthRun8CTerrainMaterialLightingPresentation } from '../../render/lighting-material-successor-terrain.run8c.js';
import { rasterizeHEarthFunctionalLandscapePlan } from '../../render/renderer.functional-landscape.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import { buildHEarthRun8EPacket002SuccessorTransfer } from '../../../../../h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js';

const $ = (selector) => document.querySelector(selector);
const output = $('#profile-output');
const stateNode = $('#profile-state');
const liveFrame = $('#live-frame');
const runButton = $('#run-probes');
const startButton = $('#start-physical');
const stopButton = $('#stop-physical');
const copyButton = $('#copy-receipt');
const downloadButton = $('#download-receipt');
const gpuCanvas = $('#gpu-probe-canvas');

const clone = (value) => JSON.parse(JSON.stringify(value));
const nowIso = () => new Date().toISOString();
const round = (value, digits = 3) => Number(Number(value ?? 0).toFixed(digits));
const memoryUsed = () => Number(performance.memory?.usedJSHeapSize ?? 0);
const measure = async (operation) => {
  const startedAt = performance.now();
  const value = await operation();
  return { value, durationMilliseconds: performance.now() - startedAt };
};

function cameraFromState({ cameraStateId, x, z, yawDegrees, pitchDegrees, verticalFovDegrees = 56, height = 2.25 }) {
  const terrain = sampleHEarthRun8BSuccessorTerrainField(x, z);
  if (terrain?.valid !== true) throw new Error(`R1_CAMERA_TERRAIN_INVALID:${cameraStateId}`);
  const position = { x, y: terrain.elevation + height, z };
  const yaw = yawDegrees * Math.PI / 180;
  const pitch = pitchDegrees * Math.PI / 180;
  const horizontal = Math.cos(pitch);
  const distance = 18;
  const direction = {
    x: Math.sin(yaw) * horizontal,
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * horizontal
  };
  return {
    cameraStateId,
    position,
    target: {
      x: position.x + direction.x * distance,
      y: position.y + direction.y * distance,
      z: position.z + direction.z * distance
    },
    up: { x: 0, y: 1, z: 0 },
    nearPlane: 0.25,
    farPlane: 512,
    verticalFovDegrees,
    diagnosticOnly: cameraStateId === 'OVERHEAD_OBLIQUE'
  };
}

const CAMERA_STATES = Object.freeze([
  cameraFromState({ cameraStateId: 'COASTAL_ENTRY', x: 0, z: -96, yawDegrees: 0, pitchDegrees: -8 }),
  cameraFromState({ cameraStateId: 'INLAND_HILL', x: 72, z: -172, yawDegrees: 18, pitchDegrees: -8 }),
  cameraFromState({ cameraStateId: 'MOUNTAIN_FACING', x: 0, z: -188, yawDegrees: 0, pitchDegrees: 4 }),
  cameraFromState({ cameraStateId: 'OVERHEAD_OBLIQUE', x: 40, z: -176, yawDegrees: -24, pitchDegrees: -35, height: 72 }),
  cameraFromState({ cameraStateId: 'SHORELINE_RETURN', x: 0, z: -142, yawDegrees: 180, pitchDegrees: -7 })
]);

function normalizeVector(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return vector.map((value) => value / length);
}

function cross(left, right) {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0]
  ];
}

function dot(left, right) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function multiplyMatrices(left, right) {
  const output = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      output[column * 4 + row] =
        left[0 * 4 + row] * right[column * 4 + 0] +
        left[1 * 4 + row] * right[column * 4 + 1] +
        left[2 * 4 + row] * right[column * 4 + 2] +
        left[3 * 4 + row] * right[column * 4 + 3];
    }
  }
  return output;
}

function viewProjection(camera, aspect = 1.6) {
  const eye = [camera.position.x, camera.position.y, camera.position.z];
  const target = [camera.target.x, camera.target.y, camera.target.z];
  const forward = normalizeVector([target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]]);
  const right = normalizeVector(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const view = new Float32Array([
    right[0], up[0], -forward[0], 0,
    right[1], up[1], -forward[1], 0,
    right[2], up[2], -forward[2], 0,
    -dot(right, eye), -dot(up, eye), dot(forward, eye), 1
  ]);
  const f = 1 / Math.tan(camera.verticalFovDegrees * Math.PI / 360);
  const near = camera.nearPlane;
  const far = camera.farPlane;
  const projection = new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0
  ]);
  return multiplyMatrices(projection, view);
}

function flattenFrame(frame) {
  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];
  let vertexOffset = 0;
  for (const primitive of frame.primitives) {
    const vertices = primitive.geometry?.vertices ?? [];
    const primitiveNormals = primitive.geometry?.normals ?? [];
    const color = primitive.renderMaterial?.rgba ?? [116, 103, 73, 255];
    for (let index = 0; index < vertices.length; index += 1) {
      const vertex = vertices[index];
      const normal = primitiveNormals[index] ?? { x: 0, y: 1, z: 0 };
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x ?? 0, normal.y ?? 1, normal.z ?? 0);
      colors.push(color[0] / 255, color[1] / 255, color[2] / 255, 1);
    }
    for (const index of primitive.geometry?.indices ?? []) indices.push(vertexOffset + index);
    vertexOffset += vertices.length;
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: new Uint32Array(indices)
  };
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`R1_WEBGL_SHADER_FAILED:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, `#version 300 es
    precision highp float;
    layout(location=0) in vec3 aPosition;
    layout(location=1) in vec3 aNormal;
    layout(location=2) in vec4 aColor;
    uniform mat4 uViewProjection;
    uniform vec3 uSunDirection;
    out vec4 vColor;
    void main() {
      float diffuse = max(dot(normalize(aNormal), normalize(uSunDirection)), 0.0);
      float light = 0.34 + diffuse * 0.66;
      vColor = vec4(aColor.rgb * light, 1.0);
      gl_Position = uViewProjection * vec4(aPosition, 1.0);
    }
  `);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float;
    in vec4 vColor;
    out vec4 outColor;
    void main() { outColor = vColor; }
  `);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`R1_WEBGL_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

async function runWebGLProbe(flattened) {
  const gl = gpuCanvas.getContext('webgl2', { alpha: false, antialias: false, depth: true });
  if (!gl) return { candidateId: 'CANDIDATE_C_CACHED_WORLD_WEBGL_2_GPU_PROBE', available: false, results: [] };
  const program = createProgram(gl);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const attributes = [flattened.positions, flattened.normals, flattened.colors];
  attributes.forEach((data, location) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, location === 2 ? 4 : 3, gl.FLOAT, false, 0, 0);
  });
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, flattened.indices, gl.STATIC_DRAW);
  gl.useProgram(program);
  gl.uniform3f(gl.getUniformLocation(program, 'uSunDirection'), 0.4, 0.8, 0.3);
  gl.enable(gl.DEPTH_TEST);
  const matrixLocation = gl.getUniformLocation(program, 'uViewProjection');
  const results = [];
  for (const camera of CAMERA_STATES) {
    const startedAt = performance.now();
    gl.viewport(0, 0, gpuCanvas.width, gpuCanvas.height);
    gl.clearColor(0.33, 0.44, 0.52, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(matrixLocation, false, viewProjection(camera, gpuCanvas.width / gpuCanvas.height));
    gl.drawElements(gl.TRIANGLES, flattened.indices.length, gl.UNSIGNED_INT, 0);
    gl.finish();
    results.push({
      cameraStateId: camera.cameraStateId,
      durationMilliseconds: round(performance.now() - startedAt),
      indexCount: flattened.indices.length,
      drawCalls: 1
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return {
    candidateId: 'CANDIDATE_C_CACHED_WORLD_WEBGL_2_GPU_PROBE',
    available: true,
    renderer: gl.getParameter(gl.RENDERER),
    vendor: gl.getParameter(gl.VENDOR),
    results
  };
}

async function runWorkerProbe(flattened) {
  if (typeof Worker !== 'function') {
    return { candidateId: 'CANDIDATE_B_CACHED_WORLD_WORKER_CPU_PROBE', available: false, results: [] };
  }
  const worker = new Worker('./candidate-worker.js', { type: 'module' });
  const matrices = CAMERA_STATES.map((camera) => ({
    cameraStateId: camera.cameraStateId,
    matrix: Array.from(viewProjection(camera, 1.6))
  }));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('R1_WORKER_PROBE_TIMEOUT'));
    }, 60000);
    worker.onmessage = (event) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ...event.data, available: true });
    };
    worker.onerror = (error) => {
      clearTimeout(timer);
      worker.terminate();
      reject(error);
    };
    const positionsBuffer = flattened.positions.buffer.slice(0);
    const indicesBuffer = flattened.indices.buffer.slice(0);
    worker.postMessage({
      positions: positionsBuffer,
      indices: indicesBuffer,
      matrices,
      width: 160,
      height: 100
    }, [positionsBuffer, indicesBuffer]);
  });
}

async function runArchitectureProbes() {
  runButton.disabled = true;
  stateNode.textContent = 'Running fixed-camera architecture probes…';
  const heapBefore = memoryUsed();
  const neutral = await measure(() => buildHEarthRun8ENeutralPackage());
  if (neutral.value?.ok !== true) throw new Error(`R1_NEUTRAL_PACKAGE_FAILED:${neutral.value?.issues?.join(',')}`);
  const admission = await measure(() => admitHEarthPrimitiveBatch(neutral.value.primitives, {
    frameId: 'H_EARTH_RUN_8E_R1_PROFILE_WEST_AGGREGATE',
    metadata: { diagnosticProgram: 'RUN_8E_R1' }
  }));
  const transfer = await measure(() => buildHEarthRun8EPacket002SuccessorTransfer({
    neutralPackage: neutral.value,
    westBatchAdmissionResult: admission.value,
    transferOccurrenceId: 'H_EARTH_RUN_8E_R1_PROFILE_PACKET_002_TRANSFER'
  }));
  const candidateA = [];
  let representativeFrame = null;
  for (const camera of CAMERA_STATES) {
    const presentation = await measure(() => buildHEarthRun8CTerrainMaterialLightingPresentation({
      timeOfDayHours: 15.25,
      cameraWorld: camera.position,
      viewportWidth: 320,
      viewportHeight: 200,
      cameraFarPlane: camera.farPlane
    }));
    const frame = await measure(() => constructHEarthRun8ESuccessorEnvironmentFrame({
      camera,
      viewport: { width: 320, height: 200, pixelRatio: 1 },
      frameOccurrenceId: `H_EARTH_RUN_8E_R1_${camera.cameraStateId}_FRAME`,
      transferOccurrenceId: `H_EARTH_RUN_8E_R1_${camera.cameraStateId}_TRANSFER`
    }));
    if (frame.value?.ok !== true) throw new Error(`R1_FRAME_FAILED:${camera.cameraStateId}`);
    representativeFrame ??= frame.value;
    const plan = await measure(() => prepareHEarthRun8ERenderPlan(frame.value, { width: 320, height: 200, pixelRatio: 1 }));
    const baseRaster = await measure(() => rasterizeHEarthFunctionalLandscapePlan(plan.value));
    const fullRaster = await measure(() => rasterizeHEarthRun8ERenderPlan(plan.value, frame.value));
    const staging = document.createElement('canvas');
    staging.width = fullRaster.value.width;
    staging.height = fullRaster.value.height;
    const context = staging.getContext('2d', { alpha: false });
    const putImageData = await measure(() => context.putImageData(
      new ImageData(fullRaster.value.rgba, fullRaster.value.width, fullRaster.value.height),
      0,
      0
    ));
    candidateA.push({
      cameraStateId: camera.cameraStateId,
      materialAndLightProjectionMilliseconds: round(presentation.durationMilliseconds),
      fullWorldFrameConstructionMilliseconds: round(frame.durationMilliseconds),
      cameraTransformAndClippingMilliseconds: round(plan.durationMilliseconds),
      baseRasterizationMilliseconds: round(baseRaster.durationMilliseconds),
      fullRun8ERasterMilliseconds: round(fullRaster.durationMilliseconds),
      secondDepthTraversalCompositeMilliseconds: round(Math.max(0, fullRaster.durationMilliseconds - baseRaster.durationMilliseconds)),
      putImageDataMilliseconds: round(putImageData.durationMilliseconds),
      projectedTriangleCount: plan.value.triangles.length,
      admittedPrimitiveCount: frame.value.transfer.primitiveCount
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  const flattened = flattenFrame(representativeFrame);
  const workerInput = {
    positions: new Float32Array(flattened.positions),
    normals: new Float32Array(flattened.normals),
    colors: new Float32Array(flattened.colors),
    indices: new Uint32Array(flattened.indices)
  };
  const candidateB = await runWorkerProbe(workerInput);
  const candidateC = await runWebGLProbe(flattened);
  const heapAfter = memoryUsed();
  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R1_ARCHITECTURE_PROBE_RECEIPT',
    generatedAt: nowIso(),
    userAgent: navigator.userAgent,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    fixedCameraStateCount: CAMERA_STATES.length,
    staticPipeline: {
      worldPackageConstructionMilliseconds: round(neutral.durationMilliseconds),
      westAdmissionMilliseconds: round(admission.durationMilliseconds),
      packet002TransferMilliseconds: round(transfer.durationMilliseconds),
      primitiveCount: neutral.value.primitiveCount,
      heapDeltaBytes: heapBefore && heapAfter ? heapAfter - heapBefore : null
    },
    candidateA: {
      candidateId: 'CANDIDATE_A_INSTRUMENTED_CURRENT_MAIN_THREAD_CPU_RENDERER',
      publicSuitabilityAlreadyFailedPhysicalEvidence: true,
      results: candidateA
    },
    candidateB,
    candidateC,
    architectureDisposition: {
      deterministicCpuReferenceRenderer: 'PRESERVE_REFERENCE_ONLY',
      realtimeLiveRendererPrimaryCandidate: candidateC.available ? 'WEBGL_2' : 'WEBGL_2_REQUIRES_DEVICE_SUPPORT_REVIEW',
      workerCpuDisposition: 'FALLBACK_REFERENCE_ACCELERATION_OR_DIAGNOSTIC_OPTION',
      pixelIdentityRequired: false,
      geometricAndAuthorityCorrespondenceRequired: true
    }
  };
  window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT = receipt;
  output.textContent = JSON.stringify(receipt, null, 2);
  stateNode.textContent = 'Architecture probes complete. Physical interaction receipt still required.';
  copyButton.disabled = false;
  downloadButton.disabled = false;
  runButton.disabled = false;
  return receipt;
}

let physicalSession = null;

function supportedObserver(windowObject, type) {
  return Boolean(windowObject.PerformanceObserver?.supportedEntryTypes?.includes(type));
}

function startPhysicalSession() {
  const frameWindow = liveFrame.contentWindow;
  const frameDocument = liveFrame.contentDocument;
  const mount = frameDocument?.getElementById('h-earth-functional-landscape-mount');
  const canvas = frameDocument?.getElementById('h-earth-functional-landscape-canvas');
  if (!mount || !canvas) throw new Error('R1_LIVE_FRAME_NOT_READY');
  const baselineNavigation = frameWindow.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.();
  const baselineRender = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
  const metrics = {
    startedAt: nowIso(),
    pointerEventReceiptCount: 0,
    pointerMoveCount: 0,
    previewTransformMutationCount: 0,
    firstPointerToNavigationMilliseconds: [],
    releaseToSettledFrameMilliseconds: [],
    longTaskCount: 0,
    longestMainThreadTaskMilliseconds: 0,
    longAnimationFrameCount: 0,
    longestAnimationFrameMilliseconds: 0,
    garbageCollectionEntryCount: 0,
    maximumGestureBacklogDepth: 0,
    droppedOrSupersededInputCount: 0,
    heapStartBytes: Number(frameWindow.performance.memory?.usedJSHeapSize ?? 0),
    heapEndBytes: null
  };
  let firstPointerAt = null;
  let navigationBaselineSequence = baselineNavigation?.state?.sequence ?? 0;
  let releaseAt = null;
  let renderBaselineSequence = baselineRender?.receipt?.renderSequence ?? 0;
  let animationFrame = 0;
  const disposers = [];
  const observers = [];

  const onPointerDown = () => {
    metrics.pointerEventReceiptCount += 1;
    firstPointerAt ??= frameWindow.performance.now();
    navigationBaselineSequence = frameWindow.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.()?.state?.sequence ?? navigationBaselineSequence;
  };
  const onPointerMove = () => {
    metrics.pointerEventReceiptCount += 1;
    metrics.pointerMoveCount += 1;
  };
  const onPointerUp = () => {
    metrics.pointerEventReceiptCount += 1;
    releaseAt = frameWindow.performance.now();
    renderBaselineSequence = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()?.receipt?.renderSequence ?? renderBaselineSequence;
  };
  mount.addEventListener('pointerdown', onPointerDown, true);
  mount.addEventListener('pointermove', onPointerMove, true);
  mount.addEventListener('pointerup', onPointerUp, true);
  mount.addEventListener('pointercancel', onPointerUp, true);
  disposers.push(() => mount.removeEventListener('pointerdown', onPointerDown, true));
  disposers.push(() => mount.removeEventListener('pointermove', onPointerMove, true));
  disposers.push(() => mount.removeEventListener('pointerup', onPointerUp, true));
  disposers.push(() => mount.removeEventListener('pointercancel', onPointerUp, true));

  const mutationObserver = new frameWindow.MutationObserver(() => {
    if (canvas.style.transform) metrics.previewTransformMutationCount += 1;
  });
  mutationObserver.observe(canvas, { attributes: true, attributeFilter: ['style'] });
  observers.push(mutationObserver);

  if (supportedObserver(frameWindow, 'longtask')) {
    const observer = new frameWindow.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.longTaskCount += 1;
        metrics.longestMainThreadTaskMilliseconds = Math.max(metrics.longestMainThreadTaskMilliseconds, entry.duration);
      }
    });
    observer.observe({ type: 'longtask', buffered: true });
    observers.push(observer);
  }
  if (supportedObserver(frameWindow, 'long-animation-frame')) {
    const observer = new frameWindow.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.longAnimationFrameCount += 1;
        metrics.longestAnimationFrameMilliseconds = Math.max(metrics.longestAnimationFrameMilliseconds, entry.duration);
      }
    });
    observer.observe({ type: 'long-animation-frame', buffered: true });
    observers.push(observer);
  }
  if (supportedObserver(frameWindow, 'gc')) {
    const observer = new frameWindow.PerformanceObserver((list) => {
      metrics.garbageCollectionEntryCount += list.getEntries().length;
    });
    observer.observe({ type: 'gc', buffered: true });
    observers.push(observer);
  }

  const sample = () => {
    const navigation = frameWindow.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.();
    const direct = frameWindow.H_EARTH_RUN8E_DIRECT_INSPECTION?.getReceipt?.();
    const successor = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    const scheduling = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSchedulingReceipt?.();
    const sequence = navigation?.state?.sequence ?? navigationBaselineSequence;
    if (firstPointerAt !== null && sequence > navigationBaselineSequence) {
      metrics.firstPointerToNavigationMilliseconds.push(frameWindow.performance.now() - firstPointerAt);
      firstPointerAt = null;
      navigationBaselineSequence = sequence;
    }
    const renderSequence = successor?.receipt?.renderSequence ?? renderBaselineSequence;
    if (releaseAt !== null && renderSequence > renderBaselineSequence) {
      metrics.releaseToSettledFrameMilliseconds.push(frameWindow.performance.now() - releaseAt);
      releaseAt = null;
      renderBaselineSequence = renderSequence;
    }
    const backlog = Number(direct?.pendingIntentPresent ? 1 : 0) + Number(scheduling?.pendingWaiterCount ?? 0);
    metrics.maximumGestureBacklogDepth = Math.max(metrics.maximumGestureBacklogDepth, backlog);
    metrics.droppedOrSupersededInputCount = Math.max(
      metrics.droppedOrSupersededInputCount,
      Number(direct?.coalescedCommitCount ?? 0) + Number(scheduling?.coalescedRenderRequestCount ?? 0)
    );
    animationFrame = frameWindow.requestAnimationFrame(sample);
  };
  animationFrame = frameWindow.requestAnimationFrame(sample);
  disposers.push(() => frameWindow.cancelAnimationFrame(animationFrame));

  physicalSession = { metrics, disposers, observers, baselineNavigation, baselineRender };
  startButton.disabled = true;
  stopButton.disabled = false;
  stateNode.textContent = 'Physical session active: perform repeated look, two-finger travel, pinch, and orientation changes.';
}

function percentile(values, amount) {
  if (values.length === 0) return null;
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * amount))];
}

function stopPhysicalSession() {
  if (!physicalSession) return null;
  physicalSession.disposers.forEach((dispose) => dispose());
  physicalSession.observers.forEach((observer) => observer.disconnect());
  const frameWindow = liveFrame.contentWindow;
  const direct = frameWindow.H_EARTH_RUN8E_DIRECT_INSPECTION?.getReceipt?.();
  const scheduling = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSchedulingReceipt?.();
  const finalNavigation = frameWindow.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.getSnapshot?.();
  const finalRender = frameWindow.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
  const metrics = physicalSession.metrics;
  metrics.heapEndBytes = Number(frameWindow.performance.memory?.usedJSHeapSize ?? 0);
  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R1_PHYSICAL_SAMSUNG_PROFILING_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R1_PHYSICAL_PROFILE_CAPTURED_NOT_CLOSURE_PASS',
    generatedAt: nowIso(),
    device: {
      userAgent: frameWindow.navigator.userAgent,
      platform: frameWindow.navigator.platform,
      viewport: { width: frameWindow.innerWidth, height: frameWindow.innerHeight, devicePixelRatio: frameWindow.devicePixelRatio },
      hardwareConcurrency: frameWindow.navigator.hardwareConcurrency ?? null,
      deviceMemoryGiB: frameWindow.navigator.deviceMemory ?? null
    },
    interaction: {
      pointerEventReceiptCount: metrics.pointerEventReceiptCount,
      pointerMoveCount: metrics.pointerMoveCount,
      previewTransformMutationCount: metrics.previewTransformMutationCount,
      firstPointerToNavigationMilliseconds: metrics.firstPointerToNavigationMilliseconds.map((value) => round(value)),
      p95PointerToNavigationMilliseconds: round(percentile(metrics.firstPointerToNavigationMilliseconds, 0.95)),
      releaseToSettledFrameMilliseconds: metrics.releaseToSettledFrameMilliseconds.map((value) => round(value)),
      p95ReleaseToSettledFrameMilliseconds: round(percentile(metrics.releaseToSettledFrameMilliseconds, 0.95)),
      maximumGestureBacklogDepth: metrics.maximumGestureBacklogDepth,
      droppedOrSupersededInputCount: metrics.droppedOrSupersededInputCount,
      directInspectionDiagnostics: clone(direct),
      schedulingDiagnostics: clone(scheduling)
    },
    mainThread: {
      longTaskCount: metrics.longTaskCount,
      longestMainThreadTaskMilliseconds: round(metrics.longestMainThreadTaskMilliseconds),
      longAnimationFrameCount: metrics.longAnimationFrameCount,
      longestAnimationFrameMilliseconds: round(metrics.longestAnimationFrameMilliseconds),
      garbageCollectionEntryCount: metrics.garbageCollectionEntryCount
    },
    memory: {
      heapStartBytes: metrics.heapStartBytes || null,
      heapEndBytes: metrics.heapEndBytes || null,
      heapDeltaBytes: metrics.heapStartBytes && metrics.heapEndBytes ? metrics.heapEndBytes - metrics.heapStartBytes : null
    },
    stateEvidence: {
      baselineNavigation: clone(physicalSession.baselineNavigation),
      finalNavigation: clone(finalNavigation),
      baselineRender: clone(physicalSession.baselineRender),
      finalRender: clone(finalRender)
    },
    failureClassification: {
      truthfulContinuousRealtimeInteractionEstablished: false,
      currentCpuPublicSuitability: 'FAILED_PHYSICAL_EVIDENCE',
      flatBitmapPreviewFramesObserved: metrics.previewTransformMutationCount,
      run8EPassClosed: false
    }
  };
  window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT = receipt;
  output.textContent = JSON.stringify(receipt, null, 2);
  physicalSession = null;
  startButton.disabled = false;
  stopButton.disabled = true;
  copyButton.disabled = false;
  downloadButton.disabled = false;
  stateNode.textContent = 'Physical profile captured. Copy or download the receipt and preserve it as evidence.';
  return receipt;
}

function currentReceipt() {
  return window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT ?? window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT ?? null;
}

runButton.addEventListener('click', () => runArchitectureProbes().catch((error) => {
  stateNode.textContent = `Probe failed: ${error.message}`;
  output.textContent = error.stack ?? String(error);
  runButton.disabled = false;
}));
startButton.addEventListener('click', () => {
  try { startPhysicalSession(); } catch (error) { stateNode.textContent = `Physical session failed: ${error.message}`; }
});
stopButton.addEventListener('click', stopPhysicalSession);
copyButton.addEventListener('click', async () => {
  const receipt = currentReceipt();
  if (receipt) await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
});
downloadButton.addEventListener('click', () => {
  const receipt = currentReceipt();
  if (!receipt) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' }));
  link.download = receipt.receiptType.includes('PHYSICAL')
    ? 'h-earth.run8e-r1.physical-samsung-profile.json'
    : 'h-earth.run8e-r1.architecture-probes.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

liveFrame.addEventListener('load', () => {
  startButton.disabled = false;
  stateNode.textContent = 'Profiler ready. Run architecture probes or start a physical interaction session.';
});

window.H_EARTH_RUN8E_R1_PROFILER = {
  cameraStates: clone(CAMERA_STATES),
  runArchitectureProbes,
  startPhysicalSession,
  stopPhysicalSession,
  getReceipt: currentReceipt
};
