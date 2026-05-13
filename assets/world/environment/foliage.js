// /assets/world/environment/foliage.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_FOLIAGE_HEXFIELD_TNT_v2
// Owns: grass, shrubs, wildflowers, wind response, density zones, visible life.

import { hash01, rgba } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_FOLIAGE_VERSION = "reusable-planetary-foliage-hexfield-v2";

export function drawFoliageLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const foliage = profile.foliage;
  const palette = foliage.palette;
  const count = Math.round(100 + foliage.density * 260);

  ctx.save();

  for (let i = 0; i < count; i += 1) {
    const nx = hash01(i, 110, 1, cell.seed);
    const ny = 0.585 + hash01(i, 111, 2, cell.seed) * 0.39;
    const sample = hexfield?.sample(nx, ny, t);

    if (!sample || sample.foliagePressure < 0.12) continue;

    const x = nx * w;
    const y = ny * h;
    const near = y > h * 0.78;
    const scale = h * (0.0032 + hash01(i, 112, 3, cell.seed) * (near ? 0.018 : 0.011)) * (0.72 + sample.foliagePressure * 0.56);
    const sway = sample.wind * scale * foliage.windResponse * (near ? 0.95 : 0.58);

    if (hash01(i, 113, 4, cell.seed) < foliage.shrubs * 0.24) {
      drawShrub(ctx, palette, x, y, scale, sway, near, i, sample);
    } else {
      drawGrassBlade(ctx, palette, x, y, scale, sway, near, i, sample);
    }

    if (sample.flowerPressure > 0.32 && near && hash01(i, 200, 5, cell.seed) < foliage.wildflowers * 0.12) {
      drawFlower(ctx, palette, x + sway, y - scale * 0.8, scale, i, cell.seed);
    }
  }

  ctx.restore();
}

function drawGrassBlade(ctx, palette, x, y, scale, sway, near, i, sample) {
  const alpha = (near ? 0.34 : 0.20) * (0.75 + sample.foliagePressure * 0.55);
  ctx.fillStyle = hash01(i, 114) > 0.45
    ? rgba(palette.grass, alpha)
    : rgba(palette.grassGold, near ? 0.28 : 0.16);

  ctx.beginPath();
  ctx.ellipse(x + sway, y, scale * 2.0, scale * 0.50, hash01(i, 115) * 1.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawShrub(ctx, palette, x, y, scale, sway, near, i, sample) {
  ctx.strokeStyle = "rgba(25,56,38,.42)";
  ctx.lineWidth = Math.max(1, scale * 0.19);
  ctx.beginPath();
  ctx.moveTo(x, y + scale * 1.4);
  ctx.quadraticCurveTo(x + sway, y - scale * 0.35, x + sway * 1.4, y - scale * 2.6);
  ctx.stroke();

  ctx.fillStyle = near ? rgba(palette.shrub, 0.42) : rgba(palette.shrub, 0.28);
  ctx.beginPath();
  ctx.ellipse(x + sway * 1.6, y - scale * 2.7, scale * 2.0, scale * 1.05, 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(ctx, palette, x, y, scale, i, seed) {
  const roll = hash01(i, 300, 1, seed);
  const color =
    roll < 0.25 ? palette.flowerWhite :
    roll < 0.52 ? palette.flowerGold :
    roll < 0.78 ? palette.flowerPink :
    palette.flowerPurple;

  ctx.fillStyle = rgba(color, 0.70);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, scale * 0.30), 0, Math.PI * 2);
  ctx.fill();
}
