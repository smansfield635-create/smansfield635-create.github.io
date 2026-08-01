import {
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING,
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  sampleHEarthC2R1CandidateRendererMaterial
} from '../../h-earth.c2-r1.candidate-renderer-sampling.js';
import {
  H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT,
  getHEarthC2R1ReviewWorldAt,
  parseHEarthC2R1ReviewMeshIncrementally,
  digestHEarthC2R1ReviewMesh
} from './h-earth.c2-r1.r1-8-review-mesh-materializer.js';

const SOURCE_HEAD = 'c53362c6f74b01c4e0b53be526b0e3a0b73edede';
const OCCURRENCE = 'H_EARTH_C2_R1_R1_8_ISOLATED_REVIEW_001';
const trace = (event, detail = null) => {
  window.__R1_8_RUNTIME_TRACE__?.emit?.(event, detail);
};
const now = () => performance.now();
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const vec3 = (x = 0, y = 0, z = 0) => new Float32Array([x, y, z]);
const copy3 = value => vec3(value[0], value[1], value[2]);
const add3 = (a, b) => vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
const sub3 = (a, b) => vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const scale3 = (a, scale) => vec3(a[0] * scale, a[1] * scale, a[2] * scale);
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => vec3(
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
);
const normalize3 = value => {
  const length = Math.hypot(value[0], value[1], value[2]) || 1;
  return vec3(value[0] / length, value[1] / length, value[2] / length);
};
const canvas = document.getElementById('r18-review-canvas');
const statusOutput = document.getElementById('runtime-status');
const runtimeDetail = document.getElementById('runtime-detail');
const root = document.getElementById('r18-review-root');

trace('WEBGL_CONTEXT_REQUESTED');
const gl = canvas.getContext('webgl2', {
  alpha: false,
  antialias: true,
  depth: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance'
});
trace('WEBGL_CONTEXT_ESTABLISHED', { established: Boolean(gl) });
if (!gl) throw new Error('R1_8_WEBGL2_CONTEXT_UNAVAILABLE');

function perspective(out, fovRadians, aspect, near, far) {
  const f = 1 / Math.tan(fovRadians / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

function lookAt(out, eye, target, up = vec3(0, 1, 0)) {
  const z = normalize3(sub3(eye, target));
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  out[0] = x[0]; out[1] = y[0]; out[2] = z[0]; out[3] = 0;
  out[4] = x[1]; out[5] = y[1]; out[6] = z[1]; out[7] = 0;
  out[8] = x[2]; out[9] = y[2]; out[10] = z[2]; out[11] = 0;
  out[12] = -dot3(x, eye); out[13] = -dot3(y, eye); out[14] = -dot3(z, eye); out[15] = 1;
  return out;
}

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`R1_8_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram(vertexSource, fragmentSource) {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`R1_8_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

const vertexSource = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec4 aColor;
layout(location=2) in vec3 aNormal;
uniform mat4 uProjection;
uniform mat4 uView;
out vec4 vColor;
out vec3 vNormal;
out vec3 vWorld;
void main(){
  vColor=aColor;
  vNormal=aNormal;
  vWorld=aPosition;
  gl_Position=uProjection*uView*vec4(aPosition,1.0);
}`;
const fragmentSource = `#version 300 es
precision highp float;
in vec4 vColor;
in vec3 vNormal;
in vec3 vWorld;
uniform vec3 uCamera;
uniform float uWaterPulse;
uniform int uWaterPass;
out vec4 outColor;
void main(){
  vec3 lightDirection=normalize(vec3(-0.35,0.9,0.28));
  float diffuse=0.62+0.38*max(dot(normalize(vNormal),lightDirection),0.0);
  float distanceToCamera=distance(vWorld,uCamera);
  float fog=clamp((distanceToCamera-150.0)/430.0,0.0,0.72);
  vec3 color=vColor.rgb*diffuse;
  if(uWaterPass==1){
    color=mix(color,color+vec3(0.04,0.07,0.08),uWaterPulse);
  }
  color=mix(color,vec3(0.035,0.055,0.062),fog);
  outColor=vec4(color,vColor.a);
}`;
const program = createProgram(vertexSource, fragmentSource);
const uniforms = {
  projection: gl.getUniformLocation(program, 'uProjection'),
  view: gl.getUniformLocation(program, 'uView'),
  camera: gl.getUniformLocation(program, 'uCamera'),
  waterPulse: gl.getUniformLocation(program, 'uWaterPulse'),
  waterPass: gl.getUniformLocation(program, 'uWaterPass')
};

const runtime = {
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  contractId: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  meshContractId: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.contractId,
  webgl2ContextEstablished: true,
  meshReady: false,
  frameCount: 0,
  presentationCount: 0,
  candidateMaterialSampleCount: 0,
  waterBreakerSwashRuntimeSampleCount: 0,
  macroDifferentialCount: 0,
  pointerEventCount: 0,
  touchEventCount: 0,
  navigationEventCount: 0,
  cameraRevision: 0,
  lastView: null,
  lastWaterSample: null,
  startedAt: now(),
  readyAt: null,
  constructionStartedAt: null,
  constructionCompletedAt: null,
  firstGpuUploadAt: null,
  allGpuUploadsAt: null,
  firstFrameAt: null,
  batchDurations: [],
  longestSingleMainThreadBlockMs: 0,
  mainThreadHeartbeatCountDuringConstruction: 0,
  gpuUploadDurationMs: null,
  totalConstructionDurationMs: null,
  totalReadyDurationMs: null,
  meshIdentity: null,
  expectedMeshIdentity: null,
  asset: null
};

trace('CANDIDATE_CONSTRUCTION_STARTED', { option: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.option });
runtime.constructionStartedAt = now();
let heartbeatPrior = now();
const heartbeat = setInterval(() => {
  const current = now();
  const drift = Math.max(0, current - heartbeatPrior - 25);
  runtime.longestSingleMainThreadBlockMs = Math.max(runtime.longestSingleMainThreadBlockMs, drift);
  runtime.mainThreadHeartbeatCountDuringConstruction += 1;
  heartbeatPrior = current;
  trace('MAIN_THREAD_HEARTBEAT', {
    count: runtime.mainThreadHeartbeatCountDuringConstruction,
    driftMilliseconds: drift
  });
}, 25);
await new Promise(resolve => setTimeout(resolve, 30));

const identityResponse = await fetch('./identity.json', { cache: 'no-store' });
if (!identityResponse.ok) throw new Error(`R1_8_IDENTITY_HTTP_${identityResponse.status}`);
const identity = await identityResponse.json();
const assetDescriptor = identity.reviewMeshAsset;
if (!assetDescriptor?.file || !assetDescriptor?.sha256 || !assetDescriptor?.canonicalIdentity) {
  throw new Error('R1_8_REVIEW_MESH_ASSET_IDENTITY_MISSING');
}
const assetFetchStartedAt = now();
const assetResponse = await fetch(`./${assetDescriptor.file}`, { cache: 'no-store' });
if (!assetResponse.ok) throw new Error(`R1_8_REVIEW_MESH_ASSET_HTTP_${assetResponse.status}`);
const assetBuffer = await assetResponse.arrayBuffer();
const assetDigestBytes = new Uint8Array(await crypto.subtle.digest('SHA-256', assetBuffer));
const assetSha256 = Array.from(assetDigestBytes, value => value.toString(16).padStart(2, '0')).join('');
if (assetSha256 !== assetDescriptor.sha256) throw new Error('R1_8_REVIEW_MESH_ASSET_DIGEST_MISMATCH');
if (assetBuffer.byteLength !== assetDescriptor.byteLength) throw new Error('R1_8_REVIEW_MESH_ASSET_BYTE_LENGTH_MISMATCH');
runtime.asset = {
  file: assetDescriptor.file,
  byteLength: assetBuffer.byteLength,
  sha256: assetSha256,
  fetchDurationMs: now() - assetFetchStartedAt,
  format: assetDescriptor.format
};

let firstBatch = true;
const mesh = await parseHEarthC2R1ReviewMeshIncrementally(assetBuffer, {
  onBatch(batch) {
    runtime.batchDurations.push(batch);
    runtime.longestSingleMainThreadBlockMs = Math.max(
      runtime.longestSingleMainThreadBlockMs,
      batch.durationMilliseconds
    );
    if (firstBatch) {
      firstBatch = false;
      trace('FIRST_CONSTRUCTION_BATCH_COMPLETED', batch);
    }
    if (batch.batchIndex === H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.fixedBatchBoundaries.length - 1) {
      trace('LAST_CONSTRUCTION_BATCH_COMPLETED', batch);
    }
  }
});
runtime.meshIdentity = await digestHEarthC2R1ReviewMesh(mesh);
runtime.expectedMeshIdentity = assetDescriptor.canonicalIdentity;
for (const key of Object.keys(runtime.expectedMeshIdentity)) {
  if (runtime.meshIdentity[key] !== runtime.expectedMeshIdentity[key]) {
    throw new Error(`R1_8_REVIEW_MESH_CANONICAL_IDENTITY_MISMATCH:${key}`);
  }
}
runtime.candidateMaterialSampleCount = mesh.completeSampleCount;
runtime.macroDifferentialCount = Number(assetDescriptor.macroDifferentialCount || 0);
runtime.constructionCompletedAt = now();
runtime.totalConstructionDurationMs = runtime.constructionCompletedAt - runtime.constructionStartedAt;
clearInterval(heartbeat);
trace('CANDIDATE_CONSTRUCTION_COMPLETED', {
  completeSampleCount: mesh.completeSampleCount,
  durationMilliseconds: runtime.totalConstructionDurationMs,
  mainThreadHeartbeatCount: runtime.mainThreadHeartbeatCountDuringConstruction,
  longestSingleMainThreadBlockMilliseconds: runtime.longestSingleMainThreadBlockMs
});

let uploadCount = 0;
const uploadStart = now();
function uploadBuffer(target, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  uploadCount += 1;
  if (uploadCount === 1) {
    runtime.firstGpuUploadAt = now();
    trace('FIRST_GPU_BUFFER_UPLOAD', { byteLength: data.byteLength });
  }
  return buffer;
}

function createMeshBuffers(source) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  uploadBuffer(gl.ARRAY_BUFFER, source.positions);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  uploadBuffer(gl.ARRAY_BUFFER, source.materialControls);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  uploadBuffer(gl.ARRAY_BUFFER, source.normals);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
  uploadBuffer(gl.ELEMENT_ARRAY_BUFFER, source.indices);
  gl.bindVertexArray(null);
  return { vao, count: source.indices.length };
}
const terrainMesh = createMeshBuffers(mesh.terrain);
const waterMesh = createMeshBuffers(mesh.water);
runtime.allGpuUploadsAt = now();
runtime.gpuUploadDurationMs = runtime.allGpuUploadsAt - uploadStart;
trace('ALL_GPU_BUFFERS_UPLOADED', {
  uploadCount,
  durationMilliseconds: runtime.gpuUploadDurationMs
});
runtime.meshReady = true;

const views = Object.freeze({
  LATERAL_BEACH_PROFILE: { position: [225, 74, 18], target: [0, 1, 32], fov: 48 },
  INLAND_TO_DEEP_WATER: { position: [0, 64, 174], target: [0, -2, -34], fov: 50 },
  SHALLOW_WATER_AND_SEABED: { position: [0, 16, -44], target: [0, -1.5, 32], fov: 54 },
  SANDBAR_AND_BATHYMETRY: { position: [132, 38, -82], target: [0, -2, 28], fov: 47 },
  GROUND_TRAVERSAL: { position: [0, 3.1, -22], target: [0, 1.6, 78], fov: 58 },
  DISTANT_LANDSCAPE: { position: [0, 58, -205], target: [0, 12, 112], fov: 44 }
});
let camera = { position: vec3(), target: vec3(), fov: 50 };

function getCameraSnapshot() {
  const direction = normalize3(sub3(camera.target, camera.position));
  return {
    position: Array.from(camera.position, value => Number(value.toFixed(6))),
    target: Array.from(camera.target, value => Number(value.toFixed(6))),
    direction: Array.from(direction, value => Number(value.toFixed(6))),
    fovDegrees: camera.fov,
    revision: runtime.cameraRevision,
    view: runtime.lastView
  };
}

function setView(id) {
  const view = views[id];
  if (!view) throw new Error(`R1_8_UNKNOWN_VIEW:${id}`);
  camera = { position: copy3(view.position), target: copy3(view.target), fov: view.fov };
  runtime.cameraRevision += 1;
  runtime.lastView = id;
  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === id));
  });
  return getCameraSnapshot();
}
setView('DISTANT_LANDSCAPE');

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    runtime.navigationEventCount += 1;
    setView(button.dataset.view);
  });
});

function cameraBasis() {
  const forward = normalize3(sub3(camera.target, camera.position));
  const right = normalize3(cross3(forward, vec3(0, 1, 0)));
  const up = normalize3(cross3(right, forward));
  return { forward, right, up };
}

function rotateCamera(deltaX, deltaY) {
  const offset = sub3(camera.target, camera.position);
  const radius = Math.max(0.1, Math.hypot(offset[0], offset[1], offset[2]));
  let yaw = Math.atan2(offset[0], offset[2]);
  let pitch = Math.asin(clamp(offset[1] / radius, -0.99, 0.99));
  yaw -= deltaX * 0.006;
  pitch = clamp(pitch - deltaY * 0.005, -1.35, 1.35);
  const horizontal = Math.cos(pitch) * radius;
  camera.target = add3(camera.position, vec3(
    Math.sin(yaw) * horizontal,
    Math.sin(pitch) * radius,
    Math.cos(yaw) * horizontal
  ));
  runtime.cameraRevision += 1;
}

function moveCamera(distance) {
  const { forward } = cameraBasis();
  const delta = scale3(forward, distance);
  camera.position = add3(camera.position, delta);
  camera.target = add3(camera.target, delta);
  runtime.cameraRevision += 1;
  runtime.navigationEventCount += 1;
}

const activePointers = new Map();
let previousGesture = null;
canvas.addEventListener('pointerdown', event => {
  try { canvas.setPointerCapture(event.pointerId); } catch {}
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
  runtime.pointerEventCount += 1;
  if (event.pointerType === 'touch') runtime.touchEventCount += 1;
  previousGesture = null;
});
canvas.addEventListener('pointermove', event => {
  if (!activePointers.has(event.pointerId)) return;
  const prior = activePointers.get(event.pointerId);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });
  runtime.pointerEventCount += 1;
  if (event.pointerType === 'touch') runtime.touchEventCount += 1;
  const pointers = [...activePointers.values()];
  if (pointers.length === 1) {
    rotateCamera(event.clientX - prior.x, event.clientY - prior.y);
  } else if (pointers.length >= 2) {
    const [a, b] = pointers;
    const gesture = {
      centerY: (a.y + b.y) / 2,
      separation: Math.hypot(a.x - b.x, a.y - b.y)
    };
    if (previousGesture) {
      moveCamera((previousGesture.centerY - gesture.centerY) * 0.12);
      moveCamera((gesture.separation - previousGesture.separation) * 0.045);
    }
    previousGesture = gesture;
  }
});
function endPointer(event) {
  activePointers.delete(event.pointerId);
  previousGesture = null;
  runtime.pointerEventCount += 1;
  if (event.pointerType === 'touch') runtime.touchEventCount += 1;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('wheel', event => {
  event.preventDefault();
  moveCamera(event.deltaY * 0.035);
}, { passive: false });
window.addEventListener('keydown', event => {
  const movement = { w: 3, ArrowUp: 3, s: -3, ArrowDown: -3 }[event.key];
  if (movement) moveCamera(movement);
});

function resize() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(canvas.clientWidth * scale));
  const height = Math.max(1, Math.round(canvas.clientHeight * scale));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
}

const projection = new Float32Array(16);
const viewMatrix = new Float32Array(16);
let waterPulse = 0;
let firstFrameResolve;
const firstFramePromise = new Promise(resolve => { firstFrameResolve = resolve; });

function render(timeMilliseconds) {
  resize();
  const timeSeconds = timeMilliseconds / 1000;
  if (runtime.frameCount % 6 === 0) {
    const anchor = Math.sin(timeSeconds * 0.13) * 110;
    const inland = -18 + Math.cos(timeSeconds * 0.21) * 9;
    const world = getHEarthC2R1ReviewWorldAt(anchor, inland);
    const sample = sampleHEarthC2R1CandidateRendererMaterial(world[0], world[2], { timeSeconds });
    if (sample?.valid === true) {
      runtime.waterBreakerSwashRuntimeSampleCount += 1;
      runtime.lastWaterSample = {
        foamIntensity: sample.preservedCandidateResponses.foamIntensity,
        foamOpacity: sample.preservedCandidateResponses.foamOpacity,
        temporaryWetness: sample.preservedCandidateResponses.temporaryWetness,
        waterSurfaceOpacity: sample.preservedCandidateResponses.waterSurfaceOpacity
      };
      waterPulse = clamp(
        sample.preservedCandidateResponses.foamIntensity * 0.7 +
        sample.preservedCandidateResponses.temporaryWetness * 0.3,
        0,
        1
      );
    }
  }
  perspective(projection, camera.fov * Math.PI / 180, canvas.width / canvas.height, 0.1, 1000);
  lookAt(viewMatrix, camera.position, camera.target);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.clearColor(0.018, 0.031, 0.036, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniformMatrix4fv(uniforms.projection, false, projection);
  gl.uniformMatrix4fv(uniforms.view, false, viewMatrix);
  gl.uniform3fv(uniforms.camera, camera.position);
  gl.uniform1f(uniforms.waterPulse, waterPulse);
  gl.uniform1i(uniforms.waterPass, 0);
  gl.bindVertexArray(terrainMesh.vao);
  gl.drawElements(gl.TRIANGLES, terrainMesh.count, gl.UNSIGNED_INT, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.depthMask(false);
  gl.uniform1i(uniforms.waterPass, 1);
  gl.bindVertexArray(waterMesh.vao);
  gl.drawElements(gl.TRIANGLES, waterMesh.count, gl.UNSIGNED_INT, 0);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.bindVertexArray(null);
  runtime.frameCount += 1;
  runtime.presentationCount += 1;
  if (!runtime.firstFrameAt) {
    runtime.firstFrameAt = now();
    trace('FIRST_FRAME_PRESENTED', { frameCount: runtime.frameCount });
    firstFrameResolve();
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
await firstFramePromise;

runtime.readyAt = now();
runtime.totalReadyDurationMs = runtime.readyAt - runtime.startedAt;
document.documentElement.dataset.r1_8Review = 'ready';
document.documentElement.dataset.webgl2 = 'true';
root.dataset.ready = 'true';
statusOutput.textContent = 'Candidate runtime active';
runtimeDetail.textContent = 'WebGL 2 active; the exact C2-R1 pre-materialized terrain and coastal material mesh, touch intake, camera, and live frame presentation are available for review.';
trace('READY_SENTINEL_WRITTEN', {
  totalReadyDurationMilliseconds: runtime.totalReadyDurationMs,
  firstFramePresented: true
});

const getReceipt = () => ({
  schema: 'H_EARTH_C2_R1_R1_8_REVIEW_RUNTIME_RECEIPT_v2',
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  contractId: runtime.contractId,
  rendererContract: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.contractId,
  meshContractId: runtime.meshContractId,
  materializationOption: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.option,
  asset: runtime.asset,
  webgl2ContextEstablished: runtime.webgl2ContextEstablished,
  meshReady: runtime.meshReady,
  frameCount: runtime.frameCount,
  presentationCount: runtime.presentationCount,
  candidateMaterialSampleCount: runtime.candidateMaterialSampleCount,
  waterBreakerSwashRuntimeSampleCount: runtime.waterBreakerSwashRuntimeSampleCount,
  macroDifferentialCount: runtime.macroDifferentialCount,
  macroExpressionActive: runtime.macroDifferentialCount > 0,
  coastalMaterialChainActive:
    runtime.candidateMaterialSampleCount === H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.completeSampleCount,
  waterBreakerSwashChainActive: runtime.waterBreakerSwashRuntimeSampleCount > 0,
  pointerEventCount: runtime.pointerEventCount,
  touchEventCount: runtime.touchEventCount,
  navigationEventCount: runtime.navigationEventCount,
  cameraRevision: runtime.cameraRevision,
  camera: getCameraSnapshot(),
  lastWaterSample: runtime.lastWaterSample,
  meshIdentity: runtime.meshIdentity,
  expectedMeshIdentity: runtime.expectedMeshIdentity,
  exactReviewGeometryPreserved:
    JSON.stringify(runtime.meshIdentity) === JSON.stringify(runtime.expectedMeshIdentity),
  construction: {
    totalConstructionDurationMs: runtime.totalConstructionDurationMs,
    longestSingleMainThreadBlockMs: runtime.longestSingleMainThreadBlockMs,
    mainThreadHeartbeatCountDuringConstruction: runtime.mainThreadHeartbeatCountDuringConstruction,
    batchDurations: runtime.batchDurations,
    firstGpuBufferUploadAt: runtime.firstGpuUploadAt,
    allGpuBuffersUploadedAt: runtime.allGpuUploadsAt,
    gpuUploadDurationMs: runtime.gpuUploadDurationMs,
    firstFrameAt: runtime.firstFrameAt,
    readyAt: runtime.readyAt,
    totalReadyDurationMs: runtime.totalReadyDurationMs
  },
  noBitmapDragFallback: true,
  rendererLifecycleMutated: false,
  terrainGeometryMutated: false,
  publicDefaultRouteMutated: false,
  productDefaultMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialRequired: true,
  viewport: {
    width: canvas.width,
    height: canvas.height,
    devicePixelRatio: window.devicePixelRatio || 1
  },
  ready: document.documentElement.dataset.r1_8Review === 'ready'
});

window.H_EARTH_C2_R1_R1_8_REVIEW = Object.freeze({
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  setView,
  getCameraSnapshot,
  getReceipt
});
