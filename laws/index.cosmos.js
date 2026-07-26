/* /laws/index.cosmos.js
   LAWS_COSMOS_ARCHCOIN_SCENE_FIELD_v5

   Complete replacement. Decorative background authority only.
   Static ARCHCOIN-derived Fibonacci field plus burst-only sparkles.
*/
(() => {
  "use strict";

  const GLOBAL = "DGB_LAWS_COSMOS";
  const RECEIPT = "DGB_LAWS_COSMOS_RECEIPT";
  const READY = "DGB_LAWS_COSMOS_READY";
  const FAILURE = "DGB_LAWS_COSMOS_FAILURE";
  const DESTROYED = "DGB_LAWS_COSMOS_DESTROYED";
  const CONTRACT = "LAWS_COSMOS_ARCHCOIN_SCENE_FIELD_v5";
  const STYLE_ID = "laws-cosmos-runtime-style";
  const LAYER_ID = "laws-cosmos-layer";
  const BASE_ID = "laws-cosmos-canvas";
  const SPARKLE_ID = "laws-cosmos-sparkle-canvas";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const SEED = 0x4c415753;

  if (globalThis[GLOBAL]?.initialized) return;

  const CONFIG = Object.freeze({
    mobileWidth: 820,
    compactWidth: 560,
    minimumStars: 52,
    maximumStars: 108,
    areaDivisor: 6100,
    candidateMultiplier: 8,
    rogueRatio: 0.125,
    horizontalWarp: 1.13,
    verticalWarp: 0.84,
    radialJitter: 0.022,
    angularJitter: 0.075,
    zigzag: 0.018,
    centerVoidX: 0.225,
    centerVoidY: 0.205,
    frameIntervalMs: 125,
    firstBurstMinMs: 2800,
    firstBurstMaxMs: 4600,
    burstMinMs: 1500,
    burstMaxMs: 3200,
    sparkleMinMs: 620,
    sparkleMaxMs: 980
  });

  const MASKS = Object.freeze([
    Object.freeze({ x: 0.24, y: 0.28, rx: 0.16, ry: 0.095, rotation: -0.46, feather: 0.22 }),
    Object.freeze({ x: 0.76, y: 0.25, rx: 0.12, ry: 0.17, rotation: 0.31, feather: 0.20 }),
    Object.freeze({ x: 0.72, y: 0.73, rx: 0.18, ry: 0.105, rotation: -0.19, feather: 0.24 }),
    Object.freeze({ x: 0.27, y: 0.77, rx: 0.105, ry: 0.15, rotation: 0.52, feather: 0.20 })
  ]);

  const COLORS = Object.freeze([
    "255, 248, 224",
    "154, 217, 225",
    "234, 208, 131",
    "170, 155, 224"
  ]);

  const state = {
    initialized: false,
    destroyed: false,
    failed: false,
    failureReason: "",
    visible: !document.hidden,
    pageActive: true,
    reducedMotion: false,
    quality: 1,
    width: 0,
    height: 0,
    pixelRatio: 1,
    root: null,
    layer: null,
    base: null,
    sparkle: null,
    baseContext: null,
    sparkleContext: null,
    stars: [],
    sparklePool: [],
    activeSparkles: [],
    rogueCount: 0,
    phyllotaxisCount: 0,
    baseDrawCount: 0,
    sparkleFrameCount: 0,
    burstTimer: 0,
    frameTimer: 0,
    resizeTimer: 0,
    motionQuery: null,
    motionObserver: null,
    handlers: {}
  };

  const api = {
    initialized: false,
    start: () => scheduleBurst(true),
    stop,
    destroy,
    resize: reason => resize(reason || "manual"),
    setQuality,
    receipt: () => Object.freeze(buildReceipt())
  };

  globalThis[GLOBAL] = api;

  const clamp = (value, minimum, maximum) =>
    Math.min(maximum, Math.max(minimum, value));

  const between = (random, minimum, maximum) =>
    minimum + random() * (maximum - minimum);

  function hash32(value) {
    let x = value >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d);
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b);
    x ^= x >>> 16;
    return x >>> 0;
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

  function buildReceipt(extra = {}) {
    return {
      contract: CONTRACT,
      sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",
      renderingModel: "static-full-viewport-base-burst-only-overlay",
      geometryModel: "golden-angle-square-root-jitter-elliptical-void-masked",
      lawsIdentityPreserved: true,
      fullViewportCoverage: true,
      archcoinDensityParity: true,
      strictCentralVoid: true,
      continuousCanvasAnimation: false,
      requestAnimationFrameUsed: false,
      dualSpacecraftPreserved: false,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      failureReason: state.failureReason,
      reducedMotion: state.reducedMotion,
      width: state.width,
      height: state.height,
      pixelRatio: state.pixelRatio,
      quality: state.quality,
      starCount: state.stars.length,
      rogueCount: state.rogueCount,
      phyllotaxisCount: state.phyllotaxisCount,
      baseDrawCount: state.baseDrawCount,
      sparkleFrameCount: state.sparkleFrameCount,
      sparkleFrameIntervalMs: CONFIG.frameIntervalMs,
      ownsNavigation: false,
      ownsWorldGeometry: false,
      ownsProjection: false,
      ownsControllerState: false,
      ownsInteraction: false,
      ownsPlanet: false,
      ownsLawContent: false,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT] = receipt;

    if (state.root) {
      state.root.dataset.lawsCosmosStatus = state.failed
        ? "held"
        : state.initialized ? "available" : "pending";
      state.root.dataset.lawsCosmosRunning = String(canRun());
      state.root.dataset.lawsCosmosModel = receipt.renderingModel;
      state.root.dataset.lawsCosmosContract = CONTRACT;
      state.root.dataset.lawsCosmosArchcoinDensityParity = "true";
      state.root.dataset.lawsCosmosStrictCentralVoid = "true";
      state.root.dataset.lawsCosmosReceipt = JSON.stringify(receipt);
    }

    return receipt;
  }

  function installStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.append(style);
    }

    style.textContent = `
      body > #${LAYER_ID} {
        position: fixed;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
        contain: strict;
        isolation: isolate;
        background:
          radial-gradient(ellipse at 50% -10%, rgba(127,147,255,.15), transparent 48%),
          radial-gradient(ellipse at 108% 42%, rgba(124,220,255,.11), transparent 44%),
          radial-gradient(ellipse at 52% 112%, rgba(243,217,139,.10), transparent 47%),
          radial-gradient(ellipse at -10% 55%, rgba(255,157,99,.09), transparent 43%),
          radial-gradient(ellipse at 50% 50%, transparent 22%, rgba(2,4,10,.24) 100%);
      }
      body > #${LAYER_ID} canvas {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: screen;
      }
      #${BASE_ID} { z-index: 1; opacity: .93; }
      #${SPARKLE_ID} { z-index: 2; }
      #laws-cosmos-spacecraft,
      #laws-cosmos-spacecraft-secondary,
      .laws-cosmos-craft { display: none !important; }
      @media (max-width: 820px) { #${BASE_ID} { opacity: .86; } }
      @media (max-width: 560px) { #${BASE_ID} { opacity: .78; } }
      @media (prefers-reduced-motion: reduce) {
        #${SPARKLE_ID} { display: none !important; }
      }
    `;
  }

  function canvas(id) {
    const element = document.createElement("canvas");
    element.id = id;
    element.setAttribute("aria-hidden", "true");
    return element;
  }

  function resolveSurfaces() {
    state.root = document.querySelector("[data-laws-root]");
    if (!state.root) throw new Error("LAWS_COSMOS_ROOT_NOT_FOUND");

    state.layer = document.getElementById(LAYER_ID) || document.createElement("div");
    state.layer.id = LAYER_ID;
    state.layer.setAttribute("aria-hidden", "true");

    state.base = document.getElementById(BASE_ID) || canvas(BASE_ID);
    state.sparkle = document.getElementById(SPARKLE_ID) || canvas(SPARKLE_ID);

    document.getElementById("laws-cosmos-spacecraft")?.remove();
    document.getElementById("laws-cosmos-spacecraft-secondary")?.remove();

    if (!state.base.isConnected) state.layer.append(state.base);
    if (!state.sparkle.isConnected) state.layer.append(state.sparkle);
    if (!state.layer.isConnected) document.body.prepend(state.layer);

    state.baseContext = state.base.getContext("2d", { alpha: true, desynchronized: true });
    state.sparkleContext = state.sparkle.getContext("2d", { alpha: true, desynchronized: true });

    if (!state.baseContext || !state.sparkleContext) {
      throw new Error("LAWS_COSMOS_CONTEXT_UNAVAILABLE");
    }
  }

  function centralVoid(x, y) {
    const dx = (x - 0.5) / CONFIG.centerVoidX;
    const dy = (y - 0.5) / CONFIG.centerVoidY;
    return dx * dx + dy * dy < 1;
  }

  function maskDistance(x, y, mask) {
    const cosine = Math.cos(mask.rotation);
    const sine = Math.sin(mask.rotation);
    const dx = x - mask.x;
    const dy = y - mask.y;
    const rotatedX = dx * cosine + dy * sine;
    const rotatedY = -dx * sine + dy * cosine;
    return Math.sqrt(
      rotatedX * rotatedX / (mask.rx * mask.rx) +
      rotatedY * rotatedY / (mask.ry * mask.ry)
    );
  }

  function masked(x, y, random, rogue) {
    for (const mask of MASKS) {
      const distance = maskDistance(x, y, mask);
      if (distance >= 1 + mask.feather) continue;
      if (distance <= 1) {
        if (!rogue || random() < 0.84) return true;
        continue;
      }
      const edge = 1 - (distance - 1) / mask.feather;
      if (random() < edge * (rogue ? 0.48 : 0.82)) return true;
    }
    return false;
  }

  function color(random) {
    const roll = random();
    return roll < 0.79
      ? COLORS[0]
      : roll < 0.91
        ? COLORS[1]
        : roll < 0.975 ? COLORS[2] : COLORS[3];
  }

  function rebuildField() {
    const mobileFactor = state.width <= CONFIG.compactWidth
      ? 0.70
      : state.width <= CONFIG.mobileWidth ? 0.84 : 1;
    const starCount = clamp(
      Math.floor(state.width * state.height / CONFIG.areaDivisor * state.quality * mobileFactor),
      CONFIG.minimumStars,
      CONFIG.maximumStars
    );
    const candidateCount = starCount * CONFIG.candidateMultiplier;
    const random = randomFactory(hash32(
      SEED ^ Math.round(state.width * 7) ^
      (Math.round(state.height * 7) << 1) ^
      Math.round(state.quality * 1000)
    ));

    const stars = [];
    let rogueCount = 0;
    let phyllotaxisCount = 0;

    for (let index = 0; index < candidateCount && stars.length < starCount; index += 1) {
      const normalized = (index + 1.5) / candidateCount;
      const radius = Math.sqrt(normalized) * 0.70 +
        between(random, -CONFIG.radialJitter, CONFIG.radialJitter);
      const angle = index * GOLDEN_ANGLE +
        between(random, -CONFIG.angularJitter, CONFIG.angularJitter) +
        (index % 2 === 0 ? 1 : -1) * CONFIG.zigzag;
      const rogue = random() < CONFIG.rogueRatio;

      let x = 0.5 + Math.cos(angle) * radius * CONFIG.horizontalWarp;
      let y = 0.5 + Math.sin(angle) * radius * CONFIG.verticalWarp;

      if (rogue) {
        x = between(random, 0.014, 0.986);
        y = between(random, 0.014, 0.986);
      }

      if (
        x < 0.014 || x > 0.986 ||
        y < 0.014 || y > 0.986 ||
        centralVoid(x, y) ||
        masked(x, y, random, rogue)
      ) continue;

      const depth = Math.pow(random(), 1.55);
      stars.push({
        x: x * state.width,
        y: y * state.height,
        depth,
        radius: between(random, 0.50, 1.58) * (0.62 + depth * 0.78),
        alpha: between(random, 0.27, 0.82) * (0.68 + depth * 0.42),
        color: color(random)
      });

      if (rogue) rogueCount += 1;
      else phyllotaxisCount += 1;
    }

    state.stars = stars;
    state.sparklePool = stars.filter(star => star.depth > 0.42 && star.alpha > 0.36);
    state.activeSparkles = [];
    state.rogueCount = rogueCount;
    state.phyllotaxisCount = phyllotaxisCount;
  }

  function sizeCanvas(element, context) {
    element.width = Math.max(1, Math.round(state.width * state.pixelRatio));
    element.height = Math.max(1, Math.round(state.height * state.pixelRatio));
    element.style.width = `${state.width}px`;
    element.style.height = `${state.height}px`;
    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
  }

  function drawBase() {
    const context = state.baseContext;
    context.clearRect(0, 0, state.width, state.height);

    for (const star of state.stars) {
      if (star.depth > 0.74) {
        context.fillStyle = `rgba(${star.color}, ${star.alpha * 0.12})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * 2.7, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = `rgba(${star.color}, ${clamp(star.alpha, 0.08, 0.94)})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    state.baseDrawCount += 1;
  }

  function clearSparkles() {
    state.sparkleContext?.clearRect(0, 0, state.width, state.height);
  }

  function canRun() {
    return Boolean(
      state.initialized && !state.destroyed && !state.failed &&
      state.visible && state.pageActive && !state.reducedMotion
    );
  }

  function stop() {
    clearTimeout(state.burstTimer);
    clearTimeout(state.frameTimer);
    state.burstTimer = 0;
    state.frameTimer = 0;
    state.activeSparkles = [];
    clearSparkles();
    return true;
  }

  function scheduleBurst(first = false) {
    if (!canRun() || state.burstTimer || state.frameTimer || state.activeSparkles.length || !state.sparklePool.length) {
      return false;
    }

    const random = randomFactory(hash32(SEED ^ Date.now()));
    const delay = first
      ? between(random, CONFIG.firstBurstMinMs, CONFIG.firstBurstMaxMs)
      : between(random, CONFIG.burstMinMs, CONFIG.burstMaxMs);

    state.burstTimer = setTimeout(() => {
      state.burstTimer = 0;
      beginBurst();
    }, delay);

    return true;
  }

  function beginBurst() {
    if (!canRun() || !state.sparklePool.length) return false;

    const random = randomFactory(hash32(SEED ^ Math.round(performance.now())));
    const count = random() < 0.24 ? 2 : 1;
    const now = performance.now();
    state.activeSparkles = [];

    for (let index = 0; index < count; index += 1) {
      const star = state.sparklePool[Math.floor(random() * state.sparklePool.length)];
      if (!star) continue;
      state.activeSparkles.push({
        star,
        start: now,
        duration: between(random, CONFIG.sparkleMinMs, CONFIG.sparkleMaxMs),
        reach: clamp(star.radius * between(random, 4.8, 8.4), 5, 16),
        alpha: between(random, 0.58, 0.94)
      });
    }

    drawSparkleFrame(now);
    scheduleSparkleFrame();
    return true;
  }

  function scheduleSparkleFrame() {
    if (!canRun() || state.frameTimer || !state.activeSparkles.length) return;
    state.frameTimer = setTimeout(() => {
      state.frameTimer = 0;
      runSparkleFrame();
    }, CONFIG.frameIntervalMs);
  }

  function runSparkleFrame() {
    if (!canRun()) {
      stop();
      return;
    }

    const now = performance.now();
    state.activeSparkles = state.activeSparkles.filter(
      sparkle => now - sparkle.start < sparkle.duration
    );
    drawSparkleFrame(now);

    if (state.activeSparkles.length) scheduleSparkleFrame();
    else {
      clearSparkles();
      scheduleBurst(false);
    }
  }

  function drawSparkleFrame(now) {
    const context = state.sparkleContext;
    context.clearRect(0, 0, state.width, state.height);
    context.lineCap = "round";

    for (const sparkle of state.activeSparkles) {
      const progress = clamp((now - sparkle.start) / sparkle.duration, 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      const alpha = sparkle.alpha * Math.pow(pulse, 2.15);
      const reach = sparkle.reach * (0.64 + pulse * 0.82);
      const star = sparkle.star;

      context.strokeStyle = `rgba(${star.color}, ${alpha})`;
      context.lineWidth = 0.74;
      context.beginPath();
      context.moveTo(star.x - reach, star.y);
      context.lineTo(star.x + reach, star.y);
      context.moveTo(star.x, star.y - reach);
      context.lineTo(star.x, star.y + reach);
      context.stroke();
    }

    state.sparkleFrameCount += 1;
  }

  function resize(reason = "resize") {
    if (!state.layer || !state.baseContext || !state.sparkleContext) return false;

    const width = Math.max(1, innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, innerHeight || document.documentElement.clientHeight || 1);
    const pixelRatio = clamp(devicePixelRatio || 1, 1, width <= CONFIG.mobileWidth ? 1 : 1.25);

    if (width === state.width && height === state.height && pixelRatio === state.pixelRatio && reason !== "scroll") {
      return false;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    sizeCanvas(state.base, state.baseContext);
    sizeCanvas(state.sparkle, state.sparkleContext);
    rebuildField();
    drawBase();
    clearSparkles();
    publish({ lastAction: `field-${reason}` });
    return true;
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset?.reducedMotion === "true" ||
      state.root?.dataset?.lawsReducedMotion === "true"
    );
  }

  function evaluate(reason) {
    resolveReducedMotion();
    if (canRun()) scheduleBurst(true);
    else stop();
    publish({ lastAction: reason });
  }

  function bind() {
    state.motionQuery = matchMedia?.("(prefers-reduced-motion: reduce)") || null;
    state.handlers.visibility = () => {
      state.visible = !document.hidden;
      evaluate("visibility-change");
    };
    state.handlers.pageHide = () => {
      state.pageActive = false;
      stop();
    };
    state.handlers.pageShow = () => {
      state.pageActive = true;
      evaluate("pageshow");
    };
    state.handlers.resize = () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(() => resize("resize"), 120);
    };
    state.handlers.motion = () => evaluate("motion-change");

    document.addEventListener("visibilitychange", state.handlers.visibility, { passive: true });
    addEventListener("pagehide", state.handlers.pageHide, { passive: true });
    addEventListener("pageshow", state.handlers.pageShow, { passive: true });
    addEventListener("resize", state.handlers.resize, { passive: true });
    state.motionQuery?.addEventListener?.("change", state.handlers.motion);

    if ("MutationObserver" in globalThis) {
      state.motionObserver = new MutationObserver(() => evaluate("root-motion-change"));
      state.motionObserver.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-reduced-motion", "data-laws-reduced-motion"]
      });
    }
  }

  function unbind() {
    document.removeEventListener("visibilitychange", state.handlers.visibility);
    removeEventListener("pagehide", state.handlers.pageHide);
    removeEventListener("pageshow", state.handlers.pageShow);
    removeEventListener("resize", state.handlers.resize);
    state.motionQuery?.removeEventListener?.("change", state.handlers.motion);
    state.motionObserver?.disconnect();
  }

  function setQuality(value) {
    const next = clamp(Number(value), 0.62, 1);
    if (!Number.isFinite(next) || Math.abs(next - state.quality) < 0.02) return false;
    state.quality = next;
    rebuildField();
    drawBase();
    clearSparkles();
    publish({ lastAction: "quality-updated" });
    return true;
  }

  function destroy() {
    if (state.destroyed) return true;
    stop();
    clearTimeout(state.resizeTimer);
    unbind();
    state.layer?.remove();
    document.getElementById(STYLE_ID)?.remove();
    state.destroyed = true;
    state.initialized = false;
    api.initialized = false;
    const receipt = publish({ lastAction: "destroyed" });
    dispatchEvent(new CustomEvent(DESTROYED, { detail: receipt }));
    return true;
  }

  function fail(error) {
    state.failed = true;
    state.failureReason = error instanceof Error ? error.message : String(error);
    stop();
    const receipt = publish({ lastAction: "failure" });
    dispatchEvent(new CustomEvent(FAILURE, { detail: receipt }));
  }

  function initialize() {
    try {
      installStyle();
      resolveSurfaces();
      bind();
      resolveReducedMotion();
      state.initialized = true;
      api.initialized = true;
      resize("initialization");
      evaluate("initialized");
      const receipt = publish({ lastAction: "ready" });
      dispatchEvent(new CustomEvent(READY, { detail: receipt }));
    } catch (error) {
      fail(error);
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", initialize, { once: true })
    : initialize();
})();
