// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2
//
// Supersedes:
// AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1
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
// - Reduce visible cloud speed.
// - Stop visible clouds from exposing the 16 × 16 / 256 diagnostic lattice.
// - Use the 256 lattice/moisture field as hidden atmospheric authority.
// - Render a higher-density organic cloud-flow layer for Planet View only.
// - Add slow atmospheric drift, circulation swirl, local shear, and stable turbulence.
// - Do not create canvas.
// - Do not modify HTML.
// - Do not own route JS.
// - Do not render Lattice View.
// - No generated image. No GraphicBox. No flat projection. No sticker clouds.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_ORGANIC_MOISTURE_CLOUD_FLOW_CHILD_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";
  var MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_ORGANIC_MOISTURE_CLOUD_FLOW_REFINEMENT_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var DEFAULT_OPTIONS = {
    cloudOpacityScale: 0.92,
    cloudSizeScale: 1.0,
    cloudSoftnessScale: 1.16,

    // Organic field density. Not the diagnostic lattice.
    organicColumns: 56,
    organicRows: 28,
    maxCloudsPerFrame: 190,
    microFragmentCount: 7,

    // Slowed substantially from the first live version.
    globalCloudTimeScale: 0.055,
    swirlTimeScale: 0.032,
    textureTimeScale: 0.018,

    // Visibility / behavior.
    frontVisibilityFloor: 0.16,
    backVisibilityFloor: 0.0,
    rimCompression: 0.68,
    limbFadeStart: 0.72,
    limbFadeEnd: 1.03,

    proceduralResolution: "4k-ready-organic-flow",
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
    { lon: -2.56, lat: 0.52, radius: 0.82, strength: 0.34, drift: 0.020, sign: 1 },
    { lon: -0.92, lat: -0.34, radius: 1.04, strength: 0.28, drift: -0.015, sign: -1 },
    { lon: 0.74, lat: 0.24, radius: 0.74, strength: 0.32, drift: 0.012, sign: 1 },
    { lon: 2.20, lat: -0.58, radius: 0.94, strength: 0.24, drift: -0.018, sign: -1 },
    { lon: 2.92, lat: 0.68, radius: 0.62, strength: 0.18, drift: 0.010, sign: 1 }
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

    layerVersion: CONTRACT,
    layerKind: "organic-high-density-moisture-cloud-flow",
    renderMode: "canvas-2d-runtime-consumer-planet-view-only",

    organicFlowActive: true,
    highDensityCloudFieldActive: true,
    cloudSpeedReduced: true,
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
        x * freq + time * (0.13 + i * 0.019),
        y * freq - time * (0.09 + i * 0.013),
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

  function swirlInfluence(lon, lat, slowTime) {
    var influenceLon = 0;
    var influenceLat = 0;
    var bend = 0;
    var strengthSum = 0;
    var i;

    for (i = 0; i < SWIRL_CENTERS.length; i += 1) {
      var center = SWIRL_CENTERS[i];
      var centerLon = wrapLongitude(center.lon + slowTime * center.drift);
      var centerLat = clamp(center.lat + Math.sin(slowTime * 0.19 + i * 1.7) * 0.045, -1.28, 1.28);
      var distance = greatCircleDistance(lon, lat, centerLon, centerLat);
      var force = Math.exp(-(distance * distance) / Math.max(0.001, center.radius * center.radius));
      var dLon = wrapLongitude(lon - centerLon);
      var dLat = lat - centerLat;

      influenceLon += -dLat * force * center.strength * center.sign;
      influenceLat += dLon * force * center.strength * center.sign * 0.42;
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

  function zonalDrift(lat, slowTime) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.16, 0.46, abs);
    var temperate = smoothstep(0.22, 0.55, abs) * (1 - smoothstep(0.68, 0.92, abs));
    var polar = smoothstep(0.72, 1.0, abs);

    return slowTime * (
      equator * 0.34 +
      temperate * -0.24 +
      polar * 0.10
    );
  }

  function organicSamplePoint(col, row, cols, rows, frame) {
    var renderTime = finite(frame && frame.renderTime, 0);
    var slowTime = renderTime * state.options.globalCloudTimeScale;
    var swirlTime = renderTime * state.options.swirlTimeScale;
    var textureTime = renderTime * state.options.textureTimeScale;

    var rowSeed = hash3(row, cols, 3.17);
    var colSeed = hash3(col, row, 8.91);
    var colSeedB = hash3(col + 11, row + 5, 15.37);

    // Equal-area latitude. Jitter is small and stable.
    var u = (row + 0.5 + (rowSeed - 0.5) * 0.28) / rows;
    var y = 1 - 2 * u;
    var lat = Math.asin(clamp(y, -1, 1));

    // Golden-ratio row offset breaks columns.
    var golden = 0.61803398875;
    var rowOffset = fract(row * golden + rowSeed * 0.21);
    var lon = -Math.PI + TAU * ((col + rowOffset + (colSeed - 0.5) * 0.42) / cols);

    lon = wrapLongitude(lon + zonalDrift(lat, slowTime));

    // Organic turbulence before moisture sampling.
    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;
    var lowFlow = fbm2(nx * 3.1, ny * 2.4, textureTime, 27.4);
    var midFlow = fbm2(nx * 7.7 + 0.4, ny * 5.8 - 0.2, textureTime * 0.72, 63.2);
    var swirl = swirlInfluence(lon, lat, swirlTime);

    lon = wrapLongitude(lon + (lowFlow - 0.5) * 0.18 + swirl.lon * 0.42);
    lat = clamp(lat + (midFlow - 0.5) * 0.075 + swirl.lat * 0.34, -1.42, 1.42);

    return {
      col: col,
      row: row,
      longitude: lon,
      latitude: lat,
      slowTime: slowTime,
      swirlTime: swirlTime,
      textureTime: textureTime,
      noise: lowFlow * 0.62 + midFlow * 0.38,
      swirl: swirl,
      seed: colSeed,
      seedB: colSeedB
    };
  }

  function evaluateOrganicCloud(samplePoint, moistureApi, frame) {
    var moisture = moistureApi.sample(
      samplePoint.longitude,
      samplePoint.latitude,
      samplePoint.slowTime
    );

    var projection = projectLonLat(samplePoint.longitude, samplePoint.latitude, frame);

    if (!projection.frontFacing || projection.visibility < state.options.frontVisibilityFloor) {
      return null;
    }

    var coherence =
      samplePoint.noise * 0.24 +
      samplePoint.swirl.strength * 0.26 +
      moisture.condensation * 0.32 +
      moisture.circulation * 0.18;

    var threshold =
      0.56 +
      smoothstep(0.75, 1.0, projection.limbFactor) * 0.06 -
      samplePoint.swirl.strength * 0.035;

    var probability = moisture.cloudProbability * 0.72 + coherence * 0.28;

    // Blue-noise pruning removes rows/flecks without turning into random frame noise.
    var blueNoise = hash3(samplePoint.col * 2.71, samplePoint.row * 5.13, 91.7);
    var retain = probability + (blueNoise - 0.5) * 0.16;

    if (retain < threshold) return null;

    var density = smoothstep(threshold, 0.95, retain);
    var perspective = clamp(projection.perspective, 0.44, 2.25);
    var limbFade = 1 - smoothstep(0.88, 1.08, projection.limbFactor);

    var baseSize = (5.5 + density * 20.0) * perspective * state.options.cloudSizeScale;
    var shear =
      1.1 +
      moisture.circulation * 1.2 +
      samplePoint.swirl.strength * 1.6 +
      Math.abs(Math.sin(samplePoint.latitude)) * 0.25;

    var width = baseSize * shear * lerp(1.0, state.options.rimCompression, projection.limbFactor);
    var height = baseSize * (0.34 + moisture.cloudSoftness * 0.42) * lerp(1.0, 0.58, projection.limbFactor);

    var opacity =
      (0.18 + density * 0.54 + moisture.condensation * 0.18) *
      state.options.cloudOpacityScale *
      projection.visibility *
      limbFade;

    opacity = clamp(opacity, 0, 0.74);

    if (opacity < 0.025) return null;

    var angle =
      samplePoint.latitude * 1.35 +
      samplePoint.swirl.bend * 1.18 +
      (samplePoint.noise - 0.5) * 0.92 +
      Math.sin(samplePoint.longitude + samplePoint.slowTime * 0.8) * 0.18;

    return {
      sampleIndex: samplePoint.row * state.options.organicColumns + samplePoint.col,
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

      denseCloudEligible: probability > 0.76,
      stormEligible: probability > 0.88,

      width: width,
      height: height,
      angle: angle,
      softness: moisture.cloudSoftness,
      elongation: shear,
      swirl: samplePoint.swirl.bend,
      flowStrength: samplePoint.swirl.strength,
      seed: samplePoint.seed,
      seedB: samplePoint.seedB,

      materialClass: state.options.materialClass,
      source: "organic-moisture-flow-field",
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      randomPatchClouds: false,
      flatProjection: false
    };
  }

  function buildFragments(cloud) {
    var fragments = [];
    var count = Math.max(
      3,
      Math.min(
        12,
        Math.round(
          state.options.microFragmentCount +
          cloud.cloudDensity * 4 +
          cloud.flowStrength * 3
        )
      )
    );

    var i;

    for (i = 0; i < count; i += 1) {
      var seed = hash3(cloud.sampleIndex, i, 13.7);
      var seedB = hash3(cloud.sampleIndex + 4.2, i + 9.1, 33.4);
      var seedC = hash3(cloud.sampleIndex + 11.8, i + 17.6, 70.2);

      var flowAngle = cloud.angle + (seed - 0.5) * (0.46 + cloud.flowStrength * 0.38);
      var offsetRadius = cloud.width * (0.05 + seedB * 0.26);
      var offsetX = Math.cos(flowAngle) * offsetRadius;
      var offsetY = Math.sin(flowAngle) * offsetRadius * 0.48;

      fragments.push({
        x: cloud.x + offsetX,
        y: cloud.y + offsetY,
        width: cloud.width * (0.17 + seed * 0.30),
        height: cloud.height * (0.22 + seedC * 0.34),
        angle: flowAngle,
        opacity: cloud.cloudOpacity * (0.28 + seedB * 0.42),
        softness: cloud.softness,
        shade: seedC,
        flowStrength: cloud.flowStrength
      });
    }

    return fragments;
  }

  function buildLayer(frame) {
    var moistureApi = getMoistureApi();

    state.moistureDetected = Boolean(moistureApi && typeof moistureApi.sample === "function");

    if (!state.moistureDetected) {
      state.cloudsReady = false;
      state.rendererReady = false;

      return {
        contract: CONTRACT,
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
    var limit = Math.max(32, Math.min(260, state.options.maxCloudsPerFrame));

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

      cloudsReady: state.cloudsReady,
      rendererReady: state.rendererReady,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

      cloudSpeedReduced: true,
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
    var opacity = clamp(fragment.opacity * baseOpacity, 0, 0.74);

    if (opacity <= 0.01) return;

    ctx.save();
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.angle);
    ctx.scale(1, 0.70);

    var radius = Math.max(w, h);
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

    gradient.addColorStop(0, "rgba(255,255,255," + (0.76 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.28, "rgba(238,249,255," + (0.54 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.60, "rgba(186,218,238," + (0.24 * opacity).toFixed(4) + ")");
    gradient.addColorStop(1, "rgba(120,160,196,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, TAU);
    ctx.fill();

    if (fragment.flowStrength > 0.20) {
      ctx.globalAlpha = opacity * 0.10;
      ctx.strokeStyle = "rgba(245,252,255,0.75)";
      ctx.lineWidth = Math.max(0.7, radius * 0.035);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.68, h * 0.54, 0, -0.8, 0.8);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCloud(ctx, cloud) {
    if (!ctx || !cloud || !cloud.fragments) return;

    var baseOpacity = clamp(cloud.cloudOpacity, 0, 0.74);
    var i;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (i = 0; i < cloud.fragments.length; i += 1) {
      drawSoftFragment(ctx, cloud.fragments[i], baseOpacity);
    }

    if (cloud.denseCloudEligible) {
      ctx.globalAlpha = clamp(baseOpacity * 0.10, 0, 0.14);
      ctx.fillStyle = "rgba(255,255,255,0.68)";
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width * 0.30,
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
      layerKind: state.layerKind,
      renderMode: state.renderMode,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      organicColumns: state.options.organicColumns,
      organicRows: state.options.organicRows,
      maxCloudsPerFrame: state.options.maxCloudsPerFrame,

      globalCloudTimeScale: state.options.globalCloudTimeScale,
      swirlTimeScale: state.options.swirlTimeScale,
      textureTimeScale: state.options.textureTimeScale,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastCloudCount: state.lastCloudCount,
      lastFragmentCount: state.lastFragmentCount,
      lastMoistureEligibleCount: state.lastMoistureEligibleCount,
      lastAverageCloudOpacity: state.lastAverageCloudOpacity,

      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsNotVisible256Grid: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

      cloudSpeedReduced: true,
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
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function publish() {
    var api = {
      contract: CONTRACT,
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
        previousContract: PREVIOUS_CONTRACT,
        standard: STANDARD,
        family: FAMILY,
        file: FILE,
        moistureDetected: state.moistureDetected,
        cloudSpeedReduced: true,
        organicSwirlFlowActive: true,
        highDensityCloudFieldActive: true,
        cloudsNotVisible256Grid: true,
        bootedAt: new Date().toISOString(),
        meaning: "Organic cloud child evaluated. Planet View may now render slower moisture-driven cloud flow without exposing the 256 lattice."
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
