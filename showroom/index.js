// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DUAL_LENS_DIAMOND_WEBGL_TRUE_3D_RAISED_STAGE_TNT_v5
// Paired HTML cache key may remain: SHOWROOM_DUAL_LENS_DIAMOND_WEBGL_TRUE_3D_TNT_v4
// Scope: active /showroom/ Diamond renderer only.
// Purpose:
// - Preserve the successful WebGL true 3D diamond.
// - Raise the object above the lower instruction box.
// - Reduce bottom collision without returning to flat canvas behavior.
// - Crystal Form and Lattice Structure remain real 3D WebGL groups.
// - 16 radial compass metric preserved.
// - No generated image. No graphic box. No legacy Globe / Planet One / Demo Universe inheritance.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DUAL_LENS_DIAMOND_WEBGL_TRUE_3D_RAISED_STAGE_TNT_v5",
  pairedHtmlContract: "SHOWROOM_DUAL_LENS_DIAMOND_WEBGL_TRUE_3D_BIND_TNT_v5",
  route: "/showroom/",
  role: "showroom-dual-lens-webgl-true-3d-cover-object-raised-stage",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  renderer: "native-webgl",
  fallbackRenderer: "none",
  touchGlide: true,
  inspectionControl: "webgl-perspective-camera-object-rotation",
  geometryMutableByTouch: false,
  defaultLens: "crystal",
  secondaryLens: "lattice",
  lensRule: "toggle-changes-inspection-lens-not-object-identity",
  visibleRadialMetric: 16,
  latticeStates: 256,
  crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
  latticeFormSilhouette: "true-3d-structural-compass-lattice",
  stageCorrection: "raised-above-instruction-box",
  flatBadgeBlocked: true,
  generatedImage: false,
  graphicBox: false,
  earthRecord: false,
  legacyGlobeInheritance: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const RADIAL_POINTS = 16;
const LATTICE_STATES = 256;

const LENS_COPY = Object.freeze({
  crystal: {
    title: "Crystal Form",
    route: "Crystal Form → WebGL true 3D Crown Cut Diamond · raised inspection view",
    copy: "This view shows the finished Crown Cut Diamond as a true 3D crystal body: table, crown, faceted girdle, pavilion, culet, light, and touch inspection. This is the public object. It proves the site can render interactive 3D content with a fixed form instead of a flat graphic."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → WebGL 16-point compass geometry · raised lattice view",
    copy: "This view reveals the structural logic beneath the Diamond. The 16-point compass metric organizes the visible geometry, while the 256 lattice represents the deeper address system behind the form. This is not a separate object. It is the same Diamond viewed through its underlying structure."
  }
});

const state = {
  lens: "crystal",
  yaw: -0.62,
  pitch: -0.28,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  sparkle: 0,
  raf: 0,
  dpr: 1,
  canvasReady: false,
  glReady: false,
  stage: null,
  canvas: null,
  gl: null,
  program: null,
  lineProgram: null,
  pointProgram: null,
  crystalMesh: null,
  latticeLines: null,
  latticePoints: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function createMat4() {
  return new Float32Array(16);
}

function identity(out) {
  out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
  out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
  out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
  return out;
}

function multiply(out, a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
  const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
  const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
  const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
  out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;

  out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
  out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
  out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
  out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;

  out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
  out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
  out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
  out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;

  out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
  out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
  out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
  out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

  return out;
}

function perspective(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);

  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;

  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;

  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;

  return out;
}

function translate(out, a, v) {
  const x = v[0], y = v[1], z = v[2];

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    for (let i = 0; i < 12; i += 1) out[i] = a[i];
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  }

  return out;
}

function rotateX(out, a, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

  if (a !== out) {
    out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
    out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
  }

  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;

  return out;
}

function rotateY(out, a, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

  if (a !== out) {
    out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
    out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
  }

  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;

  return out;
}

function rotateZ(out, a, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];

  if (a !== out) {
    out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
    out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
  }

  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;

  return out;
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

function faceNormal(a, b, c) {
  return normalize3(cross3(subtract3(b, a), subtract3(c, a)));
}

function makePoint(x, y, z) {
  return [x, y, z];
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

    table.push(makePoint(Math.cos(angle) * 0.34 * compassCut, 0.48, Math.sin(angle) * 0.34 * compassCut));
    crownInner.push(makePoint(Math.cos(angle) * 0.52 * compassCut, 0.34, Math.sin(angle) * 0.52 * compassCut));
    crownOuter.push(makePoint(Math.cos(angle) * 0.78 * compassCut * cardinalBoost, 0.12, Math.sin(angle) * 0.78 * compassCut * cardinalBoost));
    girdleTop.push(makePoint(Math.cos(angle) * 1.08 * compassCut * cardinalBoost, -0.03, Math.sin(angle) * 1.08 * compassCut * cardinalBoost));
    girdleBottom.push(makePoint(Math.cos(angle) * 1.02 * compassCut * cardinalBoost, -0.18, Math.sin(angle) * 1.02 * compassCut * cardinalBoost));
    pavilion.push(makePoint(Math.cos(angle) * 0.50 * compassCut, -0.58, Math.sin(angle) * 0.50 * compassCut));
    culetRing.push(makePoint(Math.cos(angle) * 0.12 * compassCut, -0.82, Math.sin(angle) * 0.12 * compassCut));
  }

  const tableCenter = makePoint(0, 0.54, 0);
  const culet = makePoint(0, -0.96, 0);

  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];
  const edges = [];
  const points = [];

  const colorMap = {
    table: [0.92, 0.98, 1.0, 0.78],
    crown: [0.70, 0.88, 1.0, 0.64],
    shoulder: [0.52, 0.72, 0.94, 0.56],
    girdle: [0.88, 0.96, 1.0, 0.52],
    pavilion: [0.24, 0.42, 0.72, 0.62],
    culet: [0.78, 0.92, 1.0, 0.46]
  };

  function addVertex(vertex, normal, color) {
    const index = positions.length / 3;
    positions.push(vertex[0], vertex[1], vertex[2]);
    normals.push(normal[0], normal[1], normal[2]);
    colors.push(color[0], color[1], color[2], color[3]);
    return index;
  }

  function addTriangle(a, b, c, colorName) {
    const normal = faceNormal(a, b, c);
    const color = colorMap[colorName] || colorMap.crown;
    const ia = addVertex(a, normal, color);
    const ib = addVertex(b, normal, color);
    const ic = addVertex(c, normal, color);
    indices.push(ia, ib, ic);
    edges.push(a, b, b, c, c, a);
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

    edges.push(
      table[i], crownInner[i],
      crownInner[i], crownOuter[i],
      crownOuter[i], girdleTop[i],
      girdleBottom[i], pavilion[i],
      pavilion[i], culetRing[i],
      culetRing[i], culet
    );

    points.push(table[i], crownInner[i], crownOuter[i], girdleTop[i], girdleBottom[i], pavilion[i], culetRing[i]);
  }

  points.push(tableCenter, culet);

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
    edgePositions: new Float32Array(edges.flat()),
    pointPositions: new Float32Array(points.flat())
  };
}

function buildLatticeGeometry() {
  const diamond = buildDiamondGeometry();
  const lines = [];
  const points = [];

  const rings = [];
  const ringDefs = [
    [0.34, 0.54],
    [0.52, 0.34],
    [0.78, 0.12],
    [1.08, -0.03],
    [1.02, -0.18],
    [0.50, -0.58],
    [0.12, -0.82]
  ];

  ringDefs.forEach(([radius, y], ringIndex) => {
    const ring = [];

    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      const angle = (i / RADIAL_POINTS) * TAU + (ringIndex % 2 ? TAU / 32 : 0);
      const compassCut = i % 2 === 0 ? 1 : 0.93;
      const p = makePoint(Math.cos(angle) * radius * compassCut, y, Math.sin(angle) * radius * compassCut);
      ring.push(p);
      points.push(p);
    }

    rings.push(ring);
  });

  const centerTop = makePoint(0, 0.58, 0);
  const centerCore = makePoint(0, -0.08, 0);
  const centerBottom = makePoint(0, -0.96, 0);
  points.push(centerTop, centerCore, centerBottom);

  function pushLine(a, b) {
    lines.push(a, b);
  }

  rings.forEach((ring) => {
    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      pushLine(ring[i], ring[(i + 1) % RADIAL_POINTS]);
    }
  });

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    for (let r = 0; r < rings.length - 1; r += 1) {
      pushLine(rings[r][i], rings[r + 1][i]);
    }

    if (i % 2 === 0) {
      pushLine(rings[0][i], rings[3][(i + 2) % RADIAL_POINTS]);
      pushLine(rings[3][i], rings[6][(i + 4) % RADIAL_POINTS]);
    }

    if (i % 4 === 0) {
      pushLine(centerTop, rings[3][i]);
      pushLine(centerCore, rings[3][i]);
      pushLine(centerBottom, rings[5][i]);
    }
  }

  return {
    crystal: diamond,
    linePositions: new Float32Array(lines.flat()),
    pointPositions: new Float32Array(points.flat())
  };
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(error || "Shader compile failed");
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
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(error || "Program link failed");
  }

  return program;
}

function createBuffer(gl, data, target = gl.ARRAY_BUFFER) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  return buffer;
}

function createMesh(gl, geometry) {
  return {
    position: createBuffer(gl, geometry.positions),
    normal: createBuffer(gl, geometry.normals),
    color: createBuffer(gl, geometry.colors),
    index: createBuffer(gl, geometry.indices, gl.ELEMENT_ARRAY_BUFFER),
    count: geometry.indices.length,
    edges: createBuffer(gl, geometry.edgePositions),
    edgeCount: geometry.edgePositions.length / 3,
    points: createBuffer(gl, geometry.pointPositions),
    pointCount: geometry.pointPositions.length / 3
  };
}

function createLineMesh(gl, positions) {
  return {
    position: createBuffer(gl, positions),
    count: positions.length / 3
  };
}

function createPointMesh(gl, positions) {
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

    uniform mat4 uProjection;
    uniform mat4 uModelView;
    uniform mat4 uModel;

    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec4 vColor;

    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = mat3(uModel) * aNormal;
      vColor = aColor;
      gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
    }
  `;

  const solidFragment = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec4 vColor;

    uniform float uTime;
    uniform float uLens;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 keyLight = normalize(vec3(-0.55, 0.72, 0.82));
      vec3 rimLight = normalize(vec3(0.78, 0.20, 0.52));
      vec3 underLight = normalize(vec3(-0.16, -0.82, 0.38));

      float key = max(dot(n, keyLight), 0.0);
      float rim = pow(max(dot(n, rimLight), 0.0), 1.6);
      float under = max(dot(n, underLight), 0.0);
      float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
      float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + vWorld.x * 9.0 + vWorld.y * 7.0 + vWorld.z * 5.0);

      vec3 ice = vec3(0.78, 0.92, 1.0);
      vec3 deep = vec3(0.03, 0.09, 0.20);
      vec3 gold = vec3(1.0, 0.78, 0.34);
      vec3 violet = vec3(0.78, 0.64, 1.0);

      float brilliance = key * 0.86 + rim * 0.72 + under * 0.16 + pulse * 0.12;
      vec3 color = mix(deep, vColor.rgb, clamp(brilliance + 0.18, 0.0, 1.0));
      color = mix(color, ice, clamp(key * 0.42, 0.0, 0.62));
      color = mix(color, gold, clamp(rim * 0.20 + pulse * 0.045, 0.0, 0.22));
      color = mix(color, violet, clamp(fresnel * 0.18, 0.0, 0.20));

      float alpha = clamp(vColor.a + fresnel * 0.12 + key * 0.06, 0.30, 0.88);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const lineVertex = `
    precision mediump float;
    attribute vec3 aPosition;

    uniform mat4 uProjection;
    uniform mat4 uModelView;
    uniform float uPointSize;

    varying float vDepth;

    void main() {
      vec4 mv = uModelView * vec4(aPosition, 1.0);
      vDepth = clamp((mv.z + 5.0) / 7.0, 0.0, 1.0);
      gl_Position = uProjection * mv;
      gl_PointSize = uPointSize;
    }
  `;

  const lineFragment = `
    precision mediump float;

    uniform vec4 uColor;
    uniform float uTime;
    uniform float uPulse;

    varying float vDepth;

    void main() {
      float pulse = 0.80 + 0.20 * sin(uTime * 1.4 + vDepth * 8.0);
      gl_FragColor = vec4(uColor.rgb, uColor.a * mix(1.0, pulse, uPulse));
    }
  `;

  const pointVertex = `
    precision mediump float;
    attribute vec3 aPosition;

    uniform mat4 uProjection;
    uniform mat4 uModelView;
    uniform float uPointSize;

    varying float vDepth;

    void main() {
      vec4 mv = uModelView * vec4(aPosition, 1.0);
      vDepth = clamp((mv.z + 5.0) / 7.0, 0.0, 1.0);
      gl_Position = uProjection * mv;
      gl_PointSize = uPointSize;
    }
  `;

  const pointFragment = `
    precision mediump float;

    uniform vec4 uColor;
    uniform float uTime;

    varying float vDepth;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float core = smoothstep(0.5, 0.0, dist);
      float pulse = 0.78 + 0.22 * sin(uTime * 1.8 + vDepth * 9.0);

      gl_FragColor = vec4(uColor.rgb, uColor.a * core * pulse);
    }
  `;

  state.program = createProgram(gl, solidVertex, solidFragment);
  state.lineProgram = createProgram(gl, lineVertex, lineFragment);
  state.pointProgram = createProgram(gl, pointVertex, pointFragment);
}

function getAttrib(gl, program, name) {
  return gl.getAttribLocation(program, name);
}

function getUniform(gl, program, name) {
  return gl.getUniformLocation(program, name);
}

function bindAttribute(gl, buffer, location, size) {
  if (location < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function resizeCanvas(canvas, gl) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((box.width || 640) * dpr));
  const height = Math.max(500, Math.floor((box.height || 720) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  state.dpr = dpr;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function makeMatrices(width, height) {
  const projection = createMat4();
  const model = createMat4();
  const view = createMat4();
  const modelView = createMat4();

  perspective(projection, 44 * Math.PI / 180, width / height, 0.1, 100);

  identity(model);
  rotateY(model, model, state.yaw);
  rotateX(model, model, state.pitch);
  rotateZ(model, model, Math.sin(state.sparkle * 0.16) * 0.025);

  identity(view);
  translate(view, view, [0, 0.62, -4.42]);

  multiply(modelView, view, model);

  return { projection, model, modelView };
}

function drawSolid(gl, mesh, matrices) {
  gl.useProgram(state.program);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.program, "aPosition"), 3);
  bindAttribute(gl, mesh.normal, getAttrib(gl, state.program, "aNormal"), 3);
  bindAttribute(gl, mesh.color, getAttrib(gl, state.program, "aColor"), 4);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);

  gl.uniformMatrix4fv(getUniform(gl, state.program, "uProjection"), false, matrices.projection);
  gl.uniformMatrix4fv(getUniform(gl, state.program, "uModelView"), false, matrices.modelView);
  gl.uniformMatrix4fv(getUniform(gl, state.program, "uModel"), false, matrices.model);
  gl.uniform1f(getUniform(gl, state.program, "uTime"), state.sparkle);
  gl.uniform1f(getUniform(gl, state.program, "uLens"), state.lens === "lattice" ? 1 : 0);

  gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
}

function drawLines(gl, mesh, matrices, color, width = 1, pulse = 0.5) {
  gl.useProgram(state.lineProgram);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.lineProgram, "aPosition"), 3);

  gl.uniformMatrix4fv(getUniform(gl, state.lineProgram, "uProjection"), false, matrices.projection);
  gl.uniformMatrix4fv(getUniform(gl, state.lineProgram, "uModelView"), false, matrices.modelView);
  gl.uniform4fv(getUniform(gl, state.lineProgram, "uColor"), color);
  gl.uniform1f(getUniform(gl, state.lineProgram, "uTime"), state.sparkle);
  gl.uniform1f(getUniform(gl, state.lineProgram, "uPulse"), pulse);
  gl.uniform1f(getUniform(gl, state.lineProgram, "uPointSize"), width * state.dpr);

  gl.drawArrays(gl.LINES, 0, mesh.count);
}

function drawPoints(gl, mesh, matrices, color, pointSize = 6) {
  gl.useProgram(state.pointProgram);

  bindAttribute(gl, mesh.position, getAttrib(gl, state.pointProgram, "aPosition"), 3);

  gl.uniformMatrix4fv(getUniform(gl, state.pointProgram, "uProjection"), false, matrices.projection);
  gl.uniformMatrix4fv(getUniform(gl, state.pointProgram, "uModelView"), false, matrices.modelView);
  gl.uniform4fv(getUniform(gl, state.pointProgram, "uColor"), color);
  gl.uniform1f(getUniform(gl, state.pointProgram, "uTime"), state.sparkle);
  gl.uniform1f(getUniform(gl, state.pointProgram, "uPointSize"), pointSize * state.dpr);

  gl.drawArrays(gl.POINTS, 0, mesh.count);
}

function drawBackground(gl) {
  gl.clearColor(0.005, 0.018, 0.045, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function renderWebGL() {
  const gl = state.gl;
  const canvas = state.canvas;

  if (!gl || !canvas) return;

  resizeCanvas(canvas, gl);
  drawBackground(gl);

  const matrices = makeMatrices(canvas.width, canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (state.lens === "crystal") {
    gl.depthMask(true);
    drawSolid(gl, state.crystalMesh, matrices);

    gl.depthMask(false);
    drawLines(gl, state.crystalEdgeLines, matrices, new Float32Array([0.86, 0.96, 1.0, 0.38]), 1.15, 0.45);
    drawPoints(gl, state.crystalPoints, matrices, new Float32Array([1.0, 0.92, 0.66, 0.42]), 5.2);
    gl.depthMask(true);
  } else {
    gl.depthMask(true);
    drawSolid(gl, state.latticeGhostMesh, matrices);

    gl.depthMask(false);
    drawLines(gl, state.latticeLines, matrices, new Float32Array([0.56, 0.86, 1.0, 0.58]), 1.25, 0.8);
    drawLines(gl, state.crystalEdgeLines, matrices, new Float32Array([1.0, 0.82, 0.42, 0.30]), 0.95, 0.55);
    drawPoints(gl, state.latticePoints, matrices, new Float32Array([1.0, 0.84, 0.46, 0.72]), 6.4);
    gl.depthMask(true);
  }
}

function step(time) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;
  state.sparkle += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;

    const damping = Math.pow(0.944, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.sparkle * 0.24) * dt * 0.018;
    }
  }

  state.pitch = clamp(state.pitch, -1.08, 0.82);

  renderWebGL();
  state.raf = requestAnimationFrame(step);
}

function resetDiamond() {
  state.yaw = -0.62;
  state.pitch = -0.28;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.sparkle = 0;
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) {
      resetDiamond();
    }

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0082;
    state.pitch = clamp(state.pitch + dy * 0.0058, -1.08, 0.82);

    state.velocityYaw = dx * 0.00235;
    state.velocityPitch = dy * 0.00155;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
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
    showroomStatus: "dual-lens-webgl-true-3d-diamond-raised-stage",
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
    geometryMutableByTouch: "false",
    inspectionControl: "webgl-perspective-camera-object-rotation",
    crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
    latticeFormSilhouette: "true-3d-structural-compass-lattice",
    crystalAndLatticeAreVisuallyDistinct: "true",
    diamondPublicRead: "webgl-true-3d-raised-above-instruction-box",
    stageCorrection: "raised-above-instruction-box",
    webglDepthBuffer: "true",
    perspectiveCamera: "true",
    realMesh: "true",
    realObjectRotation: "true",
    flatBadgeBlocked: "true",
    launchpadRoutes: "characters,laws,products,globe,gauges",
    lawsCta: "Jump to the Laws page and lock in.",
    productsCommunityPath: "products-serve-community",
    earthRecord: "false",
    generatedImage: "false",
    graphicBox: "false",
    legacyGlobeInheritance: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    if (document.body) document.body.dataset[key] = value;
  });
}

function protectIdentity() {
  const title = document.querySelector("title");
  if (title && /Earth/i.test(title.textContent || "")) {
    title.textContent = "Showroom · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "The Diamond holds the room.";
  }
}

function initWebGL(canvas) {
  const gl =
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
    });

  if (!gl) {
    document.documentElement.dataset.showroomWebglError = "WEBGL_CONTEXT_UNAVAILABLE";
    return null;
  }

  initPrograms(gl);

  const crystalGeometry = buildDiamondGeometry();
  const latticeGeometry = buildLatticeGeometry();

  state.crystalMesh = createMesh(gl, crystalGeometry);
  state.crystalEdgeLines = createLineMesh(gl, crystalGeometry.edgePositions);
  state.crystalPoints = createPointMesh(gl, crystalGeometry.pointPositions);

  state.latticeGhostMesh = createMesh(gl, latticeGeometry.crystal);
  state.latticeLines = createLineMesh(gl, latticeGeometry.linePositions);
  state.latticePoints = createPointMesh(gl, latticeGeometry.pointPositions);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  state.gl = gl;
  state.glReady = true;

  return gl;
}

function initShowroomDiamond() {
  markRoute();
  protectIdentity();
  bindLensControls();

  const stage = document.querySelector("[data-showroom-diamond-stage]");
  const canvas = document.querySelector("[data-showroom-diamond-canvas]");

  if (!stage || !canvas) return null;

  state.stage = stage;
  state.canvas = canvas;

  const gl = initWebGL(canvas);
  if (!gl) return null;

  bindPointer(stage);
  resizeCanvas(canvas, gl);
  renderWebGL();

  state.canvasReady = true;

  if (!state.raf) {
    state.raf = requestAnimationFrame(step);
  }

  window.DGBShowroomDiamond = Object.freeze({
    ...SHOWROOM_DIAMOND_STATE,
    setLens,
    resetDiamond,
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: true,
        canvasReady: state.canvasReady,
        glReady: state.glReady,
        renderer: "native-webgl",
        fixedForm: true,
        crownCut: true,
        webglDepthBuffer: true,
        perspectiveCamera: true,
        realMesh: true,
        realObjectRotation: true,
        stageCorrection: "raised-above-instruction-box",
        lattice256: true,
        latticeStates: LATTICE_STATES,
        visibleRadialMetric: RADIAL_POINTS,
        activeLens: state.lens,
        lensCopy: LENS_COPY[state.lens],
        crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
        latticeFormSilhouette: "true-3d-structural-compass-lattice",
        crystalAndLatticeAreVisuallyDistinct: true,
        correctedPhysicalRead: "raised-webgl-true-3d-not-flat-paper",
        flatBadgeBlocked: true,
        tableClear: true,
        visibleCrown: true,
        facetedGirdle: true,
        pavilionTaper: true,
        culetPlane: true,
        geometryMutableByTouch: false,
        inspectionControl: "webgl-perspective-camera-object-rotation",
        launchpadRoutes: ["characters", "laws", "products", "globe", "gauges"],
        lawsCta: "Jump to the Laws page and lock in.",
        productsCommunityPath: true,
        momentum: true,
        doubleTapReset: true,
        yaw: state.yaw,
        pitch: state.pitch,
        generatedImage: false,
        graphicBox: false,
        earthRecord: false,
        legacyGlobeInheritance: false
      });
    }
  });

  return window.DGBShowroomDiamond;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShowroomDiamond, { once: true });
} else {
  initShowroomDiamond();
}

export { SHOWROOM_DIAMOND_STATE, initShowroomDiamond };
export default SHOWROOM_DIAMOND_STATE;
