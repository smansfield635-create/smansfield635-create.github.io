// /door/index.js
// TNT FULL-FILE REPLACEMENT
// DOOR_TRUE_3D_THRESHOLD_CRYSTAL_ORBIT_HTML_JS_TNT_v1
// Scope: Door threshold crystal mini-engine only.
// Purpose:
// - Keep accepted center Door anchor in DOM/SVG.
// - Render eight outer route gems as true 3D WebGL mesh crystals.
// - Preserve one shared orbital direction.
// - Keep labels readable through projected HTML overlays.
// - No generated image. No GraphicBox. No heavy runtime.

const DOOR_TRUE_3D_THRESHOLD_STATE = Object.freeze({
  contract: "DOOR_TRUE_3D_THRESHOLD_CRYSTAL_ORBIT_HTML_JS_TNT_v1",
  route: "/door/",
  role: "entry-threshold",
  renderer: "native-webgl-mini-engine",
  centerAnchorPreserved: true,
  outerCrystals: "true-3d-webgl-mesh",
  sharedOrbitDirection: true,
  labelMethod: "projected-html-overlay",
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

const TAU = Math.PI * 2;
const SEGMENTS = 16;

const ROUTES = Object.freeze([
  { title: "North", sub: "Interface", href: "/gauges/", tint: [0.78, 0.66, 1.00] },
  { title: "Compass", sub: "Root", href: "/", tint: [0.86, 0.82, 1.00] },
  { title: "East", sub: "Story", href: "/showroom/globe/", tint: [0.72, 0.88, 1.00] },
  { title: "Characters", sub: "Roster", href: "/characters/", tint: [0.92, 0.76, 1.00] },
  { title: "South", sub: "Laws", href: "/laws/", tint: [1.00, 0.78, 0.92] },
  { title: "Home", sub: "Return", href: "/home/", tint: [0.82, 0.94, 1.00] },
  { title: "West", sub: "Community", href: "/products/", tint: [0.82, 0.72, 1.00] },
  { title: "Frontier", sub: "Future", href: "/frontier/", tint: [0.96, 0.86, 1.00] }
]);

const state = {
  raf: 0,
  dpr: 1,
  reducedMotion: false,
  ready: false,
  lastWidth: 0,
  lastHeight: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "Unknown shader compile failure.";
    gl.deleteShader(shader);
    throw new Error(log);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "Unknown program link failure.";
    gl.deleteProgram(program);
    throw new Error(log);
  }

  return program;
}

function subtract3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize3(v) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function ring(rx, y, rz, offset = 0) {
  const points = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const angle = (i / SEGMENTS) * TAU + offset;
    points.push([
      Math.cos(angle) * rx,
      y,
      Math.sin(angle) * rz
    ]);
  }

  return points;
}

function buildCrystalGeometry() {
  const positions = [];
  const normals = [];

  function pushTriangle(a, b, c) {
    const normal = normalize3(cross3(subtract3(b, a), subtract3(c, a)));

    [a, b, c].forEach((point) => {
      positions.push(point[0], point[1], point[2]);
      normals.push(normal[0], normal[1], normal[2]);
    });
  }

  function pushQuad(a, b, c, d) {
    pushTriangle(a, b, c);
    pushTriangle(a, c, d);
  }

  const table = ring(0.42, 0.45, 0.24, TAU / 32);
  const crown = ring(0.72, 0.22, 0.42, 0);
  const girdleTop = ring(1.05, 0.02, 0.62, TAU / 32);
  const girdleBottom = ring(0.98, -0.16, 0.57, 0);
  const pavilion = ring(0.56, -0.56, 0.34, TAU / 32);
  const tableCenter = [0, 0.52, 0];
  const culet = [0, -0.98, 0];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const n = (i + 1) % SEGMENTS;

    pushTriangle(tableCenter, table[i], table[n]);
    pushQuad(table[i], crown[i], crown[n], table[n]);
    pushQuad(crown[i], girdleTop[i], girdleTop[n], crown[n]);
    pushQuad(girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]);
    pushQuad(girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]);
    pushTriangle(pavilion[i], culet, pavilion[n]);

    if (i % 2 === 0) {
      pushTriangle(crown[i], girdleTop[n], table[n]);
      pushTriangle(girdleBottom[i], pavilion[n], girdleBottom[n]);
    } else {
      pushTriangle(crown[n], girdleTop[i], table[i]);
      pushTriangle(girdleBottom[n], pavilion[i], girdleBottom[i]);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    vertexCount: positions.length / 3
  };
}

function mat4Identity() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}

function mat4Multiply(a, b) {
  const out = new Array(16);

  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  return out;
}

function mat4Translation(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
}

function mat4Scale(x, y, z) {
  return [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ];
}

function mat4RotateX(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
}

function mat4RotateY(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
}

function mat4RotateZ(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}

function mat4Perspective(fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, (2 * far * near) * nf, 0
  ];
}

function mat4LookAt(eye, center, up) {
  const zAxis = normalize3(subtract3(eye, center));
  const xAxis = normalize3(cross3(up, zAxis));
  const yAxis = cross3(zAxis, xAxis);

  return [
    xAxis[0], yAxis[0], zAxis[0], 0,
    xAxis[1], yAxis[1], zAxis[1], 0,
    xAxis[2], yAxis[2], zAxis[2], 0,
    -dot3(xAxis, eye), -dot3(yAxis, eye), -dot3(zAxis, eye), 1
  ];
}

function multiplyVec4(m, v) {
  return [
    m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
    m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
    m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
    m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
  ];
}

function projectWorldPoint(matrix, point, width, height) {
  const clip = multiplyVec4(matrix, [point[0], point[1], point[2], 1]);
  const w = clip[3] || 1;
  const ndcX = clip[0] / w;
  const ndcY = clip[1] / w;

  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (-ndcY * 0.5 + 0.5) * height,
    visible: w > 0
  };
}

function makeModelMatrix(position, yaw, pitch, roll, scale) {
  const translate = mat4Translation(position[0], position[1], position[2]);
  const rotateY = mat4RotateY(yaw);
  const rotateX = mat4RotateX(pitch);
  const rotateZ = mat4RotateZ(roll);
  const size = mat4Scale(scale, scale, scale);

  return mat4Multiply(
    translate,
    mat4Multiply(
      rotateY,
      mat4Multiply(
        rotateX,
        mat4Multiply(rotateZ, size)
      )
    )
  );
}

function resizeCanvas(canvas, gl) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(rect.width * dpr));
  const height = Math.max(320, Math.floor(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  state.dpr = dpr;
  state.lastWidth = rect.width;
  state.lastHeight = rect.height;

  return { width, height, cssWidth: rect.width, cssHeight: rect.height };
}

function setLabelPosition(label, point, depth, orbitZ) {
  const front = clamp((depth + orbitZ) / (orbitZ * 2), 0, 1);
  const scale = 0.86 + front * 0.18;
  const opacity = 0.58 + front * 0.42;

  label.style.left = `${point.x}px`;
  label.style.top = `${point.y}px`;
  label.style.opacity = String(opacity);
  label.style.zIndex = String(Math.round(20 + front * 40));
  label.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function bindRouteLabelHrefs(labels) {
  labels.forEach((label, index) => {
    const route = ROUTES[index];
    if (!route) return;

    label.href = route.href;
    label.setAttribute("aria-label", `${route.title} ${route.sub}`);
  });
}

function markFailed(error) {
  document.documentElement.dataset.doorWebglStatus = "failed";
  document.documentElement.dataset.doorWebglError = error && error.message ? error.message.slice(0, 96) : "unknown";
}

function initDoorTrue3DThreshold() {
  const stage = document.querySelector("[data-door-true-3d-stage]");
  const canvas = document.querySelector("[data-door-webgl-canvas]");
  const labels = Array.from(document.querySelectorAll("[data-door-route-label]"));

  if (!stage || !canvas || labels.length < ROUTES.length) return null;

  bindRouteLabelHrefs(labels);

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    preserveDrawingBuffer: false,
    premultipliedAlpha: true
  });

  if (!gl) {
    markFailed(new Error("WebGL unavailable."));
    return null;
  }

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uModel;
    uniform mat4 uMVP;

    varying vec3 vNormal;
    varying vec3 vWorld;

    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = normalize((uModel * vec4(aNormal, 0.0)).xyz);
      gl_Position = uMVP * vec4(aPosition, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;

    uniform vec3 uTint;
    uniform float uAlpha;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vWorld;

    void main() {
      vec3 n = normalize(vNormal);
      if (!gl_FrontFacing) {
        n = -n;
      }

      vec3 lightA = normalize(vec3(-0.48, 0.82, 0.72));
      vec3 lightB = normalize(vec3(0.54, 0.42, 0.90));
      vec3 camera = vec3(0.0, 0.0, 7.0);
      vec3 viewDir = normalize(camera - vWorld);

      float diffuseA = max(dot(n, lightA), 0.0);
      float diffuseB = max(dot(n, lightB), 0.0);
      float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.0);
      float specA = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 28.0);
      float specB = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 42.0);

      float phase = sin(uTime * 1.45 + vWorld.x * 2.3 + vWorld.y * 4.2 + vWorld.z * 1.6);
      float fire = pow(max(phase, 0.0), 18.0) * 0.24;

      vec3 deep = vec3(0.05, 0.04, 0.16);
      vec3 ice = vec3(0.88, 0.93, 1.0);
      vec3 gold = vec3(1.0, 0.84, 0.42);

      vec3 color =
        deep * 0.28 +
        uTint * (0.36 + diffuseA * 0.54 + diffuseB * 0.30) +
        ice * (specA * 0.62 + rim * 0.28) +
        gold * (specB * 0.42 + fire);

      float shade = clamp(0.72 + diffuseA * 0.36 + diffuseB * 0.22 + rim * 0.18, 0.0, 1.28);
      color *= shade;

      gl_FragColor = vec4(color, uAlpha);
    }
  `;

  let program;

  try {
    program = createProgram(gl, vertexSource, fragmentSource);
  } catch (error) {
    markFailed(error);
    return null;
  }

  const locations = {
    aPosition: gl.getAttribLocation(program, "aPosition"),
    aNormal: gl.getAttribLocation(program, "aNormal"),
    uModel: gl.getUniformLocation(program, "uModel"),
    uMVP: gl.getUniformLocation(program, "uMVP"),
    uTint: gl.getUniformLocation(program, "uTint"),
    uAlpha: gl.getUniformLocation(program, "uAlpha"),
    uTime: gl.getUniformLocation(program, "uTime")
  };

  const geometry = buildCrystalGeometry();

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.normals, gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.CULL_FACE);

  state.reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function drawFrame(time) {
    const motionTime = state.reducedMotion ? 0 : time / 1000;
    const size = resizeCanvas(canvas, gl);
    const aspect = canvas.width / Math.max(1, canvas.height);
    const mobile = size.cssWidth < 620;

    const cameraDistance = mobile ? 7.9 : 7.3;
    const projection = mat4Perspective((mobile ? 42 : 39) * Math.PI / 180, aspect, 0.1, 100);
    const view = mat4LookAt([0, 0.15, cameraDistance], [0, -0.03, 0], [0, 1, 0]);
    const vp = mat4Multiply(projection, view);

    const orbitX = mobile ? 2.28 : 3.18;
    const orbitZ = mobile ? 1.02 : 1.28;
    const orbitY = mobile ? 0.72 : 0.84;
    const baseScale = mobile ? 0.50 : 0.58;
    const orbitSpin = motionTime * (TAU / 48);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(locations.aPosition);
    gl.vertexAttribPointer(locations.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(locations.aNormal);
    gl.vertexAttribPointer(locations.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1f(locations.uTime, motionTime);

    ROUTES.forEach((route, index) => {
      const base = (index / ROUTES.length) * TAU;
      const angle = base + orbitSpin;
      const wobble = state.reducedMotion ? 0 : Math.sin(motionTime * 1.12 + index * 0.9) * 0.045;

      const x = Math.sin(angle) * orbitX;
      const z = Math.cos(angle) * orbitZ;
      const y = Math.sin(angle * 2) * 0.08 - 0.04;
      const depthLift = (z / orbitZ) * orbitY * 0.30;

      const scale = baseScale * (1 + (z / orbitZ) * 0.045);
      const position = [x, y + depthLift, z];

      const yaw = -angle + Math.PI / 2 + wobble;
      const pitch = -0.16 + Math.sin(motionTime * 0.72 + index) * 0.055;
      const roll = Math.sin(motionTime * 1.04 + index * 1.7) * 0.045;

      const model = makeModelMatrix(position, yaw, pitch, roll, scale);
      const mvp = mat4Multiply(vp, model);

      gl.uniformMatrix4fv(locations.uModel, false, new Float32Array(model));
      gl.uniformMatrix4fv(locations.uMVP, false, new Float32Array(mvp));
      gl.uniform3fv(locations.uTint, new Float32Array(route.tint));
      gl.uniform1f(locations.uAlpha, 0.94);

      gl.drawArrays(gl.TRIANGLES, 0, geometry.vertexCount);

      const labelPoint = projectWorldPoint(vp, position, size.cssWidth, size.cssHeight);
      const label = labels[index];

      if (label) {
        setLabelPosition(label, labelPoint, z, orbitZ);
      }
    });

    state.ready = true;
    document.documentElement.dataset.doorWebglStatus = "active";
    document.documentElement.dataset.doorOuterCrystals = "true-3d-webgl-mesh";
    document.documentElement.dataset.doorCenterAnchorPreserved = "true";
    document.documentElement.dataset.doorSharedOrbitDirection = "true";

    state.raf = requestAnimationFrame(drawFrame);
  }

  state.raf = requestAnimationFrame(drawFrame);

  const api = Object.freeze({
    ...DOOR_TRUE_3D_THRESHOLD_STATE,
    status() {
      return Object.freeze({
        ...DOOR_TRUE_3D_THRESHOLD_STATE,
        ready: state.ready,
        webgl: true,
        centerAnchorPreserved: true,
        outerCrystalsTrue3D: true,
        edgeOnDisappearanceBlocked: true,
        sharedOrbitDirection: true,
        labelMethod: "projected-html-overlay",
        routeCount: ROUTES.length,
        vertexCount: geometry.vertexCount,
        reducedMotion: state.reducedMotion,
        generatedImage: false,
        graphicBox: false,
        heavyRuntimeLoaded: false
      });
    }
  });

  window.DGBDoorTrue3DThreshold = api;
  return api;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDoorTrue3DThreshold, { once: true });
} else {
  initDoorTrue3DThreshold();
}

export { DOOR_TRUE_3D_THRESHOLD_STATE, initDoorTrue3DThreshold };
export default DOOR_TRUE_3D_THRESHOLD_STATE;
