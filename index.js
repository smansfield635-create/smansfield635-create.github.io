Path: /index.js

// /index.js
// MODE: CONTRACT EXECUTION
// CONTRACT: INDEX_BASELINE_CONTRACT_G2
// STATUS: HOST ONLY | PLATFORM OWNER | NON-DRIFT

import { createRuntime } from "./world/runtime.js";
import renderModule from "./world/render.js";
import instrumentsModule from "./assets/instruments.js";

const INDEX_META = Object.freeze({
  name: "index",
  version: "G2",
  contract: "INDEX_BASELINE_CONTRACT_G2",
  role: "platform_host_and_boot_layer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true
});

const INDEX_CONSTANTS = Object.freeze({
  DEFAULT_PROJECTION: "flat",
  CANVAS_ID: "world-canvas",
  ROOT_ID: "app",
  HUD_ID: "world-hud",
  PANEL_ID: "instrument-panel",
  BACKGROUND: "#05070b",
  FOREGROUND: "#e8edf5",
  GRID_COLOR: "rgba(255,255,255,0.08)",
  BLOCK_COLOR: "#ff4d4f",
  HOLD_COLOR: "#faad14",
  GATE_COLOR: "#40a9ff",
  BRIDGE_COLOR: "#73d13d",
  OPEN_COLOR: "#b7eb8f",
  FONT: "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  MOVE_STEP: 1,
  MARKER_RADIUS: 8,
  GLOBE_RADIUS_RATIO: 0.36
});

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
};

const assert = (condition, code) => {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
};

const hasWindow = () => typeof window !== "undefined" && !!window;
const hasDocument = () => typeof document !== "undefined" && !!document;

const clamp01 = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const stableRound = (value, places = 12) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const ensureElement = (id, tagName, parent) => {
  let element = document.getElementById(id);
  if (element) return element;

  element = document.createElement(tagName);
  element.id = id;
  parent.appendChild(element);
  return element;
};

const applyBaseStyles = () => {
  document.documentElement.style.background = INDEX_CONSTANTS.BACKGROUND;
  document.body.style.margin = "0";
  document.body.style.background = INDEX_CONSTANTS.BACKGROUND;
  document.body.style.color = INDEX_CONSTANTS.FOREGROUND;
  document.body.style.font = INDEX_CONSTANTS.FONT;
  document.body.style.overflow = "hidden";
};

const createLayout = () => {
  applyBaseStyles();

  const root = ensureElement(INDEX_CONSTANTS.ROOT_ID, "div", document.body);
  root.style.position = "absolute";
  root.style.inset = "0";
  root.style.display = "grid";
  root.style.gridTemplateRows = "1fr auto";
  root.style.background = "transparent";
  root.style.minHeight = "0";

  const canvasWrap = ensureElement("world-canvas-wrap", "div", root);
  canvasWrap.style.position = "relative";
  canvasWrap.style.minHeight = "0";
  canvasWrap.style.overflow = "hidden";

  const canvas = ensureElement(INDEX_CONSTANTS.CANVAS_ID, "canvas", canvasWrap);
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.background = INDEX_CONSTANTS.BACKGROUND;

  const hud = ensureElement(INDEX_CONSTANTS.HUD_ID, "div", canvasWrap);
  hud.style.position = "absolute";
  hud.style.left = "12px";
  hud.style.top = "12px";
  hud.style.maxWidth = "min(520px, calc(100vw - 48px))";
  hud.style.padding = "10px 12px";
  hud.style.border = "1px solid rgba(255,255,255,0.08)";
  hud.style.background = "rgba(255,255,255,0.04)";
  hud.style.backdropFilter = "blur(6px)";
  hud.style.borderRadius = "10px";
  hud.style.pointerEvents = "none";
  hud.style.whiteSpace = "pre-wrap";
  hud.style.lineHeight = "1.35";
  hud.style.font = INDEX_CONSTANTS.FONT;
  hud.style.color = INDEX_CONSTANTS.FOREGROUND;

  const panel = ensureElement(INDEX_CONSTANTS.PANEL_ID, "div", root);
  panel.style.padding = "10px 12px";
  panel.style.borderTop = "1px solid rgba(255,255,255,0.08)";
  panel.style.background = "rgba(255,255,255,0.02)";
  panel.style.overflow = "auto";
  panel.style.maxHeight = "22vh";
  panel.style.font = INDEX_CONSTANTS.FONT;
  panel.style.lineHeight = "1.45";
  if (!panel.innerHTML) {
    panel.innerHTML = "<div><b>STATE:</b> boot_pending</div><div><b>PANEL:</b> awaiting instrument receipt</div>";
  }

  return deepFreeze({ root, canvasWrap, canvas, hud, panel });
};

const getCanvasContext = (canvas) => {
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: false });
  assert(ctx, "CANVAS_CONTEXT_UNAVAILABLE");
  return ctx;
};

const resizeCanvas = (canvas, ctx) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, hasWindow() ? window.devicePixelRatio || 1 : 1));
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return deepFreeze({
    cssWidth: Math.max(1, Math.floor(rect.width)),
    cssHeight: Math.max(1, Math.floor(rect.height)),
    dpr
  });
};

const hsvToRgb = (h, s, v) => {
  const hue = ((h % 1) + 1) % 1;
  const sat = clamp01(s);
  const val = clamp01(v);

  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = val * (1 - sat);
  const q = val * (1 - f * sat);
  const t = val * (1 - (1 - f) * sat);

  let r = 0;
  let g = 0;
  let b = 0;

  switch (i % 6) {
    case 0: r = val; g = t; b = p; break;
    case 1: r = q; g = val; b = p; break;
    case 2: r = p; g = val; b = t; break;
    case 3: r = p; g = q; b = val; break;
    case 4: r = t; g = p; b = val; break;
    default: r = val; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

const rgbString = ({ r, g, b }, alpha = 1) => `rgba(${r},${g},${b},${alpha})`;

const pickBoundaryColor = (boundaryClass) => {
  if (boundaryClass === "BLOCK") return INDEX_CONSTANTS.BLOCK_COLOR;
  if (boundaryClass === "HOLD") return INDEX_CONSTANTS.HOLD_COLOR;
  if (boundaryClass === "GATE") return INDEX_CONSTANTS.GATE_COLOR;
  if (boundaryClass === "BRIDGE") return INDEX_CONSTANTS.BRIDGE_COLOR;
  return INDEX_CONSTANTS.OPEN_COLOR;
};

const buildHudText = ({ frameState, runtimePacket, renderPacket, instrumentPacket }) => {
  const selected = normalizeObject(renderPacket?.projection?.selectedProjection);
  const stateLine = typeof instrumentPacket?.classifiedState === "string"
    ? instrumentPacket.classifiedState
    : "—";

  const lines = [
    "WORLD HOST",
    `state=${stateLine}`,
    `projection=${runtimePacket.projectionState}`,
    `elapsedSeconds=${stableRound(frameState.elapsedSeconds, 3)}`,
    `kernel=(${runtimePacket.index.i},${runtimePacket.index.j})`,
    `dense=(${runtimePacket.denseIndex.x},${runtimePacket.denseIndex.y})`,
    `region=${runtimePacket.region.label}`,
    `node=${runtimePacket.node.label}`,
    `boundary=${runtimePacket.boundary.classification}`,
    `terrain=${runtimePacket.terrainClass}`,
    `biome=${runtimePacket.biomeType}`,
    `traversal=${runtimePacket.traversalStatus.action}`,
    `receipt=${runtimePacket.receipt.timestamp}`,
    `projectionSelected=${JSON.stringify(selected)}`
  ];

  return lines.join("\n");
};

const clearCanvas = (ctx, canvasState) => {
  ctx.clearRect(0, 0, canvasState.cssWidth, canvasState.cssHeight);
  ctx.fillStyle = INDEX_CONSTANTS.BACKGROUND;
  ctx.fillRect(0, 0, canvasState.cssWidth, canvasState.cssHeight);
};

const drawBackdrop = (ctx, canvasState, renderPacket) => {
  const color = renderPacket.visible.colorOutput;
  const rgb = hsvToRgb(color.hue, color.saturation, color.value);

  ctx.fillStyle = rgbString(rgb, 0.12);
  ctx.fillRect(0, 0, canvasState.cssWidth, canvasState.cssHeight);

  ctx.strokeStyle = INDEX_CONSTANTS.GRID_COLOR;
  ctx.lineWidth = 1;

  const cols = 12;
  const rows = 8;

  for (let i = 1; i < cols; i += 1) {
    const x = (i / cols) * canvasState.cssWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasState.cssHeight);
    ctx.stroke();
  }

  for (let j = 1; j < rows; j += 1) {
    const y = (j / rows) * canvasState.cssHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasState.cssWidth, y);
    ctx.stroke();
  }
};

const drawMarker = (ctx, x, y, radius, fill, stroke) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = stroke;
  ctx.stroke();
};

const drawFlat = (ctx, renderPacket, field, canvasState) => {
  const width = Number(field && field.width) || 1;
  const height = Number(field && field.height) || 1;

  const x = ((renderPacket.runtime.denseIndex.x + 0.5) / width) * canvasState.cssWidth;
  const y = ((renderPacket.runtime.denseIndex.y + 0.5) / height) * canvasState.cssHeight;

  drawMarker(
    ctx,
    x,
    y,
    INDEX_CONSTANTS.MARKER_RADIUS,
    rgbString(
      hsvToRgb(
        renderPacket.visible.colorOutput.hue,
        renderPacket.visible.colorOutput.saturation,
        renderPacket.visible.colorOutput.value
      ),
      0.95
    ),
    pickBoundaryColor(renderPacket.runtime.boundary.classification)
  );
};

const drawTree = (ctx, renderPacket, canvasState) => {
  const width = canvasState.cssWidth;
  const height = canvasState.cssHeight;
  const selected = normalizeObject(renderPacket.projection.selectedProjection);

  ctx.strokeStyle = INDEX_CONSTANTS.GRID_COLOR;
  ctx.lineWidth = 1;

  for (let i = 1; i < 9; i += 1) {
    const gx = (i / 9) * width;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }

  for (let j = 1; j < 16; j += 1) {
    const gy = (j / 16) * height;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }

  const x = (Number(selected.root || 0) / 9) * width;
  const y = (Number(selected.leaf || 0) / 16) * height;

  drawMarker(
    ctx,
    x,
    y,
    INDEX_CONSTANTS.MARKER_RADIUS,
    rgbString(
      hsvToRgb(
        renderPacket.visible.colorOutput.hue,
        renderPacket.visible.colorOutput.saturation,
        renderPacket.visible.colorOutput.value
      ),
      0.95
    ),
    pickBoundaryColor(renderPacket.runtime.boundary.classification)
  );
};

const drawGlobe = (ctx, renderPacket, canvasState) => {
  const width = canvasState.cssWidth;
  const height = canvasState.cssHeight;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * INDEX_CONSTANTS.GLOBE_RADIUS_RATIO;
  const selected = normalizeObject(renderPacket.projection.selectedProjection);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  const px = cx + Number(selected.x || 0) * r;
  const py = cy + Number(selected.y || 0) * r;

  drawMarker(
    ctx,
    px,
    py,
    INDEX_CONSTANTS.MARKER_RADIUS,
    rgbString(
      hsvToRgb(
        renderPacket.visible.colorOutput.hue,
        renderPacket.visible.colorOutput.saturation,
        renderPacket.visible.colorOutput.value
      ),
      0.95
    ),
    pickBoundaryColor(renderPacket.runtime.boundary.classification)
  );
};

const renderToCanvas = (ctx, renderPacket, field, canvasState) => {
  clearCanvas(ctx, canvasState);
  drawBackdrop(ctx, canvasState, renderPacket);

  const projection = renderPacket.runtime.projectionState;
  if (projection === "tree") {
    drawTree(ctx, renderPacket, canvasState);
    return;
  }
  if (projection === "globe") {
    drawGlobe(ctx, renderPacket, canvasState);
    return;
  }
  drawFlat(ctx, renderPacket, field, canvasState);
};

const createIndexHost = () => {
  assert(hasDocument() && hasWindow(), "PLATFORM_UNAVAILABLE");

  const layout = createLayout();
  const ctx = getCanvasContext(layout.canvas);

  const state = {
    started: false,
    rafId: null,
    startedAtMs: null,
    frameState: deepFreeze({ elapsedSeconds: 0 }),
    lastRenderPacket: null,
    lastInstrumentPacket: null,
    projection: INDEX_CONSTANTS.DEFAULT_PROJECTION,
    pendingMove: deepFreeze({ dx: 0, dy: 0 }),
    runtimeHandle: null
  };

  const instruments =
    instrumentsModule && typeof instrumentsModule.createInstruments === "function"
      ? instrumentsModule.createInstruments()
      : instrumentsModule;

  const syncPlatform = () => resizeCanvas(layout.canvas, ctx);

  const createInitialRuntime = () => {
    state.runtimeHandle = createRuntime({
      projection: state.projection,
      frameState: state.frameState
    });
  };

  const refreshRuntimeForFrame = () => {
    assert(state.runtimeHandle, "RUNTIME_HANDLE_MISSING");
    state.runtimeHandle.refreshFrameState(state.frameState);

    const current = state.runtimeHandle.getCurrentState();
    if (current.projectionState !== state.projection) {
      state.runtimeHandle.reset({
        projection: state.projection,
        frameState: state.frameState,
        initialX: current.denseIndex.x,
        initialY: current.denseIndex.y,
        planetField: state.runtimeHandle.getField()
      });
    }
  };

  const applyPendingMoveIfNeeded = () => {
    if (!state.runtimeHandle) return;

    const dx = state.pendingMove.dx;
    const dy = state.pendingMove.dy;

    if (dx === 0 && dy === 0) return;

    state.runtimeHandle.advance({ dx, dy });
    state.pendingMove = deepFreeze({ dx: 0, dy: 0 });
  };

  const updateInstrumentPanel = (instrumentPacket) => {
    if (!instrumentPacket) return;

    if (instruments && typeof instruments.renderPanelHTML === "function") {
      layout.panel.innerHTML = instruments.renderPanelHTML(instrumentPacket);
      return;
    }

    if (instruments && typeof instruments.renderPanelText === "function") {
      layout.panel.textContent = instruments.renderPanelText(instrumentPacket);
      return;
    }

    const lines = normalizeObject(instrumentPacket.displayPayload).lines;
    layout.panel.textContent = Array.isArray(lines) ? lines.join("\n") : "instrument packet received";
  };

  const stepFrame = (nowMs) => {
    if (!state.started) return;

    if (!Number.isFinite(state.startedAtMs)) {
      state.startedAtMs = nowMs;
    }

    state.frameState = deepFreeze({
      elapsedSeconds: stableRound((nowMs - state.startedAtMs) / 1000, 6)
    });

    refreshRuntimeForFrame();
    applyPendingMoveIfNeeded();

    const renderPacket = renderModule.render(state.runtimeHandle);
    state.lastRenderPacket = renderPacket;

    const instrumentPacket =
      instruments && typeof instruments.update === "function"
        ? instruments.update({
            runtimeState: renderPacket.runtime,
            renderState: renderPacket
          })
        : null;

    state.lastInstrumentPacket = instrumentPacket;

    const canvasState = syncPlatform();
    renderToCanvas(ctx, renderPacket, state.runtimeHandle.getField(), canvasState);
    updateInstrumentPanel(instrumentPacket);
    layout.hud.textContent = buildHudText({
      frameState: state.frameState,
      runtimePacket: renderPacket.runtime,
      renderPacket,
      instrumentPacket
    });

    state.rafId = window.requestAnimationFrame(stepFrame);
  };

  const handleKeyDown = (event) => {
    if (!state.started) return;

    const key = String(event.key || "");
    if (key === "1") {
      state.projection = "flat";
      return;
    }
    if (key === "2") {
      state.projection = "tree";
      return;
    }
    if (key === "3") {
      state.projection = "globe";
      return;
    }
    if (key === "ArrowUp" || key === "w" || key === "W") {
      state.pendingMove = deepFreeze({ dx: 0, dy: -INDEX_CONSTANTS.MOVE_STEP });
      return;
    }
    if (key === "ArrowDown" || key === "s" || key === "S") {
      state.pendingMove = deepFreeze({ dx: 0, dy: INDEX_CONSTANTS.MOVE_STEP });
      return;
    }
    if (key === "ArrowLeft" || key === "a" || key === "A") {
      state.pendingMove = deepFreeze({ dx: -INDEX_CONSTANTS.MOVE_STEP, dy: 0 });
      return;
    }
    if (key === "ArrowRight" || key === "d" || key === "D") {
      state.pendingMove = deepFreeze({ dx: INDEX_CONSTANTS.MOVE_STEP, dy: 0 });
    }
  };

  const start = () => {
    if (state.started) return deepFreeze({ started: true });

    syncPlatform();
    state.started = true;
    state.startedAtMs = null;
    state.frameState = deepFreeze({ elapsedSeconds: 0 });
    state.lastRenderPacket = null;
    state.lastInstrumentPacket = null;
    state.pendingMove = deepFreeze({ dx: 0, dy: 0 });

    createInitialRuntime();

    window.addEventListener("resize", syncPlatform, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    state.rafId = window.requestAnimationFrame(stepFrame);

    return deepFreeze({ started: true });
  };

  const stop = () => {
    if (!state.started) return deepFreeze({ started: false });

    state.started = false;

    if (state.rafId !== null) {
      window.cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    window.removeEventListener("resize", syncPlatform);
    window.removeEventListener("keydown", handleKeyDown);

    if (instruments && typeof instruments.dispose === "function") {
      instruments.dispose();
    }

    return deepFreeze({ started: false });
  };

  const getFrameState = () => state.frameState;
  const getLastRenderPacket = () => state.lastRenderPacket;
  const getLastInstrumentPacket = () => state.lastInstrumentPacket;

  return deepFreeze({
    meta: INDEX_META,
    constants: INDEX_CONSTANTS,
    start,
    stop,
    getFrameState,
    getLastRenderPacket,
    getLastInstrumentPacket
  });
};

const INDEX = createIndexHost();

export const start = () => INDEX.start();
export const stop = () => INDEX.stop();
export const getFrameState = () => INDEX.getFrameState();
export const getLastRenderPacket = () => INDEX.getLastRenderPacket();
export const getLastInstrumentPacket = () => INDEX.getLastInstrumentPacket();

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      INDEX.start();
    }, { once: true });
  } else {
    INDEX.start();
  }
}

export default INDEX;
