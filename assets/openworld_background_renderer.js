export function createBackgroundRenderer() {
  function draw(ctx, width, height) {
    drawOceanMass(ctx, width, height);
  }

  function drawOceanMass(ctx, width, height) {
    ctx.save();

    // Unified top-down ocean field: no sky, no horizon, no clouds.
    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "rgba(12,68,114,1)");
    base.addColorStop(0.34, "rgba(18,88,138,1)");
    base.addColorStop(0.68, "rgba(28,116,166,1)");
    base.addColorStop(1, "rgba(44,146,188,1)");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const westDepth = ctx.createRadialGradient(
      width * 0.14,
      height * 0.74,
      12,
      width * 0.14,
      height * 0.74,
      width * 0.58
    );
    westDepth.addColorStop(0, "rgba(6,36,74,0.34)");
    westDepth.addColorStop(0.52, "rgba(8,48,88,0.14)");
    westDepth.addColorStop(1, "rgba(8,48,88,0)");
    ctx.fillStyle = westDepth;
    ctx.fillRect(0, 0, width, height);

    const eastDepth = ctx.createRadialGradient(
      width * 0.88,
      height * 0.52,
      10,
      width * 0.88,
      height * 0.52,
      width * 0.44
    );
    eastDepth.addColorStop(0, "rgba(8,42,82,0.26)");
    eastDepth.addColorStop(0.56, "rgba(8,42,82,0.10)");
    eastDepth.addColorStop(1, "rgba(8,42,82,0)");
    ctx.fillStyle = eastDepth;
    ctx.fillRect(0, 0, width, height);

    const coastalLift = ctx.createLinearGradient(0, 0, 0, height);
    coastalLift.addColorStop(0, "rgba(224,244,248,0.015)");
    coastalLift.addColorStop(0.40, "rgba(224,244,248,0.008)");
    coastalLift.addColorStop(1, "rgba(224,244,248,0)");
    ctx.fillStyle = coastalLift;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
