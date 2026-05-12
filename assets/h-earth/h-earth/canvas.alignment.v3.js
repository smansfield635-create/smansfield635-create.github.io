// /assets/h-earth/h-earth/canvas.alignment.v3.js
// H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1A
// Full-file replacement.
// TNT-only repair.
// Fixes prior syntax failure: Identifier 'ctx' has already been declared.
// H-Earth canvas child authority only.
//
// Purpose:
// - Load cleanly as a module.
// - Render the H-Earth orbital/aerial inspection figure.
// - Preserve old canvas receipt for route compatibility.
// - Preserve new visual-definition renewal receipt.
// - Support finger drag through setHEarthCanvasView.
// - Keep diagnostics available only as status API.
// - Keep parent mutation forbidden.
// - Keep ground level, manor placement, and estate placement held.

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const H_EARTH_CANVAS_RENEWAL_CONTRACT = "H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1A";
const H_EARTH_CANVAS_PREVIOUS_CONTRACT = "H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1";

const H_EARTH_SURFACE_RECEIPT_EXPECTED = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";

const TOTAL_CELLS = 256;
const GRID = 16;

const DEFINITIVE_LAND_STATE_REQUIRED = true;
const LAND_STATE_CLASSIFICATION_REQUIRED = true;
const ELEVATION_SEA_LEVEL_BOUND = true;
const TERRAIN_DETAIL_CONSUMPTION_ACTIVE = true;
const ORBITAL_AERIAL_DEFINITION_ACTIVE = true;

const GROUND_LEVEL_READY = false;
const MANOR_PLACEMENT_READY = false;
const ESTATE_PLACEMENT_READY = false;
const PARENT_MUTATION_AUTHORIZED = false;

const GROUND_LEVEL_HOLD_REASON = "definitive-land-state-required";
const MANOR_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";
const ESTATE_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";

const ACTIVE_PARENT_PATHS = Object.freeze({
  kernel: "/assets/h-earth/h-earth.kernel.js",
  lattice256: "/assets/h-earth/h-earth.lattice256.js",
  landmap: "/assets/h-earth/h-earth.landmap.js",
  terrain: "/assets/h-earth/h-earth.terrain.js",
  surface: "/assets/h-earth/h-earth.surface.js"
});

const MATERIAL_COLORS = Object.freeze({
  "abyssal-ocean": "#031123",
  "deep-ocean": "#06234c",
  "open-ocean": "#0a4775",
  "ocean-water": "#135d82",
  "basin-mouth-water": "#1f748d",
  "coastal-shelf-water": "#369aa4",
  "reef-shelf-water": "#4fc4bc",

  "beach-sediment": "#d5bb80",
  "coastal-shelf-ground": "#879d66",
  "coastal-stone": "#918a78",
  "archipelago-ground": "#809b4e",
  "island-ground": "#6f9b4c",
  "lowland-ground": "#5f9144",
  "grassland-ground": "#659b46",
  "forest-ground": "#2f6a3a",
  "wetland-ground": "#3e7355",
  "basin-ground": "#6f774d",
  "valley-ground": "#527f42",

  "highland-ground": "#817a4e",
  "ridge-ground": "#987c54",
  "canyon-stone": "#9a684a",
  "cliff-stone": "#827466",
  "mountain-stone": "#a09b8d",
  "highland-stone": "#8c8678",
  "mineral-stone": "#b78b52",
  "volcanic-stone": "#4e4745",

  "snow-highland": "#edf4f6",
  "glacier-ice": "#cae9f2",
  "ice-cap": "#e9f8fb"
});

const STATE = {
  booted: false,
  bootedAt: null,
  renderedAt: null,

  canvas: null,
  context: null,
  panel: null,

  cells: [],
  parentInstances: {},
  parentReceipts: {},
  parentSurfaceReady: false,
  downstreamCanvasMayReadSurface: false,

  cellsResolved: 0,
  cellsPainted: 0,
  surfaceMaterialClasses: 0,
  landCells: 0,
  oceanCells: 0,
  coastCells: 0,
  reliefCells: 0,
  iceCells: 0,

  yaw: -18,
  pitch: 8,
  zoom: 1,

  renderStatus: "not-started",
  nonBlankPixelRatio: 0,

  controlsReceipt: "pending",
  controlsStatus: "showcase-inspection-heavy",
  controlsAuthorized: true,
  motionAuthorized: true,
  inputAuthorized: true,
  canvasControlsReceiptAligned: true,

  parentMutationAuthorized: false,
  groundLevelReady: false,
  manorPlacementReady: false,
  estatePlacementReady: false,

  errors: []
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function isObject(value) {
  return value !== null && typeof value === "object";
}

function normalizeName(value) {
  return safeString(value)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

function deterministicNoise(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function recordError(label, error) {
  STATE.errors.push({
    label,
    message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  });
}

function readContract(value) {
  if (!value) return "";
  if (typeof value === "string") return value;

  const keys = [
    "CONTRACT",
    "contract",
    "receipt",
    "SURFACE_RECEIPT",
    "surfaceReceipt",
    "terrainReceipt",
    "landmapReceipt",
    "latticeReceipt",
    "kernelReceipt"
  ];

  for (const key of keys) {
    if (typeof value?.[key] === "string" && value[key].trim()) return value[key].trim();
  }

  if (isObject(value?.receipts)) {
    for (const item of Object.values(value.receipts)) {
      const nested = readContract(item);
      if (nested) return nested;
    }
  }

  if (isObject(value?.default)) {
    const nested = readContract(value.default);
    if (nested) return nested;
  }

  return "";
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

function materialFromCell(cell) {
  if (typeof cell === "string") return normalizeName(cell);
  if (!isObject(cell)) return "";

  const keys = [
    "surfaceMaterial",
    "surface_material",
    "materialClass",
    "material_class",
    "surfaceClass",
    "surface_class",
    "material",
    "className",
    "class",
    "type",
    "aspect",
    "terrainAspect",
    "terrain_aspect",
    "name",
    "value"
  ];

  for (const key of keys) {
    const normalized = normalizeName(cell[key]);
    if (normalized) return normalized;
  }

  return "";
}

function terrainAspectFromCell(cell, fallback = "") {
  if (typeof cell === "string") return normalizeName(cell);
  if (!isObject(cell)) return normalizeName(fallback);

  const keys = [
    "terrainAspect",
    "terrain_aspect",
    "aspect",
    "relief",
    "reliefClass",
    "landform",
    "terrainClass",
    "terrain_class",
    "type",
    "name"
  ];

  for (const key of keys) {
    const normalized = normalizeName(cell[key]);
    if (normalized) return normalized;
  }

  return normalizeName(fallback);
}

function kindFromMaterial(material, source = {}) {
  const name = normalizeName(material);

  if (name.includes("ocean") || name.includes("water") || name.includes("reef")) return "ocean";
  if (name.includes("ice") || name.includes("snow") || name.includes("glacier")) return "ice";
  if (name.includes("beach") || name.includes("coastal") || name.includes("shelf") || name.includes("sediment")) {
    return name.includes("water") ? "ocean" : "coast";
  }
  if (
    name.includes("mountain") ||
    name.includes("stone") ||
    name.includes("ridge") ||
    name.includes("cliff") ||
    name.includes("canyon") ||
    name.includes("volcanic") ||
    name.includes("mineral")
  ) {
    return "relief";
  }
  if (
    name.includes("ground") ||
    name.includes("forest") ||
    name.includes("grass") ||
    name.includes("land") ||
    name.includes("island") ||
    name.includes("archipelago") ||
    name.includes("basin") ||
    name.includes("valley") ||
    name.includes("wetland")
  ) {
    return "land";
  }

  if (source?.isOcean === true || source?.water === true || source?.ocean === true) return "ocean";
  if (source?.isLand === true || source?.land === true) return "land";

  return "unknown";
}

function colorForMaterial(material, kind) {
  const name = normalizeName(material);

  if (MATERIAL_COLORS[name]) return MATERIAL_COLORS[name];

  if (name.includes("abyss")) return MATERIAL_COLORS["abyssal-ocean"];
  if (name.includes("deep") && name.includes("ocean")) return MATERIAL_COLORS["deep-ocean"];
  if (name.includes("ocean")) return MATERIAL_COLORS["open-ocean"];
  if (name.includes("water")) return MATERIAL_COLORS["basin-mouth-water"];
  if (name.includes("reef")) return MATERIAL_COLORS["reef-shelf-water"];
  if (name.includes("shelf")) return MATERIAL_COLORS["coastal-shelf-water"];
  if (name.includes("beach")) return MATERIAL_COLORS["beach-sediment"];
  if (name.includes("coastal")) return MATERIAL_COLORS["coastal-shelf-ground"];
  if (name.includes("archipelago")) return MATERIAL_COLORS["archipelago-ground"];
  if (name.includes("island")) return MATERIAL_COLORS["island-ground"];
  if (name.includes("forest")) return MATERIAL_COLORS["forest-ground"];
  if (name.includes("grass")) return MATERIAL_COLORS["grassland-ground"];
  if (name.includes("wetland")) return MATERIAL_COLORS["wetland-ground"];
  if (name.includes("basin")) return MATERIAL_COLORS["basin-ground"];
  if (name.includes("valley")) return MATERIAL_COLORS["valley-ground"];
  if (name.includes("highland")) return MATERIAL_COLORS["highland-ground"];
  if (name.includes("ridge")) return MATERIAL_COLORS["ridge-ground"];
  if (name.includes("canyon")) return MATERIAL_COLORS["canyon-stone"];
  if (name.includes("cliff")) return MATERIAL_COLORS["cliff-stone"];
  if (name.includes("mineral")) return MATERIAL_COLORS["mineral-stone"];
  if (name.includes("volcanic")) return MATERIAL_COLORS["volcanic-stone"];
  if (name.includes("mountain") || name.includes("stone")) return MATERIAL_COLORS["mountain-stone"];
  if (name.includes("ice")) return MATERIAL_COLORS["glacier-ice"];
  if (name.includes("snow")) return MATERIAL_COLORS["snow-highland"];

  if (kind === "ocean") return MATERIAL_COLORS["open-ocean"];
  if (kind === "ice") return MATERIAL_COLORS["glacier-ice"];
  if (kind === "coast") return MATERIAL_COLORS["beach-sediment"];
  if (kind === "relief") return MATERIAL_COLORS["mountain-stone"];
  if (kind === "land") return MATERIAL_COLORS["lowland-ground"];

  return "#52677a";
}

function collectCandidates(source, label) {
  const candidates = [];
  if (!source) return candidates;

  const roots = [
    source,
    source.surface,
    source.materialIndex,
    source.surfaceIndex,
    source.cellIndex,
    source.terrainIndex,
    source.map,
    source.dataset
  ].filter(Boolean);

  const keys = [
    "cells",
    "surfaceCells",
    "materialCells",
    "terrainCells",
    "cellMap",
    "surfaceMap",
    "terrainMap",
    "materials",
    "records",
    "data",
    "states"
  ];

  for (const root of roots) {
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(root, key)) continue;

      const cells = toArray(root[key]);
      if (cells.length >= TOTAL_CELLS) {
        candidates.push({ source: `${label}.${key}`, cells });
      }
    }
  }

  const providers = [
    "getCells",
    "getSurfaceCells",
    "getMaterialCells",
    "getTerrainCells",
    "readCells",
    "readSurfaceCells",
    "readMaterialCells",
    "readTerrainCells",
    "getHEarthSurfaceCells",
    "getHEarthTerrainCells",
    "getSurfaceMap",
    "getMaterialMap",
    "getTerrainMap"
  ];

  for (const provider of providers) {
    if (typeof source[provider] !== "function") continue;

    const argSets = [
      [],
      [{ readOnly: true }],
      [{ mutationAuthorized: false }],
      [{ readOnly: true, mutationAuthorized: false }]
    ];

    for (const args of argSets) {
      try {
        const result = source[provider](...args);
        const cells = toArray(result);
        if (cells.length >= TOTAL_CELLS) {
          candidates.push({ source: `${label}.${provider}()`, cells });
          break;
        }
      } catch {
        continue;
      }
    }
  }

  return candidates;
}

function blankCells() {
  const cells = [];

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / GRID);
    const col = index % GRID;

    cells.push({
      index,
      row,
      col,
      latitude: 90 - ((row + 0.5) / GRID) * 180,
      longitude: -180 + ((col + 0.5) / GRID) * 360,
      material: "",
      terrainAspect: "",
      kind: "unknown",
      color: "#52677a",
      assignedSurface: false
    });
  }

  return cells;
}

function normalizeSurfaceCells(surfaceCandidates, terrainCandidates) {
  const cells = blankCells();
  const terrainByIndex = new Map();

  for (const candidate of terrainCandidates) {
    for (let fallbackIndex = 0; fallbackIndex < Math.min(candidate.cells.length, TOTAL_CELLS); fallbackIndex += 1) {
      const item = candidate.cells[fallbackIndex];
      const index = indexFromCell(item, fallbackIndex);
      if (index >= 0 && index < TOTAL_CELLS && !terrainByIndex.has(index)) {
        terrainByIndex.set(index, item);
      }
    }
  }

  for (const candidate of surfaceCandidates) {
    for (let fallbackIndex = 0; fallbackIndex < Math.min(candidate.cells.length, TOTAL_CELLS); fallbackIndex += 1) {
      const item = candidate.cells[fallbackIndex];
      const index = indexFromCell(item, fallbackIndex);
      if (index < 0 || index >= TOTAL_CELLS) continue;

      const terrainItem = terrainByIndex.get(index) || {};
      const material = materialFromCell(item) || materialFromCell(terrainItem);
      if (!material) continue;

      const terrainAspect = terrainAspectFromCell(terrainItem, material);
      const kind = kindFromMaterial(material, item);
      const row = Math.floor(index / GRID);
      const col = index % GRID;

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
        terrainAspect,
        kind,
        color: colorForMaterial(material, kind),
        assignedSurface: true,
        sourceLabel: candidate.source
      };
    }
  }

  return cells;
}

function createFallbackCells() {
  const cells = blankCells();

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / GRID);
    const col = index % GRID;
    const lat = 90 - ((row + 0.5) / GRID) * 180;
    const lon = -180 + ((col + 0.5) / GRID) * 360;
    const n = deterministicNoise(index, 256);
    const band = Math.sin((lon / 180) * Math.PI * 2 + Math.sin((lat / 90) * Math.PI) * 1.4);

    let material = "open-ocean";

    if (lat > 63 || lat < -62) material = n > 0.36 ? "glacier-ice" : "open-ocean";
    else if (band + n * 0.92 > 0.70) material = n > 0.66 ? "ridge-ground" : "lowland-ground";
    else if (band + n * 0.66 > 0.45) material = n > 0.62 ? "coastal-shelf-ground" : "beach-sediment";
    else if (band + n * 0.42 > 0.20) material = "coastal-shelf-water";
    else if (n < 0.16) material = "deep-ocean";

    const kind = kindFromMaterial(material);

    cells[index] = {
      ...cells[index],
      latitude: lat,
      longitude: lon,
      material,
      terrainAspect: material,
      kind,
      color: colorForMaterial(material, kind),
      assignedSurface: true,
      fallbackSurface: true
    };
  }

  return cells;
}

function summarizeCells(cells) {
  const assigned = cells.filter((cell) => cell.assignedSurface && cell.material);
  const materialClasses = new Set(assigned.map((cell) => cell.material));

  STATE.cellsResolved = assigned.length;
  STATE.surfaceMaterialClasses = materialClasses.size;
  STATE.landCells = assigned.filter((cell) => cell.kind === "land").length;
  STATE.oceanCells = assigned.filter((cell) => cell.kind === "ocean").length;
  STATE.coastCells = assigned.filter((cell) => cell.kind === "coast").length;
  STATE.reliefCells = assigned.filter((cell) => cell.kind === "relief").length;
  STATE.iceCells = assigned.filter((cell) => cell.kind === "ice").length;
  STATE.parentSurfaceReady = assigned.length === TOTAL_CELLS;
  STATE.downstreamCanvasMayReadSurface = STATE.parentSurfaceReady;
}

function fallbackElevation(cell) {
  const n = deterministicNoise(cell.index, 451);
  const material = normalizeName(cell.material);

  if (cell.kind === "ocean") {
    if (material.includes("abyss")) return -5200;
    if (material.includes("deep")) return -2800;
    if (material.includes("shelf") || material.includes("reef")) return -80;
    return -900 - Math.round(n * 1200);
  }

  if (cell.kind === "coast") return 4 + Math.round(n * 42);
  if (cell.kind === "ice") return 1600 + Math.round(n * 3200);
  if (cell.kind === "relief") return 700 + Math.round(n * 3400);
  return 30 + Math.round(n * 500);
}

function attachDetail(cells) {
  return cells.map((cell) => {
    if (!cell.assignedSurface) return cell;

    const elevationMeters = fallbackElevation(cell);
    const n1 = deterministicNoise(cell.index, 61);
    const n2 = deterministicNoise(cell.index, 97);
    const n3 = deterministicNoise(cell.index, 233);

    return {
      ...cell,
      elevation: {
        elevationMeters,
        depthMeters: elevationMeters < 0 ? Math.abs(elevationMeters) : 0,
        relativeToSeaLevel: elevationMeters < 0 ? "below-sea-level" : elevationMeters <= 20 ? "near-sea-level" : "above-sea-level"
      },
      detail: {
        grain: 0.28 + n1 * 0.48,
        ridge: cell.kind === "relief" ? 0.56 + n1 * 0.40 : elevationMeters > 900 ? 0.24 + n1 * 0.28 : n1 * 0.12,
        valley: cell.kind === "land" ? n2 * 0.34 : n2 * 0.12,
        coastHardness: cell.kind === "coast" ? 0.66 + n3 * 0.30 : cell.kind === "ocean" ? 0.08 : 0.12,
        oceanDepthHint: cell.kind === "ocean" ? clamp(Math.abs(elevationMeters) / 5200, 0.10, 1) : 0,
        iceSoftness: cell.kind === "ice" ? 0.58 + n1 * 0.28 : 0,
        elevationShade: clamp(elevationMeters / 5000, -1, 1),
        colorLift: cell.kind === "ice" ? 0.18 : cell.kind === "coast" ? 0.08 : 0,
        colorDarken: cell.kind === "ocean" ? clamp(Math.abs(elevationMeters) / 5200, 0, 1) * 0.18 : n2 * 0.08
      }
    };
  });
}

async function importParentChain() {
  const cacheKey = `${encodeURIComponent(H_EARTH_CANVAS_RENEWAL_CONTRACT)}-${Date.now()}`;

  try {
    const [kernelMod, latticeMod, landmapMod, terrainMod, surfaceMod] = await Promise.all([
      import(`${ACTIVE_PARENT_PATHS.kernel}?v=${cacheKey}`),
      import(`${ACTIVE_PARENT_PATHS.lattice256}?v=${cacheKey}`),
      import(`${ACTIVE_PARENT_PATHS.landmap}?v=${cacheKey}`),
      import(`${ACTIVE_PARENT_PATHS.terrain}?v=${cacheKey}`),
      import(`${ACTIVE_PARENT_PATHS.surface}?v=${cacheKey}`)
    ]);

    const kernel = kernelMod.createHEarthKernel?.({
      doorwayContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
      route: "/showroom/globe/",
      mutationAuthorized: false,
      parentMutationAuthorized: false
    });

    const lattice256 = latticeMod.createHEarthLattice256?.({ kernel });
    const landmap = landmapMod.createHEarthLandmap?.({ kernel, lattice256 });
    const terrain = terrainMod.createHEarthTerrain?.({ kernel, lattice256, landmap });
    const surface = surfaceMod.createHEarthSurface?.({ kernel, lattice256, landmap, terrain });

    STATE.parentInstances = { kernel, lattice256, landmap, terrain, surface };
    STATE.parentReceipts = {
      kernel: readContract(kernelMod) || readContract(kernel),
      lattice256: readContract(latticeMod) || readContract(lattice256),
      landmap: readContract(landmapMod) || readContract(landmap),
      terrain: readContract(terrainMod) || readContract(terrain),
      surface: surface?.receipts?.surface?.contract || readContract(surfaceMod) || readContract(surface)
    };

    const surfaceCandidates = collectCandidates(surface, "surface");
    const terrainCandidates = collectCandidates(terrain, "terrain");

    if (surfaceCandidates.length) {
      return normalizeSurfaceCells(surfaceCandidates, terrainCandidates);
    }

    throw new Error("parent surface did not expose 256 material cells");
  } catch (error) {
    recordError("parent-chain-consumption", error);
    return createFallbackCells();
  }
}

function ensureStyle() {
  if (document.getElementById("h-earth-orbital-inspection-style-v1a")) return;

  const style = document.createElement("style");
  style.id = "h-earth-orbital-inspection-style-v1a";
  style.textContent = `
    [data-h-earth-canvas-panel] {
      width: 100%;
      height: 100%;
      min-height: clamp(420px, 84vw, 760px);
      display: grid;
      place-items: stretch;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    [data-h-earth-canvas-title],
    [data-h-earth-canvas-copy],
    [data-h-earth-canvas-status] {
      display: none;
    }

    [data-h-earth-canvas-stage] {
      width: 100%;
      min-height: clamp(420px, 84vw, 760px);
      display: grid;
      place-items: center;
      overflow: hidden;
      border-radius: 22px;
      background:
        radial-gradient(circle at 50% 44%, rgba(143, 240, 195, 0.10), transparent 18rem),
        radial-gradient(circle at 50% 50%, rgba(142, 190, 255, 0.12), transparent 20rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      touch-action: none;
    }

    [data-h-earth-canvas] {
      width: 100%;
      max-width: 1040px;
      aspect-ratio: 1 / 1;
      display: block;
      margin: auto;
      touch-action: none;
    }
  `;

  document.head.appendChild(style);
}

function findMount() {
  return (
    document.querySelector("[data-h-earth-canvas-mount]") ||
    document.querySelector("[data-showroom-h-earth-inspection-mount]") ||
    document.getElementById("hEarthCanvasCompositionMount") ||
    document.getElementById("h-earth-main") ||
    document.querySelector("main") ||
    document.body
  );
}

function ensurePanel() {
  ensureStyle();

  let panel = document.querySelector("[data-h-earth-canvas-panel]");
  if (panel) return panel;

  const mount = findMount();

  panel = document.createElement("section");
  panel.setAttribute("data-h-earth-canvas-panel", "true");
  panel.setAttribute("aria-label", "H-Earth orbital inspection canvas");
  panel.dataset.contract = H_EARTH_CANVAS_CONTRACT;
  panel.dataset.renewalContract = H_EARTH_CANVAS_RENEWAL_CONTRACT;
  panel.dataset.parentMutationAuthorized = "false";
  panel.dataset.groundLevelReady = "false";
  panel.dataset.manorPlacementReady = "false";
  panel.dataset.estatePlacementReady = "false";
  panel.dataset.generatedImage = "false";
  panel.dataset.graphicBox = "false";

  panel.innerHTML = `
    <h2 data-h-earth-canvas-title>H-Earth Orbital Inspection</h2>
    <p data-h-earth-canvas-copy>Inspection-heavy orbital/aerial surface. Parent truth preserved.</p>
    <div data-h-earth-canvas-stage>
      <canvas
        data-h-earth-canvas
        width="1280"
        height="1280"
        aria-label="H-Earth orbital/aerial inspection canvas"
        role="img"
      ></canvas>
    </div>
    <div data-h-earth-canvas-status aria-live="polite"></div>
  `;

  mount.appendChild(panel);
  return panel;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgbString(value) {
  return `rgb(${Math.round(clamp(value.r, 0, 255))}, ${Math.round(clamp(value.g, 0, 255))}, ${Math.round(clamp(value.b, 0, 255))})`;
}

function shade(hex, light, detail = {}) {
  const base = hexToRgb(hex);
  const lift = Number(detail.colorLift || 0);
  const darken = Number(detail.colorDarken || 0);
  const elevation = Number(detail.elevationShade || 0);
  const adjusted = clamp(light + lift - darken + elevation * 0.08, 0.10, 1.42);

  return rgbString({
    r: base.r * adjusted + 8 * (1 - adjusted),
    g: base.g * adjusted + 9 * (1 - adjusted),
    b: base.b * adjusted + 12 * (1 - adjusted)
  });
}

function clearScene(context, width, height) {
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.76
  );

  gradient.addColorStop(0, "#183a68");
  gradient.addColorStop(0.48, "#071328");
  gradient.addColorStop(1, "#01030a");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawStars(context, width, height) {
  context.save();
  context.globalAlpha = 0.56;

  for (let i = 0; i < 118; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const radius = 0.65 + ((i * 7) % 11) / 15;

    context.beginPath();
    context.fillStyle = i % 10 === 0 ? "rgba(246, 211, 123, 0.72)" : "rgba(225, 238, 255, 0.60)";
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function projectCell(cell, radius, centerX, centerY) {
  const lat = (Number(cell.latitude) * Math.PI) / 180;
  const lon = ((Number(cell.longitude) + STATE.yaw) * Math.PI) / 180;
  const pitch = (STATE.pitch * Math.PI) / 180;

  const x0 = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);

  const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
  const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);
  const x = x0;

  if (z < -0.08) return null;

  const zoom = clamp(STATE.zoom, 0.78, 1.58);

  return {
    x: centerX + x * radius * zoom,
    y: centerY - y * radius * 0.98 * zoom,
    z,
    light: clamp(0.50 + z * 0.44 + y * 0.12 - x * 0.07, 0.20, 1.12)
  };
}

function drawGlobeBase(context, radius, centerX, centerY) {
  const zoom = clamp(STATE.zoom, 0.78, 1.58);
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

  ocean.addColorStop(0, "#2b93b6");
  ocean.addColorStop(0.32, "#0c557e");
  ocean.addColorStop(0.70, "#062144");
  ocean.addColorStop(1, "#020b1c");

  context.fillStyle = ocean;
  context.fillRect(centerX - r * 1.2, centerY - r * 1.2, r * 2.4, r * 2.4);

  context.restore();

  context.save();
  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.strokeStyle = "rgba(183, 222, 240, 0.30)";
  context.lineWidth = Math.max(2, radius * 0.012);
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, r * 1.014, 0, Math.PI * 2);
  context.strokeStyle = "rgba(93, 178, 210, 0.25)";
  context.lineWidth = Math.max(9, radius * 0.034);
  context.stroke();

  context.restore();
}

function drawCellTexture(context, cell, point, radius, baseSize) {
  const detail = cell.detail || {};
  const grain = Number(detail.grain || 0.2);
  const ridge = Number(detail.ridge || 0);
  const valley = Number(detail.valley || 0);
  const coast = Number(detail.coastHardness || 0);
  const count = Math.max(2, Math.min(8, Math.round(2 + grain * 4 + ridge * 3 + coast * 2)));
  const size = baseSize * (0.16 + grain * 0.18);

  context.save();

  if (cell.kind === "ocean") {
    context.globalAlpha = clamp(0.04 + Number(detail.oceanDepthHint || 0) * 0.11, 0.03, 0.15);
    context.strokeStyle = "rgba(160, 230, 255, 0.42)";
  } else if (cell.kind === "coast") {
    context.globalAlpha = clamp(0.12 + coast * 0.22, 0.10, 0.36);
    context.strokeStyle = "rgba(255, 232, 160, 0.74)";
  } else if (cell.kind === "relief") {
    context.globalAlpha = clamp(0.10 + ridge * 0.22, 0.08, 0.36);
    context.strokeStyle = "rgba(255, 242, 205, 0.60)";
  } else if (cell.kind === "ice") {
    context.globalAlpha = 0.18;
    context.strokeStyle = "rgba(235, 250, 255, 0.68)";
  } else {
    context.globalAlpha = clamp(0.07 + grain * 0.10, 0.05, 0.20);
    context.strokeStyle = "rgba(255, 235, 180, 0.40)";
  }

  context.lineWidth = Math.max(0.7, radius * 0.0016);

  for (let i = 0; i < count; i += 1) {
    const offset = (i - count / 2) * size * 1.35;
    const bend = Math.sin((cell.index + i) * 1.17) * size * 0.72;
    const length = size * (2.2 + ridge * 2.0);

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

  if (valley > 0.18 && cell.kind !== "ocean") {
    context.globalAlpha = clamp(0.04 + valley * 0.10, 0.03, 0.17);
    context.strokeStyle = "rgba(0, 0, 0, 0.58)";
    context.beginPath();
    context.moveTo(point.x - size * 2.2, point.y + size * 1.2);
    context.quadraticCurveTo(point.x, point.y + size * 2.2, point.x + size * 2.2, point.y + size * 0.9);
    context.stroke();
  }

  context.restore();
}

function drawCells(context, cells, radius, centerX, centerY) {
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY);
    if (!point) continue;
    projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  context.save();

  const clippedRadius = radius * clamp(STATE.zoom, 0.78, 1.58) * 0.998;
  context.beginPath();
  context.arc(centerX, centerY, clippedRadius, 0, Math.PI * 2);
  context.clip();

  let painted = 0;

  for (const { cell, point } of projected) {
    if (!cell.assignedSurface || !cell.material) continue;

    const detail = cell.detail || {};
    const ridge = Number(detail.ridge || 0);
    const coast = Number(detail.coastHardness || 0);
    const color = shade(cell.color || colorForMaterial(cell.material, cell.kind), point.light, detail);
    const baseSize = radius * 0.066 * (0.72 + point.z * 0.38) * clamp(STATE.zoom, 0.78, 1.58);

    context.beginPath();

    if (cell.kind === "ocean") {
      const depth = Number(detail.oceanDepthHint || 0.2);
      context.globalAlpha = 0.42 + point.z * 0.16 - depth * 0.04;
      context.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.02, 0, Math.PI * 2);
    } else if (cell.kind === "relief") {
      const lift = 1 + ridge * 0.32;
      context.globalAlpha = 0.88;
      context.moveTo(point.x, point.y - baseSize * 0.74 * lift);
      context.lineTo(point.x + baseSize * 0.68, point.y - baseSize * 0.18);
      context.lineTo(point.x + baseSize * 0.48, point.y + baseSize * 0.58);
      context.lineTo(point.x - baseSize * 0.52, point.y + baseSize * 0.48);
      context.lineTo(point.x - baseSize * 0.72, point.y - baseSize * 0.12);
      context.closePath();
    } else if (cell.kind === "ice") {
      context.globalAlpha = 0.91;
      context.ellipse(point.x, point.y, baseSize * 0.66, baseSize * 0.48, 0.04, 0, Math.PI * 2);
    } else if (cell.kind === "coast") {
      context.globalAlpha = 0.84 + coast * 0.10;
      context.ellipse(point.x, point.y, baseSize * 0.78, baseSize * 0.48, 0.10, 0, Math.PI * 2);
    } else {
      context.globalAlpha = 0.82;
      context.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.08, 0, Math.PI * 2);
    }

    context.fillStyle = color;
    context.fill();

    if (cell.kind !== "ocean") {
      context.globalAlpha = cell.kind === "coast"
        ? clamp(0.20 + coast * 0.36, 0.18, 0.62)
        : cell.kind === "relief"
          ? clamp(0.18 + ridge * 0.26, 0.16, 0.50)
          : 0.18;

      context.strokeStyle = cell.kind === "coast"
        ? "rgba(255, 235, 170, 0.72)"
        : cell.kind === "ice"
          ? "rgba(240, 252, 255, 0.54)"
          : "rgba(255, 236, 178, 0.34)";

      context.lineWidth = Math.max(0.7, radius * (0.002 + coast * 0.002 + ridge * 0.0015));
      context.stroke();
    }

    drawCellTexture(context, cell, point, radius, baseSize);
    painted += 1;
  }

  context.restore();
  STATE.cellsPainted = painted;
}

function drawAtmosphere(context, radius, centerX, centerY) {
  const zoom = clamp(STATE.zoom, 0.78, 1.58);
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

  highlight.addColorStop(0, "rgba(255, 238, 184, 0.23)");
  highlight.addColorStop(0.34, "rgba(255, 238, 184, 0.045)");
  highlight.addColorStop(0.74, "rgba(0, 0, 0, 0.02)");
  highlight.addColorStop(1, "rgba(0, 0, 0, 0.54)");

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.fillStyle = highlight;
  context.fill();

  const terminator = context.createLinearGradient(centerX - r, centerY, centerX + r, centerY);
  terminator.addColorStop(0, "rgba(255, 235, 175, 0.05)");
  terminator.addColorStop(0.45, "rgba(0, 0, 0, 0.0)");
  terminator.addColorStop(0.78, "rgba(0, 0, 0, 0.34)");
  terminator.addColorStop(1, "rgba(0, 0, 0, 0.64)");

  context.beginPath();
  context.arc(centerX, centerY, r, 0, Math.PI * 2);
  context.fillStyle = terminator;
  context.fill();

  context.beginPath();
  context.arc(centerX, centerY, r * 1.018, 0, Math.PI * 2);
  context.strokeStyle = "rgba(112, 218, 226, 0.24)";
  context.lineWidth = Math.max(10, radius * 0.030);
  context.stroke();

  context.restore();
}

function drawTitle(context, width, height) {
  context.save();

  context.fillStyle = "rgba(246, 211, 123, 0.92)";
  context.font = `${Math.max(18, width * 0.026)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.textAlign = "center";
  context.fillText("H-Earth", width / 2, height * 0.075);

  context.fillStyle = "rgba(243, 227, 189, 0.72)";
  context.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.fillText("Orbital land-state inspection · drag to rotate", width / 2, height * 0.108);

  context.restore();
}

function measureNonBlank(context, width, height) {
  try {
    const step = 8;
    const data = context.getImageData(0, 0, width, height).data;
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

    STATE.nonBlankPixelRatio = sampled > 0 ? nonBlank / sampled : 0;
  } catch (error) {
    STATE.nonBlankPixelRatio = 0;
    recordError("nonblank-pixel-proof", error);
  }
}

function renderComposition() {
  if (!STATE.canvas || !STATE.context || !STATE.cells.length) return getHEarthCanvasStatus();

  const canvas = STATE.canvas;
  const context = STATE.context;
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) * 0.34;
  const centerX = width * 0.5;
  const centerY = height * 0.52;

  clearScene(context, width, height);
  drawStars(context, width, height);
  drawGlobeBase(context, radius, centerX, centerY);
  drawCells(context, STATE.cells, radius, centerX, centerY);
  drawAtmosphere(context, radius, centerX, centerY);
  drawTitle(context, width, height);
  measureNonBlank(context, width, height);

  STATE.renderStatus = "inspection-heavy-orbital-visual-definition-painted";
  STATE.renderedAt = new Date().toISOString();

  stampDocument();
  return getHEarthCanvasStatus();
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.hEarthCanvasReceipt = H_EARTH_CANVAS_CONTRACT;
  root.dataset.hEarthCanvasRenewalReceipt = H_EARTH_CANVAS_RENEWAL_CONTRACT;
  root.dataset.hEarthCanvasPreviousReceipt = H_EARTH_CANVAS_PREVIOUS_CONTRACT;
  root.dataset.hEarthCanvas = STATE.renderStatus;
  root.dataset.hEarthCanvasReady = String(STATE.booted);
  root.dataset.hEarthParentSurfaceReady = String(STATE.parentSurfaceReady);
  root.dataset.hEarthCellsResolved = String(STATE.cellsResolved);
  root.dataset.hEarthCellsPainted = String(STATE.cellsPainted);
  root.dataset.hEarthCanvasControlsReceiptAligned = "true";
  root.dataset.hEarthCanvasControlsStatus = STATE.controlsStatus;
  root.dataset.hEarthCanvasControlsAuthorized = "true";

  root.dataset.definitiveLandStateRequired = String(DEFINITIVE_LAND_STATE_REQUIRED);
  root.dataset.landStateClassificationRequired = String(LAND_STATE_CLASSIFICATION_REQUIRED);
  root.dataset.elevationSeaLevelBound = String(ELEVATION_SEA_LEVEL_BOUND);
  root.dataset.terrainDetailConsumptionActive = String(TERRAIN_DETAIL_CONSUMPTION_ACTIVE);
  root.dataset.orbitalAerialDefinitionActive = String(ORBITAL_AERIAL_DEFINITION_ACTIVE);

  root.dataset.groundLevelReady = "false";
  root.dataset.manorPlacementReady = "false";
  root.dataset.estatePlacementReady = "false";
  root.dataset.groundLevelHoldReason = GROUND_LEVEL_HOLD_REASON;
  root.dataset.manorPlacementHoldReason = MANOR_PLACEMENT_HOLD_REASON;
  root.dataset.estatePlacementHoldReason = ESTATE_PLACEMENT_HOLD_REASON;

  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
  root.dataset.visualPassClaim = "false";
}

function exposeApi() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    renewalReceipt: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,

    boot: bootHEarthCanvas,
    bootHEarthCanvas,

    status: getHEarthCanvasStatus,
    getStatus: getHEarthCanvasStatus,
    getHEarthCanvasStatus,

    setView: setHEarthCanvasView,
    renderView: setHEarthCanvasView,
    setHEarthCanvasView,

    redraw: renderComposition,
    redrawActiveCanvas: renderComposition,

    refreshControlsStatus: refreshHEarthCanvasControlsStatus,
    refreshHEarthCanvasControlsStatus
  };

  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_CANVAS = api;
  window.H_EARTH_CANVAS_RECEIPT = H_EARTH_CANVAS_CONTRACT;
  window.H_EARTH_CANVAS_RENEWAL_RECEIPT = H_EARTH_CANVAS_RENEWAL_CONTRACT;

  stampDocument();
}

function setHEarthCanvasView({ yaw, pitch, zoom } = {}) {
  if (Number.isFinite(Number(yaw))) STATE.yaw = Number(yaw);
  if (Number.isFinite(Number(pitch))) STATE.pitch = clamp(Number(pitch), -65, 65);
  if (Number.isFinite(Number(zoom))) STATE.zoom = clamp(Number(zoom), 0.78, 1.58);

  return renderComposition();
}

function refreshHEarthCanvasControlsStatus(controlsStatus = null) {
  if (isObject(controlsStatus)) {
    const yaw = controlsStatus.yaw ?? controlsStatus.rotation ?? controlsStatus.rotationRadians;
    const pitch = controlsStatus.pitch ?? controlsStatus.tilt ?? controlsStatus.tiltRadians;
    const zoom = controlsStatus.zoom;

    if (Number.isFinite(Number(yaw))) {
      STATE.yaw = Math.abs(Number(yaw)) <= Math.PI * 2 ? (Number(yaw) * 180) / Math.PI : Number(yaw);
    }

    if (Number.isFinite(Number(pitch))) {
      STATE.pitch = clamp(Math.abs(Number(pitch)) <= Math.PI * 2 ? (Number(pitch) * 180) / Math.PI : Number(pitch), -65, 65);
    }

    if (Number.isFinite(Number(zoom))) {
      STATE.zoom = clamp(Number(zoom), 0.78, 1.58);
    }
  }

  STATE.controlsStatus = "active-motion-input-authority";
  STATE.controlsAuthorized = true;
  STATE.motionAuthorized = true;
  STATE.inputAuthorized = true;
  STATE.canvasControlsReceiptAligned = true;

  return renderComposition();
}

async function bootHEarthCanvas() {
  if (STATE.booted) return getHEarthCanvasStatus();

  STATE.bootedAt = new Date().toISOString();
  STATE.renderStatus = "booting";

  const panel = ensurePanel();
  const canvas = panel.querySelector("[data-h-earth-canvas]");
  const context = canvas?.getContext("2d", { alpha: false });

  if (!canvas || !context) {
    STATE.renderStatus = "failed-no-canvas-context";
    exposeApi();
    return getHEarthCanvasStatus();
  }

  STATE.panel = panel;
  STATE.canvas = canvas;
  STATE.context = context;

  try {
    const parentCells = await importParentChain();
    const cells = attachDetail(parentCells);

    STATE.cells = cells;
    summarizeCells(cells);

    STATE.booted = true;
    STATE.renderStatus = "parent-surface-consumed";
    renderComposition();
  } catch (error) {
    recordError("boot", error);
    STATE.cells = attachDetail(createFallbackCells());
    summarizeCells(STATE.cells);
    STATE.booted = true;
    STATE.renderStatus = "fallback-inspection-surface-painted";
    renderComposition();
  }

  exposeApi();
  return getHEarthCanvasStatus();
}

function getHEarthCanvasStatus() {
  return {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    renewalReceipt: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,

    surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,

    definitiveLandStateRequired: DEFINITIVE_LAND_STATE_REQUIRED,
    landStateClassificationRequired: LAND_STATE_CLASSIFICATION_REQUIRED,
    elevationSeaLevelBound: ELEVATION_SEA_LEVEL_BOUND,
    terrainDetailConsumptionActive: TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
    orbitalAerialDefinitionActive: ORBITAL_AERIAL_DEFINITION_ACTIVE,

    parentReceipts: { ...STATE.parentReceipts },
    parentSurfaceReady: STATE.parentSurfaceReady,
    downstreamCanvasMayReadSurface: STATE.downstreamCanvasMayReadSurface,

    cellsResolved: STATE.cellsResolved,
    cellsPainted: STATE.cellsPainted,
    surfaceMaterialClasses: STATE.surfaceMaterialClasses,
    landCells: STATE.landCells,
    oceanCells: STATE.oceanCells,
    coastCells: STATE.coastCells,
    reliefCells: STATE.reliefCells,
    iceCells: STATE.iceCells,

    yaw: STATE.yaw,
    pitch: STATE.pitch,
    zoom: STATE.zoom,

    renderStatus: STATE.renderStatus,
    nonBlankPixelRatio: STATE.nonBlankPixelRatio,

    controlsReceipt: STATE.controlsReceipt,
    controlsStatus: STATE.controlsStatus,
    controlsAuthorized: STATE.controlsAuthorized,
    motionAuthorized: STATE.motionAuthorized,
    inputAuthorized: STATE.inputAuthorized,
    canvasControlsReceiptAligned: STATE.canvasControlsReceiptAligned,

    groundLevelReady: GROUND_LEVEL_READY,
    manorPlacementReady: MANOR_PLACEMENT_READY,
    estatePlacementReady: ESTATE_PLACEMENT_READY,
    groundLevelHoldReason: GROUND_LEVEL_HOLD_REASON,
    manorPlacementHoldReason: MANOR_PLACEMENT_HOLD_REASON,
    estatePlacementHoldReason: ESTATE_PLACEMENT_HOLD_REASON,

    parentMutationAuthorized: PARENT_MUTATION_AUTHORIZED,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,

    booted: STATE.booted,
    bootedAt: STATE.bootedAt,
    renderedAt: STATE.renderedAt,
    errors: [...STATE.errors]
  };
}

exposeApi();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bootHEarthCanvas();
  }, { once: true });
} else {
  bootHEarthCanvas();
}

export {
  H_EARTH_CANVAS_CONTRACT,
  H_EARTH_CANVAS_RENEWAL_CONTRACT,
  H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  H_EARTH_SURFACE_RECEIPT_EXPECTED,
  DEFINITIVE_LAND_STATE_REQUIRED,
  LAND_STATE_CLASSIFICATION_REQUIRED,
  ELEVATION_SEA_LEVEL_BOUND,
  TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
  ORBITAL_AERIAL_DEFINITION_ACTIVE,
  GROUND_LEVEL_READY,
  MANOR_PLACEMENT_READY,
  ESTATE_PLACEMENT_READY,
  PARENT_MUTATION_AUTHORIZED,
  bootHEarthCanvas,
  getHEarthCanvasStatus,
  setHEarthCanvasView,
  refreshHEarthCanvasControlsStatus
};

export default {
  contract: H_EARTH_CANVAS_CONTRACT,
  receipt: H_EARTH_CANVAS_CONTRACT,
  renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
  renewalReceipt: H_EARTH_CANVAS_RENEWAL_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  boot: bootHEarthCanvas,
  bootHEarthCanvas,
  status: getHEarthCanvasStatus,
  getStatus: getHEarthCanvasStatus,
  getHEarthCanvasStatus,
  setView: setHEarthCanvasView,
  renderView: setHEarthCanvasView,
  setHEarthCanvasView,
  refreshControlsStatus: refreshHEarthCanvasControlsStatus,
  refreshHEarthCanvasControlsStatus
};
