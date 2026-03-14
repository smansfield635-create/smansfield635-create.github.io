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
  const cycle = tick % 2200;
  if (cycle > 130) return;

  const t = cycle / 130;
  const startX = width * 0.12;
  const startY = height * 0.14;
  const endX = width * 0.44;
  const endY = height * 0.25;

  const x = startX + ((endX - startX) * t);
  const y = startY + ((endY - startY) * t);
  const tailX = x - (width * 0.10);
  const tailY = y - (height * 0.028);

  const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.42, "rgba(180,220,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0.98)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
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

  for (let i = 0; i < 48; i += 1) {
    const nx = ((hashNoise(noiseSeed, i, 1) * 2) - 1) * radius * 0.88;
    const ny = ((hashNoise(noiseSeed, i, 2) * 2) - 1) * radius * 0.88;
    const d2 = (nx * nx) + (ny * ny);
    if (d2 > radius * radius * 0.76) continue;

    const n = hashNoise(noiseSeed, i, 3);
    const grainR = radius * (0.010 + (n * 0.020));
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
  }

  ctx.restore();
}

function drawMoons(ctx, width, height, tick, galaxy) {
  const northRadius = galaxy.radius * 0.18;
  const southRadius = galaxy.radius * 0.09;

  const moonNorth = {
    x: galaxy.centerX + (galaxy.radius * 0.30) + (Math.cos((tick * 0.0010) + 0.18) * galaxy.radius * 0.018),
    y: galaxy.centerY - (galaxy.radius * 0.34) + (Math.sin((tick * 0.0010) + 0.18) * galaxy.radius * 0.008),
    radius: northRadius
  };

  const moonSouth = {
    x: galaxy.centerX - (galaxy.radius * 0.28) + (Math.cos((tick * 0.0014) + 1.7) * galaxy.radius * 0.014),
    y: galaxy.centerY - (galaxy.radius * 0.10) + (Math.sin((tick * 0.0014) + 1.7) * galaxy.radius * 0.006),
    radius: southRadius
  };

  const northGlow = ctx.createRadialGradient(
    moonNorth.x, moonNorth.y, moonNorth.radius * 0.4,
    moonNorth.x, moonNorth.y, width * 0.28
  );
  northGlow.addColorStop(0, "rgba(255,228,182,0.12)");
  northGlow.addColorStop(0.38, "rgba(255,228,182,0.04)");
  northGlow.addColorStop(1, "rgba(255,228,182,0)");
  ctx.fillStyle = northGlow;
  ctx.fillRect(0, 0, width, height);

  const southGlow = ctx.createRadialGradient(
    moonSouth.x, moonSouth.y, moonSouth.radius * 0.4,
    moonSouth.x, moonSouth.y, width * 0.18
  );
  southGlow.addColorStop(0, "rgba(176,214,255,0.08)");
  southGlow.addColorStop(0.38, "rgba(176,214,255,0.03)");
  southGlow.addColorStop(1, "rgba(176,214,255,0)");
  ctx.fillStyle = southGlow;
  ctx.fillRect(0, 0, width, height);

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
      craterFloorMid: "rgba(172,194,228,0.10)",
      craterFloorDark: "rgba(112,136,172,0.18)",
      haloInner: "rgba(188,220,255,0.14)",
      haloMid: "rgba(188,220,255,0.05)",
      noiseLight: "rgba(230,238,255,0.04)",
      noiseDark: "rgba(112,136,172,0.03)"
    },
    createMoonCraterField(202, 7, 2.15, 0.20),
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
      craterShadow: "rgba(186,144,88,0.20)",
      craterFloorLight: "rgba(255,244,220,0.12)",
      craterFloorMid: "rgba(232,196,138,0.09)",
      craterFloorDark: "rgba(176,128,82,0.14)",
      haloInner: "rgba(255,224,168,0.12)",
      haloMid: "rgba(255,224,168,0.04)",
      noiseLight: "rgba(255,242,206,0.04)",
      noiseDark: "rgba(176,128,82,0.03)"
    },
    createMoonCraterField(101, 10, 2.25, 0.22),
    402
  );
}

function drawGalaxyField(ctx, galaxy, tick, camera) {
  const yaw = camera.azimuth || 0;
  const tilt = camera.latitudeTilt || 0;

  const envelope = ctx.createRadialGradient(
    galaxy.centerX + (Math.sin(yaw) * galaxy.radius * 0.08),
    galaxy.centerY - (galaxy.radius * 0.14) + (tilt * galaxy.radius * 0.06),
    galaxy.radius * 0.10,
    galaxy.centerX,
    galaxy.centerY,
    galaxy.radius * 1.04
  );
  envelope.addColorStop(0.00, "rgba(88,244,255,0.22)");
  envelope.addColorStop(0.18, "rgba(54,188,255,0.18)");
  envelope.addColorStop(0.44, "rgba(42,98,220,0.18)");
  envelope.addColorStop(0.74, "rgba(20,36,108,0.14)");
  envelope.addColorStop(1.00, "rgba(4,10,32,0.04)");
  ctx.fillStyle = envelope;
  ctx.beginPath();
  ctx.arc(galaxy.centerX, galaxy.centerY, galaxy.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(galaxy.centerX, galaxy.centerY, galaxy.radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";

  for (let ring = 0; ring < 6; ring += 1) {
    const ringRadius = galaxy.radius * (0.20 + (ring * 0.11));
    const lineWidth = galaxy.radius * (0.028 - (ring * 0.0028));
    const alpha = 0.13 - (ring * 0.016);

    ctx.beginPath();
    for (let step = 0; step <= 120; step += 1) {
      const t = step / 120;
      const angle = (t * Math.PI * 2) + (yaw * (0.9 + ring * 0.10)) + (tick * 0.00042 * (1 + ring * 0.08));
      const swirl = Math.sin((angle * 3.2) + (tick * 0.0010) + ring) * galaxy.radius * (0.032 + ring * 0.003);
      const pulse = Math.cos((angle * 1.8) - (tick * 0.0007) + ring) * galaxy.radius * 0.012;
      const rx = ringRadius + swirl + pulse;

      const x = galaxy.centerX + (Math.cos(angle) * rx);
      const y = galaxy.centerY + (Math.sin(angle) * rx * (0.62 + (tilt * 0.08)));

      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(180,246,255,${Math.max(0.025, alpha)})`;
    ctx.lineWidth = Math.max(1.2, lineWidth);
    ctx.stroke();
  }

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + (yaw * 0.7) + (tick * 0.00018);
    const orbit = galaxy.radius * (0.18 + (i * 0.08));
    const px = galaxy.centerX + (Math.cos(angle) * orbit);
    const py = galaxy.centerY + (Math.sin(angle) * orbit * (0.54 + (tilt * 0.08)));
    const rx = galaxy.radius * (0.20 + (i * 0.016));
    const ry = galaxy.radius * (0.06 + (i * 0.006));

    const g = ctx.createRadialGradient(px, py, 4, px, py, rx);
    g.addColorStop(0, "rgba(114,230,255,0.10)");
    g.addColorStop(0.50, "rgba(84,194,255,0.05)");
    g.addColorStop(1, "rgba(84,194,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, angle * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  const rim = ctx.createRadialGradient(
    galaxy.centerX,
    galaxy.centerY,
    galaxy.radius * 0.82,
    galaxy.centerX,
    galaxy.centerY,
    galaxy.radius * 1.14
  );
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(0.84, "rgba(126,218,255,0.14)");
  rim.addColorStop(1, "rgba(126,218,255,0)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(galaxy.centerX, galaxy.centerY, galaxy.radius * 1.14, 0, Math.PI * 2);
  ctx.fill();
}

function drawEarthEntry(ctx, earthNode, tick) {
  const halo = ctx.createRadialGradient(
    earthNode.x,
    earthNode.y,
    earthNode.radius * 0.20,
    earthNode.x,
    earthNode.y,
    earthNode.radius * 3.0
  );
  halo.addColorStop(0, "rgba(128,232,255,0.24)");
  halo.addColorStop(0.42, "rgba(74,178,255,0.12)");
  halo.addColorStop(1, "rgba(74,178,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(earthNode.x, earthNode.y, earthNode.radius * 3.0, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(
    earthNode.x - (earthNode.radius * 0.20),
    earthNode.y - (earthNode.radius * 0.24),
    earthNode.radius * 0.08,
    earthNode.x,
    earthNode.y,
    earthNode.radius
  );
  body.addColorStop(0, "#76f0ff");
  body.addColorStop(0.18, "#2ab2ff");
  body.addColorStop(0.48, "#1856d6");
  body.addColorStop(0.82, "#0b1d5c");
  body.addColorStop(1, "#040820");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(earthNode.x, earthNode.y, earthNode.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(earthNode.x, earthNode.y, earthNode.radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalCompositeOperation = "screen";
  for (let ring = 0; ring < 3; ring += 1) {
    const ringRadius = earthNode.radius * (0.34 + (ring * 0.16));
    ctx.beginPath();
    for (let step = 0; step <= 48; step += 1) {
      const t = step / 48;
      const angle = (t * Math.PI * 2) + (tick * 0.0007 * (1 + ring * 0.08));
      const swell = Math.sin((angle * 2.8) + tick * 0.0010 + ring) * earthNode.radius * 0.04;
      const x = earthNode.x + (Math.cos(angle) * (ringRadius + swell));
      const y = earthNode.y + (Math.sin(angle) * (ringRadius + swell) * 0.60);
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(206,248,255,${0.12 - (ring * 0.02)})`;
    ctx.lineWidth = Math.max(1, earthNode.radius * (0.10 - (ring * 0.016)));
    ctx.stroke();
  }
  ctx.restore();

  const pulse = 1 + (Math.sin(tick * 0.0034) * 0.04);
  ctx.strokeStyle = "rgba(214,250,255,0.48)";
  ctx.lineWidth = Math.max(1.2, earthNode.radius * 0.09);
  ctx.beginPath();
  ctx.arc(earthNode.x, earthNode.y, earthNode.radius * 1.18 * pulse, 0, Math.PI * 2);
  ctx.stroke();
}

export function createGalaxyEngine({ getEarthNode }) {
  return Object.freeze({
    draw(ctx, snapshot, projector, helpers = {}) {
      const width = helpers.width ?? ctx.canvas.width;
      const height = helpers.height ?? ctx.canvas.height;
      const tick = helpers.tick ?? snapshot.tick ?? 0;
      const body = projector.getBody();
      const camera = projector.getCameraState?.() ?? { azimuth: 0, latitudeTilt: 0 };

      const galaxy = {
        centerX: body.centerX,
        centerY: body.centerY,
        radius: body.radius
      };

      drawStars(ctx, width, height, tick);
      drawShootingStar(ctx, width, height, tick);
      drawMoons(ctx, width, height, tick, galaxy);
      drawGalaxyField(ctx, galaxy, tick, camera);

      const earthNode = getEarthNode();
      drawEarthEntry(ctx, earthNode, tick);
    }
  });
}
