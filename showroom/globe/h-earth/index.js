// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_GROUND_RENDER_QUALITY_CLOSE_TNT_v2
// Owns: H-Earth child-route ground-level render quality closure.
// Does not mutate /showroom/globe/. No static PNG. No parent selector logic.

const CONTRACT = "H_EARTH_GROUND_RENDER_QUALITY_CLOSE_TNT_v2";
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
    visualQualityPass: "v2",
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
  const width = Math.max(960, Math.floor((box.width || 980) * dpr));
  const height = Math.max(1180, Math.floor((box.height || 1200) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height };
}

function drawSky(ctx, w, h, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "rgb(83,111,133)");
  sky.addColorStop(0.19, "rgb(159,177,176)");
  sky.addColorStop(0.37, "rgb(226,204,163)");
  sky.addColorStop(0.56, "rgb(151,142,102)");
  sky.addColorStop(1, "rgb(38,61,50)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.80;
  const sunY = h * 0.13;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.62);
  sun.addColorStop(0, "rgba(255,243,203,.58)");
  sun.addColorStop(0.22, "rgba(255,224,158,.32)");
  sun.addColorStop(0.58, "rgba(255,205,125,.10)");
  sun.addColorStop(1, "rgba(255,205,125,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  for (let i = 0; i < 34; i += 1) {
    const x = ((seed(i, 11) + t * 0.0016 * (0.35 + seed(i, 12))) % 1) * w;
    const y = h * (0.04 + seed(i, 13) * 0.23);
    const rx = w * (0.024 + seed(i, 14) * 0.085);
    const ry = h * (0.005 + seed(i, 15) * 0.018);

    ctx.globalAlpha = 0.07 + seed(i, 16) * 0.18;
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seed(i, 18) * 0.15, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawOcean(ctx, w, h, t) {
  const top = h * 0.350;
  const bottom = h * 0.588;

  const ocean = ctx.createLinearGradient(0, top, 0, bottom);
  ocean.addColorStop(0, "rgb(93,149,154)");
  ocean.addColorStop(0.34, "rgb(55,119,142)");
  ocean.addColorStop(0.72, "rgb(27,86,121)");
  ocean.addColorStop(1, "rgb(15,66,96)");

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let i = 0; i <= 104; i += 1) {
    const x = (i / 104) * w;
    const y =
      top +
      Math.sin(i * 0.31 + t * 0.36) * h * 0.003 +
      Math.sin(i * 1.43 + t * 0.15) * h * 0.0018;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, bottom);
  ctx.lineTo(0, bottom);
  ctx.closePath();
  ctx.fill();

  const reflection = ctx.createRadialGradient(w * 0.78, h * 0.405, 0, w * 0.78, h * 0.46, w * 0.45);
  reflection.addColorStop(0, "rgba(255,234,184,.26)");
  reflection.addColorStop(0.28, "rgba(255,218,146,.13)");
  reflection.addColorStop(0.74, "rgba(255,218,146,.035)");
  reflection.addColorStop(1, "rgba(255,218,146,0)");
  ctx.fillStyle = reflection;
  ctx.fillRect(0, top, w, bottom - top);

  ctx.save();
  ctx.lineWidth = Math.max(1, w * 0.0008);

  for (let j = 0; j < 42; j += 1) {
    const y = lerp(top + h * 0.026, bottom - h * 0.020, j / 42);
    ctx.globalAlpha = Math.max(0.030, 0.17 - j * 0.0034);
    ctx.strokeStyle = "rgba(239,247,243,.18)";
    ctx.beginPath();

    for (let i = 0; i <= 92; i += 1) {
      const x = (i / 92) * w;
      const wave =
        Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.0018 +
        Math.sin(i * 1.65 + t * 0.30) * h * 0.0011;

      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }

    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 160; i += 1) {
    const x = w * (0.42 + seed(i, 40) * 0.52);
    const y = h * (0.39 + seed(i, 41) * 0.15);
    const pulse = Math.max(0, Math.sin(t * 1.25 + i * 0.61));
    ctx.globalAlpha = 0.030 + pulse * 0.13;
    ctx.fillStyle = "rgba(255,238,187,.66)";
    ctx.beginPath();
    ctx.ellipse(x, y, w * (0.0011 + seed(i, 42) * 0.0038), h * 0.00075, -0.14, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawIslands(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(22,32,32,.58)";

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

function drawShoreline(ctx, w, h, t) {
  const line = h * 0.588;

  const beach = ctx.createLinearGradient(0, line - h * 0.038, 0, line + h * 0.095);
  beach.addColorStop(0, "rgba(183,175,126,.10)");
  beach.addColorStop(0.25, "rgba(224,193,126,.45)");
  beach.addColorStop(0.52, "rgba(154,123,75,.30)");
  beach.addColorStop(1, "rgba(75,83,51,0)");

  ctx.fillStyle = beach;
  ctx.beginPath();
  ctx.moveTo(0, line - h * 0.018);
  for (let i = 0; i <= 104; i += 1) {
    const x = (i / 104) * w;
    const y =
      line +
      Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 +
      Math.sin(i * 1.22) * h * 0.0025;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, line + h * 0.090);
  ctx.lineTo(0, line + h * 0.084);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,236,185,.40)";
  ctx.lineWidth = Math.max(1, w * 0.0009);
  ctx.beginPath();

  for (let i = 0; i <= 104; i += 1) {
    const x = (i / 104) * w;
    const y = line + Math.sin(i * 0.54 + t * 0.56) * h * 0.003;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function drawTerrain(ctx, w, h) {
  const top = h * 0.558;

  const ground = ctx.createLinearGradient(0, top, 0, h);
  ground.addColorStop(0, "rgb(147,136,77)");
  ground.addColorStop(0.22, "rgb(109,113,66)");
  ground.addColorStop(0.52, "rgb(62,89,56)");
  ground.addColorStop(0.78, "rgb(35,59,42)");
  ground.addColorStop(1, "rgb(17,31,26)");
  ctx.fillStyle = ground;

  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let i = 0; i <= 104; i += 1) {
    const x = (i / 104) * w;
    const y =
      top +
      Math.sin(i * 0.43) * h * 0.010 +
      Math.sin(i * 1.27 + 0.4) * h * 0.006 +
      Math.sin(i * 2.7) * h * 0.002;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.save();

  for (let j = 0; j < 46; j += 1) {
    const y = h * (0.63 + j * 0.0097);
    const alpha = Math.max(0.012, 0.062 - j * 0.0011);
    ctx.strokeStyle = `rgba(235,205,139,${alpha})`;
    ctx.lineWidth = Math.max(1, w * 0.00052);
    ctx.beginPath();

    for (let i = 0; i <= 76; i += 1) {
      const x = (i / 76) * w;
      const yy =
        y +
        Math.sin(i * 0.66 + j * 0.36) * h * 0.0027 +
        Math.sin(i * 1.71) * h * 0.0014;

      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  for (let i = 0; i < 260; i += 1) {
    const x = seed(i, 80) * w;
    const y = h * (0.60 + seed(i, 81) * 0.37);
    const r = h * (0.0012 + seed(i, 82) * 0.0044);
    ctx.fillStyle = seed(i, 83) > 0.54 ? "rgba(220,190,117,.11)" : "rgba(0,0,0,.10)";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.1, r * 0.62, seed(i, 84) * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();

  const path = ctx.createLinearGradient(w * 0.49, h * 0.64, w * 0.49, h);
  path.addColorStop(0, "rgba(218,190,128,.055)");
  path.addColorStop(0.55, "rgba(126,101,63,.18)");
  path.addColorStop(1, "rgba(227,202,142,.13)");

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

  for (let i = 0; i < 240; i += 1) {
    const x = seed(i, 110) * w;
    const y = h * (0.585 + seed(i, 111) * 0.39);
    const near = y > h * 0.78;
    const scale = h * (0.0032 + seed(i, 112) * (near ? 0.018 : 0.011));
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

  for (let i = 0; i < 11; i += 1) {
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

  const animalX = w * (0.16 + Math.sin(t * 0.07) * 0.010);
  const animalY = h * 0.705;
  const s = w * 0.010;

  ctx.fillStyle = "rgba(40,31,25,.26)";
  ctx.beginPath();
  ctx.ellipse(animalX, animalY, s * 1.8, s * 0.65, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(animalX + s * 1.5, animalY - s * 0.5, s * 0.52, s * 0.42, 0, 0, TAU);
  ctx.fill();

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
  drawOcean(ctx, width, height, t);
  drawIslands(ctx, width, height);
  drawShoreline(ctx, width, height, t);
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
    wildlifeMotion: true,
    qualityPass: "v2"
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

  setStatus("Ground-level quality renderer active.");
  markDocument({ rendered: "true" });
  state.raf = requestAnimationFrame(drawFrame);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
  init();
}

export default init;
