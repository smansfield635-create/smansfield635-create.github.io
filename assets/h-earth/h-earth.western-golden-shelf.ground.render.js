// /assets/h-earth/h-earth.western-golden-shelf.ground.render.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_LIVE_WORLD_RENDER_TNT_v5
// Owns: live procedural Western Golden Shelf ground world render.
// No static image source. No PNG dependency. No proof labels. No GraphicBox.
// Holds: final architecture, final Estate buildout, roads, city, and final Diamond Gate Bridge object.

export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION = "h-earth-western-golden-shelf-live-world-render-v5";
export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_LIVE_WORLD_RENDER_TNT_v5";

const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seed(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
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
  ctx.closePath();
}

function drawSky(ctx, w, h, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "rgb(111,132,143)");
  sky.addColorStop(0.22, "rgb(178,186,180)");
  sky.addColorStop(0.48, "rgb(219,201,166)");
  sky.addColorStop(0.78, "rgb(112,126,119)");
  sky.addColorStop(1, "rgb(54,70,61)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.79;
  const sunY = h * 0.12;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.55);
  sun.addColorStop(0, "rgba(255,238,194,0.52)");
  sun.addColorStop(0.22, "rgba(255,221,151,0.30)");
  sun.addColorStop(0.62, "rgba(255,205,125,0.08)");
  sun.addColorStop(1, "rgba(255,205,125,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.26;
  for (let i = 0; i < 22; i += 1) {
    const x = seed(i, 14) * w;
    const y = h * (0.05 + seed(i, 15) * 0.22);
    const rx = w * (0.03 + seed(i, 16) * 0.07);
    const ry = h * (0.006 + seed(i, 17) * 0.016);
    const drift = Math.sin(t * 0.035 + i) * w * 0.012;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.28)" : "rgba(245,248,250,0.16)";
    ctx.beginPath();
    ctx.ellipse(x + drift, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawDistantIslets(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(23,32,35,0.62)";

  const islands = [
    [0.08, 0.37, 0.06, 0.045],
    [0.30, 0.355, 0.035, 0.026],
    [0.59, 0.36, 0.046, 0.030],
    [0.84, 0.345, 0.052, 0.040],
    [0.93, 0.37, 0.024, 0.018]
  ];

  for (const [cx, cy, sx, sy] of islands) {
    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);
    ctx.lineTo(w * (cx - sx * 0.42), h * (cy - sy * 0.52));
    ctx.lineTo(w * (cx - sx * 0.16), h * (cy - sy * 0.28));
    ctx.lineTo(w * cx, h * (cy - sy));
    ctx.lineTo(w * (cx + sx * 0.36), h * (cy - sy * 0.34));
    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawOcean(ctx, w, h, t) {
  const top = h * 0.365;
  const bottom = h * 0.585;

  const ocean = ctx.createLinearGradient(0, top, 0, bottom);
  ocean.addColorStop(0, "rgba(79,130,139,0.98)");
  ocean.addColorStop(0.35, "rgba(43,103,128,0.97)");
  ocean.addColorStop(0.72, "rgba(32,85,112,0.98)");
  ocean.addColorStop(1, "rgba(19,68,94,0.98)");

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let i = 0; i <= 72; i += 1) {
    const x = (i / 72) * w;
    const y = top + Math.sin(i * 0.43 + t * 0.42) * h * 0.003 + Math.sin(i * 1.7 + t * 0.18) * h * 0.0017;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, bottom);
  ctx.lineTo(0, bottom);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.lineWidth = Math.max(1, w * 0.001);
  for (let j = 0; j < 22; j += 1) {
    const y = lerp(top + h * 0.035, bottom - h * 0.018, j / 22);
    const alpha = 0.16 - j * 0.004;
    ctx.strokeStyle = `rgba(238,246,242,${alpha})`;
    ctx.beginPath();
    for (let i = 0; i <= 72; i += 1) {
      const x = (i / 72) * w;
      const wave = Math.sin(i * 0.92 + j * 0.5 + t * 0.9) * h * 0.0022;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 75; i += 1) {
    const x = w * (0.48 + seed(i, 44) * 0.47);
    const y = h * (0.39 + seed(i, 45) * 0.15);
    const pulse = Math.max(0, Math.sin(t * 1.25 + i * 0.61));
    ctx.globalAlpha = 0.05 + pulse * 0.18;
    ctx.fillStyle = "rgba(255,237,186,0.58)";
    ctx.beginPath();
    ctx.ellipse(x, y, w * (0.0015 + seed(i, 46) * 0.004), h * 0.0009, -0.16, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawShoreline(ctx, w, h, t) {
  const y = h * 0.585;

  const beach = ctx.createLinearGradient(0, y - h * 0.04, 0, y + h * 0.08);
  beach.addColorStop(0, "rgba(184,166,103,0.08)");
  beach.addColorStop(0.28, "rgba(214,184,119,0.36)");
  beach.addColorStop(0.58, "rgba(133,113,70,0.25)");
  beach.addColorStop(1, "rgba(68,75,47,0)");
  ctx.fillStyle = beach;

  ctx.beginPath();
  ctx.moveTo(0, y - h * 0.022);
  for (let i = 0; i <= 80; i += 1) {
    const x = (i / 80) * w;
    const yy = y + Math.sin(i * 0.52 + t * 0.25) * h * 0.004 + Math.sin(i * 1.2) * h * 0.002;
    ctx.lineTo(x, yy);
  }
  ctx.lineTo(w, y + h * 0.075);
  ctx.lineTo(0, y + h * 0.070);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,235,182,0.34)";
  ctx.lineWidth = Math.max(1, w * 0.0011);
  ctx.beginPath();
  for (let i = 0; i <= 80; i += 1) {
    const x = (i / 80) * w;
    const yy = y + Math.sin(i * 0.56 + t * 0.58) * h * 0.003;
    if (i === 0) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.stroke();
}

function drawTerrain(ctx, w, h, t) {
  const top = h * 0.555;

  const ground = ctx.createLinearGradient(0, top, 0, h);
  ground.addColorStop(0, "rgb(137,126,70)");
  ground.addColorStop(0.25, "rgb(94,104,62)");
  ground.addColorStop(0.55, "rgb(56,78,50)");
  ground.addColorStop(0.78, "rgb(36,57,40)");
  ground.addColorStop(1, "rgb(19,31,26)");

  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 80; i += 1) {
    const x = (i / 80) * w;
    const y = top + Math.sin(i * 0.47) * h * 0.011 + Math.sin(i * 1.3 + 0.5) * h * 0.006;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.save();

  for (let j = 0; j < 26; j += 1) {
    const y = h * (0.63 + j * 0.015);
    ctx.strokeStyle = `rgba(234,205,139,${0.055 - j * 0.0012})`;
    ctx.lineWidth = Math.max(1, w * 0.0008);
    ctx.beginPath();
    for (let i = 0; i <= 50; i += 1) {
      const x = (i / 50) * w;
      const yy = y + Math.sin(i * 0.86 + j * 0.37) * h * 0.003 + Math.sin(i * 1.7) * h * 0.0018;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 160; i += 1) {
    const x = seed(i, 80) * w;
    const y = h * (0.60 + seed(i, 81) * 0.36);
    const r = h * (0.0015 + seed(i, 82) * 0.0045);
    ctx.fillStyle = seed(i, 83) > 0.55 ? "rgba(220,190,117,0.13)" : "rgba(0,0,0,0.13)";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.4, r * 0.72, seed(i, 84) * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();

  const path = ctx.createLinearGradient(w * 0.5, h * 0.64, w * 0.5, h);
  path.addColorStop(0, "rgba(218,190,128,0.08)");
  path.addColorStop(0.5, "rgba(125,100,61,0.22)");
  path.addColorStop(1, "rgba(227,202,142,0.16)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.47, h * 0.66);
  ctx.bezierCurveTo(w * 0.41, h * 0.76, w * 0.36, h * 0.88, w * 0.28, h);
  ctx.lineTo(w * 0.64, h);
  ctx.bezierCurveTo(w * 0.57, h * 0.88, w * 0.54, h * 0.76, w * 0.53, h * 0.66);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,230,166,0.13)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  ctx.beginPath();
  ctx.moveTo(w * 0.47, h * 0.66);
  ctx.bezierCurveTo(w * 0.41, h * 0.76, w * 0.36, h * 0.88, w * 0.28, h);
  ctx.moveTo(w * 0.53, h * 0.66);
  ctx.bezierCurveTo(w * 0.57, h * 0.76, w * 0.61, h * 0.88, w * 0.64, h);
  ctx.stroke();
}

function drawManor(ctx, w, h) {
  const cx = w * 0.50;
  const baseY = h * 0.615;
  const width = w * 0.40;
  const height = h * 0.20;

  ctx.save();

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.025, 0, cx, baseY + h * 0.04, width * 0.82);
  contact.addColorStop(0, "rgba(0,0,0,0.45)");
  contact.addColorStop(0.65, "rgba(0,0,0,0.19)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.032, width * 0.82, h * 0.045, 0, 0, TAU);
  ctx.fill();

  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.55;

  const wall = ctx.createLinearGradient(cx - width * 0.55, bodyTop, cx + width * 0.55, baseY);
  wall.addColorStop(0, "rgb(71,63,52)");
  wall.addColorStop(0.34, "rgb(147,123,82)");
  wall.addColorStop(0.56, "rgb(180,146,88)");
  wall.addColorStop(0.82, "rgb(82,70,58)");
  wall.addColorStop(1, "rgb(40,36,34)");

  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(235,203,137,0.38)";
  ctx.lineWidth = Math.max(1, w * 0.0014);

  function rect(x, y, rw, rh, r = Math.max(2, w * 0.004)) {
    roundedRect(ctx, x, y, rw, rh, r);
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.31, bodyTop + bodyH * 0.16, width * 0.62, bodyH * 0.86);
  rect(cx - width * 0.16, bodyTop - bodyH * 0.02, width * 0.32, bodyH * 1.06);
  rect(cx - width * 0.51, bodyTop + bodyH * 0.32, width * 0.22, bodyH * 0.70);
  rect(cx + width * 0.29, bodyTop + bodyH * 0.32, width * 0.22, bodyH * 0.70);

  ctx.fillStyle = "rgb(48,39,35)";
  ctx.strokeStyle = "rgba(245,218,164,0.32)";

  function poly(points, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  poly([
    [cx - width * 0.36, bodyTop + bodyH * 0.16],
    [cx, bodyTop - height * 0.22],
    [cx + width * 0.36, bodyTop + bodyH * 0.16]
  ], "rgb(58,47,39)");

  poly([
    [cx - width * 0.18, bodyTop - bodyH * 0.02],
    [cx, bodyTop - height * 0.29],
    [cx + width * 0.18, bodyTop - bodyH * 0.02]
  ], "rgb(42,36,34)");

  poly([
    [cx - width * 0.55, bodyTop + bodyH * 0.32],
    [cx - width * 0.40, bodyTop + bodyH * 0.10],
    [cx - width * 0.25, bodyTop + bodyH * 0.32]
  ], "rgb(54,45,39)");

  poly([
    [cx + width * 0.25, bodyTop + bodyH * 0.32],
    [cx + width * 0.40, bodyTop + bodyH * 0.10],
    [cx + width * 0.55, bodyTop + bodyH * 0.32]
  ], "rgb(54,45,39)");

  ctx.fillStyle = "rgba(255,214,137,0.78)";
  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (0.28 + floor * 0.21);
    for (let i = -4; i <= 4; i += 1) {
      if (i === 0 && floor > 0) continue;
      const x = cx + i * width * 0.065;
      roundedRect(ctx, x - width * 0.012, y, width * 0.024, bodyH * 0.082, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(17,14,13,0.94)";
  roundedRect(ctx, cx - width * 0.035, baseY - bodyH * 0.26, width * 0.07, bodyH * 0.26, 4);
  ctx.fill();

  const rim = ctx.createLinearGradient(cx - width * 0.45, bodyTop, cx + width * 0.48, bodyTop);
  rim.addColorStop(0, "rgba(255,230,170,0)");
  rim.addColorStop(0.68, "rgba(255,230,170,0.12)");
  rim.addColorStop(1, "rgba(255,230,170,0.34)");
  ctx.fillStyle = rim;
  roundedRect(ctx, cx - width * 0.56, bodyTop - height * 0.04, width * 1.12, height * 0.68, 8);
  ctx.fill();

  ctx.restore();
}

function drawVegetation(ctx, w, h, t) {
  ctx.save();

  for (let i = 0; i < 130; i += 1) {
    const x = seed(i, 110) * w;
    const y = h * (0.58 + seed(i, 111) * 0.38);
    const near = y > h * 0.78;
    const scale = h * (0.004 + seed(i, 112) * (near ? 0.017 : 0.010));
    const sway = Math.sin(t * 0.75 + i * 0.7) * scale * 0.7;

    if (seed(i, 113) > 0.78) {
      ctx.strokeStyle = "rgba(28,58,38,0.45)";
      ctx.lineWidth = Math.max(1, scale * 0.20);
      ctx.beginPath();
      ctx.moveTo(x, y + scale * 1.5);
      ctx.quadraticCurveTo(x + sway, y - scale * 0.4, x + sway * 1.6, y - scale * 2.7);
      ctx.stroke();

      ctx.fillStyle = near ? "rgba(63,121,67,0.48)" : "rgba(71,132,75,0.30)";
      ctx.beginPath();
      ctx.ellipse(x + sway * 1.8, y - scale * 2.8, scale * 2.0, scale * 1.1, 0.2, 0, TAU);
      ctx.fill();
    } else {
      ctx.fillStyle = seed(i, 114) > 0.45
        ? `rgba(73,133,75,${near ? 0.34 : 0.22})`
        : `rgba(166,172,94,${near ? 0.30 : 0.17})`;
      ctx.beginPath();
      ctx.ellipse(x + sway, y, scale * 2.2, scale * 0.55, seed(i, 115), 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawWildlife(ctx, w, h, t) {
  ctx.save();

  const birdPhase = (t * 0.025) % 1;
  for (let i = 0; i < 7; i += 1) {
    const x = ((seed(i, 210) + birdPhase * (0.06 + seed(i, 211) * 0.05)) % 1) * w;
    const y = h * (0.12 + seed(i, 212) * 0.17);
    const s = w * (0.004 + seed(i, 213) * 0.004);
    const flap = Math.sin(t * 2.2 + i) * s * 0.35;

    ctx.strokeStyle = "rgba(21,29,31,0.46)";
    ctx.lineWidth = Math.max(1, s * 0.22);
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.5, y - s * 0.5 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.5, y - s * 0.5 + flap, x + s, y);
    ctx.stroke();
  }

  const deerX = w * (0.18 + Math.sin(t * 0.08) * 0.012);
  const deerY = h * 0.705;
  const s = w * 0.010;
  ctx.fillStyle = "rgba(42,31,24,0.33)";
  ctx.beginPath();
  ctx.ellipse(deerX, deerY, s * 1.8, s * 0.65, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(deerX + s * 1.6, deerY - s * 0.5, s * 0.55, s * 0.45, 0, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function drawAtmosphere(ctx, w, h) {
  const haze = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.63);
  haze.addColorStop(0, "rgba(255,244,219,0.06)");
  haze.addColorStop(0.45, "rgba(255,235,186,0.08)");
  haze.addColorStop(1, "rgba(255,235,186,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.32, w, h * 0.34);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.48, h * 0.22, w * 0.50, h * 0.48, w * 0.84);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.78, "rgba(0,0,0,0.04)");
  vignette.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

export function renderWesternGoldenShelfGroundScene(canvas, options = {}) {
  const ctx = canvas?.getContext?.("2d", { alpha: false });
  if (!canvas || !ctx) return null;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(options.dpr || window.devicePixelRatio || 1, 2);
  const width = Math.max(960, Math.floor((box.width || 1080) * dpr));
  const height = Math.max(1280, Math.floor((box.height || 1440) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const time = Number.isFinite(options.time) ? options.time : performance.now() / 1000;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  drawSky(ctx, width, height, time);
  drawDistantIslets(ctx, width, height);
  drawOcean(ctx, width, height, time);
  drawShoreline(ctx, width, height, time);
  drawTerrain(ctx, width, height, time);
  drawManor(ctx, width, height);
  drawVegetation(ctx, width, height, time);
  drawWildlife(ctx, width, height, time);
  drawAtmosphere(ctx, width, height);

  return Object.freeze({
    contract: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,
    version: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
    renderer: "live-procedural-4k-world",
    rendered: true,
    staticImageDependency: false,
    pngDependency: false,
    liveWaterMotion: true,
    windReactiveVegetation: true,
    wildlifeMotion: true,
    goldenHourLighting: true,
    atmosphericDepth: true,
    waterBehindManor: true,
    cameraFacing: "west-southwest",
    finalArchitectureAuthorized: false,
    estateFinalizationAuthorized: false,
    bridgeFinalizationAuthorized: false,
    roadPlacementAuthorized: false,
    cityPlacementAuthorized: false
  });
}

export function createWesternGoldenShelfGroundRenderer(canvas, options = {}) {
  let raf = 0;
  let lastReceipt = null;
  let lastFrame = 0;
  const targetFrameMs = options.targetFrameMs || 50;

  function draw(time = performance.now()) {
    if (time - lastFrame >= targetFrameMs) {
      lastFrame = time;
      lastReceipt = renderWesternGoldenShelfGroundScene(canvas, {
        ...options,
        time: time / 1000
      });
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (!raf) raf = requestAnimationFrame(draw);
    return api;
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    return api;
  }

  function status() {
    return Object.freeze({
      contract: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,
      version: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
      running: Boolean(raf),
      lastReceipt,
      renderer: "live-procedural-4k-world",
      staticImageDependency: false,
      waterBehindManor: true,
      cameraFacing: "west-southwest",
      finalArchitectureAuthorized: false
    });
  }

  const api = Object.freeze({
    start,
    stop,
    status,
    draw: () => renderWesternGoldenShelfGroundScene(canvas, options)
  });

  return api;
}

export default createWesternGoldenShelfGroundRenderer;
