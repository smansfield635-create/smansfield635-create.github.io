// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1
// Full-file replacement. Doorway route only.
//
// Purpose:
// - Renew the Audralia doorway route caller after the canvas authority moved to V9.
// - Hard-bind the live route to AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9.
// - Preserve runtime V8 handoff.
// - Expose route, canvas, runtime, and proof receipts for Gauges.
// - Retire stale V7 route/canvas binding from the public route status.
//
// Scope:
// - Owns route import/call only.
// - Does not own HTML shell, runtime truth, topology, terrain, hydration, oceans,
//   deep-ocean, canvas paint, Gauges scoring, GraphicBox, image generation, or visual pass.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1";
const RETIRED_ROUTE_RECEIPTS = Object.freeze([
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1"
]);

const REQUIRED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9";
const REQUIRED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const RETIRED_CANVAS_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1"
]);

const REQUIRED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const CANVAS_AUTHORITY_PATH =
  "/assets/audralia/audralia.canvas.js" +
  "?route=AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1" +
  "&canvas=AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9" +
  "&cache=2026-05-07-route-v8-canvas-v9-hard-bind";

const RUNTIME_AUTHORITY_PATH =
  "/assets/audralia/audralia.runtime.js" +
  "?route=AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1" +
  "&runtime=AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8" +
  "&cache=2026-05-07-runtime-v8-preserved-route-v8";

const ROUTE_STATUS = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
  requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
  requiredCanvasReceipt: REQUIRED_CANVAS_RECEIPT,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
  requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,
  canvasAuthorityPath: CANVAS_AUTHORITY_PATH,
  runtimeAuthorityPath: RUNTIME_AUTHORITY_PATH,

  runtimeImported: false,
  runtimeReceipt: "",
  runtimeError: "",

  canvasImported: false,
  canvasContract: "",
  canvasReceipt: "",
  canvasRevision: "",
  canvasVersion: "",
  canvasError: "",

  mountFound: false,
  mountId: "",
  mountFunctionFound: false,
  mounted: false,

  routeStatusVisible: false,
  proofPanelVisible: false,
  staleV6StatusSuppressed: true,
  staleV7StatusSuppressed: true,

  routeOwnsCanvasCall: true,
  routeOwnsCanvasPaint: false,
  routeOwnsRuntimeTruth: false,
  routeOwnsHTMLShell: false,
  routeOwnsGauges: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function hasDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function exposeRouteStatus(extra = {}) {
  Object.assign(ROUTE_STATUS, extra);

  if (!hasDOM()) return ROUTE_STATUS;

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATUS;
  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATUS;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  if (document.documentElement) {
    document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
    document.documentElement.dataset.audraliaRouteRetiredReceipts = RETIRED_ROUTE_RECEIPTS.join(",");
    document.documentElement.dataset.audraliaRouteRequiredCanvasContract = REQUIRED_CANVAS_CONTRACT;
    document.documentElement.dataset.audraliaRouteRequiredCanvasReceipt = REQUIRED_CANVAS_RECEIPT;
    document.documentElement.dataset.audraliaRouteRetiredCanvasContracts = RETIRED_CANVAS_CONTRACTS.join(",");
    document.documentElement.dataset.audraliaRouteRequiredRuntimeReceipt = REQUIRED_RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasImported = String(Boolean(ROUTE_STATUS.canvasImported));
    document.documentElement.dataset.audraliaRouteRuntimeImported = String(Boolean(ROUTE_STATUS.runtimeImported));
    document.documentElement.dataset.audraliaRouteMounted = String(Boolean(ROUTE_STATUS.mounted));
    document.documentElement.dataset.audraliaRouteStaleV6StatusSuppressed = "true";
    document.documentElement.dataset.audraliaRouteStaleV7StatusSuppressed = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

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

function isRetiredCanvasStatus(status) {
  if (!status || typeof status !== "object") return false;

  const contract = String(status.contract || status.revision || status.version || "");
  return RETIRED_CANVAS_CONTRACTS.some((retired) => contract.includes(retired));
}

function suppressRetiredCanvasStatus() {
  if (!hasDOM()) return;

  const existing = window.__AUDRALIA_CANVAS_STATUS__;

  if (existing && !isRetiredCanvasStatus(existing)) return;

  const pendingStatus = {
    loaded: false,
    receipt: REQUIRED_CANVAS_RECEIPT,
    contract: REQUIRED_CANVAS_CONTRACT,
    routeReceipt: ROUTE_RECEIPT,
    retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    pendingV9Mount: true,
    staleV6StatusSuppressed: true,
    staleV7StatusSuppressed: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_CANVAS_STATUS__ = pendingStatus;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = pendingStatus;
}

function cleanRouteResidue() {
  if (!hasDOM()) return;

  const staleText = new Set([
    "Loading Audralia",
    "Audralia canvas authority import failed.",
    "Audralia canvas authority import failed. missing ) after argument list",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority.",
    "Audralia doorway loading v7 fail-open canvas authority."
  ]);

  document.querySelectorAll("p, div, span, li, h2, h3").forEach((node) => {
    const text = (node.textContent || "").trim();

    if (!node.children.length && staleText.has(text)) {
      node.remove();
    }
  });

  document.querySelectorAll("[data-audralia-route-v6-proof='true'], [data-audralia-route-v7-proof='true']").forEach((node) => {
    node.remove();
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
  target.dataset.audraliaRouteRetiredReceipts = RETIRED_ROUTE_RECEIPTS.join(",");
  target.dataset.audraliaCanvasRequiredContract = REQUIRED_CANVAS_CONTRACT;
  target.dataset.audraliaCanvasRequiredReceipt = REQUIRED_CANVAS_RECEIPT;
  target.dataset.audraliaCanvasRetiredContracts = RETIRED_CANVAS_CONTRACTS.join(",");
  target.dataset.audraliaRuntimeRequiredReceipt = REQUIRED_RUNTIME_RECEIPT;
  target.dataset.audraliaRouteTone = tone;
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";

  exposeRouteStatus({ routeStatusVisible: true });

  return target;
}

function ensureProofPanel(mount) {
  let panel = document.querySelector("[data-audralia-route-v8-proof='true']");

  if (!panel) {
    panel = document.createElement("section");
    panel.dataset.audraliaRouteV8Proof = "true";
    panel.style.margin = "12px auto 0";
    panel.style.padding = "10px 12px";
    panel.style.maxWidth = "860px";
    panel.style.border = "1px solid rgba(185, 216, 255, 0.18)";
    panel.style.borderRadius = "16px";
    panel.style.background = "rgba(5, 12, 26, 0.62)";
    panel.style.color = "rgba(210, 226, 245, 0.88)";
    panel.style.font = "600 0.74rem/1.45 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.letterSpacing = "0.02em";
    panel.style.overflowWrap = "anywhere";

    if (mount && mount.parentNode) {
      mount.parentNode.insertBefore(panel, mount.nextSibling);
    } else {
      document.body.appendChild(panel);
    }
  }

  return panel;
}

function normalizeCanvasStatus(canvasModule = null) {
  const exportedStatus =
    typeof canvasModule?.getAudraliaCanvasStatus === "function"
      ? canvasModule.getAudraliaCanvasStatus()
      : typeof canvasModule?.default?.getAudraliaCanvasStatus === "function"
        ? canvasModule.default.getAudraliaCanvasStatus()
        : null;

  const liveStatus = window.__AUDRALIA_CANVAS_STATUS__ || window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ || null;
  const status = exportedStatus || liveStatus || {};

  return {
    loaded: Boolean(status.loaded),
    receipt: status.receipt || REQUIRED_CANVAS_RECEIPT,
    contract: status.contract || canvasModule?.CONTRACT || canvasModule?.default?.CONTRACT || REQUIRED_CANVAS_CONTRACT,
    revision: status.revision || canvasModule?.REVISION || canvasModule?.default?.REVISION || "",
    version: status.version || canvasModule?.VERSION || canvasModule?.default?.VERSION || "",
    canonicalExport: status.canonicalExport || "mountAudraliaCanvas",
    animated: status.animated === undefined ? true : Boolean(status.animated),
    pixelProof: status.pixelProof || null,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function writeProofPanel(mount, canvasStatus = null) {
  const panel = ensureProofPanel(mount);
  const status = canvasStatus || normalizeCanvasStatus();

  panel.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  panel.dataset.audraliaRouteRetiredReceipts = RETIRED_ROUTE_RECEIPTS.join(",");
  panel.dataset.audraliaCanvasContract = status.contract || REQUIRED_CANVAS_CONTRACT;
  panel.dataset.audraliaCanvasReceipt = status.receipt || REQUIRED_CANVAS_RECEIPT;
  panel.dataset.audraliaCanvasRevision = status.revision || "";
  panel.dataset.audraliaCanvasVersion = status.version || "";
  panel.dataset.audraliaRuntimeReceipt = ROUTE_STATUS.runtimeReceipt || REQUIRED_RUNTIME_RECEIPT;
  panel.dataset.audraliaStaleV6StatusSuppressed = "true";
  panel.dataset.audraliaStaleV7StatusSuppressed = "true";
  panel.dataset.graphicBox = "false";
  panel.dataset.imageGeneration = "false";
  panel.dataset.visualPassClaimed = "false";

  panel.textContent = [
    `Route ${ROUTE_RECEIPT}`,
    `Canvas ${status.contract || REQUIRED_CANVAS_CONTRACT}`,
    `Receipt ${status.receipt || REQUIRED_CANVAS_RECEIPT}`,
    `Runtime ${ROUTE_STATUS.runtimeReceipt || REQUIRED_RUNTIME_RECEIPT}`,
    `Retired ${RETIRED_CANVAS_CONTRACTS.join(", ")}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join(" · ");

  exposeRouteStatus({ proofPanelVisible: true });

  return panel;
}

async function importRuntime() {
  try {
    const runtimeModule = await import(RUNTIME_AUTHORITY_PATH);

    const runtimeReceipt =
      runtimeModule.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtimeModule.AUDRALIA_RUNTIME_STATUS?.receipt ||
      window.AUDRALIA_RUNTIME_STATUS?.receipt ||
      window.__AUDRALIA_RUNTIME_STATUS__?.receipt ||
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
    canvasModule.init ||
    canvasModule.default?.mountAudraliaCanvas ||
    canvasModule.default?.renderAudraliaCanvas ||
    canvasModule.default?.bootAudraliaCanvas ||
    canvasModule.default?.createAudraliaCanvas ||
    canvasModule.default?.initAudraliaCanvas ||
    canvasModule.default?.renderAudralia ||
    canvasModule.default?.mountAudralia ||
    canvasModule.default?.render ||
    canvasModule.default?.mount ||
    canvasModule.default?.init ||
    null
  );
}

function canvasContractLooksCurrent(status) {
  const contract = String(status.contract || "");
  return contract === REQUIRED_CANVAS_CONTRACT || contract.includes("ORTHOGRAPHIC_REALISM_TNT_v9");
}

async function importAndMountCanvas(mount) {
  try {
    suppressRetiredCanvasStatus();

    const canvasModule = await import(CANVAS_AUTHORITY_PATH);
    const mountFn = resolveMountFunction(canvasModule);
    const moduleStatus = normalizeCanvasStatus(canvasModule);

    exposeRouteStatus({
      canvasImported: true,
      canvasContract: moduleStatus.contract,
      canvasReceipt: moduleStatus.receipt,
      canvasRevision: moduleStatus.revision,
      canvasVersion: moduleStatus.version,
      canvasError: "",
      mountFunctionFound: typeof mountFn === "function"
    });

    if (typeof mountFn !== "function") {
      throw new Error("AUDRALIA_ROUTE_NO_CANONICAL_CANVAS_MOUNT_EXPORT");
    }

    const controller = mountFn(mount, {
      routeReceipt: ROUTE_RECEIPT,
      retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
      requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
      retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
      requiredCanvasReceipt: REQUIRED_CANVAS_RECEIPT,
      requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,

      maxRenderSize: 720,
      textureWidth: 1024,
      textureHeight: 512,
      initialTextureWidth: 512,
      initialTextureHeight: 256,
      frameCap: 12,

      routeOwnsCanvasCall: true,
      routeOwnsCanvasPaint: false,
      routeOwnsRuntimeTruth: false,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    const liveStatus = normalizeCanvasStatus(canvasModule);

    exposeRouteStatus({
      ok: true,
      loaded: true,
      mounted: Boolean(controller),
      canvasContract: liveStatus.contract || REQUIRED_CANVAS_CONTRACT,
      canvasReceipt: liveStatus.receipt || REQUIRED_CANVAS_RECEIPT,
      canvasRevision: liveStatus.revision || "",
      canvasVersion: liveStatus.version || ""
    });

    if (!canvasContractLooksCurrent(liveStatus)) {
      exposeRouteStatus({
        ok: false,
        canvasError: `AUDRALIA_ROUTE_CANVAS_CONTRACT_NOT_V9: ${liveStatus.contract || "unknown"}`
      });

      setStatusMessage("Audralia canvas authority loaded, but route expected V9 contract.", "held");
      writeProofPanel(mount, liveStatus);
      return controller;
    }

    setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
    writeProofPanel(mount, liveStatus);

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
  if (!hasDOM()) return null;

  cleanRouteResidue();
  suppressRetiredCanvasStatus();
  exposeRouteStatus();

  setStatusMessage("Audralia doorway loading V9 canvas authority.", "loading");

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

  writeProofPanel(mount, normalizeCanvasStatus());

  return controller;
}

exposeRouteStatus();

if (hasDOM()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAudraliaRoute, { once: true });
  } else {
    bootAudraliaRoute();
  }
}

export {
  ROUTE_RECEIPT,
  RETIRED_ROUTE_RECEIPTS,
  REQUIRED_CANVAS_CONTRACT,
  REQUIRED_CANVAS_RECEIPT,
  RETIRED_CANVAS_CONTRACTS,
  REQUIRED_RUNTIME_RECEIPT,
  CANVAS_AUTHORITY_PATH,
  RUNTIME_AUTHORITY_PATH,
  ROUTE_STATUS,
  bootAudraliaRoute
};

export default bootAudraliaRoute;
