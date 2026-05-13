const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_LOCKED_CROWN_CUT_256_LATTICE_RESTORE_TNT_v1",
  route: "/showroom/",
  role: "showroom-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  earthRecord: false,
  generatedImage: false,
  graphicBox: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

const state = {
  rotationX: -0.22,
  rotationY: 0.34,
  velocityX: 0,
  velocityY: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  width: 0,
  height: 0,
  dpr: 1
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function markRoute() {
  document.documentElement.dataset.showroomStatus = "locked-diamond-restored";
  document.documentElement.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
  document.documentElement.dataset.touchGlideDiamond = "true";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.showroomStatus = "locked-diamond-restored";
  document.body.dataset.diamondLock = "CROWN_CUT_256_LATTICE_FIXED_FORM";
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

function project(point, width, height, scale) {
  const [x, y, z] = rotate(point);
  const perspective = 1 / (1 + z * 0.24);
  return {
    x: width * 0.5 + x * scale * perspective,
    y: height * 0.49 + y * scale * perspective,
    z,
    p: perspective
  };
}

function rotate(point) {
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

function diamondMesh() {
  const crown = [];
  const girdleTop = [];
  const girdleBottom = [];

  const crownCount = 32;
  for (let i = 0; i < crownCount; i += 1) {
    const a = (i / crownCount) * TAU;
    const ripple = 1 + 0.035 * Math.sin(i * PHI);
    girdleTop.push([Math.cos(a) * 1.38 * ripple, -0.02 + 0.035 * Math.sin(i * 3), Math.sin(a) * 0.40 * ripple]);
    girdleBottom.push([Math.cos(a) * 1.28 * ripple, 0.28 + 0.028 * Math.sin(i * 2), Math.sin(a) * 0.36 * ripple]);
    crown.push([Math.cos(a) * 0.82 * ripple, -0.42 + 0.025 * Math.sin(i * 5), Math.sin(a) * 0.24 * ripple]);
  }

  const top = [0, -0.56, 0];
  const pavilion = [0, 0.82, 0];

  const faces = [];
  for (let i = 0; i < crownCount; i += 1) {
    const n = (i + 1) % crownCount;
    faces.push([top, crown[i], crown[n]]);
    faces.push([crown[i], girdleTop[i], girdleTop[n], crown[n]]);
    faces.push([girdleTop[i], girdleBottom[i], girdleBottom[n], girdleTop[n]]);
    faces.push([girdleBottom[i], pavilion, girdleBottom[n]]);
  }

  return { faces, top, pavilion, crown, girdleTop, girdleBottom };
}

const mesh = diamondMesh();

function faceDepth(face) {
  return face.reduce((sum, point) => sum + rotate(point)[2], 0) / face.length;
}

function faceTone(face, index) {
  const depth = faceDepth(face);
  const glint = 0.5 + 0.5 * Math.sin(index * PHI + state.rotationY * 2.1);
  const base = clamp(0.38 + depth * 0.16 + glint * 0.18, 0.18, 0.86);
  return {
    fill: `rgba(${Math.round(116 + base * 96)}, ${Math.round(132 + base * 84)}, ${Math.round(156 + base * 72)}, ${0.30 + base * 0.28})`,
    stroke: `rgba(219, 232, 248, ${0.12 + base * 0.26})`
  };
}

function drawStars(ctx, width, height) {
  ctx.save();
  for (let i = 0; i < 44; i += 1) {
    const x = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const y = ((Math.sin(i * 78.233) * 24634.6345) % 1 + 1) % 1;
    const px = x * width;
    const py = y * height;
    const alpha = 0.16 + 0.18 * (((i * 13) % 17) / 17);
    const size = i % 9 === 0 ? 6 : i % 5 === 0 ? 3 : 1.5;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px - size, py);
    ctx.lineTo(px + size, py);
    ctx.moveTo(px, py - size);
    ctx.lineTo(px, py + size);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDiamond(ctx, width, height) {
  const scale = Math.min(width, height) * 0.285;

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.55, scale * 0.2, width * 0.5, height * 0.58, scale * 2.0);
  glow.addColorStop(0, "rgba(244,207,131,0.16)");
  glow.addColorStop(0.48, "rgba(117,151,194,0.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const sorted = mesh.faces
    .map((face, index) => ({ face, index, depth: faceDepth(face) }))
    .sort((a, b) => a.depth - b.depth);

  for (const item of sorted) {
    const points = item.face.map((point) => project(point, width, height, scale));
    const tone = faceTone(item.face, item.index);

    ctx.beginPath();
    points.forEach((point, idx) => {
      if (idx === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fillStyle = tone.fill;
    ctx.strokeStyle = tone.stroke;
    ctx.lineWidth = Math.max(0.75, width * 0.0014);
    ctx.fill();
    ctx.stroke();
  }

  ctx.save();
  ctx.globalAlpha = 0.40;
  ctx.strokeStyle = "rgba(235,244,255,0.24)";
  ctx.lineWidth = Math.max(1, width * 0.0012);

  for (let i = 0; i < mesh.girdleTop.length; i += 2) {
    const a = project(mesh.girdleTop[i], width, height, scale);
    const b = project(mesh.girdleBottom[(i + 9) % mesh.girdleBottom.length], width, height, scale);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();

  const shadow = ctx.createRadialGradient(width * 0.5, height * 0.74, scale * 0.05, width * 0.5, height * 0.74, scale * 0.55);
  shadow.addColorStop(0, "rgba(244,207,131,0.16)");
  shadow.addColorStop(0.55, "rgba(80,105,140,0.12)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.74, scale * 0.54, scale * 0.10, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(4,11,24,0.94)");
  bg.addColorStop(0.55, "rgba(6,16,32,0.96)");
  bg.addColorStop(1, "rgba(2,7,16,0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
  drawDiamond(ctx, width, height);
}

function resize(canvas, ctx) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(480, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    state.width = width;
    state.height = height;
    state.dpr = dpr;
    render(canvas, ctx);
  }
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resize(canvas, ctx);

  if (!state.dragging) {
    state.rotationY += state.velocityY;
    state.rotationX = clamp(state.rotationX + state.velocityX, -0.72, 0.72);

    const damping = Math.pow(0.945, dt * 60);
    state.velocityY *= damping;
    state.velocityX *= damping;

    if (Math.abs(state.velocityY) < 0.00008) state.velocityY = 0;
    if (Math.abs(state.velocityX) < 0.00008) state.velocityX = 0;
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

    state.rotationY += dx * 0.0062;
    state.rotationX = clamp(state.rotationX - dy * 0.0048, -0.72, 0.72);

    state.velocityY = dx * 0.0019;
    state.velocityX = -dy * 0.0013;
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
  state.rotationX = -0.22;
  state.rotationY = 0.34;
  state.velocityX = 0;
  state.velocityY = 0;
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
  resize(canvas, ctx);

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
