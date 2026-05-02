/* G1 PLANET 1 WATER PHASE-STATE BOUNDARY HEX BRIDGE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_WATER_PHASE_STATE_BOUNDARY_TNT_v1

   LAW:
   Water is one identity in three states: solid, liquid, gas.
   Liquid water owns ocean/shelf/reef/wet edge.
   Solid water owns ice/frozen storage.
   Gas water owns vapor/humidity/cloud/condensation.
   Weather may read surfaces but may not repaint land or liquid water.
*/

(function attachPlanetOneWaterPhaseStateBoundaryHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_WATER_PHASE_STATE_BOUNDARY_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_LAND_MASK_AIR_OPACITY_REBALANCE_TNT_v1";
  var LAYER_VERSION = "G1_PLANET_1_TRI_DOMAIN_256_WHOLE_WORLD_CONTAINER_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(a, b, value) {
    var t = clamp((value - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * m) / m;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function hash2(a, b, seed) {
    var x = Math.sin(a * 127.1 + b * 311.7 + (seed || SEED) * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function noise(lon, lat, scale, seed) {
    return hash2(Math.round(lon * scale), Math.round(lat * scale), seed || SEED);
  }

  function fbm(lon, lat, seed) {
    return (
      noise(lon, lat, 0.34, seed + 11) * 0.34 +
      noise(lon, lat, 0.76, seed + 29) * 0.26 +
      noise(lon, lat, 1.48, seed + 47) * 0.20 +
      noise(lon, lat, 2.96, seed + 83) * 0.13 +
      noise(lon, lat, 5.92, seed + 131) * 0.07
    );
  }

  function ridgeSignal(lon, lat, seed) {
    var n = fbm(lon * 1.18 + 17.2, lat * 1.08 - 8.4, seed + 606);
    return 1 - Math.abs(n * 2 - 1);
  }

  function stateId(a, b, c, d) {
    return (((a * 4 + b) * 4 + c) * 4 + d);
  }

  function buildStateReceipt(label) {
    var states = [];
    var a;
    var b;
    var c;
    var d;

    for (a = 0; a < 4; a += 1) {
      for (b = 0; b < 4; b += 1) {
        for (c = 0; c < 4; c += 1) {
          for (d = 0; d < 4; d += 1) {
            states.push({ state_id: stateId(a, b, c, d), a: a, b: b, c: c, d: d });
          }
        }
      }
    }

    return {
      label: label,
      ok: states.length === STATE_COUNT,
      stateFormula: STATE_FORMULA,
      stateCount: states.length,
      requiredStateCount: STATE_COUNT,
      preview: states.slice(0, 16)
    };
  }

  function bodyScore(lon, lat, centerLon, centerLat, rx, ry, weight, wrap) {
    var dx = Math.abs(normalizeLon(lon - centerLon)) / rx;
    var dy = (lat - centerLat) / ry;
    var curve = Math.cos(degToRad(lon - centerLon)) * wrap;
    return weight * (1 - (dx * dx + dy * dy)) + curve;
  }

  function landPotential(lon, lat, seed) {
    var west = bodyScore(lon, lat, -92, 4, 72, 78, 1.05, 0.15);
    var east = bodyScore(lon, lat, 96, -6, 66, 72, 1.00, 0.13);
    var north = bodyScore(lon, lat, 28, 38, 36, 28, 0.68, 0.04);
    var south = bodyScore(lon, lat, -22, -38, 42, 30, 0.66, 0.04);
    var far = bodyScore(lon, lat, 178, 14, 34, 42, 0.60, 0.10);
    var grain = (fbm(lon, lat, seed + 300) - 0.5) * 0.22;
    return Math.max(west, east, north, south, far) + grain;
  }

  function nodalIndex256(lon, lat) {
    var lonBand = Math.floor(((normalizeLon(lon) + 180) / 360) * 16);
    var latBand = Math.floor(((clamp(lat, -90, 90) + 90) / 180) * 16);
    return clamp(latBand, 0, 15) * 16 + clamp(lonBand, 0, 15);
  }

  function cardinalNode(lon, lat) {
    var absLon = Math.abs(normalizeLon(lon));
    var absLat = Math.abs(lat);
    if (absLat >= absLon * 0.55) return lat >= 0 ? "NORTH" : "SOUTH";
    return normalizeLon(lon) >= 0 ? "EAST" : "WEST";
  }

  function sampleBridge(lon, lat, options) {
    options = options || {};
    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var seed = Number(options.seed || SEED);
    var absLat = Math.abs(lat);
    var polar = absLat >= 73 ? 1 : 0;

    var potential = landPotential(lon, lat, seed);
    var ridge = ridgeSignal(lon, lat, seed);
    var texture = fbm(lon * 2.8, lat * 2.35, seed + 840);
    var fine = fbm(lon * 6.4, lat * 5.7, seed + 1210);
    var weatherNoise = fbm(lon * 1.4 + 55, lat * 1.2 - 21, seed + 2200);

    var outline = smoothstep(0.035, 0.26, potential);
    var shelf = clamp(1 - Math.abs(potential - 0.055) / 0.32, 0, 1);
    var coastContact = clamp(1 - Math.abs(potential - 0.13) / 0.17, 0, 1);
    var reefNoise = fbm(lon * 2.5, lat * 2.1, seed + 909);

    var reef = clamp(shelf * coastContact * smoothstep(0.39, 0.88, reefNoise) * (1 - polar), 0, 1);
    var shallow = clamp(shelf * (1 - smoothstep(0.36, 0.74, potential)), 0, 1);
    var wetEdge = clamp(coastContact * outline * 0.96, 0, 1);

    var beachCandidate = clamp(wetEdge * smoothstep(0.08, 0.38, potential) * (1 - reef * 0.16), 0, 1);
    var beachLock = clamp(beachCandidate * smoothstep(0.28, 0.58, coastContact) * smoothstep(0.13, 0.38, outline), 0, 1);
    var beachEdgeContrast = clamp(beachLock * 0.82 + wetEdge * 0.22 + reef * 0.12, 0, 1);

    var terrainPermission = clamp(beachLock * 0.60 + outline * smoothstep(0.36, 0.72, potential) * 0.72, 0, 1);

    var lowlandValue = clamp(
      terrainPermission * (wetEdge * 0.50 + shallow * 0.22 + (1 - smoothstep(0.52, 0.76, potential)) * 0.56),
      0,
      1
    );

    var livingTerrainValue = clamp(
      terrainPermission * smoothstep(0.42, 0.80, potential) * (0.72 + texture * 0.36) * (1 - reef * 0.36),
      0,
      1
    );

    var ridgeValue = clamp(
      terrainPermission * ridge * smoothstep(0.60, 0.94, potential) * (0.36 + fine * 0.26),
      0,
      0.74
    );

    var waterDivideValue = clamp(ridgeValue * 0.70 + terrainPermission * ridge * smoothstep(0.68, 0.98, potential) * 0.24, 0, 1);
    var highElevationIceState = clamp(waterDivideValue * (0.30 + absLat / 145) * (1 - reef * 0.86), 0, 0.62);

    var liquidWaterDepth = clamp(
      0.82 - potential * 0.48 - shelf * 0.20 - reef * 0.12 - beachLock * 0.04 + highElevationIceState * 0.04,
      0.09,
      0.96
    );

    if (polar) liquidWaterDepth = clamp(liquidWaterDepth * 0.72 + highElevationIceState * 0.10, 0.10, 0.66);

    var solidWaterStorage = clamp(highElevationIceState + polar * 0.18 + waterDivideValue * 0.12, 0, 0.72);

    var evaporationPotential = clamp(
      liquidWaterDepth * 0.18 +
      shelf * 0.18 +
      reef * 0.10 +
      wetEdge * 0.16 +
      weatherNoise * 0.18,
      0,
      0.58
    );

    var vaporHumidity = clamp(
      evaporationPotential * 0.42 +
      wetEdge * 0.16 +
      lowlandValue * 0.08 +
      weatherNoise * 0.18,
      0,
      0.58
    );

    var condensationPotential = clamp(
      vaporHumidity * 0.44 +
      solidWaterStorage * 0.12 +
      ridgeValue * 0.08 +
      weatherNoise * 0.16,
      0,
      0.46
    );

    var cloudGasMask = clamp(
      smoothstep(0.34, 0.70, condensationPotential) * (0.035 + weatherNoise * 0.040),
      0,
      0.075
    );

    var precipitationPotential = clamp(
      condensationPotential * 0.35 +
      solidWaterStorage * 0.10 +
      ridgeValue * 0.08,
      0,
      0.36
    );

    var precipitationVisualHeld = true;
    var precipitationContactAlpha = 0;

    var atmosphereMask = clamp(0.010 + vaporHumidity * 0.020 + condensationPotential * 0.016, 0, 0.048);
    var gasOverlayAlpha = clamp(cloudGasMask + atmosphereMask, 0, 0.095);

    var materialTone = clamp(
      beachLock * 0.25 +
      lowlandValue * 0.30 +
      livingTerrainValue * 0.40 +
      ridgeValue * 0.15 +
      solidWaterStorage * 0.10,
      0,
      1
    );

    var terrainIdentity = clamp(
      beachLock * 0.18 +
      lowlandValue * 0.34 +
      livingTerrainValue * 0.52 +
      ridgeValue * 0.20 +
      solidWaterStorage * 0.10,
      0,
      1
    );

    var landMaskRaw = clamp(
      beachLock * 0.66 +
      lowlandValue * 0.60 +
      livingTerrainValue * 0.82 +
      ridgeValue * 0.24 +
      solidWaterStorage * 0.12,
      0,
      1
    );

    var featheredLandMask = smoothstep(0.045, 0.32, landMaskRaw) * clamp(0.68 + landMaskRaw * 0.28, 0, 0.92);
    var shorelineFeather = clamp(beachLock * 0.46 + wetEdge * 0.16, 0, 0.50);

    var liquidWaterValue = clamp(liquidWaterDepth * 0.44 + shelf * 0.15 + reef * 0.13 + wetEdge * 0.12, 0, 1);
    var solidWaterValue = clamp(solidWaterStorage, 0, 1);
    var gasWaterValue = clamp(vaporHumidity * 0.44 + condensationPotential * 0.38 + cloudGasMask * 0.18, 0, 1);

    var waterIdentityValue = clamp((liquidWaterValue + solidWaterValue + gasWaterValue) / 3, 0, 1);

    var landDomainValue = clamp(
      terrainPermission * 0.28 +
      lowlandValue * 0.24 +
      livingTerrainValue * 0.34 +
      ridgeValue * 0.12 +
      solidWaterStorage * 0.06,
      0,
      1
    );

    var airDomainValue = clamp(
      gasWaterValue * 0.50 +
      vaporHumidity * 0.18 +
      condensationPotential * 0.20 +
      weatherNoise * 0.12,
      0,
      1
    );

    var evaporationReadsLiquidOnly = true;
    var evaporationCannotEraseWaterDepth = true;
    var condensationCreatesGasOverlayOnly = true;
    var condensationCannotRepaintSurface = true;
    var precipitationHeldAsPotential = true;
    var precipitationCannotOverwriteLand = true;
    var precipitationCannotOverwriteOcean = true;
    var cloudsDoNotBecomeWater = true;
    var waterDoesNotBecomeCloud = true;
    var iceDoesNotBecomeLand = true;
    var landDoesNotOwnWaterPhase = true;

    var waterLandExchange = clamp(beachLock * 0.44 + wetEdge * 0.32 + lowlandValue * 0.30, 0, 1);
    var landAirExchange = clamp(landDomainValue * 0.34 + ridgeValue * 0.22 + gasWaterValue * 0.20, 0, 1);
    var airWaterExchange = clamp(gasWaterValue * 0.34 + condensationPotential * 0.20 + liquidWaterDepth * 0.18 + solidWaterStorage * 0.10, 0, 1);
    var triDomainCycleValue = clamp(waterLandExchange * 0.34 + landAirExchange * 0.33 + airWaterExchange * 0.33, 0, 1);
    var wholeWorldCoherence = clamp((liquidWaterValue + landDomainValue + airDomainValue + triDomainCycleValue) / 4, 0, 1);

    var sourceTraceValid = (
      liquidWaterValue >= 0 &&
      solidWaterValue >= 0 &&
      gasWaterValue >= 0 &&
      landDomainValue >= 0 &&
      airDomainValue >= 0 &&
      wholeWorldCoherence >= 0 &&
      (terrainIdentity === 0 || beachLock > 0.08 || lowlandValue > 0.10 || livingTerrainValue > 0.10 || solidWaterStorage > 0.06)
    );

    if (!sourceTraceValid) {
      featheredLandMask = 0;
      gasOverlayAlpha = clamp(gasOverlayAlpha, 0, 0.06);
    }

    return {
      VERSION: VERSION,
      version: VERSION,
      PRIOR_VERSION: PRIOR_VERSION,
      priorVersion: PRIOR_VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,
      nodalIndex256: nodalIndex256(lon, lat),
      cardinalNode: cardinalNode(lon, lat),

      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesActive: true,
      waterIdentityPreservedAcrossStates: true,

      solidWaterOwnsIceStorage: true,
      liquidWaterOwnsSurface: true,
      gasWaterOwnsAtmosphericMoisture: true,

      liquidWaterSurfaceMaterialActive: true,
      solidWaterIceStorageMaterialActive: true,
      gasWaterOverlayMaterialActive: true,

      evaporationReadsLiquidOnly: evaporationReadsLiquidOnly,
      evaporationCannotEraseWaterDepth: evaporationCannotEraseWaterDepth,

      condensationCreatesGasOverlayOnly: condensationCreatesGasOverlayOnly,
      condensationCannotRepaintSurface: condensationCannotRepaintSurface,

      precipitationHeldAsPotential: precipitationHeldAsPotential,
      precipitationCannotOverwriteLand: precipitationCannotOverwriteLand,
      precipitationCannotOverwriteOcean: precipitationCannotOverwriteOcean,

      cloudsDoNotBecomeWater: cloudsDoNotBecomeWater,
      waterDoesNotBecomeCloud: waterDoesNotBecomeCloud,
      iceDoesNotBecomeLand: iceDoesNotBecomeLand,
      landDoesNotOwnWaterPhase: landDoesNotOwnWaterPhase,

      weatherBoundaryActive: true,
      weatherReadsButDoesNotRepaintSurface: true,
      weatherProcessNonInterferenceActive: true,

      landMaskAirOpacityRebalanceActive: true,
      surfaceAirLayerSeparationActive: true,
      waterSurfaceMaterialActive: true,
      landSurfaceMaterialActive: true,
      airOverlayMaterialActive: true,
      landMaskSeparationActive: true,
      surfaceFirstAirSecondCompositor: true,
      cloudOpacityCapped: true,
      featheredLandMaskActive: true,
      noCartoonCutoutEdges: true,

      wholeWorldContainerActive: true,
      triDomain256Active: true,
      water256Active: true,
      land256Active: true,
      air256Active: true,
      wholeWorld256Active: true,

      liquidWaterDepth: round(liquidWaterDepth, 4),
      waterDepth: round(liquidWaterDepth, 4),
      shelfField: round(shelf, 4),
      reefField: round(reef, 4),
      shallowWaterField: round(shallow, 4),
      wetEdge: round(wetEdge, 4),

      solidWaterStorage: round(solidWaterStorage, 4),
      highElevationIceState: round(highElevationIceState, 4),
      waterDivideValue: round(waterDivideValue, 4),

      gasWaterValue: round(gasWaterValue, 4),
      vaporHumidity: round(vaporHumidity, 4),
      evaporationPotential: round(evaporationPotential, 4),
      condensationPotential: round(condensationPotential, 4),
      cloudGasMask: round(cloudGasMask, 4),
      atmosphereMask: round(atmosphereMask, 4),
      gasOverlayAlpha: round(gasOverlayAlpha, 4),
      airOverlayAlpha: round(gasOverlayAlpha, 4),
      precipitationPotential: round(precipitationPotential, 4),
      precipitationContactAlpha: round(precipitationContactAlpha, 4),
      precipitationVisualHeld: precipitationVisualHeld,

      beachCandidate: round(beachCandidate, 4),
      beachLock: round(beachLock, 4),
      beachEdgeContrast: round(beachEdgeContrast, 4),
      terrainPermission: round(terrainPermission, 4),
      lowlandValue: round(lowlandValue, 4),
      livingTerrainValue: round(livingTerrainValue, 4),
      ridgeValue: round(ridgeValue, 4),
      materialTone: round(materialTone, 4),
      terrainIdentity: round(terrainIdentity, 4),
      landMask: round(landMaskRaw, 4),
      featheredLandMask: round(featheredLandMask, 4),
      shorelineFeather: round(shorelineFeather, 4),

      liquidWaterValue: round(liquidWaterValue, 4),
      solidWaterValue: round(solidWaterValue, 4),
      waterIdentityValue: round(waterIdentityValue, 4),
      landDomainValue: round(landDomainValue, 4),
      airDomainValue: round(airDomainValue, 4),
      waterLandExchange: round(waterLandExchange, 4),
      landAirExchange: round(landAirExchange, 4),
      airWaterExchange: round(airWaterExchange, 4),
      triDomainCycleValue: round(triDomainCycleValue, 4),
      wholeWorldCoherence: round(wholeWorldCoherence, 4),

      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,
      waterSovereigntyPreserved: true,
      noGlacierDivideAuthority: true,
      noSeparateGlacierSystem: true,
      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      visualPassClaimed: false
    };
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c;
    var sinC;
    var cosC;
    var lat0;
    var lon0;
    var lat;
    var lon;

    if (rho > 1) return null;
    if (rho < 0.000001) return { lon: normalizeLon(viewLon), lat: viewLat || 0, limb: 1 };

    c = Math.asin(rho);
    sinC = Math.sin(c);
    cosC = Math.cos(c);
    lat0 = degToRad(viewLat || 0);
    lon0 = degToRad(viewLon || 0);

    lat = Math.asin(cosC * Math.sin(lat0) + (y * sinC * Math.cos(lat0)) / rho);
    lon = lon0 + Math.atan2(
      x * sinC,
      rho * Math.cos(lat0) * cosC - y * Math.sin(lat0) * sinC
    );

    return {
      lon: normalizeLon(radToDeg(lon)),
      lat: clamp(radToDeg(lat), -90, 90),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    return null;
  }

  function getHydration() {
    return global.DGBPlanetOneHydrationRender || null;
  }

  function rgba(r, g, b, a) {
    return [Math.round(clamp(r, 0, 255)), Math.round(clamp(g, 0, 255)), Math.round(clamp(b, 0, 255)), Math.round(clamp(a, 0, 255))];
  }

  function mixColor(a, b, t) {
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t),
      mix(a[3], b[3], t)
    ];
  }

  function getLayerColors(sample, hydration, limb) {
    var hydrationColor = hydration && hydration.waterColor ? hydration.waterColor : null;

    var deep = [5, 30, 88, 255];
    var mid = hydrationColor ? [hydrationColor.r, hydrationColor.g, hydrationColor.b, 255] : [13, 78, 142, 255];
    var shelf = [34, 146, 180, 255];
    var reef = [72, 198, 188, 255];

    var beach = [246, 224, 150, 255];
    var wet = [88, 146, 88, 255];
    var living = [52, 126, 62, 255];
    var earth = [118, 105, 70, 255];
    var ridge = [128, 130, 110, 255];
    var ice = [188, 232, 238, 255];

    var gasCloud = [222, 235, 240, 255];
    var vaporHaze = [142, 184, 222, 255];

    var water = mixColor(deep, mid, 1 - sample.liquidWaterDepth);
    water = mixColor(water, shelf, clamp(sample.shelfField * 0.36 + sample.shallowWaterField * 0.18, 0, 0.54));
    water = mixColor(water, reef, clamp(sample.reefField * 0.26, 0, 0.26));

    var land = beach;
    land = mixColor(land, wet, clamp(sample.lowlandValue * 0.52, 0, 0.52));
    land = mixColor(land, living, clamp(sample.livingTerrainValue * 0.74, 0, 0.74));
    land = mixColor(land, earth, clamp(sample.materialTone * 0.24, 0, 0.24));
    land = mixColor(land, ridge, clamp(sample.ridgeValue * 0.30, 0, 0.30));
    land = mixColor(land, ice, clamp(sample.solidWaterStorage * 0.26, 0, 0.26));

    var beachEdge = mixColor(water, beach, clamp(sample.beachEdgeContrast * 0.54, 0, 0.54));
    land = mixColor(land, beachEdge, clamp(sample.shorelineFeather * 0.28, 0, 0.28));

    var gas = mixColor(vaporHaze, gasCloud, clamp(sample.cloudGasMask * 6.0, 0, 0.42));

    var shade = clamp(0.56 + limb * 0.50, 0.42, 1.10);
    water = rgba(water[0] * shade, water[1] * shade, water[2] * shade, 255);
    land = rgba(land[0] * shade, land[1] * shade, land[2] * shade, sample.featheredLandMask * 255);
    gas = rgba(gas[0], gas[1], gas[2], sample.gasOverlayAlpha * 255);

    return { liquid: water, land: land, gas: gas };
  }

  function writePixel(data, index, color) {
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  }

  function makeCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    if (!ctx) return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };

    var options = gridOrOptions && gridOrOptions.cells ? maybeOptions || {} : gridOrOptions || {};
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.84), 0.56, 1);
    var width = Math.max(260, Math.round(canvas.width * scale));
    var height = Math.max(260, Math.round(canvas.height * scale));
    var cx = width / 2;
    var cy = height / 2;
    var radius = Number(options.radius || Math.min(canvas.width, canvas.height) * 0.43) * scale;
    var viewLon = Number(options.viewLon == null ? -28 : options.viewLon);
    var viewLat = Number(options.viewLat == null ? 0 : options.viewLat);
    var seed = Number(options.seed || SEED);

    var liquidCanvas = makeCanvas(width, height);
    var landCanvas = makeCanvas(width, height);
    var gasCanvas = makeCanvas(width, height);

    var liquidCtx = liquidCanvas.getContext("2d");
    var landCtx = landCanvas.getContext("2d");
    var gasCtx = gasCanvas.getContext("2d");

    var liquidImage = liquidCtx.createImageData(width, height);
    var landImage = landCtx.createImageData(width, height);
    var gasImage = gasCtx.createImageData(width, height);

    var liquidData = liquidImage.data;
    var landData = landImage.data;
    var gasData = gasImage.data;
    var hydrationEngine = getHydration();

    var x;
    var y;
    var dx;
    var dy;
    var index;
    var geo;
    var sample;
    var hydration;
    var colors;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
        index = (y * width + x) * 4;

        if (dx * dx + dy * dy > 1) {
          liquidData[index + 3] = 0;
          landData[index + 3] = 0;
          gasData[index + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, viewLon, viewLat);
        if (!geo) continue;

        sample = sampleBridge(geo.lon, geo.lat, { seed: seed });
        hydration = hydrationEngine && hydrationEngine.sampleHydrationDepth
          ? hydrationEngine.sampleHydrationDepth(geo.lon, geo.lat, sample)
          : null;

        colors = getLayerColors(sample, hydration, geo.limb);

        writePixel(liquidData, index, colors.liquid);
        writePixel(landData, index, colors.land);
        writePixel(gasData, index, colors.gas);
      }
    }

    liquidCtx.putImageData(liquidImage, 0, 0);
    landCtx.putImageData(landImage, 0, 0);
    gasCtx.putImageData(gasImage, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = 1;

    ctx.drawImage(liquidCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(landCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(gasCanvas, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      layerVersion: LAYER_VERSION,

      waterPhaseStateBoundaryRendered: true,
      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesRendered: true,
      solidLiquidGasWaterStatesActive: true,

      solidWaterOwnsIceStorage: true,
      liquidWaterOwnsSurface: true,
      gasWaterOwnsAtmosphericMoisture: true,

      evaporationReadsLiquidOnly: true,
      evaporationCannotEraseWaterDepth: true,
      condensationCreatesGasOverlayOnly: true,
      condensationCannotRepaintSurface: true,
      precipitationHeldAsPotential: true,
      precipitationCannotOverwriteLand: true,
      precipitationCannotOverwriteOcean: true,

      cloudsDoNotBecomeWater: true,
      waterDoesNotBecomeCloud: true,
      iceDoesNotBecomeLand: true,
      landDoesNotOwnWaterPhase: true,

      weatherBoundaryRendered: true,
      weatherBoundaryActive: true,
      weatherReadsButDoesNotRepaintSurface: true,
      weatherProcessNonInterferenceActive: true,

      liquidSurfaceRenderedFirst: true,
      landSurfaceRenderedSecond: true,
      gasOverlayRenderedThird: true,

      landMaskAirOpacityRebalanceRendered: true,
      surfaceAirLayerSeparationRendered: true,
      waterSurfaceMaterialRendered: true,
      landSurfaceMaterialRendered: true,
      airOverlayMaterialRendered: true,
      landMaskSeparationRendered: true,
      surfaceFirstAirSecondCompositor: true,
      cloudOpacityCapped: true,
      featheredLandMaskActive: true,
      noCartoonCutoutEdges: true,

      wholeWorldContainerRendered: true,
      triDomain256Rendered: true,
      water256Rendered: true,
      land256Rendered: true,
      air256Rendered: true,
      wholeWorld256Rendered: true,

      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      hydrationReadOnlyPreserved: true,
      terrainAuthorityBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,
      noPublicHoneycomb: true,
      noPublicDotGrid: true,

      rendererConsumesHydration: Boolean(hydrationEngine),
      rendererConsumesHexBridge: true,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return lastDraw;
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};
    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var cells = [];
    var lon;
    var lat;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(sampleBridge(lon, lat, options));
      }
    }

    lastGrid = {
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      cellCount: cells.length,
      cells: cells,
      visualPassClaimed: false
    };

    return lastGrid;
  }

  function getHexgridStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      PRIOR_VERSION: PRIOR_VERSION,
      priorVersion: PRIOR_VERSION,
      LAYER_VERSION: LAYER_VERSION,
      layerVersion: LAYER_VERSION,
      baseline: BASELINE,

      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesActive: true,
      waterIdentityPreservedAcrossStates: true,

      solidWaterOwnsIceStorage: true,
      liquidWaterOwnsSurface: true,
      gasWaterOwnsAtmosphericMoisture: true,

      evaporationReadsLiquidOnly: true,
      evaporationCannotEraseWaterDepth: true,
      condensationCreatesGasOverlayOnly: true,
      condensationCannotRepaintSurface: true,
      precipitationHeldAsPotential: true,
      precipitationCannotOverwriteLand: true,
      precipitationCannotOverwriteOcean: true,

      cloudsDoNotBecomeWater: true,
      waterDoesNotBecomeCloud: true,
      iceDoesNotBecomeLand: true,
      landDoesNotOwnWaterPhase: true,

      weatherBoundaryActive: true,
      weatherReadsButDoesNotRepaintSurface: true,
      weatherProcessNonInterferenceActive: true,

      landMaskAirOpacityRebalanceActive: true,
      surfaceAirLayerSeparationActive: true,
      waterSurfaceMaterialActive: true,
      landSurfaceMaterialActive: true,
      airOverlayMaterialActive: true,
      landMaskSeparationActive: true,
      surfaceFirstAirSecondCompositor: true,
      cloudOpacityCapped: true,
      featheredLandMaskActive: true,
      noCartoonCutoutEdges: true,

      wholeWorldContainerActive: true,
      triDomain256Active: true,
      water256Active: true,
      land256Active: true,
      air256Active: true,
      wholeWorld256Active: true,

      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      terrainFillBlocked: true,
      waterSovereigntyPreserved: true,

      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,

      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      requiredStateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,

      wholeWorld256Receipt: buildStateReceipt("WHOLE_WORLD_256"),
      water256Receipt: buildStateReceipt("WATER_256"),
      land256Receipt: buildStateReceipt("LAND_256"),
      air256Receipt: buildStateReceipt("AIR_256"),

      lastGrid: lastGrid ? { cellCount: lastGrid.cellCount, version: lastGrid.version } : null,
      lastDraw: lastDraw,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    PRIOR_VERSION: PRIOR_VERSION,
    priorVersion: PRIOR_VERSION,
    LAYER_VERSION: LAYER_VERSION,
    layerVersion: LAYER_VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,
    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    requiredStateCount: STATE_COUNT,

    sampleBridge: sampleBridge,
    samplePlanetSurface: sampleBridge,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: getHexgridStatus,
    getLatticeReceipt: function () {
      return {
        wholeWorld256: buildStateReceipt("WHOLE_WORLD_256"),
        water256: buildStateReceipt("WATER_256"),
        land256: buildStateReceipt("LAND_256"),
        air256: buildStateReceipt("AIR_256")
      };
    },
    getStateSpaceReceipt: function () { return api.getLatticeReceipt(); }
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:water-phase-state-boundary-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
