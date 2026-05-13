const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DIAMOND_CRYSTAL_CLARITY_VISUAL_RESTORE_TNT_v3",
  route: "/showroom/",
  role: "showroom-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  visualMode: "crystal-clarity-sparkle",
  earthRecord: false,
  generatedImage: false,
  graphicBox: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const SEGMENTS = 32;

const state = {
  yaw: 0.08,
  pitch: -0.03,
  velocityYaw: 0,
  velocityPitch: 0,
  sparklePhase: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  dpr: 1
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function markRoute() {
  document.documentElement.dataset.showroomStatus = "crystal-diamond-restored";
  document.documentElement.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.documentElement.dataset.touchGlideDiamond = "true";
  document.documentElement.dataset.diamondCrystalClarity = "true";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.showroomStatus = "crystal-diamond-restored";
  document.body.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.body.dataset.touchGlideDiamond = "true";
  document.body.dataset.diamondCrystalClarity = "true";
  document.body.dataset.earthRecord = "false";
}

function protectIdentity() {
  const title = document.querySelector("title");
  if (title && /Earth/i.test(title.textContent || "")) {
    title.textContent = "Showroom · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "The Diamond holds the room.";
  }
}

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(500, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  state.dpr = dpr;
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function makeRing(cx, y, rx, ry, depth, offset = 0) {
  const points = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const a = (i / SEGMENTS) * TAU + offset;
    const z = Math.sin(a);
    const x = Math.cos(a);
    const ripple = 1 + 0.018 * Math.sin(i * PHI + depth * 3.7);
    const yawShift = state.yaw * z * rx * 0.34;
    const pitchShift = state.pitch * z * ry * 0.32;

    points.push({
      x: cx + x * rx * ripple + yawShift,
      y: y + z * ry + pitchShift,
      z: z + depth,
      angle: a,
      index: i
    });
  }

  return points;
}

function buildDiamondGeometry(width, height) {
  const size = Math.min(width * 0.90, height * 0.72);
  const diamondWidth = size;
  const diamondHeight = size * 0.57;
  const cx = width * 0.5;
  const cy = height * 0.455;

  const table = makeRing(cx, cy - diamondHeight * 0.315, diamondWidth * 0.245, diamondHeight * 0.030, 0.46, TAU / 64);
  const crown = makeRing(cx, cy - diamondHeight * 0.245, diamondWidth * 0.410, diamondHeight * 0.048, 0.30, 0);
  const girdleTop = makeRing(cx, cy - diamondHeight * 0.045, diamondWidth * 0.490, diamondHeight * 0.052, 0.03, TAU / 64);
  const girdleBottom = makeRing(cx, cy + diamondHeight * 0.060, diamondWidth * 0.470, diamondHeight * 0.042, -0.08, 0);
  const pavilion = makeRing(cx, cy + diamondHeight * 0.215, diamondWidth * 0.225, diamondHeight * 0.030, -0.26, TAU / 64);

  const tableCenter = {
    x: cx + state.yaw * diamondWidth * 0.018,
    y: cy - diamondHeight * 0.338 + state.pitch * diamondHeight * 0.05,
    z: 0.56,
    angle: 0,
    index: -1
  };

  const culet = {
    x: cx + state.yaw * diamondWidth * 0.050,
    y: cy + diamondHeight * 0.405 + state.pitch * diamondHeight * 0.08,
    z: -0.42,
    angle: 0,
    index: -2
  };

  const faces = [];

  faces.push({
    type: "table",
    points: table.slice(),
    tone: 1.22,
    z: 0.62
  });

  for (let i = 0; i < SEGMENTS; i += 1) {
    const n = (i + 1) % SEGMENTS;

    faces.push({
      type: "star",
      points: [tableCenter, table[i], table[n]],
      tone: 1.34,
      z: averageZ([tableCenter, table[i], table[n]])
    });

    faces.push({
      type: "upper-crown",
      points: [table[i], crown[i], crown[n], table[n]],
      tone: 1.18,
      z: averageZ([table[i], crown[i], crown[n], table[n]])
    });

    faces.push({
      type: "lower-crown",
      points: [crown[i], girdleTop[i], girdleTop[n], crown[n]],
      tone: 1.06,
      z: averageZ([crown[i], girdleTop[i], girdleTop[n], crown[n]])
    });

    faces.push({
      type: "girdle",
      points: [girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]],
      tone: 0.88,
      z: averageZ([girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]])
    });

    faces.push({
      type: "pavilion-upper",
      points: [girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]],
      tone: 0.98,
      z: averageZ([girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]])
    });

    faces.push({
      type: "pavilion-lower",
      points: [pavilion[i], culet, pavilion[n]],
      tone: 1.06,
      z: averageZ([pavilion[i], culet, pavilion[n]])
    });
  }

  return {
    cx,
    cy,
    diamondWidth,
    diamondHeight,
    table,
    crown,
    girdleTop,
    girdleBottom,
    pavilion,
    culet,
    tableCenter,
    faces
  };
}

function averageZ(points) {
  return points.reduce((sum, point) => sum + point.z, 0) / Math.max(1, points.length);
}

function centroid(points) {
  return points.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      acc.z += point.z;
      return acc;
    },
    { x: 0, y: 0, z: 0 }
  );
}

function drawPolygon(ctx, points) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
}

function faceStyle(ctx, face, faceIndex) {
  const center = centroid(face.points);
  const count = Math.max(1, face.points.length);
  center.x /= count;
  center.y /= count;
  center.z /= count;

  const angle = face.points[0]?.angle || 0;
  const front = clamp((center.z + 1.15) / 2.25, 0, 1);
  const directional = 0.5 + 0.5 * Math.cos(angle - state.yaw * 1.8);
  const pulse = 0.5 + 0.5 * Math.sin(state.sparklePhase * 1.7 + faceIndex * PHI);
  const brightness = clamp((0.30 + front * 0.38 + directional * 0.22 + pulse * 0.13) * face.tone, 0.18, 1.32);

  const cool = clamp(0.20 + front * 0.40, 0.18, 0.72);
  const warm = clamp(0.05 + directional * 0.12, 0.04, 0.22);

  const r = Math.round(126 + brightness * 102 + warm * 32);
  const g = Math.round(154 + brightness * 92 + cool * 20);
  const b = Math.round(188 + brightness * 76 + cool * 42);

  const alphaByType = {
    table: 0.48,
    star: 0.40,
    "upper-crown": 0.42,
    "lower-crown": 0.38,
    girdle: 0.28,
    "pavilion-upper": 0.34,
    "pavilion-lower": 0.38
  };

  const alpha = clamp((alphaByType[face.type] || 0.34) + brightness * 0.13, 0.22, 0.64);
  const strokeAlpha = clamp(0.18 + brightness * 0.32, 0.16, 0.58);

  const gradient = ctx.createLinearGradient(center.x - 80, center.y - 60, center.x + 90, center.y + 72);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${clamp(alpha + 0.08, 0, 0.76)})`);
  gradient.addColorStop(0.34, `rgba(${r}, ${g}, ${b}, ${alpha})`);
  gradient.addColorStop(0.72, `rgba(${Math.round(r * 0.64)}, ${Math.round(g * 0.72)}, ${Math.round(b * 0.88)}, ${alpha * 0.78})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.30})`);

  return {
    fill: gradient,
    stroke: `rgba(232, 242, 255, ${strokeAlpha})`
  };
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(4, 11, 24, 0.96)");
  bg.addColorStop(0.48, "rgba(7, 18, 36, 0.97)");
  bg.addColorStop(1, "rgba(2, 7, 16, 0.99)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.50,
    width * 0.03,
    width * 0.5,
    height * 0.52,
    width * 0.56
  );
  glow.addColorStop(0, "rgba(244, 250, 255, 0.13)");
  glow.addColorStop(0.42, "rgba(96, 139, 190, 0.10)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 58; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.10 + seededUnit(i, 3) * 0.22;
    const size = i % 13 === 0 ? 7 : i % 5 === 0 ? 3.5 : 1.3;

    ctx.strokeStyle = `rgba(235, 244, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCrystalBody(ctx, geo, width) {
  const sortedFaces = geo.faces
    .map((face, index) => ({ face, index }))
    .sort((a, b) => a.face.z - b.face.z);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  sortedFaces.forEach(({ face, index }) => {
    const style = faceStyle(ctx, face, index);

    drawPolygon(ctx, face.points);
    ctx.fillStyle = style.fill;
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = Math.max(0.75, width * 0.00122);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

function drawRing(ctx, ring, width, alpha) {
  ctx.strokeStyle = `rgba(232, 242, 255, ${alpha})`;
  ctx.lineWidth = Math.max(0.7, width * 0.0011);
  ctx.beginPath();

  ring.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
  ctx.stroke();
}

function drawLine(ctx, a, b, width, alpha) {
  ctx.strokeStyle = `rgba(232, 242, 255, ${alpha})`;
  ctx.lineWidth = Math.max(0.65, width * 0.001);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawLattice(ctx, geo, width) {
  ctx.save();

  drawRing(ctx, geo.table, width, 0.42);
  drawRing(ctx, geo.crown, width, 0.34);
  drawRing(ctx, geo.girdleTop, width, 0.38);
  drawRing(ctx, geo.girdleBottom, width, 0.28);
  drawRing(ctx, geo.pavilion, width, 0.24);

  for (let i = 0; i < SEGMENTS; i += 2) {
    drawLine(ctx, geo.table[i], geo.crown[i], width, 0.24);
    drawLine(ctx, geo.crown[i], geo.girdleTop[i], width, 0.24);
    drawLine(ctx, geo.girdleBottom[i], geo.pavilion[i], width, 0.22);
    drawLine(ctx, geo.pavilion[i], geo.culet, width, 0.24);
  }

  for (let i = 1; i < SEGMENTS; i += 4) {
    drawLine(ctx, geo.crown[i], geo.girdleTop[(i + 5) % SEGMENTS], width, 0.14);
    drawLine(ctx, geo.girdleBottom[i], geo.pavilion[(i + 7) % SEGMENTS], width, 0.13);
  }

  ctx.restore();
}

function drawPrismDispersion(ctx, geo, width) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const left = geo.girdleTop[16];
  const right = geo.girdleTop[0];
  const top = geo.table[8];
  const lower = geo.pavilion[24];

  const marks = [
    { point: left, color: "rgba(106, 182, 255, 0.32)", dx: -42, dy: 6 },
    { point: left, color: "rgba(255, 206, 122, 0.25)", dx: -28, dy: -12 },
    { point: right, color: "rgba(106, 182, 255, 0.34)", dx: 44, dy: -4 },
    { point: right, color: "rgba(255, 196, 118, 0.25)", dx: 30, dy: 14 },
    { point: top, color: "rgba(255, 255, 255, 0.30)", dx: 18, dy: -26 },
    { point: lower, color: "rgba(130, 205, 255, 0.24)", dx: -22, dy: 18 }
  ];

  marks.forEach((mark) => {
    ctx.strokeStyle = mark.color;
    ctx.lineWidth = Math.max(1, width * 0.0014);
    ctx.beginPath();
    ctx.moveTo(mark.point.x, mark.point.y);
    ctx.lineTo(mark.point.x + mark.dx * state.dpr, mark.point.y + mark.dy * state.dpr);
    ctx.stroke();
  });

  ctx.restore();
}

function drawStarGlint(ctx, x, y, radius, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = radius * state.dpr;
  const inner = outer * 0.34;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, outer * 2.2);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.62 * alpha})`);
  glow.addColorStop(0.28, `rgba(160, 210, 255, ${0.24 * alpha})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, outer * 2.2, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.82 * alpha})`;
  ctx.lineWidth = Math.max(1, outer * 0.055);

  ctx.beginPath();
  ctx.moveTo(x - outer, y);
  ctx.lineTo(x + outer, y);
  ctx.moveTo(x, y - outer);
  ctx.lineTo(x, y + outer);
  ctx.stroke();

  ctx.strokeStyle = `rgba(190, 225, 255, ${0.48 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(x - inner, y - inner);
  ctx.lineTo(x + inner, y + inner);
  ctx.moveTo(x + inner, y - inner);
  ctx.lineTo(x - inner, y + inner);
  ctx.stroke();

  ctx.restore();
}

function drawSparkles(ctx, geo) {
  const pulseA = 0.55 + 0.45 * Math.sin(state.sparklePhase * 2.2);
  const pulseB = 0.55 + 0.45 * Math.sin(state.sparklePhase * 1.7 + 1.8);

  drawStarGlint(ctx, geo.table[8].x, geo.table[8].y - 8 * state.dpr, 13, 0.88 * pulseA);
  drawStarGlint(ctx, geo.girdleTop[0].x, geo.girdleTop[0].y, 10, 0.86 * pulseB);
  drawStarGlint(ctx, geo.girdleTop[16].x, geo.girdleTop[16].y, 9, 0.75 * pulseA);
  drawStarGlint(ctx, geo.culet.x, geo.culet.y, 12, 0.76 * pulseB);
  drawStarGlint(ctx, geo.crown[5].x, geo.crown[5].y, 6, 0.52 * pulseA);
  drawStarGlint(ctx, geo.pavilion[21].x, geo.pavilion[21].y, 7, 0.48 * pulseB);
}

function drawAuraAndShadow(ctx, geo, width, height) {
  const aura = ctx.createRadialGradient(
    geo.cx,
    geo.cy,
    geo.diamondWidth * 0.05,
    geo.cx,
    geo.cy + geo.diamondHeight * 0.08,
    geo.diamondWidth * 0.78
  );
  aura.addColorStop(0, "rgba(255, 255, 255, 0.13)");
  aura.addColorStop(0.28, "rgba(147, 188, 235, 0.10)");
  aura.addColorStop(0.60, "rgba(244, 207, 131, 0.055)");
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const shadow = ctx.createRadialGradient(
    geo.cx,
    geo.cy + geo.diamondHeight * 0.48,
    geo.diamondWidth * 0.05,
    geo.cx,
    geo.cy + geo.diamondHeight * 0.48,
    geo.diamondWidth * 0.34
  );
  shadow.addColorStop(0, "rgba(244, 207, 131, 0.15)");
  shadow.addColorStop(0.46, "rgba(82, 109, 146, 0.14)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(
    geo.cx,
    geo.cy + geo.diamondHeight * 0.48,
    geo.diamondWidth * 0.28,
    geo.diamondHeight * 0.050,
    0,
    0,
    TAU
  );
  ctx.fill();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height);
  drawStars(ctx, width, height);

  const geo = buildDiamondGeometry(width, height);

  drawAuraAndShadow(ctx, geo, width, height);
  drawCrystalBody(ctx, geo, width);
  drawPrismDispersion(ctx, geo, width);
  drawLattice(ctx, geo, width);
  drawSparkles(ctx, geo);
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  state.sparklePhase += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.18, 0.18);

    const damping = Math.pow(0.950, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;

    if (Math.abs(state.velocityYaw) < 0.00006) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00006) state.velocityPitch = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.sparklePhase * 0.42) * dt * 0.010;
    }
  }

  state.yaw = clamp(state.yaw, -0.42, 0.42);

  render(canvas, ctx);
  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) {
      resetDiamond();
    }

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw = clamp(state.yaw + dx * 0.0022, -0.42, 0.42);
    state.pitch = clamp(state.pitch - dy * 0.0016, -0.18, 0.18);

    state.velocityYaw = dx * 0.00078;
    state.velocityPitch = -dy * 0.00054;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetDiamond() {
  state.yaw = 0.08;
  state.pitch = -0.03;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.sparklePhase = 0;
}

function initShowroomDiamond() {
  markRoute();
  protectIdentity();

  const stage = document.querySelector("[data-showroom-diamond-stage]");
  const canvas = document.querySelector("[data-showroom-diamond-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;

  bindPointer(stage);
  resizeCanvas(canvas);
  render(canvas, ctx);

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBShowroomDiamond = Object.freeze({
    ...SHOWROOM_DIAMOND_STATE,
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: true,
        fixedForm: true,
        crownCut: true,
        lattice256: true,
        crystalClarity: true,
        sparkle: true,
        momentum: true,
        doubleTapReset: true
      });
    }
  });

  return window.DGBShowroomDiamond;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShowroomDiamond, { once: true });
} else {
  initShowroomDiamond();
}

export { SHOWROOM_DIAMOND_STATE, initShowroomDiamond };
export default SHOWROOM_DIAMOND_STATE;
