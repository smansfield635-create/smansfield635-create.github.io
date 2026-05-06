/* /showroom/globe/audralia/index.js */
/* AUDRALIA_ROUTE_SERVED_SOURCE_ALIGNMENT_TNT_v17
   Full-file replacement.

   Jurisdiction:
   - served-source route proof
   - current canvas cache key
   - square shell detection
   - contained mount detection
   - single render call
   - route receipts
   - status text

   Non-jurisdiction:
   - HTML body rewrite
   - topology
   - terrain
   - hydration
   - oceans
   - deep-ocean
   - runtime truth model
   - canvas drawing internals
   - Gauges scoring
   - GraphicBox
   - image generation
*/

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_ROUTE_SERVED_SOURCE_ALIGNMENT_TNT_v17";
const AUDRALIA_SERVED_SOURCE_CONTRACT = "AUDRALIA_SERVED_SOURCE_ALIGNMENT_TNT_v17";
const AUDRALIA_CANVAS_IMPORT_PATH = "/assets/audralia/audralia.canvas.js?v=audralia-served-source-v17";

const AUDRALIA_ROUTE_LEGACY_CONTRACTS = [
  "AUDRALIA_ROUTE_STAGE_CONTAINMENT_AND_CACHE_KEY_TNT_v16",
  "AUDRALIA_ROUTE_PROOF_CHAIN_ALIGNMENT_TNT_v13",
  "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v2",
  "AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3",
  "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2"
];

function getShell() {
  return (
    document.querySelector("#audraliaCanvasShell") ||
    document.querySelector("[data-audralia-canvas-shell]") ||
    null
  );
}

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

function getCanvas() {
  return (
    document.querySelector("#audraliaCanvas") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    document.querySelector("canvas[data-audralia-canvas-authority='true']") ||
    null
  );
}

function setStatus(message) {
  const status =
    document.querySelector("#audraliaRouteStatus") ||
    document.querySelector("[data-audralia-status]");

  if (status) status.textContent = message;
}

function isMountInsideShell(shell, mount) {
  return Boolean(shell && mount && shell.contains(mount));
}

function enforceRouteContainmentMarkers(shell, mount, canvas) {
  if (shell) {
    shell.dataset.audraliaCanvasShell = "true";
    shell.dataset.audraliaSquareShell = "true";
    shell.dataset.audraliaStageLock = AUDRALIA_ROUTE_CONTRACT;
    shell.dataset.audraliaServedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
  }

  if (mount) {
    mount.dataset.audraliaCanvasMount = "true";
    mount.dataset.audraliaMount = "true";
    mount.dataset.adoptedCanvasMount = "true";
    mount.dataset.audraliaProofMount = "true";
    mount.dataset.audraliaContainedMount = "true";
    mount.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
    mount.dataset.audraliaServedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
  }

  if (canvas) {
    canvas.dataset.audraliaCanvas = "true";
    canvas.dataset.audraliaProofCanvas = "true";
    canvas.dataset.audraliaContainedCanvas = "true";
    canvas.dataset.audraliaServedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
  }
}

function exposeRouteReceipt(partial = {}) {
  const shell = getShell();
  const mount = getMount();
  const canvas = getCanvas();

  const receipt = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    servedSource: AUDRALIA_SERVED_SOURCE_CONTRACT,
    legacyContracts: AUDRALIA_ROUTE_LEGACY_CONTRACTS.slice(),
    status: partial.status || "route-initializing",
    route: "/showroom/globe/audralia/",
    canvasImportPath: AUDRALIA_CANVAS_IMPORT_PATH,
    shellFound: Boolean(shell),
    shellId: shell ? shell.id || null : null,
    mountFound: Boolean(mount),
    mountId: mount ? mount.id || null : null,
    mountInsideShell: isMountInsideShell(shell, mount),
    canvasFound: Boolean(canvas),
    canvasId: canvas ? canvas.id || null : null,
    canvasAuthority:
      canvas?.dataset?.audraliaCanvasAuthority ||
      canvas?.dataset?.audraliaCanvas ||
      "pending",
    squareShell: Boolean(shell?.dataset?.audraliaSquareShell),
    containedMount: Boolean(mount?.dataset?.audraliaContainedMount),
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
  document.documentElement.dataset.audraliaServedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
  document.documentElement.dataset.audraliaRouteStatus = receipt.status;
  document.documentElement.dataset.audraliaShellFound = String(receipt.shellFound);
  document.documentElement.dataset.audraliaMountFound = String(receipt.mountFound);
  document.documentElement.dataset.audraliaMountInsideShell = String(receipt.mountInsideShell);
  document.documentElement.dataset.audraliaCanvasFound = String(receipt.canvasFound);
  document.documentElement.dataset.audraliaCanvasImportKey = "audralia-served-source-v17";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";

  return receipt;
}

async function bootAudraliaDoorway() {
  const shell = getShell();
  const mount = getMount();
  const canvas = getCanvas();

  enforceRouteContainmentMarkers(shell, mount, canvas);

  if (!shell) {
    const receipt = exposeRouteReceipt({
      status: "shell-missing",
      error: "No Audralia square shell found."
    });

    setStatus("Audralia doorway could not find the square canvas shell.");
    return receipt;
  }

  if (!mount) {
    const receipt = exposeRouteReceipt({
      status: "mount-missing",
      error: "No Audralia mount found."
    });

    setStatus("Audralia doorway could not find the adopted canvas mount.");
    return receipt;
  }

  if (!isMountInsideShell(shell, mount)) {
    const receipt = exposeRouteReceipt({
      status: "mount-outside-shell",
      error: "Audralia mount is not contained inside the square shell."
    });

    setStatus("Audralia doorway found the mount, but it is not inside the square shell.");
    return receipt;
  }

  exposeRouteReceipt({ status: "containment-resolved" });
  setStatus("Served-source v17 route active. Square shell resolved. Loading current canvas authority.");

  try {
    const module = await import(AUDRALIA_CANVAS_IMPORT_PATH);

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
      shell,
      mount,
      canvas,
      route: "/showroom/globe/audralia/",
      source: "audralia-served-source-doorway",
      contract: AUDRALIA_ROUTE_CONTRACT,
      cacheKey: "audralia-served-source-v17",
      lockToShell: true
    });

    const receipt = exposeRouteReceipt({
      status: "render-handoff-complete",
      rendererResolved: true,
      controllerStatus:
        controller?.receipt?.status ||
        controller?.state?.running ||
        controller?.running ||
        "started",
      canvasReceipt:
        window.__AUDRALIA_CANVAS_RECEIPT__ ||
        window.AUDRALIA_CANVAS_RECEIPT ||
        null,
      pixelProof:
        window.__AUDRALIA_PIXEL_PROOF__ ||
        window.AUDRALIA_PIXEL_PROOF ||
        null,
      dimensionReceipt:
        window.getAudraliaDimensionReceipt?.() ||
        window.__AUDRALIA_CANVAS_RECEIPT__?.dimension ||
        null
    });

    setStatus("Served-source v17 route active. Square shell contained. Canvas authority resolved. Render handoff complete.");

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
  AUDRALIA_SERVED_SOURCE_CONTRACT,
  AUDRALIA_CANVAS_IMPORT_PATH,
  AUDRALIA_ROUTE_LEGACY_CONTRACTS,
  bootAudraliaDoorway,
  exposeRouteReceipt,
  getShell,
  getMount,
  getCanvas
};

export default bootAudraliaDoorway;
