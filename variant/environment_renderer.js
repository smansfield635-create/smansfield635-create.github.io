function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function fillPolygon(ctx, points, fillStyle) {
  polygon(ctx, points);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokePolygon(ctx, points, strokeStyle, lineWidth = 1) {
  polygon(ctx, points);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawGlobalSkyWash(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 1240);
  gradient.addColorStop(0, "rgba(246,244,236,0.10)");
  gradient.addColorStop(0.34, "rgba(182,220,244,0.05)");
  gradient.addColorStop(0.72, "rgba(88,150,204,0.03)");
  gradient.addColorStop(1, "rgba(20,42,72,0.00)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawOpenSeaLightField(ctx) {
  const glowA = ctx.createRadialGradient(784, 468, 20, 784, 468, 520);
  glowA.addColorStop(0, "rgba(186,238,255,0.18)");
  glowA.addColorStop(0.35, "rgba(124,196,236,0.08)");
  glowA.addColorStop(1, "rgba(36,88,140,0.00)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, 1180, 1240);

  const glowB = ctx.createRadialGradient(284, 820, 30, 284, 820, 360);
  glowB.addColorStop(0, "rgba(174,224,248,0.08)");
  glowB.addColorStop(1, "rgba(50,110,166,0.00)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawWaterBodyAtmosphere(ctx, points, tick, waterClass) {
  if (!points?.length) return;

  const [cx, cy] = centroid(points);
  const pulse = 0.5 + (0.5 * Math.sin(tick * 0.035));

  polygon(ctx, points);

  const radius = waterClass === "harbor" ? 240 : 140;
  const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, radius);
  if (waterClass === "harbor") {
    gradient.addColorStop(0, `rgba(210,246,255,${0.08 + (pulse * 0.03)})`);
    gradient.addColorStop(0.45, "rgba(124,196,232,0.05)");
    gradient.addColorStop(1, "rgba(30,78,132,0.00)");
  } else {
    gradient.addColorStop(0, `rgba(196,236,248,${0.06 + (pulse * 0.02)})`);
    gradient.addColorStop(0.5, "rgba(126,178,204,0.04)");
    gradient.addColorStop(1, "rgba(34,74,110,0.00)");
  }

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawWaterBodyShimmer(ctx, points, tick, waterClass) {
  if (!points?.length) return;

  const [cx, cy] = centroid(points);
  const pulse = 0.5 + (0.5 * Math.sin((tick * 0.06) + (cx * 0.01)));

  ctx.save();
  polygon(ctx, points);
  ctx.clip();

  const shimmerBands = waterClass === "harbor"
    ? [
        { x: cx - 150, y: cy - 30, w: 180, h: 18, a: 0.05 + (pulse * 0.03) },
        { x: cx - 40, y: cy + 8, w: 140, h: 16, a: 0.04 + (pulse * 0.025) },
        { x: cx + 40, y: cy - 56, w: 120, h: 14, a: 0.035 + (pulse * 0.02) }
      ]
    : [
        { x: cx - 74, y: cy - 14, w: 92, h: 12, a: 0.04 + (pulse * 0.02) },
        { x: cx - 14, y: cy + 10, w: 80, h: 10, a: 0.03 + (pulse * 0.016) }
      ];

  for (const band of shimmerBands) {
    const gradient = ctx.createLinearGradient(band.x, band.y, band.x + band.w, band.y + band.h);
    gradient.addColorStop(0, `rgba(244,252,255,${band.a})`);
    gradient.addColorStop(0.5, `rgba(196,234,248,${band.a * 0.65})`);
    gradient.addColorStop(1, "rgba(244,252,255,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(band.x, band.y, band.w, band.h);
  }

  ctx.restore();
}

function drawHarborMist(ctx, kernel) {
  const harborBasin = kernel?.coastlineModel?.harborBasin;
  if (!harborBasin?.length) return;

  const [cx, cy] = centroid(harborBasin);

  ctx.save();
  polygon(ctx, harborBasin);
  ctx.clip();

  const mist = ctx.createRadialGradient(cx, cy - 60, 20, cx, cy - 60, 280);
  mist.addColorStop(0, "rgba(232,244,255,0.08)");
  mist.addColorStop(0.4, "rgba(188,222,244,0.04)");
  mist.addColorStop(1, "rgba(188,222,244,0.00)");
  ctx.fillStyle = mist;
  ctx.fillRect(cx - 320, cy - 300, 640, 520);

  ctx.restore();
}

function drawSeaHazardAtmosphere(ctx, kernel) {
  const seaHazardsById = kernel?.maritimeNetwork?.seaHazardsById;
  if (!seaHazardsById) return;

  for (const hazard of seaHazardsById.values()) {
    if (!hazard?.polygon?.length) continue;

    const [cx, cy] = centroid(hazard.polygon);
    polygon(ctx, hazard.polygon);

    const radius = hazard.hazardClass === "reef" ? 110 : 180;
    const gradient = ctx.createRadialGradient(cx, cy, 16, cx, cy, radius);

    if (hazard.hazardClass === "reef") {
      gradient.addColorStop(0, "rgba(166,236,214,0.08)");
      gradient.addColorStop(0.5, "rgba(110,182,168,0.04)");
      gradient.addColorStop(1, "rgba(110,182,168,0.00)");
    } else {
      gradient.addColorStop(0, "rgba(176,214,255,0.08)");
      gradient.addColorStop(0.55, "rgba(116,156,220,0.04)");
      gradient.addColorStop(1, "rgba(116,156,220,0.00)");
    }

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function drawDistanceVeil(ctx) {
  const topVeil = ctx.createLinearGradient(0, 0, 0, 420);
  topVeil.addColorStop(0, "rgba(255,255,255,0.06)");
  topVeil.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = topVeil;
  ctx.fillRect(0, 0, 1180, 420);

  const lowerVeil = ctx.createLinearGradient(0, 700, 0, 1240);
  lowerVeil.addColorStop(0, "rgba(28,58,94,0.00)");
  lowerVeil.addColorStop(1, "rgba(14,28,46,0.08)");
  ctx.fillStyle = lowerVeil;
  ctx.fillRect(0, 700, 1180, 540);
}

function drawVignette(ctx) {
  const gradient = ctx.createRadialGradient(590, 620, 220, 590, 620, 860);
  gradient.addColorStop(0, "rgba(0,0,0,0.00)");
  gradient.addColorStop(1, "rgba(10,18,28,0.10)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawHarborChannelGuidanceGlow(ctx, kernel, tick) {
  const channel = kernel?.coastlineModel?.harborChannel;
  if (!channel?.length) return;

  const pulse = 0.5 + (0.5 * Math.sin(tick * 0.05));
  strokePolygon(ctx, channel, `rgba(210,244,255,${0.04 + (pulse * 0.03)})`, 8);
  strokePolygon(ctx, channel, `rgba(160,214,246,${0.03 + (pulse * 0.02)})`, 14);
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, kernel, tick = 0 } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawGlobalSkyWash(ctx);
    drawOpenSeaLightField(ctx);

    const waters = kernel?.watersById ? [...kernel.watersById.values()] : [];
    for (const row of waters) {
      if (!row?.polygon) continue;
      drawWaterBodyAtmosphere(ctx, row.polygon, tick, row.waterClass);
      drawWaterBodyShimmer(ctx, row.polygon, tick, row.waterClass);
    }

    drawHarborMist(ctx, kernel);
    drawSeaHazardAtmosphere(ctx, kernel);
    drawHarborChannelGuidanceGlow(ctx, kernel, tick);
    drawDistanceVeil(ctx);
    drawVignette(ctx);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
