(() => {
  "use strict";

  const SELECTORS = {
    frame: "#home-compass-frame",
    stage: "#home-hero-stage",
    grid: "#home-orbit-grid",
    tokens: ".compass-token"
  };

  const CONFIG = {
    UNIVERSE_WIDTH_KM: 256000,
    UNIVERSE_HEIGHT_KM: 256000,
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    MOBILE_BREAKPOINT: 760,
    DPR_CAP: 2,

    STAR_COUNT: 120,
    PARTICLE_COUNT: 14,

    DESKTOP_ORBIT_WIDTH_KM: 124000,
    DESKTOP_ORBIT_HEIGHT_KM: 84000,
    MOBILE_ORBIT_WIDTH_KM: 92000,
    MOBILE_ORBIT_HEIGHT_KM: 108000,

    TOKEN_SCALE_MIN: 0.76,
    TOKEN_SCALE_MAX: 1.04,
    TOKEN_OPACITY_MIN: 0.58,
    TOKEN_OPACITY_MAX: 1,

    ORBIT_SPEED_RAD_MS: 0.00022,
    BODY_SPIN_DEG_MS: 0.014,

    WOBBLE_KM_X: 2600,
    WOBBLE_KM_Y: 1800,
    POINTER_KM_X: 3600,
    POINTER_KM_Y: 2800,

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

  if (state.reducedMotion) applyReducedMotionState();
  else start();

  function buildStage() {
    stage.innerHTML = `
      <canvas class="home-compass-canvas"></canvas>
      <div class="home-compass-glow glow-a"></div>
      <div class="home-compass-glow glow-b"></div>
      <div class="home-compass-core"></div>
      <div class="home-compass-ring ring-a"></div>
      <div class="home-compass-ring ring-b"></div>
      <div class="home-compass-ring ring-c"></div>
    `;

    injectRuntimeStyles();

    state.canvas = stage.querySelector(".home-compass-canvas");
    state.ctx = state.canvas.getContext("2d", { alpha: true });
  }

  function bindTokens() {
    const step = (Math.PI * 2) / tokenElements.length;
    const laneBands = [1.00, 0.92, 1.08, 0.96];

    state.tokens = tokenElements.map((el, index) => {
      const baseAngle = step * index - Math.PI / 2;
      const phase = baseAngle + index * 0.37;
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
      r: Math.random() * 1.25 + 0.25,
      a: Math.random() * 0.7 + 0.14,
      tw: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random()
    }));
  }

  function seedParticles() {
    state.particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radiusXKm: 14000 + Math.random() * getOrbitWidthKm() * 0.42,
      radiusYKm: 11000 + Math.random() * getOrbitHeightKm() * 0.42,
      size: 1.4 + Math.random() * 2.2,
      speed: 0.22 + Math.random() * 0.48,
      alpha: 0.08 + Math.random() * 0.14
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

    const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, orbitWidthPx * 1.02);
    gradient.addColorStop(0, "rgba(191,230,255,0.20)");
    gradient.addColorStop(0.28, "rgba(143,200,255,0.10)");
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

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsed * 0.0001);
    ctx.strokeStyle = "rgba(170,210,255,0.085)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidthPx * 0.48, orbitHeightPx * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidthPx * 0.76, orbitHeightPx * 0.76, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    state.particles.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00018 * particle.speed;
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
    const core = stage.querySelector(".home-compass-core");
    const ringA = stage.querySelector(".ring-a");
    const ringB = stage.querySelector(".ring-b");
    const ringC = stage.querySelector(".ring-c");

    const px = normalizePointerX();
    const py = normalizePointerY();

    glowA.style.transform = `translate3d(${px * 14}px, ${py * 10}px, 0) scale(${1 + Math.sin(elapsed * 0.0011) * 0.04})`;
    glowB.style.transform = `translate3d(${px * -12}px, ${py * -8}px, 0) scale(${1 + Math.cos(elapsed * 0.0012) * 0.03})`;
    core.style.transform = `translate3d(${px * 9}px, ${py * 7}px, 0) scale(${1 + Math.sin(elapsed * 0.001) * 0.02})`;
    ringA.style.transform = `translate3d(${px * 6}px, ${py * 4}px, 0) rotate(${elapsed * 0.008}deg)`;
    ringB.style.transform = `translate3d(${px * -5}px, ${py * 3}px, 0) rotate(${elapsed * -0.006}deg)`;
    ringC.style.transform = `translate3d(${px * 6}px, ${py * -5}px, 0) rotate(${elapsed * 0.009}deg)`;
  }

  function positionTokens(elapsed) {
    const orbitWidthKm = getOrbitWidthKm();
    const orbitHeightKm = getOrbitHeightKm();
    const pointerShiftXKm = normalizePointerX() * CONFIG.POINTER_KM_X;
    const pointerShiftYKm = normalizePointerY() * CONFIG.POINTER_KM_Y;

    state.tokens.forEach((token) => {
      const angle = token.baseAngle + elapsed * CONFIG.ORBIT_SPEED_RAD_MS;
      const depth = (Math.sin(angle) + 1) * 0.5;
      const band = token.laneBand;

      const wobbleXKm = Math.sin(elapsed * 0.00082 + token.phase) * CONFIG.WOBBLE_KM_X;
      const wobbleYKm = Math.cos(elapsed * 0.00076 + token.phase) * CONFIG.WOBBLE_KM_Y;

      const worldXKm = Math.cos(angle) * orbitWidthKm * 0.5 * band + wobbleXKm + pointerShiftXKm;
      const worldYKm = Math.sin(angle) * orbitHeightKm * 0.5 * band + wobbleYKm + pointerShiftYKm;

      const projectedXPx = universeKmToPxX(worldXKm);
      const projectedYPx = universeKmToPxY(worldYKm);

      const scale = CONFIG.TOKEN_SCALE_MIN + depth * (CONFIG.TOKEN_SCALE_MAX - CONFIG.TOKEN_SCALE_MIN);
      const opacity = CONFIG.TOKEN_OPACITY_MIN + depth * (CONFIG.TOKEN_OPACITY_MAX - CONFIG.TOKEN_OPACITY_MIN);

      const tiltY = Math.cos(angle) * 13 + normalizePointerX() * 5;
      const tiltX = Math.sin(angle) * 10 + normalizePointerY() * 4;
      const bodySpin = elapsed * CONFIG.BODY_SPIN_DEG_MS + token.baseAngle * 10;

      token.el.style.transform = `
        translate3d(${projectedXPx}px, ${projectedYPx}px, ${depth > 0.5 ? 12 : -4}px)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
      token.el.style.opacity = String(opacity);
      token.el.style.zIndex = String(20 + Math.round(depth * 60));

      if (token.diamond) token.diamond.style.transform = `rotateZ(${bodySpin}deg)`;
      if (token.labelWrap) token.labelWrap.style.transform = `rotateZ(${-bodySpin}deg) translateZ(12px)`;

      const face = token.el.querySelector(".token-face");
      if (face) face.style.filter = `brightness(${0.82 + depth * 0.28})`;
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

    stage.querySelectorAll(".home-compass-glow,.home-compass-core,.home-compass-ring")
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
    if (document.getElementById("home-compass-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "home-compass-runtime-style";
    style.textContent = `
      .home-compass-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.96;
      }

      .home-compass-glow,
      .home-compass-core,
      .home-compass-ring {
        position: absolute;
        left: 50%;
        top: 52%;
        transform: translate3d(0,0,0);
        will-change: transform, opacity;
      }

      .home-compass-glow {
        border-radius: 999px;
        filter: blur(32px);
        opacity: 0.38;
      }

      .glow-a {
        width: 250px;
        height: 250px;
        margin-left: -125px;
        margin-top: -125px;
        background: radial-gradient(circle, rgba(143,200,255,0.24), rgba(143,200,255,0.06) 48%, transparent 72%);
      }

      .glow-b {
        width: 320px;
        height: 190px;
        margin-left: -160px;
        margin-top: -95px;
        background: radial-gradient(circle, rgba(108,132,255,0.16), rgba(108,132,255,0.05) 50%, transparent 76%);
        filter: blur(40px);
      }

      .home-compass-core {
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

      .home-compass-ring {
        border-radius: 50%;
        border: 1px solid rgba(191,230,255,0.12);
        box-shadow: 0 0 20px rgba(143,200,255,0.06), inset 0 0 16px rgba(191,230,255,0.04);
      }

      .ring-a {
        width: 236px;
        height: 116px;
        margin-left: -118px;
        margin-top: -58px;
      }

      .ring-b {
        width: 174px;
        height: 174px;
        margin-left: -87px;
        margin-top: -87px;
        border-color: rgba(160,205,255,0.09);
      }

      .ring-c {
        width: 304px;
        height: 136px;
        margin-left: -152px;
        margin-top: -68px;
        border-color: rgba(191,230,255,0.08);
      }

      @media (max-width: 760px) {
        .glow-a {
          width: 220px;
          height: 220px;
          margin-left: -110px;
          margin-top: -110px;
        }

        .glow-b {
          width: 280px;
          height: 168px;
          margin-left: -140px;
          margin-top: -84px;
        }

        .home-compass-core {
          width: 92px;
          height: 92px;
          margin-left: -46px;
          margin-top: -46px;
        }

        .ring-a {
          width: 206px;
          height: 102px;
          margin-left: -103px;
          margin-top: -51px;
        }

        .ring-b {
          width: 158px;
          height: 158px;
          margin-left: -79px;
          margin-top: -79px;
        }

        .ring-c {
          width: 270px;
          height: 122px;
          margin-left: -135px;
          margin-top: -61px;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
