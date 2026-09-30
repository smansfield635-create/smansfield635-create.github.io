/**
 * Laws CP6 true-3D spacecraft participant.
 *
 * Owns only spacecraft geometry materialization, world-space flight,
 * spacecraft hit testing, bounded impact/recovery, and transient particles.
 * It does not own Laws navigation, controller state, routes, evidence,
 * records, claims, Compass geometry, or Compass interaction authority.
 */

import {
  LAWS_SPACECRAFT_GEOMETRY_CONTRACT,
  buildLawsSpacecraftGeometry
} from "./index.spacecraft.geometry.js";

const CONTRACT = Object.freeze({
  id: "LAWS_CP6_TRUE_3D_SPACECRAFT_PARTICIPANT_v1",
  moduleId: "DGB_LAWS_SPACECRAFT",
  geometryContractId: LAWS_SPACECRAFT_GEOMETRY_CONTRACT.id,
  requiredCompositorModuleId: "DGB_LAWS_COMPOSITOR",
  requiredCompositorVersion: "1.0.0-camera-depth-layer-orchestration",
  craftCount: 1,
  visualPassClaimed: false,
  productionAuthorized: false,
  deploymentAuthorized: false
});

const STYLE_ID = "laws-cp6-spacecraft-runtime-style";
const REAR_LAYER = "REAR";
const FRONT_LAYER = "FRONT";
const TEST_MODE = new URLSearchParams(globalThis.location?.search || "").get("lawsSpacecraftTest") === "1";

const state = {
  initialized: false,
  destroyed: false,
  failed: false,
  running: false,
  documentVisible: !document.hidden,
  sceneVisible: false,
  reducedMotion: false,
  root: null,
  field: null,
  scene: null,
  compositor: null,
  geometry: null,
  rearCanvas: null,
  frontCanvas: null,
  rearRenderer: null,
  frontRenderer: null,
  resizeObserver: null,
  intersectionObserver: null,
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
  lastError: "",
  testMode: TEST_MODE
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
  documentVisible: state.documentVisible,
  sceneVisible: false,
  reducedMotion: false,
  kernelFrameAdmitted: false,
  primitiveCount: 0,
  vertexCount: 0,
  triangleCount: 0,
  craftCount: CONTRACT.craftCount,
  activeCraftCount: 0,
  particleCount: 0,
  hitCount: 0,
  currentLayer: "",
  currentPhase: "OFFSCREEN",
  rearWebGlAvailable: false,
  frontWebGlAvailable: false,
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
  if (!Number.isFinite(magnitude) || magnitude < 1e-8) {
    return fallback.slice();
  }
  return scale(vector, 1 / magnitude);
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

function makePath(flightIndex) {
  const random = createRandom(hash32(0x53485031 ^ flightIndex));
  const reverse = flightIndex % 2 === 1;
  const zDirection = flightIndex % 3 === 0 ? 1 : -1;
  const start = reverse
    ? [4.4, randomBetween(random, -0.85, 0.85), zDirection * 2.35]
    : [-4.4, randomBetween(random, -0.85, 0.85), zDirection * -2.35];
  const end = reverse
    ? [-4.4, randomBetween(random, -0.70, 0.75), zDirection * -2.55]
    : [4.4, randomBetween(random, -0.70, 0.75), zDirection * 2.55];
  const direction = subtract(end, start);
  return Object.freeze({
    start: Object.freeze(start),
    control1: Object.freeze(add(start, [direction[0] * 0.31, randomBetween(random, 0.25, 1.10), direction[2] * 0.18])),
    control2: Object.freeze(add(start, [direction[0] * 0.69, randomBetween(random, -1.05, -0.20), direction[2] * 0.78])),
    end: Object.freeze(end)
  });
}

function createCraft(now) {
  return {
    id: "DGB_SCOUTCRAFT_01_A",
    active: true,
    visible: false,
    phase: "APPROACH",
    layer: REAR_LAYER,
    flightIndex: 0,
    path: makePath(0),
    startTime: now + (TEST_MODE ? 100 : 1600),
    duration: TEST_MODE ? 7800 : 11800,
    nextLaunchTime: 0,
    manualProgress: null,
    position: [-4.4, 0, -2.35],
    tangent: [1, 0, 0],
    scale: 0.58,
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

function installStyle() {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.append(style);
  }
  style.textContent = `
    [data-laws-spacecraft-layer] {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
      user-select: none;
      contain: strict;
    }
    [data-laws-spacecraft-layer="rear"] { z-index: 1; }
    [data-laws-spacecraft-layer="front"] { z-index: 3; }
    [data-laws-spacecraft-layer][hidden] { display: none !important; }
    @media (prefers-reduced-motion: reduce) {
      [data-laws-spacecraft-layer] { display: none !important; }
    }
  `;
}

function createCanvas(layerName) {
  const canvas = document.createElement("canvas");
  canvas.dataset.lawsSpacecraftLayer = layerName.toLowerCase();
  canvas.dataset.lawsSpacecraftAuthority = "presentation-and-hit-response-only";
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  canvas.style.pointerEvents = "none";
  return canvas;
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
    float emission = vEmissive * (0.78 + uEnginePulse * 0.46) + uImpactGlow * 0.18;
    vec3 color = vColor * (0.24 + diffuse * 0.82) + vec3(0.35, 0.72, 1.0) * rim * 0.34;
    color += vColor * emission;
    gl_FragColor = vec4(color, 0.97);
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
    gl_PointSize = clamp(aSize / max(0.32, -view.z * 0.12), 1.0, 64.0);
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
    float alpha = mix(hard, soft * 0.56, vSoft) * vAlpha;
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
  if (!gl) {
    throw new Error("LAWS_SPACECRAFT_WEBGL_UNAVAILABLE");
  }

  const meshProgram = createProgram(gl, MESH_VERTEX_SHADER, MESH_FRAGMENT_SHADER);
  const particleProgram = createProgram(gl, PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER);
  const mesh = geometry.mesh;
  const indexArray = mesh.positions.length / 3 > 65535
    ? new Uint32Array(mesh.indices)
    : new Uint16Array(mesh.indices);
  const indexType = indexArray instanceof Uint32Array
    ? gl.UNSIGNED_INT
    : gl.UNSIGNED_SHORT;

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

function modelMatrix(craft) {
  let forward = rotateAroundAxis(craft.tangent, [0, 1, 0], craft.euler[1]);
  const provisionalRight = normalize(cross(forward, [0, 1, 0]), [0, 0, 1]);
  forward = normalize(rotateAroundAxis(forward, provisionalRight, craft.euler[0]));
  const referenceUp = Math.abs(dot(forward, [0, 1, 0])) > 0.92 ? [0, 0, 1] : [0, 1, 0];
  let right = normalize(cross(forward, referenceUp), [0, 0, 1]);
  let up = normalize(cross(right, forward), [0, 1, 0]);
  const bank = craft.euler[2] + Math.sin(craft.position[0] * 0.42) * 0.16;
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

function drawMesh(renderer, craft, view, projection, now) {
  const gl = renderer.gl;
  const locations = renderer.meshLocations;
  gl.useProgram(renderer.meshProgram);
  bindAttribute(gl, locations.position, renderer.buffers.position, 3);
  bindAttribute(gl, locations.normal, renderer.buffers.normal, 3);
  bindAttribute(gl, locations.color, renderer.buffers.color, 3);
  bindAttribute(gl, locations.emissive, renderer.buffers.emissive, 1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderer.buffers.index);
  gl.uniformMatrix4fv(locations.model, false, modelMatrix(craft));
  gl.uniformMatrix4fv(locations.view, false, new Float32Array(view));
  gl.uniformMatrix4fv(locations.projection, false, new Float32Array(projection));
  gl.uniform3f(locations.lightDirection, -0.35, 0.72, 0.58);
  const impactGlow = craft.phase === "IMPACT" || craft.phase === "RECOVERY" ? 1 : 0;
  gl.uniform1f(locations.impactGlow, impactGlow);
  gl.uniform1f(locations.enginePulse, 0.5 + Math.sin(now * 0.006) * 0.5);
  gl.drawElements(gl.TRIANGLES, renderer.indexCount, renderer.indexType, 0);
}

function particlesForLayer(layer) {
  return state.particles.filter(particle => particle.layer === layer && particle.life > 0);
}

function drawParticles(renderer, particles, view, projection) {
  if (!particles.length) return;
  const gl = renderer.gl;
  const positions = [];
  const colors = [];
  const sizes = [];
  const alphas = [];
  const soft = [];

  for (const particle of particles) {
    const progress = 1 - particle.life / particle.maxLife;
    positions.push(...particle.position);
    colors.push(...particle.color);
    sizes.push(particle.kind === "smoke" ? lerp(18, 42, progress) : lerp(18, 5, progress));
    alphas.push((particle.kind === "smoke" ? 0.34 : 0.95) * (1 - progress));
    soft.push(particle.kind === "smoke" ? 1 : 0);
  }

  gl.useProgram(renderer.particleProgram);
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
  bindAttribute(gl, locations.position, renderer.buffers.particlePosition, 3);
  bindAttribute(gl, locations.color, renderer.buffers.particleColor, 3);
  bindAttribute(gl, locations.size, renderer.buffers.particleSize, 1);
  bindAttribute(gl, locations.alpha, renderer.buffers.particleAlpha, 1);
  bindAttribute(gl, locations.soft, renderer.buffers.particleSoft, 1);
  gl.uniformMatrix4fv(locations.view, false, new Float32Array(view));
  gl.uniformMatrix4fv(locations.projection, false, new Float32Array(projection));
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.drawArrays(gl.POINTS, 0, particles.length);
  gl.depthMask(true);
  gl.enable(gl.CULL_FACE);
}

function clearRenderer(renderer) {
  const gl = renderer.gl;
  gl.viewport(0, 0, renderer.gl.canvas.width, renderer.gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function resize() {
  if (!state.field || !state.rearCanvas || !state.frontCanvas) return false;
  const width = Math.max(1, Math.round(state.field.clientWidth || 1));
  const height = Math.max(1, Math.round(state.field.clientHeight || 1));
  const cap = width <= 820 ? 1 : 1.25;
  const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap);
  if (width === state.width && height === state.height && pixelRatio === state.pixelRatio) return false;
  state.width = width;
  state.height = height;
  state.pixelRatio = pixelRatio;
  for (const canvas of [state.rearCanvas, state.frontCanvas]) {
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
  publish({ lastAction: "spacecraft-resized" });
  return true;
}

function startFlight(now, immediate = false) {
  const craft = state.craft;
  craft.flightIndex += craft.nextLaunchTime ? 1 : 0;
  craft.path = makePath(craft.flightIndex);
  craft.startTime = now + (immediate ? 0 : randomBetween(createRandom(hash32(craft.flightIndex)), 2400, 6200));
  craft.duration = TEST_MODE ? 7800 : randomBetween(createRandom(hash32(craft.flightIndex ^ 0x777)), 9800, 14600);
  craft.nextLaunchTime = 0;
  craft.active = true;
  craft.visible = false;
  craft.phase = "APPROACH";
  craft.impactOffset = [0, 0, 0];
  craft.velocity = [0, 0, 0];
  craft.euler = [0, 0, 0];
  craft.angularVelocity = [0, 0, 0];
  craft.manualProgress = null;
  publish({ lastAction: "spacecraft-flight-scheduled" });
}

function updateCraft(now, deltaSeconds) {
  const craft = state.craft;
  if (!craft.active) {
    if (now >= craft.nextLaunchTime) startFlight(now, true);
    return;
  }

  const rawProgress = craft.manualProgress === null
    ? (now - craft.startTime) / craft.duration
    : craft.manualProgress;

  if (rawProgress < 0) {
    craft.visible = false;
    craft.phase = "APPROACH";
    return;
  }

  if (rawProgress >= 1 && craft.manualProgress === null) {
    craft.visible = false;
    craft.active = false;
    craft.phase = "OFFSCREEN";
    craft.nextLaunchTime = now + (TEST_MODE ? 400 : 4200);
    publish({ lastAction: "spacecraft-flight-completed" });
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
  craft.visible = progress > 0.035 && progress < 0.965;

  if (now < craft.recoveryUntil) {
    craft.phase = now < craft.recoveryUntil - 1650 ? "IMPACT" : "RECOVERY";
  } else {
    craft.phase = progress < 0.14 ? "APPROACH" : progress > 0.86 ? "DEPARTURE" : "CRUISE";
  }

  try {
    const classification = state.compositor.classifyDepth({
      worldPoint: craft.position,
      previousLayer: craft.layer
    });
    craft.layer = classification.layer;
  } catch (_) {
    craft.layer = REAR_LAYER;
  }
}

function updateParticles(deltaSeconds) {
  for (const particle of state.particles) {
    particle.life -= deltaSeconds;
    if (particle.life <= 0) continue;
    particle.velocity = scale(
      particle.velocity,
      Math.exp(-deltaSeconds * (particle.kind === "smoke" ? 1.4 : 2.8))
    );
    if (particle.kind === "smoke") {
      particle.velocity[1] += deltaSeconds * 0.08;
    }
    particle.position = add(particle.position, scale(particle.velocity, deltaSeconds));
    try {
      particle.layer = state.compositor.classifyDepth({
        worldPoint: particle.position,
        previousLayer: particle.layer
      }).layer;
    } catch (_) {
      particle.layer = state.craft.layer;
    }
  }
  state.particles = state.particles.filter(particle => particle.life > 0);
}

function getMatrices() {
  try {
    return {
      view: state.compositor.getViewMatrix(),
      projection: state.compositor.getProjectionMatrix(),
      camera: state.compositor.getCamera()
    };
  } catch (_) {
    return null;
  }
}

function projectCraft(matrices) {
  const craft = state.craft;
  if (!craft.visible || !matrices) {
    craft.projected = null;
    return null;
  }
  try {
    const projected = state.compositor.projectWorldPoint(craft.position, {
      projectedRadius: 0,
      rejectionMargin: 0.45
    });
    if (!projected || !projected.visible) {
      craft.projected = null;
      return null;
    }
    const depth = Math.max(0.5, Math.abs(projected.clipW));
    const radius = clamp(
      (state.geometry.mesh.boundingRadius * craft.scale * state.height) /
        (2 * Math.tan(matrices.camera.fieldOfView / 2) * depth),
      18,
      state.width <= 560 ? 58 : 82
    );
    craft.projected = Object.freeze({ x: projected.x, y: projected.y, radius, clipW: projected.clipW });
    return craft.projected;
  } catch (_) {
    craft.projected = null;
    return null;
  }
}

function frame(timestamp) {
  state.raf = 0;
  if (!canRun()) {
    stop();
    return;
  }
  const deltaSeconds = state.previousTime
    ? clamp((timestamp - state.previousTime) / 1000, 0, 0.05)
    : 0.016;
  state.previousTime = timestamp;
  resize();
  updateCraft(timestamp, deltaSeconds);
  updateParticles(deltaSeconds);
  const matrices = getMatrices();
  if (matrices) {
    projectCraft(matrices);
    clearRenderer(state.rearRenderer);
    clearRenderer(state.frontRenderer);
    if (state.craft.visible) {
      const renderer = state.craft.layer === FRONT_LAYER ? state.frontRenderer : state.rearRenderer;
      drawMesh(renderer, state.craft, matrices.view, matrices.projection, timestamp);
    }
    drawParticles(state.rearRenderer, particlesForLayer(REAR_LAYER), matrices.view, matrices.projection);
    drawParticles(state.frontRenderer, particlesForLayer(FRONT_LAYER), matrices.view, matrices.projection);
  }
  state.frameCount += 1;
  if (state.frameCount % 30 === 0) publish({ lastAction: "spacecraft-frame" });
  state.raf = requestAnimationFrame(frame);
}

function canRun() {
  return Boolean(
    state.initialized &&
    !state.destroyed &&
    !state.failed &&
    !state.reducedMotion &&
    state.documentVisible &&
    state.sceneVisible &&
    state.rearRenderer &&
    state.frontRenderer
  );
}

function start() {
  if (!canRun() || state.running) return false;
  state.running = true;
  state.previousTime = 0;
  state.raf = requestAnimationFrame(frame);
  publish({ lastAction: "spacecraft-loop-started" });
  return true;
}

function stop() {
  state.running = false;
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = 0;
  state.previousTime = 0;
  if (state.rearRenderer) clearRenderer(state.rearRenderer);
  if (state.frontRenderer) clearRenderer(state.frontRenderer);
  publish({ lastAction: "spacecraft-loop-stopped" });
  return true;
}

function spawnImpactParticles(position, impulse, layer) {
  const random = createRandom(hash32((state.hitCount + 1) * 0x9e3779b9));
  const mobileFactor = state.width <= 560 ? 0.62 : 1;
  const sparkCount = Math.round(18 * mobileFactor);
  const smokeCount = Math.round(10 * mobileFactor);
  for (let index = 0; index < sparkCount; index += 1) {
    const jitter = normalize([
      randomBetween(random, -1, 1),
      randomBetween(random, -1, 1),
      randomBetween(random, -1, 1)
    ]);
    state.particles.push({
      kind: "spark",
      position: add(position, scale(jitter, 0.07)),
      velocity: add(scale(jitter, randomBetween(random, 0.55, 1.45)), scale(impulse, 0.42)),
      color: random() > 0.42 ? [0.45, 0.88, 1] : [1, 0.78, 0.34],
      life: randomBetween(random, 0.42, 0.88),
      maxLife: 0,
      layer
    });
    state.particles[state.particles.length - 1].maxLife = state.particles[state.particles.length - 1].life;
  }
  for (let index = 0; index < smokeCount; index += 1) {
    const jitter = normalize([
      randomBetween(random, -0.6, 0.25),
      randomBetween(random, -0.25, 0.65),
      randomBetween(random, -0.6, 0.6)
    ]);
    state.particles.push({
      kind: "smoke",
      position: add(position, scale(jitter, 0.05)),
      velocity: add(scale(jitter, randomBetween(random, 0.10, 0.34)), scale(impulse, 0.12)),
      color: [0.42, 0.50, 0.58],
      life: randomBetween(random, 0.9, 1.7),
      maxLife: 0,
      layer
    });
    state.particles[state.particles.length - 1].maxLife = state.particles[state.particles.length - 1].life;
  }
}

function cameraBasis() {
  try {
    const camera = state.compositor.getCamera();
    const forward = normalize(subtract(camera.target, camera.eye), [0, 0, -1]);
    const right = normalize(cross(forward, [0, 1, 0]), [1, 0, 0]);
    const up = normalize(cross(right, forward), [0, 1, 0]);
    return { forward, right, up };
  } catch (_) {
    return { forward: [0, 0, -1], right: [1, 0, 0], up: [0, 1, 0] };
  }
}

function applyImpact(pointerX, pointerY, now) {
  const craft = state.craft;
  const projected = craft.projected;
  if (!projected || now < craft.invulnerableUntil) return false;
  const dx = clamp((pointerX - projected.x) / projected.radius, -1, 1);
  const dy = clamp((pointerY - projected.y) / projected.radius, -1, 1);
  const basis = cameraBasis();
  const impulse = add(
    add(scale(basis.right, -dx * 0.88), scale(basis.up, dy * 0.88)),
    scale(basis.forward, -0.22)
  );
  craft.velocity = add(craft.velocity, impulse);
  craft.angularVelocity = add(craft.angularVelocity, [dy * 4.6, -dx * 3.9, (dx - dy) * 4.4]);
  craft.recoveryUntil = now + 2250;
  craft.invulnerableUntil = now + 900;
  craft.phase = "IMPACT";
  craft.hitCount += 1;
  state.hitCount += 1;
  spawnImpactParticles(craft.position, impulse, craft.layer);
  publish({ lastAction: "spacecraft-impact" });
  globalThis.dispatchEvent(new CustomEvent("LAWS_SPACECRAFT_IMPACT", {
    detail: Object.freeze({
      craftId: craft.id,
      hitCount: craft.hitCount,
      worldPosition: Object.freeze(craft.position.slice()),
      layer: craft.layer,
      destructive: false
    })
  }));
  return true;
}

function isBlockedTarget(target) {
  return Boolean(target?.closest?.(
    "a,button,summary,input,textarea,select,[role='button'],[data-laws-interaction-target],[data-laws-object]"
  ));
}

function onPointerDown(event) {
  if (!state.craft?.projected || isBlockedTarget(event.target)) return;
  state.pointer = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
    blocked: false
  };
}

function onPointerUp(event) {
  const pointer = state.pointer;
  state.pointer = null;
  if (!pointer || pointer.id !== event.pointerId || pointer.blocked || isBlockedTarget(event.target)) return;
  const travel = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
  const duration = performance.now() - pointer.time;
  if (travel > 12 || duration > 420) return;
  const projected = state.craft.projected;
  if (!projected) return;
  const distance = Math.hypot(event.clientX - projected.x, event.clientY - projected.y);
  if (distance <= projected.radius * 1.22 + 8) {
    applyImpact(event.clientX, event.clientY, performance.now());
  }
}

function onPointerCancel() {
  state.pointer = null;
}

function resolveReducedMotion() {
  state.reducedMotion = Boolean(
    state.motionQuery?.matches ||
    state.root?.dataset?.reducedMotion === "true" ||
    state.root?.dataset?.lawsReducedMotion === "true"
  );
  for (const canvas of [state.rearCanvas, state.frontCanvas]) {
    if (canvas) canvas.hidden = state.reducedMotion;
  }
  if (state.reducedMotion) stop();
  else if (canRun()) start();
  publish({ lastAction: "spacecraft-motion-resolved" });
}

function installObservers() {
  state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
  state.motionQuery?.addEventListener?.("change", resolveReducedMotion);
  state.resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(resize)
    : null;
  state.resizeObserver?.observe(state.field);

  if (typeof IntersectionObserver === "function") {
    state.intersectionObserver = new IntersectionObserver(entries => {
      state.sceneVisible = entries.some(entry => entry.isIntersecting);
      if (canRun()) start();
      else stop();
      publish({ lastAction: "spacecraft-visibility-updated" });
    }, { root: null, threshold: 0.02, rootMargin: "180px 0px" });
    state.intersectionObserver.observe(state.scene);
  } else {
    state.sceneVisible = true;
  }

  document.addEventListener("visibilitychange", () => {
    state.documentVisible = !document.hidden;
    if (canRun()) start();
    else stop();
  });

  state.field.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
  state.field.addEventListener("pointerup", onPointerUp, { capture: true, passive: true });
  state.field.addEventListener("pointercancel", onPointerCancel, { capture: true, passive: true });
}

function publish(extra = {}) {
  Object.assign(RECEIPT, {
    status: state.destroyed ? "destroyed" : state.failed ? "held" : state.initialized ? "available" : "pending",
    initialized: state.initialized,
    running: state.running,
    destroyed: state.destroyed,
    failed: state.failed,
    documentVisible: state.documentVisible,
    sceneVisible: state.sceneVisible,
    reducedMotion: state.reducedMotion,
    kernelFrameAdmitted: Boolean(state.geometry?.receipt?.westAdmitted),
    primitiveCount: state.geometry?.receipt?.primitiveCount || 0,
    vertexCount: state.geometry?.receipt?.vertexCount || 0,
    triangleCount: state.geometry?.receipt?.triangleCount || 0,
    activeCraftCount: state.craft?.visible ? 1 : 0,
    particleCount: state.particles.length,
    hitCount: state.hitCount,
    currentLayer: state.craft?.layer || "",
    currentPhase: state.craft?.phase || "OFFSCREEN",
    rearWebGlAvailable: Boolean(state.rearRenderer?.gl),
    frontWebGlAvailable: Boolean(state.frontRenderer?.gl),
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
    state.root.dataset.lawsSpacecraftLayer = frozen.currentLayer;
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
      layer: state.craft.layer,
      position: Object.freeze(state.craft.position.slice()),
      tangent: Object.freeze(state.craft.tangent.slice()),
      projected: state.craft.projected,
      hitCount: state.craft.hitCount,
      flightIndex: state.craft.flightIndex
    }) : null,
    particleCount: state.particles.length,
    testMode: state.testMode
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
  state.resizeObserver?.disconnect();
  state.intersectionObserver?.disconnect();
  state.motionQuery?.removeEventListener?.("change", resolveReducedMotion);
  state.field?.removeEventListener("pointerdown", onPointerDown, true);
  state.field?.removeEventListener("pointerup", onPointerUp, true);
  state.field?.removeEventListener("pointercancel", onPointerCancel, true);
  state.rearCanvas?.remove();
  state.frontCanvas?.remove();
  document.getElementById(STYLE_ID)?.remove();
  state.particles.length = 0;
  publish({ lastAction: "spacecraft-destroyed" });
  return true;
}

function initialize() {
  if (state.initialized || state.destroyed) return publish();
  try {
    state.root = document.querySelector("[data-laws-root]");
    state.field = document.querySelector("[data-laws-scene-field]");
    state.scene = document.querySelector("[data-laws-scene]");
    state.compositor = globalThis.DGB_LAWS_COMPOSITOR;
    if (!state.root || !state.field || !state.scene) {
      throw new Error("LAWS_SPACECRAFT_DOM_SURFACE_MISSING");
    }
    if (
      !state.compositor ||
      state.compositor.moduleId !== CONTRACT.requiredCompositorModuleId ||
      state.compositor.moduleVersion !== CONTRACT.requiredCompositorVersion
    ) {
      throw new Error("LAWS_SPACECRAFT_COMPOSITOR_CONTRACT_MISMATCH");
    }
    state.compositor.initialize();
    state.geometry = buildLawsSpacecraftGeometry();
    installStyle();
    state.rearCanvas = createCanvas(REAR_LAYER);
    state.frontCanvas = createCanvas(FRONT_LAYER);
    const compassLayer = state.field.querySelector("[data-laws-compass-layer]");
    const semanticLayer = state.field.querySelector("[data-laws-objects]");
    state.field.insertBefore(state.rearCanvas, compassLayer || state.field.firstChild);
    state.field.insertBefore(state.frontCanvas, semanticLayer || null);
    state.rearRenderer = createRenderer(state.rearCanvas, state.geometry);
    state.frontRenderer = createRenderer(state.frontCanvas, state.geometry);
    state.craft = createCraft(performance.now());
    state.initialized = true;
    installObservers();
    resize();
    resolveReducedMotion();
    if (!state.intersectionObserver) {
      state.sceneVisible = true;
      start();
    }
    publish({ lastAction: "spacecraft-initialized" });
    globalThis.dispatchEvent(new CustomEvent("LAWS_SPACECRAFT_READY", {
      detail: Object.freeze({
        contractId: CONTRACT.id,
        geometryContractId: CONTRACT.geometryContractId,
        kernelFrameAdmitted: true,
        craftCount: CONTRACT.craftCount,
        visualPassClaimed: false
      })
    }));
    return publish();
  } catch (error) {
    state.failed = true;
    state.lastError = error?.message || String(error);
    publish({ lastAction: "spacecraft-initialization-failed" });
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
