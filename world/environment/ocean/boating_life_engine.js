export function createBoatingLifeEngine() {
  function render(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;

    const boatX =
      centerX + Math.sin(state.time * 0.0002) * radius * 0.18;
    const boatY =
      centerY -
      radius * 0.16 +
      Math.cos(state.time * 0.00018) * radius * 0.035;

    ctx.save();

    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(boatX, boatY, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();

    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = "rgba(200,240,255,0.75)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(boatX - 2.2, boatY + 0.7);
    ctx.lineTo(boatX + 2.2, boatY + 0.7);
    ctx.stroke();

    ctx.restore();
  }

  return Object.freeze({
    render
  });
}
