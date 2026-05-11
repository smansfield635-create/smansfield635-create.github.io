// /assets/audralia/audralia.beaches.js
// AUDRALIA_G1_BASELINE_BEACH_AUTHORITY_TNT_v2
// Full-file replacement.
// Beach authority only.
// Purpose:
// - Preserve accepted Audralia G1 visible-landmass baseline.
// - Add readable beaches without changing land/water footprint.
// - Beaches remain sea-level edge material.
// - Raised terrain remains owned by landrise/topology/canvas.
// - Adds sand beaches, wet beaches, tidal flats, coastal shelves, deltas, lagoons, and beach breaks.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_BASELINE_BEACH_AUTHORITY_TNT_v2";
  const RECEIPT = "AUDRALIA_G1_BASELINE_BEACH_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_BEACH_TO_LAND_RISE_BEACH_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.audralia-g1-baseline-beach-authority-v2";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
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
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.62;
    let scale = 6.5;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function sampleBeach(u, v, context = {}) {
    const landSignal = clamp(context.landSignal || 0, 0, 1);
    const islandSignal = clamp(context.islandSignal || 0, 0, 1);
    const shelf = clamp(context.shelf || 0, 0, 1);
    const elevation = clamp(context.elevation || 0, 0, 1);
    const isLand = Boolean(context.isLand);

    const exposure = clamp(
      Math.max(
        landSignal,
        islandSignal * 0.88,
        isLand ? 0.5 : 0
      ),
      0,
      1
    );

    const coastNoise = ridged(u * 5.7 + 0.12, v * 4.3 - 0.18, 1810000, 5);
    const sandNoise = fbm(u * 3.2 - 0.08, v * 2.5 + 0.14, 1811000, 5);
    const wetNoise = fbm(u * 2.6 + 0.19, v * 2.2 - 0.11, 1812000, 4);
    const lagoonNoise = ridged(u * 4.8 - 0.21, v * 3.6 + 0.09, 1813000, 4);
    const deltaNoise = ridged(u * 7.4 + 0.04, v * 5.8 - 0.16, 1814000, 4);

    const beachBand = clamp(
      smoothstep(0.36, 0.49, exposure) *
        (1 - smoothstep(0.61, 0.76, exposure)) *
        (0.72 + coastNoise * 0.28),
      0,
      1
    );

    const beachSand = clamp(
      beachBand *
        (0.68 + sandNoise * 0.28) *
        (1 - smoothstep(0.72, 0.96, elevation) * 0.35),
      0,
      1
    );

    const wetBeach = clamp(
      beachBand *
        smoothstep(0.36, 0.82, shelf + wetNoise * 0.28) *
        (1 - smoothstep(0.7, 0.92, elevation)),
      0,
      1
    );

    const tidalFlat = clamp(
      beachBand *
        smoothstep(0.48, 0.86, shelf + lagoonNoise * 0.18) *
        (1 - smoothstep(0.64, 0.9, exposure)),
      0,
      1
    );

    const coastalShelf = clamp(
      smoothstep(0.42, 0.88, shelf) *
        smoothstep(0.24, 0.72, coastNoise + islandSignal * 0.12) *
        (1 - smoothstep(0.74, 0.94, elevation)),
      0,
      1
    );

    const lagoon = clamp(
      beachBand *
        smoothstep(0.6, 0.9, lagoonNoise * 0.55 + shelf * 0.32 + islandSignal * 0.12) *
        (1 - smoothstep(0.58, 0.78, exposure)),
      0,
      1
    );

    const delta = clamp(
      beachBand *
        smoothstep(0.68, 0.92, deltaNoise * 0.62 + wetNoise * 0.22 + shelf * 0.12) *
        smoothstep(0.42, 0.78, landSignal + islandSignal * 0.22),
      0,
      1
    );

    const beachBreak = clamp(
      beachBand *
        smoothstep(0.62, 0.9, coastNoise * 0.64 + deltaNoise * 0.22) *
        (1 - smoothstep(0.68, 0.9, elevation)),
      0,
      1
    );

    const duneRise = clamp(
      beachSand *
        smoothstep(0.5, 0.86, sandNoise * 0.58 + exposure * 0.24) *
        (1 - wetBeach * 0.62) *
        (1 - tidalFlat * 0.48),
      0,
      1
    );

    const coastalWetland = clamp(
      beachBand *
        smoothstep(0.52, 0.84, wetNoise * 0.42 + shelf * 0.24 + tidalFlat * 0.22) *
        (1 - smoothstep(0.62, 0.86, elevation)),
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      beachBand,
      beachSand,
      wetBeach,
      tidalFlat,
      coastalShelf,
      lagoon,
      delta,
      beachBreak,
      duneRise,
      coastalWetland,
      beachRemainsSeaLevel: true,
      preservesLandWaterFootprint: true,
      ownsLandShape: false,
      ownsLandrise: false,
      ownsTerrain: false,
      ownsCanvas: false,
      ownsRoute: false,
      trees: false,
      bushes: false,
      forestCanopy: false,
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
      authority: "audralia-g1-baseline-beach-authority",
      beaches: true,
      sandBeaches: true,
      wetBeaches: true,
      tidalFlats: true,
      coastalShelves: true,
      lagoons: true,
      deltas: true,
      beachBreaks: true,
      beachRemainsSeaLevel: true,
      preservesLandWaterFootprint: true,
      ownsLandShape: false,
      ownsLandrise: false,
      ownsCanvas: false,
      ownsRoute: false,
      trees: false,
      bushes: false,
      forestCanopy: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_BEACHES = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleBeach,
    getStatus
  });

  window.AUDRALIA_BEACHES_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaBeachesLoaded = "true";
  document.documentElement.dataset.audraliaBeachesContract = CONTRACT;
  document.documentElement.dataset.audraliaBeachesReceipt = RECEIPT;
  document.documentElement.dataset.audraliaSandBeaches = "true";
  document.documentElement.dataset.audraliaWetBeaches = "true";
  document.documentElement.dataset.audraliaTidalFlats = "true";
  document.documentElement.dataset.audraliaCoastalShelves = "true";
  document.documentElement.dataset.audraliaLagoons = "true";
  document.documentElement.dataset.audraliaDeltas = "true";
  document.documentElement.dataset.audraliaBeachBreaks = "true";
  document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
  document.documentElement.dataset.audraliaPreservesLandWaterFootprint = "true";
  document.documentElement.dataset.audraliaTrees = "false";
  document.documentElement.dataset.audraliaBushes = "false";
  document.documentElement.dataset.audraliaForestCanopy = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
