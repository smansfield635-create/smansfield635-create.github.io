// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_LAYERED_CINEMATIC_TNT_v3
// Owns: H-Earth child-route layered cinematic live ground renderer.
// Does not mutate /showroom/globe/. No static image dependency.

const CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_LAYERED_CINEMATIC_TNT_v3";
const TAU = Math.PI * 2;

const state = {
  canvas: null,
  ctx: null,
  staticLayer: null,
  staticCtx: null,
  sizeKey: "",
  raf: 0,
  startedAt: performance.now(),
  lastFrame: 0,
  targetFrameMs: 42,
  receipt: null
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
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
    page: "h-earth-western-golden-shelf-cinematic-ground",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    parentBaseline: "/showroom/globe/",
    parentMutation: "false",
    groundLevel: "true",
    renderMode: "layered-cinematic-live",
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
  const width = Math.max(980, Math.floor((box.width || 980) * dpr));
  const height = Math.max(1280, Math.floor((box.height || 1280) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height };
}

function ensureStaticLayer(w, h) {
  const key = `${w}x${h}`;
  if (state.staticLayer && state.sizeKey === key) return;

  state.sizeKey = key;
  state.staticLayer = document.createElement("canvas");
  state.staticLayer.width = w;
  state.staticLayer.height = h;
  state.staticCtx = state.staticLayer.getContext("2d", { alpha: true });

  buildStaticLayer(state.staticCtx, w, h);
}

function buildStaticLayer(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  drawStaticSky(ctx, w, h);
  drawStaticIslands(ctx, w, h);
  drawStaticShoreAndTerrain(ctx, w, h);
  drawStaticPath(ctx, w, h);
  drawStaticManor(ctx, w, h);
  drawStaticRocksAndFieldTexture(ctx, w, h);
  drawStaticForegroundRocks(ctx, w, h);
}

function drawStaticSky(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0.00, "rgb(78,108,132)");
  sky.addColorStop(0.17, "rgb(150,174,180)");
  sky.addColorStop(0.34, "rgb(224,206,166)");
  sky.addColorStop(0.50, "rgb(167,151,106)");
  sky.addColorStop(0.66, "rgb(82,103,67)");
  sky.addColorStop(1.00, "rgb(18,32,27)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.86;
  const sunY = h * 0.10;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.62);
  sun.addColorStop(0, "rgba(255,246,212,.66)");
  sun.addColorStop(0.20, "rgba(255,224,159,.34)");
  sun.addColorStop(0.56, "rgba(255,207,128,.12)");
  sun.addColorStop(1, "rgba(255,207,128,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 44; i += 1) {
    const x = seed(i, 501) * w;
    const y = h * (0.035 + seed(i, 502) * 0.22);
    const rx = w * (0.025 + seed(i, 503) * 0.09);
    const ry = h * (0.006 + seed(i, 504) * 0.022);

    ctx.fillStyle = `rgba(255,255,255,${0.06 + seed(i, 505) * 0.20})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seed(i, 506) * 0.18, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(120,128,128,${0.035 + seed(i, 507) * 0.10})`;
    ctx.beginPath();
    ctx.ellipse(x - rx * 0.08, y + ry * 0.20, rx * 0.72, ry * 0.48, seed(i, 506) * 0.18, 0, TAU);
    ctx.fill();
  }

  const haze = ctx.createLinearGradient(0, h * 0.25, 0, h * 0.44);
  haze.addColorStop(0, "rgba(255,240,200,0)");
  haze.addColorStop(0.52, "rgba(255,239,198,.16)");
  haze.addColorStop(1, "rgba(255,239,198,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.22, w, h * 0.28);
}

function drawStaticIslands(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(22,31,31,.58)";

  const islands = [
    [0.09, 0.354, 0.070, 0.056],
    [0.24, 0.362, 0.030, 0.020],
    [0.60, 0.352, 0.052, 0.032],
    [0.83, 0.340, 0.080, 0.060],
    [0.94, 0.365, 0.026, 0.018]
  ];

  for (const [cx, cy, sx, sy] of islands) {
    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);
    ctx.lineTo(w * (cx - sx * 0.68), h * (cy - sy * 0.22));
    ctx.lineTo(w * (cx - sx * 0.30), h * (cy - sy * 0.55));
    ctx.lineTo(w * cx, h * (cy - sy));
    ctx.lineTo(w * (cx + sx * 0.40), h * (cy - sy * 0.42));
    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,225,170,.06)";
    ctx.beginPath();
    ctx.ellipse(w * (cx - sx * 0.12), h * (cy - sy * 0.32), w * sx * 0.28, h * sy * 0.12, -0.1, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(22,31,31,.58)";
  }

  ctx.restore();
}

function drawStaticShoreAndTerrain(ctx, w, h) {
  const waterTop = h * 0.342;
  const waterBottom = h * 0.565;

  const ocean = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  ocean.addColorStop(0, "rgb(82,142,151)");
  ocean.addColorStop(0.35, "rgb(49,115,140)");
  ocean.addColorStop(0.72, "rgb(25,84,121)");
  ocean.addColorStop(1, "rgb(15,65,96)");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);

  const beachY = h * 0.565;
  const beach = ctx.createLinearGradient(0, beachY - h * 0.040, 0, beachY + h * 0.105);
  beach.addColorStop(0, "rgba(230,208,151,.08)");
  beach.addColorStop(0.26, "rgba(226,191,121,.48)");
  beach.addColorStop(0.55, "rgba(155,125,76,.32)");
  beach.addColorStop(1, "rgba(70,88,55,0)");
  ctx.fillStyle = beach;

  ctx.beginPath();
  ctx.moveTo(0, beachY - h * 0.014);
  for (let i = 0; i <= 110; i += 1) {
    const x = (i / 110) * w;
    const y = beachY + Math.sin(i * 0.46) * h * 0.004 + Math.sin(i * 1.3) * h * 0.0025;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, beachY + h * 0.095);
  ctx.lineTo(0, beachY + h * 0.090);
  ctx.closePath();
  ctx.fill();

  const groundTop = h * 0.552;
  const ground = ctx.createLinearGradient(0, groundTop, 0, h);
  ground.addColorStop(0, "rgb(146,137,78)");
  ground.addColorStop(0.22, "rgb(111,114,68)");
  ground.addColorStop(0.47, "rgb(62,91,57)");
  ground.addColorStop(0.76, "rgb(34,58,42)");
  ground.addColorStop(1, "rgb(16,29,25)");
  ctx.fillStyle = ground;

  ctx.beginPath();
  ctx.moveTo(0, groundTop);
  for (let i = 0; i <= 120; i += 1) {
    const x = (i / 120) * w;
    const y =
      groundTop +
      Math.sin(i * 0.35) * h * 0.010 +
      Math.sin(i * 1.17 + 0.4) * h * 0.006;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  for (let j = 0; j < 52; j += 1) {
    const y = h * (0.61 + j * 0.0084);
    const alpha = Math.max(0.012, 0.065 - j * 0.0010);
    ctx.strokeStyle = `rgba(234,204,139,${alpha})`;
    ctx.lineWidth = Math.max(1, w * 0.0005);
    ctx.beginPath();

    for (let i = 0; i <= 90; i += 1) {
      const x = (i / 90) * w;
      const yy =
        y +
        Math.sin(i * 0.66 + j * 0.33) * h * 0.0024 +
        Math.sin(i * 1.71) * h * 0.0013;

      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }
}

function drawStaticPath(ctx, w, h) {
  const path = ctx.createLinearGradient(w * 0.49, h * 0.60, w * 0.49, h);
  path.addColorStop(0, "rgba(216,190,134,.04)");
  path.addColorStop(0.28, "rgba(178,145,87,.12)");
  path.addColorStop(0.62, "rgba(115,91,60,.22)");
  path.addColorStop(1, "rgba(230,204,144,.18)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.478, h * 0.623);
  ctx.bezierCurveTo(w * 0.430, h * 0.720, w * 0.365, h * 0.865, w * 0.245, h);
  ctx.lineTo(w * 0.690, h);
  ctx.bezierCurveTo(w * 0.595, h * 0.865, w * 0.545, h * 0.720, w * 0.525, h * 0.623);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 84; i += 1) {
    const t = seed(i, 720);
    const y = lerp(h * 0.66, h * 0.985, t);
    const center = lerp(w * 0.50, w * (0.47 + seed(i, 721) * 0.10), t);
    const spread = lerp(w * 0.050, w * 0.210, (y - h * 0.66) / (h * 0.34));
    const x = center + (seed(i, 722) - 0.5) * spread;
    const r = h * (0.0015 + seed(i, 723) * 0.0065);

    ctx.fillStyle = seed(i, 724) > 0.35 ? "rgba(194,170,118,.18)" : "rgba(42,35,29,.20)";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.4, r * 0.74, seed(i, 725) * Math.PI, 0, TAU);
    ctx.fill();
  }
}

function drawStaticManor(ctx, w, h) {
  const cx = w * 0.50;
  const baseY = h * 0.592;
  const width = w * 0.315;
  const height = h * 0.135;
  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.58;

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.016, 0, cx, baseY + h * 0.025, width * 0.82);
  contact.addColorStop(0, "rgba(0,0,0,.42)");
  contact.addColorStop(0.64, "rgba(0,0,0,.16)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.026, width * 0.84, h * 0.035, 0, 0, TAU);
  ctx.fill();

  const wall = ctx.createLinearGradient(cx - width * 0.60, bodyTop, cx + width * 0.57, baseY);
  wall.addColorStop(0, "rgb(56,53,47)");
  wall.addColorStop(0.25, "rgb(118,101,73)");
  wall.addColorStop(0.50, "rgb(172,139,86)");
  wall.addColorStop(0.76, "rgb(83,70,58)");
  wall.addColorStop(1, "rgb(35,31,29)");
  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(238,207,143,.36)";
  ctx.lineWidth = Math.max(1, w * 0.00095);

  function wallRect(x, y, rw, rh) {
    roundedRect(ctx, x, y, rw, rh, Math.max(2, w * 0.003));
    ctx.fill();
    ctx.stroke();
  }

  wallRect(cx - width * 0.30, bodyTop + bodyH * 0.18, width * 0.60, bodyH * 0.86);
  wallRect(cx - width * 0.14, bodyTop + bodyH * 0.02, width * 0.28, bodyH * 1.02);
  wallRect(cx - width * 0.48, bodyTop + bodyH * 0.36, width * 0.18, bodyH * 0.67);
  wallRect(cx + width * 0.30, bodyTop + bodyH * 0.36, width * 0.18, bodyH * 0.67);

  ctx.fillStyle = "rgb(44,38,35)";
  ctx.strokeStyle = "rgba(245,218,164,.32)";

  [
    [[cx - width * 0.34, bodyTop + bodyH * 0.18], [cx, bodyTop - height * 0.20], [cx + width * 0.34, bodyTop + bodyH * 0.18]],
    [[cx - width * 0.16, bodyTop + bodyH * 0.02], [cx, bodyTop - height * 0.28], [cx + width * 0.16, bodyTop + bodyH * 0.02]],
    [[cx - width * 0.50, bodyTop + bodyH * 0.36], [cx - width * 0.39, bodyTop + bodyH * 0.18], [cx - width * 0.28, bodyTop + bodyH * 0.36]],
    [[cx + width * 0.28, bodyTop + bodyH * 0.36], [cx + width * 0.39, bodyTop + bodyH * 0.18], [cx + width * 0.50, bodyTop + bodyH * 0.36]]
  ].forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = "rgba(255,216,139,.82)";
  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (0.30 + floor * 0.21);
    for (let i = -5; i <= 5; i += 1) {
      if (i === 0 && floor > 0) continue;
      if (Math.abs(i) > 4 && floor === 0) continue;

      const x = cx + i * width * 0.046;
      roundedRect(ctx, x - width * 0.0078, y, width * 0.0155, bodyH * 0.076, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(41,36,33,.95)";
  roundedRect(ctx, cx - width * 0.018, baseY - bodyH * 0.18, width * 0.036, bodyH * 0.20, 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,221,154,.12)";
  ctx.lineWidth = Math.max(1, w * 0.0008);
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.lineTo(cx, h * 0.665);
  ctx.stroke();
}

function drawStaticRocksAndFieldTexture(ctx, w, h) {
  for (let i = 0; i < 320; i += 1) {
    const x = seed(i, 801) * w;
    const y = h * (0.585 + seed(i, 802) * 0.395);
    const near = (y - h * 0.585) / (h * 0.395);
    const rx = w * (0.0025 + seed(i, 803) * 0.014) * lerp(0.55, 1.55, near);
    const ry = h * (0.0012 + seed(i, 804) * 0.0045) * lerp(0.55, 1.40, near);

    ctx.fillStyle = seed(i, 805) > 0.52
      ? `rgba(216,190,122,${0.055 + near * 0.060})`
      : `rgba(0,0,0,${0.035 + near * 0.055})`;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seed(i, 806) * Math.PI, 0, TAU);
    ctx.fill();
  }

  for (let i = 0; i < 70; i += 1) {
    const x = seed(i, 850) * w;
    const y = h * (0.62 + seed(i, 851) * 0.34);
    const s = h * (0.004 + seed(i, 852) * 0.018);
    const near = (y - h * 0.62) / (h * 0.34);

    ctx.fillStyle = `rgba(92,88,74,${0.18 + near * 0.20})`;
    ctx.beginPath();
    ctx.ellipse(x, y, s * 1.7, s * 0.75, seed(i, 853) * Math.PI, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(255,235,180,${0.030 + near * 0.055})`;
    ctx.beginPath();
    ctx.ellipse(x - s * 0.32, y - s * 0.18, s * 0.75, s * 0.22, -0.2, 0, TAU);
    ctx.fill();
  }
}

function drawStaticForegroundRocks(ctx, w, h) {
  const rocks = [
    [0.08, 0.925, 0.090, 0.045],
    [0.22, 0.985, 0.120, 0.060],
    [0.80, 0.935, 0.105, 0.070],
    [0.92, 0.980, 0.150, 0.080]
  ];

  for (const [cx, cy, sx, sy] of rocks) {
    const x = w * cx;
    const y = h * cy;
    const rx = w * sx;
    const ry = h * sy;

    const g = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.45, 0, x, y, Math.max(rx, ry));
    g.addColorStop(0, "rgba(144,136,116,.54)");
    g.addColorStop(0.58, "rgba(70,69,62,.58)");
    g.addColorStop(1, "rgba(24,23,22,.72)");
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seed(cx * 100, cy * 100) * 0.7, 0, TAU);
    ctx.fill();
  }
}

function drawDynamicOcean(ctx, w, h, t) {
  const top = h * 0.342;
  const bottom = h * 0.565;

  ctx.save();
  ctx.lineWidth = Math.max(1, w * 0.00082);

  for (let j = 0; j < 44; j += 1) {
    const y = lerp(top + h * 0.030, bottom - h * 0.024, j / 44);
    const alpha = Math.max(0.025, 0.17 - j * 0.0033);
    ctx.strokeStyle = `rgba(240,247,243,${alpha})`;
    ctx.beginPath();

    for (let i = 0; i <= 96; i += 1) {
      const x = (i / 96) * w;
      const wave =
        Math.sin(i * 0.78 + j * 0.50 + t * 0.85) * h * 0.0017 +
        Math.sin(i * 1.62 + t * 0.28) * h * 0.0010;

      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }

    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 190; i += 1) {
    const x = w * (0.44 + seed(i, 901) * 0.52);
    const y = h * (0.385 + seed(i, 902) * 0.145);
    const pulse = Math.max(0, Math.sin(t * 1.35 + i * 0.61));
    ctx.globalAlpha = 0.020 + pulse * 0.13;
    ctx.fillStyle = "rgba(255,239,192,.72)";
    ctx.beginPath();
    ctx.ellipse(x, y, w * (0.0011 + seed(i, 903) * 0.0042), h * 0.00075, -0.14, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawDynamicCloudsAndBirds(ctx, w, h, t) {
  ctx.save();

  for (let i = 0; i < 12; i += 1) {
    const x = ((seed(i, 950) + t * 0.0011 * (0.4 + seed(i, 951))) % 1) * w;
    const y = h * (0.035 + seed(i, 952) * 0.18);
    const rx = w * (0.025 + seed(i, 953) * 0.07);
    const ry = h * (0.005 + seed(i, 954) * 0.014);

    ctx.fillStyle = `rgba(255,255,255,${0.030 + seed(i, 955) * 0.06})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.05, 0, TAU);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(21,29,31,.50)";
  ctx.lineWidth = Math.max(1, w * 0.00075);

  for (let i = 0; i < 9; i += 1) {
    const x = ((seed(i, 970) + t * 0.015 * (0.04 + seed(i, 971) * 0.045)) % 1) * w;
    const y = h * (0.135 + seed(i, 972) * 0.18);
    const s = w * (0.0035 + seed(i, 973) * 0.0042);
    const flap = Math.sin(t * 2.3 + i) * s * 0.34;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.5, y - s * 0.5 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.5, y - s * 0.5 + flap, x + s, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDynamicVegetation(ctx, w, h, t) {
  ctx.save();

  for (let i = 0; i < 300; i += 1) {
    const x = seed(i, 1001) * w;
    const y = h * (0.585 + seed(i, 1002) * 0.405);
    const near = clamp((y - h * 0.585) / (h * 0.405), 0, 1);
    const scale = h * (0.0022 + seed(i, 1003) * lerp(0.009, 0.023, near));
    const sway = Math.sin(t * 0.75 + i * 0.69) * scale * lerp(0.42, 1.05, near);

    if (seed(i, 1004) > 0.88) {
      ctx.strokeStyle = `rgba(25,56,38,${0.24 + near * 0.22})`;
      ctx.lineWidth = Math.max(1, scale * 0.14);
      ctx.beginPath();
      ctx.moveTo(x, y + scale * 1.3);
      ctx.quadraticCurveTo(x + sway, y - scale * 0.25, x + sway * 1.5, y - scale * 2.8);
      ctx.stroke();

      ctx.fillStyle = `rgba(68,126,70,${0.20 + near * 0.24})`;
      ctx.beginPath();
      ctx.ellipse(x + sway * 1.5, y - scale * 2.7, scale * 2.0, scale * 0.95, 0.2, 0, TAU);
      ctx.fill();
      continue;
    }

    ctx.strokeStyle = seed(i, 1005) > 0.48
      ? `rgba(76,133,76,${0.18 + near * 0.26})`
      : `rgba(177,177,97,${0.14 + near * 0.20})`;

    ctx.lineWidth = Math.max(1, scale * 0.08);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + sway * 0.35, y - scale * 1.1, x + sway, y - scale * 2.25);
    ctx.stroke();

    if (seed(i, 1006) > 0.72) {
      ctx.fillStyle = seed(i, 1007) > 0.48
        ? `rgba(235,214,102,${0.20 + near * 0.18})`
        : `rgba(193,117,166,${0.16 + near * 0.16})`;
      ctx.beginPath();
      ctx.arc(x + sway, y - scale * 2.28, Math.max(1, scale * 0.20), 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawDynamicLightAndAtmosphere(ctx, w, h, t) {
  ctx.save();

  const glow = ctx.createRadialGradient(w * 0.86, h * 0.12, 0, w * 0.86, h * 0.12, w * 0.68);
  glow.addColorStop(0, "rgba(255,244,205,.20)");
  glow.addColorStop(0.38, "rgba(255,220,151,.09)");
  glow.addColorStop(1, "rgba(255,220,151,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const groundGlow = ctx.createLinearGradient(0, h * 0.50, w, h);
  groundGlow.addColorStop(0, "rgba(0,0,0,0)");
  groundGlow.addColorStop(0.65, "rgba(255,218,137,.045)");
  groundGlow.addColorStop(1, "rgba(255,218,137,.10)");
  ctx.fillStyle = groundGlow;
  ctx.fillRect(0, h * 0.42, w, h * 0.58);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.50, h * 0.24, w * 0.50, h * 0.50, w * 0.86);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.80, "rgba(0,0,0,.04)");
  vignette.addColorStop(1, "rgba(0,0,0,.32)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

function drawFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas) return;

  if (time - state.lastFrame < state.targetFrameMs) {
    state.raf = requestAnimationFrame(drawFrame);
    return;
  }

  state.lastFrame = time;

  const { width, height } = resizeCanvas();
  ensureStaticLayer(width, height);

  const ctx = state.ctx;
  const t = (time - state.startedAt) / 1000;

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(state.staticLayer, 0, 0);
  drawDynamicOcean(ctx, width, height, t);
  drawDynamicCloudsAndBirds(ctx, width, height, t);
  drawDynamicVegetation(ctx, width, height, t);
  drawDynamicLightAndAtmosphere(ctx, width, height, t);

  state.receipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/h-earth/",
    parentBaseline: "/showroom/globe/",
    parentMutation: false,
    rendered: true,
    renderMode: "layered-cinematic-live",
    staticImageSource: false,
    waterBehindManor: true,
    elevatedInlandView: true,
    oceanShimmer: true,
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

  setStatus("Layered cinematic renderer active.");
  markDocument({ rendered: "true" });
  state.raf = requestAnimationFrame(drawFrame);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
  init();
}

export default init;
