// /world/render/index.js
// MODE: RENDER CONTRACT RENEWAL (MOTION AUTHORITY)
// STATUS: NON-DRIFT | MOTION-INJECTED | STATIC-FIELD-COMPATIBLE | SINGLE-PASS
// OWNER: SEAN

/* =========================
   RENDER PRINCIPLE
========================= */
// Planet field = static
// Motion = render responsibility
// Time = injected here ONLY

let START_TIME = null;

/* =========================
   UTIL
========================= */

function now() {
  return performance.now();
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

function normalizeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

/* =========================
   MOTION MODEL
========================= */

function getTimeState() {
  const t = now();
  if (START_TIME === null) START_TIME = t;

  const elapsed = (t - START_TIME) / 1000; // seconds

  return {
    elapsed,
    slow: elapsed * 0.1,
    medium: elapsed * 0.25,
    fast: elapsed * 0.6
  };
}

/* =========================
   PROJECTION (SPHERE)
========================= */

function project(latDeg, lonDeg, width, height, time) {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;

  // rotation over time (THIS CREATES VISIBLE MOTION)
  const rotation = time.slow;
  const lonRot = lon + rotation;

  const x = Math.cos(lat) * Math.cos(lonRot);
  const y = Math.sin(lat);

  const screenX = (x * 0.5 + 0.5) * width;
  const screenY = (-y * 0.5 + 0.5) * height;

  return { x: screenX, y: screenY };
}

/* =========================
   COLOR MODEL (FIXES WHITE WASH)
========================= */

function colorFromSample(sample, time) {
  const elevation = sample.elevation || 0;
  const water = sample.waterMask === 1;

  if (water) {
    const depth = clamp(sample.waterDepth || 0, 0, 1);
    const shimmer = Math.sin(time.medium + sample.latDeg * 0.1) * 0.05;

    return [
      10,
      40 + depth * 80,
      120 + depth * 100 + shimmer * 50
    ];
  }

  const base = clamp(elevation, 0, 1);

  // dynamic lighting
  const light = 0.6 + Math.sin(time.slow + sample.lonDeg * 0.05) * 0.2;

  const r = clamp(40 + base * 120 * light, 0, 255);
  const g = clamp(80 + base * 140 * light, 0, 255);
  const b = clamp(40 + base * 80 * light, 0, 255);

  return [r, g, b];
}

/* =========================
   MAIN RENDER
========================= */

export function renderPlanet({
  ctx,
  planetField,
  viewState = {},
  canvas
}) {
  if (!ctx || !planetField) {
    throw new Error("renderPlanet missing inputs");
  }

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const time = getTimeState();

  // clear
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  const samples = planetField.samples;
  const h = samples.length;
  const w = samples[0]?.length || 0;

  const stepX = width / w;
  const stepY = height / h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = samples[y][x];

      const p = project(s.latDeg, s.lonDeg, width, height, time);

      const color = colorFromSample(s, time);

      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

      ctx.fillRect(p.x, p.y, stepX + 1, stepY + 1);
    }
  }

  return {
    projectionState: "SPHERE_TIME_ROTATION",
    renderAuthority: "RENDER_MOTION_LAYER",
    density: w * h,
    audit: "MOTION_ACTIVE"
  };
}

export default { renderPlanet };
