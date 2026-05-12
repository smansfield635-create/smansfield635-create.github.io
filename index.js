// /index.js
// COMPASS_LEGACY_FRONTIER_MARRIAGE_JS_TNT_v2
// Full-file replacement.
// Root Compass renderer only.
//
// v2 correction:
// - Straightens Flat context.
// - Centers the architectural board.
// - Prevents title and route labels from clipping.
// - Makes the Flat board read as organized, intentional, and measured.
// - Preserves Round / Globe context split.
// - No receipts.
// - No GraphicBox.
// - No generated images.

const CONTRACT = "COMPASS_LEGACY_FRONTIER_MARRIAGE_JS_TNT_v2";
const HTML_CONTRACT = "COMPASS_LEGACY_FRONTIER_MARRIAGE_HTML_TNT_v1";

const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 64 : 44;

const CONTEXTS = Object.freeze({
  flat: {
    key: "flat",
    title: "Flat",
    route: "/",
    subtitle: "Architectural route board",
    palette: {
      bg0: "#030712",
      bg1: "#071225",
      bg2: "#121827",
      line: "rgba(142,190,255,.20)",
      accent: "#8ebeff",
      active: "#f4bf60",
      glow: "rgba(142,190,255,.22)"
    }
  },
  round: {
    key: "round",
    title: "Round",
    route: "/?lens=round",
    subtitle: "Estate-centered orbital field",
    palette: {
      bg0: "#030512",
      bg1: "#0a1130",
      bg2: "#25185d",
      line: "rgba(170,135,255,.22)",
      accent: "#a889ff",
      active: "#f4bf60",
      glow: "rgba(136,92,255,.34)"
    }
  },
  globe: {
    key: "globe",
    title: "Globe",
    route: "/nine-summits/universe/",
    subtitle: "Universe-scale expansion field",
    palette: {
      bg0: "#02040e",
      bg1: "#0b1030",
      bg2: "#21133f",
      line: "rgba(190,170,255,.24)",
      accent: "#beaaff",
      active: "#f4bf60",
      glow: "rgba(190,170,255,.32)"
    }
  }
});

const CONTEXT_SELECTORS = Object.freeze([
  { key: "flat", label: "Flat", route: "/" },
  { key: "round", label: "Round", route: "/?lens=round" },
  { key: "globe", label: "Globe", route: "/nine-summits/universe/" }
]);

const FLAT_ROUTES = Object.freeze([
  { label: "Door", route: "/door/" },
  { label: "Home", route: "/home/" },
  { label: "Showroom", route: "/showroom/" },
  { label: "Products", route: "/products/" },
  { label: "Universe", route: "/nine-summits/universe/" },
  { label: "Triple G", route: "/gauges/" }
]);

const ROUND_ROUTES = Object.freeze([
  { label: "Door", route: "/door/", angle: -Math.PI / 2, radius: 0.86, weight: 1.08 },
  { label: "Home", route: "/home/", angle: -0.76, radius: 1.04, weight: 0.90 },
  { label: "Showroom", route: "/showroom/", angle: 0.00, radius: 1.10, weight: 1.04 },
  { label: "Products", route: "/products/", angle: 0.77, radius: 1.03, weight: 0.94 },
  { label: "Triple G", route: "/gauges/", angle: Math.PI / 2, radius: 0.86, weight: 0.88 },
  { label: "Book", route: "/nine-summits-of-love/", angle: 2.36, radius: 1.02, weight: 0.88 },
  { label: "Frontier", route: "/frontier/", angle: Math.PI, radius: 1.10, weight: 0.90 },
  { label: "Universe", route: "/nine-summits/universe/", angle: -2.36, radius: 1.03, weight: 0.92 }
]);

const GLOBE_ROUTES = Object.freeze([
  { label: "Universe", route: "/nine-summits/universe/", angle: -1.57, radius: 0.76, size: 1.18 },
  { label: "Book", route: "/nine-summits-of-love/", angle: -0.48, radius: 1.08, size: 0.82 },
  { label: "Showroom", route: "/showroom/", angle: 0.70, radius: 0.98, size: 0.92 },
  { label: "Globe", route: "/showroom/globe/", angle: 1.66, radius: 0.82, size: 0.78 },
  { label: "Frontier", route: "/frontier/", angle: 2.65, radius: 1.08, size: 0.74 }
]);

const state = {
  context: "round",
  focusedRoute: null,
  hoverKey: null,

  canvas: null,
  ctx: null,
  mount: null,

  width: 0,
  height: 0,

  active: true,
  visible: true,
  phase: 0,
  lightPhase: 0,
  dragPhase: 0,
  lastFrameAt: 0,
  raf: 0,

  dragging: false,
  pointerId: null,
  pointerStartX: 0,
  pointerStartY: 0,
  dragPhaseStart: 0,

  hitRegions: [],
  lastTap: { key: "", time: 0 }
};

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(seed, index, salt = 0) {
  const x = Math.sin((seed + 1) * 91.17 + (index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function activeContext() {
  return CONTEXTS[state.context] || CONTEXTS.round;
}

function sizeCanvas() {
  if (!state.canvas) return;

  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || state.canvas.clientWidth || 960));
  const cssHeight = Math.max(560, Math.floor(rect.height || state.canvas.clientHeight || 760));

  state.canvas.width = Math.floor(cssWidth * DPR);
  state.canvas.height = Math.floor(cssHeight * DPR);
  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", { alpha: false });
}

function render(time = 0) {
  if (!state.ctx) return;

  const ctx = state.ctx;
  const context = activeContext();

  state.hitRegions = [];

  drawBackground(ctx, context);
  drawContextSelectors(ctx, context);

  if (state.context === "flat") drawFlatContext(ctx, context);
  if (state.context === "round") drawRoundContext(ctx, context, time);
  if (state.context === "globe") drawGlobeContext(ctx, context, time);

  drawSubtleCue(ctx);
  stampDocument();
}

function drawBackground(ctx, context) {
  const { width, height } = state;
  const p = context.palette;

  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.02,
    width * 0.5,
    height * 0.54,
    Math.max(width, height) * 0.82
  );

  bg.addColorStop(0, p.bg2);
  bg.addColorStop(0.48, p.bg1);
  bg.addColorStop(1, p.bg0);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawStarDust(ctx, context, state.context === "flat" ? 28 : 92);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const aura = ctx.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * 0.60);
  aura.addColorStop(0, p.glow);
  aura.addColorStop(0.50, "rgba(244,191,96,.055)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function drawStarDust(ctx, context, countBase) {
  const count = MOBILE ? Math.floor(countBase * 0.58) : countBase;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const x = hash(31, i, 1) * state.width;
    const y = hash(31, i, 2) * state.height;
    const pulse = 0.5 + Math.sin(state.lightPhase * 0.7 + i * 0.61) * 0.5;
    const r = (0.45 + hash(31, i, 3) * 1.4) * DPR;

    ctx.fillStyle = i % 9 === 0
      ? `rgba(244,191,96,${0.16 + pulse * 0.30})`
      : `rgba(226,238,255,${0.14 + pulse * 0.28})`;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawContextSelectors(ctx, context) {
  const width = state.width;
  const y = state.height * (MOBILE ? 0.085 : 0.090);
  const gap = Math.min(width * 0.22, 252 * DPR);
  const startX = width * 0.5 - gap;
  const size = Math.min(width, state.height) * (MOBILE ? 0.074 : 0.062);

  CONTEXT_SELECTORS.forEach((item, index) => {
    const x = startX + gap * index;
    const active = item.key === state.context;
    const hover = item.key === state.hoverKey;

    drawCrystalDiamond(ctx, {
      x,
      y,
      size: active ? size * 1.16 : size,
      label: item.label,
      active,
      hover,
      palette: context.palette,
      seed: 100 + index,
      compact: true
    });

    state.hitRegions.push({
      key: `context:${item.key}`,
      type: "context",
      context: item.key,
      route: item.route,
      x,
      y,
      radius: size * 0.80
    });
  });
}

function drawFlatContext(ctx, context) {
  const layout = getFlatLayout();

  drawFlatGrid(ctx, context, layout);
  drawFlatHeading(ctx, context, layout);
  drawFlatRoutes(ctx, context, layout);
}

function getFlatLayout() {
  const width = state.width;
  const height = state.height;

  const marginX = width * (MOBILE ? 0.075 : 0.11);
  const boardX = marginX;
  const boardW = width - marginX * 2;

  const boardY = height * (MOBILE ? 0.235 : 0.225);
  const boardH = height * (MOBILE ? 0.555 : 0.565);

  const titleY = boardY - height * 0.050;
  const subtitleY = boardY - height * 0.012;

  const innerPadX = boardW * (MOBILE ? 0.070 : 0.075);
  const innerPadY = boardH * 0.185;

  const availableW = boardW - innerPadX * 2;
  const availableH = boardH - innerPadY * 1.58;

  const cols = 3;
  const rows = 2;
  const gapX = availableW * (MOBILE ? 0.065 : 0.075);
  const gapY = availableH * 0.180;

  const cardW = (availableW - gapX * (cols - 1)) / cols;
  const cardH = Math.min(boardH * 0.185, (availableH - gapY) / rows);

  const gridStartX = boardX + innerPadX;
  const gridStartY = boardY + innerPadY;

  return {
    width,
    height,
    boardX,
    boardY,
    boardW,
    boardH,
    titleY,
    subtitleY,
    gridStartX,
    gridStartY,
    cols,
    rows,
    gapX,
    gapY,
    cardW,
    cardH
  };
}

function drawFlatHeading(ctx, context, layout) {
  const titleSize = clamp(layout.boardW * 0.058, 24 * DPR, MOBILE ? 35 * DPR : 52 * DPR);
  const subtitleSize = clamp(layout.boardW * 0.024, 11 * DPR, 18 * DPR);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(248,234,208,.94)";
  ctx.font = `950 ${titleSize}px Inter, system-ui, sans-serif`;
  fitText(ctx, "Architectural Route Board", layout.width * 0.5, layout.titleY, layout.boardW * 0.92);

  ctx.fillStyle = "rgba(186,194,207,.84)";
  ctx.font = `800 ${subtitleSize}px Inter, system-ui, sans-serif`;
  fitText(ctx, "No center object · direct route selection", layout.width * 0.5, layout.subtitleY, layout.boardW * 0.82);

  ctx.restore();
}

function drawFlatRoutes(ctx, context, layout) {
  FLAT_ROUTES.forEach((item, index) => {
    const col = index % layout.cols;
    const row = Math.floor(index / layout.cols);

    const x = layout.gridStartX + col * (layout.cardW + layout.gapX) + layout.cardW * 0.5;
    const y = layout.gridStartY + row * (layout.cardH + layout.gapY) + layout.cardH * 0.5;

    const active = state.focusedRoute === item.route;

    drawRoutePlate(ctx, x, y, layout.cardW, layout.cardH, item.label, routeShortLabel(item.route), active, context.palette);

    state.hitRegions.push({
      key: `route:${item.route}`,
      type: "route",
      route: item.route,
      label: item.label,
      x,
      y,
      radius: Math.max(layout.cardW, layout.cardH) * 0.55
    });
  });
}

function routeShortLabel(route) {
  if (route === "/nine-summits/universe/") return "Universe";
  if (route === "/gauges/") return "Triple G";
  return route.replaceAll("/", "") || "Compass";
}

function drawFlatGrid(ctx, context, layout) {
  const { boardX, boardY, boardW, boardH } = layout;

  ctx.save();

  const wash = ctx.createRadialGradient(
    boardX + boardW * 0.5,
    boardY + boardH * 0.54,
    boardW * 0.04,
    boardX + boardW * 0.5,
    boardY + boardH * 0.54,
    boardW * 0.68
  );
  wash.addColorStop(0, "rgba(142,190,255,.105)");
  wash.addColorStop(0.58, "rgba(142,190,255,.035)");
  wash.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = wash;
  ctx.fillRect(boardX, boardY, boardW, boardH);

  ctx.strokeStyle = context.palette.line;
  ctx.lineWidth = Math.max(0.7, DPR);
  ctx.globalAlpha = 0.44;

  for (let i = 0; i <= 8; i += 1) {
    const x = boardX + (boardW * i) / 8;
    ctx.beginPath();
    ctx.moveTo(x, boardY);
    ctx.lineTo(x, boardY + boardH);
    ctx.stroke();
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = boardY + (boardH * i) / 6;
    ctx.beginPath();
    ctx.moveTo(boardX, y);
    ctx.lineTo(boardX + boardW, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(244,191,96,.34)";
  ctx.lineWidth = Math.max(1.2, DPR * 1.2);
  facetPath(ctx, boardX, boardY, boardW, boardH, 24 * DPR);
  ctx.stroke();

  ctx.restore();
}

function drawRoundContext(ctx, context, time) {
  const field = estateFieldSpec();

  drawLegacyAtmosphericVessel(ctx, context, field);
  drawRoundOrbitPath(ctx, context, field);

  const nodes = ROUND_ROUTES
    .map((item, index) => projectRoundNode(item, index, field))
    .sort((a, b) => a.z - b.z);

  nodes.filter((node) => node.z < 0).forEach((node) => drawRoundNode(ctx, context, node, field, true));
  drawEstateAnchor(ctx, context, field);
  nodes.filter((node) => node.z >= 0).forEach((node) => drawRoundNode(ctx, context, node, field, false));
}

function estateFieldSpec() {
  const min = Math.min(state.width, state.height);

  return {
    x: state.width * 0.50,
    y: state.height * 0.51,
    r: min * (MOBILE ? 0.245 : 0.285),
    orbitX: min * (MOBILE ? 0.365 : 0.405),
    orbitY: min * (MOBILE ? 0.315 : 0.350)
  };
}

function drawLegacyAtmosphericVessel(ctx, context, field) {
  const { x, y, r } = field;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const outer = ctx.createRadialGradient(x, y, r * 0.20, x, y, r * 2.15);
  outer.addColorStop(0, "rgba(255,255,255,.035)");
  outer.addColorStop(0.40, context.palette.glow);
  outer.addColorStop(0.82, "rgba(0,0,0,0)");
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const vessel = ctx.createRadialGradient(x, y - r * 0.45, r * 0.12, x, y, r * 1.72);
  vessel.addColorStop(0, "rgba(106,78,218,.20)");
  vessel.addColorStop(0.38, "rgba(18,19,55,.72)");
  vessel.addColorStop(1, "rgba(3,6,17,.18)");

  ctx.fillStyle = vessel;
  ctx.strokeStyle = "rgba(170,135,255,.10)";
  ctx.lineWidth = Math.max(1, DPR);

  ctx.beginPath();
  ctx.ellipse(x, y, field.orbitX * 1.05, field.orbitY * 1.23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawRoundOrbitPath(ctx, context, field) {
  ctx.save();
  ctx.strokeStyle = context.palette.line;
  ctx.lineWidth = Math.max(0.9, DPR);
  ctx.globalAlpha = 0.45;

  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      field.x,
      field.y,
      field.orbitX * (0.68 + i * 0.18),
      field.orbitY * (0.68 + i * 0.18),
      Math.sin(state.phase * 0.16) * 0.02,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawEstateAnchor(ctx, context, field) {
  const { x, y, r } = field;

  ctx.save();

  ctx.globalCompositeOperation = "lighter";
  const halo = ctx.createRadialGradient(x, y, r * 0.10, x, y, r * 1.05);
  halo.addColorStop(0, "rgba(255,255,255,.09)");
  halo.addColorStop(0.48, "rgba(136,92,255,.18)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const size = r * 1.23;
  const half = size * 0.5;

  ctx.fillStyle = "rgba(8,10,28,.68)";
  ctx.strokeStyle = "rgba(244,191,96,.18)";
  ctx.lineWidth = Math.max(1.1, DPR);

  ctx.beginPath();
  ctx.moveTo(x, y - half);
  ctx.quadraticCurveTo(x + half * 0.56, y - half * 0.22, x + half, y);
  ctx.quadraticCurveTo(x + half * 0.28, y + half * 0.50, x, y + half);
  ctx.quadraticCurveTo(x - half * 0.28, y + half * 0.50, x - half, y);
  ctx.quadraticCurveTo(x - half * 0.56, y - half * 0.22, x, y - half);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.30;
  ctx.strokeStyle = "rgba(170,135,255,.34)";
  for (let i = 1; i < 4; i += 1) {
    const s = half * (0.34 + i * 0.16);
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s, y);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();

  drawText(ctx, "ESTATE", x, y - r * 0.11, clamp(r * 0.105, 14 * DPR, 22 * DPR), "rgba(186,194,207,.68)", 900);
  drawText(ctx, "COMPASS", x, y + r * 0.08, clamp(r * 0.145, 20 * DPR, 32 * DPR), context.palette.active, 950);

  ctx.restore();
}

function projectRoundNode(item, index, field) {
  const angle = item.angle + state.phase * 0.27 + state.dragPhase;
  const z = Math.sin(angle);
  const perspective = 2.55 / (2.55 - z * 0.62);

  const x = field.x + Math.cos(angle) * field.orbitX * item.radius * perspective;
  const y = field.y + Math.sin(angle) * field.orbitY * item.radius * perspective;
  const size = field.r * 0.38 * item.weight * perspective;

  return {
    ...item,
    x,
    y,
    z,
    size,
    selected: state.focusedRoute === item.route,
    hover: state.hoverKey === `route:${item.route}`
  };
}

function drawRoundNode(ctx, context, node, field, farSide) {
  const distance = Math.hypot(node.x - field.x, node.y - field.y);
  const insideCore = farSide && distance < field.r * 0.94;

  ctx.save();
  ctx.globalAlpha = insideCore ? 0.14 : farSide ? 0.42 : 1;

  drawCrystalDiamond(ctx, {
    x: node.x,
    y: node.y,
    size: node.size,
    label: node.label,
    active: node.selected,
    hover: node.hover,
    palette: context.palette,
    seed: node.label.length * 13,
    compact: false
  });

  ctx.restore();

  if (!insideCore) {
    state.hitRegions.push({
      key: `route:${node.route}`,
      type: "route",
      route: node.route,
      label: node.label,
      x: node.x,
      y: node.y,
      radius: node.size * 0.74
    });
  }
}

function drawGlobeContext(ctx, context, time) {
  const cx = state.width * 0.5;
  const cy = state.height * 0.50;
  const min = Math.min(state.width, state.height);
  const r = min * (MOBILE ? 0.245 : 0.315);

  drawUniverseCore(ctx, context, cx, cy, r);

  const bodies = GLOBE_ROUTES
    .map((item, index) => projectGlobeBody(item, index, cx, cy, r))
    .sort((a, b) => a.z - b.z);

  bodies.forEach((body) => drawPlanetCrystal(ctx, context, body));
}

function drawUniverseCore(ctx, context, cx, cy, r) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const halo = ctx.createRadialGradient(cx, cy, r * 0.48, cx, cy, r * 2.65);
  halo.addColorStop(0, "rgba(255,255,255,0)");
  halo.addColorStop(0.26, context.palette.glow);
  halo.addColorStop(0.68, "rgba(142,190,255,.08)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = context.palette.line;
  ctx.lineWidth = Math.max(1, DPR);

  for (let i = 0; i < 5; i += 1) {
    ctx.globalAlpha = 0.18 - i * 0.018;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      r * (1.00 + i * 0.30),
      r * (0.35 + i * 0.10),
      state.phase * 0.10 + i * 0.24,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();

  drawText(ctx, "Universe Field", cx, cy - r * 0.08, clamp(state.width * 0.038, 30 * DPR, 54 * DPR), "rgba(248,234,208,.92)", 950);
  drawText(ctx, "Expansion beyond the estate", cx, cy + r * 0.16, clamp(state.width * 0.015, 13 * DPR, 18 * DPR), "rgba(186,194,207,.82)", 750);
}

function projectGlobeBody(item, index, cx, cy, r) {
  const angle = item.angle + state.phase * (0.17 + index * 0.018) + state.dragPhase * 0.52;
  const z = Math.sin(angle);
  const perspective = 2.7 / (2.7 - z * 0.58);

  return {
    ...item,
    x: cx + Math.cos(angle) * r * item.radius * 1.52 * perspective,
    y: cy + Math.sin(angle) * r * item.radius * 0.74 * perspective,
    z,
    size: r * 0.29 * item.size * perspective,
    selected: state.focusedRoute === item.route,
    hover: state.hoverKey === `route:${item.route}`
  };
}

function drawPlanetCrystal(ctx, context, body) {
  const alpha = body.z < -0.55 ? 0.38 : 1;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (body.z >= 0) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.58)";
    ctx.filter = `blur(${Math.max(5, body.size * 0.13)}px)`;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y + body.size * 0.72, body.size * 0.56, body.size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const gradient = ctx.createRadialGradient(
    body.x - body.size * 0.35,
    body.y - body.size * 0.40,
    body.size * 0.05,
    body.x,
    body.y,
    body.size
  );

  gradient.addColorStop(0, "rgba(255,255,255,.74)");
  gradient.addColorStop(0.12, body.selected ? context.palette.active : context.palette.accent);
  gradient.addColorStop(0.48, "#112446");
  gradient.addColorStop(1, "#020611");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = body.selected ? context.palette.active : context.palette.accent;
  ctx.lineWidth = Math.max(1, DPR);
  ctx.globalAlpha = alpha * 0.8;
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size * 1.02, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha;
  drawText(ctx, body.label, body.x, body.y + body.size * 1.48, body.size * 0.22, body.selected ? context.palette.active : "#f8ead0", 900);

  ctx.restore();

  if (alpha > 0.5) {
    state.hitRegions.push({
      key: `route:${body.route}`,
      type: "route",
      route: body.route,
      label: body.label,
      x: body.x,
      y: body.y,
      radius: body.size * 1.25
    });
  }
}

function drawRoutePlate(ctx, x, y, w, h, label, routeLabel, active, palette) {
  ctx.save();

  ctx.fillStyle = active ? "rgba(143,240,195,.13)" : "rgba(255,255,255,.045)";
  ctx.strokeStyle = active ? "rgba(143,240,195,.55)" : "rgba(244,191,96,.28)";
  ctx.lineWidth = Math.max(1, DPR);

  facetPath(ctx, x - w * 0.5, y - h * 0.5, w, h, Math.min(14 * DPR, w * 0.12));
  ctx.fill();
  ctx.stroke();

  drawText(ctx, label, x, y - h * 0.08, clamp(w * 0.120, 14 * DPR, 23 * DPR), active ? palette.active : "#f8ead0", 900);
  drawText(ctx, routeLabel, x, y + h * 0.23, clamp(w * 0.052, 8 * DPR, 12 * DPR), "rgba(186,194,207,.78)", 750);

  ctx.restore();
}

function drawCrystalDiamond(ctx, spec) {
  const {
    x,
    y,
    size,
    label,
    active,
    hover,
    palette,
    seed,
    compact
  } = spec;

  const half = size * 0.5;
  const crown = half * 0.30;
  const girdle = half * 0.58;
  const point = half * 0.92;

  ctx.save();

  if (active || hover) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(x, y, half * 0.10, x, y, half * 1.55);
    glow.addColorStop(0, active ? palette.glow : "rgba(255,255,255,.13)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, half * 1.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.32)";
  ctx.filter = `blur(${Math.max(3, half * 0.07)}px)`;
  ctx.beginPath();
  ctx.ellipse(x, y + half * 0.72, half * 0.48, half * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const topLeft = { x: x - half * 0.50, y: y - crown };
  const topRight = { x: x + half * 0.50, y: y - crown };
  const left = { x: x - girdle, y };
  const right = { x: x + girdle, y };
  const bottom = { x, y: y + point };
  const tableLeft = { x: x - half * 0.25, y: y - half * 0.62 };
  const tableRight = { x: x + half * 0.25, y: y - half * 0.62 };

  ctx.beginPath();
  ctx.moveTo(tableLeft.x, tableLeft.y);
  ctx.lineTo(tableRight.x, tableRight.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();

  const body = ctx.createLinearGradient(x - half, y - half, x + half, y + half);
  body.addColorStop(0, "rgba(255,255,255,.48)");
  body.addColorStop(0.18, active ? "rgba(143,240,195,.22)" : "rgba(170,135,255,.20)");
  body.addColorStop(0.46, "rgba(64,47,139,.78)");
  body.addColorStop(0.74, "rgba(17,20,55,.88)");
  body.addColorStop(1, "rgba(2,5,12,.96)");
  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.clip();

  drawFacetTriangle(ctx, tableLeft, tableRight, { x, y: y - crown * 0.15 }, "rgba(255,255,255,.22)");
  drawFacetTriangle(ctx, tableLeft, topLeft, left, "rgba(255,255,255,.13)");
  drawFacetTriangle(ctx, tableRight, right, topRight, "rgba(255,255,255,.10)");
  drawFacetTriangle(ctx, left, { x, y }, bottom, "rgba(255,255,255,.08)");
  drawFacetTriangle(ctx, { x, y }, right, bottom, "rgba(142,190,255,.08)");

  ctx.strokeStyle = "rgba(255,255,255,.13)";
  ctx.lineWidth = Math.max(0.55, DPR * 0.65);

  for (let i = 1; i <= 4; i += 1) {
    const t = i / 5;
    const yy = y - crown + (point + crown) * t;
    const spread = half * (1 - Math.abs((yy - y) / point)) * 0.85;

    ctx.beginPath();
    ctx.moveTo(x - spread, yy);
    ctx.lineTo(x + spread, yy);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(x, tableLeft.y);
  ctx.lineTo(x, bottom.y);
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.moveTo(topRight.x, topRight.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.stroke();

  drawGlints(ctx, x, y, half, seed);

  ctx.restore();

  ctx.strokeStyle = active ? "rgba(143,240,195,.82)" : "rgba(244,191,96,.44)";
  ctx.lineWidth = active ? Math.max(1.45, DPR * 1.25) : Math.max(1, DPR);

  ctx.beginPath();
  ctx.moveTo(tableLeft.x, tableLeft.y);
  ctx.lineTo(tableRight.x, tableRight.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.stroke();

  const fontSize = compact
    ? clamp(size * 0.135, 9 * DPR, 17 * DPR)
    : clamp(size * 0.125, 10 * DPR, 18 * DPR);

  drawText(ctx, label, x, y + (compact ? 0 : half * 0.03), fontSize, active ? palette.active : "#f8ead0", 900);

  ctx.restore();
}

function drawFacetTriangle(ctx, a, b, c, color) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawGlints(ctx, x, y, half, seed) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const count = MOBILE ? 3 : 5;

  for (let i = 0; i < count; i += 1) {
    const angle = hash(seed, i, 1) * Math.PI * 2 + state.lightPhase * 0.18;
    const distance = half * (0.14 + hash(seed, i, 2) * 0.40);
    const gx = x + Math.cos(angle) * distance;
    const gy = y + Math.sin(angle) * distance;
    const pulse = 0.45 + Math.sin(state.lightPhase * 2.0 + i * 1.7) * 0.55;
    const len = half * (0.055 + pulse * 0.075);

    ctx.strokeStyle = i % 2 === 0
      ? `rgba(255,255,255,${0.18 + pulse * 0.44})`
      : `rgba(244,191,96,${0.12 + pulse * 0.34})`;
    ctx.lineWidth = Math.max(0.6, DPR * 0.70);
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(gx - len, gy);
    ctx.lineTo(gx + len, gy);
    ctx.moveTo(gx, gy - len);
    ctx.lineTo(gx, gy + len);
    ctx.stroke();
  }

  ctx.restore();
}

function drawText(ctx, text, x, y, size, color, weight = 850) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function fitText(ctx, text, x, y, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return;
  }

  const originalFont = ctx.font;
  const parts = originalFont.match(/^(\d+(?:\.\d+)?)px\s+(.+)$/);
  if (!parts) {
    ctx.fillText(text, x, y, maxWidth);
    return;
  }

  let size = Number(parts[1]);
  const family = parts[2];

  while (size > 10 * DPR) {
    ctx.font = `${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1 * DPR;
  }

  ctx.fillText(text, x, y);
  ctx.font = originalFont;
}

function drawSubtleCue(ctx) {
  const y = state.height * 0.935;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,194,207,.70)";
  ctx.font = `800 ${MOBILE ? 11 * DPR : 12 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText("Single click changes focus · double click opens route", state.width * 0.5, y);
  ctx.restore();
}

function facetPath(ctx, x, y, w, h, cut) {
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + w - cut, y);
  ctx.lineTo(x + w, y + cut);
  ctx.lineTo(x + w, y + h - cut);
  ctx.lineTo(x + w - cut, y + h);
  ctx.lineTo(x + cut, y + h);
  ctx.lineTo(x, y + h - cut);
  ctx.lineTo(x, y + cut);
  ctx.closePath();
}

function canvasPoint(event) {
  const rect = state.canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * DPR,
    y: (event.clientY - rect.top) * DPR
  };
}

function hitTest(point) {
  const regions = [...state.hitRegions].reverse();

  for (const region of regions) {
    const dx = point.x - region.x;
    const dy = point.y - region.y;

    if (Math.hypot(dx, dy) <= region.radius) {
      return region;
    }
  }

  return null;
}

function handleSingle(region) {
  if (region.type === "context") {
    state.context = region.context;
    state.focusedRoute = null;
    state.hoverKey = null;
    state.lastTap = { key: region.key, time: Date.now() };
    render(performance.now());
    return;
  }

  if (region.type === "route") {
    state.focusedRoute = region.route;
    state.lastTap = { key: region.key, time: Date.now() };
    render(performance.now());
  }
}

function handleTap(region) {
  const now = Date.now();
  const isDouble = state.lastTap.key === region.key && now - state.lastTap.time < 340;

  if (isDouble) {
    const route = region.type === "context" ? CONTEXTS[region.context]?.route : region.route;

    if (route) {
      window.location.href = route;
    }

    return;
  }

  handleSingle(region);
}

function wirePointer() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("pointerdown", (event) => {
    const hit = hitTest(canvasPoint(event));

    state.dragging = true;
    state.pointerId = event.pointerId;
    state.pointerStartX = event.clientX;
    state.pointerStartY = event.clientY;
    state.dragPhaseStart = state.dragPhase;

    if (hit) {
      state.hoverKey = hit.key;
      render(performance.now());
    }

    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    const hit = hitTest(canvasPoint(event));
    state.hoverKey = hit?.key || null;

    if (state.dragging && event.pointerId === state.pointerId) {
      const dx = event.clientX - state.pointerStartX;
      state.dragPhase = state.dragPhaseStart + dx * 0.004;
    }

    render(performance.now());
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    const hit = hitTest(canvasPoint(event));
    const dx = Math.abs(event.clientX - state.pointerStartX);
    const dy = Math.abs(event.clientY - state.pointerStartY);
    const wasTap = dx < 10 && dy < 10;

    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);

    if (hit && wasTap) {
      handleTap(hit);
    }

    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    state.hoverKey = null;
    canvas.releasePointerCapture?.(event.pointerId);
    render(performance.now());
  }, { passive: false });

  canvas.addEventListener("pointerleave", () => {
    state.hoverKey = null;
    render(performance.now());
  }, { passive: true });

  canvas.addEventListener("dblclick", (event) => {
    const hit = hitTest(canvasPoint(event));

    if (!hit) return;

    if (hit.type === "context") {
      const route = CONTEXTS[hit.context]?.route;
      if (route) window.location.href = route;
    } else if (hit.route) {
      window.location.href = hit.route;
    }

    event.preventDefault();
  }, { passive: false });
}

function wireKeyboard() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("keydown", (event) => {
    const order = ["flat", "round", "globe"];
    const index = Math.max(0, order.indexOf(state.context));

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      state.context = order[(index + order.length - 1) % order.length];
      state.focusedRoute = null;
      render(performance.now());
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      state.context = order[(index + 1) % order.length];
      state.focusedRoute = null;
      render(performance.now());
      return;
    }

    if (event.key === "1") {
      event.preventDefault();
      state.context = "flat";
      state.focusedRoute = null;
      render(performance.now());
      return;
    }

    if (event.key === "2") {
      event.preventDefault();
      state.context = "round";
      state.focusedRoute = null;
      render(performance.now());
      return;
    }

    if (event.key === "3") {
      event.preventDefault();
      state.context = "globe";
      state.focusedRoute = null;
      render(performance.now());
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      window.location.href = CONTEXTS[state.context].route;
    }
  });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active) {
      startLoop();
    } else {
      stopLoop();
    }

    stampDocument();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.mount) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;

      if (state.visible) {
        startLoop();
      } else {
        stopLoop();
      }

      stampDocument();
    }, { threshold: 0.05 });

    observer.observe(state.mount);
  }
}

function installResize() {
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__compassMarriageResizeTimer);
    window.__compassMarriageResizeTimer = window.setTimeout(() => {
      sizeCanvas();
      render(performance.now());
    }, 160);
  }, { passive: true });
}

function startLoop() {
  if (state.raf || !state.active || !state.visible) return;

  state.lastFrameAt = 0;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

function frame(time = 0) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  if (time - state.lastFrameAt >= FRAME_MS) {
    state.lastFrameAt = time;

    if (!REDUCED_MOTION && !state.dragging) {
      state.phase += MOBILE ? 0.006 : 0.009;
      state.lightPhase += MOBILE ? 0.022 : 0.034;
    }

    render(time);
  }

  state.raf = window.requestAnimationFrame(frame);
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.compassRenderer = CONTRACT;
  root.dataset.compassHtml = HTML_CONTRACT;
  root.dataset.currentContext = state.context;
  root.dataset.standard = "cutting-edge-frontier-tech-only";
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
}

function getStatus() {
  return {
    contract: CONTRACT,
    htmlContract: HTML_CONTRACT,
    currentContext: state.context,
    focusedRoute: state.focusedRoute,
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM
  };
}

function exposeApi() {
  window.DGBCompass = {
    contract: CONTRACT,
    selectContext(key) {
      if (CONTEXTS[key]) {
        state.context = key;
        state.focusedRoute = null;
        render(performance.now());
      }
    },
    getStatus
  };
}

function boot() {
  state.canvas = byId("compassMarriageCanvas");
  state.mount = byId("compassMarriageMount");

  if (!state.canvas || !state.mount) return;

  state.mount.classList.add("renderer-loaded");

  sizeCanvas();
  wirePointer();
  wireKeyboard();
  installVisibility();
  installResize();
  exposeApi();

  state.context = "round";
  render(performance.now());
  startLoop();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  HTML_CONTRACT,
  CONTEXTS,
  getStatus
};

export default {
  contract: CONTRACT,
  htmlContract: HTML_CONTRACT,
  getStatus
};
