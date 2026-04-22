const HOME_RUNTIME_META = Object.freeze({
  name: "HOME_ENTRY_RUNTIME",
  version: "V2",
  role: "root_motion_and_orchestration_only",
  contract: "HOME_ENTRY_RUNTIME_V2_OBLIQUE_LINEAR_DISTANCE",
  status: "ACTIVE",
  deterministic: true,
  projectionModel: "OBLIQUE_LINEAR_DISTANCE",
  cameraRead: "FORTY_FIVE_DEGREE",
});

const MOBILE_BREAKPOINT = 760;
const BODY_COUNT = 8;

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function qs(id) {
  return document.getElementById(id);
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

function createRenderer(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;

  let viewport = getViewport();
  const bodies = [];
  const labels = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];

  function resize() {
    viewport = getViewport();

    canvas.width = Math.floor(viewport.width * viewport.dpr);
    canvas.height = Math.floor(viewport.height * viewport.dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);

    buildBodies();
    return viewport;
  }

  function buildBodies() {
    bodies.length = 0;

    const mobile = viewport.width <= MOBILE_BREAKPOINT;
    const left = mobile ? viewport.width * 0.16 : viewport.width * 0.12;
    const right = mobile ? viewport.width * 0.84 : viewport.width * 0.88;
    const baseline = mobile ? viewport.height * 0.76 : viewport.height * 0.74;
    const rise = mobile ? viewport.height * 0.34 : viewport.height * 0.38;
    const nearScale = mobile ? 1.18 : 1.28;
    const farScale = mobile ? 0.42 : 0.50;

    for (let i = 0; i < BODY_COUNT; i += 1) {
      const depth = i / (BODY_COUNT - 1);
      const scale = nearScale - depth * (nearScale - farScale);
      const x = lerp(left, right, depth);
      const y = baseline - depth * rise;
      const radius =
        (mobile ? 16 : 20) * scale + (1 - depth) * (mobile ? 7 : 10);
      const glow = (mobile ? 26 : 34) * scale + 8;
      const alpha = 0.96 - depth * 0.38;

      bodies.push({
        index: i,
        label: labels[i] || `Body ${i + 1}`,
        depth,
        scale,
        x,
        y,
        radius,
        glow,
        alpha,
      });
    }
  }

  function drawBackground() {
    context.clearRect(0, 0, viewport.width, viewport.height);

    const bg = context.createLinearGradient(0, 0, 0, viewport.height);
    bg.addColorStop(0, "rgba(9,15,26,0.14)");
    bg.addColorStop(1, "rgba(9,15,26,0)");

    context.fillStyle = bg;
    context.fillRect(0, 0, viewport.width, viewport.height);

    const horizon = context.createLinearGradient(
      0,
      viewport.height * 0.24,
      viewport.width,
      viewport.height * 0.84
    );
    horizon.addColorStop(0, "rgba(142,197,255,0.03)");
    horizon.addColorStop(0.5, "rgba(142,197,255,0.08)");
    horizon.addColorStop(1, "rgba(210,231,255,0.02)");

    context.strokeStyle = horizon;
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(viewport.width * 0.08, viewport.height * 0.78);
    context.lineTo(viewport.width * 0.92, viewport.height * 0.34);
    context.stroke();
  }

  function drawTrack() {
    const line = context.createLinearGradient(
      viewport.width * 0.10,
      viewport.height * 0.78,
      viewport.width * 0.92,
      viewport.height * 0.34
    );
    line.addColorStop(0, "rgba(255,255,255,0.10)");
    line.addColorStop(0.5, "rgba(142,197,255,0.24)");
    line.addColorStop(1, "rgba(255,255,255,0.04)");

    context.strokeStyle = line;
    context.lineWidth = 2;
    context.beginPath();

    for (let i = 0; i < bodies.length; i += 1) {
      const body = bodies[i];
      if (i === 0) {
        context.moveTo(body.x, body.y);
      } else {
        context.lineTo(body.x, body.y);
      }
    }

    context.stroke();
  }

  function drawBody(body, timestamp, reducedMotion) {
    const pulse = reducedMotion
      ? 0
      : Math.sin(timestamp * 0.0014 + body.index * 0.7) * 0.06;

    const radius = body.radius * (1 + pulse);
    const glow = body.glow * (1 + pulse * 0.8);

    context.save();
    context.globalAlpha = body.alpha;

    const grad = context.createRadialGradient(
      body.x - radius * 0.24,
      body.y - radius * 0.28,
      radius * 0.2,
      body.x,
      body.y,
      glow
    );
    grad.addColorStop(0, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.42, "rgba(142,197,255,0.78)");
    grad.addColorStop(1, "rgba(142,197,255,0)");

    context.fillStyle = grad;
    context.beginPath();
    context.arc(body.x, body.y, glow, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(238,244,255,0.92)";
    context.beginPath();
    context.arc(body.x, body.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawLabel(body) {
    const mobile = viewport.width <= MOBILE_BREAKPOINT;
    const offsetX = mobile ? 12 : 16;
    const offsetY = mobile ? -10 : -12;

    context.save();
    context.globalAlpha = 0.9 - body.depth * 0.32;
    context.font = `${mobile ? 12 : 13}px Inter, system-ui, sans-serif`;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "rgba(238,244,255,0.92)";
    context.fillText(body.label, body.x + offsetX, body.y + offsetY);
    context.restore();
  }

  function draw(timestamp, reducedMotion) {
    drawBackground();
    drawTrack();

    for (let i = bodies.length - 1; i >= 0; i -= 1) {
      drawBody(bodies[i], timestamp, reducedMotion);
    }

    for (let i = 0; i < bodies.length; i += 1) {
      drawLabel(bodies[i]);
    }
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
