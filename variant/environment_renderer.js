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

  drawStarLayer(ctx, width, height, tick, layers.far, Math.sin(tick * 0.00008) * 3, Math.cos(tick * 0.00006) * 2);
  drawStarLayer(ctx, width, height, tick, layers.mid, Math.sin(tick * 0.00014) * 6, Math.cos(tick * 0.00010) * 4);
  drawStarLayer(ctx, width, height, tick, layers.near, Math.sin(tick * 0.00022) * 10, Math.cos(tick * 0.00016) * 7);
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

function drawMoon(ctx, x, y, radius, palette) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.14, x, y, radius * 2.2);
  halo.addColorStop(0, palette.haloInner);
  halo.addColorStop(0.38, palette.haloMid);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(x - (radius * 0.24), y - (radius * 0.28), radius * 0.08, x, y, radius);
  body.addColorStop(0, palette.light);
  body.addColorStop(0.52, palette.mid);
  body.addColorStop(1, palette.dark);

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoons(ctx, width, height, body, tick) {
  const northRadius = body.radius * 0.15;
  const southRadius = body.radius * 0.08;

  const northX = body.centerX + (body.radius * 0.02) + (Math.cos(tick * 0.0010) * body.radius * 0.018);
  const northY = body.centerY - (body.radius * 1.00) + (Math.sin(tick * 0.0010) * body.radius * 0.008);

  const southX = body.centerX - (body.radius * 0.34) + (Math.cos(tick * 0.0013) * body.radius * 0.014);
  const southY = body.centerY - (body.radius * 0.86) + (Math.sin(tick * 0.0013) * body.radius * 0.006);

  drawMoon(ctx, southX, southY, southRadius, {
    light: "rgba(228,238,255,0.96)",
    mid: "rgba(198,214,242,0.96)",
    dark: "rgba(152,174,208,0.98)",
    haloInner: "rgba(188,220,255,0.14)",
    haloMid: "rgba(188,220,255,0.05)"
  });

  drawMoon(ctx, northX, northY, northRadius, {
    light: "rgba(255,246,220,0.98)",
    mid: "rgba(246,216,156,0.98)",
    dark: "rgba(214,168,106,0.98)",
    haloInner: "rgba(255,224,168,0.12)",
    haloMid: "rgba(255,224,168,0.04)"
  });

  return {
    moonNorth: { x: northX, y: northY, radius: northRadius },
    moonSouth: { x: southX, y: southY, radius: southRadius }
  };
}

function clipGlobe(ctx, body) {
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
}

function drawGlobeWater(ctx, body, tick) {
  const ocean = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.24),
    body.centerY - (body.radius * 0.32),
    body.radius * 0.12,
    body.centerX,
    body.centerY + (body.radius * 0.26),
    body.radius * 1.04
  );
  ocean.addColorStop(0.00, "#d2fff6");
  ocean.addColorStop(0.12, "#84fff4");
  ocean.addColorStop(0.28, "#20d8ff");
  ocean.addColorStop(0.52, "#0c78ff");
  ocean.addColorStop(0.78, "#173cb7");
  ocean.addColorStop(1.00, "#09124f");
  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const topLight = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.18),
    body.centerY - (body.radius * 0.54),
    body.radius * 0.08,
    body.centerX - (body.radius * 0.10),
    body.centerY - (body.radius * 0.16),
    body.radius * 0.68
  );
  topLight.addColorStop(0, "rgba(255,255,255,0.20)");
  topLight.addColorStop(0.40, "rgba(194,255,248,0.08)");
  topLight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = topLight;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const abyss = ctx.createLinearGradient(0, body.centerY, 0, body.centerY + body.radius);
  abyss.addColorStop(0, "rgba(0,0,0,0)");
  abyss.addColorStop(1, "rgba(0,0,24,0.20)");
  ctx.fillStyle = abyss;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  for (let band = 0; band < 12; band += 1) {
    const yBase = body.centerY - (body.radius * 0.18) + (band * body.radius * 0.06);

    ctx.beginPath();
    for (let x = body.centerX - body.radius; x <= body.centerX + body.radius; x += 8) {
      const phase = (tick * 0.024) + (band * 0.76) + (x * 0.012);
      const wave = Math.sin(phase) * (2.0 + band * 0.15);
      const drift = Math.cos((tick * 0.012) + (x * 0.005)) * 1.0;
      const y = yBase + wave + drift;

      if (x === body.centerX - body.radius) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.11 - (band * 0.006)})`;
    ctx.lineWidth = band < 4 ? 1.0 : 0.9;
    ctx.stroke();
  }

  const phase = ((tick % 1200) / 1200);
  const centerX = body.centerX - (body.radius * 0.30) + (phase * body.radius * 0.58);
  const centerY = body.centerY + (body.radius * 0.12);
  const glow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, body.radius * 0.34);
  glow.addColorStop(0, "rgba(255,255,255,0.10)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.05)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.34, body.radius * 0.10, -0.10, 0, Math.PI * 2);
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
  ctx.lineWidth = projector.lineWidth(1.4);
  ctx.stroke();
}

function drawAtmosphereShell(ctx, body, mistAmount) {
  const atmosphereShell = ctx.createRadialGradient(
    body.centerX,
    body.centerY,
    body.radius * 0.96,
    body.centerX,
    body.centerY,
    body.radius * 1.12
  );
  atmosphereShell.addColorStop(0, "rgba(255,255,255,0)");
  atmosphereShell.addColorStop(0.70, `rgba(132,218,255,${0.14 + (mistAmount * 0.03)})`);
  atmosphereShell.addColorStop(0.90, `rgba(94,176,255,${0.16 + (mistAmount * 0.03)})`);
  atmosphereShell.addColorStop(1, "rgba(94,176,255,0)");
  ctx.fillStyle = atmosphereShell;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.16, 0, Math.PI * 2);
  ctx.fill();
}

function drawLimbGlow(ctx, body) {
  const limbGlow = ctx.createRadialGradient(
    body.centerX,
    body.centerY,
    body.radius * 0.88,
    body.centerX,
    body.centerY,
    body.radius * 1.04
  );
  limbGlow.addColorStop(0, "rgba(255,255,255,0)");
  limbGlow.addColorStop(0.82, "rgba(250,255,255,0.10)");
  limbGlow.addColorStop(0.94, "rgba(168,242,255,0.12)");
  limbGlow.addColorStop(1, "rgba(168,242,255,0)");
  ctx.fillStyle = limbGlow;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.06, 0, Math.PI * 2);
  ctx.fill();
}

function drawNebulaBand(ctx, width, height, body) {
  const band = ctx.createRadialGradient(
    body.centerX,
    body.centerY - (body.radius * 0.78),
    body.radius * 0.10,
    body.centerX,
    body.centerY - (body.radius * 0.78),
    body.radius * 1.26
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

      drawNebulaBand(ctx, width, height, body);
      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      drawMoons(ctx, width, height, body, tick);

      ctx.save();
      clipGlobe(ctx, body);
      drawGlobeWater(ctx, body, tick);

      if (outerOcean) {
        drawShallowShelf(ctx, outerOcean, projector, "rgba(96,240,236,0.10)", "rgba(96,240,236,0.00)");
      }

      if (harborBasin) {
        drawShallowShelf(ctx, harborBasin, projector, "rgba(148,255,240,0.28)", "rgba(148,255,240,0.04)");
      }

      ctx.restore();

      drawAtmosphereShell(ctx, body, mistAmount);
      drawLimbGlow(ctx, body);
    }
  };
}
