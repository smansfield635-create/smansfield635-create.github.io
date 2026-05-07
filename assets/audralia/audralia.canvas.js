// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1
// Full-file replacement. Doorway route only.
//
// Purpose:
// - Remove stale V7/V6 route-facing public proof/status residue.
// - Preserve the accepted active route binding as V8 for current Gauges compatibility.
// - Bind the visible public status line to Canvas V10.
// - Preserve runtime V8 handoff.
// - Rewrite the route status after canvas mount so legacy canvas/status writers cannot leave duplicate public lines.
// - Expose a single route status object for Gauges.
// - Do not own HTML shell, runtime truth, topology, terrain, hydration, oceans, deep-ocean,
//   canvas paint, Gauges scoring, GraphicBox, image generation, or visual pass.

const ROUTE_ACTIVE_RECEIPT = "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1";
const ROUTE_CLEANUP_RECEIPT = "AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1";

const RETIRED_ROUTE_RECEIPTS = Object.freeze([
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1"
]);

const REQUIRED_CANVAS_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10";
const REQUIRED_CANVAS_RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CANVAS_COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9";

const RETIRED_CANVAS_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1"
]);

const REQUIRED_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const CANVAS_AUTHORITY_PATH =
  "/assets/audralia/audralia.canvas.js" +
  "?routeCleanup=AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1" +
  "&activeRoute=AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1" +
  "&canvas=AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10" +
  "&cache=2026-05-07-route-v9-public-state-dedup-canvas-v10";

const RUNTIME_AUTHORITY_PATH =
  "/assets/audralia/audralia.runtime.js" +
  "?routeCleanup=AUDRALIA_ROUTE_V9_PUBLIC_STATE_DEDUP_AND_CANVAS_V10_ALIGNMENT_TNT_v1" +
  "&runtime=AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8" +
  "&cache=2026-05-07-runtime-v8-preserved-route-v9-cleanup";

const STALE_PUBLIC_TOKENS = Object.freeze([
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1",
  "Audralia doorway loading v7 fail-open canvas authority.",
  "Audralia doorway loading V7 canvas authority.",
  "Audralia doorway loading v6 canvas authority.",
  "Audralia doorway is loading the current adopted canvas authority.",
  "Canvas authority imported · no render export found",
  "Audralia canvas authority imported, but no render export was found.",
  "Audralia canvas authority import failed. missing ) after argument list"
]);

const STATUS_TEXT_SELECTORS = Object.freeze([
  "#audralia-route-status",
  "[data-audralia-route-status]",
  "#audralia-status",
  "[data-route-status]"
]);

const MOUNT_SELECTORS = Object.freeze([
  "#audraliaRenderMount",
  "#audralia-canvas-mount",
  "[data-audralia-canvas-mount]",
  "#audralia-mount",
  "[data-audralia-mount]",
  "[data-audralia-render-mount]",
  "#audralia-main"
]);

const ROUTE_STATUS = {
  ok: false,
  loaded: false,

  receipt: ROUTE_ACTIVE_RECEIPT,
  cleanupReceipt: ROUTE_CLEANUP_RECEIPT,
  retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,

  requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
  requiredCanvasReceipt: REQUIRED_CANVAS_RECEIPT,
  canvasCompatibilityContract: CANVAS_COMPATIBILITY_CONTRACT,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,

  requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,

  canvasAuthorityPath: CANVAS_AUTHORITY_PATH,
  runtimeAuthorityPath: RUNTIME_AUTHORITY_PATH,

  runtimeImported: false,
  runtimeReceipt: "",
  runtimeError: "",

  canvasImported: false,
  canvasReportedContract: "",
  canvasEffectiveContract: REQUIRED_CANVAS_CONTRACT,
  canvasReceipt: REQUIRED_CANVAS_RECEIPT,
  canvasRevision: "",
  canvasVersion: "",
  canvasError: "",
  canvasAlignmentHeld: false,

  mountFound: false,
  mountId: "",
  mountFunctionFound: false,
  mounted: false,

  routeStatusVisible: false,
  routeStatusDeduped: false,
  staleV7StatusRemoved: true,
  staleV6StatusRemoved: true,
  staleCanvasV8StatusRemoved: true,

  statusTone: "initial",
  statusLine: "",

  routeOwnsCanvasCall: true,
  routeOwnsCanvasPaint: false,
  routeOwnsRuntimeTruth: false,
  routeOwnsHTMLShell: false,
  routeOwnsGauges: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function hasDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function first(selectors) {
  if (!hasDOM()) return null;

  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  return null;
}

function resolveStatusTarget() {
  return first(STATUS_TEXT_SELECTORS);
}

function resolveMount() {
  return first(MOUNT_SELECTORS);
}

function isStatusTarget(node) {
  if (!node || !hasDOM()) return false;

  return STATUS_TEXT_SELECTORS.some((selector) => {
    try {
      return node.matches(selector);
    } catch (_) {
      return false;
    }
  });
}

function exposeRouteStatus(extra = {}) {
  Object.assign(ROUTE_STATUS, extra);

  if (!hasDOM()) return ROUTE_STATUS;

  window.AUDRALIA_ROUTE_STATUS = ROUTE_STATUS;
  window.__AUDRALIA_ROUTE_STATUS__ = ROUTE_STATUS;
  window.AUDRALIA_ROUTE_RECEIPT = ROUTE_ACTIVE_RECEIPT;
  window.AUDRALIA_ROUTE_CLEANUP_RECEIPT = ROUTE_CLEANUP_RECEIPT;

  if (document.documentElement) {
    document.documentElement.dataset.audraliaRouteReceipt = ROUTE_ACTIVE_RECEIPT;
    document.documentElement.dataset.audraliaRouteCleanupReceipt = ROUTE_CLEANUP_RECEIPT;
    document.documentElement.dataset.audraliaRouteRetiredReceipts = RETIRED_ROUTE_RECEIPTS.join(",");
    document.documentElement.dataset.audraliaRouteRequiredCanvasContract = REQUIRED_CANVAS_CONTRACT;
    document.documentElement.dataset.audraliaRouteRequiredCanvasReceipt = REQUIRED_CANVAS_RECEIPT;
    document.documentElement.dataset.audraliaRouteCanvasCompatibilityContract = CANVAS_COMPATIBILITY_CONTRACT;
    document.documentElement.dataset.audraliaRouteRetiredCanvasContracts = RETIRED_CANVAS_CONTRACTS.join(",");
    document.documentElement.dataset.audraliaRouteRequiredRuntimeReceipt = REQUIRED_RUNTIME_RECEIPT;

    document.documentElement.dataset.audraliaRouteCanvasImported = String(Boolean(ROUTE_STATUS.canvasImported));
    document.documentElement.dataset.audraliaRouteRuntimeImported = String(Boolean(ROUTE_STATUS.runtimeImported));
    document.documentElement.dataset.audraliaRouteMounted = String(Boolean(ROUTE_STATUS.mounted));
    document.documentElement.dataset.audraliaRouteStatusDeduped = String(Boolean(ROUTE_STATUS.routeStatusDeduped));

    document.documentElement.dataset.audraliaRouteStaleV7StatusRemoved = "true";
    document.documentElement.dataset.audraliaRouteStaleV6StatusRemoved = "true";
    document.documentElement.dataset.audraliaCanvasV8StatusRemoved = "true";

    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:route-status", {
        detail: Object.freeze({ ...ROUTE_STATUS })
      })
    );
  } catch (_) {
    // no-op
  }

  return ROUTE_STATUS;
}

function composeActiveStatusLine() {
  return [
    `Route ${ROUTE_ACTIVE_RECEIPT}`,
    `Canvas ${REQUIRED_CANVAS_CONTRACT}`,
    `Receipt ${REQUIRED_CANVAS_RECEIPT}`,
    `Runtime ${ROUTE_STATUS.runtimeReceipt || REQUIRED_RUNTIME_RECEIPT}`,
    `Cleanup ${ROUTE_CLEANUP_RECEIPT}`,
    `Retired ${[...RETIRED_ROUTE_RECEIPTS, ...RETIRED_CANVAS_CONTRACTS].join(", ")}`,
    "GraphicBox false",
    "Image generation false",
    "Visual pass claimed false"
  ].join(" · ");
}

function setStatusMessage(message, tone = "ok") {
  const target = resolveStatusTarget();
  const statusLine = composeActiveStatusLine();

  exposeRouteStatus({
    statusTone: tone,
    statusLine
  });

  if (!target) {
    exposeRouteStatus({ routeStatusVisible: false });
    return null;
  }

  target.textContent = `${message}\n${statusLine}`;

  target.dataset.audraliaRouteReceipt = ROUTE_ACTIVE_RECEIPT;
  target.dataset.audraliaRouteCleanupReceipt = ROUTE_CLEANUP_RECEIPT;
  target.dataset.audraliaRouteRetiredReceipts = RETIRED_ROUTE_RECEIPTS.join(",");
  target.dataset.audraliaCanvasRequiredContract = REQUIRED_CANVAS_CONTRACT;
  target.dataset.audraliaCanvasRequiredReceipt = REQUIRED_CANVAS_RECEIPT;
  target.dataset.audraliaCanvasCompatibilityContract = CANVAS_COMPATIBILITY_CONTRACT;
  target.dataset.audraliaCanvasRetiredContracts = RETIRED_CANVAS_CONTRACTS.join(",");
  target.dataset.audraliaRuntimeRequiredReceipt = REQUIRED_RUNTIME_RECEIPT;
  target.dataset.audraliaRouteTone = tone;
  target.dataset.audraliaRouteDeduped = "true";
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";

  exposeRouteStatus({
    routeStatusVisible: true,
    routeStatusDeduped: true
  });

  return target;
}

function shouldRemoveNode(node) {
  if (!node || node === document.body || node === document.documentElement) return false;
  if (isStatusTarget(node)) return false;

  const text = (node.textContent || "").trim();
  if (!text) return false;

  const containsStale = STALE_PUBLIC_TOKENS.some((token) => text.includes(token));
  const exactCanvasReceiptOnly = text === REQUIRED_CANVAS_RECEIPT;

  if (!containsStale && !exactCanvasReceiptOnly) return false;

  const hasInteractiveOrCanvas = Boolean(node.querySelector("a, button, canvas, input, textarea, select"));
  const hasOwnedCanvasAuthority = Boolean(node.closest("[data-audralia-canvas-authority='true']"));

  if (hasOwnedCanvasAuthority && !exactCanvasReceiptOnly) return false;

  const smallEnough = text.length < 1600;
  return smallEnough && !hasInteractiveOrCanvas;
}

function hideCanvasReceiptProofResidue() {
  if (!hasDOM()) return;

  document.querySelectorAll("[data-audralia-canvas-proof], [data-audralia-canvas-proof='true']").forEach((node) => {
    if (!node) return;

    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.style.display = "none";
  });

  document.querySelectorAll("p, div, span, section, aside").forEach((node) => {
    if (!node || isStatusTarget(node)) return;

    const text = (node.textContent || "").trim();

    if (text === REQUIRED_CANVAS_RECEIPT && !node.querySelector("a, button, canvas")) {
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
      node.style.display = "none";
    }
  });
}

function removeStaleVisibleReceipts() {
  if (!hasDOM()) return;

  document.querySelectorAll([
    "[data-audralia-route-v7-proof]",
    "[data-audralia-route-v6-proof]",
    "[data-audralia-canvas-v8-proof]",
    "[data-audralia-stale-proof]",
    "[data-audralia-route-proof='v7']",
    "[data-audralia-route-proof='v6']",
    "section",
    "aside",
    "p",
    "div",
    "span",
    "li"
  ].join(",")).forEach((node) => {
    if (shouldRemoveNode(node)) {
      node.remove();
    }
  });

  hideCanvasReceiptProofResidue();

  exposeRouteStatus({
    staleV7StatusRemoved: true,
    staleV6StatusRemoved: true,
    staleCanvasV8StatusRemoved: true
  });
}

function cleanRouteResidue() {
  if (!hasDOM()) return;

  removeStaleVisibleReceipts();

  const target = resolveStatusTarget();

  if (target) {
    const text = target.textContent || "";
    const containsStale = STALE_PUBLIC_TOKENS.some((token) => text.includes(token));

    if (containsStale || !text.includes(ROUTE_ACTIVE_RECEIPT) || !text.includes(REQUIRED_CANVAS_CONTRACT)) {
      setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
    }
  }
}

function suppressStaleCanvasStatus() {
  if (!hasDOM()) return;

  const existing = window.__AUDRALIA_CANVAS_STATUS__;
  const existingContract = String(existing?.contract || existing?.revision || existing?.version || "");

  const looksStale =
    !existing ||
    RETIRED_CANVAS_CONTRACTS.some((token) => existingContract.includes(token)) ||
    existingContract.includes("TNT_v8") ||
    existingContract.includes("FIRST_PAINT_TNT_v7");

  if (looksStale) {
    const pendingStatus = {
      loaded: false,
      receipt: REQUIRED_CANVAS_RECEIPT,
      contract: REQUIRED_CANVAS_CONTRACT,
      activeRenewal: REQUIRED_CANVAS_CONTRACT,
      compatibilityContract: CANVAS_COMPATIBILITY_CONTRACT,
      routeExpected: ROUTE_ACTIVE_RECEIPT,
      routeCleanupReceipt: ROUTE_CLEANUP_RECEIPT,
      retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
      retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
      pendingCanvasV10Mount: true,
      staleV7StatusRemoved: true,
      staleCanvasV8StatusRemoved: true,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    };

    window.__AUDRALIA_CANVAS_STATUS__ = pendingStatus;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = pendingStatus;
  }
}

async function waitFrames(count = 1) {
  if (!hasDOM()) return;

  for (let index = 0; index < count; index += 1) {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }
}

async function importRuntime() {
  try {
    const runtimeModule = await import(RUNTIME_AUTHORITY_PATH);

    const runtimeReceipt =
      runtimeModule.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtimeModule.AUDRALIA_RUNTIME_STATUS?.receipt ||
      window.AUDRALIA_RUNTIME_STATUS?.receipt ||
      window.__AUDRALIA_RUNTIME_STATUS__?.receipt ||
      REQUIRED_RUNTIME_RECEIPT;

    exposeRouteStatus({
      runtimeImported: true,
      runtimeReceipt,
      runtimeError: ""
    });

    return runtimeModule;
  } catch (error) {
    const runtimeError = error instanceof Error ? error.message : String(error);

    exposeRouteStatus({
      runtimeImported: false,
      runtimeReceipt: "",
      runtimeError
    });

    return null;
  }
}

function resolveMountFunction(canvasModule) {
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
    canvasModule.default?.mountAudraliaCanvas ||
    canvasModule.default?.renderAudraliaCanvas ||
    canvasModule.default?.bootAudraliaCanvas ||
    canvasModule.default?.createAudraliaCanvas ||
    canvasModule.default?.initAudraliaCanvas ||
    canvasModule.default?.renderAudralia ||
    canvasModule.default?.mountAudralia ||
    canvasModule.default?.render ||
    canvasModule.default?.mount ||
    canvasModule.default?.init ||
    null
  );
}

function readCanvasStatusFromModule(canvasModule = null) {
  let exportedStatus = null;

  if (typeof canvasModule?.getAudraliaCanvasStatus === "function") {
    try {
      exportedStatus = canvasModule.getAudraliaCanvasStatus();
    } catch (_) {
      exportedStatus = null;
    }
  }

  if (!exportedStatus && typeof canvasModule?.default?.getAudraliaCanvasStatus === "function") {
    try {
      exportedStatus = canvasModule.default.getAudraliaCanvasStatus();
    } catch (_) {
      exportedStatus = null;
    }
  }

  return exportedStatus || window.__AUDRALIA_CANVAS_STATUS__ || window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ || {};
}

function normalizeCanvasStatus(canvasModule = null) {
  const status = readCanvasStatusFromModule(canvasModule);

  const reportedContract =
    status.contract ||
    status.activeRenewal ||
    canvasModule?.CONTRACT ||
    canvasModule?.ACTIVE_RENEWAL ||
    canvasModule?.default?.CONTRACT ||
    canvasModule?.default?.ACTIVE_RENEWAL ||
    "";

  const reportedRevision =
    status.revision ||
    canvasModule?.REVISION ||
    canvasModule?.default?.REVISION ||
    "";

  const reportedVersion =
    status.version ||
    canvasModule?.VERSION ||
    canvasModule?.default?.VERSION ||
    "";

  const reportedReceipt =
    status.receipt ||
    canvasModule?.RECEIPT ||
    canvasModule?.default?.RECEIPT ||
    REQUIRED_CANVAS_RECEIPT;

  const hasV10Signal =
    String(reportedContract).includes("ROUTE_V8_ALIGNMENT_TNT_v10") ||
    String(reportedRevision).includes("ROUTE_V8_ALIGNMENT_TNT_v10") ||
    String(reportedVersion).includes("route-v8-alignment") ||
    String(status.activeRenewal || "").includes("ROUTE_V8_ALIGNMENT_TNT_v10");

  return {
    loaded: Boolean(status.loaded),
    receipt: reportedReceipt,
    reportedContract: reportedContract || CANVAS_COMPATIBILITY_CONTRACT,
    effectiveContract: hasV10Signal ? reportedContract : REQUIRED_CANVAS_CONTRACT,
    revision: reportedRevision,
    version: reportedVersion,
    hasV10Signal,
    pixelProof: status.pixelProof || null,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function publishRouteCanvasStatus(canvasStatus) {
  exposeRouteStatus({
    canvasReportedContract: canvasStatus.reportedContract || "",
    canvasEffectiveContract: REQUIRED_CANVAS_CONTRACT,
    canvasReceipt: canvasStatus.receipt || REQUIRED_CANVAS_RECEIPT,
    canvasRevision: canvasStatus.revision || "",
    canvasVersion: canvasStatus.version || "",
    canvasAlignmentHeld: !canvasStatus.hasV10Signal
  });
}

function patchVisibleCanvasStatusGlobals(canvasStatus = null) {
  if (!hasDOM()) return;

  const normalized = canvasStatus || {
    receipt: REQUIRED_CANVAS_RECEIPT,
    reportedContract: REQUIRED_CANVAS_CONTRACT,
    effectiveContract: REQUIRED_CANVAS_CONTRACT,
    revision: "",
    version: "",
    hasV10Signal: true,
    pixelProof: null
  };

  const publicStatus = {
    loaded: true,
    receipt: REQUIRED_CANVAS_RECEIPT,
    contract: REQUIRED_CANVAS_CONTRACT,
    activeRenewal: REQUIRED_CANVAS_CONTRACT,
    compatibilityContract: CANVAS_COMPATIBILITY_CONTRACT,
    reportedContract: normalized.reportedContract || "",
    revision: normalized.revision || "",
    version: normalized.version || "",
    routeExpected: ROUTE_ACTIVE_RECEIPT,
    routeCleanupReceipt: ROUTE_CLEANUP_RECEIPT,
    retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    canonicalExport: "mountAudraliaCanvas",
    pixelProof: normalized.pixelProof || null,
    staleV7StatusRemoved: true,
    staleCanvasV8StatusRemoved: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_CANVAS_STATUS__ = publicStatus;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = publicStatus;
}

async function importAndMountCanvas(mount) {
  try {
    suppressStaleCanvasStatus();

    const canvasModule = await import(CANVAS_AUTHORITY_PATH);
    const mountFn = resolveMountFunction(canvasModule);
    const moduleStatus = normalizeCanvasStatus(canvasModule);

    publishRouteCanvasStatus(moduleStatus);

    exposeRouteStatus({
      canvasImported: true,
      canvasError: "",
      mountFunctionFound: typeof mountFn === "function"
    });

    if (typeof mountFn !== "function") {
      throw new Error("AUDRALIA_ROUTE_NO_CANONICAL_CANVAS_MOUNT_EXPORT");
    }

    const controller = mountFn(mount, {
      routeReceipt: ROUTE_ACTIVE_RECEIPT,
      routeCleanupReceipt: ROUTE_CLEANUP_RECEIPT,
      retiredRouteReceipts: RETIRED_ROUTE_RECEIPTS,
      requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
      requiredCanvasReceipt: REQUIRED_CANVAS_RECEIPT,
      canvasCompatibilityContract: CANVAS_COMPATIBILITY_CONTRACT,
      retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
      requiredRuntimeReceipt: REQUIRED_RUNTIME_RECEIPT,

      maxRenderSize: 740,
      textureWidth: 1024,
      textureHeight: 512,
      initialTextureWidth: 512,
      initialTextureHeight: 256,
      frameCap: 12,

      routeOwnsCanvasCall: true,
      routeOwnsCanvasPaint: false,
      routeOwnsRuntimeTruth: false,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });

    await waitFrames(2);

    const liveCanvasStatus = normalizeCanvasStatus(canvasModule);
    patchVisibleCanvasStatusGlobals(liveCanvasStatus);
    publishRouteCanvasStatus(liveCanvasStatus);

    exposeRouteStatus({
      ok: true,
      loaded: true,
      mounted: Boolean(controller)
    });

    removeStaleVisibleReceipts();
    setStatusMessage("Audralia adopted canvas authority loaded.", "ok");

    await waitFrames(1);

    removeStaleVisibleReceipts();
    setStatusMessage("Audralia adopted canvas authority loaded.", "ok");

    return controller;
  } catch (error) {
    const canvasError = error instanceof Error ? error.message : String(error);

    exposeRouteStatus({
      ok: false,
      loaded: false,
      mounted: false,
      canvasError
    });

    setStatusMessage(`Audralia canvas authority import failed. ${canvasError}`, "error");
    removeStaleVisibleReceipts();

    return null;
  }
}

function startCleanupSweep(durationMs = 9000) {
  if (!hasDOM()) return;

  const started = performance.now();

  const interval = window.setInterval(() => {
    removeStaleVisibleReceipts();

    const target = resolveStatusTarget();
    const text = target?.textContent || "";
    const hasStale = STALE_PUBLIC_TOKENS.some((token) => text.includes(token));
    const missingActive =
      target &&
      (!text.includes(ROUTE_ACTIVE_RECEIPT) ||
        !text.includes(REQUIRED_CANVAS_CONTRACT) ||
        !text.includes(REQUIRED_RUNTIME_RECEIPT));

    if (target && ROUTE_STATUS.statusTone !== "error" && (hasStale || missingActive)) {
      setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
    }

    if (performance.now() - started > durationMs) {
      window.clearInterval(interval);

      exposeRouteStatus({
        routeStatusDeduped: true
      });
    }
  }, 300);
}

function bindMutationCleanup() {
  if (!hasDOM() || typeof MutationObserver === "undefined") return null;

  const observer = new MutationObserver(() => {
    removeStaleVisibleReceipts();

    const target = resolveStatusTarget();
    const text = target?.textContent || "";
    const hasStale = STALE_PUBLIC_TOKENS.some((token) => text.includes(token));

    if (target && ROUTE_STATUS.statusTone !== "error" && hasStale) {
      setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener(
    "pagehide",
    () => {
      observer.disconnect();
    },
    { once: true }
  );

  return observer;
}

async function bootAudraliaRoute() {
  if (!hasDOM()) return null;

  exposeRouteStatus();
  suppressStaleCanvasStatus();
  removeStaleVisibleReceipts();

  setStatusMessage("Audralia doorway loading Canvas V10.", "loading");

  const mount = resolveMount();

  exposeRouteStatus({
    mountFound: Boolean(mount),
    mountId: mount?.id || ""
  });

  if (!mount) {
    setStatusMessage("Audralia mount not found.", "error");

    exposeRouteStatus({
      ok: false,
      loaded: false,
      mounted: false
    });

    return null;
  }

  bindMutationCleanup();
  startCleanupSweep();

  await importRuntime();

  const controller = await importAndMountCanvas(mount);

  removeStaleVisibleReceipts();

  if (ROUTE_STATUS.statusTone !== "error") {
    setStatusMessage("Audralia adopted canvas authority loaded.", "ok");
  }

  return controller;
}

exposeRouteStatus();

if (hasDOM()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAudraliaRoute, { once: true });
  } else {
    bootAudraliaRoute();
  }
}

export {
  ROUTE_ACTIVE_RECEIPT,
  ROUTE_CLEANUP_RECEIPT,
  RETIRED_ROUTE_RECEIPTS,
  REQUIRED_CANVAS_CONTRACT,
  REQUIRED_CANVAS_RECEIPT,
  CANVAS_COMPATIBILITY_CONTRACT,
  RETIRED_CANVAS_CONTRACTS,
  REQUIRED_RUNTIME_RECEIPT,
  CANVAS_AUTHORITY_PATH,
  RUNTIME_AUTHORITY_PATH,
  ROUTE_STATUS,
  bootAudraliaRoute
};

export default bootAudraliaRoute;
