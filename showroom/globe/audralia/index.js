/* /showroom/globe/audralia/index.js */
/* AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3
   Precinct: Audralia route doorway.
   Jurisdiction: find existing shell mount, import adopted canvas authority, resolve renderer, call renderer once, expose route receipts.
   Non-jurisdiction: document.body replacement, page shell rendering, canvas painting, runtime truth, topology, terrain, hydration, Gauges scoring.
*/

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3";
const AUDRALIA_CANVAS_SOURCE = "/assets/audralia/audralia.canvas.js";
const AUDRALIA_CANVAS_IMPORT =
  "/assets/audralia/audralia.canvas.js?doorway=AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3";

const routeReceipt = {
  contract: AUDRALIA_ROUTE_CONTRACT,
  route: "/showroom/globe/audralia/",
  canvasAuthority: AUDRALIA_CANVAS_SOURCE,
  status: "initializing",
  graphicBox: false,
  imageGeneration: false,
  bodyWipe: false,
  shellRenderer: false,
  doorwayOnly: true,
  rendererResolved: false,
  rendererName: null,
  controllerReturned: false,
  error: null,
  updatedAt: null
};

function stampReceipt(status, extra = {}) {
  routeReceipt.status = status;
  routeReceipt.updatedAt = new Date().toISOString();
  Object.assign(routeReceipt, extra);

  window.__AUDRALIA_ROUTE_RECEIPT__ = routeReceipt;
  window.AUDRALIA_ROUTE_RECEIPT = routeReceipt;

  document.documentElement.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaRouteStatus = status;
  document.documentElement.dataset.audraliaCanvasAuthority = AUDRALIA_CANVAS_SOURCE;
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.bodyWipe = "false";

  window.dispatchEvent(
    new CustomEvent("audralia:route-receipt", {
      detail: { ...routeReceipt },
      bubbles: false,
      cancelable: false
    })
  );

  return routeReceipt;
}

function findStatusNode() {
  return (
    document.querySelector("#audraliaRouteStatus") ||
    document.querySelector("[data-audralia-route-status]")
  );
}

function setRouteStatus(message, state = "status") {
  const statusNode = findStatusNode();

  if (!statusNode) {
    console.info(`[Audralia Route] ${message}`);
    return;
  }

  statusNode.textContent = message;
  statusNode.dataset.state = state;
}

function findCanvasMount() {
  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("#audraliaMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("#audralia-stage") ||
    document.querySelector("#audraliaStage")
  );
}

function prepareMountForRouteControl(mount) {
  mount.dataset.audraliaCanvasMount = "true";
  mount.dataset.audraliaCanvasAuto = "false";
  mount.dataset.audraliaCanvasControl = "route-doorway";
  mount.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;

  return mount;
}

function resolveRenderer(moduleNamespace) {
  const candidates = [
    ["default", moduleNamespace?.default],
    ["renderAudraliaCanvas", moduleNamespace?.renderAudraliaCanvas],
    ["mountAudraliaCanvas", moduleNamespace?.mountAudraliaCanvas],
    ["startAudraliaCanvas", moduleNamespace?.startAudraliaCanvas],
    ["createAudraliaCanvas", moduleNamespace?.createAudraliaCanvas],
    ["window.AudraliaCanvasAuthority.render", window.AudraliaCanvasAuthority?.render],
    ["window.AudraliaCanvasAuthority.mount", window.AudraliaCanvasAuthority?.mount],
    ["window.renderAudraliaCanvas", window.renderAudraliaCanvas],
    ["window.mountAudraliaCanvas", window.mountAudraliaCanvas],
    ["window.startAudraliaCanvas", window.startAudraliaCanvas],
    ["window.createAudraliaCanvas", window.createAudraliaCanvas]
  ];

  for (const [name, candidate] of candidates) {
    if (typeof candidate === "function") {
      return { name, renderer: candidate };
    }
  }

  if (typeof moduleNamespace === "function") {
    return { name: "moduleNamespace", renderer: moduleNamespace };
  }

  return { name: null, renderer: null };
}

async function importCanvasAuthority() {
  try {
    return await import(AUDRALIA_CANVAS_IMPORT);
  } catch (firstError) {
    routeReceipt.firstImportError = String(firstError?.message || firstError);
    return await import(AUDRALIA_CANVAS_SOURCE);
  }
}

function normalizeController(controller) {
  if (!controller) {
    return {
      returned: false,
      status: "no-controller-returned"
    };
  }

  return {
    returned: true,
    status: controller?.receipt?.status || (controller?.state?.running ? "running" : "returned"),
    hasReceipt: Boolean(controller?.receipt),
    hasCanvas: Boolean(controller?.canvas),
    hasStart: typeof controller?.start === "function",
    hasStop: typeof controller?.stop === "function"
  };
}

async function bootAudraliaDoorway() {
  if (window.__AUDRALIA_ROUTE_BOOT_PROMISE__) {
    return window.__AUDRALIA_ROUTE_BOOT_PROMISE__;
  }

  window.__AUDRALIA_ROUTE_BOOT_PROMISE__ = runAudraliaDoorway();
  return window.__AUDRALIA_ROUTE_BOOT_PROMISE__;
}

async function runAudraliaDoorway() {
  stampReceipt("booting");
  setRouteStatus("Doorway route is resolving the adopted Audralia canvas authority.", "booting");

  const mount = findCanvasMount();

  if (!mount) {
    const message =
      "Audralia doorway could not find #audraliaCanvasMount. HTML shell must own the mount; route will not wipe or rebuild the page.";

    stampReceipt("mount-not-found", {
      error: message,
      rendererResolved: false
    });

    setRouteStatus(message, "error");
    return routeReceipt;
  }

  prepareMountForRouteControl(mount);

  stampReceipt("mount-found", {
    mountId: mount.id || null,
    mountDataset: { ...mount.dataset }
  });

  let moduleNamespace;

  try {
    moduleNamespace = await importCanvasAuthority();
  } catch (error) {
    const message = String(error?.message || error);

    stampReceipt("canvas-import-failed", {
      error: message,
      rendererResolved: false
    });

    setRouteStatus(`Audralia canvas authority import failed: ${message}`, "error");
    return routeReceipt;
  }

  const moduleKeys = Object.keys(moduleNamespace || {});
  const resolved = resolveRenderer(moduleNamespace);

  if (!resolved.renderer) {
    const message = `Audralia canvas authority imported but exposed no callable renderer. Export keys: ${
      moduleKeys.length ? moduleKeys.join(", ") : "none"
    }`;

    stampReceipt("renderer-not-found", {
      error: message,
      moduleKeys,
      rendererResolved: false
    });

    setRouteStatus(message, "error");
    return routeReceipt;
  }

  stampReceipt("renderer-resolved", {
    rendererResolved: true,
    rendererName: resolved.name,
    moduleKeys
  });

  let controller;

  try {
    controller = resolved.renderer({
      mount,
      route: "/showroom/globe/audralia/",
      routeContract: AUDRALIA_ROUTE_CONTRACT,
      source: "audralia-route-doorway-no-body-wipe",
      showReceipts: true,
      autoMount: false
    });
  } catch (error) {
    const message = String(error?.message || error);

    stampReceipt("renderer-call-failed", {
      error: message,
      rendererResolved: true,
      rendererName: resolved.name
    });

    setRouteStatus(`Audralia canvas authority resolved but render call failed: ${message}`, "error");
    return routeReceipt;
  }

  const controllerSummary = normalizeController(controller);
  const canvasReceipt =
    window.__AUDRALIA_CANVAS_RECEIPT__ ||
    window.AUDRALIA_CANVAS_RECEIPT ||
    controller?.receipt ||
    null;

  stampReceipt("canvas-active", {
    rendererResolved: true,
    rendererName: resolved.name,
    controllerReturned: controllerSummary.returned,
    controllerSummary,
    canvasReceiptAvailable: Boolean(canvasReceipt),
    canvasReceipt
  });

  setRouteStatus(
    `Doorway route active. Canvas authority resolved through ${resolved.name}. Render handoff complete.`,
    "active"
  );

  window.dispatchEvent(
    new CustomEvent("audralia:doorway-active", {
      detail: {
        routeReceipt: { ...routeReceipt },
        canvasReceipt
      },
      bubbles: false,
      cancelable: false
    })
  );

  return routeReceipt;
}

function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

window.AudraliaRouteDoorway = {
  contract: AUDRALIA_ROUTE_CONTRACT,
  boot: bootAudraliaDoorway,
  getReceipt() {
    return routeReceipt;
  }
};

ready(() => {
  bootAudraliaDoorway();
});

export {
  AUDRALIA_ROUTE_CONTRACT,
  bootAudraliaDoorway
};

export default bootAudraliaDoorway;
