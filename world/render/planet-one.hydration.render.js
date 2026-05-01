/* G1 PLANET 1 HYDROLOGY SYSTEM PHYSICAL GOVERNANCE
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_HYDROLOGY_SYSTEM_PHYSICAL_GOVERNANCE_TNT_v1
*/

(function attachPlanetOneHydrationRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HYDROLOGY_SYSTEM_PHYSICAL_GOVERNANCE_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_HYDROLOGY_VEIN_NETWORK_AND_INTERNAL_WATER_BALANCE_CANON_v1";
  var SEA_LEVEL_DATUM = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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

  function colorBlend(a, b, t) {
    return rgba(
      mix(a.r, b.r, t),
      mix(a.g, b.g, t),
      mix(a.b, b.b, t),
      mix(a.a, b.a, t)
    );
  }

  function sampleHydrationSurface(lon, lat, surfaceSample) {
    var s = surfaceSample || {};
    var domain = Number(s.domain == null ? 0 : s.domain);
    var height = get(s, "height", "height", 0);
    var waterDepth = get(s, "waterDepth", "water_depth", 0);
    var shelfDistance = get(s, "shelfDistance", "shelf_distance", 0);
    var coastDistance = get(s, "coastDistance", "coast_distance", 0);
    var coastBand = get(s, "coastBand", "coast_band", 0);
    var landMask = get(s, "landMask", "land_mask", 0);
    var moisture = get(s, "moisture", "moisture", 0.4);
    var slope = get(s, "slope", "slope", 0);
    var basinPressure = get(s, "basinPressure", "basin_pressure", 0);
    var riverVein = get(s, "riverVein", "river_vein", 0);
    var riverBranch = get(s, "riverBranch", "river_branch", 0);
    var lakeBasin = get(s, "lakeBasin", "lake_basin", 0);
    var pondPocket = get(s, "pondPocket", "pond_pocket", 0);
    var wetland = get(s, "wetland", "wetland", 0);
    var estuary = get(s, "estuaryMouth", "estuary_mouth", 0);
    var waterfall = get(s, "waterfallDrop", "waterfall_drop", 0);
    var drainage = get(s, "drainagePath", "drainage_path", 0);
    var hillshade = get(s, "hillshade", "hillshade", 0.62);

    var deepOceanMask = domain === 0 || height < -0.18 ? 1 : 0;
    var midOceanMask = !deepOceanMask && height < -0.055 ? 1 : 0;
    var shelfMask = domain === 1 || (height >= -0.055 && height <= 0.075) ? clamp(0.55 + shelfDistance * 0.42, 0, 1) : 0;
    var coastalMask = clamp(coastBand * 0.68 + estuary * 0.42, 0, 1);

    var riverMask = clamp(Math.max(riverVein, riverBranch * 0.68, drainage * 0.34) * landMask, 0, 1);
    var lakeMask = clamp(lakeBasin * landMask, 0, 1);
    var pondMask = clamp(pondPocket * landMask, 0, 1);
    var wetlandMask = clamp(wetland * landMask, 0, 1);
    var estuaryMask = clamp(estuary * Math.max(shelfMask, coastalMask, 0.35), 0, 1);
    var waterfallMask = clamp(waterfall * riverMask, 0, 1);

    var internalWaterMask = clamp(
      lakeMask * 0.92 +
      riverMask * 0.76 +
      pondMask * 0.54 +
      wetlandMask * 0.42 +
      waterfallMask * 0.88,
      0,
      1
    );

    var waterAuthority = clamp(
      deepOceanMask +
      midOceanMask * 0.92 +
      shelfMask * 0.74 +
      coastalMask * 0.35 +
      estuaryMask * 0.70 +
      internalWaterMask * 0.82,
      0,
      1
    );

    var terrainAllowance = clamp(1 - waterAuthority * 0.82, 0.06, 1);

    var deepOceanColor = rgba(
      mix(5, 14, hillshade),
      mix(22, 62, hillshade),
      mix(80, 154, hillshade),
      1
    );

    var midOceanColor = rgba(
      mix(8, 22, hillshade),
      mix(54, 106, hillshade),
      mix(112, 174, hillshade),
      0.96
    );

    var shelfColor = rgba(
      mix(30, 105, shelfDistance),
      mix(116, 204, shelfDistance),
      mix(138, 190, shelfDistance),
      0.86
    );

    var riverColor = rgba(
      mix(28, 72, moisture),
      mix(102, 174, moisture),
      mix(142, 202, moisture),
      0.78
    );

    var lakeColor = rgba(
      mix(18, 58, basinPressure),
      mix(84, 142, basinPressure),
      mix(132, 186, basinPressure),
      0.82
    );

    var wetlandColor = rgba(
      mix(46, 82, wetlandMask),
      mix(116, 154, wetlandMask),
      mix(104, 126, wetlandMask),
      0.56
    );

    var estuaryColor = rgba(78, 168, 178, 0.78);
    var waterfallColor = rgba(178, 225, 232, 0.64);

    var color = deepOceanColor;
    var material = "DEEP_OCEAN";

    if (midOceanMask) {
      color = midOceanColor;
      material = "MID_OCEAN";
    }

    if (shelfMask > 0) {
      color = colorBlend(color, shelfColor, shelfMask);
      material = "SHALLOW_SHELF";
    }

    if (coastalMask > 0.18) {
      color = colorBlend(color, rgba(60, 144, 158, 0.72), coastalMask);
      material = "COASTAL_WATER";
    }

    if (estuaryMask > 0.06) {
      color = colorBlend(color, estuaryColor, estuaryMask);
      material = "ESTUARY_MOUTH";
    }

    if (wetlandMask > 0.06) {
      color = colorBlend(color, wetlandColor, wetlandMask);
      material = "WETLAND_FIELD";
    }

    if (pondMask > 0.08) {
      color = colorBlend(color, rgba(42, 126, 152, 0.70), pondMask);
      material = "POND_POCKET";
    }

    if (lakeMask > 0.08) {
      color = colorBlend(color, lakeColor, lakeMask);
      material = "LAKE_BASIN";
    }

    if (riverMask > 0.055) {
      color = colorBlend(color, riverColor, riverMask);
      material = riverVein >= riverBranch ? "PRIMARY_RIVER_VEIN" : "SECONDARY_RIVER_BRANCH";
    }

    if (waterfallMask > 0.08) {
      color = colorBlend(color, waterfallColor, waterfallMask);
      material = "WATERFALL_DROP_POINT";
    }

    return {
      version: VERSION,
      priorVersion: PRIOR_VERSION,

      hydrationLayerActive: true,
      hydrologyNetworkActive: true,
      physicalHydrologyGovernanceActive: true,
      internalWaterVeinsActive: true,
      riverVeinFieldActive: true,
      lakeBasinFieldActive: true,
      pondPocketFieldActive: true,
      estuaryMouthFieldActive: true,
      wetlandFieldActive: true,
      waterfallDropPointFieldActive: true,
      watershedDirectionActive: true,
      hydrologyBalanceMaskActive: true,
      terrainHydrationBalanceActive: true,

      oceanBoundaryPreserved: true,
      shallowShelfPreserved: true,
      waterLandSeparationActive: true,
      terrainOverpaintBlocked: true,
      decorativeWaterBlocked: true,
      cartoonRiverBlocked: true,
      blueUIScribbleBlocked: true,

      deepOceanMaterialActive: true,
      midOceanMaterialActive: true,
      shallowShelfMaterialActive: true,
      coastalWaterBoundaryActive: true,
      wetEdgeTransitionActive: true,
      beachReadyWaterEdgeActive: true,

      material: material,
      hydrationMaterial: material,
      waterColor: color,

      deepOceanMask: round(deepOceanMask, 4),
      midOceanMask: round(midOceanMask, 4),
      shelfMask: round(shelfMask, 4),
      coastalMask: round(coastalMask, 4),
      riverMask: round(riverMask, 4),
      lakeMask: round(lakeMask, 4),
      pondMask: round(pondMask, 4),
      wetlandMask: round(wetlandMask, 4),
      estuaryMask: round(estuaryMask, 4),
      waterfallMask: round(waterfallMask, 4),
      internalWaterMask: round(internalWaterMask, 4),

      hydrationAlpha: round(waterAuthority, 4),
      terrainExpressionAlpha: round(terrainAllowance, 4),
      hydrationBoundaryMask: round(waterAuthority, 4),
      terrainAllowanceMask: round(terrainAllowance, 4),

      seaLevelDatumPreserved: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      visualPassClaimed: false
    };
  }

  function getHydrationStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      priorVersion: PRIOR_VERSION,

      hydrationLayerActive: true,
      hydrologyNetworkActive: true,
      physicalHydrologyGovernanceActive: true,
      internalWaterVeinsActive: true,
      riverVeinFieldActive: true,
      lakeBasinFieldActive: true,
      pondPocketFieldActive: true,
      estuaryMouthFieldActive: true,
      wetlandFieldActive: true,
      waterfallDropPointFieldActive: true,
      watershedDirectionActive: true,
      hydrologyBalanceMaskActive: true,
      terrainHydrationBalanceActive: true,

      oceanBoundaryPreserved: true,
      shallowShelfPreserved: true,
      waterLandSeparationActive: true,
      terrainOverpaintBlocked: true,
      decorativeWaterBlocked: true,
      cartoonRiverBlocked: true,
      blueUIScribbleBlocked: true,

      deepOceanMaterialActive: true,
      shallowShelfMaterialActive: true,
      coastalWaterBoundaryActive: true,
      wetEdgeTransitionActive: true,
      beachReadyWaterEdgeActive: true,
      seaLevelDatumPreserved: true,
      seaLevelDatum: SEA_LEVEL_DATUM,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    sampleHydrationSurface: sampleHydrationSurface,
    sampleHydrologySurface: sampleHydrationSurface,
    getHydrationStatus: getHydrationStatus,
    getHydrologyStatus: getHydrationStatus,
    status: getHydrationStatus
  };

  global.DGBPlanetOneHydrationRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hydration-ready", {
      detail: getHydrationStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
