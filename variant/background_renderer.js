export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    const horizonY = height * 0.34;

    drawSky(ctx, width, height, horizonY);
    drawSunGlow(ctx, width, height, horizonY, tick);
    drawFarAtmosphere(ctx, width, height, horizonY);
  }

  function drawSky(ctx, width, height, horizonY) {
    const sky = ctx.createLinearGradient(0, 0, 0, horizonY + height * 0.18);
    sky.addColorStop(0, "rgba(78,118,166,1)");
    sky.addColorStop(0.38, "rgba(120,154,188,1)");
    sky.addColorStop(0.72, "rgba(181,184,176,1)");
    sky.addColorStop(1, "rgba(212,198,170,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawSunGlow(ctx, width, height, horizonY, tick) {
    const x = width * 0.62;
    const y = horizonY - height * 0.08;
    const r = 90 + Math.sin(tick * 0.01) * 4;

    const glow = ctx.createRadialGradient(x, y, r * 0.08, x, y, r * 2.8);
    glow.addColorStop(0, "rgba(255,236,188,0.72)");
    glow.addColorStop(0.35, "rgba(255,203,140,0.32)");
    glow.addColorStop(1, "rgba(255,203,140,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,236,198,0.92)";
    ctx.fill();
  }

  function drawFarAtmosphere(ctx, width, height, horizonY) {
    const haze = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 120);
    haze.addColorStop(0, "rgba(255,220,170,0)");
    haze.addColorStop(0.45, "rgba(220,188,152,0.26)");
    haze.addColorStop(1, "rgba(220,188,152,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizonY - 30, width, 180);
  }

  return Object.freeze({ draw });
}
