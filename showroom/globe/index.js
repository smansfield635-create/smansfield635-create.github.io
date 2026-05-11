// /showroom/globe/index.js
// SHOWROOM_GLOBE_INSPECTION_HEAVY_H_EARTH_DISPLAY_CASE_TNT_v1
// Full-file replacement.
// Globe Showcase route only.
//
// Purpose:
// - Keep /showroom/globe/ as the Showcase / Bookcase / Display Case layer.
// - Make the selected H-Earth display inspection-heavy instead of preview-only.
// - Load the actual H-Earth visual canvas asset into the display case.
// - Allow finger drag / pointer drag / wheel zoom on the displayed H-Earth figure.
// - Keep H-Earth full private route available as "Open Full Inspection".
// - Keep diagnostics backstage.
// - Do not mutate H-Earth parent truth.
// - Do not touch gauges.
// - Do not use image generation.
// - Do not use GraphicBox.

const CONTRACT = "SHOWROOM_GLOBE_INSPECTION_HEAVY_H_EARTH_DISPLAY_CASE_TNT_v1";
const PREVIOUS_CONTRACT = "H_EARTH_LEAP_RENDER_CONSUMPTION_TNT_v1";
const HTML_EXPECTED = "SHOWROOM_GLOBE_LEAP_RENDER_CONSUMPTION_HTML_ALIGNMENT_TNT_v21A";

const SHOWROOM_MODE = "showcase-bookcase-display-case";
const DISPLAY_CASE_MODE = "inspection-heavy";
const DEFAULT_DISPLAY = "h-earth";
const CARD_TRANSFORM = "forbidden";

const H_EARTH_CANVAS_PATH = "/assets/h-earth/h-earth/canvas.alignment.v3.js";
const H_EARTH_CANVAS_EXPECTED = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const H_EARTH_VISUAL_RENEWAL_EXPECTED = "H_EARTH_ORBITAL_VISUAL_DEFINITION_CONSUMER_TNT_v1";

const DEFINITIVE_LAND_STATE_REQUIRED = true;
const LAND_STATE_CLASSIFICATION_REQUIRED = true;
const ELEVATION_SEA_LEVEL_BOUND = true;
const TERRAIN_DETAIL_CONSUMPTION_ACTIVE = true;
const ORBITAL_AERIAL_DEFINITION_ACTIVE = true;

const GROUND_LEVEL_READY = false;
const MANOR_PLACEMENT_READY = false;
const ESTATE_PLACEMENT_READY = false;
const PARENT_MUTATION_AUTHORIZED = false;

const GROUND_LEVEL_HOLD_REASON = "definitive-land-state-required";
const MANOR_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";
const ESTATE_PLACEMENT_HOLD_REASON = "lawful-build-candidate-terrain-required";

const WORLDS = Object.freeze([
  {
    key: "earth",
    name: "Earth",
    route: "/showroom/globe/earth/",
    label: "Protected reference body.",
    layer: "reference",
    palette: {
      ocean: "#0d4f86",
      land: "#4f7d4b",
      coast: "#c7ad74",
      relief: "#8b8878",
      ice: "#e2f2f6",
      glow: "#8ebeff"
    }
  },
  {
    key: "h-earth",
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    label: "Hybrid Earth. Active orbital/aerial build planet.",
    layer: "active-build",
    palette: {
      ocean: "#0b315f",
      land: "#6f9854",
      coast: "#d2b77b",
      relief: "#908866",
      ice: "#d8edf4",
      glow: "#8ff0c3"
    }
  },
  {
    key: "hearth",
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    label: "Separate terrain lane.",
    layer: "regression",
    palette: {
      ocean: "#173c56",
      land: "#8f7144",
      coast: "#d0a66e",
      relief: "#a35f45",
      ice: "#d6e6e9",
      glow: "#f4bf60"
    }
  },
  {
    key: "audralia",
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    label: "Constructed-world lane.",
    layer: "constructed-world",
    palette: {
      ocean: "#0f456f",
      land: "#7fa05a",
      coast: "#c9aa6e",
      relief: "#8f6d54",
      ice: "#cfe8ee",
      glow: "#b8a6ff"
    }
  }
]);

const PREVIEW_REGIONS = Object.freeze([
  { lat: 58, lon: -130, rx: 0.22, ry: 0.07, kind: "ice" },
  { lat: 42, lon: -92, rx: 0.23, ry: 0.10, kind: "land" },
  { lat: 21, lon: -62, rx: 0.17, ry: 0.08, kind: "coast" },
  { lat: 8, lon: -18, rx: 0.20, ry: 0.11, kind: "land" },
  { lat: -12, lon: 28, rx: 0.19, ry: 0.09, kind: "relief" },
  { lat: -26, lon: 74, rx: 0.18, ry: 0.08, kind: "land" },
  { lat: -46, lon: 118, rx: 0.22, ry: 0.08, kind: "coast" },
  { lat: 31, lon: 146, rx: 0.17, ry: 0.07, kind: "relief" },
  { lat: -62, lon: -18, rx: 0.25, ry: 0.06, kind: "ice" }
]);

const state = {
  activeWorld: DEFAULT_DISPLAY,
  previewFrame: 0,
  previewRaf: 0,
  active: true,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  dpr: Math.min(window.devicePixelRatio || 1, 1.5),

  hEarthModule: null,
  hEarthLoaded: false,
  hEarthLoading: false,
  hEarthLoadError: null,

  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,

  hEarthYaw: -18,
  hEarthPitch: 8,
  hEarthZoom: 1
};

const nodes = {
  displayWindow: null,
  displayCanvas: null,
  displayCtx: null,
  displayTitle: null,
  displayCopy: null,
  displayMeta: null,
  inspectSelected: null,
  cards: new Map(),
  previews: new Map(),
  hEarthShell: null,
  hEarthMount: null
};

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function worldByKey(key) {
  return WORLDS.find((world) => world.key === key) || WORLDS.find((world) => world.key === DEFAULT_DISPLAY);
}

function ensureInspectionStyles() {
  if (document.getElementById("showroom-globe-inspection-heavy-style-v1")) return;

  const style = document.createElement("style");
  style.id = "showroom-globe-inspection-heavy-style-v1";
  style.textContent = `
    html[data-globe-showcase-inspection-heavy="true"] {
      --inspection-glow: rgba(143, 240, 195, 0.24);
    }

    [data-showroom-h-earth-inspection-shell] {
      width: 100%;
      height: 100%;
      min-height: clamp(420px, 84vw, 760px);
      display: grid;
      place-items: stretch;
      position: relative;
      overflow: hidden;
      border-radius: 22px;
      background:
        radial-gradient(circle at 50% 44%, rgba(143, 240, 195, 0.10), transparent 18rem),
        radial-gradient(circle at 52% 52%, rgba(142, 190, 255, 0.13), transparent 20rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      touch-action: none;
    }

    [data-showroom-h-earth-inspection-mount] {
      width: 100%;
      min-height: clamp(420px, 84vw, 760px);
      display: grid;
      place-items: stretch;
      touch-action: none;
    }

    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas-panel] {
      width: 100%;
      height: 100%;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas-title],
    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas-copy],
    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas-status] {
      display: none !important;
    }

    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas-stage] {
      width: 100% !important;
      min-height: clamp(420px, 84vw, 760px) !important;
      border: 0 !important;
      border-radius: 22px !important;
      background:
        radial-gradient(circle at 50% 44%, rgba(143, 240, 195, 0.09), transparent 18rem),
        radial-gradient(circle at 50% 50%, rgba(142, 190, 255, 0.12), transparent 20rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1)) !important;
      touch-action: none !important;
    }

    [data-showroom-h-earth-inspection-mount] [data-h-earth-canvas] {
      width: 100% !important;
      max-width: 1040px !important;
      margin: auto !important;
      display: block !important;
      touch-action: none !important;
    }

    [data-showroom-inspection-hint] {
      position: absolute;
      left: 16px;
      top: 16px;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      padding: 7px 11px;
      border: 1px solid rgba(143, 240, 195, 0.34);
      border-radius: 999px;
      color: #8ff0c3;
      background: rgba(4, 9, 18, 0.72);
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      pointer-events: none;
      backdrop-filter: blur(12px);
    }

    [data-showroom-inspection-error] {
      display: grid;
      place-items: center;
      min-height: clamp(420px, 84vw, 760px);
      padding: 1.5rem;
      color: #f8ead0;
      text-align: center;
      background:
        radial-gradient(circle at 50% 44%, rgba(244, 191, 96, 0.12), transparent 18rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      border-radius: 22px;
    }

    [data-showroom-inspection-error] strong {
      display: block;
      color: #f4bf60;
      font-size: clamp(1.2rem, 4vw, 2rem);
      margin-bottom: 0.5rem;
    }

    [data-display-case-canvas][hidden] {
      display: none !important;
    }
  `;

  document.head.appendChild(style);
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
  canvas.dataset.cardTransform = CARD_TRANSFORM;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx;
}

function collectNodes() {
  ensureInspectionStyles();

  nodes.displayWindow =
    document.querySelector(".display-window") ||
    document.querySelector("[data-display-window]") ||
    byId("displayWindow");

  nodes.displayCanvas = byId("displayCanvas") || document.querySelector("[data-display-case-canvas]");
  nodes.displayCtx = setupCanvas(nodes.displayCanvas, 720);

  nodes.displayTitle = byId("displayTitle");
  nodes.displayCopy = byId("displayCopy");
  nodes.displayMeta = byId("displayMeta");
  nodes.inspectSelected = byId("inspectSelected");

  nodes.cards.clear();
  document.querySelectorAll("[data-world-card]").forEach((card) => {
    const key = card.getAttribute("data-world-card");
    nodes.cards.set(key, card);
    card.dataset.cardTransform = CARD_TRANSFORM;
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
  root.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  root.dataset.htmlExpected = HTML_EXPECTED;
  root.dataset.showroomMode = SHOWROOM_MODE;
  root.dataset.displayCaseMode = DISPLAY_CASE_MODE;
  root.dataset.globeShowcaseInspectionHeavy = "true";
  root.dataset.activeDisplay = world.key;
  root.dataset.activeInspectionRoute = world.route;
  root.dataset.touchDragInspection = "true";
  root.dataset.cardTransform = CARD_TRANSFORM;

  root.dataset.hEarthCanvasExpected = H_EARTH_CANVAS_EXPECTED;
  root.dataset.hEarthVisualRenewalExpected = H_EARTH_VISUAL_RENEWAL_EXPECTED;
  root.dataset.hEarthCanvasLoaded = String(state.hEarthLoaded);
  root.dataset.hEarthCanvasLoadError = state.hEarthLoadError || "";

  root.dataset.definitiveLandStateRequired = String(DEFINITIVE_LAND_STATE_REQUIRED);
  root.dataset.landStateClassificationRequired = String(LAND_STATE_CLASSIFICATION_REQUIRED);
  root.dataset.elevationSeaLevelBound = String(ELEVATION_SEA_LEVEL_BOUND);
  root.dataset.terrainDetailConsumptionActive = String(TERRAIN_DETAIL_CONSUMPTION_ACTIVE);
  root.dataset.orbitalAerialDefinitionActive = String(ORBITAL_AERIAL_DEFINITION_ACTIVE);

  root.dataset.groundLevelReady = String(GROUND_LEVEL_READY);
  root.dataset.manorPlacementReady = String(MANOR_PLACEMENT_READY);
  root.dataset.estatePlacementReady = String(ESTATE_PLACEMENT_READY);
  root.dataset.groundLevelHoldReason = GROUND_LEVEL_HOLD_REASON;
  root.dataset.manorPlacementHoldReason = MANOR_PLACEMENT_HOLD_REASON;
  root.dataset.estatePlacementHoldReason = ESTATE_PLACEMENT_HOLD_REASON;

  root.dataset.parentMutationAuthorized = String(PARENT_MUTATION_AUTHORIZED);
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
    if (world.key === "h-earth") {
      nodes.displayMeta.replaceChildren(
        metaBlock("Layer", "Inspection-heavy display case"),
        metaBlock("Touch", "Drag / rotate / zoom"),
        metaBlock("Source", state.hEarthLoaded ? "Actual H-Earth canvas" : "Loading H-Earth canvas")
      );
    } else {
      nodes.displayMeta.replaceChildren(
        metaBlock("Layer", "Display case"),
        metaBlock("Selection", world.name),
        metaBlock("Inspection", world.route)
      );
    }
  }

  for (const [key, card] of nodes.cards.entries()) {
    card.setAttribute("aria-selected", String(key === world.key));
    card.dataset.activeDisplay = String(key === world.key);
    card.style.transform = "none";
  }

  stampDocument(world);
}

function clearDisplayWindow() {
  if (!nodes.displayWindow) return;

  if (nodes.hEarthShell && nodes.hEarthShell.parentElement === nodes.displayWindow) {
    nodes.hEarthShell.remove();
  }

  if (nodes.displayCanvas && !nodes.displayCanvas.parentElement) {
    nodes.displayWindow.appendChild(nodes.displayCanvas);
  }

  if (nodes.displayCanvas) {
    nodes.displayCanvas.hidden = false;
  }
}

function ensureHEarthInspectionMount() {
  if (!nodes.displayWindow) return null;

  if (nodes.hEarthShell && nodes.hEarthMount) return nodes.hEarthMount;

  if (nodes.displayCanvas) {
    nodes.displayCanvas.hidden = true;
  }

  nodes.hEarthShell = document.createElement("section");
  nodes.hEarthShell.setAttribute("data-showroom-h-earth-inspection-shell", "true");
  nodes.hEarthShell.setAttribute("aria-label", "H-Earth inspection-heavy display case");
  nodes.hEarthShell.dataset.contract = CONTRACT;
  nodes.hEarthShell.dataset.hEarthCanvasExpected = H_EARTH_CANVAS_EXPECTED;
  nodes.hEarthShell.dataset.hEarthVisualRenewalExpected = H_EARTH_VISUAL_RENEWAL_EXPECTED;
  nodes.hEarthShell.dataset.parentMutationAuthorized = "false";
  nodes.hEarthShell.dataset.generatedImage = "false";
  nodes.hEarthShell.dataset.graphicBox = "false";
  nodes.hEarthShell.dataset.visualPassClaim = "false";

  const hint = document.createElement("div");
  hint.setAttribute("data-showroom-inspection-hint", "true");
  hint.textContent = "Drag · Rotate · Zoom";

  nodes.hEarthMount = document.createElement("div");
  nodes.hEarthMount.setAttribute("data-showroom-h-earth-inspection-mount", "true");
  nodes.hEarthMount.setAttribute("data-h-earth-canvas-mount", "true");
  nodes.hEarthMount.dataset.parentMutationAuthorized = "false";
  nodes.hEarthMount.dataset.visibleDiagnostics = "false";

  nodes.hEarthShell.appendChild(hint);
  nodes.hEarthShell.appendChild(nodes.hEarthMount);

  nodes.displayWindow.replaceChildren(nodes.hEarthShell);

  return nodes.hEarthMount;
}

function showInspectionError(message) {
  if (!nodes.displayWindow) return;

  const error = document.createElement("section");
  error.setAttribute("data-showroom-inspection-error", "true");
  error.innerHTML = `
    <div>
      <strong>H-Earth inspection canvas did not load.</strong>
      <span>${message}</span>
    </div>
  `;

  nodes.displayWindow.replaceChildren(error);
}

async function loadHEarthInspectionCanvas() {
  if (state.hEarthLoaded) return state.hEarthModule;
  if (state.hEarthLoading) return state.hEarthModule;

  const mount = ensureHEarthInspectionMount();
  if (!mount) return null;

  state.hEarthLoading = true;
  state.hEarthLoadError = null;

  try {
    const module = await import(`${H_EARTH_CANVAS_PATH}?v=${encodeURIComponent(H_EARTH_VISUAL_RENEWAL_EXPECTED)}-showcase-inspection-heavy`);

    state.hEarthModule = module;

    if (typeof module.bootHEarthCanvas === "function") {
      await module.bootHEarthCanvas({
        route: "/showroom/globe/",
        showcaseInspectionHeavy: true,
        parentMutationAuthorized: false,
        visibleDiagnostics: false
      });
    }

    state.hEarthLoaded = true;
    state.hEarthLoading = false;

    const status = readHEarthStatus();
    if (status) {
      state.hEarthYaw = Number.isFinite(Number(status.yaw)) ? Number(status.yaw) : state.hEarthYaw;
      state.hEarthPitch = Number.isFinite(Number(status.pitch)) ? Number(status.pitch) : state.hEarthPitch;
      state.hEarthZoom = Number.isFinite(Number(status.zoom)) ? Number(status.zoom) : state.hEarthZoom;
    }

    wireHEarthInspectionControls();
    updateDisplay(worldByKey("h-earth"));
    return module;
  } catch (error) {
    state.hEarthLoading = false;
    state.hEarthLoaded = false;
    state.hEarthLoadError = error instanceof Error ? error.message : String(error);

    showInspectionError(state.hEarthLoadError);
    updateDisplay(worldByKey("h-earth"));
    return null;
  }
}

function readHEarthApi() {
  return (
    window.DGBHEarthCanvas ||
    window.HEarthCanvas ||
    window.H_EARTH_CANVAS ||
    state.hEarthModule?.default ||
    null
  );
}

function readHEarthStatus() {
  const api = readHEarthApi();

  try {
    if (api && typeof api.getHEarthCanvasStatus === "function") return api.getHEarthCanvasStatus();
    if (api && typeof api.getStatus === "function") return api.getStatus();
    if (api && typeof api.status === "function") return api.status();
  } catch {
    return null;
  }

  return null;
}

function setHEarthView() {
  const api = readHEarthApi();

  if (api && typeof api.setHEarthCanvasView === "function") {
    api.setHEarthCanvasView({
      yaw: state.hEarthYaw,
      pitch: state.hEarthPitch,
      zoom: state.hEarthZoom
    });
    return;
  }

  if (api && typeof api.setView === "function") {
    api.setView({
      yaw: state.hEarthYaw,
      pitch: state.hEarthPitch,
      zoom: state.hEarthZoom
    });
  }
}

function wireHEarthInspectionControls() {
  const target =
    nodes.hEarthMount?.querySelector("[data-h-earth-canvas-stage]") ||
    nodes.hEarthMount?.querySelector("[data-h-earth-canvas]") ||
    nodes.hEarthMount;

  if (!target || target.dataset.showroomFingerInspectionBound === "true") return;

  target.dataset.showroomFingerInspectionBound = "true";
  target.style.touchAction = "none";

  target.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartYaw = state.hEarthYaw;
    state.dragStartPitch = state.hEarthPitch;

    target.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  target.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.dragStartX;
    const dy = event.clientY - state.dragStartY;

    state.hEarthYaw = state.dragStartYaw + dx * 0.42;
    state.hEarthPitch = clamp(state.dragStartPitch - dy * 0.30, -64, 64);

    setHEarthView();
    event.preventDefault();
  }, { passive: false });

  const finish = (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    target.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  target.addEventListener("pointerup", finish, { passive: false });
  target.addEventListener("pointercancel", finish, { passive: false });

  target.addEventListener("wheel", (event) => {
    state.hEarthZoom = clamp(state.hEarthZoom + (event.deltaY < 0 ? 0.08 : -0.08), 0.78, 1.55);
    setHEarthView();
    event.preventDefault();
  }, { passive: false });
}

function selectWorld(key) {
  const world = worldByKey(key);
  state.activeWorld = world.key;
  updateDisplay(world);

  if (world.key === "h-earth") {
    loadHEarthInspectionCanvas();
    return;
  }

  clearDisplayWindow();
  drawDisplayPreview(world);
}

function colorFor(world, kind) {
  if (kind === "ice") return world.palette.ice;
  if (kind === "relief") return world.palette.relief;
  if (kind === "coast") return world.palette.coast;
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
  const bg = ctx.createRadialGradient(width * 0.5, height * 0.46, width * 0.04, width * 0.5, height * 0.5, width * 0.78);
  bg.addColorStop(0, `${world.palette.glow}55`);
  bg.addColorStop(0.40, "#07152b");
  bg.addColorStop(1, "#01030a");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = compact ? 0.42 : 0.58;

  const count = compact ? 34 : 110;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = compact ? 0.8 : 0.65 + ((i * 7) % 11) / 15;

    ctx.beginPath();
    ctx.fillStyle = i % 10 === 0 ? "rgba(246,211,123,.70)" : "rgba(225,238,255,.56)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPreviewGlobe(ctx, canvas, world, yaw, pitch, zoom, compact = false) {
  if (!canvas || !ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const baseRadius = Math.min(width, height) * (compact ? 0.33 : 0.35);
  const radius = baseRadius * clamp(zoom, 0.78, 1.55);
  const cx = width * 0.5;
  const cy = height * (compact ? 0.5 : 0.52);

  clearScene(ctx, width, height, world, compact);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.35, radius * 0.08, cx, cy, radius * 1.15);
  ocean.addColorStop(0, shade(world.palette.ocean, 1.4));
  ocean.addColorStop(0.36, world.palette.ocean);
  ocean.addColorStop(0.74, shade(world.palette.ocean, 0.52));
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const projected = [];

  for (const item of PREVIEW_REGIONS) {
    const adjustedLon = item.lon + WORLDS.indexOf(world) * 14;
    const point = project(item.lat, adjustedLon, radius, cx, cy, yaw, pitch);
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

    ctx.globalAlpha = item.kind === "ice" ? 0.90 : item.kind === "coast" ? 0.84 : 0.82;
    ctx.fillStyle = shade(colorFor(world, item.kind), point.light);
    ctx.fill();

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = item.kind === "coast" ? "rgba(246,211,123,.72)" : "rgba(246,234,210,.32)";
    ctx.lineWidth = Math.max(0.8, radius * 0.0026);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  const light = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.08, cx, cy, radius * 1.08);
  light.addColorStop(0, "rgba(255,238,184,.22)");
  light.addColorStop(0.36, `${world.palette.glow}18`);
  light.addColorStop(1, "rgba(0,0,0,.50)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = light;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.015, 0, Math.PI * 2);
  ctx.strokeStyle = `${world.palette.glow}55`;
  ctx.lineWidth = Math.max(compact ? 4 : 9, radius * 0.035);
  ctx.stroke();
  ctx.restore();

  if (!compact) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246,211,123,.94)";
    ctx.font = `${Math.max(22, width * 0.032)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText(world.name, width / 2, height * 0.08);

    ctx.fillStyle = "rgba(243,227,189,.74)";
    ctx.font = `${Math.max(13, width * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText("Open full inspection for the private route", width / 2, height * 0.114);
    ctx.restore();
  }
}

function drawDisplayPreview(world) {
  if (!nodes.displayCanvas) return;

  nodes.displayCtx = setupCanvas(nodes.displayCanvas, 720);
  drawPreviewGlobe(nodes.displayCtx, nodes.displayCanvas, world, 22, 8, 1, false);
}

function drawPreviewCards() {
  for (const world of WORLDS) {
    const preview = nodes.previews.get(world.key);
    if (!preview) continue;

    const previewYaw = state.previewFrame * 0.24 + WORLDS.indexOf(world) * 32;
    drawPreviewGlobe(preview.ctx, preview.canvas, world, previewYaw, 10, 1, true);
  }
}

function previewLoop() {
  if (!state.active) return;

  state.previewFrame += 1;
  drawPreviewCards();

  if (!state.reducedMotion) {
    state.previewRaf = window.requestAnimationFrame(previewLoop);
  }
}

function wireEvents() {
  for (const [key, card] of nodes.cards.entries()) {
    if (card.dataset.showroomCardBound === "true") continue;

    card.dataset.showroomCardBound = "true";

    card.addEventListener("click", () => selectWorld(key));

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectWorld(key);
    });
  }

  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";

    if (state.active && !state.previewRaf) {
      state.previewRaf = window.requestAnimationFrame(previewLoop);
    }

    if (!state.active && state.previewRaf) {
      window.cancelAnimationFrame(state.previewRaf);
      state.previewRaf = 0;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    collectNodes();
    drawPreviewCards();

    if (state.activeWorld !== "h-earth") {
      drawDisplayPreview(worldByKey(state.activeWorld));
    }
  }, { passive: true });
}

function getShowroomGlobeShowcaseStatus() {
  const world = worldByKey(state.activeWorld);
  const hEarthStatus = readHEarthStatus();

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlExpected: HTML_EXPECTED,
    showroomMode: SHOWROOM_MODE,
    displayCaseMode: DISPLAY_CASE_MODE,
    activeDisplay: world.key,
    activeDisplayName: world.name,
    activeInspectionRoute: world.route,
    touchDragInspection: true,
    hEarthCanvasPath: H_EARTH_CANVAS_PATH,
    hEarthCanvasExpected: H_EARTH_CANVAS_EXPECTED,
    hEarthVisualRenewalExpected: H_EARTH_VISUAL_RENEWAL_EXPECTED,
    hEarthLoaded: state.hEarthLoaded,
    hEarthLoading: state.hEarthLoading,
    hEarthLoadError: state.hEarthLoadError,
    hEarthStatus,

    yaw: state.hEarthYaw,
    pitch: state.hEarthPitch,
    zoom: state.hEarthZoom,

    definitiveLandStateRequired: DEFINITIVE_LAND_STATE_REQUIRED,
    landStateClassificationRequired: LAND_STATE_CLASSIFICATION_REQUIRED,
    elevationSeaLevelBound: ELEVATION_SEA_LEVEL_BOUND,
    terrainDetailConsumptionActive: TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
    orbitalAerialDefinitionActive: ORBITAL_AERIAL_DEFINITION_ACTIVE,

    groundLevelReady: GROUND_LEVEL_READY,
    manorPlacementReady: MANOR_PLACEMENT_READY,
    estatePlacementReady: ESTATE_PLACEMENT_READY,
    groundLevelHoldReason: GROUND_LEVEL_HOLD_REASON,
    manorPlacementHoldReason: MANOR_PLACEMENT_HOLD_REASON,
    estatePlacementHoldReason: ESTATE_PLACEMENT_HOLD_REASON,

    visibleDiagnostics: false,
    cardTransform: CARD_TRANSFORM,
    parentMutationAuthorized: PARENT_MUTATION_AUTHORIZED,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    mode: SHOWROOM_MODE,
    displayCaseMode: DISPLAY_CASE_MODE,
    selectWorld,
    status: getShowroomGlobeShowcaseStatus,
    getStatus: getShowroomGlobeShowcaseStatus,
    getShowroomGlobeShowcaseStatus
  };

  window.DGBShowroomGlobeShowcase = api;
  window.ShowroomGlobeShowcase = api;
  window.SHOWROOM_GLOBE_SHOWCASE_RECEIPT = CONTRACT;
}

function boot() {
  collectNodes();
  exposeApi();
  wireEvents();
  drawPreviewCards();
  selectWorld(DEFAULT_DISPLAY);

  if (state.previewRaf) window.cancelAnimationFrame(state.previewRaf);

  if (state.reducedMotion) {
    previewLoop();
  } else {
    state.previewRaf = window.requestAnimationFrame(previewLoop);
  }
}

stampDocument(worldByKey(DEFAULT_DISPLAY));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  HTML_EXPECTED,
  SHOWROOM_MODE,
  DISPLAY_CASE_MODE,
  DEFAULT_DISPLAY,
  H_EARTH_CANVAS_PATH,
  H_EARTH_CANVAS_EXPECTED,
  H_EARTH_VISUAL_RENEWAL_EXPECTED,
  DEFINITIVE_LAND_STATE_REQUIRED,
  LAND_STATE_CLASSIFICATION_REQUIRED,
  ELEVATION_SEA_LEVEL_BOUND,
  TERRAIN_DETAIL_CONSUMPTION_ACTIVE,
  ORBITAL_AERIAL_DEFINITION_ACTIVE,
  GROUND_LEVEL_READY,
  MANOR_PLACEMENT_READY,
  ESTATE_PLACEMENT_READY,
  PARENT_MUTATION_AUTHORIZED,
  selectWorld,
  getShowroomGlobeShowcaseStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  mode: SHOWROOM_MODE,
  displayCaseMode: DISPLAY_CASE_MODE,
  selectWorld,
  status: getShowroomGlobeShowcaseStatus,
  getStatus: getShowroomGlobeShowcaseStatus,
  getShowroomGlobeShowcaseStatus
};
