// /showroom/globe/h-earth/index.js
// H_EARTH_G1_ROUTE_SOURCE_MARKER_ALIGNMENT_TNT_v5
// Required source marker retained for Gauges: H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4
// Full-file replacement.
// Route doorway authority only.

const CONTRACT = "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4";
const ALIGNMENT_CONTRACT = "H_EARTH_G1_ROUTE_SOURCE_MARKER_ALIGNMENT_TNT_v5";
const PRIOR_CONTRACT = "H_EARTH_G1_TERRAIN_BALANCE_ROUTE_DOORWAY_TNT_v3";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const GENERATION = "G1";

const URL_CACHE = new URLSearchParams(window.location.search).get("v") || "route-source-marker-alignment-v5";
const CACHE_KEY = `2026-05-11-h-earth-route-source-marker-alignment-v5-${URL_CACHE}`;

const EXPECTED_CONTRACTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1"
});

const ACTIVE_MODULES = Object.freeze([
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

const HELD_MODULES = Object.freeze([
  {
    key: "canvas",
    path: "/assets/h-earth/h-earth.canvas.js",
    status: "held-until-canvas-tnt-authorized"
  },
  {
    key: "controls",
    path: "/assets/h-earth/h-earth.controls.js",
    status: "held-until-canvas-exists"
  }
]);

const state = {
  contract: CONTRACT,
  alignmentContract: ALIGNMENT_CONTRACT,
  priorContract: PRIOR_CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  planet: PLANET,
  generation: GENERATION,
  cacheKey: CACHE_KEY,
  parentChainStatus: "pending",
  loadedCount: 0,
  failedCount: 0,
  staleContractCount: 0,
  activeModules: {},
  instances: {},
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

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.alignmentContract = ALIGNMENT_CONTRACT;
  root.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.parentCoreChainStatus = state.parentChainStatus;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.surface = "active-read-only";
  root.dataset.canvas = "held";
  root.dataset.controls = "held";
  root.dataset.graphicBox = "forbidden";
  root.dataset.imageGeneration = "forbidden";
  root.dataset.visualPassClaim = "false";
  root.dataset.australiaTerminology = "forbidden";
  root.dataset.mutationEarth = "forbidden";
}

function publishStatus(message, lines = []) {
  const target = statusTarget();
  if (!target) return;

  target.dataset.currentStatus = message;
  target.dataset.routeDoorway = "active";
  target.dataset.routeDoorwayContract = CONTRACT;
  target.dataset.alignmentContract = ALIGNMENT_CONTRACT;
  target.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  target.dataset.parentCoreChain = state.parentChainStatus;
  target.dataset.surface = "active-read-only";
  target.dataset.canvas = "held";
  target.dataset.controls = "held";
  target.dataset.cacheKey = CACHE_KEY;

  target.replaceChildren(
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`ALIGNMENT_RECEIPT: ${ALIGNMENT_CONTRACT}`),
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

  const activeLines = ACTIVE_MODULES.map((entry) => {
    const record = state.activeModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED_CONTRACTS[entry.key];
    const actual = record?.actualContract || "pending";
    const stale = expected && actual !== "pending" && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const heldLines = HELD_MODULES.map((entry) => {
    return `${entry.key.toUpperCase()}: ${entry.status} · ${entry.path}`;
  });

  const landmap = state.instances.landmap;
  const terrain = state.instances.terrain;
  const surface = state.instances.surface;

  const landSummary = landmap?.summary;
  const terrainSummary = terrain?.summary;
  const surfaceSummary = surface?.summary;
  const surfaceReceipt = surface?.receipts?.surface;

  const proofLines = landSummary && terrainSummary && surfaceSummary
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
        `MATERIAL_COVERAGE_COMPLETE: ${String(surfaceSummary.materialCoverageComplete)}`,
        `EVERY_CELL_ASSIGNED_SURFACE: ${String(surfaceSummary.everyCellAssignedSurface)}`,
        `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady)}`,
        `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
        `CANVAS_PAINT_AUTHORIZED: ${String(surfaceSummary.canvasPaintAuthorized)}`,
        `CONTROLS_AUTHORIZED: ${String(surfaceSummary.controlsAuthorized)}`,
        `SURFACE_RECEIPT: ${surfaceReceipt?.contract || "missing"}`,
        `SURFACE_MATERIAL_COMPLETION: ${surfaceReceipt?.materialCompletionContract || "missing"}`
      ]
    : ["SURFACE_SUMMARY: pending"];

  panel.dataset.receiptDoorway = CONTRACT;
  panel.dataset.alignmentReceipt = ALIGNMENT_CONTRACT;
  panel.dataset.parentChainStatus = state.parentChainStatus;
  panel.dataset.loadedModules = String(state.loadedCount);
  panel.dataset.failedModules = String(state.failedCount);
  panel.dataset.staleContractCount = String(state.staleContractCount);
  panel.dataset.surface = "active-read-only";
  panel.dataset.canvas = "held";
  panel.dataset.controls = "held";

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`ALIGNMENT_RECEIPT: ${ALIGNMENT_CONTRACT}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`LOADED_ACTIVE_MODULES: ${state.loadedCount}`),
    codeLine(`FAILED_ACTIVE_MODULES: ${state.failedCount}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`SURFACE: ACTIVE_READ_ONLY`),
    codeLine(`CANVAS: HELD`),
    codeLine(`CONTROLS: HELD`),
    codeLine(`GRAPHIC_BOX: FORBIDDEN`),
    codeLine(`IMAGE_GENERATION: FORBIDDEN`),
    codeLine(`VISUAL_PASS_CLAIM: FALSE`),
    codeLine(`data-mutation-earth="forbidden"`),
    ...activeLines.map(codeLine),
    ...heldLines.map(codeLine),
    ...proofLines.map(codeLine)
  );
}

function renderMountMessage(title, bodyLines = []) {
  const mount = mountTarget();
  if (!mount) return;

  mount.dataset.routeMount = "surface-active-read-status";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.alignmentContract = ALIGNMENT_CONTRACT;
  mount.dataset.cacheKey = CACHE_KEY;
  mount.dataset.surfaceAuthority = "active-read-only";
  mount.dataset.canvasAuthority = "held";
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
      alignmentContract: ALIGNMENT_CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      route: ROUTE,
      surfaceActiveReadOnly: true
    });

    state.instances.kernel = kernel;
    state.activeModules.kernel.actualContract = getImportedContract(kernelModule, kernel);

    const lattice256 = latticeModule.createHEarthLattice256({ kernel });
    state.instances.lattice256 = lattice256;
    state.activeModules.lattice256.actualContract = getImportedContract(latticeModule, lattice256);

    const landmap = landmapModule.createHEarthLandmap({ kernel, lattice256 });
    state.instances.landmap = landmap;
    state.activeModules.landmap.actualContract = getImportedContract(landmapModule, landmap);

    const terrain = terrainModule.createHEarthTerrain({ kernel, lattice256, landmap });
    state.instances.terrain = terrain;
    state.activeModules.terrain.actualContract = getImportedContract(terrainModule, terrain);

    const surface = surfaceModule.createHEarthSurface({ kernel, lattice256, landmap, terrain });
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

  state.parentChainStatus =
    state.staleContractCount > 0
      ? "surface-chain-loaded-but-stale-contracts-detected"
      : expectedBalance && fullTerrainDisposition && surfaceReady && canvasMayReadSurface
        ? "surface-parent-material-truth-active-read-loaded"
        : "surface-chain-loaded-but-readiness-held";

  document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;
  document.documentElement.dataset.surfaceActiveReadOnly = "true";
  document.documentElement.dataset.canvas = "held";
  document.documentElement.dataset.controls = "held";
  document.documentElement.dataset.mutationEarth = "forbidden";

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
    `MATERIAL_COVERAGE_COMPLETE: ${String(surfaceSummary.materialCoverageComplete)}`,
    `EVERY_CELL_ASSIGNED_SURFACE: ${String(surfaceSummary.everyCellAssignedSurface)}`,
    `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady)}`,
    `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
    `CANVAS_PAINT_AUTHORIZED: false`,
    `CONTROLS_AUTHORIZED: false`
  ]);

  publishReceiptPanel();

  renderMountMessage(
    state.parentChainStatus === "surface-parent-material-truth-active-read-loaded"
      ? "Surface parent loaded"
      : "Surface parent held",
    [
      `Land ratio: ${landSummary.landRatio}`,
      `Ocean ratio: ${landSummary.oceanRatio}`,
      `Terrain aspects: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
      `Surface cells: ${surfaceSummary.totalCells}`,
      `Materials: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
      `Canvas may read: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
      `Preview: ${materialPreview(surface)}`
    ]
  );
}

async function boot() {
  stampDocument();

  state.parentChainStatus = "surface-active-read-chain-checking";
  document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;

  publishStatus("surface active-read route doorway active; loading parent chain", [
    `ACTIVE_CHAIN: kernel → lattice256 → landmap → terrain → surface`,
    `HELD_CHAIN: canvas → controls`,
    `CACHE_KEY: ${CACHE_KEY}`
  ]);
  publishReceiptPanel();
  renderMountMessage("Loading surface parent", [
    "kernel → lattice256 → landmap → terrain → surface",
    "canvas/controls held"
  ]);

  const modulesLoaded = await loadActiveModules();
  if (!modulesLoaded) return;

  const instancesCreated = createInstances();
  if (!instancesCreated) return;

  publishSurfaceSuccess();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  ALIGNMENT_CONTRACT,
  PRIOR_CONTRACT,
  SEED_PACKET,
  ROUTE,
  ACTIVE_MODULES,
  HELD_MODULES,
  CACHE_KEY,
  EXPECTED_CONTRACTS
};
