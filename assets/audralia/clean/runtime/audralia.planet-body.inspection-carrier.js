// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_TNT_v1
// Full-file replacement.
// Scope: runtime carrier.
// Purpose: directly consume Audralia dry revealed physical terrain atlas and draw Surface as dry carved planetary mass.
// Does not own: source terrain truth, hydration, edge behavior, climate, ecology, HTML, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_COMPOSITOR_FIRST_TNT_v1";
  var HTML_CONTRACT = "AUDRALIA_PLANET_HTML_DRY_REVEALED_TERRAIN_BEFORE_RUNTIME_CARRIER_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var DRY_TERRAIN_GLOBALS = [
    "AUDRALIA_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_G2_DRY_REVEALED_PHYSICAL_TERRAIN_CHILD",
    "AUDRALIA_PLANET_TERRAIN_ATLAS_CHILD"
  ];

  var LENSES = {
    body: "Body",
    surface: "Surface",
    hydration: "Hydration",
    "sixth-sense": "Sixth Sense",
    lattice: "Lattice",
    receipt: "Receipt"
  };

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
    dragging: false,
    px: 0,
    py: 0,

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

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      r: min * 0.405,
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

  function dryNodes() {
    var packet = state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;

    return packet && Array.isArray(packet.nodes) ? packet.nodes : [];
  }

  function futureFillNodes() {
    var packet = state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;

    var field = packet && packet.futureFillGapField ? packet.futureFillGapField : null;

    return field && Array.isArray(field.nodes) ? field.nodes : [];
  }

  function ridgeMountainNodes() {
    var packet = state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;

    var field = packet && packet.ridgeMountainField ? packet.ridgeMountainField : null;

    return field && Array.isArray(field.nodes) ? field.nodes : [];
  }

  function basinTrenchValleyNodes() {
    var packet = state.dryTerrainPacket ||
      (state.dryCarrierPacket && state.dryCarrierPacket.planetPhysicalTerrainPacket) ||
      null;

    var field = packet && packet.basinTrenchValleyField ? packet.basinTrenchValleyField : null;

    return field && Array.isArray(field.nodes) ? field.nodes : [];
  }

  function drawSphere() {
    var ctx = state.ctx;
    var m = metrics();

    var ocean = ctx.createRadialGradient(m.cx - m.r * 0.34, m.cy - m.r * 0.38, 0, m.cx, m.cy, m.r * 1.22);
    ocean.addColorStop(0.00, "rgba(171,235,246,0.90)");
    ocean.addColorStop(0.12, "rgba(55,145,196,0.82)");
    ocean.addColorStop(0.34, "rgba(13,75,143,0.93)");
    ocean.addColorStop(0.66, "rgba(4,30,88,1)");
    ocean.addColorStop(1.00, "rgba(1,7,25,1)");

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    ctx.save();
    clipSphere();

    var shade = ctx.createLinearGradient(m.cx - m.r, m.cy - m.r, m.cx + m.r, m.cy + m.r);
    shade.addColorStop(0, "rgba(255,255,255,.04)");
    shade.addColorStop(.48, "rgba(0,0,0,.08)");
    shade.addColorStop(1, "rgba(0,0,0,.42)");
    ctx.fillStyle = shade;
    ctx.fillRect(m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.001, 0, TAU);
    ctx.strokeStyle = "rgba(170,226,255,0.15)";
    ctx.lineWidth = Math.max(0.65, state.dpr * 0.7);
    ctx.stroke();
  }

  function nodeColor(node, mode) {
    var role = String(node.primaryTerrainRole || node.terrainClass || "");
    var elevation = Number(node.dryElevation || node.elevation || 0.5);
    var alpha = mode === "body" ? 0.12 : mode === "sixth-sense" ? 0.50 : 0.66;

    if (role.indexOf("mountain") >= 0 || role.indexOf("ridge") >= 0 || role.indexOf("summit") >= 0) {
      return "rgba(" + Math.floor(142 + elevation * 80) + "," + Math.floor(126 + elevation * 70) + "," + Math.floor(92 + elevation * 54) + "," + alpha + ")";
    }

    if (role.indexOf("basin") >= 0 || role.indexOf("trench") >= 0 || role.indexOf("former_seabed") >= 0 || node.futureFillEligible) {
      return "rgba(" + Math.floor(71 + elevation * 64) + "," + Math.floor(90 + elevation * 70) + "," + Math.floor(75 + elevation * 50) + "," + (alpha * 0.78) + ")";
    }

    if (role.indexOf("shelf") >= 0 || role.indexOf("escarpment") >= 0 || role.indexOf("gap") >= 0) {
      return "rgba(" + Math.floor(126 + elevation * 76) + "," + Math.floor(110 + elevation * 64) + "," + Math.floor(80 + elevation * 48) + "," + (alpha * 0.86) + ")";
    }

    return "rgba(" + Math.floor(96 + elevation * 70) + "," + Math.floor(116 + elevation * 70) + "," + Math.floor(82 + elevation * 46) + "," + alpha + ")";
  }

  function drawTerrainNode(node, mode) {
    if (!node) return;

    var ctx = state.ctx;
    var x = Number(node.x || 0);
    var y = Number(node.y || 0);
    var ll = terrainSeatToLonLat(x + 0.5, y + 0.5);
    var p = project(lonLatPoint(ll.lon, ll.lat));

    if (!p.front) return;

    var elevation = Number(node.dryElevation || node.elevation || 0.5);
    var relief = Math.max(0, Number(node.relativeRelief || 0));
    var baseSize = mode === "body" ? 7.5 : mode === "sixth-sense" ? 10.5 : 12.5;
    var r = Math.max(1.6, state.dpr * (baseSize + elevation * 7 + relief * 8) * p.scale);

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, TAU);
    ctx.fillStyle = nodeColor(node, mode);
    ctx.fill();

    if (mode !== "body" && (node.formerHydrosphereCarved || node.futureFillEligible)) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.56, 0, TAU);
      ctx.fillStyle = node.futureFillEligible ? "rgba(18,39,46,0.30)" : "rgba(38,62,52,0.20)";
      ctx.fill();
    }

    if (mode !== "body" && Number(node.mountainPressure || node.ridgePressure || node.summitPressure || 0) > 0.55) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.26, 0, TAU);
      ctx.fillStyle = "rgba(255,226,162,0.34)";
      ctx.fill();
    }
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
      ctx.arc(p.x, p.y, Math.max(1, state.dpr * 3.0 * p.scale), 0, TAU);
      ctx.fillStyle = mode === "hydration" ? "rgba(141,216,255,0.30)" : "rgba(18,28,35,0.42)";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDryTerrainRelationships() {
    if (!state.dryTerrainValidated) return;

    drawNodeSet(ridgeMountainNodes(), "rgba(244,207,131,0.34)", 2.4, 42);
    drawNodeSet(basinTrenchValleyNodes(), "rgba(96,132,116,0.30)", 2.2, 54);
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

  function drawLattice() {
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var ll = terrainSeatToLonLat(x + 0.5, y + 0.5);
        var p = project(lonLatPoint(ll.lon, ll.lat));

        if (!p.front) continue;

        var major = x % 4 === 0 || y % 4 === 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, state.dpr * (major ? 1.7 : 1.0) * p.scale), 0, TAU);
        ctx.fillStyle = major ? "rgba(244,207,131,.68)" : "rgba(141,216,255,.42)";
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawReceipt() {
    var ctx = state.ctx;
    var m = metrics();
    var w = Math.min(state.width * .80, m.r * 2.1);
    var h = Math.min(state.height * .40, m.r * 1.02);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,.74)";
    ctx.strokeStyle = state.dryTerrainValidated ? "rgba(167,243,198,.42)" : "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = state.dryTerrainValidated ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText(state.dryTerrainValidated ? "DRY TERRAIN ATLAS LIVE" : "DRY TERRAIN ATLAS HELD", m.cx, y + h * .18);

    ctx.font = "900 " + Math.max(8, 9.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("DIRECT CARRIER CONSUMPTION: " + (state.dryTerrainValidated ? "PASS" : "HOLD"), m.cx, y + h * .36);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("HYDRATION HELD · FUTURE FILL ONLY", m.cx, y + h * .52);

    ctx.fillStyle = "rgba(244,207,131,.84)";
    ctx.fillText("GRATITUDE ISLAND READ: FALSE", m.cx, y + h * .68);

    ctx.fillStyle = "rgba(238,244,255,.76)";
    ctx.fillText("FINAL VISUAL PASS: FALSE", m.cx, y + h * .84);

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
    ctx.fillStyle = "rgba(182,245,255,0.78)";
    ctx.fillText("HYDRATION HELD · MAP THE GAPS FIRST", m.cx, m.cy + m.r * 0.74);
    ctx.restore();
  }

  function frame() {
    if (state.stopped || !state.ctx) return;
    state.raf = 0;

    if (!state.dragging) {
      state.yaw += state.vx;
      state.pitch = clamp(state.pitch + state.vy, -1.16, 1.16);
      state.vx *= .94;
      state.vy *= .94;
      if (Math.abs(state.vx) < .00008) state.vx = 0;
      if (Math.abs(state.vy) < .00008) state.vy = 0;
    }

    state.ctx.clearRect(0, 0, state.width, state.height);
    drawSphere();

    if (state.activeLens === "body") {
      drawDryTerrain("body");
    }

    if (state.activeLens === "surface") {
      drawDryTerrain("surface");
      drawFutureFillGaps("surface");
    }

    if (state.activeLens === "hydration") {
      drawDryTerrain("body");
      drawHydrationHeld();
    }

    if (state.activeLens === "sixth-sense") {
      drawDryTerrain("sixth-sense");
      drawDryTerrainRelationships();
    }

    if (state.activeLens === "lattice") {
      drawDryTerrain("body");
      drawLattice();
    }

    if (state.activeLens === "receipt") {
      drawDryTerrain("body");
      drawReceipt();
    }

    state.renderCount += 1;
    publishStatus();

    if (state.dragging || Math.abs(state.vx) > 0 || Math.abs(state.vy) > 0) {
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
        label.innerHTML = "<strong>Surface</strong> → dry revealed physical terrain";
      } else if (lens === "hydration") {
        label.innerHTML = "<strong>Hydration</strong> → held / future fill only";
      } else if (lens === "sixth-sense") {
        label.innerHTML = "<strong>Sixth Sense</strong> → dry terrain relationships";
      } else if (lens === "lattice") {
        label.innerHTML = "<strong>Lattice</strong> → raw 256 inspection";
      } else if (lens === "receipt") {
        label.innerHTML = "<strong>Receipt</strong> → dry atlas consumption proof";
      } else {
        label.innerHTML = "<strong>Body</strong> → hydrosphere-origin shell with dry terrain memory";
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
      state.dragging = true;
      state.px = event.clientX;
      state.py = event.clientY;
      state.vx = 0;
      state.vy = 0;

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

      event.preventDefault();
      requestRender();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
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
      state.dragging = false;
      try { state.stage.releasePointerCapture(event.pointerId); } catch (_error) {}
      requestRender();
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
  }

  function publishStatus() {
    var payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
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
      deployMarker: "AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_PLANET_RUNTIME_CARRIER_DIRECT_DRY_TERRAIN_CONSUMPTION_STATUS = payload;
    window.AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_STATUS = payload;
    window.AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaDryRevealedTerrainDetected = String(state.dryTerrainDetected);
      document.documentElement.dataset.audraliaDryRevealedTerrainValidated = String(state.dryTerrainValidated);
      document.documentElement.dataset.audraliaDirectCarrierConsumption = "true";
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
    state.canvas.setAttribute("data-direct-carrier-consumption", "true");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-gratitude-island-read", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);
    state.ctx = state.canvas.getContext("2d", { alpha: true });

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
    detectDryTerrain: detectDryTerrain
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
