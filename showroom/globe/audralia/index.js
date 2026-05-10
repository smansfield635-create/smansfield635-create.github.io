// /showroom/globe/audralia/index.js
// AUDRALIA_G2_CALIBRATION_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Route doorway authority only.
// Calibration purpose:
// - Stop pretending the live route is still plain V18.
// - Represent the current source state honestly.
// - Current terrain source expectation: G2.2 relief/contrast.
// - Current asset source expectation: G2.3 relief/shelf attenuation.
// - Refresh import cache key.
// - Import, verify, mount, and report.
// - Route does not draw Audralia.
// - Route does not own runtime motion.
// - Route does not own terrain truth.
// - No GraphicBox. No generated image. No visual-pass claim.

const ROUTE_CONTRACT = "AUDRALIA_G2_CALIBRATION_ROUTE_CONTROLLER_TNT_v1";
const ROUTE_RECEIPT = "AUDRALIA_G2_CALIBRATION_ROUTE_RECEIPT";
const HTML_RECEIPT = "AUDRALIA_HABITABLE_FORMING_G2_CALIBRATION_HTML_TNT_v1";
const PREVIOUS_ROUTE_CONTRACT = "AUDRALIA_V18_TERRAIN_FIVE_FINGER_ROUTE_CONTROLLER_TNT_v1";
const CACHE_KEY = "audralia-g2-calibration-current-source-alignment-v1";

const PATHS = Object.freeze({
  runtime: "/assets/audralia/audralia.runtime.js",
  surface: "/assets/audralia/audralia.surface.js",
  hexSurface: "/assets/audralia/audralia.hex.surface.js",
  reliefSurface: "/assets/audralia/audralia.relief.surface.js",
  terrainFingers: "/assets/audralia/audralia.terrain.fingers.js",
  assets: "/assets/audralia/audralia.assets.js",
  canvas: "/assets/audralia/audralia.canvas.js"
});

const EXPECTED = Object.freeze({
  runtime: "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10",
  surface: "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6",
  hexSurface: "AUDRALIA_HEX_SURFACE_CHILD_GRANDCHILD_RELIEF_BIND_TNT_v4",
  reliefSurface: "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1",
  terrainFingers: "AUDRALIA_G2_2_RELIEF_CONTRAST_AND_NATURAL_READABILITY_TNT_v1",
  assets: "AUDRALIA_G2_3_ASSET_RELIEF_FIELD_AND_SHELF_ATTENUATION_TNT_v1",
  canvas: "AUDRALIA_V18_CANVAS_ASSET_BOUNDARY_CONSUMER_TNT_v1"
});

const ROUTE_STATE = {
  ok: false,
  contract: ROUTE_CONTRACT,
  receipt: ROUTE_RECEIPT,
  htmlReceipt: HTML_RECEIPT,
  previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
  route: "/showroom/globe/audralia/",
  publicIdentity: "Audralia · Habitable Forming · G2 Calibration Active",
  baseline: "G1 coherent achieved",
  currentPhase: "G2 calibration active, not passed",
  cacheKey: CACHE_KEY,
  imported: {},
  contracts: {},
  receipts: {},
  expected: EXPECTED,
  mountFound: false,
  canvasFound: false,
  canvasMounted: false,
  runtimeLoaded: false,
  terrainFingersLoaded: false,
  assetsLoaded: false,
  runtimeMotionOnly: true,
  assetsAbsorbAuthority: false,
  terrainFiveFingers: true,
  generatedImage: false,
  graphicBox: false,
  visualPassClaimed: false,
  errors: [],
  warnings: [],
  lastUpdated: ""
};

function $(selector) {
  return document.querySelector(selector);
}

function resolveMount() {
  return (
    $("#audralia-canvas-mount") ||
    $("[data-audralia-canvas-mount]") ||
    $("#audralia-mount") ||
    $("[data-audralia-render-mount]")
  );
}

function resolveStatusNode() {
  return (
    $("#audralia-route-status") ||
    $("[data-audralia-route-status]") ||
    $("#audralia-status") ||
    $("[data-route-status]")
  );
}

function resolveCanvas() {
  const mount = resolveMount();

  return (
    document.querySelector("canvas[data-audralia-canvas='true']") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    (mount && mount.querySelector("canvas"))
  );
}

function asText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function firstText(...values) {
  for (const value of values) {
    const text = asText(value).trim();
    if (text) return text;
  }
  return "";
}

function safe(fn, fallback = null) {
  try {
    return typeof fn === "function" ? fn() : fallback;
  } catch (error) {
    ROUTE_STATE.errors.push(String(error?.message || error || "safe-call-failed"));
    return fallback;
  }
}

function moduleStatus(module) {
  return (
    safe(() => module.getStatus && module.getStatus(), null) ||
    safe(() => module.getAudraliaCanvasStatus && module.getAudraliaCanvasStatus(), null) ||
    safe(() => module.getAudraliaAssetsStatus && module.getAudraliaAssetsStatus(), null) ||
    safe(() => module.getAudraliaTerrainFingerStatus && module.getAudraliaTerrainFingerStatus(), null) ||
    safe(() => module.getAudraliaReliefSurfaceStatus && module.getAudraliaReliefSurfaceStatus(), null) ||
    safe(() => module.getAudraliaHexSurfaceStatus && module.getAudraliaHexSurfaceStatus(), null) ||
    module.AUDRALIA_SURFACE_STATUS ||
    module.AUDRALIA_HEX_SURFACE_STATUS ||
    module.AUDRALIA_RELIEF_SURFACE_STATUS ||
    module.AUDRALIA_ASSETS_STATUS ||
    module.AUDRALIA_TERRAIN_FINGERS_STATUS ||
    {}
  );
}

function moduleContract(module, fallback) {
  const status = moduleStatus(module);

  return firstText(
    module.CONTRACT,
    status.contract,
    module.default && module.default.contract,
    fallback
  );
}

function moduleReceipt(module, fallback) {
  const status = moduleStatus(module);

  return firstText(
    module.RECEIPT,
    status.receipt,
    module.AUDRALIA_RUNTIME_RECEIPT_VALUE,
    module.AUDRALIA_SURFACE_RECEIPT_VALUE,
    module.AUDRALIA_HEX_SURFACE_RECEIPT_VALUE,
    module.AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
    module.AUDRALIA_ASSETS_RECEIPT_VALUE,
    module.AUDRALIA_TERRAIN_FINGERS_RECEIPT_VALUE,
    module.default && module.default.receipt,
    fallback
  );
}

function checkExpected(label, module) {
  const contract = moduleContract(module, EXPECTED[label]);
  const receipt = moduleReceipt(module, contract);

  ROUTE_STATE.contracts[label] = contract;
  ROUTE_STATE.receipts[label] = receipt;

  const expected = EXPECTED[label] || "";
  const ok = Boolean(contract && expected && contract.includes(expected));

  if (!ok && (label === "terrainFingers" || label === "assets")) {
    ROUTE_STATE.warnings.push(`${label} contract mismatch: expected ${expected}, got ${contract || "none"}`);
  }

  return { contract, receipt, ok };
}

function writeStatus(status = "") {
  const node = resolveStatusNode();
  if (!node) return;

  const lines = [
    ROUTE_STATE.ok
      ? "Audralia G2 calibration route aligned."
      : "Audralia G2 calibration route preparing.",
    `Status ${status || "checking"}`,
    `Public Identity ${ROUTE_STATE.publicIdentity}`,
    `Baseline ${ROUTE_STATE.baseline}`,
    `Current Phase ${ROUTE_STATE.currentPhase}`,
    `Route ${ROUTE_CONTRACT}`,
    `Route Receipt ${ROUTE_RECEIPT}`,
    `Previous ${PREVIOUS_ROUTE_CONTRACT}`,
    `Cache Key ${CACHE_KEY}`,
    `Runtime ${ROUTE_STATE.contracts.runtime || EXPECTED.runtime}`,
    `Surface ${ROUTE_STATE.contracts.surface || EXPECTED.surface}`,
    `Hex Surface ${ROUTE_STATE.contracts.hexSurface || EXPECTED.hexSurface}`,
    `Relief Surface ${ROUTE_STATE.contracts.reliefSurface || EXPECTED.reliefSurface}`,
    `Terrain Fingers ${ROUTE_STATE.contracts.terrainFingers || EXPECTED.terrainFingers}`,
    `Terrain Receipt ${ROUTE_STATE.receipts.terrainFingers || "pending"}`,
    `Assets ${ROUTE_STATE.contracts.assets || EXPECTED.assets}`,
    `Assets Receipt ${ROUTE_STATE.receipts.assets || "pending"}`,
    `Canvas ${ROUTE_STATE.contracts.canvas || EXPECTED.canvas}`,
    `Mount found ${ROUTE_STATE.mountFound}`,
    `Canvas mounted ${ROUTE_STATE.canvasMounted}`,
    `Canvas found ${ROUTE_STATE.canvasFound}`,
    `Runtime motion-only true`,
    `Terrain five fingers true`,
    `Assets absorb authority false`,
    `G2 calibration active true`,
    `G2 visual pass false`,
    `GraphicBox false`,
    `Generated image false`,
    `Visual pass claimed false`
  ];

  if (ROUTE_STATE.warnings.length) {
    lines.push(`Warnings ${ROUTE_STATE.warnings.slice(-4).join(" | ")}`);
  }

  if (ROUTE_STATE.errors.length) {
    lines.push(`Errors ${ROUTE_STATE.errors.slice(-4).join(" | ")}`);
  }

  node.textContent = lines.join("\n");
  node.dataset.audraliaRouteContract = ROUTE_CONTRACT;
  node.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  node.dataset.audraliaRouteReady = String(Boolean(ROUTE_STATE.ok));
  node.dataset.audraliaCacheKey = CACHE_KEY;
  node.dataset.audraliaBaseline = "g1-coherent-achieved";
  node.dataset.audraliaG2Calibration = "active";
  node.dataset.audraliaG2Passed = "false";
  node.dataset.audraliaRuntimeMotionOnly = "true";
  node.dataset.audraliaTerrainFiveFingers = "true";
  node.dataset.audraliaAssetsAbsorbAuthority = "false";
  node.dataset.generatedImage = "false";
  node.dataset.graphicBox = "false";
  node.dataset.visualPassClaimed = "false";
}

function publish(status = "") {
  ROUTE_STATE.mountFound = Boolean(resolveMount());
  ROUTE_STATE.canvasFound = Boolean(resolveCanvas());
  ROUTE_STATE.lastUpdated = new Date().toISOString();

  document.documentElement.dataset.audraliaRouteContract = ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRoutePreviousContract = PREVIOUS_ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaGeneration = "G2-calibration";
  document.documentElement.dataset.audraliaRouteStatus = status || "checking";
  document.documentElement.dataset.audraliaCacheKey = CACHE_KEY;
  document.documentElement.dataset.audraliaBaseline = "g1-coherent-achieved";
  document.documentElement.dataset.audraliaG2Calibration = "active";
  document.documentElement.dataset.audraliaG2Passed = "false";
  document.documentElement.dataset.audraliaRuntimeMotionOnly = "true";
  document.documentElement.dataset.audraliaTerrainFiveFingers = "true";
  document.documentElement.dataset.audraliaAssetsBoundaryExpression = "true";
  document.documentElement.dataset.audraliaAssetsAbsorbAuthority = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATE;
  window.AUDRALIA_ROUTE_CONTRACT = ROUTE_CONTRACT;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;
  window.__AUDRALIA_ROUTE_RECEIPT__ = ROUTE_RECEIPT;

  writeStatus(status);

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-status", { detail: ROUTE_STATE }));
  } catch (_) {}

  return ROUTE_STATE;
}

async function importModule(label, required = true) {
  const path = PATHS[label];

  try {
    const module = await import(`${path}?v=${encodeURIComponent(CACHE_KEY)}&route=${encodeURIComponent(ROUTE_CONTRACT)}&role=${encodeURIComponent(label)}`);
    ROUTE_STATE.imported[label] = true;
    checkExpected(label, module);
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
    canvasModule.mountAudralia ||
    canvasModule.renderAudralia ||
    canvasModule.mount ||
    canvasModule.render ||
    canvasModule.init ||
    canvasModule.default?.mountAudraliaCanvas ||
    canvasModule.default?.renderAudraliaCanvas ||
    canvasModule.default?.mount ||
    canvasModule.default?.render ||
    canvasModule.default?.init ||
    window.mountAudraliaCanvas ||
    window.renderAudraliaCanvas
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

function connectRuntimeInput(runtimeModule, mount) {
  if (!runtimeModule || !mount) return;

  safe(() => runtimeModule.start && runtimeModule.start());

  let active = false;
  let lastX = 0;
  let lastY = 0;

  mount.style.touchAction = "none";
  mount.style.userSelect = "none";

  mount.addEventListener(
    "pointerdown",
    (event) => {
      active = true;
      lastX = event.clientX;
      lastY = event.clientY;

      safe(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(true));

      try {
        mount.setPointerCapture(event.pointerId);
      } catch (_) {}
    },
    { passive: true }
  );

  mount.addEventListener(
    "pointermove",
    (event) => {
      if (!active) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      lastX = event.clientX;
      lastY = event.clientY;

      safe(() => runtimeModule.applyDragImpulse && runtimeModule.applyDragImpulse(dx, dy, 1));
    },
    { passive: true }
  );

  function end(event) {
    active = false;
    safe(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(false));

    try {
      if (event && event.pointerId !== undefined) mount.releasePointerCapture(event.pointerId);
    } catch (_) {}
  }

  mount.addEventListener("pointerup", end, { passive: true });
  mount.addEventListener("pointercancel", end, { passive: true });
  mount.addEventListener("pointerleave", end, { passive: true });
}

async function boot() {
  publish("booting");

  const mount = resolveMount();

  if (!mount) {
    ROUTE_STATE.errors.push("Canonical mount #audralia-canvas-mount not found.");
    publish("missing-mount");
    return ROUTE_STATE;
  }

  mount.dataset.audraliaRouteContract = ROUTE_CONTRACT;
  mount.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  mount.dataset.audraliaCacheKey = CACHE_KEY;
  mount.dataset.audraliaBaseline = "g1-coherent-achieved";
  mount.dataset.audraliaG2Calibration = "active";
  mount.dataset.audraliaG2Passed = "false";
  mount.dataset.audraliaRuntimeMotionOnly = "true";
  mount.dataset.audraliaTerrainFiveFingers = "true";
  mount.dataset.audraliaAssetsBoundaryExpression = "true";
  mount.dataset.audraliaAssetsAbsorbAuthority = "false";
  mount.dataset.generatedImage = "false";
  mount.dataset.graphicBox = "false";
  mount.dataset.visualPassClaimed = "false";

  try {
    const [
      runtimeModule,
      surfaceModule,
      hexSurfaceModule,
      reliefSurfaceModule,
      terrainFingersModule,
      assetsModule,
      canvasModule
    ] = await Promise.all([
      importModule("runtime", false),
      importModule("surface", false),
      importModule("hexSurface", false),
      importModule("reliefSurface", false),
      importModule("terrainFingers", true),
      importModule("assets", true),
      importModule("canvas", true)
    ]);

    ROUTE_STATE.runtimeLoaded = Boolean(runtimeModule);
    ROUTE_STATE.terrainFingersLoaded = Boolean(terrainFingersModule);
    ROUTE_STATE.assetsLoaded = Boolean(assetsModule);

    const mountFunction = chooseMountFunction(canvasModule);

    if (typeof mountFunction !== "function") {
      throw new Error("Canvas authority imported, but no mount function was found.");
    }

    const controller = mountFunction(mount, {
      routeReceipt: ROUTE_RECEIPT,
      routeContract: ROUTE_CONTRACT,
      previousRouteReceipt: PREVIOUS_ROUTE_CONTRACT,
      cacheKey: CACHE_KEY,
      runtime: runtimeModule,
      runtimeMotion: runtimeModule,
      surface: surfaceModule,
      hexSurface: hexSurfaceModule,
      reliefSurface: reliefSurfaceModule,
      terrainFingers: terrainFingersModule,
      assets: assetsModule,
      terrainFiveFingers: true,
      g2CalibrationActive: true,
      g2Passed: false,
      assetsBoundaryExpression: true,
      assetsAbsorbAuthority: false,
      canvasReceipt: ROUTE_STATE.receipts.canvas || EXPECTED.canvas,
      terrainFingersReceipt: ROUTE_STATE.receipts.terrainFingers || EXPECTED.terrainFingers,
      assetsReceipt: ROUTE_STATE.receipts.assets || EXPECTED.assets,
      runtimeReceipt: ROUTE_STATE.receipts.runtime || EXPECTED.runtime,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    ROUTE_STATE.canvasMounted = Boolean(controller) || true;

    connectRuntimeInput(runtimeModule, mount);

    const canvas = await waitForCanvas();
    ROUTE_STATE.canvasFound = Boolean(canvas);

    if (canvas) {
      canvas.dataset.audraliaCanvas = "true";
      canvas.dataset.audraliaRouteContract = ROUTE_CONTRACT;
      canvas.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
      canvas.dataset.audraliaCacheKey = CACHE_KEY;
      canvas.dataset.audraliaG2Calibration = "active";
      canvas.dataset.audraliaG2Passed = "false";
      canvas.dataset.audraliaRuntimeMotionOnly = "true";
      canvas.dataset.audraliaTerrainFiveFingers = "true";
      canvas.dataset.audraliaAssetsBoundaryExpression = "true";
      canvas.dataset.audraliaAssetsAbsorbAuthority = "false";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.visualPassClaimed = "false";
    } else {
      ROUTE_STATE.errors.push("Canvas mount returned, but no canvas appeared inside the canonical mount.");
    }

    clearFallback();

    ROUTE_STATE.ok = Boolean(
      ROUTE_STATE.canvasFound &&
      ROUTE_STATE.assetsLoaded &&
      ROUTE_STATE.terrainFingersLoaded
    );

    publish(ROUTE_STATE.ok ? "ready" : "mounted-without-complete-proof");
  } catch (error) {
    ROUTE_STATE.errors.push(String(error?.message || error || "boot failed"));
    ROUTE_STATE.ok = false;
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
  HTML_RECEIPT,
  PREVIOUS_ROUTE_CONTRACT,
  CACHE_KEY,
  ROUTE_STATE,
  boot,
  publish
};

export default boot;
