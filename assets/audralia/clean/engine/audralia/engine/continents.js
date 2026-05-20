// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_NINE_SUMMITS_CONTINENT_EXPRESSION_REFINEMENT_TNT_v1
// Full-file replacement.
// Purpose: refine Audralia's Nine Summits / 256 lattice / Fibonacci continent expression from oval lobes into coastline-node landforms.
// Child engine only. Classic script. No imports. No exports.
// Bridge compatibility: receipt.contract remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 because the locked route bridge validates that contract.
// Active expression contract is exposed separately as expressionContract.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, sky, motion, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const EXPRESSION_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_CONTINENT_EXPRESSION_REFINEMENT_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
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
    shelfOuter: -0.026,
    shelfInner: -0.018,
    land: -0.004,
    pressure: -0.003,
    ridge: -0.002,
    summit: -0.0015,
    polar: -0.004
  });

  const VISIBILITY = Object.freeze({
    landMin: 0.035,
    landFull: 0.38,
    shelfMin: 0.12,
    shelfFull: 0.52,
    ridgeMin: 0.16,
    summitMin: 0.24
  });

  const ALPHA = Object.freeze({
    land: 0.72,
    shelfOuter: 0.12,
    shelfInner: 0.22,
    coastStroke: 0.19,
    pressure: 0.22,
    ridge: 0.32,
    summit: 0.48
  });

  const COLORS = Object.freeze({
    gratitude: "rgba(82, 172, 108, 0.72)",
    generosity: "rgba(104, 184, 123, 0.68)",
    dependability: "rgba(69, 146, 108, 0.70)",
    accountability: "rgba(162, 127, 83, 0.62)",
    forgiveness: "rgba(85, 162, 132, 0.64)",
    humility: "rgba(99, 146, 111, 0.60)",
    selfControl: "rgba(145, 132, 84, 0.60)",
    patience: "rgba(98, 157, 140, 0.58)",
    purity: "rgba(224, 244, 250, 0.60)",
    shelfOuter: "rgba(99, 216, 230, 0.12)",
    shelfInner: "rgba(103, 215, 226, 0.22)",
    shelfEdge: "rgba(184, 246, 255, 0.15)",
    coastStroke: "rgba(235, 250, 236, 0.18)",
    ridge: "rgba(232, 214, 156, 0.30)",
    summit: "rgba(255, 239, 184, 0.48)",
    pressure: "rgba(31, 72, 62, 0.22)",
    shadow: "rgba(0, 15, 28, 0.16)"
  });

  const CONTINENTS = Object.freeze([
    {
      id: "gratitude-primary",
      summit: "Gratitude",
      className: "primary",
      cells: 21,
      role: "Audralia primary external Summit body",
      color: COLORS.gratitude,
      center: { lon: -42, lat: 8 },
      radius: { lon: 31, lat: 34 },
      rotation: -14,
      nodes: 34,
      jag: 0.22,
      bay: 0.17,
      shelf: 1.16,
      anchors: [
        { lon: -70, lat: 22, pull: 0.18 },
        { lon: -55, lat: -18, pull: -0.10 },
        { lon: -26, lat: 31, pull: 0.14 },
        { lon: -16, lat: -2, pull: -0.12 }
      ],
      pressureZones: [
        { lon: -53, lat: -9, sx: 0.32, sy: 0.26, rot: 22 },
        { lon: -39, lat: 21, sx: 0.26, sy: 0.22, rot: -12 }
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
      center: { lon: 42, lat: 12 },
      radius: { lon: 23, lat: 27 },
      rotation: 18,
      nodes: 29,
      jag: 0.2,
      bay: 0.13,
      shelf: 1.15,
      anchors: [
        { lon: 25, lat: 31, pull: 0.12 },
        { lon: 62, lat: 22, pull: -0.08 },
        { lon: 55, lat: -13, pull: 0.13 },
        { lon: 30, lat: -7, pull: -0.1 }
      ],
      pressureZones: [
        { lon: 39, lat: 18, sx: 0.3, sy: 0.22, rot: 8 },
        { lon: 55, lat: 0, sx: 0.2, sy: 0.22, rot: -18 }
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
      center: { lon: -105, lat: -5 },
      radius: { lon: 22, lat: 27 },
      rotation: -8,
      nodes: 29,
      jag: 0.17,
      bay: 0.1,
      shelf: 1.12,
      anchors: [
        { lon: -123, lat: 10, pull: 0.1 },
        { lon: -92, lat: 18, pull: -0.08 },
        { lon: -97, lat: -25, pull: 0.13 },
        { lon: -120, lat: -10, pull: -0.09 }
      ],
      pressureZones: [
        { lon: -106, lat: -2, sx: 0.28, sy: 0.3, rot: -10 },
        { lon: -116, lat: 9, sx: 0.18, sy: 0.18, rot: 18 }
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
      center: { lon: 115, lat: -3 },
      radius: { lon: 23, lat: 24 },
      rotation: 24,
      nodes: 28,
      jag: 0.24,
      bay: 0.14,
      shelf: 1.13,
      anchors: [
        { lon: 101, lat: 16, pull: 0.12 },
        { lon: 134, lat: 11, pull: 0.08 },
        { lon: 126, lat: -20, pull: -0.1 },
        { lon: 101, lat: -12, pull: 0.13 }
      ],
      pressureZones: [
        { lon: 116, lat: 2, sx: 0.3, sy: 0.24, rot: 24 },
        { lon: 129, lat: 7, sx: 0.16, sy: 0.18, rot: -18 }
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
      center: { lon: -5, lat: -39 },
      radius: { lon: 19, lat: 15 },
      rotation: -9,
      nodes: 24,
      jag: 0.25,
      bay: 0.19,
      shelf: 1.18,
      anchors: [
        { lon: -20, lat: -34, pull: 0.09 },
        { lon: 14, lat: -44, pull: 0.13 },
        { lon: 3, lat: -29, pull: -0.1 },
        { lon: -12, lat: -50, pull: 0.08 }
      ],
      pressureZones: [
        { lon: -7, lat: -36, sx: 0.28, sy: 0.2, rot: -5 }
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
      center: { lon: 2, lat: 45 },
      radius: { lon: 23, lat: 12 },
      rotation: 4,
      nodes: 24,
      jag: 0.14,
      bay: 0.09,
      shelf: 1.1,
      anchors: [
        { lon: -20, lat: 49, pull: 0.08 },
        { lon: 24, lat: 43, pull: 0.1 },
        { lon: 7, lat: 53, pull: -0.08 },
        { lon: -5, lat: 38, pull: 0.06 }
      ],
      pressureZones: [
        { lon: 4, lat: 45, sx: 0.32, sy: 0.16, rot: 3 }
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
      center: { lon: 160, lat: 20 },
      radius: { lon: 12, lat: 10 },
      rotation: 16,
      nodes: 18,
      jag: 0.19,
      bay: 0.1,
      shelf: 1.14,
      anchors: [
        { lon: 151, lat: 24, pull: 0.08 },
        { lon: 170, lat: 14, pull: 0.08 },
        { lon: 162, lat: 29, pull: -0.07 }
      ],
      pressureZones: [
        { lon: 159, lat: 21, sx: 0.28, sy: 0.22, rot: 14 }
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
      center: { lon: -142, lat: 18 },
      radius: { lon: 20, lat: 8 },
      rotation: -24,
      nodes: 21,
      jag: 0.22,
      bay: 0.13,
      shelf: 1.16,
      anchors: [
        { lon: -157, lat: 25, pull: 0.09 },
        { lon: -128, lat: 12, pull: 0.1 },
        { lon: -142, lat: 22, pull: -0.07 }
      ],
      pressureZones: [
        { lon: -144, lat: 18, sx: 0.28, sy: 0.16, rot: -20 }
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
      center: { lon: 18, lat: 73 },
      radius: { lon: 29, lat: 7 },
      rotation: 4,
      nodes: 22,
      jag: 0.09,
      bay: 0.05,
      shelf: 1.08,
      anchors: [
        { lon: -12, lat: 76, pull: 0.08 },
        { lon: 35, lat: 71, pull: 0.08 },
        { lon: 18, lat: 78, pull: -0.06 }
      ],
      pressureZones: [
        { lon: 20, lat: 73, sx: 0.3, sy: 0.12, rot: 4 }
      ],
      ridges: [
        { a: [-8, 75], b: [31, 71], bend: -0.03 }
      ],
      summitPoint: { lon: 20, lat: 73 }
    }
  ]);

  const state = {
    contract: CONTRACT,
    expressionContract: EXPRESSION_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    nineSummits256FibonacciModel: true,
    coastlineNodeExpression: true,
    ovalLobesDemotedToScaffolding: true,
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

  function validPayload(ctx, payload) {
    return Boolean(
      ctx &&
        payload &&
        payload.geometry &&
        payload.project &&
        typeof payload.project === "function" &&
        Number.isFinite(payload.geometry.cx) &&
        Number.isFinite(payload.geometry.cy) &&
        Number.isFinite(payload.geometry.radius)
    );
  }

  function projectPoint(payload, lonDeg, latDeg, elevation = ELEVATION.land) {
    return payload.project(toRad(lonDeg), toRad(latDeg), elevation);
  }

  function hashNumber(seed, index) {
    const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }

  function rotatePoint(x, y, angleRad) {
    return {
      x: x * Math.cos(angleRad) - y * Math.sin(angleRad),
      y: x * Math.sin(angleRad) + y * Math.cos(angleRad)
    };
  }

  function normalizeLon(lon) {
    let value = lon;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
  }

  function anchorPull(continent, lon, lat, index) {
    let pull = 0;

    for (const anchor of continent.anchors || []) {
      const dLon = Math.abs(normalizeLon(lon - anchor.lon));
      const dLat = Math.abs(lat - anchor.lat);
      const dist = Math.sqrt(dLon * dLon + dLat * dLat);
      const influence = Math.max(0, 1 - dist / 42);
      pull += influence * (anchor.pull || 0);
    }

    pull += (hashNumber(continent.cells + continent.nodes, index) - 0.5) * continent.jag;
    pull += Math.sin(index * 1.618 + continent.cells) * continent.jag * 0.28;
    pull -= Math.max(0, Math.sin(index * 2.0 + continent.cells * 0.3)) * continent.bay * 0.42;

    return clamp(1 + pull, 0.62, 1.34);
  }

  function buildCoastline(continent, scale = 1, mode = "land") {
    const cacheKey = `${continent.id}:${scale}:${mode}`;
    if (coastlineCache.has(cacheKey)) return coastlineCache.get(cacheKey);

    const nodes = [];
    const count = continent.nodes || 24;
    const rot = toRad(continent.rotation || 0);
    const seed = continent.cells * 31 + continent.center.lon * 0.17 + continent.center.lat * 0.19;

    for (let i = 0; i < count; i += 1) {
      const t = (TAU * i) / count;

      const baseX = Math.cos(t);
      const baseY = Math.sin(t);

      const directionalVariance =
        1 +
        Math.sin(t * 3 + seed) * continent.jag * 0.36 +
        Math.cos(t * 5 + seed * 0.7) * continent.jag * 0.24 +
        Math.sin(t * 8 + seed * 0.13) * continent.jag * 0.11;

      const localX = baseX * continent.radius.lon * scale * directionalVariance;
      const localY = baseY * continent.radius.lat * scale * directionalVariance;

      const rotated = rotatePoint(localX, localY, rot);

      let lon = continent.center.lon + rotated.x;
      let lat = continent.center.lat + rotated.y;

      const pull = anchorPull(continent, lon, lat, i);

      lon = continent.center.lon + (lon - continent.center.lon) * pull;
      lat = continent.center.lat + (lat - continent.center.lat) * pull;

      if (mode === "shelf-outer") {
        lon = continent.center.lon + (lon - continent.center.lon) * 1.08;
        lat = continent.center.lat + (lat - continent.center.lat) * 1.08;
      }

      if (mode === "shelf-inner") {
        lon = continent.center.lon + (lon - continent.center.lon) * 1.035;
        lat = continent.center.lat + (lat - continent.center.lat) * 1.035;
      }

      nodes.push({
        lon: normalizeLon(lon),
        lat: clamp(lat, -82, 82)
      });
    }

    coastlineCache.set(cacheKey, nodes);
    return nodes;
  }

  function projectedCoastline(payload, continent, scale, elevation, mode) {
    const nodes = buildCoastline(continent, scale, mode);
    return nodes.map((node) => ({
      ...projectPoint(payload, node.lon, node.lat, elevation),
      lon: node.lon,
      lat: node.lat
    }));
  }

  function drawPathFromProjected(ctx, pts) {
    if (!pts.length) return;

    ctx.beginPath();

    pts.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.closePath();
  }

  function projectedCenter(payload, continent, elevation = ELEVATION.land) {
    return projectPoint(payload, continent.center.lon, continent.center.lat, elevation);
  }

  function drawCoastShape(ctx, payload, continent, options) {
    const center = projectedCenter(payload, continent, options.centerElevation ?? options.elevation);
    const alpha = depthAlpha(center.z, options.minVisible, options.fullStrength);

    if (!center.visible || alpha <= 0.02) return false;

    const pts = projectedCoastline(payload, continent, options.scale, options.elevation, options.mode);
    const visiblePts = pts.filter((p) => p.visible && p.z > -0.08);

    if (visiblePts.length / pts.length < options.minVisibleRatio) return false;

    ctx.save();

    drawPathFromProjected(ctx, pts);
    ctx.fillStyle = withAlpha(options.fill, alpha, options.centerAlpha);
    ctx.fill();

    if (options.stroke && options.lineWidth > 0 && alpha > 0.08) {
      ctx.strokeStyle = withAlpha(options.stroke, alpha * 0.78, options.strokeAlpha);
      ctx.lineWidth = options.lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();

    return true;
  }

  function drawShelves(ctx, payload, continent) {
    drawCoastShape(ctx, payload, continent, {
      mode: "shelf-outer",
      scale: continent.shelf || 1.14,
      elevation: ELEVATION.shelfOuter,
      centerElevation: ELEVATION.shelfOuter,
      fill: COLORS.shelfOuter,
      stroke: COLORS.shelfEdge,
      centerAlpha: ALPHA.shelfOuter,
      strokeAlpha: 0.1,
      minVisible: VISIBILITY.shelfMin,
      fullStrength: VISIBILITY.shelfFull,
      minVisibleRatio: 0.78,
      lineWidth: Math.max(1, payload.geometry.radius * 0.002)
    });

    drawCoastShape(ctx, payload, continent, {
      mode: "shelf-inner",
      scale: (continent.shelf || 1.14) * 0.98,
      elevation: ELEVATION.shelfInner,
      centerElevation: ELEVATION.shelfInner,
      fill: COLORS.shelfInner,
      stroke: COLORS.shelfEdge,
      centerAlpha: ALPHA.shelfInner,
      strokeAlpha: 0.12,
      minVisible: VISIBILITY.shelfMin,
      fullStrength: VISIBILITY.shelfFull,
      minVisibleRatio: 0.76,
      lineWidth: Math.max(1, payload.geometry.radius * 0.0022)
    });
  }

  function drawLand(ctx, payload, continent) {
    return drawCoastShape(ctx, payload, continent, {
      mode: "land",
      scale: 1,
      elevation: continent.summit === "Purity" ? ELEVATION.polar : ELEVATION.land,
      centerElevation: continent.summit === "Purity" ? ELEVATION.polar : ELEVATION.land,
      fill: continent.color,
      stroke: COLORS.coastStroke,
      centerAlpha: ALPHA.land,
      strokeAlpha: ALPHA.coastStroke,
      minVisible: VISIBILITY.landMin,
      fullStrength: VISIBILITY.landFull,
      minVisibleRatio: 0.58,
      lineWidth: Math.max(1, payload.geometry.radius * 0.003)
    });
  }

  function drawPressureZone(ctx, payload, continent, zone) {
    const center = projectPoint(payload, zone.lon, zone.lat, ELEVATION.pressure);
    const alpha = depthAlpha(center.z, VISIBILITY.landMin + 0.1, VISIBILITY.landFull + 0.16);

    if (!center.visible || alpha <= 0.03) return;

    const rot = toRad(zone.rot || continent.rotation || 0);
    const pts = [];
    const steps = 18;

    for (let i = 0; i < steps; i += 1) {
      const t = (TAU * i) / steps;
      const noise = 1 + Math.sin(t * 3 + continent.cells) * 0.12 + Math.cos(t * 5) * 0.06;
      const localX = Math.cos(t) * continent.radius.lon * zone.sx * noise;
      const localY = Math.sin(t) * continent.radius.lat * zone.sy * noise;
      const rotated = rotatePoint(localX, localY, rot);
      const p = projectPoint(
        payload,
        normalizeLon(zone.lon + rotated.x),
        clamp(zone.lat + rotated.y, -82, 82),
        ELEVATION.pressure
      );

      if (!p.visible || p.z < VISIBILITY.landMin) return;
      pts.push(p);
    }

    ctx.save();
    drawPathFromProjected(ctx, pts);
    ctx.fillStyle = withAlpha(COLORS.pressure, alpha, ALPHA.pressure);
    ctx.fill();
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

    pts.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = withAlpha(COLORS.ridge, alpha, ALPHA.ridge);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0042);
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

    const r = Math.max(1.1, payload.geometry.radius * 0.0078 * scaleByClass) * (0.76 + p.scale * 0.26);

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

  function clipToSphere(ctx, geometry) {
    ctx.beginPath();
    ctx.arc(geometry.cx, geometry.cy, geometry.radius * 0.994, 0, TAU);
    ctx.clip();
  }

  function draw(ctx, payload) {
    if (!validPayload(ctx, payload)) return api;

    state.drawCount += 1;

    ctx.save();
    clipToSphere(ctx, payload.geometry);
    ctx.globalCompositeOperation = "source-over";

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

    ctx.restore();

    publishReceipt("draw");

    return api;
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
      expressionContract: EXPRESSION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
      nineSummits256FibonacciModel: true,
      coastlineNodeExpression: true,
      ovalLobesDemotedToScaffolding: true,
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
      owns: [
        "Nine Summits continent model",
        "89 of 256 exposed-land budget",
        "167 of 256 ocean/shelf/sea budget",
        "Fibonacci land distribution",
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
        "cloud layer"
      ],
      visualPassClaim: false,
      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      expressionContract: EXPRESSION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_nine_summits_continent_expression_refinement",
      scope,
      active: true,
      classicScript: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      nineSummits256FibonacciModel: true,
      coastlineNodeExpression: true,
      ovalLobesDemotedToScaffolding: true,
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
    EXPRESSION_CONTRACT,
    PREVIOUS_CONTRACT,
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
    window.AUDRALIA_NINE_SUMMITS_CONTINENT_EXPRESSION_REFINEMENT_ACTIVE = true;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_DEPRECATED = true;
    window.AUDRALIA_EXPOSED_LAND_CELLS = EXPOSED_LAND_CELLS;
    window.AUDRALIA_OCEAN_SEA_SHELF_CELLS = OCEAN_SEA_SHELF_CELLS;
    window.AUDRALIA_PRIMARY_SUMMIT = "Gratitude";

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
