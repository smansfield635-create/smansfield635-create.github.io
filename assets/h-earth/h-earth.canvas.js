// /assets/h-earth/h-earth.canvas.js
// H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2
// Full-file replacement.
// Canvas child authority only.
//
// Purpose:
// - Correct the failed canvas consumer bridge.
// - Build or receive the complete read-only parent chain:
//   kernel → lattice256 → landmap → terrain → surface.
// - Consume the created surface parent instance.
// - Resolve 256 assigned surface cells.
// - Paint visible H-Earth composition from surface material truth.
// - Keep controls, motion, drag, spin, and input authority held.
//
// Owns:
// - visible composition
// - canvas receipt
// - canvas status
// - surface-consumption proof
// - nonblank pixel proof
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - controls
// - motion
// - input
// - Earth mutation
// - Hearth mutation
// - Audralia mutation

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2";
const H_EARTH_CANVAS_PREVIOUS_CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1";
const H_EARTH_SURFACE_RECEIPT_EXPECTED = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";

const H_EARTH_PARENT_EXPECTED = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1"
});

const H_EARTH_PARENT_MODULES = Object.freeze([
  {
    key: "kernel",
    path: "/assets/h-earth/h-earth.kernel.js",
    requiredExport: "createHEarthKernel"
  },
  {
    key: "lattice256",
    path: "/assets/h-earth/h-earth.lattice256.js",
    requiredExport: "createHEarthLattice256"
  },
  {
    key: "landmap",
    path: "/assets/h-earth/h-earth.landmap.js",
    requiredExport: "createHEarthLandmap"
  },
  {
    key: "terrain",
    path: "/assets/h-earth/h-earth.terrain.js",
    requiredExport: "createHEarthTerrain"
  },
  {
    key: "surface",
    path: "/assets/h-earth/h-earth.surface.js",
    requiredExport: "createHEarthSurface"
  }
]);

const H_EARTH_TOTAL_CELLS = 256;
const H_EARTH_GRID_SIZE = 16;

const H_EARTH_CANVAS_STATE = {
  contract: H_EARTH_CANVAS_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,
  routeAuthority: "none",
  canvasJurisdiction: "visible-composition-only",
  canvasPrecinct: "h-earth-canvas-composition-mount",
  parentConsumptionMode: "pending",
  parentModules: {},
  parentInstances: {},
  parentReceipts: {},
  staleParentContracts: 0,
  parentSurfaceReady: false,
  downstreamCanvasMayReadSurface: false,
  surfaceReceiptFound: false,
  cellsResolved: 0,
  cellsPainted: 0,
  surfaceMaterialClasses: 0,
  landCells: 0,
  oceanCells: 0,
  nonBlankPixelRatio: 0,
  renderStatus: "not-started",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  errors: [],
  bootedAt: null,
  renderedAt: null
};

let H_EARTH_CANVAS_BOOT_PROMISE = null;

const MATERIAL_PALETTE = Object.freeze({
  "abyssal-ocean": "#06142d",
  "deep-ocean": "#0b2b59",
  "open-ocean": "#124977",
  "ocean-water": "#15557d",
  "basin-mouth-water": "#1f6f8f",
  "coastal-shelf-water": "#2a8798",
  "reef-shelf-water": "#34a5a7",
  "coastal-shelf-ground": "#567f67",
  "beach-sediment": "#c7a86c",
  "archipelago-ground": "#708c4a",
  "island-ground": "#78984f",
  "lowland-ground": "#607f42",
  "grassland-ground": "#5b7f3e",
  "forest-ground": "#315d34",
  "wetland-ground": "#365f4b",
  "basin-ground": "#607044",
  "valley-ground": "#4e743e",
  "highland-ground": "#73734b",
  "ridge-ground": "#7c7350",
  "canyon-stone": "#8e6448",
  "cliff-stone": "#766256",
  "coastal-stone": "#736d5f",
  "mountain-stone": "#8d8980",
  "highland-stone": "#817d72",
  "mineral-stone": "#a37a4e",
  "volcanic-stone": "#49423f",
  "ice-cap": "#dceff4",
  "glacier-ice": "#bfdee9",
  "snow-highland": "#e7edf0"
});

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function isObject(value) {
  return value !== null && typeof value === "object";
}

function recordError(label, error) {
  H_EARTH_CANVAS_STATE.errors.push({
    label,
    message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  });
}

function cacheSuffix() {
  return `v=${encodeURIComponent(H_EARTH_CANVAS_CONTRACT)}-${Date.now()}`;
}

function moduleUrl(path) {
  return `${path}?${cacheSuffix()}`;
}

function normalizeName(value) {
  return safeString(value)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
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

  return "";
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

function indexFromCell(cell, fallbackIndex) {
  if (!isObject(cell)) return fallbackIndex;

  const keys = [
    "index",
    "cellIndex",
    "cell_index",
    "cellId",
    "cell_id",
    "stateId",
    "state_id",
    "id",
    "i"
  ];

  for (const key of keys) {
    const raw = cell[key];

    if (Number.isInteger(raw) && raw >= 0 && raw < H_EARTH_TOTAL_CELLS) {
      return raw;
    }

    if (typeof raw === "string" && /^\d+$/.test(raw)) {
      const parsed = Number(raw);
      if (parsed >= 0 && parsed < H_EARTH_TOTAL_CELLS) return parsed;
    }
  }

  const row = Number.isInteger(cell.row) ? cell.row : Number.isInteger(cell.r) ? cell.r : null;
  const col = Number.isInteger(cell.col) ? cell.col : Number.isInteger(cell.c) ? cell.c : null;

  if (row !== null && col !== null) {
    const index = row * H_EARTH_GRID_SIZE + col;
    if (index >= 0 && index < H_EARTH_TOTAL_CELLS) return index;
  }

  return fallbackIndex;
}

function kindFromMaterial(material, cell) {
  const name = normalizeName(material);

  if (
    name.includes("ocean") ||
    name.includes("water") ||
    name.includes("shelf") ||
    name.includes("reef")
  ) {
    return "ocean";
  }

  if (name.includes("ice") || name.includes("snow") || name.includes("glacier")) {
    return "ice";
  }

  if (
    name.includes("stone") ||
    name.includes("mountain") ||
    name.includes("cliff") ||
    name.includes("canyon") ||
    name.includes("volcanic") ||
    name.includes("mineral")
  ) {
    return "stone";
  }

  if (name.includes("beach") || name.includes("sediment") || name.includes("coastal")) {
    return "coast";
  }

  if (
    name.includes("ground") ||
    name.includes("forest") ||
    name.includes("land") ||
    name.includes("island") ||
    name.includes("archipelago") ||
    name.includes("valley") ||
    name.includes("ridge") ||
    name.includes("basin")
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
  if (kind === "stone") return MATERIAL_PALETTE["mountain-stone"];
  if (kind === "coast") return MATERIAL_PALETTE["beach-sediment"];
  if (kind === "land") return MATERIAL_PALETTE["lowland-ground"];

  return "#2d4050";
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
    if (numericKeys.length >= H_EARTH_TOTAL_CELLS) {
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

function callProvider(fn, args) {
  if (typeof fn !== "function") return null;

  for (const argSet of args) {
    try {
      const result = fn(...argSet);
      if (result !== null && result !== undefined) return result;
    } catch (error) {
      continue;
    }
  }

  return null;
}

function collectSurfaceCandidates(surface, parentInstances) {
  const candidates = [];

  const directKeys = [
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

  const nestedRoots = [
    surface,
    surface?.surface,
    surface?.materialIndex,
    surface?.surfaceIndex,
    surface?.cellIndex,
    surface?.map,
    surface?.dataset
  ].filter(Boolean);

  for (const root of nestedRoots) {
    for (const key of directKeys) {
      if (root && Object.prototype.hasOwnProperty.call(root, key)) {
        const arr = toArray(root[key]);
        if (arr.length >= H_EARTH_TOTAL_CELLS) candidates.push({ label: `surface.${key}`, cells: arr });
      }
    }
  }

  const providerNames = [
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

  for (const name of providerNames) {
    const provider = surface?.[name];
    if (typeof provider !== "function") continue;

    const result = callProvider(provider.bind(surface), [
      [],
      [{ readOnly: true }],
      [parentInstances],
      [{ ...parentInstances, readOnly: true }]
    ]);

    const arr = toArray(result);
    if (arr.length >= H_EARTH_TOTAL_CELLS) {
      candidates.push({ label: `surface.${name}()`, cells: arr });
    }
  }

  return candidates;
}

function createBlankCells() {
  const cells = [];

  for (let index = 0; index < H_EARTH_TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / H_EARTH_GRID_SIZE);
    const col = index % H_EARTH_GRID_SIZE;

    cells.push({
      index,
      row,
      col,
      latitude: 90 - ((row + 0.5) / H_EARTH_GRID_SIZE) * 180,
      longitude: -180 + ((col + 0.5) / H_EARTH_GRID_SIZE) * 360,
      material: "",
      kind: "unknown",
      color: "#2d4050",
      assignedSurface: false
    });
  }

  return cells;
}

function normalizeSurfaceCells(candidates) {
  const cells = createBlankCells();

  for (const candidate of candidates) {
    for (let fallbackIndex = 0; fallbackIndex < Math.min(candidate.cells.length, H_EARTH_TOTAL_CELLS); fallbackIndex += 1) {
      const item = candidate.cells[fallbackIndex];
      const index = indexFromCell(item, fallbackIndex);
      if (index < 0 || index >= H_EARTH_TOTAL_CELLS) continue;

      const material = materialFromCell(item);
      if (!material) continue;

      const kind = kindFromMaterial(material, item);
      const row = Math.floor(index / H_EARTH_GRID_SIZE);
      const col = index % H_EARTH_GRID_SIZE;

      cells[index] = {
        ...(isObject(item) ? item : {}),
        index,
        row: Number.isInteger(item?.row) ? item.row : row,
        col: Number.isInteger(item?.col) ? item.col : col,
        latitude: Number.isFinite(Number(item?.latitude))
          ? Number(item.latitude)
          : 90 - ((row + 0.5) / H_EARTH_GRID_SIZE) * 180,
        longitude: Number.isFinite(Number(item?.longitude))
          ? Number(item.longitude)
          : -180 + ((col + 0.5) / H_EARTH_GRID_SIZE) * 360,
        material,
        kind,
        color: colorForMaterial(material, kind),
        assignedSurface: true,
        sourceLabel: candidate.label
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

      const actual = readContractFrom(mod) || "contract-not-exported";
      const expected = H_EARTH_PARENT_EXPECTED[entry.key];

      H_EARTH_CANVAS_STATE.parentModules[entry.key] = {
        status: "loaded",
        path: entry.path,
        expected,
        actual
      };

      H_EARTH_CANVAS_STATE.parentReceipts[entry.key] = actual;

      if (actual !== expected) {
        H_EARTH_CANVAS_STATE.staleParentContracts += 1;
      }
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
    doorwayContract: H_EARTH_CANVAS_CONTRACT,
    priorDoorwayContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    route: "/showroom/globe/h-earth/",
    surfaceActiveReadOnly: true,
    canvasParentInstanceConsumer: true,
    mutationAuthorized: false,
    controlsAuthorized: false,
    motionAuthorized: false
  });

  const lattice256 = modules.lattice256.createHEarthLattice256({ kernel });

  const landmap = modules.landmap.createHEarthLandmap({
    kernel,
    lattice256
  });

  const terrain = modules.terrain.createHEarthTerrain({
    kernel,
    lattice256,
    landmap
  });

  const surface = modules.surface.createHEarthSurface({
    kernel,
    lattice256,
    landmap,
    terrain
  });

  return {
    kernel,
    lattice256,
    landmap,
    terrain,
    surface
  };
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

function evaluateSurfaceReadiness(parentInstances, cells, candidates) {
  const surface = parentInstances.surface;
  const summary = surface?.summary || {};
  const surfaceReceipt = surface?.receipts?.surface?.contract || readContractFrom(surface);

  const assigned = cells.filter((cell) => cell.assignedSurface && cell.material).length;
  const materialSet = new Set(cells.filter((cell) => cell.assignedSurface && cell.material).map((cell) => cell.material));

  const landCells = cells.filter((cell) => {
    if (!cell.assignedSurface) return false;
    return cell.kind === "land" || cell.kind === "stone" || cell.kind === "coast" || cell.kind === "ice";
  }).length;

  const oceanCells = cells.filter((cell) => cell.assignedSurface && cell.kind === "ocean").length;

  const summarySurfaceReady = summary.surfaceParentReady === true;
  const summaryCanvasMayRead = summary.downstreamCanvasMayReadSurface === true;
  const allCellsAssigned = assigned === H_EARTH_TOTAL_CELLS;
  const receiptFound = surfaceReceipt === H_EARTH_SURFACE_RECEIPT_EXPECTED;
  const candidateFound = candidates.length > 0;

  H_EARTH_CANVAS_STATE.surfaceReceiptFound = receiptFound;
  H_EARTH_CANVAS_STATE.cellsResolved = assigned;
  H_EARTH_CANVAS_STATE.surfaceMaterialClasses = materialSet.size;
  H_EARTH_CANVAS_STATE.landCells = landCells;
  H_EARTH_CANVAS_STATE.oceanCells = oceanCells;
  H_EARTH_CANVAS_STATE.parentSurfaceReady =
    summarySurfaceReady &&
    summaryCanvasMayRead &&
    allCellsAssigned &&
    candidateFound;

  H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface = H_EARTH_CANVAS_STATE.parentSurfaceReady;

  return H_EARTH_CANVAS_STATE.parentSurfaceReady;
}

function ensureStyle() {
  if (document.getElementById("h-earth-canvas-consumer-style-v2")) return;

  const style = document.createElement("style");
  style.id = "h-earth-canvas-consumer-style-v2";
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
      min-height: clamp(320px, 68vw, 620px);
      border-radius: 1rem;
      background:
        radial-gradient(circle at 48% 42%, rgba(40, 95, 140, 0.18), transparent 15rem),
        radial-gradient(circle at 70% 30%, rgba(225, 185, 95, 0.12), transparent 14rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    [data-h-earth-canvas] {
      width: 100%;
      height: auto;
      max-width: 920px;
      display: block;
      aspect-ratio: 1 / 1;
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
  panel.setAttribute("aria-label", "H-Earth canvas visible composition");
  panel.innerHTML = `
    <h2 data-h-earth-canvas-title>H-Earth Canvas Visible Composition</h2>
    <p data-h-earth-canvas-copy>
      Canvas is active as a downstream visual child. It reconstructs the read-only parent chain when route instances are not passed, then reads the created surface parent and paints visible composition only. Controls remain held.
    </p>
    <div data-h-earth-canvas-stage>
      <canvas
        data-h-earth-canvas
        width="1200"
        height="1200"
        aria-label="H-Earth visible composition canvas"
        role="img"
      ></canvas>
    </div>
    <div data-h-earth-canvas-status aria-live="polite"></div>
  `;

  findCanvasHost().appendChild(panel);
  return panel;
}

function setStatus(panel) {
  const target = panel.querySelector("[data-h-earth-canvas-status]");
  if (!target) return;

  target.innerHTML = `
    <span><strong>Contract</strong>${H_EARTH_CANVAS_CONTRACT}</span>
    <span><strong>Previous</strong>${H_EARTH_CANVAS_PREVIOUS_CONTRACT}</span>
    <span><strong>Consumption mode</strong>${H_EARTH_CANVAS_STATE.parentConsumptionMode}</span>
    <span><strong>Parent surface ready</strong>${String(H_EARTH_CANVAS_STATE.parentSurfaceReady)}</span>
    <span><strong>Canvas may read surface</strong>${String(H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface)}</span>
    <span><strong>Cells resolved</strong>${H_EARTH_CANVAS_STATE.cellsResolved}/${H_EARTH_TOTAL_CELLS}</span>
    <span><strong>Cells painted</strong>${H_EARTH_CANVAS_STATE.cellsPainted}/${H_EARTH_TOTAL_CELLS}</span>
    <span><strong>Material classes</strong>${H_EARTH_CANVAS_STATE.surfaceMaterialClasses}</span>
    <span><strong>Land / ocean cells</strong>${H_EARTH_CANVAS_STATE.landCells} / ${H_EARTH_CANVAS_STATE.oceanCells}</span>
    <span><strong>Nonblank pixel proof</strong>${H_EARTH_CANVAS_STATE.nonBlankPixelRatio.toFixed(4)}</span>
    <span><strong>Render status</strong>${H_EARTH_CANVAS_STATE.renderStatus}</span>
    <span><strong>Controls</strong>held</span>
  `;
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

  gradient.addColorStop(0, "#132a4d");
  gradient.addColorStop(0.54, "#061126");
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
  const lon = ((Number(cell.longitude) + 28) * Math.PI) / 180;

  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon);

  if (z < -0.06) return null;

  return {
    x: centerX + x * radius,
    y: centerY - y * radius * 0.98,
    z,
    light: Math.max(0.2, Math.min(1, 0.5 + z * 0.44 + y * 0.12 - x * 0.07))
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
    centerX - radius * 0.35,
    centerY - radius * 0.34,
    radius * 0.1,
    centerX,
    centerY,
    radius * 1.12
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
  ctx.strokeStyle = "rgba(183, 222, 240, 0.26)";
  ctx.lineWidth = Math.max(2, radius * 0.011);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.012, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(93, 178, 210, 0.23)";
  ctx.lineWidth = Math.max(10, radius * 0.035);
  ctx.stroke();
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
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
  ctx.clip();

  let painted = 0;

  for (const { cell, point } of projected) {
    if (!cell.assignedSurface || !cell.material) continue;

    const kind = kindFromMaterial(cell.material, cell);
    const color = shade(cell.color || colorForMaterial(cell.material, kind), point.light);
    const size = radius * 0.07 * (0.72 + point.z * 0.38);

    ctx.beginPath();

    if (kind === "ocean") {
      ctx.globalAlpha = 0.56 + point.z * 0.2;
      ctx.ellipse(point.x, point.y, size * 0.7, size * 0.5, 0, 0, Math.PI * 2);
    } else if (kind === "stone") {
      ctx.globalAlpha = 0.92;
      ctx.moveTo(point.x, point.y - size * 0.58);
      ctx.lineTo(point.x + size * 0.62, point.y - size * 0.12);
      ctx.lineTo(point.x + size * 0.42, point.y + size * 0.52);
      ctx.lineTo(point.x - size * 0.46, point.y + size * 0.42);
      ctx.lineTo(point.x - size * 0.66, point.y - size * 0.08);
      ctx.closePath();
    } else if (kind === "ice") {
      ctx.globalAlpha = 0.94;
      ctx.ellipse(point.x, point.y, size * 0.58, size * 0.43, 0, 0, Math.PI * 2);
    } else {
      ctx.globalAlpha = 0.86;
      ctx.ellipse(point.x, point.y, size * 0.68, size * 0.5, 0, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();

    if (kind !== "ocean") {
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "rgba(255, 236, 178, 0.34)";
      ctx.lineWidth = Math.max(0.6, radius * 0.002);
      ctx.stroke();
    }

    painted += 1;
  }

  ctx.restore();
  H_EARTH_CANVAS_STATE.cellsPainted = painted;
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

  highlight.addColorStop(0, "rgba(255, 238, 184, 0.2)");
  highlight.addColorStop(0.34, "rgba(255, 238, 184, 0.035)");
  highlight.addColorStop(0.72, "rgba(0, 0, 0, 0.02)");
  highlight.addColorStop(1, "rgba(0, 0, 0, 0.52)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  const terminator = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  terminator.addColorStop(0, "rgba(255, 235, 175, 0.05)");
  terminator.addColorStop(0.48, "rgba(0, 0, 0, 0.0)");
  terminator.addColorStop(0.78, "rgba(0, 0, 0, 0.30)");
  terminator.addColorStop(1, "rgba(0, 0, 0, 0.62)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = terminator;
  ctx.fill();

  ctx.restore();
}

function drawTitle(ctx, width, height) {
  ctx.save();

  ctx.fillStyle = "rgba(246, 211, 123, 0.92)";
  ctx.font = `${Math.max(18, width * 0.026)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth · Canvas Parent Instance Consumer", width / 2, height * 0.075);

  ctx.fillStyle = "rgba(243, 227, 189, 0.72)";
  ctx.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Surface instance consumed · Controls held · Motion held", width / 2, height * 0.108);

  ctx.restore();
}

function drawHeld(ctx, canvas, reason) {
  const width = canvas.width;
  const height = canvas.height;

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

        if (a > 0 && (r > 2 || g > 2 || b > 2)) {
          nonBlank += 1;
        }
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

  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) * 0.34;
  const centerX = width * 0.5;
  const centerY = height * 0.52;

  clearScene(ctx, width, height);
  drawStars(ctx, width, height);
  drawGlobeBase(ctx, radius, centerX, centerY);
  drawCells(ctx, cells, radius, centerX, centerY);
  drawLight(ctx, radius, centerX, centerY);
  drawTitle(ctx, width, height);
  measureNonBlank(ctx, width, height);

  H_EARTH_CANVAS_STATE.renderStatus = "visible-composition-painted-from-surface-instance";
  H_EARTH_CANVAS_STATE.renderedAt = new Date().toISOString();
}

function exposeCanvasApi() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    status: getHEarthCanvasStatus,
    getStatus: getHEarthCanvasStatus,
    getHEarthCanvasStatus,
    boot: bootHEarthCanvas,
    bootHEarthCanvas,
    controlsAuthorized: false,
    motionAuthorized: false,
    inputAuthorized: false
  };

  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_CANVAS = api;
  window.H_EARTH_CANVAS_RECEIPT = H_EARTH_CANVAS_CONTRACT;

  document.documentElement.dataset.hEarthCanvas = H_EARTH_CANVAS_STATE.renderStatus;
  document.documentElement.dataset.hEarthCanvasReceipt = H_EARTH_CANVAS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasPreviousReceipt = H_EARTH_CANVAS_PREVIOUS_CONTRACT;
  document.documentElement.dataset.hEarthControls = "held";
  document.documentElement.dataset.hEarthCanvasControlsAuthorized = "false";
}

async function bootHEarthCanvas(context = {}) {
  if (H_EARTH_CANVAS_BOOT_PROMISE) return H_EARTH_CANVAS_BOOT_PROMISE;

  H_EARTH_CANVAS_BOOT_PROMISE = (async () => {
    H_EARTH_CANVAS_STATE.bootedAt = new Date().toISOString();
    H_EARTH_CANVAS_STATE.renderStatus = "booting-parent-instance-consumer";

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

      H_EARTH_CANVAS_STATE.parentReceipts.surface =
        surface?.receipts?.surface?.contract || readContractFrom(surface) || "missing";

      const candidates = collectSurfaceCandidates(surface, parentInstances);
      const cells = normalizeSurfaceCells(candidates);
      const ready = evaluateSurfaceReadiness(parentInstances, cells, candidates);

      if (!ready) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          drawHeld(ctx, canvas, "Created surface instance did not expose 256 material cells.");
          measureNonBlank(ctx, canvas.width, canvas.height);
        }

        setStatus(panel);
        exposeCanvasApi();
        return getHEarthCanvasStatus();
      }

      renderComposition(canvas, cells);
      setStatus(panel);
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    } catch (error) {
      recordError("boot-parent-instance-consumer", error);

      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        drawHeld(ctx, canvas, "Canvas failed while consuming the parent surface instance.");
        measureNonBlank(ctx, canvas.width, canvas.height);
      }

      H_EARTH_CANVAS_STATE.renderStatus = "failed-parent-instance-consumer";
      setStatus(panel);
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    }
  })();

  return H_EARTH_CANVAS_BOOT_PROMISE;
}

function getHEarthCanvasStatus() {
  return {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,
    routeAuthority: H_EARTH_CANVAS_STATE.routeAuthority,
    canvasJurisdiction: H_EARTH_CANVAS_STATE.canvasJurisdiction,
    canvasPrecinct: H_EARTH_CANVAS_STATE.canvasPrecinct,
    parentConsumptionMode: H_EARTH_CANVAS_STATE.parentConsumptionMode,
    parentModules: { ...H_EARTH_CANVAS_STATE.parentModules },
    parentReceipts: { ...H_EARTH_CANVAS_STATE.parentReceipts },
    staleParentContracts: H_EARTH_CANVAS_STATE.staleParentContracts,
    surfaceReceiptFound: H_EARTH_CANVAS_STATE.surfaceReceiptFound,
    parentSurfaceReady: H_EARTH_CANVAS_STATE.parentSurfaceReady,
    downstreamCanvasMayReadSurface: H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface,
    cellsResolved: H_EARTH_CANVAS_STATE.cellsResolved,
    cellsPainted: H_EARTH_CANVAS_STATE.cellsPainted,
    surfaceMaterialClasses: H_EARTH_CANVAS_STATE.surfaceMaterialClasses,
    landCells: H_EARTH_CANVAS_STATE.landCells,
    oceanCells: H_EARTH_CANVAS_STATE.oceanCells,
    nonBlankPixelRatio: H_EARTH_CANVAS_STATE.nonBlankPixelRatio,
    renderStatus: H_EARTH_CANVAS_STATE.renderStatus,
    controlsAuthorized: false,
    motionAuthorized: false,
    inputAuthorized: false,
    earthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,
    bootedAt: H_EARTH_CANVAS_STATE.bootedAt,
    renderedAt: H_EARTH_CANVAS_STATE.renderedAt,
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
  H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  H_EARTH_SURFACE_RECEIPT_EXPECTED,
  bootHEarthCanvas,
  getHEarthCanvasStatus
};

export default {
  contract: H_EARTH_CANVAS_CONTRACT,
  receipt: H_EARTH_CANVAS_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  boot: bootHEarthCanvas,
  bootHEarthCanvas,
  status: getHEarthCanvasStatus,
  getStatus: getHEarthCanvasStatus,
  getHEarthCanvasStatus,
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false
};
