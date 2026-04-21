/* /products/index.js
   Products page runtime
   Ownership:
   - HTML owns navigation and hard backlinks
   - This file owns visual motion only
   - Safe to fail without breaking route access
*/

(() => {
  "use strict";

  const CONFIG = {
    STAR_COUNT: 140,
    PARTICLE_COUNT: 18,
    FLOAT_COUNT: 5,
    MOBILE_BREAKPOINT: 760,
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    DPR_CAP: 2,
    BASE_RADIUS: 150,
    MOBILE_RADIUS: 108,
    CARD_ORBIT_OFFSET: 0.9,
    CARD_WOBBLE_X: 14,
    CARD_WOBBLE_Y: 10,
    CARD_TILT_X: 8,
    CARD_TILT_Y: 10,
    BG_ROTATION_SPEED: 0.00022,
    RING_SPEED: 0.00052,
    CARD_SPEED: 0.00068,
    STAR_SPEED_MIN: 0.015,
    STAR_SPEED_MAX: 0.08,
    PARTICLE_SPEED_MIN: 0.2,
    PARTICLE_SPEED_MAX: 0.55
  };

  const state = {
    rafId: 0,
    mounted: false,
    reducedMotion: false,
    width: 0,
    height: 0,
    dpr: 1,
    timeStart: 0,
    lastTs: 0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    stars: [],
    particles: [],
    cards: [],
    floaters: [],
    cleanupFns: []
  };

  const root = document.documentElement;
  const page = document.body;
  const laneCards = Array.from(document.querySelectorAll(".lane-card"));
  const heroPanel = document.querySelector(".hero-panel");

  if (!page || !heroPanel || laneCards.length === 0) {
    return;
  }

  injectRuntimeStyles();

  const stage = createStage();
  const canvas = stage.querySelector("canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    return;
  }

  heroPanel.appendChild(stage);

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);

  init();

  function init() {
    state.reducedMotion = reducedMotionMedia.matches;
    state.pointerX = window.innerWidth * 0.5;
    state.pointerY = window.innerHeight * 0.34;

    setStageOwnership();
    buildCardData();
    buildFloaters();
    resize();
    seedStars();
    seedParticles();
    bindEvents();
    start();
  }

  function setStageOwnership() {
    heroPanel.style.position = "relative";
    heroPanel.style.isolation = "isolate";

    Array.from(heroPanel.children).forEach((child) => {
      if (child !== stage) {
        child.style.position = "relative";
        child.style.zIndex = "2";
      }
    });

    laneCards.forEach((card, index) => {
      card.dataset.orbitIndex = String(index);
      const anchor = card.querySelector("a");
      if (anchor) {
        anchor.style.position = "relative";
        anchor.style.zIndex = "2";
      }
    });
  }

  function createStage() {
    const el = document.createElement("div");
    el.className = "products-runtime-stage";
    el.setAttribute("aria-hidden", "true");

    el.innerHTML = `
      <canvas class="products-runtime-canvas"></canvas>
      <div class="products-runtime-glow products-runtime-glow-a"></div>
      <div class="products-runtime-glow products-runtime-glow-b"></div>
      <div class="products-runtime-core"></div>
      <div class="products-runtime-ring products-runtime-ring-a"></div>
      <div class="products-runtime-ring products-runtime-ring-b"></div>
      <div class="products-runtime-ring products-runtime-ring-c"></div>
    `;

    return el;
  }

  function buildCardData() {
    const total = laneCards.length;
    const step = (Math.PI * 2) / total;

    state.cards = laneCards.map((card, index) => {
      const angle = step * index;
      const phase = angle + index * 0.33;
      card.classList.add("products-orbit-card");

      return {
        el: card,
        anchor: card.querySelector("a"),
        angle,
        phase,
        depth: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1
      };
    });
  }

  function buildFloaters() {
    state.floaters = Array.from({ length: CONFIG.FLOAT_COUNT }, (_, i) => {
      const node = document.createElement("div");
      node.className = "products-runtime-floater";
      node.style.setProperty("--size", `${48 + i * 18}px`);
      node.style.setProperty("--delay", `${i * 0.7}s`);
      stage.appendChild(node);

      return {
        el: node,
        seed: i * 1.7 + 0.6
      };
    });
  }

  function seedStars() {
    state.stars = Array.from({ length: CONFIG.STAR_COUNT }, () => {
      return {
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.8 + 0.15,
        tw: Math.random() * 6.28,
        speed: randomBetween(CONFIG.STAR_SPEED_MIN, CONFIG.STAR_SPEED_MAX)
      };
    });
  }

  function seedParticles() {
    state.particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = randomBetween(30, getOrbitRadius() * 0.9);

      return {
        angle,
        radius,
        size: randomBetween(1.8, 4.2),
        speed: randomBetween(CONFIG.PARTICLE_SPEED_MIN, CONFIG.PARTICLE_SPEED_MAX),
        drift: randomBetween(0.2, 1.2),
        alpha: randomBetween(0.12, 0.5)
      };
    });
  }

  function bindEvents() {
    const onResize = () => {
      resize();
      seedStars();
    };

    const onPointerMove = (event) => {
      state.pointerActive = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
    };

    const onPointerLeave = () => {
      state.pointerActive = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const onReducedMotionChange = (event) => {
      state.reducedMotion = event.matches;
      if (state.reducedMotion) {
        applyReducedMotionState();
      } else {
        resetCardTransitions();
        start();
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);

    laneCards.forEach((card) => {
      const enter = () => card.classList.add("is-hovered");
      const leave = () => card.classList.remove("is-hovered");
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      card.addEventListener("focusin", enter);
      card.addEventListener("focusout", leave);

      state.cleanupFns.push(() => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
        card.removeEventListener("focusin", enter);
        card.removeEventListener("focusout", leave);
      });
    });

    state.cleanupFns.push(() => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionMedia.removeEventListener("change", onReducedMotionChange);
    });
  }

  function resize() {
    const rect = heroPanel.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(420, Math.floor(rect.height));
    state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function start() {
    if (state.mounted) {
      return;
    }

    state.mounted = true;
    state.timeStart = performance.now();
    state.lastTs = state.timeStart;

    if (state.reducedMotion) {
      applyReducedMotionState();
      return;
    }

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

    const elapsed = ts - state.timeStart;
    const dt = Math.min(32, ts - state.lastTs);
    state.lastTs = ts;

    drawBackground(elapsed, dt);
    animateRings(elapsed);
    animateCards(elapsed);
    animateFloaters(elapsed);

    state.rafId = requestAnimationFrame(tick);
  }

  function drawBackground(elapsed) {
    ctx.clearRect(0, 0, state.width, state.height);

    const cx = state.width * 0.5;
    const cy = state.height * 0.46;

    const gradient = ctx.createRadialGradient(cx, cy, 24, cx, cy, getOrbitRadius() * 1.45);
    gradient.addColorStop(0, "rgba(191,230,255,0.18)");
    gradient.addColorStop(0.28, "rgba(143,200,255,0.11)");
    gradient.addColorStop(0.58, "rgba(112,164,255,0.06)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    state.stars.forEach((star) => {
      const twinkle = 0.55 + Math.sin(elapsed * 0.001 * star.speed + star.tw) * 0.45;
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,238,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const rotation = elapsed * CONFIG.BG_ROTATION_SPEED;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    ctx.strokeStyle = "rgba(170,210,255,0.07)";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, getOrbitRadius() * (0.45 + i * 0.16), getOrbitRadius() * (0.14 + i * 0.06), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    state.particles.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00035 * particle.speed;
      const radius = particle.radius + Math.sin(elapsed * 0.001 * particle.drift + particle.angle) * 10;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.42;

      ctx.beginPath();
      ctx.fillStyle = `rgba(175,225,255,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animateRings(elapsed) {
    const ringA = stage.querySelector(".products-runtime-ring-a");
    const ringB = stage.querySelector(".products-runtime-ring-b");
    const ringC = stage.querySelector(".products-runtime-ring-c");
    const core = stage.querySelector(".products-runtime-core");
    const glowA = stage.querySelector(".products-runtime-glow-a");
    const glowB = stage.querySelector(".products-runtime-glow-b");

    const px = getPointerShiftX();
    const py = getPointerShiftY();

    ringA.style.transform = `translate3d(${px * 10}px, ${py * 8}px, 0) rotate(${elapsed * CONFIG.RING_SPEED}rad)`;
    ringB.style.transform = `translate3d(${px * -8}px, ${py * 6}px, 0) rotate(${elapsed * -CONFIG.RING_SPEED * 0.7}rad)`;
    ringC.style.transform = `translate3d(${px * 12}px, ${py * -10}px, 0) rotate(${elapsed * CONFIG.RING_SPEED * 1.12}rad)`;

    core.style.transform = `translate3d(${px * 18}px, ${py * 16}px, 0) scale(${1 + Math.sin(elapsed * 0.0012) * 0.03})`;
    glowA.style.transform = `translate3d(${px * 22}px, ${py * 16}px, 0) scale(${1 + Math.sin(elapsed * 0.0011) * 0.05})`;
    glowB.style.transform = `translate3d(${px * -18}px, ${py * -12}px, 0) scale(${1 + Math.cos(elapsed * 0.0013) * 0.04})`;
  }

  function animateCards(elapsed) {
    const orbit = getOrbitRadius();
    const cx = state.width * 0.5;
    const cy = state.height * 0.50;
    const px = getPointerShiftX();
    const py = getPointerShiftY();

    state.cards.forEach((card, index) => {
      const angle = card.angle + elapsed * CONFIG.CARD_SPEED + index * CONFIG.CARD_ORBIT_OFFSET;
      const wave = Math.sin(elapsed * 0.0014 + card.phase);
      const depth = (Math.sin(angle) + 1) * 0.5;
      const x = Math.cos(angle) * orbit + wave * CONFIG.CARD_WOBBLE_X + px * 18;
      const y = Math.sin(angle) * orbit * 0.33 + Math.cos(angle * 1.4) * CONFIG.CARD_WOBBLE_Y + py * 14;
      const scale = 0.9 + depth * 0.18;
      const opacity = 0.52 + depth * 0.48;
      const tiltY = Math.cos(angle) * CONFIG.CARD_TILT_Y + px * 12;
      const tiltX = Math.sin(angle) * CONFIG.CARD_TILT_X + py * 10;

      card.depth = depth;
      card.x = cx + x;
      card.y = cy + y;
      card.scale = scale;
      card.opacity = opacity;

      card.el.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
      card.el.style.opacity = String(opacity);
      card.el.style.zIndex = String(20 + Math.round(depth * 40));

      if (card.anchor) {
        card.anchor.style.boxShadow = depth > 0.65
          ? "0 12px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(191,230,255,0.08) inset"
          : "0 8px 24px rgba(0,0,0,0.20), 0 0 0 1px rgba(191,230,255,0.05) inset";
      }
    });

    state.cards
      .slice()
      .sort((a, b) => a.depth - b.depth)
      .forEach((card) => {
        if (card.el.parentNode) {
          card.el.parentNode.appendChild(card.el);
        }
      });
  }

  function animateFloaters(elapsed) {
    const cx = state.width * 0.5;
    const cy = state.height * 0.46;

    state.floaters.forEach((floater, index) => {
      const t = elapsed * 0.00035 + floater.seed;
      const orbit = getOrbitRadius() * (0.48 + index * 0.13);
      const x = Math.cos(t * (0.8 + index * 0.07)) * orbit;
      const y = Math.sin(t * (1 + index * 0.09)) * orbit * 0.36;
      const scale = 0.88 + Math.sin(t * 1.8) * 0.16;
      floater.el.style.transform = `translate3d(${cx + x}px, ${cy + y}px, 0) scale(${scale})`;
      floater.el.style.opacity = `${0.15 + (index / state.floaters.length) * 0.14}`;
    });
  }

  function applyReducedMotionState() {
    stop();

    state.cards.forEach((card, index) => {
      card.el.style.transition = "transform 240ms ease, opacity 240ms ease";
      card.el.style.transform = "none";
      card.el.style.opacity = "1";
      card.el.style.zIndex = String(10 + index);
    });

    const ringA = stage.querySelector(".products-runtime-ring-a");
    const ringB = stage.querySelector(".products-runtime-ring-b");
    const ringC = stage.querySelector(".products-runtime-ring-c");
    const core = stage.querySelector(".products-runtime-core");
    const glowA = stage.querySelector(".products-runtime-glow-a");
    const glowB = stage.querySelector(".products-runtime-glow-b");

    [ringA, ringB, ringC, core, glowA, glowB].forEach((node) => {
      node.style.transform = "translate3d(0,0,0)";
    });

    drawBackground(0);
  }

  function resetCardTransitions() {
    state.cards.forEach((card) => {
      card.el.style.transition = "";
    });
  }

  function getOrbitRadius() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT ? CONFIG.MOBILE_RADIUS : CONFIG.BASE_RADIUS;
  }

  function getPointerShiftX() {
    if (!state.pointerActive) {
      return 0;
    }
    const normalized = (state.pointerX / Math.max(window.innerWidth, 1)) * 2 - 1;
    return clamp(normalized, -1, 1);
  }

  function getPointerShiftY() {
    if (!state.pointerActive) {
      return 0;
    }
    const normalized = (state.pointerY / Math.max(window.innerHeight, 1)) * 2 - 1;
    return clamp(normalized, -1, 1);
  }

  function injectRuntimeStyles() {
    if (document.getElementById("products-runtime-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "products-runtime-style";
    style.textContent = `
      .products-runtime-stage {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
        border-radius: inherit;
      }

      .products-runtime-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.95;
      }

      .products-runtime-glow,
      .products-runtime-core,
      .products-runtime-ring,
      .products-runtime-floater {
        position: absolute;
        left: 50%;
        top: 46%;
        transform: translate3d(0,0,0);
        will-change: transform, opacity;
      }

      .products-runtime-glow {
        border-radius: 999px;
        filter: blur(32px);
        opacity: 0.45;
      }

      .products-runtime-glow-a {
        width: 320px;
        height: 320px;
        margin-left: -160px;
        margin-top: -160px;
        background: radial-gradient(circle, rgba(143,200,255,0.26), rgba(143,200,255,0.06) 48%, transparent 72%);
      }

      .products-runtime-glow-b {
        width: 420px;
        height: 240px;
        margin-left: -210px;
        margin-top: -120px;
        background: radial-gradient(circle, rgba(108,132,255,0.16), rgba(108,132,255,0.05) 50%, transparent 76%);
        filter: blur(48px);
      }

      .products-runtime-core {
        width: 112px;
        height: 112px;
        margin-left: -56px;
        margin-top: -56px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 45% 42%, rgba(248,252,255,0.96), rgba(188,228,255,0.78) 22%, rgba(123,178,255,0.24) 42%, transparent 72%);
        box-shadow:
          0 0 42px rgba(143,200,255,0.24),
          inset 0 0 24px rgba(255,255,255,0.18);
        opacity: 0.9;
      }

      .products-runtime-ring {
        border-radius: 50%;
        border: 1px solid rgba(191,230,255,0.16);
        box-shadow: 0 0 24px rgba(143,200,255,0.08), inset 0 0 20px rgba(191,230,255,0.05);
      }

      .products-runtime-ring-a {
        width: 340px;
        height: 140px;
        margin-left: -170px;
        margin-top: -70px;
      }

      .products-runtime-ring-b {
        width: 240px;
        height: 240px;
        margin-left: -120px;
        margin-top: -120px;
        border-color: rgba(160,205,255,0.10);
      }

      .products-runtime-ring-c {
        width: 460px;
        height: 180px;
        margin-left: -230px;
        margin-top: -90px;
        border-color: rgba(191,230,255,0.09);
      }

      .products-runtime-floater {
        width: var(--size);
        height: var(--size);
        margin-left: calc(var(--size) / -2);
        margin-top: calc(var(--size) / -2);
        border-radius: 50%;
        background:
          radial-gradient(circle at 50% 45%, rgba(240,248,255,0.18), rgba(143,200,255,0.08) 42%, transparent 72%);
        border: 1px solid rgba(191,230,255,0.08);
        filter: blur(1px);
      }

      .lane-grid {
        position: relative;
        min-height: 540px;
        perspective: 1400px;
        transform-style: preserve-3d;
        display: block;
      }

      .products-orbit-card {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(46%, 420px);
        max-width: 420px;
        transform-style: preserve-3d;
        will-change: transform, opacity;
        transition: box-shadow 180ms ease, filter 180ms ease;
      }

      .products-orbit-card a {
        backdrop-filter: blur(10px);
        background:
          radial-gradient(circle at top right, rgba(143,200,255,0.12), transparent 36%),
          linear-gradient(180deg, rgba(11,23,48,0.80), rgba(8,18,35,0.90));
      }

      .products-orbit-card.is-hovered {
        filter: brightness(1.06);
      }

      .products-orbit-card.is-hovered a {
        border-color: rgba(191,230,255,0.28);
      }

      @media (max-width: 900px) {
        .lane-grid {
          min-height: 760px;
        }

        .products-orbit-card {
          width: min(78vw, 420px);
        }

        .products-runtime-ring-a {
          width: 280px;
          height: 120px;
          margin-left: -140px;
          margin-top: -60px;
        }

        .products-runtime-ring-c {
          width: 360px;
          height: 150px;
          margin-left: -180px;
          margin-top: -75px;
        }
      }

      @media (max-width: 640px) {
        .lane-grid {
          min-height: 900px;
        }

        .products-orbit-card {
          width: min(86vw, 360px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .products-runtime-stage,
        .products-orbit-card {
          animation: none !important;
          transition: none !important;
        }

        .lane-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          min-height: auto;
          perspective: none;
        }

        .products-orbit-card {
          position: relative;
          left: auto;
          top: auto;
          width: auto;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  window.addEventListener("beforeunload", () => {
    stop();
    state.cleanupFns.forEach((fn) => fn());
    state.cleanupFns.length = 0;
  }, { once: true });
})();
