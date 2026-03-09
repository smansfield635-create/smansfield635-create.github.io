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

    // Counterclockwise coastline segments:
    // land is left of path, ocean is right of path.
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
    const phase = (tick * 0.035) + (i * 0.18);

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
      outer: "rgba(18,98,146,0.98)",
      middle: "rgba(64,180,200,0.96)",
      inner: "rgba(184,240,234,0.95)",
      shellOuter: "rgba(122,214,222,0.12)",
      shellInner: "rgba(228,250,242,0.05)",
      sheen: "rgba(246,252,248,0.08)",
      foam: "rgba(248,252,248,0.12)",
      shadow: "rgba(72,146,178,0.10)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(18,86,122,0.96)",
      middle: "rgba(46,126,160,0.95)",
      inner: "rgba(118,184,196,0.90)",
      shellOuter: "rgba(92,168,188,0.10)",
      shellInner: "rgba(182,226,220,0.04)",
      sheen: "rgba(226,242,246,0.06)",
      foam: "rgba(238,246,246,0.06)",
      shadow: "rgba(66,122,148,0.10)"
    };
  }

  return {
    outer: "rgba(20,92,130,0.96)",
    middle: "rgba(52,138,170,0.95)",
    inner: "rgba(122,192,202,0.90)",
    shellOuter: "rgba(102,184,200,0.10)",
    shellInner: "rgba(186,228,224,0.04)",
    sheen: "rgba(230,246,248,0.06)",
    foam: "rgba(240,248,248,0.06)",
    shadow: "rgba(72,132,158,0.09)"
  };
}

const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

// Geometry-derived coastline ownership.
// East shore: south tip -> north-east visible coast.
// West shore: north-west visible coast -> south tip.
const EAST_SHORE = LAND_MASK.slice(0, 17);
const WEST_SHORE = LAND_MASK.slice(18).concat([LAND_MASK[0]]);

function clipToOceanOnly(ctx) {
  ctx.beginPath();
  ctx.rect(-900, -900, 3200, 3200);
  polygon(ctx, LAND_MASK);
  ctx.clip("evenodd");
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, renderScale = 1, kernel, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);
    ctx.scale(renderScale, renderScale);

    drawDeterministicCoastalPass(ctx, tick);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawDeterministicCoastalPass(ctx, tick) {
    ctx.save();
    clipToOceanOnly(ctx);

    drawCoastForPath(ctx, WEST_SHORE, tick);
    drawCoastForPath(ctx, EAST_SHORE, tick);

    ctx.restore();
  }

  function drawCoastForPath(ctx, coastPath, tick) {
    const drySand = offsetPolyline(coastPath, 48);
    const wetSand = offsetPolyline(coastPath, 84);
    const shallow = offsetPolyline(coastPath, 124);
    const shelf = offsetPolyline(coastPath, 176);

    // Dry sand beach: this should be obviously visible.
    fillBandBetween(ctx, coastPath, drySand, "rgba(236,216,168,0.30)");

    // Wet sand: slightly darker and smoother.
    fillBandBetween(ctx, drySand, wetSand, "rgba(214,200,162,0.22)");

    // Shallow tropical water.
    fillBandBetween(ctx, wetSand, shallow, "rgba(154,224,220,0.17)");

    // Outer shelf blend.
    fillBandBetween(ctx, shallow, shelf, "rgba(78,190,206,0.10)");

    // Thin foam line right at the coast.
    ctx.save();
    polyline(ctx, coastPath);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(248,244,232,0.16)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    // Minimal motion only in water bands.
    strokeWaveTrain(ctx, shallow, tick + 10, "rgba(246,252,252,0.04)", 0.7, 22, 0.7);
    strokeWaveTrain(ctx, shelf, tick + 20, "rgba(238,248,250,0.025)", 0.9, 30, 0.65);
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
      waterClass === "harbor" ? 1.08 : 1.06,
      waterClass === "harbor" ? 1.06 : 1.04
    );

    const driftX = Math.sin(tick * (waterClass === "harbor" ? 0.010 : 0.008)) * (waterClass === "harbor" ? 5 : 3);
    const driftY = Math.cos(tick * (waterClass === "harbor" ? 0.008 : 0.006)) * (waterClass === "harbor" ? 3 : 2);

    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = waterClass === "harbor" ? 10 : 8;

    polygon(ctx, shell);
    const shellGradient = ctx.createRadialGradient(
      cx - (driftX * 0.2),
      cy - (driftY * 0.15),
      8,
      cx,
      cy,
      Math.max(68, Math.hypot(driftX + 84, driftY + 58))
    );
    shellGradient.addColorStop(0, style.shellInner);
    shellGradient.addColorStop(0.66, style.shellOuter);
    shellGradient.addColorStop(1, "rgba(90,170,186,0)");
    ctx.fillStyle = shellGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const coreGradient = ctx.createRadialGradient(
      cx - 8 + driftX,
      cy - 8 + driftY,
      4,
      cx,
      cy,
      waterClass === "harbor" ? 92 : 74
    );
    coreGradient.addColorStop(0, style.inner);
    coreGradient.addColorStop(0.56, style.middle);
    coreGradient.addColorStop(1, style.outer);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const sheen = ctx.createRadialGradient(
      cx - 12 + (driftX * 0.3),
      cy - 12 + (driftY * 0.24),
      4,
      cx,
      cy,
      waterClass === "harbor" ? 74 : 58
    );
    sheen.addColorStop(0, style.sheen);
    sheen.addColorStop(0.64, "rgba(224,246,244,0.015)");
    sheen.addColorStop(1, "rgba(224,246,244,0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    ctx.lineWidth = waterClass === "harbor" ? 0.95 : 0.8;
    ctx.strokeStyle = style.foam;
    ctx.stroke();
    ctx.restore();

    drawLocalRipples(ctx, points, tick, waterClass);
  }

  function drawLocalRipples(ctx, points, tick, waterClass) {
    const closed = points.concat([points[0]]);
    const samplePath = resamplePolyline(closed, waterClass === "harbor" ? 42 : 52);
    if (samplePath.length < 3) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = waterClass === "harbor" ? 0.7 : 0.6;
    ctx.strokeStyle = waterClass === "harbor"
      ? "rgba(242,248,248,0.05)"
      : "rgba(236,244,246,0.04)";

    for (let i = 0; i < samplePath.length - 1; i += 3) {
      const p0 = samplePath[i];
      const p1 = samplePath[Math.min(samplePath.length - 1, i + 1)];
      const phase = (tick * 0.028) + (i * 0.15);

      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.quadraticCurveTo(
        (p0[0] + p1[0]) * 0.5,
        ((p0[1] + p1[1]) * 0.5) + (Math.sin(phase) * (waterClass === "harbor" ? 0.7 : 0.5)),
        p1[0],
        p1[1]
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
