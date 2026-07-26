/* /showroom/index.cosmos.js
   Showroom scene-contained ARCHCOIN Fibonacci starfield transplant.

   Complete canonical implementation. Preserves Showroom identity and
   decorative-only authority while adopting the accepted ARCHCOIN/Laws
   static-base and burst-only sparkle field inside the Showroom orbit scene.
   No wrapper, secondary source, synchronous request, dynamic evaluation,
   navigation, geometry, projection, controller, interaction, planet,
   Diamond, Window, route, or content authority is introduced.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "SHOWROOM_COSMOS";
  const RECEIPT_KEY = "SHOWROOM_COSMOS_RECEIPT";
  const READY_EVENT = "SHOWROOM_COSMOS_READY";
  const FAILURE_EVENT = "SHOWROOM_COSMOS_FAILURE";
  const STYLE_ID = "showroom-archcoin-starfield-runtime-style";
  const CANVAS_ATTRIBUTE = "data-showroom-cosmos-canvas";
  const BASE_VALUE = "base";
  const OVERLAY_VALUE = "sparkle";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x53484f57;

  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const CONFIG = Object.freeze({
    mountSelector: "[data-showroom-cosmic-field]",
    sceneSelector: "[data-showroom-orbit-field][data-showroom-scene-field], [data-showroom-orbit-field]",
    rootSelector: "[data-showroom-root]",
    mobileWidth: 820,
    compactWidth: 560,
    mobilePixelRatioCap: 1,
    desktopPixelRatioCap: 1.25,
    minimumStars: 58,
    maximumStars: 118,
    starAreaDivisor: 5800,
    rogueRatio: 0.125,
    candidateMultiplier: 8,
    horizontalWarp: 1.13,
    verticalWarp: 0.84,
    radialJitter: 0.022,
    angularJitter: 0.075,
    zigzagPerturbation: 0.018,
    centerVoidRadiusX: 0.23,
    centerVoidRadiusY: 0.21,
    minimumSparkles: 4,
    maximumSparkles: 8,
    firstBurstDelayMinimumMs: 2800,
    firstBurstDelayMaximumMs: 4600,
    burstDelayMinimumMs: 1500,
    burstDelayMaximumMs: 3200,
    burstDurationMinimumMs: 620,
    burstDurationMaximumMs: 980,
    sparkleFrameIntervalMs: 125
  });

  const VOID_MASKS = Object.freeze([
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
    documentVisible: !document.hidden,
    sceneVisible: false,
    reducedMotion: false,
    root: null,
    scene: null,
    mount: null,
    baseCanvas: null,
    baseContext: null,
    overlayCanvas: null,
    overlayContext: null,
    width: 0,
    height: 0,
    pixelRatio: 1,
    quality: 1,
    stars: [],
    sparkles: [],
    activeSparkles: [],
    rogueCount: 0,
    phyllotaxisCount: 0,
    burstTimer: 0,
    frameTimer: 0,
    baseDrawCount: 0,
    sparkleFrameCount: 0,
    resizeObserver: null,
    intersectionObserver: null,
    motionQuery: null,
    onVisibility: null,
    onMotion: null,
    onResize: null
  };

  const api = {
    initialized: false,
    start: () => scheduleNextBurst(true),
    stop: stopSparkles,
    destroy,
    resize,
    setQuality,
    receipt: () => Object.freeze(buildReceipt())
  };

  globalThis[GLOBAL_KEY] = api;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function hash32(value) {
    let x = value >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d);
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b);
    x ^= x >>> 16;
    return x >>> 0;
  }

  function createRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomBetween(random, minimum, maximum) {
    return minimum + random() * (maximum - minimum);
  }

  function shuffled(values, random) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function buildReceipt(extra = {}) {
    return {
      contract: "SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v1",
      module: GLOBAL_KEY,
      file: "/showroom/index.cosmos.js",
      sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",
      renderingModel: "static-base-burst-overlay",
      geometryModel: "golden-angle-square-root-jitter-elliptical-void-masked",
      singleCompleteFile: true,
      wrapperUsed: false,
      secondarySourceUsed: false,
      synchronousRequestUsed: false,
      dynamicEvaluationUsed: false,
      showroomIdentityPreserved: true,
      sceneContained: true,
      fullViewportLayer: false,
      continuousAnimation: false,
      requestAnimationFrameUsed: false,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      documentVisible: state.documentVisible,
      sceneVisible: state.sceneVisible,
      reducedMotion: state.reducedMotion,
      width: state.width,
      height: state.height,
      pixelRatio: state.pixelRatio,
      quality: state.quality,
      starCount: state.stars.length,
      phyllotaxisCount: state.phyllotaxisCount,
      rogueCount: state.rogueCount,
      rogueRatio: CONFIG.rogueRatio,
      voidMaskCount: VOID_MASKS.length,
      sparkleCount: state.sparkles.length,
      activeSparkleCount: state.activeSparkles.length,
      sparkleFrameIntervalMs: CONFIG.sparkleFrameIntervalMs,
      baseDrawCount: state.baseDrawCount,
      sparkleFrameCount: state.sparkleFrameCount,
      ownsNavigation: false,
      ownsWorldGeometry: false,
      ownsProjection: false,
      ownsControllerState: false,
      ownsInteraction: false,
      ownsCrystals: false,
      ownsPlanet: false,
      ownsDiamond: false,
      ownsWindow: false,
      ownsRoutes: false,
      ownsContent: false,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    if (state.root) {
      state.root.dataset.showroomCosmosStatus = state.failed
        ? "held"
        : state.initialized
          ? "available"
          : "pending";
      state.root.dataset.showroomCosmosRunning = String(canRun());
      state.root.dataset.showroomCosmosModel = receipt.renderingModel;
      state.root.dataset.showroomCosmosContract = receipt.contract;
      state.root.dataset.showroomCosmosSourceModel = receipt.sourceModel;
      state.root.dataset.showroomCosmosSceneContained = "true";
      state.root.dataset.showroomCosmosReceipt = JSON.stringify(receipt);
    }
    const output = document.querySelector("[data-showroom-cosmos-receipt]");
    if (output) output.value = JSON.stringify(receipt);
    return receipt;
  }

  function fail(error) {
    if (state.failed) return;
    state.failed = true;
    stopSparkles();
    const message = error instanceof Error ? error.message : String(error);
    publish({ lastAction: "cosmos-failure", lastFailure: message });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, {
      detail: Object.freeze({ message })
    }));
  }

  function installStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.append(style);
    }
    style.textContent = `
      [data-showroom-orbit-field] {
        isolation: isolate;
        background:
          radial-gradient(ellipse at 50% 46%, rgba(54, 105, 174, .13), transparent 34%),
          radial-gradient(ellipse at 18% 76%, rgba(89, 65, 142, .07), transparent 30%),
          radial-gradient(ellipse at 82% 24%, rgba(39, 126, 151, .065), transparent 30%),
          linear-gradient(180deg, #02050d 0%, #030711 52%, #01030a 100%) !important;
        box-shadow:
          inset 0 0 5.5rem rgba(0, 0, 0, .44),
          inset 0 0 2.8rem rgba(67, 120, 190, .045),
          0 0 2.4rem rgba(117, 233, 255, .035) !important;
      }
      [data-showroom-orbit-field]::before,
      [data-showroom-orbit-field]::after,
      [data-showroom-cosmic-field]::before,
      [data-showroom-cosmic-field]::after {
        content: none !important;
        display: none !important;
      }
      [data-showroom-cosmic-field] {
        position: absolute;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
        contain: strict;
        isolation: isolate;
        opacity: 1 !important;
        background: transparent !important;
        mix-blend-mode: normal !important;
      }
      [data-showroom-cosmic-field] canvas[${CANVAS_ATTRIBUTE}] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: screen;
      }
      [${CANVAS_ATTRIBUTE}="${BASE_VALUE}"] {
        z-index: 1;
        opacity: .92;
      }
      [${CANVAS_ATTRIBUTE}="${OVERLAY_VALUE}"] {
        z-index: 2;
      }
      @media (max-width: 820px) {
        [${CANVAS_ATTRIBUTE}="${BASE_VALUE}"] { opacity: .86; }
      }
      @media (max-width: 560px) {
        [${CANVAS_ATTRIBUTE}="${BASE_VALUE}"] { opacity: .80; }
      }
      @media (prefers-reduced-motion: reduce) {
        [${CANVAS_ATTRIBUTE}="${OVERLAY_VALUE}"] { display: none !important; }
      }
    `;
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset?.showroomReducedMotion === "true" ||
      state.root?.dataset?.reducedMotion === "true"
    );
    return state.reducedMotion;
  }

  function configureCanvas(canvas, value) {
    canvas.setAttribute(CANVAS_ATTRIBUTE, value);
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.pointerEvents = "none";
    return canvas;
  }

  function createCanvases() {
    state.mount = document.querySelector(CONFIG.mountSelector);
    state.scene = document.querySelector(CONFIG.sceneSelector);
    state.root = document.querySelector(CONFIG.rootSelector);

    if (!state.mount || !state.scene || !state.root) {
      throw new Error("SHOWROOM_ARCHCOIN_STARFIELD_SURFACE_NOT_FOUND");
    }

    installStyle();

    const baseSelector = `[${CANVAS_ATTRIBUTE}="${BASE_VALUE}"]`;
    const overlaySelector = `[${CANVAS_ATTRIBUTE}="${OVERLAY_VALUE}"]`;
    const baseCanvas = state.mount.querySelector(baseSelector) ||
      configureCanvas(document.createElement("canvas"), BASE_VALUE);
    const overlayCanvas = state.mount.querySelector(overlaySelector) ||
      configureCanvas(document.createElement("canvas"), OVERLAY_VALUE);

    if (!baseCanvas.isConnected) state.mount.append(baseCanvas);
    if (!overlayCanvas.isConnected) state.mount.append(overlayCanvas);

    const baseContext = baseCanvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });
    const overlayContext = overlayCanvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (!baseContext || !overlayContext) {
      throw new Error("SHOWROOM_ARCHCOIN_STARFIELD_CONTEXT_UNAVAILABLE");
    }

    state.baseCanvas = baseCanvas;
    state.baseContext = baseContext;
    state.overlayCanvas = overlayCanvas;
    state.overlayContext = overlayContext;
  }

  function inCentralVoid(x, y) {
    const dx = (x - 0.5) / CONFIG.centerVoidRadiusX;
    const dy = (y - 0.5) / CONFIG.centerVoidRadiusY;
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
      (rotatedX * rotatedX) / (mask.rx * mask.rx) +
      (rotatedY * rotatedY) / (mask.ry * mask.ry)
    );
  }

  function rejectedByVoidMask(x, y, random, rogue = false) {
    for (const mask of VOID_MASKS) {
      const distance = maskDistance(x, y, mask);
      if (distance < 1) return true;
      if (!rogue && distance < 1 + mask.feather) {
        const acceptance = (distance - 1) / mask.feather;
        if (random() > acceptance) return true;
      }
    }
    return false;
  }

  function buildStars() {
    const area = state.width * state.height;
    const desired = clamp(
      Math.round(area / CONFIG.starAreaDivisor),
      CONFIG.minimumStars,
      CONFIG.maximumStars
    );
    const random = createRandom(hash32(FIELD_SEED ^ state.width ^ (state.height << 8)));
    const candidateCount = desired * CONFIG.candidateMultiplier;
    const stars = [];
    let phyllotaxisCount = 0;
    let rogueCount = 0;

    for (let index = 0; index < candidateCount && stars.length < desired; index += 1) {
      const rogue = random() < CONFIG.rogueRatio;
      let x;
      let y;

      if (rogue) {
        x = randomBetween(random, 0.025, 0.975);
        y = randomBetween(random, 0.025, 0.975);
      } else {
        const normalized = Math.sqrt((index + 0.5) / candidateCount);
        const angle =
          index * GOLDEN_ANGLE +
          randomBetween(random, -CONFIG.angularJitter, CONFIG.angularJitter) +
          Math.sin(index * 2.17) * CONFIG.zigzagPerturbation;
        const radial = normalized + randomBetween(random, -CONFIG.radialJitter, CONFIG.radialJitter);
        x = 0.5 + Math.cos(angle) * radial * 0.5 * CONFIG.horizontalWarp;
        y = 0.5 + Math.sin(angle) * radial * 0.5 * CONFIG.verticalWarp;
      }

      if (x <= 0.015 || x >= 0.985 || y <= 0.015 || y >= 0.985) continue;
      if (inCentralVoid(x, y)) continue;
      if (rejectedByVoidMask(x, y, random, rogue)) continue;

      const sizeRoll = random();
      const radius = sizeRoll > 0.965
        ? randomBetween(random, 1.25, 2.05)
        : sizeRoll > 0.79
          ? randomBetween(random, 0.72, 1.18)
          : randomBetween(random, 0.34, 0.68);
      const alpha = sizeRoll > 0.965
        ? randomBetween(random, 0.70, 0.96)
        : randomBetween(random, 0.28, 0.72);
      const color = COLORS[Math.floor(random() * COLORS.length)] || COLORS[0];

      stars.push(Object.freeze({ x, y, radius, alpha, color }));
      if (rogue) rogueCount += 1;
      else phyllotaxisCount += 1;
    }

    state.stars = stars;
    state.phyllotaxisCount = phyllotaxisCount;
    state.rogueCount = rogueCount;

    const sparkleCount = clamp(
      Math.round(stars.length * 0.065),
      CONFIG.minimumSparkles,
      CONFIG.maximumSparkles
    );
    state.sparkles = shuffled(
      stars.filter(star => star.radius >= 0.72),
      random
    ).slice(0, sparkleCount);
  }

  function clearContext(context, canvas) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawStar(context, star, intensity = 1) {
    const x = star.x * state.width;
    const y = star.y * state.height;
    const radius = star.radius * state.pixelRatio;
    const alpha = clamp(star.alpha * intensity, 0, 1);

    context.save();
    context.globalCompositeOperation = "screen";
    context.fillStyle = `rgba(${star.color}, ${alpha})`;
    context.shadowColor = `rgba(${star.color}, ${alpha * 0.68})`;
    context.shadowBlur = Math.max(1, radius * 3.4);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    if (star.radius > 1.1) {
      context.strokeStyle = `rgba(${star.color}, ${alpha * 0.45})`;
      context.lineWidth = Math.max(0.45, radius * 0.28);
      context.beginPath();
      context.moveTo(x - radius * 2.8, y);
      context.lineTo(x + radius * 2.8, y);
      context.moveTo(x, y - radius * 2.8);
      context.lineTo(x, y + radius * 2.8);
      context.stroke();
    }
    context.restore();
  }

  function drawBase() {
    if (!state.baseContext || !state.baseCanvas) return;
    clearContext(state.baseContext, state.baseCanvas);
    state.baseContext.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    for (const star of state.stars) drawStar(state.baseContext, star, 1);
    state.baseDrawCount += 1;
  }

  function drawSparkles() {
    if (!state.overlayContext || !state.overlayCanvas) return;
    clearContext(state.overlayContext, state.overlayCanvas);
    state.overlayContext.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    const now = performance.now();
    state.activeSparkles = state.activeSparkles.filter(record => now < record.end);
    for (const record of state.activeSparkles) {
      const progress = clamp((now - record.start) / (record.end - record.start), 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      drawStar(state.overlayContext, record.star, 0.6 + pulse * 1.65);
    }
    state.sparkleFrameCount += 1;
    if (state.activeSparkles.length > 0 && canRun()) {
      state.frameTimer = window.setTimeout(drawSparkles, CONFIG.sparkleFrameIntervalMs);
    } else {
      state.frameTimer = 0;
    }
  }

  function canRun() {
    return Boolean(
      state.initialized &&
      !state.destroyed &&
      !state.failed &&
      state.documentVisible &&
      state.sceneVisible &&
      !state.reducedMotion
    );
  }

  function stopSparkles() {
    if (state.burstTimer) window.clearTimeout(state.burstTimer);
    if (state.frameTimer) window.clearTimeout(state.frameTimer);
    state.burstTimer = 0;
    state.frameTimer = 0;
    state.activeSparkles = [];
    if (state.overlayContext && state.overlayCanvas) {
      clearContext(state.overlayContext, state.overlayCanvas);
    }
    publish({ lastAction: "sparkles-stopped" });
  }

  function scheduleNextBurst(first = false) {
    if (!canRun() || state.burstTimer) return false;
    const random = createRandom(hash32(FIELD_SEED ^ Date.now()));
    const delay = first
      ? randomBetween(random, CONFIG.firstBurstDelayMinimumMs, CONFIG.firstBurstDelayMaximumMs)
      : randomBetween(random, CONFIG.burstDelayMinimumMs, CONFIG.burstDelayMaximumMs);
    state.burstTimer = window.setTimeout(() => {
      state.burstTimer = 0;
      if (!canRun()) return;
      const candidates = shuffled(state.sparkles, random);
      const count = Math.max(1, Math.min(candidates.length, 1 + Math.floor(random() * 3)));
      const start = performance.now();
      state.activeSparkles = candidates.slice(0, count).map(star => ({
        star,
        start,
        end: start + randomBetween(random, CONFIG.burstDurationMinimumMs, CONFIG.burstDurationMaximumMs)
      }));
      drawSparkles();
      scheduleNextBurst(false);
    }, delay);
    return true;
  }

  function resize() {
    if (!state.scene || !state.baseCanvas || !state.overlayCanvas) return false;
    const rect = state.scene.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const cap = width <= CONFIG.mobileWidth
      ? CONFIG.mobilePixelRatioCap
      : CONFIG.desktopPixelRatioCap;
    const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap) * state.quality;

    if (
      width === state.width &&
      height === state.height &&
      Math.abs(pixelRatio - state.pixelRatio) < 0.001
    ) return false;

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;

    for (const canvas of [state.baseCanvas, state.overlayCanvas]) {
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    buildStars();
    drawBase();
    drawSparkles();
    publish({ lastAction: "resized" });
    return true;
  }

  function setQuality(value) {
    const next = clamp(Number(value) || 1, 0.5, 1);
    if (next === state.quality) return false;
    state.quality = next;
    return resize();
  }

  function bindLifecycle() {
    state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
    resolveReducedMotion();

    state.onVisibility = () => {
      state.documentVisible = !document.hidden;
      if (canRun()) scheduleNextBurst(true);
      else stopSparkles();
      publish({ lastAction: "visibility-updated" });
    };
    document.addEventListener("visibilitychange", state.onVisibility, { passive: true });

    state.onMotion = event => {
      state.reducedMotion = Boolean(event.matches);
      if (canRun()) scheduleNextBurst(true);
      else stopSparkles();
      publish({ lastAction: "motion-updated" });
    };
    if (state.motionQuery?.addEventListener) {
      state.motionQuery.addEventListener("change", state.onMotion);
    } else if (state.motionQuery?.addListener) {
      state.motionQuery.addListener(state.onMotion);
    }

    state.onResize = () => resize();
    globalThis.addEventListener("resize", state.onResize, { passive: true });

    if (typeof ResizeObserver === "function") {
      state.resizeObserver = new ResizeObserver(() => resize());
      state.resizeObserver.observe(state.scene);
    }

    if (typeof IntersectionObserver === "function") {
      state.intersectionObserver = new IntersectionObserver(entries => {
        state.sceneVisible = entries.some(entry => entry.isIntersecting);
        if (canRun()) scheduleNextBurst(true);
        else stopSparkles();
        publish({ lastAction: "scene-visibility-updated" });
      }, { threshold: 0.01 });
      state.intersectionObserver.observe(state.scene);
    } else {
      state.sceneVisible = true;
    }
  }

  function destroy() {
    if (state.destroyed) return true;
    state.destroyed = true;
    stopSparkles();
    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();
    if (state.onVisibility) document.removeEventListener("visibilitychange", state.onVisibility);
    if (state.onResize) globalThis.removeEventListener("resize", state.onResize);
    if (state.motionQuery?.removeEventListener && state.onMotion) {
      state.motionQuery.removeEventListener("change", state.onMotion);
    } else if (state.motionQuery?.removeListener && state.onMotion) {
      state.motionQuery.removeListener(state.onMotion);
    }
    state.baseCanvas?.remove();
    state.overlayCanvas?.remove();
    document.getElementById(STYLE_ID)?.remove();
    state.initialized = false;
    api.initialized = false;
    publish({ lastAction: "destroyed" });
    return true;
  }

  function initialize() {
    try {
      createCanvases();
      bindLifecycle();
      state.initialized = true;
      api.initialized = true;
      resize();
      if (!state.intersectionObserver) state.sceneVisible = true;
      if (canRun()) scheduleNextBurst(true);
      const receipt = publish({ lastAction: "initialized" });
      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, { detail: receipt }));
    } catch (error) {
      fail(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
