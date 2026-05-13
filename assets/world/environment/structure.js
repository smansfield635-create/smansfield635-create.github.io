// /assets/world/environment/structure.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_STRUCTURE_VISIBILITY_AND_CAMERA_COMPOSITION_RENEWAL_v1
// Owns: Manor visibility, midground anchor, scale, rooflines, windows, light, shadow, terrain integration.
// Consumes: shared hexfield substrate through frame.hexfield.

export const ENVIRONMENT_STRUCTURE_VERSION =
  "h-earth-structure-visibility-and-camera-composition-renewal-v1";

const TAU = Math.PI * 2;

export function drawStructureLayer(ctx, profile, cell, frame) {
  if (!profile.structure?.enabled) return false;
  if (profile.structure.type !== "manor") return false;

  return drawManor(ctx, profile, cell, frame);
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

  const cx = w * (s.x ?? 0.50);
  const baseY = h * 0.615;

  const manorW = w * 0.285;
  const manorH = h * 0.145;
  const mainTop = baseY - manorH * 0.76;
  const mainH = manorH * 0.62;

  ctx.save();

  drawArrivalShadow(ctx, cx, baseY, manorW, h);
  drawFoundationShelf(ctx, cx, baseY, manorW, h);
  drawMainMass(ctx, cx, mainTop, mainH, manorW, palette, w);
  drawSideWings(ctx, cx, mainTop, mainH, manorW, palette, w);
  drawRoofs(ctx, cx, mainTop, mainH, manorW, manorH, palette, w);
  drawPortico(ctx, cx, mainTop, baseY, mainH, manorW, palette, w);
  drawWindows(ctx, cx, mainTop, mainH, baseY, manorW, palette, w);
  drawStructureIntegrationLight(ctx, cx, mainTop, baseY, manorW, h);
  drawSubtleAnchorOutline(ctx, cx, mainTop, baseY, manorW, h, w);

  ctx.restore();

  return true;
}

function drawArrivalShadow(ctx, cx, baseY, manorW, h) {
  const shadow = ctx.createRadialGradient(
    cx,
    baseY + h * 0.018,
    0,
    cx,
    baseY + h * 0.034,
    manorW * 0.82
  );

  shadow.addColorStop(0, "rgba(0,0,0,.50)");
  shadow.addColorStop(0.52, "rgba(0,0,0,.24)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.026, manorW * 0.82, h * 0.036, 0, 0, TAU);
  ctx.fill();
}

function drawFoundationShelf(ctx, cx, baseY, manorW, h) {
  const grad = ctx.createLinearGradient(cx - manorW * 0.62, baseY - h * 0.010, cx + manorW * 0.62, baseY + h * 0.018);
  grad.addColorStop(0, "rgba(64,52,36,.18)");
  grad.addColorStop(0.50, "rgba(210,176,106,.20)");
  grad.addColorStop(1, "rgba(26,24,21,.22)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.004, manorW * 0.61, h * 0.018, 0, 0, TAU);
  ctx.fill();
}

function drawMainMass(ctx, cx, top, bodyH, manorW, palette, canvasW) {
  const bodyW = manorW * 0.48;
  const x = cx - bodyW / 2;

  const wall = ctx.createLinearGradient(x, top, x + bodyW, top + bodyH);
  wall.addColorStop(0, rgb(palette.wallDark));
  wall.addColorStop(0.22, rgb(palette.wallMid));
  wall.addColorStop(0.48, rgb(palette.wallLit));
  wall.addColorStop(0.78, "rgb(88,74,56)");
  wall.addColorStop(1, rgb(palette.shadow));

  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(241,214,157,.40)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0009);

  roundedRect(ctx, x, top, bodyW, bodyH, Math.max(2, canvasW * 0.003));
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255,238,184,.055)";
  roundedRect(ctx, x + bodyW * 0.08, top + bodyH * 0.08, bodyW * 0.84, bodyH * 0.16, 4);
  ctx.fill();
}

function drawSideWings(ctx, cx, top, bodyH, manorW, palette, canvasW) {
  const wingW = manorW * 0.235;
  const wingH = bodyH * 0.72;
  const y = top + bodyH * 0.28;

  const leftX = cx - manorW * 0.48;
  const rightX = cx + manorW * 0.245;

  const leftGrad = ctx.createLinearGradient(leftX, y, leftX + wingW, y + wingH);
  leftGrad.addColorStop(0, "rgb(58,52,45)");
  leftGrad.addColorStop(0.55, "rgb(112,94,66)");
  leftGrad.addColorStop(1, "rgb(45,37,32)");

  const rightGrad = ctx.createLinearGradient(rightX, y, rightX + wingW, y + wingH);
  rightGrad.addColorStop(0, "rgb(122,100,68)");
  rightGrad.addColorStop(0.52, "rgb(76,62,47)");
  rightGrad.addColorStop(1, "rgb(33,29,27)");

  ctx.strokeStyle = "rgba(241,214,157,.34)";
  ctx.lineWidth = Math.max(1, canvasW * 0.00085);

  ctx.fillStyle = leftGrad;
  roundedRect(ctx, leftX, y, wingW, wingH, Math.max(2, canvasW * 0.0028));
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = rightGrad;
  roundedRect(ctx, rightX, y, wingW, wingH, Math.max(2, canvasW * 0.0028));
  ctx.fill();
  ctx.stroke();
}

function drawRoofs(ctx, cx, top, bodyH, manorW, manorH, palette, canvasW) {
  ctx.fillStyle = rgb(palette.roof);
  ctx.strokeStyle = "rgba(249,226,173,.48)";
  ctx.lineWidth = Math.max(1, canvasW * 0.00105);

  const roofY = top + bodyH * 0.02;

  drawTriRoof(ctx, cx - manorW * 0.24, top + bodyH * 0.28, manorW * 0.25, manorH * 0.19);
  drawTriRoof(ctx, cx + manorW * 0.24, top + bodyH * 0.28, manorW * 0.25, manorH * 0.19);
  drawTriRoof(ctx, cx, roofY, manorW * 0.44, manorH * 0.32);

  ctx.strokeStyle = "rgba(255,233,177,.24)";
  ctx.beginPath();
  ctx.moveTo(cx - manorW * 0.205, roofY);
  ctx.lineTo(cx + manorW * 0.205, roofY);
  ctx.stroke();
}

function drawTriRoof(ctx, cx, baseY, roofW, roofH) {
  ctx.beginPath();
  ctx.moveTo(cx - roofW / 2, baseY);
  ctx.lineTo(cx, baseY - roofH);
  ctx.lineTo(cx + roofW / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPortico(ctx, cx, top, baseY, bodyH, manorW, palette, canvasW) {
  const porticoW = manorW * 0.090;
  const porticoH = bodyH * 0.26;
  const y = baseY - porticoH;

  ctx.fillStyle = "rgba(19,15,13,.95)";
  roundedRect(ctx, cx - porticoW / 2, y, porticoW, porticoH, Math.max(2, canvasW * 0.002));
  ctx.fill();

  ctx.strokeStyle = "rgba(255,225,160,.36)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0008);

  ctx.beginPath();
  ctx.moveTo(cx - porticoW * 0.66, y);
  ctx.lineTo(cx, y - porticoH * 0.38);
  ctx.lineTo(cx + porticoW * 0.66, y);
  ctx.stroke();

  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(cx + i * porticoW * 0.28, y);
    ctx.lineTo(cx + i * porticoW * 0.28, y + porticoH);
    ctx.stroke();
  }
}

function drawWindows(ctx, cx, top, bodyH, baseY, manorW, palette, canvasW) {
  const windowColor = `rgba(${palette.window[0]},${palette.window[1]},${palette.window[2]},.88)`;
  const glowColor = `rgba(${palette.window[0]},${palette.window[1]},${palette.window[2]},.18)`;

  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.ellipse(cx, top + bodyH * 0.55, manorW * 0.35, bodyH * 0.60, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = windowColor;

  for (let floor = 0; floor < 3; floor += 1) {
    const y = top + bodyH * (0.28 + floor * 0.205);

    for (let i = -5; i <= 5; i += 1) {
      if (i === 0 && floor > 0) continue;
      if (Math.abs(i) === 5 && floor === 2) continue;

      const x = cx + i * manorW * 0.031;
      roundedRect(ctx, x - manorW * 0.0048, y, manorW * 0.0096, bodyH * 0.070, 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(12,9,8,.96)";
  roundedRect(ctx, cx - manorW * 0.014, baseY - bodyH * 0.235, manorW * 0.028, bodyH * 0.235, 3);
  ctx.fill();
}

function drawStructureIntegrationLight(ctx, cx, top, baseY, manorW, h) {
  const glow = ctx.createRadialGradient(cx, top + h * 0.080, 0, cx, top + h * 0.105, manorW * 0.55);
  glow.addColorStop(0, "rgba(255,210,128,.095)");
  glow.addColorStop(0.50, "rgba(255,210,128,.025)");
  glow.addColorStop(1, "rgba(255,210,128,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(cx - manorW * 0.66, top - h * 0.020, manorW * 1.32, baseY - top + h * 0.050);
}

function drawSubtleAnchorOutline(ctx, cx, top, baseY, manorW, h, canvasW) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255,235,180,.16)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0009);

  roundedRect(ctx, cx - manorW * 0.31, top, manorW * 0.62, baseY - top, 4);
  ctx.stroke();

  ctx.restore();
}

function rgb(color) {
  return `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
}
