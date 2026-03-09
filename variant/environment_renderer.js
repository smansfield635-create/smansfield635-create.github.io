function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function polyline(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
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

function resamplePolyline(points, spacing = 28) {
  if (!points || points.length < 2) return points ?? [];
  const out = [points[0]];
  let carry = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const segLen = Math.hypot(dx, dy);
    if (segLen === 0) continue;

    let dist = spacing - carry;
    while (dist < segLen) {
      const t = dist / segLen;
      out.push([ax + (dx * t), ay + (dy * t)]);
      dist += spacing;
    }
    carry = Math.max(0, dist - segLen);
  }

  out.push(points[points.length - 1]);
  return out;
}

function offsetPolyline(points, outwardDistance) {
  if (!points || points.length < 2) return [];
  const out = [];

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tx = next[0] - prev[0];
    const ty = next[1] - prev[1];
    const len = Math.hypot(tx, ty) || 1;

    // Counterclockwise coast, land on left, ocean on right.
    const nx = ty / len;
    const ny = -tx / len;

    out.push([
      points[i][0] + (nx * outwardDistance),
      points[i][1] + (ny * outwardDistance)
    ]);
  }

  return out;
}

function fillBandBetween(ctx, innerPath, outerPath, color) {
  if (!innerPath.length || !outerPath.length) return;

  ctx.beginPath();
  ctx.moveTo(innerPath[0][0], innerPath[0][1]);
  for (let i = 1; i < innerPath.length; i += 1) {
    ctx.lineTo(innerPath[i][0], innerPath[i][1]);
  }
  for (let i = outerPath.length - 1; i >= 0; i -= 1) {
    ctx.lineTo(outerPath[i][0], outerPath[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeWaveTrain(ctx, path, tick, baseAlpha, amplitude, spacing, width) {
  const samples = resamplePolyline(path, spacing);
  if (samples.length < 3) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgba(240,250,252,${baseAlpha})`;

  for (let i = 0; i < samples.length - 1; i += 2) {
    const p0 = samples[i];
    const p1 = samples[Math.min(samples.length - 1, i + 1)];
    const phase = (tick * 0.055) + (i * 0.35);

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.quadraticCurveTo(
      (p0[0] + p1[0]) * 0.5,
      ((p0[1] + p1[1]) * 0.5) + (Math.sin(phase) * amplitude),
      p1[0],
      p1[1]
    );
    ctx.stroke();
  }

  ctx.restore();
}

function getWaterRows(kernel) {
  if (!kernel?.watersById) return [];
  return [...kernel.watersById.values()];
}

function resolveWaterPolygon(row) {
  return Array.isArray(row?.polygon) ? row.polygon : [];
}

function expandPolygon(points, scaleX, scaleY) {
  const [cx, cy] = centroid(points);
  return points.map(([x, y]) => [
    cx + ((x - cx) * scaleX),
    cy + ((y - cy) * scaleY)
  ]);
}

function getWaterStyle(waterClass) {
  if (waterClass === "harbor") {
    return {
      outer: "rgba(46,110,150,0.96)",
      middle: "rgba(78,168,194,0.95)",
      inner: "rgba(156,224,228,0.92)",
      shellOuter: "rgba(126,210,220,0.24)",
      shellInner: "rgba(214,246,238,0.10)",
      sheen: "rgba(244,252,248,0.14)",
      foam: "rgba(246,250,248,0.14)",
      shadow: "rgba(86,156,182,0.18)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(40,96,130,0.95)",
      middle: "rgba(68,138,168,0.94)",
      inner: "rgba(122,190,198,0.90)",
      shellOuter: "rgba(102,182,198,0.18)",
      shellInner: "rgba(184,228,222,0.08)",
      sheen: "rgba(228,244,246,0.10)",
      foam: "rgba(238,246,246,0.08)",
      shadow: "rgba(72,132,156,0.15)"
    };
  }

  return {
    outer: "rgba(44,102,136,0.95)",
    middle: "rgba(76,150,178,0.94)",
    inner: "rgba(130,196,204,0.90)",
    shellOuter: "rgba(110,190,204,0.18)",
    shellInner: "rgba(186,230,226,0.08)",
    sheen: "rgba(230,248,248,0.10)",
    foam: "rgba(240,248,248,0.08)",
    shadow: "rgba(76,136,162,0.14)"
  };
}

// Visible coast display paths only.
const WEST_COASTLINE = [
  [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
  [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
  [702, 360], [690, 290], [662, 220], [620, 170]
];

const EAST_COASTLINE = [
  [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
  [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, kernel, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawCoastWater(ctx, tick);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawCoastWater(ctx, tick) {
    const westNear = offsetPolyline(WEST_COASTLINE, 18);
    const westMid = offsetPolyline(WEST_COASTLINE, 42);
    const westFar = offsetPolyline(WEST_COASTLINE, 78);

    const eastNear = offsetPolyline(EAST_COASTLINE, 18);
    const eastMid = offsetPolyline(EAST_COASTLINE, 42);
    const eastFar = offsetPolyline(EAST_COASTLINE, 78);

    fillBandBetween(ctx, WEST_COASTLINE, westNear, "rgba(180,226,224,0.22)");
    fillBandBetween(ctx, westNear, westMid, "rgba(144,206,216,0.15)");
    fillBandBetween(ctx, westMid, westFar, "rgba(108,178,202,0.10)");

    fillBandBetween(ctx, EAST_COASTLINE, eastNear, "rgba(180,226,224,0.20)");
    fillBandBetween(ctx, eastNear, eastMid, "rgba(142,204,214,0.14)");
    fillBandBetween(ctx, eastMid, eastFar, "rgba(106,176,200,0.09)");

    strokeWaveTrain(ctx, westFar, tick + 6, 0.05, 3.0, 36, 1.2);
    strokeWaveTrain(ctx, westMid, tick + 19, 0.08, 2.4, 28, 1.1);
    strokeWaveTrain(ctx, westNear, tick + 31, 0.12, 1.8, 20, 1.35);

    strokeWaveTrain(ctx, eastFar, tick + 11, 0.05, 2.8, 36, 1.2);
    strokeWaveTrain(ctx, eastMid, tick + 24, 0.08, 2.3, 28, 1.1);
    strokeWaveTrain(ctx, eastNear, tick + 35, 0.11, 1.7, 20, 1.35);

    drawCoastlineHighlight(ctx, WEST_COASTLINE);
    drawCoastlineHighlight(ctx, EAST_COASTLINE);
  }

  function drawCoastlineHighlight(ctx, path) {
    ctx.save();
    polyline(ctx, path);
    ctx.lineWidth = 1.35;
    ctx.strokeStyle = "rgba(248,244,230,0.14)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawWaterBodies(ctx, kernel, tick) {
    const rows = getWaterRows(kernel);

    for (const row of rows) {
      const points = resolveWaterPolygon(row);
      if (points.length < 3) continue;
      drawWaterBody(ctx, points, row.waterClass, tick);
    }
  }

  function drawWaterBody(ctx, points, waterClass, tick) {
    const style = getWaterStyle(waterClass);
    const [cx, cy] = centroid(points);
    const shell = expandPolygon(points, waterClass === "harbor" ? 1.16 : 1.10, waterClass === "harbor" ? 1.14 : 1.08);

    const driftX = Math.sin(tick * (waterClass === "harbor" ? 0.020 : 0.014)) * (waterClass === "harbor" ? 16 : 9);
    const driftY = Math.cos(tick * (waterClass === "harbor" ? 0.017 : 0.012)) * (waterClass === "harbor" ? 10 : 7);

    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = waterClass === "harbor" ? 28 : 20;

    polygon(ctx, shell);
    const shellGradient = ctx.createRadialGradient(
      cx - (driftX * 0.35),
      cy - (driftY * 0.25),
      8,
      cx,
      cy,
      Math.max(96, Math.hypot(driftX + 140, driftY + 96))
    );
    shellGradient.addColorStop(0, style.shellInner);
    shellGradient.addColorStop(0.58, style.shellOuter);
    shellGradient.addColorStop(1, "rgba(90,170,186,0)");
    ctx.fillStyle = shellGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const coreGradient = ctx.createLinearGradient(
      cx - 84 + driftX,
      cy - 60 + driftY,
      cx + 92 - driftX,
      cy + 84 - driftY
    );
    coreGradient.addColorStop(0, style.inner);
    coreGradient.addColorStop(0.44, style.middle);
    coreGradient.addColorStop(1, style.outer);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const sheen = ctx.createRadialGradient(
      cx - 24 + (driftX * 0.55),
      cy - 26 + (driftY * 0.40),
      4,
      cx,
      cy,
      waterClass === "harbor" ? 108 : 88
    );
    sheen.addColorStop(0, style.sheen);
    sheen.addColorStop(0.55, "rgba(224,246,244,0.05)");
    sheen.addColorStop(1, "rgba(224,246,244,0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    ctx.lineWidth = waterClass === "harbor" ? 1.25 : 1.0;
    ctx.strokeStyle = style.foam;
    ctx.stroke();
    ctx.restore();

    drawLocalRipples(ctx, points, tick, waterClass);
  }

  function drawLocalRipples(ctx, points, tick, waterClass) {
    const closed = points.concat([points[0]]);
    const samplePath = resamplePolyline(closed, waterClass === "harbor" ? 34 : 42);
    if (samplePath.length < 3) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = waterClass === "harbor" ? 1.0 : 0.9;
    ctx.strokeStyle = waterClass === "harbor"
      ? "rgba(242,248,248,0.12)"
      : "rgba(236,244,246,0.08)";

    for (let i = 0; i < samplePath.length - 1; i += 3) {
      const p0 = samplePath[i];
      const p1 = samplePath[Math.min(samplePath.length - 1, i + 1)];
      const phase = (tick * 0.05) + (i * 0.28);

      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.quadraticCurveTo(
        (p0[0] + p1[0]) * 0.5,
        ((p0[1] + p1[1]) * 0.5) + (Math.sin(phase) * (waterClass === "harbor" ? 1.8 : 1.2)),
        p1[0],
        p1[1]
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
