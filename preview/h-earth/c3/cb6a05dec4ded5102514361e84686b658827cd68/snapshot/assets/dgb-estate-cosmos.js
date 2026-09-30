/* /assets/dgb-estate-cosmos.js
   DGB_ESTATE_COSMIC_CONTINUITY_v1
   Shared decorative-only Fibonacci/phyllotaxis cosmic continuity layer.
   No navigation, controller, layout, geometry, projection, selection, or interaction authority.
*/
(() => {
  "use strict";

  const MODULE = "DGB_ESTATE_COSMOS";
  const RECEIPT_KEY = "DGB_ESTATE_COSMOS_RECEIPT";
  const READY_EVENT = "DGB_ESTATE_COSMOS_READY";
  const FAILURE_EVENT = "DGB_ESTATE_COSMOS_FAILURE";
  const CANVAS_ID = "dgb-estate-cosmos";
  const CONTRACT = "DGB_ESTATE_COSMIC_CONTINUITY_v1";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x44474245;

  if (globalThis[MODULE]?.initialized) return;

  const CONFIG = Object.freeze({
    mobileWidth: 820,
    mobileDprCap: 1,
    desktopDprCap: 1.25,
    minimumStars: 72,
    maximumStars: 170,
    areaDivisor: 9000,
    sparkleRatio: 0.12,
    minimumSparkles: 3,
    maximumSparkles: 6,
    firstBurstMinMs: 3200,
    firstBurstMaxMs: 5600,
    burstDelayMinMs: 2600,
    burstDelayMaxMs: 5200,
    burstDurationMinMs: 620,
    burstDurationMaxMs: 940,
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
    canvas: null,
    context: null,
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    sparklePool: [],
    activeSparkles: [],
    burstTimer: 0,
    frameTimer: 0,
    motionQuery: null,
    drawCount: 0
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

  function receipt(extra = {}) {
    return {
      contract: CONTRACT,
      module: MODULE,
      sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",
      renderingModel: "single-fixed-canvas-static-base-sparse-bursts",
      geometryModel: "golden-angle-square-root-jitter",
      sharedEstateContinuity: true,
      decorativeOnly: true,
      fullViewportLayer: true,
      canvasCount: state.canvas?.isConnected ? 1 : 0,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      reducedMotion: state.reducedMotion,
      documentVisible: state.documentVisible,
      width: state.width,
      height: state.height,
      devicePixelRatio: state.dpr,
      starCount: state.stars.length,
      activeSparkleCount: state.activeSparkles.length,
      drawCount: state.drawCount,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsLayout: false,
      ownsPageGeometry: false,
      ownsPlanetGeometry: false,
      ownsProjection: false,
      ownsInteraction: false,
      ownsSelection: false,
      ownsLabels: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const value = Object.freeze(receipt(extra));
    globalThis[RECEIPT_KEY] = value;
    if (state.canvas) {
      state.canvas.dataset.dgbEstateCosmosStatus = state.failed ? "held" : state.initialized ? "available" : "pending";
      state.canvas.dataset.dgbEstateCosmosContract = CONTRACT;
    }
    return value;
  }

  function stop() {
    clearTimeout(state.burstTimer);
    clearTimeout(state.frameTimer);
    state.burstTimer = 0;
    state.frameTimer = 0;
    state.activeSparkles = [];
  }

  function fail(error) {
    if (state.failed) return;
    state.failed = true;
    stop();
    const message = error instanceof Error ? error.message : String(error);
    publish({ lastAction: "failure", lastFailure: message });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, { detail: Object.freeze({ message }) }));
  }

  function createCanvas() {
    const existing = document.getElementById(CANVAS_ID);
    if (existing instanceof HTMLCanvasElement) return existing;
    const canvas = document.createElement("canvas");
    canvas.id = CANVAS_ID;
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("data-dgb-estate-cosmos", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      display: "block",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: "0"
    });
    document.body.prepend(canvas);
    return canvas;
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(state.motionQuery?.matches);
  }

  function canAnimate() {
    return state.initialized && !state.destroyed && !state.failed && state.documentVisible && !state.reducedMotion;
  }

  function configureSize() {
    state.width = Math.max(320, Math.round(globalThis.innerWidth || document.documentElement.clientWidth || 320));
    state.height = Math.max(480, Math.round(globalThis.innerHeight || document.documentElement.clientHeight || 480));
    const cap = state.width <= CONFIG.mobileWidth ? CONFIG.mobileDprCap : CONFIG.desktopDprCap;
    state.dpr = Math.min(globalThis.devicePixelRatio || 1, cap);
    state.canvas.width = Math.max(1, Math.round(state.width * state.dpr));
    state.canvas.height = Math.max(1, Math.round(state.height * state.dpr));
    state.context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function generateStars() {
    const random = randomFactory(FIELD_SEED ^ state.width ^ (state.height << 7));
    const count = clamp(Math.round((state.width * state.height) / CONFIG.areaDivisor), CONFIG.minimumStars, CONFIG.maximumStars);
    const stars = [];
    for (let index = 0; index < count; index += 1) {
      const radius = Math.sqrt((index + 0.5) / count);
      const angle = index * GOLDEN_ANGLE + randomBetween(random, -0.08, 0.08);
      stars.push({
        x: clamp(0.5 + Math.cos(angle) * radius * 0.7 + randomBetween(random, -0.018, 0.018), 0.012, 0.988),
        y: clamp(0.5 + Math.sin(angle) * radius * 0.64 + randomBetween(random, -0.018, 0.018), 0.012, 0.988),
        radius: randomBetween(random, 0.38, 1.35),
        alpha: randomBetween(random, 0.18, 0.58),
        color: COLORS[Math.floor(random() * COLORS.length)],
        sparkle: random() < CONFIG.sparkleRatio
      });
    }
    state.stars = stars;
    state.sparklePool = stars.filter(star => star.sparkle);
  }

  function drawStar(star, alpha = star.alpha, scale = 1) {
    const x = star.x * state.width;
    const y = star.y * state.height;
    const radius = star.radius * scale;
    state.context.beginPath();
    state.context.arc(x, y, radius, 0, Math.PI * 2);
    state.context.fillStyle = `rgba(${star.color},${alpha})`;
    state.context.shadowColor = `rgba(${star.color},${alpha * 0.55})`;
    state.context.shadowBlur = radius * 3;
    state.context.fill();
    state.context.shadowBlur = 0;
  }

  function drawFrame(now = performance.now()) {
    state.context.clearRect(0, 0, state.width, state.height);
    for (const star of state.stars) drawStar(star);
    state.activeSparkles = state.activeSparkles.filter(item => now < item.endsAt);
    for (const item of state.activeSparkles) {
      const progress = clamp(1 - (item.endsAt - now) / item.duration, 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      drawStar(item.star, item.star.alpha * (0.35 + pulse * 0.9), 1 + pulse * 1.7);
    }
    state.drawCount += 1;
  }

  function runSparkleFrames() {
    if (!canAnimate() || !state.activeSparkles.length) {
      state.frameTimer = 0;
      drawFrame();
      return;
    }
    drawFrame();
    state.frameTimer = globalThis.setTimeout(runSparkleFrames, CONFIG.sparkleFrameMs);
  }

  function scheduleBurst(first = false) {
    clearTimeout(state.burstTimer);
    if (!canAnimate()) return;
    const random = randomFactory(FIELD_SEED ^ Date.now());
    const delay = first
      ? randomBetween(random, CONFIG.firstBurstMinMs, CONFIG.firstBurstMaxMs)
      : randomBetween(random, CONFIG.burstDelayMinMs, CONFIG.burstDelayMaxMs);
    state.burstTimer = globalThis.setTimeout(() => {
      if (!canAnimate() || !state.sparklePool.length) return;
      const quantity = clamp(
        Math.floor(randomBetween(random, CONFIG.minimumSparkles, CONFIG.maximumSparkles + 1)),
        1,
        state.sparklePool.length
      );
      const pool = [...state.sparklePool].sort(() => random() - 0.5).slice(0, quantity);
      const now = performance.now();
      state.activeSparkles = pool.map(star => {
        const duration = randomBetween(random, CONFIG.burstDurationMinMs, CONFIG.burstDurationMaxMs);
        return { star, duration, endsAt: now + duration };
      });
      if (!state.frameTimer) runSparkleFrames();
      scheduleBurst(false);
    }, delay);
  }

  function resize() {
    if (!state.initialized || state.destroyed) return;
    stop();
    configureSize();
    generateStars();
    drawFrame();
    if (canAnimate()) scheduleBurst(true);
    publish({ lastAction: "resize" });
  }

  function onVisibility() {
    state.documentVisible = !document.hidden;
    stop();
    drawFrame();
    if (canAnimate()) scheduleBurst(true);
    publish({ lastAction: "visibility" });
  }

  function onMotion() {
    resolveReducedMotion();
    stop();
    drawFrame();
    if (canAnimate()) scheduleBurst(true);
    publish({ lastAction: "motion-policy" });
  }

  function destroy() {
    if (state.destroyed) return;
    stop();
    state.destroyed = true;
    globalThis.removeEventListener("resize", resize);
    globalThis.removeEventListener("pagehide", destroy);
    document.removeEventListener("visibilitychange", onVisibility);
    state.motionQuery?.removeEventListener?.("change", onMotion);
    state.canvas?.remove();
    publish({ lastAction: "destroy" });
  }

  function initialize() {
    try {
      if (!document.body) throw new Error("ESTATE_COSMOS_BODY_UNAVAILABLE");
      state.canvas = createCanvas();
      state.context = state.canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!state.context) throw new Error("ESTATE_COSMOS_CONTEXT_UNAVAILABLE");
      state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
      resolveReducedMotion();
      configureSize();
      generateStars();
      drawFrame();
      state.initialized = true;
      globalThis[MODULE] = Object.freeze({
        initialized: true,
        resize,
        stop,
        destroy,
        receipt: () => Object.freeze(receipt())
      });
      globalThis.addEventListener("resize", resize, { passive: true });
      globalThis.addEventListener("pagehide", destroy, { once: true });
      document.addEventListener("visibilitychange", onVisibility);
      state.motionQuery?.addEventListener?.("change", onMotion);
      const value = publish({ lastAction: "initialized" });
      if (canAnimate()) scheduleBurst(true);
      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: value }));
    } catch (error) {
      fail(error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
