function ridge(ctx, points, fillStyle, strokeStyle, lineWidth = 1.5) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1] + 280);
  ctx.lineTo(points[0][0], points[0][1] + 280);
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
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.68);
    sky.addColorStop(0, "rgba(118,168,244,1)");
    sky.addColorStop(0.46, "rgba(148,194,248,1)");
    sky.addColorStop(1, "rgba(198,228,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFarOceanBand(ctx, width, height) {
    const bandY = height * 0.30;
    const ocean = ctx.createLinearGradient(0, bandY, 0, height * 0.56);
    ocean.addColorStop(0, "rgba(160,212,228,0.84)");
    ocean.addColorStop(1, "rgba(126,188,212,0.42)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, bandY, width, height * 0.26);

    for (let i = 0; i < 8; i += 1) {
      drawSeaBand(ctx, bandY + 14 + (i * 10), width, 0.06 - (i * 0.005));
    }
  }

  function drawFarMountains(ctx, width, height) {
    const leftRange = [
      [-60, height * 0.34],
      [40, height * 0.30],
      [110, height * 0.28],
      [182, height * 0.30],
      [258, height * 0.27],
      [332, height * 0.31],
      [422, height * 0.29],
      [506, height * 0.33]
    ];

    const rearRange = [
      [width * 0.46, height * 0.38],
      [width * 0.54, height * 0.32],
      [width * 0.62, height * 0.26],
      [width * 0.70, height * 0.22],
      [width * 0.78, height * 0.20],
      [width * 0.86, height * 0.22],
      [width * 0.94, height * 0.28],
      [width + 80, height * 0.34]
    ];

    const summitRange = [
      [width * 0.52, height * 0.40],
      [width * 0.58, height * 0.32],
      [width * 0.64, height * 0.22],
      [width * 0.70, height * 0.12],
      [width * 0.76, height * 0.08],
      [width * 0.82, height * 0.12],
      [width * 0.88, height * 0.20],
      [width * 0.94, height * 0.30],
      [width + 60, height * 0.40]
    ];

    ridge(ctx, leftRange, "rgba(144,170,188,0.20)", "rgba(232,242,248,0.09)", 1.1);
    ridge(ctx, rearRange, "rgba(136,164,186,0.28)", "rgba(232,242,248,0.10)", 1.15);
    ridge(ctx, summitRange, "rgba(178,182,182,0.46)", "rgba(248,244,236,0.16)", 1.4);
  }

  function drawAtmosphericBands(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.12, 0, height * 0.52);
    haze.addColorStop(0, "rgba(248,244,236,0.12)");
    haze.addColorStop(0.42, "rgba(240,242,244,0.07)");
    haze.addColorStop(1, "rgba(240,242,244,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.10, width, height * 0.42);

    const horizonGlow = ctx.createLinearGradient(0, height * 0.28, 0, height * 0.42);
    horizonGlow.addColorStop(0, "rgba(246,244,236,0.12)");
    horizonGlow.addColorStop(1, "rgba(246,244,236,0)");
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, height * 0.24, width, height * 0.20);

    const nearGlow = ctx.createLinearGradient(0, height * 0.44, 0, height * 0.64);
    nearGlow.addColorStop(0, "rgba(236,246,248,0.10)");
    nearGlow.addColorStop(1, "rgba(236,246,248,0)");
    ctx.fillStyle = nearGlow;
    ctx.fillRect(0, height * 0.42, width, height * 0.22);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.004) * 18;

    cloud(ctx, width * 0.20 + drift, height * 0.16, 1.08, 0.22);
    cloud(ctx, width * 0.50 + drift * 0.7, height * 0.11, 1.20, 0.20);
    cloud(ctx, width * 0.78 + drift * 0.5, height * 0.18, 0.96, 0.17);
    cloud(ctx, width * 0.66 - drift * 0.4, height * 0.08, 0.76, 0.15);
  }

  return Object.freeze({ draw });
}
