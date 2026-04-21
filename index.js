import { createWorldRuntime } from "/runtime/world_runtime.js";

(() => {
  "use strict";

  const SELECTORS = {
    frame: "#home-solar-frame",
    stage: "#home-hero-stage",
    grid: "#home-orbit-grid",
    bodies: ".route-body",
    centerLabel: ".solar-center-label"
  };

  const CONFIG = {
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    DPR_CAP: 2
  };

  const frame = document.querySelector(SELECTORS.frame);
  const stage = document.querySelector(SELECTORS.stage);
  const grid = document.querySelector(SELECTORS.grid);
  const bodyElements = Array.from(document.querySelectorAll(SELECTORS.bodies));
  const centerLabel = document.querySelector(SELECTORS.centerLabel);

  if (!frame || !stage || !grid || bodyElements.length === 0) return;

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);

  const state = {
    mounted: false,
    rafId: 0,
    runtime: null,
    viewport: null,
    pointer: { x: 0, y: 0, active: false },
    reducedMotion: reducedMotionMedia.matches,
    canvas: null,
    ctx: null,
    bodyMap: new Map()
  };

  buildStageCanvas();
  buildBodyMap();

  state.runtime = createWorldRuntime({
    sessionId: "SOLAR_INDEX_BOOTSTRAP_SESSION"
  });

  bindEvents();
  resize();
  start();

  function buildStageCanvas() {
    const existingCanvas = stage.querySelector(".home-solar-canvas");

    if (existingCanvas) {
      state.canvas = existingCanvas;
      state.ctx = existingCanvas.getContext("2d", { alpha: true });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "home-solar-canvas";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    stage.prepend(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
  }

  function buildBodyMap() {
    bodyElements.forEach((el) => {
      const key = String(el.dataset.planet || "").trim().toLowerCase();
      if (!key) return;

      const body = el.querySelector(".planet-body");
      const label = el.querySelector(".planet-label");
      const meta = el.querySelector(".planet-meta");

      state.bodyMap.set(key, {
        el,
        body,
        label,
        meta
      });

      el.addEventListener("mouseenter", () => el.classList.add("is-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
      el.addEventListener("focusin", () => el.classList.add("is-active"));
      el.addEventListener("focusout", () => el.classList.remove("is-active"));
    });
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    frame.addEventListener("pointermove", onPointerMove, { passive: true });
    frame.addEventListener("pointerleave", onPointerLeave, { passive: true });
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", destroy, { once: true });
  }

  function onResize() {
    resize();
    renderFrame();
  }

  function onPointerMove(event) {
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;

    state.pointer = {
      x: clamp(x, -1, 1),
      y: clamp(y, -1, 1),
      active: true
    };
  }

  function onPointerLeave() {
    state.pointer = { x: 0, y: 0, active: false };
  }

  function onReducedMotionChange(event) {
    state.reducedMotion = event.matches;
    state.runtime.setReducedMotion(state.reducedMotion);

    if (state.reducedMotion) {
      stopLoop();
      renderFrame();
    } else {
      startLoop();
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopLoop();
    } else if (!state.reducedMotion) {
      startLoop();
    }
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(420, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);

    state.viewport = { width, height, dpr };

    if (state.canvas && state.ctx) {
      state.canvas.width = Math.floor(width * dpr);
      state.canvas.height = Math.floor(height * dpr);
      state.canvas.style.width = `${width}px`;
      state.canvas.style.height = `${height}px`;
      state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function start() {
    state.runtime.start(state.viewport, {
      reducedMotion: state.reducedMotion,
      pointer: state.pointer
    });

    renderFrame();

    if (!state.reducedMotion) {
      startLoop();
    }
  }

  function startLoop() {
    if (state.mounted) return;
    state.mounted = true;
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    state.mounted = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function loop() {
    if (!state.mounted) return;
    renderFrame();
    state.rafId = requestAnimationFrame(loop);
  }

  function renderFrame() {
    state.runtime.setPointer(state.pointer);
    state.runtime.setReducedMotion(state.reducedMotion);

    const snapshot = state.runtime.update(state.viewport, {
      reducedMotion: state.reducedMotion,
      pointer: state.pointer
    });

    if (!snapshot || !snapshot.sceneState) return;

    drawCanvas(snapshot.sceneState);
    applyPlanetState(snapshot.sceneState);
    applyCenterLabel(snapshot.sceneState);
  }

  function drawCanvas(sceneState) {
    if (!state.ctx || !state.canvas) return;

    const ctx = state.ctx;
    const width = state.viewport.width;
    const height = state.viewport.height;

    ctx.clearRect(0, 0, width, height);

    drawBackgroundGlow(ctx, width, height, sceneState);
    drawStars(ctx, sceneState.stars || []);
    drawOrbitRings(ctx, sceneState.orbitRings || []);
    drawSun(ctx, sceneState.sun);
  }

  function drawBackgroundGlow(ctx, width, height, sceneState) {
    const sun = sceneState.sun || { viewport: { x: width * 0.5, y: height * 0.5 } };
    const centerX = Number((sun.viewport || {}).x || width * 0.5);
    const centerY = Number((sun.viewport || {}).y || height * 0.5);

    const glow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, 150);
    glow.addColorStop(0, "rgba(255,250,224,0.98)");
    glow.addColorStop(0.10, "rgba(255,232,170,0.94)");
    glow.addColorStop(0.30, "rgba(255,196,98,0.58)");
    glow.addColorStop(0.58, "rgba(255,160,74,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars(ctx, stars) {
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,242,255,${Number(star.alpha || 0)})`;
      ctx.arc(
        Number(star.x || 0),
        Number(star.y || 0),
        Number(star.size || 0),
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  function drawOrbitRings(ctx, rings) {
    ctx.save();
    ctx.lineWidth = 1;

    rings.forEach((ring) => {
      const center = ring.center || { x: 0, y: 0 };
      ctx.beginPath();
      ctx.strokeStyle = "rgba(180,214,255,0.10)";
      ctx.ellipse(
        Number(center.x || 0),
        Number(center.y || 0),
        Number(ring.radiusPxX || 0),
        Number(ring.radiusPxY || 0),
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawSun(ctx, sun) {
    if (!sun) return;

    const viewport = sun.viewport || { x: 0, y: 0 };
    const x = Number(viewport.x || 0);
    const y = Number(viewport.y || 0);
    const radiusPx = Number(sun.radiusPx || 0);

    const corona = ctx.createRadialGradient(x, y, 0, x, y, radiusPx * 1.45);
    corona.addColorStop(0, "rgba(255,255,246,1)");
    corona.addColorStop(0.20, "rgba(255,246,198,0.98)");
    corona.addColorStop(0.52, "rgba(255,214,116,0.90)");
    corona.addColorStop(1, "rgba(255,168,70,0)");
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(x, y, radiusPx * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,244,204,0.98)";
    ctx.arc(x, y, radiusPx * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,216,132,0.22)";
    ctx.lineWidth = 2;
    ctx.arc(x, y, radiusPx * 1.88, 0, Math.PI * 2);
    ctx.stroke();
  }

  function applyPlanetState(sceneState) {
    const planets = Array.isArray(sceneState.planets) ? sceneState.planets : [];

    planets.forEach((planet) => {
      const mapped = state.bodyMap.get(String(planet.key || "").toLowerCase());
      if (!mapped) return;

      const el = mapped.el;
      const body = mapped.body;
      const meta = mapped.meta;

      const radiusPx = Number(planet.radiusPx || 0);
      const x = Number((planet.viewport || {}).x || 0);
      const y = Number((planet.viewport || {}).y || 0);
      const scale = Number(planet.scale || 1);
      const opacity = Number(planet.opacity || 1);
      const zIndex = Number(planet.zIndex || 1);
      const angle = Number(planet.angle || 0);

      const diameter = radiusPx * 2;

      el.style.width = `${diameter}px`;
      el.style.height = `${diameter}px`;
      el.style.transform = `translate3d(${(x - radiusPx).toFixed(2)}px, ${(y - radiusPx).toFixed(2)}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(zIndex);

      if (body) {
        const hoverBoost = el.classList.contains("is-active") ? 0.05 : 0;
        const bodyScale = scale + hoverBoost;
        const spin = angle * 0.65;
        body.style.transform = `rotate(${spin.toFixed(3)}rad) scale(${bodyScale.toFixed(3)})`;
      }

      if (meta) {
        meta.style.transform = "translateX(-50%)";
      }
    });
  }

  function applyCenterLabel(sceneState) {
    if (!centerLabel || !sceneState || !sceneState.sun) return;

    centerLabel.textContent = "Solar Center";
  }

  function destroy() {
    stopLoop();
    if (state.runtime) {
      state.runtime.destroy();
    }
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
})();
