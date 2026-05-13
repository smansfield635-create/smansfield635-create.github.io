const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_CRYSTAL_CLARITY_DIAMOND_RENDER_TNT_v3",
  route: "/showroom/",
  role: "showroom-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  crystalClarity: true,
  touchGlide: true,
  earthRecord: false,
  generatedImage: false,
  graphicBox: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const SEGMENTS = 32;

const state = {
  rotationX: -0.34,
  rotationY: 0.42,
  velocityX: 0,
  velocityY: 0,
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

function normalize3(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function subtract3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function rotatePoint(point) {
  let [x, y, z] = point;

  const cx = Math.cos(state.rotationX);
  const sx = Math.sin(state.rotationX);
  const cy = Math.cos(state.rotationY);
  const sy = Math.sin(state.rotationY);

  const y1 = y * cx - z * sx;
  const z1 = y * sx + z * cx;

  const x2 = x * cy + z1 * sy;
  const z2 = -x * sy + z1 * cy;

  return [x2, y1, z2];
}

function projectPoint(point, width, height, scale) {
  const rotated = rotatePoint(point);
  const camera = 4.35;
  const perspective = camera / (camera - rotated[2] * 0.74);

  return {
    x: width * 0.5 + rotated[0] * scale * perspective,
    y: height * 0.47 + rotated[1] * scale * perspective,
    z: rotated[2],
    raw: rotated
  };
}

function makeRing(radiusX, y, radiusZ, offset = 0, ripple = 0) {
  const ring = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const angle = (i / SEGMENTS) * TAU + offset;
    const r = 1 + ripple * Math.sin(i * PHI * 2.0);
    ring.push([
      Math.cos(angle) * radiusX * r,
      y,
      Math.sin(angle) * radiusZ * r
    ]);
  }

  return ring;
}

function buildCrownCutDiamond() {
  const table = makeRing(0.50, -0.66, 0.14, TAU / 64, 0.012);
  const crown = makeRing(0.82, -0.42, 0.24, 0, 0.015);
  const girdleTop = makeRing(1.32, -0.02, 0.39, TAU / 64, 0.018);
  const girdleBottom = makeRing(1.24, 0.18, 0.36, 0, 0.014);
  const pavilion = makeRing(0.42, 0.66, 0.13, TAU / 64, 0.010);

  const tableCenter = [0, -0.72, 0];
  const culet = [0, 1.04, 0];

  const faces = [];

  faces.push({
    type: "table",
    points: table.slice(),
    tone: 1.22
  });

  for (let i = 0; i < SEGMENTS; i += 1) {
    const n = (i + 1) % SEGMENTS;

    faces.push({ type: "star", points: [tableCenter, table[i], table[n]], tone: 1.22 });
    faces.push({ type: "upper-crown", points: [table[i], crown[i], crown[n], table[n]], tone: 1.10 });
    faces.push({ type: "lower-crown", points: [crown[i], girdleTop[i], girdleTop[n], crown[n]], tone: 1.00 });
    faces.push({ type: "girdle", points: [girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]], tone: 0.82 });
    faces.push({ type: "pavilion-upper", points: [girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]], tone: 0.92 });
    faces.push({ type: "pavilion-lower", points: [pavilion[i], culet, pavilion[n]], tone: 0.90 });
  }

  return Object.freeze({
    faces,
    rings: Object.freeze({ table, crown, girdleTop, girdleBottom, pavilion }),
    culet,
    tableCenter
  });
}

const diamond = buildCrownCutDiamond();

function faceDepth(face) {
  return face.points.reduce((sum, point) => sum + rotatePoint(point)[2], 0) / face.points.length;
}

function faceNormal(face) {
  if (face.points.length < 3) return [0, 0, 1];

  const a = rotatePoint(face.points[0]);
  const b = rotatePoint(face.points[1]);
  const c = rotatePoint(face.points[2]);

  return normalize3(cross3(subtract3(b, a), subtract3(c, a)));
}

function colorForFace(face, index) {
  const normal = faceNormal(face);
  const light = normalize3([-0.44, -0.78, 0.96]);
  const rimLight = normalize3([0.76, -0.16, 0.52]);
  const underLight = normalize3([-0.12, 0.88, 0.32]);

  const front = clamp((normal[2] + 1) * 0.5, 0, 1);
  const diffuse = Math.max(0, dot3(normal, light));
  const rim = Math.max(0, dot3(normal, rimLight));
  const under = Math.max(0, dot3(normal, underLight));
  const glint = 0.5 + 0.5 * Math.sin(index * PHI + state.rotationY * 3.1);

  const clarity = clamp(
    0.20 + diffuse * 0.42 + rim * 0.28 + under * 0.10 + front * 0.12 + glint * 0.10,
    0.16,
    1.0
  ) * face.tone;

  const blue = clamp(clarity, 0, 1);
  const gold = clamp(glint * rim * 1.2, 0, 1);

  const r = Math.round(150 + blue * 86 + gold * 28);
  const g = Math.round(180 + blue * 62 + gold * 18);
  const b = Math.round(215 + blue * 38);

  const alphaByType = {
    table: 0.28,
    star: 0.24,
    "upper-crown": 0.25,
    "lower-crown": 0.23,
    girdle: 0.18,
    "pavilion-upper": 0.22,
    "pavilion-lower": 0.24
  };

  const alpha = clamp((alphaByType[face.type] || 0.22) + clarity * 0.14, 0.16, 0.44);
  const stroke = clamp(0.26 + clarity * 0.42, 0.24, 0.74);

  return {
    fill: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    stroke: `rgba(246, 252, 255, ${stroke})`,
    shine: `rgba(255, 244, 198, ${clamp(gold * 0.42, 0.04, 0.28)})`
  };
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

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 9, 21, 0.98)");
  bg.addColorStop(0.50, "rgba(5, 15, 32, 0.98)");
  bg.addColorStop(1, "rgba(2, 6, 14, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.49,
    width * 0.04,
    width * 0.5,
    height * 0.52,
    width * 0.46
  );
  glow.addColorStop(0, "rgba(205, 232, 255, 0.18)");
  glow.addColorStop(0.38, "rgba(122, 174, 220, 0.10)");
  glow.addColorStop(0.72, "rgba(244, 207, 131, 0.05)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 54; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.08 + seededUnit(i, 3) * 0.22;
    const size = i % 11 === 0 ? 7 : i % 5 === 0 ? 3.5 : 1.4;

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

function drawFace(ctx, face, index, width, height, scale) {
  const points = face.points.map((point) => projectPoint(point, width, height, scale));
  const color = colorForFace(face, index);

  ctx.beginPath();
  points.forEach((point, pointIndex) => {
    if (pointIndex === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();

  ctx.fillStyle = color.fill;
  ctx.strokeStyle = color.stroke;
  ctx.lineWidth = Math.max(0.8, width * 0.00135);
  ctx.fill();
  ctx.stroke();

  if (face.type === "table" || face.type === "star" || face.type === "upper-crown") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = color.shine;
    ctx.fill();
    ctx.restore();
  }
}

function drawEdge(ctx, a, b, width, height, scale, alpha = 0.32, lineScale = 1) {
  const pa = projectPoint(a, width, height, scale);
  const pb = projectPoint(b, width, height, scale);

  ctx.strokeStyle = `rgba(248, 253, 255, ${alpha})`;
  ctx.lineWidth = Math.max(0.75, width * 0.00105 * lineScale);
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
}

function drawRing(ctx, ring, width, height, scale, alpha = 0.34) {
  for (let i = 0; i < ring.length; i += 1) {
    drawEdge(ctx, ring[i], ring[(i + 1) % ring.length], width, height, scale, alpha, 1.12);
  }
}

function drawLattice(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  drawRing(ctx, diamond.rings.table, width, height, scale, 0.58);
  drawRing(ctx, diamond.rings.crown, width, height, scale, 0.45);
  drawRing(ctx, diamond.rings.girdleTop, width, height, scale, 0.50);
  drawRing(ctx, diamond.rings.girdleBottom, width, height, scale, 0.34);
  drawRing(ctx, diamond.rings.pavilion, width, height, scale, 0.34);

  for (let i = 0; i < SEGMENTS; i += 2) {
    drawEdge(ctx, diamond.rings.table[i], diamond.rings.girdleTop[i], width, height, scale, 0.36);
    drawEdge(ctx, diamond.rings.girdleBottom[i], diamond.culet, width, height, scale, 0.34);
  }

  for (let i = 1; i < SEGMENTS; i += 4) {
    drawEdge(ctx, diamond.rings.crown[i], diamond.rings.pavilion[(i + 3) % SEGMENTS], width, height, scale, 0.20);
  }

  ctx.restore();
}

function drawPrismCuts(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const cuts = [
    [diamond.rings.table[2], diamond.rings.girdleBottom[10], "rgba(190, 230, 255, 0.20)"],
    [diamond.rings.table[7], diamond.rings.pavilion[17], "rgba(255, 238, 180, 0.18)"],
    [diamond.rings.crown[13], diamond.rings.girdleTop[25], "rgba(205, 255, 245, 0.16)"],
    [diamond.rings.girdleTop[4], diamond.rings.pavilion[28], "rgba(255, 255, 255, 0.15)"],
    [diamond.rings.crown[21], diamond.rings.girdleBottom[31], "rgba(170, 210, 255, 0.18)"]
  ];

  cuts.forEach(([a, b, color], index) => {
    const pa = projectPoint(a, width, height, scale);
    const pb = projectPoint(b, width, height, scale);

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.9, width * (0.0011 + index * 0.00008));
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawGlints(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const candidates = [
    diamond.rings.table[3],
    diamond.rings.table[10],
    diamond.rings.crown[6],
    diamond.rings.girdleTop[10],
    diamond.rings.girdleTop[19],
    diamond.rings.pavilion[25],
    diamond.rings.crown[28]
  ];

  candidates.forEach((point, index) => {
    const projected = projectPoint(point, width, height, scale);
    const pulse = 0.45 + 0.55 * Math.sin(performance.now() * 0.0016 + index * PHI);
    const size = (5 + index * 0.85) * state.dpr;

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.20 + pulse * 0.46})`;
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.beginPath();
    ctx.moveTo(projected.x - size, projected.y);
    ctx.lineTo(projected.x + size, projected.y);
    ctx.moveTo(projected.x, projected.y - size);
    ctx.lineTo(projected.x, projected.y + size);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 244, 198, ${0.04 + pulse * 0.11})`;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size * 0.52, 0, TAU);
    ctx.fill();
  });

  ctx.restore();
}

function drawDiamond(ctx, width, height) {
  const scale = Math.min(width, height) * 0.365;

  const aura = ctx.createRadialGradient(
    width * 0.5,
    height * 0.50,
    scale * 0.10,
    width * 0.5,
    height * 0.54,
    scale * 1.64
  );
  aura.addColorStop(0, "rgba(220, 242, 255, 0.24)");
  aura.addColorStop(0.34, "rgba(138, 188, 238, 0.13)");
  aura.addColorStop(0.58, "rgba(255, 231, 172, 0.06)");
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const sortedFaces = diamond.faces
    .map((face, index) => ({ face, index, depth: faceDepth(face) }))
    .sort((a, b) => a.depth - b.depth);

  sortedFaces.forEach((item) => {
    drawFace(ctx, item.face, item.index, width, height, scale);
  });

  drawPrismCuts(ctx, width, height, scale);
  drawLattice(ctx, width, height, scale);
  drawGlints(ctx, width, height, scale);

  const shadow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.72,
    scale * 0.05,
    width * 0.5,
    height * 0.72,
    scale * 0.48
  );
  shadow.addColorStop(0, "rgba(244, 207, 131, 0.12)");
  shadow.addColorStop(0.42, "rgba(88, 116, 153, 0.12)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.72, scale * 0.58, scale * 0.10, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height);
  drawStars(ctx, width, height);
  drawDiamond(ctx, width, height);
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);

  if (!state.dragging) {
    state.rotationY += state.velocityY;
    state.rotationX = clamp(state.rotationX + state.velocityX, -0.82, 0.62);

    const damping = Math.pow(0.948, dt * 60);
    state.velocityY *= damping;
    state.velocityX *= damping;

    if (Math.abs(state.velocityY) < 0.00008) state.velocityY = 0;
    if (Math.abs(state.velocityX) < 0.00008) state.velocityX = 0;

    if (state.velocityX === 0 && state.velocityY === 0) {
      state.rotationY += dt * 0.026;
    }
  }

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
    state.velocityX = 0;
    state.velocityY = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.rotationY += dx * 0.0064;
    state.rotationX = clamp(state.rotationX - dy * 0.0049, -0.82, 0.62);

    state.velocityY = dx * 0.0019;
    state.velocityX = -dy * 0.00125;
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
  state.rotationX = -0.34;
  state.rotationY = 0.42;
  state.velocityX = 0;
  state.velocityY = 0;
}

function markRoute() {
  document.documentElement.dataset.showroomStatus = "crystal-diamond-render-restored";
  document.documentElement.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.documentElement.dataset.crystalClarity = "true";
  document.documentElement.dataset.touchGlideDiamond = "true";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.showroomStatus = "crystal-diamond-render-restored";
  document.body.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.body.dataset.crystalClarity = "true";
  document.body.dataset.touchGlideDiamond = "true";
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
