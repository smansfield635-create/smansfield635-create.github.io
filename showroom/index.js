// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_OBJECT_REINSTATEMENT_JS_ONLY_TNT_v1
// Pair held: SHOWROOM_DIAMOND_LATTICE_RESTORATION_REBASE_HTML_TNT_v1
// Scope: /showroom/ proof-object renderer only.
// Purpose:
// - Reinstate the visible, manipulable WebGL Crown Cut 256 Lattice Diamond.
// - Restore Crystal Form and Lattice Structure as the Showroom proof flex.
// - Preserve finger drag, momentum, double-tap reset, 16 radial metric, and 256 lattice claim.
// - Do not alter public page layout.
// - Do not inherit Audralia or planet-template standards.
// - No generated image. No GraphicBox. No visible diagnostics.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DIAMOND_OBJECT_REINSTATEMENT_JS_ONLY_TNT_v1",
  pairedHtmlContract: "SHOWROOM_DIAMOND_LATTICE_RESTORATION_REBASE_HTML_TNT_v1",
  route: "/showroom/",
  role: "showroom-visible-webgl-crown-cut-256-lattice-proof-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  renderer: "native-webgl",
  fallbackRenderer: "none",
  defaultLens: "crystal",
  secondaryLens: "lattice",
  lensRule: "toggle-changes-inspection-lens-not-object-identity",
  visibleRadialMetric: 16,
  latticeStates: 256,
  touchGlide: true,
  doubleTapReset: true,
  geometryMutableByTouch: false,
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  audraliaInheritance: false,
  planetTemplateInheritance: false,
  visualPassClaim: false
});

const TAU = Math.PI * 2;
const RADIAL_POINTS = 16;
const LATTICE_STATES = 256;

const LENS_COPY = Object.freeze({
  crystal: {
    title: "Crystal Form",
    route: "Crystal Form → WebGL true 3D Crown Cut Diamond · visible proof object",
    copy: "This view shows the finished Crown Cut Diamond as a true 3D crystal body: table, crown, faceted girdle, pavilion, culet, light, and touch inspection. This is the Showroom proof object. It proves the site can render interactive 3D content with a fixed form instead of a flat graphic."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → WebGL 16-point compass geometry · 256 lattice proof view",
    copy: "This view exposes the structural order beneath the Diamond. The 16-point compass metric organizes the visible geometry, while the 256 lattice expresses the deeper address system behind the form. The lens changes. The Diamond does not."
  }
});

const state = {
  lens: "crystal",
  yaw: -0.58,
  pitch: -0.24,
  roll: 0.02,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  time: 0,
  raf: 0,
  dpr: 1,

  stage: null,
  canvas: null,
  gl: null,

  solidProgram: null,
  lineProgram: null,
  pointProgram: null,

  crystalMesh: null,
  crystalEdges: null,
  crystalPoints: null,
  latticeGhost: null,
  latticeLines: null,
  latticePoints: null,

  canvasReady: false,
  glReady: false,
  initialized: false,
  errors: []
};

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, finite(value, min)));
}

function makePoint(x, y, z) {
  return [x, y, z];
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

function normalize3(v) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function faceNormal(a, b, c) {
  return normalize3(cross3(subtract3(b, a), subtract3(c, a)));
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) || "Shader compile failed.";
    gl.deleteShader(shader);
    throw new Error(error);
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
    const error = gl.getProgramInfoLog(program) || "Program link failed.";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  return program;
}

function createBuffer(gl, data, target = gl.ARRAY_BUFFER) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  return buffer;
}

function bindAttribute(gl, buffer, location, size) {
  if (location < 0 || !buffer) return;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function getAttrib(gl, program, name) {
  return gl.getAttribLocation(program, name);
}

function getUniform(gl, program, name) {
  return gl.getUniformLocation(program, name);
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);

  state.errors.push({
    scope,
    message,
    time: new Date().toISOString()
  });

  document.documentElement.dataset.showroomDiamondError = message;
}

function buildDiamondGeometry() {
  const table = [];
  const crownInner = [];
  const crownOuter = [];
  const girdleTop = [];
  const girdleBottom = [];
  const pavilion = [];
  const culetRing = [];

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const angle = (i / RADIAL_POINTS) * TAU;
    const compassCut = i % 2 === 0 ? 1 : 0.93;
    const cardinalBoost = i % 4 === 0 ? 1.04 : 1;

    table.push(makePoint(Math.cos(angle) * 0.34 * compassCut, 0.56, Math.sin(angle) * 0.34 * compassCut));
    crownInner.push(makePoint(Math.cos(angle) * 0.52 * compassCut, 0.38, Math.sin(angle) * 0.52 * compassCut));
    crownOuter.push(makePoint(Math.cos(angle) * 0.78 * compassCut * cardinalBoost, 0.12, Math.sin(angle) * 0.78 * compassCut * cardinalBoost));
    girdleTop.push(makePoint(Math.cos(angle) * 1.08 * compassCut * cardinalBoost, -0.04, Math.sin(angle) * 1.08 * compassCut * cardinalBoost));
    girdleBottom.push(makePoint(Math.cos(angle) * 1.02 * compassCut * cardinalBoost, -0.20, Math.sin(angle) * 1.02 * compassCut * cardinalBoost));
    pavilion.push(makePoint(Math.cos(angle) * 0.50 * compassCut, -0.60, Math.sin(angle) * 0.50 * compassCut));
    culetRing.push(makePoint(Math.cos(angle) * 0.12 * compassCut, -0.84, Math.sin(angle) * 0.12 * compassCut));
  }

  const tableCenter = makePoint(0, 0.62, 0);
  const culet = makePoint(0, -1.02, 0);

  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];
  const edgePositions = [];
  const pointPositions = [];

  const colorMap = Object.freeze({
    table: [0.94, 0.99, 1.0, 0.86],
    crown: [0.70, 0.90, 1.0, 0.74],
    shoulder: [0.52, 0.72, 0.98, 0.66],
    girdle: [0.92, 0.98, 1.0, 0.62],
    pavilion: [0.25, 0.44, 0.78, 0.76],
    culet: [0.78, 0.92, 1.0, 0.56]
  });

  function addVertex(vertex, normal, color) {
    const index = positions.length / 3;

    positions.push(vertex[0], vertex[1], vertex[2]);
    normals.push(normal[0], normal[1], normal[2]);
    colors.push(color[0], color[1], color[2], color[3]);

    return index;
  }

  function pushEdge(a, b) {
    edgePositions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  }

  function pushPoint(point) {
    pointPositions.push(point[0], point[1], point[2]);
  }

  function addTriangle(a, b, c, colorName) {
    const normal = faceNormal(a, b, c);
    const color = colorMap[colorName] || colorMap.crown;

    const ia = addVertex(a, normal, color);
    const ib = addVertex(b, normal, color);
    const ic = addVertex(c, normal, color);

    indices.push(ia, ib, ic);

    pushEdge(a, b);
    pushEdge(b, c);
    pushEdge(c, a);
  }

  function addQuad(a, b, c, d, colorName) {
    addTriangle(a, b, c, colorName);
    addTriangle(a, c, d, colorName);
  }

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const n = (i + 1) % RADIAL_POINTS;

    addTriangle(tableCenter, table[i], table[n], "table");
    addQuad(table[i], crownInner[i], crownInner[n], table[n], "table");
    addQuad(crownInner[i], crownOuter[i], crownOuter[n], crownInner[n], "crown");
    addQuad(crownOuter[i], girdleTop[i], girdleTop[n], crownOuter[n], "shoulder");
    addQuad(girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n], "girdle");
    addQuad(girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n], "pavilion");
    addQuad(pavilion[i], culetRing[i], culetRing[n], pavilion[n], "pavilion");
    addTriangle(culetRing[i], culet, culetRing[n], "culet");

    pushEdge(table[i], crownInner[i]);
    pushEdge(crownInner[i], crownOuter[i]);
    pushEdge(crownOuter[i], girdleTop[i]);
    pushEdge(girdleTop[i], girdleBottom[i]);
    pushEdge(girdleBottom[i], pavilion[i]);
    pushEdge(pavilion[i], culetRing[i]);
    pushEdge(culetRing[i], culet);

    pushPoint(table[i]);
    pushPoint(crownInner[i]);
    pushPoint(crownOuter[i]);
    pushPoint(girdleTop[i]);
    pushPoint(girdleBottom[i]);
    pushPoint(pavilion[i]);
    pushPoint(culetRing[i]);
  }

  pushPoint(tableCenter);
  pushPoint(culet);

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
    edgePositions: new Float32Array(edgePositions),
    pointPositions: new Float32Array(pointPositions)
  };
}

function buildLatticeGeometry() {
  const lines = [];
  const points = [];

  const ringDefs = [
    [0.22, 0.62],
    [0.34, 0.56],
    [0.52, 0.38],
    [0.78, 0.12],
    [1.08, -0.04],
    [1.02, -0.20],
    [0.50, -0.60],
    [0.12, -0.84]
  ];

  const rings = ringDefs.map(([radius, y], ringIndex) => {
    const ring = [];

    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      const angle = (i / RADIAL_POINTS) * TAU + (ringIndex % 2 ? TAU / 32 : 0);
      const compassCut = i % 2 === 0 ? 1 : 0.93;
      const cardinalBoost = i % 4 === 0 ? 1.04 : 1;
      const point = makePoint(
        Math.cos(angle) * radius * compassCut * cardinalBoost,
        y,
        Math.sin(angle) * radius * compassCut * cardinalBoost
      );

      ring.push(point);
      points.push(point);
    }

    return ring;
  });

  const centerTop = makePoint(0, 0.68, 0);
  const centerCore = makePoint(0, -0.04, 0);
  const centerBottom = makePoint(0, -1.02, 0);

  points.push(centerTop, centerCore, centerBottom);

  function pushLine(a, b) {
    lines.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  }

  for (const ring of rings) {
    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      pushLine(ring[i], ring[(i + 1) % RADIAL_POINTS]);
    }
  }

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    for (let r = 0; r < rings.length - 1; r += 1) {
      pushLine(rings[r][i], rings[r + 1][i]);
    }

    pushLine(centerTop, rings[3][i]);
    pushLine(centerCore, rings[4][i]);
    pushLine(centerBottom, rings[6][i]);

    if (i % 2 === 0) {
      pushLine(rings[0][i], rings[4][(i + 2) % RADIAL_POINTS]);
      pushLine(rings[2][i], rings[5][(i + 3) % RADIAL_POINTS]);
      pushLine(rings[4][i], rings[7][(i + 4) % RADIAL_POINTS]);
    }

    if (i % 4 === 0) {
      pushLine(rings[1][i], rings[6][(i + 8) % RADIAL_POINTS]);
      pushLine(rings[3][i], rings[5][(i + 4) % RADIAL_POINTS]);
    }
  }

  return {
    linePositions: new Float32Array(lines),
    pointPositions: new Float32Array(points.flat())
  };
}

function makeMesh(gl, geometry) {
  return {
    position: createBuffer(gl, geometry.positions),
    normal: createBuffer(gl, geometry.normals),
    color: createBuffer(gl, geometry.colors),
    index: createBuffer(gl, geometry.indices, gl.ELEMENT_ARRAY_BUFFER),
    count: geometry.indices.length
  };
}

function makeLineMesh(gl, positions) {
  return {
    position: createBuffer(gl, positions),
    count: positions.length / 3
  };
}

function makePointMesh(gl, positions) {
  return {
    position: createBuffer(gl, positions),
    count: positions.length / 3
  };
}

function initPrograms(gl) {
  const solidVertex = `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;

    uniform float uYaw;
    uniform float uPitch;
    uniform float uRoll;
    uniform float uScale;
    uniform float uOffsetY;
    uniform float uAspectFit;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec4 vColor;

    vec3 rotateX(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
    }

    vec3 rotateY(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
    }

    vec3 rotateZ(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
    }

    void main() {
      vec3 p = aPosition;
      vec3 n = aNormal;

      p = rotateY(p, uYaw);
      p = rotateX(p, uPitch);
      p = rotateZ(p, uRoll);

      n = rotateY(n, uYaw);
      n = rotateX(n, uPitch);
      n = rotateZ(n, uRoll);

      float perspective = 1.0 / (1.0 + max(0.0, p.z + 0.8) * 0.10);
      float x = p.x * uScale * uAspectFit * perspective;
      float y = p.y * uScale * perspective + uOffsetY;
      float z = 0.42 + p.z * 0.055;

      vNormal = normalize(n);
      vPosition = p;
      vColor = aColor;

      gl_Position = vec4(x, y, z, 1.0);
    }
  `;

  const solidFragment = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec4 vColor;

    uniform float uTime;
    uniform float uLens;

    void main() {
      vec3 n = normalize(vNormal);

      vec3 keyLight = normalize(vec3(-0.55, 0.72, 0.82));
      vec3 rimLight = normalize(vec3(0.82, 0.18, 0.48));
      vec3 underLight = normalize(vec3(-0.20, -0.82, 0.32));

      float key = max(dot(n, keyLight), 0.0);
      float rim = pow(max(dot(n, rimLight), 0.0), 1.45);
      float under = max(dot(n, underLight), 0.0);
      float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 1.8);
      float pulse = 0.5 + 0.5 * sin(uTime * 1.55 + vPosition.x * 7.0 + vPosition.y * 9.0 + vPosition.z * 5.0);

      vec3 deep = vec3(0.035, 0.08, 0.18);
      vec3 ice = vec3(0.80, 0.94, 1.0);
      vec3 gold = vec3(1.0, 0.78, 0.34);
      vec3 violet = vec3(0.78, 0.64, 1.0);

      float brilliance = key * 0.92 + rim * 0.72 + under * 0.18 + pulse * 0.12;
      vec3 color = mix(deep, vColor.rgb, clamp(brilliance + 0.22, 0.0, 1.0));
      color = mix(color, ice, clamp(key * 0.42 + fresnel * 0.12, 0.0, 0.68));
      color = mix(color, gold, clamp(rim * 0.18 + pulse * 0.055, 0.0, 0.24));
      color = mix(color, violet, clamp(fresnel * 0.16 + uLens * 0.06, 0.0, 0.22));

      float alpha = clamp(vColor.a + fresnel * 0.16 + key * 0.06 - uLens * 0.18, 0.24, 0.92);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const lineVertex = `
    precision mediump float;

    attribute vec3 aPosition;

    uniform float uYaw;
    uniform float uPitch;
    uniform float uRoll;
    uniform float uScale;
    uniform float uOffsetY;
    uniform float uAspectFit;
    uniform float uPointSize;

    varying float vDepth;
    varying float vSpark;

    vec3 rotateX(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
    }

    vec3 rotateY(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
    }

    vec3 rotateZ(vec3 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
    }

    void main() {
      vec3 p = aPosition;
      p = rotateY(p, uYaw);
      p = rotateX(p, uPitch);
      p = rotateZ(p, uRoll);

      float perspective = 1.0 / (1.0 + max(0.0, p.z + 0.8) * 0.10);
      float x = p.x * uScale * uAspectFit * perspective;
      float y = p.y * uScale * perspective + uOffsetY;
      float z = 0.42 + p.z * 0.055;

      vDepth = clamp((p.z + 1.2) / 2.4, 0.0, 1.0);
      vSpark = clamp((p.y + 1.1) / 1.9, 0.0, 1.0);

      gl_Position = vec4(x, y, z, 1.0);
      gl_PointSize = uPointSize;
    }
  `;

  const lineFragment = `
    precision mediump float;

    uniform vec4 uColor;
    uniform float uTime;
    uniform float uPulse;

    varying float vDepth;
    varying float vSpark;

    void main() {
      float pulse = 0.78 + 0.22 * sin(uTime * 1.9 + vDepth * 8.0 + vSpark * 4.0);
      gl_FragColor = vec4(uColor.rgb, uColor.a * mix(1.0, pulse, uPulse));
    }
  `;

  const pointVertex = lineVertex;

  const pointFragment = `
    precision mediump float;

    uniform vec4 uColor;
    uniform float uTime;

    varying float vDepth;
    varying float vSpark;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float core = smoothstep(0.5, 0.0, dist);
      float pulse = 0.74 + 0.26 * sin(uTime * 2.1 + vDepth * 8.0 + vSpark * 5.0);

      gl_FragColor = vec4(uColor.rgb, uColor.a * core * pulse);
    }
  `;

  state.solidProgram = createProgram(gl, solidVertex, solidFragment);
  state.lineProgram = createProgram(gl, lineVertex, lineFragment);
  state.pointProgram = createProgram(gl, pointVertex, pointFragment);
}

function computeFit() {
  const canvas = state.canvas;
  const width = canvas ? canvas.width : 640;
  const height = canvas ? canvas.height : 720;
  const cssWidth = canvas && canvas.getBoundingClientRect ? canvas.getBoundingClientRect().width : width;
  const mobile = cssWidth < 680;
  const aspect = width / Math.max(1, height);

  return {
    scale: mobile ? 0.68 : 0.76,
    offsetY: mobile ? 0.24 : 0.20,
    aspectFit: aspect < 1 ? Math.max(0.74, aspect * 0.96) : 1
  };
}

function applyObjectUniforms(gl, program, extra = {}) {
  const fit = computeFit();

  gl.uniform1f(getUniform(gl, program, "uYaw"), state.yaw);
  gl.uniform1f(getUniform(gl, program, "uPitch"), state.pitch);
  gl.uniform1f(getUniform(gl, program, "uRoll"), state.roll);
  gl.uniform1f(getUniform(gl, program, "uScale"), fit.scale);
  gl.uniform1f(getUniform(gl, program, "uOffsetY"), fit.offsetY);
  gl.uniform1f(getUniform(gl, program, "uAspectFit"), fit.aspectFit);

  if ("time" in extra) gl.uniform1f(getUniform(gl, program, "uTime"), extra.time);
  if ("lens" in extra) gl.uniform1f(getUniform(gl, program, "uLens"), extra.lens);
  if ("pulse" in extra) gl.uniform1f(getUniform(gl, program, "uPulse"), extra.pulse);
  if ("pointSize" in extra) gl.uniform1f(getUniform(gl, program, "uPointSize"), extra.pointSize);
  if ("color" in extra) gl.uniform4fv(getUniform(gl, program, "uColor"), extra.color);
}

function drawSolidMesh(gl, mesh, lensStrength = 0) {
  gl.useProgram(state.solidProgram);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.solidProgram, "aPosition"), 3);
  bindAttribute(gl, mesh.normal, getAttrib(gl, state.solidProgram, "aNormal"), 3);
  bindAttribute(gl, mesh.color, getAttrib(gl, state.solidProgram, "aColor"), 4);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);

  applyObjectUniforms(gl, state.solidProgram, {
    time: state.time,
    lens: lensStrength
  });

  gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
}

function drawLineMesh(gl, mesh, color, pointSize = 1, pulse = 0.5) {
  gl.useProgram(state.lineProgram);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.lineProgram, "aPosition"), 3);

  applyObjectUniforms(gl, state.lineProgram, {
    time: state.time,
    color,
    pulse,
    pointSize
  });

  gl.drawArrays(gl.LINES, 0, mesh.count);
}

function drawPointMesh(gl, mesh, color, pointSize = 5) {
  gl.useProgram(state.pointProgram);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.pointProgram, "aPosition"), 3);

  applyObjectUniforms(gl, state.pointProgram, {
    time: state.time,
    color,
    pointSize: pointSize * state.dpr
  });

  gl.drawArrays(gl.POINTS, 0, mesh.count);
}

function resizeCanvas() {
  const canvas = state.canvas;
  const gl = state.gl;

  if (!canvas || !gl) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(1.8, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
  const height = Math.max(520, Math.floor((rect.height || 720) * dpr));

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  state.dpr = dpr;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function renderWebGL() {
  const gl = state.gl;

  if (!gl) return;

  resizeCanvas();

  gl.clearColor(0.004, 0.014, 0.034, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (state.lens === "crystal") {
    gl.depthMask(true);
    drawSolidMesh(gl, state.crystalMesh, 0);

    gl.depthMask(false);
    drawLineMesh(gl, state.crystalEdges, new Float32Array([0.86, 0.96, 1.0, 0.42]), 1.4 * state.dpr, 0.45);
    drawPointMesh(gl, state.crystalPoints, new Float32Array([1.0, 0.88, 0.48, 0.48]), 5.2);
    gl.depthMask(true);
  } else {
    gl.depthMask(true);
    drawSolidMesh(gl, state.latticeGhost, 1);

    gl.depthMask(false);
    drawLineMesh(gl, state.latticeLines, new Float32Array([0.52, 0.86, 1.0, 0.72]), 1.65 * state.dpr, 0.9);
    drawLineMesh(gl, state.crystalEdges, new Float32Array([1.0, 0.78, 0.34, 0.38]), 1.1 * state.dpr, 0.65);
    drawPointMesh(gl, state.latticePoints, new Float32Array([1.0, 0.82, 0.40, 0.84]), 6.4);
    gl.depthMask(true);
  }
}

function step(timestamp) {
  const dt = state.lastTime ? clamp((timestamp - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = timestamp;
  state.time += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;

    const damping = Math.pow(0.944, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.time * 0.24) * dt * 0.018;
    }
  }

  state.pitch = clamp(state.pitch, -1.04, 0.82);
  state.roll = Math.sin(state.time * 0.16) * 0.018;

  renderWebGL();

  state.raf = requestAnimationFrame(step);
}

function resetDiamond() {
  state.yaw = -0.58;
  state.pitch = -0.24;
  state.roll = 0.02;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.time = 0;
  renderWebGL();
}

function bindPointer(stage) {
  stage.style.touchAction = "none";

  stage.addEventListener("pointerdown", (event) => {
    const time = performance.now();

    if (time - state.lastTap < 320) {
      resetDiamond();
    }

    state.lastTap = time;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;

    try {
      stage.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    } catch (_error) {}
  }, { passive: false });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0084;
    state.pitch = clamp(state.pitch + dy * 0.0058, -1.04, 0.82);

    state.velocityYaw = clamp(dx * 0.00235, -0.050, 0.050);
    state.velocityPitch = clamp(dy * 0.00155, -0.038, 0.038);

    try {
      event.preventDefault();
    } catch (_error) {}
  }, { passive: false });

  const release = (event) => {
    if (!state.dragging) return;

    state.dragging = false;

    try {
      stage.releasePointerCapture?.(event.pointerId);
    } catch (_error) {}
  };

  stage.addEventListener("pointerup", release, { passive: true });
  stage.addEventListener("pointercancel", release, { passive: true });
  stage.addEventListener("pointerleave", release, { passive: true });
}

function setLens(nextLens) {
  const lens = nextLens === "lattice" ? "lattice" : "crystal";
  state.lens = lens;

  document.documentElement.dataset.showroomDiamondLens = lens;
  if (document.body) document.body.dataset.showroomDiamondLens = lens;

  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.diamondLens === lens ? "true" : "false");
  });

  const title = document.querySelector("[data-diamond-lens-title]");
  const copy = document.querySelector("[data-diamond-lens-copy]");
  const route = document.querySelector("[data-diamond-route-label]");

  if (title) title.textContent = LENS_COPY[lens].title;
  if (copy) copy.textContent = LENS_COPY[lens].copy;
  if (route) route.textContent = LENS_COPY[lens].route;

  renderWebGL();
}

function bindLensControls() {
  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      setLens(button.dataset.diamondLens);
    });
  });

  setLens(state.lens);
}

function markRoute() {
  const markers = {
    showroomStatus: "diamond-proof-object-reinstated",
    showroomContract: SHOWROOM_DIAMOND_STATE.contract,
    showroomPairedHtmlContract: SHOWROOM_DIAMOND_STATE.pairedHtmlContract,
    diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
    renderer: "native-webgl",
    visibleRadialMetric: String(RADIAL_POINTS),
    latticeStates: String(LATTICE_STATES),
    defaultLens: "crystal-form",
    secondaryLens: "lattice-structure",
    lensRule: "toggle-changes-inspection-lens-not-object-identity",
    touchGlideDiamond: "true",
    doubleTapReset: "true",
    geometryMutableByTouch: "false",
    inspectionControl: "webgl-perspective-camera-object-rotation",
    proofObject: "visible-webgl-crown-cut-256-lattice-diamond",
    generatedImage: "false",
    graphicBox: "false",
    audraliaInheritance: "false",
    planetTemplateInheritance: "false",
    visualPassClaimed: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    if (document.body) document.body.dataset[key] = value;
  });
}

function createWebGLContext(canvas) {
  return (
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    })
  );
}

function initWebGL(canvas) {
  const gl = createWebGLContext(canvas);

  if (!gl) {
    document.documentElement.dataset.showroomWebglError = "WEBGL_CONTEXT_UNAVAILABLE";
    return null;
  }

  initPrograms(gl);

  const diamondGeometry = buildDiamondGeometry();
  const latticeGeometry = buildLatticeGeometry();

  state.crystalMesh = makeMesh(gl, diamondGeometry);
  state.crystalEdges = makeLineMesh(gl, diamondGeometry.edgePositions);
  state.crystalPoints = makePointMesh(gl, diamondGeometry.pointPositions);

  state.latticeGhost = makeMesh(gl, diamondGeometry);
  state.latticeLines = makeLineMesh(gl, latticeGeometry.linePositions);
  state.latticePoints = makePointMesh(gl, latticeGeometry.pointPositions);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  state.gl = gl;
  state.glReady = true;

  return gl;
}

function publishApi() {
  window.DGBShowroomDiamond = Object.freeze({
    ...SHOWROOM_DIAMOND_STATE,
    setLens,
    resetDiamond,
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: state.initialized,
        canvasReady: state.canvasReady,
        glReady: state.glReady,
        activeLens: state.lens,
        fixedForm: true,
        crownCut: true,
        lattice256: true,
        latticeStates: LATTICE_STATES,
        visibleRadialMetric: RADIAL_POINTS,
        touchGlide: true,
        doubleTapReset: true,
        yaw: state.yaw,
        pitch: state.pitch,
        errors: state.errors.slice(),
        generatedImage: false,
        graphicBox: false,
        audraliaInheritance: false,
        planetTemplateInheritance: false,
        visualPassClaim: false
      });
    }
  });

  return window.DGBShowroomDiamond;
}

function initShowroomDiamond() {
  try {
    markRoute();
    bindLensControls();

    const stage = document.querySelector("[data-showroom-diamond-stage]");
    const canvas = document.querySelector("[data-showroom-diamond-canvas]");

    if (!stage || !canvas) {
      document.documentElement.dataset.showroomDiamondError = "STAGE_OR_CANVAS_MISSING";
      return null;
    }

    state.stage = stage;
    state.canvas = canvas;

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      zIndex: "2",
      pointerEvents: "none",
      background: "transparent"
    });

    const gl = initWebGL(canvas);
    if (!gl) return null;

    bindPointer(stage);
    resizeCanvas();
    renderWebGL();

    state.canvasReady = true;
    state.initialized = true;

    window.addEventListener("resize", renderWebGL, { passive: true });

    if (!state.raf) {
      state.raf = requestAnimationFrame(step);
    }

    return publishApi();
  } catch (error) {
    recordError("initShowroomDiamond", error);
    return null;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShowroomDiamond, { once: true });
} else {
  initShowroomDiamond();
}

export {
  SHOWROOM_DIAMOND_STATE,
  initShowroomDiamond,
  setLens,
  resetDiamond
};

export default SHOWROOM_DIAMOND_STATE;
