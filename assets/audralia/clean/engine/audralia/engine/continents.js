// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_TNT_v1
// Full-file replacement.
// Purpose: preserve Audralia's sea-level five-continent expression while adding limb occlusion, depth fade, and 4K surface compositing.
// Child engine only. Classic script. No imports. No exports.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, sky, motion, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_EXPRESSION_ENGINE_TNT_v1";
  const FAMILY = "AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_TNT_v1";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const DEG = Math.PI / 180;

  const SHELF_ELEVATION = -0.018;
  const LAND_ELEVATION = -0.004;
  const RIDGE_ELEVATION = -0.002;
  const SUMMIT_ELEVATION = -0.001;
  const ICE_ELEVATION = -0.003;
  const PRESSURE_KNOT_ELEVATION = -0.003;

  const LIMB_VISIBLE_MIN = 0.08;
  const LIMB_FADE_START = 0.18;
  const LIMB_FULL_STRENGTH = 0.42;

  const SHELF_LIMB_VISIBLE_MIN = 0.18;
  const SHELF_LIMB_FADE_START = 0.30;
  const SHELF_FULL_STRENGTH = 0.52;

  const RIDGE_LIMB_VISIBLE_MIN = 0.22;
  const RIDGE_LIMB_FADE_START = 0.34;
  const RIDGE_FULL_STRENGTH = 0.56;

  const SUMMIT_LIMB_VISIBLE_MIN = 0.28;
  const SUMMIT_LIMB_FADE_START = 0.40;
  const SUMMIT_FULL_STRENGTH = 0.62;

  const EDGE_ALPHA_FLOOR = 0.0;
  const LAND_CENTER_ALPHA = 0.72;
  const SHELF_CENTER_ALPHA = 0.22;
  const RIDGE_CENTER_ALPHA = 0.34;
  const SUMMIT_CENTER_ALPHA = 0.55;
  const ICE_CENTER_ALPHA = 0.62;

  const COLORS = {
    shelf: "rgba(91, 210, 224, 0.20)",
    shelfLine: "rgba(178, 246, 255, 0.20)",
    lowland: "rgba(74, 150, 98, 0.66)",
    green: "rgba(93, 171, 109, 0.68)",
    highland: "rgba(162, 129, 79, 0.56)",
    dryHighland: "rgba(185, 145, 86, 0.52)",
    ridge: "rgba(238, 219, 158, 0.30)",
    summit: "rgba(255, 238, 178, 0.52)",
    darkKnot: "rgba(39, 67, 62, 0.24)",
    polarLand: "rgba(125, 179, 138, 0.50)",
    ice: "rgba(232, 249, 255, 0.64)",
    iceSoft: "rgba(203, 236, 248, 0.28)"
  };

  const CONTINENTS = [
    {
      id: "auralis-main",
      name: "Auralis Main",
      role: "western-large highland continent",
      lobes: [
        { lon: -62, lat: 8, sx: 26, sy: 36, rot: -18, color: COLORS.green, wobble: 0.12 },
        { lon: -78, lat: -4, sx: 16, sy: 24, rot: 18, color: COLORS.lowland, wobble: 0.13 },
        { lon: -49, lat: 27, sx: 14, sy: 20, rot: -8, color: COLORS.highland, wobble: 0.1 }
      ],
      ridges: [
        { a: [-72, 20], b: [-52, -12], bend: 0.24 },
        { a: [-58, 33], b: [-39, 7], bend: -0.18 }
      ],
      summits: [
        { lon: -64, lat: 22, rank: 1 },
        { lon: -49, lat: 8, rank: 2 },
        { lon: -76, lat: -11, rank: 3 }
      ]
    },
    {
      id: "veyra-shelf",
      name: "Veyra Shelf",
      role: "eastern medium continent with broad shelves",
      lobes: [
        { lon: 44, lat: 13, sx: 18, sy: 31, rot: 22, color: COLORS.lowland, wobble: 0.11 },
        { lon: 61, lat: 3, sx: 13, sy: 22, rot: -11, color: COLORS.highland, wobble: 0.13 },
        { lon: 34, lat: -8, sx: 10, sy: 18, rot: 34, color: COLORS.green, wobble: 0.1 }
      ],
      ridges: [
        { a: [38, 28], b: [61, -11], bend: -0.16 },
        { a: [51, 20], b: [67, 5], bend: 0.12 }
      ],
      summits: [
        { lon: 47, lat: 22, rank: 4 },
        { lon: 63, lat: 1, rank: 5 }
      ]
    },
    {
      id: "caldrin-reach",
      name: "Caldrin Reach",
      role: "southern broken continent and archipelago edge",
      lobes: [
        { lon: -8, lat: -34, sx: 18, sy: 15, rot: -9, color: COLORS.dryHighland, wobble: 0.16 },
        { lon: 13, lat: -39, sx: 12, sy: 10, rot: 20, color: COLORS.highland, wobble: 0.14 },
        { lon: -28, lat: -43, sx: 10, sy: 8, rot: -25, color: COLORS.green, wobble: 0.16 }
      ],
      ridges: [
        { a: [-28, -37], b: [14, -43], bend: 0.12 }
      ],
      summits: [
        { lon: -8, lat: -32, rank: 6 },
        { lon: 18, lat: -39, rank: 7 }
      ]
    },
    {
      id: "marrowen-belt",
      name: "Marrowen Belt",
      role: "equatorial fractured continent chain",
      lobes: [
        { lon: 125, lat: -2, sx: 11, sy: 10, rot: 18, color: COLORS.green, wobble: 0.16 },
        { lon: 143, lat: 5, sx: 9, sy: 8, rot: -12, color: COLORS.highland, wobble: 0.14 },
        { lon: 158, lat: -6, sx: 7, sy: 7, rot: 28, color: COLORS.lowland, wobble: 0.14 }
      ],
      ridges: [
        { a: [120, -3], b: [160, -4], bend: 0.1 }
      ],
      summits: [
        { lon: 143, lat: 5, rank: 8 }
      ]
    },
    {
      id: "north-polar-crown",
      name: "North Polar Crown",
      role: "fifth exposed north polar continent",
      lobes: [
        { lon: 12, lat: 67, sx: 36, sy: 14, rot: 4, color: COLORS.polarLand, wobble: 0.11 },
        { lon: -28, lat: 72, sx: 18, sy: 10, rot: -16, color: COLORS.iceSoft, wobble: 0.08 },
        { lon: 52, lat: 70, sx: 16, sy: 9, rot: 16, color: COLORS.highland, wobble: 0.08 }
      ],
      ridges: [
        { a: [-22, 70], b: [54, 68], bend: -0.1 }
      ],
      summits: [
        { lon: 15, lat: 68, rank: 9 }
      ]
    }
  ];

  const state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    limbOcclusion4kSurface: true,
    seaLevelContinents: true,
    shelfElevation: SHELF_ELEVATION,
    landElevation: LAND_ELEVATION,
    ridgeElevation: RIDGE_ELEVATION,
    summitElevation: SUMMIT_ELEVATION,
    iceElevation: ICE_ELEVATION,
    limbVisibleMin: LIMB_VISIBLE_MIN,
    limbFadeStart: LIMB_FADE_START,
    limbFullStrength: LIMB_FULL_STRENGTH,
    active: true,
    classicScript: true,
    globalPublished: false,
    mountCalled: false,
    drawCount: 0,
    fiveContinentLaw: true,
    oceanDominant: true,
    southPoleIceOnly: true,
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

  function depthFade(z, visibleMin, fadeStart, fullStrength) {
    if (!Number.isFinite(z) || z <= visibleMin) return EDGE_ALPHA_FLOOR;
    if (z >= fullStrength) return 1;

    if (z < fadeStart) {
      const early = (z - visibleMin) / Math.max(0.0001, fadeStart - visibleMin);
      return clamp(early * 0.26, EDGE_ALPHA_FLOOR, 0.26);
    }

    const later = (z - fadeStart) / Math.max(0.0001, fullStrength - fadeStart);
    return clamp(0.26 + later * 0.74, EDGE_ALPHA_FLOOR, 1);
  }

  function parseRgba(color) {
    const match = String(color || "").match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);

    if (!match) {
      return { r: 255, g: 255, b: 255, a: 1 };
    }

    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4])
    };
  }

  function withAlpha(color, alphaMultiplier = 1, centerAlpha = 1) {
    const rgba = parseRgba(color);
    const alpha = clamp(Math.min(rgba.a, centerAlpha) * alphaMultiplier, 0, centerAlpha);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
  }

  function averageDepth(points) {
    if (!points || points.length === 0) return -1;
    return points.reduce((sum, point) => sum + (Number.isFinite(point.z) ? point.z : -1), 0) / points.length;
  }

  function visibleSurfaceSegments(points, visibleMin) {
    if (!Array.isArray(points) || points.length === 0) return [];

    const usable = points.map((point) => Boolean(point && point.visible && point.z > visibleMin));

    if (usable.every(Boolean)) return [points.slice()];
    if (usable.every((value) => !value)) return [];

    let start = usable.findIndex((value, index) => !value && usable[(index + 1) % usable.length]);

    if (start < 0) start = 0;

    const ordered = [];

    for (let i = 1; i <= points.length; i += 1) {
      const idx = (start + i) % points.length;
      ordered.push({ point: points[idx], usable: usable[idx] });
    }

    const segments = [];
    let current = [];

    for (const item of ordered) {
      if (item.usable) {
        current.push(item.point);
      } else if (current.length > 0) {
        if (current.length >= 5) segments.push(current);
        current = [];
      }
    }

    if (current.length >= 5) segments.push(current);

    return segments;
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

  function projectedEllipse(payload, lobe, scale = 1, elevation = LAND_ELEVATION, steps = 52) {
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
        Math.cos(t * 5 + cy * 0.09) * wobble * 0.58 +
        Math.sin(t * 9) * wobble * 0.24;

      const ex = Math.cos(t) * sx * n;
      const ey = Math.sin(t) * sy * n;

      const lon = cx + ex * Math.cos(rot) - ey * Math.sin(rot);
      const lat = clamp(cy + ex * Math.sin(rot) + ey * Math.cos(rot), -82, 82);

      const p = projectPoint(payload, lon, lat, elevation);
      pts.push({ ...p, lon, lat });
    }

    return pts;
  }

  function drawProjectedShape(ctx, payload, lobe, options = {}) {
    const scale = options.scale || 1;
    const elevation = options.elevation ?? LAND_ELEVATION;
    const fill = options.fill || lobe.color || COLORS.green;
    const stroke = options.stroke || "rgba(226, 246, 230, 0.14)";
    const lineWidth = options.lineWidth || 1;
    const visibleMin = options.visibleMin ?? LIMB_VISIBLE_MIN;
    const fadeStart = options.fadeStart ?? LIMB_FADE_START;
    const fullStrength = options.fullStrength ?? LIMB_FULL_STRENGTH;
    const centerAlpha = options.centerAlpha ?? LAND_CENTER_ALPHA;
    const strokeAlpha = options.strokeAlpha ?? Math.min(centerAlpha, 0.24);

    const pts = projectedEllipse(payload, lobe, scale, elevation);
    const segments = visibleSurfaceSegments(pts, visibleMin);

    if (!segments.length) return false;

    let drew = false;

    for (const segment of segments) {
      const z = averageDepth(segment);
      const alphaMultiplier = depthFade(z, visibleMin, fadeStart, fullStrength);

      if (alphaMultiplier <= 0.015) continue;

      ctx.save();
      ctx.beginPath();

      segment.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      ctx.closePath();
      ctx.fillStyle = withAlpha(fill, alphaMultiplier, centerAlpha);
      ctx.fill();

      if (lineWidth > 0 && alphaMultiplier > 0.08) {
        ctx.strokeStyle = withAlpha(stroke, alphaMultiplier * 0.82, strokeAlpha);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      ctx.restore();

      drew = true;
    }

    return drew;
  }

  function drawRidge(ctx, payload, ridge) {
    const [aLon, aLat] = ridge.a;
    const [bLon, bLat] = ridge.b;
    const bend = ridge.bend || 0;
    const pts = [];

    for (let i = 0; i <= 28; i += 1) {
      const k = i / 28;
      const lon = aLon + (bLon - aLon) * k + Math.sin(k * Math.PI) * bend * 18;
      const lat = aLat + (bLat - aLat) * k + Math.sin(k * Math.PI) * bend * 8;
      const p = projectPoint(payload, lon, lat, RIDGE_ELEVATION);
      if (p.visible && p.z > RIDGE_LIMB_VISIBLE_MIN) pts.push(p);
      else if (pts.length > 0) pts.push(null);
    }

    const segments = [];
    let current = [];

    for (const p of pts) {
      if (p) {
        current.push(p);
      } else if (current.length > 0) {
        if (current.length >= 3) segments.push(current);
        current = [];
      }
    }

    if (current.length >= 3) segments.push(current);

    for (const segment of segments) {
      const z = averageDepth(segment);
      const alphaMultiplier = depthFade(z, RIDGE_LIMB_VISIBLE_MIN, RIDGE_LIMB_FADE_START, RIDGE_FULL_STRENGTH);

      if (alphaMultiplier <= 0.04) continue;

      ctx.save();
      ctx.beginPath();

      segment.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      ctx.strokeStyle = withAlpha(COLORS.ridge, alphaMultiplier, RIDGE_CENTER_ALPHA);
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0055);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.restore();
    }
  }

  function drawSummit(ctx, payload, summit) {
    const p = projectPoint(payload, summit.lon, summit.lat, SUMMIT_ELEVATION);

    if (!p.visible || p.z < SUMMIT_LIMB_VISIBLE_MIN) return;

    const alphaMultiplier = depthFade(p.z, SUMMIT_LIMB_VISIBLE_MIN, SUMMIT_LIMB_FADE_START, SUMMIT_FULL_STRENGTH);

    if (alphaMultiplier <= 0.05) return;

    const r = Math.max(1.2, payload.geometry.radius * (0.007 + summit.rank * 0.00038)) * (0.72 + p.scale * 0.34);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha("rgba(255, 235, 168, 0.055)", alphaMultiplier, 0.08);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(COLORS.summit, alphaMultiplier, SUMMIT_CENTER_ALPHA);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p.x - r * 1.18, p.y);
    ctx.lineTo(p.x + r * 1.18, p.y);
    ctx.moveTo(p.x, p.y - r * 1.18);
    ctx.lineTo(p.x, p.y + r * 1.18);
    ctx.strokeStyle = withAlpha("rgba(255, 248, 206, 0.22)", alphaMultiplier, 0.22);
    ctx.lineWidth = Math.max(1, r * 0.22);
    ctx.stroke();

    ctx.restore();
  }

  function drawSouthPoleIceOnly(ctx, payload) {
    const lobes = [
      { lon: 0, lat: -74, sx: 92, sy: 9, rot: 0, color: COLORS.ice, wobble: 0.04 },
      { lon: 50, lat: -79, sx: 42, sy: 6, rot: 8, color: COLORS.iceSoft, wobble: 0.05 },
      { lon: -70, lat: -78, sx: 34, sy: 5, rot: -12, color: COLORS.iceSoft, wobble: 0.05 }
    ];

    for (const lobe of lobes) {
      drawProjectedShape(ctx, payload, lobe, {
        scale: 1,
        elevation: ICE_ELEVATION,
        fill: lobe.color,
        stroke: "rgba(244, 253, 255, 0.16)",
        lineWidth: Math.max(1, payload.geometry.radius * 0.0028),
        visibleMin: SHELF_LIMB_VISIBLE_MIN,
        fadeStart: SHELF_LIMB_FADE_START,
        fullStrength: SHELF_FULL_STRENGTH,
        centerAlpha: ICE_CENTER_ALPHA,
        strokeAlpha: 0.18
      });
    }
  }

  function drawShelfField(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedShape(ctx, payload, lobe, {
        scale: 1.2,
        elevation: SHELF_ELEVATION,
        fill: COLORS.shelf,
        stroke: COLORS.shelfLine,
        lineWidth: Math.max(1, payload.geometry.radius * 0.0027),
        visibleMin: SHELF_LIMB_VISIBLE_MIN,
        fadeStart: SHELF_LIMB_FADE_START,
        fullStrength: SHELF_FULL_STRENGTH,
        centerAlpha: SHELF_CENTER_ALPHA,
        strokeAlpha: 0.18
      });
    }
  }

  function drawLandField(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedShape(ctx, payload, lobe, {
        scale: 1,
        elevation: LAND_ELEVATION,
        fill: lobe.color,
        stroke: "rgba(226, 246, 230, 0.16)",
        lineWidth: Math.max(1, payload.geometry.radius * 0.0038),
        visibleMin: LIMB_VISIBLE_MIN,
        fadeStart: LIMB_FADE_START,
        fullStrength: LIMB_FULL_STRENGTH,
        centerAlpha: LAND_CENTER_ALPHA,
        strokeAlpha: 0.2
      });

      drawProjectedShape(
        ctx,
        payload,
        {
          ...lobe,
          sx: lobe.sx * 0.46,
          sy: lobe.sy * 0.38,
          color: COLORS.darkKnot
        },
        {
          scale: 1,
          elevation: PRESSURE_KNOT_ELEVATION,
          fill: COLORS.darkKnot,
          stroke: "rgba(255,255,255,0)",
          lineWidth: 0,
          visibleMin: LIMB_VISIBLE_MIN + 0.08,
          fadeStart: LIMB_FADE_START + 0.09,
          fullStrength: LIMB_FULL_STRENGTH + 0.08,
          centerAlpha: 0.26
        }
      );
    }

    for (const ridge of continent.ridges || []) {
      drawRidge(ctx, payload, ridge);
    }

    for (const summit of continent.summits || []) {
      drawSummit(ctx, payload, summit);
    }
  }

  function clipToSphere(ctx, geometry) {
    ctx.beginPath();
    ctx.arc(geometry.cx, geometry.cy, geometry.radius * 0.992, 0, Math.PI * 2);
    ctx.clip();
  }

  function draw(ctx, payload) {
    if (!validPayload(ctx, payload)) return api;

    state.drawCount += 1;

    ctx.save();
    clipToSphere(ctx, payload.geometry);

    ctx.globalCompositeOperation = "source-over";

    for (const continent of CONTINENTS) {
      drawShelfField(ctx, payload, continent);
    }

    for (const continent of CONTINENTS) {
      drawLandField(ctx, payload, continent);
    }

    drawSouthPoleIceOnly(ctx, payload);

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
      limbOcclusion4kSurface: true,
      seaLevelContinents: true,
      shelfElevation: SHELF_ELEVATION,
      landElevation: LAND_ELEVATION,
      ridgeElevation: RIDGE_ELEVATION,
      summitElevation: SUMMIT_ELEVATION,
      iceElevation: ICE_ELEVATION,
      limbVisibleMin: LIMB_VISIBLE_MIN,
      limbFadeStart: LIMB_FADE_START,
      limbFullStrength: LIMB_FULL_STRENGTH,
      shelfLimbVisibleMin: SHELF_LIMB_VISIBLE_MIN,
      shelfLimbFadeStart: SHELF_LIMB_FADE_START,
      shelfFullStrength: SHELF_FULL_STRENGTH,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      fiveContinentLaw: true,
      oceanDominant: true,
      southPoleIceOnly: true,
      continentCount: 5,
      continents: CONTINENTS.map((continent) => ({
        id: continent.id,
        name: continent.name,
        role: continent.role,
        lobes: continent.lobes.length,
        summits: continent.summits.length
      })),
      owns: [
        "five-continent law",
        "sea-level continent projection",
        "submerged shelves",
        "surface ridges",
        "surface pressure summits",
        "limb-depth attenuation",
        "4K surface compositing",
        "north polar continent",
        "south pole ice-only rule"
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
      mode: "sea_level_continents_limb_occlusion_4k_surface_child_engine",
      scope,
      active: true,
      classicScript: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      limbOcclusion4kSurface: true,
      seaLevelContinents: true,
      shelfElevation: SHELF_ELEVATION,
      landElevation: LAND_ELEVATION,
      ridgeElevation: RIDGE_ELEVATION,
      summitElevation: SUMMIT_ELEVATION,
      iceElevation: ICE_ELEVATION,
      limbVisibleMin: LIMB_VISIBLE_MIN,
      limbFadeStart: LIMB_FADE_START,
      limbFullStrength: LIMB_FULL_STRENGTH,
      shelfLimbVisibleMin: SHELF_LIMB_VISIBLE_MIN,
      shelfLimbFadeStart: SHELF_LIMB_FADE_START,
      shelfFullStrength: SHELF_FULL_STRENGTH,
      fiveContinentLaw: true,
      oceanDominant: true,
      southPoleIceOnly: true,
      continentCount: 5,
      visualPassClaim: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,
      errors: state.errors.slice()
    };

    window.AUDRALIA_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS_RECEIPT = receipt;

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
    CONTINENTS,
    SHELF_ELEVATION,
    LAND_ELEVATION,
    RIDGE_ELEVATION,
    SUMMIT_ELEVATION,
    ICE_ELEVATION,
    LIMB_VISIBLE_MIN,
    LIMB_FADE_START,
    LIMB_FULL_STRENGTH,
    SHELF_LIMB_VISIBLE_MIN,
    SHELF_LIMB_FADE_START,
    SHELF_FULL_STRENGTH,
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
    window.AUDRALIA_CLEAN_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS = api;

    window.AudraliaContinentsEngine = api;
    window.AudraliaContinents = api;
    window.audraliaContinents = api;

    window.AUDRALIA_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_ACTIVE = true;
    window.AUDRALIA_CONTINENTS_SEA_LEVEL_ACTIVE = true;
    window.AUDRALIA_CONTINENTS_EXPRESSION_ACTIVE = true;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = true;
    window.AUDRALIA_SOUTH_POLE_ICE_ONLY = true;

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
