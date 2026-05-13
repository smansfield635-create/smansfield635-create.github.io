// /assets/world/environment/terrain.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_TERRAIN_TNT_v1
// Owns: path, rocks, shelf, slope, soil, cliffs, mountains, islets, and terrain pressure.

import { clamp, lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_TERRAIN_VERSION = "reusable-planetary-terrain-v1";

export function drawDistantTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const terrain = profile.terrain;

  ctx.save();

  if (terrain.mountainPresence > 0.05) {
    ctx.fillStyle = "rgba(22,32,34,.26)";
    for (let i = 0; i < 4; i += 1) {
      const cx = hash01(i, 601, 1, cell.seed);
      const cy = 0.335 + hash01(i, 602, 2, cell.seed) * 0.038;
      const sx = 0.07 + hash01(i, 603, 3, cell.seed) * 0.08;
      const sy = 0.035 + hash01(i, 604, 4, cell.seed) * 0.05;

      ctx.beginPath();
      ctx.moveTo(w * (cx - sx), h * cy);
      ctx.lineTo(w * (cx - sx * 0.42), h * (cy - sy * 0.48));
      ctx.lineTo(w * cx, h * (cy - sy));
      ctx.lineTo(w * (cx + sx * 0.52), h * (cy - sy * 0.26));
      ctx.lineTo(w * (cx + sx), h * cy);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(20,31,32,.58)";
  const islets = [
    [0.07, 0.36, 0.07, 0.052],
    [0.62, 0.35, 0.055, 0.034],
    [0.86, 0.34, 0.075, 0.056],
    [0.95, 0.37, 0.024, 0.018]
  ];

  islets.forEach(([cx, cy, sx, sy], index) => {
    const jitter = terrain.distantIslets * 0.008;
    ctx.beginPath();
    ctx.moveTo(w * (cx - sx), h * cy);
    ctx.lineTo(w * (cx - sx * 0.45), h * (cy - sy * (0.42 + hash01(index, 710, 1, cell.seed) * jitter)));
    ctx.lineTo(w * cx, h * (cy - sy));
    ctx.lineTo(w * (cx + sx * 0.55), h * (cy - sy * 0.25));
    ctx.lineTo(w * (cx + sx), h * cy);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

export function drawShorelineTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t } = frame;
  const line = h * profile.camera.shoreline;

  const beach = ctx.createLinearGradient(0, line - h * 0.040, 0, line + h * 0.098);
  beach.addColorStop(0, "rgba(184,176,126,.10)");
  beach.addColorStop(0.25, "rgba(226,194,126,.46)");
  beach.addColorStop(0.52, "rgba(154,123,75,.30)");
  beach.addColorStop(1, "rgba(75,83,51,0)");

  ctx.fillStyle = beach;
  ctx.beginPath();
  ctx.moveTo(0, line - h * 0.018);

  for (let i = 0; i <= 112; i += 1) {
    const x = (i / 112) * w;
    const y =
      line +
      Math.sin(i * 0.44 + t * 0.24) * h * 0.0042 +
      Math.sin(i * 1.22) * h * 0.0025;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, line + h * 0.092);
  ctx.lineTo(0, line + h * 0.086);
  ctx.closePath();
  ctx.fill();
}

export function drawGroundTerrainLayer(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const top = h * profile.camera.groundStart;
  const terrain = profile.terrain;
  const p = terrain.palette;

  const ground = ctx.createLinearGradient(0, top, 0, h);
  ground.addColorStop(0, rgba(p.shelfHigh, 1));
  ground.addColorStop(0.22, rgba(p.grassBase, 1));
  ground.addColorStop(0.52, rgba(p.grassDeep, 1));
  ground.addColorStop(0.78, "rgb(35,59,42)");
  ground.addColorStop(1, rgba(p.shadow, 1));
  ctx.fillStyle = ground;

  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 112; i += 1) {
    const x = (i / 112) * w;
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

  drawSlopeLines(ctx, profile, cell, frame);
  drawPath(ctx, profile, cell, frame);
  drawRocks(ctx, profile, cell, frame);
}

function drawSlopeLines(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;

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

  ctx.restore();
}

function drawPath(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const strength = profile.terrain.pathStrength;
  const path = ctx.createLinearGradient(w * 0.49, h * 0.64, w * 0.49, h);

  path.addColorStop(0, "rgba(218,190,128,.06)");
  path.addColorStop(0.55, `rgba(126,101,63,${0.18 + strength * 0.05})`);
  path.addColorStop(1, `rgba(227,202,142,${0.12 + strength * 0.04})`);

  ctx.fillStyle = path;
  ctx.beginPath();
  ctx.moveTo(w * 0.465, h * 0.655);
  ctx.bezierCurveTo(w * 0.405, h * 0.765, w * 0.348, h * 0.880, w * 0.270, h);
  ctx.lineTo(w * 0.665, h);
  ctx.bezierCurveTo(w * 0.590, h * 0.880, w * 0.545, h * 0.765, w * 0.535, h * 0.655);
  ctx.closePath();
  ctx.fill();
}

function drawRocks(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const density = profile.terrain.rockDensity;
  const count = Math.round(110 + density * 190);

  ctx.save();

  for (let i = 0; i < count; i += 1) {
    const x = hash01(i, 80, 1, cell.seed) * w;
    const y = h * (0.60 + hash01(i, 81, 2, cell.seed) * 0.38);
    const r = h * (0.0012 + hash01(i, 82, 3, cell.seed) * 0.0056);
    const alpha = hash01(i, 83, 4, cell.seed) > 0.54 ? 0.12 : 0.10;

    ctx.fillStyle = hash01(i, 84, 5, cell.seed) > 0.50
      ? `rgba(220,190,117,${alpha})`
      : `rgba(0,0,0,${alpha})`;

    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.1, r * 0.62, hash01(i, 85, 6, cell.seed) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
