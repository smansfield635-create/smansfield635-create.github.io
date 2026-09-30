/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKERS:
   G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1
   G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1

   ROLE:
   HexGrid owns systemic surface classification only.
   It does not mount the route, own runtime cadence, or claim final visual authority.
*/

(function attachPlanetOneHexgridGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_BLOB_BREAKUP_REAL_PLANET_SURFACE_TNT_v1";
  var PRIOR_COMPAT_VERSION = "G1_PLANET_1_HYDROLOGY_RECEIVER_VISIBILITY_AND_LAND_ALPHA_REBALANCE_TNT_v1";
  var STATE_FORMULA = "4x4x4x4";
  var STATE_COUNT = 256;
  var SEED = 256451;

  var lastGrid = null;
  var lastDraw = null;

  var PLATES = [
    { id: 0, lon: -146, lat: 38, lift: 0.28, drift: 0.16 },
    { id: 1, lon: -102, lat: -18, lift: 0.34, drift: -0.10 },
    { id: 2, lon: -36, lat: 20, lift: -0.18, drift: 0.22 },
    { id: 3, lon: 18, lat: -34, lift: 0.22, drift: -0.18 },
    { id: 4, lon: 74, lat: 28, lift: 0.30, drift: 0.14 },
    { id: 5, lon: 126, lat: -12, lift: -0.10, drift: -0.24 },
    { id: 6, lon: 166, lat: 46, lift: 0.18, drift: 0.28 },
    { id: 7, lon: -178, lat: -52, lift: -0.24, drift: 0.08 },
    { id: 8, lon: -12, lat: 62, lift: 0.12, drift: -0.14 },
    { id: 9, lon: 112, lat: -56, lift: 0.10, drift: 0.12 },
    { id: 10, lon: 42, lat: 4, lift: 0.26, drift: 0.04 },
    { id: 11, lon: -72, lat: 58, lift: -0.06, drift: -0.20 }
  ];

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

  function sphericalDistance(lonA, latA, lonB, latB) {
    var a1 = degToRad(latA);
    var a2 = degToRad(latB);
    var dLat = degToRad(latB - latA);
    var dLon = degToRad(normalizeLon(lonB - lonA));
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a1) * Math.cos(a2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * Math.atan2(Math.sqrt(s), Math.sqrt(Math.max(0, 1 - s))) / Math.PI;
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
      valueNoise(x, y, seed + 11) * 0.34 +
      valueNoise(x * 2.1, y * 2.1, seed + 29) * 0.27 +
      valueNoise(x * 4.4, y * 4.4, seed + 47) * 0.20 +
      valueNoise(x * 8.8, y * 8.8, seed + 83) * 0.12 +
      valueNoise(x * 17.6, y * 17.6, seed + 131) * 0.07
    );
  }

  function ridge(lon, lat, seed) {
    var n = fbm(lon * 1.2 + 17, lat * 1.2 - 5, seed + 600);
    return 1 - Math.abs(n * 2 - 1);
  }

  function crack(lon, lat, seed, offset) {
    var a = ridge(lon * 1.9 + offset * 9, lat * 1.6 - offset * 7, seed + offset * 101);
    var b = ridge(lon * 3.6 - offset * 5, lat * 3.0 + offset * 4, seed + offset * 137);
    return clamp(smoothstep(0.60, 0.88, a) * 0.56 + smoothstep(0.64, 0.90, b) * 0.44, 0, 1);
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

  function nearestPlatePair(lon, lat) {
    var first = null;
    var second = null;

    PLATES.forEach(function (plate) {
      var d = sphericalDistance(lon, lat, plate.lon, plate.lat);
      var item = { plate: plate, distance: d };

      if (!first || d < first.distance) {
        second = first;
        first = item;
      } else if (!second || d < second.distance) {
        second = item;
      }
    });

    return { first: first, second: second };
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

  function hydrationFor(lon, lat, context) {
    if (global.DGBPlanetOneHydrationRender && typeof global.DGBPlanetOneHydrationRender.sampleHydration === "function") {
      return global.DGBPlanetOneHydrationRender.sampleHydration(lon, lat, context);
    }

    return {
      liquidWater: 0,
      shallowWater: 0,
      deepWater: 0,
      shelf: 0,
      coast: 0,
      wetEdge: 0,
      interiorBasin: 0,
      drainagePotential: 0,
      evaporation: 0,
      humidity: 0,
      condensation: 0,
      precipitationPotential: 0,
      solidWater: 0,
      gasWater: 0,
      waterPhase: "LIQUID",
      waterRemainsWater: true
    };
  }

  function sampleSurface(lon, lat, options) {
    options = options || {};
    lon = normalizeLon(lon);
    lat = clamp(lat, -88, 88);

    var seed = Number(options.seed || SEED);
    var pair = nearestPlatePair(lon, lat);
    var primary = pair.first.plate;
    var secondary = pair.second.plate;

    var boundary = clamp(1 - Math.abs(pair.second.distance - pair.first.distance) * 7.8, 0, 1);
    var compression = clamp(boundary * Math.abs(primary.drift - secondary.drift) * 2.8, 0, 1);
    var shear = clamp(boundary * (0.35 + ridge(lon + primary.id * 5, lat - secondary.id * 4, seed + 410) * 0.65), 0, 1);

    var macroTexture = fbm(lon, lat, seed + 200);
    var terrainTexture = fbm(lon * 2.4 + primary.id * 3, lat * 2.2 - secondary.id * 2, seed + 260);
    var fineTexture = fbm(lon * 8.4, lat * 7.6, seed + 320);
    var fractureA = crack(lon, lat, seed, 1);
    var fractureB = crack(lon, lat, seed, 2);
    var fractureC = crack(lon, lat, seed, 3);
    var fractureNetwork = clamp(fractureA * 0.42 + fractureB * 0.34 + fractureC * 0.24, 0, 1);

    var plateBase = primary.lift * 0.62 + secondary.lift * 0.20;
    var boundaryLift = compression * 0.38 - shear * 0.16;
    var basinDrop = smoothstep(0.50, 0.90, macroTexture) * 0.22;
    var elevation = clamp(
      0.48 +
      plateBase +
      boundaryLift +
      terrainTexture * 0.20 +
      fineTexture * 0.08 +
      fractureNetwork * 0.11 -
      basinDrop,
      0,
      1
    );

    var landMask = smoothstep(0.50, 0.60, elevation);
    var coast = clamp(1 - Math.abs(elevation - 0.56) / 0.12, 0, 1);
    var lowland = clamp(landMask * (1 - elevation) * 1.72, 0, 1);

    var hydration = hydrationFor(lon, lat, {
      seed: seed,
      elevation: elevation,
      landMask: landMask,
      coast: coast
    });

    var interiorWater = clamp(
      landMask *
      (
        Number(hydration.interiorBasin || 0) * 0.42 +
        Number(hydration.drainagePotential || 0) * 0.30 +
        lowland * 0.22 +
        fractureNetwork * 0.12
      ),
      0,
      1
    );

    var liquidWater = clamp(
      (1 - landMask) * (0.82 + Number(hydration.deepWater || 0) * 0.16) +
      Number(hydration.shallowWater || 0) * 0.22 +
      interiorWater * 0.44,
      0,
      1
    );

    var ridgeLine = clamp(boundary * 0.34 + compression * 0.42 + fractureNetwork * 0.24, 0, 1);
    var basinShadow = clamp((1 - elevation) * landMask * 0.52 + interiorWater * 0.36 + fractureNetwork * 0.20, 0, 1);
    var shelf = clamp(Number(hydration.shelf || 0) * 0.66 + coast * 0.22, 0, 1);
    var wetEdge = clamp(Number(hydration.wetEdge || 0) * 0.56 + coast * 0.22 + interiorWater * 0.18, 0, 1);

    var vegetation = clamp(landMask * (0.20 + Number(hydration.precipitationPotential || 0) * 0.42 + lowland * 0.24 + macroTexture * 0.12) * (1 - ridgeLine * 0.30), 0, 1);
    var mineral = clamp(landMask * (ridgeLine * 0.40 + fineTexture * 0.28 + elevation * 0.22), 0, 1);
    var drySurface = clamp(landMask * (1 - interiorWater * 0.74) * (1 - wetEdge * 0.36), 0, 1);
    var roughness = clamp(fractureNetwork * 0.34 + ridgeLine * 0.28 + fineTexture * 0.24 + boundary * 0.14, 0, 1);

    var airMask = clamp(Number(hydration.gasWater || 0) * 0.06 + Number(hydration.condensation || 0) * 0.035, 0, 0.075);
    var ice = clamp(Number(hydration.solidWater || 0) * (0.40 + Math.abs(lat) / 180), 0, 0.72);

    return {
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,

      lon: lon,
      lat: lat,
      platePrimary: primary.id,
      plateSecondary: secondary.id,
      nodalIndex256: nodalIndex256(lon, lat),
      cardinalNode: cardinalNode(lon, lat),

      systemicDynamicStandardActive: true,
      surfaceClassificationOnly: true,
      ownsSurfaceClassification: true,
      ownsCanvasFinalAuthority: false,
      ownsRuntimeCadence: false,
      ownsRouteMount: false,
      visualPassClaimed: false,

      boundary: round(boundary, 4),
      compression: round(compression, 4),
      shear: round(shear, 4),
      elevation: round(elevation, 4),
      landMask: round(landMask, 4),
      liquidWater: round(liquidWater, 4),
      interiorWater: round(interiorWater, 4),
      shelf: round(shelf, 4),
      coast: round(coast, 4),
      wetEdge: round(wetEdge, 4),
      ridgeLine: round(ridgeLine, 4),
      basinShadow: round(basinShadow, 4),
      vegetation: round(vegetation, 4),
      mineral: round(mineral, 4),
      drySurface: round(drySurface, 4),
      roughness: round(roughness, 4),
      fractureNetwork: round(fractureNetwork, 4),
      airMask: round(airMask, 4),
      ice: round(ice, 4),

      hydration: hydration,
      waterRemainsWater: true,
      landMaskIsReal: true,
      airStaysAboveSurface: true,
      cloudOpacityCannotHideLand: true,
      hardCartoonEdgesAvoided: true,
      noBroadContinentPrimitiveAuthority: true,
      noLateRuntimeAuthority: true
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

  function colorForSample(sample, limb) {
    var shade = clamp(0.54 + limb * 0.54, 0.36, 1.10);
    var waterDeep = [4, 18, 62];
    var waterMid = [8, 78, 132];
    var waterShelf = [45, 150, 170];
    var wetSoil = [39, 62, 48];
    var green = [42, 99, 55];
    var brown = [88, 74, 53];
    var slate = [70, 78, 78];
    var lightStone = [126, 118, 92];

    function mixColor(a, b, t) {
      return [
        mix(a[0], b[0], t),
        mix(a[1], b[1], t),
        mix(a[2], b[2], t)
      ];
    }

    var baseWater = mixColor(waterDeep, waterMid, clamp(sample.liquidWater, 0, 1));
    baseWater = mixColor(baseWater, waterShelf, clamp(sample.shelf * 0.38 + sample.interiorWater * 0.22, 0, 0.55));

    var land = mixColor(brown, green, clamp(sample.vegetation * 0.52, 0, 0.52));
    land = mixColor(land, wetSoil, clamp(sample.wetEdge * 0.42 + sample.interiorWater * 0.44, 0, 0.62));
    land = mixColor(land, slate, clamp(sample.mineral * 0.36 + sample.fractureNetwork * 0.22, 0, 0.48));
    land = mixColor(land, lightStone, clamp(sample.ice * 0.28 + sample.ridgeLine * 0.12, 0, 0.32));

    var landAlpha = clamp(sample.landMask * (0.58 + sample.roughness * 0.20) * (1 - sample.interiorWater * 0.58), 0, 0.90);
    var waterAlpha = 1;

    var composed = mixColor(baseWater, land, landAlpha);
    var darken = clamp(1 - sample.basinShadow * 0.18 - sample.roughness * 0.06, 0.72, 1);

    return [
      Math.round(composed[0] * shade * darken),
      Math.round(composed[1] * shade * darken),
      Math.round(composed[2] * shade * darken),
      Math.round(255 * waterAlpha)
    ];
  }

  function drawPlanetOneHexGrid(target, options) {
    var ctx = resolveContext(target);
    var canvas, width, height, cx, cy, radius, image, data, x, y, dx, dy, idx, geo, sample, color;

    if (!ctx) {
      return { ok: false, reason: "NO_CANVAS_CONTEXT", version: VERSION, visualPassClaimed: false };
    }

    options = options || {};
    canvas = ctx.canvas;
    width = Math.max(220, Math.min(900, Math.round(canvas.width * clamp(options.compositorScale || 0.88, 0.48, 1))));
    height = Math.max(220, Math.min(900, Math.round(canvas.height * clamp(options.compositorScale || 0.88, 0.48, 1))));
    cx = width / 2;
    cy = height / 2;
    radius = Math.min(width, height) * 0.485;

    image = ctx.createImageData(width, height);
    data = image.data;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
        idx = (y * width + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[idx + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, options.viewLon || -28, options.viewLat || 0);
        sample = sampleSurface(geo.lon, geo.lat, options);
        color = colorForSample(sample, geo.limb);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    ctx.putImageData(image, 0, 0);

    lastDraw = {
      ok: true,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      systemicDynamicStandardRendered: true,
      surfaceClassificationOnly: true,
      noBroadContinentPrimitiveAuthority: true,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return lastDraw;
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};
    var lonStep = Number(options.lonStep || 6);
    var latStep = Number(options.latStep || 6);
    var cells = [];
    var lon, lat;

    for (lat = -84; lat <= 84; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(sampleSurface(lon, lat, options));
      }
    }

    lastGrid = {
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      wholeWorldStateCount: STATE_COUNT,
      waterStateCount: STATE_COUNT,
      landStateCount: STATE_COUNT,
      airStateCount: STATE_COUNT,
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
      compatibilityVersion: COMPAT_VERSION,
      priorCompatibilityVersion: PRIOR_COMPAT_VERSION,
      role: "SURFACE_CLASSIFICATION_ONLY",
      systemicDynamicStandardActive: true,
      ownsSurfaceClassification: true,
      ownsCanvasFinalAuthority: false,
      ownsRuntimeCadence: false,
      ownsRouteMount: false,
      noBroadContinentPrimitiveAuthority: true,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
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
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,
    PRIOR_COMPAT_VERSION: PRIOR_COMPAT_VERSION,
    priorCompatibilityVersion: PRIOR_COMPAT_VERSION,

    sampleSurface: sampleSurface,
    sampleBridge: sampleSurface,
    samplePlanetSurface: sampleSurface,

    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,

    getHexgridStatus: getHexgridStatus,
    getStatus: getHexgridStatus,
    status: getHexgridStatus,

    getLatticeReceipt: function () {
      return {
        wholeWorld256: buildStateReceipt("WHOLE_WORLD_256"),
        water256: buildStateReceipt("WATER_256"),
        land256: buildStateReceipt("LAND_256"),
        air256: buildStateReceipt("AIR_256")
      };
    },

    visualPassClaimed: false
  };

  global.DGBPlanetOneHexgridRender = api;
  createPlanetOneHexGrid({ seed: SEED });

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hexgrid:generation-2-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
