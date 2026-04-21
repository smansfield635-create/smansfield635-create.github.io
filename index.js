const HOME_RUNTIME_META = Object.freeze({
  name: "HOME_ENTRY_RUNTIME",
  version: "V1",
  role: "root_motion_and_orchestration_only",
  contract: "HOME_ENTRY_RUNTIME_V1",
  status: "ACTIVE",
  deterministic: true,
});

const STAR_COUNT_DESKTOP = 72;
const STAR_COUNT_MOBILE = 40;
const MOBILE_BREAKPOINT = 760;

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function qs(id) {
  return document.getElementById(id);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getViewport() {
  return {
    width: Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1),
    height: Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1),
    dpr: clamp(window.devicePixelRatio || 1, 1, 2),
  };
}

function makeRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildStars(viewport) {
  const mobile = viewport.width <= MOBILE_BREAKPOINT;
  const count = mobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
  const rng = makeRng(256);
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rng() * viewport.width,
      y: rng() * viewport.height,
      size: 0.8 + rng() * (mobile ? 1.4 : 1.8),
      alpha: 0.25 + rng() * 0.55,
      speed: 0.2 + rng() * 0.6,
      phase: rng() * Math.PI * 2,
    });
  }

  return stars;
}

function createRenderer(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;

  let viewport = getViewport();
  let stars = buildStars(viewport);

  function resize() {
    viewport = getViewport();
    canvas.width = Math.floor(viewport.width * viewport.dpr);
    canvas.height = Math.floor(viewport.height * viewport.dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
    stars = buildStars(viewport);
    return viewport;
  }

  function draw(timestamp, reducedMotion) {
    context.clearRect(0, 0, viewport.width, viewport.height);

    const gradient = context.createRadialGradient(
      viewport.width * 0.5,
      viewport.height * 0.1,
      0,
      viewport.width * 0.5,
      viewport.height * 0.1,
      Math.max(viewport.width, viewport.height) * 0.85
    );
    gradient.addColorStop(0, "rgba(142, 197, 255, 0.08)");
    gradient.addColorStop(1, "rgba(142, 197, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, viewport.width, viewport.height);

    for (const star of stars) {
      const twinkle = reducedMotion
        ? 0
        : Math.sin(timestamp * 0.0012 * star.speed + star.phase) * 0.22;
      const alpha = clamp(star.alpha + twinkle, 0.08, 0.95);

      context.globalAlpha = alpha;
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
  }

  return {
    resize,
    draw,
  };
}

function setText(id, value) {
  const node = qs(id);
  if (node) node.textContent = value;
}

function updateProof(viewport, reducedMotion) {
  setText("runtime-status", "READY");
  setText("runtime-contract", HOME_RUNTIME_META.contract);
  setText("runtime-motion", reducedMotion ? "reduce" : "full");
  setText("runtime-viewport", `${viewport.width} × ${viewport.height} @ ${viewport.dpr.toFixed(2)}x`);
  setText("runtime-updated", new Date().toLocaleString());
  setText("footer-year", String(new Date().getFullYear()));
}

function boot() {
  const canvas = qs("home-fx");
  const reducedMotion = getReducedMotion();
  const renderer = canvas ? createRenderer(canvas) : null;

  const applyResize = () => {
    const viewport = renderer ? renderer.resize() : getViewport();
    updateProof(viewport, reducedMotion);
    return viewport;
  };

  let viewport = applyResize();
  let rafId = 0;

  const frame = (timestamp) => {
    if (renderer) renderer.draw(timestamp, reducedMotion);
    if (!reducedMotion) rafId = window.requestAnimationFrame(frame);
  };

  if (renderer) {
    if (reducedMotion) {
      renderer.draw(0, true);
    } else {
      rafId = window.requestAnimationFrame(frame);
    }
  }

  window.addEventListener(
    "resize",
    () => {
      viewport = applyResize();
      if (renderer && reducedMotion) renderer.draw(0, true);
    },
    { passive: true }
  );

  window.__HOME_ENTRY_RUNTIME__ = Object.freeze({
    meta: HOME_RUNTIME_META,
    viewport,
    reducedMotion,
  });

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
