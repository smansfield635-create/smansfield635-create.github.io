const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const fitWorldButton = document.querySelector('[data-fit-world]');

const setVisibleStatus = (text, state = text) => {
  if (!statusNode) return;
  statusNode.textContent = text;
  statusNode.dataset.status = state;
};

const reportFailure = (stage, error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`H_EARTH_WORLD_INSPECTOR_${stage}_FAILED`, error);
  setVisibleStatus('ERROR', `${stage}_FAILED`);
  window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW_ERROR__ = Object.freeze({
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    inspectorRepairRevision: 5,
    stage,
    message
  });
};

function wireControls(renderer) {
  const pointers = new Map();
  let gesture = null;
  const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const midpoint = (a, b) => ({ x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 });
  const safeDelta = (value) => Math.max(-64, Math.min(64, value));

  const refreshGesture = () => {
    const active = [...pointers.values()];
    gesture = active.length === 2
      ? {
          midpoint: midpoint(active[0], active[1]),
          distance: Math.max(1, pointDistance(active[0], active[1]))
        }
      : null;
  };

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    refreshGesture();
  });

  canvas.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;

    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);

    if (pointers.size === 1) {
      renderer.orbit(
        safeDelta(next.x - previous.x),
        safeDelta(next.y - previous.y)
      );
      return;
    }

    if (pointers.size === 2) {
      const active = [...pointers.values()];
      const nextMidpoint = midpoint(active[0], active[1]);
      const nextDistance = Math.max(1, pointDistance(active[0], active[1]));
      if (gesture) {
        renderer.zoomByFactor(nextDistance / gesture.distance);
        renderer.panScreen(
          safeDelta(nextMidpoint.x - gesture.midpoint.x),
          safeDelta(nextMidpoint.y - gesture.midpoint.y)
        );
      }
      gesture = { midpoint: nextMidpoint, distance: nextDistance };
    }
  });

  const clearPointer = (event) => {
    pointers.delete(event.pointerId);
    refreshGesture();
  };

  canvas.addEventListener('pointerup', clearPointer);
  canvas.addEventListener('pointercancel', clearPointer);
  canvas.addEventListener('lostpointercapture', clearPointer);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    renderer.zoom(event.deltaY);
  }, { passive: false });
  canvas.addEventListener('dblclick', () => renderer.fitWorld());

  window.addEventListener('keydown', (event) => {
    const distance = event.shiftKey ? 16 : 7;
    const key = event.key.toLowerCase();
    if (event.key === 'ArrowLeft' || key === 'a') renderer.pan(-distance, 0);
    if (event.key === 'ArrowRight' || key === 'd') renderer.pan(distance, 0);
    if (event.key === 'ArrowUp' || key === 'w') renderer.pan(0, -distance);
    if (event.key === 'ArrowDown' || key === 's') renderer.pan(0, distance);
  });

  fitWorldButton?.addEventListener('click', () => renderer.fitWorld());
  window.addEventListener('resize', () => renderer.render());
}

async function loadObserverAfterFirstPaint(renderer) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const observerModule = await import('./observer.mjs?repair=5');
    const receipt = observerModule.buildHEarthMapWideEnvironmentPreviewObserverReceipt(
      renderer.mesh.statistics,
      renderer.waterMesh.statistics
    );
    const cameraSafety = renderer.getCameraSafety();
    const safe = Object.values(cameraSafety).every((value) => value === true);
    const pass = receipt.result === 'PASS' && safe;
    setVisibleStatus(pass ? 'PASS' : 'READY', pass ? 'PASS' : 'OBSERVER_PENDING_OR_FAIL');
    window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__ = Object.freeze({
      operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
      lockGeneration: 422,
      inspectorRepairRevision: 5,
      renderer,
      observerReceipt: receipt
    });
  } catch (error) {
    console.warn('H_EARTH_WORLD_INSPECTOR_DEFERRED_OBSERVER_FAILED', error);
    setVisibleStatus('READY', 'VISUAL_READY_OBSERVER_DEFERRED');
    window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__ = Object.freeze({
      operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
      lockGeneration: 422,
      inspectorRepairRevision: 5,
      renderer,
      observerReceipt: null,
      observerDeferredFailure: true
    });
  }
}

async function initialize() {
  try {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('H_EARTH_MAP_WIDE_CANVAS_MISSING');
    }

    setVisibleStatus('terrain…', 'IMPORTING_TERRAIN_RENDERER');
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const rendererModule = await import('./renderer.mjs?repair=5');
    setVisibleStatus('building…', 'BUILDING_TERRAIN');
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const renderer = rendererModule.createMapWideEnvironmentRenderer(canvas);
    renderer.render();
    wireControls(renderer);
    setVisibleStatus('READY', 'VISUAL_READY');

    requestAnimationFrame(() => {
      loadObserverAfterFirstPaint(renderer);
    });
  } catch (error) {
    reportFailure('INITIALIZATION', error);
  }
}

setVisibleStatus('boot…', 'BOOTSTRAP_ACTIVE');
initialize();
