// /assets/world/environment/water.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_VISUAL_DEFINITION_EXPANSION_WATER_TNT_v1
// Owns: ocean depth, waves, foam, shimmer, tide, reflection.
// Consumes: shared hexfield substrate through frame.hexfield.

import { clamp, lerp, rgba, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_WATER_VERSION =
  "h-earth-hex-visual-definition-expansion-water-v1";

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
  ocean.addColorStop(0, rgba([112, 164, 165], 1));
  ocean.addColorStop(0.22, rgba(palette.far, 1));
  ocean.addColorStop(0.48, rgba(palette.mid, 1));
  ocean.addColorStop(0.78, rgba(palette.near, 1));
  ocean.addColorStop(1, rgba(palette.deep, 1));

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.moveTo(0, top);

  for (let i = 0; i <= 160; i += 1) {
    const nx = i / 160;
    const sample = hexfield?.sample(nx, camera.horizon, t);
    const x = nx * w;
    const y =
      top +
      Math.sin(i * 0.31 + t * 0.36) * h * 0.0025 * water.waveStrength +
      Math.sin(i * 1.43 + t * 0.15) * h * 0.0016 * water.waveStrength +
      (sample?.wave || 0) * h * 0.0014;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, bottom + tideOffset);
  ctx.lineTo(0, bottom + tideOffset);
  ctx.closePath();
  ctx.fill();

  drawOceanDepthTexture(ctx, profile, cell, frame);
  drawReflection(ctx, profile, frame, top, bottom);
  drawWaveBands(ctx, profile, cell, frame, top, bottom);
  drawShimmer(ctx, profile, cell, frame, top, bottom);
}

function drawOceanDepthTexture(ctx, profile, cell, frame) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const top = profile.camera.horizon;
  const bottom = profile.camera.shoreline;

  ctx.save();

  for (let i = 0; i < 160; i += 1) {
    const nx = hash01(i, 510, 1, cell.seed);
    const ny = lerp(top + 0.03, bottom - 0.02, hash01(i, 511, 2, cell.seed));
    const sample = hexfield?.sample(nx, ny, t);
    const alpha = 0.012 + (sample?.waterDepth ?? 0.4) * 0.030;

    ctx.fillStyle = `rgba(5,36,62,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.005 + hash01(i, 512, 3, cell.seed) * 0.020),
      h * (0.0008 + hash01(i, 513, 4, cell.seed) * 0.0022),
      -0.08,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
}

function drawReflection(ctx, profile, frame, top, bottom) {
  const { width: w, height: h } = frame;
  const reflection = profile.water.reflection;
  const sunX = profile.climate.sunX;
  const shimmerColor = profile.water.palette.shimmer;

  const glow = ctx.createRadialGradient(w * sunX, h * 0.405, 0, w * sunX, h * 0.46, w * 0.48);
  glow.addColorStop(0, rgba(shimmerColor, 0.31 * reflection));
  glow.addColorStop(0.25, rgba(shimmerColor, 0.16 * reflection));
  glow.addColorStop(0.56, rgba(shimmerColor, 0.055 * reflection));
  glow.addColorStop(1, rgba(shimmerColor, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, top, w, bottom - top);
}

function drawWaveBands(ctx, profile, cell, frame, top, bottom) {
  const { width: w, height: h, time: t, hexfield } = frame;
  const strength = profile.water.waveStrength;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1, w * 0.00072);

  for (let j = 0; j < 60; j += 1) {
    const ny = lerp(profile.camera.horizon + 0.022, profile.camera.shoreline - 0.020, j / 60);
    const y = h * ny;
    const depthFade = 1 - j / 72;

    ctx.globalAlpha = Math.max(0.020, 0.16 * depthFade);
    ctx.strokeStyle = rgba(profile.water.palette.foam, 0.17 * strength);
    ctx.beginPath();

    for (let i = 0; i <= 130; i += 1) {
      const nx = i / 130;
      const sample = hexfield?.sample(nx, ny, t);
      const x = nx * w;
      const wave =
        Math.sin(i * 0.80 + j * 0.54 + t * 0.80) * h * 0.00145 * strength +
        Math.sin(i * 1.65 + t * 0.30) * h * 0.0010 * strength +
        (sample?.wave || 0) * h * 0.0011;

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

  for (let i = 0; i < Math.round(160 + shimmer * 120); i += 1) {
    const nx = clamp(sunX - 0.40 + hash01(i, 40, 1, cell.seed) * 0.68, 0, 1);
    const ny = lerp(
      profile.camera.horizon + 0.045,
      profile.camera.shoreline - 0.018,
      hash01(i, 41, 2, cell.seed)
    );
    const sample = hexfield?.sample(nx, ny, t);
    const pulse = sample?.shimmer ?? Math.max(0, Math.sin(t * 1.28 + i * 0.61));
    const lane = clamp(1 - Math.abs(nx - sunX) / 0.42, 0, 1);
    const alpha = (0.018 + pulse * 0.15) * shimmer * (0.40 + lane * 0.72);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgba(shimmerColor, 0.76);
    ctx.beginPath();
    ctx.ellipse(
      nx * w,
      ny * h,
      w * (0.0012 + hash01(i, 42, 3, cell.seed) * 0.0045),
      h * 0.00072,
      -0.12,
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

  ctx.save();
  ctx.lineCap = "round";

  for (let pass = 0; pass < 3; pass += 1) {
    ctx.strokeStyle = rgba(profile.water.palette.foam, (0.30 - pass * 0.07) * foamStrength);
    ctx.lineWidth = Math.max(1, w * (0.0008 + pass * 0.00025));
    ctx.beginPath();

    for (let i = 0; i <= 150; i += 1) {
      const nx = i / 150;
      const sample = hexfield?.sample(nx, line, t);
      const x = nx * w;
      const y =
        h * line +
        tide +
        Math.sin(i * 0.54 + t * 0.56 + pass) * h * 0.0027 +
        Math.sin(i * 1.80 + t * 0.22) * h * 0.0013 +
        (sample?.tide || 0) * h * 0.0015 +
        pass * h * 0.0024;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  ctx.restore();
}
