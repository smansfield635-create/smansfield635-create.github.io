/* /products/archcoin/index.starfield.js
   ARCHCOIN bounded starfield adapter derived from the proven Compass cosmos.

   Preserves:
   - randomized non-grid star placement;
   - depth-weighted size, brightness, drift, and twinkle;
   - independent sparkle phases;
   - capped DPR and 30 FPS pacing;
   - adaptive quality;
   - reduced-motion and visibility suspension.

   Excludes:
   - meteors;
   - spacecraft;
   - navigation, geometry, controller, compositor, and interaction authority.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_ARCHCOIN_STARFIELD";
  const RECEIPT_KEY = "DGB_ARCHCOIN_STARFIELD_RECEIPT";
  const READY_EVENT = "ARCHCOIN_STARFIELD_READY";
  const FAILURE_EVENT = "ARCHCOIN_STARFIELD_FAILURE";
  const CANVAS_ATTRIBUTE = "data-archcoin-starfield-canvas";

  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const CONFIG = Object.freeze({
    mountSelector: ".archcoin-field-chrome__stars",
    sceneSelector: "[data-archcoin-scene-field]",
    rootSelector: "[data-archcoin-root]",
    frameRate: 30,
    maximumDeltaMs: 80,
    desktopPixelRatioCap: 1.5,
    mobilePixelRatioCap: 1.25,
    mobileWidth: 820,
    compactWidth: 560,
    minimumStars: 54,
    maximumStars: 128,
    starAreaDivisor: 5600,
    minimumSparkles: 5,
    maximumSparkles: 10,
    adaptiveCheckIntervalMs: 5000,
    adaptiveSlowRenderMs: 5.5,
    adaptiveFastRenderMs: 2.2,
    adaptiveMinimumQuality: 0.55,
    adaptiveMaximumQuality: 1,
    adaptiveStepDown: 0.12,
    adaptiveStepUp: 0.05
  });

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
    running: false,
    documentVisible: !document.hidden,
    sceneVisible: false,
    reducedMotion: false,
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    context: null,
    width: 0,
    height: 0,
    pixelRatio: 1,
    quality: 1,
    stars: [],
    sparkles: [],
    clusters: [],
    frameHandle: 0,
    lastFrameTime: 0,
    accumulatedFrameTime: 0,
    lastAdaptiveCheck: 0,
    renderCostSamples: [],
    intersectionObserver: null,
    resizeObserver: null,
    motionQuery: null,
    motionObserver: null,
    listenersBound: false
  };

  const api = Object.freeze({
    initialized: false,
    start,
    stop,
    destroy,
    resize,
    setQuality,
    receipt: () => Object.freeze(buildReceipt())
  });

  globalThis[GLOBAL_KEY] = api;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function random(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function gaussian() {
    const u = Math.max(Number.EPSILON, Math.random());
    const v = Math.max(Number.EPSILON, Math.random());
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function buildReceipt(extra = {}) {
    return {
      module: "DGB_ARCHCOIN_STARFIELD",
      sourceModel: "/assets/compass/compass.cosmos.js",
      initialized: state.initialized,
      running: state.running,
      destroyed: state.destroyed,
      failed: state.failed,
      documentVisible: state.documentVisible,
      sceneVisible: state.sceneVisible,
      reducedMotion: state.reducedMotion,
      starCount: state.stars.length,
      sparkleCount: state.sparkles.length,
      quality: state.quality,
      pixelRatio: state.pixelRatio,
      frameRateCap: CONFIG.frameRate,
      ownsNavigation: false,
      ownsGeometry: false,
      ownsProjection: false,
      ownsInteraction: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    if (state.root) {
      state.root.dataset.archcoinStarfieldStatus = state.failed
        ? "held"
        : state.initialized
          ? "available"
          : "pending";
      state.root.dataset.archcoinStarfieldReceipt = JSON.stringify(receipt);
    }
    return receipt;
  }

  function fail(error) {
    if (state.failed) return;
    state.failed = true;
    stop();
    const message = error instanceof Error ? error.message : String(error);
    publish({ lastAction: "starfield-failure", lastFailure: message });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, {
      detail: Object.freeze({ message })
    }));
  }

  function resolveReducedMotion() {
    state.reducedMotion = Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset?.reducedMotion === "true"
    );
    return state.reducedMotion;
  }

  function createCanvas() {
    state.mount = document.querySelector(CONFIG.mountSelector);
    state.scene = document.querySelector(CONFIG.sceneSelector);
    state.root = document.querySelector(CONFIG.rootSelector);

    if (!state.mount || !state.scene) {
      throw new Error("ARCHCOIN_STARFIELD_MOUNT_NOT_FOUND");
    }

    const existing = state.mount.querySelector(`[${CANVAS_ATTRIBUTE}]`);
    const canvas = existing || document.createElement("canvas");
    canvas.setAttribute(CANVAS_ATTRIBUTE, "true");
    canvas.setAttribute("aria-hidden", "true");

    if (!existing) state.mount.append(canvas);

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (!context) {
      throw new Error("ARCHCOIN_STARFIELD_CONTEXT_UNAVAILABLE");
    }

    state.canvas = canvas;
    state.context = context;
  }

  function createClusterField() {
    const zones = [
      { x: [0.05, 0.28], y: [0.06, 0.34], sx: [0.07, 0.15], sy: [0.08, 0.17] },
      { x: [0.69, 0.95], y: [0.05, 0.37], sx: [0.07, 0.16], sy: [0.08, 0.18] },
      { x: [0.03, 0.34], y: [0.63, 0.96], sx: [0.08, 0.17], sy: [0.08, 0.17] },
      { x: [0.66, 0.96], y: [0.61, 0.96], sx: [0.08, 0.17], sy: [0.08, 0.17] }
    ];

    state.clusters = zones.map(zone => ({
      x: random(zone.x[0], zone.x[1]),
      y: random(zone.y[0], zone.y[1]),
      spreadX: random(zone.sx[0], zone.sx[1]),
      spreadY: random(zone.sy[0], zone.sy[1])
    }));
  }

  function inCentralVoid(x, y) {
    const dx = (x - 0.5) / 0.22;
    const dy = (y - 0.5) / 0.20;
    return dx * dx + dy * dy < 1;
  }

  function choosePosition() {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      let x;
      let y;

      if (Math.random() < 0.72) {
        const cluster = randomChoice(state.clusters);
        x = cluster.x + gaussian() * cluster.spreadX;
        y = cluster.y + gaussian() * cluster.spreadY;
      } else {
        x = Math.random();
        y = Math.random();
      }

      x = clamp(x, 0.015, 0.985);
      y = clamp(y, 0.015, 0.985);

      if (inCentralVoid(x, y) && Math.random() < 0.88) continue;
      return { x, y };
    }

    return { x: Math.random(), y: Math.random() };
  }

  function createStar() {
    const position = choosePosition();
    const depth = Math.pow(Math.random(), 1.65);
    const colorRoll = Math.random();
    const color = colorRoll < 0.80
      ? COLORS[0]
      : colorRoll < 0.91
        ? COLORS[1]
        : colorRoll < 0.975
          ? COLORS[2]
          : COLORS[3];

    return {
      x: position.x * state.width,
      y: position.y * state.height,
      radius: random(0.42, 1.55) * (0.58 + depth * 0.74),
      alpha: random(0.19, 0.72) * (0.62 + depth * 0.48),
      color,
      depth,
      phase: random(0, Math.PI * 2),
      twinkleRate: random(0.00050, 0.00165),
      driftX: random(-0.0022, 0.0022) * (0.28 + depth),
      driftY: random(-0.0016, 0.0016) * (0.28 + depth)
    };
  }

  function createSparkles(count) {
    const candidates = state.stars
      .map((star, index) => ({ star, index }))
      .filter(({ star }) => star.depth > 0.46 && star.alpha > 0.34)
      .sort(() => Math.random() - 0.5);

    return candidates.slice(0, count).map(({ index, star }) => ({
      starIndex: index,
      radius: clamp(star.radius * random(1.0, 1.45), 1.15, 2.35),
      alpha: random(0.46, 0.86),
      phase: random(0, Math.PI * 2),
      rate: random(0.00085, 0.0022),
      color: star.color
    }));
  }

  function rebuildParticleField() {
    if (!state.width || !state.height) return;

    const area = state.width * state.height;
    const mobileFactor = state.width <= CONFIG.compactWidth
      ? 0.64
      : state.width <= CONFIG.mobileWidth
        ? 0.80
        : 1;
    const density = state.quality * mobileFactor;

    const starCount = clamp(
      Math.floor((area / CONFIG.starAreaDivisor) * density),
      CONFIG.minimumStars,
      CONFIG.maximumStars
    );
    const sparkleCount = clamp(
      Math.floor(CONFIG.maximumSparkles * density),
      CONFIG.minimumSparkles,
      CONFIG.maximumSparkles
    );

    createClusterField();
    state.stars = Array.from({ length: starCount }, createStar);
    state.sparkles = createSparkles(sparkleCount);
  }

  function resize() {
    if (!state.canvas || !state.context || !state.mount) return;

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
    ) return;

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    state.canvas.width = Math.round(width * pixelRatio);
    state.canvas.height = Math.round(height * pixelRatio);
    state.canvas.style.width = `${width}px`;
    state.canvas.style.height = `${height}px`;
    state.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    state.context.imageSmoothingEnabled = true;
    rebuildParticleField();
    drawStaticFrame();
    publish({ lastAction: "starfield-resized" });
  }

  function update(delta) {
    for (const star of state.stars) {
      star.x += star.driftX * delta;
      star.y += star.driftY * delta;

      if (star.x < -4) star.x = state.width + 4;
      else if (star.x > state.width + 4) star.x = -4;

      if (star.y < -4) star.y = state.height + 4;
      else if (star.y > state.height + 4) star.y = -4;
    }
  }

  function drawStars(context, timestamp) {
    context.save();

    for (const star of state.stars) {
      const twinkle = state.reducedMotion
        ? 1
        : 0.72 + Math.sin(timestamp * star.twinkleRate + star.phase) * 0.28;
      const alpha = clamp(star.alpha * twinkle, 0.035, 0.96);

      if (star.depth > 0.72) {
        context.fillStyle = `rgba(${star.color}, ${alpha * 0.13})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = `rgba(${star.color}, ${alpha})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  function drawSparkles(context, timestamp) {
    if (state.reducedMotion) return;

    context.save();
    context.lineCap = "round";

    for (const sparkle of state.sparkles) {
      const star = state.stars[sparkle.starIndex];
      if (!star) continue;

      const pulse = 0.5 + Math.sin(timestamp * sparkle.rate + sparkle.phase) * 0.5;
      if (pulse < 0.62) continue;

      const alpha = sparkle.alpha * Math.pow(pulse, 2.4);
      const reach = sparkle.radius * (2 + pulse * 2.8);

      context.strokeStyle = `rgba(${sparkle.color}, ${alpha})`;
      context.lineWidth = 0.72;
      context.beginPath();
      context.moveTo(star.x - reach, star.y);
      context.lineTo(star.x + reach, star.y);
      context.moveTo(star.x, star.y - reach);
      context.lineTo(star.x, star.y + reach);
      context.stroke();

      context.fillStyle = `rgba(${sparkle.color}, ${clamp(alpha * 1.16, 0, 1)})`;
      context.beginPath();
      context.arc(star.x, star.y, sparkle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  function draw(timestamp) {
    const context = state.context;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    drawStars(context, timestamp);
    drawSparkles(context, timestamp);
  }

  function drawStaticFrame() {
    draw(performance.now());
  }

  function frame(timestamp) {
    if (!state.running || state.destroyed || state.failed) return;

    const delta = clamp(timestamp - state.lastFrameTime, 0, CONFIG.maximumDeltaMs);
    state.lastFrameTime = timestamp;
    state.accumulatedFrameTime += delta;
    const targetFrameDuration = 1000 / CONFIG.frameRate;

    if (state.accumulatedFrameTime >= targetFrameDuration) {
      const renderStart = performance.now();
      update(state.accumulatedFrameTime);
      draw(timestamp);
      registerRenderCost(performance.now() - renderStart, timestamp);
      state.accumulatedFrameTime %= targetFrameDuration;
    }

    state.frameHandle = requestAnimationFrame(frame);
  }

  function registerRenderCost(renderCost, timestamp) {
    state.renderCostSamples.push(renderCost);
    if (state.renderCostSamples.length > 90) state.renderCostSamples.shift();
    if (timestamp - state.lastAdaptiveCheck < CONFIG.adaptiveCheckIntervalMs) return;

    state.lastAdaptiveCheck = timestamp;
    if (!state.renderCostSamples.length) return;

    const average = state.renderCostSamples.reduce((sum, value) => sum + value, 0) /
      state.renderCostSamples.length;
    state.renderCostSamples.length = 0;

    if (average > CONFIG.adaptiveSlowRenderMs) {
      setQuality(state.quality - CONFIG.adaptiveStepDown);
    } else if (average < CONFIG.adaptiveFastRenderMs) {
      setQuality(state.quality + CONFIG.adaptiveStepUp);
    }
  }

  function setQuality(value) {
    const next = clamp(
      Number.isFinite(Number(value)) ? Number(value) : CONFIG.adaptiveMinimumQuality,
      CONFIG.adaptiveMinimumQuality,
      CONFIG.adaptiveMaximumQuality
    );

    if (Math.abs(next - state.quality) < 0.02) return false;
    state.quality = next;
    rebuildParticleField();
    drawStaticFrame();
    publish({ lastAction: "starfield-quality-updated" });
    return true;
  }

  function canRun() {
    return Boolean(
      state.initialized &&
      !state.destroyed &&
      !state.failed &&
      state.documentVisible &&
      state.sceneVisible &&
      !state.reducedMotion &&
      state.context
    );
  }

  function start() {
    if (state.running || !canRun()) return false;
    state.running = true;
    state.lastFrameTime = performance.now();
    state.accumulatedFrameTime = 0;
    state.frameHandle = requestAnimationFrame(frame);
    publish({ lastAction: "starfield-started" });
    return true;
  }

  function stop() {
    state.running = false;
    if (state.frameHandle) cancelAnimationFrame(state.frameHandle);
    state.frameHandle = 0;
    publish({ lastAction: "starfield-stopped" });
  }

  function evaluateRunningState() {
    resolveReducedMotion();
    if (canRun()) start();
    else {
      stop();
      drawStaticFrame();
    }
  }

  function bindEnvironment() {
    state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;

    const onVisibility = () => {
      state.documentVisible = !document.hidden;
      evaluateRunningState();
    };
    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    const onMotion = () => evaluateRunningState();
    state.motionQuery?.addEventListener?.("change", onMotion);

    if (state.root && "MutationObserver" in globalThis) {
      state.motionObserver = new MutationObserver(evaluateRunningState);
      state.motionObserver.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-reduced-motion"]
      });
    }

    if ("ResizeObserver" in globalThis) {
      state.resizeObserver = new ResizeObserver(resize);
      state.resizeObserver.observe(state.mount);
    } else {
      globalThis.addEventListener("resize", resize, { passive: true });
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
    state.listenersBound = true;
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    stop();
    state.intersectionObserver?.disconnect();
    state.resizeObserver?.disconnect();
    state.motionObserver?.disconnect();
    state.canvas?.remove();
    state.stars.length = 0;
    state.sparkles.length = 0;
    publish({ lastAction: "starfield-destroyed" });
  }

  function initialize() {
    try {
      createCanvas();
      bindEnvironment();
      resolveReducedMotion();
      resize();
      state.initialized = true;
      globalThis[GLOBAL_KEY] = Object.freeze({ ...api, initialized: true });
      publish({ lastAction: "starfield-initialized" });
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
