// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_5B_DISPLAY_ONLY_CANVAS_INTERPRETER_TNT_v1
//
// Display-only canvas interpreter.
// The canvas is the screen/projector only.
// Downstream files decide what the globe becomes by emitting generic display primitives.
//
// Consumes:
// - DGBAudraliaCanvasTerrainNodes.getCanvasDisplayPacket()
// - fallback AUDRALIA_CANVAS_DISPLAY_PACKET
//
// Does not directly consume:
// - DGBAudraliaCanvasTerrainNodesSubterranean
// - DGBAudraliaCanvasTerrainNodesAboveSea
// - DGBAudraliaCanvasTerrainNodesBoundary
//
// Does not semantically interpret:
// - landform
// - boundaryClass
// - beachCandidate
// - islandFragmentCandidate
// - subterraneanClass
// - elevationBand
// - terrainPotential
// - hydration meaning
// - future material meaning

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_5B_DISPLAY_ONLY_CANVAS_INTERPRETER_TNT_v1";
  const PREVIOUS_CANVAS_CONTRACT = "AUDRALIA_PLANET_FILE_5_PARENT_CANVAS_TERRAIN_FEED_HANDOFF_TNT_v1";
  const DIRECT_CHILD_CONTRACT = "AUDRALIA_PLANET_FILE_4B_TERRAIN_NODES_DISPLAY_PACKET_COMPOSER_TNT_v1";
  const DIRECT_CHILD_FILE = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const PRIMITIVE_PROTOCOL = "AUDRALIA_CANVAS_DISPLAY_PRIMITIVES_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.js";
  const API_NAME = "DGBAudraliaPlanetCanvas";

  const RADIAL_NODES = 16;
  const FIBONACCI_BANDS = 16;
  const LATTICE_STATES = 256;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const MODES = Object.freeze(["body", "surface", "terrain", "lattice", "receipt"]);

  const DEFAULT_MODE_WEIGHT = Object.freeze({
    body: 0.20,
    surface: 0.40,
    terrain: 0.80,
    lattice: 0.12,
    receipt: 0.30
  });

  const FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  const FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  const BASELINE_FEED = Object.freeze({
    id: "CLAY_GLOBE_BASELINE_FEED",
    role: "DISPLAY_ONLY_CANVAS_FALLBACK",
    publicIdentity: "Audralia",
    templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
    latLongDisposition: "PREDESTINED",
    material: "dry moldable clay",
    activeWater: false,
    hydrationActive: false,
    finalVisualPass: false
  });

  const TEMPLATE = Object.freeze({
    id: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
    publicIdentity: "AUDRALIA",
    publicAustraliaIdentity: false,
    latLongDisposition: "PREDESTINED",
    orientation: Object.freeze({
      yaw: -0.54,
      pitch: -0.18,
      roll: 0
    }),
    anchors: Object.freeze([
      { id: "NW_MEMORY", lat: -15.0, lon: 121.0, mass: 0.78, pressure: 0.42, basin: 0.28 },
      { id: "NORTH_MEMORY", lat: -12.5, lon: 133.0, mass: 0.70, pressure: 0.36, basin: 0.22 },
      { id: "NE_MEMORY", lat: -16.5, lon: 145.0, mass: 0.76, pressure: 0.44, basin: 0.30 },
      { id: "WEST_MEMORY", lat: -25.5, lon: 116.0, mass: 0.90, pressure: 0.58, basin: 0.46 },
      { id: "CENTER_MEMORY", lat: -25.0, lon: 134.0, mass: 1.00, pressure: 0.70, basin: 0.54 },
      { id: "EAST_MEMORY", lat: -27.8, lon: 146.5, mass: 0.86, pressure: 0.62, basin: 0.40 },
      { id: "SW_MEMORY", lat: -33.5, lon: 117.5, mass: 0.76, pressure: 0.56, basin: 0.38 },
      { id: "SOUTH_MEMORY", lat: -35.0, lon: 137.0, mass: 0.72, pressure: 0.52, basin: 0.34 },
      { id: "SE_MEMORY", lat: -37.2, lon: 148.0, mass: 0.74, pressure: 0.58, basin: 0.42 }
    ])
  });

  const CLAY_PALETTE_32 = Object.freeze([
    "rgba(136,103,64,.22)", "rgba(170,130,76,.20)", "rgba(110,91,62,.22)", "rgba(193,153,88,.18)",
    "rgba(82,101,76,.18)", "rgba(116,94,61,.22)", "rgba(146,117,74,.20)", "rgba(203,171,103,.16)",
    "rgba(94,72,52,.24)", "rgba(158,119,70,.20)", "rgba(126,135,91,.16)", "rgba(181,143,86,.18)",
    "rgba(73,82,68,.20)", "rgba(132,101,66,.22)", "rgba(212,181,111,.15)", "rgba(102,85,66,.20)",
    "rgba(151,129,91,.18)", "rgba(121,83,58,.21)", "rgba(173,152,105,.16)", "rgba(89,109,83,.16)",
    "rgba(139,92,63,.20)", "rgba(196,162,100,.16)", "rgba(111,118,84,.16)", "rgba(95,74,54,.22)",
    "rgba(164,132,86,.18)", "rgba(118,96,71,.20)", "rgba(220,190,123,.13)", "rgba(78,88,72,.18)",
    "rgba(144,112,72,.20)", "rgba(102,79,58,.22)", "rgba(181,138,78,.18)", "rgba(126,146,101,.14)"
  ]);

  const state = {
    stage: null,
    canvas: null,
    ctx: null,
    statusNode: null,
    resizeObserver: null,

    width: 0,
    height: 0,
    dpr: 1,
    rect: null,

    mode: "body",
    feed: BASELINE_FEED,

    seats: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],
    fibonacciReturnLinks: [],
    dispositionCells: [],
    contourLines: [],
    ridgeLines: [],
    geometryBuilt: false,

    yaw: TEMPLATE.orientation.yaw,
    pitch: TEMPLATE.orientation.pitch,
    roll: TEMPLATE.orientation.roll,
    velocityYaw: 0,
    velocityPitch: 0,
    pointerActive: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    canvasDisplayPacket: null,
    displayPacketActive: false,
    displayPacketMode: "WAITING_FOR_DISPLAY_PACKET",
    displayPacketLastRead: 0,
    displayPacketError: "",
    displayPacketContract: "",
    displayPrimitiveProtocol: "",
    displayPrimitives: [],
    displayPrimitiveGroups: Object.freeze({}),
    displayPrimitiveTypes: Object.freeze({}),
    displayPrimitiveCount: 0,

    terrainNodesActive: false,
    subterraneanActive: false,
    aboveSeaActive: false,
    boundaryActive: false,

    directChildLoadAttempted: false,
    directChildLoaded: false,

    raf: 0,
    lastFrameTime: 0,
    renderCount: 0,
    settleFrames: 0,
    duplicateCanvasRemoved: 0,

    initialized: false,
    mounted: false,
    stopped: false,
    errors: []
  };

  const previousControllers = [
    "__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__",
    "__AUDRALIA_PLANET_FILE_5_PARENT_CANVAS_CONTROLLER__",
    "__AUDRALIA_PLANET_FILE_5B_DISPLAY_ONLY_CANVAS_CONTROLLER__"
  ];

  for (const key of previousControllers) {
    if (window[key] && typeof window[key].stop === "function") {
      try {
        window[key].stop();
      } catch (_error) {}
    }
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function toRad(degrees) {
    return (degrees / 180) * Math.PI;
  }

  function hash01(seed) {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function query(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function setDataset(key, value) {
    const text = String(value);

    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
    } catch (_error) {}
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    state.displayPacketError = message;
    setDataset("audraliaCanvasError", message);
    publishStatus("error:" + scope);
  }

  function updateVisibleStatus() {
    if (!state.statusNode) return;

    const text = state.displayPacketActive
      ? "Display packet active · " + state.displayPrimitiveCount + " primitives · " + state.displayPacketMode
      : "Display packet waiting · clay fallback active";

    try {
      state.statusNode.textContent = text;
    } catch (_error) {}
  }

  function makeSeat(band, radial) {
    const v = (band + 0.5) / FIBONACCI_BANDS;
    const latitude = Math.asin(1 - 2 * v);
    const longitude = (radial / RADIAL_NODES) * TAU - Math.PI;
    const clat = Math.cos(latitude);
    const fibonacci = FIBONACCI_SEQUENCE[band];

    return Object.freeze({
      seatIndex: band * RADIAL_NODES + radial,
      band,
      radial,
      fibonacci,
      fibonacciPhase: fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1],
      latitude,
      longitude,
      x: clat * Math.cos(longitude),
      y: Math.sin(latitude),
      z: clat * Math.sin(longitude),
      major: radial % 4 === 0 || band % 4 === 0,
      secondary: radial % 2 === 0 || band % 2 === 0,
      colorIndex: (band * 5 + radial * 3) % 32
    });
  }

  function buildGeometry() {
    const rings = [];

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      const ring = [];

      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(makeSeat(band, radial));
      }

      rings.push(Object.freeze(ring));
    }

    function seat(bandIndex, radialIndex) {
      return rings[bandIndex][((radialIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function link(a, b, family, major, secondary) {
      return Object.freeze({
        a,
        b,
        family,
        major: Boolean(major),
        secondary: Boolean(secondary)
      });
    }

    const ringLinks = [];
    const spineLinks = [];
    const fibonacciLinks = [];
    const fibonacciReturnLinks = [];

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        ringLinks.push(link(
          seat(band, radial),
          seat(band, radial + 1),
          "ring",
          band % 4 === 0 || radial % 4 === 0,
          band % 2 === 0 || radial % 2 === 0
        ));
      }
    }

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        spineLinks.push(link(
          seat(band, radial),
          seat(band + 1, radial),
          "spine",
          radial % 4 === 0,
          radial % 2 === 0
        ));
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      const offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const priority = radial % 4 === 0 || band % 4 === 0;

        fibonacciLinks.push(link(
          seat(band, radial),
          seat(band + 1, radial + offset),
          "fibonacci-forward",
          priority,
          radial % 2 === 0 || band % 2 === 0
        ));

        if (band % 2 === 0) {
          fibonacciReturnLinks.push(link(
            seat(band, radial),
            seat(band + 1, radial - offset),
            "fibonacci-return",
            priority,
            radial % 2 === 0 || band % 2 === 0
          ));
        }
      }
    }

    state.seats = rings.flat();
    state.ringLinks = ringLinks;
    state.spineLinks = spineLinks;
    state.fibonacciLinks = fibonacciLinks;
    state.fibonacciReturnLinks = fibonacciReturnLinks;
    state.geometryBuilt = state.seats.length === LATTICE_STATES;

    buildDisposition();
  }

  function centeredTemplateLon(lon) {
    return toRad(lon - 134.5);
  }

  function angularDistance(latA, lonA, latB, lonB) {
    const s1 = Math.sin(latA);
    const s2 = Math.sin(latB);
    const c1 = Math.cos(latA);
    const c2 = Math.cos(latB);
    const dLon = lonA - lonB;
    return Math.acos(clamp(s1 * s2 + c1 * c2 * Math.cos(dLon), -1, 1));
  }

  function buildDisposition() {
    const anchors = TEMPLATE.anchors.map((anchor) => ({
      ...anchor,
      latRad: toRad(anchor.lat),
      lonRad: centeredTemplateLon(anchor.lon)
    }));

    state.dispositionCells = state.seats.map((seat) => {
      let mass = 0;
      let pressure = 0;
      let basin = 0;
      let dominant = "BACKGROUND";

      for (const anchor of anchors) {
        const d = angularDistance(seat.latitude, seat.longitude, anchor.latRad, anchor.lonRad);
        const spread = 0.36 + anchor.mass * 0.14;
        const weight = Math.exp(-(d * d) / (spread * spread));

        mass += weight * anchor.mass;
        pressure += weight * anchor.pressure;
        basin += weight * anchor.basin;

        if (weight * anchor.mass > mass * 0.32) dominant = anchor.id;
      }

      const latitudePressure = 1 - Math.abs(Math.sin(seat.latitude)) * 0.22;
      const fibonacciPressure = 0.78 + seat.fibonacciPhase * 0.38;
      const noise = hash01(seat.seatIndex + 17) * 0.16;
      const intensity = clamp((mass * latitudePressure * fibonacciPressure) + noise, 0, 1.35);
      const normalized = clamp(intensity / 1.08, 0, 1);

      return Object.freeze({
        seat,
        dominant,
        mass: normalized,
        pressure: clamp(pressure, 0, 1.2),
        basin: clamp(basin, 0, 1.1),
        colorIndex: (seat.colorIndex + Math.floor(normalized * 11)) % 32,
        clayHint: clamp((normalized * 0.64 + pressure * 0.22 - basin * 0.10), 0, 1)
      });
    });

    state.contourLines = [];
    state.ridgeLines = [];
  }

  function rotatePoint(point) {
    let x = point.x;
    let y = point.y;
    let z = point.z;

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const y1 = y * cp - z * sp;
    const z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    const cr = Math.cos(state.roll);
    const sr = Math.sin(state.roll);
    const x2 = x * cr - y * sr;
    const y2 = x * sr + y * cr;

    return { x: x2, y: y2, z };
  }

  function pointFromLatLon(latitude, longitude) {
    const lat = clamp(latitude, -HALF_PI, HALF_PI);
    const lon = finite(longitude, 0);
    const clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function metrics() {
    const width = state.width || 640;
    const height = state.height || 720;
    const cssWidth = width / Math.max(1, state.dpr);
    const minSide = Math.min(width, height);

    return {
      centerX: width / 2,
      centerY: height * (cssWidth < 680 ? 0.47 : 0.45),
      radius: minSide * (cssWidth < 680 ? 0.345 : 0.372),
      cameraDistance: 3.9
    };
  }

  function projectPoint(point) {
    const m = metrics();
    const rotated = rotatePoint(point);
    const perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - rotated.z);

    return {
      x: m.centerX + rotated.x * m.radius * perspective,
      y: m.centerY - rotated.y * m.radius * perspective,
      z: rotated.z,
      perspective,
      frontFacing: rotated.z >= -0.05
    };
  }

  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function clipSphere() {
    const ctx = state.ctx;
    const m = metrics();

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.003, 0, TAU);
    ctx.clip();
  }

  function validateDisplayPacket(packet) {
    if (!packet || typeof packet !== "object") return false;
    if (packet.primitiveProtocol !== PRIMITIVE_PROTOCOL) return false;
    if (!Array.isArray(packet.primitives)) return false;

    if (packet.activeWater === true) return false;
    if (packet.hydration === true) return false;
    if (packet.oceans === true) return false;
    if (packet.rivers === true) return false;
    if (packet.lakes === true) return false;
    if (packet.beachRendering === true) return false;
    if (packet.finalVisualPass === true) return false;

    return true;
  }

  function indexDisplayPrimitives(packet) {
    const primitives = Array.isArray(packet && packet.primitives) ? packet.primitives : [];
    const groups = {};
    const types = {};

    for (const primitive of primitives) {
      if (!primitive || typeof primitive !== "object") continue;

      const group = String(primitive.group || "ungrouped");
      const type = String(primitive.type || "unknown");

      groups[group] = (groups[group] || 0) + 1;
      types[type] = (types[type] || 0) + 1;
    }

    state.displayPrimitives = primitives;
    state.displayPrimitiveGroups = Object.freeze(groups);
    state.displayPrimitiveTypes = Object.freeze(types);
    state.displayPrimitiveCount = primitives.length;
  }

  function readCanvasDisplayPacket(scope = "read", forceRefresh = false) {
    try {
      let packet = null;
      const api = window.DGBAudraliaCanvasTerrainNodes;

      if (api && typeof api === "object") {
        if (forceRefresh && typeof api.refreshComposition === "function") {
          try {
            api.refreshComposition();
          } catch (_refreshError) {}
        }

        if (typeof api.getCanvasDisplayPacket === "function") {
          packet = api.getCanvasDisplayPacket();
        }
      }

      if (!packet && window.AUDRALIA_CANVAS_DISPLAY_PACKET) {
        packet = window.AUDRALIA_CANVAS_DISPLAY_PACKET;
      }

      if (!validateDisplayPacket(packet)) {
        state.canvasDisplayPacket = null;
        state.displayPacketActive = false;
        state.displayPacketMode = packet ? "INVALID_DISPLAY_PACKET" : "WAITING_FOR_DISPLAY_PACKET";
        state.displayPacketError = packet ? "INVALID_OR_BLOCKED_DISPLAY_PACKET" : "";
        state.displayPacketContract = "";
        state.displayPrimitiveProtocol = "";
        state.displayPrimitives = [];
        state.displayPrimitiveGroups = Object.freeze({});
        state.displayPrimitiveTypes = Object.freeze({});
        state.displayPrimitiveCount = 0;
        state.terrainNodesActive = false;
        state.subterraneanActive = false;
        state.aboveSeaActive = false;
        state.boundaryActive = false;

        publishStatus("display-packet:" + scope);
        return false;
      }

      state.canvasDisplayPacket = packet;
      state.displayPacketActive = true;
      state.displayPacketMode = String(packet.feedMode || "DISPLAY_PACKET_ACTIVE");
      state.displayPacketLastRead = now();
      state.displayPacketError = "";
      state.displayPacketContract = String(packet.contract || "");
      state.displayPrimitiveProtocol = String(packet.primitiveProtocol || "");
      state.terrainNodesActive = Boolean(packet.terrainNodesActive);
      state.subterraneanActive = Boolean(packet.subterraneanActive);
      state.aboveSeaActive = Boolean(packet.aboveSeaActive);
      state.boundaryActive = Boolean(packet.boundaryActive);

      indexDisplayPrimitives(packet);
      publishStatus("display-packet:" + scope);
      updateVisibleStatus();
      return true;
    } catch (error) {
      state.canvasDisplayPacket = null;
      state.displayPacketActive = false;
      state.displayPacketMode = "DISPLAY_PACKET_READ_ERROR";
      state.displayPacketError = error && error.message ? error.message : String(error || "unknown");
      state.displayPacketContract = "";
      state.displayPrimitiveProtocol = "";
      state.displayPrimitives = [];
      state.displayPrimitiveGroups = Object.freeze({});
      state.displayPrimitiveTypes = Object.freeze({});
      state.displayPrimitiveCount = 0;

      publishStatus("display-packet-error:" + scope);
      updateVisibleStatus();
      return false;
    }
  }

  function loadDirectChildIfNeeded() {
    if (state.directChildLoadAttempted) return;
    state.directChildLoadAttempted = true;

    const api = window.DGBAudraliaCanvasTerrainNodes;

    if (
      api &&
      typeof api.getCanvasDisplayPacket === "function" &&
      api.contract === DIRECT_CHILD_CONTRACT
    ) {
      state.directChildLoaded = true;
      readCanvasDisplayPacket("direct-child-present", true);
      return;
    }

    const existing = query("script[data-audralia-display-packet-composer-loader]");
    if (existing) return;

    try {
      const script = document.createElement("script");
      script.src = DIRECT_CHILD_FILE + "?v=" + encodeURIComponent(DIRECT_CHILD_CONTRACT);
      script.async = true;
      script.defer = true;
      script.setAttribute("data-audralia-display-packet-composer-loader", CONTRACT);
      script.setAttribute("data-direct-child-only", "true");

      script.addEventListener("load", () => {
        state.directChildLoaded = true;
        readCanvasDisplayPacket("direct-child-loaded", true);
        requestRender(20);
      }, { once: true });

      script.addEventListener("error", () => {
        state.directChildLoaded = false;
        state.displayPacketMode = "WAITING_FOR_DISPLAY_PACKET";
        publishStatus("direct-child-load-error");
        requestRender(8);
      }, { once: true });

      (document.head || document.documentElement).appendChild(script);
    } catch (_error) {}
  }

  function displayAlphaForMode(primitive) {
    const alpha = clamp(primitive && primitive.alpha, 0, 1);
    const weights = primitive && primitive.modeWeight && typeof primitive.modeWeight === "object"
      ? primitive.modeWeight
      : DEFAULT_MODE_WEIGHT;

    const weight = Number.isFinite(Number(weights[state.mode]))
      ? Number(weights[state.mode])
      : DEFAULT_MODE_WEIGHT[state.mode];

    return clamp(alpha * weight, 0, 1);
  }

  function primitivePoint(primitive) {
    return projectPoint(pointFromLatLon(finite(primitive.lat, 0), finite(primitive.lon, 0)));
  }

  function primitiveSize(value, fallback) {
    return clamp(value, 0.001, 2) || fallback;
  }

  function applyPrimitiveStroke(ctx, primitive, alpha) {
    if (primitive.stroke) ctx.strokeStyle = String(primitive.stroke);
    else ctx.strokeStyle = "rgba(255,232,163,.42)";

    ctx.globalAlpha = alpha;
    ctx.lineWidth = Math.max(0.25, finite(primitive.lineWidth, 0.65) * state.dpr);
  }

  function applyPrimitiveFill(ctx, primitive, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = primitive.fill ? String(primitive.fill) : "rgba(196,154,92,1)";
  }

  function drawPrimitiveEllipse(primitive) {
    const ctx = state.ctx;
    const p = primitivePoint(primitive);

    if (!p.frontFacing) return;

    const m = metrics();
    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    const width = m.radius * primitiveSize(primitive.width, 0.035) * p.perspective;
    const height = m.radius * primitiveSize(primitive.height, 0.020) * p.perspective;
    const rotation = finite(primitive.rotation, 0) + state.yaw;

    ctx.save();

    if (primitive.fill) {
      applyPrimitiveFill(ctx, primitive, alpha);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, width, height, rotation, 0, TAU);
      ctx.fill();
    }

    if (primitive.stroke) {
      applyPrimitiveStroke(ctx, primitive, alpha * 0.84);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, width, height, rotation, 0, TAU);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPrimitivePoint(primitive) {
    const ctx = state.ctx;
    const p = primitivePoint(primitive);

    if (!p.frontFacing) return;

    const m = metrics();
    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    const radius = Math.max(0.65, m.radius * primitiveSize(primitive.radius, 0.006) * p.perspective);

    ctx.save();
    applyPrimitiveFill(ctx, primitive, alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fill();

    if (primitive.stroke) {
      applyPrimitiveStroke(ctx, primitive, alpha * 0.72);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPrimitiveStroke(primitive) {
    const ctx = state.ctx;
    const points = Array.isArray(primitive.points) ? primitive.points : [];
    if (points.length < 2) return;

    const projected = points.map((point) => projectPoint(pointFromLatLon(finite(point.lat, 0), finite(point.lon, 0))));
    if (!projected.some((point) => point.frontFacing)) return;

    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    ctx.save();
    applyPrimitiveStroke(ctx, primitive, alpha);
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);

    for (let i = 1; i < projected.length; i += 1) {
      ctx.lineTo(projected[i].x, projected[i].y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawPrimitiveCurvedStroke(primitive) {
    const ctx = state.ctx;
    const points = Array.isArray(primitive.points) ? primitive.points : [];
    if (points.length < 2) return;

    const projected = points.map((point) => projectPoint(pointFromLatLon(finite(point.lat, 0), finite(point.lon, 0))));
    if (!projected.some((point) => point.frontFacing)) return;

    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    ctx.save();
    applyPrimitiveStroke(ctx, primitive, alpha);
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);

    if (projected.length >= 3) {
      ctx.quadraticCurveTo(projected[1].x, projected[1].y, projected[2].x, projected[2].y);
    } else {
      const midX = (projected[0].x + projected[1].x) / 2;
      const midY = (projected[0].y + projected[1].y) / 2 - metrics().radius * 0.025;
      ctx.quadraticCurveTo(midX, midY, projected[1].x, projected[1].y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawPrimitiveRing(primitive) {
    const ctx = state.ctx;
    const m = metrics();
    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    const radiusX = primitiveSize(primitive.radiusX, 0.020);
    const radiusY = primitiveSize(primitive.radiusY, 0.012);

    ctx.save();
    applyPrimitiveStroke(ctx, primitive, alpha);

    if (radiusX >= 0.70 && radiusY >= 0.70) {
      ctx.beginPath();
      ctx.ellipse(
        m.centerX,
        m.centerY,
        m.radius * radiusX,
        m.radius * radiusY,
        finite(primitive.rotation, 0),
        0,
        TAU
      );
      ctx.stroke();
      ctx.restore();
      return;
    }

    const p = primitivePoint(primitive);
    if (!p.frontFacing) {
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.ellipse(
      p.x,
      p.y,
      m.radius * radiusX * p.perspective,
      m.radius * radiusY * p.perspective,
      finite(primitive.rotation, 0) + state.yaw,
      0,
      TAU
    );
    ctx.stroke();
    ctx.restore();
  }

  function drawPrimitiveTextureStroke(primitive) {
    const ctx = state.ctx;
    const p = primitivePoint(primitive);

    if (!p.frontFacing) return;

    const alpha = displayAlphaForMode(primitive);
    if (alpha <= 0.005) return;

    const m = metrics();
    const length = m.radius * primitiveSize(primitive.length, 0.030) * p.perspective;
    const angle = finite(primitive.angle, 0) + state.yaw;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    applyPrimitiveStroke(ctx, primitive, alpha);

    ctx.beginPath();
    ctx.moveTo(-length, 0);
    ctx.quadraticCurveTo(0, -length * 0.24, length, 0);
    ctx.stroke();

    ctx.restore();
  }

  function drawDisplayPrimitive(primitive) {
    if (!primitive || typeof primitive !== "object") return;

    const type = String(primitive.type || "");

    if (type === "ellipse") drawPrimitiveEllipse(primitive);
    else if (type === "stroke") drawPrimitiveStroke(primitive);
    else if (type === "curvedStroke") drawPrimitiveCurvedStroke(primitive);
    else if (type === "point") drawPrimitivePoint(primitive);
    else if (type === "ring") drawPrimitiveRing(primitive);
    else if (type === "textureStroke") drawPrimitiveTextureStroke(primitive);
  }

  function drawDisplayPrimitives() {
    if (!state.displayPacketActive || !state.displayPrimitives.length) return;

    const primitives = state.displayPrimitives
      .slice()
      .sort((a, b) => finite(a.zWeight, 0.5) - finite(b.zWeight, 0.5));

    state.ctx.save();
    clipSphere();

    for (const primitive of primitives) {
      drawDisplayPrimitive(primitive);
    }

    state.ctx.restore();
  }

  function drawCarrier() {
    const ctx = state.ctx;
    const m = metrics();
    const cx = m.centerX;
    const cy = m.centerY;
    const r = m.radius;

    ctx.save();

    const clay = ctx.createRadialGradient(cx - r * 0.30, cy - r * 0.35, r * 0.05, cx, cy, r * 1.18);
    clay.addColorStop(0.00, "rgba(236,213,162,.98)");
    clay.addColorStop(0.16, "rgba(184,145,87,.96)");
    clay.addColorStop(0.38, "rgba(124,95,63,.98)");
    clay.addColorStop(0.62, "rgba(82,73,56,.98)");
    clay.addColorStop(0.82, "rgba(48,55,48,.99)");
    clay.addColorStop(1.00, "rgba(16,18,18,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = clay;
    ctx.fill();

    const pressure = ctx.createRadialGradient(cx + r * 0.25, cy + r * 0.28, r * 0.08, cx, cy, r * 1.12);
    pressure.addColorStop(0.00, "rgba(0,0,0,0)");
    pressure.addColorStop(0.48, "rgba(0,0,0,0.08)");
    pressure.addColorStop(0.78, "rgba(0,0,0,0.32)");
    pressure.addColorStop(1.00, "rgba(0,0,0,0.70)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = pressure;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.003, 0, TAU);
    ctx.strokeStyle = "rgba(221,207,161,.28)";
    ctx.lineWidth = Math.max(0.85, state.dpr * 0.82);
    ctx.stroke();

    const screenGlow = ctx.createRadialGradient(cx, cy, r * 0.86, cx, cy, r * 1.22);
    screenGlow.addColorStop(0.00, "rgba(141,216,255,0)");
    screenGlow.addColorStop(0.74, "rgba(141,216,255,0.06)");
    screenGlow.addColorStop(0.93, "rgba(141,216,255,0.18)");
    screenGlow.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.16, 0, TAU);
    ctx.fillStyle = screenGlow;
    ctx.fill();

    ctx.restore();
  }

  function drawClayGrain() {
    const ctx = state.ctx;
    const m = metrics();
    const cx = m.centerX;
    const cy = m.centerY;
    const r = m.radius;

    ctx.save();
    clipSphere();

    ctx.globalAlpha = state.displayPacketActive ? 0.065 : 0.10;

    for (let i = 0; i < 34; i += 1) {
      const y = cy - r + (i / 33) * r * 2;
      const wave = Math.sin(i * 0.7 + state.yaw * 1.2) * r * 0.018;

      ctx.beginPath();
      ctx.moveTo(cx - r * 1.05, y + wave);
      ctx.bezierCurveTo(
        cx - r * 0.35,
        y + Math.sin(i * 0.41 + state.pitch) * r * 0.034,
        cx + r * 0.38,
        y - Math.cos(i * 0.51 + state.yaw) * r * 0.030,
        cx + r * 1.05,
        y - wave
      );

      ctx.strokeStyle = i % 3 === 0 ? "rgba(255,232,163,.28)" : "rgba(41,34,28,.36)";
      ctx.lineWidth = Math.max(0.55, state.dpr * 0.56);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDispositionCells() {
    const ctx = state.ctx;
    const m = metrics();
    const r = m.radius;
    const base = r * 0.056;
    const alphaTrim = state.displayPacketActive ? 0.42 : 1.00;

    const cells = state.dispositionCells
      .map((cell) => ({
        cell,
        point: projectPoint(cell.seat)
      }))
      .filter((item) => item.point.frontFacing && item.cell.mass > 0.13)
      .sort((a, b) => a.point.z - b.point.z);

    ctx.save();
    clipSphere();

    for (const item of cells) {
      const cell = item.cell;
      const p = item.point;

      const width = base * (0.62 + cell.mass * 0.86 + cell.pressure * 0.22) * p.perspective;
      const height = base * (0.38 + cell.basin * 0.54 + cell.mass * 0.22) * p.perspective;

      ctx.save();
      ctx.globalAlpha = clamp((0.20 + cell.mass * 0.48) * alphaTrim, 0.04, 0.60);
      ctx.fillStyle = CLAY_PALETTE_32[cell.colorIndex];

      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y,
        width,
        height,
        cell.seat.longitude + state.yaw + cell.pressure * 0.42,
        0,
        TAU
      );
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawLatLongInspectionGrid() {
    if (state.mode !== "lattice" && state.mode !== "receipt") return;

    const ctx = state.ctx;

    function strokePath(points, stroke, width, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();

      let started = false;

      for (let i = 0; i < points.length; i += 1) {
        const p = projectPoint(points[i]);

        if (!p.frontFacing && i !== 0) continue;

        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    clipSphere();

    for (let row = 1; row < 16; row += 1) {
      const lat = -HALF_PI + (row / 16) * Math.PI;
      const points = [];

      for (let i = 0; i <= 96; i += 1) {
        const lon = -Math.PI + (i / 96) * TAU;
        points.push(pointFromLatLon(lat, lon));
      }

      strokePath(
        points,
        row % 4 === 0 ? "rgba(244,207,131,.38)" : "rgba(141,216,255,.22)",
        row % 4 === 0 ? Math.max(0.75, state.dpr * 0.72) : Math.max(0.45, state.dpr * 0.48),
        state.mode === "receipt" ? 0.34 : 0.52
      );
    }

    for (let col = 0; col < 16; col += 1) {
      const lon = -Math.PI + (col / 16) * TAU;
      const points = [];

      for (let i = 0; i <= 96; i += 1) {
        const lat = -HALF_PI + (i / 96) * Math.PI;
        points.push(pointFromLatLon(lat, lon));
      }

      strokePath(
        points,
        col % 4 === 0 ? "rgba(244,207,131,.32)" : "rgba(141,216,255,.18)",
        col % 4 === 0 ? Math.max(0.70, state.dpr * 0.68) : Math.max(0.42, state.dpr * 0.44),
        state.mode === "receipt" ? 0.28 : 0.44
      );
    }

    ctx.restore();
  }

  function linkColor(link, a, b) {
    const front = a.frontFacing || b.frontFacing;
    const z = (a.z + b.z) / 2;

    if (link.family === "fibonacci-forward") {
      return front
        ? "rgba(244,207,131," + clamp(0.38 + z * 0.12, 0.22, 0.68).toFixed(3) + ")"
        : "rgba(244,207,131,0.08)";
    }

    if (link.family === "fibonacci-return") {
      return front
        ? "rgba(184,238,255," + clamp(0.15 + z * 0.08, 0.08, 0.30).toFixed(3) + ")"
        : "rgba(184,238,255,0.045)";
    }

    if (link.major) {
      return front
        ? "rgba(244,207,131," + clamp(0.36 + z * 0.10, 0.20, 0.60).toFixed(3) + ")"
        : "rgba(244,207,131,0.07)";
    }

    return front
      ? "rgba(112,199,255," + clamp(0.18 + z * 0.08, 0.09, 0.34).toFixed(3) + ")"
      : "rgba(112,199,255,0.040)";
  }

  function drawLinks(links, reduced) {
    const ctx = state.ctx;

    for (const link of links) {
      if (reduced && !link.major && link.family.includes("fibonacci")) continue;

      const a = projectPoint(link.a);
      const b = projectPoint(link.b);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = linkColor(link, a, b);
      ctx.lineWidth = link.major ? Math.max(0.72, state.dpr * 0.72) : Math.max(0.40, state.dpr * 0.42);
      ctx.stroke();
    }
  }

  function drawSeats(reduced) {
    const ctx = state.ctx;

    for (const seat of state.seats) {
      if (reduced && !seat.major) continue;

      const p = projectPoint(seat);
      const alpha = p.frontFacing ? (seat.major ? 0.80 : 0.52) : (seat.major ? 0.15 : 0.06);
      const radius = seat.major ? 2.2 : seat.secondary ? 1.45 : 1.08;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.88, radius * state.dpr * p.perspective), 0, TAU);
      ctx.fillStyle = seat.major
        ? "rgba(244,207,131," + alpha.toFixed(3) + ")"
        : "rgba(141,216,255," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  function drawDiagnosticLattice(reduced) {
    const ctx = state.ctx;

    if (state.mode !== "lattice" && state.mode !== "receipt") return;

    ctx.save();
    clipSphere();

    drawLinks(state.ringLinks, reduced);
    drawLinks(state.spineLinks, reduced);

    if (!reduced || state.mode === "receipt") {
      drawLinks(state.fibonacciReturnLinks, false);
    }

    drawLinks(state.fibonacciLinks, reduced);
    drawSeats(reduced);

    ctx.restore();
  }

  function drawReceiptOverlay() {
    if (state.mode !== "receipt") return;

    const ctx = state.ctx;
    const m = metrics();
    const cx = m.centerX;
    const cy = m.centerY;
    const r = m.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TAU);
    ctx.strokeStyle = state.displayPacketActive ? "rgba(244,207,131,.58)" : "rgba(244,207,131,.46)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.15);
    ctx.setLineDash([6 * state.dpr, 8 * state.dpr]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = state.displayPacketActive ? 0.22 : 0.18;
    ctx.fillStyle = "rgba(244,207,131,.30)";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.012, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawScreenGlass() {
    const ctx = state.ctx;
    const m = metrics();
    const cx = m.centerX;
    const cy = m.centerY;
    const r = m.radius;

    ctx.save();

    const glass = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.42, r * 0.08, cx + r * 0.32, cy + r * 0.28, r * 1.16);
    glass.addColorStop(0.00, "rgba(255,255,255,.20)");
    glass.addColorStop(0.30, "rgba(255,255,255,.02)");
    glass.addColorStop(0.74, "rgba(0,0,0,.24)");
    glass.addColorStop(1.00, "rgba(0,0,0,.64)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = glass;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.006, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,.23)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.05);
    ctx.stroke();

    ctx.restore();
  }

  function renderFrame(timestamp) {
    if (state.stopped || !state.ctx || !state.geometryBuilt) return;

    state.raf = 0;

    if (state.renderCount % 42 === 0 || (!state.displayPacketActive && state.renderCount % 18 === 0)) {
      readCanvasDisplayPacket("render-poll", false);
    }

    const dt = state.lastFrameTime ? clamp((timestamp - state.lastFrameTime) / 1000, 0, 0.05) : 0;
    state.lastFrameTime = timestamp;

    if (!state.pointerActive) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      const damping = Math.pow(0.938, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

      if (state.velocityYaw === 0 && state.velocityPitch === 0 && state.settleFrames > 0) {
        state.yaw += Math.sin(timestamp * 0.00018) * dt * 0.012;
      }
    }

    state.pitch = clamp(state.pitch, -1.12, 1.12);
    state.roll = Math.sin(timestamp * 0.00018) * 0.010;

    clearCanvas();

    drawCarrier();
    drawClayGrain();
    drawDispositionCells();
    drawDisplayPrimitives();
    drawLatLongInspectionGrid();
    drawDiagnosticLattice(state.pointerActive || state.mode === "body");
    drawReceiptOverlay();
    drawScreenGlass();

    state.renderCount += 1;

    if (state.settleFrames > 0) state.settleFrames -= 1;

    publishStatus("render");

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(settleFrames = 0) {
    state.settleFrames = Math.max(state.settleFrames, settleFrames);

    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function pointerPoint(event) {
    const rect = state.rect || state.stage.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function resetView() {
    state.yaw = TEMPLATE.orientation.yaw;
    state.pitch = TEMPLATE.orientation.pitch;
    state.roll = TEMPLATE.orientation.roll;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    readCanvasDisplayPacket("reset-view", true);
    requestRender(14);
    publishStatus("reset-view");
    return status();
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", (event) => {
      const time = now();

      if (time - state.lastTap < 320) {
        resetView();
      }

      state.lastTap = time;
      state.pointerActive = true;
      state.pointerId = event.pointerId;

      const p = pointerPoint(event);
      state.pointerX = p.x;
      state.pointerY = p.y;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      requestRender(4);
      event.preventDefault();
    }, { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.pointerActive) return;

      const p = pointerPoint(event);
      const dx = p.x - state.pointerX;
      const dy = p.y - state.pointerY;

      state.pointerX = p.x;
      state.pointerY = p.y;

      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.12, 1.12);
      state.velocityYaw = clamp(dx * 0.0022, -0.048, 0.048);
      state.velocityPitch = clamp(dy * 0.0014, -0.038, 0.038);

      requestRender(2);
      event.preventDefault();
    }, { passive: false });

    const release = (event) => {
      if (!state.pointerActive) return;

      state.pointerActive = false;

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;
      requestRender(18);

      try {
        event.preventDefault();
      } catch (_error2) {}
    };

    state.stage.addEventListener("pointerup", release, { passive: false });
    state.stage.addEventListener("pointercancel", release, { passive: false });
    state.stage.addEventListener("lostpointercapture", release, { passive: false });
  }

  function enforceOneCanvas() {
    if (!state.stage) return false;

    let canvas = query("[data-audralia-planet-canvas]", state.stage);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "planet-canvas";
      canvas.setAttribute("data-audralia-planet-canvas", "");
      canvas.setAttribute("aria-label", "Audralia display-only canvas");
      state.stage.appendChild(canvas);
    }

    const canvases = Array.from(state.stage.querySelectorAll("canvas"));

    for (const item of canvases) {
      if (item === canvas) continue;

      try {
        item.remove();
        state.duplicateCanvasRemoved += 1;
      } catch (_error) {}
    }

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.pointerEvents = "none";

    canvas.setAttribute("data-audralia-canvas-contract", CONTRACT);
    canvas.setAttribute("data-previous-canvas-contract", PREVIOUS_CANVAS_CONTRACT);
    canvas.setAttribute("data-direct-child-contract", DIRECT_CHILD_CONTRACT);
    canvas.setAttribute("data-primitive-protocol", PRIMITIVE_PROTOCOL);
    canvas.setAttribute("data-canvas-role", "display-only-interpreter");
    canvas.setAttribute("data-public-identity", "Audralia");
    canvas.setAttribute("data-template-source", "Australia-template hidden scaffold");
    canvas.setAttribute("data-active-water", "false");
    canvas.setAttribute("data-hydration", "false");
    canvas.setAttribute("data-final-visual-pass", "false");

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
    state.mounted = Boolean(state.ctx);

    state.stage.dataset.canvasRole = "display-only-interpreter";
    state.stage.dataset.screenRole = "display-only-canvas";
    state.stage.dataset.rendererState = "active";
    state.stage.dataset.activeWater = "false";
    state.stage.dataset.hydration = "false";
    state.stage.dataset.finalVisualPass = "false";

    return state.mounted;
  }

  function updateDimensions(rect) {
    if (!rect || !state.canvas || !state.ctx) return false;

    const dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    const width = Math.max(320, Math.floor(rect.width * dpr));
    const height = Math.max(520, Math.floor(rect.height * dpr));

    state.rect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };

    if (state.width === width && state.height === height && state.dpr === dpr) return false;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;

    requestRender(8);
    return true;
  }

  function measureStage() {
    if (!state.stage) return false;
    return updateDimensions(state.stage.getBoundingClientRect());
  }

  function setupResize() {
    measureStage();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      state.resizeObserver = new ResizeObserver((entries) => {
        const box = state.stage.getBoundingClientRect();
        const content = entries && entries[0] ? entries[0].contentRect : box;

        updateDimensions({
          left: box.left,
          top: box.top,
          width: content.width,
          height: content.height
        });
      });

      try {
        state.resizeObserver.observe(state.stage);
      } catch (_error) {}
    }

    window.addEventListener("resize", () => {
      measureStage();
      requestRender(8);
    }, { passive: true });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        measureStage();
        requestRender(8);
      }, 120);
    }, { passive: true });
  }

  function setMode(mode) {
    const next = MODES.includes(mode) ? mode : "body";

    state.mode = next;

    readCanvasDisplayPacket("set-mode", true);

    setDataset("audraliaCanvasMode", next);
    setDataset("audraliaCanvasContract", CONTRACT);
    setDataset("audraliaCanvasRole", "display-only-interpreter");

    requestRender(next === "body" ? 8 : 16);
    publishStatus("set-mode");

    return status();
  }

  function setFeed(feedPacket) {
    if (!feedPacket || typeof feedPacket !== "object") {
      state.feed = BASELINE_FEED;
      requestRender(8);
      publishStatus("set-feed-baseline");
      return status();
    }

    state.feed = Object.freeze({
      ...BASELINE_FEED,
      ...feedPacket,
      id: feedPacket.id || BASELINE_FEED.id,
      publicIdentity: "Audralia",
      templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      activeWater: false,
      hydrationActive: false,
      finalVisualPass: false
    });

    requestRender(8);
    publishStatus("set-feed");

    return status();
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      previousCanvasContract: PREVIOUS_CANVAS_CONTRACT,
      directChildContract: DIRECT_CHILD_CONTRACT,
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      route: ROUTE,
      target: TARGET,
      api: API_NAME,

      initialized: state.initialized,
      mounted: state.mounted,
      screenRole: "DISPLAY_ONLY_CANVAS_INTERPRETER",
      currentMode: state.mode,
      feed: state.feed.id || BASELINE_FEED.id,
      baselineFeed: BASELINE_FEED.id,

      displayPacketActive: state.displayPacketActive,
      displayPacketMode: state.displayPacketMode,
      displayPacketContract: state.displayPacketContract,
      displayPrimitiveProtocol: state.displayPrimitiveProtocol,
      displayPrimitiveCount: state.displayPrimitiveCount,
      displayPrimitiveGroups: state.displayPrimitiveGroups,
      displayPrimitiveTypes: state.displayPrimitiveTypes,
      displayPacketError: state.displayPacketError,

      terrainNodesActive: state.terrainNodesActive,
      subterraneanActive: state.subterraneanActive,
      aboveSeaActive: state.aboveSeaActive,
      boundaryActive: state.boundaryActive,

      publicIdentity: "Audralia",
      templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      publicAustraliaIdentity: false,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: state.seats.length,
      geometryBuilt: state.geometryBuilt,

      activeWater: false,
      hydrationActive: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      generatedImage: false,
      graphicBox: false,
      finalVisualPass: false,

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      directChildLoaded: state.directChildLoaded,
      errors: state.errors.slice()
    });
  }

  function publishStatus(scope = "status") {
    const payload = Object.freeze({
      ...status(),
      scope,
      time: new Date().toISOString()
    });

    window.AUDRALIA_PLANET_CANVAS_DISPLAY_ONLY_INTERPRETER_STATUS = payload;
    window.AUDRALIA_PLANET_CANVAS_DISPLAY_ONLY_INTERPRETER_RECEIPT = payload;

    window.AUDRALIA_G2_PLANET_CANVAS_RECEIPT = payload;
    window.AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_STATUS = payload;
    window.AUDRALIA_PLANET_CANVAS_TERRAIN_FEED_HANDOFF_STATUS = payload;
    window.AUDRALIA_PLANET_CANVAS_TERRAIN_FEED_HANDOFF_RECEIPT = payload;

    setDataset("audraliaCanvasContract", CONTRACT);
    setDataset("audraliaCanvasPreviousContract", PREVIOUS_CANVAS_CONTRACT);
    setDataset("audraliaCanvasDirectChildContract", DIRECT_CHILD_CONTRACT);
    setDataset("audraliaCanvasRole", "display-only-interpreter");
    setDataset("audraliaCanvasPublicIdentity", "Audralia");
    setDataset("audraliaCanvasTemplateSource", "Australia-template-hidden-scaffold");

    setDataset("audraliaCanvasDisplayPacketActive", state.displayPacketActive ? "true" : "false");
    setDataset("audraliaCanvasDisplayPacketMode", state.displayPacketMode);
    setDataset("audraliaCanvasDisplayPacketContract", state.displayPacketContract);
    setDataset("audraliaCanvasDisplayPrimitiveProtocol", state.displayPrimitiveProtocol);
    setDataset("audraliaCanvasDisplayPrimitiveCount", state.displayPrimitiveCount);

    setDataset("audraliaCanvasTerrainNodesActive", state.terrainNodesActive ? "true" : "false");
    setDataset("audraliaCanvasTerrainSubterraneanActive", state.subterraneanActive ? "true" : "false");
    setDataset("audraliaCanvasTerrainAboveSeaActive", state.aboveSeaActive ? "true" : "false");
    setDataset("audraliaCanvasTerrainBoundaryActive", state.boundaryActive ? "true" : "false");

    setDataset("audraliaCanvasActiveWater", "false");
    setDataset("audraliaCanvasHydrationActive", "false");
    setDataset("audraliaCanvasOceans", "false");
    setDataset("audraliaCanvasRivers", "false");
    setDataset("audraliaCanvasLakes", "false");
    setDataset("audraliaCanvasBeachRendering", "false");
    setDataset("audraliaCanvasGeneratedImage", "false");
    setDataset("audraliaCanvasGraphicBox", "false");
    setDataset("audraliaCanvasFinalVisualPass", "false");
    setDataset("audraliaCanvasRenderCount", state.renderCount);
    setDataset("audraliaCanvasMounted", state.mounted ? "true" : "false");

    updateVisibleStatus();

    return payload;
  }

  function exposeApi() {
    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      previousCanvasContract: PREVIOUS_CANVAS_CONTRACT,
      directChildContract: DIRECT_CHILD_CONTRACT,
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      baselineFeed: BASELINE_FEED,
      setFeed,
      setMode,
      resetView,
      readCanvasDisplayPacket,
      status
    });
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    state.raf = 0;

    if (state.resizeObserver) {
      try {
        state.resizeObserver.disconnect();
      } catch (_error) {}
    }
  }

  const controller = {
    stop,
    state,
    contract: CONTRACT,
    status,
    setMode,
    setFeed,
    resetView,
    readCanvasDisplayPacket
  };

  window.__AUDRALIA_PLANET_FILE_5B_DISPLAY_ONLY_CANVAS_CONTROLLER__ = controller;
  window.__AUDRALIA_PLANET_FILE_5_PARENT_CANVAS_CONTROLLER__ = controller;
  window.__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__ = controller;

  function init() {
    try {
      exposeApi();

      state.stage = query("[data-audralia-planet-stage]");
      state.statusNode = query("[data-audralia-renderer-status]");

      if (!state.stage) {
        recordError("init", "Missing [data-audralia-planet-stage]");
        state.initialized = true;
        publishStatus("fallback-no-stage");
        return;
      }

      if (!enforceOneCanvas()) {
        recordError("init", "Canvas context unavailable");
        state.initialized = true;
        publishStatus("fallback-no-canvas-context");
        return;
      }

      buildGeometry();
      setupResize();
      bindPointer();

      state.initialized = true;
      state.mounted = true;

      readCanvasDisplayPacket("init", true);
      loadDirectChildIfNeeded();

      publishStatus("init-complete");
      requestRender(18);
    } catch (error) {
      recordError("init", error);
      state.initialized = true;
      publishStatus("init-error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
