/* G1 PLANET 1 BEACH THRESHOLD HYDRATION LAYER
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_BEACH_THRESHOLD_TO_TERRAIN_STARTLINE_TNT_v1

   LAW:
   Hydration finalizes water depth.
   Hydration reveals the beach threshold.
   Hydration does not fill beach as land.
   Hydration does not raise terrain.
*/

(function attachPlanetOneBeachThresholdHydration(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_BEACH_THRESHOLD_TO_TERRAIN_STARTLINE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var SEA_LEVEL_DATUM = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * m) / m;
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

  function blend(a, b, t) {
    return rgba(
      mix(a.r, b.r, t),
      mix(a.g, b.g, t),
      mix(a.b, b.b, t),
      mix(a.a, b.a, t)
    );
  }

  function depthBand(depth) {
    if (depth >= 0.72) return "DEEP_OCEAN";
    if (depth >= 0.42) return "MID_OCEAN";
    if (depth >= 0.16) return "SHALLOW_SHELF";
    return "WET_EDGE";
  }

  function sampleHydrationDepth(lon, lat, bridgeSample) {
    var s = bridgeSample || {};

    var depth = clamp(get(s, "waterDepth", "water_depth", 0.72), 0, 1);
    var shelf = clamp(get(s, "shelfField", "shelf_field", get(s, "shelfCandidate", "shelf_candidate", 0)), 0, 1);
    var reef = clamp(get(s, "reefField", "reef_field", get(s, "reefCandidate", "reef_candidate", 0)), 0, 1);
    var wetEdge = clamp(get(s, "wetEdge", "wet_edge", get(s, "wetEdgeCandidate", "wet_edge_candidate", 0)), 0, 1);
    var beachCandidate = clamp(get(s, "beachCandidate", "beach_candidate", 0), 0, 1);
    var beachLock = clamp(get(s, "beachLock", "beach_lock", 0), 0, 1);
    var limb = clamp(get(s, "limbLight", "limb_light", 0.72), 0, 1);

    var deepColor = rgba(4, 22, 68, 1);
    var midColor = rgba(8, 70, 132, 1);
    var shelfColor = rgba(32, 134, 166, 1);
    var reefColor = rgba(76, 184, 188, 1);
    var wetColor = rgba(96, 176, 164, 1);
    var beachEdgeColor = rgba(202, 194, 142, 1);

    var color;
    if (depth >= 0.72) {
      color = blend(deepColor, midColor, 0.22);
    } else if (depth >= 0.42) {
      color = blend(deepColor, midColor, 0.78);
    } else if (depth >= 0.16) {
      color = blend(midColor, shelfColor, shelf * 0.88);
    } else {
      color = blend(shelfColor, reefColor, Math.max(reef, wetEdge * 0.42));
    }

    color = blend(color, reefColor, reef * 0.30);
    color = blend(color, wetColor, wetEdge * 0.22);
    color = blend(color, beachEdgeColor, beachCandidate * 0.10 + beachLock * 0.24);

    var light = clamp(0.56 + limb * 0.46 + beachLock * 0.03, 0.38, 1.12);
    color = rgba(color.r * light, color.g * light, color.b * light, 1);

    return {
      version: VERSION,
      baseline: BASELINE,

      hydrationDepthLayerActive: true,
      beachThresholdLayerActive: true,
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      wetEdgeDepthActive: true,
      reefDepthFieldActive: true,
      beachCandidateFieldActive: true,
      beachLockFieldActive: true,
      seaLevelDatumPreserved: true,

      hydrationOwnsWaterDepthOnly: true,
      hydrationRevealsBeachThresholdOnly: true,
      beachFillBlockedInHydration: true,
      terrainStartlineBlockedFromHydrationOwnership: true,
      landPaintBlockedInHydration: true,

      depthBand: depthBand(depth),
      waterDepth: round(depth, 4),
      water_depth: round(depth, 4),
      shelfTone: round(shelf, 4),
      shelf_tone: round(shelf, 4),
      reefTone: round(reef, 4),
      reef_tone: round(reef, 4),
      wetEdgeTone: round(wetEdge, 4),
      wet_edge_tone: round(wetEdge, 4),
      beachCandidateTone: round(beachCandidate, 4),
      beach_candidate_tone: round(beachCandidate, 4),
      beachLockTone: round(beachLock, 4),
      beach_lock_tone: round(beachLock, 4),

      seaLevelDatum: SEA_LEVEL_DATUM,
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
      beachThresholdLayerActive: true,
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      wetEdgeDepthActive: true,
      reefDepthFieldActive: true,
      beachCandidateFieldActive: true,
      beachLockFieldActive: true,
      seaLevelDatumPreserved: true,

      hydrationOwnsWaterDepthOnly: true,
      hydrationRevealsBeachThresholdOnly: true,
      beachFillBlockedInHydration: true,
      terrainStartlineBlockedFromHydrationOwnership: true,
      landPaintBlockedInHydration: true,

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
