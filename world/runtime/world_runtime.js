// /world/runtime/world_runtime.js
// MODE: BASELINE RENEWAL
// STATUS: PLANET-ENGINE-AUTHORITY | SINGLE-RECEIPT | NON-DRIFT
// OWNER: SEAN

import { createPlanetEngine } from "../planet_engine.js";
import { renderPlanet } from "../render/index.js";

let runtimeActive = false;

const RECEIPT_KEY = "__RUNTIME_RECEIPT__";
const STORAGE_KEY = "cte_runtime_v4";

function nowMs() {
  return Date.now();
}

function nowPerf() {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function hasWindow() {
  return typeof window !== "undefined" && !!window;
}

function hasRAF() {
  return typeof requestAnimationFrame === "function";
}

function hasCAF() {
  return typeof cancelAnimationFrame === "function";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function safeWriteReceipt(receipt) {
  try {
    if (!hasWindow()) return false;
    window[RECEIPT_KEY] = receipt;
    return true;
  } catch (_) {
    return false;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function baseReceipt() {
  return {
    status: "BOOTING",
    phase: "INIT",
    verification: { pass: false },
    timestamp: nowMs(),
    error: null,
    errorCode: null,
    backend: null,
    engineAuthority: "planet_engine",
    frameIndex: 0,
    elapsedSeconds: 0,
    dayPhase: 0,
    seasonPhase: 0,
    stormPhase: 0,
    density: 0,
    projectionState: null,
    renderAuthority: null,
    audit: null
  };
}

function emitReceipt(receipt) {
  const normalized = normalizeObject(receipt);
  safeWriteReceipt(normalized);
  safeSetStorage(STORAGE_KEY, normalized);
  return normalized;
}

function buildFailureReceipt(code, message, prior = null) {
  return {
    ...baseReceipt(),
    ...(prior ? normalizeObject(prior) : {}),
    status: "FAIL",
    phase: "FAIL",
    verification: { pass: false },
    errorCode: code,
    error: message,
    timestamp: nowMs()
  };
}

function ensureCanvas(canvas) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("Missing valid canvas");
  }
  return canvas;
}

function ensureCanvasBackingStore(canvas) {
  const dpr = Math.max(1, hasWindow() ? window.devicePixelRatio || 1 : 1);
  const width = Math.max(1, Math.floor((hasWindow() ? window.innerWidth : canvas.clientWidth || 1) * dpr));
  const height = Math.max(1, Math.floor((hasWindow() ? window.innerHeight : canvas.clientHeight || 1) * dpr));

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
}

function resolveBackend(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    throw new Error("2d backend unavailable");
  }
  return {
    backend: "2d",
    ctx
  };
}

function buildTimeState(elapsedSeconds) {
  const elapsed = Math.max(0, elapsedSeconds);
  return Object.freeze({
    elapsedSeconds: elapsed,
    dayPhase: ((elapsed * 0.02) % 1 + 1) % 1,
    seasonPhase: ((elapsed * 0.0025) % 1 + 1) % 1,
    stormPhase: ((elapsed * 0.01) % 1 + 1) % 1
  });
}

export function startRuntime({ canvas, root = null, mode = "index" } = {}) {
  if (runtimeActive) {
    emitReceipt(buildFailureReceipt("RUNTIME_DUPLICATE_START", "Runtime already active"));
    return { dispose() {} };
  }

  if (!hasRAF()) {
    emitReceipt(buildFailureReceipt("RUNTIME_NO_RAF", "requestAnimationFrame unavailable"));
    return { dispose() {} };
  }

  let runtimeCanvas;
  let backendState;
  let engine;
  let running = false;
  let rafId = null;
  let frameIndex = 0;
  let lastReceipt = baseReceipt();
  const startedAt = nowPerf();

  try {
    runtimeCanvas = ensureCanvas(canvas);
    ensureCanvasBackingStore(runtimeCanvas);
    backendState = resolveBackend(runtimeCanvas);
    engine = createPlanetEngine();

    if (typeof engine.buildPlanetFrame !== "function") {
      throw new Error("Planet engine frame contract missing");
    }

    runtimeActive = true;
    running = true;

    lastReceipt = emitReceipt({
      ...baseReceipt(),
      backend: backendState.backend,
      status: "BOOTING",
      phase: "BOOTING"
    });
  } catch (error) {
    runtimeActive = false;
    emitReceipt(
      buildFailureReceipt(
        "RUNTIME_BOOT_ERROR",
        error instanceof Error ? error.message : String(error)
      )
    );
    return { dispose() {} };
  }

  function onResize() {
    try {
      ensureCanvasBackingStore(runtimeCanvas);
    } catch (_) {}
  }

  function frame() {
    if (!running) return;

    try {
      const elapsedSeconds = Math.max(0, (nowPerf() - startedAt) / 1000);
      const timeState = buildTimeState(elapsedSeconds);
      const planetField = engine.buildPlanetFrame(timeState);

      const renderResult = renderPlanet({
        ctx: backendState.ctx,
        canvas: runtimeCanvas,
        root,
        mode,
        planetField
      });

      frameIndex += 1;

      lastReceipt = emitReceipt({
        ...baseReceipt(),
        status: "RUNNING",
        phase: "RUNNING",
        verification: { pass: true },
        timestamp: nowMs(),
        backend: backendState.backend,
        engineAuthority: "planet_engine",
        frameIndex,
        elapsedSeconds: timeState.elapsedSeconds,
        dayPhase: timeState.dayPhase,
        seasonPhase: timeState.seasonPhase,
        stormPhase: timeState.stormPhase,
        density: renderResult?.density ?? 0,
        projectionState: renderResult?.projectionState ?? null,
        renderAuthority: renderResult?.renderAuthority ?? null,
        audit: renderResult?.audit ?? null
      });

      rafId = requestAnimationFrame(frame);
    } catch (error) {
      running = false;
      runtimeActive = false;
      lastReceipt = emitReceipt(
        buildFailureReceipt(
          "RUNTIME_FRAME_ERROR",
          error instanceof Error ? error.message : String(error),
          lastReceipt
        )
      );
    }
  }

  function dispose() {
    running = false;
    runtimeActive = false;

    if (rafId !== null && hasCAF()) {
      try {
        cancelAnimationFrame(rafId);
      } catch (_) {}
    }

    if (hasWindow()) {
      try {
        window.removeEventListener("resize", onResize);
      } catch (_) {}
    }
  }

  if (hasWindow()) {
    window.addEventListener("resize", onResize);
    window.addEventListener("pagehide", dispose, { once: true });
  }

  rafId = requestAnimationFrame(frame);

  return { dispose };
}

export default { startRuntime };
