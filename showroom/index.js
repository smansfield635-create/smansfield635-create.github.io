// /showroom/globe/index.js
// SHOWROOM_GLOBE_DISPLAY_CASE_TOUCH_INSPECTION_ROUTE_TNT_v21
// Full-file replacement.
// Globe Showcase display-case route only.
//
// Purpose:
// - Fix blank display-case canvas.
// - Make the display case the inspection preview layer.
// - Add finger drag / touch yaw-pitch test on the selected planet.
// - Keep cards stationary.
// - Keep full inspection route private.
// - Keep diagnostics backstage.
// - Keep parent mutation forbidden.

const CONTRACT = "SHOWROOM_GLOBE_DISPLAY_CASE_TOUCH_INSPECTION_ROUTE_TNT_v21";
const HTML_CONTRACT = "SHOWROOM_GLOBE_SHOWCASE_BOOKCASE_DISPLAY_CASE_HTML_TNT_v20B";
const PAIR_CONTRACT = "SHOWROOM_COVER_GLOBE_SHOWCASE_DISPLAY_CASE_PAIR_TNT_v20";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_SHOWCASE_BOOKCASE_DISPLAY_CASE_ROUTE_TNT_v20C";

const SHOWROOM_MODE = "showcase-bookcase-display-case";
const DEFAULT_DISPLAY = "h-earth";
const CARD_TRANSFORM = "forbidden";

const WORLDS = Object.freeze([
  {
    key: "earth",
    name: "Earth",
    route: "/showroom/globe/earth/",
    label: "Protected reference body.",
    layer: "reference",
    palette: { ocean:"#0d4f86", land:"#4f7d4b", coast:"#c7ad74", relief:"#8b8878", ice:"#e2f2f6", glow:"#8ebeff" }
  },
  {
    key: "h-earth",
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    label: "Hybrid Earth. Active orbital/aerial build planet.",
    layer: "active-build",
    palette: { ocean:"#0b315f", land:"#6f9854", coast:"#d2b77b", relief:"#908866", ice:"#d8edf4", glow:"#8ff0c3" }
  },
  {
    key: "hearth",
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    label: "Separate terrain lane.",
    layer: "regression",
    palette: { ocean:"#173c56", land:"#8f7144", coast:"#d0a66e", relief:"#a35f45", ice:"#d6e6e9", glow:"#f4bf60" }
  },
  {
    key: "audralia",
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    label: "Constructed-world lane.",
    layer: "constructed-world",
    palette: { ocean:"#0f456f", land:"#7fa05a", coast:"#c9aa6e", relief:"#8f6d54", ice:"#cfe8ee", glow:"#b8a6ff" }
  }
]);

const MATERIALS = Object.freeze([
  { lat:58, lon:-130, rx:.22, ry:.07, kind:"ice" },
  { lat:42, lon:-92, rx:.23, ry:.10, kind:"land" },
  { lat:21, lon:-62, rx:.17, ry:.08, kind:"coast" },
  { lat:8, lon:-18, rx:.20, ry:.11, kind:"land" },
  { lat:-12, lon:28, rx:.19, ry:.09, kind:"relief" },
  { lat:-26, lon:74, rx:.18, ry:.08, kind:"land" },
  { lat:-46, lon:118, rx:.22, ry:.08, kind:"coast" },
  { lat:31, lon:146, rx:.17, ry:.07, kind:"relief" },
  { lat:-62, lon:-18, rx:.25, ry:.06, kind:"ice" },
  { lat:4, lon:-154, rx:.10, ry:.04, kind:"island" },
  { lat:-34, lon:-132, rx:.11, ry:.04, kind:"island" }
]);

const state = {
  activeWorld: DEFAULT_DISPLAY,
  yaw: -22,
  pitch: 8,
  zoom: 1,
  autoSpin: true,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,
  pointerId: null,
  frame: 0,
  lastFrameAt: 0,
  active: true,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  animationId: null,
  resizeTimer: 0
};

const nodes = {
  displayCanvas: null,
  displayCtx: null,
  displayTitle: null,
  displayCopy: null,
  displayMeta: null,
  inspectSelected: null,
  cards: new Map(),
  previews: new Map()
};

function byId(id) {
  return document.getElementById(id);
}

function worldByKey(key) {
  return WORLDS.find((world) => world.key === key) || WORLDS.find((world) => world.key === DEFAULT_DISPLAY);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setupCanvas(canvas, fallback = 600) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(180, Math.floor(rect.width || canvas.clientWidth || fallback));
  const cssHeight = Math.max(180, Math.floor(rect.height || canvas.clientHeight || cssWidth));
  const width = Math.floor(cssWidth * state.dpr);
  const height = Math.floor(cssHeight * state.dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  canvas.style.transform = "none";
  canvas.style.touchAction = "none";
  canvas.dataset.cardTransform = "forbidden";

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx;
}

function collectNodes() {
  nodes.displayCanvas = byId("displayCanvas");
  nodes.displayCtx = setupCanvas(nodes.displayCanvas, 720);
  nodes.displayTitle = byId("displayTitle");
  nodes.displayCopy = byId("displayCopy");
  nodes.displayMeta = byId("displayMeta");
  nodes.inspectSelected = byId("inspectSelected");

  nodes.cards.clear();
  document.querySelectorAll("[data-world-card]").forEach((card) => {
    const key = card.getAttribute("data-world-card");
    nodes.cards.set(key, card);
    card.dataset.cardTransform = "forbidden";
    card.style.transform = "none";
  });

  nodes.previews.clear();
  document.querySelectorAll("[data-preview-canvas]").forEach((canvas) => {
    const key = canvas.getAttribute("data-preview-canvas");
    nodes.previews.set(key, { canvas, ctx: setupCanvas(canvas, 220) });
  });
}

function stampDocument(world) {
  const root = document.documentElement;

  root.dataset.routeReceipt = CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.pairReceipt = PAIR_CONTRACT;
  root.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  root.dataset.showroomMode = SHOWROOM_MODE;
  root.dataset.activeDisplay = world.key;
  root.dataset.activeInspectionRoute = world.route;
  root.dataset.displayCaseLayer = "touch-drag-inspection-preview";
  root.dataset.touchDragInspection = "true";
  root.dataset.cardTransform = CARD_TRANSFORM;
  root.dataset.parentMutationAuthorized = "false";
  root.dataset.visibleDiagnostics = "false";
  root.dataset.generatedImage = "false";
  root.dataset.graphicBox = "false";
  root.dataset.visualPassClaim = "false";
}

function metaBlock(label, value) {
  const span = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = label;
  span.appendChild(strong);
  span.append(value);
  return span;
}

function updateDisplay(world) {
  if (nodes.displayTitle) nodes.displayTitle.textContent = world.name;
  if (nodes.displayCopy) nodes.displayCopy.textContent = world.label;
  if (nodes.inspectSelected) nodes.inspectSelected.href = world.route;

  if (nodes.displayMeta) {
    nodes.displayMeta.replaceChildren(
      metaBlock("Layer", "Display case"),
      metaBlock("Selection", world.name),
      metaBlock("Touch test", "Drag planet")
    );
  }

  for (const [key, card] of nodes.cards.entries()) {
    card.setAttribute("aria-selected", String(key === world.key));
    card.dataset.activeDisplay = String(key === world.key);
    card.style.transform = "none";
  }

  stampDocument(world);
}

function selectWorld(key) {
  const world = worldByKey(key);
  state.activeWorld = world.key;
  state.yaw = world.key === "h-earth" ? -22 : 0;
  state.pitch = world.key === "hearth" ? -8 : 8;
  state.zoom = 1;
  updateDisplay(world);
  drawNow();
}

function colorFor(world, kind) {
  if (kind === "ice") return world.palette.ice;
  if (kind === "relief") return world.palette.relief;
  if (kind === "coast") return world.palette.coast;
  if (kind === "island") return world.palette.land;
  return world.palette.land;
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

function project(latDeg, lonDeg, radius, cx, cy, yawDeg, pitchDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = ((lonDeg + yawDeg) * Math.PI) / 180;
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

function clearScene(ctx, width, height, world, compact) {
  const bg = ctx.createRadialGradient(width * .5, height * .46, width * .04, width * .5, height * .5, width * .78);
  bg.addColorStop(0, `${world.palette.glow}55`);
  bg.addColorStop(.40, "#07152b");
  bg.addColorStop(1, "#01030a");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = compact ? .42 : .58;

  const count = compact ? 34 : 110;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.17) * .5 + .5) * width;
    const y = (Math.cos(i * 49.61) * .5 + .5) * height;
    const r = compact ? .8 : .65 + ((i * 7) % 11) / 15;

    ctx.beginPath();
    ctx.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.70)" : "rgba(225,238,255,.56)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGlobe(ctx, world, width, height, yaw, pitch, zoom, compact) {
  const baseRadius = Math.min(width, height) * (compact ? .33 : .35);
  const radius = baseRadius * clamp(zoom, .78, 1.55);
  const cx = width * .5;
  const cy = height * (compact ? .5 : .52);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - radius * .32, cy - radius * .35, radius * .08, cx, cy, radius * 1.15);
  ocean.addColorStop(0, shade(world.palette.ocean, 1.4));
  ocean.addColorStop(.36, world.palette.ocean);
  ocean.addColorStop(.74, shade(world.palette.ocean, .52));
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const projected = [];

  for (const item of MATERIALS) {
    const point = project(item.lat, item.lon + WORLDS.indexOf(world) * 14, radius, cx, cy, yaw, pitch);
    if (!point) continue;
    projected.push({ item, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * .997, 0, Math.PI * 2);
  ctx.clip();

  for (const { item, point } of projected) {
    const sizeX = radius * item.rx * (.75 + point.z * .35);
    const sizeY = radius * item.ry * (.75 + point.z * .35);
    const fill = shade(colorFor(world, item.kind), point.light);

    ctx.beginPath();

    if (item.kind === "relief") {
      ctx.moveTo(point.x, point.y - sizeY * 1.15);
      ctx.lineTo(point.x + sizeX, point.y - sizeY * .18);
      ctx.lineTo(point.x + sizeX * .55, point.y + sizeY);
      ctx.lineTo(point.x - sizeX * .62, point.y + sizeY * .72);
      ctx.lineTo(point.x - sizeX, point.y - sizeY * .12);
      ctx.closePath();
    } else {
      ctx.ellipse(point.x, point.y, sizeX, sizeY, .12, 0, Math.PI * 2);
    }

    ctx.globalAlpha = item.kind === "ice" ? .94 : .88;
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.globalAlpha = .22;
    ctx.strokeStyle = item.kind === "coast" ? "rgba(246,211,123,.62)" : "rgba(246,234,210,.32)";
    ctx.lineWidth = Math.max(.8, radius * .0026);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  const light = ctx.createRadialGradient(cx - radius * .34, cy - radius * .36, radius * .08, cx, cy, radius * 1.08);
  light.addColorStop(0, "rgba(255,238,184,.22)");
  light.addColorStop(.36, `${world.palette.glow}18`);
  light.addColorStop(1, "rgba(0,0,0,.50)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = light;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.015, 0, Math.PI * 2);
  ctx.strokeStyle = `${world.palette.glow}55`;
  ctx.lineWidth = Math.max(compact ? 4 : 9, radius * .035);
  ctx.stroke();
  ctx.restore();

  if (!compact) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246,211,123,.94)";
    ctx.font = `${Math.max(22, width * .032)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText(world.name, width / 2, height * .08);

    ctx.fillStyle = "rgba(243,227,189,.74)";
    ctx.font = `${Math.max(13, width * .016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText("Drag with finger to inspect", width / 2, height * .114);
    ctx.restore();
  }
}

function drawWorld(canvas, ctx, world, yaw, pitch, zoom, compact = false) {
  if (!canvas || !ctx) return;
  clearScene(ctx, canvas.width, canvas.height, world, compact);
  drawGlobe(ctx, world, canvas.width, canvas.height, yaw, pitch, zoom, compact);
}

function drawNow() {
  const active = worldByKey(state.activeWorld);
  drawWorld(nodes.displayCanvas, nodes.displayCtx, active, state.yaw, state.pitch, state.zoom, false);

  for (const world of WORLDS) {
    const preview = nodes.previews.get(world.key);
    if (!preview) continue;
    const previewYaw = state.frame * .24 + WORLDS.indexOf(world) * 32;
    drawWorld(preview.canvas, preview.ctx, world, previewYaw, 10, 1, true);
  }
}

function drawFrame(timestamp = 0) {
  if (!state.active) return;

  if (!state.reducedMotion && timestamp - state.lastFrameAt < 42) {
    state.animationId = window.requestAnimationFrame(drawFrame);
    return;
  }

  state.lastFrameAt = timestamp;
  state.frame += 1;

  if (state.autoSpin && !state.dragging) {
    state.yaw += .18;
  }

  drawNow();

  if (!state.reducedMotion) {
    state.animationId = window.requestAnimationFrame(drawFrame);
  }
}

function onPointerDown(event) {
  if (!nodes.displayCanvas) return;

  state.dragging = true;
  state.autoSpin = false;
  state.pointerId = event.pointerId;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragStartYaw = state.yaw;
  state.dragStartPitch = state.pitch;

  nodes.displayCanvas.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function onPointerMove(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;

  const dx = event.clientX - state.dragStartX;
  const dy = event.clientY - state.dragStartY;

  state.yaw = state.dragStartYaw + dx * .45;
  state.pitch = clamp(state.dragStartPitch - dy * .32, -62, 62);

  drawNow();
  event.preventDefault();
}

function onPointerUp(event) {
  if (event.pointerId !== state.pointerId) return;

  state.dragging = false;
  state.pointerId = null;
  nodes.displayCanvas?.releasePointerCapture?.(event.pointerId);
  event.preventDefault();
}

function onWheel(event) {
  state.zoom = clamp(state.zoom + (event.deltaY < 0 ? .08 : -.08), .78, 1.55);
  state.autoSpin = false;
  drawNow();
  event.preventDefault();
}

function wireEvents() {
  for (const [key, card] of nodes.cards.entries()) {
    card.addEventListener("click", () => selectWorld(key));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectWorld(key);
    });
  }

  if (nodes.displayCanvas) {
    nodes.displayCanvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    nodes.displayCanvas.addEventListener("pointermove", onPointerMove, { passive: false });
    nodes.displayCanvas.addEventListener("pointerup", onPointerUp, { passive: false });
    nodes.displayCanvas.addEventListener("pointercancel", onPointerUp, { passive: false });
    nodes.displayCanvas.addEventListener("wheel", onWheel, { passive: false });
  }

  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active && !state.animationId) {
      state.animationId = window.requestAnimationFrame(drawFrame);
    }

    if (!state.active && state.animationId) {
      window.cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      collectNodes();
      updateDisplay(worldByKey(state.activeWorld));
      drawNow();
    }, 160);
  }, { passive: true });
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    mode: SHOWROOM_MODE,
    selectWorld,
    status: getShowroomGlobeShowcaseStatus,
    getStatus: getShowroomGlobeShowcaseStatus,
    getShowroomGlobeShowcaseStatus
  };

  window.DGBShowroomGlobeShowcase = api;
  window.ShowroomGlobeShowcase = api;
  window.SHOWROOM_GLOBE_SHOWCASE_RECEIPT = CONTRACT;
}

function getShowroomGlobeShowcaseStatus() {
  const world = worldByKey(state.activeWorld);

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    showroomMode: SHOWROOM_MODE,
    activeDisplay: world.key,
    activeDisplayName: world.name,
    activeInspectionRoute: world.route,
    displayCaseLayer: "touch-drag-inspection-preview",
    touchDragInspection: true,
    yaw: state.yaw,
    pitch: state.pitch,
    zoom: state.zoom,
    visibleDiagnostics: false,
    cardTransform: CARD_TRANSFORM,
    parentMutationAuthorized: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };
}

function boot() {
  collectNodes();
  exposeApi();
  wireEvents();
  selectWorld(DEFAULT_DISPLAY);

  state.animationId = window.requestAnimationFrame(drawFrame);

  if (state.reducedMotion) {
    drawFrame(performance.now());
  }
}

function bootWhenReady() {
  stampDocument(worldByKey(DEFAULT_DISPLAY));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

bootWhenReady();

export {
  CONTRACT,
  HTML_CONTRACT,
  PAIR_CONTRACT,
  PREVIOUS_CONTRACT,
  SHOWROOM_MODE,
  DEFAULT_DISPLAY,
  WORLDS,
  getShowroomGlobeShowcaseStatus
};
