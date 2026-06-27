/* /assets/compass/compass.cosmos.js
   DGB Compass — Autonomous cosmic atmosphere and randomized spacecraft engine.

   Scope:
   - Compass page only.
   - Creates one inert fixed canvas for stars, sparkles, dust, and rare meteors.
   - Creates one detailed SVG spacecraft with randomized cubic Bézier flights.
   - Keeps all generated surfaces behind the estate interface.
   - Uses adaptive particle density and capped device-pixel ratio.
   - Pauses when the page or browser tab is not visible.
   - Respects prefers-reduced-motion.
   - Requires no additional HTML or CSS file.

   Protected:
   - No Compass controller changes.
   - No route changes.
   - No Mirrorland changes.
   - No crystal-renderer changes.
   - No panel or semantic-control changes.
*/

(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_COMPASS_COSMOS";
  const STYLE_ID = "dgb-compass-cosmos-runtime-style";
  const LAYER_ID = "dgb-compass-cosmos-layer";
  const CANVAS_ID = "dgb-compass-cosmos-canvas";
  const SPACECRAFT_ID = "dgb-compass-cosmos-spacecraft";

  if (window[GLOBAL_KEY]?.initialized) {
    return;
  }

  const CONFIG = Object.freeze({
    selector: ".compass-estate",

    frameRate: 30,
    maximumDeltaMs: 80,

    pixelRatioMaximum: 1.5,
    pixelRatioMobileMaximum: 1.25,

    minimumStars: 90,
    maximumStars: 260,
    starAreaDivisor: 7600,

    minimumDust: 18,
    maximumDust: 58,
    dustAreaDivisor: 32000,

    minimumSparkles: 8,
    maximumSparkles: 22,

    maximumMeteors: 2,
    meteorSpawnMinimumMs: 9000,
    meteorSpawnMaximumMs: 24000,

    spacecraftInitialDelayMinimumMs: 5000,
    spacecraftInitialDelayMaximumMs: 12000,
    spacecraftDelayMinimumMs: 18000,
    spacecraftDelayMaximumMs: 52000,
    spacecraftDurationMinimumMs: 9000,
    spacecraftDurationMaximumMs: 17000,
    spacecraftCandidateCount: 14,

    adaptiveCheckIntervalMs: 5000,
    adaptiveSlowRenderMs: 7.5,
    adaptiveFastRenderMs: 3.0,
    adaptiveMinimumQuality: 0.48,
    adaptiveMaximumQuality: 1,
    adaptiveStepDown: 0.12,
    adaptiveStepUp: 0.05,

    protectedSelectors: [
      ".compass-estate__header",
      ".compass-estate__sentence",
      ".compass-value-card",
      ".compass-introduction",
      ".compass-orbit-intro",
      ".compass-formula-artifact",
      ".compass-discovery__item",
      ".compass-scene",
      ".compass-panel",
      ".compass-closing"
    ]
  });

  const COLORS = Object.freeze({
    stone: "255, 248, 224",
    blue: "124, 220, 255",
    gold: "243, 217, 139",
    violet: "159, 137, 255",
    dust: "188, 213, 226"
  });

  const state = {
    initialized: false,
    destroyed: false,
    running: false,
    documentVisible: !document.hidden,
    estateVisible: true,
    reducedMotion: false,

    estate: null,
    layer: null,
    canvas: null,
    context: null,
    spacecraft: null,

    width: 0,
    height: 0,
    pixelRatio: 1,

    stars: [],
    dust: [],
    sparkles: [],
    meteors: [],

    quality: 1,
    renderCostSamples: [],
    lastAdaptiveCheck: 0,

    frameHandle: 0,
    lastFrameTime: 0,
    accumulatedFrameTime: 0,

    nextMeteorTime: 0,

    spacecraftFlight: null,
    spacecraftTimer: 0,
    lastSpacecraftPath: null,

    resizeObserver: null,
    intersectionObserver: null,
    motionQuery: null,

    boundResize: null,
    boundVisibility: null,
    boundMotionChange: null
  };

  const api = {
    initialized: false,
    start,
    stop,
    destroy,
    resize,
    launchSpacecraft,
    setQuality
  };

  window[GLOBAL_KEY] = api;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function random(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function randomInteger(minimum, maximum) {
    return Math.floor(random(minimum, maximum + 1));
  }

  function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function createRuntimeStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${LAYER_ID} {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
        user-select: none;
        contain: strict;
        isolation: isolate;
      }

      #${CANVAS_ID} {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.92;
      }

      #${SPACECRAFT_ID} {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        display: block;
        width: 168px;
        height: 68px;
        overflow: visible;
        pointer-events: none;
        opacity: 0;
        transform:
          translate3d(-260px, -160px, 0)
          rotate(0deg)
          scale(0.8);
        transform-origin: 50% 50%;
        will-change: transform, opacity;
        filter:
          drop-shadow(0 0 6px rgba(124, 220, 255, 0.24))
          drop-shadow(0 0 14px rgba(243, 217, 139, 0.10));
      }

      #${SPACECRAFT_ID}[data-flying="true"] {
        opacity: 1;
      }

      #${SPACECRAFT_ID} .dgb-spacecraft-engine-core {
        animation: dgb-spacecraft-engine-pulse 1.35s ease-in-out infinite alternate;
        transform-origin: center;
      }

      #${SPACECRAFT_ID} .dgb-spacecraft-running-light {
        animation: dgb-spacecraft-light-pulse 2.1s ease-in-out infinite alternate;
      }

      #${SPACECRAFT_ID} .dgb-spacecraft-running-light--secondary {
        animation-delay: -1.05s;
      }

      @keyframes dgb-spacecraft-engine-pulse {
        0% {
          opacity: 0.58;
          transform: scaleX(0.78);
        }

        100% {
          opacity: 1;
          transform: scaleX(1.08);
        }
      }

      @keyframes dgb-spacecraft-light-pulse {
        0% {
          opacity: 0.42;
        }

        100% {
          opacity: 1;
        }
      }

      @media (max-width: 820px) {
        #${CANVAS_ID} {
          opacity: 0.82;
        }

        #${SPACECRAFT_ID} {
          width: 138px;
          height: 56px;
        }
      }

      @media (max-width: 560px) {
        #${CANVAS_ID} {
          opacity: 0.72;
        }

        #${SPACECRAFT_ID} {
          width: 112px;
          height: 46px;
          filter:
            drop-shadow(0 0 4px rgba(124, 220, 255, 0.20))
            drop-shadow(0 0 9px rgba(243, 217, 139, 0.08));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${SPACECRAFT_ID} {
          display: none !important;
          animation: none !important;
        }

        #${SPACECRAFT_ID} * {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createLayer() {
    const existing = document.getElementById(LAYER_ID);

    if (existing) {
      state.layer = existing;
      state.canvas = existing.querySelector(`#${CANVAS_ID}`);
      state.spacecraft = existing.querySelector(`#${SPACECRAFT_ID}`);
      state.context = state.canvas?.getContext("2d", {
        alpha: true,
        desynchronized: false
      }) || null;
      return;
    }

    const layer = document.createElement("div");
    layer.id = LAYER_ID;
    layer.setAttribute("aria-hidden", "true");
    layer.setAttribute("data-compass-cosmos-runtime", "true");

    const canvas = document.createElement("canvas");
    canvas.id = CANVAS_ID;
    canvas.setAttribute("aria-hidden", "true");

    const spacecraft = createSpacecraft();

    layer.append(canvas, spacecraft);
    document.body.prepend(layer);

    state.layer = layer;
    state.canvas = canvas;
    state.spacecraft = spacecraft;
    state.context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: false
    });
  }

  function createSpacecraft() {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");

    svg.id = SPACECRAFT_ID;
    svg.setAttribute("viewBox", "0 0 240 96");
    svg.setAttribute("role", "presentation");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("data-flying", "false");

    svg.innerHTML = `
      <defs>
        <linearGradient id="dgb-spacecraft-hull-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7e8b1"/>
          <stop offset="22%" stop-color="#9ab7c2"/>
          <stop offset="52%" stop-color="#263745"/>
          <stop offset="78%" stop-color="#111923"/>
          <stop offset="100%" stop-color="#060a10"/>
        </linearGradient>

        <linearGradient id="dgb-spacecraft-wing-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#111a25"/>
          <stop offset="48%" stop-color="#385267"/>
          <stop offset="100%" stop-color="#090e15"/>
        </linearGradient>

        <linearGradient id="dgb-spacecraft-canopy-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d9f8ff" stop-opacity="0.96"/>
          <stop offset="34%" stop-color="#7cdcff" stop-opacity="0.78"/>
          <stop offset="74%" stop-color="#26375d" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#090d18"/>
        </linearGradient>

        <linearGradient id="dgb-spacecraft-engine-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#7cdcff" stop-opacity="0"/>
          <stop offset="40%" stop-color="#7cdcff" stop-opacity="0.58"/>
          <stop offset="78%" stop-color="#f3d98b" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>

        <radialGradient id="dgb-spacecraft-light-gradient">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="38%" stop-color="#f3d98b"/>
          <stop offset="100%" stop-color="#d8b86a" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <g>
        <path
          class="dgb-spacecraft-engine-core"
          d="M41 42 L4 48 L41 54 Z"
          fill="url(#dgb-spacecraft-engine-gradient)"
          opacity="0.88"
        />

        <path
          d="M49 34 L17 25 L37 46 L17 69 L55 58 Z"
          fill="url(#dgb-spacecraft-wing-gradient)"
          stroke="rgba(124,220,255,0.48)"
          stroke-width="1.2"
        />

        <path
          d="M52 36 L31 14 L76 34 Z"
          fill="#162533"
          stroke="rgba(243,217,139,0.42)"
          stroke-width="1.1"
        />

        <path
          d="M52 58 L31 82 L79 60 Z"
          fill="#101d29"
          stroke="rgba(124,220,255,0.34)"
          stroke-width="1.1"
        />

        <path
          d="M43 40
             C69 26, 112 21, 163 29
             C189 33, 211 42, 231 48
             C211 54, 188 63, 160 68
             C112 75, 70 68, 43 56
             Z"
          fill="url(#dgb-spacecraft-hull-gradient)"
          stroke="rgba(243,217,139,0.68)"
          stroke-width="1.35"
        />

        <path
          d="M102 31
             C117 18, 147 17, 166 31
             L173 43
             L101 43
             Z"
          fill="url(#dgb-spacecraft-canopy-gradient)"
          stroke="rgba(124,220,255,0.72)"
          stroke-width="1.2"
        />

        <path
          d="M99 48 L219 48"
          fill="none"
          stroke="rgba(124,220,255,0.38)"
          stroke-width="1"
        />

        <path
          d="M67 43 L91 35 L92 60 L68 54 Z"
          fill="rgba(7,12,18,0.78)"
          stroke="rgba(243,217,139,0.46)"
          stroke-width="1"
        />

        <path
          d="M116 60
             C138 65, 167 61, 194 53"
          fill="none"
          stroke="rgba(243,217,139,0.32)"
          stroke-width="1.1"
        />

        <path
          d="M164 29 L185 18 L180 37 Z"
          fill="#162432"
          stroke="rgba(124,220,255,0.40)"
          stroke-width="1"
        />

        <ellipse
          cx="49"
          cy="48"
          rx="9"
          ry="13"
          fill="#060b11"
          stroke="rgba(124,220,255,0.58)"
          stroke-width="1.3"
        />

        <ellipse
          cx="49"
          cy="48"
          rx="4.2"
          ry="7.2"
          fill="#7cdcff"
          opacity="0.84"
        />

        <circle
          class="dgb-spacecraft-running-light"
          cx="204"
          cy="44"
          r="7"
          fill="url(#dgb-spacecraft-light-gradient)"
        />

        <circle
          class="dgb-spacecraft-running-light dgb-spacecraft-running-light--secondary"
          cx="84"
          cy="59"
          r="4.6"
          fill="url(#dgb-spacecraft-light-gradient)"
          opacity="0.72"
        />

        <circle
          cx="184"
          cy="56"
          r="2.1"
          fill="#7cdcff"
          opacity="0.88"
        />

        <circle
          cx="155"
          cy="63"
          r="1.8"
          fill="#f3d98b"
          opacity="0.82"
        />

        <path
          d="M111 37 L157 37"
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          stroke-width="0.8"
        />

        <path
          d="M59 40 C89 29, 132 26, 170 32"
          fill="none"
          stroke="rgba(255,248,224,0.35)"
          stroke-width="1"
        />
      </g>
    `;

    return svg;
  }

  function initialize() {
    if (state.initialized || state.destroyed) {
      return;
    }

    const estate = document.querySelector(CONFIG.selector);

    if (!estate) {
      return;
    }

    state.estate = estate;
    state.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reducedMotion = state.motionQuery.matches;

    createRuntimeStyle();
    createLayer();
    installObservers();
    resize();

    state.initialized = true;
    api.initialized = true;

    state.nextMeteorTime =
      performance.now() +
      random(
        CONFIG.meteorSpawnMinimumMs,
        CONFIG.meteorSpawnMaximumMs
      );

    scheduleNextSpacecraftFlight(true);
    evaluateRunningState();
  }

  function installObservers() {
    state.boundResize = () => resize();
    state.boundVisibility = () => {
      state.documentVisible = !document.hidden;
      evaluateRunningState();
    };

    state.boundMotionChange = (event) => {
      state.reducedMotion = event.matches;

      if (state.reducedMotion) {
        cancelSpacecraftFlight();
        state.meteors.length = 0;
      } else {
        scheduleNextSpacecraftFlight(true);
      }

      evaluateRunningState();
      drawStaticFrame();
    };

    window.addEventListener("resize", state.boundResize, { passive: true });
    document.addEventListener("visibilitychange", state.boundVisibility);

    if (typeof state.motionQuery.addEventListener === "function") {
      state.motionQuery.addEventListener("change", state.boundMotionChange);
    } else {
      state.motionQuery.addListener(state.boundMotionChange);
    }

    if ("ResizeObserver" in window) {
      state.resizeObserver = new ResizeObserver(() => resize());
      state.resizeObserver.observe(document.documentElement);
    }

    if ("IntersectionObserver" in window) {
      state.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          state.estateVisible =
            Boolean(entry?.isIntersecting) ||
            entry?.intersectionRatio > 0;

          evaluateRunningState();
        },
        {
          root: null,
          rootMargin: "280px 0px 280px 0px",
          threshold: 0
        }
      );

      state.intersectionObserver.observe(state.estate);
    }
  }

  function evaluateRunningState() {
    const shouldRun =
      state.initialized &&
      !state.destroyed &&
      state.documentVisible &&
      state.estateVisible &&
      !state.reducedMotion;

    if (shouldRun) {
      start();
    } else {
      stop();
    }
  }

  function start() {
    if (
      state.running ||
      state.destroyed ||
      !state.context ||
      state.reducedMotion
    ) {
      return;
    }

    state.running = true;
    state.lastFrameTime = performance.now();
    state.accumulatedFrameTime = 0;
    state.frameHandle = requestAnimationFrame(frame);
  }

  function stop() {
    if (!state.running) {
      return;
    }

    state.running = false;

    if (state.frameHandle) {
      cancelAnimationFrame(state.frameHandle);
      state.frameHandle = 0;
    }
  }

  function frame(timestamp) {
    if (!state.running || state.destroyed) {
      return;
    }

    const rawDelta = timestamp - state.lastFrameTime;
    const delta = clamp(rawDelta, 0, CONFIG.maximumDeltaMs);

    state.lastFrameTime = timestamp;
    state.accumulatedFrameTime += delta;

    const targetFrameDuration = 1000 / CONFIG.frameRate;

    if (state.accumulatedFrameTime >= targetFrameDuration) {
      const renderStart = performance.now();

      update(state.accumulatedFrameTime, timestamp);
      draw(timestamp);

      const renderCost = performance.now() - renderStart;
      registerRenderCost(renderCost, timestamp);

      state.accumulatedFrameTime %= targetFrameDuration;
    }

    state.frameHandle = requestAnimationFrame(frame);
  }

  function registerRenderCost(renderCost, timestamp) {
    state.renderCostSamples.push(renderCost);

    if (state.renderCostSamples.length > 90) {
      state.renderCostSamples.shift();
    }

    if (
      timestamp - state.lastAdaptiveCheck <
      CONFIG.adaptiveCheckIntervalMs
    ) {
      return;
    }

    state.lastAdaptiveCheck = timestamp;

    if (!state.renderCostSamples.length) {
      return;
    }

    const average =
      state.renderCostSamples.reduce((sum, value) => sum + value, 0) /
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
      Number(value) || CONFIG.adaptiveMinimumQuality,
      CONFIG.adaptiveMinimumQuality,
      CONFIG.adaptiveMaximumQuality
    );

    if (Math.abs(next - state.quality) < 0.02) {
      return;
    }

    state.quality = next;
    rebuildParticleField();
  }

  function resize() {
    if (!state.canvas || !state.context) {
      return;
    }

    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const mobileMaximum =
      width <= 820
        ? CONFIG.pixelRatioMobileMaximum
        : CONFIG.pixelRatioMaximum;

    const pixelRatio = clamp(
      window.devicePixelRatio || 1,
      1,
      mobileMaximum
    );

    if (
      width === state.width &&
      height === state.height &&
      pixelRatio === state.pixelRatio
    ) {
      return;
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

    rebuildParticleField();
    drawStaticFrame();
  }

  function rebuildParticleField() {
    const area = state.width * state.height;
    const mobileFactor = state.width <= 560 ? 0.62 : state.width <= 820 ? 0.78 : 1;
    const quality = state.quality * mobileFactor;

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

    state.stars = Array.from({ length: starCount }, createStar);
    state.dust = Array.from({ length: dustCount }, createDust);
    state.sparkles = Array.from({ length: sparkleCount }, createSparkle);
    state.meteors.length = 0;
  }

  function createStar() {
    const depth = Math.pow(Math.random(), 1.8);
    const paletteRoll = Math.random();

    let color = COLORS.stone;

    if (paletteRoll > 0.82 && paletteRoll <= 0.94) {
      color = COLORS.blue;
    } else if (paletteRoll > 0.94 && paletteRoll <= 0.985) {
      color = COLORS.gold;
    } else if (paletteRoll > 0.985) {
      color = COLORS.violet;
    }

    return {
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      radius: random(0.35, 1.55) * (0.55 + depth * 0.75),
      alpha: random(0.14, 0.68) * (0.55 + depth * 0.55),
      color,
      depth,
      phase: random(0, Math.PI * 2),
      twinkleRate: random(0.00055, 0.0018),
      driftX: random(-0.0035, 0.0035) * (0.3 + depth),
      driftY: random(-0.0024, 0.0024) * (0.3 + depth)
    };
  }

  function createDust() {
    return {
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      radius: random(0.4, 1.5),
      alpha: random(0.025, 0.13),
      speedX: random(-0.006, 0.006),
      speedY: random(-0.005, 0.005),
      phase: random(0, Math.PI * 2)
    };
  }

  function createSparkle() {
    return {
      x: random(0.06, 0.94) * state.width,
      y: random(0.04, 0.96) * state.height,
      radius: random(1.1, 2.2),
      alpha: random(0.36, 0.78),
      phase: random(0, Math.PI * 2),
      rate: random(0.001, 0.0024),
      color: randomChoice([
        COLORS.stone,
        COLORS.blue,
        COLORS.gold
      ])
    };
  }

  function update(delta, timestamp) {
    updateStars(delta);
    updateDust(delta);
    updateMeteors(delta, timestamp);
    updateSpacecraft(timestamp);
  }

  function updateStars(delta) {
    for (const star of state.stars) {
      star.x += star.driftX * delta;
      star.y += star.driftY * delta;

      if (star.x < -4) {
        star.x = state.width + 4;
      } else if (star.x > state.width + 4) {
        star.x = -4;
      }

      if (star.y < -4) {
        star.y = state.height + 4;
      } else if (star.y > state.height + 4) {
        star.y = -4;
      }
    }
  }

  function updateDust(delta) {
    for (const particle of state.dust) {
      particle.x += particle.speedX * delta;
      particle.y += particle.speedY * delta;

      if (particle.x < -8) {
        particle.x = state.width + 8;
      } else if (particle.x > state.width + 8) {
        particle.x = -8;
      }

      if (particle.y < -8) {
        particle.y = state.height + 8;
      } else if (particle.y > state.height + 8) {
        particle.y = -8;
      }
    }
  }

  function updateMeteors(delta, timestamp) {
    if (
      timestamp >= state.nextMeteorTime &&
      state.meteors.length < CONFIG.maximumMeteors
    ) {
      state.meteors.push(createMeteor());

      state.nextMeteorTime =
        timestamp +
        random(
          CONFIG.meteorSpawnMinimumMs,
          CONFIG.meteorSpawnMaximumMs
        );
    }

    for (let index = state.meteors.length - 1; index >= 0; index -= 1) {
      const meteor = state.meteors[index];

      meteor.elapsed += delta;
      meteor.x += meteor.velocityX * delta;
      meteor.y += meteor.velocityY * delta;

      if (
        meteor.elapsed >= meteor.duration ||
        meteor.x < -meteor.length * 2 ||
        meteor.x > state.width + meteor.length * 2 ||
        meteor.y < -meteor.length * 2 ||
        meteor.y > state.height + meteor.length * 2
      ) {
        state.meteors.splice(index, 1);
      }
    }
  }

  function createMeteor() {
    const fromRight = Math.random() < 0.72;
    const downward = Math.random() < 0.82;
    const length = random(70, state.width <= 560 ? 115 : 175);
    const speed = random(0.42, 0.74);

    return {
      x: fromRight
        ? state.width + length
        : -length,
      y: random(-40, state.height * 0.44),
      velocityX: fromRight ? -speed : speed,
      velocityY: downward
        ? random(0.14, 0.30)
        : random(-0.22, -0.10),
      length,
      alpha: random(0.40, 0.82),
      width: random(0.7, 1.4),
      elapsed: 0,
      duration: random(1300, 2300),
      color: Math.random() < 0.72 ? COLORS.blue : COLORS.gold
    };
  }

  function draw(timestamp) {
    const context = state.context;

    context.clearRect(0, 0, state.width, state.height);

    drawDust(context, timestamp);
    drawStars(context, timestamp);
    drawSparkles(context, timestamp);
    drawMeteors(context);
  }

  function drawStaticFrame() {
    if (!state.context) {
      return;
    }

    draw(performance.now());
  }

  function drawDust(context, timestamp) {
    context.save();

    for (const particle of state.dust) {
      const shimmer =
        0.72 +
        Math.sin(timestamp * 0.00028 + particle.phase) * 0.28;

      context.fillStyle =
        `rgba(${COLORS.dust}, ${particle.alpha * shimmer})`;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
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
      const twinkle =
        0.70 +
        Math.sin(timestamp * star.twinkleRate + star.phase) * 0.30;

      const alpha = clamp(star.alpha * twinkle, 0.03, 0.92);

      context.fillStyle = `rgba(${star.color}, ${alpha})`;
      context.fillRect(
        star.x,
        star.y,
        star.radius,
        star.radius
      );
    }

    context.restore();
  }

  function drawSparkles(context, timestamp) {
    context.save();
    context.lineCap = "round";

    for (const sparkle of state.sparkles) {
      const pulse =
        0.5 +
        Math.sin(timestamp * sparkle.rate + sparkle.phase) * 0.5;

      if (pulse < 0.58) {
        continue;
      }

      const alpha = sparkle.alpha * Math.pow(pulse, 2.2);
      const reach = sparkle.radius * (2.2 + pulse * 2.8);

      context.strokeStyle = `rgba(${sparkle.color}, ${alpha})`;
      context.lineWidth = 0.7;

      context.beginPath();
      context.moveTo(sparkle.x - reach, sparkle.y);
      context.lineTo(sparkle.x + reach, sparkle.y);
      context.moveTo(sparkle.x, sparkle.y - reach);
      context.lineTo(sparkle.x, sparkle.y + reach);
      context.stroke();

      context.fillStyle =
        `rgba(${sparkle.color}, ${clamp(alpha * 1.18, 0, 1)})`;

      context.beginPath();
      context.arc(
        sparkle.x,
        sparkle.y,
        sparkle.radius,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  function drawMeteors(context) {
    context.save();
    context.lineCap = "round";

    for (const meteor of state.meteors) {
      const progress = meteor.elapsed / meteor.duration;
      const fade =
        progress < 0.2
          ? progress / 0.2
          : progress > 0.72
            ? (1 - progress) / 0.28
            : 1;

      const magnitude = Math.hypot(
        meteor.velocityX,
        meteor.velocityY
      );

      const directionX = meteor.velocityX / magnitude;
      const directionY = meteor.velocityY / magnitude;

      const tailX = meteor.x - directionX * meteor.length;
      const tailY = meteor.y - directionY * meteor.length;

      const gradient = context.createLinearGradient(
        tailX,
        tailY,
        meteor.x,
        meteor.y
      );

      gradient.addColorStop(
        0,
        `rgba(${meteor.color}, 0)`
      );
      gradient.addColorStop(
        0.68,
        `rgba(${meteor.color}, ${meteor.alpha * fade * 0.42})`
      );
      gradient.addColorStop(
        1,
        `rgba(${COLORS.stone}, ${meteor.alpha * fade})`
      );

      context.strokeStyle = gradient;
      context.lineWidth = meteor.width;

      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(meteor.x, meteor.y);
      context.stroke();

      context.fillStyle =
        `rgba(${COLORS.stone}, ${meteor.alpha * fade})`;

      context.beginPath();
      context.arc(
        meteor.x,
        meteor.y,
        meteor.width * 1.45,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  function scheduleNextSpacecraftFlight(initial = false) {
    if (
      state.destroyed ||
      state.reducedMotion ||
      !state.spacecraft
    ) {
      return;
    }

    clearTimeout(state.spacecraftTimer);

    const delay = initial
      ? random(
          CONFIG.spacecraftInitialDelayMinimumMs,
          CONFIG.spacecraftInitialDelayMaximumMs
        )
      : random(
          CONFIG.spacecraftDelayMinimumMs,
          CONFIG.spacecraftDelayMaximumMs
        );

    state.spacecraftTimer = window.setTimeout(() => {
      if (
        state.documentVisible &&
        state.estateVisible &&
        !state.reducedMotion
      ) {
        launchSpacecraft();
      } else {
        scheduleNextSpacecraftFlight(false);
      }
    }, delay);
  }

  function launchSpacecraft() {
    if (
      state.destroyed ||
      state.reducedMotion ||
      !state.spacecraft ||
      state.spacecraftFlight
    ) {
      return false;
    }

    const path = generateSpacecraftPath();
    const duration = random(
      CONFIG.spacecraftDurationMinimumMs,
      CONFIG.spacecraftDurationMaximumMs
    );

    const scale = random(
      state.width <= 560 ? 0.46 : 0.58,
      state.width <= 560 ? 0.76 : 1.08
    );

    const opacity = random(0.66, 0.94);

    state.spacecraftFlight = {
      path,
      startTime: performance.now(),
      duration,
      scale,
      opacity,
      completed: false
    };

    state.lastSpacecraftPath = path;
    state.spacecraft.setAttribute("data-flying", "true");
    state.spacecraft.style.opacity = String(opacity);

    evaluateRunningState();
    return true;
  }

  function cancelSpacecraftFlight() {
    clearTimeout(state.spacecraftTimer);
    state.spacecraftTimer = 0;
    state.spacecraftFlight = null;

    if (state.spacecraft) {
      state.spacecraft.setAttribute("data-flying", "false");
      state.spacecraft.style.opacity = "0";
      state.spacecraft.style.transform =
        "translate3d(-260px, -160px, 0) rotate(0deg) scale(0.8)";
    }
  }

  function updateSpacecraft(timestamp) {
    const flight = state.spacecraftFlight;

    if (!flight || !state.spacecraft) {
      return;
    }

    const rawProgress =
      (timestamp - flight.startTime) / flight.duration;

    if (rawProgress >= 1) {
      completeSpacecraftFlight();
      return;
    }

    const progress = clamp(rawProgress, 0, 1);
    const eased = easeInOutCubic(progress);

    const point = cubicPoint(flight.path, eased);
    const tangent = cubicTangent(flight.path, eased);
    const angle =
      Math.atan2(tangent.y, tangent.x) * (180 / Math.PI);

    const fadeIn = clamp(progress / 0.08, 0, 1);
    const fadeOut = clamp((1 - progress) / 0.10, 0, 1);
    const opacity =
      flight.opacity * Math.min(fadeIn, fadeOut);

    const depthPulse =
      0.96 +
      Math.sin(progress * Math.PI) * 0.10;

    const scale = flight.scale * depthPulse;

    state.spacecraft.style.opacity = String(opacity);
    state.spacecraft.style.transform =
      `translate3d(${point.x}px, ${point.y}px, 0) ` +
      `rotate(${angle}deg) ` +
      `scale(${scale})`;
  }

  function completeSpacecraftFlight() {
    if (!state.spacecraft) {
      return;
    }

    state.spacecraftFlight = null;
    state.spacecraft.setAttribute("data-flying", "false");
    state.spacecraft.style.opacity = "0";
    state.spacecraft.style.transform =
      "translate3d(-260px, -160px, 0) rotate(0deg) scale(0.8)";

    scheduleNextSpacecraftFlight(false);
  }

  function generateSpacecraftPath() {
    const protectedRects = collectProtectedRects();
    let bestPath = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (
      let attempt = 0;
      attempt < CONFIG.spacecraftCandidateCount;
      attempt += 1
    ) {
      const candidate = createRandomPath();
      const score =
        scorePath(candidate, protectedRects) +
        scorePathSimilarity(candidate, state.lastSpacecraftPath);

      if (score < bestScore) {
        bestScore = score;
        bestPath = candidate;
      }

      if (score <= 0.5) {
        break;
      }
    }

    return bestPath || createRandomPath();
  }

  function createRandomPath() {
    const marginX = Math.max(180, state.width * 0.16);
    const marginY = Math.max(120, state.height * 0.14);
    const horizontal = Math.random() < 0.72;
    const reverse = Math.random() < 0.5;

    let start;
    let end;

    if (horizontal) {
      start = {
        x: reverse ? state.width + marginX : -marginX,
        y: random(-marginY * 0.2, state.height * 0.82)
      };

      end = {
        x: reverse ? -marginX : state.width + marginX,
        y: clamp(
          start.y + random(-state.height * 0.34, state.height * 0.34),
          -marginY * 0.4,
          state.height + marginY * 0.4
        )
      };
    } else {
      start = {
        x: random(-marginX * 0.2, state.width + marginX * 0.2),
        y: reverse ? state.height + marginY : -marginY
      };

      end = {
        x: clamp(
          start.x + random(-state.width * 0.42, state.width * 0.42),
          -marginX * 0.4,
          state.width + marginX * 0.4
        ),
        y: reverse ? -marginY : state.height + marginY
      };
    }

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const normalLength = Math.max(1, Math.hypot(dx, dy));
    const normalX = -dy / normalLength;
    const normalY = dx / normalLength;
    const curveStrength =
      random(0.08, 0.28) *
      Math.min(state.width, state.height) *
      randomSign();

    const control1 = {
      x: start.x + dx * random(0.20, 0.36) + normalX * curveStrength,
      y: start.y + dy * random(0.20, 0.36) + normalY * curveStrength
    };

    const control2 = {
      x:
        start.x +
        dx * random(0.64, 0.82) -
        normalX * curveStrength * random(0.45, 1),
      y:
        start.y +
        dy * random(0.64, 0.82) -
        normalY * curveStrength * random(0.45, 1)
    };

    return {
      start,
      control1,
      control2,
      end
    };
  }

  function collectProtectedRects() {
    const selectors = CONFIG.protectedSelectors.join(",");
    const nodes = document.querySelectorAll(selectors);
    const padding = state.width <= 560 ? 18 : 34;

    return Array.from(nodes)
      .filter((node) => {
        const style = window.getComputedStyle(node);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") > 0.05
        );
      })
      .map((node) => {
        const rect = node.getBoundingClientRect();

        return {
          left: rect.left - padding,
          right: rect.right + padding,
          top: rect.top - padding,
          bottom: rect.bottom + padding
        };
      })
      .filter((rect) => {
        return (
          rect.right > 0 &&
          rect.left < state.width &&
          rect.bottom > 0 &&
          rect.top < state.height
        );
      });
  }

  function scorePath(path, protectedRects) {
    let score = 0;
    const samples = 28;

    for (let index = 0; index <= samples; index += 1) {
      const t = index / samples;
      const point = cubicPoint(path, t);

      for (const rect of protectedRects) {
        if (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
        ) {
          score += 1;
        }
      }

      const centerDistance = Math.abs(point.x - state.width * 0.5);
      const centerPenalty =
        centerDistance < state.width * 0.18 ? 0.08 : 0;

      score += centerPenalty;
    }

    return score;
  }

  function scorePathSimilarity(path, previousPath) {
    if (!previousPath) {
      return 0;
    }

    const startDistance = Math.hypot(
      path.start.x - previousPath.start.x,
      path.start.y - previousPath.start.y
    );

    const endDistance = Math.hypot(
      path.end.x - previousPath.end.x,
      path.end.y - previousPath.end.y
    );

    const controlDistance = Math.hypot(
      path.control1.x - previousPath.control1.x,
      path.control1.y - previousPath.control1.y
    );

    const threshold =
      Math.min(state.width, state.height) * 0.32;

    let penalty = 0;

    if (startDistance < threshold) {
      penalty += 3;
    }

    if (endDistance < threshold) {
      penalty += 3;
    }

    if (controlDistance < threshold) {
      penalty += 2;
    }

    return penalty;
  }

  function cubicPoint(path, t) {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const tSquared = t * t;

    return {
      x:
        oneMinusTSquared * oneMinusT * path.start.x +
        3 * oneMinusTSquared * t * path.control1.x +
        3 * oneMinusT * tSquared * path.control2.x +
        tSquared * t * path.end.x,

      y:
        oneMinusTSquared * oneMinusT * path.start.y +
        3 * oneMinusTSquared * t * path.control1.y +
        3 * oneMinusT * tSquared * path.control2.y +
        tSquared * t * path.end.y
    };
  }

  function cubicTangent(path, t) {
    const oneMinusT = 1 - t;

    return {
      x:
        3 * oneMinusT * oneMinusT *
          (path.control1.x - path.start.x) +
        6 * oneMinusT * t *
          (path.control2.x - path.control1.x) +
        3 * t * t *
          (path.end.x - path.control2.x),

      y:
        3 * oneMinusT * oneMinusT *
          (path.control1.y - path.start.y) +
        6 * oneMinusT * t *
          (path.control2.y - path.control1.y) +
        3 * t * t *
          (path.end.y - path.control2.y)
    };
  }

  function destroy() {
    if (state.destroyed) {
      return;
    }

    state.destroyed = true;
    stop();
    cancelSpacecraftFlight();

    window.removeEventListener("resize", state.boundResize);
    document.removeEventListener(
      "visibilitychange",
      state.boundVisibility
    );

    if (state.motionQuery) {
      if (typeof state.motionQuery.removeEventListener === "function") {
        state.motionQuery.removeEventListener(
          "change",
          state.boundMotionChange
        );
      } else {
        state.motionQuery.removeListener(state.boundMotionChange);
      }
    }

    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();

    document.getElementById(LAYER_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();

    state.stars.length = 0;
    state.dust.length = 0;
    state.sparkles.length = 0;
    state.meteors.length = 0;

    state.layer = null;
    state.canvas = null;
    state.context = null;
    state.spacecraft = null;
    state.initialized = false;

    api.initialized = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
