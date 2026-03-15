function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${clamp(a, 0, 1).toFixed(3)})`;
}

function normalizeLonDeg(lonDeg) {
  let value = lonDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function buildVisibleOceanBands(terrainField) {
  const bands = new Map();

  if (!terrainField || !Array.isArray(terrainField.samples)) {
    return bands;
  }

  for (const sample of terrainField.samples) {
    if (!sample?.visible) continue;
    if (sample?.terrain !== "OCEAN") continue;

    const key = `${sample.latDeg}`;
    if (!bands.has(key)) bands.set(key, []);
    bands.get(key).push(sample);
  }

  for (const bucket of bands.values()) {
    bucket.sort((a, b) => normalizeLonDeg(a.lonDeg) - normalizeLonDeg(b.lonDeg));
  }

  return bands;
}

export function createCurrentEngine() {
  function drawPrimaryCurrentArcs(ctx, centerX, centerY, radius, time) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.0012);

    ctx.save();
    ctx.strokeStyle = rgba(135, 230, 255, 0.06 + pulse * 0.04);
    ctx.lineWidth = 1.55;

    for (let i = 0; i < 5; i += 1) {
      const arcRadius = radius * (0.34 + i * 0.09);
      const arcY = centerY + (i - 2) * radius * 0.08;
      const start = 0.18 * Math.PI + Math.sin(time * 0.00035 + i * 0.7) * 0.06;
      const end = 0.82 * Math.PI + Math.cos(time * 0.00028 + i * 0.6) * 0.06;

      ctx.beginPath();
      ctx.arc(centerX, arcY, arcRadius, start, end);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSecondaryFlowLanes(ctx, centerX, centerY, radius, time) {
    ctx.save();
    ctx.strokeStyle = rgba(95, 245, 238, 0.045);
    ctx.lineWidth = 0.95;

    for (let i = 0; i < 4; i += 1) {
      const offsetX = Math.sin(time * 0.00022 + i) * radius * 0.025;
      const laneRadius = radius * (0.48 + i * 0.07);

      ctx.beginPath();
      ctx.arc(
        centerX + offsetX,
        centerY - radius * 0.10 + i * radius * 0.05,
        laneRadius,
        0.28 * Math.PI,
        0.72 * Math.PI
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMovingShimmer(ctx, centerX, centerY, radius, time) {
    const sweep = (Math.sin(time * 0.0007) * 0.5 + 0.5) * radius * 0.28;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.clip();

    const shimmer = ctx.createLinearGradient(
      centerX - radius * 0.9 + sweep,
      centerY - radius * 0.4,
      centerX - radius * 0.1 + sweep,
      centerY + radius * 0.4
    );

    shimmer.addColorStop(0.00, rgba(255, 255, 255, 0));
    shimmer.addColorStop(0.35, rgba(180, 255, 245, 0.02));
    shimmer.addColorStop(0.50, rgba(255, 255, 255, 0.06));
    shimmer.addColorStop(0.65, rgba(180, 255, 245, 0.02));
    shimmer.addColorStop(1.00, rgba(255, 255, 255, 0));

    ctx.fillStyle = shimmer;
    ctx.fillRect(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2
    );

    ctx.restore();
  }

  function drawBandCurrents(ctx, terrainField, radius, time) {
    const bands = buildVisibleOceanBands(terrainField);

    ctx.save();
    ctx.lineCap = "round";

    for (const bucket of bands.values()) {
      if (bucket.length < 2) continue;

      for (let i = 0; i < bucket.length - 1; i += 1) {
        const a = bucket[i];
        const b = bucket[i + 1];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius * 0.072) continue;

        const shorelineBias = Math.max(a.shoreline ?? 0, b.shoreline ?? 0);
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0011 + i * 0.18 + a.latDeg * 0.07);
        const alpha = 0.018 + pulse * 0.018 + shorelineBias * 0.035;

        ctx.strokeStyle = rgba(165, 255, 245, alpha);
        ctx.lineWidth = radius * (0.004 + shorelineBias * 0.004);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawLocalizedEnergy(ctx, centerX, centerY, radius, time, terrainField) {
    ctx.save();
    ctx.globalAlpha = 0.04;

    for (let i = 0; i < 5; i += 1) {
      const x =
        centerX +
        Math.sin(time * 0.0005 + i * 1.2) * radius * (0.18 + i * 0.08);
      const y =
        centerY +
        Math.cos(time * 0.0004 + i * 0.9) * radius * (0.10 + i * 0.05);

      const glow = ctx.createRadialGradient(
        x,
        y,
        radius * 0.01,
        x,
        y,
        radius * 0.08
      );

      glow.addColorStop(0.00, rgba(120, 255, 242, 0.70));
      glow.addColorStop(0.45, rgba(120, 255, 242, 0.14));
      glow.addColorStop(1.00, rgba(120, 255, 242, 0));

      ctx.beginPath();
      ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    if (terrainField && Array.isArray(terrainField.samples)) {
      for (const sample of terrainField.samples) {
        if (!sample.visible) continue;
        if (sample.terrain !== "OCEAN") continue;
        if (!(sample.shoreline > 0.55)) continue;

        const nearShoreGlow = ctx.createRadialGradient(
          sample.x,
          sample.y,
          radius * 0.004,
          sample.x,
          sample.y,
          radius * 0.028
        );

        nearShoreGlow.addColorStop(0.00, rgba(150, 255, 245, 0.05));
        nearShoreGlow.addColorStop(0.45, rgba(150, 255, 245, 0.02));
        nearShoreGlow.addColorStop(1.00, rgba(150, 255, 245, 0));

        ctx.beginPath();
        ctx.arc(sample.x, sample.y, radius * 0.028, 0, Math.PI * 2);
        ctx.fillStyle = nearShoreGlow;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function render(ctx, projector, runtime, state, terrainField) {
    const { centerX, centerY, radius } = projector.state;
    const time = state.time;

    drawPrimaryCurrentArcs(ctx, centerX, centerY, radius, time);
    drawSecondaryFlowLanes(ctx, centerX, centerY, radius, time);
    drawMovingShimmer(ctx, centerX, centerY, radius, time);
    drawBandCurrents(ctx, terrainField, radius, time);
    drawLocalizedEnergy(ctx, centerX, centerY, radius, time, terrainField);

    return Object.freeze({
      mode: "distributed_continuous_current_field"
    });
  }

  return Object.freeze({
    render
  });
}
