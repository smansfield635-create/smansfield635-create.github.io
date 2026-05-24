// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_CLAY_GLOBE_TV_SCREEN_CANVAS_TNT_v1
//
// Role:
// - TV screen / canvas surface.
// - Displays the lawful active feed.
// - Boots with Clay Globe Baseline Feed.
// - Uses predestined latitude / longitude disposition from the hidden Australia-template scaffold.
// - Public identity remains Audralia.
//
// Does not own:
// - Shell architecture.
// - Gems.
// - Tabs.
// - Chambers.
// - Menus.
// - Return to Orbit.
// - Final terrain truth.
// - Active water.
// - Final visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_CLAY_GLOBE_TV_SCREEN_CANVAS_TNT_v1";
  const API_NAME = "DGBAudraliaPlanetCanvas";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const TAU = Math.PI * 2;

  const MODES = Object.freeze(["body", "surface", "terrain", "lattice", "receipt"]);

  const BASELINE_FEED = Object.freeze({
    id: "CLAY_GLOBE_BASELINE_FEED",
    publicIdentity: "Audralia",
    screenRole: "TV_SCREEN_CANVAS",
    material: "moldable dry clay globe",
    disposition: "predestined latitude / longitude",
    templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
    activeWater: false,
    hydrationActive: false,
    finalTerrainTruth: false,
    finalVisualPass: false
  });

  const state = {
    stage: null,
    canvas: null,
    fallback: null,
    ctx: null,

    mode: "body",
    feed: BASELINE_FEED,

    dpr: 1,
    width: 1,
    height: 1,

    yaw: -0.44,
    pitch: -0.04,
    roll: 0,
    velocityYaw: 0,
    velocityPitch: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,

    time: 0,
    lastFrame: 0,
    raf: 0,

    clayPatches: [],
    reliefLines: [],
    latticeNodes: [],

    initialized: false,
    mounted: false,
    errors: []
  };

  const AUSTRALIA_TEMPLATE_DISPOSITION = Object.freeze({
    identity: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
    publicIdentity: "AUDRALIA",
    publicAustraliaIdentity: false,
    latLongDisposition: "PREDESTINED",
    orientation: {
      primeYaw: -0.44,
      axialPitch: -0.04,
      inspectionRoll: 0
    },
    anchors: Object.freeze([
      { id: "AUS_NW_MEMORY", lat: -15.0, lon: 121.0, mass: 0.86, pressure: 0.42 },
      { id: "AUS_NORTH_MEMORY", lat: -12.5, lon: 133.0, mass: 0.74, pressure: 0.36 },
      { id: "AUS_NE_MEMORY", lat: -16.5, lon: 145.0, mass: 0.80, pressure: 0.44 },
      { id: "AUS_WEST_MEMORY", lat: -25.5, lon: 116.0, mass: 0.92, pressure: 0.58 },
      { id: "AUS_CENTER_MEMORY", lat: -25.0, lon: 134.0, mass: 1.00, pressure: 0.68 },
      { id: "AUS_EAST_MEMORY", lat: -27.8, lon: 146.5, mass: 0.88, pressure: 0.61 },
      { id: "AUS_SW_MEMORY", lat: -33.5, lon: 117.5, mass: 0.76, pressure: 0.55 },
      { id: "AUS_SOUTH_MEMORY", lat: -35.0, lon: 137.0, mass: 0.70, pressure: 0.50 },
      { id: "AUS_SE_MEMORY", lat: -37.2, lon: 148.0, mass: 0.72, pressure: 0.57 }
    ])
  });

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function hash01(seed) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
    document.documentElement.dataset.audraliaCanvasError = message;
  }

  function buildPredestinedClayFeed() {
    const patches = [];
    const relief = [];
    const nodes = [];

    AUSTRALIA_TEMPLATE_DISPOSITION.anchors.forEach((anchor, index) => {
      const baseLat = toRadians(anchor.lat);
      const baseLon = toRadians(anchor.lon - 134.5);

      for (let i = 0; i < 7; i += 1) {
        const spreadLat = (hash01(index * 17 + i + 1) - 0.5) * 0.26;
        const spreadLon = (hash01(index * 23 + i + 5) - 0.5) * 0.42;
        const tone = hash01(index * 31 + i + 9);
        const scale = 0.048 + hash01(index * 43 + i + 13) * 0.104;

        patches.push({
          lat: clamp(baseLat + spreadLat, -1.24, 0.44),
          lon: baseLon + spreadLon,
          size: scale * anchor.mass,
          pressure: anchor.pressure,
          tone,
          family: anchor.id
        });
      }

      relief.push({
        lat: baseLat,
        lon: baseLon,
        length: 0.32 + anchor.mass * 0.18,
        bend: (hash01(index + 99) - 0.5) * 0.32,
        pressure: anchor.pressure,
        family: anchor.id
      });
    });

    for (let row = 0; row < 16; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const lat = ((row + 0.5) / 16 - 0.5) * Math.PI * 0.92;
        const lon = ((col + 0.5) / 16) * TAU - Math.PI;
        nodes.push({
          row,
          col,
          lat,
          lon,
          state: row * 16 + col,
          colorIndex: (row * 5 + col * 3) % 32
        });
      }
    }

    state.clayPatches = patches;
    state.reliefLines = relief;
    state.latticeNodes = nodes;
  }

  function ensureMounts() {
    state.stage = $("[data-audralia-planet-stage]");
    state.canvas = $("[data-audralia-planet-canvas]");
    state.fallback = $("[data-audralia-planet-fallback]");

    if (!state.stage || !state.canvas) {
      state.mounted = false;
      return false;
    }

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.mounted = Boolean(state.ctx);

    if (state.mounted) {
      state.stage.dataset.canvasRole = "tv-screen";
      state.stage.dataset.feed = "clay-globe";
      state.stage.dataset.rendererState = "active";
      state.canvas.dataset.audraliaCanvasContract = CONTRACT;
      state.canvas.dataset.publicIdentity = "Audralia";
      state.canvas.dataset.templateSource = "Australia-template hidden scaffold";
      state.canvas.dataset.activeWater = "false";
      state.canvas.dataset.finalVisualPass = "false";
    }

    return state.mounted;
  }

  function resizeCanvas() {
    if (!state.stage || !state.canvas || !state.ctx) return;

    const rect = state.stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
    const height = Math.max(420, Math.floor((rect.height || 620) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.dpr = dpr;
    state.width = width;
    state.height = height;
  }

  function project(lat, lon, radius, cx, cy) {
    const adjustedLon = lon + state.yaw;
    const cosLat = Math.cos(lat);

    let x = Math.sin(adjustedLon) * cosLat;
    let y = Math.sin(lat);
    let z = Math.cos(adjustedLon) * cosLat;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const yy = y * cp - z * sp;
    const zz = y * sp + z * cp;
    y = yy;
    z = zz;

    return {
      x: cx + x * radius,
      y: cy - y * radius * 0.98,
      z,
      visible: z > -0.16,
      scale: clamp(0.58 + z * 0.45, 0.20, 1.06)
    };
  }

  function drawScreenFrame(ctx, cx, cy, r) {
    ctx.save();

    ctx.strokeStyle = "rgba(141,216,255,.13)";
    ctx.lineWidth = Math.max(1, state.dpr);
    ctx.setLineDash([5 * state.dpr, 8 * state.dpr]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.16, r * 1.02, 0.18, 0, TAU);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(244,207,131,.10)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.96, r * 1.12, -0.14, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  function drawClaySphere(ctx, cx, cy, r) {
    const light = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.40, r * 0.08, cx, cy, r * 1.12);
    light.addColorStop(0.00, "rgba(238,218,166,0.98)");
    light.addColorStop(0.22, "rgba(166,141,92,0.96)");
    light.addColorStop(0.48, "rgba(103,88,64,0.96)");
    light.addColorStop(0.72, "rgba(78,64,49,0.97)");
    light.addColorStop(1.00, "rgba(16,18,19,0.99)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    ctx.fillStyle = light;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.globalAlpha = 0.13;
    for (let i = 0; i < 28; i += 1) {
      const y = cy - r + (i / 27) * r * 2;
      ctx.strokeStyle = i % 2 === 0 ? "rgba(255,232,163,.26)" : "rgba(55,45,35,.34)";
      ctx.lineWidth = Math.max(0.8, state.dpr);
      ctx.beginPath();
      ctx.moveTo(cx - r, y);
      ctx.bezierCurveTo(
        cx - r * 0.38,
        y + Math.sin(i * 0.7 + state.time) * r * 0.035,
        cx + r * 0.36,
        y - Math.cos(i * 0.5 + state.time) * r * 0.035,
        cx + r,
        y
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawClayDisposition(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    for (const patch of state.clayPatches) {
      const p = project(patch.lat, patch.lon, r, cx, cy);
      if (!p.visible) continue;

      const width = patch.size * r * (1.55 + patch.pressure * 0.58) * p.scale;
      const height = patch.size * r * (0.82 + patch.pressure * 0.28) * p.scale;

      const clayTone =
        patch.tone < 0.28 ? "rgba(92,73,50,.30)" :
        patch.tone < 0.58 ? "rgba(160,124,76,.25)" :
        patch.tone < 0.82 ? "rgba(88,98,74,.20)" :
        "rgba(208,168,94,.18)";

      ctx.fillStyle = clayTone;
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y,
        width,
        height,
        patch.lon + state.yaw + patch.pressure,
        0,
        TAU
      );
      ctx.fill();
    }

    if (state.mode === "surface" || state.mode === "terrain" || state.mode === "receipt") {
      ctx.globalAlpha = state.mode === "surface" ? 0.16 : 0.24;
      ctx.strokeStyle = "rgba(255,232,163,.48)";
      ctx.lineWidth = Math.max(1, 1.05 * state.dpr);

      for (const line of state.reliefLines) {
        const a = project(line.lat, line.lon, r, cx, cy);
        const b = project(line.lat + line.bend, line.lon + line.length, r, cx, cy);
        if (!a.visible || !b.visible) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(
          (a.x + b.x) / 2,
          (a.y + b.y) / 2 - r * 0.06 * line.pressure,
          b.x,
          b.y
        );
        ctx.stroke();
      }
    }

    if (state.mode === "terrain") {
      ctx.globalAlpha = 0.20;
      ctx.strokeStyle = "rgba(66,41,28,.92)";
      ctx.lineWidth = Math.max(1, 1.4 * state.dpr);

      for (let i = 0; i < state.reliefLines.length; i += 1) {
        const line = state.reliefLines[i];
        const a = project(line.lat - 0.04, line.lon - 0.08, r, cx, cy);
        const b = project(line.lat + 0.12, line.lon + line.length * 0.72, r, cx, cy);
        if (!a.visible || !b.visible) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawLatticeFeed(ctx, cx, cy, r) {
    if (state.mode !== "lattice" && state.mode !== "receipt") return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    const projected = state.latticeNodes
      .map((node) => ({ node, point: project(node.lat, node.lon, r, cx, cy) }))
      .filter((item) => item.point.visible);

    ctx.globalAlpha = state.mode === "receipt" ? 0.24 : 0.32;
    ctx.lineWidth = Math.max(0.65, 0.75 * state.dpr);

    for (const item of projected) {
      const right = projected.find((next) => next.node.row === item.node.row && next.node.col === item.node.col + 1);
      const down = projected.find((next) => next.node.col === item.node.col && next.node.row === item.node.row + 1);

      if (right) {
        ctx.strokeStyle = "rgba(141,216,255,.34)";
        ctx.beginPath();
        ctx.moveTo(item.point.x, item.point.y);
        ctx.lineTo(right.point.x, right.point.y);
        ctx.stroke();
      }

      if (down) {
        ctx.strokeStyle = "rgba(244,207,131,.23)";
        ctx.beginPath();
        ctx.moveTo(item.point.x, item.point.y);
        ctx.lineTo(down.point.x, down.point.y);
        ctx.stroke();
      }
    }

    for (const item of projected) {
      const color =
        item.node.colorIndex % 4 === 0 ? "rgba(244,207,131,.82)" :
        item.node.colorIndex % 4 === 1 ? "rgba(141,216,255,.72)" :
        item.node.colorIndex % 4 === 2 ? "rgba(167,243,198,.70)" :
        "rgba(173,140,255,.68)";

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        item.point.x,
        item.point.y,
        Math.max(1.15, 2.2 * state.dpr * item.point.scale),
        0,
        TAU
      );
      ctx.fill();
    }

    if (state.mode === "receipt") {
      ctx.globalAlpha = 0.40;
      ctx.strokeStyle = "rgba(244,207,131,.66)";
      ctx.lineWidth = Math.max(1, 1.45 * state.dpr);

      for (let i = 0; i < 8; i += 1) {
        const a = projected[(i * 17) % projected.length];
        const b = projected[(i * 31 + 11) % projected.length];
        if (!a || !b) continue;

        ctx.beginPath();
        ctx.moveTo(a.point.x, a.point.y);
        ctx.lineTo(b.point.x, b.point.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawScreenGlass(ctx, cx, cy, r) {
    ctx.save();

    const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.42, r * 0.12, cx + r * 0.34, cy + r * 0.28, r * 1.18);
    shade.addColorStop(0.00, "rgba(255,255,255,.20)");
    shade.addColorStop(0.34, "rgba(255,255,255,0)");
    shade.addColorStop(0.76, "rgba(0,0,0,.34)");
    shade.addColorStop(1.00, "rgba(0,0,0,.70)");

    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(190,232,255,.28)";
    ctx.lineWidth = Math.max(1, 1.25 * state.dpr);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.stroke();

    if (state.mode === "receipt") {
      ctx.fillStyle = "rgba(244,207,131,.10)";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.015, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function render(timestamp = 0) {
    if (!state.ctx || !state.canvas || !state.stage) return;

    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.045) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocityYaw * dt * 60;
      state.pitch += state.velocityPitch * dt * 60;

      state.velocityYaw *= Math.pow(0.935, dt * 60);
      state.velocityPitch *= Math.pow(0.90, dt * 60);

      if (Math.abs(state.velocityYaw) < 0.00012) {
        state.velocityYaw = 0;
        state.yaw += Math.sin(state.time * 0.18) * dt * 0.018;
      }

      if (Math.abs(state.velocityPitch) < 0.00012) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -0.28, 0.28);
    state.roll = Math.sin(state.time * 0.12) * 0.008;

    resizeCanvas();

    const ctx = state.ctx;
    const w = state.width;
    const h = state.height;
    const cx = w / 2;
    const cy = h * 0.48;
    const radius = Math.min(w * 0.34, h * 0.355);

    ctx.clearRect(0, 0, w, h);

    drawScreenFrame(ctx, cx, cy, radius);
    drawClaySphere(ctx, cx, cy, radius);
    drawClayDisposition(ctx, cx, cy, radius);
    drawLatticeFeed(ctx, cx, cy, radius);
    drawScreenGlass(ctx, cx, cy, radius);

    state.raf = window.requestAnimationFrame(render);
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.pointerX;
      const dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.0065;
      state.pitch = clamp(state.pitch + dy * 0.0021, -0.28, 0.28);
      state.velocityYaw = clamp(dx * 0.0018, -0.034, 0.034);
      state.velocityPitch = clamp(dy * 0.00065, -0.010, 0.010);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    const release = (event) => {
      state.dragging = false;
      try {
        state.stage.releasePointerCapture?.(event.pointerId);
      } catch (_error) {}
    };

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
    state.stage.addEventListener("pointerleave", release, { passive: true });
  }

  function setMode(mode) {
    const next = MODES.includes(mode) ? mode : "body";
    state.mode = next;

    document.documentElement.dataset.audraliaCanvasMode = next;
    if (document.body) document.body.dataset.audraliaCanvasMode = next;

    publishStatus("set-mode");
    return status();
  }

  function setFeed(feedPacket) {
    if (!feedPacket || typeof feedPacket !== "object") {
      state.feed = BASELINE_FEED;
      publishStatus("set-feed-baseline");
      return status();
    }

    state.feed = Object.freeze({
      ...BASELINE_FEED,
      ...feedPacket,
      publicIdentity: "Audralia",
      templateSource: feedPacket.templateSource || "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      activeWater: false,
      finalVisualPass: false
    });

    publishStatus("set-feed");
    return status();
  }

  function resetView() {
    state.yaw = AUSTRALIA_TEMPLATE_DISPOSITION.orientation.primeYaw;
    state.pitch = AUSTRALIA_TEMPLATE_DISPOSITION.orientation.axialPitch;
    state.roll = AUSTRALIA_TEMPLATE_DISPOSITION.orientation.inspectionRoll;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    publishStatus("reset-view");
    return status();
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      api: API_NAME,
      initialized: state.initialized,
      mounted: state.mounted,
      screenRole: "TV_SCREEN_CANVAS",
      currentMode: state.mode,
      feed: state.feed.id || "CLAY_GLOBE_BASELINE_FEED",
      baselineFeed: BASELINE_FEED.id,
      publicIdentity: "Audralia",
      templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      latLongDisposition: "PREDESTINED",
      clayPatchCount: state.clayPatches.length,
      latticeSeatCount: state.latticeNodes.length,
      activeWater: false,
      hydrationActive: false,
      terrainChildActive: false,
      surfaceChildActive: false,
      datumChildActive: false,
      generatedImage: false,
      graphicBox: false,
      finalVisualPass: false,
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

    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasRole = "tv-screen";
    document.documentElement.dataset.audraliaCanvasFeed = "clay-globe-baseline";
    document.documentElement.dataset.audraliaCanvasPublicIdentity = "Audralia";
    document.documentElement.dataset.audraliaCanvasTemplateSource = "Australia-template-hidden-scaffold";
    document.documentElement.dataset.audraliaCanvasLatLongDisposition = "predestined";
    document.documentElement.dataset.audraliaCanvasActiveWater = "false";
    document.documentElement.dataset.audraliaCanvasFinalVisualPass = "false";

    return payload;
  }

  function exposeApi() {
    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      baselineFeed: BASELINE_FEED,
      setFeed,
      setMode,
      resetView,
      status
    });
  }

  function init() {
    try {
      exposeApi();
      buildPredestinedClayFeed();

      if (!ensureMounts()) {
        state.initialized = true;
        publishStatus("fallback-no-canvas-mount");
        return;
      }

      bindPointer();
      resizeCanvas();

      state.initialized = true;
      publishStatus("init-complete");

      window.addEventListener("resize", resizeCanvas, { passive: true });

      if (!state.raf) {
        state.raf = window.requestAnimationFrame(render);
      }
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
