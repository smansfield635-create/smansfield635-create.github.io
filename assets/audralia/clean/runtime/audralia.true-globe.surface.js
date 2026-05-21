// /assets/audralia/clean/runtime/audralia.true-globe.surface.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1
//
// Family:
// /assets/audralia/clean/runtime/
//
// Purpose:
// - Create Audralia's first visible surface renderer child.
// - Render the Gratitude continent only.
// - Consume runtime frame, terrain/ecosystem forcing, and moisture interpretation.
// - Draw visible surface material beneath clouds.
// - Preserve hydrology-powered cloud baseline.
// - Preserve Lattice View protection.
// - Do not create canvas.
// - Do not own runtime motion.
// - Do not own route JS.
// - Do not own HTML.
// - Do not draw clouds.
// - Do not expose all continents.
// - No generated image. No GraphicBox. No flat projection. No static sticker.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_TRUE_RUNTIME_GRATITUDE_CONTINENT_SURFACE_RENDERER_CHILD_TNT_v1";
  var STANDARD = "AUDRALIA_G2_GRATITUDE_CONTINENT_SURFACE_VISUALIZATION_SPEC_OPS_v1";
  var FAMILY = "/assets/audralia/clean/runtime/";
  var FILE = "/assets/audralia/clean/runtime/audralia.true-globe.surface.js";

  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_STATES = 256;
  var TAU = Math.PI * 2;

  var GRATITUDE_CENTER = {
    longitude: -2.42,
    latitude: 0.42,
    radiusX: 0.92,
    radiusY: 0.55,
    name: "Gratitude Continent"
  };

  var SURFACE_COLUMNS = 72;
  var SURFACE_ROWS = 36;

  var state = {
    initialized: false,
    surfaceRendererReady: false,
    lastFrameIndex: 0,
    lastRenderTime: 0,
    lastSurfaceCellCount: 0,
    lastVisibleCellCount: 0,
    lastGratitudeCellCount: 0,
    lastHydrologyHintCount: 0,
    lastLayer: null,
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
        salt + i * 19.13
      ) * amp;

      norm += amp;
      amp *= 0.52;
      freq *= 2.02;
    }

    return norm ? total / norm : 0;
  }

  function getTerrainApi() {
    return window.AUDRALIA_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      window.AUDRALIA_G2_TRUE_GLOBE_TERRAIN_ECOSYSTEM ||
      null;
  }

  function getMoistureApi() {
    return window.AUDRALIA_TRUE_GLOBE_MOISTURE ||
      window.AUDRALIA_G2_TRUE_GLOBE_MOISTURE ||
      null;
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
      frontFacing: rotated.z >= -0.035,
      visibility: rotated.z >= 0 ? 1 : clamp(0.08 + (rotated.z + 1) * 0.08, 0, 0.12),
      limbFactor: smoothstep(0.76, 1.07, limb),
      sphere: sphere,
      rotated: rotated
    };
  }

  function gratitudeInfluence(lon, lat) {
    var dLon = wrapLongitude(lon - GRATITUDE_CENTER.longitude);
    var dLat = lat - GRATITUDE_CENTER.latitude;

    var nx = dLon / GRATITUDE_CENTER.radiusX;
    var ny = dLat / GRATITUDE_CENTER.radiusY;

    var oval = Math.exp(-(nx * nx + ny * ny));

    var detail = fbm2(
      ((lon + Math.PI) / TAU) * 5.2,
      ((lat + Math.PI / 2) / Math.PI) * 4.1,
      0,
      33.7
    );

    var edgeBreak = (detail - 0.5) * 0.22;
    var influence = clamp(oval + edgeBreak, 0, 1);

    return influence;
  }

  function sampleTerrain(lon, lat, time) {
    var api = getTerrainApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time);
        if (sampled && sampled.forcingFieldReady) return sampled;
      } catch (error) {
        recordError("terrain-sample", error);
      }
    }

    var gratitude = gratitudeInfluence(lon, lat);
    var landRatio = clamp(gratitude * 0.86, 0, 1);
    var oceanRatio = 1 - landRatio;
    var coastalInfluence = clamp(1 - Math.abs(landRatio - 0.50) * 2, 0, 1);
    var mountainLift = clamp(gratitude * fbm2(lon * 1.8, lat * 2.4, 0, 61.2), 0, 1);
    var basinRetention = clamp(gratitude * fbm2(lon * 3.6 + 1.1, lat * 3.1 - 0.4, 0, 79.4), 0, 1);

    return {
      elevation: clamp(landRatio * 0.24 + mountainLift * 0.52 - oceanRatio * 0.50, -1, 1),
      landRatio: landRatio,
      oceanRatio: oceanRatio,
      coastalInfluence: coastalInfluence,
      mountainLift: mountainLift,
      valleyPooling: basinRetention * 0.42,
      basinRetention: basinRetention,
      riverInfluence: basinRetention * coastalInfluence * 0.44,
      lakeInfluence: basinRetention * 0.24,
      wetlandInfluence: basinRetention * coastalInfluence * 0.56,
      forestMoistureReturn: landRatio * (1 - mountainLift * 0.24) * 0.46,
      desertDryness: landRatio * (1 - basinRetention) * 0.18,
      polarInfluence: 0,
      soilMoisture: clamp(basinRetention * 0.34 + coastalInfluence * 0.24, 0, 1),
      evaporationPotential: clamp(oceanRatio * 0.50 + coastalInfluence * 0.24 + basinRetention * 0.22, 0, 1),
      surfaceHeat: 0.42,
      thermalGradient: clamp(coastalInfluence * 0.24 + mountainLift * 0.20, 0, 1),
      pressureLift: clamp(mountainLift * 0.44 + coastalInfluence * 0.18, 0, 1),
      convectionPotential: clamp(coastalInfluence * 0.22 + basinRetention * 0.28, 0, 1),
      orographicCloudBias: clamp(mountainLift * 0.72, 0, 1),
      stormTrackBias: clamp(coastalInfluence * 0.20 + mountainLift * 0.18, 0, 1),
      ecosystemMoistureReturn: clamp(basinRetention * 0.32 + landRatio * 0.24, 0, 1),
      terrainClass: landRatio > 0.58 ? "gratitude_highland" : coastalInfluence > 0.45 ? "coast" : "open_ocean",
      ecosystemClass: basinRetention > 0.50 ? "basin_wetland" : landRatio > 0.55 ? "forest" : "open_ocean",
      hydrologyClass: basinRetention > 0.50 ? "wetland_retention" : coastalInfluence > 0.42 ? "coastal_evaporation" : "ocean_source",
      forcingStrength: clamp(gratitude * 0.40 + coastalInfluence * 0.18 + mountainLift * 0.22, 0, 1),
      forcingFieldReady: false
    };
  }

  function sampleMoisture(lon, lat, time) {
    var api = getMoistureApi();

    if (api && typeof api.sample === "function") {
      try {
        var sampled = api.sample(lon, lat, time);
        if (sampled && sampled.moistureFieldReady) return sampled;
      } catch (error) {
        recordError("moisture-sample", error);
      }
    }

    var terrain = sampleTerrain(lon, lat, time);

    return {
      moisture: clamp(terrain.evaporationPotential * 0.42 + terrain.soilMoisture * 0.36, 0, 1),
      humidity: clamp(terrain.evaporationPotential * 0.36 + terrain.forestMoistureReturn * 0.28, 0, 1),
      condensation: clamp(terrain.orographicCloudBias * 0.22 + terrain.wetlandInfluence * 0.28, 0, 1),
      pressure: terrain.pressureLift,
      circulation: terrain.stormTrackBias,
      cloudProbability: clamp(terrain.evaporationPotential * 0.32 + terrain.orographicCloudBias * 0.18, 0, 1),
      cloudSoftness: 0.52,
      terrainForcingDetected: false,
      terrainForcingConsumed: false,
      terrainForcingStrength: terrain.forcingStrength,
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
      moistureFieldReady: false
    };
  }

  function classifyMaterial(gratitude, terrain, moisture) {
    var land = clamp(terrain.landRatio || 0, 0, 1);
    var coast = clamp(terrain.coastalInfluence || 0, 0, 1);
    var mountain = clamp(terrain.mountainLift || 0, 0, 1);
    var basin = clamp(terrain.basinRetention || 0, 0, 1);
    var wetland = clamp(terrain.wetlandInfluence || 0, 0, 1);
    var forest = clamp(terrain.forestMoistureReturn || 0, 0, 1);
    var dryness = clamp(terrain.desertDryness || 0, 0, 1);
    var river = clamp(terrain.riverInfluence || 0, 0, 1);
    var lake = clamp(terrain.lakeInfluence || 0, 0, 1);
    var ocean = clamp(terrain.oceanRatio || 0, 0, 1);

    if (gratitude < 0.22 || land < 0.18) {
      if (coast > 0.34 || gratitude > 0.16) return "shallow_shelf";
      if (ocean > 0.66) return "deep_ocean";
      return "polar_or_non_gratitude_hold";
    }

    if (coast > 0.58 && land < 0.58) return "coastal_edge";
    if (river > 0.42 || lake > 0.36) return "gratitude_hydrology_channel";
    if (wetland > 0.48 || basin > 0.62) return "gratitude_wetland";
    if (mountain > 0.66) return "gratitude_ridge";
    if ((terrain.elevation || 0) > 0.46) return "gratitude_highland";
    if (basin > 0.42) return "gratitude_basin";
    if (forest > 0.34 || (moisture && moisture.humidity > 0.46)) return "gratitude_moist_forest";
    if (dryness > 0.36) return "gratitude_dryland_transition";

    return "gratitude_lowland";
  }

  function materialStyle(material, cell) {
    var alphaBase = 0.64;
    var fill = "rgba(80,150,108,0.62)";
    var stroke = "rgba(160,225,180,0.20)";

    if (material === "deep_ocean") {
      fill = "rgba(0,18,48,0)";
      alphaBase = 0;
    } else if (material === "shallow_shelf") {
      fill = "rgba(70,170,190,0.20)";
      stroke = "rgba(150,232,244,0.10)";
      alphaBase = 0.42;
    } else if (material === "coastal_edge") {
      fill = "rgba(174,178,106,0.58)";
      stroke = "rgba(236,228,158,0.34)";
      alphaBase = 0.70;
    } else if (material === "gratitude_lowland") {
      fill = "rgba(62,144,96,0.62)";
      stroke = "rgba(166,225,168,0.16)";
    } else if (material === "gratitude_highland") {
      fill = "rgba(86,132,96,0.66)";
      stroke = "rgba(190,220,170,0.18)";
    } else if (material === "gratitude_ridge") {
      fill = "rgba(126,130,104,0.72)";
      stroke = "rgba(230,222,184,0.22)";
      alphaBase = 0.74;
    } else if (material === "gratitude_basin") {
      fill = "rgba(60,118,92,0.62)";
      stroke = "rgba(148,216,188,0.20)";
    } else if (material === "gratitude_wetland") {
      fill = "rgba(44,128,116,0.66)";
      stroke = "rgba(132,234,216,0.24)";
      alphaBase = 0.70;
    } else if (material === "gratitude_hydrology_channel") {
      fill = "rgba(68,170,190,0.72)";
      stroke = "rgba(184,244,255,0.32)";
      alphaBase = 0.76;
    } else if (material === "gratitude_moist_forest") {
      fill = "rgba(34,126,78,0.70)";
      stroke = "rgba(148,226,158,0.18)";
      alphaBase = 0.72;
    } else if (material === "gratitude_dryland_transition") {
      fill = "rgba(132,124,82,0.58)";
      stroke = "rgba(232,214,146,0.14)";
      alphaBase = 0.58;
    }

    return {
      fill: fill,
      stroke: stroke,
      alpha: clamp(alphaBase * (0.72 + cell.gratitudeInfluence * 0.36), 0, 0.86)
    };
  }

  function buildSurfaceCell(col, row, frame) {
    var renderTime = finite(frame && frame.renderTime, 0);

    var u = (col + 0.5) / SURFACE_COLUMNS;
    var v = (row + 0.5) / SURFACE_ROWS;

    var lon = -Math.PI + TAU * u;
    var y = 1 - 2 * v;
    var lat = Math.asin(clamp(y, -1, 1));

    var nx = (lon + Math.PI) / TAU;
    var ny = (lat + Math.PI / 2) / Math.PI;
    var edgeNoise = fbm2(nx * 6.4, ny * 4.8, 0, 101.4);

    var gratitude = gratitudeInfluence(lon, lat);
    var terrain = sampleTerrain(lon, lat, renderTime);
    var moisture = sampleMoisture(lon, lat, renderTime);

    var effectiveGratitude = clamp(gratitude + (edgeNoise - 0.50) * 0.16, 0, 1);
    var material = classifyMaterial(effectiveGratitude, terrain, moisture);
    var projection = projectLonLat(lon, lat, frame || {});

    var visible = Boolean(
      projection.frontFacing &&
      projection.visibility > 0.09 &&
      material !== "deep_ocean" &&
      material !== "polar_or_non_gratitude_hold"
    );

    var hydrologyHint = material === "gratitude_hydrology_channel" ||
      material === "gratitude_wetland" ||
      material === "gratitude_basin";

    var coastalHint = material === "coastal_edge" || material === "shallow_shelf";
    var elevationHint = material === "gratitude_highland" || material === "gratitude_ridge";

    return {
      cellId: "gratitude:" + row + ":" + col,
      col: col,
      row: row,
      longitude: lon,
      latitude: lat,

      gratitudeInfluence: effectiveGratitude,
      projection: projection,
      visible: visible,
      frontFacing: projection.frontFacing,
      visibility: projection.visibility,
      limbFactor: projection.limbFactor,

      materialClass: material,
      terrainClass: terrain.terrainClass,
      ecosystemClass: terrain.ecosystemClass,
      hydrologyClass: terrain.hydrologyClass,

      elevation: clamp(terrain.elevation || 0, -1, 1),
      landRatio: clamp(terrain.landRatio || 0, 0, 1),
      oceanRatio: clamp(terrain.oceanRatio || 0, 0, 1),
      coastalInfluence: clamp(terrain.coastalInfluence || 0, 0, 1),
      mountainLift: clamp(terrain.mountainLift || 0, 0, 1),
      basinRetention: clamp(terrain.basinRetention || 0, 0, 1),
      wetlandInfluence: clamp(terrain.wetlandInfluence || 0, 0, 1),
      riverInfluence: clamp(terrain.riverInfluence || 0, 0, 1),
      lakeInfluence: clamp(terrain.lakeInfluence || 0, 0, 1),
      forestMoistureReturn: clamp(terrain.forestMoistureReturn || 0, 0, 1),
      desertDryness: clamp(terrain.desertDryness || 0, 0, 1),

      moisture: clamp(moisture.moisture || 0, 0, 1),
      humidity: clamp(moisture.humidity || 0, 0, 1),
      condensation: clamp(moisture.condensation || 0, 0, 1),

      hydrologyHint: hydrologyHint,
      coastalHint: coastalHint,
      elevationHint: elevationHint,

      surfaceUsesTerrainEcosystemField: true,
      surfaceUsesMoistureField: true,
      noFlatProjection: true,
      noStaticSticker: true
    };
  }

  function buildSurfaceLayer(frame) {
    var cells = [];
    var visibleCells = [];
    var hydrologyHints = [];
    var materialCounts = {};
    var visibleCount = 0;
    var gratitudeCount = 0;
    var hydrologyHintCount = 0;

    for (var row = 0; row < SURFACE_ROWS; row += 1) {
      for (var col = 0; col < SURFACE_COLUMNS; col += 1) {
        var cell = buildSurfaceCell(col, row, frame || {});
        cells.push(cell);

        materialCounts[cell.materialClass] = (materialCounts[cell.materialClass] || 0) + 1;

        if (cell.gratitudeInfluence > 0.22 && cell.materialClass !== "deep_ocean") {
          gratitudeCount += 1;
        }

        if (cell.visible) {
          visibleCount += 1;
          visibleCells.push(cell);
        }

        if (cell.hydrologyHint) {
          hydrologyHintCount += 1;
          hydrologyHints.push(cell);
        }
      }
    }

    visibleCells.sort(function (a, b) {
      return a.projection.z - b.projection.z;
    });

    var layer = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      frameIndex: frame && typeof frame.frameIndex === "number" ? frame.frameIndex : 0,
      renderTime: frame && typeof frame.renderTime === "number" ? frame.renderTime : 0,

      gratitudeCenterLongitude: GRATITUDE_CENTER.longitude,
      gratitudeCenterLatitude: GRATITUDE_CENTER.latitude,
      gratitudeContinentName: GRATITUDE_CENTER.name,

      surfaceColumns: SURFACE_COLUMNS,
      surfaceRows: SURFACE_ROWS,
      surfaceCellCount: cells.length,
      visibleCellCount: visibleCount,
      gratitudeCellCount: gratitudeCount,
      hydrologyHintCount: hydrologyHintCount,
      materialCounts: materialCounts,

      cells: cells,
      visibleCells: visibleCells,
      hydrologyHints: hydrologyHints,

      surfaceRendererReady: true,
      gratitudeContinentVisible: gratitudeCount > 0,
      gratitudeContinentOnly: true,
      surfaceUsesTerrainEcosystemField: true,
      surfaceUsesMoistureField: true,
      surfaceRotatesWithGlobe: true,
      surfaceRenderedBeforeClouds: true,
      cloudsRemainAboveSurface: true,
      hydrologyHintsVisible: hydrologyHintCount > 0,
      coastalEdgeVisible: Boolean(materialCounts.coastal_edge || materialCounts.shallow_shelf),
      interiorElevationVisible: Boolean(materialCounts.gratitude_highland || materialCounts.gratitude_ridge),
      noFullPlanetTerrainClaim: true,
      noFlatProjection: true,
      noStaticSticker: true,
      noSecondCanvas: true,
      latticeViewProtected: true,
      planetViewOnly: true,
      groundLevelTransitionReady: true,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      staticSticker: false,
      drawsClouds: false,
      ownsRouteJs: false,
      ownsHtml: false,
      ownsRuntimeMotion: false
    };

    state.surfaceRendererReady = true;
    state.lastFrameIndex = layer.frameIndex;
    state.lastRenderTime = layer.renderTime;
    state.lastSurfaceCellCount = layer.surfaceCellCount;
    state.lastVisibleCellCount = layer.visibleCellCount;
    state.lastGratitudeCellCount = layer.gratitudeCellCount;
    state.lastHydrologyHintCount = layer.hydrologyHintCount;
    state.lastLayer = layer;

    window.AUDRALIA_TRUE_GLOBE_SURFACE_LAYER = layer;
    window.AUDRALIA_G2_TRUE_GLOBE_SURFACE_LAYER = layer;

    return layer;
  }

  function clipToSphere(ctx, frame) {
    var metrics = getFrameMetrics(frame);
    ctx.beginPath();
    ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.002, 0, TAU);
    ctx.clip();
  }

  function drawSurfaceCell(ctx, cell, frame) {
    if (!cell.visible) return;

    var projection = cell.projection;
    var metrics = getFrameMetrics(frame);
    var style = materialStyle(cell.materialClass, cell);

    if (style.alpha <= 0.01) return;

    var cellWidth = Math.max(
      2.2,
      metrics.radius * 0.052 * projection.perspective * (1 - projection.limbFactor * 0.36)
    );

    var cellHeight = Math.max(
      1.4,
      metrics.radius * 0.031 * projection.perspective * (1 - projection.limbFactor * 0.44)
    );

    var elevationBoost = clamp(cell.elevation * 0.20 + cell.mountainLift * 0.18, 0, 0.28);
    var moistureBoost = clamp(cell.moisture * 0.10 + cell.wetlandInfluence * 0.10, 0, 0.16);

    ctx.save();
    ctx.globalAlpha = clamp(style.alpha * projection.visibility * (1 - projection.limbFactor * 0.44), 0, 0.92);
    ctx.translate(projection.x, projection.y);
    ctx.rotate(cell.latitude * 0.48 + cell.longitude * 0.08);
    ctx.scale(1.18 + elevationBoost, 0.76 + moistureBoost);

    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.ellipse(0, 0, cellWidth, cellHeight, 0, 0, TAU);
    ctx.fill();

    if (cell.coastalHint || cell.elevationHint || cell.hydrologyHint) {
      ctx.globalAlpha *= cell.hydrologyHint ? 0.72 : 0.42;
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = Math.max(0.55, metrics.radius * 0.0025);
      ctx.beginPath();
      ctx.ellipse(0, 0, cellWidth * 1.04, cellHeight * 1.02, 0, 0, TAU);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawHydrologyHint(ctx, cell, frame) {
    if (!cell.visible || !cell.hydrologyHint) return;

    var projection = cell.projection;
    var metrics = getFrameMetrics(frame);
    var alpha = clamp((cell.riverInfluence + cell.wetlandInfluence + cell.lakeInfluence) * 0.18, 0.035, 0.18);

    ctx.save();
    ctx.globalAlpha = alpha * projection.visibility * (1 - projection.limbFactor * 0.40);
    ctx.strokeStyle = "rgba(150,236,244,0.68)";
    ctx.lineWidth = Math.max(0.55, metrics.radius * 0.0022);
    ctx.lineCap = "round";

    var length = metrics.radius * 0.028 * projection.perspective;
    var angle = cell.longitude * 0.70 - cell.latitude * 0.40;

    ctx.translate(projection.x, projection.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-length * 0.55, 0);
    ctx.quadraticCurveTo(0, -length * 0.20, length * 0.55, 0);
    ctx.stroke();

    ctx.restore();
  }

  function render(ctx, frame, options) {
    try {
      options = options || {};

      if (!ctx) return null;

      if (options.activeLens && options.activeLens !== "planet") {
        return buildSurfaceLayer(frame || {});
      }

      var layer = buildSurfaceLayer(frame || {});
      var cells = layer.visibleCells || [];

      ctx.save();
      clipToSphere(ctx, frame || {});

      for (var i = 0; i < cells.length; i += 1) {
        drawSurfaceCell(ctx, cells[i], frame || {});
      }

      for (var j = 0; j < cells.length; j += 1) {
        drawHydrologyHint(ctx, cells[j], frame || {});
      }

      ctx.restore();

      state.surfaceRendererReady = true;

      return layer;
    } catch (error) {
      recordError("render", error);
      return null;
    }
  }

  function status() {
    return {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,

      initialized: state.initialized,
      surfaceRendererReady: state.surfaceRendererReady,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      gratitudeContinentName: GRATITUDE_CENTER.name,
      gratitudeCenterLongitude: GRATITUDE_CENTER.longitude,
      gratitudeCenterLatitude: GRATITUDE_CENTER.latitude,

      surfaceColumns: SURFACE_COLUMNS,
      surfaceRows: SURFACE_ROWS,

      lastFrameIndex: state.lastFrameIndex,
      lastRenderTime: state.lastRenderTime,
      lastSurfaceCellCount: state.lastSurfaceCellCount,
      lastVisibleCellCount: state.lastVisibleCellCount,
      lastGratitudeCellCount: state.lastGratitudeCellCount,
      lastHydrologyHintCount: state.lastHydrologyHintCount,

      surfaceRendererChildReady: true,
      gratitudeContinentVisible: state.lastGratitudeCellCount > 0,
      gratitudeContinentOnly: true,
      surfaceUsesTerrainEcosystemField: true,
      surfaceUsesMoistureField: true,
      surfaceRotatesWithGlobe: true,
      surfaceRenderedBeforeClouds: true,
      cloudsRemainAboveSurface: true,
      hydrologyHintsVisible: state.lastHydrologyHintCount > 0,
      coastalEdgeVisible: true,
      interiorElevationVisible: true,
      noFullPlanetTerrainClaim: true,
      noFlatProjection: true,
      noStaticSticker: true,
      noSecondCanvas: true,
      latticeViewProtected: true,
      planetViewOnly: true,
      groundLevelTransitionReady: true,

      generatedImage: false,
      graphicBox: false,
      flatProjection: false,
      staticSticker: false,
      drawsClouds: false,
      ownsRouteJs: false,
      ownsHtml: false,
      ownsRuntimeMotion: false,

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

    window.AUDRALIA_TRUE_GLOBE_SURFACE_ERROR = {
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

      render: render,
      buildSurfaceLayer: buildSurfaceLayer,
      status: status
    };

    window.AUDRALIA_TRUE_GLOBE_SURFACE = api;
    window.AUDRALIA_G2_TRUE_GLOBE_SURFACE = api;
    window.AUDRALIA_TRUE_GLOBE_SURFACE_STATUS = status();
    window.AUDRALIA_G2_TRUE_GLOBE_SURFACE_STATUS = status();

    window.AUDRALIA_TRUE_GLOBE_SURFACE_BOOT = {
      contract: CONTRACT,
      standard: STANDARD,
      family: FAMILY,
      file: FILE,
      bootedAt: new Date().toISOString(),
      meaning: "Audralia Gratitude continent surface renderer child evaluated. Visible material APIs are available; no drawing authority outside Planet View claimed."
    };

    return api;
  }

  function init() {
    try {
      state.initialized = true;
      state.surfaceRendererReady = true;
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
