// /showroom/globe/h-earth/index.js
// H_EARTH_G1_ROUTE_DOORWAY_TNT_v1
// Full-file replacement.
// Route doorway authority only.
//
// Owns:
// - route boot
// - module import sequence
// - status bridge
// - mount call delegation
// - public route receipts
// - parent-chain readiness publication
//
// Does not own:
// - visual truth
// - terrain truth
// - land/water truth
// - animation math
// - canvas paint
//
// Seed authority:
// H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1

const CONTRACT = "H_EARTH_G1_ROUTE_DOORWAY_TNT_v1";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const ROUTE = "/showroom/globe/h-earth/";
const PLANET = "H-Earth";
const PLANET_MEANING = "Hybrid Earth";
const GENERATION = "G1";

const MODULES = Object.freeze([
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
  },
  {
    key: "canvas",
    label: "Canvas visible composition",
    path: "/assets/h-earth/h-earth.canvas.js",
    requiredExport: "mountHEarthCanvas"
  },
  {
    key: "controls",
    label: "Controls motion/input only",
    path: "/assets/h-earth/h-earth.controls.js",
    requiredExport: "bindHEarthControls"
  }
]);

const state = {
  contract: CONTRACT,
  seedPacket: SEED_PACKET,
  route: ROUTE,
  planet: PLANET,
  planetMeaning: PLANET_MEANING,
  generation: GENERATION,
  routeDoorway: "active",
  parentCoreChain: "checking",
  graphicBox: "forbidden",
  imageGeneration: "forbidden",
  visualPassClaim: false,
  earthMutation: "forbidden",
  hearthMutation: "forbidden",
  audraliaMutation: "forbidden",
  australiaTerminology: "forbidden",
  modules: {},
  loadedCount: 0,
  missingCount: 0,
  readyForCanvas: false,
  readyForControls: false
};

function getStatusTarget() {
  return document.getElementById("hEarthStatusTarget");
}

function getMount() {
  return document.getElementById("hEarthCanvasMount");
}

function getReceiptPanel() {
  return document.getElementById("hEarthReceiptPanel");
}

function stampDocumentReceipts() {
  document.documentElement.dataset.routeDoorwayContract = CONTRACT;
  document.documentElement.dataset.routeDoorwayStatus = "active";
  document.documentElement.dataset.parentCoreChainStatus = "checking";
  document.documentElement.dataset.hEarthReceipt = CONTRACT;
  document.documentElement.dataset.hEarthSeedPacket = SEED_PACKET;
  document.documentElement.dataset.graphicBox = "forbidden";
  document.documentElement.dataset.imageGeneration = "forbidden";
  document.documentElement.dataset.visualPassClaim = "false";
  document.documentElement.dataset.australiaTerminology = "forbidden";
}

function createCodeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function publishStatus(message, extraLines = []) {
  const target = getStatusTarget();
  if (!target) return;

  target.dataset.currentStatus = message;
  target.dataset.routeDoorway = "active";
  target.dataset.routeDoorwayContract = CONTRACT;
  target.dataset.parentCoreChain = state.parentCoreChain;

  target.replaceChildren(
    createCodeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    createCodeLine(`SEED_PACKET: ${SEED_PACKET}`),
    createCodeLine(`STATUS: ${message}`),
    ...extraLines.map(createCodeLine)
  );
}

function publishReceiptPanel() {
  const panel = getReceiptPanel();
  if (!panel) return;

  const moduleLines = MODULES.map((entry) => {
    const status = state.modules[entry.key]?.status || "pending";
    return `${entry.key.toUpperCase()}: ${status} · ${entry.path}`;
  });

  panel.dataset.receiptDoorway = CONTRACT;
  panel.dataset.parentCoreChain = state.parentCoreChain;
  panel.dataset.loadedModules = String(state.loadedCount);
  panel.dataset.missingModules = String(state.missingCount);

  panel.replaceChildren(
    createCodeLine(`H_EARTH_IDENTITY: separate experimental third-planet lane`),
    createCodeLine(`ROUTE_AUTHORITY: doorway only`),
    createCodeLine(`ROUTE_DOORWAY_RECEIPT: ${CONTRACT}`),
    createCodeLine(`PARENT_CORE_CHAIN_STATUS: ${state.parentCoreChain}`),
    createCodeLine(`LOADED_MODULES: ${state.loadedCount}`),
    createCodeLine(`MISSING_OR_PENDING_MODULES: ${state.missingCount}`),
    createCodeLine(`GRAPHIC_BOX: FORBIDDEN`),
    createCodeLine(`IMAGE_GENERATION: FORBIDDEN`),
    createCodeLine(`VISUAL_PASS_CLAIM: FALSE`),
    ...moduleLines.map(createCodeLine)
  );
}

function markMountAwaitingChain() {
  const mount = getMount();
  if (!mount) return;

  mount.dataset.routeMount = "doorway-active-awaiting-parent-core-chain";
  mount.dataset.routeDoorwayContract = CONTRACT;
  mount.dataset.parentCoreChain = state.parentCoreChain;
  mount.dataset.canvasAuthority = "external-module-required";
  mount.dataset.planetTruthOwner = "parent-core-chain";

  const badge = document.createElement("div");
  badge.setAttribute("aria-hidden", "true");
  badge.style.position = "absolute";
  badge.style.left = "50%";
  badge.style.top = "50%";
  badge.style.width = "min(84%, 360px)";
  badge.style.transform = "translate(-50%, -50%)";
  badge.style.padding = "14px 16px";
  badge.style.border = "1px solid rgba(244, 191, 96, 0.34)";
  badge.style.borderRadius = "999px";
  badge.style.background = "rgba(5, 9, 18, 0.78)";
  badge.style.color = "#f6ead2";
  badge.style.textAlign = "center";
  badge.style.font = "700 0.88rem Inter, system-ui, sans-serif";
  badge.style.letterSpacing = "0.035em";
  badge.textContent = "H-Earth doorway active · parent-core modules pending";

  mount.replaceChildren(badge);
}

async function tryImportModule(entry) {
  try {
    const imported = await import(`${entry.path}?v=${CONTRACT}`);

    if (!imported || typeof imported[entry.requiredExport] !== "function") {
      state.modules[entry.key] = {
        status: "loaded-export-missing",
        path: entry.path,
        requiredExport: entry.requiredExport
      };
      return null;
    }

    state.modules[entry.key] = {
      status: "loaded",
      path: entry.path,
      requiredExport: entry.requiredExport,
      module: imported
    };

    state.loadedCount += 1;
    return imported;
  } catch (error) {
    state.modules[entry.key] = {
      status: "not-yet-available",
      path: entry.path,
      requiredExport: entry.requiredExport,
      reason: error instanceof Error ? error.message : String(error)
    };

    state.missingCount += 1;
    return null;
  }
}

async function loadParentCoreChain() {
  publishStatus("route doorway active; checking parent-core chain");
  markMountAwaitingChain();

  for (const entry of MODULES) {
    await tryImportModule(entry);
    publishReceiptPanel();
  }

  const loadedKeys = Object.entries(state.modules)
    .filter(([, record]) => record.status === "loaded")
    .map(([key]) => key);

  const hasKernel = loadedKeys.includes("kernel");
  const hasLattice = loadedKeys.includes("lattice256");
  const hasLandmap = loadedKeys.includes("landmap");
  const hasTerrain = loadedKeys.includes("terrain");
  const hasSurface = loadedKeys.includes("surface");
  const hasCanvas = loadedKeys.includes("canvas");
  const hasControls = loadedKeys.includes("controls");

  state.readyForCanvas = hasKernel && hasLattice && hasLandmap && hasTerrain && hasSurface && hasCanvas;
  state.readyForControls = state.readyForCanvas && hasControls;

  if (!hasKernel) {
    state.parentCoreChain = "doorway-active-kernel-pending";
    document.documentElement.dataset.parentCoreChainStatus = state.parentCoreChain;
    publishStatus("route doorway active; kernel parent core pending", [
      `NEXT_REQUIRED_FILE: /assets/h-earth/h-earth.kernel.js`,
      `ACCESS_NOTE: direct route should now expose the H-Earth shell at ${ROUTE}`,
      `PARENT_ACCESS_NOTE: Globe Split still needs a separate access bridge if it does not link to H-Earth`
    ]);
    publishReceiptPanel();
    return;
  }

  if (!state.readyForCanvas) {
    state.parentCoreChain = "partial-parent-chain-loaded";
    document.documentElement.dataset.parentCoreChainStatus = state.parentCoreChain;
    publishStatus("route doorway active; parent-core chain partially loaded", [
      `LOADED_MODULES: ${state.loadedCount}`,
      `PENDING_MODULES: ${state.missingCount}`,
      `CANVAS_DELEGATION: held until surface and canvas modules are available`
    ]);
    publishReceiptPanel();
    return;
  }

  state.parentCoreChain = "ready-for-canvas-delegation";
  document.documentElement.dataset.parentCoreChainStatus = state.parentCoreChain;
  publishStatus("route doorway active; ready for canvas delegation", [
    `CANVAS_AUTHORITY: /assets/h-earth/h-earth.canvas.js`,
    `CONTROLS_AUTHORITY: /assets/h-earth/h-earth.controls.js`
  ]);
  publishReceiptPanel();

  await delegateCanvasAndControls();
}

async function delegateCanvasAndControls() {
  const mount = getMount();
  if (!mount) return;

  const canvasRecord = state.modules.canvas;
  const controlsRecord = state.modules.controls;

  if (!canvasRecord || canvasRecord.status !== "loaded") return;

  const canvasModule = canvasRecord.module;
  const surfaceModule = state.modules.surface?.module;
  const terrainModule = state.modules.terrain?.module;
  const landmapModule = state.modules.landmap?.module;
  const latticeModule = state.modules.lattice256?.module;
  const kernelModule = state.modules.kernel?.module;

  const context = {
    contract: CONTRACT,
    seedPacket: SEED_PACKET,
    route: ROUTE,
    planet: PLANET,
    planetMeaning: PLANET_MEANING,
    generation: GENERATION,
    mount,
    modules: {
      kernel: kernelModule,
      lattice256: latticeModule,
      landmap: landmapModule,
      terrain: terrainModule,
      surface: surfaceModule
    },
    prohibitions: {
      graphicBox: true,
      imageGeneration: true,
      australiaTerminology: true,
      visualPassClaim: true,
      earthMutation: true,
      hearthMutation: true,
      audraliaMutation: true
    }
  };

  const mounted = await canvasModule.mountHEarthCanvas(context);

  if (controlsRecord && controlsRecord.status === "loaded") {
    const controlsModule = controlsRecord.module;
    if (mounted && typeof controlsModule.bindHEarthControls === "function") {
      await controlsModule.bindHEarthControls({
        ...context,
        canvasReturn: mounted
      });
    }
  }
}

function boot() {
  stampDocumentReceipts();
  publishStatus("route doorway active; boot started");
  publishReceiptPanel();
  markMountAwaitingChain();
  loadParentCoreChain();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  SEED_PACKET,
  ROUTE,
  MODULES
};
