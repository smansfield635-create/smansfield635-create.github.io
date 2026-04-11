const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CANVAS = document.getElementById("fieldCanvas");
const STAGE = document.getElementById("orbitalStage");
const NODES = Array.from(document.querySelectorAll(".orbitNode"));

const PRODUCT_LAYOUT = {
  1: { radiusX: 252, radiusY: 118, speed: 0.00016, depth: 64, zipper: 28, scaleBase: 0.86, scaleSpan: 0.30 },
  2: { radiusX: 192, radiusY: 92,  speed: -0.00022, depth: 40, zipper: 22, scaleBase: 0.88, scaleSpan: 0.24 },
  3: { radiusX: 136, radiusY: 66,  speed: 0.00030, depth: 24, zipper: 16, scaleBase: 0.90, scaleSpan: 0.18 }
};

const pointer = { x: 0.5, y: 0.5 };
const field = {
  stars: [],
  width: 0,
  height: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2)
};

function resizeCanvas() {
  if (!CANVAS) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  field.width = w;
  field.height = h;
  CANVAS.width = Math.floor(w * field.dpr);
  CANVAS.height = Math.floor(h * field.dpr);
  CANVAS.style.width = w + "px";
  CANVAS.style.height = h + "px";
  const ctx = CANVAS.getContext("2d");
  ctx.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
  buildStars();
}

function buildStars() {
  const count = Math.min(180, Math.max(120, Math.floor((field.width * field.height) / 14000)));
  field.stars = Array.from({ length: count }, () => ({
    x: Math.random() * field.width,
    y: Math.random() * field.height,
    z: 0.25 + Math.random() * 0.75,
    size: 0.6 + Math.random() * 2.2,
    drift: (Math.random() - 0.5) * 0.08,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawField() {
  if (!CANVAS) return;
  const ctx = CANVAS.getContext("2d");
  ctx.clearRect(0, 0, field.width, field.height);

  const gx = (pointer.x - 0.5) * 36;
  const gy = (pointer.y - 0.5) * 36;

  for (const star of field.stars) {
    star.pulse += 0.01 * star.z;
    star.y += star.drift * star.z;
    if (star.y < -10) star.y = field.height + 10;
    if (star.y > field.height + 10) star.y = -10;

    const px = star.x + gx * star.z;
    const py = star.y + gy * star.z;
    const alpha = 0.18 + (Math.sin(star.pulse) * 0.5 + 0.5) * 0.42 * star.z;

    ctx.beginPath();
    ctx.fillStyle = `rgba(190,225,255,${alpha.toFixed(3)})`;
    ctx.arc(px, py, star.size * star.z, 0, Math.PI * 2);
    ctx.fill();
  }

  const grad = ctx.createRadialGradient(
    field.width * 0.5 + gx * 2,
    field.height * 0.34 + gy * 2,
    0,
    field.width * 0.5,
    field.height * 0.5,
    Math.max(field.width, field.height) * 0.48
  );
  grad.addColorStop(0, "rgba(127,255,212,0.05)");
  grad.addColorStop(0.45, "rgba(126,203,255,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, field.width, field.height);
}

function getLemniscatePosition(theta, cfg, zipperSign) {
  // Figure-eight traversal via Gerono lemniscate:
  // x = a sin(t), y = b sin(t) cos(t)
  const x = Math.sin(theta) * cfg.radiusX;
  const y = Math.sin(theta) * Math.cos(theta) * cfg.radiusY;

  // Zipper law:
  // alternate lanes cross the center on staggered depth and vertical offsets
  // so cards "zip" past each other instead of stacking directly on top.
  const zipperOffset = zipperSign * cfg.zipper;
  const zippedY = y + zipperOffset * Math.cos(theta);
  const z = Math.cos(theta * 2) * cfg.depth + zipperSign * (cfg.zipper * 0.45);

  return { x, y: zippedY, z };
}

function placeNodes(now) {
  if (!STAGE) return;

  const tiltX = (pointer.y - 0.5) * -14;
  const tiltY = (pointer.x - 0.5) * 18;
  STAGE.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  NODES.forEach((node, index) => {
    const ringId = Number(node.dataset.ring || 1);
    const baseAngle = Number(node.dataset.angle || 0) * (Math.PI / 180);
    const cfg = PRODUCT_LAYOUT[ringId] || PRODUCT_LAYOUT[1];

    const zipperSign = index % 2 === 0 ? 1 : -1;
    const zipperPhase = zipperSign > 0 ? 0 : Math.PI / 2;
    const t = REDUCED_MOTION ? 0 : now * cfg.speed;
    const theta = baseAngle + t + zipperPhase;

    const pos = getLemniscatePosition(theta, cfg, zipperSign);

    const normalizedDepth = (pos.z + cfg.depth + cfg.zipper * 0.45) / ((cfg.depth + cfg.zipper * 0.45) * 2);
    const clampedDepth = Math.max(0, Math.min(1, normalizedDepth));
    const scale = cfg.scaleBase + clampedDepth * cfg.scaleSpan;
    const opacity = 0.58 + clampedDepth * 0.42;

    node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) scale(${scale})`;
    node.style.opacity = opacity.toFixed(3);
    node.style.zIndex = String(Math.round(1000 + pos.z));
  });
}

function frame(now) {
  drawField();
  placeNodes(now);
  window.requestAnimationFrame(frame);
}

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / Math.max(window.innerWidth, 1);
  pointer.y = event.clientY / Math.max(window.innerHeight, 1);
}, { passive: true });

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
window.requestAnimationFrame(frame);
