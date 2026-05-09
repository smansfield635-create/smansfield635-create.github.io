// /showroom/globe/hearth/index.js
// HEARTH_G3_NONBLOCKING_HEX_SURFACE_CANVAS_SELF_HEAL_ROUTE_CONTROLLER_TNT_v3
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Keep hex and terrain as route-required.
// - Treat hex.surface as preferred but nonblocking.
// - Always load adaptive self-healing canvas after hex and terrain.
// - Canvas can self-load hearth.hex.surface.js if the route load fails.
// - Preserve Hearth G3 high-density hex surface baseline.
// - No GraphicBox. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_NONBLOCKING_HEX_SURFACE_CANVAS_SELF_HEAL_ROUTE_CONTROLLER_TNT_v3";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const PREVIOUS_CONTRACT = "HEARTH_G3_ADAPTIVE_RUNTIME_SELF_HEAL_ROUTE_CONTROLLER_TNT_v2";
  const VERSION = "2026-05-09.hearth-g3-nonblocking-hex-surface-canvas-self-heal-route-controller";
  const RECEIPT = "HEARTH_G3_NONBLOCKING_HEX_SURFACE_CANVAS_SELF_HEAL_ROUTE_RECEIPT";
  const BASELINE = "HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_BASELINE_v1";

  const KEY = "hearth-g3-nonblocking-hex-surface-canvas-self-heal-v3";
  const EXPECTED_ROUTE = "/showroom/globe/hearth/";

  const CORE_REQUIRED = Object.freeze([
    {
      role: "hex",
      globalName: "HEARTH_HEX",
      src: `/assets/hearth/hearth.hex.js?v=${KEY}`
    },
    {
      role: "terrain",
      globalName: "HEARTH_TERRAIN",
      src: `/assets/hearth/hearth.terrain.js?v=${KEY}`
    }
  ]);

  const PREFERRED_NONBLOCKING = Object.freeze([
    {
      role: "hydration",
      globalName: "HEARTH_HYDRATION",
      src: `/assets/hearth/hearth.hydration.js?v=${KEY}`
    },
    {
      role: "mountains",
      globalName: "HEARTH_MOUNTAINS",
      src: `/assets/hearth/hearth.mountains.js?v=${KEY}`
    },
    {
      role: "cliffs",
      globalName: "HEARTH_CLIFFS",
      src: `/assets/hearth/hearth.cliffs.js?v=${KEY}`
    },
    {
      role: "valleys",
      globalName: "HEARTH_VALLEYS",
      src: `/assets/hearth/hearth.valleys.js?v=${KEY}`
    },
    {
      role: "beaches",
      globalName: "HEARTH_BEACHES",
      src: `/assets/hearth/hearth.beaches.js?v=${KEY}`
    },
    {
      role: "islands",
      globalName: "HEARTH_ISLANDS",
      src: `/assets/hearth/hearth.islands.js?v=${KEY}`
    },
    {
      role: "hexSurface",
      globalName: "HEARTH_HEX_SURFACE",
      src: `/assets/hearth/hearth.hex.surface.js?v=${KEY}`
    }
  ]);

  const CANVAS_REQUIRED = Object.freeze({
    role: "canvas",
    globalName: "HEARTH_CANVAS_RECEIPT",
    src: `/assets/hearth/hearth.canvas.js?v=${KEY}`
  });

  const state = {
    booted: false,
    loaded: [],
    failed: [],
    preferredFailed: [],
    requiredFailed: [],
    bridged: []
  };

  function roleKey(role) {
    return `hearth${role.slice(0, 1).toUpperCase()}${role.slice(1)}ScriptLoaded`;
  }

  function stamp(status) {
    document.documentElement.dataset.hearthRouteControllerLoaded = "true";
    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthRouteControllerVersion = VERSION;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRouteControllerStatus = status;
    document.documentElement.dataset.hearthBaseline = BASELINE;
    document.documentElement.dataset.hearthExpectedRoute = EXPECTED_ROUTE;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "nonblocking-hex-surface-canvas-self-heal";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthRouteLoadKey = KEY;
    document.documentElement.dataset.hearthCoreRequiredChain = "hex,terrain,canvas";
    document.documentElement.dataset.hearthPreferredNonblockingChain =
      "hydration,mountains,cliffs,valleys,beaches,islands,hex.surface";
    document.documentElement.dataset.hearthLoadOrder =
      "hex,terrain,hydration,mountains,cliffs,valleys,beaches,islands,hex.surface,canvas";
    document.documentElement.dataset.hearthHexFirst = "true";
    document.documentElement.dataset.hearthHexSurface = "preferred-nonblocking-high-density-overlapping-hex";
    document.documentElement.dataset.hearthCanvasRuntime = "adaptive-self-heal-v3";
    document.documentElement.dataset.hearthCanvasMaySelfHealHexSurface = "true";
    document.documentElement.dataset.hearthHexBridgeInstalledFor = state.bridged.join(",") || "none";
    document.documentElement.dataset.hearthLoadedScripts = state.loaded.join(",") || "none";
    document.documentElement.dataset.hearthFailedScripts = state.failed.join(",") || "none";
    document.documentElement.dataset.hearthPreferredFailures = state.preferredFailed.join(",") || "none";
    document.documentElement.dataset.hearthRequiredFailures = state.requiredFailed.join(",") || "none";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthActiveWeatherExcluded = "true";
    document.documentElement.dataset.hearthCloudsExcluded = "true";
    document.documentElement.dataset.hearthHumidityExcluded = "true";
  }

  function callKnownDisposers() {
    [
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
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_MOUNTAINS_DISPOSE__",
      "__HEARTH_CLIFFS_DISPOSE__",
      "__HEARTH_VALLEYS_DISPOSE__",
      "__HEARTH_BEACHES_DISPOSE__",
      "__HEARTH_ISLANDS_DISPOSE__",
      "__HEARTH_TERRAIN_BOUNDARY_DISPOSE__",
      "__HEARTH_HYDRATION_BOUNDARY_DISPOSE__",
      "__HEARTH_HEX_DISPOSE__",
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

  function clearKnownGlobals() {
    [
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_HEX_SURFACE_STATUS"
    ].forEach((name) => {
      try {
        window[name] = null;
      } catch (_) {}
    });
  }

  function removePriorScripts() {
    document
      .querySelectorAll([
        'script[src*="/assets/hearth/hearth.hex.js"]',
        'script[src*="/assets/hearth/hearth.hex.surface.js"]',
        'script[src*="/assets/hearth/hearth.terrain.js"]',
        'script[src*="/assets/hearth/hearth.hydration.js"]',
        'script[src*="/assets/hearth/hearth.mountains.js"]',
        'script[src*="/assets/hearth/hearth.cliffs.js"]',
        'script[src*="/assets/hearth/hearth.valleys.js"]',
        'script[src*="/assets/hearth/hearth.beaches.js"]',
        'script[src*="/assets/hearth/hearth.islands.js"]',
        'script[src*="/assets/hearth/hearth.canvas.js"]',
        'script[data-hearth-render-chain-script="true"]',
        'script[data-hearth-child-engine-script="true"]',
        'script[data-hearth-canvas-self-heal="true"]'
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
      mount.setAttribute("aria-label", "Hearth G3 high-density adaptive hex-surface planet mount");
      parent.appendChild(mount);
    }

    mount.dataset.hearthMountReady = "true";
    mount.dataset.hearthRouteController = CONTRACT;
    mount.dataset.hearthRouteControllerPreviousContract = PREVIOUS_CONTRACT;
    mount.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    mount.dataset.hearthRouteControllerReceipt = RECEIPT;
    mount.dataset.hearthBaseline = BASELINE;
    mount.dataset.hearthGeneration = "G3";
    mount.dataset.hearthStandard = "nonblocking-hex-surface-canvas-self-heal";
    mount.dataset.hearthHexOwner = "/assets/hearth/hearth.hex.js";
    mount.dataset.hearthHexSurfaceOwner = "/assets/hearth/hearth.hex.surface.js";
    mount.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    mount.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mount.dataset.hearthRouteLoadKey = KEY;
    mount.dataset.hearthHexSurface = "preferred-nonblocking-high-density-overlapping-hex";
    mount.dataset.hearthCanvasRuntime = "adaptive-self-heal-v3";
    mount.dataset.hearthCanvasMaySelfHealHexSurface = "true";
    mount.dataset.hearthGeneratedImage = "false";
    mount.dataset.hearthGraphicBox = "false";

    return mount;
  }

  function installFallbackMountStyle() {
    const prior = document.getElementById("hearth-nonblocking-route-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-nonblocking-route-style";
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
        content: attr(data-hearth-route-error-message);
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
      script.dataset.cacheKey = KEY;

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

          state.preferredFailed.push(source.role);
          stamp(`preferred-failed-${source.role}`);
          resolve({ role: source.role, loaded: false, required: false });
        },
        { once: true }
      );

      document.head.appendChild(script);
    });
  }

  function bridgeModule(globalName) {
    if (!window.HEARTH_HEX || typeof window.HEARTH_HEX.installSampleBridge !== "function") {
      return false;
    }

    const ok = window.HEARTH_HEX.installSampleBridge(globalName);

    if (ok && !state.bridged.includes(globalName)) {
      state.bridged.push(globalName);
    }

    stamp(`bridge-${globalName}-${ok ? "ok" : "not-present"}`);
    return ok;
  }

  async function loadCore() {
    await loadScript(CORE_REQUIRED[0], true);
    await loadScript(CORE_REQUIRED[1], true);
    bridgeModule("HEARTH_TERRAIN");
  }

  async function loadPreferredNonblocking() {
    const results = [];

    for (const source of PREFERRED_NONBLOCKING) {
      stamp(`loading-preferred-${source.role}`);
      const result = await loadScript(source, false);
      results.push(result);

      if (result.loaded && source.globalName && source.globalName !== "HEARTH_HEX_SURFACE") {
        bridgeModule(source.globalName);
      }
    }

    return results;
  }

  async function loadCanvas() {
    await loadScript(CANVAS_REQUIRED, true);
  }

  function exposeReceipt(status) {
    window.HEARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      baseline: BASELINE,
      route: location.pathname,
      expectedRoute: EXPECTED_ROUTE,
      loadKey: KEY,
      generation: "G3",
      standard: "nonblocking-hex-surface-canvas-self-heal",
      hexSubstrate: "logical-256",
      hexSurface: "preferred-nonblocking-high-density-overlapping-hex",
      canvasRuntime: "adaptive-self-heal-v3",
      canvasMaySelfHealHexSurface: true,
      loadOrder: [
        "hex",
        "terrain",
        "hydration",
        "mountains",
        "cliffs",
        "valleys",
        "beaches",
        "islands",
        "hex.surface",
        "canvas"
      ],
      coreRequired: CORE_REQUIRED.map((source) => ({
        role: source.role,
        globalName: source.globalName,
        src: source.src
      })),
      preferredNonblocking: PREFERRED_NONBLOCKING.map((source) => ({
        role: source.role,
        globalName: source.globalName,
        src: source.src
      })),
      canvasRequired: {
        role: CANVAS_REQUIRED.role,
        globalName: CANVAS_REQUIRED.globalName,
        src: CANVAS_REQUIRED.src
      },
      loaded: state.loaded.slice(),
      failed: state.failed.slice(),
      preferredFailed: state.preferredFailed.slice(),
      requiredFailed: state.requiredFailed.slice(),
      bridged: state.bridged.slice(),
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
    clearKnownGlobals();
    installFallbackMountStyle();
    ensureMount();

    try {
      await loadCore();
      await loadPreferredNonblocking();
      await loadCanvas();

      mount.dataset.hearthRequiredFailure = "false";
      mount.dataset.hearthRouteErrorMessage = "";
      mount.dataset.hearthPreferredFailures = state.preferredFailed.join(",") || "none";
      mount.dataset.hearthHexBridgeInstalledFor = state.bridged.join(",") || "none";

      document.body.dataset.hearthRouteReady = "true";
      document.body.dataset.hearthCanvasAssetLoaded = "true";
      document.documentElement.dataset.hearthRenderChainReady = "true";
      document.documentElement.dataset.hearthHexSubstrateReady = "true";
      document.documentElement.dataset.hearthHexSurfaceReady = String(!!window.HEARTH_HEX_SURFACE);
      document.documentElement.dataset.hearthAdaptiveRuntimeReady = "true";

      const status = state.preferredFailed.length
        ? "ready-with-preferred-nonblocking-failures"
        : "ready";

      stamp(status);
      exposeReceipt(status);
    } catch (error) {
      mount.dataset.hearthRequiredFailure = "true";
      mount.dataset.hearthRouteErrorMessage =
        state.requiredFailed.length
          ? `Hearth core route chain blocked. Required failed: ${state.requiredFailed.join(", ")}.`
          : "Hearth core route chain blocked. Hex, terrain, or canvas failed to load.";

      document.body.dataset.hearthRouteReady = "false";
      document.body.dataset.hearthCanvasAssetLoaded = "false";
      document.documentElement.dataset.hearthRenderChainReady = "false";
      document.documentElement.dataset.hearthHexSubstrateReady = String(!!window.HEARTH_HEX);
      document.documentElement.dataset.hearthHexSurfaceReady = String(!!window.HEARTH_HEX_SURFACE);
      document.documentElement.dataset.hearthAdaptiveRuntimeReady = String(!!window.HEARTH_CANVAS_RECEIPT);
      document.documentElement.dataset.hearthRouteControllerError =
        error && error.message ? error.message : String(error);

      stamp("required-core-chain-error");
      exposeReceipt("required-core-chain-error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
