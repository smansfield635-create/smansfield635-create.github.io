// /assets/audralia/clean/engine/audralia.engine.js
// AUDRALIA_G2_6_PARENT_PROJECTOR_CONSUMES_MOTION_STATE_NO_STRETCH_TNT_v1
// Full-file replacement.
// Parent-facing contract preserved for route bridge compatibility:
// AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1
//
// Purpose:
// - Keep FORM_VISIBLE parent handoff stable.
// - Consume motion.js spherical rotation/pitch state.
// - Prevent finger drag from stretching, translating, scaling, skewing, or CSS-transforming the rendered frame.
// - Reproject the planet and all children from spherical state on every redraw.
// - Provide a stable parent payload: geometry + project(lonRad, latRad, elevation).
//
// Does not own: Gratitude topology, Gratitude hydrology, Gratitude surface material, continents truth,
// terrain elevation, mountains, animals, plants, climate, route bridge, HTML shell, generated image,
// GraphicBox, or final visual-pass claim.

(() => {
  "use strict";

  const PARENT_FACING_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const INTERNAL_CONTRACT = "AUDRALIA_G2_6_PARENT_PROJECTOR_CONSUMES_MOTION_STATE_NO_STRETCH_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_6_PARENT_PROJECTOR_CONSUMES_MOTION_STATE_NO_STRETCH_RECEIPT_v1";
  const PREVIOUS_INTERNAL_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const TARGET = "/assets/audralia/clean/engine/audralia.engine.js";
  const ROUTE = "/showroom/globe/audralia/";

  const MOTION_PATH = "/assets/audralia/clean/engine/audralia/engine/motion.js";
  const CONTINENTS_PATH = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const SKY_PATH = "/assets/audralia/clean/engine/audralia/engine/sky.js";

  const MOTION_EXPECTED_CONTRACT = "AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_TNT_v1";
  const CONTINENTS_EXPECTED_INTERNAL = "AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HEX_SURFACE_RENDER_ADAPTER_TNT_v1";

  const TAU = Math.PI * 2;

  const CONFIG = Object.freeze({
    maxDpr: 1.35,
    minCanvasSize: 300,
    maxCanvasSize: 900,
    centerX: 0.5,
    centerY: 0.50,
    radiusRatio: 0.382,
    minRadius: 120,
    fallbackRotationSpeed: 0.000052,
    fallbackRotation: -0.92,
    fallbackPitch: -0.11,
    defaultStageHeight: 520
  });

  const COLORS = Object.freeze({
    background0: "rgba(2, 5, 15, 1)",
    background1: "rgba(4, 15, 36, 1)",
    background2: "rgba(1, 4, 13, 1)",
    ocean0: "rgba(35, 150, 190, 1)",
    ocean1: "rgba(7, 82, 135, 1)",
    ocean2: "rgba(3, 26, 70, 1)",
    ocean3: "rgba(2, 12, 36, 1)",
    rim: "rgba(188, 229, 255, 0.42)",
    rim2: "rgba(88, 178, 232, 0.18)",
    atmosphere: "rgba(112, 205, 240, 0.13)",
    specular: "rgba(255, 255, 255, 0.34)"
  });

  const state = {
    contract: PARENT_FACING_CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    receipt: RECEIPT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    target: TARGET,
    route: ROUTE,

    mounted: false,
    booted: false,
    disposed: false,
    canvasCreated: false,
    formVisible: false,

    mountNode: null,
    canvas: null,
    ctx: null,

    dpr: 1,
    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    cx: 0,
    cy: 0,
    radius: 0,

    frameId: 0,
    renderScheduled: false,
    renderCount: 0,
    requestRenderCount: 0,
    lastFrameTime: 0,

    dynamicCacheNonce: "",
    childLoadStarted: false,
    childLoadComplete: false,

    motionLoaded: false,
    motionContract: "",
    motionConsumed: false,
    motionStateActive: false,
    dragMode: "",
    projectionConsumesMotion: true,

    continentsLoaded: false,
    continentsContract: "",
    continentsInternalContract: "",
    continentsConsumed: false,
    continentsDrawCount: 0,

    skyLoaded: false,
    skyConsumed: false,

    canvasTransformForbidden: true,
    cssTransformForbidden: true,
    bitmapStretchForbidden: true,
    screenPlaneDragForbidden: true,
    parentProjectionActive: true,
    sphericalProjectionActive: true,

    lastRotation: CONFIG.fallbackRotation,
    lastPitch: CONFIG.fallbackPitch,
    fallbackRotation: CONFIG.fallbackRotation,

    lastDrawError: "",
    lastDrawSummary: null,
    lastChildSummary: null,
    errors: [],

    ownsTopology: false,
    ownsHydrology: false,
    ownsSurface: false,
    ownsTerrain: false,
    ownsElevation: false,
    ownsContinentsTruth: false,
    ownsMotionState: false,
    ownsRoute: false,
    ownsHtml: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false
  };

  const loadPromises = new Map();

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrapRadians(value) {
    let out = finite(value, 0);
    while (out <= -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function now() {
    if (hasWindow() && window.performance && typeof window.performance.now === "function") {
      return window.performance.now();
    }
    return Date.now();
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.lastDrawError = `${scope}: ${message}`;
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
    publishReceipt(scope);
  }

  function getRoot() {
    return hasDocument() ? document.documentElement : null;
  }

  function getDynamicCacheNonce() {
    if (state.dynamicCacheNonce) return state.dynamicCacheNonce;

    const root = getRoot();

    const rootNonce =
      root &&
      (
        root.getAttribute("data-audralia-page-cache-nonce") ||
        root.getAttribute("data-audralia-route-bridge-cache-key") ||
        root.getAttribute("data-html-cache-key")
      );

    const bootstrapNonce =
      hasWindow() &&
      window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT &&
      window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey
        ? String(window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey)
        : "";

    const globalNonce =
      hasWindow() && window.AUDRALIA_PAGE_CACHE_NONCE
        ? String(window.AUDRALIA_PAGE_CACHE_NONCE)
        : "";

    state.dynamicCacheNonce =
      globalNonce ||
      bootstrapNonce ||
      rootNonce ||
      `${INTERNAL_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

    if (hasWindow()) window.AUDRALIA_PAGE_CACHE_NONCE = state.dynamicCacheNonce;
    if (root) {
      root.setAttribute("data-audralia-page-cache-nonce", state.dynamicCacheNonce);
      root.setAttribute("data-audralia-parent-projector-cache-nonce", state.dynamicCacheNonce);
    }

    return state.dynamicCacheNonce;
  }

  function versioned(path) {
    return `${path}?v=${encodeURIComponent(getDynamicCacheNonce())}`;
  }

  function loadClassicScript(path, key) {
    if (!hasDocument()) return Promise.resolve(false);

    const src = versioned(path);

    if (loadPromises.has(src)) return loadPromises.get(src);

    const existing = Array.from(document.scripts).find((script) => {
      const scriptSrc = script.getAttribute("src") || "";
      return scriptSrc === src || scriptSrc.startsWith(`${path}?`);
    });

    if (existing && existing.dataset.audraliaLoaded === "true") {
      return Promise.resolve(true);
    }

    const promise = new Promise((resolve) => {
      const script = existing || document.createElement("script");

      script.setAttribute("data-audralia-parent-projector-loader", INTERNAL_CONTRACT);
      script.setAttribute("data-audralia-parent-projector-child", key);
      script.setAttribute("data-generated-image", "false");
      script.setAttribute("data-graphic-box", "false");
      script.setAttribute("data-visual-pass-claimed", "false");

      script.onload = () => {
        script.dataset.audraliaLoaded = "true";
        resolve(true);
      };

      script.onerror = () => resolve(false);

      if (!existing) {
        script.src = src;
        script.async = false;
        script.defer = false;
        document.head.appendChild(script);
      } else {
        resolve(true);
      }
    });

    loadPromises.set(src, promise);
    return promise;
  }

  function resolveMotionApi() {
    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_MOTION ||
      window.AUDRALIA_CLEAN_MOTION ||
      window.AUDRALIA_CLEAN_CANVAS_MOTION ||
      window.AUDRALIA_CLEAN_CANVAS_MOTION_ENGINE ||
      window.AUDRALIA_MOTION_ENGINE ||
      null
    );
  }

  function resolveContinentsApi() {
    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_CLEAN_CANVAS_CONTINENTS ||
      window.AUDRALIA_CONTINENTS_ENGINE ||
      window.AUDRALIA_CLEAN_CONTINENTS_ENGINE ||
      window.AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE ||
      window.AudraliaContinents ||
      window.audraliaContinents ||
      null
    );
  }

  function resolveSkyApi() {
    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_SKY ||
      window.AUDRALIA_CLEAN_SKY ||
      window.AUDRALIA_CLEAN_CANVAS_SKY ||
      window.AUDRALIA_SKY_ENGINE ||
      null
    );
  }

  async function loadChildren() {
    if (state.childLoadStarted && state.childLoadComplete) return true;

    state.childLoadStarted = true;
    publishReceipt("child-load-start");

    const motionOk = await loadClassicScript(MOTION_PATH, "motion");
    const continentsOk = await loadClassicScript(CONTINENTS_PATH, "continents");
    const skyOk = await loadClassicScript(SKY_PATH, "sky");

    const motion = resolveMotionApi();
    const continents = resolveContinentsApi();
    const sky = resolveSkyApi();

    state.motionLoaded = Boolean(motionOk && motion);
    state.continentsLoaded = Boolean(continentsOk && continents);
    state.skyLoaded = Boolean(skyOk && sky);

    if (motion && typeof motion.getStatus === "function") {
      const status = safe(() => motion.getStatus(), {});
      state.motionContract = String(status.contract || motion.contract || "");
      state.dragMode = String(status.dragMode || "");
    } else if (motion) {
      state.motionContract = String(motion.contract || "");
    }

    if (continents && typeof continents.getStatus === "function") {
      const status = safe(() => continents.getStatus(), {});
      state.continentsContract = String(status.contract || continents.CONTRACT || continents.contract || "");
      state.continentsInternalContract = String(status.internalContract || continents.INTERNAL_CONTRACT || "");
    } else if (continents) {
      state.continentsContract = String(continents.CONTRACT || continents.contract || "");
      state.continentsInternalContract = String(continents.INTERNAL_CONTRACT || "");
    }

    if (motion && typeof motion.bind === "function" && state.mountNode) {
      safe(() => motion.bind(state.mountNode, { parent: api }), null);
    } else if (motion && typeof motion.mount === "function" && state.mountNode) {
      safe(() => motion.mount(state.mountNode, { parent: api }), null);
    }

    state.childLoadComplete = true;
    state.lastChildSummary = {
      motionLoaded: state.motionLoaded,
      motionContract: state.motionContract,
      continentsLoaded: state.continentsLoaded,
      continentsContract: state.continentsContract,
      continentsInternalContract: state.continentsInternalContract,
      skyLoaded: state.skyLoaded
    };

    publishReceipt("child-load-complete");
    requestRender("child-load-complete");

    return true;
  }

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
  }

  function resolveMountNode(node) {
    if (node && node.nodeType === 1) return node;

    if (!hasDocument()) return null;

    return (
      document.querySelector("[data-audralia-form-mount='true']") ||
      document.querySelector("[data-audralia-mount='true']") ||
      document.querySelector("[data-audralia-stage='true']") ||
      document.querySelector("#audralia-form-mount") ||
      document.querySelector("#audralia-stage") ||
      document.querySelector("#main") ||
      document.body
    );
  }

  function prepareMount(mountNode) {
    if (!mountNode || !mountNode.style) return;

    mountNode.style.position = mountNode.style.position || "relative";
    mountNode.style.overflow = "hidden";
    mountNode.style.touchAction = "none";
    mountNode.style.userSelect = "none";
    mountNode.style.WebkitUserSelect = "none";

    if (!mountNode.style.minHeight) {
      mountNode.style.minHeight = `${CONFIG.defaultStageHeight}px`;
    }

    mountNode.setAttribute("data-audralia-parent-projector-mount", "true");
    mountNode.setAttribute("data-audralia-motion-no-stretch", "true");
    mountNode.setAttribute("data-audralia-parent-contract", PARENT_FACING_CONTRACT);
    mountNode.setAttribute("data-audralia-parent-internal-contract", INTERNAL_CONTRACT);

    suppressTransforms(mountNode);
  }

  function suppressTransforms(node) {
    if (!node || !node.style) return 0;

    let count = 0;

    if (node.style.transform && node.style.transform !== "none") {
      node.style.transform = "none";
      count += 1;
    }

    if (node.style.translate && node.style.translate !== "none") {
      node.style.translate = "none";
      count += 1;
    }

    if (node.style.scale && node.style.scale !== "none") {
      node.style.scale = "none";
      count += 1;
    }

    if (node.style.rotate && node.style.rotate !== "none") {
      node.style.rotate = "none";
      count += 1;
    }

    node.style.transformOrigin = "50% 50%";

    return count;
  }

  function enforceNoStretch() {
    let count = 0;

    count += suppressTransforms(state.mountNode);
    count += suppressTransforms(state.canvas);

    if (hasDocument()) {
      document
        .querySelectorAll(
          "canvas[data-audralia-parent-engine-canvas='true'],canvas[data-audralia-visible-canvas='true'],[data-audralia-motion-no-stretch='true']"
        )
        .forEach((node) => {
          count += suppressTransforms(node);
          if (node.style) {
            node.style.touchAction = "none";
            node.style.userSelect = "none";
            node.style.WebkitUserSelect = "none";
          }
        });
    }

    return count;
  }

  function ensureCanvas(mountNode) {
    if (!hasDocument() || !mountNode) return null;

    mountNode
      .querySelectorAll("canvas[data-audralia-parent-engine-canvas='true']")
      .forEach((node) => node.remove());

    const canvas = document.createElement("canvas");

    canvas.setAttribute("data-audralia-parent-engine-canvas", "true");
    canvas.setAttribute("data-audralia-visible-canvas", "true");
    canvas.setAttribute("data-audralia-parent-contract", PARENT_FACING_CONTRACT);
    canvas.setAttribute("data-audralia-parent-internal-contract", INTERNAL_CONTRACT);
    canvas.setAttribute("data-audralia-form-visible", "true");
    canvas.setAttribute("data-audralia-motion-no-stretch", "true");
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-visual-pass-claimed", "false");
    canvas.setAttribute("aria-label", "Audralia clean-canvas spherical parent projector");

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      minWidth: `${CONFIG.minCanvasSize}px`,
      minHeight: `${CONFIG.minCanvasSize}px`,
      display: "block",
      zIndex: "4",
      background: "transparent",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      cursor: "grab",
      transform: "none",
      transformOrigin: "50% 50%"
    });

    mountNode.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });
    state.canvasCreated = Boolean(state.ctx);

    return canvas;
  }

  function getBestRect() {
    if (!state.mountNode || typeof state.mountNode.getBoundingClientRect !== "function") {
      const size = hasWindow() ? Math.min(window.innerWidth || 420, CONFIG.maxCanvasSize) : 420;
      return { width: size, height: size };
    }

    const mountRect = state.mountNode.getBoundingClientRect();
    const parentRect =
      state.mountNode.parentElement &&
      typeof state.mountNode.parentElement.getBoundingClientRect === "function"
        ? state.mountNode.parentElement.getBoundingClientRect()
        : null;

    const candidates = [mountRect, parentRect].filter(Boolean);
    const usable = candidates.find((rect) => rect.width >= 120 && rect.height >= 120);

    if (usable) return usable;

    const width = hasWindow() ? Math.min(window.innerWidth || 420, CONFIG.maxCanvasSize) : 420;
    return {
      width,
      height: Math.max(CONFIG.defaultStageHeight, width)
    };
  }

  function resize() {
    if (!state.canvas || !state.ctx) return false;

    const rect = getBestRect();
    const dpr = Math.min(CONFIG.maxDpr, hasWindow() ? window.devicePixelRatio || 1 : 1);

    const cssWidth = Math.max(CONFIG.minCanvasSize, Math.floor(rect.width || CONFIG.minCanvasSize));
    const cssHeight = Math.max(CONFIG.minCanvasSize, Math.floor(rect.height || rect.width || CONFIG.minCanvasSize));

    const width = Math.max(CONFIG.minCanvasSize, Math.floor(cssWidth * dpr));
    const height = Math.max(CONFIG.minCanvasSize, Math.floor(cssHeight * dpr));

    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.dpr = dpr;

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.width = width;
    state.height = height;

    const base = Math.min(width, height);
    state.cx = width * CONFIG.centerX;
    state.cy = height * CONFIG.centerY;
    state.radius = Math.max(CONFIG.minRadius, base * CONFIG.radiusRatio);

    return true;
  }

  function readMotionState() {
    const motion = resolveMotionApi();

    let motionState = null;

    if (motion && typeof motion.getProjectionState === "function") {
      motionState = safe(() => motion.getProjectionState(), null);
    }

    if (!motionState && motion && typeof motion.getState === "function") {
      motionState = safe(() => motion.getState(), null);
    }

    if (!motionState && hasWindow() && window.AUDRALIA_MOTION_STATE) {
      motionState = window.AUDRALIA_MOTION_STATE;
    }

    const rotation = wrapRadians(
      motionState && Number.isFinite(Number(motionState.longitudeRotationRadians))
        ? Number(motionState.longitudeRotationRadians)
        : motionState && Number.isFinite(Number(motionState.longitudeRotation))
          ? Number(motionState.longitudeRotation)
          : motionState && Number.isFinite(Number(motionState.rotation))
            ? Number(motionState.rotation)
            : state.fallbackRotation
    );

    const pitch = clamp(
      motionState && Number.isFinite(Number(motionState.pitchRadians))
        ? Number(motionState.pitchRadians)
        : motionState && Number.isFinite(Number(motionState.pitch))
          ? Number(motionState.pitch)
          : motionState && Number.isFinite(Number(motionState.tilt))
            ? Number(motionState.tilt)
            : CONFIG.fallbackPitch,
      -0.78,
      0.70
    );

    const dragMode = motionState && motionState.dragMode ? String(motionState.dragMode) : "";

    state.motionConsumed = Boolean(motionState);
    state.motionStateActive = Boolean(motionState);
    state.dragMode = dragMode;
    state.lastRotation = rotation;
    state.lastPitch = pitch;

    return {
      rotation,
      pitch,
      dragMode,
      consumed: Boolean(motionState),
      source: motion ? "motion-api" : motionState ? "global-motion-state" : "fallback"
    };
  }

  function project(lonRad, latRad, elevation = 0) {
    const motion = readMotionState();

    const lon = finite(lonRad, 0) + motion.rotation;
    const lat = clamp(finite(latRad, 0), -Math.PI / 2, Math.PI / 2);
    const pitch = motion.pitch;

    const cosLat = Math.cos(lat);
    const x0 = cosLat * Math.sin(lon);
    const y0 = Math.sin(lat);
    const z0 = cosLat * Math.cos(lon);

    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const y1 = y0 * cosPitch - z0 * sinPitch;
    const z1 = y0 * sinPitch + z0 * cosPitch;
    const x1 = x0;

    const radius = state.radius * (1 + finite(elevation, 0));
    const perspective = clamp(0.92 + z1 * 0.10, 0.82, 1.05);

    return {
      x: state.cx + x1 * radius * perspective,
      y: state.cy - y1 * radius * perspective,
      z: z1,
      scale: perspective,
      visible: z1 > -0.12,
      front: z1 > 0.02,
      lon: lonRad,
      lat: latRad,
      rotation: motion.rotation,
      pitch: motion.pitch
    };
  }

  function makePayload() {
    const motion = readMotionState();

    return {
      contract: PARENT_FACING_CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      cacheNonce: getDynamicCacheNonce(),

      geometry: {
        width: state.width,
        height: state.height,
        cssWidth: state.cssWidth,
        cssHeight: state.cssHeight,
        dpr: state.dpr,
        cx: state.cx,
        cy: state.cy,
        radius: state.radius
      },

      motion,
      rotation: motion.rotation,
      pitch: motion.pitch,
      tilt: motion.pitch,

      project,

      parentProjectionActive: true,
      sphericalProjectionActive: true,
      projectionConsumesMotion: true,
      canvasTransformForbidden: true,
      cssTransformForbidden: true,
      bitmapStretchForbidden: true,
      screenPlaneDragForbidden: true,

      state: getStatus()
    };
  }

  function drawBackground(ctx) {
    const width = state.width;
    const height = state.height;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.radius * 0.08,
      state.cx,
      state.cy,
      Math.max(width, height) * 0.74
    );

    bg.addColorStop(0, "rgba(8, 48, 72, 0.70)");
    bg.addColorStop(0.38, COLORS.background1);
    bg.addColorStop(1, COLORS.background2);

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.44;

    for (let i = 0; i < 70; i += 1) {
      const x = seeded(i, 13, 9101) * width;
      const y = seeded(i, 17, 9102) * height;
      const r = 0.55 + seeded(i, 19, 9103) * 1.5;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(214, 244, 238, 0.12)";
      ctx.fill();
    }

    ctx.restore();
  }

  function seeded(a, b, seed) {
    const v = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453123;
    return v - Math.floor(v);
  }

  function drawOceanSphere(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.clip();

    const ocean = ctx.createRadialGradient(
      state.cx - state.radius * 0.28,
      state.cy - state.radius * 0.34,
      state.radius * 0.05,
      state.cx + state.radius * 0.14,
      state.cy + state.radius * 0.10,
      state.radius * 1.15
    );

    ocean.addColorStop(0, COLORS.ocean0);
    ocean.addColorStop(0.34, COLORS.ocean1);
    ocean.addColorStop(0.76, COLORS.ocean2);
    ocean.addColorStop(1, COLORS.ocean3);

    ctx.fillStyle = ocean;
    ctx.fillRect(state.cx - state.radius, state.cy - state.radius, state.radius * 2, state.radius * 2);

    const limb = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.58, state.cx, state.cy, state.radius);
    limb.addColorStop(0, "rgba(0,0,0,0)");
    limb.addColorStop(0.78, "rgba(0, 10, 30, 0.18)");
    limb.addColorStop(1, "rgba(0, 6, 18, 0.58)");

    ctx.fillStyle = limb;
    ctx.fillRect(state.cx - state.radius, state.cy - state.radius, state.radius * 2, state.radius * 2);

    ctx.restore();
  }

  function drawChildren(ctx, payload) {
    let continentsConsumed = false;
    let skyConsumed = false;

    const sky = resolveSkyApi();
    if (sky) {
      skyConsumed =
        callChildDraw(sky, ctx, payload, ["drawBefore", "drawSkyBefore", "renderBefore", "paintBefore"]) ||
        false;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.clip();

    const continents = resolveContinentsApi();
    if (continents) {
      continentsConsumed =
        callChildDraw(continents, ctx, payload, [
          "draw",
          "render",
          "paint",
          "drawContinents",
          "renderContinents",
          "paintContinents"
        ]) || false;
    }

    ctx.restore();

    if (sky) {
      skyConsumed =
        callChildDraw(sky, ctx, payload, ["drawAfter", "drawSkyAfter", "renderAfter", "paintAfter"]) ||
        skyConsumed;
    }

    state.continentsConsumed = continentsConsumed;
    state.skyConsumed = skyConsumed;

    if (continentsConsumed) {
      state.continentsDrawCount += 1;
    }

    return {
      continentsConsumed,
      skyConsumed
    };
  }

  function callChildDraw(apiObject, ctx, payload, names) {
    for (const name of names) {
      if (apiObject && typeof apiObject[name] === "function") {
        try {
          apiObject[name](ctx, payload);
          return true;
        } catch (error) {
          recordError(`child.${name}`, error);
          return false;
        }
      }
    }

    return false;
  }

  function drawSpecular(ctx) {
    ctx.save();

    ctx.globalCompositeOperation = "screen";

    const spec = ctx.createRadialGradient(
      state.cx - state.radius * 0.34,
      state.cy - state.radius * 0.38,
      0,
      state.cx - state.radius * 0.32,
      state.cy - state.radius * 0.36,
      state.radius * 0.72
    );

    spec.addColorStop(0, "rgba(255, 255, 255, 0.46)");
    spec.addColorStop(0.24, "rgba(210, 255, 245, 0.16)");
    spec.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphere(ctx) {
    ctx.save();

    const halo = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.radius * 0.82,
      state.cx,
      state.cy,
      state.radius * 1.13
    );

    halo.addColorStop(0, "rgba(130, 220, 255, 0)");
    halo.addColorStop(0.54, COLORS.atmosphere);
    halo.addColorStop(1, "rgba(130, 220, 255, 0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.13, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius + Math.max(1, state.width * 0.0014), 0, TAU);
    ctx.strokeStyle = COLORS.rim;
    ctx.lineWidth = Math.max(1, state.width * 0.0025);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius + Math.max(2, state.width * 0.008), 0, TAU);
    ctx.strokeStyle = COLORS.rim2;
    ctx.lineWidth = Math.max(1, state.width * 0.0045);
    ctx.stroke();

    ctx.restore();
  }

  function drawFrame(reason = "render") {
    state.renderScheduled = false;

    if (state.disposed || !state.ctx || !state.canvas) return;

    try {
      enforceNoStretch();
      resize();

      const ctx = state.ctx;
      const payload = makePayload();

      drawBackground(ctx);
      drawOceanSphere(ctx);

      const childSummary = drawChildren(ctx, payload);

      drawSpecular(ctx);
      drawAtmosphere(ctx);

      state.renderCount += 1;
      state.formVisible = true;
      state.lastDrawError = "";
      state.lastDrawSummary = {
        reason,
        renderCount: state.renderCount,
        motionConsumed: state.motionConsumed,
        rotation: state.lastRotation,
        pitch: state.lastPitch,
        projectionConsumesMotion: true,
        continentsConsumed: childSummary.continentsConsumed,
        skyConsumed: childSummary.skyConsumed,
        noStretchEnforced: true
      };

      publishReceipt(`draw-${reason}`);
    } catch (error) {
      recordError("drawFrame", error);
    }
  }

  function requestRender(reason = "external") {
    if (reason && typeof reason === "object") {
      if (Number.isFinite(Number(reason.rotation))) {
        state.lastRotation = wrapRadians(reason.rotation);
      }
      if (Number.isFinite(Number(reason.pitch))) {
        state.lastPitch = clamp(reason.pitch, -0.78, 0.70);
      }
      reason = "motion-state-request";
    }

    state.requestRenderCount += 1;

    if (state.renderScheduled) return api;

    state.renderScheduled = true;

    if (hasWindow() && typeof window.requestAnimationFrame === "function") {
      state.frameId = window.requestAnimationFrame(() => drawFrame(String(reason || "request")));
    } else {
      setTimeout(() => drawFrame(String(reason || "request")), 16);
    }

    return api;
  }

  function startFallbackLoop() {
    if (!hasWindow()) return;

    function loop(t) {
      if (state.disposed) return;

      const time = Number.isFinite(Number(t)) ? Number(t) : now();
      const last = state.lastFrameTime || time;
      const dt = clamp(time - last, 0, 80);

      state.lastFrameTime = time;

      if (!resolveMotionApi()) {
        state.fallbackRotation = wrapRadians(state.fallbackRotation + dt * CONFIG.fallbackRotationSpeed);
        requestRender("fallback-motion-loop");
      }

      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  }

  function mount(node, options = {}) {
    const mountNode = resolveMountNode(node);

    if (!mountNode) {
      recordError("mount", "mount_node_missing");
      return api;
    }

    state.mountNode = mountNode;
    state.disposed = false;
    state.mounted = true;
    state.booted = true;

    prepareMount(mountNode);
    ensureCanvas(mountNode);
    resize();

    if (hasWindow()) {
      window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
      window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
      window.AUDRALIA_CLEAN_ENGINE_PARENT = api;
      window.AUDRALIA_ENGINE = api;
      window.AUDRALIA_CLEAN_PARENT_ENGINE = api;
    }

    loadChildren().catch((error) => recordError("loadChildren", error));

    if (hasWindow()) {
      window.addEventListener("resize", () => requestRender("resize"), { passive: true });
      window.addEventListener("audralia:motion:update", () => requestRender("motion-update"), { passive: true });
    }

    requestRender("mount");
    startFallbackLoop();
    publishReceipt("mount");

    return api;
  }

  function render() {
    return requestRender("render");
  }

  function redraw() {
    return requestRender("redraw");
  }

  function start(node, options = {}) {
    return mount(node, options);
  }

  function boot(node, options = {}) {
    return mount(node, options);
  }

  function init(node, options = {}) {
    return mount(node, options);
  }

  function create(node, options = {}) {
    return mount(node, options);
  }

  function dispose() {
    state.disposed = true;

    if (state.frameId && hasWindow()) {
      window.cancelAnimationFrame(state.frameId);
    }

    state.frameId = 0;
    state.renderScheduled = false;

    if (state.canvas && state.canvas.parentElement) {
      state.canvas.remove();
    }

    state.canvas = null;
    state.ctx = null;
    state.canvasCreated = false;
    state.mounted = false;
    state.formVisible = false;

    publishReceipt("dispose");

    return api;
  }

  function getStatus() {
    return {
      contract: PARENT_FACING_CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      receipt: RECEIPT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      target: TARGET,
      route: ROUTE,

      mounted: state.mounted,
      booted: state.booted,
      disposed: state.disposed,
      canvasCreated: state.canvasCreated,
      formVisible: state.formVisible,

      geometry: {
        width: state.width,
        height: state.height,
        cssWidth: state.cssWidth,
        cssHeight: state.cssHeight,
        dpr: state.dpr,
        cx: state.cx,
        cy: state.cy,
        radius: state.radius
      },

      dynamicCacheNonce: state.dynamicCacheNonce || getDynamicCacheNonce(),

      motionLoaded: state.motionLoaded,
      motionContract: state.motionContract,
      motionContractExpected: MOTION_EXPECTED_CONTRACT,
      motionContractValid: !state.motionContract || state.motionContract === MOTION_EXPECTED_CONTRACT,
      motionConsumed: state.motionConsumed,
      motionStateActive: state.motionStateActive,
      dragMode: state.dragMode,
      projectionConsumesMotion: true,

      continentsLoaded: state.continentsLoaded,
      continentsContract: state.continentsContract,
      continentsInternalContract: state.continentsInternalContract,
      continentsExpectedInternalContract: CONTINENTS_EXPECTED_INTERNAL,
      continentsConsumed: state.continentsConsumed,
      continentsDrawCount: state.continentsDrawCount,

      skyLoaded: state.skyLoaded,
      skyConsumed: state.skyConsumed,

      canvasTransformForbidden: true,
      cssTransformForbidden: true,
      bitmapStretchForbidden: true,
      screenPlaneDragForbidden: true,
      parentProjectionActive: true,
      sphericalProjectionActive: true,

      lastRotation: state.lastRotation,
      lastPitch: state.lastPitch,
      renderCount: state.renderCount,
      requestRenderCount: state.requestRenderCount,
      lastDrawError: state.lastDrawError,
      lastDrawSummary: state.lastDrawSummary,
      lastChildSummary: state.lastChildSummary,

      owns: [
        "canvas composition",
        "parent projection",
        "sphere body draw",
        "child draw payload",
        "FORM_VISIBLE parent handoff",
        "no-stretch projection restraint"
      ],

      doesNotOwn: [
        "Gratitude topology",
        "Gratitude hydrology",
        "Gratitude surface material",
        "continents truth",
        "terrain elevation",
        "mountains",
        "animals",
        "plants",
        "climate",
        "route bridge",
        "HTML shell"
      ],

      ownsTopology: false,
      ownsHydrology: false,
      ownsSurface: false,
      ownsTerrain: false,
      ownsElevation: false,
      ownsContinentsTruth: false,
      ownsMotionState: false,
      ownsRoute: false,
      ownsHtml: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaim: false,

      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = getStatus();
    receipt.scope = scope;

    window.AUDRALIA_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_PARENT_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_PARENT_PROJECTOR_NO_STRETCH_RECEIPT = receipt;

    window.AUDRALIA_ENGINE_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_PARENT_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_PARENT_PROJECTOR_CONSUMES_MOTION_STATE_ACTIVE = true;
    window.AUDRALIA_PARENT_PROJECTOR_NO_STRETCH_ACTIVE = true;

    const root = getRoot();

    if (root) {
      root.dataset.audraliaParentContract = PARENT_FACING_CONTRACT;
      root.dataset.audraliaParentInternalContract = INTERNAL_CONTRACT;
      root.dataset.audraliaParentReceipt = RECEIPT;
      root.dataset.audraliaParentFormVisible = state.formVisible ? "true" : "false";
      root.dataset.audraliaParentProjectorConsumesMotion = "true";
      root.dataset.audraliaParentProjectorNoStretch = "true";
      root.dataset.audraliaParentProjectionActive = "true";
      root.dataset.audraliaParentSphericalProjectionActive = "true";
      root.dataset.audraliaParentCanvasTransformForbidden = "true";
      root.dataset.audraliaParentCssTransformForbidden = "true";
      root.dataset.audraliaParentBitmapStretchForbidden = "true";
      root.dataset.audraliaParentScreenPlaneDragForbidden = "true";
      root.dataset.audraliaParentMotionConsumed = state.motionConsumed ? "true" : "false";
      root.dataset.audraliaParentContinentsConsumed = state.continentsConsumed ? "true" : "false";
      root.dataset.generatedImage = "false";
      root.dataset.graphicBox = "false";
      root.dataset.visualPassClaimed = "false";
    }

    try {
      window.dispatchEvent(new CustomEvent("audralia:parent:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:parent:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    contract: PARENT_FACING_CONTRACT,
    CONTRACT: PARENT_FACING_CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    INTERNAL_CONTRACT,
    receipt: RECEIPT,
    target: TARGET,
    route: ROUTE,

    mount,
    start,
    boot,
    init,
    create,
    dispose,

    render,
    redraw,
    requestRender,

    project,
    makePayload,

    getStatus,
    status: getStatus,
    publishReceipt
  };

  if (hasWindow()) {
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
    window.AUDRALIA_CLEAN_ENGINE_PARENT = api;
    window.AUDRALIA_ENGINE = api;
    window.AUDRALIA_CLEAN_PARENT_ENGINE = api;
    window.AUDRALIA_PARENT_PROJECTOR_ENGINE = api;

    publishReceipt("module-load");
  }
})();
