// /assets/world/environment/structure.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_VISUAL_DEFINITION_EXPANSION_STRUCTURE_TNT_v1
// Owns: Manor massing, scale, rooflines, windows, light, shadow, terrain integration.
// Consumes: shared hexfield substrate through frame.hexfield.

export const ENVIRONMENT_STRUCTURE_VERSION =
  "h-earth-hex-visual-definition-expansion-structure-v1";

const TAU = Math.PI * 2;

export function drawStructureLayer(ctx, profile, cell, frame) {
  if (!profile.structure.enabled) return;
  if (profile.structure.type === "manor") drawManor(ctx, profile, cell, frame);
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);

  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function drawManor(ctx, profile, cell, frame) {
  const { width: w, height: h, hexfield, time: t } = frame;
  const s = profile.structure;
  const palette = s.palette;

  const cx = w * s.x;
  const baseY = h * s.baseY;

  const width = w * s.width * 0.82;
  const height = h * s.height * 0.86;
  const bodyTop = baseY - height * 0.56;
  const bodyH = height * 0.55;

  ctx.save();

  drawGroundContact(ctx, cx, baseY, width, h);
  drawManorBody(ctx, cx, bodyTop, baseY, bodyH, width, palette, w);
  drawRoofs(ctx, cx, bodyTop, bodyH, width, height, palette);
  drawPortico(ctx, cx, bodyTop, baseY, bodyH, width, palette);
  drawWindows(ctx, cx, bodyTop, bodyH, baseY, width, palette);
  drawManorLightBleed(ctx, cx, bodyTop, baseY, width, h);

  ctx.restore();
}

function drawGroundContact(ctx, cx, baseY, width, h) {
  const contact = ctx.createRadialGradient(cx, baseY + h * 0.024, 0, cx, baseY + h * 0.040, width * 0.95);
  contact.addColorStop(0, "rgba(0,0,0,.50)");
  contact.addColorStop(0.55, "rgba(0,0,0,.20)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.032, width * 0.88, h * 0.045, 0, 0, TAU);
  ctx.fill();
}

function drawManorBody(ctx, cx, bodyTop, baseY, bodyH, width, palette, canvasWidth) {
  const wall = ctx.createLinearGradient(cx - width * 0.62, bodyTop, cx + width * 0.58, baseY);
  wall.addColorStop(0, `rgb(${palette.wallDark.join(",")})`);
  wall.addColorStop(0.25, `rgb(${palette.wallMid.join(",")})`);
  wall.addColorStop(0.48, `rgb(${palette.wallLit.join(",")})`);
  wall.addColorStop(0.72, `rgb(${Math.round(palette.wallMid[0] * 0.72)},${Math.round(palette.wallMid[1] * 0.70)},${Math.round(palette.wallMid[2] * 0.70)})`);
  wall.addColorStop(1, `rgb(${palette.shadow.join(",")})`);

  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(238,207,143,.38)";
  ctx.lineWidth = Math.max(1, canvasWidth * 0.00105);

  function block(x, y, rw, rh, r = Math.max(2, canvasWidth * 0.0032)) {
    roundedRect(ctx, x, y, rw, rh, r);
    ctx.fill();
    ctx.stroke();
  }

  block(cx - width * 0.27, bodyTop + bodyH * 0.12, width * 0.54, bodyH * 0.92);
  block(cx - width * 0.13, bodyTop - bodyH * 0.02, width * 0.26, bodyH * 1.06);
  block(cx - width * 0.55, bodyTop + bodyH * 0.34, width * 0.28, bodyH * 0.70);
  block(cx + width * 0.27, bodyTop + bodyH * 0.34, width * 0.28, bodyH * 0.70);
}

function drawRoofs(ctx, cx, bodyTop, bodyH, width, height, palette) {
  ctx.fillStyle = `rgb(${palette.roof.join(",")})`;
  ctx.strokeStyle = "rgba(245,218,164,.38)";

  const roofs = [
    [[cx - width * 0.35, bodyTop + bodyH * 0.12], [cx, bodyTop - height * 0.25], [cx + width * 0.35, bodyTop + bodyH * 0.12]],
    [[cx - width * 0.16, bodyTop - bodyH * 0.02], [cx, bodyTop - height * 0.32], [cx + width * 0.16, bodyTop - bodyH * 0.02]],
    [[cx - width * 0.59, bodyTop + bodyH * 0.34], [cx - width * 0.41, bodyTop + bodyH * 0.11], [cx - width * 0.23, bodyTop + bodyH * 0.34]],
    [[cx + width * 0.23, bodyTop + bodyH * 0.34], [cx + width * 0.41, bodyTop + bodyH * 0.11], [cx + width * 0.59, bodyTop + bodyH * 0.34]]
  ];

  roofs.forEach((points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[1][0], points[1][1]);
    ctx.lineTo(points[2][0], points[2][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(255,231,173,.22)";
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.28, bodyTop + bodyH * 0.105);
  ctx.lineTo(cx + width * 0.28, bodyTop + bodyH * 0.105);
  ctx.stroke();
}

function drawPortico(ctx, cx, bodyTop, baseY, bodyH, width, palette) {
  const y = baseY - bodyH * 0.22;
  const porticoW = width * 0.145;
  const porticoH = bodyH * 0.24;

  ctx.fillStyle = "rgba(32,28,24,.92)";
  roundedRect(ctx, cx - porticoW * 0.50, y, porticoW, porticoH, 4);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,225,160,.36)";
  ctx.lineWidth = Math.max(1, width * 0.003);
  ctx.beginPath();
  ctx.moveTo(cx - porticoW * 0.65, y);
  ctx.lineTo(cx, y - porticoH * 0.45);
  ctx.lineTo(cx + porticoW * 0.65, y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,225,160,.30)";
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(cx + i * porticoW * 0.28, y);
    ctx.lineTo(cx + i * porticoW * 0.28, y + porticoH);
    ctx.stroke();
  }
}

function drawWindows(ctx, cx, bodyTop, bodyH, baseY, width, palette) {
  ctx.fillStyle = `rgba(${palette.window[0]},${palette.window[1]},${palette.window[2]},.84)`;

  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (0.28 + floor * 0.21);

    for (let i = -6; i <= 6; i += 1) {
      if (Math.abs(i) === 6 && floor === 0) continue;
      if (i === 0 && floor > 0) continue;
      if (Math.abs(i) === 4 && floor === 2) continue;

      const x = cx + i * width * 0.042;
      roundedRect(ctx, x - width * 0.0075, y, width * 0.015, bodyH * 0.072, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(18,14,13,.94)";
  roundedRect(ctx, cx - width * 0.024, baseY - bodyH * 0.24, width * 0.048, bodyH * 0.24, 4);
  ctx.fill();
}

function drawManorLightBleed(ctx, cx, bodyTop, baseY, width, h) {
  const glow = ctx.createRadialGradient(cx, bodyTop + h * 0.10, 0, cx, bodyTop + h * 0.13, width * 0.72);
  glow.addColorStop(0, "rgba(255,210,128,.105)");
  glow.addColorStop(0.55, "rgba(255,210,128,.030)");
  glow.addColorStop(1, "rgba(255,210,128,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - width * 0.80, bodyTop - h * 0.04, width * 1.60, baseY - bodyTop + h * 0.08);
}
