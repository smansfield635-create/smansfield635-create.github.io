// /showroom/globe/h-earth/index.js
// H_EARTH_G1_CONTROLS_ACTIVE_ROUTE_DOORWAY_TNT_v7
// Retained Gauges source markers:
// H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4
// H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_ROUTE_DOORWAY_TNT_v6
// Full-file replacement.
// Route doorway authority only.

const CONTRACT = "H_EARTH_G1_CONTROLS_ACTIVE_ROUTE_DOORWAY_TNT_v7";
const PRIOR_CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_ROUTE_DOORWAY_TNT_v6";
const SURFACE_MARKER = "H_EARTH_G1_SURFACE_ACTIVE_READ_ROUTE_DOORWAY_TNT_v4";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const ROUTE = "/showroom/globe/h-earth/";

const URL_CACHE = new URLSearchParams(window.location.search).get("v") || "controls-active-v1";
const CACHE_KEY = `2026-05-11-h-earth-controls-active-v1-${URL_CACHE}`;

const EXPECTED_CONTRACTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  canvas: "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1",
  controls: "H_EARTH_G1_CONTROLS_MOTION_INPUT_TNT_v1"
});

const ACTIVE_MODULES = Object.freeze([
  { key: "kernel", path: "/assets/h-earth/h-earth.kernel.js", requiredExport: "createHEarthKernel" },
  { key: "lattice256", path: "/assets/h-earth/h-earth.lattice256.js", requiredExport: "createHEarthLattice256" },
  { key: "landmap", path: "/assets/h-earth/h-earth.landmap.js", requiredExport: "createHEarthLandmap" },
  { key: "terrain", path: "/assets/h-earth/h-earth.terrain.js", requiredExport: "createHEarthTerrain" },
  { key: "surface", path: "/assets/h-earth/h-earth.surface.js", requiredExport: "createHEarthSurface" },
  { key: "canvas", path: "/assets/h-earth/h-earth.canvas.js", requiredExport: "createHEarthCanvas" },
  { key: "controls", path: "/assets/h-earth/h-earth.controls.js", requiredExport: "createHEarthControls" }
]);

const HELD_MODULES = Object.freeze([
  { key: "ground", path: "/assets/h-earth/h-earth/ground/", status: "held-until-orbital-aerial-inspection-is-coherent" },
  { key: "estate", path: "/assets/h-earth/h-earth/estate/", status: "held-until-ground-level-mode-is-authorized" }
]);

const state = {
  parentChainStatus: "pending",
  loadedCount: 0,
  failedCount: 0,
  staleContractCount: 0,
  activeModules: {},
  instances: {},
  canvasResult: null,
  controlsResult: null,
  errors: []
};

function byId(id) {
  return document.getElementById(id);
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
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
  root.dataset.surfaceMarker = SURFACE_MARKER;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.parentCoreChainStatus = state.parentChainStatus;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.surface = "active-read-only";
  root.dataset.canvas = "active-visible-composition";
  root.dataset.controls = "active-motion-input";
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
  target.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  target.dataset.parentCoreChain = state.parentChainStatus;
  target.dataset.surface = "active-read-only";
  target.dataset.canvas = "active-visible-composition";
  target.dataset.controls = "active-motion-input";
  target.dataset.cacheKey = CACHE_KEY;

  target.replaceChildren(
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_DOORWAY: ${PRIOR_CONTRACT}`),
    codeLine(`SURFACE_MARKER_RETAINED: ${SURFACE_MARKER}`),
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
  const canvasAuthority = state.instances.canvas;
  const controlsAuthority = state.instances.controls;

  const canvasReceipt = canvasAuthority?.getCanvasReceipt?.() || state.canvasResult?.receipt || null;
  const controlsReceipt = controlsAuthority?.getControlsReceipt?.() || state.controlsResult?.receipt || null;
  const pixelProof = state.canvasResult?.pixelProof || canvasReceipt?.pixelProof || null;

  const landSummary = landmap?.summary;
  const terrainSummary = terrain?.summary;
  const surfaceSummary = surface?.summary;

  const proofLines = landSummary && terrainSummary && surfaceSummary
    ? [
        `LAND_RATIO: ${landSummary.landRatio}`,
        `OCEAN_RATIO: ${landSummary.oceanRatio}`,
        `TERRAIN_TOTAL_CELLS: ${terrainSummary.totalCells}`,
        `TERRAIN_ASPECTS: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
        `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
        `SURFACE_TOTAL_CELLS: ${surfaceSummary.totalCells}`,
        `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
        `MATERIAL_COVERAGE_COMPLETE: ${String(surfaceSummary.materialCoverageComplete)}`,
        `CANVAS_RENDERED: ${String(Boolean(state.canvasResult?.rendered))}`,
        `CANVAS_RECEIPT: ${canvasReceipt?.contract || "missing"}`,
        `PIXEL_PROOF_AVAILABLE: ${String(Boolean(pixelProof?.available))}`,
        `NON_BLANK_RATIO: ${pixelProof?.nonBlankRatio ?? "pending"}`,
        `WATER_LIKE_RATIO: ${pixelProof?.waterLikeRatio ?? "pending"}`,
        `LAND_LIKE_RATIO: ${pixelProof?.landLikeRatio ?? "pending"}`,
        `POLAR_LIKE_RATIO: ${pixelProof?.polarLikeRatio ?? "pending"}`,
        `CONTROLS_BOUND: ${String(Boolean(state.controlsResult?.bound))}`,
        `CONTROLS_RECEIPT: ${controlsReceipt?.contract || "missing"}`,
        `ROTATION_RADIANS: ${controlsReceipt?.rotationRadians ?? "pending"}`,
        `TILT_RADIANS: ${controlsReceipt?.tiltRadians ?? "pending"}`,
        `ZOOM: ${controlsReceipt?.zoom ?? "pending"}`,
        `VISUAL_PASS_CLAIMED: false`,
        `GROUND_AUTHORIZED: false`,
        `ESTATE_AUTHORIZED: false`
      ]
    : ["CONTROLS_SUMMARY: pending"];

  panel.dataset.receiptDoorway = CONTRACT;
  panel.dataset.previousReceiptDoorway = PRIOR_CONTRACT;
  panel.dataset.parentChainStatus = state.parentChainStatus;
  panel.dataset.loadedModules = String(state.loadedCount);
  panel.dataset.failedModules = String(state.failedCount);
  panel.dataset.staleContractCount = String(state.staleContractCount);
  panel.dataset.surface = "active-read-only";
  panel.dataset.canvas = "active-visible-composition";
  panel.dataset.controls = "active-motion-input";
  panel.dataset.visualPassClaim = "false";

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_DOORWAY: ${PRIOR_CONTRACT}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`LOADED_ACTIVE_MODULES: ${state.loadedCount}`),
    codeLine(`FAILED_ACTIVE_MODULES: ${state.failedCount}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`SURFACE: ACTIVE_READ_ONLY`),
    codeLine(`CANVAS: ACTIVE_VISIBLE_COMPOSITION`),
    codeLine(`CONTROLS: ACTIVE_MOTION_INPUT`),
    codeLine(`GRAPHIC_BOX: FORBIDDEN`),
    codeLine(`IMAGE_GENERATION: FORBIDDEN`),
    codeLine(`VISUAL_PASS_CLAIM: FALSE`),
    codeLine(`data-mutation-earth="forbidden"`),
    ...activeLines.map(codeLine),
    ...heldLines.map(codeLine),
    ...proofLines.map(codeLine)
  );
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
      publishStatus(`${entry.key} import failed`, [
        `FAILED_MODULE: ${entry.path}`,
        `ERROR: ${state.activeModules[entry.key]?.error || "unknown"}`
      ]);
      publishReceiptPanel();
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
  const canvasModule = state.activeModules.canvas?.module;
  const controlsModule = state.activeModules.controls?.module;

  try {
    const kernel = kernelModule.createHEarthKernel({
      doorwayContract: CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      route: ROUTE,
      controlsActive: true
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

    const canvas = canvasModule.createHEarthCanvas({
      kernel,
      lattice256,
      landmap,
      terrain,
      surface,
      document,
      window
    });

    state.instances.canvas = canvas;
    state.activeModules.canvas.actualContract = getImportedContract(canvasModule, canvas);

    const controls = controlsModule.createHEarthControls({
      kernel,
      lattice256,
      landmap,
      terrain,
      surface,
      canvasAuthority: canvas,
      document,
      window
    });

    state.instances.controls = controls;
    state.activeModules.controls.actualContract = getImportedContract(controlsModule, controls);

    state.staleContractCount = ACTIVE_MODULES.filter((entry) => {
      return state.activeModules[entry.key]?.actualContract !== EXPECTED_CONTRACTS[entry.key];
    }).length;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`instance-create: ${message}`);
    state.parentChainStatus = "module-loaded-instance-create-failed";
    publishStatus("modules loaded but instance creation failed", [`ERROR: ${message}`]);
    publishReceiptPanel();
    return false;
  }
}

function mountCanvasAndControls() {
  const mount = mountTarget();
  const canvasAuthority = state.instances.canvas;
  const controlsAuthority = state.instances.controls;

  if (!mount || !canvasAuthority || typeof canvasAuthority.renderInto !== "function") {
    state.parentChainStatus = "canvas-mount-or-render-authority-missing";
    publishStatus("canvas mount or render authority missing", [
      `MOUNT_PRESENT: ${String(Boolean(mount))}`,
      `RENDER_INTO_PRESENT: ${String(Boolean(canvasAuthority?.renderInto))}`
    ]);
    publishReceiptPanel();
    return false;
  }

  try {
    mount.dataset.routeMount = "canvas-visible-composition";
    mount.dataset.surfaceAuthority = "read-only-parent";
    mount.dataset.canvasAuthority = "active-visible-composition";
    mount.dataset.controlsAuthority = "binding";
    mount.dataset.visualPassClaimed = "false";
    mount.replaceChildren();

    const width = mount.clientWidth || mount.getBoundingClientRect?.().width || 620;

    state.canvasResult = canvasAuthority.renderInto(mount, {
      size: width,
      rotationRadians: -0.3141592654,
      tiltRadians: -0.1396263402,
      document,
      window
    });

    if (state.canvasResult?.rendered !== true) {
      state.parentChainStatus = "canvas-render-held";
      publishStatus("canvas render held", [
        `CANVAS_RENDERED: false`
      ]);
      publishReceiptPanel();
      return false;
    }

    if (!controlsAuthority || typeof controlsAuthority.bindTo !== "function") {
      state.parentChainStatus = "controls-authority-missing-bindTo";
      publishStatus("controls authority missing bindTo", [
        `CONTROLS_BOUND: false`
      ]);
      publishReceiptPanel();
      return false;
    }

    state.controlsResult = controlsAuthority.bindTo(mount, {
      document,
      window
    });

    mount.dataset.routeMount = "canvas-with-controls";
    mount.dataset.hEarthCanvasStatus = "rendered";
    mount.dataset.hEarthControlsStatus = state.controlsResult?.bound ? "bound" : "held";
    mount.dataset.controlsAuthority = state.controlsResult?.bound ? "active-motion-input" : "held";

    return state.controlsResult?.bound === true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`controls-bind: ${message}`);
    state.parentChainStatus = "controls-bind-failed";
    publishStatus("controls bind failed", [`ERROR: ${message}`]);
    publishReceiptPanel();
    return false;
  }
}

function publishControlsSuccess() {
  const landmap = state.instances.landmap;
  const terrain = state.instances.terrain;
  const surface = state.instances.surface;
  const canvasAuthority = state.instances.canvas;
  const controlsAuthority = state.instances.controls;

  const canvasReceipt = canvasAuthority?.getCanvasReceipt?.() || state.canvasResult?.receipt || null;
  const controlsReceipt = controlsAuthority?.getControlsReceipt?.() || state.controlsResult?.receipt || null;
  const pixelProof = state.canvasResult?.pixelProof || canvasReceipt?.pixelProof || null;

  const landSummary = landmap.summary;
  const terrainSummary = terrain.summary;
  const surfaceSummary = surface.summary;

  const parentReady =
    landSummary.landRatio >= 0.3 &&
    landSummary.landRatio <= 0.42 &&
    terrainSummary.fullAspectDisposition === true &&
    surfaceSummary.surfaceParentReady === true &&
    surfaceSummary.downstreamCanvasMayReadSurface === true;

  const canvasRendered =
    state.canvasResult?.rendered === true &&
    canvasReceipt?.contract === EXPECTED_CONTRACTS.canvas &&
    pixelProof?.available === true &&
    Number(pixelProof.nonBlankRatio) > 0.12;

  const controlsBound =
    state.controlsResult?.bound === true &&
    controlsReceipt?.contract === EXPECTED_CONTRACTS.controls;

  state.parentChainStatus =
    state.staleContractCount > 0
      ? "controls-chain-loaded-but-stale-contracts-detected"
      : parentReady && canvasRendered && controlsBound
        ? "controls-motion-input-bound"
        : "controls-chain-loaded-but-proof-held";

  document.documentElement.dataset.parentCoreChainStatus = state.parentChainStatus;
  document.documentElement.dataset.surface = "active-read-only";
  document.documentElement.dataset.canvas = "active-visible-composition";
  document.documentElement.dataset.controls = "active-motion-input";
  document.documentElement.dataset.visualPassClaim = "false";
  document.documentElement.dataset.mutationEarth = "forbidden";

  publishStatus(state.parentChainStatus, [
    `KERNEL: loaded · ${state.activeModules.kernel.actualContract}`,
    `LATTICE256: loaded · ${state.activeModules.lattice256.actualContract}`,
    `LANDMAP: loaded · ${state.activeModules.landmap.actualContract}`,
    `TERRAIN: loaded · ${state.activeModules.terrain.actualContract}`,
    `SURFACE: loaded · ${state.activeModules.surface.actualContract}`,
    `CANVAS: loaded · ${state.activeModules.canvas.actualContract}`,
    `CONTROLS: loaded · ${state.activeModules.controls.actualContract}`,
    `STALE_CONTRACTS: ${state.staleContractCount}`,
    `LAND_RATIO: ${landSummary.landRatio}`,
    `OCEAN_RATIO: ${landSummary.oceanRatio}`,
    `TERRAIN_ASPECTS_POPULATED: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
    `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
    `CANVAS_RENDERED: ${String(Boolean(state.canvasResult?.rendered))}`,
    `PIXEL_PROOF_AVAILABLE: ${String(Boolean(pixelProof?.available))}`,
    `NON_BLANK_RATIO: ${pixelProof?.nonBlankRatio ?? "pending"}`,
    `WATER_LIKE_RATIO: ${pixelProof?.waterLikeRatio ?? "pending"}`,
    `LAND_LIKE_RATIO: ${pixelProof?.landLikeRatio ?? "pending"}`,
    `POLAR_LIKE_RATIO: ${pixelProof?.polarLikeRatio ?? "pending"}`,
    `CONTROLS_BOUND: ${String(Boolean(state.controlsResult?.bound))}`,
    `ROTATION_RADIANS: ${controlsReceipt?.rotationRadians ?? "pending"}`,
    `TILT_RADIANS: ${controlsReceipt?.tiltRadians ?? "pending"}`,
    `ZOOM: ${controlsReceipt?.zoom ?? "pending"}`,
    `VISUAL_PASS_CLAIMED: false`,
    `GROUND_AUTHORIZED: false`,
    `ESTATE_AUTHORIZED: false`
  ]);

  publishReceiptPanel();
}

async function boot() {
  stampDocument();

  state.parentChainStatus = "controls-active-chain-checking";
  publishStatus("controls route doorway active; loading parent chain", [
    `ACTIVE_CHAIN: kernel → lattice256 → landmap → terrain → surface → canvas → controls`,
    `HELD_CHAIN: ground → estate`,
    `CACHE_KEY: ${CACHE_KEY}`
  ]);
  publishReceiptPanel();

  const modulesLoaded = await loadActiveModules();
  if (!modulesLoaded) return;

  const instancesCreated = createInstances();
  if (!instancesCreated) return;

  const bound = mountCanvasAndControls();
  if (!bound) {
    publishReceiptPanel();
    return;
  }

  publishControlsSuccess();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PRIOR_CONTRACT,
  SURFACE_MARKER,
  SEED_PACKET,
  ROUTE,
  ACTIVE_MODULES,
  HELD_MODULES,
  CACHE_KEY,
  EXPECTED_CONTRACTS
};
