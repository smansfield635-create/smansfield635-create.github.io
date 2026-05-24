// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_OPERATION_A_DONOR_CANVAS_FEED_EVOLUTION_TNT_v1
//
// Operation A:
// - Canvas feed evolution only.
// - Harvests the proven Audralia G1 globe mechanics: sphere projection, 360 drag, 16 × 16 lattice, Fibonacci links, one-canvas discipline.
// - Strips datum loading, old diagnostic slots, old route reporting, and hydrosphere active-water read.
// - Evolves the visible body into a dry clay-globe baseline feed with predestined latitude / longitude disposition.
// - Public identity remains Audralia.
// - Australia-template remains hidden scaffold only.
//
// Does not touch:
// - Shell.
// - UI.
// - Gems.
// - Tabs.
// - Chambers.
// - Billboard/stat card.
// - Active water.
// - Final visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_OPERATION_A_DONOR_CANVAS_FEED_EVOLUTION_TNT_v1";
  const PREVIOUS_CANVAS_CONTRACT = "AUDRALIA_G2_PLANET_CLAY_GLOBE_TV_SCREEN_CANVAS_TNT_v1";
  const DONOR_CONTRACT = "AUDRALIA_G1_DATUM_CLONING_METHOD_CONSUMER_ROUTE_JS_DIAGNOSTIC_REPORTING_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.js";
  const DONOR = "/showroom/globe/audralia/index.js";
  const API_NAME = "DGBAudraliaPlanetCanvas";

  const RADIAL_NODES = 16;
  const FIBONACCI_BANDS = 16;
  const LATTICE_STATES = 256;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  const FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  const MODES = Object.freeze(["body", "surface", "terrain", "lattice", "receipt"]);

  const BASELINE_FEED = Object.freeze({
    id: "CLAY_GLOBE_BASELINE_FEED",
    role: "TV_SCREEN_CANVAS_FEED",
    publicIdentity: "Audralia",
    templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
    latLongDisposition: "PREDESTINED",
    material: "dry moldable clay",
    activeWater: false,
    hydrationActive: false,
    terrainChildActive: false,
    surfaceChildActive: false,
    datumChildActive: false,
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
    "rgba(136,103,64,.26)", "rgba(170,130,76,.23)", "rgba(110,91,62,.24)", "rgba(193,153,88,.20)",
    "rgba(82,101,76,.20)", "rgba(116,94,61,.25)", "rgba(146,117,74,.22)", "rgba(203,171,103,.18)",
    "rgba(94,72,52,.27)", "rgba(158,119,70,.23)", "rgba(126,135,91,.18)", "rgba(181,143,86,.21)",
    "rgba(73,82,68,.22)", "rgba(132,101,66,.25)", "rgba(212,181,111,.17)", "rgba(102,85,66,.23)",
    "rgba(151,129,91,.20)", "rgba(121,83,58,.24)", "rgba(173,152,105,.18)", "rgba(89,109,83,.18)",
    "rgba(139,92,63,.23)", "rgba(196,162,100,.18)", "rgba(111,118,84,.18)", "rgba(95,74,54,.25)",
    "rgba(164,132,86,.21)", "rgba(118,96,71,.22)", "rgba(220,190,123,.15)", "rgba(78,88,72,.20)",
    "rgba(144,112,72,.23)", "rgba(102,79,58,.25)", "rgba(181,138,78,.20)", "rgba(126,146,101,.16)"
  ]);

  const state = {
    stage: null,
    canvas: null,
    ctx: null,
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

  if (
    window.__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__.stop();
    } catch (_error) {}
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

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    document.documentElement.dataset.audraliaCanvasError = message;
    publishStatus("error:" + scope);
  }

  function setDataset(key, value) {
    const text = String(value);

    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
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

    const dispositionCells = state.seats.map((seat) => {
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

        if (weight * anchor.mass > mass * 0.32) {
          dominant = anchor.id;
        }
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
        elevationHint: clamp((normalized * 0.64 + pressure * 0.22 - basin * 0.10), 0, 1),
        shelfHint: clamp((basin * 0.54 + (1 - normalized) * 0.18), 0, 1)
      });
    });

    const contourLines = [];
    const ridgeLines = [];

    for (let i = 0; i < anchors.length; i += 1) {
      const current = anchors[i];
      const next = anchors[(i + 1) % anchors.length];

      contourLines.push(Object.freeze({
        aLat: current.latRad,
        aLon: current.lonRad,
        bLat: next.latRad,
        bLon: next.lonRad,
        pressure: (current.pressure + next.pressure) / 2,
        basin: (current.basin + next.basin) / 2,
        family: "template-contour"
      }));
    }

    const ridgePairs = [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 5],
      [4, 6],
      [4, 7],
      [4, 8],
      [6, 8],
      [3, 6],
      [5, 8],
      [0, 2]
    ];

    for (let i = 0; i < ridgePairs.length; i += 1) {
      const a = anchors[ridgePairs[i][0]];
      const b = anchors[ridgePairs[i][1]];

      ridgeLines.push(Object.freeze({
        aLat: a.latRad,
        aLon: a.lonRad,
        bLat: b.latRad,
        bLon: b.lonRad,
        pressure: (a.pressure + b.pressure) / 2,
        bend: (hash01(i + 91) - 0.5) * 0.26,
        family: "pressure-ridge"
      }));
    }

    state.dispositionCells = dispositionCells;
    state.contourLines = contourLines;
    state.ridgeLines = ridgeLines;
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
    const clat = Math.cos(latitude);
    return {
      x: clat * Math.cos(longitude),
      y: Math.sin(latitude),
      z: clat * Math.sin(longitude)
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

    ctx.globalAlpha = 0.10;

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

      ctx.strokeStyle = i % 3 === 0 ? "rgba(255,232,163,.34)" : "rgba(41,34,28,.42)";
      ctx.lineWidth = Math.max(0.55, state.dpr * 0.56);
      ctx.stroke();
    }

    ctx.restore();
  }

  function cellSizeFor(cell, p, base) {
    const modeBoost =
      state.mode === "terrain" ? 1.18 :
      state.mode === "surface" ? 1.08 :
      state.mode === "receipt" ? 0.94 :
      1;

    const width = base * (0.62 + cell.mass * 0.86 + cell.pressure * 0.22) * p.perspective * modeBoost;
    const height = base * (0.38 + cell.basin * 0.54 + cell.mass * 0.22) * p.perspective * modeBoost;

    return { width, height };
  }

  function drawDispositionCells() {
    const ctx = state.ctx;
    const m = metrics();
    const r = m.radius;
    const base = r * 0.068;

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
      const size = cellSizeFor(cell, p, base);
      const alpha =
        state.mode === "body" ? 0.54 :
        state.mode === "surface" ? 0.68 :
        state.mode === "terrain" ? 0.72 :
        0.50;

      ctx.save();
      ctx.globalAlpha = clamp((0.22 + cell.mass * 0.56) * alpha, 0.08, 0.72);
      ctx.fillStyle = CLAY_PALETTE_32[cell.colorIndex];

      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y,
        size.width,
        size.height,
        cell.seat.longitude + state.yaw + cell.pressure * 0.42,
        0,
        TAU
      );
      ctx.fill();

      if (cell.mass > 0.48 && (state.mode === "surface" || state.mode === "terrain")) {
        ctx.globalAlpha = clamp(0.10 + cell.elevationHint * 0.18, 0.08, 0.30);
        ctx.strokeStyle = "rgba(255,232,163,.46)";
        ctx.lineWidth = Math.max(0.5, state.dpr * 0.55);
        ctx.beginPath();
        ctx.ellipse(
          p.x,
          p.y,
          size.width * 0.72,
          size.height * 0.55,
          cell.seat.longitude + state.yaw + 0.5,
          0,
          TAU
        );
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  function drawTemplateContourLines() {
    if (state.mode === "body") return;

    const ctx = state.ctx;
    const m = metrics();
    const r = m.radius;

    ctx.save();
    clipSphere();

    ctx.globalAlpha =
      state.mode === "surface" ? 0.22 :
      state.mode === "terrain" ? 0.34 :
      state.mode === "lattice" ? 0.18 :
      0.20;

    for (const line of state.contourLines) {
      const a = projectPoint(pointFromLatLon(line.aLat, line.aLon));
      const b = projectPoint(pointFromLatLon(line.bLat, line.bLon));

      if (!a.frontFacing && !b.frontFacing) continue;

      const midLat = (line.aLat + line.bLat) / 2 + (line.pressure - 0.5) * 0.12;
      const midLon = (line.aLon + line.bLon) / 2 + (line.basin - 0.35) * 0.16;
      const mid = projectPoint(pointFromLatLon(midLat, midLon));

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
      ctx.strokeStyle = "rgba(255,232,163,.58)";
      ctx.lineWidth = Math.max(0.72, state.dpr * 0.80);
      ctx.stroke();
    }

    ctx.restore();

    if (state.mode !== "terrain" && state.mode !== "receipt") return;

    ctx.save();
    clipSphere();
    ctx.globalAlpha = state.mode === "terrain" ? 0.30 : 0.18;

    for (const ridge of state.ridgeLines) {
      const a = projectPoint(pointFromLatLon(ridge.aLat, ridge.aLon));
      const b = projectPoint(pointFromLatLon(ridge.bLat, ridge.bLon));

      if (!a.frontFacing && !b.frontFacing) continue;

      const mid = projectPoint(pointFromLatLon(
        (ridge.aLat + ridge.bLat) / 2 + ridge.bend,
        (ridge.aLon + ridge.bLon) / 2
      ));

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
      ctx.strokeStyle = "rgba(66,42,30,.82)";
      ctx.lineWidth = Math.max(0.85, state.dpr * (0.84 + ridge.pressure * 0.75));
      ctx.stroke();
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
    ctx.strokeStyle = "rgba(244,207,131,.46)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.15);
    ctx.setLineDash([6 * state.dpr, 8 * state.dpr]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = 0.18;
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
    drawTemplateContourLines();
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
    requestRender(12);
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
      canvas.setAttribute("aria-label", "Audralia clay globe baseline canvas");
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
    canvas.setAttribute("data-donor-contract", DONOR_CONTRACT);
    canvas.setAttribute("data-canvas-role", "tv-screen-canvas");
    canvas.setAttribute("data-baseline-feed", "clay-globe");
    canvas.setAttribute("data-public-identity", "Audralia");
    canvas.setAttribute("data-template-source", "Australia-template hidden scaffold");
    canvas.setAttribute("data-lat-long-disposition", "predestined");
    canvas.setAttribute("data-active-water", "false");
    canvas.setAttribute("data-final-visual-pass", "false");

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
    state.mounted = Boolean(state.ctx);

    state.stage.dataset.canvasRole = "tv-screen";
    state.stage.dataset.screenRole = "tv-screen-canvas";
    state.stage.dataset.feed = "clay-globe";
    state.stage.dataset.rendererState = "active";
    state.stage.dataset.activeWater = "false";
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

    setDataset("audraliaCanvasMode", next);
    setDataset("audraliaCanvasContract", CONTRACT);
    setDataset("audraliaCanvasRole", "tv-screen-canvas");

    requestRender(next === "body" ? 8 : 14);
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
      latLongDisposition: "PREDESTINED",
      activeWater: false,
      hydrationActive: false,
      terrainChildActive: false,
      surfaceChildActive: false,
      datumChildActive: false,
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
      donorContract: DONOR_CONTRACT,
      route: ROUTE,
      target: TARGET,
      donor: DONOR,
      api: API_NAME,

      initialized: state.initialized,
      mounted: state.mounted,
      screenRole: "TV_SCREEN_CANVAS",
      currentMode: state.mode,
      feed: state.feed.id || BASELINE_FEED.id,
      baselineFeed: BASELINE_FEED.id,

      publicIdentity: "Audralia",
      templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      latLongDisposition: "PREDESTINED",
      publicAustraliaIdentity: false,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,
      seatCount: state.seats.length,
      dispositionCellCount: state.dispositionCells.length,
      contourLineCount: state.contourLines.length,
      ridgeLineCount: state.ridgeLines.length,
      geometryBuilt: state.geometryBuilt,

      activeWater: false,
      hydrationActive: false,
      terrainChildActive: false,
      surfaceChildActive: false,
      datumChildActive: false,
      generatedImage: false,
      graphicBox: false,
      finalVisualPass: false,

      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      errors: state.errors.slice()
    });
  }

  function publishStatus(scope = "status") {
    const payload = Object.freeze({
      ...status(),
      scope,
      time: new Date().toISOString()
    });

    window.AUDRALIA_G2_PLANET_CANVAS_RECEIPT = payload;
    window.AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_STATUS = payload;
    window.AUDRALIA_G2_PLANET_OPERATION_A_DONOR_CANVAS_FEED_EVOLUTION_STATUS = payload;

    setDataset("audraliaCanvasContract", CONTRACT);
    setDataset("audraliaCanvasPreviousContract", PREVIOUS_CANVAS_CONTRACT);
    setDataset("audraliaCanvasDonorContract", DONOR_CONTRACT);
    setDataset("audraliaCanvasRole", "tv-screen-canvas");
    setDataset("audraliaCanvasFeed", "clay-globe-baseline");
    setDataset("audraliaCanvasPublicIdentity", "Audralia");
    setDataset("audraliaCanvasTemplateSource", "Australia-template-hidden-scaffold");
    setDataset("audraliaCanvasLatLongDisposition", "predestined");
    setDataset("audraliaCanvasActiveWater", "false");
    setDataset("audraliaCanvasHydrationActive", "false");
    setDataset("audraliaCanvasTerrainChildActive", "false");
    setDataset("audraliaCanvasSurfaceChildActive", "false");
    setDataset("audraliaCanvasDatumChildActive", "false");
    setDataset("audraliaCanvasGeneratedImage", "false");
    setDataset("audraliaCanvasGraphicBox", "false");
    setDataset("audraliaCanvasFinalVisualPass", "false");
    setDataset("audraliaCanvasRenderCount", state.renderCount);
    setDataset("audraliaCanvasMounted", state.mounted ? "true" : "false");

    return payload;
  }

  function exposeApi() {
    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      previousCanvasContract: PREVIOUS_CANVAS_CONTRACT,
      donorContract: DONOR_CONTRACT,
      baselineFeed: BASELINE_FEED,
      setFeed,
      setMode,
      resetView,
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

  window.__AUDRALIA_G2_PLANET_OPERATION_A_CANVAS_CONTROLLER__ = {
    stop,
    state,
    contract: CONTRACT,
    status,
    setMode,
    setFeed,
    resetView
  };

  function init() {
    try {
      exposeApi();

      state.stage = query("[data-audralia-planet-stage]");

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

      publishStatus("init-complete");
      requestRender(12);
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
