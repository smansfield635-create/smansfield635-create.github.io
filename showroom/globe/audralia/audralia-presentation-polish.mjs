const WORLD_CANVAS = document.querySelector('[data-h-earth-map-wide-canvas]');
const PLANET_RADIUS = 6200;
const ATMOSPHERE_RADIUS = 6320;
const PLANET_CENTER = Object.freeze([0, -PLANET_RADIUS, 0]);
const POLISH_SCHEMA = 'AUDRALIA_PRESENTATION_POLISH_v2';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
const add = (a, b) => a.map((value, index) => value + b[index]);
const sub = (a, b) => a.map((value, index) => value - b[index]);
const scale = (vector, amount) => vector.map(value => value * amount);
const norm = vector => {
  const length = Math.hypot(...vector) || 1;
  return vector.map(value => value / length);
};

function tangentDirection(u, v) {
  const radius = Math.hypot(u, v);
  if (radius < 1e-9) return [0, 1, 0];
  const angle = radius / PLANET_RADIUS;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return norm([sine * u / radius, cosine, sine * v / radius]);
}

function surfacePosition(direction, elevation = 0) {
  return [
    PLANET_CENTER[0] + direction[0] * (PLANET_RADIUS + elevation),
    PLANET_CENTER[1] + direction[1] * (PLANET_RADIUS + elevation),
    PLANET_CENTER[2] + direction[2] * (PLANET_RADIUS + elevation)
  ];
}

function tangentPosition(u, v) {
  return surfacePosition(tangentDirection(u, v), 0);
}

function cameraFrame(snapshot) {
  const pitch = clamp(snapshot.pitch, 0.46, 1.49);
  const distance = clamp(snapshot.distance, 95, 5600);
  const yaw = snapshot.yaw;
  const direction = tangentDirection(snapshot.targetU, snapshot.targetV);
  const target = surfacePosition(direction, 0);
  const pU1 = tangentPosition(snapshot.targetU + 1, snapshot.targetV);
  const pU0 = tangentPosition(snapshot.targetU - 1, snapshot.targetV);
  const pV1 = tangentPosition(snapshot.targetU, snapshot.targetV + 1);
  const pV0 = tangentPosition(snapshot.targetU, snapshot.targetV - 1);
  const eU = norm(sub(pU1, pU0));
  const eV = norm(sub(pV1, pV0));
  const horizontal = norm(add(scale(eU, Math.sin(yaw)), scale(eV, Math.cos(yaw))));
  const eye = add(add(target, scale(direction, distance * Math.sin(pitch) + 18)), scale(horizontal, distance * Math.cos(pitch)));
  const forward = norm(sub(target, eye));
  let right = cross(forward, direction);
  if (Math.hypot(...right) < 1e-5) right = eU;
  right = norm(right);
  const up = norm(cross(right, forward));
  return { eye, forward, right, up, localUp: norm(sub(eye, PLANET_CENTER)) };
}

function sphereHit(origin, direction, radius) {
  const oc = sub(origin, PLANET_CENTER);
  const b = dot(oc, direction);
  const c = dot(oc, oc) - radius * radius;
  const h = b * b - c;
  if (h < 0) return -1;
  const root = Math.sqrt(h);
  let t = -b - root;
  if (t <= 0) t = -b + root;
  return t > 0 ? t : -1;
}

function hash(value) {
  const x = Math.sin(value * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

function makeStarDirections(count, phase, depthClass) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - ((index + 0.5) / count) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * (index + phase) + (hash(index + phase * 17) - 0.5) * 0.17;
    points.push(Object.freeze({
      direction: Object.freeze(norm([Math.cos(theta) * radius, y, Math.sin(theta) * radius])),
      depthClass,
      brightness: 0.56 + hash(index * 3.17 + phase) * 0.44,
      temperature: hash(index * 7.91 + phase * 2.3),
      size: 0.72 + hash(index * 5.21 + phase * 8.4) * 0.56
    }));
  }
  return points;
}

const STAR_FIELD = Object.freeze([
  ...makeStarDirections(270, 1.7, 0),
  ...makeStarDirections(96, 19.4, 1),
  ...makeStarDirections(26, 43.8, 2)
]);

let renderer = null;
let celestialState = null;
let starCanvas = null;
let starContext = null;
let running = true;
let lastSignature = '';
let lastStarRenderMs = 0;

function createStarCanvas() {
  if (!(WORLD_CANVAS instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_POLISH_WORLD_CANVAS_MISSING');
  const parent = WORLD_CANVAS.parentElement;
  if (!(parent instanceof HTMLElement)) throw new Error('AUDRALIA_POLISH_STAGE_MISSING');
  starCanvas = document.createElement('canvas');
  starCanvas.setAttribute('aria-hidden', 'true');
  starCanvas.dataset.audraliaSupplementalStars = 'true';
  Object.assign(starCanvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '1',
    background: 'transparent'
  });
  parent.appendChild(starCanvas);
  starContext = starCanvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!starContext) throw new Error('AUDRALIA_POLISH_STAR_CANVAS_UNAVAILABLE');
}

function resizeStarCanvas() {
  const rect = WORLD_CANVAS.getBoundingClientRect();
  const area = Math.max(1, rect.width * rect.height);
  const dprScale = Math.min(1.2, Math.max(0.88, (window.devicePixelRatio || 1) * 0.43));
  const capScale = Math.sqrt(360000 / area);
  const renderScale = Math.max(0.72, Math.min(dprScale, capScale));
  const width = Math.max(1, Math.round(rect.width * renderScale));
  const height = Math.max(1, Math.round(rect.height * renderScale));
  if (starCanvas.width !== width || starCanvas.height !== height) {
    starCanvas.width = width;
    starCanvas.height = height;
  }
  return { width, height };
}

function starVisibility(frame, sun) {
  const altitude = Math.max(0, Math.hypot(...sub(frame.eye, PLANET_CENTER)) - PLANET_RADIUS);
  const atmosphericPresence = 1 - clamp((altitude - 180) / (1350 - 180), 0, 1);
  const observerDay = dot(frame.localUp, sun);
  const daylight = clamp((observerDay + 0.16) / 0.40, 0, 1);
  const smoothedDaylight = daylight * daylight * (3 - 2 * daylight);
  return clamp(1 - atmosphericPresence * smoothedDaylight, 0, 1);
}

function renderStars(now = performance.now()) {
  if (!renderer || !celestialState || !starCanvas || !starContext) return;
  const { width, height } = resizeStarCanvas();
  starContext.clearRect(0, 0, width, height);
  const snapshot = renderer.getSnapshot();
  const frame = cameraFrame(snapshot);
  const sun = celestialState.getSolarVector();
  const visibility = starVisibility(frame, sun);
  if (visibility < 0.015) return;

  const tanHalfFov = Math.tan(55 * Math.PI / 360);
  const aspect = width / Math.max(1, height);
  const focalX = width / (2 * tanHalfFov * aspect);
  const focalY = height / (2 * tanHalfFov);

  for (const star of STAR_FIELD) {
    const direction = star.direction;
    const forward = dot(direction, frame.forward);
    if (forward <= 0.04) continue;
    if (sphereHit(frame.eye, direction, ATMOSPHERE_RADIUS) > 0) continue;

    const x = width * 0.5 + (dot(direction, frame.right) / forward) * focalX;
    const y = height * 0.5 - (dot(direction, frame.up) / forward) * focalY;
    if (x < -3 || y < -3 || x > width + 3 || y > height + 3) continue;

    const depthGain = star.depthClass === 0 ? 0.30 : star.depthClass === 1 ? 0.54 : 0.90;
    const radius = star.depthClass === 0 ? 0.48 : star.depthClass === 1 ? 0.72 : 1.12;
    const alpha = visibility * depthGain * star.brightness;
    const warm = star.temperature > 0.72;
    const cool = star.temperature < 0.28;
    const color = warm ? [255, 233, 197] : cool ? [205, 225, 255] : [238, 242, 246];

    if (star.depthClass === 2) {
      const glowRadius = radius * star.size * 3.5;
      const gradient = starContext.createRadialGradient(x, y, 0, x, y, glowRadius);
      gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${Math.min(0.44, alpha * 0.46)})`);
      gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);
      starContext.fillStyle = gradient;
      starContext.beginPath();
      starContext.arc(x, y, glowRadius, 0, Math.PI * 2);
      starContext.fill();
    }

    starContext.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
    starContext.beginPath();
    starContext.arc(x, y, radius * star.size, 0, Math.PI * 2);
    starContext.fill();
  }

  lastStarRenderMs = now;
  starCanvas.dataset.visibility = visibility.toFixed(3);
}

function snapshotSignature(snapshot) {
  return [snapshot.yaw, snapshot.pitch, snapshot.distance, snapshot.targetU, snapshot.targetV]
    .map(value => Number(value).toFixed(4))
    .join('|');
}

function tick(now) {
  if (!running) return;
  if (!document.hidden && renderer) {
    const snapshot = renderer.getSnapshot();
    const signature = snapshotSignature(snapshot);
    const changed = signature !== lastSignature;
    if (changed || now - lastStarRenderMs > 950) {
      lastSignature = signature;
      renderStars(now);
    }
  }
  requestAnimationFrame(tick);
}

async function initialize() {
  try {
    if (!(WORLD_CANVAS instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_POLISH_WORLD_CANVAS_MISSING');
    const started = performance.now();
    while ((!renderer || !celestialState) && performance.now() - started < 30000) {
      renderer = window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer || renderer;
      celestialState = window.__AUDRALIA_CELESTIAL_STATE__ || celestialState;
      if (!renderer || !celestialState) await new Promise(resolve => setTimeout(resolve, 80));
    }
    if (!renderer || !celestialState) throw new Error('AUDRALIA_POLISH_AUTHORITY_TIMEOUT');
    createStarCanvas();
    renderStars();
    window.addEventListener('resize', () => {
      lastSignature = '';
      renderStars();
    }, { passive: true });
    window.__AUDRALIA_PRESENTATION_POLISH__ = Object.freeze({
      schema: POLISH_SCHEMA,
      cloudArchitectureMutated: false,
      cloudPresentationMutated: false,
      supplementalWorldAnchoredStars: STAR_FIELD.length,
      starDaylightSuppressionUsesCelestialAuthority: true,
      worldCoordinatesMutated: false,
      celestialAuthorityMutated: false,
      unsafeCloudCanvasFilterPresent: false
    });
    requestAnimationFrame(tick);
  } catch (error) {
    console.error('AUDRALIA_PRESENTATION_POLISH_FAILED', error);
    window.__AUDRALIA_PRESENTATION_POLISH_ERROR__ = Object.freeze({
      schema: POLISH_SCHEMA,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

initialize();
