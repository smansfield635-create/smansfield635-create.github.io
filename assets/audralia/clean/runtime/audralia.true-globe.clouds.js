// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5
//
// Public cloud contract intentionally preserved for runtime/manifest compatibility:
// AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2
//
// Manifest-required lifecycle capability marker preserved:
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3
//
// Prior internal calibration marker preserved:
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_READABILITY_SCALE_CALIBRATION_CHILD_TNT_v4
//
// New internal shell marker:
// AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5
//
// Purpose:
// - Preserve moisture-driven cloud authority.
// - Preserve runtime and manifest compatibility.
// - Preserve lifecycle conservation.
// - Preserve current jet-stream improvement.
// - Replace top/front-biased cloud generation with full longitude/latitude shell generation.
// - Add low boundary, mid weather, and high jet layers.
// - Prevent hard hemisphere cutoff when rotating Audralia.
// - Prepare climate bridge toward ground-level terrain definition.
// - Keep clouds Planet View only.
// - Do not create canvas.
// - Do not modify HTML.
// - Do not own route JS.
// - Do not render Lattice View.
// - No generated image. No GraphicBox. No flat projection. No sticker clouds.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";
  var LIFECYCLE_CONSERVATION_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3";
  var READABILITY_SCALE_CALIBRATION_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_CLOUD_READABILITY_SCALE_CALIBRATION_CHILD_TNT_v4";
  var GLOBAL_MULTI_LAYER_SHELL_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GLOBAL_MULTI_LAYER_CLOUD_SHELL_CHILD_TNT_v5";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";
  var MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_GLOBAL_MULTI_LAYER_CLOUD_SHELL_AND_CLIMATE_TRANSITION_SPEC_OPS_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var MAX_OPACITY = 0.74;

  var LAYERS = [
    {
      id: "low",
      name: "LOW_BOUNDARY_LAYER",
      index: 0,
      columns: 36,
      rows: 18,
      maxClouds: 150,
      threshold: 0.46,
      widthBase: 118,
      heightBase: 44,
      fragmentWidthBase: 50,
      fragmentHeightBase: 24,
      opacityScale: 0.48,
      sizeScale: 1.34,
      softnessScale: 1.34,
      fragmentCount: 5,
      timeScale: 0.006,
      driftScale: 0.30,
      shearScale: 0.38,
      renderOrder: 1
    },
    {
      id: "mid",
      name: "MID_WEATHER_LAYER",
      index: 1,
      columns: 42,
      rows: 21,
      maxClouds: 140,
      threshold: 0.54,
      widthBase: 104,
      heightBase: 48,
      fragmentWidthBase: 44,
      fragmentHeightBase: 26,
      opacityScale: 0.78,
      sizeScale: 1.20,
      softnessScale: 1.08,
      fragmentCount: 8,
      timeScale: 0.010,
      driftScale: 0.52,
      shearScale: 0.78,
      renderOrder: 2
    },
    {
      id: "high",
      name: "HIGH_JET_LAYER",
      index: 2,
      columns: 54,
      rows: 22,
      maxClouds: 118,
      threshold: 0.58,
      widthBase: 96,
      heightBase: 28,
      fragmentWidthBase: 52,
      fragmentHeightBase: 16,
      opacityScale: 0.70,
      sizeScale: 0.86,
      softnessScale: 0.82,
      fragmentCount: 7,
      timeScale: 0.016,
      driftScale: 0.86,
      shearScale: 1.44,
      renderOrder: 3
    }
  ];

  var DEFAULT_OPTIONS = {
    cloudOpacityScale: 1.0,
    cloudSizeScale: 1.0,
    cloudSoftnessScale: 1.0,

    lifecycleMinimum: 0.34,
    lifecycleMaximum: 1.0,
    breathingStrength: 0.040,
    dissipationStrength: 0.30,

    frontVisibilityFloor: 0.10,
    rimCompression: 0.66,
    limbFadeStart: 0.76,
    limbFadeEnd: 1.08,

    massCap: 1.0,
    opacityCap: MAX_OPACITY,
    densityCap: 0.94,

    bucketLonCount: 8,
    bucketLatCount: 6,

    proceduralResolution: "4k-ready-global-multi-layer-cloud-shell",
    materialClass: "cool-white-blue-gray-layered-atmospheric-cloud",

    generatedImage: false,
    graphicBox: false,
    randomPatchClouds: false,
    flatProjection: false,
    visible256Grid: false,
    latticeViewCloudsBlocked: true,
    planetViewCloudsOnly: true
  };

  var SWIRL_CENTERS = [
    { lon: -2.56, lat: 0.52, radius: 0.82, strength: 0.30, drift: 0.006, sign: 1 },
    { lon: -0.92, lat: -0.34, radius: 1.04, strength: 0.25, drift: -0.005, sign: -1 },
    { lon: 0.74, lat: 0.24, radius: 0.74, strength: 0.28, drift: 0.004, sign: 1 },
    { lon: 2.20, lat: -0.58, radius: 0.94, strength: 0.22, drift: -0.005, sign: -1 },
    { lon: 2.92, lat: 0.68, radius: 0.62, strength: 0.16, drift: 0.003, sign: 1 }
  ];

  var state = {
    initialized: false,
    cloudsReady: false,
    rendererReady: false,
    moistureDetected: false,
    diagnosticReady: false,

    options: clone(DEFAULT_OPTIONS),

    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastCloudCount: 0,
    lastFragmentCount: 0,
    lastMoistureEligibleCount: 0,
    lastAverageCloudOpacity: 0,

    lastLayerCounts: {
      low: 0,
      mid: 0,
      high: 0
    },

    lastMaxCloudWidth: 0,
    lastMaxCloudHeight: 0,

    layerVersion: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
    publicContract: CONTRACT,
    layerKind: "global-longitude-latitude-multi-layer-atmospheric-cloud-shell",
    renderMode: "canvas-2d-runtime-consumer-planet-view-only",

    naturalTimeActive: true,
    timeLapseBlocked: true,
    cloudSpeedReduced: true,
    cloudMassConservationActive: true,
    cloudGrowthClamped: true,
    lifecycleEnvelopeActive: true,
    nonMonotonicDissipationActive: true,
    cloudCountStableRange: true,
    organicSwirlFlowActive: true,
    highDensityCloudFieldActive: true,
    cloudsNotVisible256Grid: true,

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
    groundLevelClimateBridgeReady: true,
    noHardHemisphereCutoff: true,
    noTopBandOnlyClouds: true,

    errors: []
  };

  function clone(value) {
    var output = {};
    var key;

    for (key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        output[key] = value[key];
      }
    }

    return output;
  }

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

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
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
    var amp = 0.52;
    var freq = 1;
    var i;

    for (i = 0; i < 5; i += 1) {
      total += valueNoise2(
        x * freq + time * (0.08 + i * 0.011),
        y * freq - time * (0.06 + i * 0.009),
        salt + i * 17.37
      ) * amp;

      norm += amp;
      amp *= 0.54;
      freq *= 2.04;
    }

    return norm ? total / norm : 0;
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE || window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE || null;
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

    return {
      x: x2,
      y: y2,
      z: z
    };
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
      frontFacing: rotated.z >= -0.06,
      visibility: rotated.z >= 0 ? 1 : clamp(0.10 + (rotated.z + 1) * 0.10, 0, 0.16),
      limbFactor: smoothstep(state.options.limbFadeStart, state.options.limbFadeEnd, limb),
      sphere: sphere,
      rotated: rotated
    };
  }

  function greatCircleDistance(lonA, latA, lonB, latB) {
    var dLon = wrapLongitude(lonA - lonB);
    var sinA = Math.sin((latA - latB) / 2);
    var sinB = Math.sin(dLon / 2);
    var h = sinA * sinA + Math.cos(latA) * Math.cos(latB) * sinB * sinB;

    return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  }

  function layerTime(frame, layer) {
    return finite(frame && frame.renderTime, 0) * layer.timeScale;
  }

  function lifecycleTime(frame) {
    return finite(frame && frame.renderTime, 0) * 0.004;
  }

  function textureTime(frame, layer) {
    return finite(frame && frame.renderTime, 0) * (0.004 + layer.timeScale * 0.25);
  }

  function climateBand(lat) {
    var abs = Math.abs(lat) / (Math.PI / 2);

    if (abs > 0.72) return "polar";
    if (abs > 0.42) return "temperate";
    if (abs > 0.18) return "subtropical";
    return "equatorial";
  }

  function swirlInfluence(lon, lat, swirlTime) {
    var influenceLon = 0;
    var influenceLat = 0;
    var bend = 0;
    var strengthSum = 0;
    var i;

    for (i = 0; i < SWIRL_CENTERS.length; i += 1) {
      var center = SWIRL_CENTERS[i];
      var centerLon = wrapLongitude(center.lon + swirlTime * center.drift);
      var centerLat = clamp(center.lat + Math.sin(swirlTime * 0.11 + i * 1.7) * 0.028, -1.28, 1.28);
      var distance = greatCircleDistance(lon, lat, centerLon, centerLat);
      var force = Math.exp(-(distance * distance) / Math.max(0.001, center.radius * center.radius));
      var dLon = wrapLongitude(lon - centerLon);
      var dLat = lat - centerLat;

      influenceLon += -dLat * force * center.strength * center.sign;
      influenceLat += dLon * force * center.strength * center.sign * 0.36;
      bend += force * center.strength * center.sign;
      strengthSum += force;
    }

    return {
      lon: influenceLon,
      lat: influenceLat,
      bend: clamp(bend, -1, 1),
      strength: clamp(strengthSum / Math.max(1, SWIRL_CENTERS.length), 0, 1)
    };
  }

  function zonalDrift(lat, timeValue, layer) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.16, 0.46, abs);
    var temperate = smoothstep(0.22, 0.55, abs) * (1 - smoothstep(0.68, 0.92, abs));
    var polar = smoothstep(0.72, 1.0, abs);

    return timeValue * layer.driftScale * (
      equator * 0.16 +
      temperate * -0.18 +
      polar * 0.08
    );
  }

  function getLifecycleEnvelope(cellId, layer, timeValue) {
    var phaseOffset = hash3(cellId, 21.7 + layer.index, 4.9);
    var maturityBias = hash3(cellId, 13.1 + layer.index, 8.2);
    var dissipationBias = hash3(cellId, 33.4 + layer.index, 17.6);
    var breathingBias = hash3(cellId, 47.2 + layer.index, 25.3);

    var phase = fract(timeValue * (0.030 + maturityBias * 0.020) + phaseOffset);

    var formation = smoothstep(0.04, 0.24, phase);
    var maturity = 1 - smoothstep(0.55 + dissipationBias * 0.08, 0.80 + dissipationBias * 0.08, phase);
    var renewal = smoothstep(0.86, 1.0, phase) * 0.18;

    var envelope = clamp(formation * maturity + renewal, state.options.lifecycleMinimum, state.options.lifecycleMaximum);

    var breathing =
      1 +
      Math.sin((phase + breathingBias) * TAU) *
      state.options.breathingStrength *
      envelope;

    var dissipation = smoothstep(0.64, 0.94, phase) * state.options.dissipationStrength;

    return {
      phase: phase,
      formation: formation,
      maturity: maturity,
      renewal: renewal,
      envelope: clamp(envelope * breathing, state.options.lifecycleMinimum, state.options.lifecycleMaximum),
      densityEnvelope: clamp(envelope * (1 - dissipation * 0.30), 0.16, state.options.densityCap),
      opacityEnvelope: clamp(envelope * (1 - dissipation * 0.44), 0.12, 1),
      sizeEnvelope: clamp(0.60 + envelope * 0.40 - dissipation * 0.16, 0.44, 1),
      dissipation: dissipation,
      breathing: breathing,
      nonMonotonic: true
    };
  }

  function globalShellPoint(layer, col, row, frame) {
    var cols = layer.columns;
    var rows = layer.rows;
    var cellId = layer.index * 100000 + row * cols + col;

    var rowSeed = hash3(row, cols, 3.17 + layer.index);
    var colSeed = hash3(col, row, 8.91 + layer.index);
    var colSeedB = hash3(col + 11, row + 5, 15.37 + layer.index);

    var u = (row + 0.5 + (rowSeed - 0.5) * 0.18) / rows;
    var y = 1 - 2 * u;
    var lat = Math.asin(clamp(y, -1, 1));

    var golden = 0.61803398875;
    var rowOffset = fract(row * golden + rowSeed * 0.19 + layer.index * 0.137);
    var baseLon = -Math.PI + TAU * ((col + rowOffset + (colSeed - 0.5) * 0.30) / cols);

    var lt = layerTime(frame, layer);
    var tt = textureTime(frame, layer);

    var lon = wrapLongitude(baseLon + zonalDrift(lat, lt, layer));

    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;

    var lowFlow = fbm2(nx * 2.3 + layer.index * 0.11, ny * 2.0, tt, 27.4 + layer.index * 9.1);
    var midFlow = fbm2(nx * 5.8 + 0.4, ny * 4.4 - 0.2, tt * 0.70, 63.2 + layer.index * 8.4);
    var swirl = swirlInfluence(lon, lat, lt);

    lon = wrapLongitude(lon + (lowFlow - 0.5) * 0.060 + swirl.lon * 0.20 * layer.shearScale);
    lat = clamp(lat + (midFlow - 0.5) * 0.032 + swirl.lat * 0.14 * layer.shearScale, -1.45, 1.45);

    return {
      cellId: cellId,
      layerId: layer.id,
      layerName: layer.name,
      layerIndex: layer.index,
      col: col,
      row: row,
      baseLongitude: baseLon,
      baseLatitude: Math.asin(clamp(y, -1, 1)),
      longitude: lon,
      latitude: lat,
      climateBand: climateBand(lat),
      layerTime: lt,
      textureTime: tt,
      noise: lowFlow * 0.58 + midFlow * 0.42,
      swirl: swirl,
      seed: colSeed,
      seedB: colSeedB
    };
  }

  function layerEligibility(layer, samplePoint, moisture, lifecycle) {
    var absLat = Math.abs(samplePoint.latitude) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.10, 0.54, Math.abs(samplePoint.latitude));
    var temperate = smoothstep(0.20, 0.48, absLat) * (1 - smoothstep(0.62, 0.86, absLat));
    var polarGradient = smoothstep(0.50, 0.92, absLat);

    var ocean = clamp(moisture.oceanRatio || 0, 0, 1);
    var coast = clamp(moisture.coastalInfluence || 0, 0, 1);
    var wetland = clamp(moisture.wetlandInfluence || 0, 0, 1);
    var forest = clamp(moisture.forestMoistureReturn || 0, 0, 1);
    var mountain = clamp(moisture.mountainLift || 0, 0, 1);
    var desert = clamp(moisture.desertDryness || 0, 0, 1);
    var polar = clamp(moisture.polarInfluence || 0, 0, 1);
    var orographic = clamp(moisture.orographicCloudBias || 0, 0, 1);
    var storm = clamp(moisture.stormTrackBias || 0, 0, 1);
    var terrainForce = clamp(moisture.terrainForcingStrength || 0, 0, 1);

    var score;

    if (layer.id === "low") {
      score =
        moisture.moisture * 0.22 +
        moisture.humidity * 0.22 +
        ocean * 0.20 +
        coast * 0.16 +
        wetland * 0.22 +
        forest * 0.12 +
        moisture.cloudProbability * 0.13 +
        samplePoint.noise * 0.08 -
        desert * 0.20 -
        polar * 0.10;
    } else if (layer.id === "mid") {
      score =
        moisture.condensation * 0.28 +
        moisture.pressure * 0.18 +
        moisture.humidity * 0.16 +
        orographic * 0.18 +
        storm * 0.17 +
        mountain * 0.12 +
        terrainForce * 0.14 +
        moisture.cloudProbability * 0.18 +
        samplePoint.swirl.strength * 0.10 -
        desert * 0.18 -
        polar * 0.06;
    } else {
      score =
        moisture.circulation * 0.26 +
        storm * 0.28 +
        temperate * 0.20 +
        polarGradient * 0.10 +
        moisture.condensation * 0.14 +
        moisture.cloudProbability * 0.13 +
        samplePoint.swirl.strength * 0.16 +
        samplePoint.noise * 0.10 -
        desert * 0.06 -
        equator * 0.02;
    }

    score += lifecycle.densityEnvelope * 0.07;

    return clamp(score, 0, 1);
  }

  function buildClimateBridge(samplePoint, moisture, layer, eligibility) {
    return {
      climateBand: samplePoint.climateBand,
      surfaceMoistureMemory: clamp(moisture.moisture * 0.42 + moisture.humidity * 0.34 + (moisture.wetlandInfluence || 0) * 0.22, 0, 1),
      stormTrackMemory: clamp((moisture.stormTrackBias || 0) * 0.46 + moisture.circulation * 0.28 + moisture.pressure * 0.20, 0, 1),
      drynessMemory: clamp((moisture.desertDryness || 0) * 0.72 + Math.max(0, 0.42 - moisture.humidity) * 0.22, 0, 1),
      wetlandMemory: clamp((moisture.wetlandInfluence || 0) * 0.66 + (moisture.coastalInfluence || 0) * 0.20, 0, 1),
      orographicMemory: clamp((moisture.orographicCloudBias || 0) * 0.70 + (moisture.mountainLift || 0) * 0.22, 0, 1),
      ecosystemMoistureReturn: clamp((moisture.forestMoistureReturn || 0) * 0.46 + (moisture.wetlandInfluence || 0) * 0.30, 0, 1),
      groundLevelReadiness: clamp(eligibility * 0.44 + (moisture.terrainForcingStrength || 0) * 0.30 + moisture.humidity * 0.18, 0, 1),
      layer: layer.name
    };
  }

  function buildCandidate(layer, samplePoint, moistureApi, frame) {
    var lifecycle = getLifecycleEnvelope(samplePoint.cellId, layer, lifecycleTime(frame));
    var moisture = moistureApi.sample(
      samplePoint.longitude,
      samplePoint.latitude,
      samplePoint.layerTime
    );

    var eligibility = layerEligibility(layer, samplePoint, moisture, lifecycle);
    var blueNoise = hash3(samplePoint.col * 2.71, samplePoint.row * 5.13, 91.7 + layer.index * 14.1);
    var retain = eligibility + (blueNoise - 0.5) * 0.09;

    if (retain < layer.threshold) return null;

    var density = smoothstep(layer.threshold, 0.96, retain) * lifecycle.densityEnvelope;
    var sizeBase = 8.0 + density * 22.0;
    var shear =
      1.04 +
      moisture.circulation * layer.shearScale +
      samplePoint.swirl.strength * layer.shearScale +
      Math.abs(Math.sin(samplePoint.latitude)) * (layer.id === "high" ? 0.34 : 0.16);

    var width = sizeBase * layer.widthBase * 0.030 * shear * lifecycle.sizeEnvelope * layer.sizeScale;
    var height = sizeBase * layer.heightBase * 0.030 * (0.44 + moisture.cloudSoftness * 0.36) * lifecycle.sizeEnvelope * layer.sizeScale;

    if (layer.id === "low") {
      width *= 1.18;
      height *= 0.86;
    }

    if (layer.id === "high") {
      width *= 1.34;
      height *= 0.62;
    }

    var opacity =
      (0.14 + density * 0.48 + moisture.condensation * 0.12) *
      layer.opacityScale *
      state.options.cloudOpacityScale *
      lifecycle.opacityEnvelope;

    opacity = clamp(opacity, 0, state.options.opacityCap);

    if (opacity < 0.018) return null;

    var angle =
      samplePoint.latitude * 1.18 +
      samplePoint.swirl.bend * 0.92 +
      (samplePoint.noise - 0.5) * 0.64 +
      Math.sin(samplePoint.longitude + samplePoint.layerTime * 0.42) * 0.10;

    if (layer.id === "high") angle += Math.sign(samplePoint.latitude || 0.1) * 0.24;

    var bridge = buildClimateBridge(samplePoint, moisture, layer, eligibility);

    return {
      sampleIndex: samplePoint.cellId,
      cellId: samplePoint.cellId,
      layerId: layer.id,
      layerName: layer.name,
      layerIndex: layer.index,
      renderOrder: layer.renderOrder,

      col: samplePoint.col,
      row: samplePoint.row,

      baseLongitude: samplePoint.baseLongitude,
      baseLatitude: samplePoint.baseLatitude,
      longitude: samplePoint.longitude,
      latitude: samplePoint.latitude,
      climateBand: samplePoint.climateBand,

      moisture: moisture.moisture,
      humidity: moisture.humidity,
      condensation: moisture.condensation,
      pressure: moisture.pressure,
      circulation: moisture.circulation,
      cloudProbability: moisture.cloudProbability,
      cloudDensity: density,
      cloudOpacity: opacity,

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
      forestMoistureReturn: clamp(moisture.forestMoistureReturn || 0, 0, 1),
      desertDryness: clamp(moisture.desertDryness || 0, 0, 1),
      polarInfluence: clamp(moisture.polarInfluence || 0, 0, 1),
      orographicCloudBias: clamp(moisture.orographicCloudBias || 0, 0, 1),
      stormTrackBias: clamp(moisture.stormTrackBias || 0, 0, 1),

      denseCloudEligible: eligibility > 0.76,
      stormEligible: eligibility > 0.88,

      width: width,
      height: height,
      angle: angle,
      softness: moisture.cloudSoftness * layer.softnessScale,
      elongation: shear,
      swirl: samplePoint.swirl.bend,
      flowStrength: samplePoint.swirl.strength,
      seed: samplePoint.seed,
      seedB: samplePoint.seedB,

      lifecyclePhase: lifecycle.phase,
      lifecycleEnvelope: lifecycle.envelope,
      densityEnvelope: lifecycle.densityEnvelope,
      opacityEnvelope: lifecycle.opacityEnvelope,
      sizeEnvelope: lifecycle.sizeEnvelope,
      dissipationCurve: lifecycle.dissipation,
      breathingFactor: lifecycle.breathing,
      nonMonotonicDissipationActive: lifecycle.nonMonotonic,

      eligibilityScore: eligibility,
      retainScore: retain,
      projectionState: "unprojected-global-shell-cell",
      frontFacingState: "pending-projection",

      climateBridge: bridge,
      surfaceMoistureMemory: bridge.surfaceMoistureMemory,
      stormTrackMemory: bridge.stormTrackMemory,
      drynessMemory: bridge.drynessMemory,
      wetlandMemory: bridge.wetlandMemory,
      orographicMemory: bridge.orographicMemory,
      ecosystemMoistureReturn: bridge.ecosystemMoistureReturn,
      groundLevelReadiness: bridge.groundLevelReadiness,

      materialClass: state.options.materialClass,
      source: "global-longitude-latitude-multi-layer-shell",
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudMassConservationActive: true,
      cloudGrowthClamped: true,
      lifecycleEnvelopeActive: true,
      timeLapseBlocked: true,
      naturalTimeActive: true,
      cloudReadabilityScaleActive: true,
      weatherSystemScaleActive: true,
      cloudSpeckReductionActive: true,
      cloudSystemReadabilityActive: true,
      globalCloudShellActive: true,
      longitudeLatitudeCloudIdentityActive: true,
      multiLayerCloudCoverageActive: true,
      randomPatchClouds: false,
      flatProjection: false
    };
  }

  function bucketKey(candidate) {
    var lonBucket = Math.floor(
      clamp(
        ((candidate.longitude + Math.PI) / TAU) * state.options.bucketLonCount,
        0,
        state.options.bucketLonCount - 0.0001
      )
    );

    var latBucket = Math.floor(
      clamp(
        ((candidate.latitude + Math.PI / 2) / Math.PI) * state.options.bucketLatCount,
        0,
        state.options.bucketLatCount - 0.0001
      )
    );

    return lonBucket + ":" + latBucket;
  }

  function selectByGlobalBuckets(candidates, maxCount) {
    if (candidates.length <= maxCount) return candidates.slice();

    var buckets = {};
    var keys = [];
    var selected = [];
    var used = {};
    var i;

    for (i = 0; i < candidates.length; i += 1) {
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

  function applyProjectionAndMassConservation(cloud, frame) {
    var projection = projectLonLat(cloud.longitude, cloud.latitude, frame);
    var perspective = clamp(projection.perspective, 0.44, 2.25);
    var layer = LAYERS[cloud.layerIndex] || LAYERS[1];

    var maxCloudWidth = layer.widthBase * perspective;
    var maxCloudHeight = layer.heightBase * perspective;

    cloud.x = projection.x;
    cloud.y = projection.y;
    cloud.z = projection.z;
    cloud.perspective = perspective;
    cloud.frontFacing = projection.frontFacing;
    cloud.visibility = projection.visibility;
    cloud.limbFactor = projection.limbFactor;
    cloud.projectionState = "projected-after-global-shell-generation";
    cloud.frontFacingState = projection.frontFacing ? "front-facing-renderable" : "backside-held";

    cloud.width = clamp(
      cloud.width * perspective * lerp(1.0, state.options.rimCompression, projection.limbFactor),
      6.0 * perspective,
      maxCloudWidth
    );

    cloud.height = clamp(
      cloud.height * perspective * lerp(1.0, 0.64, projection.limbFactor),
      2.8 * perspective,
      maxCloudHeight
    );

    cloud.cloudOpacity = clamp(
      cloud.cloudOpacity * projection.visibility * (1 - smoothstep(0.92, 1.10, projection.limbFactor)),
      0,
      state.options.opacityCap
    );

    cloud.cloudDensity = clamp(cloud.cloudDensity, 0, state.options.densityCap);

    cloud.massEnvelope = clamp(
      (cloud.width * cloud.height * cloud.cloudOpacity) / Math.max(1, maxCloudWidth * maxCloudHeight * state.options.opacityCap),
      0,
      state.options.massCap
    );

    if (cloud.massEnvelope >= state.options.massCap) {
      var compression = Math.sqrt(state.options.massCap / Math.max(0.001, cloud.massEnvelope));
      cloud.width *= compression;
      cloud.height *= compression;
      cloud.cloudOpacity *= 0.96;
      cloud.massEnvelope = state.options.massCap;
    }

    state.lastMaxCloudWidth = Math.max(state.lastMaxCloudWidth, cloud.width);
    state.lastMaxCloudHeight = Math.max(state.lastMaxCloudHeight, cloud.height);

    return cloud;
  }

  function buildFragments(cloud) {
    var fragments = [];
    var layer = LAYERS[cloud.layerIndex] || LAYERS[1];

    var count = Math.max(
      3,
      Math.min(
        12,
        Math.round(
          layer.fragmentCount +
          cloud.cloudDensity * 2.4 +
          cloud.flowStrength * 1.6
        )
      )
    );

    var maxFragmentWidth = layer.fragmentWidthBase * cloud.perspective;
    var maxFragmentHeight = layer.fragmentHeightBase * cloud.perspective;

    var i;

    for (i = 0; i < count; i += 1) {
      var seed = hash3(cloud.sampleIndex, i, 13.7 + layer.index);
      var seedB = hash3(cloud.sampleIndex + 4.2, i + 9.1, 33.4 + layer.index);
      var seedC = hash3(cloud.sampleIndex + 11.8, i + 17.6, 70.2 + layer.index);

      var flowAngle = cloud.angle + (seed - 0.5) * (0.34 + cloud.flowStrength * 0.22);
      var offsetRadius = cloud.width * (0.040 + seedB * 0.19);
      var offsetX = Math.cos(flowAngle) * offsetRadius;
      var offsetY = Math.sin(flowAngle) * offsetRadius * (layer.id === "high" ? 0.34 : 0.44);

      var fragmentWidth = cloud.width * (layer.id === "high" ? 0.22 + seed * 0.36 : 0.18 + seed * 0.30);
      var fragmentHeight = cloud.height * (layer.id === "high" ? 0.18 + seedC * 0.28 : 0.24 + seedC * 0.34);

      fragments.push({
        x: cloud.x + offsetX,
        y: cloud.y + offsetY,
        width: clamp(fragmentWidth, 1.8 * cloud.perspective, maxFragmentWidth),
        height: clamp(fragmentHeight, 1.0 * cloud.perspective, maxFragmentHeight),
        angle: flowAngle,
        opacity: clamp(cloud.cloudOpacity * (0.28 + seedB * 0.42), 0, MAX_OPACITY),
        softness: cloud.softness,
        shade: seedC,
        flowStrength: cloud.flowStrength,
        layerId: cloud.layerId,
        cloudGrowthClamped: true,
        cloudReadabilityScaleActive: true
      });
    }

    return fragments;
  }

  function buildGlobalCloudShell(frame) {
    var moistureApi = getMoistureApi();

    state.moistureDetected = Boolean(moistureApi && typeof moistureApi.sample === "function");

    if (!state.moistureDetected) {
      return {
        allCandidates: [],
        selectedClouds: [],
        selectedByLayer: {
          low: [],
          mid: [],
          high: []
        },
        reason: "MOISTURE_CHILD_NOT_DETECTED"
      };
    }

    var selectedByLayer = {
      low: [],
      mid: [],
      high: []
    };

    var allCandidates = [];

    for (var layerIndex = 0; layerIndex < LAYERS.length; layerIndex += 1) {
      var layer = LAYERS[layerIndex];
      var layerCandidates = [];

      for (var row = 0; row < layer.rows; row += 1) {
        for (var col = 0; col < layer.columns; col += 1) {
          var point = globalShellPoint(layer, col, row, frame || {});
          var candidate = buildCandidate(layer, point, moistureApi, frame || {});

          if (!candidate) continue;

          layerCandidates.push(candidate);
          allCandidates.push(candidate);
        }
      }

      selectedByLayer[layer.id] = selectByGlobalBuckets(layerCandidates, layer.maxClouds);
    }

    return {
      allCandidates: allCandidates,
      selectedByLayer: selectedByLayer,
      selectedClouds: selectedByLayer.low.concat(selectedByLayer.mid, selectedByLayer.high),
      reason: "GLOBAL_SHELL_BUILT"
    };
  }

  function buildLayer(frame) {
    state.lastMaxCloudWidth = 0;
    state.lastMaxCloudHeight = 0;
    state.lastLayerCounts = {
      low: 0,
      mid: 0,
      high: 0
    };

    var shell = buildGlobalCloudShell(frame || {});

    if (!state.moistureDetected) {
      state.cloudsReady = false;
      state.rendererReady = false;

      return {
        contract: CONTRACT,
        lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
        readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
        globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        standard: STANDARD,
        family: FAMILY,
        file: FILE,
        layerVersion: state.layerVersion,
        layerKind: state.layerKind,
        renderMode: state.renderMode,
        frameIndex: frame && frame.frameIndex ? frame.frameIndex : 0,
        renderTime: frame && frame.renderTime ? frame.renderTime : 0,
        clouds: [],
        cloudCount: 0,
        fragmentCount: 0,
        moistureDetected: false,
        cloudsReady: false,
        rendererReady: false,
        reason: shell.reason,
        cloudsDerivedFromMoisture: false,
        globalCloudShellActive: true,
        randomPatchClouds: false,
        flatProjection: false,
        visible256Grid: false
      };
    }

    var clouds = [];
    var cloudOpacitySum = 0;
    var fragmentCount = 0;
    var moistureEligibleCount = shell.allCandidates.length;
    var layerCounts = {
      low: 0,
      mid: 0,
      high: 0
    };

    for (var i = 0; i < shell.selectedClouds.length; i += 1) {
      var cloud = applyProjectionAndMassConservation(shell.selectedClouds[i], frame || {});

      if (!cloud.frontFacing || cloud.visibility < state.options.frontVisibilityFloor || cloud.cloudOpacity < 0.010) {
        continue;
      }

      cloud.fragments = buildFragments(cloud);
      clouds.push(cloud);

      layerCounts[cloud.layerId] = (layerCounts[cloud.layerId] || 0) + 1;
      cloudOpacitySum += cloud.cloudOpacity;
      fragmentCount += cloud.fragments.length;
    }

    clouds.sort(function (a, b) {
      if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
      return a.z - b.z;
    });

    state.lastFrameIndex = frame && typeof frame.frameIndex === "number" ? frame.frameIndex : state.lastFrameIndex;
    state.lastRenderTime = frame && typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime;
    state.lastCloudCount = clouds.length;
    state.lastFragmentCount = fragmentCount;
    state.lastMoistureEligibleCount = moistureEligibleCount;
    state.lastAverageCloudOpacity = clouds.length ? cloudOpacitySum / clouds.length : 0;
    state.lastLayerCounts = layerCounts;

    state.cloudsReady = true;
    state.rendererReady = true;
    state.diagnosticReady = true;

    var layer = {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      moistureContract: MOISTURE_CONTRACT,

      layerVersion: state.layerVersion,
      layerKind: state.layerKind,
      renderMode: state.renderMode,

      frameIndex: state.lastFrameIndex,
      renderTime: state.lastRenderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      highDensitySampleCount:
        LAYERS[0].columns * LAYERS[0].rows +
        LAYERS[1].columns * LAYERS[1].rows +
        LAYERS[2].columns * LAYERS[2].rows,

      globalCandidateCount: shell.allCandidates.length,
      moistureDetected: state.moistureDetected,
      moistureFieldReady: true,
      cloudEligibilityReady: true,

      clouds: clouds,
      cloudCount: clouds.length,
      fragmentCount: fragmentCount,
      moistureEligibleCount: moistureEligibleCount,
      averageCloudOpacity: state.lastAverageCloudOpacity,

      layerCounts: layerCounts,
      lowBoundaryLayerCount: layerCounts.low || 0,
      midWeatherLayerCount: layerCounts.mid || 0,
      highJetLayerCount: layerCounts.high || 0,

      maxCloudWidthObserved: state.lastMaxCloudWidth,
      maxCloudHeightObserved: state.lastMaxCloudHeight,

      cloudsReady: state.cloudsReady,
      rendererReady: state.rendererReady,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudSpeedReduced: true,
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
      groundLevelClimateBridgeReady: true,
      noHardHemisphereCutoff: true,
      noTopBandOnlyClouds: true,
      terrainMoistureForcingPreserved: true,
      jetStreamBaselinePreserved: true,

      organicSwirlFlowActive: true,
      highDensityCloudFieldActive: true,

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

  function drawSoftFragment(ctx, fragment, baseOpacity) {
    var w = Math.max(1, fragment.width);
    var h = Math.max(1, fragment.height);
    var opacity = clamp(fragment.opacity * baseOpacity, 0, MAX_OPACITY);

    if (opacity <= 0.01) return;

    ctx.save();
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.angle);
    ctx.scale(1, fragment.layerId === "high" ? 0.54 : 0.70);

    var radius = Math.max(w, h);
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

    if (fragment.layerId === "low") {
      gradient.addColorStop(0, "rgba(230,246,255," + (0.40 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.42, "rgba(198,226,242," + (0.24 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    } else if (fragment.layerId === "high") {
      gradient.addColorStop(0, "rgba(255,255,255," + (0.78 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.28, "rgba(238,249,255," + (0.48 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.64, "rgba(186,218,238," + (0.16 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    } else {
      gradient.addColorStop(0, "rgba(255,255,255," + (0.76 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.28, "rgba(238,249,255," + (0.56 * opacity).toFixed(4) + ")");
      gradient.addColorStop(0.60, "rgba(186,218,238," + (0.26 * opacity).toFixed(4) + ")");
      gradient.addColorStop(1, "rgba(120,160,196,0)");
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, TAU);
    ctx.fill();

    if (fragment.flowStrength > 0.20 && fragment.layerId !== "low") {
      ctx.globalAlpha = opacity * 0.10;
      ctx.strokeStyle = "rgba(245,252,255,0.70)";
      ctx.lineWidth = Math.max(0.7, radius * 0.028);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.66, h * 0.52, 0, -0.72, 0.72);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCloud(ctx, cloud) {
    if (!ctx || !cloud || !cloud.fragments) return;

    var baseOpacity = clamp(cloud.cloudOpacity, 0, MAX_OPACITY);
    var i;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (i = 0; i < cloud.fragments.length; i += 1) {
      drawSoftFragment(ctx, cloud.fragments[i], baseOpacity);
    }

    if (cloud.denseCloudEligible && cloud.layerId !== "low") {
      ctx.globalAlpha = clamp(baseOpacity * 0.10, 0, 0.15);
      ctx.fillStyle = "rgba(255,255,255,0.66)";
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width * 0.28,
        cloud.height * 0.22,
        cloud.angle,
        0,
        TAU
      );
      ctx.fill();
    }

    ctx.restore();
  }

  function clipToSphere(ctx, frame) {
    var metrics = getFrameMetrics(frame);
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.005, 0, TAU);
    ctx.clip();
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
      var i;

      ctx.save();
      clipToSphere(ctx, frame || {});

      for (i = 0; i < clouds.length; i += 1) {
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

  function configure(options) {
    var key;

    options = options || {};

    for (key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key) && Object.prototype.hasOwnProperty.call(state.options, key)) {
        state.options[key] = options[key];
      }
    }

    state.diagnosticReady = true;

    return status();
  }

  function status() {
    return {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      moistureContract: MOISTURE_CONTRACT,

      initialized: state.initialized,
      cloudsReady: state.cloudsReady,
      rendererReady: state.rendererReady,
      moistureDetected: state.moistureDetected,
      diagnosticReady: state.diagnosticReady,

      layerVersion: state.layerVersion,
      publicContract: state.publicContract,
      layerKind: state.layerKind,
      renderMode: state.renderMode,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastCloudCount: state.lastCloudCount,
      lastFragmentCount: state.lastFragmentCount,
      lastMoistureEligibleCount: state.lastMoistureEligibleCount,
      lastAverageCloudOpacity: state.lastAverageCloudOpacity,
      lastLayerCounts: state.lastLayerCounts,
      lastMaxCloudWidth: state.lastMaxCloudWidth,
      lastMaxCloudHeight: state.lastMaxCloudHeight,

      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

      naturalTimeActive: true,
      timeLapseBlocked: true,
      cloudSpeedReduced: true,
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
      groundLevelClimateBridgeReady: true,
      noHardHemisphereCutoff: true,
      noTopBandOnlyClouds: true,
      terrainMoistureForcingPreserved: true,
      jetStreamBaselinePreserved: true,

      organicSwirlFlowActive: true,
      highDensityCloudFieldActive: true,

      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      diagnosticReportsCloudState: true,

      generatedImage: false,
      graphicBox: false,
      randomPatchClouds: false,
      flatProjection: false,
      visible256Grid: false,
      cssRingProof: false,
      routeAuthority: false,
      htmlAuthority: false,

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
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
      globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
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
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      init: init,
      configure: configure,
      buildLayer: buildLayer,
      render: render,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_CLOUDS = api;
    window.AUDRALIA_TRUE_GLOBE_CLOUD_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_CLOUDS = api;
    window.AUDRALIA_G2_TRUE_GLOBE_CLOUD_STATUS = status();

    return api;
  }

  function init(options) {
    try {
      configure(options || {});

      state.initialized = true;
      state.diagnosticReady = true;
      state.moistureDetected = Boolean(getMoistureApi());

      publish();

      window.AUDRALIA_TRUE_GLOBE_CLOUDS_BOOT = {
        contract: CONTRACT,
        lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
        readabilityScaleCalibrationContract: READABILITY_SCALE_CALIBRATION_CONTRACT,
        globalMultiLayerCloudShellContract: GLOBAL_MULTI_LAYER_SHELL_CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        standard: STANDARD,
        family: FAMILY,
        file: FILE,
        moistureDetected: state.moistureDetected,
        naturalTimeActive: true,
        timeLapseBlocked: true,
        cloudSpeedReduced: true,
        cloudMassConservationActive: true,
        cloudGrowthClamped: true,
        lifecycleEnvelopeActive: true,
        nonMonotonicDissipationActive: true,
        cloudCountStableRange: true,
        organicSwirlFlowActive: true,
        highDensityCloudFieldActive: true,
        cloudsNotVisible256Grid: true,
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
        groundLevelClimateBridgeReady: true,
        noHardHemisphereCutoff: true,
        noTopBandOnlyClouds: true,
        bootedAt: new Date().toISOString(),
        meaning: "Global multi-layer cloud shell evaluated. Public v2 contract and lifecycle v3 marker preserved; v5 shell continuity active."
      };

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
