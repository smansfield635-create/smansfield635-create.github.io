// /assets/showroom.globe.cinematic.material.js
// TNT NEW FILE
// SHOWROOM_GLOBE_CINEMATIC_MATERIAL_RENDERER_ASSET_v1
// Owns: continuous dry planet material rendering.
// Contract: no privileged longitude, no prime meridian, no schoolroom-globe partition.

export const PLANET_MATERIAL_VERSION = "showroom-globe-cinematic-material-renderer-asset-v1";

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

  const x00 = lerp(n000, n100, u);
  const x10 = lerp(n010, n110, u);
  const x01 = lerp(n001, n101, u);
  const x11 = lerp(n011, n111, u);

  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w) * 2 - 1;
}

function fbm3D(x, y, z, seed = 0, octaves = 5) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + i * 43) * amplitude;
    total += amplitude;
    amplitude *= 0.52;
    frequency *= 2.03;
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

function inverseViewPoint(viewPoint, yaw, pitch) {
  return normalize(rotateY(rotateX(viewPoint, -pitch), -yaw));
}

function viewPointFromObject(objectPoint, yaw, pitch) {
  return normalize(rotateX(rotateY(objectPoint, yaw), pitch));
}

function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);

  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

function colorWithAlpha(color, alpha) {
  return `rgba(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])},${alpha})`;
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

function createFeatureSet(seed) {
  const basins = Array.from({ length: 7 }, (_, i) => ({
    center: seededVector(seed + 100, i),
    radius: 0.42 + hash(seed, i, 100) * 0.42,
    softness: 0.14 + hash(seed, i, 101) * 0.22,
    weight: 0.52 + hash(seed, i, 102) * 0.48
  }));

  const uplifts = Array.from({ length: 5 }, (_, i) => ({
    center: seededVector(seed + 150, i),
    radius: 0.32 + hash(seed, i, 150) * 0.36,
    softness: 0.11 + hash(seed, i, 151) * 0.18,
    weight: 0.30 + hash(seed, i, 152) * 0.36
  }));

  const ridgeBands = Array.from({ length: 7 }, (_, i) => ({
    basis: basisFromNormal(seededVector(seed + 200, i)),
    gate: seededVector(seed + 220, i),
    radius: 0.78 + hash(seed, i, 200) * 0.62,
    gateSoftness: 0.18 + hash(seed, i, 201) * 0.18,
    width: 0.045 + hash(seed, i, 202) * 0.036,
    softness: 2.2 + hash(seed, i, 203) * 1.2,
    bendA: 2.6 + hash(seed, i, 204) * 2.6,
    bendB: 3.8 + hash(seed, i, 205) * 3.6,
    bendC: 5.4 + hash(seed, i, 206) * 4.0,
    wobbleA: 0.026 + hash(seed, i, 207) * 0.036,
    wobbleB: 0.012 + hash(seed, i, 208) * 0.026,
    wobbleC: 0.006 + hash(seed, i, 209) * 0.014,
    phase: hash(seed, i, 210) * Math.PI * 2,
    weight: 0.42 + hash(seed, i, 211) * 0.42
  }));

  const canyonBands = Array.from({ length: 7 }, (_, i) => ({
    basis: basisFromNormal(seededVector(seed + 300, i)),
    gate: seededVector(seed + 320, i),
    radius: 0.64 + hash(seed, i, 300) * 0.70,
    gateSoftness: 0.14 + hash(seed, i, 301) * 0.18,
    width: 0.014 + hash(seed, i, 302) * 0.020,
    softness: 2.1 + hash(seed, i, 303) * 1.0,
    bendA: 3.4 + hash(seed, i, 304) * 3.2,
    bendB: 5.2 + hash(seed, i, 305) * 4.2,
    bendC: 7.4 + hash(seed, i, 306) * 4.6,
    wobbleA: 0.030 + hash(seed, i, 307) * 0.044,
    wobbleB: 0.012 + hash(seed, i, 308) * 0.026,
    wobbleC: 0.008 + hash(seed, i, 309) * 0.016,
    phase: hash(seed, i, 310) * Math.PI * 2,
    weight: 0.50 + hash(seed, i, 311) * 0.50
  }));

  const channelBands = Array.from({ length: 9 }, (_, i) => ({
    basis: basisFromNormal(seededVector(seed + 400, i)),
    gate: seededVector(seed + 420, i),
    radius: 0.44 + hash(seed, i, 400) * 0.64,
    gateSoftness: 0.10 + hash(seed, i, 401) * 0.18,
    width: 0.007 + hash(seed, i, 402) * 0.011,
    softness: 2.2 + hash(seed, i, 403) * 1.3,
    bendA: 5.6 + hash(seed, i, 404) * 4.4,
    bendB: 7.2 + hash(seed, i, 405) * 5.6,
    bendC: 9.4 + hash(seed, i, 406) * 5.2,
    wobbleA: 0.018 + hash(seed, i, 407) * 0.034,
    wobbleB: 0.010 + hash(seed, i, 408) * 0.020,
    wobbleC: 0.006 + hash(seed, i, 409) * 0.012,
    phase: hash(seed, i, 410) * Math.PI * 2,
    weight: 0.38 + hash(seed, i, 411) * 0.42
  }));

  const cliffBands = Array.from({ length: 6 }, (_, i) => ({
    basis: basisFromNormal(seededVector(seed + 500, i)),
    gate: seededVector(seed + 520, i),
    radius: 0.58 + hash(seed, i, 500) * 0.62,
    gateSoftness: 0.14 + hash(seed, i, 501) * 0.20,
    width: 0.024 + hash(seed, i, 502) * 0.024,
    softness: 1.7 + hash(seed, i, 503) * 0.8,
    bendA: 2.4 + hash(seed, i, 504) * 2.2,
    bendB: 4.2 + hash(seed, i, 505) * 3.2,
    bendC: 6.4 + hash(seed, i, 506) * 3.6,
    wobbleA: 0.018 + hash(seed, i, 507) * 0.030,
    wobbleB: 0.010 + hash(seed, i, 508) * 0.020,
    wobbleC: 0.006 + hash(seed, i, 509) * 0.012,
    phase: hash(seed, i, 510) * Math.PI * 2,
    weight: 0.40 + hash(seed, i, 511) * 0.42
  }));

  const scars = Array.from({ length: 8 }, (_, i) => ({
    basis: basisFromNormal(seededVector(seed + 600, i)),
    gate: seededVector(seed + 620, i),
    radius: 0.35 + hash(seed, i, 600) * 0.58,
    gateSoftness: 0.08 + hash(seed, i, 601) * 0.14,
    width: 0.004 + hash(seed, i, 602) * 0.006,
    softness: 1.6 + hash(seed, i, 603) * 0.7,
    bendA: 8.0 + hash(seed, i, 604) * 5.0,
    bendB: 10.0 + hash(seed, i, 605) * 5.4,
    bendC: 12.0 + hash(seed, i, 606) * 6.0,
    wobbleA: 0.006 + hash(seed, i, 607) * 0.010,
    wobbleB: 0.004 + hash(seed, i, 608) * 0.008,
    wobbleC: 0.002 + hash(seed, i, 609) * 0.005,
    phase: hash(seed, i, 610) * Math.PI * 2,
    weight: 0.24 + hash(seed, i, 611) * 0.38
  }));

  const caverns = Array.from({ length: 9 }, (_, i) => ({
    center: seededVector(seed + 700, i),
    radius: 0.035 + hash(seed, i, 700) * 0.070,
    softness: 0.026 + hash(seed, i, 701) * 0.060,
    weight: 0.38 + hash(seed, i, 702) * 0.48
  }));

  return { basins, uplifts, ridgeBands, canyonBands, channelBands, cliffBands, scars, caverns };
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

function sampleMaterial(p, world, features) {
  const seed = world.seed;

  const warp = normalize({
    x: p.x + fbm3D(p.x * 1.18 + 2.0, p.y * 1.18 - 1.0, p.z * 1.18 + 0.5, seed + 1, 3) * 0.075,
    y: p.y + fbm3D(p.x * 1.16 - 3.0, p.y * 1.16 + 2.0, p.z * 1.16 - 1.0, seed + 2, 3) * 0.075,
    z: p.z + fbm3D(p.x * 1.20 + 1.0, p.y * 1.20 + 3.0, p.z * 1.20 - 2.0, seed + 3, 3) * 0.075
  });

  const macro = fbm3D(warp.x * 1.18, warp.y * 1.18, warp.z * 1.18, seed + 20, 6);
  const plate = ridge3D(warp.x * 1.90, warp.y * 1.90, warp.z * 1.90, seed + 21, 5);
  const fold = ridge3D(warp.x * 4.10, warp.y * 3.95, warp.z * 4.20, seed + 22, 5);
  const grain = fbm3D(warp.x * 15.5, warp.y * 15.0, warp.z * 15.2, seed + 23, 4);
  const micro = ridge3D(warp.x * 27.0, warp.y * 25.0, warp.z * 26.0, seed + 24, 3);

  const basins = sampleCaps(warp, features.basins);
  const uplifts = sampleCaps(warp, features.uplifts);
  const ridges = sampleBands(warp, features.ridgeBands);
  const canyons = sampleBands(warp, features.canyonBands);
  const channels = sampleBands(warp, features.channelBands);
  const cliffs = sampleBands(warp, features.cliffBands);
  const scars = sampleBands(warp, features.scars);
  const caverns = sampleCaps(warp, features.caverns);

  const basinFloor = basins * (0.70 + ridge3D(warp.x * 5.2, warp.y * 5.0, warp.z * 5.4, seed + 25, 3) * 0.22);
  const fractured = Math.max(scars, ridge3D(warp.x * 8.0, warp.y * 7.6, warp.z * 7.8, seed + 26, 3) * 0.16);

  const height =
    macro * 0.24 +
    plate * 0.24 +
    fold * 0.15 +
    uplifts * 0.18 +
    ridges * 0.32 +
    cliffs * 0.15 +
    fractured * 0.05 -
    basinFloor * 0.35 -
    canyons * 0.40 -
    channels * 0.19 -
    caverns * 0.30 +
    grain * 0.032 +
    micro * 0.020;

  return {
    height,
    relief: clamp((height + 0.68) / 1.32, 0, 1),
    macro,
    plate,
    fold,
    grain: clamp((grain + 1) * 0.5, 0, 1),
    micro,
    basins,
    uplifts,
    ridges,
    canyons,
    channels,
    cliffs,
    scars,
    caverns,
    fractured
  };
}

function tangentVectors(p) {
  const helper = Math.abs(p.y) > 0.9 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const east = normalize(cross(helper, p));
  const north = normalize(cross(p, east));

  return { east, north };
}

function offsetPoint(p, tangent, amount) {
  return normalize({
    x: p.x + tangent.x * amount,
    y: p.y + tangent.y * amount,
    z: p.z + tangent.z * amount
  });
}

function sampleHeight(p, world, features) {
  return sampleMaterial(p, world, features).height;
}

function sampleNormal(p, world, features) {
  const eps = 0.0085;
  const t = tangentVectors(p);

  const hE = sampleHeight(offsetPoint(p, t.east, eps), world, features);
  const hW = sampleHeight(offsetPoint(p, t.east, -eps), world, features);
  const hN = sampleHeight(offsetPoint(p, t.north, eps), world, features);
  const hS = sampleHeight(offsetPoint(p, t.north, -eps), world, features);

  const dE = (hE - hW) / (eps * 2);
  const dN = (hN - hS) / (eps * 2);
  const strength = 0.56;

  return normalize({
    x: p.x - t.east.x * dE * strength - t.north.x * dN * strength,
    y: p.y - t.east.y * dE * strength - t.north.y * dN * strength,
    z: p.z - t.east.z * dE * strength - t.north.z * dN * strength
  });
}

function materialColor(material, world) {
  let base = mixColor(world.stoneLow, world.stoneMid, 0.28 + material.relief * 0.50);

  if (material.basins > 0.16) {
    base = mixColor(base, world.stoneDeep, material.basins * 0.50);
    base = mixColor(base, world.sediment, clamp((material.basins - 0.28) * 0.42, 0, 0.22));
  }

  if (material.caverns > 0.20) {
    base = mixColor(base, world.shadow, material.caverns * 0.62);
  }

  if (material.channels > 0.24) {
    base = mixColor(base, world.shadow, material.channels * 0.28);
    base = mixColor(base, world.exposed, clamp((material.channels - 0.34) * 0.26, 0, 0.16));
  }

  if (material.canyons > 0.24) {
    base = mixColor(base, world.shadow, material.canyons * 0.42);
    base = mixColor(base, world.exposed, clamp((material.canyons - 0.30) * 0.42, 0, 0.24));
  }

  if (material.cliffs > 0.18) {
    base = mixColor(base, world.exposed, clamp(material.cliffs * 0.58, 0, 0.46));
  }

  if (material.ridges > 0.42 || material.relief > 0.70) {
    base = mixColor(base, world.stoneHigh, clamp(Math.max(material.ridges - 0.38, material.relief - 0.66) * 0.92, 0, 0.58));
  }

  if (material.ridges > 0.66) {
    base = mixColor(base, world.ridge, clamp((material.ridges - 0.62) * 0.78, 0, 0.34));
  }

  if (material.scars > 0.52) {
    base = mixColor(base, world.scar, clamp((material.scars - 0.50) * 0.34, 0, 0.14));
  }

  const grain = (material.grain - 0.5) * 16 + (material.micro - 0.5) * 8;

  return [
    clamp(base[0] + grain, 0, 255),
    clamp(base[1] + grain * 0.82, 0, 255),
    clamp(base[2] + grain * 0.58, 0, 255)
  ];
}

function shadePixel({ viewNormal, bumpViewNormal, material, world, lightView }) {
  const sphereDiffuse = clamp(dot(viewNormal, lightView), 0, 1);
  const reliefDiffuse = clamp(dot(bumpViewNormal, lightView), 0, 1);
  const z = clamp(viewNormal.z, 0, 1);

  const terminator = smoothstep(-0.10, 0.76, sphereDiffuse);
  const rim = Math.pow(clamp(1 - z, 0, 1), 1.7);

  const occlusion =
    material.basins * 0.13 +
    material.canyons * 0.24 +
    material.channels * 0.11 +
    material.caverns * 0.28;

  const edgeHighlight =
    material.cliffs * 0.18 +
    material.ridges * 0.10 +
    material.scars * 0.035;

  const base = materialColor(material, world);
  const ambient = 0.10;
  const direct = reliefDiffuse * 1.02;
  const shade = clamp((ambient + direct + edgeHighlight - occlusion) * lerp(0.17, 1, terminator), 0.055, 1.28);

  const sunFlash = clamp((reliefDiffuse - 0.73) * 0.42, 0, 0.24);
  const rimGlow = rim * 0.12;

  const color = [
    clamp(base[0] * shade + world.ridge[0] * sunFlash + world.atmosphere[0] * rimGlow, 0, 255),
    clamp(base[1] * shade + world.ridge[1] * sunFlash + world.atmosphere[1] * rimGlow, 0, 255),
    clamp(base[2] * shade + world.ridge[2] * sunFlash + world.atmosphere[2] * rimGlow, 0, 255)
  ];

  const warmKey = smoothstep(-1, 0.18, -viewNormal.x) * smoothstep(-0.48, 0.82, viewNormal.y);
  color[0] = clamp(color[0] + warmKey * 13, 0, 255);
  color[1] = clamp(color[1] + warmKey * 10, 0, 255);
  color[2] = clamp(color[2] + warmKey * 4, 0, 255);

  return color;
}

export function createCinematicPlanetMaterialRenderer(options = {}) {
  const mobile = options.mobile === true;
  const dpr = Number.isFinite(options.dpr) ? options.dpr : 1;
  const rasterLimit = mobile ? 420 : 680;

  const cache = new Map();
  const surface = document.createElement("canvas");
  const surfaceCtx = surface.getContext("2d", {
    alpha: true,
    willReadFrequently: false
  });

  let size = 0;
  let image = null;

  function getFeatures(world) {
    const key = `${world.key}:${world.seed}`;

    if (!cache.has(key)) {
      cache.set(key, createFeatureSet(world.seed));
    }

    return cache.get(key);
  }

  function ensureBuffer(scale) {
    const desired = Math.max(280, Math.min(rasterLimit, Math.round(scale * 2.25)));

    if (desired !== size) {
      size = desired;
      surface.width = desired;
      surface.height = desired;
      image = surfaceCtx.createImageData(desired, desired);
    }
  }

  function drawAtmosphere(ctx, view, world) {
    const a = world.atmosphere;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const outer = ctx.createRadialGradient(
      view.cx,
      view.cy,
      view.scale * 0.74,
      view.cx,
      view.cy,
      view.scale * 1.19
    );

    outer.addColorStop(0, "rgba(0,0,0,0)");
    outer.addColorStop(0.64, `rgba(${a[0]},${a[1]},${a[2]},0.075)`);
    outer.addColorStop(0.91, `rgba(${a[0]},${a[1]},${a[2]},0.30)`);
    outer.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.045)`);

    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(view.cx, view.cy, view.scale * 1.15, 0, Math.PI * 2);
    ctx.fill();

    const limb = ctx.createRadialGradient(
      view.cx - view.scale * 0.18,
      view.cy - view.scale * 0.21,
      view.scale * 0.38,
      view.cx,
      view.cy,
      view.scale * 1.04
    );

    limb.addColorStop(0, "rgba(255,255,255,0)");
    limb.addColorStop(0.70, "rgba(255,255,255,0)");
    limb.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.34)`);

    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(view.cx, view.cy, view.scale * 1.012, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colorWithAlpha(a, 0.36);
    ctx.lineWidth = Math.max(1, dpr * 1.2);
    ctx.beginPath();
    ctx.arc(view.cx, view.cy, view.scale * 1.008, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanet(ctx, view, world) {
    ensureBuffer(view.scale);

    const features = getFeatures(world);
    const data = image.data;
    const lightView = normalize({ x: -0.60, y: 0.52, z: 0.74 });

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
        const objectPoint = inverseViewPoint(viewNormal, view.yaw, view.pitch);

        const material = sampleMaterial(objectPoint, world, features);
        const objectBumpNormal = sampleNormal(objectPoint, world, features);
        const viewBumpNormal = viewPointFromObject(objectBumpNormal, view.yaw, view.pitch);

        const color = shadePixel({
          viewNormal,
          bumpViewNormal: viewBumpNormal,
          material,
          world,
          lightView
        });

        const edgeAlpha = 1 - smoothstep(0.976, 1.0, Math.sqrt(r2));
        const alpha = Math.round(255 * clamp(edgeAlpha, 0, 1));

        data[ptr] = Math.round(color[0]);
        data[ptr + 1] = Math.round(color[1]);
        data[ptr + 2] = Math.round(color[2]);
        data[ptr + 3] = alpha;
        ptr += 4;
      }
    }

    surfaceCtx.putImageData(image, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      surface,
      view.cx - view.scale,
      view.cy - view.scale,
      view.scale * 2,
      view.scale * 2
    );
    ctx.restore();

    drawAtmosphere(ctx, view, world);
  }

  return {
    version: PLANET_MATERIAL_VERSION,
    drawPlanet
  };
}
