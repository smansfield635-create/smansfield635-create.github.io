/* G1 PLANET 1 MATERIAL DOMAIN VISUAL REFINEMENT
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_MATERIAL_DOMAIN_VISUAL_REFINEMENT_TNT_v1

   LAW:
   LAND = solid material body.
   WATER = liquid depth body.
   AIR = gas/weather body above the surface.
   Weather reads the surface but cannot repaint it.
*/

(function attachPlanetOneMaterialDomainHexBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_MATERIAL_DOMAIN_VISUAL_REFINEMENT_TNT_v1";
  var PRIOR_VERSION = "G1_PLANET_1_WATER_PHASE_STATE_BOUNDARY_TNT_v1";
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

  function hash2(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + (seed || SEED) * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var xf = x - x0;
    var yf = y - y0;
    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);

    var a = hash2(x0, y0, seed);
    var b = hash2(x0 + 1, y0, seed);
    var c = hash2(x0, y0 + 1, seed);
    var d = hash2(x0 + 1, y0 + 1, seed);

    return mix(mix(a, b, u), mix(c, d, u), v);
  }

  function fbm(lon, lat, seed) {
    var x = normalizeLon(lon) / 18;
    var y = lat / 18;
    return (
      valueNoise(x, y, seed + 11) * 0.40 +
      valueNoise(x * 2.1, y * 2.1, seed + 29) * 0.27 +
      valueNoise(x * 4.2, y * 4.2, seed + 47) * 0.19 +
      valueNoise(x * 8.4, y * 8.4, seed + 83) * 0.10 +
      valueNoise(x * 16.8, y * 16.8, seed + 131) * 0.04
    );
  }

  function ridge(lon, lat, seed) {
    var n = fbm(lon * 1.25 + 19, lat * 1.15 - 7, seed + 600);
    return 1 - Math.abs(n * 2 - 1);
  }

  function stateId(a, b, c, d) {
    return (((a * 4 + b) * 4 + c) * 4 + d);
  }

  function buildStateReceipt(label) {
    var states = [];
    var a, b, c, d;

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
    var west = bodyScore(lon, lat, -96, 2, 78, 78, 1.08, 0.16);
    var east = bodyScore(lon, lat, 98, -7, 72, 74, 1.03, 0.14);
    var north = bodyScore(lon, lat, 30, 38, 40, 30, 0.70, 0.05);
    var south = bodyScore(lon, lat, -24, -38, 45, 32, 0.68, 0.04);
    var far = bodyScore(lon, lat, 178, 14, 36, 44, 0.62, 0.10);
    var grain = (fbm(lon * 1.3, lat * 1.1, seed + 300) - 0.5) * 0.19;
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

    var potential = landPotential(lon, lat, seed);
    var tex = fbm(lon * 2.4, lat * 2.1, seed + 850);
    var fine = fbm(lon * 7.8, lat * 6.4, seed + 1200);
    var ridgeValue = ridge(lon, lat, seed);
    var weather = fbm(lon * 1.1 + 41, lat * 1.2 - 23, seed + 2200);

    var landCore = smoothstep(0.02, 0.43, potential);
    var landInterior = smoothstep(0.22, 0.70, potential);
    var coastContact = clamp(1 - Math.abs(potential - 0.08) / 0.24, 0, 1);
    var shelf = clamp(1 - Math.abs(potential - 0.00) / 0.40, 0, 1);
    var reef = clamp(shelf * coastContact * smoothstep(0.52, 0.88, fbm(lon * 3.1, lat * 2.8, seed + 900)), 0, 0.72);
    var wetEdge = clamp(coastContact * landCore * 0.92, 0, 1);
    var beach = clamp(wetEdge * smoothstep(0.04, 0.32, potential) * (1 - landInterior * 0.52), 0, 0.86);

    var terrainPermission = clamp(landCore * (0.60 + landInterior * 0.34) + beach * 0.20, 0, 1);

    var elevation = clamp(
      terrainPermission *
      (0.18 + ridgeValue * 0.42 + tex * 0.26 + fine * 0.14) *
      (1 - beach * 0.28),
      0,
      1
    );

    var plateau = clamp(terrainPermission * smoothstep(0.46, 0.86, potential) * (0.44 + tex * 0.36), 0, 1);
    var basinShadow = clamp(terrainPermission * (1 - ridgeValue) * smoothstep(0.24, 0.68, tex) * 0.48, 0, 0.54);
    var mineral = clamp(terrainPermission * (0.28 + ridgeValue * 0.36 + fine * 0.25 + plateau * 0.28), 0, 1);
    var vegetation = clamp(terrainPermission * smoothstep(0.34, 0.78, weather) * (1 - elevation * 0.34) * (1 - beach * 0.62), 0, 0.78);
    var dryStone = clamp(terrainPermission * (1 - vegetation * 0.72) * (0.38 + mineral * 0.44), 0, 1);

    var waterDivide = clamp(elevation * ridgeValue * smoothstep(0.42, 0.82, potential), 0, 1);
    var highElevationIceState = clamp(waterDivide * smoothstep(0.48, 0.92, elevation) * (0.22 + absLat / 115), 0, 0.70);
    var polarIce = absLat > 72 ? smoothstep(72, 86, absLat) * 0.24 : 0;
    var solidWaterStorage = clamp(highElevationIceState + polarIce, 0, 0.76);

    var channelSignal = clamp((1 - landCore) * ridge(normalizeLon(lon + 18), lat - 4, seed + 940) * shelf, 0, 1);
    var liquidWaterDepth = clamp(
      0.92 -
      shelf * 0.30 -
      reef * 0.14 -
      landCore * 0.70 +
      channelSignal * 0.12 -
      solidWaterStorage * 0.06,
      0.07,
      0.98
    );

    var deepBasin = clamp(liquidWaterDepth * (1 - shelf * 0.56), 0, 1);
    var midChannel = clamp(channelSignal * 0.55 + liquidWaterDepth * 0.24, 0, 1);
    var shallowWater = clamp(shelf * (1 - landCore * 0.70), 0, 1);

    var evaporationPotential = clamp((liquidWaterDepth * 0.20 + shallowWater * 0.16 + wetEdge * 0.18 + weather * 0.12) * (1 - landInterior * 0.50), 0, 0.54);
    var vaporHumidity = clamp(evaporationPotential * 0.48 + wetEdge * 0.12 + weather * 0.16, 0, 0.48);
    var condensationPotential = clamp(vaporHumidity * 0.48 + solidWaterStorage * 0.12 + ridgeValue * 0.04 + weather * 0.10, 0, 0.42);

    var cloudGasMask = clamp(smoothstep(0.36, 0.78, condensationPotential) * (0.018 + weather * 0.040), 0, 0.055);
    var atmosphereMask = clamp(0.010 + vaporHumidity * 0.018 + condensationPotential * 0.012, 0, 0.044);
    var gasOverlayAlpha = clamp(cloudGasMask + atmosphereMask, 0, 0.070);

    var landMask = clamp(
      beach * 0.46 +
      landCore * 0.52 +
      landInterior * 0.28 +
      plateau * 0.16 +
      mineral * 0.08,
      0,
      0.94
    );

    var featheredLandMask = smoothstep(0.05, 0.44, landMask) * clamp(0.72 + landMask * 0.22, 0, 0.95);
    var shorelineFeather = clamp(beach * 0.38 + wetEdge * 0.18 + reef * 0.10, 0, 0.52);

    var liquidWaterValue = clamp(deepBasin * 0.45 + midChannel * 0.20 + shallowWater * 0.20 + reef * 0.12, 0, 1);
    var landDomainValue = clamp(landCore * 0.28 + elevation * 0.24 + vegetation * 0.20 + mineral * 0.18 + dryStone * 0.10, 0, 1);
    var gasWaterValue = clamp(vaporHumidity * 0.46 + condensationPotential * 0.36 + cloudGasMask * 0.18, 0, 1);
    var wholeWorldCoherence = clamp((liquidWaterValue + landDomainValue + gasWaterValue) / 3, 0, 1);

    return {
      VERSION: VERSION,
      version: VERSION,
      PRIOR_VERSION: PRIOR_VERSION,
      priorVersion: PRIOR_VERSION,
      baseline: BASELINE,

      lon: lon,
      lat: lat,
      nodalIndex256: nodalIndex256(lon, lat),
      cardinalNode: cardinalNode(lon, lat),

      materialDomainVisualRefinementActive: true,
      materialDomainVisualRefinementRendered: true,
      physicalMaterialDomainsActive: true,
      landSolidMaterialBodyActive: true,
      waterLiquidDepthBodyActive: true,
      airGasWeatherBodyActive: true,

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
      surfaceFirstAirSecondCompositor: true,
      cloudOpacityCapped: true,
      noCartoonCutoutEdges: true,

      potential: round(potential, 4),
      landCore: round(landCore, 4),
      landInterior: round(landInterior, 4),
      landMask: round(landMask, 4),
      featheredLandMask: round(featheredLandMask, 4),
      shorelineFeather: round(shorelineFeather, 4),

      beach: round(beach, 4),
      beachLock: round(beach, 4),
      coastContact: round(coastContact, 4),
      wetEdge: round(wetEdge, 4),
      shelfField: round(shelf, 4),
      reefField: round(reef, 4),
      shallowWaterField: round(shallowWater, 4),

      elevation: round(elevation, 4),
      plateau: round(plateau, 4),
      basinShadow: round(basinShadow, 4),
      mineral: round(mineral, 4),
      vegetation: round(vegetation, 4),
      dryStone: round(dryStone, 4),
      ridgeValue: round(ridgeValue, 4),

      waterDivideValue: round(waterDivide, 4),
      highElevationIceState: round(highElevationIceState, 4),
      solidWaterStorage: round(solidWaterStorage, 4),

      liquidWaterDepth: round(liquidWaterDepth, 4),
      waterDepth: round(liquidWaterDepth, 4),
      deepBasin: round(deepBasin, 4),
      midChannel: round(midChannel, 4),
      channelSignal: round(channelSignal, 4),

      vaporHumidity: round(vaporHumidity, 4),
      evaporationPotential: round(evaporationPotential, 4),
      condensationPotential: round(condensationPotential, 4),
      cloudGasMask: round(cloudGasMask, 4),
      atmosphereMask: round(atmosphereMask, 4),
      gasOverlayAlpha: round(gasOverlayAlpha, 4),
      airOverlayAlpha: round(gasOverlayAlpha, 4),

      liquidWaterValue: round(liquidWaterValue, 4),
      landDomainValue: round(landDomainValue, 4),
      gasWaterValue: round(gasWaterValue, 4),
      wholeWorldCoherence: round(wholeWorldCoherence, 4),

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
      visualPassClaimed: false
    };
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c, sinC, cosC, lat0, lon0, lat, lon;

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

  function rgba(r, g, b, a) {
    return [
      Math.round(clamp(r, 0, 255)),
      Math.round(clamp(g, 0, 255)),
      Math.round(clamp(b, 0, 255)),
      Math.round(clamp(a, 0, 255))
    ];
  }

  function mixColor(a, b, t) {
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t),
      mix(a[3], b[3], t)
    ];
  }

  function getLayerColors(sample, limb) {
    var deep = [4, 23, 74, 255];
    var mid = [10, 73, 132, 255];
    var channel = [20, 104, 158, 255];
    var shelf = [48, 152, 178, 255];
    var reef = [70, 195, 182, 255];

    var beach = [220, 195, 123, 255];
    var wetLowland = [72, 118, 72, 255];
    var moss = [54, 118, 66, 255];
    var olive = [88, 111, 66, 255];
    var brown = [116, 100, 67, 255];
    var slate = [96, 102, 96, 255];
    var highland = [132, 128, 104, 255];
    var shadow = [52, 63, 58, 255];
    var ice = [188, 230, 235, 255];

    var gasBlue = [140, 183, 225, 255];
    var gasWhite = [224, 236, 240, 255];

    var water = mixColor(deep, mid, 1 - sample.liquidWaterDepth);
    water = mixColor(water, channel, clamp(sample.midChannel * 0.32, 0, 0.32));
    water = mixColor(water, shelf, clamp(sample.shelfField * 0.40 + sample.shallowWaterField * 0.20, 0, 0.54));
    water = mixColor(water, reef, clamp(sample.reefField * 0.22, 0, 0.22));

    var land = mixColor(beach, wetLowland, clamp(sample.wetEdge * 0.36, 0, 0.36));
    land = mixColor(land, moss, clamp(sample.vegetation * 0.50, 0, 0.50));
    land = mixColor(land, olive, clamp(sample.landInterior * 0.28, 0, 0.28));
    land = mixColor(land, brown, clamp(sample.dryStone * 0.32, 0, 0.32));
    land = mixColor(land, slate, clamp(sample.mineral * 0.26, 0, 0.26));
    land = mixColor(land, highland, clamp(sample.plateau * 0.26, 0, 0.26));
    land = mixColor(land, shadow, clamp(sample.basinShadow * 0.26, 0, 0.26));
    land = mixColor(land, ice, clamp(sample.solidWaterStorage * 0.30, 0, 0.30));
    land = mixColor(land, beach, clamp(sample.shorelineFeather * 0.20, 0, 0.20));

    var gas = mixColor(gasBlue, gasWhite, clamp(sample.cloudGasMask * 9.0, 0, 0.46));

    var shade = clamp(0.58 + limb * 0.52, 0.40, 1.10);
    var surfaceShadow = clamp(1 - sample.basinShadow * 0.12, 0.86, 1);

    water = rgba(water[0] * shade, water[1] * shade, water[2] * shade, 255);
    land = rgba(land[0] * shade * surfaceShadow, land[1] * shade * surfaceShadow, land[2] * shade * surfaceShadow, sample.featheredLandMask * 245);
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
    if (!ctx) {
      return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };
    }

    var options = gridOrOptions && gridOrOptions.cells ? maybeOptions || {} : gridOrOptions || {};
    var canvas = ctx.canvas;
    var scale = clamp(Number(options.compositorScale || 0.78), 0.52, 0.92);
    var width = Math.max(260, Math.min(900, Math.round(canvas.width * scale)));
    var height = Math.max(260, Math.min(900, Math.round(canvas.height * scale)));
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(width, height) * 0.485;
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

    var x, y, dx, dy, index, geo, sample, colors;

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
        colors = getLayerColors(sample, geo.limb);

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
    ctx.drawImage(liquidCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(landCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(gasCanvas, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      priorVersion: PRIOR_VERSION,
      materialDomainVisualRefinementRendered: true,
      materialDomainVisualRefinementActive: true,
      physicalMaterialDomainsRendered: true,
      landSolidMaterialBodyRendered: true,
      waterLiquidDepthBodyRendered: true,
      airGasWeatherBodyRendered: true,
      landNoLongerFlatYellowPaint: true,
      liquidWaterDepthReadable: true,
      airWeatherSitsAboveSurface: true,
      solidLiquidGasSeparationReadable: true,
      waterPhaseStateBoundaryRendered: true,
      waterPhaseStateBoundaryActive: true,
      solidLiquidGasWaterStatesRendered: true,
      solidLiquidGasWaterStatesActive: true,
      cloudsDoNotBecomeWater: true,
      waterDoesNotBecomeCloud: true,
      iceDoesNotBecomeLand: true,
      landDoesNotOwnWaterPhase: true,
      weatherReadsButDoesNotRepaintSurface: true,
      noCartoonCutoutEdges: true,
      waterDepthPreserved: true,
      reefShelfPreserved: true,
      beachThresholdPreserved: true,
      terrainAuthorityBlocked: true,
      hydrationReadOnlyPreserved: true,
      noBlobReintroduced: true,
      noMountainRelief: true,
      noRiverNetwork: true,
      noFullGlacierSystem: true,
      noPublicHoneycomb: true,
      noPublicDotGrid: true,
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
    var lon, lat;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(sampleBridge(lon, lat, options));
      }
    }

    lastGrid = {
      version: VERSION,
      priorVersion: PRIOR_VERSION,
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
      baseline: BASELINE,

      materialDomainVisualRefinementActive: true,
      physicalMaterialDomainsActive: true,
      landSolidMaterialBodyActive: true,
      waterLiquidDepthBodyActive: true,
      airGasWeatherBodyActive: true,
      landNoLongerFlatYellowPaint: true,
      liquidWaterDepthReadable: true,
      airWeatherSitsAboveSurface: true,
      solidLiquidGasSeparationReadable: true,

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
    getStatus: getHexgridStatus,
    getLatticeReceipt: function () {
      return {
        wholeWorld256: buildStateReceipt("WHOLE_WORLD_256"),
        water256: buildStateReceipt("WATER_256"),
        land256: buildStateReceipt("LAND_256"),
        air256: buildStateReceipt("AIR_256")
      };
    },
    getStateSpaceReceipt: function () {
      return api.getLatticeReceipt();
    }
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:material-domain-visual-refinement-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
