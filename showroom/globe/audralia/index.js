// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_ROUTE_JS_TNT_v1
//
// Paired HTML:
// AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_HTML_SHELL_TNT_v1
//
// Scope: Audralia route JS only.
// Purpose:
// - Establish the true spherical globe carrier before final planet material refinement.
// - Generate 16 radial nodes × 16 Fibonacci bands = 256 spherical seats.
// - Render Planet View and Lattice View from the same spherical carrier.
// - Keep Planet View clean: no lattice overlay.
// - Keep Lattice View separate: no full material planet body, only spherical structure.
// - Update compact Diagnostic Scope.
// - Support drag, release momentum, double-tap reset.
// - No generated image. No GraphicBox. No flat projection. No visible legacy handoff wall.

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_ROUTE_JS_TNT_v1";
const AUDRALIA_HTML_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_HTML_SHELL_TNT_v1";
const AUDRALIA_STANDARD = "AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_STANDARD_v1";

const RADIAL_NODES = 16;
const FIBONACCI_BANDS = 16;
const LATTICE_STATES = 256;
const TAU = Math.PI * 2;

const FIBONACCI_SEQUENCE = Object.freeze([
  1, 1, 2, 3, 5, 8, 13, 21,
  34, 55, 89, 144, 233, 377, 610, 987
]);

const FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

const LENS_COPY = Object.freeze({
  planet: {
    title: "Planet View",
    label: "<strong>Planet View</strong> → Audralia · true spherical globe carrier",
    copy:
      "Planet View shows Audralia as a material globe expression on the spherical carrier. No lattice overlay. No diagnostic wall. The planet is carried by true sphere math."
  },
  lattice: {
    title: "Lattice View",
    label: "<strong>Lattice View</strong> → spherical 16 × 16 / 256 planetary-seat structure",
    copy:
      "Lattice View maps 16 radial nodes through 16 Fibonacci-governed bands onto the same spherical carrier, producing 256 planetary seats with front/back visibility."
  },
  diagnostic: {
    title: "Diagnostic Scope",
    label: "<strong>Diagnostic Scope</strong> → compact route, sphere, renderer, and seat status",
    copy:
      "Diagnostic Scope reports whether the route JS, spherical carrier, render loop, active lens, and 256-seat lattice are alive without becoming the public page body."
  }
});

const state = {
  stage: null,
  mount: null,
  diagnosticMount: null,
  canvas: null,
  ctx: null,

  activeLens: "planet",
  seats: [],
  seatGrid: [],
  ringLinks: [],
  spineLinks: [],
  fibonacciLinks: [],

  yaw: -0.56,
  pitch: -0.18,
  roll: 0.02,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,

  dpr: 1,
  time: 0,
  lastFrame: 0,
  renderCount: 0,
  raf: 0,

  routeJsReady: false,
  sphereMathReady: false,
  planetViewReady: false,
  latticeViewReady: false,
  diagnosticScopeReady: false,
  touchReady: false,
  canvasReady: false,
  duplicateCanvasCount: 0,

  sphericalProjection: true,
  flatProjectionBlocked: true,
  frontBackVisibility: true,
  rotationAppliedBeforeProjection: true,
  generatedImage: false,
  graphicBox: false,

  errors: []
};

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, finite(value, min)));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function normalize3(point) {
  const length = Math.hypot(point.x, point.y, point.z) || 1;

  return {
    x: point.x / length,
    y: point.y / length,
    z: point.z / length
  };
}

function rotatePoint(point) {
  let x = point.x;
  let y = point.y;
  let z = point.z;

  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  x = x1;
  z = z1;

  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const y1 = y * cp - z * sp;
  const z2 = y * sp + z * cp;
  y = y1;
  z = z2;

  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);
  const x2 = x * cr - y * sr;
  const y2 = x * sr + y * cr;

  return { x: x2, y: y2, z };
}

function getStageMetrics() {
  const canvas = state.canvas;
  const width = canvas ? canvas.width : 640;
  const height = canvas ? canvas.height : 720;
  const minSide = Math.min(width, height);
  const mobile = width < 760 * state.dpr;

  return {
    width,
    height,
    centerX: width / 2,
    centerY: mobile ? height * 0.42 : height * 0.43,
    radius: minSide * (mobile ? 0.335 : 0.355),
    cameraDistance: 3.72
  };
}

function projectPoint(point) {
  const metrics = getStageMetrics();
  const rotated = rotatePoint(point);
  const denominator = Math.max(0.72, metrics.cameraDistance - rotated.z);
  const perspective = metrics.cameraDistance / denominator;

  return {
    x: metrics.centerX + rotated.x * metrics.radius * perspective,
    y: metrics.centerY - rotated.y * metrics.radius * perspective,
    z: rotated.z,
    frontFacing: rotated.z >= 0,
    perspective,
    rotated
  };
}

function pointFromLonLat(longitude, latitude) {
  const cosLat = Math.cos(latitude);

  return {
    x: cosLat * Math.cos(longitude),
    y: Math.sin(latitude),
    z: cosLat * Math.sin(longitude)
  };
}

function createSeat(radialIndex, bandIndex) {
  const u = (bandIndex + 0.5) / FIBONACCI_BANDS;
  const y = 1 - 2 * u;
  const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
  const longitude = TAU * (radialIndex / RADIAL_NODES);
  const latitude = Math.asin(y);
  const position = {
    x: ringRadius * Math.cos(longitude),
    y,
    z: ringRadius * Math.sin(longitude)
  };

  const normal = normalize3(position);
  const fibonacci = FIBONACCI_SEQUENCE[bandIndex];
  const fibonacciWeight = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];

  return Object.freeze({
    seatIndex: bandIndex * RADIAL_NODES + radialIndex,
    radialIndex,
    bandIndex,
    longitude,
    latitude,
    spherePosition: Object.freeze(position),
    surfaceNormal: Object.freeze(normal),
    fibonacci,
    fibonacciWeight,
    renderPriority:
      radialIndex % 4 === 0 ? 1 :
      radialIndex % 2 === 0 ? 0.74 :
      0.54,
    connectionPriority:
      radialIndex % 4 === 0 ? 1 :
      radialIndex % 2 === 0 ? 0.70 :
      0.48,
    futureMaterialClass: "pending-audralia-material",
    futureDiagnosticState: "carrier-seat-ready"
  });
}

function buildSphereSeats() {
  const seatGrid = [];

  for (let bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
    const band = [];

    for (let radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
      band.push(createSeat(radialIndex, bandIndex));
    }

    seatGrid.push(Object.freeze(band));
  }

  function seat(radialIndex, bandIndex) {
    const r = ((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    const b = clamp(bandIndex, 0, FIBONACCI_BANDS - 1);
    return seatGrid[b][r];
  }

  const ringLinks = [];
  const spineLinks = [];
  const fibonacciLinks = [];

  for (let bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
    for (let radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
      ringLinks.push({
        a: seat(radialIndex, bandIndex),
        b: seat(radialIndex + 1, bandIndex),
        family: "band-ring",
        major: radialIndex % 4 === 0
      });
    }
  }

  for (let radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
    for (let bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
      spineLinks.push({
        a: seat(radialIndex, bandIndex),
        b: seat(radialIndex, bandIndex + 1),
        family: "radial-spine",
        major: radialIndex % 4 === 0
      });
    }
  }

  for (let bandIndex = 0; bandIndex < FIBONACCI_BANDS - 1; bandIndex += 1) {
    const offset = FIBONACCI_OFFSETS[bandIndex % FIBONACCI_OFFSETS.length];

    for (let radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
      fibonacciLinks.push({
        a: seat(radialIndex, bandIndex),
        b: seat(radialIndex + offset, bandIndex + 1),
        family: `fibonacci-forward-${offset}`,
        offset,
        major: radialIndex % 4 === 0 || bandIndex % 4 === 0
      });

      if (bandIndex % 2 === 0) {
        fibonacciLinks.push({
          a: seat(radialIndex, bandIndex),
          b: seat(radialIndex - offset, bandIndex + 1),
          family: `fibonacci-return-${offset}`,
          offset,
          major: radialIndex % 4 === 0
        });
      }
    }
  }

  state.seatGrid = seatGrid;
  state.seats = seatGrid.flat();
  state.ringLinks = ringLinks;
  state.spineLinks = spineLinks;
  state.fibonacciLinks = fibonacciLinks;
  state.sphereMathReady = state.seats.length === LATTICE_STATES;
}

function resizeCanvas() {
  if (!state.canvas || !state.mount) return;

  const box = state.mount.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((box.width || 640) * dpr));
  const height = Math.max(620, Math.floor((box.height || 720) * dpr));

  if (state.canvas.width !== width) state.canvas.width = width;
  if (state.canvas.height !== height) state.canvas.height = height;

  state.dpr = dpr;
  state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  state.ctx.clearRect(0, 0, width, height);
}

function drawLimb(ctx, options = {}) {
  const metrics = getStageMetrics();
  const alpha = options.alpha ?? 1;
  const lineWidth = options.lineWidth ?? 1.4 * state.dpr;

  ctx.save();
  ctx.globalAlpha = alpha;

  const atmosphere = ctx.createRadialGradient(
    metrics.centerX - metrics.radius * 0.20,
    metrics.centerY - metrics.radius * 0.28,
    metrics.radius * 0.05,
    metrics.centerX,
    metrics.centerY,
    metrics.radius * 1.16
  );

  atmosphere.addColorStop(0, "rgba(255,255,255,0.20)");
  atmosphere.addColorStop(0.34, "rgba(141,216,255,0.10)");
  atmosphere.addColorStop(0.72, "rgba(20,70,130,0.05)");
  atmosphere.addColorStop(1, "rgba(141,216,255,0.00)");

  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.17, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = "rgba(141,216,255,0.40)";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function clipSphere(ctx) {
  const metrics = getStageMetrics();
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.clip();
}

function drawSphereBody(ctx) {
  const metrics = getStageMetrics();

  ctx.save();

  const body = ctx.createRadialGradient(
    metrics.centerX - metrics.radius * 0.30,
    metrics.centerY - metrics.radius * 0.32,
    metrics.radius * 0.05,
    metrics.centerX,
    metrics.centerY,
    metrics.radius
  );

  body.addColorStop(0, "rgba(228,247,255,0.90)");
  body.addColorStop(0.16, "rgba(100,192,220,0.70)");
  body.addColorStop(0.38, "rgba(16,104,153,0.82)");
  body.addColorStop(0.68, "rgba(6,42,89,0.95)");
  body.addColorStop(1, "rgba(1,8,24,1)");

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.fill();

  clipSphere(ctx);

  drawAudraliaMaterialPatches(ctx);

  const terminator = ctx.createLinearGradient(
    metrics.centerX - metrics.radius,
    metrics.centerY - metrics.radius,
    metrics.centerX + metrics.radius,
    metrics.centerY + metrics.radius
  );

  terminator.addColorStop(0, "rgba(255,255,255,0.16)");
  terminator.addColorStop(0.44, "rgba(255,255,255,0.02)");
  terminator.addColorStop(0.72, "rgba(0,0,0,0.20)");
  terminator.addColorStop(1, "rgba(0,0,0,0.50)");

  ctx.fillStyle = terminator;
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.fill();

  ctx.restore();

  drawLimb(ctx, { alpha: 1, lineWidth: 1.55 * state.dpr });
}

function materialPatch(points, color, stroke) {
  return { points, color, stroke };
}

function makeLatLonPatch(centerLon, centerLat, width, height, count, wobble = 0.22) {
  const points = [];

  for (let index = 0; index < count; index += 1) {
    const angle = TAU * (index / count);
    const radiusPulse = 1 + Math.sin(index * 2.17 + centerLon * 0.7) * wobble;
    const lon = centerLon + Math.cos(angle) * width * radiusPulse;
    const lat = centerLat + Math.sin(angle) * height * radiusPulse * 0.72;

    points.push({ lon, lat });
  }

  return points;
}

function drawAudraliaMaterialPatches(ctx) {
  const patches = [
    materialPatch(
      makeLatLonPatch(-0.80, 0.22, 0.62, 0.35, 13, 0.24),
      "rgba(218,230,221,0.72)",
      "rgba(255,255,255,0.18)"
    ),
    materialPatch(
      makeLatLonPatch(0.72, -0.12, 0.56, 0.30, 12, 0.20),
      "rgba(180,205,190,0.66)",
      "rgba(255,255,255,0.15)"
    ),
    materialPatch(
      makeLatLonPatch(1.72, 0.46, 0.32, 0.22, 10, 0.18),
      "rgba(232,230,216,0.58)",
      "rgba(255,255,255,0.13)"
    ),
    materialPatch(
      makeLatLonPatch(-1.95, -0.42, 0.40, 0.19, 11, 0.19),
      "rgba(196,218,208,0.52)",
      "rgba(255,255,255,0.11)"
    )
  ];

  for (const patch of patches) {
    const projected = patch.points
      .map((point) => {
        const spherePoint = pointFromLonLat(point.lon, point.lat);
        const rotated = rotatePoint(spherePoint);
        const frontFacing = rotated.z > -0.12;
        return { ...projectPoint(spherePoint), frontFacing };
      })
      .filter((point) => point.frontFacing);

    if (projected.length < 3) continue;

    ctx.save();
    ctx.globalAlpha = 0.78;
    ctx.fillStyle = patch.color;
    ctx.strokeStyle = patch.stroke;
    ctx.lineWidth = 1 * state.dpr;

    ctx.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function linkDepth(link) {
  const a = rotatePoint(link.a.spherePosition);
  const b = rotatePoint(link.b.spherePosition);
  return (a.z + b.z) / 2;
}

function drawLink(ctx, link, options = {}) {
  const a = projectPoint(link.a.spherePosition);
  const b = projectPoint(link.b.spherePosition);
  const avgZ = (a.z + b.z) / 2;
  const front = avgZ >= 0;
  const family = options.family || link.family || "";
  const major = Boolean(link.major);

  let alpha = front ? 0.68 : 0.13;
  let width = front ? 1.18 : 0.72;
  let color = front ? "rgba(132,220,255,1)" : "rgba(78,126,170,1)";

  if (family.includes("spine")) {
    alpha = front ? (major ? 0.88 : 0.58) : 0.10;
    width = major ? 1.65 : 1.05;
    color = major ? "rgba(255,218,130,1)" : "rgba(150,230,255,1)";
  }

  if (family.includes("ring")) {
    alpha = front ? (major ? 0.70 : 0.50) : 0.10;
    width = major ? 1.35 : 0.92;
    color = major ? "rgba(255,220,140,1)" : "rgba(110,210,255,1)";
  }

  if (family.includes("fibonacci")) {
    alpha = front ? (major ? 0.48 : 0.25) : 0.055;
    width = major ? 1.20 : 0.72;
    color = major ? "rgba(255,196,86,1)" : "rgba(168,236,255,1)";
  }

  alpha *= options.alphaScale ?? 1;
  width *= state.dpr;

  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function drawSeatNode(ctx, seat) {
  const point = projectPoint(seat.spherePosition);
  const front = point.z >= 0;
  const cardinal = seat.radialIndex % 4 === 0;
  const even = seat.radialIndex % 2 === 0;

  const alpha = front
    ? cardinal ? 0.98 : even ? 0.74 : 0.48
    : cardinal ? 0.14 : 0.06;

  const radius = (cardinal ? 3.6 : even ? 2.7 : 1.9) * state.dpr * point.perspective;
  const fill = cardinal ? "rgba(255,218,120,1)" : even ? "rgba(160,235,255,1)" : "rgba(94,174,230,1)";

  if (alpha <= 0.03) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, TAU);
  ctx.fill();

  if (front && cardinal) {
    ctx.globalAlpha = alpha * 0.26;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 2.5, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawSphericalLattice(ctx) {
  const metrics = getStageMetrics();

  ctx.save();

  const ghost = ctx.createRadialGradient(
    metrics.centerX - metrics.radius * 0.25,
    metrics.centerY - metrics.radius * 0.30,
    metrics.radius * 0.04,
    metrics.centerX,
    metrics.centerY,
    metrics.radius
  );

  ghost.addColorStop(0, "rgba(190,238,255,0.12)");
  ghost.addColorStop(0.48, "rgba(30,90,150,0.08)");
  ghost.addColorStop(1, "rgba(0,0,0,0.02)");

  ctx.fillStyle = ghost;
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.fill();

  ctx.restore();

  drawLimb(ctx, { alpha: 0.92, lineWidth: 1.35 * state.dpr });

  const allLinks = [
    ...state.ringLinks,
    ...state.spineLinks,
    ...state.fibonacciLinks
  ].sort((a, b) => linkDepth(a) - linkDepth(b));

  for (const link of allLinks) {
    drawLink(ctx, link, {
      family: link.family,
      alphaScale: 1
    });
  }

  const sortedSeats = state.seats
    .slice()
    .sort((a, b) => rotatePoint(a.spherePosition).z - rotatePoint(b.spherePosition).z);

  for (const seat of sortedSeats) {
    drawSeatNode(ctx, seat);
  }
}

function clearCanvas() {
  if (!state.ctx || !state.canvas) return;
  state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
}

function render() {
  if (!state.ctx || !state.canvas || !state.sphereMathReady) return;

  resizeCanvas();
  clearCanvas();

  if (state.activeLens === "lattice") {
    drawSphericalLattice(state.ctx);
    state.latticeViewReady = true;
  } else {
    drawSphereBody(state.ctx);
    state.planetViewReady = true;
  }

  state.renderCount += 1;
  updateDiagnostics();
  publishStatus("render");
}

function step(timestamp) {
  const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
  state.lastFrame = timestamp;
  state.time += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;

    const damping = Math.pow(0.94, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;

    if (Math.abs(state.velocityYaw) < 0.00006) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00006) state.velocityPitch = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0 && !prefersReducedMotion()) {
      state.yaw += dt * 0.045;
    }
  }

  state.pitch = clamp(state.pitch, -1.05, 1.05);
  state.roll = Math.sin(state.time * 0.16) * 0.015;

  render();
  state.raf = window.requestAnimationFrame(step);
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resetGlobe() {
  state.yaw = -0.56;
  state.pitch = -0.18;
  state.roll = 0.02;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  render();
}

function bindPointer() {
  if (!state.stage) return;

  state.stage.style.touchAction = "none";

  state.stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) {
      resetGlobe();
    }

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;

    try {
      state.stage.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    } catch (_error) {}
  }, { passive: false });

  state.stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.008;
    state.pitch = clamp(state.pitch + dy * 0.0054, -1.05, 1.05);

    state.velocityYaw = clamp(dx * 0.0022, -0.048, 0.048);
    state.velocityPitch = clamp(dy * 0.0015, -0.034, 0.034);

    try {
      event.preventDefault();
    } catch (_error) {}
  }, { passive: false });

  const release = (event) => {
    if (!state.dragging) return;

    state.dragging = false;

    try {
      state.stage.releasePointerCapture?.(event.pointerId);
    } catch (_error) {}
  };

  state.stage.addEventListener("pointerup", release, { passive: true });
  state.stage.addEventListener("pointercancel", release, { passive: true });
  state.stage.addEventListener("pointerleave", release, { passive: true });

  state.touchReady = true;
}

function setLens(nextLens) {
  const lens = Object.prototype.hasOwnProperty.call(LENS_COPY, nextLens) ? nextLens : "planet";
  state.activeLens = lens;

  document.documentElement.dataset.audraliaActiveLens = lens;

  document.querySelectorAll("[data-audralia-lens-button]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.audraliaLensButton === lens ? "true" : "false");
  });

  const title = document.querySelector("[data-audralia-lens-title]");
  const copy = document.querySelector("[data-audralia-lens-copy]");
  const label = document.querySelector("[data-audralia-stage-label]");

  if (title) title.textContent = LENS_COPY[lens].title;
  if (copy) copy.textContent = LENS_COPY[lens].copy;
  if (label) label.innerHTML = LENS_COPY[lens].label;

  render();
  publishStatus("set-lens");

  window.dispatchEvent(new CustomEvent("audralia:route-js-lens", {
    detail: status()
  }));
}

function bindLensControls() {
  document.querySelectorAll("[data-audralia-lens-button]").forEach((button) => {
    button.addEventListener("click", () => {
      setLens(button.dataset.audraliaLensButton);
    });
  });

  window.addEventListener("audralia:lens", (event) => {
    const lens = event && event.detail && event.detail.activeLens
      ? event.detail.activeLens
      : document.documentElement.dataset.audraliaActiveLens;

    if (lens && lens !== state.activeLens) {
      setLens(lens);
    }
  });

  setLens(document.documentElement.dataset.audraliaActiveLens || "planet");
}

function updateDiagnosticText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function updateDiagnostics() {
  state.diagnosticScopeReady = Boolean(state.diagnosticMount);

  updateDiagnosticText(
    "[data-audralia-diagnostic-route-js]",
    state.routeJsReady ? "active" : "pending"
  );

  updateDiagnosticText(
    "[data-audralia-diagnostic-sphere]",
    state.sphereMathReady ? "active · 256 seats · spherical projection" : "pending"
  );

  updateDiagnosticText(
    "[data-audralia-diagnostic-planet]",
    state.planetViewReady ? "active · material globe carrier" : "pending"
  );

  updateDiagnosticText(
    "[data-audralia-diagnostic-lattice]",
    state.latticeViewReady ? "active · spherical 16 × 16 / 256 lattice" : "pending"
  );

  updateDiagnosticText(
    "[data-audralia-diagnostic-seats]",
    `${RADIAL_NODES} × ${FIBONACCI_BANDS} = ${state.seats.length}`
  );
}

function neutralizeDuplicateCanvases() {
  if (!state.mount || !state.canvas) return;

  const canvases = Array.from(state.mount.querySelectorAll("canvas"));
  let duplicates = 0;

  canvases.forEach((canvas) => {
    if (canvas === state.canvas) return;

    duplicates += 1;
    canvas.setAttribute("data-audralia-legacy-canvas-neutralized", "true");
    canvas.style.display = "none";
    canvas.style.visibility = "hidden";
    canvas.style.pointerEvents = "none";

    try {
      canvas.remove();
    } catch (_error) {}
  });

  state.duplicateCanvasCount += duplicates;
}

function createCanonicalCanvas() {
  if (!state.mount) return null;

  const existing = state.mount.querySelector("canvas[data-audralia-true-globe-canvas]");
  const canvas = existing || document.createElement("canvas");

  canvas.setAttribute("data-audralia-true-globe-canvas", "true");
  canvas.setAttribute("data-contract", AUDRALIA_ROUTE_CONTRACT);
  canvas.setAttribute("data-globe-carrier", "sphere");
  canvas.setAttribute("data-spherical-projection", "true");
  canvas.setAttribute("data-flat-projection-blocked", "true");
  canvas.setAttribute("data-radial-nodes", String(RADIAL_NODES));
  canvas.setAttribute("data-fibonacci-bands", String(FIBONACCI_BANDS));
  canvas.setAttribute("data-lattice-states", String(LATTICE_STATES));
  canvas.setAttribute("data-generated-image", "false");
  canvas.setAttribute("data-graphic-box", "false");

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    background: "transparent",
    pointerEvents: "none"
  });

  if (!existing) {
    state.mount.appendChild(canvas);
  }

  state.canvas = canvas;
  state.ctx = canvas.getContext("2d", { alpha: true });
  state.canvasReady = Boolean(state.ctx);

  neutralizeDuplicateCanvases();

  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(() => {
      neutralizeDuplicateCanvases();
    });

    observer.observe(state.mount, { childList: true, subtree: false });
  }

  return canvas;
}

function markRoute() {
  const root = document.documentElement;
  const body = document.body;

  const markers = {
    audraliaRouteJsContract: AUDRALIA_ROUTE_CONTRACT,
    audraliaHtmlContract: AUDRALIA_HTML_CONTRACT,
    audraliaStandard: AUDRALIA_STANDARD,
    audraliaRouteJsReady: "true",
    audraliaSphereMathReady: state.sphereMathReady ? "true" : "false",
    audraliaGlobeCarrier: "sphere",
    audraliaSphericalProjection: "true",
    audraliaFlatProjectionBlocked: "true",
    audraliaFrontBackVisibility: "true",
    audraliaRotationAppliedBeforeProjection: "true",
    audraliaRadialNodes: String(RADIAL_NODES),
    audraliaFibonacciBands: String(FIBONACCI_BANDS),
    audraliaLatticeStates: String(LATTICE_STATES),
    audraliaSphereSeats: String(state.seats.length),
    visibleLegacyHandoff: "false",
    generatedImage: "false",
    graphicBox: "false",
    audraliaEarthCrossover: "false",
    australiaNamingDrift: "false",
    visualPassClaimed: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    root.dataset[key] = value;
    if (body) body.dataset[key] = value;
  });

  window.AUDRALIA_G2_ROUTE_JS_CONTRACT = AUDRALIA_ROUTE_CONTRACT;
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error || scope);

  state.errors.push({
    scope,
    message,
    time: new Date().toISOString()
  });

  document.documentElement.dataset.audraliaRouteJsError = message;
  publishStatus(`error:${scope}`);
}

function status() {
  return Object.freeze({
    contract: AUDRALIA_ROUTE_CONTRACT,
    htmlContract: AUDRALIA_HTML_CONTRACT,
    standard: AUDRALIA_STANDARD,
    route: "/showroom/globe/audralia/",
    activeLens: state.activeLens,

    radialNodes: RADIAL_NODES,
    fibonacciBands: FIBONACCI_BANDS,
    latticeStates: LATTICE_STATES,
    sphereSeats: state.seats.length,

    sphericalProjection: state.sphericalProjection,
    flatProjectionBlocked: state.flatProjectionBlocked,
    frontBackVisibility: state.frontBackVisibility,
    rotationAppliedBeforeProjection: state.rotationAppliedBeforeProjection,

    routeJsReady: state.routeJsReady,
    sphereMathReady: state.sphereMathReady,
    planetViewReady: state.planetViewReady,
    latticeViewReady: state.latticeViewReady,
    diagnosticScopeReady: state.diagnosticScopeReady,
    canvasReady: state.canvasReady,
    touchReady: state.touchReady,

    duplicateCanvas: state.duplicateCanvasCount > 0,
    duplicateCanvasCount: state.duplicateCanvasCount,
    renderCount: state.renderCount,

    yaw: state.yaw,
    pitch: state.pitch,

    generatedImage: false,
    graphicBox: false,
    visibleLegacyHandoff: false,
    earthCrossover: false,
    australiaNamingDrift: false,
    errors: state.errors.slice()
  });
}

function publishStatus(scope = "publish") {
  const payload = Object.freeze({
    scope,
    ...status()
  });

  window.AUDRALIA_G2_TRUE_GLOBE_STATUS = payload;
  window.AUDRALIA_G2_TRUE_GLOBE_SPHERICAL_LATTICE_STATUS = payload;

  document.documentElement.dataset.audraliaRouteJsReady = state.routeJsReady ? "true" : "false";
  document.documentElement.dataset.audraliaSphereMathReady = state.sphereMathReady ? "true" : "false";
  document.documentElement.dataset.audraliaSphereSeats = String(state.seats.length);
  document.documentElement.dataset.audraliaRenderCount = String(state.renderCount);
  document.documentElement.dataset.audraliaActiveLens = state.activeLens;

  return payload;
}

function publishApi() {
  window.AUDRALIA_G2_TRUE_GLOBE = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    htmlContract: AUDRALIA_HTML_CONTRACT,
    standard: AUDRALIA_STANDARD,
    setLens,
    resetGlobe,
    render,
    status
  };

  window.AUDRALIA_G2_TRUE_GLOBE_STATUS = status();

  return window.AUDRALIA_G2_TRUE_GLOBE;
}

function init() {
  try {
    state.stage = document.querySelector("#audraliaGlobeStage") || document.querySelector("[data-audralia-globe-stage]");
    state.mount = document.querySelector("#audraliaGlobeMount") || document.querySelector("[data-audralia-globe-mount]");
    state.diagnosticMount = document.querySelector("#audraliaDiagnosticMount") || document.querySelector("[data-audralia-diagnostic-mount]");

    if (!state.stage || !state.mount) {
      throw new Error("AUDRALIA_GLOBE_STAGE_OR_MOUNT_MISSING");
    }

    buildSphereSeats();
    createCanonicalCanvas();

    if (!state.canvasReady) {
      throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
    }

    state.routeJsReady = true;

    markRoute();
    bindPointer();
    bindLensControls();
    updateDiagnostics();

    window.addEventListener("resize", render, { passive: true });

    render();
    publishApi();

    if (!state.raf) {
      state.raf = window.requestAnimationFrame(step);
    }

    publishStatus("init-complete");

    return window.AUDRALIA_G2_TRUE_GLOBE;
  } catch (error) {
    recordError("init", error);
    return null;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export {
  AUDRALIA_ROUTE_CONTRACT,
  AUDRALIA_HTML_CONTRACT,
  AUDRALIA_STANDARD,
  init,
  setLens,
  resetGlobe,
  status
};

export default AUDRALIA_ROUTE_CONTRACT;
