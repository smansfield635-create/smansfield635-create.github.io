const root = document.querySelector('[data-spatial-foundation]');
const canvas = document.querySelector('[data-terrain-canvas]');

if (!root || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error('CHARACTERS_SPATIAL_FIELD_FOUNDATION_MOUNT_MISSING');
}

const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
if (!context) throw new Error('CHARACTERS_SPATIAL_FIELD_CANVAS_CONTEXT_UNAVAILABLE');

const TAU = Math.PI * 2;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let width = 0;
let height = 0;
let ratio = 1;
let frame = 0;
let raf = 0;
let resizeTimer = 0;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = t => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function noise2(x, y) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smooth(x - x0);
  const ty = smooth(y - y0);
  const a = hash2(x0, y0);
  const b = hash2(x0 + 1, y0);
  const c = hash2(x0, y0 + 1);
  const d = hash2(x0 + 1, y0 + 1);
  return mix(mix(a, b, tx), mix(c, d, tx), ty);
}

function fbm(x, y) {
  let value = 0;
  let amplitude = .52;
  let frequency = 1;
  for (let octave = 0; octave < 4; octave += 1) {
    value += noise2(x * frequency, y * frequency) * amplitude;
    frequency *= 2.03;
    amplitude *= .48;
  }
  return value;
}

function terrainHeight(nx, ny) {
  const coast = .46 + .09 * Math.sin(nx * 5.4) + .035 * Math.sin(nx * 13.7 + 1.4);
  const coastDistance = ny - coast;
  const continental = clamp((coastDistance + .28) / .5, 0, 1);
  const ridgeA = Math.exp(-Math.pow((ny - (.61 + .08 * Math.sin(nx * 7.1))) / .09, 2));
  const ridgeB = Math.exp(-Math.pow((ny - (.77 - .05 * Math.sin(nx * 5.2 + .6))) / .12, 2));
  const detail = fbm(nx * 4.1 + 3.2, ny * 4.6 + 8.7) - .5;
  return continental * (.18 + detail * .18 + ridgeA * .25 + ridgeB * .15);
}

function size() {
  const rect = root.getBoundingClientRect();
  width = Math.max(1, Math.round(rect.width));
  height = Math.max(1, Math.round(rect.height));
  ratio = Math.min(devicePixelRatio || 1, 1.75);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawWater(time) {
  const top = height * .31;
  const gradient = context.createLinearGradient(0, top, 0, height);
  gradient.addColorStop(0, 'rgba(64, 129, 129, .05)');
  gradient.addColorStop(.48, 'rgba(19, 75, 84, .11)');
  gradient.addColorStop(1, 'rgba(4, 25, 32, .28)');
  context.fillStyle = gradient;
  context.fillRect(0, top, width, height - top);

  context.lineWidth = .7;
  for (let lane = 0; lane < 18; lane += 1) {
    const y = top + lane * ((height - top) / 18);
    context.beginPath();
    for (let x = -30; x <= width + 30; x += 18) {
      const wave = Math.sin(x * .018 + lane * .71 + time * .00015) * (1.2 + lane * .06);
      if (x === -30) context.moveTo(x, y + wave);
      else context.lineTo(x, y + wave);
    }
    context.strokeStyle = `rgba(174, 211, 200, ${.018 + lane * .0018})`;
    context.stroke();
  }
}

function drawContourField() {
  const rows = width < 560 ? 28 : 42;
  const columns = width < 560 ? 48 : 76;
  const horizon = height * .34;
  const depth = height * .63;

  context.save();
  context.globalCompositeOperation = 'screen';
  context.lineWidth = .72;

  for (let level = 1; level <= 8; level += 1) {
    const threshold = level * .055;
    context.beginPath();
    let drawing = false;

    for (let row = 0; row < rows; row += 1) {
      const ny = row / (rows - 1);
      const perspectiveY = horizon + Math.pow(ny, 1.38) * depth;
      for (let col = 0; col < columns; col += 1) {
        const nx = col / (columns - 1);
        const elevation = terrainHeight(nx, ny);
        if (Math.abs(elevation - threshold) < .017) {
          const x = nx * width;
          const y = perspectiveY - elevation * height * .17;
          if (!drawing) {
            context.moveTo(x, y);
            drawing = true;
          } else {
            context.lineTo(x, y);
          }
        } else if (drawing) {
          drawing = false;
        }
      }
    }

    context.strokeStyle = `rgba(213, 219, 170, ${.018 + level * .008})`;
    context.stroke();
  }
  context.restore();
}

function drawLight(time) {
  const x = width * (.69 + Math.sin(time * .00006) * .015);
  const y = height * .17;
  const radius = Math.max(width, height) * .42;
  const glow = context.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, 'rgba(231, 224, 177, .09)');
  glow.addColorStop(.28, 'rgba(168, 196, 158, .035)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function draw(time = 0) {
  context.clearRect(0, 0, width, height);
  drawWater(time);
  drawContourField();
  drawLight(time);
}

function tick(time) {
  draw(time);
  if (!prefersReducedMotion.matches && document.visibilityState === 'visible') {
    raf = requestAnimationFrame(tick);
  }
}

function restart() {
  cancelAnimationFrame(raf);
  size();
  draw(performance.now());
  if (!prefersReducedMotion.matches && document.visibilityState === 'visible') {
    raf = requestAnimationFrame(tick);
  }
}

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(restart, 90);
}

addEventListener('resize', onResize, { passive: true });
document.addEventListener('visibilitychange', restart, { passive: true });
prefersReducedMotion.addEventListener?.('change', restart);

root.dataset.worldRuntime = 'absent';
root.dataset.freeCamera = 'absent';
root.dataset.legacyPresentation = 'absent';
root.dataset.foundationReady = 'true';

restart();
