function drawPolygonPath(ctx, polygon, projector) {
  if (!Array.isArray(polygon) || polygon.length < 3) return null;
  const projected = polygon.map(([x, y]) => projector.point(x, y));
  if (projected.length < 3) return null;

  ctx.beginPath();
  ctx.moveTo(projected[0].x, projected[0].y);
  for (let i = 1; i < projected.length; i += 1) {
    ctx.lineTo(projected[i].x, projected[i].y);
  }
  ctx.closePath();
  return projected;
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

function createStarLayers() {
  return {
    far: [
      [0.08,0.08,0.8,0.34,0.2],[0.16,0.16,0.7,0.30,1.1],[0.24,0.10,0.8,0.34,2.0],
      [0.36,0.14,0.7,0.28,2.8],[0.46,0.08,0.8,0.34,0.7],[0.56,0.15,0.7,0.28,1.8],
      [0.68,0.09,0.8,0.34,2.5],[0.80,0.14,0.7,0.28,1.5],[0.90,0.08,0.8,0.34,2.9]
    ],
    mid: [
      [0.12,0.11,1.0,0.48,0.4],[0.22,0.22,0.9,0.42,1.3],[0.34,0.09,1.1,0.52,2.3],
      [0.48,0.18,1.0,0.46,0.9],[0.60,0.11,1.0,0.48,1.8],[0.73,0.19,0.9,0.42,2.7],
      [0.84,0.12,1.0,0.48,1.1],[0.92,0.20,0.9,0.40,2.1]
    ],
    near: [
      [0.06,0.18,1.3,0.58,0.3],[0.18,0.07,1.2,0.54,1.4],[0.30,0.17,1.2,0.54,2.2],
      [0.42,0.06,1.3,0.58,2.9],[0.54,0.16,1.2,0.54,1.2],[0.66,0.07,1.3,0.58,2.5],
      [0.78,0.18,1.2,0.54,0.8],[0.88,0.06,1.3,0.58,1.9]
    ]
  };
}

function drawStarLayer(ctx, width, height, tick, stars, driftX, driftY) {
  for (const [x, y, r, a, phase] of stars) {
    const sparkle = 0.72 + (0.28 * Math.sin((tick * 0.035) + (phase * 3.1)));
    const alpha = a * sparkle;
    const radius = r * Math.max(1.0, width / 1400);
    const px = (width * x) + driftX;
    const py = (height * y) + driftY;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStars(ctx, width, height, tick) {
  const layers = createStarLayers();

  drawStarLayer(
    ctx,
    width,
    height,
    tick,
    layers.far,
    Math.sin(tick * 0.00008) * 3,
    Math.cos(tick * 0.00006) * 2
  );
  drawStarLayer(
    ctx,
    width,
    height,
    tick,
    layers.mid,
    Math.sin(tick * 0.00014) * 6,
    Math.cos(tick * 0.00010) * 4
  );
  drawStarLayer(
    ctx,
    width,
    height,
    tick,
    layers.near,
    Math.sin(tick * 0.00022) * 10,
    Math.cos(tick * 0.00016) * 7
  );
}

function drawShootingStar(ctx, width, height, tick) {
  const cycle = tick % 1800;
  if (cycle > 120) return;

  const t = cycle / 120;
  const startX = width * 0.16;
  const startY = height * 0.12;
  const endX = width * 0.48;
  const endY = height * 0.24;

  const x = startX + ((endX - startX) * t);
  const y = startY + ((endY - startY) * t);
  const tailX = x - (width * 0.12);
  const tailY = y - (height * 0.03);

  const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.42, "rgba(180,220,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0.98)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.98)";
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoonSurface(ctx, x, y, radius, palette, tick, craterSet) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.14, x, y, radius * 2.4);
  halo.addColorStop(0, palette.haloInner);
  halo.addColorStop(0.38, palette.haloMid);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(
    x - (radius * 0.24),
    y - (radius * 0.28),
    radius * 0.08,
    x,
    y,
    radius
  );
  body.addColorStop(0, palette.light);
  body.addColorStop(0.52, palette.mid);
  body.addColorStop(1, palette.dark);

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  for (const crater of craterSet) {
    const cx = x + (crater.x * radius);
    const cy = y + (crater.y * radius);
    const r = crater.r * radius;

    ctx.beginPath();
    ctx.fillStyle = palette.craterShadow;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const bowl = ctx.createRadialGradient(
      cx - (r * 0.18),
      cy - (r * 0.16),
      r * 0.08,
      cx,
      cy,
      r
    );
    bowl.addColorStop(0, palette.craterFloorLight);
    bowl.addColorStop(0.50, palette.craterFloorMid);
    bowl.addColorStop(1, palette.craterFloorDark);
    ctx.fillStyle = bowl;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = palette.craterRim;
    ctx.lineWidth = Math.max(1, r * 0.10);
    ctx.arc(cx - (r * 0.06), cy - (r * 0.06), r * 0.88, 0, Math.PI * 2);
    ctx.stroke();
  }

  const terminator = ctx.createLinearGradient(x - radius, y, x + radius, y);
  terminator.addColorStop(0, palette.shadowEdge);
  terminator.addColorStop(0.42, "rgba(0,0,0,0)");
  terminator.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = terminator;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  const rim = ctx.createRadialGradient(x, y, radius * 0.74, x, y, radius * 1.20);
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(0.84, palette.rim);
  rim.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.20, 0, Math.PI * 2);
  ctx.fill();

  if (((tick / 240) | 0) % 2 === 0) {
    ctx.beginPath();
    ctx.strokeStyle = palette.detailRing;
    ctx.lineWidth = Math.max(1, radius * 0.02);
    ctx.arc(x, y, radius * 1.04, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawMoonLightFields(ctx, width, height, moonNorth, moonSouth) {
  const northGlow = ctx.createRadialGradient(
    moonNorth.x,
    moonNorth.y,
    moonNorth.radius * 0.4,
    moonNorth.x,
    moonNorth.y,
    width * 0.28
  );
  northGlow.addColorStop(0, "rgba(255,228,182,0.14)");
  northGlow.addColorStop(0.38, "rgba(255,228,182,0.05)");
  northGlow.addColorStop(1, "rgba(255,228,182,0)");
  ctx.fillStyle = northGlow;
  ctx.fillRect(0, 0, width, height);

  const southGlow = ctx.createRadialGradient(
    moonSouth.x,
    moonSouth.y,
    moonSouth.radius * 0.4,
    moonSouth.x,
    moonSouth.y,
    width * 0.18
  );
  southGlow.addColorStop(0, "rgba(176,214,255,0.10)");
  southGlow.addColorStop(0.38, "rgba(176,214,255,0.04)");
  southGlow.addColorStop(1, "rgba(176,214,255,0)");
  ctx.fillStyle = southGlow;
  ctx.fillRect(0, 0, width, height);
}

function getNorthMoonCraters() {
  return [
    { x:-0.30, y:-0.12, r:0.18 },
    { x:0.24, y:-0.18, r:0.14 },
    { x:-0.08, y:0.22, r:0.16 },
    { x:0.34, y:0.18, r:0.10 },
    { x:-0.38, y:0.28, r:0.08 },
    { x:0.02, y:-0.34, r:0.09 },
    { x:-0.04, y:0.02, r:0.07 },
    { x:0.14, y:0.38, r:0.06 },
    { x:-0.24, y:-0.34, r:0.05 },
    { x:0.42, y:-0.02, r:0.05 }
  ];
}

function getSouthMoonCraters() {
  return [
    { x:-0.22, y:-0.10, r:0.15 },
    { x:0.26, y:-0.04, r:0.11 },
    { x:-0.02, y:0.24, r:0.12 },
    { x:0.18, y:0.30, r:0.07 },
    { x:-0.30, y:0.18, r:0.07 },
    { x:0.02, y:-0.28, r:0.06 },
    { x:0.36, y:-0.18, r:0.05 }
  ];
}

function drawMoons(ctx, width, height, tick, body, horizonY) {
  const northRadius = body.radius * 0.20;
  const southRadius = body.radius * 0.10;

  const northBaseX = body.centerX + (body.radius * 0.04);
  const northBaseY = horizonY - (body.radius * 0.01);
  const southBaseX = body.centerX - (body.radius * 0.22);
  const southBaseY = horizonY + (body.radius * 0.01);

  const northAngle = (tick || 0) * 0.0010 + 0.18;
  const southAngle = (tick || 0) * 0.0014 + 1.7;

  const moonNorth = {
    x: northBaseX + (Math.cos(northAngle) * body.radius * 0.018),
    y: northBaseY + (Math.sin(northAngle) * body.radius * 0.008),
    radius: northRadius
  };

  const moonSouth = {
    x: southBaseX + (Math.cos(southAngle) * body.radius * 0.014),
    y: southBaseY + (Math.sin(southAngle) * body.radius * 0.006),
    radius: southRadius
  };

  drawMoonLightFields(ctx, width, height, moonNorth, moonSouth);

  drawMoonSurface(
    ctx,
    moonSouth.x,
    moonSouth.y,
    moonSouth.radius,
    {
      light: "rgba(228,238,255,0.96)",
      mid: "rgba(198,214,242,0.96)",
      dark: "rgba(152,174,208,0.98)",
      craterShadow: "rgba(120,142,176,0.24)",
      craterFloorLight: "rgba(224,236,255,0.12)",
      craterFloorMid: "rgba(170,192,228,0.10)",
      craterFloorDark: "rgba(112,136,172,0.18)",
      craterRim: "rgba(244,248,255,0.12)",
      shadowEdge: "rgba(84,104,140,0.16)",
      rim: "rgba(188,220,255,0.18)",
      detailRing: "rgba(240,246,255,0.08)",
      haloInner: "rgba(188,220,255,0.14)",
      haloMid: "rgba(188,220,255,0.05)"
    },
    tick,
    getSouthMoonCraters()
  );

  drawMoonSurface(
    ctx,
    moonNorth.x,
    moonNorth.y,
    moonNorth.radius,
    {
      light: "rgba(255,246,220,0.98)",
      mid: "rgba(246,216,156,0.98)",
      dark: "rgba(214,168,106,0.98)",
      craterShadow: "rgba(186,144,88,0.20)",
      craterFloorLight: "rgba(255,244,220,0.10)",
      craterFloorMid: "rgba(232,196,138,0.08)",
      craterFloorDark: "rgba(176,128,82,0.14)",
      craterRim: "rgba(255,244,212,0.10)",
      shadowEdge: "rgba(138,92,48,0.14)",
      rim: "rgba(255,224,168,0.14)",
      detailRing: "rgba(255,244,212,0.06)",
      haloInner: "rgba(255,224,168,0.12)",
      haloMid: "rgba(255,224,168,0.04)"
    },
    tick,
    getNorthMoonCraters()
  );

  return { moonNorth, moonSouth };
}

function drawAtmosphericChargeRibbon(ctx, width, tick, yBase, amp, alpha, phaseShift) {
  ctx.beginPath();

  for (let x = 0; x <= width; x += 10) {
    const waveA = Math.sin((x * 0.009) + (tick * 0.012) + phaseShift) * amp;
    const waveB = Math.cos((x * 0.004) - (tick * 0.008) + (phaseShift * 0.7)) * (amp * 0.34);
    const y = yBase + waveA + waveB;

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  const gradient = ctx.createLinearGradient(0, yBase - (amp * 2), width, yBase + (amp * 2));
  gradient.addColorStop(0, `rgba(120,180,255,${alpha * 0.55})`);
  gradient.addColorStop(0.5, `rgba(200,240,255,${alpha})`);
  gradient.addColorStop(1, `rgba(150,210,255,${alpha * 0.52})`);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

function drawAtmosphericCharge(ctx, width, height, tick, body, horizonY) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.08, Math.PI, Math.PI * 2);
  ctx.arc(body.centerX, body.centerY, body.radius * 0.98, Math.PI * 2, Math.PI, true);
  ctx.closePath();
  ctx.clip();

  const topBand = horizonY - (body.radius * 0.18);
  const ribbons = [
    { y: topBand + 18, amp: 5.0, alpha: 0.07, shift: 0.4 },
    { y: topBand + 40, amp: 6.0, alpha: 0.05, shift: 1.6 }
  ];

  for (const ribbon of ribbons) {
    drawAtmosphericChargeRibbon(ctx, width, tick, ribbon.y, ribbon.amp, ribbon.alpha, ribbon.shift);
  }

  ctx.restore();
}

function drawOceanDepthBands(ctx, body, tick, horizonY) {
  const left = body.centerX - body.radius;
  const top = horizonY;
  const width = body.radius * 2;
  const height = body.radius * 1.34;

  const ocean = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.22),
    body.centerY - (body.radius * 0.34),
    body.radius * 0.18,
    body.centerX,
    body.centerY + (body.radius * 0.22),
    body.radius * 1.06
  );
  ocean.addColorStop(0.00, "#b8fff5");
  ocean.addColorStop(0.14, "#39e7ff");
  ocean.addColorStop(0.34, "#1184ff");
  ocean.addColorStop(0.62, "#2146d1");
  ocean.addColorStop(1.00, "#0a1357");
  ctx.fillStyle = ocean;
  ctx.fillRect(left, top, width, height);

  const lightRoll = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.28),
    body.centerY - (body.radius * 0.42),
    body.radius * 0.10,
    body.centerX - (body.radius * 0.18),
    body.centerY - (body.radius * 0.18),
    body.radius * 0.62
  );
  lightRoll.addColorStop(0, "rgba(255,255,255,0.16)");
  lightRoll.addColorStop(0.36, "rgba(186,255,248,0.08)");
  lightRoll.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = lightRoll;
  ctx.fillRect(left, top, width, height);

  const abyss = ctx.createLinearGradient(0, top + (height * 0.34), 0, top + height);
  abyss.addColorStop(0, "rgba(0,0,0,0)");
  abyss.addColorStop(1, "rgba(0,0,24,0.20)");
  ctx.fillStyle = abyss;
  ctx.fillRect(left, top + (height * 0.34), width, height * 0.66);

  const drift = (Math.sin(tick * 0.0012) * body.radius * 0.016);
  const shelf = ctx.createRadialGradient(
    body.centerX + drift,
    horizonY + (body.radius * 0.06),
    body.radius * 0.18,
    body.centerX + drift,
    horizonY + (body.radius * 0.10),
    body.radius * 0.66
  );
  shelf.addColorStop(0, "rgba(168,255,238,0.16)");
  shelf.addColorStop(0.40, "rgba(104,248,232,0.08)");
  shelf.addColorStop(1, "rgba(104,248,232,0)");
  ctx.fillStyle = shelf;
  ctx.fillRect(left, top, width, height * 0.56);
}

function drawCurrentRibbon(ctx, left, right, yBase, amp, tick, alpha, phaseShift, color, lineWidth) {
  ctx.beginPath();

  for (let x = left; x <= right; x += 8) {
    const waveA = Math.sin((x * 0.010) + (tick * 0.020) + phaseShift) * amp;
    const waveB = Math.cos((x * 0.004) - (tick * 0.012) + (phaseShift * 0.6)) * (amp * 0.32);
    const y = yBase + waveA + waveB;

    if (x === left) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = color.replace("{a}", String(alpha));
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawOceanCurrents(ctx, body, tick, horizonY) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = horizonY;

  const bands = [
    { y: top + 18, amp: 2.8, alpha: 0.14, shift: 0.2, color: "rgba(200,255,246,{a})", width: 1.2 },
    { y: top + 42, amp: 3.6, alpha: 0.12, shift: 0.8, color: "rgba(120,255,246,{a})", width: 1.2 },
    { y: top + 72, amp: 4.6, alpha: 0.11, shift: 1.6, color: "rgba(90,220,255,{a})", width: 1.3 },
    { y: top + 110, amp: 5.8, alpha: 0.09, shift: 2.5, color: "rgba(84,160,255,{a})", width: 1.4 },
    { y: top + 158, amp: 7.2, alpha: 0.08, shift: 3.4, color: "rgba(82,110,240,{a})", width: 1.5 }
  ];

  for (const band of bands) {
    drawCurrentRibbon(
      ctx,
      left,
      right,
      band.y,
      band.amp,
      tick,
      band.alpha,
      band.shift,
      band.color,
      band.width
    );
  }
}

function drawWaveHighlights(ctx, body, tick, horizonY) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = horizonY;

  for (let band = 0; band < 11; band += 1) {
    const yBase = top + (band * 22);

    ctx.beginPath();
    for (let x = left; x <= right; x += 8) {
      const phase = (tick * 0.024) + (band * 0.76) + (x * 0.012);
      const wave = Math.sin(phase) * (2.0 + band * 0.15);
      const drift = Math.cos((tick * 0.012) + (x * 0.005)) * 1.0;
      const y = yBase + wave + drift;

      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.10 - (band * 0.007)})`;
    ctx.lineWidth = band < 4 ? 1.0 : 0.90;
    ctx.stroke();
  }
}

function drawMoonReflections(ctx, body, moonNorth, moonSouth, horizonY) {
  const top = horizonY;
  const height = body.radius * 1.28;

  const northReflect = ctx.createRadialGradient(
    moonNorth.x,
    top + (height * 0.12),
    6,
    moonNorth.x,
    top + (height * 0.24),
    body.radius * 0.30
  );
  northReflect.addColorStop(0, "rgba(255,232,186,0.16)");
  northReflect.addColorStop(0.36, "rgba(255,232,186,0.06)");
  northReflect.addColorStop(1, "rgba(255,232,186,0)");
  ctx.fillStyle = northReflect;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);

  const southReflect = ctx.createRadialGradient(
    moonSouth.x,
    top + (height * 0.18),
    6,
    moonSouth.x,
    top + (height * 0.28),
    body.radius * 0.20
  );
  southReflect.addColorStop(0, "rgba(188,220,255,0.10)");
  southReflect.addColorStop(0.36, "rgba(188,220,255,0.04)");
  southReflect.addColorStop(1, "rgba(188,220,255,0)");
  ctx.fillStyle = southReflect;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);
}

function drawSpecularSweep(ctx, body, tick, horizonY) {
  const phase = ((tick % 1200) / 1200);
  const centerX = body.centerX - (body.radius * 0.34) + (phase * body.radius * 0.64);
  const centerY = horizonY + (body.radius * 0.18);

  const glow = ctx.createRadialGradient(
    centerX,
    centerY,
    6,
    centerX,
    centerY,
    body.radius * 0.38
  );
  glow.addColorStop(0, "rgba(255,255,255,0.10)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.05)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.40, body.radius * 0.12, -0.10, 0, Math.PI * 2);
  ctx.fill();
}

function drawShallowShelf(ctx, polygon, projector, colorA, colorB) {
  const projected = drawPolygonPath(ctx, polygon, projector);
  if (!projected || projected.length < 3) return;

  const [cx, cy] = centroid(polygon);
  const center = projector.point(cx, cy);
  const gradient = ctx.createRadialGradient(
    center.x,
    center.y,
    6,
    center.x,
    center.y,
    Math.max(90, projector.radius(260))
  );
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);

  ctx.fillStyle = gradient;
  ctx.fill();

  drawPolygonPath(ctx, polygon, projector);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = projector.lineWidth(1.6);
  ctx.stroke();
}

function drawNebulaBand(ctx, width, height, body, horizonY) {
  const band = ctx.createRadialGradient(
    body.centerX,
    horizonY + (body.radius * 0.10),
    body.radius * 0.18,
    body.centerX,
    horizonY + (body.radius * 0.10),
    body.radius * 1.16
  );
  band.addColorStop(0, "rgba(130,162,255,0.00)");
  band.addColorStop(0.48, "rgba(122,154,236,0.04)");
  band.addColorStop(0.72, "rgba(102,130,210,0.06)");
  band.addColorStop(1, "rgba(60,78,140,0.00)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, width, height);
}

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const tick = snapshot.tick ?? 0;
      const body = projector.body;
      const horizonY = body.centerY;
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.22;
      const waters = Array.isArray(snapshot.kernel.waters) ? snapshot.kernel.waters : [];
      const outerOcean = waters[0] ?? null;
      const harborBasin = waters[1] ?? null;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#02050d");
      sky.addColorStop(0.16, "#07142c");
      sky.addColorStop(0.42, "#184579");
      sky.addColorStop(0.72, "#3a8bd0");
      sky.addColorStop(1, "#cbf0ff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      drawNebulaBand(ctx, width, height, body, horizonY);
      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      const moons = drawMoons(ctx, width, height, tick, body, horizonY);
      drawAtmosphericCharge(ctx, width, height, tick, body, horizonY);

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius * 1.07, Math.PI, Math.PI * 2);
      ctx.arc(body.centerX, body.centerY, body.radius * 0.985, Math.PI * 2, Math.PI, true);
      ctx.closePath();
      ctx.clip();

      const atmosphereShell = ctx.createRadialGradient(
        body.centerX,
        body.centerY,
        body.radius * 0.97,
        body.centerX,
        body.centerY,
        body.radius * 1.08
      );
      atmosphereShell.addColorStop(0, "rgba(255,255,255,0)");
      atmosphereShell.addColorStop(0.54, `rgba(132,218,255,${0.16 + (mistAmount * 0.04)})`);
      atmosphereShell.addColorStop(0.80, `rgba(94,176,255,${0.18 + (mistAmount * 0.04)})`);
      atmosphereShell.addColorStop(1, "rgba(94,176,255,0)");
      ctx.fillStyle = atmosphereShell;
      ctx.fillRect(
        body.centerX - (body.radius * 1.20),
        horizonY - (body.radius * 0.26),
        body.radius * 2.40,
        body.radius * 0.66
      );

      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawOceanDepthBands(ctx, body, tick, horizonY);

      const globeShadow = ctx.createRadialGradient(
        body.centerX,
        body.centerY - (body.radius * 0.18),
        body.radius * 0.12,
        body.centerX,
        body.centerY,
        body.radius * 1.05
      );
      globeShadow.addColorStop(0, "rgba(255,255,255,0.08)");
      globeShadow.addColorStop(0.34, "rgba(164,232,255,0.05)");
      globeShadow.addColorStop(0.70, "rgba(24,90,144,0.08)");
      globeShadow.addColorStop(1, "rgba(4,22,48,0.16)");
      ctx.fillStyle = globeShadow;
      ctx.fillRect(body.centerX - body.radius, horizonY, body.radius * 2, body.radius * 1.30);

      drawMoonReflections(ctx, body, moons.moonNorth, moons.moonSouth, horizonY);
      drawOceanCurrents(ctx, body, tick, horizonY);
      drawWaveHighlights(ctx, body, tick, horizonY);
      drawSpecularSweep(ctx, body, tick, horizonY);

      if (outerOcean) {
        drawShallowShelf(
          ctx,
          outerOcean,
          projector,
          "rgba(96,240,236,0.10)",
          "rgba(96,240,236,0.00)"
        );
      }

      if (harborBasin) {
        drawShallowShelf(
          ctx,
          harborBasin,
          projector,
          "rgba(148,255,240,0.36)",
          "rgba(148,255,240,0.06)"
        );
      }

      ctx.restore();

      const limbGlow = ctx.createLinearGradient(0, horizonY - 8, 0, horizonY + (body.radius * 0.18));
      limbGlow.addColorStop(0, "rgba(255,255,255,0)");
      limbGlow.addColorStop(0.30, "rgba(250,255,255,0.14)");
      limbGlow.addColorStop(0.60, "rgba(168,242,255,0.10)");
      limbGlow.addColorStop(1, "rgba(168,242,255,0)");
      ctx.fillStyle = limbGlow;
      ctx.fillRect(
        body.centerX - (body.radius * 1.20),
        horizonY - 8,
        body.radius * 2.40,
        body.radius * 0.20
      );
    }
  };
}
