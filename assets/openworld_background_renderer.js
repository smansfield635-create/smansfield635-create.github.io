function ridge(ctx, points, fillStyle, strokeStyle, lineWidth = 1.5) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1] + 340);
  ctx.lineTo(points[0][0], points[0][1] + 340);
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
  ctx.ellipse(-36, 2, 28, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(-6, -8, 32, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(28, -2, 28, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(2, 8, 58, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(252,252,250,${alpha})`;
  ctx.fill();

  ctx.restore();
}

function seaBand(ctx, y, width, alpha) {
  ctx.fillStyle = `rgba(206,232,242,${alpha})`;
  ctx.fillRect(0, y, width, 2);
}

export function createBackgroundRenderer() {
  function draw(ctx, width, height, tick) {
    drawSky(ctx, width, height);
    drawFarOcean(ctx, width, height);
    drawFarLandmasses(ctx, width, height);
    drawAtmosphere(ctx, width, height);
    drawClouds(ctx, width, height, tick);
  }

  function drawSky(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.76);
    sky.addColorStop(0, "rgba(112,170,248,1)");
    sky.addColorStop(0.34, "rgba(146,198,250,1)");
    sky.addColorStop(0.72, "rgba(200,230,246,1)");
    sky.addColorStop(1, "rgba(232,244,248,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFarOcean(ctx, width, height) {
    const bandY = height * 0.29;
    const ocean = ctx.createLinearGradient(0, bandY, 0, height * 0.58);
    ocean.addColorStop(0, "rgba(176,224,236,0.72)");
    ocean.addColorStop(0.40, "rgba(134,198,218,0.34)");
    ocean.addColorStop(1, "rgba(96,160,190,0.08)");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, bandY, width, height * 0.24);

    for (let i = 0; i < 10; i += 1) {
      seaBand(ctx, bandY + 10 + (i * 10), width, 0.042 - (i * 0.0032));
    }
  }

  function drawFarLandmasses(ctx, width, height) {
    const rear = [
      [width * 0.34, height * 0.42],
      [width * 0.44, height * 0.36],
      [width * 0.55, height * 0.31],
      [width * 0.66, height * 0.28],
      [width * 0.78, height * 0.30],
      [width * 0.90, height * 0.36],
      [width + 120, height * 0.44]
    ];

    const summit = [
      [width * 0.40, height * 0.54],
      [width * 0.48, height * 0.40],
      [width * 0.56, height * 0.28],
      [width * 0.64, height * 0.16],
      [width * 0.70, height * 0.09],
      [width * 0.76, height * 0.10],
      [width * 0.82, height * 0.18],
      [width * 0.88, height * 0.30],
      [width * 0.94, height * 0.44],
      [width + 100, height * 0.54]
    ];

    const spur = [
      [width * 0.52, height * 0.54],
      [width * 0.58, height * 0.44],
      [width * 0.64, height * 0.35],
      [width * 0.70, height * 0.29],
      [width * 0.76, height * 0.34],
      [width * 0.82, height * 0.44],
      [width * 0.88, height * 0.56]
    ];

    ridge(ctx, rear, "rgba(144,174,194,0.18)", "rgba(236,244,248,0.06)", 1.0);
    ridge(ctx, summit, "rgba(188,188,184,0.48)", "rgba(248,244,236,0.12)", 1.25);
    ridge(ctx, spur, "rgba(214,208,198,0.15)", "rgba(252,246,238,0.05)", 0.85);

    ctx.beginPath();
    ctx.ellipse(width * 0.70, height * 0.20, width * 0.18, 28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,240,0.03)";
    ctx.fill();
  }

  function drawAtmosphere(ctx, width, height) {
    const haze = ctx.createLinearGradient(0, height * 0.08, 0, height * 0.56);
    haze.addColorStop(0, "rgba(248,244,236,0.10)");
    haze.addColorStop(0.36, "rgba(242,244,246,0.05)");
    haze.addColorStop(1, "rgba(242,244,246,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.06, width, height * 0.52);

    const horizonGlow = ctx.createLinearGradient(0, height * 0.22, 0, height * 0.44);
    horizonGlow.addColorStop(0, "rgba(248,246,240,0.08)");
    horizonGlow.addColorStop(1, "rgba(248,246,240,0)");
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, height * 0.20, width, height * 0.24);
  }

  function drawClouds(ctx, width, height, tick) {
    const drift = Math.sin(tick * 0.004) * 18;
    cloud(ctx, width * 0.18 + drift, height * 0.15, 1.06, 0.12);
    cloud(ctx, width * 0.46 + (drift * 0.7), height * 0.10, 1.18, 0.10);
    cloud(ctx, width * 0.78 + (drift * 0.5), height * 0.16, 0.94, 0.08);
    cloud(ctx, width * 0.62 - (drift * 0.36), height * 0.08, 0.72, 0.07);
  }

  return Object.freeze({ draw });
}
