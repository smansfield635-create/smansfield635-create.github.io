// /assets/h-earth/h-earth.western-golden-shelf.ground.render.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1
// Owns: code-rendered ground-level Western Golden Shelf view with water behind the Manor.
// No image generation. No GraphicBox. Canvas render only.

import {
  H_EARTH_MANOR_SPEC_VERSION,
  getRichManorPlacementSpec
} from "/assets/h-earth/h-earth.manor.spec.js?v=h-earth-manor-spec-placement-adapter-v1";

export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION = "h-earth-western-golden-shelf-ground-render-v1";
export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1";

const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function rgba(r, g, b, a) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function drawSky(ctx, w, h, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, "rgba(5, 12, 28, 1)");
  sky.addColorStop(0.34, "rgba(22, 38, 62, 1)");
  sky.addColorStop(0.68, "rgba(82, 74, 62, 1)");
  sky.addColorStop(1, "rgba(126, 94, 58, 1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.64;
  const sunY = h * 0.29;
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.54);
  glow.addColorStop(0, "rgba(255,224,146,0.34)");
  glow.addColorStop(0.18, "rgba(244,207,131,0.18)");
  glow.addColorStop(0.55, "rgba(132,166,188,0.07)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.20;
  ctx.strokeStyle = "rgba(238,244,255,0.38)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 97) % 100) / 100 * w;
    const y = (((i * 53) % 32) / 100) * h;
    const r = 1 + ((i * 17) % 4);
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
  }
  ctx.restore();

  const cloudY = h * 0.22 + Math.sin(time * 0.18) * h * 0.01;
  ctx.fillStyle = "rgba(238,244,255,0.045)";
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 131) % 120) / 120 * w;
    const y = cloudY + Math.sin(i * 1.7) * h * 0.035;
    const rx = w * (0.035 + (i % 3) * 0.010);
    const ry = h * (0.010 + (i % 2) * 0.006);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }
}

function drawWaterBehindManor(ctx, w, h, time) {
  const horizon = h * 0.505;
  const waterTop = h * 0.455;
  const waterBottom = h * 0.655;

  const water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  water.addColorStop(0, "rgba(54, 115, 126, 0.92)");
  water.addColorStop(0.42, "rgba(30, 83, 104, 0.88)");
  water.addColorStop(1, "rgba(12, 38, 62, 0.82)");

  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(0, waterTop);
  for (let i = 0; i <= 40; i += 1) {
    const x = (i / 40) * w;
    const y =
      waterTop +
      Math.sin(i * 0.55 + time * 0.52) * h * 0.005 +
      Math.sin(i * 1.7 + time * 0.24) * h * 0.002;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, waterBottom);
  ctx.lineTo(0, waterBottom);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.36)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  for (let j = 0; j < 9; j += 1) {
    const y = lerp(horizon, waterBottom, j / 9);
    ctx.globalAlpha = 0.11 - j * 0.008;
    ctx.beginPath();
    for (let i = 0; i <= 32; i += 1) {
      const x = (i / 32) * w;
      const wave = Math.sin(i * 1.4 + j * 0.7 + time * 0.9) * h * 0.003;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const reflection = ctx.createRadialGradient(w * 0.63, h * 0.50, 0, w * 0.63, h * 0.55, w * 0.33);
  reflection.addColorStop(0, "rgba(255,226,151,0.24)");
  reflection.addColorStop(0.24, "rgba(244,207,131,0.12)");
  reflection.addColorStop(1, "rgba(244,207,131,0)");
  ctx.fillStyle = reflection;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);
}

function drawDistantHighlands(ctx, w, h) {
  const base = h * 0.475;

  ctx.fillStyle = "rgba(11, 22, 27, 0.72)";
  ctx.beginPath();
  ctx.moveTo(0, base);
  for (let i = 0; i <= 24; i += 1) {
    const x = (i / 24) * w;
    const y = base - Math.sin(i * 0.8) * h * 0.035 - Math.sin(i * 1.9) * h * 0.018;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.58);
  ctx.lineTo(0, h * 0.58);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(34, 55, 48, 0.42)";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.50);
  for (let i = 0; i <= 22; i += 1) {
    const x = (i / 22) * w;
    const y = h * 0.50 - Math.sin(i * 1.05 + 1.4) * h * 0.020;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.60);
  ctx.lineTo(0, h * 0.60);
  ctx.closePath();
  ctx.fill();
}

function drawShelfTerrain(ctx, w, h) {
  const shelfTop = h * 0.595;
  const grd = ctx.createLinearGradient(0, shelfTop, 0, h);
  grd.addColorStop(0, "rgba(146, 122, 68, 0.96)");
  grd.addColorStop(0.34, "rgba(72, 88, 60, 0.97)");
  grd.addColorStop(0.72, "rgba(29, 42, 34, 1)");
  grd.addColorStop(1, "rgba(11, 18, 18, 1)");

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(0, shelfTop);
  for (let i = 0; i <= 30; i += 1) {
    const x = (i / 30) * w;
    const y = shelfTop + Math.sin(i * 0.9) * h * 0.012 + (i / 30 - 0.5) * h * 0.026;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.10)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  for (let j = 0; j < 12; j += 1) {
    const y = h * (0.66 + j * 0.032);
    ctx.beginPath();
    for (let i = 0; i <= 18; i += 1) {
      const x = (i / 18) * w;
      const yy = y + Math.sin(i * 1.2 + j) * h * 0.006;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}

function drawVegetation(ctx, w, h, time) {
  ctx.save();
  for (let i = 0; i < 46; i += 1) {
    const x = (((i * 71) % 100) / 100) * w;
    const y = h * (0.61 + (((i * 37) % 34) / 100));
    const scale = h * (0.012 + ((i * 19) % 9) / 1000);
    const sway = Math.sin(time * 0.7 + i) * scale * 0.16;

    ctx.fillStyle = i % 5 === 0 ? "rgba(167, 184, 106, 0.24)" : "rgba(68, 130, 82, 0.24)";
    ctx.beginPath();
    ctx.ellipse(x + sway, y, scale * 1.9, scale * 0.72, 0, 0, TAU);
    ctx.fill();

    if (i % 7 === 0) {
      ctx.strokeStyle = "rgba(31, 58, 42, 0.36)";
      ctx.lineWidth = Math.max(1, w * 0.001);
      ctx.beginPath();
      ctx.moveTo(x, y + scale);
      ctx.lineTo(x + sway * 0.3, y - scale * 1.9);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawBuildZoneField(ctx, w, h) {
  const cx = w * 0.50;
  const cy = h * 0.705;
  const rx = w * 0.285;
  const ry = h * 0.055;

  ctx.save();
  ctx.strokeStyle = "rgba(167,243,198,0.58)";
  ctx.fillStyle = "rgba(167,243,198,0.045)";
  ctx.lineWidth = Math.max(1.5, w * 0.002);
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, -0.05, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(244,207,131,0.28)";
  ctx.beginPath();
  ctx.moveTo(cx, cy + h * 0.145);
  ctx.lineTo(cx, cy - h * 0.18);
  ctx.stroke();

  ctx.fillStyle = "rgba(238,244,255,0.72)";
  ctx.font = `${Math.max(11, w * 0.014)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("CONTROLLED MANOR PLACEMENT FIELD", cx - rx * 0.70, cy + ry + h * 0.036);
  ctx.restore();
}

function drawManor(ctx, w, h) {
  const manor = getRichManorPlacementSpec();
  const cx = w * 0.50;
  const baseY = h * 0.672;
  const width = w * 0.34;
  const height = h * 0.205;

  ctx.save();

  const shadow = ctx.createRadialGradient(cx, baseY + h * 0.018, 0, cx, baseY + h * 0.03, width * 0.72);
  shadow.addColorStop(0, "rgba(0,0,0,0.45)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.035, width * 0.74, h * 0.045, 0, 0, TAU);
  ctx.fill();

  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.52;

  const body = ctx.createLinearGradient(cx - width * 0.5, bodyTop, cx + width * 0.5, baseY);
  body.addColorStop(0, "rgba(70, 55, 40, 0.98)");
  body.addColorStop(0.40, "rgba(162, 129, 76, 0.98)");
  body.addColorStop(0.72, "rgba(104, 80, 54, 0.98)");
  body.addColorStop(1, "rgba(39, 31, 28, 0.98)");

  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(244,207,131,0.46)";
  ctx.lineWidth = Math.max(1.4, w * 0.0016);

  function rect(x, y, rw, rh) {
    ctx.beginPath();
    ctx.roundRect(x, y, rw, rh, Math.max(2, w * 0.004));
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.36, bodyTop + bodyH * 0.16, width * 0.72, bodyH * 0.82);
  rect(cx - width * 0.16, bodyTop - bodyH * 0.06, width * 0.32, bodyH * 1.05);
  rect(cx - width * 0.50, bodyTop + bodyH * 0.31, width * 0.18, bodyH * 0.64);
  rect(cx + width * 0.32, bodyTop + bodyH * 0.31, width * 0.18, bodyH * 0.64);

  ctx.fillStyle = "rgba(27, 22, 24, 1)";
  ctx.strokeStyle = "rgba(244,207,131,0.40)";

  function roof(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  roof([
    [cx - width * 0.41, bodyTop + bodyH * 0.18],
    [cx, bodyTop - height * 0.20],
    [cx + width * 0.41, bodyTop + bodyH * 0.18]
  ]);

  roof([
    [cx - width * 0.19, bodyTop - bodyH * 0.04],
    [cx, bodyTop - height * 0.28],
    [cx + width * 0.19, bodyTop - bodyH * 0.04]
  ]);

  roof([
    [cx - width * 0.55, bodyTop + bodyH * 0.31],
    [cx - width * 0.41, bodyTop + bodyH * 0.09],
    [cx - width * 0.27, bodyTop + bodyH * 0.31]
  ]);

  roof([
    [cx + width * 0.27, bodyTop + bodyH * 0.31],
    [cx + width * 0.41, bodyTop + bodyH * 0.09],
    [cx + width * 0.55, bodyTop + bodyH * 0.31]
  ]);

  ctx.fillStyle = "rgba(244,207,131,0.72)";
  ctx.strokeStyle = "rgba(255,240,184,0.30)";
  ctx.lineWidth = Math.max(0.8, w * 0.0008);

  for (let floor = 0; floor < 4; floor += 1) {
    const y = bodyTop + bodyH * (0.25 + floor * 0.18);
    for (let i = -3; i <= 3; i += 1) {
      if (i === 0 && floor > 1) continue;
      const x = cx + i * width * 0.085;
      ctx.beginPath();
      ctx.roundRect(x - width * 0.016, y, width * 0.032, bodyH * 0.075, 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.fillStyle = "rgba(12, 10, 12, 0.92)";
  ctx.beginPath();
  ctx.roundRect(cx - width * 0.035, baseY - bodyH * 0.25, width * 0.07, bodyH * 0.25, 4);
  ctx.fill();

  ctx.strokeStyle = "rgba(167,243,198,0.30)";
  ctx.lineWidth = Math.max(1, w * 0.0013);
  ctx.setLineDash([6, 7]);
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.20, baseY + h * 0.016);
  ctx.lineTo(cx + width * 0.20, baseY + h * 0.016);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(238,244,255,0.76)";
  ctx.font = `${Math.max(11, w * 0.013)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("RICH MANOR · EXISTING SPEC PLACED", cx - width * 0.34, baseY + h * 0.058);

  if (manor.knownCanon.vaultKnown) {
    ctx.fillStyle = "rgba(167,243,198,0.70)";
    ctx.fillText("vault preserved below ground", cx - width * 0.20, baseY + h * 0.083);
  }

  ctx.restore();
}

function drawForegroundPath(ctx, w, h) {
  ctx.save();

  const path = ctx.createLinearGradient(w * 0.48, h * 0.70, w * 0.50, h);
  path.addColorStop(0, "rgba(244,207,131,0.12)");
  path.addColorStop(0.55, "rgba(122,94,50,0.20)");
  path.addColorStop(1, "rgba(244,207,131,0.05)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.46, h * 0.70);
  ctx.bezierCurveTo(w * 0.42, h * 0.80, w * 0.36, h * 0.90, w * 0.28, h);
  ctx.lineTo(w * 0.72, h);
  ctx.bezierCurveTo(w * 0.62, h * 0.90, w * 0.56, h * 0.80, w * 0.54, h * 0.70);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.14)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  ctx.beginPath();
  ctx.moveTo(w * 0.46, h * 0.70);
  ctx.bezierCurveTo(w * 0.42, h * 0.80, w * 0.36, h * 0.90, w * 0.28, h);
  ctx.moveTo(w * 0.54, h * 0.70);
  ctx.bezierCurveTo(w * 0.58, h * 0.80, w * 0.64, h * 0.90, w * 0.72, h);
  ctx.stroke();

  ctx.restore();
}

export function renderWesternGoldenShelfGroundScene(canvas, options = {}) {
  const ctx = canvas?.getContext?.("2d", { alpha: false });
  if (!canvas || !ctx) return null;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(options.dpr || window.devicePixelRatio || 1, 1.5);
  const width = Math.max(320, Math.floor((box.width || 900) * dpr));
  const height = Math.max(360, Math.floor((box.height || 520) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const time = Number.isFinite(options.time) ? options.time : performance.now() / 1000;

  drawSky(ctx, width, height, time);
  drawDistantHighlands(ctx, width, height);
  drawWaterBehindManor(ctx, width, height, time);
  drawShelfTerrain(ctx, width, height);
  drawBuildZoneField(ctx, width, height);
  drawManor(ctx, width, height);
  drawVegetation(ctx, width, height, time);
  drawForegroundPath(ctx, width, height);

  return Object.freeze({
    contract: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,
    version: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
    manorSpecVersion: H_EARTH_MANOR_SPEC_VERSION,
    rendered: true,
    waterBehindManor: true,
    cameraFacing: "west-southwest",
    manorGroundPlacementAuthorized: true,
    finalArchitectureAuthorized: false
  });
}

export function createWesternGoldenShelfGroundRenderer(canvas, options = {}) {
  let raf = 0;
  let lastReceipt = null;

  function draw(time = performance.now()) {
    lastReceipt = renderWesternGoldenShelfGroundScene(canvas, {
      ...options,
      time: time / 1000
    });
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
      manorSpecVersion: H_EARTH_MANOR_SPEC_VERSION,
      running: Boolean(raf),
      lastReceipt,
      waterBehindManor: true,
      cameraFacing: "west-southwest",
      finalArchitectureAuthorized: false
    });
  }

  const api = Object.freeze({ start, stop, status, draw: () => renderWesternGoldenShelfGroundScene(canvas, options) });
  return api;
}

export default createWesternGoldenShelfGroundRenderer;
