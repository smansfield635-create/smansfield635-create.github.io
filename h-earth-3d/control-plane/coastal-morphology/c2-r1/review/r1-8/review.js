import {
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING,
  H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  sampleHEarthC2R1CandidateRendererMaterial
} from '../../h-earth.c2-r1.candidate-renderer-sampling.js';
import { getHEarthCanonicalShorelineZ } from '../../../../../terrain/h-earth.terrain-field.js';

const SOURCE_HEAD = 'c53362c6f74b01c4e0b53be526b0e3a0b73edede';
const OCCURRENCE = 'H_EARTH_C2_R1_R1_8_ISOLATED_REVIEW_001';
const canvas = document.getElementById('r18-review-canvas');
const statusOutput = document.getElementById('runtime-status');
const runtimeDetail = document.getElementById('runtime-detail');
const root = document.getElementById('r18-review-root');
const gl = canvas.getContext('webgl2', {
  alpha: false,
  antialias: true,
  depth: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance'
});
if (!gl) throw new Error('R1_8_WEBGL2_CONTEXT_UNAVAILABLE');

const finite = Number.isFinite;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (a, b, t) => a + (b - a) * t;
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

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangent = normalize3(vec3(2 * step, 0, z1 - z0));
  let waterward = normalize3(vec3(-tangent[2], 0, tangent[0]));
  if (waterward[2] < 0) waterward = scale3(waterward, -1);
  return {
    shoreline: vec3(anchorX, 0, getHEarthCanonicalShorelineZ(anchorX)),
    inlandNormal: scale3(waterward, -1)
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return add3(frame.shoreline, scale3(frame.inlandNormal, signedInlandDistance));
}

const ALONG_COUNT = 49;
const CROSS_COUNT = 73;
const ALONG_MIN = -180;
const ALONG_MAX = 180;
const INLAND_MIN = -115;
const INLAND_MAX = 135;
const terrainRecords = [];
const runtime = {
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  contractId: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
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
  startedAt: performance.now(),
  readyAt: null
};

for (let row = 0; row < CROSS_COUNT; row += 1) {
  const inland = mix(INLAND_MIN, INLAND_MAX, row / (CROSS_COUNT - 1));
  for (let column = 0; column < ALONG_COUNT; column += 1) {
    const anchor = mix(ALONG_MIN, ALONG_MAX, column / (ALONG_COUNT - 1));
    const world = worldAt(anchor, inland);
    const sample = sampleHEarthC2R1CandidateRendererMaterial(world[0], world[2], { timeSeconds: 0 });
    if (sample?.valid !== true) throw new Error(`R1_8_CANDIDATE_SAMPLE_FAILED:${anchor}:${inland}`);
    runtime.candidateMaterialSampleCount += 1;
    const base = sample.baseMaterialBeforeMacro.colorLinear;
    const applied = sample.material.colorLinear;
    if (applied.some((value, index) => Math.abs(value - base[index]) > 1e-12)) runtime.macroDifferentialCount += 1;
    terrainRecords.push({ anchor, inland, world: vec3(sample.world.x, sample.world.y, sample.world.z), sample });
  }
}

function recordAt(row, column) {
  return terrainRecords[row * ALONG_COUNT + column];
}

function terrainNormal(row, column) {
  const left = recordAt(row, Math.max(0, column - 1)).world;
  const right = recordAt(row, Math.min(ALONG_COUNT - 1, column + 1)).world;
  const down = recordAt(Math.max(0, row - 1), column).world;
  const up = recordAt(Math.min(CROSS_COUNT - 1, row + 1), column).world;
  return normalize3(cross3(sub3(up, down), sub3(right, left)));
}

function createMesh({ water = false } = {}) {
  const vertices = [];
  const indices = [];
  const rowMap = [];
  for (let row = 0; row < CROSS_COUNT; row += 1) {
    const source = recordAt(row, 0);
    if (water && source.inland > 10) continue;
    rowMap.push(row);
    for (let column = 0; column < ALONG_COUNT; column += 1) {
      const record = recordAt(row, column);
      const sample = record.sample;
      const normal = water ? vec3(0, 1, 0) : terrainNormal(row, column);
      let position = record.world;
      let color;
      let alpha = 1;
      if (water) {
        position = vec3(record.world[0], 0.18, record.world[2]);
        const preserved = sample.preservedCandidateResponses;
        const waterColor = preserved.waterSurfaceColorLinear;
        const foam = clamp(preserved.foamIntensity * preserved.foamOpacity, 0, 1);
        color = waterColor.map((channel, index) => clamp(mix(channel, preserved.foamColorLinear[index], foam), 0, 1));
        alpha = clamp(preserved.waterSurfaceOpacity + foam * 0.18, 0.24, 0.88);
      } else {
        const ao = sample.material.cavityOrAmbientOcclusion;
        color = sample.material.colorLinear.map(channel => clamp(channel * (0.76 + 0.24 * ao), 0, 1));
      }
      vertices.push(
        position[0], position[1], position[2],
        color[0], color[1], color[2], alpha,
        normal[0], normal[1], normal[2]
      );
    }
  }
  for (let rowIndex = 0; rowIndex < rowMap.length - 1; rowIndex += 1) {
    for (let column = 0; column < ALONG_COUNT - 1; column += 1) {
      const a = rowIndex * ALONG_COUNT + column;
      const b = a + 1;
      const c = a + ALONG_COUNT;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  const stride = 10 * 4;
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 3 * 4);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, stride, 7 * 4);
  gl.bindVertexArray(null);
  return { vao, count: indices.length };
}

const terrainMesh = createMesh();
const waterMesh = createMesh({ water: true });
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
function render(timeMilliseconds) {
  resize();
  const timeSeconds = timeMilliseconds / 1000;
  if (runtime.frameCount % 6 === 0) {
    const anchor = Math.sin(timeSeconds * 0.13) * 110;
    const inland = -18 + Math.cos(timeSeconds * 0.21) * 9;
    const world = worldAt(anchor, inland);
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
  if (!runtime.readyAt && runtime.frameCount >= 3 && runtime.waterBreakerSwashRuntimeSampleCount > 0) {
    runtime.readyAt = performance.now();
    document.documentElement.dataset.r1_8Review = 'ready';
    document.documentElement.dataset.webgl2 = 'true';
    root.dataset.ready = 'true';
    statusOutput.textContent = 'Candidate runtime active';
    runtimeDetail.textContent = 'WebGL 2 active; C2-R1 terrain, coastal material, water/breaker/swash response, macro field, touch intake, camera, and live frame presentation are available for review.';
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

const getReceipt = () => ({
  schema: 'H_EARTH_C2_R1_R1_8_REVIEW_RUNTIME_RECEIPT_v1',
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  contractId: runtime.contractId,
  rendererContract: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING.contractId,
  webgl2ContextEstablished: runtime.webgl2ContextEstablished,
  meshReady: runtime.meshReady,
  frameCount: runtime.frameCount,
  presentationCount: runtime.presentationCount,
  candidateMaterialSampleCount: runtime.candidateMaterialSampleCount,
  waterBreakerSwashRuntimeSampleCount: runtime.waterBreakerSwashRuntimeSampleCount,
  macroDifferentialCount: runtime.macroDifferentialCount,
  macroExpressionActive: runtime.macroDifferentialCount > 0,
  coastalMaterialChainActive: runtime.candidateMaterialSampleCount === ALONG_COUNT * CROSS_COUNT,
  waterBreakerSwashChainActive: runtime.waterBreakerSwashRuntimeSampleCount > 0,
  pointerEventCount: runtime.pointerEventCount,
  touchEventCount: runtime.touchEventCount,
  navigationEventCount: runtime.navigationEventCount,
  cameraRevision: runtime.cameraRevision,
  camera: getCameraSnapshot(),
  lastWaterSample: runtime.lastWaterSample,
  noBitmapDragFallback: true,
  rendererLifecycleMutated: false,
  terrainGeometryMutated: false,
  publicDefaultRouteMutated: false,
  productDefaultMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialRequired: true,
  viewport: { width: canvas.width, height: canvas.height, devicePixelRatio: window.devicePixelRatio || 1 },
  ready: document.documentElement.dataset.r1_8Review === 'ready'
});
window.H_EARTH_C2_R1_R1_8_REVIEW = Object.freeze({
  sourceHead: SOURCE_HEAD,
  occurrence: OCCURRENCE,
  setView,
  getCameraSnapshot,
  getReceipt
});
