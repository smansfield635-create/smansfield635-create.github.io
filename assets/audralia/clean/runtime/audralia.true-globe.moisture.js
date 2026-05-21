// /assets/audralia/clean/runtime/audralia.true-globe.moisture.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1
//
// Family:
// /assets/audralia/clean/runtime/
//
// Purpose:
// - Establish Audralia's moisture-field child before cloud rendering.
// - Own moisture eligibility logic for future 4K procedural clouds.
// - Produce moisture, humidity, condensation, pressure, circulation, and cloud-eligibility values.
// - Stay runtime-family correct.
// - Do not draw.
// - Do not create canvas.
// - Do not replace the true-globe runtime.
// - Do not touch HTML.
// - Do not touch route JS.
// - No generated image. No GraphicBox. No random patch clouds. No flat projection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_TRUE_RUNTIME_CLOUD_RENEWAL_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var DEFAULT_OPTIONS = {
    moistureScale: 1,
    cloudThreshold: 0.58,
    denseCloudThreshold: 0.74,
    stormThreshold: 0.86,
    oceanBias: 0.22,
    circulationBias: 0.18,
    equatorialMoisture: 0.20,
    subtropicalDryness: 0.18,
    polarDryness: 0.14,
    mountainLiftProxy: 0.08,
    temporalDrift: 0.018,
    fieldResolution: "procedural-4k-ready",
    generatedImage: false,
    graphicBox: false,
    randomPatchClouds: false,
    flatProjection: false
  };

  var state = {
    initialized: false,
    moistureReady: false,
    diagnosticReady: false,

    options: clone(DEFAULT_OPTIONS),

    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastSampleCount: 0,
    lastEligibleCloudCount: 0,
    lastDenseCloudCount: 0,
    lastStormCount: 0,
    lastAverageMoisture: 0,
    lastAverageCondensation: 0,

    fieldVersion: CONTRACT,
    fieldKind: "runtime-spherical-moisture",
    sampleMode: "spherical-seat-and-latlon-sampling",

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

  function now() {
    if (typeof performance !== "undefined" && performance.now) {
      return performance.now();
    }

    return Date.now();
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

  function normalizeLongitude(longitude) {
    var lon = finite(longitude, 0);

    while (lon < -Math.PI) lon += TAU;
    while (lon > Math.PI) lon -= TAU;

    return lon;
  }

  function normalizeLatitude(latitude) {
    return clamp(finite(latitude, 0), -Math.PI / 2, Math.PI / 2);
  }

  function hash2(x, y, salt) {
    var n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453123;
    return fract(n);
  }

  function valueNoise2(x, y, salt) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var xf = x - x0;
    var yf = y - y0;

    var a = hash2(x0, y0, salt);
    var b = hash2(x0 + 1, y0, salt);
    var c = hash2(x0, y0 + 1, salt);
    var d = hash2(x0 + 1, y0 + 1, salt);

    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm(longitude, latitude, time, salt) {
    var lon = normalizeLongitude(longitude);
    var lat = normalizeLatitude(latitude);

    var x = (lon + Math.PI) / TAU;
    var y = (lat + Math.PI / 2) / Math.PI;

    var drift = time * state.options.temporalDrift;
    var amplitude = 0.5;
    var frequency = 1;
    var total = 0;
    var norm = 0;
    var octave;

    for (octave = 0; octave < 5; octave += 1) {
      total += valueNoise2(
        x * frequency * 6.0 + drift * (0.72 + octave * 0.11),
        y * frequency * 6.0 - drift * (0.36 + octave * 0.07),
        salt + octave * 19.17
      ) * amplitude;

      norm += amplitude;
      amplitude *= 0.52;
      frequency *= 2.03;
    }

    return norm ? total / norm : 0;
  }

  function bandWave(longitude, latitude, time) {
    var lon = normalizeLongitude(longitude);
    var lat = normalizeLatitude(latitude);

    var equatorFlow = Math.sin(lon * 2.0 + time * 0.12) * 0.5 + 0.5;
    var midFlow = Math.sin(lon * 3.0 - lat * 5.0 + time * 0.09) * 0.5 + 0.5;
    var highFlow = Math.sin(lon * 5.0 + lat * 7.0 - time * 0.05) * 0.5 + 0.5;

    return equatorFlow * 0.38 + midFlow * 0.42 + highFlow * 0.20;
  }

  function oceanProxy(longitude, latitude, time) {
    var continentalNoise = fbm(longitude * 0.78, latitude * 0.92, time * 0.35, 4.3);
    var basinNoise = fbm(longitude * 1.22 + 0.91, latitude * 0.76 - 0.37, time * 0.22, 9.1);
    var polarPenalty = smoothstep(0.84, 1.0, Math.abs(Math.sin(latitude))) * 0.18;

    var ocean = clamp(0.58 + (basinNoise - continentalNoise) * 0.34 - polarPenalty, 0, 1);

    return ocean;
  }

  function elevationProxy(longitude, latitude, time) {
    var ridgeA = fbm(longitude * 1.65 + 0.18, latitude * 1.8 - 0.24, time * 0.18, 17.3);
    var ridgeB = fbm(longitude * 3.4 - 0.49, latitude * 2.9 + 0.62, time * 0.12, 31.9);

    var ridged = 1 - Math.abs((ridgeA * 0.58 + ridgeB * 0.42) * 2 - 1);

    return clamp(ridged, 0, 1);
  }

  function latitudeMoisture(latitude) {
    var absLatNorm = Math.abs(latitude) / (Math.PI / 2);

    var equatorial = (1 - smoothstep(0.06, 0.38, absLatNorm)) * state.options.equatorialMoisture;
    var temperate = smoothstep(0.24, 0.52, absLatNorm) * (1 - smoothstep(0.66, 0.88, absLatNorm)) * 0.14;
    var subtropicalDry = smoothstep(0.22, 0.40, absLatNorm) * (1 - smoothstep(0.45, 0.62, absLatNorm)) * state.options.subtropicalDryness;
    var polarDry = smoothstep(0.72, 1.0, absLatNorm) * state.options.polarDryness;

    return clamp(0.44 + equatorial + temperate - subtropicalDry - polarDry, 0, 1);
  }

  function pressureProxy(longitude, latitude, time) {
    var hadley = Math.cos(latitude * 3.0);
    var rossby = Math.sin(longitude * 4.0 - time * 0.07 + latitude * 2.0);
    var noise = fbm(longitude * 1.4, latitude * 1.1, time * 0.30, 22.6);

    return clamp(0.50 + hadley * 0.12 + rossby * 0.08 + (noise - 0.5) * 0.20, 0, 1);
  }

  function circulationProxy(longitude, latitude, time) {
    var band = bandWave(longitude, latitude, time);
    var jet = Math.sin(latitude * 4.0 + Math.sin(longitude * 2.0 + time * 0.06)) * 0.5 + 0.5;
    var swirl = fbm(longitude * 1.15 + time * 0.05, latitude * 1.65 - time * 0.02, time, 14.9);

    return clamp(band * 0.44 + jet * 0.24 + swirl * 0.32, 0, 1);
  }

  function condensationProxy(moisture, pressure, elevation, latitude) {
    var lift = elevation * state.options.mountainLiftProxy;
    var pressureLift = smoothstep(0.52, 0.82, pressure) * 0.14;
    var coldCondensation = smoothstep(0.54, 0.96, Math.abs(latitude) / (Math.PI / 2)) * 0.10;

    return clamp((moisture - 0.44) * 1.28 + lift + pressureLift + coldCondensation, 0, 1);
  }

  function classifyMoisture(sample) {
    if (sample.cloudProbability >= state.options.stormThreshold) return "storm-cell-eligible";
    if (sample.cloudProbability >= state.options.denseCloudThreshold) return "dense-cloud-eligible";
    if (sample.cloudProbability >= state.options.cloudThreshold) return "cloud-eligible";
    if (sample.moisture >= 0.48) return "humid-clear";
    return "dry-clear";
  }

  function getSeatLongitude(seat) {
    if (typeof seat.longitude === "number") return normalizeLongitude(seat.longitude);

    if (seat.spherePosition) {
      return normalizeLongitude(Math.atan2(seat.spherePosition.z || 0, seat.spherePosition.x || 0));
    }

    if (seat.radialIndex != null) {
      return normalizeLongitude(TAU * (seat.radialIndex / RADIAL_NODES));
    }

    return 0;
  }

  function getSeatLatitude(seat) {
    if (typeof seat.latitude === "number") return normalizeLatitude(seat.latitude);

    if (seat.spherePosition) {
      return normalizeLatitude(Math.asin(clamp(seat.spherePosition.y || 0, -1, 1)));
    }

    if (seat.bandIndex != null) {
      var u = (seat.bandIndex + 0.5) / FIBONACCI_BANDS;
      return normalizeLatitude(Math.asin(1 - 2 * u));
    }

    return 0;
  }

  function evaluateMoisture(longitude, latitude, time, context) {
    var lon = normalizeLongitude(longitude);
    var lat = normalizeLatitude(latitude);
    var t = finite(time, 0);

    var latBase = latitudeMoisture(lat);
    var ocean = oceanProxy(lon, lat, t);
    var elevation = elevationProxy(lon, lat, t);
    var pressure = pressureProxy(lon, lat, t);
    var circulation = circulationProxy(lon, lat, t);
    var fine = fbm(lon * 2.4 + 0.31, lat * 2.1 - 0.19, t * 0.52, 41.7);
    var micro = fbm(lon * 6.0 - 0.82, lat * 5.4 + 0.27, t * 0.74, 58.4);

    var oceanContribution = ocean * state.options.oceanBias;
    var circulationContribution = (circulation - 0.38) * state.options.circulationBias;
    var fineContribution = (fine - 0.5) * 0.22;
    var microContribution = (micro - 0.5) * 0.10;

    var moisture = clamp(
      (latBase + oceanContribution + circulationContribution + fineContribution + microContribution) *
        state.options.moistureScale,
      0,
      1
    );

    var condensation = condensationProxy(moisture, pressure, elevation, lat);
    var cloudProbability = clamp(
      moisture * 0.62 +
        condensation * 0.34 +
        ocean * 0.08 +
        circulation * 0.08 -
        smoothstep(0.18, 0.34, Math.abs(lat) / (Math.PI / 2)) * 0.035,
      0,
      1
    );

    var density = smoothstep(state.options.cloudThreshold, 0.94, cloudProbability);
    var opacity = clamp(density * 0.78 + condensation * 0.18, 0, 0.92);
    var softness = clamp(0.48 + fine * 0.32 + moisture * 0.20, 0.32, 1);
    var scale = clamp(0.58 + density * 1.12 + micro * 0.32, 0.42, 2.25);
    var elongation = clamp(1.0 + circulation * 1.35 + Math.abs(Math.sin(lat)) * 0.34, 1, 2.8);
    var swirl = clamp((circulation - 0.5) * 2 + (fine - 0.5) * 0.8, -1, 1);

    var sample = {
      longitude: lon,
      latitude: lat,
      renderTime: t,

      moisture: moisture,
      humidity: moisture,
      pressure: pressure,
      circulation: circulation,
      oceanInfluence: ocean,
      elevationProxy: elevation,
      condensation: condensation,

      cloudProbability: cloudProbability,
      cloudEligible: cloudProbability >= state.options.cloudThreshold,
      denseCloudEligible: cloudProbability >= state.options.denseCloudThreshold,
      stormEligible: cloudProbability >= state.options.stormThreshold,

      cloudDensity: density,
      cloudOpacity: opacity,
      cloudSoftness: softness,
      cloudScale: scale,
      cloudElongation: elongation,
      cloudSwirl: swirl,

      className: "",
      source: "moisture-field",
      context: context || "sample",
      cloudsDerivedFromMoisture: true,
      randomPatchClouds: false,
      flatProjection: false
    };

    sample.className = classifyMoisture(sample);

    return sample;
  }

  function evaluateSeat(seat, frame) {
    var time = frame && typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime;
    var lon = getSeatLongitude(seat || {});
    var lat = getSeatLatitude(seat || {});
    var sample = evaluateMoisture(lon, lat, time, "seat");

    sample.seatIndex = seat && seat.seatIndex != null ? seat.seatIndex : -1;
    sample.radialIndex = seat && seat.radialIndex != null ? seat.radialIndex : -1;
    sample.bandIndex = seat && seat.bandIndex != null ? seat.bandIndex : -1;
    sample.fibonacci = seat && seat.fibonacci != null ? seat.fibonacci : null;
    sample.fibonacciWeight = seat && seat.fibonacciWeight != null ? seat.fibonacciWeight : null;

    if (seat && seat.screen) {
      sample.screen = {
        x: seat.screen.x,
        y: seat.screen.y,
        z: seat.screen.z,
        perspective: seat.screen.perspective
      };
    }

    sample.frontFacing = seat && typeof seat.frontFacing === "boolean" ? seat.frontFacing : true;
    sample.visibility = seat && typeof seat.visibility === "number" ? seat.visibility : 1;

    return sample;
  }

  function buildField(frame) {
    var sourceSeats =
      frame && frame.projectedSeats && frame.projectedSeats.length
        ? frame.projectedSeats
        : frame && frame.seats && frame.seats.length
          ? frame.seats
          : [];

    var renderTime = frame && typeof frame.renderTime === "number" ? frame.renderTime : state.lastRenderTime || 0;
    var samples = [];
    var eligibleClouds = [];
    var denseClouds = [];
    var stormCells = [];

    var moistureSum = 0;
    var condensationSum = 0;

    var i;

    for (i = 0; i < sourceSeats.length; i += 1) {
      var sample = evaluateSeat(sourceSeats[i], frame || { renderTime: renderTime });

      samples.push(sample);
      moistureSum += sample.moisture;
      condensationSum += sample.condensation;

      if (sample.cloudEligible) eligibleClouds.push(sample);
      if (sample.denseCloudEligible) denseClouds.push(sample);
      if (sample.stormEligible) stormCells.push(sample);
    }

    var count = samples.length || 1;

    state.lastFrameIndex = frame && typeof frame.frameIndex === "number" ? frame.frameIndex : state.lastFrameIndex;
    state.lastRenderTime = renderTime;
    state.lastSampleCount = samples.length;
    state.lastEligibleCloudCount = eligibleClouds.length;
    state.lastDenseCloudCount = denseClouds.length;
    state.lastStormCount = stormCells.length;
    state.lastAverageMoisture = moistureSum / count;
    state.lastAverageCondensation = condensationSum / count;

    state.moistureReady = samples.length > 0;
    state.diagnosticReady = true;

    var field = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      fieldVersion: state.fieldVersion,
      fieldKind: state.fieldKind,
      sampleMode: state.sampleMode,

      renderTime: renderTime,
      frameIndex: state.lastFrameIndex,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      expectedSeats: LATTICE_STATES,

      samples: samples,
      eligibleClouds: eligibleClouds,
      denseClouds: denseClouds,
      stormCells: stormCells,

      sampleCount: samples.length,
      eligibleCloudCount: eligibleClouds.length,
      denseCloudCount: denseClouds.length,
      stormCount: stormCells.length,

      averageMoisture: state.lastAverageMoisture,
      averageCondensation: state.lastAverageCondensation,

      moistureFieldReady: state.moistureReady,
      cloudEligibilityReady: state.moistureReady,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsOnSphericalCarrier: true,
      flatProjectionBlocked: true,
      generatedImage: false,
      graphicBox: false
    };

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_FIELD = field;
    window.AUDRALIA_TRUE_GLOBE_MOISTURE_STATUS = status();

    return field;
  }

  function sample(longitude, latitude, renderTime) {
    var t = typeof renderTime === "number" ? renderTime : state.lastRenderTime || 0;
    state.moistureReady = true;
    state.diagnosticReady = true;
    return evaluateMoisture(longitude, latitude, t, "latlon");
  }

  function getField(frame) {
    return buildField(frame || {});
  }

  function getCloudEligibility(frame) {
    return buildField(frame || {}).eligibleClouds;
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

      initialized: state.initialized,
      moistureReady: state.moistureReady,
      diagnosticReady: state.diagnosticReady,

      fieldVersion: state.fieldVersion,
      fieldKind: state.fieldKind,
      sampleMode: state.sampleMode,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      cloudThreshold: state.options.cloudThreshold,
      denseCloudThreshold: state.options.denseCloudThreshold,
      stormThreshold: state.options.stormThreshold,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastSampleCount: state.lastSampleCount,
      lastEligibleCloudCount: state.lastEligibleCloudCount,
      lastDenseCloudCount: state.lastDenseCloudCount,
      lastStormCount: state.lastStormCount,
      lastAverageMoisture: state.lastAverageMoisture,
      lastAverageCondensation: state.lastAverageCondensation,

      moistureFieldReady: state.moistureReady,
      cloudEligibilityReady: state.moistureReady,
      cloudsDerivedFromMoisture: true,
      cloudsNotRandomPatches: true,
      cloudsOnSphericalCarrier: true,
      procedural4KReady: true,

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

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_ERROR = {
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
      sample: sample,
      evaluateSeat: evaluateSeat,
      getField: getField,
      getCloudEligibility: getCloudEligibility,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_MOISTURE = api;
    window.AUDRALIA_TRUE_GLOBE_MOISTURE_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE = api;
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE_STATUS = status();

    return api;
  }

  function init(options) {
    try {
      configure(options || {});

      state.initialized = true;
      state.moistureReady = true;
      state.diagnosticReady = true;

      publish();

      window.AUDRALIA_TRUE_GLOBE_MOISTURE_BOOT = {
        contract: CONTRACT,
        standard: STANDARD,
        family: FAMILY,
        file: FILE,
        bootedAt: new Date().toISOString(),
        meaning: "Moisture child evaluated. Runtime/cloud child may now consume window.AUDRALIA_TRUE_GLOBE_MOISTURE."
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
