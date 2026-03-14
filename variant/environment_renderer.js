function createStarLayers() {
  return {
    far: [
      [0.08, 0.08, 0.8, 0.34, 0.2], [0.16, 0.16, 0.7, 0.30, 1.1], [0.24, 0.10, 0.8, 0.34, 2.0],
      [0.36, 0.14, 0.7, 0.28, 2.8], [0.46, 0.08, 0.8, 0.34, 0.7], [0.56, 0.15, 0.7, 0.28, 1.8],
      [0.68, 0.09, 0.8, 0.34, 2.5], [0.80, 0.14, 0.7, 0.28, 1.5], [0.90, 0.08, 0.8, 0.34, 2.9]
    ],
    mid: [
      [0.12, 0.11, 1.0, 0.48, 0.4], [0.22, 0.22, 0.9, 0.42, 1.3], [0.34, 0.09, 1.1, 0.52, 2.3],
      [0.48, 0.18, 1.0, 0.46, 0.9], [0.60, 0.11, 1.0, 0.48, 1.8], [0.73, 0.19, 0.9, 0.42, 2.7],
      [0.84, 0.12, 1.0, 0.48, 1.1], [0.92, 0.20, 0.9, 0.40, 2.1]
    ],
    near: [
      [0.06, 0.18, 1.3, 0.58, 0.3], [0.18, 0.07, 1.2, 0.54, 1.4], [0.30, 0.17, 1.2, 0.54, 2.2],
      [0.42, 0.06, 1.3, 0.58, 2.9], [0.54, 0.16, 1.2, 0.54, 1.2], [0.66, 0.07, 1.3, 0.58, 2.5],
      [0.78, 0.18, 1.2, 0.54, 0.8], [0.88, 0.06, 1.3, 0.58, 1.9]
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

function hashNoise(a, b, c = 0) {
  const v = Math.sin((a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
  return t * t * (3 - (2 * t));
}

function drawMoonSurface(ctx, x, y, radius, palette, craterSet) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.18, x, y, radius * 2.6);
  halo.addColorStop(0, palette.haloInner);
  halo.addColorStop(0.40, palette.haloMid);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.6, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(
    x - (radius * 0.28),
    y - (radius * 0.30),
    radius * 0.08,
    x,
    y,
    radius
  );
  body.addColorStop(0, palette.light);
  body.addColorStop(0.44, palette.mid);
  body.addColorStop(0.76, palette.dark);
  body.addColorStop(1, palette.edge);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 42; i += 1) {
    const nx = ((hashNoise(i, 1) * 2) - 1) * radius * 0.88;
    const ny = ((hashNoise(i, 2) * 2) - 1) * radius * 0.88;
    const d2 = (nx * nx) + (ny * ny);
    if (d2 > radius * radius * 0.74) continue;

    const n = hashNoise(i, 3);
    const grainR = radius * (0.012 + (n * 0.02));
    const grain = ctx.createRadialGradient(
      x + nx - (grainR * 0.2),
      y + ny - (grainR * 0.1),
      grainR * 0.1,
      x + nx,
      y + ny,
      grainR
    );
    grain.addColorStop(0, palette.noiseLight);
    grain.addColorStop(1, palette.noiseDark);

    ctx.fillStyle = grain;
    ctx.beginPath();
    ctx.arc(x + nx, y + ny, grainR, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const crater of craterSet) {
    const cx = x + (crater.x * radius);
    const cy = y + (crater.y * radius);
    const r = crater.r * radius;

    ctx.beginPath();
    ctx.fillStyle = palette.craterShadow;
    ctx.arc(cx + (r * 0.12), cy + (r * 0.08), r, 0, Math.PI * 2);
    ctx.fill();

    const bowl = ctx.createRadialGradient(
      cx - (r * 0.22),
      cy - (r * 0.18),
      r * 0.06,
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
    ctx.arc(cx - (r * 0.08), cy - (r * 0.08), r * 0.84, 0, Math.PI * 2);
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

  const rim = ctx.createRadialGradient(x, y, radius * 0.74, x, y, radius * 1.22);
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(0.86, palette.rim);
  rim.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.22, 0, Math.PI * 2);
  ctx.fill();
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
    { x: -0.38, y: -0.24, r: 0.11 },
    { x: 0.22, y: -0.30, r: 0.09 },
    { x: -0.02, y: 0.24, r: 0.11 },
    { x: 0.34, y: 0.12, r: 0.07 },
    { x: -0.26, y: 0.34, r: 0.06 },
    { x: 0.08, y: -0.04, r: 0.05 },
    { x: 0.40, y: -0.04, r: 0.05 },
    { x: -0.10, y: -0.42, r: 0.05 }
  ];
}

function getSouthMoonCraters() {
  return [
    { x: -0.24, y: -0.16, r: 0.11 },
    { x: 0.28, y: -0.02, r: 0.08 },
    { x: -0.04, y: 0.26, r: 0.09 },
    { x: 0.20, y: 0.28, r: 0.06 },
    { x: -0.32, y: 0.18, r: 0.05 },
    { x: 0.04, y: -0.30, r: 0.05 }
  ];
}

function drawMoons(ctx, width, height, tick, body) {
  const northRadius = body.radius * 0.20;
  const southRadius = body.radius * 0.10;

  const northBaseX = body.centerX + (body.radius * 0.04);
  const northBaseY = body.horizonY - (body.radius * 0.01);
  const southBaseX = body.centerX - (body.radius * 0.22);
  const southBaseY = body.horizonY + (body.radius * 0.01);

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
      edge: "rgba(104,128,170,0.98)",
      craterShadow: "rgba(120,142,176,0.22)",
      craterFloorLight: "rgba(224,236,255,0.14)",
      craterFloorMid: "rgba(172,194,228,0.11)",
      craterFloorDark: "rgba(112,136,172,0.18)",
      craterRim: "rgba(244,248,255,0.13)",
      shadowEdge: "rgba(84,104,140,0.18)",
      rim: "rgba(188,220,255,0.18)",
      haloInner: "rgba(188,220,255,0.14)",
      haloMid: "rgba(188,220,255,0.05)",
      noiseLight: "rgba(230,238,255,0.04)",
      noiseDark: "rgba(112,136,172,0.03)"
    },
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
      edge: "rgba(166,122,76,0.98)",
      craterShadow: "rgba(186,144,88,0.20)",
      craterFloorLight: "rgba(255,244,220,0.12)",
      craterFloorMid: "rgba(232,196,138,0.09)",
      craterFloorDark: "rgba(176,128,82,0.14)",
      craterRim: "rgba(255,244,212,0.10)",
      shadowEdge: "rgba(138,92,48,0.16)",
      rim: "rgba(255,224,168,0.14)",
      haloInner: "rgba(255,224,168,0.12)",
      haloMid: "rgba(255,224,168,0.04)",
      noiseLight: "rgba(255,242,206,0.04)",
      noiseDark: "rgba(176,128,82,0.03)"
    },
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

function drawAtmosphericCharge(ctx, width, height, tick, body) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.08, Math.PI, Math.PI * 2);
  ctx.arc(body.centerX, body.centerY, body.radius * 0.98, Math.PI * 2, Math.PI, true);
  ctx.closePath();
  ctx.clip();

  const topBand = body.horizonY - (body.radius * 0.18);
  const ribbons = [
    { y: topBand + 18, amp: 5.0, alpha: 0.07, shift: 0.4 },
    { y: topBand + 40, amp: 6.0, alpha: 0.05, shift: 1.6 }
  ];

  for (const ribbon of ribbons) {
    drawAtmosphericChargeRibbon(ctx, width, tick, ribbon.y, ribbon.amp, ribbon.alpha, ribbon.shift);
  }

  ctx.restore();
}

function drawOceanBase(ctx, body) {
  const left = body.centerX - body.radius;
  const top = body.horizonY;
  const width = body.radius * 2;
  const height = body.radius * 1.36;

  const base = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.24),
    body.centerY - (body.radius * 0.28),
    body.radius * 0.10,
    body.centerX,
    body.centerY + (body.radius * 0.18),
    body.radius * 1.10
  );
  base.addColorStop(0.00, "#6ff5eb");
  base.addColorStop(0.10, "#20dfff");
  base.addColorStop(0.24, "#0d8dff");
  base.addColorStop(0.50, "#203fbf");
  base.addColorStop(0.78, "#101d79");
  base.addColorStop(1.00, "#070d3c");
  ctx.fillStyle = base;
  ctx.fillRect(left, top, width, height);

  const nightDepth = ctx.createLinearGradient(0, top + (height * 0.24), 0, top + height);
  nightDepth.addColorStop(0.00, "rgba(0,0,0,0)");
  nightDepth.addColorStop(1.00, "rgba(0,0,34,0.24)");
  ctx.fillStyle = nightDepth;
  ctx.fillRect(left, top, width, height);
}

function drawReefShelf(ctx, body, tick) {
  const reefCenterX = body.centerX + (Math.sin(tick * 0.0009) * body.radius * 0.012);
  const reefCenterY = body.horizonY + (body.radius * 0.10);

  const lagoon = ctx.createRadialGradient(
    reefCenterX,
    reefCenterY,
    body.radius * 0.10,
    reefCenterX,
    reefCenterY,
    body.radius * 0.58
  );
  lagoon.addColorStop(0.00, "rgba(190,255,244,0.16)");
  lagoon.addColorStop(0.26, "rgba(112,255,240,0.10)");
  lagoon.addColorStop(0.62, "rgba(54,220,236,0.04)");
  lagoon.addColorStop(1.00, "rgba(54,220,236,0)");
  ctx.fillStyle = lagoon;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 20; i += 1) {
    const angle = (i / 20) * Math.PI * 2;
    const bandRadius = body.radius * (0.44 + (hashNoise(i, 9) * 0.12));
    const px = body.centerX + (Math.cos(angle) * bandRadius * 0.92);
    const py = reefCenterY + (Math.sin(angle) * bandRadius * 0.26);
    const rx = body.radius * (0.06 + (hashNoise(i, 10) * 0.02));
    const ry = body.radius * (0.016 + (hashNoise(i, 11) * 0.008));

    const g = ctx.createRadialGradient(px, py, 4, px, py, rx);
    g.addColorStop(0, "rgba(176,255,224,0.10)");
    g.addColorStop(0.56, "rgba(82,224,186,0.06)");
    g.addColorStop(1, "rgba(82,224,186,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, (hashNoise(i, 12) - 0.5) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawSeabedMottle(ctx, body, tick) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 26; i += 1) {
    const nx = ((hashNoise(i, 20, 1) * 2) - 1) * body.radius * 0.86;
    const ny = ((hashNoise(i, 20, 2) * 2) - 1) * body.radius * 0.30;
    const px = body.centerX + nx;
    const py = body.horizonY + (body.radius * 0.18) + ny + (Math.sin((tick * 0.0005) + i) * body.radius * 0.003);
    const rx = body.radius * (0.05 + (hashNoise(i, 20, 3) * 0.03));
    const ry = body.radius * (0.014 + (hashNoise(i, 20, 4) * 0.008));

    const g = ctx.createRadialGradient(px, py, 2, px, py, rx);
    g.addColorStop(0, "rgba(70,178,118,0.07)");
    g.addColorStop(0.56, "rgba(40,122,92,0.04)");
    g.addColorStop(1, "rgba(40,122,92,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, (hashNoise(i, 20, 5) - 0.5) * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
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

function drawOceanCurrents(ctx, body, tick) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = body.horizonY;

  const bands = [
    { y: top + 18, amp: 2.4, alpha: 0.13, shift: 0.2, color: "rgba(210,255,246,{a})", width: 1.1 },
    { y: top + 42, amp: 3.2, alpha: 0.11, shift: 0.8, color: "rgba(124,255,246,{a})", width: 1.1 },
    { y: top + 74, amp: 4.2, alpha: 0.09, shift: 1.6, color: "rgba(94,214,255,{a})", width: 1.2 },
    { y: top + 116, amp: 5.3, alpha: 0.08, shift: 2.4, color: "rgba(90,146,255,{a})", width: 1.2 },
    { y: top + 164, amp: 6.6, alpha: 0.06, shift: 3.3, color: "rgba(86,98,240,{a})", width: 1.3 }
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

function drawWaveHighlights(ctx, body, tick) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = body.horizonY;

  for (let band = 0; band < 10; band += 1) {
    const yBase = top + (band * 24);

    ctx.beginPath();
    for (let x = left; x <= right; x += 8) {
      const phase = (tick * 0.024) + (band * 0.78) + (x * 0.012);
      const wave = Math.sin(phase) * (1.8 + (band * 0.14));
      const drift = Math.cos((tick * 0.012) + (x * 0.005)) * 0.9;
      const y = yBase + wave + drift;
      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.08 - (band * 0.006)})`;
    ctx.lineWidth = band < 4 ? 0.90 : 0.80;
    ctx.stroke();
  }
}

function drawMoonReflections(ctx, body, moonNorth, moonSouth) {
  const top = body.horizonY;
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

function drawSpecularSweep(ctx, body, tick) {
  const phase = ((tick % 1200) / 1200);
  const centerX = body.centerX - (body.radius * 0.30) + (phase * body.radius * 0.56);
  const centerY = body.horizonY + (body.radius * 0.18);

  const glow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, body.radius * 0.36);
  glow.addColorStop(0, "rgba(255,255,255,0.08)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.04)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.38, body.radius * 0.11, -0.10, 0, Math.PI * 2);
  ctx.fill();
}

function drawNebulaBand(ctx, width, height, body) {
  const band = ctx.createRadialGradient(
    body.centerX,
    body.horizonY + (body.radius * 0.10),
    body.radius * 0.18,
    body.centerX,
    body.horizonY + (body.radius * 0.10),
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
      const body = projector.getBody();
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.22;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#02050d");
      sky.addColorStop(0.16, "#07142c");
      sky.addColorStop(0.42, "#184579");
      sky.addColorStop(0.72, "#3a8bd0");
      sky.addColorStop(1, "#cbf0ff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      drawNebulaBand(ctx, width, height, body);
      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      const moons = drawMoons(ctx, width, height, tick, body);
      drawAtmosphericCharge(ctx, width, height, tick, body);

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
        body.horizonY - (body.radius * 0.26),
        body.radius * 2.40,
        body.radius * 0.66
      );

      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawOceanBase(ctx, body);
      drawReefShelf(ctx, body, tick);
      drawSeabedMottle(ctx, body, tick);

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
      ctx.fillRect(body.centerX - body.radius, body.horizonY, body.radius * 2, body.radius * 1.30);

      drawMoonReflections(ctx, body, moons.moonNorth, moons.moonSouth);
      drawOceanCurrents(ctx, body, tick);
      drawWaveHighlights(ctx, body, tick);
      drawSpecularSweep(ctx, body, tick);

      ctx.restore();

      const limbGlow = ctx.createLinearGradient(0, body.horizonY - 8, 0, body.horizonY + (body.radius * 0.18));
      limbGlow.addColorStop(0, "rgba(255,255,255,0)");
      limbGlow.addColorStop(0.30, "rgba(250,255,255,0.14)");
      limbGlow.addColorStop(0.60, "rgba(168,242,255,0.10)");
      limbGlow.addColorStop(1, "rgba(168,242,255,0)");
      ctx.fillStyle = limbGlow;
      ctx.fillRect(
        body.centerX - (body.radius * 1.20),
        body.horizonY - 8,
        body.radius * 2.40,
        body.radius * 0.20
      );
    }
  };
}
