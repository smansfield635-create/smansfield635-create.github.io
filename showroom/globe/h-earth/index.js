// /showroom/globe/h-earth/index.js
// H_EARTH_G1_CANVAS_INDEX_ORBITAL_ASSIMILATION_ROUTE_TNT_v14A
// Full-file replacement.
// H-Earth route doorway authority only.
//
// Purpose:
// - Assimilate H-Earth route to the new canvas-layer index.
// - Load parent chain: kernel → lattice256 → landmap → terrain → surface.
// - Load canvas child receiver: /assets/h-earth/h-earth/canvas/index.js.
// - Confirm terrain elevation child through the canvas index.
// - Load orbital build surface: /assets/h-earth/h-earth/orbital.build.surface.js.
// - Stop importing stale /assets/h-earth/h-earth.canvas.js.
// - Stop importing stale /assets/h-earth/h-earth.controls.js.
// - Hold controls until orbital controls child is separately authored.
// - Keep estate placement and ground-level mode held.

const CONTRACT = "H_EARTH_G1_CANVAS_INDEX_ORBITAL_ASSIMILATION_ROUTE_TNT_v14A";
const PRIOR_CONTRACT = "H_EARTH_G1_INTERACTIVE_VIEW_ROUTE_RECEIPT_TNT_v11";
const PRIOR_HTML_CONTRACT = "H_EARTH_G1_ROUTE_SHELL_RESTORE_AFTER_SELECTOR_MISPLACEMENT_TNT_v12E";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const GENERATION = "G1";

const URL_CACHE =
  new URLSearchParams(window.location.search).get("v") ||
  "canvas-index-orbital-assimilation-v14a";

const CACHE_KEY = `2026-05-11-h-earth-canvas-index-orbital-assimilation-v14a-${URL_CACHE}`;

const EXPECTED = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  canvasIndex: "H_EARTH_G1_CANVAS_INDEX_CHILD_RECEIVER_TNT_v1",
  terrainElevation: "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_CHILD_TNT_v1",
  orbitalSurface: "H_EARTH_G1_ORBITAL_BUILD_SURFACE_CANVAS_TNT_v13A"
});

const PARENT_MODULES = Object.freeze([
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

const CHILD_MODULES = Object.freeze([
  {
    key: "canvasIndex",
    path: "/assets/h-earth/h-earth/canvas/index.js",
    requiredExport: "createHEarthCanvasLayer"
  },
  {
    key: "orbitalSurface",
    path: "/assets/h-earth/h-earth/orbital.build.surface.js",
    requiredExport: "bootHEarthOrbitalBuildSurface"
  }
]);

const HELD_MODULES = Object.freeze([
  {
    key: "orbitalControls",
    path: "/assets/h-earth/h-earth/orbital.build.controls.js",
    status: "held-until-orbital-surface-passes"
  },
  {
    key: "groundLevel",
    path: "/assets/h-earth/h-earth/ground/",
    status: "held-until-orbital-build-surface-is-approved"
  },
  {
    key: "estatePlacement",
    path: "/assets/h-earth/h-earth/estate/",
    status: "held-until-ground-level-mode-is-authorized"
  }
]);

const state = {
  contract: CONTRACT,
  priorContract: PRIOR_CONTRACT,
  priorHtmlContract: PRIOR_HTML_CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  planet: PLANET,
  generation: GENERATION,
  cacheKey: CACHE_KEY,

  routeDoorwayTopLevelExecuted: true,
  parentChainStatus: "top-level-executed",
  loadedParentModules: 0,
  failedParentModules: 0,
  loadedChildModules: 0,
  failedChildModules: 0,
  staleContractCount: 0,

  parentModules: {},
  childModules: {},
  heldModules: {},
  instances: {},
  canvasLayer: null,
  canvasLayerStatus: null,
  orbitalSurfaceStatus: null,
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

function receiptFrom(imported, instance) {
  return (
    imported?.CONTRACT ||
    imported?.default?.contract ||
    imported?.default?.receipt ||
    instance?.contract ||
    instance?.receipt ||
    "contract-not-exported"
  );
}

function statusTarget() {
  return byId("hEarthStatusTarget");
}

function receiptPanel() {
  return byId("hEarthReceiptPanel");
}

function statusMount() {
  return byId("hEarthCanvasMount");
}

function controlsMount() {
  return byId("hEarthControlsMount");
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

  root.dataset.hEarthBuildMode = "orbital-aerial";
  root.dataset.hEarthInteractionTarget = "planet-surface-view";
  root.dataset.hEarthCanvasIndexReceipt = state.canvasLayer?.contract || "pending";
  root.dataset.hEarthTerrainElevationReceipt =
    state.canvasLayerStatus?.terrainElevationReceipt ||
    state.canvasLayerStatus?.children?.terrainElevation?.contract ||
    "pending";
  root.dataset.hEarthOrbitalSurfaceReceipt =
    state.orbitalSurfaceStatus?.contract ||
    state.orbitalSurfaceStatus?.receipt ||
    "pending";

  root.dataset.hEarthOrbitalBuildSurfaceReady = String(
    state.orbitalSurfaceStatus?.orbitalBuildSurfaceReady === true ||
    state.orbitalSurfaceStatus?.summary?.orbitalBuildSurfaceReady === true
  );

  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.graphicBox = "forbidden";
  root.dataset.imageGeneration = "forbidden";
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
  target.dataset.hEarthBuildMode = "orbital-aerial";
  target.dataset.hEarthInteractionTarget = "planet-surface-view";
  target.dataset.hEarthEstatePlacementReady = "false";
  target.dataset.hEarthGroundLevelReady = "false";
  target.dataset.hEarthParentMutationAuthorized = "false";
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

function renderStatusMount(title, bodyLines = []) {
  const mount = statusMount();
  if (!mount) return;

  mount.dataset.routeMount = "h-earth-orbital-build-surface-status";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.routeDoorwayTopLevelExecuted = "true";
  mount.dataset.cacheKey = CACHE_KEY;
  mount.dataset.hEarthBuildMode = "orbital-aerial";
  mount.dataset.hEarthInteractionTarget = "planet-surface-view";
  mount.dataset.hEarthEstatePlacementReady = "false";
  mount.dataset.hEarthGroundLevelReady = "false";
  mount.dataset.hEarthParentMutationAuthorized = "false";
  mount.dataset.hEarthVisualPassClaim = "false";

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 470px)";
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

function renderControlsHeld() {
  const mount = controlsMount();
  if (!mount) return;

  mount.dataset.hEarthControlsStatus = "held";
  mount.dataset.hEarthControlsReceipt = "held-until-orbital-controls-child";
  mount.dataset.hEarthParentMutationAuthorized = "false";

  const panel = document.createElement("section");
  panel.setAttribute("data-h-earth-controls-panel", "held");
  panel.innerHTML = `
    <h2 style="margin:0 0 .45rem;color:#f6d37b;font-size:1.2rem;">Orbital Controls Held</h2>
    <p style="margin:0;color:rgba(246,234,210,.76);line-height:1.55;">
      Controls are held until <strong>/assets/h-earth/h-earth/orbital.build.controls.js</strong>
      is authored. The active target is now the orbital planet build surface, not the old interactive card lane.
    </p>
  `;

  mount.replaceChildren(panel);
}

async function importModule(entry, bucket) {
  const url = moduleUrl(entry.path);

  try {
    const imported = await import(url);

    if (!imported || typeof imported[entry.requiredExport] !== "function") {
      throw new Error(`required export missing: ${entry.requiredExport}`);
    }

    const actual = receiptFrom(imported, imported.default);
    const expected = EXPECTED[entry.key];

    bucket[entry.key] = {
      status: "loaded",
      path: entry.path,
      url,
      requiredExport: entry.requiredExport,
      expected,
      actual,
      module: imported
    };

    if (expected && actual !== expected) state.staleContractCount += 1;

    return imported;
  } catch (error) {
    const message = safeError(error);

    bucket[entry.key] = {
      status: "failed",
      path: entry.path,
      url,
      requiredExport: entry.requiredExport,
      expected: EXPECTED[entry.key],
      actual: "import-failed",
      error: message
    };

    state.errors.push(`${entry.key}: ${message}`);
    return null;
  }
}

async function loadParentModules() {
  for (const entry of PARENT_MODULES) {
    state.parentChainStatus = `loading-parent-${entry.key}`;
    stampDocument();

    publishStatus(`loading parent ${entry.key}`, [
      `CURRENT_MODULE: ${entry.path}`,
      `IMPORT_URL: ${moduleUrl(entry.path)}`
    ]);
    publishReceiptPanel();

    const imported = await importModule(entry, state.parentModules);

    if (!imported) {
      state.failedParentModules += 1;
      state.parentChainStatus = `parent-${entry.key}-failed`;
      stampDocument();

      publishStatus(`parent ${entry.key} import failed`, [
        `FAILED_MODULE: ${entry.path}`,
        `ERROR: ${state.parentModules[entry.key]?.error || "unknown"}`
      ]);
      publishReceiptPanel();
      renderStatusMount("Parent chain held", [`${entry.key} failed`, "Orbital surface not loaded"]);
      return false;
    }

    state.loadedParentModules += 1;
  }

  return true;
}

async function loadChildModule(entry) {
  state.parentChainStatus = `loading-child-${entry.key}`;
  stampDocument();

  publishStatus(`loading child ${entry.key}`, [
    `CURRENT_MODULE: ${entry.path}`,
    `IMPORT_URL: ${moduleUrl(entry.path)}`
  ]);
  publishReceiptPanel();

  const imported = await importModule(entry, state.childModules);

  if (!imported) {
    state.failedChildModules += 1;
    state.parentChainStatus = `child-${entry.key}-failed`;
    stampDocument();

    publishStatus(`child ${entry.key} import failed`, [
      `FAILED_MODULE: ${entry.path}`,
      `ERROR: ${state.childModules[entry.key]?.error || "unknown"}`
    ]);
    publishReceiptPanel();
    renderStatusMount("Child chain held", [`${entry.key} failed`, "Check nested canvas asset path"]);
    return null;
  }

  state.loadedChildModules += 1;
  return imported;
}

function createParentInstances() {
  try {
    const kernelModule = state.parentModules.kernel.module;
    const latticeModule = state.parentModules.lattice256.module;
    const landmapModule = state.parentModules.landmap.module;
    const terrainModule = state.parentModules.terrain.module;
    const surfaceModule = state.parentModules.surface.module;

    const kernel = kernelModule.createHEarthKernel({
      doorwayContract: CONTRACT,
      priorDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      route: ROUTE,
      planetBuildMode: "orbital-aerial",
      canvasIndexChildReceiver: true,
      orbitalBuildSurface: true,
      estatePlacementReady: false,
      groundLevelReady: false,
      mutationAuthorized: false,
      controlsAuthorized: false,
      motionAuthorized: false,
      inputAuthorized: false
    });

    const lattice256 = latticeModule.createHEarthLattice256({ kernel });
    const landmap = landmapModule.createHEarthLandmap({ kernel, lattice256 });
    const terrain = terrainModule.createHEarthTerrain({ kernel, lattice256, landmap });
    const surface = surfaceModule.createHEarthSurface({ kernel, lattice256, landmap, terrain });

    state.instances = {
      kernel,
      lattice256,
      landmap,
      terrain,
      surface
    };

    window.H_EARTH_ROUTE_PARENT_INSTANCES = state.instances;
    window.H_EARTH_ROUTE_PARENT_INSTANCE_CONTEXT = {
      instances: state.instances,
      parentInstances: state.instances,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      planetBuildMode: "orbital-aerial",
      readOnly: true,
      estatePlacementReady: false,
      groundLevelReady: false,
      mutationAuthorized: false,
      controlsAuthorized: false,
      motionAuthorized: false,
      inputAuthorized: false
    };

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`create-parent-instances: ${message}`);
    state.parentChainStatus = "parent-instance-create-failed";
    stampDocument();

    publishStatus("parent instance creation failed", [
      `ERROR: ${message}`,
      `CHECK: parent factory signatures`
    ]);
    publishReceiptPanel();
    renderStatusMount("Parent instance failed", ["Parent modules loaded", "Factory chain failed"]);

    return false;
  }
}

function parentSummaryLines() {
  const landmap = state.instances.landmap;
  const terrain = state.instances.terrain;
  const surface = state.instances.surface;

  const landSummary = landmap?.summary || {};
  const terrainSummary = terrain?.summary || {};
  const surfaceSummary = surface?.summary || {};

  return [
    `LAND_RATIO: ${landSummary.landRatio ?? "pending"}`,
    `OCEAN_RATIO: ${landSummary.oceanRatio ?? "pending"}`,
    `TERRAIN_TOTAL_CELLS: ${terrainSummary.totalCells ?? "pending"}`,
    `TERRAIN_ASPECTS: ${terrainSummary.populatedTerrainAspectCount ?? "pending"}/${terrainSummary.terrainAspectCount ?? "pending"}`,
    `FULL_ASPECT_DISPOSITION: ${String(terrainSummary.fullAspectDisposition ?? false)}`,
    `SURFACE_TOTAL_CELLS: ${surfaceSummary.totalCells ?? "pending"}`,
    `SURFACE_MATERIAL_CLASSES: ${surfaceSummary.materialClassCount ?? "pending"}/${surfaceSummary.requiredMaterialClassCount ?? "pending"}`,
    `SURFACE_PARENT_READY: ${String(surfaceSummary.surfaceParentReady ?? false)}`,
    `DOWNSTREAM_CANVAS_MAY_READ_SURFACE: ${String(surfaceSummary.downstreamCanvasMayReadSurface ?? false)}`
  ];
}

async function activateCanvasIndex() {
  const entry = CHILD_MODULES.find((module) => module.key === "canvasIndex");
  const imported = await loadChildModule(entry);
  if (!imported) return false;

  try {
    const layer = imported.createHEarthCanvasLayer({
      instances: state.instances,
      parentInstances: state.instances,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      readOnly: true,
      mutationAuthorized: false,
      estatePlacementReady: false,
      groundLevelReady: false
    });

    state.canvasLayer = layer;

    state.canvasLayerStatus =
      typeof imported.getHEarthCanvasLayerStatus === "function"
        ? imported.getHEarthCanvasLayerStatus()
        : {
            contract: layer?.contract,
            receipt: layer?.receipt,
            status: layer?.status,
            summary: layer?.summary,
            children: layer?.getCanvasChildren?.() || {}
          };

    const actual = layer?.contract || layer?.receipt || receiptFrom(imported, layer);
    state.childModules.canvasIndex.actual = actual;

    const terrainElevationReceipt =
      state.canvasLayerStatus?.terrainElevationReceipt ||
      state.canvasLayerStatus?.children?.terrainElevation?.contract ||
      layer?.children?.terrainElevation?.contract ||
      "missing";

    if (actual !== EXPECTED.canvasIndex) state.staleContractCount += 1;
    if (terrainElevationReceipt !== EXPECTED.terrainElevation) state.staleContractCount += 1;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`activate-canvas-index: ${message}`);
    state.parentChainStatus = "canvas-index-activation-failed";
    stampDocument();

    publishStatus("canvas index activation failed", [
      `ERROR: ${message}`,
      `CHECK: /assets/h-earth/h-earth/canvas/index.js`
    ]);
    publishReceiptPanel();
    renderStatusMount("Canvas index failed", ["Canvas receiver did not activate"]);

    return false;
  }
}

async function activateOrbitalSurface() {
  const entry = CHILD_MODULES.find((module) => module.key === "orbitalSurface");
  const imported = await loadChildModule(entry);
  if (!imported) return false;

  try {
    const status = await imported.bootHEarthOrbitalBuildSurface({
      instances: state.instances,
      parentInstances: state.instances,
      canvasLayer: state.canvasLayer,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PRIOR_CONTRACT,
      priorHtmlContract: PRIOR_HTML_CONTRACT,
      planetBuildMode: "orbital-aerial",
      interactionTarget: "planet-surface-view",
      readOnly: true,
      mutationAuthorized: false,
      estatePlacementReady: false,
      groundLevelReady: false
    });

    state.orbitalSurfaceStatus =
      status ||
      (typeof imported.getHEarthOrbitalBuildSurfaceStatus === "function"
        ? imported.getHEarthOrbitalBuildSurfaceStatus()
        : null);

    const actual =
      state.orbitalSurfaceStatus?.contract ||
      state.orbitalSurfaceStatus?.receipt ||
      receiptFrom(imported, state.orbitalSurfaceStatus);

    state.childModules.orbitalSurface.actual = actual;

    if (actual !== EXPECTED.orbitalSurface) state.staleContractCount += 1;

    return true;
  } catch (error) {
    const message = safeError(error);
    state.errors.push(`activate-orbital-surface: ${message}`);
    state.parentChainStatus = "orbital-build-surface-activation-failed";
    stampDocument();

    publishStatus("orbital build surface activation failed", [
      `ERROR: ${message}`,
      `CHECK: /assets/h-earth/h-earth/orbital.build.surface.js`
    ]);
    publishReceiptPanel();
    renderStatusMount("Orbital surface failed", ["Surface child did not activate"]);

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

function publishReceiptPanel() {
  const panel = receiptPanel();
  if (!panel) return;

  const parentLines = PARENT_MODULES.map((entry) => {
    const record = state.parentModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED[entry.key];
    const actual = record?.actual || "pending";
    const stale = actual !== "pending" && expected && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const childLines = CHILD_MODULES.map((entry) => {
    const record = state.childModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED[entry.key];
    const actual = record?.actual || "pending";
    const stale = actual !== "pending" && expected && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const heldLines = HELD_MODULES.map((entry) => {
    return `${entry.key.toUpperCase()}: ${entry.status} · ${entry.path}`;
  });

  const canvasStatus = state.canvasLayerStatus;
  const canvasSummary = canvasStatus?.summary || state.canvasLayer?.summary || {};
  const orbitalStatus = state.orbitalSurfaceStatus || {};

  panel.dataset.receiptDoorway = CONTRACT;
  panel.dataset.parentChainStatus = state.parentChainStatus;
  panel.dataset.hEarthBuildMode = "orbital-aerial";
  panel.dataset.hEarthInteractionTarget = "planet-surface-view";
  panel.dataset.hEarthCanvasIndexReceipt = state.canvasLayer?.contract || "pending";
  panel.dataset.hEarthTerrainElevationReceipt =
    canvasStatus?.terrainElevationReceipt ||
    canvasStatus?.children?.terrainElevation?.contract ||
    "pending";
  panel.dataset.hEarthOrbitalSurfaceReceipt = orbitalStatus?.contract || orbitalStatus?.receipt || "pending";
  panel.dataset.hEarthEstatePlacementReady = "false";
  panel.dataset.hEarthGroundLevelReady = "false";
  panel.dataset.hEarthParentMutationAuthorized = "false";
  panel.dataset.hEarthVisualPassClaim = "false";

  panel.replaceChildren(
    codeLine(`H_EARTH_IDENTITY: Hybrid Earth build planet`),
    codeLine(`ROUTE_AUTHORITY: doorway only`),
    codeLine(`ROUTE_DOORWAY_TOPLEVEL_EXECUTED: true`),
    codeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`PLANET_BUILD_MODE: orbital-aerial`),
    codeLine(`INTERACTION_TARGET: planet-surface-view`),
    codeLine(`LOADED_PARENT_MODULES: ${state.loadedParentModules}`),
    codeLine(`FAILED_PARENT_MODULES: ${state.failedParentModules}`),
    codeLine(`LOADED_CHILD_MODULES: ${state.loadedChildModules}`),
    codeLine(`FAILED_CHILD_MODULES: ${state.failedChildModules}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    codeLine(`LEGACY_ROOT_CANVAS_IMPORT: forbidden`),
    codeLine(`LEGACY_CONTROLS_IMPORT: forbidden`),
    ...parentLines.map(codeLine),
    ...childLines.map(codeLine),
    codeLine(`CANVAS_INDEX_RECEIPT: ${state.canvasLayer?.contract || "pending"}`),
    codeLine(`TERRAIN_ELEVATION_RECEIPT: ${canvasStatus?.terrainElevationReceipt || canvasStatus?.children?.terrainElevation?.contract || "pending"}`),
    codeLine(`TERRAIN_ELEVATION_ASSET_PATH: /assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js`),
    codeLine(`CANVAS_LAYER_READY: ${String(canvasSummary.canvasLayerReady ?? false)}`),
    codeLine(`GROUND_LEVEL_CANDIDATE_CELLS: ${canvasSummary.groundLevelCandidateCells ?? "pending"}`),
    codeLine(`ORBITAL_SURFACE_RECEIPT: ${orbitalStatus.contract || orbitalStatus.receipt || "pending"}`),
    codeLine(`ORBITAL_SURFACE_STATUS: ${orbitalStatus.status || "pending"}`),
    codeLine(`ORBITAL_BUILD_SURFACE_READY: ${String(orbitalStatus.orbitalBuildSurfaceReady ?? false)}`),
    codeLine(`ESTATE_PLACEMENT_READY: false`),
    codeLine(`GROUND_LEVEL_READY: false`),
    codeLine(`PARENT_MUTATION_AUTHORIZED: false`),
    codeLine(`VISUAL_PASS_CLAIM: false`),
    ...heldLines.map(codeLine)
  );
}

function publishFinalStatus() {
  const canvasStatus = state.canvasLayerStatus;
  const canvasSummary = canvasStatus?.summary || state.canvasLayer?.summary || {};
  const orbitalStatus = state.orbitalSurfaceStatus || {};

  const pass =
    state.staleContractCount === 0 &&
    state.failedParentModules === 0 &&
    state.failedChildModules === 0 &&
    state.loadedParentModules === PARENT_MODULES.length &&
    state.loadedChildModules === CHILD_MODULES.length &&
    state.canvasLayer?.contract === EXPECTED.canvasIndex &&
    (
      canvasStatus?.terrainElevationReceipt === EXPECTED.terrainElevation ||
      canvasStatus?.children?.terrainElevation?.contract === EXPECTED.terrainElevation
    ) &&
    (orbitalStatus.contract === EXPECTED.orbitalSurface || orbitalStatus.receipt === EXPECTED.orbitalSurface);

  state.parentChainStatus = pass
    ? "orbital-build-surface-assimilated-through-canvas-index"
    : "orbital-build-surface-assimilation-held";

  stampDocument();

  publishStatus(state.parentChainStatus, [
    ...parentSummaryLines(),
    `CANVAS_INDEX_RECEIPT: ${state.canvasLayer?.contract || "pending"}`,
    `TERRAIN_ELEVATION_RECEIPT: ${canvasStatus?.terrainElevationReceipt || canvasStatus?.children?.terrainElevation?.contract || "pending"}`,
    `CANVAS_LAYER_READY: ${String(canvasSummary.canvasLayerReady ?? false)}`,
    `GROUND_LEVEL_CANDIDATE_CELLS: ${canvasSummary.groundLevelCandidateCells ?? "pending"}`,
    `ORBITAL_SURFACE_RECEIPT: ${orbitalStatus.contract || orbitalStatus.receipt || "pending"}`,
    `ORBITAL_SURFACE_STATUS: ${orbitalStatus.status || "pending"}`,
    `ORBITAL_BUILD_SURFACE_READY: ${String(orbitalStatus.orbitalBuildSurfaceReady ?? false)}`,
    `ESTATE_PLACEMENT_READY: false`,
    `GROUND_LEVEL_READY: false`,
    `PARENT_MUTATION_AUTHORIZED: false`,
    `VISUAL_PASS_CLAIM: false`
  ]);

  publishReceiptPanel();

  renderStatusMount(
    pass ? "Orbital build surface active" : "Orbital build surface held",
    [
      `Canvas index: ${state.canvasLayer?.contract || "pending"}`,
      `Elevation child: ${canvasStatus?.terrainElevationReceipt || canvasStatus?.children?.terrainElevation?.contract || "pending"}`,
      `Orbital surface: ${orbitalStatus.contract || orbitalStatus.receipt || "pending"}`,
      `Ground candidates: ${canvasSummary.groundLevelCandidateCells ?? "pending"}`,
      "Estate placement: false",
      "Ground level: false"
    ]
  );
}

async function boot() {
  setHeldModules();
  stampDocument();
  renderControlsHeld();

  state.parentChainStatus = "route-doorway-top-level-executed";
  publishStatus("route doorway active; loading H-Earth parent chain", [
    `ACTIVE_CHAIN: kernel → lattice256 → landmap → terrain → surface → canvas/index → orbital surface`,
    `HELD_CHAIN: orbital controls → ground level → estate placement`,
    `CACHE_KEY: ${CACHE_KEY}`
  ]);
  publishReceiptPanel();

  renderStatusMount("Loading orbital build surface", [
    "parent chain first",
    "canvas index second",
    "orbital surface third",
    "ground level held"
  ]);

  const parentsLoaded = await loadParentModules();
  if (!parentsLoaded) return;

  const parentInstancesCreated = createParentInstances();
  if (!parentInstancesCreated) return;

  const canvasIndexActivated = await activateCanvasIndex();
  if (!canvasIndexActivated) return;

  const orbitalSurfaceActivated = await activateOrbitalSurface();
  if (!orbitalSurfaceActivated) return;

  publishFinalStatus();
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
  CACHE_KEY,
  EXPECTED,
  PARENT_MODULES,
  CHILD_MODULES,
  HELD_MODULES
};
