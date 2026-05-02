/* G1 PLANET 1 REEF / SHELF / SHALLOW WATER HYDRATION LAYER
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_REEF_SHELF_SHALLOW_WATER_AND_LAND_EMERGENCE_TNT_v1
*/

(function attachPlanetOneHydrationLayer(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_REEF_SHELF_SHALLOW_WATER_AND_LAND_EMERGENCE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var SEA_LEVEL_DATUM = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
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

  function blendColor(a, b, t) {
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
    return "REEF_EDGE";
  }

  function sampleHydrationDepth(lon, lat, bridgeSample) {
    var sample = bridgeSample || {};
    var depth = clamp(get(sample, "waterDepth", "water_depth", 0.70), 0, 1);
    var shelf = clamp(get(sample, "shelfCandidate", "shelf_candidate", get(sample, "shelfDistance", "shelf_distance", 0)), 0, 1);
    var shallow = clamp(get(sample, "shallowWaterCandidate", "shallow_water_candidate", 0), 0, 1);
    var reef = clamp(get(sample, "reefCandidate", "reef_candidate", 0), 0, 1);
    var wetEdge = clamp(get(sample, "wetEdgeCandidate", "wet_edge_candidate", 0), 0, 1);
    var beachReady = clamp(get(sample, "beachReadyCandidate", "beach_ready_candidate", 0), 0, 1);
    var emergent = clamp(get(sample, "emergentLandCandidate", "emergent_land_candidate", 0), 0, 1);
    var limb = clamp(get(sample, "limbLight", "limb_light", 0.72), 0, 1);
    var outline = clamp(get(sample, "terrainOutline", "terrain_outline", 0), 0, 1);

    var deepColor = rgba(4, 24, 70, 1);
    var midColor = rgba(10, 78, 138, 1);
    var shelfColor = rgba(36, 134, 164, 1);
    var reefColor = rgba(82, 184, 184, 1);
    var wetColor = rgba(104, 174, 158, 1);
    var beachColor = rgba(142, 174, 132, 1);

    var color;
    if (depth >= 0.72) {
      color = blendColor(deepColor, midColor, 0.20);
    } else if (depth >= 0.42) {
      color = blendColor(deepColor, midColor, 0.78);
    } else if (depth >= 0.16) {
      color = blendColor(midColor, shelfColor, clamp(shelf + shallow * 0.35, 0, 1));
    } else {
      color = blendColor(shelfColor, reefColor, clamp(reef + shallow * 0.25, 0, 1));
    }

    color = blendColor(color, reefColor, reef * 0.36);
    color = blendColor(color, wetColor, wetEdge * 0.18);
    color = blendColor(color, beachColor, beachReady * 0.14);

    var light = clamp(0.58 + limb * 0.44 - emergent * 0.05 + outline * 0.03, 0.42, 1.12);
    color = rgba(color.r * light, color.g * light, color.b * light, 1);

    return {
      version: VERSION,
      baseline: BASELINE,

      hydrationDepthLayerActive: true,
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      coastalWaterDepthActive: true,
      reefDepthFieldActive: true,
      shallowWaterDepthActive: true,
      shelfDepthFieldActive: true,
      wetEdgeMoistureActive: true,
      seaLevelDatumPreserved: true,

      terrainOutlineBlockedFromHydrationOwnership: true,
      hydrationOwnsWaterDepthOnly: true,
      landPaintBlockedInHydration: true,

      depthBand: depthBand(depth),
      waterDepth: round(depth, 4),
      water_depth: round(depth, 4),
      shelfTone: round(shelf, 4),
      shelf_tone: round(shelf, 4),
      shallowWaterTone: round(shallow, 4),
      shallow_water_tone: round(shallow, 4),
      reefTone: round(reef, 4),
      reef_tone: round(reef, 4),
      wetEdgeTone: round(wetEdge, 4),
      wet_edge_tone: round(wetEdge, 4),
      beachReadyTone: round(beachReady, 4),
      beach_ready_tone: round(beachReady, 4),

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
      waterDepthFieldActive: true,
      deepOceanDepthActive: true,
      midOceanDepthActive: true,
      shallowShelfDepthActive: true,
      coastalWaterDepthActive: true,
      reefDepthFieldActive: true,
      shallowWaterDepthActive: true,
      shelfDepthFieldActive: true,
      wetEdgeMoistureActive: true,
      seaLevelDatumPreserved: true,

      terrainOutlineBlockedFromHydrationOwnership: true,
      hydrationOwnsWaterDepthOnly: true,
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
