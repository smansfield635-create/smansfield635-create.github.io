/* /assets/compass/compass.cosmos.js
   Main Compass scene-contained ARCHCOIN Fibonacci starfield transplant.

   Preserves Main Compass identity and decorative-only authority while adopting the
   accepted ARCHCOIN static-base and burst-only sparkle field inside the Laws
   orbit scene. No navigation, world geometry, projection, controller,
   interaction, planet, or law-content authority is introduced.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_COMPASS_COSMOS";
  const RECEIPT_KEY = "DGB_COMPASS_COSMOS_RECEIPT";
  const READY_EVENT = "DGB_COMPASS_COSMOS_READY";
  const FAILURE_EVENT = "DGB_COMPASS_COSMOS_FAILURE";
  const STYLE_ID = "compass-archcoin-starfield-runtime-style";
  const CANVAS_ATTRIBUTE = "data-compass-cosmos-canvas";
  const BASE_VALUE = "base";
  const OVERLAY_VALUE = "sparkle";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x4d41494e;

  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const CONFIG = Object.freeze({
    mountSelector: "[data-compass-cosmic-field]",
    sceneSelector: "[data-compass-scene]",
    rootSelector: "[data-compass-root]",
    mobileWidth: 820,
    compactWidth: 560,
    mobilePixelRatioCap: 1,
    desktopPixelRatioCap: 1.25,
    minimumStars: 52,
    maximumStars: 108,
    starAreaDivisor: 6100,
    rogueRatio: 0.125,
    candidateMultiplier: 8,
    horizontalWarp: 1.13,
    verticalWarp: 0.84,
    radialJitter: 0.022,
    angularJitter: 0.075,
    zigzagPerturbation: 0.018,
    centerVoidRadiusX: 0.225,
    centerVoidRadiusY: 0.205,
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
    motionObserver: null,
    motionQuery: null,
    onVisibility: null,
    onMotion: null,
    onResize: null
  };

  const api = Object.freeze({
    initialized: false,
    start: () => scheduleNextBurst(true),
    stop: stopSparkles,
    destroy,
    resize,
    setQuality,
    receipt: () => Object.freeze(buildReceipt())
  });

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
      contract: "DGB_COMPASS_COSMOS_ARCHCOIN_SCENE_FIELD_v1",
      module: GLOBAL_KEY,
      sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",
      renderingModel: "static-base-burst-overlay",
      geometryModel: "golden-angle-square-root-jitter-elliptical-void-masked",
      compassIdentityPreserved: true,
      sceneContained: true,
      fullViewportLayer: false,
      dualSpacecraftPreserved: false,
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
      ownsPlanet: false,
      ownsCompassContent: false,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    if (state.root) {
      state.root.dataset.compassCosmosStatus = state.failed
        ? "held"
        : state.initialized
          ? "available"
          : "pending";
      state.root.dataset.compassCosmosRunning = String(canRun());
      state.root.dataset.compassCosmosModel = receipt.renderingModel;
      state.root.dataset.compassCosmosContract = receipt.contract;
      state.root.dataset.compassCosmosSourceModel = receipt.sourceModel;
      state.root.dataset.compassCosmosSceneContained = "true";
      state.root.dataset.compassCosmosReceipt = JSON.stringify(receipt);
    }
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
      [data-compass-cosmic-field] {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        contain: strict;
        isolation: isolate;
      }
      [data-compass-cosmic-field] canvas[${CANVAS_ATTRIBUTE}] {
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
        opacity: .93;
      }
      [${CANVAS_ATTRIBUTE}="${OVERLAY_VALUE}"] {
        z-index: 2;
      }
      @media (max-width: 820px) {
        [${CANVAS_ATTRIBUTE}="${BASE_VALUE}"] { opacity: .86; }
      }
      @media (max-width: 560px) {
        [${CANVAS_ATTRIBUTE}="${BASE_VALUE}"] { opacity: .78; }
      }
      @media (prefers-reduced-motion: reduce) {
        [${CANVAS_ATTRIBUTE}="${OVERLAY_VALUE}"] { display: none !important; }
      }
    `;
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset?.reducedMotion === "true" ||
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
      throw new Error("COMPASS_ARCHCOIN_STARFIELD_SURFACE_NOT_FOUND");
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
      throw new Error("COMPASS_ARCHCOIN_STARFIELD_CONTEXT_UNAVAILABLE");
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
      if (distance >= 1 + mask.feather) continue;
      if (distance <= 1) {
        if (!rogue || random() < 0.84) return true;
        continue;
      }
      const edgeStrength = 1 - (distance - 1) / mask.feather;
      const rejection = edgeStrength * (rogue ? 0.48 : 0.82);
      if (random() < rejection) return true;
    }
    return false;
  }

  function insideFieldBounds(x, y) {
    return x >= 0.014 && x <= 0.986 && y >= 0.014 && y <= 0.986;
  }

  function chooseColor(random) {
    const roll = random();
    return roll < 0.79
      ? COLORS[0]
      : roll < 0.91
        ? COLORS[1]
        : roll < 0.975
          ? COLORS[2]
          : COLORS[3];
  }

  function createStarRecord(position, random, rogue) {
    const depth = Math.pow(random(), 1.55);
    return {
      x: position.x * state.width,
      y: position.y * state.height,
      radius: randomBetween(random, 0.50, 1.58) * (0.62 + depth * 0.78),
      alpha: randomBetween(random, 0.27, 0.82) * (0.68 + depth * 0.42),
      color: chooseColor(random),
      depth,
      rogue
    };
  }

  function createPhyllotaxisStars(count, random) {
    const stars = [];
    const maximumCandidates = Math.max(count * CONFIG.candidateMultiplier, count + 32);

    for (
      let candidate = 0;
      candidate < maximumCandidates && stars.length < count;
      candidate += 1
    ) {
      const normalized = (candidate + 1.5) / maximumCandidates;
      const baseRadius = Math.sqrt(normalized) * 0.70;
      const radialJitter = randomBetween(random, -CONFIG.radialJitter, CONFIG.radialJitter);
      const angleJitter = randomBetween(random, -CONFIG.angularJitter, CONFIG.angularJitter);
      const alternating = candidate % 2 === 0 ? 1 : -1;
      const angle =
        candidate * GOLDEN_ANGLE +
        angleJitter +
        alternating * CONFIG.zigzagPerturbation;
      const radius = Math.max(0, baseRadius + radialJitter);
      const x = 0.5 + Math.cos(angle) * radius * CONFIG.horizontalWarp;
      const y = 0.5 + Math.sin(angle) * radius * CONFIG.verticalWarp;

      if (!insideFieldBounds(x, y)) continue;
      if (inCentralVoid(x, y)) continue;
      if (rejectedByVoidMask(x, y, random, false)) continue;

      stars.push(createStarRecord({ x, y }, random, false));
    }

    return stars;
  }

  function createRogueStars(count, random) {
    const stars = [];
    const maximumAttempts = Math.max(80, count * 30);

    for (
      let attempt = 0;
      attempt < maximumAttempts && stars.length < count;
      attempt += 1
    ) {
      const x = randomBetween(random, 0.018, 0.982);
      const y = randomBetween(random, 0.018, 0.982);
      if (inCentralVoid(x, y)) continue;
      if (rejectedByVoidMask(x, y, random, true)) continue;
      stars.push(createStarRecord({ x, y }, random, true));
    }

    return stars;
  }

  function createSparkles(count, random) {
    const candidates = state.stars
      .map((star, index) => ({ star, index }))
      .filter(({ star }) => star.depth > 0.42 && star.alpha > 0.36);

    return shuffled(candidates, random).slice(0, count).map(({ index, star }) => ({
      starIndex: index,
      radius: clamp(star.radius * randomBetween(random, 1.15, 1.55), 1.25, 2.45),
      alpha: randomBetween(random, 0.58, 0.94),
      color: star.color
    }));
  }

  function rebuildParticleField() {
    if (!state.width || !state.height) return;

    const area = state.width * state.height;
    const mobileFactor = state.width <= CONFIG.compactWidth
      ? 0.70
      : state.width <= CONFIG.mobileWidth
        ? 0.84
        : 1;
    const density = state.quality * mobileFactor;
    const starCount = clamp(
      Math.floor((area / CONFIG.starAreaDivisor) * density),
      CONFIG.minimumStars,
      CONFIG.maximumStars
    );
    const rogueCount = clamp(
      Math.round(starCount * CONFIG.rogueRatio),
      6,
      Math.max(6, starCount - 12)
    );
    const phyllotaxisCount = starCount - rogueCount;
    const sparkleCount = clamp(
      Math.floor(CONFIG.maximumSparkles * density),
      CONFIG.minimumSparkles,
      CONFIG.maximumSparkles
    );
    const dimensionSeed = hash32(
      FIELD_SEED ^
      Math.round(state.width * 8) ^
      (Math.round(state.height * 8) << 1) ^
      Math.round(state.quality * 1000)
    );
    const random = createRandom(dimensionSeed);
    const phyllotaxisStars = createPhyllotaxisStars(phyllotaxisCount, random);
    const missing = Math.max(0, phyllotaxisCount - phyllotaxisStars.length);
    const rogueStars = createRogueStars(rogueCount + missing, random);

    state.stars = [...phyllotaxisStars, ...rogueStars];
    state.phyllotaxisCount = phyllotaxisStars.length;
    state.rogueCount = rogueStars.length;
    state.sparkles = createSparkles(sparkleCount, random);
    state.activeSparkles.length = 0;
  }

  function applyCanvasSize(canvas, context, width, height, pixelRatio) {
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.imageSmoothingEnabled = true;
  }

  function resize() {
    if (
      !state.baseCanvas ||
      !state.baseContext ||
      !state.overlayCanvas ||
      !state.overlayContext ||
      !state.mount ||
      !state.scene
    ) return false;

    const width = Math.max(1, state.mount.clientWidth || state.scene.clientWidth || 1);
    const height = Math.max(1, state.mount.clientHeight || state.scene.clientHeight || 1);
    const cap = width <= CONFIG.mobileWidth
      ? CONFIG.mobilePixelRatioCap
      : CONFIG.desktopPixelRatioCap;
    const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap);

    if (
      width === state.width &&
      height === state.height &&
      pixelRatio === state.pixelRatio
    ) return false;

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;

    applyCanvasSize(state.baseCanvas, state.baseContext, width, height, pixelRatio);
    applyCanvasSize(state.overlayCanvas, state.overlayContext, width, height, pixelRatio);
    rebuildParticleField();
    drawBase();
    clearOverlay();
    publish({ lastAction: "cosmos-resized" });
    return true;
  }

  function drawBase() {
    const context = state.baseContext;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    context.save();

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

    context.restore();
    state.baseDrawCount += 1;
  }

  function clearOverlay() {
    state.overlayContext?.clearRect(0, 0, state.width, state.height);
  }

  function canRun() {
    return Boolean(
      state.initialized &&
      !state.destroyed &&
      !state.failed &&
      state.documentVisible &&
      state.sceneVisible &&
      !state.reducedMotion &&
      state.overlayContext
    );
  }

  function clearTimers() {
    if (state.burstTimer) clearTimeout(state.burstTimer);
    if (state.frameTimer) clearTimeout(state.frameTimer);
    state.burstTimer = 0;
    state.frameTimer = 0;
  }

  function stopSparkles() {
    clearTimers();
    state.activeSparkles.length = 0;
    clearOverlay();
    if (!state.destroyed) publish({ lastAction: "cosmos-sparkles-stopped" });
    return true;
  }

  function scheduleNextBurst(initial = false) {
    if (!canRun() || state.burstTimer || state.frameTimer || state.activeSparkles.length) {
      return false;
    }

    const random = createRandom(hash32(FIELD_SEED ^ Date.now()));
    const delay = initial
      ? randomBetween(random, CONFIG.firstBurstDelayMinimumMs, CONFIG.firstBurstDelayMaximumMs)
      : randomBetween(random, CONFIG.burstDelayMinimumMs, CONFIG.burstDelayMaximumMs);

    state.burstTimer = globalThis.setTimeout(() => {
      state.burstTimer = 0;
      beginBurst();
    }, delay);

    publish({ lastAction: "cosmos-sparkle-burst-scheduled" });
    return true;
  }

  function beginBurst() {
    if (!canRun() || !state.sparkles.length) return false;

    const random = createRandom(hash32(FIELD_SEED ^ Math.round(performance.now())));
    const available = shuffled(state.sparkles, random);
    const count = random() < 0.24 ? 2 : 1;
    const now = performance.now();

    state.activeSparkles = available.slice(0, count).map(sparkle => ({
      ...sparkle,
      start: now,
      duration: randomBetween(
        random,
        CONFIG.burstDurationMinimumMs,
        CONFIG.burstDurationMaximumMs
      )
    }));

    drawSparkleFrame(now);
    scheduleSparkleFrame();
    publish({ lastAction: "cosmos-sparkle-burst-started" });
    return true;
  }

  function scheduleSparkleFrame() {
    if (!canRun() || state.frameTimer || !state.activeSparkles.length) return;
    state.frameTimer = globalThis.setTimeout(() => {
      state.frameTimer = 0;
      runSparkleFrame();
    }, CONFIG.sparkleFrameIntervalMs);
  }

  function runSparkleFrame() {
    if (!canRun()) {
      stopSparkles();
      return;
    }

    const now = performance.now();
    state.activeSparkles = state.activeSparkles.filter(
      sparkle => now - sparkle.start < sparkle.duration
    );

    drawSparkleFrame(now);

    if (state.activeSparkles.length) scheduleSparkleFrame();
    else {
      clearOverlay();
      scheduleNextBurst(false);
      publish({ lastAction: "cosmos-sparkle-burst-completed" });
    }
  }

  function drawSparkleFrame(timestamp) {
    const context = state.overlayContext;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    context.save();
    context.lineCap = "round";

    for (const sparkle of state.activeSparkles) {
      const star = state.stars[sparkle.starIndex];
      if (!star) continue;

      const progress = clamp((timestamp - sparkle.start) / sparkle.duration, 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      const alpha = sparkle.alpha * Math.pow(pulse, 2.15);
      const reach = sparkle.radius * (1.8 + pulse * 3.2);

      context.strokeStyle = `rgba(${sparkle.color}, ${alpha})`;
      context.lineWidth = 0.74;
      context.beginPath();
      context.moveTo(star.x - reach, star.y);
      context.lineTo(star.x + reach, star.y);
      context.moveTo(star.x, star.y - reach);
      context.lineTo(star.x, star.y + reach);
      context.stroke();

      context.fillStyle = `rgba(${sparkle.color}, ${clamp(alpha * 1.18, 0, 1)})`;
      context.beginPath();
      context.arc(star.x, star.y, sparkle.radius * (0.78 + pulse * 0.34), 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
    state.sparkleFrameCount += 1;
  }

  function setQuality(value) {
    const next = clamp(Number(value), 0.60, 1);
    if (!Number.isFinite(next) || Math.abs(next - state.quality) < 0.02) return false;
    state.quality = next;
    rebuildParticleField();
    drawBase();
    clearOverlay();
    publish({ lastAction: "cosmos-quality-updated" });
    return true;
  }

  function evaluateRunningState() {
    resolveReducedMotion();
    if (canRun()) scheduleNextBurst(true);
    else stopSparkles();
  }

  function bindEnvironment() {
    state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;

    state.onVisibility = () => {
      state.documentVisible = !document.hidden;
      evaluateRunningState();
    };
    document.addEventListener("visibilitychange", state.onVisibility, { passive: true });

    state.onMotion = () => evaluateRunningState();
    if (typeof state.motionQuery?.addEventListener === "function") {
      state.motionQuery.addEventListener("change", state.onMotion);
    } else {
      state.motionQuery?.addListener?.(state.onMotion);
    }

    if (state.root && "MutationObserver" in globalThis) {
      state.motionObserver = new MutationObserver(evaluateRunningState);
      state.motionObserver.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-reduced-motion", "data-laws-reduced-motion"]
      });
    }

    if ("ResizeObserver" in globalThis) {
      state.resizeObserver = new ResizeObserver(resize);
      state.resizeObserver.observe(state.mount);
    } else {
      state.onResize = resize;
      globalThis.addEventListener("resize", state.onResize, { passive: true });
    }

    if ("IntersectionObserver" in globalThis) {
      state.intersectionObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        state.sceneVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0);
        evaluateRunningState();
      }, {
        root: null,
        rootMargin: "0px",
        threshold: 0.01
      });
      state.intersectionObserver.observe(state.scene);
    } else {
      state.sceneVisible = true;
    }

    globalThis.addEventListener("pagehide", destroy, { once: true });
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    clearTimers();
    state.activeSparkles.length = 0;
    clearOverlay();
    state.intersectionObserver?.disconnect();
    state.resizeObserver?.disconnect();
    state.motionObserver?.disconnect();
    if (state.onVisibility) {
      document.removeEventListener("visibilitychange", state.onVisibility);
    }
    if (state.onResize) {
      globalThis.removeEventListener("resize", state.onResize);
    }
    if (typeof state.motionQuery?.removeEventListener === "function") {
      state.motionQuery.removeEventListener("change", state.onMotion);
    } else {
      state.motionQuery?.removeListener?.(state.onMotion);
    }
    state.baseCanvas?.remove();
    state.overlayCanvas?.remove();
    state.stars.length = 0;
    state.sparkles.length = 0;
    publish({ lastAction: "cosmos-destroyed" });
  }

  function initialize() {
    try {
      createCanvases();
      bindEnvironment();
      resolveReducedMotion();
      resize();
      state.initialized = true;
      globalThis[GLOBAL_KEY] = Object.freeze({ ...api, initialized: true });
      publish({ lastAction: "cosmos-initialized" });
      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, {
        detail: globalThis[RECEIPT_KEY]
      }));
      evaluateRunningState();
    } catch (error) {
      fail(error);
    }
  }

  initialize();
})();
