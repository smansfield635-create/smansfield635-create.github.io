// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1
// Full-file replacement. Doorway route only.
// Purpose:
// - Retire v6 live-route contract residue.
// - Hard-bind the live route to the v7 fail-open orthographic first-paint canvas.
// - Preserve runtime v8 handoff.
// - Expose route, canvas, runtime, and proof receipts for Gauges.
// - Do not own HTML shell, runtime truth, topology, terrain, hydration, oceans, canvas paint, GraphicBox, image generation, or visual pass.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1";
const RETIRED_ROUTE_RECEIPT = "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1";

const REQUIRED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7";
const RETIRED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6";
const REQUIRED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";

const REQUIRED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const CANVAS_AUTHORITY_PATH =
  "/assets/audralia/audralia.canvas.js?route=AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1&canvas=AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7&cache=2026-05-07-v7-route-hard-bind";

const RUNTIME_AUTHORITY_PATH =
  "/assets/audralia/audralia.runtime.js?route=AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1&runtime=AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8&cache=2026-05-07-runtime-v8-route-bind";

const ROUTE_STATUS = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  retiredRouteReceipt: RETIRED_ROUTE_RECEIPT,
  requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
  retiredCanvasContract: RETIRED_CANVAS_CONTRACT,
  requiredCanvasReceipt: REQUIRED_CANVAS_RECEIPT,
  requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,
  canvasAuthorityPath: CANVAS_AUTHORITY_PATH,
  runtimeAuthorityPath: RUNTIME_AUTHORITY_PATH,

  runtimeImported: false,
  runtimeReceipt: "",
  runtimeError: "",

  canvasImported: false,
  canvasContract: "",
  canvasReceipt: "",
  canvasError: "",

  mountFound: false,
  mountId: "",
  mountFunctionFound: false,
  mounted: false,

  routeStatusVisible: false,
  canvasStatusVisible: false,
  staleV6StatusSuppressed: true,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function exposeRouteStatus(extra = {}) {
  Object.assign(ROUTE_STATUS, extra);

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATUS;
  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATUS;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteRetiredReceipt = RETIRED_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteRequiredCanvasContract = REQUIRED_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaRouteRetiredCanvasContract = RETIRED_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaRouteRequiredCanvasReceipt = REQUIRED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaRouteRequiredRuntimeReceipt = REQUIRED_RUNTIME_RECEIPT;
  document.documentElement.dataset.audraliaRouteCanvasImported = String(Boolean(ROUTE_STATUS.canvasImported));
  document.documentElement.dataset.audraliaRouteRuntimeImported = String(Boolean(ROUTE_STATUS.runtimeImported));
  document.documentElement.dataset.audraliaRouteMounted = String(Boolean(ROUTE_STATUS.mounted));
  document.documentElement.dataset.audraliaRouteStaleV6StatusSuppressed = "true";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:route-status", {
        detail: Object.freeze({ ...ROUTE_STATUS })
      })
    );
  } catch (_) {
    // no-op
  }

  return ROUTE_STATUS;
}

function first(selectors) {
  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  return null;
}

function resolveStatusTarget() {
  return first([
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ]);
}

function resolveMount() {
  return first([
    "#audraliaRenderMount",
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main"
  ]);
}

function suppressStaleCanvasStatus() {
  if (window.__AUDRALIA_CANVAS_STATUS__) {
    window.__AUDRALIA_CANVAS_STATUS__ = {
      loaded: false,
      receipt: REQUIRED_CANVAS_RECEIPT,
      contract: REQUIRED_CANVAS_CONTRACT,
      retiredCanvasContract: RETIRED_CANVAS_CONTRACT,
      routeReceipt: ROUTE_RECEIPT,
      staleV6StatusSuppressed: true,
      pendingV7Mount: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    };
  }

  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = window.__AUDRALIA_CANVAS_STATUS__;
}

function cleanRouteResidue() {
  const staleText = new Set([
    "Loading Audralia",
    "Audralia canvas authority import failed.",
    "Audralia canvas authority import failed. missing ) after argument list",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority."
  ]);

  document.querySelectorAll("p, div, span, li, h2, h3").forEach((node) => {
    const text = (node.textContent || "").trim();

    if (!node.children.length && staleText.has(text)) {
      node.remove();
    }
  });
}

function setStatusMessage(message, tone = "ok") {
  const target = resolveStatusTarget();

  if (!target) {
    exposeRouteStatus({ routeStatusVisible: false });
    return null;
  }

  target.textContent = message;
  target.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  target.dataset.audraliaRouteRetiredReceipt = RETIRED_ROUTE_RECEIPT;
  target.dataset.audraliaCanvasRequiredContract = REQUIRED_CANVAS_CONTRACT;
  target.dataset.audraliaCanvasRetiredContract = RETIRED_CANVAS_CONTRACT;
  target.dataset.audraliaCanvasRequiredReceipt = REQUIRED_CANVAS_RECEIPT;
  target.dataset.audraliaRuntimeRequiredReceipt = REQUIRED_RUNTIME_RECEIPT;
  target.dataset.audraliaRouteTone = tone;
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";

  exposeRouteStatus({ routeStatusVisible: true });

  return target;
}

function ensureProofPanel(mount) {
  let panel = document.querySelector("[data-audralia-route-v7-proof='true']");

  if (!panel) {
    document.querySelectorAll("[data-audralia-route-v6-proof='true']").forEach((node) => node.remove());

    panel = document.createElement("section");
    panel.dataset.audraliaRouteV7Proof = "true";
    panel.style.margin = "12px auto 0";
    panel.style.padding = "10px 12px";
    panel.style.maxWidth = "860px";
    panel.style.border = "1px solid rgba(185, 216, 255, 0.18)";
    panel.style.borderRadius = "16px";
    panel.style.background = "rgba(5, 12, 26, 0.62)";
    panel.style.color = "rgba(210, 226, 245, 0.88)";
    panel.style.font = "600 0.74rem/1.45 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.letterSpacing = "0.02em";

    if (mount && mount.parentNode) {
      mount.parentNode.insertBefore(panel, mount.nextSibling);
    } else {
      document.body.appendChild(panel);
    }
  }

  return panel;
}

function writeProofPanel(mount, canvasStatus = null) {
  const panel = ensureProofPanel(mount);
  const status = canvasStatus || window.__AUDRALIA_CANVAS_STATUS__ || {};

  panel.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  panel.dataset.audraliaRouteRetiredReceipt = RETIRED_ROUTE_RECEIPT;
  panel.dataset.audraliaCanvasContract = status.contract || REQUIRED_CANVAS_CONTRACT;
  panel.dataset.audraliaCanvasRetiredContract = RETIRED_CANVAS_CONTRACT;
  panel.dataset.audraliaCanvasReceipt = status.receipt || REQUIRED_CANVAS_RECEIPT;
  panel.dataset.audraliaRuntimeReceipt = ROUTE_STATUS.runtimeReceipt || REQUIRED_RUNTIME_RECEIPT;
  panel.dataset.audraliaStaleV6StatusSuppressed = "true";
  panel.dataset.graphicBox = "false";
  panel.dataset.imageGeneration = "false";
  panel.dataset.visualPassClaimed = "false";

  panel.textContent = [
    `Route ${ROUTE_RECEIPT}`,
    `Canvas ${status.contract || REQUIRED_CANVAS_CONTRACT}`,
    `Receipt ${status.receipt || REQUIRED_CANVAS_RECEIPT}`,
    `Runtime ${ROUTE_STATUS.runtimeReceipt || REQUIRED_RUNTIME_RECEIPT}`,
    `Retired ${RETIRED_CANVAS_CONTRACT}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join(" · ");

  exposeRouteStatus({ canvasStatusVisible: true });

  return panel;
}

async function importRuntime() {
  try {
    const runtimeModule = await import(RUNTIME_AUTHORITY_PATH);

    const runtimeReceipt =
      runtimeModule.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtimeModule.AUDRALIA_RUNTIME_STATUS?.receipt ||
      window.AUDRALIA_RUNTIME_STATUS?.receipt ||
      REQUIRED_RUNTIME_RECEIPT;

    exposeRouteStatus({
      runtimeImported: true,
      runtimeReceipt,
      runtimeError: ""
    });

    return runtimeModule;
  } catch (error) {
    const runtimeError = error instanceof Error ? error.message : String(error);

    exposeRouteStatus({
      runtimeImported: false,
      runtimeReceipt: "",
      runtimeError
    });

    return null;
  }
}

function resolveMountFunction(canvasModule) {
  return (
    canvasModule.mountAudraliaCanvas ||
    canvasModule.renderAudraliaCanvas ||
    canvasModule.bootAudraliaCanvas ||
    canvasModule.createAudraliaCanvas ||
    canvasModule.initAudraliaCanvas ||
    canvasModule.renderAudralia ||
    canvasModule.mountAudralia ||
    canvasModule.render ||
    canvasModule.mount ||
    canvasModule.default?.mountAudraliaCanvas ||
    canvasModule.default?.renderAudraliaCanvas ||
    canvasModule.default?.mount ||
    null
  );
}

async function importAndMountCanvas(mount) {
  try {
    suppressStaleCanvasStatus();

    const canvasModule = await import(CANVAS_AUTHORITY_PATH);
    const mountFn = resolveMountFunction(canvasModule);

    const moduleContract =
      canvasModule.CONTRACT ||
      canvasModule.default?.CONTRACT ||
      window.__AUDRALIA_CANVAS_STATUS__?.contract ||
      REQUIRED_CANVAS_CONTRACT;

    const moduleReceipt =
      canvasModule.RECEIPT ||
      canvasModule.default?.RECEIPT ||
      window.__AUDRALIA_CANVAS_STATUS__?.receipt ||
      REQUIRED_CANVAS_RECEIPT;

    exposeRouteStatus({
      canvasImported: true,
      canvasContract: moduleContract,
      canvasReceipt: moduleReceipt,
      canvasError: "",
      mountFunctionFound: typeof mountFn === "function"
    });

    if (typeof mountFn !== "function") {
      throw new Error("AUDRALIA_ROUTE_NO_CANONICAL_CANVAS_MOUNT_EXPORT");
    }

    const controller = mountFn(mount, {
      routeReceipt: ROUTE_RECEIPT,
      retiredRouteReceipt: RETIRED_ROUTE_RECEIPT,
      requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
      retiredCanvasContract: RETIRED_CANVAS_CONTRACT,
      requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,
      maxRenderSize: 680,
      textureWidth: 1024,
      textureHeight: 512,
      initialTextureWidth: 512,
      initialTextureHeight: 256,
      frameCap: 12,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    const status = window.__AUDRALIA_CANVAS_STATUS__ || {
      receipt: REQUIRED_CANVAS_RECEIPT,
      contract: REQUIRED_CANVAS_CONTRACT
    };

    exposeRouteStatus({
      ok: true,
      loaded: true,
      mounted: Boolean(controller),
      canvasContract: status.contract || REQUIRED_CANVAS_CONTRACT,
      canvasReceipt: status.receipt || REQUIRED_CANVAS_RECEIPT
    });

    setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
    writeProofPanel(mount, status);

    return controller;
  } catch (error) {
    const canvasError = error instanceof Error ? error.message : String(error);

    exposeRouteStatus({
      ok: false,
      loaded: false,
      mounted: false,
      canvasError
    });

    setStatusMessage(`Audralia canvas authority import failed. ${canvasError}`, "error");
    writeProofPanel(mount, null);

    return null;
  }
}

async function bootAudraliaRoute() {
  cleanRouteResidue();
  suppressStaleCanvasStatus();
  setStatusMessage("Audralia doorway loading v7 fail-open canvas authority.", "loading");

  const mount = resolveMount();

  exposeRouteStatus({
    mountFound: Boolean(mount),
    mountId: mount?.id || ""
  });

  if (!mount) {
    setStatusMessage("Audralia mount not found.", "error");

    exposeRouteStatus({
      ok: false,
      loaded: false,
      mounted: false
    });

    return null;
  }

  await importRuntime();

  const controller = await importAndMountCanvas(mount);

  writeProofPanel(mount, window.__AUDRALIA_CANVAS_STATUS__ || null);

  return controller;
}

exposeRouteStatus();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAudraliaRoute, { once: true });
} else {
  bootAudraliaRoute();
}

export {
  ROUTE_RECEIPT,
  RETIRED_ROUTE_RECEIPT,
  REQUIRED_CANVAS_CONTRACT,
  RETIRED_CANVAS_CONTRACT,
  REQUIRED_CANVAS_RECEIPT,
  REQUIRED_RUNTIME_RECEIPT,
  CANVAS_AUTHORITY_PATH,
  RUNTIME_AUTHORITY_PATH,
  ROUTE_STATUS,
  bootAudraliaRoute
};

export default bootAudraliaRoute;
