// /assets/audralia/clean/runtime/audralia.true-globe.moisture.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_DATUM_CONSUMER_TNT_v3
//
// Public moisture contract intentionally preserved:
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1
//
// Existing terrain forcing consumer marker preserved:
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2
//
// New internal datum consumer marker:
// AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_DATUM_CONSUMER_TNT_v3
//
// Purpose:
// - Preserve moisture child authority.
// - Consume terrain/ecosystem forcing.
// - Consume planetary datum when available.
// - Convert true North / true South / equator / climate belts / Coriolis / jet bands
//   into moisture, humidity, condensation, circulation, pressure, storm-track,
//   polar-resonance, and cloud-eligibility fields.
// - Keep moisture as data only.
// - Do not draw.
// - Do not create canvas.
// - Do not own runtime motion.
// - Do not own route JS.
// - Do not own HTML.
// - Do not paint terrain.
// - Do not paint clouds.
// - Preserve Lattice View protection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_FIELD_CHILD_TNT_v1";
  var TERRAIN_FORCING_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2";
  var DATUM_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_DATUM_CONSUMER_TNT_v3";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_MOISTURE_TERRAIN_FORCING_CONSUMER_TNT_v2";
  var STANDARD = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_SPEC_OPS_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.moisture.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var state = {
    initialized: false,
    moistureFieldReady: false,
    terrainForcingConsumed: false,
    datumConsumed: false,
    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastSample: null,
    lastField: null,
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
        x * freq + time * (0.010 + i * 0.003),
        y * freq - time * (0.009 + i * 0.003),
        salt + i * 17.91
      ) * amp;

      norm += amp;
      amp *= 0.52;
      freq *= 2.04;
    }

    return norm ? total / norm : 0;
  }

  function getDatumApi() {
    return window.AUDRALIA_TRUE_GLOBE_DATUM ||
      window.AUDRALIA_G2_TRUE_GLOBE_DATUM ||
      null;
  }

  function getTerrainApi() {
    return window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      null;
  }

  function fallbackLatitudeBand(lat) {
    var abs = Math.abs(lat) / (Math.PI / 2);

    if (lat >= 0) {
      if (abs >= 0.72) return "north_polar";
      if (abs >= 0.42) return "north_temperate";
      if (abs >= 0.18) return "north_subtropical";
      return "equatorial";
    }

    if (abs >= 0.72) return "south_polar";
    if (abs >= 0.42) return "south_temperate";
    if (abs >= 0.18) return "south_subtropical";
    return "equatorial";
  }

  function fallbackDatum(lon, lat, time) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var equator = 1 - smoothstep(0.05, 0.42, Math.abs(lat));
    var storm = smoothstep(0.38, 0.54, abs) * (1 - smoothstep(0.76, 0.92, abs));
    var polar = smoothstep(0.68, 0.98, abs) * Math.abs(Math.sin(lat));
    var coriolis = clamp(Math.abs(Math.sin(lat)), 0, 1);

    return {
      longitude: lon,
      latitude: lat,
      time: time,
      hemisphere: lat > 0.035 ? "north" : lat < -0.035 ? "south" : "equatorial_transition",
      latitudeBand: fallbackLatitudeBand(lat),
      longitudeBand: { index: 0, name: "fallback_longitude_band", radialNodes: RADIAL_NODES },
      climateBelt: fallbackLatitudeBand(lat),
      coriolisDirection: lat > 0.035 ? "clockwise_north_bias" : lat < -0.035 ? "counterclockwise_south_bias" : "equatorial_transition",
      coriolisStrength: coriolis,
      stormTrackLatitudeBias: clamp(storm, 0, 1),
      equatorMoistureBias: clamp(equator, 0, 1),
      polarResonanceStrength: clamp(polar, 0, 1),
      hemisphereSeasonBias: 0.5,
      groundLevelDatumReadiness: 0.70,
      northTradeWindBand: { active: lat > 0 ? smoothstep(0.16, 0.32, Math.abs(lat)) * (1 - smoothstep(0.52, 0.72, Math.abs(lat))) : 0, strength: 0 },
      southTradeWindBand: { active: lat < 0 ? smoothstep(0.16, 0.32, Math.abs(lat)) * (1 - smoothstep(0.52, 0.72, Math.abs(lat))) : 0, strength: 0 },
      northTemperateJetBand: { active: lat > 0 ? storm : 0, strength: lat > 0 ? storm : 0 },
      southTemperateJetBand: { active: lat < 0 ? storm : 0, strength: lat < 0 ? storm : 0 },
      northPolarJetBand: { active: lat > 0 ? polar : 0, strength: lat > 0 ? polar : 0 },
      southPolarJetBand: { active: lat < 0 ? polar : 0, strength: lat < 0 ? polar : 0 },
      equatorialConvectionBelt: { active: equator, strength: equator },
      planetaryDatumChildReady: false,
      datumReady: false,
      fallbackDatum: true
    };
  }

  function getDatumSample(lon, lat, time, frame) {
    frame = frame || {};

    var api = getDatumApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time);
        if (sampled && sampled.planetaryDatumChildReady) return sampled;
      } catch (error) {
        recordError("datum-sample", error);
      }
    }

    if (frame.datum && frame.datum.datumReady) {
      return fallbackDatum(lon, lat, time);
    }

    return fallbackDatum(lon, lat, time);
  }

  function fallbackTerrain(lon, lat, time, frame) {
    var normalizedLon = (lon + Math.PI) / TAU;
    var normalizedLat = (lat + Math.PI / 2) / Math.PI;

    var datum = getDatumSample(lon, lat, time, frame);
    var equator = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var storm = clamp(datum.stormTrackLatitudeBias || 0, 0, 1);
    var polar = clamp(datum.polarResonanceStrength || 0, 0, 1);

    var landNoise = fbm2(normalizedLon * 4.2, normalizedLat * 3.8, 0, 31.7);
    var ridgeNoise = fbm2(normalizedLon * 8.8 + 0.4, normalizedLat * 6.3 - 0.2, 0, 77.3);
    var basinNoise = fbm2(normalizedLon * 7.4 - 0.8, normalizedLat * 7.9 + 0.5, 0, 92.6);

    var landRatio = smoothstep(0.52, 0.78, landNoise);
    var oceanRatio = 1 - landRatio;
    var coastalInfluence = clamp(1 - Math.abs(landRatio - 0.50) * 2, 0, 1);
    var mountainLift = landRatio * smoothstep(0.62, 0.88, ridgeNoise);
    var basinRetention = landRatio * smoothstep(0.54, 0.84, basinNoise);

    var wetlandInfluence = clamp(basinRetention * 0.42 + coastalInfluence * 0.28 + equator * landRatio * 0.22 - mountainLift * 0.08, 0, 1);
    var forestMoistureReturn = clamp(landRatio * (0.22 + equator * 0.24 + storm * 0.18 + wetlandInfluence * 0.28), 0, 1);
    var desertDryness = clamp(landRatio * (1 - wetlandInfluence) * (1 - forestMoistureReturn) * 0.34, 0, 1);

    return {
      contract: "FALLBACK_TERRAIN_FOR_MOISTURE_ONLY",
      longitude: lon,
      latitude: lat,
      time: time,
      elevation: clamp(-0.62 * oceanRatio + landRatio * 0.22 + mountainLift * 0.58 - basinRetention * 0.16, -1, 1),
      landRatio: landRatio,
      oceanRatio: oceanRatio,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: basinRetention * 0.42,
      basinRetention: basinRetention,
      riverInfluence: clamp(basinRetention * coastalInfluence * 0.46 + mountainLift * 0.12, 0, 1),
      lakeInfluence: basinRetention * 0.26,
      wetlandInfluence: wetlandInfluence,
      forestMoistureReturn: forestMoistureReturn,
      desertDryness: desertDryness,
      polarInfluence: polar,
      soilMoisture: clamp(basinRetention * 0.28 + wetlandInfluence * 0.32 + coastalInfluence * 0.16, 0, 1),
      evaporationPotential: clamp(oceanRatio * 0.46 + coastalInfluence * 0.26 + wetlandInfluence * 0.24, 0, 1),
      surfaceHeat: clamp(0.34 + equator * 0.16 - polar * 0.24 + desertDryness * 0.14, 0, 1),
      thermalGradient: clamp(coastalInfluence * 0.18 + mountainLift * 0.18 + storm * 0.24, 0, 1),
      pressureLift: clamp(mountainLift * 0.42 + coastalInfluence * 0.14 + storm * 0.18, 0, 1),
      convectionPotential: clamp(equator * 0.24 + wetlandInfluence * 0.22 + coastalInfluence * 0.16, 0, 1),
      orographicCloudBias: clamp(mountainLift * 0.70, 0, 1),
      stormTrackBias: clamp(storm * 0.46 + coastalInfluence * 0.18 + mountainLift * 0.14, 0, 1),
      ecosystemMoistureReturn: clamp(forestMoistureReturn * 0.42 + wetlandInfluence * 0.32, 0, 1),
      terrainClass: landRatio < 0.16 ? "deep_ocean" : coastalInfluence > 0.56 ? "coastal_edge" : mountainLift > 0.66 ? "gratitude_ridge" : wetlandInfluence > 0.50 ? "gratitude_wetland" : "gratitude_lowland",
      ecosystemClass: landRatio < 0.16 ? "open_ocean" : wetlandInfluence > 0.50 ? "basin_wetland" : forestMoistureReturn > 0.38 ? "moist_forest" : "lowland_ecosystem",
      hydrologyClass: landRatio < 0.16 ? "ocean_source" : wetlandInfluence > 0.50 ? "wetland_retention" : coastalInfluence > 0.56 ? "coastal_evaporation" : "soil_moisture_memory",
      forcingStrength: clamp(landRatio * 0.18 + coastalInfluence * 0.14 + mountainLift * 0.16 + basinRetention * 0.14 + storm * 0.10, 0, 1),
      forcingFieldReady: false,
      fallbackTerrain: true
    };
  }

  function getTerrainSample(lon, lat, time, frame) {
    var api = getTerrainApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time, frame || {});
        if (sampled && sampled.forcingFieldReady) return sampled;
      } catch (error) {
        recordError("terrain-sample", error);
      }
    }

    return fallbackTerrain(lon, lat, time, frame);
  }

  function bandStrength(value) {
    if (value && typeof value.strength === "number") return clamp(value.strength, 0, 1);
    if (value && typeof value.active === "number") return clamp(value.active, 0, 1);
    return 0;
  }

  function sample(longitude, latitude, time, frame) {
    var lon = wrapLongitude(longitude);
    var lat = clamp(finite(latitude, 0), -Math.PI / 2, Math.PI / 2);
    var t = finite(time, 0);

    frame = frame || {};

    var datum = getDatumSample(lon, lat, t, frame);
    var terrain = getTerrainSample(lon, lat, t, frame);

    var datumReady = Boolean(datum && datum.planetaryDatumChildReady);
    var terrainReady = Boolean(terrain && terrain.forcingFieldReady);

    var normalizedLon = (lon + Math.PI) / TAU;
    var normalizedLat = (lat + Math.PI / 2) / Math.PI;

    var circulationNoise = fbm2(normalizedLon * 5.4, normalizedLat * 4.2, t * 0.006, 42.7);
    var pressureNoise = fbm2(normalizedLon * 7.8 + 0.2, normalizedLat * 5.9 - 0.5, t * 0.004, 67.2);
    var condensationNoise = fbm2(normalizedLon * 9.4 - 0.4, normalizedLat * 8.1 + 0.9, t * 0.003, 93.8);

    var oceanRatio = clamp(terrain.oceanRatio || 0, 0, 1);
    var landRatio = clamp(terrain.landRatio || 0, 0, 1);
    var coastalInfluence = clamp(terrain.coastalInfluence || 0, 0, 1);
    var mountainLift = clamp(terrain.mountainLift || 0, 0, 1);
    var basinRetention = clamp(terrain.basinRetention || 0, 0, 1);
    var wetlandInfluence = clamp(terrain.wetlandInfluence || 0, 0, 1);
    var forestMoistureReturn = clamp(terrain.forestMoistureReturn || 0, 0, 1);
    var desertDryness = clamp(terrain.desertDryness || 0, 0, 1);
    var soilMoisture = clamp(terrain.soilMoisture || 0, 0, 1);
    var evaporationPotential = clamp(terrain.evaporationPotential || 0, 0, 1);
    var surfaceHeat = clamp(terrain.surfaceHeat || 0, 0, 1);
    var pressureLift = clamp(terrain.pressureLift || 0, 0, 1);
    var thermalGradient = clamp(terrain.thermalGradient || 0, 0, 1);
    var convectionPotential = clamp(terrain.convectionPotential || 0, 0, 1);
    var orographicCloudBias = clamp(terrain.orographicCloudBias || 0, 0, 1);
    var stormTrackBiasTerrain = clamp(terrain.stormTrackBias || 0, 0, 1);
    var terrainForcingStrength = clamp(terrain.forcingStrength || terrain.terrainForcingStrength || 0, 0, 1);

    var equatorMoistureBias = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var polarResonanceStrength = clamp(datum.polarResonanceStrength || 0, 0, 1);
    var coriolisStrength = clamp(datum.coriolisStrength || 0, 0, 1);
    var stormTrackLatitudeBias = clamp(datum.stormTrackLatitudeBias || 0, 0, 1);
    var hemisphereSeasonBias = clamp(datum.hemisphereSeasonBias || 0.5, 0, 1);

    var northTrade = bandStrength(datum.northTradeWindBand);
    var southTrade = bandStrength(datum.southTradeWindBand);
    var northTemperateJet = bandStrength(datum.northTemperateJetBand);
    var southTemperateJet = bandStrength(datum.southTemperateJetBand);
    var northPolarJet = bandStrength(datum.northPolarJetBand);
    var southPolarJet = bandStrength(datum.southPolarJetBand);
    var equatorialConvection = bandStrength(datum.equatorialConvectionBelt);

    var tradeWindStrength = clamp(northTrade + southTrade, 0, 1);
    var temperateJetStrength = clamp(northTemperateJet + southTemperateJet, 0, 1);
    var polarJetStrength = clamp(northPolarJet + southPolarJet, 0, 1);

    var evaporation = clamp(
      evaporationPotential * 0.36 +
      oceanRatio * 0.22 +
      coastalInfluence * 0.18 +
      wetlandInfluence * 0.14 +
      hemisphereSeasonBias * 0.08 -
      polarResonanceStrength * 0.08,
      0,
      1
    );

    var humidity = clamp(
      evaporation * 0.36 +
      soilMoisture * 0.26 +
      forestMoistureReturn * 0.18 +
      wetlandInfluence * 0.18 +
      equatorMoistureBias * 0.16 +
      coastalInfluence * 0.12 -
      desertDryness * 0.22 -
      polarResonanceStrength * 0.06,
      0,
      1
    );

    var pressure = clamp(
      pressureLift * 0.28 +
      thermalGradient * 0.22 +
      stormTrackLatitudeBias * 0.22 +
      temperateJetStrength * 0.16 +
      polarJetStrength * 0.10 +
      pressureNoise * 0.10,
      0,
      1
    );

    var circulation = clamp(
      coriolisStrength * 0.22 +
      tradeWindStrength * 0.18 +
      temperateJetStrength * 0.26 +
      polarJetStrength * 0.14 +
      stormTrackLatitudeBias * 0.20 +
      circulationNoise * 0.12,
      0,
      1
    );

    var condensation = clamp(
      humidity * 0.24 +
      pressure * 0.20 +
      convectionPotential * 0.18 +
      orographicCloudBias * 0.18 +
      equatorialConvection * 0.12 +
      wetlandInfluence * 0.12 +
      condensationNoise * 0.10 -
      desertDryness * 0.12,
      0,
      1
    );

    var stormTrackBias = clamp(
      stormTrackBiasTerrain * 0.32 +
      stormTrackLatitudeBias * 0.34 +
      temperateJetStrength * 0.18 +
      coriolisStrength * 0.10 +
      thermalGradient * 0.10,
      0,
      1
    );

    var polarInfluence = clamp(
      polarResonanceStrength * 0.76 +
      polarJetStrength * 0.20,
      0,
      1
    );

    var moisture = clamp(
      evaporation * 0.26 +
      humidity * 0.30 +
      soilMoisture * 0.18 +
      wetlandInfluence * 0.12 +
      equatorMoistureBias * 0.12 -
      desertDryness * 0.14,
      0,
      1
    );

    var cloudProbability = clamp(
      moisture * 0.22 +
      humidity * 0.22 +
      condensation * 0.24 +
      pressure * 0.12 +
      stormTrackBias * 0.12 +
      orographicCloudBias * 0.10 +
      equatorMoistureBias * 0.08 -
      desertDryness * 0.12,
      0,
      1
    );

    var cloudSoftness = clamp(
      0.38 +
      humidity * 0.22 +
      wetlandInfluence * 0.16 +
      oceanRatio * 0.10 +
      equatorMoistureBias * 0.08 -
      polarInfluence * 0.10,
      0,
      1
    );

    var sampleValue = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

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

      evaporation: evaporation,
      evaporationPotential: evaporationPotential,
      soilMoisture: soilMoisture,
      surfaceHeat: surfaceHeat,
      thermalGradient: thermalGradient,
      pressureLift: pressureLift,
      convectionPotential: convectionPotential,

      terrainForcingDetected: terrainReady,
      terrainForcingConsumed: true,
      terrainForcingStrength: terrainForcingStrength,
      terrainClass: terrain.terrainClass || "unknown",
      ecosystemClass: terrain.ecosystemClass || "unknown",
      hydrologyClass: terrain.hydrologyClass || "unknown",

      landRatio: landRatio,
      oceanRatio: oceanRatio,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: clamp(terrain.valleyPooling || 0, 0, 1),
      basinRetention: basinRetention,
      riverInfluence: clamp(terrain.riverInfluence || 0, 0, 1),
      lakeInfluence: clamp(terrain.lakeInfluence || 0, 0, 1),
      wetlandInfluence: wetlandInfluence,
      forestMoistureReturn: forestMoistureReturn,
      desertDryness: desertDryness,
      polarInfluence: polarInfluence,
      orographicCloudBias: orographicCloudBias,
      stormTrackBias: stormTrackBias,
      ecosystemMoistureReturn: clamp(terrain.ecosystemMoistureReturn || 0, 0, 1),

      datumConsumed: datumReady,
      datumReady: datumReady,
      datum: datum,

      hemisphere: datum.hemisphere,
      latitudeBand: datum.latitudeBand,
      longitudeBand: datum.longitudeBand,
      climateBelt: datum.climateBelt,
      coriolisDirection: datum.coriolisDirection,
      coriolisStrength: coriolisStrength,
      stormTrackLatitudeBias: stormTrackLatitudeBias,
      equatorMoistureBias: equatorMoistureBias,
      polarResonanceStrength: polarResonanceStrength,
      hemisphereSeasonBias: hemisphereSeasonBias,

      northTradeWindStrength: northTrade,
      southTradeWindStrength: southTrade,
      tradeWindStrength: tradeWindStrength,
      northTemperateJetStrength: northTemperateJet,
      southTemperateJetStrength: southTemperateJet,
      temperateJetStrength: temperateJetStrength,
      northPolarJetStrength: northPolarJet,
      southPolarJetStrength: southPolarJet,
      polarJetStrength: polarJetStrength,
      equatorialConvectionStrength: equatorialConvection,

      moistureFieldReady: true,
      moistureDerivedFromTerrainForcing: true,
      moistureUsesDatumField: true,
      moistureCirculationDatumActive: true,
      trueNorthAuthorityInherited: datumReady,
      trueSouthAuthorityInherited: datumReady,
      equatorAuthorityInherited: datumReady,
      climateBeltAuthorityInherited: datumReady,
      polarResonanceAuthorityInherited: datumReady,
      coriolisFieldInherited: datumReady,
      tradeWindBandsInherited: datumReady,
      temperateJetBandsInherited: datumReady,
      polarJetBandsInherited: datumReady,

      noCanvasCreated: true,
      noDrawAuthority: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      directCloudPaint: false,
      latticeViewProtected: true,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      visible256Grid: false
    };

    state.moistureFieldReady = true;
    state.terrainForcingConsumed = true;
    state.datumConsumed = datumReady;
    state.lastSample = sampleValue;

    return sampleValue;
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

  function increment(map, key) {
    map[key] = (map[key] || 0) + 1;
  }

  function getField(frame) {
    frame = frame || {};

    var renderTime = finite(frame.renderTime, 0);
    var frameIndex = finite(frame.frameIndex, 0);

    var cells = [];
    var totals = {
      moisture: 0,
      humidity: 0,
      condensation: 0,
      pressure: 0,
      circulation: 0,
      cloudProbability: 0,
      cloudSoftness: 0,
      evaporation: 0,
      terrainForcingStrength: 0,
      datumConsumed: 0,
      terrainForcingConsumed: 0,
      stormTrackBias: 0,
      polarInfluence: 0,
      equatorMoistureBias: 0,
      coriolisStrength: 0,
      tradeWindStrength: 0,
      temperateJetStrength: 0,
      polarJetStrength: 0,
      equatorialConvectionStrength: 0
    };

    var climateBeltCounts = {};
    var hemisphereCounts = {};
    var terrainClassCounts = {};
    var hydrologyClassCounts = {};

    for (var bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      for (var radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        var ll = seatLonLat(radialIndex, bandIndex);
        var sampled = sample(ll.longitude, ll.latitude, renderTime, frame);

        var cell = {
          seatIndex: bandIndex * RADIAL_NODES + radialIndex,
          radialIndex: radialIndex,
          bandIndex: bandIndex,
          longitude: sampled.longitude,
          latitude: sampled.latitude,

          moisture: sampled.moisture,
          humidity: sampled.humidity,
          condensation: sampled.condensation,
          pressure: sampled.pressure,
          circulation: sampled.circulation,
          cloudProbability: sampled.cloudProbability,
          cloudSoftness: sampled.cloudSoftness,
          evaporation: sampled.evaporation,

          terrainForcingDetected: sampled.terrainForcingDetected,
          terrainForcingConsumed: sampled.terrainForcingConsumed,
          terrainForcingStrength: sampled.terrainForcingStrength,
          terrainClass: sampled.terrainClass,
          ecosystemClass: sampled.ecosystemClass,
          hydrologyClass: sampled.hydrologyClass,

          datumConsumed: sampled.datumConsumed,
          hemisphere: sampled.hemisphere,
          latitudeBand: sampled.latitudeBand,
          climateBelt: sampled.climateBelt,
          coriolisDirection: sampled.coriolisDirection,
          coriolisStrength: sampled.coriolisStrength,
          stormTrackLatitudeBias: sampled.stormTrackLatitudeBias,
          equatorMoistureBias: sampled.equatorMoistureBias,
          polarResonanceStrength: sampled.polarResonanceStrength,
          hemisphereSeasonBias: sampled.hemisphereSeasonBias,

          tradeWindStrength: sampled.tradeWindStrength,
          temperateJetStrength: sampled.temperateJetStrength,
          polarJetStrength: sampled.polarJetStrength,
          equatorialConvectionStrength: sampled.equatorialConvectionStrength,

          landRatio: sampled.landRatio,
          oceanRatio: sampled.oceanRatio,
          coastalInfluence: sampled.coastalInfluence,
          mountainLift: sampled.mountainLift,
          wetlandInfluence: sampled.wetlandInfluence,
          forestMoistureReturn: sampled.forestMoistureReturn,
          desertDryness: sampled.desertDryness,
          polarInfluence: sampled.polarInfluence,
          orographicCloudBias: sampled.orographicCloudBias,
          stormTrackBias: sampled.stormTrackBias
        };

        cells.push(cell);

        totals.moisture += cell.moisture;
        totals.humidity += cell.humidity;
        totals.condensation += cell.condensation;
        totals.pressure += cell.pressure;
        totals.circulation += cell.circulation;
        totals.cloudProbability += cell.cloudProbability;
        totals.cloudSoftness += cell.cloudSoftness;
        totals.evaporation += cell.evaporation;
        totals.terrainForcingStrength += cell.terrainForcingStrength;
        totals.datumConsumed += cell.datumConsumed ? 1 : 0;
        totals.terrainForcingConsumed += cell.terrainForcingConsumed ? 1 : 0;
        totals.stormTrackBias += cell.stormTrackBias;
        totals.polarInfluence += cell.polarInfluence;
        totals.equatorMoistureBias += cell.equatorMoistureBias;
        totals.coriolisStrength += cell.coriolisStrength;
        totals.tradeWindStrength += cell.tradeWindStrength;
        totals.temperateJetStrength += cell.temperateJetStrength;
        totals.polarJetStrength += cell.polarJetStrength;
        totals.equatorialConvectionStrength += cell.equatorialConvectionStrength;

        increment(climateBeltCounts, cell.climateBelt);
        increment(hemisphereCounts, cell.hemisphere);
        increment(terrainClassCounts, cell.terrainClass);
        increment(hydrologyClassCounts, cell.hydrologyClass);
      }
    }

    var count = cells.length || 1;

    var summary = {
      moistureAverage: totals.moisture / count,
      humidityAverage: totals.humidity / count,
      condensationAverage: totals.condensation / count,
      pressureAverage: totals.pressure / count,
      circulationAverage: totals.circulation / count,
      cloudProbabilityAverage: totals.cloudProbability / count,
      cloudSoftnessAverage: totals.cloudSoftness / count,
      evaporationAverage: totals.evaporation / count,
      terrainForcingStrengthAverage: totals.terrainForcingStrength / count,
      datumConsumedRatio: totals.datumConsumed / count,
      terrainForcingConsumedRatio: totals.terrainForcingConsumed / count,
      stormTrackBiasAverage: totals.stormTrackBias / count,
      polarInfluenceAverage: totals.polarInfluence / count,
      equatorMoistureBiasAverage: totals.equatorMoistureBias / count,
      coriolisStrengthAverage: totals.coriolisStrength / count,
      tradeWindStrengthAverage: totals.tradeWindStrength / count,
      temperateJetStrengthAverage: totals.temperateJetStrength / count,
      polarJetStrengthAverage: totals.polarJetStrength / count,
      equatorialConvectionStrengthAverage: totals.equatorialConvectionStrength / count
    };

    var field = {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      frameIndex: frameIndex,
      renderTime: renderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      cellCount: cells.length,

      cells: cells,
      summary: summary,
      climateBeltCounts: climateBeltCounts,
      hemisphereCounts: hemisphereCounts,
      terrainClassCounts: terrainClassCounts,
      hydrologyClassCounts: hydrologyClassCounts,

      moistureFieldReady: true,
      fieldReady: true,
      moistureDerivedFromTerrainForcing: true,
      terrainForcingDetected: summary.terrainForcingConsumedRatio > 0,
      terrainForcingConsumed: true,
      datumConsumed: summary.datumConsumedRatio > 0,
      datumReady: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),

      moistureUsesDatumField: true,
      moistureCirculationDatumActive: true,
      trueNorthAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      trueSouthAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      equatorAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      climateBeltAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      polarResonanceAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      coriolisFieldInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      tradeWindBandsInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      temperateJetBandsInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      polarJetBandsInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),

      moistureDrivesClouds: true,
      directCloudPaint: false,

      noCanvasCreated: true,
      noDrawAuthority: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      latticeViewProtected: true,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      visible256Grid: false
    };

    state.moistureFieldReady = true;
    state.terrainForcingConsumed = true;
    state.datumConsumed = field.datumConsumed;
    state.lastFrameIndex = frameIndex;
    state.lastRenderTime = renderTime;
    state.lastField = field;

    window.AUDRALIA_TRUE_GLOBE_MOISTURE_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE_FIELD = field;

    return field;
  }

  function status() {
    return {
      contract: CONTRACT,
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      moistureFieldReady: state.moistureFieldReady,
      terrainForcingConsumed: state.terrainForcingConsumed,
      datumConsumed: state.datumConsumed,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,

      moistureFieldChildReady: true,
      moistureTerrainForcingConsumerReady: true,
      moistureDatumConsumerReady: true,
      moistureUsesDatumField: true,
      moistureCirculationDatumActive: true,
      trueNorthAuthorityInherited: state.datumConsumed,
      trueSouthAuthorityInherited: state.datumConsumed,
      equatorAuthorityInherited: state.datumConsumed,
      climateBeltAuthorityInherited: state.datumConsumed,
      polarResonanceAuthorityInherited: state.datumConsumed,
      coriolisFieldInherited: state.datumConsumed,
      tradeWindBandsInherited: state.datumConsumed,
      temperateJetBandsInherited: state.datumConsumed,
      polarJetBandsInherited: state.datumConsumed,

      moistureDerivedFromTerrainForcing: true,
      moistureDrivesClouds: true,
      directCloudPaint: false,

      noCanvasCreated: true,
      noDrawAuthority: true,
      noRouteJsAuthority: true,
      noHtmlAuthority: true,
      latticeViewProtected: true,

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
      terrainForcingConsumerContract: TERRAIN_FORCING_CONSUMER_CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
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
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia moisture child evaluated with datum consumer capability. Moisture now reads planetary datum when available and preserves data-only authority."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.moistureFieldReady = true;
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
