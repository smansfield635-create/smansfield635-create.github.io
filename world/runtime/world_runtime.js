// /world/runtime/world_runtime.js
// MODE: THIN CONDUCTOR RENEWAL
// STATUS: NON-DRIFT | CONTRACT-PRESERVING | PSYCHOLOGY-PREWIRED
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

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

function safeGetGlobalInstruments() {
  try {
    const host = typeof window !== "undefined" ? window : globalThis;
    return host?.__CTE_INSTRUMENTS__ ?? null;
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
    phase: "INIT",
    verification: { pass: false },
    timestamp: now(),

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
  return {
    ...receipt,
    projectionState: renderResult?.projectionState ?? receipt.projectionState,
    primitive: renderResult?.primitive ?? receipt.primitive,
    topology: renderResult?.topology ?? receipt.topology,
    renderAuthority: renderResult?.renderAuthority ?? receipt.renderAuthority,
    density: renderResult?.density ?? receipt.density,
    audit: renderResult?.audit ?? receipt.audit,

    // pass-through only
    scope: viewState?.scope ?? receipt.scope,
    lens: viewState?.lens ?? receipt.lens,
    worldVariantState: viewState?.worldVariantState ?? receipt.worldVariantState,
    traversalState: viewState?.traversalState ?? receipt.traversalState,
    worldModeState: viewState?.worldModeState ?? receipt.worldModeState,

    // psychology carriage only
    psychology: {
      state: viewState?.psychologyState ?? receipt.psychology.state,
      envelope: viewState?.psychologyEnvelope ?? receipt.psychology.envelope,
      receipt: viewState?.psychologyReceipt ?? receipt.psychology.receipt
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
    timestamp: now()
  };
}

function buildDuplicateStartReceipt() {
  return buildFailureReceipt("RUNTIME_DUPLICATE_START", "Runtime already active");
}

function emitReceipt(receipt, instruments) {
  try {
    window.__AUTHORITY_RECEIPT__ = receipt;
  } catch (_) {}

  safeSetStorage("cte_runtime_v4", receipt);

  try {
    if (instruments && typeof instruments.update === "function") {
      instruments.update(receipt);
    }
  } catch (_) {}
}

function safeDisposeInstruments(instruments) {
  try {
    if (instruments && typeof instruments.dispose === "function") {
      instruments.dispose();
    }
  } catch (_) {}
}

/* =========================
   RUNTIME
========================= */

export function startRuntime({
  ctx,
  planetField,
  projectPoint,
  viewState = {},
  control = null
}) {
  if (runtimeActive) {
    const duplicateReceipt = buildDuplicateStartReceipt();
    emitReceipt(duplicateReceipt, null);
    return { dispose() {} };
  }

  runtimeActive = true;

  let running = true;
  let rafId = null;
  const instruments = safeGetGlobalInstruments();

  function resolveViewState() {
    if (control && typeof control.getViewState === "function") {
      return control.getViewState(viewState);
    }
    return viewState;
  }

  function frame() {
    if (!running) return;

    try {
      // Keep upstream node authority reachable, but do not interpret it here.
      // This validates availability without creating runtime-side meaning.
      if (!WORLD_KERNEL || typeof WORLD_KERNEL.resolveNode !== "function") {
        throw new Error("WORLD_KERNEL.resolveNode unavailable");
      }

      const nextViewState = resolveViewState();

      const renderResult = renderPlanet({
        ctx,
        planetField,
        projectPoint,
        viewState: nextViewState
      });

      const receipt = mergeRenderIntoReceipt(baseReceipt(), renderResult, nextViewState);
      receipt.phase = "RUNNING";
      receipt.verification = { pass: true };
      receipt.timestamp = now();

      emitReceipt(receipt, instruments);

      rafId = requestAnimationFrame(frame);
    } catch (err) {
      running = false;
      const failureReceipt = buildFailureReceipt(
        "RUNTIME_FRAME_ERROR",
        err?.message || "Runtime frame error"
      );
      emitReceipt(failureReceipt, instruments);
    }
  }

  function dispose() {
    running = false;
    runtimeActive = false;

    if (rafId !== null) {
      try {
        cancelAnimationFrame(rafId);
      } catch (_) {}
    }

    safeDisposeInstruments(instruments);
  }

  try {
    rafId = requestAnimationFrame(frame);
  } catch (err) {
    running = false;
    runtimeActive = false;
    const bootFailureReceipt = buildFailureReceipt(
      "RUNTIME_BOOT_ERROR",
      err?.message || "Runtime boot error"
    );
    emitReceipt(bootFailureReceipt, instruments);
  }

  try {
    window.addEventListener("pagehide", dispose, { once: true });
  } catch (_) {}

  return { dispose };
}

export default { startRuntime };
