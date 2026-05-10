// /showroom/globe/hearth/index.js
// HEARTH_HABITABLE_FORMING_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Route/controller renewal only.
// Purpose:
// - Replace stale G4/G4.1 route identity with Hearth Habitable Forming baseline identity.
// - Preserve the existing working Hearth engine chain.
// - Keep runtime, controls, assets, and canvas files protected.
// - Mount through #hearthCanvasMount.
// - Hide fallback after successful mount.
// - Report honest route status.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_HABITABLE_FORMING_ROUTE_CONTROLLER_TNT_v1";
  const RECEIPT = "HEARTH_HABITABLE_FORMING_ROUTE_RECEIPT";
  const PREVIOUS_CONTRACT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_ROUTE_CONTROLLER_TNT_v1";
  const KEY = "hearth-habitable-forming-route-controller-v1";

  const FILES = [
    {
      role: "runtime",
      src: `/assets/hearth/hearth.runtime.js?v=${KEY}`,
      global: "HEARTH_RUNTIME",
      validate: (value) => value && typeof value.start === "function"
    },
    {
      role: "controls",
      src: `/assets/hearth/hearth.controls.js?v=${KEY}`,
      global: "HEARTH_CONTROLS",
      validate: (value) => value && typeof value.bind === "function"
    },
    {
      role: "assets",
      src: `/assets/hearth/hearth.assets.js?v=${KEY}`,
      global: "HEARTH_ASSETS",
      validate: (value) => Boolean(value)
    },
    {
      role: "canvas",
      src: `/assets/hearth/hearth.canvas.js?v=${KEY}`,
      global: "HEARTH_CANVAS",
      validate: (value) => value && typeof value.mount === "function"
    }
  ];

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    status: "initial",
    error: ""
  };

  function stamp(status) {
    state.status = status;

    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthPublicIdentity = "Hearth Habitable Forming Coherent Baseline";
    document.documentElement.dataset.hearthGenerationBaseline = "G1-coherent-achieved";
    document.documentElement.dataset.hearthCurrentPhase = "habitable-forming";
    document.documentElement.dataset.hearthNextPhase = "G2-material-natural-readability";
    document.documentElement.dataset.hearthFormerMotionRenewal = "folded-into-baseline";
    document.documentElement.dataset.hearthG5Job = "clouds-weather-living-atmosphere-later";
    document.documentElement.dataset.hearthAssetsAdoptAuthority = "false";
    document.documentElement.dataset.hearthAssetsAbsorbAuthority = "false";
    document.documentElement.dataset.hearthAssetsBoundaryExpression = "true";
    document.documentElement.dataset.hearthRuntimeLocked = "true";
    document.documentElement.dataset.hearthControlsLocked = "true";
    document.documentElement.dataset.hearthLoadedFiles = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedFiles = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthMounted = String(state.mounted);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthVisualPassClaimed = "false";

    window.HEARTH_HABITABLE_FORMING_ROUTE_RECEIPT = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      status,
      publicIdentity: "Hearth · Habitable Forming · Coherent Baseline",
      baseline: "G1 coherent achieved",
      currentPhase: "habitable-forming",
      nextPhase: "G2 material definition and natural readability",
      formerMotionRenewal: "folded-into-baseline",
      runtimeLocked: true,
      controlsLocked: true,
      assetsAbsorbAuthority: false,
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      mounted: state.mounted,
      canvasFound: state.canvasFound,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    writeStatus(status);
  }

  function writeStatus(status) {
    const node =
      document.getElementById("hearth-route-status") ||
      document.querySelector("[data-hearth-route-status]");

    if (!node) return;

    const lines = [
      state.mounted
        ? "Hearth habitable-forming route ready."
        : "Hearth habitable-forming route preparing.",
      `Status ${status}`,
      `Route ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Previous ${PREVIOUS_CONTRACT}`,
      "Public Identity Hearth · Habitable Forming · Coherent Baseline",
      "Baseline Generation 1 coherent achieved",
      "Former motion renewal folded into baseline",
      "Next Generation 2 material definition and natural readability",
      "Later Generation 5 clouds/weather/living atmosphere",
      `Loaded ${state.loaded.join(",") || "none"}`,
      `Failed ${state.failed.join(",") || "none"}`,
      `Mounted ${state.mounted}`,
      `Canvas found ${state.canvasFound}`,
      "Runtime locked true",
      "Controls locked true",
      "Assets absorb authority false",
      "GraphicBox false",
      "Generated image false",
      "Visual pass claimed false"
    ];

    if (state.error) {
      lines.push(`Error ${state.error}`);
    }

    node.textContent = lines.join("\n");
    node.dataset.hearthRouteControllerContract = CONTRACT;
    node.dataset.hearthRouteControllerReceipt = RECEIPT;
    node.dataset.hearthRouteReady = String(Boolean(state.mounted));
    node.dataset.hearthCurrentPhase = "habitable-forming";
    node.dataset.hearthGeneratedImage = "false";
    node.dataset.hearthGraphicBox = "false";
    node.dataset.hearthVisualPassClaimed = "false";
  }

  function disposePrior() {
    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__",
      "__HEARTH_CONTROLS_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__"
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
      .querySelectorAll(
        [
          'script[src*="/assets/hearth/hearth.runtime.js"]',
          'script[src*="/assets/hearth/hearth.controls.js"]',
          'script[src*="/assets/hearth/hearth.assets.js"]',
          'script[src*="/assets/hearth/hearth.canvas.js"]',
          'script[data-hearth-file="true"]',
          'script[data-hearth-g41-file="true"]',
          'script[data-hearth-g4-motion-file="true"]'
        ].join(",")
      )
      .forEach((script) => script.remove());
  }

  function ensureMount() {
    let mount =
      document.getElementById("hearthCanvasMount") ||
      document.getElementById("hearth-canvas-mount") ||
      document.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = document.createElement("section");
      const parent =
        document.getElementById("hearth-main") ||
        document.querySelector("main") ||
        document.body;
      parent.appendChild(mount);
    }

    mount.id = "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthGenerationBaseline = "G1-coherent-achieved";
    mount.dataset.hearthCurrentPhase = "habitable-forming";
    mount.dataset.hearthNextPhase = "G2-material-natural-readability";
    mount.dataset.hearthAssetsBoundaryExpression = "true";
    mount.dataset.hearthAssetsAdoptAuthority = "false";
    mount.dataset.hearthAssetsAbsorbAuthority = "false";
    mount.dataset.hearthRuntimeLocked = "true";
    mount.dataset.hearthControlsLocked = "true";
    mount.dataset.hearthPointerEventsBlocked = "false";
    mount.dataset.hearthTouchAction = "none";
    mount.dataset.hearthRequiredFailure = "false";
    mount.dataset.hearthRouteErrorMessage = "";

    mount.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return mount;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-habitable-forming-route-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-habitable-forming-route-style";
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
        background:
          radial-gradient(circle at 50% 50%, rgba(39,117,155,.24), rgba(3,9,20,.96) 70%),
          #02070e;
      }

      #hearthCanvasMount canvas,
      #hearthCanvasMount canvas[data-hearth-canvas="true"],
      #hearthCanvasMount canvas[data-hearth-canvas] {
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

      #hearthCanvasMount [data-hearth-mount-fallback][hidden] {
        display: none !important;
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

  function isUsable(file) {
    try {
      return Boolean(file.validate(window[file.global]));
    } catch (_) {
      return false;
    }
  }

  function loadFile(file) {
    return new Promise((resolve, reject) => {
      if (isUsable(file)) {
        if (!state.loaded.includes(file.role)) state.loaded.push(file.role);
        stamp(`global-ready-${file.role}`);
        resolve(file);
        return;
      }

      try {
        window[file.global] = undefined;
      } catch (_) {}

      const script = document.createElement("script");
      script.src = file.src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = file.role;
      script.dataset.contract = CONTRACT;

      script.onload = () => {
        if (!isUsable(file)) {
          state.failed.push(file.role);
          stamp(`invalid-${file.role}`);
          reject(new Error(`Required Hearth script loaded but did not expose usable global: ${file.role} ${file.src}`));
          return;
        }

        state.loaded.push(file.role);
        stamp(`loaded-${file.role}`);
        resolve(file);
      };

      script.onerror = () => {
        state.failed.push(file.role);
        stamp(`failed-${file.role}`);
        reject(new Error(`Required Hearth script failed: ${file.role} ${file.src}`));
      };

      document.head.appendChild(script);
    });
  }

  function hideFallback(mount) {
    const fallback = mount.querySelector("[data-hearth-mount-fallback]");
    if (!fallback) return;

    fallback.hidden = true;
    fallback.style.display = "none";
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

      const runtime = window.HEARTH_RUNTIME;
      const controls = window.HEARTH_CONTROLS;
      const assets = window.HEARTH_ASSETS;
      const canvasAuthority = window.HEARTH_CANVAS;

      if (!runtime || !controls || !assets || !canvasAuthority) {
        throw new Error("Hearth globals missing after file load.");
      }

      if (typeof canvasAuthority.mount !== "function") {
        throw new Error("Hearth canvas authority missing mount function.");
      }

      const renderer = canvasAuthority.mount(mount, {
        runtime,
        assets,
        routeContract: CONTRACT,
        routeReceipt: RECEIPT,
        publicIdentity: "Hearth · Habitable Forming · Coherent Baseline",
        baseline: "G1 coherent achieved",
        currentPhase: "habitable-forming",
        nextPhase: "G2 material definition and natural readability",
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });

      const canvas =
        (renderer && renderer.canvas) ||
        (renderer instanceof HTMLCanvasElement ? renderer : null) ||
        mount.querySelector("canvas");

      if (!canvas) {
        throw new Error("Hearth canvas authority mounted but no canvas was found.");
      }

      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthRouteControllerContract = CONTRACT;
      canvas.dataset.hearthRouteControllerReceipt = RECEIPT;
      canvas.dataset.hearthCurrentPhase = "habitable-forming";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.visualPassClaimed = "false";

      controls.bind(canvas, runtime, {
        mount,
        dragRadiansPerScreen: Math.PI * 2.1,
        maxSpinVelocity: 11,
        wheelSensitivity: 0.003
      });

      runtime.start();

      state.mounted = true;
      state.canvasFound = true;
      state.error = "";

      hideFallback(mount);

      mount.dataset.hearthRequiredFailure = "false";
      mount.dataset.hearthRouteErrorMessage = "";
      document.body.dataset.hearthRouteReady = "true";
      document.documentElement.dataset.hearthHabitableFormingReady = "true";

      stamp("ready");
    } catch (error) {
      const message = error && error.message ? error.message : String(error);

      state.error = message;
      mount.dataset.hearthRequiredFailure = "true";
      mount.dataset.hearthRouteErrorMessage = message;
      document.body.dataset.hearthRouteReady = "false";
      document.documentElement.dataset.hearthHabitableFormingReady = "false";

      stamp("failed");
    }
  }

  window.__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__ = () => {
    if (typeof window.__HEARTH_CONTROLS_DISPOSE__ === "function") {
      window.__HEARTH_CONTROLS_DISPOSE__();
    }

    if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") {
      window.__HEARTH_CANVAS_DISPOSE__();
    }
  };

  window.__HEARTH_G4_ROUTE_DISPOSE__ = window.__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
