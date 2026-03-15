export function createDepthEngine() {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

    baseGradient.addColorStop(0.00, "#79ffef");
    baseGradient.addColorStop(0.10, "#49f1e7");
    baseGradient.addColorStop(0.22, "#22d7e7");
    baseGradient.addColorStop(0.40, "#1696d2");
    baseGradient.addColorStop(0.62, "#0d5da8");
    baseGradient.addColorStop(0.84, "#063673");
    baseGradient.addColorStop(1.00, "#02153f");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = baseGradient;
    ctx.fill();
  }

  function getWaterDepthBand(sample) {
    const waterDepth = clamp(sample.seaLevel - sample.elevation, 0, 1);

    if (waterDepth < 0.025) return "shore";
    if (waterDepth < 0.09) return "upper_shelf";
    if (waterDepth < 0.18) return "shelf";
    if (waterDepth < 0.32) return "mid";
    if (waterDepth < 0.52) return "deep";
    return "abyss";
  }

  function getWaterColor(sample) {
    const band = getWaterDepthBand(sample);

    if (band === "shore") return "rgba(135,255,242,0.36)";
    if (band === "upper_shelf") return "rgba(90,248,235,0.28)";
    if (band === "shelf") return "rgba(50,221,232,0.22)";
    if (band === "mid") return "rgba(20,166,223,0.17)";
    if (band === "deep") return "rgba(10,96,184,0.15)";
    return "rgba(3,23,72,0.18)";
  }

  function getWaterRadius(radius, sample) {
    const waterDepth = clamp(sample.seaLevel - sample.elevation, 0, 1);

    if (waterDepth < 0.025) return radius * 0.026;
    if (waterDepth < 0.09) return radius * 0.023;
    if (waterDepth < 0.18) return radius * 0.020;
    if (waterDepth < 0.32) return radius * 0.018;
    if (waterDepth < 0.52) return radius * 0.016;
    return radius * 0.015;
  }

  function drawDepthSamples(ctx, terrainField, radius) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    ctx.save();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "OCEAN") continue;

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, getWaterRadius(radius, sample), 0, Math.PI * 2);
      ctx.fillStyle = getWaterColor(sample);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawShelfGlow(ctx, terrainField, radius) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    ctx.save();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "OCEAN") continue;

      const waterDepth = clamp(sample.seaLevel - sample.elevation, 0, 1);
      if (waterDepth > 0.11) continue;

      const alpha = 0.05 + (1 - clamp(waterDepth / 0.11, 0, 1)) * 0.14;
      const glowRadius = radius * (0.020 + (0.11 - waterDepth) * 0.10);

      const gradient = ctx.createRadialGradient(
        sample.x,
        sample.y,
        glowRadius * 0.16,
        sample.x,
        sample.y,
        glowRadius * 1.9
      );

      gradient.addColorStop(0.00, `rgba(145,255,242,${alpha})`);
      gradient.addColorStop(0.42, `rgba(90,242,231,${alpha * 0.75})`);
      gradient.addColorStop(1.00, "rgba(90,242,231,0)");

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
