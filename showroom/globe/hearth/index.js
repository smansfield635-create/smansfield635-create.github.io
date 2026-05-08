// /showroom/globe/hearth/index.js
// HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1
// Full-file replacement.
// Purpose:
// - Pair with /showroom/globe/hearth/index.html.
// - Restore Hearth route controller.
// - Load the advanced Hearth G2 canvas model.
// - Prevent Earth placeholder bleed.
// - Prevent duplicate lower Hearth frames.
// - No JPG. No NASA asset. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1";
  const VERSION = "2026-05-08.hearth-g2-model-restore";
  const RECEIPT = "HEARTH_G2_MODEL_RESTORE_ROUTE_RECEIPT";
  const CANVAS_SRC = "/assets/hearth/hearth.canvas.js?v=hearth-g2-model-restore-v1";

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
    document.documentElement.dataset.hearthExpectedRoute = "/showroom/globe/hearth/";
    document.documentElement.dataset.hearthHtmlOwner = "/showroom/globe/hearth/index.html";
    document.documentElement.dataset.hearthJsOwner = "/showroom/globe/hearth/index.js";
    document.documentElement.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthEarthPlaceholder = "false";
    document.documentElement.dataset.hearthDuplicateFrameAllowed = "false";
  }

  function callKnownDisposers() {
    const names = [
      "__HEARTH_G2_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_CANVAS_G2_DISPOSE__"
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
      mount.dataset.hearthRender = "";
      mount.dataset.render = "hearth";
      mount.dataset.planet = "hearth";
      mount.dataset.body = "hearth";
      mount.setAttribute("aria-label", "Hearth G2 canvas model mount");
      main.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.earthPlaceholder = "false";

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
      "canvas[data-hearth-canvas]"
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

      if (node.matches && (node.matches("canvas[data-hearth-canvas]") || node.matches("canvas[data-earth-canvas]"))) {
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
      #hearthCanvasMount {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 280px;
        overflow: hidden;
        isolation: isolate;
      }

      #hearthCanvasMount canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        touch-action: manipulation;
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

  function exposeReceipt() {
    window.HEARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: "/showroom/globe/hearth/",
      htmlOwner: "/showroom/globe/hearth/index.html",
      jsOwner: "/showroom/globe/hearth/index.js",
      renderOwner: "/assets/hearth/hearth.canvas.js",
      mount: "#hearthCanvasMount",
      earthPlaceholder: false,
      duplicateFrameAllowed: false,
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      status: "booted"
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

    cleanupStrayFrames();
    exposeReceipt();
    loadCanvasAsset();

    stamp("route-controller-ready");
    document.body.dataset.hearthRouteReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
