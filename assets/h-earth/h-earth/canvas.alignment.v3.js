// /assets/h-earth/h-earth.canvas.alignment.v3.js
// H_EARTH_G1_CANVAS_ASSET_PATH_RENEWAL_CHILD_CANVAS_TNT_v10A
// Full-file replacement.
// Renewed canvas asset path.
// Canvas child authority only.
//
// Purpose:
// - Replace the incorrect wrapper pattern.
// - Do not import, boot, wrap, or depend on /assets/h-earth/h-earth.canvas.js.
// - Read only route-passed parent instances and surface material truth.
// - Paint visible composition as downstream canvas child.
// - Align with controls API when controls are active.
// - Keep parent truth immutable.
//
// Owns:
// - visible canvas composition
// - canvas receipt
// - canvas proof status
// - canvas/controls receipt alignment readout
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - controls authority
// - parent reconstruction
// - legacy canvas execution
// - Earth mutation
// - Hearth mutation
// - Audralia mutation

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const H_EARTH_CANVAS_RENEWAL_CONTRACT = "H_EARTH_G1_CANVAS_ASSET_PATH_RENEWAL_CHILD_CANVAS_TNT_v10A";
const H_EARTH_CANVAS_PREVIOUS_CONTRACT = "H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2";
const H_EARTH_RENEWED_ASSET_PATH = "/assets/h-earth/h-earth.canvas.alignment.v3.js";
const H_EARTH_EXPECTED_SURFACE = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";
const H_EARTH_EXPECTED_CONTROLS = "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1";
const H_EARTH_TOTAL_CELLS = 256;
const H_EARTH_GRID = 16;

let bootPromise = null;

const state = {
  contract: H_EARTH_CANVAS_CONTRACT,
  renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  assetPath: H_EARTH_RENEWED_ASSET_PATH,
  status: "not-started",
  parentConsumptionMode: "route-passed-parent-instances-only",
  parentInstancesPassed: false,
  surfaceReceipt: "pending",
  surfaceReceiptExpected: H_EARTH_EXPECTED_SURFACE,
  parentSurfaceReady: false,
  downstreamCanvasMayReadSurface: false,
  cellsResolved: 0,
  cellsPainted: 0,
  surfaceMaterialClasses: 0,
  landCells: 0,
  oceanCells: 0,
  nonBlankPixelRatio: 0,
  renderStatus: "not-started",
  controlsReceipt: "pending",
  controlsStatus: "pending",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  canvasControlsReceiptAligned: false,
  parentMutationAuthorized: false,
  bootedAt: null,
  renderedAt: null,
  alignedAt: null,
  errors: []
};

const MATERIAL_COLORS = Object.freeze({
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
  state.errors.push({
    label,
    message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  });
}

function normalizeName(value) {
  return safeString(value)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
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
    value.SURFACE_RECEIPT ||
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
    const material = normalizeName(cell[key]);
    if (material) return material;
  }

  return "";
}

function indexFromCell(cell, fallbackIndex) {
  if (!isObject(cell)) return fallbackIndex;

  const keys = ["index", "cellIndex", "cell_index", "cellId", "cell_id", "stateId", "state_id", "id", "i"];

  for (const key of keys) {
    const raw = cell[key];

    if (Number.isInteger(raw) && raw >= 0 && raw < H_EARTH_TOTAL_CELLS) return raw;

    if (typeof raw === "string" && /^\d+$/.test(raw)) {
      const parsed = Number(raw);
      if (parsed >= 0 && parsed < H_EARTH_TOTAL_CELLS) return parsed;
    }
  }

  const row = Number.isInteger(cell.row) ? cell.row : Number.isInteger(cell.r) ? cell.r : null;
  const col = Number.isInteger(cell.col) ? cell.col : Number.isInteger(cell.c) ? cell.c : null;

  if (row !== null && col !== null) {
    const index = row * H_EARTH_GRID + col;
    if (index >= 0 && index < H_EARTH_TOTAL_CELLS) return index;
  }

  return fallbackIndex;
}

function kindFromMaterial(material, cell = null) {
  const name = normalizeName(material);

  if (name.includes("ocean") || name.includes("water") || name.includes("reef")) return "ocean";
  if (name.includes("ice") || name.includes("snow") || name.includes("glacier")) return "ice";
  if (name.includes("stone") || name.includes("mountain") || name.includes("cliff") || name.includes("canyon") || name.includes("volcanic") || name.includes("mineral")) return "stone";
  if (name.includes("beach") || name.includes("sediment") || name.includes("coastal")) return "coast";
  if (name.includes("ground") || name.includes("forest") || name.includes("land") || name.includes("island") || name.includes("archipelago") || name.includes("valley") || name.includes("ridge") || name.includes("basin")) return "land";

  if (isObject(cell)) {
    if (cell.isOcean === true || cell.ocean === true || cell.water === true) return "ocean";
    if (cell.isLand === true || cell.land === true) return "land";
  }

  return "unknown";
}

function colorForMaterial(material, kind) {
  const name = normalizeName(material);

  if (MATERIAL_COLORS[name]) return MATERIAL_COLORS[name];
  if (name.includes("abyss")) return MATERIAL_COLORS["abyssal-ocean"];
  if (name.includes("deep") && name.includes("ocean")) return MATERIAL_COLORS["deep-ocean"];
  if (name.includes("ocean")) return MATERIAL_COLORS["open-ocean"];
  if (name.includes("water")) return MATERIAL_COLORS["basin-mouth-water"];
  if (name.includes("shelf")) return MATERIAL_COLORS["coastal-shelf-water"];
  if (name.includes("beach")) return MATERIAL_COLORS["beach-sediment"];
  if (name.includes("archipelago")) return MATERIAL_COLORS["archipelago-ground"];
  if (name.includes("island")) return MATERIAL_COLORS["island-ground"];
  if (name.includes("forest")) return MATERIAL_COLORS["forest-ground"];
  if (name.includes("wetland")) return MATERIAL_COLORS["wetland-ground"];
  if (name.includes("basin")) return MATERIAL_COLORS["basin-ground"];
  if (name.includes("valley")) return MATERIAL_COLORS["valley-ground"];
  if (name.includes("highland")) return MATERIAL_COLORS["highland-ground"];
  if (name.includes("ridge")) return MATERIAL_COLORS["ridge-ground"];
  if (name.includes("canyon")) return MATERIAL_COLORS["canyon-stone"];
  if (name.includes("cliff")) return MATERIAL_COLORS["cliff-stone"];
  if (name.includes("mineral")) return MATERIAL_COLORS["mineral-stone"];
  if (name.includes("volcanic")) return MATERIAL_COLORS["volcanic-stone"];
  if (name.includes("stone") || name.includes("mountain")) return MATERIAL_COLORS["mountain-stone"];
  if (name.includes("ice")) return MATERIAL_COLORS["glacier-ice"];
  if (name.includes("snow")) return MATERIAL_COLORS["snow-highland"];

  if (kind === "ocean") return MATERIAL_COLORS["open-ocean"];
  if (kind === "ice") return MATERIAL_COLORS["glacier-ice"];
  if (kind === "stone") return MATERIAL_COLORS["mountain-stone"];
  if (kind === "coast") return MATERIAL_COLORS["beach-sediment"];
  if (kind === "land") return MATERIAL_COLORS["lowland-ground"];

  return "#2d4050";
}

function collectSurfaceCandidates(surface) {
  const candidates = [];
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
      if (Object.prototype.hasOwnProperty.call(root, key)) {
        const cells = toArray(root[key]);
        if (cells.length >= H_EARTH_TOTAL_CELLS) {
          candidates.push({ source: `surface.${key}`, cells });
        }
      }
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

  for (const name of providers) {
    if (typeof surface?.[name] !== "function") continue;

    const argSets = [
      [],
      [{ readOnly: true }],
      [{ mutationAuthorized: false }],
      [{ readOnly: true, mutationAuthorized: false }]
    ];

    for (const args of argSets) {
      try {
        const result = surface[name](...args);
        const cells = toArray(result);
        if (cells.length >= H_EARTH_TOTAL_CELLS) {
          candidates.push({ source: `surface.${name}()`, cells });
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }

  return candidates;
}

function normalizeCells(candidates) {
  const cells = [];

  for (let index = 0; index < H_EARTH_TOTAL_CELLS; index += 1) {
    const row = Math.floor(index / H_EARTH_GRID);
    const col = index % H_EARTH_GRID;

    cells[index] = {
      index,
      row,
      col,
      latitude: 90 - ((row + 0.5) / H_EARTH_GRID) * 180,
      longitude: -180 + ((col + 0.5) / H_EARTH_GRID) * 360,
      material: "",
      kind: "unknown",
      color: "#2d4050",
      assignedSurface: false
    };
  }

  for (const candidate of candidates) {
    for (let fallbackIndex = 0; fallbackIndex < Math.min(candidate.cells.length, H_EARTH_TOTAL_CELLS); fallbackIndex += 1) {
      const item = candidate.cells[fallbackIndex];
      const index = indexFromCell(item, fallbackIndex);
      const material = materialFromCell(item);

      if (!material || index < 0 || index >= H_EARTH_TOTAL_CELLS) continue;

      const row = Math.floor(index / H_EARTH_GRID);
      const col = index % H_EARTH_GRID;
      const kind = kindFromMaterial(material, item);

      cells[index] = {
        ...(isObject(item) ? item : {}),
        index,
        row,
        col,
        latitude: Number.isFinite(Number(item?.latitude))
          ? Number(item.latitude)
          : 90 - ((row + 0.5) / H_EARTH_GRID) * 180,
        longitude: Number.isFinite(Number(item?.longitude))
          ? Number(item.longitude)
          : -180 + ((col + 0.5) / H_EARTH_GRID) * 360,
        material,
        kind,
        color: colorForMaterial(material, kind),
        assignedSurface: true,
        source: candidate.source
      };
    }
  }

  return cells;
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

  state.parentInstancesPassed = Boolean(valid);

  if (!valid) {
    state.status = "held-route-parent-instances-missing";
    state.renderStatus = "held-route-parent-instances-missing";
    return null;
  }

  return instances;
}

function evaluateSurface(parentInstances, cells, candidates) {
  const surface = parentInstances?.surface;
  const summary = surface?.summary || {};

  state.surfaceReceipt = surface?.receipts?.surface?.contract || receiptFrom(surface) || "missing";

  const assignedCells = cells.filter((cell) => cell.assignedSurface && cell.material);
  const materialSet = new Set(assignedCells.map((cell) => cell.material));

  state.cellsResolved = assignedCells.length;
  state.surfaceMaterialClasses = materialSet.size;

  state.landCells = assignedCells.filter((cell) => {
    return cell.kind === "land" || cell.kind === "stone" || cell.kind === "coast" || cell.kind === "ice";
  }).length;

  state.oceanCells = assignedCells.filter((cell) => cell.kind === "ocean").length;

  state.parentSurfaceReady =
    summary.surfaceParentReady === true &&
    summary.downstreamCanvasMayReadSurface === true &&
    assignedCells.length === H_EARTH_TOTAL_CELLS &&
    candidates.length > 0;

  state.downstreamCanvasMayReadSurface = state.parentSurfaceReady;

  return state.parentSurfaceReady;
}

function controlsApi() {
  return window.DGBHEarthControls || window.HEarthControls || window.H_EARTH_CONTROLS || null;
}

function readControlsStatus(providedStatus = null) {
  const api = controlsApi();
  let status = providedStatus || null;

  if (!status && api) {
    if (typeof api.getHEarthControlsStatus === "function") status = api.getHEarthControlsStatus();
    else if (typeof api.getStatus === "function") status = api.getStatus();
    else if (typeof api.status === "function") status = api.status();
  }

  const receipt = status?.contract || status?.receipt || window.H_EARTH_CONTROLS_RECEIPT || "pending";

  const active =
    receipt === H_EARTH_EXPECTED_CONTROLS &&
    status?.status === "active-motion-input-authority" &&
    status?.controlsAuthorized === true &&
    status?.motionAuthorized === true &&
    status?.inputAuthorized === true &&
    status?.parentMutationAuthorized === false;

  state.controlsReceipt = receipt;
  state.controlsStatus = status?.status || (api ? "loaded-held" : "pending");
  state.controlsAuthorized = active;
  state.motionAuthorized = active;
  state.inputAuthorized = active;
  state.canvasControlsReceiptAligned = active;
  state.parentMutationAuthorized = false;

  if (active) state.alignedAt = new Date().toISOString();

  return status;
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

function ensureStyle() {
  if (document.getElementById("h-earth-renewed-child-canvas-style-v10a")) return;

  const style = document.createElement("style");
  style.id = "h-earth-renewed-child-canvas-style-v10a";
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
      transform-origin: center center;
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

function ensurePanel() {
  ensureStyle();

  let panel = document.querySelector("[data-h-earth-canvas-panel]");

  if (panel) {
    const title = panel.querySelector("[data-h-earth-canvas-title]");
    const copy = panel.querySelector("[data-h-earth-canvas-copy]");
    if (title) title.textContent = "H-Earth Canvas Asset Path Renewal";
    if (copy) {
      copy.textContent =
        "Canvas is active as a renewed downstream child asset. It reads route-passed parent surface truth directly and aligns with controls after motion/input authority activates. Parent truth remains immutable.";
    }

    return panel;
  }

  panel = document.createElement("section");
  panel.setAttribute("data-h-earth-canvas-panel", "true");
  panel.setAttribute("aria-label", "H-Earth renewed child canvas visible composition");

  panel.innerHTML = `
    <h2 data-h-earth-canvas-title>H-Earth Canvas Asset Path Renewal</h2>
    <p data-h-earth-canvas-copy>
      Canvas is active as a renewed downstream child asset. It reads route-passed parent surface truth directly and aligns with controls after motion/input authority activates. Parent truth remains immutable.
    </p>
    <div data-h-earth-canvas-stage>
      <canvas
        data-h-earth-canvas
        width="1200"
        height="1200"
        aria-label="H-Earth renewed child canvas visible composition"
        role="img"
      ></canvas>
    </div>
    <div data-h-earth-canvas-status aria-live="polite"></div>
  `;

  findCanvasHost().appendChild(panel);
  return panel;
}

function statusTarget(panel) {
  let target = panel.querySelector("[data-h-earth-canvas-status]");
  if (!target) {
    target = document.createElement("div");
    target.setAttribute("data-h-earth-canvas-status", "");
    target.setAttribute("aria-live", "polite");
    panel.appendChild(target);
  }

  return target;
}

function publishPanelStatus() {
  readControlsStatus();

  const panel = ensurePanel();
  const target = statusTarget(panel);

  target.innerHTML = `
    <span><strong>Contract</strong>${state.contract}</span>
    <span><strong>Renewal</strong>${state.renewalContract}</span>
    <span><strong>Previous</strong>${state.previousContract}</span>
    <span><strong>Asset path</strong>${state.assetPath}</span>
    <span><strong>Parent mode</strong>${state.parentConsumptionMode}</span>
    <span><strong>Parent instances</strong>${String(state.parentInstancesPassed)}</span>
    <span><strong>Surface receipt</strong>${state.surfaceReceipt}</span>
    <span><strong>Parent surface ready</strong>${String(state.parentSurfaceReady)}</span>
    <span><strong>Canvas may read</strong>${String(state.downstreamCanvasMayReadSurface)}</span>
    <span><strong>Cells resolved</strong>${state.cellsResolved}/256</span>
    <span><strong>Cells painted</strong>${state.cellsPainted}/256</span>
    <span><strong>Material classes</strong>${state.surfaceMaterialClasses}</span>
    <span><strong>Land / ocean cells</strong>${state.landCells} / ${state.oceanCells}</span>
    <span><strong>Nonblank pixel proof</strong>${Number(state.nonBlankPixelRatio || 0).toFixed(4)}</span>
    <span><strong>Render status</strong>${state.renderStatus}</span>
    <span><strong>Controls receipt</strong>${state.controlsReceipt}</span>
    <span><strong>Controls status</strong>${state.controlsStatus}</span>
    <span><strong>Controls aligned</strong>${String(state.canvasControlsReceiptAligned)}</span>
    <span><strong>Parent mutation</strong>forbidden</span>
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
  ctx.fillText("H-Earth · Renewed Child Canvas", width / 2, height * 0.075);

  ctx.fillStyle = "rgba(243, 227, 189, 0.72)";
  ctx.font = `${Math.max(13, width * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Route-passed parent truth · No legacy canvas parent · Controls align downstream", width / 2, height * 0.108);

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
  ctx.fillText("H-Earth Renewed Child Canvas Held", width / 2, height * 0.43);

  ctx.fillStyle = "rgba(243, 227, 189, 0.76)";
  ctx.font = `${Math.max(14, width * 0.018)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(reason, width / 2, height * 0.48);
  ctx.fillText("This canvas does not import or execute the legacy canvas.", width / 2, height * 0.52);
  ctx.restore();

  state.renderStatus = reason;
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

function renderComposition(canvas, cells) {
  const ctx = canvas.getContext("2d", { alpha: false });

  if (!ctx) {
    state.renderStatus = "failed-no-2d-context";
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

  state.renderStatus = "visible-composition-painted-from-surface-instance";
  state.status = "renewed-child-canvas-visible-composition-loaded";
  state.renderedAt = new Date().toISOString();
}

function exposeCanvasApi() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    assetPath: H_EARTH_RENEWED_ASSET_PATH,
    boot: bootHEarthCanvas,
    bootHEarthCanvas,
    status: getHEarthCanvasStatus,
    getStatus: getHEarthCanvasStatus,
    getHEarthCanvasStatus,
    refreshControlsStatus: refreshHEarthCanvasControlsStatus,
    refreshHEarthCanvasControlsStatus,
    controlsAuthorized: () => state.controlsAuthorized,
    motionAuthorized: () => state.motionAuthorized,
    inputAuthorized: () => state.inputAuthorized
  };

  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_CANVAS = api;
  window.H_EARTH_CANVAS_RECEIPT = H_EARTH_CANVAS_CONTRACT;

  document.documentElement.dataset.hEarthCanvasReceipt = H_EARTH_CANVAS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasRenewalContract = H_EARTH_CANVAS_RENEWAL_CONTRACT;
  document.documentElement.dataset.hEarthCanvasPreviousReceipt = H_EARTH_CANVAS_PREVIOUS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasAssetPath = H_EARTH_RENEWED_ASSET_PATH;
  document.documentElement.dataset.hEarthCanvasControlsReceiptAligned = String(state.canvasControlsReceiptAligned);
  document.documentElement.dataset.hEarthCanvasControlsStatus = state.controlsStatus;
  document.documentElement.dataset.hEarthCanvasControlsAuthorized = String(state.controlsAuthorized);
  document.documentElement.dataset.hEarthParentMutationAuthorized = "false";
}

async function bootHEarthCanvas(context = {}) {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    state.bootedAt = new Date().toISOString();
    state.status = "booting-renewed-child-canvas";
    state.renderStatus = "booting-renewed-child-canvas";

    const panel = ensurePanel();
    const canvas = panel.querySelector("[data-h-earth-canvas]");

    if (!canvas) {
      state.status = "failed-no-canvas-element";
      state.renderStatus = "failed-no-canvas-element";
      publishPanelStatus();
      exposeCanvasApi();
      return getHEarthCanvasStatus();
    }

    try {
      const parentInstances = resolveParentInstances(context);

      if (!parentInstances) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          drawHeld(ctx, canvas, "held-route-parent-instances-missing");
          measureNonBlank(ctx, canvas.width, canvas.height);
        }

        publishPanelStatus();
        exposeCanvasApi();
        return getHEarthCanvasStatus();
      }

      const candidates = collectSurfaceCandidates(parentInstances.surface);
      const cells = normalizeCells(candidates);
      const ready = evaluateSurface(parentInstances, cells, candidates);

      if (!ready) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          drawHeld(ctx, canvas, "held-parent-surface-not-resolved");
          measureNonBlank(ctx, canvas.width, canvas.height);
        }

        publishPanelStatus();
        exposeCanvasApi();
        return getHEarthCanvasStatus();
      }

      renderComposition(canvas, cells);
      publishPanelStatus();
      exposeCanvasApi();

      return getHEarthCanvasStatus();
    } catch (error) {
      recordError("boot-renewed-child-canvas", error);

      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        drawHeld(ctx, canvas, "failed-renewed-child-canvas");
        measureNonBlank(ctx, canvas.width, canvas.height);
      }

      state.status = "failed-renewed-child-canvas";
      state.renderStatus = "failed-renewed-child-canvas";
      publishPanelStatus();
      exposeCanvasApi();

      return getHEarthCanvasStatus();
    }
  })();

  return bootPromise;
}

function refreshHEarthCanvasControlsStatus(controlsStatus = null) {
  readControlsStatus(controlsStatus);
  publishPanelStatus();
  exposeCanvasApi();
  return getHEarthCanvasStatus();
}

function getHEarthCanvasStatus() {
  readControlsStatus();

  return {
    contract: H_EARTH_CANVAS_CONTRACT,
    renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    assetPath: H_EARTH_RENEWED_ASSET_PATH,
    parentConsumptionMode: state.parentConsumptionMode,
    parentInstancesPassed: state.parentInstancesPassed,
    surfaceReceipt: state.surfaceReceipt,
    surfaceReceiptExpected: state.surfaceReceiptExpected,
    parentSurfaceReady: state.parentSurfaceReady,
    downstreamCanvasMayReadSurface: state.downstreamCanvasMayReadSurface,
    cellsResolved: state.cellsResolved,
    cellsPainted: state.cellsPainted,
    surfaceMaterialClasses: state.surfaceMaterialClasses,
    landCells: state.landCells,
    oceanCells: state.oceanCells,
    nonBlankPixelRatio: state.nonBlankPixelRatio,
    renderStatus: state.renderStatus,
    controlsReceipt: state.controlsReceipt,
    controlsStatus: state.controlsStatus,
    controlsAuthorized: state.controlsAuthorized,
    motionAuthorized: state.motionAuthorized,
    inputAuthorized: state.inputAuthorized,
    canvasControlsReceiptAligned: state.canvasControlsReceiptAligned,
    parentMutationAuthorized: false,
    earthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,
    bootedAt: state.bootedAt,
    renderedAt: state.renderedAt,
    alignedAt: state.alignedAt,
    errors: [...state.errors]
  };
}

exposeCanvasApi();

export {
  H_EARTH_CANVAS_CONTRACT,
  H_EARTH_CANVAS_RENEWAL_CONTRACT,
  H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  H_EARTH_RENEWED_ASSET_PATH,
  H_EARTH_EXPECTED_CONTROLS,
  bootHEarthCanvas,
  getHEarthCanvasStatus,
  refreshHEarthCanvasControlsStatus
};

export default {
  contract: H_EARTH_CANVAS_CONTRACT,
  renewalContract: H_EARTH_CANVAS_RENEWAL_CONTRACT,
  receipt: H_EARTH_CANVAS_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  assetPath: H_EARTH_RENEWED_ASSET_PATH,
  boot: bootHEarthCanvas,
  bootHEarthCanvas,
  status: getHEarthCanvasStatus,
  getStatus: getHEarthCanvasStatus,
  getHEarthCanvasStatus,
  refreshControlsStatus: refreshHEarthCanvasControlsStatus,
  refreshHEarthCanvasControlsStatus
};
