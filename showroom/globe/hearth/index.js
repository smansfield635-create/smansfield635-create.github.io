// /showroom/globe/hearth/index.js
// HEARTH_G3_FAIL_OPEN_RENDER_CHAIN_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Prevent missing/broken child engines from blanking the Hearth planet render.
// - Required: terrain and canvas.
// - Optional: hydration, mountains, cliffs, valleys, beaches, islands.
// - The page must render the planet even if optional child engines fail.
// - No GraphicBox. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_FAIL_OPEN_RENDER_CHAIN_ROUTE_CONTROLLER_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-fail-open-render-chain-route-controller";
  const RECEIPT = "HEARTH_G3_FAIL_OPEN_RENDER_CHAIN_ROUTE_RECEIPT";
  const KEY = "hearth-g3-fail-open-render-chain-v1";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const REQUIRED_SOURCES = Object.freeze([
    { role: "terrain", src: `/assets/hearth/hearth.terrain.js?v=${KEY}` },
    { role: "canvas", src: `/assets/hearth/hearth.canvas.js?v=${KEY}` }
  ]);

  const OPTIONAL_SOURCES = Object.freeze([
    { role: "hydration", src: `/assets/hearth/hearth.hydration.js?v=${KEY}` },
    { role: "mountains", src: `/assets/hearth/hearth.mountains.js?v=${KEY}` },
    { role: "cliffs", src: `/assets/hearth/hearth.cliffs.js?v=${KEY}` },
    { role: "valleys", src: `/assets/hearth/hearth.valleys.js?v=${KEY}` },
    { role: "beaches", src: `/assets/hearth/hearth.beaches.js?v=${KEY}` },
    { role: "islands", src: `/assets/hearth/hearth.islands.js?v=${KEY}` }
  ]);

  const state = {
    booted: false,
    loaded: [],
    failed: [],
    optionalFailed: [],
    requiredFailed: []
  };

  function roleKey(role) {
    return `hearth${role.slice(0, 1).toUpperCase()}${role.slice(1)}ScriptLoaded`;
  }

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthExpectedRoute = EXPECTED_ROUTE;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "fail-open-child-engine-chain";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthRouteLoadKey = KEY;
    document.documentElement.dataset.hearthRequiredRenderChain = "terrain,canvas";
    document.documentElement.dataset.hearthOptionalEnhancementChain =
      "hydration,mountains,cliffs,valleys,beaches,islands";
    document.documentElement.dataset.hearthLoadedScripts = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedScripts = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthOptionalFailures = state.optionalFailed.join(",") || "none";
    document.documentElement.dataset.hearthRequiredFailures = state.requiredFailed.join(",") || "none";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthActiveWeatherExcluded = "true";
    document.documentElement.dataset.hearthCloudsExcluded = "true";
    document.documentElement.dataset.hearthHumidityExcluded = "true";
  }

  function callKnownDisposers() {
    [
      "__HEARTH_CANVAS_CHILD_ENGINE_COMPOSITION_DISPOSE__",
      "__HEARTH_CANVAS_LANDFORM_CONSUMPTION_DISPOSE__",
      "__HEARTH_CANVAS_BOUNDARY_DISPOSE__",
      "__HEARTH_CANVAS_G3_FAMILY_DISPOSE__",
      "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
      "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
      "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_MOUNTAINS_DISPOSE__",
      "__HEARTH_CLIFFS_DISPOSE__",
      "__HEARTH_VALLEYS_DISPOSE__",
      "__HEARTH_BEACHES_DISPOSE__",
      "__HEARTH_ISLANDS_DISPOSE__",
      "__HEARTH_TERRAIN_BOUNDARY_DISPOSE__",
      "__HEARTH_HYDRATION_BOUNDARY_DISPOSE__",
      "__HEARTH_G2_DISPOSE__"
    ].forEach((name) => {
      if (typeof window[name] === "function") {
        try {
          window[name]();
        } catch (_) {}
      }

      try {
        window[name] = null;
      } catch (_) {}
    });
  }

  function removePriorScripts() {
    document
      .querySelectorAll([
        'script[src*="/assets/hearth/hearth.terrain.js"]',
        'script[src*="/assets/hearth/hearth.hydration.js"]',
        'script[src*="/assets/hearth/hearth.mountains.js"]',
        'script[src*="/assets/hearth/hearth.cliffs.js"]',
        'script[src*="/assets/hearth/hearth.valleys.js"]',
        'script[src*="/assets/hearth/hearth.beaches.js"]',
        'script[src*="/assets/hearth/hearth.islands.js"]',
        'script[src*="/assets/hearth/hearth.canvas.js"]',
        'script[data-hearth-render-chain-script="true"]',
        'script[data-hearth-child-engine-script="true"]'
      ].join(","))
      .forEach((script) => script.remove());
  }

  function ensureMount() {
    let mount = document.getElementById("hearthCanvasMount");

    if (!mount) {
      const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthMount = "true";
      mount.dataset.render = "hearth";
      mount.dataset.body = "hearth";
      mount.setAttribute("aria-label", "Hearth G3 fail-open planet mount");
      parent.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.hearthGeneration = "G3";
    mount.dataset.hearthStandard = "fail-open-child-engine-chain";
    mount.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    mount.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.hearthHydrationOwner = "/assets/hearth/hearth.hydration.js";
    mount.dataset.hearthMountainOwner = "/assets/hearth/hearth.mountains.js";
    mount.dataset.hearthCliffOwner = "/assets/hearth/hearth.cliffs.js";
    mount.dataset.hearthValleyOwner = "/assets/hearth/hearth.valleys.js";
    mount.dataset.hearthBeachOwner = "/assets/hearth/hearth.beaches.js";
    mount.dataset.hearthIslandOwner = "/assets/hearth/hearth.islands.js";
    mount.dataset.hearthGeneratedImage = "false";
    mount.dataset.hearthGraphicBox = "false";

    return mount;
  }

  function installFallbackMountStyle() {
    const prior = document.getElementById("hearth-fail-open-route-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-fail-open-route-style";
    style.textContent = `
      #hearthCanvasMount {
        position: relative;
        width: 100%;
        min-height: 300px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
        border-radius: 28px;
        background:
          radial-gradient(circle at 50% 50%, rgba(18, 58, 86, 0.68), rgba(2, 8, 16, 0.96) 68%);
      }

      #hearthCanvasMount canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
      }

      #hearthCanvasMount[data-hearth-required-failure="true"]::after {
        content: "Hearth render chain blocked. Terrain or canvas failed to load.";
        position: absolute;
        inset: auto 18px 18px;
        z-index: 3;
        padding: 12px 14px;
        border: 1px solid rgba(228, 180, 95, 0.5);
        border-radius: 16px;
        background: rgba(7, 14, 24, 0.92);
        color: #e4b45f;
        font: 700 13px/1.35 system-ui, sans-serif;
      }
    `;

    document.head.appendChild(style);
  }

  function loadScript(source, required) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source.src;
      script.defer = true;
      script.dataset.hearthRenderChainScript = "true";
      script.dataset.hearthScriptRole = source.role;
      script.dataset.hearthScriptRequired = String(required);
      script.dataset.contract = CONTRACT;
      script.dataset.familyContract = FAMILY_CONTRACT;

      script.addEventListener(
        "load",
        () => {
          state.loaded.push(source.role);
          document.documentElement.dataset[roleKey(source.role)] = "true";
          stamp(`loaded-${source.role}`);
          resolve({ role: source.role, loaded: true, required });
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => {
          state.failed.push(source.role);
          document.documentElement.dataset[roleKey(source.role)] = "false";

          if (required) {
            state.requiredFailed.push(source.role);
            stamp(`required-failed-${source.role}`);
            reject(new Error(`Required Hearth script failed: ${source.role} ${source.src}`));
            return;
          }

          state.optionalFailed.push(source.role);
          stamp(`optional-failed-${source.role}`);
          resolve({ role: source.role, loaded: false, required: false });
        },
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  async function loadOptionalEnhancements() {
    const results = [];

    for (const source of OPTIONAL_SOURCES) {
      stamp(`loading-optional-${source.role}`);
      const result = await loadScript(source, false);
      results.push(result);
    }

    return results;
  }

  async function loadRequiredRenderChain() {
    for (const source of REQUIRED_SOURCES) {
      stamp(`loading-required-${source.role}`);
      await loadScript(source, true);
    }
  }

  function exposeReceipt(status) {
    window.HEARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: EXPECTED_ROUTE,
      loadKey: KEY,
      generation: "G3",
      standard: "fail-open-child-engine-chain",
      required: REQUIRED_SOURCES.map((source) => ({
        role: source.role,
        src: source.src
      })),
      optional: OPTIONAL_SOURCES.map((source) => ({
        role: source.role,
        src: source.src
      })),
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      optionalFailed: state.optionalFailed.slice(),
      requiredFailed: state.requiredFailed.slice(),
      status
    });
  }

  async function boot() {
    if (state.booted) return;
    state.booted = true;

    const mount = ensureMount();

    stamp("booting");
    exposeReceipt("booting");
    callKnownDisposers();
    removePriorScripts();
    installFallbackMountStyle();
    ensureMount();

    try {
      await loadScript(REQUIRED_SOURCES[0], true);

      await loadOptionalEnhancements();

      await loadScript(REQUIRED_SOURCES[1], true);

      mount.dataset.hearthRequiredFailure = "false";
      mount.dataset.hearthOptionalFailures = state.optionalFailed.join(",") || "none";
      document.body.dataset.hearthRouteReady = "true";
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.documentElement.dataset.hearthRenderChainReady = "true";

      const status = state.optionalFailed.length ? "ready-with-optional-enhancement-failures" : "ready";
      stamp(status);
      exposeReceipt(status);
    } catch (error) {
      mount.dataset.hearthRequiredFailure = "true";
      document.body.dataset.hearthRouteReady = "false";
      document.body.dataset.hearthCanvasAssetLoaded = "false";
      document.documentElement.dataset.hearthRenderChainReady = "false";
      document.documentElement.dataset.hearthRouteControllerError =
        error && error.message ? error.message : String(error);

      stamp("required-chain-error");
      exposeReceipt("required-chain-error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
