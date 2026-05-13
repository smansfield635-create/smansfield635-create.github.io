// /assets/showroom.globe.hydration.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_SATELLITE_HYDRATION_AUTHORITY_TNT_v5
// Owns: satellite-view hydration sampling for the parent Globe selector.
// No ground view. No Manor. No Western Golden Shelf.

export const SHOWROOM_GLOBE_HYDRATION_VERSION = "showroom-globe-satellite-hydration-authority-v5";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash(seed, a = 0, b = 0, c = 0) {
  return fract(Math.sin(seed * 12.9898 + a * 78.233 + b * 37.719 + c * 19.911) * 43758.5453123);
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

  const n000 = hash(seed, xi, yi, zi);
  const n100 = hash(seed, xi + 1, yi, zi);
  const n010 = hash(seed, xi, yi + 1, zi);
  const n110 = hash(seed, xi + 1, yi + 1, zi);
  const n001 = hash(seed, xi, yi, zi + 1);
  const n101 = hash(seed, xi + 1, yi, zi + 1);
  const n011 = hash(seed, xi, yi + 1, zi + 1);
  const n111 = hash(seed, xi + 1, yi + 1, zi + 1);

  return lerp(
    lerp(lerp(n000, n100, u), lerp(n010, n110, u), v),
    lerp(lerp(n001, n101, u), lerp(n011, n111, u), v),
    w
  ) * 2 - 1;
}

function fbm3D(x, y, z, seed = 0, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + i * 37) * amplitude;
    total += amplitude;
    amplitude *= 0.52;
    frequency *= 2.04;
  }

  return value / total;
}

function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

export function sampleHydration(p, material = {}, world = {}, view = {}) {
  const seed = world.seed || 1401;
  const quality = view.quality || "settled";
  const octaves = quality === "motion" ? 2 : quality === "settling" ? 3 : 4;

  const basin =
    (material.basins || 0) * 0.46 +
    (material.channels || 0) * 0.18 +
    (material.canyons || 0) * 0.10;

  const shelfNoise = fbm3D(p.x * 2.25, p.y * 2.12, p.z * 2.18, seed + 810, octaves);
  const currentNoise = fbm3D(p.x * 9.5, p.y * 9.1, p.z * 9.3, seed + 811, Math.max(2, octaves - 1));
  const reefNoise = fbm3D(p.x * 18.0, p.y * 17.3, p.z * 18.6, seed + 812, 2);

  const height = material.height || 0;
  const relief = material.relief || 0.5;

  const seaLevel = world.seaLevel ?? 0.105;
  const wetLevel = seaLevel + basin * 0.38 + shelfNoise * 0.055;

  const water = clamp((wetLevel - height) * 2.35 + 0.10, 0, 1);
  const shallow = clamp(1 - Math.abs(height - wetLevel) * 7.2, 0, 1) * clamp(water + 0.22, 0, 1);
  const coast = clamp(1 - Math.abs(height - wetLevel) * 13.0, 0, 1);
  const reef = shallow * clamp(reefNoise * 0.5 + 0.5, 0, 1) * 0.38;
  const current = water * clamp(currentNoise * 0.5 + 0.5, 0, 1);
  const vegetation = clamp((1 - water) * (0.34 + shelfNoise * 0.18 + relief * 0.20) - (material.caverns || 0) * 0.25, 0, 1);

  return {
    water,
    shallow,
    coast,
    reef,
    current,
    vegetation,
    wetness: clamp(water * 0.72 + coast * 0.36, 0, 1),
    sparkle: clamp(water * (0.20 + current * 0.80), 0, 1)
  };
}

export function blendHydration(baseColor, hydration = {}, light = 0.5, rim = 0) {
  let color = [...baseColor];

  const water = clamp(hydration.water || 0, 0, 1);
  const shallow = clamp(hydration.shallow || 0, 0, 1);
  const coast = clamp(hydration.coast || 0, 0, 1);
  const reef = clamp(hydration.reef || 0, 0, 1);
  const vegetation = clamp(hydration.vegetation || 0, 0, 1);
  const sparkle = clamp(hydration.sparkle || 0, 0, 1);

  const deepWater = [20, 70, 103];
  const blueWater = [38, 112, 139];
  const shelfWater = [78, 153, 153];
  const beach = [204, 181, 112];
  const green = [76, 128, 83];

  if (vegetation > 0.08) {
    color = mixColor(color, green, clamp(vegetation * 0.28, 0, 0.26));
  }

  if (water > 0.01) {
    const waterBase = mixColor(deepWater, blueWater, shallow * 0.58);
    const waterShelf = mixColor(waterBase, shelfWater, clamp(shallow * 0.65 + reef * 0.35, 0, 1));

    color = mixColor(color, waterShelf, clamp(water * 0.80, 0, 0.82));
    color = mixColor(color, beach, clamp(coast * 0.20, 0, 0.18));

    const shine = sparkle * clamp(light, 0, 1) * 24 + rim * water * 12;

    color[0] = clamp(color[0] + shine * 0.72, 0, 255);
    color[1] = clamp(color[1] + shine * 0.88, 0, 255);
    color[2] = clamp(color[2] + shine * 1.08, 0, 255);
  }

  return color;
}
