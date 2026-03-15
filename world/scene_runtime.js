import { WORLD_KERNEL, getExpectedCanonStructure, verifyCanonicalStructure } from "./world_kernel.js";
import { createCosmicEngineSpine } from "./cosmic_engine_spine.js";
import { createPlanetSurfaceProjector } from "./planet_surface_projector.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";

function now() {
  return performance.now();
}

function safeText(el, value) {
  if (el) el.textContent = value;
}

function buildCanonicalInput() {
  const expected = getExpectedCanonStructure();
  return {
    fileHomes: expected.fileHomes,
    chronology: expected.chronology,
    ownership: expected.ownership,
    scope: expected.scope,
    duplicateTruth: expected.duplicateTruth
  };
}

function buildTiming() {
  const start = now();
  return {
    startedAt: start,
    previousFrameAt: start,
    elapsedMs: 0,
    dtMs: 0,
    fps: 0
  };
}

export function createRuntime({ worldCanvas, compassCanvas, debugContent, runtimePhase }) {

  const ctx = worldCanvas.getContext("2d");
  const compassCtx = compassCanvas.getContext("2d");

  const spine = createCosmicEngineSpine();
  const projector = createPlanetSurfaceProjector();
  const environment = createEnvironmentRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const canon = verifyCanonicalStructure(buildCanonicalInput());

  const CURRENT_DEPTH = "galaxy";
  const REQUESTED_DEPTH = "harbor";

  let gate = spine.evaluateExecutionGate(canon, {
    mode: "runtime_execution",
    fileCount: 9,
    currentDepth: CURRENT_DEPTH,
    requestedDepth: REQUESTED_DEPTH,
    scopePath: WORLD_KERNEL.scope.activePath,
    roleConflict: false,
    ownershipDrift: false,
    chronologyValid: true,
    duplicateTruth: false
  });

  const runtime = {
    phase: gate.allow ? "BOOT" : "BLOCKED",
    kernel: WORLD_KERNEL,
    canonVerification: canon,
    executionGate: gate,
    resolvedState: spine.resolveWorldState({
      currentDepth: CURRENT_DEPTH,
      activeDepth: REQUESTED_DEPTH,
      selection: { zone: "local_zone_alpha", row: 0, col: 0 }
    }),
    projector,
    orientation: projector.getOrientation(),
    projection: projector.getProjectionSummary(),
    region: null,
    encoding: { label: "external_round_baseline" },
    timing: buildTiming(),
    cardinals: projector.getCardinalWeights(),
    renderError: null,
    updateError: null
  };

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function resize() {
    worldCanvas.width = window.innerWidth;
    worldCanvas.height = window.innerHeight;
    compassCanvas.width = 180;
    compassCanvas.height = 180;
    projector.resize(worldCanvas.width, worldCanvas.height);
  }

  function writeDiagnostics() {
    if (!debugContent) return;

    const diagnostics = {
      runtime_phase: runtime.phase,
      gate_allow: runtime.executionGate.allow,
      gate_blocked_by: runtime.executionGate.blocked_by,
      gate_reason: runtime.executionGate.reasons,
      current_depth: runtime.resolvedState?.transition?.from,
      requested_depth: runtime.resolvedState?.transition?.to,
      active_depth: runtime.resolvedState?.activeDepth,
      projector_yaw: runtime.orientation?.yaw,
      projector_pitch: runtime.orientation?.pitch,
      projector_radius: runtime.projector?.state?.radius,
      projection_cell: runtime.projection?.cellId,
      projection_sector: runtime.projection?.sector,
      projection_band: runtime.projection?.bandIndex,
      fps: runtime.timing?.fps,
      dt: runtime.timing?.dtMs,
      branch_premise: runtime.resolvedState?.branches?.harbor?.corePremise?.label,
      error_render: runtime.renderError,
      error_update: runtime.updateError
    };

    debugContent.innerHTML = instruments.renderPanelHTML(diagnostics);
    safeText(runtimePhase, runtime.phase);
  }

  function updateTiming(t) {
    const dt = t - runtime.timing.previousFrameAt;
    runtime.timing.previousFrameAt = t;
    runtime.timing.elapsedMs = t - runtime.timing.startedAt;
    runtime.timing.dtMs = dt;
    runtime.timing.fps = dt > 0 ? 1000 / dt : 0;
  }

  function update(t) {
    try {

      updateTiming(t);

      if (!dragging) {
        projector.stepInertia();
      }

      runtime.orientation = projector.getOrientation();
      runtime.projection = projector.getProjectionSummary();
      runtime.cardinals = projector.getCardinalWeights();

    } catch (err) {
      runtime.updateError = err.message;
    }
  }

  function render() {
    try {

      environment.render(ctx, projector, runtime);
      compass.render(compassCtx, runtime);

    } catch (err) {
      runtime.renderError = err.message;
    }
  }

  function frame(t) {

    runtime.phase = "RUNNING";

    update(t);
    render();
    writeDiagnostics();

    requestAnimationFrame(frame);
  }

  function pointerDown(e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }

  function pointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    projector.applyDrag(dx, dy);
  }

  function pointerUp() {
    dragging = false;
  }

  function start() {

    resize();
    writeDiagnostics();

    window.addEventListener("resize", resize);
    worldCanvas.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);

    requestAnimationFrame(frame);
  }

  return Object.freeze({
    start,
    runtime
  });
}
