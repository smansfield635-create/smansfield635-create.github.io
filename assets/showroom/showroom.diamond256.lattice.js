// /assets/showroom/showroom.diamond256.lattice.js
// SHOWROOM_256_FACE_FIBONACCI_ENCLOSED_DIAMOND_CONSTRUCT_TNT_v3
// Full-file replacement.
// Showroom cover visual asset only.
//
// Purpose:
// - Render one single enclosed rotating diamond construct.
// - Preserve the 256 nodal construct as 16 rings × 16 nodes.
// - Remove the visible zigzag line.
// - Keep Fibonacci as internal progression geometry, not visible path decoration.
// - Avoid the flat plate / loose-node look.
// - Keep the object enclosed inside a clear diamond silhouette.
//
// Does not:
// - use image generation
// - use GraphicBox
// - mutate parent truth
// - import H-Earth terrain
// - import gauges
// - authorize ground level
// - authorize manor placement
// - claim visual pass

const CONTRACT = "SHOWROOM_256_FACE_FIBONACCI_ENCLOSED_DIAMOND_CONSTRUCT_TNT_v3";
const PREVIOUS_CONTRACT = "SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v2";
const ASSET_PATH = "/assets/showroom/showroom.diamond256.lattice.js";

const TOTAL_NODES = 256;
const RINGS = 16;
const NODES_PER_RING = 16;

const FIBONACCI_SEQUENCE = Object.freeze([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

const PROFILE = Object.freeze([
  { y: 1.00, r: 0.34 },
  { y: 0.92, r: 0.48 },
  { y: 0.82, r: 0.62 },
  { y: 0.70, r: 0.76 },
  { y: 0.56, r: 0.90 },
  { y: 0.40, r: 1.02 },
  { y: 0.22, r: 1.13 },
  { y: 0.04, r: 1.22 },
  { y: -0.08, r: 1.20 },
  { y: -0.22, r: 1.02 },
  { y: -0.38, r: 0.84 },
  { y: -0.56, r: 0.66 },
  { y: -0.72, r: 0.48 },
  { y: -0.88, r: 0.30 },
  { y: -1.02, r: 0.15 },
  { y: -1.12, r: 0.02 }
]);

const state = {
  canvas: null,
  ctx: null,
  mount: null,
  width: 0,
  height: 0,
  dpr: 1,
  yaw: 0,
  pitch: -0.16,
  roll: 0,
  raf: 0,
  active: true,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function rotate(point, yaw, pitch, roll) {
  let { x, y, z } = point;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  let nx = x * cy - z * sy;
  let nz = x * sy + z * cy;
  x = nx;
  z = nz;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  let ny = y * cp - z * sp;
  nz = y * sp + z * cp;
  y = ny;
  z = nz;

  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  nx = x * cr - y * sr;
  ny = x * sr + y * cr;

  return { x: nx, y: ny, z };
}

function project(point) {
  const scaleBase = Math.min(state.width, state.height) * 0.30;
  const distance = 5.8;
  const perspective = distance / (distance - point.z);

  return {
    x: state.width * 0.5 + point.x * scaleBase * perspective,
    y: state.height * 0.53 + point.y * scaleBase * perspective,
    z: point.z,
    p: perspective
  };
}

function buildNodes() {
  const nodes = [];
  const step = (Math.PI * 2) / NODES_PER_RING;

  for (let ring = 0; ring < RINGS; ring += 1) {
    const profile = PROFILE[ring];
    const fib = FIBONACCI_SEQUENCE[ring % FIBONACCI_SEQUENCE.length];
    const offset = ((fib % NODES_PER_RING) / NODES_PER_RING) * step * 0.72;

    for (let slot = 0; slot < NODES_PER_RING; slot += 1) {
      const theta = slot * step + offset;
      const crownFactor = ring <= 7 ? 1 : 0.96;
      const pavilionFactor = ring > 7 ? 1 - ((ring - 8) / 9) * 0.06 : 1;

      nodes.push({
        id: ring * NODES_PER_RING + slot,
        ring,
        slot,
        fib,
        x: Math.cos(theta) * profile.r * crownFactor,
        y: profile.y,
        z: Math.sin(theta) * profile.r * pavilionFactor,
        isFibonacciRing: FIBONACCI_SEQUENCE.includes(ring + 1)
      });
    }
  }

  return nodes;
}

function buildFacets() {
  const facets = [];

  for (let ring = 0; ring < RINGS - 1; ring += 1) {
    for (let slot = 0; slot < NODES_PER_RING; slot += 1) {
      const a = ring * NODES_PER_RING + slot;
      const b = ring * NODES_PER_RING + ((slot + 1) % NODES_PER_RING);
      const c = (ring + 1) * NODES_PER_RING + slot;
      const d = (ring + 1) * NODES_PER_RING + ((slot + 1) % NODES_PER_RING);

      facets.push([a, c, b]);
      facets.push([b, c, d]);
    }
  }

  return facets;
}

function buildEdges() {
  const edges = [];

  for (let ring = 0; ring < RINGS; ring += 1) {
    for (let slot = 0; slot < NODES_PER_RING; slot += 1) {
      const a = ring * NODES_PER_RING + slot;
      const b = ring * NODES_PER_RING + ((slot + 1) % NODES_PER_RING);
      edges.push([a, b]);

      if (ring < RINGS - 1) {
        const c = (ring + 1) * NODES_PER_RING + slot;
        edges.push([a, c]);
      }
    }
  }

  return edges;
}

const NODES = Object.freeze(buildNodes());
const FACETS = Object.freeze(buildFacets());
const EDGES = Object.freeze(buildEdges());

function resize() {
  if (!state.canvas || !state.mount) return;

  const rect = state.mount.getBoundingClientRect();
  state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  state.width = Math.max(320, Math.floor(rect.width || 960));
  state.height = Math.max(340, Math.floor(rect.height || Math.min(state.width * 0.78, 720)));

  state.canvas.width = Math.floor(state.width * state.dpr);
  state.canvas.height = Math.floor(state.height * state.dpr);
  state.ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function drawBackground() {
  const ctx = state.ctx;

  ctx.clearRect(0, 0, state.width, state.height);

  const glow = ctx.createRadialGradient(
    state.width * 0.5,
    state.height * 0.50,
    state.width * 0.03,
    state.width * 0.5,
    state.height * 0.52,
    state.width * 0.58
  );

  glow.addColorStop(0, "rgba(255,255,255,0.18)");
  glow.addColorStop(0.25, "rgba(190,220,255,0.13)");
  glow.addColorStop(0.52, "rgba(244,191,96,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  ctx.globalAlpha = 0.42;

  for (let i = 0; i < 76; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * state.width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * state.height;
    const r = 0.7 + ((i * 7) % 11) / 14;

    ctx.beginPath();
    ctx.fillStyle = i % 9 === 0 ? "rgba(244,191,96,0.66)" : "rgba(232,242,255,0.58)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function transformedNodes() {
  return NODES.map((node) => {
    const rotated = rotate(
      {
        x: node.x * 1.18,
        y: node.y * 1.08,
        z: node.z * 1.18
      },
      state.yaw,
      state.pitch,
      state.roll
    );

    const projected = project(rotated);

    return {
      ...node,
      rx: rotated.x,
      ry: rotated.y,
      rz: rotated.z,
      sx: projected.x,
      sy: projected.y,
      depth: projected.z,
      perspective: projected.p
    };
  });
}

function drawFacets(points) {
  const ctx = state.ctx;
  const light = normalize({ x: -0.42, y: -0.78, z: 1.26 });

  const sorted = FACETS.map((facet) => {
    const a = points[facet[0]];
    const b = points[facet[1]];
    const c = points[facet[2]];

    const ab = sub({ x: b.rx, y: b.ry, z: b.rz }, { x: a.rx, y: a.ry, z: a.rz });
    const ac = sub({ x: c.rx, y: c.ry, z: c.rz }, { x: a.rx, y: a.ry, z: a.rz });
    const normal = normalize(cross(ab, ac));
    const brightness = clamp(dot(normal, light) * 0.72 + 0.56, 0.08, 1.12);
    const depth = (a.depth + b.depth + c.depth) / 3;
    const fibBias = (a.fib + b.fib + c.fib) / 3;

    return { a, b, c, brightness, depth, fibBias };
  }).sort((left, right) => left.depth - right.depth);

  for (const facet of sorted) {
    const b = facet.brightness;
    const cool = Math.round(160 + b * 76);
    const warm = Math.round(170 + b * 60);
    const alpha = clamp(0.14 + b * 0.22, 0.08, 0.42);
    const goldAlpha = clamp(0.05 + (facet.fibBias % 13) / 13 * 0.10, 0.05, 0.16);

    ctx.beginPath();
    ctx.moveTo(facet.a.sx, facet.a.sy);
    ctx.lineTo(facet.b.sx, facet.b.sy);
    ctx.lineTo(facet.c.sx, facet.c.sy);
    ctx.closePath();

    const fill = ctx.createLinearGradient(facet.a.sx, facet.a.sy, facet.c.sx, facet.c.sy);
    fill.addColorStop(0, `rgba(${cool},${warm},255,${alpha})`);
    fill.addColorStop(0.45, `rgba(255,255,255,${alpha * 0.58})`);
    fill.addColorStop(1, `rgba(244,191,96,${goldAlpha})`);

    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = `rgba(255,235,190,${0.07 + b * 0.11})`;
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }
}

function drawEdges(points) {
  const ctx = state.ctx;

  ctx.save();

  for (const edge of EDGES) {
    const a = points[edge[0]];
    const b = points[edge[1]];
    const depth = clamp(((a.depth + b.depth) * 0.5 + 2.5) / 5.2, 0.08, 1);

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,220,150,${0.10 + depth * 0.22})`;
    ctx.lineWidth = Math.max(0.72, 0.8 + depth * 0.55);
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNodes(points) {
  const ctx = state.ctx;

  for (const node of points) {
    const front = clamp((node.depth + 2.4) / 5.2, 0, 1);
    const size = clamp(1.1 + front * 2.5, 1.1, 4.8);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,210,96,${0.18 + front * 0.36})`;
    ctx.arc(node.sx, node.sy, size + 1.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,248,216,${0.44 + front * 0.48})`;
    ctx.arc(node.sx, node.sy, size * 0.44, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnclosure(points) {
  const ctx = state.ctx;
  const top = points[0];
  const bottom = points[255];

  const left = points.reduce((winner, node) => node.sx < winner.sx ? node : winner, points[0]);
  const right = points.reduce((winner, node) => node.sx > winner.sx ? node : winner, points[0]);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(top.sx, top.sy);
  ctx.lineTo(right.sx, right.sy);
  ctx.lineTo(bottom.sx, bottom.sy);
  ctx.lineTo(left.sx, left.sy);
  ctx.closePath();

  ctx.strokeStyle = "rgba(244,191,96,0.62)";
  ctx.lineWidth = Math.max(1.4, state.width * 0.0018);
  ctx.shadowColor = "rgba(244,191,96,0.28)";
  ctx.shadowBlur = 26;
  ctx.stroke();
  ctx.restore();
}

function drawReflection(points) {
  const ctx = state.ctx;
  const bottom = points[255];

  const gradient = ctx.createRadialGradient(
    bottom.sx,
    bottom.sy + state.height * 0.08,
    2,
    bottom.sx,
    bottom.sy + state.height * 0.12,
    state.width * 0.20
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.24, "rgba(142,190,255,0.11)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(bottom.sx, bottom.sy + state.height * 0.13, state.width * 0.22, state.height * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawLabel() {
  const ctx = state.ctx;

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(244,191,96,0.96)";
  ctx.font = "800 23px Inter, system-ui, sans-serif";
  ctx.fillText("256-Face Enclosed Diamond", state.width * 0.5, 38);

  ctx.fillStyle = "rgba(186,194,207,0.86)";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText("Fibonacci geometry folded into one rotating volumetric construct", state.width * 0.5, 59);
  ctx.restore();
}

function draw(time = 0) {
  if (!state.active || !state.ctx) return;

  if (!state.reducedMotion) {
    state.yaw += 0.0062;
    state.roll += 0.0007;
  }

  drawBackground();
  const points = transformedNodes();

  drawReflection(points);
  drawFacets(points);
  drawEdges(points);
  drawNodes(points);
  drawEnclosure(points);
  drawLabel();

  if (!state.reducedMotion) {
    state.raf = window.requestAnimationFrame(draw);
  }
}

function start(host = null) {
  state.mount =
    host ||
    document.querySelector("[data-showroom-diamond256-mount]") ||
    document.querySelector("[data-showroom-cover-diamond-mount]") ||
    document.querySelector("main") ||
    document.body;

  if (!state.mount) return null;

  state.mount.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Single enclosed rotating 256-face diamond construct");
  canvas.setAttribute("role", "img");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.borderRadius = "22px";
  canvas.style.background = "transparent";

  state.mount.appendChild(canvas);
  state.canvas = canvas;
  state.ctx = canvas.getContext("2d", { alpha: true });
  state.active = true;

  state.mount.dataset.contract = CONTRACT;
  state.mount.dataset.previousContract = PREVIOUS_CONTRACT;
  state.mount.dataset.diamondMode = "single-enclosed-three-dimensional-construct";
  state.mount.dataset.totalNodes = String(TOTAL_NODES);
  state.mount.dataset.rings = String(RINGS);
  state.mount.dataset.nodesPerRing = String(NODES_PER_RING);
  state.mount.dataset.fibonacciZigzag = "false";
  state.mount.dataset.fibonacciGeometry = "folded-into-construct";
  state.mount.dataset.generatedImage = "false";
  state.mount.dataset.graphicBox = "false";
  state.mount.dataset.parentMutationAuthorized = "false";
  state.mount.dataset.visualPassClaim = "false";

  document.documentElement.dataset.showroomCoverDiamondLattice = "256-face";
  document.documentElement.dataset.diamondMode = "single-enclosed-three-dimensional-construct";
  document.documentElement.dataset.fibonacciZigzag = "false";
  document.documentElement.dataset.fibonacciGeometry = "folded-into-construct";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";

  resize();

  if (state.raf) window.cancelAnimationFrame(state.raf);

  if (state.reducedMotion) draw(performance.now());
  else state.raf = window.requestAnimationFrame(draw);

  return getShowroomDiamond256LatticeStatus();
}

function stop() {
  state.active = false;

  if (state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

function getShowroomDiamond256LatticeStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    assetPath: ASSET_PATH,
    totalNodes: TOTAL_NODES,
    rings: RINGS,
    nodesPerRing: NODES_PER_RING,
    diamondMode: "single-enclosed-three-dimensional-construct",
    fibonacciZigzag: false,
    fibonacciGeometry: "folded-into-construct",
    generatedImage: false,
    graphicBox: false,
    parentMutationAuthorized: false,
    visualPassClaim: false
  };
}

window.addEventListener("resize", resize, { passive: true });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stop();
    return;
  }

  start(state.mount);
}, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => start(), { once: true });
} else {
  start();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  ASSET_PATH,
  TOTAL_NODES,
  RINGS,
  NODES_PER_RING,
  start,
  stop,
  getShowroomDiamond256LatticeStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  assetPath: ASSET_PATH,
  start,
  stop,
  status: getShowroomDiamond256LatticeStatus,
  getStatus: getShowroomDiamond256LatticeStatus,
  getShowroomDiamond256LatticeStatus
};
