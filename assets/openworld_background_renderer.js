/* DESTINATION FILE: /assets/openworld_background_renderer.js */

export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawAtmosphere(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "rgba(114,180,255,1)");
    sky.addColorStop(0.42, "rgba(172,216,255,1)");
    sky.addColorStop(1, "rgba(236,246,255,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawAtmosphere(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, 0, 0, height * 0.62);
    haze.addColorStop(0, "rgba(255,255,255,0.16)");
    haze.addColorStop(0.58, "rgba(255,255,255,0.05)");
    haze.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, width, height * 0.62);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.0032) * 18;

    cloud(ctx, width * 0.18 + drift, height * 0.12, 1.08, 0.12);
    cloud(ctx, width * 0.48 + (drift * 0.55), height * 0.08, 1.24, 0.10);
    cloud(ctx, width * 0.79 - (drift * 0.35), height * 0.15, 0.92, 0.08);
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
