// /showroom/globe/audralia/index.js
// AUDRALIA_DOORWAY_DIRECT_CANVAS_HANDOFF_TNT_v7
// Full-file replacement. Doorway route only.
// Purpose: find the HTML mount, import the adopted canvas authority, call its mount/render export,
// expose route receipts, and never leave the page stuck in loading state.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_ROUTE_RECEIPT = "AUDRALIA_DOORWAY_DIRECT_CANVAS_HANDOFF_TNT_v7";
const AUDRALIA_CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9";
const EXPECTED_HTML_RECEIPT = "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v3";

const routeStatus = {
  ok: false,
  receipt: AUDRALIA_ROUTE_RECEIPT,
  file: "showroom/globe/audralia/index.js",
  role: "audralia-doorway-direct-canvas-handoff",
  htmlReceiptExpected: EXPECTED_HTML_RECEIPT,
  canvasAuthorityPath: AUDRALIA_CANVAS_PATH,
  expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,

  mountFound: false,
  messageFound: false,
  importAttempted: false,
  importSucceeded: false,
  importUrl: "",
  renderExportFound: false,
  renderCalled: false,
  renderCompleted: false,
  canvasFoundAfterRender: false,
  adoptedStatusVisible: false,
  observedCanvasReceipt: "",
  staleCanvasDetected: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  error: ""
};

function exposeRouteStatus(extra = {}) {
  Object.assign(routeStatus, extra);

  window.AUDRALIA_DOORWAY_ROUTE_STATUS = routeStatus;
  window.AUDRALIA_ROUTE_STATUS = routeStatus;
  window.__AUDRALIA_DOORWAY_ROUTE_STATUS__ = routeStatus;
  window.__AUDRALIA_ROUTE_RECEIPT__ = AUDRALIA_ROUTE_RECEIPT;

  document.documentElement.dataset.audraliaDoorwayRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaDoorwayRoute = "active";
  document.documentElement.dataset.audraliaCanvasAuthorityPath = AUDRALIA_CANVAS_PATH;
  document.documentElement.dataset.audraliaExpectedCanvasReceipt = EXPECTED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaObservedCanvasReceipt = String(routeStatus.observedCanvasReceipt || "missing");
  document.documentElement.dataset.audraliaCanvasImportSucceeded = String(Boolean(routeStatus.importSucceeded));
  document.documentElement.dataset.audraliaCanvasRenderCalled = String(Boolean(routeStatus.renderCalled));
  document.documentElement.dataset.audraliaCanvasFound = String(Boolean(routeStatus.canvasFoundAfterRender));
  document.documentElement.dataset.audraliaStaleCanvasDetected = String(Boolean(routeStatus.staleCanvasDetected));
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  return routeStatus;
}

function findAudraliaMount() {
  const mount =
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]");

  if (mount instanceof HTMLElement) {
    mount.id = "audraliaRenderMount";
    mount.dataset.audraliaRenderMount = "true";
    mount.dataset.audraliaMount = "true";
    mount.dataset.audraliaRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
    mount.dataset.audraliaCanvasAuthority = AUDRALIA_CANVAS_PATH;
    return mount;
  }

  return null;
}

function findDoorwayMessage() {
  return document.querySelector("[data-audralia-doorway-message]");
}

function setDoorwayMessage(message, state = "info") {
  const panel = findDoorwayMessage();

  if (panel instanceof HTMLElement) {
    panel.textContent = message;
    panel.dataset.state = state;
    exposeRouteStatus({ messageFound: true });
  }

  return panel;
}

function buildCanvasImportUrl() {
  const url = new URL(AUDRALIA_CANVAS_PATH, window.location.origin);
  url.searchParams.set("doorway", AUDRALIA_ROUTE_RECEIPT);
  url.searchParams.set("expected", EXPECTED_CANVAS_RECEIPT);
  url.searchParams.set("html", EXPECTED_HTML_RECEIPT);
  url.searchParams.set("t", String(Date.now()));
  return url.pathname + url.search;
}

function selectCanvasRenderFunction(module) {
  const candidates = [
    module.mountAudraliaCanvas,
    module.mountAudraliaAdoptedCanvas,
    module.renderAudraliaCanvas,
    module.renderAudraliaAdoptedCanvas,
    module.bootAudraliaCanvas,
    module.createAudraliaCanvas,
    module.default
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function verifyCanvasAfterRender() {
  const canvas =
    document.querySelector("#audraliaAdoptedCanvas") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    document.querySelector("#audraliaRenderMount canvas") ||
    document.querySelector("[data-audralia-render-mount] canvas");

  const adoptedStatus =
    window.AUDRALIA_ADOPTED_CANVAS_STATUS ||
    window.AUDRALIA_CANVAS_STATUS ||
    window.__AUDRALIA_ADOPTED_CANVAS_STATUS__ ||
    null;

  const observedCanvasReceipt =
    window.__AUDRALIA_CANVAS_RECEIPT__ ||
    adoptedStatus?.receipt ||
    canvas?.dataset?.contract ||
    "";

  const staleCanvasDetected =
    Boolean(observedCanvasReceipt) &&
    observedCanvasReceipt !== EXPECTED_CANVAS_RECEIPT;

  exposeRouteStatus({
    canvasFoundAfterRender: Boolean(canvas),
    adoptedStatusVisible: Boolean(adoptedStatus),
    observedCanvasReceipt: String(observedCanvasReceipt || "missing"),
    staleCanvasDetected
  });

  return {
    canvas,
    adoptedStatus,
    observedCanvasReceipt,
    staleCanvasDetected
  };
}

async function importCanvasAuthority() {
  const importUrl = buildCanvasImportUrl();

  exposeRouteStatus({
    importAttempted: true,
    importUrl,
    error: ""
  });

  try {
    const module = await import(importUrl);

    exposeRouteStatus({
      importSucceeded: true,
      error: ""
    });

    return module;
  } catch (error) {
    const message = `Canvas authority import failed: ${String(error?.message || error)}`;

    exposeRouteStatus({
      ok: false,
      importSucceeded: false,
      error: message
    });

    setDoorwayMessage("Audralia canvas authority import failed.", "fail");
    return null;
  }
}

async function bootAudraliaDoorway() {
  exposeRouteStatus();

  const mount = findAudraliaMount();

  exposeRouteStatus({
    mountFound: Boolean(mount),
    messageFound: Boolean(findDoorwayMessage())
  });

  if (!mount) {
    exposeRouteStatus({
      ok: false,
      error: "Audralia render mount not found."
    });

    setDoorwayMessage("Audralia render mount not found.", "fail");
    return routeStatus;
  }

  setDoorwayMessage("Audralia doorway is loading the current adopted canvas authority.", "loading");

  const canvasModule = await importCanvasAuthority();

  if (!canvasModule) {
    return routeStatus;
  }

  const render = selectCanvasRenderFunction(canvasModule);

  exposeRouteStatus({
    renderExportFound: Boolean(render)
  });

  if (!render) {
    exposeRouteStatus({
      ok: false,
      error: "Canvas authority imported, but no compatible render export was found."
    });

    setDoorwayMessage("Audralia canvas authority imported, but no render export was found.", "fail");
    return routeStatus;
  }

  try {
    exposeRouteStatus({
      renderCalled: true
    });

    await render({
      mount,
      routeStatus,
      routeReceipt: AUDRALIA_ROUTE_RECEIPT,
      expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,
      htmlReceipt: EXPECTED_HTML_RECEIPT,
      source: "audralia-doorway-direct-canvas-handoff"
    });

    const proof = verifyCanvasAfterRender();

    if (!proof.canvas) {
      exposeRouteStatus({
        ok: false,
        renderCompleted: true,
        error: "Canvas authority returned, but no route canvas was found."
      });

      setDoorwayMessage("Audralia canvas authority returned, but no canvas was exposed.", "fail");
      return routeStatus;
    }

    if (proof.staleCanvasDetected) {
      exposeRouteStatus({
        ok: false,
        renderCompleted: true,
        error: `Stale canvas authority detected: ${proof.observedCanvasReceipt}`
      });

      setDoorwayMessage(`Audralia loaded a stale canvas authority: ${proof.observedCanvasReceipt}`, "fail");
      return routeStatus;
    }

    exposeRouteStatus({
      ok: true,
      renderCompleted: true,
      error: ""
    });

    setDoorwayMessage("Audralia adopted canvas authority loaded.", "pass");
    return routeStatus;
  } catch (error) {
    const message = `Canvas authority render failed: ${String(error?.message || error)}`;

    exposeRouteStatus({
      ok: false,
      renderCompleted: false,
      error: message
    });

    setDoorwayMessage("Audralia canvas authority render failed.", "fail");
    return routeStatus;
  }
}

export {
  AUDRALIA_ROUTE_RECEIPT,
  AUDRALIA_CANVAS_PATH,
  EXPECTED_CANVAS_RECEIPT,
  EXPECTED_HTML_RECEIPT,
  routeStatus,
  bootAudraliaDoorway,
  exposeRouteStatus
};

export default bootAudraliaDoorway;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAudraliaDoorway, { once: true });
} else {
  bootAudraliaDoorway();
}
