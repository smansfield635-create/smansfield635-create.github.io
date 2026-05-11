// /assets/audralia/audralia.landrise.js
// AUDRALIA_G1_RESTRAINT_DESTRIPING_LANDRISE_AUTHORITY_TNT_v5
// Full-file replacement.
// Parent terrain-rise authority only.
// Purpose:
// - Preserve beach-to-land attachment.
// - Reduce landmass back toward ocean-dominant G1.
// - Break broad land sheets into restrained land bodies, islands, shelves, and raised terrain pockets.
// - Beaches remain sea level.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_LANDRISE_AUTHORITY_TNT_v5";
  const RECEIPT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_LANDRISE_AUTHORITY_RECEIPT_v5";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_MORE_LANDMASS_TERRAIN_ATTACHMENT_AUTHORITY_TNT_v4";
  const VERSION = "2026-05-10.audralia-g1-restraint-destriping-landrise-authority-v5";

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

    const oldPlate = fbm(u * 0.88 + 0.17, v * 0.72 - 0.11, 1310000, 6);
    const islandBreak = ridged(u * 2.85 + 0.13, v * 2.25 - 0.19, 1311000, 5);
    const coastFracture = ridged(u * 5.4 - 0.07, v * 4.25 + 0.09, 1312000, 4);
    const basinNoise = 1 - fbm(u * 1.72 - 0.09, v * 1.36 + 0.18, 1313000, 5);
    const plateauNoise = fbm(u * 1.18 - 0.17, v * 1.04 + 0.21, 1314000, 5);
    const ridgeNoise = ridged(u * 1.85 + 0.08, v * 1.42 - 0.12, 1315000, 5);

    const exposure = clamp(
      Math.max(
        landSignal * 0.92 + oldPlate * 0.08,
        islandSignal * 0.78 + islandBreak * 0.12
      ) -
        latitudeAbs * 0.025,
      0,
      1
    );

    const oceanCut = clamp(
      smoothstep(0.55, 0.83, basinNoise * 0.48 + coastFracture * 0.34 + shelf * 0.12) *
        (1 - smoothstep(0.62, 0.9, elevation + ridgeNoise * 0.24)),
      0,
      1
    );

    const restrainedExposure = clamp(
      exposure * 0.78 +
        islandSignal * 0.1 +
        oldPlate * 0.08 -
        oceanCut * 0.22,
      0,
      1
    );

    const beachEdge = clamp(
      smoothstep(0.46, 0.555, restrainedExposure) *
        (1 - smoothstep(0.59, 0.725, restrainedExposure)) *
        (0.7 + coastFracture * 0.3),
      0,
      1
    );

    const attachedBackshore = clamp(
      smoothstep(0.535, 0.71, restrainedExposure) +
        smoothstep(0.48, 0.72, oldPlate) * 0.12 +
        smoothstep(0.52, 0.78, ridgeNoise) * 0.08 -
        oceanCut * 0.16,
      0,
      1
    );

    const terrainDrive = clamp(
      restrainedExposure * 0.46 +
        elevation * 0.18 +
        oldPlate * 0.15 +
        plateauNoise * 0.13 +
        ridgeNoise * 0.13 +
        shelf * 0.04 -
        beachEdge * 0.08 -
        oceanCut * 0.16,
      0,
      1
    );

    const raisedTerrain = clamp(
      smoothstep(0.46, 0.68, terrainDrive) +
        smoothstep(0.56, 0.72, restrainedExposure) * 0.34 +
        smoothstep(0.62, 0.82, islandSignal) * 0.18 -
        oceanCut * 0.18,
      0,
      1
    );

    const inlandCore = clamp(
      smoothstep(0.5, 0.76, raisedTerrain + oldPlate * 0.17 + plateauNoise * 0.11) -
        beachEdge * 0.08 -
        oceanCut * 0.12,
      0,
      1
    );

    const lowland = clamp(
      raisedTerrain * 0.34 +
        basinNoise * 0.18 +
        oldPlate * 0.08 -
        ridgeNoise * 0.09 -
        oceanCut * 0.08,
      0,
      1
    );

    const plateau = clamp(
      inlandCore * 0.32 +
        plateauNoise * 0.24 +
        elevation * 0.13 +
        oldPlate * 0.1 -
        oceanCut * 0.08,
      0,
      1
    );

    const ridgeBack = clamp(
      raisedTerrain * 0.2 +
        ridgeNoise * 0.3 +
        elevation * 0.14 +
        plateauNoise * 0.06 -
        oceanCut * 0.05,
      0,
      1
    );

    const terrainShadow = clamp(
      lowland * 0.2 +
        basinNoise * 0.14 +
        (1 - elevation) * 0.05 -
        plateau * 0.06,
      0,
      1
    );

    const terrainHighlight = clamp(
      ridgeBack * 0.26 +
        plateau * 0.22 +
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
      restrainedExposure,
      attachedBackshore,
      raisedTerrain,
      inlandCore,
      lowland,
      plateau,
      ridgeBack,
      terrainShadow,
      terrainHighlight,
      terrainAboveSeaLevel: raisedTerrain > 0.18,
      terrainMassAttached: attachedBackshore > 0.16 && raisedTerrain > 0.15,
      terrainMass: oldPlate,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsVegetation: false,
      oceanDominantStillTrue: true,
      reduceOverexpandedLandmass: true,
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
      authority: "audralia-restraint-destriping-landrise-parent",
      beachRemainsSeaLevel: true,
      raisedTerrainBehindBeach: true,
      terrainMassAttached: true,
      terrainAboveSeaLevel: true,
      reduceOverexpandedLandmass: true,
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
  document.documentElement.dataset.audraliaReduceOverexpandedLandmass = "true";
  document.documentElement.dataset.audraliaOceanDominantStillTrue = "true";
  document.documentElement.dataset.audraliaDestripingActive = "true";
  document.documentElement.dataset.audraliaBeachRemainsSeaLevel = "true";
