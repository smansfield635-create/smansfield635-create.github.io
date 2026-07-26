/* /laws/index.cosmos.js
   LAWS_COSMOS_ARCHCOIN_RENEWED_FIELD_v6

   Complete Cosmos renewal for the Laws Chamber.

   Authority boundary:
   - decorative background only;
   - no controller, interaction, projection, world-geometry, planet,
     navigation, or law-content ownership;
   - preserves the established Laws Cosmos global API, DOM identities,
     lifecycle events, visibility handling, reduced-motion handling,
     resize behavior, and runtime receipt surface.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_LAWS_COSMOS";
  const RECEIPT_KEY = "DGB_LAWS_COSMOS_RECEIPT";
  const READY_EVENT = "DGB_LAWS_COSMOS_READY";
  const FAILURE_EVENT = "DGB_LAWS_COSMOS_FAILURE";
  const DESTROYED_EVENT = "DGB_LAWS_COSMOS_DESTROYED";

  const IDS = Object.freeze({
    style: "laws-cosmos-runtime-style",
    layer: "laws-cosmos-layer",
    base: "laws-cosmos-canvas",
    sparkle: "laws-cosmos-sparkle-canvas"
  });

  const CONTRACT = Object.freeze({
    id: "LAWS_COSMOS_ARCHCOIN_RENEWED_FIELD_v6",
    sourceModel: "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v2",
    renderingModel: "static-full-chamber-base-plus-burst-overlay",
    geometryModel: "golden-angle-depth-field-with-central-void-and-irregular-masks",
    continuousAnimation: false,
    requestAnimationFrameUsed: false,
    spacecraft: false,
    fullViewportCoverage: true,
    lawsIdentityPreserved: true
  });

  const CONFIG = Object.freeze({
    mobileWidth: 820,
    compactWidth: 560,
    desktopPixelRatioCap: 1.25,
    mobilePixelRatioCap: 1,
    minimumStars: 84,
    maximumStars: 228,
    mobileMaximumStars: 148,
    compactMaximumStars: 112,
    areaPerStar: 6500,
    rogueRatio: 0.14,
    candidateMultiplier: 10,
    horizontalWarp: 1.12,
    verticalWarp: 0.88,
    radialJitter: 0.024,
    angularJitter: 0.078,
    alternatingJitter: 0.019,
    centerVoidRadiusX: 0.205,
    centerVoidRadiusY: 0.185,
    minimumSparkles: 4,
    maximumSparkles: 8,
    firstBurstDelayMinimumMs: 2600,
    firstBurstDelayMaximumMs: 4400,
    burstDelayMinimumMs: 1700,
    burstDelayMaximumMs: 3600,
    burstDurationMinimumMs: 620,
    burstDurationMaximumMs: 980,
    sparkleFrameIntervalMs: 125,
    resizeDebounceMs: 120,
    seed: 0x4c415753
  });

  const VOID_MASKS = Object.freeze([
    Object.freeze({ x: 0.18, y: 0.24, rx: 0.13, ry: 0.085, rotation: -0.42, feather: 0.24 }),
    Object.freeze({ x: 0.81, y: 0.22, rx: 0.10, ry: 0.15, rotation: 0.31, feather: 0.22 }),
    Object.freeze({ x: 0.72, y: 0.76, rx: 0.17, ry: 0.095, rotation: -0.17, feather: 0.25 }),
    Object.freeze({ x: 0.24, y: 0.79, rx: 0.095, ry: 0.14, rotation: 0.49, feather: 0.21 })
  ]);

  const COLORS = Object.freeze([
    "255, 248, 224",
    "174, 226, 242",
    "243, 217, 139",
    "183, 163, 236",
    "255, 183, 139"
  ]);

  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const state = {
    initialized: false,
    destroyed: false,
    failed: false,
    failureReason: "",
    documentVisible: !document.hidden,
    pageActive: true,
    reducedMotion: false,
    quality: 1,
    width: 0,
    height: 0,
    pixelRatio: 1,
    root: null,
    layer: null,
    baseCanvas: null,
    sparkleCanvas: null,
    baseContext: null,
    sparkleContext: null,
    stars: [],
    sparkles: [],
    activeSparkles: [],
    phyllotaxisCount: 0,
    rogueCount: 0,
    baseDrawCount: 0,
    sparkleFrameCount: 0,
    burstTimer: 0,
    frameTimer: 0,
    resizeTimer: 0,
    motionQuery: null,
    mutationObserver: null,
    handlers: Object.create(null)
  };

  const api = {
    initialized: false,
    start: () => scheduleBurst(true),
    stop: stopSparkles,
    destroy,
    resize: reason => resize(reason || "manual"),
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

  function between(random, minimum, maximum) {
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
      contract: CONTRACT.id,
      sourceModel: CONTRACT.sourceModel,
      renderingModel: CONTRACT.renderingModel,
      geometryModel: CONTRACT.geometryModel,
      lawsIdentityPreserved: CONTRACT.lawsIdentityPreserved,
      fullViewportCoverage: CONTRACT.fullViewportCoverage,
      continuousCanvasAnimation: CONTRACT.continuousAnimation,
      requestAnimationFrameUsed: CONTRACT.requestAnimationFrameUsed,
      dualSpacecraftPreserved: CONTRACT.spacecraft,
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      failureReason: state.failureReason,
      documentVisible: state.documentVisible,
      pageActive: state.pageActive,
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
      centerVoidRadiusX: CONFIG.centerVoidRadiusX,
      centerVoidRadiusY: CONFIG.centerVoidRadiusY,
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
      ownsLawContent: false,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;

    if (state.root) {
      state.root.dataset.lawsCosmosStatus = state.failed
        ? "held"
        : state.initialized
          ? "available"
          : "pending";
      state.root.dataset.lawsCosmosRunning = String(canRun());
      state.root.dataset.lawsCosmosModel = receipt.renderingModel;
      state.root.dataset.lawsCosmosContract = receipt.contract;
      state.root.dataset.lawsCosmosSourceModel = receipt.sourceModel;
      state.root.dataset.lawsCosmosReceipt = JSON.stringify(receipt);
    }

    return receipt;
  }

  function installStyle() {
    let style = document.getElementById(IDS.style);
    if (!style) {
      style = document.createElement("style");
      style.id = IDS.style;
      document.head.append(style);
    }

    style.textContent = `
      body > #${IDS.layer} {
        position: fixed;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
        contain: strict;
        isolation: isolate;
        background:
          radial-gradient(ellipse at 50% -8%, rgba(127,147,255,.14), transparent 46%),
          radial-gradient(ellipse at 106% 38%, rgba(124,220,255,.10), transparent 42%),
          radial-gradient(ellipse at 52% 110%, rgba(243,217,139,.085), transparent 46%),
          radial-gradient(ellipse at -8% 58%, rgba(255,157,99,.07), transparent 42%),
          linear-gradient(180deg, rgba(2,4,10,.08), rgba(2,4,10,.28));
      }
      body > #${IDS.layer} canvas {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: screen;
      }
      #${IDS.base} { z-index: 1; opacity: .92; }
      #${IDS.sparkle} { z-index: 2; }
      @media (max-width: 820px) {
        #${IDS.base} { opacity: .84; }
      }
      @media (max-width: 560px) {
        #${IDS.base} { opacity: .76; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${IDS.sparkle} { display: none !important; }
      }
    `;
  }

  function createCanvas(id) {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.setAttribute("aria-hidden", "true");
    return canvas;
  }

  function createSurfaces() {
    state.root = document.querySelector("[data-laws-root]");
    if (!state.root) throw new Error("LAWS_COSMOS_ROOT_NOT_FOUND");

    state.layer = document.getElementById(IDS.layer) || document.createElement("div");
    state.layer.id = IDS.layer;
    state.layer.setAttribute("aria-hidden", "true");

    state.baseCanvas = document.getElementById(IDS.base) || createCanvas(IDS.base);
    state.sparkleCanvas = document.getElementById(IDS.sparkle) || createCanvas(IDS.sparkle);

    if (!state.baseCanvas.isConnected) state.layer.append(state.baseCanvas);
    if (!state.sparkleCanvas.isConnected) state.layer.append(state.sparkleCanvas);
    if (!state.layer.isConnected) document.body.prepend(state.layer);

    state.baseContext = state.baseCanvas.getContext("2d", { alpha: true, desynchronized: true });
    state.sparkleContext = state.sparkleCanvas.getContext("2d", { alpha: true, desynchronized: true });

    if (!state.baseContext || !state.sparkleContext) {
      throw new Error("LAWS_COSMOS_CONTEXT_UNAVAILABLE");
    }
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

  function rejectedByMask(x, y, random, rogue) {
    for (const mask of VOID_MASKS) {
      const distance = maskDistance(x, y, mask);
      if (distance >= 1 + mask.feather) continue;
      if (distance <= 1) {
        if (!rogue || random() < 0.82) return true;
        continue;
      }
      const edgeStrength = 1 - (distance - 1) / mask.feather;
      if (random() < edgeStrength * (rogue ? 0.42 : 0.78)) return true;
    }
    return false;
  }

  function colorFor(random) {
    const roll = random();
    if (roll < 0.68) return COLORS[0];
    if (roll < 0.82) return COLORS[1];
    if (roll < 0.91) return COLORS[2];
    if (roll < 0.97) return COLORS[3];
    return COLORS[4];
  }

  function starRecord(x, y, random, rogue) {
    const depth = Math.pow(random(), 1.5);
    return {
      x: x * state.width,
      y: y * state.height,
      radius: between(random, 0.46, 1.72) * (0.58 + depth * 0.90),
      alpha: between(random, 0.24, 0.88) * (0.66 + depth * 0.42),
      color: colorFor(random),
      depth,
      rogue
    };
  }

  function buildField() {
    const area = state.width * state.height;
    const mobileFactor = state.width <= CONFIG.compactWidth
      ? 0.72
      : state.width <= CONFIG.mobileWidth
        ? 0.86
        : 1;
    const maximum = state.width <= CONFIG.compactWidth
      ? CONFIG.compactMaximumStars
      : state.width <= CONFIG.mobileWidth
        ? CONFIG.mobileMaximumStars
        : CONFIG.maximumStars;
    const targetCount = clamp(
      Math.floor((area / CONFIG.areaPerStar) * state.quality * mobileFactor),
      CONFIG.minimumStars,
      maximum
    );
    const rogueTarget = Math.max(8, Math.round(targetCount * CONFIG.rogueRatio));
    const phyllotaxisTarget = targetCount - rogueTarget;
    const random = createRandom(hash32(
      CONFIG.seed ^
      Math.round(state.width * 7) ^
      (Math.round(state.height * 7) << 1) ^
      Math.round(state.quality * 1000)
    ));
    const stars = [];
    const candidateCount = phyllotaxisTarget * CONFIG.candidateMultiplier;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < candidateCount && stars.length < phyllotaxisTarget; index += 1) {
      const normalized = (index + 1.5) / candidateCount;
      const radius = Math.sqrt(normalized) * 0.72 + between(random, -CONFIG.radialJitter, CONFIG.radialJitter);
      const angle =
        index * goldenAngle +
        between(random, -CONFIG.angularJitter, CONFIG.angularJitter) +
        (index % 2 === 0 ? 1 : -1) * CONFIG.alternatingJitter;
      const x = 0.5 + Math.cos(angle) * radius * CONFIG.horizontalWarp;
      const y = 0.5 + Math.sin(angle) * radius * CONFIG.verticalWarp;

      if (x < 0.012 || x > 0.988 || y < 0.012 || y > 0.988) continue;
      if (inCentralVoid(x, y)) continue;
      if (rejectedByMask(x, y, random, false)) continue;
      stars.push(starRecord(x, y, random, false));
    }

    for (let attempt = 0; attempt < rogueTarget * 32 && stars.length < targetCount; attempt += 1) {
      const x = between(random, 0.012, 0.988);
      const y = between(random, 0.012, 0.988);
      if (inCentralVoid(x, y) && random() < 0.74) continue;
      if (rejectedByMask(x, y, random, true)) continue;
      stars.push(starRecord(x, y, random, true));
    }

    state.stars = stars;
    state.phyllotaxisCount = stars.filter(star => !star.rogue).length;
    state.rogueCount = stars.length - state.phyllotaxisCount;

    const sparkleTarget = clamp(
      Math.floor(CONFIG.maximumSparkles * state.quality * mobileFactor),
      CONFIG.minimumSparkles,
      CONFIG.maximumSparkles
    );
    const eligible = stars
      .map((star, index) => ({ star, index }))
      .filter(({ star }) => star.depth > 0.46 && star.alpha > 0.36);

    state.sparkles = shuffled(eligible, random)
      .slice(0, sparkleTarget)
      .map(({ star, index }) => ({
        starIndex: index,
        radius: clamp(star.radius * between(random, 1.18, 1.60), 1.3, 2.6),
        alpha: between(random, 0.58, 0.94),
        color: star.color
      }));
    state.activeSparkles.length = 0;
  }

  function sizeCanvas(canvas, context) {
    canvas.width = Math.max(1, Math.round(state.width * state.pixelRatio));
    canvas.height = Math.max(1, Math.round(state.height * state.pixelRatio));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    context.imageSmoothingEnabled = true;
  }

  function drawBase() {
    const context = state.baseContext;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    context.save();

    for (const star of state.stars) {
      if (star.depth > 0.58) {
        context.fillStyle = `rgba(${star.color}, ${star.alpha * 0.10})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * (3.0 + star.depth * 2.1), 0, Math.PI * 2);
        context.fill();
      }

      if (star.depth > 0.84) {
        const reach = star.radius * 2.1;
        context.strokeStyle = `rgba(${star.color}, ${star.alpha * 0.30})`;
        context.lineWidth = 0.42;
        context.beginPath();
        context.moveTo(star.x - reach, star.y);
        context.lineTo(star.x + reach, star.y);
        context.moveTo(star.x, star.y - reach);
        context.lineTo(star.x, star.y + reach);
        context.stroke();
      }

      context.fillStyle = `rgba(${star.color}, ${clamp(star.alpha, 0.06, 0.96)})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
    state.baseDrawCount += 1;
  }

  function clearSparkleCanvas() {
    state.sparkleContext?.clearRect(0, 0, state.width, state.height);
  }

  function canRun() {
    return Boolean(
      state.initialized &&
      !state.destroyed &&
      !state.failed &&
      state.documentVisible &&
      state.pageActive &&
      !state.reducedMotion &&
      state.sparkleContext
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
    clearSparkleCanvas();
    if (!state.destroyed) publish({ lastAction: "sparkles-stopped" });
    return true;
  }

  function scheduleBurst(initial = false) {
    if (!canRun() || state.burstTimer || state.frameTimer || state.activeSparkles.length || !state.sparkles.length) {
      return false;
    }

    const random = createRandom(hash32(CONFIG.seed ^ Date.now()));
    const delay = initial
      ? between(random, CONFIG.firstBurstDelayMinimumMs, CONFIG.firstBurstDelayMaximumMs)
      : between(random, CONFIG.burstDelayMinimumMs, CONFIG.burstDelayMaximumMs);

    state.burstTimer = globalThis.setTimeout(() => {
      state.burstTimer = 0;
      beginBurst();
    }, delay);

    return true;
  }

  function beginBurst() {
    if (!canRun()) return false;

    const random = createRandom(hash32(CONFIG.seed ^ Math.round(performance.now())));
    const available = shuffled(state.sparkles, random);
    const count = random() < 0.22 ? 2 : 1;
    const now = performance.now();

    state.activeSparkles = available.slice(0, count).map(sparkle => ({
      ...sparkle,
      start: now,
      duration: between(random, CONFIG.burstDurationMinimumMs, CONFIG.burstDurationMaximumMs)
    }));

    drawSparkleFrame(now);
    scheduleSparkleFrame();
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

    if (state.activeSparkles.length) {
      scheduleSparkleFrame();
    } else {
      clearSparkleCanvas();
      scheduleBurst(false);
    }
  }

  function drawSparkleFrame(timestamp) {
    const context = state.sparkleContext;
    if (!context) return;

    context.clearRect(0, 0, state.width, state.height);
    context.save();
    context.lineCap = "round";

    for (const sparkle of state.activeSparkles) {
      const star = state.stars[sparkle.starIndex];
      if (!star) continue;

      const progress = clamp((timestamp - sparkle.start) / sparkle.duration, 0, 1);
      const pulse = Math.sin(progress * Math.PI);
      const alpha = sparkle.alpha * Math.pow(pulse, 2.1);
      const reach = sparkle.radius * (1.8 + pulse * 3.0);

      context.strokeStyle = `rgba(${sparkle.color}, ${alpha})`;
      context.lineWidth = 0.72;
      context.beginPath();
      context.moveTo(star.x - reach, star.y);
      context.lineTo(star.x + reach, star.y);
      context.moveTo(star.x, star.y - reach);
      context.lineTo(star.x, star.y + reach);
      context.stroke();

      context.fillStyle = `rgba(${sparkle.color}, ${clamp(alpha * 1.12, 0, 1)})`;
      context.beginPath();
      context.arc(star.x, star.y, sparkle.radius * (0.76 + pulse * 0.30), 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
    state.sparkleFrameCount += 1;
  }

  function resize(reason = "resize") {
    if (!state.layer || !state.baseContext || !state.sparkleContext) return false;

    const width = Math.max(1, globalThis.innerWidth || document.documentElement.clientWidth || 1);
    const height = Math.max(1, globalThis.innerHeight || document.documentElement.clientHeight || 1);
    const cap = width <= CONFIG.mobileWidth
      ? CONFIG.mobilePixelRatioCap
      : CONFIG.desktopPixelRatioCap;
    const pixelRatio = clamp(globalThis.devicePixelRatio || 1, 1, cap);

    if (
      width === state.width &&
      height === state.height &&
      pixelRatio === state.pixelRatio &&
      reason !== "initialization" &&
      reason !== "quality"
    ) {
      return false;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    sizeCanvas(state.baseCanvas, state.baseContext);
    sizeCanvas(state.sparkleCanvas, state.sparkleContext);
    buildField();
    drawBase();
    clearSparkleCanvas();
    publish({ lastAction: `field-${reason}` });
    return true;
  }

  function setQuality(value) {
    const next = clamp(Number(value), 0.62, 1);
    if (!Number.isFinite(next) || Math.abs(next - state.quality) < 0.02) return false;
    state.quality = next;
    resize("quality");
    return true;
  }

  function evaluate(reason) {
    state.reducedMotion = Boolean(
      state.motionQuery?.matches ||
      state.root?.dataset?.reducedMotion === "true" ||
      state.root?.dataset?.lawsReducedMotion === "true"
    );

    if (canRun()) scheduleBurst(true);
    else stopSparkles();

    publish({ lastAction: reason });
    return canRun();
  }

  function bindEnvironment() {
    state.motionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)") || null;

    state.handlers.visibility = () => {
      state.documentVisible = !document.hidden;
      evaluate("visibility-change");
    };
    state.handlers.pageHide = () => {
      state.pageActive = false;
      stopSparkles();
    };
    state.handlers.pageShow = () => {
      state.pageActive = true;
      evaluate("page-show");
    };
    state.handlers.resize = () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = globalThis.setTimeout(
        () => resize("resize"),
        CONFIG.resizeDebounceMs
      );
    };
    state.handlers.motion = () => evaluate("motion-change");

    document.addEventListener("visibilitychange", state.handlers.visibility, { passive: true });
    globalThis.addEventListener("pagehide", state.handlers.pageHide, { passive: true });
    globalThis.addEventListener("pageshow", state.handlers.pageShow, { passive: true });
    globalThis.addEventListener("resize", state.handlers.resize, { passive: true });

    if (typeof state.motionQuery?.addEventListener === "function") {
      state.motionQuery.addEventListener("change", state.handlers.motion);
    } else {
      state.motionQuery?.addListener?.(state.handlers.motion);
    }

    if ("MutationObserver" in globalThis) {
      state.mutationObserver = new MutationObserver(() => evaluate("root-motion-change"));
      state.mutationObserver.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-reduced-motion", "data-laws-reduced-motion"]
      });
    }
  }

  function unbindEnvironment() {
    document.removeEventListener("visibilitychange", state.handlers.visibility);
    globalThis.removeEventListener("pagehide", state.handlers.pageHide);
    globalThis.removeEventListener("pageshow", state.handlers.pageShow);
    globalThis.removeEventListener("resize", state.handlers.resize);

    if (typeof state.motionQuery?.removeEventListener === "function") {
      state.motionQuery.removeEventListener("change", state.handlers.motion);
    } else {
      state.motionQuery?.removeListener?.(state.handlers.motion);
    }

    state.mutationObserver?.disconnect();
  }

  function destroy() {
    if (state.destroyed) return true;

    stopSparkles();
    clearTimeout(state.resizeTimer);
    unbindEnvironment();
    state.layer?.remove();
    document.getElementById(IDS.style)?.remove();
    state.stars.length = 0;
    state.sparkles.length = 0;
    state.destroyed = true;
    state.initialized = false;
    api.initialized = false;

    const receipt = publish({ lastAction: "destroyed" });
    globalThis.dispatchEvent(new CustomEvent(DESTROYED_EVENT, { detail: receipt }));
    return true;
  }

  function fail(error) {
    if (state.failed) return;
    state.failed = true;
    state.failureReason = error instanceof Error ? error.message : String(error);
    stopSparkles();
    const receipt = publish({ lastAction: "failure" });
    globalThis.dispatchEvent(new CustomEvent(FAILURE_EVENT, { detail: receipt }));
  }

  function initialize() {
    try {
      installStyle();
      createSurfaces();
      bindEnvironment();
      state.initialized = true;
      api.initialized = true;
      resize("initialization");
      evaluate("initialized");
      const receipt = publish({ lastAction: "ready" });
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
