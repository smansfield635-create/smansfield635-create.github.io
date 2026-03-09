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
  if (!points || !points.length) return [0, 0];
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function expandPolygon(points, scaleX, scaleY, dx = 0, dy = 0) {
  const [cx, cy] = centroid(points);
  return points.map(([x, y]) => [
    cx + ((x - cx) * scaleX) + dx,
    cy + ((y - cy) * scaleY) + dy
  ]);
}

const SEDIMENT_WEST = [
  [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
  [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
  [702, 360], [690, 290], [662, 220], [620, 170]
];

const SEDIMENT_EAST = [
  [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
  [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
];

function getWaterRows(kernel) {
  if (!kernel?.watersById) return [];
  return [...kernel.watersById.values()];
}

function getWaterStyle(waterClass) {
  if (waterClass === "harbor") {
    return {
      coreOuter: "rgba(52,108,136,0.96)",
      coreInner: "rgba(106,182,194,0.95)",
      shellOuter: "rgba(118,214,216,0.34)",
      shellInner: "rgba(188,238,232,0.18)",
      shadow: "rgba(126,198,210,0.16)",
      driftX: 14,
      driftY: 10,
      pulse: 0.018
    };
  }

  if (waterClass === "basin") {
    return {
      coreOuter: "rgba(44,98,128,0.95)",
      coreInner: "rgba(94,164,184,0.93)",
      shellOuter: "rgba(110,190,202,0.24)",
      shellInner: "rgba(174,224,220,0.12)",
      shadow: "rgba(112,178,194,0.12)",
      driftX: 10,
      driftY: 8,
      pulse: 0.012
    };
  }

  return {
    coreOuter: "rgba(48,104,132,0.95)",
    coreInner: "rgba(98,170,188,0.94)",
    shellOuter: "rgba(112,196,206,0.22)",
    shellInner: "rgba(176,226,220,0.10)",
    shadow: "rgba(118,184,198,0.12)",
    driftX: 10,
    driftY: 8,
    pulse: 0.012
  };
}

function resolveWaterPolygon(row) {
  return Array.isArray(row?.polygon) ? row.polygon : [];
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, kernel, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawCoastTransition(ctx);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawCoastTransition(ctx) {
    sedimentBand(ctx, SEDIMENT_WEST, 18, 0.14, 0.08);
    sedimentBand(ctx, SEDIMENT_EAST, 14, 0.10, 0.06);
  }

  function sedimentBand(ctx, points, inset, alphaTop, alphaBottom) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    for (let i = points.length - 1; i >= 0; i -= 1) {
      ctx.lineTo(points[i][0] - inset, points[i][1]);
    }
    ctx.closePath();

    const g = ctx.createLinearGradient(0, 0, 0, 1200);
    g.addColorStop(0, `rgba(156,132,96,${alphaTop})`);
    g.addColorStop(1, `rgba(120,104,78,${alphaBottom})`);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function drawWaterBodies(ctx, kernel, tick) {
    const rows = getWaterRows(kernel);

    for (const row of rows) {
      const polygonPoints = resolveWaterPolygon(row);
      if (polygonPoints.length < 3) continue;
      drawWaterBody(ctx, polygonPoints, row.waterClass, tick);
    }
  }

  function drawWaterBody(ctx, points, waterClass, tick) {
    const style = getWaterStyle(waterClass);
    const [cx, cy] = centroid(points);
    const shell = expandPolygon(points, 1.16, 1.13, 0, 0);

    const driftPhase = tick * style.pulse;
    const driftX = Math.sin(driftPhase) * style.driftX;
    const driftY = Math.cos(driftPhase * 0.82) * style.driftY;

    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = waterClass === "harbor" ? 26 : 20;

    polygon(ctx, shell);
    const shellGradient = ctx.createRadialGradient(
      cx - (driftX * 0.35),
      cy - (driftY * 0.25),
      8,
      cx,
      cy,
      Math.max(80, Math.hypot(style.driftX + 120, style.driftY + 80))
    );
    shellGradient.addColorStop(0, style.shellInner);
    shellGradient.addColorStop(0.55, style.shellOuter);
    shellGradient.addColorStop(1, "rgba(90,170,186,0)");
    ctx.fillStyle = shellGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const coreGradient = ctx.createLinearGradient(
      cx - 70 + driftX,
      cy - 54 + driftY,
      cx + 82 - driftX,
      cy + 76 - driftY
    );
    coreGradient.addColorStop(0, style.coreInner);
    coreGradient.addColorStop(0.48, "rgba(84,150,170,0.95)");
    coreGradient.addColorStop(1, style.coreOuter);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const sheen = ctx.createRadialGradient(
      cx - 18 + (driftX * 0.5),
      cy - 22 + (driftY * 0.4),
      4,
      cx,
      cy,
      96
    );
    sheen.addColorStop(0, "rgba(240,252,250,0.16)");
    sheen.addColorStop(0.55, "rgba(214,244,242,0.05)");
    sheen.addColorStop(1, "rgba(214,244,242,0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = waterClass === "harbor"
      ? "rgba(238,246,248,0.10)"
      : "rgba(238,246,248,0.08)";
    ctx.stroke();
    ctx.restore();
  }

  return Object.freeze({ draw });
}
