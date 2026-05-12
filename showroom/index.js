// /showroom/index.js
// SHOWROOM_NATURAL_DIAMOND_RESTORE_TNT_v2
// Full-file replacement.
// Restores the natural crown-cut canvas diamond.
// Public page stays clean. No image generation. No GraphicBox.

const CONTRACT = "SHOWROOM_NATURAL_DIAMOND_RESTORE_TNT_v2";

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 66 : 42;

const state = {
  canvas: null,
  ctx: null,
  mount: null,
  width: 0,
  height: 0,
  active: true,
  visible: true,
  raf: 0,
  phase: 0,
  sparkle: 0,
  lastFrame: 0
};

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(seed, index, salt = 0) {
  const x = Math.sin((seed + 1) * 91.17 + (index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function sizeCanvas() {
  if (!state.canvas) return;

  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || state.canvas.clientWidth || 960));
  const cssHeight = Math.max(360, Math.floor(rect.height || state.canvas.clientHeight || 560));

  state.canvas.width = Math.floor(cssWidth * DPR);
  state.canvas.height = Math.floor(cssHeight * DPR);
  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", { alpha: false });
}

function render() {
  if (!state.ctx) return;

  const ctx = state.ctx;
  const w = state.width;
  const h = state.height;

  drawDisplayBackground(ctx, w, h);
  drawStageLabel(ctx, w, h);
  drawCrownCutDiamond(ctx, w, h);
  drawRouteCue(ctx, w, h);

  document.documentElement.dataset.showroomRenderer = CONTRACT;
  document.documentElement.dataset.publicCopyClean = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
}

function drawDisplayBackground(ctx, w, h) {
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.40, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.72);
  bg.addColorStop(0, "#12213f");
  bg.addColorStop(0.42, "#071226");
  bg.addColorStop(1, "#01040c");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();

  const glass = ctx.createLinearGradient(0, 0, w, h);
  glass.addColorStop(0, "rgba(255,255,255,.055)");
  glass.addColorStop(0.26, "rgba(255,255,255,0)");
  glass.addColorStop(0.56, "rgba(142,190,255,.055)");
  glass.addColorStop(1, "rgba(0,0,0,.16)");
  ctx.fillStyle = glass;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(w * 0.50, h * 0.53, 0, w * 0.50, h * 0.53, w * 0.42);
  glow.addColorStop(0, "rgba(142,190,255,.16)");
  glow.addColorStop(0.34, "rgba(244,191,96,.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.53, w * 0.40, h * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  drawStars(ctx, w, h);

  ctx.restore();
}

function drawStars(ctx, w, h) {
  const count = MOBILE ? 34 : 72;

  for (let i = 0; i < count; i += 1) {
    const x = hash(13, i, 1) * w;
    const y = hash(13, i, 2) * h;
    const pulse = 0.5 + Math.sin(state.sparkle * 0.85 + i * 0.77) * 0.5;
    const r = (0.45 + hash(13, i, 3) * 1.45) * DPR;

    ctx.fillStyle = i % 10 === 0
      ? `rgba(244,191,96,${0.16 + pulse * 0.28})`
      : `rgba(226,238,255,${0.13 + pulse * 0.24})`;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStageLabel(ctx, w, h) {
  const x = w * 0.08;
  const y = h * 0.080;
  const labelW = Math.min(w * 0.52, 520 * DPR);
  const labelH = 62 * DPR;
  const cut = 23 * DPR;

  ctx.save();

  ctx.fillStyle = "rgba(3,8,18,.72)";
  ctx.strokeStyle = "rgba(244,191,96,.34)";
  ctx.lineWidth = Math.max(1, DPR);

  facetPath(ctx, x, y, labelW, labelH, cut);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f4bf60";
  ctx.font = `950 ${clamp(w * 0.021, 13 * DPR, 24 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "0.08em";
  ctx.fillText("SOLID CROWN CUT · SPARKLING", x + 28 * DPR, y + labelH * 0.53);

  ctx.restore();
}

function drawCrownCutDiamond(ctx, w, h) {
  const cx = w * 0.50;
  const cy = h * 0.535;
  const scale = Math.min(w * 0.82, h * 1.04);
  const diamondW = scale * (MOBILE ? 0.86 : 0.82);
  const diamondH = diamondW * 0.47;

  const breathe = REDUCED_MOTION ? 0 : Math.sin(state.phase * 0.55) * 0.012;
  const tilt = REDUCED_MOTION ? 0 : Math.sin(state.phase * 0.38) * 0.020;

  const topY = cy - diamondH * (0.45 + breathe);
  const tableY = cy - diamondH * 0.36;
  const crownY = cy - diamondH * 0.20;
  const girdleY = cy;
  const pavilionY = cy + diamondH * 0.48;
  const culetY = cy + diamondH * 0.66;

  const leftX = cx - diamondW * 0.50;
  const rightX = cx + diamondW * 0.50;
  const upperLeftX = cx - diamondW * 0.38;
  const upperRightX = cx + diamondW * 0.38;
  const tableLeftX = cx - diamondW * 0.20;
  const tableRightX = cx + diamondW * 0.20;

  ctx.save();

  ctx.translate(cx, cy);
  ctx.transform(1, tilt, -tilt * 0.25, 1, 0, 0);
  ctx.translate(-cx, -cy);

  drawDiamondShadow(ctx, cx, culetY + diamondH * 0.11, diamondW, diamondH);

  const polygon = [
    [tableLeftX, tableY],
    [tableRightX, tableY],
    [upperRightX, topY + diamondH * 0.20],
    [rightX, girdleY],
    [cx, culetY],
    [leftX, girdleY],
    [upperLeftX, topY + diamondH * 0.20]
  ];

  ctx.save();
  ctx.beginPath();
  polygon.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.clip();

  drawDiamondBody(ctx, w, h, cx, cy, diamondW, diamondH, leftX, rightX, topY, girdleY, culetY);
  drawFacetBands(ctx, cx, diamondW, diamondH, topY, tableY, crownY, girdleY, pavilionY, culetY);
  drawCrownFacets(ctx, cx, diamondW, tableLeftX, tableRightX, upperLeftX, upperRightX, leftX, rightX, tableY, topY, crownY, girdleY);
  drawPavilionFacets(ctx, cx, diamondW, leftX, rightX, girdleY, pavilionY, culetY);
  drawInternalPrisms(ctx, cx, cy, diamondW, diamondH, leftX, rightX, topY, culetY);

  ctx.restore();

  drawDiamondOutline(ctx, polygon, tableLeftX, tableRightX, upperLeftX, upperRightX, leftX, rightX, cx, topY, tableY, crownY, girdleY, pavilionY, culetY);
  drawSparkles(ctx, cx, cy, diamondW, diamondH, topY, girdleY, culetY);

  ctx.restore();
}

function drawDiamondShadow(ctx, cx, y, diamondW, diamondH) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.46)";
  ctx.filter = `blur(${Math.max(12, diamondW * 0.035)}px)`;
  ctx.beginPath();
  ctx.ellipse(cx, y, diamondW * 0.20, diamondH * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();

  const glow = ctx.createRadialGradient(cx, y, 0, cx, y, diamondW * 0.20);
  glow.addColorStop(0, "rgba(244,191,96,.20)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.filter = "none";
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(cx, y, diamondW * 0.22, diamondH * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDiamondBody(ctx, w, h, cx, cy, diamondW, diamondH, leftX, rightX, topY, girdleY, culetY) {
  const body = ctx.createLinearGradient(leftX, topY, rightX, culetY);
  body.addColorStop(0, "rgba(255,255,255,.38)");
  body.addColorStop(0.11, "rgba(189,207,235,.28)");
  body.addColorStop(0.32, "rgba(77,94,137,.58)");
  body.addColorStop(0.52, "rgba(24,40,82,.74)");
  body.addColorStop(0.76, "rgba(88,112,158,.34)");
  body.addColorStop(1, "rgba(8,15,34,.88)");

  ctx.fillStyle = body;
  ctx.fillRect(leftX - 8, topY - 8, diamondW + 16, diamondH * 1.30);

  const topFlash = ctx.createRadialGradient(cx - diamondW * 0.26, topY + diamondH * 0.12, 0, cx - diamondW * 0.16, topY + diamondH * 0.22, diamondW * 0.46);
  topFlash.addColorStop(0, "rgba(255,255,255,.30)");
  topFlash.addColorStop(0.28, "rgba(142,190,255,.16)");
  topFlash.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topFlash;
  ctx.fillRect(leftX, topY, diamondW, diamondH);

  const deep = ctx.createRadialGradient(cx + diamondW * 0.14, girdleY + diamondH * 0.12, 0, cx + diamondW * 0.10, girdleY + diamondH * 0.16, diamondW * 0.48);
  deep.addColorStop(0, "rgba(1,5,15,.40)");
  deep.addColorStop(0.46, "rgba(3,8,26,.22)");
  deep.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = deep;
  ctx.fillRect(leftX, topY, diamondW, diamondH * 1.2);
}

function drawFacetBands(ctx, cx, diamondW, diamondH, topY, tableY, crownY, girdleY, pavilionY, culetY) {
  const bands = [
    { y: tableY, spread: 0.22, alpha: 0.46, width: 2.3 },
    { y: crownY, spread: 0.42, alpha: 0.34, width: 2.0 },
    { y: girdleY, spread: 0.50, alpha: 0.62, width: 2.7 },
    { y: pavilionY, spread: 0.25, alpha: 0.24, width: 1.7 }
  ];

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  bands.forEach((band) => {
    const gradient = ctx.createLinearGradient(cx - diamondW * band.spread, band.y, cx + diamondW * band.spread, band.y);
    gradient.addColorStop(0, `rgba(255,255,255,0)`);
    gradient.addColorStop(0.18, `rgba(142,190,255,${band.alpha * 0.40})`);
    gradient.addColorStop(0.50, `rgba(255,255,255,${band.alpha})`);
    gradient.addColorStop(0.82, `rgba(142,190,255,${band.alpha * 0.40})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, band.width * DPR);
    ctx.beginPath();
    ctx.moveTo(cx - diamondW * band.spread, band.y);
    ctx.lineTo(cx + diamondW * band.spread, band.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawCrownFacets(ctx, cx, diamondW, tableLeftX, tableRightX, upperLeftX, upperRightX, leftX, rightX, tableY, topY, crownY, girdleY) {
  const ribs = 18;

  ctx.save();

  for (let i = 0; i <= ribs; i += 1) {
    const t = i / ribs;
    const xTop = tableLeftX + (tableRightX - tableLeftX) * t;
    const xBottom = leftX + (rightX - leftX) * t;
    const alpha = 0.05 + Math.abs(0.5 - t) * 0.12;

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = Math.max(0.55, DPR * 0.62);
    ctx.beginPath();
    ctx.moveTo(xTop, tableY);
    ctx.lineTo(xBottom, girdleY);
    ctx.stroke();
  }

  const groups = [
    [tableLeftX, tableY, upperLeftX, topY + (crownY - topY) * 0.34, leftX, girdleY, "rgba(255,255,255,.08)"],
    [tableRightX, tableY, upperRightX, topY + (crownY - topY) * 0.34, rightX, girdleY, "rgba(255,255,255,.06)"],
    [tableLeftX, tableY, cx, crownY, tableRightX, tableY, "rgba(255,255,255,.11)"],
    [leftX, girdleY, cx, crownY, rightX, girdleY, "rgba(142,190,255,.08)"]
  ];

  groups.forEach(([ax, ay, bx, by, cx2, cy2, color]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx2, cy2);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

function drawPavilionFacets(ctx, cx, diamondW, leftX, rightX, girdleY, pavilionY, culetY) {
  const ribs = 24;

  ctx.save();

  for (let i = 0; i <= ribs; i += 1) {
    const t = i / ribs;
    const x = leftX + (rightX - leftX) * t;
    const alpha = 0.05 + Math.abs(0.5 - t) * 0.10;

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = Math.max(0.55, DPR * 0.58);
    ctx.beginPath();
    ctx.moveTo(x, girdleY);
    ctx.lineTo(cx, culetY);
    ctx.stroke();
  }

  for (let i = 0; i < 9; i += 1) {
    const t0 = i / 9;
    const t1 = (i + 1) / 9;
    const x0 = leftX + diamondW * t0;
    const x1 = leftX + diamondW * t1;
    const mid = (t0 + t1) * 0.5;
    const alpha = 0.035 + (1 - Math.abs(0.5 - mid) * 2) * 0.08;

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x0, girdleY);
    ctx.lineTo(x1, girdleY);
    ctx.lineTo(cx, culetY);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawInternalPrisms(ctx, cx, cy, diamondW, diamondH, leftX, rightX, topY, culetY) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  const flashes = [
    { x0: leftX + diamondW * 0.10, y0: topY + diamondH * 0.24, x1: cx - diamondW * 0.03, y1: culetY - diamondH * 0.02, a: 0.18, w: 4.0 },
    { x0: cx - diamondW * 0.27, y0: topY + diamondH * 0.05, x1: cx + diamondW * 0.10, y1: culetY - diamondH * 0.18, a: 0.15, w: 3.0 },
    { x0: cx + diamondW * 0.24, y0: topY + diamondH * 0.16, x1: cx + diamondW * 0.18, y1: culetY - diamondH * 0.10, a: 0.17, w: 3.4 },
    { x0: cx - diamondW * 0.04, y0: topY + diamondH * 0.02, x1: cx - diamondW * 0.04, y1: culetY - diamondH * 0.08, a: 0.12, w: 2.4 }
  ];

  flashes.forEach((flash, index) => {
    const pulse = 0.65 + Math.sin(state.sparkle * 1.6 + index * 1.2) * 0.35;
    const gradient = ctx.createLinearGradient(flash.x0, flash.y0, flash.x1, flash.y1);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.42, `rgba(255,255,255,${flash.a * pulse})`);
    gradient.addColorStop(0.52, `rgba(244,191,96,${flash.a * 0.50 * pulse})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, flash.w * DPR);
    ctx.beginPath();
    ctx.moveTo(flash.x0, flash.y0);
    ctx.lineTo(flash.x1, flash.y1);
    ctx.stroke();
  });

  ctx.restore();
}

function drawDiamondOutline(ctx, polygon, tableLeftX, tableRightX, upperLeftX, upperRightX, leftX, rightX, cx, topY, tableY, crownY, girdleY, pavilionY, culetY) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  ctx.strokeStyle = "rgba(255,255,255,.36)";
  ctx.lineWidth = Math.max(1.1, DPR * 1.2);

  ctx.beginPath();
  polygon.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgba(244,191,96,.20)";
  ctx.lineWidth = Math.max(0.8, DPR);
  ctx.beginPath();
  ctx.moveTo(leftX, girdleY);
  ctx.lineTo(rightX, girdleY);
  ctx.moveTo(tableLeftX, tableY);
  ctx.lineTo(tableRightX, tableY);
  ctx.moveTo(cx, tableY);
  ctx.lineTo(cx, culetY);
  ctx.stroke();

  ctx.restore();
}

function drawSparkles(ctx, cx, cy, diamondW, diamondH, topY, girdleY, culetY) {
  const points = [
    { x: cx + diamondW * 0.20, y: topY + diamondH * 0.23, s: 1.10, phase: 0.2 },
    { x: cx - diamondW * 0.26, y: girdleY - diamondH * 0.10, s: 0.72, phase: 1.4 },
    { x: cx + diamondW * 0.02, y: culetY - diamondH * 0.14, s: 0.88, phase: 2.2 },
    { x: cx - diamondW * 0.03, y: topY + diamondH * 0.02, s: 0.60, phase: 3.1 },
    { x: cx + diamondW * 0.33, y: girdleY + diamondH * 0.01, s: 0.54, phase: 3.8 }
  ];

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  points.forEach((point) => {
    const pulse = REDUCED_MOTION ? 0.55 : 0.30 + Math.max(0, Math.sin(state.sparkle * 1.35 + point.phase)) * 0.70;
    const len = diamondW * 0.030 * point.s * pulse;

    ctx.strokeStyle = `rgba(255,255,255,${0.28 + pulse * 0.52})`;
    ctx.lineWidth = Math.max(0.9, DPR * 1.0);
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(point.x - len, point.y);
    ctx.lineTo(point.x + len, point.y);
    ctx.moveTo(point.x, point.y - len);
    ctx.lineTo(point.x, point.y + len);
    ctx.stroke();

    ctx.strokeStyle = `rgba(244,191,96,${0.12 + pulse * 0.22})`;
    ctx.beginPath();
    ctx.moveTo(point.x - len * 0.62, point.y - len * 0.62);
    ctx.lineTo(point.x + len * 0.62, point.y + len * 0.62);
    ctx.moveTo(point.x + len * 0.62, point.y - len * 0.62);
    ctx.lineTo(point.x - len * 0.62, point.y + len * 0.62);
    ctx.stroke();
  });

  ctx.restore();
}

function drawRouteCue(ctx, w, h) {
  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,194,207,.66)";
  ctx.font = `850 ${clamp(w * 0.021, 13 * DPR, 22 * DPR)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Cover → Globe Showcase → Private Inspection.", w * 0.5, h * 0.925);

  ctx.restore();
}

function facetPath(ctx, x, y, w, h, cut) {
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + w - cut, y);
  ctx.lineTo(x + w, y + cut);
  ctx.lineTo(x + w, y + h - cut);
  ctx.lineTo(x + w - cut, y + h);
  ctx.lineTo(x + cut, y + h);
  ctx.lineTo(x, y + h - cut);
  ctx.lineTo(x, y + cut);
  ctx.closePath();
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";
    if (state.active) startLoop();
    else stopLoop();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.mount) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;
      if (state.visible) startLoop();
      else stopLoop();
    }, { threshold: 0.05 });

    observer.observe(state.mount);
  }
}

function installResize() {
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__showroomDiamondResizeTimer);
    window.__showroomDiamondResizeTimer = window.setTimeout(() => {
      sizeCanvas();
      render();
    }, 140);
  }, { passive: true });
}

function frame(time = 0) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  if (time - state.lastFrame >= FRAME_MS) {
    state.lastFrame = time;

    if (!REDUCED_MOTION) {
      state.phase += MOBILE ? 0.010 : 0.014;
      state.sparkle += MOBILE ? 0.030 : 0.045;
    }

    render();
  }

  state.raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (state.raf || !state.active || !state.visible) return;
  state.lastFrame = 0;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

function boot() {
  state.canvas = byId("showroomDiamondCanvas");
  state.mount = byId("showroomDiamondMount");

  if (!state.canvas || !state.mount) return;

  state.mount.classList.add("diamond-loaded");

  sizeCanvas();
  installVisibility();
  installResize();
  render();
  startLoop();

  window.DGBShowroomDiamond = {
    contract: CONTRACT,
    status() {
      return {
        contract: CONTRACT,
        generatedImage: false,
        graphicBox: false,
        publicCopyClean: true,
        canvas: true
      };
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export default {
  contract: CONTRACT
};
