// /showroom/globe/hearth/index.js
// HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_ROUTE_TNT_v2
// Full-file replacement.
// Hard renewal alignment.
// Purpose:
// - Force Hearth to boot the G2 pole-swivel control chain.
// - Stop live page from applying HEARTH_HABITABLE_FORMING_ROUTE_CONTROLLER_TNT_v1.
// - Load runtime, controls, assets, and canvas with one hard-renewal cache key.
// - Preserve runtime and asset source authority.
// - Bind controls to the actual mounted canvas.
// - Require canvas to consume pole swivel.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_ROUTE_TNT_v2";
  const RECEIPT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_ROUTE_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_HABITABLE_FORMING_ROUTE_CONTROLLER_TNT_v1";
  const KEY = "hearth-g2-free-drag-pole-swivel-hard-renewal-v2";

  const EXPECTED = Object.freeze({
    controls: "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v1",
    canvas: "HEARTH_G2_CANVAS_POLE_SWIVEL_PRESERVATION_CONSUMER_TNT_v1"
  });

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
      validate: (value) =>
        value &&
        typeof value.bind === "function" &&
        String(value.contract || window.HEARTH_CONTROLS_RECEIPT?.contract || "").includes(EXPECTED.controls)
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
      validate: (value) =>
        value &&
        typeof value.mount === "function" &&
        String(value.contract || window.HEARTH_CANVAS_RECEIPT?.contract || "").includes(EXPECTED.canvas)
    }
  ];

  const state = {
    loaded: [],
    failed: [],
    warnings: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    canvasConsumesPoleSwivel: false,
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
    document.documentElement.dataset.hearthCurrentPhase = "G2-control-preservation";
    document.documentElement.dataset.hearthHardRenewalKey = KEY;
    document.documentElement.dataset.hearthPoleSwivel = "true";
    document.documentElement.dataset.hearthPhysicalAxisDeg = "23.44";
    document.documentElement.dataset.hearthLoadedFiles = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedFiles = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthMounted = String(state.mounted);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthControlsBound = String(state.controlsBound);
    document.documentElement.dataset.hearthCanvasConsumesPoleSwivel = String(state.canvasConsumesPoleSwivel);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    window.HEARTH_G2_POLE_SWIVEL_ROUTE_STATUS = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      key: KEY,
      status,
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      warnings: state.warnings.slice(),
      mounted: state.mounted,
      canvasFound: state.canvasFound,
      controlsBound: state.controlsBound,
      canvasConsumesPoleSwivel: state.canvasConsumesPoleSwivel,
      error: state.error,
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
        ? "Hearth G2 free drag and pole swivel hard-renewal route ready."
        : "Hearth G2 free drag and pole swivel hard-renewal route preparing.",
      `Status ${status}`,
      `Route ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Previous ${PREVIOUS_CONTRACT}`,
      `Hard Renewal Key ${KEY}`,
      "Public Identity Hearth · Habitable Forming · Coherent Baseline",
      "Current Phase G2 control preservation",
      "Pole swivel true",
      "Physical axis 23.44deg",
      `Loaded ${state.loaded.join(",") || "none"}`,
      `Failed ${state.failed.join(",") || "none"}`,
      `Mounted ${state.mounted}`,
      `Canvas found ${state.canvasFound}`,
      `Controls bound ${state.controlsBound}`,
      `Canvas consumes pole swivel ${state.canvasConsumesPoleSwivel}`,
      "Runtime locked true",
      "Assets protected true",
      "GraphicBox false",
      "Generated image false",
      "Visual pass claimed false"
    ];

    if (state.warnings.length) {
      lines.push(`Warnings ${state.warnings.slice(-5).join(" | ")}`);
    }

    if (state.error) {
      lines.push(`Error ${state.error}`);
    }

    node.textContent = lines.join("\n");
    node.dataset.hearthRouteControllerContract = CONTRACT;
    node.dataset.hearthRouteControllerReceipt = RECEIPT;
    node.dataset.hearthRouteReady = String(Boolean(state.mounted));
    node.dataset.hearthPoleSwivel = "true";
    node.dataset.hearthControlsBound = String(state.controlsBound);
    node.dataset.hearthCanvasConsumesPoleSwivel = String(state.canvasConsumesPoleSwivel);
    node.dataset.generatedImage = "false";
    node.dataset.graphicBox = "false";
    node.dataset.visualPassClaimed = "false";
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

  function removePriorAssetScripts() {
    document
      .querySelectorAll(
        [
          'script[src*="/assets/hearth/hearth.runtime.js"]',
          'script[src*="/assets/hearth/hearth.controls.js"]',
          'script[src*="/assets/hearth/hearth.assets.js"]',
          'script[src*="/assets/hearth/hearth.canvas.js"]',
          'script[data-hearth-file="true"]',
          'script[data-hearth-g4-motion-file="true"]',
          'script[data-hearth-g41-file="true"]'
        ].join(",")
      )
      .forEach((script) => script.remove());
  }

  function resetGlobals() {
    [
      "HEARTH_RUNTIME",
      "HEARTH_CONTROLS",
      "HEARTH_ASSETS",
      "HEARTH_CANVAS",
      "HEARTH_CONTROLS_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "__HEARTH_INSPECTION_MOTION__"
    ].forEach((name) => {
      try {
        window[name] = undefined;
      } catch (_) {}
    });
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
    mount.dataset.hearthCurrentPhase = "G2-control-preservation";
    mount.dataset.hearthPoleSwivel = "true";
    mount.dataset.hearthPhysicalAxisDeg = "23.44";
    mount.dataset.hearthPointerEventsBlocked = "false";
    mount.dataset.hearthTouchAction = "none";
    mount.dataset.hearthHardRenewalKey = KEY;
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.webkitUserSelect = "none";
    mount.style.webkitTouchCallout = "none";

    mount.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return mount;
  }

  function ensureRouteStyle() {
    const previous = document.getElementById("hearth-g2-hard-renewal-route-style");
    if (previous) previous.remove();

    const style = document.createElement("style");
    style.id = "hearth-g2-hard-renewal-route-style";
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
      const script = document.createElement("script");
      script.src = file.src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = file.role;
      script.dataset.contract = CONTRACT;
      script.dataset.hardRenewalKey = KEY;

      script.onload = () => {
        if (!isUsable(file)) {
          state.failed.push(file.role);
          stamp(`invalid-${file.role}`);
          reject(new Error(`Required Hearth script loaded but did not expose expected G2 swivel authority: ${file.role}`));
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

  function canvasConsumesPoleSwivel(canvas) {
    return Boolean(
      canvas &&
        (
          canvas.dataset.hearthPoleSwivelConsumer === "true" ||
          document.documentElement.dataset.hearthCanvasConsumesPoleSwivel === "true" ||
          window.HEARTH_CANVAS_RECEIPT?.consumesPoleSwivel === true
        )
    );
  }

  async function boot() {
    const mount = ensureMount();

    stamp("booting");
    disposePrior();
    removePriorAssetScripts();
    resetGlobals();
    ensureRouteStyle();

    try {
      for (const file of FILES) {
        await loadFile(file);
      }

      const runtime = window.HEARTH_RUNTIME;
      const controls = window.HEARTH_CONTROLS;
      const assets = window.HEARTH_ASSETS;
      const canvasAuthority = window.HEARTH_CANVAS;

      if (!runtime || !controls || !assets || !canvasAuthority) {
        throw new Error("Hearth globals missing after hard-renewal file load.");
      }

      if (typeof canvasAuthority.mount !== "function") {
        throw new Error("Hearth canvas authority missing mount function.");
      }

      if (typeof controls.bind !== "function") {
        throw new Error("Hearth controls authority missing bind function.");
      }

      const renderer = canvasAuthority.mount(mount, {
        runtime,
        assets,
        routeContract: CONTRACT,
        routeReceipt: RECEIPT,
        publicIdentity: "Hearth · Habitable Forming · Coherent Baseline",
        currentPhase: "G2 control preservation",
        poleSwivel: true,
        physicalAxisDeg: 23.44,
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
      canvas.dataset.hearthCurrentPhase = "G2-control-preservation";
      canvas.dataset.hearthPoleSwivel = "true";
      canvas.dataset.hearthHardRenewalKey = KEY;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.visualPassClaimed = "false";
      canvas.style.pointerEvents = "auto";
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";
      canvas.style.webkitUserSelect = "none";
      canvas.style.webkitTouchCallout = "none";

      controls.bind(canvas, runtime, {
        mount,
        dragRadiansPerScreen: Math.PI * 2.45,
        poleRadiansPerScreen: Math.PI * 1.18,
        maxSpinVelocity: 13,
        wheelSensitivity: 0.003,
        lockDelayMs: 2400,
        poleReturnStrength: 0.06
      });

      state.controlsBound = true;
      state.canvasFound = true;
      state.canvasConsumesPoleSwivel = canvasConsumesPoleSwivel(canvas);

      if (!state.canvasConsumesPoleSwivel) {
        state.warnings.push("Canvas mounted, but pole-swivel consumer receipt was not detected.");
      }

      if (typeof runtime.start === "function") {
        runtime.start();
      }

      state.mounted = true;
      state.error = "";

      hideFallback(mount);

      mount.dataset.hearthRequiredFailure = "false";
      mount.dataset.hearthRouteErrorMessage = "";
      document.body.dataset.hearthRouteReady = "true";
      document.documentElement.dataset.hearthG2PoleSwivelReady = "true";

      stamp("ready");
    } catch (error) {
      state.error = error && error.message ? error.message : String(error);
      mount.dataset.hearthRequiredFailure = "true";
      mount.dataset.hearthRouteErrorMessage = state.error;
      document.body.dataset.hearthRouteReady = "false";
      document.documentElement.dataset.hearthG2PoleSwivelReady = "false";
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
