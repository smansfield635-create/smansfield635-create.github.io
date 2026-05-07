// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V11_HARD_BIND_CANVAS_V11_CALLER_TNT_v1
// Full-file replacement. Doorway route only.
// Purpose:
// - Force the Audralia route to import the current canvas authority with a cache-bound URL.
// - Mount the V11 spherical unwrap / polar blend canvas.
// - Preserve HTML shell authority.
// - Preserve runtime support-only status.
// - Do not mutate runtime, canvas source, Gauges, Earth, Showroom selector, CSS, or products.
// - No GraphicBox. No image generation. No visual-pass claim.

const ROUTE_RECEIPT = "AUDRALIA_ROUTE_V11_HARD_BIND_CANVAS_V11_CALLER_TNT_v1";
const CANVAS_CONTRACT = "AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11";
const CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const HTML_HANDOFF = "AUDRALIA_HTML_ROUTE_CACHE_BREAK_AND_STATUS_GATE_TNT_v1";

const CANVAS_SOURCE =
  "/assets/audralia/audralia.canvas.js?cache=AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11";

const RUNTIME_SOURCE =
  "/assets/audralia/audralia.runtime.js?cache=AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const RETIRED_CANVAS_CONTRACTS = [
  "AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1"
];

const ROUTE_STATUS = {
  ok: false,
  loaded: false,
  receipt: ROUTE_RECEIPT,
  htmlHandoff: HTML_HANDOFF,
  canvasContract: CANVAS_CONTRACT,
  canvasReceipt: CANVAS_RECEIPT,
  runtimeReceipt: RUNTIME_RECEIPT,
  canvasSource: CANVAS_SOURCE,
  runtimeSource: RUNTIME_SOURCE,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
  routeOwns: [
    "import_call",
    "mount_call",
    "status_gate",
    "route_receipt"
  ],
  routeDoesNotOwn: [
    "html_shell",
    "canvas_paint",
    "runtime_truth",
    "topology",
    "terrain",
    "hydration",
    "oceans",
    "deep_ocean",
    "gauges_scoring",
    "earth_route",
    "showroom_selector"
  ],
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function publishRouteStatus(extra = {}) {
  const status = {
    ...ROUTE_STATUS,
    ...extra,
    updatedAt: new Date().toISOString()
  };

  window.__AUDRALIA_ROUTE_STATUS__ = status;
  window.__AUDRALIA_ROUTE_V11_STATUS__ = status;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_RECEIPT;
  window.AUDRALIA_ROUTE_CANVAS_CONTRACT = CANVAS_CONTRACT;
  window.AUDRALIA_ROUTE_RUNTIME_RECEIPT = RUNTIME_RECEIPT;

  if (document.documentElement) {
    document.documentElement.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasContract = CANVAS_CONTRACT;
    document.documentElement.dataset.audraliaRouteCanvasReceipt = CANVAS_RECEIPT;
    document.documentElement.dataset.audraliaRouteRuntimeReceipt = RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasV11Caller = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:route-status", {
        detail: status
      })
    );
  } catch (_) {
    // no-op
  }

  return status;
}

function getStatusNode() {
  return (
    document.getElementById("audralia-route-status") ||
    document.querySelector("[data-audralia-route-status]") ||
    document.querySelector("[data-route-status]")
  );
}

function setStatusText(text) {
  const node = getStatusNode();

  if (!node) return;

  node.textContent = text;
  node.dataset.audraliaRouteLoaded = "true";
  node.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  node.dataset.audraliaCanvasContract = CANVAS_CONTRACT;
  node.dataset.audraliaCanvasReceipt = CANVAS_RECEIPT;
  node.dataset.audraliaRuntimeReceipt = RUNTIME_RECEIPT;
}

function getMount() {
  return (
    document.getElementById("audralia-canvas-mount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-render-mount]")
  );
}

function removeStaleRouteResidue() {
  const staleSelectors = [
    "[data-audralia-route-v6-proof]",
    "[data-audralia-route-v7-proof]",
    "[data-audralia-route-v8-proof]",
    "[data-stale-audralia-proof]"
  ];

  staleSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  });

  const staleTextFragments = [
    "AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10",
    "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9",
    "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
    "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6"
  ];

  document.querySelectorAll("p, div, span, li").forEach((node) => {
    if (node.children.length) return;

    const text = (node.textContent || "").trim();

    if (!text) return;

    const stale = staleTextFragments.some((fragment) => text.includes(fragment));

    if (stale && !node.matches("#audralia-route-status, [data-audralia-route-status]")) {
      node.remove();
    }
  });
}

function chooseMountFunction(canvasModule) {
  return (
    canvasModule.mountAudraliaCanvas ||
    canvasModule.renderAudraliaCanvas ||
    canvasModule.bootAudraliaCanvas ||
    canvasModule.createAudraliaCanvas ||
    canvasModule.initAudraliaCanvas ||
    canvasModule.renderAudralia ||
    canvasModule.mountAudralia ||
    canvasModule.render ||
    canvasModule.mount ||
    canvasModule.init ||
    (canvasModule.default && canvasModule.default.mountAudraliaCanvas) ||
    (canvasModule.default && canvasModule.default.renderAudraliaCanvas) ||
    null
  );
}

async function importRuntimeSupport() {
  try {
    const runtimeModule = await import(RUNTIME_SOURCE);

    publishRouteStatus({
      runtimeImported: true,
      runtimeImportError: "",
      runtimeModuleKeys: Object.keys(runtimeModule || {})
    });

    return runtimeModule;
  } catch (error) {
    publishRouteStatus({
      runtimeImported: false,
      runtimeImportError: error instanceof Error ? error.message : String(error)
    });

    return null;
  }
}

async function importCanvasAuthority() {
  const canvasModule = await import(CANVAS_SOURCE);

  const mountFunction = chooseMountFunction(canvasModule);

  if (typeof mountFunction !== "function") {
    throw new Error("AUDRALIA_CANVAS_V11_EXPORT_NOT_FOUND");
  }

  return {
    canvasModule,
    mountFunction
  };
}

function publicLoadedText(canvasStatus) {
  const statusContract =
    canvasStatus &&
    typeof canvasStatus === "object" &&
    canvasStatus.contract
      ? canvasStatus.contract
      : CANVAS_CONTRACT;

  return [
    "Audralia adopted canvas authority loaded.",
    [
      `Route ${ROUTE_RECEIPT}`,
      `Canvas ${statusContract}`,
      `Receipt ${CANVAS_RECEIPT}`,
      `Runtime ${RUNTIME_RECEIPT}`,
      `Retired ${RETIRED_CANVAS_CONTRACTS.join(", ")}`,
      "GraphicBox false",
      "Image generation false",
      "Visual pass claimed false"
    ].join(" · ")
  ].join("\n");
}

async function bootAudraliaRoute() {
  removeStaleRouteResidue();

  const mount = getMount();

  if (!mount) {
    setStatusText("Audralia route mount missing.");
    publishRouteStatus({
      ok: false,
      loaded: false,
      mountPresent: false,
      error: "AUDRALIA_CANVAS_MOUNT_NOT_FOUND"
    });
    return;
  }

  mount.dataset.audraliaRouteReceipt = ROUTE_RECEIPT;
  mount.dataset.audraliaCanvasContract = CANVAS_CONTRACT;
  mount.dataset.audraliaCanvasReceipt = CANVAS_RECEIPT;

  setStatusText("Audralia doorway importing canvas authority.");

  publishRouteStatus({
    ok: false,
    loaded: false,
    mountPresent: true,
    importStarted: true
  });

  await importRuntimeSupport();

  try {
    const { canvasModule, mountFunction } = await importCanvasAuthority();

    const controller = mountFunction(mount, {
      routeReceipt: ROUTE_RECEIPT,
      canvasContract: CANVAS_CONTRACT,
      runtimeReceipt: RUNTIME_RECEIPT,
      textureWidth: 384,
      textureHeight: 192,
      targetFps: 24,
      labelEnabled: true
    });

    const canvasStatus =
      typeof canvasModule.getAudraliaCanvasStatus === "function"
        ? canvasModule.getAudraliaCanvasStatus()
        : window.__AUDRALIA_CANVAS_STATUS__ || null;

    setStatusText(publicLoadedText(canvasStatus));

    publishRouteStatus({
      ok: true,
      loaded: true,
      mountPresent: true,
      canvasImported: true,
      canvasImportError: "",
      canvasModuleKeys: Object.keys(canvasModule || {}),
      canvasStatus,
      controllerPresent: Boolean(controller),
      routeStatusTextCaptured: true,
      staleCanvasContractsRetired: RETIRED_CANVAS_CONTRACTS,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    setStatusText(`Audralia canvas authority import failed. ${message}`);

    publishRouteStatus({
      ok: false,
      loaded: false,
      mountPresent: true,
      canvasImported: false,
      canvasImportError: message,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAudraliaRoute, { once: true });
} else {
  bootAudraliaRoute();
}

export {
  ROUTE_RECEIPT,
  CANVAS_CONTRACT,
  CANVAS_RECEIPT,
  RUNTIME_RECEIPT,
  HTML_HANDOFF,
  CANVAS_SOURCE,
  RUNTIME_SOURCE,
  RETIRED_CANVAS_CONTRACTS,
  publishRouteStatus,
  bootAudraliaRoute
};

export default {
  ROUTE_RECEIPT,
  CANVAS_CONTRACT,
  CANVAS_RECEIPT,
  RUNTIME_RECEIPT,
  HTML_HANDOFF,
  CANVAS_SOURCE,
  RUNTIME_SOURCE,
  RETIRED_CANVAS_CONTRACTS,
  publishRouteStatus,
  bootAudraliaRoute
};a
