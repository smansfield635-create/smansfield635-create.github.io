// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TRUE_3D_TNT_v3
// Paired HTML: SHOWROOM_DUAL_LENS_DIAMOND_HTML_TRUE_3D_BIND_TNT_v4
// Scope: active /showroom/ Diamond renderer only.
// Purpose:
// - Kill flat badge read.
// - Crystal Form renders from a real 3D faceted model with depth, perspective, face sorting, crown, table, girdle, pavilion, and culet.
// - Lattice Structure renders the 16-point compass / 256-lattice structure as a separate educational lens.
// - Same Diamond identity. Different inspection lens.
// - No generated image. No graphic box. No legacy Globe / Planet One / Demo Universe inheritance.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TRUE_3D_TNT_v3",
  pairedHtmlContract: "SHOWROOM_DUAL_LENS_DIAMOND_HTML_TRUE_3D_BIND_TNT_v4",
  route: "/showroom/",
  role: "showroom-dual-lens-true-3d-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  inspectionControl: "true-3d-camera-view",
  geometryMutableByTouch: false,
  defaultLens: "crystal",
  secondaryLens: "lattice",
  lensRule: "toggle-changes-inspection-lens-not-object-identity",
  visibleRadialMetric: 16,
  latticeStates: 256,
  crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
  latticeFormSilhouette: "structural-compass-lattice-field",
  flatBadgeBlocked: true,
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
    route: "Crystal Form → true 3D Crown Cut Diamond · table · crown · pavilion",
    copy: "This view shows the finished Crown Cut Diamond as a true 3D crystal body: table, crown, faceted girdle, pavilion, culet, light, and touch inspection. This is the public object. It proves the site can render interactive 3D content with a fixed form instead of a flat graphic."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → 16-point compass geometry · 256 lattice logic",
    copy: "This view reveals the structural logic beneath the Diamond. The 16-point compass metric organizes the visible geometry, while the 256 lattice represents the deeper address system behind the form. This is not a separate object. It is the same Diamond viewed through its underlying structure."
  }
});

const state = {
  lens: "crystal",
  yaw: -0.74,
  pitch: -0.42,
  roll: 0.07,
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

function makeRing(name, rx, y, rz, offset = 0, compression = 1) {
  const points = [];

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const angle = (i / RADIAL_POINTS) * TAU + offset;
    const compassCut = i % 2 === 0 ? 1 : 0.935;
    const quarterCut = i % 4 === 0 ? 1.035 : 1;
    points.push(
      makePoint(
        Math.cos(angle) * rx * compassCut * quarterCut,
        y,
        Math.sin(angle) * rz * compassCut * compression,
        name,
        i
      )
    );
  }

  return Object.freeze(points);
}

function buildTrue3DDiamondModel() {
  const table = makeRing("table", 0.34, -0.72, 0.30, TAU / 32, 0.95);
  const crownBreak = makeRing("crownBreak", 0.58, -0.56, 0.50, 0, 0.98);
  const crownShoulder = makeRing("crownShoulder", 0.82, -0.34, 0.70, TAU / 32, 1);
  const girdleTop = makeRing("girdleTop", 1.08, -0.10, 0.92, 0, 1);
  const girdleBottom = makeRing("girdleBottom", 1.02, 0.10, 0.87, TAU / 32, 1);
  const pavilionBreak = makeRing("pavilionBreak", 0.58, 0.46, 0.48, 0, 0.98);
  const culetRing = makeRing("culetRing", 0.14, 0.80, 0.10, TAU / 32, 0.92);

  const tableCenter = makePoint(0, -0.76, 0, "tableCenter", -1);
  const culet = makePoint(0, 0.92, 0, "culet", -2);

  const faces = [
    makeFace("table", table, 1.62, 0.20),
    makeFace("culet-plane", culetRing, 0.64, 0.14)
  ];

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const n = (i + 1) % RADIAL_POINTS;
    const fire = seededUnit(i, 23) * 0.44;

    faces.push(makeFace("table-star", [tableCenter, table[i], table[n]], 1.48, fire + 0.03));
    faces.push(makeFace("upper-crown", [table[i], crownBreak[i], crownBreak[n], table[n]], 1.34, fire + 0.10));
    faces.push(makeFace("crown-main", [crownBreak[i], crownShoulder[i], crownShoulder[n], crownBreak[n]], 1.18, fire + 0.16));
    faces.push(makeFace("crown-shoulder", [crownShoulder[i], girdleTop[i], girdleTop[n], crownShoulder[n]], 1.02, fire + 0.11));
    faces.push(makeFace("girdle-wall", [girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]], 0.70, fire));
    faces.push(makeFace("upper-pavilion", [girdleBottom[i], pavilionBreak[i], pavilionBreak[n], girdleBottom[n]], 0.92, fire + 0.18));
    faces.push(makeFace("lower-pavilion", [pavilionBreak[i], culetRing[i], culetRing[n], pavilionBreak[n]], 1.02, fire + 0.26));
    faces.push(makeFace("culet-ray", [culetRing[i], culet, culetRing[n]], 1.12, fire + 0.32));
  }

  return Object.freeze({
    table,
    crownBreak,
    crownShoulder,
    girdleTop,
    girdleBottom,
    pavilionBreak,
    culetRing,
    tableCenter,
    culet,
    rings: Object.freeze([table, crownBreak, crownShoulder, girdleTop, girdleBottom, pavilionBreak, culetRing]),
    faces: Object.freeze(faces)
  });
}

const TRUE_3D_DIAMOND = buildTrue3DDiamondModel();

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
  const camera = 3.35;
  const perspective = camera / (camera - rotated.z * 1.18);

  return {
    x: width * 0.5 + rotated.x * scale * perspective,
    y: height * 0.405 + rotated.y * scale * 1.04 * perspective,
    z: rotated.z,
    perspective,
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

  halo.addColorStop(0, lens === "lattice" ? "rgba(198, 166, 255, 0.20)" : "rgba(244, 250, 255, 0.25)");
  halo.addColorStop(0.30, "rgba(118, 168, 225, 0.15)");
  halo.addColorStop(0.56, "rgba(244, 207, 131, 0.058)");
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

function typeAlpha(type) {
  return {
    table: 0.80,
    "table-star": 0.56,
    "upper-crown": 0.60,
    "crown-main": 0.68,
    "crown-shoulder": 0.62,
    "girdle-wall": 0.48,
    "upper-pavilion": 0.58,
    "lower-pavilion": 0.62,
    "culet-ray": 0.58,
    "culet-plane": 0.42
  }[type] || 0.56;
}

function materialForFace(ctx, face, index, width) {
  const normal = faceNormal(face.rotated);
  const center = faceCenter(face.projected);

  const keyLight = normalize3({ x: -0.58, y: -0.78, z: 1.0 });
  const rimLight = normalize3({ x: 0.82, y: -0.10, z: 0.62 });
  const sharpLight = normalize3({ x: 0.22, y: -0.38, z: 1.0 });
  const underLight = normalize3({ x: -0.16, y: 0.80, z: 0.42 });

  const key = Math.max(0, dot3(normal, keyLight));
  const rim = Math.max(0, dot3(normal, rimLight));
  const sharp = Math.max(0, dot3(normal, sharpLight));
  const under = Math.max(0, dot3(normal, underLight));
  const facing = clamp((normal.z + 1) / 2, 0, 1);
  const back = clamp(1 - facing, 0, 1);
  const pulse = 0.5 + 0.5 * Math.sin(index * PHI + face.fireBias * 7 + state.sparklePhase * 1.55);

  const typeBoost = {
    table: 1.26,
    "table-star": 1.08,
    "upper-crown": 1.02,
    "crown-main": 0.98,
    "crown-shoulder": 0.86,
    "girdle-wall": 0.62,
    "upper-pavilion": 0.78,
    "lower-pavilion": 0.86,
    "culet-ray": 0.94,
    "culet-plane": 0.56
  }[face.type] || 0.86;

  const brilliance = clamp(
    Math.pow(key, 1.34) * 0.82 +
    Math.pow(sharp, 4.4) * 1.18 +
    rim * 0.64 +
    under * 0.14 +
    pulse * 0.12,
    0,
    1.74
  );

  const shadow = clamp(back * 0.34 + (1 - key) * 0.26 + (face.type.includes("pavilion") ? 0.16 : 0), 0, 0.86);
  const fire = clamp(face.fireBias * 0.32 + rim * 0.18 + Math.pow(sharp, 3.2) * 0.24 + pulse * 0.12, 0.02, 0.56);
  const brightness = clamp(brilliance * typeBoost + face.tone * 0.13 - shadow * 0.44, 0.04, 1.72);

  const deepBlue = [8, 18, 40];
  const blueGlass = [64, 122, 194];
  const ice = [205, 232, 255];
  const white = [255, 255, 255];
  const goldFire = [255, 220, 142];
  const violetFire = [214, 198, 255];

  const iceMix = clamp(brightness * 0.58 + facing * 0.14, 0, 1);
  const darkMix = clamp(shadow * 0.74, 0, 0.86);
  const fireMix = clamp(fire * 0.36, 0, 0.38);
  const violetMix = clamp(rim * 0.11 + face.fireBias * 0.055, 0, 0.18);

  let color = [
    lerp(deepBlue[0], ice[0], iceMix),
    lerp(deepBlue[1], ice[1], iceMix),
    lerp(deepBlue[2], ice[2], iceMix)
  ];

  color = [
    lerp(color[0], blueGlass[0], clamp(shadow * 0.25, 0, 0.30)),
    lerp(color[1], blueGlass[1], clamp(shadow * 0.25, 0, 0.30)),
    lerp(color[2], blueGlass[2], clamp(shadow * 0.25, 0, 0.30))
  ];

  color = [
    lerp(color[0], white[0], clamp(Math.pow(sharp, 5.0), 0, 0.56)),
    lerp(color[1], white[1], clamp(Math.pow(sharp, 5.0), 0, 0.56)),
    lerp(color[2], white[2], clamp(Math.pow(sharp, 5.0), 0, 0.56))
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

  color[0] = lerp(color[0], deepBlue[0], darkMix * 0.36);
  color[1] = lerp(color[1], deepBlue[1], darkMix * 0.34);
  color[2] = lerp(color[2], deepBlue[2], darkMix * 0.30);

  const alpha = clamp(typeAlpha(face.type) + brightness * 0.08 - shadow * 0.06, 0.24, 0.86);
  const strokeAlpha = clamp(0.16 + brightness * 0.38 + rim * 0.14, 0.12, 0.66);

  const gradient = ctx.createLinearGradient(
    center.x - width * 0.13,
    center.y - width * 0.10,
    center.x + width * 0.13,
    center.y + width * 0.10
  );

  gradient.addColorStop(0, `rgba(255,255,255,${clamp(alpha * 0.72 + sharp * 0.24, 0, 0.86)})`);
  gradient.addColorStop(0.26, rgba(color, alpha));
  gradient.addColorStop(0.55, rgba(color, alpha * 0.86));
  gradient.addColorStop(0.82, rgba([lerp(color[0], 14, shadow), lerp(color[1], 26, shadow), lerp(color[2], 56, shadow)], alpha * 0.74));
  gradient.addColorStop(1, rgba([8, 18, 38], alpha * 0.38));

  return {
    fill: gradient,
    stroke: `rgba(235,248,255,${strokeAlpha})`,
    normal,
    facing,
    visible: normal.z > -0.92 || face.type === "table" || face.type === "culet-plane"
  };
}

function drawTrue3DCrystal(ctx, width, height) {
  const scale = Math.min(width * 0.39, height * 0.43);
  const faces = TRUE_3D_DIAMOND.faces.map((face) => projectedFace(face, width, height, scale));

  ctx.save();

  const cx = width * 0.5;
  const cy = height * 0.405;

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.14, cx, cy + scale * 0.04, scale * 2.02);
  aura.addColorStop(0, "rgba(255,255,255,0.20)");
  aura.addColorStop(0.30, "rgba(141,216,255,0.12)");
  aura.addColorStop(0.66, "rgba(244,207,131,0.05)");
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

  drawCrystalDepthEdges(ctx, width, height, scale);
  drawInternalPrismPaths(ctx, width, height, scale);
  drawSparkles(ctx, width, height, scale);

  const culet = projectPoint(TRUE_3D_DIAMOND.culet, width, height, scale);
  const shadow = ctx.createRadialGradient(cx, culet.y + scale * 0.15, scale * 0.03, cx, culet.y + scale * 0.15, scale * 0.42);
  shadow.addColorStop(0, "rgba(244,207,131,0.14)");
  shadow.addColorStop(0.38, "rgba(92,132,172,0.11)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, culet.y + scale * 0.15, scale * 0.36, scale * 0.058, 0, 0, TAU);
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

function drawCrystalDepthEdges(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";

  drawRing(ctx, TRUE_3D_DIAMOND.table, width, height, scale, 0.74, 1.05 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.crownBreak, width, height, scale, 0.34, 0.66 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.crownShoulder, width, height, scale, 0.32, 0.66 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.girdleTop, width, height, scale, 0.84, 1.26 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.girdleBottom, width, height, scale, 0.46, 0.82 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.pavilionBreak, width, height, scale, 0.34, 0.66 * state.dpr);
  drawRing(ctx, TRUE_3D_DIAMOND.culetRing, width, height, scale, 0.42, 0.62 * state.dpr);

  for (let i = 0; i < RADIAL_POINTS; i += 2) {
    drawLine(ctx, TRUE_3D_DIAMOND.table[i], TRUE_3D_DIAMOND.crownBreak[i], width, height, scale, 0.20, 0.52 * state.dpr);
    drawLine(ctx, TRUE_3D_DIAMOND.crownBreak[i], TRUE_3D_DIAMOND.crownShoulder[i], width, height, scale, 0.19, 0.52 * state.dpr);
    drawLine(ctx, TRUE_3D_DIAMOND.crownShoulder[i], TRUE_3D_DIAMOND.girdleTop[i], width, height, scale, 0.22, 0.58 * state.dpr);
    drawLine(ctx, TRUE_3D_DIAMOND.girdleBottom[i], TRUE_3D_DIAMOND.pavilionBreak[i], width, height, scale, 0.22, 0.58 * state.dpr);
    drawLine(ctx, TRUE_3D_DIAMOND.pavilionBreak[i], TRUE_3D_DIAMOND.culetRing[i], width, height, scale, 0.20, 0.54 * state.dpr);
    drawLine(ctx, TRUE_3D_DIAMOND.culetRing[i], TRUE_3D_DIAMOND.culet, width, height, scale, 0.24, 0.56 * state.dpr);
  }

  const tableCenter = projectPoint(TRUE_3D_DIAMOND.tableCenter, width, height, scale);
  const culet = projectPoint(TRUE_3D_DIAMOND.culet, width, height, scale);
  const vertical = ctx.createLinearGradient(tableCenter.x, tableCenter.y, culet.x, culet.y);
  vertical.addColorStop(0, "rgba(255,255,255,0.24)");
  vertical.addColorStop(0.50, "rgba(141,216,255,0.12)");
  vertical.addColorStop(1, "rgba(244,207,131,0.16)");

  ctx.strokeStyle = vertical;
  ctx.lineWidth = Math.max(0.8, width * 0.00068);
  ctx.beginPath();
  ctx.moveTo(tableCenter.x, tableCenter.y);
  ctx.lineTo(culet.x, culet.y);
  ctx.stroke();

  ctx.restore();
}

function drawInternalPrismPaths(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const pairs = [
    [TRUE_3D_DIAMOND.girdleTop[1], TRUE_3D_DIAMOND.pavilionBreak[9], [141, 216, 255], 0.20],
    [TRUE_3D_DIAMOND.girdleTop[5], TRUE_3D_DIAMOND.table[2], [255, 220, 142], 0.18],
    [TRUE_3D_DIAMOND.crownBreak[12], TRUE_3D_DIAMOND.culetRing[4], [198, 166, 255], 0.16],
    [TRUE_3D_DIAMOND.crownShoulder[3], TRUE_3D_DIAMOND.pavilionBreak[11], [255, 255, 255], 0.14],
    [TRUE_3D_DIAMOND.table[10], TRUE_3D_DIAMOND.culetRing[14], [120, 205, 255], 0.12]
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
    ctx.lineWidth = Math.max(1, width * 0.0026);
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

function drawSparkles(ctx, width, height, scale) {
  const candidates = [
    ...TRUE_3D_DIAMOND.table,
    ...TRUE_3D_DIAMOND.crownBreak,
    ...TRUE_3D_DIAMOND.crownShoulder,
    ...TRUE_3D_DIAMOND.girdleTop,
    ...TRUE_3D_DIAMOND.girdleBottom,
    ...TRUE_3D_DIAMOND.pavilionBreak,
    ...TRUE_3D_DIAMOND.culetRing
  ].map((point, index) => {
    const projected = projectPoint(point, width, height, scale);
    const pulse = 0.5 + 0.5 * Math.sin(index * PHI + state.sparklePhase * 1.9);
    const depth = clamp((projected.z + 1.15) / 2.3, 0, 1);
    const score = pulse * 0.46 + depth * 0.34 + seededUnit(index, 44) * 0.26;
    return { projected, score };
  });

  candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .forEach((item, index) => {
      drawStarGlint(ctx, item.projected.x, item.projected.y, index < 2 ? 10 : 7, clamp(item.score * 0.66, 0.16, 0.66));
    });
}

function drawLatticeStructure(ctx, width, height) {
  const scale = Math.min(width * 0.37, height * 0.40);

  ctx.save();

  const cx = width * 0.5;
  const cy = height * 0.405;

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.10, cx, cy, scale * 1.76);
  aura.addColorStop(0, "rgba(198,166,255,0.18)");
  aura.addColorStop(0.32, "rgba(141,216,255,0.10)");
  aura.addColorStop(0.70, "rgba(244,207,131,0.035)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";

  const rings = TRUE_3D_DIAMOND.rings;

  rings.forEach((ring, ringIndex) => {
    const alpha = ringIndex === 3 ? 0.74 : ringIndex === 0 ? 0.62 : 0.36;
    drawRing(ctx, ring, width, height, scale, alpha, (ringIndex === 3 ? 1.20 : 0.78) * state.dpr);
  });

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const major = i % 4 === 0;
    const color = major ? "244,207,131" : "141,216,255";
    const alpha = major ? 0.62 : 0.30;
    const lineWidth = major ? 0.78 : 0.46;

    drawLine(ctx, TRUE_3D_DIAMOND.table[i], TRUE_3D_DIAMOND.crownBreak[i], width, height, scale, alpha, lineWidth * state.dpr, color);
    drawLine(ctx, TRUE_3D_DIAMOND.crownBreak[i], TRUE_3D_DIAMOND.crownShoulder[i], width, height, scale, alpha, lineWidth * state.dpr, color);
    drawLine(ctx, TRUE_3D_DIAMOND.crownShoulder[i], TRUE_3D_DIAMOND.girdleTop[i], width, height, scale, alpha, lineWidth * state.dpr, color);
    drawLine(ctx, TRUE_3D_DIAMOND.girdleBottom[i], TRUE_3D_DIAMOND.pavilionBreak[i], width, height, scale, alpha, lineWidth * state.dpr, color);
    drawLine(ctx, TRUE_3D_DIAMOND.pavilionBreak[i], TRUE_3D_DIAMOND.culetRing[i], width, height, scale, alpha, lineWidth * state.dpr, color);
    drawLine(ctx, TRUE_3D_DIAMOND.culetRing[i], TRUE_3D_DIAMOND.culet, width, height, scale, alpha, lineWidth * state.dpr, color);
  }

  for (let i = 0; i < RADIAL_POINTS; i += 2) {
    drawLine(ctx, TRUE_3D_DIAMOND.table[i], TRUE_3D_DIAMOND.girdleTop[(i + 2) % RADIAL_POINTS], width, height, scale, 0.18, 0.46 * state.dpr, "198,166,255");
    drawLine(ctx, TRUE_3D_DIAMOND.girdleBottom[i], TRUE_3D_DIAMOND.culetRing[(i + 4) % RADIAL_POINTS], width, height, scale, 0.20, 0.48 * state.dpr, "198,166,255");
  }

  rings.forEach((ring, ringIndex) => {
    ring.forEach((point, pointIndex) => {
      const projected = projectPoint(point, width, height, scale);
      const major = pointIndex % 4 === 0;
      const pulse = 0.72 + 0.28 * Math.sin(state.sparklePhase * 1.4 + ringIndex + pointIndex * 0.4);
      const radius = (major ? 3.5 : 2.0) * state.dpr;
      const color = major ? [244, 207, 131] : [141, 216, 255];

      ctx.fillStyle = rgba(color, (major ? 0.82 : 0.44) * pulse);
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, radius, 0, TAU);
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
    drawTrue3DCrystal(ctx, width, height);
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
      state.yaw += Math.sin(state.sparklePhase * 0.30) * dt * 0.012;
      state.roll += Math.sin(state.sparklePhase * 0.16) * dt * 0.0018;
    }
  }

  state.pitch = clamp(state.pitch, -0.92, 0.68);
  state.roll = clamp(state.roll, -0.26, 0.26);

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
    state.pitch = clamp(state.pitch - dy * 0.0030, -0.92, 0.68);
    state.roll = clamp(state.roll + dx * 0.00034, -0.26, 0.26);

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
  state.yaw = -0.74;
  state.pitch = -0.42;
  state.roll = 0.07;
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
    showroomStatus: "dual-lens-true-3d-diamond-launchpad",
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
    inspectionControl: "true-3d-camera-view",
    crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
    latticeFormSilhouette: "structural-compass-lattice-field",
    crystalAndLatticeAreVisuallyDistinct: "true",
    diamondPublicRead: "diamond-not-flat",
    true3DProjection: "true",
    faceSorting: "true",
    perspectiveDepth: "true",
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
        true3DProjection: true,
        faceSorting: true,
        perspectiveDepth: true,
        lattice256: true,
        latticeStates: LATTICE_STATES,
        visibleRadialMetric: RADIAL_POINTS,
        activeLens: state.lens,
        lensCopy: LENS_COPY[state.lens],
        crystalFormSilhouette: "true-3d-crown-cut-diamond-body",
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
        inspectionControl: "true-3d-camera-view",
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
