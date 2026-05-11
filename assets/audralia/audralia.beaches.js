// /assets/audralia/audralia.beaches.js
// AUDRALIA_G1_THIN_COASTAL_BEACH_RESTRAINT_BEACH_AUTHORITY_TNT_v3
// Full-file replacement.
// Beach authority only.
// Purpose:
// - Preserve accepted Audralia G1 visible-landmass baseline.
// - Beaches are thin coastal-edge material only.
// - Beaches cannot create land.
// - Beaches cannot recolor interior plains.
// - Beaches cannot create rectangles.
// - Beaches cannot override the accepted land/water footprint.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_THIN_COASTAL_BEACH_RESTRAINT_BEACH_AUTHORITY_TNT_v3";
  const RECEIPT = "AUDRALIA_G1_THIN_COASTAL_BEACH_RESTRAINT_BEACH_AUTHORITY_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_BASELINE_BEACH_AUTHORITY_TNT_v2";
  const VERSION = "2026-05-10.audralia-g1-thin-coastal-beach-restraint-authority-v3";

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

    const exposure = clamp(Math.max(landSignal, islandSignal * 0.88), 0, 1);

    const coastNoise = ridged(u * 7.2 + 0.12, v * 5.4 - 0.18, 1910000, 5);
    const sandNoise = fbm(u * 5.8 - 0.08, v * 4.4 + 0.14, 1911000, 5);
    const wetNoise = fbm(u * 4.8 + 0.19, v * 3.9 - 0.11, 1912000, 4);
    const lagoonNoise = ridged(u * 6.4 - 0.21, v * 4.9 + 0.09, 1913000, 4);
    const deltaNoise = ridged(u * 9.6 + 0.04, v * 7.2 - 0.16, 1914000, 4);

    const coastThreshold = smoothstep(0.365, 0.49, exposure) * (1 - smoothstep(0.505, 0.64, exposure));
    const shelfGate = smoothstep(0.28, 0.78, shelf);
    const elevationGate = 1 - smoothstep(0.48, 0.82, elevation);

    const beachBand = clamp(
      coastThreshold *
        (0.34 + shelfGate * 0.66) *
        (0.76 + coastNoise * 0.24) *
        elevationGate,
      0,
      1
    );

    const beachSand = clamp(
      beachBand *
        (0.58 + sandNoise * 0.28 + coastNoise * 0.1) *
        (1 - smoothstep(0.62, 0.9, elevation) * 0.45),
      0,
      1
    );

    const wetBeach = clamp(
      beachBand *
        smoothstep(0.42, 0.82, shelf + wetNoise * 0.22) *
        (1 - smoothstep(0.56, 0.82, elevation)),
      0,
      1
    );

    const tidalFlat = clamp(
      beachBand *
        smoothstep(0.5, 0.86, shelf + lagoonNoise * 0.12) *
        (1 - smoothstep(0.5, 0.66, exposure)),
      0,
      1
    );

    const coastalShelf = clamp(
      smoothstep(0.5, 0.88, shelf) *
        coastThreshold *
        (0.42 + coastNoise * 0.28) *
        (1 - smoothstep(0.58, 0.86, elevation)),
      0,
      1
    );

    const lagoon = clamp(
      beachBand *
        smoothstep(0.68, 0.92, lagoonNoise * 0.58 + shelf * 0.26 + islandSignal * 0.08) *
        (1 - smoothstep(0.49, 0.62, exposure)),
      0,
      1
    );

    const delta = clamp(
      beachBand *
        smoothstep(0.72, 0.94, deltaNoise * 0.62 + wetNoise * 0.18 + shelf * 0.1) *
        smoothstep(0.35, 0.58, landSignal + islandSignal * 0.16),
      0,
      1
    );

    const beachBreak = clamp(
      beachBand *
        smoothstep(0.68, 0.92, coastNoise * 0.68 + deltaNoise * 0.18) *
        (1 - smoothstep(0.58, 0.82, elevation)),
      0,
      1
    );

    const duneRise = clamp(
      beachSand *
        smoothstep(0.58, 0.88, sandNoise * 0.62 + exposure * 0.18) *
        (1 - wetBeach * 0.66) *
        (1 - tidalFlat * 0.52),
      0,
      1
    );

    const coastalWetland = clamp(
      beachBand *
        smoothstep(0.58, 0.86, wetNoise * 0.44 + shelf * 0.22 + tidalFlat * 0.18) *
        (1 - smoothstep(0.55, 0.78, elevation)),
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
      thinCoastalEdgeOnly: true,
      beachRemainsSeaLevel: true,
      preservesLandWaterFootprint: true,
      canCreateLand: false,
      recolorsInteriorLand: false,
      createsRectangles: false,
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
      authority: "audralia-g1-thin-coastal-beach-restraint-authority",
      beaches: true,
      sandBeaches: true,
      wetBeaches: true,
      tidalFlats: true,
      coastalShelves: true,
      lagoons: true,
      deltas: true,
      beachBreaks: true,
      thinCoastalEdgeOnly: true,
      beachRemainsSeaLevel: true,
      preservesLandWaterFootprint: true,
      canCreateLand: false,
      recolorsInteriorLand: false,
      createsRectangles: false,
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
  document.documentElement.dataset.audraliaThinCoastalEdgeOnly = "true";
  document.documentElement.dataset.audraliaSandBeaches = "true";
  document.documentElement.dataset.audraliaWetBeaches = "true";
  document.documentElement.dataset.audraliaTidalFlats = "true";
  document.documentElement.dataset.audraliaCoastalShelves = "true";
  document.documentElement.dataset.audraliaLagoons = "true";
  document.documentElement.dataset.audraliaDeltas = "true";
  document.documentElement.dataset.audraliaBeachBreaks = "true";
  document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
  document.documentElement.dataset.audraliaPreservesLandWaterFootprint = "true";
  document.documentElement.dataset.audraliaBeachCanCreateLand = "false";
  document.documentElement.dataset.audraliaBeachRecolorsInteriorLand = "false";
  document.documentElement.dataset.audraliaBeachCreatesRectangles = "false";
  document.documentElement.dataset.audraliaTrees = "false";
  document.documentElement.dataset.audraliaBushes = "false";
  document.documentElement.dataset.audraliaForestCanopy = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
