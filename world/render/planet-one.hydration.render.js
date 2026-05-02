/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /world/render/planet-one.hydration.render.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKER:
   G1_PLANET_1_BEACH_THRESHOLD_TO_TERRAIN_STARTLINE_TNT_v1

   ROLE:
   Hydration owns water-state truth only.
   It does not paint continents, mount canvas, control runtime, or claim visual pass.
*/

(function attachPlanetOneHydrationRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_BEACH_THRESHOLD_TO_TERRAIN_STARTLINE_TNT_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * m) / m;
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(a, b, value) {
    var t = clamp((value - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
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
    var x = normalizeLon(lon) / 22;
    var y = lat / 22;

    return (
      valueNoise(x, y, seed + 11) * 0.40 +
      valueNoise(x * 2.15, y * 2.15, seed + 29) * 0.27 +
      valueNoise(x * 4.4, y * 4.4, seed + 47) * 0.18 +
      valueNoise(x * 8.8, y * 8.8, seed + 83) * 0.10 +
      valueNoise(x * 17.6, y * 17.6, seed + 131) * 0.05
    );
  }

  function ridge(lon, lat, seed) {
    var n = fbm(lon * 1.32 + 17, lat * 1.17 - 9, seed + 700);
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

  function classifyPhase(temperature, elevation, availableWater, latitude) {
    var polarFactor = smoothstep(56, 86, Math.abs(latitude));
    var coldByHeight = smoothstep(0.52, 0.92, elevation);
    var icePotential = clamp(polarFactor * 0.52 + coldByHeight * 0.46 + availableWater * 0.20, 0, 1);
    var vaporPotential = clamp(smoothstep(0.44, 0.86, temperature) * availableWater * 0.64, 0, 1);
    var liquidPotential = clamp(availableWater * (1 - icePotential * 0.46) * (1 - vaporPotential * 0.28), 0, 1);

    var dominant = "LIQUID";
    if (icePotential > liquidPotential && icePotential > vaporPotential) dominant = "SOLID";
    if (vaporPotential > liquidPotential && vaporPotential > icePotential) dominant = "GAS";

    return {
      dominant: dominant,
      solid: round(icePotential, 4),
      liquid: round(liquidPotential, 4),
      gas: round(vaporPotential, 4)
    };
  }

  function sampleHydration(lon, lat, context) {
    context = context || {};
    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var seed = Number(context.seed || SEED);
    var elevation = clamp(context.elevation == null ? 0.36 + fbm(lon, lat, seed + 200) * 0.28 : context.elevation, 0, 1);
    var landMask = clamp(context.landMask == null ? 0 : context.landMask, 0, 1);

    var basinField = clamp((1 - elevation) * 0.62 + ridge(lon + 19, lat - 8, seed + 310) * 0.20 + fbm(lon * 1.4, lat * 1.2, seed + 340) * 0.18, 0, 1);
    var shelf = clamp(smoothstep(0.20, 0.58, basinField) * (1 - landMask * 0.42), 0, 1);
    var coast = clamp(context.coast == null ? smoothstep(0.34, 0.72, shelf) * smoothstep(0.08, 0.90, landMask) : context.coast, 0, 1);
    var wetEdge = clamp(coast * 0.68 + shelf * 0.18, 0, 1);

    var seaLevel = 0.50;
    var belowSea = clamp(smoothstep(seaLevel + 0.08, seaLevel - 0.18, elevation) * (1 - landMask * 0.58), 0, 1);
    var interiorBasin = clamp(landMask * basinField * (1 - elevation * 0.58), 0, 1);
    var drainagePotential = clamp(landMask * ridge(lon * 1.8 - 11, lat * 1.5 + 7, seed + 480) * (0.40 + interiorBasin * 0.64), 0, 1);

    var liquidWater = clamp(belowSea * 0.76 + shelf * 0.22 + interiorBasin * 0.26 + drainagePotential * 0.18, 0, 1);
    var shallowWater = clamp(shelf * 0.42 + coast * 0.28 + interiorBasin * 0.20, 0, 1);
    var deepWater = clamp(belowSea * (1 - shelf * 0.52), 0, 1);

    var equatorWarmth = 1 - Math.abs(lat) / 90;
    var temperature = clamp(equatorWarmth * 0.76 + fbm(lon * 0.8, lat * 0.8, seed + 520) * 0.18 - elevation * 0.20, 0, 1);
    var phase = classifyPhase(temperature, elevation, liquidWater + interiorBasin * 0.32, lat);

    var evaporation = clamp((liquidWater * 0.30 + shallowWater * 0.26 + wetEdge * 0.14) * temperature, 0, 1);
    var humidity = clamp(evaporation * 0.48 + fbm(lon * 0.9 + 7, lat * 0.9 - 3, seed + 590) * 0.12, 0, 1);
    var condensation = clamp(humidity * smoothstep(0.22, 0.70, elevation + Math.abs(lat) / 160), 0, 1);
    var precipitationPotential = clamp(condensation * 0.58 + ridge(lon - 13, lat + 5, seed + 610) * humidity * 0.18, 0, 1);

    return {
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,

      lon: lon,
      lat: lat,

      hydrationAuthority: "WATER_STATE_TRUTH_ONLY",
      ownsWaterStateTruth: true,
      ownsSolidLiquidGasBoundary: true,
      ownsSeaLevel: true,
      ownsBasinShelfCoastWetEdge: true,
      ownsEvaporationCondensationPrecipitationPotential: true,

      ownsContinentPainting: false,
      ownsCanvasComposition: false,
      ownsRuntimeMount: false,
      ownsControlState: false,
      visualPassClaimed: false,

      seaLevel: round(seaLevel, 4),
      elevationInput: round(elevation, 4),
      landMaskInput: round(landMask, 4),

      basinField: round(basinField, 4),
      shelf: round(shelf, 4),
      coast: round(coast, 4),
      wetEdge: round(wetEdge, 4),
      belowSea: round(belowSea, 4),
      interiorBasin: round(interiorBasin, 4),
      drainagePotential: round(drainagePotential, 4),

      liquidWater: round(liquidWater, 4),
      shallowWater: round(shallowWater, 4),
      deepWater: round(deepWater, 4),

      temperature: round(temperature, 4),
      waterPhase: phase.dominant,
      solidWater: phase.solid,
      liquidWaterPhase: phase.liquid,
      gasWater: phase.gas,

      evaporation: round(evaporation, 4),
      humidity: round(humidity, 4),
      condensation: round(condensation, 4),
      precipitationPotential: round(precipitationPotential, 4),

      waterRemainsWater: true,
      solidLiquidGasAreWaterStates: true,
      cloudsDoNotBecomeSurface: true,
      precipitationDoesNotPaintLand: true,
      airDoesNotBecomeSurface: true,
      landDoesNotOwnWater: true
    };
  }

  function getHydrationStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      contract: VERSION,
      role: "HYDRATION_WATER_STATE_TRUTH_ONLY",
      waterStateTruthOnly: true,
      ownsContinentPainting: false,
      ownsCanvasComposition: false,
      ownsRuntimeMount: false,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      water256Receipt: buildStateReceipt("WATER_256"),
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    sampleHydration: sampleHydration,
    sampleWaterState: sampleHydration,
    getHydrationStatus: getHydrationStatus,
    getStatus: getHydrationStatus,
    status: getHydrationStatus,
    getLatticeReceipt: function () {
      return buildStateReceipt("WATER_256");
    },
    visualPassClaimed: false
  };

  global.DGBPlanetOneHydrationRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hydration:generation-2-ready", {
      detail: getHydrationStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
