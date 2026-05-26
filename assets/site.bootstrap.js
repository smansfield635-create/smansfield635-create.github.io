// TARGET FILE: /assets/site.bootstrap.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_BOOTSTRAP_MOBILE_SAFE_HUD_CACHE_KEY_RENEWAL_TNT_v1
//
// Global site bootstrap loader.
// Renews the Manor Blueprint HUD JS cache key so the site requests the
// mobile-safe HUD implementation.
//
// Previous contract:
// MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_TNT_v1
//
// Owns:
// - registry load
// - CSS load
// - HUD JS load
// - HUD JS cache-key authority
// - duplicate prevention
// - implementation freshness proof
// - bootstrap status / receipt globals
//
// Does not own:
// - route HTML
// - bubble creation
// - overlay rendering
// - drag behavior
// - map/instructions content
// - Audralia canvas/renderplex
// - Audralia UI
// - water/hydration/final visual pass
// - image generation
// - GraphicBox
// - heavy runtime

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_BOOTSTRAP_MOBILE_SAFE_HUD_CACHE_KEY_RENEWAL_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_TNT_v1";

  const REGISTRY_CONTRACT = "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1";
  const CSS_CONTRACT = "MANOR_BLUEPRINT_FIXED_BUBBLE_FULLSCREEN_OVERLAY_CSS_TNT_v1";

  const JS_COMPAT_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const HUD_JS_CACHE_KEY = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";
  const EXPECTED_IMPLEMENTATION_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";

  const REGISTRY_PATH = "/assets/manor-blueprint/manor.blueprint.registry.js";
  const CSS_PATH = "/assets/manor-blueprint/manor.blueprint.css";
  const JS_PATH = "/assets/manor-blueprint/manor.blueprint.js";

  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_BOOTSTRAP_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_BOOTSTRAP_RECEIPT";
  const SITE_STATUS_GLOBAL = "DGB_SITE_BOOTSTRAP_STATUS";

  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const BLUEPRINT_STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";

  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_CONTROLLER__";

  if (
    window[CONTROLLER_GLOBAL] &&
    window[CONTROLLER_GLOBAL].contract === CONTRACT &&
    typeof window[CONTROLLER_GLOBAL].refresh === "function"
  ) {
    try {
      window[CONTROLLER_GLOBAL].refresh();
    } catch (_error) {}
    return;
  }

  const state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    active: true,

    registryContract: REGISTRY_CONTRACT,
    cssContract: CSS_CONTRACT,
    jsContract: JS_COMPAT_CONTRACT,

    hudJsCacheKey: HUD_JS_CACHE_KEY,
    expectedImplementationContract: EXPECTED_IMPLEMENTATION_CONTRACT,
    blueprintImplementationContractDetected: "",
    implementationFresh: false,
    mobileSafeHudRequested: true,

    loadStarted: false,
    loadComplete: false,
    loadFailed: false,

    registryLoaded: false,
    cssLoaded: false,
    jsLoaded: false,

    blueprintApiPresent: false,
    bubblePresent: false,
    overlayPresent: false,

    loadedAssets: [],
    failedAssets: [],
    skippedAssets: [],
    errors: [],

    startedAt: "",
    completedAt: "",
    lastAction: "boot"
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function assetUrl(path, contract) {
    return path + "?v=" + encodeURIComponent(contract);
  }

  function safeArrayPush(list, value) {
    if (!list.includes(value)) list.push(value);
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
    } catch (_error) {}
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope,
      message,
      time: nowIso()
    });

    state.lastAction = "error:" + scope;
    publishStatus();
  }

  function getScripts() {
    return Array.from(document.scripts || []);
  }

  function scriptExists(path) {
    return getScripts().some((script) => {
      const src = String(script.getAttribute("src") || "");
      return src.includes(path);
    });
  }

  function scriptWithCacheKeyExists(path, cacheKey) {
    return getScripts().some((script) => {
      const src = String(script.getAttribute("src") || "");
      return src.includes(path) && src.includes(encodeURIComponent(cacheKey));
    });
  }

  function cssExists(path) {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

    return links.some((link) => {
      const href = String(link.getAttribute("href") || "");
      return href.includes(path);
    });
  }

  function bubbleExists() {
    return Boolean(document.querySelector("[data-dgb-blueprint-bubble]"));
  }

  function overlayExists() {
    return Boolean(document.querySelector("[data-dgb-blueprint-overlay]"));
  }

  function registryAvailable() {
    return Boolean(
      window.DGB_MANOR_BLUEPRINT_REGISTRY ||
      window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY
    );
  }

  function getBlueprintApi() {
    return window[API_GLOBAL] || null;
  }

  function getBlueprintStatus() {
    return window[BLUEPRINT_STATUS_GLOBAL] || null;
  }

  function blueprintApiAvailable() {
    return Boolean(getBlueprintApi());
  }

  function getDetectedImplementationContract() {
    const api = getBlueprintApi();
    const blueprintStatus = getBlueprintStatus();

    return String(
      (api && api.implementationContract) ||
      (blueprintStatus && blueprintStatus.contract) ||
      ""
    );
  }

  function implementationFresh() {
    const detected = getDetectedImplementationContract();
    state.blueprintImplementationContractDetected = detected;
    state.implementationFresh = detected === EXPECTED_IMPLEMENTATION_CONTRACT;
    return state.implementationFresh;
  }

  function waitForCondition(predicate, timeoutMs = 1600, intervalMs = 40) {
    return new Promise((resolve) => {
      const started = Date.now();

      const tick = () => {
        let passed = false;

        try {
          passed = Boolean(predicate());
        } catch (_error) {
          passed = false;
        }

        if (passed) {
          resolve(true);
          return;
        }

        if (Date.now() - started >= timeoutMs) {
          resolve(false);
          return;
        }

        window.setTimeout(tick, intervalMs);
      };

      tick();
    });
  }

  function appendScript(path, contract, role) {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = assetUrl(path, contract);
      script.async = false;
      script.defer = true;
      script.setAttribute("data-manor-blueprint-bootstrap", CONTRACT);
      script.setAttribute("data-manor-blueprint-previous-bootstrap", PREVIOUS_CONTRACT);
      script.setAttribute("data-manor-blueprint-contract", contract);
      script.setAttribute("data-manor-blueprint-role", role);

      if (role === "hud-js") {
        script.setAttribute("data-manor-blueprint-hud-js-cache-key", HUD_JS_CACHE_KEY);
        script.setAttribute("data-manor-blueprint-expected-implementation-contract", EXPECTED_IMPLEMENTATION_CONTRACT);
        script.setAttribute("data-manor-blueprint-mobile-safe-hud-requested", "true");
      }

      script.addEventListener("load", () => resolve(true), { once: true });
      script.addEventListener("error", () => resolve(false), { once: true });

      try {
        (document.head || document.documentElement).appendChild(script);
      } catch (error) {
        recordError("append-script:" + role, error);
        resolve(false);
      }
    });
  }

  function appendCss(path, contract) {
    return new Promise((resolve) => {
      const link = document.createElement("link");

      link.rel = "stylesheet";
      link.href = assetUrl(path, contract);
      link.setAttribute("data-manor-blueprint-bootstrap", CONTRACT);
      link.setAttribute("data-manor-blueprint-previous-bootstrap", PREVIOUS_CONTRACT);
      link.setAttribute("data-manor-blueprint-contract", contract);
      link.setAttribute("data-manor-blueprint-role", "css");

      link.addEventListener("load", () => resolve(true), { once: true });
      link.addEventListener("error", () => resolve(false), { once: true });

      try {
        (document.head || document.documentElement).appendChild(link);
      } catch (error) {
        recordError("append-css", error);
        resolve(false);
      }
    });
  }

  async function loadRegistry() {
    if (registryAvailable()) {
      state.registryLoaded = true;
      safeArrayPush(state.skippedAssets, "registry:global-present");
      publishStatus();
      return true;
    }

    if (scriptExists(REGISTRY_PATH)) {
      safeArrayPush(state.skippedAssets, "registry:script-present");

      const becameAvailable = await waitForCondition(registryAvailable, 1400, 40);
      state.registryLoaded = Boolean(becameAvailable || registryAvailable());

      if (state.registryLoaded) {
        safeArrayPush(state.loadedAssets, "registry:detected");
      } else {
        safeArrayPush(state.failedAssets, "registry:script-present-but-global-missing");
      }

      publishStatus();
      return state.registryLoaded;
    }

    const loaded = await appendScript(REGISTRY_PATH, REGISTRY_CONTRACT, "registry");

    if (loaded || registryAvailable()) {
      const becameAvailable = await waitForCondition(registryAvailable, 1200, 40);
      state.registryLoaded = Boolean(becameAvailable || registryAvailable());
    } else {
      state.registryLoaded = false;
    }

    if (state.registryLoaded) {
      safeArrayPush(state.loadedAssets, "registry");
    } else {
      safeArrayPush(state.failedAssets, "registry");
    }

    publishStatus();
    return state.registryLoaded;
  }

  async function loadCss() {
    if (cssExists(CSS_PATH)) {
      state.cssLoaded = true;
      safeArrayPush(state.skippedAssets, "css:link-present");
      publishStatus();
      return true;
    }

    const loaded = await appendCss(CSS_PATH, CSS_CONTRACT);
    state.cssLoaded = Boolean(loaded || cssExists(CSS_PATH));

    if (state.cssLoaded) {
      safeArrayPush(state.loadedAssets, "css");
    } else {
      safeArrayPush(state.failedAssets, "css");
    }

    publishStatus();
    return state.cssLoaded;
  }

  async function refreshBlueprintApiIfAvailable(scope) {
    const api = getBlueprintApi();

    if (api && typeof api.refresh === "function") {
      try {
        api.refresh();
      } catch (error) {
        recordError(scope || "blueprint-api-refresh", error);
      }
    }
  }

  async function loadBlueprintJs() {
    const hasApi = blueprintApiAvailable();
    const fresh = implementationFresh();

    if (hasApi && fresh) {
      state.jsLoaded = true;
      state.blueprintApiPresent = true;
      safeArrayPush(state.skippedAssets, "hud-js:fresh-api-present");
      await refreshBlueprintApiIfAvailable("fresh-blueprint-api-refresh");
      publishStatus();
      return true;
    }

    if (hasApi && !fresh) {
      safeArrayPush(state.skippedAssets, "hud-js:stale-api-detected");
    }

    if (scriptWithCacheKeyExists(JS_PATH, HUD_JS_CACHE_KEY)) {
      safeArrayPush(state.skippedAssets, "hud-js:mobile-safe-script-present");

      const becameFresh = await waitForCondition(implementationFresh, 2200, 50);
      state.jsLoaded = Boolean(blueprintApiAvailable());
      state.blueprintApiPresent = Boolean(blueprintApiAvailable());

      if (becameFresh || implementationFresh()) {
        safeArrayPush(state.loadedAssets, "hud-js:mobile-safe-detected");
        await refreshBlueprintApiIfAvailable("mobile-safe-blueprint-api-refresh");
      } else if (state.blueprintApiPresent) {
        safeArrayPush(state.failedAssets, "hud-js:script-present-but-implementation-not-fresh");
      } else {
        safeArrayPush(state.failedAssets, "hud-js:script-present-but-api-missing");
      }

      publishStatus();
      return state.jsLoaded;
    }

    const loaded = await appendScript(JS_PATH, HUD_JS_CACHE_KEY, "hud-js");

    if (loaded || blueprintApiAvailable()) {
      await waitForCondition(blueprintApiAvailable, 1800, 40);
      await waitForCondition(implementationFresh, 2200, 50);
      state.jsLoaded = Boolean(blueprintApiAvailable());
      state.blueprintApiPresent = Boolean(blueprintApiAvailable());
    } else {
      state.jsLoaded = false;
      state.blueprintApiPresent = false;
    }

    if (state.jsLoaded) {
      safeArrayPush(state.loadedAssets, "hud-js:mobile-safe");
      await refreshBlueprintApiIfAvailable("post-load-blueprint-refresh");
    } else {
      safeArrayPush(state.failedAssets, "hud-js:mobile-safe");
    }

    implementationFresh();
    publishStatus();
    return state.jsLoaded;
  }

  function refreshPresence() {
    state.registryLoaded = Boolean(state.registryLoaded || registryAvailable());
    state.cssLoaded = Boolean(state.cssLoaded || cssExists(CSS_PATH));
    state.jsLoaded = Boolean(state.jsLoaded || blueprintApiAvailable());
    state.blueprintApiPresent = Boolean(blueprintApiAvailable());
    state.bubblePresent = bubbleExists();
    state.overlayPresent = overlayExists();
    implementationFresh();
  }

  function status() {
    refreshPresence();

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      active: true,

      registryContract: REGISTRY_CONTRACT,
      cssContract: CSS_CONTRACT,
      jsContract: JS_COMPAT_CONTRACT,

      hudJsCacheKey: HUD_JS_CACHE_KEY,
      expectedImplementationContract: EXPECTED_IMPLEMENTATION_CONTRACT,
      blueprintImplementationContractDetected: state.blueprintImplementationContractDetected,
      implementationFresh: state.implementationFresh,
      mobileSafeHudRequested: true,

      registryLoaded: state.registryLoaded,
      cssLoaded: state.cssLoaded,
      jsLoaded: state.jsLoaded,

      blueprintApiPresent: state.blueprintApiPresent,
      bubblePresent: state.bubblePresent,
      overlayPresent: state.overlayPresent,

      loadStarted: state.loadStarted,
      loadComplete: state.loadComplete,
      loadFailed: state.loadFailed,

      loadedAssets: state.loadedAssets.slice(),
      failedAssets: state.failedAssets.slice(),
      skippedAssets: state.skippedAssets.slice(),

      siteWideBootstrap: true,
      perPageCustomCode: false,
      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false,
      webGL: false,
      canvasMapEngine: false,

      startedAt: state.startedAt,
      completedAt: state.completedAt,
      lastAction: state.lastAction,
      errors: state.errors.slice()
    });
  }

  function publishStatus() {
    const payload = status();

    window[STATUS_GLOBAL] = payload;
    window[RECEIPT_GLOBAL] = payload;
    window[SITE_STATUS_GLOBAL] = payload;

    setDataset("siteBootstrapActive", "true");
    setDataset("siteBootstrapContract", CONTRACT);
    setDataset("siteBootstrapPreviousContract", PREVIOUS_CONTRACT);

    setDataset("manorBlueprintBootstrapActive", "true");
    setDataset("manorBlueprintRegistryContract", REGISTRY_CONTRACT);
    setDataset("manorBlueprintCssContract", CSS_CONTRACT);
    setDataset("manorBlueprintJsContract", JS_COMPAT_CONTRACT);

    setDataset("manorBlueprintHudJsCacheKey", HUD_JS_CACHE_KEY);
    setDataset("manorBlueprintExpectedImplementationContract", EXPECTED_IMPLEMENTATION_CONTRACT);
    setDataset("manorBlueprintImplementationContractDetected", state.blueprintImplementationContractDetected || "");
    setDataset("manorBlueprintImplementationFresh", state.implementationFresh ? "true" : "false");
    setDataset("manorBlueprintMobileSafeHudRequested", "true");

    setDataset("manorBlueprintBootstrapLoadComplete", state.loadComplete ? "true" : "false");
    setDataset("manorBlueprintBootstrapLoadFailed", state.loadFailed ? "true" : "false");
    setDataset("manorBlueprintBootstrapRegistryLoaded", state.registryLoaded ? "true" : "false");
    setDataset("manorBlueprintBootstrapCssLoaded", state.cssLoaded ? "true" : "false");
    setDataset("manorBlueprintBootstrapJsLoaded", state.jsLoaded ? "true" : "false");

    return payload;
  }

  async function run() {
    if (state.loadStarted && !state.loadFailed) {
      publishStatus();
      return status();
    }

    state.loadStarted = true;
    state.loadComplete = false;
    state.loadFailed = false;
    state.startedAt = state.startedAt || nowIso();
    state.lastAction = "load-start";
    publishStatus();

    try {
      await loadRegistry();
      await loadCss();
      await loadBlueprintJs();

      refreshPresence();

      state.loadComplete = Boolean(
        state.registryLoaded &&
        state.cssLoaded &&
        state.jsLoaded &&
        state.blueprintApiPresent
      );

      state.loadFailed = !state.loadComplete;
      state.completedAt = nowIso();
      state.lastAction = state.loadComplete ? "load-complete" : "load-failed";

      await refreshBlueprintApiIfAvailable("final-blueprint-api-refresh");

      refreshPresence();
      publishStatus();

      return status();
    } catch (error) {
      state.loadComplete = false;
      state.loadFailed = true;
      state.completedAt = nowIso();
      recordError("run", error);
      publishStatus();
      return status();
    }
  }

  function refresh() {
    refreshPresence();

    refreshBlueprintApiIfAvailable("refresh-blueprint-api");

    state.lastAction = "refresh";
    publishStatus();
    return status();
  }

  function exposeController() {
    window[CONTROLLER_GLOBAL] = Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      hudJsCacheKey: HUD_JS_CACHE_KEY,
      expectedImplementationContract: EXPECTED_IMPLEMENTATION_CONTRACT,
      run,
      refresh,
      status
    });
  }

  function init() {
    exposeController();
    run();
  }

  publishStatus();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
