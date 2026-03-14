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
    [0.06, 0.08, 1.0, 0.60, 0.2],
    [0.10, 0.16, 0.8, 0.38, 0.9],
    [0.16, 0.05, 1.2, 0.56, 1.4],
    [0.22, 0.12, 0.9, 0.48, 2.1],
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
    [0.83, 0.24, 0.7, 0.28, 2.0]
  ];
}

function drawStars(ctx, width, height, tick) {
  const stars = createStarField();

  for (const [x, y, r, a, phase] of stars) {
    const sparkle = 0.72 + (0.28 * Math.sin((tick * 0.035) + phase * 3.2));
    const alpha = a * sparkle;
    const radius = r * Math.max(1.2, width / 1200);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(width * x, height * y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (sparkle > 0.93) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((width * x) - radius * 2.4, height * y);
      ctx.lineTo((width * x) + radius * 2.4, height * y);
      ctx.moveTo(width * x, (height * y) - radius * 2.4);
      ctx.lineTo(width * x, (height * y) + radius * 2.4);
      ctx.stroke();
    }
  }
}

function drawShootingStar(ctx, width, height, tick) {
  const cycle = tick % 1400;
  if (cycle > 140) return;

  const t = cycle / 140;
  const startX = width * 0.18;
  const startY = height * 0.12;
  const endX = width * 0.56;
  const endY = height * 0.24;

  const x = startX + ((endX - startX) * t);
  const y = startY + ((endY - startY) * t);
  const tailX = x - (width * 0.11);
  const tailY = y - (height * 0.03);

  const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.45, "rgba(180,220,255,0.20)");
  gradient.addColorStop(1, "rgba(255,255,255,0.96)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.beginPath();
  ctx.arc(x, y, 2.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(ctx, x, y, radius, fill, glow, width) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.16, x, y, radius * 3.0);
  halo.addColorStop(0, glow);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3.0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.arc(x - (radius * 0.20), y - (radius * 0.18), radius * 0.40, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = Math.max(1, width / 1400);
  ctx.arc(x, y, radius * 1.18, 0, Math.PI * 2);
  ctx.stroke();
}

function drawMoonLightFields(ctx, width, height, moonA, moonB) {
  const glowA = ctx.createRadialGradient(moonA.x, moonA.y, moonA.radius * 0.4, moonA.x, moonA.y, width * 0.36);
  glowA.addColorStop(0, "rgba(255,226,176,0.20)");
  glowA.addColorStop(0.46, "rgba(255,226,176,0.08)");
  glowA.addColorStop(1, "rgba(255,226,176,0)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(moonB.x, moonB.y, moonB.radius * 0.4, moonB.x, moonB.y, width * 0.30);
  glowB.addColorStop(0, "rgba(176,214,255,0.16)");
  glowB.addColorStop(0.46, "rgba(176,214,255,0.06)");
  glowB.addColorStop(1, "rgba(176,214,255,0)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);
}

function drawOrbitingMoons(ctx, width, height, tick, body) {
  const horizon = body.horizonY;
  const primaryCx = width * 0.78;
  const primaryCy = Math.max(height * 0.14, horizon - (height * 0.10));
  const primaryRx = width * 0.07;
  const primaryRy = height * 0.024;

  const secondaryCx = width * 0.63;
  const secondaryCy = Math.max(height * 0.19, horizon - (height * 0.05));
  const secondaryRx = width * 0.06;
  const secondaryRy = height * 0.020;

  const primaryAngle = (tick || 0) * 0.0032 + 0.5;
  const secondaryAngle = (tick || 0) * 0.0024 + 2.3;

  const moonA = {
    x: primaryCx + (Math.cos(primaryAngle) * primaryRx),
    y: primaryCy + (Math.sin(primaryAngle) * primaryRy),
    radius: Math.max(14, width * 0.015)
  };

  const moonB = {
    x: secondaryCx + (Math.cos(secondaryAngle) * secondaryRx),
    y: secondaryCy + (Math.sin(secondaryAngle) * secondaryRy),
    radius: Math.max(9, width * 0.0105)
  };

  drawMoonLightFields(ctx, width, height, moonA, moonB);

  drawMoon(
    ctx,
    moonB.x,
    moonB.y,
    moonB.radius,
    "rgba(190,220,255,0.92)",
    "rgba(128,186,255,0.24)",
    width
  );

  drawMoon(
    ctx,
    moonA.x,
    moonA.y,
    moonA.radius,
    "rgba(255,238,196,0.96)",
    "rgba(255,220,160,0.28)",
    width
  );

  return { moonA, moonB };
}

function drawOceanDepthBands(ctx, body) {
  const left = body.centerX - body.radius;
  const top = body.horizonY;
  const width = body.radius * 2;
  const height = body.radius * 1.34;

  const ocean = ctx.createLinearGradient(0, top, 0, top + height);
  ocean.addColorStop(0.00, "#9ff3ff");
  ocean.addColorStop(0.08, "#7be8fb");
  ocean.addColorStop(0.18, "#55d8f2");
  ocean.addColorStop(0.32, "#31b8e3");
  ocean.addColorStop(0.50, "#1d88c7");
  ocean.addColorStop(0.68, "#0f5e9c");
  ocean.addColorStop(0.84, "#0a3d73");
  ocean.addColorStop(1.00, "#051b43");
  ctx.fillStyle = ocean;
  ctx.fillRect(left, top, width, height);

  const upperBloom = ctx.createLinearGradient(0, top, 0, top + (height * 0.30));
  upperBloom.addColorStop(0, "rgba(255,255,255,0.10)");
  upperBloom.addColorStop(0.55, "rgba(196,244,255,0.06)");
  upperBloom.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = upperBloom;
  ctx.fillRect(left, top, width, height * 0.30);

  const abyssShade = ctx.createLinearGradient(0, top + (height * 0.54), 0, top + height);
  abyssShade.addColorStop(0, "rgba(0,0,0,0)");
  abyssShade.addColorStop(1, "rgba(0,6,24,0.28)");
  ctx.fillStyle = abyssShade;
  ctx.fillRect(left, top + (height * 0.54), width, height * 0.46);
}

function drawCurrentRibbon(ctx, left, right, yBase, amp, tick, alpha, phaseShift, color) {
  ctx.beginPath();

  for (let x = left; x <= right; x += 8) {
    const waveA = Math.sin((x * 0.010) + (tick * 0.020) + phaseShift) * amp;
    const waveB = Math.cos((x * 0.004) - (tick * 0.012) + (phaseShift * 0.6)) * (amp * 0.32);
    const y = yBase + waveA + waveB;

    if (x === left) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = color.replace("{a}", String(alpha));
  ctx.lineWidth = 1.25;
  ctx.stroke();
}

function drawOceanCurrents(ctx, body, tick) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = body.horizonY;
  const bands = [
    { y: top + 28, amp: 3.6, alpha: 0.16, shift: 0.2, color: "rgba(204,250,255,{a})" },
    { y: top + 58, amp: 4.0, alpha: 0.15, shift: 1.1, color: "rgba(160,236,255,{a})" },
    { y: top + 94, amp: 5.0, alpha: 0.13, shift: 2.2, color: "rgba(122,218,255,{a})" },
    { y: top + 136, amp: 6.4, alpha: 0.11, shift: 3.0, color: "rgba(114,208,255,{a})" },
    { y: top + 184, amp: 7.8, alpha: 0.09, shift: 4.1, color: "rgba(90,186,244,{a})" },
    { y: top + 238, amp: 8.8, alpha: 0.08, shift: 5.0, color: "rgba(72,156,226,{a})" }
  ];

  for (const band of bands) {
    drawCurrentRibbon(ctx, left, right, band.y, band.amp, tick, band.alpha, band.shift, band.color);
  }
}

function drawWaveHighlights(ctx, body, tick) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = body.horizonY;

  for (let band = 0; band < 10; band += 1) {
    const yBase = top + (band * 28);

    ctx.beginPath();
    for (let x = left; x <= right; x += 8) {
      const phase = (tick * 0.026) + (band * 0.72) + (x * 0.012);
      const wave = Math.sin(phase) * (2.8 + band * 0.20);
      const drift = Math.cos((tick * 0.014) + (x * 0.005)) * 1.2;
      const y = yBase + wave + drift;

      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.12 - (band * 0.007)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawMoonReflections(ctx, body, moonA, moonB) {
  const top = body.horizonY;
  const height = body.radius * 1.28;

  const reflectA = ctx.createRadialGradient(
    moonA.x,
    top + (height * 0.18),
    6,
    moonA.x,
    top + (height * 0.26),
    body.radius * 0.30
  );
  reflectA.addColorStop(0, "rgba(255,232,186,0.14)");
  reflectA.addColorStop(1, "rgba(255,232,186,0)");
  ctx.fillStyle = reflectA;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);

  const reflectB = ctx.createRadialGradient(
    moonB.x,
    top + (height * 0.24),
    6,
    moonB.x,
    top + (height * 0.32),
    body.radius * 0.22
  );
  reflectB.addColorStop(0, "rgba(188,220,255,0.11)");
  reflectB.addColorStop(1, "rgba(188,220,255,0)");
  ctx.fillStyle = reflectB;
  ctx.fillRect(body.centerX - body.radius, top, body.radius * 2, height);
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
    Math.max(90, projector.radius(240, cy))
  );
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);

  ctx.fillStyle = gradient;
  ctx.fill();

  drawPolygonPath(ctx, polygon, projector);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = projector.lineWidth(1.6, cy);
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
      const moons = drawOrbitingMoons(ctx, width, height, tick, body);

      const atmosphere = ctx.createRadialGradient(
        body.centerX,
        body.horizonY + (body.radius * 0.10),
        body.radius * 0.72,
        body.centerX,
        body.horizonY + (body.radius * 0.10),
        body.radius * 1.04
      );
      atmosphere.addColorStop(0, "rgba(255,255,255,0)");
      atmosphere.addColorStop(0.54, `rgba(132,218,255,${0.22 + (mistAmount * 0.10)})`);
      atmosphere.addColorStop(0.78, `rgba(94,176,255,${0.28 + (mistAmount * 0.10)})`);
      atmosphere.addColorStop(1, "rgba(94,176,255,0)");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(
        body.centerX - (body.radius * 1.16),
        body.horizonY - (body.radius * 0.22),
        body.radius * 2.32,
        body.radius * 1.34
      );

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

      drawMoonReflections(ctx, body, moons.moonA, moons.moonB);
      drawOceanCurrents(ctx, body, tick);
      drawWaveHighlights(ctx, body, tick);

      if (outerOcean) {
        drawShallowShelf(
          ctx,
          outerOcean,
          projector,
          "rgba(86,232,230,0.14)",
          "rgba(86,232,230,0.00)"
        );
      }

      if (harborBasin) {
        drawShallowShelf(
          ctx,
          harborBasin,
          projector,
          "rgba(128,255,236,0.48)",
          "rgba(128,255,236,0.08)"
        );
      }

      ctx.restore();

      const horizonGlow = ctx.createLinearGradient(0, body.horizonY - 14, 0, body.horizonY + (body.radius * 0.18));
      horizonGlow.addColorStop(0, "rgba(255,255,255,0)");
      horizonGlow.addColorStop(0.32, "rgba(246,255,255,0.30)");
      horizonGlow.addColorStop(0.66, "rgba(172,242,255,0.18)");
      horizonGlow.addColorStop(1, "rgba(172,242,255,0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, body.horizonY - 14, width, body.radius * 0.22);

      const veil = ctx.createLinearGradient(0, height * 0.16, 0, height);
      veil.addColorStop(0, "rgba(255,255,255,0.02)");
      veil.addColorStop(0.48, `rgba(228,247,255,${0.05 + (mistAmount * 0.08)})`);
      veil.addColorStop(1, "rgba(196,228,244,0.08)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, width, height);
    }
  };
}
