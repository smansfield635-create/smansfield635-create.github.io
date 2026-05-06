// showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v1
//
// Role:
// - Audralia route doorway only.
// - Finds the Audralia mount.
// - Imports the adopted-column canvas authority.
// - Calls renderAudraliaCanvas(mount).
// - Exposes route receipt.
// - Does not own canvas rendering.
// - Does not own runtime sampling.
// - Does not own ocean color.
// - Does not create land.
// - Does not create water.

const RECEIPT = "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v1";
const CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v1";
const BODY = "audralia";
const ROUTE = "/showroom/globe/audralia/";
const CANVAS_AUTHORITY = "/assets/audralia/audralia.canvas.js";
const CANVAS_IMPORT_URL = "/assets/audralia/audralia.canvas.js?v=AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v1";

function findMount() {
  return (
    document.getElementById("audraliaRenderMount") ||
    document.getElementById("audreliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audrelia-render-mount]") ||
    document.querySelector("[data-body='audralia'][data-render-mount]") ||
    document.querySelector("[data-body='audrelia'][data-render-mount]")
  );
}

function buildRouteStatus(input = {}) {
  return Object.freeze({
    ok: Boolean(input.ok),
    receipt: RECEIPT,
    canvasReceipt: CANVAS_RECEIPT,
    body: BODY,
    route: ROUTE,
    routeMode: "doorway-only",
    canvasAuthority: CANVAS_AUTHORITY,
    canvasAuthorityLoaded: Boolean(input.canvasAuthorityLoaded),
    canvasRendered: Boolean(input.canvasRendered),
    runtimeAuthority: "/assets/audralia/audralia.runtime.js",
    runtimeVersion: input.runtimeVersion || "",
    runtimeActiveRenewal: input.runtimeActiveRenewal || "",
    runtimeLoaded: Boolean(input.runtimeLoaded),
    runtimeInstanceLoaded: Boolean(input.runtimeInstanceLoaded),
    routeOwnedCanvasRendering: false,
    routeOwnedRuntimeSampling: false,
    routeOwnedOceanColor: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    topologyRewrittenHere: false,
    tectonicsRewrittenHere: false,
    terrainRewrittenHere: false,
    hydrationRewrittenHere: false,
    oceansRewrittenHere: false,
    climateRewrittenHere: false,
    runtimeRewrittenHere: false,
    hexRewrittenHere: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    counters: input.counters || null,
    runtimeStats: input.runtimeStats || null,
    error: input.error || ""
  });
}

function exposeRouteStatus(input = {}) {
  const status = buildRouteStatus(input);

  window.DGBAudraliaRouteStatus = status;
  window.AudraliaRouteStatus = status;
  window.audraliaRouteStatus = status;

  window.dispatchEvent(
    new CustomEvent("dgb:audralia-route-status", {
      detail: status
    })
  );

  return status;
}

function writeDoorwayDataset(target, status) {
  if (!target) return;

  target.dataset.audraliaRenderMount = "true";
  target.dataset.renderMount = "true";
  target.dataset.body = BODY;
  target.dataset.route = ROUTE;
  target.dataset.contract = RECEIPT;
  target.dataset.activeRenewal = RECEIPT;
  target.dataset.routeMode = "doorway-only";
  target.dataset.canvasAuthority = CANVAS_AUTHORITY;
  target.dataset.canvasAuthorityReceipt = CANVAS_RECEIPT;
  target.dataset.canvasAuthorityLoaded = String(Boolean(status.canvasAuthorityLoaded));
  target.dataset.canvasRendered = String(Boolean(status.canvasRendered));
  target.dataset.runtimeLoaded = String(Boolean(status.runtimeLoaded));
  target.dataset.runtimeInstanceLoaded = String(Boolean(status.runtimeInstanceLoaded));
  target.dataset.runtimeVersion = status.runtimeVersion || "";
  target.dataset.runtimeActiveRenewal = status.runtimeActiveRenewal || "";
  target.dataset.routeOwnedCanvasRendering = "false";
  target.dataset.routeOwnedRuntimeSampling = "false";
  target.dataset.routeOwnedOceanColor = "false";
  target.dataset.routeOwnedLandGeneration = "forbidden";
  target.dataset.routeOwnedWaterGeneration = "forbidden";
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";
}

function drawFailure(mount, message, detail) {
  if (!mount) {
    exposeRouteStatus({
      ok: false,
      canvasAuthorityLoaded: false,
      canvasRendered: false,
      runtimeLoaded: false,
      runtimeInstanceLoaded: false,
      error: message
    });
    return;
  }

  mount.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "audralia-route-failure-panel";
  panel.setAttribute("role", "status");
  panel.dataset.body = BODY;
  panel.dataset.route = ROUTE;
  panel.dataset.receipt = RECEIPT;
  panel.dataset.ok = "false";
  panel.dataset.error = message;
  panel.dataset.visualPassClaimed = "false";

  const title = document.createElement("h2");
  title.textContent = "Audralia doorway did not load the canvas authority.";

  const text = document.createElement("p");
  text.textContent = message;

  panel.append(title, text);

  if (detail) {
    const pre = document.createElement("pre");
    pre.hidden = true;
    pre.textContent = JSON.stringify(detail, null, 2);
    panel.appendChild(pre);
  }

  mount.appendChild(panel);

  const status = exposeRouteStatus({
    ok: false,
    canvasAuthorityLoaded: false,
    canvasRendered: false,
    runtimeLoaded: false,
    runtimeInstanceLoaded: false,
    error: message
  });

  writeDoorwayDataset(mount, status);
}

async function bootAudraliaDoorway() {
  const mount = findMount();

  if (!mount) {
    exposeRouteStatus({
      ok: false,
      canvasAuthorityLoaded: false,
      canvasRendered: false,
      runtimeLoaded: false,
      runtimeInstanceLoaded: false,
      error: "AUDRALIA_ROUTE_MOUNT_NOT_FOUND"
    });
    return;
  }

  writeDoorwayDataset(
    mount,
    buildRouteStatus({
      ok: false,
      canvasAuthorityLoaded: false,
      canvasRendered: false,
      runtimeLoaded: false,
      runtimeInstanceLoaded: false
    })
  );

  let module;

  try {
    module = await import(CANVAS_IMPORT_URL);
  } catch (error) {
    drawFailure(mount, "Audralia canvas authority import failed.", {
      canvasImportUrl: CANVAS_IMPORT_URL,
      message: String(error && error.message ? error.message : error)
    });
    return;
  }

  const api = module && module.default && typeof module.default === "object" ? module.default : module;
  const renderAudraliaCanvas =
    api && typeof api.renderAudraliaCanvas === "function"
      ? api.renderAudraliaCanvas
      : module && typeof module.renderAudraliaCanvas === "function"
        ? module.renderAudraliaCanvas
        : null;

  if (!renderAudraliaCanvas) {
    drawFailure(mount, "Audralia canvas authority did not expose renderAudraliaCanvas().", {
      canvasImportUrl: CANVAS_IMPORT_URL
    });
    return;
  }

  let canvasStatus;

  try {
    canvasStatus = await renderAudraliaCanvas(mount, {
      route: ROUTE
    });
  } catch (error) {
    drawFailure(mount, "Audralia canvas authority threw during render.", {
      message: String(error && error.message ? error.message : error)
    });
    return;
  }

  const routeStatus = exposeRouteStatus({
    ok: Boolean(canvasStatus && canvasStatus.ok),
    canvasAuthorityLoaded: true,
    canvasRendered: Boolean(canvasStatus && canvasStatus.canvasRendered),
    runtimeLoaded: Boolean(canvasStatus && canvasStatus.runtimeLoaded),
    runtimeInstanceLoaded: Boolean(canvasStatus && canvasStatus.runtimeInstanceLoaded),
    runtimeVersion: canvasStatus && canvasStatus.runtimeVersion ? canvasStatus.runtimeVersion : "",
    runtimeActiveRenewal: canvasStatus && canvasStatus.runtimeActiveRenewal ? canvasStatus.runtimeActiveRenewal : "",
    counters: canvasStatus && canvasStatus.counters ? canvasStatus.counters : null,
    runtimeStats: canvasStatus && canvasStatus.runtimeStats ? canvasStatus.runtimeStats : null,
    error: canvasStatus && canvasStatus.error ? canvasStatus.error : ""
  });

  writeDoorwayDataset(mount, routeStatus);
}

function boot() {
  bootAudraliaDoorway();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  RECEIPT,
  CANVAS_RECEIPT,
  bootAudraliaDoorway,
  buildRouteStatus
};

export default Object.freeze({
  receipt: RECEIPT,
  canvasReceipt: CANVAS_RECEIPT,
  bootAudraliaDoorway,
  buildRouteStatus
});
