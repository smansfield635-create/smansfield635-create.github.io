// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TNT_v2
// Paired HTML cache key: SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TNT_v2
// Scope: active /showroom/ Diamond renderer only.
// Purpose:
// - Crystal Form must read as a dimensional cut diamond, not a flat badge.
// - Lattice Structure remains a separate structural science lens.
// - Same Diamond identity, different inspection lens.
// - 16 radial compass metric preserved.
// - No generated image. No graphic box. No legacy Globe / Planet One / Demo Universe inheritance.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TNT_v2",
  pairedHtmlContract: "SHOWROOM_DUAL_LENS_DIAMOND_HTML_JS_CACHE_BIND_TNT_v2",
  route: "/showroom/",
  role: "showroom-dual-lens-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  inspectionControl: "solid-body-camera-view",
  geometryMutableByTouch: false,
  defaultLens: "crystal",
  secondaryLens: "lattice",
  lensRule: "toggle-changes-inspection-lens-not-object-identity",
  visibleRadialMetric: 16,
  latticeStates: 256,
  crystalFormSilhouette: "dimensional-crown-cut-diamond-body",
  latticeFormSilhouette: "structural-compass-lattice-field",
  crystalAndLatticeAreVisuallyDistinct: true,
  generatedImage: false,
  graphicBox: false,
  earthRecord: false,
  legacyGlobeInheritance: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const RADIAL_POINTS = 16;
const LATTICE_STATES = 256;

const LENS_COPY = Object.freeze({
  crystal: {
    title: "Crystal Form",
    route: "Crystal Form → dimensional Crown Cut Diamond · true crystal body",
    copy: "This view shows the finished Crown Cut Diamond as a dimensional crystal body: table, crown, faceted girdle, pavilion, culet, light, and touch inspection. This is the public object. It proves the site can render interactive 3D content with a fixed form instead of a flat graphic."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → 16-point compass geometry · 256 lattice logic",
    copy: "This view reveals the structural logic beneath the Diamond. The 16-point compass metric organizes the visible geometry, while the 256 lattice represents the deeper address system behind the form. This is not a separate object. It is the same Diamond viewed through its underlying structure."
  }
});

const state = {
  lens: "crystal",
  yaw: -0.38,
  pitch: -0.34,
  roll: 0.04,
  velocityYaw: 0,
  velocityPitch: 0,
  velocityRoll: 0,
  sparklePhase: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  dpr: 1,
  canvasReady: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function rgba(color, alpha) {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

function normalize3(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function subtract3(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross3(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function makePoint(x, y, z, ring, index) {
  return Object.freeze({ x, y, z, ring, index });
}

function makeFace(type, points, tone, fireBias = 0) {
  return Object.freeze({
    type,
    points: Object.freeze(points.slice()),
    tone,
    fireBias
  });
}

function buildCrystalModel() {
  const table = [];
  const crown = [];
  const girdleTop = [];
  const girdleBottom = [];
  const pavilion = [];
  const culetPlate = [];

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const angle = (i / RADIAL_POINTS) * TAU;
    const alt = i % 2 === 0 ? 1 : 0.94;

    table.push(makePoint(Math.cos(angle) * 0.36 * alt, -0.62, Math.sin(angle) * 0.30 * alt, "table", i));
    crown.push(makePoint(Math.cos(angle) * 0.72 * alt, -0.40, Math.sin(angle) * 0.58 * alt, "crown", i));
    girdleTop.push(makePoint(Math.cos(angle) * 1.08 * alt, -0.05, Math.sin(angle) * 0.88 * alt, "girdleTop", i));
    girdleBottom.push(makePoint(Math.cos(angle) * 1.02 * alt, 0.11, Math.sin(angle) * 0.84 * alt, "girdleBottom", i));
    pavilion.push(makePoint(Math.cos(angle) * 0.44 * alt, 0.58, Math.sin(angle) * 0.34 * alt, "pavilion", i));
    culetPlate.push(makePoint(Math.cos(angle) * 0.10 * alt, 0.82, Math.sin(angle) * 0.07 * alt, "culetPlate", i));
  }

  const tableCenter = makePoint(0, -0.66, 0, "tableCenter", -1);
  const culetCenter = makePoint(0, 0.86, 0, "culetCenter", -2);

  const faces = [
    makeFace("table", table, 1.62, 0.22),
    makeFace("culet-plane", culetPlate, 0.70, 0.18)
  ];

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const n = (i + 1) % RADIAL_POINTS;
    const fire = seededUnit(i, 17) * 0.42;

    faces.push(makeFace("table-star", [tableCenter, table[i], table[n]], 1.46, fire + 0.04));
    faces.push(makeFace("crown-main", [table[i], crown[i], crown[n], table[n]], 1.30, fire + 0.11));
    faces.push(makeFace("crown-shoulder", [crown[i], girdleTop[i], girdleTop[n], crown[n]], 1.06, fire + 0.10));
    faces.push(makeFace("girdle-belt", [girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]], 0.72, fire));
    faces.push(makeFace("pavilion-main", [girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]], 0.96, fire + 0.16));
    faces.push(makeFace("culet-termination", [pavilion[i], culetPlate[i], culetPlate[n], pavilion[n]], 1.04, fire + 0.24));
  }

  return Object.freeze({
    table,
    crown,
    girdleTop,
    girdleBottom,
    pavilion,
    culetPlate,
    tableCenter,
    culetCenter,
    rings: Object.freeze([table, crown, girdleTop, girdleBottom, pavilion, culetPlate]),
    faces: Object.freeze(faces)
  });
}

const CRYSTAL_MODEL = buildCrystalModel();

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((box.width || 640) * dpr));
  const height = Math.max(500, Math.floor((box.height || 720) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  state.dpr = dpr;
}

function rotatePoint(point) {
  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);

  let x = point.x;
  let y = point.y;
  let z = point.z;

  const y1 = y * cp - z * sp;
  const z1 = y * sp + z * cp;

  const x2 = x * cy + z1 * sy;
  const z2 = -x * sy + z1 * cy;

  const x3 = x2 * cr - y1 * sr;
  const y3 = x2 * sr + y1 * cr;

  return { x: x3, y: y3, z: z2, source: point };
}

function projectRotated(rotated, width, height, scale) {
  const camera = 4.8;
  const perspective = camera / (camera - rotated.z * 0.82);

  return {
    x: width * 0.5 + rotated.x * scale * perspective,
    y: height * 0.405 + rotated.y * scale * 1.02 * perspective,
    z: rotated.z,
    raw: rotated,
    source: rotated.source
  };
}

function projectPoint(point, width, height, scale) {
  return projectRotated(rotatePoint(point), width, height, scale);
}

function projectedFace(face, width, height, scale) {
  const rotated = face.points.map(rotatePoint);
  const projected = rotated.map((point) => projectRotated(point, width, height, scale));
  const avgZ = rotated.reduce((sum, point) => sum + point.z, 0) / Math.max(1, rotated.length);

  return {
    type: face.type,
    tone: face.tone,
    fireBias: face.fireBias,
    rotated,
    projected,
    avgZ
  };
}

function faceNormal(rotatedPoints) {
  if (rotatedPoints.length < 3) return { x: 0, y: 0, z: 1 };
  const a = rotatedPoints[0];
  const b = rotatedPoints[1];
  const c = rotatedPoints[2];
  return normalize3(cross3(subtract3(b, a), subtract3(c, a)));
}

function faceCenter(points) {
  const center = points.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      acc.z += point.z;
      return acc;
    },
    { x: 0, y: 0, z: 0 }
  );

  const length = Math.max(1, points.length);
  center.x /= length;
  center.y /= length;
  center.z /= length;
  return center;
}

function pathPolygon(ctx, points) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
}

function drawBackground(ctx, width, height, lens) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, lens === "lattice" ? "rgba(2, 5, 15, 1)" : "rgba(1, 5, 14, 1)");
  bg.addColorStop(0.48, lens === "lattice" ? "rgba(7, 12, 34, 0.99)" : "rgba(5, 15, 32, 0.99)");
  bg.addColorStop(1, "rgba(1, 4, 10, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.38,
    width * 0.04,
    width * 0.5,
    height * 0.42,
    width * 0.62
  );

  halo.addColorStop(0, lens === "lattice" ? "rgba(198, 166, 255, 0.20)" : "rgba(244, 250, 255, 0.23)");
  halo.addColorStop(0.30, "rgba(118, 168, 225, 0.13)");
  halo.addColorStop(0.56, "rgba(244, 207, 131, 0.052)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  const velvet = ctx.createRadialGradient(
    width * 0.5,
    height * 0.54,
    width * 0.10,
    width * 0.5,
    height * 0.57,
    width * 0.80
  );
  velvet.addColorStop(0, "rgba(30, 45, 70, 0.08)");
  velvet.addColorStop(0.64, "rgba(0,0,0,0)");
  velvet.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = velvet;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 56; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.06 + seededUnit(i, 3) * 0.16;
    const size = i % 17 === 0 ? 5.4 : i % 7 === 0 ? 2.6 : 1.0;

    ctx.strokeStyle = `rgba(235, 244, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.00072);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function crystalTypeAlpha(type) {
  return {
    table: 0.78,
    "table-star": 0.58,
    "crown-main": 0.68,
    "crown-shoulder": 0.62,
    "girdle-belt": 0.50,
    "pavilion-main": 0.62,
    "culet-termination": 0.56,
    "culet-plane": 0.46
  }[type] || 0.58;
}

function materialForFace(ctx, face, index, width) {
  const normal = faceNormal(face.rotated);
  const center = faceCenter(face.projected);

  const keyLight = normalize3({ x: -0.48, y: -0.82, z: 1.0 });
  const rimLight = normalize3({ x: 0.72, y: -0.12, z: 0.58 });
  const sharpLight = normalize3({ x: 0.24, y: -0.38, z: 1.0 });

  const key = Math.max(0, dot3(normal, keyLight));
  const rim = Math.max(0, dot3(normal, rimLight));
  const sharp = Math.max(0, dot3(normal, sharpLight));
  const facing = clamp((normal.z + 1) / 2, 0, 1);
  const edge = clamp(1 - facing, 0, 1);
  const pulse = 0.5 + 0.5 * Math.sin(index * PHI + face.fireBias * 7 + state.sparklePhase * 1.55);

  const brilliance = clamp(
    Math.pow(key, 1.42) * 0.88 +
    Math.pow(sharp, 4.2) * 1.0 +
    rim * 0.56 +
    pulse * 0.12,
    0,
    1.55
  );

  const shadow = clamp(edge * 0.40 + (1 - key) * 0.22, 0, 0.82);
  const fire = clamp(face.fireBias * 0.28 + rim * 0.12 + Math.pow(sharp, 3.1) * 0.20 + pulse * 0.10, 0.02, 0.48);

  const deepBlue = [8, 18, 40];
  const blueGlass = [70, 126, 196];
  const ice = [205, 232, 255];
  const white = [255, 255, 255];
  const goldFire = [255, 220, 142];
  const violetFire = [214, 198, 255];

  const iceMix = clamp(brilliance * 0.54 + facing * 0.16, 0, 1);
  const darkMix = clamp(shadow * 0.72, 0, 0.86);
  const fireMix = clamp(fire * 0.34, 0, 0.36);
  const violetMix = clamp(rim * 0.10 + face.fireBias * 0.05, 0, 0.16);

  let color = [
    lerp(deepBlue[0], ice[0], iceMix),
    lerp(deepBlue[1], ice[1], iceMix),
    lerp(deepBlue[2], ice[2], iceMix)
  ];

  color = [
    lerp(color[0], blueGlass[0], clamp(shadow * 0.22, 0, 0.28)),
    lerp(color[1], blueGlass[1], clamp(shadow * 0.22, 0, 0.28)),
    lerp(color[2], blueGlass[2], clamp(shadow * 0.22, 0, 0.28))
  ];

  color = [
    lerp(color[0], white[0], clamp(Math.pow(sharp, 5.0), 0, 0.52)),
    lerp(color[1], white[1], clamp(Math.pow(sharp, 5.0), 0, 0.52)),
    lerp(color[2], white[2], clamp(Math.pow(sharp, 5.0), 0, 0.52))
  ];

  color = [
    lerp(color[0], goldFire[0], fireMix),
    lerp(color[1], goldFire[1], fireMix * 0.70),
    lerp(color[2], goldFire[2], fireMix * 0.32)
  ];

  color = [
    lerp(color[0], violetFire[0], violetMix),
    lerp(color[1], violetFire[1], violetMix),
    lerp(color[2], violetFire[2], violetMix)
  ];

  color[0] = lerp(color[0], deepBlue[0], darkMix * 0.34);
  color[1] = lerp(color[1], deepBlue[1], darkMix * 0.32);
  color[2] = lerp(color[2], deepBlue[2], darkMix * 0.28);

  const alpha = clamp(crystalTypeAlpha(face.type) + brilliance * 0.08 - shadow * 0.05, 0.30, 0.82);
  const strokeAlpha = clamp(0.18 + brilliance * 0.36 + rim * 0.12, 0.14, 0.62);

  const gradient = ctx.createLinearGradient(
    center.x - width * 0.12,
    center.y - width * 0.10,
    center.x + width * 0.12,
    center.y + width * 0.10
  );

  gradient.addColorStop(0, `rgba(255,255,255,${clamp(alpha * 0.70 + sharp * 0.20, 0, 0.82)})`);
  gradient.addColorStop(0.28, rgba(color, alpha));
  gradient.addColorStop(0.58, rgba(color, alpha * 0.84));
  gradient.addColorStop(0.84, rgba([lerp(color[0], 16, shadow), lerp(color[1], 28, shadow), lerp(color[2], 58, shadow)], alpha * 0.72));
  gradient.addColorStop(1, rgba([8, 18, 38], alpha * 0.36));

  return {
    fill: gradient,
    stroke: `rgba(235,248,255,${strokeAlpha})`,
    visible: normal.z > -0.78 || face.type === "table" || face.type === "culet-plane"
  };
}

function drawCrystalForm(ctx, width, height) {
  const scale = Math.min(width * 0.375, height * 0.415);
  const faces = CRYSTAL_MODEL.faces.map((face) => projectedFace(face, width, height, scale));

  ctx.save();

  const cx = width * 0.5;
  const cy = height * 0.405;

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.16, cx, cy + scale * 0.05, scale * 1.94);
  aura.addColorStop(0, "rgba(255,255,255,0.18)");
  aura.addColorStop(0.32, "rgba(141,216,255,0.11)");
  aura.addColorStop(0.66, "rgba(244,207,131,0.045)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  faces
    .slice()
    .sort((a, b) => a.avgZ - b.avgZ)
    .forEach((face, index) => {
      const material = materialForFace(ctx, face, index, width);
      if (!material.visible) return;

      pathPolygon(ctx, face.projected);
      ctx.fillStyle = material.fill;
      ctx.strokeStyle = material.stroke;
      ctx.lineWidth = Math.max(0.68, width * 0.00072);
      ctx.lineJoin = "miter";
      ctx.fill();
      ctx.stroke();
    });

  drawCrystalEdges(ctx, width, height, scale);
  drawCrystalInternalFire(ctx, width, height, scale);
  drawCrystalSparkles(ctx, width, height, scale);

  const culet = projectPoint(CRYSTAL_MODEL.culetCenter, width, height, scale);
  const shadow = ctx.createRadialGradient(cx, culet.y + scale * 0.16, scale * 0.03, cx, culet.y + scale * 0.16, scale * 0.40);
  shadow.addColorStop(0, "rgba(244,207,131,0.12)");
  shadow.addColorStop(0.38, "rgba(92,132,172,0.10)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, culet.y + scale * 0.16, scale * 0.34, scale * 0.054, 0, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function drawRing(ctx, ring, width, height, scale, alpha, lineWidth = 1) {
  const points = ring.map((point) => projectPoint(point, width, height, scale));

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();

  ctx.strokeStyle = `rgba(244,250,255,${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.0007);
  ctx.stroke();
}

function drawLine(ctx, a, b, width, height, scale, alpha, lineWidth = 1, color = "244,250,255") {
  const pa = projectPoint(a, width, height, scale);
  const pb = projectPoint(b, width, height, scale);

  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.00062);
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
}

function drawCrystalEdges(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";

  drawRing(ctx, CRYSTAL_MODEL.table, width, height, scale, 0.62, 0.98 * state.dpr);
  drawRing(ctx, CRYSTAL_MODEL.crown, width, height, scale, 0.26, 0.66 * state.dpr);
  drawRing(ctx, CRYSTAL_MODEL.girdleTop, width, height, scale, 0.82, 1.22 * state.dpr);
  drawRing(ctx, CRYSTAL_MODEL.girdleBottom, width, height, scale, 0.42, 0.78 * state.dpr);
  drawRing(ctx, CRYSTAL_MODEL.pavilion, width, height, scale, 0.28, 0.62 * state.dpr);
  drawRing(ctx, CRYSTAL_MODEL.culetPlate, width, height, scale, 0.36, 0.56 * state.dpr);

  for (let i = 0; i < RADIAL_POINTS; i += 2) {
    drawLine(ctx, CRYSTAL_MODEL.table[i], CRYSTAL_MODEL.crown[i], width, height, scale, 0.18, 0.52 * state.dpr);
    drawLine(ctx, CRYSTAL_MODEL.crown[i], CRYSTAL_MODEL.girdleTop[i], width, height, scale, 0.22, 0.58 * state.dpr);
    drawLine(ctx, CRYSTAL_MODEL.girdleBottom[i], CRYSTAL_MODEL.pavilion[i], width, height, scale, 0.20, 0.56 * state.dpr);
    drawLine(ctx, CRYSTAL_MODEL.pavilion[i], CRYSTAL_MODEL.culetPlate[i], width, height, scale, 0.20, 0.54 * state.dpr);
  }

  const tableCenter = projectPoint(CRYSTAL_MODEL.tableCenter, width, height, scale);
  const culetCenter = projectPoint(CRYSTAL_MODEL.culetCenter, width, height, scale);
  const vertical = ctx.createLinearGradient(tableCenter.x, tableCenter.y, culetCenter.x, culetCenter.y);
  vertical.addColorStop(0, "rgba(255,255,255,0.20)");
  vertical.addColorStop(0.50, "rgba(141,216,255,0.10)");
  vertical.addColorStop(1, "rgba(244,207,131,0.13)");

  ctx.strokeStyle = vertical;
  ctx.lineWidth = Math.max(0.8, width * 0.00068);
  ctx.beginPath();
  ctx.moveTo(tableCenter.x, tableCenter.y);
  ctx.lineTo(culetCenter.x, culetCenter.y);
  ctx.stroke();

  ctx.restore();
}

function drawCrystalInternalFire(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const pairs = [
    [CRYSTAL_MODEL.girdleTop[1], CRYSTAL_MODEL.pavilion[9], [141, 216, 255], 0.18],
    [CRYSTAL_MODEL.girdleTop[5], CRYSTAL_MODEL.table[2], [255, 220, 142], 0.16],
    [CRYSTAL_MODEL.crown[12], CRYSTAL_MODEL.culetPlate[4], [198, 166, 255], 0.14],
    [CRYSTAL_MODEL.crown[3], CRYSTAL_MODEL.pavilion[11], [255, 255, 255], 0.12]
  ];

  pairs.forEach(([a, b, color, alpha], index) => {
    const pa = projectPoint(a, width, height, scale);
    const pb = projectPoint(b, width, height, scale);
    const pulse = 0.70 + 0.30 * Math.sin(state.sparklePhase * 1.32 + index * PHI);

    const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.50, rgba(color, alpha * pulse));
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, width * 0.0028);
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawStarGlint(ctx, x, y, radius, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = radius * state.dpr;
  const inner = outer * 0.32;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, outer * 2.35);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.70 * alpha})`);
  glow.addColorStop(0.20, `rgba(160, 215, 255, ${0.26 * alpha})`);
  glow.addColorStop(0.54, `rgba(244, 207, 131, ${0.08 * alpha})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, outer * 2.35, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.86 * alpha})`;
  ctx.lineWidth = Math.max(1, outer * 0.052);

  ctx.beginPath();
  ctx.moveTo(x - outer, y);
  ctx.lineTo(x + outer, y);
  ctx.moveTo(x, y - outer);
  ctx.lineTo(x, y + outer);
  ctx.stroke();

  ctx.strokeStyle = `rgba(190, 225, 255, ${0.50 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(x - inner, y - inner);
  ctx.lineTo(x + inner, y + inner);
  ctx.moveTo(x + inner, y - inner);
  ctx.lineTo(x - inner, y + inner);
  ctx.stroke();

  ctx.restore();
}

function drawCrystalSparkles(ctx, width, height, scale) {
  const candidates = [
    ...CRYSTAL_MODEL.table,
    ...CRYSTAL_MODEL.crown,
    ...CRYSTAL_MODEL.girdleTop,
    ...CRYSTAL_MODEL.girdleBottom,
    ...CRYSTAL_MODEL.pavilion,
    ...CRYSTAL_MODEL.culetPlate
  ].map((point, index) => {
    const projected = projectPoint(point, width, height, scale);
    const pulse = 0.5 + 0.5 * Math.sin(index * PHI + state.sparklePhase * 1.9);
    const score = pulse * 0.52 + seededUnit(index, 44) * 0.32;
    return { projected, score };
  });

  candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .forEach((item, index) => {
      drawStarGlint(ctx, item.projected.x, item.projected.y, index < 2 ? 10 : 7, clamp(item.score * 0.62, 0.16, 0.62));
    });
}

function drawLatticeStructure(ctx, width, height) {
  const cx = width * 0.5;
  const cy = height * 0.405;
  const scale = Math.min(width * 0.34, height * 0.36);

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.10, cx, cy, scale * 1.72);
  aura.addColorStop(0, "rgba(198,166,255,0.18)");
  aura.addColorStop(0.32, "rgba(141,216,255,0.10)");
  aura.addColorStop(0.70, "rgba(244,207,131,0.035)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const rings = [
    { name: "table-address", rx: 0.26, ry: 0.14, y: -0.62, alpha: 0.62 },
    { name: "crown-address", rx: 0.58, ry: 0.24, y: -0.42, alpha: 0.46 },
    { name: "girdle-address", rx: 1.00, ry: 0.40, y: -0.12, alpha: 0.72 },
    { name: "pavilion-address", rx: 0.66, ry: 0.30, y: 0.28, alpha: 0.40 },
    { name: "culet-address", rx: 0.18, ry: 0.09, y: 0.66, alpha: 0.56 }
  ];

  const projectedRings = rings.map((ring, ringIndex) => {
    const points = [];

    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      const angle = (i / RADIAL_POINTS) * TAU + (ringIndex % 2 ? TAU / 32 : 0);
      const pulse = 1 + Math.sin(i * PHI + state.sparklePhase * 0.55) * 0.012;
      const x = Math.cos(angle) * ring.rx * pulse;
      const y = ring.y + Math.sin(angle) * ring.ry * pulse;

      points.push({
        x: cx + (x + y * Math.sin(state.yaw) * 0.08) * scale,
        y: cy + y * scale,
        ring,
        index: i,
        angle
      });
    }

    return points;
  });

  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";

  projectedRings.forEach((points, ringIndex) => {
    ctx.strokeStyle = `rgba(244,250,255,${rings[ringIndex].alpha})`;
    ctx.lineWidth = Math.max(0.9, scale * (ringIndex === 2 ? 0.006 : 0.004));
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();
    ctx.stroke();
  });

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const major = i % 4 === 0;
    const color = major ? "244,207,131" : "141,216,255";
    const alpha = major ? 0.62 : 0.30;
    const lineWidth = Math.max(0.8, scale * (major ? 0.0052 : 0.0032));

    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    projectedRings.forEach((ringPoints, ringIndex) => {
      const point = ringPoints[i];
      if (ringIndex === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }

  for (let i = 0; i < RADIAL_POINTS; i += 2) {
    const a = projectedRings[0][i];
    const b = projectedRings[2][(i + 2) % RADIAL_POINTS];
    const c = projectedRings[4][(i + 4) % RADIAL_POINTS];

    ctx.strokeStyle = "rgba(198,166,255,0.22)";
    ctx.lineWidth = Math.max(0.7, scale * 0.0028);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
  }

  projectedRings.forEach((points, ringIndex) => {
    points.forEach((point, pointIndex) => {
      const major = pointIndex % 4 === 0;
      const pulse = 0.72 + 0.28 * Math.sin(state.sparklePhase * 1.4 + ringIndex + pointIndex * 0.4);
      const radius = (major ? 3.4 : 2.0) * state.dpr;
      const color = major ? [244, 207, 131] : [141, 216, 255];

      ctx.fillStyle = rgba(color, (major ? 0.80 : 0.44) * pulse);
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, TAU);
      ctx.fill();
    });
  });

  ctx.font = `${Math.max(12, width * 0.018)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(244, 207, 131, 0.72)";
  ctx.fillText("16 RADIAL COMPASS METRIC · 256 LATTICE ADDRESS FIELD", width * 0.5, height * 0.145);

  ctx.restore();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;
  const lens = state.lens;

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height, lens);
  drawStars(ctx, width, height);

  if (lens === "lattice") {
    drawLatticeStructure(ctx, width, height);
  } else {
    drawCrystalForm(ctx, width, height);
  }
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  state.sparklePhase += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;
    state.roll += state.velocityRoll;

    const damping = Math.pow(0.948, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;
    state.velocityRoll *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
    if (Math.abs(state.velocityRoll) < 0.00004) state.velocityRoll = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.sparklePhase * 0.30) * dt * 0.010;
      state.roll += Math.sin(state.sparklePhase * 0.16) * dt * 0.0016;
    }
  }

  state.pitch = clamp(state.pitch, -0.88, 0.64);
  state.roll = clamp(state.roll, -0.22, 0.22);

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
    state.velocityRoll = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0048;
    state.pitch = clamp(state.pitch - dy * 0.0030, -0.88, 0.64);
    state.roll = clamp(state.roll + dx * 0.00034, -0.22, 0.22);

    state.velocityYaw = dx * 0.00156;
    state.velocityPitch = -dy * 0.00092;
    state.velocityRoll = dx * 0.00006;
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
  state.yaw = -0.38;
  state.pitch = -0.34;
  state.roll = 0.04;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.velocityRoll = 0;
  state.sparklePhase = 0;
}

function setLens(nextLens) {
  const lens = nextLens === "lattice" ? "lattice" : "crystal";
  state.lens = lens;

  document.documentElement.dataset.showroomDiamondLens = lens;
  if (document.body) document.body.dataset.showroomDiamondLens = lens;

  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.diamondLens === lens ? "true" : "false");
  });

  const title = document.querySelector("[data-diamond-lens-title]");
  const copy = document.querySelector("[data-diamond-lens-copy]");
  const route = document.querySelector("[data-diamond-route-label]");

  if (title) title.textContent = LENS_COPY[lens].title;
  if (copy) copy.textContent = LENS_COPY[lens].copy;
  if (route) route.textContent = LENS_COPY[lens].route;
}

function bindLensControls() {
  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      setLens(button.dataset.diamondLens);
    });
  });

  setLens(state.lens);
}

function markRoute() {
  const markers = {
    showroomStatus: "dual-lens-diamond-dimensional-crystal-launchpad",
    showroomContract: SHOWROOM_DIAMOND_STATE.contract,
    showroomPairedHtmlContract: SHOWROOM_DIAMOND_STATE.pairedHtmlContract,
    diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
    visibleRadialMetric: String(RADIAL_POINTS),
    latticeStates: String(LATTICE_STATES),
    defaultLens: "crystal-form",
    secondaryLens: "lattice-structure",
    lensRule: "toggle-changes-inspection-lens-not-object-identity",
    touchGlideDiamond: "true",
    geometryMutableByTouch: "false",
    inspectionControl: "camera-view-rotation",
    crystalFormSilhouette: "dimensional-crown-cut-diamond-body",
    latticeFormSilhouette: "structural-compass-lattice-field",
    crystalAndLatticeAreVisuallyDistinct: "true",
    diamondPublicRead: "diamond-not-flat",
    roundGirdleRemoved: "true",
    visibleCrown: "true",
    dimensionalCrown: "true",
    flatBadgeBlocked: "true",
    topLikeSilhouetteBlocked: "true",
    overMeshedPublicCrystalBlocked: "true",
    launchpadRoutes: "characters,laws,products,globe,gauges",
    lawsCta: "Jump to the Laws page and lock in.",
    productsCommunityPath: "products-serve-community",
    earthRecord: "false",
    generatedImage: "false",
    graphicBox: "false",
    legacyGlobeInheritance: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    if (document.body) document.body.dataset[key] = value;
  });
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
  bindLensControls();

  const stage = document.querySelector("[data-showroom-diamond-stage]");
  const canvas = document.querySelector("[data-showroom-diamond-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;

  bindPointer(stage);
  resizeCanvas(canvas);
  render(canvas, ctx);

  state.canvasReady = true;

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBShowroomDiamond = Object.freeze({
    ...SHOWROOM_DIAMOND_STATE,
    setLens,
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: true,
        canvasReady: state.canvasReady,
        fixedForm: true,
        crownCut: true,
        lattice256: true,
        latticeStates: LATTICE_STATES,
        visibleRadialMetric: RADIAL_POINTS,
        activeLens: state.lens,
        lensCopy: LENS_COPY[state.lens],
        crystalFormSilhouette: "dimensional-crown-cut-diamond-body",
        latticeFormSilhouette: "structural-compass-lattice-field",
        crystalAndLatticeAreVisuallyDistinct: true,
        correctedPhysicalRead: "diamond-crystal-not-flat-object",
        roundGirdleRemoved: true,
        tableClear: true,
        visibleCrown: true,
        dimensionalCrown: true,
        facetedGirdle: true,
        pavilionTaper: true,
        culetPlane: true,
        flatBadgeBlocked: true,
        topLikeSilhouetteBlocked: true,
        overMeshedPublicCrystalBlocked: true,
        solidCrystal: true,
        geometryMutableByTouch: false,
        inspectionControl: "camera-view-rotation",
        launchpadRoutes: ["characters", "laws", "products", "globe", "gauges"],
        lawsCta: "Jump to the Laws page and lock in.",
        productsCommunityPath: true,
        momentum: true,
        doubleTapReset: true,
        yaw: state.yaw,
        pitch: state.pitch,
        roll: state.roll,
        generatedImage: false,
        graphicBox: false,
        earthRecord: false,
        legacyGlobeInheritance: false
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
