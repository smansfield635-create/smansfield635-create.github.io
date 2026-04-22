const HOME_RUNTIME_META = Object.freeze({
  name: "HOME_ENTRY_RUNTIME",
  version: "V5",
  role: "root_motion_and_orchestration_only",
  contract: "HOME_ENTRY_RUNTIME_V5_RUSSIAN_DOLL_GATE",
  status: "ACTIVE",
  deterministic: true,
  projectionModel: "AMBIENT_FIELD_ONLY",
  cameraRead: "NO_PLANETARY_OBJECTS",
  hierarchy: "SUMMITS_PRIMARY_FOUR_WAY_GATE",
});

const MOBILE_BREAKPOINT = 760;
const STAR_COUNT_DESKTOP = 88;
const STAR_COUNT_MOBILE = 52;
const ARC_COUNT = 4;

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function qs(id) {
  return document.getElementById(id);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function setText(id, value) {
  const node = qs(id);
  if (node) node.textContent = value;
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getViewport() {
  return {
    width: Math.max(
      1,
      window.innerWidth || document.documentElement.clientWidth || 1
    ),
    height: Math.max(
      1,
      window.innerHeight || document.documentElement.clientHeight || 1
    ),
    dpr: clamp(window.devicePixelRatio || 1, 1, 2),
  };
}

function createRng(seedValue) {
  let seed = seedValue >>> 0;

  return function next() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function buildStars(viewport) {
  const mobile = viewport.width <= MOBILE_BREAKPOINT;
  const count = mobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
  const rng = createRng(256);
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rng() * viewport.width,
      y: rng() * viewport.height,
      size: 0.6 + rng() * (mobile ? 1.3 : 1.8),
      alpha: 0.18 + rng() * 0.6,
      speed: 0.2 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
    });
  }

  return stars;
}

function buildArcs(viewport) {
  const mobile = viewport.width <= MOBILE_BREAKPOINT;
  const arcs = [];
  const left = viewport.width * 0.08;
  const right = viewport.width * 0.92;
  const horizonY = mobile ? viewport.height * 0.82 : viewport.height * 0.78;
  const riseBase = mobile ? viewport.height * 0.08 : viewport.height * 0.1;

  for (let i = 0; i < ARC_COUNT; i += 1) {
    const t = i / (ARC_COUNT - 1 || 1);
    arcs.push({
      startX: left + t * viewport.width * 0.06,
      endX: right - t * viewport.width * 0.06,
      baseY: horizonY - t * 10,
      controlY: horizonY - riseBase - t * (mobile ? 24 : 36),
      alpha: 0.08 + (1 - t) * 0.08,
      width: 1.1 + (1 - t) * 0.8,
    });
  }

  return arcs;
}

function createRenderer(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;

  let viewport = getViewport();
  let stars = buildStars(viewport);
  let arcs = buildArcs(viewport);

  function resize() {
    viewport = getViewport();

    canvas.width = Math.floor(viewport.width * viewport.dpr);
    canvas.height = Math.floor(viewport.height * viewport.dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);

    stars = buildStars(viewport);
    arcs = buildArcs(viewport);

    return viewport;
  }

  function drawBackdrop() {
    context.clearRect(0, 0, viewport.width, viewport.height);

    const sky = context.createLinearGradient(0, 0, 0, viewport.height);
    sky.addColorStop(0, "rgba(6, 10, 18, 0.18)");
    sky.addColorStop(0.58, "rgba(8, 17, 29, 0.08)");
    sky.addColorStop(1, "rgba(241, 195, 107, 0.035)");
    context.fillStyle = sky;
    context.fillRect(0, 0, viewport.width, viewport.height);

    const goldGlow = context.createRadialGradient(
      viewport.width * 0.5,
      viewport.height * 0.9,
      0,
      viewport.width * 0.5,
      viewport.height * 0.9,
      viewport.width * 0.52
    );
    goldGlow.addColorStop(0, "rgba(241, 195, 107, 0.18)");
    goldGlow.addColorStop(0.45, "rgba(241, 195, 107, 0.08)");
    goldGlow.addColorStop(1, "rgba(241, 195, 107, 0)");
    context.fillStyle = goldGlow;
    context.fillRect(0, 0, viewport.width, viewport.height);

    const blueGlow = context.createRadialGradient(
      viewport.width * 0.78,
      viewport.height * 0.2,
      0,
      viewport.width * 0.78,
      viewport.height * 0.2,
      viewport.width * 0.34
    );
    blueGlow.addColorStop(0, "rgba(88, 166, 255, 0.10)");
    blueGlow.addColorStop(1, "rgba(88, 166, 255, 0)");
    context.fillStyle = blueGlow;
    context.fillRect(0, 0, viewport.width, viewport.height);
  }

  function drawStars(timestamp, reducedMotion) {
    for (const star of stars) {
      const twinkle = reducedMotion
        ? 0
        : Math.sin(timestamp * 0.0012 * star.speed + star.phase) * 0.24;

      const alpha = clamp(star.alpha + twinkle, 0.06, 0.94);

      context.globalAlpha = alpha;
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
  }

  function drawHorizonLine() {
    const line = context.createLinearGradient(
      viewport.width * 0.08,
      viewport.height * 0.82,
      viewport.width * 0.92,
      viewport.height * 0.72
    );
    line.addColorStop(0, "rgba(255,255,255,0.03)");
    line.addColorStop(0.5, "rgba(241,195,107,0.20)");
    line.addColorStop(1, "rgba(88,166,255,0.12)");

    context.strokeStyle = line;
    context.lineWidth = 1.4;
    context.beginPath();
    context.moveTo(viewport.width * 0.08, viewport.height * 0.82);
    context.lineTo(viewport.width * 0.92, viewport.height * 0.72);
    context.stroke();
  }

  function drawArcs(timestamp, reducedMotion) {
    for (let i = 0; i < arcs.length; i += 1) {
      const arc = arcs[i];
      const drift = reducedMotion ? 0 : Math.sin(timestamp * 0.0007 + i) * 4;

      context.strokeStyle = `rgba(255, 245, 225, ${arc.alpha})`;
      context.lineWidth = arc.width;
      context.beginPath();
      context.moveTo(arc.startX, arc.baseY);
      context.quadraticCurveTo(
        viewport.width * 0.5,
        arc.controlY + drift,
        arc.endX,
        arc.baseY - 8
      );
      context.stroke();
    }
  }

  function draw(timestamp, reducedMotion) {
    drawBackdrop();
    drawStars(timestamp, reducedMotion);
    drawHorizonLine();
    drawArcs(timestamp, reducedMotion);
  }

  return {
    resize,
    draw,
  };
}

function updateProof(viewport, reducedMotion) {
  setText("runtime-status", "READY");
  setText("runtime-contract", HOME_RUNTIME_META.contract);
  setText("runtime-motion", reducedMotion ? "reduce" : "full");
  setText(
    "runtime-viewport",
    `${viewport.width} × ${viewport.height} @ ${viewport.dpr.toFixed(2)}x`
  );
  setText("runtime-updated", new Date().toLocaleString());
  setText("footer-year", String(new Date().getFullYear()));
}

function updateBubbleState() {
  const openCount = qsa("[data-bubble]").filter((bubble) =>
    bubble.classList.contains("open")
  ).length;

  setText("bubble-state", `${openCount} open`);
}

function setupBubbles() {
  const bubbles = qsa("[data-bubble]");

  bubbles.forEach((bubble) => {
    const trigger = bubble.querySelector(".bubble-trigger");
    const body = bubble.querySelector(".bubble-body");

    if (!trigger || !body) return;

    trigger.addEventListener("click", () => {
      const isOpen = bubble.classList.contains("open");

      bubbles.forEach((item) => {
        item.classList.remove("open");
        item.classList.add("hidden");

        const itemTrigger = item.querySelector(".bubble-trigger");
        if (itemTrigger) itemTrigger.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        bubble.classList.remove("hidden");
        bubble.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }

      updateBubbleState();
    });
  });

  updateBubbleState();
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

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(frame);
    }
  };

  if (renderer) {
    if (reducedMotion) {
      renderer.draw(0, true);
    } else {
      rafId = window.requestAnimationFrame(frame);
    }
  }

  setupBubbles();

  window.addEventListener(
    "resize",
    () => {
      viewport = applyResize();

      if (renderer && reducedMotion) {
        renderer.draw(0, true);
      }
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
