// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_CHILD_OBEYS_PARENT_STANDARD_CONTINENT_RENEWAL_TNT_v1
// Full-file replacement.
// Purpose: renew the Audralia continents child so it obeys the stable parent standard first and expresses the Nine Summits / 256 / Fibonacci land model second.
// Child engine only. Classic script. No imports. No exports.
// Parent-facing admission contract intentionally remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 for bridge compatibility.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const CHILD_RENEWAL_CONTRACT = "AUDRALIA_G2_6_CHILD_OBEYS_PARENT_STANDARD_CONTINENT_RENEWAL_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const PREVIOUS_CHILD_RENEWAL_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_CONTINENT_EXPRESSION_REFINEMENT_TNT_v1";
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
    coastalPlain: 0.42,
    land: 0.72,
    coastStroke: 0.2,
    pressure: 0.2,
    ridge: 0.3,
    summit: 0.46
  });

  const COLORS = Object.freeze({
    gratitude: "rgba(78, 170, 106, 0.72)",
    generosity: "rgba(104, 184, 124, 0.68)",
    dependability: "rgba(67, 146, 108, 0.70)",
    accountability: "rgba(164, 128, 82, 0.62)",
    forgiveness: "rgba(84, 163, 132, 0.64)",
    humility: "rgba(100, 148, 112, 0.60)",
    selfControl: "rgba(146, 132, 84, 0.60)",
    patience: "rgba(97, 157, 139, 0.58)",
    purity: "rgba(224, 244, 250, 0.60)",
    shelfOuter: "rgba(92, 210, 226, 0.10)",
    shelfInner: "rgba(102, 216, 228, 0.20)",
    shelfEdge: "rgba(184, 246, 255, 0.14)",
    coastStroke: "rgba(235, 250, 236, 0.18)",
    coastalPlain: "rgba(126, 188, 126, 0.42)",
    ridge: "rgba(232, 214, 156, 0.30)",
    summit: "rgba(255, 239, 184, 0.46)",
    pressure: "rgba(31, 72, 62, 0.20)",
    shadow: "rgba(0, 13, 28, 0.16)"
  });

  const CONTINENTS = Object.freeze([
    {
      id: "gratitude-primary",
      summit: "Gratitude",
      className: "primary",
      cells: 21,
      role: "Audralia primary external Summit body",
      color: COLORS.gratitude,
      secondaryColor: COLORS.generosity,
      center: { lon: -42, lat: 8 },
      radius: { lon: 33, lat: 35 },
      rotation: -14,
      nodes: 42,
      ruggedness: 0.28,
      shelfScale: 1.18,
      coastlineProfile: [
        1.18, 0.82, 1.04, 1.22, 0.88, 1.12, 0.94,
        1.28, 0.84, 1.08, 1.16, 0.9, 1.02, 1.24
      ],
      pressureZones: [
        { lon: -54, lat: -7, rx: 10, ry: 8, rot: 22 },
        { lon: -39, lat: 21, rx: 8, ry: 7, rot: -12 },
        { lon: -25, lat: 2, rx: 7, ry: 5, rot: 18 }
      ],
      ridges: [
        { a: [-61, 24], b: [-34, -14], bend: 0.18 },
        { a: [-46, 34], b: [-20, 6], bend: -0.13 }
      ],
      summitPoint: { lon: -43, lat: 16 }
    },
    {
      id: "generosity-major",
      summit: "Generosity",
      className: "major",
      cells: 13,
      role: "open fertile major body with broad shelf logic",
      color: COLORS.generosity,
      secondaryColor: COLORS.gratitude,
      center: { lon: 42, lat: 12 },
      radius: { lon: 24, lat: 27 },
      rotation: 18,
      nodes: 34,
      ruggedness: 0.22,
      shelfScale: 1.18,
      coastlineProfile: [
        1.1, 0.9, 1.22, 0.84, 1.06, 1.16, 0.92,
        1.24, 0.88, 1.02, 1.14, 0.94
      ],
      pressureZones: [
        { lon: 39, lat: 18, rx: 8, ry: 6, rot: 8 },
        { lon: 55, lat: 0, rx: 6, ry: 7, rot: -18 }
      ],
      ridges: [
        { a: [31, 29], b: [57, -10], bend: -0.11 }
      ],
      summitPoint: { lon: 42, lat: 20 }
    },
    {
      id: "dependability-major",
      summit: "Dependability",
      className: "major",
      cells: 13,
      role: "stable structural major landmass",
      color: COLORS.dependability,
      secondaryColor: COLORS.humility,
      center: { lon: -105, lat: -5 },
      radius: { lon: 23, lat: 28 },
      rotation: -8,
      nodes: 34,
      ruggedness: 0.18,
      shelfScale: 1.14,
      coastlineProfile: [
        1.02, 0.92, 1.08, 0.96, 1.16, 0.9, 1.06,
        1.18, 0.94, 1.04, 0.88, 1.12
      ],
      pressureZones: [
        { lon: -106, lat: -2, rx: 8, ry: 9, rot: -10 },
        { lon: -116, lat: 9, rx: 5, ry: 5, rot: 18 }
      ],
      ridges: [
        { a: [-118, 13], b: [-96, -22], bend: 0.13 }
      ],
      summitPoint: { lon: -106, lat: -2 }
    },
    {
      id: "accountability-major",
      summit: "Accountability",
      className: "major",
      cells: 13,
      role: "angular pressure-bearing major continent",
      color: COLORS.accountability,
      secondaryColor: COLORS.selfControl,
      center: { lon: 115, lat: -3 },
      radius: { lon: 24, lat: 25 },
      rotation: 24,
      nodes: 34,
      ruggedness: 0.27,
      shelfScale: 1.15,
      coastlineProfile: [
        1.22, 0.86, 1.1, 0.92, 1.26, 0.84, 1.04,
        1.18, 0.9, 1.12, 0.88, 1.2
      ],
      pressureZones: [
        { lon: 116, lat: 2, rx: 8, ry: 7, rot: 24 },
        { lon: 129, lat: 7, rx: 5, ry: 5, rot: -18 }
      ],
      ridges: [
        { a: [102, 15], b: [128, -17], bend: -0.15 }
      ],
      summitPoint: { lon: 116, lat: 2 }
    },
    {
      id: "forgiveness-secondary",
      summit: "Forgiveness",
      className: "secondary",
      cells: 8,
      role: "broken-but-restored coast and bay logic",
      color: COLORS.forgiveness,
      secondaryColor: COLORS.generosity,
      center: { lon: -5, lat: -39 },
      radius: { lon: 20, lat: 15 },
      rotation: -9,
      nodes: 28,
      ruggedness: 0.3,
      shelfScale: 1.2,
      coastlineProfile: [
        1.16, 0.78, 1.04, 1.25, 0.82, 1.12, 0.88,
        1.18, 0.8, 1.06, 1.2
      ],
      pressureZones: [
        { lon: -7, lat: -36, rx: 7, ry: 5, rot: -5 }
      ],
      ridges: [
        { a: [-18, -36], b: [15, -44], bend: 0.1 }
      ],
      summitPoint: { lon: -5, lat: -36 }
    },
    {
      id: "humility-secondary",
      summit: "Humility",
      className: "secondary",
      cells: 8,
      role: "lower-relief embedded surface body",
      color: COLORS.humility,
      secondaryColor: COLORS.dependability,
      center: { lon: 2, lat: 45 },
      radius: { lon: 24, lat: 12 },
      rotation: 4,
      nodes: 28,
      ruggedness: 0.14,
      shelfScale: 1.12,
      coastlineProfile: [
        1.04, 0.94, 1.1, 0.92, 1.06, 0.96, 1.12,
        0.9, 1.02, 1.08
      ],
      pressureZones: [
        { lon: 4, lat: 45, rx: 9, ry: 4, rot: 3 }
      ],
      ridges: [
        { a: [-15, 48], b: [18, 42], bend: -0.06 }
      ],
      summitPoint: { lon: 4, lat: 45 }
    },
    {
      id: "self-control-island-continent",
      summit: "Self-Control",
      className: "island-continent",
      cells: 5,
      role: "constrained compact body",
      color: COLORS.selfControl,
      secondaryColor: COLORS.accountability,
      center: { lon: 160, lat: 20 },
      radius: { lon: 12, lat: 10 },
      rotation: 16,
      nodes: 22,
      ruggedness: 0.2,
      shelfScale: 1.16,
      coastlineProfile: [
        1.12, 0.9, 1.18, 0.84, 1.04, 1.14, 0.88, 1.08
      ],
      pressureZones: [
        { lon: 159, lat: 21, rx: 4, ry: 3, rot: 14 }
      ],
      ridges: [
        { a: [153, 23], b: [169, 14], bend: 0.04 }
      ],
      summitPoint: { lon: 159, lat: 21 }
    },
    {
      id: "patience-island-chain",
      summit: "Patience",
      className: "island-continent",
      cells: 5,
      role: "long arc island-continent chain",
      color: COLORS.patience,
      secondaryColor: COLORS.forgiveness,
      center: { lon: -142, lat: 18 },
      radius: { lon: 21, lat: 8 },
      rotation: -24,
      nodes: 24,
      ruggedness: 0.24,
      shelfScale: 1.18,
      coastlineProfile: [
        1.18, 0.8, 1.08, 1.22, 0.86, 1.04, 0.9, 1.14, 0.84
      ],
      pressureZones: [
        { lon: -144, lat: 18, rx: 7, ry: 3, rot: -20 }
      ],
      ridges: [
        { a: [-156, 24], b: [-128, 12], bend: 0.04 }
      ],
      summitPoint: { lon: -142, lat: 18 }
    },
    {
      id: "purity-polar-body",
      summit: "Purity",
      className: "polar-high-clarity",
      cells: 3,
      role: "high-clarity polar expression",
      color: COLORS.purity,
      secondaryColor: COLORS.purity,
      center: { lon: 18, lat: 73 },
      radius: { lon: 30, lat: 7 },
      rotation: 4,
      nodes: 22,
      ruggedness: 0.1,
      shelfScale: 1.1,
      coastlineProfile: [
        1.04, 0.94, 1.08, 0.9, 1.02, 1.1, 0.92, 1.06
      ],
      pressureZones: [
        { lon: 20, lat: 73, rx: 9, ry: 3, rot: 4 }
      ],
      ridges: [
        { a: [-8, 75], b: [31, 71], bend: -0.03 }
      ],
      summitPoint: { lon: 20, lat: 73 }
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
    nineSummits256FibonacciModel: true,
    coastlineNodeExpression: true,
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

  const coastlineCache = new Map();

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

  function hashNumber(seed, index) {
    const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453123;
    return x - Math.floor(x);
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

  function profileValue(continent, index) {
    const profile = continent.coastlineProfile || [1];
    const base = profile[index % profile.length];
    const secondary = profile[(index * 3 + continent.cells) % profile.length];
    return base * 0.76 + secondary * 0.24;
  }

  function coastlineNode(continent, index, scale, mode) {
    const count = continent.nodes || 24;
    const t = (TAU * index) / count;
    const rot = toRad(continent.rotation || 0);
    const seed = continent.cells * 31 + continent.center.lon * 0.17 + continent.center.lat * 0.19;

    const profile = profileValue(continent, index);
    const rough =
      1 +
      Math.sin(t * 3 + seed) * continent.ruggedness * 0.22 +
      Math.cos(t * 5 + seed * 0.7) * continent.ruggedness * 0.16 +
      (hashNumber(seed, index) - 0.5) * continent.ruggedness * 0.18;

    let modeScale = scale;

    if (mode === "shelfOuter") modeScale *= 1.08;
    if (mode === "shelfInner") modeScale *= 1.035;
    if (mode === "coastalPlain") modeScale *= 0.94;
    if (mode === "pressure") modeScale *= 0.42;

    const rx = continent.radius.lon * modeScale * profile * rough;
    const ry = continent.radius.lat * modeScale * (profile * 0.82 + 0.18) * rough;

    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry;

    const rotated = rotatePoint(x, y, rot);

    return {
      lon: normalizeLon(continent.center.lon + rotated.x),
      lat: clamp(continent.center.lat + rotated.y, -82, 82)
    };
  }

  function buildCoastline(continent, scale = 1, mode = "land") {
    const cacheKey = `${continent.id}:${scale}:${mode}`;

    if (coastlineCache.has(cacheKey)) return coastlineCache.get(cacheKey);

    const count = continent.nodes || 24;
    const nodes = [];

    for (let i = 0; i < count; i += 1) {
      nodes.push(coastlineNode(continent, i, scale, mode));
    }

    coastlineCache.set(cacheKey, nodes);

    return nodes;
  }

  function projectedCoastline(payload, continent, scale, elevation, mode) {
    return buildCoastline(continent, scale, mode).map((node) => ({
      ...projectPoint(payload, node.lon, node.lat, elevation),
      lon: node.lon,
      lat: node.lat
    }));
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

  function projectedCenter(payload, continent, elevation = ELEVATION.land) {
    return projectPoint(payload, continent.center.lon, continent.center.lat, elevation);
  }

  function shapeVisibilityOk(points, minRatio) {
    if (!points || !points.length) return false;

    const visible = points.filter((point) => point.visible && point.z > -0.08);

    return visible.length / points.length >= minRatio;
  }

  function drawCoastShape(ctx, payload, continent, options) {
    const center = projectedCenter(payload, continent, options.centerElevation ?? options.elevation);
    const alpha = depthAlpha(center.z, options.minVisible, options.fullStrength);

    if (!center.visible || alpha <= 0.02) return false;

    const pts = projectedCoastline(payload, continent, options.scale, options.elevation, options.mode);

    if (!shapeVisibilityOk(pts, options.minVisibleRatio)) return false;

    ctx.save();

    if (drawClosedPath(ctx, pts)) {
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

    return true;
  }

  function drawShelves(ctx, payload, continent) {
    drawCoastShape(ctx, payload, continent, {
      mode: "shelfOuter",
      scale: continent.shelfScale || 1.16,
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

    drawCoastShape(ctx, payload, continent, {
      mode: "shelfInner",
      scale: (continent.shelfScale || 1.16) * 0.98,
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

    drawCoastShape(ctx, payload, continent, {
      mode: "land",
      scale: 1,
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

    drawCoastShape(ctx, payload, continent, {
      mode: "coastalPlain",
      scale: 0.88,
      elevation: ELEVATION.coastalPlain,
      centerElevation: ELEVATION.coastalPlain,
      fill: continent.secondaryColor || COLORS.coastalPlain,
      stroke: "",
      centerAlpha: ALPHA.coastalPlain,
      strokeAlpha: 0,
      minVisible: VISIBILITY.landMin + 0.04,
      fullStrength: VISIBILITY.landFull + 0.12,
      minVisibleRatio: 0.58,
      lineWidth: 0
    });
  }

  function drawPressureZone(ctx, payload, continent, zone) {
    const center = projectPoint(payload, zone.lon, zone.lat, ELEVATION.pressure);
    const alpha = depthAlpha(center.z, VISIBILITY.pressureMin, VISIBILITY.landFull + 0.16);

    if (!center.visible || alpha <= 0.03) return;

    const rot = toRad(zone.rot || continent.rotation || 0);
    const pts = [];
    const steps = 18;

    for (let i = 0; i < steps; i += 1) {
      const t = (TAU * i) / steps;
      const noise = 1 + Math.sin(t * 3 + continent.cells) * 0.11 + Math.cos(t * 5) * 0.05;
      const localX = Math.cos(t) * zone.rx * noise;
      const localY = Math.sin(t) * zone.ry * noise;
      const rotated = rotatePoint(localX, localY, rot);
      const p = projectPoint(
        payload,
        normalizeLon(zone.lon + rotated.x),
        clamp(zone.lat + rotated.y, -82, 82),
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
        drawPressureZone(ctx, payload, continent, zone);
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
      className: continent.className,
      cells: continent.cells,
      role: continent.role,
      coastlineNodes: continent.nodes
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
      nineSummits256FibonacciModel: true,
      coastlineNodeExpression: true,
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
        "parent-compliant child surface material",
        "coastline-node landform expression",
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
      mode: "g26_child_obeys_parent_standard_continent_renewal",
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
      nineSummits256FibonacciModel: true,
      coastlineNodeExpression: true,
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
    window.AUDRALIA_CHILD_OBEYS_PARENT_STANDARD_CONTINENTS_RECEIPT = receipt;

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
    window.AUDRALIA_CHILD_OBEYS_PARENT_STANDARD_CONTINENTS_ACTIVE = true;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_DEPRECATED = true;
    window.AUDRALIA_EXPOSED_LAND_CELLS = EXPOSED_LAND_CELLS;
    window.AUDRALIA_OCEAN_SEA_SHELF_CELLS = OCEAN_SEA_SHELF_CELLS;
    window.AUDRALIA_PRIMARY_SUMMIT = "Gratitude";

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
