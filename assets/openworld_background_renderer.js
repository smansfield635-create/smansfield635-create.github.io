export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawDistantOcean(ctx, width, height);
    drawAtmosphere(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.72);
    sky.addColorStop(0, "#72b4ff");
    sky.addColorStop(0.42, "#a6d5ff");
    sky.addColorStop(1, "#e5f4ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDistantOcean(ctx, width, height) {
    const horizon = height * 0.32;

    const ocean = ctx.createLinearGradient(0, horizon, 0, height);
    ocean.addColorStop(0, "rgba(128,192,222,0.78)");
    ocean.addColorStop(1, "rgba(44,112,152,0.90)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, horizon, width, height - horizon);

    for (let i = 0; i < 8; i += 1) {
      const y = horizon + 10 + (i * 12);
      ctx.fillStyle = `rgba(255,255,255,${0.04 - (i * 0.004)})`;
      ctx.fillRect(0, y, width, 2);
    }
  }

  function drawAtmosphere(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, 0, 0, height * 0.58);
    haze.addColorStop(0, "rgba(255,255,255,0.18)");
    haze.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, width, height * 0.58);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.003) * 20;

    cloud(ctx, width * 0.20 + drift, height * 0.12, 1.08, 0.12);
    cloud(ctx, width * 0.50 + (drift * 0.6), height * 0.08, 1.28, 0.10);
    cloud(ctx, width * 0.80 - (drift * 0.4), height * 0.15, 0.92, 0.08);
  }

  function cloud(ctx, x, y, scale, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.ellipse(-30, 0, 26, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(0, -8, 32, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(32, 0, 26, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();

    ctx.restore();
  }

  return Object.freeze({ draw });
}
