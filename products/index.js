(() => {
  "use strict";

  const SELECTORS = {
    frame: "#products-universe-frame",
    stage: "#products-hero-stage",
    grid: "#products-orbit-grid",
    tokens: ".lane-token"
  };

  const CONFIG = {
    UNIVERSE_WIDTH_KM: 256000,
    UNIVERSE_HEIGHT_KM: 256000,
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    MOBILE_BREAKPOINT: 760,
    DPR_CAP: 2,
    STAR_COUNT: 170,
    PARTICLE_COUNT: 24,
    DESKTOP_ORBIT_WIDTH_KM: 142000,
    DESKTOP_ORBIT_HEIGHT_KM: 92000,
    MOBILE_ORBIT_WIDTH_KM: 102000,
    MOBILE_ORBIT_HEIGHT_KM: 126000,
    TOKEN_SCALE_MIN: 0.72,
    TOKEN_SCALE_MAX: 1.05,
    TOKEN_OPACITY_MIN: 0.52,
    TOKEN_OPACITY_MAX: 1,
    ORBIT_SPEED_RAD_MS: 0.00028,
    SELF_SPIN_DEG_MS: 0.028,
    WOBBLE_KM_X: 5600,
    WOBBLE_KM_Y: 3600,
    POINTER_KM_X: 7000,
    POINTER_KM_Y: 5600,
    CENTER_X_RATIO: 0.5,
    CENTER_Y_RATIO: 0.52,
    FRONT_VISIBILITY_PUSH_PX: 20,
    BACK_VISIBILITY_PUSH_PX: -8
  };

  const state = {
    mounted: false,
    reducedMotion: false,
    rafId: 0,
    startTs: 0,
    width: 0,
    height: 0,
    dpr: 1,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    stars: [],
    particles: [],
    tokens: [],
    canvas: null,
    ctx: null
  };

  const frame = document.querySelector(SELECTORS.frame);
  const stage = document.querySelector(SELECTORS.stage);
  const grid = document.querySelector(SELECTORS.grid);
  const tokenElements = Array.from(document.querySelectorAll(SELECTORS.tokens));

  if (!frame || !stage || !grid || tokenElements.length === 0) {
    return;
  }

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);
  state.reducedMotion = reducedMotionMedia.matches;

  buildStage();
  bindTokens();
  resize();
  seedStars();
  seedParticles();
  bindEvents();

  if (state.reducedMotion) {
    applyReducedMotionState();
  } else {
    start();
  }

  function buildStage() {
    stage.innerHTML = `
      <canvas class="products-universe-canvas"></canvas>
      <div class="products-universe-glow glow-a"></div>
      <div class="products-universe-glow glow-b"></div>
      <div class="products-universe-core"></div>
      <div class="products-universe-ring ring-a"></div>
      <div class="products-universe-ring ring-b"></div>
      <div class="products-universe-ring ring-c"></div>
    `;

    injectRuntimeStyles();

    state.canvas = stage.querySelector(".products-universe-canvas");
    state.ctx = state.canvas.getContext("2d", { alpha: true });
  }

  function bindTokens() {
    const step = (Math.PI * 2) / tokenElements.length;

    state.tokens = tokenElements.map((el, index) => {
      const baseAngle = step * index;
      const phase = baseAngle + index * 0.47;

      el.addEventListener("mouseenter", () => el.classList.add("is-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
      el.addEventListener("focusin", () => el.classList.add("is-active"));
      el.addEventListener("focusout", () => el.classList.remove("is-active"));

      return {
        el,
        baseAngle,
        phase
      };
    });
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(320, Math.floor(rect.height));
    state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);

    state.canvas.width = Math.floor(state.width * state.dpr);
    state.canvas.height = Math.floor(state.height * state.dpr);
    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;
    state.ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function seedStars() {
    state.stars = Array.from({ length: CONFIG.STAR_COUNT }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: Math.random() * 1.4 + 0.25,
      a: Math.random() * 0.7 + 0.14,
      tw: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 1.15
    }));
  }

  function seedParticles() {
    state.particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radiusXKm: 16000 + Math.random() * getOrbitWidthKm() * 0.52,
      radiusYKm: 12000 + Math.random() * getOrbitHeightKm() * 0.52,
      size: 1.8 + Math.random() * 2.8,
      speed: 0.26 + Math.random() * 0.72,
      alpha: 0.09 + Math.random() * 0.22
    }));
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);
    window.addEventListener("beforeunload", () => stop(), { once: true });
  }

  function onResize() {
    resize();
    seedStars();
    seedParticles();
    if (state.reducedMotion) {
      applyReducedMotionState();
    }
  }

  function onPointerMove(event) {
    state.pointerActive = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
  }

  function onPointerLeave() {
    state.pointerActive = false;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop();
    } else if (!state.reducedMotion) {
      start();
    }
  }

  function onReducedMotionChange(event) {
    state.reducedMotion = event.matches;
    if (state.reducedMotion) {
      stop();
      applyReducedMotionState();
    } else {
      start();
    }
  }

  function start() {
    if (state.mounted) {
      return;
    }
    state.mounted = true;
    state.startTs = performance.now();
    state.rafId = requestAnimationFrame(tick);
  }

  function stop() {
    state.mounted = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function tick(ts) {
    if (!state.mounted || state.reducedMotion) {
      return;
    }

    const elapsed = ts - state.startTs;

    drawUniverse(elapsed);
    moveShell(elapsed);
    positionTokens(elapsed);

    state.rafId = requestAnimationFrame(tick);
  }

  function drawUniverse(elapsed) {
    const ctx = state.ctx;
    const cx = state.width * CONFIG.CENTER_X_RATIO;
    const cy = state.height * CONFIG.CENTER_Y_RATIO;
    const orbitWidthPx = universeKmToPxX(getOrbitWidthKm());
    const orbitHeightPx = universeKmToPxY(getOrbitHeightKm());

    ctx.clearRect(0, 0, state.width, state.height);

    const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, orbitWidthPx * 1.18);
    gradient.addColorStop(0, "rgba(191,230,255,0.19)");
    gradient.addColorStop(0.28, "rgba(143,200,255,0.11)");
    gradient.addColorStop(0.56, "rgba(108,156,255,0.06)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    state.stars.forEach((star) => {
      const twinkle = 0.58 + Math.sin(elapsed * 0.001 * star.speed + star.tw) * 0.42;
      ctx.beginPath();
      ctx.fillStyle = `rgba(224,240,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsed * 0.00014);
    ctx.strokeStyle = "rgba(170,210,255,0.09)";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        orbitWidthPx * (0.26 + i * 0.14),
        orbitHeightPx * (0.24 + i * 0.15),
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.restore();

    state.particles.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00026 * particle.speed;
      const x = cx + universeKmToPxX(Math.cos(angle) * particle.radiusXKm);
      const y = cy + universeKmToPxY(Math.sin(angle) * particle.radiusYKm);

      ctx.beginPath();
      ctx.fillStyle = `rgba(175,225,255,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function moveShell(elapsed) {
    const glowA = stage.querySelector(".glow-a");
    const glowB = stage.querySelector(".glow-b");
    const core = stage.querySelector(".products-universe-core");
    const ringA = stage.querySelector(".ring-a");
    const ringB = stage.querySelector(".ring-b");
    const ringC = stage.querySelector(".ring-c");

    const px = normalizePointerX();
    const py = normalizePointerY();

    glowA.style.transform = `translate3d(${px * 18}px, ${py * 12}px, 0) scale(${1 + Math.sin(elapsed * 0.0011) * 0.05})`;
    glowB.style.transform = `translate3d(${px * -16}px, ${py * -10}px, 0) scale(${1 + Math.cos(elapsed * 0.0013) * 0.04})`;
    core.style.transform = `translate3d(${px * 14}px, ${py * 10}px, 0) scale(${1 + Math.sin(elapsed * 0.0012) * 0.03})`;
    ringA.style.transform = `translate3d(${px * 8}px, ${py * 6}px, 0) rotate(${elapsed * 0.014}deg)`;
    ringB.style.transform = `translate3d(${px * -7}px, ${py * 5}px, 0) rotate(${elapsed * -0.010}deg)`;
    ringC.style.transform = `translate3d(${px * 10}px, ${py * -8}px, 0) rotate(${elapsed * 0.018}deg)`;
  }

  function positionTokens(elapsed) {
    const orbitWidthKm = getOrbitWidthKm();
    const orbitHeightKm = getOrbitHeightKm();
    const pointerShiftXKm = normalizePointerX() * CONFIG.POINTER_KM_X;
    const pointerShiftYKm = normalizePointerY() * CONFIG.POINTER_KM_Y;

    state.tokens.forEach((token) => {
      const angle = token.baseAngle + elapsed * CONFIG.ORBIT_SPEED_RAD_MS;
      const depth = (Math.sin(angle) + 1) * 0.5;
      const wobbleXKm = Math.sin(elapsed * 0.00108 + token.phase) * CONFIG.WOBBLE_KM_X;
      const wobbleYKm = Math.cos(elapsed * 0.00102 + token.phase) * CONFIG.WOBBLE_KM_Y;

      const worldXKm = Math.cos(angle) * orbitWidthKm * 0.5 + wobbleXKm + pointerShiftXKm;
      const worldYKm = Math.sin(angle) * orbitHeightKm * 0.5 + wobbleYKm + pointerShiftYKm;

      const projectedXPx = universeKmToPxX(worldXKm);
      const projectedYPx = universeKmToPxY(worldYKm);

      const scale = CONFIG.TOKEN_SCALE_MIN + depth * (CONFIG.TOKEN_SCALE_MAX - CONFIG.TOKEN_SCALE_MIN);
      const opacity = CONFIG.TOKEN_OPACITY_MIN + depth * (CONFIG.TOKEN_OPACITY_MAX - CONFIG.TOKEN_OPACITY_MIN);
      const tiltY = Math.cos(angle) * 18 + normalizePointerX() * 8;
      const tiltX = Math.sin(angle) * 14 + normalizePointerY() * 7;
      const selfSpin = elapsed * CONFIG.SELF_SPIN_DEG_MS + token.baseAngle * 24;
      const zPush = depth > 0.5 ? CONFIG.FRONT_VISIBILITY_PUSH_PX : CONFIG.BACK_VISIBILITY_PUSH_PX;

      token.el.style.transform = `
        translate3d(${projectedXPx}px, ${projectedYPx}px, ${zPush}px)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        rotateZ(${selfSpin}deg)
      `;
      token.el.style.opacity = String(opacity);
      token.el.style.zIndex = String(20 + Math.round(depth * 50));
    });

    state.tokens
      .slice()
      .sort((a, b) => Number(a.el.style.zIndex) - Number(b.el.style.zIndex))
      .forEach((token) => grid.appendChild(token.el));
  }

  function applyReducedMotionState() {
    drawUniverse(0);

    state.tokens.forEach((token, index) => {
      token.el.style.transform = "translate3d(0,0,0)";
      token.el.style.opacity = "1";
      token.el.style.zIndex = String(index + 1);
    });

    stage.querySelectorAll(".products-universe-glow,.products-universe-core,.products-universe-ring")
      .forEach((node) => {
        node.style.transform = "translate3d(0,0,0)";
      });
  }

  function getOrbitWidthKm() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.MOBILE_ORBIT_WIDTH_KM
      : CONFIG.DESKTOP_ORBIT_WIDTH_KM;
  }

  function getOrbitHeightKm() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.MOBILE_ORBIT_HEIGHT_KM
      : CONFIG.DESKTOP_ORBIT_HEIGHT_KM;
  }

  function universeKmToPxX(km) {
    return (km / CONFIG.UNIVERSE_WIDTH_KM) * state.width;
  }

  function universeKmToPxY(km) {
    return (km / CONFIG.UNIVERSE_HEIGHT_KM) * state.height;
  }

  function normalizePointerX() {
    if (!state.pointerActive) {
      return 0;
    }
    const n = (state.pointerX / Math.max(window.innerWidth, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function normalizePointerY() {
    if (!state.pointerActive) {
      return 0;
    }
    const n = (state.pointerY / Math.max(window.innerHeight, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function injectRuntimeStyles() {
    if (document.getElementById("products-universe-runtime-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "products-universe-runtime-style";
    style.textContent = `
      .products-universe-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.96;
      }

      .products-universe-glow,
      .products-universe-core,
      .products-universe-ring {
        position: absolute;
        left: 50%;
        top: 52%;
        transform: translate3d(0,0,0);
        will-change: transform, opacity;
      }

      .products-universe-glow {
        border-radius: 999px;
        filter: blur(34px);
        opacity: 0.40;
      }

      .glow-a {
        width: 300px;
        height: 300px;
        margin-left: -150px;
        margin-top: -150px;
        background: radial-gradient(circle, rgba(143,200,255,0.24), rgba(143,200,255,0.06) 48%, transparent 72%);
      }

      .glow-b {
        width: 390px;
        height: 220px;
        margin-left: -195px;
        margin-top: -110px;
        background: radial-gradient(circle, rgba(108,132,255,0.16), rgba(108,132,255,0.05) 50%, transparent 76%);
        filter: blur(46px);
      }

      .products-universe-core {
        width: 108px;
        height: 108px;
        margin-left: -54px;
        margin-top: -54px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 45% 42%, rgba(248,252,255,0.96), rgba(188,228,255,0.78) 22%, rgba(123,178,255,0.24) 42%, transparent 72%);
        box-shadow:
          0 0 38px rgba(143,200,255,0.24),
          inset 0 0 22px rgba(255,255,255,0.18);
        opacity: 0.92;
      }

      .products-universe-ring {
        border-radius: 50%;
        border: 1px solid rgba(191,230,255,0.14);
        box-shadow: 0 0 24px rgba(143,200,255,0.08), inset 0 0 20px rgba(191,230,255,0.05);
      }

      .ring-a {
        width: 310px;
        height: 150px;
        margin-left: -155px;
        margin-top: -75px;
      }

      .ring-b {
        width: 212px;
        height: 212px;
        margin-left: -106px;
        margin-top: -106px;
        border-color: rgba(160,205,255,0.10);
      }

      .ring-c {
        width: 420px;
        height: 180px;
        margin-left: -210px;
        margin-top: -90px;
        border-color: rgba(191,230,255,0.09);
      }

      @media (max-width: 760px) {
        .glow-a {
          width: 250px;
          height: 250px;
          margin-left: -125px;
          margin-top: -125px;
        }

        .glow-b {
          width: 320px;
          height: 190px;
          margin-left: -160px;
          margin-top: -95px;
        }

        .products-universe-core {
          width: 94px;
          height: 94px;
          margin-left: -47px;
          margin-top: -47px;
        }

        .ring-a {
          width: 250px;
          height: 122px;
          margin-left: -125px;
          margin-top: -61px;
        }

        .ring-b {
          width: 180px;
          height: 180px;
          margin-left: -90px;
          margin-top: -90px;
        }

        .ring-c {
          width: 330px;
          height: 150px;
          margin-left: -165px;
          margin-top: -75px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .products-universe-glow,
        .products-universe-core,
        .products-universe-ring,
        .lane-token {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }
})();
