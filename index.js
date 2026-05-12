// /index.js
// COMPASS_ROUND_FIELD_DEPTH_OBJECT_REDUCTION_JS_TNT_v2
// Full-file replacement.
//
// Purpose:
// - Remove redundant visible status/copy from Compass.
// - Remove in-canvas instruction strip.
// - Remove large center title from sphere.
// - Make Round read as a dimensional object-field, not a labeled 2D HUD.
// - Preserve single click = scenery change.
// - Preserve double click / double tap = route open.
// - No generated images.
// - No GraphicBox.
// - No private renderers.
// - No visual pass claim.

const CONTRACT = "COMPASS_ROUND_FIELD_DEPTH_OBJECT_REDUCTION_JS_TNT_v2";
const HTML_CONTRACT = "COMPASS_ROUND_FIELD_DEPTH_OBJECT_REDUCTION_HTML_TNT_v2";
const PREVIOUS_CONTRACT = "COMPASS_ROUND_FIELD_3D_RENDERER_JS_TNT_v1";
const ROUTE = "/";

const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;
const PRIVATE_RENDERERS_LOADED = false;

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 58 : 42;

const SCENES = Object.freeze({
  flat: {
    key: "flat",
    route: "/",
    palette: {
      bg0: "#040713",
      bg1: "#071225",
      bg2: "#111827",
      auraA: "rgba(142,190,255,.10)",
      auraB: "rgba(244,191,96,.07)",
      sphereA: "#1a2537",
      sphereB: "#0b1629",
      sphereC: "#02050c",
      grid: "rgba(142,190,255,.18)",
      accent: "#8ebeff",
      active: "#f4bf60",
      glow: "rgba(142,190,255,.24)"
    },
    depth: 0.34,
    gridTilt: 0.34,
    sphereScale: 0.88,
    orbitalSpread: 0.82,
    starDensity: 0.30
  },

  round: {
    key: "round",
    route: "/?lens=round",
    palette: {
      bg0: "#030713",
      bg1: "#07152d",
      bg2: "#10213f",
      auraA: "rgba(143,240,195,.16)",
      auraB: "rgba(244,191,96,.11)",
      sphereA: "#12314a",
      sphereB: "#0a1d36",
      sphereC: "#01040c",
      grid: "rgba(143,240,195,.22)",
      accent: "#8ff0c3",
      active: "#f4bf60",
      glow: "rgba(143,240,195,.32)"
    },
    depth: 1.04,
    gridTilt: 0.72,
    sphereScale: 1.08,
    orbitalSpread: 1.00,
    starDensity: 0.46
  },

  globe: {
    key: "globe",
    route: "/nine-summits/universe/",
    palette: {
      bg0: "#030512",
      bg1: "#0c1032",
      bg2: "#20133f",
      auraA: "rgba(190,170,255,.17)",
      auraB: "rgba(142,190,255,.14)",
      sphereA: "#22245b",
      sphereB: "#10183c",
      sphereC: "#02030b",
      grid: "rgba(190,170,255,.22)",
      accent: "#beaaff",
      active: "#f4bf60",
      glow: "rgba(190,170,255,.32)"
    },
    depth: 1.18,
    gridTilt: 0.80,
    sphereScale: 1.14,
    orbitalSpread: 1.10,
    starDensity: 0.66
  }
});

const DIAMONDS = Object.freeze([
  {
    key: "flat",
    label: "Flat",
    route: "/",
    baseAngle: Math.PI * 1.16,
    orbitRadius: 0.48,
    phaseSpeed: 0.78,
    zBias: -0.10,
    seed: 11
  },
  {
    key: "round",
    label: "Round",
    route: "/?lens=round",
    baseAngle: Math.PI * 1.88,
    orbitRadius: 0.48,
    phaseSpeed: 0.84,
    zBias: 0.20,
    seed: 29
  },
  {
    key: "globe",
    label: "Globe",
    route: "/nine-summits/universe/",
    baseAngle: Math.PI * 0.48,
    orbitRadius: 0.42,
    phaseSpeed: 0.70,
    zBias: 0.02,
    seed: 43
  }
]);

const state = {
  selected: "round",
  hover: null,
  keyboardFocus: "round",

  canvas: null,
  context: null,
  mount: null,

  width: 0,
  height: 0,

  active: true,
  visible: true,
  dragging: false,
  pointerId: null,
  pointerStartX: 0,
  pointerStartY: 0,
  dragPhaseStart: 0,

  phase: 0,
  lightPhase: 0,
  dragPhase: 0,
  lastFrameAt: 0,
  raf: 0,

  hitRegions: [],
  lastTap: {
    key: "",
    time: 0
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(seed, index, salt = 0) {
  const x = Math.sin((seed + 1) * 91.17 + (index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function scene() {
  return SCENES[state.selected] || SCENES.round;
}

function byId(id) {
  return document.getElementById(id);
}

function sizeCanvas() {
  const canvas = state.canvas;
  if (!canvas) return false;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || canvas.clientWidth || 960));
  const cssHeight = Math.max(500, Math.floor(rect.height || canvas.clientHeight || 720));

  const width = Math.floor(cssWidth * DPR);
  const height = Math.floor(cssHeight * DPR);

  const changed = canvas.width !== width || canvas.height !== height;

  if (changed) {
    canvas.width = width;
    canvas.height = height;
  }

  state.width = width;
  state.height = height;
  state.context = canvas.getContext("2d", { alpha: false });

  return changed;
}

function clearField(ctx, width, height, activeScene) {
  const p = activeScene.palette;

  const bg = ctx.createRadialGradient(
    width * 0.50,
    height * 0.42,
    width * 0.04,
    width * 0.50,
    height * 0.52,
    Math.max(width, height) * 0.75
  );

  bg.addColorStop(0, p.bg2);
  bg.addColorStop(0.40, p.bg1);
  bg.addColorStop(1, p.bg0);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const aura1 = ctx.createRadialGradient(width * 0.50, height * 0.46, 0, width * 0.50, height * 0.46, width * 0.52);
  aura1.addColorStop(0, p.auraA);
  aura1.addColorStop(0.52, p.auraB);
  aura1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, width, height);

  const aura2 = ctx.createRadialGradient(width * 0.62, height * 0.24, 0, width * 0.62, height * 0.24, width * 0.36);
  aura2.addColorStop(0, "rgba(255,255,255,.08)");
  aura2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function drawStars(ctx, width, height, activeScene) {
  const count = MOBILE ? Math.floor(54 * activeScene.starDensity) : Math.floor(112 * activeScene.starDensity);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const x = hash(13, i, 1) * width;
    const y = hash(13, i, 2) * height;
    const pulse = 0.5 + Math.sin(state.lightPhase * 0.8 + i * 0.47) * 0.5;
    const radius = (0.45 + hash(13, i, 3) * 1.35) * DPR;
    const alpha = 0.16 + pulse * 0.34;

    ctx.beginPath();
    ctx.fillStyle = i % 11 === 0
      ? `rgba(244,191,96,${alpha})`
      : `rgba(225,238,255,${alpha})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function sphereSpec(activeScene) {
  const min = Math.min(state.width, state.height);
  const radius = min * (MOBILE ? 0.245 : 0.285) * activeScene.sphereScale;

  return {
    x: state.width * 0.50,
    y: state.height * (MOBILE ? 0.45 : 0.455),
    r: radius
  };
}

function drawDepthField(ctx, activeScene, sphere) {
  const p = activeScene.palette;
  const cx = sphere.x;
  const cy = sphere.y + sphere.r * 0.12;
  const base = sphere.r * 1.92 * activeScene.orbitalSpread;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = p.grid;
  ctx.lineWidth = Math.max(0.8, DPR);

  const rings = [
    { r: 1.35, alpha: 0.14, y: 0.18 },
    { r: 1.04, alpha: 0.18, y: 0.10 },
    { r: 0.72, alpha: 0.20, y: 0.04 },
    { r: 0.46, alpha: 0.16, y: 0.00 }
  ];

  for (const ring of rings) {
    ctx.save();
    ctx.translate(cx, cy + sphere.r * ring.y);
    ctx.scale(1, activeScene.gridTilt);
    ctx.rotate(Math.sin(state.phase * 0.24) * 0.028);

    ctx.globalAlpha = ring.alpha;
    ctx.beginPath();
    ctx.ellipse(0, 0, base * ring.r, base * ring.r, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function projectDiamond(item, activeScene, sphere) {
  const angle = item.baseAngle + state.phase * item.phaseSpeed + state.dragPhase;
  const orbit = sphere.r * 1.72 * item.orbitRadius * activeScene.orbitalSpread;

  const rawX = Math.cos(angle) * orbit * 1.55;
  const rawY = Math.sin(angle) * orbit * activeScene.gridTilt;

  const orbitalZ = Math.sin(angle + 0.34) * 0.82;
  const selectedBoost = item.key === state.selected ? 0.36 : 0;
  const hoverBoost = item.key === state.hover ? 0.16 : 0;
  const z = item.zBias + orbitalZ + selectedBoost + hoverBoost;

  const focal = 2.6;
  const perspective = focal / (focal - z * activeScene.depth * 0.52);

  const x = sphere.x + rawX * perspective;
  const y = sphere.y + rawY * perspective;

  const baseSize = sphere.r * (MOBILE ? 0.34 : 0.29);
  const size = baseSize * clamp(perspective, 0.62, 1.38) * (item.key === state.selected ? 1.13 : 1);

  const distanceFromCenter = Math.hypot(x - sphere.x, y - sphere.y);
  const behindSphere = z < 0 && distanceFromCenter < sphere.r * 1.02;
  const farSide = z < 0;

  return {
    ...item,
    x,
    y,
    z,
    size,
    perspective,
    selected: item.key === state.selected,
    hover: item.key === state.hover,
    behindSphere,
    farSide,
    distanceFromCenter
  };
}

function getDiamonds(activeScene, sphere) {
  return DIAMONDS
    .map((item) => projectDiamond(item, activeScene, sphere))
    .sort((a, b) => a.z - b.z);
}

function drawSphere(ctx, activeScene, sphere) {
  const p = activeScene.palette;
  const { x: cx, y: cy, r } = sphere;

  ctx.save();

  ctx.globalCompositeOperation = "lighter";
  const atmosphere = ctx.createRadialGradient(cx, cy, r * 0.86, cx, cy, r * 1.72);
  atmosphere.addColorStop(0, "rgba(255,255,255,0)");
  atmosphere.addColorStop(0.50, p.glow);
  atmosphere.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const body = ctx.createRadialGradient(
    cx - r * 0.38,
    cy - r * 0.42,
    r * 0.06,
    cx,
    cy,
    r * 1.12
  );

  body.addColorStop(0, "rgba(255,255,255,.78)");
  body.addColorStop(0.08, p.sphereA);
  body.addColorStop(0.42, p.sphereB);
  body.addColorStop(0.84, p.sphereC);
  body.addColorStop(1, "#01030a");

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.clip();
  drawSphereCurvature(ctx, activeScene, sphere);

  const terminator = ctx.createRadialGradient(
    cx + r * 0.46 + Math.sin(state.phase) * r * 0.08,
    cy + r * 0.04,
    r * 0.06,
    cx + r * 0.50,
    cy,
    r * 1.12
  );

  terminator.addColorStop(0, "rgba(0,0,0,0)");
  terminator.addColorStop(0.46, "rgba(0,0,0,.18)");
  terminator.addColorStop(0.82, "rgba(0,0,0,.68)");
  terminator.addColorStop(1, "rgba(0,0,0,.92)");

  ctx.fillStyle = terminator;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  drawInnerLight(ctx, activeScene, sphere);
  ctx.restore();

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = p.accent;
  ctx.globalAlpha = 0.40;
  ctx.lineWidth = Math.max(1.2, r * 0.012);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.006, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.20;
  ctx.lineWidth = Math.max(2, r * 0.025);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.025, Math.PI * 1.06, Math.PI * 1.86);
  ctx.stroke();

  ctx.restore();
}

function drawSphereCurvature(ctx, activeScene, sphere) {
  const p = activeScene.palette;
  const { x: cx, y: cy, r } = sphere;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = p.grid;
  ctx.lineWidth = Math.max(0.5, r * 0.004);
  ctx.globalAlpha = activeScene.key === "flat" ? 0.16 : 0.30;

  const latitudeCount = activeScene.key === "flat" ? 5 : 9;
  for (let i = 1; i < latitudeCount; i += 1) {
    const t = (i / latitudeCount) * 2 - 1;
    const y = cy + t * r * 0.72;
    const w = r * Math.sqrt(Math.max(0, 1 - t * t)) * 0.98;
    const h = r * 0.13 * (1 - Math.abs(t) * 0.30);

    ctx.beginPath();
    ctx.ellipse(cx, y, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const longitudeCount = activeScene.key === "flat" ? 5 : 10;
  for (let i = 0; i < longitudeCount; i += 1) {
    const a = (i / longitudeCount) * Math.PI + state.phase * 0.12;
    const squash = Math.abs(Math.cos(a)) * 0.96;

    ctx.beginPath();
    ctx.ellipse(cx, cy, r * squash, r * 0.98, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawInnerLight(ctx, activeScene, sphere) {
  const { x: cx, y: cy, r } = sphere;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const light = ctx.createRadialGradient(
    cx - r * 0.34,
    cy - r * 0.36,
    r * 0.02,
    cx - r * 0.34,
    cy - r * 0.36,
    r * 0.52
  );

  light.addColorStop(0, "rgba(255,255,255,.24)");
  light.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawDiamondShadow(ctx, diamond) {
  if (diamond.behindSphere) return;

  ctx.save();
  ctx.globalAlpha = clamp(0.18 + diamond.z * 0.10, 0.08, 0.30);
  ctx.fillStyle = "rgba(0,0,0,.74)";
  ctx.filter = `blur(${Math.max(4, diamond.size * 0.055)}px)`;

  ctx.beginPath();
  ctx.ellipse(
    diamond.x,
    diamond.y + diamond.size * 0.58,
    diamond.size * 0.40,
    diamond.size * 0.10,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

function drawFloatingDiamond(ctx, diamond, activeScene) {
  const size = diamond.size;
  const cx = diamond.x;
  const cy = diamond.y;
  const half = size * 0.5;

  drawDiamondShadow(ctx, diamond);

  ctx.save();

  let alpha = 1;
  if (diamond.farSide) alpha = 0.44;
  if (diamond.behindSphere) alpha = 0.18;

  ctx.globalAlpha = alpha;

  const glow = diamond.selected || diamond.hover ? 1 : 0;
  if (glow && !diamond.behindSphere) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(cx, cy, half * 0.22, cx, cy, half * 1.26);
    g.addColorStop(0, diamond.selected ? activeScene.palette.glow : "rgba(255,255,255,.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, half * 1.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const top = { x: cx, y: cy - half };
  const right = { x: cx + half, y: cy };
  const bottom = { x: cx, y: cy + half };
  const left = { x: cx - half, y: cy };
  const center = { x: cx, y: cy };

  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();

  const body = ctx.createLinearGradient(cx - half, cy - half, cx + half, cy + half);
  body.addColorStop(0, "rgba(255,255,255,.42)");
  body.addColorStop(0.18, diamond.selected ? "rgba(143,240,195,.30)" : "rgba(142,190,255,.18)");
  body.addColorStop(0.46, "rgba(12,27,52,.86)");
  body.addColorStop(0.74, "rgba(244,191,96,.13)");
  body.addColorStop(1, "rgba(4,9,18,.94)");

  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.clip();

  drawFacet(ctx, top, center, left, "rgba(255,255,255,.22)", "rgba(142,190,255,.04)");
  drawFacet(ctx, top, right, center, "rgba(255,255,255,.17)", "rgba(244,191,96,.05)");
  drawFacet(ctx, center, right, bottom, "rgba(143,240,195,.10)", "rgba(5,9,18,.26)");
  drawFacet(ctx, left, center, bottom, "rgba(142,190,255,.11)", "rgba(5,9,18,.30)");

  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.lineWidth = Math.max(0.7, DPR);
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.stroke();

  const inner = half * 0.46;
  ctx.strokeStyle = diamond.selected ? "rgba(143,240,195,.34)" : "rgba(255,255,255,.14)";
  ctx.lineWidth = Math.max(0.6, DPR * 0.8);
  ctx.beginPath();
  ctx.moveTo(cx, cy - inner);
  ctx.lineTo(cx + inner, cy);
  ctx.lineTo(cx, cy + inner);
  ctx.lineTo(cx - inner, cy);
  ctx.closePath();
  ctx.stroke();

  drawDiamondGlints(ctx, cx, cy, half, diamond.seed);

  ctx.restore();

  ctx.strokeStyle = diamond.selected ? "rgba(143,240,195,.76)" : "rgba(244,191,96,.42)";
  ctx.lineWidth = diamond.selected ? Math.max(1.5, DPR * 1.4) : Math.max(1, DPR);
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();
  ctx.stroke();

  if (!diamond.behindSphere) {
    drawDiamondText(ctx, diamond, activeScene, cx, cy, half);
  }

  ctx.restore();

  if (!diamond.behindSphere) {
    state.hitRegions.push({
      key: diamond.key,
      route: diamond.route,
      x: cx,
      y: cy,
      radius: half * 0.92,
      diamond
    });
  }
}

function drawFacet(ctx, a, b, c, colorA, colorB) {
  const g = ctx.createLinearGradient(a.x, a.y, c.x, c.y);
  g.addColorStop(0, colorA);
  g.addColorStop(1, colorB);

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
}

function drawDiamondGlints(ctx, cx, cy, half, seed) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const count = MOBILE ? 3 : 5;
  for (let i = 0; i < count; i += 1) {
    const a = hash(seed, i, 90) * Math.PI * 2 + state.lightPhase * 0.25;
    const d = half * (0.15 + hash(seed, i, 91) * 0.48);
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    const pulse = 0.5 + Math.sin(state.lightPhase * 2.2 + i * 1.7) * 0.5;
    const len = half * (0.08 + pulse * 0.08);
    const alpha = 0.18 + pulse * 0.46;

    ctx.strokeStyle = i % 2 === 0
      ? `rgba(255,255,255,${alpha})`
      : `rgba(244,191,96,${alpha * 0.72})`;
    ctx.lineWidth = Math.max(0.6, DPR * 0.75);
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x - len, y);
    ctx.lineTo(x + len, y);
    ctx.moveTo(x, y - len);
    ctx.lineTo(x, y + len);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDiamondText(ctx, diamond, activeScene, cx, cy, half) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const labelSize = clamp(half * 0.28, 14 * DPR, 27 * DPR);

  ctx.fillStyle = diamond.selected ? activeScene.palette.active : "#f8ead0";
  ctx.font = `900 ${labelSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(diamond.label, cx, cy);

  ctx.restore();
}

function render(time = 0) {
  if (!state.context || !state.canvas) return;

  const ctx = state.context;
  const activeScene = scene();
  const sphere = sphereSpec(activeScene);

  state.hitRegions = [];

  clearField(ctx, state.width, state.height, activeScene);
  drawStars(ctx, state.width, state.height, activeScene);
  drawDepthField(ctx, activeScene, sphere);

  const diamonds = getDiamonds(activeScene, sphere);

  for (const diamond of diamonds.filter((item) => item.z < 0)) {
    drawFloatingDiamond(ctx, diamond, activeScene);
  }

  drawSphere(ctx, activeScene, sphere);

  for (const diamond of diamonds.filter((item) => item.z >= 0)) {
    drawFloatingDiamond(ctx, diamond, activeScene);
  }

  drawForegroundLight(ctx, activeScene, time);
  stampDocument();
}

function drawForegroundLight(ctx, activeScene, time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const sweepX = state.width * (0.14 + (0.5 + Math.sin(time * 0.00045) * 0.5) * 0.72);
  const gradient = ctx.createLinearGradient(sweepX - state.width * 0.20, 0, sweepX + state.width * 0.20, state.height);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.48, activeScene.palette.glow);
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.globalAlpha = MOBILE ? 0.08 : 0.13;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.restore();
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
    const dx = Math.abs(point.x - region.x);
    const dy = Math.abs(point.y - region.y);
    if (dx + dy <= region.radius) return region;
  }

  return null;
}

function selectScene(key) {
  if (!SCENES[key]) key = "round";

  state.selected = key;
  state.keyboardFocus = key;

  document.body.dataset.lens = key;
  document.documentElement.dataset.selectedLens = key;

  render(performance.now());
}

function navigateTo(key) {
  const activeScene = SCENES[key] || SCENES.round;
  window.location.href = activeScene.route;
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

  const elapsed = time - state.lastFrameAt;

  if (elapsed >= FRAME_MS) {
    state.lastFrameAt = time;

    if (!REDUCED_MOTION && !state.dragging) {
      state.phase += MOBILE ? 0.006 : 0.009;
      state.lightPhase += MOBILE ? 0.026 : 0.038;
    }

    render(time);
  }

  state.raf = window.requestAnimationFrame(frame);
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
      state.hover = hit.key;
      render(performance.now());
    }

    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    const point = canvasPoint(event);
    const hit = hitTest(point);
    state.hover = hit?.key || null;

    if (state.dragging && event.pointerId === state.pointerId) {
      const dx = event.clientX - state.pointerStartX;
      state.dragPhase = state.dragPhaseStart + dx * 0.0045;
    }

    render(performance.now());
    event.preventDefault();
  }, { passive: false });

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

    if (hit && wasTap) {
      handleTap(hit.key);
    }

    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    state.hover = null;
    canvas.releasePointerCapture?.(event.pointerId);
    render(performance.now());
  }, { passive: false });

  canvas.addEventListener("pointerleave", () => {
    state.hover = null;
    render(performance.now());
  }, { passive: true });

  canvas.addEventListener("dblclick", (event) => {
    const point = canvasPoint(event);
    const hit = hitTest(point);
    if (hit) navigateTo(hit.key);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
  }, { passive: false });
}

function handleTap(key) {
  const now = Date.now();
  const doubleTap = state.lastTap.key === key && now - state.lastTap.time < 340;

  if (doubleTap) {
    navigateTo(key);
    return;
  }

  state.lastTap = { key, time: now };
  selectScene(key);
}

function wireKeyboard() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("keydown", (event) => {
    const order = ["flat", "round", "globe"];
    const current = order.indexOf(state.keyboardFocus);
    const safeCurrent = current >= 0 ? current : 1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = order[(safeCurrent + 1) % order.length];
      selectScene(next);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = order[(safeCurrent + order.length - 1) % order.length];
      selectScene(next);
      return;
    }

    if (event.key === "1") {
      event.preventDefault();
      selectScene("flat");
      return;
    }

    if (event.key === "2") {
      event.preventDefault();
      selectScene("round");
      return;
    }

    if (event.key === "3") {
      event.preventDefault();
      selectScene("globe");
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      navigateTo(state.keyboardFocus || state.selected);
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      navigateTo(state.keyboardFocus || state.selected);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectScene(state.keyboardFocus || state.selected);
    }
  });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active) startLoop();
    else stopLoop();

    stampDocument();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.mount) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      state.visible = entry?.isIntersecting !== false;

      if (state.visible) startLoop();
      else stopLoop();

      stampDocument();
    }, { threshold: 0.05 });

    observer.observe(state.mount);
  }
}

function installResize() {
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__compassRoundFieldResizeTimer);
    window.__compassRoundFieldResizeTimer = window.setTimeout(() => {
      sizeCanvas();
      render(performance.now());
    }, 160);
  }, { passive: true });
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.compassRendererReceipt = CONTRACT;
  root.dataset.compassHtmlReceipt = HTML_CONTRACT;
  root.dataset.compassPreviousReceipt = PREVIOUS_CONTRACT;
  root.dataset.compassRoute = ROUTE;
  root.dataset.defaultLens = "round";
  root.dataset.selectedLens = state.selected;
  root.dataset.singleClick = "change-scenery";
  root.dataset.doubleClick = "navigate";
  root.dataset.rendererType = "2d-canvas-depth-projection";
  root.dataset.roundFieldRendered = "true";
  root.dataset.floatingDiamondsRendered = "true";
  root.dataset.visibleStatusBlock = "false";
  root.dataset.inCanvasInstructionStrip = "false";
  root.dataset.inCanvasCenterTitle = "false";
  root.dataset.privateRenderersLoaded = String(PRIVATE_RENDERERS_LOADED);
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
  root.dataset.dprCap = String(DPR);
  root.dataset.rendererActive = String(state.active);
  root.dataset.rendererVisible = String(state.visible);
}

function getCompassRoundFieldStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    selectedLens: state.selected,
    defaultLens: "round",
    singleClick: "change-scenery",
    doubleClick: "navigate",
    rendererType: "2d-canvas-depth-projection",
    floatingDiamondsRendered: true,
    roundFieldRendered: true,
    visibleStatusBlock: false,
    inCanvasInstructionStrip: false,
    inCanvasCenterTitle: false,
    privateRenderersLoaded: PRIVATE_RENDERERS_LOADED,
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM,
    dprCap: DPR,
    mobile: MOBILE,
    reducedMotion: REDUCED_MOTION,
    active: state.active,
    visible: state.visible
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    selectScene,
    navigateTo,
    render,
    status: getCompassRoundFieldStatus,
    getStatus: getCompassRoundFieldStatus,
    getCompassRoundFieldStatus
  };

  window.DGBCompassRoundField = api;
  window.DGBCompass = api;
  window.COMPASS_ROUND_FIELD_RECEIPT = CONTRACT;
}

function boot() {
  state.canvas = byId("compassRoundFieldCanvas");
  state.mount = byId("compassRoundFieldMount");

  if (!state.canvas || !state.mount) return;

  state.mount.classList.add("renderer-loaded");

  sizeCanvas();
  wirePointer();
  wireKeyboard();
  installVisibility();
  installResize();
  exposeApi();

  selectScene("round");
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
  PREVIOUS_CONTRACT,
  ROUTE,
  SCENES,
  DIAMONDS,
  GENERATED_IMAGE,
  GRAPHIC_BOX,
  VISUAL_PASS_CLAIM,
  PRIVATE_RENDERERS_LOADED,
  selectScene,
  navigateTo,
  render,
  getCompassRoundFieldStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  htmlContract: HTML_CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  selectScene,
  navigateTo,
  render,
  status: getCompassRoundFieldStatus,
  getStatus: getCompassRoundFieldStatus,
  getCompassRoundFieldStatus
};
