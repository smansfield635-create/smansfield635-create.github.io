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

  const pointerState = {
    active: false,
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    lastClientX: 0,
    lastClientY: 0,
    dragDistanceSquared: 0,
    didDrag: false
  };

  function draw(snapshot) {
    const viewport = getViewport();
    projector.update(viewport);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    environmentRenderer.draw(context, snapshot, projector);
    groundRenderer.draw(context, snapshot, projector);
  }

  function refreshOutputsAndDraw() {
    latestSnapshot = worldRuntime.getSnapshot();
    writeOutputs(outputs, latestSnapshot);
    draw(latestSnapshot);
  }

  function pickSelection(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * (canvas.width / rect.width);
    const py = (clientY - rect.top) * (canvas.height / rect.height);
    const worldPoint = projector.unproject(px, py);
    worldRuntime.selectAt(worldPoint.x, worldPoint.y);
    refreshOutputsAndDraw();
  }

  function beginPointer(pointerId, clientX, clientY) {
    pointerState.active = true;
    pointerState.pointerId = pointerId;
    pointerState.startClientX = clientX;
    pointerState.startClientY = clientY;
    pointerState.lastClientX = clientX;
    pointerState.lastClientY = clientY;
    pointerState.dragDistanceSquared = 0;
    pointerState.didDrag = false;
  }

  function movePointer(clientX, clientY) {
    const dx = clientX - pointerState.lastClientX;
    const dy = clientY - pointerState.lastClientY;

    const totalDx = clientX - pointerState.startClientX;
    const totalDy = clientY - pointerState.startClientY;
    pointerState.dragDistanceSquared = (totalDx * totalDx) + (totalDy * totalDy);

    if (pointerState.dragDistanceSquared > 25) {
      pointerState.didDrag = true;
    }

    if (pointerState.didDrag) {
      projector.dragRotate(dx, dy);
      draw(latestSnapshot);
    }

    pointerState.lastClientX = clientX;
    pointerState.lastClientY = clientY;
  }

  function endPointer(clientX, clientY) {
    const wasDrag = pointerState.didDrag;

    pointerState.active = false;
    pointerState.pointerId = null;

    if (!wasDrag) {
      pickSelection(clientX, clientY);
    } else {
      draw(latestSnapshot);
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (pointerState.active) return;
    beginPointer(event.pointerId, event.clientX, event.clientY);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!pointerState.active) return;
    if (event.pointerId !== pointerState.pointerId) return;
    movePointer(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!pointerState.active) return;
    if (event.pointerId !== pointerState.pointerId) return;
    endPointer(event.clientX, event.clientY);
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointercancel", (event) => {
    if (!pointerState.active) return;
    if (event.pointerId !== pointerState.pointerId) return;
    pointerState.active = false;
    pointerState.pointerId = null;
    draw(latestSnapshot);
  });

  return {
    start() {
      refreshOutputsAndDraw();
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
