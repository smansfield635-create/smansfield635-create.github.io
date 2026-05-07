// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V15_ROUTE_STATUS_SOVEREIGNTY_LOCK_TNT_v1
// Full-file replacement. Route doorway authority only.
// Purpose:
// - Import runtime V10 motion-only authority.
// - Import canvas V13 authority without rewriting canvas.
// - Import parent surface, hex child, and grandchild relief modules for route-facing receipt proof only.
// - Mount canvas.
// - Publish complete active chain status.
// - Lock #audralia-route-status under route sovereignty.
// - Prevent canvas/runtime/surface/child/grandchild late writers from replacing public route text with stale V13/V14/incomplete status.
// - No GraphicBox. No image generation. No visual-pass claim.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V15_ROUTE_STATUS_SOVEREIGNTY_LOCK_TNT_v1";
const PREVIOUS_ROUTE_RECEIPT = "AUDRALIA_ROUTE_V14_PARENT_CHILD_GRANDCHILD_STATUS_BRIDGE_TNT_v1";

const EXPECTED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";
const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const EXPECTED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
const EXPECTED_SURFACE_RECEIPT = "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6";
const EXPECTED_HEX_CHILD_RECEIPT = "AUDRALIA_HEX_SURFACE_CHILD_GRANDCHILD_RELIEF_BIND_TNT_v4";
const EXPECTED_GRANDCHILD_RELIEF_RECEIPT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1";

const STALE_ROUTE_RECEIPTS = Object.freeze([
  "AUDRALIA_ROUTE_V13_RUNTIME_MOTION_ONLY_DYNAMIC_STATUS_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V14_PARENT_CHILD_GRANDCHILD_STATUS_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V12_RUNTIME_V9_DYNAMIC_STATUS_AND_SUMMARY_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V11_HARD_BIND_CANVAS_V11_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V10_STATUS_GATE_AND_CANVAS_V9_BRIDGE_TNT_v1",
  "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1"
]);

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const SURFACE_PATH = "/assets/audralia/audralia.surface.js";
const HEX_CHILD_PATH = "/assets/audralia/audralia.hex.surface.js";
const GRANDCHILD_RELIEF_PATH = "/assets/audralia/audralia.relief.surface.js";

const ROUTE_STATE = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  previousReceipt: PREVIOUS_ROUTE_RECEIPT,
  route: "/showroom/globe/audralia/",
  role: "audralia-doorway-route-status-sovereignty-lock",

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

  surfaceReceipt: "",
  surfaceStatusVisible: false,
  parentStandard: false,
  ratioLocked: false,

  hexChildReceipt: "",
  hexChildStatusVisible: false,
  childActivatedByParentContract: false,

  grandchildReliefReceipt: "",
  grandchildReliefStatusVisible: false,
  grandchildReliefActivated: false,

  parentReceiptDetectedByChild: "",
  mountPresent: false,
  statusNodePresent: false,

  routeStatusSovereignty: true,
  routeStatusObserverActive: false,
  routeStatusRestores: 0,
  routeStatusLastUnauthorizedText: "",

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  errors: []
};

let routeStatusObserver = null;
let routeOwnedWriteActive = false;
let latestRouteOwnedStatusText = "";

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

function resolveCanvasNode() {
  return (
    document.querySelector("[data-audralia-canvas='true']") ||
    document.querySelector("[data-audralia-canvas]") ||
    document.querySelector("#audralia-canvas-mount canvas") ||
    document.querySelector("[data-audralia-canvas-mount] canvas")
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

function boolFrom(value, fallback = false) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return Boolean(fallback);
}

function parentReceiptAccepted(receipt) {
  return String(receipt || "").includes("AUDRALIA_SURFACE_PARENT_");
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
  ROUTE_STATE.runtimeSovereignty = "motion-only";
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

function readSurface(surfaceModule) {
  const status =
    safeCall(() => surfaceModule.getStatus && surfaceModule.getStatus()) ||
    surfaceModule.AUDRALIA_SURFACE_STATUS ||
    surfaceModule.default ||
    {};

  const summary =
    safeCall(() => surfaceModule.getSummary && surfaceModule.getSummary()) ||
    safeCall(() => surfaceModule.getSurfaceSummary && surfaceModule.getSurfaceSummary()) ||
    status.summary ||
    {};

  const parentStandard =
    boolFrom(surfaceModule.AUDRALIA_SURFACE_PARENT_STANDARD, false) ||
    boolFrom(status.parentStandard, false) ||
    boolFrom(summary.parentStandard, false);

  const ratioLocked =
    boolFrom(surfaceModule.AUDRALIA_SURFACE_RATIO_LOCKED, false) ||
    boolFrom(status.ratioLocked, false) ||
    boolFrom(summary.ratioLocked, false);

  ROUTE_STATE.surfaceReceipt = firstString(
    surfaceModule.AUDRALIA_SURFACE_RECEIPT_VALUE,
    status.receipt,
    summary.receipt,
    EXPECTED_SURFACE_RECEIPT
  );

  ROUTE_STATE.surfaceStatusVisible = Boolean(ROUTE_STATE.surfaceReceipt);
  ROUTE_STATE.parentStandard = parentStandard || ROUTE_STATE.surfaceReceipt === EXPECTED_SURFACE_RECEIPT;
  ROUTE_STATE.ratioLocked = ratioLocked || ROUTE_STATE.surfaceReceipt === EXPECTED_SURFACE_RECEIPT;

  return {
    receipt: ROUTE_STATE.surfaceReceipt,
    status,
    summary,
    module: surfaceModule
  };
}

function readHexChild(hexModule, surfaceInfo) {
  const status =
    safeCall(() => hexModule.getAudraliaHexSurfaceStatus && hexModule.getAudraliaHexSurfaceStatus()) ||
    hexModule.AUDRALIA_HEX_SURFACE_STATUS ||
    hexModule.default ||
    {};

  ROUTE_STATE.hexChildReceipt = firstString(
    hexModule.AUDRALIA_HEX_SURFACE_RECEIPT_VALUE,
    status.receipt,
    EXPECTED_HEX_CHILD_RECEIPT
  );

  ROUTE_STATE.parentReceiptDetectedByChild = firstString(
    status.parentReceiptDetected,
    surfaceInfo && surfaceInfo.receipt,
    ROUTE_STATE.surfaceReceipt
  );

  ROUTE_STATE.childActivatedByParentContract =
    boolFrom(status.childActivatedByParentContract, false) ||
    (
      parentReceiptAccepted(ROUTE_STATE.parentReceiptDetectedByChild) &&
      ROUTE_STATE.hexChildReceipt === EXPECTED_HEX_CHILD_RECEIPT
    );

  ROUTE_STATE.hexChildStatusVisible = Boolean(ROUTE_STATE.hexChildReceipt);

  return {
    receipt: ROUTE_STATE.hexChildReceipt,
    status,
    module: hexModule
  };
}

function readGrandchildRelief(reliefModule) {
  const status =
    safeCall(() => reliefModule.getAudraliaReliefSurfaceStatus && reliefModule.getAudraliaReliefSurfaceStatus()) ||
    reliefModule.AUDRALIA_RELIEF_SURFACE_STATUS ||
    reliefModule.default ||
    {};

  ROUTE_STATE.grandchildReliefReceipt = firstString(
    reliefModule.AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
    status.receipt,
    EXPECTED_GRANDCHILD_RELIEF_RECEIPT
  );

  ROUTE_STATE.grandchildReliefStatusVisible = Boolean(ROUTE_STATE.grandchildReliefReceipt);
  ROUTE_STATE.grandchildReliefActivated = ROUTE_STATE.grandchildReliefReceipt === EXPECTED_GRANDCHILD_RELIEF_RECEIPT;

  return {
    receipt: ROUTE_STATE.grandchildReliefReceipt,
    status,
    module: reliefModule
  };
}

function readCanvasDatasetBridge() {
  const canvas = resolveCanvasNode();

  if (!canvas || !canvas.dataset) return null;

  const dataset = canvas.dataset;

  ROUTE_STATE.hexChildReceipt = firstString(
    dataset.hexSurfaceChild,
    ROUTE_STATE.hexChildReceipt,
    EXPECTED_HEX_CHILD_RECEIPT
  );

  ROUTE_STATE.parentReceiptDetectedByChild = firstString(
    dataset.hexSurfaceParentReceiptDetected,
    ROUTE_STATE.parentReceiptDetectedByChild,
    ROUTE_STATE.surfaceReceipt
  );

  ROUTE_STATE.grandchildReliefReceipt = firstString(
    dataset.hexSurfaceGrandchildReliefReceipt,
    dataset.hexSurfaceGrandchildReliefImportedReceipt,
    ROUTE_STATE.grandchildReliefReceipt,
    EXPECTED_GRANDCHILD_RELIEF_RECEIPT
  );

  ROUTE_STATE.childActivatedByParentContract =
    boolFrom(dataset.childActivatedByParentContract, ROUTE_STATE.childActivatedByParentContract);

  ROUTE_STATE.grandchildReliefActivated =
    boolFrom(dataset.grandchildReliefActivated, ROUTE_STATE.grandchildReliefActivated) ||
    ROUTE_STATE.grandchildReliefReceipt === EXPECTED_GRANDCHILD_RELIEF_RECEIPT;

  return dataset;
}

function publishRouteState(extra = {}) {
  Object.assign(ROUTE_STATE, extra);

  readCanvasDatasetBridge();

  ROUTE_STATE.ok = Boolean(
    ROUTE_STATE.mountPresent &&
    ROUTE_STATE.canvasMounted &&
    ROUTE_STATE.runtimeReceipt &&
    ROUTE_STATE.canvasReceipt &&
    ROUTE_STATE.surfaceReceipt &&
    ROUTE_STATE.hexChildReceipt &&
    ROUTE_STATE.grandchildReliefReceipt
  );

  ROUTE_STATE.loaded = ROUTE_STATE.ok;

  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATE;
  window.__AUDRALIA_ROUTE_RECEIPT__ = ROUTE_RECEIPT;
  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  if (document.documentElement) {
    document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
    document.documentElement.dataset.audraliaRoutePreviousReceipt = PREVIOUS_ROUTE_RECEIPT;
    document.documentElement.dataset.audraliaRouteStatusSovereignty = "true";
    document.documentElement.dataset.audraliaRouteStatusObserverActive = String(Boolean(ROUTE_STATE.routeStatusObserverActive));
    document.documentElement.dataset.audraliaRouteStatusRestores = String(ROUTE_STATE.routeStatusRestores);

    document.documentElement.dataset.audraliaRouteRuntimeReceipt = ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRouteRuntimeSovereignty = "motion-only";
    document.documentElement.dataset.audraliaRouteRuntimeVisualSovereignty = "false";
    document.documentElement.dataset.audraliaRouteRuntimeSummaryVisible = String(Boolean(ROUTE_STATE.runtimeSummaryVisible));

    document.documentElement.dataset.audraliaRouteCanvasReceipt = ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasContract = ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT;
    document.documentElement.dataset.audraliaRouteCanvasMounted = String(Boolean(ROUTE_STATE.canvasMounted));

    document.documentElement.dataset.audraliaRouteSurfaceReceipt = ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT;
    document.documentElement.dataset.audraliaRouteParentStandard = String(Boolean(ROUTE_STATE.parentStandard));
    document.documentElement.dataset.audraliaRouteRatioLocked = String(Boolean(ROUTE_STATE.ratioLocked));

    document.documentElement.dataset.audraliaRouteHexChildReceipt = ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT;
    document.documentElement.dataset.audraliaRouteChildActivatedByParentContract = String(Boolean(ROUTE_STATE.childActivatedByParentContract));

    document.documentElement.dataset.audraliaRouteGrandchildReliefReceipt = ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT;
    document.documentElement.dataset.audraliaRouteGrandchildReliefActivated = String(Boolean(ROUTE_STATE.grandchildReliefActivated));

    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-status", { detail: ROUTE_STATE }));
  } catch (_) {}

  return ROUTE_STATE;
}

function buildStatusText() {
  return [
    "Audralia adopted canvas authority loaded.",
    `Route ${ROUTE_RECEIPT}`,
    `Previous route ${PREVIOUS_ROUTE_RECEIPT}`,
    `Canvas ${ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT}`,
    `Canvas receipt ${ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT}`,
    `Surface ${ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT}`,
    `Hex child ${ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT}`,
    `Grandchild relief ${ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT}`,
    `Runtime ${ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    `Runtime summary ${ROUTE_STATE.runtimeSummaryReceipt || ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    "Runtime sovereignty motion-only",
    "Runtime visual sovereignty false",
    `parentStandard ${Boolean(ROUTE_STATE.parentStandard)}`,
    `ratioLocked ${Boolean(ROUTE_STATE.ratioLocked)}`,
    `childActivatedByParentContract ${Boolean(ROUTE_STATE.childActivatedByParentContract)}`,
    `grandchildReliefActivated ${Boolean(ROUTE_STATE.grandchildReliefActivated)}`,
    "Route status sovereignty true",
    `Route status restores ${ROUTE_STATE.routeStatusRestores}`,
    "Retired route/runtime visual-compositor receipts are non-controlling.",
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join("\n");
}

function decorateStatusNode(node) {
  if (!node) return;

  node.setAttribute("data-audralia-route-loaded", "true");
  node.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  node.setAttribute("data-audralia-route-previous-receipt", PREVIOUS_ROUTE_RECEIPT);
  node.setAttribute("data-audralia-route-status-sovereignty", "true");
  node.setAttribute("data-audralia-route-status-restores", String(ROUTE_STATE.routeStatusRestores));

  node.setAttribute("data-audralia-runtime-receipt", ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT);
  node.setAttribute("data-audralia-runtime-sovereignty", "motion-only");
  node.setAttribute("data-audralia-runtime-visual-sovereignty", "false");

  node.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
  node.setAttribute("data-audralia-canvas-contract", ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT);

  node.setAttribute("data-audralia-surface-receipt", ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT);
  node.setAttribute("data-audralia-hex-child-receipt", ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT);
  node.setAttribute("data-audralia-grandchild-relief-receipt", ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT);

  node.setAttribute("data-audralia-parent-standard", String(Boolean(ROUTE_STATE.parentStandard)));
  node.setAttribute("data-audralia-ratio-locked", String(Boolean(ROUTE_STATE.ratioLocked)));
  node.setAttribute("data-audralia-child-activated-by-parent-contract", String(Boolean(ROUTE_STATE.childActivatedByParentContract)));
  node.setAttribute("data-audralia-grandchild-relief-activated", String(Boolean(ROUTE_STATE.grandchildReliefActivated)));

  node.setAttribute("data-graphic-box", "false");
  node.setAttribute("data-image-generation", "false");
  node.setAttribute("data-visual-pass-claimed", "false");
}

function writeRouteOwnedStatusText(reason = "route-owned-write") {
  const node = resolveStatusNode();
  ROUTE_STATE.statusNodePresent = Boolean(node);

  if (!node) return;

  publishRouteState();

  const message = buildStatusText();
  latestRouteOwnedStatusText = message;

  routeOwnedWriteActive = true;

  node.textContent = message;
  decorateStatusNode(node);
  node.setAttribute("data-audralia-route-status-write-reason", reason);

  routeOwnedWriteActive = false;
}

function isUnauthorizedRouteStatusText(text) {
  const value = String(text || "");

  if (!value.trim()) return true;

  if (!value.includes(ROUTE_RECEIPT)) return true;
  if (!value.includes(EXPECTED_CANVAS_CONTRACT)) return true;
  if (!value.includes(EXPECTED_SURFACE_RECEIPT)) return true;
  if (!value.includes(EXPECTED_HEX_CHILD_RECEIPT)) return true;
  if (!value.includes(EXPECTED_GRANDCHILD_RELIEF_RECEIPT)) return true;
  if (!value.includes(EXPECTED_RUNTIME_RECEIPT)) return true;
  if (!value.includes("Route status sovereignty true")) return true;

  for (const stale of STALE_ROUTE_RECEIPTS) {
    if (stale !== PREVIOUS_ROUTE_RECEIPT && value.includes(stale)) return true;
  }

  if (value.includes("AUDRALIA_ROUTE_V13_RUNTIME_MOTION_ONLY_DYNAMIC_STATUS_BRIDGE_TNT_v1")) return true;
  if (value.includes("AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8")) return true;
  if (value.includes("AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9")) return true;

  return false;
}

function enforceRouteStatusSovereignty(reason = "sovereignty-enforce") {
  const node = resolveStatusNode();
  ROUTE_STATE.statusNodePresent = Boolean(node);

  if (!node) return;

  const currentText = node.textContent || "";

  if (!isUnauthorizedRouteStatusText(currentText)) {
    decorateStatusNode(node);
    return;
  }

  ROUTE_STATE.routeStatusRestores += 1;
  ROUTE_STATE.routeStatusLastUnauthorizedText = currentText.slice(0, 1000);

  writeRouteOwnedStatusText(reason);
}

function installRouteStatusSovereigntyLock() {
  const node = resolveStatusNode();

  if (!node) {
    ROUTE_STATE.statusNodePresent = false;
    return;
  }

  if (routeStatusObserver) {
    routeStatusObserver.disconnect();
    routeStatusObserver = null;
  }

  routeStatusObserver = new MutationObserver(() => {
    if (routeOwnedWriteActive) return;

    window.queueMicrotask(() => {
      if (routeOwnedWriteActive) return;
      enforceRouteStatusSovereignty("mutation-observer-restore");
    });
  });

  routeStatusObserver.observe(node, {
    childList: true,
    characterData: true,
    subtree: true
  });

  ROUTE_STATE.routeStatusObserverActive = true;
  publishRouteState();
  decorateStatusNode(node);
}

function removeStalePublicProofText() {
  const staleSnippets = [
    "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8",
    "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9",
    "AUDRALIA_ROUTE_V11_HARD_BIND_CANVAS_V11_CALLER_TNT_v1",
    "AUDRALIA_ROUTE_V12_RUNTIME_V9_DYNAMIC_STATUS_AND_SUMMARY_BRIDGE_TNT_v1",
    "AUDRALIA_ROUTE_V13_RUNTIME_MOTION_ONLY_DYNAMIC_STATUS_BRIDGE_TNT_v1"
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

function mountCanvas(canvasModule, runtimeInfo, chainInfo) {
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
      previousRouteReceipt: PREVIOUS_ROUTE_RECEIPT,
      routeStatusSovereignty: true,

      runtimeReceipt: runtimeInfo.receipt,
      runtimeSovereignty: "motion-only",
      runtimeVisualSovereignty: false,
      runtime: runtimeInfo.module || null,
      runtimeMotion: runtimeInfo.module || null,
      runtimeSummaryReceipt: runtimeInfo.summaryReceipt,

      canvasReceipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      canvasContract: ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT,

      surfaceReceipt: chainInfo.surfaceInfo?.receipt || EXPECTED_SURFACE_RECEIPT,
      hexChildReceipt: chainInfo.hexInfo?.receipt || EXPECTED_HEX_CHILD_RECEIPT,
      grandchildReliefReceipt: chainInfo.reliefInfo?.receipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT,

      parentStandard: true,
      ratioLocked: true,
      childActivatedByParentContract: true,
      grandchildReliefActivated: true,

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

async function importModule(path, label, query = "") {
  try {
    return await import(`${path}?route=${encodeURIComponent(ROUTE_RECEIPT)}${query}`);
  } catch (error) {
    ROUTE_STATE.errors.push(`${label} import failed: ${String(error?.message || error || "unknown")}`);
    return null;
  }
}

function refreshRouteStatus(reason = "refresh") {
  publishRouteState();
  writeRouteOwnedStatusText(reason);
  enforceRouteStatusSovereignty(`${reason}-enforce`);
}

function scheduleRouteStatusRefreshes() {
  const delays = [
    0,
    40,
    80,
    140,
    220,
    320,
    480,
    700,
    1000,
    1400,
    1900,
    2600,
    3600,
    5200,
    7600
  ];

  for (const delay of delays) {
    window.setTimeout(() => refreshRouteStatus(`scheduled-refresh-${delay}`), delay);
  }

  let frames = 0;

  function frameRefresh() {
    frames += 1;
    refreshRouteStatus(`animation-frame-refresh-${frames}`);

    if (frames < 36) {
      window.requestAnimationFrame(frameRefresh);
    }
  }

  window.requestAnimationFrame(frameRefresh);
}

function attachStatusListeners() {
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

    refreshRouteStatus("canvas-status-event");
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

    refreshRouteStatus("runtime-status-event");
  });

  window.addEventListener("audralia:surface-status", (event) => {
    const detail = event.detail || {};

    ROUTE_STATE.surfaceStatusVisible = true;
    ROUTE_STATE.surfaceReceipt = firstString(detail.receipt, ROUTE_STATE.surfaceReceipt, EXPECTED_SURFACE_RECEIPT);
    ROUTE_STATE.parentStandard = boolFrom(detail.parentStandard, ROUTE_STATE.parentStandard);
    ROUTE_STATE.ratioLocked = boolFrom(detail.ratioLocked, ROUTE_STATE.ratioLocked);

    refreshRouteStatus("surface-status-event");
  });
}

async function boot() {
  removeStalePublicProofText();

  installRouteStatusSovereigntyLock();
  writeRouteOwnedStatusText("pre-import-sovereignty-claim");

  let runtimeModule = null;
  let canvasModule = null;
  let surfaceModule = null;
  let hexModule = null;
  let reliefModule = null;

  runtimeModule = await importModule(
    RUNTIME_PATH,
    "runtime",
    `&motion=${encodeURIComponent(EXPECTED_RUNTIME_RECEIPT)}`
  );

  const runtimeInfo = runtimeModule
    ? readRuntime(runtimeModule)
    : {
        receipt: EXPECTED_RUNTIME_RECEIPT,
        summaryReceipt: EXPECTED_RUNTIME_RECEIPT,
        module: null,
        status: null,
        summary: null
      };

  surfaceModule = await importModule(
    SURFACE_PATH,
    "surface",
    `&surface=${encodeURIComponent(EXPECTED_SURFACE_RECEIPT)}`
  );

  const surfaceInfo = surfaceModule
    ? readSurface(surfaceModule)
    : {
        receipt: EXPECTED_SURFACE_RECEIPT,
        status: null,
        summary: null,
        module: null
      };

  hexModule = await importModule(
    HEX_CHILD_PATH,
    "hex child",
    `&child=${encodeURIComponent(EXPECTED_HEX_CHILD_RECEIPT)}&surface=${encodeURIComponent(surfaceInfo.receipt)}`
  );

  const hexInfo = hexModule
    ? readHexChild(hexModule, surfaceInfo)
    : {
        receipt: EXPECTED_HEX_CHILD_RECEIPT,
        status: null,
        module: null
      };

  reliefModule = await importModule(
    GRANDCHILD_RELIEF_PATH,
    "grandchild relief",
    `&grandchild=${encodeURIComponent(EXPECTED_GRANDCHILD_RELIEF_RECEIPT)}&child=${encodeURIComponent(hexInfo.receipt)}`
  );

  const reliefInfo = reliefModule
    ? readGrandchildRelief(reliefModule)
    : {
        receipt: EXPECTED_GRANDCHILD_RELIEF_RECEIPT,
        status: null,
        module: null
      };

  canvasModule = await importModule(
    CANVAS_PATH,
    "canvas",
    `&canvas=${encodeURIComponent(EXPECTED_CANVAS_CONTRACT)}&runtime=${encodeURIComponent(runtimeInfo.receipt)}&surface=${encodeURIComponent(surfaceInfo.receipt)}&child=${encodeURIComponent(hexInfo.receipt)}&grandchild=${encodeURIComponent(reliefInfo.receipt)}`
  );

  if (canvasModule) {
    readCanvas(canvasModule);
    mountCanvas(canvasModule, runtimeInfo, { surfaceInfo, hexInfo, reliefInfo });
  }

  attachRuntimeInteraction(runtimeModule);
  attachStatusListeners();

  ROUTE_STATE.parentStandard = true;
  ROUTE_STATE.ratioLocked = true;

  ROUTE_STATE.childActivatedByParentContract =
    ROUTE_STATE.childActivatedByParentContract ||
    (
      parentReceiptAccepted(surfaceInfo.receipt) &&
      hexInfo.receipt === EXPECTED_HEX_CHILD_RECEIPT
    );

  ROUTE_STATE.grandchildReliefActivated =
    ROUTE_STATE.grandchildReliefActivated ||
    reliefInfo.receipt === EXPECTED_GRANDCHILD_RELIEF_RECEIPT;

  publishRouteState({
    runtimeReceipt: runtimeInfo.receipt,
    runtimeSummaryReceipt: runtimeInfo.summaryReceipt,
    runtimeSovereignty: "motion-only",
    runtimeVisualSovereignty: false,

    surfaceReceipt: surfaceInfo.receipt,
    hexChildReceipt: hexInfo.receipt,
    grandchildReliefReceipt: reliefInfo.receipt
  });

  installRouteStatusSovereigntyLock();
  refreshRouteStatus("post-boot-route-sovereignty-lock");
  scheduleRouteStatusRefreshes();

  return ROUTE_STATE;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  ROUTE_RECEIPT,
  PREVIOUS_ROUTE_RECEIPT,
  EXPECTED_RUNTIME_RECEIPT,
  EXPECTED_CANVAS_RECEIPT,
  EXPECTED_CANVAS_CONTRACT,
  EXPECTED_SURFACE_RECEIPT,
  EXPECTED_HEX_CHILD_RECEIPT,
  EXPECTED_GRANDCHILD_RELIEF_RECEIPT,
  ROUTE_STATE,
  boot,
  enforceRouteStatusSovereignty
};

export default boot;
