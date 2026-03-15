import { WORLD_KERNEL } from "./world_kernel.js";
import { createCosmicEngineSpine } from "./cosmic_engine_spine.js";
import { createPlanetSurfaceProjector } from "./planet_surface_projector.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";

export function createRuntime({ worldCanvas, compassCanvas, debugContent, runtimePhase }) {
  const worldCtx = worldCanvas.getContext("2d");
  const compassCtx = compassCanvas.getContext("2d");

  const instruments = createInstruments();
  const spine = createCosmicEngineSpine();
  const projector = createPlanetSurfaceProjector();
  const environment = createEnvironmentRenderer();
  const compass = createCompassRenderer();

  const runtime = {
    phase: "BOOT",
    kernel: WORLD_KERNEL,
    resolvedState: spine.resolveWorldState(),
    projector,
    orientation: projector.getOrientation(),
    projection: projector.getProjectionSummary(),
    region: null,
    encoding: { label: "external_round_baseline" },
    selection: null,
    destination: null,
    timing: {
      startedAt: performance.now(),
      elapsedMs: 0,
      dtMs: 0,
      fps: 0,
      previousFrameAt: performance.now()
    },
    cardinals: projector.getCardinalWeights()
  };

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
    debugContent.innerHTML = instruments.renderPanelHTML(runtime);
    runtimePhase.textContent = runtime.phase;
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
    if (!isDragging) {
      projector.stepInertia();
    }
    updateDerivedState();
  }

  function render() {
    environment.render(worldCtx, projector, runtime);
    compass.render(compassCtx, runtime);
    writeDebugPanels();
  }

  function frame(now) {
    runtime.phase = "RUNNING";
    update(now);
    render();
    requestAnimationFrame(frame);
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

    window.addEventListener("resize", resizeCanvases);
    worldCanvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    requestAnimationFrame(frame);
  }

  return Object.freeze({
    start,
    runtime
  });
}
