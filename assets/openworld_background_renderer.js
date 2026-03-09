function cloud(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.ellipse(-34, 4, 28, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(-6, -10, 34, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(30, -2, 28, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(2, 10, 60, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(252,252,248,${alpha})`;
  ctx.fill();

  ctx.restore();
}

function ridge(ctx, points, fillStyle, strokeStyle, drop = 360, lineWidth = 1.2) {
  if (!points.length) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1] + drop);
  ctx.lineTo(points[0][0], points[0][1] + drop);
  ctx.closePath();

  ctx.fillStyle = fillStyle;
  ctx.fill();

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function drawHorizonBands(ctx, width, startY, bands, spacing, baseAlpha) {
  for (let i = 0; i < bands; i += 1) {
    const y = startY + (i * spacing);
    const alpha = Math.max(0, baseAlpha - (i * 0.0055));
    ctx.fillStyle = `rgba(210,234,244,${alpha})`;
    ctx.fillRect(0, y, width, 2);
  }
}

export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawDistantOcean(ctx, width, height);
    drawDistantLand(ctx, width, height);
    drawAtmosphere(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.76);
    sky.addColorStop(0, "rgba(106,166,236,1)");
    sky.addColorStop(0.28, "rgba(136,192,244,1)");
    sky.addColorStop(0.62, "rgba(188,224,244,1)");
    sky.addColorStop(1, "rgba(232,244,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDistantOcean(ctx, width, height) {
    const horizonY = height * 0.29;
    const oceanBottom = height * 0.66;

    const distantOcean = ctx.createLinearGradient(0, horizonY, 0, oceanBottom);
    distantOcean.addColorStop(0, "rgba(114,176,206,0.66)");
    distantOcean.addColorStop(0.24, "rgba(102,166,196,0.54)");
    distantOcean.addColorStop(0.58, "rgba(82,142,176,0.34)");
    distantOcean.addColorStop(1, "rgba(68,122,160,0.16)");
    ctx.fillStyle = distantOcean;
    ctx.fillRect(0, horizonY, width, oceanBottom - horizonY);

    const glow = ctx.createLinearGradient(0, horizonY - 8, 0, horizonY + 48);
    glow.addColorStop(0, "rgba(248,246,236,0.18)");
    glow.addColorStop(1, "rgba(248,246,236,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizonY - 8, width, 56);

    drawHorizonBands(ctx, width, horizonY + 14, 16, 8, 0.06);
  }

  function drawDistantLand(ctx, width, height) {
    const rearMass = [
      [width * 0.30, height * 0.44],
      [width * 0.40, height * 0.38],
      [width * 0.52, height * 0.34],
      [width * 0.64, height * 0.31],
      [width * 0.78, height * 0.33],
      [width * 0.92, height * 0.38],
      [width + 120, height * 0.45]
    ];

    const summitMass = [
      [width * 0.38, height * 0.56],
      [width * 0.47, height * 0.42],
      [width * 0.56, height * 0.30],
      [width * 0.64, height * 0.18],
      [width * 0.70, height * 0.10],
      [width * 0.76, height * 0.11],
      [width * 0.82, height * 0.20],
      [width * 0.88, height * 0.32],
      [width * 0.94, height * 0.46],
      [width + 120, height * 0.56]
    ];

    const spurMass = [
      [width * 0.52, height * 0.56],
      [width * 0.58, height * 0.46],
      [width * 0.64, height * 0.37],
      [width * 0.70, height * 0.31],
      [width * 0.76, height * 0.36],
      [width * 0.82, height * 0.46],
      [width * 0.89, height * 0.58]
    ];

    ridge(ctx, rearMass, "rgba(132,166,188,0.20)", "rgba(242,246,248,0.06)", 320, 1.0);
    ridge(ctx, summitMass, "rgba(190,188,182,0.42)", "rgba(248,244,236,0.10)", 360, 1.2);
    ridge(ctx, spurMass, "rgba(210,204,194,0.14)", "rgba(250,246,238,0.05)", 300, 0.9);

    ctx.beginPath();
    ctx.ellipse(width * 0.70, height * 0.22, width * 0.18, 30, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,238,0.035)";
    ctx.fill();
  }

  function drawAtmosphere(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.08, 0, height * 0.60);
    haze.addColorStop(0, "rgba(250,246,238,0.10)");
    haze.addColorStop(0.38, "rgba(244,246,248,0.05)");
    haze.addColorStop(1, "rgba(244,246,248,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.06, width, height * 0.56);

    const sideGlow = ctx.createRadialGradient(
      width * 0.68,
      height * 0.18,
      12,
      width * 0.68,
      height * 0.18,
      width * 0.26
    );
    sideGlow.addColorStop(0, "rgba(252,246,236,0.08)");
    sideGlow.addColorStop(1, "rgba(252,246,236,0)");
    ctx.fillStyle = sideGlow;
    ctx.fillRect(0, 0, width, height * 0.5);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.0045) * 18;
    cloud(ctx, width * 0.18 + drift, height * 0.15, 1.04, 0.11);
    cloud(ctx, width * 0.46 + (drift * 0.72), height * 0.10, 1.16, 0.095);
    cloud(ctx, width * 0.78 + (drift * 0.48), height * 0.16, 0.92, 0.075);
    cloud(ctx, width * 0.62 - (drift * 0.34), height * 0.08, 0.70, 0.065);
  }

  return Object.freeze({ draw });
}
