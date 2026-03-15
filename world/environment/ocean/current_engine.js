export function createCurrentEngine() {
  function drawPrimaryCurrentArcs(ctx, centerX, centerY, radius, time) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.0012);

    ctx.save();
    ctx.strokeStyle = `rgba(135,230,255,${0.08 + pulse * 0.05})`;
    ctx.lineWidth = 1.8;

    for (let i = 0; i < 5; i += 1) {
      const arcRadius = radius * (0.34 + i * 0.09);
      const arcY = centerY + (i - 2) * radius * 0.08;
      const start = 0.18 * Math.PI + Math.sin(time * 0.00035 + i * 0.7) * 0.06;
      const end = 0.82 * Math.PI + Math.cos(time * 0.00028 + i * 0.6) * 0.06;

      ctx.beginPath();
      ctx.arc(centerX, arcY, arcRadius, start, end);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSecondaryFlowLanes(ctx, centerX, centerY, radius, time) {
    ctx.save();
    ctx.strokeStyle = "rgba(95,245,238,0.06)";
    ctx.lineWidth = 1.0;

    for (let i = 0; i < 4; i += 1) {
      const offsetX = Math.sin(time * 0.00022 + i) * radius * 0.025;
      const laneRadius = radius * (0.48 + i * 0.07);

      ctx.beginPath();
      ctx.arc(
        centerX + offsetX,
        centerY - radius * 0.10 + i * radius * 0.05,
        laneRadius,
        0.28 * Math.PI,
        0.72 * Math.PI
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMovingShimmer(ctx, centerX, centerY, radius, time) {
    const sweep = (Math.sin(time * 0.0007) * 0.5 + 0.5) * radius * 0.28;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.clip();

    const shimmer = ctx.createLinearGradient(
      centerX - radius * 0.9 + sweep,
      centerY - radius * 0.4,
      centerX - radius * 0.1 + sweep,
      centerY + radius * 0.4
    );

    shimmer.addColorStop(0.00, "rgba(255,255,255,0)");
    shimmer.addColorStop(0.35, "rgba(180,255,245,0.03)");
    shimmer.addColorStop(0.50, "rgba(255,255,255,0.08)");
    shimmer.addColorStop(0.65, "rgba(180,255,245,0.03)");
    shimmer.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = shimmer;
    ctx.fillRect(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2
    );

    ctx.restore();
  }

  function drawLocalizedEnergy(ctx, centerX, centerY, radius, time) {
    ctx.save();
    ctx.globalAlpha = 0.05;

    for (let i = 0; i < 5; i += 1) {
      const x =
        centerX +
        Math.sin(time * 0.0005 + i * 1.2) * radius * (0.18 + i * 0.08);
      const y =
        centerY +
        Math.cos(time * 0.0004 + i * 0.9) * radius * (0.10 + i * 0.05);

      const glow = ctx.createRadialGradient(
        x,
        y,
        radius * 0.01,
        x,
        y,
        radius * 0.08
      );

      glow.addColorStop(0.00, "rgba(120,255,242,0.8)");
      glow.addColorStop(0.45, "rgba(120,255,242,0.18)");
      glow.addColorStop(1.00, "rgba(120,255,242,0)");

      ctx.beginPath();
      ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.restore();
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const { centerX, centerY, radius } = projector.state;
    const time = state.time;

    drawPrimaryCurrentArcs(ctx, centerX, centerY, radius, time);
    drawSecondaryFlowLanes(ctx, centerX, centerY, radius, time);
    drawMovingShimmer(ctx, centerX, centerY, radius, time);
    drawLocalizedEnergy(ctx, centerX, centerY, radius, time);

    return Object.freeze({
      mode: "cinematic_stylized_current_field"
    });
  }

  return Object.freeze({
    render
  });
}
