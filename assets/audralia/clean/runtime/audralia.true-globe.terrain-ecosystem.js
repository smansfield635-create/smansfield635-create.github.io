// /assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1
//
// Family:
// /assets/audralia/clean/runtime/
//
// Purpose:
// - Create Audralia's terrain/ecosystem forcing parent.
// - Return planetary forcing data only.
// - Prepare land/ocean contrast, elevation, hydrology, ecosystem moisture return,
//   mountain lift, desert dryness, polar influence, and storm-track bias.
// - Respect 16 radial nodes × 16 Fibonacci bands = 256 diagnostic seats.
// - Do not draw.
// - Do not create canvas.
// - Do not own runtime motion.
// - Do not own HTML.
// - Do not own route JS.
// - Do not paint clouds directly.
// - Preserve Lattice View protection.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_TERRAIN_ECOSYSTEM_FORCING_FIELD_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STANDARD_v1";
  var PREWRITE = "AUDRALIA_G2_TERRAIN_ECOSYSTEM_FORCING_FIELD_STRATEGIC_CODE_PREWRITE_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.terrain-ecosystem.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var FIBONACCI_SEQUENCE = [
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ];

  var CONTINENT_SEEDS = [
    { lon: -2.42, lat: 0.42, rx: 0.92, ry: 0.55, strength: 1.00, lift: 0.56, ecosystem: "forest" },
    { lon: -0.88, lat: -0.18, rx: 0.78, ry: 0.48, strength: 0.92, lift: 0.34, ecosystem: "grassland" },
    { lon: 0.62, lat: 0.28, rx: 0.86, ry: 0.52, strength: 0.96, lift: 0.68, ecosystem: "mountain_ecosystem" },
    { lon: 1.88, lat: -0.46, rx: 0.74, ry: 0.42, strength: 0.84, lift: 0.28, ecosystem: "dryland" },
    { lon: 2.88, lat: 1.10, rx: 0.58, ry: 0.28, strength: 0.62, lift: 0.22, ecosystem: "polar_zone" }
  ];

  var RIDGE_SEEDS = [
    { lon: -2.06, lat: 0.18, width: 0.18, length: 1.05, angle: 0.92, lift: 0.92 },
    { lon: 0.38, lat: 0.34, width: 0.15, length: 0.94, angle: -0.72, lift: 1.00 },
    { lon: 1.74, lat: -0.52, width: 0.13, length: 0.78, angle: 0.42, lift: 0.68 },
    { lon: -0.58, lat: -0.26, width: 0.12, length: 0.82, angle: -0.28, lift: 0.54 }
  ];

  var BASIN_SEEDS = [
    { lon: -1.40, lat: 0.08, radius: 0.42, retention: 0.82 },
    { lon: 0.98, lat: -0.12, radius: 0.36, retention: 0.76 },
    { lon: 2.26, lat: -0.66, radius: 0.34, retention: 0.52 },
    { lon: -2.74, lat: 0.58, radius: 0.30, retention: 0.64 }
  ];

  var RIVER_SEEDS = [
    { sourceLon: -2.10, sourceLat: 0.44, mouthLon: -2.66, mouthLat: -0.08, strength: 0.84 },
    { sourceLon: 0.42, sourceLat: 0.48, mouthLon: 1.06, mouthLat: -0.22, strength: 0.92 },
    { sourceLon: -0.44, sourceLat: -0.02, mouthLon: -1.08, mouthLat: -0.44, strength: 0.66 },
    { sourceLon: 1.76, sourceLat: -0.34, mouthLon: 2.34, mouthLat: -0.70, strength: 0.58 }
  ];

  var state = {
    initialized: false,
    fieldReady: false,
    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastSummary: null,
    lastSeatSummary: null,
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
        x * freq + time * (0.035 + i * 0.007),
        y * freq - time * (0.028 + i * 0.006),
        salt + i * 19.13
      ) * amp;

      norm += amp;
      amp *= 0.52;
      freq *= 2.02;
    }

    return norm ? total / norm : 0;
  }

  function greatCircleDistance(lonA, latA, lonB, latB) {
    var dLon = wrapLongitude(lonA - lonB);
    var dLat = latA - latB;
    var sinLat = Math.sin(dLat / 2);
    var sinLon = Math.sin(dLon / 2);
    var h = sinLat * sinLat + Math.cos(latA) * Math.cos(latB) * sinLon * sinLon;
    return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  }

  function ellipticalInfluence(lon, lat, seed) {
    var dLon = wrapLongitude(lon - seed.lon);
    var dLat = lat - seed.lat;
    var rx = Math.max(0.001, seed.rx);
    var ry = Math.max(0.001, seed.ry);
    var value = Math.exp(-((dLon * dLon) / (rx * rx) + (dLat * dLat) / (ry * ry)));
    return clamp(value * seed.strength, 0, 1);
  }

  function ridgeInfluence(lon, lat, ridge) {
    var dLon = wrapLongitude(lon - ridge.lon);
    var dLat = lat - ridge.lat;
    var ca = Math.cos(ridge.angle);
    var sa = Math.sin(ridge.angle);
    var along = dLon * ca + dLat * sa;
    var across = -dLon * sa + dLat * ca;

    var lengthFalloff = Math.exp(-(along * along) / Math.max(0.001, ridge.length * ridge.length));
    var widthFalloff = Math.exp(-(across * across) / Math.max(0.001, ridge.width * ridge.width));

    return clamp(lengthFalloff * widthFalloff * ridge.lift, 0, 1);
  }

  function riverInfluence(lon, lat, river) {
    var ax = river.sourceLon;
    var ay = river.sourceLat;
    var bx = river.mouthLon;
    var by = river.mouthLat;

    var px = lon;
    var py = lat;

    var abx = wrapLongitude(bx - ax);
    var aby = by - ay;
    var apx = wrapLongitude(px - ax);
    var apy = py - ay;

    var abLen2 = abx * abx + aby * aby || 1;
    var t = clamp((apx * abx + apy * aby) / abLen2, 0, 1);
    var cx = ax + abx * t;
    var cy = ay + aby * t;

    var distance = Math.sqrt(Math.pow(wrapLongitude(px - cx), 2) + Math.pow(py - cy, 2));
    var channel = Math.exp(-(distance * distance) / (0.045 * 0.045));

    return clamp(channel * river.strength * (0.55 + 0.45 * t), 0, 1);
  }

  function classifyTerrain(elevation, land, coastalInfluence, mountainLift, valleyPooling, basinRetention, iceInfluence) {
    if (iceInfluence > 0.66) return "polar_ice";
    if (land < 0.34 && elevation < -0.36) return "deep_ocean";
    if (land < 0.48 && elevation < -0.08) return "shallow_shelf";
    if (coastalInfluence > 0.62) return "coast";
    if (mountainLift > 0.68 || elevation > 0.66) return "mountain";
    if (mountainLift > 0.42 || elevation > 0.42) return "ridge";
    if (basinRetention > 0.58) return "basin";
    if (valleyPooling > 0.50) return "valley";
    if (elevation > 0.22) return "highland";
    if (elevation > 0.05) return "plateau";
    return "lowland";
  }

  function classifyHydrology(land, coastalInfluence, riverInfluenceValue, lakeInfluence, wetlandInfluence, mountainLift, valleyPooling, desertDryness, polarInfluence) {
    if (land < 0.32) return "ocean_source";
    if (polarInfluence > 0.70) return "polar_storage";
    if (mountainLift > 0.68) return "mountain_snowmelt";
    if (coastalInfluence > 0.64) return "coastal_evaporation";
    if (riverInfluenceValue > 0.46) return "river_corridor";
    if (lakeInfluence > 0.42) return "lake_basin";
    if (wetlandInfluence > 0.44) return "wetland_retention";
    if (valleyPooling > 0.46) return "valley_collection";
    if (desertDryness > 0.62) return "dry_drainage";
    return "surface_runoff";
  }

  function classifyEcosystem(land, terrainClass, hydrologyClass, forestMoistureReturn, wetlandInfluence, desertDryness, polarInfluence, surfaceHeat, elevation) {
    if (land < 0.32) return "open_ocean";
    if (polarInfluence > 0.70 || terrainClass === "polar_ice") return "polar_zone";
    if (terrainClass === "mountain" && elevation > 0.72) return "alpine_ice";
    if (terrainClass === "mountain" || terrainClass === "ridge") return "mountain_ecosystem";
    if (hydrologyClass === "coastal_evaporation" && wetlandInfluence > 0.34) return "coastal_wetland";
    if (hydrologyClass === "river_corridor") return "river_delta";
    if (hydrologyClass === "lake_basin") return "lake_region";
    if (hydrologyClass === "wetland_retention") return "basin_wetland";
    if (desertDryness > 0.68 || surfaceHeat > 0.78) return "desert";
    if (desertDryness > 0.46) return "dryland";
    if (forestMoistureReturn > 0.54) return "forest";
    return "grassland";
  }

  function continentEcosystemHint(lon, lat) {
    var best = "";
    var bestValue = 0;

    for (var i = 0; i < CONTINENT_SEEDS.length; i += 1) {
      var seed = CONTINENT_SEEDS[i];
      var value = ellipticalInfluence(lon, lat, seed);

      if (value > bestValue) {
        bestValue = value;
        best = seed.ecosystem;
      }
    }

    return {
      ecosystem: best,
      strength: bestValue
    };
  }

  function sample(longitude, latitude, time) {
    var lon = wrapLongitude(longitude);
    var lat = clamp(finite(latitude, 0), -Math.PI / 2, Math.PI / 2);
    var t = finite(time, 0);

    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;

    var continentality = 0;
    var continentLift = 0;

    for (var i = 0; i < CONTINENT_SEEDS.length; i += 1) {
      var continent = CONTINENT_SEEDS[i];
      var c = ellipticalInfluence(lon, lat, continent);
      continentality = Math.max(continentality, c);
      continentLift += c * continent.lift;
    }

    continentality = clamp(continentality, 0, 1);
    continentLift = clamp(continentLift, 0, 1);

    var ridgeLift = 0;
    for (var r = 0; r < RIDGE_SEEDS.length; r += 1) {
      ridgeLift = Math.max(ridgeLift, ridgeInfluence(lon, lat, RIDGE_SEEDS[r]));
    }

    var basinRetention = 0;
    for (var b = 0; b < BASIN_SEEDS.length; b += 1) {
      var basin = BASIN_SEEDS[b];
      var d = greatCircleDistance(lon, lat, basin.lon, basin.lat);
      basinRetention = Math.max(basinRetention, Math.exp(-(d * d) / Math.max(0.001, basin.radius * basin.radius)) * basin.retention);
    }

    basinRetention = clamp(basinRetention, 0, 1);

    var river = 0;
    for (var q = 0; q < RIVER_SEEDS.length; q += 1) {
      river = Math.max(river, riverInfluence(lon, lat, RIVER_SEEDS[q]));
    }

    var coarseNoise = fbm2(nx * 2.4, ny * 2.1, t * 0.001, 11.2);
    var detailNoise = fbm2(nx * 7.2 + 1.7, ny * 5.8 - 0.4, t * 0.001, 41.9);
    var shelfNoise = fbm2(nx * 4.2 - 0.6, ny * 3.2 + 0.8, 0, 74.5);

    var polarAbs = Math.abs(lat) / (Math.PI / 2);
    var polarInfluence = smoothstep(0.68, 0.96, polarAbs);
    var equatorInfluence = 1 - smoothstep(0.08, 0.52, Math.abs(lat));

    var land = clamp(continentality + (coarseNoise - 0.55) * 0.28 - polarInfluence * 0.10, 0, 1);
    var ocean = 1 - land;

    var shelf = smoothstep(0.26, 0.54, land) * (1 - smoothstep(0.54, 0.72, land));
    var coastalInfluence = clamp(shelf * 0.88 + (0.5 - Math.abs(land - 0.5)) * 0.34 + shelfNoise * 0.12, 0, 1);

    var mountainLift = clamp(ridgeLift * 0.82 + continentLift * 0.34 + detailNoise * 0.12, 0, 1);
    var valleyPooling = clamp((1 - mountainLift) * basinRetention * 0.82 + river * 0.22, 0, 1);

    var lakeInfluence = clamp(basinRetention * (0.34 + river * 0.42) * land, 0, 1);
    var wetlandInfluence = clamp((coastalInfluence * 0.34 + basinRetention * 0.44 + river * 0.52) * land * (1 - polarInfluence * 0.52), 0, 1);

    var elevation =
      -0.58 * ocean +
      land * (0.08 + continentality * 0.22 + continentLift * 0.24) +
      mountainLift * 0.58 -
      basinRetention * 0.18 +
      (detailNoise - 0.5) * 0.16;

    elevation = clamp(elevation, -1, 1);

    var surfaceHeat = clamp(
      equatorInfluence * 0.72 +
      land * 0.16 +
      desertDrynessPreview(lat, land, wetlandInfluence, polarInfluence) * 0.18 -
      polarInfluence * 0.62 -
      mountainLift * 0.12,
      0,
      1
    );

    var iceInfluence = clamp(polarInfluence * (0.52 + ocean * 0.22 + mountainLift * 0.30), 0, 1);

    var forestMoistureReturn = clamp(
      land *
      (0.24 + wetlandInfluence * 0.42 + river * 0.22 + coastalInfluence * 0.16) *
      (1 - polarInfluence * 0.60) *
      (1 - Math.max(0, surfaceHeat - 0.72) * 0.88),
      0,
      1
    );

    var desertDryness = clamp(
      land *
      (surfaceHeat * 0.58 + (1 - wetlandInfluence) * 0.28 + (1 - river) * 0.20) *
      (1 - coastalInfluence * 0.36) *
      (1 - forestMoistureReturn * 0.48) *
      (1 - polarInfluence * 0.72),
      0,
      1
    );

    var soilMoisture = clamp(
      ocean * 0.18 +
      coastalInfluence * 0.26 +
      wetlandInfluence * 0.42 +
      river * 0.26 +
      lakeInfluence * 0.24 +
      forestMoistureReturn * 0.34 -
      desertDryness * 0.34,
      0,
      1
    );

    var evaporationPotential = clamp(
      ocean * 0.58 +
      coastalInfluence * 0.22 +
      lakeInfluence * 0.30 +
      wetlandInfluence * 0.34 +
      soilMoisture * 0.22 +
      surfaceHeat * 0.20 -
      polarInfluence * 0.48,
      0,
      1
    );

    var thermalGradient = clamp(
      Math.abs(surfaceHeat - polarInfluence * 0.72) * 0.62 +
      coastalInfluence * 0.20 +
      mountainLift * 0.18,
      0,
      1
    );

    var pressureLift = clamp(
      mountainLift * 0.46 +
      coastalInfluence * 0.22 +
      thermalGradient * 0.28 +
      valleyPooling * 0.12,
      0,
      1
    );

    var convectionPotential = clamp(
      evaporationPotential * 0.44 +
      surfaceHeat * 0.28 +
      forestMoistureReturn * 0.18 +
      wetlandInfluence * 0.22 +
      pressureLift * 0.20 -
      desertDryness * 0.26,
      0,
      1
    );

    var orographicCloudBias = clamp(mountainLift * (0.42 + soilMoisture * 0.40 + coastalInfluence * 0.16), 0, 1);

    var temperateBand = smoothstep(0.18, 0.46, polarAbs) * (1 - smoothstep(0.58, 0.86, polarAbs));
    var stormTrackBias = clamp(
      temperateBand * 0.44 +
      coastalInfluence * 0.20 +
      thermalGradient * 0.22 +
      pressureLift * 0.20 +
      ocean * 0.12,
      0,
      1
    );

    var forcingStrength = clamp(
      evaporationPotential * 0.20 +
      pressureLift * 0.18 +
      convectionPotential * 0.22 +
      orographicCloudBias * 0.18 +
      stormTrackBias * 0.16 +
      forestMoistureReturn * 0.06,
      0,
      1
    );

    var terrainClass = classifyTerrain(
      elevation,
      land,
      coastalInfluence,
      mountainLift,
      valleyPooling,
      basinRetention,
      iceInfluence
    );

    var hydrologyClass = classifyHydrology(
      land,
      coastalInfluence,
      river,
      lakeInfluence,
      wetlandInfluence,
      mountainLift,
      valleyPooling,
      desertDryness,
      polarInfluence
    );

    var ecosystemHint = continentEcosystemHint(lon, lat);

    var ecosystemClass = classifyEcosystem(
      land,
      terrainClass,
      hydrologyClass,
      forestMoistureReturn + ecosystemHint.strength * 0.12,
      wetlandInfluence,
      desertDryness,
      polarInfluence,
      surfaceHeat,
      elevation
    );

    return {
      longitude: lon,
      latitude: lat,
      time: t,

      elevation: elevation,
      landRatio: land,
      oceanRatio: ocean,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: valleyPooling,
      basinRetention: basinRetention,

      riverInfluence: river,
      lakeInfluence: lakeInfluence,
      wetlandInfluence: wetlandInfluence,

      forestMoistureReturn: forestMoistureReturn,
      grasslandStability: clamp(land * (1 - desertDryness) * (1 - wetlandInfluence * 0.42) * (1 - polarInfluence * 0.50), 0, 1),
      desertDryness: desertDryness,
      iceInfluence: iceInfluence,
      polarInfluence: polarInfluence,

      soilMoisture: soilMoisture,
      evaporationPotential: evaporationPotential,
      surfaceHeat: surfaceHeat,
      thermalGradient: thermalGradient,
      pressureLift: pressureLift,
      convectionPotential: convectionPotential,
      orographicCloudBias: orographicCloudBias,
      stormTrackBias: stormTrackBias,
      ecosystemMoistureReturn: clamp(forestMoistureReturn + wetlandInfluence * 0.34 + river * 0.18, 0, 1),

      terrainClass: terrainClass,
      ecosystemClass: ecosystemClass,
      hydrologyClass: hydrologyClass,
      continentEcosystemHint: ecosystemHint.ecosystem,
      forcingStrength: forcingStrength,

      forcingFieldReady: true,
      cloudsShouldReadThisViaMoisture: true,
      directCloudPaint: false,
      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      visible256Grid: false
    };
  }

  function desertDrynessPreview(lat, land, wetlandInfluence, polarInfluence) {
    var equatorInfluence = 1 - smoothstep(0.08, 0.52, Math.abs(lat));
    return clamp(
      land *
      (equatorInfluence * 0.46 + (1 - wetlandInfluence) * 0.34) *
      (1 - polarInfluence),
      0,
      1
    );
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

  function summarizeSeat(sampleValue, radialIndex, bandIndex) {
    return {
      seatIndex: bandIndex * RADIAL_NODES + radialIndex,
      radialIndex: radialIndex,
      bandIndex: bandIndex,
      fibonacci: FIBONACCI_SEQUENCE[bandIndex],
      longitude: sampleValue.longitude,
      latitude: sampleValue.latitude,

      elevation: sampleValue.elevation,
      landRatio: sampleValue.landRatio,
      oceanRatio: sampleValue.oceanRatio,
      coastalInfluence: sampleValue.coastalInfluence,
      mountainLift: sampleValue.mountainLift,
      hydrologyForcing: clamp(
        sampleValue.riverInfluence +
        sampleValue.lakeInfluence +
        sampleValue.wetlandInfluence +
        sampleValue.evaporationPotential,
        0,
        1
      ),
      ecosystemMoistureReturn: sampleValue.ecosystemMoistureReturn,
      desertDryness: sampleValue.desertDryness,
      polarInfluence: sampleValue.polarInfluence,
      orographicCloudBias: sampleValue.orographicCloudBias,
      stormTrackBias: sampleValue.stormTrackBias,
      forcingStrength: sampleValue.forcingStrength,

      terrainClass: sampleValue.terrainClass,
      ecosystemClass: sampleValue.ecosystemClass,
      hydrologyClass: sampleValue.hydrologyClass
    };
  }

  function getField(frame) {
    frame = frame || {};

    var renderTime = finite(frame.renderTime, 0);
    var frameIndex = finite(frame.frameIndex, 0);

    var seats = [];
    var totals = {
      elevation: 0,
      landRatio: 0,
      oceanRatio: 0,
      coastalInfluence: 0,
      mountainLift: 0,
      hydrologyForcing: 0,
      ecosystemMoistureReturn: 0,
      desertDryness: 0,
      polarInfluence: 0,
      orographicCloudBias: 0,
      stormTrackBias: 0,
      forcingStrength: 0
    };

    var terrainCounts = {};
    var ecosystemCounts = {};
    var hydrologyCounts = {};

    for (var bandIndex = 0; bandIndex < FIBONACCI_BANDS; bandIndex += 1) {
      for (var radialIndex = 0; radialIndex < RADIAL_NODES; radialIndex += 1) {
        var ll = seatLonLat(radialIndex, bandIndex);
        var sampled = sample(ll.longitude, ll.latitude, renderTime);
        var seat = summarizeSeat(sampled, radialIndex, bandIndex);

        seats.push(seat);

        totals.elevation += seat.elevation;
        totals.landRatio += seat.landRatio;
        totals.oceanRatio += seat.oceanRatio;
        totals.coastalInfluence += seat.coastalInfluence;
        totals.mountainLift += seat.mountainLift;
        totals.hydrologyForcing += seat.hydrologyForcing;
        totals.ecosystemMoistureReturn += seat.ecosystemMoistureReturn;
        totals.desertDryness += seat.desertDryness;
        totals.polarInfluence += seat.polarInfluence;
        totals.orographicCloudBias += seat.orographicCloudBias;
        totals.stormTrackBias += seat.stormTrackBias;
        totals.forcingStrength += seat.forcingStrength;

        terrainCounts[seat.terrainClass] = (terrainCounts[seat.terrainClass] || 0) + 1;
        ecosystemCounts[seat.ecosystemClass] = (ecosystemCounts[seat.ecosystemClass] || 0) + 1;
        hydrologyCounts[seat.hydrologyClass] = (hydrologyCounts[seat.hydrologyClass] || 0) + 1;
      }
    }

    var count = seats.length || 1;

    var summary = {
      elevationAverage: totals.elevation / count,
      landRatioAverage: totals.landRatio / count,
      oceanRatioAverage: totals.oceanRatio / count,
      coastalInfluenceAverage: totals.coastalInfluence / count,
      mountainLiftAverage: totals.mountainLift / count,
      hydrologyForcingAverage: totals.hydrologyForcing / count,
      ecosystemMoistureReturnAverage: totals.ecosystemMoistureReturn / count,
      desertDrynessAverage: totals.desertDryness / count,
      polarInfluenceAverage: totals.polarInfluence / count,
      orographicCloudBiasAverage: totals.orographicCloudBias / count,
      stormTrackBiasAverage: totals.stormTrackBias / count,
      forcingStrengthAverage: totals.forcingStrength / count
    };

    var field = {
      contract: CONTRACT,
      standard: STANDARD,
      prewrite: PREWRITE,
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

      terrainEcosystemChildReady: true,
      forcingFieldReady: true,
      sampleApiReady: true,
      getFieldApiReady: true,
      statusApiReady: true,
      seat256SummaryReady: seats.length === LATTICE_STATES,

      elevationFieldActive: true,
      landOceanForcingActive: true,
      coastalForcingActive: true,
      mountainLiftActive: true,
      hydrologyForcingActive: true,
      ecosystemMoistureReturnActive: true,
      desertDrynessActive: true,
      polarInfluenceActive: true,

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
      visible256Grid: false
    };

    state.fieldReady = true;
    state.lastFrameIndex = frameIndex;
    state.lastRenderTime = renderTime;
    state.lastSummary = summary;
    state.lastSeatSummary = seats;

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_FIELD = field;
    window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM_FIELD = field;

    return field;
  }

  function status() {
    return {
      contract: CONTRACT,
      standard: STANDARD,
      prewrite: PREWRITE,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      fieldReady: state.fieldReady,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastSummary: state.lastSummary,

      terrainEcosystemChildReady: true,
      forcingFieldReady: true,
      sampleApiReady: true,
      getFieldApiReady: true,
      statusApiReady: true,
      seat256SummaryReady: true,

      elevationFieldActive: true,
      landOceanForcingActive: true,
      coastalForcingActive: true,
      mountainLiftActive: true,
      hydrologyForcingActive: true,
      ecosystemMoistureReturnActive: true,
      desertDrynessActive: true,
      polarInfluenceActive: true,

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

    window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM_ERROR = {
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
      prewrite: PREWRITE,
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
      standard: STANDARD,
      prewrite: PREWRITE,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia terrain/ecosystem forcing child evaluated. Field APIs are available; no drawing authority claimed."
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
