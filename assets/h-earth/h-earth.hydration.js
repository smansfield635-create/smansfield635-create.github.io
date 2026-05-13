const HYDRATION_CONTRACT = "H_EARTH_SPHERE_PROJECTION_AND_HYDRATION_CLIP_RENEWAL_TNT_v1";

const FIBONACCI_RUNTIME_SEQUENCE = Object.freeze([
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610
]);

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

const FIELD_DIRECTIONS = Object.freeze(makeDirections(16));

function makeDirections(count) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const z = 1 - (2 * (i + 0.5)) / count;
    const radius = Math.sqrt(Math.max(0, 1 - z * z));
    const theta = TAU * ((i / PHI) % 1);
    out.push(Object.freeze([Math.cos(theta) * radius, Math.sin(theta) * radius, z]));
  }
  return out;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mixRgb(a, b, t) {
  return [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t)
  ];
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize3(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function unitVectorFromUv(u, v) {
  const lon = (u - 0.5) * TAU;
  const lat = (0.5 - v) * Math.PI;
  const cosLat = Math.cos(lat);
  return [Math.cos(lon) * cosLat, Math.sin(lat), Math.sin(lon) * cosLat];
}

function waveField(vector, octaveOffset, phase) {
  let sum = 0;
  let amp = 1;
  let norm = 0;

  for (let i = 0; i < 8; i += 1) {
    const dir = FIELD_DIRECTIONS[(i + octaveOffset) % FIELD_DIRECTIONS.length];
    const fib = FIBONACCI_RUNTIME_SEQUENCE[i + 3];
    const freq = fib / FIBONACCI_RUNTIME_SEQUENCE[3 + octaveOffset % 4];
    const warped = dot3(vector, dir) + 0.18 * Math.sin(dot3(vector, FIELD_DIRECTIONS[(i + 5) % FIELD_DIRECTIONS.length]) * TAU);
    sum += Math.sin((warped * freq + phase + i * 0.137) * TAU) * amp;
    norm += amp;
    amp *= 0.54;
  }

  return sum / Math.max(norm, 0.0001);
}

function ridgeField(vector, phase) {
  const a = Math.abs(waveField(vector, 4, phase));
  const b = Math.abs(waveField([vector[1], vector[2], vector[0]], 6, phase + 0.217));
  return 1 - clamp(a * 0.68 + b * 0.42, 0, 1);
}

function resolveWorldProfile(world) {
  const key = String(world || "h-earth").toLowerCase();

  if (key.includes("earth") && !key.includes("h-")) {
    return Object.freeze({
      key: "earth",
      waterline: 0.07,
      deep: [9, 34, 59],
      mid: [22, 72, 101],
      shallow: [72, 134, 142],
      landLow: [82, 103, 73],
      landMid: [130, 118, 82],
      landHigh: [191, 176, 132],
      ice: [213, 224, 218],
      atmosphere: [96, 150, 179]
    });
  }

  return Object.freeze({
    key: "h-earth",
    waterline: 0.035,
    deep: [8, 31, 55],
    mid: [18, 68, 96],
    shallow: [73, 137, 148],
    landLow: [52, 86, 78],
    landMid: [117, 112, 83],
    landHigh: [196, 174, 118],
    ice: [206, 221, 215],
    atmosphere: [96, 154, 183]
  });
}

export function sampleHEarthHydrationMaterial(inputVector, options = {}) {
  const profile = resolveWorldProfile(options.world);
  const vector = normalize3(inputVector[0], inputVector[1], inputVector[2]);
  const phase = Number.isFinite(options.phase) ? options.phase : 0;

  const broad = waveField(vector, 1, phase + 0.031);
  const middle = waveField([vector[2], vector[0], vector[1]], 3, phase + 0.149);
  const fine = waveField([vector[0] * 0.73 + vector[2] * 0.27, vector[1], vector[2] * 0.73 - vector[0] * 0.27], 7, phase + 0.311);
  const ridge = ridgeField(vector, phase + 0.421);

  const polarPressure = Math.pow(Math.abs(vector[1]), 3.2);
  const elevation = broad * 0.57 + middle * 0.28 + fine * 0.12 + ridge * 0.22 - polarPressure * 0.055;
  const waterline = profile.waterline;
  const depth = clamp((waterline - elevation) * 2.75, 0, 1);
  const isWater = elevation < waterline;
  const shelf = isWater ? smoothstep(0.44, 0.02, depth) : smoothstep(0.0, 0.13, elevation - waterline);
  const coast = 1 - clamp(Math.abs(elevation - waterline) / 0.16, 0, 1);
  const ice = smoothstep(0.72, 0.95, Math.abs(vector[1])) * smoothstep(-0.08, 0.26, elevation);

  let rgb;
  let material;

  if (isWater) {
    const waterTone = mixRgb(profile.mid, profile.deep, smoothstep(0.08, 0.82, depth));
    rgb = mixRgb(waterTone, profile.shallow, shelf * 0.74 + coast * 0.21);
    const current = waveField([vector[0], vector[2], vector[1]], 8, phase + 0.519);
    rgb = mixRgb(rgb, [154, 188, 186], clamp((current + 1) * 0.045, 0, 0.12));
    material = depth > 0.58 ? "deep-water" : shelf > 0.38 ? "coastal-water" : "water";
  } else {
    const height = smoothstep(waterline, waterline + 0.64, elevation);
    const lowToMid = mixRgb(profile.landLow, profile.landMid, smoothstep(0.02, 0.42, height));
    rgb = mixRgb(lowToMid, profile.landHigh, smoothstep(0.42, 0.94, height));
    rgb = mixRgb(rgb, [78, 91, 83], clamp(ridge * 0.18, 0, 0.18));
    rgb = mixRgb(rgb, [211, 196, 143], clamp(coast * 0.33, 0, 0.33));
    material = height > 0.78 ? "highland" : coast > 0.35 ? "coastal-land" : "land";
  }

  if (ice > 0.05) {
    rgb = mixRgb(rgb, profile.ice, clamp(ice, 0, 0.82));
    material = "polar-ice";
  }

  return Object.freeze({
    contract: HYDRATION_CONTRACT,
    world: profile.key,
    material,
    color: Object.freeze([
      clamp(Math.round(rgb[0]), 0, 255),
      clamp(Math.round(rgb[1]), 0, 255),
      clamp(Math.round(rgb[2]), 0, 255),
      255
    ]),
    elevation,
    water: isWater ? 1 : 0,
    depth,
    shelf,
    coast,
    ridge,
    ice
  });
}

export function createHEarthHydrationAtlas(options = {}) {
  const width = Math.max(144, Math.round(options.width || FIBONACCI_RUNTIME_SEQUENCE[13]));
  const height = Math.max(89, Math.round(options.height || FIBONACCI_RUNTIME_SEQUENCE[12]));
  const world = options.world || "h-earth";
  const data = new Uint8ClampedArray(width * height * 4);
  const stats = {
    waterPixels: 0,
    landPixels: 0,
    shelfPixels: 0,
    icePixels: 0
  };

  for (let y = 0; y < height; y += 1) {
    const v = (y + 0.5) / height;
    for (let x = 0; x < width; x += 1) {
      const u = (x + 0.5) / width;
      const sample = sampleHEarthHydrationMaterial(unitVectorFromUv(u, v), options);
      const index = (y * width + x) * 4;
      data[index] = sample.color[0];
      data[index + 1] = sample.color[1];
      data[index + 2] = sample.color[2];
      data[index + 3] = 255;

      if (sample.water) stats.waterPixels += 1;
      else stats.landPixels += 1;
      if (sample.shelf > 0.35) stats.shelfPixels += 1;
      if (sample.ice > 0.1) stats.icePixels += 1;
    }
  }

  const total = Math.max(1, width * height);
  const atlas = {
    contract: HYDRATION_CONTRACT,
    fibonacci: true,
    world: resolveWorldProfile(world).key,
    width,
    height,
    data,
    stats: Object.freeze({
      waterRatio: stats.waterPixels / total,
      landRatio: stats.landPixels / total,
      shelfRatio: stats.shelfPixels / total,
      iceRatio: stats.icePixels / total
    })
  };

  return Object.freeze(atlas);
}

export function getHEarthHydrationStatus() {
  return Object.freeze({
    contract: HYDRATION_CONTRACT,
    role: "material-asset-only",
    shapeAuthority: false,
    publicMapConstruction: false,
    fibonacci: FIBONACCI_RUNTIME_SEQUENCE.slice()
  });
}

export { HYDRATION_CONTRACT as H_EARTH_HYDRATION_CONTRACT, FIBONACCI_RUNTIME_SEQUENCE };

if (typeof window !== "undefined") {
  window.DGBHEarthHydration = Object.freeze({
    contract: HYDRATION_CONTRACT,
    sequence: FIBONACCI_RUNTIME_SEQUENCE,
    createAtlas: createHEarthHydrationAtlas,
    sample: sampleHEarthHydrationMaterial,
    status: getHEarthHydrationStatus
  });
}
