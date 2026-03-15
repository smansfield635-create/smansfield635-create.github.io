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
  if (target) target.textContent = value;
}

export function createRuntime({
  worldCanvas,
  compassCanvas,
  debugContent,
  runtimePhase,
  diagnosticsToggle
}) {
  const worldCtx = worldCanvas.getContext("2d");
  const compassCtx = compassCanvas.getContext("2d");

  const instruments = createInstruments();
  const spine = createCosmicEngineSpine();
  const projector = createPlanetSurfaceProjector();
  const environment = createEnvironmentRenderer();
  const compass = createCompassRenderer();

  const startupCurrentDepth = "surface";
  const startupRequestedDepth = "harbor";

  const runtime = {
    phase: "BOOT",
    diagnosticsMode: "peek",
    failure: null,
    kernel: WORLD_KERNEL,
    spine,
    canonVerification: null,
    executionGate: null,
    planetField: null,
    resolvedState: spine.resolveWorldState({
      activeDepth: startupRequestedDepth,
      currentDepth: startupCurrentDepth,
      selection: {
        zone: "surface_zone_alpha",
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
    compassAudit: null,
    renderError: null,
    updateError: null,
    magneticField: null,
    thermodynamicField: null,
    hydrologyField: null,
    topologyField: null
  };

  let frameHandle = 0;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  function applyDiagnosticsMode(mode) {
    runtime.diagnosticsMode = mode;
    document.body.dataset.diagnostics = mode;

    if (diagnosticsToggle) {
      diagnosticsToggle.setAttribute("aria-expanded", mode === "full" ? "true" : "false");
      diagnosticsToggle.textContent = mode === "hidden" ? "⌁" : mode === "peek" ? "◫" : "✕";
    }
  }

  function cycleDiagnosticsMode() {
    const nextMode =
      runtime.diagnosticsMode === "hidden"
        ? "peek"
        : runtime.diagnosticsMode === "peek"
          ? "full"
          : "hidden";

    applyDiagnosticsMode(nextMode);
    writeDebugPanels();
  }

  function bindDiagnosticsToggle() {
    if (!diagnosticsToggle) return;
    diagnosticsToggle.addEventListener("click", cycleDiagnosticsMode);
  }

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

  function verifyAndAuthorize() {
    runtime.phase = "VERIFYING";
    runtime.canonVerification = verifyCanonicalStructure(buildCanonicalInput());
    runtime.executionGate = spine.evaluateExecutionGate(runtime.canonVerification, {
      mode: "runtime_execution",
      fileCount: 9,
      currentDepth: startupCurrentDepth,
      requestedDepth: startupRequestedDepth,
      scopePath: WORLD_KERNEL.scope.activePath,
      roleConflict: false,
      ownershipDrift: false,
      chronologyValid: true,
      duplicateTruth: false
    });

    if (!runtime.canonVerification.pass || !runtime.executionGate.allow) {
      runtime.phase = "ERROR";
      return false;
    }

    runtime.phase = "AUTHORIZED";
    return true;
  }

  function updateResolvedState() {
    runtime.resolvedState = spine.resolveWorldState({
      activeDepth: startupRequestedDepth,
      currentDepth: startupCurrentDepth,
      selection: {
        zone: runtime.resolvedState?.localSelection?.zone ?? "surface_zone_alpha",
        row: runtime.projection?.row ?? 0,
        col: runtime.projection?.col ?? 0
      }
    });

    runtime.region = runtime.resolvedState.region;
  }

  function updateDerivedState() {
    runtime.orientation = projector.getOrientation();
    runtime.projection = projector.getProjectionSummary();
    runtime.cardinals = projector.getCardinalWeights();
    updateResolvedState();
  }

  function update(now) {
    try {
      runtime.updateError = null;
      updateTiming(now);

      if (!isDragging) {
        projector.stepInertia();
      }

      updateDerivedState();
    } catch (error) {
      runtime.phase = "ERROR";
      runtime.failure = {
        phase: "update",
        message: error instanceof Error ? error.message : String(error)
      };
      runtime.updateError = runtime.failure.message;
    }
  }

  function render() {
    try {
      runtime.renderError = null;
      runtime.renderAudit = environment.render(worldCtx, projector, runtime);
      runtime.compassAudit = compass.render(compassCtx, runtime);
    } catch (error) {
      runtime.phase = "ERROR";
      runtime.failure = {
        phase: "render",
        message: error instanceof Error ? error.message : String(error)
      };
      runtime.renderError = runtime.failure.message;
    }
  }

  function frame(now) {
    if (runtime.phase === "ERROR") {
      writeDebugPanels();
      return;
    }

    runtime.phase = "RUNNING";
    update(now);
    render();
    writeDebugPanels();

    if (runtime.phase !== "ERROR") {
      frameHandle = requestAnimationFrame(frame);
    }
  }

  function onPointerDown(event) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  }

  function onPointerMove(event) {
    if (!isDragging || runtime.phase === "ERROR") return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    projector.applyDrag(dx, dy);
  }

  function onPointerUp() {
    isDragging = false;
  }

  function start() {
    try {
      runtime.phase = "INITIALIZING";
      applyDiagnosticsMode(runtime.diagnosticsMode);
      resizeCanvases();
      updateDerivedState();
      writeDebugPanels();

      if (!verifyAndAuthorize()) {
        writeDebugPanels();
        return;
      }

      bindDiagnosticsToggle();
      window.addEventListener("resize", resizeCanvases);
      worldCanvas.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      writeDebugPanels();
      frameHandle = requestAnimationFrame(frame);
    } catch (error) {
      runtime.phase = "ERROR";
      runtime.failure = {
        phase: "startup",
        message: error instanceof Error ? error.message : String(error)
      };
      writeDebugPanels();
      if (frameHandle) {
        cancelAnimationFrame(frameHandle);
        frameHandle = 0;
      }
    }
  }

  return Object.freeze({
    start,
    runtime
  });
}
