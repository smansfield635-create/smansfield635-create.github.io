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

    // Counterclockwise path: land is left, ocean is right.
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
    const phase = (tick * 0.04) + (i * 0.22);

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
      middle: "rgba(60,176,198,0.96)",
      inner: "rgba(178,238,232,0.95)",
      shellOuter: "rgba(120,212,220,0.14)",
      shellInner: "rgba(228,250,242,0.06)",
      sheen: "rgba(246,252,248,0.10)",
      foam: "rgba(248,252,248,0.14)",
      shadow: "rgba(72,146,178,0.12)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(18,86,122,0.96)",
      middle: "rgba(44,122,156,0.95)",
      inner: "rgba(114,182,194,0.90)",
      shellOuter: "rgba(92,168,188,0.12)",
      shellInner: "rgba(182,226,220,0.05)",
      sheen: "rgba(226,242,246,0.08)",
      foam: "rgba(238,246,246,0.07)",
      shadow: "rgba(66,122,148,0.11)"
    };
  }

  return {
    outer: "rgba(20,92,130,0.96)",
    middle: "rgba(52,138,170,0.95)",
    inner: "rgba(122,192,202,0.90)",
    shellOuter: "rgba(102,184,200,0.12)",
    shellInner: "rgba(186,228,224,0.05)",
    sheen: "rgba(230,246,248,0.08)",
    foam: "rgba(240,248,248,0.07)",
    shadow: "rgba(72,132,158,0.11)"
  };
}

// Active land authority from ground_renderer.js.
// Used only to keep shoreline rendering on the ocean side.
const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

// Derived directly from LAND_MASK ordering.
// East shore: south tip -> north-east visible coast.
// West shore: north-west visible coast -> south tip.
const EAST_SHORE = LAND_MASK.slice(0, 17);
const WEST_SHORE = LAND_MASK.slice(18).concat([LAND_MASK[0]]);

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

    drawSandAndShore(ctx, tick);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawSandAndShore(ctx, tick) {
    ctx.save();
    clipToOceanOnly(ctx);

    drawBeachForPath(ctx, WEST_SHORE, tick);
    drawBeachForPath(ctx, EAST_SHORE, tick);

    ctx.restore();
  }

  function drawBeachForPath(ctx, coastPath, tick) {
    const drySand = offsetPolyline(coastPath, 10);
    const wetSand = offsetPolyline(coastPath, 22);
    const shallow = offsetPolyline(coastPath, 36);
    const lagoon = offsetPolyline(coastPath, 56);

    // Wider dry sand apron
    fillBandBetween(ctx, coastPath, drySand, "rgba(238,220,172,0.18)");

    // Wet sand transition
    fillBandBetween(ctx, drySand, wetSand, "rgba(222,208,166,0.14)");

    // Pale aqua first water
    fillBandBetween(ctx, wetSand, shallow, "rgba(164,226,222,0.14)");

    // Tropical turquoise shelf
    fillBandBetween(ctx, shallow, lagoon, "rgba(82,194,208,0.10)");

    // Shoreline read
    ctx.save();
    polyline(ctx, coastPath);
    ctx.lineWidth = 1.15;
    ctx.strokeStyle = "rgba(248,244,230,0.14)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    // Small liquid motion only in water bands
    strokeWaveTrain(ctx, shallow, tick + 12, "rgba(246,252,252,0.045)", 0.8, 20, 0.75);
    strokeWaveTrain(ctx, lagoon, tick + 22, "rgba(238,248,250,0.03)", 1.0, 28, 0.7);
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
      waterClass === "harbor" ? 1.10 : 1.07,
      waterClass === "harbor" ? 1.08 : 1.05
    );

    const driftX = Math.sin(tick * (waterClass === "harbor" ? 0.012 : 0.010)) * (waterClass === "harbor" ? 6 : 4);
    const driftY = Math.cos(tick * (waterClass === "harbor" ? 0.010 : 0.008)) * (waterClass === "harbor" ? 4 : 3);

    ctx.save();
    ctx.shadowColor = style.shadow;
    ctx.shadowBlur = waterClass === "harbor" ? 14 : 10;

    polygon(ctx, shell);
    const shellGradient = ctx.createRadialGradient(
      cx - (driftX * 0.25),
      cy - (driftY * 0.18),
      8,
      cx,
      cy,
      Math.max(72, Math.hypot(driftX + 96, driftY + 66))
    );
    shellGradient.addColorStop(0, style.shellInner);
    shellGradient.addColorStop(0.64, style.shellOuter);
    shellGradient.addColorStop(1, "rgba(90,170,186,0)");
    ctx.fillStyle = shellGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    const coreGradient = ctx.createRadialGradient(
      cx - 10 + driftX,
      cy - 10 + driftY,
      4,
      cx,
      cy,
      waterClass === "harbor" ? 108 : 84
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
      cx - 14 + (driftX * 0.35),
      cy - 14 + (driftY * 0.28),
      4,
      cx,
      cy,
      waterClass === "harbor" ? 88 : 68
    );
    sheen.addColorStop(0, style.sheen);
    sheen.addColorStop(0.62, "rgba(224,246,244,0.02)");
    sheen.addColorStop(1, "rgba(224,246,244,0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();

    ctx.save();
    polygon(ctx, points);
    ctx.lineWidth = waterClass === "harbor" ? 1.0 : 0.85;
    ctx.strokeStyle = style.foam;
    ctx.stroke();
    ctx.restore();

    drawLocalRipples(ctx, points, tick, waterClass);
  }

  function drawLocalRipples(ctx, points, tick, waterClass) {
    const closed = points.concat([points[0]]);
    const samplePath = resamplePolyline(closed, waterClass === "harbor" ? 42 : 50);
    if (samplePath.length < 3) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = waterClass === "harbor" ? 0.75 : 0.65;
    ctx.strokeStyle = waterClass === "harbor"
      ? "rgba(242,248,248,0.06)"
      : "rgba(236,244,246,0.045)";

    for (let i = 0; i < samplePath.length - 1; i += 3) {
      const p0 = samplePath[i];
      const p1 = samplePath[Math.min(samplePath.length - 1, i + 1)];
      const phase = (tick * 0.032) + (i * 0.18);

      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.quadraticCurveTo(
        (p0[0] + p1[0]) * 0.5,
        ((p0[1] + p1[1]) * 0.5) + (Math.sin(phase) * (waterClass === "harbor" ? 0.8 : 0.55)),
        p1[0],
        p1[1]
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
