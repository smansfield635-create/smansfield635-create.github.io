import { createBackgroundRenderer } from "../../assets/openworld_background_renderer.js";
import { createEnvironmentRenderer } from "../../variant/environment_renderer.js";
import { createGroundRenderer } from "../../variant/ground_renderer.js";
import { createCompassRenderer } from "../../assets/openworld_compass_renderer.js";
import { createInstruments } from "../../assets/instruments.js";
import { loadWorldKernel } from "../world_kernel.js";
import { phaseKernel } from "../phase_kernel.js";
import { createPlanetSurfaceProjector } from "../../variant/planet_surface_projector.js";

export async function createScene(canvas, outputs) {

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const background = createBackgroundRenderer();
  const environment = createEnvironmentRenderer();
  const ground = createGroundRenderer();
  const compass = createCompassRenderer();
  const instruments = createInstruments();

  const kernel = await loadWorldKernel();

  const state = {
    width: 0,
    height: 0,
    tick: 0,
    kernel,
    projection: null,
    region: null,
    encoding: null,
    renderMode: "styled",
    traversalMode: "foot",
    phase: {
      globalPhase: "CALM",
      intensity: 0.2
    },
    player: {
      x: 544,
      y: 770,
      speed: 2.05
    }
  };

  function resize() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;

    canvas.width = state.width;
    canvas.height = state.height;

    canvas.style.width = state.width + "px";
    canvas.style.height = state.height + "px";
  }

  function updatePhase() {
    const computed = phaseKernel.computePhase({
      kernel: state.kernel,
      tick: state.tick
    });

    state.phase = {
      ...computed,
      intensity: computed.netStress
    };
  }

  function projectState() {

    state.projection =
      state.kernel.helpers.projectWorldPositionToCell({
        x: state.player.x,
        y: state.player.y
      });

    state.region =
      state.kernel.helpers.getRegion(state.projection.regionId);

    state.encoding =
      state.kernel.helpers.getEncoding(
        state.projection.stateEncodingId
      );
  }

  function updateOutputs() {

    const runtimePanel = instruments.buildRuntimePanel(state);

    outputs.region.textContent = runtimePanel.region;
    outputs.cell.textContent = runtimePanel.cell;
    outputs.sector.textContent = runtimePanel.sector;
    outputs.band.textContent = runtimePanel.band;
    outputs.encoding.textContent =
      runtimePanel.encoding + " · " +
      state.traversalMode.toUpperCase();

    outputs.byte.textContent = runtimePanel.byte;
  }

  function drawFrame() {

    ctx.clearRect(0, 0, state.width, state.height);

    background.draw(ctx, {
      width: state.width,
      height: state.height,
      tick: state.tick,
      player: state.player,
      phase: state.phase
    });

    const renderState = {
      width: state.width,
      height: state.height,
      tick: state.tick,
      kernel: state.kernel,
      projection: state.projection,
      player: state.player,
      worldBounds: {
        width: 1180,
        height: 1240
      },
      phase: state.phase
    };

    const surfaceProjector =
      createPlanetSurfaceProjector(renderState);

    renderState.surfaceProjector = surfaceProjector;

    /*
      IMPORTANT:
      We no longer scale the scene.
      The projector already outputs screen-space.
    */

    environment.draw(ctx, renderState);
    ground.draw(ctx, renderState);

    compass.draw(ctx, state, {
      width: state.width,
      height: state.height
    });
  }

  function step() {

    state.tick += 1;

    updatePhase();
    projectState();
    updateOutputs();

    drawFrame();

    requestAnimationFrame(step);
  }

  function onKeyDown(event) {

    if (event.key === "g" || event.key === "G") {

      state.renderMode =
        state.renderMode === "styled"
          ? "truth"
          : "styled";

      event.preventDefault();
      return;
    }
  }

  resize();
  updatePhase();
  projectState();
  updateOutputs();

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKeyDown);

  return Object.freeze({
    start() {
      requestAnimationFrame(step);
    }
  });
}
