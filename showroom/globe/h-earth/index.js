// /showroom/globe/h-earth/index.js
// H_EARTH_G1_CANVAS_ROUTE_DOORWAY_ACTIVATION_TNT_v5
// Full-file replacement.
// Route doorway authority only.
//
// Purpose:
// - Preserve the passed parent chain: kernel → lattice256 → landmap → terrain → surface.
// - Activate canvas as the first downstream visible-composition child after surface readiness.
// - Import canvas only after surface parent material truth passes active-read requirements.
// - Keep controls held.
// - Publish canvas receipt, canvas status, and parent-chain receipts without motion/input authority.
//
// Owns:
// - route boot
// - parent-chain module import sequence
// - canvas child activation handoff
// - status bridge
// - public route receipts
// - surface-readiness publication
// - canvas-activation publication
//
// Does not own:
// - planet truth
// - land/water truth
// - terrain truth
// - material truth
// - controls
// - animation math
// - input handling
// - Earth mutation
// - Hearth mutation
// - Audralia mutation

const CONTRACT = "H_EARTH_G1_CANVAS_ROUTE_DOORWAY_ACTIVATION_TNT_v5";
const PRIOR_CONTRACT = "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const SURFACE_ACTIVE_READ_CHAIN = "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4";
const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const GENERATION = "G1";

const URL_CACHE = new URLSearchParams(window.location.search).get("v") || "canvas-route-doorway-activation-v1";
const CACHE_KEY = `2026-05-11-h-earth-canvas-route-doorway-activation-v1-${URL_CACHE}`;

const EXPECTED_CONTRACTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  canvas: "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1"
});

const ACTIVE_MODULES = Object.freeze([
  {
    key: "kernel",
    label: "Kernel parent core",
    path: "/assets/h-earth/h-earth.kernel.js",
    requiredExport: "createHEarthKernel"
  },
  {
    key: "lattice256",
    label: "256 lattice parent-coordinate engine",
    path: "/assets/h-earth/h-earth.lattice256.js",
    requiredExport: "createHEarthLattice256"
  },
  {
    key: "landmap",
    label: "Landmap parent mask",
    path: "/assets/h-earth/h-earth.landmap.js",
    requiredExport: "createHEarthLandmap"
  },
  {
    key: "terrain",
    label: "Terrain parent relief",
    path: "/assets/h-earth/h-earth.terrain.js",
    requiredExport: "createHEarthTerrain"
  },
  {
    key: "surface",
    label: "Surface parent material truth",
    path: "/assets/h-earth/h-earth.surface.js",
    requiredExport: "createHEarthSurface"
  }
]);

const CANVAS_MODULE = Object.freeze({
  key: "canvas",
  label: "Canvas visible composition",
  path: "/assets/h-earth/h-earth.canvas.js",
  requiredExport: "bootHEarthCanvas"
});

const HELD_MODULES = Object.freeze([
  {
    key: "controls",
    label: "Controls motion/input only",
    path: "/assets/h-earth/h-earth.controls.js",
    status: "held-until-canvas-visible-composition-passes"
  }
]);

const state = {
  contract: CONTRACT,
  priorContract: PRIOR_CONTRACT,
  seedPacket: SEED_PACKET,
  terrainOnlyChain: TERRAIN_ONLY_CHAIN,
  surfaceActiveReadChain: SURFACE_ACTIVE_READ_CHAIN,
  route: ROUTE,
  planet: PLANET,
  generation: GENERATION,
  cacheKey: CACHE_KEY,
  routeDoorway: "booting",
  parentChainStatus: "pending",
  canvasStatus: "held-until-surface-parent-read-passes",
  canvasPaintAuthorized: false,
  controlsAuthorized: false,
  loadedCount: 0,
  failedCount: 0,
  staleContractCount: 0,
  activeModules: {},
  heldModules: {},
  canvasModule: {
    status: "held-until-surface-parent-read-passes",
    path: CANVAS_MODULE.path,
    actualContract: "pending",
    renderStatus: "pending"
  },
  instances: {},
  canvasRuntimeStatus: null,
  errors: []
};

function byId(id) {
  return document.getElementById(id);
}

function statusTarget() {
  return byId("hEarthStatusTarget");
}

function mountTarget() {
  return byId("hEarthCanvasMount");
}

function receiptPanel() {
  return byId("hEarthReceiptPanel");
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function moduleUrl(path) {
  return `${path}?v=${encodeURIComponent(CACHE_KEY)}`;
}

function getImportedContract(imported, instance) {
  return imported?.CONTRACT || instance?.contract || "contract-not-exported";
}

function getImportedCanvasContract(imported, status) {
  return (
    imported?.H_EARTH_CANVAS_CONTRACT ||
    imported?.default?.contract ||
    status?.contract ||
    status?.receipt ||
    "contract-not-exported"
  );
}

function currentCanvasDatasetValue() {
  if (state.canvasStatus === "active-visible-composition") return "active-visible-composition";
  if (state.canvasStatus === "failed") return "failed";
  if (state.canvasStatus === "loading") return "loading";
  return "held";
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.parentCoreChainStatus = state.parentChainStatus;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.surface = "active-read-only";
  root.dataset.canvas = currentCanvasDatasetValue();
  root.dataset.controls = "held";
  root.dataset.canvasPaintAuthorized = String(state.canvasPaintAuthorized);
  root.dataset.controlsAuthorized = "false";
  root.dataset.graphicBox = "forbidden";
  root.dataset.imageGeneration = "forbidden";
  root.dataset.visualPassClaim = "false";
  root.dataset.australiaTerminology = "forbidden";
}

function publishStatus(message, lines = []) {
  const target = statusTarget();
  if (!target) return;

  target.dataset.currentStatus = message;
  target.dataset.routeDoorway = "active";
  target.dataset.routeDoorwayContract = CONTRACT;
  target.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  target.dataset.parentCoreChain = state.parentChainStatus;
  target.dataset.surface = "active-read-only";
  target.dataset.canvas = currentCanvasDatasetValue();
  target.dataset.controls = "held";
  target.dataset.canvasPaintAuthorized = String(state.canvasPaintAuthorized);
  target.dataset.controlsAuthorized = "false";
  target.dataset.cacheKey = CACHE_KEY;

  target.replaceChildren(
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_DOORWAY: ${PRIOR_CONTRACT}`),
    codeLine(`SEED_PACKET: ${SEED_PACKET}`),
    codeLine(`CACHE_KEY: ${CACHE_KEY}`),
    codeLine(`STATUS: ${message}`),
    ...lines.map(codeLine)
  );
}

function publishReceiptPanel() {
  const panel = receiptPanel();
  if (!panel) return;

  panel.dataset.receiptDoorway = CONTRACT;
  panel.dataset.previousReceiptDoorway = PRIOR_CONTRACT;
  panel.dataset.parentChainStatus = state.parentChainStatus;
  panel.dataset.loadedModules = String(state.loadedCount);
  panel.dataset.failedModules = String(state.failedCount);
  panel.dataset.staleContractCount = String(state.staleContractCount);
  panel.dataset.cacheKey = CACHE_KEY;
  panel.dataset.surface = "active-read-only";
  panel.dataset.canvas = currentCanvasDatasetValue();
  panel.dataset.controls = "held";
  panel.dataset.canvasPaintAuthorized = String(state.canvasPaintAuthorized);
  panel.dataset.controlsAuthorized = "false";

  const activeLines = ACTIVE_MODULES.map((entry) => {
    const record = state.activeModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED_CONTRACTS[entry.key];
    const actual = record?.actualContract || "pending";
    const stale = expected && actual !== "pending" && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const canvasLine = (() => {
    const record = state.canvasModule;
    const expected = EXPECTED_CONTRACTS.canvas;
    const actual = record?.actualContract || "pending";
    const stale =
      actual !== "pending" &&
      actual !== "held" &&
      actual !== "import-failed" &&
      actual !== expected
        ? " · STALE_CONTRACT"
        : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `CANVAS: ${record.status} · expected=${expected} · actual=${actual}${stale} · ${CANVAS_MODULE.path}${error}`;
  })();

  const heldLines = HELD_MODULES.map((entry) => {
    return `${entry.key.toUpperCase()}: ${entry.status} · ${entry.path}`;
  });

  const terrain = state.instances.terrain;
  const landmap = state.instances.landmap;
  const surface = state.instances.surface;

  const terrainSummary = terrain?.summary;
  const landSummary = landmap?.summary;
  const surfaceSummary = surface?.summary;
  const surfaceReceipt = surface?.receipts?.surface;
  const activation = surface?.activationConditions;

  const canvasRuntime = state.canvasRuntimeStatus;

  const proofLines = terrainSummary && landSummary && surfaceSummary
    ? [
        `LAND_RATIO: ${landSummary.landRatio}`,
        `OCEAN_RATIO: ${landSummary.oceanRatio}`,
        `TERRAIN_TOTAL_CELLS: ${terrainSummary.totalCells}`,
        `TERRAIN_ASPECTS: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
        `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
        `SURFACE_TOTAL_CELLS: ${surfaceSummary.totalCells}`,
        `LAND_SURFACE_CELLS: ${surfaceSummary.landSurfaceCells}`,
        `OCEAN_SURFACE_CELLS: ${surfaceSummary.oceanSurfaceCells}`,
        `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
        `EVERY_CELL_ASSIGNED_SURFACE: ${String(surfaceSummary.everyCellAssignedSurface)}`,
        `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady)}`,
        `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
        `ROUTE_CANVAS_PAINT_AUTHORIZED: ${String(state.canvasPaintAuthorized)}`,
        `CONTROLS_AUTHORIZED: ${String(state.controlsAuthorized)}`,
        `CANVAS_RENDER_STATUS: ${canvasRuntime?.renderStatus || state.canvasModule.renderStatus || "pending"}`,
        `CANVAS_CELLS_RESOLVED: ${canvasRuntime?.cellsResolved ?? "pending"}`,
        `CANVAS_CELLS_PAINTED: ${canvasRuntime?.cellsPainted ?? "pending"}`,
        `CANVAS_NONBLANK_PIXEL_RATIO: ${canvasRuntime?.nonBlankPixelRatio ?? "pending"}`,
        `SURFACE_RECEIPT: ${surfaceReceipt?.contract || "missing"}`,
        `CANVAS_RECEIPT: ${state.canvasModule.actualContract || "pending"}`,
        `SURFACE_ACTIVATION_REASON: ${activation?.reason || "pending"}`
      ]
    : ["SURFACE_SUMMARY: pending"];

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`LOADED_ACTIVE_PARENT_MODULES: ${state.loadedCount}`),
    codeLine(`FAILED_ACTIVE_PARENT_MODULES: ${state.failedCount}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`SURFACE: ACTIVE_READ_ONLY`),
    codeLine(`CANVAS: ${state.canvasStatus.toUpperCase()}`),
    codeLine(`CONTROLS: HELD`),
    codeLine(`GRAPHIC_BOX: FORBIDDEN`),
    codeLine(`IMAGE_GENERATION: FORBIDDEN`),
    codeLine(`VISUAL_PASS_CLAIM: FALSE`),
    ...activeLines.map(codeLine),
    codeLine(canvasLine),
    ...heldLines.map(codeLine),
    ...proofLines.map(codeLine)
  );
}

function renderMountMessage(title, bodyLines = []) {
  const mount = mountTarget();
  if (!mount) return;

  mount.dataset.routeMount = "surface-and-canvas-status";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.cacheKey = CACHE_KEY;
  mount.dataset.surfaceAuthority = "active-read-only";
  mount.dataset.canvasAuthority = currentCanvasDatasetValue();
  mount.dataset.controlsAuthority = "held";
  mount.dataset.planetTruthOwner = "parent-chain";

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 440px)";
  shell.style.transform = "translate(-50%, -50%)";
  shell.style.padding = "16px";
  shell.style.border = "1px solid rgba(143, 240, 195, 0.34)";
  shell.style.borderRadius = "24px";
  shell.style.background = "rgba(5, 9, 18, 0.80)";
  shell.style.color = "#f6ead2";
  shell.style.textAlign = "center";
  shell.style.font = "700 0.9rem Inter, system-ui, sans-serif";
  shell.style.letterSpacing = "0.02em";
  shell.style.boxShadow = "0 20px 60px rgba(0,0,0,.35)";

  const heading = document.createElement("div");
  heading.textContent = title;
  heading.style.color = "#8ff0c3";
  heading.style.fontWeight = "900";
  heading.style.textTransform = "uppercase";
  heading.style.letterSpacing = "0.08em";
  heading.style.marginBottom = bodyLines.length ? "10px" : "0";

  shell.appendChild(heading);

  for (const line of bodyLines) {
    const item = document.createElement("div");
    item.textContent = line;
    item.style.color = "#b9c1cf";
    item.style.fontWeight = "700";
    item.style.lineHeight = "1.45";
    item.style.marginTop = "4px";
    shell.appendChild(item);
  }

  mount.replaceChildren(shell);
}

async function importModule(entry) {
  const url = moduleUrl(entry.path);

  try {
    const imported = await import(url);

    if (!imported || typeof imported[entry.requiredExport] !== "function") {
      const error = `required export missing: ${entry.requiredExport}`;
      state.activeModules[entry.key] = {
        status: "loaded-export-missing",
        path: entry.path,
        url,
        actualContract: imported?.CONTRACT || "unknown",
        error
      };
      state.failedCount += 1;
      state.errors.push(`${entry.key}: ${error}`);
      return null;
    }

    state.activeModules[entry.key] = {
      status: "loaded",
      path: entry.path,
      url,
      requiredExport: entry.requiredExport,
      actualContract: imported.CONTRACT || "contract-not-exported",
      module: imported
    };

    state.loadedCount += 1;
    return imported;
  } catch (error) {
    const message = safeError(error);
    state.activeModules[entry.key] = {
      status: "not-available-or-import-failed",
      path: entry.path,
      url,
      requiredExport: entry.requiredExport,
      actualContract: "import-failed",
      error: message
    };
    state.failedCount += 1;
    state.errors.push(`${entry.key}: ${message}`);
    return null;
  }
}

async function importCanvasModule() {
  const url = moduleUrl(CANVAS_MODULE.path);

  state.canvasStatus = "loading";
  state.canvasModule = {
    status: "loading",
    path: CANVAS_MODULE.path,
    url,
    requiredExport: CANVAS_MODULE.requiredExport,
    actualContract: "pending",
    renderStatus: "loading"
  };

  stampDocument();
  publishStatus("surface parent passed; loading canvas visible composition", [
    `CANVAS_MODULE: ${CANVAS_MODULE.path}`,
    `IMPORT_URL: ${url}`,
    `CONTROLS: held`
  ]);
  publishReceiptPanel();

  try {
    const imported = await import(url);

    if (!imported || typeof imported[CANVAS_MODULE.requiredExport] !== "function") {
      const error = `required export missing: ${CANVAS_MODULE.requiredExport}`;
      state.canvasStatus = "failed";
      state.canvasPaintAuthorized = false;
      state.canvasModule = {
        status: "loaded-export-missing",
        path: CANVAS_MODULE.path,
        url,
        requiredExport: CANVAS_MODULE.requiredExport,
        actualContract: getImportedCanvasContract(imported, null),
        renderStatus: "failed",
        error
      };
      state.errors.push(`canvas: ${error}`);
      stampDocument();
      publishStatus("canvas import loaded but export missing", [
        `CANVAS_MODULE: ${CANVAS_MODULE.path}`,
        `ERROR: ${error}`,
        `CONTROLS: held`
      ]);
      publishReceiptPanel();
      return false;
    }

    const canvasStatus = await imported.bootHEarthCanvas();
    state.canvasRuntimeStatus = canvasStatus || null;

    const actualContract = getImportedCanvasContract(imported, canvasStatus);

    state.canvasModule = {
      status: "loaded",
      path: CANVAS_MODULE.path,
      url,
      requiredExport: CANVAS_MODULE.requiredExport,
      actualContract,
      renderStatus: canvasStatus?.renderStatus || "loaded"
    };

    if (actualContract !== EXPECTED_CONTRACTS.canvas) {
      state.staleContractCount += 1;
    }

    state.canvasStatus = "active-visible-composition";
    state.canvasPaintAuthorized = true;
    state.controlsAuthorized = false;
    state.parentChainStatus =
      state.staleContractCount > 0
        ? "canvas-route-doorway-active-with-stale-contracts-detected"
        : "canvas-route-doorway-active-visible-composition-loaded";

    stampDocument();
    publishStatus(state.parentChainStatus, [
      `CANVAS: loaded · ${actualContract}`,
      `CANVAS_RENDER_STATUS: ${canvasStatus?.renderStatus || "loaded"}`,
      `CANVAS_CELLS_RESOLVED: ${canvasStatus?.cellsResolved ?? "pending"}`,
      `CANVAS_CELLS_PAINTED: ${canvasStatus?.cellsPainted ?? "pending"}`,
      `CANVAS_NONBLANK_PIXEL_RATIO: ${canvasStatus?.nonBlankPixelRatio ?? "pending"}`,
      `CANVAS_PAINT_AUTHORIZED: true`,
      `CONTROLS_AUTHORIZED: false`,
      `VISUAL_PASS_CLAIM: false`
    ]);
    publishReceiptPanel();

    return true;
  } catch (error) {
    const message = safeError(error);

    state.canvasStatus = "failed";
    state.canvasPaintAuthorized = false;
    state.canvasModule = {
      status: "import-failed",
      path: CANVAS_MODULE.path,
      url,
      requiredExport: CANVAS_MODULE.requiredExport,
      actualContract: "import-failed",
      renderStatus: "failed",
      error: message
    };
    state.errors.push(`canvas: ${message}`);
    state.parentChainStatus = "surface-parent-loaded-but-canvas-import-failed";

    stampDocument();
    publishStatus("surface parent loaded but canvas import failed", [
      `CANVAS_MODULE: ${CANVAS_MODULE.path}`,
      `IMPORT_URL: ${url}`,
      `ERROR: ${message}`,
      `CONTROLS: held`
    ]);
    publishReceiptPanel();

    return false;
  }
}

function setHeldModules() {
  for (const entry of HELD_MODULES) {
    state.heldModules[entry.key] = {
      status: entry.status,
      path: entry.path
    };
  }
}

async function loadActiveModules() {
  for (const entry of ACTIVE_MODULES) {
    publishStatus(`loading ${entry.key}`, [
      `CURRENT_MODULE: ${entry.path}`,
      `IMPORT_URL: ${moduleUrl(entry.path)}`
    ]);
    publishReceiptPanel();

    const imported = await importModule(entry);

    if (!imported) {
      state.parentChainStatus = `${entry.key}-failed`;
      document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;
      publishStatus(`${entry.key} import failed`, [
        `FAILED_MODULE: ${entry.path}`,
        `IMPORT_URL: ${moduleUrl(entry.path)}`,
        `ERROR: ${state.activeModules[entry.key]?.error || "unknown"}`
      ]);
      publishReceiptPanel();
      renderMountMessage("Parent chain held", [
        `${entry.key} did not import`,
        "Check direct asset URL and filename"
      ]);
      return false;
    }
  }

  return true;
}

function createInstances() {
  const kernelModule = state.activeModules.kernel?.module;
  const latticeModule = state.activeModules.lattice256?.module;
  const landmapModule = state.activeModules.landmap?.module;
  const terrainModule = state.activeModules.terrain?.module;
  const surfaceModule = state.activeModules.surface?.module;

  try {
    const kernel = kernelModule.createHEarthKernel({
      doorwayContract: CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      route: ROUTE,
      surfaceActiveReadOnly: true,
      canvasRouteActivation: true
    });

    state.instances.kernel = kernel;
    state.activeModules.kernel.actualContract = getImportedContract(kernelModule, kernel);

    const lattice256 = latticeModule.createHEarthLattice256({ kernel });

    state.instances.lattice256 = lattice256;
    state.activeModules.lattice256.actualContract = getImportedContract(latticeModule, lattice256);

    const landmap = landmapModule.createHEarthLandmap({
      kernel,
      lattice256
    });

    state.instances.landmap = landmap;
    state.activeModules.landmap.actualContract = getImportedContract(landmapModule, landmap);

    const terrain = terrainModule.createHEarthTerrain({
      kernel,
      lattice256,
      landmap
    });

    state.instances.terrain = terrain;
    state.activeModules.terrain.actualContract = getImportedContract(terrainModule, terrain);

    const surface = surfaceModule.createHEarthSurface({
      kernel,
      lattice256,
      landmap,
      terrain
    });

    state.instances.surface = surface;
    state.activeModules.surface.actualContract = getImportedContract(surfaceModule, surface);

    state.staleContractCount = ACTIVE_MODULES.filter((entry) => {
      return state.activeModules[entry.key]?.actualContract !== EXPECTED_CONTRACTS[entry.key];
    }).length;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`instance-create: ${message}`);
    state.parentChainStatus = "module-loaded-instance-create-failed";
    document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;

    publishStatus("modules loaded but instance creation failed", [
      `ERROR: ${message}`,
      `CHECK: exported factory function signatures`
    ]);
    publishReceiptPanel();
    renderMountMessage("Parent instance failed", [
      "Modules loaded",
      "Factory chain did not complete"
    ]);

    return false;
  }
}

function materialPreview(surface) {
  const classes = surface?.materialIndex?.materialClasses || [];
  return classes.slice(0, 10).join(" · ") || "pending";
}

function publishSurfaceSuccess() {
  const terrain = state.instances.terrain;
  const landmap = state.instances.landmap;
  const surface = state.instances.surface;

  const terrainSummary = terrain.summary;
  const landSummary = landmap.summary;
  const surfaceSummary = surface.summary;

  const expectedBalance =
    landSummary.landRatio >= 0.3 &&
    landSummary.landRatio <= 0.42 &&
    landSummary.oceanRatio >= 0.58 &&
    landSummary.oceanRatio <= 0.7;

  const fullTerrainDisposition = terrainSummary.fullAspectDisposition === true;
  const surfaceReady = surfaceSummary.surfaceParentReady === true;
  const canvasMayReadSurface = surfaceSummary.downstreamCanvasMayReadSurface === true;

  const canvasActivationAllowed =
    expectedBalance &&
    fullTerrainDisposition &&
    surfaceReady &&
    canvasMayReadSurface &&
    state.staleContractCount === 0;

  state.parentChainStatus =
    state.staleContractCount > 0
      ? "surface-chain-loaded-but-stale-contracts-detected"
      : canvasActivationAllowed
        ? "surface-parent-material-truth-ready-for-canvas-route-activation"
        : "surface-chain-loaded-but-canvas-activation-held";

  state.canvasStatus = canvasActivationAllowed
    ? "authorized-for-route-import"
    : "held-surface-readiness-incomplete";

  state.canvasPaintAuthorized = false;
  state.controlsAuthorized = false;

  document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;
  document.documentElement.dataset.surfaceActiveReadOnly = "true";
  document.documentElement.dataset.canvas = currentCanvasDatasetValue();
  document.documentElement.dataset.controls = "held";
  document.documentElement.dataset.canvasPaintAuthorized = "false";
  document.documentElement.dataset.controlsAuthorized = "false";

  publishStatus(state.parentChainStatus, [
    `KERNEL: loaded · ${state.activeModules.kernel.actualContract}`,
    `LATTICE256: loaded · ${state.activeModules.lattice256.actualContract}`,
    `LANDMAP: loaded · ${state.activeModules.landmap.actualContract}`,
    `TERRAIN: loaded · ${state.activeModules.terrain.actualContract}`,
    `SURFACE: loaded · ${state.activeModules.surface.actualContract}`,
    `STALE_CONTRACTS: ${state.staleContractCount}`,
    `LAND_RATIO: ${landSummary.landRatio}`,
    `OCEAN_RATIO: ${landSummary.oceanRatio}`,
    `TERRAIN_ASPECTS_POPULATED: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
    `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
    `SURFACE_TOTAL_CELLS: ${surfaceSummary.totalCells}`,
    `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
    `EVERY_CELL_ASSIGNED_SURFACE: ${String(surfaceSummary.everyCellAssignedSurface)}`,
    `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady)}`,
    `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
    `CANVAS_IMPORT_AUTHORIZED: ${String(canvasActivationAllowed)}`,
    `CANVAS_PAINT_AUTHORIZED: false`,
    `CONTROLS_AUTHORIZED: false`
  ]);

  publishReceiptPanel();

  renderMountMessage(
    canvasActivationAllowed
      ? "Surface parent ready"
      : "Surface parent held",
    [
      `Land ratio: ${landSummary.landRatio}`,
      `Ocean ratio: ${landSummary.oceanRatio}`,
      `Terrain aspects: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
      `Surface cells: ${surfaceSummary.totalCells}`,
      `Materials: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
      `Canvas may read: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
      `Canvas import authorized: ${String(canvasActivationAllowed)}`,
      `Preview: ${materialPreview(surface)}`
    ]
  );

  return canvasActivationAllowed;
}

async function boot() {
  stampDocument();
  setHeldModules();

  state.routeDoorway = "active";
  state.parentChainStatus = "canvas-route-doorway-checking-surface-parent-chain";
  document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;

  publishStatus("canvas route doorway active; loading parent chain before canvas", [
    `ACTIVE_CHAIN: kernel → lattice256 → landmap → terrain → surface`,
    `CANVAS_CHAIN: held until surface readiness passes`,
    `HELD_CHAIN: controls`,
    `CACHE_KEY: ${CACHE_KEY}`
  ]);
  publishReceiptPanel();
  renderMountMessage("Loading surface parent", [
    "kernel → lattice256 → landmap → terrain → surface",
    "canvas waits for surface readiness",
    "controls held"
  ]);

  const modulesLoaded = await loadActiveModules();
  if (!modulesLoaded) return;

  const instancesCreated = createInstances();
  if (!instancesCreated) return;

  const canvasActivationAllowed = publishSurfaceSuccess();

  if (!canvasActivationAllowed) {
    publishStatus(state.parentChainStatus, [
      `CANVAS: held`,
      `REASON: surface readiness, balance, full disposition, or stale-contract gate did not pass`,
      `CONTROLS: held`
    ]);
    publishReceiptPanel();
    return;
  }

  await importCanvasModule();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PRIOR_CONTRACT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  SURFACE_ACTIVE_READ_CHAIN,
  ROUTE,
  ACTIVE_MODULES,
  CANVAS_MODULE,
  HELD_MODULES,
  CACHE_KEY,
  EXPECTED_CONTRACTS
};
