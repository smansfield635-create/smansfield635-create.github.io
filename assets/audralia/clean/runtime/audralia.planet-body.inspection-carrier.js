// /assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js
// AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_COMPOSITOR_FIRST_TNT_v1
// Full-file replacement.
// Scope: runtime carrier, not a Gratitude child.
// Purpose: detect four Gratitude children, consume compositor first, draw lens expression, preserve Lattice raw inspection.
// Does not own terrain, hydration, edge, composition truth, or final visual pass.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_COMPOSITOR_FIRST_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_SURFACE_HYDRATION_SIXTH_SENSE_TNT_v1";
  var FILE = "/assets/audralia/clean/runtime/audralia.planet-body.inspection-carrier.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;

  var CHILDREN = {
    surface: [
      "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_CHILD",
      "AUDRALIA_G2_GRATITUDE_SURFACE_HABITABILITY_CHILD",
      "AUDRALIA_GRATITUDE_SURFACE_HABITABILITY_FIELD_BLUEPRINT_CHILD"
    ],
    hydration: [
      "AUDRALIA_GRATITUDE_HYDRATION_CHILD",
      "AUDRALIA_G2_GRATITUDE_HYDRATION_CHILD",
      "AUDRALIA_GRATITUDE_HYDRATION_SCOPE_CHILD"
    ],
    edge: [
      "AUDRALIA_GRATITUDE_HYDRATION_EDGE_CHILD",
      "AUDRALIA_GRATITUDE_HYDRATION_EDGE_SCOPE_CHILD",
      "AUDRALIA_G2_GRATITUDE_HYDRATION_EDGE_CHILD"
    ],
    compositor: [
      "AUDRALIA_GRATITUDE_LANDFORM_COMPOSITOR_CHILD",
      "AUDRALIA_GRATITUDE_UNIFIED_LANDFORM_CHILD",
      "AUDRALIA_G2_GRATITUDE_LANDFORM_COMPOSITOR_CHILD"
    ]
  };

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

    children: {},
    compositorPacket: null,
    carrierPacket: null,
    errors: []
  };

  if (
    window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop === "function"
  ) {
    try { window.__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__.stop(); } catch (_e) {}
  }

  function routeAllowed() {
    var htmlRoute = normalize(document.documentElement.getAttribute("data-route") || "");
    var path = normalize(window.location ? window.location.pathname : "");
    return htmlRoute === ROUTE || path === ROUTE;
  }

  function normalize(value) {
    var text = String(value || "");
    return text.endsWith("/") ? text : text + "/";
  }

  function clamp(value, min, max) {
    var n = Number(value);
    if (!Number.isFinite(n)) n = min;
    return Math.max(min, Math.min(max, n));
  }

  function firstGlobal(names) {
    for (var i = 0; i < names.length; i += 1) {
      if (window[names[i]]) return window[names[i]];
    }
    return null;
  }

  function safeCall(api, method) {
    if (!api || typeof api[method] !== "function") return null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 2));
    } catch (error) {
      state.errors.push({
        scope: method,
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
    return { x: clat * Math.cos(lon), y: Math.sin(lat), z: clat * Math.sin(lon) };
  }

  function terrainSeatToLonLat(x, y) {
    return {
      lon: -142 + (x / 15) * 108,
      lat: 56 - (y / 15) * 112
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
      front: p.z >= -0.05,
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
    var dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    state.dpr = dpr;
    state.width = Math.max(320, Math.floor(rect.width * dpr));
    state.height = Math.max(600, Math.floor(rect.height * dpr));
    state.canvas.width = state.width;
    state.canvas.height = state.height;
    requestRender();
  }

  function detectChildren() {
    state.children = {
      surface: detectChild("surface", CHILDREN.surface),
      hydration: detectChild("hydration", CHILDREN.hydration),
      edge: detectChild("hydration-edge", CHILDREN.edge),
      compositor: detectChild("landform-compositor", CHILDREN.compositor)
    };

    var compositorApi = state.children.compositor.api;

    state.carrierPacket = safeCall(
      compositorApi,
      "getCarrierReceivePacket",
      "audralia-runtime-carrier",
      { compact: false }
    );

    state.compositorPacket = safeCall(
      compositorApi,
      "getUnifiedLandformPacket",
      "audralia-runtime-carrier",
      { compact: false }
    );

    publishStatus();
    requestRender();
  }

  function detectChild(name, globals) {
    var api = firstGlobal(globals);
    var detected = Boolean(api);
    var status = safeCall(api, "status");

    return {
      name: name,
      globals: globals.slice(),
      api: api,
      detected: detected,
      apiComplete: Boolean(api && typeof api.status === "function"),
      status: status,
      valid: Boolean(detected && status && status.finalVisualPassClaim === false),
      failureReason: detected ? "" : name + " missing"
    };
  }

  function compositorValid() {
    return Boolean(
      state.children.compositor &&
      state.children.compositor.detected &&
      state.carrierPacket &&
      state.carrierPacket.carrierReceivePacketReady === true &&
      state.carrierPacket.carrierInventsLandform === false &&
      state.carrierPacket.finalVisualPassClaim === false
    );
  }

  function drawSphere() {
    var ctx = state.ctx;
    var m = metrics();

    var ocean = ctx.createRadialGradient(m.cx - m.r * 0.34, m.cy - m.r * 0.38, 0, m.cx, m.cy, m.r * 1.22);
    ocean.addColorStop(0.00, "rgba(171,235,246,0.92)");
    ocean.addColorStop(0.12, "rgba(55,145,196,0.88)");
    ocean.addColorStop(0.34, "rgba(13,75,143,0.98)");
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

  function pathPoints(path) {
    if (!path || !Array.isArray(path.points)) return [];
    return path.points;
  }

  function toPoint(entry) {
    if (Array.isArray(entry)) return lonLatPoint(entry[0], entry[1]);
    return lonLatPoint(entry.lon, entry.lat);
  }

  function drawPath(points, opts) {
    if (!points || points.length < 2) return false;

    var ctx = state.ctx;
    var projected = [];
    var front = 0;

    points.forEach(function (pt) {
      var p = project(toPoint(pt));
      projected.push(p);
      if (p.front) front += 1;
    });

    if (front < 2) return false;

    ctx.save();
    clipSphere();
    ctx.globalAlpha = opts.alpha;
    ctx.beginPath();

    projected.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    if (opts.fill) {
      ctx.closePath();
      ctx.fillStyle = opts.fill;
      ctx.fill();
    }

    if (opts.stroke) {
      ctx.strokeStyle = opts.stroke;
      ctx.lineWidth = opts.width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();
    return true;
  }

  function drawNodeDots(nodes, opts) {
    if (!Array.isArray(nodes)) return;

    var ctx = state.ctx;
    var count = 0;

    ctx.save();
    clipSphere();

    nodes.forEach(function (node) {
      if (count >= opts.limit) return;

      var loc = terrainSeatToLonLat((node.x || 0) + 0.5, (node.y || 0) + 0.5);
      var p = project(lonLatPoint(loc.lon, loc.lat));
      if (!p.front) return;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.9, state.dpr * opts.radius * p.scale), 0, TAU);
      ctx.fillStyle = opts.fill;
      ctx.globalAlpha = opts.alpha;
      ctx.fill();

      count += 1;
    });

    ctx.restore();
  }

  function drawCompositor(mode) {
    if (!compositorValid()) return;

    var carrier = state.carrierPacket || {};
    var surface = carrier.surfaceCompositePacket || {};
    var hydration = carrier.hydrationCompositePacket || {};
    var sixth = carrier.sixthSenseCompositePacket || {};
    var packet = state.compositorPacket || {};

    var coastline =
      pathPoints(surface.coastlinePath) ||
      pathPoints(packet.coastlinePath);

    if (!coastline.length && packet.coastlinePath) coastline = pathPoints(packet.coastlinePath);

    if (mode === "body") {
      if (coastline.length) {
        drawPath(coastline, {
          fill: "rgba(105,138,88,.10)",
          stroke: "rgba(244,207,131,.12)",
          width: Math.max(.6, state.dpr * .65),
          alpha: .72
        });
      }
      return;
    }

    if (mode === "surface") {
      drawPath(coastline, {
        fill: "rgba(115,151,87,.52)",
        stroke: "rgba(244,207,131,.42)",
        width: Math.max(.8, state.dpr * .9),
        alpha: .94
      });

      drawNodeDots(surface.nodes || [], {
        fill: "rgba(244,207,131,.16)",
        radius: 5.2,
        alpha: .48,
        limit: 46
      });
      return;
    }

    if (mode === "hydration") {
      drawPath(coastline, {
        fill: "rgba(91,132,91,.26)",
        stroke: "rgba(182,245,255,.32)",
        width: Math.max(.8, state.dpr * .9),
        alpha: .86
      });

      var flow = hydration.hydrationFlowField || {};
      (flow.flowPaths || []).forEach(function (path) {
        drawPath(path.points || [], {
          stroke: "rgba(139,231,255,.78)",
          width: Math.max(.9, state.dpr * 1.12),
          alpha: .78
        });
      });

      drawNodeDots((flow.nodes || hydration.nodes || []), {
        fill: "rgba(182,245,255,.36)",
        radius: 2.2,
        alpha: .85,
        limit: 34
      });
      return;
    }

    if (mode === "sixth-sense") {
      drawPath(coastline, {
        fill: "rgba(118,151,92,.43)",
        stroke: "rgba(244,207,131,.54)",
        width: Math.max(1, state.dpr * 1.05),
        alpha: .96
      });

      var relation = sixth.edgeRelationshipField || {};
      var flow2 = sixth.hydrationFlowField || {};

      (flow2.flowPaths || []).forEach(function (path) {
        drawPath(path.points || [], {
          stroke: "rgba(139,231,255,.76)",
          width: Math.max(.9, state.dpr * 1.06),
          alpha: .70
        });
      });

      drawNodeDots(relation.nodes || [], {
        fill: "rgba(255,226,162,.38)",
        radius: 2.0,
        alpha: .88,
        limit: 40
      });
    }
  }

  function drawLattice() {
    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        var loc = terrainSeatToLonLat(x + 0.5, y + 0.5);
        var p = project(lonLatPoint(loc.lon, loc.lat));
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
    var w = Math.min(state.width * .78, m.r * 2.0);
    var h = Math.min(state.height * .38, m.r * .96);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();
    ctx.fillStyle = "rgba(2,8,20,.70)";
    ctx.strokeStyle = compositorValid() ? "rgba(167,243,198,.42)" : "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, state.dpr);

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(12, 14 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = compositorValid() ? "rgba(167,243,198,.94)" : "rgba(244,207,131,.92)";
    ctx.fillText(compositorValid() ? "FOUR CHILDREN → RUNTIME PASS" : "FOUR CHILDREN → RUNTIME HOLD", m.cx, y + h * .18);

    ctx.font = "900 " + Math.max(8, 9.5 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(238,244,255,.84)";
    ctx.fillText("SURFACE " + passText("surface") + " · HYDRATION " + passText("hydration") + " · EDGE " + passText("edge"), m.cx, y + h * .36);

    ctx.fillStyle = "rgba(141,216,255,.84)";
    ctx.fillText("COMPOSITOR " + passText("compositor") + " · CARRIER IS RUNTIME", m.cx, y + h * .52);

    ctx.fillStyle = "rgba(244,207,131,.84)";
    ctx.fillText("LEGACY BROAD CHILD ACTIVE: FALSE", m.cx, y + h * .68);

    ctx.fillStyle = "rgba(238,244,255,.76)";
    ctx.fillText("FINAL VISUAL PASS: FALSE", m.cx, y + h * .84);

    ctx.restore();
  }

  function passText(key) {
    return state.children[key] && state.children[key].detected ? "PASS" : "HOLD";
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

    if (state.activeLens === "body") drawCompositor("body");
    if (state.activeLens === "surface") drawCompositor("surface");
    if (state.activeLens === "hydration") drawCompositor("hydration");
    if (state.activeLens === "sixth-sense") drawCompositor("sixth-sense");
    if (state.activeLens === "lattice") drawLattice();
    if (state.activeLens === "receipt") drawReceipt();

    state.renderCount += 1;
    publishStatus();

    if (state.dragging || Math.abs(state.vx) > 0 || Math.abs(state.vy) > 0) {
      requestRender();
    }
  }

  function requestRender() {
    if (!state.raf && !state.stopped) state.raf = window.requestAnimationFrame(frame);
  }

  function setLens(value) {
    var lens = String(value || "body");
    if (!LENSES[lens]) lens = "body";
    state.activeLens = lens;

    document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.audraliaPlanetLens === lens ? "true" : "false");
    });

    var label = document.querySelector("[data-audralia-planet-stage-label]");
    if (label) label.innerHTML = "<strong>" + LENSES[lens] + "</strong> → " + (lens === "lattice" ? "raw 256 inspection" : "runtime carrier expression");

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
      try { state.stage.setPointerCapture(event.pointerId); } catch (_e) {}
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
      try { state.stage.releasePointerCapture(event.pointerId); } catch (_e) {}
      requestRender();
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
  }

  function publishStatus() {
    var payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      target: FILE,
      route: ROUTE,

      gratitudeChildCount: 4,
      carrierIsRuntime: true,
      legacyBroadContinentChildActive: false,
      compositorFirst: true,

      surfaceHabitabilityDetected: Boolean(state.children.surface && state.children.surface.detected),
      hydrationDetected: Boolean(state.children.hydration && state.children.hydration.detected),
      hydrationEdgeDetected: Boolean(state.children.edge && state.children.edge.detected),
      landformCompositorDetected: Boolean(state.children.compositor && state.children.compositor.detected),
      landformCompositorValidated: compositorValid(),

      carrierConsumesCompositor: compositorValid(),
      carrierInventsLandform: false,
      carrierInventsTerrain: false,
      carrierInventsHydration: false,
      carrierInventsEdge: false,

      rawParcelsLatticeOnly: true,
      activeLens: state.activeLens,
      renderCount: state.renderCount,

      finalTerrainPassClaim: false,
      finalHydrationPassClaim: false,
      finalCompositePassClaim: false,
      finalVisualPassClaim: false,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_COMPOSITOR_FIRST_DEPLOY_MARKER_v1"
    };

    window.AUDRALIA_PLANET_RUNTIME_CARRIER_FOUR_CHILD_RECEIPT_STATUS = payload;
    window.AUDRALIA_PLANET_CARRIER_COMPOSITOR_CONSUMPTION_STATUS = payload;

    try {
      document.documentElement.dataset.audraliaCarrierIsRuntime = "true";
      document.documentElement.dataset.audraliaGratitudeChildCount = "4";
      document.documentElement.dataset.audraliaLegacyBroadContinentChildActive = "false";
      document.documentElement.dataset.audraliaLandformCompositorValidated = String(compositorValid());
      document.documentElement.dataset.audraliaFinalVisualPassClaim = "false";
    } catch (_e) {}

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
    state.canvas.setAttribute("data-carrier-is-runtime", "true");
    state.canvas.setAttribute("data-gratitude-child-count", "4");
    state.canvas.setAttribute("data-legacy-broad-continent-child-active", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");
    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);
    state.ctx = state.canvas.getContext("2d", { alpha: true });

    resize();
    bindControls();
    detectChildren();

    setTimeout(detectChildren, 180);
    setTimeout(detectChildren, 640);
    setTimeout(detectChildren, 1200);

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
    detectChildren: detectChildren
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
