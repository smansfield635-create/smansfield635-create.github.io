(() => {
  "use strict";

  const SELECTORS = {
    frame: "#home-solar-frame",
    stage: "#home-hero-stage",
    bodies: ".route-body",
    centerLabel: ".solar-center-label"
  };

  const CONFIG = {
    MOBILE_BREAKPOINT: 760,
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    DPR_CAP: 2,

    STAR_COUNT_DESKTOP: 180,
    STAR_COUNT_MOBILE: 110,

    CENTER_Y_DESKTOP: 0.44,
    CENTER_Y_MOBILE: 0.36,

    SUN_RADIUS_DESKTOP: 54,
    SUN_RADIUS_MOBILE: 42,
    SUN_GLOW_DESKTOP: 160,
    SUN_GLOW_MOBILE: 126,

    CHAMBER_PADDING_DESKTOP: 28,
    CHAMBER_PADDING_MOBILE: 18,

    ORBIT_TILT_Y_DESKTOP: 0.72,
    ORBIT_TILT_Y_MOBILE: 0.62,

    POINTER_SHIFT_X: 6,
    POINTER_SHIFT_Y: 4,

    SHOW_META_ON_TOUCH: false
  };

  const SOLAR_MODEL = {
    mercury: { order: 1, label: "Mercury", periodYears: 0.2408467, baseAngle: -1.35, orbitRatio: 0.12, sizeDesktop: 28, sizeMobile: 22, hasRing: false },
    venus:   { order: 2, label: "Venus",   periodYears: 0.61519726, baseAngle: -0.62, orbitRatio: 0.21, sizeDesktop: 36, sizeMobile: 28, hasRing: false },
    earth:   { order: 3, label: "Earth",   periodYears: 1.0,        baseAngle: 0.12,  orbitRatio: 0.30, sizeDesktop: 38, sizeMobile: 30, hasRing: false },
    mars:    { order: 4, label: "Mars",    periodYears: 1.8808476,  baseAngle: 0.82,  orbitRatio: 0.39, sizeDesktop: 32, sizeMobile: 24, hasRing: false },
    jupiter: { order: 5, label: "Jupiter", periodYears: 11.862615,  baseAngle: 1.46,  orbitRatio: 0.53, sizeDesktop: 60, sizeMobile: 44, hasRing: false },
    saturn:  { order: 6, label: "Saturn",  periodYears: 29.447498,  baseAngle: 2.08,  orbitRatio: 0.65, sizeDesktop: 54, sizeMobile: 40, hasRing: true  },
    uranus:  { order: 7, label: "Uranus",  periodYears: 84.016846,  baseAngle: 2.70,  orbitRatio: 0.77, sizeDesktop: 46, sizeMobile: 34, hasRing: false },
    neptune: { order: 8, label: "Neptune", periodYears: 164.79132,  baseAngle: 3.22,  orbitRatio: 0.88, sizeDesktop: 42, sizeMobile: 30, hasRing: false },
    pluto:   { order: 9, label: "Pluto",   periodYears: 248.0,      baseAngle: 3.72,  orbitRatio: 0.97, sizeDesktop: 20, sizeMobile: 14, hasRing: false }
  };

  const frame = document.querySelector(SELECTORS.frame);
  const stage = document.querySelector(SELECTORS.stage);
  const bodyElements = Array.from(document.querySelectorAll(SELECTORS.bodies));
  const centerLabel = document.querySelector(SELECTORS.centerLabel);

  if (!frame || !stage || bodyElements.length === 0) return;

  const reduceMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);

  const state = {
    mounted: false,
    rafId: 0,
    startTime: 0,
    reducedMotion: reduceMotionMedia.matches,
    viewport: { width: 0, height: 0, dpr: 1, mobile: false, touch: false },
    pointer: { x: 0, y: 0, active: false },
    stars: [],
    canvas: null,
    ctx: null,
    bodies: []
  };

  buildCanvas();
  buildBodies();
  injectRuntimeStyles();
  resize();
  seedStars();
  bindEvents();
  drawFrame(0);

  if (!state.reducedMotion) start();

  function buildCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "home-solar-canvas";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";

    stage.innerHTML = "";
    stage.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
  }

  function buildBodies() {
    state.bodies = bodyElements
      .map((el) => {
        const key = String(el.dataset.planet || "").trim().toLowerCase();
        const model = SOLAR_MODEL[key];
        if (!model) return null;

        const body = el.querySelector(".planet-body");
        const meta = el.querySelector(".planet-meta");

        if (model.hasRing && body && !body.querySelector(".planet-ring")) {
          const ring = document.createElement("span");
          ring.className = "planet-ring";
          body.appendChild(ring);
        }

        el.addEventListener("mouseenter", () => {
          if (!state.viewport.touch) el.classList.add("is-active");
        });
        el.addEventListener("mouseleave", () => {
          if (!state.viewport.touch) el.classList.remove("is-active");
        });
        el.addEventListener("focusin", () => el.classList.add("is-active"));
        el.addEventListener("focusout", () => el.classList.remove("is-active"));

        if (meta) meta.textContent = model.label;

        return { key, el, body, meta, model };
      })
      .filter(Boolean)
      .sort((a, b) => a.model.order - b.model.order);
  }

  function bindEvents() {
    window.addEventListener("resize", handleResize, { passive: true });
    frame.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    reduceMotionMedia.addEventListener("change", (event) => {
      state.reducedMotion = event.matches;
      if (state.reducedMotion) {
        stop();
        drawFrame(0);
      } else {
        start();
      }
    });

    window.addEventListener("beforeunload", stop, { once: true });
  }

  function handleResize() {
    resize();
    seedStars();
    drawFrame(getElapsedSeconds());
  }

  function handlePointerMove(event) {
    if (state.viewport.touch) return;

    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;

    state.pointer.x = clamp(x, -1, 1);
    state.pointer.y = clamp(y, -1, 1);
    state.pointer.active = true;
  }

  function handlePointerLeave() {
    state.pointer.x = 0;
    state.pointer.y = 0;
    state.pointer.active = false;
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stop();
    } else if (!state.reducedMotion) {
      start();
    }
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(420, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);
    const mobile = width <= CONFIG.MOBILE_BREAKPOINT;
    const touch = matchMedia("(hover: none), (pointer: coarse)").matches;

    state.viewport = { width, height, dpr, mobile, touch };

    if (state.canvas && state.ctx) {
      state.canvas.width = Math.floor(width * dpr);
      state.canvas.height = Math.floor(height * dpr);
      state.canvas.style.width = `${width}px`;
      state.canvas.style.height = `${height}px`;
      state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    frame.classList.toggle("is-touch-device", touch);
  }

  function seedStars() {
    const count = state.viewport.mobile ? CONFIG.STAR_COUNT_MOBILE : CONFIG.STAR_COUNT_DESKTOP;
    const width = state.viewport.width;
    const height = state.viewport.height;

    state.stars = Array.from({ length: count }, (_, index) => {
      const s1 = pseudoRandom(index + 1);
      const s2 = pseudoRandom(index + 101);
      const s3 = pseudoRandom(index + 201);
      const s4 = pseudoRandom(index + 301);

      return {
        x: s1 * width,
        y: s2 * height,
        size: 0.4 + s3 * 1.5,
        alpha: 0.10 + s4 * 0.56
      };
    });
  }

  function start() {
    if (state.mounted) return;
    state.mounted = true;
    state.startTime = performance.now() - getElapsedSeconds() * 1000;
    state.rafId = requestAnimationFrame(tick);
  }

  function stop() {
    state.mounted = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function tick(now) {
    if (!state.mounted) return;
    const elapsedSeconds = Math.max(0, (now - state.startTime) / 1000);
    drawFrame(elapsedSeconds);
    state.rafId = requestAnimationFrame(tick);
  }

  function getElapsedSeconds() {
    if (!state.mounted) return 0;
    return Math.max(0, (performance.now() - state.startTime) / 1000);
  }

  function drawFrame(elapsedSeconds) {
    drawScene(elapsedSeconds);
    positionBodies(elapsedSeconds);
  }

  function drawScene(elapsedSeconds) {
    const ctx = state.ctx;
    if (!ctx) return;

    const { width, height, mobile } = state.viewport;
    const center = getCenter();
    const sunRadius = mobile ? CONFIG.SUN_RADIUS_MOBILE : CONFIG.SUN_RADIUS_DESKTOP;
    const sunGlow = mobile ? CONFIG.SUN_GLOW_MOBILE : CONFIG.SUN_GLOW_DESKTOP;

    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(center.x, center.y, 6, center.x, center.y, sunGlow);
    glow.addColorStop(0, "rgba(255,250,224,0.98)");
    glow.addColorStop(0.10, "rgba(255,232,170,0.94)");
    glow.addColorStop(0.30, "rgba(255,196,98,0.58)");
    glow.addColorStop(0.58, "rgba(255,160,74,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    drawStars(ctx);
    drawOrbits(ctx);
    drawSun(ctx, center, sunRadius, elapsedSeconds);
  }

  function drawStars(ctx) {
    for (const star of state.stars) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,242,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawOrbits(ctx) {
    const center = getCenter();

    ctx.save();
    ctx.lineWidth = 1;

    for (const entry of state.bodies) {
      const orbit = getOrbitFor(entry.model);
      ctx.beginPath();
      ctx.strokeStyle = entry.model.order <= 4
        ? "rgba(180,214,255,0.11)"
        : "rgba(180,214,255,0.08)";
      ctx.ellipse(center.x, center.y, orbit.a, orbit.b, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSun(ctx, center, radius, elapsedSeconds) {
    const pulse = 1 + Math.sin(elapsedSeconds * 1.4) * 0.045;

    const corona = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * 1.55 * pulse);
    corona.addColorStop(0, "rgba(255,255,246,1)");
    corona.addColorStop(0.20, "rgba(255,246,198,0.98)");
    corona.addColorStop(0.52, "rgba(255,214,116,0.90)");
    corona.addColorStop(1, "rgba(255,168,70,0)");
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 1.55 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,244,204,0.98)";
    ctx.arc(center.x, center.y, radius * 0.64 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,216,132,0.22)";
    ctx.lineWidth = 2;
    ctx.arc(center.x, center.y, radius * 1.98 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  function positionBodies(elapsedSeconds) {
    const center = getCenter();
    const bounds = getBounds();

    for (const entry of state.bodies) {
      const { el, body, meta, model } = entry;
      const orbit = getOrbitFor(model);
      const size = state.viewport.mobile ? model.sizeMobile : model.sizeDesktop;
      const angle = model.baseAngle + elapsedSeconds * getAngularVelocity(model.periodYears);

      let x = center.x + Math.cos(angle) * orbit.a;
      let y = center.y + Math.sin(angle) * orbit.b;

      if (state.pointer.active) {
        x += state.pointer.x * CONFIG.POINTER_SHIFT_X;
        y += state.pointer.y * CONFIG.POINTER_SHIFT_Y;
      }

      x = clamp(x, bounds.left + size * 0.5, bounds.right - size * 0.5);
      y = clamp(y, bounds.top + size * 0.5, bounds.bottom - size * 0.5);

      const depth = (Math.sin(angle) + 1) * 0.5;
      const scale = 0.90 + depth * 0.16;
      const opacity = 0.86 + depth * 0.14;
      const zIndex = Math.floor(10 + depth * 20);

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate3d(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(zIndex);

      if (body) {
        const hoverBoost = !state.viewport.touch && el.classList.contains("is-active") ? 0.05 : 0;
        const spin = angle * 0.65;
        body.style.transform = `rotate(${spin.toFixed(3)}rad) scale(${(scale + hoverBoost).toFixed(3)})`;
      }

      if (meta) {
        meta.style.display = state.viewport.touch && !CONFIG.SHOW_META_ON_TOUCH ? "none" : "";
      }
    }

    if (centerLabel) {
      centerLabel.textContent = "Solar Center";
      centerLabel.style.transform = `translate(-50%, calc(-50% + ${state.viewport.mobile ? 74 : 88}px))`;
    }
  }

  function getCenter() {
    return {
      x: state.viewport.width * 0.5,
      y: state.viewport.height * (state.viewport.mobile ? CONFIG.CENTER_Y_MOBILE : CONFIG.CENTER_Y_DESKTOP)
    };
  }

  function getBounds() {
    const pad = state.viewport.mobile ? CONFIG.CHAMBER_PADDING_MOBILE : CONFIG.CHAMBER_PADDING_DESKTOP;
    return {
      left: pad,
      right: state.viewport.width - pad,
      top: pad,
      bottom: state.viewport.height - pad
    };
  }

  function getOrbitFor(model) {
    const { width, height, mobile } = state.viewport;
    const pad = mobile ? CONFIG.CHAMBER_PADDING_MOBILE : CONFIG.CHAMBER_PADDING_DESKTOP;
    const sunRadius = mobile ? CONFIG.SUN_RADIUS_MOBILE : CONFIG.SUN_RADIUS_DESKTOP;
    const tilt = mobile ? CONFIG.ORBIT_TILT_Y_MOBILE : CONFIG.ORBIT_TILT_Y_DESKTOP;

    const usableWidth = width - pad * 2;
    const usableHeight = height - pad * 2;

    const minA = sunRadius + (mobile ? 26 : 34);
    const maxA = usableWidth * (mobile ? 0.40 : 0.42);

    const minB = sunRadius + (mobile ? 12 : 18);
    const maxB = usableHeight * (mobile ? 0.22 : 0.30);

    const a = lerp(minA, maxA, model.orbitRatio);
    const b = Math.min(lerp(minB, maxB, model.orbitRatio), a * tilt);

    return { a, b };
  }

  function getAngularVelocity(periodYears) {
    const base = state.viewport.mobile ? 0.00105 : 0.0012;
    return base / Math.sqrt(periodYears);
  }

  function injectRuntimeStyles() {
    if (document.getElementById("solar-bootstrap-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "solar-bootstrap-runtime-style";
    style.textContent = `
      .planet-body {
        transition: box-shadow 160ms ease, border-color 160ms ease;
      }

      .route-body {
        will-change: transform, opacity;
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

      #home-solar-frame.is-touch-device .planet-meta {
        display: none !important;
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
    `;
    document.head.appendChild(style);
  }

  function pseudoRandom(seed) {
    const x = Math.sin(seed * 9973.13) * 43758.5453123;
    return x - Math.floor(x);
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
