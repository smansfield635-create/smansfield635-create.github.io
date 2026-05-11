// /showroom/globe/h-earth/index.js
// H_EARTH_PRIVATE_ROOM_GLAMOUR_SURFACE_SIMPLIFICATION_ROUTE_TNT_v18B
// Full-file replacement.
// Private H-Earth route doorway, stage-facing only.
//
// Purpose:
// - Strip visible diagnostic walls from the private H-Earth room.
// - Keep the accepted private planet-room standard.
// - Render a lightweight orbital/aerial H-Earth surface.
// - Keep raw runtime/canvas/control diagnostics out of the visible page.
// - Point diagnostics to /gauges/h-earth/.
// - Avoid heavy runtime auto-boot.
// - Keep ground level held.
// - Keep estate placement held.
// - Keep parent mutation forbidden.
// - Keep visual pass claim false.

const CONTRACT = "H_EARTH_PRIVATE_ROOM_GLAMOUR_SURFACE_SIMPLIFICATION_ROUTE_TNT_v18B";
const HTML_CONTRACT = "H_EARTH_PRIVATE_ROOM_GLAMOUR_SURFACE_SIMPLIFICATION_HTML_TNT_v18A";
const PAIR_CONTRACT = "H_EARTH_PRIVATE_ROOM_GLAMOUR_SURFACE_SIMPLIFICATION_PAIR_TNT_v18";
const PREVIOUS_CONTRACT = "H_EARTH_G1_RUNTIME_GOVERNED_PRIVATE_ROOM_ROUTE_TNT_v16B";

const ROUTE = "/showroom/globe/h-earth/";
const DIAGNOSTICS_ROUTE = "/gauges/h-earth/";
const BUILD_MODE = "orbital-aerial-first";
const CACHE_KEY = "2026-05-11-h-earth-private-glamour-surface-v18b";

const state = {
  frame: 0,
  lastFrameAt: 0,
  active: true,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  animationId: null,
  resizeTimer: 0,
  status: "stage-facing-surface-active",
  contract: CONTRACT,
  visualPassClaim: false,
  parentMutationAuthorized: false,
  groundLevelReady: false,
  estatePlacementReady: false
};

const nodes = {
  canvas: null,
  ctx: null,
  status: null,
  markers: null
};

const MATERIALS = Object.freeze([
  { lat: 58, lon: -130, rx: 0.26, ry: 0.08, kind: "ice" },
  { lat: 42, lon: -92, rx: 0.24, ry: 0.11, kind: "land" },
  { lat: 21, lon: -62, rx: 0.18, ry: 0.09, kind: "coast" },
  { lat: 8, lon: -18, rx: 0.22, ry: 0.12, kind: "land" },
  { lat: -12, lon: 28, rx: 0.21, ry: 0.10, kind: "relief" },
  { lat: -26, lon: 74, rx: 0.19, ry: 0.09, kind: "land" },
  { lat: -46, lon: 118, rx: 0.24, ry: 0.09, kind: "coast" },
  { lat: 31, lon: 146, rx: 0.19, ry: 0.08, kind: "relief" },
  { lat: -62, lon: -18, rx: 0.28, ry: 0.07, kind: "ice" },
  { lat: 4, lon: -154, rx: 0.11, ry: 0.05, kind: "island" },
  { lat: -34, lon: -132, rx: 0.12, ry: 0.05, kind: "island" },
  { lat: 48, lon: 34, rx: 0.13, ry: 0.05, kind: "coast" },
  { lat: -8, lon: 148, rx: 0.12, ry: 0.04, kind: "island" }
]);

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.routeDoorwayTopLevelExecuted = "true";
  root.dataset.routeDoorwayReceipt = CONTRACT;
  root.dataset.routeDoorwayContract = CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.pairReceipt = PAIR_CONTRACT;
  root.dataset.previousRouteDoorwayContract = PREVIOUS_CONTRACT;
  root.dataset.hEarthPrivateRoom = "true";
  root.dataset.hEarthRoom = "private-orbital-aerial-build-room";
  root.dataset.hEarthVisibleDiagnostics = "false";
  root.dataset.hEarthDiagnosticsRoute = DIAGNOSTICS_ROUTE;
  root.dataset.hEarthBuildMode = BUILD_MODE;
  root.dataset.hEarthStageStatus = state.status;
  root.dataset.hEarthGroundLevelReady = "false";
  root.dataset.hEarthEstatePlacementReady = "false";
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
  root.dataset.visualPassClaim = "false";
}

function stampHiddenMarkers() {
  nodes.markers = byId("hEarthAuditMarkers");
  if (!nodes.markers) return;

  nodes.markers.dataset.routeReceipt = CONTRACT;
  nodes.markers.dataset.htmlReceipt = HTML_CONTRACT;
  nodes.markers.dataset.pairReceipt = PAIR_CONTRACT;
  nodes.markers.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  nodes.markers.dataset.visibleDiagnostics = "false";
  nodes.markers.dataset.diagnosticsRoute = DIAGNOSTICS_ROUTE;
  nodes.markers.dataset.hEarthStageStatus = state.status;
  nodes.markers.dataset.hEarthBuildMode = BUILD_MODE;
  nodes.markers.dataset.hEarthGroundLevelReady = "false";
  nodes.markers.dataset.hEarthEstatePlacementReady = "false";
  nodes.markers.dataset.hEarthParentMutationAuthorized = "false";
  nodes.markers.dataset.hEarthVisualPassClaim = "false";
  nodes.markers.dataset.cacheKey = CACHE_KEY;
}

function setupCanvas() {
  nodes.canvas = byId("hEarthOrbitalCanvas");
  nodes.status = byId("hEarthStageStatus");

  if (!nodes.canvas) return false;

  const rect = nodes.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || 760));
  const cssHeight = Math.max(320, Math.floor(rect.height || cssWidth));
  const width = Math.floor(cssWidth * state.dpr);
  const height = Math.floor(cssHeight * state.dpr);

  if (nodes.canvas.width !== width || nodes.canvas.height !== height) {
    nodes.canvas.width = width;
    nodes.canvas.height = height;
  }

  nodes.canvas.style.transform = "none";
  nodes.canvas.dataset.cardTransform = "forbidden";
  nodes.canvas.dataset.hEarthVisibleDiagnostics = "false";

  nodes.ctx = nodes.canvas.getContext("2d", { alpha: false });

  return Boolean(nodes.ctx);
}

function updateStatus() {
  if (!nodes.status) return;

  nodes.status.replaceChildren(
    statusBlock("Mode", "Orbital / aerial first"),
    statusBlock("Ground level", "Held"),
    statusBlock("Estate", "Held"),
    statusBlock("Diagnostics", "Gauges")
  );
}

function statusBlock(label, value) {
  const span = document.createElement("span");
  const strong = document.createElement("strong");

  strong.textContent = label;
  span.appendChild(strong);
  span.append(value);

  return span;
}

function clearScene(ctx, width, height) {
  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    width * 0.04,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  bg.addColorStop(0, "#173f66");
  bg.addColorStop(0.42, "#07152b");
  bg.addColorStop(1, "#01030a");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.58;

  for (let i = 0; i < 120; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = 0.65 + ((i * 7) % 11) / 15;

    ctx.beginPath();
    ctx.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.74)" : "rgba(225,238,255,.60)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function colorFor(kind) {
  if (kind === "ice") return "#d8edf4";
  if (kind === "relief") return "#908866";
  if (kind === "coast") return "#d2b77b";
  if (kind === "island") return "#7ca75d";
  return "#6f9854";
}

function shade(hex, light) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `rgb(${[
    clamp(Math.round(r * light + 10 * (1 - light)), 0, 255),
    clamp(Math.round(g * light + 10 * (1 - light)), 0, 255),
    clamp(Math.round(b * light + 10 * (1 - light)), 0, 255)
  ].join(",")})`;
}

function project(latDeg, lonDeg, radius, cx, cy, rotation, pitchDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = ((lonDeg + rotation) * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;

  const x0 = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);

  const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
  const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);
  const x = x0;

  if (z < -0.08) return null;

  return {
    x: cx + x * radius,
    y: cy - y * radius * 0.98,
    z,
    light: clamp(0.52 + z * 0.42 + y * 0.10 - x * 0.06, 0.22, 1)
  };
}

function drawGlobeBase(ctx, radius, cx, cy) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    cx - radius * 0.32,
    cy - radius * 0.35,
    radius * 0.08,
    cx,
    cy,
    radius * 1.15
  );

  ocean.addColorStop(0, "#2a8798");
  ocean.addColorStop(0.36, "#0b315f");
  ocean.addColorStop(0.74, "#061e3e");
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(143,240,195,.38)";
  ctx.lineWidth = Math.max(2, radius * 0.011);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.015, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(143,240,195,.22)";
  ctx.lineWidth = Math.max(9, radius * 0.036);
  ctx.stroke();

  ctx.restore();
}

function drawMaterials(ctx, radius, cx, cy, rotation) {
  const pitch = 12;
  const projected = [];

  for (const item of MATERIALS) {
    const point = project(item.lat, item.lon, radius, cx, cy, rotation, pitch);
    if (!point) continue;
    projected.push({ item, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.997, 0, Math.PI * 2);
  ctx.clip();

  for (const { item, point } of projected) {
    const sizeX = radius * item.rx * (0.75 + point.z * 0.35);
    const sizeY = radius * item.ry * (0.75 + point.z * 0.35);
    const color = shade(colorFor(item.kind), point.light);

    ctx.beginPath();

    if (item.kind === "relief") {
      ctx.moveTo(point.x, point.y - sizeY * 1.15);
      ctx.lineTo(point.x + sizeX, point.y - sizeY * 0.18);
      ctx.lineTo(point.x + sizeX * 0.55, point.y + sizeY);
      ctx.lineTo(point.x - sizeX * 0.62, point.y + sizeY * 0.72);
      ctx.lineTo(point.x - sizeX, point.y - sizeY * 0.12);
      ctx.closePath();
    } else {
      ctx.ellipse(point.x, point.y, sizeX, sizeY, 0.12, 0, Math.PI * 2);
    }

    ctx.globalAlpha = item.kind === "ice" ? 0.94 : 0.88;
    ctx.fillStyle = color;
    ctx.fill();

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = item.kind === "coast" ? "rgba(246,211,123,.62)" : "rgba(246,234,210,.32)";
    ctx.lineWidth = Math.max(0.8, radius * 0.0026);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLight(ctx, radius, cx, cy) {
  ctx.save();

  const glow = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.36,
    radius * 0.08,
    cx,
    cy,
    radius * 1.08
  );

  glow.addColorStop(0, "rgba(255,238,184,.22)");
  glow.addColorStop(0.36, "rgba(143,240,195,.05)");
  glow.addColorStop(1, "rgba(0,0,0,.50)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  const terminator = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  terminator.addColorStop(0, "rgba(255,235,175,.05)");
  terminator.addColorStop(0.50, "rgba(0,0,0,0)");
  terminator.addColorStop(0.82, "rgba(0,0,0,.35)");
  terminator.addColorStop(1, "rgba(0,0,0,.64)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = terminator;
  ctx.fill();

  ctx.restore();
}

function drawLabels(ctx, width, height) {
  ctx.save();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(246,211,123,.94)";
  ctx.font = `${Math.max(22, width * 0.032)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("H-Earth", width / 2, height * 0.08);

  ctx.fillStyle = "rgba(243,227,189,.74)";
  ctx.font = `${Math.max(13, width * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("Orbital / aerial build surface", width / 2, height * 0.114);

  ctx.restore();
}

function drawFrame(timestamp = 0) {
  if (!state.active || !nodes.ctx || !nodes.canvas) return;

  if (!state.reducedMotion && timestamp - state.lastFrameAt < 40) {
    state.animationId = window.requestAnimationFrame(drawFrame);
    return;
  }

  state.lastFrameAt = timestamp;
  state.frame += state.reducedMotion ? 0.15 : 1;

  const width = nodes.canvas.width;
  const height = nodes.canvas.height;
  const radius = Math.min(width, height) * 0.35;
  const cx = width * 0.5;
  const cy = height * 0.52;
  const rotation = state.frame * 0.16;

  clearScene(nodes.ctx, width, height);
  drawStars(nodes.ctx, width, height);
  drawGlobeBase(nodes.ctx, radius, cx, cy);
  drawMaterials(nodes.ctx, radius, cx, cy, rotation);
  drawLight(nodes.ctx, radius, cx, cy);
  drawLabels(nodes.ctx, width, height);

  if (!state.reducedMotion) {
    state.animationId = window.requestAnimationFrame(drawFrame);
  }
}

function handleVisibility() {
  state.active = document.visibilityState !== "hidden";

  if (state.active && !state.animationId) {
    state.animationId = window.requestAnimationFrame(drawFrame);
  }

  if (!state.active && state.animationId) {
    window.cancelAnimationFrame(state.animationId);
    state.animationId = null;
  }
}

function handleResize() {
  window.clearTimeout(state.resizeTimer);

  state.resizeTimer = window.setTimeout(() => {
    setupCanvas();
    updateStatus();
    drawFrame(performance.now());
  }, 160);
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    diagnosticsRoute: DIAGNOSTICS_ROUTE,
    buildMode: BUILD_MODE,
    status: getHEarthPrivateRoomStatus,
    getStatus: getHEarthPrivateRoomStatus,
    getHEarthPrivateRoomStatus
  };

  window.DGBHEarthPrivateRoom = api;
  window.HEarthPrivateRoom = api;
  window.H_EARTH_PRIVATE_ROOM = api;
  window.H_EARTH_PRIVATE_ROOM_RECEIPT = CONTRACT;
}

function getHEarthPrivateRoomStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    diagnosticsRoute: DIAGNOSTICS_ROUTE,
    buildMode: BUILD_MODE,
    status: state.status,
    visibleDiagnostics: false,
    stageFacingSurface: true,
    groundLevelReady: false,
    estatePlacementReady: false,
    parentMutationAuthorized: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };
}

function boot() {
  stampDocument();
  stampHiddenMarkers();
  exposeApi();

  if (!setupCanvas()) {
    state.status = "canvas-context-unavailable";
    stampDocument();
    stampHiddenMarkers();
    return;
  }

  updateStatus();

  document.addEventListener("visibilitychange", handleVisibility, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  state.animationId = window.requestAnimationFrame(drawFrame);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  HTML_CONTRACT,
  PAIR_CONTRACT,
  PREVIOUS_CONTRACT,
  ROUTE,
  DIAGNOSTICS_ROUTE,
  BUILD_MODE,
  getHEarthPrivateRoomStatus
};
