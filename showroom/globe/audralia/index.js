// /showroom/globe/audralia/index.js
// AUDRALIA_G2_11B_JS_MICRO_ORCHESTRATOR_DROPDOWN_AND_HANDOFF_CONSUMER_TNT_v1
// Full-file replacement.
// Purpose:
// - Consume the G2.11A Mirrorland Gateway HTML shell.
// - Keep route JS as a micro-orchestrator.
// - Load runtime once, hand off mount once, wait boundedly for parent visibility, update existing panel, then stop.
// - Owns predefined popup controls only.
// - No new status panel. No broad DOM scan. No source primitive loading. No setInterval. No animation loop.
// - No generated image. No GraphicBox. No visual-pass claim.

const ROUTE_CONTRACT = "AUDRALIA_G2_11B_JS_MICRO_ORCHESTRATOR_DROPDOWN_AND_HANDOFF_CONSUMER_TNT_v1";
const PAIR_CONTRACT = "AUDRALIA_G2_11_HTML_JS_MIRRORLAND_GATEWAY_MICRO_ORCHESTRATOR_STANDARD_v1";
const PREVIOUS_ROUTE_CONTRACT = "AUDRALIA_G2_10B_ROUTE_BRIDGE_HTML_CONTRACT_CONSUMER_NO_WHITEOUT_TNT_v1";

const ROUTE = "/showroom/globe/audralia/";
const TARGET = "/showroom/globe/audralia/index.js";

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.v3.js";
const PARENT_EXPECTED_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
const RUNTIME_EXPECTED_CONTRACT = "AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1";

const SELECTORS = Object.freeze({
  panel: "#audraliaHandoffPanel",
  title: "#audraliaHandoffTitle",
  status: "#audraliaHandoffStatus",
  list: "#audraliaHandoffList",
  receipt: "#audraliaHandoffReceipt",
  script: "#audraliaBridgeScript",
  mount: "#audraliaCanvasMount"
});

const LIMITS = Object.freeze({
  parentVisibleAttempts: 16,
  parentVisibleDelayMs: 90,
  runtimeFallbackTimeoutMs: 3200
});

const state = {
  contract: ROUTE_CONTRACT,
  pairContract: PAIR_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  route: ROUTE,
  target: TARGET,

  cacheNonce: "",
  bootStarted: false,
  bootComplete: false,
  bootHeld: false,

  routeValid: false,
  targetsFound: false,
  mountFound: false,
  htmlShellPreserved: true,
  mirrorlandGateway: true,

  popupControlsBound: false,
  runtimeLoadStarted: false,
  runtimeLoadSucceeded: false,
  runtimeClassicFallbackAttempted: false,
  runtimeClassicFallbackSucceeded: false,
  runtimeContract: "",
  runtimeContractValid: false,

  mountCalled: false,
  mountAwaited: false,
  parentEngineLoaded: false,
  parentEngineDelegated: false,
  parentContractValid: false,
  parentFormVisibleAccepted: false,
  parentExpressionAccepted: false,
  handoffClosedFromParent: false,

  sourceReady: false,
  sourcePendingAccepted: true,

  status: "module-loaded",
  title: "Clean-canvas handoff pending",
  line: "HTML_READY · micro-orchestrator loaded",
  errors: []
};

let bootPromise = null;
let runtimePromise = null;
const classicLoads = new Map();

function hasWindow() {
  return typeof window !== "undefined";
}

function hasDocument() {
  return typeof document !== "undefined";
}

function root() {
  return hasDocument() ? document.documentElement : null;
}

function nowIso() {
  try {
    return new Date().toISOString();
  } catch (_error) {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}

function getBootstrapReceipt() {
  return hasWindow() && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT
    ? window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT
    : null;
}

function getImportNonce() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getCacheNonce() {
  if (state.cacheNonce) return state.cacheNonce;

  const receipt = getBootstrapReceipt();
  const doc = root();

  state.cacheNonce =
    (receipt && receipt.dynamicCacheKey ? String(receipt.dynamicCacheKey) : "") ||
    (hasWindow() && window.AUDRALIA_PAGE_CACHE_NONCE ? String(window.AUDRALIA_PAGE_CACHE_NONCE) : "") ||
    (doc
      ? doc.getAttribute("data-audralia-route-bridge-cache-key") ||
        doc.getAttribute("data-audralia-page-cache-nonce") ||
        ""
      : "") ||
    getImportNonce() ||
    `${ROUTE_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

  if (hasWindow()) window.AUDRALIA_PAGE_CACHE_NONCE = state.cacheNonce;

  if (doc) {
    doc.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce);
    doc.setAttribute("data-audralia-route-bridge-cache-key", state.cacheNonce);
  }

  return state.cacheNonce;
}

function versioned(path) {
  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(getCacheNonce())}`;
}

function routeIsValid() {
  if (!hasWindow()) return true;
  const pathname = window.location && window.location.pathname ? window.location.pathname : ROUTE;
  return pathname === ROUTE || pathname === `${ROUTE}index.html` || pathname.endsWith(ROUTE);
}

function q(selector) {
  return hasDocument() ? document.querySelector(selector) : null;
}

function getTargets() {
  return {
    panel: q(SELECTORS.panel),
    title: q(SELECTORS.title),
    status: q(SELECTORS.status),
    list: q(SELECTORS.list),
    receipt: q(SELECTORS.receipt),
    script: q(SELECTORS.script),
    mount: q(SELECTORS.mount)
  };
}

function ensurePanelSafety(panel) {
  if (!panel || !panel.style) return;

  panel.setAttribute("data-audralia-existing-handoff-panel", "true");
  panel.setAttribute("data-audralia-route-bridge-status-target", "true");
  panel.setAttribute("data-audralia-nondestructive-bridge-target", "true");
  panel.setAttribute("data-audralia-selectable-receipt-panel", "true");
  panel.setAttribute("data-audralia-js-contract", ROUTE_CONTRACT);

  panel.style.userSelect = "text";
  panel.style.WebkitUserSelect = "text";
  panel.style.WebkitTouchCallout = "default";
  panel.style.touchAction = "pan-y";
  panel.style.pointerEvents = "auto";
  panel.style.maxWidth = "100%";
  panel.style.overflowX = "hidden";
  panel.style.overflowWrap = "anywhere";
}

function listItem(label, value) {
  const li = document.createElement("li");
  const strong = document.createElement("strong");
  strong.textContent = label;
  li.appendChild(strong);
  li.appendChild(document.createTextNode(" · "));
  const span = document.createElement("span");
  span.textContent = String(value);
  span.style.overflowWrap = "anywhere";
  li.appendChild(span);
  return li;
}

function rows() {
  return [
    ["MIRRORLAND_GATEWAY", "true"],
    ["ROUTE_VALID", state.routeValid ? ROUTE : "false"],
    ["HTML_TARGETS_FOUND", state.targetsFound ? "true" : "false"],
    ["MOUNT_TARGET_FOUND", state.mountFound ? "#audraliaCanvasMount" : "false"],
    ["CACHE_NONCE", getCacheNonce()],
    ["RUNTIME_LOAD_SUCCEEDED", state.runtimeLoadSucceeded ? "true" : "false"],
    ["RUNTIME_CONTRACT_VALID", state.runtimeContractValid ? "true" : "false"],
    ["MOUNT_CALLED", state.mountCalled ? "true" : "false"],
    ["MOUNT_AWAITED", state.mountAwaited ? "true" : "false"],
    ["PARENT_ENGINE_LOADED", state.parentEngineLoaded ? "true" : "false"],
    ["PARENT_ENGINE_DELEGATED", state.parentEngineDelegated ? "true" : "false"],
    ["PARENT_CONTRACT_VALID", state.parentContractValid ? "true" : "false"],
    ["PARENT_FORM_VISIBLE", state.parentFormVisibleAccepted ? "true" : "false"],
    ["SOURCE_STATE", state.sourceReady ? "source ready" : "source pending accepted"],
    ["JS_INTERVAL_LOCK", "no setInterval · bounded checks only"],
    ["HTML_SHELL_PRESERVED", "true"]
  ];
}

function updatePanel(scope = "status") {
  const targets = getTargets();

  state.targetsFound = Boolean(
    targets.panel &&
      targets.title &&
      targets.status &&
      targets.list &&
      targets.receipt &&
      targets.script
  );

  state.mountFound = Boolean(targets.mount);

  if (!targets.panel) {
    publishReceipt(`${scope}-panel-missing`);
    return;
  }

  ensurePanelSafety(targets.panel);

  targets.panel.setAttribute(
    "data-audralia-handoff-state",
    state.parentFormVisibleAccepted ? "visible" : state.bootHeld ? "hold" : "pending"
  );
  targets.panel.setAttribute("data-audralia-js-scope", scope);
  targets.panel.setAttribute("data-audralia-js-contract", ROUTE_CONTRACT);

  if (targets.title) targets.title.textContent = state.title;
  if (targets.status) targets.status.textContent = state.line;
  if (targets.list) targets.list.replaceChildren(...rows().map(([label, value]) => listItem(label, value)));
  if (targets.receipt) targets.receipt.textContent = ROUTE_CONTRACT;
  if (targets.script) targets.script.textContent = `Route bridge script: ${TARGET}?v=${encodeURIComponent(getCacheNonce())}`;

  publishReceipt(scope);
}

function hold(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);

  state.bootHeld = true;
  state.status = "handoff-held";
  state.title = "Clean-canvas handoff held";
  state.line = "RUNTIME_OR_PARENT_FAILED · HTML shell preserved";
  state.errors.push({ scope, message, time: nowIso() });

  const doc = root();
  if (doc) {
    doc.setAttribute("data-audralia-route-status", state.status);
    doc.setAttribute("data-audralia-html-shell-preserved", "true");
    doc.setAttribute("data-audralia-no-whiteout-guard-active", "true");
  }

  updatePanel(scope);
  return getStatus();
}

function scriptAlreadyLoaded(path) {
  if (!hasDocument()) return false;
  const normalized = path.split("?")[0];
  return Array.from(document.scripts).some((script) => {
    const src = script.getAttribute("src") || "";
    return src.split("?")[0] === normalized;
  });
}

function loadClassic(path, key, readyCheck, timeoutMs) {
  if (!hasDocument()) return Promise.resolve(false);
  if (typeof readyCheck === "function" && readyCheck()) return Promise.resolve(true);

  const normalized = path.split("?")[0];
  if (classicLoads.has(normalized)) return classicLoads.get(normalized);

  const promise = new Promise((resolve) => {
    const wait = () => {
      const started = Date.now();

      const step = () => {
        if (typeof readyCheck === "function" && readyCheck()) {
          resolve(true);
          return;
        }

        if (Date.now() - started >= timeoutMs) {
          resolve(false);
          return;
        }

        setTimeout(step, 50);
      };

      step();
    };

    if (scriptAlreadyLoaded(path)) {
      wait();
      return;
    }

    const script = document.createElement("script");
    script.src = versioned(path);
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-micro-orchestrator-loader", ROUTE_CONTRACT);
    script.setAttribute("data-audralia-loader-key", key);
    script.setAttribute("data-generated-image", "false");
    script.setAttribute("data-graphic-box", "false");
    script.setAttribute("data-visual-pass-claimed", "false");
    script.onload = wait;
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  classicLoads.set(normalized, promise);
  return promise;
}

function resolveRuntime(moduleValue = null) {
  if (moduleValue) {
    if (moduleValue.default && typeof moduleValue.default === "object") return moduleValue.default;
    if (typeof moduleValue.default === "function") return moduleValue.default;
    if (moduleValue.api && typeof moduleValue.api === "object") return moduleValue.api;
    if (typeof moduleValue.mount === "function") return moduleValue;
  }

  if (!hasWindow()) return null;

  return (
    window.AUDRALIA_RUNTIME ||
    window.AUDRALIA_CLEAN_CANVAS_RUNTIME ||
    window.AUDRALIA_RUNTIME_SHIM ||
    null
  );
}

function readRuntimeContract(runtime) {
  if (!runtime) return "";
  if (runtime.CONTRACT) return String(runtime.CONTRACT);
  if (runtime.contract) return String(runtime.contract);

  if (typeof runtime.getStatus === "function") {
    try {
      const status = runtime.getStatus();
      return String(status && status.contract ? status.contract : "");
    } catch (_error) {}
  }

  return "";
}

async function loadRuntime() {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    state.runtimeLoadStarted = true;
    state.status = "runtime-loading";
    state.title = "Clean-canvas handoff pending";
    state.line = "RUNTIME_LOADING · one-time handoff";
    updatePanel("runtime-loading");

    try {
      const moduleValue = await import(versioned(RUNTIME_PATH));
      const runtime = resolveRuntime(moduleValue);

      state.runtimeLoadSucceeded = Boolean(runtime);
      state.runtimeContract = readRuntimeContract(runtime);
      state.runtimeContractValid = !state.runtimeContract || state.runtimeContract === RUNTIME_EXPECTED_CONTRACT;
      updatePanel("runtime-imported");

      return runtime;
    } catch (error) {
      state.runtimeClassicFallbackAttempted = true;

      const loaded = await loadClassic(
        RUNTIME_PATH,
        "runtime-classic-fallback",
        () => Boolean(resolveRuntime()),
        LIMITS.runtimeFallbackTimeoutMs
      );

      const runtime = loaded ? resolveRuntime() : null;
      state.runtimeClassicFallbackSucceeded = Boolean(runtime);
      state.runtimeLoadSucceeded = Boolean(runtime);
      state.runtimeContract = readRuntimeContract(runtime);
      state.runtimeContractValid = !state.runtimeContract || state.runtimeContract === RUNTIME_EXPECTED_CONTRACT;

      if (!runtime) {
        state.errors.push({
          scope: "runtime-load",
          message: error && error.message ? error.message : String(error),
          time: nowIso()
        });
      }

      updatePanel("runtime-classic-fallback");
      return runtime;
    }
  })();

  return runtimePromise;
}

function readParentApi() {
  if (!hasWindow()) return null;

  return (
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY ||
    window.AUDRALIA_CLEAN_CANVAS_ENGINE ||
    window.AUDRALIA_CLEAN_ENGINE_PARENT ||
    window.AUDRALIA_ENGINE ||
    window.AUDRALIA_CLEAN_PARENT_ENGINE ||
    window.AUDRALIA_PARENT_FULL_TEXTURE_ATLAS_ENGINE ||
    null
  );
}

function parentReceipts() {
  if (!hasWindow()) return [];

  return [
    window.AUDRALIA_ENGINE_RECEIPT,
    window.AUDRALIA_CLEAN_ENGINE_RECEIPT,
    window.AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT,
    window.AUDRALIA_PARENT_ENGINE_RECEIPT,
    window.AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_RECEIPT,
    window.AUDRALIA_RUNTIME_RECEIPT && window.AUDRALIA_RUNTIME_RECEIPT.parentStatus,
    window.AUDRALIA_RUNTIME_SHIM_RECEIPT && window.AUDRALIA_RUNTIME_SHIM_RECEIPT.parentStatus
  ].filter(Boolean);
}

function parentStatusFromApi(parent) {
  if (!parent) return null;

  try {
    if (typeof parent.getStatus === "function") return parent.getStatus();
    if (typeof parent.status === "function") return parent.status();
  } catch (_error) {}

  return null;
}

function parentContractValid(receipt) {
  if (!receipt || typeof receipt !== "object") return false;

  const contract = String(receipt.contract || "");
  const internal = String(receipt.internalContract || receipt.INTERNAL_CONTRACT || "");
  const family = String(receipt.family || "");
  const model = String(receipt.renderModel || "");

  return (
    contract === PARENT_EXPECTED_CONTRACT ||
    family === PARENT_EXPECTED_CONTRACT ||
    (internal.includes("PARENT") && internal.includes("ATLAS")) ||
    (contract.includes("PARENT") && contract.includes("ATLAS")) ||
    model.includes("atlas") ||
    model.includes("sphere")
  );
}

function parentVisible(receipt) {
  if (!receipt || typeof receipt !== "object") return false;

  return Boolean(
    receipt.formVisible === true ||
    receipt.FORM_VISIBLE === true ||
    receipt.parentFormVisible === true ||
    receipt.mounted === true ||
    receipt.visiblePixelsPainted === true ||
    receipt.textureAtlasBuilt === true ||
    receipt.planetMaterialIntegrated === true
  );
}

function parentVisibleGlobals() {
  if (!hasWindow()) return false;
  const doc = root();

  return Boolean(
    window.AUDRALIA_ENGINE_FORM_VISIBLE === true ||
    window.AUDRALIA_PARENT_FORM_VISIBLE === true ||
    window.AUDRALIA_FORM_VISIBLE === true ||
    window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true ||
    window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE === true ||
    window.AUDRALIA_RUNTIME_SHIM_FORM_VISIBLE_CONFIRMED === true ||
    (doc &&
      doc.dataset &&
      (doc.dataset.audraliaParentFormVisible === "true" ||
        doc.dataset.audraliaFormVisible === "true" ||
        doc.dataset.audraliaRuntimeFormVisible === "true"))
  );
}

function syncParent() {
  const parent = readParentApi();
  const status = parentStatusFromApi(parent);
  const receipts = [status, ...parentReceipts()].filter(Boolean);
  const valid = receipts.find(parentContractValid) || receipts[0] || null;

  state.parentEngineLoaded = Boolean(parent || receipts.length);
  state.parentContractValid = Boolean(valid && parentContractValid(valid));
  state.parentFormVisibleAccepted = Boolean(parentVisibleGlobals() || receipts.some(parentVisible));
  state.parentExpressionAccepted = Boolean(
    state.parentEngineLoaded &&
      (state.parentContractValid || state.parentFormVisibleAccepted)
  );

  return valid;
}

function syncSource() {
  if (!hasWindow()) return;

  const topology = window.AUDRALIA_TOPOLOGY_GRATITUDE;
  const source = window.AUDRALIA_GRATITUDE_SOURCE_FIELD;
  const traversal = window.AUDRALIA_GRATITUDE_TRAVERSAL_RECEIPT;

  state.sourceReady = Boolean(
    source ||
      (topology && typeof topology.getSourceField === "function") ||
      (traversal && traversal.receiptReturnReady !== false)
  );
}

function closeIfParentVisible(scope) {
  syncParent();
  syncSource();

  if (state.parentFormVisibleAccepted && state.parentExpressionAccepted) {
    state.status = "form-visible-parent-confirmed";
    state.bootComplete = true;
    state.handoffClosedFromParent = true;
    state.title = "Clean-canvas handoff visible";
    state.line = state.sourceReady
      ? "FORM_VISIBLE · parent-confirmed · source ready"
      : "FORM_VISIBLE · parent-confirmed · source pending";

    const doc = root();
    if (doc) {
      doc.setAttribute("data-audralia-route-status", state.status);
      doc.setAttribute("data-audralia-route-bridge-closed", "true");
      doc.setAttribute("data-audralia-form-visible", "true");
      doc.setAttribute("data-audralia-parent-form-visible", "true");
      doc.setAttribute("data-audralia-html-shell-preserved", "true");
    }

    updatePanel(scope);
    return true;
  }

  updatePanel(scope);
  return false;
}

async function waitForParentVisible() {
  for (let index = 0; index < LIMITS.parentVisibleAttempts; index += 1) {
    if (closeIfParentVisible(`parent-visible-check-${index + 1}`)) return true;
    await sleep(LIMITS.parentVisibleDelayMs + index * 10);
  }

  closeIfParentVisible("parent-visible-bounded-timeout");
  return state.parentFormVisibleAccepted;
}

async function callRuntime(runtime, mount) {
  if (!runtime) throw new Error("Runtime unavailable.");

  const options = {
    route: ROUTE,
    target: TARGET,
    cacheNonce: getCacheNonce(),
    delegatedBy: ROUTE_CONTRACT,
    pairContract: PAIR_CONTRACT,
    mirrorlandGateway: true,
    htmlShellPreserved: true,
    mustReuseExistingHandoffPanel: true,
    mayCreateStatusPanel: false,
    mayHideLegacyPanel: false,
    mayScanBroadDom: false,
    canvasShellStatusInsertionForbidden: true,
    childVisualPrecedenceRequired: false,
    sourcePendingAccepted: true,
    handoffTargets: { ...SELECTORS }
  };

  state.mountCalled = true;
  updatePanel("runtime-mount-called");

  let result;

  if (typeof runtime === "function") result = runtime(mount, options);
  else if (runtime && typeof runtime.mount === "function") result = runtime.mount(mount, options);
  else if (runtime && typeof runtime.boot === "function") result = runtime.boot(mount, options);
  else if (runtime && typeof runtime.start === "function") result = runtime.start(mount, options);
  else if (runtime && typeof runtime.init === "function") result = runtime.init(mount, options);
  else if (runtime && typeof runtime.create === "function") result = runtime.create(mount, options);
  else throw new Error("Runtime loaded, but no mount-compatible method was exposed.");

  await Promise.resolve(result);

  state.mountAwaited = true;
  state.parentEngineDelegated = true;
  syncParent();
  updatePanel("runtime-mount-awaited");

  return true;
}

function bindPopups() {
  if (!hasDocument() || state.popupControlsBound) return;

  document.querySelectorAll("[data-audralia-popup-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-audralia-popup-open");
      const dialog = document.querySelector(`[data-audralia-popup="${key}"]`);

      if (!dialog) return;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    });
  });

  document.querySelectorAll("[data-audralia-popup-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (!dialog) return;

      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    });
  });

  state.popupControlsBound = true;
}

async function bootAudraliaDoorway() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    try {
      state.bootStarted = true;
      state.routeValid = routeIsValid();
      getCacheNonce();
      bindPopups();

      const targets = getTargets();
      state.targetsFound = Boolean(
        targets.panel &&
          targets.title &&
          targets.status &&
          targets.list &&
          targets.receipt &&
          targets.script
      );
      state.mountFound = Boolean(targets.mount);

      if (targets.panel) ensurePanelSafety(targets.panel);

      if (!state.routeValid) return hold("route-invalid", "Route mismatch. HTML shell preserved.");
      if (!state.targetsFound) return hold("html-targets-missing", "Required handoff targets missing. JS did not create replacements.");
      if (!targets.mount) return hold("mount-missing", "Canvas mount missing. HTML shell preserved.");

      state.status = "route-validated";
      state.title = "Clean-canvas handoff pending";
      state.line = "MIRRORLAND_GATEWAY_READY · runtime handoff starting";
      updatePanel("route-validated");

      if (closeIfParentVisible("pre-runtime-parent-check")) return getStatus();

      const runtime = await loadRuntime();
      if (!runtime) return hold("runtime-unavailable", "Runtime failed to load. HTML shell preserved.");

      await callRuntime(runtime, targets.mount);
      await waitForParentVisible();

      if (!state.parentFormVisibleAccepted) {
        return hold("parent-visible-not-confirmed", "Parent did not confirm visible form inside bounded wait. HTML shell preserved.");
      }

      state.bootComplete = true;
      publishReceipt("boot-complete");
      return getStatus();
    } catch (error) {
      return hold("boot-error", error);
    }
  })();

  return bootPromise;
}

function publishReceipt(scope = "publish") {
  if (!hasWindow()) return null;

  syncParent();
  syncSource();

  const receipt = {
    contract: ROUTE_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_ROUTE_CONTRACT,
    route: ROUTE,
    target: TARGET,
    scope,
    status: state.status,
    updatedAt: nowIso(),

    mirrorlandGateway: true,
    htmlShellPreserved: true,
    microOrchestrator: true,
    routeBridgeMayCreateStatusPanel: false,
    routeBridgeMayHideLegacyPanel: false,
    routeBridgeMayScanBroadDom: false,
    canvasShellStatusInsertionForbidden: true,

    routeValid: state.routeValid,
    targetsFound: state.targetsFound,
    mountFound: state.mountFound,
    cacheNonce: getCacheNonce(),

    popupControlsBound: state.popupControlsBound,
    runtimeLoadStarted: state.runtimeLoadStarted,
    runtimeLoadSucceeded: state.runtimeLoadSucceeded,
    runtimeClassicFallbackAttempted: state.runtimeClassicFallbackAttempted,
    runtimeClassicFallbackSucceeded: state.runtimeClassicFallbackSucceeded,
    runtimeContract: state.runtimeContract,
    runtimeContractValid: state.runtimeContractValid,

    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentExpressionAccepted: state.parentExpressionAccepted,
    parentFormVisibleAccepted: state.parentFormVisibleAccepted,
    handoffClosedFromParent: state.handoffClosedFromParent,

    sourceReady: state.sourceReady,
    sourcePendingAccepted: true,

    setIntervalUsed: false,
    requestAnimationFrameLoopUsed: false,
    sourcePrimitiveLoadingUsed: false,
    destructiveDomScanUsed: false,
    newStatusPanelCreated: false,
    legacyPanelHidden: false,

    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,

    errors: state.errors.slice()
  };

  window.AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_RECEIPT = receipt;
  window.AUDRALIA_MIRRORLAND_GATEWAY_ROUTE_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_MICRO_ORCHESTRATOR_RECEIPT = receipt;
  window.AUDRALIA_CHILD_VISUAL_PRECEDENCE_REQUIRED = false;

  const doc = root();
  if (doc) {
    doc.setAttribute("data-audralia-route-contract", ROUTE_CONTRACT);
    doc.setAttribute("data-audralia-pair-contract", PAIR_CONTRACT);
    doc.setAttribute("data-audralia-route-status", state.status);
    doc.setAttribute("data-audralia-mirrorland-gateway", "true");
    doc.setAttribute("data-audralia-micro-orchestrator", "true");
    doc.setAttribute("data-audralia-html-shell-preserved", "true");
    doc.setAttribute("data-audralia-parent-form-visible", String(state.parentFormVisibleAccepted));
    doc.setAttribute("data-audralia-child-visual-precedence-required", "false");
    doc.setAttribute("data-generated-image", "false");
    doc.setAttribute("data-graphic-box", "false");
    doc.setAttribute("data-visual-pass-claimed", "false");
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-bridge:receipt", { detail: receipt }));
  } catch (_error) {}

  return receipt;
}

function getStatus() {
  return {
    contract: ROUTE_CONTRACT,
    pairContract: PAIR_CONTRACT,
    route: ROUTE,
    target: TARGET,
    status: state.status,
    bootStarted: state.bootStarted,
    bootComplete: state.bootComplete,
    bootHeld: state.bootHeld,
    routeValid: state.routeValid,
    targetsFound: state.targetsFound,
    mountFound: state.mountFound,
    popupControlsBound: state.popupControlsBound,
    runtimeLoadSucceeded: state.runtimeLoadSucceeded,
    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentFormVisibleAccepted: state.parentFormVisibleAccepted,
    sourceReady: state.sourceReady,
    sourcePendingAccepted: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,
    errors: state.errors.slice()
  };
}

const api = Object.freeze({
  contract: ROUTE_CONTRACT,
  CONTRACT: ROUTE_CONTRACT,
  pairContract: PAIR_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  route: ROUTE,
  target: TARGET,
  bootAudraliaDoorway,
  boot: bootAudraliaDoorway,
  start: bootAudraliaDoorway,
  init: bootAudraliaDoorway,
  create: bootAudraliaDoorway,
  getStatus,
  status: getStatus
});

if (hasWindow()) {
  window.AUDRALIA_ROUTE_BRIDGE = api;
  window.AUDRALIA_ROUTE_BRIDGE_API = api;
  window.AUDRALIA_MIRRORLAND_GATEWAY_ROUTE_BRIDGE = api;
  window.AUDRALIA_ROUTE_BRIDGE_MICRO_ORCHESTRATOR = api;
  publishReceipt("module-load");
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bootAudraliaDoorway().catch((error) => hold("domcontentloaded-boot", error));
    }, { once: true });
  } else {
    queueMicrotask(() => {
      bootAudraliaDoorway().catch((error) => hold("immediate-boot", error));
    });
  }
}

export {
  ROUTE_CONTRACT,
  PAIR_CONTRACT,
  PREVIOUS_ROUTE_CONTRACT,
  bootAudraliaDoorway,
  getStatus
};

export default bootAudraliaDoorway;
