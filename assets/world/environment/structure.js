// /assets/world/environment/structure.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_VISUAL_EXPRESSION_EXPANSION_THROUGH_LIVE_HEX_v2
// Owns: Manor visibility, midground structure anchor, scale, rooflines, windows, shadow, terrain integration.

export const ENVIRONMENT_STRUCTURE_VERSION =
  "h-earth-visual-expression-expansion-through-live-hex-structure-v2";

const TAU = Math.PI * 2;

export function drawStructureLayer(ctx, profile, cell, frame) {
  if (!profile.structure?.enabled) return false;
  if (profile.structure.type !== "manor") return false;
  return drawManor(ctx, profile, frame);
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

function rgb(color) {
  return `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
}

function drawManor(ctx, profile, frame) {
  const { width: w, height: h } = frame;
  const s = profile.structure;
  const palette = s.palette;

  const cx = w * (s.x ?? 0.5);
  const baseY = h * 0.618;

  const manorW = w * 0.315;
  const manorH = h * 0.158;
  const bodyTop = baseY - manorH * 0.72;
  const bodyH = manorH * 0.57;

  ctx.save();

  drawGroundShadow(ctx, cx, baseY, manorW, h);
  drawStoneShelf(ctx, cx, baseY, manorW, h);
  drawWings(ctx, cx, bodyTop, bodyH, manorW, palette, w);
  drawCentralMass(ctx, cx, bodyTop, bodyH, manorW, palette, w);
  drawRoofs(ctx, cx, bodyTop, bodyH, manorW, manorH, palette, w);
  drawPortico(ctx, cx, baseY, bodyH, manorW, w);
  drawWindows(ctx, cx, bodyTop, bodyH, baseY, manorW, palette, w);
  drawWarmInteriorGlow(ctx, cx, bodyTop, baseY, manorW, h);
  drawFineOutline(ctx, cx, bodyTop, baseY, manorW, w);

  ctx.restore();

  return true;
}

function drawGroundShadow(ctx, cx, baseY, manorW, h) {
  const shadow = ctx.createRadialGradient(
    cx,
    baseY + h * 0.018,
    0,
    cx,
    baseY + h * 0.030,
    manorW * 0.95
  );

  shadow.addColorStop(0, "rgba(0,0,0,.56)");
  shadow.addColorStop(0.55, "rgba(0,0,0,.24)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.026, manorW * 0.86, h * 0.036, 0, 0, TAU);
  ctx.fill();
}

function drawStoneShelf(ctx, cx, baseY, manorW, h) {
  const grad = ctx.createLinearGradient(cx - manorW * 0.55, baseY, cx + manorW * 0.55, baseY + h * 0.020);
  grad.addColorStop(0, "rgba(42,34,25,.24)");
  grad.addColorStop(0.45, "rgba(218,180,108,.20)");
  grad.addColorStop(1, "rgba(19,18,16,.24)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.006, manorW * 0.62, h * 0.018, 0, 0, TAU);
  ctx.fill();
}

function drawCentralMass(ctx, cx, top, bodyH, manorW, palette, canvasW) {
  const bodyW = manorW * 0.46;
  const x = cx - bodyW / 2;

  const wall = ctx.createLinearGradient(x, top, x + bodyW, top + bodyH);
  wall.addColorStop(0, rgb(palette.wallDark));
  wall.addColorStop(0.25, rgb(palette.wallMid));
  wall.addColorStop(0.50, rgb(palette.wallLit));
  wall.addColorStop(0.78, "rgb(88,72,55)");
  wall.addColorStop(1, rgb(palette.shadow));

  ctx.fillStyle = wall;
  ctx.strokeStyle = "rgba(248,221,165,.42)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0009);

  roundedRect(ctx, x, top, bodyW, bodyH, Math.max(2, canvasW * 0.003));
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255,241,192,.06)";
  roundedRect(ctx, x + bodyW * 0.08, top + bodyH * 0.09, bodyW * 0.84, bodyH * 0.15, 4);
  ctx.fill();
}

function drawWings(ctx, cx, top, bodyH, manorW, palette, canvasW) {
  const wingW = manorW * 0.245;
  const wingH = bodyH * 0.70;
  const y = top + bodyH * 0.30;

  const wings = [
    { x: cx - manorW * 0.50, light: false },
    { x: cx + manorW * 0.255, light: true }
  ];

  wings.forEach((wing) => {
    const grad = ctx.createLinearGradient(wing.x, y, wing.x + wingW, y + wingH);

    if (wing.light) {
      grad.addColorStop(0, "rgb(126,102,68)");
      grad.addColorStop(0.52, "rgb(82,66,48)");
      grad.addColorStop(1, "rgb(35,30,27)");
    } else {
      grad.addColorStop(0, "rgb(56,50,43)");
      grad.addColorStop(0.55, "rgb(108,88,62)");
      grad.addColorStop(1, "rgb(42,35,31)");
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(241,214,157,.33)";
    ctx.lineWidth = Math.max(1, canvasW * 0.00082);

    roundedRect(ctx, wing.x, y, wingW, wingH, Math.max(2, canvasW * 0.0028));
    ctx.fill();
    ctx.stroke();
  });
}

function drawRoofs(ctx, cx, top, bodyH, manorW, manorH, palette, canvasW) {
  ctx.fillStyle = rgb(palette.roof);
  ctx.strokeStyle = "rgba(255,232,176,.48)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0010);

  drawTriRoof(ctx, cx, top + bodyH * 0.02, manorW * 0.43, manorH * 0.32);
  drawTriRoof(ctx, cx - manorW * 0.27, top + bodyH * 0.31, manorW * 0.27, manorH * 0.19);
  drawTriRoof(ctx, cx + manorW * 0.27, top + bodyH * 0.31, manorW * 0.27, manorH * 0.19);

  ctx.strokeStyle = "rgba(255,235,184,.28)";
  ctx.beginPath();
  ctx.moveTo(cx - manorW * 0.21, top + bodyH * 0.02);
  ctx.lineTo(cx + manorW * 0.21, top + bodyH * 0.02);
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

function drawPortico(ctx, cx, baseY, bodyH, manorW, canvasW) {
  const porticoW = manorW * 0.095;
  const porticoH = bodyH * 0.28;
  const y = baseY - porticoH;

  ctx.fillStyle = "rgba(15,11,10,.96)";
  roundedRect(ctx, cx - porticoW / 2, y, porticoW, porticoH, Math.max(2, canvasW * 0.002));
  ctx.fill();

  ctx.strokeStyle = "rgba(255,226,160,.38)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0008);

  ctx.beginPath();
  ctx.moveTo(cx - porticoW * 0.70, y);
  ctx.lineTo(cx, y - porticoH * 0.40);
  ctx.lineTo(cx + porticoW * 0.70, y);
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
  roundedRect(ctx, cx - manorW * 0.014, baseY - bodyH * 0.245, manorW * 0.028, bodyH * 0.245, 3);
  ctx.fill();
}

function drawWarmInteriorGlow(ctx, cx, top, baseY, manorW, h) {
  const glow = ctx.createRadialGradient(cx, top + h * 0.080, 0, cx, top + h * 0.108, manorW * 0.58);
  glow.addColorStop(0, "rgba(255,211,128,.105)");
  glow.addColorStop(0.50, "rgba(255,211,128,.032)");
  glow.addColorStop(1, "rgba(255,211,128,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(cx - manorW * 0.68, top - h * 0.022, manorW * 1.36, baseY - top + h * 0.050);
}

function drawFineOutline(ctx, cx, top, baseY, manorW, canvasW) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255,236,185,.18)";
  ctx.lineWidth = Math.max(1, canvasW * 0.0009);

  roundedRect(ctx, cx - manorW * 0.33, top, manorW * 0.66, baseY - top, 4);
  ctx.stroke();

  ctx.restore();
}
