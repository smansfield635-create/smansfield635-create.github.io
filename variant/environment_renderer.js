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

    // Counterclockwise visible coastline:
    // land = left side, ocean = right side.
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
    const phase = (tick * 0.042) + (i * 0.26);

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
      outer: "rgba(16,96,146,0.98)",
      middle: "rgba(58,176,198,0.96)",
      inner: "rgba(172,236,230,0.95)",
      shellOuter: "rgba(124,214,222,0.20)",
      shellInner: "rgba(226,250,242,0.08)",
      sheen: "rgba(246,252,248,0.12)",
      foam: "rgba(248,252,248,0.16)",
      shadow: "rgba(72,148,180,0.16)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(18,86,122,0.96)",
      middle: "rgba(42,122,156,0.95)",
      inner: "rgba(108,178,192,0.90)",
      shellOuter: "rgba(92,168,188,0.15)",
      shellInner: "rgba(182,226,220,0.07)",
      sheen: "rgba(226,242,246,0.08)",
      foam: "rgba(238,246,246,0.07)",
      shadow: "rgba(66,124,150,0.14)"
    };
  }

  return {
    outer: "rgba(20,92,130,0.96)",
    middle: "rgba(52,138,170,0.95)",
    inner: "rgba(122,192,202,0.90)",
    shellOuter: "rgba(102,184,200,0.16)",
    shellInner: "rgba(186,228,224,0.07)",
    sheen: "rgba(230,246,248,0.08)",
    foam: "rgba(240,248,248,0.07)",
    shadow: "rgba(72,132,158,0.13)"
  };
}

// Match active land authority exactly.
// Used only to keep coastal water ocean-side.
const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

// Visible coastline only. No closure geometry.
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
  ctx.rect(-700, -700, 2600, 2600);
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

    const westSand = offsetPolyline(WEST_COASTLINE, 6);
    const westShallow = offsetPolyline(WEST_COASTLINE, 14);
    const westNear = offsetPolyline(WEST_COASTLINE, 26);
    const westMid = offsetPolyline(WEST_COASTLINE, 44);

    const eastSand = offsetPolyline(EAST_COASTLINE, 6);
    const eastShallow = offsetPolyline(EAST_COASTLINE, 14);
    const eastNear = offsetPolyline(EAST_COASTLINE, 26);
    const eastMid = offsetPolyline(EAST_COASTLINE, 44);

    // Soft sand-edge glow
    fillBandBetween(ctx, WEST_COASTLINE, westSand, "rgba(244,238,214,0.10)");
    fillBandBetween(ctx, EAST_COASTLINE, eastSand, "rgba(244,238,214,0.10)");

    // Tight shallow shelf
    fillBandBetween(ctx, westSand, westShallow, "rgba(168,228,226,0.11)");
    fillBandBetween(ctx, eastSand, eastShallow, "rgba(168,228,226,0.11)");

    // Turquoise blend
    fillBandBetween(ctx, westShallow, westNear, "rgba(88,184,204,0.08)");
    fillBandBetween(ctx, eastShallow, eastNear, "rgba(88,184,204,0.08)");

    // Outer shelf blend into ocean base
    fillBandBetween(ctx, westNear, westMid, "rgba(34,134,178,0.05)");
    fillBandBetween(ctx, eastNear, eastMid, "rgba(34,134,178,0.05)");

    // Minimal motion, subordinate to static read
    strokeWaveTrain(ctx, westNear, tick + 16, "rgba(242,248,250,0.035)", 1.4, 28, 0.8);
    strokeWaveTrain(ctx, westShallow, tick + 28, "rgba(246,252,252,0.05)", 0.9, 20, 0.9);

    strokeWaveTrain(ctx, eastNear, tick + 20, "rgba(242,248,250,0.035)", 1.3, 28, 0.8);
    strokeWaveTrain(ctx, eastShallow, tick + 32, "rgba(246,252,252,0.05)", 0.9, 20, 0.9);

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
      waterClass === "harbor" ? 1.12 : 1.08,
      waterClass === "harbor" ? 1.10 : 1.06
    );

    const driftX = Math.sin(tick * (waterClass === "harbor" ? 0.015 : 0.012)) * (waterClass === "harbor" ? 10 : 6);
    const driftY = Math.cos(tick * (waterClass === "harbor" ? 0.013 : 0.010)) * (waterClass === "harbor" ? 6 : 4);

    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = waterClass === "harbor" ? 20 : 14;

    polygon(ctx, shell);
    const shellGradient = ctx.createRadialGradient(
      cx - (driftX * 0.30),
      cy - (driftY * 0.22),
      8,
      cx,
      cy,
      Math.max(84, Math.hypot(driftX + 120, driftY + 82))
    );
    shellGradient.addColorStop(0, style.shellInner);
    shellGradient.addColorStop(0.62, style.shellOuter);
    shellGradient.addColorStop(1, "rgba(90,170,186,0)");
    ctx.fillStyle = shellGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const coreGradient = ctx.createRadialGradient(
      cx - 14 + driftX,
      cy - 12 + driftY,
      4,
      cx,
      cy,
      waterClass === "harbor" ? 120 : 96
    );
    coreGradient.addColorStop(0, style.inner);
    coreGradient.addColorStop(0.54, style.middle);
    coreGradient.addColorStop(1, style.outer);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const sheen = ctx.createRadialGradient(
      cx - 18 + (driftX * 0.45),
      cy - 18 + (driftY * 0.35),
      4,
      cx,
      cy,
      waterClass === "harbor" ? 98 : 76
    );
    sheen.addColorStop(0, style.sheen);
    sheen.addColorStop(0.60, "rgba(224,246,244,0.03)");
    sheen.addColorStop(1, "rgba(224,246,244,0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    ctx.lineWidth = waterClass === "harbor" ? 1.1 : 0.9;
    ctx.strokeStyle = style.foam;
    ctx.stroke();
    ctx.restore();

    drawLocalRipples(ctx, points, tick, waterClass);
  }

  function drawLocalRipples(ctx, points, tick, waterClass) {
    const closed = points.concat([points[0]]);
    const samplePath = resamplePolyline(closed, waterClass === "harbor" ? 38 : 46);
    if (samplePath.length < 3) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = waterClass === "harbor" ? 0.85 : 0.75;
    ctx.strokeStyle = waterClass === "harbor"
      ? "rgba(242,248,248,0.08)"
      : "rgba(236,244,246,0.05)";

    for (let i = 0; i < samplePath.length - 1; i += 3) {
      const p0 = samplePath[i];
      const p1 = samplePath[Math.min(samplePath.length - 1, i + 1)];
      const phase = (tick * 0.038) + (i * 0.24);

      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.quadraticCurveTo(
        (p0[0] + p1[0]) * 0.5,
        ((p0[1] + p1[1]) * 0.5) + (Math.sin(phase) * (waterClass === "harbor" ? 1.1 : 0.8)),
        p1[0],
        p1[1]
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
