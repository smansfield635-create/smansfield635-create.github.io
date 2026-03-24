// /world/runtime/world_runtime.js
// MODE: RUNTIME CONTRACT RENEWAL
// STATUS: NON-DRIFT | THIN-INDEX-ALIGNED | SINGLE-AUTHORITY | RECEIPT-CANONICAL
// OWNER: SEAN

import { WORLD_KERNEL, generatePlanetField } from "../world_kernel.js";
import { renderPlanet } from "../render/index.js";

let runtimeActive = false;

const RECEIPT_KEY = "__RUNTIME_RECEIPT__";
const STORAGE_KEY = "cte_runtime_v4";

/* =========================
   UTIL
========================= */

function now() {
  return Date.now();
}

function hasWindow() {
  return typeof window !== "undefined" && !!window;
}

function hasDocument() {
  return typeof document !== "undefined" && !!document;
}

function hasRAF() {
  return typeof requestAnimationFrame === "function";
}

function hasCAF() {
  return typeof cancelAnimationFrame === "function";
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeObject(value) {
  return isObject(value) ? value : {};
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function safeGetStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isObject(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

function safeWriteRuntimeReceipt(receipt) {
  try {
    if (!hasWindow()) return false;
    window[RECEIPT_KEY] = receipt;
    return true;
  } catch (_) {
    return false;
  }
}

function safeInstallGlobalInstruments(instruments) {
  try {
    if (!hasWindow()) return false;
    window.__CTE_INSTRUMENTS__ = instruments;
    return true;
  } catch (_) {
    return false;
  }
}

function safeClearGlobalInstruments(instruments) {
  try {
    if (!hasWindow()) return;
    if (window.__CTE_INSTRUMENTS__ === instruments) {
      window.__CTE_INSTRUMENTS__ = null;
    }
  } catch (_) {}
}

function safeCreateInstruments() {
  try {
    if (!hasWindow()) return null;
    const factory =
      typeof window.createInstruments === "function"
        ? window.createInstruments
        : null;

    if (typeof factory !== "function") {
      return null;
    }

    return factory({ mode: "index" });
  } catch (_) {
    return null;
  }
}

function basePsychologySurface() {
  return {
    state: null,
    envelope: null,
    receipt: null
  };
}

function baseReceipt() {
  return {
    status: "BOOTING",
    phase: "INIT",
    verification: { pass: false },
    timestamp: now(),

    error: null,
    errorCode: null,
    degraded: false,
    degradedDomains: [],

    backend: null,
    projectionState: null,
    primitive: null,
    topology: null,
    renderAuthority: null,
    density: null,
    audit: null,

    scope: null,
    lens: null,
    worldVariantState: null,
    traversalState: null,
    worldModeState: null,

    psychology: basePsychologySurface()
  };
}

function buildInitialViewState(mode) {
  return {
    scope: "world",
    lens: "baseline",
    worldVariantState: {
      variant: "default"
    },
    traversalState: {
      bias: "SOUTH"
    },
    worldModeState: {
      mode: mode === "index" ? "round" : "round"
    },
    psychologyState: null,
    psychologyEnvelope: null,
    psychologyReceipt: null
  };
}

function mergeRenderIntoReceipt(receipt, renderResult, viewState, backend) {
  const output = normalizeObject(renderResult);
  const state = normalizeObject(viewState);
  const priorPsychology = isObject(receipt.psychology) ? receipt.psychology : basePsychologySurface();

  return {
    ...receipt,
    backend: backend ?? receipt.backend,
    projectionState: output.projectionState ?? receipt.projectionState,
    primitive: output.primitive ?? receipt.primitive,
    topology: output.topology ?? receipt.topology,
    renderAuthority: output.renderAuthority ?? receipt.renderAuthority,
    density: output.density ?? receipt.density,
    audit: output.audit ?? receipt.audit,

    scope: state.scope ?? receipt.scope,
    lens: state.lens ?? receipt.lens,
    worldVariantState: state.worldVariantState ?? receipt.worldVariantState,
    traversalState: state.traversalState ?? receipt.traversalState,
    worldModeState: state.worldModeState ?? receipt.worldModeState,

    psychology: {
      state: state.psychologyState ?? priorPsychology.state,
      envelope: state.psychologyEnvelope ?? priorPsychology.envelope,
      receipt: state.psychologyReceipt ?? priorPsychology.receipt
    }
  };
}

function buildFailureReceipt(errorCode, message, priorReceipt = null) {
  const prior = priorReceipt ? normalizeObject(priorReceipt) : {};
  return {
    ...baseReceipt(),
    ...prior,
    status: "FAIL",
    phase: "FAIL",
    verification: { pass: false },
    error: message || errorCode,
    errorCode: errorCode || "RUNTIME_FAILURE",
    degraded: false,
    degradedDomains: [],
    timestamp: now()
  };
}

function buildDuplicateStartReceipt() {
  return buildFailureReceipt("RUNTIME_DUPLICATE_START", "Runtime already active");
}

function buildRunningReceipt(priorReceipt, renderResult, viewState, backend) {
  const merged = mergeRenderIntoReceipt(
    priorReceipt ? { ...baseReceipt(), ...priorReceipt } : baseReceipt(),
    renderResult,
    viewState,
    backend
  );

  return {
    ...merged,
    status: "RUNNING",
    phase: "RUNNING",
    verification: { pass: true },
    degraded: false,
    degradedDomains: [],
    error: null,
    errorCode: null,
    timestamp: now()
  };
}

function buildDegradedReceipt(domains, message, priorReceipt, renderResult, viewState, backend) {
  const merged = mergeRenderIntoReceipt(
    priorReceipt ? { ...baseReceipt(), ...priorReceipt } : baseReceipt(),
    renderResult,
    viewState,
    backend
  );

  return {
    ...merged,
    status: "DEGRADED",
    phase: "DEGRADED",
    verification: { pass: false },
    degraded: true,
    degradedDomains: Array.from(new Set(Array.isArray(domains) ? domains : [])),
    error: message || "Runtime degraded",
    errorCode: "RUNTIME_DEGRADED",
    timestamp: now()
  };
}

function emitReceipt(receipt, instruments) {
  const normalized = normalizeObject(receipt);
  const degradedDomains = Array.isArray(normalized.degradedDomains) ? normalized.degradedDomains.slice() : [];

  const writeOk = safeWriteRuntimeReceipt(normalized);
  if (!writeOk) degradedDomains.push("RUNTIME_RECEIPT");

  const storageOk = safeSetStorage(STORAGE_KEY, normalized);
  if (!storageOk) degradedDomains.push("STORAGE");

  if (instruments && typeof instruments.update === "function") {
    try {
      instruments.update(normalized);
    } catch (_) {
      degradedDomains.push("INSTRUMENTS");
    }
  }

  if (degradedDomains.length === 0) {
    return normalized;
  }

  if (normalized.status === "FAIL") {
    return {
      ...normalized,
      degraded: true,
      degradedDomains: Array.from(new Set([...(normalized.degradedDomains || []), ...degradedDomains])),
      timestamp: now()
    };
  }

  return {
    ...normalized,
    status: "DEGRADED",
    phase: "DEGRADED",
    verification: { pass: false },
    degraded: true,
    degradedDomains: Array.from(new Set([...(normalized.degradedDomains || []), ...degradedDomains])),
    error: normalized.error || "Receipt emission degraded",
    errorCode: normalized.errorCode || "RECEIPT_DEGRADED",
    timestamp: now()
  };
}

function ensureCanvasSurface(canvas) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("Missing valid canvas surface");
  }
  return canvas;
}

function ensureRootSurface(root) {
  if (!root) return null;
  return root;
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
  const ctx2d = canvas.getContext("2d", { alpha: false });
  if (ctx2d) {
    return {
      backend: "2d",
      ctx: ctx2d
    };
  }

  throw new Error("No supported rendering backend available");
}

function resolvePlanetField() {
  if (typeof generatePlanetField === "function") {
    return generatePlanetField();
  }

  if (WORLD_KERNEL && typeof WORLD_KERNEL.generatePlanetField === "function") {
    return WORLD_KERNEL.generatePlanetField();
  }

  throw new Error("Planet field builder unavailable");
}

function resolveViewState(priorState) {
  if (isObject(priorState)) {
    return priorState;
  }

  const storageState = safeGetStorage(STORAGE_KEY);
  if (isObject(storageState)) {
    return {
      scope: storageState.scope ?? "world",
      lens: storageState.lens ?? "baseline",
      worldVariantState: isObject(storageState.worldVariantState) ? storageState.worldVariantState : { variant: "default" },
      traversalState: isObject(storageState.traversalState) ? storageState.traversalState : { bias: "SOUTH" },
      worldModeState: isObject(storageState.worldModeState) ? storageState.worldModeState : { mode: "round" },
      psychologyState: storageState.psychology?.state ?? null,
      psychologyEnvelope: storageState.psychology?.envelope ?? null,
      psychologyReceipt: storageState.psychology?.receipt ?? null
    };
  }

  return buildInitialViewState("index");
}

function classifyCriticalInvariantError() {
  if (!hasRAF()) {
    return {
      critical: true,
      errorCode: "RUNTIME_NO_FRAME_SCHEDULER",
      message: "requestAnimationFrame unavailable"
    };
  }

  if (!WORLD_KERNEL) {
    return {
      critical: true,
      errorCode: "RUNTIME_KERNEL_UNAVAILABLE",
      message: "WORLD_KERNEL unavailable"
    };
  }

  if (typeof renderPlanet !== "function") {
    return {
      critical: true,
      errorCode: "RUNTIME_RENDER_UNAVAILABLE",
      message: "renderPlanet unavailable"
    };
  }

  return {
    critical: false,
    errorCode: null,
    message: null
  };
}

/* =========================
   RUNTIME
========================= */

export function startRuntime({
  canvas,
  root = null,
  mode = "index"
} = {}) {
  if (runtimeActive) {
    emitReceipt(buildDuplicateStartReceipt(), null);
    return { dispose() {} };
  }

  const invariantCheck = classifyCriticalInvariantError();
  if (invariantCheck.critical) {
    emitReceipt(buildFailureReceipt(invariantCheck.errorCode, invariantCheck.message), null);
    return { dispose() {} };
  }

  let runtimeCanvas;
  let runtimeRoot;
  let backendState;
  let planetField;
  let instruments = null;
  let running = false;
  let rafId = null;
  let resizeHandlerInstalled = false;
  let lastReceipt = baseReceipt();
  let lastGoodViewState = buildInitialViewState(mode);

  try {
    runtimeCanvas = ensureCanvasSurface(canvas);
    runtimeRoot = ensureRootSurface(root);
    ensureCanvasBackingStore(runtimeCanvas);
    backendState = resolveBackend(runtimeCanvas);
    planetField = resolvePlanetField();

    instruments = safeCreateInstruments();
    if (instruments) {
      safeInstallGlobalInstruments(instruments);
    }

    runtimeActive = true;
    running = true;

    lastReceipt = emitReceipt(
      {
        ...baseReceipt(),
        status: "BOOTING",
        phase: "BOOTING",
        verification: { pass: false },
        backend: backendState.backend,
        scope: lastGoodViewState.scope,
        lens: lastGoodViewState.lens,
        worldVariantState: lastGoodViewState.worldVariantState,
        traversalState: lastGoodViewState.traversalState,
        worldModeState: lastGoodViewState.worldModeState,
        psychology: {
          state: lastGoodViewState.psychologyState,
          envelope: lastGoodViewState.psychologyEnvelope,
          receipt: lastGoodViewState.psychologyReceipt
        },
        timestamp: now()
      },
      instruments
    );
  } catch (error) {
    runtimeActive = false;
    emitReceipt(
      buildFailureReceipt(
        "RUNTIME_BOOT_ERROR",
        error instanceof Error ? error.message : String(error)
      ),
      instruments
    );
    return { dispose() {} };
  }

  function onResize() {
    try {
      ensureCanvasBackingStore(runtimeCanvas);
    } catch (_) {}
  }

  function scheduleNextFrame() {
    if (!running) return;
    try {
      rafId = requestAnimationFrame(frame);
    } catch (error) {
      running = false;
      runtimeActive = false;
      lastReceipt = emitReceipt(
        buildFailureReceipt(
          "RUNTIME_SCHEDULER_FAILURE",
          error instanceof Error ? error.message : String(error),
          lastReceipt
        ),
        instruments
      );
    }
  }

  function frame() {
    if (!running) return;

    const invariant = classifyCriticalInvariantError();
    if (invariant.critical) {
      running = false;
      runtimeActive = false;
      lastReceipt = emitReceipt(
        buildFailureReceipt(invariant.errorCode, invariant.message, lastReceipt),
        instruments
      );
      return;
    }

    let nextViewState = lastGoodViewState;
    let renderResult = null;

    try {
      nextViewState = resolveViewState(lastGoodViewState);
      lastGoodViewState = nextViewState;

      renderResult = renderPlanet({
        ctx: backendState.ctx,
        planetField,
        projectPoint: null,
        viewState: nextViewState,
        root: runtimeRoot,
        canvas: runtimeCanvas,
        mode,
        backend: backendState.backend
      });

      lastReceipt = emitReceipt(
        buildRunningReceipt(lastReceipt, renderResult, nextViewState, backendState.backend),
        instruments
      );
    } catch (error) {
      lastReceipt = emitReceipt(
        buildDegradedReceipt(
          ["RENDER"],
          error instanceof Error ? error.message : String(error),
          lastReceipt,
          renderResult,
          nextViewState,
          backendState.backend
        ),
        instruments
      );
    }

    scheduleNextFrame();
  }

  function dispose() {
    running = false;
    runtimeActive = false;

    if (rafId !== null && hasCAF()) {
      try {
        cancelAnimationFrame(rafId);
      } catch (_) {}
    }

    if (resizeHandlerInstalled && hasWindow()) {
      try {
        window.removeEventListener("resize", onResize);
      } catch (_) {}
    }

    if (instruments && typeof instruments.dispose === "function") {
      try {
        instruments.dispose();
      } catch (_) {}
    }

    safeClearGlobalInstruments(instruments);
  }

  if (hasWindow()) {
    try {
      window.addEventListener("resize", onResize);
      resizeHandlerInstalled = true;
    } catch (_) {}

    try {
      window.addEventListener("pagehide", dispose, { once: true });
    } catch (_) {}
  }

  if (hasDocument() && runtimeRoot) {
    try {
      runtimeRoot.setAttribute("data-runtime-mode", mode);
      runtimeRoot.setAttribute("data-runtime-status", "booting");
    } catch (_) {}
  }

  scheduleNextFrame();

  return { dispose };
}

export default { startRuntime };
