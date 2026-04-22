(() => {
  "use strict";

  const SELECTORS = {
    system: ".axis-wrap",
    planets: ".planet",
    stars: ".stars"
  };

  const CONFIG = {
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    MOBILE_BREAKPOINT: 720,
    DPR_CAP: 2,
    STAR_COUNT_DESKTOP: 52,
    STAR_COUNT_MOBILE: 28,
    DRIFT_X_DESKTOP: 1.8,
    DRIFT_Y_DESKTOP: 1.2,
    DRIFT_X_MOBILE: 1.05,
    DRIFT_Y_MOBILE: 0.7,
    LABEL_FLOAT_Y: 1.2
  };

  const state = {
    mounted: false,
    reducedMotion: false,
    rafId: 0,
    startTs: 0,
    planets: [],
    starsCanvas: null,
    starsCtx: null,
    starsField: []
  };

  const system = document.querySelector(SELECTORS.system);
  const planetEls = Array.from(document.querySelectorAll(SELECTORS.planets));
  const starsLayer = document.querySelector(SELECTORS.stars);

  if (!system || planetEls.length === 0) return;

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);
  state.reducedMotion = reducedMotionMedia.matches;

  initializePlanets();
  buildStarsCanvas();
  bindEvents();

  if (state.reducedMotion) {
    applyReducedMotion();
  } else {
    resizeStars();
    seedStars();
    drawStars(0);
    start();
  }

  function initializePlanets() {
    state.planets = planetEls.map((el, index) => {
      const baseLeft = readPercent(el.style.left, 50);
      const baseTop = readPercent(el.style.top, 50);
      const orb = el.querySelector(".planet-orb");
      const label = el.querySelector(".planet-label");
      const link = el.querySelector(".planet-link");

      const radiusFactor = computeRadiusFactor(baseLeft, baseTop);
      const driftX = getDriftX() * (0.8 + radiusFactor * 0.55);
      const driftY = getDriftY() * (0.8 + radiusFactor * 0.45);
      const phase = index * 1.137 + radiusFactor * 2.4;
      const speed = 0.42 + index * 0.07;

      el.dataset.baseLeft = String(baseLeft);
      el.dataset.baseTop = String(baseTop);

      return {
        el,
        orb,
        label,
        link,
        baseLeft,
        baseTop,
        driftX,
        driftY,
        phase,
        speed,
        radiusFactor
      };
    });
  }

  function buildStarsCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = "0.95";
    canvas.style.zIndex = "0";

    starsLayer.innerHTML = "";
    starsLayer.appendChild(canvas);

    state.starsCanvas = canvas;
    state.starsCtx = canvas.getContext("2d", { alpha: true });
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);
    window.addEventListener("beforeunload", stop, { once: true });
  }

  function onResize() {
    if (state.reducedMotion) return;
    resizeStars();
    seedStars();
    refreshPlanetDrift();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop();
      return;
    }

    if (!state.reducedMotion) {
      start();
    }
  }

  function onReducedMotionChange(event) {
    state.reducedMotion = event.matches;

    if (state.reducedMotion) {
      stop();
      applyReducedMotion();
      return;
    }

    resizeStars();
    seedStars();
    refreshPlanetDrift();
    start();
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
    drawStars(elapsed);
    animatePlanets(elapsed);

    state.rafId = requestAnimationFrame(tick);
  }

  function applyReducedMotion() {
    state.planets.forEach((planet) => {
      planet.el.style.left = `${planet.baseLeft}%`;
      planet.el.style.top = `${planet.baseTop}%`;
      planet.el.style.transform = "translate(-50%, -50%)";
      if (planet.orb) planet.orb.style.transform = "translateZ(0)";
      if (planet.label) planet.label.style.transform = "translateY(0)";
      if (planet.link) planet.link.style.transform = "translateY(0)";
    });

    resizeStars();
    seedStars();
    drawStars(0);
  }

  function animatePlanets(elapsed) {
    state.planets.forEach((planet) => {
      const t = elapsed * 0.001 * planet.speed;
      const dx = Math.cos(t + planet.phase) * planet.driftX;
      const dy = Math.sin(t * 0.92 + planet.phase) * planet.driftY;

      const left = planet.baseLeft + dx;
      const top = planet.baseTop + dy;

      planet.el.style.left = `${left}%`;
      planet.el.style.top = `${top}%`;
      planet.el.style.transform = "translate(-50%, -50%)";

      if (planet.orb) {
        const spin = Math.sin(t + planet.phase) * 3.5;
        const floatY = Math.cos(t * 1.08 + planet.phase) * 2.5;
        planet.orb.style.transform = `translate3d(0, ${floatY}px, 0) rotate(${spin}deg)`;
      }

      if (planet.label) {
        const labelLift = Math.sin(t * 1.16 + planet.phase) * CONFIG.LABEL_FLOAT_Y;
        planet.label.style.transform = `translateY(${labelLift}px)`;
      }

      if (planet.link) {
        const linkLift = Math.cos(t * 1.02 + planet.phase) * 0.8;
        planet.link.style.transform = `translateY(${linkLift}px)`;
      }
    });
  }

  function resizeStars() {
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);
    const width = Math.max(window.innerWidth, document.documentElement.clientWidth || 0);
    const height = Math.max(window.innerHeight, document.documentElement.clientHeight || 0);

    state.starsCanvas.width = Math.floor(width * dpr);
    state.starsCanvas.height = Math.floor(height * dpr);
    state.starsCanvas.style.width = `${width}px`;
    state.starsCanvas.style.height = `${height}px`;

    state.starsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedStars() {
    const width = parseFloat(state.starsCanvas.style.width) || window.innerWidth;
    const height = parseFloat(state.starsCanvas.style.height) || window.innerHeight;
    const count = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.STAR_COUNT_MOBILE
      : CONFIG.STAR_COUNT_DESKTOP;

    state.starsField = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.45 + Math.random() * 1.35,
      a: 0.18 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.95
    }));
  }

  function drawStars(elapsed) {
    const ctx = state.starsCtx;
    const width = parseFloat(state.starsCanvas.style.width) || window.innerWidth;
    const height = parseFloat(state.starsCanvas.style.height) || window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    state.starsField.forEach((star) => {
      const twinkle = 0.62 + Math.sin(elapsed * 0.001 * star.speed + star.tw) * 0.38;
      ctx.beginPath();
      ctx.fillStyle = `rgba(230,242,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function refreshPlanetDrift() {
    state.planets.forEach((planet) => {
      planet.driftX = getDriftX() * (0.8 + planet.radiusFactor * 0.55);
      planet.driftY = getDriftY() * (0.8 + planet.radiusFactor * 0.45);
    });
  }

  function getDriftX() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.DRIFT_X_MOBILE
      : CONFIG.DRIFT_X_DESKTOP;
  }

  function getDriftY() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.DRIFT_Y_MOBILE
      : CONFIG.DRIFT_Y_DESKTOP;
  }

  function computeRadiusFactor(left, top) {
    const dx = (left - 50) / 50;
    const dy = (top - 50) / 50;
    return Math.min(1, Math.sqrt((dx * dx) + (dy * dy)));
  }

  function readPercent(value, fallback) {
    const n = parseFloat(String(value).replace("%", "").trim());
    return Number.isFinite(n) ? n : fallback;
  }
})();
