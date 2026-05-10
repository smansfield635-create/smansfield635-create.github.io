// /assets/hearth/hearth.terrain.extension.js
// HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_TNT_v6_CACHE_RENEWAL_v8
// Full-file replacement.
// Terrain-extension authority only.
// Owns coastline fracture, islands, terrain base, and terrain fingerprints.
// Does not own elevation. Elevation is delegated to /assets/hearth/hearth.elevation.js.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_TNT_v6_CACHE_RENEWAL_v8";
  const RECEIPT = "HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_RECEIPT_v8";
  const PREVIOUS_CONTRACT = "HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_TNT_v6_CACHE_RENEWAL_v7";
  const VERSION = "2026-05-10.hearth-terrain-base-cache-renewal-v8";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const ISLAND_SEEDS = Object.freeze([
    { key: "north-crown-mass", lat: 69 * DEG, lon: -76 * DEG, rx: 6 * DEG, ry: 2.4 * DEG, angle: -20 * DEG, power: 0.42 },
    { key: "north-crown-mass", lat: 72 * DEG, lon: 44 * DEG, rx: 5 * DEG, ry: 2.0 * DEG, angle: 18 * DEG, power: 0.34 },
    { key: "equatorial-great-mass", lat: 21 * DEG, lon: 66 * DEG, rx: 5.5 * DEG, ry: 2.3 * DEG, angle: -26 * DEG, power: 0.32 },
    { key: "equatorial-great-mass", lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, power: 0.34 },
    { key: "northwest-temperate-mass", lat: 33 * DEG, lon: -69 * DEG, rx: 5.4 * DEG, ry: 2.5 * DEG, angle: 14 * DEG, power: 0.30 },
    { key: "northeast-broken-shelf-mass", lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, power: 0.46 },
    { key: "northeast-broken-shelf-mass", lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, power: 0.38 },
    { key: "northeast-broken-shelf-mass", lat: 25 * DEG, lon: 130 * DEG, rx: 4.8 * DEG, ry: 1.9 * DEG, angle: -8 * DEG, power: 0.30 },
    { key: "southeast-warm-mass", lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, power: 0.34 },
    { key: "southeast-warm-mass", lat: -41 * DEG, lon: 119 * DEG, rx: 5.2 * DEG, ry: 2.1 * DEG, angle: -16 * DEG, power: 0.28 },
    { key: "southwest-ridge-mass", lat: -23 * DEG, lon: -151 * DEG, rx: 4.8 * DEG, ry: 1.8 * DEG, angle: -44 * DEG, power: 0.26 },
    { key: "southwest-ridge-mass", lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2.0 * DEG, angle: 11 * DEG, power: 0.30 },
    { key: "south-transitional-mass", lat: -49 * DEG, lon: 2 * DEG, rx: 5.8 * DEG, ry: 2.0 * DEG, angle: 19 * DEG, power: 0.31 },
    { key: "south-transitional-mass", lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, power: 0.32 }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = u * s;
    const y = v * s;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.64;
    let scale = 8;

    for (let i = 0; i < 6; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function angularIslandField(lon, lat, seed) {
    const dx = wrapPi(lon - seed.lon) * Math.cos(seed.lat);
    const dy = lat - seed.lat;
    const ca = Math.cos(seed.angle);
    const sa = Math.sin(seed.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / seed.rx;
    const ny = y / seed.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);
    const chip = Math.sin(theta * 5.0 + seed.power * 8.7) * 0.15 + Math.sin(theta * 9.0 - seed.power * 4.1) * 0.08;

    return seed.power + chip - dist;
  }

  function edgeBand(field) {
    return smoothstep(0.04, 0.96, 1 - clamp(Math.abs(field) * 8.5, 0, 1));
  }

  function sampleIslandField(u, v, base = {}) {
    const lon = Number.isFinite(base.lon) ? base.lon : (u - 0.5) * TAU;
    const lat = Number.isFinite(base.lat) ? base.lat : (0.5 - v) * Math.PI;

    let best = {
      field: -1,
      key: "",
      islandChain: false,
      islandFragment: false,
      islandEdge: 0
    };

    for (const seed of ISLAND_SEEDS) {
      const raw = angularIslandField(lon, lat, seed);
      const edgeChip = (noise(u + seed.power * 0.13, v - seed.power * 0.19, 128, 14000) - 0.5) * 0.12;
      const field = raw + edgeChip;

      if (field > best.field) {
        best = {
          field,
          key: seed.key,
          islandChain: field > -0.05,
          islandFragment: field > 0,
          islandEdge: smoothstep(-0.08, 0.05, field) * (1 - smoothstep(0.10, 0.24, field))
        };
      }
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      ...best,
      islandChainLoaded: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sampleCoastlineModifier(u, v, base = {}) {
    const id = Number.isFinite(base.primaryMassId) ? base.primaryMassId : 0;
    const key = base.primaryMassKey || "";
    const field = Number.isFinite(base.field) ? base.field : 0;
    const theta = Number.isFinite(base.theta) ? base.theta : 0;
    const nx = Number.isFinite(base.nx) ? base.nx : 0;
    const ny = Number.isFinite(base.ny) ? base.ny : 0;
    const band = edgeBand(field);

    const hardSaw = Math.sign(Math.sin(theta * (6 + id) + nx * 5.6 - ny * 4.1)) * 0.055;
    const chipA = smoothstep(0.49, 0.94, noise(u + id * 0.137, v - id * 0.119, 128, 15000 + id * 149));
    const chipB = smoothstep(0.42, 0.92, ridged(u + id * 0.071, v - id * 0.053, 16000 + id * 173));
    const cliffCut = band * chipA * 0.15;
    const shardCut = band * chipB * 0.13;

    let fieldDelta = band * hardSaw - cliffCut - shardCut;

    if (key === "northeast-broken-shelf-mass") {
      fieldDelta -= band * smoothstep(0.36, 0.88, chipA + chipB * 0.5) * 0.14;
    }

    if (key === "north-crown-mass") {
      fieldDelta -= band * Math.abs(Math.sin(theta * 4.0 + chipB * 3.0)) * 0.13;
    }

    if (key === "southwest-ridge-mass") {
      fieldDelta -= band * smoothstep(0.36, 0.88, chipB) * 0.11;
    }

    if (key === "equatorial-great-mass") {
      fieldDelta -= band * smoothstep(0.48, 0.90, noise(u - 0.29, v + 0.22, 64, 17000)) * smoothstep(0.42, 0.92, u) * 0.12;
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      fieldDelta,
      hardJaggedEdge: clamp(band * (0.42 + chipA * 0.30 + chipB * 0.28), 0, 1),
      rigidCoastline: true,
      cliffCut: clamp(cliffCut, 0, 1),
      shardCut: clamp(shardCut, 0, 1),
      silhouetteBreakerActive: true,
      coastlineFractureLoaded: true,
      islandChainLoaded: true,
      roundLobeRead: false,
      ovalPatchRead: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sampleTerrain(u, v, base = {}) {
    const modifier = sampleCoastlineModifier(u, v, base);
    const island = sampleIslandField(u, v, base);
    const id = Number.isFinite(base.primaryMassId) ? base.primaryMassId : 0;
    const baseTexture = ridged(u + id * 0.047, v - id * 0.041, 23000 + id * 239);
    const grainTexture = noise(u + id * 0.091, v - id * 0.067, 192, 24000 + id * 257);

    return Object.freeze({
      terrainContract: CONTRACT,
      terrainReceipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      terrainBaseLoaded: true,
      coastlineFractureLoaded: true,
      silhouetteBreakerActive: true,
      islandChainLoaded: true,
      hardJaggedEdge: modifier.hardJaggedEdge,
      rigidCoastline: true,
      cliffCut: modifier.cliffCut,
      shardCut: modifier.shardCut,
      islandChain: island.islandChain,
      islandFragment: island.islandFragment,
      islandField: island.field,
      islandKey: island.key,
      islandEdge: island.islandEdge || 0,
      baseTexture,
      grainTexture,
      ownsTangibleElevation: false,
      elevationDelegatedTo: "/assets/hearth/hearth.elevation.js",
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "terrain-base-coastline-island-fingerprint",
      terrainBaseLoaded: true,
      coastlineFractureLoaded: true,
      silhouetteBreakerActive: true,
      islandChainLoaded: true,
      hardJaggedEdges: true,
      rigidCoastline: true,
      terrainFingerprintCount: 7,
      ownsTangibleElevation: false,
      elevationDelegatedTo: "/assets/hearth/hearth.elevation.js",
      roundLobeRead: false,
      ovalPatchRead: false,
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_TERRAIN_EXTENSION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleCoastlineModifier,
    sampleIslandField,
    sampleTerrain,
    getStatus
  });

  window.HEARTH_TERRAIN_EXTENSION_RECEIPT = getStatus();

  document.documentElement.dataset.hearthTerrainExtensionLoaded = "true";
  document.documentElement.dataset.hearthTerrainExtensionContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainExtensionReceipt = RECEIPT;
  document.documentElement.dataset.hearthTerrainBaseLoaded = "true";
  document.documentElement.dataset.hearthOwnsTangibleElevation = "false";
  document.documentElement.dataset.hearthElevationDelegatedTo = "/assets/hearth/hearth.elevation.js";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
