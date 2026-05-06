// /showroom/globe/audralia/index.js
// AUDRALIA_DOORWAY_EXPECT_STABLE_OCEAN_WORLD_CANVAS_TNT_v4
// Full-file replacement. Doorway only.
// Purpose: expect the current v6 canvas authority and stop falsely marking v5/v6 as stale.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_ROUTE_RECEIPT = "AUDRALIA_DOORWAY_EXPECT_STABLE_OCEAN_WORLD_CANVAS_TNT_v4";
const AUDRALIA_CANVAS_PATH = "/assets/audralia/audralia.canvas.js";
const EXPECTED_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_STABLE_OCEAN_WORLD_DESIGN_TNT_v6";

const routeStatus = {
  ok: false,
  receipt: AUDRALIA_ROUTE_RECEIPT,
  file: "showroom/globe/audralia/index.js",
  role: "audralia-doorway-route-stable-ocean-world-expectation",
  canvasAuthorityPath: AUDRALIA_CANVAS_PATH,
  expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,
  mountFound: false,
  importAttempted: false,
  importSucceeded: false,
  importUrl: "",
  renderExportFound: false,
  renderCalled: false,
  renderCompleted: false,
  canvasFoundAfterRender: false,
  labelFoundAfterRender: false,
  staleCanvasDetected: false,
  observedCanvasReceipt: "",
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

  document.documentElement.dataset.audraliaRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
  document.documentElement.dataset.audraliaDoorwayRoute = "active";
  document.documentElement.dataset.audraliaCanvasAuthorityPath = AUDRALIA_CANVAS_PATH;
  document.documentElement.dataset.audraliaExpectedCanvasReceipt = EXPECTED_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaObservedCanvasReceipt = String(routeStatus.observedCanvasReceipt || "missing");
  document.documentElement.dataset.audraliaCanvasImportSucceeded = String(routeStatus.importSucceeded);
  document.documentElement.dataset.audraliaCanvasRenderCalled = String(routeStatus.renderCalled);
  document.documentElement.dataset.audraliaCanvasFound = String(routeStatus.canvasFoundAfterRender);
  document.documentElement.dataset.audraliaStaleCanvasDetected = String(routeStatus.staleCanvasDetected);

  return routeStatus;
}

function findAudraliaMount() {
  const existing =
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("#audralia-main");

  if (existing instanceof HTMLElement) {
    existing.id = existing.id || "audraliaRenderMount";
    existing.dataset.audraliaRenderMount = "true";
    existing.dataset.audraliaRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
    return existing;
  }

  const main = document.querySelector("main") || document.body;
  const mount = document.createElement("section");
  mount.id = "audraliaRenderMount";
  mount.dataset.audraliaRenderMount = "true";
  mount.dataset.audraliaRouteReceipt = AUDRALIA_ROUTE_RECEIPT;
  mount.setAttribute("aria-label", "Audralia render mount");
  main.prepend(mount);

  return mount;
}

function setDoorwayMessage(message, state = "info") {
  const mount = findAudraliaMount();

  let panel = document.querySelector("[data-audralia-doorway-message]");
  if (!panel) {
    panel = document.createElement("aside");
    panel.dataset.audraliaDoorwayMessage = "true";
    panel.style.margin = "1rem auto";
    panel.style.maxWidth = "980px";
    panel.style.padding = "0.85rem 1rem";
    panel.style.border = "1px solid rgba(255, 220, 150, 0.18)";
    panel.style.borderRadius = "18px";
    panel.style.background = "rgba(5, 10, 22, 0.58)";
    panel.style.color = "rgba(255, 239, 205, 0.92)";
    panel.style.font = "600 0.92rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    mount.before(panel);
  }

  panel.dataset.state = state;
  panel.textContent = message;
}

function buildFreshCanvasImportUrl() {
  const url = new URL(AUDRALIA_CANVAS_PATH, window.location.origin);
  url.searchParams.set("expected", EXPECTED_CANVAS_RECEIPT);
  url.searchParams.set("doorway", AUDRALIA_ROUTE_RECEIPT);
  url.searchParams.set("t", String(Date.now()));
  return url.pathname + url.search;
}

async function importCanvasAuthority() {
  const importUrl = buildFreshCanvasImportUrl();

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
    exposeRouteStatus({
      ok: false,
      importSucceeded: false,
      error: `Canvas authority import failed: ${error.message}`
    });

    setDoorwayMessage("Audralia canvas authority import failed.", "fail");
    throw error;
  }
}

function selectRenderFunction(module) {
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

function verifyRouteCanvas() {
  const canvas =
    document.querySelector("#audraliaAdoptedCanvas") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    document.querySelector("#audraliaRenderMount canvas") ||
    document.querySelector("[data-audralia-render-mount] canvas");

  const label =
    document.querySelector("[data-audralia-canvas-label]") ||
    Array.from(document.querySelectorAll("h1, h2, h3, div, span, p")).find((node) =>
      String(node.textContent || "").trim().toLowerCase().includes("audralia")
    );

  const canvasReceipt =
    window.__AUDRALIA_CANVAS_RECEIPT__ ||
    window.AUDRALIA_CANVAS_STATUS?.receipt ||
    window.AUDRALIA_ADOPTED_CANVAS_STATUS?.receipt ||
    canvas?.dataset?.contract ||
    "";

  const staleCanvasDetected =
    Boolean(canvasReceipt) &&
    canvasReceipt !== EXPECTED_CANVAS_RECEIPT;

  exposeRouteStatus({
    canvasFoundAfterRender: Boolean(canvas),
    labelFoundAfterRender: Boolean(label),
    observedCanvasReceipt: String(canvasReceipt || "missing"),
    staleCanvasDetected
  });

  return { canvas, label, canvasReceipt, staleCanvasDetected };
}

async function bootAudraliaDoorway() {
  exposeRouteStatus();

  const mount = findAudraliaMount();

  exposeRouteStatus({
    mountFound: Boolean(mount)
  });

  if (!mount) {
    exposeRouteStatus({
      ok: false,
      error: "Audralia mount not found."
    });
    setDoorwayMessage("Audralia mount not found.", "fail");
    return routeStatus;
  }

  setDoorwayMessage("Audralia doorway is loading the current stable ocean-world canvas authority.", "loading");

  let canvasModule;

  try {
    canvasModule = await importCanvasAuthority();
  } catch (_) {
    return routeStatus;
  }

  const render = selectRenderFunction(canvasModule);

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
      source: "audralia-doorway-route-stable-ocean-world"
    });

    const proof = verifyRouteCanvas();

    exposeRouteStatus({
      ok: Boolean(proof.canvas) && !proof.staleCanvasDetected,
      renderCompleted: true,
      error: proof.staleCanvasDetected
        ? `Stale canvas authority detected: ${proof.canvasReceipt}`
        : proof.canvas
          ? ""
          : "Canvas authority rendered, but no route canvas was found afterward."
    });

    setDoorwayMessage(
      proof.staleCanvasDetected
        ? `Audralia loaded a stale canvas authority: ${proof.canvasReceipt}`
        : proof.canvas
          ? "Audralia adopted canvas authority loaded."
          : "Audralia canvas authority returned, but no canvas was exposed.",
      proof.staleCanvasDetected ? "fail" : proof.canvas ? "pass" : "fail"
    );

    return routeStatus;
  } catch (error) {
    exposeRouteStatus({
      ok: false,
      renderCompleted: false,
      error: `Canvas authority render failed: ${error.message}`
    });

    setDoorwayMessage("Audralia canvas authority render failed.", "fail");
    return routeStatus;
  }
}

export {
  AUDRALIA_ROUTE_RECEIPT,
  AUDRALIA_CANVAS_PATH,
  EXPECTED_CANVAS_RECEIPT,
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
