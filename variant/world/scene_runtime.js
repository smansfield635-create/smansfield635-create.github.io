import { createWorldRuntime } from "../../world/runtime/world_runtime.js";
import { createPlanetSurfaceProjector } from "../planet_surface_projector.js";
import { createEnvironmentRenderer } from "../environment_renderer.js";
import { createGroundRenderer } from "../ground_renderer.js";
import { createCompassRenderer } from "../compass_renderer.js";

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

function getCanvasPixelPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
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
  const compassRenderer = createCompassRenderer();

  let latestSnapshot = worldRuntime.getSnapshot();
  let latestNow = 0;

  const pointer = {
    active: false,
    id: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    movedSq: 0,
    didDrag: false
  };

  function draw(snapshot) {
    const viewport = getViewport();
    projector.update(viewport);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    environmentRenderer.draw(context, snapshot, projector);

    // STABILIZATION RULE:
    // land rendering is intentionally disabled until globe/camera composition is locked again.
    // groundRenderer.draw(context, snapshot, projector);

    compassRenderer.draw(context, projector, latestNow);
  }

  function refresh() {
    latestSnapshot = worldRuntime.getSnapshot();
    writeOutputs(outputs, latestSnapshot);
    draw(latestSnapshot);
  }

  function pickSelection(clientX, clientY) {
    const p = getCanvasPixelPoint(canvas, clientX, clientY);
    const worldPoint = projector.unproject(p.x, p.y);
    worldRuntime.selectAt(worldPoint.x, worldPoint.y);
    refresh();
  }

  function beginDrag(id, clientX, clientY) {
    pointer.active = true;
    pointer.id = id;
    pointer.startX = clientX;
    pointer.startY = clientY;
    pointer.lastX = clientX;
    pointer.lastY = clientY;
    pointer.movedSq = 0;
    pointer.didDrag = false;
  }

  function moveDrag(clientX, clientY) {
    const dx = clientX - pointer.lastX;
    const dy = clientY - pointer.lastY;

    const totalDx = clientX - pointer.startX;
    const totalDy = clientY - pointer.startY;
    pointer.movedSq = (totalDx * totalDx) + (totalDy * totalDy);

    if (pointer.movedSq > 9) {
      pointer.didDrag = true;
    }

    if (pointer.didDrag) {
      projector.dragRotate(dx, dy);
      draw(latestSnapshot);
    }

    pointer.lastX = clientX;
    pointer.lastY = clientY;
  }

  function endDrag(clientX, clientY) {
    const shouldSelect = !pointer.didDrag;
    pointer.active = false;
    pointer.id = null;

    if (shouldSelect) {
      pickSelection(clientX, clientY);
    } else {
      draw(latestSnapshot);
    }
  }

  canvas.style.touchAction = "none";

  canvas.addEventListener("pointerdown", (event) => {
    beginDrag(event.pointerId, event.clientX, event.clientY);
    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    moveDrag(event.clientX, event.clientY);
    event.preventDefault();
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    endDrag(event.clientX, event.clientY);
    if (canvas.releasePointerCapture) {
      canvas.releasePointerCapture(event.pointerId);
    }
    event.preventDefault();
  });

  canvas.addEventListener("pointercancel", (event) => {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    pointer.active = false;
    pointer.id = null;
    if (canvas.releasePointerCapture) {
      canvas.releasePointerCapture(event.pointerId);
    }
    draw(latestSnapshot);
    event.preventDefault();
  });

  canvas.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    beginDrag("touch", touch.clientX, touch.clientY);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchmove", (event) => {
    if (!pointer.active || pointer.id !== "touch") return;
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    moveDrag(touch.clientX, touch.clientY);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", (event) => {
    if (!pointer.active || pointer.id !== "touch") return;
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    endDrag(touch.clientX, touch.clientY);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("mousedown", (event) => {
    beginDrag("mouse", event.clientX, event.clientY);
    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!pointer.active || pointer.id !== "mouse") return;
    moveDrag(event.clientX, event.clientY);
  });

  window.addEventListener("mouseup", (event) => {
    if (!pointer.active || pointer.id !== "mouse") return;
    endDrag(event.clientX, event.clientY);
  });

  return {
    start() {
      refresh();
    },
    stop() {},
    resize() {
      draw(latestSnapshot);
    },
    frame(now, deltaMs) {
      latestNow = now;
      worldRuntime.step(now, deltaMs);
      latestSnapshot = worldRuntime.getSnapshot();
      writeOutputs(outputs, latestSnapshot);
      draw(latestSnapshot);
    }
  };
}
