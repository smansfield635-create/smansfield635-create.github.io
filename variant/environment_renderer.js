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

function hashNoise(a, b, c = 0) {
  const v = Math.sin((a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function createMoonCraterField(seed, count, minSpacing, largeBias = 0.18) {
  const out = [];
  let attempts = 0;

  while (out.length < count && attempts < 1500) {
    attempts += 1;

    const a = hashNoise(seed, attempts, 1) * Math.PI * 2;
    const r = Math.sqrt(hashNoise(seed, attempts, 2)) * 0.78;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;

    let radius = 0.035 + (hashNoise(seed, attempts, 3) * 0.05);
    if (hashNoise(seed, attempts, 4) < largeBias) {
      radius += 0.035 + (hashNoise(seed, attempts, 5) * 0.03);
    }

    let valid = true;
    for (const crater of out) {
      const dx = x - crater.x;
      const dy = y - crater.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));
      if (dist < ((radius + crater.r) * minSpacing)) {
        valid = false;
        break;
      }
    }

    if (valid) out.push({ x, y, r: radius });
  }

  return out;
}

function drawMoonSurface(ctx, x, y, radius, palette, craterSet, noiseSeed) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.18, x, y, radius * 2.8);
  halo.addColorStop(0, palette.haloInner);
  halo.addColorStop(0.42, palette.haloMid);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
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

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();

  for (let i = 0; i < 58; i += 1) {
    const nx = ((hashNoise(noiseSeed, i, 1) * 2) - 1) * radius * 0.88;
    const ny = ((hashNoise(noiseSeed, i, 2) * 2) - 1) * radius * 0.88;
    const d2 = (nx * nx) + (ny * ny);
    if (d2 > radius * radius * 0.76) continue;

    const n = hashNoise(noiseSeed, i, 3);
    const grainR = radius * (0.010 + (n * 0.022));
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
    bowl.addColorStop(0.52, palette.craterFloorMid);
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

  ctx.restore();

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
  return createMoonCraterField(101, 10, 2.25, 0.22);
}

function getSouthMoonCraters() {
  return createMoonCraterField(202, 7, 2.15, 0.20);
}

function drawMoons(ctx, width, height, tick, body) {
  const northRadius = body.radius * 0.20;
  const southRadius = body.radius * 0.10;

  const northBaseX = body.centerX + (body.radius * 0.04);
  const northBaseY = body.centerY - (body.radius * 0.42);
  const southBaseX = body.centerX - (body.radius * 0.24);
  const southBaseY = body.centerY - (body.radius * 0.18);

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
      craterShadow: "rgba(120,142,176,0.24)",
      craterFloorLight: "rgba(224,236,255,0.16)",
      craterFloorMid: "rgba(172,194,228,0.12)",
      craterFloorDark: "rgba(112,136,172,0.20)",
      craterRim: "rgba(244,248,255,0.13)",
      shadowEdge: "rgba(84,104,140,0.18)",
      rim: "rgba(188,220,255,0.18)",
      haloInner: "rgba(188,220,255,0.14)",
      haloMid: "rgba(188,220,255,0.05)",
      noiseLight: "rgba(230,238,255,0.05)",
      noiseDark: "rgba(112,136,172,0.04)"
    },
    getSouthMoonCraters(),
    401
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
      craterShadow: "rgba(186,144,88,0.22)",
      craterFloorLight: "rgba(255,244,220,0.14)",
      craterFloorMid: "rgba(232,196,138,0.10)",
      craterFloorDark: "rgba(176,128,82,0.16)",
      craterRim: "rgba(255,244,212,0.11)",
      shadowEdge: "rgba(138,92,48,0.16)",
      rim: "rgba(255,224,168,0.14)",
      haloInner: "rgba(255,224,168,0.12)",
      haloMid: "rgba(255,224,168,0.04)",
      noiseLight: "rgba(255,242,206,0.05)",
      noiseDark: "rgba(176,128,82,0.04)"
    },
    getNorthMoonCraters(),
    402
  );

  return { moonNorth, moonSouth };
}

function drawOceanBody(ctx, body) {
  const base = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.18),
    body.centerY - (body.radius * 0.26),
    body.radius * 0.08,
    body.centerX,
    body.centerY + (body.radius * 0.12),
    body.radius * 1.05
  );
  base.addColorStop(0.00, "#2fd3ff");
  base.addColorStop(0.10, "#118dff");
  base.addColorStop(0.26, "#1748d8");
  base.addColorStop(0.52, "#12268c");
  base.addColorStop(0.80, "#090f4f");
  base.addColorStop(1.00, "#040723");

  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const abyss = ctx.createRadialGradient(
    body.centerX,
    body.centerY + (body.radius * 0.26),
    body.radius * 0.14,
    body.centerX,
    body.centerY + (body.radius * 0.42),
    body.radius * 1.12
  );
  abyss.addColorStop(0.00, "rgba(0,0,0,0)");
  abyss.addColorStop(0.55, "rgba(0,0,20,0.12)");
  abyss.addColorStop(1.00, "rgba(0,0,36,0.34)");

  ctx.fillStyle = abyss;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawDeepCurrents(ctx, body, tick) {
  const left = body.centerX - (body.radius * 0.92);
  const right = body.centerX + (body.radius * 0.92);
  const top = body.centerY - (body.radius * 0.70);
  const bottom = body.centerY + (body.radius * 0.70);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let band = 0; band < 12; band += 1) {
    const yBase = top + ((bottom - top) * (band / 11));
    const amp = 2.0 + (band * 0.42);
    const alpha = 0.06 - (band * 0.003);

    ctx.beginPath();
    for (let x = left; x <= right; x += 7) {
      const nx = (x - left) / Math.max(1, right - left);
      const wave1 = Math.sin((nx * 19.0) + (tick * 0.0016) + (band * 0.42)) * amp;
      const wave2 = Math.cos((nx * 9.0) - (tick * 0.0011) + (band * 0.68)) * (amp * 0.52);
      const y = yBase + wave1 + wave2;
      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(122,182,255,${Math.max(0.014, alpha)})`;
    ctx.lineWidth = 0.9 + (band * 0.04);
    ctx.stroke();
  }

  ctx.restore();
}

function drawWaveField(ctx, body, tick) {
  const left = body.centerX - (body.radius * 0.94);
  const right = body.centerX + (body.radius * 0.94);
  const top = body.centerY - (body.radius * 0.74);
  const bottom = body.centerY + (body.radius * 0.74);

  for (let band = 0; band < 14; band += 1) {
    const t = band / 13;
    const yBase = top + ((bottom - top) * t);
    const amp = 1.8 + (t * 6.2);
    const alpha = 0.12 - (t * 0.08);

    ctx.beginPath();
    for (let x = left; x <= right; x += 6) {
      const nx = (x - left) / Math.max(1, right - left);
      const waveA = Math.sin((nx * 24.0) + (tick * 0.0022) + (band * 0.36)) * amp;
      const waveB = Math.cos((nx * 11.0) - (tick * 0.0017) + (band * 0.58)) * (amp * 0.48);
      const waveC = Math.sin((nx * 42.0) + (tick * 0.0030)) * (amp * 0.12);
      const y = yBase + waveA + waveB + waveC;
      if (x === left) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(214,246,255,${Math.max(0.01, alpha)})`;
    ctx.lineWidth = 0.85 + (t * 0.65);
    ctx.stroke();
  }
}

function drawSubsurfaceRipples(ctx, body, tick) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 38; i += 1) {
    const u = hashNoise(700, i, 1);
    const v = hashNoise(700, i, 2);
    const px = body.centerX + ((u * 2) - 1) * body.radius * 0.86;
    const py = body.centerY + (((v * 2) - 1) * body.radius * 0.76);
    const rx = body.radius * (0.025 + (hashNoise(700, i, 3) * 0.055));
    const ry = body.radius * (0.006 + (hashNoise(700, i, 4) * 0.015));
    const rot = ((hashNoise(700, i, 5) - 0.5) * 1.4) + (Math.sin((tick * 0.0005) + i) * 0.08);

    const g = ctx.createRadialGradient(px, py, 2, px, py, rx);
    g.addColorStop(0, "rgba(126,222,255,0.08)");
    g.addColorStop(0.55, "rgba(72,148,255,0.04)");
    g.addColorStop(1, "rgba(72,148,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawSpecularSweep(ctx, body, tick) {
  const phase = ((tick % 1600) / 1600);
  const centerX = body.centerX - (body.radius * 0.28) + (phase * body.radius * 0.50);
  const centerY = body.centerY + (body.radius * 0.02);

  const glow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, body.radius * 0.32);
  glow.addColorStop(0, "rgba(255,255,255,0.09)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.05)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.34, body.radius * 0.10, -0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoonReflections(ctx, body, moonNorth, moonSouth) {
  const northReflect = ctx.createRadialGradient(
    moonNorth.x,
    body.centerY + (body.radius * 0.06),
    6,
    moonNorth.x,
    body.centerY + (body.radius * 0.10),
    body.radius * 0.26
  );
  northReflect.addColorStop(0, "rgba(255,232,186,0.12)");
  northReflect.addColorStop(0.36, "rgba(255,232,186,0.05)");
  northReflect.addColorStop(1, "rgba(255,232,186,0)");
  ctx.fillStyle = northReflect;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const southReflect = ctx.createRadialGradient(
    moonSouth.x,
    body.centerY + (body.radius * 0.12),
    6,
    moonSouth.x,
    body.centerY + (body.radius * 0.18),
    body.radius * 0.18
  );
  southReflect.addColorStop(0, "rgba(188,220,255,0.08)");
  southReflect.addColorStop(0.36, "rgba(188,220,255,0.03)");
  southReflect.addColorStop(1, "rgba(188,220,255,0)");
  ctx.fillStyle = southReflect;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();
}

export function createEnvironmentRenderer() {
  return {
    draw(ctx, snapshot, projector) {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const tick = snapshot.tick ?? 0;
      const body = projector.getBody();
      const camera = projector.getCameraState?.() ?? { azimuth: 0, latitudeTilt: 0 };

      ctx.fillStyle = "#02050d";
      ctx.fillRect(0, 0, width, height);

      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      const moons = drawMoons(ctx, width, height, tick, body);

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawOceanBody(ctx, body);
      drawDeepCurrents(ctx, body, tick);
      drawWaveField(ctx, body, tick);
      drawSubsurfaceRipples(ctx, body, tick);

      const globeShadow = ctx.createRadialGradient(
        body.centerX + (Math.sin(camera.azimuth) * body.radius * 0.12),
        body.centerY - (body.radius * 0.18) + (camera.latitudeTilt * body.radius * 0.08),
        body.radius * 0.12,
        body.centerX,
        body.centerY,
        body.radius * 1.05
      );
      globeShadow.addColorStop(0, "rgba(255,255,255,0.06)");
      globeShadow.addColorStop(0.34, "rgba(164,232,255,0.04)");
      globeShadow.addColorStop(0.70, "rgba(24,90,144,0.08)");
      globeShadow.addColorStop(1, "rgba(4,22,48,0.18)");
      ctx.fillStyle = globeShadow;
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
      ctx.fill();

      drawMoonReflections(ctx, body, moons.moonNorth, moons.moonSouth);
      drawSpecularSweep(ctx, body, tick);

      ctx.restore();
    }
  };
}
