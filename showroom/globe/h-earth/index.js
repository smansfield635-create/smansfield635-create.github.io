// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_CHILD_GROUND_LEVEL_DESCENT_TNT_v1
// Owns: H-Earth child-route ground-level live world.
// Does not mutate /showroom/globe/. No static PNG. No parent selector logic.

const CONTRACT = "H_EARTH_CHILD_GROUND_LEVEL_DESCENT_TNT_v1";
const TAU = Math.PI * 2;

const state = {
  canvas: null,
  ctx: null,
  raf: 0,
  startedAt: performance.now(),
  lastFrame: 0,
  targetFrameMs: 50,
  receipt: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seed(i, s = 0) {
  return ((Math.sin(i * 12.9898 + s * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-ground-level-child-route",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    parentBaseline: "/showroom/globe/",
    parentMutation: "false",
    groundLevel: "true",
    staticImageSource: "false",
    waterBehindManor: "true",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);

  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function resizeCanvas() {
  const box = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const width = Math.max(900, Math.floor((box.width || 960) * dpr));
  const height = Math.max(1180, Math.floor((box.height || 1200) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height };
}

function drawSky(ctx, w, h, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "rgb(94,119,138)");
  sky.addColorStop(0.20, "rgb(166,178,174)");
  sky.addColorStop(0.38, "rgb(222,203,166)");
  sky.addColorStop(0.58, "rgb(142,143,111)");
  sky.addColorStop(1, "rgb(40,62,51)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.79;
  const sunY = h * 0.13;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.60);
  sun.addColorStop(0, "rgba(255,241,199,.56)");
  sun.addColorStop(0.22, "rgba(255,222,153,.30)");
  sun.addColorStop(0.58, "rgba(255,205,125,.09)");
  sun.addColorStop(1, "rgba(255,205,125,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  for (let i = 0; i < 30; i += 1) {
    const x = ((seed(i, 11) + t * 0.0017 * (0.4 + seed(i, 12))) % 1) * w;
    const y = h * (0.04 + seed(i, 13) * 0.24);
    const rx = w * (0.025 + seed(i, 14) * 0.080);
    const ry = h * (0.005 + seed(i, 15) * 0.018);

    ctx.globalAlpha = 0.08 + seed(i, 16) * 0.18;
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seed(i, 18) * 0.15, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawDistantWaterAndIslands(ctx, w, h, t) {
  const top = h * 0.355;
  const bottom = h * 0.585;

  const ocean = ctx.createLinearGradient(0, top, 0, bottom);
  ocean.addColorStop(0, "rgb(88,145,151)");
  ocean.addColorStop(0.34, "rgb(53,118,142)");
  ocean.addColorStop(0.72, "rgb(29,88,121)");
  ocean.addColorStop(1, "rgb(17,67,97)");

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let i = 0; i <= 96; i += 1) {
    const x = (i / 96) * w;
    const y = top + Math.sin(i * 0.32 + t * 0.36) * h * 0.003 + Math.sin(i * 1.41 + t * 0.15) * h * 0.0018;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, bottom);
  ctx.lineTo(0, bottom);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = "rgba(239,247,243,.13)";
  ctx.lineWidth = Math.max(1, w * 0.0008);

  for (let j = 0; j < 34; j += 1) {
    const y = lerp(top + h * 0.028, bottom - h * 0.02, j / 34);
    ctx.globalAlpha = Math.max(0.035, 0.16 - j * 0.0035);
    ctx.beginPath();

    for (let i = 0; i <= 80; i += 1) {
      const x = (i / 80) * w;
      const wave = Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.0018;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }

    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 120; i += 1) {
    const x = w * (0.42 + seed(i, 40) * 0.52);
    const y = h * (0.39 + seed(i, 41) * 0.15);
    const pulse = Math.max(0, Math.sin(t * 1.25 + i * 0.61));
    ctx.globalAlpha = 0.035 + pulse * 0.12;
    ctx.fillStyle = "rgba(255,238,187,.62)";
    ctx.beginPath();
    ctx.ellipse(x, y, w * (0.0012 + seed(i, 42) * 0.0034), h * 0.00075, -0.14, 0, TAU);
    ctx.fill();
  }

  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(24,34,34,.58)";
  [[0.07,0.36,0.07,0.052],[0.62,0.35,0.055,0.034],[0.86,0.34,0.075,0.056],[0.95,0.37,0.024,0.018]].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);
    ctx.lineTo(w * (cx - sx * 0.45), h * (cy - sy * 0.45));
    ctx.lineTo(w * cx, h * (cy - sy));
    ctx.lineTo(w * (cx + sx * 0.55), h * (cy - sy * 0.25));
    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

function drawShorelineAndShelf(ctx, w, h, t) {
  const line = h * 0.585;

  const beach = ctx.createLinearGradient(0, line - h * 0.035, 0, line + h * 0.090);
  beach.addColorStop(0, "rgba(183,175,126,.10)");
  beach.addColorStop(0.25, "rgba(220,190,125,.42)");
  beach.addColorStop(0.52, "rgba(154,123,75,.30)");
  beach.addColorStop(1, "rgba(75,83,51,0)");

  ctx.fillStyle = beach;
  ctx.beginPath();
  ctx.moveTo(0, line - h * 0.018);
  for (let i = 0; i <= 96; i += 1) {
    const x = (i / 96) * w;
    const y = line + Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 + Math.sin(i * 1.22) * h * 0.0025;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, line + h * 0.085);
  ctx.lineTo(0, line + h * 0.080);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,236,185,.38)";
  ctx.lineWidth = Math.max(1, w * 0.0009);
  ctx.beginPath();

  for (let i = 0; i <= 96; i += 1) {
    const x = (i / 96) * w;
    const y = line + Math.sin(i * 0.54 + t * 0.56) * h * 0.003;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function drawTerrain(ctx, w, h) {
  const top = h * 0.555;

  const ground = ctx.createLinearGradient(0, top, 0, h);
  ground.addColorStop(0, "rgb(142,133,75)");
  ground.addColorStop(0.22, "rgb(107,111,66)");
  ground.addColorStop(0.52, "rgb(63,88,55)");
  ground.addColorStop(0.78, "rgb(36,59,41)");
  ground.addColorStop(1, "rgb(18,32,27)");
  ctx.fillStyle = ground;

  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let i = 0; i <= 92; i += 1) {
    const x = (i / 92) * w;
    const y = top + Math.sin(i * 0.43) * h * 0.010 + Math.sin(i * 1.27 + 0.4) * h * 0.006 + Math.sin(i * 2.7) * h * 0.002;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  for (let j = 0; j < 38; j += 1) {
    const y = h * (0.63 + j * 0.0105);
    const alpha = Math.max(0.015, 0.060 - j * 0.0011);
    ctx.strokeStyle = `rgba(235,205,139,${alpha})`;
    ctx.lineWidth = Math.max(1, w * 0.00055);
    ctx.beginPath();

    for (let i = 0; i <= 70; i += 1) {
      const x = (i / 70) * w;
      const yy = y + Math.sin(i * 0.66 + j * 0.36) * h * 0.0027 + Math.sin(i * 1.71) * h * 0.0014;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }
  ctx.restore();

  const path = ctx.createLinearGradient(w * 0.49, h * 0.64, w * 0.49, h);
  path.addColorStop(0, "rgba(218,190,128,.06)");
  path.addColorStop(0.55, "rgba(126,101,63,.20)");
  path.addColorStop(1, "rgba(227,202,142,.14)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.655);
  ctx.bezierCurveTo(w * 0.405, h * 0.765, w * 0.348, h * 0.880, w * 0.270, h);
  ctx.lineTo(w * 0.665, h);
  ctx.bezierCurveTo(w * 0.590, h * 0.880, w * 0.545, h * 0.765, w * 0.535, h * 0.655);
  ctx.closePath();
  ctx.fill();
}

function drawManor(ctx, w, h) {
  const cx = w * 0.50;
  const baseY = h * 0.615;
  const width = w * 0.405;
  const height = h * 0.205;
  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.55;

  ctx.save();

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.025, 0, cx, baseY + h * 0.040, width * 0.86);
  contact.addColorStop(0, "rgba(0,0,0,.48)");
  contact.addColorStop(0.63, "rgba(0,0,0,.18)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.032, width * 0.86, h * 0.048, 0, 0, TAU);
  ctx.fill();

  const wall = ctx.createLinearGradient(cx - width * 0.57, bodyTop, cx + width * 0.56, baseY);
  wall.addColorStop(0, "rgb(62,57,49)");
  wall.addColorStop(0.25, "rgb(128,111,77)");
  wall.addColorStop(0.49, "rgb(184,148,88)");
  wall.addColorStop(0.73, "rgb(93,78,62)");
  wall.addColorStop(1, "rgb(38,34,32)");
  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(238,207,143,.42)";
  ctx.lineWidth = Math.max(1, w * 0.00125);

  function rect(x, y, rw, rh, r = Math.max(2, w * 0.004)) {
    roundedRect(ctx, x, y, rw, rh, r);
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.31, bodyTop + bodyH * 0.16, width * 0.62, bodyH * 0.86);
  rect(cx - width * 0.17, bodyTop - bodyH * 0.02, width * 0.34, bodyH * 1.06);
  rect(cx - width * 0.525, bodyTop + bodyH * 0.32, width * 0.23, bodyH * 0.70);
  rect(cx + width * 0.295, bodyTop + bodyH * 0.32, width * 0.23, bodyH * 0.70);

  ctx.fillStyle = "rgb(45,39,36)";
  ctx.strokeStyle = "rgba(245,218,164,.36)";

  [
    [[cx - width * 0.36, bodyTop + bodyH * 0.16], [cx, bodyTop - height * 0.23], [cx + width * 0.36, bodyTop + bodyH * 0.16]],
    [[cx - width * 0.18, bodyTop - bodyH * 0.02], [cx, bodyTop - height * 0.30], [cx + width * 0.18, bodyTop - bodyH * 0.02]],
    [[cx - width * 0.56, bodyTop + bodyH * 0.32], [cx - width * 0.405, bodyTop + bodyH * 0.10], [cx - width * 0.250, bodyTop + bodyH * 0.32]],
    [[cx + width * 0.250, bodyTop + bodyH * 0.32], [cx + width * 0.405, bodyTop + bodyH * 0.10], [cx + width * 0.56, bodyTop + bodyH * 0.32]]
  ].forEach((points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[1][0], points[1][1]);
    ctx.lineTo(points[2][0], points[2][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = "rgba(255,215,137,.84)";
  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (0.28 + floor * 0.21);
    for (let i = -5; i <= 5; i += 1) {
      if (Math.abs(i) === 5 && floor === 0) continue;
      if (i === 0 && floor > 0) continue;

      const x = cx + i * width * 0.052;
      roundedRect(ctx, x - width * 0.0105, y, width * 0.021, bodyH * 0.080, 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawVegetation(ctx, w, h, t) {
  ctx.save();

  for (let i = 0; i < 210; i += 1) {
    const x = seed(i, 110) * w;
    const y = h * (0.585 + seed(i, 111) * 0.39);
    const near = y > h * 0.78;
    const scale = h * (0.0035 + seed(i, 112) * (near ? 0.017 : 0.010));
    const sway = Math.sin(t * 0.76 + i * 0.7) * scale * (near ? 0.9 : 0.55);

    if (seed(i, 113) > 0.82) {
      ctx.strokeStyle = "rgba(25,56,38,.42)";
      ctx.lineWidth = Math.max(1, scale * 0.19);
      ctx.beginPath();
      ctx.moveTo(x, y + scale * 1.4);
      ctx.quadraticCurveTo(x + sway, y - scale * 0.35, x + sway * 1.4, y - scale * 2.6);
      ctx.stroke();

      ctx.fillStyle = near ? "rgba(63,121,67,.42)" : "rgba(71,132,75,.28)";
      ctx.beginPath();
      ctx.ellipse(x + sway * 1.6, y - scale * 2.7, scale * 2.0, scale * 1.05, 0.2, 0, TAU);
      ctx.fill();
    } else {
      ctx.fillStyle = seed(i, 114) > 0.45
        ? `rgba(73,133,75,${near ? 0.32 : 0.20})`
        : `rgba(166,172,94,${near ? 0.28 : 0.16})`;

      ctx.beginPath();
      ctx.ellipse(x + sway, y, scale * 2.1, scale * 0.52, seed(i, 115) * 1.2, 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawWildlife(ctx, w, h, t) {
  ctx.save();

  const birdPhase = (t * 0.025) % 1;
  ctx.strokeStyle = "rgba(21,29,31,.48)";
  ctx.lineWidth = Math.max(1, w * 0.0008);

  for (let i = 0; i < 9; i += 1) {
    const x = ((seed(i, 210) + birdPhase * (0.06 + seed(i, 211) * 0.05)) % 1) * w;
    const y = h * (0.12 + seed(i, 212) * 0.17);
    const s = w * (0.0036 + seed(i, 213) * 0.0038);
    const flap = Math.sin(t * 2.2 + i) * s * 0.35;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.50, y - s * 0.50 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.50, y - s * 0.50 + flap, x + s, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, w, h) {
  const haze = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.66);
  haze.addColorStop(0, "rgba(255,244,219,.06)");
  haze.addColorStop(0.45, "rgba(255,235,186,.085)");
  haze.addColorStop(1, "rgba(255,235,186,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.32, w, h * 0.36);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.50, h * 0.22, w * 0.50, h * 0.50, w * 0.84);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.78, "rgba(0,0,0,.035)");
  vignette.addColorStop(1, "rgba(0,0,0,.26)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas) return;

  if (time - state.lastFrame < state.targetFrameMs) {
    state.raf = requestAnimationFrame(drawFrame);
    return;
  }

  state.lastFrame = time;

  const { width, height } = resizeCanvas();
  const ctx = state.ctx;
  const t = (time - state.startedAt) / 1000;

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  drawSky(ctx, width, height, t);
  drawDistantWaterAndIslands(ctx, width, height, t);
  drawShorelineAndShelf(ctx, width, height, t);
  drawTerrain(ctx, width, height);
  drawManor(ctx, width, height);
  drawVegetation(ctx, width, height, t);
  drawWildlife(ctx, width, height, t);
  drawAtmosphere(ctx, width, height);

  state.receipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/h-earth/",
    parentBaseline: "/showroom/globe/",
    parentMutation: false,
    rendered: true,
    staticImageSource: false,
    waterBehindManor: true,
    liveWaterMotion: true,
    windReactiveVegetation: true,
    wildlifeMotion: true
  });

  state.raf = requestAnimationFrame(drawFrame);
}

function init() {
  markDocument({ boot: "started" });

  state.canvas = document.querySelector("[data-h-earth-ground-canvas]");
  if (!state.canvas) {
    setStatus("Ground canvas missing.");
    markDocument({ rendered: "false", error: "ground-canvas-missing" });
    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  if (!state.ctx) {
    setStatus("Ground canvas context unavailable.");
    markDocument({ rendered: "false", error: "context-unavailable" });
    return;
  }

  window.DGBHEarthGround = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/h-earth/",
        parentBaseline: "/showroom/globe/",
        parentMutation: false,
        receipt: state.receipt
      });
    }
  });

  setStatus("Ground-level child renderer active.");
  markDocument({ rendered: "true" });
  state.raf = requestAnimationFrame(drawFrame);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
  init();
}

export default init;
