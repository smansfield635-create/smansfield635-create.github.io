// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_UNIQUE_CONTINENT_LATTICES_BACKSTORY_OBEDIENCE_TNT_v1
// Full-file replacement.
// Purpose: renew the Audralia continents child so every continent obeys the stable parent while expressing its own local lattice, backstory pressure, and Summit-specific landform grammar.
// Child engine only. Classic script. No imports. No exports.
// Parent-facing admission contract intentionally remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 for bridge compatibility.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const CHILD_RENEWAL_CONTRACT = "AUDRALIA_G2_6_UNIQUE_CONTINENT_LATTICES_BACKSTORY_OBEDIENCE_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const PREVIOUS_CHILD_RENEWAL_CONTRACT = "AUDRALIA_G2_6_CHILD_OBEYS_PARENT_STANDARD_CONTINENT_RENEWAL_TNT_v1";
  const FAMILY = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  const TOTAL_LATTICE_CELLS = 256;
  const EXPOSED_LAND_CELLS = 89;
  const OCEAN_SEA_SHELF_CELLS = 167;
  const EXPOSED_LAND_RATIO = EXPOSED_LAND_CELLS / TOTAL_LATTICE_CELLS;
  const OCEAN_SEA_RATIO = OCEAN_SEA_SHELF_CELLS / TOTAL_LATTICE_CELLS;

  const SUMMITS = Object.freeze([
    "Gratitude",
    "Generosity",
    "Dependability",
    "Accountability",
    "Forgiveness",
    "Humility",
    "Self-Control",
    "Patience",
    "Purity"
  ]);

  const ELEVATION = Object.freeze({
    shelfOuter: -0.03,
    shelfInner: -0.018,
    coastalPlain: -0.006,
    land: -0.004,
    pressure: -0.003,
    ridge: -0.002,
    summit: -0.0015,
    polar: -0.004
  });

  const VISIBILITY = Object.freeze({
    landMin: 0.025,
    landFull: 0.38,
    shelfMin: 0.1,
    shelfFull: 0.52,
    pressureMin: 0.12,
    ridgeMin: 0.16,
    summitMin: 0.24
  });

  const ALPHA = Object.freeze({
    shelfOuter: 0.1,
    shelfInner: 0.2,
    coastalPlain: 0.4,
    land: 0.72,
    coastStroke: 0.2,
    pressure: 0.2,
    ridge: 0.3,
    summit: 0.46
  });

  const COLORS = Object.freeze({
    gratitude: "rgba(78, 170, 106, 0.72)",
    generosity: "rgba(105, 185, 124, 0.68)",
    dependability: "rgba(66, 145, 108, 0.70)",
    accountability: "rgba(166, 128, 82, 0.62)",
    forgiveness: "rgba(84, 163, 132, 0.64)",
    humility: "rgba(100, 148, 112, 0.60)",
    selfControl: "rgba(146, 132, 84, 0.60)",
    patience: "rgba(97, 157, 139, 0.58)",
    purity: "rgba(224, 244, 250, 0.60)",
    shelfOuter: "rgba(92, 210, 226, 0.10)",
    shelfInner: "rgba(102, 216, 228, 0.20)",
    shelfEdge: "rgba(184, 246, 255, 0.14)",
    coastStroke: "rgba(235, 250, 236, 0.18)",
    ridge: "rgba(232, 214, 156, 0.30)",
    summit: "rgba(255, 239, 184, 0.46)",
    pressure: "rgba(31, 72, 62, 0.20)"
  });

  const CONTINENTS = Object.freeze([
    {
      id: "gratitude-primary",
      summit: "Gratitude",
      localLattice: "gratitude_21_restored_origin_lattice",
      className: "primary",
      cells: 21,
      role: "Restored origin body / primary external Summit expression.",
      backstoryPressure: "broad living mainland, repaired bay systems, generous shelf, stable central basin",
      color: COLORS.gratitude,
      secondaryColor: COLORS.generosity,
      center: { lon: -42, lat: 8 },
      summitPoint: { lon: -43, lat: 16 },
      pressureZones: [
        { lon: -54, lat: -7, rx: 10, ry: 8, rot: 22 },
        { lon: -39, lat: 21, rx: 8, ry: 7, rot: -12 },
        { lon: -25, lat: 2, rx: 7, ry: 5, rot: 18 }
      ],
      ridges: [
        { a: [-61, 24], b: [-34, -14], bend: 0.18 },
        { a: [-46, 34], b: [-20, 6], bend: -0.13 }
      ]
    },
    {
      id: "generosity-major",
      summit: "Generosity",
      localLattice: "generosity_13_open_fertility_lattice",
      className: "major",
      cells: 13,
      role: "Outward-giving landform with open river-mouth logic.",
      backstoryPressure: "open plains, broad coastal mouths, soft shelf expansion without domination",
      color: COLORS.generosity,
      secondaryColor: COLORS.gratitude,
      center: { lon: 42, lat: 12 },
      summitPoint: { lon: 42, lat: 20 },
      pressureZones: [
        { lon: 39, lat: 18, rx: 8, ry: 6, rot: 8 },
        { lon: 55, lat: 0, rx: 6, ry: 7, rot: -18 }
      ],
      ridges: [
        { a: [31, 29], b: [57, -10], bend: -0.11 }
      ]
    },
    {
      id: "dependability-major",
      summit: "Dependability",
      localLattice: "dependability_13_stable_plate_lattice",
      className: "major",
      cells: 13,
      role: "Old stable plate / load-bearing continent.",
      backstoryPressure: "compact coast, fewer bays, heavier inland pressure, grounded shelf",
      color: COLORS.dependability,
      secondaryColor: COLORS.humility,
      center: { lon: -105, lat: -5 },
      summitPoint: { lon: -106, lat: -2 },
      pressureZones: [
        { lon: -106, lat: -2, rx: 8, ry: 9, rot: -10 },
        { lon: -116, lat: 9, rx: 5, ry: 5, rot: 18 }
      ],
      ridges: [
        { a: [-118, 13], b: [-96, -22], bend: 0.13 }
      ]
    },
    {
      id: "accountability-major",
      summit: "Accountability",
      localLattice: "accountability_13_consequence_plate_lattice",
      className: "major",
      cells: 13,
      role: "Angular consequence plate.",
      backstoryPressure: "sharper shoulders, faulted ridges, abrupt controlled shelf breaks",
      color: COLORS.accountability,
      secondaryColor: COLORS.selfControl,
      center: { lon: 115, lat: -3 },
      summitPoint: { lon: 116, lat: 2 },
      pressureZones: [
        { lon: 116, lat: 2, rx: 8, ry: 7, rot: 24 },
        { lon: 129, lat: 7, rx: 5, ry: 5, rot: -18 }
      ],
      ridges: [
        { a: [102, 15], b: [128, -17], bend: -0.15 }
      ]
    },
    {
      id: "forgiveness-secondary",
      summit: "Forgiveness",
      localLattice: "forgiveness_8_broken_restored_lattice",
      className: "secondary",
      cells: 8,
      role: "Fractured body rejoined by shelf and bay systems.",
      backstoryPressure: "broken arcs, restored coastlines, inlets, partial separations",
      color: COLORS.forgiveness,
      secondaryColor: COLORS.generosity,
      center: { lon: -5, lat: -39 },
      summitPoint: { lon: -5, lat: -36 },
      pressureZones: [
        { lon: -7, lat: -36, rx: 7, ry: 5, rot: -5 }
      ],
      ridges: [
        { a: [-18, -36], b: [15, -44], bend: 0.1 }
      ]
    },
    {
      id: "humility-secondary",
      summit: "Humility",
      localLattice: "humility_8_low_relief_lattice",
      className: "secondary",
      cells: 8,
      role: "Subdued embedded body.",
      backstoryPressure: "low contrast, flatter contour, quiet interior zones",
      color: COLORS.humility,
      secondaryColor: COLORS.dependability,
      center: { lon: 2, lat: 45 },
      summitPoint: { lon: 4, lat: 45 },
      pressureZones: [
        { lon: 4, lat: 45, rx: 9, ry: 4, rot: 3 }
      ],
      ridges: [
        { a: [-15, 48], b: [18, 42], bend: -0.06 }
      ]
    },
    {
      id: "self-control-island-continent",
      summit: "Self-Control",
      localLattice: "self_control_5_constrained_lattice",
      className: "island-continent",
      cells: 5,
      role: "Bounded compact island-continent.",
      backstoryPressure: "tight perimeter, disciplined shelf, minimal sprawl",
      color: COLORS.selfControl,
      secondaryColor: COLORS.accountability,
      center: { lon: 160, lat: 20 },
      summitPoint: { lon: 159, lat: 21 },
      pressureZones: [
        { lon: 159, lat: 21, rx: 4, ry: 3, rot: 14 }
      ],
      ridges: [
        { a: [153, 23], b: [169, 14], bend: 0.04 }
      ]
    },
    {
      id: "patience-island-chain",
      summit: "Patience",
      localLattice: "patience_5_long_duration_chain_lattice",
      className: "island-continent",
      cells: 5,
      role: "Slow arc / island-chain formation.",
      backstoryPressure: "elongated chain, stepping islands, gradual shelf rhythm",
      color: COLORS.patience,
      secondaryColor: COLORS.forgiveness,
      center: { lon: -142, lat: 18 },
      summitPoint: { lon: -142, lat: 18 },
      pressureZones: [
        { lon: -144, lat: 18, rx: 7, ry: 3, rot: -20 }
      ],
      ridges: [
        { a: [-156, 24], b: [-128, 12], bend: 0.04 }
      ]
    },
    {
      id: "purity-polar-body",
      summit: "Purity",
      localLattice: "purity_3_polar_clarity_lattice",
      className: "polar-high-clarity",
      cells: 3,
      role: "High-clarity polar body.",
      backstoryPressure: "minimal noise, clean polar form, restrained light logic",
      color: COLORS.purity,
      secondaryColor: COLORS.purity,
      center: { lon: 18, lat: 73 },
      summitPoint: { lon: 20, lat: 73 },
      pressureZones: [
        { lon: 20, lat: 73, rx: 9, ry: 3, rot: 4 }
      ],
      ridges: [
        { a: [-8, 75], b: [31, 71], bend: -0.03 }
      ]
    }
  ]);

  const state = {
    contract: CONTRACT,
    childRenewalContract: CHILD_RENEWAL_CONTRACT,
    parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
    previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    parentCompliance: true,
    parentFacingContractUnchanged: true,
    childObeysParentStandard: true,
    acceptsParentPayloadOnly: true,
    ownsFormVisible: false,
    ownsCanvas: false,
    ownsRoute: false,
    localLatticeSovereignty: true,
    sharedGlobalLattice: false,
    nineUniqueContinentLattices: true,
    backstoryTracedLattices: true,
    nineSummits256FibonacciModel: true,
    summitCount: 9,
    continentBodyCount: 9,
    totalLatticeCells: TOTAL_LATTICE_CELLS,
    exposedLandCells: EXPOSED_LAND_CELLS,
    oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
    exposedLandRatio: EXPOSED_LAND_RATIO,
    oceanSeaRatio: OCEAN_SEA_RATIO,
    primarySummit: "Gratitude",
    active: true,
    classicScript: true,
    globalPublished: false,
    mountCalled: false,
    drawCount: 0,
    lastParentContractSeen: "",
    lastDrawSkippedReason: "",
    visualPassClaim: false,
    errors: []
  };

  const localCache = new Map();

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt(scope);
  }

  function toRad(degrees) {
    return degrees * DEG;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeLon(lon) {
    let value = lon;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
  }

  function rotatePoint(x, y, angleRad) {
    return {
      x: x * Math.cos(angleRad) - y * Math.sin(angleRad),
      y: x * Math.sin(angleRad) + y * Math.cos(angleRad)
    };
  }

  function parseRgba(color) {
    const match = String(color || "").match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);

    if (!match) return { r: 255, g: 255, b: 255, a: 1 };

    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4])
    };
  }

  function withAlpha(color, multiplier = 1, maxAlpha = 1) {
    const rgba = parseRgba(color);
    const alpha = clamp(Math.min(rgba.a, maxAlpha) * multiplier, 0, maxAlpha);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
  }

  function depthAlpha(z, minVisible, fullStrength) {
    if (!Number.isFinite(z) || z <= minVisible) return 0;
    if (z >= fullStrength) return 1;

    const t = (z - minVisible) / Math.max(0.0001, fullStrength - minVisible);
    return clamp(t * t * (3 - 2 * t), 0, 1);
  }

  function validPayload(ctx, payload) {
    const valid = Boolean(
      ctx &&
        payload &&
        payload.geometry &&
        payload.project &&
        typeof payload.project === "function" &&
        Number.isFinite(payload.geometry.cx) &&
        Number.isFinite(payload.geometry.cy) &&
        Number.isFinite(payload.geometry.radius) &&
        payload.geometry.radius > 0
    );

    if (!valid) state.lastDrawSkippedReason = "invalid_parent_payload";

    return valid;
  }

  function projectPoint(payload, lonDeg, latDeg, elevation = ELEVATION.land) {
    return payload.project(toRad(lonDeg), toRad(latDeg), elevation);
  }

  function parentContractSeen(payload) {
    const value =
      (payload && payload.contract) ||
      (payload && payload.state && payload.state.contract) ||
      "";

    state.lastParentContractSeen = String(value || "");

    return state.lastParentContractSeen;
  }

  function node(lon, lat) {
    return {
      lon: normalizeLon(lon),
      lat: clamp(lat, -82, 82)
    };
  }

  function ellipseNode(center, rx, ry, rotDeg, t, radial = 1) {
    const rot = toRad(rotDeg || 0);
    const local = rotatePoint(Math.cos(t) * rx * radial, Math.sin(t) * ry * radial, rot);
    return node(center.lon + local.x, center.lat + local.y);
  }

  function modeScale(mode) {
    if (mode === "shelfOuter") return 1.17;
    if (mode === "shelfInner") return 1.07;
    if (mode === "coastalPlain") return 0.82;
    return 1;
  }

  function gratitudeCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: -42, lat: 8 };
    const points = [];
    const count = 44;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const repairedBay = Math.max(0, Math.sin(t * 2.0 - 0.8)) * -0.1;
      const generousShelf = Math.max(0, Math.cos(t - 0.2)) * 0.08;
      const basinPulse = Math.sin(t * 3.0 + 0.4) * 0.08 + Math.cos(t * 5.0) * 0.035;
      const radial = 1 + repairedBay + generousShelf + basinPulse;

      points.push(ellipseNode(center, 33 * scale, 35 * scale, -14, t, radial));
    }

    return [points];
  }

  function generosityCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: 42, lat: 12 };
    const points = [];
    const count = 36;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const mouthEast = Math.exp(-Math.pow(t - 0.05, 2) / 0.11) * -0.18;
      const mouthSouth = Math.exp(-Math.pow(t - 1.65, 2) / 0.16) * -0.12;
      const openPlain = Math.sin(t * 2.0 + 0.7) * 0.045;
      const radial = 1 + mouthEast + mouthSouth + openPlain;

      points.push(ellipseNode(center, 25 * scale, 28 * scale, 18, t, radial));
    }

    return [points];
  }

  function dependabilityCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: -105, lat: -5 };
    const points = [];
    const count = 34;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const shoulder = Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.62);
      const vertical = Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.82);
      const oldPlate = 1 + Math.sin(t * 4.0) * 0.035 + Math.cos(t * 2.0) * 0.025;
      const rot = toRad(-8);
      const local = rotatePoint(shoulder * 23 * scale * oldPlate, vertical * 28 * scale * oldPlate, rot);

      points.push(node(center.lon + local.x, center.lat + local.y));
    }

    return [points];
  }

  function accountabilityCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: 115, lat: -3 };
    const points = [];
    const corners = [
      [1.24, 0.1],
      [0.74, 0.78],
      [0.22, 1.14],
      [-0.62, 0.82],
      [-1.12, 0.2],
      [-0.82, -0.72],
      [-0.18, -1.18],
      [0.78, -0.82]
    ];
    const rot = toRad(24);

    for (let i = 0; i < corners.length; i += 1) {
      const [x1, y1] = corners[i];
      const [x2, y2] = corners[(i + 1) % corners.length];

      for (let j = 0; j < 4; j += 1) {
        const k = j / 4;
        const fault = (j % 2 === 0 ? 0.045 : -0.035) * (mode === "land" ? 1 : 0.55);
        const x = x1 + (x2 - x1) * k + fault;
        const y = y1 + (y2 - y1) * k - fault * 0.7;
        const local = rotatePoint(x * 24 * scale, y * 25 * scale, rot);

        points.push(node(center.lon + local.x, center.lat + local.y));
      }
    }

    return [points];
  }

  function forgivenessCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: -5, lat: -39 };
    const points = [];
    const count = 32;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const breakWest = Math.exp(-Math.pow(t - 3.1, 2) / 0.08) * -0.26;
      const restoredBay = Math.exp(-Math.pow(t - 5.0, 2) / 0.13) * -0.18;
      const healedArc = Math.max(0, Math.sin(t * 2.0 + 0.4)) * 0.11;
      const seam = Math.sin(t * 6.0) * 0.045;
      const radial = 1 + breakWest + restoredBay + healedArc + seam;

      points.push(ellipseNode(center, 21 * scale, 15 * scale, -9, t, radial));
    }

    return [points];
  }

  function humilityCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: 2, lat: 45 };
    const points = [];
    const count = 30;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const quiet = 1 + Math.sin(t * 2.0) * 0.025 + Math.cos(t * 5.0) * 0.018;
      const lowRelief = 0.96 + Math.max(0, Math.sin(t + 0.4)) * 0.04;

      points.push(ellipseNode(center, 25 * scale, 12 * scale, 4, t, quiet * lowRelief));
    }

    return [points];
  }

  function selfControlCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: 160, lat: 20 };
    const points = [];
    const count = 16;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const disciplined = i % 2 === 0 ? 1.03 : 0.91;
      const contained = 1 + Math.sin(t * 4.0) * 0.025;

      points.push(ellipseNode(center, 12 * scale, 10 * scale, 16, t, disciplined * contained));
    }

    return [points];
  }

  function patienceCoast(mode) {
    const scale = modeScale(mode);
    const chain = [
      { center: { lon: -156, lat: 24 }, rx: 7, ry: 5, rot: 24, count: 14, drift: 0.03 },
      { center: { lon: -142, lat: 18 }, rx: 8, ry: 5, rot: -18, count: 16, drift: 0.04 },
      { center: { lon: -128, lat: 12 }, rx: 6, ry: 4, rot: 12, count: 14, drift: 0.03 }
    ];

    return chain.map((island, islandIndex) => {
      const points = [];

      for (let i = 0; i < island.count; i += 1) {
        const t = (TAU * i) / island.count;
        const slowStep = 1 + Math.sin(t * 2.0 + islandIndex) * island.drift + Math.cos(t * 3.0) * island.drift;
        points.push(ellipseNode(island.center, island.rx * scale, island.ry * scale, island.rot, t, slowStep));
      }

      return points;
    });
  }

  function purityCoast(mode) {
    const scale = modeScale(mode);
    const center = { lon: 18, lat: 73 };
    const points = [];
    const count = 24;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;
      const clarity = 1 + Math.sin(t * 2.0) * 0.018 + Math.cos(t * 4.0) * 0.012;
      const polarFlatten = t > Math.PI ? 0.95 : 1.04;

      points.push(ellipseNode(center, 30 * scale, 7 * scale, 4, t, clarity * polarFlatten));
    }

    return [points];
  }

  function localLatticeSets(continent, mode) {
    const cacheKey = `${continent.id}:${mode}`;

    if (localCache.has(cacheKey)) return localCache.get(cacheKey);

    let sets;

    if (continent.summit === "Gratitude") sets = gratitudeCoast(mode);
    else if (continent.summit === "Generosity") sets = generosityCoast(mode);
    else if (continent.summit === "Dependability") sets = dependabilityCoast(mode);
    else if (continent.summit === "Accountability") sets = accountabilityCoast(mode);
    else if (continent.summit === "Forgiveness") sets = forgivenessCoast(mode);
    else if (continent.summit === "Humility") sets = humilityCoast(mode);
    else if (continent.summit === "Self-Control") sets = selfControlCoast(mode);
    else if (continent.summit === "Patience") sets = patienceCoast(mode);
    else if (continent.summit === "Purity") sets = purityCoast(mode);
    else sets = [];

    localCache.set(cacheKey, sets);

    return sets;
  }

  function projectedSet(payload, nodes, elevation) {
    return nodes.map((point) => ({
      ...projectPoint(payload, point.lon, point.lat, elevation),
      lon: point.lon,
      lat: point.lat
    }));
  }

  function projectedAverage(payload, nodes, elevation) {
    if (!nodes.length) return projectPoint(payload, 0, 0, elevation);

    const sum = nodes.reduce(
      (acc, point) => {
        acc.lon += point.lon;
        acc.lat += point.lat;
        return acc;
      },
      { lon: 0, lat: 0 }
    );

    return projectPoint(payload, sum.lon / nodes.length, sum.lat / nodes.length, elevation);
  }

  function shapeVisibilityOk(points, minRatio) {
    if (!points || !points.length) return false;

    const visible = points.filter((point) => point.visible && point.z > -0.08);

    return visible.length / points.length >= minRatio;
  }

  function drawClosedPath(ctx, pts) {
    if (!pts || !pts.length) return false;

    ctx.beginPath();

    pts.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();

    return true;
  }

  function drawLocalShape(ctx, payload, continent, options) {
    const localSets = localLatticeSets(continent, options.mode);

    for (const nodes of localSets) {
      const center = projectedAverage(payload, nodes, options.centerElevation ?? options.elevation);
      const alpha = depthAlpha(center.z, options.minVisible, options.fullStrength);

      if (!center.visible || alpha <= 0.02) continue;

      const projected = projectedSet(payload, nodes, options.elevation);

      if (!shapeVisibilityOk(projected, options.minVisibleRatio)) continue;

      ctx.save();

      if (drawClosedPath(ctx, projected)) {
        ctx.fillStyle = withAlpha(options.fill, alpha, options.centerAlpha);
        ctx.fill();

        if (options.stroke && options.lineWidth > 0 && alpha > 0.08) {
          ctx.strokeStyle = withAlpha(options.stroke, alpha * 0.78, options.strokeAlpha);
          ctx.lineWidth = options.lineWidth;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  function drawShelves(ctx, payload, continent) {
    drawLocalShape(ctx, payload, continent, {
      mode: "shelfOuter",
      elevation: ELEVATION.shelfOuter,
      centerElevation: ELEVATION.shelfOuter,
      fill: COLORS.shelfOuter,
      stroke: COLORS.shelfEdge,
      centerAlpha: ALPHA.shelfOuter,
      strokeAlpha: 0.1,
      minVisible: VISIBILITY.shelfMin,
      fullStrength: VISIBILITY.shelfFull,
      minVisibleRatio: 0.72,
      lineWidth: Math.max(1, payload.geometry.radius * 0.0018)
    });

    drawLocalShape(ctx, payload, continent, {
      mode: "shelfInner",
      elevation: ELEVATION.shelfInner,
      centerElevation: ELEVATION.shelfInner,
      fill: COLORS.shelfInner,
      stroke: COLORS.shelfEdge,
      centerAlpha: ALPHA.shelfInner,
      strokeAlpha: 0.12,
      minVisible: VISIBILITY.shelfMin,
      fullStrength: VISIBILITY.shelfFull,
      minVisibleRatio: 0.7,
      lineWidth: Math.max(1, payload.geometry.radius * 0.002)
    });
  }

  function drawLand(ctx, payload, continent) {
    const landElevation = continent.summit === "Purity" ? ELEVATION.polar : ELEVATION.land;

    drawLocalShape(ctx, payload, continent, {
      mode: "land",
      elevation: landElevation,
      centerElevation: landElevation,
      fill: continent.color,
      stroke: COLORS.coastStroke,
      centerAlpha: ALPHA.land,
      strokeAlpha: ALPHA.coastStroke,
      minVisible: VISIBILITY.landMin,
      fullStrength: VISIBILITY.landFull,
      minVisibleRatio: 0.5,
      lineWidth: Math.max(1, payload.geometry.radius * 0.0028)
    });

    drawLocalShape(ctx, payload, continent, {
      mode: "coastalPlain",
      elevation: ELEVATION.coastalPlain,
      centerElevation: ELEVATION.coastalPlain,
      fill: continent.secondaryColor || continent.color,
      stroke: "",
      centerAlpha: ALPHA.coastalPlain,
      strokeAlpha: 0,
      minVisible: VISIBILITY.landMin + 0.04,
      fullStrength: VISIBILITY.landFull + 0.12,
      minVisibleRatio: 0.58,
      lineWidth: 0
    });
  }

  function drawPressureZone(ctx, payload, zone) {
    const center = projectPoint(payload, zone.lon, zone.lat, ELEVATION.pressure);
    const alpha = depthAlpha(center.z, VISIBILITY.pressureMin, VISIBILITY.landFull + 0.16);

    if (!center.visible || alpha <= 0.03) return;

    const rot = toRad(zone.rot || 0);
    const pts = [];
    const steps = 18;

    for (let i = 0; i < steps; i += 1) {
      const t = (TAU * i) / steps;
      const noise = 1 + Math.sin(t * 3.0) * 0.08 + Math.cos(t * 5.0) * 0.04;
      const local = rotatePoint(Math.cos(t) * zone.rx * noise, Math.sin(t) * zone.ry * noise, rot);
      const p = projectPoint(
        payload,
        normalizeLon(zone.lon + local.x),
        clamp(zone.lat + local.y, -82, 82),
        ELEVATION.pressure
      );

      if (!p.visible || p.z < VISIBILITY.pressureMin - 0.04) return;

      pts.push(p);
    }

    ctx.save();

    if (drawClosedPath(ctx, pts)) {
      ctx.fillStyle = withAlpha(COLORS.pressure, alpha, ALPHA.pressure);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawRidge(ctx, payload, ridge) {
    const [aLon, aLat] = ridge.a;
    const [bLon, bLat] = ridge.b;
    const bend = ridge.bend || 0;
    const mid = projectPoint(payload, (aLon + bLon) / 2, (aLat + bLat) / 2, ELEVATION.ridge);
    const alpha = depthAlpha(mid.z, VISIBILITY.ridgeMin, 0.58);

    if (!mid.visible || alpha <= 0.04) return;

    const pts = [];

    for (let i = 0; i <= 24; i += 1) {
      const k = i / 24;
      const lon = aLon + (bLon - aLon) * k + Math.sin(k * Math.PI) * bend * 18;
      const lat = aLat + (bLat - aLat) * k + Math.sin(k * Math.PI) * bend * 8;
      const p = projectPoint(payload, lon, lat, ELEVATION.ridge);

      if (!p.visible || p.z <= VISIBILITY.ridgeMin - 0.06) return;

      pts.push(p);
    }

    ctx.save();
    ctx.beginPath();

    pts.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = withAlpha(COLORS.ridge, alpha, ALPHA.ridge);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0038);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawSummit(ctx, payload, continent) {
    const p = projectPoint(payload, continent.summitPoint.lon, continent.summitPoint.lat, ELEVATION.summit);
    const alpha = depthAlpha(p.z, VISIBILITY.summitMin, 0.66);

    if (!p.visible || alpha <= 0.05) return;

    const scaleByClass =
      continent.className === "primary"
        ? 1.12
        : continent.className === "major"
          ? 0.98
          : continent.className === "secondary"
            ? 0.82
            : 0.68;

    const r = Math.max(1.1, payload.geometry.radius * 0.0075 * scaleByClass) * (0.76 + p.scale * 0.26);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.5, 0, TAU);
    ctx.fillStyle = withAlpha("rgba(255, 232, 158, 0.055)", alpha, 0.06);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, TAU);
    ctx.fillStyle = withAlpha(COLORS.summit, alpha, ALPHA.summit);
    ctx.fill();

    ctx.restore();
  }

  function drawContinentalMaterial(ctx, payload) {
    for (const continent of CONTINENTS) {
      drawShelves(ctx, payload, continent);
    }

    for (const continent of CONTINENTS) {
      drawLand(ctx, payload, continent);
    }

    for (const continent of CONTINENTS) {
      for (const zone of continent.pressureZones || []) {
        drawPressureZone(ctx, payload, zone);
      }
    }

    for (const continent of CONTINENTS) {
      for (const ridge of continent.ridges || []) {
        drawRidge(ctx, payload, ridge);
      }
    }

    for (const continent of CONTINENTS) {
      drawSummit(ctx, payload, continent);
    }
  }

  function draw(ctx, payload) {
    try {
      if (!validPayload(ctx, payload)) {
        publishReceipt("draw-skipped-invalid-parent-payload");
        return api;
      }

      parentContractSeen(payload);

      state.drawCount += 1;
      state.lastDrawSkippedReason = "";

      drawContinentalMaterial(ctx, payload);

      publishReceipt("draw");

      return api;
    } catch (error) {
      recordError("draw", error);
      return api;
    }
  }

  function render(ctx, payload) {
    return draw(ctx, payload);
  }

  function paint(ctx, payload) {
    return draw(ctx, payload);
  }

  function drawContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function renderContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function paintContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function mount() {
    state.mountCalled = true;
    publishReceipt("mount");
    return api;
  }

  function init() {
    publishReceipt("init");
    return api;
  }

  function setup() {
    publishReceipt("setup");
    return api;
  }

  function boot() {
    publishReceipt("boot");
    return api;
  }

  function create() {
    publishReceipt("create");
    return api;
  }

  function getDistribution() {
    return CONTINENTS.map((continent) => ({
      id: continent.id,
      summit: continent.summit,
      localLattice: continent.localLattice,
      className: continent.className,
      cells: continent.cells,
      role: continent.role,
      backstoryPressure: continent.backstoryPressure
    }));
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      childRenewalContract: CHILD_RENEWAL_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      localLatticeSovereignty: true,
      sharedGlobalLattice: false,
      nineUniqueContinentLattices: true,
      backstoryTracedLattices: true,
      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
      summits: SUMMITS.slice(),
      totalLatticeCells: TOTAL_LATTICE_CELLS,
      exposedLandCells: EXPOSED_LAND_CELLS,
      oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
      exposedLandRatio: EXPOSED_LAND_RATIO,
      oceanSeaRatio: OCEAN_SEA_RATIO,
      primarySummit: "Gratitude",
      fibonacciDistribution: getDistribution(),
      landCellTotal: CONTINENTS.reduce((sum, continent) => sum + continent.cells, 0),
      seaLevelLand: true,
      submergedShelves: true,
      softLimbFade: true,
      noHardLimbSlicing: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      owns: [
        "Nine Summits continent model",
        "89 of 256 exposed-land budget",
        "167 of 256 ocean/shelf/sea budget",
        "Fibonacci land distribution",
        "nine locally sovereign continent lattices",
        "backstory-traced landform expression",
        "parent-compliant child surface material",
        "sea-level land projection",
        "submerged shelves",
        "surface pressure ridges",
        "embedded summit markers",
        "soft limb fade"
      ],
      doesNotOwn: [
        "FORM_VISIBLE",
        "parent geometry",
        "canvas creation",
        "route fallback",
        "runtime handoff",
        "parent mount",
        "sky",
        "motion",
        "cloud layer",
        "zoom",
        "orbit"
      ],
      visualPassClaim: false,
      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      childRenewalContract: CHILD_RENEWAL_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_unique_continent_lattices_backstory_obedience",
      scope,
      active: true,
      classicScript: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      localLatticeSovereignty: true,
      sharedGlobalLattice: false,
      nineUniqueContinentLattices: true,
      backstoryTracedLattices: true,
      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
      totalLatticeCells: TOTAL_LATTICE_CELLS,
      exposedLandCells: EXPOSED_LAND_CELLS,
      oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
      exposedLandRatio: EXPOSED_LAND_RATIO,
      oceanSeaRatio: OCEAN_SEA_RATIO,
      primarySummit: "Gratitude",
      landCellTotal: CONTINENTS.reduce((sum, continent) => sum + continent.cells, 0),
      summits: SUMMITS.slice(),
      distribution: getDistribution(),
      seaLevelLand: true,
      submergedShelves: true,
      softLimbFade: true,
      noHardLimbSlicing: true,
      fiveContinentLawDeprecated: true,
      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      visualPassClaim: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,
      errors: state.errors.slice()
    };

    window.AUDRALIA_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_UNIQUE_CONTINENT_LATTICES_RECEIPT = receipt;

    try {
      window.dispatchEvent(new CustomEvent("audralia:continents:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:continents:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    CONTRACT,
    CHILD_RENEWAL_CONTRACT,
    PARENT_COMPLIANCE_CONTRACT,
    PREVIOUS_CHILD_RENEWAL_CONTRACT,
    FAMILY,
    TARGET,
    ROUTE,
    SUMMITS,
    CONTINENTS,
    TOTAL_LATTICE_CELLS,
    EXPOSED_LAND_CELLS,
    OCEAN_SEA_SHELF_CELLS,
    EXPOSED_LAND_RATIO,
    OCEAN_SEA_RATIO,
    mount,
    init,
    setup,
    boot,
    create,
    draw,
    render,
    paint,
    drawContinents,
    renderContinents,
    paintContinents,
    getStatus,
    status: getStatus
  };

  if (hasWindow()) {
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CLEAN_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS = api;

    window.AudraliaContinentsEngine = api;
    window.AudraliaContinents = api;
    window.audraliaContinents = api;

    window.AUDRALIA_NINE_SUMMITS_256_FIBONACCI_CONTINENTS_ACTIVE = true;
    window.AUDRALIA_UNIQUE_CONTINENT_LATTICES_BACKSTORY_OBEDIENCE_ACTIVE = true;
    window.AUDRALIA_LOCAL_LATTICE_SOVEREIGNTY = true;
    window.AUDRALIA_SHARED_GLOBAL_LATTICE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_DEPRECATED = true;
    window.AUDRALIA_EXPOSED_LAND_CELLS = EXPOSED_LAND_CELLS;
    window.AUDRALIA_OCEAN_SEA_SHELF_CELLS = OCEAN_SEA_SHELF_CELLS;
    window.AUDRALIA_PRIMARY_SUMMIT = "Gratitude";

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
