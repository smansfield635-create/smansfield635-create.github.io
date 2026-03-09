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

    // Counterclockwise coastline, land on left, ocean on right => ocean normal = (ty,-tx)
    const nx = ty / len;
    const ny = -tx / len;

    out.push([
      points[i][0] + (nx * outwardDistance),
      points[i][1] + (ny * outwardDistance)
    ]);
  }

  return out;
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

function makeOceanClip(ctx, width, height, landMask) {
  ctx.beginPath();
  ctx.rect(-420, -420, width + 840, height + 840);
  polygon(ctx, landMask);
  ctx.clip("evenodd");
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
      outer: "rgba(48,112,150,0.96)",
      middle: "rgba(82,170,194,0.95)",
      inner: "rgba(152,220,224,0.92)",
      sheen: "rgba(242,252,248,0.14)",
      shellOuter: "rgba(132,214,220,0.22)",
      shellInner: "rgba(210,244,238,0.10)",
      foam: "rgba(246,250,248,0.14)",
      shadow: "rgba(88,156,184,0.16)"
    };
  }

  if (waterClass === "basin") {
    return {
      outer: "rgba(42,98,132,0.95)",
      middle: "rgba(70,140,168,0.94)",
      inner: "rgba(122,188,196,0.90)",
      sheen: "rgba(226,244,246,0.10)",
      shellOuter: "rgba(106,184,198,0.18)",
      shellInner: "rgba(182,226,222,0.08)",
      foam: "rgba(238,246,246,0.08)",
      shadow: "rgba(74,132,156,0.14)"
    };
  }

  return {
    outer: "rgba(44,102,136,0.95)",
    middle: "rgba(76,150,178,0.94)",
    inner: "rgba(130,196,204,0.90)",
    sheen: "rgba(230,248,248,0.10)",
    shellOuter: "rgba(110,190,204,0.18)",
    shellInner: "rgba(186,230,226,0.08)",
    foam: "rgba(240,248,248,0.08)",
    shadow: "rgba(76,136,162,0.14)"
  };
}

const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

// Pure visible coastline segments only. No synthetic closure edges.
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
    const { width, height, viewportOffset, kernel, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOceanField(ctx, width, height, tick);
    drawCoastTransition(ctx, tick);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawOceanField(ctx, width, height, tick) {
    ctx.save();
    makeOceanClip(ctx, width, height, LAND_MASK);

    const ocean = ctx.createLinearGradient(0, 120, 0, 1220);
    ocean.addColorStop(0, "rgba(46,102,142,0.98)");
    ocean.addColorStop(0.24, "rgba(58,122,162,0.96)");
    ocean.addColorStop(0.52, "rgba(78,154,190,0.94)");
    ocean.addColorStop(0.78, "rgba(108,186,210,0.92)");
    ocean.addColorStop(1, "rgba(142,212,224,0.90)");
    ctx.fillStyle = ocean;
    ctx.fillRect(40, -260, 1220, 1520);

    drawOceanDepthBands(ctx);
    drawOceanWaveField(ctx, tick);

    ctx.restore();
  }

  function drawOceanDepthBands(ctx) {
    const westNear = offsetPolyline(WEST_COASTLINE, 26);
    const westMid = offsetPolyline(WEST_COASTLINE, 56);
    const westFar = offsetPolyline(WEST_COASTLINE, 96);

    const eastNear = offsetPolyline(EAST_COASTLINE, 26);
    const eastMid = offsetPolyline(EAST_COASTLINE, 56);
    const eastFar = offsetPolyline(EAST_COASTLINE, 96);

    fillBandBetween(ctx, WEST_COASTLINE, westNear, "rgba(182,226,226,0.26)");
    fillBandBetween(ctx, westNear, westMid, "rgba(148,210,218,0.18)");
    fillBandBetween(ctx, westMid, westFar, "rgba(118,188,208,0.12)");

    fillBandBetween(ctx, EAST_COASTLINE, eastNear, "rgba(182,226,226,0.24)");
    fillBandBetween(ctx, eastNear, eastMid, "rgba(146,208,216,0.16)");
    fillBandBetween(ctx, eastMid, eastFar, "rgba(116,186,206,0.11)");
  }

  function drawOceanWaveField(ctx, tick) {
    const westWave1 = offsetPolyline(WEST_COASTLINE, 40);
    const westWave2 = offsetPolyline(WEST_COASTLINE, 72);
    const westWave3 = offsetPolyline(WEST_COASTLINE, 110);

    const eastWave1 = offsetPolyline(EAST_COASTLINE, 40);
    const eastWave2 = offsetPolyline(EAST_COASTLINE, 72);
    const eastWave3 = offsetPolyline(EAST_COASTLINE, 110);

    strokeWaveTrain(ctx, westWave3, tick, 0.06, 3.2, 36, 1.2);
    strokeWaveTrain(ctx, westWave2, tick + 13, 0.08, 2.8, 30, 1.15);
    strokeWaveTrain(ctx, westWave1, tick + 26, 0.11, 2.2, 24, 1.0);

    strokeWaveTrain(ctx, eastWave3, tick + 7, 0.05, 3.0, 36, 1.2);
    strokeWaveTrain(ctx, eastWave2, tick + 19, 0.08, 2.6, 30, 1.15);
    strokeWaveTrain(ctx, eastWave1, tick + 31, 0.10, 2.0, 24, 1.0);
  }

  function drawCoastTransition(ctx, tick) {
    const westFoam = offsetPolyline(WEST_COASTLINE, 10);
    const westShell = offsetPolyline(WEST_COASTLINE, 20);
    const eastFoam = offsetPolyline(EAST_COASTLINE, 10);
    const eastShell = offsetPolyline(EAST_COASTLINE, 20);

    fillBandBetween(ctx, WEST_COASTLINE, westShell, "rgba(206,224,196,0.10)");
    fillBandBetween(ctx, EAST_COASTLINE, eastShell, "rgba(206,224,196,0.09)");

    strokeWaveTrain(ctx, westFoam, tick + 22, 0.20, 1.7, 18, 1.4);
    strokeWaveTrain(ctx, eastFoam, tick + 8, 0.18, 1.5, 18, 1.4);

    drawCoastlineEdge(ctx, WEST_COASTLINE);
    drawCoastlineEdge(ctx, EAST_COASTLINE);
  }

  function drawCoastlineEdge(ctx, path) {
    ctx.save();
    polyline(ctx, path);
    ctx.lineWidth = 1.45;
    ctx.strokeStyle = "rgba(248,244,230,0.18)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
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
    const shell = expandPolygon(points, waterClass === "harbor" ? 1.18 : 1.12, waterClass === "harbor" ? 1.14 : 1.10);

    const driftX = Math.sin(tick * (waterClass === "harbor" ? 0.020 : 0.015)) * (waterClass === "harbor" ? 16 : 9);
    const driftY = Math.cos(tick * (waterClass === "harbor" ? 0.017 : 0.013)) * (waterClass === "harbor" ? 10 : 7);

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
    const samplePath = resamplePolyline(points.concat([points[0]]), waterClass === "harbor" ? 34 : 42);
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
