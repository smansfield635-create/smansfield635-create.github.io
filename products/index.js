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

    STAR_COUNT: 135,
    PARTICLE_COUNT: 16,

    DESKTOP_ORBIT_WIDTH_KM: 136000,
    DESKTOP_ORBIT_HEIGHT_KM: 86000,
    MOBILE_ORBIT_WIDTH_KM: 98000,
    MOBILE_ORBIT_HEIGHT_KM: 116000,

    TOKEN_SCALE_MIN: 0.74,
    TOKEN_SCALE_MAX: 1.02,
    TOKEN_OPACITY_MIN: 0.56,
    TOKEN_OPACITY_MAX: 1,

    ORBIT_SPEED_RAD_MS: 0.00024,
    BODY_SPIN_DEG_MS: 0.018,

    WOBBLE_KM_X: 3200,
    WOBBLE_KM_Y: 2400,
    POINTER_KM_X: 4200,
    POINTER_KM_Y: 3400,

    CENTER_X_RATIO: 0.5,
    CENTER_Y_RATIO: 0.52
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

  if (!frame || !stage || !grid || tokenElements.length === 0) return;

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
    const laneBands = [1.00, 0.92, 1.06, 0.88, 1.10, 0.96];

    state.tokens = tokenElements.map((el, index) => {
      const baseAngle = step * index;
      const phase = baseAngle + index * 0.41;
      const laneBand = laneBands[index % laneBands.length];
      const diamond = el.querySelector(".token-diamond");
      const labelWrap = el.querySelector(".token-label-wrap");

      el.addEventListener("mouseenter", () => el.classList.add("is-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
      el.addEventListener("focusin", () => el.classList.add("is-active"));
      el.addEventListener("focusout", () => el.classList.remove("is-active"));

      return { el, diamond, labelWrap, baseAngle, phase, laneBand };
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
      r: Math.random() * 1.3 + 0.25,
      a: Math.random() * 0.7 + 0.14,
      tw: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 1.05
    }));
  }

  function seedParticles() {
    state.particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radiusXKm: 16000 + Math.random() * getOrbitWidthKm() * 0.46,
      radiusYKm: 12000 + Math.random() * getOrbitHeightKm() * 0.46,
      size: 1.6 + Math.random() * 2.4,
      speed: 0.24 + Math.random() * 0.58,
      alpha: 0.08 + Math.random() * 0.16
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
    if (state.reducedMotion) applyReducedMotionState();
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
    if (document.hidden) stop();
    else if (!state.reducedMotion) start();
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
    if (state.mounted) return;
    state.mounted = true;
    state.startTs = performance.now();
    state.rafId = requestAnimationFrame(tick);
  }

  function stop() {
    state.mounted = false;
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  function tick(ts) {
    if (!state.mounted || state.reducedMotion) return;

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

    const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, orbitWidthPx * 1.06);
    gradient.addColorStop(0, "rgba(191,230,255,0.20)");
    gradient.addColorStop(0.28, "rgba(143,200,255,0.11)");
    gradient.addColorStop(0.54, "rgba(108,156,255,0.05)");
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

    // Reduced ring density: only 3 principal orbits
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsed * 0.00012);
    ctx.strokeStyle = "rgba(170,210,255,0.085)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidthPx * 0.42, orbitHeightPx * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidthPx * 0.64, orbitHeightPx * 0.64, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidthPx * 0.84, orbitHeightPx * 0.84, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    state.particles.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00022 * particle.speed;
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

    glowA.style.transform = `translate3d(${px * 16}px, ${py * 10}px, 0) scale(${1 + Math.sin(elapsed * 0.0011) * 0.04})`;
    glowB.style.transform = `translate3d(${px * -14}px, ${py * -9}px, 0) scale(${1 + Math.cos(elapsed * 0.0012) * 0.03})`;
    core.style.transform = `translate3d(${px * 10}px, ${py * 8}px, 0) scale(${1 + Math.sin(elapsed * 0.001) * 0.02})`;
    ringA.style.transform = `translate3d(${px * 7}px, ${py * 5}px, 0) rotate(${elapsed * 0.010}deg)`;
    ringB.style.transform = `translate3d(${px * -5}px, ${py * 4}px, 0) rotate(${elapsed * -0.008}deg)`;
    ringC.style.transform = `translate3d(${px * 8}px, ${py * -6}px, 0) rotate(${elapsed * 0.012}deg)`;
  }

  function positionTokens(elapsed) {
    const orbitWidthKm = getOrbitWidthKm();
    const orbitHeightKm = getOrbitHeightKm();
    const pointerShiftXKm = normalizePointerX() * CONFIG.POINTER_KM_X;
    const pointerShiftYKm = normalizePointerY() * CONFIG.POINTER_KM_Y;

    state.tokens.forEach((token) => {
      const angle = token.baseAngle + elapsed * CONFIG.ORBIT_SPEED_RAD_MS;
      const depth = (Math.sin(angle) + 1) * 0.5;

      const frontBias = depth > 0.72 ? 1.08 : 1;
      const band = token.laneBand * frontBias;

      const wobbleXKm = Math.sin(elapsed * 0.0009 + token.phase) * CONFIG.WOBBLE_KM_X;
      const wobbleYKm = Math.cos(elapsed * 0.00082 + token.phase) * CONFIG.WOBBLE_KM_Y;

      const worldXKm = Math.cos(angle) * orbitWidthKm * 0.5 * band + wobbleXKm + pointerShiftXKm;
      const worldYKm = Math.sin(angle) * orbitHeightKm * 0.5 * band + wobbleYKm + pointerShiftYKm;

      const projectedXPx = universeKmToPxX(worldXKm);
      const projectedYPx = universeKmToPxY(worldYKm);

      const scale = CONFIG.TOKEN_SCALE_MIN + depth * (CONFIG.TOKEN_SCALE_MAX - CONFIG.TOKEN_SCALE_MIN);
      const opacity = CONFIG.TOKEN_OPACITY_MIN + depth * (CONFIG.TOKEN_OPACITY_MAX - CONFIG.TOKEN_OPACITY_MIN);

      const tiltY = Math.cos(angle) * 15 + normalizePointerX() * 6;
      const tiltX = Math.sin(angle) * 11 + normalizePointerY() * 5;
      const bodySpin = elapsed * CONFIG.BODY_SPIN_DEG_MS + token.baseAngle * 16;

      // Main orbital movement
      token.el.style.transform = `
        translate3d(${projectedXPx}px, ${projectedYPx}px, ${depth > 0.5 ? 14 : -6}px)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
      token.el.style.opacity = String(opacity);
      token.el.style.zIndex = String(20 + Math.round(depth * 60));

      // Body spins slightly
      if (token.diamond) {
        token.diamond.style.transform = `rotateZ(${bodySpin}deg)`;
      }

      // Label stays face-forward / counter-rotated
      if (token.labelWrap) {
        token.labelWrap.style.transform = `rotateZ(${-bodySpin}deg) translateZ(12px)`;
      }

      // Depth lighting cue
      const face = token.el.querySelector(".token-face");
      if (face) {
        face.style.filter = `brightness(${0.78 + depth * 0.34})`;
      }
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
      if (token.diamond) token.diamond.style.transform = "rotateZ(0deg)";
      if (token.labelWrap) token.labelWrap.style.transform = "translateZ(12px)";
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
    if (!state.pointerActive) return 0;
    const n = (state.pointerX / Math.max(window.innerWidth, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function normalizePointerY() {
    if (!state.pointerActive) return 0;
    const n = (state.pointerY / Math.max(window.innerHeight, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function injectRuntimeStyles() {
    if (document.getElementById("products-universe-runtime-style")) return;

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
        opacity: 0.38;
      }

      .glow-a {
        width: 280px;
        height: 280px;
        margin-left: -140px;
        margin-top: -140px;
        background: radial-gradient(circle, rgba(143,200,255,0.24), rgba(143,200,255,0.06) 48%, transparent 72%);
      }

      .glow-b {
        width: 360px;
        height: 210px;
        margin-left: -180px;
        margin-top: -105px;
        background: radial-gradient(circle, rgba(108,132,255,0.16), rgba(108,132,255,0.05) 50%, transparent 76%);
        filter: blur(42px);
      }

      .products-universe-core {
        width: 104px;
        height: 104px;
        margin-left: -52px;
        margin-top: -52px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 45% 42%, rgba(248,252,255,0.96), rgba(188,228,255,0.78) 22%, rgba(123,178,255,0.24) 42%, transparent 72%);
        box-shadow:
          0 0 34px rgba(143,200,255,0.24),
          inset 0 0 18px rgba(255,255,255,0.18);
        opacity: 0.92;
      }

      .products-universe-ring {
        border-radius: 50%;
        border: 1px solid rgba(191,230,255,0.12);
        box-shadow: 0 0 20px rgba(143,200,255,0.06), inset 0 0 16px rgba(191,230,255,0.04);
      }

      .ring-a {
        width: 260px;
        height: 126px;
        margin-left: -130px;
        margin-top: -63px;
      }

      .ring-b {
        width: 186px;
        height: 186px;
        margin-left: -93px;
        margin-top: -93px;
        border-color: rgba(160,205,255,0.09);
      }

      .ring-c {
        width: 340px;
        height: 152px;
        margin-left: -170px;
        margin-top: -76px;
        border-color: rgba(191,230,255,0.08);
      }

      @media (max-width: 760px) {
        .glow-a {
          width: 230px;
          height: 230px;
          margin-left: -115px;
          margin-top: -115px;
        }

        .glow-b {
          width: 300px;
          height: 176px;
          margin-left: -150px;
          margin-top: -88px;
        }

        .products-universe-core {
          width: 92px;
          height: 92px;
          margin-left: -46px;
          margin-top: -46px;
        }

        .ring-a {
          width: 220px;
          height: 108px;
          margin-left: -110px;
          margin-top: -54px;
        }

        .ring-b {
          width: 168px;
          height: 168px;
          margin-left: -84px;
          margin-top: -84px;
        }

        .ring-c {
          width: 290px;
          height: 132px;
          margin-left: -145px;
          margin-top: -66px;
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
