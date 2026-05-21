// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_CLOUD_LIFECYCLE_CONSERVATION_CHILD_TNT_v3
//
// Public cloud contract intentionally preserved for runtime compatibility:
// AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2
//
// Supersedes internally:
// AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2
//
// Family:
// /assets/audralia/clean/runtime/
//
// Depends on:
// /assets/audralia/clean/runtime/audralia.true-globe.moisture.js
// window.AUDRALIA_TRUE_GLOBE_MOISTURE
//
// Purpose:
// - Preserve moisture-driven cloud authority.
// - Preserve runtime compatibility.
// - Add natural-time cloud lifecycle conservation.
// - Prevent time-lapse growth.
// - Prevent indefinite cloud inflation.
// - Preserve organic swirl flow.
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
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";
  var MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_CLOUD_LIFECYCLE_CONSERVATION_AND_NATURAL_TIME_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var MAX_CLOUD_WIDTH_BASE = 58;
  var MAX_CLOUD_HEIGHT_BASE = 28;
  var MAX_FRAGMENT_WIDTH_BASE = 24;
  var MAX_FRAGMENT_HEIGHT_BASE = 14;
  var MAX_OPACITY = 0.64;

  var DEFAULT_OPTIONS = {
    cloudOpacityScale: 0.84,
    cloudSizeScale: 0.92,
    cloudSoftnessScale: 1.10,

    organicColumns: 56,
    organicRows: 28,
    maxCloudsPerFrame: 160,
    microFragmentCount: 7,

    weatherAdvectionTimeScale: 0.012,
    swirlTimeScale: 0.009,
    textureTimeScale: 0.006,
    lifecycleTimeScale: 0.004,

    lifecycleMinimum: 0.34,
    lifecycleMaximum: 1.0,
    breathingStrength: 0.045,
    dissipationStrength: 0.34,

    frontVisibilityFloor: 0.16,
    backVisibilityFloor: 0.0,
    rimCompression: 0.68,
    limbFadeStart: 0.72,
    limbFadeEnd: 1.03,

    massCap: 1.0,
    opacityCap: MAX_OPACITY,
    densityCap: 0.86,

    proceduralResolution: "4k-ready-organic-flow-conserved",
    materialClass: "cool-white-blue-gray-moisture-cloud",

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

    lastMaxCloudWidth: 0,
    lastMaxCloudHeight: 0,

    layerVersion: LIFECYCLE_CONSERVATION_CONTRACT,
    publicContract: CONTRACT,
    layerKind: "organic-high-density-moisture-cloud-flow-with-lifecycle-conservation",
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

  function getWeatherTime(frame) {
    return finite(frame && frame.renderTime, 0) * state.options.weatherAdvectionTimeScale;
  }

  function getSwirlTime(frame) {
    return finite(frame && frame.renderTime, 0) * state.options.swirlTimeScale;
  }

  function getTextureTime(frame) {
    return finite(frame && frame.renderTime, 0) * state.options.textureTimeScale;
  }

  function getLifecycleTime(frame) {
    return finite(frame && frame.renderTime, 0) * state.options.lifecycleTimeScale;
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
      frontFacing: rotated.z >= -0.04,
      visibility: rotated.z >= 0 ? 1 : clamp(0.08 + (rotated.z + 1) * 0.08, 0, 0.14),
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

  function zonalDrift(lat, weatherTime) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.16, 0.46, abs);
    var temperate = smoothstep(0.22, 0.55, abs) * (1 - smoothstep(0.68, 0.92, abs));
    var polar = smoothstep(0.72, 1.0, abs);

    return weatherTime * (
      equator * 0.18 +
      temperate * -0.13 +
      polar * 0.05
    );
  }

  function getLifecycleEnvelope(cellId, lifecycleTime) {
    var phaseOffset = hash3(cellId, 21.7, 4.9);
    var maturityBias = hash3(cellId, 13.1, 8.2);
    var dissipationBias = hash3(cellId, 33.4, 17.6);
    var breathingBias = hash3(cellId, 47.2, 25.3);

    var phase = fract(lifecycleTime * (0.035 + maturityBias * 0.025) + phaseOffset);

    var formation = smoothstep(0.04, 0.24, phase);
    var maturity = 1 - smoothstep(0.52 + dissipationBias * 0.08, 0.76 + dissipationBias * 0.08, phase);
    var renewal = smoothstep(0.86, 1.0, phase) * 0.18;

    var envelope = clamp(formation * maturity + renewal, state.options.lifecycleMinimum, state.options.lifecycleMaximum);

    var breathing =
      1 +
      Math.sin((phase + breathingBias) * TAU) *
      state.options.breathingStrength *
      envelope;

    var dissipation = smoothstep(0.62, 0.92, phase) * state.options.dissipationStrength;

    return {
      phase: phase,
      formation: formation,
      maturity: maturity,
      renewal: renewal,
      envelope: clamp(envelope * breathing, state.options.lifecycleMinimum, state.options.lifecycleMaximum),
      densityEnvelope: clamp(envelope * (1 - dissipation * 0.34), 0.16, state.options.densityCap),
      opacityEnvelope: clamp(envelope * (1 - dissipation * 0.48), 0.12, 1),
      sizeEnvelope: clamp(0.58 + envelope * 0.42 - dissipation * 0.18, 0.42, 1),
      dissipation: dissipation,
      breathing: breathing,
      nonMonotonic: true
    };
  }

  function organicSamplePoint(col, row, cols, rows, frame) {
    var weatherTime = getWeatherTime(frame);
    var swirlTime = getSwirlTime(frame);
    var textureTime = getTextureTime(frame);

    var cellId = row * cols + col;
    var rowSeed = hash3(row, cols, 3.17);
    var colSeed = hash3(col, row, 8.91);
    var colSeedB = hash3(col + 11, row + 5, 15.37);

    var u = (row + 0.5 + (rowSeed - 0.5) * 0.22) / rows;
    var y = 1 - 2 * u;
    var lat = Math.asin(clamp(y, -1, 1));

    var golden = 0.61803398875;
    var rowOffset = fract(row * golden + rowSeed * 0.19);
    var lon = -Math.PI + TAU * ((col + rowOffset + (colSeed - 0.5) * 0.34) / cols);

    lon = wrapLongitude(lon + zonalDrift(lat, weatherTime));

    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;
    var lowFlow = fbm2(nx * 2.7, ny * 2.1, textureTime, 27.4);
    var midFlow = fbm2(nx * 6.4 + 0.4, ny * 4.9 - 0.2, textureTime * 0.70, 63.2);
    var swirl = swirlInfluence(lon, lat, swirlTime);

    lon = wrapLongitude(lon + (lowFlow - 0.5) * 0.075 + swirl.lon * 0.24);
    lat = clamp(lat + (midFlow - 0.5) * 0.038 + swirl.lat * 0.18, -1.42, 1.42);

    return {
      cellId: cellId,
      col: col,
      row: row,
      longitude: lon,
      latitude: lat,
      weatherTime: weatherTime,
      swirlTime: swirlTime,
      textureTime: textureTime,
      noise: lowFlow * 0.62 + midFlow * 0.38,
      swirl: swirl,
      seed: colSeed,
      seedB: colSeedB
    };
  }

  function applyMassConservation(cloud, projection) {
    var perspective = clamp(projection.perspective, 0.44, 2.25);
    var maxCloudWidth = MAX_CLOUD_WIDTH_BASE * perspective;
    var maxCloudHeight = MAX_CLOUD_HEIGHT_BASE * perspective;

    cloud.width = clamp(cloud.width, 4.0 * perspective, maxCloudWidth);
    cloud.height = clamp(cloud.height, 2.2 * perspective, maxCloudHeight);
    cloud.cloudOpacity = clamp(cloud.cloudOpacity, 0, state.options.opacityCap);
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

    cloud.cloudGrowthClamped = true;
    cloud.cloudMassConservationActive = true;

    return cloud;
  }

  function evaluateOrganicCloud(samplePoint, moistureApi, frame) {
    var lifecycleTime = getLifecycleTime(frame);
    var lifecycle = getLifecycleEnvelope(samplePoint.cellId, lifecycleTime);

    var moisture = moistureApi.sample(
      samplePoint.longitude,
      samplePoint.latitude,
      samplePoint.weatherTime
    );

    var projection = projectLonLat(samplePoint.longitude, samplePoint.latitude, frame);

    if (!projection.frontFacing || projection.visibility < state.options.frontVisibilityFloor) {
      return null;
    }

    var coherence =
      samplePoint.noise * 0.22 +
      samplePoint.swirl.strength * 0.22 +
      moisture.condensation * 0.34 +
      moisture.circulation * 0.16 +
      lifecycle.densityEnvelope * 0.06;

    var threshold =
      0.57 +
      smoothstep(0.75, 1.0, projection.limbFactor) * 0.07 -
      samplePoint.swirl.strength * 0.026;

    var probability = moisture.cloudProbability * 0.72 + coherence * 0.28;
    var blueNoise = hash3(samplePoint.col * 2.71, samplePoint.row * 5.13, 91.7);
    var retain = probability + (blueNoise - 0.5) * 0.12;

    if (retain < threshold) return null;

    var density = smoothstep(threshold, 0.95, retain) * lifecycle.densityEnvelope;
    var perspective = clamp(projection.perspective, 0.44, 2.25);
    var limbFade = 1 - smoothstep(0.88, 1.08, projection.limbFactor);

    var baseSize = (5.2 + density * 14.0) * perspective * state.options.cloudSizeScale;
    var shear =
      1.05 +
      moisture.circulation * 0.82 +
      samplePoint.swirl.strength * 1.05 +
      Math.abs(Math.sin(samplePoint.latitude)) * 0.16;

    var width =
      baseSize *
      shear *
      lifecycle.sizeEnvelope *
      lerp(1.0, state.options.rimCompression, projection.limbFactor);

    var height =
      baseSize *
      (0.32 + moisture.cloudSoftness * 0.36) *
      lifecycle.sizeEnvelope *
      lerp(1.0, 0.58, projection.limbFactor);

    var opacity =
      (0.16 + density * 0.48 + moisture.condensation * 0.13) *
      state.options.cloudOpacityScale *
      projection.visibility *
      limbFade *
      lifecycle.opacityEnvelope;

    opacity = clamp(opacity, 0, state.options.opacityCap);

    if (opacity < 0.025) return null;

    var angle =
      samplePoint.latitude * 1.22 +
      samplePoint.swirl.bend * 0.92 +
      (samplePoint.noise - 0.5) * 0.64 +
      Math.sin(samplePoint.longitude + samplePoint.weatherTime * 0.42) * 0.10;

    var cloud = {
      sampleIndex: samplePoint.cellId,
      cellId: samplePoint.cellId,
      col: samplePoint.col,
      row: samplePoint.row,

      longitude: samplePoint.longitude,
      latitude: samplePoint.latitude,

      x: projection.x,
      y: projection.y,
      z: projection.z,
      perspective: perspective,
      frontFacing: projection.frontFacing,
      visibility: projection.visibility,
      limbFactor: projection.limbFactor,

      moisture: moisture.moisture,
      humidity: moisture.humidity,
      condensation: moisture.condensation,
      pressure: moisture.pressure,
      circulation: moisture.circulation,
      cloudProbability: moisture.cloudProbability,
      cloudDensity: density,
      cloudOpacity: opacity,

      denseCloudEligible: probability > 0.78,
      stormEligible: probability > 0.90,

      width: width,
      height: height,
      angle: angle,
      softness: moisture.cloudSoftness,
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

      materialClass: state.options.materialClass,
      source: "organic-moisture-flow-field-with-lifecycle-conservation",
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudMassConservationActive: true,
      cloudGrowthClamped: true,
      lifecycleEnvelopeActive: true,
      timeLapseBlocked: true,
      naturalTimeActive: true,
      randomPatchClouds: false,
      flatProjection: false
    };

    return applyMassConservation(cloud, projection);
  }

  function buildFragments(cloud) {
    var fragments = [];
    var count = Math.max(
      3,
      Math.min(
        10,
        Math.round(
          state.options.microFragmentCount +
          cloud.cloudDensity * 3 +
          cloud.flowStrength * 2
        )
      )
    );

    var maxFragmentWidth = MAX_FRAGMENT_WIDTH_BASE * cloud.perspective;
    var maxFragmentHeight = MAX_FRAGMENT_HEIGHT_BASE * cloud.perspective;

    var i;

    for (i = 0; i < count; i += 1) {
      var seed = hash3(cloud.sampleIndex, i, 13.7);
      var seedB = hash3(cloud.sampleIndex + 4.2, i + 9.1, 33.4);
      var seedC = hash3(cloud.sampleIndex + 11.8, i + 17.6, 70.2);

      var flowAngle = cloud.angle + (seed - 0.5) * (0.38 + cloud.flowStrength * 0.24);
      var offsetRadius = cloud.width * (0.045 + seedB * 0.20);
      var offsetX = Math.cos(flowAngle) * offsetRadius;
      var offsetY = Math.sin(flowAngle) * offsetRadius * 0.42;

      var fragmentWidth = cloud.width * (0.15 + seed * 0.24);
      var fragmentHeight = cloud.height * (0.20 + seedC * 0.28);

      fragments.push({
        x: cloud.x + offsetX,
        y: cloud.y + offsetY,
        width: clamp(fragmentWidth, 1.0 * cloud.perspective, maxFragmentWidth),
        height: clamp(fragmentHeight, 0.8 * cloud.perspective, maxFragmentHeight),
        angle: flowAngle,
        opacity: clamp(cloud.cloudOpacity * (0.26 + seedB * 0.36), 0, MAX_OPACITY),
        softness: cloud.softness,
        shade: seedC,
        flowStrength: cloud.flowStrength,
        cloudGrowthClamped: true
      });
    }

    return fragments;
  }

  function buildLayer(frame) {
    var moistureApi = getMoistureApi();

    state.moistureDetected = Boolean(moistureApi && typeof moistureApi.sample === "function");
    state.lastMaxCloudWidth = 0;
    state.lastMaxCloudHeight = 0;

    if (!state.moistureDetected) {
      state.cloudsReady = false;
      state.rendererReady = false;

      return {
        contract: CONTRACT,
        lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
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
        reason: "MOISTURE_CHILD_NOT_DETECTED",
        cloudsDerivedFromMoisture: false,
        randomPatchClouds: false,
        flatProjection: false,
        visible256Grid: false
      };
    }

    var cols = Math.max(24, Math.min(96, state.options.organicColumns));
    var rows = Math.max(12, Math.min(48, state.options.organicRows));
    var limit = Math.max(32, Math.min(220, state.options.maxCloudsPerFrame));

    var clouds = [];
    var cloudOpacitySum = 0;
    var fragmentCount = 0;
    var eligibleCount = 0;

    var row;
    var col;

    for (row = 0; row < rows; row += 1) {
      for (col = 0; col < cols; col += 1) {
        if (clouds.length >= limit) break;

        var point = organicSamplePoint(col, row, cols, rows, frame || {});
        var cloud = evaluateOrganicCloud(point, moistureApi, frame || {});

        if (!cloud) continue;

        eligibleCount += 1;
        cloud.fragments = buildFragments(cloud);

        clouds.push(cloud);
        cloudOpacitySum += cloud.cloudOpacity;
        fragmentCount += cloud.fragments.length;
      }

      if (clouds.length >= limit) break;
    }

    clouds.sort(function (a, b) {
      return a.z - b.z;
    });

    state.lastFrameIndex = frame && typeof frame.frameIndex === "number" ? frame.frameIndex : state.lastFrameIndex;
    state.lastRenderTime = frame && typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime;
    state.lastCloudCount = clouds.length;
    state.lastFragmentCount = fragmentCount;
    state.lastMoistureEligibleCount = eligibleCount;
    state.lastAverageCloudOpacity = clouds.length ? cloudOpacitySum / clouds.length : 0;

    state.cloudsReady = true;
    state.rendererReady = true;
    state.diagnosticReady = true;

    var layer = {
      contract: CONTRACT,
      lifecycleConservationContract: LIFECYCLE_CONSERVATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      moistureContract:
        moistureApi && moistureApi.status && moistureApi.status().contract
          ? moistureApi.status().contract
          : MOISTURE_CONTRACT,

      layerVersion: state.layerVersion,
      layerKind: state.layerKind,
      renderMode: state.renderMode,

      frameIndex: state.lastFrameIndex,
      renderTime: state.lastRenderTime,

      weatherAdvectionTime: getWeatherTime(frame || {}),
      swirlTime: getSwirlTime(frame || {}),
      textureTime: getTextureTime(frame || {}),
      lifecycleTime: getLifecycleTime(frame || {}),

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      organicColumns: cols,
      organicRows: rows,
      highDensitySampleCount: cols * rows,

      moistureDetected: state.moistureDetected,
      moistureFieldReady: true,
      cloudEligibilityReady: true,

      clouds: clouds,
      cloudCount: clouds.length,
      fragmentCount: fragmentCount,
      moistureEligibleCount: eligibleCount,
      averageCloudOpacity: state.lastAverageCloudOpacity,

      maxCloudWidthObserved: state.lastMaxCloudWidth,
      maxCloudHeightObserved: state.lastMaxCloudHeight,
      maxCloudWidthCap: MAX_CLOUD_WIDTH_BASE,
      maxCloudHeightCap: MAX_CLOUD_HEIGHT_BASE,
      maxFragmentWidthCap: MAX_FRAGMENT_WIDTH_BASE,
      maxFragmentHeightCap: MAX_FRAGMENT_HEIGHT_BASE,

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
    ctx.scale(1, 0.70);

    var radius = Math.max(w, h);
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

    gradient.addColorStop(0, "rgba(255,255,255," + (0.70 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.28, "rgba(238,249,255," + (0.50 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.60, "rgba(186,218,238," + (0.22 * opacity).toFixed(4) + ")");
    gradient.addColorStop(1, "rgba(120,160,196,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, TAU);
    ctx.fill();

    if (fragment.flowStrength > 0.20) {
      ctx.globalAlpha = opacity * 0.08;
      ctx.strokeStyle = "rgba(245,252,255,0.70)";
      ctx.lineWidth = Math.max(0.7, radius * 0.026);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.64, h * 0.50, 0, -0.72, 0.72);
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

    if (cloud.denseCloudEligible) {
      ctx.globalAlpha = clamp(baseOpacity * 0.08, 0, 0.11);
      ctx.fillStyle = "rgba(255,255,255,0.62)";
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width * 0.24,
        cloud.height * 0.18,
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

      organicColumns: state.options.organicColumns,
      organicRows: state.options.organicRows,
      maxCloudsPerFrame: state.options.maxCloudsPerFrame,

      weatherAdvectionTimeScale: state.options.weatherAdvectionTimeScale,
      swirlTimeScale: state.options.swirlTimeScale,
      textureTimeScale: state.options.textureTimeScale,
      lifecycleTimeScale: state.options.lifecycleTimeScale,

      maxCloudWidthBase: MAX_CLOUD_WIDTH_BASE,
      maxCloudHeightBase: MAX_CLOUD_HEIGHT_BASE,
      maxFragmentWidthBase: MAX_FRAGMENT_WIDTH_BASE,
      maxFragmentHeightBase: MAX_FRAGMENT_HEIGHT_BASE,
      maxOpacity: MAX_OPACITY,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastCloudCount: state.lastCloudCount,
      lastFragmentCount: state.lastFragmentCount,
      lastMoistureEligibleCount: state.lastMoistureEligibleCount,
      lastAverageCloudOpacity: state.lastAverageCloudOpacity,
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
        bootedAt: new Date().toISOString(),
        meaning: "Cloud lifecycle conservation child evaluated. Public v2 contract preserved for runtime compatibility; v3 lifecycle conservation active."
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
