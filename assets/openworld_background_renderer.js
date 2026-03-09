function ridge(ctx, points, fillStyle, strokeStyle, lineWidth = 1.5) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1] + 260);
  ctx.lineTo(points[0][0], points[0][1] + 260);
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
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.62);
    sky.addColorStop(0, "rgba(126,174,244,1)");
    sky.addColorStop(0.52, "rgba(152,196,248,1)");
    sky.addColorStop(1, "rgba(190,224,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFarOceanBand(ctx, width, height) {
    const bandY = height * 0.30;
    const ocean = ctx.createLinearGradient(0, bandY, 0, height * 0.48);
    ocean.addColorStop(0, "rgba(154,208,226,0.86)");
    ocean.addColorStop(1, "rgba(130,188,212,0.50)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, bandY, width, height * 0.18);
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
      [width * 0.50, height * 0.34],
      [width * 0.60, height * 0.28],
      [width * 0.68, height * 0.24],
      [width * 0.76, height * 0.22],
      [width * 0.84, height * 0.24],
      [width * 0.94, height * 0.30],
      [width + 60, height * 0.34]
    ];

    const summitRange = [
      [width * 0.46, height * 0.38],
      [width * 0.52, height * 0.31],
      [width * 0.58, height * 0.23],
      [width * 0.64, height * 0.18],
      [width * 0.71, height * 0.16],
      [width * 0.78, height * 0.18],
      [width * 0.86, height * 0.24],
      [width * 0.94, height * 0.34]
    ];

    ridge(ctx, leftRange, "rgba(144,170,188,0.24)", "rgba(232,242,248,0.10)", 1.2);
    ridge(ctx, rightRange, "rgba(132,160,182,0.26)", "rgba(232,242,248,0.10)", 1.2);
    ridge(ctx, summitRange, "rgba(164,172,176,0.36)", "rgba(248,244,236,0.14)", 1.3);
  }

  function drawAtmosphericBands(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.18, 0, height * 0.46);
    haze.addColorStop(0, "rgba(248,244,236,0.10)");
    haze.addColorStop(0.46, "rgba(240,242,244,0.07)");
    haze.addColorStop(1, "rgba(240,242,244,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.16, width, height * 0.34);

    const nearGlow = ctx.createLinearGradient(0, height * 0.40, 0, height * 0.56);
    nearGlow.addColorStop(0, "rgba(236,246,248,0.10)");
    nearGlow.addColorStop(1, "rgba(236,246,248,0)");
    ctx.fillStyle = nearGlow;
    ctx.fillRect(0, height * 0.40, width, height * 0.16);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.004) * 18;

    cloud(ctx, width * 0.22 + drift, height * 0.16, 1.08, 0.26);
    cloud(ctx, width * 0.52 + drift * 0.7, height * 0.11, 1.20, 0.24);
    cloud(ctx, width * 0.80 + drift * 0.5, height * 0.18, 0.96, 0.20);
    cloud(ctx, width * 0.68 - drift * 0.4, height * 0.08, 0.76, 0.18);
  }

  return Object.freeze({ draw });
}
