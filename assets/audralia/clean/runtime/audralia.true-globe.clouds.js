// /assets/audralia/clean/runtime/audralia.true-globe.clouds.js
// TNT FULL-FILE REPLACEMENT
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
// - Establish Audralia's cloud child after moisture field creation.
// - Consume moisture field truth.
// - Build drawable 4K-ready procedural cloud layer data.
// - Provide a renderer function for route JS / renderer consumer.
// - Keep cloud eligibility moisture-driven, not random patch-driven.
// - Do not create canvas.
// - Do not modify HTML.
// - Do not own route JS.
// - Do not render lattice view.
// - No generated image. No GraphicBox. No flat projection. No sticker clouds.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_4K_MOISTURE_CLOUD_CHILD_TNT_v1";
  var PREVIOUS_MOISTURE_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_TRUE_RUNTIME_CLOUD_RENEWAL_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.clouds.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var DEFAULT_OPTIONS = {
    cloudOpacityScale: 1,
    cloudSizeScale: 1,
    cloudSoftnessScale: 1,
    microFragmentCount: 5,
    maxCloudsPerFrame: 160,
    frontVisibilityFloor: 0.18,
    backVisibilityFloor: 0.015,
    rimCompression: 0.72,
    proceduralResolution: "4k-ready",
    materialClass: "cool-white-blue-gray-moisture-cloud",
    drawDebug: false,
    generatedImage: false,
    graphicBox: false,
    randomPatchClouds: false,
    flatProjection: false
  };

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
    layerKind: "runtime-moisture-driven-procedural-clouds",
    renderMode: "canvas-2d-runtime-consumer",

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

  function hash3(a, b, c) {
    return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE || window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE || null;
  }

  function getRuntimeFrameSeats(frame) {
    if (frame && frame.projectedSeats && frame.projectedSeats.length) return frame.projectedSeats;
    if (frame && frame.seats && frame.seats.length) return frame.seats;
    return [];
  }

  function getSeatScreen(seat) {
    if (seat && seat.screen) {
      return {
        x: finite(seat.screen.x, 0),
        y: finite(seat.screen.y, 0),
        z: finite(seat.screen.z, 0),
        perspective: finite(seat.screen.perspective, 1)
      };
    }

    return {
      x: 0,
      y: 0,
      z: 0,
      perspective: 1
    };
  }

  function getFrameMetrics(frame) {
    if (frame && frame.metrics) {
      return {
        width: finite(frame.metrics.width, finite(frame.width, 640)),
        height: finite(frame.metrics.height, finite(frame.height, 720)),
        centerX: finite(frame.metrics.centerX, finite(frame.width, 640) / 2),
        centerY: finite(frame.metrics.centerY, finite(frame.height, 720) * 0.42),
        radius: finite(frame.metrics.radius, Math.min(finite(frame.width, 640), finite(frame.height, 720)) * 0.35)
      };
    }

    return {
      width: finite(frame && frame.width, 640),
      height: finite(frame && frame.height, 720),
      centerX: finite(frame && frame.width, 640) / 2,
      centerY: finite(frame && frame.height, 720) * 0.42,
      radius: Math.min(finite(frame && frame.width, 640), finite(frame && frame.height, 720)) * 0.35
    };
  }

  function estimateLimbFactor(seat, frame) {
    var screen = getSeatScreen(seat);
    var metrics = getFrameMetrics(frame);
    var dx = screen.x - metrics.centerX;
    var dy = screen.y - metrics.centerY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var normalized = metrics.radius ? clamp(dist / metrics.radius, 0, 1.4) : 0;

    return smoothstep(0.58, 1.04, normalized);
  }

  function buildFragmentSeed(sample, fragmentIndex) {
    var seatIndex = sample.seatIndex == null ? 0 : sample.seatIndex;
    var radialIndex = sample.radialIndex == null ? 0 : sample.radialIndex;
    var bandIndex = sample.bandIndex == null ? 0 : sample.bandIndex;

    return hash3(
      seatIndex + fragmentIndex * 3.17,
      radialIndex + sample.moisture * 19.7,
      bandIndex + sample.circulation * 23.9
    );
  }

  function buildCloudFromMoistureSample(sample, frame) {
    if (!sample || !sample.cloudEligible) return null;

    var screen = getSeatScreen(sample);
    var visibility = typeof sample.visibility === "number" ? sample.visibility : 1;
    var frontFacing = typeof sample.frontFacing === "boolean" ? sample.frontFacing : true;

    if (!frontFacing && visibility < state.options.frontVisibilityFloor) return null;

    var limbFactor = estimateLimbFactor(sample, frame);
    var perspective = clamp(screen.perspective, 0.42, 2.25);
    var cloudDensity = clamp(sample.cloudDensity, 0, 1);
    var opacityBase = clamp(sample.cloudOpacity, 0, 0.92);
    var densityScale = smoothstep(0.50, 1.0, cloudDensity);
    var cloudScale = clamp(sample.cloudScale, 0.42, 2.4) * state.options.cloudSizeScale;
    var softness = clamp(sample.cloudSoftness * state.options.cloudSoftnessScale, 0.18, 1.25);
    var elongation = clamp(sample.cloudElongation, 1.0, 3.4);
    var swirl = clamp(sample.cloudSwirl, -1, 1);

    var baseSize = (7.0 + densityScale * 17.0) * perspective * cloudScale;
    var width = baseSize * elongation * lerp(1.0, state.options.rimCompression, limbFactor);
    var height = baseSize * (0.52 + softness * 0.42) * lerp(1.0, 0.52, limbFactor);

    var opacity = opacityBase * state.options.cloudOpacityScale * visibility;
    opacity *= frontFacing ? 1 : state.options.backVisibilityFloor;
    opacity *= lerp(1.0, 0.74, limbFactor);
    opacity = clamp(opacity, 0, 0.86);

    if (opacity < 0.025) return null;

    var angle =
      (sample.longitude || 0) * 0.28 +
      (sample.latitude || 0) * 1.15 +
      swirl * 0.74 +
      limbFactor * 0.48;

    var fragmentCount = Math.max(
      2,
      Math.min(
        9,
        Math.round(
          state.options.microFragmentCount +
          densityScale * 4 +
          (sample.denseCloudEligible ? 2 : 0)
        )
      )
    );

    var fragments = [];
    var i;

    for (i = 0; i < fragmentCount; i += 1) {
      var seed = buildFragmentSeed(sample, i);
      var seedB = buildFragmentSeed(sample, i + 11);
      var seedC = buildFragmentSeed(sample, i + 29);

      var offsetRadius = baseSize * (0.12 + seed * 0.48);
      var offsetAngle = TAU * seedB + angle * 0.35;
      var fragmentWidth = width * (0.22 + seedC * 0.34);
      var fragmentHeight = height * (0.30 + seed * 0.36);

      fragments.push({
        x: screen.x + Math.cos(offsetAngle) * offsetRadius,
        y: screen.y + Math.sin(offsetAngle) * offsetRadius * 0.62,
        width: fragmentWidth,
        height: fragmentHeight,
        angle: angle + (seed - 0.5) * 0.72,
        opacity: opacity * (0.34 + seedB * 0.36),
        softness: softness,
        shade: seedC
      });
    }

    return {
      seatIndex: sample.seatIndex,
      radialIndex: sample.radialIndex,
      bandIndex: sample.bandIndex,
      longitude: sample.longitude,
      latitude: sample.latitude,

      x: screen.x,
      y: screen.y,
      z: screen.z,
      perspective: perspective,

      frontFacing: frontFacing,
      visibility: visibility,
      limbFactor: limbFactor,

      moisture: sample.moisture,
      humidity: sample.humidity,
      condensation: sample.condensation,
      cloudProbability: sample.cloudProbability,
      cloudDensity: cloudDensity,
      cloudOpacity: opacity,
      denseCloudEligible: sample.denseCloudEligible,
      stormEligible: sample.stormEligible,

      width: width,
      height: height,
      angle: angle,
      softness: softness,
      elongation: elongation,
      swirl: swirl,
      fragments: fragments,

      materialClass: state.options.materialClass,
      source: "moisture-field",
      cloudsDerivedFromMoisture: true,
      randomPatchClouds: false,
      flatProjection: false
    };
  }

  function buildLayer(frame) {
    var moistureApi = getMoistureApi();

    state.moistureDetected = Boolean(moistureApi && typeof moistureApi.getField === "function");

    if (!state.moistureDetected) {
      state.cloudsReady = false;
      state.rendererReady = false;

      return {
        contract: CONTRACT,
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
        flatProjection: false
      };
    }

    var moistureField = moistureApi.getField(frame || {});
    var eligible = moistureField.eligibleClouds || [];
    var clouds = [];
    var fragmentCount = 0;
    var opacitySum = 0;
    var limit = Math.max(24, Math.min(state.options.maxCloudsPerFrame, eligible.length));
    var i;

    for (i = 0; i < eligible.length && clouds.length < limit; i += 1) {
      var sample = eligible[i];

      if (sample.frontFacing === false && sample.visibility < 0.18) continue;

      var cloud = buildCloudFromMoistureSample(sample, frame || {});

      if (!cloud) continue;

      clouds.push(cloud);
      fragmentCount += cloud.fragments.length;
      opacitySum += cloud.cloudOpacity;
    }

    clouds.sort(function (a, b) {
      return a.z - b.z;
    });

    state.lastFrameIndex = frame && typeof frame.frameIndex === "number" ? frame.frameIndex : state.lastFrameIndex;
    state.lastRenderTime = frame && typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime;
    state.lastCloudCount = clouds.length;
    state.lastFragmentCount = fragmentCount;
    state.lastMoistureEligibleCount = eligible.length;
    state.lastAverageCloudOpacity = clouds.length ? opacitySum / clouds.length : 0;

    state.cloudsReady = true;
    state.rendererReady = true;
    state.diagnosticReady = true;

    var layer = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      moistureContract:
        moistureApi && moistureApi.status && moistureApi.status().contract
          ? moistureApi.status().contract
          : PREVIOUS_MOISTURE_CONTRACT,

      layerVersion: state.layerVersion,
      layerKind: state.layerKind,
      renderMode: state.renderMode,

      frameIndex: state.lastFrameIndex,
      renderTime: state.lastRenderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      moistureDetected: state.moistureDetected,
      moistureFieldReady: Boolean(moistureField.moistureFieldReady),
      cloudEligibilityReady: Boolean(moistureField.cloudEligibilityReady),

      clouds: clouds,
      cloudCount: clouds.length,
      fragmentCount: fragmentCount,
      moistureEligibleCount: eligible.length,
      denseCloudCount: moistureField.denseCloudCount || 0,
      stormCount: moistureField.stormCount || 0,
      averageMoisture: moistureField.averageMoisture || 0,
      averageCondensation: moistureField.averageCondensation || 0,
      averageCloudOpacity: state.lastAverageCloudOpacity,

      cloudsReady: state.cloudsReady,
      rendererReady: state.rendererReady,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      diagnosticReportsCloudState: true,

      generatedImage: false,
      graphicBox: false,
      randomPatchClouds: false,
      flatProjection: false
    };

    window.AUDRALIA_TRUE_GLOBE_CLOUD_LAYER = layer;
    window.AUDRALIA_TRUE_GLOBE_CLOUD_STATUS = status();

    return layer;
  }

  function drawSoftFragment(ctx, fragment, baseOpacity) {
    var w = Math.max(1, fragment.width);
    var h = Math.max(1, fragment.height);
    var opacity = clamp(fragment.opacity * baseOpacity, 0, 0.78);

    if (opacity <= 0.01) return;

    ctx.save();
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.angle);
    ctx.scale(1, 0.72);

    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h));
    var shade = clamp(fragment.shade, 0, 1);

    gradient.addColorStop(0, "rgba(255,255,255," + (0.82 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.34, "rgba(232,246,255," + (0.58 * opacity).toFixed(4) + ")");
    gradient.addColorStop(0.68, "rgba(178,211,232," + (0.24 * opacity).toFixed(4) + ")");
    gradient.addColorStop(1, "rgba(130,170,202,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, TAU);
    ctx.fill();

    if (shade > 0.62) {
      ctx.globalAlpha = opacity * 0.20;
      ctx.fillStyle = "rgba(168,198,220,0.55)";
      ctx.beginPath();
      ctx.ellipse(w * 0.12, h * 0.16, w * 0.55, h * 0.28, 0, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawCloud(ctx, cloud) {
    if (!ctx || !cloud || !cloud.fragments) return;

    var baseOpacity = clamp(cloud.cloudOpacity, 0, 0.86);
    var i;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (i = 0; i < cloud.fragments.length; i += 1) {
      drawSoftFragment(ctx, cloud.fragments[i], baseOpacity);
    }

    if (cloud.denseCloudEligible) {
      ctx.globalAlpha = clamp(baseOpacity * 0.14, 0, 0.18);
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width * 0.42,
        cloud.height * 0.26,
        cloud.angle,
        0,
        TAU
      );
      ctx.fill();
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
      var i;

      ctx.save();

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
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      previousMoistureContract: PREVIOUS_MOISTURE_CONTRACT,

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

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastCloudCount: state.lastCloudCount,
      lastFragmentCount: state.lastFragmentCount,
      lastMoistureEligibleCount: state.lastMoistureEligibleCount,
      lastAverageCloudOpacity: state.lastAverageCloudOpacity,

      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,
      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,
      diagnosticReportsCloudState: true,

      generatedImage: false,
      graphicBox: false,
      randomPatchClouds: false,
      flatProjection: false,
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
        standard: STANDARD,
        family: FAMILY,
        file: FILE,
        moistureDetected: state.moistureDetected,
        bootedAt: new Date().toISOString(),
        meaning: "Cloud child evaluated. Route JS/runtime may now consume window.AUDRALIA_TRUE_GLOBE_CLOUDS."
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
