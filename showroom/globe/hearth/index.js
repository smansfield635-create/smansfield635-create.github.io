// /showroom/globe/hearth/index.js
// HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_ROUTE_CONTROLLER_TNT_v1

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_ROUTE_CONTROLLER_TNT_v1";
  const RECEIPT = "HEARTH_G4_1_ROUTE_ASSET_BOUNDARY_RECEIPT";
  const KEY = "hearth-g4-1-asset-boundary-expression-v1";

  const FILES = [
    { role: "runtime", src: `/assets/hearth/hearth.runtime.js?v=${KEY}`, global: "HEARTH_RUNTIME" },
    { role: "controls", src: `/assets/hearth/hearth.controls.js?v=${KEY}`, global: "HEARTH_CONTROLS" },
    { role: "assets", src: `/assets/hearth/hearth.assets.js?v=${KEY}`, global: "HEARTH_ASSETS" },
    { role: "canvas", src: `/assets/hearth/hearth.canvas.js?v=${KEY}`, global: "HEARTH_CANVAS" }
  ];

  const state = {
    loaded: [],
    failed: [],
    mounted: false
  };

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthGeneration = "G4.1";
    document.documentElement.dataset.hearthG4Job = "motion-authority-renewal";
    document.documentElement.dataset.hearthG41Job = "asset-boundary-expression-renewal";
    document.documentElement.dataset.hearthG5Job = "clouds-weather-living-atmosphere";
    document.documentElement.dataset.hearthProcess = "deduced-reassigned-renewed";
    document.documentElement.dataset.hearthAssetsAdoptAuthority = "false";
    document.documentElement.dataset.hearthAssetsBoundaryExpression = "true";
    document.documentElement.dataset.hearthRuntimeLocked = "true";
    document.documentElement.dataset.hearthControlsLocked = "true";
    document.documentElement.dataset.hearthLoadedFiles = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedFiles = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthVisualPassClaimed = "false";

    window.HEARTH_G4_1_ROUTE_RECEIPT = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      status,
      generation: "G4.1",
      g4Job: "motion-authority-renewal",
      g41Job: "asset-boundary-expression-renewal",
      g5Job: "clouds-weather-living-atmosphere",
      assetsAdoptAuthority: false,
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      mounted: state.mounted,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function disposePrior() {
    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_CONTROLS_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__"
    ].forEach((name) => {
      if (typeof window[name] === "function") {
        try { window[name](); } catch (_) {}
      }
      try { window[name] = null; } catch (_) {}
    });
  }

  function removePriorScripts() {
    document.querySelectorAll([
      'script[src*="/assets/hearth/hearth.runtime.js"]',
      'script[src*="/assets/hearth/hearth.controls.js"]',
      'script[src*="/assets/hearth/hearth.assets.js"]',
      'script[src*="/assets/hearth/hearth.canvas.js"]',
      'script[data-hearth-g41-file="true"]',
      'script[data-hearth-g4-motion-file="true"]'
    ].join(",")).forEach((script) => script.remove());
  }

  function ensureMount() {
    let mount = document.getElementById("hearthCanvasMount");

    if (!mount) {
      mount = document.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
      parent.appendChild(mount);
    }

    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthGeneration = "G4.1";
    mount.dataset.hearthAssetsBoundaryExpression = "true";
    mount.dataset.hearthAssetsAdoptAuthority = "false";
    mount.dataset.hearthRuntimeLocked = "true";
    mount.dataset.hearthControlsLocked = "true";
    mount.dataset.hearthPointerEventsBlocked = "false";
    mount.dataset.hearthTouchAction = "none";
    mount.dataset.hearthRequiredFailure = "false";
    mount.dataset.hearthRouteErrorMessage = "";

    return mount;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-g4-1-asset-boundary-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g4-1-asset-boundary-style";
    style.textContent = `
      #hearthCanvasMount {
        position: relative;
        width: 100%;
        min-height: 320px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        isolation: isolate;
        border-radius: 32px;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        background: radial-gradient(circle at 50% 50%, rgba(39,117,155,.24), rgba(3,9,20,.96) 70%);
      }

      #hearthCanvasMount canvas[data-hearth-canvas="true"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: auto !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
      }

      #hearthCanvasMount[data-hearth-required-failure="true"]::after {
        content: attr(data-hearth-route-error-message);
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        padding: 14px 16px;
        border: 1px solid rgba(231,188,105,.58);
        border-radius: 18px;
        background: rgba(4,10,20,.94);
        color: #e7bc69;
        font: 800 14px/1.4 system-ui, sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  function loadFile(file) {
    return new Promise((resolve, reject) => {
      if (window[file.global]) {
        state.loaded.push(file.role);
        resolve(file);
        return;
      }

      const script = document.createElement("script");
      script.src = file.src;
      script.defer = true;
      script.dataset.hearthG41File = "true";
      script.dataset.hearthFileRole = file.role;
      script.dataset.contract = CONTRACT;

      script.onload = () => {
        state.loaded.push(file.role);
        stamp(`loaded-${file.role}`);
        resolve(file);
      };

      script.onerror = () => {
        state.failed.push(file.role);
        stamp(`failed-${file.role}`);
        reject(new Error(`Required Hearth G4.1 script failed: ${file.role} ${file.src}`));
      };

      document.head.appendChild(script);
    });
  }

  async function boot() {
    const mount = ensureMount();

    stamp("booting");
    disposePrior();
    removePriorScripts();
    installStyle();

    try {
      for (const file of FILES) {
        await loadFile(file);
      }

      if (!window.HEARTH_RUNTIME || !window.HEARTH_CONTROLS || !window.HEARTH_ASSETS || !window.HEARTH_CANVAS) {
        throw new Error("Hearth G4.1 globals missing after file load.");
      }

      const runtime = window.HEARTH_RUNTIME;
      const renderer = window.HEARTH_CANVAS.mount(mount, {
        runtime,
        assets: window.HEARTH_ASSETS
      });

      const canvas = renderer.canvas;

      window.HEARTH_CONTROLS.bind(canvas, runtime, {
        mount,
        dragRadiansPerScreen: Math.PI * 2.1,
        maxSpinVelocity: 11,
        wheelSensitivity: 0.003
      });

      runtime.start();

      state.mounted = true;
      mount.dataset.hearthRequiredFailure = "false";
      mount.dataset.hearthRouteErrorMessage = "";
      document.body.dataset.hearthRouteReady = "true";
      document.documentElement.dataset.hearthG41AssetBoundaryReady = "true";

      stamp("ready");
    } catch (error) {
      mount.dataset.hearthRequiredFailure = "true";
      mount.dataset.hearthRouteErrorMessage = error && error.message ? error.message : String(error);
      document.body.dataset.hearthRouteReady = "false";
      document.documentElement.dataset.hearthG41AssetBoundaryReady = "false";
      stamp("failed");
    }
  }

  window.__HEARTH_G4_ROUTE_DISPOSE__ = () => {
    if (typeof window.__HEARTH_CONTROLS_DISPOSE__ === "function") window.__HEARTH_CONTROLS_DISPOSE__();
    if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") window.__HEARTH_CANVAS_DISPOSE__();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
