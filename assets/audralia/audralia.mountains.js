// /assets/audralia/audralia.mountains.js
// AUDRALIA_G1_RESTRAINT_DESTRIPING_MOUNTAIN_AUTHORITY_TNT_v2
// Full-file replacement.
// Mountain authority only.
// Purpose:
// - Keep high mountains and beautiful ranges.
// - Remove longitude-strip / scanline behavior.
// - Make ranges follow restrained ridge fields.
// - Make communities tiny clustered points, not bands.
// - Mountains consume terrain/landrise; they do not create land from ocean.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_MOUNTAIN_AUTHORITY_TNT_v2";
  const RECEIPT = "AUDRALIA_G1_RESTRAINT_DESTRIPING_MOUNTAIN_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_HIGH_MOUNTAIN_RANGE_COMMUNITY_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.audralia-g1-restraint-destriping-mountain-authority-v2";

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

  function clusteredPoint(u, v, seed, cells) {
    const s = Math.max(4, cells);
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;

    const hx = hash(xi, yi, seed);
    const hy = hash(xi, yi, seed + 97);
    const eligibility = hash(xi, yi, seed + 193);

    const dx = fx - (0.25 + hx * 0.5);
    const dy = fy - (0.25 + hy * 0.5);
    const d = Math.sqrt(dx * dx + dy * dy);

    return eligibility > 0.92 ? smoothstep(0.085, 0.0, d) : 0;
  }

  function sampleMountains(u, v, context = {}) {
    const landrise = context.landrise || {};
    const elevation = context.elevation || {};
    const summit = context.summit || {};
    const exposure = clamp(context.exposure || 0, 0, 1);

    const terrainMass = clamp(landrise.raisedTerrain || landrise.inlandCore || 0, 0, 1);
    const inlandCore = clamp(landrise.inlandCore || 0, 0, 1);
    const ridgeBack = clamp(landrise.ridgeBack || elevation.ridge || 0, 0, 1);
    const plateau = clamp(landrise.plateau || elevation.highland || 0, 0, 1);
    const lowland = clamp(landrise.lowland || 0, 0, 1);
    const beachEdge = clamp(landrise.beachEdge || context.beachEdge || 0, 0, 1);
    const oceanCut = clamp(landrise.oceanCut || 0, 0, 1);

    const diagonalRangeA = ridged(u * 1.35 + v * 0.42 + 0.11, v * 1.08 - u * 0.22 - 0.07, 1510000, 6);
    const diagonalRangeB = ridged(u * 1.1 - v * 0.36 - 0.18, v * 1.34 + u * 0.25 + 0.14, 1511000, 5);
    const localPeak = ridged(u * 3.8 + 0.04, v * 3.0 - 0.12, 1512000, 5);
    const fracture = ridged(u * 5.6 - 0.09, v * 4.5 + 0.17, 1513000, 4);
    const weathering = fbm(u * 1.8 + 0.2, v * 1.55 - 0.11, 1514000, 5);
    const valleyCut = 1 - ridged(u * 2.6 - 0.12, v * 2.2 + 0.08, 1515000, 4);
    const terraceTexture = fbm(u * 4.4 + 0.05, v * 3.7 - 0.09, 1516000, 4);
    const communityDot = clusteredPoint(u, v, 1517000, 22);

    const gratitudeWeight = clamp(summit.primaryWeight || 0.62, 0, 1);
    const purityLift = summit.internalSummit === "Purity" ? 0.05 : 0;
    const patienceLift = summit.internalSummit === "Patience" ? 0.04 : 0;
    const humilityLowering = summit.internalSummit === "Humility" ? 0.04 : 0;

    const mountainEligibility = clamp(
      terrainMass * 0.3 +
        inlandCore * 0.22 +
        ridgeBack * 0.24 +
        plateau * 0.15 +
        exposure * 0.1 -
        beachEdge * 0.18 -
        lowland * 0.1 -
        oceanCut * 0.22,
      0,
      1
    );

    const rangeSpine = clamp(
      smoothstep(0.6, 0.86, diagonalRangeA * 0.4 + ridgeBack * 0.3 + mountainEligibility * 0.22 + diagonalRangeB * 0.1) *
        smoothstep(0.28, 0.86, terrainMass),
      0,
      1
    );

    const secondaryRange = clamp(
      smoothstep(0.64, 0.88, diagonalRangeB * 0.42 + plateau * 0.2 + mountainEligibility * 0.2) *
        smoothstep(0.3, 0.82, terrainMass),
      0,
      1
    );

    const peak = clamp(
      smoothstep(0.72, 0.93, localPeak * 0.36 + rangeSpine * 0.32 + secondaryRange * 0.18 + elevation.elevation * 0.1) *
        smoothstep(0.36, 0.82, inlandCore + terrainMass * 0.18),
      0,
      1
    );

    const highMountain = clamp(
      smoothstep(0.64, 0.88, rangeSpine * 0.38 + secondaryRange * 0.22 + peak * 0.32 + mountainEligibility * 0.2) +
        purityLift +
        patienceLift -
        humilityLowering,
      0,
      1
    );

    const snowCap = clamp(
      smoothstep(0.7, 0.92, highMountain * 0.58 + peak * 0.36 + gratitudeWeight * 0.04) *
        (0.62 + weathering * 0.18),
      0,
      1
    );

    const cliffFace = clamp(
      smoothstep(0.64, 0.9, fracture * 0.36 + peak * 0.24 + rangeSpine * 0.2) *
        smoothstep(0.26, 0.82, terrainMass),
      0,
      1
    );

    const foothills = clamp(
      smoothstep(0.34, 0.66, mountainEligibility + plateau * 0.12) *
        (1 - smoothstep(0.62, 0.92, highMountain)) *
        smoothstep(0.24, 0.78, terrainMass),
      0,
      1
    );

    const mountainPass = clamp(
      smoothstep(0.52, 0.78, valleyCut * 0.38 + rangeSpine * 0.22 + secondaryRange * 0.14) *
        smoothstep(0.28, 0.82, terrainMass) *
        (1 - peak * 0.5),
      0,
      1
    );

    const terrace = clamp(
      smoothstep(0.62, 0.84, terraceTexture * 0.36 + foothills * 0.32 + mountainPass * 0.18) *
        smoothstep(0.24, 0.76, terrainMass) *
        (1 - highMountain * 0.44),
      0,
      1
    );

    const community = clamp(
      communityDot *
        smoothstep(0.38, 0.82, foothills + mountainPass * 0.38 + terrace * 0.2) *
        (1 - snowCap * 0.88) *
        (1 - peak * 0.76) *
        smoothstep(0.26, 0.82, terrainMass),
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      highMountain,
      rangeSpine,
      secondaryRange,
      peak,
      snowCap,
      cliffFace,
      foothills,
      mountainPass,
      terrace,
      community,
      mountainCommunity: community,
      terrainMassRequired: true,
      beachRemainsSeaLevel: true,
      noOceanMountains: true,
      destripingActive: true,
      scanlineMountains: false,
      scanlineCommunities: false,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsTerrainBase: false,
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
      authority: "audralia-restraint-destriping-mountain-authority",
      highMountains: true,
      mountainRanges: true,
      mountainCommunities: true,
      terrainMassRequired: true,
      beachRemainsSeaLevel: true,
      noOceanMountains: true,
      destripingActive: true,
      scanlineMountains: false,
      scanlineCommunities: false,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_MOUNTAINS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleMountains,
    getStatus
  });

  window.AUDRALIA_MOUNTAINS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaMountainsLoaded = "true";
  document.documentElement.dataset.audraliaMountainsContract = CONTRACT;
  document.documentElement.dataset.audraliaMountainsReceipt = RECEIPT;
  document.documentElement.dataset.audraliaHighMountains = "true";
  document.documentElement.dataset.audraliaMountainRanges = "true";
  document.documentElement.dataset.audraliaMountainCommunities = "true";
  document.documentElement.dataset.audraliaDestripingActive = "true";
  document.documentElement.dataset.audraliaScanlineMountains = "false";
  document.documentElement.dataset.audraliaScanlineCommunities = "false";
  document.documentElement.dataset.audraliaNoTrees = "true";
  document.documentElement.dataset.audraliaNoBushes = "true";
  document.documentElement.dataset.audraliaNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
