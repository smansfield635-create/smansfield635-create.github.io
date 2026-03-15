export function createDepthEngine() {
  function drawBaseOceanBody(ctx, centerX, centerY, radius) {
    const baseGradient = ctx.createRadialGradient(
      centerX - radius * 0.28,
      centerY - radius * 0.24,
      radius * 0.04,
      centerX + radius * 0.10,
      centerY + radius * 0.10,
      radius * 1.02
    );

    baseGradient.addColorStop(0.00, "#72f0e4");
    baseGradient.addColorStop(0.12, "#35d8d1");
    baseGradient.addColorStop(0.26, "#1db7d7");
    baseGradient.addColorStop(0.44, "#158bc7");
    baseGradient.addColorStop(0.64, "#0b5ca7");
    baseGradient.addColorStop(0.84, "#06346f");
    baseGradient.addColorStop(1.00, "#02153f");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = baseGradient;
    ctx.fill();
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

    shelfGradient.addColorStop(0.00, "rgba(145,255,240,0.14)");
    shelfGradient.addColorStop(0.16, "rgba(90,245,232,0.10)");
    shelfGradient.addColorStop(0.36, "rgba(40,208,220,0.06)");
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
    falloff.addColorStop(0.82, "rgba(0,0,0,0.12)");
    falloff.addColorStop(1.00, "rgba(0,0,0,0.22)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = falloff;
    ctx.fill();
  }

  function drawAbyssBias(ctx, centerX, centerY, radius) {
    const abyss = ctx.createLinearGradient(
      centerX - radius * 0.90,
      centerY - radius * 0.20,
      centerX + radius * 0.95,
      centerY + radius * 0.30
    );

    abyss.addColorStop(0.00, "rgba(0,0,0,0.20)");
    abyss.addColorStop(0.24, "rgba(0,0,0,0.10)");
    abyss.addColorStop(0.54, "rgba(0,0,0,0.02)");
    abyss.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
    ctx.fillStyle = abyss;
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
    ctx.lineWidth = 1.4;

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

  function render(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;

    drawBaseOceanBody(ctx, centerX, centerY, radius);
    drawShelfGradient(ctx, centerX, centerY, radius);
    drawDepthFalloff(ctx, centerX, centerY, radius);
    drawAbyssBias(ctx, centerX, centerY, radius);
    drawSpecularSheen(ctx, centerX, centerY, radius);
    drawWaterBands(ctx, centerX, centerY, radius);

    return Object.freeze({
      mode: "safe_ocean_fill"
    });
  }

  return Object.freeze({
    render
  });
}
