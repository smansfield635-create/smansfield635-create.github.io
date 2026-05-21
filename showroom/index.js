// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_G2_CRYSTAL_LATTICE_SEPARATION_MONOCHROME_REFINEMENT_JS_TNT_v1
//
// Preserves recovered baselines:
// SHOWROOM_DIAMOND_G2_CONSUMPTION_FINGERPRINT_AUDIT_JS_TNT_v1
// SHOWROOM_DIAMOND_G2_CRYSTALLINE_FIBONACCI_BEAUTY_REFINEMENT_JS_TNT_v1
//
// Governing standard:
// SHOWROOM_DIAMOND_G2_FIBONACCI_16_NODE_256_LATTICE_PROOF_OBJECT_STANDARD_v1
//
// Scope: /showroom/ diamond proof-object renderer only.
// Purpose:
// - Separate Crystal Form from Lattice Structure.
// - Crystal Form renders the Diamond as a clean monochrome diamond-crystal object.
// - Crystal Form does not draw lattice lines, node dots, Fibonacci graph links, or gold/yellow body bands.
// - Lattice Structure preserves the visible 16-node × 16 Fibonacci-band / 256-seat network.
// - Preserve canonical canvas consumption, duplicate-canvas neutralization, hidden fingerprint API,
//   finger drag, momentum, double-tap reset, Crystal Form, and Lattice Structure.
// - No HTML rewrite. No generated image. No GraphicBox. No Audralia inheritance. No planet-template inheritance.

const MONOCHROME_REFINEMENT_CONTRACT = "SHOWROOM_DIAMOND_G2_CRYSTAL_LATTICE_SEPARATION_MONOCHROME_REFINEMENT_JS_TNT_v1";
const PREVIOUS_BEAUTY_REFINEMENT_CONTRACT = "SHOWROOM_DIAMOND_G2_CRYSTALLINE_FIBONACCI_BEAUTY_REFINEMENT_JS_TNT_v1";
const PREVIOUS_CONSUMPTION_AUDIT_CONTRACT = "SHOWROOM_DIAMOND_G2_CONSUMPTION_FINGERPRINT_AUDIT_JS_TNT_v1";
const ACTIVE_STANDARD = "SHOWROOM_DIAMOND_G2_FIBONACCI_16_NODE_256_LATTICE_PROOF_OBJECT_STANDARD_v1";
const PAIRED_HTML_CONTRACT = "SHOWROOM_DIAMOND_G2_FIBONACCI_16_NODE_256_LATTICE_HTML_STAGE_BINDING_TNT_v1";

const RADIAL_NODES = 16;
const FIBONACCI_BANDS = 16;
const LATTICE_STATES = 256;
const TAU = Math.PI * 2;

const FIBONACCI_SEQUENCE = Object.freeze([
  1, 1, 2, 3, 5, 8, 13, 21,
  34, 55, 89, 144, 233, 377, 610, 987
]);

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: MONOCHROME_REFINEMENT_CONTRACT,
  previousContract: PREVIOUS_BEAUTY_REFINEMENT_CONTRACT,
  previousConsumptionAuditContract: PREVIOUS_CONSUMPTION_AUDIT_CONTRACT,
  pairedHtmlContract: PAIRED_HTML_CONTRACT,
  standard: ACTIVE_STANDARD,
  route: "/showroom/",
  generation: "G2",
  generationOneStatus: "lost-overwritten",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  renderer: "native-webgl",
  renderModel: "single-canonical-canvas-deterministic-fibonacci-lattice-webgl",
  refinement: "crystal-lattice-separation-monochrome-diamond-pass",
  radialNodes: RADIAL_NODES,
  fibonacciBands: FIBONACCI_BANDS,
  latticeStates: LATTICE_STATES,
  latticeEquation: "16_RADIAL_NODES_X_16_FIBONACCI_BANDS_EQUALS_256_LATTICE_SEATS",
  crystalFormRule: "diamond-is-diamond-no-lattice-overlay",
  latticeStructureRule: "lattice-is-structure-lens-only",
  touchGlide: true,
  doubleTapReset: true,
  generatedImage: false,
  graphicBox: false,
  audraliaInheritance: false,
  planetTemplateInheritance: false,
  visualPassClaim: false
});

const LENS_COPY = Object.freeze({
  crystal: {
    title: "Crystal Form",
    route: "Crystal Form → G2 Crown Cut Diamond · clean diamond-crystal body",
    copy:
      "This view presents the Diamond as the Diamond: one clean Crown Cut crystal object using icy white, silver, and pale blue diamond tones. The lattice, node seats, and Fibonacci graph remain hidden in this lens so the proof object reads as a finished crystal."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → 16 radial nodes × 16 Fibonacci bands = 256 lattice seats",
    copy:
      "This view exposes the computable structure beneath the Diamond. Sixteen radial nodes move through sixteen Fibonacci-governed bands to produce 256 addressable seats, with Fibonacci offset links using 1, 2, 3, 5, 8, and 13."
  }
});

const state = {
  lens: "crystal",

  stage: null,
  canvas: null,
  gl: null,

  solidProgram: null,
  lineProgram: null,
  pointProgram: null,

  solidPositionBuffer: null,
  solidColorBuffer: null,
  linePositionBuffer: null,
  lineColorBuffer: null,
  pointPositionBuffer: null,
  pointColorBuffer: null,
  pointSizeBuffer: null,

  seats: [],
  triangles: [],
  crystalEdges: [],
  crystallineFacetLines: [],
  latticeLines: [],
  fibonacciHighlightLines: [],
  crystalPoints: [],
  latticePoints: [],

  yaw: -0.62,
  pitch: -0.22,
  roll: 0.015,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,

  dpr: 1,
  time: 0,
  lastFrame: 0,
  raf: 0,
  renderCount: 0,

  geometryBuilt: false,
  crystalMeshReady: false,
  latticeMeshReady: false,
  canvasReady: false,
  glReady: false,
  touchReady: false,
  initialized: false,
  duplicateCanvasCount: 0,
  canonicalCanvasBound: false,

  errors: []
};

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, finite(value, min)));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function mixColor(a, b, t) {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
    lerp(a[3], b[3], t)
  ];
}

function normalize3(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function sub3(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross3(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function faceNormal(a, b, c) {
  return normalize3(cross3(sub3(b, a), sub3(c, a)));
}

function fibonacciWeight(band) {
  const max = FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
  return FIBONACCI_SEQUENCE[band] / max;
}

function pointFromSeat(seat) {
  return { x: seat.x, y: seat.y, z: seat.z };
}

function crystalRoleColor(role, band, alpha = 1) {
  const depth = band / Math.max(1, FIBONACCI_BANDS - 1);

  if (role === "table") {
    return mixColor([0.94, 0.985, 1.0, 0.92 * alpha], [0.78, 0.92, 1.0, 0.82 * alpha], depth * 0.20);
  }

  if (role === "crown") {
    return mixColor([0.82, 0.94, 1.0, 0.84 * alpha], [0.56, 0.78, 0.96, 0.78 * alpha], depth * 0.28);
  }

  if (role === "girdle") {
    return [0.74, 0.88, 0.98, 0.80 * alpha];
  }

  if (role === "pavilion") {
    return mixColor([0.50, 0.74, 0.96, 0.82 * alpha], [0.20, 0.42, 0.78, 0.84 * alpha], depth * 0.58);
  }

  return [0.34, 0.58, 0.86, 0.72 * alpha];
}

function latticeRoleColor(role, alpha = 1) {
  if (role === "table") return [0.95, 0.99, 1.00, 0.88 * alpha];
  if (role === "crown") return [0.70, 0.91, 1.00, 0.78 * alpha];
  if (role === "girdle") return [1.00, 0.84, 0.38, 0.72 * alpha];
  if (role === "pavilion") return [0.26, 0.50, 0.94, 0.78 * alpha];
  return [0.92, 0.97, 1.00, 0.64 * alpha];
}

function createSeat(band, radial) {
  const radiusProfile = [
    0.245, 0.330, 0.420, 0.545,
    0.700, 0.875, 1.055, 1.145,
    1.085, 0.900, 0.710, 0.535,
    0.380, 0.235, 0.115, 0.032
  ];

  const heightProfile = [
    0.620, 0.575, 0.520, 0.425,
    0.305, 0.175, 0.060, -0.025,
    -0.110, -0.230, -0.365, -0.500,
    -0.625, -0.725, -0.800, -0.845
  ];

  const fib = FIBONACCI_SEQUENCE[band];
  const fibNorm = fibonacciWeight(band);
  const angle = (radial / RADIAL_NODES) * TAU;

  const compassCut = radial % 2 === 0 ? 1.0 : 0.942;
  const cardinalBoost = radial % 4 === 0 ? 1.065 : 1.0;
  const nodalFacetCut = radial % 4 === 2 ? 0.982 : 1.0;
  const fibonacciBreath = 1 + (fibNorm - 0.5) * 0.052;
  const radius = radiusProfile[band] * compassCut * cardinalBoost * nodalFacetCut * fibonacciBreath;
  const height = heightProfile[band];

  const role =
    band <= 2 ? "table" :
    band <= 5 ? "crown" :
    band <= 8 ? "girdle" :
    band <= 14 ? "pavilion" :
    "culet";

  return Object.freeze({
    seatIndex: band * RADIAL_NODES + radial,
    band,
    radial,
    fibonacci: fib,
    fibonacciWeight: fibNorm,
    angle,
    radius,
    height,
    x: Math.cos(angle) * radius,
    y: height,
    z: Math.sin(angle) * radius * 0.68,
    role,
    visibilityPriority: radial % 4 === 0 ? 1 : radial % 2 === 0 ? 0.80 : 0.58,
    connectionPriority: radial % 4 === 0 ? 1 : radial % 2 === 0 ? 0.74 : 0.54
  });
}

function buildGeometry() {
  const rings = [];

  for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
    const ring = [];

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      ring.push(createSeat(band, radial));
    }

    rings.push(Object.freeze(ring));
  }

  const triangles = [];
  const crystalEdges = [];
  const crystallineFacetLines = [];
  const latticeLines = [];
  const fibonacciHighlightLines = [];
  const crystalPoints = [];
  const latticePoints = [];

  function seat(band, radial) {
    return rings[band][((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
  }

  function addTriangle(a, b, c, color, latticeColor, family = "crystal-facet") {
    triangles.push({
      a,
      b,
      c,
      normal: faceNormal(pointFromSeat(a), pointFromSeat(b), pointFromSeat(c)),
      color,
      latticeColor,
      role: a.role,
      family
    });
  }

  function addCrystalEdge(a, b, color, weight = 1, family = "crystal-edge") {
    crystalEdges.push({ a, b, color, weight, family });
  }

  function addFacetLine(a, b, color, weight = 1, family = "crystalline-facet-line") {
    crystallineFacetLines.push({ a, b, color, weight, family });
  }

  function addLatticeLine(a, b, color, weight = 1, family = "lattice-line") {
    latticeLines.push({ a, b, color, weight, family });
  }

  function addFibonacciHighlight(a, b, color, weight = 1, family = "fibonacci-highlight") {
    fibonacciHighlightLines.push({ a, b, color, weight, family });
  }

  for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      const next = radial + 1;

      const a = seat(band, radial);
      const b = seat(band, next);
      const c = seat(band + 1, next);
      const d = seat(band + 1, radial);

      const crystalBase = crystalRoleColor(a.role, a.band, 1);
      const crystalIce = [0.92, 0.985, 1.0, crystalBase[3]];
      const crystalDepth = [0.34, 0.60, 0.90, crystalBase[3]];
      const crystalMix = a.role === "pavilion" ? 0.22 : a.role === "girdle" ? 0.12 : 0.08;
      const crystalColor = mixColor(mixColor(crystalBase, crystalIce, 0.10), crystalDepth, crystalMix);

      const latticeBase = latticeRoleColor(a.role, 1);
      const latticeGold = [1.0, 0.82, 0.36, 0.76];
      const latticeIce = [0.88, 0.98, 1.0, 0.90];
      const fibMix = Math.min(0.22, a.fibonacciWeight * 0.34);
      const roleMix = a.role === "girdle" ? 0.26 : a.role === "table" ? 0.16 : 0.10;
      const latticeColor = mixColor(mixColor(latticeBase, latticeGold, fibMix), latticeIce, roleMix);

      addTriangle(a, d, c, crystalColor, latticeColor);
      addTriangle(a, c, b, crystalColor, latticeColor);

      if (radial % 2 === 0) {
        addFacetLine(
          a,
          c,
          radial % 4 === 0 ? [0.78, 0.94, 1.0, 0.28] : [0.72, 0.90, 1.0, 0.18],
          radial % 4 === 0 ? 1.0 : 0.72,
          "crystal-internal-facet-seam"
        );
      } else {
        addFacetLine(
          b,
          d,
          [0.62, 0.84, 1.0, 0.14],
          0.62,
          "crystal-counter-facet-seam"
        );
      }
    }
  }

  for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      const a = seat(band, radial);
      const b = seat(band, radial + 1);
      const major = radial % 4 === 0;
      const even = radial % 2 === 0;
      const girdle = band === 6 || band === 7 || band === 8;

      addCrystalEdge(
        a,
        b,
        major || girdle ? [0.86, 0.97, 1.0, 0.34] : [0.74, 0.90, 1.0, 0.22],
        major ? 1.0 : girdle ? 0.86 : even ? 0.66 : 0.50,
        girdle ? "subtle-crystal-girdle-seam" : "subtle-crystal-band-seam"
      );

      addLatticeLine(
        a,
        b,
        major ? [1.0, 0.84, 0.34, 0.94] : [0.48, 0.86, 1.0, 0.66],
        major ? 1.90 : 1.05,
        "fibonacci-band-ring"
      );
    }
  }

  for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      const a = seat(band, radial);
      const b = seat(band + 1, radial);
      const major = radial % 4 === 0;
      const even = radial % 2 === 0;

      addCrystalEdge(
        a,
        b,
        major ? [0.88, 0.98, 1.0, 0.30] : even ? [0.76, 0.92, 1.0, 0.18] : [0.66, 0.84, 1.0, 0.12],
        major ? 0.82 : even ? 0.58 : 0.42,
        major ? "subtle-cardinal-crystal-seam" : "subtle-radial-crystal-seam"
      );

      addLatticeLine(
        a,
        b,
        major ? [1.0, 0.88, 0.44, 0.94] : [0.56, 0.88, 1.0, 0.66],
        major ? 2.0 : 1.05,
        major ? "cardinal-radial-node-spine" : "radial-node-spine"
      );
    }
  }

  const fibonacciOffsets = [1, 2, 3, 5, 8, 13];

  for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
    const offset = fibonacciOffsets[band % fibonacciOffsets.length];

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      const a = seat(band, radial);
      const b = seat(band + 1, radial + offset);
      const c = seat(band + 1, radial - offset);
      const priority = radial % 4 === 0 || band % 4 === 0;

      addLatticeLine(
        a,
        b,
        priority ? [1.0, 0.76, 0.28, 0.58] : [0.42, 0.76, 1.0, 0.32],
        priority ? 1.14 : 0.74,
        "fibonacci-forward-link"
      );

      addFibonacciHighlight(
        a,
        b,
        priority ? [1.0, 0.86, 0.38, 0.78] : [0.72, 0.92, 1.0, 0.40],
        priority ? 1.26 : 0.84,
        `fibonacci-offset-${offset}`
      );

      if (band % 2 === 0) {
        addLatticeLine(
          a,
          c,
          priority ? [0.92, 0.98, 1.0, 0.44] : [0.44, 0.70, 1.0, 0.26],
          priority ? 0.96 : 0.64,
          "fibonacci-return-link"
        );
      }
    }
  }

  for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      const s = seat(band, radial);
      const major = radial % 4 === 0;
      const even = radial % 2 === 0;
      const girdle = band === 6 || band === 7 || band === 8;

      latticePoints.push({
        seat: s,
        color: major ? [1.0, 0.84, 0.34, 0.98] : even ? [0.68, 0.94, 1.0, 0.80] : [0.50, 0.78, 1.0, 0.58],
        size: major ? 8.4 : girdle ? 6.5 : even ? 5.9 : 4.5,
        family: "256-seat"
      });

      if (band === 0 || band === 2 || band === 6 || band === 7 || band === 8 || band === 14 || major) {
        crystalPoints.push({
          seat: s,
          color: major ? [0.86, 0.98, 1.0, 0.34] : girdle ? [0.76, 0.92, 1.0, 0.24] : [0.82, 0.96, 1.0, 0.20],
          size: major ? 4.2 : girdle ? 3.4 : 2.8,
          family: "hidden-in-crystal-visible-in-status"
        });
      }
    }
  }

  state.seats = rings.flat();
  state.triangles = triangles;
  state.crystalEdges = crystalEdges;
  state.crystallineFacetLines = crystallineFacetLines;
  state.latticeLines = latticeLines;
  state.fibonacciHighlightLines = fibonacciHighlightLines;
  state.crystalPoints = crystalPoints;
  state.latticePoints = latticePoints;

  state.geometryBuilt = state.seats.length === LATTICE_STATES;
  state.crystalMeshReady = triangles.length > 0 && crystalEdges.length > 0;
  state.latticeMeshReady = latticeLines.length > 0 && latticePoints.length === LATTICE_STATES;
}

function rotatePoint(point) {
  let x = point.x;
  let y = point.y;
  let z = point.z;

  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const yx = x * cy + z * sy;
  const yz = -x * sy + z * cy;
  x = yx;
  z = yz;

  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const py = y * cp - z * sp;
  const pz = y * sp + z * cp;
  y = py;
  z = pz;

  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);
  const rx = x * cr - y * sr;
  const ry = x * sr + y * cr;

  return { x: rx, y: ry, z };
}

function stageFit() {
  const canvas = state.canvas;
  const width = canvas ? canvas.width : 640;
  const height = canvas ? canvas.height : 720;
  const rect = canvas && canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width, height };
  const mobile = rect.width < 680;
  const aspect = width / Math.max(1, height);

  return {
    scale: mobile ? 0.70 : 0.76,
    offsetY: mobile ? 0.225 : 0.205,
    aspectFit: aspect > 1 ? 1 / aspect : 1,
    cameraDistance: 4.65
  };
}

function projectPoint(point) {
  const rotated = rotatePoint(point);
  const fit = stageFit();
  const perspective = fit.cameraDistance / (fit.cameraDistance - rotated.z);

  return {
    x: rotated.x * fit.scale * fit.aspectFit * perspective,
    y: rotated.y * fit.scale * perspective + fit.offsetY,
    z: rotated.z,
    perspective
  };
}

function projectedSeat(seat) {
  return projectPoint(pointFromSeat(seat));
}

function triangleDepth(triangle) {
  const a = rotatePoint(pointFromSeat(triangle.a));
  const b = rotatePoint(pointFromSeat(triangle.b));
  const c = rotatePoint(pointFromSeat(triangle.c));

  return (a.z + b.z + c.z) / 3;
}

function lightingForTriangle(triangle) {
  const normal = rotatePoint(triangle.normal);
  const key = normalize3({ x: -0.42, y: 0.72, z: 0.86 });
  const rim = normalize3({ x: 0.74, y: 0.22, z: 0.58 });
  const under = normalize3({ x: -0.16, y: -0.68, z: 0.42 });

  const keyDot = Math.max(0, normal.x * key.x + normal.y * key.y + normal.z * key.z);
  const rimDot = Math.max(0, normal.x * rim.x + normal.y * rim.y + normal.z * rim.z);
  const underDot = Math.max(0, normal.x * under.x + normal.y * under.y + normal.z * under.z);
  const pulse = 0.5 + 0.5 * Math.sin(state.time * 1.9 + triangle.a.band * 0.45 + triangle.a.radial * 0.24);

  return clamp(0.50 + keyDot * 0.58 + rimDot * 0.30 + underDot * 0.12 + pulse * 0.085, 0.36, 1.24);
}

function shadedColor(color, light, alphaScale = 1) {
  return [
    clamp(color[0] * light + 0.052, 0, 1),
    clamp(color[1] * light + 0.052, 0, 1),
    clamp(color[2] * light + 0.060, 0, 1),
    clamp(color[3] * alphaScale, 0, 1)
  ];
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

function createBuffer(gl) {
  const out = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, out);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.DYNAMIC_DRAW);
  return out;
}

function updateBuffer(gl, targetBuffer, data) {
  gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
}

function bindAttrib(gl, program, targetBuffer, name, size) {
  const location = gl.getAttribLocation(program, name);
  if (location < 0) return;

  gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function initPrograms(gl) {
  const solidVertex = `
    precision mediump float;

    attribute vec2 aPosition;
    attribute vec4 aColor;

    varying vec4 vColor;

    void main() {
      vColor = aColor;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const solidFragment = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  const pointVertex = `
    precision mediump float;

    attribute vec2 aPosition;
    attribute vec4 aColor;
    attribute float aSize;

    varying vec4 vColor;

    void main() {
      vColor = aColor;
      gl_Position = vec4(aPosition, 0.0, 1.0);
      gl_PointSize = aSize;
    }
  `;

  const pointFragment = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float d = length(coord);
      if (d > 0.5) discard;

      float core = smoothstep(0.5, 0.08, d);
      float rim = smoothstep(0.5, 0.32, d) * 0.34;
      float shine = smoothstep(0.18, 0.0, length(coord - vec2(-0.13, -0.14))) * 0.24;

      gl_FragColor = vec4(vColor.rgb + shine, vColor.a * (core + rim));
    }
  `;

  state.solidProgram = createProgram(gl, solidVertex, solidFragment);
  state.lineProgram = createProgram(gl, solidVertex, solidFragment);
  state.pointProgram = createProgram(gl, pointVertex, pointFragment);

  state.solidPositionBuffer = createBuffer(gl);
  state.solidColorBuffer = createBuffer(gl);
  state.linePositionBuffer = createBuffer(gl);
  state.lineColorBuffer = createBuffer(gl);
  state.pointPositionBuffer = createBuffer(gl);
  state.pointColorBuffer = createBuffer(gl);
  state.pointSizeBuffer = createBuffer(gl);
}

function resizeCanvas() {
  if (!state.canvas || !state.gl) return;

  const rect = state.canvas.getBoundingClientRect();
  const dpr = Math.min(1.85, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
  const height = Math.max(520, Math.floor((rect.height || 720) * dpr));

  if (state.canvas.width !== width) state.canvas.width = width;
  if (state.canvas.height !== height) state.canvas.height = height;

  state.dpr = dpr;
  state.gl.viewport(0, 0, width, height);
}

function triangleColorForLens(triangle, light, alphaScale = 1) {
  const base = state.lens === "lattice" ? triangle.latticeColor : triangle.color;
  return shadedColor(base, light, alphaScale);
}

function drawTriangles(gl, triangles, alphaScale = 1) {
  const positions = [];
  const colors = [];
  const sorted = triangles.slice().sort((a, b) => triangleDepth(a) - triangleDepth(b));

  for (const triangle of sorted) {
    const a = projectedSeat(triangle.a);
    const b = projectedSeat(triangle.b);
    const c = projectedSeat(triangle.c);
    const light = lightingForTriangle(triangle);
    const color = triangleColorForLens(triangle, light, alphaScale);

    positions.push(a.x, a.y, b.x, b.y, c.x, c.y);
    colors.push(...color, ...color, ...color);
  }

  if (!positions.length) return;

  gl.useProgram(state.solidProgram);
  updateBuffer(gl, state.solidPositionBuffer, new Float32Array(positions));
  updateBuffer(gl, state.solidColorBuffer, new Float32Array(colors));

  bindAttrib(gl, state.solidProgram, state.solidPositionBuffer, "aPosition", 2);
  bindAttrib(gl, state.solidProgram, state.solidColorBuffer, "aColor", 4);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
}

function drawLines(gl, lines, alphaScale = 1) {
  const positions = [];
  const colors = [];

  for (const line of lines) {
    const a = projectedSeat(line.a);
    const b = projectedSeat(line.b);
    const depth = clamp(0.84 + ((a.z + b.z) / 2) * 0.09, 0.58, 1.16);
    const pulse = line.family && line.family.includes("fibonacci")
      ? 0.88 + Math.sin(state.time * 1.72 + line.a.band * 0.45 + line.a.radial * 0.18) * 0.12
      : 1;

    const color = [
      clamp(line.color[0] * depth, 0, 1),
      clamp(line.color[1] * depth, 0, 1),
      clamp(line.color[2] * depth, 0, 1),
      clamp(line.color[3] * alphaScale * pulse, 0, 1)
    ];

    positions.push(a.x, a.y, b.x, b.y);
    colors.push(...color, ...color);
  }

  if (!positions.length) return;

  gl.useProgram(state.lineProgram);
  updateBuffer(gl, state.linePositionBuffer, new Float32Array(positions));
  updateBuffer(gl, state.lineColorBuffer, new Float32Array(colors));

  bindAttrib(gl, state.lineProgram, state.linePositionBuffer, "aPosition", 2);
  bindAttrib(gl, state.lineProgram, state.lineColorBuffer, "aColor", 4);

  gl.drawArrays(gl.LINES, 0, positions.length / 2);
}

function drawPoints(gl, points, alphaScale = 1) {
  const positions = [];
  const colors = [];
  const sizes = [];

  for (const point of points) {
    const projected = projectedSeat(point.seat);
    const pulse = 0.88 + Math.sin(state.time * 2.15 + point.seat.band * 0.42 + point.seat.radial * 0.31) * 0.12;
    const depth = clamp(0.86 + projected.z * 0.11, 0.64, 1.20);

    const color = [
      clamp(point.color[0] * depth, 0, 1),
      clamp(point.color[1] * depth, 0, 1),
      clamp(point.color[2] * depth, 0, 1),
      clamp(point.color[3] * alphaScale * pulse, 0, 1)
    ];

    positions.push(projected.x, projected.y);
    colors.push(...color);
    sizes.push(Math.max(2.5, point.size * state.dpr * projected.perspective));
  }

  if (!positions.length) return;

  gl.useProgram(state.pointProgram);
  updateBuffer(gl, state.pointPositionBuffer, new Float32Array(positions));
  updateBuffer(gl, state.pointColorBuffer, new Float32Array(colors));
  updateBuffer(gl, state.pointSizeBuffer, new Float32Array(sizes));

  bindAttrib(gl, state.pointProgram, state.pointPositionBuffer, "aPosition", 2);
  bindAttrib(gl, state.pointProgram, state.pointColorBuffer, "aColor", 4);
  bindAttrib(gl, state.pointProgram, state.pointSizeBuffer, "aSize", 1);

  gl.drawArrays(gl.POINTS, 0, positions.length / 2);
}

function renderWebGL() {
  if (!state.gl || !state.geometryBuilt) return;

  const gl = state.gl;

  resizeCanvas();

  gl.clearColor(0.004, 0.014, 0.034, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (state.lens === "crystal") {
    drawTriangles(gl, state.triangles, 1.0);
  } else {
    drawTriangles(gl, state.triangles, 0.10);
    drawLines(gl, state.latticeLines, 0.92);
    drawLines(gl, state.fibonacciHighlightLines, 0.98);
    drawLines(gl, state.crystalEdges, 0.22);
    drawPoints(gl, state.latticePoints, 0.98);
  }

  state.renderCount += 1;
  publishFingerprint("render");
}

function step(timestamp) {
  const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
  state.lastFrame = timestamp;
  state.time += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;

    const damping = Math.pow(0.938, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.time * 0.24) * dt * 0.018;
    }
  }

  state.pitch = clamp(state.pitch, -0.94, 0.74);
  state.roll = Math.sin(state.time * 0.18) * 0.013;

  renderWebGL();

  state.raf = window.requestAnimationFrame(step);
}

function resetDiamond() {
  state.yaw = -0.62;
  state.pitch = -0.22;
  state.roll = 0.015;
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

    state.yaw += dx * 0.0085;
    state.pitch = clamp(state.pitch + dy * 0.0058, -0.94, 0.74);

    state.velocityYaw = clamp(dx * 0.0024, -0.052, 0.052);
    state.velocityPitch = clamp(dy * 0.0016, -0.040, 0.040);

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

  state.touchReady = true;
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

function createWebGLContext(canvas) {
  return (
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    })
  );
}

function neutralizeDuplicateCanvases(stage, canonicalCanvas) {
  const canvases = Array.from(stage.querySelectorAll("canvas"));
  let duplicates = 0;

  for (const canvas of canvases) {
    if (canvas === canonicalCanvas) continue;

    duplicates += 1;
    canvas.setAttribute("data-showroom-diamond-legacy-neutralized", "true");
    canvas.style.display = "none";
    canvas.style.visibility = "hidden";
    canvas.style.pointerEvents = "none";

    try {
      canvas.remove();
    } catch (_error) {}
  }

  state.duplicateCanvasCount += duplicates;
}

function enforceCanonicalCanvas(stage, canvas) {
  neutralizeDuplicateCanvases(stage, canvas);

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    zIndex: "2",
    pointerEvents: "none",
    background: "transparent",
    imageRendering: "auto"
  });

  canvas.setAttribute("data-showroom-diamond-canonical-canvas", "true");
  canvas.setAttribute("data-showroom-diamond-contract", MONOCHROME_REFINEMENT_CONTRACT);
  canvas.setAttribute("data-showroom-diamond-previous-contract", PREVIOUS_BEAUTY_REFINEMENT_CONTRACT);
  canvas.setAttribute("data-showroom-diamond-previous-consumption-audit-contract", PREVIOUS_CONSUMPTION_AUDIT_CONTRACT);
  canvas.setAttribute("data-generation", "G2");
  canvas.setAttribute("data-radial-nodes", String(RADIAL_NODES));
  canvas.setAttribute("data-fibonacci-bands", String(FIBONACCI_BANDS));
  canvas.setAttribute("data-lattice-states", String(LATTICE_STATES));
  canvas.setAttribute("data-crystal-form-rule", "diamond-is-diamond-no-lattice-overlay");
  canvas.setAttribute("data-lattice-structure-rule", "lattice-is-structure-lens-only");
  canvas.setAttribute("data-generated-image", "false");
  canvas.setAttribute("data-graphic-box", "false");

  state.canonicalCanvasBound = true;

  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(() => {
      neutralizeDuplicateCanvases(stage, canvas);
    });

    observer.observe(stage, { childList: true, subtree: false });
  }
}

function markRoute() {
  const markers = {
    showroomContract: MONOCHROME_REFINEMENT_CONTRACT,
    showroomPreviousContract: PREVIOUS_BEAUTY_REFINEMENT_CONTRACT,
    showroomPreviousConsumptionAuditContract: PREVIOUS_CONSUMPTION_AUDIT_CONTRACT,
    showroomStandard: ACTIVE_STANDARD,
    showroomPairedHtmlContract: PAIRED_HTML_CONTRACT,
    showroomGeneration: "G2",
    showroomGenerationOneStatus: "lost-overwritten",
    showroomStatus: "g2-crystal-lattice-separation-monochrome-refinement-active",
    diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
    renderer: "native-webgl",
    renderModel: "single-canonical-canvas-deterministic-fibonacci-lattice-webgl",
    radialNodes: String(RADIAL_NODES),
    fibonacciBands: String(FIBONACCI_BANDS),
    latticeStates: String(LATTICE_STATES),
    latticeEquation: "16_RADIAL_NODES_X_16_FIBONACCI_BANDS_EQUALS_256_LATTICE_SEATS",
    crystalFormRule: "diamond-is-diamond-no-lattice-overlay",
    latticeStructureRule: "lattice-is-structure-lens-only",
    defaultLens: "crystal-form",
    secondaryLens: "lattice-structure",
    touchGlideDiamond: "true",
    doubleTapReset: "true",
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

  window.DGB_SHOWROOM_JS_CACHE_KEY = MONOCHROME_REFINEMENT_CONTRACT;
  window.DGB_SHOWROOM_DIAMOND_REFINEMENT_CONTRACT = MONOCHROME_REFINEMENT_CONTRACT;
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);

  state.errors.push({
    scope,
    message,
    time: new Date().toISOString()
  });

  document.documentElement.dataset.showroomDiamondError = message;
  publishFingerprint(`error:${scope}`);
}

function publishFingerprint(scope = "publish") {
  const payload = Object.freeze({
    scope,
    contract: MONOCHROME_REFINEMENT_CONTRACT,
    previousContract: PREVIOUS_BEAUTY_REFINEMENT_CONTRACT,
    previousConsumptionAuditContract: PREVIOUS_CONSUMPTION_AUDIT_CONTRACT,
    pairedHtmlContract: PAIRED_HTML_CONTRACT,
    standard: ACTIVE_STANDARD,
    generation: "G2",
    generationOneStatus: "lost-overwritten",
    route: "/showroom/",
    renderer: "native-webgl",
    canonicalCanvasBound: state.canonicalCanvasBound,
    duplicateCanvasCount: state.duplicateCanvasCount,
    activeLens: state.lens,
    radialNodes: RADIAL_NODES,
    fibonacciBands: FIBONACCI_BANDS,
    latticeStates: LATTICE_STATES,
    latticeNodeCount: state.latticePoints.length,
    latticeSeats: state.seats.length,
    geometryBuilt: state.geometryBuilt,
    crystalMeshReady: state.crystalMeshReady,
    latticeMeshReady: state.latticeMeshReady,
    crystallineFacetLineCount: state.crystallineFacetLines.length,
    fibonacciHighlightLineCount: state.fibonacciHighlightLines.length,
    crystalFormDrawsLattice: false,
    crystalFormDrawsNodes: false,
    crystalFormPalette: "monochrome-diamond-crystal-icy-white-silver-pale-blue",
    latticeStructureVisible: true,
    touchReady: state.touchReady,
    canvasReady: state.canvasReady,
    glReady: state.glReady,
    initialized: state.initialized,
    renderCount: state.renderCount,
    yaw: state.yaw,
    pitch: state.pitch,
    generatedImage: false,
    graphicBox: false,
    audraliaInheritance: false,
    planetTemplateInheritance: false,
    visualPassClaim: false,
    errors: state.errors.slice()
  });

  window.DGB_SHOWROOM_DIAMOND_CONSUMPTION_FINGERPRINT = payload;
  window.DGBShowroomDiamondConsumptionFingerprint = payload;
  window.DGB_SHOWROOM_DIAMOND_MONOCHROME_REFINEMENT_FINGERPRINT = payload;

  document.documentElement.dataset.showroomDiamondRenderCount = String(state.renderCount);
  document.documentElement.dataset.showroomDiamondLatticeNodeCount = String(state.latticePoints.length);
  document.documentElement.dataset.showroomDiamondGeometryBuilt = state.geometryBuilt ? "true" : "false";
  document.documentElement.dataset.showroomDiamondCanvasReady = state.canvasReady ? "true" : "false";
  document.documentElement.dataset.showroomDiamondGlReady = state.glReady ? "true" : "false";
  document.documentElement.dataset.showroomDiamondCrystalFormDrawsLattice = "false";
  document.documentElement.dataset.showroomDiamondCrystalFormPalette = "monochrome-diamond-crystal";

  return payload;
}

function publishApi() {
  window.DGBShowroomDiamond = {
    ...SHOWROOM_DIAMOND_STATE,
    setLens,
    resetDiamond,
    render: renderWebGL,
    status() {
      return publishFingerprint("status");
    }
  };

  return window.DGBShowroomDiamond;
}

function initWebGL(canvas) {
  const gl = createWebGLContext(canvas);

  if (!gl) {
    document.documentElement.dataset.showroomWebglError = "WEBGL_CONTEXT_UNAVAILABLE";
    return null;
  }

  initPrograms(gl);

  state.gl = gl;
  state.glReady = true;

  return gl;
}

function initShowroomDiamond() {
  try {
    markRoute();

    const stage = document.querySelector("[data-showroom-diamond-stage]");
    const canvas = document.querySelector("[data-showroom-diamond-canvas]");

    if (!stage || !canvas) {
      document.documentElement.dataset.showroomDiamondError = "STAGE_OR_CANVAS_MISSING";
      publishFingerprint("stage-or-canvas-missing");
      return null;
    }

    state.stage = stage;
    state.canvas = canvas;

    enforceCanonicalCanvas(stage, canvas);
    buildGeometry();
    bindLensControls();

    const gl = initWebGL(canvas);
    if (!gl) return null;

    bindPointer(stage);
    resizeCanvas();

    state.canvasReady = true;
    state.initialized = true;

    renderWebGL();
    publishApi();

    window.addEventListener("resize", renderWebGL, { passive: true });

    if (!state.raf) {
      state.raf = window.requestAnimationFrame(step);
    }

    publishFingerprint("init-complete");

    return window.DGBShowroomDiamond;
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
  MONOCHROME_REFINEMENT_CONTRACT,
  PREVIOUS_BEAUTY_REFINEMENT_CONTRACT,
  PREVIOUS_CONSUMPTION_AUDIT_CONTRACT,
  initShowroomDiamond,
  setLens,
  resetDiamond
};

export default SHOWROOM_DIAMOND_STATE;
