import { WORLD_KERNEL, getExpectedCanonStructure, verifyCanonicalStructure } from "./world_kernel.js";
import { createCosmicEngineSpine } from "./cosmic_engine_spine.js";
import { createPlanetSurfaceProjector } from "./planet_surface_projector.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";

function nowMs() {
  return performance.now();
}

function buildCanonicalInput() {
  const expected = getExpectedCanonStructure();
  return Object.freeze({
    fileHomes: expected.fileHomes,
    chronology: expected.chronology,
    ownership: expected.ownership,
    scope: expected.scope,
    duplicateTruth: expected.duplicateTruth
  });
}

function buildInitialTiming() {
  const startedAt = nowMs();
  return {
    startedAt,
    elapsedMs: 0,
    dtMs: 0,
    fps: 0,
    previousFrameAt: startedAt
  };
}

function safeText(target, value) {
  if (target) {
    target.textContent = value;
  }
}

export function createRuntime({ worldCanvas, compassCanvas, debugContent, runtimePhase }) {
  const worldCtx = worldCanvas.getContext("2d");
  const compassCtx = compassCanvas.getContext("2d");

  const instruments = createInstruments();
  const spine = createCosmicEngineSpine();
  const projector = createPlanetSurfaceProjector();
  const environment = createEnvironmentRenderer();
  const compass = createCompassRenderer();

  // CORRECT DEPTH TRANSITION
  const START_CURRENT_DEPTH = "galaxy";
  const START_REQUESTED_DEPTH = "harbor";

  const canonVerification = verifyCanonicalStructure(buildCanonicalInput());

  let executionGate = spine.evaluateExecutionGate(canonVerification, {
    mode: "runtime_execution",
    fileCount: 9,
    currentDepth: START_CURRENT_DEPTH,
    requestedDepth: START_REQUESTED_DEPTH,
    scopePath: WORLD_KERNEL.scope.activePath,
    roleConflict: false,
    ownershipDrift: false,
    chronologyValid: true,
    duplicateTruth: false
  });

  const runtime = {
    phase: executionGate.allow ? "BOOT" : "BLOCKED",
    failure: null,
    kernel: WORLD_KERNEL,
    canonVerification,
    executionGate,
    resolvedState: spine.resolveWorldState({
      activeDepth: START_REQUESTED_DEPTH,
      currentDepth: START_CURRENT_DEPTH,
      selection: {
        zone: "local_zone_alpha",
        row: 0,
        col: 0
      }
    }),
    projector,
    orientation: projector.getOrientation(),
    projection: projector.getProjectionSummary(),
    region: null,
    encoding: { label: "external_round_baseline" },
    selection: null,
    destination: null,
    timing: buildInitialTiming(),
    cardinals: projector.getCardinalWeights(),
    renderAudit: null,
    compassAudit: null
  };

  let frameHandle = 0;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  function resizeCanvases() {
    worldCanvas.width = window.innerWidth;
    worldCanvas.height = window.innerHeight;
    compassCanvas.width = compassCanvas.clientWidth || 180;
    compassCanvas.height = compassCanvas.clientHeight || 180;
    projector.resize(worldCanvas.width, worldCanvas.height);
  }

  function writeDebugPanels() {
    if (debugContent) {
      debugContent.innerHTML = instruments.renderPanelHTML(runtime);
    }
    safeText(runtimePhase, runtime.phase);
  }

  function updateTiming(now) {
    const dt = now - runtime.timing.previousFrameAt;
    runtime.timing.previousFrameAt = now;
    runtime.timing.elapsedMs = now - runtime.timing.startedAt;
    runtime.timing.dtMs = dt;
    runtime.timing.fps = dt > 0 ? 1000 / dt : 0;
  }

  function updateDerivedState() {
    runtime.orientation = projector.getOrientation();
    runtime.projection = projector.getProjectionSummary();
    runtime.cardinals = projector.getCardinalWeights();
    runtime.region = runtime.resolvedState.region;
  }

  function update(now) {
    updateTiming(now);

    if (!executionGate.allow) {
      runtime.phase = "BLOCKED";
      return;
    }

    if (!isDragging) {
      projector.stepInertia();
    }

    updateDerivedState();
  }

  function render() {
    runtime.renderAudit = environment.render(worldCtx, projector, runtime);
    runtime.compassAudit = compass.render(compassCtx, runtime);
    writeDebugPanels();
  }

  function frame(now) {
    if (runtime.phase === "FAILED" || runtime.phase === "BLOCKED") {
      writeDebugPanels();
      return;
    }

    runtime.phase = "RUNNING";

    update(now);
    render();

    frameHandle = requestAnimationFrame(frame);
  }

  function onPointerDown(event) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    runtime.phase = "DRAG";
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    projector.applyDrag(dx, dy);
  }

  function onPointerUp() {
    isDragging = false;
    runtime.phase = "RUNNING";
  }

  function start() {
    resizeCanvases();
    updateDerivedState();
    writeDebugPanels();

    if (!executionGate.allow) {
      runtime.phase = "BLOCKED";
      writeDebugPanels();
      return;
    }

    window.addEventListener("resize", resizeCanvases);

    worldCanvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    frameHandle = requestAnimationFrame(frame);
  }

  return Object.freeze({
    start,
    runtime
  });
}
