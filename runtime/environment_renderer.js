const META = Object.freeze({
  name: "ENVIRONMENT_RENDERER",
  version: "G1_EXTERNAL_BASELINE",
  role: "environment_and_signal_renderer",
  contract: "ENVIRONMENT_RENDERER_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

export function renderEnvironmentLayer(ctx, snapshot, projection) {
  if (!ctx || !snapshot || !projection) return;

  const projectionPacket =
    snapshot.projection && typeof snapshot.projection === "object" ? snapshot.projection : {};

  const stars = Array.isArray(projectionPacket.stars) ? projectionPacket.stars : [];
  const markers = Array.isArray(projectionPacket.markers) ? projectionPacket.markers : [];
  const renderPacket = snapshot.renderPacket && typeof snapshot.renderPacket === "object"
    ? snapshot.renderPacket
    : {};

  const visible = renderPacket.visible || {};
  const colorOutput = visible.colorOutput || {};
  const depth = Number(visible.depthOutput || 0.5);
  const luminance = Number(visible.luminanceOutput || 0.5);

  ctx.save();

  const glowRadius = Math.min(projection.width, projection.height) * (0.16 + depth * 0.06);
  const glow = ctx.createRadialGradient(
    projection.cx,
    projection.cy - glowRadius * 0.4,
    0,
    projection.cx,
    projection.cy - glowRadius * 0.4,
    glowRadius
  );

  glow.addColorStop(0, "rgba(255,248,228,0.38)");
  glow.addColorStop(0.24, "rgba(111,231,255,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(projection.cx, projection.cy - glowRadius * 0.4, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  stars.forEach((star) => {
    const p = projection.project(star);
    const alpha = Math.max(0.08, Math.min(1, Number(star.alpha || 0.2) * (0.65 + luminance * 0.35)));
    ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.6, Number(star.size || 1)), 0, Math.PI * 2);
    ctx.fill();
  });

  markers.forEach((marker) => {
    const p = projection.project(marker);
    const size = Math.max(3, Number(marker.size || 4));

    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.fill();

    ctx.fillStyle = "rgba(232,246,255,0.82)";
    ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(marker.label || "", p.x, p.y - 10);
  });

  const hue = Number(colorOutput.hue || 0.5);
  const sat = Number(colorOutput.saturation || 0.5);
  const val = Number(colorOutput.value || 0.5);

  ctx.fillStyle =
    "rgba(" +
    Math.round(120 + hue * 80) + "," +
    Math.round(180 + sat * 60) + "," +
    Math.round(220 + val * 35) + "," +
    "0.12)";
  ctx.fillRect(0, 0, projection.width, projection.height);

  ctx.restore();
}

const ENVIRONMENT_RENDERER_API = Object.freeze({
  meta: META,
  renderEnvironmentLayer
});

export default ENVIRONMENT_RENDERER_API;
