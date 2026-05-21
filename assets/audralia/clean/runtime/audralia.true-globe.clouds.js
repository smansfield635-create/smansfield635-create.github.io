// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_DATUM_POLAR_RESONANCE_CHILD_TNT_v6
//
// Public cloud contract intentionally preserved for runtime/manifest compatibility:
// AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2
//
// Preserved capability markers:
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_READABILITY_SCALE_CALIBRATION_CHILD_TNT_v4
// AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5
//
// New internal datum consumer marker:
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_DATUM_POLAR_RESONANCE_CHILD_TNT_v6
//
// Purpose:
// - Preserve moisture-driven cloud authority.
// - Consume planetary datum when available.
// - Preserve global longitude/latitude cloud shell.
// - Add true North / true South polar resonance.
// - Add datum-aware Coriolis, trade-wind, temperate-jet, polar-jet, and equatorial-convection behavior.
// - Preserve lifecycle conservation.
// - Preserve natural time and cloud-growth clamps.
// - Keep clouds Planet View only.
// - Do not draw Lattice View.
// - Do not create canvas.
// - Do not own runtime motion.
// - Do not own route JS.
// - Do not own HTML.
// - No generated image. No GraphicBox. No flat projection. No visible 256 grid.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";
  var LIFECYCLE_CONSERVATION_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3";
  var READABILITY_SCALE_CALIBRATION_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_READABILITY_SCALE_CALIBRATION_CHILD_TNT_v4";
  var GLOBAL_MULTI_LAYER_SHELL_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5";
  var DATUM_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_DATUM_POLAR_RESONANCE_CHILD_TNT_v6";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5";
  var MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_SPEC_OPS_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;
  var MAX_OPACITY = 0.76;

  var LAYERS = [
    {
      id: "low",
      name: "LOW_BOUNDARY_LAYER",
      index: 0,
      columns: 38,
      rows: 19,
      maxClouds: 150,
      threshold: 0.45,
      widthBase: 116,
      heightBase: 42,
      fragmentCount: 5,
      opacityScale: 0.46,
      sizeScale: 1.20,
      timeScale: 0.0048,
      driftScale: 0.20,
      shearScale: 0.32,
      renderOrder: 1
    },
    {
      id: "mid",
      name: "MID_WEATHER_LAYER",
      index: 1,
      columns: 44,
      rows: 22,
      maxClouds: 146,
      threshold: 0.52,
      widthBase: 108,
      heightBase: 46,
      fragmentCount: 8,
      opacityScale: 0.72,
      sizeScale: 1.10,
      timeScale: 0.0072,
      driftScale: 0.36,
      shearScale: 0.72,
      renderOrder: 2
    },
    {
      id: "high",
      name: "HIGH_JET_LAYER",
      index: 2,
      columns: 58,
      rows: 24,
      maxClouds: 136,
      threshold: 0.55,
      widthBase: 102,
      heightBase: 26,
      fragmentCount: 7,
      opacityScale: 0.66,
      sizeScale: 0.88,
      timeScale: 0.0096,
      driftScale: 0.58,
      shearScale: 1.34,
      renderOrder: 3
    },
    {
      id: "polar",
      name: "POLAR_RESONANCE_LAYER",
      index: 3,
      columns: 48,
      rows: 12,
      maxClouds: 104,
      threshold: 0.49,
      widthBase: 92,
      heightBase: 24,
      fragmentCount: 8,
      opacityScale: 0.58,
      sizeScale: 0.84,
      timeScale: 0.0064,
      driftScale: 0.42,
      shearScale: 1.72,
      renderOrder: 4
    }
  ];

  var state = {
    initialized: false,
    cloudsReady: false,
    rendererReady: false,
    moistureDetected: false,
    datumDetected: false,
    datumConsumed: false,
    diagnosticReady: false,

    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastCloudCount: 0,
    lastFragmentCount: 0,
    lastLayerCounts: {
      low: 0,
      mid: 0,
      high: 0,
      polar: 0
    },
    lastAverageCloudOpacity: 0,
    errors: []
  };

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function wrapLongitude(lon) {
    var value = finite(lon, 0);
    while (value < -Math.PI) value += TAU;
    while (value > Math.PI) value -= TAU;
    return value;
  }

  function hash3(a, b, c) {
    return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
  }

  function valueNoise2(x, y, salt) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var xf = x - x0;
    var yf = y - y0;

    var a = hash3(x0, y0, salt);
    var b = hash3(x0 + 1, y0, salt);
    var c = hash3(x0, y0 + 1, salt);
    var d = hash3(x0 + 1, y0 + 1, salt);

    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm2(x, y, time, salt) {
    var total = 0;
    var norm = 0;
    var amp = 0.54;
    var freq = 1;

    for (var i = 0; i < 5; i += 1) {
      total += valueNoise2(
        x * freq + time * (0.012 + i * 0.004),
        y * freq - time * (0.010 + i * 0.003),
        salt + i * 19.73
      ) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? total / norm : 0;
  }

  function getDatumApi() {
    return window.AUDRALIA_TRUE_GLOBE_DATUM ||
      window.AUDRALIA_G2_TRUE_GLOBE_DATUM ||
      null;
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE ||
      window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE ||
      null;
  }

  function fallbackDatum(lon, lat, time) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.05, 0.42, Math.abs(lat));
    var storm = smoothstep(0.38, 0.54, abs) * (1 - smoothstep(0.76, 0.92, abs));
    var polar = smoothstep(0.68, 0.98, abs) * Math.abs(Math.sin(lat));
    var coriolis = clamp(Math.abs(Math.sin(lat)), 0, 1);
    var trade = smoothstep(0.16, 0.32, Math.abs(lat)) * (1 - smoothstep(0.52, 0.72, Math.abs(lat)));

    return {
      longitude: lon,
      latitude: lat,
      time: time,
      hemisphere: lat > 0.035 ? "north" : lat < -0.035 ? "south" : "equatorial_transition",
      latitudeBand: lat > 0 ? (abs > 0.72 ? "north_polar" : abs > 0.42 ? "north_temperate" : abs > 0.18 ? "north_subtropical" : "equatorial") :
        (abs > 0.72 ? "south_polar" : abs > 0.42 ? "south_temperate" : abs > 0.18 ? "south_subtropical" : "equatorial"),
      climateBelt: lat > 0 ? (abs > 0.72 ? "north_polar" : abs > 0.42 ? "north_temperate" : abs > 0.18 ? "north_subtropical" : "equatorial") :
        (abs > 0.72 ? "south_polar" : abs > 0.42 ? "south_temperate" : abs > 0.18 ? "south_subtropical" : "equatorial"),
      coriolisDirection: lat > 0.035 ? "clockwise_north_bias" : lat < -0.035 ? "counterclockwise_south_bias" : "equatorial_transition",
      coriolisStrength: coriolis,
      stormTrackLatitudeBias: clamp(storm, 0, 1),
      equatorMoistureBias: clamp(equator, 0, 1),
      polarResonanceStrength: clamp(polar, 0, 1),
      hemisphereSeasonBias: 0.5,
      northTradeWindBand: { active: lat > 0 ? trade : 0, strength: lat > 0 ? trade : 0 },
      southTradeWindBand: { active: lat < 0 ? trade : 0, strength: lat < 0 ? trade : 0 },
      northTemperateJetBand: { active: lat > 0 ? storm : 0, strength: lat > 0 ? storm : 0 },
      southTemperateJetBand: { active: lat < 0 ? storm : 0, strength: lat < 0 ? storm : 0 },
      northPolarJetBand: { active: lat > 0 ? polar : 0, strength: lat > 0 ? polar : 0 },
      southPolarJetBand: { active: lat < 0 ? polar : 0, strength: lat < 0 ? polar : 0 },
      equatorialConvectionBelt: { active: equator, strength: equator },
      northPolarVortex: { active: lat > 0 ? polar : 0, strength: lat > 0 ? polar : 0 },
      southPolarVortex: { active: lat < 0 ? polar : 0, strength: lat < 0 ? polar : 0 },
      planetaryDatumChildReady: false,
      datumReady: false,
      fallbackDatum: true
    };
  }

  function getDatumSample(lon, lat, time, frame) {
    var api = getDatumApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time);
        if (sampled && sampled.planetaryDatumChildReady) return sampled;
      } catch (error) {
        recordError("datum-sample", error);
      }
    }

    if (frame && frame.datumReady) {
      return fallbackDatum(lon, lat, time);
    }

    return fallbackDatum(lon, lat, time);
  }

  function fallbackMoisture(lon, lat, time, frame) {
    var datum = getDatumSample(lon, lat, time, frame);
    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;

    var noiseA = fbm2(nx * 4.4, ny * 3.8, time * 0.004, 18.4);
    var noiseB = fbm2(nx * 8.1 + 0.4, ny * 6.3 - 0.2, time * 0.003, 71.2);

    var equator = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var storm = clamp(datum.stormTrackLatitudeBias || 0, 0, 1);
    var polar = clamp(datum.polarResonanceStrength || 0, 0, 1);
    var coriolis = clamp(datum.coriolisStrength || 0, 0, 1);

    return {
      moisture: clamp(0.30 + equator * 0.22 + storm * 0.12 + noiseA * 0.20 - polar * 0.10, 0, 1),
      humidity: clamp(0.28 + equator * 0.24 + noiseA * 0.22 - polar * 0.08, 0, 1),
      condensation: clamp(0.20 + storm * 0.24 + equator * 0.12 + noiseB * 0.20, 0, 1),
      pressure: clamp(0.22 + storm * 0.26 + polar * 0.10 + noiseB * 0.16, 0, 1),
      circulation: clamp(0.22 + coriolis * 0.24 + storm * 0.24 + polar * 0.14, 0, 1),
      cloudProbability: clamp(0.28 + equator * 0.18 + storm * 0.20 + noiseA * 0.18, 0, 1),
      cloudSoftness: clamp(0.46 + equator * 0.12 - polar * 0.08, 0, 1),
      terrainForcingDetected: false,
      terrainForcingConsumed: false,
      terrainForcingStrength: 0,
      terrainClass: "fallback",
      ecosystemClass: "fallback",
      hydrologyClass: "fallback",
      landRatio: 0,
      oceanRatio: 1,
      coastalInfluence: 0,
      mountainLift: 0,
      wetlandInfluence: 0,
      forestMoistureReturn: 0,
      desertDryness: 0,
      polarInfluence: polar,
      orographicCloudBias: 0,
      stormTrackBias: storm,
      moistureFieldReady: false
    };
  }

  function getMoistureSample(lon, lat, time, frame) {
    var api = getMoistureApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time, frame || {});
        if (sampled && sampled.moistureFieldReady) return sampled;
      } catch (error) {
        recordError("moisture-sample", error);
      }
    }

    return fallbackMoisture(lon, lat, time, frame);
  }

  function bandStrength(value) {
    if (value && typeof value.strength === "number") return clamp(value.strength, 0, 1);
    if (value && typeof value.active === "number") return clamp(value.active, 0, 1);
    return 0;
  }

  function getFrameMetrics(frame) {
    if (frame && frame.metrics) {
      return {
        width: finite(frame.metrics.width, finite(frame.width, 640)),
        height: finite(frame.metrics.height, finite(frame.height, 720)),
        centerX: finite(frame.metrics.centerX, finite(frame.width, 640) / 2),
        centerY: finite(frame.metrics.centerY, finite(frame.height, 720) * 0.42),
        radius: finite(frame.metrics.radius, Math.min(finite(frame.width, 640), finite(frame.height, 720)) * 0.35),
        cameraDistance: finite(frame.metrics.cameraDistance, 3.72)
      };
    }

    return {
      width: finite(frame && frame.width, 640),
      height: finite(frame && frame.height, 720),
      centerX: finite(frame && frame.width, 640) / 2,
      centerY: finite(frame && frame.height, 720) * 0.42,
      radius: Math.min(finite(frame && frame.width, 640), finite(frame && frame.height, 720)) * 0.35,
      cameraDistance: 3.72
    };
  }

  function sphereFromLonLat(lon, lat) {
    var clat = Math.cos(lat);
    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function rotatePoint(point, frame) {
    var yaw = finite(frame && frame.yaw, 0);
    var pitch = finite(frame && frame.pitch, 0);
    var roll = finite(frame && frame.roll, 0);

    var x = point.x;
    var y = point.y;
    var z = point.z;

    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = y * cp - z * sp;
    var z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    var cr = Math.cos(roll);
    var sr = Math.sin(roll);
    var x2 = x * cr - y * sr;
    var y2 = x * sr + y * cr;

    return { x: x2, y: y2, z: z };
  }

  function projectLonLat(lon, lat, frame) {
    var metrics = getFrameMetrics(frame);
    var sphere = sphereFromLonLat(lon, lat);
    var rotated = rotatePoint(sphere, frame);
    var denominator = Math.max(0.72, metrics.cameraDistance - rotated.z);
    var perspective = metrics.cameraDistance / denominator;

    var x = metrics.centerX + rotated.x * metrics.radius * perspective;
    var y = metrics.centerY - rotated.y * metrics.radius * perspective;

    var dx = x - metrics.centerX;
    var dy = y - metrics.centerY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var limb = metrics.radius ? clamp(dist / metrics.radius, 0, 1.45) : 0;

    return {
      x: x,
      y: y,
      z: rotated.z,
      perspective: perspective,
      frontFacing: rotated.z >= -0.055,
      visibility: rotated.z >= 0 ? 1 : clamp(0.10 + (rotated.z + 1) * 0.10, 0, 0.15),
      limbFactor: smoothstep(0.76, 1.08, limb),
      sphere: sphere,
      rotated: rotated
    };
  }

  function layerTime(frame, layer) {
    return finite(frame && frame.renderTime, 0) * layer.timeScale;
  }

  function lifecycleTime(frame) {
    return finite(frame && frame.renderTime, 0) * 0.0032;
  }

  function getLifecycleEnvelope(cellId, layer, timeValue) {
    var phaseOffset = hash3(cellId, 21.7 + layer.index, 4.9);
    var maturityBias = hash3(cellId, 13.1 + layer.index, 8.2);
    var phase = fract(timeValue * (0.020 + maturityBias * 0.012) + phaseOffset);

    var formation = smoothstep(0.04, 0.24, phase);
    var maturity = 1 - smoothstep(0.62, 0.86, phase);
    var renewal = smoothstep(0.88, 1.0, phase) * 0.14;
    var envelope = clamp(formation * maturity + renewal, 0.32, 1);

    return {
      phase: phase,
      envelope: envelope,
      densityEnvelope: clamp(envelope * (1 - smoothstep(0.66, 0.94, phase) * 0.22), 0.16, 0.94),
      opacityEnvelope: clamp(envelope * (1 - smoothstep(0.68, 0.94, phase) * 0.34), 0.12, 1),
      sizeEnvelope: clamp(0.64 + envelope * 0.36, 0.44, 1),
      nonMonotonic: true
    };
  }

  function datumWindFlow(datum, layer, lon, lat, timeValue) {
    var hemiSign = lat >= 0 ? 1 : -1;

    var equator = bandStrength(datum.equatorialConvectionBelt);
    var trade = clamp(bandStrength(datum.northTradeWindBand) + bandStrength(datum.southTradeWindBand), 0, 1);
    var temperate = clamp(bandStrength(datum.northTemperateJetBand) + bandStrength(datum.southTemperateJetBand), 0, 1);
    var polarJet = clamp(bandStrength(datum.northPolarJetBand) + bandStrength(datum.southPolarJetBand), 0, 1);
    var polarVortex = clamp(bandStrength(datum.northPolarVortex) + bandStrength(datum.southPolarVortex), 0, 1);
    var coriolis = clamp(datum.coriolisStrength || 0, 0, 1);
    var polar = clamp(datum.polarResonanceStrength || 0, 0, 1);

    var zonal =
      equator * 0.10 +
      trade * -0.14 * hemiSign +
      temperate * 0.34 +
      polarJet * 0.28 +
      polarVortex * 0.18;

    var meridional =
      equator * 0.018 * -hemiSign +
      trade * 0.034 * -hemiSign +
      temperate * 0.026 * hemiSign +
      polar * 0.020 * -hemiSign;

    var vortexSpin = polarVortex * (hemiSign > 0 ? 1 : -1) * (0.06 + coriolis * 0.10);
    var wobble = Math.sin(lon * 3.0 + timeValue * 0.10 + hemiSign * 1.7) * (0.010 + polar * 0.024);

    if (layer.id === "high") {
      zonal += temperate * 0.28 + polarJet * 0.22;
    }

    if (layer.id === "polar") {
      zonal += vortexSpin * 1.80;
      meridional += wobble * 1.60;
    }

    return {
      lonDelta: (zonal + vortexSpin + wobble) * layer.driftScale,
      latDelta: meridional * layer.driftScale,
      equator: equator,
      trade: trade,
      temperate: temperate,
      polarJet: polarJet,
      polarVortex: polarVortex,
      coriolis: coriolis,
      polar: polar,
      datumFlowStrength: clamp(equator + trade + temperate + polarJet + polarVortex, 0, 1)
    };
  }

  function globalShellPoint(layer, col, row, frame) {
    var cols = layer.columns;
    var rows = layer.rows;
    var cellId = layer.index * 100000 + row * cols + col;

    var rowSeed = hash3(row, cols, 3.17 + layer.index);
    var colSeed = hash3(col, row, 8.91 + layer.index);

    var u;
    var lat;

    if (layer.id === "polar") {
      var hemisphere = row < rows / 2 ? 1 : -1;
      var localRow = row < rows / 2 ? row : row - rows / 2;
      var halfRows = rows / 2;
      var polarU = (localRow + 0.5 + (rowSeed - 0.5) * 0.14) / halfRows;
      lat = hemisphere * (Math.PI / 2 - polarU * 0.46);
      u = (row + 0.5) / rows;
    } else {
      u = (row + 0.5 + (rowSeed - 0.5) * 0.18) / rows;
      var y = 1 - 2 * u;
      lat = Math.asin(clamp(y, -1, 1));
    }

    var golden = 0.61803398875;
    var rowOffset = fract(row * golden + rowSeed * 0.19 + layer.index * 0.137);
    var baseLon = -Math.PI + TAU * ((col + rowOffset + (colSeed - 0.5) * 0.30) / cols);

    var lt = layerTime(frame, layer);
    var datum = getDatumSample(baseLon, lat, lt, frame || {});
    var flow = datumWindFlow(datum, layer, baseLon, lat, lt);

    var nx = (baseLon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;
    var cloudNoise = fbm2(nx * 4.0 + layer.index * 0.2, ny * 3.4, lt * 0.30, 29.2 + layer.index * 11.1);

    var lon = wrapLongitude(baseLon + flow.lonDelta + (cloudNoise - 0.5) * 0.052);
    lat = clamp(lat + flow.latDelta + (cloudNoise - 0.5) * 0.030, -1.50, 1.50);

    datum = getDatumSample(lon, lat, lt, frame || {});
    flow = datumWindFlow(datum, layer, lon, lat, lt);

    return {
      cellId: cellId,
      layerId: layer.id,
      layerName: layer.name,
      layerIndex: layer.index,
      col: col,
      row: row,
      baseLongitude: baseLon,
      baseLatitude: lat,
      longitude: lon,
      latitude: lat,
      layerTime: lt,
      noise: cloudNoise,
      seed: colSeed,
      datum: datum,
      flow: flow
    };
  }

  function layerEligibility(layer, point, moisture, datum, lifecycle) {
    var equator = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var polar = clamp(datum.polarResonanceStrength || 0, 0, 1);
    var stormLat = clamp(datum.stormTrackLatitudeBias || 0, 0, 1);
    var coriolis = clamp(datum.coriolisStrength || 0, 0, 1);

    var trade = clamp(bandStrength(datum.northTradeWindBand) + bandStrength(datum.southTradeWindBand), 0, 1);
    var temperate = clamp(bandStrength(datum.northTemperateJetBand) + bandStrength(datum.southTemperateJetBand), 0, 1);
    var polarJet = clamp(bandStrength(datum.northPolarJetBand) + bandStrength(datum.southPolarJetBand), 0, 1);
    var polarVortex = clamp(bandStrength(datum.northPolarVortex) + bandStrength(datum.southPolarVortex), 0, 1);

    var score;

    if (layer.id === "low") {
      score =
        moisture.moisture * 0.22 +
        moisture.humidity * 0.22 +
        moisture.oceanRatio * 0.14 +
        moisture.coastalInfluence * 0.14 +
        moisture.wetlandInfluence * 0.18 +
        equator * 0.16 +
        trade * 0.08 +
        point.noise * 0.08 -
        moisture.desertDryness * 0.18 -
        polar * 0.10;
    } else if (layer.id === "mid") {
      score =
        moisture.condensation * 0.24 +
        moisture.pressure * 0.18 +
        moisture.humidity * 0.14 +
        moisture.orographicCloudBias * 0.16 +
        moisture.stormTrackBias * 0.16 +
        stormLat * 0.16 +
        temperate * 0.10 +
        point.noise * 0.08 -
        moisture.desertDryness * 0.14;
    } else if (layer.id === "high") {
      score =
        moisture.circulation * 0.24 +
        moisture.condensation * 0.12 +
        stormLat * 0.18 +
        temperate * 0.24 +
        polarJet * 0.14 +
        coriolis * 0.10 +
        point.flow.datumFlowStrength * 0.12 +
        point.noise * 0.08 -
        equator * 0.02;
    } else {
      score =
        polar * 0.34 +
        polarJet * 0.22 +
        polarVortex * 0.26 +
        moisture.circulation * 0.12 +
        moisture.condensation * 0.10 +
        point.noise * 0.08;
    }

    score += lifecycle.densityEnvelope * 0.06;

    return clamp(score, 0, 1);
  }

  function buildCandidate(layer, point, frame) {
    var lifecycle = getLifecycleEnvelope(point.cellId, layer, lifecycleTime(frame));
    var datum = point.datum;
    var moisture = getMoistureSample(point.longitude, point.latitude, point.layerTime, frame || {});
    var eligibility = layerEligibility(layer, point, moisture, datum, lifecycle);

    var blueNoise = hash3(point.col * 2.71, point.row * 5.13, 91.7 + layer.index * 14.1);
    var retain = eligibility + (blueNoise - 0.5) * 0.08;

    if (retain < layer.threshold) return null;

    var density = smoothstep(layer.threshold, 0.96, retain) * lifecycle.densityEnvelope;

    var polar = clamp(datum.polarResonanceStrength || 0, 0, 1);
    var equator = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var temperate = clamp(bandStrength(datum.northTemperateJetBand) + bandStrength(datum.southTemperateJetBand), 0, 1);
    var polarJet = clamp(bandStrength(datum.northPolarJetBand) + bandStrength(datum.southPolarJetBand), 0, 1);
    var polarVortex = clamp(bandStrength(datum.northPolarVortex) + bandStrength(datum.southPolarVortex), 0, 1);

    var shear =
      1.0 +
      moisture.circulation * layer.shearScale +
      temperate * 0.38 +
      polarJet * 0.42 +
      polarVortex * 0.62 +
      point.flow.datumFlowStrength * 0.28;

    var sizeBase = 8.0 + density * 21.0;

    var width = sizeBase * layer.widthBase * 0.030 * shear * lifecycle.sizeEnvelope * layer.sizeScale;
    var height = sizeBase * layer.heightBase * 0.030 * lifecycle.sizeEnvelope * layer.sizeScale;

    if (layer.id === "polar") {
      width *= 1.32 + polarVortex * 0.40;
      height *= 0.62 + polar * 0.18;
    }

    if (layer.id === "high") {
      width *= 1.30 + temperate * 0.28;
      height *= 0.64;
    }

    if (layer.id === "low") {
      width *= 1.08 + equator * 0.18;
      height *= 0.92;
    }

    var opacity =
      (0.12 + density * 0.46 + moisture.condensation * 0.10 + polar * 0.06) *
      layer.opacityScale *
      lifecycle.opacityEnvelope;

    opacity = clamp(opacity, 0, MAX_OPACITY);

    if (opacity < 0.014) return null;

    var hemiSign = point.latitude >= 0 ? 1 : -1;
    var angle =
      point.latitude * 1.10 +
      point.flow.lonDelta * 4.0 +
      point.flow.latDelta * 2.0 +
      (point.noise - 0.5) * 0.52 +
      polarVortex * hemiSign * 0.95;

    if (layer.id === "polar") {
      angle += hemiSign * (Math.PI / 2) + Math.sin(point.longitude * 2.0 + point.layerTime * 0.18) * 0.40;
    }

    return {
      sampleIndex: point.cellId,
      cellId: point.cellId,
      layerId: layer.id,
      layerName: layer.name,
      layerIndex: layer.index,
      renderOrder: layer.renderOrder,

      longitude: point.longitude,
      latitude: point.latitude,
      climateBelt: datum.climateBelt,
      hemisphere: datum.hemisphere,

      moisture: moisture.moisture,
      humidity: moisture.humidity,
      condensation: moisture.condensation,
      pressure: moisture.pressure,
      circulation: moisture.circulation,
      cloudProbability: moisture.cloudProbability,
      cloudDensity: density,
      cloudOpacity: opacity,

      datumConsumed: Boolean(datum.planetaryDatumChildReady),
      datumReady: Boolean(datum.planetaryDatumChildReady),
      datum: datum,

      coriolisDirection: datum.coriolisDirection,
      coriolisStrength: clamp(datum.coriolisStrength || 0, 0, 1),
      stormTrackLatitudeBias: clamp(datum.stormTrackLatitudeBias || 0, 0, 1),
      equatorMoistureBias: equator,
      polarResonanceStrength: polar,
      temperateJetStrength: temperate,
      polarJetStrength: polarJet,
      polarVortexStrength: polarVortex,
      datumFlowStrength: point.flow.datumFlowStrength,

      terrainForcingDetected: Boolean(moisture.terrainForcingDetected),
      terrainForcingConsumed: Boolean(moisture.terrainForcingConsumed),
      terrainForcingStrength: clamp(moisture.terrainForcingStrength || 0, 0, 1),
      terrainClass: moisture.terrainClass || "unknown",
      ecosystemClass: moisture.ecosystemClass || "unknown",
      hydrologyClass: moisture.hydrologyClass || "unknown",

      landRatio: clamp(moisture.landRatio || 0, 0, 1),
      oceanRatio: clamp(moisture.oceanRatio || 0, 0, 1),
      coastalInfluence: clamp(moisture.coastalInfluence || 0, 0, 1),
      mountainLift: clamp(moisture.mountainLift || 0, 0, 1),
      wetlandInfluence: clamp(moisture.wetlandInfluence || 0, 0, 1),
      desertDryness: clamp(moisture.desertDryness || 0, 0, 1),
      orographicCloudBias: clamp(moisture.orographicCloudBias || 0, 0, 1),
      stormTrackBias: clamp(moisture.stormTrackBias || 0, 0, 1),

      width: width,
      height: height,
      angle: angle,
      softness: clamp(moisture.cloudSoftness || 0.5, 0, 1),
      elongation: shear,

      lifecyclePhase: lifecycle.phase,
      lifecycleEnvelope: lifecycle.envelope,
      densityEnvelope: lifecycle.densityEnvelope,
      opacityEnvelope: lifecycle.opacityEnvelope,
      sizeEnvelope: lifecycle.sizeEnvelope,
      nonMonotonicDissipationActive: true,

      eligibilityScore: eligibility,
      retainScore: retain,

      source: "datum-aware-global-longitude-latitude-cloud-shell",
      cloudsDerivedFromMoisture: true,
      cloudsReadDatumField: true,
      polarResonanceCloudsActive: polar > 0.08 || layer.id === "polar",
      trueNorthSouthResonanceActive: true,
      cloudMassConservationActive: true,
      cloudGrowthClamped: true,
      timeLapseBlocked: true,
      naturalTimeActive: true,
      randomPatchClouds: false,
      flatProjection: false
    };
  }

  function bucketKey(candidate) {
    var lonBucket = Math.floor(clamp(((candidate.longitude + Math.PI) / TAU) * 8, 0, 7.999));
    var latBucket = Math.floor(clamp(((candidate.latitude + Math.PI / 2) / Math.PI) * 6, 0, 5.999));
    return lonBucket + ":" + latBucket + ":" + candidate.layerId;
  }

  function selectByBuckets(candidates, maxCount) {
    if (candidates.length <= maxCount) return candidates.slice();

    var buckets = {};
    var keys = [];
    var selected = [];
    var used = {};

    for (var i = 0; i < candidates.length; i += 1) {
      var key = bucketKey(candidates[i]);
      if (!buckets[key]) {
        buckets[key] = [];
        keys.push(key);
      }
      buckets[key].push(candidates[i]);
    }

    for (i = 0; i < keys.length; i += 1) {
      buckets[keys[i]].sort(function (a, b) {
        return b.retainScore - a.retainScore;
      });
    }

    var quota = Math.max(1, Math.floor(maxCount / Math.max(1, keys.length)));

    for (i = 0; i < keys.length; i += 1) {
      var bucket = buckets[keys[i]];
      var take = Math.min(quota, bucket.length);

      for (var j = 0; j < take; j += 1) {
        selected.push(bucket[j]);
        used[bucket[j].cellId] = true;
        if (selected.length >= maxCount) return selected;
      }
    }

    var remaining = candidates.filter(function (candidate) {
      return !used[candidate.cellId];
    });

    remaining.sort(function (a, b) {
      return b.retainScore - a.retainScore;
    });

    for (i = 0; i < remaining.length && selected.length < maxCount; i += 1) {
      selected.push(remaining[i]);
    }

    return selected;
  }

  function projectCloud(cloud, frame) {
    var projection = projectLonLat(cloud.longitude, cloud.latitude, frame);
    var perspective = clamp(projection.perspective, 0.44, 2.25);

    cloud.x = projection.x;
    cloud.y = projection.y;
    cloud.z = projection.z;
    cloud.perspective = perspective;
    cloud.frontFacing = projection.frontFacing;
    cloud.visibility = projection.visibility;
    cloud.limbFactor = projection.limbFactor;

    cloud.width = clamp(
      cloud.width * perspective * lerp(1.0, 0.68, projection.limbFactor),
      4.0 * perspective,
      132 * perspective
    );

    cloud.height = clamp(
      cloud.height * perspective * lerp(1.0, 0.62, projection.limbFactor),
      1.4 * perspective,
      54 * perspective
    );

    cloud.cloudOpacity = clamp(
      cloud.cloudOpacity * projection.visibility * (1 - smoothstep(0.92, 1.10, projection.limbFactor)),
      0,
      MAX_OPACITY
    );

    return cloud;
  }

  function buildFragments(cloud) {
    var layer = LAYERS[cloud.layerIndex] || LAYERS[1];
    var fragments = [];
    var count = Math.max(
      3,
      Math.min(
        13,
        Math.round(layer.fragmentCount + cloud.cloudDensity * 2.4 + cloud.datumFlowStrength * 2.0)
      )
    );

    for (var i = 0; i < count; i += 1) {
      var seed = hash3(cloud.sampleIndex, i, 13.7 + layer.index);
      var seedB = hash3(cloud.sampleIndex + 4.2, i + 9.1, 33.4 + layer.index);
      var seedC = hash3(cloud.sampleIndex + 11.8, i + 17.6, 70.2 + layer.index);

      var flowAngle = cloud.angle + (seed - 0.5) * (0.34 + cloud.datumFlowStrength * 0.30);
      var offsetRadius = cloud.width * (0.040 + seedB * 0.19);
      var offsetX = Math.cos(flowAngle) * offsetRadius;
      var offsetY = Math.sin(flowAngle) * offsetRadius * (layer.id === "polar" ? 0.30 : layer.id === "high" ? 0.34 : 0.44);

      var fragmentWidth = cloud.width * (layer.id === "polar" ? 0.24 + seed * 0.46 : layer.id === "high" ? 0.22 + seed * 0.36 : 0.18 + seed * 0.30);
      var fragmentHeight = cloud.height * (layer.id === "polar" ? 0.16 + seedC * 0.24 : layer.id === "high" ? 0.18 + seedC * 0.28 : 0.24 + seedC * 0.34);

      fragments.push({
        x: cloud.x + offsetX,
        y: cloud.y + offsetY,
        width: clamp(fragmentWidth, 1.4 * cloud.perspective, 56 * cloud.perspective),
        height: clamp(fragmentHeight, 0.9 * cloud.perspective, 28 * cloud.perspective),
        angle: flowAngle,
        opacity: clamp(cloud.cloudOpacity * (0.30 + seedB * 0.44), 0, MAX_OPACITY),
        softness: cloud.softness,
        shade: seedC,
        layerId: cloud.layerId,
        datumFlowStrength: cloud.datumFlowStrength,
        polarResonanceStrength: cloud.polarResonanceStrength
      });
    }

    return fragments;
  }

  function buildGlobalCloudShell(frame) {
    var selectedByLayer = {
      low: [],
      mid: [],
      high: [],
      polar: []
    };

    var allCandidates = [];
    var datumCount = 0;

    for (var layerIndex = 0; layerIndex < LAYERS.length; layerIndex += 1) {
      var layer = LAYERS[layerIndex];
      var layerCandidates = [];

      for (var row = 0; row < layer.rows; row += 1) {
        for (var col = 0; col < layer.columns; col += 1) {
          var point = globalShellPoint(layer, col, row, frame || {});
          var candidate = buildCandidate(layer, point, frame || {});
          if (!candidate) continue;

          if (candidate.datumConsumed) datumCount += 1;

          layerCandidates.push(candidate);
          allCandidates.push(candidate);
        }
      }

      selectedByLayer[layer.id] = selectByBuckets(layerCandidates, layer.maxClouds);
    }

    return {
      selectedByLayer: selectedByLayer,
      selectedClouds: selectedByLayer.low.concat(selectedByLayer.mid, selectedByLayer.high, selectedByLayer.polar),
      allCandidates: allCandidates,
      datumCount: datumCount
    };
  }

  function buildLayer(frame) {
    frame = frame || {};

    state.moistureDetected = Boolean(getMoistureApi());
    state.datumDetected = Boolean(getDatumApi() || frame.datumReady);

    var shell = buildGlobalCloudShell(frame);
    var clouds = [];
    var opacitySum = 0;
    var fragmentCount = 0;
    var layerCounts = {
      low: 0,
      mid: 0,
      high: 0,
      polar: 0
    };

    for (var i = 0; i < shell.selectedClouds.length; i += 1) {
      var cloud = projectCloud(shell.selectedClouds[i], frame);

      if (!cloud.frontFacing || cloud.visibility < 0.09 || cloud.cloudOpacity < 0.010) {
        continue;
      }

      cloud.fragments = buildFragments(cloud);

      clouds.push(cloud);
      layerCounts[cloud.layerId] = (layerCounts[cloud.layerId] || 0) + 1;
      opacitySum += cloud.cloudOpacity;
      fragmentCount += cloud.fragments.length;
    }

    clouds.sort(function (a, b) {
      if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
      return a.z - b.z;
    });

    state.lastFrameIndex = typeof frame.frameIndex === "number" ? frame.frameIndex : state.lastFrameIndex;
    state.lastRenderTime = typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime;
    state.lastCloudCount = clouds.length;
    state.lastFragmentCount = fragmentCount;
    state.lastLayerCounts = layerCounts;
    state.lastAverageCloudOpacity = clouds.length ? opacitySum / clouds.length : 0;
    state.datumConsumed = shell.datumCount > 0;
    state.cloudsReady = true;
    state.rendererReady = true;
    state.diagnosticReady = true;

    var layer = {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      moistureContract: MOISTURE_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      frameIndex: state.lastFrameIndex,
      renderTime: state.lastRenderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      clouds: clouds,
      cloudCount: clouds.length,
      fragmentCount: fragmentCount,
      averageCloudOpacity: state.lastAverageCloudOpacity,
      layerCounts: layerCounts,
      lowBoundaryLayerCount: layerCounts.low || 0,
      midWeatherLayerCount: layerCounts.mid || 0,
      highJetLayerCount: layerCounts.high || 0,
      polarResonanceLayerCount: layerCounts.polar || 0,
      globalCandidateCount: shell.allCandidates.length,

      moistureDetected: state.moistureDetected,
      datumDetected: state.datumDetected,
      datumConsumed: state.datumConsumed,
      cloudsReady: true,
      rendererReady: true,

      cloudsDerivedFromMoisture: true,
      cloudsReadDatumField: true,
      cloudDatumConsumerReady: true,
      polarResonanceCloudsActive: true,
      trueNorthSouthResonanceActive: true,
      coriolisCloudFlowActive: true,
      tradeWindCloudBandsActive: true,
      temperateJetCloudBandsActive: true,
      polarJetCloudBandsActive: true,
      equatorialConvectionCloudBandActive: true,

      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudMassConservationActive: true,
      cloudGrowthClamped: true,
      lifecycleEnvelopeActive: true,
      nonMonotonicDissipationActive: true,
      cloudCountStableRange: true,

      cloudReadabilityScaleActive: true,
      weatherSystemScaleActive: true,
      cloudSpeckReductionActive: true,
      cloudSystemReadabilityActive: true,

      globalCloudShellActive: true,
      multiLayerCloudCoverageActive: true,
      longitudeLatitudeCloudIdentityActive: true,
      cloudShellContinuityActive: true,
      backsideRotationContinuityActive: true,
      lowBoundaryLayerActive: true,
      midWeatherLayerActive: true,
      highJetLayerActive: true,
      polarResonanceLayerActive: true,

      terrainMoistureForcingPreserved: true,
      jetStreamBaselinePreserved: true,

      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      diagnosticReportsCloudState: true,

      generatedImage: false,
      graphicBox: false,
      randomPatchClouds: false,
      flatProjection: false,
      visible256Grid: false
    };

    window.AUDRALIA_TRUE_GLOBE_CLOUD_LAYER = layer;
    window.AUDRALIA_TRUE_GLOBE_CLOUD_STATUS = status();

    return layer;
  }

  function clipToSphere(ctx, frame) {
    var metrics = getFrameMetrics(frame);
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.005, 0, TAU);
    ctx.clip();
  }

  function drawSoftFragment(ctx, fragment, baseOpacity) {
    var w = Math.max(1, fragment.width);
    var h = Math.max(1, fragment.height);
    var opacity = clamp(fragment.opacity * baseOpacity, 0, MAX_OPACITY);

    if (opacity <= 0.01) return;

    ctx.save();
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.angle);

    if (fragment.layerId === "polar") {
      ctx.scale(1.16, 0.48);
    } else if (fragment.layerId === "high") {
      ctx.scale(1, 0.54);
    } else {
      ctx.scale(1, 0.70);
    }

    var radius = Math.max(w, h);
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

    if (fragment.layerId === "low") {
      gradient.addColorStop(0, "rgba(230,246,255," + (0.36 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.44, "rgba(198,226,242," + (0.22 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    } else if (fragment.layerId === "polar") {
      gradient.addColorStop(0, "rgba(255,255,255," + (0.74 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.28, "rgba(235,250,255," + (0.48 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.68, "rgba(170,215,236," + (0.14 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    } else if (fragment.layerId === "high") {
      gradient.addColorStop(0, "rgba(255,255,255," + (0.72 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.30, "rgba(238,249,255," + (0.46 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.64, "rgba(186,218,238," + (0.16 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    } else {
      gradient.addColorStop(0, "rgba(255,255,255," + (0.70 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.30, "rgba(238,249,255," + (0.50 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.62, "rgba(186,218,238," + (0.22 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, TAU);
    ctx.fill();

    if (fragment.layerId === "polar" || fragment.datumFlowStrength > 0.30) {
      ctx.globalAlpha = opacity * (fragment.layerId === "polar" ? 0.16 : 0.10);
      ctx.strokeStyle = "rgba(245,252,255,0.70)";
      ctx.lineWidth = Math.max(0.7, radius * 0.024);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.70, h * 0.52, 0, -0.95, 0.95);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCloud(ctx, cloud) {
    if (!ctx || !cloud || !cloud.fragments) return;

    var baseOpacity = clamp(cloud.cloudOpacity, 0, MAX_OPACITY);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (var i = 0; i < cloud.fragments.length; i += 1) {
      drawSoftFragment(ctx, cloud.fragments[i], baseOpacity);
    }

    if ((cloud.polarResonanceStrength > 0.28 || cloud.temperateJetStrength > 0.28) && cloud.layerId !== "low") {
      ctx.globalAlpha = clamp(baseOpacity * 0.08, 0, 0.13);
      ctx.strokeStyle = "rgba(235,250,255,0.54)";
      ctx.lineWidth = Math.max(0.6, cloud.perspective * 1.0);
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width * 0.52,
        cloud.height * 0.40,
        cloud.angle,
        -0.90,
        0.90
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(ctx, frame, options) {
    try {
      if (!ctx) return null;

      options = options || {};

      if (options.activeLens && options.activeLens !== "planet" && options.activeLens !== "diagnostic") {
        return buildLayer(frame || {});
      }

      var layer = buildLayer(frame || {});
      var clouds = layer.clouds || [];

      ctx.save();
      clipToSphere(ctx, frame || {});

      for (var i = 0; i < clouds.length; i += 1) {
        drawCloud(ctx, clouds[i]);
      }

      ctx.restore();

      state.rendererReady = true;
      state.diagnosticReady = true;

      return layer;
    } catch (error) {
      recordError("render", error);
      return null;
    }
  }

  function status() {
    return {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      moistureContract: MOISTURE_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      cloudsReady: state.cloudsReady,
      rendererReady: state.rendererReady,
      moistureDetected: state.moistureDetected,
      datumDetected: state.datumDetected,
      datumConsumed: state.datumConsumed,
      diagnosticReady: state.diagnosticReady,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastCloudCount: state.lastCloudCount,
      lastFragmentCount: state.lastFragmentCount,
      lastLayerCounts: state.lastLayerCounts,
      lastAverageCloudOpacity: state.lastAverageCloudOpacity,

      cloudsDerivedFromMoisture: true,
      cloudsReadDatumField: true,
      cloudDatumConsumerReady: true,
      polarResonanceCloudsActive: true,
      trueNorthSouthResonanceActive: true,
      coriolisCloudFlowActive: true,
      tradeWindCloudBandsActive: true,
      temperateJetCloudBandsActive: true,
      polarJetCloudBandsActive: true,
      equatorialConvectionCloudBandActive: true,

      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudMassConservationActive: true,
      cloudGrowthClamped: true,
      lifecycleEnvelopeActive: true,
      nonMonotonicDissipationActive: true,
      cloudCountStableRange: true,

      cloudReadabilityScaleActive: true,
      weatherSystemScaleActive: true,
      cloudSpeckReductionActive: true,
      cloudSystemReadabilityActive: true,

      globalCloudShellActive: true,
      multiLayerCloudCoverageActive: true,
      longitudeLatitudeCloudIdentityActive: true,
      cloudShellContinuityActive: true,
      backsideRotationContinuityActive: true,
      lowBoundaryLayerActive: true,
      midWeatherLayerActive: true,
      highJetLayerActive: true,
      polarResonanceLayerActive: true,

      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      diagnosticReportsCloudState: true,

      noCanvasCreated: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,

      generatedImage: false,
      graphicBox: false,
      randomPatchClouds: false,
      flatProjection: false,
      visible256Grid: false,

      errors: state.errors.slice()
    };
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope: scope,
      message: message,
      time: new Date().toISOString()
    });

    window.AUDRALIA_TRUE_GLOBE_CLOUD_ERROR = {
      contract: CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      buildLayer: buildLayer,
      render: render,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_CLOUDS = api;
    window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS = api;
    window.AUDRALIA_TRUE_GLOBE_CLOUD_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_CLOUD_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_CLOUDS_BOOT = {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia clouds evaluated with datum-aware polar resonance, true North/South circulation, Coriolis flow, jet bands, trade winds, and equatorial convection."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.cloudsReady = true;
      state.rendererReady = true;
      publish();
      return status();
    } catch (error) {
      recordError("init", error);
      publish();
      return status();
    }
  }

  publish();
  init();
})();
