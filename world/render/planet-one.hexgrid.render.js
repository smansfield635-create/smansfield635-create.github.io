/* G1 PLANET 1 HEXGRID SATELLITE SUBSTRATE
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_HEXGRID_RENDERER_SATELLITE_PAIR_TNT_v1

   PURPOSE:
   - Preserve the canonical 256-state hexagonal terrain-cell substrate.
   - Default public visual translation to satellite-observational mode.
   - Keep cell-debug mode available for audit only.
   - Do not claim visual pass.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HEXGRID_RENDERER_SATELLITE_PAIR_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var STATE_FORMULA = "4x4x2x2x4";
  var STATE_COUNT = 256;
  var DEFAULT_RENDER_MODE = "satellite";

  var CONTRACT_MARKERS = [
    VERSION,
    BASELINE,
    "HEXAGONAL_PIXEL_FORMAT_ACTIVE",
    "HEX_CELL_SUBSTRATE_ACTIVE",
    "TERRAIN_CELL_SAMPLING_ACTIVE",
    "COAST_CELL_QUANTIZATION_ACTIVE",
    "ELEVATION_CELL_FIELD_ACTIVE",
    "WATER_DEPTH_CELL_FIELD_ACTIVE",
    "MINERAL_PRESSURE_CELL_FIELD_ACTIVE",
    "SATELLITE_OBSERVATIONAL_MODE_ACTIVE",
    "CELL_DEBUG_MODE_AVAILABLE",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var DOMAIN = {
    OCEAN_DEEP: 0,
    COASTAL_SHELF: 1,
    LAND_INTERIOR: 2,
    POLAR_ICE: 3
  };

  var RELIEF = {
    BASIN: 0,
    PLAIN: 1,
    PLATEAU: 2,
    RIDGE: 3
  };

  var EDGE_ROLE = {
    CORE: 0,
    BOUNDARY: 1
  };

  var PRESSURE = {
    BASE: 0,
    HIGH: 1
  };

  var MATERIAL = {
    SEDIMENT_OR_ORGANIC: 0,
    STONE: 1,
    METAL_OR_MINERAL: 2,
    CRYSTAL_OR_ICE: 3
  };

  var TERRAIN_CLASS = [
    "ocean_deep",
    "ocean_mid",
    "coastal_shelf",
    "shoreline",
    "lowland",
    "plateau",
    "ridge",
    "basin",
    "mountain",
    "mineral_seam",
    "polar_ice"
  ];

  var NEIGHBOR_DIRS = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1]
  ];

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function hash2(q, r, seed) {
    var x = Math.sin(q * 127.1 + r * 311.7 + (seed || 17) * 74.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function layeredNoise(q, r, seed) {
    return (
      hash2(q, r, seed) * 0.52 +
      hash2(Math.floor(q / 2), Math.floor(r / 2), seed + 11) * 0.30 +
      hash2(Math.floor(q / 4), Math.floor(r / 4), seed + 29) * 0.18
    );
  }

  function stateId(domain, relief, edgeRole, pressure, material) {
    return ((((domain * 4 + relief) * 2 + edgeRole) * 2 + pressure) * 4 + material);
  }

  function axialToPixel(q, r, size, cx, cy) {
    return {
      x: cx + size * Math.sqrt(3) * (q + r / 2),
      y: cy + size * 1.5 * r
    };
  }

  function hexCorners(x, y, size) {
    var pts = [];
    var i;
    var angle;

    for (i = 0; i < 6; i += 1) {
      angle = Math.PI / 180 * (60 * i - 30);
      pts.push({
        x: x + size * Math.cos(angle),
        y: y + size * Math.sin(angle)
      });
    }

    return pts;
  }

  function lobeScore(nx, ny) {
    var lobes = [
      { x: -0.40, y: -0.05, rx: 0.34, ry: 0.53, weight: 1.03 },
      { x: -0.04, y: 0.08, rx: 0.47, ry: 0.41, weight: 1.08 },
      { x: 0.36, y: -0.04, rx: 0.35, ry: 0.50, weight: 1.00 },
      { x: 0.06, y: -0.28, rx: 0.62, ry: 0.22, weight: 0.72 }
    ];

    var best = -999;
    var i;
    var l;
    var dx;
    var dy;
    var score;

    for (i = 0; i < lobes.length; i += 1) {
      l = lobes[i];
      dx = (nx - l.x) / l.rx;
      dy = (ny - l.y) / l.ry;
      score = (1 - (dx * dx + dy * dy)) * l.weight;
      if (score > best) best = score;
    }

    return best;
  }

  function classifyCell(q, r, projectedX, projectedY, options) {
    var radius = options.radius;
    var cx = options.centerX;
    var cy = options.centerY;
    var nx = (projectedX - cx) / radius;
    var ny = (projectedY - cy) / radius;
    var dist = Math.sqrt(nx * nx + ny * ny);
    var lat = clamp(-ny * 90, -90, 90);
    var lon = clamp(nx * 180, -180, 180);
    var noise = layeredNoise(q, r, options.seed);
    var fine = layeredNoise(q * 3, r * 3, options.seed + 503);
    var lobe = lobeScore(nx, ny) + (noise - 0.5) * 0.22;
    var absLat = Math.abs(lat);

    var domain;
    var relief;
    var edgeRole;
    var pressure;
    var material;
    var terrainClass;
    var elevation;
    var waterDepth;
    var shelfLevel;
    var ridgePressure;
    var basinPressure;
    var mineralPressure;
    var icePressure;
    var materialHint;
    var adjacencyClass;
    var satelliteTone;

    if (absLat > 72 || (absLat > 64 && lobe < -0.12)) {
      domain = DOMAIN.POLAR_ICE;
    } else if (lobe > 0.16) {
      domain = DOMAIN.LAND_INTERIOR;
    } else if (lobe > -0.10) {
      domain = DOMAIN.COASTAL_SHELF;
    } else {
      domain = DOMAIN.OCEAN_DEEP;
    }

    edgeRole = (
      Math.abs(lobe - 0.16) < 0.16 ||
      Math.abs(lobe + 0.10) < 0.10 ||
      absLat > 66
    ) ? EDGE_ROLE.BOUNDARY : EDGE_ROLE.CORE;

    if (domain === DOMAIN.OCEAN_DEEP) {
      relief = lobe < -0.55 ? RELIEF.BASIN : RELIEF.PLAIN;
      waterDepth = clamp(0.55 + Math.abs(lobe) * 0.52 + (1 - dist) * 0.14, 0.25, 1);
      elevation = -waterDepth;
      shelfLevel = 0;
      ridgePressure = noise > 0.88 ? 0.25 : 0.06;
      basinPressure = clamp(waterDepth, 0, 1);
      mineralPressure = noise > 0.90 ? 0.22 : 0.05;
      icePressure = 0;
      material = noise > 0.90 ? MATERIAL.METAL_OR_MINERAL : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = waterDepth > 0.72 ? "ocean_deep" : "ocean_mid";
      materialHint = material === MATERIAL.METAL_OR_MINERAL ? "mineral_dark_water" : "deep_water_sediment";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "ocean_transition" : "ocean_core";
      satelliteTone = 0.22 + (1 - waterDepth) * 0.22 + fine * 0.05;
    } else if (domain === DOMAIN.COASTAL_SHELF) {
      relief = noise > 0.74 ? RELIEF.RIDGE : RELIEF.PLAIN;
      waterDepth = clamp(0.08 + Math.abs(lobe + 0.10) * 0.50, 0.04, 0.40);
      shelfLevel = clamp(1 - waterDepth * 2.25, 0, 1);
      elevation = clamp(-waterDepth + 0.11, -0.32, 0.20);
      ridgePressure = relief === RELIEF.RIDGE ? 0.36 : 0.14;
      basinPressure = waterDepth;
      mineralPressure = noise > 0.78 ? 0.34 : 0.12;
      icePressure = absLat > 58 ? 0.22 : 0;
      material = noise > 0.78 ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = edgeRole === EDGE_ROLE.BOUNDARY ? "shoreline" : "coastal_shelf";
      materialHint = material === MATERIAL.STONE ? "stone_shelf" : "wet_sediment_shelf";
      adjacencyClass = "coast_transition";
      satelliteTone = 0.44 + shelfLevel * 0.22 + fine * 0.07;
    } else if (domain === DOMAIN.LAND_INTERIOR) {
      relief = noise > 0.80 ? RELIEF.RIDGE : noise > 0.56 ? RELIEF.PLATEAU : noise < 0.23 ? RELIEF.BASIN : RELIEF.PLAIN;
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.18 + lobe * 0.72 + noise * 0.20, 0.05, 1);
      ridgePressure = relief === RELIEF.RIDGE ? clamp(0.50 + noise * 0.28, 0, 1) : relief === RELIEF.PLATEAU ? 0.36 : 0.13;
      basinPressure = relief === RELIEF.BASIN ? 0.62 : 0.10;
      mineralPressure = (relief === RELIEF.RIDGE || noise > 0.77) ? clamp(0.40 + noise * 0.34, 0, 1) : 0.15;
      icePressure = absLat > 58 ? 0.15 : 0;
      material = mineralPressure > 0.72 ? MATERIAL.CRYSTAL_OR_ICE : mineralPressure > 0.48 ? MATERIAL.METAL_OR_MINERAL : relief === RELIEF.PLATEAU ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = relief === RELIEF.RIDGE ? "ridge" : relief === RELIEF.PLATEAU ? "plateau" : relief === RELIEF.BASIN ? "basin" : "lowland";
      materialHint = material === MATERIAL.CRYSTAL_OR_ICE ? "crystal_pressure" : material === MATERIAL.METAL_OR_MINERAL ? "mineral_seam" : material === MATERIAL.STONE ? "stone_plateau" : "organic_lowland";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "land_edge" : "land_core";
      satelliteTone = 0.48 + elevation * 0.20 + ridgePressure * 0.10 + fine * 0.08 - basinPressure * 0.07;
    } else {
      relief = noise > 0.62 ? RELIEF.PLATEAU : RELIEF.PLAIN;
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.24 + noise * 0.30 + (absLat - 64) / 42, 0.15, 1);
      ridgePressure = noise > 0.76 ? 0.36 : 0.14;
      basinPressure = 0.05;
      mineralPressure = noise > 0.70 ? 0.30 : 0.10;
      icePressure = clamp((absLat - 58) / 26, 0.25, 1);
      material = MATERIAL.CRYSTAL_OR_ICE;
      terrainClass = "polar_ice";
      materialHint = "ice_crystal_pressure";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "polar_boundary" : "polar_core";
      satelliteTone = 0.70 + icePressure * 0.24 + fine * 0.05;
    }

    pressure = (ridgePressure + mineralPressure + icePressure > 1.02 || relief === RELIEF.RIDGE) ? PRESSURE.HIGH : PRESSURE.BASE;

    return {
      cell_id: "hex_" + q + "_" + r,
      q_coordinate: q,
      r_coordinate: r,
      center_lon: round(lon, 5),
      center_lat: round(lat, 5),
      projected_x: round(projectedX, 3),
      projected_y: round(projectedY, 3),
      visibility: dist <= 1 ? "visible_front_hemisphere" : "hidden",
      visible: dist <= 1,
      domain: domain,
      relief: relief,
      edgeRole: edgeRole,
      pressure: pressure,
      material: material,
      state_id: stateId(domain, relief, edgeRole, pressure, material),
      neighbors: [],
      terrain_class: terrainClass,
      elevation: round(elevation, 4),
      water_depth: round(waterDepth, 4),
      shelf_level: round(shelfLevel, 4),
      ridge_pressure: round(ridgePressure, 4),
      basin_pressure: round(basinPressure, 4),
      mineral_pressure: round(mineralPressure, 4),
      ice_pressure: round(icePressure, 4),
      material_hint: materialHint,
      adjacency_class: adjacencyClass,
      satellite_tone: round(clamp(satelliteTone, 0, 1), 4)
    };
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};

    var width = Number(options.width || options.canvasWidth || 720);
    var height = Number(options.height || options.canvasHeight || 720);
    var centerX = Number(options.centerX || width / 2);
    var centerY = Number(options.centerY || height / 2);
    var radius = Number(options.radius || Math.min(width, height) * 0.43);
    var hexSize = Number(options.hexSize || options.cellSize || Math.max(3.2, radius / 42));
    var seed = Number(options.seed || 256451);
    var maxRing = Math.ceil(radius / (hexSize * 1.45)) + 2;

    var cells = [];
    var index = {};
    var q;
    var r;
    var point;
    var dx;
    var dy;
    var dist;
    var cell;
    var key;
    var i;
    var nq;
    var nr;

    var normalizedOptions = {
      width: width,
      height: height,
      centerX: centerX,
      centerY: centerY,
      radius: radius,
      hexSize: hexSize,
      seed: seed
    };

    for (q = -maxRing; q <= maxRing; q += 1) {
      for (r = -maxRing; r <= maxRing; r += 1) {
        point = axialToPixel(q, r, hexSize, centerX, centerY);
        dx = point.x - centerX;
        dy = point.y - centerY;
        dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius + hexSize * 1.8) {
          cell = classifyCell(q, r, point.x, point.y, normalizedOptions);
          cells.push(cell);
          index[q + "," + r] = cell;
        }
      }
    }

    for (i = 0; i < cells.length; i += 1) {
      cell = cells[i];

      cell.neighbors = NEIGHBOR_DIRS.map(function (dir) {
        nq = cell.q_coordinate + dir[0];
        nr = cell.r_coordinate + dir[1];
        key = nq + "," + nr;
        return index[key] ? index[key].cell_id : null;
      }).filter(Boolean);
    }

    lastGrid = {
      version: VERSION,
      baseline: BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      axes: {
        domain: true,
        relief: true,
        edgeRole: true,
        pressure: true,
        material: true
      },
      width: width,
      height: height,
      centerX: centerX,
      centerY: centerY,
      radius: radius,
      hexSize: hexSize,
      seed: seed,
      cells: cells,
      cellCount: cells.length,
      visibleCellCount: cells.filter(function (item) { return item.visible; }).length
    };

    return lastGrid;
  }

  function satelliteColor(cell) {
    var tone = clamp(cell.satellite_tone == null ? 0.5 : cell.satellite_tone, 0, 1);
    var r;
    var g;
    var b;
    var a;

    if (cell.domain === DOMAIN.OCEAN_DEEP) {
      r = 8 + tone * 18;
      g = 30 + tone * 52;
      b = 64 + tone * 78;
      a = 0.56 + tone * 0.16;
    } else if (cell.domain === DOMAIN.COASTAL_SHELF) {
      r = 38 + tone * 66;
      g = 78 + tone * 76;
      b = 84 + tone * 58;
      a = 0.48 + tone * 0.18;
    } else if (cell.domain === DOMAIN.POLAR_ICE) {
      r = 174 + tone * 70;
      g = 198 + tone * 50;
      b = 210 + tone * 38;
      a = 0.50 + tone * 0.22;
    } else {
      r = 62 + tone * 80 + cell.mineral_pressure * 24;
      g = 76 + tone * 64 + cell.elevation * 22;
      b = 48 + tone * 42 + cell.ridge_pressure * 18;
      a = 0.50 + tone * 0.20;
    }

    return "rgba(" + Math.round(clamp(r, 0, 255)) + "," + Math.round(clamp(g, 0, 255)) + "," + Math.round(clamp(b, 0, 255)) + "," + round(clamp(a, 0.30, 0.86), 3) + ")";
  }

  function debugColor(cell) {
    if (cell.domain === DOMAIN.OCEAN_DEEP) return cell.terrain_class === "ocean_deep" ? "rgba(16,48,82,.78)" : "rgba(26,76,112,.70)";
    if (cell.domain === DOMAIN.COASTAL_SHELF) return cell.terrain_class === "shoreline" ? "rgba(122,124,82,.72)" : "rgba(50,110,126,.64)";
    if (cell.domain === DOMAIN.POLAR_ICE) return "rgba(212,230,244,.72)";
    if (cell.material === MATERIAL.CRYSTAL_OR_ICE) return "rgba(184,170,122,.72)";
    if (cell.material === MATERIAL.METAL_OR_MINERAL) return "rgba(122,104,78,.76)";
    if (cell.relief === RELIEF.RIDGE) return "rgba(115,92,68,.76)";
    if (cell.relief === RELIEF.PLATEAU) return "rgba(124,112,76,.72)";
    if (cell.relief === RELIEF.BASIN) return "rgba(74,92,70,.68)";
    return "rgba(82,112,74,.70)";
  }

  function drawSatelliteCell(ctx, cell, size) {
    var points = hexCorners(cell.projected_x, cell.projected_y, size * 1.04);
    var i;

    if (!cell.visible) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = satelliteColor(cell);
    ctx.fill();

    if (cell.edgeRole === EDGE_ROLE.BOUNDARY) {
      ctx.globalAlpha *= 0.55;
      ctx.strokeStyle = cell.domain === DOMAIN.COASTAL_SHELF ? "rgba(218,205,143,.18)" : "rgba(255,255,255,.07)";
      ctx.lineWidth = Math.max(0.35, size * 0.035);
      ctx.stroke();
      ctx.globalAlpha /= 0.55;
    }
  }

  function drawDebugCell(ctx, cell, size) {
    var points = hexCorners(cell.projected_x, cell.projected_y, size * 0.96);
    var i;

    if (!cell.visible) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = debugColor(cell);
    ctx.fill();

    ctx.strokeStyle = cell.edgeRole === EDGE_ROLE.BOUNDARY ? "rgba(242,199,111,.26)" : "rgba(255,255,255,.08)";
    ctx.lineWidth = cell.edgeRole === EDGE_ROLE.BOUNDARY ? 0.9 : 0.45;
    ctx.stroke();
  }

  function resolveContext(target) {
    if (!target) return null;

    if (target.canvas && typeof target.fillRect === "function") return target;

    if (target.getContext && typeof target.getContext === "function") {
      return target.getContext("2d");
    }

    if (target.ctx && target.ctx.canvas) return target.ctx;
    if (target.context && target.context.canvas) return target.context;

    return null;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    var grid;
    var options;
    var renderMode;
    var i;

    if (!ctx) {
      return {
        ok: false,
        reason: "NO_CANVAS_CONTEXT",
        version: VERSION,
        defaultRenderMode: DEFAULT_RENDER_MODE,
        visualPassClaimed: false
      };
    }

    if (gridOrOptions && Array.isArray(gridOrOptions.cells)) {
      grid = gridOrOptions;
      options = maybeOptions || {};
    } else {
      options = gridOrOptions || {};
      grid = createPlanetOneHexGrid({
        width: options.width || ctx.canvas.width,
        height: options.height || ctx.canvas.height,
        centerX: options.centerX || ctx.canvas.width / 2,
        centerY: options.centerY || ctx.canvas.height / 2,
        radius: options.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43,
        hexSize: options.hexSize || options.cellSize,
        seed: options.seed
      });
    }

    renderMode = options.renderMode || DEFAULT_RENDER_MODE;

    ctx.save();

    if (renderMode === "cell-debug") {
      ctx.globalAlpha = options.alpha == null ? 0.82 : options.alpha;
      for (i = 0; i < grid.cells.length; i += 1) drawDebugCell(ctx, grid.cells[i], grid.hexSize || options.hexSize || 8);
    } else {
      ctx.globalAlpha = options.alpha == null ? 0.76 : options.alpha;
      for (i = 0; i < grid.cells.length; i += 1) drawSatelliteCell(ctx, grid.cells[i], grid.hexSize || options.hexSize || 6);
    }

    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
      renderMode: renderMode,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      satelliteObservationalModeActive: renderMode === "satellite",
      cellDebugModeAvailable: true,
      cellCount: grid.cellCount,
      visibleCellCount: grid.visibleCellCount,
      renderedAt: new Date().toISOString(),
      visualPassClaimed: false
    };

    return lastDraw;
  }

  function getHexgridStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      hexagonalPixelFormatActive: true,
      hexCellSubstrateActive: true,
      terrainCellSamplingActive: true,
      coastCellQuantizationActive: true,
      elevationCellFieldActive: true,
      waterDepthCellFieldActive: true,
      mineralPressureCellFieldActive: true,
      satelliteObservationalModeActive: true,
      cellDebugModeAvailable: true,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      domainAxis: true,
      reliefAxis: true,
      edgeRoleAxis: true,
      pressureAxis: true,
      materialAxis: true,
      domainAxisActive: true,
      reliefAxisActive: true,
      edgeRoleAxisActive: true,
      pressureAxisActive: true,
      materialAxisActive: true,
      terrainClasses: TERRAIN_CLASS.slice(),
      requiredCellFields: [
        "cell_id",
        "q_coordinate",
        "r_coordinate",
        "center_lon",
        "center_lat",
        "projected_x",
        "projected_y",
        "visibility",
        "domain",
        "relief",
        "edgeRole",
        "pressure",
        "material",
        "state_id",
        "neighbors",
        "terrain_class",
        "elevation",
        "water_depth",
        "shelf_level",
        "ridge_pressure",
        "basin_pressure",
        "mineral_pressure",
        "ice_pressure",
        "material_hint",
        "adjacency_class",
        "satellite_tone"
      ],
      lastGridCellCount: lastGrid ? lastGrid.cellCount : 0,
      lastVisibleCellCount: lastGrid ? lastGrid.visibleCellCount : 0,
      lastDraw: lastDraw,
      visualPassClaimed: false
    };
  }

  function status() {
    return getHexgridStatus();
  }

  function createDefaultProbeGrid() {
    if (!lastGrid) {
      createPlanetOneHexGrid({
        width: 640,
        height: 640,
        radius: 276,
        hexSize: 6.6,
        seed: 256451
      });
    }

    return lastGrid;
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    CONTRACT_MARKERS: CONTRACT_MARKERS,
    DOMAIN: DOMAIN,
    RELIEF: RELIEF,
    EDGE_ROLE: EDGE_ROLE,
    PRESSURE: PRESSURE,
    MATERIAL: MATERIAL,
    TERRAIN_CLASS: TERRAIN_CLASS,
    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    defaultRenderMode: DEFAULT_RENDER_MODE,
    satelliteObservationalModeActive: true,
    cellDebugModeAvailable: true,
    createPlanetOneHexGrid: createPlanetOneHexGrid,
    drawPlanetOneHexGrid: drawPlanetOneHexGrid,
    getHexgridStatus: getHexgridStatus,
    status: status,
    createDefaultProbeGrid: createDefaultProbeGrid
  };

  global.DGBPlanetOneHexgridRender = api;

  createDefaultProbeGrid();

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:hexgrid-ready", {
      detail: getHexgridStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
