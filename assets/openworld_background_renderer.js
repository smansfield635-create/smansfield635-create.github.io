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

export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawFarOceanBand(ctx, width, height);
    drawFarMountains(ctx, width, height);
    drawAtmosphericBands(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.66);
    sky.addColorStop(0, "rgba(122,170,244,1)");
    sky.addColorStop(0.50, "rgba(150,196,248,1)");
    sky.addColorStop(1, "rgba(194,226,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFarOceanBand(ctx, width, height) {
    const bandY = height * 0.30;
    const ocean = ctx.createLinearGradient(0, bandY, 0, height * 0.52);
    ocean.addColorStop(0, "rgba(156,208,226,0.86)");
    ocean.addColorStop(1, "rgba(128,188,212,0.46)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, bandY, width, height * 0.22);
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

    const rightRange = [
      [width * 0.48, height * 0.36],
      [width * 0.56, height * 0.30],
      [width * 0.64, height * 0.24],
      [width * 0.72, height * 0.20],
      [width * 0.80, height * 0.18],
      [width * 0.88, height * 0.20],
      [width * 0.96, height * 0.26],
      [width + 80, height * 0.34]
    ];

    const summitRange = [
      [width * 0.52, height * 0.40],
      [width * 0.58, height * 0.33],
      [width * 0.64, height * 0.24],
      [width * 0.70, height * 0.16],
      [width * 0.76, height * 0.12],
      [width * 0.82, height * 0.14],
      [width * 0.88, height * 0.22],
      [width * 0.94, height * 0.32],
      [width + 60, height * 0.40]
    ];

    ridge(ctx, leftRange, "rgba(144,170,188,0.22)", "rgba(232,242,248,0.10)", 1.1);
    ridge(ctx, rightRange, "rgba(136,164,186,0.30)", "rgba(232,242,248,0.10)", 1.2);
    ridge(ctx, summitRange, "rgba(174,178,178,0.42)", "rgba(248,244,236,0.14)", 1.35);
  }

  function drawAtmosphericBands(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.14, 0, height * 0.48);
    haze.addColorStop(0, "rgba(248,244,236,0.10)");
    haze.addColorStop(0.44, "rgba(240,242,244,0.07)");
    haze.addColorStop(1, "rgba(240,242,244,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.12, width, height * 0.38);

    const nearGlow = ctx.createLinearGradient(0, height * 0.42, 0, height * 0.60);
    nearGlow.addColorStop(0, "rgba(236,246,248,0.10)");
    nearGlow.addColorStop(1, "rgba(236,246,248,0)");
    ctx.fillStyle = nearGlow;
    ctx.fillRect(0, height * 0.42, width, height * 0.20);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.004) * 18;

    cloud(ctx, width * 0.20 + drift, height * 0.16, 1.08, 0.24);
    cloud(ctx, width * 0.50 + drift * 0.7, height * 0.11, 1.20, 0.22);
    cloud(ctx, width * 0.78 + drift * 0.5, height * 0.18, 0.96, 0.18);
    cloud(ctx, width * 0.66 - drift * 0.4, height * 0.08, 0.76, 0.16);
  }

  return Object.freeze({ draw });
}
