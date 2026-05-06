/* /showroom/globe/audralia/index.js */
/* AUDRALIA_ROUTE_DOORWAY_CANVAS_RESOLUTION_TNT_v1
   Precinct: Audralia route doorway.
   Jurisdiction: locate route mount, import adopted canvas authority, resolve exported renderer, call renderer, expose receipts.
   Non-jurisdiction: canvas drawing, runtime truth, terrain logic, hydration logic, global showroom layout, Gauges scoring.
*/

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_ROUTE_DOORWAY_CANVAS_RESOLUTION_TNT_v1";
const AUDRALIA_CANVAS_SOURCE = "/assets/audralia/audralia.canvas.js";
const AUDRALIA_CANVAS_SOURCE_WITH_RECEIPT =
  "/assets/audralia/audralia.canvas.js?doorway=AUDRALIA_ROUTE_DOORWAY_CANVAS_RESOLUTION_TNT_v1";

const routeReceipt = {
  contract: AUDRALIA_ROUTE_CONTRACT,
  status: "initializing",
  route: "/showroom/globe/audralia/",
  canvasAuthority: AUDRALIA_CANVAS_SOURCE,
  graphicBox: false,
  imageGeneration: false,
  shellOnly: true,
  owns: [
    "route boot",
    "mount discovery",
    "canvas authority import",
    "renderer resolution",
    "handoff receipts"
  ],
  doesNotOwn: [
    "canvas paint",
    "runtime truth",
    "topology",
    "terrain",
    "hydration",
    "Gauges scoring",
    "global showroom layout"
  ],
  mountedAt: null,
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

  window.dispatchEvent(
    new CustomEvent("audralia:route-receipt", {
      detail: { ...routeReceipt },
      bubbles: false,
      cancelable: false
    })
  );

  return routeReceipt;
}

function textOf(node) {
  return String(node?.textContent || "").trim().toLowerCase();
}

function findHeadingByText(text) {
  const wanted = text.toLowerCase();

  return Array.from(document.querySelectorAll("h1,h2,h3,h4")).find((heading) =>
    textOf(heading).includes(wanted)
  );
}

function findRouteStatusNode() {
  const direct =
    document.querySelector("[data-audralia-route-status]") ||
    document.querySelector("#audraliaRouteStatus") ||
    document.querySelector("#audralia-route-status");

  if (direct) return direct;

  const heading = findHeadingByText("route status");
  if (heading) {
    let node = heading.nextElementSibling;

    while (node) {
      const tag = String(node.tagName || "").toLowerCase();

      if (tag === "p" || tag === "div" || tag === "section" || tag === "article") {
        node.dataset.audraliaRouteStatus = "true";
        return node;
      }

      if (/^h[1-4]$/.test(tag)) break;
      node = node.nextElementSibling;
    }

    const status = document.createElement("p");
    status.dataset.audraliaRouteStatus = "true";
    heading.insertAdjacentElement("afterend", status);
    return status;
  }

  return null;
}

function setRouteStatus(message, state = "status") {
  const statusNode = findRouteStatusNode();

  if (statusNode) {
    statusNode.textContent = message;
    statusNode.dataset.state = state;
    return;
  }

  const main =
    document.querySelector("#audralia-main") ||
    document.querySelector("[data-audralia-main]") ||
    document.querySelector("main") ||
    document.body;

  const fallback = document.createElement("p");
  fallback.dataset.audraliaRouteStatus = "true";
  fallback.dataset.state = state;
  fallback.textContent = message;

  main.insertBefore(fallback, main.firstChild);
}

function findAudraliaMain() {
  return (
    document.querySelector("#audralia-main") ||
    document.querySelector("[data-audralia-main]") ||
    document.querySelector("[data-route='/showroom/globe/audralia/']") ||
    document.querySelector("main") ||
    document.body
  );
}

function findCanvasMount() {
  const existing =
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-audralia-canvas-auto='true']") ||
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("#audraliaMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("#audralia-stage") ||
    document.querySelector("#audraliaStage") ||
    document.querySelector("#globe-stage") ||
    document.querySelector("#globeStage");

  if (existing) {
    existing.dataset.audraliaCanvasMount = "true";
    existing.dataset.audraliaCanvasAuto = "true";
    return existing;
  }

  const main = findAudraliaMain();
  const statusHeading = findHeadingByText("route status");

  const mountSection = document.createElement("section");
  mountSection.id = "audraliaCanvasMount";
  mountSection.dataset.audraliaCanvasMount = "true";
  mountSection.dataset.audraliaCanvasAuto = "true";
  mountSection.dataset.contract = AUDRALIA_ROUTE_CONTRACT;
  mountSection.setAttribute("aria-label", "Audralia adopted canvas mount");

  mountSection.style.width = "min(92vw, 760px)";
  mountSection.style.minHeight = "min(92vw, 760px)";
  mountSection.style.margin = "clamp(18px, 4vw, 36px) auto";
  mountSection.style.position = "relative";
  mountSection.style.borderRadius = "50%";
  mountSection.style.overflow = "hidden";
  mountSection.style.background =
    "radial-gradient(circle at 50% 50%, rgba(8,16,28,1), rgba(1,3,8,1))";

  if (statusHeading) {
    statusHeading.insertAdjacentElement("afterend", mountSection);
  } else {
    main.appendChild(mountSection);
  }

  return mountSection;
}

function resolveRenderer(moduleNamespace) {
  const candidates = [
    ["default", moduleNamespace?.default],
    ["renderAudraliaCanvas", moduleNamespace?.renderAudraliaCanvas],
    ["mountAudraliaCanvas", moduleNamespace?.mountAudraliaCanvas],
    ["startAudraliaCanvas", moduleNamespace?.startAudraliaCanvas],
    ["createAudraliaCanvas", moduleNamespace?.createAudraliaCanvas],
    ["AudraliaCanvasAuthority.render", moduleNamespace?.AudraliaCanvasAuthority?.render],
    ["AudraliaCanvasAuthority.mount", moduleNamespace?.AudraliaCanvasAuthority?.mount],
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
    return await import(AUDRALIA_CANVAS_SOURCE_WITH_RECEIPT);
  } catch (firstError) {
    const fallbackModule = await import(AUDRALIA_CANVAS_SOURCE);
    routeReceipt.firstImportError = String(firstError?.message || firstError);
    return fallbackModule;
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
    status: controller?.receipt?.status || controller?.state?.running ? "running" : "returned",
    hasReceipt: Boolean(controller?.receipt),
    hasCanvas: Boolean(controller?.canvas),
    hasStart: typeof controller?.start === "function",
    hasStop: typeof controller?.stop === "function"
  };
}

async function bootAudraliaDoorway() {
  stampReceipt("booting");
  setRouteStatus("Doorway route is resolving the adopted Audralia canvas authority.", "booting");

  const mount = findCanvasMount();

  stampReceipt("mount-found", {
    mountedAt: `#${mount.id || "audraliaCanvasMount"}`,
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
    moduleKeys,
    rendererResolved: true,
    rendererName: resolved.name
  });

  let controller;

  try {
    controller = resolved.renderer({
      mount,
      route: "/showroom/globe/audralia/",
      routeContract: AUDRALIA_ROUTE_CONTRACT,
      source: "audralia-route-doorway",
      showReceipts: true
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

  stampReceipt("canvas-active", {
    rendererResolved: true,
    rendererName: resolved.name,
    controllerReturned: controllerSummary.returned,
    controllerSummary,
    canvasReceiptAvailable: Boolean(window.__AUDRALIA_CANVAS_RECEIPT__ || window.AUDRALIA_CANVAS_RECEIPT),
    canvasReceipt:
      window.__AUDRALIA_CANVAS_RECEIPT__ ||
      window.AUDRALIA_CANVAS_RECEIPT ||
      controller?.receipt ||
      null
  });

  setRouteStatus(
    `Doorway route active. Canvas authority resolved through ${resolved.name}. Render handoff complete.`,
    "active"
  );

  window.dispatchEvent(
    new CustomEvent("audralia:doorway-active", {
      detail: {
        routeReceipt: { ...routeReceipt },
        canvasReceipt:
          window.__AUDRALIA_CANVAS_RECEIPT__ ||
          window.AUDRALIA_CANVAS_RECEIPT ||
          controller?.receipt ||
          null
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
