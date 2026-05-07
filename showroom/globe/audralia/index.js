// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V13_RUNTIME_MOTION_ONLY_DYNAMIC_STATUS_BRIDGE_TNT_v1
// Full-file replacement. Route doorway authority only.
// Purpose:
// - Import runtime V10 motion-only authority.
// - Import existing canvas authority without rewriting canvas.
// - Mount canvas.
// - Stop stale V8/V9 runtime status from controlling public route text.
// - Route status reads runtime receipt dynamically.
// - No GraphicBox. No image generation. No visual-pass claim.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V13_RUNTIME_MOTION_ONLY_DYNAMIC_STATUS_BRIDGE_TNT_v1";
const EXPECTED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";
const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const EXPECTED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11";

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const CANVAS_PATH = "/assets/audralia/audralia.canvas.js";

const ROUTE_STATE = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  route: "/showroom/globe/audralia/",
  role: "audralia-doorway-runtime-motion-only-dynamic-status-bridge",

  runtimeReceipt: "",
  runtimeSummaryReceipt: "",
  runtimeSovereignty: "motion-only",
  runtimeVisualSovereignty: false,
  runtimeStatusVisible: false,
  runtimeSummaryVisible: false,

  canvasReceipt: EXPECTED_CANVAS_RECEIPT,
  canvasContract: EXPECTED_CANVAS_CONTRACT,
  canvasMounted: false,
  canvasStatusVisible: false,

  mountPresent: false,
  statusNodePresent: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  errors: []
};

function $(selector) {
  return document.querySelector(selector);
}

function resolveStatusNode() {
  return (
    $("#audralia-route-status") ||
    $("[data-audralia-route-status]") ||
    $("#audralia-status") ||
    $("[data-route-status]")
  );
}

function resolveMount() {
  return (
    $("#audralia-canvas-mount") ||
    $("[data-audralia-canvas-mount]") ||
    $("#audralia-mount") ||
    $("[data-audralia-mount]") ||
    $("[data-audralia-render-mount]")
  );
}

function asText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function firstString(...values) {
  for (const value of values) {
    const text = asText(value).trim();
    if (text) return text;
  }

  return "";
}

function safeCall(fn) {
  try {
    return typeof fn === "function" ? fn() : null;
  } catch (error) {
    ROUTE_STATE.errors.push(String(error?.message || error || "safe call failed"));
    return null;
  }
}

function readRuntime(runtimeModule) {
  const status = safeCall(() => runtimeModule.getStatus && runtimeModule.getStatus());

  const summary =
    safeCall(() => runtimeModule.getSummary && runtimeModule.getSummary()) ||
    safeCall(() => runtimeModule.getRuntimeSummary && runtimeModule.getRuntimeSummary());

  const windowStatus = window.__AUDRALIA_RUNTIME_STATUS__ || window.AUDRALIA_RUNTIME_STATUS || {};
  const windowSummary = window.__AUDRALIA_RUNTIME_SUMMARY__ || window.AUDRALIA_RUNTIME_SUMMARY || {};

  const receipt = firstString(
    runtimeModule.AUDRALIA_RUNTIME_RECEIPT_VALUE,
    status && status.receipt,
    summary && summary.receipt,
    windowStatus && windowStatus.receipt,
    windowSummary && windowSummary.receipt,
    EXPECTED_RUNTIME_RECEIPT
  );

  const summaryReceipt = firstString(
    summary && summary.receipt,
    windowSummary && windowSummary.receipt,
    status && status.summary && status.summary.receipt,
    receipt
  );

  ROUTE_STATE.runtimeReceipt = receipt;
  ROUTE_STATE.runtimeSummaryReceipt = summaryReceipt;
  ROUTE_STATE.runtimeSovereignty = firstString(
    status && status.runtimeSovereignty,
    summary && summary.runtimeSovereignty,
    "motion-only"
  );
  ROUTE_STATE.runtimeVisualSovereignty = false;
  ROUTE_STATE.runtimeStatusVisible = Boolean(status && status.receipt) || Boolean(windowStatus && windowStatus.receipt);
  ROUTE_STATE.runtimeSummaryVisible = Boolean(summary && summary.receipt) || Boolean(windowSummary && windowSummary.receipt);

  return {
    receipt,
    summaryReceipt,
    status,
    summary,
    module: runtimeModule
  };
}

function readCanvas(canvasModule) {
  const status =
    safeCall(() => canvasModule.getAudraliaCanvasStatus && canvasModule.getAudraliaCanvasStatus()) ||
    window.__AUDRALIA_CANVAS_STATUS__ ||
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ ||
    {};

  ROUTE_STATE.canvasReceipt = firstString(
    status.receipt,
    canvasModule.RECEIPT,
    EXPECTED_CANVAS_RECEIPT
  );

  ROUTE_STATE.canvasContract = firstString(
    status.contract,
    status.revision,
    canvasModule.CONTRACT,
    canvasModule.REVISION,
    EXPECTED_CANVAS_CONTRACT
  );

  ROUTE_STATE.canvasStatusVisible = Boolean(status && status.receipt);

  return {
    receipt: ROUTE_STATE.canvasReceipt,
    contract: ROUTE_STATE.canvasContract,
    status
  };
}

function publishRouteState(extra = {}) {
  Object.assign(ROUTE_STATE, extra);

  ROUTE_STATE.ok = Boolean(
    ROUTE_STATE.mountPresent &&
    ROUTE_STATE.canvasMounted &&
    ROUTE_STATE.runtimeReceipt
  );

  ROUTE_STATE.loaded = ROUTE_STATE.ok;

  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATE;
  window.__AUDRALIA_ROUTE_RECEIPT__ = ROUTE_RECEIPT;
  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  if (document.documentElement) {
    document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
    document.documentElement.dataset.audraliaRouteRuntimeReceipt = ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRouteRuntimeSovereignty = "motion-only";
    document.documentElement.dataset.audraliaRouteRuntimeVisualSovereignty = "false";
    document.documentElement.dataset.audraliaRouteRuntimeSummaryVisible = String(Boolean(ROUTE_STATE.runtimeSummaryVisible));
    document.documentElement.dataset.audraliaRouteCanvasReceipt = ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasMounted = String(Boolean(ROUTE_STATE.canvasMounted));
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-status", { detail: ROUTE_STATE }));
  } catch (_) {}

  return ROUTE_STATE;
}

function setStatusText(message) {
  const node = resolveStatusNode();
  ROUTE_STATE.statusNodePresent = Boolean(node);

  if (!node) return;

  node.textContent = message;
  node.setAttribute("data-audralia-route-loaded", "true");
  node.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  node.setAttribute("data-audralia-runtime-receipt", ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT);
  node.setAttribute("data-audralia-runtime-sovereignty", "motion-only");
  node.setAttribute("data-audralia-runtime-visual-sovereignty", "false");
  node.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
}

function buildStatusText() {
  return [
    "Audralia adopted canvas authority loaded.",
    `Route ${ROUTE_RECEIPT}`,
    `Canvas ${ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT}`,
    `Canvas receipt ${ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT}`,
    `Runtime ${ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    "Runtime sovereignty motion-only",
    "Runtime visual sovereignty false",
    `Runtime summary ${ROUTE_STATE.runtimeSummaryReceipt || ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    "Retired runtime visual-compositor receipts are non-controlling.",
    "GraphicBox false · Image generation false · Visual pass claimed false"
  ].join(" · ");
}

function removeStalePublicProofText() {
  const staleSnippets = [
    "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8",
    "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9",
    "AUDRALIA_ROUTE_V11_HARD_BIND_CANVAS_V11_CALLER_TNT_v1",
    "AUDRALIA_ROUTE_V12_RUNTIME_V9_DYNAMIC_STATUS_AND_SUMMARY_BRIDGE_TNT_v1"
  ];

  const nodes = document.querySelectorAll("p, div, span, li, aside");

  for (const node of nodes) {
    if (!node || node.children.length > 0) continue;

    const text = node.textContent || "";
    const hasStale = staleSnippets.some((snippet) => text.includes(snippet));

    if (hasStale && !node.matches("#audralia-route-status,[data-audralia-route-status]")) {
      node.remove();
    }
  }
}

function chooseMountFunction(canvasModule) {
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
    canvasModule.default?.render ||
    canvasModule.default?.mount ||
    canvasModule.default?.init ||
    window.mountAudraliaCanvas ||
    window.renderAudraliaCanvas
  );
}

function mountCanvas(canvasModule, runtimeInfo) {
  const mount = resolveMount();
  ROUTE_STATE.mountPresent = Boolean(mount);

  if (!mount) {
    ROUTE_STATE.errors.push("Audralia canvas mount not found.");
    return null;
  }

  const mountFn = chooseMountFunction(canvasModule);

  if (typeof mountFn !== "function") {
    ROUTE_STATE.errors.push("Audralia canvas mount function not found.");
    return null;
  }

  let controller = null;

  try {
    controller = mountFn(mount, {
      routeReceipt: ROUTE_RECEIPT,
      runtimeReceipt: runtimeInfo.receipt,
      runtimeSovereignty: "motion-only",
      runtimeVisualSovereignty: false,
      runtime: runtimeInfo.module || null,
      runtimeMotion: runtimeInfo.module || null,
      runtimeSummaryReceipt: runtimeInfo.summaryReceipt,
      canvasReceipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    ROUTE_STATE.canvasMounted = true;
  } catch (error) {
    ROUTE_STATE.canvasMounted = false;
    ROUTE_STATE.errors.push(String(error?.message || error || "canvas mount failed"));
  }

  return controller;
}

function attachRuntimeInteraction(runtimeModule) {
  if (!runtimeModule) return;

  safeCall(() => runtimeModule.start && runtimeModule.start());

  const mount = resolveMount();
  if (!mount) return;

  let lastX = 0;
  let lastY = 0;
  let active = false;

  mount.addEventListener(
    "pointerdown",
    (event) => {
      active = true;
      lastX = event.clientX;
      lastY = event.clientY;
      safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(true));
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

      safeCall(() => runtimeModule.applyDragImpulse && runtimeModule.applyDragImpulse(dx, dy, 1));
    },
    { passive: true }
  );

  function endPointer() {
    active = false;
    safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(false));
  }

  mount.addEventListener("pointerup", endPointer, { passive: true });
  mount.addEventListener("pointercancel", endPointer, { passive: true });
  mount.addEventListener("pointerleave", endPointer, { passive: true });
}

async function boot() {
  removeStalePublicProofText();

  let runtimeModule = null;
  let canvasModule = null;

  try {
    runtimeModule = await import(
      `${RUNTIME_PATH}?route=${encodeURIComponent(ROUTE_RECEIPT)}&motion=${encodeURIComponent(EXPECTED_RUNTIME_RECEIPT)}`
    );
  } catch (error) {
    ROUTE_STATE.errors.push(`runtime import failed: ${String(error?.message || error || "unknown")}`);
  }

  const runtimeInfo = runtimeModule
    ? readRuntime(runtimeModule)
    : {
        receipt: EXPECTED_RUNTIME_RECEIPT,
        summaryReceipt: EXPECTED_RUNTIME_RECEIPT,
        module: null,
        status: null,
        summary: null
      };

  try {
    canvasModule = await import(
      `${CANVAS_PATH}?route=${encodeURIComponent(ROUTE_RECEIPT)}&runtime=${encodeURIComponent(runtimeInfo.receipt)}`
    );
  } catch (error) {
    ROUTE_STATE.errors.push(`canvas import failed: ${String(error?.message || error || "unknown")}`);
  }

  if (canvasModule) {
    readCanvas(canvasModule);
    mountCanvas(canvasModule, runtimeInfo);
  }

  attachRuntimeInteraction(runtimeModule);

  publishRouteState({
    runtimeReceipt: runtimeInfo.receipt,
    runtimeSummaryReceipt: runtimeInfo.summaryReceipt,
    runtimeSovereignty: "motion-only",
    runtimeVisualSovereignty: false
  });

  setStatusText(buildStatusText());

  window.addEventListener("audralia:canvas-authority-status", (event) => {
    const detail = event.detail || {};

    ROUTE_STATE.canvasStatusVisible = true;
    ROUTE_STATE.canvasReceipt = firstString(detail.receipt, ROUTE_STATE.canvasReceipt, EXPECTED_CANVAS_RECEIPT);
    ROUTE_STATE.canvasContract = firstString(
      detail.contract,
      detail.revision,
      ROUTE_STATE.canvasContract,
      EXPECTED_CANVAS_CONTRACT
    );
    ROUTE_STATE.canvasMounted = true;

    publishRouteState();
    setStatusText(buildStatusText());
  });

  window.addEventListener("audralia:runtime-status", (event) => {
    const detail = event.detail || {};

    ROUTE_STATE.runtimeStatusVisible = true;
    ROUTE_STATE.runtimeReceipt = firstString(detail.receipt, ROUTE_STATE.runtimeReceipt, EXPECTED_RUNTIME_RECEIPT);
    ROUTE_STATE.runtimeSummaryReceipt = firstString(
      detail.summary && detail.summary.receipt,
      ROUTE_STATE.runtimeSummaryReceipt,
      ROUTE_STATE.runtimeReceipt
    );
    ROUTE_STATE.runtimeSummaryVisible = Boolean(detail.summary && detail.summary.receipt);
    ROUTE_STATE.runtimeSovereignty = "motion-only";
    ROUTE_STATE.runtimeVisualSovereignty = false;

    publishRouteState();
    setStatusText(buildStatusText());
  });

  return ROUTE_STATE;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  ROUTE_RECEIPT,
  EXPECTED_RUNTIME_RECEIPT,
  EXPECTED_CANVAS_RECEIPT,
  EXPECTED_CANVAS_CONTRACT,
  ROUTE_STATE,
  boot
};

export default boot;
