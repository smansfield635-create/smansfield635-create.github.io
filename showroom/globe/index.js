// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_ROTATION_INVARIANT_PLANET_MATERIAL_TNT_v1
// Contract renewal: no privileged longitude, no false prime meridian, no hemisphere partition.
// Role: public Globe Showcase selector only.
// Visual law: continuous dry cinematic planet body.
// Forbidden here: water fill, blue oceans, coastlines, school-globe axis, map fabric, blocks, child imports, private engines, mountain system.

const MODEL_NAME = "showroom-globe-rotation-invariant-planet-material-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.35 : 1.75);
const FRAME_MS = MOBILE ? 118 : 88;

const DEFAULT_YAW = -0.74;
const DEFAULT_PITCH = -0.2;
const MIN_PITCH = -1.04;
const MAX_PITCH = 0.74;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;
const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const RASTER_LIMIT = MOBILE ? 340 : 520;

const SUBLEVEL_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "rotation-invariant cinematic dry planet material",
  privateEnginesAsleep: true,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  planetShader: true,
  continuousSurface: true,
  materialRelief: true,
  pseudoNormalLighting: true,
  privilegedLongitude: false,
  falsePrimeMeridian: false,
  hemispherePartition: false,
  polygonPatchSurface: false,
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
    stoneDeep: [24, 25, 27],
    stoneLow: [68, 61, 52],
    stoneMid: [125, 109, 82],
    stoneHigh: [190, 164, 114],
    sediment: [168, 143, 100],
    exposed: [226, 188, 122],
    ridge: [238, 218, 174],
    shadow: [13, 15, 18],
    scar: [210, 214, 196],
    atmosphere: [145, 195, 255],
    glow: "rgba(145,195,255,0.24)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    seed: 710,
    stoneDeep: [18, 25, 25],
    stoneLow: [56, 68, 56],
    stoneMid: [112, 118, 86],
    stoneHigh: [186, 160, 103],
    sediment: [150, 138, 94],
    exposed: [220, 178, 106],
    ridge: [236, 219, 162],
    shadow: [10, 15, 17],
    scar: [164, 234, 190],
    atmosphere: [150, 215, 232],
    glow: "rgba(145,215,232,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    seed: 910,
    stoneDeep: [28, 23, 42],
    stoneLow: [72, 58, 72],
    stoneMid: [135, 105, 88],
    stoneHigh: [194, 148, 94],
    sediment: [164, 119, 88],
    exposed: [230, 164, 108],
    ridge: [238, 206, 156],
    shadow: [15, 12, 26],
    scar: [198, 172, 255],
    atmosphere: [194, 178, 255],
    glow: "rgba(194,178,255,0.24)"
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

  surfaceCanvas: null,
  surfaceCtx: null,
  surfaceSize: 0,
  surfaceImage: null,

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

function hash1(a, b = 0, c = 0, d = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + d * 19.19) * 43758.5453123);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise3D(x, y, z, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);

  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const n000 = hash1(xi, yi, zi, seed);
  const n100 = hash1(xi + 1, yi, zi, seed);
  const n010 = hash1(xi, yi + 1, zi, seed);
  const n110 = hash1(xi + 1, yi + 1, zi, seed);
  const n001 = hash1(xi, yi, zi + 1, seed);
  const n101 = hash1(xi + 1, yi, zi + 1, seed);
  const n011 = hash1(xi, yi + 1, zi + 1, seed);
  const n111 = hash1(xi + 1, yi + 1, zi + 1, seed);

  const x00 = lerp(n000, n100, u);
  const x10 = lerp(n010, n110, u);
  const x01 = lerp(n001, n101, u);
  const x11 = lerp(n011, n111, u);

  const y0 = lerp(x00, x10, v);
  const y1 = lerp(x01, x11, v);

  return lerp(y0, y1, w) * 2 - 1;
}

function fbm3D(x, y, z, seed = 0, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + octave * 37) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge3D(x, y, z, seed = 0, octaves = 4) {
  return 1 - Math.abs(fbm3D(x, y, z, seed, octaves));
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
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

function inverseSpherePointFromView(viewPoint, yaw, pitch) {
  return rotateY(rotateX(viewPoint, -pitch), -yaw);
}

function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    Math.round(lerp(a[0], b[0], k)),
    Math.round(lerp(a[1], b[1], k)),
    Math.round(lerp(a[2], b[2], k))
  ];
}

function colorWithAlpha(color, alpha) {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

function seededVector(seed, slot) {
  return normalize({
    x: Math.sin(seed * 0.017 + slot * 1.931),
    y: Math.sin(seed * 0.023 + slot * 2.713),
    z: Math.cos(seed * 0.019 + slot * 3.117)
  });
}

function basisFromNormal(normal) {
  const n = normalize(normal);
  const helper = Math.abs(n.y) > 0.86 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const a = normalize(cross(helper, n));
  const b = normalize(cross(n, a));
  return { n, a, b };
}

function sphericalCap(p, center, radius, softness) {
  const d = dot(p, normalize(center));
  const inner = Math.cos(radius);
  const outer = Math.cos(radius + softness);
  return smoothstep(outer, inner, d);
}

function objectBand(p, planeNormal, gateCenter, radius, width, phase) {
  const basis = basisFromNormal(planeNormal);
  const u = dot(p, basis.a);
  const v = dot(p, basis.b);
  const w = dot(p, basis.n);

  const bend =
    Math.sin(u * 3.1 + phase) * 0.045 +
    Math.sin(v * 4.4 - phase) * 0.024 +
    Math.sin((u - v) * 6.0 + phase * 0.7) * 0.010;

  const across = Math.abs(w + bend);
  const line = 1 - smoothstep(width, width * 2.35, across);
  const gate = sphericalCap(p, gateCenter, radius, 0.28);

  return clamp(line * gate, 0, 1);
}

function objectScar(p, planeNormal, gateCenter, radius, width, phase) {
  const basis = basisFromNormal(planeNormal);
  const u = dot(p, basis.a);
  const v = dot(p, basis.b);
  const w = dot(p, basis.n);

  const broken =
    Math.sin(u * 7.0 + phase) * 0.015 +
    Math.sin(v * 8.2 - phase) * 0.012;

  const across = Math.abs(w + broken);
  const line = 1 - smoothstep(width, width * 2.15, across);
  const gate = sphericalCap(p, gateCenter, radius, 0.16);

  return clamp(line * gate, 0, 1);
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

  createStars(MOBILE ? 56 : 126);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash1(index, 1),
    y: hash1(index, 2),
    r: 0.45 + hash1(index, 3) * 1.85,
    a: 0.10 + hash1(index, 4) * 0.34,
    p: hash1(index, 5) * Math.PI * 2
  }));
}

function sampleObjectBasins(p, world) {
  const seed = world.seed;

  let basin = 0;
  for (let i = 0; i < 6; i += 1) {
    const center = seededVector(seed + 30, i);
    const radius = 0.48 + hash1(seed, i, 11) * 0.30;
    const softness = 0.18 + hash1(seed, i, 12) * 0.15;
    const weight = 0.52 + hash1(seed, i, 13) * 0.42;
    basin = Math.max(basin, sphericalCap(p, center, radius, softness) * weight);
  }

  const floorTexture =
    fbm3D(p.x * 2.2 + 1.5, p.y * 2.0 - 2.4, p.z * 2.1 + 0.8, seed + 101, 4) * 0.10 +
    ridge3D(p.x * 3.7 - 2.1, p.y * 3.4 + 1.4, p.z * 3.2 + 5.2, seed + 102, 3) * 0.06;

  return clamp(basin + floorTexture, 0, 1);
}

function sampleObjectRidges(p, world) {
  const seed = world.seed;

  let ridge = 0;
  for (let i = 0; i < 5; i += 1) {
    const normal = seededVector(seed + 110, i);
    const gate = seededVector(seed + 130, i);
    const radius = 0.88 + hash1(seed, i, 21) * 0.48;
    const width = 0.070 + hash1(seed, i, 22) * 0.035;
    const phase = hash1(seed, i, 23) * Math.PI * 2;
    ridge = Math.max(ridge, objectBand(p, normal, gate, radius, width, phase));
  }

  const folded =
    ridge3D(p.x * 1.7 + 4.2, p.y * 1.55 - 7.2, p.z * 1.62 + 2.4, seed + 121, 4) * 0.23 +
    ridge3D(p.x * 3.0 - 8.1, p.y * 2.8 + 3.8, p.z * 2.9 - 1.7, seed + 122, 4) * 0.12;

  return clamp(ridge * 0.48 + folded, 0, 1);
}

function sampleObjectCanyons(p, world) {
  const seed = world.seed;

  let canyon = 0;
  for (let i = 0; i < 6; i += 1) {
    const normal = seededVector(seed + 210, i);
    const gate = seededVector(seed + 230, i);
    const radius = 0.74 + hash1(seed, i, 31) * 0.55;
    const width = 0.025 + hash1(seed, i, 32) * 0.016;
    const phase = hash1(seed, i, 33) * Math.PI * 2;
    canyon = Math.max(canyon, objectBand(p, normal, gate, radius, width, phase));
  }

  const serration =
    ridge3D(p.x * 6.4 - 1.4, p.y * 5.8 + 2.8, p.z * 5.9 + 3.7, seed + 201, 4) * 0.18;

  return clamp(canyon * 0.90 + serration * 0.10, 0, 1);
}

function sampleObjectChannels(p, world) {
  const seed = world.seed;

  let channel = 0;
  for (let i = 0; i < 7; i += 1) {
    const normal = seededVector(seed + 310, i);
    const gate = seededVector(seed + 330, i);
    const radius = 0.62 + hash1(seed, i, 41) * 0.52;
    const width = 0.014 + hash1(seed, i, 42) * 0.012;
    const phase = hash1(seed, i, 43) * Math.PI * 2;
    channel = Math.max(channel, objectBand(p, normal, gate, radius, width, phase));
  }

  const braided =
    ridge3D(p.x * 7.5 + 0.7, p.y * 6.7 - 2.1, p.z * 7.1 + 1.9, seed + 301, 3) * 0.12;

  return clamp(channel + braided * 0.14, 0, 1);
}

function sampleObjectCliffs(p, world) {
  const seed = world.seed;

  let cliff = 0;
  for (let i = 0; i < 5; i += 1) {
    const normal = seededVector(seed + 410, i);
    const gate = seededVector(seed + 430, i);
    const radius = 0.78 + hash1(seed, i, 51) * 0.50;
    const width = 0.036 + hash1(seed, i, 52) * 0.020;
    const phase = hash1(seed, i, 53) * Math.PI * 2;
    cliff = Math.max(cliff, objectBand(p, normal, gate, radius, width, phase));
  }

  const broken =
    ridge3D(p.x * 4.0 + 4.0, p.y * 3.5 - 2.0, p.z * 3.7 + 1.7, seed + 401, 4);

  return clamp(cliff * (0.54 + broken * 0.46), 0, 1);
}

function sampleObjectCaverns(p, world) {
  const seed = world.seed;

  let cavern = 0;
  for (let i = 0; i < 7; i += 1) {
    const center = seededVector(seed + 510, i);
    const radius = 0.075 + hash1(seed, i, 61) * 0.055;
    const softness = 0.055 + hash1(seed, i, 62) * 0.040;
    cavern = Math.max(cavern, sphericalCap(p, center, radius, softness));
  }

  const porous = fbm3D(p.x * 6.4 + 8.0, p.y * 5.9 - 3.0, p.z * 6.1 + 1.2, seed + 501, 4);
  return clamp(cavern * (porous > 0.02 ? 1 : 0.40), 0, 1);
}

function sampleObjectScars(p, world) {
  const seed = world.seed;

  let scar = 0;
  for (let i = 0; i < 7; i += 1) {
    const normal = seededVector(seed + 610, i);
    const gate = seededVector(seed + 630, i);
    const radius = 0.56 + hash1(seed, i, 71) * 0.48;
    const width = 0.009 + hash1(seed, i, 72) * 0.006;
    const phase = hash1(seed, i, 73) * Math.PI * 2;
    scar = Math.max(scar, objectScar(p, normal, gate, radius, width, phase));
  }

  const fractureGate =
    fbm3D(p.x * 7.6 - 2.0, p.y * 6.8 + 4.0, p.z * 7.1 + 0.4, seed + 601, 4);

  return clamp(scar * (fractureGate > -0.30 ? 1 : 0.30), 0, 1);
}

function samplePlanetMaterialFromPoint(point, world) {
  const p = normalize(point);
  const seed = world.seed;

  const warp = normalize({
    x: p.x + fbm3D(p.x * 1.1, p.y * 1.1, p.z * 1.1, seed + 11, 3) * 0.10,
    y: p.y + fbm3D(p.x * 1.1 + 4.0, p.y * 1.1 - 2.0, p.z * 1.1, seed + 12, 3) * 0.10,
    z: p.z + fbm3D(p.x * 1.1 - 1.0, p.y * 1.1 + 5.0, p.z * 1.1 + 3.0, seed + 13, 3) * 0.10
  });

  const macro = fbm3D(warp.x * 1.22, warp.y * 1.22, warp.z * 1.22, seed + 20, 5);
  const plate = ridge3D(warp.x * 1.85, warp.y * 1.85, warp.z * 1.85, seed + 21, 5);
  const folded = ridge3D(warp.x * 4.4, warp.y * 4.2, warp.z * 4.3, seed + 22, 4);
  const fine = fbm3D(warp.x * 13.0, warp.y * 12.5, warp.z * 12.8, seed + 23, 4);

  const basins = sampleObjectBasins(warp, world);
  const ridges = sampleObjectRidges(warp, world);
  const canyons = sampleObjectCanyons(warp, world);
  const channels = sampleObjectChannels(warp, world);
  const cliffs = sampleObjectCliffs(warp, world);
  const caverns = sampleObjectCaverns(warp, world);
  const scars = sampleObjectScars(warp, world);

  const height =
    macro * 0.30 +
    plate * 0.22 +
    folded * 0.12 +
    ridges * 0.30 +
    cliffs * 0.12 +
    scars * 0.035 -
    basins * 0.34 -
    canyons * 0.34 -
    channels * 0.18 -
    caverns * 0.26 +
    fine * 0.030;

  return {
    height,
    relief: clamp((height + 0.64) / 1.26, 0, 1),
    macro,
    plate,
    folded,
    fine: clamp((fine + 1) * 0.5, 0, 1),
    basins,
    ridges,
    canyons,
    channels,
    cliffs,
    caverns,
    scars
  };
}

function samplePlanetHeightFromPoint(p, world) {
  return samplePlanetMaterialFromPoint(p, world).height;
}

function tangentVectorsFromPoint(p) {
  const up = Math.abs(p.y) > 0.92 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const east = normalize(cross(up, p));
  const north = normalize(cross(p, east));
  return { east, north };
}

function offsetPointOnSphere(p, tangent, amount) {
  return normalize({
    x: p.x + tangent.x * amount,
    y: p.y + tangent.y * amount,
    z: p.z + tangent.z * amount
  });
}

function samplePlanetNormalFromPoint(p, world) {
  const eps = 0.010;
  const tangents = tangentVectorsFromPoint(p);

  const hE = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.east, eps), world);
  const hW = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.east, -eps), world);
  const hN = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.north, eps), world);
  const hS = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.north, -eps), world);

  const dE = (hE - hW) / (eps * 2);
  const dN = (hN - hS) / (eps * 2);
  const strength = 0.44;

  return normalize({
    x: p.x - tangents.east.x * dE * strength - tangents.north.x * dN * strength,
    y: p.y - tangents.east.y * dE * strength - tangents.north.y * dN * strength,
    z: p.z - tangents.east.z * dE * strength - tangents.north.z * dN * strength
  });
}

function materialBaseColor(material, world) {
  let base = mixColor(world.stoneLow, world.stoneMid, 0.30 + material.relief * 0.48);

  if (material.basins > 0.18) {
    base = mixColor(base, world.stoneDeep, material.basins * 0.50);
    base = mixColor(base, world.sediment, clamp((material.basins - 0.36) * 0.26, 0, 0.16));
  }

  if (material.caverns > 0.25) {
    base = mixColor(base, world.shadow, material.caverns * 0.58);
  }

  if (material.channels > 0.32) {
    base = mixColor(base, world.shadow, material.channels * 0.28);
    base = mixColor(base, world.exposed, clamp((material.channels - 0.40) * 0.20, 0, 0.12));
  }

  if (material.canyons > 0.30) {
    base = mixColor(base, world.shadow, material.canyons * 0.42);
    base = mixColor(base, world.exposed, clamp((material.canyons - 0.35) * 0.34, 0, 0.20));
  }

  if (material.cliffs > 0.24) {
    base = mixColor(base, world.exposed, clamp(material.cliffs * 0.50, 0, 0.42));
  }

  if (material.ridges > 0.50 || material.relief > 0.72) {
    base = mixColor(base, world.stoneHigh, clamp(Math.max(material.ridges - 0.46, material.relief - 0.68) * 0.88, 0, 0.56));
  }

  if (material.ridges > 0.72) {
    base = mixColor(base, world.ridge, clamp((material.ridges - 0.68) * 0.78, 0, 0.34));
  }

  if (material.scars > 0.62) {
    base = mixColor(base, world.scar, clamp((material.scars - 0.60) * 0.42, 0, 0.16));
  }

  const grain = (material.fine - 0.5) * 14.0 + (material.folded - 0.5) * 6.0;

  return [
    clamp(base[0] + grain, 0, 255),
    clamp(base[1] + grain * 0.80, 0, 255),
    clamp(base[2] + grain * 0.54, 0, 255)
  ];
}

function shadePlanetPixel({ viewNormal, material, bumpViewNormal, world, lightView }) {
  const sphereDiffuse = clamp(dot(viewNormal, lightView), 0, 1);
  const terrainDiffuse = clamp(dot(bumpViewNormal, lightView), 0, 1);
  const z = clamp(viewNormal.z, 0, 1);

  const rim = Math.pow(clamp(1 - z, 0, 1), 1.75);
  const terminator = smoothstep(-0.06, 0.72, sphereDiffuse);

  const occlusion =
    material.basins * 0.18 +
    material.canyons * 0.22 +
    material.channels * 0.12 +
    material.caverns * 0.26;

  const reliefFlash =
    material.cliffs * 0.12 +
    material.ridges * 0.08 +
    material.scars * 0.025;

  const lowSunWarmth = smoothstep(0.18, 0.72, terrainDiffuse) * 0.08;
  const base = materialBaseColor(material, world);

  const ambient = 0.12;
  const direct = terrainDiffuse * 0.94;
  const terminatorShade = lerp(0.18, 1.0, terminator);
  const materialShade = clamp(ambient + direct + reliefFlash + lowSunWarmth - occlusion, 0.07, 1.25);
  const shade = materialShade * terminatorShade;

  const sunWash = clamp((terrainDiffuse - 0.72) * 0.38, 0, 0.20);
  const rimLift = rim * 0.10;

  const color = [
    clamp(base[0] * shade + world.ridge[0] * sunWash + world.atmosphere[0] * rimLift, 0, 255),
    clamp(base[1] * shade + world.ridge[1] * sunWash + world.atmosphere[1] * rimLift, 0, 255),
    clamp(base[2] * shade + world.ridge[2] * sunWash + world.atmosphere[2] * rimLift, 0, 255)
  ];

  const nightside = 1 - terminator;
  color[0] = clamp(color[0] - nightside * 12, 0, 255);
  color[1] = clamp(color[1] - nightside * 16, 0, 255);
  color[2] = clamp(color[2] - nightside * 18, 0, 255);

  const leftSunBias = smoothstep(-0.95, 0.15, -viewNormal.x) * smoothstep(-0.50, 0.80, viewNormal.y);
  color[0] = clamp(color[0] + leftSunBias * 10, 0, 255);
  color[1] = clamp(color[1] + leftSunBias * 8, 0, 255);
  color[2] = clamp(color[2] + leftSunBias * 3, 0, 255);

  return color;
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

  bg.addColorStop(0, "#122443");
  bg.addColorStop(0.30, "#081732");
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
    width * 0.42
  );

  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.36, height * 0.33, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.20,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.50)");

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
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.72);

  glow.addColorStop(0, world.glow);
  glow.addColorStop(0.38, "rgba(80,120,180,0.12)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.64, view.scale * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function ensureSurfaceBuffer(view) {
  const desired = Math.max(260, Math.min(RASTER_LIMIT, Math.round(view.scale * 2.05)));

  if (!state.surfaceCanvas) {
    state.surfaceCanvas = document.createElement("canvas");
    state.surfaceCtx = state.surfaceCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });
  }

  if (state.surfaceSize !== desired) {
    state.surfaceSize = desired;
    state.surfaceCanvas.width = desired;
    state.surfaceCanvas.height = desired;
    state.surfaceImage = state.surfaceCtx.createImageData(desired, desired);
  }
}

function drawRotationInvariantPlanetSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  ensureSurfaceBuffer(view);

  const size = state.surfaceSize;
  const image = state.surfaceImage;
  const data = image.data;

  const lightView = normalize({ x: -0.58, y: 0.50, z: 0.76 });

  let ptr = 0;

  for (let py = 0; py < size; py += 1) {
    const ny = 1 - (py / (size - 1)) * 2;

    for (let px = 0; px < size; px += 1) {
      const nx = (px / (size - 1)) * 2 - 1;
      const r2 = nx * nx + ny * ny;

      if (r2 > 1) {
        data[ptr] = 0;
        data[ptr + 1] = 0;
        data[ptr + 2] = 0;
        data[ptr + 3] = 0;
        ptr += 4;
        continue;
      }

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const viewNormal = normalize({ x: nx, y: ny, z });
      const worldPoint = inverseSpherePointFromView(viewNormal, view.yaw, view.pitch);

      const material = samplePlanetMaterialFromPoint(worldPoint, world);
      const bumpWorldNormal = samplePlanetNormalFromPoint(worldPoint, world);
      const bumpViewNormal = normalize(rotateX(rotateY(bumpWorldNormal, view.yaw), view.pitch));

      const color = shadePlanetPixel({
        viewNormal,
        material,
        bumpViewNormal,
        world,
        lightView
      });

      const edgeAlpha = 1 - smoothstep(0.972, 1.0, Math.sqrt(r2));
      const alpha = Math.round(255 * clamp(edgeAlpha, 0, 1));

      data[ptr] = Math.round(color[0]);
      data[ptr + 1] = Math.round(color[1]);
      data[ptr + 2] = Math.round(color[2]);
      data[ptr + 3] = alpha;
      ptr += 4;
    }
  }

  state.surfaceCtx.putImageData(image, 0, 0);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
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
  const a = world.atmosphere;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(
    view.cx,
    view.cy,
    view.scale * 0.76,
    view.cx,
    view.cy,
    view.scale * 1.20
  );

  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.66, `rgba(${a[0]},${a[1]},${a[2]},0.075)`);
  outer.addColorStop(0.92, `rgba(${a[0]},${a[1]},${a[2]},0.25)`);
  outer.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.05)`);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.16, 0, Math.PI * 2);
  ctx.fill();

  const limb = ctx.createRadialGradient(
    view.cx - view.scale * 0.16,
    view.cy - view.scale * 0.18,
    view.scale * 0.44,
    view.cx,
    view.cy,
    view.scale * 1.04
  );

  limb.addColorStop(0, "rgba(255,255,255,0)");
  limb.addColorStop(0.72, "rgba(255,255,255,0)");
  limb.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.30)`);

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.012, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(${a[0]},${a[1]},${a[2]},0.34)`;
  ctx.lineWidth = Math.max(1, DPR * 1.15);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.008, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.060)";
  ctx.lineWidth = Math.max(0.60, DPR * 0.65);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.044)";
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
  ctx.fillText(world.title, width * 0.5, height * 0.155);

  ctx.fillStyle = "rgba(186,197,212,0.74)";
  ctx.font = `850 ${Math.max(11 * DPR, width * 0.014)}px Inter, system-ui, sans-serif`;
  ctx.fillText(`${world.subtitle} · rotation-invariant planet material`, width * 0.5, height * 0.195);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · No prime meridian · Open private world room", width * 0.5, height * 0.90);
  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.395, height * 0.415);

  const view = {
    cx: width * 0.50,
    cy: height * 0.505,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawGlobeShadow(ctx, view);
  drawRotationInvariantPlanetSurface(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "rotation-invariant-planet-material";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.mapExpression = "false";
  document.documentElement.dataset.waterExpression = "false";
  document.documentElement.dataset.landmassExpression = "false";
  document.documentElement.dataset.childTerrainImport = "false";
  document.documentElement.dataset.mountainSystem = "false";
  document.documentElement.dataset.planetShader = "true";
  document.documentElement.dataset.materialRelief = "true";
  document.documentElement.dataset.pseudoNormalLighting = "true";
  document.documentElement.dataset.continuousSurface = "true";
  document.documentElement.dataset.privilegedLongitude = "false";
  document.documentElement.dataset.falsePrimeMeridian = "false";
  document.documentElement.dataset.hemispherePartition = "false";
  document.documentElement.dataset.polygonPatchSurface = "false";
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
      state.targetYaw += 0.00072;
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
      state.surfaceSize = 0;
      state.surfaceImage = null;
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
    publicPortraitBaseline: "rotation-invariant-planet-material",
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    mapExpression: false,
    waterExpression: false,
    landmassExpression: false,
    childTerrainImport: false,
    mountainSystem: false,
    planetShader: true,
    continuousSurface: true,
    materialRelief: true,
    pseudoNormalLighting: true,
    privilegedLongitude: false,
    falsePrimeMeridian: false,
    hemispherePartition: false,
    polygonPatchSurface: false,
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
        publicPortraitBaseline: "rotation-invariant-planet-material",
        privateEnginesAsleep: true,
        generatedImage: false,
        graphicBox: false,
        mapExpression: false,
        waterExpression: false,
        landmassExpression: false,
        childTerrainImport: false,
        mountainSystem: false,
        planetShader: true,
        continuousSurface: true,
        materialRelief: true,
        pseudoNormalLighting: true,
        privilegedLongitude: false,
        falsePrimeMeridian: false,
        hemispherePartition: false,
        polygonPatchSurface: false,
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
  publicPortraitBaseline: "rotation-invariant-planet-material",
  privateEnginesAsleep: true,
  generatedImage: false,
  graphicBox: false,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  planetShader: true,
  continuousSurface: true,
  materialRelief: true,
  pseudoNormalLighting: true,
  privilegedLongitude: false,
  falsePrimeMeridian: false,
  hemispherePartition: false,
  polygonPatchSurface: false,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  sublevelModel: SUBLEVEL_MODEL
};
