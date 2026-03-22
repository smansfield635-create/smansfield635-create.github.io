// /world/runtime/world_runtime.js
// MODE: RUNTIME WORLD MODE STATE IMPLEMENTATION
// STATUS: TNT — SAFE INTEGRATION (NO OWNERSHIP DRIFT)

// PURPOSE:
// - implement worldModeState (variant + traversal + coherence + perception + subsurface)
// - DO NOT mutate intrinsic truth
// - DO NOT change render ownership
// - DO NOT introduce cross-layer bleed

import { WORLD_KERNEL as worldKernel } from "/world/world_kernel.js";
import { createPlanetEngine } from "/world/planet_engine.js";
import { createRenderer } from "/world/render.js";
import { createControlSystem } from "/world/control.js";

let canvas, ctx, planetEngine, renderer, control, planetField;
let rafId = 0;

// ==============================
// STATE LAYER (NEW)
// ==============================

const runtimeState = {
  worldVariantState: null,
  traversalState: null,
  coherenceState: null,
  perceptionModifiers: null,
  subsurfaceActivationState: null,
  worldModeState: null
};

// ==============================
// WORLD VARIANT STATE
// ==============================

function createWorldVariantState(activeVariant = 9) {
  const v = Math.max(1, Math.min(9, activeVariant));
  const scale = v / 9;

  return {
    activeVariant: v,
    compositionScale: scale,
    baseScale: 1 - scale,
    ratio: `${v}:${10 - v}`
  };
}

// ==============================
// TRAVERSAL STATE
// ==============================

function createTraversalState(mode = "NORTH") {
  const m = (mode || "NORTH").toUpperCase();

  const map = {
    NORTH: { terrain: 1, hydration: 0.82, subsurface: 0.9 },
    SOUTH: { terrain: 0.86, hydration: 0.88, subsurface: 0.84 },
    EAST:  { terrain: 0.82, hydration: 1, subsurface: 0.86 },
    WEST:  { terrain: 0.9, hydration: 0.84, subsurface: 0.88 }
  };

  return {
    activeMode: map[m] ? m : "NORTH",
    ...map[m] || map.NORTH
  };
}

// ==============================
// COHERENCE STATE (SAFE BASELINE)
// ==============================

function createCoherenceState() {
  return {
    global: { coherence: 1, noise: 0, stability: 1 }
  };
}

// ==============================
// PERCEPTION (DERIVED)
// ==============================

function computePerception(coherence, traversal) {
  const c = coherence.global.coherence;
  const s = coherence.global.stability;

  return {
    terrain: c * traversal.terrain,
    hydration: c * traversal.hydration,
    subsurface: c * traversal.subsurface,
    lighting: c * s
  };
}

// ==============================
// SUBSURFACE STATE (SAFE)
// ==============================

function computeSubsurfaceState(coherence) {
  const c = coherence.global.coherence;

  return {
    accessAllowed: c > 0.2,
    zoneState: c > 0.5 ? "ACTIVE" : "PARTIAL_ACTIVE"
  };
}

// ==============================
// WORLD MODE BINDER
// ==============================

function bindWorldModeState() {
  const variant = runtimeState.worldVariantState;
  const traversal = runtimeState.traversalState;
  const coherence = runtimeState.coherenceState;
  const perception = runtimeState.perceptionModifiers;
  const subsurface = runtimeState.subsurfaceActivationState;

  runtimeState.worldModeState = {
    variantState: variant,
    traversalState: traversal,
    coherenceState,
    perceptionModifiers: perception,
    subsurfaceActivationState: subsurface
  };
}

// ==============================
// SYSTEM SETUP
// ==============================

function setup() {
  canvas = document.getElementById("world");
  ctx = canvas.getContext("2d");

  planetEngine = createPlanetEngine();
  renderer = createRenderer();
  control = createControlSystem();

  planetField = planetEngine.buildPlanetField({});
}

// ==============================
// FRAME LOOP
// ==============================

function frame() {
  // STEP 1 — CONTROL
  control.stepInertia(16);

  // STEP 2 — STATE BUILD
  runtimeState.worldVariantState = createWorldVariantState(9);
  runtimeState.traversalState = createTraversalState("NORTH");
  runtimeState.coherenceState = createCoherenceState();

  // STEP 3 — DERIVE
  runtimeState.perceptionModifiers =
    computePerception(runtimeState.coherenceState, runtimeState.traversalState);

  runtimeState.subsurfaceActivationState =
    computeSubsurfaceState(runtimeState.coherenceState);

  // STEP 4 — BIND
  bindWorldModeState();

  // STEP 5 — RENDER (READ-ONLY)
  renderer.renderPlanet({
    ctx,
    planetField,
    projectPoint: control.projectSphere,
    viewState: control.getCameraState(),

    // SAFE PASS (READ ONLY)
    worldModeState: runtimeState.worldModeState
  });

  rafId = requestAnimationFrame(frame);
}

// ==============================
// START
// ==============================

export function startRuntime() {
  setup();
  frame();
}

export default { startRuntime };
