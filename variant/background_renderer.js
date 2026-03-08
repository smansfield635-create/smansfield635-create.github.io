export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    const horizonY = height * 0.64;

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "rgba(28,36,58,1)");
    sky.addColorStop(0.42, "rgba(16,24,40,1)");
    sky.addColorStop(1, "rgba(8,10,16,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * 0.52, height * 0.22, 30,
      width * 0.52, height * 0.22, 280
    );
    glow.addColorStop(0, "rgba(255,184,132,0.36)");
    glow.addColorStop(1, "rgba(255,184,132,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    drawClouds(ctx, width, height, tick);
    drawWater(ctx, width, height, horizonY, tick);
  }

  function drawClouds(ctx, width, height, tick) {
    const t = tick * 0.01;
    const clouds = [
      { x: width * 0.28 + Math.sin(t * 0.8) * 20, y: height * 0.18, w: 110, h: 26, a: 0.12 },
      { x: width * 0.56 + Math.sin(t * 0.6 + 1.2) * 22, y: height * 0.24, w: 140, h: 30, a: 0.10 },
      { x: width * 0.78 + Math.sin(t * 0.5 + 2.0) * 18, y: height * 0.30, w: 100, h: 22, a: 0.10 }
    ];

    for (const c of clouds) {
      ctx.save();
      ctx.globalAlpha = c.a;
      ctx.beginPath();
      ctx.ellipse(c.x - c.w * 0.22, c.y, c.w * 0.34, c.h * 0.52, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + c.w * 0.10, c.y - c.h * 0.14, c.w * 0.42, c.h * 0.60, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + c.w * 0.38, c.y, c.w * 0.28, c.h * 0.48, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,230,220,1)";
      ctx.fill();
      ctx.restore();
    }
  }

  function drawWater(ctx, width, height, horizonY, tick) {
    const water = ctx.createLinearGradient(0, horizonY, 0, height);
    water.addColorStop(0, "rgba(54,50,78,0.42)");
    water.addColorStop(0.18, "rgba(28,26,54,0.68)");
    water.addColorStop(1, "rgba(6,8,18,1)");
    ctx.fillStyle = water;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    const base = height * 0.83;
    for (let layer = 0; layer < 8; layer += 1) {
      const depth = layer / 7;
      const yBase = base + layer * 13;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const wave1 = Math.sin(x * 0.018 + tick * 0.035 + layer) * 5 * (0.8 + depth * 0.3);
        const wave2 = Math.sin(x * 0.008 - tick * 0.022 + layer * 1.3) * 2.0;
        const y = yBase + wave1 + wave2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(196,188,224,${0.06 + depth * 0.10})`;
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }
  }

  return Object.freeze({ draw });
}
