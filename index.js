// /index.js
// COMPASS_THREE_CONTEXT_FRONTIER_INDEX_JS_TNT_v1
// Full-file replacement.
// Compass root renderer only.
//
// Purpose:
// - Replace same-scene animation drift with three distinct contexts.
// - Flat = architectural route board, no center object.
// - Round = estate-centered compass field.
// - Globe = universe-scale expansion field.
// - Single click/tap selects context or route focus.
// - Double click/double tap opens route.
// - No generated images.
// - No GraphicBox.
// - No public receipt spillover.

const CONTRACT = "COMPASS_THREE_CONTEXT_FRONTIER_INDEX_JS_TNT_v1";
const HTML_CONTRACT = "COMPASS_THREE_CONTEXT_FRONTIER_INDEX_HTML_TNT_v1";

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
    title: "World Is Flat",
    subtitle: "Architectural route board",
    route: "/",
    palette: {
      bg0: "#030712",
      bg1: "#071225",
      bg2: "#111827",
      grid: "rgba(142,190,255,.20)",
      accent: "#8ebeff",
      active: "#f4bf60",
      glow: "rgba(142,190,255,.22)"
    }
  },
  round: {
    key: "round",
    title: "World Is Round",
    subtitle: "Estate-centered compass field",
    route: "/?lens=round",
    palette: {
      bg0: "#020611",
      bg1: "#07152d",
      bg2: "#10213f",
      grid: "rgba(143,240,195,.22)",
      accent: "#8ff0c3",
      active: "#f4bf60",
      glow: "rgba(143,240,195,.30)"
    }
  },
  globe: {
    key: "globe",
    title: "World Is a Globe",
    subtitle: "Universe-scale expansion",
    route: "/nine-summits/universe/",
    palette: {
      bg0: "#02040e",
      bg1: "#0b1030",
      bg2: "#21133f",
      grid: "rgba(190,170,255,.24)",
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
  { label: "Door", route: "/door/", x: 0.18, y: 0.30 },
  { label: "Home", route: "/home/", x: 0.42, y: 0.30 },
  { label: "Showroom", route: "/showroom/", x: 0.66, y: 0.30 },
  { label: "Products", route: "/products/", x: 0.30, y: 0.58 },
  { label: "Universe", route: "/nine-summits/universe/", x: 0.54, y: 0.58 },
  { label: "Triple G", route: "/gauges/", x: 0.78, y: 0.58 }
]);

const ROUND_ROUTES = Object.freeze([
  { label: "Door", route: "/door/", angle: -2.45, radius: 1.02 },
  { label: "Home", route: "/home/", angle: -1.45, radius: 0.82 },
  { label: "Products", route: "/products/", angle: -0.20, radius: 1.02 },
  { label: "Showroom", route: "/showroom/", angle: 0.78, radius: 0.92 },
  { label: "Globe", route: "/showroom/globe/", angle: 1.80, radius: 1.06 },
  { label: "Triple G", route: "/gauges/", angle: 2.72, radius: 0.86 }
]);

const GLOBE_ROUTES = Object.freeze([
  { label: "Universe", route: "/nine-summits/universe/", angle: -1.55, radius: 0.86, size: 1.10 },
  { label: "Book", route: "/nine-summits-of-love/", angle: -0.42, radius: 1.08, size: 0.82 },
  { label: "Showroom", route: "/showroom/", angle: 0.72, radius: 0.98, size: 0.92 },
  { label: "Globe", route: "/showroom/globe/", angle: 1.68, radius: 0.82, size: 0.78 },
  { label: "Frontier", route: "/frontier/", angle: 2.64, radius: 1.08, size: 0.74 }
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

function context() {
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
  const c = context();

  state.hitRegions = [];

  drawBackground(ctx, c);
  drawContextSelectors(ctx, c);

  if (state.context === "flat") drawFlatContext(ctx, c);
  if (state.context === "round") drawRoundContext(ctx, c, time);
  if (state.context === "globe") drawGlobeContext(ctx, c, time);

  drawPointerCue(ctx, c);
  stampDocument();
}

function drawBackground(ctx, c) {
  const width = state.width;
  const height = state.height;
  const p = c.palette;

  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.02,
    width * 0.5,
    height * 0.54,
    Math.max(width, height) * 0.78
  );

  bg.addColorStop(0, p.bg2);
  bg.addColorStop(0.42, p.bg1);
  bg.addColorStop(1, p.bg0);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const aura = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, width * 0.58);
  aura.addColorStop(0, p.glow);
  aura.addColorStop(0.55, "rgba(244,191,96,.06)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function drawContextSelectors(ctx, c) {
  const width = state.width;
  const y = state.height * 0.105;
  const gap = Math.min(width * 0.23, 260 * DPR);
  const startX = width * 0.5 - gap;
  const size = Math.min(width, state.height) * (MOBILE ? 0.095 : 0.072);

  CONTEXT_SELECTORS.forEach((item, index) => {
    const x = startX + gap * index;
    const active = item.key === state.context;
    const hover = item.key === state.hoverKey;

    drawSmallDiamond(ctx, {
      x,
      y,
      size: active ? size * 1.18 : size,
      label: item.label,
      active,
      hover,
      palette: c.palette
    });

    state.hitRegions.push({
      key: `context:${item.key}`,
      type: "context",
      context: item.key,
      route: item.route,
      x,
      y,
      radius: size * 0.70
    });
  });
}

function drawFlatContext(ctx, c) {
  const width = state.width;
  const height = state.height;
  const p = c.palette;

  drawFlatGrid(ctx, c);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(248,234,208,.92)";
  ctx.font = `900 ${clamp(width * 0.045, 32 * DPR, 58 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Architectural Route Board", width * 0.5, height * 0.225);

  ctx.fillStyle = "rgba(186,194,207,.84)";
  ctx.font = `750 ${clamp(width * 0.016, 13 * DPR, 18 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText("No center object. Direct page selection.", width * 0.5, height * 0.275);

  ctx.restore();

  FLAT_ROUTES.forEach((item, index) => {
    const x = width * item.x;
    const y = height * item.y;
    const w = Math.min(width * 0.205, 230 * DPR);
    const h = Math.min(height * 0.125, 118 * DPR);
    const active = state.focusedRoute === item.route;
    drawRoutePlate(ctx, x, y, w, h, item.label, item.route, active, p);
    state.hitRegions.push({
      key: `route:${item.route}`,
      type: "route",
      route: item.route,
      label: item.label,
      x,
      y,
      radius: Math.max(w, h) * 0.58
    });
  });
}

function drawFlatGrid(ctx, c) {
  const width = state.width;
  const height = state.height;

  ctx.save();
  ctx.strokeStyle = c.palette.grid;
  ctx.lineWidth = Math.max(0.7, DPR);
  ctx.globalAlpha = 0.42;

  const left = width * 0.10;
  const right = width * 0.90;
  const top = height * 0.18;
  const bottom = height * 0.80;
  const cols = 8;
  const rows = 5;

  for (let i = 0; i <= cols; i += 1) {
    const x = left + ((right - left) * i) / cols;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  for (let i = 0; i <= rows; i += 1) {
    const y = top + ((bottom - top) * i) / rows;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(244,191,96,.38)";
  ctx.lineWidth = Math.max(1.2, DPR * 1.2);
  drawFacetPath(ctx, left, top, right - left, bottom - top, 24 * DPR);
  ctx.stroke();

  ctx.restore();
}

function drawRoundContext(ctx, c, time) {
  const sphere = roundSphereSpec();

  drawRoundDepthRings(ctx, c, sphere);

  const nodes = ROUND_ROUTES.map((item, index) => projectRoundNode(item, index, sphere)).sort((a, b) => a.z - b.z);

  nodes.filter((n) => n.z < 0).forEach((node) => drawRoundNode(ctx, c, node, true));

  drawEstateCore(ctx, c, sphere);

  nodes.filter((n) => n.z >= 0).forEach((node) => drawRoundNode(ctx, c, node, false));
}

function roundSphereSpec() {
  const min = Math.min(state.width, state.height);
  return {
    x: state.width * 0.50,
    y: state.height * 0.49,
    r: min * (MOBILE ? 0.255 : 0.295)
  };
}

function drawRoundDepthRings(ctx, c, sphere) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = c.palette.grid;
  ctx.lineWidth = Math.max(0.8, DPR);

  const rings = [1.55, 1.20, 0.86, 0.55];
  rings.forEach((scale, index) => {
    ctx.save();
    ctx.translate(sphere.x, sphere.y + sphere.r * 0.10);
    ctx.scale(1, 0.62);
    ctx.rotate(Math.sin(state.phase * 0.22 + index) * 0.04);
    ctx.globalAlpha = 0.16 + index * 0.025;
    ctx.beginPath();
    ctx.ellipse(0, 0, sphere.r * scale, sphere.r * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}

function drawEstateCore(ctx, c, sphere) {
  const { x, y, r } = sphere;
  const p = c.palette;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(x, y, r * 0.72, x, y, r * 1.65);
  glow.addColorStop(0, "rgba(255,255,255,0)");
  glow.addColorStop(0.48, p.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.42, r * 0.05, x, y, r * 1.12);
  body.addColorStop(0, "rgba(255,255,255,.72)");
  body.addColorStop(0.10, "#17314a");
  body.addColorStop(0.42, "#0c1d35");
  body.addColorStop(0.82, "#020611");
  body.addColorStop(1, "#01030a");

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.clip();
  drawSphereLines(ctx, c, sphere);

  const shade = ctx.createRadialGradient(x + r * 0.42, y, r * 0.04, x + r * 0.45, y, r * 1.12);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(0.52, "rgba(0,0,0,.20)");
  shade.addColorStop(1, "rgba(0,0,0,.86)");
  ctx.fillStyle = shade;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();

  ctx.strokeStyle = p.accent;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = Math.max(1.2, r * 0.014);
  ctx.beginPath();
  ctx.arc(x, y, r * 1.005, 0, Math.PI * 2);
  ctx.stroke();

  drawEstateMark(ctx, c, x, y, r);

  ctx.restore();
}

function drawSphereLines(ctx, c, sphere) {
  const { x, y, r } = sphere;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = c.palette.grid;
  ctx.lineWidth = Math.max(0.55, r * 0.004);
  ctx.globalAlpha = 0.28;

  for (let i = 1; i < 9; i += 1) {
    const t = (i / 9) * 2 - 1;
    const yy = y + t * r * 0.70;
    const w = r * Math.sqrt(Math.max(0, 1 - t * t)) * 0.98;
    ctx.beginPath();
    ctx.ellipse(x, yy, w, r * 0.12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 9; i += 1) {
    const a = (i / 9) * Math.PI + state.phase * 0.09;
    const squash = Math.abs(Math.cos(a)) * 0.96;
    ctx.beginPath();
    ctx.ellipse(x, y, r * squash, r * 0.98, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEstateMark(ctx, c, x, y, r) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(4,9,18,.52)";
  ctx.strokeStyle = "rgba(244,191,96,.26)";
  ctx.lineWidth = Math.max(1, DPR);
  drawFacetPath(ctx, x - r * 0.54, y - r * 0.20, r * 1.08, r * 0.40, r * 0.06);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.palette.active;
  ctx.font = `900 ${Math.max(14 * DPR, r * 0.105)}px Inter, system-ui, sans-serif`;
  ctx.fillText("ESTATE", x, y - r * 0.045);

  ctx.fillStyle = "#f8ead0";
  ctx.font = `900 ${Math.max(22 * DPR, r * 0.17)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Compass", x, y + r * 0.13);

  ctx.restore();
}

function projectRoundNode(item, index, sphere) {
  const angle = item.angle + state.phase * 0.36 + state.dragPhase;
  const orbit = sphere.r * item.radius;
  const z = Math.sin(angle) * 0.84;
  const perspective = 2.55 / (2.55 - z * 0.55);

  const x = sphere.x + Math.cos(angle) * orbit * 1.46 * perspective;
  const y = sphere.y + Math.sin(angle) * orbit * 0.62 * perspective;
  const size = sphere.r * (MOBILE ? 0.25 : 0.20) * perspective;

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

function drawRoundNode(ctx, c, node, farSide) {
  const alpha = farSide ? 0.34 : 1;
  const occluded = farSide && Math.hypot(node.x - roundSphereSpec().x, node.y - roundSphereSpec().y) < roundSphereSpec().r * 1.05;

  ctx.save();
  ctx.globalAlpha = occluded ? 0.14 : alpha;
  drawSmallDiamond(ctx, {
    x: node.x,
    y: node.y,
    size: node.size,
    label: node.label,
    active: node.selected,
    hover: node.hover,
    palette: c.palette
  });
  ctx.restore();

  if (!occluded) {
    state.hitRegions.push({
      key: `route:${node.route}`,
      type: "route",
      route: node.route,
      label: node.label,
      x: node.x,
      y: node.y,
      radius: node.size * 0.75
    });
  }
}

function drawGlobeContext(ctx, c, time) {
  const width = state.width;
  const height = state.height;
  const cx = width * 0.5;
  const cy = height * 0.49;
  const min = Math.min(width, height);
  const baseR = min * (MOBILE ? 0.25 : 0.31);

  drawStarField(ctx, c);
  drawUniverseHalo(ctx, c, cx, cy, baseR);

  const bodies = GLOBE_ROUTES.map((item, index) => {
    const angle = item.angle + state.phase * (0.18 + index * 0.018) + state.dragPhase * 0.55;
    const z = Math.sin(angle) * 0.96;
    const perspective = 2.7 / (2.7 - z * 0.55);
    const r = baseR * item.radius;

    return {
      ...item,
      x: cx + Math.cos(angle) * r * 1.55 * perspective,
      y: cy + Math.sin(angle) * r * 0.74 * perspective,
      z,
      size: baseR * 0.25 * item.size * perspective,
      selected: state.focusedRoute === item.route,
      hover: state.hoverKey === `route:${item.route}`
    };
  }).sort((a, b) => a.z - b.z);

  bodies.forEach((body) => drawPlanetNode(ctx, c, body));
}

function drawStarField(ctx, c) {
  const count = MOBILE ? 46 : 92;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const x = hash(22, i, 1) * state.width;
    const y = hash(22, i, 2) * state.height;
    const pulse = 0.5 + Math.sin(state.lightPhase * 0.7 + i) * 0.5;
    const r = (0.5 + hash(22, i, 3) * 1.5) * DPR;

    ctx.fillStyle = i % 9 === 0
      ? `rgba(244,191,96,${0.20 + pulse * 0.35})`
      : `rgba(226,238,255,${0.18 + pulse * 0.34})`;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawUniverseHalo(ctx, c, cx, cy, r) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const halo = ctx.createRadialGradient(cx, cy, r * 0.60, cx, cy, r * 2.35);
  halo.addColorStop(0, "rgba(255,255,255,0)");
  halo.addColorStop(0.34, c.palette.glow);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = c.palette.grid;
  ctx.lineWidth = Math.max(1, DPR);
  for (let i = 0; i < 4; i += 1) {
    ctx.globalAlpha = 0.16 - i * 0.02;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * (1.05 + i * 0.34), r * (0.38 + i * 0.10), state.phase * 0.12 + i * 0.32, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(248,234,208,.92)";
  ctx.font = `900 ${clamp(state.width * 0.038, 30 * DPR, 54 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Universe Field", cx, cy - r * 0.08);

  ctx.fillStyle = "rgba(186,194,207,.82)";
  ctx.font = `750 ${clamp(state.width * 0.015, 13 * DPR, 18 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Expansion beyond the estate", cx, cy + r * 0.16);
  ctx.restore();
}

function drawPlanetNode(ctx, c, body) {
  const alpha = body.z < -0.50 ? 0.44 : 1;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (body.z >= 0) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.filter = `blur(${Math.max(5, body.size * 0.12)}px)`;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y + body.size * 0.70, body.size * 0.56, body.size * 0.12, 0, 0, Math.PI * 2);
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
  gradient.addColorStop(0.10, body.selected ? c.palette.active : c.palette.accent);
  gradient.addColorStop(0.48, "#112446");
  gradient.addColorStop(1, "#020611");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = body.selected ? c.palette.active : c.palette.accent;
  ctx.lineWidth = Math.max(1, DPR);
  ctx.globalAlpha = alpha * 0.8;
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size * 1.02, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha;
  drawNodeLabel(ctx, body.label, body.x, body.y + body.size * 1.48, body.size * 0.22, body.selected ? c.palette.active : "#f8ead0");

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

function drawRoutePlate(ctx, x, y, w, h, label, route, active, p) {
  ctx.save();

  ctx.fillStyle = active ? "rgba(143,240,195,.13)" : "rgba(255,255,255,.045)";
  ctx.strokeStyle = active ? "rgba(143,240,195,.55)" : "rgba(244,191,96,.28)";
  ctx.lineWidth = Math.max(1, DPR);
  drawFacetPath(ctx, x - w * 0.5, y - h * 0.5, w, h, 14 * DPR);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = active ? p.active : "#f8ead0";
  ctx.font = `900 ${clamp(w * 0.12, 15 * DPR, 24 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText(label, x, y - h * 0.08);

  ctx.fillStyle = "rgba(186,194,207,.78)";
  ctx.font = `750 ${clamp(w * 0.052, 9 * DPR, 13 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText(route, x, y + h * 0.22);

  ctx.restore();
}

function drawSmallDiamond(ctx, spec) {
  const { x, y, size, label, active, hover, palette } = spec;
  const half = size * 0.5;

  ctx.save();

  if (active || hover) {
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(x, y, half * 0.2, x, y, half * 1.32);
    glow.addColorStop(0, active ? palette.glow : "rgba(255,255,255,.10)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, half * 1.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.beginPath();
  ctx.ellipse(x, y + half * 0.66, half * 0.45, half * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y - half);
  ctx.lineTo(x + half, y);
  ctx.lineTo(x, y + half);
  ctx.lineTo(x - half, y);
  ctx.closePath();

  const body = ctx.createLinearGradient(x - half, y - half, x + half, y + half);
  body.addColorStop(0, "rgba(255,255,255,.42)");
  body.addColorStop(0.22, active ? "rgba(143,240,195,.24)" : "rgba(142,190,255,.15)");
  body.addColorStop(0.52, "rgba(11,25,49,.88)");
  body.addColorStop(0.82, "rgba(244,191,96,.13)");
  body.addColorStop(1, "rgba(2,5,12,.94)");
  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.clip();

  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.lineWidth = Math.max(0.7, DPR * 0.75);
  for (let i = 1; i < 4; i += 1) {
    const t = i / 4;
    const yy = y - half + size * t;
    const span = half * (1 - Math.abs(t * 2 - 1));
    ctx.beginPath();
    ctx.moveTo(x - span, yy);
    ctx.lineTo(x + span, yy);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(x, y - half);
  ctx.lineTo(x, y + half);
  ctx.moveTo(x - half, y);
  ctx.lineTo(x + half, y);
  ctx.stroke();

  ctx.restore();

  ctx.strokeStyle = active ? "rgba(143,240,195,.78)" : "rgba(244,191,96,.44)";
  ctx.lineWidth = active ? Math.max(1.5, DPR * 1.2) : Math.max(1, DPR);
  ctx.beginPath();
  ctx.moveTo(x, y - half);
  ctx.lineTo(x + half, y);
  ctx.lineTo(x, y + half);
  ctx.lineTo(x - half, y);
  ctx.closePath();
  ctx.stroke();

  drawNodeLabel(ctx, label, x, y, clamp(size * 0.16, 11 * DPR, 21 * DPR), active ? palette.active : "#f8ead0");

  ctx.restore();
}

function drawNodeLabel(ctx, label, x, y, fontSize, color) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(label, x, y);
  ctx.restore();
}

function drawPointerCue(ctx, c) {
  const y = state.height * 0.93;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,194,207,.78)";
  ctx.font = `800 ${MOBILE ? 12 * DPR : 13 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText("Single click changes focus · double click opens route", state.width * 0.5, y);
  ctx.restore();
}

function drawFacetPath(ctx, x, y, w, h, cut) {
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
    if (Math.hypot(dx, dy) <= region.radius) return region;
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
    if (route) window.location.href = route;
    return;
  }

  handleSingle(region);
}

function wirePointer() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("pointerdown", (event) => {
    const point = canvasPoint(event);
    const hit = hitTest(point);

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
  }, { passive:false });

  canvas.addEventListener("pointermove", (event) => {
    const point = canvasPoint(event);
    const hit = hitTest(point);
    state.hoverKey = hit?.key || null;

    if (state.dragging && event.pointerId === state.pointerId) {
      const dx = event.clientX - state.pointerStartX;
      state.dragPhase = state.dragPhaseStart + dx * 0.004;
    }

    render(performance.now());
    event.preventDefault();
  }, { passive:false });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    const point = canvasPoint(event);
    const hit = hitTest(point);
    const dx = Math.abs(event.clientX - state.pointerStartX);
    const dy = Math.abs(event.clientY - state.pointerStartY);
    const wasTap = dx < 10 && dy < 10;

    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);

    if (hit && wasTap) handleTap(hit);

    event.preventDefault();
  }, { passive:false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    state.hoverKey = null;
    canvas.releasePointerCapture?.(event.pointerId);
    render(performance.now());
  }, { passive:false });

  canvas.addEventListener("pointerleave", () => {
    state.hoverKey = null;
    render(performance.now());
  }, { passive:true });

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
  }, { passive:false });
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
    if (state.active) startLoop();
    else stopLoop();
    stampDocument();
  }, { passive:true });

  if ("IntersectionObserver" in window && state.mount) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;
      if (state.visible) startLoop();
      else stopLoop();
      stampDocument();
    }, { threshold:0.05 });

    observer.observe(state.mount);
  }
}

function installResize() {
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__compassFrontierResizeTimer);
    window.__compassFrontierResizeTimer = window.setTimeout(() => {
      sizeCanvas();
      render(performance.now());
    }, 160);
  }, { passive:true });
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
  state.canvas = byId("compassFrontierCanvas");
  state.mount = byId("compassFrontierMount");

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
  document.addEventListener("DOMContentLoaded", boot, { once:true });
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
