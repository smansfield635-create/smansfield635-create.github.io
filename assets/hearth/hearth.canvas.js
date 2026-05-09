// /assets/hearth/hearth.canvas.js
// HEARTH_G3_CANVAS_ADAPTIVE_HEX_SURFACE_RUNTIME_SELF_HEAL_TNT_v3
// Full-file replacement.
// Family: HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1
// Purpose:
// - Canvas owns mount, sizing, animation loop, runtime pacing, visibility pause, and final presentation.
// - High-density Hearth hex surface owns visual frame rendering.
// - Canvas self-loads hearth.hex.surface.js if route fails to provide it.
// - Runtime adapts render size and frame rate for mobile performance.
// - Terrain and child engines remain source authorities.
// - No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CANVAS_ADAPTIVE_HEX_SURFACE_RUNTIME_SELF_HEAL_TNT_v3";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const PREVIOUS_CONTRACT = "HEARTH_G3_CANVAS_ADAPTIVE_HEX_SURFACE_RUNTIME_TNT_v2";
  const BASELINE = "HEARTH_G3_HIGH_DENSITY_HEX_SURFACE_BASELINE_v1";
  const VERSION = "2026-05-09.hearth-g3-canvas-adaptive-hex-surface-runtime-self-heal";
  const RECEIPT = "HEARTH_G3_CANVAS_ADAPTIVE_HEX_SURFACE_RUNTIME_SELF_HEAL_RECEIPT";

  const EXPECTED_MOUNT_ID = "hearthCanvasMount";
  const SURFACE_KEY = "hearth-g3-hex-surface-self-heal-v3";
  const SURFACE_SRC = `/assets/hearth/hearth.hex.surface.js?v=${SURFACE_KEY}`;

  const PROFILE = Object.freeze({
    mobileLow: {
      name: "mobile-low",
      dprLimit: 1.15,
      renderMin: 260,
      renderMax: 390,
      frameMinMs: 120,
      hexDensity: 190,
      microTerrainStrength: 0.28,
      mountainStrength: 0.40,
      cliffStrength: 0.40,
      valleyStrength: 0.34,
      beachStrength: 0.34,
      islandStrength: 0.34,
      atmosphereStrength: 0.92
    },
    mobileBalanced: {
      name: "mobile-balanced",
      dprLimit: 1.35,
      renderMin: 280,
      renderMax: 470,
      frameMinMs: 90,
      hexDensity: 220,
      microTerrainStrength: 0.34,
      mountainStrength: 0.46,
      cliffStrength: 0.46,
      valleyStrength: 0.38,
      beachStrength: 0.40,
      islandStrength: 0.40,
      atmosphereStrength: 0.96
    },
    mobileHigh: {
      name: "mobile-high",
      dprLimit: 1.55,
      renderMin: 300,
      renderMax: 540,
      frameMinMs: 72,
      hexDensity: 248,
      microTerrainStrength: 0.38,
      mountainStrength: 0.50,
      cliffStrength: 0.50,
      valleyStrength: 0.42,
      beachStrength: 0.44,
      islandStrength: 0.44,
      atmosphereStrength: 1
    },
    desktopBalanced: {
      name: "desktop-balanced",
      dprLimit: 1.65,
      renderMin: 320,
      renderMax: 620,
      frameMinMs: 54,
      hexDensity: 260,
      microTerrainStrength: 0.40,
      mountainStrength: 0.52,
      cliffStrength: 0.52,
      valleyStrength: 0.44,
      beachStrength: 0.46,
      islandStrength: 0.46,
      atmosphereStrength: 1
    },
    desktopHigh: {
      name: "desktop-high",
      dprLimit: 2,
      renderMin: 340,
      renderMax: 720,
      frameMinMs: 46,
      hexDensity: 268,
      microTerrainStrength: 0.42,
      mountainStrength: 0.52,
      cliffStrength: 0.52,
      valleyStrength: 0.44,
      beachStrength: 0.46,
      islandStrength: 0.46,
      atmosphereStrength: 1
    }
  });

  const state = {
    canvas: null,
    ctx: null,
    mount: null,
    raf: 0,
    running: false,
    visible: true,
    intersecting: true,
    lastFrame: 0,
    lastFrameCost: 0,
    averageFrameCost: 0,
    frameCostSamples: 0,
    consecutiveSlowFrames: 0,
    consecutiveFastFrames: 0,
    phase: 0,
    width: 0,
    height: 0,
    cssSize: 0,
    dpr: 1,
    profileKey: "mobileBalanced",
    profile: PROFILE.mobileBalanced,
    hearthHexGeometry: null,
    lastFrameReceipt: null,
    lastStatus: "booting",
    resizeTimer: 0,
    observer: null,
    surfaceLoadPromise: null,
    surfaceLoadStatus: "not-requested",
    surfaceLoadError: ""
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function isMobileRuntime() {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")
    );
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initialProfileKey() {
    if (prefersReducedMotion()) return "mobileLow";
    return isMobileRuntime() ? "mobileBalanced" : "desktopBalanced";
  }

  function setProfile(key, reason = "manual") {
    if (!PROFILE[key]) return;

    state.profileKey = key;
    state.profile = PROFILE[key];

    document.documentElement.dataset.hearthCanvasRuntimeProfile = state.profile.name;
    document.documentElement.dataset.hearthCanvasRuntimeProfileReason = reason;

    resize(true);
  }

  function degradeProfile() {
    const next = {
      desktopHigh: "desktopBalanced",
      desktopBalanced: isMobileRuntime() ? "mobileBalanced" : "mobileHigh",
      mobileHigh: "mobileBalanced",
      mobileBalanced: "mobileLow",
      mobileLow: "mobileLow"
    }[state.profileKey];

    if (next && next !== state.profileKey) {
      setProfile(next, "adaptive-slow-frame");
    }
  }

  function improveProfile() {
    if (prefersReducedMotion()) return;

    const next = {
      mobileLow: "mobileBalanced",
      mobileBalanced: "mobileHigh",
      mobileHigh: isMobileRuntime() ? "mobileHigh" : "desktopBalanced",
      desktopBalanced: "desktopHigh",
      desktopHigh: "desktopHigh"
    }[state.profileKey];

    if (next && next !== state.profileKey) {
      setProfile(next, "adaptive-fast-stable");
    }
  }

  function updateFrameCost(cost) {
    state.lastFrameCost = cost;
    state.frameCostSamples += 1;

    if (state.frameCostSamples === 1) {
      state.averageFrameCost = cost;
    } else {
      state.averageFrameCost = state.averageFrameCost * 0.86 + cost * 0.14;
    }

    const budget = state.profile.frameMinMs * 0.72;

    if (cost > budget) {
      state.consecutiveSlowFrames += 1;
      state.consecutiveFastFrames = 0;
    } else if (cost < budget * 0.42) {
      state.consecutiveFastFrames += 1;
      state.consecutiveSlowFrames = 0;
    } else {
      state.consecutiveSlowFrames = 0;
      state.consecutiveFastFrames = 0;
    }

    if (state.consecutiveSlowFrames >= 4) {
      state.consecutiveSlowFrames = 0;
      degradeProfile();
    }

    if (state.consecutiveFastFrames >= 90) {
      state.consecutiveFastFrames = 0;
      improveProfile();
    }

    document.documentElement.dataset.hearthCanvasLastFrameCostMs = cost.toFixed(2);
    document.documentElement.dataset.hearthCanvasAverageFrameCostMs = state.averageFrameCost.toFixed(2);
  }

  function getMount() {
    let mount = document.getElementById(EXPECTED_MOUNT_ID);

    if (!mount) {
      const parent = document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = EXPECTED_MOUNT_ID;
      mount.dataset.hearthMount = "true";
      mount.dataset.hearthCanvasMountCreatedBy = CONTRACT;
      parent.appendChild(mount);
    }

    return mount;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-canvas-adaptive-hex-runtime-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-canvas-adaptive-hex-runtime-style";
    style.textContent = `
      #${EXPECTED_MOUNT_ID} {
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
        contain: layout paint size;
      }

      #${EXPECTED_MOUNT_ID} canvas[data-hearth-canvas="adaptive-hex-surface-runtime"] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
        image-rendering: auto;
      }

      #${EXPECTED_MOUNT_ID}[data-hearth-canvas-fallback="true"]::after {
        content: attr(data-hearth-canvas-message);
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

  function resize(force = false) {
    if (!state.canvas || !state.mount) return;

    const rect = state.mount.getBoundingClientRect();
    const cssSize = Math.max(260, Math.min(rect.width || 360, rect.height || rect.width || 360));
    const dpr = Math.min(window.devicePixelRatio || 1, state.profile.dprLimit);
    const renderSize = clamp(
      Math.round(cssSize * dpr),
      state.profile.renderMin,
      state.profile.renderMax
    );

    if (!force && state.canvas.width === renderSize && state.canvas.height === renderSize) {
      return;
    }

    state.dpr = dpr;
    state.cssSize = cssSize;
    state.canvas.width = renderSize;
    state.canvas.height = renderSize;
    state.canvas.style.width = `${cssSize}px`;
    state.canvas.style.height = `${cssSize}px`;
    state.width = renderSize;
    state.height = renderSize;
    state.hearthHexGeometry = null;
    state.lastFrameReceipt = null;

    document.documentElement.dataset.hearthCanvasRenderSize = String(renderSize);
    document.documentElement.dataset.hearthCanvasCssSize = String(Math.round(cssSize));
    document.documentElement.dataset.hearthCanvasDevicePixelRatio = String(dpr);
    document.documentElement.dataset.hearthCanvasRuntimeProfile = state.profile.name;
  }

  function installCanvas() {
    state.mount = getMount();
    state.mount.querySelectorAll("canvas[data-hearth-canvas]").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "adaptive-hex-surface-runtime";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.previousContract = PREVIOUS_CONTRACT;
    canvas.dataset.familyContract = FAMILY_CONTRACT;
    canvas.dataset.receipt = RECEIPT;
    canvas.setAttribute("aria-label", "Hearth G3 adaptive high-density hex-surface planet canvas");

    state.mount.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    state.mount.dataset.hearthCanvasContract = CONTRACT;
    state.mount.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    state.mount.dataset.hearthCanvasReceipt = RECEIPT;
    state.mount.dataset.hearthCanvasConsumesHexSurface = "true";
    state.mount.dataset.hearthCanvasAdaptiveRuntime = "true";
    state.mount.dataset.hearthCanvasSelfHealsHexSurface = "true";
    state.mount.dataset.hearthCanvasGeneratedImage = "false";
    state.mount.dataset.hearthCanvasGraphicBox = "false";
    state.mount.dataset.hearthCanvasMessage = "Hearth hex surface is loading.";

    resize(true);
  }

  function clearFallback(message) {
    if (!state.ctx || !state.canvas) return;

    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    const bg = state.ctx.createRadialGradient(
      state.canvas.width * 0.50,
      state.canvas.height * 0.50,
      state.canvas.width * 0.10,
      state.canvas.width * 0.50,
      state.canvas.height * 0.50,
      state.canvas.width * 0.64
    );

    bg.addColorStop(0, "rgba(18, 58, 86, 0.76)");
    bg.addColorStop(0.65, "rgba(4, 13, 26, 0.96)");
    bg.addColorStop(1, "rgba(1, 5, 12, 1)");

    state.ctx.fillStyle = bg;
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

    if (state.mount) {
      state.mount.dataset.hearthCanvasFallback = "true";
      state.mount.dataset.hearthCanvasMessage = message || "Hearth hex surface is loading.";
    }
  }

  function hasSurface() {
    return (
      window.HEARTH_HEX_SURFACE &&
      typeof window.HEARTH_HEX_SURFACE.drawHearthHexSurfaceFrame === "function"
    );
  }

  function removePriorSurfaceScripts() {
    document
      .querySelectorAll('script[src*="/assets/hearth/hearth.hex.surface.js"][data-hearth-canvas-self-heal="true"]')
      .forEach((node) => node.remove());
  }

  function ensureHexSurfaceLoaded() {
    if (hasSurface()) {
      state.surfaceLoadStatus = "available";
      state.surfaceLoadError = "";
      return Promise.resolve(window.HEARTH_HEX_SURFACE);
    }

    if (state.surfaceLoadPromise) {
      return state.surfaceLoadPromise;
    }

    removePriorSurfaceScripts();

    state.surfaceLoadStatus = "loading";
    state.surfaceLoadError = "";
    document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealStatus = "loading";
    document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealSrc = SURFACE_SRC;

    state.surfaceLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SURFACE_SRC;
      script.defer = true;
      script.dataset.hearthCanvasSelfHeal = "true";
      script.dataset.hearthScriptRole = "hexSurface";
      script.dataset.contract = CONTRACT;
      script.dataset.familyContract = FAMILY_CONTRACT;

      script.addEventListener(
        "load",
        () => {
          if (hasSurface()) {
            state.surfaceLoadStatus = "loaded";
            state.surfaceLoadError = "";
            document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealStatus = "loaded";
            resolve(window.HEARTH_HEX_SURFACE);
            return;
          }

          const error = new Error("HEARTH_HEX_SURFACE_LOADED_BUT_API_MISSING");
          state.surfaceLoadStatus = "api-missing";
          state.surfaceLoadError = error.message;
          document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealStatus = "api-missing";
          document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealError = error.message;
          reject(error);
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => {
          const error = new Error(`HEARTH_HEX_SURFACE_LOAD_FAILED ${SURFACE_SRC}`);
          state.surfaceLoadStatus = "failed";
          state.surfaceLoadError = error.message;
          state.surfaceLoadPromise = null;
          document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealStatus = "failed";
          document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealError = error.message;
          reject(error);
        },
        { once: true }
      );

      document.head.appendChild(script);
    });

    return state.surfaceLoadPromise;
  }

  function getPhaseStep() {
    if (prefersReducedMotion()) return 0.000012;
    if (state.profileKey === "mobileLow") return 0.000032;
    if (state.profileKey === "mobileBalanced") return 0.000044;
    return 0.000055;
  }

  function drawFrame(time) {
    if (!state.running || !state.canvas || !state.ctx) return;

    if (!state.visible || !state.intersecting) {
      stamp(state.visible ? "paused-offscreen" : "paused-hidden");
      state.raf = requestAnimationFrame(drawFrame);
      return;
    }

    if (time - state.lastFrame < state.profile.frameMinMs) {
      state.raf = requestAnimationFrame(drawFrame);
      return;
    }

    if (!hasSurface()) {
      ensureHexSurfaceLoaded().catch(() => {});
      clearFallback(
        state.surfaceLoadStatus === "failed" || state.surfaceLoadStatus === "api-missing"
          ? "Hearth hex surface failed to load."
          : "Hearth hex surface is loading."
      );
      stamp(`hex-surface-${state.surfaceLoadStatus}`);
      state.raf = requestAnimationFrame(drawFrame);
      return;
    }

    const frameStart = performance.now();

    state.lastFrame = time;
    state.phase = time * getPhaseStep();

    if (state.mount) {
      state.mount.dataset.hearthCanvasFallback = "false";
      state.mount.dataset.hearthCanvasMessage = "";
    }

    try {
      state.lastFrameReceipt = window.HEARTH_HEX_SURFACE.drawHearthHexSurfaceFrame(state, {
        radiusRatio: 0.456,
        hexDensity: state.profile.hexDensity,
        minHexRadius: 0.92,
        maxHexRadius: 3.3,
        microTerrainStrength: state.profile.microTerrainStrength,
        mountainStrength: state.profile.mountainStrength,
        cliffStrength: state.profile.cliffStrength,
        valleyStrength: state.profile.valleyStrength,
        beachStrength: state.profile.beachStrength,
        islandStrength: state.profile.islandStrength,
        atmosphereStrength: state.profile.atmosphereStrength
      });

      const cost = performance.now() - frameStart;
      updateFrameCost(cost);
      stamp("rendering");
    } catch (error) {
      document.documentElement.dataset.hearthCanvasHexSurfaceError =
        error && error.message ? error.message : String(error);
      clearFallback("Hearth hex surface render error.");
      stamp("hex-surface-error");
    }

    state.raf = requestAnimationFrame(drawFrame);
  }

  function stamp(status) {
    state.lastStatus = status;

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthCanvasBaseline = BASELINE;
    document.documentElement.dataset.hearthCanvasFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    document.documentElement.dataset.hearthCanvasStatus = status;
    document.documentElement.dataset.hearthCanvasConsumes = "hex.surface";
    document.documentElement.dataset.hearthCanvasConsumesHexSurface = "true";
    document.documentElement.dataset.hearthCanvasAdaptiveRuntime = "true";
    document.documentElement.dataset.hearthCanvasSelfHealsHexSurface = "true";
    document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealStatus = state.surfaceLoadStatus;
    document.documentElement.dataset.hearthCanvasRuntimeProfile = state.profile.name;
    document.documentElement.dataset.hearthCanvasRuntimeFrameMinMs = String(state.profile.frameMinMs);
    document.documentElement.dataset.hearthCanvasGeneratedImage = "false";
    document.documentElement.dataset.hearthCanvasGraphicBox = "false";
    document.documentElement.dataset.hearthCanvasVisualPassClaimed = "false";
    document.documentElement.dataset.hearthCanvasTerrainReady = String(!!window.HEARTH_TERRAIN);
    document.documentElement.dataset.hearthCanvasMountainsReady = String(!!window.HEARTH_MOUNTAINS);
    document.documentElement.dataset.hearthCanvasCliffsReady = String(!!window.HEARTH_CLIFFS);
    document.documentElement.dataset.hearthCanvasValleysReady = String(!!window.HEARTH_VALLEYS);
    document.documentElement.dataset.hearthCanvasBeachesReady = String(!!window.HEARTH_BEACHES);
    document.documentElement.dataset.hearthCanvasIslandsReady = String(!!window.HEARTH_ISLANDS);
    document.documentElement.dataset.hearthCanvasHexReady = String(!!window.HEARTH_HEX);
    document.documentElement.dataset.hearthCanvasHexSurfaceReady = String(hasSurface());
    document.documentElement.dataset.hearthCanvasVisible = String(state.visible);
    document.documentElement.dataset.hearthCanvasIntersecting = String(state.intersecting);

    if (state.surfaceLoadError) {
      document.documentElement.dataset.hearthCanvasHexSurfaceSelfHealError = state.surfaceLoadError;
    }

    if (state.lastFrameReceipt) {
      document.documentElement.dataset.hearthCanvasLastFrameReceipt = String(state.lastFrameReceipt.receipt || "");
      document.documentElement.dataset.hearthCanvasHexSamples = String(state.lastFrameReceipt.samples || 0);
    }
  }

  function receiptModule(name) {
    const mod = window[name];
    if (!mod || typeof mod.receipt !== "function") return null;
    try {
      return mod.receipt();
    } catch (_) {
      return null;
    }
  }

  function exposeReceipt() {
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      authority: "canvas-adaptive-hex-surface-runtime-self-heal",
      baseline: BASELINE,
      surfaceSrc: SURFACE_SRC,
      runtime: {
        adaptive: true,
        visibilityPause: true,
        intersectionPause: true,
        mobileProfiles: true,
        frameCostAdaptiveQuality: true,
        surfaceSelfHeal: true,
        generatedImage: false,
        graphicBox: false
      },
      consumes: [
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX",
        "HEARTH_TERRAIN",
        "HEARTH_MOUNTAINS",
        "HEARTH_CLIFFS",
        "HEARTH_VALLEYS",
        "HEARTH_BEACHES",
        "HEARTH_ISLANDS"
      ],
      doesNotOwn: [
        "terrain authority",
        "mountain authority",
        "cliff authority",
        "valley authority",
        "beach authority",
        "island authority",
        "hex logical substrate",
        "hex surface render method",
        "active weather",
        "clouds",
        "humidity",
        "generated images",
        "GraphicBox"
      ],
      status: () => ({
        running: state.running,
        visible: state.visible,
        intersecting: state.intersecting,
        width: state.width,
        height: state.height,
        cssSize: state.cssSize,
        dpr: state.dpr,
        profileKey: state.profileKey,
        profile: state.profile.name,
        frameMinMs: state.profile.frameMinMs,
        lastFrameCost: state.lastFrameCost,
        averageFrameCost: state.averageFrameCost,
        lastStatus: state.lastStatus,
        surfaceLoadStatus: state.surfaceLoadStatus,
        surfaceLoadError: state.surfaceLoadError,
        surfaceReady: hasSurface(),
        surfaceSrc: SURFACE_SRC,
        lastFrameReceipt: state.lastFrameReceipt,
        hex: receiptModule("HEARTH_HEX"),
        hexSurface: window.HEARTH_HEX_SURFACE && typeof window.HEARTH_HEX_SURFACE.getHearthHexSurfaceStatus === "function"
          ? window.HEARTH_HEX_SURFACE.getHearthHexSurfaceStatus(state)
          : null,
        terrain: receiptModule("HEARTH_TERRAIN"),
        mountains: receiptModule("HEARTH_MOUNTAINS"),
        cliffs: receiptModule("HEARTH_CLIFFS"),
        valleys: receiptModule("HEARTH_VALLEYS"),
        beaches: receiptModule("HEARTH_BEACHES"),
        islands: receiptModule("HEARTH_ISLANDS")
      })
    });
  }

  function installVisibilityRuntime() {
    document.addEventListener("visibilitychange", () => {
      state.visible = document.visibilityState !== "hidden";
      stamp(state.visible ? "visibility-resumed" : "visibility-paused");
    });

    if ("IntersectionObserver" in window && state.mount) {
      state.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          state.intersecting = Boolean(entry && entry.isIntersecting);
          stamp(state.intersecting ? "intersection-resumed" : "intersection-paused");
        },
        {
          root: null,
          threshold: 0.05
        }
      );

      state.observer.observe(state.mount);
    }
  }

  function boot() {
    dispose();

    state.profileKey = initialProfileKey();
    state.profile = PROFILE[state.profileKey];
    state.visible = document.visibilityState !== "hidden";
    state.intersecting = true;
    state.averageFrameCost = 0;
    state.frameCostSamples = 0;
    state.consecutiveSlowFrames = 0;
    state.consecutiveFastFrames = 0;
    state.surfaceLoadPromise = null;
    state.surfaceLoadStatus = hasSurface() ? "available" : "not-requested";
    state.surfaceLoadError = "";

    installStyle();
    installCanvas();
    installVisibilityRuntime();
    exposeReceipt();
    ensureHexSurfaceLoaded().catch(() => {});
    stamp("booted");

    state.running = true;
    state.lastFrame = 0;
    state.raf = requestAnimationFrame(drawFrame);

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
  }

  function handleResize() {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = setTimeout(() => {
      resize(true);
      stamp("resized");
    }, 160);
  }

  function dispose() {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    if (state.observer) {
      try {
        state.observer.disconnect();
      } catch (_) {}
      state.observer = null;
    }

    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);

    const priorStyle = document.getElementById("hearth-canvas-adaptive-hex-runtime-style");
    if (priorStyle) priorStyle.remove();

    const mount = document.getElementById(EXPECTED_MOUNT_ID);
    if (mount) {
      mount.querySelectorAll('canvas[data-hearth-canvas="adaptive-hex-surface-runtime"]').forEach((node) => node.remove());
    }

    state.canvas = null;
    state.ctx = null;
    state.hearthHexGeometry = null;
    state.lastFrameReceipt = null;

    document.documentElement.dataset.hearthCanvasDisposed = "true";
  }

  window.__HEARTH_CANVAS_ADAPTIVE_RUNTIME_SELF_HEAL_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_ADAPTIVE_RUNTIME_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_HEX_SURFACE_CONSUMER_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_CHILD_ENGINE_COMPOSITION_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_LANDFORM_CONSUMPTION_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_BOUNDARY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_FAMILY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_ZONING_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_VISIBLE_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
