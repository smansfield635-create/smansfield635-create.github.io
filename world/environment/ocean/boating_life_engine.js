export function createOceanBoatingLifeEngine() {
  function render(ctx, projector, runtime, state) {
    const { centerX, centerY, radius } = projector.state;

    const boatX = centerX + Math.sin(state.time * 0.0002) * radius * 0.18;
    const boatY = centerY - radius * 0.16 + Math.cos(state.time * 0.00018) * radius * 0.035;

    ctx.save();
    ctx.globalAlpha = 0.78;

    ctx.beginPath();
    ctx.moveTo(boatX, boatY);
    ctx.lineTo(boatX + 9, boatY + 3);
    ctx.lineTo(boatX - 9, boatY + 3);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(boatX, boatY - 9);
    ctx.lineTo(boatX, boatY + 1);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(boatX, boatY - 9);
    ctx.lineTo(boatX + 7, boatY - 2);
    ctx.lineTo(boatX, boatY - 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(220,240,255,0.85)";
    ctx.fill();

    ctx.restore();
  }

  return Object.freeze({
    render
  });
}
