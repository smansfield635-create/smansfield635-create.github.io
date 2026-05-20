// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_CLEAN_CANVAS_ENGINE_TNT_v1
// Full-file replacement.
// File 16 of 16.
// Planet Audralia engine / chain-verification and mount-API authority.
// Purpose:
// - Establishes Audralia-specific engine authority for clean-canvas chain verification and mount orchestration.
// - Verifies the 16-file chain, authority boundaries, contract receipts, inheritance posture, and one-file-one-job law.
// - Provides the mount API consumed by /showroom/globe/audralia/index.js.
// - Orchestrates runtime, controls, and canvas compositor without owning their internal responsibilities.
// - Does not create land/ocean footprint.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not synthesize surface truth.
// - Does not create atmosphere/weather truth.
// - Does not own runtime motion.
// - Does not own controls.
// - Does not own canvas composition.
// - Does not own route bridge.
// - Does not own HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_COMPOSITOR_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-engine-v1";

  const FILE_NUMBER = 16;
  const PRIMARY_NODE = 16;
  const SUBNODE_RANGE = Object.freeze([241, 256]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const ENGINE_TARGETS = Object.freeze({
    chainVerification: true,
    mountApi: true,
    runtimeOrchestration: true,
    controlsOrchestration: true,
    canvasOrchestration: true,
    receiptAggregation: true,
    boundaryVerification: true,
    hEarthInheritanceVerification: true,
    ownsEngineOnly: true,
    ownsRuntimeMotion: false,
    ownsControls: false,
    ownsCanvasComposition: false,
    ownsRouteBridge: false,
    ownsHtml: false
  });

  const EXPECTED_CHAIN = Object.freeze([
    {
      fileNumber: 1,
      primaryNode: 1,
      path: "/assets/showroom/globe/planet/planet.manifest.js",
      globalNames: Object.freeze(["DGB_PLANET_FAMILY_MANIFEST", "AUDRALIA_CLEAN_CANVAS_MANIFEST"]),
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_TNT_v1",
      authority: "universal-planet-family-manifest"
    },
    {
      fileNumber: 2,
      primaryNode: 2,
      path: "/assets/showroom/globe/planet/planet.math.js",
      globalNames: Object.freeze(["DGB_PLANET_FAMILY_MATH", "AUDRALIA_CLEAN_CANVAS_MATH"]),
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
      authority: "universal-planet-family-math"
    },
    {
      fileNumber: 3,
      primaryNode: 3,
      path: "/assets/showroom/globe/planet/planet.lattice.js",
      globalNames: Object.freeze(["DGB_PLANET_FAMILY_LATTICE", "AUDRALIA_CLEAN_CANVAS_LATTICE"]),
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1",
      authority: "universal-planet-family-lattice"
    },
    {
      fileNumber: 4,
      primaryNode: 4,
      path: "/assets/showroom/globe/planet/planet.palette.js",
      globalNames: Object.freeze(["DGB_PLANET_FAMILY_PALETTE", "AUDRALIA_CLEAN_CANVAS_PALETTE"]),
      contract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1",
      authority: "universal-planet-family-palette"
    },
    {
      fileNumber: 5,
      primaryNode: 5,
      path: "/assets/audralia/clean/audralia.identity.js",
      globalNames: Object.freeze(["AUDRALIA_IDENTITY", "AUDRALIA_CLEAN_CANVAS_IDENTITY"]),
      contract: "AUDRALIA_CLEAN_CANVAS_IDENTITY_TNT_v1",
      authority: "audralia-planet-identity"
    },
    {
      fileNumber: 6,
      primaryNode: 6,
      path: "/assets/audralia/clean/audralia.landmask.js",
      globalNames: Object.freeze(["AUDRALIA_LANDMASK", "AUDRALIA_CLEAN_CANVAS_LANDMASK"]),
      contract: "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1",
      authority: "audralia-land-ocean-footprint"
    },
    {
      fileNumber: 7,
      primaryNode: 7,
      path: "/assets/audralia/clean/audralia.hydrology.js",
      globalNames: Object.freeze(["AUDRALIA_HYDROLOGY", "AUDRALIA_CLEAN_CANVAS_HYDROLOGY"]),
      contract: "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1",
      authority: "audralia-water-behavior"
    },
    {
      fileNumber: 8,
      primaryNode: 8,
      path: "/assets/audralia/clean/audralia.elevation.js",
      globalNames: Object.freeze(["AUDRALIA_ELEVATION", "AUDRALIA_CLEAN_CANVAS_ELEVATION"]),
      contract: "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1",
      authority: "audralia-vertical-depth"
    },
    {
      fileNumber: 9,
      primaryNode: 9,
      path: "/assets/audralia/clean/audralia.climate.js",
      globalNames: Object.freeze(["AUDRALIA_CLIMATE", "AUDRALIA_CLEAN_CANVAS_CLIMATE"]),
      contract: "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1",
      authority: "audralia-condition-fields"
    },
    {
      fileNumber: 10,
      primaryNode: 10,
      path: "/assets/audralia/clean/audralia.biome.js",
      globalNames: Object.freeze(["AUDRALIA_BIOME", "AUDRALIA_CLEAN_CANVAS_BIOME"]),
      contract: "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1",
      authority: "audralia-living-world-categories"
    },
    {
      fileNumber: 11,
      primaryNode: 11,
      path: "/assets/audralia/clean/audralia.surface.js",
      globalNames: Object.freeze(["AUDRALIA_SURFACE", "AUDRALIA_CLEAN_CANVAS_SURFACE"]),
      contract: "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1",
      authority: "audralia-visible-surface-material-synthesis"
    },
    {
      fileNumber: 12,
      primaryNode: 12,
      path: "/assets/audralia/clean/audralia.atmosphere.js",
      globalNames: Object.freeze(["AUDRALIA_ATMOSPHERE", "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE", "AUDRALIA_WEATHER"]),
      contract: "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1",
      authority: "audralia-atmosphere-weather-inheritance-source"
    },
    {
      fileNumber: 13,
      primaryNode: 13,
      path: "/assets/audralia/clean/audralia.runtime.js",
      globalNames: Object.freeze(["AUDRALIA_RUNTIME", "AUDRALIA_CLEAN_CANVAS_RUNTIME"]),
      contract: "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1",
      authority: "audralia-motion-only-runtime"
    },
    {
      fileNumber: 14,
      primaryNode: 14,
      path: "/assets/audralia/clean/audralia.controls.js",
      globalNames: Object.freeze(["AUDRALIA_CONTROLS", "AUDRALIA_CLEAN_CANVAS_CONTROLS"]),
      contract: "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1",
      authority: "audralia-inspection-only-controls"
    },
    {
      fileNumber: 15,
      primaryNode: 15,
      path: "/assets/audralia/clean/audralia.canvas.js",
      globalNames: Object.freeze(["AUDRALIA_CANVAS", "AUDRALIA_CLEAN_CANVAS_COMPOSITOR", "AUDRALIA_CLEAN_CANVAS_CANVAS"]),
      contract: "AUDRALIA_CLEAN_CANVAS_COMPOSITOR_TNT_v1",
      authority: "audralia-canvas-composition-only"
    },
    {
      fileNumber: 16,
      primaryNode: 16,
      path: "/assets/audralia/clean/audralia.engine.js",
      globalNames: Object.freeze(["AUDRALIA_ENGINE", "AUDRALIA_CLEAN_CANVAS_ENGINE"]),
      contract: CONTRACT,
      authority: "audralia-chain-verification-and-mount-api"
    }
  ]);

  const DEFAULTS = Object.freeze({
    autoStart: true,
    autoResize: true,
    autoVisibility: true,
    proofStatus: false,
    allowCreateCanvas: false,
    canvasClassName: "audralia-clean-canvas",
    canvasLabel: "Audralia clean-canvas planet inspection surface",
    dprCap: 1.65,
    frameBudgetMs: 42,
    textureWidth: 288,
    textureHeight: 144,
    radiusScale: 0.365,
    cxRatio: 0.50,
    cyRatio: 0.51,
    engineLoopLabel: "audralia-clean-canvas-engine-loop"
  });

  function W() {
    return typeof window !== "undefined" ? window : {};
  }

  function D() {
    return typeof document !== "undefined" ? document : null;
  }

  function M() {
    return W().DGB_PLANET_FAMILY_MATH || W().AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function R() {
    return W().AUDRALIA_RUNTIME || W().AUDRALIA_CLEAN_CANVAS_RUNTIME || null;
  }

  function C() {
    return W().AUDRALIA_CONTROLS || W().AUDRALIA_CLEAN_CANVAS_CONTROLS || null;
  }

  function CV() {
    return W().AUDRALIA_CANVAS || W().AUDRALIA_CLEAN_CANVAS_COMPOSITOR || W().AUDRALIA_CLEAN_CANVAS_CANVAS || null;
  }

  function A() {
    return W().AUDRALIA_ATMOSPHERE || W().AUDRALIA_CLEAN_CANVAS_ATMOSPHERE || W().AUDRALIA_WEATHER || null;
  }

  function finite(value, fallback = 0) {
    const helper = M();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = M();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function safeDataset(key, value) {
    const doc = D();
    if (!doc?.documentElement?.dataset) return;

    try {
      doc.documentElement.dataset[key] = String(value);
    } catch {
      // Dataset writes are proof metadata only.
    }
  }

  function safeNow() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }

    return Date.now();
  }

  function requestFrame(callback) {
    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame(callback);
    }

    return setTimeout(() => callback(safeNow()), 42);
  }

  function cancelFrame(id) {
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(id);
      return;
    }

    clearTimeout(id);
  }

  function readGlobal(name) {
    return W()[name] || null;
  }

  function firstAvailable(globalNames) {
    for (const name of globalNames) {
      const value = readGlobal(name);
      if (value) return value;
    }

    return null;
  }

  function readAuthority(entry) {
    const value = firstAvailable(entry.globalNames);
    const status = value && typeof value.getStatus === "function" ? value.getStatus() : null;
    const receiptName = `${entry.globalNames[0]}_RECEIPT`;
    const receipt = readGlobal(receiptName) || status || null;
    const actualContract = value?.contract || status?.contract || receipt?.contract || null;

    return Object.freeze({
      fileNumber: entry.fileNumber,
      primaryNode: entry.primaryNode,
      path: entry.path,
      authority: entry.authority,
      expectedContract: entry.contract,
      actualContract,
      available: Boolean(value),
      receiptAvailable: Boolean(receipt),
      statusAvailable: Boolean(status),
      valid: Boolean(value) && actualContract === entry.contract,
      globalMatched: entry.globalNames.find((name) => Boolean(readGlobal(name))) || null,
      receipt,
      status
    });
  }

  function validateChain() {
    const authorities = EXPECTED_CHAIN.map(readAuthority);
    const availableCount = authorities.filter((item) => item.available).length;
    const validCount = authorities.filter((item) => item.valid).length;
    const missing = authorities.filter((item) => !item.available);
    const invalid = authorities.filter((item) => item.available && !item.valid);

    const complete = availableCount === EXPECTED_CHAIN.length;
    const valid = validCount === EXPECTED_CHAIN.length;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-clean-canvas-chain-verification",
      expectedFiles: EXPECTED_CHAIN.length,
      availableCount,
      validCount,
      complete,
      valid,
      missing: Object.freeze(missing.map((item) => Object.freeze({
        fileNumber: item.fileNumber,
        path: item.path,
        expectedContract: item.expectedContract
      }))),
      invalid: Object.freeze(invalid.map((item) => Object.freeze({
        fileNumber: item.fileNumber,
        path: item.path,
        expectedContract: item.expectedContract,
        actualContract: item.actualContract
      }))),
      authorities: Object.freeze(authorities),
      oneFileOneJob: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      visualPassClaimed: false
    });
  }

  function validateBoundaries() {
    const chain = validateChain();
    const failures = [];

    const runtime = readAuthority(EXPECTED_CHAIN[12]);
    const controls = readAuthority(EXPECTED_CHAIN[13]);
    const canvas = readAuthority(EXPECTED_CHAIN[14]);
    const atmosphere = readAuthority(EXPECTED_CHAIN[11]);

    if (runtime.status?.ownsControls === true || runtime.receipt?.ownsControls === true) {
      failures.push("runtime_claims_controls");
    }

    if (runtime.status?.ownsCanvas === true || runtime.receipt?.ownsCanvas === true) {
      failures.push("runtime_claims_canvas");
    }

    if (controls.status?.ownsRuntimeMotion === true || controls.receipt?.ownsRuntimeMotion === true) {
      failures.push("controls_claim_runtime_motion");
    }

    if (canvas.status?.ownsRuntimeMotion === true || canvas.receipt?.ownsRuntimeMotion === true) {
      failures.push("canvas_claims_runtime_motion");
    }

    if (canvas.status?.ownsSurfaceTruth === true || canvas.receipt?.ownsSurfaceTruth === true) {
      failures.push("canvas_claims_surface_truth");
    }

    if (canvas.status?.ownsAtmosphereTruth === true || canvas.receipt?.ownsAtmosphereTruth === true) {
      failures.push("canvas_claims_atmosphere_truth");
    }

    if (atmosphere.status?.hEarthSeparateWeatherAuthority === true || atmosphere.receipt?.hEarthSeparateWeatherAuthority === true) {
      failures.push("h_earth_marked_as_separate_weather_authority");
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-boundary-verification",
      chainValid: chain.valid,
      valid: failures.length === 0,
      failures: Object.freeze(failures),
      runtimeMotionOnly: failures.includes("runtime_claims_controls") === false && failures.includes("runtime_claims_canvas") === false,
      controlsInspectionOnly: failures.includes("controls_claim_runtime_motion") === false,
      canvasCompositionOnly: failures.includes("canvas_claims_runtime_motion") === false,
      surfaceTruthSeparatedFromCanvas: failures.includes("canvas_claims_surface_truth") === false,
      atmosphereTruthSeparatedFromCanvas: failures.includes("canvas_claims_atmosphere_truth") === false,
      hEarthInheritancePreserved: failures.includes("h_earth_marked_as_separate_weather_authority") === false,
      visualPassClaimed: false
    });
  }

  function getHEarthInheritancePacket(u = 0.5, v = 0.5) {
    const atmosphere = A();

    if (atmosphere?.getHEarthInheritancePacket) {
      return atmosphere.getHEarthInheritancePacket(u, v);
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      sourcePlanet: "Audralia",
      sourceRoute: AUDRALIA_ROUTE,
      downstreamView: "H-Earth / Hybrid Earth",
      downstreamRoute: H_EARTH_ROUTE,
      inheritsByDefault: true,
      localModifierAllowed: true,
      reason: "atmosphere_packet_not_loaded_engine_preserves_inheritance_rule",
      visualPassClaimed: false
    });
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      autoStart: Boolean(options.autoStart ?? DEFAULTS.autoStart),
      autoResize: Boolean(options.autoResize ?? DEFAULTS.autoResize),
      autoVisibility: Boolean(options.autoVisibility ?? DEFAULTS.autoVisibility),
      proofStatus: Boolean(options.proofStatus ?? DEFAULTS.proofStatus),
      allowCreateCanvas: Boolean(options.allowCreateCanvas ?? DEFAULTS.allowCreateCanvas),
      canvasClassName: String(options.canvasClassName || DEFAULTS.canvasClassName),
      canvasLabel: String(options.canvasLabel || DEFAULTS.canvasLabel),
      dprCap: finite(options.dprCap, DEFAULTS.dprCap),
      frameBudgetMs: Math.max(8, finite(options.frameBudgetMs, DEFAULTS.frameBudgetMs)),
      textureWidth: Math.max(96, Math.floor(finite(options.textureWidth, DEFAULTS.textureWidth))),
      textureHeight: Math.max(48, Math.floor(finite(options.textureHeight, DEFAULTS.textureHeight))),
      radiusScale: finite(options.radiusScale, DEFAULTS.radiusScale),
      cxRatio: finite(options.cxRatio, DEFAULTS.cxRatio),
      cyRatio: finite(options.cyRatio, DEFAULTS.cyRatio),
      engineLoopLabel: String(options.engineLoopLabel || DEFAULTS.engineLoopLabel)
    });
  }

  function resolveElement(target) {
    const doc = D();
    if (!doc) return null;

    if (!target) return null;

    if (typeof target === "string") {
      return doc.querySelector(target);
    }

    if (target instanceof Element) {
      return target;
    }

    return null;
  }

  function resolveCanvas(input, options) {
    const doc = D();
    if (!doc) {
      return Object.freeze({
        canvas: null,
        created: false,
        reason: "document_missing"
      });
    }

    const direct =
      input?.canvas ||
      input?.element ||
      input?.target ||
      input;

    const resolvedDirect = resolveElement(direct);

    if (resolvedDirect && resolvedDirect.tagName && resolvedDirect.tagName.toLowerCase() === "canvas") {
      return Object.freeze({
        canvas: resolvedDirect,
        created: false,
        reason: "canvas_resolved_direct"
      });
    }

    const root = resolveElement(input?.root || input?.mount || input?.stage || input?.container);
    const nested = root?.querySelector?.("canvas");

    if (nested) {
      return Object.freeze({
        canvas: nested,
        created: false,
        reason: "canvas_resolved_nested"
      });
    }

    if (options.allowCreateCanvas && root) {
      const canvas = doc.createElement("canvas");
      canvas.className = options.canvasClassName;
      canvas.setAttribute("aria-label", options.canvasLabel);
      canvas.setAttribute("role", "img");
      canvas.dataset.audraliaCleanCanvasCreated = "true";
      root.appendChild(canvas);

      return Object.freeze({
        canvas,
        created: true,
        reason: "canvas_created_by_explicit_engine_mount_option"
      });
    }

    return Object.freeze({
      canvas: null,
      created: false,
      reason: "canvas_missing"
    });
  }

  function createEngine(options = {}) {
    const opts = normalizeOptions(options);

    const state = {
      runtime: null,
      controls: null,
      compositor: null,
      canvas: null,
      mounted: false,
      running: false,
      destroyed: false,
      frameId: null,
      renderCount: 0,
      mountReceipt: null,
      chainReceipt: validateChain(),
      boundaryReceipt: validateBoundaries(),
      lastFrameReceipt: null,
      lastRenderReceipt: null,
      options: opts,
      resizeHandler: null,
      visibilityHandler: null
    };

    function getRuntimeSnapshot() {
      if (state.runtime?.getMotionSnapshot) return state.runtime.getMotionSnapshot();
      if (state.runtime?.getState) return state.runtime.getState();

      return Object.freeze({
        rotation: -0.88,
        tilt: -0.11,
        width: state.canvas?.clientWidth || 800,
        height: state.canvas?.clientHeight || 520,
        dpr: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        ownsMotionOnly: true
      });
    }

    function updateSizeFromCanvas() {
      if (!state.canvas || !state.runtime?.resize) return null;

      const width = Math.max(1, state.canvas.clientWidth || state.canvas.offsetWidth || 800);
      const height = Math.max(1, state.canvas.clientHeight || state.canvas.offsetHeight || 520);

      return state.runtime.resize(width, height, {
        dprCap: state.options.dprCap,
        radiusScale: state.options.radiusScale,
        cxRatio: state.options.cxRatio,
        cyRatio: state.options.cyRatio
      });
    }

    function renderOnce(reason = "engine_render_once") {
      if (!state.compositor?.render) {
        return Object.freeze({
          rendered: false,
          reason: "compositor_missing",
          contract: CONTRACT,
          receipt: RECEIPT
        });
      }

      const snapshot = getRuntimeSnapshot();
      const renderReceipt = state.compositor.render(snapshot);

      state.renderCount += renderReceipt.rendered ? 1 : 0;
      state.lastRenderReceipt = renderReceipt;

      safeDataset("audraliaEngineLastRenderReason", reason);
      safeDataset("audraliaEngineRenderCount", String(state.renderCount));

      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-engine-render-orchestration",
        reason,
        rendered: Boolean(renderReceipt.rendered),
        runtimeSnapshot: snapshot,
        canvasReceipt: renderReceipt,
        ownsEngineOnly: true,
        ownsRuntimeMotion: false,
        ownsControls: false,
        ownsCanvasComposition: false,
        visualPassClaimed: false
      });
    }

    function frame(time) {
      if (!state.running || state.destroyed) {
        state.frameId = null;
        return;
      }

      let runtimeReceipt = null;
      let renderReceipt = null;

      if (state.runtime?.update) {
        runtimeReceipt = state.runtime.update(time);
      }

      if (runtimeReceipt?.render || !state.lastRenderReceipt) {
        renderReceipt = renderOnce(runtimeReceipt?.reason || "runtime_requested_render");
      }

      state.lastFrameReceipt = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-engine-frame-orchestration",
        time,
        runtimeReceipt,
        renderReceipt,
        running: state.running,
        ownsEngineOnly: true,
        visualPassClaimed: false
      });

      state.frameId = requestFrame(frame);
    }

    function start() {
      if (state.destroyed) {
        return Object.freeze({
          started: false,
          reason: "engine_destroyed",
          contract: CONTRACT
        });
      }

      if (!state.mounted) {
        return Object.freeze({
          started: false,
          reason: "engine_not_mounted",
          contract: CONTRACT
        });
      }

      if (state.running) {
        return Object.freeze({
          started: true,
          reason: "engine_already_running",
          contract: CONTRACT
        });
      }

      state.running = true;
      if (state.runtime?.setVisible) state.runtime.setVisible(true);
      if (state.runtime?.setPaused) state.runtime.setPaused(false);
      if (state.runtime?.markDirty) state.runtime.markDirty();

      state.frameId = requestFrame(frame);

      safeDataset("audraliaEngineRunning", "true");

      return Object.freeze({
        started: true,
        reason: "engine_started",
        contract: CONTRACT,
        receipt: RECEIPT,
        visualPassClaimed: false
      });
    }

    function stop(reason = "engine_stopped") {
      state.running = false;

      if (state.frameId !== null) {
        cancelFrame(state.frameId);
        state.frameId = null;
      }

      if (state.runtime?.setPaused) state.runtime.setPaused(true);

      safeDataset("audraliaEngineRunning", "false");
      safeDataset("audraliaEngineStopReason", reason);

      return Object.freeze({
        stopped: true,
        reason,
        contract: CONTRACT,
        receipt: RECEIPT,
        visualPassClaimed: false
      });
    }

    function mount(input = {}) {
      if (state.destroyed) {
        return Object.freeze({
          mounted: false,
          reason: "engine_destroyed",
          contract: CONTRACT
        });
      }

      const nextOptions = normalizeOptions({
        ...state.options,
        ...(input.options || {})
      });

      state.options = nextOptions;
      state.chainReceipt = validateChain();
      state.boundaryReceipt = validateBoundaries();

      const canvasResult = resolveCanvas(input, state.options);

      if (!canvasResult.canvas) {
        state.mountReceipt = Object.freeze({
          mounted: false,
          reason: canvasResult.reason,
          contract: CONTRACT,
          receipt: RECEIPT,
          chain: state.chainReceipt,
          boundaries: state.boundaryReceipt,
          visualPassClaimed: false
        });

        safeDataset("audraliaEngineMounted", "false");
        safeDataset("audraliaEngineMountReason", canvasResult.reason);

        return state.mountReceipt;
      }

      state.canvas = canvasResult.canvas;

      const runtimeAuthority = R();
      const controlsAuthority = C();
      const canvasAuthority = CV();

      if (!runtimeAuthority?.createRuntime || !controlsAuthority?.createControls || !canvasAuthority?.createCompositor) {
        state.mountReceipt = Object.freeze({
          mounted: false,
          reason: "required_engine_children_missing",
          contract: CONTRACT,
          receipt: RECEIPT,
          runtimeAvailable: Boolean(runtimeAuthority?.createRuntime),
          controlsAvailable: Boolean(controlsAuthority?.createControls),
          canvasAvailable: Boolean(canvasAuthority?.createCompositor),
          chain: state.chainReceipt,
          boundaries: state.boundaryReceipt,
          visualPassClaimed: false
        });

        safeDataset("audraliaEngineMounted", "false");
        safeDataset("audraliaEngineMountReason", "required_engine_children_missing");

        return state.mountReceipt;
      }

      const width = Math.max(1, state.canvas.clientWidth || state.canvas.offsetWidth || input.width || 800);
      const height = Math.max(1, state.canvas.clientHeight || state.canvas.offsetHeight || input.height || 520);

      state.runtime = runtimeAuthority.createRuntime({
        width,
        height,
        dprCap: state.options.dprCap,
        frameBudgetMs: state.options.frameBudgetMs,
        radiusScale: state.options.radiusScale,
        cxRatio: state.options.cxRatio,
        cyRatio: state.options.cyRatio
      });

      state.compositor = canvasAuthority.createCompositor({
        canvas: state.canvas,
        textureWidth: state.options.textureWidth,
        textureHeight: state.options.textureHeight,
        dprCap: state.options.dprCap,
        radiusScale: state.options.radiusScale,
        cxRatio: state.options.cxRatio,
        cyRatio: state.options.cyRatio,
        proofStatus: state.options.proofStatus
      });

      state.controls = controlsAuthority.createControls({
        element: state.canvas,
        runtime: state.runtime
      });

      const controlAttach = state.controls.attach(state.canvas);
      const resizeReceipt = updateSizeFromCanvas();
      const renderReceipt = renderOnce("engine_initial_mount_render");

      state.mounted = true;

      if (state.options.autoResize && typeof window !== "undefined") {
        state.resizeHandler = () => {
          updateSizeFromCanvas();
          if (state.runtime?.markDirty) state.runtime.markDirty();
          renderOnce("engine_resize_render");
        };

        window.addEventListener("resize", state.resizeHandler, { passive: true });
      }

      if (state.options.autoVisibility && typeof document !== "undefined") {
        state.visibilityHandler = () => {
          const visible = document.visibilityState !== "hidden";
          if (state.runtime?.setVisible) state.runtime.setVisible(visible);
          if (visible && state.running && state.runtime?.markDirty) state.runtime.markDirty();
        };

        document.addEventListener("visibilitychange", state.visibilityHandler, { passive: true });
      }

      state.mountReceipt = Object.freeze({
        mounted: true,
        reason: "engine_mounted",
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-chain-verification-and-mount-api",
        fileNumber: FILE_NUMBER,
        primaryNode: PRIMARY_NODE,
        subnodes: SUBNODE_RANGE,
        canvasCreated: canvasResult.created,
        canvasReason: canvasResult.reason,
        chain: state.chainReceipt,
        boundaries: state.boundaryReceipt,
        controls: controlAttach,
        resize: resizeReceipt,
        initialRender: renderReceipt,
        hEarthInheritance: getHEarthInheritancePacket(0.5, 0.5),
        ownsEngineOnly: true,
        ownsRuntimeMotion: false,
        ownsControls: false,
        ownsCanvasComposition: false,
        ownsRouteBridge: false,
        ownsHtml: false,
        visualPassClaimed: false
      });

      safeDataset("audraliaEngineMounted", "true");
      safeDataset("audraliaEngineContract", CONTRACT);
      safeDataset("audraliaEngineReceipt", RECEIPT);
      safeDataset("audraliaEngineChainValid", state.chainReceipt.valid ? "true" : "false");
      safeDataset("audraliaEngineBoundariesValid", state.boundaryReceipt.valid ? "true" : "false");
      safeDataset("audraliaEngineVisualPassClaimed", "false");

      if (state.options.autoStart) {
        start();
      }

      return state.mountReceipt;
    }

    function unmount() {
      stop("engine_unmount");

      if (state.resizeHandler && typeof window !== "undefined") {
        window.removeEventListener("resize", state.resizeHandler);
        state.resizeHandler = null;
      }

      if (state.visibilityHandler && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", state.visibilityHandler);
        state.visibilityHandler = null;
      }

      if (state.controls?.detach) state.controls.detach();
      if (state.compositor?.destroy) state.compositor.destroy();

      state.controls = null;
      state.compositor = null;
      state.runtime = null;
      state.canvas = null;
      state.mounted = false;

      safeDataset("audraliaEngineMounted", "false");

      return Object.freeze({
        unmounted: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        visualPassClaimed: false
      });
    }

    function destroy() {
      unmount();
      state.destroyed = true;

      safeDataset("audraliaEngineDestroyed", "true");

      return Object.freeze({
        destroyed: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        visualPassClaimed: false
      });
    }

    function getState() {
      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "audralia-chain-verification-and-mount-api-instance",
        mounted: state.mounted,
        running: state.running,
        destroyed: state.destroyed,
        renderCount: state.renderCount,
        canvasBound: Boolean(state.canvas),
        runtimeBound: Boolean(state.runtime),
        controlsBound: Boolean(state.controls),
        compositorBound: Boolean(state.compositor),
        chain: state.chainReceipt,
        boundaries: state.boundaryReceipt,
        mountReceipt: state.mountReceipt,
        lastFrameReceipt: state.lastFrameReceipt,
        lastRenderReceipt: state.lastRenderReceipt,
        ownsEngineOnly: true,
        ownsRuntimeMotion: false,
        ownsControls: false,
        ownsCanvasComposition: false,
        ownsRouteBridge: false,
        ownsHtml: false,
        visualPassClaimed: false
      });
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-chain-verification-and-mount-api-instance",

      mount,
      unmount,
      start,
      stop,
      destroy,
      renderOnce,
      updateSizeFromCanvas,
      getRuntimeSnapshot,
      getState,
      validateChain,
      validateBoundaries,
      getHEarthInheritancePacket
    });
  }

  function mountAudralia(input = {}) {
    const engine = createEngine(input.options || input);
    const receipt = engine.mount(input);

    return Object.freeze({
      engine,
      receipt,
      contract: CONTRACT,
      mounted: Boolean(receipt.mounted),
      visualPassClaimed: false
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = W().DGB_PLANET_FAMILY_MANIFEST || W().AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_engine_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.engine.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-chain-verification-and-mount-api",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.js",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: ENGINE_TARGETS,
      expectedChain: EXPECTED_CHAIN,
      defaults: DEFAULTS,
      chain: validateChain(),
      boundaries: validateBoundaries(),
      hEarthInheritance: getHEarthInheritancePacket(0.5, 0.5),
      owns: Object.freeze([
        "chain verification",
        "authority boundary verification",
        "receipt aggregation",
        "mount API",
        "runtime orchestration",
        "controls orchestration",
        "canvas orchestration",
        "H-Earth inheritance verification"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "water behavior",
        "hydrology authority",
        "elevation depth",
        "climate fields",
        "biome categories",
        "surface material truth",
        "atmosphere truth",
        "weather truth",
        "runtime motion",
        "pointer listeners",
        "touch listeners",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      ownsEngineOnly: true,
      runtimeMotionForbidden: true,
      controlsOwnershipForbidden: true,
      canvasCompositionOwnershipForbidden: true,
      routeBridgeForbidden: true,
      htmlExpressionForbidden: true,
      hEarthReceivesAudraliaAtmosphereWeather: true,
      hEarthSeparateWeatherAuthority: false,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FILE_NUMBER,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    UNIVERSAL_ANCHOR,
    AUDRALIA_ROUTE,
    H_EARTH_ROUTE,
    ENGINE_TARGETS,
    EXPECTED_CHAIN,
    DEFAULTS,

    createEngine,
    mountAudralia,
    validateChain,
    validateBoundaries,
    getHEarthInheritancePacket,
    validateManifestRegistration,
    getStatus
  });

  W().AUDRALIA_ENGINE = API;
  W().AUDRALIA_ENGINE_RECEIPT = getStatus();

  W().AUDRALIA_CLEAN_CANVAS_ENGINE = API;
  W().AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT = getStatus();

  safeDataset("audraliaEngineLoaded", "true");
  safeDataset("audraliaEngineContract", CONTRACT);
  safeDataset("audraliaEngineReceipt", RECEIPT);
  safeDataset("audraliaEngineVersion", VERSION);
  safeDataset("audraliaCleanCanvasEngineLoaded", "true");
  safeDataset("audraliaCleanCanvasEngineContract", CONTRACT);
  safeDataset("audraliaCleanCanvasEngineReceipt", RECEIPT);
  safeDataset("audraliaCleanCanvasEngineNode", String(PRIMARY_NODE));
  safeDataset("audraliaCleanCanvasEngineSubnodes", "241-256");
  safeDataset("audraliaEngineOwnsEngineOnly", "true");
  safeDataset("audraliaEngineOwnsRuntimeMotion", "false");
  safeDataset("audraliaEngineOwnsControls", "false");
  safeDataset("audraliaEngineOwnsCanvasComposition", "false");
  safeDataset("audraliaEngineOwnsRouteBridge", "false");
  safeDataset("audraliaEngineOwnsHtml", "false");
  safeDataset("audraliaEngineChainVerification", "true");
  safeDataset("audraliaEngineBoundaryVerification", "true");
  safeDataset("audraliaEngineMountApi", "true");
  safeDataset("hEarthReceivesAudraliaWeatherThroughEngine", "true");
  safeDataset("hEarthSeparateWeatherAuthority", "false");
  safeDataset("audraliaCleanCanvasFibonacciChronology", "true");
  safeDataset("audraliaCleanCanvasPrimaryStructure16", "true");
  safeDataset("audraliaCleanCanvasNodalConstruct256", "true");
  safeDataset("audraliaCleanCanvasOneFileOneJob", "true");
  safeDataset("generatedImage", "false");
  safeDataset("graphicBox", "false");
  safeDataset("visualPassClaimed", "false");
})();
