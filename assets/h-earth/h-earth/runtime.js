// /assets/h-earth/h-earth/runtime.js
// H_EARTH_G1_FIBONACCI_NODAL_RUNTIME_GOVERNOR_TNT_v17
// Full-file replacement.
// H-Earth runtime governor only.
//
// Purpose:
// - Stabilize the private H-Earth room.
// - Prevent repeated import storms.
// - Prevent repeated boot loops.
// - Batch receipt updates.
// - Cap device pixel ratio for mobile safety.
// - Pause nonessential work when page is hidden.
// - Keep parent truth immutable.
// - Let route doorway stay thin.
// - Let canvas/orbital engines render through a governed boot sequence.
// - Bind the 256 nodal construct into runtime context.
// - Bind Fibonacci progression into runtime context without replacing parent truth.
// - Pass Fibonacci nodal context downstream to canvas/orbital children.
// - Keep Fibonacci internal unless a child explicitly chooses to express it lawfully.
//
// Owns:
// - runtime boot order
// - module import cache
// - parent instance creation
// - child activation
// - receipt batching
// - resize scheduling
// - visibility pause state
// - runtime status API
// - 256 nodal runtime context
// - Fibonacci runtime progression context
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - orbital surface drawing truth
// - ground-level mode
// - estate placement
// - generated images
// - GraphicBox
// - visual pass claim

const CONTRACT = "H_EARTH_G1_FIBONACCI_NODAL_RUNTIME_GOVERNOR_TNT_v17";
const PREVIOUS_CONTRACT = "H_EARTH_G1_PERFORMANCE_RUNTIME_GOVERNOR_TNT_v16A";
const PAIR_CONTRACT = "H_EARTH_G1_FIBONACCI_NODAL_RUNTIME_GOVERNOR_PAIR_TNT_v17";
const ROUTE_CONTRACT_EXPECTED = "H_EARTH_G1_RUNTIME_GOVERNED_PRIVATE_ROOM_ROUTE_TNT_v16B";
const PREVIOUS_RUNTIMELESS_ROUTE = "H_EARTH_G1_PRIVATE_ORBITAL_BUILD_ROOM_RESTORE_ROUTE_TNT_v15";

const PLANET = "H-Earth";
const ROUTE = "/showroom/globe/h-earth/";
const BUILD_MODE = "orbital-aerial-first";

const CACHE_KEY = "2026-05-11-h-earth-fibonacci-nodal-runtime-governor-v17";

const TOTAL_NODES = 256;
const GRID = 16;
const FIBONACCI_SEQUENCE = Object.freeze([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

const MASTER_PSALM_RECEIPT = "MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_RECEIPT_v1";
const MASTER_PSALM_CONTRACT = "MASTER_PSALM_FIBONACCI_256_CANONICAL_BINDING_v1";

const NODAL_CONSTRUCT = Object.freeze({
  nodeCount: TOTAL_NODES,
  grid,
  gridLabel: "16x16",
  fixedField: true,
  parentTruthPreserved: true,
  fibonacciReplacesField: false,
  fibonacciVisibleZigzag: false,
  fibonacciSequence: FIBONACCI_SEQUENCE
});

const LEAP_PROTOCOL = Object.freeze({
  contract: "LEAP_PROTOCOL",
  learn: "Name the actual gap.",
  evidence: "Confirm the controlling facts.",
  assemble: "Build the admissible solution chain.",
  progress: "Execute only the next lawful move."
});

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

const MODULES = Object.freeze({
  parent: [
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
  ],
  child: [
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
  ]
});

const HELD = Object.freeze({
  orbitalControls: "/assets/h-earth/h-earth/orbital.build.controls.js",
  groundLevel: "/assets/h-earth/h-earth/ground/",
  estatePlacement: "/assets/h-earth/h-earth/estate/"
});

const governor = {
  bootPromise: null,
  importCache: new Map(),
  resizeTimer: 0,
  receiptTimer: 0,
  guardsInstalled: false,
  visibilityPaused: document.visibilityState === "hidden",
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  maxDevicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
  mount: null,
  receiptPanel: null,
  routeContext: null,
  fibonacciNodalContext: null
};

const state = {
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  pairContract: PAIR_CONTRACT,
  expectedRouteContract: ROUTE_CONTRACT_EXPECTED,
  previousRuntimelessRoute: PREVIOUS_RUNTIMELESS_ROUTE,
  route: ROUTE,
  planet: PLANET,
  buildMode: BUILD_MODE,
  cacheKey: CACHE_KEY,

  masterPsalmContract: MASTER_PSALM_CONTRACT,
  masterPsalmReceipt: MASTER_PSALM_RECEIPT,
  leapProtocol: LEAP_PROTOCOL,

  nodalConstructBound: true,
  fibonacciRuntimeBound: true,
  fibonacciSequence: FIBONACCI_SEQUENCE,
  fibonacciVisibleZigzag: false,
  fibonacciReplacesField: false,

  status: "not-started",
  booted: false,
  bootStartedAt: null,
  bootCompletedAt: null,

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

  parentChainReady: false,
  canvasIndexReady: false,
  terrainElevationReady: false,
  orbitalSurfaceReady: false,

  groundLevelReady: false,
  estatePlacementReady: false,
  parentMutationAuthorized: false,
  visualPassClaim: false,
  generatedImage: false,
  graphicBox: false,

  errors: []
};

function isObject(value) {
  return value !== null && typeof value === "object";
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordError(label, error) {
  state.errors.push({
    label,
    message: safeError(error),
    at: new Date().toISOString()
  });
}

function stableModuleUrl(path) {
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

function byId(id) {
  return document.getElementById(id);
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resolveMount(context = {}) {
  return (
    context.mount ||
    byId("hEarthCanvasCompositionMount") ||
    document.querySelector("[data-h-earth-canvas-mount]") ||
    document.querySelector("[data-h-earth-private-room-mount]") ||
    document.querySelector("main") ||
    document.body
  );
}

function resolveReceiptPanel(context = {}) {
  return (
    context.receiptPanel ||
    byId("hEarthReceiptPanel") ||
    document.querySelector("[data-receipt-panel='h-earth-private-orbital-room']") ||
    null
  );
}

function fibonacciForNode(index) {
  const normalized = ((Number(index) % TOTAL_NODES) + TOTAL_NODES) % TOTAL_NODES;
  const row = Math.floor(normalized / GRID);
  const col = normalized % GRID;
  const value = FIBONACCI_SEQUENCE[normalized % FIBONACCI_SEQUENCE.length];
  const next = FIBONACCI_SEQUENCE[(normalized + 1) % FIBONACCI_SEQUENCE.length];
  const rowFib = FIBONACCI_SEQUENCE[row % FIBONACCI_SEQUENCE.length];
  const colFib = FIBONACCI_SEQUENCE[col % FIBONACCI_SEQUENCE.length];

  return {
    index: normalized,
    row,
    col,
    value,
    next,
    rowFib,
    colFib,
    ratio: value / next,
    density: clamp(value / 233, 0.004, 1),
    phase: ((value % GRID) / GRID) * Math.PI * 2,
    drift: ((next % GRID) / GRID) * Math.PI * 2,
    harmonic: Math.sin((value + rowFib + colFib) * 0.0618),
    fold: Math.cos((value * rowFib + colFib) * 0.017),
    visibleZigzag: false,
    replacesParentTruth: false
  };
}

function createFibonacciNodalContext() {
  const nodes = [];

  for (let index = 0; index < TOTAL_NODES; index += 1) {
    nodes.push(fibonacciForNode(index));
  }

  const checksum = nodes.reduce((sum, node) => {
    return sum + node.value + node.rowFib + node.colFib + Math.round(node.density * 1000);
  }, 0);

  return Object.freeze({
    contract: CONTRACT,
    masterPsalmContract: MASTER_PSALM_CONTRACT,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    nodeCount: TOTAL_NODES,
    grid: GRID,
    gridLabel: `${GRID}x${GRID}`,
    sequence: FIBONACCI_SEQUENCE,
    nodes: Object.freeze(nodes),
    checksum,
    fixedField: true,
    parentTruthPreserved: true,
    parentMutationAuthorized: false,
    fibonacciRuntimeBound: true,
    fibonacciReplacesField: false,
    fibonacciVisibleZigzag: false,
    runtimeUse: "internal traversal rhythm, elevation rhythm, coastline rhythm, detail-density priority, and lawful refinement order",
    leapProtocol: LEAP_PROTOCOL,

    getNode(index) {
      const numericIndex = Number(index);
      if (!Number.isInteger(numericIndex)) return null;
      return nodes[((numericIndex % TOTAL_NODES) + TOTAL_NODES) % TOTAL_NODES];
    },

    getSequence() {
      return [...FIBONACCI_SEQUENCE];
    }
  });
}

function getFibonacciNodalContext() {
  if (!governor.fibonacciNodalContext) {
    governor.fibonacciNodalContext = createFibonacciNodalContext();
  }

  return governor.fibonacciNodalContext;
}

function stampDocument() {
  const root = document.documentElement;
  const fibonacciContext = getFibonacciNodalContext();

  root.dataset.hEarthRuntimeReceipt = CONTRACT;
  root.dataset.hEarthRuntimePreviousReceipt = PREVIOUS_CONTRACT;
  root.dataset.hEarthRuntimePairReceipt = PAIR_CONTRACT;
  root.dataset.hEarthRuntimeStatus = state.status;
  root.dataset.hEarthRuntimeCacheKey = CACHE_KEY;
  root.dataset.hEarthRuntimeBooted = String(state.booted);
  root.dataset.hEarthRuntimePaused = String(governor.visibilityPaused);
  root.dataset.hEarthRuntimeReducedMotion = String(governor.reducedMotion);
  root.dataset.hEarthRuntimeDprCap = String(governor.maxDevicePixelRatio);

  root.dataset.hEarthMasterPsalmContract = MASTER_PSALM_CONTRACT;
  root.dataset.hEarthMasterPsalmReceipt = MASTER_PSALM_RECEIPT;
  root.dataset.hEarthLeapProtocol = "Learn-Evidence-Assemble-Progress";

  root.dataset.hEarthBuildMode = BUILD_MODE;
  root.dataset.hEarthPrivateRoom = "true";
  root.dataset.hEarthParentChainReady = String(state.parentChainReady);
  root.dataset.hEarthCanvasIndexReady = String(state.canvasIndexReady);
  root.dataset.hEarthTerrainElevationReady = String(state.terrainElevationReady);
  root.dataset.hEarthOrbitalSurfaceReady = String(state.orbitalSurfaceReady);

  root.dataset.hEarthNodalConstructBound = "true";
  root.dataset.hEarthNodalConstructNodeCount = String(TOTAL_NODES);
  root.dataset.hEarthNodalConstructGrid = `${GRID}x${GRID}`;
  root.dataset.hEarthFibonacciRuntimeBound = "true";
  root.dataset.hEarthFibonacciSequence = FIBONACCI_SEQUENCE.join(",");
  root.dataset.hEarthFibonacciChecksum = String(fibonacciContext.checksum);
  root.dataset.hEarthFibonacciVisibleZigzag = "false";
  root.dataset.hEarthFibonacciReplacesField = "false";

  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
}

function mountMessage(title, lines = []) {
  const mount = governor.mount;
  if (!mount) return;

  mount.dataset.hEarthRuntimeReceipt = CONTRACT;
  mount.dataset.hEarthRuntimeStatus = state.status;
  mount.dataset.hEarthNodalConstructBound = "true";
  mount.dataset.hEarthFibonacciRuntimeBound = "true";
  mount.dataset.hEarthParentMutationAuthorized = "false";
  mount.dataset.hEarthGroundLevelReady = "false";
  mount.dataset.hEarthEstatePlacementReady = "false";
  mount.dataset.hEarthVisualPassClaim = "false";

  if (mount.querySelector("[data-h-earth-orbital-panel]")) return;

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
  heading.style.marginBottom = lines.length ? "10px" : "0";
  shell.appendChild(heading);

  for (const line of lines) {
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

function scheduleReceiptPublish() {
  if (governor.receiptTimer) return;

  governor.receiptTimer = window.setTimeout(() => {
    governor.receiptTimer = 0;
    publishReceiptPanel();
  }, 80);
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
  const panel = governor.receiptPanel;
  if (!panel) return;

  const fibonacciContext = getFibonacciNodalContext();

  const parentLines = MODULES.parent.map((entry) => {
    const record = state.parentModules[entry.key];
    const status = record?.status || "pending";
    const expected = EXPECTED[entry.key];
    const actual = record?.actual || "pending";
    const stale = actual !== "pending" && expected && actual !== expected ? " · STALE_CONTRACT" : "";
    const error = record?.error ? ` · ${record.error}` : "";
    return `${entry.key.toUpperCase()}: ${status} · expected=${expected} · actual=${actual}${stale} · ${entry.path}${error}`;
  });

  const childLines = MODULES.child.map((entry) => {
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

  panel.dataset.hEarthRuntimeReceipt = CONTRACT;
  panel.dataset.hEarthRuntimePreviousReceipt = PREVIOUS_CONTRACT;
  panel.dataset.hEarthRuntimePairReceipt = PAIR_CONTRACT;
  panel.dataset.hEarthRuntimeStatus = state.status;
  panel.dataset.hEarthRuntimeBooted = String(state.booted);
  panel.dataset.hEarthRuntimePaused = String(governor.visibilityPaused);
  panel.dataset.hEarthParentChainReady = String(state.parentChainReady);
  panel.dataset.hEarthCanvasIndexReady = String(state.canvasIndexReady);
  panel.dataset.hEarthTerrainElevationReady = String(state.terrainElevationReady);
  panel.dataset.hEarthOrbitalSurfaceReady = String(state.orbitalSurfaceReady);
  panel.dataset.hEarthNodalConstructBound = "true";
  panel.dataset.hEarthFibonacciRuntimeBound = "true";
  panel.dataset.hEarthFibonacciChecksum = String(fibonacciContext.checksum);
  panel.dataset.hEarthGroundLevelReady = "false";
  panel.dataset.hEarthEstatePlacementReady = "false";
  panel.dataset.hEarthParentMutationAuthorized = "false";
  panel.dataset.hEarthVisualPassClaim = "false";

  panel.replaceChildren(
    codeLine(`RUNTIME_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_RUNTIME_RECEIPT: ${PREVIOUS_CONTRACT}`),
    codeLine(`PAIR_RECEIPT: ${PAIR_CONTRACT}`),
    codeLine(`MASTER_PSALM_CONTRACT: ${MASTER_PSALM_CONTRACT}`),
    codeLine(`MASTER_PSALM_RECEIPT: ${MASTER_PSALM_RECEIPT}`),
    codeLine(`LEAP_PROTOCOL: Learn · Evidence · Assemble · Progress`),
    codeLine(`EXPECTED_ROUTE: ${ROUTE_CONTRACT_EXPECTED}`),
    codeLine(`PREVIOUS_RUNTIMELESS_ROUTE: ${PREVIOUS_RUNTIMELESS_ROUTE}`),
    codeLine(`ROUTE: ${ROUTE}`),
    codeLine(`PLANET: ${PLANET}`),
    codeLine(`PRIVATE_ROOM: true`),
    codeLine(`BUILD_MODE: ${BUILD_MODE}`),
    codeLine(`RUNTIME_STATUS: ${state.status}`),
    codeLine(`RUNTIME_BOOTED: ${String(state.booted)}`),
    codeLine(`RUNTIME_PAUSED: ${String(governor.visibilityPaused)}`),
    codeLine(`RUNTIME_REDUCED_MOTION: ${String(governor.reducedMotion)}`),
    codeLine(`RUNTIME_DPR_CAP: ${String(governor.maxDevicePixelRatio)}`),
    codeLine(`NODAL_CONSTRUCT_BOUND: true`),
    codeLine(`NODAL_CONSTRUCT_GRID: ${GRID}x${GRID}`),
    codeLine(`NODAL_CONSTRUCT_NODE_COUNT: ${TOTAL_NODES}`),
    codeLine(`FIBONACCI_RUNTIME_BOUND: true`),
    codeLine(`FIBONACCI_SEQUENCE: ${FIBONACCI_SEQUENCE.join(",")}`),
    codeLine(`FIBONACCI_CHECKSUM: ${fibonacciContext.checksum}`),
    codeLine(`FIBONACCI_VISIBLE_ZIGZAG: false`),
    codeLine(`FIBONACCI_REPLACES_FIELD: false`),
    codeLine(`IMPORT_CACHE_SIZE: ${governor.importCache.size}`),
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
    codeLine(`VISUAL_PASS_CLAIM: false`),
    codeLine(`GENERATED_IMAGE: false`),
    codeLine(`GRAPHIC_BOX: false`)
  );
}

async function importOnce(entry) {
  const url = stableModuleUrl(entry.path);

  if (governor.importCache.has(url)) {
    return governor.importCache.get(url);
  }

  const promise = import(url).then((imported) => {
    if (!imported || typeof imported[entry.requiredExport] !== "function") {
      throw new Error(`required export missing: ${entry.requiredExport}`);
    }

    return imported;
  });

  governor.importCache.set(url, promise);
  return promise;
}

async function importModule(entry, bucket) {
  try {
    const imported = await importOnce(entry);
    const actual = receiptFrom(imported, imported.default);
    const expected = EXPECTED[entry.key];

    bucket[entry.key] = {
      status: "loaded",
      path: entry.path,
      requiredExport: entry.requiredExport,
      expected,
      actual,
      module: imported
    };

    if (expected && actual !== expected) state.staleContractCount += 1;

    scheduleReceiptPublish();
    return imported;
  } catch (error) {
    const message = safeError(error);

    bucket[entry.key] = {
      status: "failed",
      path: entry.path,
      requiredExport: entry.requiredExport,
      expected: EXPECTED[entry.key],
      actual: "import-failed",
      error: message
    };

    recordError(`import-${entry.key}`, error);
    scheduleReceiptPublish();
    return null;
  }
}

async function loadParentModules() {
  for (const entry of MODULES.parent) {
    state.status = `loading-parent-${entry.key}`;
    stampDocument();
    scheduleReceiptPublish();

    const imported = await importModule(entry, state.parentModules);

    if (!imported) {
      state.failedParentModules += 1;
      state.status = `parent-${entry.key}-failed`;
      stampDocument();
      scheduleReceiptPublish();
      mountMessage("Parent chain held", [`${entry.key} failed`, "Runtime stopped before child activation"]);
      return false;
    }

    state.loadedParentModules += 1;
  }

  return true;
}

function createRuntimeContext() {
  const fibonacciNodalContext = getFibonacciNodalContext();

  return {
    runtimeContract: CONTRACT,
    previousRuntimeContract: PREVIOUS_CONTRACT,
    pairContract: PAIR_CONTRACT,
    masterPsalmContract: MASTER_PSALM_CONTRACT,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    leapProtocol: LEAP_PROTOCOL,

    doorwayContract: ROUTE_CONTRACT_EXPECTED,
    routeDoorwayContract: ROUTE_CONTRACT_EXPECTED,
    priorDoorwayContract: PREVIOUS_RUNTIMELESS_ROUTE,
    priorRouteDoorwayContract: PREVIOUS_RUNTIMELESS_ROUTE,

    route: ROUTE,
    planet: PLANET,
    privateRoom: true,
    buildMode: BUILD_MODE,
    runtimeGoverned: true,

    nodalConstruct: NODAL_CONSTRUCT,
    fibonacciNodalContext,
    fibonacciRuntimeBound: true,
    fibonacciSequence: FIBONACCI_SEQUENCE,
    fibonacciVisibleZigzag: false,
    fibonacciReplacesField: false,

    canvasIndexChildReceiver: true,
    orbitalBuildSurface: true,

    groundLevelReady: false,
    estatePlacementReady: false,
    mutationAuthorized: false,
    parentMutationAuthorized: false,
    controlsAuthorized: false,
    motionAuthorized: false,
    inputAuthorized: false
  };
}

function createParentInstances() {
  try {
    const runtimeContext = createRuntimeContext();

    const kernelModule = state.parentModules.kernel.module;
    const latticeModule = state.parentModules.lattice256.module;
    const landmapModule = state.parentModules.landmap.module;
    const terrainModule = state.parentModules.terrain.module;
    const surfaceModule = state.parentModules.surface.module;

    const kernel = kernelModule.createHEarthKernel(runtimeContext);
    const lattice256 = latticeModule.createHEarthLattice256({ kernel, ...runtimeContext });
    const landmap = landmapModule.createHEarthLandmap({ kernel, lattice256, ...runtimeContext });
    const terrain = terrainModule.createHEarthTerrain({ kernel, lattice256, landmap, ...runtimeContext });
    const surface = surfaceModule.createHEarthSurface({ kernel, lattice256, landmap, terrain, ...runtimeContext });

    state.parentInstances = {
      kernel,
      lattice256,
      landmap,
      terrain,
      surface
    };

    window.H_EARTH_ROUTE_PARENT_INSTANCES = state.parentInstances;
    window.H_EARTH_RUNTIME_PARENT_INSTANCES = state.parentInstances;
    window.H_EARTH_FIBONACCI_NODAL_CONTEXT = getFibonacciNodalContext();
    window.H_EARTH_ROUTE_PARENT_INSTANCE_CONTEXT = {
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      ...runtimeContext,
      readOnly: true
    };

    state.parentChainReady = true;
    state.status = "parent-chain-ready";
    stampDocument();
    scheduleReceiptPublish();

    return true;
  } catch (error) {
    recordError("create-parent-instances", error);
    state.status = "parent-instance-create-failed";
    stampDocument();
    scheduleReceiptPublish();
    mountMessage("Parent instance failed", ["Modules loaded", "Factory chain failed"]);
    return false;
  }
}

async function activateCanvasIndex() {
  const entry = MODULES.child.find((module) => module.key === "canvasIndex");
  state.status = "loading-canvas-index";
  stampDocument();
  scheduleReceiptPublish();

  const imported = await importModule(entry, state.childModules);

  if (!imported) {
    state.failedChildModules += 1;
    state.status = "canvas-index-import-failed";
    stampDocument();
    scheduleReceiptPublish();
    mountMessage("Canvas index held", ["Nested canvas index failed to import"]);
    return false;
  }

  state.loadedChildModules += 1;

  try {
    const runtimeContext = createRuntimeContext();

    const layer = imported.createHEarthCanvasLayer({
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      ...runtimeContext,
      readOnly: true
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
    const terrainElevationReceipt =
      state.canvasLayerStatus?.terrainElevationReceipt ||
      state.canvasLayerStatus?.children?.terrainElevation?.contract ||
      layer?.children?.terrainElevation?.contract ||
      "missing";

    state.childModules.canvasIndex.actual = actual;

    if (actual !== EXPECTED.canvasIndex) state.staleContractCount += 1;
    if (terrainElevationReceipt !== EXPECTED.terrainElevation) state.staleContractCount += 1;

    state.canvasIndexReady = actual === EXPECTED.canvasIndex;
    state.terrainElevationReady = terrainElevationReceipt === EXPECTED.terrainElevation;
    state.status = "canvas-index-ready";

    window.H_EARTH_CANVAS_LAYER = layer;

    stampDocument();
    scheduleReceiptPublish();

    return true;
  } catch (error) {
    recordError("activate-canvas-index", error);
    state.status = "canvas-index-activation-failed";
    stampDocument();
    scheduleReceiptPublish();
    mountMessage("Canvas index failed", ["Canvas receiver did not activate"]);
    return false;
  }
}

async function activateOrbitalSurface() {
  const entry = MODULES.child.find((module) => module.key === "orbitalSurface");
  state.status = "loading-orbital-surface";
  stampDocument();
  scheduleReceiptPublish();

  const imported = await importModule(entry, state.childModules);

  if (!imported) {
    state.failedChildModules += 1;
    state.status = "orbital-surface-import-failed";
    stampDocument();
    scheduleReceiptPublish();
    mountMessage("Orbital surface held", ["Orbital build surface failed to import"]);
    return false;
  }

  state.loadedChildModules += 1;

  try {
    const runtimeContext = createRuntimeContext();

    const status = await imported.bootHEarthOrbitalBuildSurface({
      instances: state.parentInstances,
      parentInstances: state.parentInstances,
      canvasLayer: state.canvasLayer,
      interactionTarget: "planet-surface-view",
      readOnly: true,
      maxDevicePixelRatio: governor.maxDevicePixelRatio,
      reducedMotion: governor.reducedMotion,
      ...runtimeContext
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

    state.orbitalSurfaceReady =
      actual === EXPECTED.orbitalSurface &&
      (
        state.orbitalSurfaceStatus?.orbitalBuildSurfaceReady === true ||
        state.orbitalSurfaceStatus?.status === "orbital-build-surface-rendered"
      );

    state.status = state.orbitalSurfaceReady
      ? "runtime-governed-private-room-active"
      : "runtime-governed-private-room-orbital-surface-held";

    stampDocument();
    scheduleReceiptPublish();

    return true;
  } catch (error) {
    recordError("activate-orbital-surface", error);
    state.status = "orbital-surface-activation-failed";
    stampDocument();
    scheduleReceiptPublish();
    mountMessage("Orbital surface failed", ["Surface child failed during governed boot"]);
    return false;
  }
}

function handleVisibilityChange() {
  governor.visibilityPaused = document.visibilityState === "hidden";
  stampDocument();
  scheduleReceiptPublish();
}

function handleResize() {
  window.clearTimeout(governor.resizeTimer);

  governor.resizeTimer = window.setTimeout(() => {
    governor.resizeTimer = 0;

    if (governor.visibilityPaused) return;

    const orbitalApi = window.H_EARTH_ORBITAL_BUILD_SURFACE || window.HEarthOrbitalBuildSurface || null;

    if (typeof orbitalApi?.refreshView === "function") {
      orbitalApi.refreshView();
    } else if (typeof orbitalApi?.refreshHEarthOrbitalBuildSurfaceView === "function") {
      orbitalApi.refreshHEarthOrbitalBuildSurfaceView();
    }

    scheduleReceiptPublish();
  }, 180);
}

function installGuards() {
  if (governor.guardsInstalled) return;

  governor.guardsInstalled = true;
  document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
}

async function bootHEarthRuntime(context = {}) {
  if (governor.bootPromise) return governor.bootPromise;

  governor.bootPromise = (async () => {
    governor.routeContext = context;
    governor.mount = resolveMount(context);
    governor.receiptPanel = resolveReceiptPanel(context);
    governor.fibonacciNodalContext = createFibonacciNodalContext();

    state.bootStartedAt = new Date().toISOString();
    state.status = "runtime-booting";
    state.booted = false;

    installGuards();
    stampDocument();
    scheduleReceiptPublish();

    mountMessage("Runtime governor active", [
      "256 nodal field locked",
      "Fibonacci runtime bound",
      "imports cached",
      "parent mutation forbidden"
    ]);

    const parentsLoaded = await loadParentModules();
    if (!parentsLoaded) return getHEarthRuntimeStatus();

    const parentInstancesCreated = createParentInstances();
    if (!parentInstancesCreated) return getHEarthRuntimeStatus();

    const canvasIndexReady = await activateCanvasIndex();
    if (!canvasIndexReady) return getHEarthRuntimeStatus();

    const orbitalSurfaceReady = await activateOrbitalSurface();
    if (!orbitalSurfaceReady) return getHEarthRuntimeStatus();

    state.booted = true;
    state.bootCompletedAt = new Date().toISOString();
    state.status = state.orbitalSurfaceReady
      ? "runtime-governed-private-room-active"
      : "runtime-governed-private-room-active-with-held-orbital-proof";

    stampDocument();
    publishReceiptPanel();

    return getHEarthRuntimeStatus();
  })();

  return governor.bootPromise;
}

function getHEarthRuntimeStatus() {
  const canvasStatus = state.canvasLayerStatus;
  const canvasSummary = canvasStatus?.summary || state.canvasLayer?.summary || {};
  const orbitalStatus = state.orbitalSurfaceStatus || {};
  const fibonacciContext = getFibonacciNodalContext();

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    pairContract: PAIR_CONTRACT,
    expectedRouteContract: ROUTE_CONTRACT_EXPECTED,
    previousRuntimelessRoute: PREVIOUS_RUNTIMELESS_ROUTE,
    route: ROUTE,
    planet: PLANET,
    buildMode: BUILD_MODE,
    cacheKey: CACHE_KEY,

    masterPsalmContract: MASTER_PSALM_CONTRACT,
    masterPsalmReceipt: MASTER_PSALM_RECEIPT,
    leapProtocol: LEAP_PROTOCOL,

    status: state.status,
    booted: state.booted,
    bootStartedAt: state.bootStartedAt,
    bootCompletedAt: state.bootCompletedAt,

    visibilityPaused: governor.visibilityPaused,
    reducedMotion: governor.reducedMotion,
    maxDevicePixelRatio: governor.maxDevicePixelRatio,
    importCacheSize: governor.importCache.size,

    loadedParentModules: state.loadedParentModules,
    failedParentModules: state.failedParentModules,
    loadedChildModules: state.loadedChildModules,
    failedChildModules: state.failedChildModules,
    staleContractCount: state.staleContractCount,

    parentChainReady: state.parentChainReady,
    canvasIndexReady: state.canvasIndexReady,
    terrainElevationReady: state.terrainElevationReady,
    orbitalSurfaceReady: state.orbitalSurfaceReady,

    nodalConstructBound: true,
    nodalConstruct: {
      nodeCount: TOTAL_NODES,
      grid: `${GRID}x${GRID}`,
      fixedField: true,
      parentTruthPreserved: true
    },

    fibonacciRuntimeBound: true,
    fibonacciSequence: [...FIBONACCI_SEQUENCE],
    fibonacciChecksum: fibonacciContext.checksum,
    fibonacciVisibleZigzag: false,
    fibonacciReplacesField: false,
    fibonacciUse: fibonacciContext.runtimeUse,

    canvasIndexReceipt: state.canvasLayer?.contract || "pending",
    terrainElevationReceipt:
      canvasStatus?.terrainElevationReceipt ||
      canvasStatus?.children?.terrainElevation?.contract ||
      "pending",
    canvasLayerReady: canvasSummary.canvasLayerReady ?? false,
    groundLevelCandidateCells: canvasSummary.groundLevelCandidateCells ?? "pending",

    orbitalSurfaceReceipt: orbitalStatus.contract || orbitalStatus.receipt || "pending",
    orbitalSurfaceStatus: orbitalStatus.status || "pending",
    orbitalBuildSurfaceReady: orbitalStatus.orbitalBuildSurfaceReady ?? false,

    groundLevelReady: false,
    estatePlacementReady: false,
    parentMutationAuthorized: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,

    errors: [...state.errors]
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    pairContract: PAIR_CONTRACT,

    boot: bootHEarthRuntime,
    bootHEarthRuntime,

    status: getHEarthRuntimeStatus,
    getStatus: getHEarthRuntimeStatus,
    getHEarthRuntimeStatus,

    getFibonacciNodalContext,
    fibonacciForNode
  };

  window.DGBHEarthRuntime = api;
  window.HEarthRuntime = api;
  window.H_EARTH_RUNTIME = api;
  window.H_EARTH_RUNTIME_RECEIPT = CONTRACT;
  window.H_EARTH_FIBONACCI_NODAL_CONTEXT = getFibonacciNodalContext();
}

exposeApi();

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  PAIR_CONTRACT,
  ROUTE_CONTRACT_EXPECTED,
  PREVIOUS_RUNTIMELESS_ROUTE,
  ROUTE,
  BUILD_MODE,
  CACHE_KEY,
  TOTAL_NODES,
  GRID,
  FIBONACCI_SEQUENCE,
  MASTER_PSALM_CONTRACT,
  MASTER_PSALM_RECEIPT,
  LEAP_PROTOCOL,
  NODAL_CONSTRUCT,
  EXPECTED,
  MODULES,
  bootHEarthRuntime,
  getHEarthRuntimeStatus,
  getFibonacciNodalContext,
  fibonacciForNode
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  pairContract: PAIR_CONTRACT,
  boot: bootHEarthRuntime,
  bootHEarthRuntime,
  status: getHEarthRuntimeStatus,
  getStatus: getHEarthRuntimeStatus,
  getHEarthRuntimeStatus,
  getFibonacciNodalContext,
  fibonacciForNode
};
