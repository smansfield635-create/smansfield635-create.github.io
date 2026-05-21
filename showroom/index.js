// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_12B_JS_CLEAN_GLOBE_STAGE_ADAPTER_TNT_v1
// Scope: /showroom/globe/audralia/ stage adapter only.
// Purpose:
// - Adapt the clean Audralia public route to the parent globe engine.
// - Mount the parent into the known globe mount target once.
// - Keep public expression HTML-owned.
// - Keep globe rendering parent-owned.
// - Publish hidden status through dataset markers and one window status object.
// - No visible diagnostics. No handoff panel. No source primitive loading. No child precedence.
// - No generated image. No GraphicBox. No visual-pass claim.

const AUDRALIA_GLOBE_STAGE_STATE = Object.freeze({
  contract: "AUDRALIA_G2_12B_JS_CLEAN_GLOBE_STAGE_ADAPTER_TNT_v1",
  pairContract: "AUDRALIA_G2_12_CLEAN_MIRRORLAND_GLOBE_STAGE_RENEWAL_STANDARD_v1",
  pairedHtmlContract: "AUDRALIA_G2_12A_HTML_CLEAN_MIRRORLAND_GLOBE_GATEWAY_TNT_v1",
  route: "/showroom/globe/audralia/",
  target: "/showroom/globe/audralia/index.js",
  role: "audralia-clean-globe-stage-adapter",
  worldPath: "audralia",
  mirrorlandGateway: true,
  worldRole: "possibility-preparation-field",
  publicReceiptsVisible: false,
  visibleHandoffPanel: false,
  diagnosticPanel: false,
  sourcePrimitiveLoading: false,
  childPrecedence: false,
  generatedImage: false,
  graphicBox: false,
  visualPassClaim: false
});

const PARENT_PATH = "/assets/audralia/clean/engine/audralia.engine.js";
const PARENT_EXPECTED_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

const SELECTORS = Object.freeze({
  stage: "[data-audralia-globe-stage]",
  mount: "[data-audralia-globe-mount]",
  routeLabel: "[data-audralia-route-label]",
  instruction: "[data-audralia-instruction]",
  receipt: "#audralia-route-receipt"
});

const LIMITS = Object.freeze({
  parentWaitAttempts: 10,
  parentWaitMs: 80
});

const state = {
  contract: AUDRALIA_GLOBE_STAGE_STATE.contract,
  route: AUDRALIA_GLOBE_STAGE_STATE.route,
  status: "module-loaded",
  bootStarted: false,
  bootComplete: false,
  bootHeld: false,

  cacheKey: "",
  routeValid: false,
  targetsFound: false,
  stageFound: false,
  mountFound: false,
  receiptFound: false,

  parentAlreadyPresent: false,
  parentLoadStarted: false,
  parentLoadSucceeded: false,
  parentModuleImportAttempted: false,
  parentModuleImportSucceeded: false,
  parentClassicLoadAttempted: false,
  parentClassicLoadSucceeded: false,
  parentResolved: false,
  parentMountCalled: false,
  parentMountSucceeded: false,
  parentFormVisible: false,
  parentContract: "",
  parentContractValid: false,

  htmlExpressionPreserved: true,
  stageAdapterOnly: true,
  publicDiagnosticsCreated: false,
  sourcePrimitiveLoadingUsed: false,
  childPrecedenceUsed: false,

  errors: []
};

let bootPromise = null;
let parentLoadPromise = null;

function hasWindow() {
  return typeof window !== "undefined";
}

function hasDocument() {
  return typeof document !== "undefined";
}

function root() {
  return hasDocument() ? document.documentElement : null;
}

function body() {
  return hasDocument() ? document.body : null;
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

function q(selector) {
  return hasDocument() ? document.querySelector(selector) : null;
}

function getTargets() {
  return {
    stage: q(SELECTORS.stage),
    mount: q(SELECTORS.mount),
    routeLabel: q(SELECTORS.routeLabel),
    instruction: q(SELECTORS.instruction),
    receipt: q(SELECTORS.receipt)
  };
}

function getImportCacheKey() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getCacheKey() {
  if (state.cacheKey) return state.cacheKey;

  const doc = root();

  state.cacheKey =
    (hasWindow() && window.DGB_AUDRALIA_JS_CACHE_KEY ? String(window.DGB_AUDRALIA_JS_CACHE_KEY) : "") ||
    (doc ? doc.getAttribute("data-audralia-js-cache-key") || "" : "") ||
    getImportCacheKey() ||
    AUDRALIA_GLOBE_STAGE_STATE.contract;

  return state.cacheKey;
}

function versioned(path) {
  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(getCacheKey())}`;
}

function routeIsValid() {
  if (!hasWindow()) return true;

  const pathname = window.location && window.location.pathname
    ? window.location.pathname
    : AUDRALIA_GLOBE_STAGE_STATE.route;

  return (
    pathname === AUDRALIA_GLOBE_STAGE_STATE.route ||
    pathname === `${AUDRALIA_GLOBE_STAGE_STATE.route}index.html`
  );
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);

  state.errors.push({
    scope,
    message,
    time: nowIso()
  });

  return message;
}

function setDataset(key, value) {
  const doc = root();
  const pageBody = body();

  if (doc) doc.dataset[key] = String(value);
  if (pageBody) pageBody.dataset[key] = String(value);
}

function markRoute(status = state.status) {
  const markers = {
    audraliaStatus: status,
    audraliaContract: AUDRALIA_GLOBE_STAGE_STATE.contract,
    audraliaPairContract: AUDRALIA_GLOBE_STAGE_STATE.pairContract,
    audraliaPairedHtmlContract: AUDRALIA_GLOBE_STAGE_STATE.pairedHtmlContract,
    audraliaRoute: AUDRALIA_GLOBE_STAGE_STATE.route,
    audraliaWorldPath: AUDRALIA_GLOBE_STAGE_STATE.worldPath,
    audraliaWorldRole: AUDRALIA_GLOBE_STAGE_STATE.worldRole,
    audraliaMirrorlandGateway: "true",
    audraliaStageAdapterOnly: "true",
    audraliaPublicReceiptsVisible: "false",
    audraliaVisibleHandoffPanel: "false",
    audraliaDiagnosticPanel: "false",
    audraliaSourcePrimitiveLoading: "false",
    audraliaChildPrecedence: "false",
    audraliaGeneratedImage: "false",
    audraliaGraphicBox: "false",
    audraliaVisualPassClaimed: "false"
  };

  Object.entries(markers).forEach(([key, value]) => setDataset(key, value));
}

function protectIdentity() {
  if (!hasDocument()) return;

  const title = document.querySelector("title");
  if (title && /Earth|H-Earth|ZIONTS/i.test(title.textContent || "")) {
    title.textContent = "Audralia · Shadows Never Shatter in Mirrorland";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body|Clean-canvas handoff|H-Earth/i.test(h1.textContent || "")) {
    h1.textContent = "Shadows Never Shatter in Mirrorland.";
  }
}

function updateStageLabel(text) {
  const label = q(SELECTORS.routeLabel);
  if (label) label.textContent = text;
}

function updateInstruction(text) {
  const instruction = q(SELECTORS.instruction);
  if (instruction) instruction.textContent = text;
}

function resolveParentEngine() {
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

function readParentStatus(parent) {
  if (!parent) return null;

  try {
    if (typeof parent.getStatus === "function") return parent.getStatus();
    if (typeof parent.status === "function") return parent.status();
  } catch (_error) {}

  return null;
}

function readParentContract(parent, status) {
  return String(
    (status && (status.contract || status.family || status.internalContract)) ||
    (parent && (parent.contract || parent.CONTRACT || parent.internalContract || parent.INTERNAL_CONTRACT)) ||
    ""
  );
}

function parentContractAccepted(contract, status) {
  const value = String(contract || "");
  const renderModel = status && status.renderModel ? String(status.renderModel) : "";

  return (
    value === PARENT_EXPECTED_CONTRACT ||
    value.includes("AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER") ||
    value.includes("AUDRALIA_G2_6_PARENT") ||
    renderModel.includes("sphere") ||
    renderModel.includes("atlas")
  );
}

function parentVisibleAccepted(status) {
  if (hasWindow()) {
    if (
      window.AUDRALIA_ENGINE_FORM_VISIBLE === true ||
      window.AUDRALIA_PARENT_FORM_VISIBLE === true ||
      window.AUDRALIA_FORM_VISIBLE === true ||
      window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true
    ) {
      return true;
    }
  }

  const doc = root();

  if (
    doc &&
    doc.dataset &&
    (
      doc.dataset.audraliaParentFormVisible === "true" ||
      doc.dataset.audraliaFormVisible === "true" ||
      doc.dataset.audraliaEngineFormVisible === "true"
    )
  ) {
    return true;
  }

  return Boolean(
    status &&
    (
      status.formVisible === true ||
      status.parentFormVisible === true ||
      status.mounted === true ||
      status.textureAtlasBuilt === true ||
      status.planetMaterialIntegrated === true
    )
  );
}

function syncParentState(parent = resolveParentEngine()) {
  const status = readParentStatus(parent);
  const contract = readParentContract(parent, status);

  state.parentResolved = Boolean(parent);
  state.parentContract = contract;
  state.parentContractValid = Boolean(parent && parentContractAccepted(contract, status));
  state.parentFormVisible = parentVisibleAccepted(status);

  return {
    parent,
    status,
    contract
  };
}

async function waitForParentEngine() {
  for (let index = 0; index < LIMITS.parentWaitAttempts; index += 1) {
    const parent = resolveParentEngine();

    if (parent) {
      syncParentState(parent);
      return parent;
    }

    await sleep(LIMITS.parentWaitMs);
  }

  return null;
}

function scriptAlreadyLoaded(path) {
  if (!hasDocument()) return false;

  const normalized = path.split("?")[0];

  return Array.from(document.scripts).some((script) => {
    const src = script.getAttribute("src") || "";
    return src.split("?")[0] === normalized;
  });
}

async function loadParentClassic() {
  if (!hasDocument()) return null;

  state.parentClassicLoadAttempted = true;

  if (scriptAlreadyLoaded(PARENT_PATH)) {
    const parent = await waitForParentEngine();
    state.parentClassicLoadSucceeded = Boolean(parent);
    return parent;
  }

  await new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = versioned(PARENT_PATH);
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-stage-adapter-loader", AUDRALIA_GLOBE_STAGE_STATE.contract);
    script.setAttribute("data-generated-image", "false");
    script.setAttribute("data-graphic-box", "false");
    script.setAttribute("data-visual-pass-claimed", "false");
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  const parent = await waitForParentEngine();
  state.parentClassicLoadSucceeded = Boolean(parent);

  return parent;
}

async function loadParentEngine() {
  if (parentLoadPromise) return parentLoadPromise;

  parentLoadPromise = (async () => {
    const existing = resolveParentEngine();

    if (existing) {
      state.parentAlreadyPresent = true;
      state.parentLoadSucceeded = true;
      syncParentState(existing);
      return existing;
    }

    state.parentLoadStarted = true;
    state.status = "parent-loading";
    markRoute(state.status);

    state.parentModuleImportAttempted = true;

    try {
      await import(versioned(PARENT_PATH));
      state.parentModuleImportSucceeded = true;

      const parent = await waitForParentEngine();

      if (parent) {
        state.parentLoadSucceeded = true;
        syncParentState(parent);
        return parent;
      }
    } catch (error) {
      recordError("parent-module-import", error);
    }

    const parent = await loadParentClassic();

    state.parentLoadSucceeded = Boolean(parent);
    if (parent) syncParentState(parent);

    return parent;
  })();

  return parentLoadPromise;
}

async function mountParent(parent, mount) {
  if (!parent || !mount) return false;

  const options = {
    route: AUDRALIA_GLOBE_STAGE_STATE.route,
    target: AUDRALIA_GLOBE_STAGE_STATE.target,
    contract: AUDRALIA_GLOBE_STAGE_STATE.contract,
    pairContract: AUDRALIA_GLOBE_STAGE_STATE.pairContract,
    cacheKey: getCacheKey(),
    parentPath: PARENT_PATH,
    stageAdapterOnly: true,
    mirrorlandGateway: true,
    publicReceiptsVisible: false,
    visibleHandoffPanel: false,
    diagnosticPanel: false,
    sourcePrimitiveLoading: false,
    childPrecedence: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false
  };

  state.parentMountCalled = true;
  markRoute("parent-mount-called");

  try {
    let result = null;

    if (typeof parent.mount === "function") result = parent.mount(mount, options);
    else if (typeof parent.start === "function") result = parent.start(mount, options);
    else if (typeof parent.boot === "function") result = parent.boot(mount, options);
    else if (typeof parent.init === "function") result = parent.init(mount, options);
    else if (typeof parent.create === "function") result = parent.create(mount, options);
    else if (typeof parent.render === "function") result = parent.render(mount, options);
    else throw new Error("Parent engine exposed no mount-compatible method.");

    await Promise.resolve(result);

    state.parentMountSucceeded = true;
    syncParentState(parent);

    return true;
  } catch (error) {
    recordError("parent-mount", error);
    state.parentMountSucceeded = false;
    return false;
  }
}

async function confirmParentVisible() {
  for (let index = 0; index < LIMITS.parentWaitAttempts; index += 1) {
    const parent = resolveParentEngine();
    syncParentState(parent);

    if (state.parentFormVisible) return true;

    await sleep(LIMITS.parentWaitMs);
  }

  return state.parentFormVisible;
}

function publishStatus(scope = "publish") {
  syncParentState();

  const status = Object.freeze({
    ...AUDRALIA_GLOBE_STAGE_STATE,
    scope,
    status: state.status,
    cacheKey: getCacheKey(),

    routeValid: state.routeValid,
    targetsFound: state.targetsFound,
    stageFound: state.stageFound,
    mountFound: state.mountFound,
    receiptFound: state.receiptFound,

    bootStarted: state.bootStarted,
    bootComplete: state.bootComplete,
    bootHeld: state.bootHeld,

    parentAlreadyPresent: state.parentAlreadyPresent,
    parentLoadStarted: state.parentLoadStarted,
    parentLoadSucceeded: state.parentLoadSucceeded,
    parentModuleImportAttempted: state.parentModuleImportAttempted,
    parentModuleImportSucceeded: state.parentModuleImportSucceeded,
    parentClassicLoadAttempted: state.parentClassicLoadAttempted,
    parentClassicLoadSucceeded: state.parentClassicLoadSucceeded,
    parentResolved: state.parentResolved,
    parentContract: state.parentContract,
    parentContractValid: state.parentContractValid,
    parentMountCalled: state.parentMountCalled,
    parentMountSucceeded: state.parentMountSucceeded,
    parentFormVisible: state.parentFormVisible,

    htmlExpressionPreserved: true,
    stageAdapterOnly: true,
    publicDiagnosticsCreated: false,
    visibleHandoffPanel: false,
    diagnosticPanel: false,
    sourcePrimitiveLoadingUsed: false,
    childPrecedenceUsed: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,

    errors: state.errors.slice()
  });

  if (hasWindow()) {
    window.DGBAudraliaGlobeStageReceipt = status;
  }

  markRoute(state.status);
  setDataset("audraliaParentResolved", state.parentResolved ? "true" : "false");
  setDataset("audraliaParentMounted", state.parentMountSucceeded ? "true" : "false");
  setDataset("audraliaParentFormVisible", state.parentFormVisible ? "true" : "false");
  setDataset("audraliaLastScope", scope);

  return status;
}

function hold(scope, error) {
  if (error) recordError(scope, error);

  state.status = "globe-stage-held";
  state.bootHeld = true;
  state.bootComplete = true;

  updateStageLabel("Audralia → static Mirrorland gateway preserved");
  updateInstruction("The live globe stage is held. The public route remains readable, navigable, and ready for the parent globe engine.");

  return publishStatus(scope);
}

async function initAudraliaGlobeStage() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    state.bootStarted = true;
    state.status = "stage-adapter-booted";
    state.routeValid = routeIsValid();

    getCacheKey();
    markRoute(state.status);
    protectIdentity();

    const targets = getTargets();

    state.stageFound = Boolean(targets.stage);
    state.mountFound = Boolean(targets.mount);
    state.receiptFound = Boolean(targets.receipt);
    state.targetsFound = Boolean(targets.stage && targets.mount);

    publishStatus("targets-checked");

    if (!state.routeValid) return hold("route-invalid", "Route mismatch.");
    if (!state.targetsFound) return hold("targets-missing", "Audralia globe stage or mount target missing.");

    updateStageLabel("Audralia → live globe stage preparing");
    updateInstruction("The Audralia stage is preparing the parent globe engine. The page remains stable while the live object mounts.");

    const parent = await loadParentEngine();

    if (!parent) return hold("parent-unavailable", "Parent globe engine unavailable.");

    const mounted = await mountParent(parent, targets.mount);

    if (!mounted) return hold("parent-mount-failed", "Parent globe engine failed to mount.");

    await confirmParentVisible();

    state.status = state.parentFormVisible ? "globe-stage-mounted" : "globe-stage-mounted-unconfirmed";
    state.bootComplete = true;

    updateStageLabel("Audralia → possibility and preparation field inside Mirrorland");
    updateInstruction("Drag inside the stage to inspect the Audralia globe. The public route remains HTML-owned; the parent engine owns the globe.");

    return publishStatus("boot-complete");
  })();

  return bootPromise;
}

function getStatus() {
  return publishStatus("status-read");
}

const api = Object.freeze({
  ...AUDRALIA_GLOBE_STAGE_STATE,
  initAudraliaGlobeStage,
  init: initAudraliaGlobeStage,
  boot: initAudraliaGlobeStage,
  start: initAudraliaGlobeStage,
  status: getStatus,
  getStatus
});

if (hasWindow()) {
  window.DGBAudraliaGlobeStage = api;
  window.AUDRALIA_GLOBE_STAGE_ADAPTER = api;
  publishStatus("module-load");
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initAudraliaGlobeStage().catch((error) => hold("domcontentloaded-init", error));
    }, { once: true });
  } else {
    initAudraliaGlobeStage().catch((error) => hold("immediate-init", error));
  }
}

export {
  AUDRALIA_GLOBE_STAGE_STATE,
  initAudraliaGlobeStage,
  getStatus
};

export default AUDRALIA_GLOBE_STAGE_STATE;
