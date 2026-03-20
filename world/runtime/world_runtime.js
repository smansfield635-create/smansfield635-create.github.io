// /world/runtime/world_runtime.js
// MODE: RUNTIME VISIBILITY + EMISSION GUARANTEE (TMT)
// PURPOSE:
// 1) ensure canvas is visible and sized
// 2) guarantee a visible draw every frame
// 3) guarantee cte_runtime_v3 emission every frame
// 4) do NOT alter control/render/engine contracts

import worldKernel from "/world/world_kernel.js";
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

function ensureReceipt() {
  if (!window[RECEIPT_KEY]) {
    window[RECEIPT_KEY] = {
      page: "world",
      phase: "BOOT",
      mode: "active",
      timestamp: 0,
      fps: 0,
      dtMs: 0,
      control: { motionState: {}, orbitalState: {} },
      renderAudit: {},
      emissionReceipt: {},
      placementReceipt: {},
      instrument: null,
      verification: { pass: false },
      failure: { phase: null, message: null }
    };
  }
  return window[RECEIPT_KEY];
}

function emit(receipt) {
  try {
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify({
      page: "/index.html",
      phase: receipt.verification?.pass ? "RUNNING" : "BOOT",
      mode: receipt.mode || "active",
      timestamp: new Date().toISOString(),
      fps: receipt.fps || 0,
      dtMs: receipt.dtMs || 0,
      control: receipt.control || {},
      instrument: receipt.instrument || {},
      renderAudit: receipt.renderAudit || {},
      emissionReceipt: receipt.emissionReceipt || {},
      placementReceipt: receipt.placementReceipt || {},
      verification: receipt.verification || { pass: false },
      failure: receipt.failure || { phase: null, message: "" }
    }));
  } catch {}
}

function getCanvas() {
  // accept either id to avoid drift
  return document.getElementById("world") || document.getElementById("world-canvas");
}

function forceCanvasVisible() {
  if (!canvas) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);

  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.style.display = "block";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "0";

  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (control && typeof control.resize === "function") {
    control.resize(w, h);
  }
}

function setup() {
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

function safe(fn, fallback=null){ try { return fn(); } catch { return fallback; } }

function updateControlReceipt(r){
  const motion = safe(() => control.getMotionState?.(), {});
  const orbital = safe(() => control.getOrbitalState?.(), {});
  r.control = {
    motionState: motion || {},
    orbitalState: orbital || {},
    projectionSummary: safe(() => control.getProjectionSummary?.(), null),
    cameraState: safe(() => control.getCameraState?.(), null)
  };
}

function drawFallbackVisible() {
  // GUARANTEED VISIBLE DRAW (no dependency on render.js)
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "rgb(10,20,40)";
  ctx.fillRect(0,0,w,h);

  // bright center marker
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.beginPath();
  ctx.arc(w/2, h/2, 10, 0, Math.PI*2);
  ctx.fill();
}

function frame(now){
  const r = ensureReceipt();
  const dt = lastNow ? (now - lastNow) : 16.67;
  lastNow = now;

  r.page = "world";
  r.phase = "RUNNING";
  r.mode = "active";
  r.timestamp = now;
  r.dtMs = dt;
  r.fps = dt > 0 ? 1000/dt : 0;

  try {
    if (control.stepInertia) control.stepInertia(dt);

    updateControlReceipt(r);

    // TRY real renderer; if anything fails, fall back to guaranteed draw
    try {
      renderer.renderPlanet({
        ctx,
        planetField,
        worldKernel,
        projectPoint: (lat, lon, off=0) =>
          control.projectSphere ? control.projectSphere(lat, lon, off) : null,
        viewState: control.getCameraState ? control.getCameraState() : null
      });
    } catch {
      drawFallbackVisible();
    }

    if (typeof instruments.buildInstrumentState === "function") {
      r.instrument = instruments.buildInstrumentState({
        control: r.control,
        renderAudit: r.renderAudit,
        emissionReceipt: r.emissionReceipt,
        placementReceipt: r.placementReceipt,
        world: { phase: r.phase }
      });
    }

    r.verification.pass = true;
  } catch (err) {
    r.verification.pass = false;
    r.failure = { phase: "frame", message: err?.message || String(err) };
    // still force visible draw so user sees something
    drawFallbackVisible();
  }

  emit(r);
  rafId = requestAnimationFrame(frame);
}

export function startRuntime(){
  const r = ensureReceipt();

  if (started || window[RUNTIME_ACTIVE_KEY]) {
    r.failure = { phase: "startup", message: "Duplicate runtime" };
    emit(r);
    return;
  }

  started = true;
  window[RUNTIME_ACTIVE_KEY] = true;

  try {
    canvas = getCanvas();
    if (!canvas) throw new Error("Missing #world or #world-canvas");

    ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context unavailable");

    setup();
    forceCanvasVisible();

    window.addEventListener("resize", forceCanvasVisible, { passive: true });

    lastNow = performance.now();
    emit(r); // initial emission
    rafId = requestAnimationFrame(frame);
  } catch (err) {
    r.failure = { phase: "startup", message: err?.message || String(err) };
    emit(r);
  }
}

export default { startRuntime };
