import { createWorldRuntime } from "../../world/runtime/world_runtime.js";
import { createPlanetSurfaceProjector } from "../planet_surface_projector.js";
import { createEnvironmentRenderer } from "../environment_renderer.js";
import { createGroundRenderer } from "../ground_renderer.js";

function setPlaceholderOutputs(outputs) {
  outputs.cell.textContent = "—";
  outputs.sector.textContent = "—";
  outputs.band.textContent = "—";
  outputs.encoding.textContent = "—";
  outputs.byte.textContent = "—";
  outputs.destination.textContent = "—";
}

function writeOutputs(outputs, snapshot) {
  outputs.region.textContent = snapshot.readout.region;
  outputs.selectedName.textContent = snapshot.readout.selectedName;
  outputs.selectedType.textContent = snapshot.readout.selectedType;
  outputs.selectionHint.textContent = snapshot.readout.selectionHint;
  setPlaceholderOutputs(outputs);
}

export async function createSceneRuntime({
  canvas,
  context,
  outputs,
  getViewport
}) {
  const worldRuntime = await createWorldRuntime();
  const projector = createPlanetSurfaceProjector({
    canvas,
    getViewport
  });
  const environmentRenderer = createEnvironmentRenderer();
  const groundRenderer = createGroundRenderer();

  let latestSnapshot = worldRuntime.getSnapshot();

  function draw(snapshot) {
    const viewport = getViewport();
    projector.update(viewport);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    environmentRenderer.draw(context, snapshot, projector);
    groundRenderer.draw(context, snapshot, projector);
  }

  function pickSelection(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * (canvas.width / rect.width);
    const py = (clientY - rect.top) * (canvas.height / rect.height);
    const worldPoint = projector.unproject(px, py);
    worldRuntime.selectAt(worldPoint.x, worldPoint.y);
    latestSnapshot = worldRuntime.getSnapshot();
    writeOutputs(outputs, latestSnapshot);
    draw(latestSnapshot);
  }

  canvas.addEventListener("click", (event) => {
    pickSelection(event.clientX, event.clientY);
  });

  canvas.addEventListener("touchend", (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    pickSelection(touch.clientX, touch.clientY);
  }, { passive: true });

  return {
    start() {
      latestSnapshot = worldRuntime.getSnapshot();
      writeOutputs(outputs, latestSnapshot);
      draw(latestSnapshot);
    },
    stop() {},
    resize() {
      draw(latestSnapshot);
    },
    frame(now, deltaMs) {
      worldRuntime.step(now, deltaMs);
      latestSnapshot = worldRuntime.getSnapshot();
      writeOutputs(outputs, latestSnapshot);
      draw(latestSnapshot);
    }
  };
}
