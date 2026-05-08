// /showroom/globe/hearth/index.js
// HEARTH_ROUTE_HTML_JS_PAIR_RENEWAL_TNT_v1
// Full-file replacement.
// Purpose:
// - Pair with /showroom/globe/hearth/index.html.
// - Prove live route controller presence.
// - Preserve route shell ownership.
// - Load /assets/hearth/hearth.canvas.js into the explicit upper mount.
// - Prevent duplicate lower Hearth frames.
// - No JPG. No NASA asset. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_HTML_JS_PAIR_RENEWAL_TNT_v1";
  const VERSION = "2026-05-08.hearth-route-html-js-pair-renewal";
  const RECEIPT = "HEARTH_ROUTE_CONTROLLER_RECEIPT";
  const CANVAS_SRC = "/assets/hearth/hearth.canvas.js?v=hearth-route-html-js-pair-renewal-v1";

  const state = {
    booted: false,
    mount: null,
    canvasScript: null
  };

  function stampRoot(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthDuplicateFrameAllowed = "false";
  }

  function removeDuplicateHearthFrames() {
    const protectedMount = document.getElementById("hearthCanvasMount");

    document
      .querySelectorAll(
        [
          ".hearth-g2-shell",
          ".hearth-js-fallback-mount",
          "[data-hearth-fallback-mount]",
          "[data-hearth-adopted-frame]",
          "canvas[data-hearth-canvas]"
        ].join(",")
      )
      .forEach((node) => {
        if (!node || !node.parentElement) return;
        if (protectedMount && protectedMount.contains(node)) return;
        if (protectedMount === node) return;

        const shell =
          node.classList && node.classList.contains("hearth-g2-shell")
            ? node
            : node.closest(".hearth-g2-shell");

        if (shell && shell.parentElement && protectedMount !== shell && !protectedMount?.contains(shell)) {
          shell.remove();
          return;
        }

        if (node.matches && node.matches("canvas[data-hearth-canvas]")) {
          node.remove();
        }
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
      mount.dataset.contract = CONTRACT;
      mount.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";
      mount.dataset.hearthMountReady = "true";
      mount.setAttribute("aria-label", "Hearth canvas render mount");
      main.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";

    return mount;
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

      #hearthCanvasMount canvas[data-hearth-canvas],
      #hearthCanvasMount canvas[data-hearth-canvas="true"],
      #hearthCanvasMount canvas[data-hearth-canvas="g2"] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }

      body[data-hearth-route-ready="true"] #hearthCanvasMount {
        outline: none;
      }
    `;

    document.head.appendChild(style);
  }

  function loadCanvasAsset() {
    const existing = document.querySelector('script[data-hearth-canvas-script="true"]');
    if (existing) {
      state.canvasScript = existing;
      return;
    }

    const script = document.createElement("script");
    script.src = CANVAS_SRC;
    script.defer = true;
    script.dataset.hearthCanvasScript = "true";
    script.dataset.contract = CONTRACT;
    script.dataset.renderOwner = "/assets/hearth/hearth.canvas.js";

    script.addEventListener("load", () => {
      stampRoot("canvas-asset-loaded");
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.body.dataset.hearthRouteReady = "true";
      removeDuplicateHearthFrames();
    });

    script.addEventListener("error", () => {
      stampRoot("canvas-asset-error");
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
    stampRoot("booting");
    installRouteStyle();

    const mount = ensureMount();
    state.mount = mount;

    removeDuplicateHearthFrames();
    exposeReceipt();
    loadCanvasAsset();

    stampRoot("route-controller-ready");
    document.body.dataset.hearthRouteReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
