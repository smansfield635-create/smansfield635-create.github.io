/* G1 PLANET 1 MARITIME BASELINE TO LAND ELEVATION HEXGRID
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_MARITIME_BASELINE_TO_LAND_ELEVATION_HEXGRID_TNT_v1

   PURPOSE:
   - Keep the 256-state hexagonal substrate hidden from public view.
   - Render satellite-mode land/water as orbital surface matter, not honeycomb.
   - Preserve sea-level maritime baseline and begin controlled land elevation.
   - Preserve two dynamic hemispheric land structures, three secondary non-polar bodies,
     north/south polar distinction, and visual HOLD.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_MARITIME_BASELINE_TO_LAND_ELEVATION_HEXGRID_TNT_v1";
  var BASELINE = "PLANET_1_G1_MARITIME_SEA_LEVEL_BASELINE_v1";
  var DEFAULT_SEED = 256451;

  var CONTRACT_MARKERS = [
    VERSION,
    BASELINE,
    "HEXGRID_RENDERER_ACTIVE",
    "HEXGRID_CONSUMED_AS_HIDDEN_PLANETARY_DATA",
    "MARITIME_SEA_LEVEL_BASELINE_ACTIVE",
    "CONTROLLED_LAND_ELEVATION_LAYER_ACTIVE",
    "SATELLITE_MODE_DRAWS_SURFACE_EFFECTS_ONLY",
    "PUBLIC_HONEYCOMB_BLOCKED",
    "TWO_DYNAMIC_HEMISPHERIC_LAND_STRUCTURES_ACTIVE",
    "THREE_SECONDARY_NON_POLAR_BODIES_ACTIVE",
    "SEVEN_LANDMASS_LAW_ACTIVE",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    version: VERSION,
    baseline: BASELINE,
    lastGrid: null,
    lastDraw: null,
    lastError: null,
    cellDebugModeAvailable: true,
    publicHoneycombBlocked: true,
    satelliteObservationalModeActive: true,
    visualPassClaimed: false
  };

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function wrapLon(value) {
    var lon = value;
    while (lon <= -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
  }

  function lonDistance(a, b) {
    return Math.abs(wrapLon(a - b));
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function noise(lon, lat, seed) {
    var value = Math.sin((lon * 12.9898) + (lat * 78.233) + (seed * 0.013)) * 43758.5453;
    return value - Math.floor(value);
  }

  function signedNoise(lon, lat, seed) {
    return (noise(lon, lat, seed) * 2) - 1;
  }

  function ellipseScore(lon, lat, centerLon, centerLat, scaleLon, scaleLat, curve, seed) {
    var curvedLat = centerLat + Math.sin(degToRad((lon + centerLon) * 0.92 + seed * 11)) * curve;
    var dx = lonDistance(lon, centerLon) / scaleLon;
    var dy = (lat - curvedLat) / scaleLat;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    return 1 - smoothstep(0.58, 1.06, distance);
  }

  function classifyCell(lon, lat, seed) {
    var northPole = smoothstep(62, 78, lat);
    var southPole = smoothstep(62, 78, -lat);

    var westDynamic = ellipseScore(lon, lat, -116, 7, 66, 50, 13, seed + 1);
    var eastDynamic = ellipseScore(lon, lat, 74, -6, 70, 48, -11, seed + 2);
    var secondaryOne = ellipseScore(lon, lat, -18, -30, 24, 19, 5, seed + 3);
    var secondaryTwo = ellipseScore(lon, lat, 151, 21, 25, 18, -5, seed + 4);
    var secondaryThree = ellipseScore(lon, lat, 21, 39, 20, 16, 4, seed + 5);

    var dynamicLand = Math.max(westDynamic, eastDynamic);
    var secondaryLand = Math.max(secondaryOne, secondaryTwo, secondaryThree);
    var nonPolarLand = Math.max(dynamicLand, secondaryLand);
    var coastalBreak = signedNoise(lon * 0.7, lat * 0.7, seed + 22) * 0.055;
    var landScore = clamp(nonPolarLand + coastalBreak, 0, 1);
    var polarScore = Math.max(northPole, southPole);
    var shelfScore = clamp(1 - Math.abs(landScore - 0.44) / 0.26, 0, 1);
    var coastScore = clamp(1 - Math.abs(landScore - 0.52) / 0.18, 0, 1);
    var lowElevation = clamp((landScore - 0.46) / 0.54, 0, 1);
    var materialNoise = noise(lon * 1.9, lat * 1.9, seed + 72);
    var waterDepth = clamp(1 - (landScore * 0.82) - (shelfScore * 0.22), 0, 1);

    var type = "water";
    var structure = "ocean";

    if (polarScore > 0.32) {
      type = "polar";
      structure = northPole >= southPole ? "north_polar_lid" : "south_polar_lid";
    } else if (landScore > 0.50) {
      type = "land";
      if (westDynamic >= eastDynamic && westDynamic >= secondaryLand) structure = "west_dynamic_hemispheric_land_structure";
      else if (eastDynamic >= westDynamic && eastDynamic >= secondaryLand) structure = "east_dynamic_hemispheric_land_structure";
      else if (secondaryOne >= secondaryTwo && secondaryOne >= secondaryThree) structure = "secondary_non_polar_body_1";
      else if (secondaryTwo >= secondaryOne && secondaryTwo >= secondaryThree) structure = "secondary_non_polar_body_2";
      else structure = "secondary_non_polar_body_3";
    } else if (shelfScore > 0.22) {
      type = "shelf";
      structure = "shallow_coastal_shelf_hint";
    }

    return {
      lon: lon,
      lat: lat,
      type: type,
      structure: structure,
      landScore: landScore,
      polarScore: polarScore,
      shelfScore: shelfScore,
      coastScore: coastScore,
      elevation: type === "land" ? clamp(0.025 + lowElevation * 0.145 + materialNoise * 0.025, 0.02, 0.19) : 0,
      waterDepth: waterDepth,
      mineralPressure: type === "land" ? clamp(materialNoise * 0.16, 0, 0.16) : 0,
      plateauPressure: type === "land" ? clamp(lowElevation * 0.10, 0, 0.10) : 0,
      higherRelief: 0,
      maritimeDatum: 0,
      hiddenSubstrateCell: true
    };
  }

  function createPlanetOneHexGrid(options) {
    var opts = options || {};
    var lonStep = Math.max(2, Number(opts.lonStep || 4));
    var latStep = Math.max(2, Number(opts.latStep || 4));
    var seed = Number(opts.seed || DEFAULT_SEED);
    var cells = [];
    var lat;
    var lon;
    var grid;

    for (lat = -88; lat <= 88; lat += latStep) {
      for (lon = -180; lon < 180; lon += lonStep) {
        cells.push(classifyCell(lon, lat, seed));
      }
    }

    grid = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      seed: seed,
      lonStep: lonStep,
      latStep: latStep,
      cells: cells,
      cellCount: cells.length,
      generatedAt: now(),
      hiddenPlanetaryData: true,
      publicHoneycombBlocked: true,
      visualPassClaimed: false
    };

    state.lastGrid = grid;
    return grid;
  }

  function projectCell(cell, viewLon, viewLat, cx, cy, radius) {
    var lat = degToRad(cell.lat);
    var lon = degToRad(wrapLon(cell.lon - viewLon));
    var vLat = degToRad(viewLat || 0);
    var cosLat = Math.cos(lat);
    var sinLat = Math.sin(lat);
    var cosLon = Math.cos(lon);
    var sinLon = Math.sin(lon);
    var cosViewLat = Math.cos(vLat);
    var sinViewLat = Math.sin(vLat);
    var z = (cosLat * cosLon * cosViewLat) + (sinLat * sinViewLat);

    return {
      visible: z > -0.035,
      x: cx + radius * cosLat * sinLon,
      y: cy - radius * ((sinLat * cosViewLat) - (cosLat * cosLon * sinViewLat)),
      z: z
    };
  }

  function rgba(r, g, b, a) {
    return "rgba(" + Math.round(clamp(r, 0, 255)) + "," + Math.round(clamp(g, 0, 255)) + "," + Math.round(clamp(b, 0, 255)) + "," + clamp(a, 0, 1).toFixed(3) + ")";
  }

  function fillPatch(ctx, x, y, rx, ry, rotation) {
    ctx.beginPath();
    if (typeof ctx.ellipse === "function") {
      ctx.ellipse(x, y, rx, ry, rotation || 0, 0, Math.PI * 2);
    } else {
      ctx.arc(x, y, Math.max(rx, ry), 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawSatelliteSurface(ctx, grid, options) {
    var opts = options || {};
    var cx = Number(opts.centerX || ctx.canvas.width / 2);
    var cy = Number(opts.centerY || ctx.canvas.height / 2);
    var radius = Number(opts.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    var viewLon = Number(opts.viewLon == null ? -28 : opts.viewLon);
    var viewLat = Number(opts.viewLat == null ? 0 : opts.viewLat);
    var alpha = clamp(Number(opts.alpha == null ? 0.82 : opts.alpha), 0, 1);
    var pointRadius = Math.max(1.1, radius * Math.max(grid.lonStep, grid.latStep) / 150);
    var cells = grid && grid.cells ? grid.cells : [];
    var i;
    var cell;
    var p;
    var fade;
    var rx;
    var ry;
    var elevation;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    for (i = 0; i < cells.length; i += 1) {
      cell = cells[i];
      p = projectCell(cell, viewLon, viewLat, cx, cy, radius);
      if (!p.visible) continue;

      fade = clamp((p.z + 0.08) / 1.08, 0, 1);
      rx = pointRadius * (1.05 + (1 - Math.abs(cell.lat) / 90) * 0.42);
      ry = pointRadius * (0.72 + fade * 0.22);

      if (cell.type === "shelf") {
        ctx.fillStyle = rgba(160, 170, 126, alpha * 0.13 * fade * cell.shelfScore);
        fillPatch(ctx, p.x, p.y, rx * 1.22, ry * 1.08, degToRad(cell.lon * 0.18));
      } else if (cell.type === "polar") {
        ctx.fillStyle = rgba(226, 240, 242, alpha * (0.16 + cell.polarScore * 0.18) * fade);
        fillPatch(ctx, p.x, p.y, rx * 1.10, ry * 0.92, degToRad(-8));
      } else if (cell.type === "land") {
        if (opts.coastGlow !== false && cell.coastScore > 0.08) {
          ctx.fillStyle = rgba(190, 174, 112, alpha * 0.12 * fade * cell.coastScore);
          fillPatch(ctx, p.x, p.y, rx * 1.45, ry * 1.25, degToRad(cell.lat + cell.lon * 0.1));
        }

        elevation = clamp(cell.elevation / 0.19, 0, 1);
        ctx.fillStyle = rgba(
          72 + elevation * 48,
          96 + elevation * 36,
          66 + elevation * 20,
          alpha * (0.34 + cell.landScore * 0.24) * fade
        );
        fillPatch(ctx, p.x, p.y, rx * 1.18, ry, degToRad(cell.lon * 0.12));
      }
    }

    ctx.restore();

    state.lastDraw = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      renderMode: "satellite",
      cellCount: cells.length,
      hiddenPlanetaryData: true,
      publicHoneycombBlocked: true,
      drawsPublicCellOutlines: false,
      maritimeSeaLevelBaselineActive: true,
      controlledLandElevationLayerActive: true,
      visualPassClaimed: false
    };

    return state.lastDraw;
  }

  function drawDebugGrid(ctx, grid, options) {
    var opts = options || {};
    var cx = Number(opts.centerX || ctx.canvas.width / 2);
    var cy = Number(opts.centerY || ctx.canvas.height / 2);
    var radius = Number(opts.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    var viewLon = Number(opts.viewLon == null ? -28 : opts.viewLon);
    var viewLat = Number(opts.viewLat == null ? 0 : opts.viewLat);
    var cells = grid && grid.cells ? grid.cells : [];
    var pointRadius = Math.max(1.0, radius * Math.max(grid.lonStep, grid.latStep) / 170);
    var i;
    var p;
    var cell;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = Math.max(0.5, radius * 0.0018);

    for (i = 0; i < cells.length; i += 1) {
      cell = cells[i];
      p = projectCell(cell, viewLon, viewLat, cx, cy, radius);
      if (!p.visible) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    state.lastDraw = {
      ok: true,
      version: VERSION,
      baseline: BASELINE,
      renderedAt: now(),
      renderMode: "debug",
      cellCount: cells.length,
      publicHoneycombBlocked: false,
      debugOnly: true,
      visualPassClaimed: false
    };

    return state.lastDraw;
  }

  function drawPlanetOneHexGrid(ctx, grid, options) {
    var opts = options || {};
    var renderMode = opts.renderMode || "satellite";
    var workingGrid = grid && grid.cells ? grid : createPlanetOneHexGrid(opts);

    if (!ctx) {
      state.lastError = "NO_CONTEXT";
      return {
        ok: false,
        reason: "NO_CONTEXT",
        version: VERSION,
        visualPassClaimed: false
      };
    }

    if (renderMode === "debug" && opts.allowDebug !== false) {
      return drawDebugGrid(ctx, workingGrid, opts);
    }

    return drawSatelliteSurface(ctx, workingGrid, opts);
  }

  function getHexgridStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      hexgridRendererActive: true,
      hiddenPlanetaryData: true,
      hexCellSubstrateActive: true,
      hexagonalPixelFormatActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,
      maritimeSeaLevelBaselineActive: true,
      controlledLandElevationLayerActive: true,
      shallowShelfHintActive: true,
      plateauPressureHeld: true,
      mineralPressureHeld: true,
      higherReliefHeld: true,
      satelliteObservationalModeActive: true,
      publicHoneycombBlocked: true,
      satelliteModeDrawsSurfaceEffectsOnly: true,
      drawsPublicCellOutlinesInSatelliteMode: false,
      cellDebugModeAvailable: true,
      twoDynamicHemisphericLandStructuresActive: true,
      threeSecondaryNonPolarBodiesActive: true,
      sevenLandmassLawActive: true,
      northSouthPolarDistinctionActive: true,
      visualPassClaimed: false,
      lastGrid: state.lastGrid ? {
        cellCount: state.lastGrid.cellCount,
        lonStep: state.lastGrid.lonStep,
        latStep: state.lastGrid.latStep,
        seed: state.lastGrid.seed,
        generatedAt: state.lastGrid.generatedAt
      } : null,
      lastDraw: state.lastDraw,
      lastError: state.lastError
    };
  }

  function status() {
    return getHexgridStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    CONTRACT_MARKERS: CONTRACT_MARKERS,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: status
  };

  global.DGBPlanetOneHexgridRender = api;
  global.DGBPlanetOneHexGridRender = api;

  try {
    if (global.dispatchEvent && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("dgb:planet-one:hexgrid-ready", {
        detail: getHexgridStatus()
      }));
    }
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
