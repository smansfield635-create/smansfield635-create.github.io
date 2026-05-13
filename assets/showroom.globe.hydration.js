// /assets/showroom.globe.hydration.js
// TNT NEW FILE
// SHOWROOM_GLOBE_PUBLIC_HYDRATION_AUTHORITY_TNT_v1
// Owns: public globe hydration expression only.
// Does not own: private world geography, named continents, mountains, child engines, or full planet history.
// Contract: object-space hydration, no privileged longitude, no schoolroom meridian.

export const SHOWROOM_GLOBE_HYDRATION_VERSION = "showroom-globe-public-hydration-authority-v1";

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

function hash(seed, a = 0, b = 0, c = 0) {
  return fract(Math.sin(seed * 12.9898 + a * 78.233 + b * 37.719 + c * 19.911) * 43758.5453123);
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

function seededVector(seed, index) {
  return normalize({
    x: Math.sin(seed * 0.013 + index * 1.91) + Math.cos(seed * 0.029 + index * 0.71) * 0.32,
    y: Math.sin(seed * 0.017 + index * 2.61) + Math.cos(seed * 0.031 + index * 1.29) * 0.28,
    z: Math.cos(seed * 0.019 + index * 3.17) + Math.sin(seed * 0.037 + index * 1.61) * 0.34
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
  const d = dot(p, center);
  const inner = Math.cos(radius);
  const outer = Math.cos(radius + softness);
  return smoothstep(outer, inner, d);
}

function bandField(p, feature) {
  const basis = feature.basis;
  const u = dot(p, basis.a);
  const v = dot(p, basis.b);
  const w = dot(p, basis.n);

  const wobble =
    Math.sin(u * feature.bendA + feature.phase) * feature.wobbleA +
    Math.sin(v * feature.bendB - feature.phase * 0.7) * feature.wobbleB +
    Math.sin((u - v) * feature.bendC + feature.phase * 1.4) * feature.wobbleC;

  const line = 1 - smoothstep(feature.width, feature.width * feature.softness, Math.abs(w + wobble));
  const gate = sphericalCap(p, feature.gate, feature.radius, feature.gateSoftness);

  return clamp(line * gate * feature.weight, 0, 1);
}

function makeBand(seed, family, index, widthBase, widthRange, weightBase, weightRange) {
  return {
    basis: basisFromNormal(seededVector(seed + family, index)),
    gate: seededVector(seed + family + 20, index),
    radius: 0.42 + hash(seed, index, family) * 0.82,
    gateSoftness: 0.10 + hash(seed, index, family + 1) * 0.22,
    width: widthBase + hash(seed, index, family + 2) * widthRange,
    softness: 1.9 + hash(seed, index, family + 3) * 1.35,
    bendA: 2.6 + hash(seed, index, family + 4) * 5.0,
    bendB: 3.8 + hash(seed, index, family + 5) * 6.0,
    bendC: 5.4 + hash(seed, index, family + 6) * 6.0,
    wobbleA: 0.016 + hash(seed, index, family + 7) * 0.044,
    wobbleB: 0.008 + hash(seed, index, family + 8) * 0.026,
    wobbleC: 0.004 + hash(seed, index, family + 9) * 0.016,
    phase: hash(seed, index, family + 10) * Math.PI * 2,
    weight: weightBase + hash(seed, index, family + 11) * weightRange
  };
}

function makeFeatures(seed) {
  return {
    oceans: Array.from({ length: 5 }, (_, i) => ({
      center: seededVector(seed + 900, i),
      radius: 0.48 + hash(seed, i, 900) * 0.46,
      softness: 0.16 + hash(seed, i, 901) * 0.22,
      weight: 0.62 + hash(seed, i, 902) * 0.42
    })),
    seas: Array.from({ length: 8 }, (_, i) => ({
      center: seededVector(seed + 1000, i),
      radius: 0.18 + hash(seed, i, 1000) * 0.22,
      softness: 0.08 + hash(seed, i, 1001) * 0.14,
      weight: 0.42 + hash(seed, i, 1002) * 0.38
    })),
    lakes: Array.from({ length: 14 }, (_, i) => ({
      center: seededVector(seed + 1100, i),
      radius: 0.035 + hash(seed, i, 1100) * 0.080,
      softness: 0.025 + hash(seed, i, 1101) * 0.065,
      weight: 0.32 + hash(seed, i, 1102) * 0.44
    })),
    riverBands: Array.from({ length: 10 }, (_, i) => makeBand(seed, 1200, i, 0.006, 0.010, 0.28, 0.38)),
    shelfBands: Array.from({ length: 6 }, (_, i) => makeBand(seed, 1300, i, 0.028, 0.026, 0.22, 0.30))
  };
}

function sampleCaps(p, caps) {
  let value = 0;

  for (const cap of caps) {
    value = Math.max(value, sphericalCap(p, cap.center, cap.radius, cap.softness) * cap.weight);
  }

  return clamp(value, 0, 1);
}

function sampleBands(p, bands) {
  let value = 0;

  for (const band of bands) {
    value = Math.max(value, bandField(p, band));
  }

  return clamp(value, 0, 1);
}

function getProfile(world) {
  if (world?.key === "earth") {
    return {
      level: -0.04,
      oceanWeight: 0.94,
      seaWeight: 0.68,
      lakeWeight: 0.42,
      riverWeight: 0.36,
      shelfWeight: 0.28,
      deep: [7, 38, 88],
      mid: [20, 92, 150],
      shallow: [76, 169, 190],
      glint: [210, 240, 255],
      atmosphere: [145, 195, 255]
    };
  }

  if (world?.key === "audralia") {
    return {
      level: -0.10,
      oceanWeight: 0.70,
      seaWeight: 0.58,
      lakeWeight: 0.34,
      riverWeight: 0.28,
      shelfWeight: 0.24,
      deep: [18, 28, 72],
      mid: [50, 78, 132],
      shallow: [116, 160, 182],
      glint: [232, 220, 255],
      atmosphere: [194, 178, 255]
    };
  }

  return {
    level: -0.06,
    oceanWeight: 0.80,
    seaWeight: 0.62,
    lakeWeight: 0.40,
    riverWeight: 0.34,
    shelfWeight: 0.26,
    deep: [8, 48, 68],
    mid: [24, 104, 128],
    shallow: [86, 178, 170],
    glint: [212, 255, 236],
    atmosphere: [150, 215, 232]
  };
}

function blendColor(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

const featureCache = new Map();

export function getHydrationFeatures(world) {
  const seed = world?.seed ?? 777;
  const key = `${world?.key || "world"}:${seed}`;

  if (!featureCache.has(key)) {
    featureCache.set(key, makeFeatures(seed));
  }

  return featureCache.get(key);
}

export function sampleHydration(p, material, world, options = {}) {
  const profile = getProfile(world);
  const features = getHydrationFeatures(world);
  const quality = options.quality || "settled";

  const oceanCaps = sampleCaps(p, features.oceans);
  const seaCaps = sampleCaps(p, features.seas);
  const shelfBands = sampleBands(p, features.shelfBands);
  const riverBands = quality === "motion" ? 0 : sampleBands(p, features.riverBands);
  const lakes = quality === "motion" ? 0 : sampleCaps(p, features.lakes);

  const lowGate = smoothstep(0.16, 0.82, profile.level - material.height + material.basins * 0.30);
  const basinGate = smoothstep(0.18, 0.76, material.basins + material.canyons * 0.18);
  const channelGate = smoothstep(0.18, 0.80, material.channels + material.canyons * 0.18);

  const ocean = clamp(oceanCaps * profile.oceanWeight * Math.max(lowGate, basinGate * 0.72), 0, 1);
  const sea = clamp(seaCaps * profile.seaWeight * Math.max(lowGate * 0.82, basinGate), 0, 1);
  const lake = clamp(lakes * profile.lakeWeight * Math.max(lowGate, basinGate), 0, 1);
  const river = clamp(riverBands * profile.riverWeight * Math.max(channelGate, lowGate * 0.40), 0, 1);
  const shelf = clamp(shelfBands * profile.shelfWeight * smoothstep(0.10, 0.70, ocean + sea + material.basins), 0, 1);

  const water = clamp(Math.max(ocean, sea, lake, river, shelf), 0, 1);
  const deep = clamp(ocean * smoothstep(0.24, 0.92, material.basins + oceanCaps), 0, 1);
  const shallow = clamp(Math.max(shelf, sea, lake, river) * (1 - deep * 0.45), 0, 1);
  const wetEdge = clamp(smoothstep(0.06, 0.36, water) * (1 - smoothstep(0.68, 0.98, water)), 0, 1);
  const glint = clamp((ocean + sea + lake + river * 0.65) * (0.22 + shelf * 0.20), 0, 1);

  let color = blendColor(profile.mid, profile.deep, deep);
  color = blendColor(color, profile.shallow, shallow * 0.76);
  color = blendColor(color, profile.glint, glint * 0.16);

  return {
    version: SHOWROOM_GLOBE_HYDRATION_VERSION,
    water,
    ocean,
    sea,
    lake,
    river,
    shelf,
    deep,
    shallow,
    wetEdge,
    glint,
    color,
    palette: profile
  };
}

export function blendHydration(baseColor, hydration, lightValue = 1, rim = 0) {
  if (!hydration || hydration.water <= 0.01) return baseColor;

  const waterStrength = clamp(hydration.water, 0, 0.92);
  const deepTint = hydration.deep * 0.28;
  const shallowTint = hydration.shallow * 0.18;
  const rimLift = rim * 0.08 * waterStrength;

  const waterColor = [
    clamp(hydration.color[0] * (0.70 + lightValue * 0.42) + hydration.palette.glint[0] * (hydration.glint * 0.08 + rimLift), 0, 255),
    clamp(hydration.color[1] * (0.70 + lightValue * 0.42) + hydration.palette.glint[1] * (hydration.glint * 0.08 + rimLift), 0, 255),
    clamp(hydration.color[2] * (0.70 + lightValue * 0.42) + hydration.palette.glint[2] * (hydration.glint * 0.08 + rimLift), 0, 255)
  ];

  let blended = blendColor(baseColor, waterColor, waterStrength);
  blended = blendColor(blended, hydration.palette.deep, deepTint);
  blended = blendColor(blended, hydration.palette.shallow, shallowTint);

  return blended;
}
