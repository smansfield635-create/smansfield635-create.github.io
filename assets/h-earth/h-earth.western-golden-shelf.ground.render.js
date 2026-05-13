// /assets/h-earth/h-earth.western-golden-shelf.ground.render.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_DEFINITION_TNT_v2
// Owns: higher-definition code-rendered Western Golden Shelf ground view with water behind the Manor.
// No image generation. No GraphicBox. Canvas render only.
// Holds: final architecture, final Estate buildout, final Diamond Gate Bridge object, roads, and city.

import {
  H_EARTH_MANOR_SPEC_VERSION,
  getRichManorPlacementSpec
} from "/assets/h-earth/h-earth.manor.spec.js?v=h-earth-manor-spec-placement-adapter-v1";

export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION = "h-earth-western-golden-shelf-ground-definition-v2";
export const H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_DEFINITION_TNT_v2";

const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seeded(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function drawSky(ctx, w, h, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.74);
  sky.addColorStop(0, "rgba(4, 10, 25, 1)");
  sky.addColorStop(0.30, "rgba(20, 35, 60, 1)");
  sky.addColorStop(0.58, "rgba(72, 68, 66, 1)");
  sky.addColorStop(0.82, "rgba(126, 92, 55, 1)");
  sky.addColorStop(1, "rgba(165, 116, 64, 1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * 0.64;
  const sunY = h * 0.28;

  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.60);
  glow.addColorStop(0, "rgba(255, 230, 166, 0.38)");
  glow.addColorStop(0.18, "rgba(244, 207, 131, 0.22)");
  glow.addColorStop(0.44, "rgba(118, 150, 178, 0.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const haze = ctx.createLinearGradient(0, h * 0.36, 0, h * 0.66);
  haze.addColorStop(0, "rgba(238,244,255,0)");
  haze.addColorStop(0.54, "rgba(238,244,255,0.080)");
  haze.addColorStop(1, "rgba(238,244,255,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.32, w, h * 0.36);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(238,244,255,0.42)";
  ctx.lineWidth = Math.max(1, w * 0.0011);

  for (let i = 0; i < 34; i += 1) {
    const x = seeded(i, 3) * w;
    const y = seeded(i, 7) * h * 0.34;
    const r = 1 + seeded(i, 11) * 3.4;

    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(238,244,255,0.046)";
  for (let i = 0; i < 13; i += 1) {
    const x = ((i * 131) % 130) / 130 * w;
    const y = h * (0.16 + seeded(i, 5) * 0.22) + Math.sin(time * 0.12 + i) * h * 0.006;
    const rx = w * (0.038 + seeded(i, 6) * 0.032);
    const ry = h * (0.008 + seeded(i, 8) * 0.009);

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawDistantHighlands(ctx, w, h) {
  const base = h * 0.475;

  ctx.fillStyle = "rgba(8, 18, 24, 0.78)";
  ctx.beginPath();
  ctx.moveTo(0, base);

  for (let i = 0; i <= 38; i += 1) {
    const x = (i / 38) * w;
    const y =
      base -
      Math.sin(i * 0.62) * h * 0.030 -
      Math.sin(i * 1.53 + 0.8) * h * 0.020 -
      seeded(i, 22) * h * 0.018;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h * 0.58);
  ctx.lineTo(0, h * 0.58);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(28, 53, 48, 0.46)";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.505);

  for (let i = 0; i <= 34; i += 1) {
    const x = (i / 34) * w;
    const y = h * 0.505 - Math.sin(i * 0.94 + 1.4) * h * 0.016 - seeded(i, 31) * h * 0.010;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h * 0.61);
  ctx.lineTo(0, h * 0.61);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.10)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  ctx.beginPath();

  for (let i = 0; i <= 26; i += 1) {
    const x = (i / 26) * w;
    const y = h * 0.492 - Math.sin(i * 1.25) * h * 0.010;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function drawWaterBehindManor(ctx, w, h, time) {
  const waterTop = h * 0.455;
  const waterBottom = h * 0.660;

  const water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  water.addColorStop(0, "rgba(72, 132, 138, 0.94)");
  water.addColorStop(0.22, "rgba(48, 106, 122, 0.92)");
  water.addColorStop(0.58, "rgba(24, 73, 102, 0.90)");
  water.addColorStop(1, "rgba(9, 35, 62, 0.86)");

  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(0, waterTop);

  for (let i = 0; i <= 54; i += 1) {
    const x = (i / 54) * w;
    const y =
      waterTop +
      Math.sin(i * 0.42 + time * 0.48) * h * 0.004 +
      Math.sin(i * 1.52 + time * 0.22) * h * 0.0024;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, waterBottom);
  ctx.lineTo(0, waterBottom);
  ctx.closePath();
  ctx.fill();

  const shallow = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  shallow.addColorStop(0, "rgba(127, 178, 162, 0.11)");
  shallow.addColorStop(0.38, "rgba(93, 149, 146, 0.14)");
  shallow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shallow;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);

  const reflection = ctx.createRadialGradient(w * 0.635, h * 0.50, 0, w * 0.635, h * 0.55, w * 0.36);
  reflection.addColorStop(0, "rgba(255, 231, 160, 0.26)");
  reflection.addColorStop(0.22, "rgba(244, 207, 131, 0.13)");
  reflection.addColorStop(0.58, "rgba(244, 207, 131, 0.045)");
  reflection.addColorStop(1, "rgba(244, 207, 131, 0)");
  ctx.fillStyle = reflection;
  ctx.fillRect(0, waterTop, w, waterBottom - waterTop);

  ctx.save();
  ctx.strokeStyle = "rgba(244,207,131,0.36)";
  ctx.lineWidth = Math.max(1, w * 0.0011);

  for (let j = 0; j < 15; j += 1) {
    const y = lerp(h * 0.505, waterBottom, j / 15);
    ctx.globalAlpha = Math.max(0.028, 0.135 - j * 0.007);

    ctx.beginPath();
    for (let i = 0; i <= 44; i += 1) {
      const x = (i / 44) * w;
      const wave =
        Math.sin(i * 1.15 + j * 0.70 + time * 0.92) * h * 0.0026 +
        Math.sin(i * 2.05 + time * 0.37) * h * 0.0012;
      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,240,184,0.58)";

  for (let i = 0; i < 44; i += 1) {
    const x = w * (0.28 + seeded(i, 55) * 0.58);
    const y = h * (0.49 + seeded(i, 56) * 0.14);
    const size = w * (0.0018 + seeded(i, 57) * 0.0032);
    const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(time * 1.4 + i * 0.91));

    ctx.globalAlpha = 0.10 + pulse * 0.22;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 2.8, size * 0.55, -0.18, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawShoreline(ctx, w, h, time) {
  const shoreY = h * 0.626;

  const wet = ctx.createLinearGradient(0, shoreY - h * 0.035, 0, shoreY + h * 0.045);
  wet.addColorStop(0, "rgba(111, 151, 132, 0.12)");
  wet.addColorStop(0.40, "rgba(218, 178, 104, 0.36)");
  wet.addColorStop(0.72, "rgba(137, 104, 62, 0.22)");
  wet.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wet;

  ctx.beginPath();
  ctx.moveTo(0, shoreY - h * 0.020);
  for (let i = 0; i <= 42; i += 1) {
    const x = (i / 42) * w;
    const y = shoreY + Math.sin(i * 0.78 + time * 0.32) * h * 0.005 + Math.sin(i * 1.9) * h * 0.003;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, shoreY + h * 0.055);
  ctx.lineTo(0, shoreY + h * 0.052);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,231,171,0.24)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  ctx.beginPath();

  for (let i = 0; i <= 44; i += 1) {
    const x = (i / 44) * w;
    const y = shoreY + Math.sin(i * 0.80 + time * 0.54) * h * 0.004;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function drawShelfTerrain(ctx, w, h) {
  const shelfTop = h * 0.595;

  const grd = ctx.createLinearGradient(0, shelfTop, 0, h);
  grd.addColorStop(0, "rgba(151, 124, 68, 0.98)");
  grd.addColorStop(0.20, "rgba(108, 102, 62, 0.98)");
  grd.addColorStop(0.47, "rgba(64, 85, 59, 0.99)");
  grd.addColorStop(0.76, "rgba(30, 43, 34, 1)");
  grd.addColorStop(1, "rgba(10, 17, 17, 1)");

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(0, shelfTop);

  for (let i = 0; i <= 46; i += 1) {
    const x = (i / 46) * w;
    const y =
      shelfTop +
      Math.sin(i * 0.62) * h * 0.009 +
      Math.sin(i * 1.41 + 0.3) * h * 0.006 +
      (i / 46 - 0.5) * h * 0.026;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.save();

  for (let j = 0; j < 18; j += 1) {
    const y = h * (0.645 + j * 0.020);
    const alpha = 0.065 - j * 0.0017;

    ctx.strokeStyle = `rgba(244,207,131,${alpha})`;
    ctx.lineWidth = Math.max(1, w * 0.0009);

    ctx.beginPath();
    for (let i = 0; i <= 28; i += 1) {
      const x = (i / 28) * w;
      const yy = y + Math.sin(i * 1.12 + j * 0.6) * h * 0.004 + Math.sin(i * 2.5) * h * 0.0018;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 120; i += 1) {
    const x = seeded(i, 90) * w;
    const y = h * (0.63 + seeded(i, 91) * 0.34);
    const r = h * (0.0013 + seeded(i, 92) * 0.0034);
    const light = seeded(i, 93) > 0.55;

    ctx.fillStyle = light ? "rgba(206,175,102,0.11)" : "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.9, r * 0.7, seeded(i, 94) * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawTerraceBreaks(ctx, w, h) {
  ctx.save();

  const lines = [
    { y: 0.686, x0: 0.08, x1: 0.92, a: 0.18 },
    { y: 0.735, x0: 0.13, x1: 0.88, a: 0.13 },
    { y: 0.800, x0: 0.03, x1: 0.76, a: 0.10 },
    { y: 0.875, x0: 0.18, x1: 0.98, a: 0.08 }
  ];

  for (const line of lines) {
    ctx.strokeStyle = `rgba(18,24,22,${line.a})`;
    ctx.lineWidth = Math.max(1.2, w * 0.0016);
    ctx.beginPath();

    for (let i = 0; i <= 24; i += 1) {
      const t = i / 24;
      const x = lerp(w * line.x0, w * line.x1, t);
      const y = h * line.y + Math.sin(i * 0.85 + line.y * 10) * h * 0.005;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

    ctx.strokeStyle = `rgba(244,207,131,${line.a * 0.45})`;
    ctx.lineWidth = Math.max(1, w * 0.0008);
    ctx.beginPath();

    for (let i = 0; i <= 24; i += 1) {
      const t = i / 24;
      const x = lerp(w * line.x0, w * line.x1, t);
      const y = h * line.y - h * 0.005 + Math.sin(i * 0.85 + line.y * 10) * h * 0.004;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawVegetation(ctx, w, h, time) {
  ctx.save();

  for (let i = 0; i < 76; i += 1) {
    const x = seeded(i, 120) * w;
    const y = h * (0.61 + seeded(i, 121) * 0.36);
    const scale = h * (0.007 + seeded(i, 122) * 0.015);
    const sway = Math.sin(time * 0.42 + i) * scale * 0.13;

    const near = y > h * 0.76;
    ctx.fillStyle = i % 6 === 0
      ? `rgba(162, 176, 102, ${near ? 0.28 : 0.18})`
      : `rgba(64, 128, 78, ${near ? 0.30 : 0.20})`;

    ctx.beginPath();
    ctx.ellipse(x + sway, y, scale * (near ? 2.4 : 1.8), scale * 0.76, seeded(i, 123) * 0.6, 0, TAU);
    ctx.fill();

    if (i % 9 === 0) {
      ctx.strokeStyle = "rgba(29, 56, 42, 0.38)";
      ctx.lineWidth = Math.max(1, w * 0.0008);
      ctx.beginPath();
      ctx.moveTo(x, y + scale);
      ctx.lineTo(x + sway * 0.6, y - scale * 2.1);
      ctx.stroke();

      ctx.fillStyle = "rgba(73, 142, 88, 0.28)";
      ctx.beginPath();
      ctx.ellipse(x + sway * 1.2, y - scale * 2.1, scale * 1.4, scale * 0.9, 0, 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBuildZoneField(ctx, w, h) {
  const cx = w * 0.50;
  const cy = h * 0.704;
  const rx = w * 0.300;
  const ry = h * 0.060;

  ctx.save();

  const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
  field.addColorStop(0, "rgba(167,243,198,0.070)");
  field.addColorStop(0.72, "rgba(167,243,198,0.035)");
  field.addColorStop(1, "rgba(167,243,198,0)");
  ctx.fillStyle = field;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, -0.04, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = "rgba(167,243,198,0.58)";
  ctx.lineWidth = Math.max(1.5, w * 0.002);
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, -0.04, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(244,207,131,0.26)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  ctx.beginPath();
  ctx.moveTo(cx, cy + h * 0.154);
  ctx.lineTo(cx, cy - h * 0.19);
  ctx.stroke();

  ctx.fillStyle = "rgba(238,244,255,0.70)";
  ctx.font = `${Math.max(11, w * 0.013)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("CONTROLLED MANOR PLACEMENT FIELD", cx - rx * 0.69, cy + ry + h * 0.034);

  ctx.restore();
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

function drawManor(ctx, w, h) {
  const manor = getRichManorPlacementSpec();
  const cx = w * 0.50;
  const baseY = h * 0.674;
  const width = w * 0.365;
  const height = h * 0.230;

  ctx.save();

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.020, 0, cx, baseY + h * 0.035, width * 0.82);
  contact.addColorStop(0, "rgba(0,0,0,0.48)");
  contact.addColorStop(0.58, "rgba(0,0,0,0.24)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.035, width * 0.80, h * 0.050, 0, 0, TAU);
  ctx.fill();

  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.52;

  const body = ctx.createLinearGradient(cx - width * 0.54, bodyTop, cx + width * 0.54, baseY);
  body.addColorStop(0, "rgba(54, 43, 34, 0.98)");
  body.addColorStop(0.26, "rgba(126, 98, 63, 0.99)");
  body.addColorStop(0.48, "rgba(176, 138, 78, 0.99)");
  body.addColorStop(0.74, "rgba(99, 76, 54, 0.99)");
  body.addColorStop(1, "rgba(34, 28, 27, 0.99)");

  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(244,207,131,0.52)";
  ctx.lineWidth = Math.max(1.4, w * 0.0016);

  function rect(x, y, rw, rh, radius = Math.max(2, w * 0.004)) {
    roundedRect(ctx, x, y, rw, rh, radius);
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.37, bodyTop + bodyH * 0.16, width * 0.74, bodyH * 0.84);
  rect(cx - width * 0.17, bodyTop - bodyH * 0.075, width * 0.34, bodyH * 1.08);
  rect(cx - width * 0.535, bodyTop + bodyH * 0.31, width * 0.20, bodyH * 0.66);
  rect(cx + width * 0.335, bodyTop + bodyH * 0.31, width * 0.20, bodyH * 0.66);

  ctx.fillStyle = "rgba(23, 20, 23, 1)";
  ctx.strokeStyle = "rgba(244,207,131,0.42)";

  function roof(points, fill = "rgba(23,20,23,1)") {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  roof([
    [cx - width * 0.43, bodyTop + bodyH * 0.18],
    [cx, bodyTop - height * 0.215],
    [cx + width * 0.43, bodyTop + bodyH * 0.18]
  ]);

  roof([
    [cx - width * 0.205, bodyTop - bodyH * 0.05],
    [cx, bodyTop - height * 0.300],
    [cx + width * 0.205, bodyTop - bodyH * 0.05]
  ], "rgba(18,18,22,1)");

  roof([
    [cx - width * 0.585, bodyTop + bodyH * 0.31],
    [cx - width * 0.435, bodyTop + bodyH * 0.08],
    [cx - width * 0.285, bodyTop + bodyH * 0.31]
  ]);

  roof([
    [cx + width * 0.285, bodyTop + bodyH * 0.31],
    [cx + width * 0.435, bodyTop + bodyH * 0.08],
    [cx + width * 0.585, bodyTop + bodyH * 0.31]
  ]);

  ctx.strokeStyle = "rgba(255,240,184,0.22)";
  ctx.lineWidth = Math.max(1, w * 0.0008);
  for (let i = -4; i <= 4; i += 1) {
    const x = cx + i * width * 0.086;
    ctx.beginPath();
    ctx.moveTo(x, bodyTop + bodyH * 0.18);
    ctx.lineTo(x, baseY - bodyH * 0.03);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(244,207,131,0.76)";
  ctx.strokeStyle = "rgba(255,240,184,0.34)";
  ctx.lineWidth = Math.max(0.7, w * 0.0007);

  for (let floor = 0; floor < 4; floor += 1) {
    const y = bodyTop + bodyH * (0.23 + floor * 0.18);

    for (let i = -4; i <= 4; i += 1) {
      if (Math.abs(i) === 4 && floor < 1) continue;
      if (i === 0 && floor > 1) continue;

      const x = cx + i * width * 0.070;
      const ww = width * 0.025;
      const wh = bodyH * 0.072;

      roundedRect(ctx, x - ww / 2, y, ww, wh, 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.fillStyle = "rgba(13, 10, 12, 0.94)";
  roundedRect(ctx, cx - width * 0.040, baseY - bodyH * 0.255, width * 0.080, bodyH * 0.255, 4);
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.36)";
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.085, baseY - bodyH * 0.255);
  ctx.lineTo(cx + width * 0.085, baseY - bodyH * 0.255);
  ctx.stroke();

  ctx.strokeStyle = "rgba(167,243,198,0.30)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  ctx.setLineDash([6, 7]);
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.22, baseY + h * 0.016);
  ctx.lineTo(cx + width * 0.22, baseY + h * 0.016);
  ctx.stroke();
  ctx.setLineDash([]);

  const rim = ctx.createLinearGradient(cx - width * 0.5, bodyTop, cx + width * 0.52, bodyTop);
  rim.addColorStop(0, "rgba(244,207,131,0)");
  rim.addColorStop(0.62, "rgba(255,231,170,0.12)");
  rim.addColorStop(1, "rgba(255,231,170,0.30)");
  ctx.fillStyle = rim;
  roundedRect(ctx, cx - width * 0.54, bodyTop - height * 0.06, width * 1.08, height * 0.68, 8);
  ctx.fill();

  ctx.fillStyle = "rgba(238,244,255,0.78)";
  ctx.font = `${Math.max(11, w * 0.0125)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("RICH MANOR · EXISTING SPEC PLACED", cx - width * 0.34, baseY + h * 0.058);

  if (manor.knownCanon.vaultKnown) {
    ctx.fillStyle = "rgba(167,243,198,0.72)";
    ctx.fillText("vault preserved below ground", cx - width * 0.20, baseY + h * 0.083);
  }

  ctx.restore();
}

function drawForegroundPath(ctx, w, h) {
  ctx.save();

  const path = ctx.createLinearGradient(w * 0.48, h * 0.70, w * 0.50, h);
  path.addColorStop(0, "rgba(244,207,131,0.14)");
  path.addColorStop(0.50, "rgba(122,94,50,0.22)");
  path.addColorStop(1, "rgba(244,207,131,0.055)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.700);
  ctx.bezierCurveTo(w * 0.420, h * 0.800, w * 0.360, h * 0.905, w * 0.260, h);
  ctx.lineTo(w * 0.740, h);
  ctx.bezierCurveTo(w * 0.635, h * 0.905, w * 0.570, h * 0.800, w * 0.535, h * 0.700);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(244,207,131,0.16)";
  ctx.lineWidth = Math.max(1, w * 0.001);
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.700);
  ctx.bezierCurveTo(w * 0.420, h * 0.800, w * 0.360, h * 0.905, w * 0.260, h);
  ctx.moveTo(w * 0.535, h * 0.700);
  ctx.bezierCurveTo(w * 0.570, h * 0.800, w * 0.635, h * 0.905, w * 0.740, h);
  ctx.stroke();

  for (let i = 0; i < 24; i += 1) {
    const t = seeded(i, 200);
    const x = lerp(w * 0.34, w * 0.66, t);
    const y = h * (0.74 + seeded(i, 201) * 0.24);
    const r = h * (0.0018 + seeded(i, 202) * 0.0038);

    ctx.fillStyle = "rgba(244,207,131,0.09)";
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.0, r * 0.7, seeded(i, 203) * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawAtmosphericDepth(ctx, w, h) {
  const behindManorHaze = ctx.createLinearGradient(0, h * 0.50, 0, h * 0.69);
  behindManorHaze.addColorStop(0, "rgba(238,244,255,0.045)");
  behindManorHaze.addColorStop(0.56, "rgba(244,207,131,0.050)");
  behindManorHaze.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = behindManorHaze;
  ctx.fillRect(0, h * 0.49, w, h * 0.20);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.58, h * 0.10, w * 0.50, h * 0.58, w * 0.86);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.72, "rgba(0,0,0,0.04)");
  vignette.addColorStop(1, "rgba(0,0,0,0.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

export function renderWesternGoldenShelfGroundScene(canvas, options = {}) {
  const ctx = canvas?.getContext?.("2d", { alpha: false });
  if (!canvas || !ctx) return null;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(options.dpr || window.devicePixelRatio || 1, 1.5);
  const width = Math.max(320, Math.floor((box.width || 900) * dpr));
  const height = Math.max(390, Math.floor((box.height || 560) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const time = Number.isFinite(options.time) ? options.time : performance.now() / 1000;

  drawSky(ctx, width, height, time);
  drawDistantHighlands(ctx, width, height);
  drawWaterBehindManor(ctx, width, height, time);
  drawShoreline(ctx, width, height, time);
  drawShelfTerrain(ctx, width, height);
  drawTerraceBreaks(ctx, width, height);
  drawBuildZoneField(ctx, width, height);
  drawManor(ctx, width, height);
  drawVegetation(ctx, width, height, time);
  drawForegroundPath(ctx, width, height);
  drawAtmosphericDepth(ctx, width, height);

  return Object.freeze({
    contract: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,
    version: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
    manorSpecVersion: H_EARTH_MANOR_SPEC_VERSION,
    rendered: true,
    definitionPass: true,
    terrainDefinition: true,
    shorelineDefinition: true,
    manorMassingDefinition: true,
    vegetationDefinition: true,
    atmosphereDefinition: true,
    waterBehindManor: true,
    cameraFacing: "west-southwest",
    manorGroundPlacementAuthorized: true,
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
      definitionPass: true,
      finalArchitectureAuthorized: false,
      estateFinalizationAuthorized: false,
      bridgeFinalizationAuthorized: false
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
