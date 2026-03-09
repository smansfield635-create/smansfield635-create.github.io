export function createBackgroundRenderer() {

  function drawSky(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    grad.addColorStop(0, "#7aa6ff");
    grad.addColorStop(0.35, "#9ec4ff");
    grad.addColorStop(0.65, "#e7d1a4");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function drawSun(ctx, w, h) {
    const sunX = w * 0.68;
    const sunY = h * 0.30;
    const r = 48;

    ctx.beginPath();
    ctx.arc(sunX, sunY, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,230,170,0.95)";
    ctx.fill();
  }

  function drawWater(ctx, w, h) {
    const horizon = h * 0.55;

    const grad = ctx.createLinearGradient(0, horizon, 0, h);
    grad.addColorStop(0, "#7bc4e6");
    grad.addColorStop(1, "#3a7fa4");

    ctx.fillStyle = grad;
    ctx.fillRect(0, horizon, w, h - horizon);
  }

  function drawShoreline(ctx, w, h) {
    const y = h * 0.55;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      w * 0.20, y - 30,
      w * 0.40, y - 40,
      w * 0.60, y - 20
    );

    ctx.bezierCurveTo(
      w * 0.75, y - 10,
      w * 0.90, y + 20,
      w, y + 40
    );

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const sand = ctx.createLinearGradient(0, y, 0, h);
    sand.addColorStop(0, "#d9c48a");
    sand.addColorStop(1, "#c9b076");

    ctx.fillStyle = sand;
    ctx.fill();
  }

  function drawFoam(ctx, w, h, tick) {
    const y = h * 0.55;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";

    ctx.beginPath();

    const wave = Math.sin(tick * 0.02) * 4;

    ctx.moveTo(0, y + wave);

    ctx.bezierCurveTo(
      w * 0.25, y - 6 + wave,
      w * 0.45, y + 6 + wave,
      w * 0.65, y - 4 + wave
    );

    ctx.bezierCurveTo(
      w * 0.80, y + 6 + wave,
      w * 0.92, y - 2 + wave,
      w, y + wave
    );

    ctx.stroke();
  }

  function drawClouds(ctx, w, h, tick) {
    const clouds = [
      { x: w * 0.32, y: h * 0.22 },
      { x: w * 0.58, y: h * 0.25 },
      { x: w * 0.78, y: h * 0.28 }
    ];

    ctx.fillStyle = "rgba(255,255,255,0.55)";

    clouds.forEach((c) => {
      const drift = Math.sin((tick + c.x) * 0.002) * 8;

      ctx.beginPath();
      ctx.ellipse(c.x + drift, c.y, 42, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function draw(ctx, w, h, tick) {
    drawSky(ctx, w, h);
    drawSun(ctx, w, h);
    drawWater(ctx, w, h);
    drawShoreline(ctx, w, h);
    drawFoam(ctx, w, h, tick);
    drawClouds(ctx, w, h, tick);
  }

  return {
    draw
  };
}
