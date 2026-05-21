// /showroom/globe/audralia/index.js
// AUDRALIA_G2_10B_ROUTE_BRIDGE_HTML_CONTRACT_CONSUMER_NO_WHITEOUT_TNT_v1
// Full-file replacement.
// Purpose:
// - Consume the G2.10A HTML handoff-panel DOM contract.
// - Preserve the working G2.9 parent-confirmed route behavior.
// - Prevent whiteout/page crash by containing all runtime/parent failures inside the existing HTML panel.
// - No new status panel. No broad DOM scan. No legacy-panel hiding. No canvas-shell insertion.
// - No setInterval. No bridge requestAnimationFrame loop. No visual-pass claim.

const AUDRALIA_ROUTE_CONTRACT =
  "AUDRALIA_G2_10B_ROUTE_BRIDGE_HTML_CONTRACT_CONSUMER_NO_WHITEOUT_TNT_v1";

const PREVIOUS_ROUTE_CONTRACT =
  "AUDRALIA_G2_9_ROUTE_BRIDGE_PLANET_FAMILY_ALIGNED_RETURN_VERIFIER_TNT_v1";

const FAILED_ROUTE_CONTRACT_RETIRED =
  "AUDRALIA_G2_10_ROUTE_BRIDGE_SELECTABLE_STATUS_AND_DUPLICATE_PANEL_SANITIZER_TNT_v1";

const ROUTE = "/showroom/globe/audralia/";
const TARGET = "/showroom/globe/audralia/index.js";

const CHAIN_CONTRACT =
  "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_ROUTE_BRIDGE_TNT_v1";

const PARENT_COMPATIBILITY_CONTRACT =
  "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

const RUNTIME_EXPECTED_CONTRACT =
  "AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1";

const PATHS = Object.freeze({
  manifest: "/assets/showroom/globe/planet/planet.manifest.js",
  math: "/assets/showroom/globe/planet/planet.math.js",
  lattice: "/assets/showroom/globe/planet/planet.lattice.js",
  palette: "/assets/showroom/globe/planet/planet.palette.js",
  runtime: "/assets/audralia/audralia.runtime.v3.js"
});

const PRIMITIVE_GLOBALS = Object.freeze({
  manifest: Object.freeze([
    "DGB_PLANET_FAMILY_MANIFEST",
    "AUDRALIA_CLEAN_CANVAS_MANIFEST",
    "AUDRALIA_PLANET_FAMILY_MANIFEST"
  ]),
  math: Object.freeze([
    "DGB_PLANET_FAMILY_MATH",
    "AUDRALIA_CLEAN_CANVAS_MATH",
    "AUDRALIA_PLANET_FAMILY_MATH"
  ]),
  lattice: Object.freeze([
    "DGB_PLANET_FAMILY_LATTICE",
    "AUDRALIA_CLEAN_CANVAS_LATTICE",
    "AUDRALIA_PLANET_FAMILY_LATTICE"
  ]),
  palette: Object.freeze([
    "DGB_PLANET_FAMILY_PALETTE",
    "AUDRALIA_CLEAN_CANVAS_PALETTE",
    "AUDRALIA_PLANET_FAMILY_PALETTE"
  ])
});

const TARGETS = Object.freeze({
  panel: "#audraliaHandoffPanel",
  title: "#audraliaHandoffTitle",
  status: "#audraliaHandoffStatus",
  list: "#audraliaHandoffList",
  receipt: "#audraliaHandoffReceipt",
  script: "#audraliaBridgeScript",
  mount: "#audraliaCanvasMount"
});

const BOOT = Object.freeze({
  primitiveLoadTimeoutMs: 3200,
  runtimeClassicLoadTimeoutMs: 3200,
  parentVisibleAttempts: 16,
  parentVisibleDelayMs: 90
});

const state = {
  contract: AUDRALIA_ROUTE_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  failedContractRetired: FAILED_ROUTE_CONTRACT_RETIRED,
  target: TARGET,
  route: ROUTE,

  cacheNonce: "",
  bootStarted: false,
  bootComplete: false,
  bootFailed: false,

  routeValid: false,
  htmlContractConsumer: true,
  htmlHandoffPanelFound: false,
  existingHandoffPanelReused: false,
  routeBridgeMayCreateStatusPanel: false,
  routeBridgeMayHideLegacyPanel: false,
  routeBridgeMayScanBroadDom: false,
  canvasShellStatusInsertionForbidden: true,

  mountFound: false,
  primitiveLoadStarted: false,
  primitiveLoadComplete: false,
  planetManifestReady: false,
  planetMathReady: false,
  planetLatticeReady: false,
  planetPaletteReady: false,
  primitiveContracts: {},

  runtimeImportStarted: false,
  runtimeImportSucceeded: false,
  runtimeClassicFallbackAttempted: false,
  runtimeClassicFallbackSucceeded: false,
  runtimeContract: "",
  runtimeContractValid: false,

  mountCalled: false,
  mountAwaited: false,
  parentHandoffAwaited: false,
  parentEngineLoaded: false,
  parentEngineDelegated: false,
  parentContractValid: false,
  parentExpressionAccepted: false,
  parentFormVisibleAccepted: false,
  handoffClosedFromParentReceipt: false,

  gratitudeSourceFieldReady: false,
  gratitudeReceiptReturnReady: false,

  noWhiteoutGuardActive: true,
  pendingLoopPrevented: true,
  setIntervalUsed: false,
  requestAnimationFrameLoopUsed: false,
  destructiveDomScanUsed: false,
  newStatusPanelCreated: false,
  legacyPanelHidden: false,

  status: "module-loaded",
  visibleLabel: "Clean-canvas handoff pending",
  visibleSubstatus: "DYNAMIC_BOOTSTRAP · route bridge loaded",
  finalMessage: "",
  errors: []
};

const scriptLoads = new Map();
let bootPromise = null;
let runtimePromise = null;

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

function getImportNonce() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getBootstrapReceipt() {
  return hasWindow() && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT
    ? window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT
    : null;
}

function getCacheNonce() {
  if (state.cacheNonce) return state.cacheNonce;

  const receipt = getBootstrapReceipt();
  const doc = root();

  state.cacheNonce =
    (hasWindow() && window.AUDRALIA_PAGE_CACHE_NONCE
      ? String(window.AUDRALIA_PAGE_CACHE_NONCE)
      : "") ||
    (receipt && receipt.dynamicCacheKey ? String(receipt.dynamicCacheKey) : "") ||
    (doc
      ? doc.getAttribute("data-audralia-route-bridge-cache-key") ||
        doc.getAttribute("data-audralia-page-cache-nonce") ||
        doc.getAttribute("data-html-cache-key") ||
        ""
      : "") ||
    getImportNonce() ||
    `${CHAIN_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

  if (hasWindow()) {
    window.AUDRALIA_PAGE_CACHE_NONCE = state.cacheNonce;
    window.AUDRALIA_SINGLE_CACHE_NONCE_CHAIN = true;
  }

  if (doc) {
    doc.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce);
    doc.setAttribute("data-audralia-route-bridge-cache-key", state.cacheNonce);
    doc.setAttribute("data-audralia-single-cache-nonce-chain", "true");
  }

  return state.cacheNonce;
}

function versioned(path) {
  return `${path}${String(path).includes("?") ? "&" : "?"}v=${encodeURIComponent(getCacheNonce())}`;
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
    panel: q(TARGETS.panel),
    title: q(TARGETS.title),
    status: q(TARGETS.status),
    list: q(TARGETS.list),
    receipt: q(TARGETS.receipt),
    script: q(TARGETS.script),
    mount: q(TARGETS.mount)
  };
}

function applyPanelSafety(panel) {
  if (!panel || !panel.style) return;

  panel.setAttribute("data-audralia-route-bridge-status-target", "true");
  panel.setAttribute("data-audralia-existing-handoff-panel", "true");
  panel.setAttribute("data-audralia-nondestructive-bridge-target", "true");
  panel.setAttribute("data-audralia-selectable-receipt-panel", "true");

  panel.style.userSelect = "text";
  panel.style.WebkitUserSelect = "text";
  panel.style.WebkitTouchCallout = "default";
  panel.style.touchAction = "pan-y";
  panel.style.pointerEvents = "auto";
  panel.style.maxWidth = "100%";
  panel.style.overflowX = "hidden";
  panel.style.overflowWrap = "anywhere";
}

function makeListItem(label, value) {
  const item = document.createElement("li");
  const strong = document.createElement("strong");
  strong.textContent = label;
  item.appendChild(strong);
  item.appendChild(document.createTextNode(" · "));
  const span = document.createElement("span");
  span.textContent = String(value);
  span.style.overflowWrap = "anywhere";
  span.style.wordBreak = "break-word";
  item.appendChild(span);
  return item;
}

function statusRows() {
  return [
    ["ROUTE_VALID", state.routeValid ? ROUTE : "false"],
    ["HTML_HANDOFF_PANEL_FOUND", state.htmlHandoffPanelFound ? "true" : "false"],
    ["EXISTING_HANDOFF_PANEL_REUSED", state.existingHandoffPanelReused ? "true" : "false"],
    ["MOUNT_TARGET_FOUND", state.mountFound ? "true" : "false"],
    ["SINGLE_CACHE_NONCE", getCacheNonce()],
    ["PLANET_MANIFEST_READY", state.planetManifestReady ? "true" : "false"],
    ["PLANET_MATH_READY", state.planetMathReady ? "true" : "false"],
    ["PLANET_LATTICE_READY", state.planetLatticeReady ? "true" : "false"],
    ["PLANET_PALETTE_READY", state.planetPaletteReady ? "true" : "false"],
    ["RUNTIME_IMPORT_SUCCEEDED", state.runtimeImportSucceeded ? "true" : "false"],
    ["RUNTIME_CLASSIC_FALLBACK", state.runtimeClassicFallbackAttempted ? String(state.runtimeClassicFallbackSucceeded) : "not-needed"],
    ["MOUNT_CALLED", state.mountCalled ? "true" : "false"],
    ["PARENT_ENGINE_LOADED", state.parentEngineLoaded ? "true" : "false"],
    ["PARENT_ENGINE_DELEGATED", state.parentEngineDelegated ? "true" : "false"],
    ["PARENT_CONTRACT_VALID", state.parentContractValid ? "true" : "false"],
    ["PARENT_FORM_VISIBLE", state.parentFormVisibleAccepted ? "true" : "false"],
    ["CHILD_VISUAL_PRECEDENCE_REQUIRED", "false"],
    ["NO_WHITEOUT_GUARD_ACTIVE", "true"]
  ];
}

function updatePanel(scope = "status") {
  const targets = getTargets();
  state.htmlHandoffPanelFound = Boolean(targets.panel);
  state.existingHandoffPanelReused = Boolean(targets.panel);
  state.mountFound = Boolean(targets.mount);

  if (!targets.panel) {
    publishReceipt(`${scope}-panel-missing`);
    return;
  }

  applyPanelSafety(targets.panel);

  targets.panel.setAttribute("data-audralia-handoff-state", state.parentFormVisibleAccepted ? "visible" : state.bootFailed ? "hold" : "pending");
  targets.panel.setAttribute("data-audralia-route-bridge-contract", AUDRALIA_ROUTE_CONTRACT);
  targets.panel.setAttribute("data-audralia-route-bridge-scope", scope);
  targets.panel.setAttribute("data-audralia-no-whiteout-guard", "true");

  if (targets.title) {
    targets.title.textContent = state.visibleLabel;
  }

  if (targets.status) {
    targets.status.textContent = state.visibleSubstatus;
  }

  if (targets.list) {
    targets.list.replaceChildren(...statusRows().map(([label, value]) => makeListItem(label, value)));
  }

  if (targets.receipt) {
    targets.receipt.textContent = AUDRALIA_ROUTE_CONTRACT;
  }

  if (targets.script) {
    targets.script.textContent = `Route bridge script: ${TARGET}?v=${encodeURIComponent(getCacheNonce())}`;
  }

  if (state.finalMessage && targets.panel) {
    targets.panel.setAttribute("data-audralia-final-message", state.finalMessage);
  }

  publishReceipt(scope);
}

function failHeld(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);
  state.bootFailed = true;
  state.status = "handoff-held-html-shell-preserved";
  state.visibleLabel = "Clean-canvas handoff held";
  state.visibleSubstatus = "RUNTIME_OR_PARENT_FAILED · HTML shell preserved";
  state.finalMessage = message;

  state.errors.push({
    scope,
    message,
    time: nowIso()
  });

  const doc = root();
  if (doc) {
    doc.setAttribute("data-audralia-route-status", state.status);
    doc.setAttribute("data-audralia-html-shell-preserved", "true");
    doc.setAttribute("data-audralia-no-whiteout-guard-active", "true");
    doc.style.background = "#01040d";
  }

  updatePanel(scope);
  return getStatus();
}

function readPrimitive(kind) {
  if (!hasWindow()) return null;
  const names = PRIMITIVE_GLOBALS[kind] || [];
  for (const name of names) {
    if (window[name] && typeof window[name] === "object") return window[name];
  }
  return null;
}

function primitiveReady(kind) {
  return Boolean(readPrimitive(kind));
}

function primitiveContract(kind) {
  const api = readPrimitive(kind);
  if (!api) return "";

  if (api.contract) return String(api.contract);
  if (api.CONTRACT) return String(api.CONTRACT);

  if (typeof api.getStatus === "function") {
    try {
      const status = api.getStatus();
      return String(status && status.contract ? status.contract : "");
    } catch (_error) {}
  }

  return "";
}

function scriptAlreadyLoaded(path) {
  if (!hasDocument()) return false;
  const normalized = String(path).split("?")[0];
  return Array.from(document.scripts).some((script) => {
    const src = script.getAttribute("src") || "";
    return src.split("?")[0] === normalized;
  });
}

function loadClassicScript(path, key, readyCheck, timeoutMs) {
  if (!hasDocument()) return Promise.resolve(false);
  if (typeof readyCheck === "function" && readyCheck()) return Promise.resolve(true);

  const normalized = String(path).split("?")[0];
  if (scriptLoads.has(normalized)) return scriptLoads.get(normalized);

  const promise = new Promise((resolve) => {
    const waitForReady = () => {
      const start = Date.now();

      const step = () => {
        if (typeof readyCheck === "function" && readyCheck()) {
          resolve(true);
          return;
        }

        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }

        setTimeout(step, 40);
      };

      step();
    };

    if (scriptAlreadyLoaded(path)) {
      waitForReady();
      return;
    }

    const script = document.createElement("script");
    script.src = versioned(path);
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-route-bridge-loader", AUDRALIA_ROUTE_CONTRACT);
    script.setAttribute("data-audralia-loader-key", key);
    script.setAttribute("data-generated-image", "false");
    script.setAttribute("data-graphic-box", "false");
    script.setAttribute("data-visual-pass-claimed", "false");

    script.onload = waitForReady;
    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });

  scriptLoads.set(normalized, promise);
  return promise;
}

async function ensurePlanetFamily() {
  state.primitiveLoadStarted = true;
  state.status = "planet-family-loading";
  updatePanel("planet-family-loading");

  state.planetManifestReady = await loadClassicScript(
    PATHS.manifest,
    "planet-manifest",
    () => primitiveReady("manifest"),
    BOOT.primitiveLoadTimeoutMs
  );
  state.primitiveContracts.manifest = primitiveContract("manifest");
  updatePanel("planet-manifest-ready");

  state.planetMathReady = await loadClassicScript(
    PATHS.math,
    "planet-math",
    () => primitiveReady("math"),
    BOOT.primitiveLoadTimeoutMs
  );
  state.primitiveContracts.math = primitiveContract("math");
  updatePanel("planet-math-ready");

  state.planetLatticeReady = await loadClassicScript(
    PATHS.lattice,
    "planet-lattice",
    () => primitiveReady("lattice"),
    BOOT.primitiveLoadTimeoutMs
  );
  state.primitiveContracts.lattice = primitiveContract("lattice");
  updatePanel("planet-lattice-ready");

  state.planetPaletteReady = await loadClassicScript(
    PATHS.palette,
    "planet-palette",
    () => primitiveReady("palette"),
    BOOT.primitiveLoadTimeoutMs
  );
  state.primitiveContracts.palette = primitiveContract("palette");

  state.primitiveLoadComplete = true;
  state.status = "planet-family-checked";
  updatePanel("planet-family-checked");

  return true;
}

function resolveRuntimeApi(moduleValue = null) {
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

async function importRuntime() {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    state.runtimeImportStarted = true;
    state.status = "runtime-importing";
    updatePanel("runtime-importing");

    try {
      const moduleValue = await import(versioned(PATHS.runtime));
      const runtime = resolveRuntimeApi(moduleValue);

      state.runtimeImportSucceeded = Boolean(runtime);
      state.runtimeContract = readRuntimeContract(runtime);
      state.runtimeContractValid = !state.runtimeContract || state.runtimeContract === RUNTIME_EXPECTED_CONTRACT;

      updatePanel("runtime-imported");
      return runtime;
    } catch (moduleError) {
      state.runtimeClassicFallbackAttempted = true;

      const loaded = await loadClassicScript(
        PATHS.runtime,
        "runtime-classic-fallback",
        () => Boolean(resolveRuntimeApi()),
        BOOT.runtimeClassicLoadTimeoutMs
      );

      const runtime = loaded ? resolveRuntimeApi() : null;

      state.runtimeClassicFallbackSucceeded = Boolean(runtime);
      state.runtimeImportSucceeded = Boolean(runtime);
      state.runtimeContract = readRuntimeContract(runtime);
      state.runtimeContractValid = !state.runtimeContract || state.runtimeContract === RUNTIME_EXPECTED_CONTRACT;

      if (!runtime) {
        state.errors.push({
          scope: "runtime-import",
          message: moduleError && moduleError.message ? moduleError.message : String(moduleError),
          time: nowIso()
        });
      }

      updatePanel("runtime-classic-fallback");
      return runtime;
    }
  })();

  return runtimePromise;
}

function parentReceiptCandidates() {
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

function readParentStatusFromApi(parent) {
  if (!parent) return null;

  try {
    if (typeof parent.getStatus === "function") return parent.getStatus();
    if (typeof parent.status === "function") return parent.status();
  } catch (_error) {}

  return null;
}

function parentContractIsValid(receipt) {
  if (!receipt || typeof receipt !== "object") return false;

  const contract = String(receipt.contract || "");
  const internal = String(receipt.internalContract || receipt.INTERNAL_CONTRACT || "");
  const family = String(receipt.family || "");
  const renderModel = String(receipt.renderModel || "");

  return (
    contract === PARENT_COMPATIBILITY_CONTRACT ||
    family === PARENT_COMPATIBILITY_CONTRACT ||
    (internal.includes("PARENT") && internal.includes("ATLAS")) ||
    (contract.includes("PARENT") && contract.includes("ATLAS")) ||
    renderModel.includes("atlas") ||
    renderModel.includes("sphere")
  );
}

function parentVisibleFromReceipt(receipt) {
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

function parentVisibleFromGlobals() {
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

function syncParentAcceptance() {
  const parent = readParentApi();
  const apiStatus = readParentStatusFromApi(parent);
  const receipts = [apiStatus, ...parentReceiptCandidates()].filter(Boolean);
  const validReceipt = receipts.find(parentContractIsValid) || receipts[0] || null;

  state.parentEngineLoaded = Boolean(parent || receipts.length);
  state.parentContractValid = Boolean(validReceipt && parentContractIsValid(validReceipt));
  state.parentFormVisibleAccepted = Boolean(parentVisibleFromGlobals() || receipts.some(parentVisibleFromReceipt));
  state.parentExpressionAccepted = Boolean(
    state.parentEngineLoaded && (state.parentContractValid || state.parentFormVisibleAccepted)
  );

  return validReceipt;
}

function syncGratitudeSupport() {
  if (!hasWindow()) return;

  const topology = window.AUDRALIA_TOPOLOGY_GRATITUDE;
  const source = window.AUDRALIA_GRATITUDE_SOURCE_FIELD;
  const traversal = window.AUDRALIA_GRATITUDE_TRAVERSAL_RECEIPT;

  state.gratitudeSourceFieldReady = Boolean(
    source ||
      (topology && typeof topology.getSourceField === "function") ||
      (topology && topology.CONTRACT && String(topology.CONTRACT).includes("GRATITUDE"))
  );

  state.gratitudeReceiptReturnReady = Boolean(
    (traversal && traversal.receiptReturnReady !== false) ||
      (topology && typeof topology.getTraversalReceipt === "function")
  );
}

function closeIfVisible(scope = "close-check") {
  syncParentAcceptance();
  syncGratitudeSupport();

  if (state.parentFormVisibleAccepted && state.parentExpressionAccepted) {
    state.status = "form-visible-parent-confirmed";
    state.bootComplete = true;
    state.handoffClosedFromParentReceipt = true;
    state.visibleLabel = "Clean-canvas handoff visible";
    state.visibleSubstatus = state.gratitudeReceiptReturnReady
      ? "FORM_VISIBLE · parent-confirmed · source-return ready"
      : "FORM_VISIBLE · parent-confirmed · source pending";
    state.finalMessage = "Parent expression accepted. HTML shell preserved.";

    const doc = root();
    if (doc) {
      doc.setAttribute("data-audralia-route-status", state.status);
      doc.setAttribute("data-audralia-route-bridge-closed", "true");
      doc.setAttribute("data-audralia-form-visible", "true");
      doc.setAttribute("data-audralia-parent-form-visible", "true");
      doc.setAttribute("data-audralia-child-visual-precedence-required", "false");
      doc.setAttribute("data-audralia-no-whiteout-guard-active", "true");
    }

    updatePanel(scope);
    return true;
  }

  updatePanel(scope);
  return false;
}

async function waitForParentVisible() {
  for (let i = 0; i < BOOT.parentVisibleAttempts; i += 1) {
    if (closeIfVisible(`parent-visible-check-${i + 1}`)) return true;
    await sleep(BOOT.parentVisibleDelayMs + i * 10);
  }

  closeIfVisible("parent-visible-bounded-timeout");
  return state.parentFormVisibleAccepted;
}

async function callRuntimeMount(runtime, mount) {
  if (!runtime) throw new Error("Runtime API unavailable.");

  const options = {
    route: ROUTE,
    target: TARGET,
    cacheNonce: getCacheNonce(),
    delegatedBy: AUDRALIA_ROUTE_CONTRACT,
    previousDelegation: PREVIOUS_ROUTE_CONTRACT,
    htmlContractConsumer: true,
    mustReuseExistingHandoffPanel: true,
    mayCreateStatusPanel: false,
    mayHideLegacyPanel: false,
    mayScanBroadDom: false,
    canvasShellStatusInsertionForbidden: true,
    noWhiteoutGuard: true,
    childVisualPrecedenceRequired: false,
    sourceFieldSupportOptional: true
  };

  state.mountCalled = true;
  updatePanel("runtime-mount-called");

  let result;

  if (typeof runtime === "function") {
    result = runtime(mount, options);
  } else if (runtime && typeof runtime.mount === "function") {
    result = runtime.mount(mount, options);
  } else if (runtime && typeof runtime.boot === "function") {
    result = runtime.boot(mount, options);
  } else if (runtime && typeof runtime.start === "function") {
    result = runtime.start(mount, options);
  } else if (runtime && typeof runtime.init === "function") {
    result = runtime.init(mount, options);
  } else if (runtime && typeof runtime.create === "function") {
    result = runtime.create(mount, options);
  } else {
    throw new Error("Runtime imported, but no mount-compatible method exists.");
  }

  await Promise.resolve(result);

  state.mountAwaited = true;
  state.parentHandoffAwaited = true;
  state.parentEngineDelegated = true;

  syncParentAcceptance();
  updatePanel("runtime-mount-awaited");

  return true;
}

async function bootAudraliaDoorway() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    try {
      state.bootStarted = true;
      state.routeValid = routeIsValid();
      getCacheNonce();

      const targets = getTargets();
      state.htmlHandoffPanelFound = Boolean(targets.panel);
      state.existingHandoffPanelReused = Boolean(targets.panel);
      state.mountFound = Boolean(targets.mount);

      if (targets.panel) applyPanelSafety(targets.panel);

      if (!state.routeValid) {
        return failHeld("route-invalid", "Route mismatch. HTML shell preserved.");
      }

      if (!targets.panel) {
        return failHeld("handoff-panel-missing", "Existing HTML handoff panel is missing. JS will not create a replacement.");
      }

      if (!targets.mount) {
        return failHeld("mount-missing", "Audralia canvas mount target is missing. HTML shell preserved.");
      }

      state.status = "route-validated";
      state.visibleLabel = "Clean-canvas handoff pending";
      state.visibleSubstatus = "HTML_CONTRACT_CONSUMER · route validated";
      updatePanel("route-validated");

      await ensurePlanetFamily();

      if (closeIfVisible("pre-runtime-parent-check")) {
        return getStatus();
      }

      const runtime = await importRuntime();

      if (!runtime) {
        return failHeld("runtime-unavailable", "Runtime import failed. HTML shell preserved.");
      }

      await callRuntimeMount(runtime, targets.mount);
      await waitForParentVisible();

      if (!state.parentFormVisibleAccepted) {
        return failHeld("parent-visible-not-confirmed", "Parent did not confirm visible form inside bounded wait. HTML shell preserved.");
      }

      state.bootComplete = true;
      publishReceipt("boot-complete");
      return getStatus();
    } catch (error) {
      return failHeld("bootAudraliaDoorway", error);
    }
  })();

  return bootPromise;
}

function publishReceipt(scope = "publish", partial = {}) {
  if (!hasWindow()) return null;

  syncParentAcceptance();
  syncGratitudeSupport();

  const receipt = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    previousContract: PREVIOUS_ROUTE_CONTRACT,
    failedContractRetired: FAILED_ROUTE_CONTRACT_RETIRED,
    target: TARGET,
    route: ROUTE,
    scope,
    status: state.status,
    updatedAt: nowIso(),

    htmlContractConsumer: true,
    htmlHandoffPanelFound: state.htmlHandoffPanelFound,
    existingHandoffPanelReused: state.existingHandoffPanelReused,
    routeBridgeMayCreateStatusPanel: false,
    routeBridgeMayHideLegacyPanel: false,
    routeBridgeMayScanBroadDom: false,
    canvasShellStatusInsertionForbidden: true,

    routeBridgeIdempotent: true,
    planetFamilyAligned: true,
    figureEightReturnVerifier: true,
    noWhiteoutGuardActive: true,
    htmlShellPreservedOnFailure: true,

    singleCacheNonceChain: true,
    cacheNonce: getCacheNonce(),

    routeValid: state.routeValid,
    mountFound: state.mountFound,

    planetManifestReady: state.planetManifestReady,
    planetMathReady: state.planetMathReady,
    planetLatticeReady: state.planetLatticeReady,
    planetPaletteReady: state.planetPaletteReady,
    primitiveContracts: { ...state.primitiveContracts },

    runtimeImportStarted: state.runtimeImportStarted,
    runtimeImportSucceeded: state.runtimeImportSucceeded,
    runtimeClassicFallbackAttempted: state.runtimeClassicFallbackAttempted,
    runtimeClassicFallbackSucceeded: state.runtimeClassicFallbackSucceeded,
    runtimeContract: state.runtimeContract,
    runtimeContractValid: state.runtimeContractValid,

    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentHandoffAwaited: state.parentHandoffAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentExpressionAccepted: state.parentExpressionAccepted,
    parentFormVisibleAccepted: state.parentFormVisibleAccepted,
    handoffClosedFromParentReceipt: state.handoffClosedFromParentReceipt,

    childVisualPrecedenceRequired: false,
    sourceFieldSupportOptional: true,
    gratitudeSourceFieldReady: state.gratitudeSourceFieldReady,
    gratitudeReceiptReturnReady: state.gratitudeReceiptReturnReady,

    pendingLoopPrevented: true,
    setIntervalUsed: false,
    requestAnimationFrameLoopUsed: false,
    destructiveDomScanUsed: false,
    newStatusPanelCreated: false,
    legacyPanelHidden: false,

    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,

    errors: state.errors.slice(),
    ...partial
  };

  window.AUDRALIA_ROUTE_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
  window.AUDRALIA_FIGURE_EIGHT_RETURN_VERIFIER_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_HTML_CONTRACT_CONSUMER_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_NO_WHITEOUT_RECEIPT = receipt;
  window.AUDRALIA_CHILD_VISUAL_PRECEDENCE_REQUIRED = false;

  const doc = root();
  if (doc) {
    doc.setAttribute("data-audralia-route-contract", AUDRALIA_ROUTE_CONTRACT);
    doc.setAttribute("data-audralia-route-previous-contract", PREVIOUS_ROUTE_CONTRACT);
    doc.setAttribute("data-audralia-route-status", state.status);
    doc.setAttribute("data-audralia-html-contract-consumer", "true");
    doc.setAttribute("data-audralia-existing-handoff-panel-reused", String(state.existingHandoffPanelReused));
    doc.setAttribute("data-audralia-no-whiteout-guard-active", "true");
    doc.setAttribute("data-audralia-planet-family-aligned", "true");
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
  publishReceipt("status-read");
  return window.AUDRALIA_ROUTE_BRIDGE_RECEIPT;
}

function start() {
  return bootAudraliaDoorway();
}

function boot() {
  return bootAudraliaDoorway();
}

function init() {
  return bootAudraliaDoorway();
}

function create() {
  return bootAudraliaDoorway();
}

const api = Object.freeze({
  contract: AUDRALIA_ROUTE_CONTRACT,
  CONTRACT: AUDRALIA_ROUTE_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  failedContractRetired: FAILED_ROUTE_CONTRACT_RETIRED,
  route: ROUTE,
  target: TARGET,
  bootAudraliaDoorway,
  boot,
  start,
  init,
  create,
  getStatus,
  status: getStatus
});

if (hasWindow()) {
  window.AUDRALIA_ROUTE_BRIDGE = api;
  window.AUDRALIA_ROUTE_BRIDGE_API = api;
  window.AUDRALIA_ROUTE_BRIDGE_HTML_CONTRACT_CONSUMER = api;
  window.AUDRALIA_ROUTE_BRIDGE_NO_WHITEOUT = api;
  publishReceipt("module-load");
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bootAudraliaDoorway().catch((error) => failHeld("domcontentloaded-boot", error));
    }, { once: true });
  } else {
    queueMicrotask(() => {
      bootAudraliaDoorway().catch((error) => failHeld("immediate-boot", error));
    });
  }
}

export {
  AUDRALIA_ROUTE_CONTRACT,
  PREVIOUS_ROUTE_CONTRACT,
  FAILED_ROUTE_CONTRACT_RETIRED,
  bootAudraliaDoorway,
  boot,
  start,
  init,
  create,
  getStatus
};

export default bootAudraliaDoorway;
