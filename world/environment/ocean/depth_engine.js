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
      0.6 +
      0.22 * Math.sin(latRad * 2.0) +
      0.08 * Math.cos(lonRad * 1.7) +
      (noise(latDeg, lonDeg) - 0.5) * 0.16;

    return clamp(base, 0, 1);
  }

  function getDepthColor(depth) {
    if (depth < 0.22) return "rgba(116,243,230,0.20)";
    if (depth < 0.38) return "rgba(62,224,214,0.16)";
    if (depth < 0.56) return "rgba(35,198,216,0.13)";
    if (depth < 0.74) return "rgba(22,143,200,0.11)";
    if (depth < 0.90) return "rgba(11,93,167,0.10)";
    return "rgba(2,21,63,0.14)";
  }

  function drawBaseOceanBody(ctx, centerX, centerY, radius) {
    const baseGradient = ctx.createRadialGradient(
      centerX - radius * 0.28,
      centerY - radius * 0.24,
      radius * 0.04,
      centerX + radius * 0.10,
      centerY + radius * 0.10,
      radius * 1.02
    );

    baseGradient.addColorStop(0.00, "#74f3e6");
    baseGradient.addColorStop(0.10, "#3ce0d6");
    baseGradient.addColorStop(0.22, "#23c6d8");
    baseGradient.addColorStop(0.40, "#168fc8");
    baseGradient.addColorStop(0.60, "#0b5da7");
    baseGradient.addColorStop(0.82, "#06346f");
    baseGradient.addColorStop(1.00, "#02153f");

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
        radius * (depth < 0.28 ? 0.022 : depth < 0.64 ? 0.018 : 0.015);

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, sampleRadius, 0, Math.PI * 2);
      ctx.fillStyle = getDepthColor(depth);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawShelfGradient(ctx, centerX, centerY, radius) {
    const shelfGradient = ctx.createRadialGradient(
      centerX - radius * 0.18,
      centerY - radius * 0.14,
      radius * 0.03,
      centerX - radius * 0.02,
      centerY - radius * 0.02,
      radius * 0.92
    );

    shelfGradient.addColorStop(0.00, "rgba(150,255,242,0.18)");
    shelfGradient.addColorStop(0.16, "rgba(92,245,232,0.12)");
    shelfGradient.addColorStop(0.36, "rgba(42,212,223,0.07)");
    shelfGradient.addColorStop(0.62, "rgba(15,130,205,0.03)");
    shelfGradient.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.fillStyle = shelfGradient;
    ctx.fill();
  }

  function drawDepthFalloff(ctx, centerX, centerY, radius) {
    const falloff = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.26,
      centerX,
      centerY,
      radius
    );

    falloff.addColorStop(0.00, "rgba(0,0,0,0)");
    falloff.addColorStop(0.56, "rgba(0,0,0,0.04)");
    falloff.addColorStop(0.82, "rgba(0,0,0,0.13)");
    falloff.addColorStop(1.00, "rgba(0,0,0,0.24)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = falloff;
    ctx.fill();
  }

  function drawSpecularSheen(ctx, centerX, centerY, radius) {
    const sheen = ctx.createRadialGradient(
      centerX - radius * 0.30,
      centerY - radius * 0.24,
      radius * 0.02,
      centerX - radius * 0.16,
      centerY - radius * 0.12,
      radius * 0.58
    );

    sheen.addColorStop(0.00, "rgba(255,255,255,0.16)");
    sheen.addColorStop(0.18, "rgba(215,255,250,0.09)");
    sheen.addColorStop(0.42, "rgba(120,245,235,0.05)");
    sheen.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.99, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();
  }

  function drawWaterBands(ctx, centerX, centerY, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = "rgba(110,245,232,0.05)";
    ctx.lineWidth = 1.25;

    for (let i = 0; i < 5; i += 1) {
      const bandRadius = radius * (0.34 + i * 0.10);

      ctx.beginPath();
      ctx.arc(
        centerX + radius * 0.04,
        centerY + radius * (i - 2) * 0.018,
        bandRadius,
        0.18 * Math.PI,
        0.82 * Math.PI
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const { centerX, centerY, radius } = projector.state;

    drawBaseOceanBody(ctx, centerX, centerY, radius);
    drawDepthSamples(ctx, terrainField, radius);
    drawShelfGradient(ctx, centerX, centerY, radius);
    drawDepthFalloff(ctx, centerX, centerY, radius);
    drawSpecularSheen(ctx, centerX, centerY, radius);
    drawWaterBands(ctx, centerX, centerY, radius);

    return Object.freeze({
      mode: "masked_ocean_fill"
    });
  }

  return Object.freeze({
    render
  });
}
