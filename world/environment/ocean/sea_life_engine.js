export function createSeaLifeEngine() {
  function render(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;

    ctx.save();
    ctx.globalAlpha = 0.035;

    for (let i = 0; i < 6; i += 1) {
      const x =
        centerX +
        Math.sin(state.time * 0.00045 + i * 0.9) *
          radius *
          (0.14 + i * 0.028);

      const y =
        centerY +
        Math.cos(state.time * 0.00031 + i * 0.7) *
          radius *
          (0.06 + i * 0.018);

      ctx.beginPath();
      ctx.ellipse(x, y, 2.2, 1.2, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(184,236,255,0.85)";
      ctx.fill();
    }

    ctx.restore();
  }

  return Object.freeze({
    render
  });
}
