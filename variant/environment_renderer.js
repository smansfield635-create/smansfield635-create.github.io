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
  const halo = ctx.createRadialGradient(x, y, radius * 0.14, x, y, radius * 2.0);
  halo.addColorStop(0, palette.haloInner);
  halo.addColorStop(0.38, palette.haloMid);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.0, 0, Math.PI * 2);
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
}

function drawMoons(ctx, body, tick) {
  const northRadius = body.radius * 0.16;
  const southRadius = body.radius * 0.08;

  const northX = body.centerX + (body.radius * 0.08) + (Math.cos(tick * 0.0010) * body.radius * 0.014);
  const northY = body.centerY - (body.radius * 1.14) + (Math.sin(tick * 0.0010) * body.radius * 0.008);

  const southX = body.centerX - (body.radius * 0.30) + (Math.cos(tick * 0.0013) * body.radius * 0.010);
  const southY = body.centerY - (body.radius * 1.00) + (Math.sin(tick * 0.0013) * body.radius * 0.006);

  drawMoon(ctx, southX, southY, southRadius, {
    light: "rgba(228,238,255,0.96)",
    mid: "rgba(198,214,242,0.96)",
    dark: "rgba(152,174,208,0.98)",
    haloInner: "rgba(188,220,255,0.12)",
    haloMid: "rgba(188,220,255,0.04)"
  });

  drawMoon(ctx, northX, northY, northRadius, {
    light: "rgba(255,246,220,0.98)",
    mid: "rgba(246,216,156,0.98)",
    dark: "rgba(214,168,106,0.98)",
    haloInner: "rgba(255,224,168,0.10)",
    haloMid: "rgba(255,224,168,0.03)"
  });
}

function clipGlobe(ctx, body) {
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
}

function drawGlobeWater(ctx, body, tick) {
  const ocean = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.22),
    body.centerY - (body.radius * 0.28),
    body.radius * 0.10,
    body.centerX,
    body.centerY + (body.radius * 0.26),
    body.radius * 1.04
  );
  ocean.addColorStop(0.00, "#bff9f4");
  ocean.addColorStop(0.16, "#54f0f2");
  ocean.addColorStop(0.34, "#1cc2ff");
  ocean.addColorStop(0.60, "#125cff");
  ocean.addColorStop(0.82, "#14339a");
  ocean.addColorStop(1.00, "#08153f");
  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const shallowLight = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.12),
    body.centerY - (body.radius * 0.24),
    body.radius * 0.08,
    body.centerX - (body.radius * 0.02),
    body.centerY - (body.radius * 0.10),
    body.radius * 0.62
  );
  shallowLight.addColorStop(0, "rgba(255,255,255,0.10)");
  shallowLight.addColorStop(0.40, "rgba(178,255,242,0.05)");
  shallowLight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shallowLight;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const deepShade = ctx.createRadialGradient(
    body.centerX,
    body.centerY + (body.radius * 0.48),
    body.radius * 0.10,
    body.centerX,
    body.centerY,
    body.radius * 1.06
  );
  deepShade.addColorStop(0, "rgba(0,0,18,0.18)");
  deepShade.addColorStop(1, "rgba(0,0,18,0)");
  ctx.fillStyle = deepShade;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  for (let band = 0; band < 10; band += 1) {
    const yBase = body.centerY - (body.radius * 0.14) + (band * body.radius * 0.05);

    ctx.beginPath();
    for (let x = body.centerX - body.radius; x <= body.centerX + body.radius; x += 8) {
      const phase = (tick * 0.024) + (band * 0.76) + (x * 0.012);
      const wave = Math.sin(phase) * (1.5 + (band * 0.10));
      const drift = Math.cos((tick * 0.012) + (x * 0.005)) * 0.7;
      const y = yBase + wave + drift;

      if (x === body.centerX - body.radius) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${0.07 - (band * 0.004)})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function drawAtmosphereShell(ctx, body, mistAmount) {
  const shell = ctx.createRadialGradient(
    body.centerX,
    body.centerY,
    body.radius * 0.96,
    body.centerX,
    body.centerY,
    body.radius * 1.14
  );
  shell.addColorStop(0, "rgba(255,255,255,0)");
  shell.addColorStop(0.82, `rgba(120,214,255,${0.08 + (mistAmount * 0.01)})`);
  shell.addColorStop(0.94, `rgba(96,180,255,${0.10 + (mistAmount * 0.01)})`);
  shell.addColorStop(1, "rgba(96,180,255,0)");
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius * 1.16, 0, Math.PI * 2);
  ctx.fill();
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

      const space = ctx.createLinearGradient(0, 0, 0, height);
      space.addColorStop(0, "#02040a");
      space.addColorStop(0.36, "#06122a");
      space.addColorStop(0.68, "#0a2147");
      space.addColorStop(1, "#0d2748");
      ctx.fillStyle = space;
      ctx.fillRect(0, 0, width, height);

      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      drawMoons(ctx, body, tick);

      ctx.save();
      clipGlobe(ctx, body);
      drawGlobeWater(ctx, body, tick);
      ctx.restore();

      drawAtmosphereShell(ctx, body, mistAmount);
    }
  };
}
