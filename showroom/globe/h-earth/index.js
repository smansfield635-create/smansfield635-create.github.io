// /showroom/globe/h-earth/index.js
// H_EARTH_G1_TERRAIN_BALANCE_ROUTE_DOORWAY_TNT_v3
// Full-file replacement.
// Route doorway authority only.
//
// Purpose:
// - Force the H-Earth route to consume the renewed landmap/terrain balance files.
// - Publish the actual imported module contracts.
// - Preserve terrain-only scope.
// - Keep surface, canvas, controls, weather, atmosphere, and life held.

const CONTRACT = "H_EARTH_G1_TERRAIN_BALANCE_ROUTE_DOORWAY_TNT_v3";
const PRIOR_CONTRACT = "H_EARTH_G1_TERRAIN_ONLY_ROUTE_DOORWAY_TNT_v2";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const GENERATION = "G1";

const URL_CACHE = new URLSearchParams(window.location.search).get("v") || "terrain-balance-full-aspect-v2";
const CACHE_KEY = `2026-05-11-h-earth-terrain-balance-full-aspect-v2-${URL_CACHE}`;

const EXPECTED_CONTRACTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2"
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
  }
]);

const HELD_MODULES = Object.freeze([
  {
    key: "surface",
    label: "Surface parent material truth",
    path: "/assets/h-earth/h-earth.surface.js",
    status: "held-outside-terrain-only-scope"
  },
  {
    key: "canvas",
    label: "Canvas visible composition",
    path: "/assets/h-earth/h-earth.canvas.js",
    status: "held-outside-terrain-only-scope"
  },
  {
    key: "controls",
    label: "Controls motion/input only",
    path: "/assets/h-earth/h-earth.controls.js",
    status: "held-outside-terrain-only-scope"
  }
]);

const state = {
  contract: CONTRACT,
  priorContract: PRIOR_CONTRACT,
  seedPacket: SEED_PACKET,
  terrainOnlyChain: TERRAIN_ONLY_CHAIN,
  route: ROUTE,
  planet: PLANET,
  generation: GENERATION,
  cacheKey: CACHE_KEY,
  routeDoorway: "booting",
  terrainChainStatus: "pending",
  loadedCount: 0,
  failedCount: 0,
  staleContractCount: 0,
  activeModules: {},
  heldModules: {},
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
  root.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.terrainOnlyChain = TERRAIN_ONLY_CHAIN;
  root.dataset.parentCoreChainStatus = state.terrainChainStatus;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.surface = "held";
  root.dataset.canvas = "held";
  root.dataset.controls = "held";
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
  target.dataset.terrainOnlyChain = TERRAIN_ONLY_CHAIN;
  target.dataset.parentCoreChain = state.terrainChainStatus;
  target.dataset.cacheKey = CACHE_KEY;

  target.replaceChildren(
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_DOORWAY: ${PRIOR_CONTRACT}`),
    codeLine(`SEED_PACKET: ${SEED_PACKET}`),
    codeLine(`TERRAIN_ONLY_CHAIN: ${TERRAIN_ONLY_CHAIN}`),
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
  panel.dataset.terrainOnlyChain = TERRAIN_ONLY_CHAIN;
  panel.dataset.terrainChainStatus = state.terrainChainStatus;
  panel.dataset.loadedModules = String(state.loadedCount);
  panel.dataset.failedModules = String(state.failedCount);
  panel.dataset.staleContractCount = String(state.staleContractCount);
  panel.dataset.cacheKey = CACHE_KEY;
  panel.dataset.surface = "held";
  panel.dataset.canvas = "held";
  panel.dataset.controls = "held";

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

  const terrain = state.instances.terrain;
  const landmap = state.instances.landmap;
  const terrainSummary = terrain?.summary;
  const landSummary = landmap?.summary;

  const proofLines = terrainSummary && landSummary
    ? [
        `LAND_RATIO: ${landSummary.landRatio}`,
        `OCEAN_RATIO: ${landSummary.oceanRatio}`,
        `TERRAIN_TOTAL_CELLS: ${terrainSummary.totalCells}`,
        `LAND_TERRAIN_CELLS: ${terrainSummary.landTerrainCells}`,
        `OCEAN_FLOOR_TERRAIN_CELLS: ${terrainSummary.oceanFloorTerrainCells}`,
        `TERRAIN_ASPECTS: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
        `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
        `MISSING_TERRAIN_ASPECTS: ${(terrainSummary.missingTerrainAspects || []).join(" | ") || "none"}`,
        `EVERY_CELL_ASSIGNED_TERRAIN: ${String(terrainSummary.everyCellAssignedTerrain)}`,
        `SURFACE_HELD: ${String(terrainSummary.surfaceHeld)}`,
        `CANVAS_HELD: ${String(terrainSummary.canvasHeld)}`,
        `CONTROLS_HELD: ${String(terrainSummary.controlsHeld)}`
      ]
    : ["TERRAIN_SUMMARY: pending"];

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PARENT_CORE_CHAIN_STATUS: ${state.terrainChainStatus}`),
    codeLine(`LOADED_ACTIVE_MODULES: ${state.loadedCount}`),
    codeLine(`FAILED_ACTIVE_MODULES: ${state.failedCount}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`GRAPHIC_BOX: FORBIDDEN`),
    codeLine(`IMAGE_GENERATION: FORBIDDEN`),
    codeLine(`VISUAL_PASS_CLAIM: FALSE`),
    ...activeLines.map(codeLine),
    ...heldLines.map(codeLine),
    ...proofLines.map(codeLine)
  );
}

function renderMountMessage(title, bodyLines = []) {
  const mount = mountTarget();
  if (!mount) return;

  mount.dataset.routeMount = "terrain-only-status";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.terrainOnlyChain = TERRAIN_ONLY_CHAIN;
  mount.dataset.cacheKey = CACHE_KEY;
  mount.dataset.canvasAuthority = "held-outside-terrain-only-scope";
  mount.dataset.planetTruthOwner = "terrain-parent-chain";

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 430px)";
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
      state.terrainChainStatus = `${entry.key}-failed`;
      document.documentElement.dataset.parentCoreChainStatus = state.terrainChainStatus;
      publishStatus(`${entry.key} import failed`, [
        `FAILED_MODULE: ${entry.path}`,
        `IMPORT_URL: ${moduleUrl(entry.path)}`,
        `ERROR: ${state.activeModules[entry.key]?.error || "unknown"}`
      ]);
      publishReceiptPanel();
      renderMountMessage("Terrain chain held", [
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

  try {
    const kernel = kernelModule.createHEarthKernel({
      doorwayContract: CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      route: ROUTE,
      terrainOnly: true
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

    state.staleContractCount = ACTIVE_MODULES.filter((entry) => {
      return state.activeModules[entry.key]?.actualContract !== EXPECTED_CONTRACTS[entry.key];
    }).length;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`instance-create: ${message}`);
    state.terrainChainStatus = "module-loaded-instance-create-failed";
    document.documentElement.dataset.parentCoreChainStatus = state.terrainChainStatus;

    publishStatus("terrain modules loaded but instance creation failed", [
      `ERROR: ${message}`,
      `CHECK: exported factory function signatures`
    ]);
    publishReceiptPanel();
    renderMountMessage("Terrain instance failed", [
      "Modules loaded",
      "Factory chain did not complete"
    ]);

    return false;
  }
}

function terrainAspectPreview(terrain) {
  const seats = terrain?.dispositionaryLocations?.allAspects || {};
  const names = Object.entries(seats)
    .filter(([, entries]) => Array.isArray(entries) && entries.length > 0)
    .map(([name]) => name)
    .slice(0, 10);

  return names.length ? names.join(" · ") : "pending";
}

function publishTerrainSuccess() {
  const terrain = state.instances.terrain;
  const landmap = state.instances.landmap;
  const terrainSummary = terrain.summary;
  const landSummary = landmap.summary;

  const expectedBalance =
    landSummary.landRatio >= 0.3 &&
    landSummary.landRatio <= 0.42 &&
    landSummary.oceanRatio >= 0.58 &&
    landSummary.oceanRatio <= 0.7;

  const fullDisposition = terrainSummary.fullAspectDisposition === true;

  state.terrainChainStatus =
    state.staleContractCount > 0
      ? "terrain-chain-loaded-but-stale-contracts-detected"
      : expectedBalance && fullDisposition
        ? "terrain-balance-full-aspect-disposition-loaded"
        : "terrain-chain-loaded-but-balance-or-aspects-held";

  document.documentElement.dataset.parentCoreChainStatus = state.terrainChainStatus;
  document.documentElement.dataset.terrainOnlyLoaded = "true";
  document.documentElement.dataset.surface = "held";
  document.documentElement.dataset.canvas = "held";
  document.documentElement.dataset.controls = "held";

  publishStatus(state.terrainChainStatus, [
    `KERNEL: loaded · ${state.activeModules.kernel.actualContract}`,
    `LATTICE256: loaded · ${state.activeModules.lattice256.actualContract}`,
    `LANDMAP: loaded · ${state.activeModules.landmap.actualContract}`,
    `TERRAIN: loaded · ${state.activeModules.terrain.actualContract}`,
    `STALE_CONTRACTS: ${state.staleContractCount}`,
    `LAND_RATIO: ${landSummary.landRatio}`,
    `OCEAN_RATIO: ${landSummary.oceanRatio}`,
    `TERRAIN_CELLS: ${terrainSummary.totalCells}`,
    `TERRAIN_ASPECTS_POPULATED: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
    `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
    `MISSING_TERRAIN_ASPECTS: ${(terrainSummary.missingTerrainAspects || []).join(" | ") || "none"}`,
    `SURFACE: held-outside-terrain-only-scope`,
    `CANVAS: held-outside-terrain-only-scope`,
    `CONTROLS: held-outside-terrain-only-scope`
  ]);

  publishReceiptPanel();

  renderMountMessage(
    state.staleContractCount > 0 ? "Stale contracts detected" : "Terrain balance loaded",
    [
      `Land ratio: ${landSummary.landRatio}`,
      `Ocean ratio: ${landSummary.oceanRatio}`,
      `Cells: ${terrainSummary.totalCells}`,
      `Aspects: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
      `Missing: ${(terrainSummary.missingTerrainAspects || []).join(", ") || "none"}`,
      `Preview: ${terrainAspectPreview(terrain)}`
    ]
  );
}

async function boot() {
  stampDocument();
  setHeldModules();

  state.routeDoorway = "active";
  state.terrainChainStatus = "terrain-balance-chain-checking";
  document.documentElement.dataset.parentCoreChainStatus = state.terrainChainStatus;

  publishStatus("terrain-balance route doorway active; loading renewed parent chain", [
    `ACTIVE_CHAIN: kernel → lattice256 → landmap → terrain`,
    `HELD_CHAIN: surface → canvas → controls`,
    `CACHE_KEY: ${CACHE_KEY}`
  ]);
  publishReceiptPanel();
  renderMountMessage("Loading terrain balance chain", [
    "kernel → lattice256 → landmap → terrain",
    "surface/canvas/controls held"
  ]);

  const modulesLoaded = await loadActiveModules();
  if (!modulesLoaded) return;

  const instancesCreated = createInstances();
  if (!instancesCreated) return;

  publishTerrainSuccess();
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
  ROUTE,
  ACTIVE_MODULES,
  HELD_MODULES,
  CACHE_KEY,
  EXPECTED_CONTRACTS
};
