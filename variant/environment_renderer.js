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

    // Counterclockwise visible coast path.
    // Land is left side of the path. Ocean is right side.
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
    const phase = (tick * 0.055) + (i * 0.32);

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
      outer: "rgba(18,98,148,0.98)",
      middle: "rgba(54,172,198,0.96)",
      inner: "rgba(154,228,230,0.94)",
      shellOuter: "rgba(126,214,222,0.24)",
      shellInner: "rgba(220,248,240,0.10)",
      sheen: "rgba(246,252,248,0.16)",
      foam: "rgba(246,250,248,0.16)",
      shadow: "rgba(78,154,182,0.18)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(20,88,126,0.96)",
      middle: "rgba(48,128,162,0.95)",
      inner: "rgba(116,184,194,0.91)",
      shellOuter: "rgba(96,174,192,0.18)",
      shellInner: "rgba(184,228,222,0.08)",
      sheen: "rgba(228,244,246,0.10)",
      foam: "rgba(238,246,246,0.08)",
      shadow: "rgba(70,130,154,0.15)"
    };
  }

  return {
    outer: "rgba(22,94,132,0.96)",
    middle: "rgba(56,142,172,0.95)",
    inner: "rgba(126,194,204,0.91)",
    shellOuter: "rgba(104,186,202,0.18)",
    shellInner: "rgba(188,230,226,0.08)",
    sheen: "rgba(230,248,248,0.10)",
    foam: "rgba(240,248,248,0.08)",
    shadow: "rgba(76,136,162,0.14)"
  };
}

// This matches the active land authority in ground_renderer.js.
// Used only to exclude coast water from drawing on land.
const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

// Visible coastline display paths only. No closure edges.
const WEST_COASTLINE = [
  [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
  [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
  [702, 360], [690, 290], [662, 220], [620, 170]
];

const EAST_COASTLINE = [
  [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
  [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
];

function clipToOceanOnly(ctx) {
  ctx.beginPath();
  ctx.rect(-600, -600, 2400, 2400);
  polygon(ctx, LAND_MASK);
  ctx.clip("evenodd");
}

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
    ctx.save();
    clipToOceanOnly(ctx);

    const westShallow = offsetPolyline(WEST_COASTLINE, 12);
    const westNear = offsetPolyline(WEST_COASTLINE, 28);
    const westMid = offsetPolyline(WEST_COASTLINE, 54);

    const eastShallow = offsetPolyline(EAST_COASTLINE, 12);
    const eastNear = offsetPolyline(EAST_COASTLINE, 28);
    const eastMid = offsetPolyline(EAST_COASTLINE, 54);

    fillBandBetween(ctx, WEST_COASTLINE, westShallow, "rgba(170,228,226,0.18)");
    fillBandBetween(ctx, westShallow, westNear, "rgba(92,188,208,0.12)");
    fillBandBetween(ctx, westNear, westMid, "rgba(42,142,182,0.08)");

    fillBandBetween(ctx, EAST_COASTLINE, eastShallow, "rgba(170,228,226,0.17)");
    fillBandBetween(ctx, eastShallow, eastNear, "rgba(90,186,206,0.11)");
    fillBandBetween(ctx, eastNear, eastMid, "rgba(40,140,180,0.08)");

    strokeWaveTrain(ctx, westMid, tick + 8, "rgba(238,248,250,0.04)", 2.6, 34, 1.0);
    strokeWaveTrain(ctx, westNear, tick + 18, "rgba(240,248,250,0.07)", 2.0, 26, 0.95);
    strokeWaveTrain(ctx, westShallow, tick + 30, "rgba(244,250,252,0.11)", 1.3, 18, 1.15);

    strokeWaveTrain(ctx, eastMid, tick + 12, "rgba(238,248,250,0.04)", 2.4, 34, 1.0);
    strokeWaveTrain(ctx, eastNear, tick + 22, "rgba(240,248,250,0.07)", 1.9, 26, 0.95);
    strokeWaveTrain(ctx, eastShallow, tick + 34, "rgba(244,250,252,0.10)", 1.2, 18, 1.15);

    drawCoastlineHighlight(ctx, WEST_COASTLINE);
    drawCoastlineHighlight(ctx, EAST_COASTLINE);

    ctx.restore();
  }

  function drawCoastlineHighlight(ctx, path) {
    ctx.save();
    polyline(ctx, path);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(246,242,228,0.12)";
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
