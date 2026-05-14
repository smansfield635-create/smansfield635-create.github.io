// /assets/world/environment/terrain.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_VISUAL_EXPRESSION_EXPANSION_THROUGH_LIVE_HEX_v2
// Owns: shelf, slope, path, rocks, soil, shoreline terrain, islets, distant ridges.

import { lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_TERRAIN_VERSION =
  "h-earth-visual-expression-expansion-through-live-hex-terrain-v2";

const TAU = Math.PI * 2;

export function drawDistantTerrainLayer(ctx, profile, cell, frame) {
  drawDistantRidges(ctx, profile, cell, frame);
  drawRockIslets(ctx, profile, cell, frame);
}

function drawDistantRidges(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  const ridges = [
    { x: 0.09, y: 0.356, width: 0.20, height: 0.078 },
    { x: 0.60, y: 0.358, width: 0.16, height: 0.060 },
    { x: 0.82, y: 0.354, width: 0.22, height: 0.078 }
  ];

  ridges.forEach((ridge) => {
    const grad = ctx.createLinearGradient(0, h * (ridge.y - ridge.height), 0, h * ridge.y);
    grad.addColorStop(0, "rgba(25,35,35,.46)");
    grad.addColorStop(1, "rgba(25,35,35,.17)");
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(w * (ridge.x - ridge.width / 2), h * ridge.y);

    for (let i = 0; i <= 16; i += 1) {
      const local = i / 16;
      const nx = ridge.x - ridge.width / 2 + local * ridge.width;
      const sample = hexfield?.sample(Math.max(0, Math.min(1, nx)), ridge.y, t);
      const peak = Math.sin(local * Math.PI) * ridge.height * (0.60 + (sample?.fracture ?? 0.4) * 0.65);
      ctx.lineTo(nx * w, h * (ridge.y - peak));
    }

    ctx.lineTo(w * (ridge.x + ridge.width / 2), h * ridge.y);
    ctx.closePath();
    ctx.fill();
  });
}

function drawRockIslets(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  const islets = [
    [0.08, 0.365, 0.082, 0.046],
    [0.58, 0.359, 0.060, 0.033],
    [0.75, 0.356, 0.090, 0.042],
    [0.88, 0.363, 0.074, 0.034],
    [0.965, 0.374, 0.030, 0.017]
  ];

  islets.forEach(([cx, cy, sx, sy], index) => {
    const sample = hexfield?.sample(cx, cy, t);
    ctx.fillStyle = `rgba(19,30,31,${0.34 + (sample?.fracture ?? 0.4) * 0.24})`;
    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);

    for (let i = 0; i <= 10; i += 1) {
      const local = i / 10;
      const nx = cx - sx + local * sx * 2;
      const lift = Math.sin(local * Math.PI) * sy * (0.50 + hash01(index, i, 10, cell.seed) * 0.80);
      ctx.lineTo(nx * w, h * (cy - lift));
    }

    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();
  });
}

export function drawShorelineTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const line = profile.camera.shoreline;

  const beach = ctx.createLinearGradient(0, h * (line - 0.044), 0, h * (line + 0.108));
  beach.addColorStop(0, "rgba(238,215,158,.08)");
  beach.addColorStop(0.22, "rgba(221,190,118,.40)");
  beach.addColorStop(0.52, "rgba(148,116,70,.31)");
  beach.addColorStop(1, "rgba(75,83,51,0)");

  ctx.fillStyle = beach;
  ctx.beginPath();
  ctx.moveTo(0, h * (line - 0.018));

  for (let i = 0; i <= 150; i += 1) {
    const nx = i / 150;
    const sample = hexfield?.sample(nx, line, t);
    const y =
      h * line +
      Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 +
      Math.sin(i * 1.22) * h * 0.0025 +
      (sample?.shorePressure || 0) * (sample?.tide || 0) * h * 0.0018;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, h * (line + 0.096));
  ctx.lineTo(0, h * (line + 0.090));
  ctx.closePath();
  ctx.fill();
}

export function drawGroundTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const top = profile.camera.groundStart;
  const p = profile.terrain.palette;

  const ground = ctx.createLinearGradient(0, h * top, 0, h);
  ground.addColorStop(0, rgba(p.shelfHigh, 1));
  ground.addColorStop(0.22, rgba(p.grassBase, 1));
  ground.addColorStop(0.52, rgba(p.grassDeep, 1));
  ground.addColorStop(0.80, "rgb(29,53,38)");
  ground.addColorStop(1, rgba(p.shadow, 1));

  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, h * top);

  for (let i = 0; i <= 150; i += 1) {
    const nx = i / 150;
    const sample = hexfield?.sample(nx, top, t);
    const y =
      h * top +
      Math.sin(i * 0.43) * h * 0.009 +
      Math.sin(i * 1.27 + 0.4) * h * 0.005 +
      Math.sin(i * 2.7) * h * 0.002 +
      (sample?.elevation || 0.5) * h * 0.004;

    ctx.lineTo(nx * w, y);
  }

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  drawSlopeLines(ctx, profile, cell, frame);
  drawHexTexture(ctx, profile, cell, frame);
  drawPath(ctx, profile, cell, frame);
  drawRocks(ctx, profile, cell, frame);
  drawForegroundBoulders(ctx, profile, cell, frame);
}

function drawSlopeLines(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  ctx.save();

  for (let j = 0; j < 54; j += 1) {
    const ny = 0.625 + j * 0.0089;
    const alpha = Math.max(0.010, 0.058 - j * 0.0010);

    ctx.strokeStyle = `rgba(235,205,139,${alpha})`;
    ctx.lineWidth = Math.max(1, w * 0.00046);
    ctx.beginPath();

    for (let i = 0; i <= 96; i += 1) {
      const nx = i / 96;
      const sample = hexfield?.sample(nx, ny, t);
      const yy =
        h * ny +
        Math.sin(i * 0.66 + j * 0.36) * h * 0.0025 +
        Math.sin(i * 1.71) * h * 0.0013 +
        (sample?.fracture || 0) * h * 0.0012;

      if (i === 0) ctx.moveTo(nx * w, yy);
      else ctx.lineTo(nx * w, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawHexTexture(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  ctx.save();

  for (let i = 0; i < 540; i += 1) {
    const nx = hash01(i, 900, 1, cell.seed);
    const ny = 0.59 + hash01(i, 901, 2, cell.seed) * 0.39;
    const sample = hexfield?.sample(nx, ny, t);
    if (!sample || sample.pathPressure > 0.62) continue;

    const r = h * (0.0009 + sample.grain * 0.0032);
    const alpha = 0.018 + sample.fracture * 0.072;

    ctx.fillStyle =
      sample.elevation > 0.64
        ? `rgba(226,198,128,${alpha})`
        : `rgba(0,0,0,${alpha * 0.72})`;

    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, r * 1.85, r * 0.58, sample.macro * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawPath(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  const path = ctx.createLinearGradient(w * 0.49, h * 0.64, w * 0.49, h);
  path.addColorStop(0, "rgba(218,190,128,.045)");
  path.addColorStop(0.45, "rgba(126,101,63,.20)");
  path.addColorStop(1, "rgba(226,204,150,.18)");

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.475, h * 0.650);
  ctx.bezierCurveTo(w * 0.420, h * 0.760, w * 0.350, h * 0.875, w * 0.245, h);
  ctx.lineTo(w * 0.665, h);
  ctx.bezierCurveTo(w * 0.585, h * 0.875, w * 0.545, h * 0.760, w * 0.525, h * 0.650);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.20;
  ctx.strokeStyle = "rgba(255,226,168,.28)";
  ctx.lineWidth = Math.max(1, w * 0.0009);

  for (let j = 0; j < 10; j += 1) {
    ctx.beginPath();

    for (let i = 0; i <= 56; i += 1) {
      const ny = 0.665 + (i / 56) * 0.31;
      const sample = hexfield?.sample(0.50, ny, t);
      const x =
        w *
        ((sample?.pathCenter || 0.50) +
          (j - 5) * 0.006 +
          Math.sin(i * 0.42 + j) * 0.0018);

      if (i === 0) ctx.moveTo(x, h * ny);
      else ctx.lineTo(x, h * ny);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawRocks(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const count = Math.round(150 + profile.terrain.rockDensity * 250);

  ctx.save();

  for (let i = 0; i < count; i += 1) {
    const nx = hash01(i, 80, 1, cell.seed);
    const ny = 0.60 + hash01(i, 81, 2, cell.seed) * 0.38;
    const sample = hexfield?.sample(nx, ny, t);

    if (!sample || sample.rockPressure < 0.16) continue;

    const r = h * (0.0012 + sample.rockPressure * 0.006);
    const alpha = 0.065 + sample.rockPressure * 0.14;

    ctx.fillStyle =
      sample.fracture > 0.54
        ? `rgba(218,194,132,${alpha})`
        : `rgba(12,18,16,${alpha * 0.86})`;

    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, r * 2.35, r * 0.68, sample.macro * Math.PI, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawForegroundBoulders(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  [
    [0.08, 0.93, 0.075, 0.035],
    [0.18, 0.97, 0.090, 0.048],
    [0.80, 0.94, 0.080, 0.040],
    [0.92, 0.985, 0.110, 0.060]
  ].forEach(([nx, ny, sx, sy]) => {
    const sample = hexfield?.sample(nx, ny, t);

    const grad = ctx.createRadialGradient(
      nx * w - sx * w * 0.25,
      ny * h - sy * h * 0.55,
      0,
      nx * w,
      ny * h,
      sx * w
    );

    grad.addColorStop(0, "rgba(170,166,132,.30)");
    grad.addColorStop(0.45, "rgba(88,91,75,.28)");
    grad.addColorStop(1, "rgba(6,10,10,.42)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(nx * w, ny * h, sx * w, sy * h, (sample?.macro || 0.4) * 0.35, 0, TAU);
    ctx.fill();
  });
}
