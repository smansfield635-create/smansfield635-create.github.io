// /assets/audralia/audralia.topology.js
// AUDRALIA_PARENT_TOPOLOGY_AUTHORITY_TNT_v1
// New file.
// Purpose:
// - Parent topology authority for Audralia only.
// - Owns above-sea pressure, below-sea depth, shelves, basins, sea-floor shape,
//   subterranean depth, and land/water structural eligibility.
// - Consumes Audralia backstory and tectonics when available.
// - Does not render, mount, route, control, or color the planet.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PARENT_TOPOLOGY_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_PARENT_TOPOLOGY_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-parent-topology-v1";
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

  function sampleBackstory(u, v, context) {
    if (window.AUDRALIA_BACKSTORY && typeof window.AUDRALIA_BACKSTORY.sampleIdentity === "function") {
      return window.AUDRALIA_BACKSTORY.sampleIdentity(u, v, context);
    }

    return {
      oceanBias: 0.7,
      cleanClimate: 1,
      weatheredAge: 1
    };
  }

  function sampleTectonics(u, v, context) {
    if (window.AUDRALIA_TECTONICS && typeof window.AUDRALIA_TECTONICS.sampleTectonics === "function") {
      return window.AUDRALIA_TECTONICS.sampleTectonics(u, v, context);
    }

    return {
      exposedLandPressure: 0.35,
      shelfPressure: 0.45,
      basinPressure: 0.55,
      oldRidgePressure: 0.35,
      islandPressure: 0.3,
      oceanPressure: 0.7,
      inlandBasinPotential: 0.45
    };
  }

  function sampleTopology(u, v, context = {}) {
    const longitude = Number.isFinite(context.longitude) ? context.longitude : (u - 0.5) * TAU;
    const latitude = Number.isFinite(context.latitude) ? context.latitude : (0.5 - v) * Math.PI;
    const backstory = sampleBackstory(u, v, { longitude, latitude });
    const tectonics = sampleTectonics(u, v, { longitude, latitude });

    const globalDepth = fbm(u * 1.08 + 0.04, v * 1.02 - 0.09, 310000, 6);
    const basinShape = fbm(u * 1.82 - 0.13, v * 1.5 + 0.15, 311000, 5);
    const shelfShape = fbm(u * 2.4 + 0.18, v * 1.86 - 0.06, 312000, 5);
    const subterraneanShape = fbm(u * 2.9 - 0.12, v * 2.2 + 0.11, 313000, 4);

    const seaLevel = clamp(0.62 + backstory.oceanBias * 0.08, 0.58, 0.74);

    const aboveSeaPressure = clamp(
      tectonics.exposedLandPressure * 0.55 +
        tectonics.oldRidgePressure * 0.22 +
        tectonics.islandPressure * 0.12 +
        shelfShape * 0.08 -
        seaLevel * 0.16,
      0,
      1
    );

    const belowSeaDepth = clamp(
      tectonics.oceanPressure * 0.42 +
        globalDepth * 0.3 +
        tectonics.basinPressure * 0.2 -
        aboveSeaPressure * 0.18,
      0,
      1
    );

    const shelf = clamp(
      tectonics.shelfPressure * 0.46 +
        shelfShape * 0.28 +
        aboveSeaPressure * 0.12 -
        belowSeaDepth * 0.1,
      0,
      1
    );

    const basin = clamp(
      tectonics.basinPressure * 0.42 +
        basinShape * 0.32 +
        tectonics.inlandBasinPotential * 0.18,
      0,
      1
    );

    const islandEligibility = clamp(
      tectonics.islandPressure * 0.52 +
        shelf * 0.22 +
        aboveSeaPressure * 0.18 -
        belowSeaDepth * 0.16,
      0,
      1
    );

    const landEligibility = clamp(
      aboveSeaPressure * 0.68 +
        islandEligibility * 0.12 +
        tectonics.oldRidgePressure * 0.12 -
        backstory.oceanBias * 0.08,
      0,
      1
    );

    const subterraneanDepth = clamp(
      subterraneanShape * 0.4 +
        belowSeaDepth * 0.24 +
        basin * 0.2 +
        tectonics.oldRidgePressure * 0.12,
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      longitude,
      latitude,
      seaLevel,
      aboveSeaPressure,
      belowSeaDepth,
      shelf,
      basin,
      islandEligibility,
      landEligibility,
      subterraneanDepth,
      seaFloorShape: belowSeaDepth,
      oceanDominant: true,
      topologyIncludesBelowSea: true,
      subterraneanBlueprintHeld: true,
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
      authority: "audralia-topology-parent",
      consumesBackstory: Boolean(window.AUDRALIA_BACKSTORY),
      consumesTectonics: Boolean(window.AUDRALIA_TECTONICS),
      oceanDominant: true,
      topologyIncludesBelowSea: true,
      subterraneanBlueprintHeld: true,
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

  window.AUDRALIA_TOPOLOGY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleTopology,
    getStatus
  });

  window.AUDRALIA_TOPOLOGY_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaTopologyLoaded = "true";
  document.documentElement.dataset.audraliaTopologyContract = CONTRACT;
  document.documentElement.dataset.audraliaTopologyReceipt = RECEIPT;
  document.documentElement.dataset.audraliaTopologyIncludesBelowSea = "true";
  document.documentElement.dataset.audraliaSubterraneanBlueprintHeld = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
