// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_5_CONTINENTS_EXPRESSION_ENGINE_TNT_v1
// Full-file replacement.
// Purpose: give Audralia its ocean-dominant Five-Continent Nine-Summits land/water expression.
// Child engine only. Classic script. No imports. No exports.
// Does not own: canvas creation, route bridge, runtime, parent mount, FORM_VISIBLE, sky, motion, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_CONTINENTS_EXPRESSION_ENGINE_TNT_v1";
  const FAMILY = "AUDRALIA_G2_5_EXISTING_ARCHITECTURE_PATH_ALIGNMENT_TNT_v1";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const DEG = Math.PI / 180;

  const COLORS = {
    shelf: "rgba(91, 210, 224, 0.24)",
    shelfLine: "rgba(178, 246, 255, 0.26)",
    lowland: "rgba(74, 150, 98, 0.72)",
    green: "rgba(93, 171, 109, 0.76)",
    highland: "rgba(162, 129, 79, 0.62)",
    dryHighland: "rgba(185, 145, 86, 0.58)",
    ridge: "rgba(238, 219, 158, 0.38)",
    summit: "rgba(255, 238, 178, 0.72)",
    darkKnot: "rgba(39, 67, 62, 0.32)",
    polarLand: "rgba(125, 179, 138, 0.58)",
    ice: "rgba(232, 249, 255, 0.76)",
    iceSoft: "rgba(203, 236, 248, 0.36)"
  };

  const CONTINENTS = [
    {
      id: "auralis-main",
      name: "Auralis Main",
      role: "western-large highland continent",
      terrainPressure: 0.84,
      summitPressure: 0.92,
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
      terrainPressure: 0.66,
      summitPressure: 0.58,
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
      terrainPressure: 0.62,
      summitPressure: 0.46,
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
      terrainPressure: 0.52,
      summitPressure: 0.36,
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
      terrainPressure: 0.74,
      summitPressure: 0.66,
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
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    active: true,
    classicScript: true,
    globalPublished: false,
    mountCalled: false,
    drawCount: 0,
    lastScope: "module-load",
    oceanDominant: true,
    fiveContinentLaw: true,
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

  function projectPoint(payload, lonDeg, latDeg, elevation = 0.006) {
    return payload.project(toRad(lonDeg), toRad(latDeg), elevation);
  }

  function projectedEllipse(payload, lobe, scale = 1, elevation = 0.006, steps = 42) {
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
    const elevation = options.elevation ?? 0.006;
    const fill = options.fill || lobe.color || COLORS.green;
    const stroke = options.stroke || "rgba(226, 246, 230, 0.18)";
    const lineWidth = options.lineWidth || 1;
    const pts = projectedEllipse(payload, lobe, scale, elevation);

    const visible = pts.filter((p) => p.visible && p.z > -0.04);

    if (visible.length < 7) return false;

    ctx.save();

    ctx.beginPath();
    visible.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.restore();

    return true;
  }

  function drawRidge(ctx, payload, ridge) {
    const [aLon, aLat] = ridge.a;
    const [bLon, bLat] = ridge.b;
    const bend = ridge.bend || 0;
    const pts = [];

    for (let i = 0; i <= 22; i += 1) {
      const k = i / 22;
      const lon = aLon + (bLon - aLon) * k + Math.sin(k * Math.PI) * bend * 18;
      const lat = aLat + (bLat - aLat) * k + Math.sin(k * Math.PI) * bend * 8;
      const p = projectPoint(payload, lon, lat, 0.012);
      if (p.visible && p.z > -0.02) pts.push(p);
    }

    if (pts.length < 4) return;

    ctx.save();
    ctx.beginPath();

    pts.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = COLORS.ridge;
    ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.008);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.restore();
  }

  function drawSummit(ctx, payload, summit) {
    const p = projectPoint(payload, summit.lon, summit.lat, 0.018);

    if (!p.visible || p.z < -0.02) return;

    const r = Math.max(1.8, payload.geometry.radius * (0.012 + summit.rank * 0.0008)) * (0.7 + p.scale * 0.5);

    ctx.save();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 235, 168, 0.08)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.summit;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p.x - r * 1.7, p.y);
    ctx.lineTo(p.x + r * 1.7, p.y);
    ctx.moveTo(p.x, p.y - r * 1.7);
    ctx.lineTo(p.x, p.y + r * 1.7);
    ctx.strokeStyle = "rgba(255, 248, 206, 0.34)";
    ctx.lineWidth = Math.max(1, r * 0.35);
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
        elevation: 0.01,
        fill: lobe.color,
        stroke: "rgba(244, 253, 255, 0.24)",
        lineWidth: Math.max(1, payload.geometry.radius * 0.004)
      });
    }
  }

  function drawShelfField(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedShape(ctx, payload, lobe, {
        scale: 1.22,
        elevation: -0.006,
        fill: COLORS.shelf,
        stroke: COLORS.shelfLine,
        lineWidth: Math.max(1, payload.geometry.radius * 0.004)
      });
    }
  }

  function drawLandField(ctx, payload, continent) {
    for (const lobe of continent.lobes) {
      drawProjectedShape(ctx, payload, lobe, {
        scale: 1,
        elevation: 0.012,
        fill: lobe.color,
        stroke: "rgba(226, 246, 230, 0.22)",
        lineWidth: Math.max(1, payload.geometry.radius * 0.005)
      });

      drawProjectedShape(ctx, payload, {
        ...lobe,
        sx: lobe.sx * 0.46,
        sy: lobe.sy * 0.38,
        color: COLORS.darkKnot
      }, {
        scale: 1,
        elevation: 0.016,
        fill: COLORS.darkKnot,
        stroke: "rgba(255,255,255,0)",
        lineWidth: 0
      });
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
    ctx.arc(geometry.cx, geometry.cy, geometry.radius * 0.997, 0, Math.PI * 2);
    ctx.clip();
  }

  function draw(ctx, payload) {
    if (!validPayload(ctx, payload)) return api;

    state.drawCount += 1;
    state.lastScope = "draw";

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

  function mount(payload = {}) {
    state.mountCalled = true;
    state.lastScope = "mount";
    publishReceipt("mount");
    return api;
  }

  function init(payload = {}) {
    state.lastScope = "init";
    publishReceipt("init");
    return api;
  }

  function setup(payload = {}) {
    state.lastScope = "setup";
    publishReceipt("setup");
    return api;
  }

  function boot(payload = {}) {
    state.lastScope = "boot";
    publishReceipt("boot");
    return api;
  }

  function create(payload = {}) {
    state.lastScope = "create";
    publishReceipt("create");
    return api;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
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
      ratioTarget: {
        ocean: "62-72%",
        exposedLand: "20-30%",
        iceShelfSubmergedPressure: "8-14%"
      },
      owns: [
        "five-continent law",
        "ocean-dominant footprint",
        "non-blob coastlines",
        "north polar continent",
        "south pole ice-only rule",
        "submerged shelves",
        "Nine-Summits terrain pressure"
      ],
      doesNotOwn: [
        "FORM_VISIBLE",
        "canvas creation",
        "route fallback",
        "runtime handoff",
        "parent mount",
        "sky",
        "motion"
      ],
      visualPassClaim: false,
      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "continents_expression_child_engine",
      scope,
      active: true,
      classicScript: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
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
      window.dispatchEvent(
        new CustomEvent("audralia:continents:receipt", { detail: receipt })
      );
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:continents:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    CONTRACT,
    FAMILY,
    TARGET,
    ROUTE,
    CONTINENTS,
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

    window.AUDRALIA_CONTINENTS_EXPRESSION_ACTIVE = true;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = true;
    window.AUDRALIA_SOUTH_POLE_ICE_ONLY = true;

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
