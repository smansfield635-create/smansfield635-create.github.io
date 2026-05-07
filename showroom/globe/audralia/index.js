// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V11_SINGLE_STATUS_CANVAS_V10_CALLER_TNT_v1
// Full-file replacement. Doorway route only.
//
// Result:
// - Route owns the public status line.
// - Canvas is imported and mounted only.
// - Stale V6/V7/V8/V9 route proof panels are removed from public flow.
// - No proof panel is created by this route.
// - Runtime V8 remains preserved.
// - Canvas V10 is expected to be render-only and must not write route status.
// - No GraphicBox. No image generation. No visual-pass claim.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V11_SINGLE_STATUS_CANVAS_V10_CALLER_TNT_v1";
const CANVAS_CONTRACT = "AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10";
const CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const RETIRED_ROUTE_RECEIPTS = Object.freeze([
  "AUDRALIA_ROUTE_V10_STATUS_GATE_AND_CANVAS_V9_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1",
  "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1"
]);

const RETIRED_CANVAS_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1"
]);

const CANVAS_AUTHORITY_PATH =
  "/assets/audralia/audralia.canvas.js" +
  "?route=AUDRALIA_ROUTE_V11_SINGLE_STATUS_CANVAS_V10_CALLER_TNT_v1" +
  "&canvas=AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10" +
  "&cache=2026-05-07-route-v11-canvas-v10-render-only";

const RUNTIME_AUTHORITY_PATH =
  "/assets/audralia/audralia.runtime.js" +
  "?route=AUDRALIA_ROUTE_V11_SINGLE_STATUS_CANVAS_V10_CALLER_TNT_v1" +
  "&runtime=AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8" +
  "&cache=2026-05-07-route-v11-runtime-v8-preserved";

const STATUS_SELECTORS = Object.freeze([
  "#audralia-route-status",
  "[data-audralia-route-status]",
  "#audralia-status",
  "[data-route-status]"
]);

const MOUNT_SELECTORS = Object.freeze([
  "#audralia-canvas-mount",
  "[data-audralia-canvas-mount]",
  "#audraliaRenderMount",
  "#audralia-mount",
  "[data-audralia-mount]",
  "[data-audralia-render-mount]",
  "#audralia-main",
  "main"
]);

const STALE_TEXT_TOKENS = Object.freeze([
  "AUDRALIA_ROUTE_V10_STATUS_GATE_AND_CANVAS_V9_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1",
  "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "Route AUDRALIA_ROUTE_V",
  "Retired AUDRALIA_CANVAS_",
  "Canvas authority imported · no render export found",
  "Audralia canvas authority imported, but no render export was found.",
  "Audralia doorway loading V9 canvas authority.",
  "Audralia doorway loading v7 fail-open canvas authority.",
  "Audralia doorway is loading the current adopted canvas authority."
]);

const ROUTE_STATUS = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  canvasContract: CANVAS_CONTRACT,
  canvasReceipt: CANVAS_RECEIPT,
  runtimeReceipt: RUNTIME_RECEIPT,
  retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
  runtimeImported: false,
  canvasImported: false,
  mountFound: false,
  mounted: false,
  publicStatusWriter: "route-only",
  routeCreatesProofPanel: false,
  canvasMayWriteRouteStatus: false,
  stalePublicProofRemoved: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

let observer = null;
let cleanupInterval = 0;
let statusLocked = false;

function hasDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function selectFirst(selectors) {
  if (!hasDOM()) return null;

  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  return null;
}

function getStatusTarget() {
  return selectFirst(STATUS_SELECTORS);
}

function getMountTarget() {
  return selectFirst(MOUNT_SELECTORS);
}

function exposeStatus(extra = {}) {
  Object.assign(ROUTE_STATUS, extra);

  if (!hasDOM()) return ROUTE_STATUS;

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATUS;
  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATUS;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaCanvasContract = CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaRuntimeReceipt = RUNTIME_RECEIPT;
  document.documentElement.dataset.audraliaRoutePublicStatusWriter = "route-only";
  document.documentElement.dataset.audraliaRouteCreatesProofPanel = "false";
  document.documentElement.dataset.audraliaCanvasMayWriteRouteStatus = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:route-status", {
        detail: Object.freeze({ ...ROUTE_STATUS })
      })
    );
  } catch (_) {}

  return ROUTE_STATUS;
}

function publicStatusText(message) {
  return [
    message,
    `Route ${ROUTE_RECEIPT}`,
    `Canvas ${CANVAS_CONTRACT}`,
    `Receipt ${CANVAS_RECEIPT}`,
    `Runtime ${RUNTIME_RECEIPT}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join("\n");
}

function writeStatus(message, tone = "ok") {
  if (!hasDOM()) return;

  const target = getStatusTarget();

  if (!target) return;

  statusLocked = true;
  target.textContent = publicStatusText(message);
  target.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  target.dataset.audraliaCanvasContract = CANVAS_CONTRACT;
  target.dataset.audraliaCanvasReceipt = CANVAS_RECEIPT;
  target.dataset.audraliaRuntimeReceipt = RUNTIME_RECEIPT;
  target.dataset.audraliaRouteTone = tone;
  target.dataset.audraliaPublicStatusWriter = "route-only";
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";

  window.setTimeout(() => {
    statusLocked = false;
  }, 0);
}

function isStatusTarget(node) {
  if (!node || typeof node.matches !== "function") return false;

  return STATUS_SELECTORS.some((selector) => {
    try {
      return node.matches(selector);
    } catch (_) {
      return false;
    }
  });
}

function containsStaleToken(text) {
  return STALE_TEXT_TOKENS.some((token) => text.includes(token));
}

function removeNode(node) {
  if (!node || isStatusTarget(node)) return;

  try {
    node.remove();
  } catch (_) {
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.style.display = "none";
  }
}

function cleanStaleProof() {
  if (!hasDOM()) return;

  const staleSelector = [
    "[data-audralia-route-v8-proof]",
    "[data-audralia-route-v7-proof]",
    "[data-audralia-route-v6-proof]",
    "[data-audralia-route-proof]",
    "[data-audralia-stale-proof]",
    "[data-stale-audralia-proof]"
  ].join(",");

  document.querySelectorAll(staleSelector).forEach(removeNode);

  document.querySelectorAll("[data-audralia-canvas-proof]").forEach((node) => {
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.style.display = "none";
  });

  document.querySelectorAll("section, aside, div, p, span, li").forEach((node) => {
    if (!node || node === document.body || node === document.documentElement) return;
    if (isStatusTarget(node)) return;

    const text = (node.textContent || "").trim();

    if (!text) return;

    const hasInteractiveOrCanvas = Boolean(
      node.querySelector("a, button, canvas, input, textarea, select, nav, main, header")
    );

    if (hasInteractiveOrCanvas) return;

    if (containsStaleToken(text) && text.length < 2200) {
      removeNode(node);
    }
  });

  exposeStatus({ stalePublicProofRemoved: true });
}

function normalizeCanvasGlobals() {
  if (!hasDOM()) return;

  const existing =
    window.__AUDRALIA_CANVAS_STATUS__ ||
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ ||
    {};

  const normalized = {
    ...existing,
    loaded: Boolean(existing.loaded),
    receipt: CANVAS_RECEIPT,
    contract: CANVAS_CONTRACT,
    routeReceipt: ROUTE_RECEIPT,
    runtimeReceipt: RUNTIME_RECEIPT,
    publicStatusWriter: "route-only",
    canvasMayWriteRouteStatus: false,
    routeCreatesProofPanel: false,
    retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_CANVAS_STATUS__ = normalized;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = normalized;
}

function repairStatusIfNeeded() {
  if (!hasDOM() || statusLocked) return;

  const target = getStatusTarget();
  if (!target) return;

  const text = target.textContent || "";

  const stale = containsStaleToken(text);
  const missing =
    !text.includes(ROUTE_RECEIPT) ||
    !text.includes(CANVAS_CONTRACT) ||
    !text.includes(RUNTIME_RECEIPT);

  if (stale || missing) {
    writeStatus("Audralia adopted canvas authority loaded.", "ok");
  }
}

function startCleanupLoop() {
  if (!hasDOM()) return;

  if (observer) observer.disconnect();

  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => {
      cleanStaleProof();
      normalizeCanvasGlobals();
      repairStatusIfNeeded();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  const started = performance.now();

  cleanupInterval = window.setInterval(() => {
    cleanStaleProof();
    normalizeCanvasGlobals();
    repairStatusIfNeeded();

    if (performance.now() - started > 10000) {
      window.clearInterval(cleanupInterval);
      cleanupInterval = 0;
    }
  }, 220);

  window.addEventListener(
    "pagehide",
    () => {
      if (observer) observer.disconnect();
      if (cleanupInterval) window.clearInterval(cleanupInterval);
    },
    { once: true }
  );
}

async function waitFrame(count = 1) {
  if (!hasDOM()) return;

  for (let index = 0; index < count; index += 1) {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }
}

async function importRuntime() {
  try {
    const runtimeModule = await import(RUNTIME_AUTHORITY_PATH);
    exposeStatus({ runtimeImported: true, runtimeError: "" });
    return runtimeModule;
  } catch (error) {
    exposeStatus({
      runtimeImported: false,
      runtimeError: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

function resolveMountFunction(module) {
  return (
    module.mountAudraliaCanvas ||
    module.renderAudraliaCanvas ||
    module.bootAudraliaCanvas ||
    module.createAudraliaCanvas ||
    module.initAudraliaCanvas ||
    module.renderAudralia ||
    module.mountAudralia ||
    module.render ||
    module.mount ||
    module.init ||
    module.default?.mountAudraliaCanvas ||
    module.default?.renderAudraliaCanvas ||
    module.default?.bootAudraliaCanvas ||
    module.default?.createAudraliaCanvas ||
    module.default?.initAudraliaCanvas ||
    module.default?.renderAudralia ||
    module.default?.mountAudralia ||
    module.default?.render ||
    module.default?.mount ||
    module.default?.init ||
    null
  );
}

async function importAndMountCanvas(mount) {
  const canvasModule = await import(CANVAS_AUTHORITY_PATH);
  const mountFunction = resolveMountFunction(canvasModule);

  exposeStatus({
    canvasImported: true,
    mountFunctionFound: typeof mountFunction === "function"
  });

  if (typeof mountFunction !== "function") {
    throw new Error("AUDRALIA_ROUTE_V11_CANVAS_MOUNT_EXPORT_MISSING");
  }

  const controller = mountFunction(mount, {
    routeReceipt: ROUTE_RECEIPT,
    canvasContract: CANVAS_CONTRACT,
    canvasReceipt: CANVAS_RECEIPT,
    runtimeReceipt: RUNTIME_RECEIPT,
    publicStatusWriter: "route-only",
    canvasMayWriteRouteStatus: false,
    createProofPanel: false,
    visibleCanvasReceipt: false,
    maxRenderSize: 720,
    firstPaintTextureWidth: 360,
    firstPaintTextureHeight: 180,
    runtimeTextureWidth: 720,
    runtimeTextureHeight: 360,
    frameRateTarget: 24,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });

  exposeStatus({
    mounted: Boolean(controller),
    loaded: Boolean(controller),
    ok: Boolean(controller)
  });

  return controller;
}

async function bootAudraliaRoute() {
  if (!hasDOM()) return null;

  exposeStatus();
  startCleanupLoop();
  cleanStaleProof();
  normalizeCanvasGlobals();

  writeStatus("Audralia doorway loading render-only canvas authority.", "loading");

  const mount = getMountTarget();

  exposeStatus({
    mountFound: Boolean(mount),
    mountId: mount && mount.id ? mount.id : ""
  });

  if (!mount) {
    writeStatus("Audralia mount not found.", "error");
    exposeStatus({ ok: false, loaded: false, mounted: false });
    return null;
  }

  await importRuntime();

  try {
    const controller = await importAndMountCanvas(mount);

    await waitFrame(2);
    cleanStaleProof();
    normalizeCanvasGlobals();
    writeStatus("Audralia adopted canvas authority loaded.", "ok");

    window.setTimeout(() => {
      cleanStaleProof();
      normalizeCanvasGlobals();
      writeStatus("Audralia adopted canvas authority loaded.", "ok");
    }, 650);

    window.setTimeout(() => {
      cleanStaleProof();
      normalizeCanvasGlobals();
      writeStatus("Audralia adopted canvas authority loaded.", "ok");
    }, 1800);

    return controller;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    exposeStatus({
      ok: false,
      loaded: false,
      mounted: false,
      canvasError: message
    });

    writeStatus(`Audralia canvas authority import failed. ${message}`, "error");
    cleanStaleProof();

    return null;
  }
}

exposeStatus();

if (hasDOM()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAudraliaRoute, { once: true });
  } else {
    bootAudraliaRoute();
  }
}

export {
  ROUTE_RECEIPT,
  CANVAS_CONTRACT,
  CANVAS_RECEIPT,
  RUNTIME_RECEIPT,
  RETIRED_ROUTE_RECEIPTS,
  RETIRED_CANVAS_CONTRACTS,
  CANVAS_AUTHORITY_PATH,
  RUNTIME_AUTHORITY_PATH,
  ROUTE_STATUS,
  bootAudraliaRoute
};

export default bootAudraliaRoute;
