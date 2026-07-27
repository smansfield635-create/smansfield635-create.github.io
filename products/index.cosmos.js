/* /products/index.cosmos.js
   PRODUCTS_ARENA_CLUSTER_COSMOS_TRANSPLANT_v1
   Page-local decorative cosmic field. No navigation, controller, geometry,
   projection, selection, or settlement authority.
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
    scene: '[data-products-scene]',
    mount: '[data-products-cosmic-field]',
    mobileWidth: 820,
    compactWidth: 560,
    mobileDprCap: 1,
    desktopDprCap: 1.25,
    minimumStars: 56,
    maximumStars: 116,
    areaDivisor: 5700,
    rogueRatio: 0.12,
    candidateMultiplier: 8,
    centerVoidRadiusX: 0.18,
    centerVoidRadiusY: 0.18,
    minimumSparkles: 4,
    maximumSparkles: 8,
    firstBurstMinMs: 2200,
    firstBurstMaxMs: 4200,
    burstDelayMinMs: 1500,
    burstDelayMaxMs: 3100,
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
    sceneVisible: true,
    reducedMotion: false,
    root: null,
    scene: null,
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
    resizeObserver: null,
    intersectionObserver: null,
    motionQuery: null,
    baseDrawCount: 0,
    sparkleFrameCount: 0
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

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

  function randomBetween(random, min, max) {
    return min + random() * (max - min);
  }

  function buildReceipt(extra = {}) {
    return {
      contract: "PRODUCTS_ARENA_CLUSTER_COSMOS_TRANSPLANT_v1",
      module: MODULE,
      renderingModel: "static-base-burst-overlay",
      geometryModel: "golden-angle-square-root-center-void",
      pageLocalIdentity: true,
      decorativeOnly: true,
      sceneContained: true,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      reducedMotion: state.reducedMotion,
      documentVisible: state.documentVisible,
      sceneVisible: state.sceneVisible,
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
    return state.initialized && !state.destroyed && !state.failed && state.documentVisible && state.sceneVisible && !state.reducedMotion;
  }

  function configureSize() {
    const rect = state.mount.getBoundingClientRect();
    state.width = Math.max(1, Math.round(rect.width));
    state.height = Math.max(1, Math.round(rect.height));
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
    const candidates = [];

    for (let index = 0; index < count * CONFIG.candidateMultiplier; index += 1) {
      const radius = Math.sqrt((index + 0.5) / (count * CONFIG.candidateMultiplier));
      const angle = index * GOLDEN_ANGLE + randomBetween(random, -0.075, 0.075);
      const x = 0.5 + Math.cos(angle) * radius * 0.59 + randomBetween(random, -0.015, 0.015);
      const y = 0.5 + Math.sin(angle) * radius * 0.48 + randomBetween(random, -0.015, 0.015);
      const dx = (x - 0.5) / CONFIG.centerVoidRadiusX;
      const dy = (y - 0.5) / CONFIG.centerVoidRadiusY;
      if (x < 0.015 || x > 0.985 || y < 0.015 || y > 0.985 || dx * dx + dy * dy < 1) continue;
      candidates.push({
        x,
        y,
        radius: randomBetween(random, 0.45, 1.5),
        alpha: randomBetween(random, 0.28, 0.88),
        color: COLORS[Math.floor(random() * COLORS.length)],
        rogue: random() < CONFIG.rogueRatio
      });
      if (candidates.length >= count) break;
    }

    state.stars = candidates;
    state.sparkles = candidates.filter(star => star.rogue).slice(0, CONFIG.maximumSparkles * 2);
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
      drawStar(state.overlayContext, item.star, item.star.alpha * pulse, 1 + pulse * 1.8);
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
    state.burstTimer = setTimeout(() => {
      if (!canRun()) return;
      const count = clamp(Math.round(randomBetween(random, CONFIG.minimumSparkles, CONFIG.maximumSparkles)), 1, state.sparkles.length || 1);
      const shuffled = [...state.sparkles].sort(() => random() - 0.5).slice(0, count);
      const now = performance.now();
      state.activeSparkles = shuffled.map(star => {
        const duration = randomBetween(random, CONFIG.burstDurationMinMs, CONFIG.burstDurationMaxMs);
        return { star, duration, endsAt: now + duration };
      });
      if (!state.frameTimer) state.frameTimer = setInterval(drawSparkles, CONFIG.sparkleFrameMs);
      scheduleBurst(false);
    }, delay);
  }

  function stop() {
    clearTimeout(state.burstTimer);
    state.burstTimer = 0;
    clearInterval(state.frameTimer);
    state.frameTimer = 0;
    state.activeSparkles = [];
    if (state.overlayContext) state.overlayContext.clearRect(0, 0, state.width, state.height);
  }

  function resize() {
    if (!state.mount) return;
    configureSize();
    generateStars();
    drawBase();
    stop();
    scheduleBurst(true);
    publish({ lastAction: "cosmos-resized" });
  }

  function destroy() {
    stop();
    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();
    state.motionQuery?.removeEventListener?.("change", onMotion);
    state.baseCanvas?.remove();
    state.overlayCanvas?.remove();
    state.destroyed = true;
    publish({ lastAction: "cosmos-destroyed" });
  }

  function onMotion() {
    resolveReducedMotion();
    stop();
    if (!state.reducedMotion) scheduleBurst(true);
    publish({ lastAction: "reduced-motion-changed" });
  }

  function initialize() {
    try {
      state.root = document.querySelector(CONFIG.root);
      state.scene = document.querySelector(CONFIG.scene);
      state.mount = document.querySelector(CONFIG.mount);
      if (!state.root || !state.scene || !state.mount) throw new Error("PRODUCTS_COSMOS_SURFACE_NOT_FOUND");

      state.baseCanvas = state.mount.querySelector(`[${CANVAS_ATTR}="base"]`) || makeCanvas("base");
      state.overlayCanvas = state.mount.querySelector(`[${CANVAS_ATTR}="sparkle"]`) || makeCanvas("sparkle");
      if (!state.baseCanvas.isConnected) state.mount.append(state.baseCanvas);
      if (!state.overlayCanvas.isConnected) state.mount.append(state.overlayCanvas);

      state.baseContext = state.baseCanvas.getContext("2d", { alpha: true, desynchronized: true });
      state.overlayContext = state.overlayCanvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!state.baseContext || !state.overlayContext) throw new Error("PRODUCTS_COSMOS_CONTEXT_UNAVAILABLE");

      state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
      state.motionQuery?.addEventListener?.("change", onMotion);
      resolveReducedMotion();

      state.resizeObserver = new ResizeObserver(resize);
      state.resizeObserver.observe(state.mount);

      state.intersectionObserver = new IntersectionObserver(entries => {
        state.sceneVisible = entries.some(entry => entry.isIntersecting);
        stop();
        if (canRun()) scheduleBurst(true);
        publish({ lastAction: "scene-visibility-changed" });
      }, { threshold: 0.01 });
      state.intersectionObserver.observe(state.scene);

      document.addEventListener("visibilitychange", () => {
        state.documentVisible = !document.hidden;
        stop();
        if (canRun()) scheduleBurst(true);
        publish({ lastAction: "document-visibility-changed" });
      });

      state.initialized = true;
      resize();
      publish({ lastAction: "cosmos-initialized" });
      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: globalThis[RECEIPT_KEY] }));
    } catch (error) {
      fail(error);
    }
  }

  globalThis[MODULE] = Object.freeze({
    initialized: false,
    start: () => scheduleBurst(true),
    stop,
    resize,
    destroy,
    receipt: () => Object.freeze(buildReceipt())
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
