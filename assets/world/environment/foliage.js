// /assets/world/environment/foliage.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_VISUAL_DEFINITION_EXPANSION_FOLIAGE_TNT_v1
// Owns: grasses, shrubs, wildflowers, wind response, foreground life.
// Consumes: shared hexfield substrate through frame.hexfield.

import { hash01, rgba } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_FOLIAGE_VERSION =
  "h-earth-hex-visual-definition-expansion-foliage-v1";

const TAU = Math.PI * 2;

export function drawFoliageLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const foliage = profile.foliage;
  const palette = foliage.palette;
  const count = Math.round(130 + foliage.density * 360);

  ctx.save();

  for (let i = 0; i < count; i += 1) {
    const nx = hash01(i, 110, 1, cell.seed);
    const ny = 0.585 + hash01(i, 111, 2, cell.seed) * 0.39;
    const sample = hexfield?.sample(nx, ny, t);

    if (!sample || sample.foliagePressure < 0.105) continue;

    const x = nx * w;
    const y = ny * h;
    const near = y > h * 0.78;
    const scale =
      h *
      (0.0030 + hash01(i, 112, 3, cell.seed) * (near ? 0.020 : 0.011)) *
      (0.74 + sample.foliagePressure * 0.60);

    const sway = sample.wind * scale * foliage.windResponse * (near ? 1.05 : 0.62);

    if (hash01(i, 113, 4, cell.seed) < foliage.shrubs * 0.24) {
      drawShrub(ctx, palette, x, y, scale, sway, near, i, sample);
    } else {
      drawGrassBlade(ctx, palette, x, y, scale, sway, near, i, sample);
    }

    if (
      sample.flowerPressure > 0.30 &&
      near &&
      hash01(i, 200, 5, cell.seed) < foliage.wildflowers * 0.13
    ) {
      drawFlower(ctx, palette, x + sway, y - scale * 0.8, scale, i, cell.seed);
    }
  }

  drawForegroundGrassVeil(ctx, profile, cell, frame);

  ctx.restore();
}

function drawGrassBlade(ctx, palette, x, y, scale, sway, near, i, sample) {
  const alpha = (near ? 0.36 : 0.22) * (0.74 + sample.foliagePressure * 0.60);
  const color =
    hash01(i, 114) > 0.45
      ? rgba(palette.grass, alpha)
      : rgba(palette.grassGold, near ? 0.28 : 0.17);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, scale * 0.085);

  ctx.beginPath();
  ctx.moveTo(x, y + scale * 0.70);
  ctx.quadraticCurveTo(
    x + sway * 0.56,
    y - scale * 0.62,
    x + sway,
    y - scale * (1.20 + hash01(i, 116) * 0.80)
  );
  ctx.stroke();

  if (near && hash01(i, 117) > 0.72) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(
      x + sway,
      y - scale * 1.02,
      scale * 0.38,
      scale * 1.10,
      -0.32 + sample.wind * 0.04,
      0,
      TAU
    );
    ctx.fill();
  }
}

function drawShrub(ctx, palette, x, y, scale, sway, near, i, sample) {
  ctx.strokeStyle = "rgba(23,55,37,.48)";
  ctx.lineWidth = Math.max(1, scale * 0.16);

  const stems = near ? 4 : 3;

  for (let s = 0; s < stems; s += 1) {
    const offset = (s - (stems - 1) / 2) * scale * 0.45;
    ctx.beginPath();
    ctx.moveTo(x + offset, y + scale * 1.2);
    ctx.quadraticCurveTo(
      x + offset + sway * 0.45,
      y - scale * 0.35,
      x + offset + sway * 1.2,
      y - scale * (1.8 + hash01(i, s, 119) * 1.1)
    );
    ctx.stroke();
  }

  ctx.fillStyle = near ? rgba(palette.shrub, 0.44) : rgba(palette.shrub, 0.29);

  for (let leaf = 0; leaf < 4; leaf += 1) {
    ctx.beginPath();
    ctx.ellipse(
      x + sway * (0.6 + leaf * 0.20) + (leaf - 1.5) * scale * 0.30,
      y - scale * (1.1 + leaf * 0.42),
      scale * (0.95 + hash01(i, leaf, 121) * 0.70),
      scale * (0.42 + hash01(i, leaf, 122) * 0.35),
      0.12 + sample.wind * 0.04,
      0,
      TAU
    );
    ctx.fill();
  }
}

function drawFlower(ctx, palette, x, y, scale, i, seed) {
  const roll = hash01(i, 300, 1, seed);
  const color =
    roll < 0.25
      ? palette.flowerWhite
      : roll < 0.52
        ? palette.flowerGold
        : roll < 0.78
          ? palette.flowerPink
          : palette.flowerPurple;

  ctx.fillStyle = rgba(color, 0.74);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1, scale * 0.23), 0, TAU);
  ctx.fill();

  ctx.fillStyle = "rgba(255,239,184,.58)";
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.8, scale * 0.09), 0, TAU);
  ctx.fill();
}

function drawForegroundGrassVeil(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;

  ctx.save();
  ctx.globalAlpha = 0.30;

  for (let i = 0; i < 80; i += 1) {
    const nx = hash01(i, 700, 1, cell.seed);
    const ny = 0.78 + hash01(i, 701, 2, cell.seed) * 0.22;
    const sample = hexfield?.sample(nx, ny, t);
    if (!sample || sample.foliagePressure < 0.18) continue;

    const x = nx * w;
    const y = ny * h;
    const blade = h * (0.020 + hash01(i, 702, 3, cell.seed) * 0.055);
    const sway = sample.wind * h * 0.010;

    ctx.strokeStyle = "rgba(134,168,90,.22)";
    ctx.lineWidth = Math.max(1, w * 0.0012);
    ctx.beginPath();
    ctx.moveTo(x, y + blade * 0.30);
    ctx.quadraticCurveTo(x + sway * 0.35, y - blade * 0.45, x + sway, y - blade);
    ctx.stroke();
  }

  ctx.restore();
}
