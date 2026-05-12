// /showroom/globe/index.js
// SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_SURFACE_REFINEMENT_TNT_v2
// Full-file replacement.
//
// Purpose:
// - Keep the /showroom/globe/ page inspection-heavy.
// - Preserve drag / rotate / zoom.
// - Preserve the 256 field under the hood.
// - Preserve self-contained Showcase renderer.
// - Reduce visible node/dot pattern.
// - Reduce explicit system-overlay read.
// - Increase landmass definition, coastline shaping, ocean depth, terrain contrast,
//   and cloud/atmosphere softness.
// - Keep diagnostics backstage.
// - Do not import the H-Earth canvas module.
// - Do not mutate parent truth.
// - Do not use image generation.
// - Do not use GraphicBox.
// - Do not claim visual pass.

const CONTRACT = "SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_SURFACE_REFINEMENT_TNT_v2";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_INSPECTION_DISPLAY_TNT_v1";
const HTML_EXPECTED = "SHOWROOM_GLOBE_SELF_CONTAINED_PLANET_INSPECTION_DISPLAY_HTML_TNT_v1";

const SHOWROOM_MODE = "showcase-bookcase-display-case";
const DISPLAY_CASE_MODE = "self-contained-inspection-heavy-surface-refined";
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
    seed: 101,
    oceanBase: "#0c4b82",
    oceanDeep: "#031226",
    oceanLight: "#2b93c2",
    land: "#5f8d4b",
    forest: "#2f6b3b",
    coast: "#d1b579",
    relief: "#8f8b7e",
    ice: "#e6f5f8",
    cloud: "rgba(235,248,255,0.26)",
    glow: "rgba(142,190,255,0.34)",
    landBias: 0.46
  },
  {
    key: "h-earth",
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    label: "Hybrid Earth. Active orbital/aerial build planet.",
    seed: 256,
    oceanBase: "#0a3764",
    oceanDeep: "#020d22",
    oceanLight: "#2b91a8",
    land: "#6f9b55",
    forest: "#2f6f40",
    coast: "#d7bd7d",
    relief: "#9a8f69",
    ice: "#d9f0f5",
    cloud: "rgba(235,248,255,0.24)",
    glow: "rgba(143,240,195,0.34)",
    landBias: 0.54
  },
  {
    key: "hearth",
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    label: "Separate terrain lane.",
    seed: 377,
    oceanBase: "#173c56",
    oceanDeep: "#06111d",
    oceanLight: "#417d95",
    land: "#9b7647",
    forest: "#746b3d",
    coast: "#d0a66e",
    relief: "#aa5f45",
    ice: "#d6e6e9",
    cloud: "rgba(245,235,210,0.20)",
    glow: "rgba(244,191,96,0.30)",
    landBias: 0.50
  },
  {
    key: "audralia",
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    label: "Constructed-world lane.",
    seed: 610,
    oceanBase: "#0f456f",
    oceanDeep: "#041225",
    oceanLight: "#3b9bb2",
    land: "#819f58",
    forest: "#436f3e",
    coast: "#c9aa6e",
    relief: "#8f6d54",
    ice: "#cfe8ee",
    cloud: "rgba(235,242,255,0.22)",
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

function worldByKey(key) {
  return WORLDS.find((world) => world.key === key) || WORLDS.find((world) => world.key === DEFAULT_DISPLAY);
}

function byId(id) {
  return document.getElementById(id);
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
  if (document.getElementById("showroom-globe-surface-refinement-style-v2")) return;

  const style = document.createElement("style");
  style.id = "showroom-globe-surface-refinement-style-v2";
  style.textContent = `
    html[data-globe-showcase-surface-refined="true"] {
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

    [data-world-card] {
      transform: none !important;
    }
  `;

  document.head.appendChild(style);
}

function collectNodes() {
  ensureStyle();

  nodes.displayWindow =
    document.querySelector(".display-window") ||
    document.querySelector("[data-display-window]") ||
    byId("displayWindow");

  nodes.displayCanvas = byId("displayCanvas") || document.querySelector("[data-display-case-canvas]");

  if (nodes.displayWindow && nodes.displayCanvas && !nodes.displayWindow.contains(nodes.displayCanvas)) {
    nodes.displayWindow.replaceChildren(nodes.displayCanvas);
  }

  nodes.displayContext = setupCanvas(nodes.displayCanvas, 880);

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
  const diagonal = Math.sin(row * 0.74 + col * 0.52 + world.seed * 0.011);
  const continentalArc = Math.cos((row - 8) * 0.48 + Math.sin(col * 0.62 + world.seed * 0.007));
  const noise = hashUnit(index, world.seed);

  const landSignal =
    lonWaveA * 0.40 +
    lonWaveB * 0.24 +
    diagonal * 0.18 +
    continentalArc * 0.28 +
    latWave * 0.12 +
    (noise - 0.5) * 0.38;

  if (latitude > 67 || latitude < -66) {
    return noise > 0.34 ? "ice" : "ocean";
  }

  if (landSignal > world.landBias + 0.30) {
    if (noise > 0.70) return "relief";
    if (noise < 0.24) return "forest";
    return "land";
  }

  if (landSignal > world.landBias + 0.08) {
    return noise > 0.40 ? "coast" : "shelf";
  }

  if (landSignal > world.landBias - 0.05) {
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
      depth = 2600 + noiseA * 3400;
      elevation = -depth;
    } else if (kind === "ocean") {
      depth = 650 + noiseA * 2100;
      elevation = -depth;
    } else if (kind === "shelf") {
      depth = 25 + noiseA * 150;
      elevation = -depth;
    } else if (kind === "coast") {
      elevation = 2 + noiseA * 58;
    } else if (kind === "relief") {
      elevation = 900 + noiseA * 3600;
    } else if (kind === "ice") {
      elevation = 1200 + noiseA * 3200;
    } else if (kind === "forest") {
      elevation = 40 + noiseA * 680;
    } else {
      elevation = 20 + noiseA * 520;
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
  context.globalAlpha = 0.48;

  for (let i = 0; i < 92; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const radius = 0.55 + ((i * 7) % 11) / 18;

    context.beginPath();
    context.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.58)" : "rgba(225,238,255,.48)";
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

  if (z < -0.10) return null;

  return {
    x: centerX + x * radius * zoom,
    y: centerY - y * radius * 0.98 * zoom,
    z,
    light: clamp(0.50 + z * 0.44 + y * 0.12 - x * 0.07, 0.20, 1.12)
  };
}

function drawGlobeBase(context, world, radius, centerX, centerY, zoom) {
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

  ocean.addColorStop(0, shade(world.oceanLight, 1.34));
  ocean.addColorStop(0.32, world.oceanBase);
  ocean.addColorStop(0.70, shade(world.oceanDeep, 0.70));
  ocean.addColorStop(1, "#020b1c");

  context.fillStyle = ocean;
  context.fillRect(centerX - r * 1.2, centerY - r * 1.2, r * 2.4, r * 2.4);

  context.restore();

  context.save();

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.strokeStyle = "rgba(183,222,240,.28)";
  context.lineWidth = Math.max(2, radius * 0.011);
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, r * 1.014, 0, Math.PI * 2);
  context.strokeStyle = world.glow;
  context.lineWidth = Math.max(9, radius * 0.034);
  context.stroke();

  context.restore();
}

function drawSoftBlob(context, x, y, rx, ry, rotation, fillStyle, alpha, wobbleSeed) {
  const points = 10;

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = fillStyle;
  context.beginPath();

  for (let i = 0; i <= points; i += 1) {
    const t = (i / points) * Math.PI * 2;
    const wobble = 0.82 + hashUnit(i, wobbleSeed) * 0.34;
    const localX = Math.cos(t) * rx * wobble;
    const localY = Math.sin(t) * ry * wobble;
    const px = x + localX * Math.cos(rotation) - localY * Math.sin(rotation);
    const py = y + localX * Math.sin(rotation) + localY * Math.cos(rotation);

    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }

  context.closePath();
  context.fill();
  context.restore();
}

function drawOceanDepth(context, world, projected, radius) {
  context.save();
  context.filter = "blur(1.2px)";

  for (const { cell, point } of projected) {
    if (cell.kind !== "deep-ocean" && cell.kind !== "ocean" && cell.kind !== "shelf") continue;

    const depthRatio = clamp(cell.depth / 6000, 0.04, 1);
    const size = radius * (0.08 + depthRatio * 0.08) * (0.68 + point.z * 0.36);

    context.globalAlpha = cell.kind === "shelf" ? 0.08 : 0.12 + depthRatio * 0.18;
    context.fillStyle = cell.kind === "deep-ocean" ? "rgba(0,5,20,0.88)" : "rgba(2,18,45,0.62)";

    context.beginPath();
    context.ellipse(point.x, point.y, size * 1.45, size * 0.82, cell.noiseA * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  context.filter = "none";
  context.restore();
}

function drawSurfaceMasses(context, world, projected, radius, zoom) {
  context.save();

  context.beginPath();
  const centerX = context.canvas.width * 0.5;
  const centerY = context.canvas.height * 0.52;
  context.arc(centerX, centerY, radius * zoom * 0.998, 0, Math.PI * 2);
  context.clip();

  drawOceanDepth(context, world, projected, radius);

  context.filter = "blur(0.6px)";

  let painted = 0;

  for (const { cell, point } of projected) {
    const baseColor = colorForCell(world, cell);

    const elevationLift = clamp(cell.elevation / 5200, -0.18, 0.26);
    const depthDarken = cell.depth > 0 ? clamp(cell.depth / 6200, 0, 1) * 0.16 : 0;
    const light = point.light + elevationLift;
    const color = shade(baseColor, light, 0, depthDarken);

    const frontScale = 0.72 + point.z * 0.40;
    let sizeX = radius * 0.095 * frontScale * zoom;
    let sizeY = radius * 0.055 * frontScale * zoom;
    let alpha = 0.22;

    if (cell.kind === "deep-ocean") {
      sizeX *= 1.15;
      sizeY *= 0.80;
      alpha = 0.15;
    } else if (cell.kind === "ocean") {
      sizeX *= 1.05;
      sizeY *= 0.76;
      alpha = 0.17;
    } else if (cell.kind === "shelf") {
      sizeX *= 1.16;
      sizeY *= 0.82;
      alpha = 0.26;
    } else if (cell.kind === "coast") {
      sizeX *= 1.22;
      sizeY *= 0.76;
      alpha = 0.58;
    } else if (cell.kind === "relief") {
      sizeX *= 1.00;
      sizeY *= 0.84;
      alpha = 0.78;
    } else if (cell.kind === "ice") {
      sizeX *= 1.10;
      sizeY *= 0.70;
      alpha = 0.78;
    } else {
      sizeX *= 1.16;
      sizeY *= 0.82;
      alpha = cell.kind === "forest" ? 0.72 : 0.68;
    }

    const rotation = (cell.noiseA - 0.5) * 0.9;

    drawSoftBlob(
      context,
      point.x,
      point.y,
      sizeX,
      sizeY,
      rotation,
      color,
      clamp(alpha + point.z * 0.08, 0.10, 0.88),
      cell.index + world.seed
    );

    painted += 1;
  }

  context.filter = "none";
  context.restore();

  return painted;
}

function drawCoastlines(context, world, projected, radius, zoom) {
  context.save();

  context.beginPath();
  const centerX = context.canvas.width * 0.5;
  const centerY = context.canvas.height * 0.52;
  context.arc(centerX, centerY, radius * zoom * 0.998, 0, Math.PI * 2);
  context.clip();

  context.lineCap = "round";
  context.lineJoin = "round";

  for (const { cell, point } of projected) {
    if (cell.kind !== "coast" && cell.kind !== "shelf") continue;

    const frontScale = 0.72 + point.z * 0.40;
    const size = radius * 0.070 * frontScale * zoom;
    const arc = Math.PI * (0.75 + cell.noiseA * 0.74);
    const start = cell.noiseB * Math.PI * 2;

    context.beginPath();
    context.strokeStyle = cell.kind === "coast"
      ? "rgba(255,230,160,0.62)"
      : "rgba(130,230,220,0.34)";
    context.globalAlpha = cell.kind === "coast" ? 0.52 : 0.28;
    context.lineWidth = Math.max(1.0, radius * 0.0032);
    context.ellipse(point.x, point.y, size * 1.26, size * 0.66, cell.noiseA * 1.6, start, start + arc);
    context.stroke();
  }

  context.restore();
}

function drawReliefAndTerrain(context, world, projected, radius, zoom) {
  context.save();

  context.beginPath();
  const centerX = context.canvas.width * 0.5;
  const centerY = context.canvas.height * 0.52;
  context.arc(centerX, centerY, radius * zoom * 0.998, 0, Math.PI * 2);
  context.clip();

  for (const { cell, point } of projected) {
    if (cell.kind !== "relief" && cell.kind !== "forest" && cell.kind !== "land") continue;

    const frontScale = 0.72 + point.z * 0.40;
    const size = radius * 0.052 * frontScale * zoom;
    const lineCount = cell.kind === "relief" ? 4 : 2;

    context.save();
    context.globalAlpha = cell.kind === "relief" ? 0.26 : 0.11;
    context.strokeStyle = cell.kind === "relief"
      ? "rgba(255,245,210,0.68)"
      : "rgba(35,70,38,0.62)";
    context.lineWidth = Math.max(0.8, radius * 0.0017);

    for (let i = 0; i < lineCount; i += 1) {
      const offset = (i - lineCount / 2) * size * 0.32;
      const bend = Math.sin((cell.index + i) * 0.91) * size * 0.24;

      context.beginPath();
      context.moveTo(point.x - size * 0.9, point.y + offset + bend);
      context.quadraticCurveTo(
        point.x,
        point.y + offset - bend,
        point.x + size * 0.9,
        point.y + offset + bend * 0.5
      );
      context.stroke();
    }

    context.restore();
  }

  context.restore();
}

function drawClouds(context, world, radius, centerX, centerY, yaw, pitch, zoom, compact) {
  if (compact) return;

  context.save();

  context.beginPath();
  context.arc(centerX, centerY, radius * zoom * 1.002, 0, Math.PI * 2);
  context.clip();

  context.filter = "blur(2px)";
  context.globalAlpha = 0.55;

  for (let i = 0; i < 16; i += 1) {
    const lat = -58 + i * 7.9 + Math.sin(i * 1.7 + world.seed) * 8;
    const lon = -180 + i * 28 + Math.cos(i * 1.3 + world.seed) * 24;
    const pseudoCell = { latitude: lat, longitude: lon, index: i, kind: "cloud" };
    const point = projectCell(pseudoCell, radius, centerX, centerY, yaw + 12, pitch, zoom);
    if (!point) continue;

    const size = radius * (0.050 + hashUnit(i, world.seed + 881) * 0.048) * (0.74 + point.z * 0.32);

    context.fillStyle = world.cloud;
    context.beginPath();
    context.ellipse(
      point.x,
      point.y,
      size * (1.8 + hashUnit(i, world.seed + 2)),
      size * (0.45 + hashUnit(i, world.seed + 3) * 0.34),
      hashUnit(i, world.seed + 4) * Math.PI,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  context.filter = "none";
  context.restore();
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
  highlight.addColorStop(0.34, world.glow);
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
  const yaw = view.yaw || 0;
  const pitch = view.pitch || 0;

  const cells = buildWorldCells(world);
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY, yaw, pitch, zoom);
    if (!point) continue;
    projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  clearScene(context, width, height, world);
  drawGlobeBase(context, world, radius, centerX, centerY, zoom);

  const painted = drawSurfaceMasses(context, world, projected, radius, zoom);

  drawCoastlines(context, world, projected, radius, zoom);
  drawReliefAndTerrain(context, world, projected, radius, zoom);
  drawClouds(context, world, radius, centerX, centerY, yaw, pitch, zoom, compact);
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
      metaBlock("Source", "Self-contained surface renderer"),
      metaBlock("Field", `256 under hood · ${painted} projected`)
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

  nodes.displayContext = setupCanvas(nodes.displayCanvas, 880);

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

    preview.context = setupCanvas(preview.canvas, 220);

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
    if (card.dataset.showroomSurfaceRefinedBound === "true") continue;

    card.dataset.showroomSurfaceRefinedBound = "true";

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
  if (!target || target.dataset.showroomSurfaceRefinedDragBound === "true") return;

  target.dataset.showroomSurfaceRefinedDragBound = "true";
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
    state.previewYaw += 0.30;
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
  root.dataset.globeShowcaseSurfaceRefined = "true";
  root.dataset.activeDisplay = world.key;
  root.dataset.activeInspectionRoute = world.route;
  root.dataset.touchDragInspection = "true";
  root.dataset.actualPlanetFigureVisible = "true";
  root.dataset.visibleDotPatternReduced = "true";
  root.dataset.explicitNodeOverlayReduced = "true";
  root.dataset.landmassDefinitionIncreased = "true";
  root.dataset.coastlineShapingIncreased = "true";
  root.dataset.oceanDepthIncreased = "true";
  root.dataset.terrainContrastIncreased = "true";
  root.dataset.cloudAtmosphereSoftnessIncreased = "true";
  root.dataset.displayCellsProjected = String(painted);
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

    visibleDotPatternReduced: true,
    explicitNodeOverlayReduced: true,
    landmassDefinitionIncreased: true,
    coastlineShapingIncreased: true,
    oceanDepthIncreased: true,
    terrainContrastIncreased: true,
    cloudAtmosphereSoftnessIncreased: true,

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
