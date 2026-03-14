function project3DPoint(x, y, z, yaw, pitch, scale) {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const x1 = (x * cosY) + (z * sinY);
  const z1 = (-x * sinY) + (z * cosY);

  const y2 = (y * cosP) - (z1 * sinP);
  const z2 = (y * sinP) + (z1 * cosP);

  const perspective = 1 / (1 + (z2 * 0.9));
  return {
    x: x1 * scale * perspective,
    y: y2 * scale * perspective,
    z: z2,
    perspective
  };
}

function drawGlowingLine(ctx, ax, ay, bx, by, color, width, glowAlpha) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = width * 6 * glowAlpha;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.restore();
}

function drawRing(ctx, cx, cy, rx, ry, rotation, strokeStyle, lineWidth, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = strokeStyle;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCore(ctx, cx, cy, pulseRadius) {
  const halo = ctx.createRadialGradient(cx, cy, pulseRadius * 0.2, cx, cy, pulseRadius * 2.9);
  halo.addColorStop(0, "rgba(255,248,220,0.96)");
  halo.addColorStop(0.24, "rgba(255,222,160,0.58)");
  halo.addColorStop(0.58, "rgba(255,188,104,0.24)");
  halo.addColorStop(1, "rgba(255,188,104,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius * 2.9, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(cx, cy, pulseRadius * 0.12, cx, cy, pulseRadius);
  core.addColorStop(0, "rgba(255,255,245,1)");
  core.addColorStop(0.45, "rgba(255,236,176,0.96)");
  core.addColorStop(1, "rgba(255,198,108,0.94)");

  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,248,220,0.74)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius * 1.4, 0, Math.PI * 2);
  ctx.stroke();
}

function buildCompassModel() {
  return {
    top: { x: 0, y: -1, z: 0 },
    bottom: { x: 0, y: 1, z: 0 },
    east: { x: 0.82, y: 0, z: 0 },
    west: { x: -0.82, y: 0, z: 0 },
    front: { x: 0, y: 0, z: 0.58 },
    back: { x: 0, y: 0, z: -0.58 }
  };
}

function projectCompass(model, yaw, pitch, scale) {
  const out = {};
  for (const [key, point] of Object.entries(model)) {
    out[key] = project3DPoint(point.x, point.y, point.z, yaw, pitch, scale);
  }
  return out;
}

function drawDiamondBody(ctx, cx, cy, projected) {
  const edgesBack = [
    ["top", "back"],
    ["back", "east"],
    ["back", "west"],
    ["back", "bottom"]
  ];

  const edgesFront = [
    ["top", "front"],
    ["front", "east"],
    ["front", "west"],
    ["front", "bottom"]
  ];

  const spineEdges = [
    ["top", "east"],
    ["east", "bottom"],
    ["bottom", "west"],
    ["west", "top"],
    ["front", "back"]
  ];

  for (const [a, b] of edgesBack) {
    drawGlowingLine(
      ctx,
      cx + projected[a].x,
      cy + projected[a].y,
      cx + projected[b].x,
      cy + projected[b].y,
      "rgba(114,180,255,0.28)",
      1.35,
      0.42
    );
  }

  for (const [a, b] of spineEdges) {
    drawGlowingLine(
      ctx,
      cx + projected[a].x,
      cy + projected[a].y,
      cx + projected[b].x,
      cy + projected[b].y,
      "rgba(174,224,255,0.58)",
      1.55,
      0.58
    );
  }

  for (const [a, b] of edgesFront) {
    drawGlowingLine(
      ctx,
      cx + projected[a].x,
      cy + projected[a].y,
      cx + projected[b].x,
      cy + projected[b].y,
      "rgba(255,210,132,0.90)",
      2.05,
      1.0
    );
  }

  drawGlowingLine(
    ctx,
    cx + projected.top.x,
    cy + projected.top.y,
    cx + projected.bottom.x,
    cy + projected.bottom.y,
    "rgba(255,238,182,0.86)",
    1.8,
    0.9
  );

  drawGlowingLine(
    ctx,
    cx + projected.west.x,
    cy + projected.west.y,
    cx + projected.east.x,
    cy + projected.east.y,
    "rgba(255,238,182,0.54)",
    1.45,
    0.66
  );
}

function drawLabels(ctx, cx, cy, size, worldYaw) {
  const labels = [
    { text: "N", x: 0, y: -size * 1.20 },
    { text: "E", x: size * 1.12, y: 0 },
    { text: "S", x: 0, y: size * 1.20 },
    { text: "W", x: -size * 1.12, y: 0 }
  ];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-worldYaw);
  ctx.font = `600 ${Math.max(10, Math.round(size * 0.20))}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const label of labels) {
    ctx.fillStyle = "rgba(255,244,212,0.94)";
    ctx.shadowColor = "rgba(255,214,140,0.52)";
    ctx.shadowBlur = 8;
    ctx.fillText(label.text, label.x, label.y);
  }

  ctx.restore();
}

function drawBackgroundHalo(ctx, cx, cy, radius) {
  const halo = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius * 1.52);
  halo.addColorStop(0, "rgba(255,216,136,0.12)");
  halo.addColorStop(0.46, "rgba(116,184,255,0.10)");
  halo.addColorStop(1, "rgba(116,184,255,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.52, 0, Math.PI * 2);
  ctx.fill();
}

export function createCompassRenderer() {
  const model = buildCompassModel();

  return {
    draw(ctx, projector, now = 0) {
      const camera = projector.getCameraState();

      const size = Math.max(48, Math.min(ctx.canvas.width, ctx.canvas.height) * 0.078);
      const cx = Math.round(ctx.canvas.width - (36 + size));
      const cy = Math.round(56 + size);

      const ringDrift = now * 0.00022;
      const pulse = 1 + (Math.sin(now * 0.0032) * 0.06);

      drawBackgroundHalo(ctx, cx, cy, size);

      drawRing(
        ctx,
        cx,
        cy,
        size * 1.14,
        size * 0.30,
        ringDrift,
        "rgba(124,190,255,0.46)",
        1.15,
        0.64
      );

      drawRing(
        ctx,
        cx,
        cy,
        size * 0.82,
        size * 0.54,
        ringDrift + 0.78,
        "rgba(255,214,144,0.28)",
        1.05,
        0.50
      );

      const worldYaw = -(camera.azimuth || 0);
      const worldPitch = 0.88 + ((camera.latitudeTilt || 0) * 0.90);
      const projected = projectCompass(model, worldYaw, worldPitch, size * 0.92);

      drawDiamondBody(ctx, cx, cy, projected);
      drawCore(ctx, cx, cy, size * 0.125 * pulse);
      drawLabels(ctx, cx, cy, size, worldYaw);
    }
  };
}
