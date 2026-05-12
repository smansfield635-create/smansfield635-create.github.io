// /showroom/globe/index.js
// SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_INSPECTION_DISPLAY_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Restore actual visible planet figures on /showroom/globe/.
// - Render Earth, H-Earth, Hearth, and Audralia directly in the Showcase display case.
// - Remove dependency on imported H-Earth canvas module for this page.
// - Remove the "Identifier 'ctx' has already been declared" import failure from the Showcase path.
// - Make the display case inspection-heavy: drag with finger/mouse to rotate, wheel to zoom where available.
// - Keep full private planet routes available through Open Full Inspection.
// - Keep diagnostics backstage.
// - Do not mutate H-Earth parent truth.
// - Do not use image generation.
// - Do not use GraphicBox.
// - Do not claim visual pass.

const CONTRACT = "SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_INSPECTION_DISPLAY_TNT_v1";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_INSPECTION_HEAVY_H_EARTH_DISPLAY_CASE_TNT_v1";
const HTML_EXPECTED = "SHOWROOM_GLOBE_LEAP_RENDER_CONSUMPTION_HTML_ALIGNMENT_TNT_v21A";

const SHOWROOM_MODE = "showcase-bookcase-display-case";
const DISPLAY_CASE_MODE = "self-contained-inspection-heavy";
const DEFAULT_DISPLAY = "h-earth";

const TOTAL_CELLS = 256;
const GRID = 16;

const PARENT_MUTATION_AUTHORIZED = false;
const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;

const GROUND_LEVEL_READY = false;
const MANOR_PLACEMENT_READY = false;
const ESTATE_PLACEMENT_READY = false;

const WORLDS = Object.freeze([
  {
    key: "earth",
    name: "Earth",
    route: "/showroom/globe/earth/",
    label: "Protected reference body.",
    tags: ["REFERENCE", "PROTECTED"],
    seed: 101,
    oceanBase: "#0c4b82",
    oceanDeep: "#031226",
    oceanLight: "#2b93c2",
    land: "#5f8d4b",
    forest: "#2f6b3b",
    coast: "#d1b579",
    relief: "#8f8b7e",
    ice: "#e6f5f8",
    glow: "rgba(142,190,255,0.34)",
    landBias: 0.46
  },
  {
    key: "h-earth",
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    label: "Hybrid Earth. Active orbital/aerial build planet.",
    tags: ["ACTIVE", "BUILD", "LAND-STATE GATE"],
    seed: 256,
    oceanBase: "#0a3764",
    oceanDeep: "#020d22",
    oceanLight: "#2b91a8",
    land: "#6f9b55",
    forest: "#2f6f40",
    coast: "#d7bd7d",
    relief: "#9a8f69",
    ice: "#d9f0f5",
    glow: "rgba(143,240,195,0.34)",
    landBias: 0.54
  },
  {
    key: "hearth",
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    label: "Separate terrain lane.",
    tags: ["SEPARATE", "REGRESSION"],
    seed: 377,
    oceanBase: "#173c56",
    oceanDeep: "#06111d",
    oceanLight: "#417d95",
    land: "#9b7647",
    forest: "#746b3d",
    coast: "#d0a66e",
    relief: "#aa5f45",
    ice: "#d6e6e9",
    glow: "rgba(244,191,96,0.30)",
    landBias: 0.50
  },
  {
    key: "audralia",
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    label: "Constructed-world lane.",
    tags: ["CONSTRUCTED", "SEPARATE"],
    seed: 610,
    oceanBase: "#0f456f",
    oceanDeep: "#041225",
    oceanLight: "#3b9bb2",
    land: "#819f58",
    forest: "#436f3e",
    coast: "#c9aa6e",
    relief: "#8f6d54",
    ice: "#cfe8ee",
    glow: "rgba(184,166,255,0.30)",
    landBias: 0.48
  }
]);

const state = {
  activeWorldKey: DEFAULT_DISPLAY,
  yaw: -18,
  pitch: 8,
  zoom: 1,
  previewYaw: 0,
  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,
  raf: 0,
  active: true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.6),
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
};

const nodes = {
  displayWindow: null,
  displayCanvas: null,
  displayContext: null,
  displayTitle: null,
  displayCopy: null,
  displayMeta: null,
  inspectSelected: null,
  cards: new Map(),
  previews: new Map()
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function byId(id) {
  return document.getElementById(id);
}

function worldByKey(key) {
  return WORLDS.find((world) => world.key === key) || WORLDS.find((world) => world.key === DEFAULT_DISPLAY);
}

function hashUnit(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function setupCanvas(canvas, fallbackSize = 720) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(180, Math.floor(rect.width || canvas.clientWidth || fallbackSize));
  const cssHeight = Math.max(180, Math.floor(rect.height || canvas.clientHeight || cssWidth));

  const width = Math.floor(cssWidth * state.dpr);
  const height = Math.floor(cssHeight * state.dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  canvas.style.transform = "none";
  canvas.style.touchAction = "none";

  return canvas.getContext("2d", { alpha: false });
}

function ensureStyle() {
  if (document.getElementById("showroom-globe-self-contained-inspection-style-v1")) return;

  const style = document.createElement("style");
  style.id = "showroom-globe-self-contained-inspection-style-v1";
  style.textContent = `
    html[data-globe-showcase-self-contained-inspection="true"] {
      --display-case-glow: rgba(143, 240, 195, 0.22);
    }

    .display-window,
    [data-display-window] {
      touch-action: none !important;
    }

    [data-display-case-canvas],
    #displayCanvas {
      display: block !important;
      width: min(100%, 1040px) !important;
      max-width: 1040px !important;
      height: auto !important;
      aspect-ratio: 1 / 1 !important;
      margin: auto !important;
      touch-action: none !important;
      transform: none !important;
      border-radius: 22px;
    }

    [data-showroom-inspection-hint] {
      position: absolute;
      left: 16px;
      top: 16px;
      z-index: 4;
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      padding: 7px 11px;
      border: 1px solid rgba(143, 240, 195, 0.34);
      border-radius: 999px;
      color: #8ff0c3;
      background: rgba(4, 9, 18, 0.72);
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      pointer-events: none;
      backdrop-filter: blur(12px);
    }

    [data-world-card] {
      transform: none !important;
    }
  `;

  document.head.appendChild(style);
}

function ensureDisplayCanvas() {
  if (!nodes.displayWindow) return null;

  let canvas = byId("displayCanvas") || document.querySelector("[data-display-case-canvas]");

  if (!canvas || !nodes.displayWindow.contains(canvas)) {
    nodes.displayWindow.replaceChildren();

    const hint = document.createElement("div");
    hint.setAttribute("data-showroom-inspection-hint", "true");
    hint.textContent = "Drag · Rotate · Zoom";

    canvas = document.createElement("canvas");
    canvas.id = "displayCanvas";
    canvas.setAttribute("data-display-case-canvas", "true");
    canvas.setAttribute("aria-label", "Selected world inspection display");
    canvas.setAttribute("role", "img");

    nodes.displayWindow.appendChild(hint);
    nodes.displayWindow.appendChild(canvas);
  } else {
    const oldError = nodes.displayWindow.querySelector("[data-showroom-inspection-error]");
    const oldShell = nodes.displayWindow.querySelector("[data-showroom-h-earth-inspection-shell]");

    if (oldError) oldError.remove();
    if (oldShell) oldShell.remove();

    canvas.hidden = false;

    if (!nodes.displayWindow.querySelector("[data-showroom-inspection-hint]")) {
      const hint = document.createElement("div");
      hint.setAttribute("data-showroom-inspection-hint", "true");
      hint.textContent = "Drag · Rotate · Zoom";
      nodes.displayWindow.prepend(hint);
    }

    if (!nodes.displayWindow.contains(canvas)) {
      nodes.displayWindow.appendChild(canvas);
    }
  }

  nodes.displayCanvas = canvas;
  nodes.displayContext = setupCanvas(canvas, 880);

  return canvas;
}

function collectNodes() {
  ensureStyle();

  nodes.displayWindow =
    document.querySelector(".display-window") ||
    document.querySelector("[data-display-window]") ||
    byId("displayWindow");

  ensureDisplayCanvas();

  nodes.displayTitle = byId("displayTitle");
  nodes.displayCopy = byId("displayCopy");
  nodes.displayMeta = byId("displayMeta");
  nodes.inspectSelected = byId("inspectSelected");

  nodes.cards.clear();
  document.querySelectorAll("[data-world-card]").forEach((card) => {
    const key = card.getAttribute("data-world-card");
    if (!key) return;

    card.style.transform = "none";
    nodes.cards.set(key, card);
  });

  nodes.previews.clear();
  document.querySelectorAll("[data-preview-canvas]").forEach((canvas) => {
    const key = canvas.getAttribute("data-preview-canvas");
    if (!key) return;

    nodes.previews.set(key, {
      canvas,
      context: setupCanvas(canvas, 220)
    });
  });
}

function cellKind(world, index, row, col, latitude, longitude) {
  const latWave = Math.sin((latitude / 90) * Math.PI);
  const lonWaveA = Math.sin(((longitude + world.seed * 0.31) / 180) * Math.PI * 2.0);
  const lonWaveB = Math.cos(((longitude - world.seed * 0.17) / 180) * Math.PI * 3.0);
  const diagonal = Math.sin((row * 0.74 + col * 0.52 + world.seed * 0.011));
  const noise = hashUnit(index, world.seed);

  const landSignal =
    lonWaveA * 0.46 +
    lonWaveB * 0.26 +
    diagonal * 0.22 +
    latWave * 0.18 +
    (noise - 0.5) * 0.54;

  if (latitude > 67 || latitude < -66) {
    return noise > 0.34 ? "ice" : "ocean";
  }

  if (landSignal > world.landBias + 0.30) {
    if (noise > 0.70) return "relief";
    if (noise < 0.22) return "forest";
    return "land";
  }

  if (landSignal > world.landBias + 0.08) {
    return noise > 0.45 ? "coast" : "shelf";
  }

  if (landSignal > world.landBias - 0.04) {
    return "shelf";
  }

  if (noise < 0.18) return "deep-ocean";

  return "ocean";
}

function buildWorldCells(world) {
  const cells = [];

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / GRID);
    const col = index % GRID;
    const latitude = 90 - ((row + 0.5) / GRID) * 180;
    const longitude = -180 + ((col + 0.5) / GRID) * 360;
    const kind = cellKind(world, index, row, col, latitude, longitude);
    const noiseA = hashUnit(index, world.seed + 61);
    const noiseB = hashUnit(index, world.seed + 97);

    let elevation = 0;
    let depth = 0;

    if (kind === "deep-ocean") {
      depth = 2400 + noiseA * 3200;
      elevation = -depth;
    } else if (kind === "ocean") {
      depth = 500 + noiseA * 1900;
      elevation = -depth;
    } else if (kind === "shelf") {
      depth = 30 + noiseA * 160;
      elevation = -depth;
    } else if (kind === "coast") {
      elevation = 2 + noiseA * 52;
    } else if (kind === "relief") {
      elevation = 900 + noiseA * 3600;
    } else if (kind === "ice") {
      elevation = 1200 + noiseA * 3200;
    } else if (kind === "forest") {
      elevation = 40 + noiseA * 620;
    } else {
      elevation = 20 + noiseA * 480;
    }

    cells.push({
      index,
      row,
      col,
      latitude,
      longitude,
      kind,
      elevation,
      depth,
      noiseA,
      noiseB
    });
  }

  return cells;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgb(value) {
  return `rgb(${Math.round(clamp(value.r, 0, 255))}, ${Math.round(clamp(value.g, 0, 255))}, ${Math.round(clamp(value.b, 0, 255))})`;
}

function shade(hex, light, lift = 0, darken = 0) {
  const base = hexToRgb(hex);
  const adjusted = clamp(light + lift - darken, 0.12, 1.45);

  return rgb({
    r: base.r * adjusted + 8 * (1 - adjusted),
    g: base.g * adjusted + 9 * (1 - adjusted),
    b: base.b * adjusted + 12 * (1 - adjusted)
  });
}

function colorForCell(world, cell) {
  if (cell.kind === "deep-ocean") return world.oceanDeep;
  if (cell.kind === "ocean") return world.oceanBase;
  if (cell.kind === "shelf") return world.oceanLight;
  if (cell.kind === "coast") return world.coast;
  if (cell.kind === "relief") return world.relief;
  if (cell.kind === "ice") return world.ice;
  if (cell.kind === "forest") return world.forest;
  return world.land;
}

function clearScene(context, width, height, world) {
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.44,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  gradient.addColorStop(0, world.glow);
  gradient.addColorStop(0.42, "#07152b");
  gradient.addColorStop(1, "#01030a");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.58;

  for (let i = 0; i < 120; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const radius = 0.65 + ((i * 7) % 11) / 15;

    context.beginPath();
    context.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.70)" : "rgba(225,238,255,.56)";
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function projectCell(cell, radius, centerX, centerY, yaw, pitch, zoom) {
  const lat = (cell.latitude * Math.PI) / 180;
  const lon = ((cell.longitude + yaw) * Math.PI) / 180;
  const pitchRad = (pitch * Math.PI) / 180;

  const x0 = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);

  const y = y0 * Math.cos(pitchRad) - z0 * Math.sin(pitchRad);
  const z = y0 * Math.sin(pitchRad) + z0 * Math.cos(pitchRad);
  const x = x0;

  if (z < -0.08) return null;

  return {
    x: centerX + x * radius * zoom,
    y: centerY - y * radius * 0.98 * zoom,
    z,
    light: clamp(0.50 + z * 0.44 + y * 0.12 - x * 0.07, 0.20, 1.12)
  };
}

function drawGlobeBase(context, width, height, world, radius, centerX, centerY, zoom) {
  const r = radius * zoom;

  context.save();

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.clip();

  const ocean = context.createRadialGradient(
    centerX - r * 0.34,
    centerY - r * 0.34,
    r * 0.08,
    centerX,
    centerY,
    r * 1.16
  );

  ocean.addColorStop(0, shade(world.oceanLight, 1.32));
  ocean.addColorStop(0.32, world.oceanBase);
  ocean.addColorStop(0.70, shade(world.oceanDeep, 0.70));
  ocean.addColorStop(1, "#020b1c");

  context.fillStyle = ocean;
  context.fillRect(centerX - r * 1.2, centerY - r * 1.2, r * 2.4, r * 2.4);

  context.restore();

  context.save();

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.strokeStyle = "rgba(183,222,240,.30)";
  context.lineWidth = Math.max(2, radius * 0.012);
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, r * 1.014, 0, Math.PI * 2);
  context.strokeStyle = world.glow;
  context.lineWidth = Math.max(9, radius * 0.034);
  context.stroke();

  context.restore();
}

function drawCellTexture(context, world, cell, point, radius, size) {
  const grain = 0.25 + cell.noiseA * 0.50;
  const ridge = cell.kind === "relief" ? 0.55 + cell.noiseB * 0.38 : cell.elevation > 800 ? 0.20 + cell.noiseB * 0.22 : 0.08;
  const coast = cell.kind === "coast" || cell.kind === "shelf" ? 0.60 + cell.noiseA * 0.28 : 0;
  const count = Math.max(2, Math.min(8, Math.round(2 + grain * 4 + ridge * 3 + coast * 2)));
  const strokeSize = size * (0.16 + grain * 0.18);

  context.save();

  if (cell.kind === "deep-ocean" || cell.kind === "ocean" || cell.kind === "shelf") {
    context.globalAlpha = clamp(0.04 + Math.abs(cell.depth) / 5600 * 0.11, 0.03, 0.16);
    context.strokeStyle = "rgba(160,230,255,.42)";
  } else if (cell.kind === "coast") {
    context.globalAlpha = clamp(0.14 + coast * 0.22, 0.12, 0.38);
    context.strokeStyle = "rgba(255,232,160,.74)";
  } else if (cell.kind === "relief") {
    context.globalAlpha = clamp(0.12 + ridge * 0.24, 0.10, 0.40);
    context.strokeStyle = "rgba(255,242,205,.62)";
  } else if (cell.kind === "ice") {
    context.globalAlpha = 0.19;
    context.strokeStyle = "rgba(235,250,255,.70)";
  } else {
    context.globalAlpha = clamp(0.08 + grain * 0.10, 0.06, 0.22);
    context.strokeStyle = "rgba(255,235,180,.40)";
  }

  context.lineWidth = Math.max(0.7, radius * 0.0016);

  for (let i = 0; i < count; i += 1) {
    const offset = (i - count / 2) * strokeSize * 1.35;
    const bend = Math.sin((cell.index + i + world.seed) * 1.17) * strokeSize * 0.72;
    const length = strokeSize * (2.2 + ridge * 2.0);

    context.beginPath();
    context.moveTo(point.x - length * 0.5, point.y + offset * 0.26 + bend);
    context.quadraticCurveTo(
      point.x,
      point.y + offset * 0.10 - bend,
      point.x + length * 0.5,
      point.y + offset * 0.26 + bend * 0.4
    );
    context.stroke();
  }

  context.restore();
}

function drawCells(context, world, cells, radius, centerX, centerY, yaw, pitch, zoom) {
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY, yaw, pitch, zoom);
    if (!point) continue;

    projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  context.save();

  context.beginPath();
  context.arc(centerX, centerY, radius * zoom * 0.998, 0, Math.PI * 2);
  context.clip();

  let painted = 0;

  for (const { cell, point } of projected) {
    const baseSize = radius * 0.066 * (0.72 + point.z * 0.38) * zoom;
    const color = colorForCell(world, cell);
    const elevationLift = clamp(cell.elevation / 5000, -0.2, 0.24);
    const depthDarken = cell.depth > 0 ? clamp(cell.depth / 5600, 0, 1) * 0.18 : 0;
    const light = point.light + elevationLift;

    context.beginPath();

    if (cell.kind === "relief") {
      context.globalAlpha = 0.89;
      context.moveTo(point.x, point.y - baseSize * 0.80);
      context.lineTo(point.x + baseSize * 0.72, point.y - baseSize * 0.18);
      context.lineTo(point.x + baseSize * 0.50, point.y + baseSize * 0.60);
      context.lineTo(point.x - baseSize * 0.54, point.y + baseSize * 0.50);
      context.lineTo(point.x - baseSize * 0.74, point.y - baseSize * 0.14);
      context.closePath();
    } else if (cell.kind === "coast" || cell.kind === "shelf") {
      context.globalAlpha = cell.kind === "coast" ? 0.86 : 0.45;
      context.ellipse(point.x, point.y, baseSize * 0.80, baseSize * 0.48, 0.10, 0, Math.PI * 2);
    } else if (cell.kind === "ice") {
      context.globalAlpha = 0.92;
      context.ellipse(point.x, point.y, baseSize * 0.68, baseSize * 0.50, 0.04, 0, Math.PI * 2);
    } else if (cell.kind === "deep-ocean" || cell.kind === "ocean") {
      context.globalAlpha = cell.kind === "deep-ocean" ? 0.44 : 0.48;
      context.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.02, 0, Math.PI * 2);
    } else {
      context.globalAlpha = 0.83;
      context.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.08, 0, Math.PI * 2);
    }

    context.fillStyle = shade(color, light, 0, depthDarken);
    context.fill();

    if (cell.kind !== "deep-ocean" && cell.kind !== "ocean") {
      context.globalAlpha = cell.kind === "coast"
        ? 0.50
        : cell.kind === "relief"
          ? 0.42
          : cell.kind === "ice"
            ? 0.36
            : 0.20;

      context.strokeStyle = cell.kind === "coast" || cell.kind === "shelf"
        ? "rgba(255,235,170,.74)"
        : cell.kind === "ice"
          ? "rgba(240,252,255,.58)"
          : "rgba(255,236,178,.35)";

      context.lineWidth = Math.max(0.7, radius * 0.0025);
      context.stroke();
    }

    drawCellTexture(context, world, cell, point, radius, baseSize);
    painted += 1;
  }

  context.restore();

  return painted;
}

function drawAtmosphere(context, world, radius, centerX, centerY, zoom) {
  const r = radius * zoom;

  context.save();

  const highlight = context.createRadialGradient(
    centerX - r * 0.34,
    centerY - r * 0.36,
    r * 0.08,
    centerX,
    centerY,
    r * 1.08
  );

  highlight.addColorStop(0, "rgba(255,238,184,.24)");
  highlight.addColorStop(0.34, `${world.glow}`);
  highlight.addColorStop(0.74, "rgba(0,0,0,.02)");
  highlight.addColorStop(1, "rgba(0,0,0,.54)");

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.fillStyle = highlight;
  context.fill();

  const terminator = context.createLinearGradient(centerX - r, centerY, centerX + r, centerY);
  terminator.addColorStop(0, "rgba(255,235,175,.05)");
  terminator.addColorStop(0.45, "rgba(0,0,0,0)");
  terminator.addColorStop(0.78, "rgba(0,0,0,.34)");
  terminator.addColorStop(1, "rgba(0,0,0,.64)");

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.fillStyle = terminator;
  context.fill();

  context.beginPath();
  context.arc(centerX, centerY, r * 1.018, 0, Math.PI * 2);
  context.strokeStyle = world.glow;
  context.lineWidth = Math.max(10, radius * 0.030);
  context.stroke();

  context.restore();
}

function drawTitle(context, width, height, world, compact) {
  if (compact) return;

  context.save();

  context.fillStyle = "rgba(246,211,123,.94)";
  context.font = `${Math.max(22, width * 0.034)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.textAlign = "center";
  context.fillText(world.name, width / 2, height * 0.075);

  context.fillStyle = "rgba(243,227,189,.74)";
  context.font = `${Math.max(13, width * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.fillText("Inspection display · drag to rotate", width / 2, height * 0.108);

  context.restore();
}

function renderPlanet(canvas, context, world, view, compact = false) {
  if (!canvas || !context || !world) return 0;

  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) * (compact ? 0.34 : 0.35);
  const centerX = width * 0.5;
  const centerY = height * (compact ? 0.50 : 0.52);
  const zoom = clamp(view.zoom || 1, 0.78, 1.58);

  const cells = buildWorldCells(world);

  clearScene(context, width, height, world);
  drawGlobeBase(context, width, height, world, radius, centerX, centerY, zoom);
  const painted = drawCells(context, world, cells, radius, centerX, centerY, view.yaw || 0, view.pitch || 0, zoom);
  drawAtmosphere(context, world, radius, centerX, centerY, zoom);
  drawTitle(context, width, height, world, compact);

  return painted;
}

function metaBlock(label, value) {
  const span = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = label;
  span.appendChild(strong);
  span.append(value);
  return span;
}

function updateDisplayMeta(world, painted) {
  if (nodes.displayTitle) nodes.displayTitle.textContent = world.name;
  if (nodes.displayCopy) nodes.displayCopy.textContent = world.label;
  if (nodes.inspectSelected) nodes.inspectSelected.href = world.route;

  if (nodes.displayMeta) {
    nodes.displayMeta.replaceChildren(
      metaBlock("Layer", "Inspection-heavy display case"),
      metaBlock("Touch", "Drag / rotate / zoom"),
      metaBlock("Source", "Showcase planet renderer"),
      metaBlock("Cells", `${painted}/${TOTAL_CELLS} visible-pass candidate`)
    );
  }

  for (const [key, card] of nodes.cards.entries()) {
    const selected = key === world.key;
    card.setAttribute("aria-selected", String(selected));
    card.dataset.activeDisplay = String(selected);
    card.style.transform = "none";
  }
}

function renderDisplay() {
  const world = worldByKey(state.activeWorldKey);

  if (!nodes.displayCanvas || !nodes.displayContext) {
    ensureDisplayCanvas();
  }

  const painted = renderPlanet(
    nodes.displayCanvas,
    nodes.displayContext,
    world,
    {
      yaw: state.yaw,
      pitch: state.pitch,
      zoom: state.zoom
    },
    false
  );

  updateDisplayMeta(world, painted);
  stampDocument(world, painted);

  return painted;
}

function renderPreviews() {
  for (const world of WORLDS) {
    const preview = nodes.previews.get(world.key);
    if (!preview?.canvas || !preview?.context) continue;

    setupCanvas(preview.canvas, 220);

    renderPlanet(
      preview.canvas,
      preview.context,
      world,
      {
        yaw: state.previewYaw + WORLDS.indexOf(world) * 34,
        pitch: 9,
        zoom: 1
      },
      true
    );
  }
}

function selectWorld(key) {
  const world = worldByKey(key);

  state.activeWorldKey = world.key;
  state.yaw = -18;
  state.pitch = 8;
  state.zoom = 1;

  renderDisplay();
}

function wireCards() {
  for (const [key, card] of nodes.cards.entries()) {
    if (card.dataset.showroomSelfContainedBound === "true") continue;

    card.dataset.showroomSelfContainedBound = "true";

    card.addEventListener("click", () => {
      selectWorld(key);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectWorld(key);
    });
  }
}

function wireDisplayDrag() {
  const target = nodes.displayCanvas || nodes.displayWindow;
  if (!target || target.dataset.showroomSelfContainedDragBound === "true") return;

  target.dataset.showroomSelfContainedDragBound = "true";
  target.style.touchAction = "none";

  target.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartYaw = state.yaw;
    state.dragStartPitch = state.pitch;

    target.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  target.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.dragStartX;
    const dy = event.clientY - state.dragStartY;

    state.yaw = state.dragStartYaw + dx * 0.42;
    state.pitch = clamp(state.dragStartPitch - dy * 0.30, -64, 64);

    renderDisplay();
    event.preventDefault();
  }, { passive: false });

  const finish = (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    target.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  target.addEventListener("pointerup", finish, { passive: false });
  target.addEventListener("pointercancel", finish, { passive: false });

  target.addEventListener("wheel", (event) => {
    state.zoom = clamp(state.zoom + (event.deltaY < 0 ? 0.08 : -0.08), 0.78, 1.58);
    renderDisplay();
    event.preventDefault();
  }, { passive: false });
}

function animationLoop() {
  if (!state.active) return;

  if (!state.reducedMotion) {
    state.previewYaw += 0.32;
  }

  renderPreviews();

  if (!state.reducedMotion) {
    state.raf = window.requestAnimationFrame(animationLoop);
  }
}

function stampDocument(world, painted = 0) {
  const root = document.documentElement;

  root.dataset.routeReceipt = CONTRACT;
  root.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  root.dataset.htmlExpected = HTML_EXPECTED;
  root.dataset.showroomMode = SHOWROOM_MODE;
  root.dataset.displayCaseMode = DISPLAY_CASE_MODE;
  root.dataset.globeShowcaseSelfContainedInspection = "true";
  root.dataset.activeDisplay = world.key;
  root.dataset.activeInspectionRoute = world.route;
  root.dataset.touchDragInspection = "true";
  root.dataset.actualPlanetFigureVisible = "true";
  root.dataset.displayCellsPainted = String(painted);
  root.dataset.totalCells = String(TOTAL_CELLS);

  root.dataset.groundLevelReady = String(GROUND_LEVEL_READY);
  root.dataset.manorPlacementReady = String(MANOR_PLACEMENT_READY);
  root.dataset.estatePlacementReady = String(ESTATE_PLACEMENT_READY);

  root.dataset.parentMutationAuthorized = String(PARENT_MUTATION_AUTHORIZED);
  root.dataset.visibleDiagnostics = "false";
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
}

function getShowroomGlobeShowcaseStatus() {
  const world = worldByKey(state.activeWorldKey);

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlExpected: HTML_EXPECTED,

    showroomMode: SHOWROOM_MODE,
    displayCaseMode: DISPLAY_CASE_MODE,

    activeDisplay: world.key,
    activeDisplayName: world.name,
    activeInspectionRoute: world.route,

    actualPlanetFigureVisible: true,
    selfContainedRenderer: true,
    importedHEarthCanvasDependency: false,
    touchDragInspection: true,

    totalCells: TOTAL_CELLS,
    grid: `${GRID}x${GRID}`,

    yaw: state.yaw,
    pitch: state.pitch,
    zoom: state.zoom,

    groundLevelReady: GROUND_LEVEL_READY,
    manorPlacementReady: MANOR_PLACEMENT_READY,
    estatePlacementReady: ESTATE_PLACEMENT_READY,

    parentMutationAuthorized: PARENT_MUTATION_AUTHORIZED,
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    selectWorld,
    renderDisplay,
    status: getShowroomGlobeShowcaseStatus,
    getStatus: getShowroomGlobeShowcaseStatus,
    getShowroomGlobeShowcaseStatus
  };

  window.DGBShowroomGlobeShowcase = api;
  window.ShowroomGlobeShowcase = api;
  window.SHOWROOM_GLOBE_SHOWCASE_RECEIPT = CONTRACT;
}

function boot() {
  collectNodes();
  exposeApi();
  wireCards();
  wireDisplayDrag();
  renderPreviews();
  selectWorld(DEFAULT_DISPLAY);

  if (state.raf) window.cancelAnimationFrame(state.raf);

  if (state.reducedMotion) {
    animationLoop();
  } else {
    state.raf = window.requestAnimationFrame(animationLoop);
  }
}

window.addEventListener("resize", () => {
  collectNodes();
  renderPreviews();
  renderDisplay();
  wireDisplayDrag();
}, { passive: true });

document.addEventListener("visibilitychange", () => {
  state.active = document.visibilityState !== "hidden";

  if (!state.active && state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  if (state.active && !state.raf) {
    state.raf = window.requestAnimationFrame(animationLoop);
  }
}, { passive: true });

stampDocument(worldByKey(DEFAULT_DISPLAY), 0);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  HTML_EXPECTED,
  SHOWROOM_MODE,
  DISPLAY_CASE_MODE,
  DEFAULT_DISPLAY,
  TOTAL_CELLS,
  GRID,
  PARENT_MUTATION_AUTHORIZED,
  GENERATED_IMAGE,
  GRAPHIC_BOX,
  VISUAL_PASS_CLAIM,
  selectWorld,
  renderDisplay,
  getShowroomGlobeShowcaseStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  selectWorld,
  renderDisplay,
  status: getShowroomGlobeShowcaseStatus,
  getStatus: getShowroomGlobeShowcaseStatus,
  getShowroomGlobeShowcaseStatus
};
