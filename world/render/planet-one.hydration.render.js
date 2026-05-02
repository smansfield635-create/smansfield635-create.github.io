/* G1 PLANET 1 HYDRATION DEPTH LAYER
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_HYDRATION_DEPTH_TERRAIN_OUTLINE_HEX_BRIDGE_SET_TNT_v1

   LAW:
   Hydration owns water depth only.
   Hydration does not own terrain outline.
   Hydration does not paint land.
   Hydration preserves the clean blue Generation 1 body.
*/

(function attachPlanetOneHydrationDepth(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HYDRATION_DEPTH_TERRAIN_OUTLINE_HEX_BRIDGE_SET_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var SEA_LEVEL_DATUM = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function rgba(r, g, b, a) {
    return {
      r: Math.round(clamp(r, 0, 255)),
      g: Math.round(clamp(g, 0, 255)),
      b: Math.round(clamp(b, 0, 255)),
      a: clamp(a == null ? 1 : a, 0, 1)
    };
  }

  function get(sample, camelName, snakeName, fallback) {
    if (!sample) return fallback;
    if (sample[camelName] != null) return Number(sample[camelName]);
    if (sample[snakeName] != null) return Number(sample[snakeName]);
    return fallback;
  }

  function depthBandName(depth) {
    if (depth >= 0.72) return "DEEP_OCEAN";
    if (depth >= 0.42) return "MID_OCEAN";
    if (depth >= 0.16) return "SHALLOW_SHELF";
    return "COASTAL_WATER";
  }

  function depthColor(depth, shelf, coast, light) {
    var deep = rgba(4, 24, 68, 1);
    var mid = rgba(10, 70, 128, 1);
    var shelfTone = rgba(38, 134, 164, 1);
    var coastTone = rgba(76, 174, 184, 1);
    var r;
    var g;
    var b;

    if (depth >= 0.72) {
      r = mix(deep.r, mid.r, 0.20);
      g = mix(deep.g, mid.g, 0.20);
      b = mix(deep.b, mid.b, 0.20);
    } else if (depth >= 0.42) {
      r = mix(deep.r, mid.r, 0.72);
      g = mix(deep.g, mid.g, 0.72);
      b = mix(deep.b, mid.b, 0.72);
    } else if (depth >= 0.16) {
      r = mix(mid.r, shelfTone.r, shelf);
      g = mix(mid.g, shelfTone.g, shelf);
      b = mix(mid.b, shelfTone.b, shelf);
    } else {
      r = mix(shelfTone.r, coastTone.r, coast);
      g = mix(shelfTone.g, coastTone.g, coast);
      b = mix(shelfTone.b, coastTone.b, coast);
    }

    return rgba(
      r * light,
      g * light,
      b * light,
      1
    );
  }

  function sampleHydrationDepth(lon, lat, bridgeSample) {
    var s = bridgeSample || {};
    var rawDepth = get(s, "waterDepth", "water_depth", 0.62);
    var shelf = get(s, "shelfDistance", "shelf_distance", 0);
    var coast = get(s, "coastDistance", "coast_distance", 0);
    var outline = get(s, "terrainOutline", "terrain_outline", 0);
    var limb = get(s, "limbLight", "limb_light", 0.75);
    var vein = get(s, "veinCandidate", "vein_candidate", 0);
    var pressure = get(s, "pressureCut", "pressure_cut", 0);

    var depth = clamp(rawDepth, 0, 1);
    var boundaryHold = clamp(outline * 0.22 + vein * 0.08 + pressure * 0.05, 0, 0.30);
    var depthVisibility = clamp(0.55 + depth * 0.32 + shelf * 0.16 - boundaryHold * 0.14, 0.42, 1);
    var light = clamp(0.54 + limb * 0.46, 0.40, 1.12);
    var color = depthColor(depth, shelf, coast, light);

    return {
      version: VERSION,
      baseline: BASELINE,

      hydrationDepthLayerActive: true,
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      coastalWaterDepthActive: true,
      seaLevelDatumPreserved: true,
      terrainOutlineBlockedFromHydrationOwnership: true,

      seaLevelDatum: SEA_LEVEL_DATUM,
      depthBand: depthBandName(depth),
      waterDepth: round(depth, 4),
      water_depth: round(depth, 4),
      depthVisibility: round(depthVisibility, 4),
      depth_visibility: round(depthVisibility, 4),
      shelfTone: round(shelf, 4),
      shelf_tone: round(shelf, 4),
      coastTone: round(coast, 4),
      coast_tone: round(coast, 4),

      waterColor: color,
      color: color,

      visualPassClaimed: false
    };
  }

  function sampleHydrationSurface(lon, lat, bridgeSample) {
    return sampleHydrationDepth(lon, lat, bridgeSample);
  }

  function getHydrationStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,

      hydrationDepthLayerActive: true,
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      coastalWaterDepthActive: true,
      seaLevelDatumPreserved: true,
      terrainOutlineBlockedFromHydrationOwnership: true,

      hydrationLayerActive: true,
      hydrologyNetworkActive: false,
      terrainOwnership: false,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,
    sampleHydrationDepth: sampleHydrationDepth,
    sampleHydrationSurface: sampleHydrationSurface,
    getHydrationStatus: getHydrationStatus,
    getHydrologyStatus: getHydrationStatus,
    status: getHydrationStatus
  };

  global.DGBPlanetOneHydrationRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hydration-depth-ready", {
      detail: getHydrationStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
