// /assets/audralia/audralia.mountains.js
// AUDRALIA_G1_HIGH_MOUNTAIN_RANGE_COMMUNITY_AUTHORITY_TNT_v1
// New file.
// Mountain authority only.
// Purpose:
// - Add high mountains, beautiful mountain ranges, foothills, passes, terraces, and mountain communities.
// - Mountains consume terrain/landrise; they do not create land from ocean.
// - Communities appear only as small mountain-settlement signals near foothills, passes, and sheltered basins.
// - No trees. No bushes. No forest canopy.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_HIGH_MOUNTAIN_RANGE_COMMUNITY_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_HIGH_MOUNTAIN_RANGE_COMMUNITY_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-g1-high-mountain-range-community-authority-v1";

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

    const longRange = ridged(u * 1.72 + 0.11, v * 1.21 - 0.07, 1011000, 6);
    const crossRange = ridged(u * 3.15 - 0.18, v * 2.22 + 0.14, 1012000, 5);
    const peakField = ridged(u * 5.2 + 0.04, v * 4.1 - 0.12, 1013000, 5);
    const fracture = ridged(u * 8.8 - 0.09, v * 6.4 + 0.17, 1014000, 4);
    const weathering = fbm(u * 2.6 + 0.2, v * 2.1 - 0.11, 1015000, 5);
    const valleyCut = 1 - ridged(u * 4.0 - 0.12, v * 3.1 + 0.08, 1016000, 4);
    const communityGrid = noise(u * 22.0, v * 18.0, 24, 1017000);
    const terraceGrid = ridged(u * 14.0 + 0.05, v * 10.0 - 0.09, 1018000, 3);

    const gratitudeWeight = clamp(summit.primaryWeight || 0.62, 0, 1);
    const purityLift = summit.internalSummit === "Purity" ? 0.08 : 0;
    const patienceLift = summit.internalSummit === "Patience" ? 0.06 : 0;
    const humilityLowering = summit.internalSummit === "Humility" ? 0.05 : 0;

    const mountainEligibility = clamp(
      terrainMass * 0.34 +
        inlandCore * 0.24 +
        ridgeBack * 0.24 +
        plateau * 0.18 +
        exposure * 0.14 -
        beachEdge * 0.2 -
        lowland * 0.08,
      0,
      1
    );

    const rangeSpine = clamp(
      smoothstep(0.54, 0.82, longRange * 0.48 + ridgeBack * 0.32 + mountainEligibility * 0.28) *
        smoothstep(0.16, 0.86, terrainMass),
      0,
      1
    );

    const secondaryRange = clamp(
      smoothstep(0.58, 0.84, crossRange * 0.48 + plateau * 0.24 + mountainEligibility * 0.24) *
        smoothstep(0.18, 0.82, terrainMass),
      0,
      1
    );

    const peak = clamp(
      smoothstep(0.66, 0.91, peakField * 0.44 + rangeSpine * 0.34 + secondaryRange * 0.18 + elevation.elevation * 0.12) *
        smoothstep(0.28, 0.78, inlandCore + terrainMass * 0.24),
      0,
      1
    );

    const highMountain = clamp(
      smoothstep(0.58, 0.86, rangeSpine * 0.42 + secondaryRange * 0.28 + peak * 0.32 + mountainEligibility * 0.22) +
        purityLift +
        patienceLift -
        humilityLowering,
      0,
      1
    );

    const snowCap = clamp(
      smoothstep(0.62, 0.9, highMountain * 0.62 + peak * 0.34 + gratitudeWeight * 0.08) *
        (0.68 + weathering * 0.22),
      0,
      1
    );

    const cliffFace = clamp(
      smoothstep(0.6, 0.9, fracture * 0.42 + peak * 0.24 + rangeSpine * 0.24) *
        smoothstep(0.2, 0.8, terrainMass),
      0,
      1
    );

    const foothills = clamp(
      smoothstep(0.28, 0.62, mountainEligibility + plateau * 0.16) *
        (1 - smoothstep(0.58, 0.92, highMountain)) *
        smoothstep(0.16, 0.78, terrainMass),
      0,
      1
    );

    const mountainPass = clamp(
      smoothstep(0.44, 0.7, valleyCut * 0.44 + rangeSpine * 0.26 + secondaryRange * 0.18) *
        smoothstep(0.2, 0.8, terrainMass) *
        (1 - peak * 0.42),
      0,
      1
    );

    const terrace = clamp(
      smoothstep(0.56, 0.82, terraceGrid * 0.42 + foothills * 0.34 + mountainPass * 0.2) *
        smoothstep(0.16, 0.74, terrainMass),
      0,
      1
    );

    const community = clamp(
      smoothstep(0.84, 0.965, communityGrid) *
        smoothstep(0.34, 0.8, foothills + mountainPass * 0.45 + terrace * 0.24) *
        (1 - snowCap * 0.72) *
        (1 - peak * 0.62) *
        smoothstep(0.22, 0.82, terrainMass),
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
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
      version: VERSION,
      authority: "audralia-high-mountain-range-community-authority",
      highMountains: true,
      mountainRanges: true,
      mountainCommunities: true,
      terrainMassRequired: true,
      beachRemainsSeaLevel: true,
      noOceanMountains: true,
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
  document.documentElement.dataset.audraliaNoTrees = "true";
  document.documentElement.dataset.audraliaNoBushes = "true";
  document.documentElement.dataset.audraliaNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
