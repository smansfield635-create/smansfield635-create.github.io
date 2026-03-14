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
    [0.08, 0.09, 1.0, 0.58],
    [0.14, 0.16, 0.9, 0.42],
    [0.23, 0.07, 1.2, 0.54],
    [0.31, 0.14, 0.8, 0.40],
    [0.42, 0.08, 1.0, 0.50],
    [0.53, 0.12, 1.1, 0.46],
    [0.68, 0.08, 1.2, 0.56],
    [0.79, 0.14, 0.9, 0.44],
    [0.87, 0.06, 1.0, 0.52],
    [0.91, 0.18, 0.8, 0.40],
    [0.18, 0.23, 0.9, 0.34],
    [0.36, 0.20, 0.8, 0.28],
    [0.58, 0.22, 0.9, 0.34],
    [0.74, 0.24, 0.8, 0.30]
  ];
}

function drawStars(ctx, width, height, tick) {
  const stars = createStarField();
  for (const [x, y, r, a] of stars) {
    const pulse = 0.82 + (0.18 * Math.sin((tick * 0.012) + (x * 10)));
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${a * pulse})`;
    ctx.arc(width * x, height * y, r * Math.max(1.15, width / 1100), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMoon(ctx, x, y, radius, fill, glow, width) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.2);
  halo.addColorStop(0, glow);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.arc(x - (radius * 0.22), y - (radius * 0.18), radius * 0.44, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = Math.max(1, width / 1200);
  ctx.arc(x, y, radius * 1.18, 0, Math.PI * 2);
  ctx.stroke();
}

function drawOrbitingMoons(ctx, width, height, tick) {
  const northAngle = (tick || 0) * 0.0038;
  const southAngle = (tick || 0) * 0.0029 + 2.1;

  const northCx = width * 0.76;
  const northCy = height * 0.13;
  const northRx = width * 0.08;
  const northRy = height * 0.035;

  const southCx = width * 0.63;
  const southCy = height * 0.24;
  const southRx = width * 0.10;
  const southRy = height * 0.045;

  ctx.beginPath();
  ctx.strokeStyle = "rgba(180,220,255,0.16)";
  ctx.lineWidth = Math.max(1, width / 1600);
  ctx.ellipse(northCx, northCy, northRx, northRy, -0.16, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(148,188,255,0.12)";
  ctx.lineWidth = Math.max(1, width / 1800);
  ctx.ellipse(southCx, southCy, southRx, southRy, 0.12, 0, Math.PI * 2);
  ctx.stroke();

  const northX = northCx + (Math.cos(northAngle) * northRx);
  const northY = northCy + (Math.sin(northAngle) * northRy);
  const southX = southCx + (Math.cos(southAngle) * southRx);
  const southY = southCy + (Math.sin(southAngle) * southRy);

  drawMoon(
    ctx,
    southX,
    southY,
    Math.max(8, width * 0.010),
    "rgba(168,206,255,0.88)",
    "rgba(128,186,255,0.22)",
    width
  );

  drawMoon(
    ctx,
    northX,
    northY,
    Math.max(12, width * 0.014),
    "rgba(255,242,208,0.94)",
    "rgba(255,224,176,0.22)",
    width
  );
}

function drawOceanWaveBands(ctx, body, tick) {
  const left = body.centerX - body.radius;
  const right = body.centerX + body.radius;
  const top = body.horizonY;
  const bottom = body.centerY + (body.radius * 0.70);

  for (let band = 0; band < 9; band += 1) {
    const yBase = top + (band * 28);
    ctx.beginPath();

    for (let x = left; x <= right; x += 8) {
      const phase = (tick * 0.026) + (band * 0.72) + (x * 0.012);
      const wave = Math.sin(phase) * (2.8 + band * 0.18);
      const drift = Math.cos((tick * 0.014) + (x * 0.005)) * 1.2;
      const y = yBase + wave + drift;

      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.10 - (band * 0.007)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const lowerGlow = ctx.createLinearGradient(0, top, 0, bottom);
  lowerGlow.addColorStop(0, "rgba(255,255,255,0)");
  lowerGlow.addColorStop(0.36, "rgba(120,244,255,0.06)");
  lowerGlow.addColorStop(1, "rgba(0,44,84,0.12)");
  ctx.fillStyle = lowerGlow;
  ctx.fillRect(left, top, body.radius * 2, bottom - top);
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
      sky.addColorStop(0.16, "#0b1730");
      sky.addColorStop(0.36, "#173864");
      sky.addColorStop(0.66, "#3f82b8");
      sky.addColorStop(1, "#d4f1ff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      drawStars(ctx, width, height, tick);
      drawOrbitingMoons(ctx, width, height, tick);

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

      const globeOcean = ctx.createLinearGradient(0, body.horizonY, 0, body.centerY + body.radius);
      globeOcean.addColorStop(0, "#8be4ff");
      globeOcean.addColorStop(0.18, "#5ac7f2");
      globeOcean.addColorStop(0.42, "#2e95d2");
      globeOcean.addColorStop(0.72, "#115c97");
      globeOcean.addColorStop(1, "#082d56");
      ctx.fillStyle = globeOcean;
      ctx.fillRect(body.centerX - body.radius, body.horizonY, body.radius * 2, body.radius * 1.28);

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

      drawOceanWaveBands(ctx, body, tick);

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
