(() => {
  "use strict";

  const SELECTORS = {
    stage: "#products-hero-stage",
    grid: "#products-lane-grid",
    cards: ".lane-card"
  };

  const CONFIG = {
    MOBILE_BREAKPOINT: 760,
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    DPR_CAP: 2,
    STAR_COUNT: 150,
    PARTICLE_COUNT: 20,
    ORBIT_X_DESKTOP: 210,
    ORBIT_Y_DESKTOP: 94,
    ORBIT_X_MOBILE: 128,
    ORBIT_Y_MOBILE: 188,
    CARD_SCALE_MIN: 0.88,
    CARD_SCALE_MAX: 1.08,
    ROTATION_SPEED: 0.00048,
    WOBBLE_X: 18,
    WOBBLE_Y: 12,
    POINTER_SHIFT_X: 18,
    POINTER_SHIFT_Y: 14,
    GRID_CENTER_Y_RATIO: 0.50,
    GRID_CENTER_X_RATIO: 0.50
  };

  const state = {
    mounted: false,
    reducedMotion: false,
    rafId: 0,
    width: 0,
    height: 0,
    dpr: 1,
    startTs: 0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    stars: [],
    particles: [],
    cards: []
  };

  const stage = document.querySelector(SELECTORS.stage);
  const grid = document.querySelector(SELECTORS.grid);
  const cards = Array.from(document.querySelectorAll(SELECTORS.cards));

  if (!stage || !grid || cards.length === 0) {
    return;
  }

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);
  state.reducedMotion = reducedMotionMedia.matches;

  buildStage();
  bindCards();
  resize();
  seedStars();
  seedParticles();
  bindEvents();

  if (state.reducedMotion) {
    applyReducedMotionLayout();
  } else {
    start();
  }

  function buildStage() {
    stage.innerHTML = `
      <canvas class="products-euclid-canvas"></canvas>
      <div class="products-glow glow-a"></div>
      <div class="products-glow glow-b"></div>
      <div class="products-core"></div>
      <div class="products-ring ring-a"></div>
      <div class="products-ring ring-b"></div>
      <div class="products-ring ring-c"></div>
    `;

    injectStyles();

    const canvas = stage.querySelector(".products-euclid-canvas");
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
  }

  function bindCards() {
    const step = (Math.PI * 2) / cards.length;

    state.cards = cards.map((card, index) => {
      const baseAngle = step * index;
      return {
        el: card,
        anchor: card.querySelector("a"),
        baseAngle,
        phase: baseAngle + index * 0.37
      };
    });
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(420, Math.floor(rect.height));
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
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.7 + 0.15,
      tw: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2
    }));
  }

  function seedParticles() {
    state.particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 28 + Math.random() * getOrbitX() * 0.95,
      size: 1.8 + Math.random() * 3.2,
      speed: 0.3 + Math.random() * 0.7,
      drift: 0.4 + Math.random() * 1.2,
      alpha: 0.12 + Math.random() * 0.28
    }));
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
      card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
      card.addEventListener("focusin", () => card.classList.add("is-hovered"));
      card.addEventListener("focusout", () => card.classList.remove("is-hovered"));
    });

    window.addEventListener(
      "beforeunload",
      () => {
        stop();
      },
      { once: true }
    );
  }

  function onResize() {
    resize();
    seedStars();
    seedParticles();

    if (state.reducedMotion) {
      applyReducedMotionLayout();
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
      applyReducedMotionLayout();
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
    drawStage(elapsed);
    positionCards(elapsed);
    moveRings(elapsed);
    state.rafId = requestAnimationFrame(tick);
  }

  function drawStage(elapsed) {
    const ctx = state.ctx;
    const cx = state.width * 0.5;
    const cy = state.height * 0.46;

    ctx.clearRect(0, 0, state.width, state.height);

    const gradient = ctx.createRadialGradient(cx, cy, 22, cx, cy, getOrbitX() * 1.7);
    gradient.addColorStop(0, "rgba(191,230,255,0.16)");
    gradient.addColorStop(0.26, "rgba(143,200,255,0.10)");
    gradient.addColorStop(0.56, "rgba(112,164,255,0.05)");
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
    ctx.rotate(elapsed * 0.00018);

    ctx.strokeStyle = "rgba(170,210,255,0.07)";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, getOrbitX() * (0.42 + i * 0.14), getOrbitY() * (0.46 + i * 0.12), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    state.particles.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00034 * particle.speed;
      const x = cx + Math.cos(angle) * particle.radius;
      const y = cy + Math.sin(angle) * particle.radius * (getOrbitY() / Math.max(getOrbitX(), 1));

      ctx.beginPath();
      ctx.fillStyle = `rgba(175,225,255,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function positionCards(elapsed) {
    const orbitX = getOrbitX();
    const orbitY = getOrbitY();
    const px = getPointerShiftX();
    const py = getPointerShiftY();

    state.cards.forEach((card, index) => {
      const angle = card.baseAngle + elapsed * CONFIG.ROTATION_SPEED;
      const depth = (Math.sin(angle) + 1) * 0.5;
      const wobbleX = Math.sin(elapsed * 0.0014 + card.phase) * CONFIG.WOBBLE_X;
      const wobbleY = Math.cos(elapsed * 0.0011 + card.phase) * CONFIG.WOBBLE_Y;

      const x = Math.cos(angle) * orbitX + wobbleX + px * CONFIG.POINTER_SHIFT_X;
      const y = Math.sin(angle) * orbitY + wobbleY + py * CONFIG.POINTER_SHIFT_Y;

      const scale = CONFIG.CARD_SCALE_MIN + depth * (CONFIG.CARD_SCALE_MAX - CONFIG.CARD_SCALE_MIN);
      const opacity = 0.56 + depth * 0.44;
      const tiltY = Math.cos(angle) * 10 + px * 10;
      const tiltX = Math.sin(angle) * 7 + py * 8;

      card.el.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
      card.el.style.opacity = String(opacity);
      card.el.style.zIndex = String(20 + Math.round(depth * 50));

      if (card.anchor) {
        card.anchor.style.boxShadow =
          depth > 0.66
            ? "0 12px 40px rgba(0,0,0,0.30), 0 0 0 1px rgba(191,230,255,0.08) inset"
            : "0 8px 24px rgba(0,0,0,0.22), 0 0 0 1px rgba(191,230,255,0.05) inset";
      }
    });

    state.cards
      .slice()
      .sort((a, b) => {
        const za = Number(a.el.style.zIndex || 0);
        const zb = Number(b.el.style.zIndex || 0);
        return za - zb;
      })
      .forEach((card) => {
        grid.appendChild(card.el);
      });
  }

  function moveRings(elapsed) {
    const glowA = stage.querySelector(".glow-a");
    const glowB = stage.querySelector(".glow-b");
    const ringA = stage.querySelector(".ring-a");
    const ringB = stage.querySelector(".ring-b");
    const ringC = stage.querySelector(".ring-c");
    const core = stage.querySelector(".products-core");

    const px = getPointerShiftX();
    const py = getPointerShiftY();

    glowA.style.transform = `translate3d(${px * 22}px, ${py * 16}px, 0) scale(${1 + Math.sin(elapsed * 0.0011) * 0.05})`;
    glowB.style.transform = `translate3d(${px * -18}px, ${py * -12}px, 0) scale(${1 + Math.cos(elapsed * 0.0013) * 0.04})`;
    core.style.transform = `translate3d(${px * 16}px, ${py * 12}px, 0) scale(${1 + Math.sin(elapsed * 0.0012) * 0.03})`;

    ringA.style.transform = `translate3d(${px * 10}px, ${py * 8}px, 0) rotate(${elapsed * 0.018}deg)`;
    ringB.style.transform = `translate3d(${px * -8}px, ${py * 6}px, 0) rotate(${elapsed * -0.013}deg)`;
    ringC.style.transform = `translate3d(${px * 12}px, ${py * -10}px, 0) rotate(${elapsed * 0.024}deg)`;
  }

  function applyReducedMotionLayout() {
    state.cards.forEach((card) => {
      card.el.style.transform = "none";
      card.el.style.opacity = "1";
      card.el.style.zIndex = "1";
    });

    stage.querySelectorAll(".products-glow,.products-core,.products-ring").forEach((node) => {
      node.style.transform = "translate3d(0,0,0)";
    });

    drawStage(0);
  }

  function getOrbitX() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.ORBIT_X_MOBILE
      : CONFIG.ORBIT_X_DESKTOP;
  }

  function getOrbitY() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.ORBIT_Y_MOBILE
      : CONFIG.ORBIT_Y_DESKTOP;
  }

  function getPointerShiftX() {
    if (!state.pointerActive) {
      return 0;
    }
    const n = (state.pointerX / Math.max(window.innerWidth, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function getPointerShiftY() {
    if (!state.pointerActive) {
      return 0;
    }
    const n = (state.pointerY / Math.max(window.innerHeight, 1)) * 2 - 1;
    return clamp(n, -1, 1);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function injectStyles() {
    if (document.getElementById("products-euclid-runtime-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "products-euclid-runtime-style";
    style.textContent = `
      .products-euclid-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.96;
      }

      .products-glow,
      .products-core,
      .products-ring {
        position: absolute;
        left: 50%;
        top: 46%;
        transform: translate3d(0,0,0);
        will-change: transform, opacity;
      }

      .products-glow {
        border-radius: 999px;
        filter: blur(34px);
        opacity: 0.42;
      }

      .glow-a {
        width: 340px;
        height: 340px;
        margin-left: -170px;
        margin-top: -170px;
        background: radial-gradient(circle, rgba(143,200,255,0.24), rgba(143,200,255,0.06) 48%, transparent 72%);
      }

      .glow-b {
        width: 430px;
        height: 250px;
        margin-left: -215px;
        margin-top: -125px;
        background: radial-gradient(circle, rgba(108,132,255,0.16), rgba(108,132,255,0.05) 50%, transparent 76%);
        filter: blur(48px);
      }

      .products-core {
        width: 118px;
        height: 118px;
        margin-left: -59px;
        margin-top: -59px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 45% 42%, rgba(248,252,255,0.96), rgba(188,228,255,0.78) 22%, rgba(123,178,255,0.24) 42%, transparent 72%);
        box-shadow:
          0 0 42px rgba(143,200,255,0.24),
          inset 0 0 24px rgba(255,255,255,0.18);
        opacity: 0.9;
      }

      .products-ring {
        border-radius: 50%;
        border: 1px solid rgba(191,230,255,0.16);
        box-shadow: 0 0 24px rgba(143,200,255,0.08), inset 0 0 20px rgba(191,230,255,0.05);
      }

      .ring-a {
        width: 360px;
        height: 160px;
        margin-left: -180px;
        margin-top: -80px;
      }

      .ring-b {
        width: 248px;
        height: 248px;
        margin-left: -124px;
        margin-top: -124px;
        border-color: rgba(160,205,255,0.10);
      }

      .ring-c {
        width: 480px;
        height: 200px;
        margin-left: -240px;
        margin-top: -100px;
        border-color: rgba(191,230,255,0.09);
      }

      .lane-card.is-hovered {
        filter: brightness(1.06);
      }

      .lane-card.is-hovered a {
        border-color: rgba(191,230,255,0.28);
      }

      @media (max-width: 900px) {
        .ring-a {
          width: 300px;
          height: 134px;
          margin-left: -150px;
          margin-top: -67px;
        }

        .ring-c {
          width: 390px;
          height: 170px;
          margin-left: -195px;
          margin-top: -85px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .products-glow,
        .products-core,
        .products-ring,
        .lane-card {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }
})();
