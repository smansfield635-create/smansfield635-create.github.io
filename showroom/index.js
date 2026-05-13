const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DIAMOND_CLARITY_AND_ROTATION_VALUE_TNT_v4",
  route: "/showroom/",
  role: "showroom-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  visualMode: "crystal-clarity-rotation-value",
  earthRecord: false,
  generatedImage: false,
  graphicBox: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const SEGMENTS = 32;

const state = {
  yaw: 0.34,
  pitch: -0.18,
  roll: 0.01,
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
  dpr: 1
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
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

function rotateModelPoint(point) {
  let x = point.x;
  let y = point.y;
  let z = point.z;

  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);

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
    ring: point.ring,
    index: point.index,
    angle: point.angle
  };
}

function projectModelPoint(point, width, height, scale) {
  const rotated = rotateModelPoint(point);
  const camera = 4.0;
  const perspective = camera / (camera - rotated.z * 0.74);

  return {
    x: width * 0.5 + rotated.x * scale * perspective,
    y: height * 0.435 + rotated.y * scale * 0.90 * perspective,
    z: rotated.z,
    raw: rotated,
    ring: point.ring,
    index: point.index,
    angle: point.angle
  };
}

function makeRing(name, rx, y, rz, offset = 0, ripple = 0.012) {
  const points = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const angle = (i / SEGMENTS) * TAU + offset;
    const facetPulse = Math.sin(i * PHI * 1.7);
    const r = 1 + ripple * facetPulse;

    points.push({
      x: Math.cos(angle) * rx * r,
      y,
      z: Math.sin(angle) * rz * r,
      ring: name,
      index: i,
      angle
    });
  }

  return points;
}

function buildDiamondModel() {
  const table = makeRing("table", 0.56, -0.68, 0.20, TAU / 64, 0.006);
  const crown = makeRing("crown", 0.92, -0.50, 0.32, 0, 0.010);
  const girdleTop = makeRing("girdleTop", 1.52, -0.08, 0.54, TAU / 64, 0.014);
  const girdleBottom = makeRing("girdleBottom", 1.45, 0.13, 0.50, 0, 0.012);
  const pavilion = makeRing("pavilion", 0.66, 0.60, 0.23, TAU / 64, 0.010);

  const tableCenter = {
    x: 0,
    y: -0.75,
    z: 0,
    ring: "tableCenter",
    index: -1,
    angle: 0
  };

  const culet = {
    x: 0,
    y: 1.08,
    z: 0,
    ring: "culet",
    index: -2,
    angle: 0
  };

  const faces = [
    {
      type: "table",
      points: table.slice(),
      tone: 1.36
    }
  ];

  for (let i = 0; i < SEGMENTS; i += 1) {
    const n = (i + 1) % SEGMENTS;

    faces.push({
      type: "star",
      points: [tableCenter, table[i], table[n]],
      tone: 1.46
    });

    faces.push({
      type: "upper-crown",
      points: [table[i], crown[i], crown[n], table[n]],
      tone: 1.26
    });

    faces.push({
      type: "kite-crown",
      points: [crown[i], girdleTop[i], girdleTop[n], crown[n]],
      tone: 1.12
    });

    faces.push({
      type: "girdle",
      points: [girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]],
      tone: 0.92
    });

    faces.push({
      type: "upper-pavilion",
      points: [girdleBottom[i], pavilion[i], pavilion[n], girdleBottom[n]],
      tone: 1.04
    });

    faces.push({
      type: "lower-pavilion",
      points: [pavilion[i], culet, pavilion[n]],
      tone: 1.18
    });
  }

  return Object.freeze({
    table,
    crown,
    girdleTop,
    girdleBottom,
    pavilion,
    tableCenter,
    culet,
    faces
  });
}

const diamondModel = buildDiamondModel();

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

function projectedFace(face, width, height, scale) {
  const points = face.points.map((point) => projectModelPoint(point, width, height, scale));
  const rotated = face.points.map(rotateModelPoint);
  const avgZ = rotated.reduce((sum, point) => sum + point.z, 0) / Math.max(1, rotated.length);
  return {
    ...face,
    projected: points,
    rotated,
    avgZ
  };
}

function faceNormal(rotatedPoints) {
  if (rotatedPoints.length < 3) {
    return { x: 0, y: 0, z: 1 };
  }

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

function faceMaterial(ctx, face, index) {
  const center = faceCenter(face.projected);
  const normal = faceNormal(face.rotated);
  const keyLight = normalize3({ x: -0.46, y: -0.82, z: 0.92 });
  const rimLight = normalize3({ x: 0.76, y: -0.24, z: 0.52 });
  const underLight = normalize3({ x: 0.12, y: 0.88, z: 0.24 });

  const key = Math.abs(dot3(normal, keyLight));
  const rim = Math.max(0, dot3(normal, rimLight));
  const under = Math.max(0, dot3(normal, underLight));
  const facing = clamp((normal.z + 1) / 2, 0, 1);
  const facetPulse = 0.5 + 0.5 * Math.sin(index * PHI + state.sparklePhase * 1.85);
  const anglePulse = 0.5 + 0.5 * Math.cos((face.projected[0]?.angle || 0) - state.yaw * 2.4);

  const brightness = clamp(
    (0.34 + key * 0.48 + rim * 0.32 + under * 0.14 + facing * 0.22 + facetPulse * 0.15 + anglePulse * 0.12) * face.tone,
    0.25,
    1.58
  );

  const cold = clamp(0.18 + facing * 0.42 + rim * 0.24, 0.16, 0.86);
  const fire = clamp(0.04 + anglePulse * 0.18 + facetPulse * 0.08, 0.03, 0.34);

  const r = Math.round(132 + brightness * 95 + fire * 54);
  const g = Math.round(164 + brightness * 82 + cold * 24);
  const b = Math.round(204 + brightness * 62 + cold * 56);

  const alphaByType = {
    table: 0.64,
    star: 0.54,
    "upper-crown": 0.58,
    "kite-crown": 0.52,
    girdle: 0.42,
    "upper-pavilion": 0.48,
    "lower-pavilion": 0.54
  };

  const alpha = clamp((alphaByType[face.type] || 0.48) + brightness * 0.12, 0.34, 0.82);
  const strokeAlpha = clamp(0.26 + brightness * 0.34, 0.22, 0.72);

  const gradient = ctx.createLinearGradient(
    center.x - 120 * state.dpr,
    center.y - 90 * state.dpr,
    center.x + 132 * state.dpr,
    center.y + 104 * state.dpr
  );

  gradient.addColorStop(0, `rgba(255, 255, 255, ${clamp(alpha + 0.12, 0, 0.88)})`);
  gradient.addColorStop(0.24, `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 18)}, ${Math.min(255, b + 14)}, ${alpha})`);
  gradient.addColorStop(0.52, `rgba(${r}, ${g}, ${b}, ${alpha * 0.88})`);
  gradient.addColorStop(0.78, `rgba(${Math.round(r * 0.56)}, ${Math.round(g * 0.66)}, ${Math.round(b * 0.90)}, ${alpha * 0.74})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.34})`);

  return {
    fill: gradient,
    stroke: `rgba(242, 248, 255, ${strokeAlpha})`
  };
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 0.97)");
  bg.addColorStop(0.50, "rgba(7, 18, 36, 0.98)");
  bg.addColorStop(1, "rgba(2, 7, 16, 1)");
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
  halo.addColorStop(0, "rgba(244, 250, 255, 0.18)");
  halo.addColorStop(0.36, "rgba(105, 150, 206, 0.12)");
  halo.addColorStop(0.68, "rgba(244, 207, 131, 0.045)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 64; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.10 + seededUnit(i, 3) * 0.25;
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

function drawCrystalFaces(ctx, projectedFaces, width) {
  const sorted = projectedFaces.slice().sort((a, b) => a.avgZ - b.avgZ);

  sorted.forEach((face, index) => {
    const material = faceMaterial(ctx, face, index);
    drawPolygon(ctx, face.projected);
    ctx.fillStyle = material.fill;
    ctx.strokeStyle = material.stroke;
    ctx.lineWidth = Math.max(0.85, width * 0.00125);
    ctx.fill();
    ctx.stroke();
  });
}

function drawRing(ctx, ring, width, height, scale, alpha, lineWidth = 1) {
  const projected = ring.map((point) => projectModelPoint(point, width, height, scale));

  ctx.strokeStyle = `rgba(244, 250, 255, ${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.001);
  ctx.beginPath();

  projected.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
  ctx.stroke();
}

function drawLine(ctx, a, b, width, height, scale, alpha, lineWidth = 1) {
  const pa = projectModelPoint(a, width, height, scale);
  const pb = projectModelPoint(b, width, height, scale);

  ctx.strokeStyle = `rgba(244, 250, 255, ${alpha})`;
  ctx.lineWidth = Math.max(lineWidth, width * 0.001);
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
}

function drawLattice(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  drawRing(ctx, diamondModel.table, width, height, scale, 0.62, 1.1 * state.dpr);
  drawRing(ctx, diamondModel.crown, width, height, scale, 0.48, 1.0 * state.dpr);
  drawRing(ctx, diamondModel.girdleTop, width, height, scale, 0.60, 1.25 * state.dpr);
  drawRing(ctx, diamondModel.girdleBottom, width, height, scale, 0.40, 0.95 * state.dpr);
  drawRing(ctx, diamondModel.pavilion, width, height, scale, 0.36, 0.85 * state.dpr);

  for (let i = 0; i < SEGMENTS; i += 2) {
    drawLine(ctx, diamondModel.table[i], diamondModel.crown[i], width, height, scale, 0.34, 0.85 * state.dpr);
    drawLine(ctx, diamondModel.crown[i], diamondModel.girdleTop[i], width, height, scale, 0.34, 0.85 * state.dpr);
    drawLine(ctx, diamondModel.girdleBottom[i], diamondModel.pavilion[i], width, height, scale, 0.30, 0.75 * state.dpr);
    drawLine(ctx, diamondModel.pavilion[i], diamondModel.culet, width, height, scale, 0.34, 0.80 * state.dpr);
  }

  for (let i = 1; i < SEGMENTS; i += 4) {
    drawLine(ctx, diamondModel.crown[i], diamondModel.girdleTop[(i + 5) % SEGMENTS], width, height, scale, 0.18, 0.65 * state.dpr);
    drawLine(ctx, diamondModel.girdleBottom[i], diamondModel.pavilion[(i + 7) % SEGMENTS], width, height, scale, 0.18, 0.65 * state.dpr);
  }

  ctx.restore();
}

function drawInternalFire(ctx, width, height, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const firePairs = [
    [diamondModel.girdleTop[2], diamondModel.pavilion[22], "rgba(105, 182, 255, 0.28)"],
    [diamondModel.girdleTop[14], diamondModel.table[6], "rgba(255, 225, 154, 0.20)"],
    [diamondModel.girdleTop[25], diamondModel.pavilion[8], "rgba(128, 205, 255, 0.24)"],
    [diamondModel.crown[4], diamondModel.girdleBottom[18], "rgba(255, 255, 255, 0.24)"],
    [diamondModel.crown[27], diamondModel.pavilion[12], "rgba(255, 201, 124, 0.18)"]
  ];

  firePairs.forEach(([a, b, color]) => {
    const pa = projectModelPoint(a, width, height, scale);
    const pb = projectModelPoint(b, width, height, scale);
    const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.48, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1.4, width * 0.0022);
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
  const inner = outer * 0.34;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, outer * 2.55);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.72 * alpha})`);
  glow.addColorStop(0.22, `rgba(160, 210, 255, ${0.30 * alpha})`);
  glow.addColorStop(0.56, `rgba(244, 207, 131, ${0.10 * alpha})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, outer * 2.55, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * alpha})`;
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
  const tableTop = projectModelPoint(diamondModel.table[8], width, height, scale);
  const leftGirdle = projectModelPoint(diamondModel.girdleTop[16], width, height, scale);
  const rightGirdle = projectModelPoint(diamondModel.girdleTop[0], width, height, scale);
  const culet = projectModelPoint(diamondModel.culet, width, height, scale);
  const crown = projectModelPoint(diamondModel.crown[5], width, height, scale);
  const pavilion = projectModelPoint(diamondModel.pavilion[23], width, height, scale);

  const pulseA = 0.64 + 0.36 * Math.sin(state.sparklePhase * 2.1);
  const pulseB = 0.64 + 0.36 * Math.sin(state.sparklePhase * 1.6 + 1.9);

  drawStarGlint(ctx, tableTop.x, tableTop.y - 8 * state.dpr, 14, 0.92 * pulseA);
  drawStarGlint(ctx, rightGirdle.x, rightGirdle.y, 12, 0.86 * pulseB);
  drawStarGlint(ctx, leftGirdle.x, leftGirdle.y, 10, 0.78 * pulseA);
  drawStarGlint(ctx, culet.x, culet.y, 12, 0.76 * pulseB);
  drawStarGlint(ctx, crown.x, crown.y, 7, 0.56 * pulseA);
  drawStarGlint(ctx, pavilion.x, pavilion.y, 7, 0.54 * pulseB);
}

function drawAuraAndShadow(ctx, width, height, scale) {
  const centerX = width * 0.5;
  const centerY = height * 0.435;

  const aura = ctx.createRadialGradient(
    centerX,
    centerY,
    scale * 0.16,
    centerX,
    centerY + scale * 0.05,
    scale * 2.42
  );

  aura.addColorStop(0, "rgba(255, 255, 255, 0.17)");
  aura.addColorStop(0.26, "rgba(147, 188, 235, 0.12)");
  aura.addColorStop(0.58, "rgba(244, 207, 131, 0.050)");
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const culet = projectModelPoint(diamondModel.culet, width, height, scale);

  const shadow = ctx.createRadialGradient(
    centerX,
    culet.y + scale * 0.18,
    scale * 0.06,
    centerX,
    culet.y + scale * 0.18,
    scale * 0.52
  );

  shadow.addColorStop(0, "rgba(244, 207, 131, 0.16)");
  shadow.addColorStop(0.44, "rgba(82, 109, 146, 0.15)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(centerX, culet.y + scale * 0.18, scale * 0.50, scale * 0.085, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;
  const scale = Math.min(width * 0.32, height * 0.36);

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawStars(ctx, width, height);
  drawAuraAndShadow(ctx, width, height, scale);

  const faces = diamondModel.faces.map((face) => projectedFace(face, width, height, scale));

  drawCrystalFaces(ctx, faces, width);
  drawInternalFire(ctx, width, height, scale);
  drawLattice(ctx, width, height, scale);
  drawSparkles(ctx, width, height, scale);
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  state.sparklePhase += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.62, 0.62);
    state.roll = clamp(state.roll + state.velocityRoll, -0.18, 0.18);

    const damping = Math.pow(0.946, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;
    state.velocityRoll *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
    if (Math.abs(state.velocityRoll) < 0.00004) state.velocityRoll = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.sparklePhase * 0.36) * dt * 0.020;
      state.roll += Math.sin(state.sparklePhase * 0.22) * dt * 0.004;
    }
  }

  state.yaw = clamp(state.yaw, -1.18, 1.18);
  state.pitch = clamp(state.pitch, -0.62, 0.62);
  state.roll = clamp(state.roll, -0.18, 0.18);

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

    state.yaw = clamp(state.yaw + dx * 0.0068, -1.18, 1.18);
    state.pitch = clamp(state.pitch - dy * 0.0044, -0.62, 0.62);
    state.roll = clamp(state.roll + dx * 0.0009, -0.18, 0.18);

    state.velocityYaw = dx * 0.00225;
    state.velocityPitch = -dy * 0.00138;
    state.velocityRoll = dx * 0.00018;
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
  state.pitch = -0.18;
  state.roll = 0.01;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.velocityRoll = 0;
  state.sparklePhase = 0;
}

function markRoute() {
  document.documentElement.dataset.showroomStatus = "diamond-clarity-rotation-value-restored";
  document.documentElement.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.documentElement.dataset.touchGlideDiamond = "true";
  document.documentElement.dataset.diamondCrystalClarity = "true";
  document.documentElement.dataset.diamondRotationValue = "expanded";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.showroomStatus = "diamond-clarity-rotation-value-restored";
  document.body.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.body.dataset.touchGlideDiamond = "true";
  document.body.dataset.diamondCrystalClarity = "true";
  document.body.dataset.diamondRotationValue = "expanded";
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
        sparkle: true,
        expandedRotationValue: true,
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
