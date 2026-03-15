import { WORLD_KERNEL, verifyCanonicalStructure } from "./world_kernel.js";
import { createCosmicEngineSpine } from "./cosmic_engine_spine.js";
import { createPlanetSurfaceProjector } from "./planet_surface_projector.js";
import { createEnvironmentRenderer } from "./environment_renderer.js";
import { createCompassRenderer } from "./compass_renderer.js";
import { createInstruments } from "../assets/instruments.js";

function now(){ return performance.now(); }

export function createRuntime({worldCanvas,compassCanvas,debugContent,runtimePhase}){

  const ctx = worldCanvas.getContext("2d");
  const compassCtx = compassCanvas.getContext("2d");

  const spine = createCosmicEngineSpine();
  const projector = createPlanetSurfaceProjector();
  const environment = createEnvironmentRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const START_CURRENT = "galaxy";
  const START_REQUEST = spine.getNextLegalDepth(START_CURRENT);

  const canon = verifyCanonicalStructure({});
  let gate = spine.evaluateExecutionGate(canon,{
    currentDepth:START_CURRENT,
    requestedDepth:START_REQUEST
  });

  const runtime = {
    phase: gate.allow ? "BOOT":"BLOCKED",
    canonVerification:canon,
    executionGate:gate,
    resolvedState:spine.resolveWorldState({
      currentDepth:START_CURRENT,
      activeDepth:START_REQUEST
    }),
    projector,
    timing:{
      startedAt:now(),
      previousFrameAt:now(),
      elapsedMs:0,
      dtMs:0,
      fps:0
    },
    orientation:projector.getOrientation(),
    projection:projector.getProjectionSummary(),
    cardinals:projector.getCardinalWeights()
  };

  function resize(){
    worldCanvas.width=window.innerWidth;
    worldCanvas.height=window.innerHeight;
    compassCanvas.width=180;
    compassCanvas.height=180;
    projector.resize(worldCanvas.width,worldCanvas.height);
  }

  function writePanels(){
    if(debugContent){
      debugContent.innerHTML = instruments.renderPanelHTML(runtime);
    }
    if(runtimePhase){
      runtimePhase.textContent = runtime.phase;
    }
  }

  function update(nowTime){
    const dt = nowTime - runtime.timing.previousFrameAt;
    runtime.timing.previousFrameAt = nowTime;
    runtime.timing.elapsedMs = nowTime - runtime.timing.startedAt;
    runtime.timing.dtMs = dt;
    runtime.timing.fps = dt>0 ? 1000/dt : 0;

    projector.stepInertia();

    runtime.orientation = projector.getOrientation();
    runtime.projection = projector.getProjectionSummary();
    runtime.cardinals = projector.getCardinalWeights();
  }

  function render(){
    environment.render(ctx,projector,runtime);
    compass.render(compassCtx,runtime);
    writePanels();
  }

  function frame(t){
    if(runtime.phase==="BLOCKED") return;

    runtime.phase="RUNNING";
    update(t);
    render();
    requestAnimationFrame(frame);
  }

  function start(){
    resize();
    writePanels();

    if(!gate.allow){
      runtime.phase="BLOCKED";
      writePanels();
      return;
    }

    requestAnimationFrame(frame);
  }

  return Object.freeze({
    start,
    runtime
  });
}
