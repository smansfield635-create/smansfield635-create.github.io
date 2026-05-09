// /showroom/globe/hearth/index.js
// HEARTH_G4_AUTHORITY_REASSIGNMENT_AND_MOTION_ROUTE_CONTROLLER_TNT_v1
// Full-file replacement.
// Deduced -> Reassigned -> Renewed.
// Purpose:
// - Install G4 motion renewal without treating canvas as runtime.
// - Keep source truth files outside runtime.
// - Load Runtime as South Star motion authority.
// - Load Controls as drag/spin/finger-sensitivity input feed.
// - Load Canvas/World Engine as truth substrate + render host.
// - Unblock pointer/touch input.
// - Move clouds/weather to G5 readiness only.
// - No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_AUTHORITY_REASSIGNMENT_AND_MOTION_ROUTE_CONTROLLER_TNT_v1";
  const RECEIPT = "HEARTH_G4_AUTHORITY_REASSIGNMENT_ROUTE_RECEIPT";
  const VERSION = "2026-05-09.hearth-g4-authority-reassignment-motion-renewal-v1";
  const KEY = "hearth-g4-authority-reassignment-motion-renewal-v1";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const SOURCE_TRUTH_NONBLOCKING = Object.freeze([
    { role: "hex", src: `/assets/hearth/hearth.hex.js?v=${KEY}`, globalName: "HEARTH_HEX" },
    { role: "terrain", src: `/assets/hearth/hearth.terrain.js?v=${KEY}`, globalName: "HEARTH_TERRAIN" },
    { role: "hydration", src: `/assets/hearth/hearth.hydration.js?v=${KEY}`, globalName: "HEARTH_HYDRATION" },
    { role: "mountains", src: `/assets/hearth/hearth.mountains.js?v=${KEY}`, globalName: "HEARTH_MOUNTAINS" },
    { role: "cliffs", src: `/assets/hearth/hearth.cliffs.js?v=${KEY}`, globalName: "HEARTH_CLIFFS" },
    { role: "valleys", src: `/assets/hearth/hearth.valleys.js?v=${KEY}`, globalName: "HEARTH_VALLEYS" },
    { role: "beaches", src: `/assets/hearth/hearth.beaches.js?v=${KEY}`, globalName: "HEARTH_BEACHES" },
    { role: "islands", src: `/assets/hearth/hearth.islands.js?v=${KEY}`, globalName: "HEARTH_ISLANDS" },
    { role: "hexSurface", src: `/assets/hearth/hearth.hex.surface.js?v=${KEY}`, globalName: "HEARTH_HEX_SURFACE" }
  ]);

  const G4_REQUIRED = Object.freeze([
    { role: "runtime", src: `/assets/hearth/hearth.runtime.js?v=${KEY}`, globalName: "HEARTH_RUNTIME" },
    { role: "controls", src: `/assets/hearth/hearth.controls.js?v=${KEY}`, globalName: "HEARTH_CONTROLS" },
    { role: "canvas", src: `/assets/hearth/hearth.canvas.js?v=${KEY}`, globalName: "HEARTH_CANVAS" }
  ]);

  const state = {
    booted: false,
    loaded: [],
    failed: [],
    sourceTruthFailed: [],
    requiredFailed: [],
    controlsBound: false,
    renderMounted: false
  };

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthExpectedRoute = EXPECTED_ROUTE;
    document.documentElement.dataset.hearthGeneration = "G4";
    document.documentElement.dataset.hearthG4Job = "motion-authority-renewal";
    document.documentElement.dataset.hearthG5Job = "clouds-weather-living-atmosphere";
    document.documentElement.dataset.hearthProcess = "deduced-reassigned-renewed";
    document.documentElement.dataset.hearthCanvasWorldEngine = "truth-substrate";
    document.documentElement.dataset.hearthRuntime = "south-star-motion-authority";
    document.documentElement.dataset.hearthControls = "drag-spin-finger-sensitivity";
    document.documentElement.dataset.hearthRender = "drawing-authority";
    document.documentElement.dataset.hearthAssets = "material-expression-plasma";
    document.documentElement.dataset.hearthStaticTruthOccupiesRuntime = "false";
    document.documentElement.dataset.hearthPointerEventsBlocked = "false";
    document.documentElement.dataset.hearthTouchAction = "none";
    document.documentElement.dataset.hearthAxisTiltDegrees = "23.44";
    document.documentElement.dataset.hearthLoadedScripts = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedScripts = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthSourceTruthFailures = state.sourceTruthFailed.join(",") || "none";
    document.documentElement.dataset.hearthRequiredFailures = state.requiredFailed.join(",") || "none";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthVisualPassClaimed = "false";
  }

  function exposeReceipt(status) {
    window.HEARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: EXPECTED_ROUTE,
      cacheKey: KEY,
      generation: "G4",
      process: "deduced-reassigned-renewed",
      g4Job: "motion-authority-renewal",
      g5Job: "clouds-weather-living-atmosphere",
      authority: {
        canvasWorldEngine: "truth-substrate-material-composition",
        assets: "eyes-plasma-material-expression",
        runtime: "south-star-motion-authority",
        controls: "drag-spin-finger-sensitivity-input-feed",
        render: "drawing-output-authority"
      },
      axisTiltDegrees: 23.44,
      sourceTruthNonblocking: SOURCE_TRUTH_NONBLOCKING.map((item) => item.role),
      requiredG4: G4_REQUIRED.map((item) => item.role),
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      sourceTruthFailed: state.sourceTruthFailed.slice(),
      requiredFailed: state.requiredFailed.slice(),
      controlsBound: state.controlsBound,
      renderMounted: state.renderMounted,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      status
    });
  }

  function callKnownDisposers() {
    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_CONTROLS_DISPOSE__",
      "__HEARTH_RUNTIME_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_CANVAS_ADAPTIVE_RUNTIME_SELF_HEAL_DISPOSE__",
      "__HEARTH_CANVAS_ADAPTIVE_RUNTIME_DISPOSE__",
      "__HEARTH_CANVAS_HEX_SURFACE_CONSUMER_DISPOSE__",
      "__HEARTH_CANVAS_CHILD_ENGINE_COMPOSITION_DISPOSE__",
      "__HEARTH_CANVAS_LANDFORM_CONSUMPTION_DISPOSE__",
      "__HEARTH_CANVAS_BOUNDARY_DISPOSE__",
      "__HEARTH_CANVAS_G3_FAMILY_DISPOSE__",
      "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
      "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
      "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
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
      .querySelectorAll(
        [
          'script[src*="/assets/hearth/hearth.hex.js"]',
          'script[src*="/assets/hearth/hearth.hex.surface.js"]',
          'script[src*="/assets/hearth/hearth.terrain.js"]',
          'script[src*="/assets/hearth/hearth.hydration.js"]',
          'script[src*="/assets/hearth/hearth.mountains.js"]',
          'script[src*="/assets/hearth/hearth.cliffs.js"]',
          'script[src*="/assets/hearth/hearth.valleys.js"]',
          'script[src*="/assets/hearth/hearth.beaches.js"]',
          'script[src*="/assets/hearth/hearth.islands.js"]',
          'script[src*="/assets/hearth/hearth.runtime.js"]',
          'script[src*="/assets/hearth/hearth.controls.js"]',
          'script[src*="/assets/hearth/hearth.canvas.js"]',
          'script[data-hearth-render-chain-script="true"]',
          'script[data-hearth-g4-motion-script="true"]'
        ].join(",")
      )
      .forEach((script) => script.remove());
  }

  function ensureMount() {
    let mount = document.getElementById("hearthCanvasMount");

    if (!mount) {
      const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.setAttribute("aria-label", "Hearth G4 drag and spin planet mount");
      parent.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.hearthGeneration = "G4";
    mount.dataset.hearthG4Job = "motion-authority-renewal";
    mount.dataset.hearthG5Job = "clouds-weather-living-atmosphere";
    mount.dataset.hearthCanvasWorldEngine = "truth-substrate";
    mount.dataset.hearthRuntime = "south-star-motion-authority";
    mount.dataset.hearthControls = "drag-spin-finger-sensitivity";
    mount.dataset.hearthRender = "drawing-authority";
    mount.dataset.hearthAssets = "material-expression-plasma";
    mount.dataset.hearthPointerEventsBlocked = "false";
    mount.dataset.hearthTouchAction = "none";
    mount.dataset.hearthGeneratedImage = "false";
    mount.dataset.hearthGraphicBox = "false";

    return mount;
  }

  function installRouteStyle() {
    const prior = document.getElementById("hearth-g4-motion-route-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g4-motion-route-style";
    style.textContent = `
      #hearthCanvasMount {
        position: relative;
        width: 100%;
        min-height: 320px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        isolation: isolate;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        border-radius: 32px;
        background: radial-gradient(circle at 50% 50%, rgba(39, 117, 155, 0.34), rgba(3, 9, 20, 0.96) 70%);
      }

      #hearthCanvasMount canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: auto !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
      }

      #hearthCanvasMount[data-hearth-required-failure="true"]::after {
        content: attr(data-hearth-route-error-message);
        position: absolute;
        inset: auto 18px 18px;
        z-index: 5;
        padding: 12px 14px;
        border: 1px solid rgba(231, 188, 105, 0.5);
        border-radius: 16px;
        background: rgba(7, 14, 24, 0.94);
        color: #e7bc69;
        font: 800 13px/1.35 system-ui, sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  function loadScript(source, required, category) {
    return new Promise((resolve, reject) => {
      if (source.globalName && window[source.globalName]) {
        state.loaded.push(source.role);
        stamp(`already-loaded-${source.role}`);
        resolve({ role: source.role, loaded: true, alreadyPresent: true });
        return;
      }

      const script = document.createElement("script");
      script.src = source.src;
      script.defer = true;
      script.dataset.hearthG4MotionScript = "true";
      script.dataset.hearthScriptRole = source.role;
      script.dataset.hearthScriptRequired = String(required);
      script.dataset.hearthScriptCategory = category;
      script.dataset.contract = CONTRACT;
      script.dataset.cacheKey = KEY;

      script.addEventListener(
        "load",
        () => {
          state.loaded.push(source.role);
          stamp(`loaded-${source.role}`);
          resolve({ role: source.role, loaded: true });
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => {
          state.failed.push(source.role);

          if (category === "source-truth") {
            state.sourceTruthFailed.push(source.role);
          }

          if (required) {
            state.requiredFailed.push(source.role);
            stamp(`required-failed-${source.role}`);
            reject(new Error(`Required Hearth G4 script failed: ${source.role} ${source.src}`));
            return;
          }

          stamp(`nonblocking-failed-${source.role}`);
          resolve({ role: source.role, loaded: false });
        },
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  async function loadSourceTruthNonblocking() {
    const results = [];

    for (const source of SOURCE_TRUTH_NONBLOCKING) {
      const result = await loadScript(source, false, "source-truth");
      results.push(result);
    }

    return results;
  }

  async function loadG4Required() {
    for (const source of G4_REQUIRED) {
      await loadScript(source, true, "g4-motion");
    }
  }

  async function bindG4(mount) {
    if (!window.HEARTH_RUNTIME || !window.HEARTH_CONTROLS || !window.HEARTH_CANVAS) {
      throw new Error("Hearth G4 authority globals missing after required load.");
    }

    const runtime = window.HEARTH_RUNTIME;
    const renderer = window.HEARTH_CANVAS.mount(mount, { runtime });
    const canvas = renderer && renderer.canvas
      ? renderer.canvas
      : mount.querySelector("canvas[data-hearth-canvas]");

    if (!canvas) {
      throw new Error("Hearth G4 canvas did not mount.");
    }

    window.HEARTH_CONTROLS.bind(canvas, runtime, {
      mount,
      axisTiltDegrees: 23.44,
      dragRadiansPerScreen: Math.PI * 2.05,
      friction: 2.1
    });

    runtime.start();

    state.controlsBound = true;
    state.renderMounted = true;

    mount.dataset.hearthControlsBound = "true";
    mount.dataset.hearthRenderMounted = "true";
    mount.dataset.hearthRequiredFailure = "false";
    mount.dataset.hearthRouteErrorMessage = "";
    mount.dataset.hearthSourceTruthFailures = state.sourceTruthFailed.join(",") || "none";

    document.body.dataset.hearthRouteReady = "true";
    document.documentElement.dataset.hearthRenderChainReady = "true";
    document.documentElement.dataset.hearthG4MotionReady = "true";
    document.documentElement.dataset.hearthControlsBound = "true";
    document.documentElement.dataset.hearthRuntimeStarted = "true";
    document.documentElement.dataset.hearthCanvasMounted = "true";
  }

  async function boot() {
    if (state.booted) return;
    state.booted = true;

    const mount = ensureMount();

    stamp("booting");
    exposeReceipt("booting");
    callKnownDisposers();
    removePriorScripts();
    installRouteStyle();
    ensureMount();

    try {
      await loadSourceTruthNonblocking();
      await loadG4Required();
      await bindG4(mount);

      const status = state.sourceTruthFailed.length
        ? "ready-with-nonblocking-source-truth-failures"
        : "ready";

      stamp(status);
      exposeReceipt(status);
    } catch (error) {
      mount.dataset.hearthRequiredFailure = "true";
      mount.dataset.hearthRouteErrorMessage = error && error.message
        ? error.message
        : "Hearth G4 required motion chain failed.";

      document.body.dataset.hearthRouteReady = "false";
      document.documentElement.dataset.hearthRenderChainReady = "false";
      document.documentElement.dataset.hearthG4MotionReady = "false";
      document.documentElement.dataset.hearthRouteControllerError = error && error.message ? error.message : String(error);

      stamp("required-g4-motion-chain-error");
      exposeReceipt("required-g4-motion-chain-error");
    }
  }

  window.__HEARTH_G4_ROUTE_DISPOSE__ = () => {
    if (typeof window.__HEARTH_CONTROLS_DISPOSE__ === "function") window.__HEARTH_CONTROLS_DISPOSE__();
    if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") window.__HEARTH_CANVAS_DISPOSE__();
    if (typeof window.__HEARTH_RUNTIME_DISPOSE__ === "function") window.__HEARTH_RUNTIME_DISPOSE__();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
