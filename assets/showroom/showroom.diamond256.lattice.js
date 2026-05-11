// /assets/showroom/showroom.diamond256.lattice.js
// SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v1
// Full-file replacement.
// Showroom cover visual asset only.
//
// Purpose:
// - Render a rotating diamond-like 256-face lattice in code.
// - Express Fibonacci geometry through the fixed 256 nodal construct.
// - Use a zigzag Fibonacci traversal through the 16 × 16 node field.
// - Replace the weak single-diamond impression with a faceted diamond lattice.
// - Stay glamorous and cover-facing.
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

const CONTRACT = "SHOWROOM_256_FACE_FIBONACCI_DIAMOND_LATTICE_TNT_v1";
const MASTER_PSALM_BINDING = "MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_v1";

const GRID = 16;
const NODE_COUNT = 256;

const FIBONACCI_WITHIN_256 = Object.freeze([
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233
]);

const STATE = {
  canvas: null,
  ctx: null,
  host: null,
  frame: 0,
  rotation: 0,
  raf: 0,
  active: true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return `rgb(${Math.round(lerp(a.r, b.r, t))}, ${Math.round(lerp(a.g, b.g, t))}, ${Math.round(lerp(a.b, b.b, t))})`;
}

function hashUnit(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function isFibonacciNode(nodeIndexOneBased) {
  return FIBONACCI_WITHIN_256.includes(nodeIndexOneBased);
}

function fibonacciRank(nodeIndexOneBased) {
  let rank = 0;

  for (let i = 0; i < FIBONACCI_WITHIN_256.length; i += 1) {
    if (FIBONACCI_WITHIN_256[i] <= nodeIndexOneBased) rank = i + 1;
  }

  return rank;
}

function nearestFibonacciDistance(nodeIndexOneBased) {
  return Math.min(...FIBONACCI_WITHIN_256.map((value) => Math.abs(value - nodeIndexOneBased)));
}

function zigzagIndex(row, col) {
  if (row % 2 === 0) return row * GRID + col;
  return row * GRID + (GRID - 1 - col);
}

function buildNodes() {
  const nodes = [];

  for (let row = 0; row < GRID; row += 1) {
    for (let col = 0; col < GRID; col += 1) {
      const zigzag = zigzagIndex(row, col);
      const oneBased = zigzag + 1;
      const x = (col / (GRID - 1)) * 2 - 1;
      const y = (row / (GRID - 1)) * 2 - 1;

      const diamondMask = 1 - (Math.abs(x) + Math.abs(y)) * 0.5;
      const crownCurve = Math.sin((col / (GRID - 1)) * Math.PI);
      const pavilionCurve = Math.cos(((row - 7.5) / 15) * Math.PI * 0.5);
      const fibDistance = nearestFibonacciDistance(oneBased);
      const fibProximity = clamp(1 - fibDistance / 34, 0, 1);
      const rank = fibonacciRank(oneBased);

      nodes.push({
        row,
        col,
        index: zigzag,
        oneBased,
        x,
        y,
        diamondMask,
        crownCurve,
        pavilionCurve,
        fibProximity,
        fibRank: rank,
        fibonacci: isFibonacciNode(oneBased),
        noiseA: hashUnit(oneBased, 1),
        noiseB: hashUnit(oneBased, 2),
        noiseC: hashUnit(oneBased, 3)
      });
    }
  }

  return nodes.sort((a, b) => a.index - b.index);
}

const NODES = Object.freeze(buildNodes());

function buildFibonacciZigzagPath() {
  return FIBONACCI_WITHIN_256.map((oneBased) => {
    const index = oneBased - 1;
    return NODES.find((node) => node.index === index) || NODES[index];
  }).filter(Boolean);
}

const FIBONACCI_PATH = Object.freeze(buildFibonacciZigzagPath());

function ensureHost(providedHost = null) {
  if (providedHost instanceof HTMLElement) return providedHost;

  return (
    document.querySelector("[data-showroom-diamond256-mount]") ||
    document.querySelector("[data-showroom-cover-diamond-mount]") ||
    document.querySelector("[data-showroom-cover-visual]") ||
    document.querySelector(".showroom-cover-visual") ||
    document.querySelector(".cover-visual") ||
    document.querySelector("main") ||
    document.body
  );
}

function ensureStyle() {
  if (document.getElementById("showroom-diamond256-lattice-style-v1")) return;

  const style = document.createElement("style");
  style.id = "showroom-diamond256-lattice-style-v1";
  style.textContent = `
    [data-showroom-diamond256-shell] {
      position: relative;
      width: 100%;
      min-height: clamp(340px, 72vw, 680px);
      display: grid;
      place-items: center;
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid rgba(244, 191, 96, 0.30);
      background:
        radial-gradient(circle at 50% 48%, rgba(244, 191, 96, 0.18), transparent 18rem),
        radial-gradient(circle at 50% 36%, rgba(142, 190, 255, 0.15), transparent 16rem),
        linear-gradient(180deg, rgba(9, 17, 31, 0.94), rgba(3, 7, 19, 0.98));
      box-shadow: 0 26px 82px rgba(0, 0, 0, 0.44);
    }

    [data-showroom-diamond256-canvas] {
      width: min(96%, 860px);
      height: auto;
      aspect-ratio: 1.18 / 1;
      display: block;
      transform: none !important;
    }

    [data-showroom-diamond256-label] {
      position: absolute;
      left: 18px;
      top: 18px;
      z-index: 2;
      padding: 8px 12px;
      border: 1px solid rgba(244, 191, 96, 0.34);
      border-radius: 999px;
      color: #f4bf60;
      background: rgba(5, 9, 18, 0.72);
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  `;

  document.head.appendChild(style);
}

function ensureCanvas(host) {
  ensureStyle();

  let shell = host.querySelector?.("[data-showroom-diamond256-shell]") || null;

  if (!shell) {
    shell = document.createElement("section");
    shell.setAttribute("data-showroom-diamond256-shell", "true");
    shell.setAttribute("data-contract", CONTRACT);
    shell.setAttribute("data-master-psalm-binding", MASTER_PSALM_BINDING);
    shell.setAttribute("data-lattice-count", String(NODE_COUNT));
    shell.setAttribute("data-lattice-geometry", "16x16");
    shell.setAttribute("data-fibonacci-zigzag", "true");
    shell.setAttribute("data-generated-image", "false");
    shell.setAttribute("data-graphic-box", "false");
    shell.setAttribute("data-parent-mutation-authorized", "false");

    shell.innerHTML = `
      <div data-showroom-diamond256-label>256 Face · Fibonacci Diamond</div>
      <canvas
        data-showroom-diamond256-canvas
        width="1400"
        height="1180"
        aria-label="Rotating 256-face Fibonacci diamond lattice"
        role="img"
      ></canvas>
    `;

    host.appendChild(shell);
  }

  const canvas = shell.querySelector("[data-showroom-diamond256-canvas]");
  const ctx = canvas.getContext("2d", { alpha: true });

  STATE.host = host;
  STATE.canvas = canvas;
  STATE.ctx = ctx;

  return canvas;
}

function resizeCanvas() {
  const { canvas } = STATE;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || 860));
  const cssHeight = Math.max(280, Math.floor(cssWidth / 1.18));
  const width = Math.floor(cssWidth * STATE.dpr);
  const height = Math.floor(cssHeight * STATE.dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function rotateY(x, z, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: x * c - z * s,
    z: x * s + z * c
  };
}

function diamondPoint(node, width, height, angle) {
  const centerX = width * 0.5;
  const centerY = height * 0.50;
  const scaleX = width * 0.39;
  const scaleY = height * 0.34;

  const x = node.x;
  const y = node.y;

  const upper = y < -0.08;
  const lower = y > 0.10;

  const zBase =
    upper
      ? 0.24 + node.crownCurve * 0.24
      : lower
        ? -0.38 + node.pavilionCurve * 0.28
        : 0.12 + node.crownCurve * 0.18;

  const facetLift = node.fibProximity * 0.14 + node.noiseA * 0.07;
  const rotated = rotateY(x, zBase + facetLift, angle);

  const perspective = 1 / (1.35 - rotated.z * 0.26);
  const diamondCompression = 1 - Math.abs(x) * 0.18;

  const sx = centerX + rotated.x * scaleX * perspective;
  const sy = centerY + y * scaleY * diamondCompression * perspective + rotated.z * height * 0.055;

  return {
    x: sx,
    y: sy,
    z: rotated.z,
    p: perspective,
    light: clamp(0.48 + rotated.z * 0.34 + node.fibProximity * 0.20 + node.noiseB * 0.14, 0.14, 1.18)
  };
}

function buildFacetPolygons(width, height, angle) {
  const pointMap = new Map();

  for (const node of NODES) {
    pointMap.set(`${node.row},${node.col}`, {
      node,
      point: diamondPoint(node, width, height, angle)
    });
  }

  const facets = [];

  for (let row = 0; row < GRID - 1; row += 1) {
    for (let col = 0; col < GRID - 1; col += 1) {
      const a = pointMap.get(`${row},${col}`);
      const b = pointMap.get(`${row},${col + 1}`);
      const c = pointMap.get(`${row + 1},${col + 1}`);
      const d = pointMap.get(`${row + 1},${col}`);

      if (!a || !b || !c || !d) continue;

      const centerMask = (a.node.diamondMask + b.node.diamondMask + c.node.diamondMask + d.node.diamondMask) / 4;
      if (centerMask < 0.28) continue;

      const fibWeight = (a.node.fibProximity + b.node.fibProximity + c.node.fibProximity + d.node.fibProximity) / 4;
      const exactFib = a.node.fibonacci || b.node.fibonacci || c.node.fibonacci || d.node.fibonacci;
      const z = (a.point.z + b.point.z + c.point.z + d.point.z) / 4;

      facets.push({
        points: [a.point, b.point, c.point, d.point],
        nodes: [a.node, b.node, c.node, d.node],
        fibWeight,
        exactFib,
        z,
        mask: centerMask,
        index: row * (GRID - 1) + col
      });
    }
  }

  return facets.sort((left, right) => left.z - right.z);
}

function drawBackground(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createRadialGradient(width * 0.5, height * 0.44, width * 0.03, width * 0.5, height * 0.48, width * 0.58);
  bg.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  bg.addColorStop(0.28, "rgba(142, 190, 255, 0.13)");
  bg.addColorStop(0.55, "rgba(244, 191, 96, 0.07)");
  bg.addColorStop(1, "rgba(1, 3, 10, 0.0)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.44;

  for (let i = 0; i < 90; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = 0.8 + ((i * 7) % 9) / 15;

    ctx.beginPath();
    ctx.fillStyle = i % 13 === 0 ? "rgba(244, 191, 96, 0.58)" : "rgba(232, 242, 255, 0.50)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDiamondBody(ctx, width, height, angle) {
  const facets = buildFacetPolygons(width, height, angle);

  for (const facet of facets) {
    const base =
      facet.exactFib
        ? mix("#f7ead0", "#8ff0c3", 0.34)
        : facet.fibWeight > 0.52
          ? mix("#dfefff", "#f4bf60", 0.30)
          : mix("#8ebeff", "#f8ead0", 0.46);

    const light = clamp(0.42 + facet.z * 0.28 + facet.fibWeight * 0.28 + facet.mask * 0.10, 0.18, 1);
    const color = mix("#07111f", base, light);

    ctx.beginPath();
    ctx.moveTo(facet.points[0].x, facet.points[0].y);

    for (let i = 1; i < facet.points.length; i += 1) {
      ctx.lineTo(facet.points[i].x, facet.points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = clamp(0.52 + facet.mask * 0.24 + facet.fibWeight * 0.15, 0.36, 0.92);
    ctx.fill();

    ctx.strokeStyle = facet.exactFib
      ? "rgba(244, 191, 96, 0.68)"
      : facet.fibWeight > 0.5
        ? "rgba(143, 240, 195, 0.28)"
        : "rgba(255, 255, 255, 0.13)";

    ctx.lineWidth = facet.exactFib ? Math.max(1.2, width * 0.0015) : Math.max(0.5, width * 0.00075);
    ctx.globalAlpha = facet.exactFib ? 0.78 : 0.36;
    ctx.stroke();
  }
}

function drawDiamondOutline(ctx, width, height, angle) {
  const top = diamondPoint({ x: 0, y: -1.08, crownCurve: 1, pavilionCurve: 0, fibProximity: 1, noiseA: 0, noiseB: 0 }, width, height, angle);
  const left = diamondPoint({ x: -1.04, y: -0.02, crownCurve: 0.3, pavilionCurve: 0.3, fibProximity: 0.4, noiseA: 0, noiseB: 0 }, width, height, angle);
  const right = diamondPoint({ x: 1.04, y: -0.02, crownCurve: 0.3, pavilionCurve: 0.3, fibProximity: 0.4, noiseA: 0, noiseB: 0 }, width, height, angle);
  const bottom = diamondPoint({ x: 0, y: 1.08, crownCurve: 0, pavilionCurve: 1, fibProximity: 0.8, noiseA: 0, noiseB: 0 }, width, height, angle);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();

  ctx.strokeStyle = "rgba(244, 191, 96, 0.55)";
  ctx.lineWidth = Math.max(1.4, width * 0.0016);
  ctx.shadowColor = "rgba(244, 191, 96, 0.24)";
  ctx.shadowBlur = 24;
  ctx.stroke();

  ctx.restore();
}

function drawFibonacciZigzag(ctx, width, height, angle) {
  const points = FIBONACCI_PATH.map((node) => ({
    node,
    point: diamondPoint(node, width, height, angle)
  }));

  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.lineWidth = Math.max(1.2, width * 0.0016);
  ctx.strokeStyle = "rgba(143, 240, 195, 0.58)";
  ctx.shadowColor = "rgba(143, 240, 195, 0.32)";
  ctx.shadowBlur = 16;

  ctx.beginPath();

  points.forEach((entry, index) => {
    if (index === 0) ctx.moveTo(entry.point.x, entry.point.y);
    else ctx.lineTo(entry.point.x, entry.point.y);
  });

  ctx.stroke();

  for (const entry of points) {
    const r = Math.max(2.2, width * 0.0038) * (1 + entry.node.fibRank / 18);
    ctx.beginPath();
    ctx.fillStyle = "rgba(244, 191, 96, 0.86)";
    ctx.arc(entry.point.x, entry.point.y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = Math.max(0.7, width * 0.0008);
    ctx.arc(entry.point.x, entry.point.y, r * 1.65, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLabels(ctx, width, height) {
  ctx.save();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(244, 191, 96, 0.92)";
  ctx.font = `${Math.max(16, width * 0.022)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("256-Face Diamond Lattice", width * 0.5, height * 0.085);

  ctx.fillStyle = "rgba(248, 234, 208, 0.72)";
  ctx.font = `${Math.max(12, width * 0.013)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Fibonacci zigzag through the fixed 16 × 16 nodal construct", width * 0.5, height * 0.118);

  ctx.restore();
}

function drawFrame(timestamp = 0) {
  const { canvas, ctx } = STATE;
  if (!canvas || !ctx || !STATE.active) return;

  resizeCanvas();

  if (!STATE.reducedMotion) {
    STATE.rotation += 0.0065;
  }

  STATE.frame += 1;

  const width = canvas.width;
  const height = canvas.height;
  const angle = STATE.rotation;

  drawBackground(ctx, width, height);
  drawDiamondBody(ctx, width, height, angle);
  drawFibonacciZigzag(ctx, width, height, angle);
  drawDiamondOutline(ctx, width, height, angle);
  drawLabels(ctx, width, height);

  if (!STATE.reducedMotion) {
    STATE.raf = requestAnimationFrame(drawFrame);
  }
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    nodeCount: NODE_COUNT,
    grid: `${GRID}x${GRID}`,
    fibonacciWithin256: [...FIBONACCI_WITHIN_256],
    fibonacciZigzag: true,
    generatedImage: false,
    graphicBox: false,
    parentMutationAuthorized: false,
    start,
    stop,
    status: getShowroomDiamond256LatticeStatus,
    getStatus: getShowroomDiamond256LatticeStatus,
    getShowroomDiamond256LatticeStatus
  };

  window.DGBShowroomDiamond256Lattice = api;
  window.ShowroomDiamond256Lattice = api;
}

function getShowroomDiamond256LatticeStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    masterPsalmBinding: MASTER_PSALM_BINDING,
    nodeCount: NODE_COUNT,
    grid: `${GRID}x${GRID}`,
    fibonacciWithin256: [...FIBONACCI_WITHIN_256],
    fibonacciPathLength: FIBONACCI_PATH.length,
    fibonacciZigzag: true,
    rotatingInPlace: !STATE.reducedMotion,
    generatedImage: false,
    graphicBox: false,
    parentMutationAuthorized: false,
    visualPassClaim: false
  };
}

function stop() {
  STATE.active = false;

  if (STATE.raf) {
    cancelAnimationFrame(STATE.raf);
    STATE.raf = 0;
  }
}

function start(host = null) {
  STATE.active = true;
  const target = ensureHost(host);
  ensureCanvas(target);
  exposeApi();

  document.documentElement.dataset.showroomCoverDiamondLattice = "256-face";
  document.documentElement.dataset.latticeCount = String(NODE_COUNT);
  document.documentElement.dataset.latticeGeometry = "16x16";
  document.documentElement.dataset.fibonacciZigzag = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.parentMutationAuthorized = "false";

  resizeCanvas();

  if (STATE.raf) cancelAnimationFrame(STATE.raf);

  if (STATE.reducedMotion) {
    drawFrame(performance.now());
  } else {
    STATE.raf = requestAnimationFrame(drawFrame);
  }

  return getShowroomDiamond256LatticeStatus();
}

window.addEventListener("resize", () => {
  resizeCanvas();
}, { passive: true });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stop();
    return;
  }

  start(STATE.host);
}, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => start(), { once: true });
} else {
  start();
}

export {
  CONTRACT,
  MASTER_PSALM_BINDING,
  GRID,
  NODE_COUNT,
  FIBONACCI_WITHIN_256,
  start,
  stop,
  getShowroomDiamond256LatticeStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  masterPsalmBinding: MASTER_PSALM_BINDING,
  start,
  stop,
  status: getShowroomDiamond256LatticeStatus,
  getStatus: getShowroomDiamond256LatticeStatus,
  getShowroomDiamond256LatticeStatus
};
