// /world/runtime/world_runtime.js
// MODE: THIN CONDUCTOR RENEWAL
// STATUS: NON-DRIFT | CONTRACT-PRESERVING | FAILURE-ISOLATING | CONTINUITY-PRESERVING
// OWNER: SEAN

import { WORLD_KERNEL } from "../world_kernel.js";
import { renderPlanet } from "../render/index.js";

let runtimeActive = false;

/* =========================
   UTIL
========================= */

function now() {
  return Date.now();
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

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function safeGetGlobalInstruments() {
  try {
    const host = hasWindow() ? window : globalThis;
    return host?.__CTE_INSTRUMENTS__ ?? null;
  } catch (_) {
    return null;
  }
}

function safeWriteAuthorityReceipt(receipt) {
  try {
    if (hasWindow()) {
      window.__AUTHORITY_RECEIPT__ = receipt;
      return true;
    }
  } catch (_) {}
  return false;
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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
    phase: "INIT",
    verification: { pass: false },
    timestamp: now(),

    // failure state
    error: null,
    errorCode: null,
    degraded: false,
    degradedDomains: [],

    // render/runtime continuity
    projectionState: null,
    primitive: null,
    topology: null,
    renderAuthority: null,
    density: null,
    audit: null,

    // state carriage
    scope: null,
    lens: null,
    worldVariantState: null,
    traversalState: null,
    worldModeState: null,

    // universal domain prewire
    psychology: basePsychologySurface()
  };
}

function mergeRenderIntoReceipt(receipt, renderResult, viewState) {
  const output = normalizeObject(renderResult);
  const state = normalizeObject(viewState);

  return {
    ...receipt,
    projectionState: output.projectionState ?? receipt.projectionState,
    primitive: output.primitive ?? receipt.primitive,
    topology: output.topology ?? receipt.topology,
    renderAuthority: output.renderAuthority ?? receipt.renderAuthority,
    density: output.density ?? receipt.density,
    audit: output.audit ?? receipt.audit,

    // pass-through only
    scope: state.scope ?? receipt.scope,
    lens: state.lens ?? receipt.lens,
    worldVariantState: state.worldVariantState ?? receipt.worldVariantState,
    traversalState: state.traversalState ?? receipt.traversalState,
    worldModeState: state.worldModeState ?? receipt.worldModeState,

    // psychology carriage only
    psychology: {
      state: state.psychologyState ?? receipt.psychology.state,
      envelope: state.psychologyEnvelope ?? receipt.psychology.envelope,
      receipt: state.psychologyReceipt ?? receipt.psychology.receipt
    }
  };
}

function buildFailureReceipt(errorCode, message) {
  return {
    ...baseReceipt(),
    phase: "FAIL",
    verification: { pass: false },
    error: message || errorCode,
    errorCode,
    timestamp: now(),
    degraded: false,
    degradedDomains: []
  };
}

function buildDegradedReceipt(domains, message, priorReceipt = null) {
  const degradedDomains = Array.isArray(domains) ? domains.slice() : [];
  const base = priorReceipt ? { ...baseReceipt(), ...priorReceipt } : baseReceipt();

  return {
    ...base,
    phase: "DEGRADED",
    verification: { pass: false },
    timestamp: now(),
    degraded: true,
    degradedDomains,
    error: message || "Runtime degraded",
    errorCode: "RUNTIME_DEGRADED"
  };
}

function buildDuplicateStartReceipt() {
  return buildFailureReceipt("RUNTIME_DUPLICATE_START", "Runtime already active");
}

function emitReceipt(receipt, instruments) {
  const domains = [];
  const normalizedReceipt = normalizeObject(receipt);

  const authorityWriteOk = safeWriteAuthorityReceipt(normalizedReceipt);
  if (!authorityWriteOk) domains.push("AUTHORITY_RECEIPT");

  const storageOk = safeSetStorage("cte_runtime_v4", normalizedReceipt);
  if (!storageOk) domains.push("STORAGE");

  if (instruments && typeof instruments.update === "function") {
    try {
      instruments.update(normalizedReceipt);
    } catch (_) {
      domains.push("INSTRUMENTS");
    }
  }

  if (domains.length === 0) {
    return normalizedReceipt;
  }

  return {
    ...normalizedReceipt,
    phase: normalizedReceipt.phase === "FAIL" ? "FAIL" : "DEGRADED",
    verification: {
      pass: normalizedReceipt.phase === "RUNNING" ? false : normalizedReceipt.verification?.pass ?? false
    },
    degraded: true,
    degradedDomains: Array.from(new Set([...(normalizedReceipt.degradedDomains || []), ...domains])),
    error: normalizedReceipt.error || "Receipt emission degraded",
    errorCode: normalizedReceipt.errorCode || "RECEIPT_DEGRADED",
    timestamp: now()
  };
}

function safeDisposeInstruments(instruments, options = {}) {
  const ownsLifecycle = options?.instrumentOwnership === "runtime";
  if (!ownsLifecycle) return;

  try {
    if (instruments && typeof instruments.dispose === "function") {
      instruments.dispose();
    }
  } catch (_) {}
}

function classifyCriticalInvariantError(error) {
  const message = String(error?.message || "");

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

  if (typeof WORLD_KERNEL.resolveNode !== "function") {
    return {
      critical: true,
      errorCode: "RUNTIME_NODE_AUTHORITY_UNAVAILABLE",
      message: "WORLD_KERNEL.resolveNode unavailable"
    };
  }

  if (message.includes("WORLD_KERNEL.resolveNode unavailable")) {
    return {
      critical: true,
      errorCode: "RUNTIME_NODE_AUTHORITY_UNAVAILABLE",
      message
    };
  }

  return {
    critical: false,
    errorCode: null,
    message
  };
}

function defaultViewState() {
  return {};
}

function validateViewStateCandidate(candidate) {
  return candidate && typeof candidate === "object" && !Array.isArray(candidate);
}

/* =========================
   RUNTIME
========================= */

export function startRuntime({
  ctx,
  planetField,
  projectPoint,
  viewState = {},
  control = null,
  instrumentOwnership = "external"
}) {
  if (runtimeActive) {
    const duplicateReceipt = buildDuplicateStartReceipt();
    emitReceipt(duplicateReceipt, null);
    return { dispose() {} };
  }

  if (!hasRAF()) {
    const bootFailureReceipt = buildFailureReceipt(
      "RUNTIME_NO_FRAME_SCHEDULER",
      "requestAnimationFrame unavailable"
    );
    emitReceipt(bootFailureReceipt, null);
    return { dispose() {} };
  }

  runtimeActive = true;

  let running = true;
  let rafId = null;
  let lastGoodViewState = validateViewStateCandidate(viewState) ? viewState : defaultViewState();
  let lastReceipt = baseReceipt();

  const instruments = safeGetGlobalInstruments();

  function resolveViewState() {
    try {
      const candidate =
        control && typeof control.getViewState === "function"
          ? control.getViewState(lastGoodViewState)
          : viewState;

      if (validateViewStateCandidate(candidate)) {
        lastGoodViewState = candidate;
        return {
          viewState: candidate,
          degraded: false,
          domains: []
        };
      }

      return {
        viewState: lastGoodViewState,
        degraded: true,
        domains: ["VIEW_STATE"],
        message: "Invalid viewState candidate; using last valid state"
      };
    } catch (err) {
      return {
        viewState: lastGoodViewState,
        degraded: true,
        domains: ["VIEW_STATE"],
        message: err?.message || "View state resolution failed; using last valid state"
      };
    }
  }

  function scheduleNextFrame() {
    if (!running) return;
    try {
      rafId = requestAnimationFrame(frame);
    } catch (err) {
      running = false;
      runtimeActive = false;
      const failureReceipt = buildFailureReceipt(
        "RUNTIME_BOOT_ERROR",
        err?.message || "Runtime scheduling failure"
      );
      lastReceipt = emitReceipt(failureReceipt, instruments);
    }
  }

  function frame() {
    if (!running) return;

    const kernelCheck = classifyCriticalInvariantError(null);
    if (kernelCheck.critical) {
      running = false;
      runtimeActive = false;
      const failureReceipt = buildFailureReceipt(kernelCheck.errorCode, kernelCheck.message);
      lastReceipt = emitReceipt(failureReceipt, instruments);
      return;
    }

    const viewResolution = resolveViewState();
    const nextViewState = viewResolution.viewState;

    let frameReceipt = baseReceipt();
    let renderFailed = false;
    let renderMessage = null;
    let degradedDomains = [];
    let renderResult = null;

    try {
      renderResult = renderPlanet({
        ctx,
        planetField,
        projectPoint,
        viewState: nextViewState
      });

      frameReceipt = mergeRenderIntoReceipt(frameReceipt, renderResult, nextViewState);
      frameReceipt.phase = "RUNNING";
      frameReceipt.verification = { pass: true };
      frameReceipt.timestamp = now();
    } catch (err) {
      renderFailed = true;
      renderMessage = err?.message || "Render failure";
      degradedDomains.push("RENDER");

      frameReceipt = mergeRenderIntoReceipt(
        buildDegradedReceipt(["RENDER"], renderMessage, lastReceipt),
        {},
        nextViewState
      );
    }

    if (viewResolution.degraded) {
      degradedDomains = degradedDomains.concat(viewResolution.domains || []);
      frameReceipt = {
        ...frameReceipt,
        phase: frameReceipt.phase === "FAIL" ? "FAIL" : "DEGRADED",
        verification: { pass: false },
        degraded: true,
        degradedDomains: Array.from(new Set([...(frameReceipt.degradedDomains || []), ...degradedDomains])),
        error: frameReceipt.error || viewResolution.message || "Runtime degraded",
        errorCode: frameReceipt.errorCode || "RUNTIME_DEGRADED",
        timestamp: now()
      };
    }

    if (!renderFailed && degradedDomains.length === 0) {
      frameReceipt.degraded = false;
      frameReceipt.degradedDomains = [];
      frameReceipt.error = null;
      frameReceipt.errorCode = null;
    } else if (frameReceipt.phase !== "FAIL") {
      frameReceipt.phase = "DEGRADED";
      frameReceipt.verification = { pass: false };
      frameReceipt.degraded = true;
      frameReceipt.degradedDomains = Array.from(
        new Set([...(frameReceipt.degradedDomains || []), ...degradedDomains])
      );
      frameReceipt.error = frameReceipt.error || renderMessage || viewResolution.message || "Runtime degraded";
      frameReceipt.errorCode = frameReceipt.errorCode || "RUNTIME_DEGRADED";
      frameReceipt.timestamp = now();
    }

    lastReceipt = emitReceipt(frameReceipt, instruments);
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

    safeDisposeInstruments(instruments, { instrumentOwnership });
  }

  try {
    scheduleNextFrame();
  } catch (err) {
    running = false;
    runtimeActive = false;
    const bootFailureReceipt = buildFailureReceipt(
      "RUNTIME_BOOT_ERROR",
      err?.message || "Runtime boot error"
    );
    lastReceipt = emitReceipt(bootFailureReceipt, instruments);
  }

  try {
    if (hasWindow()) {
      window.addEventListener("pagehide", dispose, { once: true });
    }
  } catch (_) {}

  return { dispose };
}

export default { startRuntime };
