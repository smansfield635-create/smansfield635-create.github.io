export function createEnvironmentRenderer() {
  function render(context, payload) {
    const { width, height, projection, timeMs } = payload;

    context.save();

    drawSky(context, width, height);
    drawAura(context, width, height, timeMs);
    drawStars(context, projection.stars, timeMs);
    drawHorizonGlow(context, width, height);

    context.restore();
  }

  return { render };
}

function drawSky(context, width, height) {
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "rgba(8,18,35,1)");
  sky.addColorStop(0.44, "rgba(20,38,72,1)");
  sky.addColorStop(0.72, "rgba(39,76,125,0.96)");
  sky.addColorStop(1, "rgba(76,116,145,0.20)");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
}

function drawAura(context, width, height, timeMs) {
  const pulse = 0.5 + 0.5 * Math.sin(timeMs * 0.00045);
  const glow = context.createRadialGradient(
    width * 0.5,
    height * 0.34,
    width * 0.04,
    width * 0.5,
    height * 0.34,
    width * 0.42
  );
  glow.addColorStop(0, `rgba(255,248,220,${0.20 + pulse * 0.06})`);
  glow.addColorStop(0.4, `rgba(165,205,255,${0.10 + pulse * 0.04})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function drawStars(context, stars, timeMs) {
  const flicker = 0.5 + 0.5 * Math.sin(timeMs * 0.0013);

  context.save();
  stars.forEach((star, index) => {
    const alpha = star.alpha * (0.72 + 0.28 * Math.sin(timeMs * 0.001 + index * 0.7) * flicker);
    context.beginPath();
    context.arc(star.projected.x, star.projected.y, star.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255,${Math.max(0.12, alpha)})`;
    context.fill();
  });
  context.restore();
}

function drawHorizonGlow(context, width, height) {
  const horizon = context.createLinearGradient(0, height * 0.48, 0, height * 0.84);
  horizon.addColorStop(0, "rgba(255,217,145,0.00)");
  horizon.addColorStop(0.52, "rgba(255,190,120,0.08)");
  horizon.addColorStop(1, "rgba(255,175,95,0.15)");
  context.fillStyle = horizon;
  context.fillRect(0, 0, width, height);
}
