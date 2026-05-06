/* /showroom/globe/audralia/index.js */
/* AUDRALIA_ROUTE_PROOF_CHAIN_ALIGNMENT_TNT_v13
   Jurisdiction: doorway import resolution, mount detection, single render call, route receipts, status text.
   Non-jurisdiction: HTML body rewrite, visual model, runtime truth model, Gauges scoring, GraphicBox, image generation.
*/

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_ROUTE_PROOF_CHAIN_ALIGNMENT_TNT_v13";

const AUDRALIA_ROUTE_LEGACY_CONTRACTS = [
  "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v2",
  "AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3",
  "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2"
];

function getMount() {
  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-adopted-canvas-mount]") ||
    document.querySelector("#audraliaMount") ||
    null
  );
}

function setStatus(message) {
  const status =
    document.querySelector("#audraliaRouteStatus") ||
    document.querySelector("[data-audralia-status]");

  if (status) status.textContent = message;
}

function exposeRouteReceipt(partial = {}) {
  const mount = getMount();
  const canvas =
    document.querySelector("#audraliaCanvas") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    document.querySelector("canvas[data-audralia-canvas-authority='true']") ||
    null;

  const receipt = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    legacyContracts: AUDRALIA_ROUTE_LEGACY_CONTRACTS.slice(),
    status: partial.status || "route-initializing",
    route: "/showroom/globe/audralia/",
    mountFound: Boolean(mount),
    mountId: mount ? mount.id || null : null,
    canvasFound: Boolean(canvas),
    canvasId: canvas ? canvas.id || null : null,
    canvasAuthority:
      canvas?.dataset?.audraliaCanvasAuthority ||
      canvas?.dataset?.audraliaCanvas ||
      "pending",
    graphicBox: false,
    imageGeneration: false,
    bodyWipe: false,
    canvasAutoMount: false,
    updatedAt: new Date().toISOString(),
    ...partial
  };

  window.__AUDRALIA_ROUTE_RECEIPT__ = receipt;
  window.AUDRALIA_ROUTE_RECEIPT = receipt;
  window.AudraliaRouteStatus = receipt;
  window.AudraliaAdoptedRouteStatus = receipt;

  document.documentElement.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaRouteStatus = receipt.status;
  document.documentElement.dataset.audraliaMountFound = String(receipt.mountFound);
  document.documentElement.dataset.audraliaCanvasFound = String(receipt.canvasFound);

  return receipt;
}

async function bootAudraliaDoorway() {
  const mount = getMount();

  if (!mount) {
    const receipt = exposeRouteReceipt({
      status: "mount-missing",
      error: "No Audralia mount found."
    });

    setStatus("Audralia doorway could not find the adopted canvas mount.");
    return receipt;
  }

  mount.dataset.audraliaCanvasMount = "true";
  mount.dataset.audraliaMount = "true";
  mount.dataset.adoptedCanvasMount = "true";
  mount.dataset.audraliaProofMount = "true";

  exposeRouteReceipt({ status: "mount-resolved" });
  setStatus("Doorway route active. Resolving adopted Audralia canvas authority.");

  try {
    const module = await import("/assets/audralia/audralia.canvas.js?v=audralia-proof-chain-v13");

    const renderer =
      module.default ||
      module.renderAudraliaCanvas ||
      module.mountAudraliaCanvas ||
      module.startAudraliaCanvas ||
      window.renderAudraliaCanvas ||
      window.AudraliaCanvasAuthority?.render ||
      null;

    if (typeof renderer !== "function") {
      const receipt = exposeRouteReceipt({
        status: "canvas-renderer-missing",
        moduleKeys: Object.keys(module || {})
      });

      setStatus("Canvas authority loaded, but no renderer function was exposed.");
      return receipt;
    }

    const controller = renderer({
      mount,
      route: "/showroom/globe/audralia/",
      source: "audralia-doorway",
      contract: AUDRALIA_ROUTE_CONTRACT
    });

    const receipt = exposeRouteReceipt({
      status: "render-handoff-complete",
      rendererResolved: true,
      controllerStatus: controller?.receipt?.status || controller?.state?.running || "started",
      canvasReceipt:
        window.__AUDRALIA_CANVAS_RECEIPT__ ||
        window.AUDRALIA_CANVAS_RECEIPT ||
        null
    });

    setStatus("Doorway route active. Canvas authority resolved. Render handoff complete.");

    return receipt;
  } catch (error) {
    const receipt = exposeRouteReceipt({
      status: "canvas-import-failed",
      error: error?.message || String(error)
    });

    setStatus(`Audralia canvas authority failed to load: ${receipt.error}`);
    return receipt;
  }
}

exposeRouteReceipt({ status: "route-script-loaded" });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAudraliaDoorway, { once: true });
} else {
  bootAudraliaDoorway();
}

export {
  AUDRALIA_ROUTE_CONTRACT,
  AUDRALIA_ROUTE_LEGACY_CONTRACTS,
  bootAudraliaDoorway,
  exposeRouteReceipt,
  getMount
};

export default bootAudraliaDoorway;
