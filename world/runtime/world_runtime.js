// /world/runtime/world_runtime.js
// MODE: THIN CONDUCTOR (CONTRACT-PRESERVING)
// STATUS: NON-DRIFT | RUNTIME CONTRACT RENEWAL
// OWNER: SEAN
// NOTE:
// - preserves orchestration, receipts, gauges continuity
// - consumes upstream truth (WORLD_KERNEL)
// - does NOT create semantic meaning layers

import { WORLD_KERNEL } from "../world_kernel.js";
import { renderPlanet } from "../render/index.js";

// If instruments module exists, keep it; otherwise guard usage
let createInstrumentsSafe = null;
try {
  // optional import; must not crash if absent
  // eslint-disable-next-line import/no-unresolved
  ({ createInstruments: createInstrumentsSafe } = await import("../instruments/index.js"));
} catch (_) {
  createInstrumentsSafe = null;
}

let runtimeActive = false;

/* =========================
   INTERNAL HELPERS (NON-SEMANTIC)
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
    worldModeState: null
  };
}

function mergeRenderIntoReceipt(receipt, renderResult, viewState) {
  // Pass-through only. No reinterpretation.
  return {
    ...receipt,
    projectionState: renderResult?.projectionState ?? receipt.projectionState,
    primitive: renderResult?.primitive ?? receipt.primitive,
    topology: renderResult?.topology ?? receipt.topology,
    renderAuthority: renderResult?.renderAuthority ?? receipt.renderAuthority,
    density: renderResult?.density ?? receipt.density,
    audit: renderResult?.audit ?? receipt.audit,
    // carry-through view state without mutation
    scope: viewState?.scope ?? receipt.scope,
    lens: viewState?.lens ?? receipt.lens,
    worldVariantState: viewState?.worldVariantState ?? receipt.worldVariantState,
    traversalState: viewState?.traversalState ?? receipt.traversalState,
    worldModeState: viewState?.worldModeState ?? receipt.worldModeState
  };
}

/* =========================
   RUNTIME
========================= */

export function startRuntime({ ctx, planetField, projectPoint, viewState = {}, control = null }) {
  if (runtimeActive) {
    // emit duplicate-start failure receipt without crashing loop
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

  // optional instruments (gauges)
  const instruments = typeof createInstrumentsSafe === "function"
    ? createInstrumentsSafe()
    : null;

  function frame() {
    if (!running) return;

    let receipt = baseReceipt();

    try {
      // CONTROL → VIEWSTATE continuity (pass-through)
      const vs = control && typeof control.getViewState === "function"
        ? control.getViewState(viewState)
        : viewState;

      // RENDER (downstream expression)
      const renderResult = renderPlanet({
        ctx,
        planetField,
        projectPoint,
        viewState: vs
      });

      // PASS-THROUGH merge (no semantic construction)
      receipt = mergeRenderIntoReceipt(receipt, renderResult, vs);

      // SUCCESS
      receipt.phase = "RUNNING";
      receipt.verification = { pass: true };
      receipt.timestamp = now();

      // EMIT RECEIPTS
      window.__AUTHORITY_RECEIPT__ = receipt;
      safeSetStorage("cte_runtime_v4", receipt);

      // INSTRUMENTS (if present)
      if (instruments && typeof instruments.update === "function") {
        instruments.update(receipt);
      }

      rafId = requestAnimationFrame(frame);
    } catch (err) {
      // FAILURE PATH (contract-preserving)
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

  // best-effort cleanup hooks (non-invasive)
  try {
    window.addEventListener("pagehide", dispose, { once: true });
  } catch (_) {}

  return { dispose };
}

export default { startRuntime };
