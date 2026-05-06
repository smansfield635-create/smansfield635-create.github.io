/* /showroom/globe/audralia/index.js */
/* AUDRALIA_ROUTE_CONTAINED_CANVAS_HANDOFF_RENEWAL_TNT_v18
   Full-file replacement.

   Jurisdiction:
   - route contract renewal
   - current canvas cache key
   - square shell detection
   - contained mount detection
   - contained canvas detection
   - single render handoff
   - route receipts
   - visible route status

   Non-jurisdiction:
   - HTML rewrite
   - canvas internals
   - runtime truth model
   - topology
   - terrain
   - hydration
   - oceans
   - deep-ocean
   - Gauges scoring
   - GraphicBox
   - image generation
*/

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_ROUTE_CONTAINED_CANVAS_HANDOFF_RENEWAL_TNT_v18";
const AUDRALIA_CANVAS_EXPECTED_CONTRACT = "AUDRALIA_CANVAS_CONTAINED_SHELL_OBEDIENCE_TNT_v18";
const AUDRALIA_CANVAS_IMPORT_PATH = "/assets/audralia/audralia.canvas.js?v=audralia-contained-shell-obedience-v18";

const AUDRALIA_ROUTE_LEGACY_CONTRACTS = [
  "AUDRALIA_ROUTE_SERVED_SOURCE_ALIGNMENT_TNT_v17",
  "AUDRALIA_ROUTE_STAGE_CONTAINMENT_AND_CACHE_KEY_TNT_v16",
  "AUDRALIA_ROUTE_PROOF_CHAIN_ALIGNMENT_TNT_v13",
  "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v2",
  "AUDRALIA_ROUTE_DOORWAY_NO_BODY_WIPE_TNT_v3"
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

function mountIsContained(shell, mount) {
  return Boolean(shell && mount && shell.contains(mount));
}

function canvasIsContained(mount, canvas) {
  return Boolean(mount && canvas && mount.contains(canvas));
}

function markRoute(shell, mount, canvas) {
  if (shell) {
    shell.dataset.audraliaCanvasShell = "true";
    shell.dataset.audraliaSquareShell = "true";
    shell.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
    shell.dataset.audraliaCanvasExpectedContract = AUDRALIA_CANVAS_EXPECTED_CONTRACT;
  }

  if (mount) {
    mount.dataset.audraliaCanvasMount = "true";
    mount.dataset.audraliaMount = "true";
    mount.dataset.adoptedCanvasMount = "true";
    mount.dataset.audraliaProofMount = "true";
    mount.dataset.audraliaContainedMount = "true";
    mount.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
    mount.dataset.audraliaCanvasExpectedContract = AUDRALIA_CANVAS_EXPECTED_CONTRACT;
  }

  if (canvas) {
    canvas.dataset.audraliaCanvas = "true";
    canvas.dataset.audraliaProofCanvas = "true";
    canvas.dataset.audraliaContainedCanvas = "true";
    canvas.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
    canvas.dataset.audraliaCanvasExpectedContract = AUDRALIA_CANVAS_EXPECTED_CONTRACT;
  }
}

function exposeRouteReceipt(extra = {}) {
  const shell = getShell();
  const mount = getMount();
  const canvas = getCanvas();

  const receipt = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    expectedCanvasContract: AUDRALIA_CANVAS_EXPECTED_CONTRACT,
    legacyContracts: AUDRALIA_ROUTE_LEGACY_CONTRACTS.slice(),
    route: "/showroom/globe/audralia/",
    canvasImportPath: AUDRALIA_CANVAS_IMPORT_PATH,

    shellFound: Boolean(shell),
    shellId: shell?.id || null,
    squareShell: Boolean(shell?.dataset?.audraliaSquareShell || shell?.dataset?.audraliaCanvasShell),

    mountFound: Boolean(mount),
    mountId: mount?.id || null,
    mountInsideShell: mountIsContained(shell, mount),

    canvasFound: Boolean(canvas),
    canvasId: canvas?.id || null,
    canvasInsideMount: canvasIsContained(mount, canvas),
    canvasAuthority: canvas?.dataset?.audraliaCanvasAuthority || "pending",

    graphicBox: false,
    imageGeneration: false,
    bodyWipe: false,
    canvasAutoMount: false,

    status: extra.status || "route-loaded",
    updatedAt: new Date().toISOString(),
    ...extra
  };

  window.__AUDRALIA_ROUTE_RECEIPT__ = receipt;
  window.AUDRALIA_ROUTE_RECEIPT = receipt;
  window.AudraliaRouteStatus = receipt;
  window.AudraliaAdoptedRouteStatus = receipt;

  document.documentElement.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
  document.documentElement.dataset.audraliaCanvasExpectedContract = AUDRALIA_CANVAS_EXPECTED_CONTRACT;
  document.documentElement.dataset.audraliaCanvasImportKey = "audralia-contained-shell-obedience-v18";
  document.documentElement.dataset.audraliaRouteStatus = receipt.status;
  document.documentElement.dataset.audraliaShellFound = String(receipt.shellFound);
  document.documentElement.dataset.audraliaMountFound = String(receipt.mountFound);
  document.documentElement.dataset.audraliaMountInsideShell = String(receipt.mountInsideShell);
  document.documentElement.dataset.audraliaCanvasFound = String(receipt.canvasFound);
  document.documentElement.dataset.audraliaCanvasInsideMount = String(receipt.canvasInsideMount);
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";

  return receipt;
}

async function bootAudraliaDoorway() {
  const shell = getShell();
  const mount = getMount();
  const canvas = getCanvas();

  markRoute(shell, mount, canvas);

  if (!shell) {
    const receipt = exposeRouteReceipt({
      status: "shell-missing",
      error: "No Audralia square shell found."
    });

    setStatus("Route renewal failed: square shell missing.");
    return receipt;
  }

  if (!mount) {
    const receipt = exposeRouteReceipt({
      status: "mount-missing",
      error: "No Audralia canvas mount found."
    });

    setStatus("Route renewal failed: canvas mount missing.");
    return receipt;
  }

  if (!mountIsContained(shell, mount)) {
    const receipt = exposeRouteReceipt({
      status: "mount-outside-shell",
      error: "Audralia mount is not contained inside the square shell."
    });

    setStatus("Route renewal failed: mount is outside the square shell.");
    return receipt;
  }

  exposeRouteReceipt({ status: "containment-confirmed" });
  setStatus("Route v18 active. Square shell confirmed. Loading contained canvas authority.");

  try {
    const module = await import(AUDRALIA_CANVAS_IMPORT_PATH);

    const renderer =
      module.renderAudraliaCanvas ||
      module.mountAudraliaCanvas ||
      module.startAudraliaCanvas ||
      module.default ||
      window.renderAudraliaCanvas ||
      window.AudraliaCanvasAuthority?.render ||
      null;

    if (typeof renderer !== "function") {
      const receipt = exposeRouteReceipt({
        status: "canvas-renderer-missing",
        moduleKeys: Object.keys(module || {})
      });

      setStatus("Route v18 loaded canvas module, but no renderer function was exposed.");
      return receipt;
    }

    const controller = renderer({
      shell,
      mount,
      canvas,
      route: "/showroom/globe/audralia/",
      source: "audralia-route-contained-canvas-handoff-renewal",
      routeContract: AUDRALIA_ROUTE_CONTRACT,
      expectedCanvasContract: AUDRALIA_CANVAS_EXPECTED_CONTRACT,
      cacheKey: "audralia-contained-shell-obedience-v18",
      lockToShell: true
    });

    const receipt = exposeRouteReceipt({
      status: "render-handoff-complete",
      rendererResolved: true,
      controllerRunning: Boolean(controller?.running),
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

    setStatus("Route v18 active. Contained shell confirmed. Canvas v18 authority resolved. Render handoff complete.");

    return receipt;
  } catch (error) {
    const receipt = exposeRouteReceipt({
      status: "canvas-import-failed",
      error: error?.message || String(error)
    });

    setStatus(`Route v18 failed to import canvas authority: ${receipt.error}`);
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
  AUDRALIA_CANVAS_EXPECTED_CONTRACT,
  AUDRALIA_CANVAS_IMPORT_PATH,
  AUDRALIA_ROUTE_LEGACY_CONTRACTS,
  bootAudraliaDoorway,
  exposeRouteReceipt,
  getShell,
  getMount,
  getCanvas
};

export default bootAudraliaDoorway;
