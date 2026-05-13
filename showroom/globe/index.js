// /showroom/globe/index.js
// Public Globe Showcase stable baseline.
// Organic landmass portrait repair.
// Role: lightweight public selector and portrait display case.
// This file renders continuous organic planetary portraits.
// It does not expose child-256 fabric, parent-cell screens, or private construction machinery.

const MODEL_NAME = "globe-showcase-public-organic-portrait-baseline-v2";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 76 : 56;

const DEFAULT_YAW = -0.62;
const DEFAULT_PITCH = -0.22;
const MIN_PITCH = -1.05;
const MAX_PITCH = 0.74;

const PARENT_256_COUNT = 256;
const CHILD_256_PER_PARENT = 256;
const TOTAL_CHILD_FIELDS = PARENT_256_COUNT * CHILD_256_PER_PARENT;

const H_EARTH_PUBLIC_MODEL = Object.freeze({
  parentCells: PARENT_256_COUNT,
  childFieldsPerParent: CHILD_256_PER_PARENT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "organic macro portrait",
  visibleChildFabric: false,
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
    ocean: [28, 98, 160],
    deep: [8, 34, 92],
    land: [62, 136, 84],
    forest: [38, 116, 72],
    highland: [134, 130, 100],
    coast: [206, 188, 122],
    ice: [190, 226, 244],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    ocean: [32, 112, 154],
    deep: [7, 34, 104],
    land: [56, 140, 84],
    forest: [34, 118, 74],
    highland: [126, 138, 106],
    coast: [214, 194, 130],
    ice: [184, 224, 242],
    glow: "rgba(143,240,195,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    ocean: [38, 106, 146],
    deep: [10, 38, 94],
    land: [142, 128, 82],
    forest: [78, 132, 84],
    highland: [174, 148, 102],
    coast: [222, 194, 128],
    ice: [186, 220, 234],
    glow: "rgba(190,170,255,0.22)"
  }
});

const state = {
  canvas: null,
  ctx: null,
  surfaceCanvas: null,
  surfaceCtx: null,
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

function fbm2D(x, y, seed = 0) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < 5; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 23) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
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

function inverseRotateViewToLocal(p, yaw, pitch) {
  const unPitch = rotateX(p, -pitch);
  return rotateY(unPitch, -yaw);
}

function mixColor(a, b, t) {
  const m = clamp(t, 0, 1);

  return [
    Math.round(lerp(a[0], b[0], m)),
    Math.round(lerp(a[1], b[1], m)),
    Math.round(lerp(a[2], b[2], m))
  ];
}

function colorToString(c, alpha = 1) {
  const r = Math.round(clamp(c[0], 0, 255));
  const g = Math.round(clamp(c[1], 0, 255));
  const b = Math.round(clamp(c[2], 0, 255));

  return alpha >= 1
    ? `rgb(${r},${g},${b})`
    : `rgba(${r},${g},${b},${alpha})`;
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

  if (!state.surfaceCanvas) {
    state.surfaceCanvas = document.createElement("canvas");
    state.surfaceCtx = state.surfaceCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });
  }

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

function applyDomainWarp(lat, lon, worldKey) {
  const seed = worldKey === "earth" ? 10 : worldKey === "audralia" ? 70 : 40;

  const warpLon =
    fbm2D(lon * 0.58 + 2.1, lat * 0.52 - 1.7, seed + 1) * 0.34 +
    fbm2D(lon * 1.12 - 5.0, lat * 0.92 + 3.2, seed + 2) * 0.13;

  const warpLat =
    fbm2D(lon * 0.48 - 1.8, lat * 0.66 + 2.4, seed + 3) * 0.20 +
    fbm2D(lon * 1.30 + 4.4, lat * 1.04 - 2.2, seed + 4) * 0.08;

  return {
    lat: clamp(lat + warpLat, -Math.PI / 2, Math.PI / 2),
    lon: lon + warpLon
  };
}

function largestMask(masks) {
  return masks.reduce((best, item) => item.score > best.score ? item : best, masks[0]);
}

function sampleEarthOrganic(lat, lon) {
  const warped = applyDomainWarp(lat, lon, "earth");
  const pLat = warped.lat;
  const pLon = warped.lon;

  const masks = [
    { name: "western-continent", score: gaussianDistance(pLat, pLon, 0.36, -1.92, 0.80, 0.76) },
    { name: "south-west-continent", score: gaussianDistance(pLat, pLon, -0.46, -1.52, 0.58, 0.56) * 0.84 },
    { name: "eastern-continent", score: gaussianDistance(pLat, pLon, 0.28, 0.54, 0.74, 0.84) },
    { name: "south-east-continent", score: gaussianDistance(pLat, pLon, -0.34, 1.06, 0.60, 0.58) * 0.76 },
    { name: "southern-ice-land", score: gaussianDistance(pLat, pLon, -1.18, 0.0, 0.22, 2.9) * 0.88 },
    { name: "island-field", score: gaussianDistance(pLat, pLon, -0.20, 2.36, 0.32, 0.36) * 0.58 }
  ];

  const land = largestMask(masks);
  const globalNoise =
    fbm2D(pLon * 0.95 + 8, pLat * 0.95 + 4, 11) * 0.100 +
    fbm2D(pLon * 2.10 - 1, pLat * 1.75 + 6, 12) * 0.040;

  return classifyOrganicTerrain({
    signed: land.score + globalNoise - 0.42,
    lat,
    lon,
    worldKey: "earth",
    landName: land.name
  });
}

function sampleHEarthOrganic(lat, lon) {
  const warped = applyDomainWarp(lat, lon, "hEarth");
  const pLat = warped.lat;
  const pLon = warped.lon;

  const westContinent =
    gaussianDistance(pLat, pLon, 0.16, -2.02, 0.78, 0.98) +
    gaussianDistance(pLat, pLon, -0.22, -1.50, 0.54, 0.66) * 0.62;

  const eastContinent =
    gaussianDistance(pLat, pLon, 0.18, 1.50, 0.80, 0.94) +
    gaussianDistance(pLat, pLon, -0.10, 2.22, 0.50, 0.64) * 0.56;

  const northernHighland =
    gaussianDistance(pLat, pLon, 0.72, -0.20, 0.48, 1.06) +
    gaussianDistance(pLat, pLon, 0.56, 0.56, 0.36, 0.60) * 0.50;

  const southernShelf =
    gaussianDistance(pLat, pLon, -0.70, 0.15, 0.48, 1.14) +
    gaussianDistance(pLat, pLon, -0.52, -0.58, 0.34, 0.60) * 0.44;

  const equatorialChain =
    gaussianDistance(pLat, pLon, 0.00, -0.62, 0.22, 0.50) * 0.78 +
    gaussianDistance(pLat, pLon, 0.08, 0.12, 0.20, 0.44) * 0.78 +
    gaussianDistance(pLat, pLon, -0.08, 0.82, 0.22, 0.46) * 0.78;

  const northCrown = gaussianDistance(pLat, pLon, 1.34, 0.0, 0.24, 3.2) * 0.66;
  const southCrown = gaussianDistance(pLat, pLon, -1.34, 0.0, 0.24, 3.2) * 0.66;

  const masks = [
    { name: "western-primary-continent", score: westContinent },
    { name: "eastern-primary-continent", score: eastContinent },
    { name: "northern-highland-continent", score: northernHighland },
    { name: "southern-shelf-continent", score: southernShelf },
    { name: "equatorial-island-chain", score: equatorialChain },
    { name: "north-polar-landmass", score: northCrown },
    { name: "south-polar-landmass", score: southCrown }
  ];

  const land = largestMask(masks);

  const longWave =
    fbm2D(pLon * 0.72 + 14, pLat * 0.78 - 3, 41) * 0.090 +
    fbm2D(pLon * 1.75 - 2, pLat * 1.45 + 5, 83) * 0.044;

  const coastlineBreak =
    Math.sin(pLon * 2.18 + Math.sin(pLat * 2.4) * 0.84) * 0.032 +
    Math.cos(pLon * 3.40 - pLat * 2.10) * 0.022;

  const centralRift =
    gaussianDistance(pLat, pLon, 0.02, 0.0, 0.34, 0.46) * 0.15;

  const westDeepOcean = smoothstep(-2.30, -3.05, pLon) * 0.17;
  const eastDeepOcean = smoothstep(2.30, 3.05, pLon) * 0.17;
  const southernOcean = smoothstep(-0.86, -1.42, pLat) * 0.11;

  const signed =
    land.score +
    longWave +
    coastlineBreak -
    centralRift -
    westDeepOcean -
    eastDeepOcean -
    southernOcean -
    0.43;

  return classifyOrganicTerrain({
    signed,
    lat,
    lon,
    worldKey: "hEarth",
    landName: land.name
  });
}

function sampleAudraliaOrganic(lat, lon) {
  const warped = applyDomainWarp(lat, lon, "audralia");
  const pLat = warped.lat;
  const pLon = warped.lon;

  const masks = [
    {
      name: "main-archipelago",
      score:
        gaussianDistance(pLat, pLon, 0.16, -0.72, 0.60, 0.94) +
        gaussianDistance(pLat, pLon, -0.22, 0.34, 0.50, 0.80) * 0.84
    },
    { name: "eastern-high-islands", score: gaussianDistance(pLat, pLon, 0.42, 1.26, 0.36, 0.52) * 0.58 },
    { name: "southern-shelf-land", score: gaussianDistance(pLat, pLon, -0.78, -0.34, 0.34, 0.96) * 0.70 },
    {
      name: "island-trail",
      score:
        gaussianDistance(pLat, pLon, 0.00, 1.72, 0.19, 0.35) +
        gaussianDistance(pLat, pLon, -0.18, 2.18, 0.18, 0.32) * 0.74 +
        gaussianDistance(pLat, pLon, 0.24, 2.58, 0.16, 0.28) * 0.56
    }
  ];

  const land = largestMask(masks);

  const noise =
    fbm2D(pLon * 0.88 + 2, pLat * 0.98 + 13, 71) * 0.105 +
    fbm2D(pLon * 2.20 - 9, pLat * 1.70 + 4, 91) * 0.044;

  const signed = land.score + noise - 0.48;

  return classifyOrganicTerrain({
    signed,
    lat,
    lon,
    worldKey: "audralia",
    landName: land.name
  });
}

function classifyOrganicTerrain({ signed, lat, lon, worldKey, landName }) {
  const polar = Math.abs(lat) / (Math.PI / 2);
  const iceThreshold = worldKey === "audralia" ? 0.93 : 0.89;
  const iceFade = smoothstep(iceThreshold - 0.055, iceThreshold + 0.030, polar);
  const isIce = iceFade > 0.40;

  const coastPressure = 1 - clamp(Math.abs(signed) / 0.105, 0, 1);
  const isLand = signed > 0 || isIce;
  const isCoast = !isIce && coastPressure > 0.50;
  const isBeach = !isIce && coastPressure > 0.72 && signed > -0.035 && signed < 0.070;
  const isShelf = !isLand && signed > -0.18;
  const isSea = !isLand && signed > -0.34;

  const ridgeField =
    fbm2D(lon * 2.4 + 12, lat * 2.6 - 8, 131) * 0.65 +
    Math.sin(lon * 3.2 + lat * 1.4) * 0.22;

  const moisture =
    fbm2D(lon * 1.35 - 3, lat * 1.18 + 9, 151) * 0.5 +
    fbm2D(lon * 2.6 + 5, lat * 2.1 - 4, 152) * 0.25;

  const mountain = isLand && !isIce && signed > 0.22 && ridgeField > 0.12;
  const highland = isLand && !isIce && (signed > 0.16 || mountain);
  const dry = isLand && !isIce && signed > 0.08 && moisture < -0.10;
  const forest = isLand && !isIce && !dry && moisture > -0.08;

  return {
    signed,
    polar,
    ice: isIce,
    iceFade,
    land: isLand,
    water: !isLand,
    coast: isCoast,
    beach: isBeach,
    shelf: isShelf,
    sea: isSea,
    mountain,
    highland,
    dry,
    forest,
    landName,
    detail: clamp((fbm2D(lon * 4.0, lat * 3.2, 191) + 1) / 2, 0, 1),
    moisture: clamp((moisture + 1) / 2, 0, 1)
  };
}

function sampleTerrain(lat, lon, worldKey) {
  if (worldKey === "earth") return sampleEarthOrganic(lat, lon);
  if (worldKey === "audralia") return sampleAudraliaOrganic(lat, lon);
  return sampleHEarthOrganic(lat, lon);
}

function terrainColor(terrain, world, light, rim) {
  let base;

  if (terrain.ice) {
    base = mixColor(world.ice, [255, 255, 255], terrain.iceFade * 0.26);
  } else if (terrain.water) {
    if (terrain.shelf) {
      base = mixColor(world.ocean, world.coast, 0.18);
    } else if (terrain.sea) {
      base = mixColor(world.deep, world.ocean, 0.62);
    } else {
      base = world.deep;
    }
  } else if (terrain.beach) {
    base = mixColor(world.coast, world.land, 0.14);
  } else if (terrain.coast) {
    base = mixColor(world.coast, world.land, 0.34);
  } else if (terrain.mountain) {
    base = mixColor(world.highland, [198, 186, 148], 0.30);
  } else if (terrain.highland) {
    base = mixColor(world.land, world.highland, 0.42);
  } else if (terrain.dry) {
    base = mixColor(world.land, world.coast, 0.22);
  } else if (terrain.forest) {
    base = mixColor(world.land, world.forest, 0.42);
  } else {
    base = world.land;
  }

  const texture = (terrain.detail - 0.5) * (terrain.water ? 4 : 8);
  const shade = clamp(light + rim * 0.10, 0.15, 1.17);

  return [
    clamp((base[0] + texture) * shade, 0, 255),
    clamp((base[1] + texture * 0.55) * shade, 0, 255),
    clamp((base[2] + (terrain.water ? 8 : -texture * 0.16)) * shade, 0, 255)
  ];
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

function drawOrganicSphereTexture(view) {
  const res = MOBILE
    ? clamp(Math.round(view.scale * 1.42), 300, 440)
    : clamp(Math.round(view.scale * 1.64), 420, 640);

  const size = Math.round(res);
  const canvas = state.surfaceCanvas;
  const ctx = state.surfaceCtx;

  if (canvas.width !== size || canvas.height !== size) {
    canvas.width = size;
    canvas.height = size;
  }

  const image = ctx.createImageData(size, size);
  const data = image.data;
  const world = WORLDS[state.worldKey];

  const light = normalize({ x: -0.34, y: 0.54, z: 0.82 });
  const half = size * 0.5;
  const radius = size * 0.485;
  const radiusSq = radius * radius;

  for (let y = 0; y < size; y += 1) {
    const py = (half - y) / radius;

    for (let x = 0; x < size; x += 1) {
      const px = (x - half) / radius;
      const dSq = px * px + py * py;
      const index = (y * size + x) * 4;

      if (dSq > 1) {
        data[index + 3] = 0;
        continue;
      }

      const pz = Math.sqrt(1 - dSq);
      const viewNormal = normalize({ x: px, y: py, z: pz });
      const local = inverseRotateViewToLocal(viewNormal, view.yaw, view.pitch);

      const lat = Math.asin(clamp(local.y, -1, 1));
      const lon = Math.atan2(local.z, local.x);
      const terrain = sampleTerrain(lat, lon, state.worldKey);

      const diffuse = clamp(dot(viewNormal, light), 0, 1);
      const rim = Math.pow(clamp(1 - pz, 0, 1), 2.25);
      const shade = 0.31 + diffuse * 0.68 + rim * 0.08;

      let color = terrainColor(terrain, world, shade, rim);

      const atmosphereSoften = smoothstep(0.78, 1.00, Math.sqrt(dSq));
      const edgeBlue = terrain.water ? [92, 172, 210] : [140, 196, 190];
      color = mixColor(color, edgeBlue, atmosphereSoften * 0.12);

      const night = smoothstep(0.12, -0.08, diffuse);
      color = mixColor(color, [3, 10, 28], night * 0.54);

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
}

function drawSphereBase(ctx, view) {
  const world = WORLDS[state.worldKey];

  const ocean = ctx.createRadialGradient(
    view.cx - view.scale * 0.22,
    view.cy - view.scale * 0.24,
    view.scale * 0.04,
    view.cx,
    view.cy,
    view.scale * 1.08
  );

  ocean.addColorStop(0, colorToString(mixColor(world.ocean, [255, 255, 255], 0.16)));
  ocean.addColorStop(0.52, colorToString(world.ocean));
  ocean.addColorStop(1, colorToString(world.deep));

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrganicSurface(ctx, view) {
  drawOrganicSphereTexture(view);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    state.surfaceCanvas,
    view.cx - view.scale,
    view.cy - view.scale,
    view.scale * 2,
    view.scale * 2
  );

  ctx.restore();
}

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(view.cx, view.cy, view.scale * 0.72, view.cx, view.cy, view.scale * 1.13);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.68, "rgba(142,190,255,0.10)");
  outer.addColorStop(1, world.glow);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(210,240,255,0.23)";
  ctx.lineWidth = Math.max(1, DPR * 1.08);
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
  ctx.fillText(`${world.subtitle} · organic public portrait`, width * 0.5, height * 0.205);

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
  drawOrganicSurface(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "organic";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.visibleChildFabric = "false";
  document.documentElement.dataset.parentCellCount = String(PARENT_256_COUNT);
  document.documentElement.dataset.childFieldsPerParent = String(CHILD_256_PER_PARENT);
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
    organicPortrait: true,
    visibleChildFabric: false,
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: PARENT_256_COUNT,
    childFieldsPerParent: CHILD_256_PER_PARENT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    hEarthPublicModel: H_EARTH_PUBLIC_MODEL,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: true,
        organicPortrait: true,
        visibleChildFabric: false,
        privateEnginesAsleep: true,
        parentCellCount: PARENT_256_COUNT,
        childFieldsPerParent: CHILD_256_PER_PARENT,
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
  organicPortrait: true,
  visibleChildFabric: false,
  privateEnginesAsleep: true,
  parentCellCount: PARENT_256_COUNT,
  childFieldsPerParent: CHILD_256_PER_PARENT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  hEarthPublicModel: H_EARTH_PUBLIC_MODEL
};
