// /showroom/globe/h-earth/index.js
// H_EARTH_G1_CONTROLS_RECEIPT_ALIGNMENT_ROUTE_TNT_v9
// Full-file replacement.
// Route doorway authority only.
//
// Purpose:
// - Preserve controls motion/input authority.
// - Expect aligned canvas receipt.
// - Refresh canvas controls status after controls activate.
// - Publish consistent canvas/controls receipts.
// - Keep parent truth immutable.

const CONTRACT = "H_EARTH_G1_CONTROLS_RECEIPT_ALIGNMENT_ROUTE_TNT_v9";
const PRIOR_CONTRACT = "H_EARTH_G1_CONTROLS_MOTION_INPUT_ROUTE_TNT_v8";
const PRIOR_HTML_CONTRACT = "H_EARTH_G1_CONTROLS_MOTION_INPUT_HTML_TNT_v8";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const ROUTE = "/showroom/globe/h-earth/";

const URL_CACHE =
  new URLSearchParams(window.location.search).get("v") ||
  "controls-receipt-alignment-route-v9";

const CACHE_KEY = `2026-05-11-h-earth-controls-receipt-alignment-route-v9-${URL_CACHE}`;

const EXPECTED_CONTRACTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  canvas: "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3",
  controls: "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1"
});

const ACTIVE_MODULES = Object.freeze([
  { key: "kernel", path: "/assets/h-earth/h-earth.kernel.js", requiredExport: "createHEarthKernel" },
  { key: "lattice256", path: "/assets/h-earth/h-earth.lattice256.js", requiredExport: "createHEarthLattice256" },
  { key: "landmap", path: "/assets/h-earth/h-earth.landmap.js", requiredExport: "createHEarthLandmap" },
  { key: "terrain", path: "/assets/h-earth/h-earth.terrain.js", requiredExport: "createHEarthTerrain" },
  { key: "surface", path: "/assets/h-earth/h-earth.surface.js", requiredExport: "createHEarthSurface" }
]);

const CANVAS_MODULE = Object.freeze({
  key: "canvas",
  path: "/assets/h-earth/h-earth.canvas.js",
  requiredExport: "bootHEarthCanvas",
  refreshExport: "refreshHEarthCanvasControlsStatus"
});

const CONTROLS_MODULE = Object.freeze({
  key: "controls",
  path: "/assets/h-earth/h-earth.controls.js",
  requiredExport: "bootHEarthControls"
});

const state = {
  contract: CONTRACT,
  priorContract: PRIOR_CONTRACT,
  priorHtmlContract: PRIOR_HTML_CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  cacheKey: CACHE_KEY,
  parentChainStatus: "top-level-executed",
  canvasStatus: "held",
  controlsStatus: "held",
  canvasPaintAuthorized: false,
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  canvasControlsReceiptAligned: false,
  loadedCount: 0,
  failedCount: 0,
  staleContractCount: 0,
  activeModules: {},
  instances: {},
  canvasModule: {
    status: "held-before-surface-readiness",
    path: CANVAS_MODULE.path,
    actualContract: "pending"
  },
  controlsModule: {
    status: "held-before-canvas-proof",
    path: CONTROLS_MODULE.path,
    actualContract: "pending"
  },
  canvasRuntimeStatus: null,
  controlsRuntimeStatus: null,
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

function getImportedControlsContract(imported, status) {
  return (
    imported?.H_EARTH_CONTROLS_CONTRACT ||
    imported?.default?.contract ||
    status?.contract ||
    status?.receipt ||
    "contract-not-exported"
  );
}

function statusTarget() {
  return byId("hEarthStatusTarget");
}

function receiptPanel() {
  return byId("hEarthReceiptPanel");
}

function mountTarget() {
  return byId("hEarthCanvasMount");
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayTopLevelExecuted = "true";
  root.dataset.routeDoorwayReceipt = CONTRACT;
  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  root.dataset.previousHtmlContract = PRIOR_HTML_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.parentCoreChainStatus = state.parentChainStatus;
  root.dataset.cacheKey = CACHE_KEY;
  root.dataset.surface = "active-read-only";
  root.dataset.canvas = state.canvasStatus;
  root.dataset.controls = state.controlsStatus;
  root.dataset.canvasPaintAuthorized = String(state.canvasPaintAuthorized);
  root.dataset.controlsAuthorized = String(state.controlsAuthorized);
  root.dataset.motionAuthorized = String(state.motionAuthorized);
  root.dataset.inputAuthorized = String(state.inputAuthorized);
  root.dataset.canvasControlsReceiptAligned = String(state.canvasControlsReceiptAligned);
  root.dataset.parentMutationAuthorized = "false";
  root.dataset.graphicBox = "forbidden";
  root.dataset.imageGeneration = "forbidden";
  root.dataset.visualPassClaim = "false";
  root.dataset.australiaTerminology = "forbidden";
}

function publishStatus(message, lines = []) {
  const target = statusTarget();
  if (!target) return;

  target.dataset.currentStatus = message;
  target.dataset.routeDoorwayTopLevelExecuted = "true";
  target.dataset.routeDoorway = "active";
  target.dataset.routeDoorwayContract = CONTRACT;
  target.dataset.previousRouteDoorwayContract = PRIOR_CONTRACT;
  target.dataset.parentCoreChain = state.parentChainStatus;
  target.dataset.surface = "active-read-only";
  target.dataset.canvas = state.canvasStatus;
  target.dataset.controls = state.controlsStatus;
  target.dataset.canvasPaintAuthorized = String(state.canvasPaintAuthorized);
  target.dataset.controlsAuthorized = String(state.controlsAuthorized);
  target.dataset.motionAuthorized = String(state.motionAuthorized);
  target.dataset.inputAuthorized = String(state.inputAuthorized);
  target.dataset.canvasControlsReceiptAligned = String(state.canvasControlsReceiptAligned);
  target.dataset.cacheKey = CACHE_KEY;

  target.replaceChildren(
    codeLine(`ROUTE_DOORWAY_TOPLEVEL_EXECUTED: true`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_DOORWAY: ${PRIOR_CONTRACT}`),
    codeLine(`PREVIOUS_HTML: ${PRIOR_HTML_CONTRACT}`),
    codeLine(`SEED_PACKET: ${SEED_PACKET}`),
    codeLine(`CACHE_KEY: ${CACHE_KEY}`),
    codeLine(`STATUS: ${message}`),
    ...lines.map(codeLine)
  );
}

function publishReceiptPanel() {
  const panel = receiptPanel();
  if (!panel) return;

  const terrain = state.instances.terrain;
  const landmap = state.instances.landmap;
  const surface = state.instances.surface;
  const terrainSummary = terrain?.summary;
  const landSummary = landmap?.summary;
  const surfaceSummary = surface?.summary;
  const canvas = state.canvasRuntimeStatus;
  const controls = state.controlsRuntimeStatus;

  const activeLines = ACTIVE_MODULES.map((entry) => {
    const record = state.activeModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED_CONTRACTS[entry.key];
    const actual = record?.actualContract || "pending";
    const stale = actual !== "pending" && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const proofLines = terrainSummary && landSummary && surfaceSummary
    ? [
        `LAND_RATIO: ${landSummary.landRatio}`,
        `OCEAN_RATIO: ${landSummary.oceanRatio}`,
        `TERRAIN_TOTAL_CELLS: ${terrainSummary.totalCells}`,
        `TERRAIN_ASPECTS: ${terrainSummary.populatedTerrainAspectCount}/${terrainSummary.terrainAspectCount}`,
        `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition)}`,
        `SURFACE_TOTAL_CELLS: ${surfaceSummary.totalCells}`,
        `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount}/${surfaceSummary.requiredMaterialClassCount}`,
        `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady)}`,
        `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface)}`,
        `CANVAS_RECEIPT: ${state.canvasModule.actualContract}`,
        `CANVAS_RENDER_STATUS: ${canvas?.renderStatus || "pending"}`,
        `CANVAS_CELLS_RESOLVED: ${canvas?.cellsResolved ?? "pending"}`,
        `CANVAS_CELLS_PAINTED: ${canvas?.cellsPainted ?? "pending"}`,
        `CANVAS_NONBLANK_PIXEL_RATIO: ${canvas?.nonBlankPixelRatio ?? "pending"}`,
        `CANVAS_CONTROLS_RECEIPT_ALIGNED: ${String(state.canvasControlsReceiptAligned)}`,
        `CANVAS_PANEL_CONTROLS_STATUS: ${canvas?.controlsStatus || "pending"}`,
        `CONTROLS_RECEIPT: ${state.controlsModule.actualContract}`,
        `CONTROLS_STATUS: ${controls?.status || "pending"}`,
        `CONTROLS_AUTHORIZED: ${String(state.controlsAuthorized)}`,
        `MOTION_AUTHORIZED: ${String(state.motionAuthorized)}`,
        `INPUT_AUTHORIZED: ${String(state.inputAuthorized)}`,
        `PARENT_MUTATION_AUTHORIZED: false`
      ]
    : ["PARENT_CHAIN_SUMMARY: pending"];

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_TOPLEVEL_EXECUTED: true`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`LOADED_ACTIVE_PARENT_MODULES: ${state.loadedCount}`),
    codeLine(`FAILED_ACTIVE_PARENT_MODULES: ${state.failedCount}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`SURFACE: ACTIVE_READ_ONLY`),
    codeLine(`CANVAS: ${state.canvasStatus.toUpperCase()}`),
    codeLine(`CONTROLS: ${state.controlsStatus.toUpperCase()}`),
    codeLine(`CANVAS_CONTROLS_RECEIPT_ALIGNED: ${String(state.canvasControlsReceiptAligned)}`),
    codeLine(`GRAPHIC_BOX: FORBIDDEN`),
    codeLine(`IMAGE_GENERATION: FORBIDDEN`),
    codeLine(`VISUAL_PASS_CLAIM: FALSE`),
    ...activeLines.map(codeLine),
    codeLine(`CANVAS: ${state.canvasModule.status} · expected=${EXPECTED_CONTRACTS.canvas} · actual=${state.canvasModule.actualContract} · ${CANVAS_MODULE.path}`),
    codeLine(`CONTROLS: ${state.controlsModule.status} · expected=${EXPECTED_CONTRACTS.controls} · actual=${state.controlsModule.actualContract} · ${CONTROLS_MODULE.path}`),
    ...proofLines.map(codeLine)
  );
}

function renderMountMessage(title, bodyLines = []) {
  const mount = mountTarget();
  if (!mount) return;

  mount.dataset.routeMount = "controls-receipt-alignment-status";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.routeDoorwayTopLevelExecuted = "true";
  mount.dataset.cacheKey = CACHE_KEY;
  mount.dataset.surfaceAuthority = "active-read-only";
  mount.dataset.canvasAuthority = state.canvasStatus;
  mount.dataset.controlsAuthority = state.controlsStatus;
  mount.dataset.canvasControlsReceiptAligned = String(state.canvasControlsReceiptAligned);
  mount.dataset.planetTruthOwner = "parent-chain";

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 460px)";
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
      actualContract: "import-failed",
      error: message
    };

    state.failedCount += 1;
    state.errors.push(`${entry.key}: ${message}`);
    return null;
  }
}

async function loadParentModules() {
  for (const entry of ACTIVE_MODULES) {
    state.parentChainStatus = `loading-${entry.key}`;
    stampDocument();
    publishStatus(`loading ${entry.key}`, [
      `CURRENT_MODULE: ${entry.path}`,
      `IMPORT_URL: ${moduleUrl(entry.path)}`
    ]);
    publishReceiptPanel();

    const imported = await importModule(entry);

    if (!imported) {
      state.parentChainStatus = `${entry.key}-failed`;
      stampDocument();
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
  try {
    const kernelModule = state.activeModules.kernel.module;
    const latticeModule = state.activeModules.lattice256.module;
    const landmapModule = state.activeModules.landmap.module;
    const terrainModule = state.activeModules.terrain.module;
    const surfaceModule = state.activeModules.surface.module;

    const kernel = kernelModule.createHEarthKernel({
      doorwayContract: CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      route: ROUTE,
      surfaceActiveReadOnly: true,
      controlsReceiptAlignment: true,
      mutationAuthorized: false,
      controlsAuthorized: false,
      motionAuthorized: false,
      inputAuthorized: false
    });

    const lattice256 = latticeModule.createHEarthLattice256({ kernel });
    const landmap = landmapModule.createHEarthLandmap({ kernel, lattice256 });
    const terrain = terrainModule.createHEarthTerrain({ kernel, lattice256, landmap });
    const surface = surfaceModule.createHEarthSurface({ kernel, lattice256, landmap, terrain });

    state.instances = { kernel, lattice256, landmap, terrain, surface };

    state.activeModules.kernel.actualContract = getImportedContract(kernelModule, kernel);
    state.activeModules.lattice256.actualContract = getImportedContract(latticeModule, lattice256);
    state.activeModules.landmap.actualContract = getImportedContract(landmapModule, landmap);
    state.activeModules.terrain.actualContract = getImportedContract(terrainModule, terrain);
    state.activeModules.surface.actualContract = getImportedContract(surfaceModule, surface);

    state.staleContractCount = ACTIVE_MODULES.filter((entry) => {
      return state.activeModules[entry.key].actualContract !== EXPECTED_CONTRACTS[entry.key];
    }).length;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.parentChainStatus = "module-loaded-instance-create-failed";
    state.errors.push(`instance-create: ${message}`);
    stampDocument();
    publishStatus("modules loaded but instance creation failed", [`ERROR: ${message}`]);
    publishReceiptPanel();
    return false;
  }
}

function surfaceAllowsCanvas() {
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

  return (
    expectedBalance &&
    terrainSummary.fullAspectDisposition === true &&
    surfaceSummary.surfaceParentReady === true &&
    surfaceSummary.downstreamCanvasMayReadSurface === true &&
    state.staleContractCount === 0
  );
}

function canvasProofPasses(status) {
  return (
    status?.contract === EXPECTED_CONTRACTS.canvas &&
    status?.parentSurfaceReady === true &&
    status?.downstreamCanvasMayReadSurface === true &&
    status?.cellsResolved === 256 &&
    Number(status?.cellsPainted) > 0 &&
    status?.renderStatus === "visible-composition-painted-from-surface-instance" &&
    Number(status?.nonBlankPixelRatio) > 0
  );
}

async function importCanvasModule() {
  const url = moduleUrl(CANVAS_MODULE.path);

  state.canvasStatus = "loading";
  state.canvasModule = {
    status: "loading",
    path: CANVAS_MODULE.path,
    url,
    actualContract: "pending"
  };

  stampDocument();
  publishStatus("surface parent passed; loading aligned canvas", [
    `CANVAS_MODULE: ${CANVAS_MODULE.path}`,
    `EXPECTED_CANVAS: ${EXPECTED_CONTRACTS.canvas}`,
    `CONTROLS: held`
  ]);
  publishReceiptPanel();

  try {
    window.H_EARTH_ROUTE_PARENT_INSTANCES = state.instances;

    const imported = await import(url);

    if (!imported || typeof imported[CANVAS_MODULE.requiredExport] !== "function") {
      throw new Error(`required export missing: ${CANVAS_MODULE.requiredExport}`);
    }

    const canvasStatus = await imported.bootHEarthCanvas({
      instances: state.instances,
      parentInstances: state.instances,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      readOnly: true,
      mutationAuthorized: false,
      controlsAuthorized: false,
      motionAuthorized: false,
      inputAuthorized: false
    });

    state.canvasRuntimeStatus = canvasStatus || null;

    const actualContract = getImportedCanvasContract(imported, canvasStatus);
    const staleCanvas = actualContract !== EXPECTED_CONTRACTS.canvas;
    const canvasReady = !staleCanvas && canvasProofPasses(canvasStatus);

    state.canvasModule = {
      status: staleCanvas ? "loaded-stale-contract" : "loaded",
      path: CANVAS_MODULE.path,
      url,
      actualContract
    };

    state.canvasStatus = canvasReady ? "active-visible-composition" : "loaded-consumption-held";
    state.canvasPaintAuthorized = canvasReady;

    if (staleCanvas) state.staleContractCount += 1;

    stampDocument();
    publishStatus(canvasReady ? "canvas visible proof passed; controls eligible" : "canvas loaded but controls held", [
      `CANVAS: loaded · ${actualContract}`,
      `EXPECTED_CANVAS: ${EXPECTED_CONTRACTS.canvas}`,
      `CANVAS_STALE_CONTRACT: ${String(staleCanvas)}`,
      `CANVAS_RENDER_STATUS: ${canvasStatus?.renderStatus || "pending"}`,
      `CANVAS_CELLS_RESOLVED: ${canvasStatus?.cellsResolved ?? "pending"}`,
      `CANVAS_CELLS_PAINTED: ${canvasStatus?.cellsPainted ?? "pending"}`,
      `CANVAS_NONBLANK_PIXEL_RATIO: ${canvasStatus?.nonBlankPixelRatio ?? "pending"}`,
      `CONTROLS_AUTHORIZED: false`
    ]);
    publishReceiptPanel();

    return canvasReady;
  } catch (error) {
    const message = safeError(error);
    state.canvasStatus = "failed";
    state.canvasModule = {
      status: "import-or-boot-failed",
      path: CANVAS_MODULE.path,
      url,
      actualContract: "import-or-boot-failed",
      error: message
    };
    state.errors.push(`canvas: ${message}`);
    stampDocument();
    publishStatus("canvas controls receipt alignment failed", [
      `ERROR: ${message}`,
      `CONTROLS: held`
    ]);
    publishReceiptPanel();
    return false;
  }
}

async function importControlsModule() {
  const url = moduleUrl(CONTROLS_MODULE.path);

  state.controlsStatus = "loading";
  state.controlsModule = {
    status: "loading",
    path: CONTROLS_MODULE.path,
    url,
    actualContract: "pending"
  };

  stampDocument();
  publishStatus("canvas proof passed; loading controls motion/input authority", [
    `CONTROLS_MODULE: ${CONTROLS_MODULE.path}`,
    `EXPECTED_CONTROLS: ${EXPECTED_CONTRACTS.controls}`,
    `PARENT_MUTATION_AUTHORIZED: false`
  ]);
  publishReceiptPanel();

  try {
    const imported = await import(url);

    if (!imported || typeof imported[CONTROLS_MODULE.requiredExport] !== "function") {
      throw new Error(`required export missing: ${CONTROLS_MODULE.requiredExport}`);
    }

    const controlsStatus = await imported.bootHEarthControls({
      canvasStatus: state.canvasRuntimeStatus,
      routeDoorwayContract: CONTRACT,
      readOnly: true,
      parentMutationAuthorized: false
    });

    state.controlsRuntimeStatus = controlsStatus || null;

    const actualContract = getImportedControlsContract(imported, controlsStatus);
    const staleControls = actualContract !== EXPECTED_CONTRACTS.controls;

    const controlsReady =
      !staleControls &&
      controlsStatus?.controlsAuthorized === true &&
      controlsStatus?.motionAuthorized === true &&
      controlsStatus?.inputAuthorized === true &&
      controlsStatus?.parentMutationAuthorized === false;

    state.controlsModule = {
      status: staleControls ? "loaded-stale-contract" : "loaded",
      path: CONTROLS_MODULE.path,
      url,
      actualContract
    };

    state.controlsStatus = controlsReady ? "active-motion-input-authority" : "loaded-held";
    state.controlsAuthorized = controlsReady;
    state.motionAuthorized = controlsReady;
    state.inputAuthorized = controlsReady;

    if (staleControls) state.staleContractCount += 1;

    if (controlsReady) {
      const canvasApi = window.DGBHEarthCanvas || window.HEarthCanvas || window.H_EARTH_CANVAS || null;

      if (canvasApi && typeof canvasApi.refreshHEarthCanvasControlsStatus === "function") {
        state.canvasRuntimeStatus = canvasApi.refreshHEarthCanvasControlsStatus(controlsStatus);
      } else if (canvasApi && typeof canvasApi.refreshControlsStatus === "function") {
        state.canvasRuntimeStatus = canvasApi.refreshControlsStatus(controlsStatus);
      }
    }

    state.canvasControlsReceiptAligned =
      state.canvasRuntimeStatus?.canvasControlsReceiptAligned === true &&
      state.canvasRuntimeStatus?.controlsStatus === "active-motion-input-authority";

    state.parentChainStatus = controlsReady && state.canvasControlsReceiptAligned
      ? "controls-receipt-alignment-active"
      : controlsReady
        ? "controls-active-but-canvas-receipt-alignment-held"
        : "controls-loaded-but-held";

    stampDocument();

    publishStatus(state.parentChainStatus, [
      `CONTROLS: loaded · ${actualContract}`,
      `EXPECTED_CONTROLS: ${EXPECTED_CONTRACTS.controls}`,
      `CONTROLS_STALE_CONTRACT: ${String(staleControls)}`,
      `CONTROLS_STATUS: ${controlsStatus?.status || "pending"}`,
      `CONTROLS_AUTHORIZED: ${String(state.controlsAuthorized)}`,
      `MOTION_AUTHORIZED: ${String(state.motionAuthorized)}`,
      `INPUT_AUTHORIZED: ${String(state.inputAuthorized)}`,
      `CANVAS_CONTROLS_RECEIPT_ALIGNED: ${String(state.canvasControlsReceiptAligned)}`,
      `CANVAS_PANEL_CONTROLS_STATUS: ${state.canvasRuntimeStatus?.controlsStatus || "pending"}`,
      `PARENT_MUTATION_AUTHORIZED: false`,
      `VISUAL_PASS_CLAIM: false`
    ]);

    publishReceiptPanel();

    renderMountMessage(
      state.canvasControlsReceiptAligned ? "Receipts aligned" : "Controls active",
      [
        `Canvas proof: ${String(canvasProofPasses(state.canvasRuntimeStatus))}`,
        `Controls: ${controlsStatus?.status || "pending"}`,
        `Canvas controls aligned: ${String(state.canvasControlsReceiptAligned)}`,
        `Parent mutation: forbidden`
      ]
    );

    return controlsReady;
  } catch (error) {
    const message = safeError(error);

    state.controlsStatus = "failed";
    state.controlsModule = {
      status: "import-or-boot-failed",
      path: CONTROLS_MODULE.path,
      url,
      actualContract: "import-or-boot-failed",
      error: message
    };

    state.errors.push(`controls: ${message}`);
    state.parentChainStatus = "controls-receipt-alignment-failed";

    stampDocument();
    publishStatus("controls receipt alignment failed", [
      `ERROR: ${message}`,
      `PARENT_MUTATION_AUTHORIZED: false`
    ]);
    publishReceiptPanel();
    return false;
  }
}

async function boot() {
  state.parentChainStatus = "route-doorway-top-level-executed";
  stampDocument();

  publishStatus("route doorway top-level executed; loading receipt alignment chain", [
    `ALIGNMENT: canvas controls receipt`,
    `CHAIN: kernel → lattice256 → landmap → terrain → surface → canvas → controls`,
    `PARENT_MUTATION_AUTHORIZED: false`
  ]);
  publishReceiptPanel();

  renderMountMessage("Receipt alignment active", [
    "Top-level execution confirmed",
    "Loading parent chain",
    "Controls align after canvas proof"
  ]);

  const parentLoaded = await loadParentModules();
  if (!parentLoaded) return;

  const instancesCreated = createInstances();
  if (!instancesCreated) return;

  const canvasAllowed = surfaceAllowsCanvas();

  state.parentChainStatus = canvasAllowed
    ? "surface-parent-ready-for-aligned-canvas"
    : "surface-parent-held-before-canvas";
  state.canvasStatus = canvasAllowed ? "authorized-for-canvas-import" : "held";
  state.controlsStatus = "held";

  stampDocument();
  publishStatus(state.parentChainStatus, [
    `SURFACE_PARENT_READY: ${String(state.instances.surface?.summary?.surfaceParentReady === true)}`,
    `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(state.instances.surface?.summary?.downstreamCanvasMayReadSurface === true)}`,
    `CANVAS_IMPORT_AUTHORIZED: ${String(canvasAllowed)}`,
    `CONTROLS: held`
  ]);
  publishReceiptPanel();

  if (!canvasAllowed) return;

  const canvasReady = await importCanvasModule();
  if (!canvasReady) return;

  await importControlsModule();
}

stampDocument();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PRIOR_CONTRACT,
  PRIOR_HTML_CONTRACT,
  SEED_PACKET,
  ROUTE,
  ACTIVE_MODULES,
  CANVAS_MODULE,
  CONTROLS_MODULE,
  CACHE_KEY,
  EXPECTED_CONTRACTS
};
