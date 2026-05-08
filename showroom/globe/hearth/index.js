// /showroom/globe/hearth/index.js
// HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Purpose:
// - Load the first true Hearth G3 standard.
// - Retire prior globe-render / shell / visual fallback contracts from live authority.
// - Keep "globe" as route language only.
// - Load one active planet construction canvas.
// - No hydration, mountains, weather, climate, clouds, humidity, or atmospheric moisture.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_ROUTE_CONTROLLER_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-definitive-landmass-zoning-route-controller";
  const RECEIPT = "HEARTH_G3_DEFINITIVE_LANDMASS_AND_ZONING_ROUTE_RECEIPT";

  const CANVAS_SRC = "/assets/hearth/hearth.canvas.js?v=hearth-g3-definitive-landmass-zoning-standard-v1";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const RETIRED_CONTRACT_MARKERS = Object.freeze([
    "HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1",
    "HEARTH_G3_VISIBLE_PLANET_EXECUTION_RESTORE_TNT_v2",
    "HEARTH_G3_PLANET_BODY_SINGLE_DRAW_PATH_FULL_REPLACEMENT_TNT_v1",
    "hearth-g2-model-restore",
    "hearth-g3-visible-planet",
    "hearth-g3-10-chain-aligned",
    "hearth-g3-7-hydration",
    "model-restore",
    "visible-planet-execution-restore",
    "single-draw-path"
  ]);

  const state = {
    booted: false,
    mount: null,
    canvasScript: null
  };

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthExpectedRoute = EXPECTED_ROUTE;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "definitive-landmass-and-zoning";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthCanvasSrc = CANVAS_SRC;
    document.documentElement.dataset.hearthPriorGlobeContractRetired = "true";
    document.documentElement.dataset.hearthHydrationDeferred = "true";
    document.documentElement.dataset.hearthTerrainDetailDeferred = "true";
    document.documentElement.dataset.hearthMountainsDeferred = "true";
    document.documentElement.dataset.hearthWeatherClimateCloudsDeferred = "true";
    document.documentElement.dataset.hearthHumidityDeferred = "true";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
  }

  function callKnownDisposers() {
    [
      "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
      "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
      "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
      "__HEARTH_CANVAS_G3_DISPOSE__",
      "__HEARTH_CANVAS_G3_10_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
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

  function ensureMount() {
    let mount = document.getElementById("hearthCanvasMount");

    if (!mount) {
      const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthMount = "true";
      mount.dataset.render = "hearth";
      mount.dataset.body = "hearth";
      mount.setAttribute("aria-label", "Hearth G3 definitive landmass and zoning mount");
      parent.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.hearthGeneration = "G3";
    mount.dataset.hearthStandard = "definitive-landmass-and-zoning";
    mount.dataset.hearthLanguageLayer = "globe";
    mount.dataset.hearthConstructionLayer = "planet";
    mount.dataset.hearthHydrationDeferred = "true";
    mount.dataset.hearthTerrainDetailDeferred = "true";
    mount.dataset.hearthMountainsDeferred = "true";
    mount.dataset.hearthWeatherClimateCloudsDeferred = "true";
    mount.dataset.hearthGeneratedImage = "false";
    mount.dataset.hearthGraphicBox = "false";

    return mount;
  }

  function cleanupRetiredFrames() {
    const protectedMount = document.getElementById("hearthCanvasMount");

    const selectors = [
      ".hearth-g2-shell",
      ".hearth-js-fallback-mount",
      "[data-hearth-fallback-mount]",
      "[data-hearth-adopted-frame]",
      "[data-contract='HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1']",
      "canvas[data-earth-canvas]",
      "canvas[data-hearth-canvas]"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((node) => {
      if (!node || !node.parentElement) return;
      if (protectedMount && (node === protectedMount || protectedMount.contains(node))) return;
      node.remove();
    });
  }

  function removePriorCanvasScripts() {
    document
      .querySelectorAll('script[src*="/assets/hearth/hearth.canvas.js"], script[data-hearth-canvas-script="true"]')
      .forEach((script) => script.remove());
  }

  function installRouteStyle() {
    const prior = document.getElementById("hearth-g3-zoning-route-controller-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-zoning-route-controller-style";
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
        height: 100%;
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

  function loadCanvasAsset() {
    removePriorCanvasScripts();

    const script = document.createElement("script");
    script.src = CANVAS_SRC;
    script.defer = true;
    script.dataset.hearthCanvasScript = "true";
    script.dataset.contract = CONTRACT;
    script.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";
    script.dataset.generation = "G3";
    script.dataset.standard = "definitive-landmass-and-zoning";

    script.addEventListener("load", () => {
      stamp("canvas-asset-loaded");
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.body.dataset.hearthRouteReady = "true";
      cleanupRetiredFrames();
      assertNoRetiredLiveScripts();
    });

    script.addEventListener("error", () => {
      stamp("canvas-asset-error");
      document.body.dataset.hearthCanvasAssetLoaded = "false";
      document.body.dataset.hearthRouteReady = "false";

      if (state.mount) {
        state.mount.dataset.hearthCanvasLoadError = CANVAS_SRC;
      }
    });

    document.head.appendChild(script);
    state.canvasScript = script;
  }

  function assertNoRetiredLiveScripts() {
    const offenders = [];

    document.querySelectorAll("script[src]").forEach((script) => {
      const src = script.getAttribute("src") || "";
      RETIRED_CONTRACT_MARKERS.forEach((marker) => {
        if (src.includes(marker)) offenders.push(src);
      });
    });

    document.documentElement.dataset.hearthRetiredScriptOffenderCount = String(offenders.length);
    document.documentElement.dataset.hearthRetiredScriptOffenders = offenders.length ? offenders.join(" | ") : "none";

    return offenders;
  }

  function exposeReceipt(status = "booted") {
    window.HEARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: EXPECTED_ROUTE,
      htmlOwner: "/showroom/globe/hearth/index.html",
      jsOwner: "/showroom/globe/hearth/index.js",
      renderOwner: "/assets/hearth/hearth.canvas.js",
      canvasSrc: CANVAS_SRC,
      generation: "G3",
      standard: "definitive-landmass-and-zoning",
      languageLayer: "globe",
      constructionLayer: "planet",
      retiredContracts: [
        "old globe-render contract",
        "old shell/model-restore contract",
        "old visible-planet fallback contract",
        "old hydration-first path",
        "old terrain-expression-first path",
        "old mountain-first path"
      ],
      allowed: [
        "planet body",
        "definitive landmasses",
        "land/water boundary",
        "regions",
        "countries",
        "states/provinces",
        "city-zone seats"
      ],
      deferred: [
        "hydration",
        "rivers",
        "mountains",
        "terrain detail",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      externalImages: false,
      generatedImage: false,
      graphicBox: false,
      status
    });
  }

  function boot() {
    if (state.booted) return;
    state.booted = true;

    stamp("booting");
    callKnownDisposers();
    installRouteStyle();

    const mount = ensureMount();
    mount.replaceChildren();
    state.mount = mount;

    cleanupRetiredFrames();
    exposeReceipt("route-controller-ready");
    loadCanvasAsset();

    const offenders = assertNoRetiredLiveScripts();
    stamp(offenders.length ? "route-ready-with-retired-script-warning" : "route-controller-ready");
    document.body.dataset.hearthRouteReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
