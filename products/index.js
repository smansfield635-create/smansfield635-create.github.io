const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CANVAS = document.getElementById("fieldCanvas");
const STAGE = document.getElementById("orbitalStage");
const NODES = Array.from(document.querySelectorAll(".orbitNode"));

const PRODUCT_LAYOUT = {
  1: { radius: 250, speed: 0.00018, depth: 56 },
  2: { radius: 188, speed: -0.00024, depth: 34 },
  3: { radius: 132, speed: 0.00032, depth: 18 }
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

function drawField(now) {
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

function placeNodes(now) {
  if (!STAGE) return;

  const tiltX = (pointer.y - 0.5) * -14;
  const tiltY = (pointer.x - 0.5) * 18;

  STAGE.style.transform =
    `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  for (const node of NODES) {
    const ringId = Number(node.dataset.ring || 1);
    const angle = Number(node.dataset.angle || 0);
    const cfg = PRODUCT_LAYOUT[ringId] || PRODUCT_LAYOUT[1];

    const t = REDUCED_MOTION ? 0 : now * cfg.speed;
    const theta = angle * (Math.PI / 180) + t;
    const x = Math.cos(theta) * cfg.radius;
    const y = Math.sin(theta) * cfg.radius * 0.34;
    const z = Math.sin(theta) * cfg.depth;

    const scale = 0.88 + ((z + cfg.depth) / (cfg.depth * 2)) * 0.30;
    const opacity = 0.62 + ((z + cfg.depth) / (cfg.depth * 2)) * 0.38;

    node.style.transform =
      `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
    node.style.opacity = opacity.toFixed(3);
    node.style.zIndex = String(Math.round(1000 + z));
  }
}

function frame(now) {
  drawField(now);
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
