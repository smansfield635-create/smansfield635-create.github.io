// /showroom/globe/audralia/index.js
// AUDRALIA_DOORWAY_PROOF_TIMEOUT_CANVAS_HANDOFF_TNT_v8
// Full-file replacement. Doorway route only.
// Purpose: prove route execution, import canvas authority with timeout,
// call canvas mount export, and never leave Audralia stuck at "Loading Audralia".
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_ROUTE_RECEIPT = "AUDRALIA_DOORWAY_PROOF_TIMEOUT_CANVAS_HANDOFF_TNT_v8";
const AUDRALIA_CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9";
const EXPECTED_HTML_RECEIPT = "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v3";
const IMPORT_TIMEOUT_MS = 6500;

const routeStatus = {
  ok: false,
  receipt: AUDRALIA_ROUTE_RECEIPT,
  file: "showroom/globe/audralia/index.js",
  role: "audralia-doorway-proof-timeout-canvas-handoff",
  htmlReceiptExpected: EXPECTED_HTML_RECEIPT,
  canvasAuthorityPath: AUDRALIA_CANVAS_PATH,
  expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,

  routeScriptExecuted: true,
  bootStarted: false,
  mountFound: false,
  messageFound: false,
  importAttempted: false,
  importSucceeded: false,
  importTimedOut: false,
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
  document.documentElement.dataset.audraliaDoorwayRouteExecuted = "true";
  document.documentElement.dataset.audraliaCanvasAuthorityPath = AUDRALIA_CANVAS_PATH;
  document.documentElement.dataset.audraliaExpectedCanvasReceipt = EXPECTED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaObservedCanvasReceipt = String(routeStatus.observedCanvasReceipt || "missing");
  document.documentElement.dataset.audraliaCanvasImportAttempted = String(Boolean(routeStatus.importAttempted));
  document.documentElement.dataset.audraliaCanvasImportSucceeded = String(Boolean(routeStatus.importSucceeded));
  document.documentElement.dataset.audraliaCanvasImportTimedOut = String(Boolean(routeStatus.importTimedOut));
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

function writeMountNotice(mount, message) {
  if (!(mount instanceof HTMLElement)) return;

  let notice = mount.querySelector("[data-audralia-route-notice]");
  if (!notice) {
    notice = document.createElement("div");
    notice.dataset.audraliaRouteNotice = "true";
    notice.style.position = "absolute";
    notice.style.inset = "0";
    notice.style.display = "grid";
    notice.style.placeItems = "center";
    notice.style.padding = "1.2rem";
    notice.style.textAlign = "center";
    notice.style.color = "rgba(202,229,239,0.86)";
    notice.style.font = "800 0.92rem/1.4 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
    notice.style.letterSpacing = "0.08em";
    notice.style.textTransform = "uppercase";
    notice.style.background =
      "radial-gradient(circle at 50% 50%, rgba(18,55,76,0.22), transparent 48%), rgba(1,4,11,0.88)";
    mount.appendChild(notice);
  }

  notice.textContent = message;
}

function removeMountNotice(mount) {
  const notice = mount?.querySelector?.("[data-audralia-route-notice]");
  if (notice) notice.remove();
}

function buildCanvasImportUrl() {
  const url = new URL(AUDRALIA_CANVAS_PATH, window.location.origin);
  url.searchParams.set("doorway", AUDRALIA_ROUTE_RECEIPT);
  url.searchParams.set("expected", EXPECTED_CANVAS_RECEIPT);
  url.searchParams.set("html", EXPECTED_HTML_RECEIPT);
  url.searchParams.set("t", String(Date.now()));
  return url.pathname + url.search;
}

function timeoutPromise(ms, label) {
  return new Promise((_, reject) => {
    window.setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });
}

async function importCanvasAuthority() {
  const importUrl = buildCanvasImportUrl();

  exposeRouteStatus({
    importAttempted: true,
    importUrl,
    importTimedOut: false,
    error: ""
  });

  try {
    const module = await Promise.race([
      import(importUrl),
      timeoutPromise(IMPORT_TIMEOUT_MS, "Canvas authority import")
    ]);

    exposeRouteStatus({
      importSucceeded: true,
      importTimedOut: false,
      error: ""
    });

    return module;
  } catch (error) {
    const message = String(error?.message || error || "canvas authority import failed");
    const timedOut = message.includes("timed out");

    exposeRouteStatus({
      ok: false,
      importSucceeded: false,
      importTimedOut: timedOut,
      error: message
    });

    return null;
  }
}

function selectCanvasRenderFunction(module) {
  const candidates = [
    module?.mountAudraliaCanvas,
    module?.mountAudraliaAdoptedCanvas,
    module?.renderAudraliaCanvas,
    module?.renderAudraliaAdoptedCanvas,
    module?.bootAudraliaCanvas,
    module?.createAudraliaCanvas,
    module?.default
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

async function waitForCanvasProof(timeoutMs = 3200) {
  const started = performance.now();

  while (performance.now() - started < timeoutMs) {
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

    if (canvas || adoptedStatus) {
      return { canvas, adoptedStatus };
    }

    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }

  return { canvas: null, adoptedStatus: null };
}

async function verifyCanvasAfterRender() {
  const proof = await waitForCanvasProof();

  const observedCanvasReceipt =
    window.__AUDRALIA_CANVAS_RECEIPT__ ||
    proof.adoptedStatus?.receipt ||
    proof.canvas?.dataset?.contract ||
    "";

  const staleCanvasDetected =
    Boolean(observedCanvasReceipt) &&
    observedCanvasReceipt !== EXPECTED_CANVAS_RECEIPT;

  exposeRouteStatus({
    canvasFoundAfterRender: Boolean(proof.canvas),
    adoptedStatusVisible: Boolean(proof.adoptedStatus),
    observedCanvasReceipt: String(observedCanvasReceipt || "missing"),
    staleCanvasDetected
  });

  return {
    ...proof,
    observedCanvasReceipt,
    staleCanvasDetected
  };
}

async function bootAudraliaDoorway() {
  exposeRouteStatus({ bootStarted: true });

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

  setDoorwayMessage("Audralia doorway route active. Importing adopted canvas authority.", "loading");
  writeMountNotice(mount, "Doorway route active · importing canvas authority");

  const canvasModule = await importCanvasAuthority();

  if (!canvasModule) {
    const message = routeStatus.importTimedOut
      ? "Audralia canvas authority import timed out."
      : "Audralia canvas authority import failed.";

    setDoorwayMessage(message, "fail");
    writeMountNotice(mount, `${message} ${routeStatus.error || ""}`);
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
    writeMountNotice(mount, "Canvas authority imported · no render export found");
    return routeStatus;
  }

  try {
    exposeRouteStatus({ renderCalled: true });
    writeMountNotice(mount, "Canvas authority imported · mounting Audralia");

    await Promise.race([
      Promise.resolve(
        render({
          mount,
          routeStatus,
          routeReceipt: AUDRALIA_ROUTE_RECEIPT,
          expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,
          htmlReceipt: EXPECTED_HTML_RECEIPT,
          source: "audralia-doorway-proof-timeout-canvas-handoff"
        })
      ),
      timeoutPromise(IMPORT_TIMEOUT_MS, "Canvas authority render")
    ]);

    const proof = await verifyCanvasAfterRender();

    if (!proof.canvas) {
      exposeRouteStatus({
        ok: false,
        renderCompleted: true,
        error: "Canvas authority returned, but no route canvas was found."
      });

      setDoorwayMessage("Audralia canvas authority returned, but no canvas was exposed.", "fail");
      writeMountNotice(mount, "Canvas authority returned · no canvas exposed");
      return routeStatus;
    }

    if (proof.staleCanvasDetected) {
      exposeRouteStatus({
        ok: false,
        renderCompleted: true,
        error: `Stale canvas authority detected: ${proof.observedCanvasReceipt}`
      });

      setDoorwayMessage(`Audralia loaded a stale canvas authority: ${proof.observedCanvasReceipt}`, "fail");
      removeMountNotice(mount);
      return routeStatus;
    }

    exposeRouteStatus({
      ok: true,
      renderCompleted: true,
      error: ""
    });

    setDoorwayMessage("Audralia adopted canvas authority loaded.", "pass");
    removeMountNotice(mount);
    return routeStatus;
  } catch (error) {
    const message = String(error?.message || error || "canvas authority render failed");

    exposeRouteStatus({
      ok: false,
      renderCompleted: false,
      error: message
    });

    setDoorwayMessage("Audralia canvas authority render failed.", "fail");
    writeMountNotice(mount, `Canvas authority render failed · ${message}`);
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

exposeRouteStatus();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAudraliaDoorway, { once: true });
} else {
  bootAudraliaDoorway();
}
