// /showroom/globe/hearth/index.js
// HEARTH_G3_10_CHAIN_ALIGNMENT_SUPERCESSION_ROUTE_TNT_v1
// Full-file replacement.
// Purpose:
// - Replace obsolete G2 Hearth route controller.
// - Load current Hearth canvas through a G3.10 chain-aligned cache key.
// - Retire G2 route/cache authority from live boot path.
// - Preserve terrain and hydration as downstream asset authorities.
// - No visual math. No terrain rewrite. No hydration rewrite.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_10_CHAIN_ALIGNMENT_SUPERCESSION_ROUTE_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-10-chain-alignment-route";
  const RECEIPT = "HEARTH_G3_10_CHAIN_ALIGNMENT_ROUTE_RECEIPT";

  const CANVAS_SRC = "/assets/hearth/hearth.canvas.js?v=hearth-g3-10-chain-aligned-canvas-bind-v1";
  const TERRAIN_OWNER = "/assets/hearth/hearth.terrain.js";
  const HYDRATION_OWNER = "/assets/hearth/hearth.hydration.js";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const RETIRED_KEYS = Object.freeze([
    "HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1",
    "hearth-g2-model-restore-v1",
    "hearth-g3-7-hydration-engine"
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

    document.documentElement.dataset.hearthHtmlOwner = "/showroom/globe/hearth/index.html";
    document.documentElement.dataset.hearthJsOwner = "/showroom/globe/hearth/index.js";
    document.documentElement.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    document.documentElement.dataset.hearthTerrainOwner = TERRAIN_OWNER;
    document.documentElement.dataset.hearthHydrationOwner = HYDRATION_OWNER;

    document.documentElement.dataset.hearthGeneration = "G3.10-chain";
    document.documentElement.dataset.hearthGenerationFocus = "contract-cache-chain-alignment";
    document.documentElement.dataset.hearthG2Retired = "true";
    document.documentElement.dataset.hearthG37HydrationRetired = "true";
    document.documentElement.dataset.hearthCanvasSrc = CANVAS_SRC;

    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthEarthPlaceholder = "false";
    document.documentElement.dataset.hearthAudraliaMap = "false";
    document.documentElement.dataset.hearthDuplicateFrameAllowed = "false";
  }

  function callKnownDisposers() {
    const names = [
      "__HEARTH_CANVAS_G3_10_DISPOSE__",
      "__HEARTH_CANVAS_G3_9_DISPOSE__",
      "__HEARTH_CANVAS_G3_8_DISPOSE__",
      "__HEARTH_CANVAS_G3_7_DISPOSE__",
      "__HEARTH_CANVAS_G3_6_DISPOSE__",
      "__HEARTH_CANVAS_G3_5_DISPOSE__",
      "__HEARTH_CANVAS_G3_4_DISPOSE__",
      "__HEARTH_CANVAS_G3_3_DISPOSE__",
      "__HEARTH_CANVAS_G3_2_DISPOSE__",
      "__HEARTH_CANVAS_G3_1_DISPOSE__",
      "__HEARTH_CANVAS_G3_DISPOSE__",
      "__HEARTH_CANVAS_G4_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_CANVAS_G2_DISPOSE__",
      "__HEARTH_G2_DISPOSE__"
    ];

    names.forEach((name) => {
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
      const main = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthMount = "";
      mount.dataset.render = "hearth";
      mount.dataset.planet = "hearth";
      mount.dataset.body = "hearth";
      mount.setAttribute("aria-label", "Hearth G3.10 chain-aligned canvas mount");
      main.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.terrainOwner = TERRAIN_OWNER;
    mount.dataset.hydrationOwner = HYDRATION_OWNER;
    mount.dataset.hearthGeneration = "G3.10-chain";
    mount.dataset.hearthG2Retired = "true";
    mount.dataset.hearthG37HydrationRetired = "true";
    mount.dataset.earthPlaceholder = "false";
    mount.dataset.audraliaMap = "false";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";

    return mount;
  }

  function cleanupStrayFrames() {
    const protectedMount = document.getElementById("hearthCanvasMount");

    const selectors = [
      ".hearth-g2-shell",
      ".hearth-js-fallback-mount",
      "[data-hearth-fallback-mount]",
      "[data-hearth-adopted-frame]",
      "[data-earth-canvas]",
      "canvas[data-earth-canvas]",
      "canvas[data-hearth-canvas]",
      "[data-contract='HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1']"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((node) => {
      if (!node || !node.parentElement) return;
      if (protectedMount && (node === protectedMount || protectedMount.contains(node))) return;

      const shell =
        node.classList && node.classList.contains("hearth-g2-shell")
          ? node
          : node.closest && node.closest(".hearth-g2-shell");

      if (shell && shell.parentElement && shell !== protectedMount && !protectedMount?.contains(shell)) {
        shell.remove();
        return;
      }

      if (
        node.matches &&
        (
          node.matches("canvas[data-hearth-canvas]") ||
          node.matches("canvas[data-earth-canvas]") ||
          node.matches("[data-contract='HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1']")
        )
      ) {
        node.remove();
      }
    });
  }

  function removePriorCanvasScripts() {
    document
      .querySelectorAll('script[src*="/assets/hearth/hearth.canvas.js"], script[data-hearth-canvas-script="true"]')
      .forEach((script) => script.remove());
  }

  function installRouteStyle() {
    const prior = document.getElementById("hearth-route-controller-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-route-controller-style";
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

      body[data-hearth-route-ready="true"] #hearthCanvasMount {
        outline: none;
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
    script.dataset.generation = "G3.10-chain";

    script.addEventListener("load", () => {
      stamp("canvas-asset-loaded");
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.body.dataset.hearthRouteReady = "true";
      cleanupStrayFrames();
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
      terrainOwner: TERRAIN_OWNER,
      hydrationOwner: HYDRATION_OWNER,
      canvasSrc: CANVAS_SRC,
      mount: "#hearthCanvasMount",
      generation: "G3.10-chain",
      retiredKeys: RETIRED_KEYS,
      g2RouteRetired: true,
      g2CanvasCacheRetired: true,
      g37HydrationCacheRetired: true,
      earthPlaceholder: false,
      audraliaMap: false,
      duplicateFrameAllowed: false,
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false,
      status
    });
  }

  function assertNoRetiredLiveScripts() {
    const offenders = [];

    document.querySelectorAll("script[src]").forEach((script) => {
      const src = script.getAttribute("src") || "";

      RETIRED_KEYS.forEach((key) => {
        if (src.includes(key)) offenders.push(src);
      });
    });

    document.documentElement.dataset.hearthRetiredScriptOffenders = offenders.length ? offenders.join(" | ") : "none";
    document.documentElement.dataset.hearthRetiredScriptOffenderCount = String(offenders.length);

    return offenders;
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

    cleanupStrayFrames();
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
