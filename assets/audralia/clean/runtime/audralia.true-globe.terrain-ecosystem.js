// /assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_DATUM_CONSUMER_TNT_v2
//
// Public terrain contract intentionally preserved:
// AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1
//
// New internal datum consumer marker:
// AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_DATUM_CONSUMER_TNT_v2
//
// Purpose:
// - Preserve terrain/ecosystem forcing authority.
// - Consume planetary datum when available.
// - Keep terrain as data/forcing only.
// - Improve climate placement using true North, true South, equator, hemisphere,
//   latitude bands, climate belts, storm-track bias, equator moisture bias,
//   polar resonance, seasonal bias, and Coriolis strength.
// - Preserve Gratitude continent as the first active terrain/emergent-continent source.
// - Do not draw.
// - Do not create canvas.
// - Do not own runtime motion.
// - Do not own route JS.
// - Do not own HTML.
// - Do not paint clouds.
// - Preserve Lattice View protection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1";
  var DATUM_CONSUMER_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_DATUM_CONSUMER_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_TRUE_PLANETARY_DATUM_AND_AXIS_SPEC_OPS_v1";
  var TERRAIN_STANDARD = "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STANDARD_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var GRATITUDE_CENTER = {
    longitude: -2.42,
    latitude: 0.42,
    radiusX: 0.94,
    radiusY: 0.56,
    name: "Gratitude Continent"
  };

  var state = {
    initialized: false,
    fieldReady: false,
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
        x * freq + time * (0.006 + i * 0.002),
        y * freq - time * (0.005 + i * 0.002),
        salt + i * 23.71
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

  function getDatumSample(lon, lat, time, frame) {
    var frameDatum = frame && frame.datum;
    var api = getDatumApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time);
        if (sampled && sampled.planetaryDatumChildReady) return sampled;
      } catch (error) {
        recordError("datum-sample", error);
      }
    }

    if (frameDatum && frameDatum.seats && frameDatum.datumReady) {
      return {
        longitude: lon,
        latitude: lat,
        time: time,
        hemisphere: lat > 0.035 ? "north" : lat < -0.035 ? "south" : "equatorial_transition",
        latitudeBand: fallbackLatitudeBand(lat),
        climateBelt: fallbackLatitudeBand(lat),
        coriolisDirection: lat > 0.035 ? "clockwise_north_bias" : lat < -0.035 ? "counterclockwise_south_bias" : "equatorial_transition",
        coriolisStrength: clamp(Math.abs(Math.sin(lat)), 0, 1),
        stormTrackLatitudeBias: fallbackStormTrackBias(lat),
        equatorMoistureBias: 1 - smoothstep(0.05, 0.42, Math.abs(lat)),
        polarResonanceStrength: smoothstep(0.68, 0.98, Math.abs(lat) / (Math.PI / 2)),
        hemisphereSeasonBias: 0.5,
        groundLevelDatumReadiness: 0.76,
        planetaryDatumChildReady: true,
        datumReady: true,
        fallbackFromFrameDatum: true
      };
    }

    return {
      longitude: lon,
      latitude: lat,
      time: time,
      hemisphere: lat > 0.035 ? "north" : lat < -0.035 ? "south" : "equatorial_transition",
      latitudeBand: fallbackLatitudeBand(lat),
      climateBelt: fallbackLatitudeBand(lat),
      coriolisDirection: lat > 0.035 ? "clockwise_north_bias" : lat < -0.035 ? "counterclockwise_south_bias" : "equatorial_transition",
      coriolisStrength: clamp(Math.abs(Math.sin(lat)), 0, 1),
      stormTrackLatitudeBias: fallbackStormTrackBias(lat),
      equatorMoistureBias: 1 - smoothstep(0.05, 0.42, Math.abs(lat)),
      polarResonanceStrength: smoothstep(0.68, 0.98, Math.abs(lat) / (Math.PI / 2)),
      hemisphereSeasonBias: 0.5,
      groundLevelDatumReadiness: 0.70,
      planetaryDatumChildReady: false,
      datumReady: false,
      fallbackDatum: true
    };
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

  function fallbackStormTrackBias(lat) {
    var abs = Math.abs(lat) / (Math.PI / 2);
    var temperate = smoothstep(0.38, 0.54, abs) * (1 - smoothstep(0.76, 0.92, abs));
    var subtropical = smoothstep(0.18, 0.34, abs) * (1 - smoothstep(0.48, 0.62, abs));
    return clamp(temperate * 0.78 + subtropical * 0.22, 0, 1);
  }

  function greatCircleDistance(lonA, latA, lonB, latB) {
    var dLon = wrapLongitude(lonA - lonB);
    var sinLat = Math.sin((latA - latB) / 2);
    var sinLon = Math.sin(dLon / 2);
    var h = sinLat * sinLat + Math.cos(latA) * Math.cos(latB) * sinLon * sinLon;

    return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  }

  function gratitudeInfluence(lon, lat, time) {
    var dLon = wrapLongitude(lon - GRATITUDE_CENTER.longitude);
    var dLat = lat - GRATITUDE_CENTER.latitude;

    var nx = dLon / GRATITUDE_CENTER.radiusX;
    var ny = dLat / GRATITUDE_CENTER.radiusY;

    var oval = Math.exp(-(nx * nx + ny * ny));

    var normalizedLon = (lon + Math.PI) / TAU;
    var normalizedLat = (lat + Math.PI / 2) / Math.PI;

    var coastBreak = fbm2(normalizedLon * 5.6, normalizedLat * 4.8, time * 0.002, 41.9);
    var ridgeNoise = fbm2(normalizedLon * 8.2 + 0.7, normalizedLat * 6.1 - 0.3, 0, 77.4);
    var basinNoise = fbm2(normalizedLon * 7.1 - 0.2, normalizedLat * 7.6 + 0.8, 0, 101.6);

    var shaped = oval + (coastBreak - 0.50) * 0.22 + (ridgeNoise - 0.50) * 0.10 - (basinNoise - 0.50) * 0.05;

    return clamp(shaped, 0, 1);
  }

  function continentMembership(gratitude) {
    return smoothstep(0.20, 0.62, gratitude);
  }

  function coastalInfluenceFromLand(landRatio) {
    return clamp(1 - Math.abs(landRatio - 0.50) * 2, 0, 1);
  }

  function classifyTerrain(sample) {
    if (sample.landRatio < 0.16) {
      if (sample.coastalInfluence > 0.28) return "shallow_shelf";
      return "deep_ocean";
    }

    if (sample.coastalInfluence > 0.58 && sample.landRatio < 0.62) return "coastal_edge";
    if (sample.wetlandInfluence > 0.52) return "gratitude_wetland";
    if (sample.riverInfluence > 0.42 || sample.lakeInfluence > 0.36) return "gratitude_hydrology_channel";
    if (sample.mountainLift > 0.68) return "gratitude_ridge";
    if (sample.elevation > 0.46) return "gratitude_highland";
    if (sample.basinRetention > 0.46) return "gratitude_basin";
    if (sample.forestMoistureReturn > 0.38) return "gratitude_moist_forest";
    if (sample.desertDryness > 0.36) return "gratitude_dryland_transition";

    return "gratitude_lowland";
  }

  function classifyEcosystem(sample) {
    if (sample.landRatio < 0.16) return "open_ocean";
    if (sample.coastalInfluence > 0.58) return "coastal_transition";
    if (sample.wetlandInfluence > 0.52) return "basin_wetland";
    if (sample.mountainLift > 0.68) return "ridge_highland";
    if (sample.forestMoistureReturn > 0.38) return "moist_forest";
    if (sample.desertDryness > 0.36) return "dryland_transition";
    return "lowland_ecosystem";
  }

  function classifyHydrology(sample) {
    if (sample.landRatio < 0.16) return "ocean_source";
    if (sample.coastalInfluence > 0.58) return "coastal_evaporation";
    if (sample.wetlandInfluence > 0.52) return "wetland_retention";
    if (sample.riverInfluence > 0.42) return "river_channel";
    if (sample.basinRetention > 0.44) return "basin_collection";
    if (sample.mountainLift > 0.62) return "orographic_source";
    return "soil_moisture_memory";
  }

  function sample(longitude, latitude, time, frame) {
    var lon = wrapLongitude(longitude);
    var lat = clamp(finite(latitude, 0), -Math.PI / 2, Math.PI / 2);
    var t = finite(time, 0);

    frame = frame || {};

    var datum = getDatumSample(lon, lat, t, frame);
    var datumReady = Boolean(datum && datum.planetaryDatumChildReady);

    var normalizedLon = (lon + Math.PI) / TAU;
    var normalizedLat = (lat + Math.PI / 2) / Math.PI;

    var gratitude = gratitudeInfluence(lon, lat, t);
    var landRatio = continentMembership(gratitude);
    var oceanRatio = 1 - landRatio;
    var coastalInfluence = coastalInfluenceFromLand(landRatio);

    var continentalCore = smoothstep(0.38, 0.84, gratitude);
    var edge = coastalInfluence;
    var latAbs = Math.abs(lat) / (Math.PI / 2);

    var elevationNoise = fbm2(normalizedLon * 6.6, normalizedLat * 5.7, 0, 18.2);
    var ridgeNoise = fbm2(normalizedLon * 13.3 + 0.4, normalizedLat * 8.7 - 0.1, 0, 62.8);
    var basinNoise = fbm2(normalizedLon * 9.4 - 0.7, normalizedLat * 11.2 + 0.9, 0, 89.3);
    var riverNoise = fbm2(normalizedLon * 18.0 + 1.1, normalizedLat * 15.5 - 0.8, 0, 124.6);

    var datumStorm = clamp(datum.stormTrackLatitudeBias || 0, 0, 1);
    var datumEquatorMoisture = clamp(datum.equatorMoistureBias || 0, 0, 1);
    var datumPolar = clamp(datum.polarResonanceStrength || 0, 0, 1);
    var datumSeason = clamp(datum.hemisphereSeasonBias || 0.5, 0, 1);
    var datumCoriolis = clamp(datum.coriolisStrength || 0, 0, 1);

    var mountainLift = clamp(
      landRatio *
      smoothstep(0.52, 0.92, ridgeNoise) *
      (0.58 + continentalCore * 0.36 + datumStorm * 0.12),
      0,
      1
    );

    var basinRetention = clamp(
      landRatio *
      smoothstep(0.46, 0.86, basinNoise) *
      (0.50 + coastalInfluence * 0.22 + datumEquatorMoisture * 0.18 + datumSeason * 0.10),
      0,
      1
    );

    var riverInfluence = clamp(
      landRatio *
      smoothstep(0.50, 0.86, riverNoise) *
      (0.42 + mountainLift * 0.22 + basinRetention * 0.30 + coastalInfluence * 0.16),
      0,
      1
    );

    var lakeInfluence = clamp(
      basinRetention * (0.26 + smoothstep(0.50, 0.84, basinNoise) * 0.42),
      0,
      1
    );

    var wetlandInfluence = clamp(
      basinRetention * 0.44 +
      coastalInfluence * landRatio * 0.26 +
      datumEquatorMoisture * landRatio * 0.22 -
      mountainLift * 0.10,
      0,
      1
    );

    var forestMoistureReturn = clamp(
      landRatio *
      (0.22 + datumEquatorMoisture * 0.26 + datumStorm * 0.18 + wetlandInfluence * 0.30) *
      (1 - mountainLift * 0.20),
      0,
      1
    );

    var desertDryness = clamp(
      landRatio *
      (1 - wetlandInfluence) *
      (1 - forestMoistureReturn) *
      (0.18 + Math.abs(latAbs - 0.34) * 0.24) *
      (1 - datumStorm * 0.26),
      0,
      1
    );

    var polarInfluence = datumPolar;

    var elevation = clamp(
      -0.62 * oceanRatio +
      landRatio * 0.24 +
      mountainLift * 0.62 +
      continentalCore * 0.26 -
      basinRetention * 0.18 -
      coastalInfluence * 0.12,
      -1,
      1
    );

    var soilMoisture = clamp(
      basinRetention * 0.30 +
      wetlandInfluence * 0.32 +
      forestMoistureReturn * 0.24 +
      coastalInfluence * 0.16 +
      datumEquatorMoisture * landRatio * 0.18 -
      desertDryness * 0.22,
      0,
      1
    );

    var evaporationPotential = clamp(
      oceanRatio * 0.46 +
      coastalInfluence * 0.28 +
      wetlandInfluence * 0.24 +
      soilMoisture * 0.22 +
      datumSeason * 0.08 -
      polarInfluence * 0.18,
      0,
      1
    );

    var surfaceHeat = clamp(
      0.32 +
      datumSeason * 0.18 +
      datumEquatorMoisture * 0.16 +
      desertDryness * 0.18 -
      polarInfluence * 0.24 -
      mountainLift * 0.06,
      0,
      1
    );

    var thermalGradient = clamp(
      coastalInfluence * 0.22 +
      mountainLift * 0.20 +
      datumStorm * 0.24 +
      datumCoriolis * 0.10 +
      Math.abs(surfaceHeat - soilMoisture) * 0.22,
      0,
      1
    );

    var pressureLift = clamp(
      mountainLift * 0.44 +
      coastalInfluence * 0.18 +
      datumStorm * 0.20 +
      polarInfluence * 0.10,
      0,
      1
    );

    var convectionPotential = clamp(
      surfaceHeat * 0.22 +
      soilMoisture * 0.24 +
      datumEquatorMoisture * 0.24 +
      wetlandInfluence * 0.16 +
      coastalInfluence * 0.10,
      0,
      1
    );

    var orographicCloudBias = clamp(
      mountainLift * 0.70 +
      pressureLift * 0.18,
      0,
      1
    );

    var stormTrackBias = clamp(
      datumStorm * 0.44 +
      coastalInfluence * 0.18 +
      mountainLift * 0.14 +
      thermalGradient * 0.18 +
      datumCoriolis * 0.10,
      0,
      1
    );

    var ecosystemMoistureReturn = clamp(
      forestMoistureReturn * 0.44 +
      wetlandInfluence * 0.32 +
      soilMoisture * 0.20,
      0,
      1
    );

    var forcingStrength = clamp(
      gratitude * 0.22 +
      landRatio * 0.18 +
      coastalInfluence * 0.14 +
      mountainLift * 0.16 +
      basinRetention * 0.12 +
      stormTrackBias * 0.10 +
      datumReady * 0.08,
      0,
      1
    );

    var sampleValue = {
      contract: CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      family: FAMILY,
      file: FILE,

      longitude: lon,
      latitude: lat,
      time: t,

      continent: GRATITUDE_CENTER.name,
      continentKey: "gratitude",
      gratitudeInfluence: gratitude,
      gratitudeContinentOnly: true,

      datumConsumed: datumReady,
      datumReady: datumReady,
      datum: datum,

      hemisphere: datum.hemisphere,
      latitudeBand: datum.latitudeBand,
      longitudeBand: datum.longitudeBand,
      climateBelt: datum.climateBelt,
      coriolisDirection: datum.coriolisDirection,
      coriolisStrength: datum.coriolisStrength,
      stormTrackLatitudeBias: datum.stormTrackLatitudeBias,
      equatorMoistureBias: datum.equatorMoistureBias,
      polarResonanceStrength: datum.polarResonanceStrength,
      hemisphereSeasonBias: datum.hemisphereSeasonBias,
      groundLevelDatumReadiness: datum.groundLevelDatumReadiness,

      elevation: elevation,
      landRatio: landRatio,
      oceanRatio: oceanRatio,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: clamp(basinRetention * 0.48 + riverInfluence * 0.20, 0, 1),
      basinRetention: basinRetention,
      riverInfluence: riverInfluence,
      lakeInfluence: lakeInfluence,
      wetlandInfluence: wetlandInfluence,
      forestMoistureReturn: forestMoistureReturn,
      desertDryness: desertDryness,
      polarInfluence: polarInfluence,
      soilMoisture: soilMoisture,
      evaporationPotential: evaporationPotential,
      surfaceHeat: surfaceHeat,
      thermalGradient: thermalGradient,
      pressureLift: pressureLift,
      convectionPotential: convectionPotential,
      orographicCloudBias: orographicCloudBias,
      stormTrackBias: stormTrackBias,
      ecosystemMoistureReturn: ecosystemMoistureReturn,

      terrainClass: "",
      ecosystemClass: "",
      hydrologyClass: "",

      forcingStrength: forcingStrength,
      forcingFieldReady: true,

      terrainUsesDatumField: true,
      terrainClimatePlacementActive: true,
      trueNorthAuthorityInherited: datumReady,
      trueSouthAuthorityInherited: datumReady,
      equatorAuthorityInherited: datumReady,
      climateBeltAuthorityInherited: datumReady,
      polarResonanceAuthorityInherited: datumReady,

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

    sampleValue.terrainClass = classifyTerrain(sampleValue);
    sampleValue.ecosystemClass = classifyEcosystem(sampleValue);
    sampleValue.hydrologyClass = classifyHydrology(sampleValue);

    state.fieldReady = true;
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
      elevation: 0,
      landRatio: 0,
      oceanRatio: 0,
      coastalInfluence: 0,
      mountainLift: 0,
      basinRetention: 0,
      riverInfluence: 0,
      lakeInfluence: 0,
      wetlandInfluence: 0,
      forestMoistureReturn: 0,
      desertDryness: 0,
      polarInfluence: 0,
      soilMoisture: 0,
      evaporationPotential: 0,
      surfaceHeat: 0,
      thermalGradient: 0,
      pressureLift: 0,
      convectionPotential: 0,
      orographicCloudBias: 0,
      stormTrackBias: 0,
      ecosystemMoistureReturn: 0,
      forcingStrength: 0,
      datumConsumed: 0
    };

    var terrainClassCounts = {};
    var ecosystemClassCounts = {};
    var hydrologyClassCounts = {};
    var hemisphereCounts = {};
    var climateBeltCounts = {};

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

          continent: sampled.continent,
          continentKey: sampled.continentKey,
          gratitudeInfluence: sampled.gratitudeInfluence,

          datumConsumed: sampled.datumConsumed,
          hemisphere: sampled.hemisphere,
          latitudeBand: sampled.latitudeBand,
          longitudeBand: sampled.longitudeBand,
          climateBelt: sampled.climateBelt,
          coriolisDirection: sampled.coriolisDirection,
          coriolisStrength: sampled.coriolisStrength,
          stormTrackLatitudeBias: sampled.stormTrackLatitudeBias,
          equatorMoistureBias: sampled.equatorMoistureBias,
          polarResonanceStrength: sampled.polarResonanceStrength,
          hemisphereSeasonBias: sampled.hemisphereSeasonBias,
          groundLevelDatumReadiness: sampled.groundLevelDatumReadiness,

          elevation: sampled.elevation,
          landRatio: sampled.landRatio,
          oceanRatio: sampled.oceanRatio,
          coastalInfluence: sampled.coastalInfluence,
          mountainLift: sampled.mountainLift,
          basinRetention: sampled.basinRetention,
          riverInfluence: sampled.riverInfluence,
          lakeInfluence: sampled.lakeInfluence,
          wetlandInfluence: sampled.wetlandInfluence,
          forestMoistureReturn: sampled.forestMoistureReturn,
          desertDryness: sampled.desertDryness,
          polarInfluence: sampled.polarInfluence,
          soilMoisture: sampled.soilMoisture,
          evaporationPotential: sampled.evaporationPotential,
          surfaceHeat: sampled.surfaceHeat,
          thermalGradient: sampled.thermalGradient,
          pressureLift: sampled.pressureLift,
          convectionPotential: sampled.convectionPotential,
          orographicCloudBias: sampled.orographicCloudBias,
          stormTrackBias: sampled.stormTrackBias,
          ecosystemMoistureReturn: sampled.ecosystemMoistureReturn,
          forcingStrength: sampled.forcingStrength,

          terrainClass: sampled.terrainClass,
          ecosystemClass: sampled.ecosystemClass,
          hydrologyClass: sampled.hydrologyClass
        };

        cells.push(cell);

        totals.elevation += cell.elevation;
        totals.landRatio += cell.landRatio;
        totals.oceanRatio += cell.oceanRatio;
        totals.coastalInfluence += cell.coastalInfluence;
        totals.mountainLift += cell.mountainLift;
        totals.basinRetention += cell.basinRetention;
        totals.riverInfluence += cell.riverInfluence;
        totals.lakeInfluence += cell.lakeInfluence;
        totals.wetlandInfluence += cell.wetlandInfluence;
        totals.forestMoistureReturn += cell.forestMoistureReturn;
        totals.desertDryness += cell.desertDryness;
        totals.polarInfluence += cell.polarInfluence;
        totals.soilMoisture += cell.soilMoisture;
        totals.evaporationPotential += cell.evaporationPotential;
        totals.surfaceHeat += cell.surfaceHeat;
        totals.thermalGradient += cell.thermalGradient;
        totals.pressureLift += cell.pressureLift;
        totals.convectionPotential += cell.convectionPotential;
        totals.orographicCloudBias += cell.orographicCloudBias;
        totals.stormTrackBias += cell.stormTrackBias;
        totals.ecosystemMoistureReturn += cell.ecosystemMoistureReturn;
        totals.forcingStrength += cell.forcingStrength;
        totals.datumConsumed += cell.datumConsumed ? 1 : 0;

        increment(terrainClassCounts, cell.terrainClass);
        increment(ecosystemClassCounts, cell.ecosystemClass);
        increment(hydrologyClassCounts, cell.hydrologyClass);
        increment(hemisphereCounts, cell.hemisphere);
        increment(climateBeltCounts, cell.climateBelt);
      }
    }

    var count = cells.length || 1;

    var summary = {
      elevationAverage: totals.elevation / count,
      landRatioAverage: totals.landRatio / count,
      oceanRatioAverage: totals.oceanRatio / count,
      coastalInfluenceAverage: totals.coastalInfluence / count,
      mountainLiftAverage: totals.mountainLift / count,
      basinRetentionAverage: totals.basinRetention / count,
      riverInfluenceAverage: totals.riverInfluence / count,
      lakeInfluenceAverage: totals.lakeInfluence / count,
      wetlandInfluenceAverage: totals.wetlandInfluence / count,
      forestMoistureReturnAverage: totals.forestMoistureReturn / count,
      desertDrynessAverage: totals.desertDryness / count,
      polarInfluenceAverage: totals.polarInfluence / count,
      soilMoistureAverage: totals.soilMoisture / count,
      evaporationPotentialAverage: totals.evaporationPotential / count,
      surfaceHeatAverage: totals.surfaceHeat / count,
      thermalGradientAverage: totals.thermalGradient / count,
      pressureLiftAverage: totals.pressureLift / count,
      convectionPotentialAverage: totals.convectionPotential / count,
      orographicCloudBiasAverage: totals.orographicCloudBias / count,
      stormTrackBiasAverage: totals.stormTrackBias / count,
      ecosystemMoistureReturnAverage: totals.ecosystemMoistureReturn / count,
      forcingStrengthAverage: totals.forcingStrength / count,
      datumConsumedRatio: totals.datumConsumed / count
    };

    var field = {
      contract: CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      family: FAMILY,
      file: FILE,

      frameIndex: frameIndex,
      renderTime: renderTime,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      cellCount: cells.length,

      continent: GRATITUDE_CENTER.name,
      continentKey: "gratitude",
      gratitudeContinentOnly: true,

      cells: cells,
      summary: summary,
      terrainClassCounts: terrainClassCounts,
      ecosystemClassCounts: ecosystemClassCounts,
      hydrologyClassCounts: hydrologyClassCounts,
      hemisphereCounts: hemisphereCounts,
      climateBeltCounts: climateBeltCounts,

      forcingFieldReady: true,
      fieldReady: true,
      datumConsumed: summary.datumConsumedRatio > 0,
      datumReady: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),

      terrainUsesDatumField: true,
      terrainClimatePlacementActive: true,
      trueNorthAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      trueSouthAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      equatorAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      climateBeltAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),
      polarResonanceAuthorityInherited: Boolean(frame.datumReady || summary.datumConsumedRatio > 0),

      terrainProducesMoistureForcing: true,
      terrainProducesSurfaceForcing: true,
      terrainProducesCloudForcing: false,
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

    state.fieldReady = true;
    state.datumConsumed = field.datumConsumed;
    state.lastFrameIndex = frameIndex;
    state.lastRenderTime = renderTime;
    state.lastField = field;

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM_FIELD = field;

    return field;
  }

  function status() {
    return {
      contract: CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      fieldReady: state.fieldReady,
      datumConsumed: state.datumConsumed,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      continent: GRATITUDE_CENTER.name,
      continentKey: "gratitude",
      gratitudeContinentOnly: true,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,

      terrainEcosystemForcingFieldChildReady: true,
      terrainDatumConsumerReady: true,
      terrainUsesDatumField: true,
      terrainClimatePlacementActive: true,
      trueNorthAuthorityInherited: state.datumConsumed,
      trueSouthAuthorityInherited: state.datumConsumed,
      equatorAuthorityInherited: state.datumConsumed,
      climateBeltAuthorityInherited: state.datumConsumed,
      polarResonanceAuthorityInherited: state.datumConsumed,

      terrainProducesMoistureForcing: true,
      terrainProducesSurfaceForcing: true,
      terrainProducesCloudForcing: false,
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

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_ERROR = {
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
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      family: FAMILY,
      file: FILE,

      sample: sample,
      getField: getField,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM = api;
    window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM = api;
    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_BOOT = {
      contract: CONTRACT,
      datumConsumerContract: DATUM_CONSUMER_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      standard: STANDARD,
      terrainStandard: TERRAIN_STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia terrain/ecosystem forcing child evaluated with datum consumer capability. Terrain now reads planetary datum when available and preserves data-only authority."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.fieldReady = true;
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
