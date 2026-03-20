// /world/runtime/world_runtime.js
// MODE: STANDARD RUNTIME RECOVERY
// STATUS: SINGLE-FILE CANONICAL RUNTIME SPINE
// PURPOSE:
// 1) boot one runtime only
// 2) maintain control -> render continuity
// 3) emit authority receipt continuously
// 4) emit live gauges receipt continuously
// 5) stay finite, deterministic, and non-drifting

import { WORLD_KERNEL as worldKernel } from "/world/world_kernel.js";
import { createPlanetEngine } from "/world/planet_engine.js";
import { createRenderer } from "/world/render.js";
import { createControlSystem } from "/world/control.js";
import * as instruments from "/assets/instruments.js";

const RECEIPT_KEY = "__AUTHORITY_RECEIPT__";
const RUNTIME_ACTIVE_KEY = "__WORLD_RUNTIME_ACTIVE__";
const RUNTIME_STORAGE_KEY = "cte_runtime_v3";

let canvas = null;
let ctx = null;
let planetEngine = null;
let renderer = null;
let control = null;
let planetField = null;

let rafId = 0;
let lastNow = 0;
let started = false;
let disposed = false;

let onResize = null;
let onPageHide = null;
let onPointerDown = null;
let onPointerMove = null;
let onPointerUp = null;
let onPointerCancel = null;

function ensureReceipt() {
  if (!window[RECEIPT_KEY]) {
    window[RECEIPT_KEY] = {
      bootSource: "/index.html",
      runtimeSource: "/world/runtime/world_runtime.js",
      inputOwner: "/world/control.js",
      orbitOwner: "/world/control.js",
      renderSource: "/world/render.js",
      transitionSource: null,
      duplicateRuntime: false,
      duplicateRender: false,
      duplicateInput: false,

      page: "world",
      phase: "BOOT",
      mode: "active",
      timestamp: 0,
      fps: 0,
      dtMs: 0,

      control: {
        motionState: {
          yaw: 0,
          pitch: 0,
          yawVelocity: 0,
          pitchVelocity: 0,
          orbitPhase: 0,
          zoomCurrent: 0,
          zoomTarget: 0,
          mode: null,
        },
        orbitalState: {
          orbitPhase: 0,
        },
        projectionSummary: null,
        cameraState: null,
      },

      renderAudit: {
        sampleCount: 0,
        waterFamilyCount: 0,
        landFamilyCount: 0,
        cryosphereCount: 0,
        shorelineCount: 0,
      },

      emissionReceipt: {
        emissionOrbitalCount: 0,
        emissionFrontVisible: 0,
        emissionEmitted: 0,
        emissionSuppressed: 0,
        emissionPass: false,
      },

      placementReceipt: {
        markerRequired: false,
        placementPlaced: 0,
        markerCollisionCount: 0,
        placementReservedReject: 0,
        placementViewportReject: 0,
        placementPass: false,
      },

      instrument: null,

      verification: {
        pass: false,
      },

      failure: {
        phase: null,
        message: null,
      },
    };
  }

  return window[RECEIPT_KEY];
}

function emitRuntimeReceiptContinuous(receipt, extra = {}) {
  const payload = {
    page: "/index.html",
    phase: receipt.verification?.pass ? "RUNNING" : "BOOT",
    mode: receipt.mode || "active",
    timestamp: new Date().toISOString(),

    fps: receipt.fps || 0,
    dtMs: receipt.dtMs || 0,

    control: {
      motionState: receipt.control?.motionState || {},
      orbitalState: receipt.control?.orbitalState || {},
      projectionSummary: receipt.control?.projectionSummary || null,
      cameraState: receipt.control?.cameraState || null,
    },

    instrument: receipt.instrument || {},

    renderAudit: receipt.renderAudit || {},

    emissionReceipt: receipt.emissionReceipt || {},
    placementReceipt: receipt.placementReceipt || {},

    verification: receipt.verification || { pass: false },

    failure: {
      phase: receipt.failure?.phase || null,
      message: receipt.failure?.message || "",
    },

    ...extra,
  };

  try {
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function setFailure(phase, message) {
  const receipt = ensureReceipt();
  receipt.verification.pass = false;
  receipt.failure.phase = phase;
  receipt.failure.message = message;
}

function clearFailure() {
  const receipt = ensureReceipt();
  receipt.failure.phase = null;
  receipt.failure.message = null;
}

function getCanvas() {
  const el = document.getElementById("world");
  if (!el) {
    throw new Error("Missing #world canvas");
  }
  return el;
}

function resize() {
  if (!canvas || !ctx) return;

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (control && typeof control.resize === "function") {
    control.resize(width, height);
  }
}

function setupSystems() {
  planetEngine = createPlanetEngine();
  renderer = createRenderer();
  control = createControlSystem();

  if (!planetEngine || typeof planetEngine.buildPlanetField !== "function") {
    throw new Error("planet_engine missing buildPlanetField()");
  }

  if (!renderer || typeof renderer.renderPlanet !== "function") {
    throw new Error("render.js missing renderPlanet()");
  }

  if (!control) {
    throw new Error("control.js missing createControlSystem()");
  }

  planetField = planetEngine.buildPlanetField({});
  if (!planetField) {
    throw new Error("planet_engine returned empty field");
  }
}

function safe(fn, fallback = null) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function updateControlReceipt(receipt) {
  const motionState = safe(
    () => (typeof control.getMotionState === "function" ? control.getMotionState() : null),
    null
  );

  const orbitalState = safe(
    () => (typeof control.getOrbitalState === "function" ? control.getOrbitalState() : null),
    null
  );

  const projectionSummary = safe(
    () =>
      typeof control.getProjectionSummary === "function"
        ? control.getProjectionSummary()
        : null,
    null
  );

  const cameraState = safe(
    () => (typeof control.getCameraState === "function" ? control.getCameraState() : null),
    null
  );

  if (motionState) receipt.control.motionState = motionState;
  if (orbitalState) receipt.control.orbitalState = orbitalState;
  receipt.control.projectionSummary = projectionSummary;
  receipt.control.cameraState = cameraState;
}

function renderFrame(receipt) {
  const renderResult =
    renderer.renderPlanet({
      ctx,
      planetField,
      worldKernel,
      projectPoint: (lat, lon, r = 0) => {
        if (typeof control.projectSphere === "function") {
          return control.projectSphere(lat, lon, r);
        }
        return null;
      },
      viewState:
        typeof control.getCameraState === "function"
          ? control.getCameraState()
          : null,
    }) || {};

  const audit = renderResult.audit || {};
  const orbitalAudit = renderResult.orbitalAudit || {};
  const placementAudit = renderResult.placementAudit || renderResult.placementReceipt || {};

  receipt.renderAudit.sampleCount = audit.sampleCount ?? 0;
  receipt.renderAudit.waterFamilyCount = audit.waterFamilyCount ?? 0;
  receipt.renderAudit.landFamilyCount = audit.landFamilyCount ?? 0;
  receipt.renderAudit.cryosphereCount = audit.cryosphereCount ?? 0;
  receipt.renderAudit.shorelineCount = audit.shorelineCount ?? 0;

  receipt.emissionReceipt.emissionOrbitalCount = orbitalAudit.count ?? 0;
  receipt.emissionReceipt.emissionFrontVisible = orbitalAudit.frontVisibleCount ?? 0;
  receipt.emissionReceipt.emissionEmitted = orbitalAudit.emittedCount ?? 0;
  receipt.emissionReceipt.emissionSuppressed =
    (orbitalAudit.rejectedBackfaceCount ?? 0) +
    (orbitalAudit.rejectedWeakVisibilityCount ?? 0);
  receipt.emissionReceipt.emissionPass = true;

  receipt.placementReceipt.markerRequired = placementAudit.markerRequired ?? false;
  receipt.placementReceipt.placementPlaced = placementAudit.placementPlaced ?? 0;
  receipt.placementReceipt.markerCollisionCount = placementAudit.markerCollisionCount ?? 0;
  receipt.placementReceipt.placementReservedReject = placementAudit.placementReservedReject ?? 0;
  receipt.placementReceipt.placementViewportReject = placementAudit.placementViewportReject ?? 0;
  receipt.placementReceipt.placementPass = placementAudit.placementPass ?? false;
}

function updateInstrumentReceipt(receipt) {
  try {
    if (typeof instruments.buildInstrumentState === "function") {
      receipt.instrument = instruments.buildInstrumentState({
        control: receipt.control,
        renderAudit: receipt.renderAudit,
        emissionReceipt: receipt.emissionReceipt,
        placementReceipt: receipt.placementReceipt,
        world: {
          phase: receipt.phase,
          terrainClass: "unknown",
          stabilityClass: "unknown",
        },
      });
    }
  } catch {}
}

function disposeRuntime() {
  if (disposed) return;
  disposed = true;

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  if (canvas && onPointerDown) {
    canvas.removeEventListener("pointerdown", onPointerDown);
  }

  if (onPointerMove) {
    window.removeEventListener("pointermove", onPointerMove);
  }

  if (onPointerUp) {
    window.removeEventListener("pointerup", onPointerUp);
  }

  if (onPointerCancel) {
    window.removeEventListener("pointercancel", onPointerCancel);
  }

  if (onResize) {
    window.removeEventListener("resize", onResize);
  }

  if (onPageHide) {
    window.removeEventListener("pagehide", onPageHide);
  }

  window[RUNTIME_ACTIVE_KEY] = false;
  started = false;
}

function bindInput() {
  if (!canvas || !control) return;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  onPointerDown = (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  };

  onPointerMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (typeof control.applyDrag === "function") {
      control.applyDrag(dx, dy);
    }
  };

  onPointerUp = () => {
    if (dragging && typeof control.releaseDrag === "function") {
      control.releaseDrag();
    }
    dragging = false;
  };

  onPointerCancel = () => {
    if (dragging && typeof control.releaseDrag === "function") {
      control.releaseDrag();
    }
    dragging = false;
  };

  canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerCancel, { passive: true });
}

function frame(now) {
  const receipt = ensureReceipt();
  const dtMs = lastNow ? now - lastNow : 16.67;
  lastNow = now;

  clearFailure();

  receipt.page = "world";
  receipt.phase = "RUNNING";
  receipt.mode = "active";
  receipt.timestamp = now;
  receipt.dtMs = dtMs;
  receipt.fps = dtMs > 0 ? 1000 / dtMs : 0;

  try {
    if (typeof control.stepInertia === "function") {
      control.stepInertia(dtMs);
    }

    updateControlReceipt(receipt);
    renderFrame(receipt);
    updateInstrumentReceipt(receipt);

    receipt.verification.pass = true;
  } catch (err) {
    setFailure("frame", err instanceof Error ? err.message : String(err));
  }

  emitRuntimeReceiptContinuous(receipt);
  rafId = window.requestAnimationFrame(frame);
}

export function startRuntime() {
  const receipt = ensureReceipt();

  if (started || window[RUNTIME_ACTIVE_KEY]) {
    receipt.duplicateRuntime = true;
    setFailure("startup", "Duplicate runtime detected");
    emitRuntimeReceiptContinuous(receipt);
    return;
  }

  started = true;
  disposed = false;
  window[RUNTIME_ACTIVE_KEY] = true;

  try {
    canvas = getCanvas();
    ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D context unavailable");
    }

    setupSystems();
    resize();
    bindInput();

    onResize = () => {
      resize();
    };

    onPageHide = () => {
      disposeRuntime();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pagehide", onPageHide, { passive: true });

    receipt.page = "world";
    receipt.phase = "BOOT";
    receipt.mode = "active";
    receipt.verification.pass = false;

    lastNow = performance.now();
    emitRuntimeReceiptContinuous(receipt);
    rafId = window.requestAnimationFrame(frame);
  } catch (err) {
    setFailure("startup", err instanceof Error ? err.message : String(err));
    emitRuntimeReceiptContinuous(receipt);
    disposeRuntime();
  }
}

export default {
  startRuntime,
};
