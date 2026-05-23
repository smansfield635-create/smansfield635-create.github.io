// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_RUNTIME_DYNAMIC_ROW_OVERLAP_WEAVE_SURFACE_RENDER_TNT_v1
// Full-file replacement.
// Scope: runtime carrier only.
// Purpose: replace isolated parcel-circle Surface rendering with dynamic-row overlapping woven terrain mesh.
// Preserves: dry terrain atlas source truth, material layer separation, zoom, full-globe lattice, hydration hold.
// Does not own: terrain truth, hydration truth, edge truth, HTML, climate, ecology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_RUNTIME_DYNAMIC_ROW_OVERLAP_WEAVE_SURFACE_RENDER_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var LATTICE_COUNT = 256;

  var ZOOM = Object.freeze({
    min: 0.72,
    defaultValue: 1.0,
    max: 2.45
  });

  var DRY_TERRAIN_GLOBALS = Object.freeze([
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ]);

  var LENSES = Object.freeze({
    body: "Body",
    surface: "Surface",
    hydration: "Hydration",
    "sixth-sense": "Sixth Sense",
    lattice: "Lattice",
    receipt: "Receipt"
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,

    activeLens: "body",
    yaw: -0.62,
    pitch: -0.16,
    vx: 0,
    vy: 0,
    zoom: ZOOM.defaultValue,

    pointers: new Map(),
    dragging: false,
    pinching: false,
    px: 0,
    py: 0,
    pinchStartDistance: 0,
    pinchStartZoom: ZOOM.defaultValue,
    lastTap: 0,

    raf: 0,
    renderCount: 0,
    stopped: false,

    dryTerrainApi: null,
    dryTerrainDetected: false,
    dryTerrainApiComplete: false,
    dryTerrainValidated: false,
    dryTerrainStatus: null,
    dryCarrierPacket: null,
    dryTerrainPacket: null,
    dryFailureReason: "dry terrain not checked",

    dynamicSurfaceRows: [],
    wovenSurfaceNodes: [],
    overlapInfluenceField: [],
    meshContinuityField: [],
    surfaceSkinPacket: null,
    meshReady: false,

    latticeSeats: [],
    latticeLinks: [],
    latticeReady: false,

    errors: []
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try { window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop(); } catch (_error) {}
  }

  function normalizeRoute(value) {
    var text = String(value || "");
    return text.endsWith("/") ? text : text + "/";
  }

  function routeAllowed() {
    var htmlRoute = normalizeRoute(document.documentElement.getAttribute("data-route") || "");
    var path = normalizeRoute(window.location ? window.location.pathname : "");
    return htmlRoute === ROUTE || path === ROUTE;
  }

  function clamp(value, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round((Number(value) || 0) * scale) / scale;
  }

  function firstGlobal(names) {
    for (var i = 0; i < names.length; i += 1) {
      if (window[names[i]]) return window[names[i]];
    }
    return null;
  }

  function safeCall(scope, api, method) {
    if (!api || typeof api[method] !== "function") return null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 3));
    } catch (error) {
      state.errors.push({
        scope: scope + "." + method,
        message: error && error.message ? error.message : String(error),
        time: new Date().toISOString()
      });
      return null;
    }
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = lonDeg * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + ((x % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - (clamp(y, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1)) * 160
    };
  }

  function rotate(point) {
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;

    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);
    var y1 = y * cp - z1 * sp;
    var z2 = y * sp + z1 * cp;

    return { x: x1, y: y1, z: z2 };
  }

  function metrics() {
    var min = Math.min(state.width, state.height);
    var baseRadius = min * 0.405;
    var radius = baseRadius * state.zoom;

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      r: radius,
      baseRadius: baseRadius,
      camera: 3.92
    };
  }

  function project(point) {
    var m = metrics();
    var p = rotate(point);
    var scale = m.camera / Math.max(0.72, m.camera - p.z);

    return {
      x: m.cx + p.x * m.r * scale,
      y: m.cy - p.y * m.r * scale,
      z: p.z,
      front: p.z >= -0.06,
      scale: scale
    };
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.003, 0, TAU);
    ctx.clip();
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function resize() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));

    state.dpr = dpr;
    state.width = Math.max(320, Math.floor(rect.width * dpr));
    state.height = Math.max(600, Math.floor(rect.height * dpr));
    state.canvas.width = state.width;
    state.canvas.height = state.height;

    requestRender();
  }

  function setZoom(nextZoom) {
    state.zoom = clamp(nextZoom, ZOOM.min, ZOOM.max);
    publishStatus();
    requestRender();
  }

  function resetCamera() {
    state.yaw = -0.62;
    state.pitch = -0.16;
    state.vx = 0;
    state.vy = 0;
    state.zoom = ZOOM.defaultValue;
    requestRender();
  }

  function pointerDistance() {
    var points = Array.from(state.pointers.values());
    if (points.length < 2) return 0;

    var dx = points[0].x - points[1].x;
    var dy = points[0].y - points[1].y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function detectDryTerrain() {
    var api = firstGlobal(DRY_TERRAIN_GLOBALS);

    state.dryTerrainApi = api;
    state.dryTerrainDetected = Boolean(api);
    state.dryTerrainApiComplete = Boolean(
      api &&
      typeof api.status === "function" &&
      typeof api.getCarrierTerrainPacket === "function" &&
      typeof api.getDryRevealedTerrainPacket === "function"
    );

    state.dryTerrainStatus = null;
    state.dryCarrierPacket = null;
    state.dryTerrainPacket = null;
    state.dryTerrainValidated = false;

    if (!state.dryTerrainDetected) {
      state.dryFailureReason = "dry revealed terrain atlas missing";
      rebuildSurfaceMesh();
      publishStatus();
      requestRender();
      return false;
    }

    if (!state.dryTerrainApiComplete) {
      state.dryFailureReason = "dry revealed terrain atlas API incomplete";
      rebuildSurfaceMesh();
      publishStatus();
      requestRender();
      return false;
    }

    state.dryTerrainStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-runtime-carrier", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-runtime-carrier", { compact: false });

    state.dryTerrainValidated = Boolean(
      state.dryTerrainStatus &&
      state.dryTerrainStatus.audraliaLevelTerrainAuthority === true &&
      state.dryTerrainStatus.activeHydration === false &&
      state.dryTerrainStatus.hydrationHeld === true &&
      state.dryCarrierPacket &&
      state.dryCarrierPacket.carrierTerrainPacketReady === true &&
      state.dryCarrierPacket.carrierInventsTerrain === false &&
      state.dryCarrierPacket.finalVisualPassClaim === false
    );

    state.dryFailureReason = state.dryTerrainValidated ? "" : "dry terrain atlas validation failed";

    rebuildSurfaceMesh();
    publishStatus();
    requestRender();

    return state.dryTerrainValidated;
  }

  function dryPacket() {
    return state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;
  }

  function dryNodes() {
    var packet = dryPacket();
    return packet && Array.isArray(packet.nodes) ? packet.nodes : [];
  }

  function fieldNodes(fieldName) {
    var packet = dryPacket();
    var field = packet && packet[fieldName] ? packet[fieldName] : null;
    return field && Array.isArray(field.nodes) ? field.nodes : [];
  }

  function futureFillNodes() {
    return fieldNodes("futureFillGapField");
  }

  function ridgeMountainNodes() {
    return fieldNodes("ridgeMountainField");
  }

  function basinTrenchValleyNodes() {
    return fieldNodes("basinTrenchValleyField");
  }

  function buildNodeGrid(nodes) {
    var grid = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      grid[y] = [];
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        grid[y][x] = null;
      }
    }

    nodes.forEach(function (node) {
      var x = clamp(Math.round(Number(node.x || 0)), 0, RADIAL_NODES - 1);
      var y = clamp(Math.round(Number(node.y || 0)), 0, FIBONACCI_BANDS - 1);
      grid[y][x] = node;
    });

    return grid;
  }

  function numeric(node, key, fallback) {
    var value = Number(node && node[key]);
    return Number.isFinite(value) ? value : fallback;
  }

  function addRoleScore(scores, role, weight) {
    var key = String(role || "stable_core");
    scores[key] = (scores[key] || 0) + weight;
  }

  function dominantRole(scores) {
    var best = "stable_core";
    var bestWeight = -Infinity;

    Object.keys(scores).forEach(function (key) {
      if (scores[key] > bestWeight) {
        best = key;
        bestWeight = scores[key];
      }
    });

    return best;
  }

  function sampleNeighborInfluence(node, nodes) {
    var grid = buildNodeGrid(nodes);
    return sampleTerrainAt(grid, Number(node.x || 0), Number(node.y || 0));
  }

  function sampleTerrainAt(grid, xf, yf) {
    var roleScores = {};
    var total = 0;
    var out = {
      x: xf,
      y: yf,
      dryElevation: 0,
      elevation: 0,
      relativeRelief: 0,
      mountainPressure: 0,
      ridgePressure: 0,
      summitPressure: 0,
      basinPressure: 0,
      trenchPressure: 0,
      valleyPressure: 0,
      shelfPressure: 0,
      escarpmentPressure: 0,
      gapPressure: 0,
      futureFillEligible: false,
      formerHydrosphereCarved: false,
      formerHydrosphereCarvingValue: 0,
      primaryTerrainRole: "stable_core",
      terrainClass: "stable_craton"
    };

    for (var dy = -2; dy <= 2; dy += 1) {
      for (var dx = -2; dx <= 2; dx += 1) {
        var sx = ((Math.round(xf) + dx) % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES;
        var sy = clamp(Math.round(yf) + dy, 0, FIBONACCI_BANDS - 1);
        var node = grid[sy] && grid[sy][sx];

        if (!node) continue;

        var wrapDx = Math.min(
          Math.abs((xf - sx + RADIAL_NODES) % RADIAL_NODES),
          Math.abs((sx - xf + RADIAL_NODES) % RADIAL_NODES)
        );
        var dist = Math.sqrt(wrapDx * wrapDx + Math.pow(yf - sy, 2));
        var weight = 1 / Math.pow(0.72 + dist, 2.15);

        total += weight;
        out.dryElevation += numeric(node, "dryElevation", numeric(node, "elevation", 0.5)) * weight;
        out.elevation += numeric(node, "elevation", numeric(node, "dryElevation", 0.5)) * weight;
        out.relativeRelief += numeric(node, "relativeRelief", 0) * weight;
        out.mountainPressure += numeric(node, "mountainPressure", 0) * weight;
        out.ridgePressure += numeric(node, "ridgePressure", 0) * weight;
        out.summitPressure += numeric(node, "summitPressure", 0) * weight;
        out.basinPressure += numeric(node, "basinPressure", 0) * weight;
        out.trenchPressure += numeric(node, "trenchPressure", 0) * weight;
        out.valleyPressure += numeric(node, "valleyPressure", 0) * weight;
        out.shelfPressure += numeric(node, "shelfPressure", 0) * weight;
        out.escarpmentPressure += numeric(node, "escarpmentPressure", 0) * weight;
        out.gapPressure += numeric(node, "gapPressure", 0) * weight;
        out.formerHydrosphereCarvingValue += numeric(node, "formerHydrosphereCarvingValue", 0) * weight;

        if (node.futureFillEligible) out.futureFillEligible = true;
        if (node.formerHydrosphereCarved) out.formerHydrosphereCarved = true;

        addRoleScore(roleScores, node.primaryTerrainRole || node.terrainClass, weight);
      }
    }

    if (!total) return out;

    out.dryElevation = round(out.dryElevation / total, 4);
    out.elevation = round(out.elevation / total, 4);
    out.relativeRelief = round(out.relativeRelief / total, 4);
    out.mountainPressure = round(out.mountainPressure / total, 4);
    out.ridgePressure = round(out.ridgePressure / total, 4);
    out.summitPressure = round(out.summitPressure / total, 4);
    out.basinPressure = round(out.basinPressure / total, 4);
    out.trenchPressure = round(out.trenchPressure / total, 4);
    out.valleyPressure = round(out.valleyPressure / total, 4);
    out.shelfPressure = round(out.shelfPressure / total, 4);
    out.escarpmentPressure = round(out.escarmentPressure / total || out.escarpmentPressure / total, 4);
    out.gapPressure = round(out.gapPressure / total, 4);
    out.formerHydrosphereCarvingValue = round(out.formerHydrosphereCarvingValue / total, 4);
    out.primaryTerrainRole = dominantRole(roleScores);
    out.terrainClass = out.primaryTerrainRole;

    return out;
  }

  function buildDynamicSurfaceRows(nodes) {
    var rows = [];
    var rowCount = FIBONACCI_BANDS * 2 - 1;

    for (var i = 0; i < rowCount; i += 1) {
      var sourceBand = i * 0.5;
      var normalized = sourceBand / (FIBONACCI_BANDS - 1);
      var latitude = 80 - normalized * 160;
      var latitudeCompression = 0.62 + Math.cos((normalized - 0.5) * Math.PI) * 0.42;
      var rowTerrainPressure = 0;
      var rowFutureFillPressure = 0;
      var inspected = 0;

      nodes.forEach(function (node) {
        if (Math.abs(Number(node.y || 0) - sourceBand) <= 1.05) {
          rowTerrainPressure += numeric(node, "dryElevation", 0.5);
          rowFutureFillPressure += node.futureFillEligible ? 1 : numeric(node, "gapPressure", 0);
          inspected += 1;
        }
      });

      if (inspected) {
        rowTerrainPressure /= inspected;
        rowFutureFillPressure /= inspected;
      }

      rows.push(Object.freeze({
        rowId: "DYNAMIC-WEAVE-ROW-" + String(i).padStart(2, "0"),
        sourceBand: round(sourceBand, 3),
        latitude: round(latitude, 3),
        rowCompression: round(clamp(latitudeCompression, 0.45, 1.18), 4),
        rowOffset: round(((i % 2) * 0.84 + Math.sin(i * 1.618) * 0.34 + (rowFutureFillPressure > 0.35 ? 0.31 : 0)) % RADIAL_NODES, 4),
        rowWeaveAngle: round((i % 4 - 1.5) * 0.11, 4),
        rowKernelScale: round(clamp(1.28 + latitudeCompression * 0.38 + rowTerrainPressure * 0.22, 1.24, 1.92), 4),
        rowOpacity: round(clamp(0.44 + rowTerrainPressure * 0.22, 0.34, 0.72), 4),
        rowDepthBias: round(clamp(0.18 + latitudeCompression * 0.18, 0.14, 0.38), 4),
        rowTerrainPressure: round(rowTerrainPressure, 4),
        rowFutureFillPressure: round(rowFutureFillPressure, 4),
        visibleSampleCount: i % 3 === 0 ? 7 : 8
      }));
    }

    return Object.freeze(rows);
  }

  function buildWovenSurfaceNodes(nodes, rows) {
    var grid = buildNodeGrid(nodes);
    var kernels = [];

    rows.forEach(function (row, rowIndex) {
      var count = row.visibleSampleCount;

      for (var i = 0; i < count; i += 1) {
        var step = RADIAL_NODES / count;
        var xf = (i * step + row.rowOffset + Math.sin(rowIndex * 0.72 + i * 0.38) * 0.34) % RADIAL_NODES;
        var yf = row.sourceBand;
        var sample = sampleTerrainAt(grid, xf, yf);
        var ll = terrainSeatToLonLat(xf, yf);
        var continuity = clamp(
          0.28 +
          sample.dryElevation * 0.26 +
          sample.mountainPressure * 0.12 +
          sample.ridgePressure * 0.10 +
          sample.shelfPressure * 0.10 -
          sample.gapPressure * 0.08,
          0.18,
          0.92
        );

        var kernelScale = clamp(
          row.rowKernelScale +
          sample.mountainPressure * 0.18 +
          sample.ridgePressure * 0.12 +
          sample.basinPressure * 0.08 +
          sample.formerHydrosphereCarvingValue * 0.12,
          1.15,
          2.15
        );

        kernels.push(Object.freeze({
          kernelId: row.rowId + "-KERNEL-" + String(i).padStart(2, "0"),
          rowId: row.rowId,
          sourceBand: row.sourceBand,
          rowIndex: rowIndex,
          sampleIndex: i,
          x: round(xf, 4),
          y: round(yf, 4),
          lon: ll.lon,
          lat: ll.lat,
          point: lonLatPoint(ll.lon, ll.lat),

          dryElevation: sample.dryElevation,
          elevation: sample.elevation,
          relativeRelief: sample.relativeRelief,
          mountainPressure: sample.mountainPressure,
          ridgePressure: sample.ridgePressure,
          summitPressure: sample.summitPressure,
          basinPressure: sample.basinPressure,
          trenchPressure: sample.trenchPressure,
          valleyPressure: sample.valleyPressure,
          shelfPressure: sample.shelfPressure,
          escarpmentPressure: sample.escarpmentPressure,
          gapPressure: sample.gapPressure,
          futureFillEligible: sample.futureFillEligible,
          formerHydrosphereCarved: sample.formerHydrosphereCarved,
          formerHydrosphereCarvingValue: sample.formerHydrosphereCarvingValue,

          primaryTerrainRole: sample.primaryTerrainRole,
          terrainClass: sample.terrainClass,

          kernelScale: round(kernelScale, 4),
          kernelOpacity: round(clamp(row.rowOpacity * (0.72 + continuity * 0.44), 0.22, 0.78), 4),
          overlapRadiusMultiplier: round(clamp(1.58 + continuity * 0.68, 1.52, 2.22), 4),
          continuityWeight: round(continuity, 4),
          weaveAngle: row.rowWeaveAngle,

          renderAsRawParcel: false,
          renderAsWovenKernel: true,
          surfaceRenderIsDerived: true,
          raw256VisibleOnlyInLattice: true,
          finalVisualPassClaim: false
        }));
      }
    });

    return Object.freeze(kernels);
  }

  function rebuildSurfaceMesh() {
    var nodes = dryNodes();

    if (!state.dryTerrainValidated || !nodes.length) {
      state.dynamicSurfaceRows = [];
      state.wovenSurfaceNodes = [];
      state.overlapInfluenceField = [];
      state.meshContinuityField = [];
      state.surfaceSkinPacket = null;
      state.meshReady = false;
      return;
    }

    state.dynamicSurfaceRows = buildDynamicSurfaceRows(nodes);
    state.wovenSurfaceNodes = buildWovenSurfaceNodes(nodes, state.dynamicSurfaceRows);
    state.overlapInfluenceField = Object.freeze(state.wovenSurfaceNodes.map(function (kernel) {
      return Object.freeze({
        kernelId: kernel.kernelId,
        overlapRadiusMultiplier: kernel.overlapRadiusMultiplier,
        continuityWeight: kernel.continuityWeight,
        rowId: kernel.rowId
      });
    }));
    state.meshContinuityField = Object.freeze(state.dynamicSurfaceRows.map(function (row) {
      return Object.freeze({
        rowId: row.rowId,
        sourceBand: row.sourceBand,
        rowCompression: row.rowCompression,
        rowTerrainPressure: row.rowTerrainPressure,
        rowFutureFillPressure: row.rowFutureFillPressure,
        visibleSampleCount: row.visibleSampleCount
      });
    }));

    state.surfaceSkinPacket = Object.freeze({
      contract: CONTRACT,
      packetType: "derived_dynamic_row_overlap_weave_surface_skin_packet",
      terrainAtlasRemainsSource: true,
      carrierInventsTerrain: false,
      surfaceRenderIsDerived: true,
      raw256VisibleOnlyInLattice: true,
      dynamicRowCount: state.dynamicSurfaceRows.length,
      wovenKernelCount: state.wovenSurfaceNodes.length,
      sourceSeatCount: LATTICE_COUNT,
      visibleKernelDensityReduced: true,
      kernelOverlapIncreased: true,
      finalVisualPassClaim: false
    });

    state.meshReady = Boolean(state.dynamicSurfaceRows.length && state.wovenSurfaceNodes.length);
  }

  function getMeshReceipt() {
    return {
      contract: CONTRACT,
      dynamicRowWeaveActive: state.meshReady,
      overlapMeshActive: state.meshReady,
      dynamicRowCount: state.dynamicSurfaceRows.length,
      wovenKernelCount: state.wovenSurfaceNodes.length,
      sourceSeatCount: LATTICE_COUNT,
      raw256VisibleOnlyInLattice: true,
      terrainAtlasRemainsSource: true,
      carrierInventsTerrain: false,
      surfaceRenderIsDerived: true,
      finalVisualPassClaim: false
    };
  }

  function buildLatticeGeometry() {
    var seats = [];
    var links = [];

    function makeSeat(band, radial) {
      var v = (band + 0.5) / FIBONACCI_BANDS;
      var lat = Math.asin(1 - 2 * v);
      var lon = (radial / RADIAL_NODES) * TAU - Math.PI;
      var clat = Math.cos(lat);
      var index = band * RADIAL_NODES + radial;

      return {
        index: index,
        band: band,
        radial: radial,
        x: clat * Math.cos(lon),
        y: Math.sin(lat),
        z: clat * Math.sin(lon),
        major: radial % 4 === 0 || band % 4 === 0,
        secondary: radial % 2 === 0 || band % 2 === 0
      };
    }

    function seat(band, radial) {
      return seats[band * RADIAL_NODES + ((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function addLink(a, b, family, major) {
      links.push({ a: a, b: b, family: family, major: Boolean(major) });
    }

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (var radial = 0; radial < RADIAL_NODES; radial += 1) {
        seats.push(makeSeat(band, radial));
      }
    }

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        addLink(seat(y, x), seat(y, x + 1), "ring", y % 4 === 0 || x % 4 === 0);
        if (y < FIBONACCI_BANDS - 1) {
          addLink(seat(y, x), seat(y + 1, x), "spine", x % 4 === 0);
          addLink(seat(y, x), seat(y + 1, x + [1, 2, 3, 5, 8, 13][y % 6]), "fibonacci", y % 4 === 0 || x % 4 === 0);
        }
      }
    }

    state.latticeSeats = Object.freeze(seats);
    state.latticeLinks = Object.freeze(links);
    state.latticeReady = state.latticeSeats.length === LATTICE_COUNT;
  }

  function drawPlanetShadowBody() {
    var ctx = state.ctx;
    var m = metrics();

    var base = ctx.createRadialGradient(m.cx - m.r * 0.28, m.cy - m.r * 0.38, 0, m.cx, m.cy, m.r * 1.18);
    base.addColorStop(0.00, "rgba(60,76,84,0.98)");
    base.addColorStop(0.20, "rgba(35,50,61,0.98)");
    base.addColorStop(0.48, "rgba(11,24,42,1)");
    base.addColorStop(0.78, "rgba(4,11,24,1)");
    base.addColorStop(1.00, "rgba(1,5,14,1)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r, 0, TAU);
    ctx.fillStyle = base;
    ctx.fill();

    ctx.save();
    clipSphere();

    var directional = ctx.createLinearGradient(m.cx - m.r, m.cy - m.r, m.cx + m.r, m.cy + m.r);
    directional.addColorStop(0.00, "rgba(255,255,255,0.050)");
    directional.addColorStop(0.36, "rgba(255,255,255,0.012)");
    directional.addColorStop(0.72, "rgba(0,0,0,0.26)");
    directional.addColorStop(1.00, "rgba(0,0,0,0.54)");
    ctx.fillStyle = directional;
    ctx.fillRect(m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);

    ctx.restore();
  }

  function drawHydrosphereMemoryUnderlayer() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    clipSphere();

    var memory = ctx.createRadialGradient(m.cx - m.r * 0.34, m.cy - m.r * 0.28, 0, m.cx, m.cy, m.r * 1.08);
    memory.addColorStop(0.00, "rgba(105,184,212,0.30)");
    memory.addColorStop(0.28, "rgba(37,101,148,0.23)");
    memory.addColorStop(0.58, "rgba(8,42,91,0.21)");
    memory.addColorStop(1.00, "rgba(0,12,38,0.25)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 0.995, 0, TAU);
    ctx.fillStyle = memory;
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphereRim() {
    var ctx = state.ctx;
    var m = metrics();

    var rim = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.93, m.cx, m.cy, m.r * 1.105);
    rim.addColorStop(0.00, "rgba(141,216,255,0.000)");
    rim.addColorStop(0.62, "rgba(141,216,255,0.018)");
    rim.addColorStop(0.84, "rgba(141,216,255,0.115)");
    rim.addColorStop(1.00, "rgba(141,216,255,0.000)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.11, 0, TAU);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,0.22)";
    ctx.lineWidth = Math.max(0.75, state.dpr * 0.78);
    ctx.stroke();
  }

  function kernelRGB(kernel) {
    var role = String(kernel.primaryTerrainRole || kernel.terrainClass || "");
    var elevation = Number(kernel.dryElevation || 0.5);

    if (role.indexOf("mountain") >= 0 || role.indexOf("ridge") >= 0 || role.indexOf("summit") >= 0) {
      return {
        r: Math.floor(150 + elevation * 76),
        g: Math.floor(128 + elevation * 70),
        b: Math.floor(88 + elevation * 54)
      };
    }

    if (role.indexOf("basin") >= 0 || role.indexOf("trench") >= 0 || role.indexOf("former_seabed") >= 0 || kernel.futureFillEligible) {
      return {
        r: Math.floor(66 + elevation * 60),
        g: Math.floor(82 + elevation * 64),
        b: Math.floor(68 + elevation * 46)
      };
    }

    if (role.indexOf("shelf") >= 0 || role.indexOf("escarpment") >= 0 || role.indexOf("gap") >= 0) {
      return {
        r: Math.floor(132 + elevation * 72),
        g: Math.floor(112 + elevation * 62),
        b: Math.floor(76 + elevation * 48)
      };
    }

    return {
      r: Math.floor(100 + elevation * 68),
      g: Math.floor(118 + elevation * 68),
      b: Math.floor(78 + elevation * 48)
    };
  }

  function rgba(rgb, alpha) {
    return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + alpha.toFixed(3) + ")";
  }

  function hexKernelPath(ctx, x, y, radius, angle) {
    ctx.beginPath();

    for (var i = 0; i < 6; i += 1) {
      var a = angle + Math.PI / 6 + i * TAU / 6;
      var px = x + Math.cos(a) * radius;
      var py = y + Math.sin(a) * radius * 0.84;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();
  }

  function drawWovenKernel(kernel, mode, pass) {
    var ctx = state.ctx;
    var p = project(kernel.point);

    if (!p.front && mode !== "lattice") return;

    var m = metrics();
    var rgb = kernelRGB(kernel);
    var backFade = p.front ? 1 : 0.18;
    var base = m.r * 0.072;
    var radiusMultiplier = pass === "under" ? kernel.overlapRadiusMultiplier : pass === "relief" ? 0.58 : 1.06;
    var radius = Math.max(4.5, base * kernel.kernelScale * radiusMultiplier * p.scale);
    var opacityBase = mode === "body" ? 0.20 : mode === "sixth-sense" ? 0.48 : 0.56;
    var alpha = clamp(kernel.kernelOpacity * opacityBase * backFade, 0.035, 0.62);

    if (pass === "under") alpha *= 0.44;
    if (pass === "relief") alpha *= 0.72;

    ctx.save();
    ctx.globalCompositeOperation = pass === "under" ? "source-over" : "source-over";

    var gradient = ctx.createRadialGradient(
      p.x - radius * 0.24,
      p.y - radius * 0.20,
      radius * 0.05,
      p.x,
      p.y,
      radius
    );

    if (pass === "relief") {
      gradient.addColorStop(0.00, "rgba(255,226,162," + clamp(alpha * 1.15, 0, 0.72).toFixed(3) + ")");
      gradient.addColorStop(0.52, rgba(rgb, alpha * 0.46));
      gradient.addColorStop(1.00, rgba(rgb, 0.000));
    } else if (kernel.futureFillEligible || kernel.gapPressure > 0.44) {
      gradient.addColorStop(0.00, rgba(rgb, alpha * 0.90));
      gradient.addColorStop(0.44, "rgba(18,29,31," + clamp(alpha * 0.92, 0, 0.62).toFixed(3) + ")");
      gradient.addColorStop(1.00, "rgba(18,29,31,0.000)");
    } else {
      gradient.addColorStop(0.00, rgba(rgb, alpha));
      gradient.addColorStop(0.56, rgba(rgb, alpha * 0.58));
      gradient.addColorStop(1.00, rgba(rgb, 0.000));
    }

    hexKernelPath(ctx, p.x, p.y, radius, kernel.weaveAngle + state.yaw * 0.18);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  function drawWovenSurfaceMesh(mode) {
    if (!state.meshReady) return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < state.wovenSurfaceNodes.length; i += 1) {
      drawWovenKernel(state.wovenSurfaceNodes[i], mode, "under");
    }

    for (var j = 0; j < state.wovenSurfaceNodes.length; j += 1) {
      drawWovenKernel(state.wovenSurfaceNodes[j], mode, "main");
    }

    if (mode === "surface" || mode === "sixth-sense") {
      for (var k = 0; k < state.wovenSurfaceNodes.length; k += 1) {
        var kernel = state.wovenSurfaceNodes[k];
        if (kernel.mountainPressure > 0.54 || kernel.ridgePressure > 0.54 || kernel.summitPressure > 0.48) {
          drawWovenKernel(kernel, mode, "relief");
        }
      }
    }

    ctx.restore();
  }

  function drawFutureFillMesh(mode) {
    if (!state.meshReady || mode === "body") return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    state.wovenSurfaceNodes.forEach(function (kernel) {
      if (!kernel.futureFillEligible && kernel.gapPressure < 0.42) return;

      var p = project(kernel.point);
      if (!p.front) return;

      var radius = Math.max(2.2, metrics().r * 0.022 * kernel.kernelScale * p.scale);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = mode === "hydration" ? "rgba(116,171,184,0.19)" : "rgba(10,17,20,0.38)";
      ctx.fill();
    });

    ctx.restore();
  }

  function drawDryTerrainRelationships() {
    if (!state.meshReady) return;

    state.wovenSurfaceNodes.forEach(function (kernel, index) {
      if (index % 3 !== 0) return;
      if (kernel.continuityWeight < 0.35) return;
      drawWovenKernel(kernel, "sixth-sense", kernel.futureFillEligible ? "under" : "relief");
    });

    drawFutureFillMesh("sixth-sense");
  }

  function latticeColor(link, avgZ, layer) {
    var isBack = layer === "back";
    var major = Boolean(link.major);

    if (isBack) {
      return major ? "rgba(141,216,255,0.070)" : "rgba(141,216,255,0.040)";
    }

    if (link.family === "fibonacci") {
      return major ? "rgba(244,207,131,0.62)" : "rgba(244,207,131,0.32)";
    }

    return major
      ? "rgba(244,207,131," + clamp(0.42 + avgZ * 0.14, 0.28, 0.68).toFixed(3) + ")"
      : "rgba(141,216,255," + clamp(0.22 + avgZ * 0.08, 0.14, 0.38).toFixed(3) + ")";
  }

  function drawLatticeLayer(layer) {
    if (!state.latticeReady) return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < state.latticeLinks.length; i += 1) {
      var link = state.latticeLinks[i];
      var a = project(link.a);
      var b = project(link.b);
      var avgZ = (a.z + b.z) / 2;
      var isFront = avgZ >= 0;

      if (layer === "back" && isFront) continue;
      if (layer === "front" && !isFront) continue;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = latticeColor(link, avgZ, layer);
      ctx.lineWidth = link.major ? Math.max(0.60, state.dpr * 0.62) : Math.max(0.34, state.dpr * 0.36);
      ctx.stroke();
    }

    for (var j = 0; j < state.latticeSeats.length; j += 1) {
      var seat = state.latticeSeats[j];
      var p = project(seat);
      var front = p.z >= 0;

      if (layer === "back" && front) continue;
      if (layer === "front" && !front) continue;

      var radius = seat.major ? 1.7 : seat.secondary ? 1.15 : 0.86;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.72, state.dpr * radius * p.scale), 0, TAU);
      ctx.fillStyle = layer === "back"
        ? (seat.major ? "rgba(141,216,255,0.100)" : "rgba(141,216,255,0.055)")
        : (seat.major ? "rgba(244,207,131,0.76)" : "rgba(141,216,255,0.48)");
      ctx.fill();
    }

    ctx.restore();
  }

  function drawReceipt() {
    var ctx = state.ctx;
    var m = metrics();
    var w = Math.min(state.width * .84, m.baseRadius * 2.28);
    var h = Math.min(state.height * .46, m.baseRadius * 1.18);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,.76)";
    ctx.strokeStyle = state.meshReady ? "rgba(167,243,198,.42)" : "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.meshReady ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText(state.meshReady ? "DYNAMIC ROW OVERLAP MESH LIVE" : "OVERLAP MESH HELD", m.cx, y + h * .13);

    ctx.font = "900 " + Math.max(8, 9.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("ROWS " + state.dynamicSurfaceRows.length + " · KERNELS " + state.wovenSurfaceNodes.length + " · RAW 256 LATTICE ONLY", m.cx, y + h * .28);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("SURFACE = DERIVED WOVEN SKIN · CARRIER INVENTS TERRAIN: FALSE", m.cx, y + h * .43);

    ctx.fillStyle = "rgba(244,207,131,.84)";
    ctx.fillText("ZOOM " + state.zoom.toFixed(2) + " · FULL-GLOBE LATTICE ACTIVE", m.cx, y + h * .58);

    ctx.fillStyle = "rgba(182,245,255,.76)";
    ctx.fillText("HYDRATION HELD · EDGE DETAILS HELD", m.cx, y + h * .73);

    ctx.fillStyle = "rgba(238,244,255,.72)";
    ctx.fillText("FINAL VISUAL PASS: FALSE", m.cx, y + h * .88);

    ctx.restore();
  }

  function drawHydrationHeld() {
    if (state.activeLens !== "hydration") return;

    drawFutureFillMesh("hydration");

    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(182,245,255,0.76)";
    ctx.fillText("HYDRATION HELD · FUTURE FILL ONLY", m.cx, m.cy + m.r * 0.74);
    ctx.restore();
  }

  function drawMaterialStackBase() {
    drawPlanetShadowBody();
    drawHydrosphereMemoryUnderlayer();
  }

  function frame() {
    if (state.stopped || !state.ctx) return;

    state.raf = 0;

    if (!state.dragging && !state.pinching) {
      state.yaw += state.vx;
      state.pitch = clamp(state.pitch + state.vy, -1.16, 1.16);
      state.vx *= .94;
      state.vy *= .94;
      if (Math.abs(state.vx) < .00008) state.vx = 0;
      if (Math.abs(state.vy) < .00008) state.vy = 0;
    }

    state.ctx.clearRect(0, 0, state.width, state.height);

    drawMaterialStackBase();

    if (state.activeLens === "lattice") {
      drawLatticeLayer("back");
      drawWovenSurfaceMesh("body");
      drawLatticeLayer("front");
    } else if (state.activeLens === "body") {
      drawWovenSurfaceMesh("body");
    } else if (state.activeLens === "surface") {
      drawWovenSurfaceMesh("surface");
      drawFutureFillMesh("surface");
    } else if (state.activeLens === "hydration") {
      drawWovenSurfaceMesh("body");
      drawHydrationHeld();
    } else if (state.activeLens === "sixth-sense") {
      drawWovenSurfaceMesh("sixth-sense");
      drawDryTerrainRelationships();
    } else if (state.activeLens === "receipt") {
      drawWovenSurfaceMesh("body");
      drawReceipt();
    }

    drawAtmosphereRim();

    state.renderCount += 1;
    publishStatus();

    if (state.dragging || state.pinching || Math.abs(state.vx) > 0 || Math.abs(state.vy) > 0) {
      requestRender();
    }
  }

  function requestRender() {
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function setLens(value) {
    var lens = String(value || "body");

    if (!LENSES[lens]) lens = "body";

    state.activeLens = lens;

    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaPlanetLens === lens ? "true" : "false");
    });

    var label = document.querySelector("[data-audralia-planet-stage-label]");
    if (label) {
      if (lens === "surface") {
        label.innerHTML = "<strong>Surface</strong> → dynamic-row woven overlap mesh";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / future fill only";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → mesh continuity relationships";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → full-globe raw 256 inspection";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → overlap mesh proof";
      } else {
        label.innerHTML = "<strong>Body</strong> → material stack with woven dry crust";
      }
    }

    requestRender();
  }

  function bindControls() {
    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaPlanetLens);
      });
    });

    state.stage.addEventListener("pointerdown", function (event) {
      var now = Date.now();

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size === 2) {
        state.pinching = true;
        state.dragging = false;
        state.pinchStartDistance = pointerDistance();
        state.pinchStartZoom = state.zoom;
      } else if (state.pointers.size === 1) {
        if (now - state.lastTap < 320) resetCamera();
        state.lastTap = now;

        state.dragging = true;
        state.pinching = false;
        state.px = event.clientX;
        state.py = event.clientY;
        state.vx = 0;
        state.vy = 0;
      }

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

      event.preventDefault();
      requestRender();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointers.has(event.pointerId)) return;

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size >= 2 && state.pinching) {
        var distance = pointerDistance();
        if (state.pinchStartDistance > 0) {
          setZoom(state.pinchStartZoom * (distance / state.pinchStartDistance));
        }
        event.preventDefault();
        return;
      }

      if (!state.dragging) return;

      var dx = event.clientX - state.px;
      var dy = event.clientY - state.py;

      state.px = event.clientX;
      state.py = event.clientY;
      state.yaw += dx * .0082;
      state.pitch = clamp(state.pitch + dy * .0054, -1.16, 1.16);
      state.vx = clamp(dx * .0022, -.048, .048);
      state.vy = clamp(dy * .0014, -.038, .038);

      event.preventDefault();
      requestRender();
    }, { passive: false });

    function release(event) {
      state.pointers.delete(event.pointerId);

      try { state.stage.releasePointerCapture(event.pointerId); } catch (_error) {}

      if (state.pointers.size < 2) {
        state.pinching = false;
        state.pinchStartDistance = 0;
      }

      if (state.pointers.size === 0) {
        state.dragging = false;
      }

      requestRender();
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });

    state.stage.addEventListener("wheel", function (event) {
      var factor = Math.exp(-event.deltaY * 0.0012);
      setZoom(state.zoom * factor);
      event.preventDefault();
    }, { passive: false });

    state.stage.addEventListener("dblclick", function (event) {
      resetCamera();
      event.preventDefault();
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      var target = event.target && String(event.target.tagName || "").toLowerCase();
      if (target === "input" || target === "textarea" || target === "select") return;

      if (event.key === "+" || event.key === "=") {
        setZoom(state.zoom * 1.10);
        event.preventDefault();
      } else if (event.key === "-" || event.key === "_") {
        setZoom(state.zoom / 1.10);
        event.preventDefault();
      } else if (event.key === "0") {
        resetCamera();
        event.preventDefault();
      }
    }, { passive: false });
  }

  function publishStatus() {
    var meshReceipt = getMeshReceipt();

    var payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,
      route: ROUTE,

      carrierIsRuntime: true,
      directCarrierConsumption: true,

      dryRevealedTerrainDetected: state.dryTerrainDetected,
      dryRevealedTerrainApiComplete: state.dryTerrainApiComplete,
      dryRevealedTerrainValidated: state.dryTerrainValidated,
      dryRevealedTerrainFailureReason: state.dryFailureReason,

      carrierConsumes: "getCarrierTerrainPacket(\"audralia-runtime-carrier\", { compact:false })",
      carrierConsumesDryTerrainAtlas: state.dryTerrainValidated,
      carrierInventsTerrain: false,

      materialLayerSeparationActive: true,
      dynamicRowWeaveActive: meshReceipt.dynamicRowWeaveActive,
      overlapMeshActive: meshReceipt.overlapMeshActive,
      dynamicRowCount: meshReceipt.dynamicRowCount,
      wovenKernelCount: meshReceipt.wovenKernelCount,
      sourceSeatCount: meshReceipt.sourceSeatCount,
      visibleKernelDensityReduced: true,
      kernelOverlapIncreased: true,
      surfaceRenderIsDerived: true,
      raw256VisibleOnlyInLattice: true,
      terrainAtlasRemainsSource: true,

      atmosphereSeparatedFromHydrosphere: true,
      hydrosphereMemoryIsUnderlayer: true,
      dryCrustAboveHydrosphereMemory: true,

      zoomInspectionActive: true,
      zoom: Number(state.zoom.toFixed(4)),
      zoomMin: ZOOM.min,
      zoomMax: ZOOM.max,
      zoomMutatesTerrainTruth: false,

      fullGlobeLatticeActive: true,
      latticeSeatCount: state.latticeSeats.length,
      latticeWrapsEntireGlobe: true,
      rearHemisphereLatticeDimmed: true,

      audraliaLevelTerrainAuthority: true,
      gratitudeIsIsland: false,
      gratitudeIslandRead: false,

      activeHydration: false,
      hydrationHeld: true,
      futureFillOnly: true,
      edgeDetailsHeld: true,

      surfaceDrawsWovenOverlapMesh: state.meshReady,
      bodyHydrosphereOriginCompatible: true,
      sixthSenseUsesMeshContinuity: true,
      latticeRaw256InspectionPreserved: true,

      activeLens: state.activeLens,
      renderCount: state.renderCount,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_RUNTIME_DYNAMIC_ROW_OVERLAP_WEAVE_SURFACE_RENDER_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_PLANET_RUNTIME_DYNAMIC_ROW_OVERLAP_WEAVE_SURFACE_RENDER_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaDynamicRowWeaveActive = String(state.meshReady);
      document.documentElement.dataset.audraliaOverlapMeshActive = String(state.meshReady);
      document.documentElement.dataset.audraliaRaw256VisibleOnlyInLattice = "true";
      document.documentElement.dataset.audraliaSurfaceRenderIsDerived = "true";
      document.documentElement.dataset.audraliaCarrierInventsTerrain = "false";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function stop() {
    state.stopped = true;

    if (state.raf) window.cancelAnimationFrame(state.raf);

    state.raf = 0;
  }

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");

    if (!state.stage || !state.mount) return;

    state.canvas = document.createElement("canvas");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-dynamic-row-weave-active", "true");
    state.canvas.setAttribute("data-overlap-mesh-active", "true");
    state.canvas.setAttribute("data-raw-256-visible-only-in-lattice", "true");
    state.canvas.setAttribute("data-surface-render-is-derived", "true");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);
    state.ctx = state.canvas.getContext("2d", { alpha: true });

    buildLatticeGeometry();
    resize();
    bindControls();
    detectDryTerrain();

    setTimeout(detectDryTerrain, 180);
    setTimeout(detectDryTerrain, 640);
    setTimeout(detectDryTerrain, 1200);

    window.addEventListener("resize", resize, { passive: true });

    setLens("body");
    publishStatus();
    requestRender();
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    status: publishStatus,
    detectDryTerrain: detectDryTerrain,
    setZoom: setZoom,
    resetCamera: resetCamera,
    getMeshReceipt: getMeshReceipt
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
