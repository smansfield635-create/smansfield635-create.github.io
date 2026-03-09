function ridge(ctx, points, fillStyle, strokeStyle, lineWidth = 1.5) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1] + 300);
  ctx.lineTo(points[0][0], points[0][1] + 300);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function cloud(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.ellipse(-34, 0, 28, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(0, -10, 34, 24, 0, 0, Math.PI * 2);
  ctx.ellipse(38, 0, 28, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 8, 56, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(250,250,248,${alpha})`;
  ctx.fill();
  ctx.restore();
}

function drawSeaBand(ctx, y, width, alpha) {
  ctx.fillStyle = `rgba(194,226,238,${alpha})`;
  ctx.fillRect(0, y, width, 2);
}

export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawFarOceanBand(ctx, width, height);
    drawFarMountains(ctx, width, height);
    drawAtmosphericBands(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.70);
    sky.addColorStop(0, "rgba(118,170,246,1)");
    sky.addColorStop(0.42, "rgba(150,198,248,1)");
    sky.addColorStop(1, "rgba(204,232,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFarOceanBand(ctx, width, height) {
    const bandY = height * 0.29;
    const ocean = ctx.createLinearGradient(0, bandY, 0, height * 0.58);
    ocean.addColorStop(0, "rgba(164,216,230,0.84)");
    ocean.addColorStop(1, "rgba(126,188,212,0.40)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, bandY, width, height * 0.29);

    for (let i = 0; i < 10; i += 1) {
      drawSeaBand(ctx, bandY + 12 + (i * 10), width, 0.06 - (i * 0.004));
    }
  }

  function drawFarMountains(ctx, width, height) {
    const rearRange = [
      [width * 0.40, height * 0.40],
      [width * 0.48, height * 0.34],
      [width * 0.58, height * 0.28],
      [width * 0.68, height * 0.24],
      [width * 0.78, height * 0.22],
      [width * 0.88, height * 0.26],
      [width + 80, height * 0.34]
    ];

    const summitRange = [
      [width * 0.46, height * 0.46],
      [width * 0.54, height * 0.36],
      [width * 0.62, height * 0.26],
      [width * 0.70, height * 0.14],
      [width * 0.76, height * 0.08],
      [width * 0.82, height * 0.12],
      [width * 0.88, height * 0.22],
      [width * 0.94, height * 0.34],
      [width + 60, height * 0.44]
    ];

    const summitSpur = [
      [width * 0.56, height * 0.44],
      [width * 0.62, height * 0.34],
      [width * 0.68, height * 0.24],
      [width * 0.74, height * 0.18],
      [width * 0.80, height * 0.22],
      [width * 0.86, height * 0.32],
      [width * 0.92, height * 0.42]
    ];

    ridge(ctx, rearRange, "rgba(144,170,188,0.22)", "rgba(232,242,248,0.10)", 1.1);
    ridge(ctx, summitRange, "rgba(182,184,182,0.50)", "rgba(248,244,236,0.16)", 1.45);
    ridge(ctx, summitSpur, "rgba(208,204,196,0.18)", "rgba(250,246,238,0.08)", 1.0);
  }

  function drawAtmosphericBands(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.10, 0, height * 0.54);
    haze.addColorStop(0, "rgba(248,244,236,0.12)");
    haze.addColorStop(0.40, "rgba(240,242,244,0.07)");
    haze.addColorStop(1, "rgba(240,242,244,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.08, width, height * 0.46);

    const horizonGlow = ctx.createLinearGradient(0, height * 0.24, 0, height * 0.44);
    horizonGlow.addColorStop(0, "rgba(248,246,240,0.14)");
    horizonGlow.addColorStop(1, "rgba(248,246,240,0)");
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, height * 0.22, width, height * 0.24);

    const nearGlow = ctx.createLinearGradient(0, height * 0.44, 0, height * 0.66);
    nearGlow.addColorStop(0, "rgba(236,246,248,0.10)");
    nearGlow.addColorStop(1, "rgba(236,246,248,0)");
    ctx.fillStyle = nearGlow;
    ctx.fillRect(0, height * 0.42, width, height * 0.24);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.004) * 18;

    cloud(ctx, width * 0.18 + drift, height * 0.16, 1.06, 0.20);
    cloud(ctx, width * 0.48 + drift * 0.7, height * 0.11, 1.18, 0.18);
    cloud(ctx, width * 0.78 + drift * 0.5, height * 0.18, 0.94, 0.15);
    cloud(ctx, width * 0.64 - drift * 0.4, height * 0.08, 0.74, 0.14);
  }

  return Object.freeze({ draw });
}
