// /assets/audralia/audralia.tectonics.js
// AUDRALIA_PARENT_TECTONICS_AUTHORITY_TNT_v1
// New file.
// Purpose:
// - Parent tectonics for Audralia only.
// - Ancient, weathered, ocean-driven plate behavior.
// - Defines exposed land pressure, old ridges, shelves, basins, plate memory, island pressure.
// - Does not color terrain, render canvas, own route, or create ecology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PARENT_TECTONICS_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_PARENT_TECTONICS_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-parent-tectonics-v1";
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

  function sampleBackstory(u, v, context) {
    if (window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function") {
      return window.AUDRALIA_BACKSTORY.sampleIdentity(u, v, context);
    }

    return {
      oceanBias: 0.7,
      weatheredAge: 1,
      cleanClimate: 1,
      homeWorldSignal: 0.8
    };
  }

  function sampleTectonics(u, v, context = {}) {
    const longitude = Number.isFinite(context.longitude) ? context.longitude : (u - 0.5) * TAU;
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const backstory = sampleBackstory(u, v, { latitude, longitude });

    const oldPlate = fbm(u * 1.02 + 0.11, v * 0.96 - 0.07, 210000, 6);
    const ridgeMemory = ridged(u * 1.52 - 0.08, v * 1.18 + 0.14, 211000, 6);
    const shelfBreak = ridged(u * 2.2 + 0.15, v * 1.7 - 0.12, 212000, 5);
    const basinMemory = 1 - fbm(u * 1.84 - 0.16, v * 1.44 + 0.09, 213000, 5);
    const weathering = fbm(u * 2.6 + 0.05, v * 2.1 - 0.17, 214000, 4);

    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);
    const oceanPressure = clamp(backstory.oceanBias * 0.64 + basinMemory * 0.22 + latitudeAbs * 0.08, 0, 1);

    const exposedLandPressure = clamp(
      ridgeMemory * 0.32 +
        oldPlate * 0.28 +
        shelfBreak * 0.16 +
        weathering * 0.08 -
        oceanPressure * 0.18,
      0,
      1
    );

    const shelfPressure = clamp(oceanPressure * 0.38 + shelfBreak * 0.38 + oldPlate * 0.16, 0, 1);
    const basinPressure = clamp(basinMemory * 0.5 + oceanPressure * 0.24 + (1 - ridgeMemory) * 0.18, 0, 1);
    const oldRidgePressure = clamp(ridgeMemory * 0.58 + oldPlate * 0.18 - weathering * 0.08, 0, 1);
    const islandPressure = clamp(shelfBreak * 0.48 + oldPlate * 0.18 + oceanPressure * 0.12 - basinMemory * 0.08, 0, 1);
    const weatheredEdgePressure = clamp(shelfBreak * 0.32 + weathering * 0.3 + oldPlate * 0.14, 0, 1);
    const inlandBasinPotential = clamp(basinPressure * 0.54 + oldPlate * 0.12 - oldRidgePressure * 0.08, 0, 1);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      longitude,
      latitude,
      oldPlate,
      ridgeMemory,
      shelfBreak,
      basinMemory,
      weathering,
      oceanPressure,
      exposedLandPressure,
      shelfPressure,
      basinPressure,
      oldRidgePressure,
      islandPressure,
      weatheredEdgePressure,
      inlandBasinPotential,
      ancientWeatheredWorld: true,
      oceanDrivenPlateBehavior: true,
      hardJaggedChaos: false,
      earthClone: false,
      hearthIdentity: false,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsMaterial: false,
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
      authority: "audralia-tectonics-parent",
      consumesBackstory: Boolean(window.AUDRALIA_BACKSTORY),
      ancientWeatheredWorld: true,
      oceanDrivenPlateBehavior: true,
      hardJaggedChaos: false,
      earthClone: false,
      hearthIdentity: false,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsMaterial: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_TECTONICS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleTectonics,
    getStatus
  });

  window.AUDRALIA_TECTONICS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaTectonicsLoaded = "true";
  document.documentElement.dataset.audraliaTectonicsContract = CONTRACT;
  document.documentElement.dataset.audraliaTectonicsReceipt = RECEIPT;
  document.documentElement.dataset.audraliaAncientWeatheredWorld = "true";
  document.documentElement.dataset.audraliaOceanDrivenPlateBehavior = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
