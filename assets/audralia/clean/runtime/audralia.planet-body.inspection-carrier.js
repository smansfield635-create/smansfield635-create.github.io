// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_TNT_v1
// Full-file replacement.
// Scope: runtime carrier only.
// Purpose: separate material layers, add zoom inspection, and wrap the Lattice lens around the full globe.
// Does not own: terrain truth, hydration truth, edge truth, HTML, climate, ecology, settlement, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_TNT_v1";
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
      lon: -180 + (x / 15) * 360,
      lat: 80 - (y / 15) * 160
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
      publishStatus();
      requestRender();
      return false;
    }

    if (!state.dryTerrainApiComplete) {
      state.dryFailureReason = "dry revealed terrain atlas API incomplete";
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
      links.push({
        a: a,
        b: b,
        family: family,
        major: Boolean(major)
      });
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
    memory.addColorStop(0.00, "rgba(105,184,212,0.34)");
    memory.addColorStop(0.28, "rgba(37,101,148,0.26)");
    memory.addColorStop(0.58, "rgba(8,42,91,0.24)");
    memory.addColorStop(1.00, "rgba(0,12,38,0.28)");

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
    rim.addColorStop(0.62, "rgba(141,216,255,0.020)");
    rim.addColorStop(0.84, "rgba(141,216,255,0.120)");
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

  function nodeColor(node, mode) {
    var role = String(node.primaryTerrainRole || node.terrainClass || "");
    var elevation = Number(node.dryElevation || node.elevation || 0.5);
    var alpha = mode === "body" ? 0.16 : mode === "sixth-sense" ? 0.56 : 0.74;

    if (role.indexOf("mountain") >= 0 || role.indexOf("ridge") >= 0 || role.indexOf("summit") >= 0) {
      return "rgba(" + Math.floor(145 + elevation * 82) + "," + Math.floor(126 + elevation * 72) + "," + Math.floor(91 + elevation * 54) + "," + alpha + ")";
    }

    if (role.indexOf("basin") >= 0 || role.indexOf("trench") >= 0 || role.indexOf("former_seabed") >= 0 || node.futureFillEligible) {
      return "rgba(" + Math.floor(68 + elevation * 62) + "," + Math.floor(83 + elevation * 66) + "," + Math.floor(69 + elevation * 46) + "," + (alpha * 0.84) + ")";
    }

    if (role.indexOf("shelf") >= 0 || role.indexOf("escarpment") >= 0 || role.indexOf("gap") >= 0) {
      return "rgba(" + Math.floor(130 + elevation * 74) + "," + Math.floor(112 + elevation * 62) + "," + Math.floor(78 + elevation * 48) + "," + (alpha * 0.90) + ")";
    }

    return "rgba(" + Math.floor(98 + elevation * 70) + "," + Math.floor(118 + elevation * 70) + "," + Math.floor(80 + elevation * 48) + "," + alpha + ")";
  }

  function drawTerrainNode(node, mode) {
    if (!node) return;

    var ctx = state.ctx;
    var x = Number(node.x || 0);
    var y = Number(node.y || 0);
    var ll = terrainSeatToLonLat(x + 0.5, y + 0.5);
    var p = project(lonLatPoint(ll.lon, ll.lat));

    if (!p.front && state.activeLens !== "lattice") return;

    var elevation = Number(node.dryElevation || node.elevation || 0.5);
    var relief = Math.max(0, Number(node.relativeRelief || 0));
    var backFade = p.front ? 1 : 0.22;
    var baseSize = mode === "body" ? 7.4 : mode === "sixth-sense" ? 10.3 : 12.7;
    var r = Math.max(1.4, state.dpr * (baseSize + elevation * 6.8 + relief * 7.5) * p.scale);

    ctx.globalAlpha = backFade;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, TAU);
    ctx.fillStyle = nodeColor(node, mode);
    ctx.fill();

    if (mode !== "body" && (node.formerHydrosphereCarved || node.futureFillEligible)) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.56, 0, TAU);
      ctx.fillStyle = node.futureFillEligible ? "rgba(14,26,29,0.38)" : "rgba(42,58,42,0.24)";
      ctx.fill();
    }

    if (mode !== "body" && Number(node.mountainPressure || node.ridgePressure || node.summitPressure || 0) > 0.55) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.26, 0, TAU);
      ctx.fillStyle = "rgba(255,226,162,0.38)";
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function drawDryTerrain(mode) {
    if (!state.dryTerrainValidated) return;

    var nodes = dryNodes();
    if (!nodes.length) return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      drawTerrainNode(nodes[i], mode);
    }

    ctx.restore();
  }

  function drawFutureFillGaps(mode) {
    if (!state.dryTerrainValidated || mode === "body") return;

    var nodes = futureFillNodes();
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var ll = terrainSeatToLonLat(Number(node.x || 0) + 0.5, Number(node.y || 0) + 0.5);
      var p = project(lonLatPoint(ll.lon, ll.lat));

      if (!p.front) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, state.dpr * 3.2 * p.scale), 0, TAU);
      ctx.fillStyle = mode === "hydration" ? "rgba(116,171,184,0.20)" : "rgba(13,22,26,0.48)";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDryTerrainRelationships() {
    if (!state.dryTerrainValidated) return;

    drawNodeSet(ridgeMountainNodes(), "rgba(244,207,131,0.36)", 2.6, 48);
    drawNodeSet(basinTrenchValleyNodes(), "rgba(96,132,116,0.32)", 2.2, 58);
    drawFutureFillGaps("sixth-sense");
  }

  function drawNodeSet(nodes, color, radius, limit) {
    var ctx = state.ctx;
    var drawn = 0;

    ctx.save();
    clipSphere();

    for (var i = 0; i < nodes.length; i += 1) {
      if (drawn >= limit) break;

      var node = nodes[i];
      var ll = terrainSeatToLonLat(Number(node.x || 0) + 0.5, Number(node.y || 0) + 0.5);
      var p = project(lonLatPoint(ll.lon, ll.lat));

      if (!p.front) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, state.dpr * radius * p.scale), 0, TAU);
      ctx.fillStyle = color;
      ctx.fill();

      drawn += 1;
    }

    ctx.restore();
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
    var w = Math.min(state.width * .84, m.baseRadius * 2.22);
    var h = Math.min(state.height * .44, m.baseRadius * 1.12);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,.76)";
    ctx.strokeStyle = state.dryTerrainValidated ? "rgba(167,243,198,.42)" : "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.dryTerrainValidated ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText(state.dryTerrainValidated ? "MATERIAL STACK LIVE" : "MATERIAL STACK HELD", m.cx, y + h * .15);

    ctx.font = "900 " + Math.max(8, 9.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("DRY TERRAIN ATLAS: " + (state.dryTerrainValidated ? "PASS" : "HOLD"), m.cx, y + h * .30);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("ATMOSPHERE ≠ HYDROSPHERE MEMORY ≠ DRY CRUST", m.cx, y + h * .45);

    ctx.fillStyle = "rgba(244,207,131,.84)";
    ctx.fillText("ZOOM " + state.zoom.toFixed(2) + " · FULL-GLOBE LATTICE ACTIVE", m.cx, y + h * .60);

    ctx.fillStyle = "rgba(182,245,255,.76)";
    ctx.fillText("HYDRATION HELD · FUTURE FILL ONLY", m.cx, y + h * .75);

    ctx.fillStyle = "rgba(238,244,255,.72)";
    ctx.fillText("FINAL VISUAL PASS: FALSE", m.cx, y + h * .90);

    ctx.restore();
  }

  function drawHydrationHeld() {
    if (state.activeLens !== "hydration") return;

    drawFutureFillGaps("hydration");

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
      drawDryTerrain("body");
      drawLatticeLayer("front");
    } else if (state.activeLens === "body") {
      drawDryTerrain("body");
    } else if (state.activeLens === "surface") {
      drawDryTerrain("surface");
      drawFutureFillGaps("surface");
    } else if (state.activeLens === "hydration") {
      drawDryTerrain("body");
      drawHydrationHeld();
    } else if (state.activeLens === "sixth-sense") {
      drawDryTerrain("sixth-sense");
      drawDryTerrainRelationships();
    } else if (state.activeLens === "receipt") {
      drawDryTerrain("body");
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
        label.innerHTML = "<strong>Surface</strong> → dry crust above hydrosphere memory";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / future fill only";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → dry terrain relationships";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → full-globe 256 inspection";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → material stack + zoom + lattice proof";
      } else {
        label.innerHTML = "<strong>Body</strong> → atmosphere, hydrosphere memory, dry crust";
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
      drawOrder: [
        "planet_shadow_body",
        "hydrosphere_memory_underlayer",
        "dry_exposed_crust",
        "dry_relief_hints",
        "future_fill_gap_hints",
        "atmosphere_rim_haze",
        "lens_overlay"
      ],

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

      surfaceDrawsDryRevealedTerrain: state.dryTerrainValidated,
      bodyHydrosphereOriginCompatible: true,
      sixthSenseDryTerrainRelationshipOnly: true,
      latticeRaw256InspectionPreserved: true,

      activeLens: state.activeLens,
      renderCount: state.renderCount,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalVisualPassClaim: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_PLANET_RUNTIME_MATERIAL_LAYER_ZOOM_FULL_GLOBE_LATTICE_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaMaterialLayerSeparationActive = "true";
      document.documentElement.dataset.audraliaZoomInspectionActive = "true";
      document.documentElement.dataset.audraliaFullGlobeLatticeActive = "true";
      document.documentElement.dataset.audraliaDryRevealedTerrainValidated = String(state.dryTerrainValidated);
      document.documentElement.dataset.audraliaHydrationHeld = "true";
      document.documentElement.dataset.audraliaGratitudeIslandRead = "false";
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
    state.canvas.setAttribute("data-material-layer-separation-active", "true");
    state.canvas.setAttribute("data-zoom-inspection-active", "true");
    state.canvas.setAttribute("data-full-globe-lattice-active", "true");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-gratitude-island-read", "false");
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
    resetCamera: resetCamera
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
