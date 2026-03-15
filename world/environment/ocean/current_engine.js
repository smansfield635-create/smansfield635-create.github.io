export function createCurrentEngine() {
  function render(ctx, projector, runtime, state, terrainField) {
    const { centerX, centerY, radius } = projector.state;
    const wave = 0.5 + 0.5 * Math.sin(state.time * 0.0014);

    ctx.save();
    ctx.strokeStyle = `rgba(130,220,255,${0.06 + wave * 0.04})`;
    ctx.lineWidth = 1.4;

    for (let i = 0; i < 4; i += 1) {
      const y = centerY + (i - 1.3) * radius * 0.11;

      ctx.beginPath();
      ctx.arc(
        centerX,
        y,
        radius * (0.58 - i * 0.055),
        0.22 * Math.PI,
        0.78 * Math.PI
      );
      ctx.stroke();
    }

    ctx.globalAlpha = 0.06;
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY - radius * 0.10,
      radius * 0.72,
      state.time * 0.00045,
      state.time * 0.00045 + Math.PI * 0.60
    );
    ctx.strokeStyle = "rgba(255,255,255,0.48)";
    ctx.lineWidth = 0.95;
    ctx.stroke();

    ctx.restore();
  }

  return Object.freeze({
    render
  });
}
