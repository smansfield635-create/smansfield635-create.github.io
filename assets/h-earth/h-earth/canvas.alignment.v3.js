// /assets/h-earth/h-earth/canvas.alignment.v3.js
// H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1
// Full-file replacement.
// H-Earth canvas child authority only.
//
// Compatibility:
// - Keeps the legacy canvas receipt expected by the current H-Earth route.
// - Adds a renewal receipt for the visual-definition LEAP pass.
//
// Purpose:
// - Improve H-Earth orbital/aerial visual definition.
// - Preserve parent truth.
// - Consume parent surface truth.
// - Optionally consume terrain elevation/detail children if available.
// - Improve land/ocean/coast/elevation/ice/relief readability.
// - Keep ground level, manor placement, and estate placement held.
// - Keep parent mutation forbidden.

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const H_EARTH_CANVAS_RENEWAL_CONTRACT = "H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1";
const H_EARTH_CANVAS_PREVIOUS_CONTRACT = "H_EARTH_G1_GLOBE_DIRECT_CANVAS_VIEW_BRIDGE_TNT_v12A";

const H_EARTH_SURFACE_RECEIPT_EXPECTED = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";

const H_EARTH_CONTROLS_EXPECTED = Object.freeze([
  "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1",
  "H_EARTH_G1_INTERACTIVE_CONTROLS_REFINEMENT_TNT_v2"
]);

const ELEVATION_CHILD_PATH = "/assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js";
const TERRAIN_DETAIL_CHILD_PATH = "/assets/h-earth/h-earth/canvas/terrain/detail.js";

const ELEVATION_CHILD_EXPECTED = "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_DETAIL_BINDING_CHILD_TNT_v2";
const TERRAIN_DETAIL_CHILD_EXPECTED = "H_EARTH_G1_CANVAS_TERRAIN_DETAIL_CHILD_TNT_v1";

const H_EARTH_PARENT_EXPECTED = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1"
});

const H_EARTH_PARENT_MODULES = Object.freeze([
  { key: "kernel", path: "/assets/h-earth/h-earth.kernel.js", requiredExport: "createHEarthKernel" },
  { key: "lattice256", path: "/assets/h-earth/h-earth.lattice256.js", requiredExport: "createHEarthLattice256" },
  { key: "landmap", path: "/assets/h-earth/h-earth.landmap.js", requiredExport: "createHEarthLandmap" },
  { key: "terrain", path: "/assets/h-earth/h-earth.terrain.js", requiredExport: "createHEarthTerrain" },
  { key: "surface", path: "/assets/h-earth/h-earth.surface.js", requiredExport: "createHEarthSurface" }
]);

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

const MATERIAL_PALETTE = Object.freeze({
  "abyssal-ocean": "#061327",
  "deep-ocean": "#08264e",
  "open-ocean": "#0d4774",
  "ocean-water": "#15577f",
  "basin-mouth-water": "#1f718e",
  "coastal-shelf-water": "#2f91a0",
  "reef-shelf-water": "#45b8b2",

  "coastal-shelf-ground": "#6f8f69",
  "beach-sediment": "#d0b37b",
  "archipelago-ground": "#879a55",
  "island-ground": "#7f9f55",
  "lowland-ground": "#648d47",
  "grassland-ground": "#5f8f43",
  "forest-ground": "#2f6639",
  "wetland-ground": "#3e7051",
  "basin-ground": "#6b744b",
  "valley-ground": "#527f42",

  "highland-ground": "#817a4e",
  "ridge-ground": "#8f7652",
  "canyon-stone": "#9a684a",
  "cliff-stone": "#7d6d5f",
  "coastal-stone": "#80786a",
  "mountain-stone": "#999487",
  "highland-stone": "#8c8678",
  "mineral-stone": "#b3834f",
  "volcanic-stone": "#4b4544",

  "ice-cap": "#e7f4f7",
  "glacier-ice": "#c8e6ef",
  "snow-highland": "#edf2f4"
});

const H_EARTH_CANVAS_STATE = {
  contract: H_EARTH_CANVAS_CONTRACT,
  renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,

  parentConsumptionMode: "pending",
  parentInstances: {},
  parentReceipts: {},
  parentModules: {},
  staleParentContracts: 0,

  parentSurfaceReady: false,
  downstreamCanvasMayReadSurface: false,
  surfaceReceiptFound: false,

  elevationChildReady: false,
  terrainDetailChildReady: false,
  terrainDetailConsumptionActive: false,

  cellsResolved: 0,
  cellsPainted: 0,
  surfaceMaterialClasses: 0,
  landCells: 0,
  oceanCells: 0,
  coastCells: 0,
  iceCells: 0,
  reliefCells: 0,

  nonBlankPixelRatio: 0,
  renderStatus: "not-started",

  yaw: -18,
  pitch: 8,
  zoom: 1,
  viewMode: "orbital-aerial-definition",

  controlsReceipt: "pending",
  controlsStatus: "held",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  canvasControlsReceiptAligned: false,

  parentMutationAuthorized: false,
  groundLevelReady: false,
  manorPlacementReady: false,
  estatePlacementReady: false,

  errors: [],
  bootedAt: null,
  renderedAt: null,
  controlsAlignedAt: null
};

let BOOT_PROMISE = null;
let ACTIVE_CELLS = [];
let ACTIVE_TERRAIN_CHILDREN = null;
let ACTIVE_CANVAS = null;
let ACTIVE_CTX = null;

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

function deterministicNoise(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function recordError(label, error) {
  H_EARTH_CANVAS_STATE.errors.push({
    label,
    message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  });
}

function cacheSuffix() {
  return `v=${encodeURIComponent(H_EARTH_CANVAS_RENEWAL_CONTRACT)}-${Date.now()}`;
}

function moduleUrl(path) {
  return `${path}?${cacheSuffix()}`;
}

function readContractFrom(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!isObject(value)) return "";

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
    const found = value[key];
    if (typeof found === "string" && found.trim()) return found.trim();
  }

  if (isObject(value.receipts)) {
    for (const receiptValue of Object.values(value.receipts)) {
      const nested = readContractFrom(receiptValue);
      if (nested) return nested;
    }
  }

  if (isObject(value.default)) {
    const nestedDefault = readContractFrom(value.default);
    if (nestedDefault) return nestedDefault;
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

function kindFromMaterial(material, cell = {}) {
  const name = normalizeName(material);

  if (name.includes("ocean") || name.includes("water") || name.includes("reef")) return "ocean";
  if (name.includes("ice") || name.includes("snow") || name.includes("glacier")) return "ice";

  if (
    name.includes("stone") ||
    name.includes("mountain") ||
    name.includes("cliff") ||
    name.includes("canyon") ||
    name.includes("volcanic") ||
    name.includes("mineral") ||
    name.includes("ridge")
  ) {
    return "relief";
  }

  if (name.includes("beach") || name.includes("sediment") || name.includes("coastal") || name.includes("shelf")) {
    return name.includes("water") ? "ocean" : "coast";
  }

  if (
    name.includes("ground") ||
    name.includes("forest") ||
    name.includes("land") ||
    name.includes("island") ||
    name.includes("archipelago") ||
    name.includes("valley") ||
    name.includes("basin") ||
    name.includes("wetland")
  ) {
    return "land";
  }

  if (isObject(cell)) {
    if (cell.isOcean === true || cell.ocean === true || cell.water === true) return "ocean";
    if (cell.isLand === true || cell.land === true) return "land";
  }

  return "unknown";
}

function colorForMaterial(material, kind) {
  const name = normalizeName(material);

  if (MATERIAL_PALETTE[name]) return MATERIAL_PALETTE[name];

  if (name.includes("abyss")) return MATERIAL_PALETTE["abyssal-ocean"];
  if (name.includes("deep") && name.includes("ocean")) return MATERIAL_PALETTE["deep-ocean"];
  if (name.includes("ocean")) return MATERIAL_PALETTE["open-ocean"];
  if (name.includes("water")) return MATERIAL_PALETTE["basin-mouth-water"];
  if (name.includes("reef")) return MATERIAL_PALETTE["reef-shelf-water"];
  if (name.includes("shelf")) return MATERIAL_PALETTE["coastal-shelf-water"];
  if (name.includes("beach")) return MATERIAL_PALETTE["beach-sediment"];
  if (name.includes("archipelago")) return MATERIAL_PALETTE["archipelago-ground"];
  if (name.includes("island")) return MATERIAL_PALETTE["island-ground"];
  if (name.includes("forest")) return MATERIAL_PALETTE["forest-ground"];
  if (name.includes("wetland")) return MATERIAL_PALETTE["wetland-ground"];
  if (name.includes("basin")) return MATERIAL_PALETTE["basin-ground"];
  if (name.includes("valley")) return MATERIAL_PALETTE["valley-ground"];
  if (name.includes("highland")) return MATERIAL_PALETTE["highland-ground"];
  if (name.includes("ridge")) return MATERIAL_PALETTE["ridge-ground"];
  if (name.includes("canyon")) return MATERIAL_PALETTE["canyon-stone"];
  if (name.includes("cliff")) return MATERIAL_PALETTE["cliff-stone"];
  if (name.includes("mineral")) return MATERIAL_PALETTE["mineral-stone"];
  if (name.includes("volcanic")) return MATERIAL_PALETTE["volcanic-stone"];
  if (name.includes("stone") || name.includes("mountain")) return MATERIAL_PALETTE["mountain-stone"];
  if (name.includes("ice")) return MATERIAL_PALETTE["glacier-ice"];
  if (name.includes("snow")) return MATERIAL_PALETTE["snow-highland"];

  if (kind === "ocean") return MATERIAL_PALETTE["open-ocean"];
  if (kind === "ice") return MATERIAL_PALETTE["glacier-ice"];
  if (kind === "relief") return MATERIAL_PALETTE["mountain-stone"];
  if (kind === "coast") return MATERIAL_PALETTE["beach-sediment"];
  if (kind === "land") return MATERIAL_PALETTE["lowland-ground"];

  return "#40566a";
}

function callProvider(fn, args) {
  if (typeof fn !== "function") return null;

  for (const argSet of args) {
    try {
      const result = fn(...argSet);
      if (result !== null && result !== undefined) return result;
    } catch {
      continue;
    }
  }

  return null;
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
        candidates.push({
          source: `${label}.${key}`,
          cells
        });
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

    const cells = callProvider(source[provider].bind(source), [
      [],
      [{ readOnly: true }],
      [{ mutationAuthorized: false }],
      [{ readOnly: true, mutationAuthorized: false }]
    ]);

    const arr = toArray(cells);
    if (arr.length >= TOTAL_CELLS) {
      candidates.push({
        source: `${label}.${provider}()`,
        cells: arr
      });
    }
  }

  return candidates;
}

function createBlankCells() {
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
      color: "#40566a",
      assignedSurface: false
    });
  }

  return cells;
}

function normalizeSurfaceCells(surfaceCandidates, terrainCandidates) {
  const cells = createBlankCells();
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
        row: Number.isInteger(item?.row) ? item.row : row,
        col: Number.isInteger(item?.col) ? item.col : col,
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

async function importParentModules() {
  const imported = {};

  for (const entry of H_EARTH_PARENT_MODULES) {
    try {
      const mod = await import(moduleUrl(entry.path));

      if (!mod || typeof mod[entry.requiredExport] !== "function") {
        throw new Error(`required export missing: ${entry.requiredExport}`);
      }

      imported[entry.key] = mod;

      const actual = readContractFrom(mod) || readContractFrom(mod.default) || "contract-not-exported";
      const expected = H_EARTH_PARENT_EXPECTED[entry.key];

      H_EARTH_CANVAS_STATE.parentModules[entry.key] = {
        status: "loaded",
        path: entry.path,
        expected,
        actual
      };

      H_EARTH_CANVAS_STATE.parentReceipts[entry.key] = actual;

      if (actual !== expected) H_EARTH_CANVAS_STATE.staleParentContracts += 1;
    } catch (error) {
      H_EARTH_CANVAS_STATE.parentModules[entry.key] = {
        status: "failed",
        path: entry.path,
        expected: H_EARTH_PARENT_EXPECTED[entry.key],
        actual: "import-failed",
        error: error instanceof Error ? error.message : String(error)
      };
      recordError(`import-${entry.key}`, error);
      throw error;
    }
  }

  return imported;
}

function createParentInstancesFromModules(modules) {
  const kernel = modules.kernel.createHEarthKernel({
    doorwayContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    priorDoorwayContract: H_EARTH_CANVAS_CONTRACT,
    route: "/showroom/globe/h-earth/",
    surfaceActiveReadOnly: true,
    orbitalAerialDefinitionActive: true,
    mutationAuthorized: false,
    controlsAuthorized: false,
    motionAuthorized: false,
    inputAuthorized: false
  });

  const lattice256 = modules.lattice256.createHEarthLattice256({ kernel });
  const landmap = modules.landmap.createHEarthLandmap({ kernel, lattice256 });
  const terrain = modules.terrain.createHEarthTerrain({ kernel, lattice256, landmap });
  const surface = modules.surface.createHEarthSurface({ kernel, lattice256, landmap, terrain });

  return { kernel, lattice256, landmap, terrain, surface };
}

async function resolveParentInstances(context = {}) {
  const passedInstances = context.instances || context.parentInstances || null;

  if (
    passedInstances?.kernel &&
    passedInstances?.lattice256 &&
    passedInstances?.landmap &&
    passedInstances?.terrain &&
    passedInstances?.surface
  ) {
    H_EARTH_CANVAS_STATE.parentConsumptionMode = "route-passed-parent-instances";
    H_EARTH_CANVAS_STATE.parentInstances = passedInstances;
    return passedInstances;
  }

  H_EARTH_CANVAS_STATE.parentConsumptionMode = "canvas-reconstructed-read-only-parent-chain";
  const modules = await importParentModules();
  const instances = createParentInstancesFromModules(modules);
  H_EARTH_CANVAS_STATE.parentInstances = instances;
  return instances;
}

async function resolveTerrainChildren(parentInstances) {
  const result = {
    elevation: null,
    elevationModule: null,
    detail: null,
    detailModule: null,
    ready: false,
    errors: []
  };

  try {
    const elevationModule = await import(moduleUrl(ELEVATION_CHILD_PATH));
    result.elevationModule = elevationModule;

    if (typeof elevationModule.createHEarthCanvasTerrainElevation === "function") {
      result.elevation = elevationModule.createHEarthCanvasTerrainElevation({
        kernel: parentInstances.kernel,
        lattice256: parentInstances.lattice256,
        landmap: parentInstances.landmap,
        terrain: parentInstances.terrain,
        surface: parentInstances.surface
      });
    }

    H_EARTH_CANVAS_STATE.elevationChildReady = Boolean(result.elevation);
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    H_EARTH_CANVAS_STATE.elevationChildReady = false;
  }

  try {
    const detailModule = await import(moduleUrl(TERRAIN_DETAIL_CHILD_PATH));
    result.detailModule = detailModule;

    if (typeof detailModule.createHEarthCanvasTerrainDetail === "function") {
      result.detail = detailModule.createHEarthCanvasTerrainDetail({
        readOnly: true,
        parentMutationAuthorized: false,
        orbitalAerialDefinitionActive: true
      });
    }

    H_EARTH_CANVAS_STATE.terrainDetailChildReady =
      Boolean(result.detail) || typeof detailModule.sampleTerrainDetail === "function";
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    H_EARTH_CANVAS_STATE.terrainDetailChildReady = false;
  }

  result.ready = H_EARTH_CANVAS_STATE.elevationChildReady || H_EARTH_CANVAS_STATE.terrainDetailChildReady;
  H_EARTH_CANVAS_STATE.terrainDetailConsumptionActive = result.ready;

  return result;
}

function readElevationCell(index, children) {
  if (!children?.elevation) return null;

  if (typeof children.elevation.getCellElevation === "function") {
    return children.elevation.getCellElevation(index);
  }

  if (Array.isArray(children.elevation.cells)) {
    return children.elevation.cells[index] || null;
  }

  if (children.elevation.elevationIndex?.[index]) {
    return children.elevation.elevationIndex[index];
  }

  return null;
}

function fallbackElevation(cell) {
  const kind = cell.kind;
  const material = normalizeName(cell.material);
  const base = deterministicNoise(cell.index, 451);

  if (kind === "ocean") {
    if (material.includes("abyss")) return { elevationMeters: -5200, depthMeters: 5200, relativeToSeaLevel: "below-sea-level" };
    if (material.includes("deep")) return { elevationMeters: -2800, depthMeters: 2800, relativeToSeaLevel: "below-sea-level" };
    if (material.includes("shelf") || material.includes("reef")) return { elevationMeters: -70, depthMeters: 70, relativeToSeaLevel: "below-sea-level" };
    return { elevationMeters: -900 - Math.round(base * 900), depthMeters: 900 + Math.round(base * 900), relativeToSeaLevel: "below-sea-level" };
  }

  if (kind === "coast") return { elevationMeters: 4 + Math.round(base * 50), depthMeters: 0, relativeToSeaLevel: "near-sea-level" };
  if (kind === "ice") return { elevationMeters: 1600 + Math.round(base * 3100), depthMeters: 0, relativeToSeaLevel: "above-sea-level" };
  if (kind === "relief") return { elevationMeters: 700 + Math.round(base * 3300), depthMeters: 0, relativeToSeaLevel: "above-sea-level" };

  return { elevationMeters: 30 + Math.round(base * 420), depthMeters: 0, relativeToSeaLevel: "above-sea-level" };
}

function fallbackDetail(cell, elevationCell) {
  const n1 = deterministicNoise(cell.index, 61);
  const n2 = deterministicNoise(cell.index, 256);
  const n3 = deterministicNoise(cell.index, 451);

  const elevationMeters = Number(elevationCell?.elevationMeters || 0);
  const depthMeters = Number(elevationCell?.depthMeters || 0);

  const ridge = cell.kind === "relief" ? 0.55 + n1 * 0.40 : elevationMeters > 900 ? 0.22 + n1 * 0.28 : n1 * 0.12;
  const valley = cell.kind === "land" ? n2 * 0.34 : n2 * 0.12;
  const coastHardness = cell.kind === "coast" ? 0.62 + n3 * 0.30 : cell.kind === "ocean" ? 0.08 : 0.12;
  const oceanDepthHint = cell.kind === "ocean" ? clamp(depthMeters / 5200, 0.12, 1) : 0;
  const iceSoftness = cell.kind === "ice" ? 0.58 + n1 * 0.28 : 0;

  return {
    grain: 0.28 + n1 * 0.48,
    ridge,
    valley,
    slopeShade: n2 * 0.34,
    elevationShade: clamp(elevationMeters / 4800, -1, 1),
    coastHardness,
    oceanDepthHint,
    iceSoftness,
    colorLift: cell.kind === "ice" ? 0.16 : cell.kind === "coast" ? 0.08 : ridge * 0.08,
    colorDarken: cell.kind === "ocean" ? oceanDepthHint * 0.18 : valley * 0.10,
    highlightAlpha: 0.05 + ridge * 0.14 + coastHardness * 0.07,
    shadowAlpha: 0.05 + valley * 0.12 + oceanDepthHint * 0.20,
    microVariation: {
      breakup: n3,
      speckle: n1,
      striation: n2
    }
  };
}

function readDetailSample(cell, elevationCell, children) {
  const input = {
    index: cell.index,
    row: cell.row,
    col: cell.col,
    latitude: cell.latitude,
    longitude: cell.longitude,
    material: cell.material,
    terrainAspect: cell.terrainAspect,
    kind: cell.kind,
    elevationMeters: elevationCell?.elevationMeters,
    depthMeters: elevationCell?.depthMeters,
    elevation: Number.isFinite(Number(elevationCell?.elevationMeters))
      ? clamp(Number(elevationCell.elevationMeters) / 5500, -1, 1)
      : undefined,
    distanceToCoast: cell.kind === "coast" ? 0.04 : cell.kind === "ocean" ? 0.28 : 0.42,
    zoom: H_EARTH_CANVAS_STATE.zoom,
    seed: "h-earth-orbital-visual-definition"
  };

  if (children?.detail && typeof children.detail.sampleTerrainDetail === "function") {
    try {
      return children.detail.sampleTerrainDetail(input);
    } catch {
      return fallbackDetail(cell, elevationCell);
    }
  }

  if (children?.detailModule && typeof children.detailModule.sampleTerrainDetail === "function") {
    try {
      return children.detailModule.sampleTerrainDetail(input);
    } catch {
      return fallbackDetail(cell, elevationCell);
    }
  }

  return fallbackDetail(cell, elevationCell);
}

function bindTerrainChildrenToCells(cells, children) {
  return cells.map((cell) => {
    if (!cell.assignedSurface) return cell;

    const elevationCell = readElevationCell(cell.index, children) || fallbackElevation(cell);
    const detail = readDetailSample(cell, elevationCell, children);

    return {
      ...cell,
      elevation: elevationCell,
      detail
    };
  });
}

function evaluateSurfaceReadiness(parentInstances, cells, surfaceCandidates) {
  const surface = parentInstances.surface;
  const summary = surface?.summary || {};
  const surfaceReceipt = surface?.receipts?.surface?.contract || readContractFrom(surface);

  const assigned = cells.filter((cell) => cell.assignedSurface && cell.material).length;
  const materialSet = new Set(cells.filter((cell) => cell.assignedSurface && cell.material).map((cell) => cell.material));

  const landCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "land").length;
  const oceanCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "ocean").length;
  const coastCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "coast").length;
  const iceCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "ice").length;
  const reliefCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "relief").length;

  const summarySurfaceReady = summary.surfaceParentReady === true || summary.downstreamCanvasMayReadSurface === true;
  const allCellsAssigned = assigned === TOTAL_CELLS;
  const receiptFound = surfaceReceipt === H_EARTH_SURFACE_RECEIPT_EXPECTED;
  const candidateFound = surfaceCandidates.length > 0;

  H_EARTH_CANVAS_STATE.surfaceReceiptFound = receiptFound;
  H_EARTH_CANVAS_STATE.cellsResolved = assigned;
  H_EARTH_CANVAS_STATE.surfaceMaterialClasses = materialSet.size;
  H_EARTH_CANVAS_STATE.landCells = landCells;
  H_EARTH_CANVAS_STATE.oceanCells = oceanCells;
  H_EARTH_CANVAS_STATE.coastCells = coastCells;
  H_EARTH_CANVAS_STATE.iceCells = iceCells;
  H_EARTH_CANVAS_STATE.reliefCells = reliefCells;

  H_EARTH_CANVAS_STATE.parentSurfaceReady =
    (summarySurfaceReady || receiptFound) &&
    allCellsAssigned &&
    candidateFound;

  H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface = H_EARTH_CANVAS_STATE.parentSurfaceReady;

  return H_EARTH_CANVAS_STATE.parentSurfaceReady;
}

function readControlsApiStatus(providedStatus = null) {
  const api = window.DGBHEarthControls || window.HEarthControls || window.H_EARTH_CONTROLS || null;
  let status = providedStatus || null;

  if (!status && api) {
    if (typeof api.getHEarthControlsStatus === "function") status = api.getHEarthControlsStatus();
    else if (typeof api.getStatus === "function") status = api.getStatus();
    else if (typeof api.status === "function") status = api.status();
  }

  const receipt = status?.contract || status?.receipt || window.H_EARTH_CONTROLS_RECEIPT || "pending";
  const receiptAccepted = H_EARTH_CONTROLS_EXPECTED.includes(receipt);

  const active =
    receiptAccepted &&
    status?.status === "active-motion-input-authority" &&
    status?.parentMutationAuthorized !== true;

  H_EARTH_CANVAS_STATE.controlsReceipt = receipt;
  H_EARTH_CANVAS_STATE.controlsStatus = status?.status || (api ? "loaded-held" : "held");
  H_EARTH_CANVAS_STATE.controlsAuthorized = active;
  H_EARTH_CANVAS_STATE.motionAuthorized = active;
  H_EARTH_CANVAS_STATE.inputAuthorized = active;
  H_EARTH_CANVAS_STATE.parentMutationAuthorized = false;
  H_EARTH_CANVAS_STATE.canvasControlsReceiptAligned = active;

  if (active) {
    H_EARTH_CANVAS_STATE.controlsAlignedAt = new Date().toISOString();
  }

  return status;
}

function ensureStyle() {
  if (document.getElementById("h-earth-orbital-visual-definition-style-v1")) return;

  const style = document.createElement("style");
  style.id = "h-earth-orbital-visual-definition-style-v1";
  style.textContent = `
    [data-h-earth-canvas-panel] {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 1rem;
      border: 1px solid rgba(225, 185, 95, 0.34);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 50% 20%, rgba(225, 185, 95, 0.12), transparent 34rem),
        linear-gradient(180deg, rgba(8, 16, 34, 0.96), rgba(4, 8, 18, 0.98));
      color: #f3e3bd;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
    }

    [data-h-earth-canvas-title] {
      margin: 0 0 0.35rem;
      font-size: clamp(1.25rem, 4vw, 2rem);
      line-height: 1.1;
      letter-spacing: 0.02em;
    }

    [data-h-earth-canvas-copy] {
      margin: 0 0 1rem;
      max-width: 76ch;
      color: rgba(243, 227, 189, 0.82);
      line-height: 1.55;
    }

    [data-h-earth-canvas-stage] {
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      min-height: clamp(340px, 70vw, 680px);
      border-radius: 1rem;
      background:
        radial-gradient(circle at 48% 42%, rgba(40, 95, 140, 0.18), transparent 15rem),
        radial-gradient(circle at 70% 30%, rgba(225, 185, 95, 0.12), transparent 14rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      border: 1px solid rgba(255, 255, 255, 0.08);
      touch-action: none;
    }

    [data-h-earth-canvas] {
      width: 100%;
      height: auto;
      max-width: 980px;
      display: block;
      aspect-ratio: 1 / 1;
      touch-action: none;
    }

    [data-h-earth-canvas-status] {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(172px, 1fr));
      gap: 0.65rem;
      margin-top: 0.85rem;
    }

    [data-h-earth-canvas-status] span {
      display: block;
      padding: 0.65rem 0.75rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.055);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(243, 227, 189, 0.88);
      font-size: 0.92rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    [data-h-earth-canvas-status] strong {
      display: block;
      margin-bottom: 0.12rem;
      color: #f6d37b;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  `;

  document.head.appendChild(style);
}

function findCanvasHost() {
  return (
    document.querySelector("[data-h-earth-canvas-mount]") ||
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

  panel = document.createElement("section");
  panel.setAttribute("data-h-earth-canvas-panel", "true");
  panel.setAttribute("aria-label", "H-Earth orbital visual definition");
  panel.innerHTML = `
    <h2 data-h-earth-canvas-title>H-Earth Orbital Visual Definition</h2>
    <p data-h-earth-canvas-copy>
      H-Earth is rendering from parent surface truth with orbital/aerial land-state definition active.
      Ground level, manor placement, and estate placement remain held.
    </p>
    <div data-h-earth-canvas-stage>
      <canvas
        data-h-earth-canvas
        width="1280"
        height="1280"
        aria-label="H-Earth orbital/aerial visual definition canvas"
        role="img"
      ></canvas>
    </div>
    <div data-h-earth-canvas-status aria-live="polite"></div>
  `;

  findCanvasHost().appendChild(panel);
  return panel;
}

function setStatus(panel) {
  readControlsApiStatus();

  const target = panel.querySelector("[data-h-earth-canvas-status]");
  if (!target) return;

  target.innerHTML = `
    <span><strong>Contract</strong>${H_EARTH_CANVAS_CONTRACT}</span>
    <span><strong>Renewal</strong>${H_EARTH_CANVAS_RENEWAL_CONTRACT}</span>
    <span><strong>Parent surface ready</strong>${String(H_EARTH_CANVAS_STATE.parentSurfaceReady)}</span>
    <span><strong>Cells resolved</strong>${H_EARTH_CANVAS_STATE.cellsResolved}/${TOTAL_CELLS}</span>
    <span><strong>Cells painted</strong>${H_EARTH_CANVAS_STATE.cellsPainted}/${TOTAL_CELLS}</span>
    <span><strong>Land / ocean</strong>${H_EARTH_CANVAS_STATE.landCells} / ${H_EARTH_CANVAS_STATE.oceanCells}</span>
    <span><strong>Coast / relief / ice</strong>${H_EARTH_CANVAS_STATE.coastCells} / ${H_EARTH_CANVAS_STATE.reliefCells} / ${H_EARTH_CANVAS_STATE.iceCells}</span>
    <span><strong>Elevation child</strong>${String(H_EARTH_CANVAS_STATE.elevationChildReady)}</span>
    <span><strong>Terrain detail child</strong>${String(H_EARTH_CANVAS_STATE.terrainDetailChildReady)}</span>
    <span><strong>Render status</strong>${H_EARTH_CANVAS_STATE.renderStatus}</span>
    <span><strong>View</strong>yaw ${H_EARTH_CANVAS_STATE.yaw.toFixed(1)} · pitch ${H_EARTH_CANVAS_STATE.pitch.toFixed(1)} · zoom ${H_EARTH_CANVAS_STATE.zoom.toFixed(2)}</span>
    <span><strong>Ground/manor/estate</strong>held / held / held</span>
  `;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgbToString({ r, g, b }) {
  return `rgb(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))})`;
}

function shade(hex, light, detail = null) {
  const base = hexToRgb(hex);

  const lift = detail ? Number(detail.colorLift || 0) : 0;
  const darken = detail ? Number(detail.colorDarken || 0) : 0;
  const elevation = detail ? Number(detail.elevationShade || 0) : 0;

  const adjusted = clamp(light + lift - darken + elevation * 0.08, 0.10, 1.42);

  return rgbToString({
    r: base.r * adjusted + 10 * (1 - adjusted),
    g: base.g * adjusted + 10 * (1 - adjusted),
    b: base.b * adjusted + 12 * (1 - adjusted)
  });
}

function clearScene(ctx, width, height) {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.76
  );

  gradient.addColorStop(0, "#17345d");
  gradient.addColorStop(0.50, "#071328");
  gradient.addColorStop(1, "#01030a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.58;

  for (let i = 0; i < 150; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = 0.65 + ((i * 7) % 11) / 14;

    ctx.beginPath();
    ctx.fillStyle = i % 10 === 0 ? "rgba(246, 211, 123, 0.74)" : "rgba(225, 238, 255, 0.62)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function projectCell(cell, radius, centerX, centerY) {
  const lat = (Number(cell.latitude) * Math.PI) / 180;
  const lon = ((Number(cell.longitude) + H_EARTH_CANVAS_STATE.yaw) * Math.PI) / 180;
  const pitch = (H_EARTH_CANVAS_STATE.pitch * Math.PI) / 180;

  const x0 = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);

  const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
  const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);
  const x = x0;

  if (z < -0.06) return null;

  const zoom = clamp(H_EARTH_CANVAS_STATE.zoom, 0.78, 1.55);

  return {
    x: centerX + x * radius * zoom,
    y: centerY - y * radius * 0.98 * zoom,
    z,
    light: clamp(0.50 + z * 0.44 + y * 0.12 - x * 0.07, 0.20, 1.12)
  };
}

function drawGlobeBase(ctx, radius, centerX, centerY) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * H_EARTH_CANVAS_STATE.zoom, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    centerX - radius * 0.35,
    centerY - radius * 0.34,
    radius * 0.1,
    centerX,
    centerY,
    radius * 1.16
  );

  ocean.addColorStop(0, "#2a8db2");
  ocean.addColorStop(0.33, "#0c4c78");
  ocean.addColorStop(0.70, "#061f43");
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(centerX - radius * 1.7, centerY - radius * 1.7, radius * 3.4, radius * 3.4);

  ctx.restore();

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * H_EARTH_CANVAS_STATE.zoom, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(183, 222, 240, 0.28)";
  ctx.lineWidth = Math.max(2, radius * 0.011);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * H_EARTH_CANVAS_STATE.zoom * 1.012, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(93, 178, 210, 0.24)";
  ctx.lineWidth = Math.max(10, radius * 0.035);
  ctx.stroke();

  ctx.restore();
}

function drawOceanDepth(ctx, projected, radius) {
  ctx.save();

  for (const { cell, point } of projected) {
    if (cell.kind !== "ocean") continue;

    const detail = cell.detail || {};
    const depth = Number(detail.oceanDepthHint || 0.2);
    const shadow = Number(detail.shadowAlpha || 0.08);
    const size = radius * (0.055 + depth * 0.038) * (0.72 + point.z * 0.40);

    ctx.globalAlpha = clamp(0.06 + depth * 0.18 + shadow * 0.16, 0.04, 0.34);
    ctx.fillStyle = "rgba(1, 8, 26, 0.88)";

    ctx.beginPath();
    ctx.ellipse(point.x, point.y, size * 1.35, size * 0.72, 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDetailTexture(ctx, cell, point, radius, baseSize) {
  const detail = cell.detail || {};
  const grain = Number(detail.grain || 0);
  const ridge = Number(detail.ridge || 0);
  const valley = Number(detail.valley || 0);
  const coast = Number(detail.coastHardness || 0);
  const speckle = Number(detail.microVariation?.speckle || deterministicNoise(cell.index, 17));
  const striation = Number(detail.microVariation?.striation || deterministicNoise(cell.index, 23));

  const count = Math.max(2, Math.min(9, Math.round(2 + grain * 4 + ridge * 3 + coast * 2)));
  const size = baseSize * (0.18 + grain * 0.18);

  ctx.save();

  if (cell.kind === "ocean") {
    ctx.globalAlpha = clamp(0.04 + Number(detail.oceanDepthHint || 0) * 0.10, 0.03, 0.14);
    ctx.strokeStyle = "rgba(160, 230, 255, 0.40)";
  } else if (cell.kind === "coast") {
    ctx.globalAlpha = clamp(0.12 + coast * 0.20, 0.10, 0.34);
    ctx.strokeStyle = "rgba(255, 232, 160, 0.74)";
  } else if (cell.kind === "relief") {
    ctx.globalAlpha = clamp(0.10 + ridge * 0.22, 0.08, 0.36);
    ctx.strokeStyle = "rgba(255, 242, 205, 0.60)";
  } else if (cell.kind === "ice") {
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(235, 250, 255, 0.68)";
  } else {
    ctx.globalAlpha = clamp(0.07 + grain * 0.10, 0.05, 0.20);
    ctx.strokeStyle = "rgba(255, 235, 180, 0.40)";
  }

  ctx.lineWidth = Math.max(0.7, radius * 0.0016);

  for (let i = 0; i < count; i += 1) {
    const offset = (i - count / 2) * size * 1.35;
    const bend = Math.sin((cell.index + i) * 1.17 + speckle * 4) * size * 0.72;
    const length = size * (2.2 + striation * 2.0 + ridge * 2.0);

    ctx.beginPath();
    ctx.moveTo(point.x - length * 0.5, point.y + offset * 0.26 + bend);
    ctx.quadraticCurveTo(
      point.x,
      point.y + offset * 0.10 - bend,
      point.x + length * 0.5,
      point.y + offset * 0.26 + bend * 0.4
    );
    ctx.stroke();
  }

  if (valley > 0.18 && cell.kind !== "ocean") {
    ctx.globalAlpha = clamp(0.04 + valley * 0.10, 0.03, 0.17);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.58)";
    ctx.beginPath();
    ctx.moveTo(point.x - size * 2.2, point.y + size * 1.2);
    ctx.quadraticCurveTo(point.x, point.y + size * 2.2, point.x + size * 2.2, point.y + size * 0.9);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCells(ctx, cells, radius, centerX, centerY) {
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY);
    if (!point) continue;
    projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();

  const clippedRadius = radius * clamp(H_EARTH_CANVAS_STATE.zoom, 0.78, 1.55) * 0.998;
  ctx.beginPath();
  ctx.arc(centerX, centerY, clippedRadius, 0, Math.PI * 2);
  ctx.clip();

  drawOceanDepth(ctx, projected, radius);

  let painted = 0;

  for (const { cell, point } of projected) {
    if (!cell.assignedSurface || !cell.material) continue;

    const detail = cell.detail || {};
    const ridge = Number(detail.ridge || 0);
    const coast = Number(detail.coastHardness || 0);
    const ice = Number(detail.iceSoftness || 0);
    const elevationShade = Number(detail.elevationShade || 0);

    const color = shade(cell.color || colorForMaterial(cell.material, cell.kind), point.light, detail);
    const baseSize = radius * 0.066 * (0.72 + point.z * 0.38) * clamp(H_EARTH_CANVAS_STATE.zoom, 0.78, 1.55);

    ctx.beginPath();

    if (cell.kind === "ocean") {
      const depth = Number(detail.oceanDepthHint || 0.2);
      ctx.globalAlpha = 0.42 + point.z * 0.16 - depth * 0.04;
      ctx.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.02, 0, Math.PI * 2);
    } else if (cell.kind === "relief") {
      const lift = 1 + ridge * 0.32 + Math.max(0, elevationShade) * 0.18;
      ctx.globalAlpha = 0.88;
      ctx.moveTo(point.x, point.y - baseSize * 0.74 * lift);
      ctx.lineTo(point.x + baseSize * 0.68, point.y - baseSize * 0.18);
      ctx.lineTo(point.x + baseSize * 0.48, point.y + baseSize * 0.58);
      ctx.lineTo(point.x - baseSize * 0.52, point.y + baseSize * 0.48);
      ctx.lineTo(point.x - baseSize * 0.72, point.y - baseSize * 0.12);
      ctx.closePath();
    } else if (cell.kind === "ice") {
      ctx.globalAlpha = 0.90 + ice * 0.06;
      ctx.ellipse(point.x, point.y, baseSize * 0.66, baseSize * 0.48, 0.04, 0, Math.PI * 2);
    } else if (cell.kind === "coast") {
      ctx.globalAlpha = 0.84 + coast * 0.10;
      ctx.ellipse(point.x, point.y, baseSize * 0.78, baseSize * 0.48, 0.10, 0, Math.PI * 2);
    } else {
      ctx.globalAlpha = 0.82;
      ctx.ellipse(point.x, point.y, baseSize * 0.74, baseSize * 0.52, 0.08, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();

    if (cell.kind !== "ocean") {
      ctx.globalAlpha = cell.kind === "coast"
        ? clamp(0.20 + coast * 0.36, 0.18, 0.62)
        : cell.kind === "relief"
          ? clamp(0.18 + ridge * 0.26, 0.16, 0.50)
          : 0.18;

      ctx.strokeStyle = cell.kind === "coast"
        ? "rgba(255, 235, 170, 0.72)"
        : cell.kind === "ice"
          ? "rgba(240, 252, 255, 0.54)"
          : "rgba(255, 236, 178, 0.34)";

      ctx.lineWidth = Math.max(0.7, radius * (0.002 + coast * 0.002 + ridge * 0.0015));
      ctx.stroke();
    }

    drawDetailTexture(ctx, cell, point, radius, baseSize);

    painted += 1;
  }

  ctx.restore();
  H_EARTH_CANVAS_STATE.cellsPainted = painted;
}

function drawAtmosphereAndLight(ctx, radius, centerX, centerY) {
  const zoom = clamp(H_EARTH_CANVAS_STATE.zoom, 0.78, 1.55);
  const r = radius * zoom;

  ctx.save();

  const highlight = ctx.createRadialGradient(
    centerX - r * 0.34,
    centerY - r * 0.36,
    r * 0.08,
    centerX,
    centerY,
    r * 1.08
  );

  highlight.addColorStop(0, "rgba(255, 238, 184, 0.22)");
  highlight.addColorStop(0.34, "rgba(255, 238, 184, 0.045)");
  highlight.addColorStop(0.72, "rgba(0, 0, 0, 0.02)");
  highlight.addColorStop(1, "rgba(0, 0, 0, 0.54)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  const terminator = ctx.createLinearGradient(centerX - r, centerY, centerX + r, centerY);
  terminator.addColorStop(0, "rgba(255, 235, 175, 0.05)");
  terminator.addColorStop(0.45, "rgba(0, 0, 0, 0.0)");
  terminator.addColorStop(0.78, "rgba(0, 0, 0, 0.34)");
  terminator.addColorStop(1, "rgba(0, 0, 0, 0.64)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  ctx.fillStyle = terminator;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, r * 1.018, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(112, 218, 226, 0.24)";
  ctx.lineWidth = Math.max(10, radius * 0.030);
  ctx.stroke();

  ctx.restore();
}

function drawTitle(ctx, width, height) {
  ctx.save();

  ctx.fillStyle = "rgba(246, 211, 123, 0.92)";
  ctx.font = `${Math.max(18, width * 0.026)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth · Orbital Land-State Definition", width / 2, height * 0.075);

  ctx.fillStyle = "rgba(243, 227, 189, 0.72)";
  ctx.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Parent truth preserved · terrain children consumed · ground and manor held", width / 2, height * 0.108);

  ctx.restore();
}

function drawHeld(ctx, canvas, reason) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  clearScene(ctx, width, height);
  drawStars(ctx, width, height);

  ctx.save();
  ctx.fillStyle = "rgba(246, 211, 123, 0.92)";
  ctx.font = `${Math.max(22, width * 0.03)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth Canvas Held", width / 2, height * 0.43);

  ctx.fillStyle = "rgba(243, 227, 189, 0.76)";
  ctx.font = `${Math.max(14, width * 0.018)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(reason, width / 2, height * 0.48);
  ctx.fillText("Canvas did not invent replacement surface truth.", width / 2, height * 0.52);
  ctx.restore();

  H_EARTH_CANVAS_STATE.renderStatus = "held-parent-surface-not-resolved";
  H_EARTH_CANVAS_STATE.cellsPainted = 0;
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

    H_EARTH_CANVAS_STATE.nonBlankPixelRatio = sampled > 0 ? nonBlank / sampled : 0;
  } catch (error) {
    H_EARTH_CANVAS_STATE.nonBlankPixelRatio = 0;
    recordError("nonblank-pixel-proof", error);
  }
}

function renderComposition(canvas, cells) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    H_EARTH_CANVAS_STATE.renderStatus = "failed-no-2d-context";
    return;
  }

  ACTIVE_CANVAS = canvas;
  ACTIVE_CTX = ctx;
  ACTIVE_CELLS = cells;

  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) * 0.34;
  const centerX = width * 0.5;
  const centerY = height * 0.52;

  clearScene(ctx, width, height);
  drawStars(ctx, width, height);
  drawGlobeBase(ctx, radius, centerX, centerY);
  drawCells(ctx, cells, radius, centerX, centerY);
  drawAtmosphereAndLight(ctx, radius, centerX, centerY);
  drawTitle(ctx, width, height);
  measureNonBlank(ctx, width, height);

  H_EARTH_CANVAS_STATE.renderStatus = "orbital-visual-definition-painted-from-parent-surface-and-terrain-children";
  H_EARTH_CANVAS_STATE.renderedAt = new Date().toISOString();

  exposeCanvasApi();
}

function redrawActiveCanvas() {
  if (!ACTIVE_CANVAS || !ACTIVE_CELLS.length) return getHEarthCanvasStatus();
  renderComposition(ACTIVE_CANVAS, ACTIVE_CELLS);

  const panel = document.querySelector("[data-h-earth-canvas-panel]");
  if (panel) setStatus(panel);

  return getHEarthCanvasStatus();
}

function setHEarthCanvasView({ yaw, pitch, zoom } = {}) {
  if (Number.isFinite(Number(yaw))) H_EARTH_CANVAS_STATE.yaw = Number(yaw);
  if (Number.isFinite(Number(pitch))) H_EARTH_CANVAS_STATE.pitch = clamp(Number(pitch), -65, 65);
  if (Number.isFinite(Number(zoom))) H_EARTH_CANVAS_STATE.zoom = clamp(Number(zoom), 0.78, 1.55);

  return redrawActiveCanvas();
}

function refreshHEarthCanvasControlsStatus(controlsStatus = null) {
  readControlsApiStatus(controlsStatus);

  if (controlsStatus && isObject(controlsStatus)) {
    const yaw = controlsStatus.yaw ?? controlsStatus.rotation ?? controlsStatus.rotationRadians;
    const pitch = controlsStatus.pitch ?? controlsStatus.tilt ?? controlsStatus.tiltRadians;
    const zoom = controlsStatus.zoom;

    if (Number.isFinite(Number(yaw))) {
      const value = Math.abs(Number(yaw)) <= Math.PI * 2 ? (Number(yaw) * 180) / Math.PI : Number(yaw);
      H_EARTH_CANVAS_STATE.yaw = value;
    }

    if (Number.isFinite(Number(pitch))) {
      const value = Math.abs(Number(pitch)) <= Math.PI * 2 ? (Number(pitch) * 180) / Math.PI : Number(pitch);
      H_EARTH_CANVAS_STATE.pitch = clamp(value, -65, 65);
    }

    if (Number.isFinite(Number(zoom))) {
      H_EARTH_CANVAS_STATE.zoom = clamp(Number(zoom), 0.78, 1.55);
    }

    redrawActiveCanvas();
  }

  const panel = document.querySelector("[data-h-earth-canvas-panel]");
  if (panel) setStatus(panel);

  exposeCanvasApi();
  return getHEarthCanvasStatus();
}

function exposeCanvasApi() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    renewalReceipt: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,

    status: getHEarthCanvasStatus,
    getStatus: getHEarthCanvasStatus,
    getHEarthCanvasStatus,

    boot: bootHEarthCanvas,
    bootHEarthCanvas,

    redraw: redrawActiveCanvas,
    redrawActiveCanvas,

    setView: setHEarthCanvasView,
    renderView: setHEarthCanvasView,
    setHEarthCanvasView,

    refreshControlsStatus: refreshHEarthCanvasControlsStatus,
    refreshHEarthCanvasControlsStatus,

    controlsAuthorized: () => H_EARTH_CANVAS_STATE.controlsAuthorized,
    motionAuthorized: () => H_EARTH_CANVAS_STATE.motionAuthorized,
    inputAuthorized: () => H_EARTH_CANVAS_STATE.inputAuthorized
  };

  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_CANVAS = api;
  window.H_EARTH_CANVAS_RECEIPT = H_EARTH_CANVAS_CONTRACT;
  window.H_EARTH_CANVAS_RENEWAL_RECEIPT = H_EARTH_CANVAS_RENEWAL_CONTRACT;

  document.documentElement.dataset.hEarthCanvas = H_EARTH_CANVAS_STATE.renderStatus;
  document.documentElement.dataset.hEarthCanvasReceipt = H_EARTH_CANVAS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasRenewalReceipt = H_EARTH_CANVAS_RENEWAL_CONTRACT;
  document.documentElement.dataset.hEarthCanvasPreviousReceipt = H_EARTH_CANVAS_PREVIOUS_CONTRACT;

  document.documentElement.dataset.definitiveLandStateRequired = String(DEFINITIVE_LAND_STATE_REQUIRED);
  document.documentElement.dataset.landStateClassificationRequired = String(LAND_STATE_CLASSIFICATION_REQUIRED);
  document.documentElement.dataset.elevationSeaLevelBound = String(ELEVATION_SEA_LEVEL_BOUND);
  document.documentElement.dataset.terrainDetailConsumptionActive = String(TERRAIN_DETAIL_CONSUMPTION_ACTIVE);
  document.documentElement.dataset.orbitalAerialDefinitionActive = String(ORBITAL_AERIAL_DEFINITION_ACTIVE);

  document.documentElement.dataset.groundLevelReady = String(GROUND_LEVEL_READY);
  document.documentElement.dataset.manorPlacementReady = String(MANOR_PLACEMENT_READY);
  document.documentElement.dataset.estatePlacementReady = String(ESTATE_PLACEMENT_READY);
  document.documentElement.dataset.groundLevelHoldReason = GROUND_LEVEL_HOLD_REASON;
  document.documentElement.dataset.manorPlacementHoldReason = MANOR_PLACEMENT_HOLD_REASON;
  document.documentElement.dataset.estatePlacementHoldReason = ESTATE_PLACEMENT_HOLD_REASON;

  document.documentElement.dataset.hEarthCanvasControlsReceiptAligned = String(H_EARTH_CANVAS_STATE.canvasControlsReceiptAligned);
  document.documentElement.dataset.hEarthCanvasControlsStatus = H_EARTH_CANVAS_STATE.controlsStatus;
  document.documentElement.dataset.hEarthCanvasControlsAuthorized = String(H_EARTH_CANVAS_STATE.controlsAuthorized);

  document.documentElement.dataset.hEarthParentMutationAuthorized = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaim = "false";
}

async function bootHEarthCanvas(context = {}) {
  if (BOOT_PROMISE) return BOOT_PROMISE;

  BOOT_PROMISE = (async () => {
    H_EARTH_CANVAS_STATE.bootedAt = new Date().toISOString();
    H_EARTH_CANVAS_STATE.renderStatus = "booting-orbital-visual-definition";

    const panel = ensurePanel();
    const canvas = panel.querySelector("[data-h-earth-canvas]");

    if (!canvas) {
      H_EARTH_CANVAS_STATE.renderStatus = "failed-no-canvas-element";
      setStatus(panel);
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    }

    try {
      const parentInstances = await resolveParentInstances(context);
      const surface = parentInstances.surface;
      const terrain = parentInstances.terrain;

      H_EARTH_CANVAS_STATE.parentReceipts.surface =
        surface?.receipts?.surface?.contract || readContractFrom(surface) || "missing";

      H_EARTH_CANVAS_STATE.parentReceipts.terrain =
        readContractFrom(terrain) || "missing";

      const surfaceCandidates = collectCandidates(surface, "surface");
      const terrainCandidates = collectCandidates(terrain, "terrain");

      let cells = normalizeSurfaceCells(surfaceCandidates, terrainCandidates);
      const ready = evaluateSurfaceReadiness(parentInstances, cells, surfaceCandidates);

      if (!ready) {
        drawHeld(canvas, "Parent surface did not expose 256 material cells.");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) measureNonBlank(ctx, canvas.width, canvas.height);

        setStatus(panel);
        exposeCanvasApi();
        return getHEarthCanvasStatus();
      }

      ACTIVE_TERRAIN_CHILDREN = await resolveTerrainChildren(parentInstances);
      cells = bindTerrainChildrenToCells(cells, ACTIVE_TERRAIN_CHILDREN);

      renderComposition(canvas, cells);
      setStatus(panel);
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    } catch (error) {
      recordError("boot-orbital-visual-definition", error);

      drawHeld(canvas, "Canvas failed while consuming parent surface truth.");
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) measureNonBlank(ctx, canvas.width, canvas.height);

      H_EARTH_CANVAS_STATE.renderStatus = "failed-orbital-visual-definition";
      setStatus(panel);
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    }
  })();

  return BOOT_PROMISE;
}

function getHEarthCanvasStatus() {
  readControlsApiStatus();

  return {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    renewalReceipt: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,

    surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,
    elevationChildExpected: ELEVATION_CHILD_EXPECTED,
    terrainDetailChildExpected: TERRAIN_DETAIL_CHILD_EXPECTED,

    definitiveLandStateRequired: DEFINITIVE_LAND_STATE_REQUIRED,
    landStateClassificationRequired: LAND_STATE_CLASSIFICATION_REQUIRED,
    elevationSeaLevelBound: ELEVATION_SEA_LEVEL_BOUND,
    terrainDetailConsumptionActive: H_EARTH_CANVAS_STATE.terrainDetailConsumptionActive,
    orbitalAerialDefinitionActive: ORBITAL_AERIAL_DEFINITION_ACTIVE,

    parentConsumptionMode: H_EARTH_CANVAS_STATE.parentConsumptionMode,
    parentModules: { ...H_EARTH_CANVAS_STATE.parentModules },
    parentReceipts: { ...H_EARTH_CANVAS_STATE.parentReceipts },
    staleParentContracts: H_EARTH_CANVAS_STATE.staleParentContracts,

    surfaceReceiptFound: H_EARTH_CANVAS_STATE.surfaceReceiptFound,
    parentSurfaceReady: H_EARTH_CANVAS_STATE.parentSurfaceReady,
    downstreamCanvasMayReadSurface: H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface,

    elevationChildReady: H_EARTH_CANVAS_STATE.elevationChildReady,
    terrainDetailChildReady: H_EARTH_CANVAS_STATE.terrainDetailChildReady,

    cellsResolved: H_EARTH_CANVAS_STATE.cellsResolved,
    cellsPainted: H_EARTH_CANVAS_STATE.cellsPainted,
    surfaceMaterialClasses: H_EARTH_CANVAS_STATE.surfaceMaterialClasses,
    landCells: H_EARTH_CANVAS_STATE.landCells,
    oceanCells: H_EARTH_CANVAS_STATE.oceanCells,
    coastCells: H_EARTH_CANVAS_STATE.coastCells,
    iceCells: H_EARTH_CANVAS_STATE.iceCells,
    reliefCells: H_EARTH_CANVAS_STATE.reliefCells,

    yaw: H_EARTH_CANVAS_STATE.yaw,
    pitch: H_EARTH_CANVAS_STATE.pitch,
    zoom: H_EARTH_CANVAS_STATE.zoom,

    nonBlankPixelRatio: H_EARTH_CANVAS_STATE.nonBlankPixelRatio,
    renderStatus: H_EARTH_CANVAS_STATE.renderStatus,

    controlsReceipt: H_EARTH_CANVAS_STATE.controlsReceipt,
    controlsStatus: H_EARTH_CANVAS_STATE.controlsStatus,
    controlsAuthorized: H_EARTH_CANVAS_STATE.controlsAuthorized,
    motionAuthorized: H_EARTH_CANVAS_STATE.motionAuthorized,
    inputAuthorized: H_EARTH_CANVAS_STATE.inputAuthorized,
    canvasControlsReceiptAligned: H_EARTH_CANVAS_STATE.canvasControlsReceiptAligned,

    groundLevelReady: GROUND_LEVEL_READY,
    manorPlacementReady: MANOR_PLACEMENT_READY,
    estatePlacementReady: ESTATE_PLACEMENT_READY,
    groundLevelHoldReason: GROUND_LEVEL_HOLD_REASON,
    manorPlacementHoldReason: MANOR_PLACEMENT_HOLD_REASON,
    estatePlacementHoldReason: ESTATE_PLACEMENT_HOLD_REASON,

    parentMutationAuthorized: PARENT_MUTATION_AUTHORIZED,
    earthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,

    bootedAt: H_EARTH_CANVAS_STATE.bootedAt,
    renderedAt: H_EARTH_CANVAS_STATE.renderedAt,
    controlsAlignedAt: H_EARTH_CANVAS_STATE.controlsAlignedAt,
    errors: [...H_EARTH_CANVAS_STATE.errors]
  };
}

exposeCanvasApi();

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
  ELEVATION_CHILD_EXPECTED,
  TERRAIN_DETAIL_CHILD_EXPECTED,
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
  refreshHEarthCanvasControlsStatus,
  setHEarthCanvasView,
  redrawActiveCanvas
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
  refreshControlsStatus: refreshHEarthCanvasControlsStatus,
  refreshHEarthCanvasControlsStatus,
  setView: setHEarthCanvasView,
  renderView: setHEarthCanvasView,
  setHEarthCanvasView,
  redraw: redrawActiveCanvas,
  redrawActiveCanvas
};
