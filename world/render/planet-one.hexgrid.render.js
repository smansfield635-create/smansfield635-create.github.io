/* G1 PLANET 1 HEXGRID ORBITAL PROJECTION RESTRAINT
   FILE: /world/render/planet-one.hexgrid.render.js
   VERSION: G1_PLANET_1_HEXGRID_ORBITAL_PROJECTION_RESTRAINT_PAIR_TNT_v1

   PURPOSE:
   - Keep the 256-state hexagonal terrain-cell substrate canonical.
   - Treat cells as planetary surface samples, not screen-space honeycomb.
   - Encode two dominant dynamic hemispheric land structures + three additional non-polar bodies + two poles.
   - Expose satellite public mode and cell-debug audit mode.
   - Do not claim visual pass.
*/

(function attachPlanetOneHexgridRender(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_HEXGRID_ORBITAL_PROJECTION_RESTRAINT_PAIR_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_HEX_SUBSTRATE_BASELINE_v2";
  var STATE_FORMULA = "4x4x2x2x4";
  var STATE_COUNT = 256;
  var DEFAULT_RENDER_MODE = "satellite";

  var CONTRACT_MARKERS = [
    VERSION,
    BASELINE,
    "ORBITAL_PROJECTION_RESTRAINT_ACTIVE",
    "SATELLITE_OBSERVATIONAL_MODE_ACTIVE",
    "HEXGRID_AS_HIDDEN_PLANETARY_DATA",
    "PUBLIC_HONEYCOMB_BLOCKED",
    "TWO_DYNAMIC_HEMISPHERIC_LAND_STRUCTURES_ACTIVE",
    "THREE_SECONDARY_NON_POLAR_BODIES_ACTIVE",
    "SEVEN_LANDMASS_LAW_ACTIVE",
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

  var lastGrid = null;
  var lastDraw = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places) {
    var m = Math.pow(10, places || 4);
    return Math.round(value * m) / m;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function normalizeLon(lon) {
    var x = ((lon + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function angularDistance(a, b) {
    return Math.abs(normalizeLon(a - b));
  }

  function hash2(a, b, seed) {
    var x = Math.sin(a * 127.1 + b * 311.7 + (seed || 17) * 74.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function noise(lon, lat, seed) {
    return (
      hash2(Math.round(lon * 2), Math.round(lat * 2), seed) * 0.50 +
      hash2(Math.round(lon / 2), Math.round(lat / 2), seed + 13) * 0.32 +
      hash2(Math.round(lon / 6), Math.round(lat / 6), seed + 31) * 0.18
    );
  }

  function stateId(domain, relief, edgeRole, pressure, material) {
    return ((((domain * 4 + relief) * 2 + edgeRole) * 2 + pressure) * 4 + material);
  }

  function bodyScore(lon, lat, body) {
    var dx = angularDistance(lon, body.lon) / body.rx;
    var dy = (lat - body.lat) / body.ry;
    var skew = body.skew ? (lat / 90) * body.skew : 0;
    var wrap = body.wrap ? Math.cos(degToRad(lon - body.lon)) * body.wrap : 0;
    return body.weight * (1 - (dx * dx + dy * dy)) + wrap + skew;
  }

  function getLandSignature(lon, lat, seed) {
    var n = noise(lon, lat, seed);
    var rough = (n - 0.5) * 0.22;

    var bodies = [
      {
        id: "primary_west_dynamic_structure",
        role: "dynamic_hemispheric_side_structure",
        lon: -78,
        lat: 4,
        rx: 64,
        ry: 74,
        weight: 1.18,
        wrap: 0.22,
        skew: -0.08
      },
      {
        id: "primary_east_dynamic_structure",
        role: "dynamic_hemispheric_side_structure",
        lon: 104,
        lat: -4,
        rx: 67,
        ry: 72,
        weight: 1.15,
        wrap: 0.20,
        skew: 0.07
      },
      {
        id: "secondary_north_midland",
        role: "secondary_non_polar_body",
        lon: 12,
        lat: 34,
        rx: 34,
        ry: 28,
        weight: 0.92,
        wrap: 0.06
      },
      {
        id: "secondary_south_midland",
        role: "secondary_non_polar_body",
        lon: -18,
        lat: -38,
        rx: 38,
        ry: 30,
        weight: 0.88,
        wrap: 0.05
      },
      {
        id: "secondary_far_wrap_body",
        role: "secondary_non_polar_body",
        lon: 176,
        lat: 16,
        rx: 28,
        ry: 42,
        weight: 0.84,
        wrap: 0.18
      }
    ];

    var best = { score: -999, body: null };
    var second = { score: -999, body: null };
    var i;
    var s;

    for (i = 0; i < bodies.length; i += 1) {
      s = bodyScore(lon, lat, bodies[i]) + rough;
      if (s > best.score) {
        second = best;
        best = { score: s, body: bodies[i] };
      } else if (s > second.score) {
        second = { score: s, body: bodies[i] };
      }
    }

    return {
      score: best.score,
      body: best.body,
      secondScore: second.score,
      fracturePressure: clamp((best.score + second.score + 0.45) / 1.6, 0, 1),
      noise: n
    };
  }

  function classifySurfaceCell(lon, lat, options) {
    var seed = options.seed || 256451;
    var absLat = Math.abs(lat);
    var signature = getLandSignature(lon, lat, seed);
    var n = signature.noise;
    var coastDelta = Math.abs(signature.score - 0.10);

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

    if (absLat >= 73) {
      domain = DOMAIN.POLAR_ICE;
    } else if (signature.score > 0.17) {
      domain = DOMAIN.LAND_INTERIOR;
    } else if (signature.score > -0.10) {
      domain = DOMAIN.COASTAL_SHELF;
    } else {
      domain = DOMAIN.OCEAN_DEEP;
    }

    edgeRole = (coastDelta < 0.18 || domain === DOMAIN.COASTAL_SHELF || absLat > 66) ? EDGE_ROLE.BOUNDARY : EDGE_ROLE.CORE;

    if (domain === DOMAIN.OCEAN_DEEP) {
      waterDepth = clamp(0.48 + Math.abs(signature.score) * 0.54 + (1 - n) * 0.18, 0.25, 1);
      shelfLevel = 0;
      elevation = -waterDepth;
      relief = waterDepth > 0.72 ? RELIEF.BASIN : RELIEF.PLAIN;
      ridgePressure = n > 0.90 ? 0.20 : 0.05;
      basinPressure = waterDepth;
      mineralPressure = n > 0.91 ? 0.18 : 0.04;
      icePressure = 0;
      material = mineralPressure > 0.15 ? MATERIAL.METAL_OR_MINERAL : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = waterDepth > 0.72 ? "ocean_deep" : "ocean_mid";
      materialHint = "ocean_basin_depth";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "ocean_to_shelf_transition" : "ocean_core";
    } else if (domain === DOMAIN.COASTAL_SHELF) {
      waterDepth = clamp(0.05 + coastDelta * 1.12, 0.03, 0.38);
      shelfLevel = clamp(1 - waterDepth * 2.6, 0, 1);
      elevation = clamp(0.02 - waterDepth * 0.48 + n * 0.08, -0.22, 0.20);
      relief = n > 0.76 ? RELIEF.RIDGE : RELIEF.PLAIN;
      ridgePressure = relief === RELIEF.RIDGE ? 0.34 : 0.13;
      basinPressure = waterDepth;
      mineralPressure = n > 0.75 ? 0.34 : 0.10;
      icePressure = absLat > 58 ? 0.20 : 0;
      material = mineralPressure > 0.30 ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = "coastal_shelf";
      materialHint = "shelf_transition";
      adjacencyClass = "coast_adjacency";
    } else if (domain === DOMAIN.POLAR_ICE) {
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.28 + (absLat - 70) / 34 + n * 0.18, 0.15, 1);
      relief = n > 0.68 ? RELIEF.PLATEAU : RELIEF.PLAIN;
      ridgePressure = n > 0.80 ? 0.34 : 0.12;
      basinPressure = 0.05;
      mineralPressure = n > 0.78 ? 0.25 : 0.08;
      icePressure = clamp((absLat - 62) / 28, 0.25, 1);
      material = MATERIAL.CRYSTAL_OR_ICE;
      terrainClass = lat > 0 ? "north_polar_landmass" : "south_polar_landmass";
      materialHint = "curved_polar_ice";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "polar_edge" : "polar_core";
    } else {
      waterDepth = 0;
      shelfLevel = 0;
      elevation = clamp(0.14 + signature.score * 0.55 + n * 0.26, 0.04, 1);
      relief = n > 0.82 ? RELIEF.RIDGE : n > 0.58 ? RELIEF.PLATEAU : n < 0.22 ? RELIEF.BASIN : RELIEF.PLAIN;
      ridgePressure = relief === RELIEF.RIDGE ? clamp(0.50 + n * 0.28, 0, 1) : relief === RELIEF.PLATEAU ? 0.34 : 0.12;
      basinPressure = relief === RELIEF.BASIN ? 0.62 : 0.08;
      mineralPressure = clamp(0.16 + ridgePressure * 0.46 + signature.fracturePressure * 0.34 + (n > 0.82 ? 0.12 : 0), 0, 1);
      icePressure = absLat > 60 ? 0.14 : 0;
      material = mineralPressure > 0.72 ? MATERIAL.CRYSTAL_OR_ICE : mineralPressure > 0.46 ? MATERIAL.METAL_OR_MINERAL : relief === RELIEF.PLATEAU ? MATERIAL.STONE : MATERIAL.SEDIMENT_OR_ORGANIC;
      terrainClass = signature.body ? signature.body.id : "land_interior";
      materialHint = material === MATERIAL.CRYSTAL_OR_ICE ? "crystal_pressure" : material === MATERIAL.METAL_OR_MINERAL ? "ancient_mineral_pressure" : material === MATERIAL.STONE ? "plateau_stone" : "organic_lowland";
      adjacencyClass = edgeRole === EDGE_ROLE.BOUNDARY ? "land_edge" : "land_core";
    }

    pressure = (ridgePressure + mineralPressure + icePressure > 1.02 || relief === RELIEF.RIDGE) ? PRESSURE.HIGH : PRESSURE.BASE;

    return {
      domain: domain,
      relief: relief,
      edgeRole: edgeRole,
      pressure: pressure,
      material: material,
      state_id: stateId(domain, relief, edgeRole, pressure, material),
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
      land_body_id: signature.body ? signature.body.id : "ocean_or_polar",
      land_body_role: signature.body ? signature.body.role : "ocean_or_polar",
      land_score: round(signature.score, 4),
      fracture_pressure: round(signature.fracturePressure, 4)
    };
  }

  function createPlanetOneHexGrid(options) {
    options = options || {};

    var lonStep = Number(options.lonStep || 4);
    var latStep = Number(options.latStep || 4);
    var seed = Number(options.seed || 256451);
    var cells = [];
    var index = {};
    var lon;
    var lat;
    var row = 0;
    var q;
    var r;
    var cell;
    var surface;
    var id;

    for (lat = -88; lat <= 88; lat += latStep) {
      q = 0;

      for (lon = -180; lon < 180; lon += lonStep) {
        surface = classifySurfaceCell(lon, lat, { seed: seed });
        r = row;
        id = "hex_lat_" + lat + "_lon_" + lon;

        cell = {
          cell_id: id,
          q_coordinate: q,
          r_coordinate: r,
          center_lon: round(lon, 5),
          center_lat: round(lat, 5),
          projected_x: null,
          projected_y: null,
          visibility: "planetary_data_unprojected",
          visible: false,
          domain: surface.domain,
          relief: surface.relief,
          edgeRole: surface.edgeRole,
          pressure: surface.pressure,
          material: surface.material,
          state_id: surface.state_id,
          neighbors: [],
          terrain_class: surface.terrain_class,
          elevation: surface.elevation,
          water_depth: surface.water_depth,
          shelf_level: surface.shelf_level,
          ridge_pressure: surface.ridge_pressure,
          basin_pressure: surface.basin_pressure,
          mineral_pressure: surface.mineral_pressure,
          ice_pressure: surface.ice_pressure,
          material_hint: surface.material_hint,
          adjacency_class: surface.adjacency_class,
          land_body_id: surface.land_body_id,
          land_body_role: surface.land_body_role,
          land_score: surface.land_score,
          fracture_pressure: surface.fracture_pressure
        };

        cells.push(cell);
        index[lat + "," + lon] = cell;
        q += 1;
      }

      row += 1;
    }

    cells.forEach(function (item) {
      var neighborCoords = [
        [item.center_lat, normalizeLon(item.center_lon + lonStep)],
        [item.center_lat, normalizeLon(item.center_lon - lonStep)],
        [item.center_lat + latStep, item.center_lon],
        [item.center_lat - latStep, item.center_lon],
        [item.center_lat + latStep, normalizeLon(item.center_lon + lonStep)],
        [item.center_lat - latStep, normalizeLon(item.center_lon - lonStep)]
      ];

      item.neighbors = neighborCoords.map(function (pair) {
        var key = pair[0] + "," + pair[1];
        return index[key] ? index[key].cell_id : null;
      }).filter(Boolean);
    });

    lastGrid = {
      version: VERSION,
      baseline: BASELINE,
      stateFormula: STATE_FORMULA,
      stateCount: STATE_COUNT,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      projectionModel: "planetary_lat_lon_surface_samples",
      publicMode: "satellite_observational",
      debugMode: "cell-debug",
      landmassLaw: "2_dynamic_hemispheric_side_structures_plus_3_secondary_non_polar_bodies_plus_2_poles",
      axes: {
        domain: true,
        relief: true,
        edgeRole: true,
        pressure: true,
        material: true
      },
      seed: seed,
      lonStep: lonStep,
      latStep: latStep,
      cells: cells,
      cellCount: cells.length,
      visibleCellCount: 0
    };

    return lastGrid;
  }

  function orthographicProject(lon, lat, viewLon, viewLat, cx, cy, radius) {
    var lambda = degToRad(normalizeLon(lon - viewLon));
    var phi = degToRad(lat);
    var phi0 = degToRad(viewLat || 0);
    var cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);

    if (cosc <= 0) {
      return {
        visible: false,
        z: cosc,
        x: null,
        y: null,
        scale: 0
      };
    }

    return {
      visible: true,
      z: cosc,
      x: cx + radius * Math.cos(phi) * Math.sin(lambda),
      y: cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda)),
      scale: clamp(0.18 + cosc * 0.82, 0.18, 1)
    };
  }

  function satelliteColor(cell, limbScale) {
    var tone = clamp(0.48 + cell.elevation * 0.16 + cell.mineral_pressure * 0.10 + cell.ice_pressure * 0.16 - cell.water_depth * 0.18, 0, 1);
    var r;
    var g;
    var b;
    var a;

    if (cell.domain === DOMAIN.OCEAN_DEEP) {
      r = 8 + tone * 16;
      g = 28 + tone * 56;
      b = 66 + tone * 82;
      a = 0.34 + limbScale * 0.22;
    } else if (cell.domain === DOMAIN.COASTAL_SHELF) {
      r = 44 + tone * 58;
      g = 82 + tone * 72;
      b = 88 + tone * 56;
      a = 0.30 + limbScale * 0.20;
    } else if (cell.domain === DOMAIN.POLAR_ICE) {
      r = 168 + tone * 74;
      g = 194 + tone * 54;
      b = 210 + tone * 38;
      a = 0.32 + limbScale * 0.24;
    } else {
      r = 58 + tone * 82 + cell.mineral_pressure * 30;
      g = 74 + tone * 64 + cell.elevation * 18;
      b = 46 + tone * 40 + cell.ridge_pressure * 18;
      a = 0.32 + limbScale * 0.24;
    }

    return "rgba(" + Math.round(clamp(r, 0, 255)) + "," + Math.round(clamp(g, 0, 255)) + "," + Math.round(clamp(b, 0, 255)) + "," + round(clamp(a, 0.18, 0.72), 3) + ")";
  }

  function drawSatelliteSample(ctx, cell, projected, radius, options) {
    var sampleRadius = Math.max(1.1, radius * 0.0065 * projected.scale);
    var elongation = Math.max(0.55, projected.scale);
    var ry = sampleRadius * (0.72 + projected.scale * 0.28);

    ctx.save();
    ctx.globalAlpha *= clamp(0.26 + projected.z * 0.58, 0.18, 0.84);
    ctx.fillStyle = satelliteColor(cell, projected.scale);
    ctx.beginPath();
    ctx.ellipse(projected.x, projected.y, sampleRadius, ry * elongation, 0, 0, Math.PI * 2);
    ctx.fill();

    if (cell.edgeRole === EDGE_ROLE.BOUNDARY && cell.domain !== DOMAIN.OCEAN_DEEP && options.coastGlow !== false) {
      ctx.globalAlpha *= 0.45;
      ctx.fillStyle = cell.domain === DOMAIN.COASTAL_SHELF ? "rgba(222,202,132,.24)" : "rgba(255,255,255,.08)";
      ctx.beginPath();
      ctx.ellipse(projected.x, projected.y, sampleRadius * 1.55, ry * 1.10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDebugHex(ctx, cell, projected, radius) {
    var size = Math.max(2.2, radius * 0.013 * projected.scale);
    var i;
    var angle;
    var x;
    var y;

    ctx.save();
    ctx.globalAlpha = clamp(0.22 + projected.z * 0.55, 0.22, 0.78);
    ctx.beginPath();

    for (i = 0; i < 6; i += 1) {
      angle = Math.PI / 180 * (60 * i - 30);
      x = projected.x + size * Math.cos(angle);
      y = projected.y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = satelliteColor(cell, projected.scale);
    ctx.fill();
    ctx.strokeStyle = cell.edgeRole === EDGE_ROLE.BOUNDARY ? "rgba(242,199,111,.34)" : "rgba(255,255,255,.12)";
    ctx.lineWidth = cell.edgeRole === EDGE_ROLE.BOUNDARY ? 0.8 : 0.38;
    ctx.stroke();
    ctx.restore();
  }

  function resolveContext(target) {
    if (!target) return null;
    if (target.canvas && typeof target.fillRect === "function") return target;
    if (target.getContext && typeof target.getContext === "function") return target.getContext("2d");
    if (target.ctx && target.ctx.canvas) return target.ctx;
    if (target.context && target.context.canvas) return target.context;
    return null;
  }

  function drawPlanetOneHexGrid(target, gridOrOptions, maybeOptions) {
    var ctx = resolveContext(target);
    var grid;
    var options;
    var renderMode;
    var cx;
    var cy;
    var radius;
    var viewLon;
    var viewLat;
    var visibleCount = 0;

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
      grid = createPlanetOneHexGrid(options);
    }

    renderMode = options.renderMode || DEFAULT_RENDER_MODE;
    cx = Number(options.centerX || ctx.canvas.width / 2);
    cy = Number(options.centerY || ctx.canvas.height / 2);
    radius = Number(options.radius || Math.min(ctx.canvas.width, ctx.canvas.height) * 0.43);
    viewLon = Number(options.viewLon || options.centerLon || -28);
    viewLat = Number(options.viewLat || options.centerLat || 0);

    ctx.save();

    grid.cells.forEach(function (cell) {
      var projected = orthographicProject(cell.center_lon, cell.center_lat, viewLon, viewLat, cx, cy, radius);
      cell.visible = projected.visible;
      cell.visibility = projected.visible ? "visible_projected_hemisphere" : "hidden_far_hemisphere";
      cell.projected_x = projected.visible ? round(projected.x, 3) : null;
      cell.projected_y = projected.visible ? round(projected.y, 3) : null;

      if (!projected.visible) return;

      visibleCount += 1;

      if (renderMode === "cell-debug") {
        drawDebugHex(ctx, cell, projected, radius);
      } else {
        drawSatelliteSample(ctx, cell, projected, radius, options);
      }
    });

    ctx.restore();

    grid.visibleCellCount = visibleCount;

    lastDraw = {
      ok: true,
      version: VERSION,
      renderMode: renderMode,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      projectionModel: "orthographic_orbital_projection",
      satelliteObservationalModeActive: renderMode === "satellite",
      cellDebugModeAvailable: true,
      publicHoneycombBlocked: renderMode === "satellite",
      cellCount: grid.cellCount,
      visibleCellCount: visibleCount,
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
      publicHoneycombBlocked: true,
      defaultRenderMode: DEFAULT_RENDER_MODE,
      projectionModel: "planetary_lat_lon_to_orthographic_projection",
      twoDynamicHemisphericLandStructuresActive: true,
      threeSecondaryNonPolarBodiesActive: true,
      sevenLandmassLawActive: true,
      nonPolarLandBodyCount: 5,
      polarLandBodyCount: 2,
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
        lonStep: 4,
        latStep: 4,
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
    stateFormula: STATE_FORMULA,
    stateCount: STATE_COUNT,
    defaultRenderMode: DEFAULT_RENDER_MODE,
    satelliteObservationalModeActive: true,
    cellDebugModeAvailable: true,
    publicHoneycombBlocked: true,
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
