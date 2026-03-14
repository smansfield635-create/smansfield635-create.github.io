function drawPolygonPath(ctx, polygon, projector) {
  const projected = projector.poly(polygon).filter((p) => p.visible);
  if (projected.length < 3) return projected;

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

function createStarField() {
  return [
    [0.05, 0.07, 1.0, 0.60, 0.2],
    [0.09, 0.14, 0.8, 0.38, 0.9],
    [0.15, 0.05, 1.2, 0.56, 1.4],
    [0.22, 0.11, 0.9, 0.48, 2.1],
    [0.28, 0.18, 0.8, 0.34, 0.6],
    [0.34, 0.07, 1.1, 0.54, 2.8],
    [0.41, 0.14, 1.0, 0.46, 1.7],
    [0.48, 0.06, 0.9, 0.42, 0.1],
    [0.54, 0.16, 1.1, 0.44, 2.3],
    [0.61, 0.09, 1.3, 0.58, 1.1],
    [0.68, 0.05, 1.0, 0.48, 2.9],
    [0.74, 0.15, 0.8, 0.36, 0.8],
    [0.80, 0.08, 1.2, 0.54, 2.5],
    [0.87, 0.12, 0.9, 0.44, 1.6],
    [0.92, 0.07, 1.0, 0.52, 0.5],
    [0.13, 0.23, 0.8, 0.28, 0.7],
    [0.26, 0.25, 0.7, 0.26, 1.8],
    [0.39, 0.22, 0.8, 0.30, 2.7],
    [0.52, 0.24, 0.7, 0.26, 0.3],
    [0.66, 0.23, 0.8, 0.30, 1.4],
    [0.83, 0.24, 0.7, 0.28, 2.0],
    [0.94, 0.18, 0.9, 0.34, 1.0],
    [0.73, 0.22, 0.8, 0.24, 2.6]
  ];
}

function drawStars(ctx, width, height, tick) {
  const stars = createStarField();

  for (const [x, y, r, a, phase] of stars) {
    const sparkle = 0.70 + (0.30 * Math.sin((tick * 0.035) + (phase * 3.2)));
    const alpha = a * sparkle;
    const radius = r * Math.max(1.2, width / 1200);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(width * x, height * y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (sparkle > 0.94) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((width * x) - (radius * 2.8), height * y);
      ctx.lineTo((width * x) + (radius * 2.8), height * y);
      ctx.moveTo(width * x, (height * y) - (radius * 2.8));
      ctx.lineTo(width * x, (height * y) + (radius * 2.8));
      ctx.stroke();
    }
  }
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
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.98)";
  ctx.beginPath();
  ctx.arc(x, y, 2.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(ctx, x, y, radius, fill, haloColor, width) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.16, x, y, radius * 3.4);
  halo.addColorStop(0, haloColor);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  ctx.arc(x - (radius * 0.18), y - (radius * 0.16), radius * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = Math.max(1, width / 1500);
  ctx.arc(x, y, radius * 1.12, 0, Math.PI * 2);
  ctx.stroke();
}

function drawMoonLightFields(ctx, width, height, moonNorth, moonSouth) {
  const northGlow = ctx.createRadialGradient(
    moonNorth.x,
    moonNorth.y,
    moonNorth.radius * 0.4,
    moonNorth.x,
    moonNorth.y,
    width * 0.42
  );
  northGlow.addColorStop(0, "rgba(255,228,182,0.24)");
  northGlow.addColorStop(0.38, "rgba(255,228,182,0.10)");
  northGlow.addColorStop(1, "rgba(255,228,182,0)");
  ctx.fillStyle = northGlow;
  ctx.fillRect(0, 0, width, height);

  const southGlow = ctx.createRadialGradient(
    moonSouth.x,
    moonSouth.y,
    moonSouth.radius * 0.4,
    moonSouth.x,
    moonSouth.y,
    width * 0.28
  );
  southGlow.addColorStop(0, "rgba(176,214,255,0.18)");
  southGlow.addColorStop(0.38, "rgba(176,214,255,0.08)");
  southGlow.addColorStop(1, "rgba(176,214,255,0)");
  ctx.fillStyle = southGlow;
  ctx.fillRect(0, 0, width, height);
}

function drawMoons(ctx, width, height, tick, body) {
  const northRadius = body.radius * 0.20;
  const southRadius = body.radius * 0.10;

  const northBaseX = body.centerX + (body.radius * 0.08);
  const northBaseY = body.horizonY - (body.radius * 0.02);
  const southBaseX = body.centerX - (body.radius * 0.26);
  const southBaseY = body.horizonY + (body.radius * 0.02);

  const northAngle = (tick || 0) * 0.0012 + 0.3;
  const southAngle = (tick || 0) * 0.0018 + 1.8;

  const moonNorth = {
    x: northBaseX + (Math.cos(northAngle) * body.radius * 0.03),
    y: northBaseY + (Math.sin(northAngle) * body.radius * 0.01),
    radius: northRadius
  };

  const moonSouth = {
    x: southBaseX + (Math.cos(southAngle) * body.radius * 0.02),
    y: southBaseY + (Math.sin(southAngle) * body.radius * 0.008),
    radius: southRadius
  };

  drawMoonLightFields(ctx, width, height, moonNorth, moonSouth);

  drawMoon(
    ctx,
    moonSouth.x,
    moonSouth.y,
    moonSouth.radius,
    "rgba(188,220,255,0.95)",
    "rgba(136,190,255,0.30)",
    width
  );

  drawMoon(
    ctx,
    moonNorth.x,
    moonNorth.y,
    moonNorth.radius,
    "rgba(255,238,196,0.98)",
    "rgba(255,220,160,0.34)",
    width
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
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function drawAtmosphericCharge(ctx, width, height, tick, body) {
  const shellRectX = body.centerX - (body.radius * 1.20);
  const shellRectY = body.horizonY - (body.radius * 0.34);
  const shellRectW = body.radius * 2.40;
  const shellRectH = body.radius * 0.76;

  const shellGlow = ctx.createRadialGradient(
    body.centerX,
    body.horizonY + (body.radius * 0.04),
    body.radius * 0.78,
    body.centerX,
    body.horizonY + (body.radius * 0.04),
    body.radius * 1.08
  );
  shellGlow.addColorStop(0, "rgba(255,255,255,0)");
  shellGlow.addColorStop(0.56, "rgba(128,216,255,0.20)");
  shellGlow.addColorStop(0.78, "rgba(92,176,255,0.24)");
  shellGlow.addColorStop(1, "rgba(92,176,255,0)");
  ctx.fillStyle = shellGlow;
  ctx.fillRect(shellRectX, shellRectY, shellRectW, shellRectH);

  ctx.save();
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.08, Math.PI, Math.PI * 2);
  ctx.arc(body.centerX, body.centerY, body.radius * 0.98, Math.PI * 2, Math.PI, true);
  ctx.closePath();
  ctx.clip();

  const topBand = body.horizonY - (body.radius * 0.22);
  const ribbons = [
    { y: topBand + 18, amp: 6.0, alpha: 0.10, shift: 0.4 },
    { y: topBand + 42, amp: 8.0, alpha: 0.08, shift: 1.6 },
    { y: topBand + 72, amp: 9.2, alpha: 0.06, shift: 2.8 }
  ];

  for (const ribbon of ribbons) {
    drawAtmosphericChargeRibbon(ctx, width, tick, ribbon.y, ribbon.amp, ribbon.alpha, ribbon.shift);
  }

  const flashPhase = tick % 2200;
  if (flashPhase < 18) {
    const boltX = body.centerX - (body.radius * 0.16) + (Math.sin(tick * 0.0017) * body.radius * 0.22);
    const startY = body.horizonY - (body.radius * 0.16);
    const endY = body.horizonY + (body.radius * 0.02);

    ctx.beginPath();
    ctx.moveTo(boltX, startY);

    let currentX = boltX;
    let currentY = startY;

    while (currentY < endY) {
      currentX += Math.sin((currentY * 0.08) + (tick * 0.03)) * 7;
      currentY += 14;
      ctx.lineTo(currentX, currentY);
    }

    ctx.strokeStyle = "rgba(220,246,255,0.20)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

function drawOceanDepthBands(ctx, body) {
  const left = body.centerX - body.radius;
  const top = body.horizonY;
  const width = body.radius * 2;
  const height = body.radius * 1.34;

  const ocean = ctx.createLinearGradient(0, top, 0, top + height);
  ocean.addColorStop(0.00, "#caffff");
  ocean.addColorStop(0.06, "#8ff6ff");
  ocean.addColorStop(0.14, "#62ecff");
  ocean.addColorStop(0.26, "#2fdcfe");
  ocean.addColorStop(0.40, "#19b8ea");
  ocean.addColorStop(0.56, "#1088c8");
  ocean.addColorStop(0.72, "#0c5e9c");
  ocean.addColorStop(0.86, "#08396b");
  ocean.addColorStop(1.00, "#041a40");
  ctx.fillStyle = ocean;
  ctx.fillRect(left, top, width, height);

  const shallowBloom = ctx.createLinearGradient(0, top, 0, top + (height * 0.38));
  shallowBloom.addColorStop(0, "rgba(255,255,255,0.12)");
  shallowBloom.addColorStop(0.20, "rgba(194,252,255,0.08)");
  shallowBloom.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shallowBloom;
  ctx.fillRect(left, top, width, height * 0.38);

  const deepBand = ctx.createLinearGradient(0, top + (height * 0.34), 0, top + (height * 0.80));
  deepBand.addColorStop(0, "rgba(0,0,0,0)");
  deepBand.addColorStop(1, "rgba(0,14,42,0.16)");
  ctx.fillStyle = deepBand;
  ctx.fillRect(left, top + (height * 0.34), width, height * 0.46);

  const abyssShade = ctx.createLinearGradient(0, top + (height * 0.56), 0, top + height);
  abyssShade.addColorStop(0, "rgba(0,0,0,0)");
  abyssShade.addColorStop(1, "rgba(0,8,28,0.38)");
  ctx.fillStyle = abyssShade;
  ctx.fillRect(left, top + (height * 0.56), width, height * 0.44);
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
    { y: top + 18, amp: 3.2, alpha: 0.22, shift: 0.2, color: "rgba(220,255,255,{a})", width: 1.4 },
    { y: top + 40, amp: 3.8, alpha: 0.20, shift: 0.8, color: "rgba(176,248,255,{a})", width: 1.4 },
    { y: top + 68, amp: 4.8, alpha: 0.18, shift: 1.6, color: "rgba(120,246,244,{a})", width: 1.5 },
    { y: top + 102, amp: 6.0, alpha: 0.16, shift: 2.5, color: "rgba(90,236,228,{a})", width: 1.6 },
    { y: top + 142, amp: 7.4, alpha: 0.14, shift: 3.4, color: "rgba(70,214,242,{a})", width: 1.7 },
    { y: top + 188, amp: 8.6, alpha: 0.12, shift: 4.4, color: "rgba(64,184,236,{a})", width: 1.8 },
    { y: top + 242, amp: 9.8, alpha: 0.10, shift: 5.2, color: "rgba(56,150,214,{a})", width: 1.8 }
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

  for (let band = 0; band < 15; band += 1) {
    const yBase = top + (band * 20);

    ctx.beginPath();
    for (let x = left; x <= right; x += 8) {
      const phase = (tick * 0.028) + (band * 0.76) + (x * 0.012);
      const wave = Math.sin(phase) * (2.6 + band * 0.18);
      const drift = Math.cos((tick * 0.014) + (x * 0.005)) * 1.2;
      const y = yBase + wave + drift;

      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.18 - (band * 0.009)})`;
    ctx.lineWidth = band < 4 ? 1.3 : 1.05;
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
    body.radius * 0.36
  );
  northReflect.addColorStop(0, "rgba(255,232,186,0.24)");
  northReflect.addColorStop(0.36, "rgba(255,232,186,0.10)");
  northReflect.addColorStop(1, "rgba(255,232,186,0)");
  ctx.fillStyle = northReflect;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);

  const southReflect = ctx.createRadialGradient(
    moonSouth.x,
    top + (height * 0.18),
    6,
    moonSouth.x,
    top + (height * 0.28),
    body.radius * 0.24
  );
  southReflect.addColorStop(0, "rgba(188,220,255,0.16)");
  southReflect.addColorStop(0.36, "rgba(188,220,255,0.06)");
  southReflect.addColorStop(1, "rgba(188,220,255,0)");
  ctx.fillStyle = southReflect;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);
}

function drawSpecularSweep(ctx, body, tick) {
  const phase = ((tick % 1200) / 1200);
  const centerX = body.centerX - (body.radius * 0.34) + (phase * body.radius * 0.64);
  const centerY = body.horizonY + (body.radius * 0.18);

  const glow = ctx.createRadialGradient(
    centerX,
    centerY,
    6,
    centerX,
    centerY,
    body.radius * 0.42
  );
  glow.addColorStop(0, "rgba(255,255,255,0.16)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.08)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.44, body.radius * 0.14, -0.10, 0, Math.PI * 2);
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
    Math.max(90, projector.radius(260, cy))
  );
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);

  ctx.fillStyle = gradient;
  ctx.fill();

  drawPolygonPath(ctx, polygon, projector);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = projector.lineWidth(1.8, cy);
  ctx.stroke();
}

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const tick = snapshot.tick ?? 0;
      const body = projector.getBody();
      const environment = snapshot.kernel.environment ?? {};
      const mistAmount = typeof environment.mistAmount === "number" ? environment.mistAmount : 0.36;
      const waters = Array.isArray(snapshot.kernel.waters) ? snapshot.kernel.waters : [];
      const outerOcean = waters[0] ?? null;
      const harborBasin = waters[1] ?? null;

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#03050e");
      sky.addColorStop(0.12, "#09142e");
      sky.addColorStop(0.28, "#143360");
      sky.addColorStop(0.54, "#2f6fa8");
      sky.addColorStop(0.78, "#6fbbe2");
      sky.addColorStop(1, "#dff7ff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const nebulaLeft = ctx.createRadialGradient(
        width * 0.22,
        height * 0.20,
        width * 0.04,
        width * 0.22,
        height * 0.20,
        width * 0.30
      );
      nebulaLeft.addColorStop(0, "rgba(132,120,255,0.12)");
      nebulaLeft.addColorStop(0.40, "rgba(82,132,255,0.06)");
      nebulaLeft.addColorStop(1, "rgba(82,132,255,0)");
      ctx.fillStyle = nebulaLeft;
      ctx.fillRect(0, 0, width, height * 0.44);

      const nebulaRight = ctx.createRadialGradient(
        width * 0.58,
        height * 0.18,
        width * 0.03,
        width * 0.58,
        height * 0.18,
        width * 0.26
      );
      nebulaRight.addColorStop(0, "rgba(255,154,184,0.10)");
      nebulaRight.addColorStop(0.42, "rgba(210,128,255,0.05)");
      nebulaRight.addColorStop(1, "rgba(210,128,255,0)");
      ctx.fillStyle = nebulaRight;
      ctx.fillRect(0, 0, width, height * 0.42);

      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      const moons = drawMoons(ctx, width, height, tick, body);
      drawAtmosphericCharge(ctx, width, height, tick, body);

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius * 1.08, Math.PI, Math.PI * 2);
      ctx.arc(body.centerX, body.centerY, body.radius * 0.98, Math.PI * 2, Math.PI, true);
      ctx.closePath();
      ctx.clip();

      const atmosphereShell = ctx.createRadialGradient(
        body.centerX,
        body.centerY,
        body.radius * 0.96,
        body.centerX,
        body.centerY,
        body.radius * 1.10
      );
      atmosphereShell.addColorStop(0, "rgba(255,255,255,0)");
      atmosphereShell.addColorStop(0.52, `rgba(132,218,255,${0.24 + (mistAmount * 0.10)})`);
      atmosphereShell.addColorStop(0.78, `rgba(94,176,255,${0.28 + (mistAmount * 0.10)})`);
      atmosphereShell.addColorStop(1, "rgba(94,176,255,0)");
      ctx.fillStyle = atmosphereShell;
      ctx.fillRect(
        body.centerX - (body.radius * 1.20),
        body.horizonY - (body.radius * 0.34),
        body.radius * 2.40,
        body.radius * 0.86
      );

      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawOceanDepthBands(ctx, body);

      const globeShadow = ctx.createRadialGradient(
        body.centerX,
        body.centerY - (body.radius * 0.18),
        body.radius * 0.12,
        body.centerX,
        body.centerY,
        body.radius * 1.05
      );
      globeShadow.addColorStop(0, "rgba(255,255,255,0.18)");
      globeShadow.addColorStop(0.34, "rgba(164,232,255,0.10)");
      globeShadow.addColorStop(0.70, "rgba(24,90,144,0.12)");
      globeShadow.addColorStop(1, "rgba(4,22,48,0.22)");
      ctx.fillStyle = globeShadow;
      ctx.fillRect(body.centerX - body.radius, body.horizonY, body.radius * 2, body.radius * 1.30);

      drawMoonReflections(ctx, body, moons.moonNorth, moons.moonSouth);
      drawOceanCurrents(ctx, body, tick);
      drawWaveHighlights(ctx, body, tick);
      drawSpecularSweep(ctx, body, tick);

      if (outerOcean) {
        drawShallowShelf(
          ctx,
          outerOcean,
          projector,
          "rgba(96,240,236,0.20)",
          "rgba(96,240,236,0.00)"
        );
      }

      if (harborBasin) {
        drawShallowShelf(
          ctx,
          harborBasin,
          projector,
          "rgba(148,255,240,0.60)",
          "rgba(148,255,240,0.12)"
        );
      }

      ctx.restore();

      const limbGlow = ctx.createLinearGradient(0, body.horizonY - 10, 0, body.horizonY + (body.radius * 0.20));
      limbGlow.addColorStop(0, "rgba(255,255,255,0)");
      limbGlow.addColorStop(0.30, "rgba(250,255,255,0.22)");
      limbGlow.addColorStop(0.60, "rgba(168,242,255,0.18)");
      limbGlow.addColorStop(1, "rgba(168,242,255,0)");
      ctx.fillStyle = limbGlow;
      ctx.fillRect(
        body.centerX - (body.radius * 1.20),
        body.horizonY - 10,
        body.radius * 2.40,
        body.radius * 0.24
      );
    }
  };
}
