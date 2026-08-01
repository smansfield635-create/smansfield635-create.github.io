/**
 * Laws CP6 page-level true-3D spacecraft participant.
 *
 * Owns only page-background spacecraft geometry materialization, world-space
 * flight, projected hit testing, bounded impact/recovery, and transient
 * particles. It does not own the Compass scene, navigation, routes, records,
 * evidence, claims, or controller state.
 */

import {
  LAWS_SPACECRAFT_GEOMETRY_CONTRACT,
  buildLawsSpacecraftGeometry
} from "./index.spacecraft.geometry.js";

const CONTRACT = Object.freeze({
  id: "LAWS_CP6_TRUE_3D_SPACECRAFT_PAGE_BACKGROUND_v2",
  moduleId: "DGB_LAWS_SPACECRAFT",
  geometryContractId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.id,
  craftCount: 1,
  visualPassClaimed: false,
  productionAuthorized: false,
  deploymentAuthorized: false
});

const TEST_MODE = new URLSearchParams(globalThis.location?.search || "").get("lawsSpacecraftTest") === "1";
const HOST_ID = "laws-spacecraft-background-host";
const CANVAS_ID = "laws-spacecraft-background-canvas";
const FOV = Math.PI / 4;
const CAMERA_EYE = Object.freeze([0, 0, 7.2]);
const CAMERA_TARGET = Object.freeze([0, 0, 0]);

const state = {
  initialized: false,
  destroyed: false,
  failed: false,
  running: false,
  reducedMotion: false,
  documentVisible: !document.hidden,
  root: null,
  host: null,
  canvas: null,
  renderer: null,
  geometry: null,
  motionQuery: null,
  raf: 0,
  previousTime: 0,
  width: 1,
  height: 1,
  pixelRatio: 1,
  pointer: null,
  particles: [],
  craft: null,
  hitCount: 0,
  frameCount: 0,
  matrices: null,
  lastError: ""
};

const RECEIPT = {
  contractId: CONTRACT.id,
  moduleId: CONTRACT.moduleId,
  geometryContractId: CONTRACT.geometryContractId,
  status: "pending",
  initialized: false,
  running: false,
  destroyed: false,
  failed: false,
  reducedMotion: false,
  documentVisible: state.documentVisible,
  kernelFrameAdmitted: false,
  primitiveCount: 0,
  vertexCount: 0,
  triangleCount: 0,
  craftCount: CONTRACT.craftCount,
  activeCraftCount: 0,
  particleCount: 0,
  hitCount: 0,
  currentPhase: "OFFSCREEN",
  backgroundHost: false,
  compassChildCanvasCount: 0,
  webGlAvailable: false,
  ownsNavigation: false,
  ownsControllerState: false,
  ownsRoutes: false,
  ownsEvidence: false,
  ownsRecords: false,
  ownsClaims: false,
  ownsCompassGeometry: false,
  ownsCompassInteraction: false,
  visualPassClaimed: false,
  productionAuthorized: false,
  deploymentAuthorized: false,
  lastAction: "",
  lastError: ""
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(vector, amount) {
  return [vector[0] * amount, vector[1] * amount, vector[2] * amount];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function length(vector) {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function normalize(vector, fallback = [1, 0, 0]) {
  const magnitude = length(vector);
  return Number.isFinite(magnitude) && magnitude > 1e-8
    ? scale(vector, 1 / magnitude)
    : fallback.slice();
}

function rotateAroundAxis(vector, axis, angle) {
  const unit = normalize(axis, [0, 1, 0]);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return add(
    add(scale(vector, cosine), scale(cross(unit, vector), sine)),
    scale(unit, dot(unit, vector) * (1 - cosine))
  );
}

function hash32(value) {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(random, minimum, maximum) {
  return minimum + random() * (maximum - minimum);
}

function cubicPoint(path, t) {
  const inverse = 1 - t;
  const a = inverse * inverse * inverse;
  const b = 3 * inverse * inverse * t;
  const c = 3 * inverse * t * t;
  const d = t * t * t;
  return [
    path.start[0] * a + path.control1[0] * b + path.control2[0] * c + path.end[0] * d,
    path.start[1] * a + path.control1[1] * b + path.control2[1] * c + path.end[1] * d,
    path.start[2] * a + path.control1[2] * b + path.control2[2] * c + path.end[2] * d
  ];
}

function cubicTangent(path, t) {
  const inverse = 1 - t;
  return normalize([
    3 * inverse * inverse * (path.control1[0] - path.start[0]) +
      6 * inverse * t * (path.control2[0] - path.control1[0]) +
      3 * t * t * (path.end[0] - path.control2[0]),
    3 * inverse * inverse * (path.control1[1] - path.start[1]) +
      6 * inverse * t * (path.control2[1] - path.control1[1]) +
      3 * t * t * (path.end[1] - path.control2[1]),
    3 * inverse * inverse * (path.control1[2] - path.start[2]) +
      6 * inverse * t * (path.control2[2] - path.control1[2]) +
      3 * t * t * (path.end[2] - path.control2[2])
  ]);
}

function makePath(flightIndex) {
  const random = createRandom(hash32(0x42524732 ^ flightIndex));
  const reverse = flightIndex % 2 === 1;
  const startX = reverse ? 5.8 : -5.8;
  const endX = -startX;
  const startY = randomBetween(random, -1.85, 1.45);
  const endY = randomBetween(random, -1.55, 1.75);
  const startZ = randomBetween(random, -0.7, 0.9);
  const endZ = randomBetween(random, -1.4, 0.5);
  return Object.freeze({
    start: Object.freeze([startX, startY, startZ]),
    control1: Object.freeze([startX * 0.35, randomBetween(random, -2.0, 2.0), randomBetween(random, -1.2, 1.1)]),
    control2: Object.freeze([endX * 0.35, randomBetween(random, -2.0, 2.0), randomBetween(random, -1.5, 0.8)]),
    end: Object.freeze([endX, endY, endZ])
  });
}

function createCraft(now) {
  return {
    id: "DGB_SCOUTCRAFT_01_BACKGROUND_A",
    active: true,
    visible: false,
    phase: "APPROACH",
    flightIndex: 0,
    path: makePath(0),
    startTime: now + (TEST_MODE ? 100 : 1800),
    duration: TEST_MODE ? 7600 : 11200,
    nextLaunchTime: 0,
    manualProgress: null,
    position: [-5.8, 0, 0],
    tangent: [1, 0, 0],
    scale: 0.42,
    impactOffset: [0, 0, 0],
    velocity: [0, 0, 0],
    euler: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    recoveryUntil: 0,
    invulnerableUntil: 0,
    hitCount: 0,
    projected: null
  };
}

function perspective(fieldOfView, aspect, near, far) {
  const f = 1 / Math.tan(fieldOfView / 2);
  const inverse = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * inverse, -1,
    0, 0, 2 * far * near * inverse, 0
  ]);
}

function lookAt(eye, target, up) {
  const z = normalize(subtract(eye, target), [0, 0, 1]);
  const x = normalize(cross(up, z), [1, 0, 0]);
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function transform(matrix, vector) {
  const [x, y, z, w] = vector;
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w,
    matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w
  ];
}

function modelMatrix(craft) {
  let forward = rotateAroundAxis(craft.tangent, [0, 1, 0], craft.euler[1]);
  const provisionalRight = normalize(cross(forward, [0, 1, 0]), [0, 0, 1]);
  forward = normalize(rotateAroundAxis(forward, provisionalRight, craft.euler[0]));
  const referenceUp = Math.abs(dot(forward, [0, 1, 0])) > 0.92 ? [0, 0, 1] : [0, 1, 0];
  let right = normalize(cross(forward, referenceUp), [0, 0, 1]);
  let up = normalize(cross(right, forward), [0, 1, 0]);
  const bank = craft.euler[2] + Math.sin(craft.position[0] * 0.45) * 0.2;
  const cosine = Math.cos(bank);
  const sine = Math.sin(bank);
  const bankedUp = add(scale(up, cosine), scale(right, sine));
  const bankedRight = add(scale(right, cosine), scale(up, -sine));
  up = bankedUp;
  right = bankedRight;
  const s = craft.scale;
  return new Float32Array([
    forward[0] * s, forward[1] * s, forward[2] * s, 0,
    up[0] * s, up[1] * s, up[2] * s, 0,
    right[0] * s, right[1] * s, right[2] * s, 0,
    craft.position[0], craft.position[1], craft.position[2], 1
  ]);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "UNKNOWN_SHADER_ERROR";
    gl.deleteShader(shader);
    throw new Error(`LAWS_SPACECRAFT_SHADER_COMPILE_FAILED:${message}`);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "UNKNOWN_LINK_ERROR";
    gl.deleteProgram(program);
    throw new Error(`LAWS_SPACECRAFT_PROGRAM_LINK_FAILED:${message}`);
  }
  return program;
}

const MESH_VERTEX_SHADER = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec3 aColor;
  attribute float aEmissive;
  uniform mat4 uModel;
  uniform mat4 uView;
  uniform mat4 uProjection;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vViewPosition;
  varying float vEmissive;
  void main() {
    vec4 world = uModel * vec4(aPosition, 1.0);
    vec4 view = uView * world;
    vNormal = normalize(mat3(uModel) * aNormal);
    vColor = aColor;
    vViewPosition = view.xyz;
    vEmissive = aEmissive;
    gl_Position = uProjection * view;
  }
`;

const MESH_FRAGMENT_SHADER = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vViewPosition;
  varying float vEmissive;
  uniform vec3 uLightDirection;
  uniform float uImpactGlow;
  uniform float uEnginePulse;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vViewPosition);
    float diffuse = max(0.0, dot(normal, normalize(uLightDirection)));
    float rim = pow(1.0 - max(0.0, dot(normal, viewDirection)), 2.35);
    float emission = vEmissive * (0.82 + uEnginePulse * 0.52) + uImpactGlow * 0.2;
    vec3 color = vColor * (0.22 + diffuse * 0.86) + vec3(0.35, 0.72, 1.0) * rim * 0.38;
    color += vColor * emission;
    gl_FragColor = vec4(color, 0.9);
  }
`;

const PARTICLE_VERTEX_SHADER = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSoft;
  uniform mat4 uView;
  uniform mat4 uProjection;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSoft;
  void main() {
    vec4 view = uView * vec4(aPosition, 1.0);
    gl_Position = uProjection * view;
    gl_PointSize = clamp(aSize / max(0.34, -view.z * 0.12), 1.0, 60.0);
    vColor = aColor;
    vAlpha = aAlpha;
    vSoft = aSoft;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSoft;
  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float radius = length(centered) * 2.0;
    if (radius > 1.0) discard;
    float hard = 1.0 - smoothstep(0.12, 1.0, radius);
    float soft = 1.0 - smoothstep(0.0, 1.0, radius);
    float alpha = mix(hard, soft * 0.52, vSoft) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function createBuffer(gl, target, values, usage = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, values, usage);
  return buffer;
}

function createRenderer(canvas, geometry) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: TEST_MODE,
    powerPreference: "high-performance"
  });
  if (!gl) throw new Error("LAWS_SPACECRAFT_WEBGL_UNAVAILABLE");

  const meshProgram = createProgram(gl, MESH_VERTEX_SHADER, MESH_FRAGMENT_SHADER);
  const particleProgram = createProgram(gl, PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER);
  const mesh = geometry.mesh;
  const indexArray = mesh.positions.length / 3 > 65535 ? new Uint32Array(mesh.indices) : new Uint16Array(mesh.indices);
  const indexType = indexArray instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
  if (indexType === gl.UNSIGNED_INT && !gl.getExtension("OES_element_index_uint")) {
    throw new Error("LAWS_SPACECRAFT_UINT_INDEX_EXTENSION_UNAVAILABLE");
  }

  const renderer = {
    gl,
    meshProgram,
    particleProgram,
    buffers: {
      position: createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(mesh.positions)),
      normal: createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(mesh.normals)),
      color: createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(mesh.colors)),
      emissive: createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(mesh.emissive)),
      index: createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexArray),
      particlePosition: gl.createBuffer(),
      particleColor: gl.createBuffer(),
      particleSize: gl.createBuffer(),
      particleAlpha: gl.createBuffer(),
      particleSoft: gl.createBuffer()
    },
    indexCount: indexArray.length,
    indexType,
    meshLocations: {
      position: gl.getAttribLocation(meshProgram, "aPosition"),
      normal: gl.getAttribLocation(meshProgram, "aNormal"),
      color: gl.getAttribLocation(meshProgram, "aColor"),
      emissive: gl.getAttribLocation(meshProgram, "aEmissive"),
      model: gl.getUniformLocation(meshProgram, "uModel"),
      view: gl.getUniformLocation(meshProgram, "uView"),
      projection: gl.getUniformLocation(meshProgram, "uProjection"),
      lightDirection: gl.getUniformLocation(meshProgram, "uLightDirection"),
      impactGlow: gl.getUniformLocation(meshProgram, "uImpactGlow"),
      enginePulse: gl.getUniformLocation(meshProgram, "uEnginePulse")
    },
    particleLocations: {
      position: gl.getAttribLocation(particleProgram, "aPosition"),
      color: gl.getAttribLocation(particleProgram, "aColor"),
      size: gl.getAttribLocation(particleProgram, "aSize"),
      alpha: gl.getAttribLocation(particleProgram, "aAlpha"),
      soft: gl.getAttribLocation(particleProgram, "aSoft"),
      view: gl.getUniformLocation(particleProgram, "uView"),
      projection: gl.getUniformLocation(particleProgram, "uProjection")
    }
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  return renderer;
}

function bindAttribute(gl, location, buffer, size) {
  if (location < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function drawMesh(renderer, craft, matrices, now) {
  const gl = renderer.gl;
  const locations = renderer.meshLocations;
  gl.useProgram(renderer.meshProgram);
  bindAttribute(gl, locations.position, renderer.buffers.position, 3);
  bindAttribute(gl, locations.normal, renderer.buffers.normal, 3);
  bindAttribute(gl, locations.color, renderer.buffers.color, 3);
  bindAttribute(gl, locations.emissive, renderer.buffers.emissive, 1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderer.buffers.index);
  gl.uniformMatrix4fv(locations.model, false, modelMatrix(craft));
  gl.uniformMatrix4fv(locations.view, false, matrices.view);
  gl.uniformMatrix4fv(locations.projection, false, matrices.projection);
  gl.uniform3f(locations.lightDirection, -0.32, 0.74, 0.58);
  gl.uniform1f(locations.impactGlow, craft.phase === "IMPACT" || craft.phase === "RECOVERY" ? 1 : 0);
  gl.uniform1f(locations.enginePulse, 0.5 + Math.sin(now * 0.006) * 0.5);
  gl.drawElements(gl.TRIANGLES, renderer.indexCount, renderer.indexType, 0);
}

function drawParticles(renderer, matrices) {
  const particles = state.particles.filter(particle => particle.life > 0);
  if (!particles.length) return;
  const positions = [];
  const colors = [];
  const sizes = [];
  const alphas = [];
  const soft = [];
  for (const particle of particles) {
    const progress = 1 - particle.life / particle.maxLife;
    positions.push(...particle.position);
    colors.push(...particle.color);
    sizes.push(particle.kind === "smoke" ? lerp(18, 40, progress) : lerp(17, 4, progress));
    alphas.push((particle.kind === "smoke" ? 0.3 : 0.92) * (1 - progress));
    soft.push(particle.kind === "smoke" ? 1 : 0);
  }
  const gl = renderer.gl;
  const locations = renderer.particleLocations;
  const upload = (buffer, values) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.DYNAMIC_DRAW);
  };
  upload(renderer.buffers.particlePosition, positions);
  upload(renderer.buffers.particleColor, colors);
  upload(renderer.buffers.particleSize, sizes);
  upload(renderer.buffers.particleAlpha, alphas);
  upload(renderer.buffers.particleSoft, soft);
  gl.useProgram(renderer.particleProgram);
  bindAttribute(gl, locations.position, renderer.buffers.particlePosition, 3);
  bindAttribute(gl, locations.color, renderer.buffers.particleColor, 3);
  bindAttribute(gl, locations.size, renderer.buffers.particleSize, 1);
  bindAttribute(gl, locations.alpha, renderer.buffers.particleAlpha, 1);
  bindAttribute(gl, locations.soft, renderer.buffers.particleSoft, 1);
  gl.uniformMatrix4fv(locations.view, false, matrices.view);
  gl.uniformMatrix4fv(locations.projection, false, matrices.projection);
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.drawArrays(gl.POINTS, 0, particles.length);
  gl.depthMask(true);
  gl.enable(gl.CULL_FACE);
}

function createHost() {
  const existing = document.getElementById(HOST_ID);
  if (existing) existing.remove();
  const host = document.createElement("div");
  host.id = HOST_ID;
  host.dataset.lawsSpacecraftBackgroundHost = "true";
  host.dataset.lawsSpacecraftAuthority = "presentation-and-hit-response-only";
  host.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  canvas.id = CANVAS_ID;
  canvas.dataset.lawsSpacecraftBackgroundLayer = "true";
  canvas.dataset.lawsSpacecraftAuthority = "presentation-and-hit-response-only";
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  host.append(canvas);
  const cosmos = document.getElementById("laws-background-cosmos-layer");
  if (cosmos?.parentNode) cosmos.after(host);
  else document.body.prepend(host);
  return { host, canvas };
}

function resize() {
  if (!state.canvas) return false;
  const width = Math.max(1, Math.round(globalThis.innerWidth || document.documentElement.clientWidth || 1));
  const height = Math.max(1, Math.round(globalThis.innerHeight || document.documentElement.clientHeight || 1));
  const cap = width <= 820 ? 1 : 1.25;
  const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap);
  if (width === state.width && height === state.height && pixelRatio === state.pixelRatio) return false;
  state.width = width;
  state.height = height;
  state.pixelRatio = pixelRatio;
  state.canvas.width = Math.max(1, Math.round(width * pixelRatio));
  state.canvas.height = Math.max(1, Math.round(height * pixelRatio));
  state.canvas.style.width = `${width}px`;
  state.canvas.style.height = `${height}px`;
  state.matrices = {
    view: lookAt(CAMERA_EYE, CAMERA_TARGET, [0, 1, 0]),
    projection: perspective(FOV, width / height, 0.1, 40)
  };
  publish({ lastAction: "spacecraft-background-resized" });
  return true;
}

function clear() {
  if (!state.renderer) return;
  const gl = state.renderer.gl;
  gl.viewport(0, 0, state.canvas.width, state.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function startFlight(now, immediate = false) {
  const craft = state.craft;
  craft.flightIndex += craft.nextLaunchTime ? 1 : 0;
  craft.path = makePath(craft.flightIndex);
  craft.startTime = now + (immediate ? 0 : randomBetween(createRandom(hash32(craft.flightIndex)), 2600, 6200));
  craft.duration = TEST_MODE ? 7600 : randomBetween(createRandom(hash32(craft.flightIndex ^ 0x777)), 8800, 13200);
  craft.nextLaunchTime = 0;
  craft.active = true;
  craft.visible = false;
  craft.phase = "APPROACH";
  craft.impactOffset = [0, 0, 0];
  craft.velocity = [0, 0, 0];
  craft.euler = [0, 0, 0];
  craft.angularVelocity = [0, 0, 0];
  craft.manualProgress = null;
}

function updateCraft(now, deltaSeconds) {
  const craft = state.craft;
  if (!craft.active) {
    if (now >= craft.nextLaunchTime) startFlight(now, true);
    return;
  }
  const rawProgress = craft.manualProgress === null ? (now - craft.startTime) / craft.duration : craft.manualProgress;
  if (rawProgress < 0) {
    craft.visible = false;
    craft.phase = "APPROACH";
    return;
  }
  if (rawProgress >= 1 && craft.manualProgress === null) {
    craft.visible = false;
    craft.active = false;
    craft.phase = "OFFSCREEN";
    craft.nextLaunchTime = now + (TEST_MODE ? 400 : 3600);
    return;
  }
  const progress = clamp(rawProgress, 0, 1);
  const smooth = progress * progress * (3 - 2 * progress);
  const pathPosition = cubicPoint(craft.path, smooth);
  craft.tangent = cubicTangent(craft.path, smooth);
  craft.velocity = scale(craft.velocity, Math.exp(-deltaSeconds * 2.2));
  craft.angularVelocity = scale(craft.angularVelocity, Math.exp(-deltaSeconds * 2.7));
  craft.impactOffset = add(craft.impactOffset, scale(craft.velocity, deltaSeconds));
  craft.impactOffset = scale(craft.impactOffset, Math.exp(-deltaSeconds * 1.25));
  craft.euler = add(craft.euler, scale(craft.angularVelocity, deltaSeconds));
  craft.euler = scale(craft.euler, Math.exp(-deltaSeconds * 1.05));
  craft.position = add(pathPosition, craft.impactOffset);
  craft.visible = progress > 0.025 && progress < 0.975;
  craft.scale = (state.width <= 560 ? 0.34 : 0.42) * lerp(0.82, 1.16, clamp((craft.position[2] + 1.5) / 2.6, 0, 1));
  if (now < craft.recoveryUntil) {
    craft.phase = now < craft.recoveryUntil - 1550 ? "IMPACT" : "RECOVERY";
  } else {
    craft.phase = progress < 0.14 ? "APPROACH" : progress > 0.86 ? "DEPARTURE" : "CRUISE";
  }
}

function updateParticles(deltaSeconds) {
  for (const particle of state.particles) {
    particle.life -= deltaSeconds;
    if (particle.life <= 0) continue;
    particle.velocity = scale(particle.velocity, Math.exp(-deltaSeconds * (particle.kind === "smoke" ? 1.4 : 2.8)));
    if (particle.kind === "smoke") particle.velocity[1] += deltaSeconds * 0.08;
    particle.position = add(particle.position, scale(particle.velocity, deltaSeconds));
  }
  state.particles = state.particles.filter(particle => particle.life > 0);
}

function projectCraft() {
  const craft = state.craft;
  if (!craft?.visible || !state.matrices) {
    if (craft) craft.projected = null;
    return null;
  }
  const viewPoint = transform(state.matrices.view, [...craft.position, 1]);
  const clip = transform(state.matrices.projection, viewPoint);
  if (!Number.isFinite(clip[3]) || clip[3] <= 0.01) {
    craft.projected = null;
    return null;
  }
  const ndcX = clip[0] / clip[3];
  const ndcY = clip[1] / clip[3];
  const x = (ndcX * 0.5 + 0.5) * state.width;
  const y = (1 - (ndcY * 0.5 + 0.5)) * state.height;
  const depth = Math.max(0.5, Math.abs(viewPoint[2]));
  const radius = clamp(
    (state.geometry.mesh.boundingRadius * craft.scale * state.height) / (2 * Math.tan(FOV / 2) * depth),
    state.width <= 560 ? 24 : 28,
    state.width <= 560 ? 54 : 72
  );
  const visible = x > -radius && x < state.width + radius && y > -radius && y < state.height + radius;
  craft.projected = visible ? Object.freeze({ x, y, radius, clipW: clip[3] }) : null;
  return craft.projected;
}

function frame(timestamp) {
  state.raf = 0;
  if (!canRun()) {
    stop();
    return;
  }
  const deltaSeconds = state.previousTime ? clamp((timestamp - state.previousTime) / 1000, 0, 0.05) : 0.016;
  state.previousTime = timestamp;
  resize();
  updateCraft(timestamp, deltaSeconds);
  updateParticles(deltaSeconds);
  projectCraft();
  clear();
  if (state.craft.visible) drawMesh(state.renderer, state.craft, state.matrices, timestamp);
  drawParticles(state.renderer, state.matrices);
  state.frameCount += 1;
  if (state.frameCount % 30 === 0) publish({ lastAction: "spacecraft-background-frame" });
  state.raf = requestAnimationFrame(frame);
}

function canRun() {
  return Boolean(
    state.initialized && !state.destroyed && !state.failed && !state.reducedMotion &&
    state.documentVisible && state.renderer && state.canvas
  );
}

function start() {
  if (!canRun() || state.running) return false;
  state.running = true;
  state.previousTime = 0;
  state.raf = requestAnimationFrame(frame);
  publish({ lastAction: "spacecraft-background-loop-started" });
  return true;
}

function stop() {
  state.running = false;
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = 0;
  state.previousTime = 0;
  clear();
  publish({ lastAction: "spacecraft-background-loop-stopped" });
  return true;
}

function spawnImpactParticles(position, impulse) {
  const random = createRandom(hash32((state.hitCount + 1) * 0x9e3779b9));
  const mobileFactor = state.width <= 560 ? 0.62 : 1;
  const sparkCount = Math.round(18 * mobileFactor);
  const smokeCount = Math.round(10 * mobileFactor);
  for (let index = 0; index < sparkCount; index += 1) {
    const jitter = normalize([randomBetween(random, -1, 1), randomBetween(random, -1, 1), randomBetween(random, -1, 1)]);
    const life = randomBetween(random, 0.42, 0.88);
    state.particles.push({
      kind: "spark",
      position: add(position, scale(jitter, 0.07)),
      velocity: add(scale(jitter, randomBetween(random, 0.55, 1.45)), scale(impulse, 0.42)),
      color: random() > 0.42 ? [0.45, 0.88, 1] : [1, 0.78, 0.34],
      life,
      maxLife: life
    });
  }
  for (let index = 0; index < smokeCount; index += 1) {
    const jitter = normalize([randomBetween(random, -0.6, 0.25), randomBetween(random, -0.25, 0.65), randomBetween(random, -0.6, 0.6)]);
    const life = randomBetween(random, 0.9, 1.7);
    state.particles.push({
      kind: "smoke",
      position: add(position, scale(jitter, 0.05)),
      velocity: add(scale(jitter, randomBetween(random, 0.10, 0.34)), scale(impulse, 0.12)),
      color: [0.42, 0.50, 0.58],
      life,
      maxLife: life
    });
  }
}

function applyImpact(pointerX, pointerY, now) {
  const craft = state.craft;
  const projected = craft?.projected;
  if (!projected || now < craft.invulnerableUntil) return false;
  const dx = clamp((pointerX - projected.x) / projected.radius, -1, 1);
  const dy = clamp((pointerY - projected.y) / projected.radius, -1, 1);
  const impulse = [dx * 0.88, -dy * 0.88, -0.24];
  craft.velocity = add(craft.velocity, impulse);
  craft.angularVelocity = add(craft.angularVelocity, [dy * 4.6, -dx * 3.9, (dx - dy) * 4.4]);
  craft.recoveryUntil = now + 2250;
  craft.invulnerableUntil = now + 900;
  craft.phase = "IMPACT";
  craft.hitCount += 1;
  state.hitCount += 1;
  spawnImpactParticles(craft.position, impulse);
  publish({ lastAction: "spacecraft-background-impact" });
  globalThis.dispatchEvent(new CustomEvent("LAWS_SPACECRAFT_IMPACT", {
    detail: Object.freeze({
      craftId: craft.id,
      hitCount: craft.hitCount,
      worldPosition: Object.freeze(craft.position.slice()),
      layer: "PAGE_BACKGROUND",
      destructive: false
    })
  }));
  return true;
}

function isBlockedTarget(target) {
  return Boolean(target?.closest?.(
    "a,button,summary,input,textarea,select,[role='button'],[role='tab'],[data-laws-interaction-target],[data-laws-object]"
  ));
}

function onPointerDown(event) {
  if (!state.craft?.projected || isBlockedTarget(event.target) || event.isPrimary === false) return;
  const projected = state.craft.projected;
  const distance = Math.hypot(event.clientX - projected.x, event.clientY - projected.y);
  if (distance > projected.radius * 1.28 + 10) return;
  state.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
}

function onPointerUp(event) {
  const pointer = state.pointer;
  state.pointer = null;
  if (!pointer || pointer.id !== event.pointerId || isBlockedTarget(event.target)) return;
  const travel = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
  const duration = performance.now() - pointer.time;
  if (travel > 12 || duration > 420) return;
  const projected = state.craft?.projected;
  if (!projected) return;
  const distance = Math.hypot(event.clientX - projected.x, event.clientY - projected.y);
  if (distance <= projected.radius * 1.28 + 10) applyImpact(event.clientX, event.clientY, performance.now());
}

function onPointerCancel() {
  state.pointer = null;
}

function resolveReducedMotion() {
  state.reducedMotion = Boolean(
    state.motionQuery?.matches || state.root?.dataset?.reducedMotion === "true" || state.root?.dataset?.lawsReducedMotion === "true"
  );
  if (state.canvas) state.canvas.hidden = state.reducedMotion;
  if (state.reducedMotion) stop();
  else start();
  publish({ lastAction: "spacecraft-background-motion-resolved" });
}

function installObservers() {
  state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
  state.motionQuery?.addEventListener?.("change", resolveReducedMotion);
  globalThis.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    state.documentVisible = !document.hidden;
    if (canRun()) start();
    else stop();
  });
  globalThis.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
  globalThis.addEventListener("pointerup", onPointerUp, { capture: true, passive: true });
  globalThis.addEventListener("pointercancel", onPointerCancel, { capture: true, passive: true });
}

function publish(extra = {}) {
  Object.assign(RECEIPT, {
    status: state.destroyed ? "destroyed" : state.failed ? "held" : state.initialized ? "available" : "pending",
    initialized: state.initialized,
    running: state.running,
    destroyed: state.destroyed,
    failed: state.failed,
    reducedMotion: state.reducedMotion,
    documentVisible: state.documentVisible,
    kernelFrameAdmitted: Boolean(state.geometry?.receipt?.westAdmitted),
    primitiveCount: state.geometry?.receipt?.primitiveCount || 0,
    vertexCount: state.geometry?.receipt?.vertexCount || 0,
    triangleCount: state.geometry?.receipt?.triangleCount || 0,
    activeCraftCount: state.craft?.visible ? 1 : 0,
    particleCount: state.particles.length,
    hitCount: state.hitCount,
    currentPhase: state.craft?.phase || "OFFSCREEN",
    backgroundHost: Boolean(state.host?.isConnected),
    compassChildCanvasCount: document.querySelectorAll("[data-laws-scene-field] canvas[data-laws-spacecraft-background-layer]").length,
    webGlAvailable: Boolean(state.renderer?.gl),
    lastError: state.lastError,
    ...extra
  });
  const frozen = Object.freeze({ ...RECEIPT });
  globalThis.DGB_LAWS_SPACECRAFT_RECEIPT = frozen;
  if (state.root) {
    state.root.dataset.lawsSpacecraftStatus = frozen.status;
    state.root.dataset.lawsSpacecraftContract = CONTRACT.id;
    state.root.dataset.lawsSpacecraftKernelAdmitted = String(frozen.kernelFrameAdmitted);
    state.root.dataset.lawsSpacecraftPhase = frozen.currentPhase;
    state.root.dataset.lawsSpacecraftLayer = "PAGE_BACKGROUND";
    state.root.dataset.lawsSpacecraftHitCount = String(frozen.hitCount);
    state.root.dataset.lawsSpacecraftVisualPassClaimed = "false";
  }
  return frozen;
}

function snapshot() {
  return Object.freeze({
    receipt: publish(),
    craft: state.craft ? Object.freeze({
      id: state.craft.id,
      visible: state.craft.visible,
      phase: state.craft.phase,
      layer: "PAGE_BACKGROUND",
      position: Object.freeze(state.craft.position.slice()),
      tangent: Object.freeze(state.craft.tangent.slice()),
      projected: state.craft.projected,
      hitCount: state.craft.hitCount,
      flightIndex: state.craft.flightIndex
    }) : null,
    particleCount: state.particles.length,
    testMode: TEST_MODE
  });
}

function verificationSetProgress(value) {
  if (!TEST_MODE || !state.craft) return false;
  state.craft.manualProgress = clamp(Number(value) || 0, 0.04, 0.96);
  if (!state.running && canRun()) start();
  return true;
}

function verificationHit() {
  if (!TEST_MODE || !state.craft?.projected) return false;
  return applyImpact(state.craft.projected.x, state.craft.projected.y, performance.now());
}

function destroy() {
  if (state.destroyed) return true;
  state.destroyed = true;
  stop();
  state.motionQuery?.removeEventListener?.("change", resolveReducedMotion);
  globalThis.removeEventListener("resize", resize);
  globalThis.removeEventListener("pointerdown", onPointerDown, true);
  globalThis.removeEventListener("pointerup", onPointerUp, true);
  globalThis.removeEventListener("pointercancel", onPointerCancel, true);
  state.host?.remove();
  state.particles.length = 0;
  publish({ lastAction: "spacecraft-background-destroyed" });
  return true;
}

function initialize() {
  if (state.initialized || state.destroyed) return publish();
  try {
    state.root = document.querySelector("[data-laws-root]");
    if (!state.root || !document.body) throw new Error("LAWS_SPACECRAFT_PAGE_SURFACE_MISSING");
    state.geometry = buildLawsSpacecraftGeometry();
    const created = createHost();
    state.host = created.host;
    state.canvas = created.canvas;
    state.renderer = createRenderer(state.canvas, state.geometry);
    state.craft = createCraft(performance.now());
    state.initialized = true;
    installObservers();
    resize();
    resolveReducedMotion();
    publish({ lastAction: "spacecraft-background-initialized" });
    globalThis.dispatchEvent(new CustomEvent("LAWS_SPACECRAFT_READY", {
      detail: Object.freeze({
        contractId: CONTRACT.id,
        geometryContractId: CONTRACT.geometryContractId,
        kernelFrameAdmitted: true,
        craftCount: CONTRACT.craftCount,
        host: "PAGE_BACKGROUND",
        visualPassClaimed: false
      })
    }));
    return publish();
  } catch (error) {
    state.failed = true;
    state.lastError = error?.message || String(error);
    publish({ lastAction: "spacecraft-background-initialization-failed" });
    globalThis.dispatchEvent(new CustomEvent("LAWS_SPACECRAFT_FAILURE", {
      detail: Object.freeze({ message: state.lastError })
    }));
    console.error(error);
    return publish();
  }
}

const api = Object.freeze({
  moduleId: CONTRACT.moduleId,
  moduleVersion: CONTRACT.id,
  contract: CONTRACT,
  initialize,
  start,
  stop,
  resize,
  receipt: () => publish(),
  snapshot,
  verificationSetProgress,
  verificationHit,
  destroy
});

globalThis.DGB_LAWS_SPACECRAFT = api;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
