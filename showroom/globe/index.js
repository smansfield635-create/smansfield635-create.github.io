// /showroom/globe/index.js
// Public Globe Showcase stable baseline.
// Role: lightweight public selector and portrait display case.
// H-Earth full model authority is preserved under metadata and should move to private route/assets.
// This file intentionally does not render child-256 fabric or private construction machinery.

const MODEL_NAME = "globe-showcase-public-portrait-stable-baseline-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 64 : 48;

const DEFAULT_YAW = -0.62;
const DEFAULT_PITCH = -0.22;
const MIN_PITCH = -1.05;
const MAX_PITCH = 0.74;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;

const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const PORTRAIT_LAT_STEPS = MOBILE ? 44 : 58;
const PORTRAIT_LON_STEPS = MOBILE ? 88 : 116;

const H_EARTH_PUBLIC_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "stable macro portrait",
  privateModelPath: "/showroom/globe/h-earth/",
  assetAuthority: Object.freeze([
    "/assets/h-earth/h-earth.kernel.js",
    "/assets/h-earth/h-earth.lattice256.js",
    "/assets/h-earth/h-earth.landmap.js",
    "/assets/h-earth/h-earth.tectonics.js",
    "/assets/h-earth/h-earth.surface.js",
    "/assets/h-earth/h-earth.canvas.js",
    "/assets/h-earth/h-earth.controls.js"
  ])
});

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    ocean: [24, 96, 154],
    deep: [8, 35, 94],
    land: [66, 142, 84],
    highland: [122, 128, 96],
    coast: [196, 178, 112],
    ice: [190, 226, 242],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    ocean: [28, 106, 150],
    deep: [7, 34, 102],
    land: [58, 138, 86],
    highland: [118, 134, 104],
    coast: [206, 188, 126],
    ice: [184, 222, 240],
    glow: "rgba(143,240,195,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    ocean: [38, 104, 142],
    deep: [10, 38, 92],
    land: [144, 128, 82],
    highland: [166, 146, 100],
    coast: [218, 190, 126],
    ice: [186, 220, 232],
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

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
  ];
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

function fbm2D(x, y, seed = 0) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < 4; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 23) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
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

function gaussianDistance(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = Math.atan2(Math.sin(lon - centerLon), Math.cos(lon - centerLon)) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function sampleEarth(lat, lon) {
  const polar = Math.abs(lat) / (Math.PI / 2);
  const noise = fbm2D(lon * 1.15 + 8, lat * 1.35 + 4, 11) * 0.12;

  const westernMass =
    gaussianDistance(lat, lon, 0.35, -1.95, 0.78, 0.72) +
    gaussianDistance(lat, lon, -0.45, -1.52, 0.56, 0.54) * 0.75;

  const easternMass =
    gaussianDistance(lat, lon, 0.28, 0.55, 0.72, 0.82) +
    gaussianDistance(lat, lon, -0.34, 1.05, 0.58, 0.55) * 0.70;

  const southernMass = gaussianDistance(lat, lon, -1.15, 0.0, 0.22, 2.8) * 0.82;
  const island = gaussianDistance(lat, lon, -0.20, 2.35, 0.30, 0.34) * 0.58;

  const landScore = Math.max(westernMass, easternMass, southernMass, island) + noise;
  const signed = landScore - 0.42;

  return classifyStableTerrain({ signed, polar, worldKey: "earth", lat, lon });
}

function sampleHEarth(lat, lon) {
  const polar = Math.abs(lat) / (Math.PI / 2);

  const westContinent =
    gaussianDistance(lat, lon, 0.16, -2.02, 0.76, 0.96) +
    gaussianDistance(lat, lon, -0.22, -1.50, 0.52, 0.64) * 0.60;

  const eastContinent =
    gaussianDistance(lat, lon, 0.18, 1.50, 0.78, 0.92) +
    gaussianDistance(lat, lon, -0.10, 2.22, 0.48, 0.62) * 0.54;

  const northernHighland =
    gaussianDistance(lat, lon, 0.72, -0.20, 0.46, 1.02) +
    gaussianDistance(lat, lon, 0.56, 0.56, 0.34, 0.58) * 0.48;

  const southernShelf =
    gaussianDistance(lat, lon, -0.70, 0.15, 0.46, 1.10) +
    gaussianDistance(lat, lon, -0.52, -0.58, 0.32, 0.58) * 0.42;

  const equatorialChain =
    gaussianDistance(lat, lon, 0.00, -0.60, 0.22, 0.48) +
    gaussianDistance(lat, lon, 0.08, 0.12, 0.20, 0.42) +
    gaussianDistance(lat, lon, -0.08, 0.82, 0.22, 0.44);

  const northCrown = gaussianDistance(lat, lon, 1.34, 0.0, 0.27, 3.2);
  const southCrown = gaussianDistance(lat, lon, -1.34, 0.0, 0.27, 3.2);

  const globalNoise =
    fbm2D(lon * 0.85 + 14, lat * 0.95 - 3, 41) * 0.055 +
    fbm2D(lon * 2.05 - 2, lat * 1.75 + 5, 83) * 0.028;

  const centerRift =
    gaussianDistance(lat, lon, 0.02, 0.0, 0.36, 0.48) * 0.18;

  const westDeepOcean = smoothstep(-2.35, -3.05, lon) * 0.18;
  const eastDeepOcean = smoothstep(2.35, 3.05, lon) * 0.18;
  const southernOcean = smoothstep(-0.88, -1.42, lat) * 0.12;

  const landScore =
    Math.max(
      westContinent,
      eastContinent,
      northernHighland,
      southernShelf,
      equatorialChain * 0.72,
      northCrown,
      southCrown
    ) +
    globalNoise -
    centerRift -
    westDeepOcean -
    eastDeepOcean -
    southernOcean;

  const signed = landScore - 0.43;

  return classifyStableTerrain({ signed, polar, worldKey: "hEarth", lat, lon });
}

function sampleAudralia(lat, lon) {
  const polar = Math.abs(lat) / (Math.PI / 2);
  const noise =
    fbm2D(lon * 0.95 + 2, lat * 1.1 + 13, 71) * 0.095 +
    fbm2D(lon * 2.4 - 9, lat * 1.8 + 4, 91) * 0.040;

  const mainArchipelago =
    gaussianDistance(lat, lon, 0.16, -0.72, 0.58, 0.92) +
    gaussianDistance(lat, lon, -0.22, 0.34, 0.48, 0.78) * 0.82 +
    gaussianDistance(lat, lon, 0.42, 1.26, 0.34, 0.50) * 0.54;

  const southernLand = gaussianDistance(lat, lon, -0.78, -0.34, 0.32, 0.92) * 0.66;
  const islandTrail =
    gaussianDistance(lat, lon, 0.00, 1.72, 0.18, 0.34) +
    gaussianDistance(lat, lon, -0.18, 2.18, 0.18, 0.32) * 0.72 +
    gaussianDistance(lat, lon, 0.24, 2.58, 0.15, 0.26) * 0.54;

  const landScore = Math.max(mainArchipelago, southernLand, islandTrail) + noise - 0.08;
  const signed = landScore - 0.44;

  return classifyStableTerrain({ signed, polar, worldKey: "audralia", lat, lon });
}

function classifyStableTerrain({ signed, polar, worldKey, lat, lon }) {
  const iceThreshold = worldKey === "audralia" ? 0.92 : 0.875;
  const iceFade = smoothstep(iceThreshold - 0.045, iceThreshold + 0.035, polar);
  const isIce = iceFade > 0.36;

  const coastPressure = 1 - clamp(Math.abs(signed) / 0.13, 0, 1);
  const isLand = signed > 0 || isIce;
  const isCoast = !isIce && coastPressure > 0.62;
  const isShelf = !isLand && signed > -0.18;
  const isSea = !isLand && signed > -0.32;

  const ridgeNoise = fbm2D(lon * 2.2 + 12, lat * 2.4 - 8, 131);
  const mountain = isLand && !isIce && signed > 0.22 && ridgeNoise > 0.12;
  const highland = isLand && !isIce && (signed > 0.18 || mountain);
  const dry = isLand && !isIce && signed > 0.12 && fbm2D(lon * 1.6 - 3, lat * 1.2 + 9, 151) > 0.28;

  return {
    signed,
    polar,
    ice: isIce,
    iceFade,
    land: isLand,
    water: !isLand,
    coast: isCoast,
    shelf: isShelf,
    sea: isSea,
    mountain,
    highland,
    dry,
    detail: clamp((fbm2D(lon * 3.0, lat * 2.6, 191) + 1) / 2, 0, 1)
  };
}

function sampleTerrain(lat, lon, worldKey) {
  if (worldKey === "earth") return sampleEarth(lat, lon);
  if (worldKey === "audralia") return sampleAudralia(lat, lon);
  return sampleHEarth(lat, lon);
}

function terrainColor(terrain, world, light, rim) {
  let base;

  if (terrain.ice) {
    base = mixColor(world.ice, [255, 255, 255], terrain.iceFade * 0.24);
  } else if (terrain.water) {
    if (terrain.shelf) {
      base = mixColor(world.ocean, world.coast, 0.22);
    } else if (terrain.sea) {
      base = mixColor(world.deep, world.ocean, 0.62);
    } else {
      base = world.deep;
    }
  } else if (terrain.coast) {
    base = mixColor(world.coast, world.land, terrain.signed > 0 ? 0.28 : 0.10);
  } else if (terrain.mountain) {
    base = mixColor(world.highland, [190, 178, 142], 0.34);
  } else if (terrain.highland) {
    base = mixColor(world.land, world.highland, 0.42);
  } else if (terrain.dry) {
    base = mixColor(world.land, world.coast, 0.18);
  } else {
    base = world.land;
  }

  const texture = (terrain.detail - 0.5) * (terrain.water ? 6 : 10);
  const shade = clamp(light + rim * 0.10, 0.16, 1.16);

  const r = Math.round(clamp((base[0] + texture) * shade, 0, 255));
  const g = Math.round(clamp((base[1] + texture * 0.60) * shade, 0, 255));
  const b = Math.round(clamp((base[2] + (terrain.water ? 8 : -texture * 0.18)) * shade, 0, 255));

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

  if (avg.z < -0.03) return null;

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

  const ocean = ctx.createRadialGradient(
    view.cx - view.scale * 0.22,
    view.cy - view.scale * 0.24,
    view.scale * 0.04,
    view.cx,
    view.cy,
    view.scale * 1.08
  );

  ocean.addColorStop(0, `rgb(${world.ocean[0] + 28},${world.ocean[1] + 28},${world.ocean[2] + 32})`);
  ocean.addColorStop(0.52, `rgb(${world.ocean[0]},${world.ocean[1]},${world.ocean[2]})`);
  ocean.addColorStop(1, `rgb(${world.deep[0]},${world.deep[1]},${world.deep[2]})`);

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  const light = normalize({ x: -0.30, y: 0.52, z: 0.90 });
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
    const terrain = sampleTerrain(patch.lat, patch.lon, state.worldKey);

    if (terrain.water && !terrain.shelf && !terrain.sea && !terrain.ice) {
      continue;
    }

    const diffuse = clamp(dot(patch.normal, light), 0, 1);
    const rim = Math.pow(clamp(1 - Math.abs(patch.normal.z), 0, 1), 2.0);
    const lightValue = 0.34 + diffuse * 0.62 + rim * 0.06;

    let alpha = 0.90;

    if (terrain.water) alpha = terrain.shelf ? 0.45 : 0.25;
    if (terrain.coast) alpha = 0.62;
    if (terrain.ice) alpha = 0.76;

    pathPatch(ctx, patch.points);
    ctx.fillStyle = colorForTerrainWithAlpha(terrainColor(terrain, world, lightValue, rim), alpha);
    ctx.fill();
  }

  ctx.restore();
}

function colorForTerrainWithAlpha(rgb, alpha) {
  if (alpha >= 0.995) return rgb;

  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length < 3) return rgb;

  return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
}

function drawSubtleSurfaceLines(ctx, view) {
  const terrainWorld = state.worldKey;

  if (terrainWorld === "earth") return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const lineCount = MOBILE ? 6 : 9;

  for (let i = 0; i < lineCount; i += 1) {
    const t = i / Math.max(1, lineCount - 1);
    const lat = lerp(-0.72, 0.72, t) + Math.sin(i * 1.7) * 0.08;
    const points = [];

    for (let j = 0; j <= 50; j += 1) {
      const u = j / 50;
      const lon = -2.55 + u * 5.10;
      const waveLat = lat + Math.sin(lon * 1.65 + i) * 0.035;
      const p = makePoint(waveLat, lon);
      const r = rotateX(rotateY(p, view.yaw), view.pitch);

      if (r.z > 0.04) points.push(project(r, view));
    }

    if (points.length < 3) continue;

    ctx.strokeStyle = terrainWorld === "hEarth"
      ? "rgba(221,238,212,0.055)"
      : "rgba(255,232,180,0.050)";
    ctx.lineWidth = Math.max(0.35, DPR * 0.34);

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
  ctx.fillText(`${world.subtitle} · stable public portrait`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Select a world · Open room for deeper model", width * 0.5, height * 0.90);
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
  drawSubtleSurfaceLines(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "stable";
  document.documentElement.dataset.privateEnginesAsleep = "true";
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
      state.targetYaw += 0.0010;
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
    publicPortraitBaseline: true,
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: CELL_COUNT,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    hEarthPublicModel: H_EARTH_PUBLIC_MODEL,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: true,
        privateEnginesAsleep: true,
        parentCellCount: CELL_COUNT,
        childFieldsPerParent: CHILD_HEX_COUNT,
        totalChildFields: TOTAL_CHILD_FIELDS,
        hEarthPrivateModelPath: H_EARTH_PUBLIC_MODEL.privateModelPath,
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
  publicPortraitBaseline: true,
  privateEnginesAsleep: true,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  hEarthPublicModel: H_EARTH_PUBLIC_MODEL
};
