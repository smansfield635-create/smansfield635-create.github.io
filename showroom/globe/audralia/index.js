// /showroom/globe/audralia/index.js
// AUDRALIA_G2_5_FREE_DRAG_POLE_SWIVEL_ROUTE_TNT_v1
// Full-file replacement.
// Route imports controls, creates controlled runtime proxy, mounts canvas with that proxy.
// Runtime remains motion-only.
// Controls own drag, spin, and pole swivel.
// Canvas draws and consumes controlled motion.
// No GraphicBox. No generated image. No visual-pass claim.

const ROUTE_CONTRACT = "AUDRALIA_G2_5_FREE_DRAG_POLE_SWIVEL_ROUTE_TNT_v1";
const ROUTE_RECEIPT = "AUDRALIA_G2_5_FREE_DRAG_POLE_SWIVEL_ROUTE_RECEIPT";
const PREVIOUS_ROUTE_CONTRACT = "AUDRALIA_G2_4_ASSET_AND_ROUTE_EXPECTATION_ALIGNMENT_ROUTE_TNT_v1";
const CACHE_KEY = "audralia-g2-5-free-drag-pole-swivel-controls-v1";

const PATHS = Object.freeze({
  runtime: "/assets/audralia/audralia.runtime.js",
  controls: "/assets/audralia/audralia.controls.js",
  surface: "/assets/audralia/audralia.surface.js",
  hexSurface: "/assets/audralia/audralia.hex.surface.js",
  reliefSurface: "/assets/audralia/audralia.relief.surface.js",
  terrainFingers: "/assets/audralia/audralia.terrain.fingers.js",
  assets: "/assets/audralia/audralia.assets.js",
  canvas: "/assets/audralia/audralia.canvas.js"
});

const EXPECTED = Object.freeze({
  runtime: "AUDRALIA_RUNTIME_MOTION_ONLY_NO_VISUAL_SOVEREIGNTY_CONTRACT_v1",
  controls: "AUDRALIA_G2_5_FREE_DRAG_AND_POLE_SWIVEL_CONTROL_TNT_v1",
  terrainFingers: "AUDRALIA_G2_4_TERRAIN_FORMATION_DELTA_TNT_v1",
  assets: "AUDRALIA_G2_4_ASSET_FORMATION_MATERIAL_DELTA_TNT_v1",
  canvas: "AUDRALIA_G2_5_CANVAS_POLE_SWIVEL_CONSUMER_TNT_v1"
});

const ROUTE_STATE = {
  ok: false,
  contract: ROUTE_CONTRACT,
  receipt: ROUTE_RECEIPT,
  previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
  cacheKey: CACHE_KEY,
  imported: {},
  contracts: {},
  receipts: {},
  mountFound: false,
  canvasFound: false,
  canvasMounted: false,
  controlsLoaded: false,
  controlsBound: false,
  freeDrag: true,
  poleSwivel: true,
  physicalAxisDeg: 23.44,
  visualPassClaimed: false,
  generatedImage: false,
  graphicBox: false,
  errors: [],
  warnings: []
};

function $(selector) {
  return document.querySelector(selector);
}

function resolveMount() {
  return $("#audralia-canvas-mount") || $("[data-audralia-canvas-mount]") || $("#audralia-mount");
}

function resolveStatusNode() {
  return $("#audralia-route-status") || $("[data-audralia-route-status]") || $("#audralia-status");
}

function resolveCanvas() {
  const mount = resolveMount();
  return document.querySelector("canvas[data-audralia-canvas='true']") || (mount && mount.querySelector("canvas"));
}

function text(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function firstText(...values) {
  for (const value of values) {
    const next = text(value);
    if (next) return next;
  }

  return "";
}

function moduleStatus(module) {
  try {
    return (
      module.getStatus?.() ||
      module.getAudraliaCanvasStatus?.() ||
      module.getAudraliaAssetsStatus?.() ||
      module.getAudraliaTerrainFingerStatus?.() ||
      module.getAudraliaControlsStatus?.() ||
      module.AUDRALIA_CONTROLS_STATUS ||
      module.AUDRALIA_ASSETS_STATUS ||
      module.AUDRALIA_TERRAIN_FINGERS_STATUS ||
      {}
    );
  } catch (_) {
    return {};
  }
}

function moduleContract(module, fallback) {
  const status = moduleStatus(module);
  return firstText(module.CONTRACT, status.contract, module.default?.contract, fallback);
}

function moduleReceipt(module, fallback) {
  const status = moduleStatus(module);
  return firstText(
    module.RECEIPT,
    status.receipt,
    module.AUDRALIA_RUNTIME_RECEIPT_VALUE,
    module.AUDRALIA_CONTROLS_RECEIPT_VALUE,
    module.AUDRALIA_ASSETS_RECEIPT_VALUE,
    module.AUDRALIA_TERRAIN_FINGERS_RECEIPT_VALUE,
    module.default?.receipt,
    fallback
  );
}

function publish(status = "") {
  ROUTE_STATE.mountFound = Boolean(resolveMount());
  ROUTE_STATE.canvasFound = Boolean(resolveCanvas());

  document.documentElement.dataset.audraliaRouteContract = ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRoutePreviousContract = PREVIOUS_ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaRouteStatus = status || "checking";
  document.documentElement.dataset.audraliaCacheKey = CACHE_KEY;
  document.documentElement.dataset.audraliaFreeDrag = "true";
  document.documentElement.dataset.audraliaPoleSwivel = "true";
  document.documentElement.dataset.audraliaPhysicalAxisDeg = "23.44";
  document.documentElement.dataset.audraliaControlsBound = String(ROUTE_STATE.controlsBound);
  document.documentElement.dataset.audraliaRuntimeMotionOnly = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.AUDRALIA_ROUTE_CONTRACT = ROUTE_CONTRACT;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  writeStatus(status);
}

function writeStatus(status = "") {
  const node = resolveStatusNode();
  if (!node) return;

  const lines = [
    ROUTE_STATE.ok
      ? "Audralia free drag and pole swivel route ready."
      : "Audralia free drag and pole swivel route preparing.",
    `Status ${status || "checking"}`,
    `Route ${ROUTE_CONTRACT}`,
    `Receipt ${ROUTE_RECEIPT}`,
    `Previous ${PREVIOUS_ROUTE_CONTRACT}`,
    `Cache Key ${CACHE_KEY}`,
    `Runtime ${ROUTE_STATE.contracts.runtime || EXPECTED.runtime}`,
    `Controls ${ROUTE_STATE.contracts.controls || EXPECTED.controls}`,
    `Terrain ${ROUTE_STATE.contracts.terrainFingers || EXPECTED.terrainFingers}`,
    `Assets ${ROUTE_STATE.contracts.assets || EXPECTED.assets}`,
    `Canvas ${ROUTE_STATE.contracts.canvas || EXPECTED.canvas}`,
    `Mount found ${ROUTE_STATE.mountFound}`,
    `Canvas mounted ${ROUTE_STATE.canvasMounted}`,
    `Canvas found ${ROUTE_STATE.canvasFound}`,
    `Controls loaded ${ROUTE_STATE.controlsLoaded}`,
    `Controls bound ${ROUTE_STATE.controlsBound}`,
    `Free drag true`,
    `Pole swivel true`,
    `Physical axis 23.44deg`,
    `Runtime motion-only true`,
    `GraphicBox false`,
    `Generated image false`,
    `Visual pass claimed false`
  ];

  if (ROUTE_STATE.warnings.length) lines.push(`Warnings ${ROUTE_STATE.warnings.slice(-4).join(" | ")}`);
  if (ROUTE_STATE.errors.length) lines.push(`Errors ${ROUTE_STATE.errors.slice(-4).join(" | ")}`);

  node.textContent = lines.join("\n");
}

async function importModule(label, required = true) {
  const path = PATHS[label];

  try {
    const module = await import(`${path}?v=${encodeURIComponent(CACHE_KEY)}&route=${encodeURIComponent(ROUTE_CONTRACT)}&role=${encodeURIComponent(label)}`);

    ROUTE_STATE.imported[label] = true;
    ROUTE_STATE.contracts[label] = moduleContract(module, EXPECTED[label]);
    ROUTE_STATE.receipts[label] = moduleReceipt(module, ROUTE_STATE.contracts[label]);

    publish(`imported-${label}`);
    return module;
  } catch (error) {
    ROUTE_STATE.imported[label] = false;
    ROUTE_STATE.errors.push(`${label} import failed: ${String(error?.message || error || "unknown")}`);
    publish(`failed-${label}`);

    if (required) throw error;
    return null;
  }
}

function chooseMountFunction(canvasModule) {
  return (
    canvasModule.mountAudraliaCanvas ||
    canvasModule.renderAudraliaCanvas ||
    canvasModule.bootAudraliaCanvas ||
    canvasModule.createAudraliaCanvas ||
    canvasModule.initAudraliaCanvas ||
    canvasModule.mount ||
    canvasModule.default?.mountAudraliaCanvas ||
    canvasModule.default?.mount ||
    window.mountAudraliaCanvas
  );
}

async function waitForCanvas(timeoutMs = 8000) {
  const started = performance.now();

  return new Promise((resolve) => {
    const check = () => {
      const canvas = resolveCanvas();

      if (canvas) {
        resolve(canvas);
        return;
      }

      if (performance.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

function clearFallback() {
  const canvas = resolveCanvas();
  const fallback = document.querySelector("[data-audralia-mount-fallback]");

  if (canvas && fallback) {
    fallback.textContent = "";
    fallback.hidden = true;
  }
}

async function boot() {
  publish("booting");

  const mount = resolveMount();

  if (!mount) {
    ROUTE_STATE.errors.push("Canonical Audralia mount not found.");
    publish("missing-mount");
    return ROUTE_STATE;
  }

  mount.dataset.audraliaFreeDrag = "true";
  mount.dataset.audraliaPoleSwivel = "true";
  mount.dataset.audraliaPhysicalAxisDeg = "23.44";
  mount.style.touchAction = "none";
  mount.style.userSelect = "none";

  try {
    const [
      runtimeModule,
      controlsModule,
      surfaceModule,
      hexSurfaceModule,
      reliefSurfaceModule,
      terrainFingersModule,
      assetsModule,
      canvasModule
    ] = await Promise.all([
      importModule("runtime", false),
      importModule("controls", true),
      importModule("surface", false),
      importModule("hexSurface", false),
      importModule("reliefSurface", false),
      importModule("terrainFingers", true),
      importModule("assets", true),
      importModule("canvas", true)
    ]);

    const createControls =
      controlsModule.createAudraliaControls ||
      controlsModule.createControls ||
      controlsModule.default?.createAudraliaControls ||
      controlsModule.default?.createControls;

    if (typeof createControls !== "function") {
      throw new Error("Audralia controls module imported but did not expose createAudraliaControls.");
    }

    const controls = createControls({
      runtime: runtimeModule,
      lockDelayMs: 2600,
      rotateSensitivity: 0.0115,
      poleSensitivity: 0.0095,
      yawDamping: 1.8,
      poleDamping: 2.6,
      poleReturn: 4.4
    });

    ROUTE_STATE.controlsLoaded = true;

    const mountFunction = chooseMountFunction(canvasModule);

    if (typeof mountFunction !== "function") {
      throw new Error("Canvas authority imported, but no mount function was found.");
    }

    const controller = mountFunction(mount, {
      routeReceipt: ROUTE_RECEIPT,
      routeContract: ROUTE_CONTRACT,
      cacheKey: CACHE_KEY,
      runtime: controls,
      runtimeMotion: controls,
      controls,
      surface: surfaceModule,
      hexSurface: hexSurfaceModule,
      reliefSurface: reliefSurfaceModule,
      terrainFingers: terrainFingersModule,
      assets: assetsModule,
      freeDrag: true,
      poleSwivel: true,
      physicalAxisDeg: 23.44,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    ROUTE_STATE.canvasMounted = Boolean(controller) || true;

    const canvas = await waitForCanvas();
    ROUTE_STATE.canvasFound = Boolean(canvas);

    if (!canvas) {
      throw new Error("Canvas mount returned, but no Audralia canvas appeared.");
    }

    canvas.dataset.audraliaFreeDrag = "true";
    canvas.dataset.audraliaPoleSwivel = "true";
    canvas.dataset.audraliaPhysicalAxisDeg = "23.44";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    controls.bind(canvas, { mount });
    ROUTE_STATE.controlsBound = true;

    clearFallback();

    ROUTE_STATE.ok = true;
    publish("ready");
  } catch (error) {
    ROUTE_STATE.ok = false;
    ROUTE_STATE.errors.push(String(error?.message || error || "boot failed"));
    publish("failed");
  }

  return ROUTE_STATE;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  ROUTE_CONTRACT,
  ROUTE_RECEIPT,
  PREVIOUS_ROUTE_CONTRACT,
  CACHE_KEY,
  ROUTE_STATE,
  boot,
  publish
};

export default boot;
