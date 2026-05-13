// /assets/world/environment/climate.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_CLIMATE_TNT_v1
// Owns: sky, cloud, haze, sunlight, wind, weather pressure, and atmosphere.

import { clamp, lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_CLIMATE_VERSION = "reusable-planetary-climate-v1";

export function drawClimateLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t } = frame;
  const climate = profile.climate;
  const palette = climate.palette;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, rgba(palette.skyTop, 1));
  sky.addColorStop(0.20, rgba(palette.skyMid, 1));
  sky.addColorStop(0.39, rgba(palette.skyWarm, 1));
  sky.addColorStop(0.58, rgba(palette.skyLow, 1));
  sky.addColorStop(1, "rgb(34,54,45)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sunX = w * climate.sunX;
  const sunY = h * climate.sunY;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.62);
  sun.addColorStop(0, rgba([255, 246, 210], 0.60));
  sun.addColorStop(0.22, rgba(palette.sun, 0.34));
  sun.addColorStop(0.58, rgba(palette.sun, 0.10));
  sun.addColorStop(1, rgba(palette.sun, 0));
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  drawCloudBanks(ctx, profile, cell, frame);
}

export function drawCloudBanks(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t } = frame;
  const density = clamp(profile.climate.cloudDensity, 0, 1);
  const wind = profile.climate.wind;

  ctx.save();

  for (let i = 0; i < Math.round(24 + density * 26); i += 1) {
    const drift = t * 0.002 * wind * (0.4 + hash01(i, 12, 1, cell.seed));
    const x = ((hash01(i, 11, 2, cell.seed) + drift) % 1) * w;
    const y = h * (0.035 + hash01(i, 13, 3, cell.seed) * 0.25);
    const rx = w * (0.024 + hash01(i, 14, 4, cell.seed) * 0.090);
    const ry = h * (0.005 + hash01(i, 15, 5, cell.seed) * 0.020);
    const alpha = 0.055 + hash01(i, 16, 6, cell.seed) * 0.19;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255,255,255,.52)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash01(i, 18, 7, cell.seed) * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawBirdsAndAir(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t } = frame;
  const birdCount = Math.round(4 + profile.wildlife.birds * 11);
  const phase = (t * 0.025) % 1;

  ctx.save();
  ctx.strokeStyle = "rgba(20,28,31,.50)";
  ctx.lineWidth = Math.max(1, w * 0.00075);

  for (let i = 0; i < birdCount; i += 1) {
    const x = ((hash01(i, 210, 1, cell.seed) + phase * (0.05 + hash01(i, 211, 2, cell.seed) * 0.06)) % 1) * w;
    const y = h * (0.11 + hash01(i, 212, 3, cell.seed) * 0.20);
    const s = w * (0.0032 + hash01(i, 213, 4, cell.seed) * 0.0042);
    const flap = Math.sin(t * 2.2 + i) * s * 0.35;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.50, y - s * 0.50 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.50, y - s * 0.50 + flap, x + s, y);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawAtmosphereComposite(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const hazePower = clamp(profile.climate.haze, 0, 1);
  const hazeColor = profile.climate.palette.haze;

  const horizonHaze = ctx.createLinearGradient(0, h * 0.30, 0, h * 0.68);
  horizonHaze.addColorStop(0, rgba(hazeColor, 0.05 * hazePower));
  horizonHaze.addColorStop(0.45, rgba(hazeColor, 0.11 * hazePower));
  horizonHaze.addColorStop(1, rgba(hazeColor, 0));
  ctx.fillStyle = horizonHaze;
  ctx.fillRect(0, h * 0.30, w, h * 0.40);

  const vignette = ctx.createRadialGradient(w * 0.50, h * 0.50, h * 0.22, w * 0.50, h * 0.50, w * 0.86);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.78, "rgba(0,0,0,.035)");
  vignette.addColorStop(1, "rgba(0,0,0,.27)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
