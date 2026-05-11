// /assets/audralia/audralia.groundcover.js
// AUDRALIA_G1_RESTRAINT_DESTRIPING_GROUNDCOVER_AUTHORITY_TNT_v2
// Full-file replacement.
// Groundcover authority only.
// Purpose:
// - Separate plains, deserts, marshes, wet flats, grasslands, dry basins, and mineral flats.
// - Remove scanline behavior.
// - Keep groundcover subdued and natural.
// - Does not create trees, bushes, forest canopy, or full vegetation topology.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_GROUNDCOVER_AUTHORITY_TNT_v2";
  const RECEIPT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_GROUNDCOVER_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_PLAINS_DESERTS_MARSHES_GROUNDCOVER_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.audralia-g1-restraint-destriping-groundcover-authority-v2";

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
    const oceanCut = clamp(landrise.oceanCut || 0, 0, 1);

    const broadField = fbm(u * 0.72 + 0.21, v * 0.68 - 0.16, 1410000, 6);
    const moistureField = fbm(u * 1.35 - 0.19, v * 1.08 + 0.12, 1411000, 5);
    const drynessField = fbm(u * 1.22 + 0.11, v * 0.96 - 0.08, 1412000, 5);
    const basinField = ridged(u * 1.8 - 0.04, v * 1.42 + 0.18, 1413000, 5);
    const mineralField = fbm(u * 3.2 + 0.07, v * 2.7 - 0.14, 1414000, 4);

    const heat = clamp(
      (1 - latitudeAbs * 0.8) * 0.58 +
        drynessField * 0.32 +
        broadField * 0.1,
      0,
      1
    );

    const moisture = clamp(
      moistureField * 0.42 +
        shelf * 0.14 +
        basin * 0.17 +
        lowland * 0.16 +
        broadField * 0.08 -
        highMountain * 0.14 -
        oceanCut * 0.05,
      0,
      1
    );

    const dryness = clamp(
      heat * 0.4 +
        (1 - moisture) * 0.38 +
        plateau * 0.12 +
        drynessField * 0.12 -
        shelf * 0.11 -
        beachEdge * 0.18,
      0,
      1
    );

    const wetness = clamp(
      moisture * 0.52 +
        basin * 0.24 +
        lowland * 0.17 +
        shelf * 0.1 -
        heat * 0.1 -
        highMountain * 0.18,
      0,
      1
    );

    const flatness = clamp(
      lowland * 0.32 +
        plateau * 0.18 +
        (1 - highMountain) * 0.22 +
        (1 - foothills) * 0.08 +
        broadField * 0.12 -
        oceanCut * 0.08,
      0,
      1
    );

    const plains = clamp(
      smoothstep(0.42, 0.78, flatness + terrainMass * 0.12 + broadField * 0.08) *
        smoothstep(0.22, 0.76, terrainMass) *
        (1 - smoothstep(0.62, 0.9, dryness)) *
        (1 - highMountain * 0.74) *
        (1 - oceanCut * 0.48),
      0,
      1
    );

    const deserts = clamp(
      smoothstep(0.6, 0.88, dryness) *
        smoothstep(0.24, 0.82, terrainMass) *
        (1 - wetness * 0.62) *
        (1 - beachEdge * 0.5) *
        (1 - highMountain * 0.5) *
        (0.72 + drynessField * 0.2),
      0,
      1
    );

    const marshes = clamp(
      smoothstep(0.56, 0.86, wetness) *
        smoothstep(0.26, 0.76, lowland + basin * 0.22 + shelf * 0.08) *
        (1 - highMountain * 0.92) *
        (1 - plateau * 0.38) *
        smoothstep(0.18, 0.72, terrainMass) *
        (1 - oceanCut * 0.3),
      0,
      1
    );

    const wetFlats = clamp(
      smoothstep(0.5, 0.82, shelf + basin * 0.2 + lowland * 0.16) *
        smoothstep(0.16, 0.7, terrainMass) *
        (1 - highMountain * 0.86) *
        (1 - oceanCut * 0.36),
      0,
      1
    );

    const grassland = clamp(
      smoothstep(0.42, 0.78, plains + moisture * 0.16 + broadField * 0.08) *
        (1 - deserts * 0.64) *
        (1 - marshes * 0.46) *
        (1 - highMountain * 0.56),
      0,
      1
    );

    const dryBasins = clamp(
      smoothstep(0.56, 0.86, basinField * 0.28 + basin * 0.42 + dryness * 0.2) *
        (1 - marshes * 0.56) *
        smoothstep(0.22, 0.78, terrainMass),
      0,
      1
    );

    const mineralFlats = clamp(
      smoothstep(0.72, 0.94, dryness * 0.38 + basin * 0.24 + mineralField * 0.28) *
        smoothstep(0.2, 0.78, terrainMass) *
        (1 - highMountain * 0.6) *
        (1 - marshes * 0.5),
      0,
      1
    );

    const gratitudePlain = summit.primarySummit === "Gratitude" ? plains * 0.05 + marshes * 0.035 : 0;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      plains: clamp(plains + gratitudePlain, 0, 1),
      deserts,
      marshes,
      wetFlats,
      grassland,
      dryBasins,
      mineralFlats,
      groundMoisture: moisture,
      groundHeat: heat,
      groundDryness: dryness,
      basicVegetationOnly: true,
      trees: false,
      bushes: false,
      forestCanopy: false,
      destripingActive: true,
      scanlineGroundcover: false,
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
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-restraint-destriping-groundcover-authority",
      plains: true,
      deserts: true,
      marshes: true,
      wetFlats: true,
      grassland: true,
      basicVegetationOnly: true,
      trees: false,
      bushes: false,
      forestCanopy: false,
      destripingActive: true,
      scanlineGroundcover: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_GROUNDCOVER = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
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
  document.documentElement.dataset.audraliaDestripingActive = "true";
  document.documentElement.dataset.audraliaScanlineGroundcover = "false";
  document.documentElement.dataset.audraliaTrees = "false";
  document.documentElement.dataset.audraliaBushes = "false";
  document.documentElement.dataset.audraliaForestCanopy = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
