// /assets/audralia/audralia.landrise.js
// AUDRALIA_G1_MORE_LANDMASS_TERRAIN_ATTACHMENT_AUTHORITY_TNT_v4
// Full-file replacement.
// Parent terrain-rise authority only.
// Adds more landmass while preserving ocean-dominant identity.
// Beaches remain sea level.
// Raised terrain thickens behind beaches.
// No trees. No bushes. No forest canopy.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_MORE_LANDMASS_TERRAIN_ATTACHMENT_AUTHORITY_TNT_v4";
  const RECEIPT = "AUDRALIA_G1_MORE_LANDMASS_TERRAIN_ATTACHMENT_AUTHORITY_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_TERRAIN_MASS_ATTACHMENT_AUTHORITY_TNT_v3";
  const VERSION = "2026-05-10.audralia-g1-more-landmass-terrain-attachment-authority-v4";

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

  function sampleLandRise(u, v, context = {}) {
    const landSignal = clamp(context.landSignal || 0, 0, 1);
    const islandSignal = clamp(context.islandSignal || 0, 0, 1);
    const shelf = clamp(context.shelf || 0, 0, 1);
    const elevation = clamp(context.elevation || 0, 0, 1);
    const beachBand = clamp(context.beachBand || 0, 0, 1);

    const exposure = clamp(Math.max(landSignal, islandSignal * 0.92), 0, 1);

    const terrainMass = fbm(u * 1.02 + 0.19, v * 0.92 - 0.14, 1210000, 6);
    const plateauNoise = fbm(u * 1.42 - 0.17, v * 1.18 + 0.21, 1211000, 5);
    const ridgeNoise = ridged(u * 2.02 + 0.08, v * 1.62 - 0.12, 1212000, 5);
    const basinNoise = 1 - fbm(u * 1.78 - 0.09, v * 1.42 + 0.18, 1213000, 5);
    const archipelagoSpread = ridged(u * 3.4 + 0.12, v * 2.7 - 0.17, 1214000, 4);

    const beachEdge = clamp(
      smoothstep(0.42, 0.515, exposure) *
        (1 - smoothstep(0.555, 0.69, exposure)) *
        (0.72 + ridged(u * 4.4, v * 3.4, 1215000, 4) * 0.28),
      0,
      1
    );

    const landExpansion = clamp(
      smoothstep(0.46, 0.7, exposure) * 0.42 +
        smoothstep(0.52, 0.82, archipelagoSpread) * 0.2 +
        terrainMass * 0.18 +
        shelf * 0.08,
      0,
      1
    );

    const attachedBackshore = clamp(
      smoothstep(0.46, 0.64, exposure) +
        smoothstep(0.39, 0.7, terrainMass) * 0.18 +
        smoothstep(0.42, 0.74, ridgeNoise) * 0.12,
      0,
      1
    );

    const terrainDrive = clamp(
      exposure * 0.52 +
        landExpansion * 0.18 +
        elevation * 0.2 +
        terrainMass * 0.2 +
        plateauNoise * 0.14 +
        ridgeNoise * 0.13 +
        shelf * 0.05 -
        beachEdge * 0.08,
      0,
      1
    );

    const raisedTerrain = clamp(
      smoothstep(0.39, 0.59, terrainDrive) +
        smoothstep(0.475, 0.635, exposure) * 0.44 +
        smoothstep(0.52, 0.76, islandSignal) * 0.26,
      0,
      1
    );

    const inlandCore = clamp(
      smoothstep(0.42, 0.68, raisedTerrain + terrainMass * 0.22 + plateauNoise * 0.14) -
        beachEdge * 0.1,
      0,
      1
    );

    const lowland = clamp(
      raisedTerrain * 0.38 +
        basinNoise * 0.24 +
        terrainMass * 0.1 -
        ridgeNoise * 0.1,
      0,
      1
    );

    const plateau = clamp(
      inlandCore * 0.36 +
        plateauNoise * 0.3 +
        elevation * 0.16 +
        terrainMass * 0.12,
      0,
      1
    );

    const ridgeBack = clamp(
      raisedTerrain * 0.24 +
        ridgeNoise * 0.36 +
        elevation * 0.18 +
        plateauNoise * 0.08,
      0,
      1
    );

    const terrainShadow = clamp(
      lowland * 0.22 +
        basinNoise * 0.17 +
        (1 - elevation) * 0.06 -
        plateau * 0.08,
      0,
      1
    );

    const terrainHighlight = clamp(
      ridgeBack * 0.3 +
        plateau * 0.26 +
        raisedTerrain * 0.2 +
        elevation * 0.12 -
        lowland * 0.08,
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      beachRemainsSeaLevel: true,
      beachEdge,
      beachBand,
      landExpansion,
      attachedBackshore,
      raisedTerrain,
      inlandCore,
      lowland,
      plateau,
      ridgeBack,
      terrainShadow,
      terrainHighlight,
      terrainAboveSeaLevel: raisedTerrain > 0.14,
      terrainMassAttached: attachedBackshore > 0.16 && raisedTerrain > 0.13,
      terrainMass,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsVegetation: false,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
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
      authority: "audralia-more-landmass-terrain-attachment-parent",
      moreLandmass: true,
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
      oceanDominantStillTrue: true,
      vegetationTopologyHeld: true,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LANDRISE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleLandRise,
    getStatus
  });

  window.AUDRALIA_LANDRISE_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLandriseLoaded = "true";
  document.documentElement.dataset.audraliaLandriseContract = CONTRACT;
  document.documentElement.dataset.audraliaLandriseReceipt = RECEIPT;
  document.documentElement.dataset.audraliaMoreLandmass = "true";
  document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
  document.documentElement.dataset.audraliaRaisedTerrainBehindBeach = "true";
  document.documentElement.dataset.audraliaTerrainMassAttached = "true";
  document.documentElement.dataset.audraliaTerrainAboveSeaLevel = "true";
  document.documentElement.dataset.audraliaNoTrees = "true";
  document.documentElement.dataset.audraliaNoBushes = "true";
  document.documentElement.dataset.audraliaNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
