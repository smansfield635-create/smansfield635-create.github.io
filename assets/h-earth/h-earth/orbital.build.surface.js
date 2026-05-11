// /assets/h-earth/h-earth/orbital.build.surface.js
// H_EARTH_G1_ORBITAL_BUILD_SURFACE_CANVAS_TNT_v13A
// Full-file replacement.
// H-Earth orbital/aerial build-surface canvas authority only.
//
// Purpose:
// - Establish H-Earth as the planet build surface from the air.
// - Consume parent instances through the route.
// - Consume canvas/index.js output when provided.
// - Prefer canvas/terrain/elevation.sea-level.js cells for elevation-aware build zones.
// - Render the orbital planet build surface.
// - Keep estate placement held.
// - Keep ground-level mode held.
// - Keep parent truth immutable.
//
// Owns:
// - orbital/aerial planet build surface rendering
// - build-zone visual classification
// - elevation-aware display expression
// - orbital surface receipt
// - view-state API for later controls
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - parent terrain truth
// - parent surface truth
// - ground-level scene
// - estate placement
// - buildings
// - roads
// - live construction tools
// - parent mutation
// - image generation
// - GraphicBox
// - visual pass claim

const CONTRACT = "H_EARTH_G1_ORBITAL_BUILD_SURFACE_CANVAS_TNT_v13A";
const PREWRITE = "H_EARTH_G1_ORBITAL_PLANET_BUILD_SURFACE_PREWRITE_v1";
const PREVIOUS = "H_EARTH_G1_CANVAS_INDEX_ORBITAL_ASSIMILATION_ROUTE_TNT_v14A";
const ASSET_PATH = "/assets/h-earth/h-earth/orbital.build.surface.js";

const EXPECTED = Object.freeze({
  canvasIndex: "H_EARTH_G1_CANVAS_INDEX_CHILD_RECEIVER_TNT_v1",
  terrainElevation: "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_CHILD_TNT_v1",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1"
});

const TOTAL_CELLS = 256;
const GRID = 16;

const viewState = {
  yaw: -22,
  pitch: 14,
  zoom: 1
};

const runtime = {
  bootPromise: null,
  host: null,
  panel: null,
  canvas: null,
  ctx: null,
  cells: [],
  parentInstances: null,
  canvasLayer: null,
  lastContext: null
};

const state = {
  contract: CONTRACT,
  receipt: CONTRACT,
  prewrite: PREWRITE,
  previous: PREVIOUS,
  assetPath: ASSET_PATH,
  status: "not-started",

  planetBuildMode: "orbital-aerial",
  interactionTarget: "planet-surface-view",
  parentConsumptionMode: "pending",

  parentInstancesPassed: false,
  canvasLayerPassed: false,
  canvasLayerReceipt: "pending",
  terrainElevationReceipt: "pending",
  surfaceReceipt: "pending",

  cellsResolved: 0,
  cellsPainted: 0,
  buildZonesResolved: 0,
  materialClasses: 0,
  belowSeaCells: 0,
  nearSeaLevelCells: 0,
  aboveSeaCells: 0,
  oceanUnavailableCells: 0,
  coastalCandidateCells: 0,
  lowlandCandidateCells: 0,
  valleyCandidateCells: 0,
  islandCandidateCells: 0,
  highlandConditionalCells: 0,
  mountainHeldCells: 0,
  iceHeldCells: 0,
  groundLevelCandidateCells: 0,
  heldCells: 0,

  nonBlankPixelRatio: 0,
  orbitalBuildSurfaceReady: false,
  estatePlacementReady: false,
  groundLevelReady: false,
  parentMutationAuthorized: false,
  visualPassClaim: false,
  cardTransformAuthorized: false,

  yaw: viewState.yaw,
  pitch: viewState.pitch,
  zoom: viewState.zoom,

  bootedAt: null,
  renderedAt: null,
  errors: []
};

const ZONE_COLORS = Object.freeze({
  "ocean-unavailable": "#0a315d",
  "submerged-held": "#125476",
  "coastal-transition": "#bda06a",
  "beach-edge-candidate": "#d2b77b",
  "lowland-primary-candidate": "#6f9854",
  "valley-primary-candidate": "#5f8c4b",
  "basin-conditional-candidate": "#7d8a52",
  "island-candidate": "#86a95e",
  "highland-conditional-candidate": "#8d875e",
  "ridge-held": "#7f7763",
  "cliff-held": "#8b6a58",
  "canyon-held": "#996b4f",
  "mountain-scenic-held": "#918f88",
  "ice-held": "#d8edf4",
  "volcanic-held": "#4d4642",
  "unknown-held": "#354352"
});

const MATERIAL_FALLBACK_COLORS = Object.freeze({
  "abyssal-ocean": "#071327",
  "deep-ocean": "#0b2a50",
  "open-ocean": "#124872",
  "ocean-water": "#155b82",
  "basin-mouth-water": "#1e708f",
  "coastal-shelf-water": "#2d8ea2",
  "reef-shelf-water": "#36aeb4",
  "coastal-shelf-ground": "#6c8b62",
  "beach-sediment": "#c9aa6e",
  "archipelago-ground": "#789554",
  "island-ground": "#7fa05a",
  "lowland-ground": "#658747",
  "grassland-ground": "#5f8845",
  "forest-ground": "#365f38",
  "wetland-ground": "#3d6c55",
  "basin-ground": "#667547",
  "valley-ground": "#547d44",
  "highland-ground": "#78774f",
  "ridge-ground": "#827957",
  "canyon-stone": "#986b4c",
  "cliff-stone": "#7a665c",
  "coastal-stone": "#777064",
  "mountain-stone": "#929088",
  "highland-stone": "#858177",
  "mineral-stone": "#a98152",
  "volcanic-stone": "#4c4541",
  "ice-cap": "#dceff4",
  "glacier-ice": "#bfdee9",
  "snow-highland": "#e7edf0"
});

function isObject(value) {
  return value !== null && typeof value === "object";
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeName(value) {
  return safeString(value)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 3) {
  const factor = Math.pow(10, places);
  return Math.round(Number(value) * factor) / factor;
}

function clone(value) {
  if (!isObject(value)) return value;
  return JSON.parse(JSON.stringify(value));
}

function recordError(label, error) {
  state.errors.push({
    label,
    message: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    at: new Date().toISOString()
  });
}

function receiptFrom(value) {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (isObject(value.receipts)) {
    for (const item of Object.values(value.receipts)) {
      const nested = receiptFrom(item);
      if (nested) return nested;
    }
  }

  return (
    value.CONTRACT ||
    value.contract ||
    value.receipt ||
    value.surfaceReceipt ||
    value.terrainElevationReceipt ||
    ""
  );
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (value instanceof Map) {
    return Array.from(value.entries()).map(([key, item]) => {
      if (isObject(item)) return { index: Number(key), ...item };
      return { index: Number(key), value: item };
    });
  }

  if (isObject(value)) {
    const numericKeys = Object.keys(value).filter((key) => /^\d+$/.test(key));
    if (numericKeys.length >= TOTAL_CELLS) {
      return numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => {
          const item = value[key];
          if (isObject(item)) return { index: Number(key), ...item };
          return { index: Number(key), value: item };
        });
    }
  }

  return [];
}

function resolveParentInstances(context = {}) {
  const instances =
    context.instances ||
    context.parentInstances ||
    window.H_EARTH_ROUTE_PARENT_INSTANCES ||
    null;

  const valid =
    instances?.kernel &&
    instances?.lattice256 &&
    instances?.landmap &&
    instances?.terrain &&
    instances?.surface;

  if (!valid) return null;

  return {
    kernel: instances.kernel,
    lattice256: instances.lattice256,
    landmap: instances.landmap,
    terrain: instances.terrain,
    surface: instances.surface
  };
}

function resolveCanvasLayer(context = {}) {
  if (context.canvasLayer) return context.canvasLayer;

  const api =
    window.H_EARTH_CANVAS_LAYER ||
    window.HEarthCanvasLayer ||
    window.DGBHEarthCanvasLayer ||
    null;

  return api || null;
}

function readCanvasLayerStatus(layer) {
  if (!layer) return null;

  if (typeof layer.getHEarthCanvasLayerStatus === "function") {
    return layer.getHEarthCanvasLayerStatus();
  }

  if (typeof layer.getStatus === "function") {
    return layer.getStatus();
  }

  if (typeof layer.status === "function") {
    return layer.status();
  }

  return {
    contract: layer.contract,
    receipt: layer.receipt,
    summary: layer.summary,
    children: typeof layer.getCanvasChildren === "function" ? layer.getCanvasChildren() : {}
  };
}

function readElevationCellsFromLayer(layer) {
  if (!layer) return [];

  if (typeof layer.getElevationCells === "function") {
    return toArray(layer.getElevationCells());
  }

  if (typeof layer.getTerrainElevation === "function") {
    const child = layer.getTerrainElevation();
    if (typeof child?.getElevationCells === "function") {
      return toArray(child.getElevationCells());
    }

    return toArray(child?.cells);
  }

  if (layer.children?.terrainElevation) {
    const child = layer.children.terrainElevation;
    if (typeof child.getElevationCells === "function") return toArray(child.getElevationCells());
    return toArray(child.cells);
  }

  return [];
}

function materialFromCell(cell) {
  if (typeof cell === "string") return normalizeName(cell);
  if (!isObject(cell)) return "unknown";

  const keys = [
    "material",
    "surfaceMaterial",
    "surface_material",
    "materialClass",
    "material_class",
    "surfaceClass",
    "surface_class",
    "terrainAspect",
    "terrain_aspect",
    "class",
    "type",
    "name",
    "value"
  ];

  for (const key of keys) {
    const found = normalizeName(cell[key]);
    if (found) return found;
  }

  return "unknown";
}

function gradeFromMaterial(material) {
  const name = normalizeName(material);

  if (name.includes("abyss") || name.includes("deep-ocean") || name.includes("open-ocean") || name === "ocean-water") {
    return "ocean-unavailable";
  }

  if (name.includes("water") || name.includes("reef")) return "submerged-held";
  if (name.includes("beach")) return "beach-edge-candidate";
  if (name.includes("coastal")) return "coastal-transition";
  if (name.includes("archipelago") || name.includes("island")) return "island-candidate";
  if (name.includes("valley")) return "valley-primary-candidate";
  if (name.includes("basin") || name.includes("wetland")) return "basin-conditional-candidate";
  if (name.includes("lowland") || name.includes("grassland") || name.includes("forest")) return "lowland-primary-candidate";
  if (name.includes("highland")) return "highland-conditional-candidate";
  if (name.includes("ridge") || name.includes("mineral")) return "ridge-held";
  if (name.includes("cliff")) return "cliff-held";
  if (name.includes("canyon")) return "canyon-held";
  if (name.includes("mountain")) return "mountain-scenic-held";
  if (name.includes("ice") || name.includes("snow") || name.includes("glacier")) return "ice-held";
  if (name.includes("volcanic")) return "volcanic-held";

  return "unknown-held";
}

function indexFromCell(cell, fallbackIndex) {
  if (!isObject(cell)) return fallbackIndex;

  const keys = ["index", "cellIndex", "cell_index", "cellId", "cell_id", "stateId", "state_id", "id", "i"];

  for (const key of keys) {
    const raw = cell[key];

    if (Number.isInteger(raw) && raw >= 0 && raw < TOTAL_CELLS) return raw;

    if (typeof raw === "string" && /^\d+$/.test(raw)) {
      const parsed = Number(raw);
      if (parsed >= 0 && parsed < TOTAL_CELLS) return parsed;
    }
  }

  const row = Number.isInteger(cell.row) ? cell.row : Number.isInteger(cell.r) ? cell.r : null;
  const col = Number.isInteger(cell.col) ? cell.col : Number.isInteger(cell.c) ? cell.c : null;

  if (row !== null && col !== null) {
    const index = row * GRID + col;
    if (index >= 0 && index < TOTAL_CELLS) return index;
  }

  return fallbackIndex;
}

function fallbackSurfaceCandidates(parentInstances) {
  const surface = parentInstances?.surface;
  const roots = [
    surface,
    surface?.surface,
    surface?.materialIndex,
    surface?.surfaceIndex,
    surface?.cellIndex,
    surface?.map,
    surface?.dataset
  ].filter(Boolean);

  const keys = [
    "cells",
    "surfaceCells",
    "materialCells",
    "cellMap",
    "surfaceMap",
    "materials",
    "records",
    "data",
    "states"
  ];

  for (const root of roots) {
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(root, key)) continue;
      const cells = toArray(root[key]);
      if (cells.length >= TOTAL_CELLS) return cells;
    }
  }

  const providers = [
    "getCells",
    "getSurfaceCells",
    "getMaterialCells",
    "readCells",
    "readSurfaceCells",
    "readMaterialCells",
    "getHEarthSurfaceCells",
    "getSurfaceMap",
    "getMaterialMap"
  ];

  for (const provider of providers) {
    if (typeof surface?.[provider] !== "function") continue;

    const argSets = [
      [],
      [{ readOnly: true }],
      [{ mutationAuthorized: false }],
      [{ readOnly: true, mutationAuthorized: false }]
    ];

    for (const args of argSets) {
      try {
        const result = surface[provider](...args);
        const cells = toArray(result);
        if (cells.length >= TOTAL_CELLS) return cells;
      } catch (error) {
        continue;
      }
    }
  }

  return [];
}

function normalizeCells(rawCells) {
  const cells = [];

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / GRID);
    const col = index % GRID;

    cells[index] = {
      index,
      row,
      col,
      latitude: 90 - ((row + 0.5) / GRID) * 180,
      longitude: -180 + ((col + 0.5) / GRID) * 360,
      material: "unknown",
      buildGradeClass: "unknown-held",
      groundLevelCandidateClass: "unknown-held",
      relativeToSeaLevel: "unknown",
      elevationMeters: 0,
      depthMeters: 0,
      held: true,
      estateCandidate: false,
      groundLevelCandidate: false,
      assigned: false
    };
  }

  for (let fallbackIndex = 0; fallbackIndex < Math.min(rawCells.length, TOTAL_CELLS); fallbackIndex += 1) {
    const item = rawCells[fallbackIndex];
    const index = indexFromCell(item, fallbackIndex);
    if (index < 0 || index >= TOTAL_CELLS) continue;

    const row = Math.floor(index / GRID);
    const col = index % GRID;
    const material = normalizeName(item?.material) !== "unknown" ? normalizeName(item.material) : materialFromCell(item);
    const buildGradeClass = normalizeName(item?.buildGradeClass) || gradeFromMaterial(material);

    const elevationMeters = Number.isFinite(Number(item?.elevationMeters))
      ? Number(item.elevationMeters)
      : buildGradeClass.includes("ocean") || buildGradeClass.includes("submerged")
        ? -300
        : buildGradeClass.includes("mountain")
          ? 1800
          : buildGradeClass.includes("highland") || buildGradeClass.includes("ridge")
            ? 720
            : buildGradeClass.includes("coastal") || buildGradeClass.includes("beach")
              ? 12
              : 120;

    const depthMeters = Number.isFinite(Number(item?.depthMeters))
      ? Number(item.depthMeters)
      : elevationMeters < 0
        ? Math.abs(elevationMeters)
        : 0;

    const relativeToSeaLevel =
      item?.relativeToSeaLevel ||
      (elevationMeters < 0 ? "below-sea-level" : elevationMeters <= 20 ? "near-sea-level" : "above-sea-level");

    cells[index] = {
      ...(isObject(item) ? item : {}),
      index,
      row,
      col,
      latitude: Number.isFinite(Number(item?.latitude))
        ? Number(item.latitude)
        : 90 - ((row + 0.5) / GRID) * 180,
      longitude: Number.isFinite(Number(item?.longitude))
        ? Number(item.longitude)
        : -180 + ((col + 0.5) / GRID) * 360,
      material,
      buildGradeClass,
      groundLevelCandidateClass: item?.groundLevelCandidateClass || buildGradeClass,
      relativeToSeaLevel,
      elevationMeters,
      depthMeters,
      held: item?.held !== undefined ? Boolean(item.held) : buildGradeClass.includes("held"),
      estateCandidate: item?.estateCandidate === true,
      groundLevelCandidate: item?.groundLevelCandidate === true,
      assigned: true
    };
  }

  return cells;
}

function colorForCell(cell) {
  const grade = normalizeName(cell.buildGradeClass);
  const material = normalizeName(cell.material);

  if (ZONE_COLORS[grade]) return ZONE_COLORS[grade];
  if (MATERIAL_FALLBACK_COLORS[material]) return MATERIAL_FALLBACK_COLORS[material];

  return ZONE_COLORS["unknown-held"];
}

function summarizeCells(cells) {
  const assignedCells = cells.filter((cell) => cell.assigned);
  const materialSet = new Set(assignedCells.map((cell) => normalizeName(cell.material)));
  const gradeSet = new Set(assignedCells.map((cell) => normalizeName(cell.buildGradeClass)));

  state.cellsResolved = assignedCells.length;
  state.materialClasses = materialSet.size;
  state.buildZonesResolved = gradeSet.size;

  state.belowSeaCells = assignedCells.filter((cell) => cell.relativeToSeaLevel === "below-sea-level").length;
  state.nearSeaLevelCells = assignedCells.filter((cell) => cell.relativeToSeaLevel === "near-sea-level").length;
  state.aboveSeaCells = assignedCells.filter((cell) => cell.relativeToSeaLevel === "above-sea-level").length;

  state.oceanUnavailableCells = assignedCells.filter((cell) => cell.buildGradeClass === "ocean-unavailable").length;
  state.coastalCandidateCells = assignedCells.filter((cell) => {
    return cell.buildGradeClass === "coastal-transition" || cell.buildGradeClass === "beach-edge-candidate";
  }).length;
  state.lowlandCandidateCells = assignedCells.filter((cell) => cell.buildGradeClass === "lowland-primary-candidate").length;
  state.valleyCandidateCells = assignedCells.filter((cell) => cell.buildGradeClass === "valley-primary-candidate").length;
  state.islandCandidateCells = assignedCells.filter((cell) => cell.buildGradeClass === "island-candidate").length;
  state.highlandConditionalCells = assignedCells.filter((cell) => cell.buildGradeClass === "highland-conditional-candidate").length;
  state.mountainHeldCells = assignedCells.filter((cell) => cell.buildGradeClass === "mountain-scenic-held").length;
  state.iceHeldCells = assignedCells.filter((cell) => cell.buildGradeClass === "ice-held").length;
  state.groundLevelCandidateCells = assignedCells.filter((cell) => cell.groundLevelCandidate === true).length;
  state.heldCells = assignedCells.filter((cell) => cell.held === true).length;

  state.orbitalBuildSurfaceReady = assignedCells.length === TOTAL_CELLS && state.buildZonesResolved > 0;
  state.estatePlacementReady = false;
  state.groundLevelReady = false;
  state.parentMutationAuthorized = false;
  state.visualPassClaim = false;
}

function findHost() {
  return (
    document.querySelector("[data-h-earth-canvas-mount]") ||
    document.getElementById("hEarthCanvasCompositionMount") ||
    document.getElementById("h-earth-main") ||
    document.querySelector("main") ||
    document.body
  );
}

function ensureStyle() {
  if (document.getElementById("h-earth-orbital-build-surface-style-v13a")) return;

  const style = document.createElement("style");
  style.id = "h-earth-orbital-build-surface-style-v13a";
  style.textContent = `
    [data-h-earth-orbital-panel] {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 1rem;
      border: 1px solid rgba(225,185,95,.34);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 50% 18%, rgba(225,185,95,.11), transparent 34rem),
        linear-gradient(180deg, rgba(8,16,34,.96), rgba(4,8,18,.98));
      color: #f3e3bd;
      box-shadow: 0 24px 80px rgba(0,0,0,.36);
    }

    [data-h-earth-orbital-title] {
      margin: 0 0 .35rem;
      font-size: clamp(1.25rem, 4vw, 2rem);
      line-height: 1.1;
      letter-spacing: .02em;
    }

    [data-h-earth-orbital-copy] {
      margin: 0 0 1rem;
      max-width: 82ch;
      color: rgba(243,227,189,.82);
      line-height: 1.55;
    }

    [data-h-earth-orbital-stage] {
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      min-height: clamp(340px, 70vw, 660px);
      border-radius: 1rem;
      background:
        radial-gradient(circle at 48% 42%, rgba(40,95,140,.18), transparent 15rem),
        radial-gradient(circle at 70% 30%, rgba(225,185,95,.12), transparent 14rem),
        linear-gradient(180deg, rgba(7,13,30,1), rgba(2,5,12,1));
      border: 1px solid rgba(255,255,255,.08);
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    [data-h-earth-orbital-canvas] {
      width: 100%;
      height: auto;
      max-width: 960px;
      display: block;
      aspect-ratio: 1 / 1;
      transform: none !important;
      transform-origin: center center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      cursor: crosshair;
    }

    [data-h-earth-orbital-status] {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(172px, 1fr));
      gap: .65rem;
      margin-top: .85rem;
    }

    [data-h-earth-orbital-status] span {
      display: block;
      padding: .65rem .75rem;
      border-radius: .75rem;
      background: rgba(255,255,255,.055);
      border: 1px solid rgba(255,255,255,.08);
      color: rgba(243,227,189,.88);
      font-size: .92rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    [data-h-earth-orbital-status] strong {
      display: block;
      margin-bottom: .12rem;
      color: #f6d37b;
      font-size: .76rem;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
  `;

  document.head.appendChild(style);
}

function ensurePanel() {
  ensureStyle();

  let panel = document.querySelector("[data-h-earth-orbital-panel]");

  if (!panel) {
    panel = document.createElement("section");
    panel.setAttribute("data-h-earth-orbital-panel", "true");
    panel.setAttribute("aria-label", "H-Earth orbital planet build surface");

    panel.innerHTML = `
      <h2 data-h-earth-orbital-title>H-Earth Orbital Planet Build Surface</h2>
      <p data-h-earth-orbital-copy>
        H-Earth is now treated as the planet we build on from the air first. This orbital layer reads
        the canvas index, terrain elevation child, and parent surface truth. Ground-level mode and estate
        placement remain held.
      </p>
      <div data-h-earth-orbital-stage>
        <canvas
          data-h-earth-orbital-canvas
          width="1400"
          height="1400"
          aria-label="H-Earth orbital aerial build surface"
          role="img"
        ></canvas>
      </div>
      <div data-h-earth-orbital-status aria-live="polite"></div>
    `;

    findHost().replaceChildren(panel);
  }

  runtime.panel = panel;
  runtime.canvas = panel.querySelector("[data-h-earth-orbital-canvas]");
  runtime.ctx = runtime.canvas?.getContext("2d", { alpha: false }) || null;
  runtime.host = findHost();

  return panel;
}

function statusTarget() {
  const panel = ensurePanel();
  let target = panel.querySelector("[data-h-earth-orbital-status]");

  if (!target) {
    target = document.createElement("div");
    target.setAttribute("data-h-earth-orbital-status", "");
    target.setAttribute("aria-live", "polite");
    panel.appendChild(target);
  }

  return target;
}

function publishPanelStatus() {
  const target = statusTarget();

  target.innerHTML = `
    <span><strong>Contract</strong>${CONTRACT}</span>
    <span><strong>Mode</strong>${state.planetBuildMode}</span>
    <span><strong>Target</strong>${state.interactionTarget}</span>
    <span><strong>Canvas index</strong>${state.canvasLayerReceipt}</span>
    <span><strong>Elevation child</strong>${state.terrainElevationReceipt}</span>
    <span><strong>Surface receipt</strong>${state.surfaceReceipt}</span>
    <span><strong>Cells resolved</strong>${state.cellsResolved}/256</span>
    <span><strong>Cells painted</strong>${state.cellsPainted}/256 visible side</span>
    <span><strong>Build zones</strong>${state.buildZonesResolved}</span>
    <span><strong>Below sea</strong>${state.belowSeaCells}</span>
    <span><strong>Near sea</strong>${state.nearSeaLevelCells}</span>
    <span><strong>Above sea</strong>${state.aboveSeaCells}</span>
    <span><strong>Ocean unavailable</strong>${state.oceanUnavailableCells}</span>
    <span><strong>Coastal candidates</strong>${state.coastalCandidateCells}</span>
    <span><strong>Lowland candidates</strong>${state.lowlandCandidateCells}</span>
    <span><strong>Valley candidates</strong>${state.valleyCandidateCells}</span>
    <span><strong>Island candidates</strong>${state.islandCandidateCells}</span>
    <span><strong>Highland conditional</strong>${state.highlandConditionalCells}</span>
    <span><strong>Ground candidates</strong>${state.groundLevelCandidateCells}</span>
    <span><strong>Orbital ready</strong>${String(state.orbitalBuildSurfaceReady)}</span>
    <span><strong>Estate placement</strong>false</span>
    <span><strong>Ground level</strong>false</span>
    <span><strong>Parent mutation</strong>forbidden</span>
    <span><strong>Visual pass</strong>false</span>
  `;
}

function clearScene(ctx, width, height) {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  gradient.addColorStop(0, "#142b4f");
  gradient.addColorStop(0.5, "#071229");
  gradient.addColorStop(1, "#01030a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.58;

  for (let i = 0; i < 180; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = 0.55 + ((i * 7) % 11) / 14;

    ctx.beginPath();
    ctx.fillStyle = i % 11 === 0 ? "rgba(246,211,123,.74)" : "rgba(225,238,255,.60)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function projectCell(cell, radius, centerX, centerY) {
  const lat = (Number(cell.latitude) * Math.PI) / 180;
  const lon = ((Number(cell.longitude) + Number(viewState.yaw)) * Math.PI) / 180;
  const pitch = (Number(viewState.pitch) * Math.PI) / 180;

  const baseX = Math.cos(lat) * Math.sin(lon);
  const baseY = Math.sin(lat);
  const baseZ = Math.cos(lat) * Math.cos(lon);

  const rotatedY = baseY * Math.cos(pitch) - baseZ * Math.sin(pitch);
  const rotatedZ = baseY * Math.sin(pitch) + baseZ * Math.cos(pitch);
  const rotatedX = baseX;

  if (rotatedZ < -0.06) return null;

  return {
    x: centerX + rotatedX * radius,
    y: centerY - rotatedY * radius * 0.98,
    z: rotatedZ,
    light: Math.max(0.2, Math.min(1, 0.52 + rotatedZ * 0.42 + rotatedY * 0.1 - rotatedX * 0.06))
  };
}

function shade(hex, light) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const out = [r, g, b].map((channel) => {
    return Math.max(0, Math.min(255, Math.round(channel * light + 10 * (1 - light))));
  });

  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
}

function drawGlobeBase(ctx, radius, centerX, centerY) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    centerX - radius * 0.36,
    centerY - radius * 0.34,
    radius * 0.08,
    centerX,
    centerY,
    radius * 1.14
  );

  ocean.addColorStop(0, "#1f6f9b");
  ocean.addColorStop(0.38, "#0d3b68");
  ocean.addColorStop(0.74, "#061e3e");
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(183,222,240,.26)";
  ctx.lineWidth = Math.max(2, radius * 0.011);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.012, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(93,178,210,.22)";
  ctx.lineWidth = Math.max(10, radius * 0.033);
  ctx.stroke();

  ctx.restore();
}

function drawCells(ctx, cells, radius, centerX, centerY) {
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY);
    if (point) projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
  ctx.clip();

  let painted = 0;

  for (const { cell, point } of projected) {
    if (!cell.assigned) continue;

    const grade = normalizeName(cell.buildGradeClass);
    const color = shade(colorForCell(cell), point.light);
    const elevation = Number(cell.elevationMeters) || 0;
    const reliefBoost = clamp(Math.abs(elevation) / 3600, 0, 0.32);
    const size = radius * (0.064 + reliefBoost * 0.018) * (0.72 + point.z * 0.38);

    ctx.beginPath();

    if (grade === "ocean-unavailable" || grade === "submerged-held") {
      ctx.globalAlpha = 0.48 + point.z * 0.24;
      ctx.ellipse(point.x, point.y, size * 0.76, size * 0.52, 0, 0, Math.PI * 2);
    } else if (
      grade === "mountain-scenic-held" ||
      grade === "ridge-held" ||
      grade === "cliff-held" ||
      grade === "canyon-held" ||
      grade === "volcanic-held"
    ) {
      ctx.globalAlpha = 0.93;
      ctx.moveTo(point.x, point.y - size * 0.68);
      ctx.lineTo(point.x + size * 0.66, point.y - size * 0.1);
      ctx.lineTo(point.x + size * 0.42, point.y + size * 0.56);
      ctx.lineTo(point.x - size * 0.46, point.y + size * 0.44);
      ctx.lineTo(point.x - size * 0.66, point.y - size * 0.08);
      ctx.closePath();
    } else if (grade === "ice-held") {
      ctx.globalAlpha = 0.95;
      ctx.ellipse(point.x, point.y, size * 0.6, size * 0.43, 0, 0, Math.PI * 2);
    } else {
      ctx.globalAlpha = 0.9;
      ctx.ellipse(point.x, point.y, size * 0.72, size * 0.52, 0, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();

    if (grade !== "ocean-unavailable" && grade !== "submerged-held") {
      ctx.globalAlpha = cell.held ? 0.13 : 0.26;
      ctx.strokeStyle = cell.estateCandidate ? "rgba(246,211,123,.72)" : "rgba(210,218,226,.34)";
      ctx.lineWidth = Math.max(0.7, radius * 0.0025);
      ctx.stroke();
    }

    painted += 1;
  }

  ctx.restore();

  state.cellsPainted = painted;
}

function drawLight(ctx, radius, centerX, centerY) {
  ctx.save();

  const highlight = ctx.createRadialGradient(
    centerX - radius * 0.34,
    centerY - radius * 0.36,
    radius * 0.08,
    centerX,
    centerY,
    radius * 1.08
  );

  highlight.addColorStop(0, "rgba(255,238,184,.19)");
  highlight.addColorStop(0.34, "rgba(255,238,184,.035)");
  highlight.addColorStop(0.72, "rgba(0,0,0,.02)");
  highlight.addColorStop(1, "rgba(0,0,0,.52)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  const terminator = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  terminator.addColorStop(0, "rgba(255,235,175,.05)");
  terminator.addColorStop(0.48, "rgba(0,0,0,0)");
  terminator.addColorStop(0.78, "rgba(0,0,0,.30)");
  terminator.addColorStop(1, "rgba(0,0,0,.62)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = terminator;
  ctx.fill();

  ctx.restore();
}

function drawLabels(ctx, width, height) {
  ctx.save();

  ctx.fillStyle = "rgba(246,211,123,.94)";
  ctx.font = `${Math.max(20, width * 0.028)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth · Orbital Planet Build Surface", width / 2, height * 0.07);

  ctx.fillStyle = "rgba(243,227,189,.72)";
  ctx.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Build from the air first · Ground-level estate placement held", width / 2, height * 0.103);

  ctx.textAlign = "left";
  const legendX = width * 0.07;
  const legendY = height * 0.79;
  const rows = [
    ["Primary estate candidates", ZONE_COLORS["lowland-primary-candidate"]],
    ["Island / valley candidates", ZONE_COLORS["island-candidate"]],
    ["Coastal transition", ZONE_COLORS["coastal-transition"]],
    ["Highland conditional", ZONE_COLORS["highland-conditional-candidate"]],
    ["Held relief / ice", ZONE_COLORS["mountain-scenic-held"]],
    ["Ocean unavailable", ZONE_COLORS["ocean-unavailable"]]
  ];

  ctx.font = `${Math.max(12, width * 0.013)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

  rows.forEach((row, index) => {
    const y = legendY + index * (height * 0.022);
    ctx.fillStyle = row[1];
    ctx.fillRect(legendX, y - 10, 18, 10);
    ctx.fillStyle = "rgba(243,227,189,.72)";
    ctx.fillText(row[0], legendX + 26, y);
  });

  ctx.restore();
}

function drawHeld(ctx, canvas, reason) {
  const width = canvas.width;
  const height = canvas.height;

  clearScene(ctx, width, height);
  drawStars(ctx, width, height);

  ctx.save();
  ctx.fillStyle = "rgba(246,211,123,.92)";
  ctx.font = `${Math.max(22, width * 0.03)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth Orbital Build Surface Held", width / 2, height * 0.43);

  ctx.fillStyle = "rgba(243,227,189,.76)";
  ctx.font = `${Math.max(14, width * 0.018)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(reason, width / 2, height * 0.48);
  ctx.fillText("Parent truth remains immutable. Estate placement remains held.", width / 2, height * 0.52);
  ctx.restore();

  state.status = reason;
  state.cellsPainted = 0;
}

function measureNonBlank(ctx, width, height) {
  try {
    const step = 8;
    const data = ctx.getImageData(0, 0, width, height).data;
    let sampled = 0;
    let nonBlank = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const offset = (y * width + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const a = data[offset + 3];

        sampled += 1;

        if (a > 0 && (r > 2 || g > 2 || b > 2)) nonBlank += 1;
      }
    }

    state.nonBlankPixelRatio = sampled > 0 ? nonBlank / sampled : 0;
  } catch (error) {
    state.nonBlankPixelRatio = 0;
    recordError("nonblank-pixel-proof", error);
  }
}

function stampDatasets() {
  const root = document.documentElement;

  root.dataset.hEarthOrbitalSurfaceReceipt = CONTRACT;
  root.dataset.hEarthOrbitalBuildMode = state.planetBuildMode;
  root.dataset.hEarthInteractionTarget = state.interactionTarget;
  root.dataset.hEarthOrbitalBuildSurfaceReady = String(state.orbitalBuildSurfaceReady);
  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.hEarthCardTransformAuthorized = "false";
  root.dataset.hEarthYaw = String(round(viewState.yaw, 2));
  root.dataset.hEarthPitch = String(round(viewState.pitch, 2));
  root.dataset.hEarthZoom = String(round(viewState.zoom, 3));

  if (runtime.canvas) {
    runtime.canvas.style.transform = "none";
    runtime.canvas.dataset.hEarthOrbitalSurfaceReceipt = CONTRACT;
    runtime.canvas.dataset.hEarthBuildMode = state.planetBuildMode;
    runtime.canvas.dataset.hEarthInteractionTarget = state.interactionTarget;
    runtime.canvas.dataset.hEarthCardTransformAuthorized = "false";
    runtime.canvas.dataset.hEarthEstatePlacementReady = "false";
    runtime.canvas.dataset.hEarthGroundLevelReady = "false";
    runtime.canvas.dataset.hEarthParentMutationAuthorized = "false";
    runtime.canvas.dataset.hEarthVisualPassClaim = "false";
    runtime.canvas.dataset.hEarthYaw = String(round(viewState.yaw, 2));
    runtime.canvas.dataset.hEarthPitch = String(round(viewState.pitch, 2));
    runtime.canvas.dataset.hEarthZoom = String(round(viewState.zoom, 3));
  }
}

function renderOrbitalSurface() {
  const canvas = runtime.canvas;
  const ctx = runtime.ctx;

  if (!canvas || !ctx) {
    state.status = "failed-no-canvas-context";
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const zoomedRadius = Math.min(width, height) * 0.34 * clamp(viewState.zoom, 0.72, 2.25);
  const radius = clamp(zoomedRadius, Math.min(width, height) * 0.23, Math.min(width, height) * 0.72);
  const centerX = width * 0.5;
  const centerY = height * 0.51;

  stampDatasets();

  clearScene(ctx, width, height);
  drawStars(ctx, width, height);
  drawGlobeBase(ctx, radius, centerX, centerY);
  drawCells(ctx, runtime.cells, radius, centerX, centerY);
  drawLight(ctx, radius, centerX, centerY);
  drawLabels(ctx, width, height);
  measureNonBlank(ctx, width, height);

  state.status = "orbital-build-surface-rendered";
  state.renderedAt = new Date().toISOString();
  state.yaw = viewState.yaw;
  state.pitch = viewState.pitch;
  state.zoom = viewState.zoom;
  state.orbitalBuildSurfaceReady = state.cellsResolved === TOTAL_CELLS && state.nonBlankPixelRatio > 0.01;

  stampDatasets();
  publishPanelStatus();
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    prewrite: PREWRITE,
    previous: PREVIOUS,
    assetPath: ASSET_PATH,
    boot: bootHEarthOrbitalBuildSurface,
    bootHEarthOrbitalBuildSurface,
    status: getHEarthOrbitalBuildSurfaceStatus,
    getStatus: getHEarthOrbitalBuildSurfaceStatus,
    getHEarthOrbitalBuildSurfaceStatus,
    setView: setHEarthOrbitalBuildSurfaceView,
    setHEarthOrbitalBuildSurfaceView,
    refreshView: refreshHEarthOrbitalBuildSurfaceView,
    refreshHEarthOrbitalBuildSurfaceView
  };

  window.DGBHEarthOrbitalBuildSurface = api;
  window.HEarthOrbitalBuildSurface = api;
  window.H_EARTH_ORBITAL_BUILD_SURFACE = api;
  window.H_EARTH_ORBITAL_BUILD_SURFACE_RECEIPT = CONTRACT;

  stampDatasets();
}

async function bootHEarthOrbitalBuildSurface(context = {}) {
  if (runtime.bootPromise) return runtime.bootPromise;

  runtime.bootPromise = Promise.resolve().then(() => {
    state.bootedAt = new Date().toISOString();
    state.status = "booting-orbital-build-surface";
    runtime.lastContext = context;

    ensurePanel();

    if (!runtime.canvas || !runtime.ctx) {
      state.status = "failed-no-canvas-element";
      publishPanelStatus();
      exposeApi();
      return getHEarthOrbitalBuildSurfaceStatus();
    }

    try {
      const parentInstances = resolveParentInstances(context);
      const canvasLayer = resolveCanvasLayer(context);
      const canvasLayerStatus = readCanvasLayerStatus(canvasLayer);

      runtime.parentInstances = parentInstances;
      runtime.canvasLayer = canvasLayer;

      state.parentInstancesPassed = Boolean(parentInstances);
      state.canvasLayerPassed = Boolean(canvasLayer);
      state.parentConsumptionMode = canvasLayer
        ? "canvas-index-elevation-child"
        : parentInstances
          ? "parent-surface-fallback"
          : "missing-parent-context";

      state.canvasLayerReceipt =
        canvasLayerStatus?.contract ||
        canvasLayerStatus?.receipt ||
        receiptFrom(canvasLayer) ||
        "missing";

      state.terrainElevationReceipt =
        canvasLayerStatus?.terrainElevationReceipt ||
        canvasLayerStatus?.children?.terrainElevation?.contract ||
        canvasLayer?.children?.terrainElevation?.contract ||
        "missing";

      state.surfaceReceipt =
        parentInstances?.surface?.receipts?.surface?.contract ||
        receiptFrom(parentInstances?.surface) ||
        "missing";

      let rawCells = readElevationCellsFromLayer(canvasLayer);

      if (rawCells.length < TOTAL_CELLS && parentInstances) {
        rawCells = fallbackSurfaceCandidates(parentInstances);
      }

      runtime.cells = normalizeCells(rawCells);
      summarizeCells(runtime.cells);

      if (state.cellsResolved < TOTAL_CELLS) {
        drawHeld(runtime.ctx, runtime.canvas, "held-elevation-or-surface-cells-not-resolved");
        measureNonBlank(runtime.ctx, runtime.canvas.width, runtime.canvas.height);
        publishPanelStatus();
        exposeApi();
        return getHEarthOrbitalBuildSurfaceStatus();
      }

      renderOrbitalSurface();
      exposeApi();

      return getHEarthOrbitalBuildSurfaceStatus();
    } catch (error) {
      recordError("boot-orbital-build-surface", error);

      if (runtime.ctx && runtime.canvas) {
        drawHeld(runtime.ctx, runtime.canvas, "failed-orbital-build-surface");
        measureNonBlank(runtime.ctx, runtime.canvas.width, runtime.canvas.height);
      }

      state.status = "failed-orbital-build-surface";
      publishPanelStatus();
      exposeApi();

      return getHEarthOrbitalBuildSurfaceStatus();
    }
  });

  return runtime.bootPromise;
}

function setHEarthOrbitalBuildSurfaceView(nextView = {}) {
  viewState.yaw = Number.isFinite(Number(nextView.yaw)) ? Number(nextView.yaw) : viewState.yaw;
  viewState.pitch = Number.isFinite(Number(nextView.pitch))
    ? clamp(Number(nextView.pitch), -72, 72)
    : viewState.pitch;
  viewState.zoom = Number.isFinite(Number(nextView.zoom))
    ? clamp(Number(nextView.zoom), 0.72, 2.25)
    : viewState.zoom;

  if (runtime.canvas && runtime.ctx && runtime.cells.length >= TOTAL_CELLS) {
    renderOrbitalSurface();
  }

  exposeApi();

  return getHEarthOrbitalBuildSurfaceStatus();
}

function refreshHEarthOrbitalBuildSurfaceView() {
  if (runtime.canvas && runtime.ctx && runtime.cells.length >= TOTAL_CELLS) {
    renderOrbitalSurface();
  }

  exposeApi();

  return getHEarthOrbitalBuildSurfaceStatus();
}

function getHEarthOrbitalBuildSurfaceStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    prewrite: PREWRITE,
    previous: PREVIOUS,
    assetPath: ASSET_PATH,
    status: state.status,

    planetBuildMode: state.planetBuildMode,
    interactionTarget: state.interactionTarget,
    parentConsumptionMode: state.parentConsumptionMode,

    parentInstancesPassed: state.parentInstancesPassed,
    canvasLayerPassed: state.canvasLayerPassed,
    canvasLayerReceipt: state.canvasLayerReceipt,
    terrainElevationReceipt: state.terrainElevationReceipt,
    surfaceReceipt: state.surfaceReceipt,
    expectedCanvasIndex: EXPECTED.canvasIndex,
    expectedTerrainElevation: EXPECTED.terrainElevation,
    expectedSurface: EXPECTED.surface,

    cellsResolved: state.cellsResolved,
    cellsPainted: state.cellsPainted,
    buildZonesResolved: state.buildZonesResolved,
    materialClasses: state.materialClasses,

    belowSeaCells: state.belowSeaCells,
    nearSeaLevelCells: state.nearSeaLevelCells,
    aboveSeaCells: state.aboveSeaCells,
    oceanUnavailableCells: state.oceanUnavailableCells,
    coastalCandidateCells: state.coastalCandidateCells,
    lowlandCandidateCells: state.lowlandCandidateCells,
    valleyCandidateCells: state.valleyCandidateCells,
    islandCandidateCells: state.islandCandidateCells,
    highlandConditionalCells: state.highlandConditionalCells,
    mountainHeldCells: state.mountainHeldCells,
    iceHeldCells: state.iceHeldCells,
    groundLevelCandidateCells: state.groundLevelCandidateCells,
    heldCells: state.heldCells,

    nonBlankPixelRatio: state.nonBlankPixelRatio,
    orbitalBuildSurfaceReady: state.orbitalBuildSurfaceReady,
    estatePlacementReady: false,
    groundLevelReady: false,
    parentMutationAuthorized: false,
    visualPassClaim: false,
    cardTransformAuthorized: false,

    yaw: round(viewState.yaw, 3),
    pitch: round(viewState.pitch, 3),
    zoom: round(viewState.zoom, 3),

    bootedAt: state.bootedAt,
    renderedAt: state.renderedAt,
    errors: [...state.errors]
  };
}

exposeApi();

export {
  CONTRACT,
  PREWRITE,
  PREVIOUS,
  ASSET_PATH,
  EXPECTED,
  bootHEarthOrbitalBuildSurface,
  getHEarthOrbitalBuildSurfaceStatus,
  setHEarthOrbitalBuildSurfaceView,
  refreshHEarthOrbitalBuildSurfaceView
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  prewrite: PREWRITE,
  previous: PREVIOUS,
  assetPath: ASSET_PATH,
  boot: bootHEarthOrbitalBuildSurface,
  bootHEarthOrbitalBuildSurface,
  status: getHEarthOrbitalBuildSurfaceStatus,
  getStatus: getHEarthOrbitalBuildSurfaceStatus,
  getHEarthOrbitalBuildSurfaceStatus,
  setView: setHEarthOrbitalBuildSurfaceView,
  setHEarthOrbitalBuildSurfaceView,
  refreshView: refreshHEarthOrbitalBuildSurfaceView,
  refreshHEarthOrbitalBuildSurfaceView
};
