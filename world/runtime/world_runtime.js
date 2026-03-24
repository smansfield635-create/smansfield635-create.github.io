// /world/runtime/world_runtime.js
// MODE: THIN CONDUCTOR (CONTRACT-PRESERVING · PSYCHOLOGY PREWIRE)
// STATUS: NON-DRIFT | RUNTIME RENEWAL (NO SEMANTIC ACCRETION)
// OWNER: SEAN

import { WORLD_KERNEL } from "../world_kernel.js";
import { renderPlanet } from "../render/index.js";

// Optional instruments (must not break if absent)
let createInstrumentsSafe = null;
try {
  // eslint-disable-next-line import/no-unresolved
  ({ createInstruments: createInstrumentsSafe } = await import("../instruments/index.js"));
} catch (_) {
  createInstrumentsSafe = null;
}

let runtimeActive = false;

/* =========================
   UTIL (NON-SEMANTIC)
========================= */

function now() {
  return Date.now();
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

function baseReceipt() {
  return {
    phase: "INIT",
    verification: { pass: false },
    timestamp: now(),

    // REQUIRED SURFACES
    projectionState: null,
    primitive: null,
    topology: null,
    renderAuthority: null,
    density: null,
    audit: null,

    // STATE CARRIAGE
    scope: null,
    lens: null,
    worldVariantState: null,
    traversalState: null,
    worldModeState: null,

    // PSYCHOLOGY PREWIRE (EMPTY / THIN)
    psychology: {
      state: null,
      envelope: null
    }
  };
}

function mergeRenderIntoReceipt(receipt, renderResult, viewState) {
  // Strict pass-through. No interpretation.
  return {
    ...receipt,
    projectionState: renderResult?.projectionState ?? receipt.projectionState,
    primitive: renderResult?.primitive ?? receipt.primitive,
    topology: renderResult?.topology ?? receipt.topology,
    renderAuthority: renderResult?.renderAuthority ?? receipt.renderAuthority,
    density: renderResult?.density ?? receipt.density,
    audit: renderResult?.audit ?? receipt.audit,

    // PASS-THROUGH STATE
    scope: viewState?.scope ?? receipt.scope,
    lens: viewState?.lens ?? receipt.lens,
    worldVariantState: viewState?.worldVariantState ?? receipt.worldVariantState,
    traversalState: viewState?.traversalState ?? receipt.traversalState,
    worldModeState: viewState?.worldModeState ?? receipt.worldModeState,

    // PSYCHOLOGY PASS-THROUGH (NO SEMANTIC CREATION)
    psychology: {
      state: viewState?.psychologyState ?? receipt.psychology.state,
      envelope: viewState?.psychologyEnvelope ?? receipt.psychology.envelope
    }
  };
}

/* =========================
   RUNTIME (THIN CONDUCTOR)
========================= */

export function startRuntime({ ctx, planetField, projectPoint, viewState = {}, control = null }) {
  if (runtimeActive) {
    const dup = {
      ...baseReceipt(),
      phase: "FAIL",
      verification: { pass: false },
      error: "RUNTIME_DUPLICATE_START",
      timestamp: now()
    };
    window.__AUTHORITY_RECEIPT__ = dup;
    safeSetStorage("cte_runtime_v4", dup);
    return { dispose() {} };
  }

  runtimeActive = true;

  let running = true;
  let rafId = null;

  const instruments = typeof createInstrumentsSafe === "function"
    ? createInstrumentsSafe()
    : null;

  function frame() {
    if (!running) return;

    let receipt = baseReceipt();

    try {
      // CONTROL → VIEWSTATE continuity (pass-through only)
      const vs = control && typeof control.getViewState === "function"
        ? control.getViewState(viewState)
        : viewState;

      // RENDER
      const renderResult = renderPlanet({
        ctx,
        planetField,
        projectPoint,
        viewState: vs
      });

      // MERGE (NO SEMANTIC ACCRETION)
      receipt = mergeRenderIntoReceipt(receipt, renderResult, vs);

      // SUCCESS
      receipt.phase = "RUNNING";
      receipt.verification = { pass: true };
      receipt.timestamp = now();

      // EMIT RECEIPTS
      window.__AUTHORITY_RECEIPT__ = receipt;
      safeSetStorage("cte_runtime_v4", receipt);

      // INSTRUMENTS (PASS-THROUGH)
      if (instruments && typeof instruments.update === "function") {
        instruments.update(receipt);
      }

      rafId = requestAnimationFrame(frame);
    } catch (err) {
      const failure = {
        ...baseReceipt(),
        phase: "FAIL",
        verification: { pass: false },
        error: err?.message || "RUNTIME_FRAME_ERROR",
        timestamp: now()
      };

      window.__AUTHORITY_RECEIPT__ = failure;
      safeSetStorage("cte_runtime_v4", failure);

      if (instruments && typeof instruments.update === "function") {
        instruments.update(failure);
      }

      running = false;
    }
  }

  // BOOT
  try {
    rafId = requestAnimationFrame(frame);
  } catch (err) {
    const bootFail = {
      ...baseReceipt(),
      phase: "FAIL",
      verification: { pass: false },
      error: err?.message || "RUNTIME_BOOT_ERROR",
      timestamp: now()
    };
    window.__AUTHORITY_RECEIPT__ = bootFail;
    safeSetStorage("cte_runtime_v4", bootFail);
    running = false;
  }

  // LIFECYCLE
  function dispose() {
    running = false;
    runtimeActive = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (instruments && typeof instruments.dispose === "function") {
      instruments.dispose();
    }
  }

  try {
    window.addEventListener("pagehide", dispose, { once: true });
  } catch (_) {}

  return { dispose };
}

export default { startRuntime };
