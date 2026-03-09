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

function expandPolygon(points, scaleX, scaleY) {
  const [cx, cy] = centroid(points);
  return points.map(([x, y]) => [
    cx + ((x - cx) * scaleX),
    cy + ((y - cy) * scaleY)
  ]);
}

function resamplePolyline(points, spacing = 24) {
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

    // Visible coast paths are counterclockwise.
    // Land is left of path; ocean is right of path.
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

function strokeWaveTrain(ctx, path, tick, color, amplitude, spacing, width) {
  const samples = resamplePolyline(path, spacing);
  if (samples.length < 3) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = color;

  for (let i = 0; i < samples.length - 1; i += 2) {
    const p0 = samples[i];
    const p1 = samples[Math.min(samples.length - 1, i + 1)];
    const phase = (tick * 0.05) + (i * 0.31);

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

function getWaterStyle(waterClass) {
  if (waterClass === "harbor") {
    return {
      outer: "rgba(18,96,146,0.98)",
      middle: "rgba(56,172,198,0.96)",
      inner: "rgba(164,234,230,0.95)",
      shellOuter: "rgba(126,214,222,0.24)",
      shellInner: "rgba(224,250,242,0.11)",
      sheen: "rgba(246,252,248,0.16)",
      foam: "rgba(248,252,248,0.18)",
      shadow: "rgba(74,150,182,0.18)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(20,88,124,0.96)",
      middle: "rgba(46,126,160,0.95)",
      inner: "rgba(114,182,194,0.91)",
      shellOuter: "rgba(96,174,190,0.18)",
      shellInner: "rgba(184,228,222,0.08)",
      sheen: "rgba(228,244,246,0.10)",
      foam: "rgba(238,246,246,0.08)",
      shadow: "rgba(70,128,154,0.15)"
    };
  }

  return {
    outer: "rgba(22,94,132,0.96)",
    middle: "rgba(54,142,172,0.95)",
    inner: "rgba(126,194,204,0.91)",
    shellOuter: "rgba(104,186,202,0.18)",
    shellInner: "rgba(188,230,226,0.08)",
    sheen: "rgba(230,248,248,0.10)",
    foam: "rgba(240,248,248,0.08)",
    shadow: "rgba(76,136,162,0.14)"
  };
}

// Visible coast segments only. No closure geometry.
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
    const westSand = offsetPolyline(WEST_COASTLINE, 8);
    const westShallow = offsetPolyline(WEST_COASTLINE, 18);
    const westNear = offsetPolyline(WEST_COASTLINE, 34);
    const westMid = offsetPolyline(WEST_COASTLINE, 58);

    const eastSand = offsetPolyline(EAST_COASTLINE, 8);
    const eastShallow = offsetPolyline(EAST_COASTLINE, 18);
    const eastNear = offsetPolyline(EAST_COASTLINE, 34);
    const eastMid = offsetPolyline(EAST_COASTLINE, 58);

    // Sand halo
    fillBandBetween(ctx, WEST_COASTLINE, westSand, "rgba(244,238,214,0.15)");
    fillBandBetween(ctx, EAST_COASTLINE, eastSand, "rgba(244,238,214,0.14)");

    // Pale aqua shelf
    fillBandBetween(ctx, westSand, westShallow, "rgba(170,228,226,0.17)");
    fillBandBetween(ctx, eastSand, eastShallow, "rgba(170,228,226,0.16)");

    // Turquoise transition
    fillBandBetween(ctx, westShallow, westNear, "rgba(92,186,206,0.11)");
    fillBandBetween(ctx, eastShallow, eastNear, "rgba(90,184,204,0.10)");

    // Blue outer shelf
    fillBandBetween(ctx, westNear, westMid, "rgba(38,138,180,0.08)");
    fillBandBetween(ctx, eastNear, eastMid, "rgba(36,136,178,0.08)");

    // Gentle wave rhythm
    strokeWaveTrain(ctx, westMid, tick + 8, "rgba(236,248,250,0.035)", 2.4, 34, 0.95);
    strokeWaveTrain(ctx, westNear, tick + 18, "rgba(240,248,250,0.06)", 1.8, 26, 0.9);
    strokeWaveTrain(ctx, westShallow, tick + 30, "rgba(246,252,252,0.10)", 1.15, 18, 1.05);

    strokeWaveTrain(ctx, eastMid, tick + 12, "rgba(236,248,250,0.035)", 2.2, 34, 0.95);
    strokeWaveTrain(ctx, eastNear, tick + 22, "rgba(240,248,250,0.06)", 1.7, 26, 0.9);
    strokeWaveTrain(ctx, eastShallow, tick + 34, "rgba(246,252,252,0.095)", 1.05, 18, 1.05);

    drawCoastlineHighlight(ctx, WEST_COASTLINE);
    drawCoastlineHighlight(ctx, EAST_COASTLINE);
  }

  function drawCoastlineHighlight(ctx, path) {
    ctx.save();
    polyline(ctx, path);
    ctx.lineWidth = 1.15;
    ctx.strokeStyle = "rgba(246,242,228,0.10)";
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
    const shell = expandPolygon(
      points,
      waterClass === "harbor" ? 1.16 : 1.10,
      waterClass === "harbor" ? 1.14 : 1.08
    );

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
