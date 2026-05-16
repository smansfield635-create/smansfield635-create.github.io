// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_CROWN_CUT_LATTICE_DIAMOND_RENDER_TNT_v1
// Scope: active /showroom/ Diamond renderer only.
// Paired HTML: SHOWROOM_CROWN_CUT_LATTICE_LAUNCHPAD_TNT_v1
// Purpose:
// - Preserve fixed Crown Cut 256 Lattice Diamond authority.
// - Correct physical form language away from top/toy silhouette.
// - Reduce visible face density from legacy over-meshed model.
// - Keep touch-glide camera inspection, momentum, and double-tap reset.
// - Do not inherit legacy Globe, Planet One, solar-system, or Demo Universe render systems.
// - No generated image. No graphic box. No Earth/globe/planet language.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_CROWN_CUT_LATTICE_DIAMOND_RENDER_TNT_v1",
  pairedHtmlContract: "SHOWROOM_CROWN_CUT_LATTICE_LAUNCHPAD_TNT_v1",
  route: "/showroom/",
  role: "showroom-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  inspectionControl: "solid-body-camera-view",
  geometryMutableByTouch: false,
  visualMode: "crown-cut-256-lattice-fixed-crystal-form",
  publicFormCorrection: "diamond-crystal-not-top-object",
  generatedImage: false,
  graphicBox: false,
  earthRecord: false,
  legacyGlobeInheritance: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const SEGMENTS = 32;
const LATTICE_STATES = 256;

const state = {
  yaw: 0.34,
  pitch: -0.22,
  roll: 0,
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

function normalize3(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

function subtract3(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  };
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

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function rgba(color, alpha) {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

function makePoint(x, y, z, ring, index, angle) {
  return Object.freeze({ x, y, z, ring, index, angle });
}

function makeRing(name, rx, y, rz, offset = 0) {
  const points = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const angle = (i / SEGMENTS) * TAU + offset;
    points.push(
      makePoint(
        Math.cos(angle) * rx,
        y,
        Math.sin(angle) * rz,
        name,
        i,
        angle
      )
    );
  }

  return Object.freeze(points);
}

function makeFace(type, points, tone, fireBias = 0) {
  return Object.freeze({
    type,
    points: Object.freeze(points.slice()),
    tone,
    fireBias
  });
}

function buildImmutableDiamondModel() {
  const table = makeRing("table", 0.46, -0.66, 0.40, TAU / 64);
  const crown = makeRing("crown", 0.72, -0.49, 0.63, 0);
  const upperGirdle = makeRing("upperGirdle", 1.02, -0.14, 0.90, TAU / 64);
  const lowerGirdle = makeRing("lowerGirdle", 1.00, 0.02, 0.88, 0);
  const pavilionShoulder = makeRing("pavilionShoulder", 0.76, 0.31, 0.67, TAU / 64);
  const pavilionLower = makeRing("pavilionLower", 0.38, 0.62, 0.34, 0);
  const culetRing = makeRing("culetRing", 0.11, 0.86, 0.095, TAU / 64);

  const tableCenter = makePoint(0, -0.69, 0, "tableCenter", -1, 0);
  const culetCenter = makePoint(0, 0.90, 0, "culetCenter", -2, 0);

  const faces = [
    makeFace("table", table, 1.72, 0.22),
    makeFace("culet-cap", culetRing, 1.18, 0.26)
  ];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const n = (i + 1) % SEGMENTS;
    const fireBias = seededUnit(i, 31) * 0.42;

    faces.push(makeFace("table-star", [tableCenter, table[i], table[n]], 1.62, fireBias + 0.05));
    faces.push(makeFace("crown-main", [table[i], crown[i], crown[n], table[n]], 1.42, fireBias + 0.14));
    faces.push(makeFace("crown-bezel", [crown[i], upperGirdle[i], upperGirdle[n], crown[n]], 1.18, fireBias + 0.12));
    faces.push(makeFace("girdle-belt", [upperGirdle[i], lowerGirdle[i], lowerGirdle[n], upperGirdle[n]], 0.84, fireBias));
    faces.push(makeFace("pavilion-main", [lowerGirdle[i], pavilionShoulder[i], pavilionShoulder[n], lowerGirdle[n]], 1.08, fireBias + 0.18));
    faces.push(makeFace("pavilion-lower", [pavilionShoulder[i], pavilionLower[i], pavilionLower[n], pavilionShoulder[n]], 1.20, fireBias + 0.25));
    faces.push(makeFace("culet-termination", [pavilionLower[i], culetRing[i], culetRing[n], pavilionLower[n]], 1.34, fireBias + 0.32));
  }

  return Object.freeze({
    table,
    crown,
    upperGirdle,
    lowerGirdle,
    pavilionShoulder,
    pavilionLower,
    culetRing,
    tableCenter,
    culetCenter,
    rings: Object.freeze([table, crown, upperGirdle, lowerGirdle, pavilionShoulder, pavilionLower, culetRing]),
    faces: Object.freeze(faces)
  });
}

const DIAMOND_MODEL = buildImmutableDiamondModel();

function rotateImmutablePoint(point) {
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

  return {
    x: x3,
    y: y3,
    z: z2,
    source: point
  };
}

function projectRotatedPoint(rotated, width, height, scale) {
  const camera = 4.85;
  const perspective = camera / (camera - rotated.z * 0.70);

  return {
    x: width * 0.5 + rotated.x * scale * perspective,
    y: height * 0.415 + rotated.y * scale * 0.99 * perspective,
    z: rotated.z,
    raw: rotated,
    source: rotated.source
  };
}

function projectedPoint(point, width, height, scale) {
  return projectRotatedPoint(rotateImmutablePoint(point), width, height, scale);
}

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

function projectedFace(face, width, height, scale) {
  const rotated = face.points.map(rotateImmutablePoint);
  const projected = rotated.map((point) => projectRotatedPoint(point, width, height, scale));
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

function drawPolygon(ctx, points) {
  ctx.beginPath();

  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
}

function diamondTypeAlpha(type) {
  return {
    table: 0.78,
    "table-star": 0.62,
    "crown-main": 0.64,
    "crown-bezel": 0.59,
    "girdle-belt": 0.48,
    "pavilion-main": 0.58,
    "pavilion-lower": 0.61,
    "culet-termination": 0.56,
    "culet-cap": 0.48
  }[type] || 0.56;
}

function materialForFace(ctx, face, index) {
  const center = faceCenter(face.projected);
  const normal = faceNormal(face.rotated);

  const keyLight = normalize3({ x: -0.48, y: -0.82, z: 1.0 });
  const sharpLight = normalize3({ x: 0.26, y: -0.44, z: 1.0 });
  const rimLight = normalize3({ x: 0.72, y: -0.12, z: 0.58 });
  const underLight = normalize3({ x: -0.08, y: 0.88, z: 0.36 });

  const key = Math.max(0, dot3(normal, keyLight));
  const sharp = Math.max(0, dot3(normal, sharpLight));
  const rim = Math.max(0, dot3(normal, rimLight));
  const under = Math.max(0, dot3(normal, underLight));
  const facing = clamp((normal.z + 1) / 2, 0, 1);
  const edge = clamp(1 - facing, 0, 1);

  const facetPulse = 0.5 + 0.5 * Math.sin(index * PHI + face.fireBias * 7 + state.sparklePhase * 1.74);
  const alternating = index % 2 === 0 ? 1 : -1;

  const brilliance = clamp(
    Math.pow(key, 1.48) * 0.94 +
    Math.pow(sharp, 4.35) * 1.08 +
    rim * 0.66 +
    under * 0.20 +
    facetPulse * 0.16,
    0,
    1.72
  );

  const pavilionPenalty =
    face.type.includes("pavilion") || face.type.includes("culet") ? 0.14 : 0;

  const shadow = clamp(
    edge * 0.45 +
    (1 - key) * 0.26 +
    (alternating < 0 ? 0.10 : 0) +
    pavilionPenalty,
    0,
    0.88
  );

  const fire = clamp(
    face.fireBias * 0.32 +
    rim * 0.16 +
    Math.pow(sharp, 3.2) * 0.24 +
    facetPulse * 0.14,
    0.02,
    0.62
  );

  const typeBoost = {
    table: 1.20,
    "table-star": 1.10,
    "crown-main": 1.02,
    "crown-bezel": 0.94,
    "girdle-belt": 0.68,
    "pavilion-main": 0.86,
    "pavilion-lower": 0.92,
    "culet-termination": 0.86,
    "culet-cap": 0.74
  }[face.type] || 0.88;

  const brightness = clamp((brilliance * typeBoost + face.tone * 0.16) - shadow * 0.46, 0.06, 1.78);

  const deepBlue = [10, 22, 46];
  const blueGlass = [74, 130, 202];
  const ice = [202, 232, 255];
  const white = [255, 255, 255];
  const goldFire = [255, 220, 142];
  const violetFire = [214, 198, 255];

  const darkMix = clamp(shadow * 0.78, 0, 0.92);
  const iceMix = clamp(brightness * 0.60 + facing * 0.16, 0, 1);
  const fireMix = clamp(fire * 0.36, 0, 0.40);
  const violetMix = clamp(rim * 0.12 + face.fireBias * 0.08, 0, 0.22);

  const baseA = [
    lerp(deepBlue[0], blueGlass[0], iceMix),
    lerp(deepBlue[1], blueGlass[1], iceMix),
    lerp(deepBlue[2], blueGlass[2], iceMix)
  ];

  const baseB = [
    lerp(baseA[0], ice[0], clamp(brightness * 0.48, 0, 1)),
    lerp(baseA[1], ice[1], clamp(brightness * 0.48, 0, 1)),
    lerp(baseA[2], ice[2], clamp(brightness * 0.48, 0, 1))
  ];

  const baseC = [
    lerp(baseB[0], white[0], clamp(Math.pow(sharp, 5.1) + brightness * 0.10, 0, 0.62)),
    lerp(baseB[1], white[1], clamp(Math.pow(sharp, 5.1) + brightness * 0.10, 0, 0.62)),
    lerp(baseB[2], white[2], clamp(Math.pow(sharp, 5.1) + brightness * 0.10, 0, 0.62))
  ];

  let color = [
    lerp(baseC[0], goldFire[0], fireMix),
    lerp(baseC[1], goldFire[1], fireMix * 0.70),
    lerp(baseC[2], goldFire[2], fireMix * 0.32)
  ];

  color = [
    lerp(color[0], violetFire[0], violetMix),
    lerp(color[1], violetFire[1], violetMix),
    lerp(color[2], violetFire[2], violetMix)
  ];

  color[0] = lerp(color[0], deepBlue[0], darkMix * 0.40);
  color[1] = lerp(color[1], deepBlue[1], darkMix * 0.36);
  color[2] = lerp(color[2], deepBlue[2], darkMix * 0.30);

  const alpha = clamp(diamondTypeAlpha(face.type) + brightness * 0.09 - shadow * 0.07, 0.36, 0.86);
  const strokeAlpha = clamp(0.20 + brightness * 0.42 + rim * 0.18, 0.18, 0.78);

  const gradient = ctx.createLinearGradient(
    center.x - 140 * state.dpr,
    center.y - 120 * state.dpr,
    center.x + 140 * state.dpr,
    center.y + 120 * state.dpr
  );

  gradient.addColorStop(0, `rgba(255,255,255,${clamp(alpha * 0.74 + sharp * 0.30, 0, 0.88)})`);
  gradient.addColorStop(0.22, rgba([
    lerp(color[0], 255, 0.22),
    lerp(color[1], 255, 0.25),
    lerp(color[2], 255, 0.30)
  ], alpha));
  gradient.addColorStop(0.48, rgba(color, alpha * 0.92));
  gradient.addColorStop(0.70, rgba([
    lerp(color[0], 20, shadow * 0.40),
    lerp(color[1], 34, shadow * 0.40),
    lerp(color[2], 64, shadow * 0.40)
  ], alpha * 0.76));
  gradient.addColorStop(0.90, `rgba(255,255,255,${alpha * clamp(sharp + rim * 0.35, 0.08, 0.36)})`);
  gradient.addColorStop(1, rgba([8, 18, 38], alpha * 0.38));

  return {
    fill: gradient,
    stroke: `rgba(235, 248, 255, ${strokeAlpha})`,
    brightness,
    center,
    normal
  };
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(1, 5, 14, 1)");
  bg.addColorStop(0.50, "rgba(5, 15, 32, 0.99)");
  bg.addColorStop(1, "rgba(1, 4, 10, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.40,
    width * 0.04,
    width * 0.5,
    height * 0.42,
    width * 0.60
  );

  halo.addColorStop(0, "rgba(244, 250, 255, 0.23)");
  halo.addColorStop(0.28, "rgba(118, 168, 225, 0.14)");
  halo.addColorStop(0.54, "rgba(244, 207, 131, 0.055)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  const velvet = ctx.createRadialGradient(
    width * 0.5,
    height * 0.54,
    width * 0.10,
    width * 0.5,
    height * 0.56,
    width * 0.78
  );
  velvet.addColorStop(0, "rgba(30, 45, 70, 0.08)");
  velvet.addColorStop(0.64, "rgba(0,0,0,0)");
  velvet.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = velvet;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 62; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.07 + seededUnit(i, 3) * 0.18;
    const size = i % 17 === 0 ? 5.6 : i % 7 === 0 ? 2.8 : 1.1;

    ctx.strokeStyle = `rgba(235, 244, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.00075);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFaces(ctx, projectedFaces, width) {
  projectedFaces
    .slice()
    .sort((a, b) => a.avgZ - b.avgZ)
    .forEach((face, index) => {
      const material = materialForFace(ctx, face, index);
      drawPolygon(ctx, face.projected);
      ctx.fillStyle = material.fill;
      ctx.strokeStyle = material.stroke;
      ctx.lineWidth = Math.max(0.72, width * 0.00088);
      ctx.fill();
      ctx.stroke();
    });
}

function drawRing(ctx, ring, width, height, scale, alpha, lineWidth = 1) {
  const projected = ring.map((point) => projectedPoint(point, width, height, scale));

  ctx.strokeStyle = `rgba(244, 250, 255, ${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.00084);
  ctx.beginPath();

  projected.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
  ctx.stroke();
}

function drawLine(ctx, a, b, width, height, scale, alpha, lineWidth = 1) {
  const pa = projectedPoint(a, width, height, scale);
  const pb = projectedPoint(b, width, height, scale);

  ctx.strokeStyle = `rgba(244, 250, 255, ${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.00078);
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
}

function drawLattice(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  drawRing(ctx, DIAMOND_MODEL.table, width, height, scale, 0.76, 1.10 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.crown, width, height, scale, 0.44, 0.82 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.upperGirdle, width, height, scale, 0.78, 1.34 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.lowerGirdle, width, height, scale, 0.48, 0.90 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.pavilionShoulder, width, height, scale, 0.32, 0.70 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.pavilionLower, width, height, scale, 0.36, 0.74 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.culetRing, width, height, scale, 0.50, 0.70 * state.dpr);

  for (let i = 0; i < SEGMENTS; i += 4) {
    drawLine(ctx, DIAMOND_MODEL.table[i], DIAMOND_MODEL.crown[i], width, height, scale, 0.28, 0.66 * state.dpr);
    drawLine(ctx, DIAMOND_MODEL.crown[i], DIAMOND_MODEL.upperGirdle[i], width, height, scale, 0.32, 0.72 * state.dpr);
    drawLine(ctx, DIAMOND_MODEL.lowerGirdle[i], DIAMOND_MODEL.pavilionShoulder[i], width, height, scale, 0.28, 0.64 * state.dpr);
    drawLine(ctx, DIAMOND_MODEL.pavilionShoulder[i], DIAMOND_MODEL.pavilionLower[i], width, height, scale, 0.24, 0.58 * state.dpr);
    drawLine(ctx, DIAMOND_MODEL.pavilionLower[i], DIAMOND_MODEL.culetRing[i], width, height, scale, 0.32, 0.62 * state.dpr);
  }

  for (let i = 2; i < SEGMENTS; i += 8) {
    drawLine(ctx, DIAMOND_MODEL.crown[i], DIAMOND_MODEL.upperGirdle[(i + 3) % SEGMENTS], width, height, scale, 0.14, 0.50 * state.dpr);
    drawLine(ctx, DIAMOND_MODEL.lowerGirdle[i], DIAMOND_MODEL.pavilionShoulder[(i + 5) % SEGMENTS], width, height, scale, 0.15, 0.50 * state.dpr);
  }

  ctx.restore();
}

function drawInternalFire(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const firePairs = [
    [DIAMOND_MODEL.upperGirdle[2], DIAMOND_MODEL.pavilionShoulder[21], [105, 190, 255], 0.26, 2.3],
    [DIAMOND_MODEL.upperGirdle[10], DIAMOND_MODEL.table[5], [255, 230, 160], 0.20, 1.8],
    [DIAMOND_MODEL.upperGirdle[23], DIAMOND_MODEL.pavilionLower[7], [135, 210, 255], 0.24, 2.0],
    [DIAMOND_MODEL.crown[4], DIAMOND_MODEL.lowerGirdle[17], [255, 255, 255], 0.20, 1.6],
    [DIAMOND_MODEL.crown[27], DIAMOND_MODEL.pavilionShoulder[12], [255, 192, 122], 0.18, 1.6],
    [DIAMOND_MODEL.table[17], DIAMOND_MODEL.culetRing[29], [190, 225, 255], 0.18, 1.5]
  ];

  firePairs.forEach(([a, b, color, baseAlpha, thickness], index) => {
    const pa = projectedPoint(a, width, height, scale);
    const pb = projectedPoint(b, width, height, scale);
    const pulse = 0.70 + 0.30 * Math.sin(state.sparklePhase * 1.35 + index * 1.7);
    const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);

    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.38, rgba(color, baseAlpha * 0.56 * pulse));
    gradient.addColorStop(0.52, rgba(color, baseAlpha));
    gradient.addColorStop(0.68, rgba(color, baseAlpha * 0.46 * pulse));
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1.0, width * 0.0010 * thickness);
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawPrismShards(ctx, projectedFaces) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  projectedFaces
    .filter((face, index) => index % 9 === 0 || face.type === "table-star")
    .slice(0, 28)
    .forEach((face, index) => {
      const pulse = 0.5 + 0.5 * Math.sin(state.sparklePhase * 1.5 + index * PHI);
      const alpha = 0.018 + pulse * 0.044;

      const hue =
        index % 5 === 0 ? [255, 220, 142] :
        index % 5 === 1 ? [125, 196, 255] :
        index % 5 === 2 ? [255, 255, 255] :
        index % 5 === 3 ? [198, 166, 255] :
        [255, 178, 122];

      ctx.fillStyle = rgba(hue, alpha);
      drawPolygon(ctx, face.projected);
      ctx.fill();
    });

  ctx.restore();
}

function drawStarGlint(ctx, x, y, radius, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = radius * state.dpr;
  const inner = outer * 0.32;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, outer * 2.45);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.72 * alpha})`);
  glow.addColorStop(0.20, `rgba(160, 215, 255, ${0.28 * alpha})`);
  glow.addColorStop(0.54, `rgba(244, 207, 131, ${0.09 * alpha})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, outer * 2.45, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.90 * alpha})`;
  ctx.lineWidth = Math.max(1, outer * 0.052);

  ctx.beginPath();
  ctx.moveTo(x - outer, y);
  ctx.lineTo(x + outer, y);
  ctx.moveTo(x, y - outer);
  ctx.lineTo(x, y + outer);
  ctx.stroke();

  ctx.strokeStyle = `rgba(190, 225, 255, ${0.54 * alpha})`;
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
    ...DIAMOND_MODEL.table,
    ...DIAMOND_MODEL.crown,
    ...DIAMOND_MODEL.upperGirdle,
    ...DIAMOND_MODEL.lowerGirdle,
    ...DIAMOND_MODEL.pavilionShoulder,
    ...DIAMOND_MODEL.pavilionLower,
    ...DIAMOND_MODEL.culetRing
  ].map((point, index) => {
    const projected = projectedPoint(point, width, height, scale);
    const pulse = 0.5 + 0.5 * Math.sin(index * PHI + state.sparklePhase * 2.0);
    const front = clamp((projected.z + 1.10) / 2.2, 0, 1);
    const score = pulse * 0.50 + front * 0.42 + seededUnit(index, 90) * 0.14;
    return { projected, score, index };
  });

  candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .forEach((item, rank) => {
      const radius = rank < 2 ? 12 : rank < 5 ? 8 : 5.5;
      const alpha = clamp(item.score * (rank < 3 ? 0.88 : 0.60), 0.18, 0.90);
      drawStarGlint(ctx, item.projected.x, item.projected.y, radius, alpha);
    });
}

function drawAuraAndShadow(ctx, width, height, scale) {
  const centerX = width * 0.5;
  const centerY = height * 0.415;

  const aura = ctx.createRadialGradient(
    centerX,
    centerY,
    scale * 0.16,
    centerX,
    centerY + scale * 0.04,
    scale * 2.12
  );

  aura.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  aura.addColorStop(0.22, "rgba(147, 188, 235, 0.12)");
  aura.addColorStop(0.52, "rgba(244, 207, 131, 0.052)");
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const culet = projectedPoint(DIAMOND_MODEL.culetCenter, width, height, scale);

  const shadow = ctx.createRadialGradient(
    centerX,
    culet.y + scale * 0.17,
    scale * 0.06,
    centerX,
    culet.y + scale * 0.17,
    scale * 0.48
  );

  shadow.addColorStop(0, "rgba(244, 207, 131, 0.14)");
  shadow.addColorStop(0.38, "rgba(82, 109, 146, 0.13)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(centerX, culet.y + scale * 0.17, scale * 0.42, scale * 0.070, 0, 0, TAU);
  ctx.fill();
}

function drawSilhouetteEdge(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  drawRing(ctx, DIAMOND_MODEL.table, width, height, scale, 0.66, 1.10 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.upperGirdle, width, height, scale, 0.86, 1.42 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.lowerGirdle, width, height, scale, 0.52, 0.98 * state.dpr);
  drawRing(ctx, DIAMOND_MODEL.culetRing, width, height, scale, 0.42, 0.74 * state.dpr);

  const leftGirdle = projectedPoint(DIAMOND_MODEL.upperGirdle[16], width, height, scale);
  const rightGirdle = projectedPoint(DIAMOND_MODEL.upperGirdle[0], width, height, scale);
  const culet = projectedPoint(DIAMOND_MODEL.culetCenter, width, height, scale);
  const tableCenter = projectedPoint(DIAMOND_MODEL.tableCenter, width, height, scale);

  const vertical = ctx.createLinearGradient(tableCenter.x, tableCenter.y, culet.x, culet.y);
  vertical.addColorStop(0, "rgba(255,255,255,.18)");
  vertical.addColorStop(0.50, "rgba(120,190,255,.10)");
  vertical.addColorStop(1, "rgba(255,224,152,.14)");

  ctx.strokeStyle = vertical;
  ctx.lineWidth = Math.max(1, width * 0.0009);
  ctx.beginPath();
  ctx.moveTo(tableCenter.x, tableCenter.y);
  ctx.lineTo(culet.x, culet.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = Math.max(1, width * 0.0008);
  ctx.beginPath();
  ctx.moveTo(leftGirdle.x, leftGirdle.y);
  ctx.lineTo(culet.x, culet.y);
  ctx.lineTo(rightGirdle.x, rightGirdle.y);
  ctx.stroke();

  ctx.restore();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;
  const scale = Math.min(width * 0.355, height * 0.405);

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawStars(ctx, width, height);
  drawAuraAndShadow(ctx, width, height, scale);

  const faces = DIAMOND_MODEL.faces.map((face) => projectedFace(face, width, height, scale));

  drawFaces(ctx, faces, width);
  drawPrismShards(ctx, faces);
  drawInternalFire(ctx, width, height, scale);
  drawLattice(ctx, width, height, scale);
  drawSilhouetteEdge(ctx, width, height, scale);
  drawSparkles(ctx, width, height, scale);
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
      state.yaw += Math.sin(state.sparklePhase * 0.34) * dt * 0.016;
      state.roll += Math.sin(state.sparklePhase * 0.20) * dt * 0.0032;
    }
  }

  state.pitch = clamp(state.pitch, -1.06, 1.06);
  state.roll = clamp(state.roll, -0.34, 0.34);

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

    state.yaw += dx * 0.0062;
    state.pitch = clamp(state.pitch - dy * 0.0040, -1.06, 1.06);
    state.roll = clamp(state.roll + dx * 0.00062, -0.34, 0.34);

    state.velocityYaw = dx * 0.00204;
    state.velocityPitch = -dy * 0.00122;
    state.velocityRoll = dx * 0.00012;
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
  state.yaw = 0.34;
  state.pitch = -0.22;
  state.roll = 0;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.velocityRoll = 0;
  state.sparklePhase = 0;
}

function markRoute() {
  const markers = {
    showroomStatus: "crown-cut-lattice-launchpad",
    showroomContract: SHOWROOM_DIAMOND_STATE.contract,
    showroomPairedHtmlContract: SHOWROOM_DIAMOND_STATE.pairedHtmlContract,
    diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
    touchGlideDiamond: "true",
    geometryMutableByTouch: "false",
    inspectionControl: "camera-view-rotation",
    diamondShape: "crown-cut-fixed-crystal-form",
    diamondMaterial: "clean-lattice-diamond-visual",
    diamondPublicRead: "diamond-not-top",
    latticeStates: String(LATTICE_STATES),
    diamondSegments: String(SEGMENTS),
    diamondFaceCount: String(DIAMOND_MODEL.faces.length),
    legacyFaceDensityReduced: "true",
    launchpadRoutes: "characters,products,laws,globe,gauges",
    lawsCta: "Jump to the Laws page and lock in.",
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
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: true,
        canvasReady: state.canvasReady,
        fixedForm: true,
        crownCut: true,
        lattice256: true,
        latticeStates: LATTICE_STATES,
        segmentCount: SEGMENTS,
        faceCount: DIAMOND_MODEL.faces.length,
        ringCount: DIAMOND_MODEL.rings.length,
        visibleFaceDensityReduced: true,
        correctedPhysicalRead: "diamond-crystal-not-top-object",
        tableClear: true,
        disciplinedCrown: true,
        structuralGirdle: true,
        pavilionTaper: true,
        culetTermination: true,
        solidCrystal: true,
        geometryMutableByTouch: false,
        inspectionControl: "camera-view-rotation",
        sparkle: true,
        internalFire: true,
        refractionPaths: true,
        launchpadRoutes: ["characters", "products", "laws", "globe", "gauges"],
        lawsCta: "Jump to the Laws page and lock in.",
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
