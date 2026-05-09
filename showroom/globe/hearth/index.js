// /showroom/globe/hearth/index.js
// HEARTH_G3_256_LATTICE_CHILD_ENGINE_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Load Hearth parent terrain, hydration, child engines, islands, and canvas in lawful order.
// - terrain -> hydration -> mountains -> cliffs -> valleys -> beaches -> islands -> canvas.
// - No GraphicBox. No image generation.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_ROUTE_CONTROLLER_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-09.hearth-g3-256-lattice-child-engine-route-controller";
  const RECEIPT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_ROUTE_RECEIPT";

  const KEY = "hearth-g3-256-lattice-child-engines-v1";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const SOURCES = Object.freeze([
    { role: "terrain", src: `/assets/hearth/hearth.terrain.js?v=${KEY}`, required: true },
    { role: "hydration", src: `/assets/hearth/hearth.hydration.js?v=${KEY}`, required: false },
    { role: "mountains", src: `/assets/hearth/hearth.mountains.js?v=${KEY}`, required: true },
    { role: "cliffs", src: `/assets/hearth/hearth.cliffs.js?v=${KEY}`, required: true },
    { role: "valleys", src: `/assets/hearth/hearth.valleys.js?v=${KEY}`, required: true },
    { role: "beaches", src: `/assets/hearth/hearth.beaches.js?v=${KEY}`, required: true },
    { role: "islands", src: `/assets/hearth/hearth.islands.js?v=${KEY}`, required: false },
    { role: "canvas", src: `/assets/hearth/hearth.canvas.js?v=${KEY}`, required: true }
  ]);

  const state = {
    booted: false,
    loaded: [],
    failed: []
  };

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthExpectedRoute = EXPECTED_ROUTE;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "256-lattice-child-engine-chain";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthRouteLoadKey = KEY;
    document.documentElement.dataset.hearthChildEngineOrder =
      "terrain,hydration,mountains,cliffs,valleys,beaches,islands,canvas";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthActiveWeatherExcluded = "true";
    document.documentElement.dataset.hearthCloudsExcluded = "true";
    document.documentElement.dataset.hearthHumidityExcluded = "true";
  }

  function callKnownDisposers() {
    [
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
        'script[data-hearth-child-engine-script="true"]'
      ].join(","))
      .forEach((script) => script.remove());
  }

  function installRouteStyle() {
    const prior = document.getElementById("hearth-child-engine-route-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-child-engine-route-style";
    style.textContent = `
      html,
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
      }

      #hearthCanvasMount {
        position: relative;
        width: 100%;
        min-height: 300px;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
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
    `;

    document.head.appendChild(style);
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
      mount.setAttribute("aria-label", "Hearth G3 256 lattice child-engine mount");
      parent.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.hearthGeneration = "G3";
    mount.dataset.hearthStandard = "256-lattice-child-engine-chain";
    mount.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    mount.dataset.hearthMountainOwner = "/assets/hearth/hearth.mountains.js";
    mount.dataset.hearthCliffOwner = "/assets/hearth/hearth.cliffs.js";
    mount.dataset.hearthValleyOwner = "/assets/hearth/hearth.valleys.js";
    mount.dataset.hearthBeachOwner = "/assets/hearth/hearth.beaches.js";
    mount.dataset.hearthIslandOwner = "/assets/hearth/hearth.islands.js";
    mount.dataset.hearthGeneratedImage = "false";
    mount.dataset.hearthGraphicBox = "false";

    return mount;
  }

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source.src;
      script.defer = true;
      script.dataset.hearthChildEngineScript = "true";
      script.dataset.hearthScriptRole = source.role;
      script.dataset.contract = CONTRACT;
      script.dataset.familyContract = FAMILY_CONTRACT;

      script.addEventListener(
        "load",
        () => {
          state.loaded.push(source.role);
          document.documentElement.dataset[`hearth${source.role[0].toUpperCase()}${source.role.slice(1)}ScriptLoaded`] =
            "true";
          resolve(script);
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => {
          state.failed.push(source.role);
          document.documentElement.dataset[`hearth${source.role[0].toUpperCase()}${source.role.slice(1)}ScriptLoaded`] =
            "false";
          const error = new Error(`Failed to load ${source.role}: ${source.src}`);
          if (source.required) reject(error);
          else resolve(script);
        },
        { once: true }
      );

      document.head.appendChild(script);
    });
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
      standard: "256-lattice-child-engine-chain",
      loadOrder: SOURCES.map((source) => ({
        role: source.role,
        src: source.src,
        required: source.required
      })),
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      status
    });
  }

  async function boot() {
    if (state.booted) return;
    state.booted = true;

    stamp("booting");
    callKnownDisposers();
    removePriorScripts();
    installRouteStyle();
    ensureMount();
    exposeReceipt("booting");

    try {
      for (const source of SOURCES) {
        stamp(`loading-${source.role}`);
        await loadScript(source);
      }

      stamp(state.failed.length ? "ready-with-optional-warnings" : "ready");
      exposeReceipt(state.failed.length ? "ready-with-optional-warnings" : "ready");
      document.body.dataset.hearthRouteReady = "true";
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.documentElement.dataset.hearthChildEnginesLoaded = "true";
      document.documentElement.dataset.hearthChildEngineFailures = state.failed.length ? state.failed.join(",") : "none";
    } catch (error) {
      stamp("error");
      exposeReceipt("error");
      document.body.dataset.hearthRouteReady = "false";
      document.body.dataset.hearthCanvasAssetLoaded = "false";
      document.documentElement.dataset.hearthRouteControllerError =
        error && error.message ? error.message : String(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
