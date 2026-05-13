// /assets/world/environment/terrain.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_VISUAL_DEFINITION_EXPANSION_TERRAIN_TNT_v1
// Owns: shelf, slope, path, rocks, soil, shoreline terrain, islets, distant mountains.
// Consumes: shared hexfield substrate through frame.hexfield.

import { clamp, lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_TERRAIN_VERSION =
  "h-earth-hex-visual-definition-expansion-terrain-v1";

const TAU = Math.PI * 2;

export function drawDistantTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const terrain = profile.terrain;

  ctx.save();

  if (terrain.mountainPresence > 0.05) {
    drawDistantRidges(ctx, profile, cell, frame);
  }

  drawRockIslets(ctx, profile, cell, frame);

  ctx.restore();
}

function drawDistantRidges(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  const ridgeGroups = [
    { x: 0.08, y: 0.355, width: 0.18, height: 0.085 },
    { x: 0.62, y: 0.360, width: 0.16, height: 0.070 },
    { x: 0.82, y: 0.354, width: 0.21, height: 0.082 }
  ];

  ridgeGroups.forEach((group, groupIndex) => {
    const gradient = ctx.createLinearGradient(0, h * (group.y - group.height), 0, h * group.y);
    gradient.addColorStop(0, "rgba(28,38,37,.52)");
    gradient.addColorStop(1, "rgba(28,38,37,.20)");
    ctx.fillStyle = gradient;

    ctx.beginPath();

    const points = 14;
    for (let i = 0; i <= points; i += 1) {
      const local = i / points;
      const nx = group.x - group.width * 0.5 + local * group.width;
      const sample = hexfield?.sample(clamp(nx, 0, 1), group.y, t);
      const ridge =
        Math.sin(local * Math.PI) *
        group.height *
        (0.50 + (sample?.fracture ?? 0.4) * 0.75);

      const x = nx * w;
      const y = h * (group.y - ridge);

      if (i === 0) ctx.moveTo(x, h * group.y);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w * (group.x + group.width * 0.5), h * group.y);
    ctx.closePath();
    ctx.fill();
  });
}

function drawRockIslets(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const islets = [
    [0.085, 0.366, 0.085, 0.048],
    [0.58, 0.358, 0.060, 0.034],
    [0.75, 0.355, 0.090, 0.044],
    [0.88, 0.362, 0.075, 0.036],
    [0.965, 0.374, 0.030, 0.018]
  ];

  islets.forEach(([cx, cy, sx, sy], index) => {
    const sample = hexfield?.sample(cx, cy, t);
    const points = 9;
    const alpha = 0.34 + (sample?.fracture ?? 0.4) * 0.24;

    ctx.fillStyle = `rgba(20,31,32,${alpha})`;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const local = i / points;
      const nx = cx - sx + local * sx * 2;
      const peak =
        Math.sin(local * Math.PI) *
        sy *
        (0.50 + hash01(index, i, 10, cell.seed) * 0.78);

      const x = nx * w;
      const y = h * (cy - peak);

      if (i === 0) ctx.moveTo(x, h * cy);
      ctx.lineTo(x, y);
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
    const x = nx * w;
    const y =
      h * line +
      Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 +
      Math.sin(i * 1.22) * h * 0.0025 +
      (sample?.shorePressure || 0) * (sample?.tide || 0) * h * 0.0018;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h * (line + 0.096));
  ctx.lineTo(0, h * (line + 0.090));
  ctx.closePath();
  ctx.fill();
}

export function drawGroundTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const top = profile.camera.groundStart;
  const terrain = profile.terrain;
  const p = terrain.palette;

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
    const x = nx * w;
    const y =
      h * top +
      Math.sin(i * 0.43) * h * 0.009 +
      Math.sin(i * 1.27 + 0.4) * h * 0.005 +
      Math.sin(i * 2.7) * h * 0.002 +
      (sample?.elevation || 0.5) * h * 0.004;
    ctx.lineTo(x, y);
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
      const x = nx * w;
      const yy =
        h * ny +
        Math.sin(i * 0.66 + j * 0.36) * h * 0.0025 +
        Math.sin(i * 1.71) * h * 0.0013 +
        (sample?.fracture || 0) * h * 0.0012;

      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawHexTexture(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;

  ctx.save();

  for (let i = 0; i < 520; i += 1) {
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
  path.addColorStop(0.45, `rgba(126,101,63,${0.17 + profile.terrain.pathStrength * 0.04})`);
  path.addColorStop(1, `rgba(226,204,150,${0.14 + profile.terrain.pathStrength * 0.05})`);

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.475, h * 0.650);
  ctx.bezierCurveTo(w * 0.420, h * 0.760, w * 0.350, h * 0.875, w * 0.245, h);
  ctx.lineTo(w * 0.665, h);
  ctx.bezierCurveTo(w * 0.585, h * 0.875, w * 0.545, h * 0.760, w * 0.525, h * 0.650);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(255,226,168,.28)";
  ctx.lineWidth = Math.max(1, w * 0.0009);

  for (let j = 0; j < 11; j += 1) {
    ctx.beginPath();

    for (let i = 0; i <= 56; i += 1) {
      const ny = 0.665 + (i / 56) * 0.31;
      const sample = hexfield?.sample(0.50, ny, t);
      const x =
        w *
        ((sample?.pathCenter || 0.50) +
          (j - 5) * 0.006 +
          Math.sin(i * 0.42 + j) * 0.0018);
      const y = h * ny;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
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

  const boulders = [
    [0.08, 0.93, 0.075, 0.035],
    [0.18, 0.97, 0.090, 0.048],
    [0.80, 0.94, 0.080, 0.040],
    [0.92, 0.985, 0.110, 0.060]
  ];

  boulders.forEach(([nx, ny, sx, sy], index) => {
    const sample = hexfield?.sample(nx, ny, time);
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
