// TARGET FILE: /assets/site.bootstrap.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_BOOTSTRAP_ALIGNMENT_TNT_v2
//
// Global Manor Blueprint bootstrap alignment.
// Restores the sitewide Map / Portal loader by aligning the bootstrap with the
// current registry, CSS, API compatibility contract, and runtime contract.
//
// Previous contract:
// MANOR_BLUEPRINT_SITEWIDE_JOYSTICK_BOOTSTRAP_CHAIN_RENEWAL_TNT_v1
//
// Owns:
// - registry load and freshness proof
// - CSS load and cache-key proof
// - HUD runtime load and freshness proof
// - duplicate prevention
// - Map / Portal mount verification
// - bootstrap status / receipt globals
//
// Does not own:
// - route HTML or registry route truth
// - bubble creation or overlay rendering
// - drag or joystick behavior
// - map or instructions content
// - Hearth route implementation
// - diagnostics
// - planet rendering
// - image generation
// - GraphicBox

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT =
    "MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_BOOTSTRAP_ALIGNMENT_TNT_v2";

  const PREVIOUS_CONTRACT =
    "MANOR_BLUEPRINT_SITEWIDE_JOYSTICK_BOOTSTRAP_CHAIN_RENEWAL_TNT_v1";

  const OLDER_CONTRACT =
    "MANOR_BLUEPRINT_BOOTSTRAP_MOBILE_SAFE_HUD_CACHE_KEY_RENEWAL_TNT_v1";

  const REGISTRY_CONTRACT =
    "MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_REGISTRY_TNT_v1";

  const CSS_CONTRACT =
    "MANOR_BLUEPRINT_ESTATE_ORIENTATION_VISUAL_CSS_TNT_v1";

  const JS_COMPAT_CONTRACT =
    "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";

  const EXPECTED_IMPLEMENTATION_CONTRACT =
    "MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_RUNTIME_TNT_v1";

  const HUD_JS_CACHE_KEY =
    EXPECTED_IMPLEMENTATION_CONTRACT;

  const REGISTRY_PATH =
    "/assets/manor-blueprint/manor.blueprint.registry.js";

  const CSS_PATH =
    "/assets/manor-blueprint/manor.blueprint.css";

  const JS_PATH =
    "/assets/manor-blueprint/manor.blueprint.js";

  const STATUS_GLOBAL =
    "DGB_MANOR_BLUEPRINT_BOOTSTRAP_STATUS";

  const RECEIPT_GLOBAL =
    "DGB_MANOR_BLUEPRINT_BOOTSTRAP_RECEIPT";

  const SITE_STATUS_GLOBAL =
    "DGB_SITE_BOOTSTRAP_STATUS";

  const REGISTRY_API_GLOBAL =
    "DGB_MANOR_BLUEPRINT_REGISTRY";

  const REGISTRY_STATUS_GLOBAL =
    "DGB_MANOR_BLUEPRINT_REGISTRY_STATUS";

  const API_GLOBAL =
    "DGB_MANOR_BLUEPRINT_API";

  const BLUEPRINT_STATUS_GLOBAL =
    "DGB_MANOR_BLUEPRINT_STATUS";

  const CONTROLLER_GLOBAL =
    "__DGB_MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_CONTROLLER__";

  const BUBBLE_SELECTOR =
    "[data-dgb-blueprint-bubble]";

  const OVERLAY_SELECTOR =
    "[data-dgb-blueprint-overlay]";

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
    active: true,

    loadStarted: false,
    loadInProgress: false,
    loadComplete: false,
    loadFailed: false,

    registryLoaded: false,
    registryFresh: false,
    registryContractDetected: "",

    cssLoaded: false,
    cssFresh: false,

    jsLoaded: false,
    blueprintApiPresent: false,

    apiCompatible: false,
    apiContractDetected: "",

    implementationFresh: false,
    blueprintImplementationContractDetected: "",

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

  let activeRun = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function assetUrl(path, contract) {
    return (
      path +
      "?v=" +
      encodeURIComponent(contract)
    );
  }

  function pushUnique(list, value) {
    if (!list.includes(value)) {
      list.push(value);
    }
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] =
        String(value);
    } catch (_error) {}
  }

  function recordError(scope, error) {
    state.errors.push({
      scope,

      message:
        error && error.message
          ? error.message
          : String(error || "unknown"),

      time:
        nowIso()
    });

    state.lastAction =
      "error:" + scope;
  }

  function scripts() {
    try {
      return Array.from(
        document.scripts ||
        []
      );
    } catch (_error) {
      return [];
    }
  }

  function stylesheets() {
    try {
      return Array.from(
        document.querySelectorAll(
          'link[rel="stylesheet"]'
        )
      );
    } catch (_error) {
      return [];
    }
  }

  function urlHasPath(url, path) {
    return String(url || "")
      .includes(path);
  }

  function urlHasKey(url, key) {
    const source =
      String(url || "");

    return (
      source.includes(key) ||
      source.includes(
        encodeURIComponent(key)
      )
    );
  }

  function scriptExists(path) {
    return scripts().some((node) => {
      return urlHasPath(
        node.getAttribute("src"),
        path
      );
    });
  }

  function keyedScriptExists(path, key) {
    return scripts().some((node) => {
      const src =
        node.getAttribute("src") ||
        "";

      return (
        urlHasPath(src, path) &&
        urlHasKey(src, key)
      );
    });
  }

  function cssExists(path) {
    return stylesheets().some((node) => {
      return urlHasPath(
        node.getAttribute("href"),
        path
      );
    });
  }

  function keyedCssExists(path, key) {
    return stylesheets().some((node) => {
      const href =
        node.getAttribute("href") ||
        "";

      return (
        urlHasPath(href, path) &&
        urlHasKey(href, key)
      );
    });
  }

  function getRegistryApi() {
    return (
      window[REGISTRY_API_GLOBAL] ||
      null
    );
  }

  function getRegistryStatus() {
    return (
      window[REGISTRY_STATUS_GLOBAL] ||
      null
    );
  }

  function registryAvailable() {
    return Boolean(
      getRegistryApi() ||
      window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY
    );
  }

  function registryFresh() {
    const api =
      getRegistryApi();

    const receipt =
      getRegistryStatus();

    const detected =
      String(
        (
          api &&
          api.contract
        ) ||
        (
          receipt &&
          receipt.contract
        ) ||
        ""
      );

    state.registryContractDetected =
      detected;

    state.registryFresh =
      detected ===
      REGISTRY_CONTRACT;

    return state.registryFresh;
  }

  function getBlueprintApi() {
    return (
      window[API_GLOBAL] ||
      null
    );
  }

  function getBlueprintStatus() {
    return (
      window[BLUEPRINT_STATUS_GLOBAL] ||
      null
    );
  }

  function blueprintApiAvailable() {
    return Boolean(
      getBlueprintApi()
    );
  }

  function apiCompatible() {
    const api =
      getBlueprintApi();

    const receipt =
      getBlueprintStatus();

    const detected =
      String(
        (
          api &&
          api.contract
        ) ||
        (
          receipt &&
          receipt.apiContract
        ) ||
        ""
      );

    state.apiContractDetected =
      detected;

    state.apiCompatible =
      detected ===
      JS_COMPAT_CONTRACT;

    return state.apiCompatible;
  }

  function implementationFresh() {
    const api =
      getBlueprintApi();

    const receipt =
      getBlueprintStatus();

    const detected =
      String(
        (
          api &&
          api.implementationContract
        ) ||
        (
          receipt &&
          receipt.contract
        ) ||
        ""
      );

    state.blueprintImplementationContractDetected =
      detected;

    state.implementationFresh =
      detected ===
      EXPECTED_IMPLEMENTATION_CONTRACT;

    return state.implementationFresh;
  }

  function bubbleExists() {
    try {
      return Boolean(
        document.querySelector(
          BUBBLE_SELECTOR
        )
      );
    } catch (_error) {
      return false;
    }
  }

  function overlayExists() {
    try {
      return Boolean(
        document.querySelector(
          OVERLAY_SELECTOR
        )
      );
    } catch (_error) {
      return false;
    }
  }

  function waitFor(
    predicate,
    timeoutMs = 2400,
    intervalMs = 40
  ) {
    return new Promise((resolve) => {
      const started =
        Date.now();

      const tick = () => {
        let passed =
          false;

        try {
          passed =
            Boolean(
              predicate()
            );
        } catch (_error) {
          passed =
            false;
        }

        if (passed) {
          resolve(true);
          return;
        }

        if (
          Date.now() -
          started >=
          timeoutMs
        ) {
          resolve(false);
          return;
        }

        window.setTimeout(
          tick,
          intervalMs
        );
      };

      tick();
    });
  }

  function appendScript(
    path,
    contract,
    role
  ) {
    return new Promise((resolve) => {
      const node =
        document.createElement(
          "script"
        );

      node.src =
        assetUrl(
          path,
          contract
        );

      node.async =
        false;

      node.setAttribute(
        "data-manor-blueprint-bootstrap",
        CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-previous-bootstrap",
        PREVIOUS_CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-older-bootstrap",
        OLDER_CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-contract",
        contract
      );

      node.setAttribute(
        "data-manor-blueprint-role",
        role
      );

      if (role === "hud-js") {
        node.setAttribute(
          "data-manor-blueprint-api-contract",
          JS_COMPAT_CONTRACT
        );

        node.setAttribute(
          "data-manor-blueprint-hud-js-cache-key",
          HUD_JS_CACHE_KEY
        );

        node.setAttribute(
          "data-manor-blueprint-expected-implementation-contract",
          EXPECTED_IMPLEMENTATION_CONTRACT
        );
      }

      node.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      node.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      try {
        (
          document.head ||
          document.documentElement
        ).appendChild(node);
      } catch (error) {
        recordError(
          "append-script:" + role,
          error
        );

        resolve(false);
      }
    });
  }

  function appendCss(
    path,
    contract
  ) {
    return new Promise((resolve) => {
      const node =
        document.createElement(
          "link"
        );

      node.rel =
        "stylesheet";

      node.href =
        assetUrl(
          path,
          contract
        );

      node.setAttribute(
        "data-manor-blueprint-bootstrap",
        CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-previous-bootstrap",
        PREVIOUS_CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-older-bootstrap",
        OLDER_CONTRACT
      );

      node.setAttribute(
        "data-manor-blueprint-contract",
        contract
      );

      node.setAttribute(
        "data-manor-blueprint-role",
        "css"
      );

      node.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      node.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      try {
        (
          document.head ||
          document.documentElement
        ).appendChild(node);
      } catch (error) {
        recordError(
          "append-css",
          error
        );

        resolve(false);
      }
    });
  }

  async function loadRegistry() {
    if (
      registryAvailable() &&
      registryFresh()
    ) {
      state.registryLoaded =
        true;

      pushUnique(
        state.skippedAssets,
        "registry:current-global-present"
      );

      return true;
    }

    if (
      registryAvailable() &&
      !registryFresh()
    ) {
      pushUnique(
        state.skippedAssets,

        "registry:stale-global:" +
        (
          state.registryContractDetected ||
          "unknown"
        )
      );
    }

    if (
      keyedScriptExists(
        REGISTRY_PATH,
        REGISTRY_CONTRACT
      )
    ) {
      pushUnique(
        state.skippedAssets,
        "registry:current-script-present"
      );

      await waitFor(() => {
        return (
          registryAvailable() &&
          registryFresh()
        );
      });
    } else {
      if (
        scriptExists(
          REGISTRY_PATH
        )
      ) {
        pushUnique(
          state.skippedAssets,
          "registry:older-script-present"
        );
      }

      await appendScript(
        REGISTRY_PATH,
        REGISTRY_CONTRACT,
        "registry"
      );

      await waitFor(() => {
        return (
          registryAvailable() &&
          registryFresh()
        );
      });
    }

    state.registryLoaded =
      registryAvailable();

    registryFresh();

    if (
      state.registryLoaded &&
      state.registryFresh
    ) {
      pushUnique(
        state.loadedAssets,
        "registry:current"
      );

      return true;
    }

    pushUnique(
      state.failedAssets,
      "registry:current"
    );

    return false;
  }

  async function loadCss() {
    if (
      keyedCssExists(
        CSS_PATH,
        CSS_CONTRACT
      )
    ) {
      state.cssLoaded =
        true;

      state.cssFresh =
        true;

      pushUnique(
        state.skippedAssets,
        "css:current-link-present"
      );

      return true;
    }

    if (
      cssExists(
        CSS_PATH
      )
    ) {
      pushUnique(
        state.skippedAssets,
        "css:older-link-present"
      );
    }

    await appendCss(
      CSS_PATH,
      CSS_CONTRACT
    );

    state.cssLoaded =
      cssExists(
        CSS_PATH
      );

    state.cssFresh =
      keyedCssExists(
        CSS_PATH,
        CSS_CONTRACT
      );

    if (
      state.cssLoaded &&
      state.cssFresh
    ) {
      pushUnique(
        state.loadedAssets,
        "css:current"
      );

      return true;
    }

    pushUnique(
      state.failedAssets,
      "css:current"
    );

    return false;
  }

  function refreshBlueprintApi(scope) {
    const api =
      getBlueprintApi();

    if (
      !api ||
      typeof api.refresh !==
      "function"
    ) {
      return false;
    }

    try {
      api.refresh();
      return true;
    } catch (error) {
      recordError(
        scope ||
        "blueprint-api-refresh",

        error
      );

      return false;
    }
  }

  async function loadBlueprintJs() {
    if (
      blueprintApiAvailable() &&
      apiCompatible() &&
      implementationFresh()
    ) {
      state.jsLoaded =
        true;

      state.blueprintApiPresent =
        true;

      pushUnique(
        state.skippedAssets,
        "hud-js:current-api-present"
      );

      refreshBlueprintApi(
        "current-api-refresh"
      );

      return true;
    }

    if (
      blueprintApiAvailable()
    ) {
      pushUnique(
        state.skippedAssets,

        "hud-js:stale-api:" +
        (
          state.blueprintImplementationContractDetected ||
          state.apiContractDetected ||
          "unknown"
        )
      );
    }

    if (
      keyedScriptExists(
        JS_PATH,
        HUD_JS_CACHE_KEY
      )
    ) {
      pushUnique(
        state.skippedAssets,
        "hud-js:current-script-present"
      );
    } else {
      if (
        scriptExists(
          JS_PATH
        )
      ) {
        pushUnique(
          state.skippedAssets,
          "hud-js:older-script-present"
        );
      }

      await appendScript(
        JS_PATH,
        HUD_JS_CACHE_KEY,
        "hud-js"
      );
    }

    await waitFor(
      () => {
        return (
          blueprintApiAvailable() &&
          apiCompatible() &&
          implementationFresh()
        );
      },
      3000,
      40
    );

    state.jsLoaded =
      blueprintApiAvailable();

    state.blueprintApiPresent =
      blueprintApiAvailable();

    apiCompatible();
    implementationFresh();

    if (
      state.jsLoaded &&
      state.apiCompatible &&
      state.implementationFresh
    ) {
      pushUnique(
        state.loadedAssets,
        "hud-js:current"
      );

      refreshBlueprintApi(
        "post-load-api-refresh"
      );

      return true;
    }

    pushUnique(
      state.failedAssets,
      "hud-js:current"
    );

    return false;
  }

  function refreshPresence() {
    state.registryLoaded =
      registryAvailable();

    registryFresh();

    state.cssLoaded =
      cssExists(
        CSS_PATH
      );

    state.cssFresh =
      keyedCssExists(
        CSS_PATH,
        CSS_CONTRACT
      );

    state.jsLoaded =
      blueprintApiAvailable();

    state.blueprintApiPresent =
      blueprintApiAvailable();

    apiCompatible();
    implementationFresh();

    state.bubblePresent =
      bubbleExists();

    state.overlayPresent =
      overlayExists();
  }

  function recomputeCompletion() {
    refreshPresence();

    state.loadComplete =
      Boolean(
        state.registryLoaded &&
        state.registryFresh &&
        state.cssLoaded &&
        state.cssFresh &&
        state.jsLoaded &&
        state.blueprintApiPresent &&
        state.apiCompatible &&
        state.implementationFresh &&
        state.bubblePresent &&
        state.overlayPresent
      );

    state.loadFailed =
      Boolean(
        state.loadStarted &&
        !state.loadInProgress &&
        !state.loadComplete
      );

    return state.loadComplete;
  }

  function status() {
    refreshPresence();

    return Object.freeze({
      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      olderContract:
        OLDER_CONTRACT,

      active:
        true,

      registryContract:
        REGISTRY_CONTRACT,

      registryContractDetected:
        state.registryContractDetected,

      registryFresh:
        state.registryFresh,

      cssContract:
        CSS_CONTRACT,

      cssFresh:
        state.cssFresh,

      jsContract:
        JS_COMPAT_CONTRACT,

      apiContractDetected:
        state.apiContractDetected,

      apiCompatible:
        state.apiCompatible,

      hudJsCacheKey:
        HUD_JS_CACHE_KEY,

      expectedImplementationContract:
        EXPECTED_IMPLEMENTATION_CONTRACT,

      blueprintImplementationContractDetected:
        state.blueprintImplementationContractDetected,

      implementationFresh:
        state.implementationFresh,

      registryLoaded:
        state.registryLoaded,

      cssLoaded:
        state.cssLoaded,

      jsLoaded:
        state.jsLoaded,

      blueprintApiPresent:
        state.blueprintApiPresent,

      bubblePresent:
        state.bubblePresent,

      overlayPresent:
        state.overlayPresent,

      loadStarted:
        state.loadStarted,

      loadInProgress:
        state.loadInProgress,

      loadComplete:
        state.loadComplete,

      loadFailed:
        state.loadFailed,

      loadedAssets:
        state.loadedAssets.slice(),

      failedAssets:
        state.failedAssets.slice(),

      skippedAssets:
        state.skippedAssets.slice(),

      siteWideBootstrap:
        true,

      perPageCustomCode:
        false,

      hearthRouteOwnedHere:
        false,

      diagnosticProbeOwnedHere:
        false,

      imageGeneration:
        false,

      graphicBox:
        false,

      heavyRuntime:
        false,

      webGL:
        false,

      canvasMapEngine:
        false,

      startedAt:
        state.startedAt,

      completedAt:
        state.completedAt,

      lastAction:
        state.lastAction,

      errors:
        state.errors.slice()
    });
  }

  function publishStatus() {
    const payload =
      status();

    window[STATUS_GLOBAL] =
      payload;

    window[RECEIPT_GLOBAL] =
      payload;

    window[SITE_STATUS_GLOBAL] =
      payload;

    setDataset(
      "siteBootstrapActive",
      "true"
    );

    setDataset(
      "siteBootstrapContract",
      CONTRACT
    );

    setDataset(
      "siteBootstrapPreviousContract",
      PREVIOUS_CONTRACT
    );

    setDataset(
      "siteBootstrapOlderContract",
      OLDER_CONTRACT
    );

    setDataset(
      "manorBlueprintRegistryContract",
      REGISTRY_CONTRACT
    );

    setDataset(
      "manorBlueprintRegistryContractDetected",
      state.registryContractDetected ||
      ""
    );

    setDataset(
      "manorBlueprintRegistryFresh",
      state.registryFresh
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintCssContract",
      CSS_CONTRACT
    );

    setDataset(
      "manorBlueprintCssFresh",
      state.cssFresh
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintJsContract",
      JS_COMPAT_CONTRACT
    );

    setDataset(
      "manorBlueprintApiContractDetected",
      state.apiContractDetected ||
      ""
    );

    setDataset(
      "manorBlueprintApiCompatible",
      state.apiCompatible
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintHudJsCacheKey",
      HUD_JS_CACHE_KEY
    );

    setDataset(
      "manorBlueprintExpectedImplementationContract",
      EXPECTED_IMPLEMENTATION_CONTRACT
    );

    setDataset(
      "manorBlueprintImplementationContractDetected",
      state.blueprintImplementationContractDetected ||
      ""
    );

    setDataset(
      "manorBlueprintImplementationFresh",
      state.implementationFresh
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapLoadStarted",
      state.loadStarted
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapLoadInProgress",
      state.loadInProgress
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapLoadComplete",
      state.loadComplete
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapLoadFailed",
      state.loadFailed
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapRegistryLoaded",
      state.registryLoaded
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapCssLoaded",
      state.cssLoaded
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBootstrapJsLoaded",
      state.jsLoaded
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintBubblePresent",
      state.bubblePresent
        ? "true"
        : "false"
    );

    setDataset(
      "manorBlueprintOverlayPresent",
      state.overlayPresent
        ? "true"
        : "false"
    );

    return payload;
  }

  async function executeRun() {
    state.loadStarted =
      true;

    state.loadInProgress =
      true;

    state.loadComplete =
      false;

    state.loadFailed =
      false;

    state.startedAt =
      state.startedAt ||
      nowIso();

    state.completedAt =
      "";

    state.lastAction =
      "load-start";

    publishStatus();

    try {
      await loadRegistry();
      publishStatus();

      await loadCss();
      publishStatus();

      await loadBlueprintJs();

      refreshBlueprintApi(
        "final-api-refresh"
      );

      await waitFor(
        () => {
          return (
            bubbleExists() &&
            overlayExists()
          );
        },
        2600,
        40
      );

      state.loadInProgress =
        false;

      recomputeCompletion();

      state.completedAt =
        nowIso();

      state.lastAction =
        state.loadComplete
          ? "load-complete"
          : "load-failed";

      publishStatus();

      return status();
    } catch (error) {
      state.loadInProgress =
        false;

      state.loadComplete =
        false;

      state.loadFailed =
        true;

      state.completedAt =
        nowIso();

      recordError(
        "run",
        error
      );

      publishStatus();

      return status();
    }
  }

  function run(options = {}) {
    const force =
      Boolean(
        options &&
        options.force
      );

    if (activeRun) {
      return activeRun;
    }

    refreshPresence();

    if (
      state.loadComplete &&
      !force
    ) {
      refreshBlueprintApi(
        "already-complete-refresh"
      );

      publishStatus();

      return Promise.resolve(
        status()
      );
    }

    activeRun =
      executeRun()
        .finally(() => {
          activeRun =
            null;
        });

    return activeRun;
  }

  function refresh() {
    refreshBlueprintApi(
      "manual-refresh"
    );

    recomputeCompletion();

    state.lastAction =
      "refresh";

    publishStatus();

    return status();
  }

  function retry() {
    state.loadFailed =
      false;

    state.lastAction =
      "retry";

    publishStatus();

    return run({
      force: true
    });
  }

  function exposeController() {
    window[CONTROLLER_GLOBAL] =
      Object.freeze({
        contract:
          CONTRACT,

        previousContract:
          PREVIOUS_CONTRACT,

        olderContract:
          OLDER_CONTRACT,

        registryContract:
          REGISTRY_CONTRACT,

        cssContract:
          CSS_CONTRACT,

        jsContract:
          JS_COMPAT_CONTRACT,

        hudJsCacheKey:
          HUD_JS_CACHE_KEY,

        expectedImplementationContract:
          EXPECTED_IMPLEMENTATION_CONTRACT,

        run,
        retry,
        refresh,
        status
      });
  }

  function init() {
    exposeController();
    run();
  }

  publishStatus();

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
