// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_BODY_INSPECTION_CARRIER_HANDOFF_ONLY_RENEWAL_TNT_v1
// Full-file replacement.
// Scope: same carrier file, same shell, same route role.
// Purpose: preserve the inspection carrier as a handoff/display shell. Keep the old handoff paths, consume upstream packets only as handoff inputs, and prevent duplicate visual-definition authority.
// Preserves: mount shell, canvas, drag, zoom, pinch, wheel, lenses, lattice, receipt, dry-terrain fallback, hydration hold, final visual pass false.
// Does not own: dry terrain truth, elevation truth, relief truth, landform truth, visual-definition authority, hydration truth, climate, ecology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_BODY_INSPECTION_CARRIER_HANDOFF_ONLY_RENEWAL_TNT_v1";
  var STABLE_SHELL_CONTRACT = "AUDRALIA_PLANET_RUNTIME_EXISTING_NODE_LAND_BODY_COMPOSITOR_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;

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

  var RELIEF_GLOBALS = Object.freeze([
    "AUDRALIA_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_PLANET_ELEVATION_RELIEF_EXPRESSION_CHILD",
    "AUDRALIA_G2_ELEVATION_RELIEF_EXPRESSION_CHILD"
  ]);

  var LANDFORM_GLOBALS = Object.freeze([
    "AUDRALIA_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_PLANET_LANDFORM_SYSTEMS_CHILD",
    "AUDRALIA_G2_LANDFORM_SYSTEMS_CHILD"
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

    dryApi: null,
    dryDetected: false,
    dryValidated: false,
    dryStatus: null,
    dryCarrierPacket: null,
    dryTerrainPacket: null,
    dryFailureReason: "dry terrain not checked",

    reliefApi: null,
    reliefDetected: false,
    reliefValidated: false,
    reliefStatus: null,
    reliefPacket: null,
    reliefFailureReason: "relief expression not checked",

    landformApi: null,
    landformDetected: false,
    landformValidated: false,
    landformStatus: null,
    landformPacket: null,
    landformFailureReason: "landform systems not checked",

    nodePointIndex: {},
    baseTerrainSamples: [],
    baseTerrainReady: false,

    latticeSeats: [],
    latticeLinks: [],
    latticeReady: false,

    upstreamHandoffSideReady: false,
    displayHandoffSideReady: false,
    handoffOnlyCarrierReady: false,

    errors: []
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop();
    } catch (_error) {}
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
    var n = Number(value);
    if (!Number.isFinite(n)) n = min;
    return Math.max(min, Math.min(max, n));
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

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -180 + (((Number(x) || 0) % RADIAL_NODES + RADIAL_NODES) % RADIAL_NODES) / RADIAL_NODES * 360,
      lat: 80 - clamp(Number(y) || 0, 0, FIBONACCI_BANDS - 1) / (FIBONACCI_BANDS - 1) * 160
    };
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = Number(lonDeg) * Math.PI / 180;
    var lat = Number(latDeg) * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
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

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      r: baseRadius * state.zoom,
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

  function resize() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(2.15, window.devicePixelRatio || 1));

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

    state.dryApi = api;
    state.dryDetected = Boolean(api);
    state.dryStatus = null;
    state.dryCarrierPacket = null;
    state.dryTerrainPacket = null;
    state.dryValidated = false;

    if (!api) {
      state.dryFailureReason = "dry terrain atlas missing";
      rebuildHandoffIndexes();
      return false;
    }

    if (
      typeof api.status !== "function" ||
      typeof api.getCarrierTerrainPacket !== "function" ||
      typeof api.getDryRevealedTerrainPacket !== "function"
    ) {
      state.dryFailureReason = "dry terrain atlas API incomplete";
      rebuildHandoffIndexes();
      return false;
    }

    state.dryStatus = safeCall("dryTerrain", api, "status");
    state.dryCarrierPacket = safeCall("dryTerrain", api, "getCarrierTerrainPacket", "audralia-runtime-carrier", { compact: false });
    state.dryTerrainPacket = safeCall("dryTerrain", api, "getDryRevealedTerrainPacket", "audralia-runtime-carrier", { compact: false });

    state.dryValidated = Boolean(
      state.dryStatus &&
      state.dryStatus.audraliaLevelTerrainAuthority === true &&
      state.dryStatus.hydrationHeld === true &&
      state.dryStatus.activeHydration === false &&
      state.dryCarrierPacket &&
      state.dryCarrierPacket.carrierTerrainPacketReady === true &&
      state.dryCarrierPacket.carrierInventsTerrain === false &&
      state.dryCarrierPacket.finalVisualPassClaim === false
    );

    state.dryFailureReason = state.dryValidated ? "" : "dry terrain packet validation failed";
    rebuildHandoffIndexes();

    return state.dryValidated;
  }

  function detectReliefExpression() {
    var api = firstGlobal(RELIEF_GLOBALS);

    state.reliefApi = api;
    state.reliefDetected = Boolean(api);
    state.reliefStatus = null;
    state.reliefPacket = null;
    state.reliefValidated = false;

    if (!api) {
      state.reliefFailureReason = "relief expression child missing";
      rebuildHandoffIndexes();
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierReliefPacket !== "function") {
      state.reliefFailureReason = "relief expression API incomplete";
      rebuildHandoffIndexes();
      return false;
    }

    state.reliefStatus = safeCall("reliefExpression", api, "status");
    state.reliefPacket = safeCall("reliefExpression", api, "getCarrierReliefPacket", "audralia-runtime-carrier", { compact: false });

    state.reliefValidated = Boolean(
      state.reliefPacket &&
      state.reliefPacket.reliefExpressionReady === true &&
      state.reliefPacket.carrierMayConsume === true &&
      state.reliefPacket.carrierShouldNotOwnReliefTruth === true &&
      state.reliefPacket.carrierShouldNotOwnElevationTruth === true &&
      state.reliefPacket.childDrawsVisuals === false &&
      state.reliefPacket.hydrationHeld === true &&
      state.reliefPacket.activeHydration === false &&
      state.reliefPacket.finalVisualPassClaim === false &&
      Array.isArray(state.reliefPacket.reliefSamples)
    );

    state.reliefFailureReason = state.reliefValidated ? "" : "relief expression packet validation failed";
    rebuildHandoffIndexes();

    return state.reliefValidated;
  }

  function detectLandformSystems() {
    var api = firstGlobal(LANDFORM_GLOBALS);

    state.landformApi = api;
    state.landformDetected = Boolean(api);
    state.landformStatus = null;
    state.landformPacket = null;
    state.landformValidated = false;

    if (!api) {
      state.landformFailureReason = "landform systems child missing";
      rebuildHandoffIndexes();
      return false;
    }

    if (typeof api.status !== "function" || typeof api.getCarrierLandformPacket !== "function") {
      state.landformFailureReason = "landform systems API incomplete";
      rebuildHandoffIndexes();
      return false;
    }

    state.landformStatus = safeCall("landformSystems", api, "status");
    state.landformPacket = safeCall("landformSystems", api, "getCarrierLandformPacket", "audralia-runtime-carrier", { compact: false });

    state.landformValidated = Boolean(
      state.landformPacket &&
      state.landformPacket.landformSystemsReady === true &&
      state.landformPacket.carrierMayConsume === true &&
      state.landformPacket.carrierShouldNotOwnLandformTruth === true &&
      state.landformPacket.carrierShouldNotOwnReliefTruth === true &&
      state.landformPacket.carrierShouldNotOwnElevationTruth === true &&
      state.landformPacket.childDrawsVisuals === false &&
      state.landformPacket.hydrationHeld === true &&
      state.landformPacket.activeHydration === false &&
      state.landformPacket.finalVisualPassClaim === false
    );

    state.landformFailureReason = state.landformValidated ? "" : "landform systems packet validation failed";
    rebuildHandoffIndexes();

    return state.landformValidated;
  }

  function refreshHandoffs() {
    detectDryTerrain();
    detectReliefExpression();
    detectLandformSystems();

    state.upstreamHandoffSideReady = Boolean(state.dryValidated || state.reliefValidated || state.landformValidated);
    state.displayHandoffSideReady = Boolean(state.stage && state.mount && state.canvas && state.ctx);
    state.handoffOnlyCarrierReady = Boolean(state.displayHandoffSideReady && state.upstreamHandoffSideReady);

    publishStatus();
    requestRender();
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

  function nodeIdOf(node, fallback) {
    return node.nodeId || node.seatKey || node.id || "node-" + fallback;
  }

  function pointFromXY(x, y, source) {
    var ll = terrainSeatToLonLat(x, y);

    return {
      x: round(Number(x) || 0, 4),
      y: round(Number(y) || 0, 4),
      lon: round(ll.lon, 4),
      lat: round(ll.lat, 4),
      point: lonLatPoint(ll.lon, ll.lat),
      source: source || "unknown"
    };
  }

  function rebuildHandoffIndexes() {
    var index = {};
    var samples = [];

    if (state.reliefValidated && state.reliefPacket && Array.isArray(state.reliefPacket.reliefSamples)) {
      state.reliefPacket.reliefSamples.forEach(function (sample, i) {
        if (!sample || !sample.parentNodeId) return;

        var point = pointFromXY(sample.x, sample.y, "relief-sample");
        point.nodeId = sample.parentNodeId;
        point.continentId = sample.continentId;
        point.continentName = sample.continentName;
        point.elevation = Number(sample.elevation || 0);
        point.reliefIntensity = Number(sample.reliefIntensity || 0);
        point.ridgeHighlight = Number(sample.ridgeHighlight || 0);
        point.basinShadow = Number(sample.basinShadow || 0);
        point.summitEmphasis = Number(sample.summitEmphasis || 0);
        point.carrierVisualRole = sample.carrierVisualRole || "relief";
        index[sample.parentNodeId] = point;
        samples.push(point);
      });
    }

    dryNodes().forEach(function (node, i) {
      var id = nodeIdOf(node, i);
      if (index[id]) return;

      var x = Number(node.x || node.radial || (i % RADIAL_NODES));
      var y = Number(node.y || node.band || Math.floor(i / RADIAL_NODES));
      var point = pointFromXY(x, y, "dry-terrain");

      point.nodeId = id;
      point.continentId = node.regionSeed || node.continentId || "unassigned";
      point.continentName = node.regionName || node.continentName || "Unassigned";
      point.elevation = Number(node.dryElevation || node.elevation || 0.5);
      point.reliefIntensity = Number(node.ridgePressure || node.mountainPressure || node.summitPressure || node.basinPressure || 0);
      point.ridgeHighlight = Number(node.ridgePressure || node.mountainPressure || 0);
      point.basinShadow = Number(node.basinPressure || node.gapPressure || 0);
      point.summitEmphasis = Number(node.summitPressure || 0);
      point.carrierVisualRole = node.primaryTerrainRole || node.terrainClass || "dry-terrain";
      index[id] = point;
      samples.push(point);
    });

    state.nodePointIndex = index;
    state.baseTerrainSamples = samples;
    state.baseTerrainReady = samples.length > 0;
  }

  function pointForNodeId(nodeId) {
    return state.nodePointIndex[nodeId] || null;
  }

  function pointsForNodeIds(nodeIds, limit) {
    var output = [];

    (nodeIds || []).slice(0, limit || 32).forEach(function (nodeId) {
      var point = pointForNodeId(nodeId);
      if (point) output.push(point);
    });

    return output;
  }

  function projected(point) {
    if (!point || !point.point) return null;
    return project(point.point);
  }

  function rgba(color, alpha) {
    return "rgba(" +
      Math.floor(color.r) + "," +
      Math.floor(color.g) + "," +
      Math.floor(color.b) + "," +
      clamp(alpha, 0, 1).toFixed(3) +
      ")";
  }

  function mixColor(color, target, amount) {
    return {
      r: color.r * (1 - amount) + target.r * amount,
      g: color.g * (1 - amount) + target.g * amount,
      b: color.b * (1 - amount) + target.b * amount
    };
  }

  function continentColor(continentId) {
    var palette = {
      gratitude: { r: 123, g: 152, b: 93 },
      generosity: { r: 154, g: 146, b: 83 },
      dependability: { r: 104, g: 126, b: 84 },
      accountability: { r: 148, g: 121, b: 84 },
      forgiveness: { r: 118, g: 142, b: 104 },
      humility: { r: 91, g: 116, b: 91 },
      "self-control": { r: 126, g: 113, b: 78 },
      patience: { r: 151, g: 130, b: 91 },
      purity: { r: 168, g: 159, b: 118 }
    };

    return palette[continentId] || { r: 112, g: 132, b: 88 };
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
    directional.addColorStop(0.00, "rgba(255,255,255,0.052)");
    directional.addColorStop(0.34, "rgba(255,255,255,0.014)");
    directional.addColorStop(0.70, "rgba(0,0,0,0.28)");
    directional.addColorStop(1.00, "rgba(0,0,0,0.56)");
    ctx.fillStyle = directional;
    ctx.fillRect(m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);

    ctx.restore();
  }

  function drawHydrosphereMemoryUnderlayer() {
    var ctx = state.ctx;
    var m = metrics();
    var activeHandoff = state.landformValidated || state.reliefValidated;
    var wash = activeHandoff ? 0.54 : 0.86;

    ctx.save();
    clipSphere();

    var memory = ctx.createRadialGradient(m.cx - m.r * 0.34, m.cy - m.r * 0.28, 0, m.cx, m.cy, m.r * 1.08);
    memory.addColorStop(0.00, "rgba(105,184,212," + (0.20 * wash).toFixed(3) + ")");
    memory.addColorStop(0.32, "rgba(37,101,148," + (0.15 * wash).toFixed(3) + ")");
    memory.addColorStop(0.62, "rgba(8,42,91," + (0.11 * wash).toFixed(3) + ")");
    memory.addColorStop(1.00, "rgba(0,12,38," + (0.16 * wash).toFixed(3) + ")");

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
    rim.addColorStop(0.62, "rgba(141,216,255,0.012)");
    rim.addColorStop(0.84, "rgba(141,216,255,0.090)");
    rim.addColorStop(1.00, "rgba(141,216,255,0.000)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.11, 0, TAU);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,0.20)";
    ctx.lineWidth = Math.max(0.75, state.dpr * 0.72);
    ctx.stroke();
  }

  function drawBaseTerrainSkin(mode) {
    if (!state.baseTerrainReady) return;

    var ctx = state.ctx;
    var m = metrics();
    var samples = state.baseTerrainSamples;
    var bodyMode = mode === "body";
    var surfaceMode = mode === "surface" || mode === "sixth-sense";

    ctx.save();
    clipSphere();

    samples.forEach(function (sample, index) {
      if (index % (surfaceMode ? 1 : 2) !== 0) return;

      var p = projected(sample);
      if (!p || !p.front) return;

      var elevation = clamp(Number(sample.elevation || 0.5), 0, 1);
      var relief = clamp(Number(sample.reliefIntensity || 0), 0, 1);
      var ridge = clamp(Number(sample.ridgeHighlight || 0), 0, 1);
      var basin = clamp(Number(sample.basinShadow || 0), 0, 1);
      var color = continentColor(sample.continentId);

      color = mixColor(color, { r: 213, g: 181, b: 116 }, elevation > 0.58 ? (elevation - 0.58) * 0.50 : 0);
      color = mixColor(color, { r: 36, g: 52, b: 42 }, elevation < 0.42 ? (0.42 - elevation) * 0.70 : 0);
      color = mixColor(color, { r: 24, g: 32, b: 30 }, basin * 0.18);

      var radius = Math.max(
        3.8,
        m.r * (bodyMode ? 0.025 : 0.019) * p.scale * (0.72 + relief * 0.34 + ridge * 0.20)
      );

      var alpha = bodyMode ? 0.11 : 0.19;
      alpha += relief * (bodyMode ? 0.04 : 0.10);
      alpha = clamp(alpha, 0.06, surfaceMode ? 0.32 : 0.20);

      var gradient = ctx.createRadialGradient(
        p.x - radius * 0.20,
        p.y - radius * 0.18,
        radius * 0.05,
        p.x,
        p.y,
        radius
      );

      gradient.addColorStop(0.00, rgba(color, alpha));
      gradient.addColorStop(0.54, rgba(color, alpha * 0.42));
      gradient.addColorStop(1.00, rgba(color, 0));

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    ctx.restore();
  }

  function drawPathFromNodeIds(nodeIds, color, alpha, width, limit) {
    var points = pointsForNodeIds(nodeIds, limit || 32).map(projected).filter(function (p) {
      return p && p.front;
    });

    if (points.length < 2) return;

    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; i += 1) {
      var prev = points[i - 1];
      var next = points[i];
      var dx = Math.abs(next.x - prev.x);
      var dy = Math.abs(next.y - prev.y);

      if (dx > m.r * 0.50 || dy > m.r * 0.50) {
        ctx.moveTo(next.x, next.y);
      } else {
        ctx.lineTo(next.x, next.y);
      }
    }

    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = Math.max(0.8, m.r * width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawNodeField(nodeIds, color, alpha, radiusScale, limit) {
    var ctx = state.ctx;
    var m = metrics();

    pointsForNodeIds(nodeIds, limit || 28).forEach(function (point) {
      var p = projected(point);
      if (!p || !p.front) return;

      var radius = Math.max(1.8, m.r * radiusScale * p.scale);

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = rgba(color, alpha);
      ctx.fill();
    });
  }

  function drawAnchor(nodeId, color, alpha, radiusScale, ring) {
    var point = pointForNodeId(nodeId);
    var p = projected(point);
    if (!p || !p.front) return;

    var ctx = state.ctx;
    var m = metrics();
    var radius = Math.max(2.2, m.r * radiusScale * p.scale);

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = rgba(color, alpha);
    ctx.fill();

    if (ring) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 2.25, 0, TAU);
      ctx.strokeStyle = rgba(color, alpha * 0.42);
      ctx.lineWidth = Math.max(0.7, state.dpr * 0.72);
      ctx.stroke();
    }
  }

  function drawReliefFallback(mode) {
    if (!state.reliefValidated || !state.reliefPacket || state.landformValidated) return;

    var surface = mode === "surface";
    var sixth = mode === "sixth-sense";
    if (!surface && !sixth && mode !== "body") return;

    ctxSaveClip(function () {
      (state.reliefPacket.ridgeReliefExpressions || []).forEach(function (ridge) {
        var strength = clamp(Number(ridge.ridgeReliefStrength || ridge.ridgeHighlight || 0.36), 0.18, 1);
        drawPathFromNodeIds(ridge.nodeIds, { r: 230, g: 195, b: 128 }, (surface ? 0.38 : 0.18) * strength, surface ? 0.0032 : 0.002, 22);
      });

      (state.reliefPacket.basinDepthExpressions || []).forEach(function (basin) {
        var strength = clamp(Number(basin.basinDepthStrength || basin.basinShadow || 0.34), 0.16, 1);
        drawNodeField(basin.nodeIds, { r: 28, g: 42, b: 38 }, (surface ? 0.26 : 0.12) * strength, 0.0075, 18);
      });
    });
  }

  function drawLandformHandoff(mode) {
    if (!state.landformValidated || !state.landformPacket) return;

    var body = mode === "body";
    var surface = mode === "surface";
    var sixth = mode === "sixth-sense";
    var hydration = mode === "hydration";
    var lattice = mode === "lattice";

    ctxSaveClip(function () {
      if (!hydration) {
        (state.landformPacket.plateaus || []).forEach(function (plateau) {
          var strength = clamp(Number(plateau.surfaceContinuity || plateau.slopeStability || 0.34), 0.14, 1);
          var alpha = body ? 0.045 : surface ? 0.16 : sixth ? 0.20 : lattice ? 0.04 : 0.07;
          drawNodeField(plateau.nodeIds, { r: 164, g: 143, b: 91 }, alpha * strength, surface || sixth ? 0.009 : 0.006, 34);
        });
      }

      (state.landformPacket.landformBasins || []).forEach(function (basin) {
        var strength = clamp(Number(basin.basinDepthStrength || basin.futureFillPriority || 0.34), 0.14, 1);
        var alpha = hydration ? 0.24 : body ? 0.055 : surface ? 0.23 : sixth ? 0.28 : 0.08;
        drawNodeField(basin.nodeIds, { r: 23, g: 36, b: 33 }, alpha * strength, hydration ? 0.010 : 0.008, 26);
      });

      if (!hydration) {
        (state.landformPacket.mountainRanges || []).forEach(function (range) {
          var strength = clamp(Number(range.watershedAuthority || range.averageReliefIntensity || 0.40), 0.18, 1);
          var alpha = body ? 0.12 : surface ? 0.50 : sixth ? 0.66 : lattice ? 0.15 : 0.22;
          drawPathFromNodeIds(range.nodeIds, { r: 244, g: 207, b: 131 }, alpha * strength, surface || sixth ? 0.0048 : 0.0030, 28);

          (range.summitNodeIds || []).slice(0, 5).forEach(function (nodeId) {
            drawAnchor(nodeId, { r: 255, g: 226, b: 164 }, alpha * 0.80 * strength, surface || sixth ? 0.0065 : 0.0042, sixth);
          });
        });

        (state.landformPacket.cliffSystems || []).forEach(function (cliff) {
          var strength = clamp(Number(cliff.reliefBreakStrength || cliff.edgeContinuity || 0.40), 0.18, 1);
          var alpha = body ? 0.08 : surface ? 0.58 : sixth ? 0.72 : lattice ? 0.14 : 0.18;
          drawPathFromNodeIds(cliff.nodeIds, { r: 76, g: 52, b: 38 }, alpha * strength, surface || sixth ? 0.0054 : 0.0032, 24);
          drawPathFromNodeIds(cliff.nodeIds, { r: 12, g: 18, b: 20 }, alpha * 0.30 * strength, surface || sixth ? 0.0082 : 0.0048, 24);
        });
      }

      if (hydration || surface || sixth) {
        (state.landformPacket.landformBasins || []).forEach(function (basin) {
          var priority = Number(basin.futureFillPriority || 0);
          if (priority < 0.28) return;
          drawNodeField(basin.nodeIds, { r: 88, g: 130, b: 142 }, (hydration ? 0.30 : 0.14) * priority, 0.0068, 18);
        });
      }

      if (surface || sixth) {
        (state.landformPacket.landmarks || []).slice(0, sixth ? 120 : 70).forEach(function (landmark) {
          var strength = clamp(Number(landmark.landmarkStrength || landmark.reliefIntensity || 0.40), 0.18, 1);
          drawAnchor(
            landmark.anchorNodeId,
            { r: 250, g: 231, b: 177 },
            (sixth ? 0.72 : 0.36) * strength,
            sixth ? 0.0065 : 0.0048,
            sixth
          );
        });
      }
    });
  }

  function ctxSaveClip(fn) {
    state.ctx.save();
    clipSphere();
    fn();
    state.ctx.restore();
  }

  function drawFutureFillDepressions(mode) {
    if (mode !== "hydration" && mode !== "surface") return;

    var ctx = state.ctx;
    var m = metrics();

    ctxSaveClip(function () {
      state.baseTerrainSamples.forEach(function (sample) {
        if (Number(sample.basinShadow || 0) < 0.36) return;

        var p = projected(sample);
        if (!p || !p.front) return;

        var radius = Math.max(2.1, m.r * 0.0065 * p.scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, TAU);
        ctx.fillStyle = mode === "hydration" ? "rgba(100,146,160,0.18)" : "rgba(100,146,160,0.08)";
        ctx.fill();
      });
    });
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
    state.latticeReady = state.latticeSeats.length === SOURCE_SEAT_COUNT;
  }

  function latticeColor(link, avgZ, layer) {
    var major = Boolean(link.major);

    if (layer === "back") {
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
      var front = avgZ >= 0;

      if (layer === "back" && front) continue;
      if (layer === "front" && !front) continue;

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
      var isFront = p.z >= 0;

      if (layer === "back" && isFront) continue;
      if (layer === "front" && !isFront) continue;

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

  function drawReceipt() {
    var ctx = state.ctx;
    var m = metrics();
    var w = Math.min(state.width * 0.88, m.baseRadius * 2.66);
    var h = Math.min(state.height * 0.58, m.baseRadius * 1.56);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();

    ctx.fillStyle = "rgba(2,8,20,.82)";
    ctx.strokeStyle = state.handoffOnlyCarrierReady ? "rgba(167,243,198,.50)" : "rgba(244,207,131,.38)";
    ctx.lineWidth = Math.max(1, state.dpr);
    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.handoffOnlyCarrierReady ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText("HANDOFF-ONLY CARRIER RENEWAL", m.cx, y + h * 0.09);

    ctx.font = "900 " + Math.max(8, 9.2 * state.dpr) + "px ui-monospace, monospace";

    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("SAME FILE · SAME SHELL · SAME DISPLAY ENDPOINT", m.cx, y + h * 0.21);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("DRY " + String(state.dryValidated).toUpperCase() + " · RELIEF " + String(state.reliefValidated).toUpperCase() + " · LANDFORM " + String(state.landformValidated).toUpperCase(), m.cx, y + h * 0.34);

    ctx.fillStyle = "rgba(244,207,131,.86)";
    ctx.fillText("CARRIER DRAWS HANDOFFS · DOES NOT RECLASSIFY", m.cx, y + h * 0.47);

    ctx.fillStyle = "rgba(182,245,255,.78)";
    ctx.fillText("UPSTREAM HANDOFF SIDE: " + String(state.upstreamHandoffSideReady).toUpperCase(), m.cx, y + h * 0.60);

    ctx.fillStyle = "rgba(182,245,255,.78)";
    ctx.fillText("DISPLAY HANDOFF SIDE: " + String(state.displayHandoffSideReady).toUpperCase(), m.cx, y + h * 0.72);

    ctx.fillStyle = "rgba(182,245,255,.74)";
    ctx.fillText("HYDRATION HELD · ACTIVE WATER FALSE", m.cx, y + h * 0.84);

    ctx.fillStyle = "rgba(238,244,255,.72)";
    ctx.fillText("FINAL VISUAL PASS: FALSE", m.cx, y + h * 0.94);

    ctx.restore();
  }

  function drawHydrationHeld() {
    if (state.activeLens !== "hydration") return;

    drawFutureFillDepressions("hydration");

    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(182,245,255,0.76)";
    ctx.fillText("HYDRATION HELD · DRY FUTURE-FILL READINESS ONLY", m.cx, m.cy + m.r * 0.74);
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
      state.vx *= 0.94;
      state.vy *= 0.94;
      if (Math.abs(state.vx) < 0.00008) state.vx = 0;
      if (Math.abs(state.vy) < 0.00008) state.vy = 0;
    }

    state.ctx.clearRect(0, 0, state.width, state.height);

    drawMaterialStackBase();

    if (state.activeLens === "lattice") {
      drawLatticeLayer("back");
      drawBaseTerrainSkin("body");
      drawLandformHandoff("lattice");
      drawLatticeLayer("front");
    } else if (state.activeLens === "body") {
      drawBaseTerrainSkin("body");
      drawReliefFallback("body");
      drawLandformHandoff("body");
    } else if (state.activeLens === "surface") {
      drawBaseTerrainSkin("surface");
      drawReliefFallback("surface");
      drawLandformHandoff("surface");
      drawFutureFillDepressions("surface");
    } else if (state.activeLens === "hydration") {
      drawBaseTerrainSkin("body");
      drawLandformHandoff("hydration");
      drawHydrationHeld();
    } else if (state.activeLens === "sixth-sense") {
      drawBaseTerrainSkin("sixth-sense");
      drawReliefFallback("sixth-sense");
      drawLandformHandoff("sixth-sense");
    } else if (state.activeLens === "receipt") {
      drawBaseTerrainSkin("body");
      drawLandformHandoff("body");
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
        label.innerHTML = "<strong>Surface</strong> → carrier draws upstream handoffs only";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / dry future-fill readiness only";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → diagnostic handoff visibility";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → full-globe raw 256 inspection";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → handoff-only carrier proof";
      } else {
        label.innerHTML = "<strong>Body</strong> → preserved shell, same file, handoff-only renewal";
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

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

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
      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.16, 1.16);
      state.vx = clamp(dx * 0.0022, -0.048, 0.048);
      state.vy = clamp(dy * 0.0014, -0.038, 0.038);

      event.preventDefault();
      requestRender();
    }, { passive: false });

    function release(event) {
      state.pointers.delete(event.pointerId);

      try {
        state.stage.releasePointerCapture(event.pointerId);
      } catch (_error) {}

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
    var payload = {
      contract: CONTRACT,
      stableShellContract: STABLE_SHELL_CONTRACT,
      target: FILE,
      route: ROUTE,

      sameFileRenewal: true,
      shellPreserved: true,
      carrierIsRuntime: true,
      carrierIsDisplayEndpoint: true,
      carrierIsHandoffOnly: true,

      upstreamHandoffSideReady: state.upstreamHandoffSideReady,
      displayHandoffSideReady: state.displayHandoffSideReady,
      handoffOnlyCarrierReady: state.handoffOnlyCarrierReady,

      dryTerrainDetected: state.dryDetected,
      dryTerrainValidated: state.dryValidated,
      dryFailureReason: state.dryFailureReason,

      reliefExpressionDetected: state.reliefDetected,
      reliefExpressionValidated: state.reliefValidated,
      reliefFailureReason: state.reliefFailureReason,

      landformSystemsDetected: state.landformDetected,
      landformSystemsValidated: state.landformValidated,
      landformFailureReason: state.landformFailureReason,

      carrierDrawsHandoffPackets: true,
      carrierDoesNotClassifyLandforms: true,
      carrierDoesNotReinterpretRelief: true,
      carrierDoesNotOwnVisualDefinitionAuthority: true,

      carrierShouldNotOwnTerrainTruth: true,
      carrierShouldNotOwnElevationTruth: true,
      carrierShouldNotOwnReliefTruth: true,
      carrierShouldNotOwnLandformTruth: true,

      carrierInventsTerrain: false,
      terrainAtlasRemainsSource: true,

      baseTerrainReady: state.baseTerrainReady,
      baseTerrainSampleCount: state.baseTerrainSamples.length,

      fullGlobeLatticeActive: state.latticeReady,
      latticeSeatCount: state.latticeSeats.length,
      latticeWrapsEntireGlobe: true,

      zoomInspectionActive: true,
      zoom: Number(state.zoom.toFixed(4)),
      zoomMin: ZOOM.min,
      zoomMax: ZOOM.max,
      zoomMutatesTerrainTruth: false,

      activeHydration: false,
      hydrationHeld: true,
      futureFillOnly: true,

      activeLens: state.activeLens,
      renderCount: state.renderCount,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_BODY_INSPECTION_CARRIER_HANDOFF_ONLY_RENEWAL_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_PLANET_BODY_INSPECTION_CARRIER_HANDOFF_ONLY_RENEWAL_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_EXISTING_NODE_LAND_BODY_COMPOSITOR_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaRuntimeContract = CONTRACT;
      document.documentElement.dataset.audraliaCarrierIsHandoffOnly = "true";
      document.documentElement.dataset.audraliaSameCarrierFileRenewal = "true";
      document.documentElement.dataset.audraliaShellPreserved = "true";
      document.documentElement.dataset.audraliaUpstreamHandoffSideReady = String(state.upstreamHandoffSideReady);
      document.documentElement.dataset.audraliaDisplayHandoffSideReady = String(state.displayHandoffSideReady);
      document.documentElement.dataset.audraliaCarrierDoesNotClassifyLandforms = "true";
      document.documentElement.dataset.audraliaCarrierDoesNotReinterpretRelief = "true";
      document.documentElement.dataset.audraliaCarrierInventsTerrain = "false";
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaActiveHydration = "false";
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_error) {}

    return payload;
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      window.cancelAnimationFrame(state.raf);
    }

    state.raf = 0;
  }

  function init() {
    if (!routeAllowed()) return;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");

    if (!state.stage || !state.mount) return;

    state.canvas = document.createElement("canvas");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-stable-shell-contract", STABLE_SHELL_CONTRACT);
    state.canvas.setAttribute("data-same-file-renewal", "true");
    state.canvas.setAttribute("data-shell-preserved", "true");
    state.canvas.setAttribute("data-carrier-is-handoff-only", "true");
    state.canvas.setAttribute("data-carrier-does-not-classify-landforms", "true");
    state.canvas.setAttribute("data-carrier-does-not-reinterpret-relief", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-active-hydration", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);
    state.ctx = state.canvas.getContext("2d", { alpha: true });

    buildLatticeGeometry();
    resize();
    bindControls();

    state.displayHandoffSideReady = Boolean(state.stage && state.mount && state.canvas && state.ctx);

    refreshHandoffs();

    setTimeout(refreshHandoffs, 180);
    setTimeout(refreshHandoffs, 640);
    setTimeout(refreshHandoffs, 1200);
    setTimeout(refreshHandoffs, 1800);

    window.addEventListener("resize", resize, { passive: true });

    setLens("body");
    publishStatus();
    requestRender();
  }

  window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT,
    stableShellContract: STABLE_SHELL_CONTRACT,
    status: publishStatus,
    refreshHandoffs: refreshHandoffs,
    detectDryTerrain: detectDryTerrain,
    detectReliefExpression: detectReliefExpression,
    detectLandformSystems: detectLandformSystems,
    setZoom: setZoom,
    resetCamera: resetCamera,
    sampleLandPresenceAt: function (x, y) {
      var closest = null;
      var best = Infinity;

      state.baseTerrainSamples.forEach(function (sample) {
        var dx = Math.abs(Number(sample.x || 0) - Number(x || 0));
        dx = Math.min(dx, RADIAL_NODES - dx);
        var dy = Number(sample.y || 0) - Number(y || 0);
        var d = Math.sqrt(dx * dx + dy * dy);

        if (d < best) {
          best = d;
          closest = sample;
        }
      });

      return closest ? {
        landPresence: 1,
        nearestNodeId: closest.nodeId,
        continentId: closest.continentId,
        continentName: closest.continentName,
        elevation: closest.elevation,
        reliefIntensity: closest.reliefIntensity,
        source: closest.source,
        carrierIsHandoffOnly: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      } : {
        landPresence: 0,
        carrierIsHandoffOnly: true,
        hydrationHeld: true,
        activeHydration: false,
        finalVisualPassClaim: false
      };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
