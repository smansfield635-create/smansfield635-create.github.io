// /door/index.js
// TNT FULL-FILE REPLACEMENT
// DOOR_TRUE_3D_SOLID_OPAQUE_ROUTE_GEM_MATERIAL_HTML_JS_TNT_v2
// Scope: Door threshold crystal mini-engine only.
// Role:
// - Preserve center Door gem as DOM/SVG gravity anchor.
// - Render eight outer route gems as solid opaque true 3D WebGL mesh crystals.
// - Keep one shared orbit direction.
// - Keep labels stabilized and front-facing.
// - Reduce translucent ghosting when route crystals cross.
// - No generated image. No GraphicBox. No heavy runtime.

const DOOR_SOLID_GEM_STATE = Object.freeze({
  contract: "DOOR_TRUE_3D_SOLID_OPAQUE_ROUTE_GEM_MATERIAL_HTML_JS_TNT_v2",
  route: "/door/",
  role: "entry-threshold",
  centerGem: "center-of-gravity",
  outerGems: "solid-opaque-true-3d-webgl-mesh",
  labelMethod: "stabilized-front-facing-html-overlay",
  sharedOrbitDirection: true,
  material: "solid-opaque-crystal-body",
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

const TAU = Math.PI * 2;
const SEGMENTS = 16;

const ROUTES = Object.freeze([
  { title: "North", sub: "Interface", href: "/gauges/", tint: [0.64, 0.48, 1.00] },
  { title: "Compass", sub: "Root", href: "/", tint: [0.74, 0.64, 1.00] },
  { title: "East", sub: "Story", href: "/showroom/globe/", tint: [0.48, 0.78, 1.00] },
  { title: "Characters", sub: "Roster", href: "/characters/", tint: [0.86, 0.48, 1.00] },
  { title: "South", sub: "Laws", href: "/laws/", tint: [1.00, 0.58, 0.86] },
  { title: "Home", sub: "Return", href: "/home/", tint: [0.60, 0.82, 1.00] },
  { title: "West", sub: "Community", href: "/products/", tint: [0.58, 0.42, 1.00] },
  { title: "Frontier", sub: "Future", href: "/frontier/", tint: [0.84, 0.66, 1.00] }
]);

const engineState = {
  raf: 0,
  ready: false,
  reducedMotion: false,
  dpr: 1,
  vertexCount: 0,
  lastStatus: "booting"
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize3(v) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
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

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "shader compile failed";
    gl.deleteShader(shader);
    throw new Error(message);
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
    const message = gl.getProgramInfoLog(program) || "program link failed";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function ring(rx, y, rz, offset = 0) {
  const out = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const angle = (i / SEGMENTS) * TAU + offset;
    out.push([
      Math.cos(angle) * rx,
      y,
      Math.sin(angle) * rz
    ]);
  }

  return out;
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

  const table = ring(0.42, 0.48, 0.26, TAU / 32);
  const crown = ring(0.72, 0.24, 0.44, 0);
  const girdleTop = ring(1.05, 0.03, 0.62, TAU / 32);
  const girdleBottom = ring(0.98, -0.16, 0.57, 0);
  const pavilion = ring(0.56, -0.58, 0.34, TAU / 32);
  const tableCenter = [0, 0.56, 0];
  const culet = [0, -1.02, 0];

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
    positions,
    normals,
    vertexCount: positions.length / 3
  };
}

function rotatePoint(point, yaw, pitch, roll) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);

  const x = point[0];
  const y = point[1];
  const z = point[2];

  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const y1 = y;

  const y2 = y1 * cp - z1 * sp;
  const z2 = y1 * sp + z1 * cp;
  const x2 = x1;

  return [
    x2 * cr - y2 * sr,
    x2 * sr + y2 * cr,
    z2
  ];
}

function transformGeometry(base, position, scale, yaw, pitch, roll) {
  const vertexCount = base.vertexCount;
  const worldPositions = new Float32Array(vertexCount * 3);
  const worldNormals = new Float32Array(vertexCount * 3);

  for (let i = 0; i < vertexCount; i += 1) {
    const pIndex = i * 3;

    const local = [
      base.positions[pIndex],
      base.positions[pIndex + 1],
      base.positions[pIndex + 2]
    ];

    const normal = [
      base.normals[pIndex],
      base.normals[pIndex + 1],
      base.normals[pIndex + 2]
    ];

    const rotated = rotatePoint(local, yaw, pitch, roll);
    const rotatedNormal = normalize3(rotatePoint(normal, yaw, pitch, roll));

    worldPositions[pIndex] = rotated[0] * scale + position[0];
    worldPositions[pIndex + 1] = rotated[1] * scale + position[1];
    worldPositions[pIndex + 2] = rotated[2] * scale + position[2];

    worldNormals[pIndex] = rotatedNormal[0];
    worldNormals[pIndex + 1] = rotatedNormal[1];
    worldNormals[pIndex + 2] = rotatedNormal[2];
  }

  return { worldPositions, worldNormals };
}

function projectPoint(point, width, height, aspect, sceneScale, cameraDistance) {
  const perspective = cameraDistance / (cameraDistance - point[2]);
  const clipX = (point[0] * sceneScale * perspective) / aspect;
  const clipY = point[1] * sceneScale * perspective;

  return {
    x: (clipX * 0.5 + 0.5) * width,
    y: (-clipY * 0.5 + 0.5) * height,
    perspective
  };
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

  engineState.dpr = dpr;

  return {
    pixelWidth: width,
    pixelHeight: height,
    cssWidth: Math.max(320, rect.width),
    cssHeight: Math.max(320, rect.height),
    aspect: width / Math.max(1, height)
  };
}

function setBootDataset(status) {
  engineState.lastStatus = status;
  document.documentElement.dataset.doorWebglStatus = status;
  document.documentElement.dataset.doorCenterGravity = "true";
  document.documentElement.dataset.doorOuterGems = "solid-opaque-true-3d-webgl-mesh";
  document.documentElement.dataset.doorLabelsStabilized = "true";
  document.documentElement.dataset.doorGemMaterial = "solid-opaque-crystal-body";
}

function markFailed(error) {
  setBootDataset("failed");
  document.documentElement.dataset.doorWebglError = error && error.message ? error.message.slice(0, 120) : "unknown";
}

function placeFallbackLabels(labels) {
  labels.forEach((label, index) => {
    const angle = (index / Math.max(1, labels.length)) * TAU - Math.PI / 2;
    const x = 50 + Math.cos(angle) * 32;
    const y = 50 + Math.sin(angle) * 32;

    label.style.left = `${x}%`;
    label.style.top = `${y}%`;
    label.style.opacity = "0.88";
    label.style.zIndex = String(30 + index);
    label.style.transform = "translate(-50%, -50%) scale(0.92)";
  });
}

function positionLabel(label, projected, z, orbitZ) {
  const front = clamp((z + orbitZ) / (orbitZ * 2), 0, 1);
  const scale = 0.86 + front * 0.18;
  const opacity = 0.58 + front * 0.42;

  label.style.left = `${projected.x}px`;
  label.style.top = `${projected.y}px`;
  label.style.opacity = String(opacity);
  label.style.zIndex = String(Math.round(30 + front * 40));
  label.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function initDoorSolidGemOrbit() {
  const stage = document.querySelector("[data-door-true-3d-stage]");
  const canvas = document.querySelector("[data-door-webgl-canvas]");
  const labels = Array.from(document.querySelectorAll("[data-door-route-label]"));

  if (!stage || !canvas || labels.length < ROUTES.length) return null;

  setBootDataset("booting");
  placeFallbackLabels(labels);

  labels.forEach((label, index) => {
    const route = ROUTES[index];
    if (!route) return;
    label.href = route.href;
    label.setAttribute("aria-label", `${route.title} ${route.sub}`);
  });

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false
  });

  if (!gl) {
    markFailed(new Error("WebGL unavailable"));
    return null;
  }

  const vertexSource = `
    attribute vec3 aWorld;
    attribute vec3 aNormal;

    uniform float uAspect;
    uniform float uSceneScale;
    uniform float uCameraDistance;

    varying vec3 vWorld;
    varying vec3 vNormal;

    void main() {
      float perspective = uCameraDistance / (uCameraDistance - aWorld.z);
      float clipX = (aWorld.x * uSceneScale * perspective) / uAspect;
      float clipY = aWorld.y * uSceneScale * perspective;
      float clipZ = (aWorld.z + 4.0) / 8.0;

      vWorld = aWorld;
      vNormal = normalize(aNormal);

      gl_Position = vec4(clipX, clipY, clipZ, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;

    uniform vec3 uTint;
    uniform float uTime;

    varying vec3 vWorld;
    varying vec3 vNormal;

    void main() {
      vec3 n = normalize(vNormal);

      vec3 lightA = normalize(vec3(-0.46, 0.86, 0.72));
      vec3 lightB = normalize(vec3(0.62, 0.38, 0.92));
      vec3 camera = vec3(0.0, 0.0, 5.8);
      vec3 viewDir = normalize(camera - vWorld);

      float diffuseA = max(dot(n, lightA), 0.0);
      float diffuseB = max(dot(n, lightB), 0.0);
      float face = max(dot(n, viewDir), 0.0);
      float rim = pow(1.0 - face, 2.2);
      float specA = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 34.0);
      float specB = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 52.0);
      float fire = pow(max(sin(uTime * 1.45 + vWorld.x * 2.6 + vWorld.y * 4.0 + vWorld.z * 1.8), 0.0), 22.0) * 0.12;

      float occlusion = clamp(0.56 + diffuseA * 0.34 + diffuseB * 0.20 + face * 0.18, 0.42, 1.16);
      float edgeDepth = clamp(rim * 0.55 + (1.0 - diffuseA) * 0.16, 0.0, 0.56);

      vec3 deepViolet = vec3(0.055, 0.035, 0.18);
      vec3 bodyViolet = mix(vec3(0.11, 0.07, 0.30), uTint, 0.54);
      vec3 ice = vec3(0.86, 0.92, 1.0);
      vec3 gold = vec3(1.0, 0.82, 0.42);

      vec3 body =
        deepViolet * 0.34 +
        bodyViolet * (0.72 + diffuseA * 0.42 + diffuseB * 0.22);

      vec3 highlight =
        ice * (specA * 0.58 + rim * 0.16) +
        gold * (specB * 0.30 + fire);

      vec3 color = body * occlusion + highlight;
      color = mix(color, deepViolet, edgeDepth * 0.32);
      color = clamp(color, 0.0, 1.0);

      gl_FragColor = vec4(color, 1.0);
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
    aWorld: gl.getAttribLocation(program, "aWorld"),
    aNormal: gl.getAttribLocation(program, "aNormal"),
    uAspect: gl.getUniformLocation(program, "uAspect"),
    uSceneScale: gl.getUniformLocation(program, "uSceneScale"),
    uCameraDistance: gl.getUniformLocation(program, "uCameraDistance"),
    uTint: gl.getUniformLocation(program, "uTint"),
    uTime: gl.getUniformLocation(program, "uTime")
  };

  const baseGeometry = buildCrystalGeometry();
  engineState.vertexCount = baseGeometry.vertexCount;

  const positionBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);

  engineState.reducedMotion = Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  function draw(time) {
    const t = engineState.reducedMotion ? 0 : time / 1000;
    const size = resizeCanvas(canvas, gl);
    const mobile = size.cssWidth < 620;
    const narrow = size.cssWidth < 460;

    const sceneScale = narrow ? 0.36 : mobile ? 0.33 : 0.30;
    const cameraDistance = 5.9;
    const orbitX = narrow ? 1.72 : mobile ? 1.92 : 2.78;
    const orbitY = narrow ? 1.42 : mobile ? 1.48 : 1.62;
    const orbitZ = narrow ? 0.70 : mobile ? 0.78 : 0.92;
    const gemScale = narrow ? 0.47 : mobile ? 0.51 : 0.58;

    const spin = t * (TAU / 54);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    gl.uniform1f(locations.uAspect, size.aspect);
    gl.uniform1f(locations.uSceneScale, sceneScale);
    gl.uniform1f(locations.uCameraDistance, cameraDistance);
    gl.uniform1f(locations.uTime, t);

    const drawOrder = ROUTES.map((route, index) => {
      const angle = (index / ROUTES.length) * TAU + spin - Math.PI / 2;
      const x = Math.cos(angle) * orbitX;
      const y = Math.sin(angle) * orbitY;
      const z = Math.sin(angle) * orbitZ;
      return { route, index, angle, position: [x, y, z], z };
    }).sort((a, b) => a.z - b.z);

    drawOrder.forEach((item) => {
      const wobble = engineState.reducedMotion ? 0 : Math.sin(t * 0.88 + item.index * 0.9) * 0.045;
      const localSpin = engineState.reducedMotion ? 0 : t * 0.62 + item.index * 0.72;

      const yaw = -item.angle + Math.PI / 2 + localSpin * 0.34;
      const pitch = -0.10 + Math.sin(t * 0.72 + item.index) * 0.07 + wobble;
      const roll = Math.sin(t * 0.96 + item.index * 1.7) * 0.08;

      const transformed = transformGeometry(
        baseGeometry,
        item.position,
        gemScale * (1 + (item.z / orbitZ) * 0.04),
        yaw,
        pitch,
        roll
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, transformed.worldPositions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(locations.aWorld);
      gl.vertexAttribPointer(locations.aWorld, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, transformed.worldNormals, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(locations.aNormal);
      gl.vertexAttribPointer(locations.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.uniform3fv(locations.uTint, new Float32Array(item.route.tint));

      gl.drawArrays(gl.TRIANGLES, 0, baseGeometry.vertexCount);
    });

    ROUTES.forEach((route, index) => {
      const angle = (index / ROUTES.length) * TAU + spin - Math.PI / 2;
      const x = Math.cos(angle) * orbitX;
      const y = Math.sin(angle) * orbitY;
      const z = Math.sin(angle) * orbitZ;

      const projected = projectPoint(
        [x, y, z],
        size.cssWidth,
        size.cssHeight,
        size.aspect,
        sceneScale,
        cameraDistance
      );

      const label = labels[index];
      if (label) positionLabel(label, projected, z, orbitZ);
    });

    engineState.ready = true;
    setBootDataset("active");

    engineState.raf = requestAnimationFrame(draw);
  }

  engineState.raf = requestAnimationFrame(draw);

  const api = Object.freeze({
    ...DOOR_SOLID_GEM_STATE,
    status() {
      return Object.freeze({
        ...DOOR_SOLID_GEM_STATE,
        ready: engineState.ready,
        webglStatus: engineState.lastStatus,
        centerGem: "center-of-gravity",
        outerGemsTrue3D: true,
        outerGemsOpaque: true,
        outerGemAlpha: 1,
        blendDisabledForGemBodies: true,
        depthTesting: true,
        labelsStabilized: true,
        labelsRotateWithGem: false,
        routeCount: ROUTES.length,
        vertexCount: engineState.vertexCount,
        reducedMotion: engineState.reducedMotion,
        generatedImage: false,
        graphicBox: false,
        heavyRuntimeLoaded: false
      });
    }
  });

  window.DGBDoorSolidGemOrbit = api;
  return api;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDoorSolidGemOrbit, { once: true });
} else {
  initDoorSolidGemOrbit();
}
