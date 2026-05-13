// /assets/world/environment/water.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_WATER_HEX_SHIMMER_PROTOCOL_TNT_v2
// Owns: waves, foam, shimmer, tide, reflection, shoreline motion, ocean depth.

import { clamp, lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_WATER_VERSION = "reusable-planetary-water-hex-shimmer-protocol-v2";

export const SHIMMER_PROTOCOL = Object.freeze({
  waves: "layered movement across distance",
  foam: "shoreline and wave-edge articulation",
  shimmer: "light scattering across moving water",
  tide: "slow wet/dry pulse at the edge",
  reflection: "sun, sky, cloud, and atmosphere carried across the surface"
});

export function drawWaterLayer(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const water = profile.water;
  const camera = profile.camera;
  const palette = water.palette;

  if (!water.enabled) return;

  const top = h * camera.horizon;
  const bottom = h * camera.shoreline;
  const tideOffset = Math.sin(t * 0.18) * h * 0.006 * water.tide;

  const ocean = ctx.createLinearGradient(0, top, 0, bottom);
  ocean.addColorStop(0, rgba(palette.far, 1));
  ocean.addColorStop(0.34, rgba(palette.mid, 1));
  ocean.addColorStop(0.72, rgba(palette.near, 1));
  ocean.addColorStop(1, rgba(palette.deep, 1));

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 132; i += 1) {
    const nx = i / 132;
    const sample = hexfield?.sample(nx, camera.horizon, t);
    const x = nx * w;
    const y =
      top +
      Math.sin(i * 0.31 + t * 0.36) * h * 0.003 * water.waveStrength +
      Math.sin(i * 1.43 + t * 0.15) * h * 0.0018 * water.waveStrength +
      (sample?.wave || 0) * h * 0.0016;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, bottom + tideOffset);
  ctx.lineTo(0, bottom + tideOffset);
  ctx.closePath();
  ctx.fill();

  drawReflection(ctx, profile, cell, frame, top, bottom);
  drawWaveBands(ctx, profile, cell, frame, top, bottom);
  drawShimmer(ctx, profile, cell, frame, top, bottom);
}

function drawReflection(ctx, profile, cell, frame, top, bottom) {
  const { width: w, height: h } = frame;
  const reflection = profile.water.reflection;
  const sunX = profile.climate.sunX;
  const shimmerColor = profile.water.palette.shimmer;

  const glow = ctx.createRadialGradient(w * sunX, h * 0.405, 0, w * sunX, h * 0.46, w * 0.45);
  glow.addColorStop(0, rgba(shimmerColor, 0.28 * reflection));
  glow.addColorStop(0.28, rgba(shimmerColor, 0.14 * reflection));
  glow.addColorStop(0.74, rgba(shimmerColor, 0.04 * reflection));
  glow.addColorStop(1, rgba(shimmerColor, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, top, w, bottom - top);
}

function drawWaveBands(ctx, profile, cell, frame, top, bottom) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const strength = profile.water.waveStrength;

  ctx.save();
  ctx.lineWidth = Math.max(1, w * 0.0008);

  for (let j = 0; j < 48; j += 1) {
    const ny = lerp(profile.camera.horizon + 0.026, profile.camera.shoreline - 0.020, j / 48);
    const y = h * ny;
    ctx.globalAlpha = Math.max(0.028, 0.17 - j * 0.0032);
    ctx.strokeStyle = rgba(profile.water.palette.foam, 0.16 * strength);
    ctx.beginPath();

    for (let i = 0; i <= 110; i += 1) {
      const nx = i / 110;
      const sample = hexfield?.sample(nx, ny, t);
      const x = nx * w;
      const wave =
        Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.0018 * strength +
        Math.sin(i * 1.65 + t * 0.30) * h * 0.0011 * strength +
        (sample?.wave || 0) * h * 0.0013;

      if (i === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawShimmer(ctx, profile, cell, frame, top, bottom) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const shimmer = profile.water.shimmer;
  const sunX = profile.climate.sunX;
  const shimmerColor = profile.water.palette.shimmer;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < Math.round(145 + shimmer * 90); i += 1) {
    const nx = clamp(sunX - 0.36 + hash01(i, 40, 1, cell.seed) * 0.62, 0, 1);
    const ny = lerp(profile.camera.horizon + 0.04, profile.camera.shoreline - 0.018, hash01(i, 41, 2, cell.seed));
    const sample = hexfield?.sample(nx, ny, t);
    const pulse = sample?.shimmer ?? Math.max(0, Math.sin(t * 1.28 + i * 0.61));
    const alpha = (0.025 + pulse * 0.14) * shimmer;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgba(shimmerColor, 0.72);
    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.0011 + hash01(i, 42, 3, cell.seed) * 0.0038),
      h * 0.00075,
      -0.14,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
}

export function drawFoamAndTideEdge(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const line = profile.camera.shoreline;
  const tide = Math.sin(t * 0.18) * h * 0.006 * profile.water.tide;
  const foamStrength = profile.water.foam;

  ctx.strokeStyle = rgba(profile.water.palette.foam, 0.36 * foamStrength);
  ctx.lineWidth = Math.max(1, w * 0.0009);
  ctx.beginPath();

  for (let i = 0; i <= 132; i += 1) {
    const nx = i / 132;
    const sample = hexfield?.sample(nx, line, t);
    const x = nx * w;
    const y =
      h * line +
      tide +
      Math.sin(i * 0.54 + t * 0.56) * h * 0.003 +
      Math.sin(i * 1.80 + t * 0.22) * h * 0.0014 +
      (sample?.tide || 0) * h * 0.0016;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}
