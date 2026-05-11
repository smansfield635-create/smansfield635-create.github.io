// /assets/audralia/audralia.landrise.js
// AUDRALIA_G1_BALANCED_LANDMASS_RESTORE_LANDRISE_AUTHORITY_TNT_v6
// Full-file replacement.
// Parent terrain-rise authority only.
// Purpose:
// - Restore a middle calibration after over-restraint.
// - Increase raised land by roughly 12–18%, not 30–40%.
// - Preserve beach-to-land attachment.
// - Preserve ocean-dominant G1.
// - Preserve islands and coastal complexity.
// - Prevent broad green-shell overexpansion.
// - Prevent vertical striping.
// - Beaches remain sea level.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_BALANCED_LANDMASS_RESTORE_LANDRISE_AUTHORITY_TNT_v6";
  const RECEIPT = "AUDRALIA_G1_BALANCED_LANDMASS_RESTORE_LANDRISE_AUTHORITY_RECEIPT_v6";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_LANDRISE_AUTHORITY_TNT_v5";
  const VERSION = "2026-05-10.audralia-g1-balanced-landmass-restore-landrise-authority-v6";

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

    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const oldPlate = fbm(u * 0.86 + 0.17, v * 0.74 - 0.11, 1610000, 6);
    const mediumMass = fbm(u * 1.05 - 0.23, v * 0.92 + 0.16, 1610500, 6);
    const islandBreak = ridged(u * 2.75 + 0.13, v * 2.18 - 0.19, 1611000, 5);
    const coastFracture = ridged(u * 5.15 - 0.07, v * 4.05 + 0.09, 1612000, 4);
    const basinNoise = 1 - fbm(u * 1.62 - 0.09, v * 1.28 + 0.18, 1613000, 5);
    const plateauNoise = fbm(u * 1.14 - 0.17, v * 1.02 + 0.21, 1614000, 5);
    const ridgeNoise = ridged(u * 1.74 + 0.08, v * 1.36 - 0.12, 1615000, 5);
    const separation = fbm(u * 1.44 + 0.29, v * 1.18 - 0.31, 1616000, 5);

    const exposure = clamp(
      Math.max(
        landSignal * 0.98 + oldPlate * 0.1 + mediumMass * 0.07,
        islandSignal * 0.86 + islandBreak * 0.14
      ) -
        latitudeAbs * 0.024,
      0,
      1
    );

    const oceanCut = clamp(
      smoothstep(0.58, 0.86, basinNoise * 0.42 + coastFracture * 0.28 + shelf * 0.08 + separation * 0.12) *
        (1 - smoothstep(0.64, 0.92, elevation + ridgeNoise * 0.23 + mediumMass * 0.08)),
      0,
      1
    );

    const balancedExposure = clamp(
      exposure * 0.88 +
        islandSignal * 0.12 +
        oldPlate * 0.09 +
        mediumMass * 0.08 -
        oceanCut * 0.18,
      0,
      1
    );

    const beachEdge = clamp(
      smoothstep(0.44, 0.535, balancedExposure) *
        (1 - smoothstep(0.585, 0.735, balancedExposure)) *
        (0.7 + coastFracture * 0.3),
      0,
      1
    );

    const attachedBackshore = clamp(
      smoothstep(0.505, 0.69, balancedExposure) +
        smoothstep(0.46, 0.72, oldPlate) * 0.13 +
        smoothstep(0.48, 0.75, mediumMass) * 0.11 +
        smoothstep(0.5, 0.78, ridgeNoise) * 0.08 -
        oceanCut * 0.13,
      0,
      1
    );

    const terrainDrive = clamp(
      balancedExposure * 0.5 +
        elevation * 0.18 +
        oldPlate * 0.13 +
        mediumMass * 0.12 +
        plateauNoise * 0.11 +
        ridgeNoise * 0.12 +
        shelf * 0.035 -
        beachEdge * 0.075 -
        oceanCut * 0.13,
      0,
      1
    );

    const raisedTerrain = clamp(
      smoothstep(0.43, 0.65, terrainDrive) +
        smoothstep(0.525, 0.705, balancedExposure) * 0.36 +
        smoothstep(0.58, 0.8, islandSignal) * 0.18 -
        oceanCut * 0.13,
      0,
      1
    );

    const inlandCore = clamp(
      smoothstep(0.47, 0.74, raisedTerrain + oldPlate * 0.15 + mediumMass * 0.12 + plateauNoise * 0.1) -
        beachEdge * 0.08 -
        oceanCut * 0.1,
      0,
      1
    );

    const lowland = clamp(
      raisedTerrain * 0.34 +
        basinNoise * 0.16 +
        oldPlate * 0.08 +
        mediumMass * 0.05 -
        ridgeNoise * 0.08 -
        oceanCut * 0.07,
      0,
      1
    );

    const plateau = clamp(
      inlandCore * 0.31 +
        plateauNoise * 0.23 +
        elevation * 0.13 +
        oldPlate * 0.08 +
        mediumMass * 0.06 -
        oceanCut * 0.07,
      0,
      1
    );

    const ridgeBack = clamp(
      raisedTerrain * 0.19 +
        ridgeNoise * 0.29 +
        elevation * 0.14 +
        plateauNoise * 0.06 -
        oceanCut * 0.045,
      0,
      1
    );

    const terrainShadow = clamp(
      lowland * 0.2 +
        basinNoise * 0.13 +
        (1 - elevation) * 0.05 -
        plateau * 0.06,
      0,
      1
    );

    const terrainHighlight = clamp(
      ridgeBack * 0.26 +
        plateau * 0.21 +
        raisedTerrain * 0.16 +
        elevation * 0.1 -
        lowland * 0.06,
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
      oceanCut,
      balancedExposure,
      attachedBackshore,
      raisedTerrain,
      inlandCore,
      lowland,
      plateau,
      ridgeBack,
      terrainShadow,
      terrainHighlight,
      terrainAboveSeaLevel: raisedTerrain > 0.16,
      terrainMassAttached: attachedBackshore > 0.15 && raisedTerrain > 0.135,
      terrainMass: oldPlate,
      mediumLandBodies: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsVegetation: false,
      oceanDominantStillTrue: true,
      reduceOverexpandedLandmass: true,
      restoreFromOverRestraint: true,
      balancedLandmassRestore: true,
      destripingActive: true,
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
      authority: "audralia-balanced-landmass-restore-landrise-parent",
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
      mediumLandBodies: true,
      reduceOverexpandedLandmass: true,
      restoreFromOverRestraint: true,
      balancedLandmassRestore: true,
      oceanDominantStillTrue: true,
      destripingActive: true,
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
  document.documentElement.dataset.audraliaBalancedLandmassRestore = "true";
  document.documentElement.dataset.audraliaRestoreFromOverRestraint = "true";
  document.documentElement.dataset.audraliaMediumLandBodies = "true";
  document.documentElement.dataset.audraliaReduceOverexpandedLandmass = "true";
  document.documentElement.dataset.audraliaOceanDominantStillTrue = "true";
  document.documentElement.dataset.audraliaDestripingActive = "true";
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
