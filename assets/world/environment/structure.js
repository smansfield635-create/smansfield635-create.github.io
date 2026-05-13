// /assets/world/environment/structure.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_STRUCTURE_TNT_v1
// Owns: Manor/building placement, scale, silhouette, windows, light, shadow, and terrain integration.

export const ENVIRONMENT_STRUCTURE_VERSION = "reusable-planetary-structure-v1";

export function drawStructureLayer(ctx, profile, cell, frame) {
  if (!profile.structure.enabled) return;
  if (profile.structure.type === "manor") drawManor(ctx, profile, frame);
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

function drawManor(ctx, profile, frame) {
  const { width: w, height: h } = frame;
  const s = profile.structure;
  const palette = s.palette;

  const cx = w * s.x;
  const baseY = h * s.baseY;
  const width = w * s.width;
  const height = h * s.height;
  const bodyTop = baseY - height * 0.58;
  const bodyH = height * 0.55;

  ctx.save();

  const contact = ctx.createRadialGradient(cx, baseY + h * 0.025, 0, cx, baseY + h * 0.040, width * 0.86);
  contact.addColorStop(0, "rgba(0,0,0,.48)");
  contact.addColorStop(0.63, "rgba(0,0,0,.18)");
  contact.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.032, width * 0.86, h * 0.048, 0, 0, Math.PI * 2);
  ctx.fill();

  const wall = ctx.createLinearGradient(cx - width * 0.57, bodyTop, cx + width * 0.56, baseY);
  wall.addColorStop(0, `rgb(${palette.wallDark.join(",")})`);
  wall.addColorStop(0.25, `rgb(${palette.wallMid.join(",")})`);
  wall.addColorStop(0.49, `rgb(${palette.wallLit.join(",")})`);
  wall.addColorStop(0.73, `rgb(${palette.wallMid[0] * 0.72},${palette.wallMid[1] * 0.70},${palette.wallMid[2] * 0.70})`);
  wall.addColorStop(1, `rgb(${palette.shadow.join(",")})`);

  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(238,207,143,.42)";
  ctx.lineWidth = Math.max(1, w * 0.00125);

  function rect(x, y, rw, rh, r = Math.max(2, w * 0.004)) {
    roundedRect(ctx, x, y, rw, rh, r);
    ctx.fill();
    ctx.stroke();
  }

  rect(cx - width * 0.31, bodyTop + bodyH * 0.16, width * 0.62, bodyH * 0.86);
  rect(cx - width * 0.17, bodyTop - bodyH * 0.02, width * 0.34, bodyH * 1.06);
  rect(cx - width * 0.525, bodyTop + bodyH * 0.32, width * 0.23, bodyH * 0.70);
  rect(cx + width * 0.295, bodyTop + bodyH * 0.32, width * 0.23, bodyH * 0.70);

  drawRoofs(ctx, cx, bodyTop, bodyH, width, height, palette);
  drawWindows(ctx, cx, bodyTop, bodyH, baseY, width, palette);

  ctx.restore();
}

function drawRoofs(ctx, cx, bodyTop, bodyH, width, height, palette) {
  ctx.fillStyle = `rgb(${palette.roof.join(",")})`;
  ctx.strokeStyle = "rgba(245,218,164,.36)";

  const roofs = [
    [[cx - width * 0.36, bodyTop + bodyH * 0.16], [cx, bodyTop - height * 0.23], [cx + width * 0.36, bodyTop + bodyH * 0.16]],
    [[cx - width * 0.18, bodyTop - bodyH * 0.02], [cx, bodyTop - height * 0.30], [cx + width * 0.18, bodyTop - bodyH * 0.02]],
    [[cx - width * 0.56, bodyTop + bodyH * 0.32], [cx - width * 0.405, bodyTop + bodyH * 0.10], [cx - width * 0.250, bodyTop + bodyH * 0.32]],
    [[cx + width * 0.250, bodyTop + bodyH * 0.32], [cx + width * 0.405, bodyTop + bodyH * 0.10], [cx + width * 0.56, bodyTop + bodyH * 0.32]]
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
}

function drawWindows(ctx, cx, bodyTop, bodyH, baseY, width, palette) {
  ctx.fillStyle = `rgba(${palette.window[0]},${palette.window[1]},${palette.window[2]},.84)`;

  for (let floor = 0; floor < 3; floor += 1) {
    const y = bodyTop + bodyH * (0.28 + floor * 0.21);

    for (let i = -5; i <= 5; i += 1) {
      if (Math.abs(i) === 5 && floor === 0) continue;
      if (i === 0 && floor > 0) continue;

      const x = cx + i * width * 0.052;
      roundedRect(ctx, x - width * 0.0105, y, width * 0.021, bodyH * 0.080, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(18,14,13,.92)";
  roundedRect(ctx, cx - width * 0.033, baseY - bodyH * 0.25, width * 0.066, bodyH * 0.25, 4);
  ctx.fill();
}
