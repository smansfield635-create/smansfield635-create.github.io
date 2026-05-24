// /showroom/globe/audralia/planet/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_NATIVE_WEBGL_DRY_SPHERE_COORDINATE_HANDOFF_RENDERER_TNT_v1
//
// Scope:
// - Audralia G2 Planet route only.
// - Native WebGL dry sphere renderer only.
// - Builds 16 compass lanes × 16 versions = 256 unique chronological compass seats.
// - Every seat carries coordinate identity, version identity, expressive duty, and handoff.
// - Uses 16 lane colors + 16 version colors = 32-color coordination system.
// - Provides BODY / SURFACE / TERRAIN / LATTICE / RECEIPT modes.
// - Fail-open: if JS/WebGL/geometry fails, the HTML fallback planet remains visible.
// - No hydration load. No active water. No terrain child load. No surface child load.
// - No datum child load. No final visual pass claim.
// - Showroom Diamond renderer is method donor only; no Showroom authority inherited.
// - Intergalactic Cockpit is presentation donor only; no Cockpit authority inherited.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_NATIVE_WEBGL_DRY_SPHERE_COORDINATE_HANDOFF_RENDERER_TNT_v1";
  const HTML_CONTRACT = "AUDRALIA_G2_PLANET_COCKPIT_DONOR_NATIVE_WEBGL_SPHERE_COORDINATE_HANDOFF_HTML_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const FILE = "/showroom/globe/audralia/planet/index.js";

  const RADIAL_NODES = 16;
  const VERSION_COUNT = 16;
  const LATTICE_STATES = 256;
  const TAU = Math.PI * 2;

  const HELD_FILES = Object.freeze({
    datum: "/assets/audralia/clean/runtime/audralia.true-globe.datum.js",
    terrain: "/assets/audralia/clean/terrain/audralia.g2.physical-terrain.child.js",
    surface: "/assets/audralia/clean/surface/audralia.g2.surface-material.child.js",
    hydration: "future-hydration-file-held",
    gauges: "/gauges/"
  });

  const HANDOFF_STATES = Object.freeze({
    defined: [0.64, 0.96, 0.74, 0.96],
    held: [0.96, 0.72, 0.28, 0.90],
    pending: [0.55, 0.78, 1.00, 0.88],
    handoffReady: [0.78, 0.96, 1.00, 0.94],
    blocked: [1.00, 0.36, 0.36, 0.86],
    receiptConfirmed: [1.00, 0.88, 0.48, 0.98]
  });

  const COMPASS_LANES = Object.freeze([
    { coordinateIndex: 0, coordinateKey: "N", coordinateName: "North", coordinateRole: "origin-axis-definition", coordinateColor: [1.00, 0.86, 0.38, 1], coordinateHandoffBias: "route-shell" },
    { coordinateIndex: 1, coordinateKey: "NNE", coordinateName: "North-Northeast", coordinateRole: "origin-transition", coordinateColor: [0.94, 0.92, 0.62, 1], coordinateHandoffBias: "planet-renderer" },
    { coordinateIndex: 2, coordinateKey: "NE", coordinateName: "Northeast", coordinateRole: "lift-formation", coordinateColor: [0.68, 0.92, 1.00, 1], coordinateHandoffBias: "datum-file" },
    { coordinateIndex: 3, coordinateKey: "ENE", coordinateName: "East-Northeast", coordinateRole: "formation-approach", coordinateColor: [0.42, 0.86, 1.00, 1], coordinateHandoffBias: "surface-child-held" },
    { coordinateIndex: 4, coordinateKey: "E", coordinateName: "East", coordinateRole: "expression-gate", coordinateColor: [0.36, 0.96, 1.00, 1], coordinateHandoffBias: "surface-child-held" },
    { coordinateIndex: 5, coordinateKey: "ESE", coordinateName: "East-Southeast", coordinateRole: "expression-descent", coordinateColor: [0.40, 1.00, 0.78, 1], coordinateHandoffBias: "surface-child-held" },
    { coordinateIndex: 6, coordinateKey: "SE", coordinateName: "Southeast", coordinateRole: "hydration-memory-pressure", coordinateColor: [0.46, 0.94, 0.48, 1], coordinateHandoffBias: "water-held-layer" },
    { coordinateIndex: 7, coordinateKey: "SSE", coordinateName: "South-Southeast", coordinateRole: "settling-approach", coordinateColor: [0.34, 0.66, 0.38, 1], coordinateHandoffBias: "terrain-child-held" },
    { coordinateIndex: 8, coordinateKey: "S", coordinateName: "South", coordinateRole: "grounding-stability", coordinateColor: [0.86, 0.58, 0.28, 1], coordinateHandoffBias: "route-shell" },
    { coordinateIndex: 9, coordinateKey: "SSW", coordinateName: "South-Southwest", coordinateRole: "retention-pressure", coordinateColor: [0.86, 0.36, 0.28, 1], coordinateHandoffBias: "terrain-child-held" },
    { coordinateIndex: 10, coordinateKey: "SW", coordinateName: "Southwest", coordinateRole: "terrain-pressure-test", coordinateColor: [0.76, 0.28, 0.24, 1], coordinateHandoffBias: "terrain-child-held" },
    { coordinateIndex: 11, coordinateKey: "WSW", coordinateName: "West-Southwest", coordinateRole: "fracture-approach", coordinateColor: [0.70, 0.34, 0.76, 1], coordinateHandoffBias: "terrain-child-held" },
    { coordinateIndex: 12, coordinateKey: "W", coordinateName: "West", coordinateRole: "audit-correction", coordinateColor: [0.66, 0.46, 1.00, 1], coordinateHandoffBias: "receipt-layer" },
    { coordinateIndex: 13, coordinateKey: "WNW", coordinateName: "West-Northwest", coordinateRole: "recovery-memory", coordinateColor: [0.36, 0.40, 0.86, 1], coordinateHandoffBias: "receipt-layer" },
    { coordinateIndex: 14, coordinateKey: "NW", coordinateName: "Northwest", coordinateRole: "compression-return", coordinateColor: [0.48, 0.68, 1.00, 1], coordinateHandoffBias: "contract-seal" },
    { coordinateIndex: 15, coordinateKey: "NNW", coordinateName: "North-Northwest", coordinateRole: "return-seal", coordinateColor: [0.92, 0.90, 0.78, 1], coordinateHandoffBias: "contract-seal" }
  ].map((lane) => Object.freeze({
    ...lane,
    coordinateCompassAngle: lane.coordinateIndex * TAU / RADIAL_NODES,
    coordinateChronologyPosition: lane.coordinateIndex / (RADIAL_NODES - 1)
  })));

  const VERSION_FAMILIES = Object.freeze([
    { versionIndex: 0, versionKey: "V01", versionName: "First Light", versionRole: "origin-proof", versionColor: [1.00, 0.98, 0.86, 1], versionHandoffBias: "route-shell", versionDepthBias: 0.96 },
    { versionIndex: 1, versionKey: "V02", versionName: "Soft Gold", versionRole: "body-formation", versionColor: [1.00, 0.84, 0.42, 1], versionHandoffBias: "planet-renderer", versionDepthBias: 0.88 },
    { versionIndex: 2, versionKey: "V03", versionName: "Warm Amber", versionRole: "body-stability", versionColor: [0.96, 0.66, 0.30, 1], versionHandoffBias: "planet-renderer", versionDepthBias: 0.80 },
    { versionIndex: 3, versionKey: "V04", versionName: "Copper", versionRole: "surface-mineral", versionColor: [0.78, 0.42, 0.24, 1], versionHandoffBias: "surface-child-held", versionDepthBias: 0.70 },
    { versionIndex: 4, versionKey: "V05", versionName: "Earth Brown", versionRole: "surface-dry-memory", versionColor: [0.48, 0.33, 0.20, 1], versionHandoffBias: "surface-child-held", versionDepthBias: 0.58 },
    { versionIndex: 5, versionKey: "V06", versionName: "Olive", versionRole: "surface-settling", versionColor: [0.42, 0.48, 0.24, 1], versionHandoffBias: "surface-child-held", versionDepthBias: 0.46 },
    { versionIndex: 6, versionKey: "V07", versionName: "Green", versionRole: "terrain-ridge", versionColor: [0.34, 0.62, 0.32, 1], versionHandoffBias: "terrain-child-held", versionDepthBias: 0.34 },
    { versionIndex: 7, versionKey: "V08", versionName: "Mint", versionRole: "terrain-basin", versionColor: [0.54, 0.90, 0.72, 1], versionHandoffBias: "terrain-child-held", versionDepthBias: 0.22 },
    { versionIndex: 8, versionKey: "V09", versionName: "Cyan", versionRole: "lattice-transition", versionColor: [0.44, 0.92, 1.00, 1], versionHandoffBias: "datum-file", versionDepthBias: 0.10 },
    { versionIndex: 9, versionKey: "V10", versionName: "Blue", versionRole: "lattice-address", versionColor: [0.34, 0.60, 1.00, 1], versionHandoffBias: "datum-file", versionDepthBias: -0.02 },
    { versionIndex: 10, versionKey: "V11", versionName: "Deep Blue", versionRole: "lattice-chronology", versionColor: [0.24, 0.32, 0.78, 1], versionHandoffBias: "datum-file", versionDepthBias: -0.14 },
    { versionIndex: 11, versionKey: "V12", versionName: "Indigo", versionRole: "terrain-pressure", versionColor: [0.32, 0.26, 0.70, 1], versionHandoffBias: "terrain-child-held", versionDepthBias: -0.26 },
    { versionIndex: 12, versionKey: "V13", versionName: "Violet", versionRole: "water-held", versionColor: [0.58, 0.34, 0.86, 1], versionHandoffBias: "water-held-layer", versionDepthBias: -0.38 },
    { versionIndex: 13, versionKey: "V14", versionName: "Magenta Violet", versionRole: "receipt-pressure", versionColor: [0.78, 0.36, 0.76, 1], versionHandoffBias: "receipt-layer", versionDepthBias: -0.50 },
    { versionIndex: 14, versionKey: "V15", versionName: "Silver", versionRole: "audit-return", versionColor: [0.78, 0.84, 0.90, 1], versionHandoffBias: "receipt-layer", versionDepthBias: -0.62 },
    { versionIndex: 15, versionKey: "V16", versionName: "White Gold Closure", versionRole: "contract-seal", versionColor: [1.00, 0.92, 0.62, 1], versionHandoffBias: "contract-seal", versionDepthBias: -0.74 }
  ].map((version) => Object.freeze({
    ...version,
    versionChronologyPosition: version.versionIndex / (VERSION_COUNT - 1)
  })));

  const MODE_COPY = Object.freeze({
    body: {
      title: "Body Glass",
      status: "BODY · dry sphere · water held",
      platform: "The world reads as one coherent dry planet before any downstream child owns terrain, surface, or hydration.",
      engineering: "Body mode restrains the 32-color system into lighting and material. It proves spherical presence without activating child truth."
    },
    surface: {
      title: "Surface Console",
      status: "SURFACE · dry material · surface child held",
      platform: "Dry material families begin to show through the planet body without claiming final surface authority.",
      engineering: "Surface mode uses renderer-local dry material variation. Handoff points remain bound to the held surface child."
    },
    terrain: {
      title: "Terrain Deck",
      status: "TERRAIN · relief pressure · terrain child held",
      platform: "Ridges, basins, and pressure fields begin to appear as a dry physical mass.",
      engineering: "Terrain mode uses restrained displacement and shading. It does not load or claim final terrain child truth."
    },
    lattice: {
      title: "Lattice Scope",
      status: "LATTICE · 16 lanes × 16 versions · 256 seats",
      platform: "The full coordinate field becomes visible as an addressable network, not a decorative grid.",
      engineering: "Lattice mode exposes coordinate identity, version identity, lane colors, version colors, and address seats."
    },
    receipt: {
      title: "Receipt Dock",
      status: "RECEIPT · handoff states · final pass false",
      platform: "The planet shows what is defined, what is held, and where each seat hands authority next.",
      engineering: "Receipt mode prioritizes handoffState and handoffTarget while keeping activeWater=false and finalVisualPass=false."
    }
  });

  const state = {
    mode: "body",
    stage: null,
    canvas: null,
    fallback: null,
    statusNode: null,
    gl: null,

    solidProgram: null,
    lineProgram: null,
    pointProgram: null,

    solidPositionBuffer: null,
    solidColorBuffer: null,
    linePositionBuffer: null,
    lineColorBuffer: null,
    pointPositionBuffer: null,
    pointColorBuffer: null,
    pointSizeBuffer: null,

    seats: [],
    rings: [],
    triangles: [],
    latticeLines: [],
    modeLines: [],
    receiptLines: [],
    points: [],

    yaw: -0.78,
    pitch: -0.18,
    roll: 0.0,
    velocityYaw: 0,
    velocityPitch: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    dpr: 1,
    time: 0,
    lastFrame: 0,
    raf: 0,
    renderCount: 0,

    initialized: false,
    geometryBuilt: false,
    canvasReady: false,
    glReady: false,
    touchReady: false,
    canonicalCanvasBound: false,
    duplicateCanvasCount: 0,

    activeWater: false,
    hydrationLoaded: false,
    terrainChildLoaded: false,
    surfaceChildLoaded: false,
    datumChildLoaded: false,
    finalVisualPass: false,
    errors: []
  };

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mixColor(a, b, t) {
    const value = clamp(t, 0, 1);
    return [
      lerp(a[0], b[0], value),
      lerp(a[1], b[1], value),
      lerp(a[2], b[2], value),
      lerp(a[3], b[3], value)
    ];
  }

  function multiplyColor(a, amount, alphaScale = 1) {
    return [
      clamp(a[0] * amount, 0, 1),
      clamp(a[1] * amount, 0, 1),
      clamp(a[2] * amount, 0, 1),
      clamp(a[3] * alphaScale, 0, 1)
    ];
  }

  function normalize3(v) {
    const length = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / length, y: v.y / length, z: v.z / length };
  }

  function sub3(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  function cross3(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  function faceNormal(a, b, c) {
    return normalize3(cross3(sub3(b, a), sub3(c, a)));
  }

  function averageColor(colors) {
    const total = colors.reduce((acc, color) => {
      acc[0] += color[0];
      acc[1] += color[1];
      acc[2] += color[2];
      acc[3] += color[3];
      return acc;
    }, [0, 0, 0, 0]);

    const count = Math.max(1, colors.length);
    return [total[0] / count, total[1] / count, total[2] / count, total[3] / count];
  }

  function deterministicNoise(coordinateIndex, versionIndex) {
    const a = Math.sin((coordinateIndex + 1) * 12.9898 + (versionIndex + 1) * 78.233) * 43758.5453;
    return a - Math.floor(a);
  }

  function coordinateFamily(coordinateKey) {
    if (["N", "NNE", "NE", "ENE"].includes(coordinateKey)) return "north";
    if (["E", "ESE", "SE", "SSE"].includes(coordinateKey)) return "east";
    if (["S", "SSW", "SW", "WSW"].includes(coordinateKey)) return "south";
    return "west";
  }

  function deriveDutyAndHandoff(lane, version) {
    const c = lane.coordinateKey;
    const v = version.versionKey;
    const vi = version.versionIndex;
    const family = coordinateFamily(c);

    if (c === "N" && v === "V01") {
      return {
        expressiveDuty: "origin-axis-body-proof",
        handoff: "route-shell",
        handoffTarget: ROUTE,
        handoffState: "defined"
      };
    }

    if (c === "E" && v === "V08") {
      return {
        expressiveDuty: "surface-formation-material-expression",
        handoff: "surface-child-held",
        handoffTarget: HELD_FILES.surface,
        handoffState: "held"
      };
    }

    if (c === "SW" && v === "V12") {
      return {
        expressiveDuty: "terrain-pressure-basin-relief-test",
        handoff: "terrain-child-held",
        handoffTarget: HELD_FILES.terrain,
        handoffState: "held"
      };
    }

    if (c === "W" && v === "V16") {
      return {
        expressiveDuty: "receipt-correction-audit-closure",
        handoff: "receipt-layer",
        handoffTarget: "hidden-route-receipt-and-renderer-receipt",
        handoffState: "receipt-confirmed"
      };
    }

    if (c === "NNW" && v === "V16") {
      return {
        expressiveDuty: "return-path-contract-seal",
        handoff: "contract-seal",
        handoffTarget: "AUDRALIA_G2_PLANET_CONTRACT_SEAL",
        handoffState: "receipt-confirmed"
      };
    }

    if (vi <= 1) {
      return {
        expressiveDuty: family === "north" ? "body-origin" : "body-stabilization",
        handoff: vi === 0 ? "route-shell" : "planet-renderer",
        handoffTarget: vi === 0 ? ROUTE : FILE,
        handoffState: "defined"
      };
    }

    if (vi <= 5) {
      return {
        expressiveDuty: family === "east" ? "surface-material" : "surface-dry-memory",
        handoff: "surface-child-held",
        handoffTarget: HELD_FILES.surface,
        handoffState: "held"
      };
    }

    if (vi <= 8) {
      return {
        expressiveDuty: family === "south" || family === "west" ? "terrain-ridge" : "terrain-relief",
        handoff: "terrain-child-held",
        handoffTarget: HELD_FILES.terrain,
        handoffState: "held"
      };
    }

    if (vi <= 10) {
      return {
        expressiveDuty: vi === 9 ? "lattice-address" : "lattice-chronology",
        handoff: "datum-file",
        handoffTarget: HELD_FILES.datum,
        handoffState: vi === 9 ? "pending" : "handoff-ready"
      };
    }

    if (vi === 11) {
      return {
        expressiveDuty: "terrain-basin",
        handoff: "terrain-child-held",
        handoffTarget: HELD_FILES.terrain,
        handoffState: "held"
      };
    }

    if (vi === 12) {
      return {
        expressiveDuty: "water-held",
        handoff: "water-held-layer",
        handoffTarget: "water-held-memory-only",
        handoffState: "blocked"
      };
    }

    if (vi === 13) {
      return {
        expressiveDuty: "future-hydration-held",
        handoff: "future-hydration-held",
        handoffTarget: HELD_FILES.hydration,
        handoffState: "blocked"
      };
    }

    if (vi === 14) {
      return {
        expressiveDuty: family === "west" ? "audit-correction" : "receipt-proof",
        handoff: "receipt-layer",
        handoffTarget: "renderer-receipt",
        handoffState: "receipt-confirmed"
      };
    }

    return {
      expressiveDuty: family === "north" ? "return-path" : "contract-seal",
      handoff: "contract-seal",
      handoffTarget: "AUDRALIA_G2_PLANET_CONTRACT_SEAL",
      handoffState: "receipt-confirmed"
    };
  }

  function handoffColor(stateName) {
    if (stateName === "handoff-ready") return HANDOFF_STATES.handoffReady;
    return HANDOFF_STATES[stateName] || HANDOFF_STATES.pending;
  }

  function dutyModifier(duty) {
    if (duty.includes("body")) return [0.86, 0.78, 0.56, 1];
    if (duty.includes("surface")) return [0.72, 0.56, 0.38, 1];
    if (duty.includes("terrain") || duty.includes("ridge") || duty.includes("basin")) return [0.54, 0.46, 0.32, 1];
    if (duty.includes("lattice")) return [0.48, 0.78, 1.00, 1];
    if (duty.includes("water")) return [0.42, 0.56, 0.78, 1];
    if (duty.includes("receipt") || duty.includes("audit")) return [0.90, 0.72, 0.42, 1];
    if (duty.includes("contract") || duty.includes("return")) return [1.00, 0.88, 0.56, 1];
    return [0.72, 0.72, 0.64, 1];
  }

  function combinedSeatColor(lane, version, expressiveDuty, handoffState) {
    const laneVersion = mixColor(lane.coordinateColor, version.versionColor, 0.42);
    const duty = dutyModifier(expressiveDuty);
    const handoff = handoffColor(handoffState);
    return mixColor(mixColor(laneVersion, duty, 0.20), handoff, 0.16);
  }

  function latitudeForVersion(versionIndex) {
    const t = versionIndex / Math.max(1, VERSION_COUNT - 1);
    return lerp(1.30, -1.30, t);
  }

  function longitudeForCoordinate(coordinateIndex) {
    return coordinateIndex * TAU / RADIAL_NODES - Math.PI / 2;
  }

  function elevationForSeat(lane, version, duty) {
    const noise = deterministicNoise(lane.coordinateIndex, version.versionIndex);
    const laneWave = Math.sin(lane.coordinateIndex * 0.92 + version.versionIndex * 0.58);
    const versionCurve = Math.cos(version.versionIndex / VERSION_COUNT * Math.PI * 2);
    let elevation = (noise - 0.5) * 0.030 + laneWave * 0.014 + versionCurve * 0.010;

    if (duty.includes("ridge")) elevation += 0.040;
    if (duty.includes("basin")) elevation -= 0.035;
    if (duty.includes("terrain")) elevation += 0.020;
    if (duty.includes("water")) elevation -= 0.018;
    if (duty.includes("body")) elevation *= 0.45;

    return clamp(elevation, -0.055, 0.070);
  }

  function createSeat(lane, version) {
    const derived = deriveDutyAndHandoff(lane, version);
    const longitude = longitudeForCoordinate(lane.coordinateIndex);
    const latitude = latitudeForVersion(version.versionIndex);
    const elevation = elevationForSeat(lane, version, derived.expressiveDuty);
    const radius = 1 + elevation;
    const cosLat = Math.cos(latitude);

    const spherePoint = {
      x: Math.cos(longitude) * cosLat * radius,
      y: Math.sin(latitude) * radius,
      z: Math.sin(longitude) * cosLat * radius
    };

    const seatIndex = lane.coordinateIndex * VERSION_COUNT + version.versionIndex;
    const seatAddress = `AU-G2-${lane.coordinateKey}-${version.versionKey}`;
    const combinedColor = combinedSeatColor(lane, version, derived.expressiveDuty, derived.handoffState);

    return Object.freeze({
      contract: CONTRACT,
      seatIndex,
      seatAddress,
      coordinateIndex: lane.coordinateIndex,
      coordinateKey: lane.coordinateKey,
      coordinateName: lane.coordinateName,
      coordinateRole: lane.coordinateRole,
      coordinateCompassAngle: lane.coordinateCompassAngle,
      coordinateChronologyPosition: lane.coordinateChronologyPosition,
      coordinateHandoffBias: lane.coordinateHandoffBias,
      versionIndex: version.versionIndex,
      versionKey: version.versionKey,
      versionName: version.versionName,
      versionRole: version.versionRole,
      versionChronologyPosition: version.versionChronologyPosition,
      versionDepthBias: version.versionDepthBias,
      versionHandoffBias: version.versionHandoffBias,
      chronologyIndex: seatIndex,
      laneColor: lane.coordinateColor,
      versionColor: version.versionColor,
      combinedColor,
      expressiveDuty: derived.expressiveDuty,
      handoff: derived.handoff,
      handoffTarget: derived.handoffTarget,
      handoffState: derived.handoffState,
      spherePoint,
      longitude,
      latitude,
      elevation,
      renderEligibility: true,
      modeVisibility: {
        body: true,
        surface: true,
        terrain: true,
        lattice: true,
        receipt: true
      },
      receiptState: derived.handoffState,
      activeWater: false,
      finalVisualPass: false
    });
  }

  function pointForSeat(seat, mode = state.mode) {
    let multiplier = 1;

    if (mode === "body") multiplier = 1 - seat.elevation * 0.35;
    if (mode === "surface") multiplier = 1 + seat.elevation * 0.65;
    if (mode === "terrain") multiplier = 1 + seat.elevation * 1.85;
    if (mode === "lattice") multiplier = 1.012;
    if (mode === "receipt") multiplier = 1.008;

    return {
      x: seat.spherePoint.x * multiplier,
      y: seat.spherePoint.y * multiplier,
      z: seat.spherePoint.z * multiplier
    };
  }

  function modeColorForSeat(seat, mode = state.mode, alphaScale = 1) {
    const dryBase = mixColor([0.42, 0.34, 0.22, 1], [0.72, 0.60, 0.42, 1], clamp((seat.elevation + 0.06) / 0.13, 0, 1));
    const mineral = mixColor(dryBase, seat.combinedColor, 0.18);
    const lattice = seat.combinedColor;
    const receipt = mixColor(seat.combinedColor, handoffColor(seat.handoffState), 0.52);

    if (mode === "body") return multiplyColor(mixColor(dryBase, seat.laneColor, 0.06), 1, alphaScale * 0.94);
    if (mode === "surface") return multiplyColor(mixColor(mineral, seat.versionColor, 0.16), 1, alphaScale * 0.96);
    if (mode === "terrain") return multiplyColor(mixColor(dryBase, dutyModifier(seat.expressiveDuty), 0.28), 1, alphaScale * 0.98);
    if (mode === "lattice") return multiplyColor(lattice, 1, alphaScale);
    if (mode === "receipt") return multiplyColor(receipt, 1, alphaScale);

    return multiplyColor(dryBase, 1, alphaScale);
  }

  function buildGeometry() {
    const rings = [];
    const seats = [];
    const triangles = [];
    const latticeLines = [];
    const modeLines = [];
    const receiptLines = [];
    const points = [];

    for (let versionIndex = 0; versionIndex < VERSION_COUNT; versionIndex += 1) {
      const ring = [];

      for (let coordinateIndex = 0; coordinateIndex < RADIAL_NODES; coordinateIndex += 1) {
        const seat = createSeat(COMPASS_LANES[coordinateIndex], VERSION_FAMILIES[versionIndex]);
        ring.push(seat);
        seats.push(seat);
        points.push({ seat, family: "coordinate-version-seat" });
      }

      rings.push(Object.freeze(ring));
    }

    function ringSeat(versionIndex, coordinateIndex) {
      return rings[versionIndex][((coordinateIndex % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function addTriangle(a, b, c, family) {
      const pa = pointForSeat(a, "terrain");
      const pb = pointForSeat(b, "terrain");
      const pc = pointForSeat(c, "terrain");

      triangles.push({
        a,
        b,
        c,
        normal: faceNormal(pa, pb, pc),
        family: family || "sphere-surface-triangle",
        seed: a.seatIndex
      });
    }

    function addLine(a, b, family) {
      const line = { a, b, family: family || "lattice-line" };
      latticeLines.push(line);

      if (family && (family.includes("terrain") || family.includes("surface"))) {
        modeLines.push(line);
      }

      if (family && (family.includes("receipt") || family.includes("handoff"))) {
        receiptLines.push(line);
      }
    }

    for (let versionIndex = 0; versionIndex < VERSION_COUNT - 1; versionIndex += 1) {
      for (let coordinateIndex = 0; coordinateIndex < RADIAL_NODES; coordinateIndex += 1) {
        const a = ringSeat(versionIndex, coordinateIndex);
        const b = ringSeat(versionIndex, coordinateIndex + 1);
        const c = ringSeat(versionIndex + 1, coordinateIndex + 1);
        const d = ringSeat(versionIndex + 1, coordinateIndex);

        addTriangle(a, d, c, "sphere-coordinate-version-triangle");
        addTriangle(a, c, b, "sphere-coordinate-version-triangle");
      }
    }

    for (let versionIndex = 0; versionIndex < VERSION_COUNT; versionIndex += 1) {
      for (let coordinateIndex = 0; coordinateIndex < RADIAL_NODES; coordinateIndex += 1) {
        const a = ringSeat(versionIndex, coordinateIndex);
        const b = ringSeat(versionIndex, coordinateIndex + 1);
        const major = coordinateIndex % 4 === 0 || versionIndex % 4 === 0;

        addLine(a, b, major ? "major-version-ring" : "version-ring");

        if (versionIndex < VERSION_COUNT - 1) {
          const c = ringSeat(versionIndex + 1, coordinateIndex);
          addLine(a, c, major ? "major-coordinate-lane" : "coordinate-lane");
        }

        if (versionIndex < VERSION_COUNT - 1 && (versionIndex % 3 === 0 || coordinateIndex % 4 === 0)) {
          const offset = [1, 2, 3, 5, 8, 13][versionIndex % 6];
          const d = ringSeat(versionIndex + 1, coordinateIndex + offset);
          addLine(a, d, "fibonacci-handoff-link");
        }

        if (a.handoffState === "receipt-confirmed" || a.handoffState === "blocked") {
          const receiptTarget = ringSeat(Math.min(VERSION_COUNT - 1, versionIndex + 1), coordinateIndex + 8);
          addLine(a, receiptTarget, "receipt-handoff-line");
        }
      }
    }

    state.rings = rings;
    state.seats = Object.freeze(seats);
    state.triangles = Object.freeze(triangles);
    state.latticeLines = Object.freeze(latticeLines);
    state.modeLines = Object.freeze(modeLines);
    state.receiptLines = Object.freeze(receiptLines);
    state.points = Object.freeze(points);
    state.geometryBuilt = seats.length === LATTICE_STATES;

    if (!state.geometryBuilt) {
      throw new Error("AUDRALIA_GEOMETRY_SEAT_COUNT_INVALID");
    }
  }

  function rotatePoint(point) {
    let x = point.x;
    let y = point.y;
    let z = point.z;

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const yx = x * cy + z * sy;
    const yz = -x * sy + z * cy;
    x = yx;
    z = yz;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const py = y * cp - z * sp;
    const pz = y * sp + z * cp;
    y = py;
    z = pz;

    const cr = Math.cos(state.roll);
    const sr = Math.sin(state.roll);
    const rx = x * cr - y * sr;
    const ry = x * sr + y * cr;

    return { x: rx, y: ry, z };
  }

  function stageFit() {
    const canvas = state.canvas;
    const width = canvas ? canvas.width : 720;
    const height = canvas ? canvas.height : 720;
    const rect = canvas && canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width, height };
    const mobile = rect.width < 680;
    const aspect = width / Math.max(1, height);

    return {
      scale: mobile ? 0.72 : 0.78,
      offsetY: mobile ? 0.025 : 0.015,
      aspectFit: aspect > 1 ? 1 / aspect : 1,
      cameraDistance: 4.25
    };
  }

  function projectPoint(point) {
    const rotated = rotatePoint(point);
    const fit = stageFit();
    const perspective = fit.cameraDistance / (fit.cameraDistance - rotated.z);

    return {
      x: rotated.x * fit.scale * fit.aspectFit * perspective,
      y: rotated.y * fit.scale * perspective + fit.offsetY,
      z: rotated.z,
      perspective
    };
  }

  function triangleDepth(triangle) {
    const a = rotatePoint(pointForSeat(triangle.a));
    const b = rotatePoint(pointForSeat(triangle.b));
    const c = rotatePoint(pointForSeat(triangle.c));
    return (a.z + b.z + c.z) / 3;
  }

  function lightingForTriangle(triangle) {
    const normal = rotatePoint(triangle.normal);
    const key = normalize3({ x: -0.36, y: 0.72, z: 0.88 });
    const rim = normalize3({ x: 0.72, y: 0.20, z: 0.62 });
    const under = normalize3({ x: -0.16, y: -0.66, z: 0.42 });

    const keyDot = Math.max(0, normal.x * key.x + normal.y * key.y + normal.z * key.z);
    const rimDot = Math.max(0, normal.x * rim.x + normal.y * rim.y + normal.z * rim.z);
    const underDot = Math.max(0, normal.x * under.x + normal.y * under.y + normal.z * under.z);
    const pulse = 0.5 + 0.5 * Math.sin(state.time * 0.72 + triangle.seed * 0.025);

    return clamp(0.46 + keyDot * 0.64 + rimDot * 0.22 + underDot * 0.10 + pulse * 0.030, 0.34, 1.22);
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Shader compile failed.";
      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Program link failed.";
      gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
  }

  function createBuffer(gl) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.DYNAMIC_DRAW);
    return buffer;
  }

  function updateBuffer(gl, targetBuffer, data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  }

  function bindAttrib(gl, program, targetBuffer, name, size) {
    const location = gl.getAttribLocation(program, name);
    if (location < 0) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  function initPrograms(gl) {
    const solidVertex = `
      precision mediump float;

      attribute vec2 aPosition;
      attribute vec4 aColor;

      varying vec4 vColor;

      void main() {
        vColor = aColor;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const solidFragment = `
      precision mediump float;

      varying vec4 vColor;

      void main() {
        gl_FragColor = vColor;
      }
    `;

    const pointVertex = `
      precision mediump float;

      attribute vec2 aPosition;
      attribute vec4 aColor;
      attribute float aSize;

      varying vec4 vColor;

      void main() {
        vColor = aColor;
        gl_Position = vec4(aPosition, 0.0, 1.0);
        gl_PointSize = aSize;
      }
    `;

    const pointFragment = `
      precision mediump float;

      varying vec4 vColor;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float d = length(coord);
        if (d > 0.5) discard;

        float core = smoothstep(0.5, 0.08, d);
        float rim = smoothstep(0.5, 0.30, d) * 0.28;
        float shine = smoothstep(0.18, 0.0, length(coord - vec2(-0.12, -0.14))) * 0.20;

        gl_FragColor = vec4(vColor.rgb + shine, vColor.a * (core + rim));
      }
    `;

    state.solidProgram = createProgram(gl, solidVertex, solidFragment);
    state.lineProgram = createProgram(gl, solidVertex, solidFragment);
    state.pointProgram = createProgram(gl, pointVertex, pointFragment);

    state.solidPositionBuffer = createBuffer(gl);
    state.solidColorBuffer = createBuffer(gl);
    state.linePositionBuffer = createBuffer(gl);
    state.lineColorBuffer = createBuffer(gl);
    state.pointPositionBuffer = createBuffer(gl);
    state.pointColorBuffer = createBuffer(gl);
    state.pointSizeBuffer = createBuffer(gl);
  }

  function resizeCanvas() {
    if (!state.canvas || !state.gl) return;

    const rect = state.canvas.getBoundingClientRect();
    const dpr = Math.min(1.85, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
    const height = Math.max(420, Math.floor((rect.height || 640) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.dpr = dpr;
    state.gl.viewport(0, 0, width, height);
  }

  function drawTriangles(gl, triangles, alphaScale = 1) {
    const positions = [];
    const colors = [];
    const sorted = triangles.slice().sort((a, b) => triangleDepth(a) - triangleDepth(b));

    for (const triangle of sorted) {
      const pa = projectPoint(pointForSeat(triangle.a));
      const pb = projectPoint(pointForSeat(triangle.b));
      const pc = projectPoint(pointForSeat(triangle.c));

      const baseColor = averageColor([
        modeColorForSeat(triangle.a, state.mode),
        modeColorForSeat(triangle.b, state.mode),
        modeColorForSeat(triangle.c, state.mode)
      ]);

      const light = lightingForTriangle(triangle);
      const color = multiplyColor(baseColor, light, alphaScale);

      positions.push(pa.x, pa.y, pb.x, pb.y, pc.x, pc.y);
      colors.push(...color, ...color, ...color);
    }

    if (!positions.length) return;

    gl.useProgram(state.solidProgram);
    updateBuffer(gl, state.solidPositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.solidColorBuffer, new Float32Array(colors));

    bindAttrib(gl, state.solidProgram, state.solidPositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.solidProgram, state.solidColorBuffer, "aColor", 4);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
  }

  function drawLines(gl, lines, alphaScale = 1) {
    const positions = [];
    const colors = [];

    for (const line of lines) {
      const pa = projectPoint(pointForSeat(line.a));
      const pb = projectPoint(pointForSeat(line.b));
      const depth = clamp(0.82 + ((pa.z + pb.z) / 2) * 0.10, 0.50, 1.18);
      const pulse = line.family.includes("fibonacci") || line.family.includes("handoff")
        ? 0.84 + Math.sin(state.time * 1.6 + line.a.seatIndex * 0.05) * 0.16
        : 1;

      let colorA = modeColorForSeat(line.a, state.mode, alphaScale * pulse);
      let colorB = modeColorForSeat(line.b, state.mode, alphaScale * pulse);

      if (state.mode === "receipt") {
        colorA = mixColor(colorA, handoffColor(line.a.handoffState), 0.58);
        colorB = mixColor(colorB, handoffColor(line.b.handoffState), 0.58);
      }

      colorA = multiplyColor(colorA, depth, alphaScale * pulse);
      colorB = multiplyColor(colorB, depth, alphaScale * pulse);

      positions.push(pa.x, pa.y, pb.x, pb.y);
      colors.push(...colorA, ...colorB);
    }

    if (!positions.length) return;

    gl.useProgram(state.lineProgram);
    updateBuffer(gl, state.linePositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.lineColorBuffer, new Float32Array(colors));

    bindAttrib(gl, state.lineProgram, state.linePositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.lineProgram, state.lineColorBuffer, "aColor", 4);

    gl.drawArrays(gl.LINES, 0, positions.length / 2);
  }

  function drawPoints(gl, points, alphaScale = 1) {
    const positions = [];
    const colors = [];
    const sizes = [];

    for (const point of points) {
      const seat = point.seat;
      const projected = projectPoint(pointForSeat(seat));
      const frontBias = clamp(0.68 + projected.z * 0.18, 0.35, 1.10);
      const pulse = 0.88 + Math.sin(state.time * 1.8 + seat.seatIndex * 0.11) * 0.12;
      const color = state.mode === "receipt"
        ? mixColor(modeColorForSeat(seat, state.mode), handoffColor(seat.handoffState), 0.70)
        : modeColorForSeat(seat, state.mode);

      const modeSize =
        state.mode === "body" ? 2.0 :
        state.mode === "surface" ? 3.0 :
        state.mode === "terrain" ? 3.2 :
        state.mode === "lattice" ? 5.8 :
        6.4;

      const major = seat.coordinateIndex % 4 === 0 || seat.versionIndex % 4 === 0;
      const finalSize = Math.max(1.5, (modeSize + (major ? 1.4 : 0)) * state.dpr * projected.perspective * frontBias);

      positions.push(projected.x, projected.y);
      colors.push(...multiplyColor(color, frontBias, alphaScale * pulse));
      sizes.push(finalSize);
    }

    if (!positions.length) return;

    gl.useProgram(state.pointProgram);
    updateBuffer(gl, state.pointPositionBuffer, new Float32Array(positions));
    updateBuffer(gl, state.pointColorBuffer, new Float32Array(colors));
    updateBuffer(gl, state.pointSizeBuffer, new Float32Array(sizes));

    bindAttrib(gl, state.pointProgram, state.pointPositionBuffer, "aPosition", 2);
    bindAttrib(gl, state.pointProgram, state.pointColorBuffer, "aColor", 4);
    bindAttrib(gl, state.pointProgram, state.pointSizeBuffer, "aSize", 1);

    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
  }

  function renderWebGL() {
    if (!state.gl || !state.geometryBuilt) return;

    const gl = state.gl;
    resizeCanvas();

    gl.clearColor(0.004, 0.014, 0.034, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (state.mode === "body") {
      drawTriangles(gl, state.triangles, 0.98);
    }

    if (state.mode === "surface") {
      drawTriangles(gl, state.triangles, 0.98);
      drawLines(gl, state.modeLines, 0.10);
      drawPoints(gl, state.points, 0.12);
    }

    if (state.mode === "terrain") {
      drawTriangles(gl, state.triangles, 0.98);
      drawLines(gl, state.modeLines, 0.18);
      drawPoints(gl, state.points, 0.18);
    }

    if (state.mode === "lattice") {
      drawTriangles(gl, state.triangles, 0.18);
      drawLines(gl, state.latticeLines, 0.82);
      drawPoints(gl, state.points, 0.92);
    }

    if (state.mode === "receipt") {
      drawTriangles(gl, state.triangles, 0.14);
      drawLines(gl, state.latticeLines, 0.26);
      drawLines(gl, state.receiptLines, 0.94);
      drawPoints(gl, state.points, 0.96);
    }

    state.renderCount += 1;
    publishReceipt("render");
  }

  function step(timestamp) {
    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      const damping = Math.pow(0.936, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

      if (state.velocityYaw === 0 && state.velocityPitch === 0) {
        state.yaw += Math.sin(state.time * 0.18) * dt * 0.018;
      }
    }

    state.pitch = clamp(state.pitch, -1.05, 1.05);
    state.roll = Math.sin(state.time * 0.13) * 0.010;

    renderWebGL();
    state.raf = window.requestAnimationFrame(step);
  }

  function resetPlanet() {
    state.yaw = -0.78;
    state.pitch = -0.18;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    renderWebGL();
  }

  function bindPointer(stage) {
    stage.style.touchAction = "none";

    stage.addEventListener("pointerdown", (event) => {
      const now = performance.now();

      if (now - state.lastTap < 320) resetPlanet();

      state.lastTap = now;
      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        stage.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.pointerX;
      const dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.0084;
      state.pitch = clamp(state.pitch + dy * 0.0056, -1.05, 1.05);
      state.velocityYaw = clamp(dx * 0.0023, -0.052, 0.052);
      state.velocityPitch = clamp(dy * 0.0015, -0.040, 0.040);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    const release = (event) => {
      if (!state.dragging) return;
      state.dragging = false;

      try {
        stage.releasePointerCapture?.(event.pointerId);
      } catch (_error) {}
    };

    stage.addEventListener("pointerup", release, { passive: true });
    stage.addEventListener("pointercancel", release, { passive: true });
    stage.addEventListener("pointerleave", release, { passive: true });

    state.touchReady = true;
  }

  function setRendererStatus(status, detail) {
    if (state.stage) {
      state.stage.setAttribute("data-renderer-state", status);
      if (detail) state.stage.setAttribute("data-renderer-detail", detail);
    }

    if (state.statusNode) {
      state.statusNode.textContent = detail || status;
    }

    document.documentElement.dataset.audraliaPlanetRendererState = status;
    document.documentElement.dataset.audraliaPlanetRendererDetail = detail || status;
  }

  function setMode(nextMode) {
    const mode = MODE_COPY[nextMode] ? nextMode : "body";
    state.mode = mode;

    document.documentElement.dataset.audraliaPlanetMode = mode;
    if (document.body) document.body.dataset.audraliaPlanetMode = mode;

    document.querySelectorAll("[data-audralia-mode]").forEach((control) => {
      const active = control.dataset.audraliaMode === mode;
      control.setAttribute("aria-pressed", active ? "true" : "false");
      control.toggleAttribute("data-active", active);
    });

    const modeTitle = document.querySelector("[data-audralia-mode-title]");
    const modeStatus = document.querySelector("[data-audralia-mode-status]");
    const modePlatform = document.querySelector("[data-audralia-mode-platform]");
    const modeEngineering = document.querySelector("[data-audralia-mode-engineering]");

    if (modeTitle) modeTitle.textContent = MODE_COPY[mode].title;
    if (modeStatus) modeStatus.textContent = MODE_COPY[mode].status;
    if (modePlatform) modePlatform.textContent = MODE_COPY[mode].platform;
    if (modeEngineering) modeEngineering.textContent = MODE_COPY[mode].engineering;

    renderWebGL();
    publishReceipt(`mode:${mode}`);
  }

  function bindModeControls() {
    document.querySelectorAll("[data-audralia-mode]").forEach((control) => {
      control.addEventListener("click", () => {
        setMode(control.dataset.audraliaMode);
      });
    });

    const inspectButton = document.querySelector("[data-audralia-inspect-planet]");
    if (inspectButton) {
      inspectButton.addEventListener("click", () => {
        const target = document.querySelector("[data-audralia-planet-stage]");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    setMode(state.mode);
  }

  function createWebGLContext(canvas) {
    return (
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      })
    );
  }

  function neutralizeDuplicateCanvases(stage, canonicalCanvas) {
    const canvases = Array.from(stage.querySelectorAll("canvas"));
    let duplicates = 0;

    for (const canvas of canvases) {
      if (canvas === canonicalCanvas) continue;

      duplicates += 1;
      canvas.setAttribute("data-audralia-planet-duplicate-neutralized", "true");
      canvas.style.display = "none";
      canvas.style.visibility = "hidden";
      canvas.style.pointerEvents = "none";

      try {
        canvas.remove();
      } catch (_error) {}
    }

    state.duplicateCanvasCount += duplicates;
  }

  function enforceCanonicalCanvas(stage, canvas) {
    neutralizeDuplicateCanvases(stage, canvas);

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      zIndex: "4",
      background: "transparent",
      pointerEvents: "none",
      imageRendering: "auto"
    });

    canvas.setAttribute("data-audralia-planet-canonical-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("data-html-contract", HTML_CONTRACT);
    canvas.setAttribute("data-radial-nodes", String(RADIAL_NODES));
    canvas.setAttribute("data-version-count", String(VERSION_COUNT));
    canvas.setAttribute("data-lattice-states", String(LATTICE_STATES));
    canvas.setAttribute("data-active-water", "false");
    canvas.setAttribute("data-final-visual-pass", "false");

    state.canonicalCanvasBound = true;

    if (typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => {
        neutralizeDuplicateCanvases(stage, canvas);
      });

      observer.observe(stage, { childList: true, subtree: false });
    }
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    document.documentElement.dataset.audraliaPlanetRendererError = message;
    setRendererStatus("error", `${scope}: ${message}`);
    publishReceipt(`error:${scope}`);
  }

  function uniqueAddressesValid() {
    const addresses = new Set(state.seats.map((seat) => seat.seatAddress));
    return addresses.size === LATTICE_STATES;
  }

  function allSeatsHave(field) {
    return state.seats.every((seat) => seat[field] !== undefined && seat[field] !== null && seat[field] !== "");
  }

  function publishReceipt(scope = "publish") {
    const receipt = Object.freeze({
      scope,
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      file: FILE,
      renderer: "native-webgl",
      donorMethod: "showroom-diamond-rendering-method-only",
      presentationDonor: "intergalactic-cockpit-presentation-grammar-only",
      singleCanonicalCanvas: state.canonicalCanvasBound,
      duplicateCanvasCount: state.duplicateCanvasCount,
      webglContextAttempted: true,
      webglReady: state.glReady,
      canvasReady: state.canvasReady,
      touchReady: state.touchReady,
      initialized: state.initialized,
      renderCount: state.renderCount,
      activeMode: state.mode,
      seatCount: state.seats.length,
      coordinateLaneCount: COMPASS_LANES.length,
      versionCount: VERSION_FAMILIES.length,
      uniqueSeatAddresses: uniqueAddressesValid(),
      coordinateIdentityPresent: allSeatsHave("coordinateKey"),
      versionIdentityPresent: allSeatsHave("versionKey"),
      expressiveDutyPresent: allSeatsHave("expressiveDuty"),
      handoffPresent: allSeatsHave("handoff"),
      handoffTargetPresent: allSeatsHave("handoffTarget"),
      handoffStatePresent: allSeatsHave("handoffState"),
      laneColorsPresent: allSeatsHave("laneColor"),
      versionColorsPresent: allSeatsHave("versionColor"),
      combinedColorPresent: allSeatsHave("combinedColor"),
      sphericalMeshBuilt: state.geometryBuilt,
      flatPlateResolved: state.geometryBuilt && state.glReady,
      activeWater: false,
      hydrationLoaded: false,
      terrainChildLoaded: false,
      surfaceChildLoaded: false,
      datumChildLoaded: false,
      finalVisualPass: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      heldFiles: HELD_FILES,
      errors: state.errors.slice()
    });

    window.AUDRALIA_G2_PLANET_RENDERER_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_COORDINATE_HANDOFF_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_RENDERER_STATUS = () => receipt;

    document.documentElement.dataset.audraliaPlanetRendererReceipt = CONTRACT;
    document.documentElement.dataset.audraliaPlanetSeatCount = String(receipt.seatCount);
    document.documentElement.dataset.audraliaPlanetCoordinateLaneCount = String(receipt.coordinateLaneCount);
    document.documentElement.dataset.audraliaPlanetVersionCount = String(receipt.versionCount);
    document.documentElement.dataset.audraliaPlanetUniqueSeatAddresses = receipt.uniqueSeatAddresses ? "true" : "false";
    document.documentElement.dataset.audraliaPlanetHandoffPresent = receipt.handoffPresent ? "true" : "false";
    document.documentElement.dataset.audraliaPlanetActiveWater = "false";
    document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

    return receipt;
  }

  function initRenderer() {
    try {
      state.stage = document.querySelector("[data-audralia-planet-stage]");
      state.canvas = document.querySelector("[data-audralia-planet-canvas]");
      state.fallback = document.querySelector("[data-audralia-planet-fallback]");
      state.statusNode = document.querySelector("[data-audralia-renderer-status]");

      bindModeControls();

      if (!state.stage || !state.canvas) {
        setRendererStatus("fallback", "Renderer socket missing · fallback dry planet active");
        publishReceipt("socket-missing");
        return null;
      }

      enforceCanonicalCanvas(state.stage, state.canvas);
      buildGeometry();

      const gl = createWebGLContext(state.canvas);
      if (!gl) {
        setRendererStatus("fallback", "WebGL unavailable · fallback dry planet active");
        publishReceipt("webgl-unavailable");
        return null;
      }

      state.gl = gl;
      state.glReady = true;

      initPrograms(gl);
      bindPointer(state.stage);
      resizeCanvas();

      state.canvasReady = true;
      state.initialized = true;

      setRendererStatus("active", "Native WebGL dry sphere active · water held · final pass false");
      renderWebGL();

      window.addEventListener("resize", renderWebGL, { passive: true });

      if (!state.raf) {
        state.raf = window.requestAnimationFrame(step);
      }

      publishReceipt("init-complete");

      return window.AUDRALIA_G2_PLANET_RENDERER_RECEIPT;
    } catch (error) {
      recordError("initRenderer", error);
      return null;
    }
  }

  document.documentElement.dataset.audraliaPlanetRendererContract = CONTRACT;
  document.documentElement.dataset.audraliaPlanetHtmlContract = HTML_CONTRACT;
  document.documentElement.dataset.audraliaPlanetActiveWater = "false";
  document.documentElement.dataset.audraliaPlanetHydrationLoaded = "false";
  document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

  window.AUDRALIA_G2_PLANET_RENDERER_API = {
    contract: CONTRACT,
    route: ROUTE,
    setMode,
    resetPlanet,
    render: renderWebGL,
    status: () => publishReceipt("status"),
    getSeats: () => state.seats.slice(),
    getSeatByAddress: (address) => state.seats.find((seat) => seat.seatAddress === address) || null
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRenderer, { once: true });
  } else {
    initRenderer();
  }
})();
