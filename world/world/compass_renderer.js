export function createCompassRenderer() {
  function render(ctx, runtime) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.34;
    const cardinals = runtime.cardinals;
    const harbor = runtime?.resolvedState?.branches?.harbor?.corePremise?.label ?? "harbor";

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(120, 169, 255, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.stroke();

    ctx.fillStyle = "#e8eefc";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", cx, cy - radius - 8);
    ctx.fillText("S", cx, cy + radius + 16);
    ctx.fillText("E", cx + radius + 12, cy + 4);
    ctx.fillText("W", cx - radius - 12, cy + 4);

    const headingAngle =
      cardinals.heading === "N" ? 0 :
      cardinals.heading === "E" ? Math.PI * 0.5 :
      cardinals.heading === "S" ? Math.PI :
      -Math.PI * 0.5;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(headingAngle);
    ctx.fillStyle = "#79a9ff";
    ctx.beginPath();
    ctx.moveTo(0, -radius + 12);
    ctx.lineTo(8, -radius + 28);
    ctx.lineTo(-8, -radius + 28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(232,238,252,0.78)";
    ctx.font = "500 11px system-ui, sans-serif";
    ctx.fillText(runtime.cardinals.heading, cx, cy + 4);

    ctx.font = "500 10px system-ui, sans-serif";
    ctx.fillStyle = "rgba(157,176,208,0.92)";
    ctx.fillText(harbor, cx, cy + radius + 34);
  }

  return Object.freeze({
    render
  });
}
