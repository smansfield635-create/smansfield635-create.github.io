/* /products/archcoin/index.cosmos.js
   ARCHCOIN bounded layered-universe renderer.

   Purpose:
   - replace tiled star repetition with one non-repeating viewport field;
   - preserve three visible depth bands, dust, and restrained sparkle;
   - provide slow parallax without owning page interaction;
   - suspend when hidden and render one static frame under reduced motion;
   - remain independent of ARCHCOIN navigation, geometry, and controller authority.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_ARCHCOIN_COSMOS";
  const RECEIPT_KEY = "DGB_ARCHCOIN_COSMOS_RECEIPT";
  const CANVAS_ATTRIBUTE = "data-archcoin-cosmos-canvas";
  const READY_EVENT = "ARCHCOIN_COSMOS_READY";
  const FAILURE_EVENT = "ARCHCOIN_COSMOS_FAILURE";

  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const CONFIG = Object.freeze({
    frameRate: 24,
    maximumDeltaMs: 100,
    desktopPixelRatioCap: 1.5,
    mobilePixelRatioCap: 1.25,
    mobileWidth: 820,
    minimumStars: 72,
    maximumStars: 180,
    starAreaDivisor: 8200,
    minimumDust: 14,
    maximumDust: 34,
    dustAreaDivisor: 36000,
    minimumSparkles: 6,
    maximumSparkles: 14,
    parallaxMaximumX: 9,
    parallaxMaximumY: 6,
    parallaxEase: 0.045,
    lowPowerConcurrency: 4
  });

  const COLORS = Object.freeze({
    stone: "241, 235, 216",
    blue: "154, 217, 225",
    gold: "234, 208, 131",
    violet: "170, 155, 224",
    dust: "143, 184, 196"
  });

  const state = {
    initialized: false,
    destroyed: false,
    running: false,
    documentVisible: !document.hidden,
    reducedMotion: false,
    root: null,
    host: null,
    canvas: null,
    context: null,
    motionQuery: null,
    motionObserver: null,
    resizeHandle: 0,
    frameHandle: 0,
    width: 0,
    height: 0,
    pixelRatio: 1,
    frameInterval: 1000 / CONFIG.frameRate,
    lastFrameTime: 0,
    accumulatedTime: 0,
    stars: [],
    dust: [],
    sparkles: [],
    pointerTargetX: 0,
    pointerTargetY: 0,
    parallaxX: 0,
    parallaxY: 0,
    seed: 0,
    boundVisibility: null,
    boundResize: null,
    boundPointerMove: null,
    boundPointerLeave: null,
    boundMotionChange: null,
    boundPageHide: null
  };

  const receipt = {
    module: GLOBAL_KEY,
    version: "1.0.0-layered-nonrepeating-universe",
    initialized: false,
    running: false,
    reducedMotion: false,
    documentVisible: state.documentVisible,
    frameRate: CONFIG.frameRate,
    pixelRatio: 1,
    starCount: 0,
    dustCount: 0,
    sparkleCount: 0,
    depthBands: 3,
    tiledBackgroundUsed: false,
    generatedImageAssetUsed: false,
    proceduralCanvasUsed: true,
    externalTextureUsed: false,
    ownsNavigation: false,
    ownsGeometry: false,
    ownsInteraction: false,
    lastAction: "pending",
    lastFailure: ""
  };

  const api = {
    initialized: false,
    start,
    stop,
    resize,
    destroy,
    receipt: () => Object.freeze({ ...receipt })
  };

  globalThis[GLOBAL_KEY] = api;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function random(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function choose(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function publish(lastAction, lastFailure = "") {
    Object.assign(receipt, {
      initialized: state.initialized,
      running: state.running,
      reducedMotion: state.reducedMotion,
      documentVisible: state.documentVisible,
      frameRate: CONFIG.frameRate,
      pixelRatio: state.pixelRatio,
      starCount: state.stars.length,
      dustCount: state.dust.length,
      sparkleCount: state.sparkles.length,
      lastAction,
      lastFailure
    });

    globalThis[RECEIPT_KEY] = Object.freeze({ ...receipt });

    if (state.root) {
      state.root.dataset.archcoinCosmosStatus = lastFailure ? "held" : "ready";
      state.root.dataset.archcoinCosmosRunning = state.running ? "true" : "false";
      state.root.dataset.archcoinCosmosReducedMotion = state.reducedMotion ? "true" : "false";
      state.root.dataset.archcoinCosmosDepthBands = "3";
      state.root.dataset.archcoinCosmosTiledBackground = "false";
    }
  }

  function resolveReducedMotion() {
    return Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset.reducedMotion === "true"
    );
  }

  function createCanvas() {
    state.root = document.querySelector("[data-archcoin-root]");
    state.host = document.querySelector(".archcoin-atmosphere__stars");

    if (!state.root) throw new Error("ARCHCOIN_COSMOS_ROOT_NOT_FOUND");
    if (!state.host) throw new Error("ARCHCOIN_COSMOS_HOST_NOT_FOUND");

    let canvas = state.host.querySelector(`canvas[${CANVAS_ATTRIBUTE}]`);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute(CANVAS_ATTRIBUTE, "true");
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("role", "presentation");
      state.host.append(canvas);
    }

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (!context) throw new Error("ARCHCOIN_COSMOS_2D_CONTEXT_UNAVAILABLE");

    state.canvas = canvas;
    state.context = context;
  }

  function starColor() {
    const roll = Math.random();
    if (roll > 0.985) return COLORS.violet;
    if (roll > 0.94) return COLORS.gold;
    if (roll > 0.80) return COLORS.blue;
    return COLORS.stone;
  }

  function createStar(index, count) {
    const normalized = (index + Math.random()) / Math.max(1, count);
    const depthRoll = Math.pow(Math.random(), 1.55);
    const depthBand = depthRoll < 0.56 ? 0 : depthRoll < 0.86 ? 1 : 2;
    const depth = depthBand === 0
      ? random(0.12, 0.34)
      : depthBand === 1
        ? random(0.40, 0.68)
        : random(0.74, 1);

    const angle = normalized * Math.PI * 2 * 17.0 + random(-0.55, 0.55);
    const radialBias = Math.sqrt(Math.random());
    const centerX = state.width * (0.50 + Math.cos(angle) * 0.08 * radialBias);
    const centerY = state.height * (0.50 + Math.sin(angle) * 0.06 * radialBias);
    const spreadX = state.width * random(-0.54, 0.54);
    const spreadY = state.height * random(-0.54, 0.54);

    return {
      x: clamp(centerX + spreadX, 0, state.width),
      y: clamp(centerY + spreadY, 0, state.height),
      depth,
      depthBand,
      radius: random(0.35, 1.25) * (0.52 + depth * 0.82),
      alpha: random(0.15, 0.66) * (0.62 + depth * 0.48),
      color: starColor(),
      phase: random(0, Math.PI * 2),
      twinkleRate: random(0.00042, 0.00155),
      driftX: random(-0.0017, 0.0017) * (0.22 + depth),
      driftY: random(-0.00115, 0.00115) * (0.22 + depth)
    };
  }

  function createDust() {
    const depth = random(0.08, 0.55);
    return {
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      depth,
      radius: random(0.45, 1.45),
      alpha: random(0.025, 0.10),
      phase: random(0, Math.PI * 2),
      driftX: random(-0.0012, 0.0012),
      driftY: random(-0.0009, 0.0009)
    };
  }

  function createSparkle() {
    return {
      x: random(0.04, 0.96) * state.width,
      y: random(0.05, 0.95) * state.height,
      depth: random(0.68, 1),
      radius: random(0.95, 1.75),
      alpha: random(0.34, 0.70),
      phase: random(0, Math.PI * 2),
      rate: random(0.00075, 0.00185),
      color: choose([COLORS.stone, COLORS.blue, COLORS.gold])
    };
  }

  function rebuildField() {
    const area = state.width * state.height;
    const mobileFactor = state.width <= 560 ? 0.62 : state.width <= 820 ? 0.80 : 1;
    const concurrency = Number(navigator.hardwareConcurrency || 4);
    const powerFactor = concurrency <= CONFIG.lowPowerConcurrency ? 0.72 : 1;
    const quality = mobileFactor * powerFactor;

    const starCount = clamp(
      Math.floor((area / CONFIG.starAreaDivisor) * quality),
      CONFIG.minimumStars,
      CONFIG.maximumStars
    );
    const dustCount = clamp(
      Math.floor((area / CONFIG.dustAreaDivisor) * quality),
      CONFIG.minimumDust,
      CONFIG.maximumDust
    );
    const sparkleCount = clamp(
      Math.floor(CONFIG.maximumSparkles * quality),
      CONFIG.minimumSparkles,
      CONFIG.maximumSparkles
    );

    state.stars = Array.from({ length: starCount }, (_, index) => createStar(index, starCount));
    state.dust = Array.from({ length: dustCount }, createDust);
    state.sparkles = Array.from({ length: sparkleCount }, createSparkle);
  }

  function resize() {
    if (!state.canvas || !state.context || state.destroyed) return false;

    const width = Math.max(1, globalThis.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, globalThis.innerHeight || document.documentElement.clientHeight || 1);
    const cap = width <= CONFIG.mobileWidth
      ? CONFIG.mobilePixelRatioCap
      : CONFIG.desktopPixelRatioCap;
    const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap);

    if (
      width === state.width &&
      height === state.height &&
      pixelRatio === state.pixelRatio
    ) {
      return false;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    state.canvas.width = Math.round(width * pixelRatio);
    state.canvas.height = Math.round(height * pixelRatio);
    state.canvas.style.width = `${width}px`;
    state.canvas.style.height = `${height}px`;
    state.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    state.context.imageSmoothingEnabled = true;

    rebuildField();
    draw(performance.now());
    publish("cosmos-resized");
    return true;
  }

  function wrapParticle(particle, margin = 5) {
    if (particle.x < -margin) particle.x = state.width + margin;
    else if (particle.x > state.width + margin) particle.x = -margin;
    if (particle.y < -margin) particle.y = state.height + margin;
    else if (particle.y > state.height + margin) particle.y = -margin;
  }

  function update(delta) {
    state.parallaxX += (state.pointerTargetX - state.parallaxX) * CONFIG.parallaxEase;
    state.parallaxY += (state.pointerTargetY - state.parallaxY) * CONFIG.parallaxEase;

    for (const star of state.stars) {
      star.x += star.driftX * delta;
      star.y += star.driftY * delta;
      wrapParticle(star, 6);
    }

    for (const particle of state.dust) {
      particle.x += particle.driftX * delta;
      particle.y += particle.driftY * delta;
      wrapParticle(particle, 8);
    }
  }

  function drawDust(context, timestamp) {
    context.save();
    for (const particle of state.dust) {
      const shimmer = state.reducedMotion
        ? 1
        : 0.76 + Math.sin(timestamp * 0.00022 + particle.phase) * 0.24;
      const offsetX = state.parallaxX * particle.depth * 0.55;
      const offsetY = state.parallaxY * particle.depth * 0.55;
      context.fillStyle = `rgba(${COLORS.dust}, ${particle.alpha * shimmer})`;
      context.beginPath();
      context.arc(
        particle.x + offsetX,
        particle.y + offsetY,
        particle.radius,
        0,
        Math.PI * 2
      );
      context.fill();
    }
    context.restore();
  }

  function drawStars(context, timestamp) {
    context.save();
    for (const star of state.stars) {
      const twinkle = state.reducedMotion
        ? 1
        : 0.72 + Math.sin(timestamp * star.twinkleRate + star.phase) * 0.28;
      const alpha = clamp(star.alpha * twinkle, 0.035, 0.90);
      const offsetX = state.parallaxX * star.depth;
      const offsetY = state.parallaxY * star.depth;
      const x = star.x + offsetX;
      const y = star.y + offsetY;

      context.fillStyle = `rgba(${star.color}, ${alpha})`;

      if (star.depthBand === 2 && star.radius > 1.1) {
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(x, y, star.radius, star.radius);
      }
    }
    context.restore();
  }

  function drawSparkles(context, timestamp) {
    if (state.reducedMotion) return;

    context.save();
    context.lineCap = "round";

    for (const sparkle of state.sparkles) {
      const pulse = 0.5 + Math.sin(timestamp * sparkle.rate + sparkle.phase) * 0.5;
      if (pulse < 0.60) continue;

      const alpha = sparkle.alpha * Math.pow(pulse, 2.35);
      const reach = sparkle.radius * (1.8 + pulse * 2.6);
      const x = sparkle.x + state.parallaxX * sparkle.depth;
      const y = sparkle.y + state.parallaxY * sparkle.depth;

      context.strokeStyle = `rgba(${sparkle.color}, ${alpha})`;
      context.lineWidth = 0.65;
      context.beginPath();
      context.moveTo(x - reach, y);
      context.lineTo(x + reach, y);
      context.moveTo(x, y - reach);
      context.lineTo(x, y + reach);
      context.stroke();

      context.fillStyle = `rgba(${sparkle.color}, ${clamp(alpha * 1.15, 0, 1)})`;
      context.beginPath();
      context.arc(x, y, sparkle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  function draw(timestamp) {
    const context = state.context;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    drawDust(context, timestamp);
    drawStars(context, timestamp);
    drawSparkles(context, timestamp);
  }

  function frame(timestamp) {
    state.frameHandle = 0;
    if (!state.running || state.destroyed) return;

    const delta = clamp(timestamp - state.lastFrameTime, 0, CONFIG.maximumDeltaMs);
    state.lastFrameTime = timestamp;
    state.accumulatedTime += delta;

    if (state.accumulatedTime >= state.frameInterval) {
      update(state.accumulatedTime);
      draw(timestamp);
      state.accumulatedTime %= state.frameInterval;
    }

    state.frameHandle = requestAnimationFrame(frame);
  }

  function start() {
    if (
      state.running ||
      state.destroyed ||
      !state.initialized ||
      !state.documentVisible ||
      state.reducedMotion
    ) {
      return false;
    }

    state.running = true;
    state.lastFrameTime = performance.now();
    state.accumulatedTime = 0;
    state.frameHandle = requestAnimationFrame(frame);
    publish("cosmos-animation-started");
    return true;
  }

  function stop(reason = "manual") {
    state.running = false;
    if (state.frameHandle) cancelAnimationFrame(state.frameHandle);
    state.frameHandle = 0;
    draw(performance.now());
    publish(`cosmos-animation-stopped:${reason}`);
  }

  function applyEnvironment(reason) {
    state.documentVisible = !document.hidden;
    state.reducedMotion = resolveReducedMotion();

    if (state.documentVisible && !state.reducedMotion) start();
    else stop(reason);
  }

  function scheduleResize() {
    if (state.resizeHandle || state.destroyed) return;
    state.resizeHandle = requestAnimationFrame(() => {
      state.resizeHandle = 0;
      resize();
    });
  }

  function onPointerMove(event) {
    if (state.reducedMotion || state.width <= 0 || state.height <= 0) return;
    const normalizedX = clamp(event.clientX / state.width - 0.5, -0.5, 0.5);
    const normalizedY = clamp(event.clientY / state.height - 0.5, -0.5, 0.5);
    state.pointerTargetX = normalizedX * CONFIG.parallaxMaximumX * 2;
    state.pointerTargetY = normalizedY * CONFIG.parallaxMaximumY * 2;
  }

  function onPointerLeave() {
    state.pointerTargetX = 0;
    state.pointerTargetY = 0;
  }

  function bindEnvironment() {
    state.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    state.reducedMotion = resolveReducedMotion();

    state.boundVisibility = () => applyEnvironment("visibility");
    state.boundResize = scheduleResize;
    state.boundPointerMove = onPointerMove;
    state.boundPointerLeave = onPointerLeave;
    state.boundMotionChange = () => applyEnvironment("motion-preference");
    state.boundPageHide = destroy;

    document.addEventListener("visibilitychange", state.boundVisibility);
    globalThis.addEventListener("resize", state.boundResize, { passive: true });
    globalThis.addEventListener("pointermove", state.boundPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", state.boundPointerLeave, { passive: true });
    globalThis.addEventListener("pagehide", state.boundPageHide, { once: true });

    if (typeof state.motionQuery.addEventListener === "function") {
      state.motionQuery.addEventListener("change", state.boundMotionChange);
    } else {
      state.motionQuery.addListener?.(state.boundMotionChange);
    }

    state.motionObserver = new MutationObserver(() => applyEnvironment("root-motion-state"));
    state.motionObserver.observe(state.root, {
      attributes: true,
      attributeFilter: ["data-reduced-motion"]
    });
  }

  function destroy() {
    if (state.destroyed) return;
    state.destroyed = true;
    state.running = false;

    if (state.frameHandle) cancelAnimationFrame(state.frameHandle);
    if (state.resizeHandle) cancelAnimationFrame(state.resizeHandle);
    state.frameHandle = 0;
    state.resizeHandle = 0;

    document.removeEventListener("visibilitychange", state.boundVisibility);
    globalThis.removeEventListener("resize", state.boundResize);
    globalThis.removeEventListener("pointermove", state.boundPointerMove);
    document.documentElement.removeEventListener("pointerleave", state.boundPointerLeave);
    globalThis.removeEventListener("pagehide", state.boundPageHide);

    if (typeof state.motionQuery?.removeEventListener === "function") {
      state.motionQuery.removeEventListener("change", state.boundMotionChange);
    } else {
      state.motionQuery?.removeListener?.(state.boundMotionChange);
    }

    state.motionObserver?.disconnect();
    state.canvas?.remove();
    state.stars.length = 0;
    state.dust.length = 0;
    state.sparkles.length = 0;
    publish("cosmos-destroyed");
  }

  function initialize() {
    try {
      createCanvas();
      bindEnvironment();
      resize();
      state.initialized = true;
      api.initialized = true;
      state.root.dataset.archcoinCosmosReady = "true";
      applyEnvironment("initialized");
      publish("cosmos-initialized");

      globalThis.dispatchEvent(new CustomEvent(READY_EVENT, {
        detail: Object.freeze({ ...receipt })
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      publish("cosmos-initialization-failed", message);
      globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, {
        detail: Object.freeze({ message })
      }));
    }
  }

  initialize();
})();
