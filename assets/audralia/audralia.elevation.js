// /assets/audralia/audralia.elevation.js
// AUDRALIA_G1_TERRAIN_ELEVATION_AUTHORITY_TNT_v1
// New file.
// Parent elevation authority only.
// Purpose:
// - Add visible terrain depth to Audralia without changing identity.
// - Owns old ridge relief, highlands, lowlands, basins, valleys, coastal cliffs,
//   shelf escarpments, seafloor ridges, terrain shadow, and terrain highlight.
// - Consumes AUDRALIA_BACKSTORY, AUDRALIA_TECTONICS, and AUDRALIA_TOPOLOGY when available.
// - Does not own route, canvas, controls, runtime, vegetation, or final color.
// No trees. No bushes. No forest canopy. No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_TERRAIN_ELEVATION_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_TERRAIN_ELEVATION_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-g1-terrain-elevation-authority-v1";
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

  function sampleBackstory(u, v, longitude, latitude) {
    if (window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function") {
      return window.AUDRALIA_BACKSTORY.sampleIdentity(u, v, { longitude, latitude });
    }

    return {
      oceanBias: 0.7,
      weatheredAge: 1,
      cleanClimate: 1,
      homeWorldSignal: 0.8
    };
  }

  function sampleTectonics(u, v, longitude, latitude) {
    if (window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function") {
      return window.AUDRALIA_TECTONICS.sampleTectonics(u, v, { longitude, latitude });
    }

    const ridge = ridged(u * 1.5, v * 1.2, 211000, 5);
    const basin = 1 - fbm(u * 1.8, v * 1.4, 213000, 5);

    return {
      exposedLandPressure: clamp(ridge * 0.42 + fbm(u, v, 210000, 5) * 0.22 - basin * 0.12, 0, 1),
      shelfPressure: clamp(ridged(u * 2.2, v * 1.7, 212000, 5), 0, 1),
      basinPressure: clamp(basin, 0, 1),
      oldRidgePressure: ridge,
      islandPressure: clamp(ridged(u * 2.6, v * 2.0, 214000, 4), 0, 1),
      weatheredEdgePressure: clamp(fbm(u * 2.4, v * 2.0, 215000, 4), 0, 1),
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

  function sampleElevation(u, v, context = {}) {
    const longitude = Number.isFinite(context.longitude) ? context.longitude : (u - 0.5) * TAU;
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const isLand = context.isLand === true;
    const landSignal = clamp(context.landSignal || 0, 0, 1);
    const shelfSignal = clamp(context.shelf || 0, 0, 1);

    const backstory = sampleBackstory(u, v, longitude, latitude);
    const tectonics = sampleTectonics(u, v, longitude, latitude);
    const topology = sampleTopology(u, v, longitude, latitude);

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const oldRange = ridged(u * 1.75 + 0.08, v * 1.32 - 0.04, 510000, 6);
    const crossRange = ridged(u * 2.65 - 0.18, v * 2.05 + 0.13, 511000, 5);
    const foldedHighland = fbm(u * 1.35 + 0.11, v * 1.15 - 0.09, 512000, 6);
    const lowlandNoise = 1 - fbm(u * 1.95 - 0.15, v * 1.48 + 0.12, 513000, 5);
    const valleyCut = ridged(u * 3.25 + 0.22, v * 2.72 - 0.17, 514000, 4);
    const seaFloorRidge = ridged(u * 2.05 - 0.12, v * 1.72 + 0.08, 515000, 5);

    const ridge = clamp(
      oldRange * 0.48 +
        crossRange * 0.22 +
        tectonics.oldRidgePressure * 0.26 +
        tectonics.exposedLandPressure * 0.08,
      0,
      1
    );

    const highland = clamp(
      foldedHighland * 0.38 +
        ridge * 0.3 +
        topology.aboveSeaPressure * 0.22 +
        tectonics.weatheredEdgePressure * 0.1,
      0,
      1
    );

    const basin = clamp(
      topology.basin * 0.34 +
        tectonics.basinPressure * 0.3 +
        lowlandNoise * 0.28 -
        ridge * 0.08,
      0,
      1
    );

    const valley = clamp(
      valleyCut * 0.34 +
        basin * 0.28 +
        tectonics.weatheredEdgePressure * 0.18 -
        ridge * 0.08,
      0,
      1
    );

    const shelfEscarpment = clamp(
      shelfSignal * 0.38 +
        topology.shelf * 0.34 +
        tectonics.shelfPressure * 0.22 +
        tectonics.weatheredEdgePressure * 0.08,
      0,
      1
    );

    const coastalCliff = clamp(
      shelfEscarpment * 0.28 +
        tectonics.weatheredEdgePressure * 0.28 +
        crossRange * 0.16 +
        smoothstep(0.44, 0.62, landSignal) * 0.2,
      0,
      1
    );

    const elevation = isLand
      ? clamp(
          highland * 0.34 +
            ridge * 0.34 +
            tectonics.exposedLandPressure * 0.16 +
            foldedHighland * 0.12 -
            basin * 0.16 -
            valley * 0.1,
          0,
          1
        )
      : clamp(
          seaFloorRidge * 0.22 +
            topology.shelf * 0.2 -
            topology.belowSeaDepth * 0.3 -
            topology.basin * 0.16,
          0,
          1
        );

    const reliefShadow = clamp(
      basin * 0.28 +
        valley * 0.24 +
        coastalCliff * 0.2 +
        topology.belowSeaDepth * 0.12 -
        highland * 0.08,
      0,
      1
    );

    const reliefHighlight = clamp(
      ridge * 0.3 +
        highland * 0.24 +
        coastalCliff * 0.18 +
        seaFloorRidge * 0.08 -
        basin * 0.1,
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      elevation,
      ridge,
      highland,
      basin,
      valley,
      coastalCliff,
      shelfEscarpment,
      seaFloorRidge,
      reliefShadow,
      reliefHighlight,
      latitudeCold: latitudeAbs,
      weatheredAge: backstory.weatheredAge,
      terrainDepth: clamp(elevation * 0.52 + ridge * 0.2 + highland * 0.14 + coastalCliff * 0.14, 0, 1),
      oceanDepthRelief: clamp(topology.belowSeaDepth * 0.38 + seaFloorRidge * 0.16 + basin * 0.12, 0, 1),
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
      authority: "audralia-elevation-parent",
      consumesBackstory: Boolean(window.AUDRALIA_BACKSTORY),
      consumesTectonics: Boolean(window.AUDRALIA_TECTONICS),
      consumesTopology: Boolean(window.AUDRALIA_TOPOLOGY),
      g1ElevationActive: true,
      terrainDepthActive: true,
      ridgeReliefActive: true,
      basinValleyReliefActive: true,
      coastalCliffReliefActive: true,
      seaFloorReliefActive: true,
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

  window.AUDRALIA_ELEVATION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleElevation,
    getStatus
  });

  window.AUDRALIA_ELEVATION_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaElevationLoaded = "true";
  document.documentElement.dataset.audraliaElevationContract = CONTRACT;
  document.documentElement.dataset.audraliaElevationReceipt = RECEIPT;
  document.documentElement.dataset.audraliaG1ElevationActive = "true";
  document.documentElement.dataset.audraliaTerrainDepthActive = "true";
  document.documentElement.dataset.audraliaNoTrees = "true";
  document.documentElement.dataset.audraliaNoBushes = "true";
  document.documentElement.dataset.audraliaNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
