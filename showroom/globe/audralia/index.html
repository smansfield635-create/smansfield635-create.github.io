// /showroom/globe/audralia/index.js
// AUDRALIA_DOORWAY_IMPORT_ADOPTED_CANVAS_AUTHORITY_TNT_v2
// Full-file replacement. Doorway only. No generated image. No GraphicBox.

const AUDRALIA_ROUTE_RECEIPT = "AUDRALIA_DOORWAY_IMPORT_ADOPTED_CANVAS_AUTHORITY_TNT_v2";
const AUDRALIA_CANVAS_PATH = "/assets/audralia/audralia.canvas.js";

const routeStatus = {
  ok: false,
  receipt: AUDRALIA_ROUTE_RECEIPT,
  file: "showroom/globe/audralia/index.js",
  role: "audralia-doorway-route",
  owns: [
    "route mount discovery",
    "canvas authority import",
    "canvas authority handoff",
    "route-visible receipt exposure"
  ],
  doesNotOwn: [
    "land decision",
    "void decision",
    "beach decision",
    "coastline decision",
    "terrain decision",
    "elevation decision",
    "hydration decision",
    "runtime truth",
    "canvas paint authority",
    "visual pass claim"
  ],
  canvasAuthorityPath: AUDRALIA_CANVAS_PATH,
  mountFound: false,
  importAttempted: false,
  importSucceeded: false,
  renderExportFound: false,
  renderCalled: false,
  renderCompleted: false,
  canvasFoundAfterRender: false,
  labelFoundAfterRender: false,
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
  document.documentElement.dataset.audraliaCanvasImportSucceeded = String(routeStatus.importSucceeded);
  document.documentElement.dataset.audraliaCanvasRenderCalled = String(routeStatus.renderCalled);
  document.documentElement.dataset.audraliaCanvasFound = String(routeStatus.canvasFoundAfterRender);

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

async function importCanvasAuthority() {
  exposeRouteStatus({
    importAttempted: true,
    error: ""
  });

  try {
    return await import(AUDRALIA_CANVAS_PATH);
  } catch (firstError) {
    try {
      const cacheBypassPath = `${AUDRALIA_CANVAS_PATH}?receipt=${encodeURIComponent(AUDRALIA_ROUTE_RECEIPT)}&t=${Date.now()}`;
      return await import(cacheBypassPath);
    } catch (secondError) {
      exposeRouteStatus({
        ok: false,
        importSucceeded: false,
        error: `Canvas authority import failed. First: ${firstError.message}. Second: ${secondError.message}`
      });

      setDoorwayMessage("Audralia canvas authority import failed.", "fail");
      throw secondError;
    }
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

  exposeRouteStatus({
    canvasFoundAfterRender: Boolean(canvas),
    labelFoundAfterRender: Boolean(label)
  });

  return { canvas, label };
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

  setDoorwayMessage("Audralia doorway is loading the adopted canvas authority.", "loading");

  let canvasModule;

  try {
    canvasModule = await importCanvasAuthority();
  } catch (_) {
    return routeStatus;
  }

  exposeRouteStatus({
    importSucceeded: true,
    error: ""
  });

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
      source: "audralia-doorway-route"
    });

    const proof = verifyRouteCanvas();

    exposeRouteStatus({
      ok: Boolean(proof.canvas),
      renderCompleted: true,
      error: proof.canvas ? "" : "Canvas authority rendered, but no route canvas was found afterward."
    });

    setDoorwayMessage(
      proof.canvas
        ? "Audralia adopted canvas authority loaded."
        : "Audralia canvas authority returned, but no canvas was exposed.",
      proof.canvas ? "pass" : "fail"
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
