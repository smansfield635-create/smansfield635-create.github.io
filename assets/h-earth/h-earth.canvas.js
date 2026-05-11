// /assets/h-earth/h-earth.canvas.js
// H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1
// Full-file replacement.
// Canvas child authority only.
// Purpose:
// - Read H-Earth parent truth from kernel, lattice256, landmap, terrain, and surface.
// - Paint visible H-Earth composition from parent surface material truth.
// - Publish canvas receipt, render status, nonblank pixel proof, and surface-consumption proof.
// - Keep controls, motion, drag, spin, and input authority held.
// - Do not mutate Earth, Hearth, Audralia, landmap, terrain, surface, or parent ratios.

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1";
const H_EARTH_CANVAS_PREWRITE = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_PREWRITE_v1";
const H_EARTH_SURFACE_RECEIPT_EXPECTED = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";

const H_EARTH_CANVAS_PATHS = Object.freeze({
  kernel: "/assets/h-earth/h-earth.kernel.js",
  lattice256: "/assets/h-earth/h-earth.lattice256.js",
  landmap: "/assets/h-earth/h-earth.landmap.js",
  terrain: "/assets/h-earth/h-earth.terrain.js",
  surface: "/assets/h-earth/h-earth.surface.js"
});

const H_EARTH_GRID_SIZE = 16;
const H_EARTH_TOTAL_CELLS = 256;

const H_EARTH_CANVAS_STATE = {
  contract: H_EARTH_CANVAS_CONTRACT,
  prewrite: H_EARTH_CANVAS_PREWRITE,
  surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,
  routeAuthority: "doorway-only",
  canvasPrecinct: "h-earth-route-visual-mount-only",
  canvasJurisdiction: "visible-composition-only",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  earthMutationAuthorized: false,
  hearthMutationAuthorized: false,
  audraliaMutationAuthorized: false,
  loadedParents: {},
  failedParents: {},
  harvestedCollections: [],
  parentSurfaceReady: false,
  downstreamCanvasMayReadSurface: false,
  cellsResolved: 0,
  cellsPainted: 0,
  nonBlankPixelRatio: 0,
  renderStatus: "not-started",
  errors: [],
  bootedAt: null,
  renderedAt: null
};

const H_EARTH_CANVAS_GLOBALS = Object.freeze({
  kernel: [
    "DGBHEarthKernel",
    "HEarthKernel",
    "HEARTH_KERNEL",
    "H_EARTH_KERNEL",
    "HEarthParentKernel"
  ],
  lattice256: [
    "DGBHEarthLattice256",
    "HEarthLattice256",
    "HEARTH_LATTICE256",
    "H_EARTH_LATTICE256",
    "HEarthParentLattice256"
  ],
  landmap: [
    "DGBHEarthLandmap",
    "HEarthLandmap",
    "HEARTH_LANDMAP",
    "H_EARTH_LANDMAP",
    "HEarthParentLandmap"
  ],
  terrain: [
    "DGBHEarthTerrain",
    "HEarthTerrain",
    "HEARTH_TERRAIN",
    "H_EARTH_TERRAIN",
    "HEarthParentTerrain"
  ],
  surface: [
    "DGBHEarthSurface",
    "HEarthSurface",
    "HEARTH_SURFACE",
    "H_EARTH_SURFACE",
    "HEarthParentSurface"
  ]
});

const H_EARTH_CANVAS_EXPORT_KEYS = Object.freeze([
  "default",
  "cells",
  "surfaceCells",
  "terrainCells",
  "landmapCells",
  "latticeCells",
  "cellMap",
  "surfaceMap",
  "materials",
  "materialCells",
  "getCells",
  "getSurfaceCells",
  "getTerrainCells",
  "getLandmapCells",
  "getLatticeCells",
  "getHEarthSurface",
  "getHEarthSurfaceCells",
  "getHEarthTerrain",
  "getHEarthLandmap",
  "getHEarthLattice256",
  "createHEarthSurface",
  "buildHEarthSurface",
  "readHEarthSurface",
  "status",
  "getStatus",
  "getHEarthSurfaceStatus"
]);

const H_EARTH_CANVAS_MATERIAL_PALETTE = Object.freeze({
  "abyssal-ocean": "#07162f",
  "deep-ocean": "#0b2a54",
  "open-ocean": "#12436f",
  "ocean-water": "#15527e",
  "basin-mouth-water": "#1c6688",
  "coastal-shelf-water": "#277f95",
  "coastal-shelf-ground": "#4b897a",
  "reef-shelf-water": "#2a9ea2",
  "beach-sediment": "#c8a76e",
  "archipelago-ground": "#6f8b49",
  "island-ground": "#78934d",
  "lowland-ground": "#648244",
  "grassland-ground": "#5b7f3e",
  "forest-ground": "#315f35",
  "highland-ground": "#6e7246",
  "ridge-ground": "#77704d",
  "basin-ground": "#5b7042",
  "valley-ground": "#4f743d",
  "canyon-stone": "#8a6045",
  "cliff-stone": "#746155",
  "coastal-stone": "#706b5c",
  "mountain-stone": "#8b8780",
  "highland-stone": "#7c7b70",
  "mineral-stone": "#a37a4e",
  "volcanic-stone": "#4a423e",
  "ice-cap": "#d7eef5",
  "glacier-ice": "#bfdde8",
  "snow-highland": "#e7edf0",
  "wetland-ground": "#355f4c"
});

function hEarthCanvasNowKey() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function hEarthCanvasSafeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function hEarthCanvasIsObject(value) {
  return value !== null && typeof value === "object";
}

function hEarthCanvasIsNumericKey(key) {
  return typeof key === "string" && /^\d+$/.test(key);
}

function hEarthCanvasRecordError(label, error) {
  H_EARTH_CANVAS_STATE.errors.push({
    label,
    message: error && error.message ? error.message : String(error)
  });
}

function hEarthCanvasReadReceipt(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!hEarthCanvasIsObject(value)) return "";
  const keys = [
    "receipt",
    "contract",
    "CONTRACT",
    "SURFACE_RECEIPT",
    "surfaceReceipt",
    "terrainReceipt",
    "landmapReceipt",
    "latticeReceipt",
    "kernelReceipt"
  ];
  for (const key of keys) {
    if (typeof value[key] === "string" && value[key].trim()) return value[key].trim();
  }
  return "";
}

function hEarthCanvasIndexFromCell(cell, fallbackIndex) {
  if (!hEarthCanvasIsObject(cell)) return fallbackIndex;

  const directKeys = [
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

  for (const key of directKeys) {
    if (Number.isInteger(cell[key]) && cell[key] >= 0 && cell[key] < H_EARTH_TOTAL_CELLS) {
      return cell[key];
    }

    if (typeof cell[key] === "string" && /^\d+$/.test(cell[key])) {
      const parsed = Number(cell[key]);
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

function hEarthCanvasNormalizeMaterialName(value) {
  const raw = hEarthCanvasSafeString(value).toLowerCase();
  if (!raw) return "";

  return raw
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

function hEarthCanvasMaterialFromCell(cell) {
  if (!hEarthCanvasIsObject(cell)) return "";

  const materialKeys = [
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
    "name"
  ];

  for (const key of materialKeys) {
    const normalized = hEarthCanvasNormalizeMaterialName(cell[key]);
    if (normalized) return normalized;
  }

  return "";
}

function hEarthCanvasKindFromMaterial(material, cell) {
  const mat = hEarthCanvasNormalizeMaterialName(material);

  if (mat.includes("ocean") || mat.includes("water") || mat.includes("shelf") || mat.includes("reef")) {
    return "ocean";
  }

  if (mat.includes("ice") || mat.includes("snow") || mat.includes("glacier")) {
    return "ice";
  }

  if (mat.includes("stone") || mat.includes("mountain") || mat.includes("cliff") || mat.includes("canyon")) {
    return "stone";
  }

  if (mat.includes("beach") || mat.includes("sediment")) {
    return "coast";
  }

  if (mat.includes("ground") || mat.includes("forest") || mat.includes("land") || mat.includes("island")) {
    return "land";
  }

  if (hEarthCanvasIsObject(cell)) {
    if (cell.isOcean === true || cell.ocean === true || cell.water === true) return "ocean";
    if (cell.isLand === true || cell.land === true) return "land";
  }

  return "unknown";
}

function hEarthCanvasColorForMaterial(material, kind) {
  const normalized = hEarthCanvasNormalizeMaterialName(material);

  if (H_EARTH_CANVAS_MATERIAL_PALETTE[normalized]) {
    return H_EARTH_CANVAS_MATERIAL_PALETTE[normalized];
  }

  if (normalized.includes("abyss")) return H_EARTH_CANVAS_MATERIAL_PALETTE["abyssal-ocean"];
  if (normalized.includes("deep") && normalized.includes("ocean")) return H_EARTH_CANVAS_MATERIAL_PALETTE["deep-ocean"];
  if (normalized.includes("ocean")) return H_EARTH_CANVAS_MATERIAL_PALETTE["open-ocean"];
  if (normalized.includes("water")) return H_EARTH_CANVAS_MATERIAL_PALETTE["basin-mouth-water"];
  if (normalized.includes("shelf")) return H_EARTH_CANVAS_MATERIAL_PALETTE["coastal-shelf-water"];
  if (normalized.includes("beach")) return H_EARTH_CANVAS_MATERIAL_PALETTE["beach-sediment"];
  if (normalized.includes("archipelago")) return H_EARTH_CANVAS_MATERIAL_PALETTE["archipelago-ground"];
  if (normalized.includes("island")) return H_EARTH_CANVAS_MATERIAL_PALETTE["island-ground"];
  if (normalized.includes("forest")) return H_EARTH_CANVAS_MATERIAL_PALETTE["forest-ground"];
  if (normalized.includes("highland")) return H_EARTH_CANVAS_MATERIAL_PALETTE["highland-ground"];
  if (normalized.includes("ridge")) return H_EARTH_CANVAS_MATERIAL_PALETTE["ridge-ground"];
  if (normalized.includes("basin")) return H_EARTH_CANVAS_MATERIAL_PALETTE["basin-ground"];
  if (normalized.includes("valley")) return H_EARTH_CANVAS_MATERIAL_PALETTE["valley-ground"];
  if (normalized.includes("canyon")) return H_EARTH_CANVAS_MATERIAL_PALETTE["canyon-stone"];
  if (normalized.includes("cliff")) return H_EARTH_CANVAS_MATERIAL_PALETTE["cliff-stone"];
  if (normalized.includes("stone")) return H_EARTH_CANVAS_MATERIAL_PALETTE["mountain-stone"];
  if (normalized.includes("mineral")) return H_EARTH_CANVAS_MATERIAL_PALETTE["mineral-stone"];
  if (normalized.includes("ice")) return H_EARTH_CANVAS_MATERIAL_PALETTE["glacier-ice"];
  if (normalized.includes("snow")) return H_EARTH_CANVAS_MATERIAL_PALETTE["snow-highland"];

  if (kind === "ocean") return H_EARTH_CANVAS_MATERIAL_PALETTE["open-ocean"];
  if (kind === "ice") return H_EARTH_CANVAS_MATERIAL_PALETTE["glacier-ice"];
  if (kind === "stone") return H_EARTH_CANVAS_MATERIAL_PALETTE["mountain-stone"];
  if (kind === "coast") return H_EARTH_CANVAS_MATERIAL_PALETTE["beach-sediment"];
  if (kind === "land") return H_EARTH_CANVAS_MATERIAL_PALETTE["lowland-ground"];

  return "#2c3d4a";
}

function hEarthCanvasToArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (value instanceof Map) {
    return Array.from(value.entries()).map(([key, item]) => {
      if (hEarthCanvasIsObject(item)) {
        return { index: Number(key), ...item };
      }
      return { index: Number(key), value: item };
    });
  }

  if (hEarthCanvasIsObject(value)) {
    const numericKeys = Object.keys(value).filter(hEarthCanvasIsNumericKey);
    if (numericKeys.length >= 16) {
      return numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => {
          const item = value[key];
          if (hEarthCanvasIsObject(item)) return { index: Number(key), ...item };
          return { index: Number(key), value: item };
        });
    }
  }

  return [];
}

function hEarthCanvasHarvestCollections(root, label, depth = 0, seen = new WeakSet()) {
  const collections = [];

  if (!root || depth > 3) return collections;

  if (Array.isArray(root)) {
    if (root.length >= H_EARTH_TOTAL_CELLS) {
      collections.push({
        label,
        cells: root.slice(0, H_EARTH_TOTAL_CELLS),
        receipt: ""
      });
    }
    return collections;
  }

  if (!hEarthCanvasIsObject(root) && typeof root !== "function") return collections;

  if (hEarthCanvasIsObject(root)) {
    if (seen.has(root)) return collections;
    seen.add(root);
  }

  if (typeof root === "function") {
    const invoked = hEarthCanvasTryInvokeProvider(root, label);
    collections.push(...hEarthCanvasHarvestCollections(invoked, `${label}.invoke`, depth + 1, seen));
    return collections;
  }

  const receipt = hEarthCanvasReadReceipt(root);

  const directCollections = [
    "cells",
    "surfaceCells",
    "terrainCells",
    "landmapCells",
    "latticeCells",
    "cellMap",
    "surfaceMap",
    "materials",
    "materialCells",
    "data",
    "records",
    "states"
  ];

  for (const key of directCollections) {
    if (!Object.prototype.hasOwnProperty.call(root, key)) continue;
    const arr = hEarthCanvasToArray(root[key]);
    if (arr.length >= H_EARTH_TOTAL_CELLS) {
      collections.push({
        label: `${label}.${key}`,
        cells: arr.slice(0, H_EARTH_TOTAL_CELLS),
        receipt
      });
    }
  }

  for (const key of H_EARTH_CANVAS_EXPORT_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(root, key)) continue;

    const value = root[key];

    if (typeof value === "function") {
      const invoked = hEarthCanvasTryInvokeProvider(value, `${label}.${key}`);
      collections.push(...hEarthCanvasHarvestCollections(invoked, `${label}.${key}.invoke`, depth + 1, seen));
    } else {
      collections.push(...hEarthCanvasHarvestCollections(value, `${label}.${key}`, depth + 1, seen));
    }
  }

  return collections;
}

function hEarthCanvasTryInvokeProvider(fn, label) {
  const parentContext = {
    contract: H_EARTH_CANVAS_CONTRACT,
    mode: "read-only-canvas-consumption",
    totalCells: H_EARTH_TOTAL_CELLS,
    gridSize: H_EARTH_GRID_SIZE,
    mutationAuthorized: false,
    controlsAuthorized: false,
    motionAuthorized: false
  };

  const attempts = [
    [],
    [parentContext],
    [{ ...parentContext, readOnly: true }]
  ];

  for (const args of attempts) {
    try {
      const result = fn(...args);
      if (result !== undefined && result !== null) return result;
    } catch (error) {
      H_EARTH_CANVAS_STATE.failedParents[label] = error && error.message ? error.message : String(error);
    }
  }

  return null;
}

async function hEarthCanvasImportParent(name, path) {
  const href = `${path}?canvas-read=${encodeURIComponent(H_EARTH_CANVAS_CONTRACT)}&v=${hEarthCanvasNowKey()}`;

  try {
    const mod = await import(href);
    H_EARTH_CANVAS_STATE.loadedParents[name] = {
      path,
      loaded: true,
      receipt: hEarthCanvasReadReceipt(mod)
    };
    return mod;
  } catch (error) {
    H_EARTH_CANVAS_STATE.failedParents[name] = error && error.message ? error.message : String(error);
    return null;
  }
}

function hEarthCanvasReadGlobalCandidates(name) {
  const names = H_EARTH_CANVAS_GLOBALS[name] || [];
  const found = [];

  for (const globalName of names) {
    if (Object.prototype.hasOwnProperty.call(window, globalName) && window[globalName]) {
      found.push({
        label: `window.${globalName}`,
        value: window[globalName]
      });
    }
  }

  return found;
}

function hEarthCanvasCreateBaseCells() {
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
      color: "#2c3d4a",
      assignedSurface: false,
      sourceLabels: []
    });
  }

  return cells;
}

function hEarthCanvasMergeCollections(collections) {
  const cells = hEarthCanvasCreateBaseCells();

  for (const collection of collections) {
    const items = collection.cells || [];

    for (let fallbackIndex = 0; fallbackIndex < Math.min(items.length, H_EARTH_TOTAL_CELLS); fallbackIndex += 1) {
      const item = items[fallbackIndex];
      const index = hEarthCanvasIndexFromCell(item, fallbackIndex);
      if (index < 0 || index >= H_EARTH_TOTAL_CELLS) continue;

      const target = cells[index];

      if (hEarthCanvasIsObject(item)) {
        const material = hEarthCanvasMaterialFromCell(item);
        const kind = hEarthCanvasKindFromMaterial(material, item);

        Object.assign(target, item);

        target.index = index;
        target.row = Number.isInteger(target.row) ? target.row : Math.floor(index / H_EARTH_GRID_SIZE);
        target.col = Number.isInteger(target.col) ? target.col : index % H_EARTH_GRID_SIZE;
        target.latitude = Number.isFinite(Number(target.latitude))
          ? Number(target.latitude)
          : 90 - ((target.row + 0.5) / H_EARTH_GRID_SIZE) * 180;
        target.longitude = Number.isFinite(Number(target.longitude))
          ? Number(target.longitude)
          : -180 + ((target.col + 0.5) / H_EARTH_GRID_SIZE) * 360;

        if (material) {
          target.material = material;
          target.kind = kind;
          target.color = hEarthCanvasColorForMaterial(material, kind);
          target.assignedSurface = true;
        }

        if (!Array.isArray(target.sourceLabels)) target.sourceLabels = [];
        target.sourceLabels.push(collection.label);
      }
    }
  }

  for (const cell of cells) {
    const material = hEarthCanvasMaterialFromCell(cell);
    if (material && !cell.assignedSurface) {
      const kind = hEarthCanvasKindFromMaterial(material, cell);
      cell.material = material;
      cell.kind = kind;
      cell.color = hEarthCanvasColorForMaterial(material, kind);
      cell.assignedSurface = true;
    }
  }

  return cells;
}

function hEarthCanvasResolveSurfaceReadiness(cells, collections) {
  const assigned = cells.filter((cell) => cell.assignedSurface && cell.material).length;
  const materialSet = new Set(cells.filter((cell) => cell.material).map((cell) => cell.material));
  const surfaceCollections = collections.filter((collection) => {
    const label = collection.label.toLowerCase();
    return label.includes("surface") || collection.receipt === H_EARTH_SURFACE_RECEIPT_EXPECTED;
  });

  const hasExpectedSurfaceReceipt = collections.some((collection) => {
    return collection.receipt === H_EARTH_SURFACE_RECEIPT_EXPECTED;
  });

  const ready = assigned === H_EARTH_TOTAL_CELLS && materialSet.size >= 1 && surfaceCollections.length > 0;

  H_EARTH_CANVAS_STATE.parentSurfaceReady = ready;
  H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface = ready;
  H_EARTH_CANVAS_STATE.cellsResolved = assigned;
  H_EARTH_CANVAS_STATE.surfaceMaterialClasses = materialSet.size;
  H_EARTH_CANVAS_STATE.surfaceCollections = surfaceCollections.length;
  H_EARTH_CANVAS_STATE.surfaceReceiptFound = hasExpectedSurfaceReceipt;

  return ready;
}

function hEarthCanvasEnsureStyles() {
  if (document.getElementById("h-earth-canvas-visible-composition-style")) return;

  const style = document.createElement("style");
  style.id = "h-earth-canvas-visible-composition-style";
  style.textContent = `
    [data-h-earth-canvas-panel] {
      box-sizing: border-box;
      width: min(100%, 980px);
      margin: 1.5rem auto;
      padding: 1rem;
      border: 1px solid rgba(225, 185, 95, 0.34);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 50% 20%, rgba(225, 185, 95, 0.16), transparent 34rem),
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
      max-width: 74ch;
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
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
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

function hEarthCanvasFindInsertionHost() {
  const preferred = document.querySelector("[data-h-earth-canvas-mount]");
  if (preferred) return preferred;

  const main = document.getElementById("h-earth-main");
  if (main) return main;

  const semanticMain = document.querySelector("main");
  if (semanticMain) return semanticMain;

  return document.body;
}

function hEarthCanvasEnsurePanel() {
  hEarthCanvasEnsureStyles();

  let panel = document.querySelector("[data-h-earth-canvas-panel]");
  if (panel) return panel;

  panel = document.createElement("section");
  panel.setAttribute("data-h-earth-canvas-panel", "true");
  panel.setAttribute("aria-label", "H-Earth canvas visible composition");
  panel.innerHTML = `
    <h2 data-h-earth-canvas-title>H-Earth Canvas Visible Composition</h2>
    <p data-h-earth-canvas-copy>
      Canvas is now active as a downstream visual child. It reads the completed surface parent and paints visible composition only. Controls remain held.
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

  const host = hEarthCanvasFindInsertionHost();

  const surfaceMount =
    document.querySelector("[data-h-earth-surface-status-mount]") ||
    document.querySelector("#h-earth-surface-status") ||
    document.querySelector("[data-surface-status-mount]");

  if (surfaceMount && surfaceMount.parentNode) {
    surfaceMount.parentNode.insertBefore(panel, surfaceMount.nextSibling);
  } else {
    host.appendChild(panel);
  }

  return panel;
}

function hEarthCanvasSetStatus(panel) {
  const target = panel.querySelector("[data-h-earth-canvas-status]");
  if (!target) return;

  const paintStatus = H_EARTH_CANVAS_STATE.renderStatus;
  const parentReady = H_EARTH_CANVAS_STATE.parentSurfaceReady ? "true" : "false";
  const controls = H_EARTH_CANVAS_STATE.controlsAuthorized ? "authorized" : "held";
  const surfaceRead = H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface ? "true" : "false";
  const nonBlank = H_EARTH_CANVAS_STATE.nonBlankPixelRatio.toFixed(4);

  target.innerHTML = `
    <span><strong>Contract</strong>${H_EARTH_CANVAS_CONTRACT}</span>
    <span><strong>Parent surface ready</strong>${parentReady}</span>
    <span><strong>Canvas may read surface</strong>${surfaceRead}</span>
    <span><strong>Cells resolved</strong>${H_EARTH_CANVAS_STATE.cellsResolved}/${H_EARTH_TOTAL_CELLS}</span>
    <span><strong>Cells painted</strong>${H_EARTH_CANVAS_STATE.cellsPainted}/${H_EARTH_TOTAL_CELLS}</span>
    <span><strong>Nonblank pixel proof</strong>${nonBlank}</span>
    <span><strong>Render status</strong>${paintStatus}</span>
    <span><strong>Controls</strong>${controls}</span>
  `;
}

function hEarthCanvasClear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.06,
    width * 0.5,
    height * 0.5,
    width * 0.74
  );
  background.addColorStop(0, "#122748");
  background.addColorStop(0.55, "#050b19");
  background.addColorStop(1, "#01030a");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
}

function hEarthCanvasDrawStars(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.58;

  for (let i = 0; i < 140; i += 1) {
    const x = (Math.sin(i * 93.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 47.61) * 0.5 + 0.5) * height;
    const r = 0.7 + ((i * 7) % 11) / 14;

    ctx.beginPath();
    ctx.fillStyle = i % 9 === 0 ? "rgba(246, 211, 123, 0.72)" : "rgba(225, 238, 255, 0.62)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function hEarthCanvasProjectCell(cell, radius, centerX, centerY) {
  const lat = (Number(cell.latitude) * Math.PI) / 180;
  const lon = ((Number(cell.longitude) + 28) * Math.PI) / 180;

  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon);

  if (z < -0.08) {
    return null;
  }

  const flattenY = 0.98;
  return {
    x: centerX + x * radius,
    y: centerY - y * radius * flattenY,
    z,
    light: Math.max(0.22, Math.min(1, 0.48 + z * 0.46 + x * -0.08 + y * 0.12))
  };
}

function hEarthCanvasShadeColor(hex, light) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const adjusted = [r, g, b].map((channel) => {
    const value = Math.round(channel * light + 12 * (1 - light));
    return Math.max(0, Math.min(255, value));
  });

  return `rgb(${adjusted[0]}, ${adjusted[1]}, ${adjusted[2]})`;
}

function hEarthCanvasDrawGlobeShell(ctx, width, height, radius, centerX, centerY) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    centerX - radius * 0.32,
    centerY - radius * 0.36,
    radius * 0.12,
    centerX,
    centerY,
    radius * 1.1
  );
  ocean.addColorStop(0, "#1e6a95");
  ocean.addColorStop(0.42, "#0c3763");
  ocean.addColorStop(0.78, "#061d3c");
  ocean.addColorStop(1, "#031125");

  ctx.fillStyle = ocean;
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(183, 222, 240, 0.22)";
  ctx.lineWidth = Math.max(2, radius * 0.012);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.012, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(93, 178, 210, 0.22)";
  ctx.lineWidth = Math.max(10, radius * 0.035);
  ctx.stroke();

  const glow = ctx.createRadialGradient(
    centerX - radius * 0.26,
    centerY - radius * 0.36,
    radius * 0.2,
    centerX,
    centerY,
    radius * 1.25
  );
  glow.addColorStop(0, "rgba(255, 232, 165, 0.18)");
  glow.addColorStop(0.38, "rgba(255, 232, 165, 0.04)");
  glow.addColorStop(0.72, "rgba(0, 0, 0, 0.02)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0.48)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.restore();
}

function hEarthCanvasDrawCells(ctx, cells, width, height, radius, centerX, centerY) {
  const projected = [];

  for (const cell of cells) {
    const point = hEarthCanvasProjectCell(cell, radius, centerX, centerY);
    if (!point) continue;
    projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
  ctx.clip();

  let painted = 0;

  for (const item of projected) {
    const { cell, point } = item;
    if (!cell.assignedSurface || !cell.material) continue;

    const normalizedMaterial = hEarthCanvasNormalizeMaterialName(cell.material);
    const kind = hEarthCanvasKindFromMaterial(normalizedMaterial, cell);
    const color = hEarthCanvasColorForMaterial(normalizedMaterial, kind);
    const shade = hEarthCanvasShadeColor(color, point.light);

    const baseSize = radius * 0.083;
    const size = baseSize * (0.72 + point.z * 0.34);

    ctx.beginPath();

    if (kind === "ocean") {
      ctx.globalAlpha = 0.68 + point.z * 0.18;
      ctx.ellipse(point.x, point.y, size * 0.58, size * 0.44, 0, 0, Math.PI * 2);
    } else if (kind === "ice") {
      ctx.globalAlpha = 0.9;
      ctx.ellipse(point.x, point.y, size * 0.52, size * 0.42, 0, 0, Math.PI * 2);
    } else if (kind === "stone") {
      ctx.globalAlpha = 0.94;
      ctx.moveTo(point.x, point.y - size * 0.5);
      ctx.lineTo(point.x + size * 0.58, point.y - size * 0.08);
      ctx.lineTo(point.x + size * 0.36, point.y + size * 0.45);
      ctx.lineTo(point.x - size * 0.44, point.y + size * 0.38);
      ctx.lineTo(point.x - size * 0.62, point.y - size * 0.08);
      ctx.closePath();
    } else {
      ctx.globalAlpha = 0.88;
      ctx.ellipse(point.x, point.y, size * 0.62, size * 0.48, 0, 0, Math.PI * 2);
    }

    ctx.fillStyle = shade;
    ctx.fill();

    if (kind !== "ocean") {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "rgba(255, 236, 178, 0.34)";
      ctx.lineWidth = Math.max(0.6, radius * 0.002);
      ctx.stroke();
    }

    painted += 1;
  }

  ctx.restore();

  H_EARTH_CANVAS_STATE.cellsPainted = painted;
}

function hEarthCanvasDrawTerminator(ctx, radius, centerX, centerY) {
  ctx.save();

  const shade = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  shade.addColorStop(0, "rgba(255, 235, 175, 0.06)");
  shade.addColorStop(0.38, "rgba(0, 0, 0, 0.0)");
  shade.addColorStop(0.76, "rgba(0, 0, 0, 0.28)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.58)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.restore();
}

function hEarthCanvasDrawLabels(ctx, width, height) {
  ctx.save();

  ctx.fillStyle = "rgba(246, 211, 123, 0.9)";
  ctx.font = `${Math.max(18, width * 0.026)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth · G1 Canvas Visible Composition", width / 2, height * 0.075);

  ctx.fillStyle = "rgba(243, 227, 189, 0.72)";
  ctx.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Surface parent consumed · Controls held · Motion held", width / 2, height * 0.108);

  ctx.restore();
}

function hEarthCanvasDrawHold(ctx, ctxCanvas, reason) {
  const width = ctxCanvas.width;
  const height = ctxCanvas.height;

  hEarthCanvasClear(ctx, width, height);
  hEarthCanvasDrawStars(ctx, width, height);

  ctx.save();
  ctx.fillStyle = "rgba(246, 211, 123, 0.92)";
  ctx.font = `${Math.max(22, width * 0.03)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("H-Earth Canvas Held", width / 2, height * 0.43);

  ctx.fillStyle = "rgba(243, 227, 189, 0.76)";
  ctx.font = `${Math.max(14, width * 0.018)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(reason, width / 2, height * 0.48);
  ctx.fillText("Canvas will not invent terrain, landmap, or surface truth.", width / 2, height * 0.52);
  ctx.restore();

  H_EARTH_CANVAS_STATE.renderStatus = "held-parent-surface-not-resolved";
  H_EARTH_CANVAS_STATE.cellsPainted = 0;
}

function hEarthCanvasMeasureNonBlank(ctx, width, height) {
  try {
    const step = 8;
    const image = ctx.getImageData(0, 0, width, height).data;
    let sampled = 0;
    let nonBlank = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const offset = (y * width + x) * 4;
        const r = image[offset];
        const g = image[offset + 1];
        const b = image[offset + 2];
        const a = image[offset + 3];

        sampled += 1;

        if (a > 0 && (r > 3 || g > 3 || b > 3)) {
          nonBlank += 1;
        }
      }
    }

    H_EARTH_CANVAS_STATE.nonBlankPixelRatio = sampled > 0 ? nonBlank / sampled : 0;
  } catch (error) {
    H_EARTH_CANVAS_STATE.nonBlankPixelRatio = 0;
    hEarthCanvasRecordError("nonblank-pixel-proof", error);
  }
}

function hEarthCanvasRenderComposition(canvas, cells) {
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

  hEarthCanvasClear(ctx, width, height);
  hEarthCanvasDrawStars(ctx, width, height);
  hEarthCanvasDrawGlobeShell(ctx, width, height, radius, centerX, centerY);
  hEarthCanvasDrawCells(ctx, cells, width, height, radius, centerX, centerY);
  hEarthCanvasDrawTerminator(ctx, radius, centerX, centerY);
  hEarthCanvasDrawLabels(ctx, width, height);
  hEarthCanvasMeasureNonBlank(ctx, width, height);

  H_EARTH_CANVAS_STATE.renderStatus = "visible-composition-painted";
  H_EARTH_CANVAS_STATE.renderedAt = new Date().toISOString();
}

async function hEarthCanvasLoadAndResolveCells() {
  const modules = {};

  for (const [name, path] of Object.entries(H_EARTH_CANVAS_PATHS)) {
    modules[name] = await hEarthCanvasImportParent(name, path);
  }

  const collections = [];

  for (const [name, mod] of Object.entries(modules)) {
    if (mod) {
      collections.push(...hEarthCanvasHarvestCollections(mod, `module.${name}`));
    }

    const globals = hEarthCanvasReadGlobalCandidates(name);
    for (const globalCandidate of globals) {
      collections.push(
        ...hEarthCanvasHarvestCollections(globalCandidate.value, globalCandidate.label)
      );
    }
  }

  const surfaceWeighted = collections.sort((a, b) => {
    const aSurface = a.label.toLowerCase().includes("surface") ? 1 : 0;
    const bSurface = b.label.toLowerCase().includes("surface") ? 1 : 0;
    return aSurface - bSurface;
  });

  H_EARTH_CANVAS_STATE.harvestedCollections = surfaceWeighted.map((collection) => ({
    label: collection.label,
    cells: collection.cells.length,
    receipt: collection.receipt || ""
  }));

  const cells = hEarthCanvasMergeCollections(surfaceWeighted);
  hEarthCanvasResolveSurfaceReadiness(cells, surfaceWeighted);

  return cells;
}

async function bootHEarthCanvas() {
  if (H_EARTH_CANVAS_STATE.renderStatus === "booting") return getHEarthCanvasStatus();

  H_EARTH_CANVAS_STATE.bootedAt = new Date().toISOString();
  H_EARTH_CANVAS_STATE.renderStatus = "booting";

  const panel = hEarthCanvasEnsurePanel();
  const canvas = panel.querySelector("[data-h-earth-canvas]");

  if (!canvas) {
    H_EARTH_CANVAS_STATE.renderStatus = "failed-no-canvas-element";
    hEarthCanvasSetStatus(panel);
    return getHEarthCanvasStatus();
  }

  try {
    const cells = await hEarthCanvasLoadAndResolveCells();

    if (!H_EARTH_CANVAS_STATE.parentSurfaceReady) {
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        hEarthCanvasDrawHold(
          ctx,
          canvas,
          "Parent surface did not expose 256 assigned material cells."
        );
        hEarthCanvasMeasureNonBlank(ctx, canvas.width, canvas.height);
      }
      hEarthCanvasSetStatus(panel);
      hEarthCanvasExpose();
      return getHEarthCanvasStatus();
    }

    hEarthCanvasRenderComposition(canvas, cells);
    hEarthCanvasSetStatus(panel);
    hEarthCanvasExpose();
    return getHEarthCanvasStatus();
  } catch (error) {
    hEarthCanvasRecordError("boot", error);

    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx) {
      hEarthCanvasDrawHold(ctx, canvas, "Canvas boot failed before parent truth could be consumed.");
      hEarthCanvasMeasureNonBlank(ctx, canvas.width, canvas.height);
    }

    H_EARTH_CANVAS_STATE.renderStatus = "failed";
    hEarthCanvasSetStatus(panel);
    hEarthCanvasExpose();
    return getHEarthCanvasStatus();
  }
}

function getHEarthCanvasStatus() {
  return {
    contract: H_EARTH_CANVAS_CONTRACT,
    prewrite: H_EARTH_CANVAS_PREWRITE,
    surfaceReceiptExpected: H_EARTH_SURFACE_RECEIPT_EXPECTED,
    routeAuthority: H_EARTH_CANVAS_STATE.routeAuthority,
    canvasPrecinct: H_EARTH_CANVAS_STATE.canvasPrecinct,
    canvasJurisdiction: H_EARTH_CANVAS_STATE.canvasJurisdiction,
    loadedParents: { ...H_EARTH_CANVAS_STATE.loadedParents },
    failedParents: { ...H_EARTH_CANVAS_STATE.failedParents },
    harvestedCollections: [...H_EARTH_CANVAS_STATE.harvestedCollections],
    parentSurfaceReady: H_EARTH_CANVAS_STATE.parentSurfaceReady,
    downstreamCanvasMayReadSurface: H_EARTH_CANVAS_STATE.downstreamCanvasMayReadSurface,
    cellsResolved: H_EARTH_CANVAS_STATE.cellsResolved,
    cellsPainted: H_EARTH_CANVAS_STATE.cellsPainted,
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

function hEarthCanvasExpose() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
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

  document.documentElement.setAttribute("data-h-earth-canvas", "active-visible-composition");
  document.documentElement.setAttribute("data-h-earth-canvas-receipt", H_EARTH_CANVAS_CONTRACT);
  document.documentElement.setAttribute("data-h-earth-controls", "held");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    hEarthCanvasExpose();
    bootHEarthCanvas();
  }, { once: true });
} else {
  hEarthCanvasExpose();
  bootHEarthCanvas();
}

export {
  H_EARTH_CANVAS_CONTRACT,
  H_EARTH_CANVAS_PREWRITE,
  H_EARTH_SURFACE_RECEIPT_EXPECTED,
  bootHEarthCanvas,
  getHEarthCanvasStatus
};

export default {
  contract: H_EARTH_CANVAS_CONTRACT,
  receipt: H_EARTH_CANVAS_CONTRACT,
  boot: bootHEarthCanvas,
  bootHEarthCanvas,
  getStatus: getHEarthCanvasStatus,
  getHEarthCanvasStatus,
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false
};
