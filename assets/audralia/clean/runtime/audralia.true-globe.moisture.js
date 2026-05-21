// /assets/audralia/clean/runtime/audralia.true-globe.moisture.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2
//
// Public moisture contract intentionally preserved for manifest/runtime compatibility:
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1
//
// Purpose:
// - Preserve moisture child public contract.
// - Consume terrain/ecosystem forcing when available.
// - Convert terrain, hydrology, elevation, ecosystem return, mountain lift,
//   ocean/land contrast, desert dryness, and polar influence into moisture eligibility.
// - Do not draw.
// - Do not create canvas.
// - Do not own route JS.
// - Do not own HTML.
// - Do not paint clouds directly.
// - Preserve Lattice View protection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var TERRAIN_FORCING_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2";
  var STANDARD = "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var state = {
    initialized: false,
    moistureFieldReady: false,
    terrainForcingDetected: false,
    terrainForcingConsumed: false,
    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastField: null,
    lastSummary: null,
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
        x * freq + time * (0.018 + i * 0.005),
        y * freq - time * (0.014 + i * 0.004),
        salt + i * 23.71
      ) * amp;

      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? total / norm : 0;
  }

  function getTerrainApi() {
    return window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      null;
  }

  function fallbackTerrain(longitude, latitude, time) {
    var lon = wrapLongitude(longitude);
    var lat = clamp(latitude, -Math.PI / 2, Math.PI / 2);
    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;

    var polarAbs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.10, 0.54, Math.abs(lat));
    var temperate = smoothstep(0.20, 0.48, polarAbs) * (1 - smoothstep(0.62, 0.86, polarAbs));

    var oceanNoise = fbm2(nx * 2.8, ny * 2.1, time * 0.001, 12.4);
    var landRatio = clamp(oceanNoise * 0.72 + equator * 0.10 - polarAbs * 0.06, 0, 1);
    var oceanRatio = 1 - landRatio;

    var coastalInfluence = clamp(1 - Math.abs(landRatio - 0.5) * 2, 0, 1);
    var mountainLift = clamp(fbm2(nx * 6.2, ny * 4.8, 0, 62.1) * landRatio * 0.62, 0, 1);
    var wetlandInfluence = clamp(coastalInfluence * 0.24 + landRatio * equator * 0.18, 0, 1);
    var forestMoistureReturn = clamp(landRatio * (1 - polarAbs) * (1 - mountainLift * 0.24) * 0.36, 0, 1);
    var desertDryness = clamp(landRatio * equator * (1 - wetlandInfluence) * 0.52, 0, 1);
    var polarInfluence = smoothstep(0.68, 0.96, polarAbs);

    return {
      elevation: landRatio * 0.22 + mountainLift * 0.54 - oceanRatio * 0.52,
      landRatio: landRatio,
      oceanRatio: oceanRatio,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: 0,
      basinRetention: 0,
      riverInfluence: 0,
      lakeInfluence: 0,
      wetlandInfluence: wetlandInfluence,
      forestMoistureReturn: forestMoistureReturn,
      desertDryness: desertDryness,
      polarInfluence: polarInfluence,
      soilMoisture: clamp(wetlandInfluence + forestMoistureReturn - desertDryness * 0.3, 0, 1),
      evaporationPotential: clamp(oceanRatio * 0.58 + coastalInfluence * 0.22 + wetlandInfluence * 0.28, 0, 1),
      surfaceHeat: clamp(equator * 0.76 - polarInfluence * 0.62 + landRatio * 0.12, 0, 1),
      thermalGradient: clamp(temperate * 0.52 + coastalInfluence * 0.18 + mountainLift * 0.16, 0, 1),
      pressureLift: clamp(mountainLift * 0.44 + coastalInfluence * 0.18 + temperate * 0.18, 0, 1),
      convectionPotential: clamp(oceanRatio * 0.30 + wetlandInfluence * 0.28 + equator * 0.26 - desertDryness * 0.22, 0, 1),
      orographicCloudBias: clamp(mountainLift * 0.72, 0, 1),
      stormTrackBias: clamp(temperate * 0.56 + coastalInfluence * 0.18, 0, 1),
      ecosystemMoistureReturn: clamp(forestMoistureReturn + wetlandInfluence * 0.34, 0, 1),
      forcingStrength: clamp(oceanRatio * 0.22 + coastalInfluence * 0.18 + mountainLift * 0.20 + wetlandInfluence * 0.18, 0, 1),
      terrainClass: landRatio < 0.42 ? "open_ocean" : mountainLift > 0.62 ? "mountain" : coastalInfluence > 0.58 ? "coast" : "lowland",
      ecosystemClass: landRatio < 0.42 ? "open_ocean" : desertDryness > 0.62 ? "desert" : forestMoistureReturn > 0.42 ? "forest" : "grassland",
      hydrologyClass: landRatio < 0.42 ? "ocean_source" : coastalInfluence > 0.58 ? "coastal_evaporation" : "surface_runoff",
      forcingFieldReady: false
    };
  }

  function sampleTerrain(longitude, latitude, time) {
    var api = getTerrainApi();

    state.terrainForcingDetected = Boolean(api && typeof api.sample === "function");

    if (!state.terrainForcingDetected) {
      state.terrainForcingConsumed = false;
      return fallbackTerrain(longitude, latitude, time);
    }

    try {
      var sampled = api.sample(longitude, latitude, time);
      state.terrainForcingConsumed = Boolean(sampled && sampled.forcingFieldReady);
      return sampled || fallbackTerrain(longitude, latitude, time);
    } catch (error) {
      recordError("sampleTerrain", error);
      state.terrainForcingConsumed = false;
      return fallbackTerrain(longitude, latitude, time);
    }
  }

  function sample(longitude, latitude, time) {
    var lon = wrapLongitude(longitude);
    var lat = clamp(finite(latitude, 0), -Math.PI / 2, Math.PI / 2);
    var t = finite(time, 0);

    var terrain = sampleTerrain(lon, lat, t);

    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;

    var slowNoise = fbm2(nx * 2.2, ny * 1.8, t * 0.018, 7.1);
    var detailNoise = fbm2(nx * 7.4 + 0.2, ny * 5.1 - 0.3, t * 0.012, 48.6);
    var circulationNoise = fbm2(nx * 3.7 - 0.4, ny * 3.0 + 0.7, t * 0.010, 93.2);

    var polarAbs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.10, 0.54, Math.abs(lat));
    var temperate = smoothstep(0.20, 0.48, polarAbs) * (1 - smoothstep(0.62, 0.86, polarAbs));

    var oceanMoisture = clamp(terrain.oceanRatio * 0.54, 0, 1);
    var coastMoisture = clamp(terrain.coastalInfluence * 0.28, 0, 1);
    var hydrologyMoisture = clamp(
      terrain.riverInfluence * 0.20 +
      terrain.lakeInfluence * 0.22 +
      terrain.wetlandInfluence * 0.34 +
      terrain.soilMoisture * 0.22,
      0,
      1
    );

    var ecosystemReturn = clamp(
      terrain.ecosystemMoistureReturn * 0.36 +
      terrain.forestMoistureReturn * 0.26,
      0,
      1
    );

    var drySuppression = clamp(
      terrain.desertDryness * 0.46 +
      terrain.polarInfluence * 0.24 +
      Math.max(0, terrain.surfaceHeat - 0.82) * 0.20,
      0,
      1
    );

    var lift = clamp(
      terrain.mountainLift * 0.26 +
      terrain.orographicCloudBias * 0.34 +
      terrain.pressureLift * 0.24 +
      terrain.convectionPotential * 0.28,
      0,
      1
    );

    var stormBias = clamp(
      terrain.stormTrackBias * 0.38 +
      terrain.thermalGradient * 0.22 +
      temperate * 0.22 +
      circulationNoise * 0.18,
      0,
      1
    );

    var moisture = clamp(
      oceanMoisture +
      coastMoisture +
      hydrologyMoisture +
      ecosystemReturn +
      lift * 0.20 +
      slowNoise * 0.13 -
      drySuppression * 0.38,
      0,
      1
    );

    var humidity = clamp(
      moisture * 0.72 +
      terrain.evaporationPotential * 0.30 +
      terrain.soilMoisture * 0.20 +
      equator * 0.10 -
      terrain.desertDryness * 0.24 -
      terrain.polarInfluence * 0.18,
      0,
      1
    );

    var pressure = clamp(
      terrain.pressureLift * 0.42 +
      terrain.thermalGradient * 0.24 +
      lift * 0.22 +
      stormBias * 0.18 +
      (detailNoise - 0.5) * 0.16,
      0,
      1
    );

    var circulation = clamp(
      stormBias * 0.44 +
      terrain.stormTrackBias * 0.26 +
      terrain.coastalInfluence * 0.12 +
      circulationNoise * 0.22,
      0,
      1
    );

    var condensation = clamp(
      humidity * 0.42 +
      pressure * 0.30 +
      lift * 0.26 +
      terrain.orographicCloudBias * 0.18 +
      terrain.convectionPotential * 0.22 -
      terrain.desertDryness * 0.30 -
      terrain.polarInfluence * 0.12,
      0,
      1
    );

    var cloudProbability = clamp(
      moisture * 0.30 +
      humidity * 0.26 +
      condensation * 0.28 +
      circulation * 0.14 +
      terrain.forcingStrength * 0.16 +
      slowNoise * 0.08 -
      terrain.desertDryness * 0.18,
      0,
      1
    );

    var cloudSoftness = clamp(
      0.42 +
      humidity * 0.22 +
      terrain.oceanRatio * 0.12 +
      terrain.wetlandInfluence * 0.16 +
      terrain.forestMoistureReturn * 0.12 -
      terrain.desertDryness * 0.18,
      0.22,
      1
    );

    return {
      longitude: lon,
      latitude: lat,
      time: t,

      moisture: moisture,
      humidity: humidity,
      condensation: condensation,
      pressure: pressure,
      circulation: circulation,
      cloudProbability: cloudProbability,
      cloudSoftness: cloudSoftness,

      terrainForcingDetected: state.terrainForcingDetected,
      terrainForcingConsumed: state.terrainForcingConsumed,
      terrainForcingStrength: clamp(terrain.forcingStrength || 0, 0, 1),

      terrainClass: terrain.terrainClass,
      ecosystemClass: terrain.ecosystemClass,
      hydrologyClass: terrain.hydrologyClass,

      landRatio: terrain.landRatio,
      oceanRatio: terrain.oceanRatio,
      coastalInfluence: terrain.coastalInfluence,
      mountainLift: terrain.mountainLift,
      wetlandInfluence: terrain.wetlandInfluence,
      forestMoistureReturn: terrain.forestMoistureReturn,
      desertDryness: terrain.desertDryness,
      polarInfluence: terrain.polarInfluence,
      orographicCloudBias: terrain.orographicCloudBias,
      stormTrackBias: terrain.stormTrackBias,

      moistureFieldReady: true,
      terrainForcingConsumerActive: true,
      cloudsShouldReadThis: true,
      directCloudPaint: false,
      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      visible256Grid: false
    };
  }

  function seatLonLat(radialIndex, bandIndex) {
    var u = (bandIndex + 0.5) / FIBONACCI_BANDS;
    var y = 1 - 2 * u;
    var latitude = Math.asin(clamp(y, -1, 1));
    var longitude = -Math.PI + TAU * ((radialIndex + 0.5) / RADIAL_NODES);

    return {
      longitude: longitude,
      latitude: latitude
    };
  }

  function getField(frame) {
    frame = frame || {};

    var renderTime = finite(frame.renderTime, 0);
    var frameIndex = finite(frame.frameIndex, 0);

    var seats = [];
    var totals = {
      moisture: 0,
      humidity: 0,
      condensation: 0,
      pressure: 0,
      circulation: 0,
      cloudProbability: 0,
      terrainForcingStrength: 0,
      coastalInfluence: 0,
      mountainLift: 0,
      wetlandInfluence: 0,
      desertDryness: 0,
      orographicCloudBias: 0,
      stormTrackBias: 0
    };

    var terrainCounts = {};
    var ecosystemCounts = {};
    var hydrologyCounts = {};

    for (var bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      for (var radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        var ll = seatLonLat(radialIndex, bandIndex);
        var sampled = sample(ll.longitude, ll.latitude, renderTime);

        var seat = {
          seatIndex: bandIndex * RADIAL_NODES + radialIndex,
          radialIndex: radialIndex,
          bandIndex: bandIndex,
          longitude: ll.longitude,
          latitude: ll.latitude,

          moisture: sampled.moisture,
          humidity: sampled.humidity,
          condensation: sampled.condensation,
          pressure: sampled.pressure,
          circulation: sampled.circulation,
          cloudProbability: sampled.cloudProbability,
          cloudSoftness: sampled.cloudSoftness,

          terrainForcingStrength: sampled.terrainForcingStrength,
          terrainClass: sampled.terrainClass,
          ecosystemClass: sampled.ecosystemClass,
          hydrologyClass: sampled.hydrologyClass,

          coastalInfluence: sampled.coastalInfluence,
          mountainLift: sampled.mountainLift,
          wetlandInfluence: sampled.wetlandInfluence,
          desertDryness: sampled.desertDryness,
          orographicCloudBias: sampled.orographicCloudBias,
          stormTrackBias: sampled.stormTrackBias
        };

        seats.push(seat);

        totals.moisture += seat.moisture;
        totals.humidity += seat.humidity;
        totals.condensation += seat.condensation;
        totals.pressure += seat.pressure;
        totals.circulation += seat.circulation;
        totals.cloudProbability += seat.cloudProbability;
        totals.terrainForcingStrength += seat.terrainForcingStrength;
        totals.coastalInfluence += seat.coastalInfluence;
        totals.mountainLift += seat.mountainLift;
        totals.wetlandInfluence += seat.wetlandInfluence;
        totals.desertDryness += seat.desertDryness;
        totals.orographicCloudBias += seat.orographicCloudBias;
        totals.stormTrackBias += seat.stormTrackBias;

        terrainCounts[seat.terrainClass] = (terrainCounts[seat.terrainClass] || 0) + 1;
        ecosystemCounts[seat.ecosystemClass] = (ecosystemCounts[seat.ecosystemClass] || 0) + 1;
        hydrologyCounts[seat.hydrologyClass] = (hydrologyCounts[seat.hydrologyClass] || 0) + 1;
      }
    }

    var count = seats.length || 1;

    var summary = {
      moistureAverage: totals.moisture / count,
      humidityAverage: totals.humidity / count,
      condensationAverage: totals.condensation / count,
      pressureAverage: totals.pressure / count,
      circulationAverage: totals.circulation / count,
      cloudProbabilityAverage: totals.cloudProbability / count,
      terrainForcingStrengthAverage: totals.terrainForcingStrength / count,
      coastalInfluenceAverage: totals.coastalInfluence / count,
      mountainLiftAverage: totals.mountainLift / count,
      wetlandInfluenceAverage: totals.wetlandInfluence / count,
      desertDrynessAverage: totals.desertDryness / count,
      orographicCloudBiasAverage: totals.orographicCloudBias / count,
      stormTrackBiasAverage: totals.stormTrackBias / count
    };

    var field = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      frameIndex: frameIndex,
      renderTime: renderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: seats.length,
      seats: seats,
      summary: summary,

      terrainCounts: terrainCounts,
      ecosystemCounts: ecosystemCounts,
      hydrologyCounts: hydrologyCounts,

      moistureFieldReady: true,
      terrainForcingDetected: state.terrainForcingDetected,
      terrainForcingConsumed: state.terrainForcingConsumed,
      terrainForcingConsumerActive: true,

      sampleApiReady: true,
      getFieldApiReady: true,
      statusApiReady: true,
      seat256SummaryReady: seats.length === LATTICE_STATES,

      moistureDerivedFromTerrainForcing: state.terrainForcingConsumed,
      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      directCloudPaint: false,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      visible256Grid: false,
      latticeViewProtected: true,
      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true
    };

    state.moistureFieldReady = true;
    state.lastFrameIndex = frameIndex;
    state.lastRenderTime = renderTime;
    state.lastField = field;
    state.lastSummary = summary;

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE_FIELD = field;

    return field;
  }

  function status() {
    return {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      moistureFieldReady: state.moistureFieldReady,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastSummary: state.lastSummary,

      terrainForcingDetected: state.terrainForcingDetected,
      terrainForcingConsumed: state.terrainForcingConsumed,
      terrainForcingConsumerActive: true,

      sampleApiReady: true,
      getFieldApiReady: true,
      statusApiReady: true,
      seat256SummaryReady: true,

      moistureDerivedFromTerrainForcing: state.terrainForcingConsumed,
      terrainForcingDrivesMoisture: true,
      moistureDrivesClouds: true,
      directCloudPaint: false,

      noCanvasCreated: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      latticeViewProtected: true,
      planetViewCloudsOnly: true,
      latticeViewCloudsBlocked: true,

      generatedImage: false,
      graphicBox: false,
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

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_ERROR = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      scope: scope,
      message: message,
      errors: state.errors.slice()
    };

    return status();
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      sample: sample,
      getField: getField,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_MOISTURE = api;
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE = api;
    window.AUDRALIA_TRUE_GLOBE_MOISTURE_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_BOOT = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia moisture child evaluated with terrain/ecosystem forcing consumer active. Public v1 contract preserved."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
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
