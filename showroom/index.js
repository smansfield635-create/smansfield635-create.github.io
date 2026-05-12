// /showroom/globe/index.js
// SHOWROOM_GLOBE_LOW_BUDGET_PLANET_PORTRAIT_ROUTE_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Rebuild Globe Showcase from scratch after overwrite.
// - Show the best coded portraits of Earth, H-Earth, Hearth, and Audralia.
// - Keep private planet renderers asleep.
// - Avoid runtime budget absorption.
// - Render one selected display canvas plus small static thumbnail canvases.
// - Cap DPR.
// - Pause when hidden or offscreen.
// - No generated image.
// - No GraphicBox.
// - No visual pass claim.

const CONTRACT = "SHOWROOM_GLOBE_LOW_BUDGET_PLANET_PORTRAIT_ROUTE_TNT_v1";
const HTML_CONTRACT = "SHOWROOM_GLOBE_LOW_BUDGET_PLANET_PORTRAIT_HTML_TNT_v1";
const ROUTE = "/showroom/globe/";

const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;
const PRIVATE_RENDERERS_LOADED = false;

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 66 : 48;

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    copy: "Reference body. Blue marble restraint without private renderer load.",
    route: "/showroom/globe/earth/",
    badge: "Earth · reference portrait",
    palette: {
      oceanA: "#0b3d78",
      oceanB: "#126ba0",
      oceanC: "#071d46",
      landA: "#6fa66c",
      landB: "#d1c691",
      landC: "#edf3df",
      cloud: "rgba(242,248,255,.72)",
      atmosphere: "rgba(118,184,255,.36)",
      glow: "rgba(142,190,255,.26)"
    },
    landRatio: 0.32,
    cloudRatio: 0.42,
    relief: 0.30,
    seed: 11
  },
  "h-earth": {
    key: "h-earth",
    title: "H-Earth",
    copy: "Hybrid build planet. Land-state candidates visible without opening the private renderer.",
    route: "/showroom/globe/h-earth/",
    badge: "H-Earth · active build portrait",
    palette: {
      oceanA: "#07385c",
      oceanB: "#1a7c91",
      oceanC: "#04182b",
      landA: "#8ca76a",
      landB: "#b8b979",
      landC: "#d8e7cf",
      cloud: "rgba(231,246,255,.54)",
      atmosphere: "rgba(143,240,195,.36)",
      glow: "rgba(143,240,195,.20)"
    },
    landRatio: 0.22,
    cloudRatio: 0.24,
    relief: 0.42,
    seed: 29
  },
  hearth: {
    key: "hearth",
    title: "Hearth",
    copy: "Warm terrain lane. Relief, stone pressure, and mineral surface without runtime storm.",
    route: "/showroom/globe/hearth/",
    badge: "Hearth · terrain portrait",
    palette: {
      oceanA: "#1d3039",
      oceanB: "#34525e",
      oceanC: "#0b1419",
      landA: "#9b6041",
      landB: "#d09a62",
      landC: "#f0c98a",
      cloud: "rgba(255,231,196,.34)",
      atmosphere: "rgba(244,191,96,.25)",
      glow: "rgba(244,191,96,.18)"
    },
    landRatio: 0.52,
    cloudRatio: 0.13,
    relief: 0.74,
    seed: 43
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    copy: "Constructed world. Separate identity, never Earth and never Australia.",
    route: "/showroom/globe/audralia/",
    badge: "Audralia · constructed portrait",
    palette: {
      oceanA: "#14225c",
      oceanB: "#2c6f9a",
      oceanC: "#090b2d",
      landA: "#7fb49a",
      landB: "#b7a1d6",
      landC: "#e2d6ff",
      cloud: "rgba(226,215,255,.38)",
      atmosphere: "rgba(190,170,255,.32)",
      glow: "rgba(190,170,255,.20)"
    },
    landRatio: 0.36,
    cloudRatio: 0.18,
    relief: 0.56,
    seed: 71
  }
});

const state = {
  selected: "h-earth",
  displayCanvas: null,
  displayContext: null,
  displayWindow: null,
  title: null,
  copy: null,
  badge: null,
  inspect: null,
  meta: null,
  cards: [],
  previewCanvases: [],
  active: true,
  visible: true,
  raf: 0,
  lastFrameAt: 0,
  phase: 0,
  dragPhase: 0,
  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartPhase: 0,
  renderedPreviews: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function byId(id) {
  return document.getElementById(id);
}

function hash(seed, index, salt = 0) {
  const x = Math.sin((seed + 1) * 97.13 + (index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pickWorld(key) {
  return WORLDS[key] || WORLDS["h-earth"];
}

function sizeCanvas(canvas, square = true) {
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(96, Math.floor(rect.width || canvas.clientWidth || canvas.width || 320));
  const cssHeight = square ? cssWidth : Math.max(96, Math.floor(rect.height || canvas.clientHeight || cssWidth));

  const width = Math.floor(cssWidth * DPR);
  const height = Math.floor(cssHeight * DPR);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return {
    width,
    height,
    context: canvas.getContext("2d", { alpha: false })
  };
}

function clearCanvas(context, width, height) {
  const bg = context.createRadialGradient(
    width * 0.50,
    height * 0.42,
    width * 0.04,
    width * 0.50,
    height * 0.54,
    width * 0.76
  );

  bg.addColorStop(0, "#10203d");
  bg.addColorStop(0.44, "#071226");
  bg.addColorStop(1, "#01030a");

  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);
}

function drawStars(context, width, height, seed, density) {
  context.save();
  context.globalAlpha = density;

  const count = MOBILE ? 34 : 62;

  for (let i = 0; i < count; i += 1) {
    const x = hash(seed, i, 2) * width;
    const y = hash(seed, i, 3) * height;
    const radius = (0.55 + hash(seed, i, 4) * 1.3) * DPR;

    context.beginPath();
    context.fillStyle = i % 12 === 0 ? "rgba(244,191,96,.48)" : "rgba(225,238,255,.46)";
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function sphereGradient(context, cx, cy, radius, world) {
  const p = world.palette;
  const gradient = context.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.38,
    radius * 0.08,
    cx,
    cy,
    radius * 1.05
  );

  gradient.addColorStop(0, p.oceanB);
  gradient.addColorStop(0.38, p.oceanA);
  gradient.addColorStop(0.78, p.oceanC);
  gradient.addColorStop(1, "#01040d");

  return gradient;
}

function drawAtmosphere(context, cx, cy, radius, world) {
  const p = world.palette;

  context.save();
  context.globalCompositeOperation = "lighter";

  const glow = context.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.22);
  glow.addColorStop(0, "rgba(255,255,255,0)");
  glow.addColorStop(0.62, p.atmosphere);
  glow.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = glow;
  context.beginPath();
  context.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = p.atmosphere;
  context.lineWidth = Math.max(1, radius * 0.018);
  context.globalAlpha = 0.62;
  context.beginPath();
  context.arc(cx, cy, radius * 1.006, 0, Math.PI * 2);
  context.stroke();

  context.restore();
}

function drawTerminator(context, cx, cy, radius, phase, thumbnail) {
  context.save();
  context.globalCompositeOperation = "multiply";

  const offset = Math.sin(phase) * radius * 0.18;
  const darkness = context.createRadialGradient(
    cx + radius * 0.52 + offset,
    cy + radius * 0.04,
    radius * 0.10,
    cx + radius * 0.56 + offset,
    cy + radius * 0.04,
    radius * 1.12
  );

  darkness.addColorStop(0, "rgba(0,0,0,0)");
  darkness.addColorStop(0.42, "rgba(0,0,0,.20)");
  darkness.addColorStop(0.78, "rgba(0,0,0,.72)");
  darkness.addColorStop(1, "rgba(0,0,0,.92)");

  context.fillStyle = darkness;
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fill();

  context.restore();

  if (!thumbnail) {
    context.save();
    context.globalCompositeOperation = "lighter";
    const shine = context.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.38,
      radius * 0.02,
      cx - radius * 0.35,
      cy - radius * 0.38,
      radius * 0.50
    );
    shine.addColorStop(0, "rgba(255,255,255,.26)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = shine;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function drawLandBlob(context, cx, cy, radius, world, index, phase, scaleBias = 1) {
  const seed = world.seed;
  const p = world.palette;

  const baseAngle = hash(seed, index, 10) * Math.PI * 2 + phase * (0.35 + hash(seed, index, 18) * 0.25);
  const latitude = (hash(seed, index, 11) - 0.5) * 1.25;
  const distance = hash(seed, index, 12) * radius * 0.54;

  const x = cx + Math.cos(baseAngle) * distance;
  const y = cy + latitude * radius * 0.50 + Math.sin(baseAngle * 0.7) * radius * 0.08;
  const blobRadius = radius * (0.08 + hash(seed, index, 13) * 0.17) * scaleBias;

  const polarCut = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5;
  if (polarCut > radius * 0.88) return;

  const points = 9 + Math.floor(hash(seed, index, 14) * 7);

  context.beginPath();

  for (let i = 0; i <= points; i += 1) {
    const t = (i / points) * Math.PI * 2;
    const jag = 0.70 + hash(seed, index * 19 + i, 15) * 0.60;
    const sx = x + Math.cos(t) * blobRadius * jag * (1.15 + world.relief * 0.22);
    const sy = y + Math.sin(t) * blobRadius * jag * (0.52 + hash(seed, index, 16) * 0.46);

    if (i === 0) context.moveTo(sx, sy);
    else context.lineTo(sx, sy);
  }

  context.closePath();

  const land = context.createLinearGradient(x - blobRadius, y - blobRadius, x + blobRadius, y + blobRadius);
  land.addColorStop(0, p.landC);
  land.addColorStop(0.36, p.landB);
  land.addColorStop(1, p.landA);

  context.fillStyle = land;
  context.globalAlpha = 0.74 + world.relief * 0.18;
  context.fill();

  context.globalAlpha = 0.18 + world.relief * 0.18;
  context.strokeStyle = "rgba(255,255,255,.42)";
  context.lineWidth = Math.max(0.6, radius * 0.004);
  context.stroke();
}

function drawTerrainDetails(context, cx, cy, radius, world, phase, thumbnail) {
  if (thumbnail) return;

  context.save();
  context.globalCompositeOperation = "screen";

  const count = world.key === "earth" ? 18 : world.key === "h-earth" ? 26 : world.key === "hearth" ? 38 : 30;

  for (let i = 0; i < count; i += 1) {
    const angle = hash(world.seed, i, 40) * Math.PI * 2 + phase * 0.22;
    const d = hash(world.seed, i, 41) * radius * 0.72;
    const x = cx + Math.cos(angle) * d;
    const y = cy + (hash(world.seed, i, 42) - 0.5) * radius * 1.08;

    if ((x - cx) ** 2 + (y - cy) ** 2 > radius ** 2 * 0.86) continue;

    const len = radius * (0.025 + hash(world.seed, i, 43) * 0.09);
    const a = angle + Math.PI * 0.5;

    context.strokeStyle =
      world.key === "hearth"
        ? "rgba(255,216,148,.22)"
        : world.key === "audralia"
          ? "rgba(214,200,255,.20)"
          : "rgba(230,248,255,.18)";

    context.lineWidth = Math.max(0.5, radius * 0.004);
    context.beginPath();
    context.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
    context.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    context.stroke();
  }

  context.restore();
}

function drawClouds(context, cx, cy, radius, world, phase, thumbnail) {
  const p = world.palette;
  const count = thumbnail ? 8 : Math.floor(18 + world.cloudRatio * 28);

  context.save();
  context.globalCompositeOperation = "screen";
  context.fillStyle = p.cloud;
  context.strokeStyle = p.cloud;

  for (let i = 0; i < count; i += 1) {
    const angle = hash(world.seed, i, 70) * Math.PI * 2 + phase * (0.55 + hash(world.seed, i, 77) * 0.12);
    const lat = (hash(world.seed, i, 71) - 0.5) * radius * 1.12;
    const d = hash(world.seed, i, 72) * radius * 0.54;
    const x = cx + Math.cos(angle) * d;
    const y = cy + lat;

    if ((x - cx) ** 2 + (y - cy) ** 2 > radius ** 2 * 0.86) continue;

    const w = radius * (0.05 + hash(world.seed, i, 73) * 0.13);
    const h = radius * (0.010 + hash(world.seed, i, 74) * 0.028);

    context.globalAlpha = thumbnail ? 0.28 : 0.22 + world.cloudRatio * 0.30;
    context.beginPath();
    context.ellipse(x, y, w, h, angle * 0.4, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawHexHint(context, cx, cy, radius, world, phase, thumbnail) {
  if (thumbnail || world.key !== "h-earth") return;

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.10;
  context.strokeStyle = "rgba(143,240,195,.32)";
  context.lineWidth = Math.max(0.4, radius * 0.002);

  const step = radius * 0.18;

  for (let y = -radius * 0.72; y <= radius * 0.72; y += step) {
    for (let x = -radius * 0.72; x <= radius * 0.72; x += step) {
      const px = cx + x + Math.sin(phase + y * 0.01) * radius * 0.012;
      const py = cy + y;
      if ((px - cx) ** 2 + (py - cy) ** 2 > radius ** 2 * 0.74) continue;

      context.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = Math.PI / 6 + i * Math.PI / 3;
        const hx = px + Math.cos(a) * step * 0.22;
        const hy = py + Math.sin(a) * step * 0.22;
        if (i === 0) context.moveTo(hx, hy);
        else context.lineTo(hx, hy);
      }
      context.closePath();
      context.stroke();
    }
  }

  context.restore();
}

function drawPlanet(context, width, height, world, options = {}) {
  const thumbnail = options.thumbnail === true;
  const phase = options.phase || 0;

  clearCanvas(context, width, height);
  drawStars(context, width, height, world.seed, thumbnail ? 0.30 : 0.42);

  const cx = width * 0.5;
  const cy = height * (thumbnail ? 0.50 : 0.52);
  const radius = Math.min(width, height) * (thumbnail ? 0.34 : 0.365);

  drawAtmosphere(context, cx, cy, radius, world);

  context.save();
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.clip();

  context.fillStyle = sphereGradient(context, cx, cy, radius, world);
  context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const landCount = thumbnail
    ? Math.floor(4 + world.landRatio * 8)
    : Math.floor(10 + world.landRatio * 34);

  for (let i = 0; i < landCount; i += 1) {
    drawLandBlob(context, cx, cy, radius, world, i, phase, thumbnail ? 0.82 : 1);
  }

  drawTerrainDetails(context, cx, cy, radius, world, phase, thumbnail);
  drawHexHint(context, cx, cy, radius, world, phase, thumbnail);
  drawClouds(context, cx, cy, radius, world, phase, thumbnail);
  drawTerminator(context, cx, cy, radius, phase, thumbnail);

  context.restore();

  context.save();
  context.globalCompositeOperation = "lighter";
  context.globalAlpha = thumbnail ? 0.24 : 0.36;

  const rim = context.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.08);
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(0.80, world.palette.glow);
  rim.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = rim;
  context.beginPath();
  context.arc(cx, cy, radius * 1.08, 0, Math.PI * 2);
  context.fill();

  context.restore();

  context.save();
  context.strokeStyle = "rgba(255,255,255,.12)";
  context.lineWidth = Math.max(1, radius * 0.010);
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function renderPreviews() {
  if (state.renderedPreviews) return;

  state.previewCanvases.forEach((canvas) => {
    const key = canvas.dataset.previewCanvas;
    const world = pickWorld(key);
    const sized = sizeCanvas(canvas, true);
    drawPlanet(sized.context, sized.width, sized.height, world, {
      thumbnail: true,
      phase: hash(world.seed, 1, 101) * Math.PI * 2
    });
  });

  state.renderedPreviews = true;
}

function updateSelection(key, pushFocus = false) {
  const world = pickWorld(key);
  state.selected = world.key;

  state.cards.forEach((card) => {
    const selected = card.dataset.worldCard === world.key;
    card.setAttribute("aria-selected", String(selected));
  });

  if (state.title) state.title.textContent = world.title;
  if (state.copy) state.copy.textContent = world.copy;
  if (state.badge) state.badge.textContent = world.badge;
  if (state.inspect) state.inspect.href = world.route;

  if (state.meta) {
    state.meta.innerHTML = `
      <span><strong>Layer</strong>Showcase portrait</span>
      <span><strong>Runtime</strong>Low budget</span>
      <span><strong>Private engines</strong>Sleeping</span>
    `;
  }

  document.documentElement.dataset.showroomGlobeSelected = world.key;
  document.documentElement.dataset.privateRenderersLoaded = "false";

  renderDisplay(performance.now());

  if (pushFocus && state.displayWindow) {
    state.displayWindow.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function renderDisplay(time = 0) {
  if (!state.displayCanvas) return;

  const sized = sizeCanvas(state.displayCanvas, true);
  state.displayContext = sized.context;

  const world = pickWorld(state.selected);
  drawPlanet(sized.context, sized.width, sized.height, world, {
    thumbnail: false,
    phase: state.phase + state.dragPhase
  });
}

function frame(time = 0) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  const elapsed = time - state.lastFrameAt;

  if (elapsed >= FRAME_MS) {
    state.lastFrameAt = time;

    if (!REDUCED_MOTION && !state.dragging) {
      state.phase += MOBILE ? 0.008 : 0.012;
    }

    renderDisplay(time);
  }

  state.raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (state.raf || !state.active || !state.visible) return;
  state.lastFrameAt = 0;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

function wireCards() {
  state.cards.forEach((card) => {
    card.addEventListener("click", () => {
      updateSelection(card.dataset.worldCard || "h-earth", true);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateSelection(card.dataset.worldCard || "h-earth", true);
      }
    });
  });
}

function wireDisplayInteraction() {
  const canvas = state.displayCanvas;
  if (!canvas || canvas.dataset.lowBudgetGlobeInteractionBound === "true") return;

  canvas.dataset.lowBudgetGlobeInteractionBound = "true";

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartPhase = state.dragPhase;
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.dragStartX;
    state.dragPhase = state.dragStartPhase + dx * 0.008;

    renderDisplay(performance.now());
    event.preventDefault();
  }, { passive: false });

  const finish = (event) => {
    if (event.pointerId !== state.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  canvas.addEventListener("pointerup", finish, { passive: false });
  canvas.addEventListener("pointercancel", finish, { passive: false });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
  }, { passive: false });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active) startLoop();
    else stopLoop();

    stampDocument();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.displayWindow) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      state.visible = entry?.isIntersecting !== false;

      if (state.visible) startLoop();
      else stopLoop();

      stampDocument();
    }, { threshold: 0.08 });

    observer.observe(state.displayWindow);
  }
}

function installResize() {
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__globeShowcaseResizeTimer);
    window.__globeShowcaseResizeTimer = window.setTimeout(() => {
      state.renderedPreviews = false;
      renderPreviews();
      renderDisplay(performance.now());
    }, 180);
  }, { passive: true });
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.showroomGlobeRouteReceipt = CONTRACT;
  root.dataset.showroomGlobeHtmlReceipt = HTML_CONTRACT;
  root.dataset.showroomGlobeRoute = ROUTE;
  root.dataset.showroomGlobeSelected = state.selected;
  root.dataset.showroomGlobeLowBudgetPortraits = "true";
  root.dataset.showroomGlobePrivateRenderersLoaded = String(PRIVATE_RENDERERS_LOADED);
  root.dataset.showroomGlobeDprCap = String(DPR);
  root.dataset.showroomGlobeActive = String(state.active);
  root.dataset.showroomGlobeVisible = String(state.visible);
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
}

function getShowroomGlobeStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    route: ROUTE,
    selected: state.selected,
    worlds: Object.keys(WORLDS),
    lowBudgetPortraits: true,
    privateRenderersLoaded: PRIVATE_RENDERERS_LOADED,
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM,
    dprCap: DPR,
    active: state.active,
    visible: state.visible,
    phase: state.phase,
    dragPhase: state.dragPhase
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    htmlContract: HTML_CONTRACT,
    route: ROUTE,
    select: updateSelection,
    render: renderDisplay,
    status: getShowroomGlobeStatus,
    getStatus: getShowroomGlobeStatus,
    getShowroomGlobeStatus
  };

  window.DGBShowroomGlobe = api;
  window.ShowroomGlobe = api;
  window.SHOWROOM_GLOBE_RECEIPT = CONTRACT;
}

function boot() {
  state.displayCanvas = byId("displayCanvas");
  state.displayWindow = byId("displayWindow");
  state.title = byId("displayTitle");
  state.copy = byId("displayCopy");
  state.badge = byId("displayBadge");
  state.inspect = byId("inspectSelected");
  state.meta = byId("displayMeta");
  state.cards = Array.from(document.querySelectorAll("[data-world-card]"));
  state.previewCanvases = Array.from(document.querySelectorAll("[data-preview-canvas]"));

  renderPreviews();
  wireCards();
  wireDisplayInteraction();
  installVisibility();
  installResize();
  exposeApi();
  stampDocument();

  updateSelection("h-earth", false);
  startLoop();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  HTML_CONTRACT,
  ROUTE,
  WORLDS,
  GENERATED_IMAGE,
  GRAPHIC_BOX,
  VISUAL_PASS_CLAIM,
  PRIVATE_RENDERERS_LOADED,
  updateSelection,
  renderDisplay,
  getShowroomGlobeStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  htmlContract: HTML_CONTRACT,
  route: ROUTE,
  select: updateSelection,
  render: renderDisplay,
  status: getShowroomGlobeStatus,
  getStatus: getShowroomGlobeStatus,
  getShowroomGlobeStatus
};
