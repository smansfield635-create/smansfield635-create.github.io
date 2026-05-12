// /index.js
// COMPASS_ROUND_FIELD_3D_RENDERER_JS_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Render the Compass default as a dimensional Round Field.
// - Replace flat CSS diamond/card appearance with canvas-rendered floating diamond objects.
// - Single click/tap changes full scenery.
// - Double click/double tap opens the selected route.
// - Preserve route law.
// - Use low-budget 2D canvas projection.
// - No generated images.
// - No GraphicBox.
// - No external image assets.
// - No private renderers.
// - No visual pass claim.

const CONTRACT = "COMPASS_ROUND_FIELD_3D_RENDERER_JS_TNT_v1";
const HTML_CONTRACT = "COMPASS_ROUND_FIELD_3D_RENDERER_HTML_TNT_v1";
const PREVIOUS_CONTRACT = "COMPASS_ROUND_SCENERY_LATTICE_DIAMOND_GATE_TNT_v13";
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
    title: "World Is Flat",
    kicker: "Lens One",
    route: "/",
    status: "Flat scenery active · single click changes scenery · double click opens Compass home.",
    copy: "Architectural map state. The field becomes measured, planar, and controlled before the Door opens.",
    palette: {
      bg0: "#040713",
      bg1: "#071225",
      bg2: "#10172a",
      auraA: "rgba(142,190,255,.12)",
      auraB: "rgba(244,191,96,.08)",
      auraC: "rgba(255,255,255,.06)",
      sphereA: "#18243a",
      sphereB: "#0c1730",
      sphereC: "#030713",
      grid: "rgba(142,190,255,.20)",
      accent: "#8ebeff",
      active: "#f4bf60",
      glow: "rgba(142,190,255,.26)"
    },
    gridTilt: 0.35,
    depth: 0.38,
    fieldScale: 0.92,
    starDensity: 0.35
  },
  round: {
    key: "round",
    title: "World Is Round",
    kicker: "Default Lens",
    route: "/?lens=round",
    status: "Round scenery active · single click changes scenery · double click opens Round Compass.",
    copy: "The Compass is a living field. Routes sit in depth around the center, and the estate is entered as a world rather than a flat menu.",
    palette: {
      bg0: "#030713",
      bg1: "#07152d",
      bg2: "#10213f",
      auraA: "rgba(143,240,195,.15)",
      auraB: "rgba(244,191,96,.13)",
      auraC: "rgba(142,190,255,.14)",
      sphereA: "#12324a",
      sphereB: "#0b1e36",
      sphereC: "#02050d",
      grid: "rgba(143,240,195,.22)",
      accent: "#8ff0c3",
      active: "#f4bf60",
      glow: "rgba(143,240,195,.30)"
    },
    gridTilt: 0.64,
    depth: 0.88,
    fieldScale: 1.00,
    starDensity: 0.50
  },
  globe: {
    key: "globe",
    title: "World Is a Globe",
    kicker: "Lens Three",
    route: "/nine-summits/universe/",
    status: "Globe scenery active · single click changes scenery · double click opens Nine Summits Universe.",
    copy: "Universe-scale orientation. The field expands beyond the estate into the wider world architecture.",
    palette: {
      bg0: "#030512",
      bg1: "#0c1032",
      bg2: "#20133f",
      auraA: "rgba(190,170,255,.17)",
      auraB: "rgba(142,190,255,.15)",
      auraC: "rgba(244,191,96,.10)",
      sphereA: "#22245b",
      sphereB: "#11183d",
      sphereC: "#030512",
      grid: "rgba(190,170,255,.22)",
      accent: "#beaaff",
      active: "#f4bf60",
      glow: "rgba(190,170,255,.30)"
    },
    gridTilt: 0.74,
    depth: 1.05,
    fieldScale: 1.08,
    starDensity: 0.68
  }
});

const DIAMONDS = Object.freeze([
  {
    key: "flat",
    label: "Flat",
    sublabel: "Map",
    route: "/",
    baseAngle: Math.PI * 1.12,
    orbitRadius: 0.37,
    z: -0.10,
    seed: 11
  },
  {
    key: "round",
    label: "Round",
    sublabel: "Field",
    route: "/?lens=round",
    baseAngle: Math.PI * 1.88,
    orbitRadius: 0.36,
    z: 0.30,
    seed: 29
  },
  {
    key: "globe",
    label: "Globe",
    sublabel: "Universe",
    route: "/nine-summits/universe/",
    baseAngle: Math.PI * 0.50,
    orbitRadius: 0.31,
    z: 0.08,
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
  statusText: null,

  width: 0,
  height: 0,
  cssWidth: 0,
  cssHeight: 0,

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

function lerp(a, b, t) {
  return a + (b - a) * t;
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
  const cssHeight = Math.max(420, Math.floor(rect.height || canvas.clientHeight || 720));

  const width = Math.floor(cssWidth * DPR);
  const height = Math.floor(cssHeight * DPR);

  const changed = canvas.width !== width || canvas.height !== height;

  if (changed) {
    canvas.width = width;
    canvas.height = height;
  }

  state.cssWidth = cssWidth;
  state.cssHeight = cssHeight;
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
    Math.max(width, height) * 0.72
  );

  bg.addColorStop(0, p.bg2);
  bg.addColorStop(0.38, p.bg1);
  bg.addColorStop(1, p.bg0);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const aura1 = ctx.createRadialGradient(width * 0.50, height * 0.45, 0, width * 0.50, height * 0.45, width * 0.46);
  aura1.addColorStop(0, p.auraA);
  aura1.addColorStop(0.58, p.auraB);
  aura1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, width, height);

  const aura2 = ctx.createRadialGradient(width * 0.68, height * 0.30, 0, width * 0.68, height * 0.30, width * 0.42);
  aura2.addColorStop(0, p.auraC);
  aura2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function drawStars(ctx, width, height, activeScene) {
  const density = activeScene.starDensity;
  const count = MOBILE ? Math.floor(56 * density) : Math.floor(110 * density);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const x = hash(13, i, 1) * width;
    const y = hash(13, i, 2) * height;
    const pulse = 0.5 + Math.sin(state.lightPhase * 0.8 + i * 0.47) * 0.5;
    const radius = (0.45 + hash(13, i, 3) * 1.35) * DPR;
    const alpha = 0.18 + pulse * 0.32;

    ctx.beginPath();
    ctx.fillStyle = i % 11 === 0
      ? `rgba(244,191,96,${alpha})`
      : `rgba(225,238,255,${alpha})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFieldPlanes(ctx, width, height, activeScene) {
  const cx = width * 0.5;
  const cy = height * 0.54;
  const base = Math.min(width, height) * 0.40 * activeScene.fieldScale;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = Math.max(0.8, 1.0 * DPR);

  const rings = [
    { r: 1.18, a: 0.16, y: 0.24 },
    { r: 0.88, a: 0.22, y: 0.15 },
    { r: 0.58, a: 0.24, y: 0.07 },
    { r: 0.34, a: 0.20, y: 0.00 }
  ];

  for (const ring of rings) {
    ctx.save();
    ctx.translate(cx, cy + base * ring.y);
    ctx.scale(1, activeScene.gridTilt);
    ctx.rotate(Math.sin(state.phase * 0.28) * 0.03);
    ctx.strokeStyle = activeScene.palette.grid;
    ctx.globalAlpha = ring.a;

    ctx.beginPath();
    ctx.ellipse(0, 0, base * ring.r, base * ring.r, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  const spokeCount = MOBILE ? 10 : 16;
  ctx.strokeStyle = activeScene.palette.grid;
  ctx.globalAlpha = 0.13;

  for (let i = 0; i < spokeCount; i += 1) {
    const a = (i / spokeCount) * Math.PI * 2 + state.phase * 0.08;
    const x0 = cx + Math.cos(a) * base * 0.18;
    const y0 = cy + Math.sin(a) * base * 0.18 * activeScene.gridTilt;
    const x1 = cx + Math.cos(a) * base * 1.18;
    const y1 = cy + Math.sin(a) * base * 1.18 * activeScene.gridTilt;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCentralSphere(ctx, width, height, activeScene) {
  const cx = width * 0.5;
  const cy = height * 0.48;
  const radius = Math.min(width, height) * (MOBILE ? 0.205 : 0.225) * activeScene.fieldScale;
  const p = activeScene.palette;

  ctx.save();

  ctx.globalCompositeOperation = "lighter";
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.72);
  glow.addColorStop(0, "rgba(255,255,255,0)");
  glow.addColorStop(0.50, p.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const sphere = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.42,
    radius * 0.05,
    cx,
    cy,
    radius * 1.12
  );

  sphere.addColorStop(0, "rgba(255,255,255,.82)");
  sphere.addColorStop(0.08, p.sphereA);
  sphere.addColorStop(0.46, p.sphereB);
  sphere.addColorStop(0.84, p.sphereC);
  sphere.addColorStop(1, "#01030a");

  ctx.fillStyle = sphere;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.clip();

  drawSphereGrid(ctx, cx, cy, radius, activeScene);

  const terminator = ctx.createRadialGradient(
    cx + radius * 0.48 + Math.sin(state.phase) * radius * 0.08,
    cy + radius * 0.04,
    radius * 0.06,
    cx + radius * 0.50,
    cy,
    radius * 1.12
  );

  terminator.addColorStop(0, "rgba(0,0,0,0)");
  terminator.addColorStop(0.45, "rgba(0,0,0,.18)");
  terminator.addColorStop(0.82, "rgba(0,0,0,.66)");
  terminator.addColorStop(1, "rgba(0,0,0,.88)");

  ctx.fillStyle = terminator;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = p.accent;
  ctx.globalAlpha = 0.38;
  ctx.lineWidth = Math.max(1.2, radius * 0.018);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.006, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  drawSphereLabel(ctx, cx, cy, radius, activeScene);
}

function drawSphereGrid(ctx, cx, cy, radius, activeScene) {
  const p = activeScene.palette;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = p.grid;
  ctx.lineWidth = Math.max(0.5, radius * 0.006);
  ctx.globalAlpha = activeScene.key === "flat" ? 0.18 : 0.30;

  const latitudeCount = activeScene.key === "flat" ? 5 : 7;
  for (let i = 1; i < latitudeCount; i += 1) {
    const t = (i / latitudeCount) * 2 - 1;
    const y = cy + t * radius * 0.72;
    const w = radius * Math.sqrt(Math.max(0, 1 - t * t)) * 0.98;
    const h = radius * 0.15 * (1 - Math.abs(t) * 0.35);

    ctx.beginPath();
    ctx.ellipse(cx, y, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const longitudeCount = activeScene.key === "flat" ? 5 : 8;
  for (let i = 0; i < longitudeCount; i += 1) {
    const a = (i / longitudeCount) * Math.PI + state.phase * 0.10;
    const squash = Math.abs(Math.cos(a)) * 0.96;

    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * squash, radius * 0.98, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSphereLabel(ctx, cx, cy, radius, activeScene) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(4,9,18,.62)";
  ctx.strokeStyle = "rgba(244,191,96,.22)";
  ctx.lineWidth = Math.max(1, DPR);

  const boxW = radius * 1.32;
  const boxH = radius * 0.42;
  const x = cx - boxW * 0.5;
  const y = cy + radius * 0.08 - boxH * 0.5;

  drawFacetBox(ctx, x, y, boxW, boxH, radius * 0.08);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeScene.palette.active;
  ctx.font = `${Math.max(10, radius * 0.075)}px Inter, system-ui, sans-serif`;
  ctx.letterSpacing = "0.12em";
  ctx.fillText(activeScene.kicker.toUpperCase(), cx, cy - radius * 0.01);

  ctx.fillStyle = "#f8ead0";
  ctx.font = `900 ${Math.max(18, radius * 0.15)}px Inter, system-ui, sans-serif`;
  ctx.fillText(activeScene.title, cx, cy + radius * 0.16);

  ctx.restore();
}

function drawFacetBox(ctx, x, y, w, h, cut) {
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

function projectPoint(x, y, z, activeScene) {
  const width = state.width;
  const height = state.height;
  const cx = width * 0.5;
  const cy = height * 0.50;
  const focal = 2.7;
  const depth = activeScene.depth;

  const perspective = focal / (focal - z * depth);
  const screenX = cx + x * perspective;
  const screenY = cy + y * perspective;

  return {
    x: screenX,
    y: screenY,
    scale: perspective,
    z
  };
}

function diamondPositions(activeScene) {
  const width = state.width;
  const height = state.height;
  const min = Math.min(width, height);
  const positions = [];

  for (const item of DIAMONDS) {
    const selected = item.key === state.selected;
    const hover = item.key === state.hover;
    const angle = item.baseAngle + state.phase * (activeScene.key === "flat" ? 0.04 : 0.18) + state.dragPhase;
    const radius = min * item.orbitRadius * activeScene.fieldScale;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * (activeScene.key === "flat" ? 0.40 : 0.62);
    const z = item.z + Math.sin(angle + item.seed) * 0.20 + (selected ? 0.28 : 0) + (hover ? 0.08 : 0);

    const projected = projectPoint(x, y, z, activeScene);
    const baseSize = min * (MOBILE ? 0.145 : 0.125);
    const size = baseSize * clamp(projected.scale, 0.78, 1.32) * (selected ? 1.14 : 1);

    positions.push({
      ...item,
      selected,
      hover,
      x: projected.x,
      y: projected.y,
      z,
      scale: projected.scale,
      size,
      depthSort: z
    });
  }

  return positions.sort((a, b) => a.depthSort - b.depthSort);
}

function drawDiamondShadow(ctx, diamond) {
  ctx.save();
  ctx.globalAlpha = clamp(0.20 + diamond.z * 0.18, 0.12, 0.38);
  ctx.fillStyle = "rgba(0,0,0,.72)";
  ctx.filter = `blur(${Math.max(4, diamond.size * 0.055)}px)`;

  ctx.beginPath();
  ctx.ellipse(
    diamond.x,
    diamond.y + diamond.size * 0.64,
    diamond.size * 0.42,
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

  const glow = diamond.selected || diamond.hover ? 1 : 0;
  if (glow) {
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(cx, cy, half * 0.28, cx, cy, half * 1.16);
    g.addColorStop(0, diamond.selected ? activeScene.palette.glow : "rgba(255,255,255,.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, half * 1.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
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
  body.addColorStop(0, "rgba(255,255,255,.44)");
  body.addColorStop(0.18, diamond.selected ? "rgba(143,240,195,.28)" : "rgba(142,190,255,.20)");
  body.addColorStop(0.45, "rgba(12,27,52,.88)");
  body.addColorStop(0.74, "rgba(244,191,96,.16)");
  body.addColorStop(1, "rgba(4,9,18,.92)");

  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.clip();

  drawDiamondFacet(ctx, top, center, left, "rgba(255,255,255,.22)", "rgba(142,190,255,.04)");
  drawDiamondFacet(ctx, top, right, center, "rgba(255,255,255,.18)", "rgba(244,191,96,.05)");
  drawDiamondFacet(ctx, center, right, bottom, "rgba(143,240,195,.11)", "rgba(5,9,18,.22)");
  drawDiamondFacet(ctx, left, center, bottom, "rgba(142,190,255,.12)", "rgba(5,9,18,.28)");

  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.lineWidth = Math.max(0.7, DPR);
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.stroke();

  const inner = half * 0.46;
  ctx.strokeStyle = diamond.selected ? "rgba(143,240,195,.30)" : "rgba(255,255,255,.14)";
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

  ctx.strokeStyle = diamond.selected ? "rgba(143,240,195,.72)" : "rgba(244,191,96,.42)";
  ctx.lineWidth = diamond.selected ? Math.max(1.5, DPR * 1.4) : Math.max(1, DPR);
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();
  ctx.stroke();

  drawDiamondText(ctx, diamond, activeScene, cx, cy, half);

  ctx.restore();

  state.hitRegions.push({
    key: diamond.key,
    route: diamond.route,
    x: cx,
    y: cy,
    radius: half * 0.92,
    diamond
  });
}

function drawDiamondFacet(ctx, a, b, c, colorA, colorB) {
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

  const labelSize = clamp(half * 0.23, 13 * DPR, 24 * DPR);
  const subSize = clamp(half * 0.115, 9 * DPR, 13 * DPR);

  ctx.fillStyle = diamond.selected ? activeScene.palette.active : "#f8ead0";
  ctx.font = `900 ${labelSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(diamond.label, cx, cy - half * 0.06);

  ctx.fillStyle = diamond.selected ? "rgba(143,240,195,.86)" : "rgba(186,194,207,.86)";
  ctx.font = `800 ${subSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(diamond.sublabel.toUpperCase(), cx, cy + half * 0.20);

  if (!MOBILE && diamond.selected) {
    ctx.fillStyle = "rgba(244,191,96,.78)";
    ctx.font = `800 ${subSize * 0.86}px Inter, system-ui, sans-serif`;
    ctx.fillText("double click to open", cx, cy + half * 0.38);
  }

  ctx.restore();
}

function drawSceneCopy(ctx, width, height, activeScene) {
  const y = height * (MOBILE ? 0.88 : 0.86);
  const maxW = width * 0.78;
  const x = width * 0.5;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const boxW = Math.min(width * 0.86, 820 * DPR);
  const boxH = MOBILE ? 84 * DPR : 92 * DPR;
  const boxX = x - boxW * 0.5;
  const boxY = y - boxH * 0.5;

  ctx.fillStyle = "rgba(4,9,18,.58)";
  ctx.strokeStyle = "rgba(244,191,96,.18)";
  ctx.lineWidth = Math.max(1, DPR);
  drawFacetBox(ctx, boxX, boxY, boxW, boxH, 16 * DPR);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeScene.palette.active;
  ctx.font = `900 ${MOBILE ? 11 * DPR : 12 * DPR}px Inter, system-ui, sans-serif`;
  ctx.fillText("SINGLE CLICK CHANGES SCENERY · DOUBLE CLICK OPENS ROUTE", x, boxY + boxH * 0.28);

  ctx.fillStyle = "rgba(248,234,208,.82)";
  ctx.font = `700 ${MOBILE ? 13 * DPR : 15 * DPR}px Inter, system-ui, sans-serif`;
  wrapText(ctx, activeScene.copy, x, boxY + boxH * 0.58, maxW, MOBILE ? 17 * DPR : 20 * DPR, 2);

  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    } else {
      line = test;
    }
  }

  if (line && lines.length < maxLines) lines.push(line);

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((item, index) => {
    ctx.fillText(item, x, startY + index * lineHeight);
  });
}

function render(time = 0) {
  if (!state.context || !state.canvas) return;

  const ctx = state.context;
  const width = state.width;
  const height = state.height;
  const activeScene = scene();

  state.hitRegions = [];

  clearField(ctx, width, height, activeScene);
  drawStars(ctx, width, height, activeScene);
  drawFieldPlanes(ctx, width, height, activeScene);
  drawCentralSphere(ctx, width, height, activeScene);

  const diamonds = diamondPositions(activeScene);
  for (const diamond of diamonds) {
    drawFloatingDiamond(ctx, diamond, activeScene);
  }

  drawForegroundLight(ctx, width, height, activeScene, time);
  drawSceneCopy(ctx, width, height, activeScene);

  stampDocument();
}

function drawForegroundLight(ctx, width, height, activeScene, time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const sweepX = width * (0.18 + (0.5 + Math.sin(time * 0.00045) * 0.5) * 0.64);
  const gradient = ctx.createLinearGradient(sweepX - width * 0.18, 0, sweepX + width * 0.18, height);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.48, activeScene.palette.glow);
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.globalAlpha = MOBILE ? 0.10 : 0.16;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

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

  const activeScene = scene();

  if (state.statusText) {
    state.statusText.textContent = activeScene.status;
  }

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
  root.dataset.rendererType = "2d-canvas-projection";
  root.dataset.roundFieldRendered = "true";
  root.dataset.floatingDiamondsRendered = "true";
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
    rendererType: "2d-canvas-projection",
    floatingDiamondsRendered: true,
    roundFieldRendered: true,
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
  state.statusText = byId("compassStatusText");

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
