export function createOceanSeaLifeEngine() {
  function render(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;

    ctx.save();
    ctx.globalAlpha = 0.06;

    for (let i = 0; i < 7; i += 1) {
      const x = centerX + Math.sin(state.time * 0.00045 + i * 0.9) * radius * (0.18 + i * 0.03);
      const y = centerY + Math.cos(state.time * 0.00031 + i * 0.7) * radius * (0.08 + i * 0.02);

      ctx.beginPath();
      ctx.ellipse(x, y, 4, 2, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(184,236,255,0.90)";
      ctx.fill();
    }

    ctx.restore();
  }

  return Object.freeze({
    render
  });
}
