// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V16_CANONICAL_MOUNT_CANVAS_ATTACHMENT_JS_TNT_v1
// Full-file replacement. Route doorway authority only.
// Purpose:
// - Locate one canonical mount.
// - Import Audralia canvas authority.
// - Call the canvas authority mount function.
// - Verify live canvas presence after the mount call.
// - Publish honest route status.
// - Do not render Audralia directly.
// - Do not mutate Gauges.
// - Do not use GraphicBox.
// - Do not use image generation.
// - Do not claim visual pass.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V16_CANONICAL_MOUNT_CANVAS_ATTACHMENT_TNT_v1";
const JS_RECEIPT = "AUDRALIA_ROUTE_V16_CANONICAL_MOUNT_CANVAS_ATTACHMENT_JS_TNT_v1";
const PREVIOUS_ROUTE_RECEIPT = "AUDRALIA_ROUTE_V15_ROUTE_STATUS_SOVEREIGNTY_LOCK_TNT_v1";

const CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const SURFACE_PATH = "/assets/audralia/audralia.surface.js";
const HEX_CHILD_PATH = "/assets/audralia/audralia.hex.surface.js";
const GRANDCHILD_RELIEF_PATH = "/assets/audralia/audralia.relief.surface.js";

const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const EXPECTED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
const EXPECTED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";
const EXPECTED_SURFACE_RECEIPT = "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6";
const EXPECTED_HEX_CHILD_RECEIPT = "AUDRALIA_HEX_SURFACE_CHILD_GRANDCHILD_RELIEF_BIND_TNT_v4";
const EXPECTED_GRANDCHILD_RELIEF_RECEIPT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1";

const ROUTE_STATE = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  jsReceipt: JS_RECEIPT,
  previousRouteReceipt: PREVIOUS_ROUTE_RECEIPT,
  route: "/showroom/globe/audralia/",
  classification: "DOORWAY_ATTACHMENT_REPAIR",

  mountFound: false,
  mountId: "audralia-canvas-mount",
  statusNodeFound: false,

  importsAttempted: false,
  canvasAuthorityImported: false,
  canvasMountFunctionFound: false,
  mountCallAttempted: false,
  mountCallSucceeded: false,

  canvasFoundAfterMount: false,
  canvasReceiptVisible: false,
  canvasContractVisible: false,
  canvasReceipt: "",
  canvasContract: "",

  runtimeImported: false,
  runtimeReceipt: "",
  surfaceImported: false,
  surfaceReceipt: "",
  hexChildImported: false,
  hexChildReceipt: "",
  grandchildReliefImported: false,
  grandchildReliefReceipt: "",

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  heavyRuntimeLoaded: false,

  errors: [],
  lastUpdated: ""
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

function resolveCanvasNode() {
  const mount = resolveMount();

  return (
    document.querySelector("[data-audralia-canvas='true']") ||
    document.querySelector("[data-audralia-canvas]") ||
    (mount && mount.querySelector("canvas")) ||
    document.querySelector("#audralia-canvas-mount canvas")
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

function safeCall(fn, fallback = null) {
  try {
    return typeof fn === "function" ? fn() : fallback;
  } catch (error) {
    ROUTE_STATE.errors.push(String(error?.message || error || "safe call failed"));
    return fallback;
  }
}

function publishState(extra = {}) {
  Object.assign(ROUTE_STATE, extra);
  ROUTE_STATE.lastUpdated = new Date().toISOString();

  const canvas = resolveCanvasNode();
  const statusNode = resolveStatusNode();
  const mount = resolveMount();

  ROUTE_STATE.mountFound = Boolean(mount);
  ROUTE_STATE.statusNodeFound = Boolean(statusNode);
  ROUTE_STATE.canvasFoundAfterMount = Boolean(canvas) || ROUTE_STATE.canvasFoundAfterMount;

  if (canvas) {
    canvas.setAttribute("data-audralia-canvas", "true");
    canvas.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
    canvas.setAttribute("data-audralia-route-js-receipt", JS_RECEIPT);

    if (!canvas.getAttribute("data-audralia-canvas-receipt")) {
      canvas.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
    }

    if (!canvas.getAttribute("data-audralia-canvas-contract")) {
      canvas.setAttribute("data-audralia-canvas-contract", ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT);
    }
  }

  ROUTE_STATE.ok = Boolean(
    ROUTE_STATE.mountFound &&
    ROUTE_STATE.canvasAuthorityImported &&
    ROUTE_STATE.canvasMountFunctionFound &&
    ROUTE_STATE.mountCallAttempted &&
    ROUTE_STATE.mountCallSucceeded &&
    ROUTE_STATE.canvasFoundAfterMount
  );

  ROUTE_STATE.loaded = ROUTE_STATE.ok;

  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATE;
  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATE;
  window.__AUDRALIA_ROUTE_RECEIPT__ = ROUTE_RECEIPT;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;

  if (!window.__AUDRALIA_CANVAS_STATUS__) {
    window.__AUDRALIA_CANVAS_STATUS__ = {
      receipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      contract: ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT,
      routeReceipt: ROUTE_RECEIPT,
      routeJsReceipt: JS_RECEIPT,
      bridgedByRoute: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    };
  }

  document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteJsReceipt = JS_RECEIPT;
  document.documentElement.dataset.audraliaRoutePreviousReceipt = PREVIOUS_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteMountFound = String(Boolean(ROUTE_STATE.mountFound));
  document.documentElement.dataset.audraliaRouteCanvasAuthorityImported = String(Boolean(ROUTE_STATE.canvasAuthorityImported));
  document.documentElement.dataset.audraliaRouteMountCallAttempted = String(Boolean(ROUTE_STATE.mountCallAttempted));
  document.documentElement.dataset.audraliaRouteMountCallSucceeded = String(Boolean(ROUTE_STATE.mountCallSucceeded));
  document.documentElement.dataset.audraliaRouteCanvasFoundAfterMount = String(Boolean(ROUTE_STATE.canvasFoundAfterMount));
  document.documentElement.dataset.audraliaRouteCanvasReceipt = ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaRouteCanvasContract = ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT;
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
  document.documentElement.dataset.heavyRuntimeLoaded = "false";

  writeStatus();

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-status", { detail: ROUTE_STATE }));
  } catch (_) {}

  return ROUTE_STATE;
}

function writeStatus() {
  const node = resolveStatusNode();
  if (!node) return;

  const lines = [
    ROUTE_STATE.ok
      ? "Audralia V16 canonical mount attachment complete."
      : "Audralia V16 canonical mount attachment in progress.",
    `Route ${ROUTE_RECEIPT}`,
    `Previous route ${PREVIOUS_ROUTE_RECEIPT}`,
    `Mount found ${Boolean(ROUTE_STATE.mountFound)}`,
    `Canvas authority imported ${Boolean(ROUTE_STATE.canvasAuthorityImported)}`,
    `Mount function found ${Boolean(ROUTE_STATE.canvasMountFunctionFound)}`,
    `Mount call attempted ${Boolean(ROUTE_STATE.mountCallAttempted)}`,
    `Mount call succeeded ${Boolean(ROUTE_STATE.mountCallSucceeded)}`,
    `Canvas found after mount ${Boolean(ROUTE_STATE.canvasFoundAfterMount)}`,
    `Canvas receipt ${ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT}`,
    `Canvas contract ${ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT}`,
    `Runtime ${ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT}`,
    `Surface ${ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT}`,
    `Hex child ${ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT}`,
    `Grandchild relief ${ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ];

  if (ROUTE_STATE.errors.length) {
    lines.push(`Errors ${ROUTE_STATE.errors.slice(-3).join(" | ")}`);
  }

  node.textContent = lines.join("\n");
  node.setAttribute("data-audralia-route-loaded", String(Boolean(ROUTE_STATE.ok)));
  node.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  node.setAttribute("data-audralia-route-js-receipt", JS_RECEIPT);
  node.setAttribute("data-audralia-canvas-mounted", String(Boolean(ROUTE_STATE.canvasFoundAfterMount)));
  node.setAttribute("data-audralia-canvas-receipt", ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT);
  node.setAttribute("data-audralia-canvas-contract", ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT);
  node.setAttribute("data-graphic-box", "false");
  node.setAttribute("data-image-generation", "false");
  node.setAttribute("data-visual-pass-claimed", "false");
}

async function importOptionalModule(path, label) {
  try {
    const module = await import(`${path}?route=${encodeURIComponent(ROUTE_RECEIPT)}&v=${encodeURIComponent(JS_RECEIPT)}`);
    return module;
  } catch (error) {
    ROUTE_STATE.errors.push(`${label} import failed: ${String(error?.message || error || "unknown error")}`);
    return null;
  }
}

function readSupportReceipts(runtimeModule, surfaceModule, hexModule, reliefModule) {
  const runtimeStatus =
    safeCall(() => runtimeModule && runtimeModule.getStatus && runtimeModule.getStatus(), {}) ||
    window.__AUDRALIA_RUNTIME_STATUS__ ||
    {};

  const surfaceStatus =
    safeCall(() => surfaceModule && surfaceModule.getStatus && surfaceModule.getStatus(), {}) ||
    surfaceModule?.AUDRALIA_SURFACE_STATUS ||
    {};

  const hexStatus =
    safeCall(() => hexModule && hexModule.getAudraliaHexSurfaceStatus && hexModule.getAudraliaHexSurfaceStatus(), {}) ||
    hexModule?.AUDRALIA_HEX_SURFACE_STATUS ||
    {};

  const reliefStatus =
    safeCall(() => reliefModule && reliefModule.getAudraliaReliefSurfaceStatus && reliefModule.getAudraliaReliefSurfaceStatus(), {}) ||
    reliefModule?.AUDRALIA_RELIEF_SURFACE_STATUS ||
    {};

  ROUTE_STATE.runtimeImported = Boolean(runtimeModule);
  ROUTE_STATE.runtimeReceipt = firstString(
    runtimeModule?.AUDRALIA_RUNTIME_RECEIPT_VALUE,
    runtimeStatus?.receipt,
    EXPECTED_RUNTIME_RECEIPT
  );

  ROUTE_STATE.surfaceImported = Boolean(surfaceModule);
  ROUTE_STATE.surfaceReceipt = firstString(
    surfaceModule?.AUDRALIA_SURFACE_RECEIPT_VALUE,
    surfaceStatus?.receipt,
    EXPECTED_SURFACE_RECEIPT
  );

  ROUTE_STATE.hexChildImported = Boolean(hexModule);
  ROUTE_STATE.hexChildReceipt = firstString(
    hexModule?.AUDRALIA_HEX_SURFACE_RECEIPT_VALUE,
    hexStatus?.receipt,
    EXPECTED_HEX_CHILD_RECEIPT
  );

  ROUTE_STATE.grandchildReliefImported = Boolean(reliefModule);
  ROUTE_STATE.grandchildReliefReceipt = firstString(
    reliefModule?.AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
    reliefStatus?.receipt,
    EXPECTED_GRANDCHILD_RELIEF_RECEIPT
  );
}

function readCanvasStatus(canvasModule) {
  const status =
    safeCall(() => canvasModule && canvasModule.getAudraliaCanvasStatus && canvasModule.getAudraliaCanvasStatus(), {}) ||
    window.__AUDRALIA_CANVAS_STATUS__ ||
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ ||
    {};

  ROUTE_STATE.canvasReceipt = firstString(
    status?.receipt,
    canvasModule?.RECEIPT,
    EXPECTED_CANVAS_RECEIPT
  );

  ROUTE_STATE.canvasContract = firstString(
    status?.contract,
    status?.revision,
    canvasModule?.CONTRACT,
    canvasModule?.REVISION,
    EXPECTED_CANVAS_CONTRACT
  );

  ROUTE_STATE.canvasReceiptVisible = Boolean(ROUTE_STATE.canvasReceipt);
  ROUTE_STATE.canvasContractVisible = Boolean(ROUTE_STATE.canvasContract);

  window.__AUDRALIA_CANVAS_STATUS__ = {
    ...(typeof status === "object" && status ? status : {}),
    receipt: ROUTE_STATE.canvasReceipt,
    contract: ROUTE_STATE.canvasContract,
    routeReceipt: ROUTE_RECEIPT,
    routeJsReceipt: JS_RECEIPT,
    bridgedByRoute: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function chooseMountFunction(canvasModule) {
  return (
    canvasModule?.mountAudraliaCanvas ||
    canvasModule?.renderAudraliaCanvas ||
    canvasModule?.bootAudraliaCanvas ||
    canvasModule?.createAudraliaCanvas ||
    canvasModule?.initAudraliaCanvas ||
    canvasModule?.renderAudralia ||
    canvasModule?.mountAudralia ||
    canvasModule?.render ||
    canvasModule?.mount ||
    canvasModule?.init ||
    canvasModule?.default?.mountAudraliaCanvas ||
    canvasModule?.default?.renderAudraliaCanvas ||
    canvasModule?.default?.bootAudraliaCanvas ||
    canvasModule?.default?.createAudraliaCanvas ||
    canvasModule?.default?.initAudraliaCanvas ||
    canvasModule?.default?.render ||
    canvasModule?.default?.mount ||
    canvasModule?.default?.init ||
    window.mountAudraliaCanvas ||
    window.renderAudraliaCanvas
  );
}

function clearMountFallbackAfterCanvas() {
  const canvas = resolveCanvasNode();
  const fallback = document.querySelector("[data-audralia-mount-fallback]");

  if (canvas && fallback) {
    fallback.textContent = "";
    fallback.setAttribute("hidden", "true");
  }
}

async function waitForCanvas(timeoutMs = 12000) {
  const started = performance.now();

  return new Promise((resolve) => {
    const check = () => {
      const canvas = resolveCanvasNode();

      if (canvas) {
        resolve(canvas);
        return;
      }

      if (performance.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });
}

async function mountCanvas(canvasModule, runtimeModule) {
  const mount = resolveMount();

  ROUTE_STATE.mountFound = Boolean(mount);

  if (!mount) {
    ROUTE_STATE.errors.push("Canonical mount #audralia-canvas-mount not found.");
    publishState({ mountFound: false });
    return null;
  }

  mount.setAttribute("data-audralia-route-receipt", ROUTE_RECEIPT);
  mount.setAttribute("data-audralia-route-js-receipt", JS_RECEIPT);
  mount.setAttribute("data-audralia-mount-ready", "true");

  const mountFunction = chooseMountFunction(canvasModule);
  ROUTE_STATE.canvasMountFunctionFound = typeof mountFunction === "function";

  if (typeof mountFunction !== "function") {
    ROUTE_STATE.errors.push("Canvas authority imported, but no mount function was found.");
    publishState();
    return null;
  }

  ROUTE_STATE.mountCallAttempted = true;
  publishState();

  let controller = null;

  try {
    controller = mountFunction(mount, {
      routeReceipt: ROUTE_RECEIPT,
      routeJsReceipt: JS_RECEIPT,
      previousRouteReceipt: PREVIOUS_ROUTE_RECEIPT,
      canonicalMountId: "audralia-canvas-mount",
      runtime: runtimeModule || null,
      runtimeMotion: runtimeModule || null,
      runtimeReceipt: ROUTE_STATE.runtimeReceipt || EXPECTED_RUNTIME_RECEIPT,
      runtimeSovereignty: "motion-only",
      runtimeVisualSovereignty: false,
      canvasReceipt: ROUTE_STATE.canvasReceipt || EXPECTED_CANVAS_RECEIPT,
      canvasContract: ROUTE_STATE.canvasContract || EXPECTED_CANVAS_CONTRACT,
      surfaceReceipt: ROUTE_STATE.surfaceReceipt || EXPECTED_SURFACE_RECEIPT,
      hexChildReceipt: ROUTE_STATE.hexChildReceipt || EXPECTED_HEX_CHILD_RECEIPT,
      grandchildReliefReceipt: ROUTE_STATE.grandchildReliefReceipt || EXPECTED_GRANDCHILD_RELIEF_RECEIPT,
      parentStandard: true,
      ratioLocked: true,
      childActivatedByParentContract: true,
      grandchildReliefActivated: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    ROUTE_STATE.mountCallSucceeded = true;
  } catch (error) {
    ROUTE_STATE.mountCallSucceeded = false;
    ROUTE_STATE.errors.push(`Canvas mount call failed: ${String(error?.message || error || "unknown error")}`);
    publishState();
    return null;
  }

  const canvas = await waitForCanvas();

  ROUTE_STATE.canvasFoundAfterMount = Boolean(canvas);

  if (!canvas) {
    ROUTE_STATE.errors.push("Canvas authority mount call returned, but no canvas appeared in the canonical mount.");
  }

  clearMountFallbackAfterCanvas();
  publishState();

  return controller;
}

function attachRuntimeInteraction(runtimeModule) {
  const mount = resolveMount();

  if (!runtimeModule || !mount) return;

  safeCall(() => runtimeModule.start && runtimeModule.start());

  let lastX = 0;
  let lastY = 0;
  let active = false;

  mount.addEventListener("pointerdown", (event) => {
    active = true;
    lastX = event.clientX;
    lastY = event.clientY;
    safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(true));
  }, { passive: true });

  mount.addEventListener("pointermove", (event) => {
    if (!active) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    safeCall(() => runtimeModule.applyDragImpulse && runtimeModule.applyDragImpulse(dx, dy, 1));
  }, { passive: true });

  function endPointer() {
    active = false;
    safeCall(() => runtimeModule.setPointerActive && runtimeModule.setPointerActive(false));
  }

  mount.addEventListener("pointerup", endPointer, { passive: true });
  mount.addEventListener("pointercancel", endPointer, { passive: true });
  mount.addEventListener("pointerleave", endPointer, { passive: true });
}

function scheduleStatusRefreshes() {
  const delays = [0, 50, 120, 220, 400, 700, 1100, 1800, 3000, 5200, 7600, 11000, 14500];

  delays.forEach((delay) => {
    window.setTimeout(() => publishState({ statusRefreshDelay: delay }), delay);
  });
}

async function boot() {
  publishState({
    statusNodeFound: Boolean(resolveStatusNode()),
    mountFound: Boolean(resolveMount())
  });

  ROUTE_STATE.importsAttempted = true;
  publishState();

  const [runtimeModule, surfaceModule, hexModule, reliefModule, canvasModule] = await Promise.all([
    importOptionalModule(RUNTIME_PATH, "runtime"),
    importOptionalModule(SURFACE_PATH, "surface"),
    importOptionalModule(HEX_CHILD_PATH, "hex child"),
    importOptionalModule(GRANDCHILD_RELIEF_PATH, "grandchild relief"),
    importOptionalModule(CANVAS_PATH, "canvas")
  ]);

  readSupportReceipts(runtimeModule, surfaceModule, hexModule, reliefModule);

  ROUTE_STATE.canvasAuthorityImported = Boolean(canvasModule);

  if (!canvasModule) {
    ROUTE_STATE.errors.push("Canvas authority import failed; route cannot mount canvas.");
    publishState();
    scheduleStatusRefreshes();
    return ROUTE_STATE;
  }

  readCanvasStatus(canvasModule);
  publishState();

  await mountCanvas(canvasModule, runtimeModule);
  attachRuntimeInteraction(runtimeModule);
  scheduleStatusRefreshes();

  return ROUTE_STATE;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  ROUTE_RECEIPT,
  JS_RECEIPT,
  PREVIOUS_ROUTE_RECEIPT,
  ROUTE_STATE,
  boot,
  publishState
};

export default boot;
