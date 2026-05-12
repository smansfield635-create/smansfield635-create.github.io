// /showroom/index.js
// Fixed crown-cut 256-lattice diamond renderer with finger inspection.
// Full-file replacement.
// Structure is fixed. Pointer/touch controls rotate the viewing angle only.
// No generated image. No CSS diamond substitute. No public receipt spillover.

const MODEL_NAME = "fixed-crown-cut-256-lattice-inspectable";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 58 : 42;

const DEFAULT_YAW = -0.54;
const DEFAULT_PITCH = -0.17;
const MIN_PITCH = -0.62;
const MAX_PITCH = 0.28;

const state = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  raf: 0,
  lastFrame: 0,
  visible: true,
  active: true,
  time: 0,
  stars: [],

  yaw: DEFAULT_YAW,
  pitch: DEFAULT_PITCH,
  targetYaw: DEFAULT_YAW,
  targetPitch: DEFAULT_PITCH,
  velocityYaw: 0,
  velocityPitch: 0,
  interacted: false,

  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  lastPointerTime: 0,
  tapStartTime: 0,
  lastTapAt: 0
};

const RINGS = Object.freeze([
  { y: 0.58, r: 0.22, twist: 0.00 },
  { y: 0.56, r: 0.30, twist: 0.50 },
  { y: 0.52, r: 0.39, twist: 0.00 },
  { y: 0.46, r: 0.50, twist: 0.50 },
  { y: 0.39, r: 0.61, twist: 0.00 },
  { y: 0.31, r: 0.73, twist: 0.50 },
  { y: 0.23, r: 0.86, twist: 0.00 },
  { y: 0.15, r: 0.97, twist: 0.50 },
  { y: 0.07, r: 1.03, twist: 0.00 },
  { y: -0.03, r: 1.00, twist: 0.50 },
  { y: -0.13, r: 0.86, twist: 0.00 },
  { y: -0.24, r: 0.70, twist: 0.50 },
  { y: -0.36, r: 0.54, twist: 0.00 },
  { y: -0.48, r: 0.38, twist: 0.50 },
  { y: -0.59, r: 0.24, twist: 0.00 },
  { y: -0.68, r: 0.12, twist: 0.50 },
  { y: -0.74, r: 0.00, twist: 0.00 }
]);

const SECTORS = 16;
const FACE_COUNT = 256;

function $(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  };
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  };
}

function project(p, view) {
  const depth = view.camera - p.z;
  const perspective = view.camera / Math.max(0.32, depth);

  return {
    x: view.cx + p.x * view.scale * perspective,
    y: view.cy - p.y * view.scale * perspective,
    z: p.z,
    perspective
  };
}

function sizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.round(rect.width));
  const cssHeight = Math.max(450, Math.round(rect.height));

  state.canvas.width = Math.round(cssWidth * DPR);
  state.canvas.height = Math.round(cssHeight * DPR);
  state.canvas.style.width = `${cssWidth}px`;
  state.canvas.style.height = `${cssHeight}px`;

  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", { alpha: false, desynchronized: true });

  createStars(MOBILE ? 48 : 92);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash(index, 1),
    y: hash(index, 2),
    r: 0.45 + hash(index, 3) * 1.7,
    a: 0.10 + hash(index, 4) * 0.36,
    p: hash(index, 5) * Math.PI * 2
  }));
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    0,
    width * 0.5,
    height * 0.52,
    Math.max(width, height) * 0.82
  );

  bg.addColorStop(0, "#13264a");
  bg.addColorStop(0.30, "#091832");
  bg.addColorStop(0.68, "#041021");
  bg.addColorStop(1, "#01040c");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.48,
    0,
    width * 0.5,
    height * 0.48,
    width * 0.40
  );

  halo.addColorStop(0, "rgba(142,190,255,0.20)");
  halo.addColorStop(0.38, "rgba(244,191,96,0.065)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.34, height * 0.31, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.20,
    width * 0.5,
    height * 0.5,
    width * 0.74
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.48)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const star of state.stars) {
    const pulse = REDUCED_MOTION ? 0.55 : 0.55 + Math.sin(state.time * 0.001 + star.p) * 0.45;
    const alpha = star.a * pulse;
    const x = star.x * width;
    const y = star.y * height;
    const radius = star.r * DPR;

    ctx.fillStyle = `rgba(235,242,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.r > 1.35) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.44})`;
      ctx.lineWidth = Math.max(0.6, DPR * 0.55);
      ctx.beginPath();
      ctx.moveTo(x - 3.2 * DPR, y);
      ctx.lineTo(x + 3.2 * DPR, y);
      ctx.moveTo(x, y - 3.2 * DPR);
      ctx.lineTo(x, y + 3.2 * DPR);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function buildMesh(view) {
  const screen = [];
  const world = [];

  for (let ringIndex = 0; ringIndex < RINGS.length; ringIndex += 1) {
    screen[ringIndex] = [];
    world[ringIndex] = [];

    const ring = RINGS[ringIndex];

    for (let sector = 0; sector < SECTORS; sector += 1) {
      const angle = ((sector + ring.twist) / SECTORS) * Math.PI * 2;

      const local = {
        x: Math.cos(angle) * ring.r,
        y: ring.y,
        z: Math.sin(angle) * ring.r
      };

      let moved = rotateY(local, view.yaw);
      moved = rotateX(moved, view.pitch);

      world[ringIndex][sector] = moved;
      screen[ringIndex][sector] = project(moved, view);
    }
  }

  return { screen, world };
}

function colorForFace(face, light, secondaryLight, viewDir) {
  const diffuse = clamp(dot(face.normal, light), 0, 1);
  const secondary = clamp(dot(face.normal, secondaryLight), 0, 1);
  const halfVector = normalize(add(light, viewDir));
  const specular = Math.pow(clamp(dot(face.normal, halfVector), 0, 1), 22);
  const fresnel = Math.pow(1 - clamp(Math.abs(dot(face.normal, viewDir)), 0, 1), 2.4);
  const rear = clamp((face.depth + 1.15) / 2.3, 0, 1);

  const cool = diffuse * 0.56 + secondary * 0.22 + specular * 0.92 + fresnel * 0.26;
  const glass = 0.20 + face.band * 0.16 + rear * 0.10;

  const r = Math.round(23 + cool * 186 + specular * 42 + glass * 38);
  const g = Math.round(39 + cool * 184 + specular * 45 + glass * 36);
  const b = Math.round(70 + cool * 205 + specular * 50 + glass * 48);
  const a = clamp(0.20 + diffuse * 0.22 + secondary * 0.10 + specular * 0.24 + fresnel * 0.12 + rear * 0.08, 0.18, 0.84);

  return {
    fill: `rgba(${r},${g},${b},${a})`,
    edge: `rgba(242,248,255,${clamp(0.045 + diffuse * 0.13 + specular * 0.22 + fresnel * 0.08, 0.045, 0.34)})`,
    specular,
    diffuse,
    fresnel
  };
}

function createFaces(mesh) {
  const faces = [];
  const yawLight = state.time * 0.00055;

  const light = normalize({
    x: Math.cos(yawLight) * 0.72,
    y: 0.76,
    z: Math.sin(yawLight) * 0.55 + 0.32
  });

  const secondaryLight = normalize({
    x: -0.62,
    y: 0.42,
    z: 0.68
  });

  const viewDir = normalize({ x: 0, y: 0, z: 1 });

  for (let ring = 0; ring < RINGS.length - 1; ring += 1) {
    for (let sector = 0; sector < SECTORS; sector += 1) {
      const next = (sector + 1) % SECTORS;

      const p00 = mesh.screen[ring][sector];
      const p01 = mesh.screen[ring][next];
      const p11 = mesh.screen[ring + 1][next];
      const p10 = mesh.screen[ring + 1][sector];

      const w00 = mesh.world[ring][sector];
      const w01 = mesh.world[ring][next];
      const w10 = mesh.world[ring + 1][sector];

      const e1 = subtract(w01, w00);
      const e2 = subtract(w10, w00);
      const normal = normalize(cross(e1, e2));

      const depth =
        (mesh.world[ring][sector].z +
          mesh.world[ring][next].z +
          mesh.world[ring + 1][next].z +
          mesh.world[ring + 1][sector].z) / 4;

      const face = {
        points: [p00, p01, p11, p10],
        normal,
        depth,
        band: ring / (RINGS.length - 2),
        ring,
        sector
      };

      faces.push({
        ...face,
        ...colorForFace(face, light, secondaryLight, viewDir)
      });
    }
  }

  return faces.sort((a, b) => a.depth - b.depth);
}

function drawDiamond(ctx, width, height) {
  const view = {
    cx: width * 0.50,
    cy: height * 0.545,
    scale: Math.min(width * 0.43, height * 0.52),
    yaw: state.yaw,
    pitch: state.pitch,
    camera: 4.65
  };

  const mesh = buildMesh(view);
  const faces = createFaces(mesh);

  drawBaseReflection(ctx, view);
  drawFaces(ctx, faces);
  drawLatticeRings(ctx, mesh);
  drawCrownTable(ctx, mesh, view);
  drawInternalRefraction(ctx, mesh);
  drawSparkles(ctx, mesh, view);

  document.documentElement.dataset.showroomModel = MODEL_NAME;
  document.documentElement.dataset.faceCount = String(FACE_COUNT);
  document.documentElement.dataset.inspectable = "true";
}

function drawBaseReflection(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const y = view.cy + view.scale * 0.80;
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.48);
  glow.addColorStop(0, "rgba(255,218,150,0.18)");
  glow.addColorStop(0.38, "rgba(80,120,180,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.38, view.scale * 0.095, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFaces(ctx, faces) {
  ctx.save();

  for (const face of faces) {
    const pts = face.points;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.lineTo(pts[2].x, pts[2].y);
    ctx.lineTo(pts[3].x, pts[3].y);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
    gradient.addColorStop(0, face.fill);
    gradient.addColorStop(0.52, brightenFace(face.specular));
    gradient.addColorStop(1, face.fill);

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = face.edge;
    ctx.lineWidth = Math.max(0.42, DPR * 0.46);
    ctx.stroke();
  }

  ctx.restore();
}

function brightenFace(specular) {
  const alpha = clamp(0.04 + specular * 0.20, 0.04, 0.26);
  return `rgba(255,255,255,${alpha})`;
}

function drawLatticeRings(ctx, mesh) {
  const ringIndices = [0, 2, 4, 6, 8, 9, 11, 13, 15, 16];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const ringIndex of ringIndices) {
    const ring = mesh.screen[ringIndex];
    const isGirdle = ringIndex === 8 || ringIndex === 9;
    const isTable = ringIndex === 0;

    ctx.beginPath();

    for (let i = 0; i < ring.length; i += 1) {
      const p = ring[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.strokeStyle = isGirdle
      ? "rgba(255,255,255,0.28)"
      : isTable
        ? "rgba(255,255,255,0.24)"
        : "rgba(225,238,255,0.115)";

    ctx.lineWidth = Math.max(0.75, DPR * (isGirdle ? 1.25 : 0.75));
    ctx.stroke();
  }

  ctx.restore();
}

function drawCrownTable(ctx, mesh, view) {
  const ring = mesh.screen[0];
  const centerWorld = rotateX(rotateY({ x: 0, y: RINGS[0].y + 0.01, z: 0 }, view.yaw), view.pitch);
  const center = project(centerWorld, view);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const tableGradient = ctx.createRadialGradient(
    center.x - view.scale * 0.06,
    center.y - view.scale * 0.03,
    0,
    center.x,
    center.y,
    view.scale * 0.32
  );

  tableGradient.addColorStop(0, "rgba(255,255,255,0.32)");
  tableGradient.addColorStop(0.45, "rgba(170,205,255,0.12)");
  tableGradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();

  for (let i = 0; i < ring.length; i += 1) {
    const p = ring[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }

  ctx.closePath();
  ctx.fillStyle = tableGradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.30)";
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.stroke();

  ctx.restore();
}

function drawInternalRefraction(ctx, mesh) {
  const paths = [
    [mesh.screen[0][1], mesh.screen[6][4], mesh.screen[15][8]],
    [mesh.screen[1][13], mesh.screen[7][15], mesh.screen[14][2]],
    [mesh.screen[0][6], mesh.screen[8][6], mesh.screen[16][6]],
    [mesh.screen[3][10], mesh.screen[9][12], mesh.screen[15][13]]
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";

  for (let i = 0; i < paths.length; i += 1) {
    const points = paths[i];
    const pulse = REDUCED_MOTION ? 0.55 : 0.48 + Math.sin(state.time * 0.00135 + i * 1.37) * 0.32;

    const gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.30, `rgba(255,255,255,${0.14 * pulse})`);
    gradient.addColorStop(0.55, `rgba(244,191,96,${0.10 * pulse})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1.2, DPR * (i === 2 ? 1.45 : 2.4));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSparkles(ctx, mesh, view) {
  const sparklePoints = [
    mesh.screen[0][0],
    mesh.screen[1][4],
    mesh.screen[4][2],
    mesh.screen[5][13],
    mesh.screen[8][7],
    mesh.screen[9][11],
    mesh.screen[11][4],
    mesh.screen[13][9],
    mesh.screen[15][5],
    project(rotateX(rotateY({ x: 1.05, y: 0.18, z: 0.08 }, view.yaw), view.pitch), view),
    project(rotateX(rotateY({ x: -0.96, y: 0.10, z: 0.18 }, view.yaw), view.pitch), view)
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";

  for (let i = 0; i < sparklePoints.length; i += 1) {
    const p = sparklePoints[i];
    const pulse = REDUCED_MOTION
      ? (i % 2 === 0 ? 0.60 : 0.36)
      : Math.max(0.14, 0.46 + Math.sin(state.time * 0.0018 + i * 0.91) * 0.54);

    const size = (3.8 + (i % 4) * 1.6) * DPR * pulse;

    ctx.strokeStyle = `rgba(255,255,255,${0.25 + pulse * 0.58})`;
    ctx.lineWidth = Math.max(0.85, DPR * 0.95);

    ctx.beginPath();
    ctx.moveTo(p.x - size, p.y);
    ctx.lineTo(p.x + size, p.y);
    ctx.moveTo(p.x, p.y - size);
    ctx.lineTo(p.x, p.y + size);
    ctx.stroke();

    ctx.strokeStyle = `rgba(244,191,96,${0.10 + pulse * 0.18})`;
    ctx.beginPath();
    ctx.moveTo(p.x - size * 0.62, p.y - size * 0.62);
    ctx.lineTo(p.x + size * 0.62, p.y + size * 0.62);
    ctx.moveTo(p.x + size * 0.62, p.y - size * 0.62);
    ctx.lineTo(p.x - size * 0.62, p.y + size * 0.62);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBottomCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(12 * DPR, width * 0.015)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Double tap to reset · Structure remains fixed", width * 0.5, height * 0.94);
  ctx.restore();
}

function render() {
  const ctx = state.ctx;
  if (!ctx) return;

  const { width, height } = state;

  drawBackground(ctx, width, height);
  drawDiamond(ctx, width, height);
  drawBottomCue(ctx, width, height);
}

function updateInspectionMotion() {
  if (!state.dragging) {
    if (!state.interacted && !REDUCED_MOTION) {
      state.targetYaw += 0.0012;
    }

    state.targetYaw += state.velocityYaw;
    state.targetPitch = clamp(state.targetPitch + state.velocityPitch, MIN_PITCH, MAX_PITCH);

    state.velocityYaw *= 0.925;
    state.velocityPitch *= 0.905;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
  }

  state.yaw += (state.targetYaw - state.yaw) * 0.22;
  state.pitch += (state.targetPitch - state.pitch) * 0.22;
  state.pitch = clamp(state.pitch, MIN_PITCH, MAX_PITCH);
}

function frame(now) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  if (!state.lastFrame || now - state.lastFrame >= FRAME_MS) {
    state.lastFrame = now;
    state.time = now;
    updateInspectionMotion();
    render();
  }

  state.raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (state.raf) return;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (!state.raf) return;
  window.cancelAnimationFrame(state.raf);
  state.raf = 0;
}

function resetInspection() {
  state.targetYaw = DEFAULT_YAW;
  state.targetPitch = DEFAULT_PITCH;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.interacted = false;
}

function installPointerInspection() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.style.touchAction = "none";

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = performance.now();
    state.tapStartTime = performance.now();
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.interacted = true;

    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const dt = Math.max(12, now - state.lastPointerTime);
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    const yawDelta = dx * 0.0085;
    const pitchDelta = dy * 0.0065;

    state.targetYaw += yawDelta;
    state.targetPitch = clamp(state.targetPitch + pitchDelta, MIN_PITCH, MAX_PITCH);

    state.velocityYaw = clamp((yawDelta / dt) * 18, -0.045, 0.045);
    state.velocityPitch = clamp((pitchDelta / dt) * 14, -0.030, 0.030);

    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = now;

    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const travel = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
    const tapDuration = now - state.tapStartTime;
    const isTap = travel < 10 && tapDuration < 260;
    const isDoubleTap = isTap && now - state.lastTapAt < 340;

    if (isDoubleTap) {
      resetInspection();
      state.lastTapAt = 0;
    } else if (isTap) {
      state.lastTapAt = now;
    }

    state.dragging = false;
    state.pointerId = null;

    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.16 : 0.075;

    if (event.key === "ArrowLeft") {
      state.interacted = true;
      state.targetYaw -= step;
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      state.interacted = true;
      state.targetYaw += step;
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch - step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch + step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "Home" || event.key === "0") {
      resetInspection();
      event.preventDefault();
    }
  });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";
    if (state.active) startLoop();
    else stopLoop();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.canvas) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;
      if (state.visible) startLoop();
      else stopLoop();
    }, { threshold: 0.05 });

    observer.observe(state.canvas);
  }
}

function installResize() {
  let timer = 0;

  window.addEventListener("resize", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      sizeCanvas();
      render();
    }, 120);
  }, { passive: true });
}

function boot() {
  state.canvas = $("showroomDiamondCanvas");
  if (!state.canvas) return;

  sizeCanvas();
  installPointerInspection();
  installVisibility();
  installResize();
  render();
  startLoop();

  window.DGBShowroomDiamond = {
    model: MODEL_NAME,
    faceCount: FACE_COUNT,
    fixedStructure: true,
    inspectable: true,
    generatedImage: false,
    graphicBox: false,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        faceCount: FACE_COUNT,
        rings: RINGS.length,
        sectors: SECTORS,
        fixedStructure: true,
        inspectable: true,
        yaw: state.yaw,
        pitch: state.pitch
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
  model: MODEL_NAME,
  faceCount: FACE_COUNT,
  inspectable: true
};
