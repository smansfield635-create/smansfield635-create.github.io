function hashNoise(a, b, c = 0) {
  const v = Math.sin((a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function drawOceanBody(ctx, body, camera) {
  const yawBiasX = Math.sin(camera.azimuth || 0) * body.radius * 0.12;
  const pitchBiasY = (camera.latitudeTilt || 0) * body.radius * 0.08;

  const base = ctx.createRadialGradient(
    body.centerX - (body.radius * 0.14) + yawBiasX,
    body.centerY - (body.radius * 0.26) + pitchBiasY,
    body.radius * 0.08,
    body.centerX,
    body.centerY + (body.radius * 0.10),
    body.radius * 1.05
  );
  base.addColorStop(0.00, "#42e3ff");
  base.addColorStop(0.10, "#18a4ff");
  base.addColorStop(0.28, "#1558de");
  base.addColorStop(0.56, "#10237f");
  base.addColorStop(0.82, "#080f45");
  base.addColorStop(1.00, "#040723");

  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  const abyss = ctx.createRadialGradient(
    body.centerX - yawBiasX * 0.4,
    body.centerY + (body.radius * 0.26),
    body.radius * 0.16,
    body.centerX,
    body.centerY + (body.radius * 0.42),
    body.radius * 1.16
  );
  abyss.addColorStop(0.00, "rgba(0,0,0,0)");
  abyss.addColorStop(0.55, "rgba(0,0,16,0.12)");
  abyss.addColorStop(1.00, "rgba(0,0,38,0.36)");

  ctx.fillStyle = abyss;
  ctx.beginPath();
  ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawMassFlow(ctx, body, tick, camera) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const yaw = camera.azimuth || 0;
  const tilt = camera.latitudeTilt || 0;

  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2 + (yaw * 0.8) + (tick * 0.00018);
    const radiusFactor = 0.18 + (i * 0.10);
    const px = body.centerX + (Math.cos(angle) * body.radius * radiusFactor * 0.82);
    const py = body.centerY + (Math.sin(angle) * body.radius * radiusFactor * 0.46) + (tilt * body.radius * 0.08);
    const rx = body.radius * (0.18 + (i * 0.02));
    const ry = body.radius * (0.05 + (i * 0.008));

    const g = ctx.createRadialGradient(px, py, 4, px, py, rx);
    g.addColorStop(0, "rgba(118,230,255,0.08)");
    g.addColorStop(0.45, "rgba(88,190,255,0.05)");
    g.addColorStop(1, "rgba(88,190,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, angle * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCurrentGyres(ctx, body, tick, camera) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const yaw = camera.azimuth || 0;
  const tilt = camera.latitudeTilt || 0;

  for (let ring = 0; ring < 5; ring += 1) {
    const ringRadius = body.radius * (0.22 + (ring * 0.12));
    const lineWidth = body.radius * (0.018 - (ring * 0.0018));
    const alpha = 0.12 - (ring * 0.016);

    ctx.beginPath();

    for (let step = 0; step <= 96; step += 1) {
      const t = step / 96;
      const angle = (t * Math.PI * 2) + (yaw * (1.0 + ring * 0.12)) + (tick * 0.00055 * (1 + ring * 0.08));
      const swirl = Math.sin((angle * 3.0) + (tick * 0.0012) + ring) * body.radius * (0.028 + ring * 0.003);
      const pulse = Math.cos((angle * 2.0) - (tick * 0.0009) + ring) * body.radius * 0.010;

      const rx = ringRadius + swirl + pulse;
      const x = body.centerX + (Math.cos(angle) * rx);
      const y = body.centerY + (Math.sin(angle) * rx * (0.58 + (tilt * 0.08)));

      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(196,244,255,${Math.max(0.02, alpha)})`;
    ctx.lineWidth = Math.max(1, lineWidth);
    ctx.stroke();
  }

  for (let arcIndex = 0; arcIndex < 10; arcIndex += 1) {
    const startAngle = (arcIndex / 10) * Math.PI * 2 + (yaw * 1.1) + (tick * 0.00042);
    const arcLength = 0.9 + (hashNoise(900, arcIndex, 1) * 0.8);
    const orbit = body.radius * (0.20 + (hashNoise(900, arcIndex, 2) * 0.54));

    ctx.beginPath();
    for (let step = 0; step <= 24; step += 1) {
      const t = step / 24;
      const a = startAngle + (t * arcLength);
      const bend = Math.sin((a * 2.4) + (tick * 0.0010) + arcIndex) * body.radius * 0.022;
      const x = body.centerX + (Math.cos(a) * (orbit + bend));
      const y = body.centerY + (Math.sin(a) * (orbit + bend) * (0.58 + (tilt * 0.08)));

      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "rgba(104,208,255,0.10)";
    ctx.lineWidth = Math.max(1, body.radius * 0.010);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSubsurfaceField(ctx, body, tick, camera) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const yaw = camera.azimuth || 0;
  const tilt = camera.latitudeTilt || 0;

  for (let i = 0; i < 34; i += 1) {
    const baseAngle = (hashNoise(700, i, 1) * Math.PI * 2) + (yaw * 0.72) + (tick * 0.00024);
    const orbit = body.radius * (0.18 + (hashNoise(700, i, 2) * 0.60));
    const px = body.centerX + (Math.cos(baseAngle) * orbit);
    const py = body.centerY + (Math.sin(baseAngle) * orbit * (0.60 + (tilt * 0.08)));
    const rx = body.radius * (0.024 + (hashNoise(700, i, 3) * 0.065));
    const ry = body.radius * (0.008 + (hashNoise(700, i, 4) * 0.020));
    const rot = baseAngle + ((hashNoise(700, i, 5) - 0.5) * 1.2);

    const g = ctx.createRadialGradient(px, py, 2, px, py, rx);
    g.addColorStop(0, "rgba(126,222,255,0.10)");
    g.addColorStop(0.55, "rgba(72,148,255,0.05)");
    g.addColorStop(1, "rgba(72,148,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBodyRelativeSpecular(ctx, body, tick, camera) {
  const yaw = camera.azimuth || 0;
  const tilt = camera.latitudeTilt || 0;

  const phase = ((tick % 2200) / 2200);
  const sweepOffset = (phase - 0.5) * body.radius * 0.36;
  const centerX = body.centerX + sweepOffset + (Math.sin(yaw) * body.radius * 0.16);
  const centerY = body.centerY + (tilt * body.radius * 0.10);

  const glow = ctx.createRadialGradient(centerX, centerY, 6, centerX, centerY, body.radius * 0.34);
  glow.addColorStop(0, "rgba(255,255,255,0.11)");
  glow.addColorStop(0.34, "rgba(220,252,255,0.06)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, body.radius * 0.36, body.radius * 0.12, -0.12 + (yaw * 0.12), 0, Math.PI * 2);
  ctx.fill();
}

export function createPlanetEngine() {
  return Object.freeze({
    draw(ctx, snapshot, projector) {
      const tick = snapshot.tick ?? 0;
      const body = projector.getBody();
      const camera = projector.getCameraState?.() ?? { azimuth: 0, latitudeTilt: 0 };

      ctx.save();
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawOceanBody(ctx, body, camera);
      drawMassFlow(ctx, body, tick, camera);
      drawCurrentGyres(ctx, body, tick, camera);
      drawSubsurfaceField(ctx, body, tick, camera);

      const globeShadow = ctx.createRadialGradient(
        body.centerX + (Math.sin(camera.azimuth || 0) * body.radius * 0.18),
        body.centerY - (body.radius * 0.18) + ((camera.latitudeTilt || 0) * body.radius * 0.10),
        body.radius * 0.12,
        body.centerX,
        body.centerY,
        body.radius * 1.05
      );
      globeShadow.addColorStop(0, "rgba(255,255,255,0.06)");
      globeShadow.addColorStop(0.34, "rgba(164,232,255,0.04)");
      globeShadow.addColorStop(0.70, "rgba(24,90,144,0.09)");
      globeShadow.addColorStop(1, "rgba(4,22,48,0.18)");
      ctx.fillStyle = globeShadow;
      ctx.beginPath();
      ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
      ctx.fill();

      drawBodyRelativeSpecular(ctx, body, tick, camera);

      ctx.restore();
    }
  });
}
