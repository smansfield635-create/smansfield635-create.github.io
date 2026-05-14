// /assets/world/environment/climate.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_VISUAL_EXPRESSION_EXPANSION_THROUGH_LIVE_HEX_v2
// Owns: sky, cloud banks, haze, golden-hour light, wind, birds, atmosphere.

import { clamp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_CLIMATE_VERSION =
  "h-earth-visual-expression-expansion-through-live-hex-climate-v2";

const TAU = Math.PI * 2;

export function drawClimateLayer(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const climate = profile.climate;
  const palette = climate.palette;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, rgba(palette.skyTop, 1));
  sky.addColorStop(0.16, rgba([150, 174, 181], 1));
  sky.addColorStop(0.34, rgba(palette.skyWarm, 1));
  sky.addColorStop(0.54, rgba([166, 157, 111], 1));
  sky.addColorStop(0.72, rgba([74, 92, 68], 1));
  sky.addColorStop(1, rgba([25, 45, 38], 1));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  drawSunScatter(ctx, profile, frame);
  drawCloudBanks(ctx, profile, cell, frame);
  drawHighAirGrain(ctx, profile, cell, frame);
}

function drawSunScatter(ctx, profile, frame) {
  const { width: w, height: h } = frame;
  const climate = profile.climate;

  const sunX = w * climate.sunX;
  const sunY = h * climate.sunY;

  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.72);
  sun.addColorStop(0, "rgba(255,248,219,.70)");
  sun.addColorStop(0.18, rgba(climate.palette.sun, 0.38));
  sun.addColorStop(0.45, rgba(climate.palette.sun, 0.15));
  sun.addColorStop(0.80, rgba(climate.palette.sun, 0.035));
  sun.addColorStop(1, rgba(climate.palette.sun, 0));
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  const lowGold = ctx.createLinearGradient(0, h * 0.22, 0, h * 0.56);
  lowGold.addColorStop(0, "rgba(255,240,197,0)");
  lowGold.addColorStop(0.45, "rgba(255,228,168,.13)");
  lowGold.addColorStop(1, "rgba(255,228,168,0)");
  ctx.fillStyle = lowGold;
  ctx.fillRect(0, h * 0.18, w, h * 0.42);
}

export function drawCloudBanks(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const density = clamp(profile.climate.cloudDensity, 0, 1);
  const wind = profile.climate.wind;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const bankCount = Math.round(7 + density * 8);

  for (let bank = 0; bank < bankCount; bank += 1) {
    const baseX = (((hash01(bank, 310, 1, cell.seed) + t * 0.0016 * wind) % 1) + 1) % 1;
    const baseY = 0.045 + hash01(bank, 311, 2, cell.seed) * 0.265;
    const scaleX = 0.09 + hash01(bank, 312, 3, cell.seed) * 0.18;
    const scaleY = 0.010 + hash01(bank, 313, 4, cell.seed) * 0.026;
    const lobes = 7 + Math.floor(hash01(bank, 314, 5, cell.seed) * 8);

    for (let lobe = 0; lobe < lobes; lobe += 1) {
      const lx = baseX + (hash01(bank, lobe, 6, cell.seed) - 0.5) * scaleX;
      const ly = baseY + (hash01(bank, lobe, 7, cell.seed) - 0.5) * scaleY * 2.2;
      const nx = ((lx % 1) + 1) % 1;
      const sample = hexfield?.sample(nx, clamp(ly, 0, 1), t);
      const cloudPressure = sample?.cloudNoise ?? hash01(bank, lobe, 8, cell.seed);

      ctx.globalAlpha = (0.045 + cloudPressure * 0.075) * density;
      ctx.fillStyle = "rgba(255,255,255,.86)";
      ctx.beginPath();
      ctx.ellipse(
        nx * w,
        ly * h,
        w * scaleX * (0.15 + cloudPressure * 0.32),
        h * scaleY * (0.42 + cloudPressure * 0.95),
        cloudPressure * 0.18,
        0,
        TAU
      );
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawHighAirGrain(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 90; i += 1) {
    const nx = hash01(i, 410, 1, cell.seed);
    const ny = 0.06 + hash01(i, 411, 2, cell.seed) * 0.42;
    const sample = hexfield?.sample(nx, ny, t);
    const alpha = 0.010 + (sample?.cloudNoise ?? 0.4) * 0.020;

    ctx.fillStyle = `rgba(255,244,215,${alpha})`;
    ctx.beginPath();
    ctx.arc(nx * w, ny * h, Math.max(0.5, w * 0.0012), 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

export function drawBirdsAndAir(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const birdCount = Math.round(5 + profile.wildlife.birds * 13);
  const phase = (t * 0.025) % 1;

  ctx.save();
  ctx.strokeStyle = "rgba(17,25,26,.58)";
  ctx.lineWidth = Math.max(1, w * 0.00075);

  for (let i = 0; i < birdCount; i += 1) {
    const nx =
      ((hash01(i, 210, 1, cell.seed) +
        phase * (0.045 + hash01(i, 211, 2, cell.seed) * 0.065)) %
        1 +
        1) %
      1;
    const ny = 0.105 + hash01(i, 212, 3, cell.seed) * 0.235;
    const sample = hexfield?.sample(nx, ny, t);

    const x = nx * w;
    const y = ny * h + (sample?.wind ?? 0) * h * 0.001;
    const s = w * (0.0030 + hash01(i, 213, 4, cell.seed) * 0.0048);
    const flap = Math.sin(t * 2.4 + i) * s * 0.38;

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.quadraticCurveTo(x - s * 0.48, y - s * 0.48 - flap, x, y);
    ctx.quadraticCurveTo(x + s * 0.48, y - s * 0.48 + flap, x + s, y);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawAtmosphereComposite(ctx, profile, cell, frame) {
  const { width: w, height: h } = frame;
  const hazePower = clamp(profile.climate.haze, 0, 1);
  const hazeColor = profile.climate.palette.haze;

  const horizonHaze = ctx.createLinearGradient(0, h * 0.26, 0, h * 0.68);
  horizonHaze.addColorStop(0, rgba(hazeColor, 0.02 * hazePower));
  horizonHaze.addColorStop(0.30, rgba(hazeColor, 0.11 * hazePower));
  horizonHaze.addColorStop(0.58, rgba([255, 223, 162], 0.07 * hazePower));
  horizonHaze.addColorStop(1, rgba(hazeColor, 0));
  ctx.fillStyle = horizonHaze;
  ctx.fillRect(0, h * 0.26, w, h * 0.44);

  const distanceMist = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.60);
  distanceMist.addColorStop(0, "rgba(236,238,220,.06)");
  distanceMist.addColorStop(0.45, "rgba(236,238,220,.11)");
  distanceMist.addColorStop(1, "rgba(236,238,220,0)");
  ctx.fillStyle = distanceMist;
  ctx.fillRect(0, h * 0.30, w, h * 0.34);

  const vignette = ctx.createRadialGradient(
    w * 0.50,
    h * 0.50,
    h * 0.20,
    w * 0.50,
    h * 0.50,
    w * 0.88
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.78, "rgba(0,0,0,.035)");
  vignette.addColorStop(1, "rgba(0,0,0,.30)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
