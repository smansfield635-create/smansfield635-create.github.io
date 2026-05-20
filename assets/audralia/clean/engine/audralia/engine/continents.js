// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1
// Full-file replacement.
// Purpose: fresh Nine Summits / 256 lattice / Fibonacci continent model for Audralia.
// Child engine only. Classic script. No imports. No exports.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, sky, motion, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_TNT_v1";
  const FAMILY = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const DEG = Math.PI / 180;

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

  const SHELF_ELEVATION = -0.018;
  const LAND_ELEVATION = -0.004;
  const RIDGE_ELEVATION = -0.002;
  const SUMMIT_ELEVATION = -0.0015;
  const PRESSURE_KNOT_ELEVATION = -0.003;
  const POLAR_ELEVATION = -0.004;

  const LAND_VISIBLE_MIN = 0.04;
  const LAND_FULL_STRENGTH = 0.38;
  const SHELF_VISIBLE_MIN = 0.16;
  const SHELF_FULL_STRENGTH = 0.52;
  const RIDGE_VISIBLE_MIN = 0.18;
  const SUMMIT_VISIBLE_MIN = 0.25;

  const LAND_CENTER_ALPHA = 0.72;
  const SHELF_CENTER_ALPHA = 0.20;
  const RIDGE_CENTER_ALPHA = 0.32;
  const SUMMIT_CENTER_ALPHA = 0.48;
  const PRESSURE_ALPHA = 0.22;

  const COLORS = {
    gratitude: "rgba(92, 176, 112, 0.70)",
    generosity: "rgba(113, 186, 123, 0.66)",
    dependability: "rgba(76, 150, 106, 0.68)",
    accountability: "rgba(166, 127, 82, 0.60)",
    forgiveness: "rgba(94, 168, 130, 0.62)",
    humility: "rgba(106, 151, 112, 0.58)",
    selfControl: "rgba(149, 132, 82, 0.58)",
    patience: "rgba(104, 160, 138, 0.56)",
    purity: "rgba(224, 244, 250, 0.58)",
    shelf: "rgba(94, 212, 226, 0.20)",
    shelfEdge: "rgba(180, 246, 255, 0.16)",
    ridge: "rgba(232, 214, 156, 0.30)",
    summit: "rgba(255, 239, 184, 0.48)",
    pressure: "rgba(38, 68, 63, 0.22)"
  };

  const CONTINENTS = Object.freeze([
    {
      id: "gratitude-primary",
      summit: "Gratitude",
      className: "primary",
      cells: 21,
      role: "Audralia primary external Summit body",
      lobes: [
        { lon: -42, lat: 8, sx: 28, sy: 32, rot: -16, color: COLORS.gratitude, wobble: 0.11 },
        { lon: -59, lat: -8, sx: 16, sy: 20, rot: 18, color: COLORS.gratitude, wobble: 0.12 },
        { lon: -29, lat: 25, sx: 13, sy: 17, rot: -10, color: COLORS.generosity, wobble: 0.09 }
      ],
      ridges: [
        { a: [-58, 23], b: [-35, -14], bend: 0.2 },
        { a: [-44, 34], b: [-23, 5], bend: -0.16 }
      ],
      summitPoint: { lon: -43, lat: 16 }
    },
    {
      id: "generosity-major",
      summit: "Generosity",
      className: "major",
      cells: 13,
      role: "open fertile major body with broad shelf logic",
      lobes: [
        { lon: 38, lat: 14, sx: 18, sy: 26, rot: 20, color: COLORS.generosity, wobble: 0.1 },
        { lon: 55, lat: 2, sx: 11, sy: 17, rot: -12, color: COLORS.gratitude, wobble: 0.1 }
      ],
      ridges: [
        { a: [31, 29], b: [55, -9], bend: -0.12 }
      ],
      summitPoint: { lon: 42, lat: 20 }
    },
    {
      id: "dependability-major",
      summit: "Dependability",
      className: "major",
      cells: 13,
      role: "stable structural major landmass",
      lobes: [
        { lon: -104, lat: -8, sx: 16, sy: 24, rot: -8, color: COLORS.dependability, wobble: 0.09 },
        { lon: -119, lat: 8, sx: 10, sy: 14, rot: 24, color: COLORS.humility, wobble: 0.08 }
      ],
      ridges: [
        { a: [-116, 11], b: [-97, -21], bend: 0.14 }
      ],
      summitPoint: { lon: -106, lat: -2 }
    },
    {
      id: "accountability-major",
      summit: "Accountability",
      className: "major",
      cells: 13,
      role: "angular pressure-bearing major continent",
      lobes: [
        { lon: 112, lat: -4, sx: 17, sy: 22, rot: 26, color: COLORS.accountability, wobble: 0.12 },
        { lon: 129, lat: 8, sx: 10, sy: 13, rot: -20, color: COLORS.selfControl, wobble: 0.1 }
      ],
      ridges: [
        { a: [102, 15], b: [128, -17], bend: -0.16 }
      ],
      summitPoint: { lon: 116, lat: 2 }
    },
    {
      id: "forgiveness-secondary",
      summit: "Forgiveness",
      className: "secondary",
      cells: 8,
      role: "broken-but-restored coast and bay logic",
      lobes: [
        { lon: -6, lat: -38, sx: 14, sy: 13, rot: -10, color: COLORS.forgiveness, wobble: 0.15 },
        { lon: 13, lat: -43, sx: 8, sy: 7, rot: 18, color: COLORS.generosity, wobble: 0.13 }
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
      lobes: [
        { lon: 2, lat: 44, sx: 18, sy: 12, rot: 4, color: COLORS.humility, wobble: 0.08 },
        { lon: -18, lat: 49, sx: 8, sy: 7, rot: -14, color: COLORS.dependability, wobble: 0.07 }
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
      lobes: [
        { lon: 158, lat: 21, sx: 8, sy: 8, rot: 16, color: COLORS.selfControl, wobble: 0.11 },
        { lon: 169, lat: 15, sx: 5, sy: 5, rot: -10, color: COLORS.accountability, wobble: 0.1 }
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
      lobes: [
        { lon: -154, lat: 24, sx: 7, sy: 5, rot: 24, color: COLORS.patience, wobble: 0.12 },
        { lon: -141, lat: 18, sx: 6, sy: 5, rot: -14, color: COLORS.patience, wobble: 0.1 },
        { lon: -129, lat: 12, sx: 4, sy: 4, rot: 12, color: COLORS.forgiveness, wobble: 0.1 }
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
      lobes: [
        { lon: 24, lat: 72, sx: 17, sy: 7, rot: 5, color: COLORS.purity, wobble: 0.05 },
        { lon: -12, lat: 76, sx: 10, sy: 5, rot: -9, color: COLORS.purity, wobble: 0.04 }
      ],
      ridges: [
        { a: [-8, 75], b: [31, 71], bend: -0.03 }
      ],
      summitPoint: { lon: 20, lat: 73 }
    }
  ]);

  const state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
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
    visualPassClaim: false,
    errors: []
  };

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

  function projectPoint(payload, lonDeg, latDeg, elevation = LAND_ELEVATION) {
    return payload.project(toRad(lonDeg), toRad(latDeg), elevation);
  }

  function projectedEllipse(payload, lobe, scale = 1, elevation = LAND_ELEVATION, steps = 48) {
    const pts = [];
    const rot = toRad(lobe.rot || 0);
    const cx = lobe.lon;
    const cy = lobe.lat;
    const sx = lobe.sx * scale;
    const sy = lobe.sy * scale;
    const wobble = lobe.wobble || 0.08;

    for (let i = 0; i < steps; i += 1) {
      const t = (Math.PI * 2 * i) / steps;

      const n =
        1 +
        Math.sin(t * 3 + cx * 0.07) * wobble +
        Math.cos(t * 5 + cy * 0.09) * wobble * 0.52 +
        Math.sin(t * 8) * wobble * 0.18;

      const ex = Math.cos(t) * sx * n;
      const ey = Math.sin(t) * sy * n;

      const lon = cx + ex * Math.cos(rot) - ey * Math.sin(rot);
      const lat = clamp(cy + ex * Math.sin(rot) + ey * Math.cos(rot), -82, 82);
      const p = projectPoint(payload, lon, lat, elevation);

      pts.push({ ...p, lon, lat });
    }

    return pts;
  }

  function drawProjectedLobe(ctx, payload, lobe, options = {}) {
    const elevation = options.elevation ?? LAND_ELEVATION;
    const centerElevation = options.centerElevation ?? elevation;
    const scale = options.scale || 1;
    const fill = options.fill || lobe.color || COLORS.gratitude;
    const stroke = options.stroke || "rgba(226, 246, 230, 0.14)";
    const centerAlpha = options.centerAlpha ?? LAND_CENTER_ALPHA;
    const strokeAlpha = options.strokeAlpha ?? 0.18;
    const minVisible = options.minVisible ?? LAND_VISIBLE_MIN;
    const fullStrength = options.fullStrength ?? LAND_FULL_STRENGTH;
    const minVisibleRatio = options.minVisibleRatio ?? 0.72;
    const lineWidth = options.lineWidth || Math.max(1, payload.geometry.radius * 0.0035);

    const center = projectPoint(payload, lobe.lon, lobe.lat, centerElevation);
    const alpha = depthAlpha(center.z, minVisible, fullStrength);

    if (!center.visible || alpha <= 0.02) return false;

    const pts = projectedEllipse(payload, lobe, scale, elevation);
    const visiblePts = pts.filter((p) => p.visible && p.z > -0.08);

    if (visiblePts.length / pts.length < minVisibleRatio) return false;

    ctx.save();

    ctx.beginPath();

    pts.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.closePath();
    ctx.fillStyle = withAlpha(fill, alpha, centerAlpha);
    ctx.fill();

    if (lineWidth > 0 && alpha > 0.12) {
      ctx.strokeStyle = withAlpha(stroke, alpha * 0.75, strokeAlpha);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    ctx.restore();

    return true;
  }

  function drawShelf(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedLobe(ctx, payload, lobe, {
        scale: 1.18,
        elevation: SHELF_ELEVATION,
        centerElevation: SHELF_ELEVATION,
        fill: COLORS.shelf,
        stroke: COLORS.shelfEdge,
        centerAlpha: SHELF_CENTER_ALPHA,
        strokeAlpha: 0.12,
        minVisible: SHELF_VISIBLE_MIN,
        fullStrength: SHELF_FULL_STRENGTH,
        minVisibleRatio: 0.84,
        lineWidth: Math.max(1, payload.geometry.radius * 0.0022)
      });
    }
  }

  function drawLand(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedLobe(ctx, payload, lobe, {
        scale: 1,
        elevation: continent.summit === "Purity" ? POLAR_ELEVATION : LAND_ELEVATION,
        fill: lobe.color,
        stroke: "rgba(235, 250, 235, 0.18)",
        centerAlpha: LAND_CENTER_ALPHA,
        strokeAlpha: 0.18,
        minVisible: LAND_VISIBLE_MIN,
        fullStrength: LAND_FULL_STRENGTH,
        minVisibleRatio: 0.68,
        lineWidth: Math.max(1, payload.geometry.radius * 0.0032)
      });

      drawProjectedLobe(
        ctx,
        payload,
        {
          ...lobe,
          sx: lobe.sx * 0.42,
          sy: lobe.sy * 0.34,
          color: COLORS.pressure
        },
        {
          scale: 1,
          elevation: PRESSURE_KNOT_ELEVATION,
          fill: COLORS.pressure,
          stroke: "rgba(255,255,255,0)",
          centerAlpha: PRESSURE_ALPHA,
          strokeAlpha: 0,
          minVisible: LAND_VISIBLE_MIN + 0.1,
          fullStrength: LAND_FULL_STRENGTH + 0.12,
          minVisibleRatio: 0.78,
          lineWidth: 0
        }
      );
    }
  }

  function drawRidge(ctx, payload, ridge) {
    const [aLon, aLat] = ridge.a;
    const [bLon, bLat] = ridge.b;
    const bend = ridge.bend || 0;
    const mid = projectPoint(payload, (aLon + bLon) / 2, (aLat + bLat) / 2, RIDGE_ELEVATION);
    const alpha = depthAlpha(mid.z, RIDGE_VISIBLE_MIN, 0.58);

    if (!mid.visible || alpha <= 0.04) return;

    const pts = [];

    for (let i = 0; i <= 24; i += 1) {
      const k = i / 24;
      const lon = aLon + (bLon - aLon) * k + Math.sin(k * Math.PI) * bend * 18;
      const lat = aLat + (bLat - aLat) * k + Math.sin(k * Math.PI) * bend * 8;
      const p = projectPoint(payload, lon, lat, RIDGE_ELEVATION);

      if (!p.visible || p.z <= RIDGE_VISIBLE_MIN - 0.06) return;
      pts.push(p);
    }

    ctx.save();
    ctx.beginPath();

    pts.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = withAlpha(COLORS.ridge, alpha, RIDGE_CENTER_ALPHA);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0048);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.restore();
  }

  function drawSummit(ctx, payload, continent) {
    const p = projectPoint(payload, continent.summitPoint.lon, continent.summitPoint.lat, SUMMIT_ELEVATION);
    const alpha = depthAlpha(p.z, SUMMIT_VISIBLE_MIN, 0.66);

    if (!p.visible || alpha <= 0.05) return;

    const scaleByClass =
      continent.className === "primary"
        ? 1.18
        : continent.className === "major"
          ? 1
          : continent.className === "secondary"
            ? 0.84
            : 0.72;

    const r = Math.max(1.1, payload.geometry.radius * 0.009 * scaleByClass) * (0.76 + p.scale * 0.28);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha("rgba(255, 232, 158, 0.065)", alpha, 0.07);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(COLORS.summit, alpha, SUMMIT_CENTER_ALPHA);
    ctx.fill();

    ctx.restore();
  }

  function drawContinentBody(ctx, payload, continent) {
    drawShelf(ctx, payload, continent);
    drawLand(ctx, payload, continent);

    for (const ridge of continent.ridges || []) {
      drawRidge(ctx, payload, ridge);
    }

    drawSummit(ctx, payload, continent);
  }

  function clipToSphere(ctx, geometry) {
    ctx.beginPath();
    ctx.arc(geometry.cx, geometry.cy, geometry.radius * 0.994, 0, Math.PI * 2);
    ctx.clip();
  }

  function draw(ctx, payload) {
    if (!validPayload(ctx, payload)) return api;

    state.drawCount += 1;

    ctx.save();
    clipToSphere(ctx, payload.geometry);
    ctx.globalCompositeOperation = "source-over";

    for (const continent of CONTINENTS) {
      drawShelf(ctx, payload, continent);
    }

    for (const continent of CONTINENTS) {
      drawLand(ctx, payload, continent);
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

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
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
      fibonacciDistribution: CONTINENTS.map((continent) => ({
        id: continent.id,
        summit: continent.summit,
        className: continent.className,
        cells: continent.cells,
        role: continent.role
      })),
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
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_nine_summits_256_fibonacci_continent_baseline",
      scope,
      active: true,
      classicScript: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
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
      distribution: CONTINENTS.map((continent) => ({
        id: continent.id,
        summit: continent.summit,
        className: continent.className,
        cells: continent.cells
      })),
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
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_DEPRECATED = true;
    window.AUDRALIA_EXPOSED_LAND_CELLS = EXPOSED_LAND_CELLS;
    window.AUDRALIA_OCEAN_SEA_SHELF_CELLS = OCEAN_SEA_SHELF_CELLS;
    window.AUDRALIA_PRIMARY_SUMMIT = "Gratitude";

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
