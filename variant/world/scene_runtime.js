import { createWorldRuntime } from "../../world/runtime/world_runtime.js";
import { createPlanetSurfaceProjector } from "../planet_surface_projector.js";
import { createEnvironmentRenderer } from "../environment_renderer.js";
import { createCompassRenderer } from "../compass_renderer.js";
import { createViewStateStore, VIEW_STATE } from "../runtime/view_state.js";
import { createRenderRouter } from "../runtime/render_router.js";
import { createInteractionRouter } from "../runtime/interaction_router.js";
import { createGalaxyEngine } from "../engines/galaxy_engine.js";
import { createSolarSystemEngine } from "../engines/solar_system_engine.js";
import { createPlanetEngine } from "../engines/planet_engine.js";
import { createSurfaceEngine } from "../engines/surface_engine.js";

const DRAG_THRESHOLD_SQ = 9;

function setPlaceholderOutputs(outputs) {
  outputs.cell.textContent = "—";
  outputs.sector.textContent = "—";
  outputs.band.textContent = "—";
  outputs.encoding.textContent = "—";
  outputs.byte.textContent = "—";
  outputs.destination.textContent = "—";
}

function writeOutputs(outputs, snapshot, viewState) {
  outputs.region.textContent = snapshot.readout.region;
  outputs.selectedName.textContent = snapshot.readout.selectedName;
  outputs.selectedType.textContent = viewState;

  outputs.selectionHint.textContent =
    viewState === VIEW_STATE.GALAXY_LAYER
      ? "Tap Earth to descend."
      : viewState === VIEW_STATE.PLANET_LAYER
        ? "Tap background to return."
        : "Layer active.";

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
  const projector = createPlanetSurfaceProjector({ canvas, getViewport });
  const viewStateStore = createViewStateStore(VIEW_STATE.GALAXY_LAYER);

  function getGalaxyEarthNode() {
    const body = projector.getBody();
    return {
      x: body.centerX,
      y: body.centerY,
      radius: body.radius * 0.14
    };
  }

  const renderRouter = createRenderRouter({
    galaxyEngine: createGalaxyEngine({ getEarthNode: getGalaxyEarthNode }),
    solarSystemEngine: createSolarSystemEngine(),
    planetEngine: createPlanetEngine(),
    surfaceEngine: createSurfaceEngine()
  });

  const environmentRenderer = createEnvironmentRenderer({ renderRouter });
  const compassRenderer = createCompassRenderer();

  const interactionRouter = createInteractionRouter({
    viewStateStore,
    projector,
    getGalaxyEarthNode
  });

  let latestSnapshot = worldRuntime.getSnapshot();
  let latestNow = 0;

  const pointer = {
    active: false,
    id: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastMoveTime: 0,
    lastMoveDx: 0,
    lastMoveDy: 0,
    lastMoveDt: 16.67,
    movedSq: 0,
    didDrag: false,
    admitted: false
  };

  function draw(snapshot) {
    const viewport = getViewport();
    projector.update(viewport);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    environmentRenderer.draw(context, snapshot, projector, viewStateStore.get());

    if (viewStateStore.get() === VIEW_STATE.GALAXY_LAYER || viewStateStore.get() === VIEW_STATE.PLANET_LAYER) {
      compassRenderer.draw(context, projector, latestNow);
    }
  }

  function refresh() {
    latestSnapshot = worldRuntime.getSnapshot();
    writeOutputs(outputs, latestSnapshot, viewStateStore.get());
    draw(latestSnapshot);
  }

  function resetPointerState() {
    pointer.active = false;
    pointer.id = null;
    pointer.movedSq = 0;
    pointer.didDrag = false;
    pointer.admitted = false;
    pointer.lastMoveDx = 0;
    pointer.lastMoveDy = 0;
    pointer.lastMoveDt = 16.67;
  }

  function beginDrag(id, canvasX, canvasY, nowMs) {
    pointer.active = true;
    pointer.id = id;
    pointer.startX = canvasX;
    pointer.startY = canvasY;
    pointer.lastX = canvasX;
    pointer.lastY = canvasY;
    pointer.lastMoveTime = nowMs;
    pointer.lastMoveDx = 0;
    pointer.lastMoveDy = 0;
    pointer.lastMoveDt = 16.67;
    pointer.movedSq = 0;
    pointer.didDrag = false;
    pointer.admitted = interactionRouter.canRotate(canvasX, canvasY);
  }

  function moveDrag(canvasX, canvasY, nowMs) {
    const dx = canvasX - pointer.lastX;
    const dy = canvasY - pointer.lastY;

    const totalDx = canvasX - pointer.startX;
    const totalDy = canvasY - pointer.startY;
    pointer.movedSq = (totalDx * totalDx) + (totalDy * totalDy);

    if (pointer.movedSq > DRAG_THRESHOLD_SQ) {
      pointer.didDrag = true;
    }

    const dt = Math.max(1, nowMs - pointer.lastMoveTime);
    pointer.lastMoveDx = dx;
    pointer.lastMoveDy = dy;
    pointer.lastMoveDt = dt;

    if (pointer.admitted && pointer.didDrag) {
      projector.drag(dx, dy);
    }

    pointer.lastX = canvasX;
    pointer.lastY = canvasY;
    pointer.lastMoveTime = nowMs;
  }

  function endDrag(canvasX, canvasY) {
    if (!pointer.active) return;

    const shouldTreatAsTap = !pointer.didDrag;
    const seedDx = pointer.lastMoveDx;
    const seedDy = pointer.lastMoveDy;
    const seedDt = pointer.lastMoveDt;
    const admitted = pointer.admitted;

    resetPointerState();

    if (shouldTreatAsTap) {
      interactionRouter.handleTap(canvasX, canvasY);
      refresh();
      return;
    }

    if (admitted) {
      projector.seedMomentum(seedDx, seedDy, seedDt);
    }
  }

  canvas.style.touchAction = "none";

  if (window.PointerEvent) {
    canvas.addEventListener("pointerdown", (event) => {
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      beginDrag(event.pointerId, p.x, p.y, event.timeStamp || performance.now());
      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!pointer.active || event.pointerId !== pointer.id) return;
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      moveDrag(p.x, p.y, event.timeStamp || performance.now());
      event.preventDefault();
    });

    canvas.addEventListener("pointerup", (event) => {
      if (!pointer.active || event.pointerId !== pointer.id) return;
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      endDrag(p.x, p.y);
      if (canvas.releasePointerCapture) {
        canvas.releasePointerCapture(event.pointerId);
      }
      event.preventDefault();
    });

    canvas.addEventListener("pointercancel", (event) => {
      if (!pointer.active || event.pointerId !== pointer.id) return;
      resetPointerState();
      if (canvas.releasePointerCapture) {
        canvas.releasePointerCapture(event.pointerId);
      }
      event.preventDefault();
    });
  } else {
    canvas.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      const p = getCanvasPixelPoint(canvas, touch.clientX, touch.clientY);
      beginDrag("touch", p.x, p.y, performance.now());
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchmove", (event) => {
      if (!pointer.active || pointer.id !== "touch") return;
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      const p = getCanvasPixelPoint(canvas, touch.clientX, touch.clientY);
      moveDrag(p.x, p.y, performance.now());
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchend", (event) => {
      if (!pointer.active || pointer.id !== "touch") return;
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      const p = getCanvasPixelPoint(canvas, touch.clientX, touch.clientY);
      endDrag(p.x, p.y);
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("mousedown", (event) => {
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      beginDrag("mouse", p.x, p.y, performance.now());
      event.preventDefault();
    });

    window.addEventListener("mousemove", (event) => {
      if (!pointer.active || pointer.id !== "mouse") return;
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      moveDrag(p.x, p.y, performance.now());
    });

    window.addEventListener("mouseup", (event) => {
      if (!pointer.active || pointer.id !== "mouse") return;
      const p = getCanvasPixelPoint(canvas, event.clientX, event.clientY);
      endDrag(p.x, p.y);
    });
  }

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
      projector.step(deltaMs);
      worldRuntime.step(now, deltaMs);
      latestSnapshot = worldRuntime.getSnapshot();
      writeOutputs(outputs, latestSnapshot, viewStateStore.get());
      draw(latestSnapshot);
    }
  };
}
