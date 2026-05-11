// /assets/audralia/audralia.beaches.js
// AUDRALIA_G1_BEACH_TO_LAND_RISE_AUTHORITY_TNT_v1
// New file.
// Parent beach/coast authority only.
// Purpose:
// - Treat the current visible strips as sea-level beach/shelf exposure.
// - Attach above-sea land behind those beaches.
// - Separate beach, coast, shelf, tidal flats, and raised inland terrain.
// - Does not own route, canvas, controls, runtime, vegetation, or final color.
// No trees. No bushes. No forest canopy. No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_BEACH_TO_LAND_RISE_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_BEACH_TO_LAND_RISE_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-g1-beach-to-land-rise-authority-v1";
  const TAU = Math.PI * 2;

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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
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

  function sampleTectonics(u, v, longitude, latitude) {
    if (window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function") {
      return window.AUDRALIA_TECTONICS.sampleTectonics(u, v, { longitude, latitude });
    }

    return {
      exposedLandPressure: ridged(u * 1.5, v * 1.2, 211000, 5),
      shelfPressure: ridged(u * 2.2, v * 1.7, 212000, 5),
      basinPressure: 1 - fbm(u * 1.8, v * 1.4, 213000, 5),
      oldRidgePressure: ridged(u * 1.5, v * 1.2, 211000, 5),
      islandPressure: ridged(u * 2.6, v * 2.0, 214000, 4),
      weatheredEdgePressure: fbm(u * 2.4, v * 2.0, 215000, 4),
      oceanPressure: 0.72
    };
  }

  function sampleTopology(u, v, longitude, latitude) {
    if (window.AUDRALIA_TOPOLOGY && typeof window.AUDRALIA_TOPOLOGY.sampleTopology === "function") {
      return window.AUDRALIA_TOPOLOGY.sampleTopology(u, v, { longitude, latitude });
    }

    const tectonics = sampleTectonics(u, v, longitude, latitude);

    return {
      landEligibility: tectonics.exposedLandPressure,
      islandEligibility: tectonics.islandPressure,
      shelf: tectonics.shelfPressure,
      basin: tectonics.basinPressure,
      belowSeaDepth: tectonics.oceanPressure,
      aboveSeaPressure: tectonics.exposedLandPressure,
      subterraneanDepth: 0.45
    };
  }

  function sampleElevation(u, v, longitude, latitude, context) {
    if (window.AUDRALIA_ELEVATION && typeof window.AUDRALIA_ELEVATION.sampleElevation === "function") {
      return window.AUDRALIA_ELEVATION.sampleElevation(u, v, {
        longitude,
        latitude,
        isLand: context.isLand === true,
        landSignal: context.landSignal || 0,
        shelf: context.shelf || 0
      });
    }

    return {
      elevation: ridged(u * 2.15, v * 1.62, 440000, 5),
      ridge: ridged(u * 1.75, v * 1.32, 510000, 5),
      highland: fbm(u * 1.35, v * 1.15, 512000, 5),
      basin: 1 - fbm(u * 1.95, v * 1.48, 513000, 5),
      valley: ridged(u * 3.25, v * 2.72, 514000, 4),
      coastalCliff: context.shelf || 0,
      shelfEscarpment: context.shelf || 0,
      reliefShadow: 0.35,
      reliefHighlight: 0.35,
      terrainDepth: 0.4
    };
  }

  function sampleBeach(u, v, context = {}) {
    const longitude = Number.isFinite(context.longitude) ? context.longitude : (u - 0.5) * TAU;
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;

    const landSignal = clamp(context.landSignal || 0, 0, 1);
    const islandSignal = clamp(context.islandSignal || 0, 0, 1);
    const shelf = clamp(context.shelf || 0, 0, 1);
    const currentIsLand = context.isLand === true;

    const tectonics = sampleTectonics(u, v, longitude, latitude);
    const topology = sampleTopology(u, v, longitude, latitude);
    const elevation = sampleElevation(u, v, longitude, latitude, {
      isLand: currentIsLand,
      landSignal,
      shelf
    });

    const shoreNoise = ridged(u * 3.15 + 0.17, v * 2.72 - 0.09, 610000, 5);
    const duneNoise = fbm(u * 2.2 - 0.11, v * 1.8 + 0.07, 611000, 5);
    const backshoreNoise = fbm(u * 1.35 + 0.06, v * 1.2 - 0.13, 612000, 5);

    const existingSeaLevelExposure = clamp(
      Math.max(landSignal, islandSignal * 0.82) * 0.6 +
        shelf * 0.22 +
        tectonics.shelfPressure * 0.14,
      0,
      1
    );

    const beachBand = clamp(
      smoothstep(0.46, 0.68, existingSeaLevelExposure) *
        (1 - smoothstep(0.76, 0.96, elevation.elevation + tectonics.oldRidgePressure * 0.1)) *
        (0.72 + shoreNoise * 0.28),
      0,
      1
    );

    const tidalFlat = clamp(
      beachBand * 0.44 +
        shelf * 0.24 +
        topology.shelf * 0.16 -
        elevation.elevation * 0.12,
      0,
      1
    );

    const attachedLandBias = clamp(
      existingSeaLevelExposure * 0.36 +
        topology.aboveSeaPressure * 0.24 +
        tectonics.exposedLandPressure * 0.22 +
        elevation.highland * 0.14 +
        backshoreNoise * 0.16 -
        tectonics.oceanPressure * 0.08,
      0,
      1
    );

    const aboveSeaLand = clamp(
      smoothstep(0.54, 0.82, attachedLandBias) +
        smoothstep(0.58, 0.86, elevation.elevation) * 0.22 +
        smoothstep(0.62, 0.9, tectonics.oldRidgePressure) * 0.16 -
        beachBand * 0.18,
      0,
      1
    );

    const inlandRise = clamp(
      aboveSeaLand * 0.46 +
        elevation.elevation * 0.28 +
        elevation.highland * 0.18 +
        tectonics.oldRidgePressure * 0.16 -
        tidalFlat * 0.12,
      0,
      1
    );

    const duneRise = clamp(
      beachBand * (0.28 + duneNoise * 0.26) +
        tidalFlat * 0.08,
      0,
      1
    );

    const beachSand = clamp(
      beachBand * 0.76 +
        tidalFlat * 0.32 +
        smoothstep(0.55, 0.86, shoreNoise) * beachBand * 0.2,
      0,
      1
    );

    const coastalWetland = clamp(
      tidalFlat * 0.3 +
        topology.basin * 0.22 +
        elevation.basin * 0.24 -
        inlandRise * 0.12,
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      existingSeaLevelExposure,
      beachBand,
      beachSand,
      tidalFlat,
      coastalWetland,
      attachedLandBias,
      aboveSeaLand,
      inlandRise,
      duneRise,
      landAttachActive: true,
      seaLevelStripsBecomeBeach: true,
      raisedLandBehindBeach: true,
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
      version: VERSION,
      authority: "audralia-beach-to-land-rise-parent",
      consumesTectonics: Boolean(window.AUDRALIA_TECTONICS),
      consumesTopology: Boolean(window.AUDRALIA_TOPOLOGY),
      consumesElevation: Boolean(window.AUDRALIA_ELEVATION),
      seaLevelStripsBecomeBeach: true,
      raisedLandBehindBeach: true,
      landAttachActive: true,
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

  window.AUDRALIA_BEACHES = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleBeach,
    getStatus
  });

  window.AUDRALIA_BEACHES_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaBeachesLoaded = "true";
  document.documentElement.dataset.audraliaBeachesContract = CONTRACT;
  document.documentElement.dataset.audraliaBeachesReceipt = RECEIPT;
  document.documentElement.dataset.audraliaSeaLevelStripsBecomeBeach = "true";
  document.documentElement.dataset.audraliaRaisedLandBehindBeach = "true";
  document.documentElement.dataset.audraliaLandAttachActive = "true";
  document.documentElement.dataset.audraliaNoTrees = "true";
  document.documentElement.dataset.audraliaNoBushes = "true";
  document.documentElement.dataset.audraliaNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
