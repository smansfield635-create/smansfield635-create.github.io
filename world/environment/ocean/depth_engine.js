export function createDepthEngine() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function noise(latDeg, lonDeg) {
    return fract(
      Math.sin(latDeg * 12.9898 + lonDeg * 78.233) * 43758.5453123
    );
  }

  function getDepthLevel(latDeg, lonDeg) {
    const latRad = toRad(latDeg);
    const lonRad = toRad(lonDeg);

    const base =
      0.58 +
      0.22 * Math.sin(latRad * 2.1) +
      0.10 * Math.cos(lonRad * 1.45) +
      (noise(latDeg, lonDeg) - 0.5) * 0.18;

    return clamp(base, 0, 1);
  }

  function getDepthColor(depth) {
    if (depth < 0.18) return "rgba(115,255,240,0.34)";
    if (depth < 0.34) return "rgba(74,244,233,0.26)";
    if (depth < 0.52) return "rgba(44,212,229,0.19)";
    if (depth < 0.70) return "rgba(20,160,221,0.15)";
    if (depth < 0.86) return "rgba(12,98,186,0.13)";
    return "rgba(3,24,74,0.16)";
  }

  function drawBaseOceanBody(ctx, centerX, centerY, radius) {
    const baseGradient = ctx.createRadialGradient(
      centerX - radius * 0.30,
      centerY - radius * 0.26,
      radius * 0.04,
      centerX + radius * 0.08,
      centerY + radius * 0.10,
      radius * 1.04
    );

    baseGradient.addColorStop(0.00, "#7affef");
    baseGradient.addColorStop(0.10, "#49f1e7");
    baseGradient.addColorStop(0.22, "#22d7e7");
    baseGradient.addColorStop(0.40, "#1798d4");
    baseGradient.addColorStop(0.62, "#0d61b1");
    baseGradient.addColorStop(0.84, "#063978");
    baseGradient.addColorStop(1.00, "#021743");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = baseGradient;
    ctx.fill();
  }

  function drawDepthSamples(ctx, terrainField, radius) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    ctx.save();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "OCEAN") continue;

      const depth = getDepthLevel(sample.latDeg, sample.lonDeg);
      const sampleRadius =
        radius * (depth < 0.24 ? 0.024 : depth < 0.62 ? 0.019 : 0.016);

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, sampleRadius, 0, Math.PI * 2);
      ctx.fillStyle = getDepthColor(depth);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawShelfGlow(ctx, terrainField, radius) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    ctx.save();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "LAND") continue;
      if (!(sample.shoreline > 0.04)) continue;

      const glowRadius = radius * 0.018;
      const alpha = 0.04 + sample.shoreline * 0.10;

      const gradient = ctx.createRadialGradient(
        sample.x,
        sample.y,
        glowRadius * 0.15,
        sample.x,
        sample.y,
        glowRadius * 1.9
      );

      gradient.addColorStop(0.00, `rgba(145,255,242,${alpha})`);
      gradient.addColorStop(0.45, `rgba(88,240,230,${alpha * 0.75})`);
      gradient.addColorStop(1.00, "rgba(88,240,230,0)");

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, glowRadius * 1.9, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDepthFalloff(ctx, centerX, centerY, radius) {
    const falloff = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.22,
      centerX,
      centerY,
      radius
    );

    falloff.addColorStop(0.00, "rgba(0,0,0,0)");
    falloff.addColorStop(0.52, "rgba(0,0,0,0.03)");
    falloff.addColorStop(0.78, "rgba(0,0,0,0.11)");
    falloff.addColorStop(1.00, "rgba(0,0,0,0.23)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = falloff;
    ctx.fill();
  }

  function drawAbyssBias(ctx, centerX, centerY, radius) {
    const abyss = ctx.createLinearGradient(
      centerX - radius * 0.92,
      centerY - radius * 0.20,
      centerX + radius * 0.96,
      centerY + radius * 0.34
    );

    abyss.addColorStop(0.00, "rgba(0,0,0,0.24)");
    abyss.addColorStop(0.20, "rgba(0,0,0,0.12)");
    abyss.addColorStop(0.50, "rgba(0,0,0,0.03)");
    abyss.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
    ctx.fillStyle = abyss;
    ctx.fill();
  }

  function drawSpecularSheen(ctx, centerX, centerY, radius) {
    const sheen = ctx.createRadialGradient(
      centerX - radius * 0.32,
      centerY - radius * 0.24,
      radius * 0.02,
      centerX - radius * 0.15,
      centerY - radius * 0.10,
      radius * 0.64
    );

    sheen.addColorStop(0.00, "rgba(255,255,255,0.24)");
    sheen.addColorStop(0.16, "rgba(210,255,250,0.13)");
    sheen.addColorStop(0.34, "rgba(125,248,237,0.08)");
    sheen.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.99, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();
  }

  function drawWaveBloom(ctx, centerX, centerY, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = "rgba(115,255,240,0.07)";
    ctx.lineWidth = 1.35;

    for (let i = 0; i < 6; i += 1) {
      const bandRadius = radius * (0.30 + i * 0.095);

      ctx.beginPath();
      ctx.arc(
        centerX + radius * 0.05,
        centerY + radius * (i - 2.5) * 0.015,
        bandRadius,
        0.16 * Math.PI,
        0.84 * Math.PI
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const { centerX, centerY, radius } = projector.state;

    drawBaseOceanBody(ctx, centerX, centerY, radius);
    drawDepthSamples(ctx, terrainField, radius);
    drawShelfGlow(ctx, terrainField, radius);
    drawDepthFalloff(ctx, centerX, centerY, radius);
    drawAbyssBias(ctx, centerX, centerY, radius);
    drawSpecularSheen(ctx, centerX, centerY, radius);
    drawWaveBloom(ctx, centerX, centerY, radius);

    return Object.freeze({
      mode: "cinematic_stylized_ocean_body"
    });
  }

  return Object.freeze({
    render
  });
}
