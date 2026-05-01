/* G1 PLANET 1 HYDRATION BOUNDARY AND WATER DEFINITION
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_HYDRATION_BOUNDARY_AND_WATER_DEFINITION_TNT_v1
*/

(function attachPlanetOneHydrationRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HYDRATION_BOUNDARY_AND_WATER_DEFINITION_TNT_v1";
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

  function getSampleValue(sample, camelName, snakeName, fallback) {
    if (!sample) return fallback;
    if (sample[camelName] != null) return Number(sample[camelName]);
    if (sample[snakeName] != null) return Number(sample[snakeName]);
    return fallback;
  }

  function getDomain(sample) {
    if (!sample) return 0;
    return Number(sample.domain == null ? 0 : sample.domain);
  }

  function sampleHydrationSurface(lon, lat, surfaceSample) {
    var sample = surfaceSample || {};
    var domain = getDomain(sample);
    var height = getSampleValue(sample, "height", "height", 0);
    var waterDepth = getSampleValue(sample, "waterDepth", "water_depth", 0);
    var shelfDistance = getSampleValue(sample, "shelfDistance", "shelf_distance", 0);
    var coastDistance = getSampleValue(sample, "coastDistance", "coast_distance", 0);
    var landMask = getSampleValue(sample, "landMask", "land_mask", 0);
    var beachReady = Boolean(sample.beachReadyZone || sample.beach_ready_zone);
    var hill = getSampleValue(sample, "hillshade", "hillshade", 0.62);

    var deepOcean = domain === 0 || height < -0.18;
    var midOcean = !deepOcean && height < -0.055;
    var shelf = domain === 1 || (height >= -0.055 && height <= 0.08);
    var wetEdge = height > -0.025 && height <= 0.13;
    var emergentLand = height > 0.13 && landMask > 0.65;

    var hydrationAlpha;
    var terrainAlpha;
    var material;
    var color;

    if (deepOcean) {
      material = waterDepth > 0.68 ? "DEEP_OCEAN" : "MID_OCEAN";
      hydrationAlpha = 1;
      terrainAlpha = 0;
      color = rgba(
        mix(5, 14, hill),
        mix(24, 66, hill),
        mix(82, 154, hill),
        1
      );
    } else if (midOcean) {
      material = "MID_OCEAN";
      hydrationAlpha = 0.96;
      terrainAlpha = 0.04;
      color = rgba(
        mix(10, 22, hill),
        mix(58, 108, hill),
        mix(110, 168, hill),
        0.96
      );
    } else if (shelf) {
      material = beachReady ? "BEACH_READY_EDGE" : "SHALLOW_SHELF";
      hydrationAlpha = clamp(0.78 - Math.max(0, height) * 1.7 + shelfDistance * 0.18, 0.48, 0.92);
      terrainAlpha = clamp(1 - hydrationAlpha, 0.08, 0.46);
      color = rgba(
        mix(34, 116, shelfDistance) + (beachReady ? 22 : 0),
        mix(122, 204, shelfDistance) + (beachReady ? 14 : 0),
        mix(140, 188, shelfDistance) - (beachReady ? 24 : 0),
        hydrationAlpha
      );
    } else if (wetEdge) {
      material = "WET_EDGE";
      hydrationAlpha = clamp(0.36 - coastDistance * 0.16, 0.16, 0.40);
      terrainAlpha = clamp(1 - hydrationAlpha, 0.60, 0.84);
      color = rgba(
        mix(75, 150, shelfDistance),
        mix(130, 190, shelfDistance),
        mix(122, 158, shelfDistance),
        hydrationAlpha
      );
    } else if (emergentLand) {
      material = "EMERGENT_LAND";
      hydrationAlpha = clamp(0.08 * (1 - coastDistance), 0, 0.08);
      terrainAlpha = 1 - hydrationAlpha;
      color = rgba(54, 96, 104, hydrationAlpha);
    } else {
      material = "COASTAL_WATER";
      hydrationAlpha = 0.52;
      terrainAlpha = 0.48;
      color = rgba(64, 154, 162, hydrationAlpha);
    }

    return {
      version: VERSION,
      hydrationLayerActive: true,
      hydrationBoundaryContractActive: true,
      waterLandSeparationActive: true,

      deepOceanMaterialActive: true,
      midOceanMaterialActive: true,
      shallowShelfMaterialActive: true,
      coastalWaterBoundaryActive: true,
      wetEdgeTransitionActive: true,
      beachReadyWaterEdgeActive: true,

      terrainOverpaintBlocked: true,
      seaLevelDatumPreserved: true,
      seaLevelDatum: SEA_LEVEL_DATUM,

      material: material,
      hydrationMaterial: material,
      hydrationAlpha: round(hydrationAlpha, 4),
      terrainExpressionAlpha: round(terrainAlpha, 4),
      hydrationBoundaryMask: round(hydrationAlpha, 4),
      terrainAllowanceMask: round(terrainAlpha, 4),

      oceanDepthTone: round(waterDepth, 4),
      shelfTone: round(shelfDistance, 4),
      coastWetnessTone: round(1 - coastDistance, 4),

      waterColor: color,
      visualPassClaimed: false
    };
  }

  function getHydrationStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      hydrationLayerActive: true,
      hydrationBoundaryContractActive: true,
      waterLandSeparationActive: true,
      deepOceanMaterialActive: true,
      shallowShelfMaterialActive: true,
      coastalWaterBoundaryActive: true,
      wetEdgeTransitionActive: true,
      beachReadyWaterEdgeActive: true,
      terrainOverpaintBlocked: true,
      seaLevelDatumPreserved: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    sampleHydrationSurface: sampleHydrationSurface,
    getHydrationStatus: getHydrationStatus,
    status: getHydrationStatus
  };

  global.DGBPlanetOneHydrationRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hydration-ready", {
      detail: getHydrationStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
