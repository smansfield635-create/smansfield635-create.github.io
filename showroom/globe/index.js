// /showroom/globe/index.js
// H_EARTH_LEAP_RENDER_CONSUMPTION_TNT_v1
// Full-file replacement.
// Globe Showcase display-case renderer only.
//
// LEAP:
// - Learn: the gap is renderer consumption, not parent truth or gauges.
// - Evidence: elevation.sea-level.js and detail.js exist as terrain children.
// - Assemble: consume those children inside the active H-Earth display renderer.
// - Progress: render H-Earth with definitive land/state/elevation/detail influence.
//
// Purpose:
// - Keep /showroom/globe/ as showcase/bookcase/display-case layer.
// - Keep H-Earth as default display-case selection.
// - Preserve touch-drag inspection.
// - Consume H-Earth terrain elevation child.
// - Consume H-Earth terrain detail child.
// - Improve visible terrain definition without parent mutation.
// - Keep ground level, manor placement, and estate placement held.

import {
  createHEarthCanvasTerrainElevation,
  sampleElevationForTerrainDetail,
  getHEarthCanvasTerrainElevationStatus
} from "/assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js";

import {
  createHEarthCanvasTerrainDetail,
  sampleTerrainDetail,
  getHEarthCanvasTerrainDetailStatus
} from "/assets/h-earth/h-earth/canvas/terrain/detail.js";

const CONTRACT = "H_EARTH_LEAP_RENDER_CONSUMPTION_TNT_v1";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_DISPLAY_CASE_TOUCH_INSPECTION_ROUTE_TNT_v21";
const HTML_CONTRACT = "SHOWROOM_GLOBE_SHOWCASE_BOOKCASE_DISPLAY_CASE_HTML_TNT_v20B";
const PAIR_CONTRACT = "SHOWROOM_COVER_GLOBE_SHOWCASE_DISPLAY_CASE_PAIR_TNT_v20";

const TERRAIN_ELEVATION_CONTRACT =
  "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_DETAIL_BINDING_CHILD_TNT_v2";
const TERRAIN_DETAIL_CONTRACT =
  "H_EARTH_G1_CANVAS_TERRAIN_DETAIL_CHILD_TNT_v1";

const SHOWROOM_MODE = "showcase-bookcase-display-case";
const DEFAULT_DISPLAY = "h-earth";
const CARD_TRANSFORM = "forbidden";

const DEFINITIVE_LAND_STATE_REQUIRED = true;
const LAND_STATE_CLASSIFICATION_REQUIRED = true;
const ELEVATION_SEA_LEVEL_BOUND = true;
const TERRAIN_DETAIL_CONSUMPTION_ACTIVE = true;

const GROUND_LEVEL_READY = false;
const MANOR_PLACEMENT_READY = false;
const ESTATE_PLACEMENT_READY = false;
const PARENT_MUTATION_AUTHORIZED = false;

const GROUND_LEVEL_HOLD_REASON = "definitive-land-state-required";
const MANOR_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";
const ESTATE_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";

const WORLDS = Object.freeze([
  {
    key: "earth",
    name: "Earth",
    route: "/showroom/globe/earth/",
    label: "Protected reference body.",
    layer: "reference",
    palette: {
      ocean: "#0d4f86",
      land: "#4f7d4b",
      coast: "#c7ad74",
      relief: "#8b8878",
      ice: "#e2f2f6",
      glow: "#8ebeff"
    }
  },
  {
    key: "h-earth",
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    label: "Hybrid Earth. Active orbital/aerial build planet.",
    layer: "active-build",
    palette: {
      ocean: "#0b315f",
      land: "#6f9854",
      coast: "#d2b77b",
      relief: "#908866",
      ice: "#d8edf4",
      glow: "#8ff0c3"
    }
  },
  {
    key: "hearth",
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    label: "Separate terrain lane.",
    layer: "regression",
    palette: {
      ocean: "#173c56",
      land: "#8f7144",
      coast: "#d0a66e",
      relief: "#a35f45",
      ice: "#d6e6e9",
      glow: "#f4bf60"
    }
  },
  {
    key: "audralia",
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    label: "Constructed-world lane.",
    layer: "constructed-world",
    palette: {
      ocean: "#0f456f",
      land: "#7fa05a",
      coast: "#c9aa6e",
      relief: "#8f6d54",
      ice: "#cfe8ee",
      glow: "#b8a6ff"
    }
  }
]);

const BASE_REGIONS = Object.freeze([
  {
    index: 9,
    lat: 58,
    lon: -130,
    rx: 0.22,
    ry: 0.07,
    kind: "ice",
    material: "glacier-ice"
  },
  {
    index: 38,
    lat: 42,
    lon: -92,
    rx: 0.23,
    ry: 0.10,
    kind: "land",
    material: "forest-ground"
  },
  {
    index: 61,
    lat: 21,
    lon: -62,
    rx: 0.17,
    ry: 0.08,
    kind: "coast",
    material: "beach-sediment"
  },
  {
    index: 86,
    lat: 8,
    lon: -18,
    rx: 0.20,
    ry: 0.11,
    kind: "land",
    material: "lowland-ground"
  },
  {
    index: 104,
    lat: -12,
    lon: 28,
    rx: 0.19,
    ry: 0.09,
    kind: "relief",
    material: "highland-ground"
  },
  {
    index: 121,
    lat: -26,
    lon: 74,
    rx: 0.18,
    ry: 0.08,
    kind: "land",
    material: "grassland-ground"
  },
  {
    index: 144,
    lat: -46,
    lon: 118,
    rx: 0.22,
    ry: 0.08,
    kind: "coast",
    material: "coastal-shelf-ground"
  },
  {
    index: 73,
    lat: 31,
    lon: 146,
    rx: 0.17,
    ry: 0.07,
    kind: "relief",
    material: "ridge-ground"
  },
  {
    index: 218,
    lat: -62,
    lon: -18,
    rx: 0.25,
    ry: 0.06,
    kind: "ice",
    material: "ice-cap"
  },
  {
    index: 96,
    lat: 4,
    lon: -154,
    rx: 0.10,
    ry: 0.04,
    kind: "island",
    material: "island-ground"
  },
  {
    index: 176,
    lat: -34,
    lon: -132,
    rx: 0.11,
    ry: 0.04,
    kind: "island",
    material: "archipelago-ground"
  },
  {
    index: 33,
    lat: 48,
    lon: 24,
    rx: 0.13,
    ry: 0.05,
    kind: "relief",
    material: "mountain-stone"
  },
  {
    index: 118,
    lat: -21,
    lon: -88,
    rx: 0.15,
    ry: 0.06,
    kind: "land",
    material: "valley-ground"
  },
  {
    index: 130,
    lat: -8,
    lon: 164,
    rx: 0.13,
    ry: 0.05,
    kind: "coast",
    material: "coastal-stone"
  }
]);

const H_EARTH_OCEAN_SAMPLES = Object.freeze([
  {
    index: 0,
    lat: 68,
    lon: -20,
    material: "deep-ocean",
    kind: "ocean"
  },
  {
    index: 18,
    lat: 50,
    lon: 64,
    material: "open-ocean",
    kind: "ocean"
  },
  {
    index: 80,
    lat: 12,
    lon: -126,
    material: "coastal-shelf-water",
    kind: "ocean"
  },
  {
    index: 147,
    lat: -28,
    lon: 22,
    material: "basin-mouth-water",
    kind: "ocean"
  },
  {
    index: 242,
    lat: -72,
    lon: 112,
    material: "abyssal-ocean",
    kind: "ocean"
  }
]);

const state = {
  activeWorld: DEFAULT_DISPLAY,
  yaw: -22,
  pitch: 8,
  zoom: 1,
  autoSpin: true,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,
  pointerId: null,
  frame: 0,
  lastFrameAt: 0,
  active: true,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  animationId: null,
  resizeTimer: 0
};

const nodes = {
  displayCanvas: null,
  displayCtx: null,
  displayTitle: null,
  displayCopy: null,
  displayMeta: null,
  inspectSelected: null,
  cards: new Map(),
  previews: new Map()
};

const hEarthTerrainCache = {
  elevation: null,
  detail: null,
  elevationStatus: null,
  detailStatus: null,
  regions: [],
  oceanSamples: [],
  samples: new Map(),
  ready: false,
  error: null
};

function byId(id) {
  return document.getElementById(id);
}

function worldByKey(key) {
  return WORLDS.find((world) => world.key === key) || WORLDS.find((world) => world.key === DEFAULT_DISPLAY);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setupCanvas(canvas, fallback = 600) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(180, Math.floor(rect.width || canvas.clientWidth || fallback));
  const cssHeight = Math.max(180, Math.floor(rect.height || canvas.clientHeight || cssWidth));
  const width = Math.floor(cssWidth * state.dpr);
  const height = Math.floor(cssHeight * state.dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  canvas.style.transform = "none";
  canvas.style.touchAction = "none";
  canvas.dataset.cardTransform = CARD_TRANSFORM;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx;
}

function collectNodes() {
  nodes.displayCanvas = byId("displayCanvas");
  nodes.displayCtx = setupCanvas(nodes.displayCanvas, 720);
  nodes.displayTitle = byId("displayTitle");
  nodes.displayCopy = byId("displayCopy");
  nodes.displayMeta = byId("displayMeta");
  nodes.inspectSelected = byId("inspectSelected");

  nodes.cards.clear();
  document.querySelectorAll("[data-world-card]").forEach((card) => {
    const key = card.getAttribute("data-world-card");
    nodes.cards.set(key, card);
    card.dataset.cardTransform = CARD_TRANSFORM;
    card.style.transform = "none";
  });

  nodes.previews.clear();
  document.querySelectorAll("[data-preview-canvas]").forEach((canvas) => {
    const key = canvas.getAttribute("data-preview-canvas");
    nodes.previews.set(key, { canvas, ctx: setupCanvas(canvas, 220) });
  });
}

function stampDocument(world) {
  const root = document.documentElement;

  root.dataset.routeReceipt = CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.pairReceipt = PAIR_CONTRACT;
  root.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  root.dataset.showroomMode = SHOWROOM_MODE;
  root.dataset.activeDisplay = world.key;
  root.dataset.activeInspectionRoute = world.route;
  root.dataset.displayCaseLayer = "touch-drag-inspection-preview";
  root.dataset.touchDragInspection = "true";
  root.dataset.cardTransform = CARD_TRANSFORM;

  root.dataset.definitiveLandStateRequired = String(DEFINITIVE_LAND_STATE_REQUIRED);
  root.dataset.landStateClassificationRequired = String(LAND_STATE_CLASSIFICATION_REQUIRED);
  root.dataset.elevationSeaLevelBound = String(ELEVATION_SEA_LEVEL_BOUND);
  root.dataset.terrainDetailConsumptionActive = String(TERRAIN_DETAIL_CONSUMPTION_ACTIVE);

  root.dataset.groundLevelReady = String(GROUND_LEVEL_READY);
  root.dataset.manorPlacementReady = String(MANOR_PLACEMENT_READY);
  root.dataset.estatePlacementReady = String(ESTATE_PLACEMENT_READY);
  root.dataset.groundLevelHoldReason = GROUND_LEVEL_HOLD_REASON;
  root.dataset.manorPlacementHoldReason = MANOR_PLACEMENT_HOLD_REASON;
  root.dataset.estatePlacementHoldReason = ESTATE_PLACEMENT_HOLD_REASON;

  root.dataset.terrainElevationContract = TERRAIN_ELEVATION_CONTRACT;
  root.dataset.terrainDetailContract = TERRAIN_DETAIL_CONTRACT;
  root.dataset.terrainDetailCacheReady = String(hEarthTerrainCache.ready);

  root.dataset.parentMutationAuthorized = String(PARENT_MUTATION_AUTHORIZED);
  root.dataset.visibleDiagnostics = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
  root.dataset.visualPassClaim = "false";
}

function metaBlock(label, value) {
  const span = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = label;
  span.appendChild(strong);
  span.append(value);
  return span;
}

function updateDisplay(world) {
  if (nodes.displayTitle) nodes.displayTitle.textContent = world.name;
  if (nodes.displayCopy) nodes.displayCopy.textContent = world.label;
  if (nodes.inspectSelected) nodes.inspectSelected.href = world.route;

  if (nodes.displayMeta) {
    if (world.key === "h-earth") {
      nodes.displayMeta.replaceChildren(
        metaBlock("Layer", "Display case"),
        metaBlock("Selection", world.name),
        metaBlock("Land/state gate", "Definitive orbital read required"),
        metaBlock("Terrain detail", hEarthTerrainCache.ready ? "Child consumption active" : "Child consumption pending")
      );
    } else {
      nodes.displayMeta.replaceChildren(
        metaBlock("Layer", "Display case"),
        metaBlock("Selection", world.name),
        metaBlock("Inspection", world.route)
      );
    }
  }

  for (const [key, card] of nodes.cards.entries()) {
    card.setAttribute("aria-selected", String(key === world.key));
    card.dataset.activeDisplay = String(key === world.key);
    card.style.transform = "none";
  }

  stampDocument(world);
}

function selectWorld(key) {
  const world = worldByKey(key);
  state.activeWorld = world.key;
  state.yaw = world.key === "h-earth" ? -22 : 0;
  state.pitch = world.key === "hearth" ? -8 : 8;
  state.zoom = 1;
  updateDisplay(world);
  drawNow();
}

function normalizeKind(kind) {
  const text = String(kind || "").toLowerCase();
  if (text === "island") return "land";
  if (text === "relief") return "relief";
  if (text === "coast") return "coast";
  if (text === "ice") return "ice";
  if (text === "ocean") return "ocean";
  return "land";
}

function colorFor(world, kind) {
  const normalized = normalizeKind(kind);
  if (normalized === "ice") return world.palette.ice;
  if (normalized === "relief") return world.palette.relief;
  if (normalized === "coast") return world.palette.coast;
  if (normalized === "ocean") return world.palette.ocean;
  return world.palette.land;
}

function shade(hex, light, detail = null) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const lift = detail ? Number(detail.colorLift || 0) : 0;
  const darken = detail ? Number(detail.colorDarken || 0) : 0;
  const adjustedLight = clamp(light + lift - darken, 0.10, 1.45);

  return `rgb(${[
    clamp(Math.round(r * adjustedLight + 10 * (1 - adjustedLight)), 0, 255),
    clamp(Math.round(g * adjustedLight + 10 * (1 - adjustedLight)), 0, 255),
    clamp(Math.round(b * adjustedLight + 10 * (1 - adjustedLight)), 0, 255)
  ].join(",")})`;
}

function project(latDeg, lonDeg, radius, cx, cy, yawDeg, pitchDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = ((lonDeg + yawDeg) * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;

  const x0 = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);

  const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
  const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);
  const x = x0;

  if (z < -0.08) return null;

  return {
    x: cx + x * radius,
    y: cy - y * radius * 0.98,
    z,
    light: clamp(0.52 + z * 0.42 + y * 0.10 - x * 0.06, 0.22, 1)
  };
}

function createDetailInput(region, elevationCell, zoom) {
  return {
    index: region.index,
    row: Math.floor(region.index / 16),
    col: region.index % 16,
    latitude: region.lat,
    longitude: region.lon,
    kind: region.kind,
    material: region.material,
    terrainAspect: elevationCell?.terrainAspect || region.material,
    elevation: typeof elevationCell?.elevationMeters === "number"
      ? clamp(elevationCell.elevationMeters / 5500, -1, 1)
      : undefined,
    elevationRelativeToSeaLevel: typeof elevationCell?.elevationMeters === "number"
      ? clamp(elevationCell.elevationMeters / 5500, -1, 1)
      : undefined,
    distanceToCoast: region.kind === "coast"
      ? 0.04
      : region.kind === "ocean"
        ? 0.38
        : region.kind === "island"
          ? 0.12
          : 0.46,
    zoom,
    seed: "h-earth-leap-render-consumption"
  };
}

function initializeHEarthTerrainCache() {
  if (hEarthTerrainCache.ready || hEarthTerrainCache.error) return hEarthTerrainCache;

  try {
    const elevation = createHEarthCanvasTerrainElevation();
    const detail = createHEarthCanvasTerrainDetail({
      detailScale: 1.25,
      zoom: 1,
      coastHardening: 1.25,
      ridgeStrength: 1.18,
      valleyStrength: 1.12,
      oceanDepthStrength: 1.22,
      iceSoftness: 1.08,
      lowlandBreakup: 1.18,
      mountainRelief: 1.2
    });

    hEarthTerrainCache.elevation = elevation;
    hEarthTerrainCache.detail = detail;
    hEarthTerrainCache.elevationStatus = getHEarthCanvasTerrainElevationStatus();
    hEarthTerrainCache.detailStatus = getHEarthCanvasTerrainDetailStatus();

    hEarthTerrainCache.regions = BASE_REGIONS.map((region) => {
      const elevationCell =
        typeof elevation.sampleElevationForTerrainDetail === "function"
          ? elevation.sampleElevationForTerrainDetail(region.index)
          : sampleElevationForTerrainDetail(region.index);

      const detailInput = createDetailInput(region, elevationCell, 1);

      const sample =
        typeof detail.sampleTerrainDetail === "function"
          ? detail.sampleTerrainDetail(detailInput)
          : sampleTerrainDetail(detailInput);

      hEarthTerrainCache.samples.set(region.index, sample);

      return {
        ...region,
        elevationCell,
        detail: sample
      };
    });

    hEarthTerrainCache.oceanSamples = H_EARTH_OCEAN_SAMPLES.map((region) => {
      const elevationCell =
        typeof elevation.sampleElevationForTerrainDetail === "function"
          ? elevation.sampleElevationForTerrainDetail(region.index)
          : sampleElevationForTerrainDetail(region.index);

      const detailInput = createDetailInput(region, elevationCell, 1);

      const sample =
        typeof detail.sampleTerrainDetail === "function"
          ? detail.sampleTerrainDetail(detailInput)
          : sampleTerrainDetail(detailInput);

      hEarthTerrainCache.samples.set(`ocean-${region.index}`, sample);

      return {
        ...region,
        elevationCell,
        detail: sample
      };
    });

    hEarthTerrainCache.ready = true;
  } catch (error) {
    hEarthTerrainCache.error = error instanceof Error ? error.message : String(error);
    hEarthTerrainCache.ready = false;
  }

  return hEarthTerrainCache;
}

function clearScene(ctx, width, height, world, compact) {
  const bg = ctx.createRadialGradient(width * 0.5, height * 0.46, width * 0.04, width * 0.5, height * 0.5, width * 0.78);
  bg.addColorStop(0, `${world.palette.glow}55`);
  bg.addColorStop(0.40, "#07152b");
  bg.addColorStop(1, "#01030a");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = compact ? 0.42 : 0.58;

  const count = compact ? 34 : 110;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = compact ? 0.8 : 0.65 + ((i * 7) % 11) / 15;

    ctx.beginPath();
    ctx.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.70)" : "rgba(225,238,255,.56)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHEarthOceanDepth(ctx, width, height, radius, cx, cy, yaw, pitch) {
  if (!hEarthTerrainCache.ready) return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.996, 0, Math.PI * 2);
  ctx.clip();

  for (const sample of hEarthTerrainCache.oceanSamples) {
    const point = project(sample.lat, sample.lon, radius, cx, cy, yaw, pitch);
    if (!point) continue;

    const depth = Number(sample.detail?.oceanDepthHint || 0);
    const shadow = Number(sample.detail?.shadowAlpha || 0);
    const size = radius * (0.16 + depth * 0.16) * (0.70 + point.z * 0.32);

    ctx.beginPath();
    ctx.globalAlpha = clamp(0.08 + depth * 0.18 + shadow * 0.08, 0.04, 0.28);
    ctx.fillStyle = "rgba(1, 10, 28, 0.88)";
    ctx.ellipse(point.x, point.y, size * 1.25, size * 0.64, 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDetailTexture(ctx, point, radius, region, compact) {
  if (!region.detail || compact) return;

  const detail = region.detail;
  const grain = Number(detail.grain || 0);
  const ridge = Number(detail.ridge || 0);
  const valley = Number(detail.valley || 0);
  const coast = Number(detail.coastHardness || 0);
  const micro = Number(detail.microVariation?.breakup || detail.microVariation || 0);
  const detailScale = Number(detail.detailScale || 1);

  const size = radius * 0.018 * clamp(detailScale, 0.75, 1.8) * (0.65 + point.z * 0.36);
  const count = Math.max(2, Math.min(7, Math.round(2 + grain * 3 + ridge * 2 + coast * 2)));

  ctx.save();
  ctx.globalAlpha = clamp(0.05 + grain * 0.05 + ridge * 0.06 + coast * 0.08, 0.04, 0.23);
  ctx.strokeStyle = region.kind === "coast"
    ? "rgba(255, 229, 157, 0.72)"
    : region.kind === "relief"
      ? "rgba(255, 242, 205, 0.52)"
      : region.kind === "ice"
        ? "rgba(232, 250, 255, 0.50)"
        : "rgba(255, 235, 180, 0.34)";
  ctx.lineWidth = Math.max(0.7, radius * 0.002);

  for (let i = 0; i < count; i += 1) {
    const offset = (i - count / 2) * size * 1.6;
    const bend = Math.sin((region.index + i) * 1.17 + micro * 4) * size * 0.7;

    ctx.beginPath();
    ctx.moveTo(point.x - size * 1.8, point.y + offset * 0.42 + bend);
    ctx.quadraticCurveTo(point.x, point.y + offset * 0.18 - bend, point.x + size * 1.8, point.y + offset * 0.42 + bend * 0.4);
    ctx.stroke();
  }

  if (valley > 0.18) {
    ctx.globalAlpha = clamp(0.04 + valley * 0.08, 0.03, 0.16);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.62)";
    ctx.beginPath();
    ctx.moveTo(point.x - size * 2.2, point.y + size * 1.2);
    ctx.quadraticCurveTo(point.x, point.y + size * 2.2, point.x + size * 2.2, point.y + size * 0.9);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGlobe(ctx, world, width, height, yaw, pitch, zoom, compact) {
  const isHEarth = world.key === "h-earth";
  const terrain = isHEarth ? initializeHEarthTerrainCache() : null;

  const baseRadius = Math.min(width, height) * (compact ? 0.33 : 0.35);
  const radius = baseRadius * clamp(zoom, 0.78, 1.55);
  const cx = width * 0.5;
  const cy = height * (compact ? 0.5 : 0.52);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.35, radius * 0.08, cx, cy, radius * 1.15);
  ocean.addColorStop(0, shade(world.palette.ocean, isHEarth ? 1.48 : 1.4));
  ocean.addColorStop(0.36, world.palette.ocean);
  ocean.addColorStop(0.74, shade(world.palette.ocean, isHEarth ? 0.46 : 0.52));
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  if (isHEarth) {
    drawHEarthOceanDepth(ctx, width, height, radius, cx, cy, yaw, pitch);
  }

  const sourceRegions = isHEarth && terrain?.ready ? terrain.regions : BASE_REGIONS;
  const projected = [];

  for (const item of sourceRegions) {
    const adjustedLon = item.lon + (isHEarth ? 0 : WORLDS.indexOf(world) * 14);
    const point = project(item.lat, adjustedLon, radius, cx, cy, yaw, pitch);
    if (!point) continue;
    projected.push({ item, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.997, 0, Math.PI * 2);
  ctx.clip();

  for (const { item, point } of projected) {
    const detail = isHEarth ? item.detail : null;

    const ridge = Number(detail?.ridge || 0);
    const valley = Number(detail?.valley || 0);
    const coastHardness = Number(detail?.coastHardness || 0);
    const iceSoftness = Number(detail?.iceSoftness || 0);
    const opacityLift = detail ? Number(detail.highlightAlpha || 0) : 0;

    const detailScale = detail ? clamp(Number(detail.detailScale || 1), 0.72, 1.72) : 1;
    const sizeX = radius * item.rx * (0.75 + point.z * 0.35) * (isHEarth ? 0.94 + detailScale * 0.08 : 1);
    const sizeY = radius * item.ry * (0.75 + point.z * 0.35) * (isHEarth ? 0.94 + detailScale * 0.06 : 1);

    ctx.beginPath();

    if (item.kind === "relief") {
      const peakLift = isHEarth ? 1 + ridge * 0.22 : 1;
      ctx.moveTo(point.x, point.y - sizeY * 1.15 * peakLift);
      ctx.lineTo(point.x + sizeX, point.y - sizeY * 0.18);
      ctx.lineTo(point.x + sizeX * 0.55, point.y + sizeY);
      ctx.lineTo(point.x - sizeX * 0.62, point.y + sizeY * (0.72 + valley * 0.12));
      ctx.lineTo(point.x - sizeX, point.y - sizeY * 0.12);
      ctx.closePath();
    } else {
      const rotation = isHEarth ? 0.12 + Number(detail?.slopeShade || 0) * 0.24 : 0.12;
      ctx.ellipse(point.x, point.y, sizeX, sizeY, rotation, 0, Math.PI * 2);
    }

    const baseAlpha =
      item.kind === "ice"
        ? 0.90 + iceSoftness * 0.04
        : item.kind === "coast"
          ? 0.84 + coastHardness * 0.08
          : item.kind === "relief"
            ? 0.86 + ridge * 0.08
            : 0.84 + opacityLift * 0.15;

    ctx.globalAlpha = clamp(baseAlpha, 0.72, 0.97);
    ctx.fillStyle = shade(colorFor(world, item.kind), point.light, detail);
    ctx.fill();

    ctx.globalAlpha = isHEarth
      ? clamp(0.18 + ridge * 0.18 + coastHardness * 0.24 + valley * 0.08, 0.12, 0.48)
      : 0.22;

    ctx.strokeStyle =
      item.kind === "coast"
        ? "rgba(246,211,123,.72)"
        : item.kind === "relief"
          ? "rgba(255,238,190,.48)"
          : item.kind === "ice"
            ? "rgba(232,250,255,.52)"
            : "rgba(246,234,210,.32)";

    ctx.lineWidth = Math.max(0.8, radius * (isHEarth ? 0.0026 + ridge * 0.0018 + coastHardness * 0.002 : 0.0026));
    ctx.stroke();

    if (isHEarth) {
      drawDetailTexture(ctx, point, radius, item, compact);
    }
  }

  ctx.restore();

  ctx.save();
  const light = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.08, cx, cy, radius * 1.08);
  light.addColorStop(0, "rgba(255,238,184,.22)");
  light.addColorStop(0.36, `${world.palette.glow}18`);
  light.addColorStop(1, "rgba(0,0,0,.50)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = light;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.015, 0, Math.PI * 2);
  ctx.strokeStyle = `${world.palette.glow}55`;
  ctx.lineWidth = Math.max(compact ? 4 : 9, radius * 0.035);
  ctx.stroke();
  ctx.restore();

  if (!compact) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246,211,123,.94)";
    ctx.font = `${Math.max(22, width * 0.032)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText(world.name, width / 2, height * 0.08);

    ctx.fillStyle = "rgba(243,227,189,.74)";
    ctx.font = `${Math.max(13, width * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText(
      isHEarth
        ? "Terrain children consumed · drag to inspect"
        : "Drag with finger to inspect",
      width / 2,
      height * 0.114
    );
    ctx.restore();
  }
}

function drawWorld(canvas, ctx, world, yaw, pitch, zoom, compact = false) {
  if (!canvas || !ctx) return;

  clearScene(ctx, canvas.width, canvas.height, world, compact);
  drawGlobe(ctx, world, canvas.width, canvas.height, yaw, pitch, zoom, compact);
}

function drawNow() {
  const active = worldByKey(state.activeWorld);
  drawWorld(nodes.displayCanvas, nodes.displayCtx, active, state.yaw, state.pitch, state.zoom, false);

  for (const world of WORLDS) {
    const preview = nodes.previews.get(world.key);
    if (!preview) continue;
    const previewYaw = state.frame * 0.24 + WORLDS.indexOf(world) * 32;
    drawWorld(preview.canvas, preview.ctx, world, previewYaw, 10, 1, true);
  }
}

function drawFrame(timestamp = 0) {
  if (!state.active) return;

  if (!state.reducedMotion && timestamp - state.lastFrameAt < 42) {
    state.animationId = window.requestAnimationFrame(drawFrame);
    return;
  }

  state.lastFrameAt = timestamp;
  state.frame += 1;

  if (state.autoSpin && !state.dragging) {
    state.yaw += 0.18;
  }

  drawNow();

  if (!state.reducedMotion) {
    state.animationId = window.requestAnimationFrame(drawFrame);
  }
}

function onPointerDown(event) {
  if (!nodes.displayCanvas) return;

  state.dragging = true;
  state.autoSpin = false;
  state.pointerId = event.pointerId;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragStartYaw = state.yaw;
  state.dragStartPitch = state.pitch;

  nodes.displayCanvas.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function onPointerMove(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;

  const dx = event.clientX - state.dragStartX;
  const dy = event.clientY - state.dragStartY;

  state.yaw = state.dragStartYaw + dx * 0.45;
  state.pitch = clamp(state.dragStartPitch - dy * 0.32, -62, 62);

  drawNow();
  event.preventDefault();
}

function onPointerUp(event) {
  if (event.pointerId !== state.pointerId) return;

  state.dragging = false;
  state.pointerId = null;
  nodes.displayCanvas?.releasePointerCapture?.(event.pointerId);
  event.preventDefault();
}

function onWheel(event) {
  state.zoom = clamp(state.zoom + (event.deltaY < 0 ? 0.08 : -0.08), 0.78, 1.55);
  state.autoSpin = false;
  drawNow();
  event.preventDefault();
}

function wireEvents() {
  for (const [key, card] of nodes.cards.entries()) {
    card.addEventListener("click", () => selectWorld(key));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectWorld(key);
    });
  }

  if (nodes.displayCanvas) {
    nodes.displayCanvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    nodes.displayCanvas.addEventListener("pointermove", onPointerMove, { passive: false });
    nodes.displayCanvas.addEventListener("pointerup", onPointerUp, { passive: false });
    nodes.displayCanvas.addEventListener("pointercancel", onPointerUp, { passive: false });
    nodes.displayCanvas.addEventListener("wheel", onWheel, { passive: false });
  }

  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active && !state.animationId) {
      state.animationId = window.requestAnimationFrame(drawFrame);
    }

    if (!state.active && state.animationId) {
      window.cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      collectNodes();
      updateDisplay(worldByKey(state.activeWorld));
      drawNow();
    }, 160);
  }, { passive: true });
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    mode: SHOWROOM_MODE,
    selectWorld,
    status: getShowroomGlobeShowcaseStatus,
    getStatus: getShowroomGlobeShowcaseStatus,
    getShowroomGlobeShowcaseStatus
  };

  window.DGBShowroomGlobeShowcase = api;
  window.ShowroomGlobeShowcase = api;
  window.SHOWROOM_GLOBE_SHOWCASE_RECEIPT = CONTRACT;
}

function getShowroomGlobeShowcaseStatus() {
  const world = worldByKey(state.activeWorld);

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    showroomMode: SHOWROOM_MODE,
    activeDisplay: world.key,
    activeDisplayName: world.name,
    activeInspectionRoute: world.route,
    displayCaseLayer: "touch-drag-inspection-preview",
    touchDragInspection: true,
    yaw: state.yaw,
    pitch: state.pitch,
    zoom: state.zoom,

    definitiveLandStateRequired: DEFINITIVE_LAND_STATE_REQUIRED,
    landStateClassificationRequired: LAND_STATE_CLASSIFICATION_REQUIRED,
    elevationSeaLevelBound: ELEVATION_SEA_LEVEL_BOUND,
    terrainDetailConsumptionActive: TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
    terrainElevationContract: TERRAIN_ELEVATION_CONTRACT,
    terrainDetailContract: TERRAIN_DETAIL_CONTRACT,
    terrainDetailCacheReady: hEarthTerrainCache.ready,
    terrainDetailCacheError: hEarthTerrainCache.error,
    terrainElevationStatus: hEarthTerrainCache.elevationStatus,
    terrainDetailStatus: hEarthTerrainCache.detailStatus,

    groundLevelReady: GROUND_LEVEL_READY,
    manorPlacementReady: MANOR_PLACEMENT_READY,
    estatePlacementReady: ESTATE_PLACEMENT_READY,
    groundLevelHoldReason: GROUND_LEVEL_HOLD_REASON,
    manorPlacementHoldReason: MANOR_PLACEMENT_HOLD_REASON,
    estatePlacementHoldReason: ESTATE_PLACEMENT_HOLD_REASON,

    visibleDiagnostics: false,
    cardTransform: CARD_TRANSFORM,
    parentMutationAuthorized: PARENT_MUTATION_AUTHORIZED,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };
}

function boot() {
  initializeHEarthTerrainCache();
  collectNodes();
  exposeApi();
  wireEvents();
  selectWorld(DEFAULT_DISPLAY);

  state.animationId = window.requestAnimationFrame(drawFrame);

  if (state.reducedMotion) {
    drawFrame(performance.now());
  }
}

stampDocument(worldByKey(DEFAULT_DISPLAY));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  HTML_CONTRACT,
  PAIR_CONTRACT,
  PREVIOUS_CONTRACT,
  TERRAIN_ELEVATION_CONTRACT,
  TERRAIN_DETAIL_CONTRACT,
  SHOWROOM_MODE,
  DEFAULT_DISPLAY,
  WORLDS,
  DEFINITIVE_LAND_STATE_REQUIRED,
  LAND_STATE_CLASSIFICATION_REQUIRED,
  ELEVATION_SEA_LEVEL_BOUND,
  TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
  GROUND_LEVEL_READY,
  MANOR_PLACEMENT_READY,
  ESTATE_PLACEMENT_READY,
  PARENT_MUTATION_AUTHORIZED,
  GROUND_LEVEL_HOLD_REASON,
  MANOR_PLACEMENT_HOLD_REASON,
  ESTATE_PLACEMENT_HOLD_REASON,
  getShowroomGlobeShowcaseStatus
};
