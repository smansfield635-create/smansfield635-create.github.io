/* G1 PLANET 1 HEXGRID SUBSTRATE INSERTION
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_HEXGRID_SUBSTRATE_INSERTION_TNT_v1

   PURPOSE:
   - Create the canonical 256-state hexagonal terrain-cell substrate.
   - Provide the missing graphics foundation between macro land geometry and surface materials.
   - Do not claim visual pass.
   - Do not replace land constructs, surface materials, renderer, terrain, or hydration.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HEXGRID_SUBSTRATE_INSERTION_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var STATE_FORMULA = "4x4x2x2x4";
  var STATE_COUNT = 256;

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
      { x: -0.38, y: -0.05, rx: 0.33, ry: 0.52, weight: 1.03 },
      { x: -0.04, y: 0.08, rx: 0.46, ry: 0.40, weight: 1.08 },
      { x: 0.36, y: -0.04, rx: 0.34, ry: 0.50, weight: 1.00 },
      { x: 0.05, y: -0.28, rx: 0.62, ry: 0.22, weight: 0.75 }
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
    var lobe = lobeScore(nx, ny) + (noise - 0.5) * 0.24;
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

    if (absLat > 72 || (absLat > 64 && lobe < -0.12)) {
      domain = DOMAIN.POLAR_ICE;
    } else if (lobe > 0.16) {
      domain = DOMAIN.LAND_INTERIOR;
    } else if (lobe > -0.10) {
      domain = DOMAIN.COASTAL_SHELF;
    } else {
      domain = DOMAIN.OCEAN_DEEP;
    }

    edgeRole = (Math.abs(lobe - 0.16) < 0.17 || Math.abs(lobe + 0.10) < 0.10 || absLat > 66) ? EDGE_ROLE.BOUNDARY : EDGE_ROLE.CORE;

    if (domain === DOMAIN.OCEAN_DEEP) {
      relief = lobe < -0.55 ? RELIEF.BASIN : RELIEF.PLAIN;
      waterDepth = clamp(0.55 + Math.abs(lobe) * 0.55 + (1 - dist) * 0.18, 0.25, 1);
      elevation = -waterDepth;
      shelfLevel = 0;
      ridgePressure = noise > 0.86 ? 0.35 : 0.08;
      basinPressure = clamp(waterDepth, 0, 1);
      mineralPressure = noise > 0.88 ? 0.25 : 0.06;
      icePressure = 0;
      material = noise > 0.88 ? MATERIAL.METAL_OR_MINERAL : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = waterDepth > 0.72 ? "ocean_deep" : "ocean_mid";
      materialHint = material === MATERIAL.METAL_OR_MINERAL ? "mineral_dark_water" : "deep_water_sediment";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "ocean_transition" : "ocean_core";
    } else if (domain === DOMAIN.COASTAL_SHELF) {
      relief = noise > 0.74 ? RELIEF.RIDGE : RELIEF.PLAIN;
      waterDepth = clamp(0.10 + Math.abs(lobe + 0.10) * 0.55, 0.05, 0.42);
      shelfLevel = clamp(1 - waterDepth * 2.2, 0, 1);
      elevation = clamp(-waterDepth + 0.10, -0.35, 0.18);
      ridgePressure = relief === RELIEF.RIDGE ? 0.55 : 0.18;
      basinPressure = waterDepth;
      mineralPressure = noise > 0.78 ? 0.42 : 0.14;
      icePressure = absLat > 58 ? 0.25 : 0;
      material = noise > 0.78 ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = edgeRole === EDGE_ROLE.BOUNDARY ? "shoreline" : "coastal_shelf";
      materialHint = material === MATERIAL.STONE ? "stone_shelf" : "wet_sediment_shelf";
      adjacencyClass = "coast_transition";
    } else if (domain === DOMAIN.LAND_INTERIOR) {
      relief = noise > 0.80 ? RELIEF.RIDGE : noise > 0.56 ? RELIEF.PLATEAU : noise < 0.23 ? RELIEF.BASIN : RELIEF.PLAIN;
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.18 + lobe * 0.78 + noise * 0.22, 0.05, 1);
      ridgePressure = relief === RELIEF.RIDGE ? clamp(0.62 + noise * 0.30, 0, 1) : relief === RELIEF.PLATEAU ? 0.42 : 0.16;
      basinPressure = relief === RELIEF.BASIN ? 0.72 : 0.12;
      mineralPressure = (relief === RELIEF.RIDGE || noise > 0.77) ? clamp(0.48 + noise * 0.36, 0, 1) : 0.18;
      icePressure = absLat > 58 ? 0.18 : 0;
      material = mineralPressure > 0.72 ? MATERIAL.CRYSTAL_OR_ICE : mineralPressure > 0.48 ? MATERIAL.METAL_OR_MINERAL : relief === RELIEF.PLATEAU ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = relief === RELIEF.RIDGE ? "ridge" : relief === RELIEF.PLATEAU ? "plateau" : relief === RELIEF.BASIN ? "basin" : "lowland";
      materialHint = material === MATERIAL.CRYSTAL_OR_ICE ? "crystal_pressure" : material === MATERIAL.METAL_OR_MINERAL ? "mineral_seam" : material === MATERIAL.STONE ? "stone_plateau" : "organic_lowland";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "land_edge" : "land_core";
    } else {
      relief = noise > 0.62 ? RELIEF.PLATEAU : RELIEF.PLAIN;
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.24 + noise * 0.34 + (absLat - 64) / 40, 0.15, 1);
      ridgePressure = noise > 0.76 ? 0.48 : 0.18;
      basinPressure = 0.06;
      mineralPressure = noise > 0.70 ? 0.38 : 0.12;
      icePressure = clamp((absLat - 58) / 26, 0.25, 1);
      material = MATERIAL.CRYSTAL_OR_ICE;
      terrainClass = "polar_ice";
      materialHint = "ice_crystal_pressure";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "polar_boundary" : "polar_core";
    }

    pressure = (ridgePressure + mineralPressure + icePressure > 1.05 || relief === RELIEF.RIDGE) ? PRESSURE.HIGH : PRESSURE.BASE;

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
      adjacency_class: adjacencyClass
    };
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};

    var width = Number(options.width || options.canvasWidth || 720);
    var height = Number(options.height || options.canvasHeight || 720);
    var centerX = Number(options.centerX || width / 2);
    var centerY = Number(options.centerY || height / 2);
    var radius = Number(options.radius || Math.min(width, height) * 0.43);
    var hexSize = Number(options.hexSize || options.cellSize || Math.max(4.5, radius / 34));
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

  function colorForCell(cell) {
    if (cell.domain === DOMAIN.OCEAN_DEEP) {
      return cell.terrain_class === "ocean_deep" ? "rgba(16,48,82,.72)" : "rgba(26,76,112,.66)";
    }

    if (cell.domain === DOMAIN.COASTAL_SHELF) {
      return cell.terrain_class === "shoreline" ? "rgba(122,124,82,.66)" : "rgba(50,110,126,.58)";
    }

    if (cell.domain === DOMAIN.POLAR_ICE) {
      return "rgba(212,230,244,.66)";
    }

    if (cell.material === MATERIAL.CRYSTAL_OR_ICE) {
      return "rgba(184,170,122,.66)";
    }

    if (cell.material === MATERIAL.METAL_OR_MINERAL) {
      return "rgba(122,104,78,.70)";
    }

    if (cell.relief === RELIEF.RIDGE) {
      return "rgba(115,92,68,.72)";
    }

    if (cell.relief === RELIEF.PLATEAU) {
      return "rgba(124,112,76,.68)";
    }

    if (cell.relief === RELIEF.BASIN) {
      return "rgba(74,92,70,.62)";
    }

    return "rgba(82,112,74,.66)";
  }

  function drawCell(ctx, cell, size, options) {
    var points = hexCorners(cell.projected_x, cell.projected_y, size * 0.96);
    var i;

    if (!cell.visible) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = colorForCell(cell);
    ctx.fill();

    if (options && options.stroke !== false) {
      ctx.strokeStyle = cell.edgeRole === EDGE_ROLE.BOUNDARY ? "rgba(242,199,111,.16)" : "rgba(255,255,255,.045)";
      ctx.lineWidth = cell.edgeRole === EDGE_ROLE.BOUNDARY ? 0.8 : 0.35;
      ctx.stroke();
    }
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
    var i;

    if (!ctx) {
      return {
        ok: false,
        reason: "NO_CANVAS_CONTEXT",
        version: VERSION,
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

    ctx.save();
    ctx.globalAlpha = options.alpha == null ? 0.78 : options.alpha;

    for (i = 0; i < grid.cells.length; i += 1) {
      drawCell(ctx, grid.cells[i], grid.hexSize || options.hexSize || 8, options);
    }

    ctx.restore();

    lastDraw = {
      ok: true,
      version: VERSION,
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
        "adjacency_class"
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
        hexSize: 8.4,
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
  } catch (error) {
    /* CustomEvent may fail in older engines. The global contract remains available. */
  }
})(typeof window !== "undefined" ? window : globalThis);
