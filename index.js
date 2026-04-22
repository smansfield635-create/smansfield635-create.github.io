const HOME_RUNTIME_META = Object.freeze({
  name: "HOME_ENTRY_RUNTIME",
  version: "V3",
  role: "root_motion_and_orchestration_only",
  contract: "HOME_ENTRY_RUNTIME_V3_NINE_SUMMITS_METAVERSE",
  status: "ACTIVE",
  deterministic: true,
  projectionModel: "OBLIQUE_LINEAR_DISTANCE",
  cameraRead: "FORTY_FIVE_DEGREE",
  hierarchy: "BASELINE_FIRST_METAVERSE_SECOND",
});

const MOBILE_BREAKPOINT = 760;
const BODY_COUNT = 9;

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

function createStars(viewport) {
  const mobile = viewport.width <= MOBILE_BREAKPOINT;
  const count = mobile ? 46 : 74;
  const stars = [];

  let seed = 256;
  function rng() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rng() * viewport.width,
      y: rng() * viewport.height,
      size: 0.6 + rng() * (mobile ? 1.4 : 1.8),
      alpha: 0.22 + rng() * 0.58,
      speed: 0.25 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
    });
  }

  return stars;
}

function createRenderer(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;

  let viewport = getViewport();
  let stars = createStars(viewport);
  const bodies = [];
  const labels = [
    "Gratitude",
    "Generosity",
    "Dependability",
    "Accountability",
    "Forgiveness",
    "Humility",
    "Self-Control",
    "Patience",
    "Purity",
  ];

  function resize() {
    viewport = getViewport();

    canvas.width = Math.floor(viewport.width * viewport.dpr);
    canvas.height = Math.floor(viewport.height * viewport.dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);

    stars = createStars(viewport);
    buildBodies();
    return viewport;
  }

  function buildBodies() {
    bodies.length = 0;

    const mobile = viewport.width <= MOBILE_BREAKPOINT;
    const left = mobile ? viewport.width * 0.12 : viewport.width * 0.10;
    const right = mobile ? viewport.width * 0.88 : viewport.width * 0.90;
    const baseline = mobile ? viewport.height * 0.86 : viewport.height * 0.84;
    const rise = mobile ? viewport.height * 0.32 : viewport.height * 0.36;
    const nearScale = mobile ? 1.08 : 1.2;
    const farScale = mobile ? 0.34 : 0.44;

    for (let i = 0; i < BODY_COUNT; i += 1) {
      const depth = i / (BODY_COUNT - 1);
      const scale = nearScale - depth * (nearScale - farScale);
      const x = lerp(left, right, depth);
      const y = baseline - depth * rise;
      const radius = (mobile ? 10 : 14) * scale + (1 - depth) * 4;
      const glow = (mobile ? 22 : 30) * scale + 7;
      const alpha = 0.92 - depth * 0.28;

      bodies.push({
        index: i,
        depth,
        label: labels[i],
        x,
        y,
        radius,
        glow,
        alpha,
      });
    }
  }

  function drawBackdrop() {
    context.clearRect(0, 0, viewport.width, viewport.height);

    const sky = context.createLinearGradient(0, 0, 0, viewport.height);
    sky.addColorStop(0, "rgba(6,10,18,0.18)");
    sky.addColorStop(0.6, "rgba(9,17,29,0.06)");
    sky.addColorStop(1, "rgba(255,138,76,0.03)");

    context.fillStyle = sky;
    context.fillRect(0, 0, viewport.width, viewport.height);

    const horizon = context.createRadialGradient(
      viewport.width * 0.5,
      viewport.height * 0.94,
      0,
      viewport.width * 0.5,
      viewport.height * 0.94,
      viewport.width * 0.6
    );
    horizon.addColorStop(0, "rgba(255,179,71,0.22)");
    horizon.addColorStop(0.45, "rgba(255,138,76,0.10)");
    horizon.addColorStop(1, "rgba(255,138,76,0)");

    context.fillStyle = horizon;
    context.fillRect(0, 0, viewport.width, viewport.height);
  }

  function drawStars(timestamp, reducedMotion) {
    for (const star of stars) {
      const twinkle = reducedMotion
        ? 0
        : Math.sin(timestamp * 0.0013 * star.speed + star.phase) * 0.24;
      const alpha = clamp(star.alpha + twinkle, 0.08, 0.95);

      context.globalAlpha = alpha;
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
  }

  function drawSpineLine() {
    const line = context.createLinearGradient(
      viewport.width * 0.1,
      viewport.height * 0.84,
      viewport.width * 0.9,
      viewport.height * 0.48
    );
    line.addColorStop(0, "rgba(255,255,255,0.06)");
    line.addColorStop(0.45, "rgba(241,195,107,0.22)");
    line.addColorStop(1, "rgba(88,166,255,0.18)");

    context.strokeStyle = line;
    context.lineWidth = 1.8;
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
      : Math.sin(timestamp * 0.0012 + body.index * 0.66) * 0.06;

    const radius = body.radius * (1 + pulse);
    const glow = body.glow * (1 + pulse * 0.8);

    context.save();
    context.globalAlpha = body.alpha;

    const glowGradient = context.createRadialGradient(
      body.x,
      body.y,
      radius * 0.2,
      body.x,
      body.y,
      glow
    );
    glowGradient.addColorStop(0, "rgba(255,255,255,0.96)");
    glowGradient.addColorStop(0.32, "rgba(241,195,107,0.76)");
    glowGradient.addColorStop(0.70, "rgba(88,166,255,0.28)");
    glowGradient.addColorStop(1, "rgba(88,166,255,0)");

    context.fillStyle = glowGradient;
    context.beginPath();
    context.arc(body.x, body.y, glow, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(255,245,225,0.92)";
    context.beginPath();
    context.arc(body.x, body.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawLabel(body) {
    const mobile = viewport.width <= MOBILE_BREAKPOINT;
    const offsetX = mobile ? 10 : 14;
    const offsetY = mobile ? -10 : -12;

    context.save();
    context.globalAlpha = 0.92 - body.depth * 0.28;
    context.font = `${mobile ? 11 : 12}px Inter, system-ui, sans-serif`;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "rgba(255,245,225,0.88)";
    context.fillText(body.label, body.x + offsetX, body.y + offsetY);
    context.restore();
  }

  function draw(timestamp, reducedMotion) {
    drawBackdrop();
    drawStars(timestamp, reducedMotion);
    drawSpineLine();

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
