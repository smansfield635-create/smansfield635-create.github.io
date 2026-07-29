/* /products/index.cosmos.js
   PRODUCTS_PAGE_WIDE_ARCHCOIN_COSMOS_v1
   Decorative-only, fixed page-wide Fibonacci/phyllotaxis starfield.
   No navigation, controller, geometry, projection, selection, or interaction authority.
*/
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_COSMOS";
  const RECEIPT_KEY = "DGB_PRODUCTS_COSMOS_RECEIPT";
  const READY_EVENT = "PRODUCTS_COSMOS_READY";
  const FAILURE_EVENT = "PRODUCTS_COSMOS_FAILURE";
  const CANVAS_ATTR = "data-products-cosmos-canvas";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x50524f44;

  if (globalThis[MODULE]?.initialized) return;

  const CONFIG = Object.freeze({
    root: '[data-page-id="products"]',
    mount: '[data-products-cosmic-field]',
    mobileWidth: 820,
    mobileDprCap: 1,
    desktopDprCap: 1.25,
    minimumStars: 86,
    maximumStars: 190,
    areaDivisor: 7600,
    rogueRatio: 0.13,
    minimumSparkles: 4,
    maximumSparkles: 8,
    firstBurstMinMs: 2600,
    firstBurstMaxMs: 4600,
    burstDelayMinMs: 1700,
    burstDelayMaxMs: 3400,
    burstDurationMinMs: 620,
    burstDurationMaxMs: 980,
    sparkleFrameMs: 125
  });

  const COLORS = Object.freeze([
    "255,248,224",
    "154,217,225",
    "234,208,131",
    "170,155,224"
  ]);

  const state = {
    initialized: false,
    destroyed: false,
    failed: false,
    documentVisible: !document.hidden,
    reducedMotion: false,
    root: null,
    mount: null,
    baseCanvas: null,
    overlayCanvas: null,
    baseContext: null,
    overlayContext: null,
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    sparkles: [],
    activeSparkles: [],
    burstTimer: 0,
    frameTimer: 0,
    motionQuery: null,
    baseDrawCount: 0,
    sparkleFrameCount: 0
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const randomBetween = (random, min, max) => min + random() * (max - min);

  function randomFactory(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildReceipt(extra = {}) {
    return {
      contract: "PRODUCTS_PAGE_WIDE_ARCHCOIN_COSMOS_v1",
      module: MODULE,
      sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",
      renderingModel: "fixed-page-static-base-burst-overlay",
      geometryModel: "golden-angle-square-root-jitter-with-rogue-stars",
      pageLocalIdentity: true,
      decorativeOnly: true,
      sceneContained: false,
      fullViewportLayer: true,
      localOrbitalRingsPreserved: true,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      reducedMotion: state.reducedMotion,
      documentVisible: state.documentVisible,
      width: state.width,
      height: state.height,
      devicePixelRatio: state.dpr,
      starCount: state.stars.length,
      sparkleCount: state.sparkles.length,
      activeSparkleCount: state.activeSparkles.length,
      baseDrawCount: state.baseDrawCount,
      sparkleFrameCount: state.sparkleFrameCount,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsProductGeometry: false,
      ownsPlanetGeometry: false,
      ownsProjection: false,
      ownsInteraction: false,
      ownsSelection: false,
      ownsLabelResolution: false,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    if (state.root) {
      state.root.dataset.productsCosmosStatus = state.failed ? "held" : state.initialized ? "available" : "pending";
      state.root.dataset.productsCosmicFieldCount = state.initialized ? "1" : "0";
      state.root.dataset.productsCosmosScope = "page-wide";
      state.root.dataset.productsCosmosReceipt = JSON.stringify(receipt);
    }
    const output = document.querySelector("[data-products-cosmos-receipt]");
    if (output) output.value = JSON.stringify(receipt);
    return receipt;
  }

  function fail(error) {
    if (state.failed) return;
    state.failed = true;
    stop();
    const message = error instanceof Error ? error.message : String(error);
    publish({ lastAction: "cosmos-failure", lastFailure: message });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, { detail: Object.freeze({ message }) }));
  }

  function makeCanvas(role) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute(CANVAS_ATTR, role);
    canvas.setAttribute("aria-hidden", "true");
    return canvas;
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(state.motionQuery?.matches || state.root?.dataset.reducedMotion === "true");
  }

  function canRun() {
    return state.initialized && !state.destroyed && !state.failed && state.documentVisible && !state.reducedMotion;
  }

  function configureSize() {
    state.width = Math.max(320, Math.round(globalThis.innerWidth || document.documentElement.clientWidth));
    state.height = Math.max(480, Math.round(globalThis.innerHeight || document.documentElement.clientHeight));
    const cap = state.width <= CONFIG.mobileWidth ? CONFIG.mobileDprCap : CONFIG.desktopDprCap;
    state.dpr = Math.min(globalThis.devicePixelRatio || 1, cap);

    for (const canvas of [state.baseCanvas, state.overlayCanvas]) {
      canvas.width = Math.max(1, Math.round(state.width * state.dpr));
      canvas.height = Math.max(1, Math.round(state.height * state.dpr));
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
    }
    state.baseContext.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    state.overlayContext.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function generateStars() {
    const random = randomFactory(FIELD_SEED ^ state.width ^ (state.height << 7));
    const count = clamp(Math.round((state.width * state.height) / CONFIG.areaDivisor), CONFIG.minimumStars, CONFIG.maximumStars);
    const stars = [];
    for (let index = 0; index < count; index += 1) {
      const radius = Math.sqrt((index + 0.5) / count);
      const angle = index * GOLDEN_ANGLE + randomBetween(random, -0.08, 0.08);
      const x = clamp(0.5 + Math.cos(angle) * radius * 0.69 + randomBetween(random, -0.018, 0.018), 0.012, 0.988);
      const y = clamp(0.5 + Math.sin(angle) * radius * 0.63 + randomBetween(random, -0.018, 0.018), 0.012, 0.988);
      stars.push({
        x,
        y,
        radius: randomBetween(random, 0.42, 1.55),
        alpha: randomBetween(random, 0.24, 0.82),
        color: COLORS[Math.floor(random() * COLORS.length)],
        rogue: random() < CONFIG.rogueRatio
      });
    }
    state.stars = stars;
    state.sparkles = stars.filter(star => star.rogue).slice(0, CONFIG.maximumSparkles * 3);
  }

  function drawStar(context, star, alpha = star.alpha, scale = 1) {
    const x = star.x * state.width;
    const y = star.y * state.height;
    const radius = star.radius * scale;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(${star.color},${alpha})`;
    context.shadowColor = `rgba(${star.color},${alpha * 0.8})`;
    context.shadowBlur = radius * 4;
    context.fill();
    context.shadowBlur = 0;
  }

  function drawBase() {
    state.baseContext.clearRect(0, 0, state.width, state.height);
    for (const star of state.stars) drawStar(state.baseContext, star);
    state.baseDrawCount += 1;
  }

  function drawSparkles() {
    state.overlayContext.clearRect(0, 0, state.width, state.height);
    const now = performance.now();
    state.activeSparkles = state.activeSparkles.filter(item => now < item.endsAt);
    for (const item of state.activeSparkles) {
      const progress = clamp(1 - (item.endsAt - now) / item.duration, 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      drawStar(state.overlayContext, item.star, item.star.alpha * pulse, 1 + pulse * 1.9);
    }
    state.sparkleFrameCount += 1;
    if (!state.activeSparkles.length) {
      clearInterval(state.frameTimer);
      state.frameTimer = 0;
    }
    publish({ lastAction: "sparkle-frame" });
  }

  function scheduleBurst(first = false) {
    clearTimeout(state.burstTimer);
    if (!canRun()) return;
    const random = randomFactory(FIELD_SEED ^ Date.now());
    const delay = first
      ? randomBetween(random, CONFIG.firstBurstMinMs, CONFIG.firstBurstMaxMs)
      : randomBetween(random, CONFIG.burstDelayMinMs, CONFIG.burstDelayMaxMs);
    state.burstTimer = globalThis.setTimeout(() => {
      if (!canRun() || !state.sparkles.length) return;
      const quantity = clamp(Math.floor(randomBetween(random, CONFIG.minimumSparkles, CONFIG.maximumSparkles + 1)), 1, state.sparkles.length);
      const pool = [...state.sparkles].sort(() => random() - 0.5).slice(0, quantity);
      const now = performance.now();
      state.activeSparkles = pool.map(star => {
        const duration = randomBetween(random, CONFIG.burstDurationMinMs, CONFIG.burstDurationMaxMs);
        return { star, duration, endsAt: now + duration };
      });
      if (!state.frameTimer) state.frameTimer = globalThis.setInterval(drawSparkles, CONFIG.sparkleFrameMs);
      scheduleBurst(false);
    }, delay);
  }

  function resize() {
    if (!state.initialized || state.destroyed) return;
    configureSize();
    generateStars();
    drawBase();
    publish({ lastAction: "resize" });
  }

  function stop() {
    clearTimeout(state.burstTimer);
    clearInterval(state.frameTimer);
    state.burstTimer = 0;
    state.frameTimer = 0;
    state.activeSparkles = [];
    state.overlayContext?.clearRect(0, 0, state.width, state.height);
  }

  function destroy() {
    if (state.destroyed) return;
    stop();
    state.destroyed = true;
    globalThis.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    state.motionQuery?.removeEventListener?.("change", onMotion);
    state.baseCanvas?.remove();
    state.overlayCanvas?.remove();
    publish({ lastAction: "destroy" });
  }

  function onVisibility() {
    state.documentVisible = !document.hidden;
    if (canRun()) scheduleBurst(true);
    else stop();
    publish({ lastAction: "visibility" });
  }

  function onMotion() {
    resolveReducedMotion();
    if (canRun()) scheduleBurst(true);
    else stop();
    publish({ lastAction: "motion-policy" });
  }

  function initialize() {
    try {
      state.root = document.querySelector(CONFIG.root);
      state.mount = document.querySelector(CONFIG.mount);
      if (!state.root || !state.mount) throw new Error("PRODUCTS_PAGE_WIDE_COSMOS_SURFACE_NOT_FOUND");

      state.baseCanvas = state.mount.querySelector(`[${CANVAS_ATTR}="base"]`) || makeCanvas("base");
      state.overlayCanvas = state.mount.querySelector(`[${CANVAS_ATTR}="sparkle"]`) || makeCanvas("sparkle");
      if (!state.baseCanvas.isConnected) state.mount.append(state.baseCanvas);
      if (!state.overlayCanvas.isConnected) state.mount.append(state.overlayCanvas);

      state.baseContext = state.baseCanvas.getContext("2d", { alpha: true, desynchronized: true });
      state.overlayContext = state.overlayCanvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!state.baseContext || !state.overlayContext) throw new Error("PRODUCTS_PAGE_WIDE_COSMOS_CONTEXT_UNAVAILABLE");

      state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
      resolveReducedMotion();
      configureSize();
      generateStars();
      drawBase();

      state.initialized = true;
      globalThis[MODULE] = Object.freeze({ initialized: true, resize, stop, destroy, receipt: () => Object.freeze(buildReceipt()) });
      globalThis.addEventListener("resize", resize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      state.motionQuery?.addEventListener?.("change", onMotion);

      const receipt = publish({ lastAction: "initialized" });
      if (canRun()) scheduleBurst(true);
      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: receipt }));
    } catch (error) {
      fail(error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
