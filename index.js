(() => {
  "use strict";

  const SELECTORS = {
    frame: "#home-solar-frame",
    stage: "#home-hero-stage",
    grid: "#home-orbit-grid",
    bodies: ".route-body"
  };

  const CONFIG = {
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    MOBILE_BREAKPOINT: 760,
    DPR_CAP: 2,

    STAR_COUNT: 140,
    DUST_COUNT: 20,

    DESKTOP_CENTER_X_RATIO: 0.5,
    DESKTOP_CENTER_Y_RATIO: 0.56,
    MOBILE_CENTER_X_RATIO: 0.5,
    MOBILE_CENTER_Y_RATIO: 0.53,

    DESKTOP_ORBIT_A_INNER: 108,
    DESKTOP_ORBIT_B_INNER: 72,
    DESKTOP_ORBIT_A_OUTER: 182,
    DESKTOP_ORBIT_B_OUTER: 124,
    MOBILE_ORBIT_A_INNER: 88,
    MOBILE_ORBIT_B_INNER: 60,
    MOBILE_ORBIT_A_OUTER: 142,
    MOBILE_ORBIT_B_OUTER: 106,

    PLANET_SCALE_MIN: 0.78,
    PLANET_SCALE_MAX: 1.06,
    PLANET_OPACITY_MIN: 0.58,
    PLANET_OPACITY_MAX: 1.0,

    ORBIT_SPEED_INNER: 0.00032,
    ORBIT_SPEED_OUTER: 0.00018,
    POINTER_SHIFT_X: 10,
    POINTER_SHIFT_Y: 8
  };

  const PLANETS = {
    explore: {
      lane: "inner",
      angle: -Math.PI / 2,
      size: 70,
      spin: 0.014,
      labelColor: "#eef5ff"
    },
    products: {
      lane: "inner",
      angle: 0.88,
      size: 84,
      spin: 0.010,
      labelColor: "#fff6eb"
    },
    gauges: {
      lane: "outer",
      angle: -0.18,
      size: 92,
      spin: 0.008,
      labelColor: "#edf4ff"
    },
    laws: {
      lane: "outer",
      angle: 2.18,
      size: 78,
      spin: -0.009,
      labelColor: "#fff0ef"
    },
    vault: {
      lane: "vault",
      angle: Math.PI / 2,
      size: 68,
      spin: 0.005,
      labelColor: "#fff7da"
    }
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
    dust: [],
    bodies: [],
    canvas: null,
    ctx: null
  };

  const frame = document.querySelector(SELECTORS.frame);
  const stage = document.querySelector(SELECTORS.stage);
  const grid = document.querySelector(SELECTORS.grid);
  const bodyElements = Array.from(document.querySelectorAll(SELECTORS.bodies));

  if (!frame || !stage || !grid || bodyElements.length === 0) return;

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);
  state.reducedMotion = reducedMotionMedia.matches;

  buildStage();
  bindBodies();
  resize();
  seedStars();
  seedDust();
  bindEvents();

  if (state.reducedMotion) {
    applyReducedMotionState();
  } else {
    start();
  }

  function buildStage() {
    stage.innerHTML = `
      <canvas class="home-solar-canvas"></canvas>
      <div class="home-solar-glow glow-a"></div>
      <div class="home-solar-glow glow-b"></div>
      <div class="home-solar-atmosphere"></div>
    `;

    injectRuntimeStyles();

    state.canvas = stage.querySelector(".home-solar-canvas");
    if (!state.canvas) return;

    state.ctx = state.canvas.getContext("2d", { alpha: true });
  }

  function bindBodies() {
    state.bodies = bodyElements.map((el) => {
      const key = String(el.dataset.planet || "").trim().toLowerCase();
      const config = PLANETS[key];

      if (!config) return null;

      const body = el.querySelector(".planet-body");
      const label = el.querySelector(".planet-label");

      if (label) {
        label.style.color = config.labelColor;
      }

      el.addEventListener("mouseenter", () => el.classList.add("is-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
      el.addEventListener("focusin", () => el.classList.add("is-active"));
      el.addEventListener("focusout", () => el.classList.remove("is-active"));

      return {
        key,
        el,
        body,
        config
      };
    }).filter(Boolean);
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    frame.addEventListener("pointermove", onPointerMove, { passive: true });
    frame.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);
    window.addEventListener("beforeunload", stop, { once: true });
  }

  function onResize() {
    resize();
    seedStars();
    seedDust();
    if (state.reducedMotion) {
      applyReducedMotionState();
    }
  }

  function onPointerMove(event) {
    const rect = frame.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    state.pointerActive = true;
    state.pointerX = clamp((localX / Math.max(1, rect.width)) * 2 - 1, -1, 1);
    state.pointerY = clamp((localY / Math.max(1, rect.height)) * 2 - 1, -1, 1);
  }

  function onPointerLeave() {
    state.pointerActive = false;
    state.pointerX = 0;
    state.pointerY = 0;
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
    if (state.mounted) return;
    state.mounted = true;
    state.startTs = performance.now();
    state.rafId = requestAnimationFrame(tick);
  }

  function stop() {
    state.mounted = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
    state.rafId = 0;
  }

  function tick(ts) {
    if (!state.mounted || state.reducedMotion) return;

    const elapsed = ts - state.startTs;
    drawField(elapsed);
    positionBodies(elapsed);

    state.rafId = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(420, Math.floor(rect.height));
    state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);

    if (!state.canvas || !state.ctx) return;

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
      r: Math.random() * 1.35 + 0.25,
      a: Math.random() * 0.58 + 0.12,
      tw: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random()
    }));
  }

  function seedDust() {
    state.dust = Array.from({ length: CONFIG.DUST_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 52 + Math.random() * 210,
      size: 1.2 + Math.random() * 2.4,
      speed: 0.08 + Math.random() * 0.18,
      alpha: 0.04 + Math.random() * 0.10
    }));
  }

  function getLayout() {
    const mobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;

    return {
      mobile,
      centerX: state.width * (mobile ? CONFIG.MOBILE_CENTER_X_RATIO : CONFIG.DESKTOP_CENTER_X_RATIO),
      centerY: state.height * (mobile ? CONFIG.MOBILE_CENTER_Y_RATIO : CONFIG.DESKTOP_CENTER_Y_RATIO),
      innerA: mobile ? CONFIG.MOBILE_ORBIT_A_INNER : CONFIG.DESKTOP_ORBIT_A_INNER,
      innerB: mobile ? CONFIG.MOBILE_ORBIT_B_INNER : CONFIG.DESKTOP_ORBIT_B_INNER,
      outerA: mobile ? CONFIG.MOBILE_ORBIT_A_OUTER : CONFIG.DESKTOP_ORBIT_A_OUTER,
      outerB: mobile ? CONFIG.MOBILE_ORBIT_B_OUTER : CONFIG.DESKTOP_ORBIT_B_OUTER
    };
  }

  function drawField(elapsed) {
    if (!state.ctx) return;

    const ctx = state.ctx;
    const layout = getLayout();
    const { centerX, centerY, innerA, innerB, outerA, outerB } = layout;

    ctx.clearRect(0, 0, state.width, state.height);

    const sunGlow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, 118);
    sunGlow.addColorStop(0, "rgba(255,250,224,0.98)");
    sunGlow.addColorStop(0.10, "rgba(255,232,170,0.92)");
    sunGlow.addColorStop(0.30, "rgba(255,196,98,0.56)");
    sunGlow.addColorStop(0.58, "rgba(255,160,74,0.18)");
    sunGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, state.width, state.height);

    state.stars.forEach((star) => {
      const twinkle = 0.58 + Math.sin(elapsed * 0.001 * star.speed + star.tw) * 0.42;
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,242,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.strokeStyle = "rgba(180,214,255,0.10)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, innerA, innerB, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, outerA, outerB, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    state.dust.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00008 * particle.speed;
      const x = centerX + Math.cos(angle) * particle.radius;
      const y = centerY + Math.sin(angle) * (particle.radius * 0.68);

      ctx.beginPath();
      ctx.fillStyle = `rgba(240,216,154,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    drawSunCore(ctx, centerX, centerY, elapsed);
    drawVaultGlow(ctx, centerX, state.height - 96, elapsed);
  }

  function drawSunCore(ctx, x, y, elapsed) {
    const pulse = 1 + Math.sin(elapsed * 0.0014) * 0.045;

    const core = ctx.createRadialGradient(x, y, 0, x, y, 38 * pulse);
    core.addColorStop(0, "rgba(255,255,246,1)");
    core.addColorStop(0.20, "rgba(255,246,198,0.98)");
    core.addColorStop(0.52, "rgba(255,214,116,0.88)");
    core.addColorStop(1, "rgba(255,168,70,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, 38 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,244,204,0.96)";
    ctx.arc(x, y, 18 * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawVaultGlow(ctx, x, y, elapsed) {
    const pulse = 0.82 + Math.sin(elapsed * 0.0012) * 0.08;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 110);
    glow.addColorStop(0, `rgba(240,216,154,${0.16 * pulse})`);
    glow.addColorStop(0.45, `rgba(240,216,154,${0.08 * pulse})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function positionBodies(elapsed) {
    const layout = getLayout();
    const { centerX, centerY, innerA, innerB, outerA, outerB } = layout;
    const pointerX = state.pointerActive ? state.pointerX : 0;
    const pointerY = state.pointerActive ? state.pointerY : 0;

    state.bodies.forEach((planet) => {
      const { key, el, body, config } = planet;
      const size = layout.mobile ? config.size * 0.88 : config.size;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      let x = centerX;
      let y = centerY;
      let depth = 0.5;
      let spin = elapsed * config.spin;

      if (config.lane === "inner") {
        const angle = config.angle + elapsed * CONFIG.ORBIT_SPEED_INNER;
        x = centerX + Math.cos(angle) * innerA + pointerX * CONFIG.POINTER_SHIFT_X;
        y = centerY + Math.sin(angle) * innerB + pointerY * CONFIG.POINTER_SHIFT_Y;
        depth = (Math.sin(angle) + 1) / 2;
      } else if (config.lane === "outer") {
        const angle = config.angle + elapsed * CONFIG.ORBIT_SPEED_OUTER;
        x = centerX + Math.cos(angle) * outerA + pointerX * CONFIG.POINTER_SHIFT_X;
        y = centerY + Math.sin(angle) * outerB + pointerY * CONFIG.POINTER_SHIFT_Y;
        depth = (Math.sin(angle) + 1) / 2;
      } else {
        x = centerX + pointerX * (CONFIG.POINTER_SHIFT_X * 0.2);
        y = state.height - 118 + pointerY * (CONFIG.POINTER_SHIFT_Y * 0.15);
        depth = 0.2;
        spin = elapsed * config.spin * 0.35;
      }

      const scale = lerp(CONFIG.PLANET_SCALE_MIN, CONFIG.PLANET_SCALE_MAX, depth);
      const opacity = lerp(CONFIG.PLANET_OPACITY_MIN, CONFIG.PLANET_OPACITY_MAX, depth);

      el.style.transform = `translate3d(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(key === "vault" ? 4 : Math.floor(10 + depth * 12));

      if (body) {
        body.style.transform = `rotate(${spin.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
      }
    });
  }

  function applyReducedMotionState() {
    drawField(0);
    positionBodies(0);
  }

  function injectRuntimeStyles() {
    if (document.getElementById("richies-manor-solar-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "richies-manor-solar-runtime-style";
    style.textContent = `
      .home-solar-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
      }

      .home-solar-glow,
      .home-solar-atmosphere {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .home-solar-glow.glow-a {
        background:
          radial-gradient(circle at 50% 46%, rgba(255, 214, 116, 0.10), transparent 20%),
          radial-gradient(circle at 50% 46%, rgba(143,200,255,0.05), transparent 42%);
        filter: blur(26px);
        opacity: 0.9;
      }

      .home-solar-glow.glow-b {
        background:
          radial-gradient(circle at 24% 22%, rgba(143,200,255,0.05), transparent 18%),
          radial-gradient(circle at 76% 18%, rgba(143,200,255,0.04), transparent 18%);
        filter: blur(34px);
        opacity: 0.82;
      }

      .home-solar-atmosphere {
        background:
          linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)),
          linear-gradient(180deg, rgba(7,15,28,0), rgba(7,15,28,0.08));
      }
    `;
    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
})();
