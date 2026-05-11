// /assets/audralia/audralia.groundcover.js
// AUDRALIA_G1_PLAINS_DESERTS_MARSHES_GROUNDCOVER_AUTHORITY_TNT_v1
// New file.
// Groundcover authority only.
// Adds plains, deserts, marshes, wet flats, dry basins, mineral flats, and grassland ground color.
// Does not create trees, bushes, forest canopy, or full vegetation topology.
// Does not own route, canvas, runtime, controls, mountains, beaches, landrise, or terrain base.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_PLAINS_DESERTS_MARSHES_GROUNDCOVER_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_PLAINS_DESERTS_MARSHES_GROUNDCOVER_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-g1-plains-deserts-marshes-groundcover-authority-v1";

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

  function sampleGroundcover(u, v, context = {}) {
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const latitudeAbs = Math.abs(latitude) / (Math.PI / 2);

    const shape = context.shape || {};
    const elevation = context.elevation || {};
    const landrise = context.landrise || {};
    const mountains = context.mountains || {};
    const summit = context.summit || {};

    const exposure = clamp(shape.exposure || context.exposure || 0, 0, 1);
    const shelf = clamp(shape.shelf || context.shelf || 0, 0, 1);
    const terrainMass = clamp(landrise.raisedTerrain || landrise.inlandCore || 0, 0, 1);
    const inlandCore = clamp(landrise.inlandCore || 0, 0, 1);
    const lowland = clamp(landrise.lowland || 0, 0, 1);
    const plateau = clamp(landrise.plateau || 0, 0, 1);
    const beachEdge = clamp(landrise.beachEdge || context.beachEdge || 0, 0, 1);
    const basin = clamp(elevation.basin || 0, 0, 1);
    const highMountain = clamp(mountains.highMountain || 0, 0, 1);
    const foothills = clamp(mountains.foothills || 0, 0, 1);
    const mountainPass = clamp(mountains.mountainPass || 0, 0, 1);

    const heat =
      clamp(1 - latitudeAbs * 0.82, 0, 1) * 0.62 +
      fbm(u * 1.18 + 0.22, v * 1.08 - 0.14, 1111000, 5) * 0.38;

    const moisture =
      fbm(u * 1.6 - 0.19, v * 1.3 + 0.12, 1112000, 5) * 0.42 +
      shelf * 0.14 +
      basin * 0.18 +
      lowland * 0.16 +
      mountainPass * 0.06 -
      highMountain * 0.12;

    const dryness =
      clamp(
        heat * 0.46 +
          (1 - moisture) * 0.42 +
          plateau * 0.12 +
          fbm(u * 2.2, v * 1.9, 1113000, 4) * 0.12 -
          shelf * 0.12 -
          beachEdge * 0.18,
        0,
        1
      );

    const wetness =
      clamp(
        moisture * 0.54 +
          basin * 0.24 +
          lowland * 0.18 +
          shelf * 0.12 -
          heat * 0.1 -
          highMountain * 0.18,
        0,
        1
      );

    const flatness =
      clamp(
        lowland * 0.34 +
          plateau * 0.22 +
          (1 - highMountain) * 0.24 +
          (1 - foothills) * 0.1 +
          fbm(u * 1.1, v * 1.1, 1114000, 4) * 0.12,
        0,
        1
      );

    const plains = clamp(
      smoothstep(0.34, 0.76, flatness + terrainMass * 0.16) *
        smoothstep(0.18, 0.84, terrainMass) *
        (1 - smoothstep(0.58, 0.92, dryness)) *
        (1 - highMountain * 0.72),
      0,
      1
    );

    const desert = clamp(
      smoothstep(0.55, 0.88, dryness) *
        smoothstep(0.18, 0.82, terrainMass) *
        (1 - wetness * 0.58) *
        (1 - beachEdge * 0.5) *
        (1 - highMountain * 0.48),
      0,
      1
    );

    const marsh = clamp(
      smoothstep(0.52, 0.86, wetness) *
        smoothstep(0.22, 0.78, lowland + basin * 0.24) *
        (1 - highMountain * 0.92) *
        (1 - plateau * 0.36) *
        smoothstep(0.16, 0.72, terrainMass),
      0,
      1
    );

    const wetFlat = clamp(
      smoothstep(0.46, 0.8, shelf + basin * 0.22 + lowland * 0.18) *
        smoothstep(0.12, 0.7, terrainMass) *
        (1 - highMountain * 0.85),
      0,
      1
    );

    const grassland = clamp(
      smoothstep(0.36, 0.78, plains + moisture * 0.18) *
        (1 - desert * 0.64) *
        (1 - marsh * 0.46) *
        (1 - highMountain * 0.54),
      0,
      1
    );

    const dryBasin = clamp(
      smoothstep(0.52, 0.86, basin + dryness * 0.24) *
        (1 - marsh * 0.56) *
        smoothstep(0.18, 0.78, terrainMass),
      0,
      1
    );

    const mineralFlat = clamp(
      smoothstep(0.7, 0.94, dryness * 0.48 + basin * 0.28 + fbm(u * 5.2, v * 4.7, 1115000, 4) * 0.24) *
        smoothstep(0.16, 0.8, terrainMass) *
        (1 - highMountain * 0.6),
      0,
      1
    );

    const gratitudePlain = summit.primarySummit === "Gratitude" ? plains * 0.08 + marsh * 0.05 : 0;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      plains: clamp(plains + gratitudePlain, 0, 1),
      deserts: desert,
      marshes: marsh,
      wetFlats: wetFlat,
      grassland,
      dryBasins: dryBasin,
      mineralFlats: mineralFlat,
      groundMoisture: clamp(moisture, 0, 1),
      groundHeat: clamp(heat, 0, 1),
      groundDryness: dryness,
      basicVegetationOnly: true,
      trees: false,
      bushes: false,
      forestCanopy: false,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsLandrise: false,
      ownsMountains: false,
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
      authority: "audralia-plains-deserts-marshes-groundcover-authority",
      plains: true,
      deserts: true,
      marshes: true,
      wetFlats: true,
      grassland: true,
      basicVegetationOnly: true,
      trees: false,
      bushes: false,
      forestCanopy: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_GROUNDCOVER = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleGroundcover,
    getStatus
  });

  window.AUDRALIA_GROUNDCOVER_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaGroundcoverLoaded = "true";
  document.documentElement.dataset.audraliaGroundcoverContract = CONTRACT;
  document.documentElement.dataset.audraliaGroundcoverReceipt = RECEIPT;
  document.documentElement.dataset.audraliaPlains = "true";
  document.documentElement.dataset.audraliaDeserts = "true";
  document.documentElement.dataset.audraliaMarshes = "true";
  document.documentElement.dataset.audraliaBasicVegetationOnly = "true";
  document.documentElement.dataset.audraliaTrees = "false";
  document.documentElement.dataset.audraliaBushes = "false";
  document.documentElement.dataset.audraliaForestCanopy = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
