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

    STAR_COUNT: 180,
    DUST_COUNT: 28,

    DESKTOP_CENTER_X_RATIO: 0.5,
    DESKTOP_CENTER_Y_RATIO: 0.5,
    MOBILE_CENTER_X_RATIO: 0.5,
    MOBILE_CENTER_Y_RATIO: 0.46,

    SUN_EXCLUSION_RADIUS_DESKTOP: 86,
    SUN_EXCLUSION_RADIUS_MOBILE: 74,

    ORBIT_ECCENTRICITY_Y: 0.72,
    POINTER_SHIFT_X: 10,
    POINTER_SHIFT_Y: 8,

    LABEL_OFFSET_Y: 0,
    HOVER_SCALE_BOOST: 0.05
  };

  /*
    Solar-system conditioned template:
    - Order preserved
    - Orbit radii scaled to fit the chamber
    - Relative speed derived from orbital period (1 / period)
    - All bodies share the same Euclidean orbit law
  */
  const PLANET_MODEL = {
    mercury: {
      order: 1,
      periodYears: 0.2408467,
      orbitRatio: 0.16,
      sizeDesktop: 26,
      sizeMobile: 20,
      baseAngle: -1.45,
      hueClass: "planet-mercury"
    },
    venus: {
      order: 2,
      periodYears: 0.61519726,
      orbitRatio: 0.23,
      sizeDesktop: 34,
      sizeMobile: 26,
      baseAngle: -0.35,
      hueClass: "planet-venus"
    },
    earth: {
      order: 3,
      periodYears: 1,
      orbitRatio: 0.31,
      sizeDesktop: 36,
      sizeMobile: 28,
      baseAngle: 0.78,
      hueClass: "planet-earth"
    },
    mars: {
      order: 4,
      periodYears: 1.8808476,
      orbitRatio: 0.40,
      sizeDesktop: 30,
      sizeMobile: 24,
      baseAngle: 1.82,
      hueClass: "planet-mars"
    },
    jupiter: {
      order: 5,
      periodYears: 11.862615,
      orbitRatio: 0.54,
      sizeDesktop: 58,
      sizeMobile: 44,
      baseAngle: 2.58,
      hueClass: "planet-jupiter"
    },
    saturn: {
      order: 6,
      periodYears: 29.447498,
      orbitRatio: 0.67,
      sizeDesktop: 50,
      sizeMobile: 38,
      baseAngle: -2.55,
      hueClass: "planet-saturn",
      hasRing: true
    },
    uranus: {
      order: 7,
      periodYears: 84.016846,
      orbitRatio: 0.79,
      sizeDesktop: 42,
      sizeMobile: 32,
      baseAngle: -1.95,
      hueClass: "planet-uranus"
    },
    neptune: {
      order: 8,
      periodYears: 164.79132,
      orbitRatio: 0.90,
      sizeDesktop: 40,
      sizeMobile: 30,
      baseAngle: -0.96,
      hueClass: "planet-neptune"
    },
    pluto: {
      order: 9,
      periodYears: 248.0,
      orbitRatio: 0.98,
      sizeDesktop: 18,
      sizeMobile: 14,
      baseAngle: 0.22,
      hueClass: "planet-pluto"
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
    state.bodies = bodyElements
      .map((el) => {
        const key = String(el.dataset.planet || "").trim().toLowerCase();
        const model = PLANET_MODEL[key];
        if (!model) return null;

        const body = el.querySelector(".planet-body");
        const label = el.querySelector(".planet-label");
        const meta = el.querySelector(".planet-meta");

        el.classList.add("planet-shell");
        el.classList.add(model.hueClass);

        if (model.hasRing && body && !body.querySelector(".planet-ring")) {
          const ring = document.createElement("span");
          ring.className = "planet-ring";
          body.appendChild(ring);
        }

        el.addEventListener("mouseenter", () => el.classList.add("is-active"));
        el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
        el.addEventListener("focusin", () => el.classList.add("is-active"));
        el.addEventListener("focusout", () => el.classList.remove("is-active"));

        if (label) {
          label.style.transform = `translateY(${CONFIG.LABEL_OFFSET_Y}px)`;
        }

        return {
          key,
          el,
          body,
          label,
          meta,
          model
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.model.order - b.model.order);
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
    if (state.reducedMotion) applyReducedMotionState();
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
    if (state.rafId) cancelAnimationFrame(state.rafId);
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

  function getLayout() {
    const mobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    const centerX = state.width * (mobile ? CONFIG.MOBILE_CENTER_X_RATIO : CONFIG.DESKTOP_CENTER_X_RATIO);
    const centerY = state.height * (mobile ? CONFIG.MOBILE_CENTER_Y_RATIO : CONFIG.DESKTOP_CENTER_Y_RATIO);
    const exclusion = mobile ? CONFIG.SUN_EXCLUSION_RADIUS_MOBILE : CONFIG.SUN_EXCLUSION_RADIUS_DESKTOP;

    const maxA = Math.max(140, Math.min(state.width, state.height) * (mobile ? 0.43 : 0.46));
    const minA = exclusion + 28;
    const maxB = maxA * CONFIG.ORBIT_ECCENTRICITY_Y;
    const minB = minA * CONFIG.ORBIT_ECCENTRICITY_Y;

    return {
      mobile,
      centerX,
      centerY,
      exclusion,
      minA,
      maxA,
      minB,
      maxB
    };
  }

  function seedStars() {
    state.stars = Array.from({ length: CONFIG.STAR_COUNT }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: Math.random() * 1.45 + 0.25,
      a: Math.random() * 0.58 + 0.12,
      tw: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random()
    }));
  }

  function seedDust() {
    const layout = getLayout();
    state.dust = Array.from({ length: CONFIG.DUST_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radiusRatio: 0.16 + Math.random() * 0.82,
      size: 0.8 + Math.random() * 2.2,
      speed: 0.05 + Math.random() * 0.16,
      alpha: 0.03 + Math.random() * 0.08,
      laneTilt: 0.66 + Math.random() * 0.10,
      minA: layout.minA,
      maxA: layout.maxA
    }));
  }

  function drawField(elapsed) {
    if (!state.ctx) return;

    const ctx = state.ctx;
    const layout = getLayout();
    const { centerX, centerY, minA, maxA, minB, maxB } = layout;

    ctx.clearRect(0, 0, state.width, state.height);

    const sunGlow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, 132);
    sunGlow.addColorStop(0, "rgba(255,250,224,0.98)");
    sunGlow.addColorStop(0.10, "rgba(255,232,170,0.94)");
    sunGlow.addColorStop(0.30, "rgba(255,196,98,0.58)");
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

    drawOrbitRings(ctx, minA, maxA, minB, maxB, centerX, centerY);
    drawDust(ctx, elapsed, layout);
    drawSunCore(ctx, centerX, centerY, elapsed);
  }

  function drawOrbitRings(ctx, minA, maxA, minB, maxB, centerX, centerY) {
    ctx.save();
    ctx.lineWidth = 1;

    const ringCount = 9;
    for (let i = 0; i < ringCount; i += 1) {
      const t = i / (ringCount - 1);
      const a = lerp(minA, maxA, t);
      const b = lerp(minB, maxB, t);

      ctx.beginPath();
      ctx.strokeStyle = i < 4 ? "rgba(180,214,255,0.11)" : "rgba(180,214,255,0.08)";
      ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDust(ctx, elapsed, layout) {
    const { centerX, centerY } = layout;

    state.dust.forEach((particle) => {
      const a = lerp(layout.minA, layout.maxA, particle.radiusRatio);
      const b = a * particle.laneTilt;
      const angle = particle.angle + elapsed * 0.00008 * particle.speed;
      const x = centerX + Math.cos(angle) * a;
      const y = centerY + Math.sin(angle) * b;

      ctx.beginPath();
      ctx.fillStyle = `rgba(240,216,154,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawSunCore(ctx, x, y, elapsed) {
    const pulse = 1 + Math.sin(elapsed * 0.0014) * 0.045;

    const corona = ctx.createRadialGradient(x, y, 0, x, y, 42 * pulse);
    corona.addColorStop(0, "rgba(255,255,246,1)");
    corona.addColorStop(0.20, "rgba(255,246,198,0.98)");
    corona.addColorStop(0.52, "rgba(255,214,116,0.90)");
    corona.addColorStop(1, "rgba(255,168,70,0)");
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(x, y, 42 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,244,204,0.98)";
    ctx.arc(x, y, 18 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,216,132,0.22)";
    ctx.lineWidth = 2;
    ctx.arc(x, y, 54 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  function positionBodies(elapsed) {
    const layout = getLayout();
    const { centerX, centerY, minA, maxA, minB, maxB } = layout;
    const pointerX = state.pointerActive ? state.pointerX : 0;
    const pointerY = state.pointerActive ? state.pointerY : 0;

    state.bodies.forEach((planet) => {
      const { el, body, model } = planet;

      const t = model.orbitRatio;
      const a = lerp(minA, maxA, t);
      const b = lerp(minB, maxB, t);

      const size = layout.mobile ? model.sizeMobile : model.sizeDesktop;
      const speed = getScaledAngularVelocity(model.periodYears, layout.mobile);

      const angle = model.baseAngle + elapsed * speed;

      let x = centerX + Math.cos(angle) * a + pointerX * CONFIG.POINTER_SHIFT_X;
      let y = centerY + Math.sin(angle) * b + pointerY * CONFIG.POINTER_SHIFT_Y;

      // Hard exclusion radius from the sun center.
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = layout.exclusion + size * 0.5;
      if (distance < minDistance && distance > 0) {
        const correction = minDistance / distance;
        x = centerX + dx * correction;
        y = centerY + dy * correction;
      }

      const depth = (Math.sin(angle) + 1) / 2;
      const scale = lerp(0.82, 1.04, depth);
      const opacity = lerp(0.68, 1.0, depth);
      const zIndex = Math.floor(10 + depth * 20);

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate3d(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(zIndex);

      if (body) {
        const hoverBoost = el.classList.contains("is-active") ? CONFIG.HOVER_SCALE_BOOST : 0;
        const bodyScale = scale + hoverBoost;
        const spin = elapsed * 0.0009 * (model.order <= 4 ? 1.8 : 1.0) * (model.order % 2 === 0 ? -1 : 1);
        body.style.transform = `rotate(${spin.toFixed(3)}rad) scale(${bodyScale.toFixed(3)})`;
      }
    });
  }

  function getScaledAngularVelocity(periodYears, mobile) {
    /*
      Real periods are too extreme for readable UI.
      This keeps the ranking truthful while compressing the range.
    */
    const base = 0.0014;
    const relative = 1 / Math.sqrt(periodYears);
    return base * relative * (mobile ? 0.88 : 1);
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
          radial-gradient(circle at 50% 50%, rgba(255, 214, 116, 0.09), transparent 18%),
          radial-gradient(circle at 50% 50%, rgba(143,200,255,0.05), transparent 42%);
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

      .route-body {
        will-change: transform, opacity;
      }

      .planet-body {
        transition: box-shadow 160ms ease, border-color 160ms ease;
      }

      .route-body.is-active .planet-body,
      .route-body:focus-within .planet-body,
      .route-body:hover .planet-body {
        border-color: rgba(240, 216, 154, 0.36);
        box-shadow:
          0 18px 38px rgba(0, 0, 0, 0.38),
          inset -14px -18px 28px rgba(0, 0, 0, 0.30),
          inset 8px 10px 16px rgba(255, 255, 255, 0.08),
          0 0 34px rgba(240, 216, 154, 0.12);
      }

      .planet-meta {
        opacity: 0;
        transition: opacity 160ms ease, border-color 160ms ease;
      }

      .route-body.is-active .planet-meta,
      .route-body:focus-within .planet-meta,
      .route-body:hover .planet-meta {
        opacity: 1;
        border-color: rgba(240, 216, 154, 0.24);
      }

      .planet-ring {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 168%;
        height: 42%;
        transform: translate(-50%, -50%) rotate(-16deg);
        border-radius: 50%;
        border: 2px solid rgba(227, 212, 170, 0.42);
        box-shadow: 0 0 12px rgba(227, 212, 170, 0.10);
        pointer-events: none;
      }

      .planet-saturn .planet-body {
        overflow: visible;
      }

      .planet-label {
        user-select: none;
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
