  // /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_13B_PUBLIC_GLOBE_OBJECT_CONTROLLER_TNT_v1
// Scope: /showroom/globe/audralia/ object-stage controller only.
// Standard: Compass/Showroom public route model.
// Purpose:
// - Keep the Audralia page as a finished public route.
// - Mount the globe parent inside the dedicated object stage.
// - Publish hidden status markers for Gauges.
// - Do not create visible panels, diagnostics, loader text, or route-state UI.
// - Do not rewrite the page.
// - Do not intercept copy/paste.
// - No generated image. No GraphicBox. No visual-pass claim.

const AUDRALIA_PUBLIC_GLOBE_CONTROLLER = Object.freeze({
  contract: "AUDRALIA_G2_13B_PUBLIC_GLOBE_OBJECT_CONTROLLER_TNT_v1",
  pairedHtmlContract: "AUDRALIA_G2_13A_PUBLIC_MIRRORLAND_GLOBE_PAGE_TNT_v1",
  pairContract: "AUDRALIA_G2_13_PUBLIC_PAGE_STANDARD_RELEASE_FROM_HANDOFF_LEGACY_v1",
  route: "/showroom/globe/audralia/",
  target: "/showroom/globe/audralia/index.js",
  standard: "compass-showroom-public-route",
  role: "audralia-public-globe-object-controller",
  publicSurfaceFirst: true,
  interactiveObjectStageSecond: true,
  hiddenReceiptOnly: true,
  visibleDiagnostics: false,
  statusPanel: false,
  routeBridgeBootstrap: false,
  dynamicRouteBootstrap: false,
  sourcePrimitiveLoading: false,
  childPrecedence: false,
  copyPasteInterference: false,
  generatedImage: false,
  graphicBox: false,
  visualPassClaim: false
});

const PARENT_ENGINE_PATH = "/assets/audralia/clean/engine/audralia.engine.js";

const SELECTOR = Object.freeze({
  stage: "[data-audralia-object-stage='true']",
  mount: "[data-audralia-object-mount='true']",
  receipt: "#audralia-route-receipt"
});

const state = {
  contract: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.contract,
  route: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.route,
  status: "module-loaded",
  cacheKey: "",
  routeValid: false,
  stageFound: false,
  mountFound: false,
  receiptFound: false,
  parentPresentAtBoot: false,
  parentLoadAttempted: false,
  parentLoadSucceeded: false,
  parentResolved: false,
  parentMounted: false,
  parentVisible: false,
  objectEnhanced: false,
  held: false,
  errors: []
};

let initPromise = null;
let loadPromise = null;

function hasWindow() {
  return typeof window !== "undefined";
}

function hasDocument() {
  return typeof document !== "undefined";
}

function doc() {
  return hasDocument() ? document.documentElement : null;
}

function pageBody() {
  return hasDocument() ? document.body : null;
}

function nowIso() {
  try {
    return new Date().toISOString();
  } catch (_error) {
    return "";
  }
}

function qs(selector) {
  return hasDocument() ? document.querySelector(selector) : null;
}

function getTargets() {
  return {
    stage: qs(SELECTOR.stage),
    mount: qs(SELECTOR.mount),
    receipt: qs(SELECTOR.receipt)
  };
}

function getImportKey() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getCacheKey() {
  if (state.cacheKey) return state.cacheKey;

  state.cacheKey =
    (hasWindow() && window.DGB_AUDRALIA_JS_CACHE_KEY ? String(window.DGB_AUDRALIA_JS_CACHE_KEY) : "") ||
    getImportKey() ||
    AUDRALIA_PUBLIC_GLOBE_CONTROLLER.contract;

  return state.cacheKey;
}

function versioned(path) {
  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(getCacheKey())}`;
}

function currentRouteValid() {
  if (!hasWindow() || !window.location) return true;

  const path = window.location.pathname || AUDRALIA_PUBLIC_GLOBE_CONTROLLER.route;

  return (
    path === AUDRALIA_PUBLIC_GLOBE_CONTROLLER.route ||
    path === `${AUDRALIA_PUBLIC_GLOBE_CONTROLLER.route}index.html`
  );
}

function mark(key, value) {
  const root = doc();
  const body = pageBody();

  if (root) root.dataset[key] = String(value);
  if (body) body.dataset[key] = String(value);
}

function markRoute(status = state.status) {
  mark("audraliaContract", AUDRALIA_PUBLIC_GLOBE_CONTROLLER.contract);
  mark("audraliaHtmlContract", AUDRALIA_PUBLIC_GLOBE_CONTROLLER.pairedHtmlContract);
  mark("audraliaPairContract", AUDRALIA_PUBLIC_GLOBE_CONTROLLER.pairContract);
  mark("audraliaRouteStatus", status);
  mark("audraliaPublicPageStandard", "compass-showroom");
  mark("audraliaPublicSurfaceFirst", "true");
  mark("audraliaInteractiveObjectStageSecond", "true");
  mark("audraliaHiddenReceiptOnly", "true");
  mark("audraliaVisibleDiagnostics", "false");
  mark("audraliaStatusPanel", "false");
  mark("audraliaRouteBridgeBootstrap", "false");
  mark("audraliaDynamicRouteBootstrap", "false");
  mark("audraliaSourcePrimitiveLoading", "false");
  mark("audraliaChildPrecedence", "false");
  mark("audraliaCopyPasteInterference", "false");
  mark("generatedImage", "false");
  mark("graphicBox", "false");
  mark("visualPassClaimed", "false");
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

function resolveParent() {
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

function parentLooksVisible(status) {
  if (hasWindow()) {
    if (
      window.AUDRALIA_ENGINE_FORM_VISIBLE === true ||
      window.AUDRALIA_PARENT_FORM_VISIBLE === true ||
      window.AUDRALIA_TEXTURE_ATLAS_BUILT === true
    ) {
      return true;
    }
  }

  if (!status) return false;

  return Boolean(
    status.formVisible === true ||
    status.parentFormVisible === true ||
    status.textureAtlasBuilt === true ||
    status.planetMaterialIntegrated === true ||
    status.mounted === true
  );
}

function syncParent(parent = resolveParent()) {
  const status = readParentStatus(parent);

  state.parentResolved = Boolean(parent);
  state.parentVisible = parentLooksVisible(status);

  return { parent, status };
}

function scriptAlreadyLoaded(path) {
  if (!hasDocument()) return false;

  const wanted = path.split("?")[0];

  return Array.from(document.scripts).some((script) => {
    const src = script.getAttribute("src") || "";
    return src.split("?")[0] === wanted;
  });
}

function loadParentEngine() {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const existing = resolveParent();

    if (existing) {
      state.parentPresentAtBoot = true;
      state.parentLoadSucceeded = true;
      syncParent(existing);
      resolve(existing);
      return;
    }

    if (!hasDocument()) {
      resolve(null);
      return;
    }

    state.parentLoadAttempted = true;
    state.status = "object-engine-loading";
    publish("parent-load-start");

    if (scriptAlreadyLoaded(PARENT_ENGINE_PATH)) {
      setTimeout(() => {
        const parent = resolveParent();
        state.parentLoadSucceeded = Boolean(parent);
        syncParent(parent);
        resolve(parent);
      }, 80);
      return;
    }

    const script = document.createElement("script");
    script.src = versioned(PARENT_ENGINE_PATH);
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-object-controller", AUDRALIA_PUBLIC_GLOBE_CONTROLLER.contract);
    script.setAttribute("data-public-page-standard", "compass-showroom");
    script.setAttribute("data-generated-image", "false");
    script.setAttribute("data-graphic-box", "false");
    script.setAttribute("data-visual-pass-claimed", "false");

    script.onload = () => {
      setTimeout(() => {
        const parent = resolveParent();
        state.parentLoadSucceeded = Boolean(parent);
        syncParent(parent);
        resolve(parent);
      }, 80);
    };

    script.onerror = () => {
      recordError("parent-engine-load", "Parent engine script failed to load.");
      state.parentLoadSucceeded = false;
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

async function mountParent(parent, mount) {
  if (!parent || !mount) return false;

  const options = {
    route: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.route,
    target: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.target,
    contract: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.contract,
    pairContract: AUDRALIA_PUBLIC_GLOBE_CONTROLLER.pairContract,
    cacheKey: getCacheKey(),
    publicPageStandard: "compass-showroom",
    publicSurfaceFirst: true,
    interactiveObjectStageSecond: true,
    hiddenReceiptOnly: true,
    visibleDiagnostics: false,
    statusPanel: false,
    routeBridgeBootstrap: false,
    dynamicRouteBootstrap: false,
    sourcePrimitiveLoading: false,
    childPrecedence: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false
  };

  try {
    let result = null;

    if (typeof parent.mount === "function") result = parent.mount(mount, options);
    else if (typeof parent.start === "function") result = parent.start(mount, options);
    else if (typeof parent.boot === "function") result = parent.boot(mount, options);
    else if (typeof parent.init === "function") result = parent.init(mount, options);
    else if (typeof parent.create === "function") result = parent.create(mount, options);
    else if (typeof parent.render === "function") result = parent.render(mount, options);
    else return false;

    await Promise.resolve(result);

    state.parentMounted = true;
    syncParent(parent);

    return true;
  } catch (error) {
    recordError("parent-engine-mount", error);
    return false;
  }
}

function stageHasCanvas(mount) {
  if (!mount || typeof mount.querySelector !== "function") return false;
  return Boolean(mount.querySelector("canvas"));
}

function markObjectEnhanced(stage, mount) {
  if (!stage) return;

  const enhanced = state.parentMounted || state.parentVisible || stageHasCanvas(mount);

  state.objectEnhanced = enhanced;

  if (enhanced) {
    stage.setAttribute("data-audralia-object-enhanced", "true");
    mark("audraliaObjectEnhanced", "true");
  }
}

function hold(reason) {
  state.held = true;
  state.status = "object-stage-ready-static";
  markRoute(state.status);
  publish(reason || "static-ready");
}

function publish(scope = "publish") {
  syncParent();

  const targets = getTargets();

  state.routeValid = currentRouteValid();
  state.stageFound = Boolean(targets.stage);
  state.mountFound = Boolean(targets.mount);
  state.receiptFound = Boolean(targets.receipt);

  if (targets.stage && targets.mount) {
    markObjectEnhanced(targets.stage, targets.mount);
  }

  const status = Object.freeze({
    ...AUDRALIA_PUBLIC_GLOBE_CONTROLLER,
    scope,
    status: state.status,
    cacheKey: getCacheKey(),
    routeValid: state.routeValid,
    stageFound: state.stageFound,
    mountFound: state.mountFound,
    receiptFound: state.receiptFound,
    parentPresentAtBoot: state.parentPresentAtBoot,
    parentLoadAttempted: state.parentLoadAttempted,
    parentLoadSucceeded: state.parentLoadSucceeded,
    parentResolved: state.parentResolved,
    parentMounted: state.parentMounted,
    parentVisible: state.parentVisible,
    objectEnhanced: state.objectEnhanced,
    held: state.held,
    errors: state.errors.slice()
  });

  if (hasWindow()) {
    window.DGBAudraliaPublicGlobe = status;
    window.DGBAudraliaPublicGlobeController = api;
  }

  mark("audraliaStageFound", state.stageFound ? "true" : "false");
  mark("audraliaMountFound", state.mountFound ? "true" : "false");
  mark("audraliaParentResolved", state.parentResolved ? "true" : "false");
  mark("audraliaParentMounted", state.parentMounted ? "true" : "false");
  mark("audraliaParentVisible", state.parentVisible ? "true" : "false");
  mark("audraliaObjectEnhanced", state.objectEnhanced ? "true" : "false");
  mark("audraliaLastScope", scope);

  return status;
}

async function initAudraliaPublicGlobe() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    getCacheKey();
    state.status = "object-controller-booted";
    markRoute(state.status);

    const targets = getTargets();

    state.routeValid = currentRouteValid();
    state.stageFound = Boolean(targets.stage);
    state.mountFound = Boolean(targets.mount);
    state.receiptFound = Boolean(targets.receipt);

    publish("targets-read");

    if (!state.routeValid || !state.stageFound || !state.mountFound) {
      hold("route-or-target-held");
      return publish("boot-complete-static");
    }

    const parent = await loadParentEngine();

    if (!parent) {
      hold("parent-unavailable");
      return publish("boot-complete-static");
    }

    const mounted = await mountParent(parent, targets.mount);

    if (!mounted) {
      hold("parent-mount-unavailable");
      return publish("boot-complete-static");
    }

    state.status = "object-stage-mounted";
    markRoute(state.status);
    markObjectEnhanced(targets.stage, targets.mount);

    return publish("boot-complete-mounted");
  })();

  return initPromise;
}

function getStatus() {
  return publish("status-read");
}

const api = Object.freeze({
  ...AUDRALIA_PUBLIC_GLOBE_CONTROLLER,
  init: initAudraliaPublicGlobe,
  start: initAudraliaPublicGlobe,
  boot: initAudraliaPublicGlobe,
  getStatus,
  status: getStatus
});

if (hasWindow()) {
  window.DGBAudraliaPublicGlobeController = api;
  publish("module-load");
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initAudraliaPublicGlobe().catch((error) => {
        recordError("init", error);
        hold("init-error");
      });
    }, { once: true });
  } else {
    initAudraliaPublicGlobe().catch((error) => {
      recordError("init", error);
      hold("init-error");
    });
  }
}

export {
  AUDRALIA_PUBLIC_GLOBE_CONTROLLER,
  initAudraliaPublicGlobe,
  getStatus
};

export default AUDRALIA_PUBLIC_GLOBE_CONTROLLER;
