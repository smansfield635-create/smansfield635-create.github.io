import { drawByte, drawGlyphLabel, projectByteToSector } from "../assets/four_pixel_renderer.js";

export function createCompassRenderer() {
  function draw(ctx, runtime, viewport) {
    const { projection } = runtime;
    if (!projection) return;

    const centerX = 150;
    const centerY = 120;
    const radius = 58;
    const headingSector = projection.sector ?? "S";
    const projected = projectByteToSector(projection.stateByte, headingSector);

    drawCompassFrame(ctx, centerX, centerY, radius, projected.rotation);
    drawByte(ctx, projected.byte, centerX, centerY, 56, { rotation: projected.rotation });
    drawGlyphLabel(ctx, "ACTIVE STATE", centerX, centerY + 48, { font: "700 11px system-ui, sans-serif" });
    drawGlyphLabel(ctx, headingSector, centerX, centerY - 52, { font: "700 12px system-ui, sans-serif" });

    drawDiamondMarker(ctx, viewport.width - 120, 120, projection.bandIndex, projection.sector);
  }

  function drawCompassFrame(ctx, x, y, r, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.strokeStyle = "rgba(255,226,170,0.86)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.4, r * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.7, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.7, 0);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,184,120,0.18)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,236,186,0.96)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function drawDiamondMarker(ctx, x, y, band, sector) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(24, 0);
    ctx.lineTo(0, 26);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,182,92,0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,230,186,0.84)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,239,210,0.96)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.fillText(`B${band}`, 0, -2);
    ctx.font = "600 10px system-ui, sans-serif";
    ctx.fillText(sector, 0, 16);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
