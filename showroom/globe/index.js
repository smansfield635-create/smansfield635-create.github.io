// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_INDEX_CLEAN_SUBLEVEL_GLOBE_TNT_v1
// Role: public Globe Showcase selector only.
// Visual law: clean inspectable sub-level terrain globe.
// Removed: water, landmasses, oceans, lakes, coastlines, beaches, child terrain import, visible 256 terrain fabric.
// Preserved: drag inspection, world selection, route entry, lighting, atmosphere, private engines asleep.

const MODEL_NAME = "showroom-globe-index-clean-sublevel-globe-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 64 : 48;

const DEFAULT_YAW = -0.66;
const DEFAULT_PITCH = -0.18;
const MIN_PITCH = -1.04;
const MAX_PITCH = 0.74;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;

const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const PORTRAIT_LAT_STEPS = MOBILE ? 64 : 82;
const PORTRAIT_LON_STEPS = MOBILE ? 128 : 164;

const SUBLEVEL_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "clean sub-level terrain globe",
  privateEnginesAsleep: true,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  privateModelPaths: Object.freeze({
    earth: "/showroom/globe/earth/",
    hEarth: "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  })
});

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    seed: 310,
    base: [62, 88, 112],
    low: [26, 42, 64],
    mid: [86, 104, 118],
    high: [156, 148, 128],
    ridge: [210, 206, 184],
    fault: [180, 224, 238],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    seed: 710,
    base: [66, 96, 104],
    low: [25, 48, 64],
    mid: [82, 120, 112],
    high: [152, 150, 118],
    ridge: [220, 213, 176],
    fault: [158, 242, 196],
    glow: "rgba(143,240,195,0.22)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    seed: 910,
    base: [84, 78, 112],
    low: [34, 34, 72],
    mid: [108, 96, 126],
    high: [170, 146, 108],
    ridge: [226, 205, 160],
    fault: [198, 172, 255],
    glow: "rgba(190,170,255,0.22)"
  }
});

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
  worldKey: "hEarth",

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

function $(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function valueNoise2D(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);

  const n00 = hash(xi, yi, seed);
  const n10 = hash(xi + 1, yi, seed);
  const n01 = hash(xi, yi + 1, seed);
  const n11 = hash(xi + 1, yi + 1, seed);

  return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy) * 2 - 1;
}

function fbm2D(x, y, seed = 0, octaves = 4) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 23) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge2D(x, y, seed = 0) {
  return 1 - Math.abs(fbm2D(x, y, seed, 4));
}

function warp2D(x, y, seed = 0, amountX = 0.25, amountY = 0.18) {
  return {
    x: x + fbm2D(x * 0.7 + 13.1, y * 0.7 - 9.4, seed + 1, 3) * amountX,
    y: y + fbm2D(x * 0.7 - 6.2, y * 0.7 + 11.7, seed + 2, 3) * amountY
  };
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
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

function makePoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

function project(p, view) {
  return {
    x: view.cx + p.x * view.scale,
    y: view.cy - p.y * view.scale,
    z: p.z
  };
}

function wrapLonDelta(lon, center) {
  return Math.atan2(Math.sin(lon - center), Math.cos(lon - center));
}

function ribbonField(lat, lon, centerLat, centerLon, length, width, angle, phase = 0) {
  const x = wrapLonDelta(lon, centerLon);
  const y = lat - centerLat;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const xr = x * c - y * s;
  const yr = x * s + y * c;

  const curved = yr + Math.sin(xr * 2.8 + phase) * 0.075 + Math.sin(xr * 5.6 - phase) * 0.028;
  const along = Math.abs(xr) / length;
  const across = Math.abs(curved) / width;

  return 1 - Math.max(along * 0.72, across);
}

function basinField(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = wrapLonDelta(lon, centerLon) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
  ];
}

function colorString(color) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

function sizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.round(rect.width));
  const cssHeight = Math.max(480, Math.round(rect.height));

  state.canvas.width = Math.round(cssWidth * DPR);
  state.canvas.height = Math.round(cssHeight * DPR);
  state.canvas.style.width = `${cssWidth}px`;
  state.canvas.style.height = `${cssHeight}px`;

  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", { alpha: false, desynchronized: true });

  createStars(MOBILE ? 56 : 118);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash(index, 1),
    y: hash(index, 2),
    r: 0.45 + hash(index, 3) * 1.85,
    a: 0.10 + hash(index, 4) * 0.34,
    p: hash(index, 5) * Math.PI * 2
  }));
}

function sampleSublevel(lat, lon, world) {
  const seed = world.seed;

  const global = warp2D(lon * 0.62, lat * 0.68, seed + 1, 0.40, 0.28);
  const local = warp2D(lon * 1.34, lat * 1.18, seed + 2, 0.16, 0.12);

  const shellPressure =
    fbm2D(global.x * 0.56 + 3.1, global.y * 0.64 - 4.4, seed + 10, 4) * 0.36 +
    fbm2D(global.x * 1.15 - 7.6, global.y * 1.06 + 2.8, seed + 11, 4) * 0.18 +
    fbm2D(local.x * 2.10 + 1.7, local.y * 1.86 - 5.9, seed + 12, 3) * 0.08;

  const longRidgeA = ribbonField(global.y, global.x, 0.16, -1.22, 1.72, 0.105, -0.38, 0.4);
  const longRidgeB = ribbonField(global.y, global.x, -0.18, 0.86, 1.50, 0.095, 0.34, 2.1);
  const longRidgeC = ribbonField(global.y, global.x, 0.52, 0.18, 1.20, 0.090, -0.12, -1.2);
  const longRidgeD = ribbonField(global.y, global.x, -0.58, -0.52, 1.28, 0.095, 0.24, 1.7);

  const ridgeSystem =
    Math.max(longRidgeA, longRidgeB, longRidgeC, longRidgeD, 0) * 0.30 +
    ridge2D(local.x * 1.55 + 4.2, local.y * 1.50 - 7.2, seed + 20) * 0.18 +
    ridge2D(local.x * 2.90 - 8.1, local.y * 2.70 + 3.8, seed + 21) * 0.08;

  const basinA = basinField(global.y, global.x, 0.22, -2.08, 0.50, 0.44);
  const basinB = basinField(global.y, global.x, -0.34, 1.74, 0.44, 0.48);
  const basinC = basinField(global.y, global.x, 0.70, 0.64, 0.28, 0.62);
  const basinD = basinField(global.y, global.x, -0.72, -1.08, 0.28, 0.58);

  const basinPressure = Math.max(basinA, basinB, basinC, basinD) * 0.26;

  const fractureA = ribbonField(global.y, global.x, 0.00, 0.20, 1.85, 0.040, 0.06, 0.7);
  const fractureB = ribbonField(global.y, global.x, 0.36, -1.78, 0.92, 0.036, 0.42, 2.0);
  const fractureC = ribbonField(global.y, global.x, -0.40, 1.28, 0.92, 0.038, -0.36, -0.8);

  const fracture = Math.max(fractureA, fractureB, fractureC, 0);

  const polarCompression = smoothstep(1.02, 1.50, Math.abs(lat)) * 0.16;
  const equatorialPlateSpread = (1 - smoothstep(0.18, 1.10, Math.abs(lat))) * 0.08;

  const elevation =
    shellPressure +
    ridgeSystem -
    basinPressure -
    fracture * 0.14 +
    polarCompression -
    equatorialPlateSpread;

  const relief = clamp((elevation + 0.54) / 1.08, 0, 1);
  const ridge = clamp(ridgeSystem * 1.50 + fracture * 0.28, 0, 1);
  const basin = clamp(basinPressure * 2.4 + smoothstep(-0.38, -0.06, -elevation) * 0.30, 0, 1);
  const fault = clamp(fracture, 0, 1);

  const fine =
    fbm2D(local.x * 4.20 + 9.0, local.y * 3.80 - 6.0, seed + 31, 3) * 0.55 +
    ridge2D(local.x * 5.40 - 2.0, local.y * 5.00 + 8.0, seed + 32) * 0.45;

  return {
    relief,
    ridge,
    basin,
    fault,
    fine: clamp((fine + 1) * 0.5, 0, 1),
    polarCompression
  };
}

function colorForSublevel(sample, world, light, rim) {
  let base = mixColor(world.low, world.base, 0.50 + sample.relief * 0.28);

  if (sample.basin > 0.22) {
    base = mixColor(base, world.low, clamp(sample.basin * 0.42, 0, 0.52));
  }

  if (sample.relief > 0.56) {
    base = mixColor(base, world.mid, clamp((sample.relief - 0.56) * 0.88, 0, 0.48));
  }

  if (sample.relief > 0.74 || sample.ridge > 0.54) {
    base = mixColor(base, world.high, clamp(Math.max(sample.relief - 0.72, sample.ridge - 0.48) * 0.68, 0, 0.42));
  }

  if (sample.ridge > 0.68) {
    base = mixColor(base, world.ridge, clamp((sample.ridge - 0.68) * 0.62, 0, 0.26));
  }

  if (sample.fault > 0.62) {
    base = mixColor(base, world.fault, clamp((sample.fault - 0.62) * 0.50, 0, 0.16));
  }

  const texture = (sample.fine - 0.5) * 8.5;
  const shade = clamp(light + rim * 0.13, 0.18, 1.18);

  const r = Math.round(clamp((base[0] + texture) * shade, 0, 255));
  const g = Math.round(clamp((base[1] + texture * 0.76) * shade, 0, 255));
  const b = Math.round(clamp((base[2] + texture * 0.58) * shade, 0, 255));

  return `rgb(${r},${g},${b})`;
}

function makeSurfacePatch(lat0, lat1, lon0, lon1, view) {
  const p00 = rotateX(rotateY(makePoint(lat0, lon0), view.yaw), view.pitch);
  const p01 = rotateX(rotateY(makePoint(lat0, lon1), view.yaw), view.pitch);
  const p11 = rotateX(rotateY(makePoint(lat1, lon1), view.yaw), view.pitch);
  const p10 = rotateX(rotateY(makePoint(lat1, lon0), view.yaw), view.pitch);

  const avg = normalize({
    x: (p00.x + p01.x + p11.x + p10.x) * 0.25,
    y: (p00.y + p01.y + p11.y + p10.y) * 0.25,
    z: (p00.z + p01.z + p11.z + p10.z) * 0.25
  });

  if (avg.z < -0.04) return null;

  return {
    points: [
      project(p00, view),
      project(p01, view),
      project(p11, view),
      project(p10, view)
    ],
    normal: avg,
    depth: avg.z,
    lat: (lat0 + lat1) * 0.5,
    lon: (lon0 + lon1) * 0.5
  };
}

function pathPatch(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.lineTo(points[3].x, points[3].y);
  ctx.closePath();
}

function drawBackground(ctx, width, height) {
  const world = WORLDS[state.worldKey];

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
    height * 0.49,
    0,
    width * 0.5,
    height * 0.49,
    width * 0.39
  );

  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
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

function drawGlobeShadow(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const y = view.cy + view.scale * 1.05;
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.66);

  glow.addColorStop(0, world.glow);
  glow.addColorStop(0.38, "rgba(80,120,180,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.58, view.scale * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSphereBase(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();

  const base = ctx.createRadialGradient(
    view.cx - view.scale * 0.22,
    view.cy - view.scale * 0.24,
    view.scale * 0.04,
    view.cx,
    view.cy,
    view.scale * 1.08
  );

  const lightBase = mixColor(world.base, world.ridge, 0.12);
  const darkBase = mixColor(world.low, [0, 0, 0], 0.16);

  base.addColorStop(0, colorString(lightBase));
  base.addColorStop(0.54, colorString(world.base));
  base.addColorStop(1, colorString(darkBase));

  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  const light = normalize({ x: -0.28, y: 0.54, z: 0.92 });
  const patches = [];

  for (let latIndex = 0; latIndex < PORTRAIT_LAT_STEPS; latIndex += 1) {
    const lat0 = -Math.PI / 2 + (latIndex / PORTRAIT_LAT_STEPS) * Math.PI;
    const lat1 = -Math.PI / 2 + ((latIndex + 1) / PORTRAIT_LAT_STEPS) * Math.PI;

    for (let lonIndex = 0; lonIndex < PORTRAIT_LON_STEPS; lonIndex += 1) {
      const lon0 = -Math.PI + (lonIndex / PORTRAIT_LON_STEPS) * Math.PI * 2;
      const lon1 = -Math.PI + ((lonIndex + 1) / PORTRAIT_LON_STEPS) * Math.PI * 2;
      const patch = makeSurfacePatch(lat0, lat1, lon0, lon1, view);
      if (patch) patches.push(patch);
    }
  }

  patches.sort((a, b) => a.depth - b.depth);

  ctx.save();
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  for (const patch of patches) {
    const sample = sampleSublevel(patch.lat, patch.lon, world);
    const diffuse = clamp(dot(patch.normal, light), 0, 1);
    const rim = Math.pow(clamp(1 - Math.abs(patch.normal.z), 0, 1), 2.0);
    const lightValue = 0.36 + diffuse * 0.62 + rim * 0.06;

    pathPatch(ctx, patch.points);
    ctx.fillStyle = colorForSublevel(sample, world, lightValue, rim);
    ctx.fill();
  }

  ctx.restore();
}

function drawSubtleContourLines(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const count = MOBILE ? 7 : 10;

  for (let i = 0; i < count; i += 1) {
    const lat = lerp(-0.82, 0.82, i / Math.max(1, count - 1)) + Math.sin(i * 1.3) * 0.04;
    const points = [];

    for (let j = 0; j <= 72; j += 1) {
      const u = j / 72;
      const lon = -2.80 + u * 5.60;
      const waveLat = lat + Math.sin(lon * 1.8 + i * 0.7) * 0.018;
      const p = makePoint(waveLat, lon);
      const r = rotateX(rotateY(p, view.yaw), view.pitch);
      if (r.z > 0.04) points.push(project(r, view));
    }

    if (points.length < 3) continue;

    ctx.strokeStyle = `rgba(${world.fault[0]},${world.fault[1]},${world.fault[2]},0.045)`;
    ctx.lineWidth = Math.max(0.35, DPR * 0.32);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let j = 1; j < points.length; j += 1) {
      ctx.lineTo(points[j].x, points[j].y);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(view.cx, view.cy, view.scale * 0.76, view.cx, view.cy, view.scale * 1.13);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.72, "rgba(142,190,255,0.10)");
  outer.addColorStop(1, world.glow);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(210,240,255,0.23)";
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.006, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.10)";
  ctx.lineWidth = Math.max(0.7, DPR * 0.75);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.07)";
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.34, view.scale * 0.53, 0.28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawWorldTitle(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(244,191,96,0.92)";
  ctx.font = `950 ${Math.max(18 * DPR, width * 0.038)}px Inter, system-ui, sans-serif`;
  ctx.fillText(world.title, width * 0.5, height * 0.165);

  ctx.fillStyle = "rgba(186,197,212,0.72)";
  ctx.font = `850 ${Math.max(11 * DPR, width * 0.014)}px Inter, system-ui, sans-serif`;
  ctx.fillText(`${world.subtitle} · sub-level terrain globe`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Select a world · Open room for private map", width * 0.5, height * 0.90);
  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.34, height * 0.37);

  const view = {
    cx: width * 0.50,
    cy: height * 0.49,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawGlobeShadow(ctx, view);
  drawSphereBase(ctx, view);
  drawSurface(ctx, view);
  drawSubtleContourLines(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "clean-sublevel-globe";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.mapExpression = "false";
  document.documentElement.dataset.waterExpression = "false";
  document.documentElement.dataset.landmassExpression = "false";
  document.documentElement.dataset.childTerrainImport = "false";
  document.documentElement.dataset.parentCellCount = String(CELL_COUNT);
  document.documentElement.dataset.childFieldsPerParent = String(CHILD_HEX_COUNT);
  document.documentElement.dataset.totalChildFields = String(TOTAL_CHILD_FIELDS);
}

function render() {
  const ctx = state.ctx;
  if (!ctx) return;

  drawBackground(ctx, state.width, state.height);
  drawPlanet(ctx, state.width, state.height);
}

function updateInspectionMotion() {
  if (!state.dragging) {
    if (!state.interacted && !REDUCED_MOTION) {
      state.targetYaw += 0.00095;
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

function setWorld(worldKey) {
  if (!WORLDS[worldKey]) return;
  state.worldKey = worldKey;
  resetInspection();
  updateControls();
  render();
}

function updateControls() {
  const world = WORLDS[state.worldKey];

  document.querySelectorAll("[data-world]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.world === state.worldKey));
  });

  const link = $("activeWorldLink");
  if (link) {
    link.href = world.route;
    link.textContent = `Open ${world.title}`;
  }
}

function installWorldControls() {
  document.querySelectorAll("[data-world]").forEach((button) => {
    button.addEventListener("click", () => {
      setWorld(button.dataset.world);
    });
  });
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
      state.targetPitch = clamp(state.targetPitch + step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch - step, MIN_PITCH, MAX_PITCH);
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
  state.canvas = $("globeShowcaseCanvas");
  if (!state.canvas) return;

  sizeCanvas();
  installWorldControls();
  installPointerInspection();
  installVisibility();
  installResize();
  updateControls();
  render();
  startLoop();

  window.DGBGlobeShowcase = {
    model: MODEL_NAME,
    publicPortraitBaseline: "clean-sublevel-globe",
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    mapExpression: false,
    waterExpression: false,
    landmassExpression: false,
    childTerrainImport: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: CELL_COUNT,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    sublevelModel: SUBLEVEL_MODEL,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: "clean-sublevel-globe",
        privateEnginesAsleep: true,
        generatedImage: false,
        graphicBox: false,
        mapExpression: false,
        waterExpression: false,
        landmassExpression: false,
        childTerrainImport: false,
        parentCellCount: CELL_COUNT,
        childFieldsPerParent: CHILD_HEX_COUNT,
        totalChildFields: TOTAL_CHILD_FIELDS,
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
  publicPortraitBaseline: "clean-sublevel-globe",
  privateEnginesAsleep: true,
  generatedImage: false,
  graphicBox: false,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  sublevelModel: SUBLEVEL_MODEL
};
