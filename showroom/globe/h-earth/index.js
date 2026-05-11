// /showroom/globe/h-earth/index.js
// H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_ROUTE_TNT_v15
// Full-file replacement.
// Private H-Earth route doorway authority only.
//
// Purpose:
// - Restore /showroom/globe/h-earth/ as the private H-Earth build room.
// - Load parent chain: kernel → lattice256 → landmap → terrain → surface.
// - Load nested canvas index child receiver.
// - Confirm terrain elevation sea-level child through the canvas index.
// - Load orbital build surface.
// - Keep ground-level mode held.
// - Keep estate placement held.
// - Keep Showroom TV set separate.
// - Keep parent truth immutable.

const CONTRACT = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_ROUTE_TNT_v15";
const HTML_CONTRACT = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_HTML_TNT_v15";
const PAIR_CONTRACT = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_PAIR_TNT_v15";
const PREVIOUS_CONTRACT = "H_EARTH_G1_NESTED_CANVAS_ASSET_PATH_ALIGNMENT_ROUTE_TNT_v10B";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";

const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const BUILD_MODE = "orbital-aerial-first";

const URL_CACHE =
  new URLSearchParams(window.location.search).get("v") ||
  "private-orbital-build-room-restore-v15";

const CACHE_KEY = `2026-05-11-h-earth-private-orbital-build-room-restore-v15-${URL_CACHE}`;

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

const HELD = Object.freeze({
  groundLevel: "/assets/h-earth/h-earth/ground/",
  estatePlacement: "/assets/h-earth/h-earth/estate/",
  orbitalControls: "/assets/h-earth/h-earth/orbital.build.controls.js"
});

const state = {
  contract: CONTRACT,
  htmlContract: HTML_CONTRACT,
  pairContract: PAIR_CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  planet: PLANET,
  buildMode: BUILD_MODE,
  cacheKey: CACHE_KEY,

  parentChainStatus: "not-started",
  loadedParentModules: 0,
  failedParentModules: 0,
  loadedChildModules: 0,
  failedChildModules: 0,
  staleContractCount: 0,

  parentModules: {},
  childModules: {},
  parentInstances: {},
  canvasLayer: null,
  canvasLayerStatus: null,
  orbitalSurfaceStatus: null,

  groundLevelReady: false,
  estatePlacementReady: false,
  parentMutationAuthorized: false,
  visualPassClaim: false,
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

function receiptPanel() {
  return byId("hEarthReceiptPanel");
}

function mountTarget() {
  return byId("hEarthCanvasCompositionMount");
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayTopLevelExecuted = "true";
  root.dataset.routeDoorwayReceipt = CONTRACT;
  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.pairReceipt = PAIR_CONTRACT;
  root.dataset.previousRouteDoorwayContract = PREVIOUS_CONTRACT;
  root.dataset.hEarthSeedPacket = SEED_PACKET;
  root.dataset.hEarthPrivateRoom = "true";
  root.dataset.hEarthRoom = "private-orbital-aerial-build-room";
  root.dataset.parentCoreChainStatus = state.parentChainStatus;
  root.dataset.cacheKey = CACHE_KEY;

  root.dataset.hEarthBuildMode = BUILD_MODE;
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

  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.earthMutationAuthorized = "false";
  root.dataset.hearthMutationAuthorized = "false";
  root.dataset.audraliaMutationAuthorized = "false";
  root.dataset.graphicBox = "forbidden";
  root.dataset.imageGeneration = "forbidden";
  root.dataset.visualPassClaim = "false";
}

function renderMountMessage(title, bodyLines = []) {
  const mount = mountTarget();
  if (!mount) return;

  mount.dataset.hEarthMountStatus = title;
  mount.dataset.hEarthPrivateRoom = "true";
  mount.dataset.hEarthBuildMode = BUILD_MODE;
  mount.dataset.hEarthGroundLevelReady = "false";
  mount.dataset.hEarthEstatePlacementReady = "false";
  mount.dataset.hEarthParentMutationAuthorized = "false";
  mount.dataset.hEarthVisualPassClaim = "false";

  const shell = document.createElement("div");
  shell.setAttribute("aria-live", "polite");
  shell.style.position = "absolute";
  shell.style.left = "50%";
  shell.style.top = "50%";
  shell.style.width = "min(88%, 520px)";
  shell.style.transform = "translate(-50%, -50%)";
  shell.style.padding = "16px";
  shell.style.border = "1px solid rgba(143,240,195,.34)";
  shell.style.borderRadius = "24px";
  shell.style.background = "rgba(5,9,18,.82)";
  shell.style.color = "#f6ead2";
  shell.style.textAlign = "center";
  shell.style.font = "700 .9rem Inter, system-ui, sans-serif";
  shell.style.letterSpacing = ".02em";
  shell.style.boxShadow = "0 20px 60px rgba(0,0,0,.35)";

  const heading = document.createElement("div");
  heading.textContent = title;
  heading.style.color = "#8ff0c3";
  heading.style.fontWeight = "900";
  heading.style.textTransform = "uppercase";
  heading.style.letterSpacing = ".08em";
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
    publishReceiptPanel();

    const imported = await importModule(entry, state.parentModules);

    if (!imported) {
      state.failedParentModules += 1;
      state.parentChainStatus = `parent-${entry.key}-failed`;
      stampDocument();
      publishReceiptPanel();
      renderMountMessage("Parent chain held", [`${entry.key} failed`, "Private H-Earth room did not complete"]);
      return false;
    }

    state.loadedParentModules += 1;
    publishReceiptPanel();
  }

  return true;
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
      priorDoorwayContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      planet: PLANET,
      privateRoom: true,
      buildMode: BUILD_MODE,
      canvasIndexChildReceiver: true,
      orbitalBuildSurface: true,
      groundLevelReady: false,
      estatePlacementReady: false,
      mutationAuthorized: false,
      controlsAuthorized: false,
      motionAuthorized: false,
      inputAuthorized: false
    });

    const lattice256 = latticeModule.createHEarthLattice256({ kernel });
    const landmap = landmapModule.createHEarthLandmap({ kernel, lattice256 });
    const terrain = terrainModule.createHEarthTerrain({ kernel, lattice256, landmap });
    const surface = surfaceModule.createHEarthSurface({ kernel, lattice256, landmap, terrain });

    state.parentInstances = {
      kernel,
      lattice256,
      landmap,
      terrain,
      surface
    };

    window.H_EARTH_ROUTE_PARENT_INSTANCES = state.parentInstances;
    window.H_EARTH_ROUTE_PARENT_INSTANCE_CONTEXT = {
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PREVIOUS_CONTRACT,
      privateRoom: true,
      buildMode: BUILD_MODE,
      readOnly: true,
      groundLevelReady: false,
      estatePlacementReady: false,
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
    publishReceiptPanel();
    renderMountMessage("Parent instance failed", ["Parent modules loaded", "Factory chain failed"]);
    return false;
  }
}

async function activateCanvasIndex() {
  const entry = CHILD_MODULES.find((module) => module.key === "canvasIndex");
  const imported = await importModule(entry, state.childModules);

  if (!imported) {
    state.failedChildModules += 1;
    state.parentChainStatus = "canvas-index-import-failed";
    stampDocument();
    publishReceiptPanel();
    renderMountMessage("Canvas index held", ["Nested canvas index did not import"]);
    return false;
  }

  state.loadedChildModules += 1;

  try {
    const layer = imported.createHEarthCanvasLayer({
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PREVIOUS_CONTRACT,
      privateRoom: true,
      buildMode: BUILD_MODE,
      readOnly: true,
      mutationAuthorized: false,
      groundLevelReady: false,
      estatePlacementReady: false
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
    publishReceiptPanel();
    renderMountMessage("Canvas index failed", ["Canvas receiver did not activate"]);
    return false;
  }
}

async function activateOrbitalSurface() {
  const entry = CHILD_MODULES.find((module) => module.key === "orbitalSurface");
  const imported = await importModule(entry, state.childModules);

  if (!imported) {
    state.failedChildModules += 1;
    state.parentChainStatus = "orbital-surface-import-failed";
    stampDocument();
    publishReceiptPanel();
    renderMountMessage("Orbital surface held", ["Orbital build surface did not import"]);
    return false;
  }

  state.loadedChildModules += 1;

  try {
    const status = await imported.bootHEarthOrbitalBuildSurface({
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      canvasLayer: state.canvasLayer,
      routeDoorwayContract: CONTRACT,
      priorRouteDoorwayContract: PREVIOUS_CONTRACT,
      privateRoom: true,
      buildMode: BUILD_MODE,
      interactionTarget: "planet-surface-view",
      readOnly: true,
      mutationAuthorized: false,
      groundLevelReady: false,
      estatePlacementReady: false
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
    state.parentChainStatus = "orbital-surface-activation-failed";
    stampDocument();
    publishReceiptPanel();
    renderMountMessage("Orbital surface failed", ["Surface child did not activate"]);
    return false;
  }
}

function parentSummaryLines() {
  const landmap = state.parentInstances.landmap;
  const terrain = state.parentInstances.terrain;
  const surface = state.parentInstances.surface;

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

  const canvasStatus = state.canvasLayerStatus;
  const canvasSummary = canvasStatus?.summary || state.canvasLayer?.summary || {};
  const orbitalStatus = state.orbitalSurfaceStatus || {};

  panel.dataset.routeReceipt = CONTRACT;
  panel.dataset.htmlReceipt = HTML_CONTRACT;
  panel.dataset.pairReceipt = PAIR_CONTRACT;
  panel.dataset.previousReceipt = PREVIOUS_CONTRACT;
  panel.dataset.parentChainStatus = state.parentChainStatus;
  panel.dataset.hEarthBuildMode = BUILD_MODE;
  panel.dataset.hEarthPrivateRoom = "true";
  panel.dataset.hEarthCanvasIndexReceipt = state.canvasLayer?.contract || "pending";
  panel.dataset.hEarthTerrainElevationReceipt =
    canvasStatus?.terrainElevationReceipt ||
    canvasStatus?.children?.terrainElevation?.contract ||
    "pending";
  panel.dataset.hEarthOrbitalSurfaceReceipt = orbitalStatus?.contract || orbitalStatus?.receipt || "pending";
  panel.dataset.hEarthGroundLevelReady = "false";
  panel.dataset.hEarthEstatePlacementReady = "false";
  panel.dataset.hEarthParentMutationAuthorized = "false";
  panel.dataset.hEarthVisualPassClaim = "false";

  panel.replaceChildren(
    codeLine(`PAIR_RECEIPT: ${PAIR_CONTRACT}`),
    codeLine(`HTML_RECEIPT: ${HTML_CONTRACT}`),
    codeLine(`ROUTE_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_RECEIPT: ${PREVIOUS_CONTRACT}`),
    codeLine(`SEED_PACKET: ${SEED_PACKET}`),
    codeLine(`ROUTE: ${ROUTE}`),
    codeLine(`PLANET: ${PLANET}`),
    codeLine(`PRIVATE_ROOM: true`),
    codeLine(`BUILD_MODE: ${BUILD_MODE}`),
    codeLine(`PARENT_CHAIN_STATUS: ${state.parentChainStatus}`),
    codeLine(`LOADED_PARENT_MODULES: ${state.loadedParentModules}`),
    codeLine(`FAILED_PARENT_MODULES: ${state.failedParentModules}`),
    codeLine(`LOADED_CHILD_MODULES: ${state.loadedChildModules}`),
    codeLine(`FAILED_CHILD_MODULES: ${state.failedChildModules}`),
    codeLine(`STALE_CONTRACTS: ${state.staleContractCount}`),
    ...parentLines.map(codeLine),
    ...childLines.map(codeLine),
    ...parentSummaryLines().map(codeLine),
    codeLine(`CANVAS_INDEX_RECEIPT: ${state.canvasLayer?.contract || "pending"}`),
    codeLine(`TERRAIN_ELEVATION_RECEIPT: ${canvasStatus?.terrainElevationReceipt || canvasStatus?.children?.terrainElevation?.contract || "pending"}`),
    codeLine(`TERRAIN_ELEVATION_ASSET_PATH: /assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js`),
    codeLine(`CANVAS_LAYER_READY: ${String(canvasSummary.canvasLayerReady ?? false)}`),
    codeLine(`GROUND_LEVEL_CANDIDATE_CELLS: ${canvasSummary.groundLevelCandidateCells ?? "pending"}`),
    codeLine(`ORBITAL_SURFACE_RECEIPT: ${orbitalStatus.contract || orbitalStatus.receipt || "pending"}`),
    codeLine(`ORBITAL_SURFACE_STATUS: ${orbitalStatus.status || "pending"}`),
    codeLine(`ORBITAL_BUILD_SURFACE_READY: ${String(orbitalStatus.orbitalBuildSurfaceReady ?? false)}`),
    codeLine(`ORBITAL_CONTROLS_PATH: ${HELD.orbitalControls}`),
    codeLine(`GROUND_LEVEL_PATH: ${HELD.groundLevel}`),
    codeLine(`ESTATE_PLACEMENT_PATH: ${HELD.estatePlacement}`),
    codeLine(`GROUND_LEVEL_READY: false`),
    codeLine(`ESTATE_PLACEMENT_READY: false`),
    codeLine(`PARENT_MUTATION_AUTHORIZED: false`),
    codeLine(`EARTH_MUTATION_AUTHORIZED: false`),
    codeLine(`HEARTH_MUTATION_AUTHORIZED: false`),
    codeLine(`AUDRALIA_MUTATION_AUTHORIZED: false`),
    codeLine(`VISUAL_PASS_CLAIM: false`)
  );
}

function publishFinalStatus() {
  const canvasStatus = state.canvasLayerStatus;
  const orbitalStatus = state.orbitalSurfaceStatus || {};

  const terrainElevationReceipt =
    canvasStatus?.terrainElevationReceipt ||
    canvasStatus?.children?.terrainElevation?.contract ||
    "pending";

  const pass =
    state.staleContractCount === 0 &&
    state.failedParentModules === 0 &&
    state.failedChildModules === 0 &&
    state.loadedParentModules === PARENT_MODULES.length &&
    state.loadedChildModules === CHILD_MODULES.length &&
    state.canvasLayer?.contract === EXPECTED.canvasIndex &&
    terrainElevationReceipt === EXPECTED.terrainElevation &&
    (orbitalStatus.contract === EXPECTED.orbitalSurface || orbitalStatus.receipt === EXPECTED.orbitalSurface);

  state.parentChainStatus = pass
    ? "private-h-earth-orbital-build-room-active"
    : "private-h-earth-orbital-build-room-held";

  stampDocument();
  publishReceiptPanel();
}

async function boot() {
  state.parentChainStatus = "route-doorway-top-level-executed";
  stampDocument();
  publishReceiptPanel();

  renderMountMessage("Loading H-Earth private room", [
    "parent chain first",
    "canvas index second",
    "orbital build surface third",
    "ground level held",
    "estate placement held"
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
  HTML_CONTRACT,
  PAIR_CONTRACT,
  PREVIOUS_CONTRACT,
  SEED_PACKET,
  ROUTE,
  BUILD_MODE,
  CACHE_KEY,
  EXPECTED,
  PARENT_MODULES,
  CHILD_MODULES
};
