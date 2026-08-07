const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const diagnosticNode = document.querySelector('[data-h-earth-diagnostic]');
const focusButton = document.querySelector('[data-fit-world]');
const brandNode = document.querySelector('.preview-brand');

const OPERATION_ID = 'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const CHECKPOINT = 'OW01';
const LOCK_GENERATION = 473;
let latestObserverReceipt = null;

const setStatus = (text, state = text) => {
  if (statusNode) {
    statusNode.textContent = text;
    statusNode.dataset.status = state;
  }
};
const setDiagnostic = (text) => {
  if (diagnosticNode) diagnosticNode.textContent = text;
};
const fail = (stage, error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`AUDRALIA_OW01_INSPECTOR_${stage}_FAILED`, error);
  setStatus('ERROR', `${stage}_FAILED`);
  setDiagnostic(`${stage}_FAILED: ${message}`);
  window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW_ERROR__ = Object.freeze({
    operationId: OPERATION_ID,
    checkpoint: CHECKPOINT,
    lockGeneration: LOCK_GENERATION,
    stage,
    message
  });
};

function scaleDescription(renderer) {
  const scale = renderer.getViewScale();
  const descriptions = {
    LOCAL: 'LOCAL · exact Gratitude terrain at 1:1 arc scale · geometric stitch active · planetary ocean is the only ocean surface.',
    REGION: 'REGION · local terrain converges geometrically into Gratitude instead of fading across an undefined tile boundary.',
    CONTINENT: 'CONTINENT · inspect the asymmetric Gratitude skeleton and three primary inland watershed axes.',
    PLANETARY: 'PLANETARY · Audralia remains one continuous world; the other eight continents remain noncanonical.'
  };
  return descriptions[scale] || descriptions.LOCAL;
}

function updateScaleUI(renderer) {
  const scale = renderer.getViewScale();
  if (brandNode) brandNode.textContent = `Audralia · Gratitude · OW01 · ${scale.toLowerCase()}`;
  if (focusButton) focusButton.textContent = scale === 'LOCAL' ? 'reset view' : 'focus Gratitude';

  if (latestObserverReceipt?.result === 'FAIL_CLOSED') {
    const failed = latestObserverReceipt.failedChecks?.slice(0, 3).join(', ') || 'unknown observer check';
    setDiagnostic(`OBSERVER FAIL · ${failed}`);
    return;
  }
  setDiagnostic(scaleDescription(renderer));
}

function wire(renderer) {
  const pointers = new Map();
  let gesture = null;
  const distance = (left, right) => Math.hypot(left.x - right.x, left.y - right.y);
  const midpoint = (left, right) => ({ x: (left.x + right.x) * 0.5, y: (left.y + right.y) * 0.5 });
  const safe = (value) => Math.max(-64, Math.min(64, value));
  const refresh = () => {
    const active = [...pointers.values()];
    gesture = active.length === 2
      ? { midpoint: midpoint(active[0], active[1]), distance: Math.max(1, distance(active[0], active[1])) }
      : null;
  };
  const after = () => updateScaleUI(renderer);

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    refresh();
  });
  canvas.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);
    if (pointers.size === 1) {
      renderer.orbit(safe(next.x - previous.x), safe(next.y - previous.y));
      after();
      return;
    }
    if (pointers.size === 2) {
      const active = [...pointers.values()];
      const middle = midpoint(active[0], active[1]);
      const separation = Math.max(1, distance(active[0], active[1]));
      if (gesture) {
        renderer.zoomByFactor(separation / gesture.distance);
        renderer.panScreen(safe(middle.x - gesture.midpoint.x), safe(middle.y - gesture.midpoint.y));
        after();
      }
      gesture = { midpoint: middle, distance: separation };
    }
  });
  const clear = (event) => {
    pointers.delete(event.pointerId);
    refresh();
  };
  canvas.addEventListener('pointerup', clear);
  canvas.addEventListener('pointercancel', clear);
  canvas.addEventListener('lostpointercapture', clear);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    renderer.zoom(event.deltaY);
    after();
  }, { passive: false });
  canvas.addEventListener('dblclick', () => {
    renderer.focusGratitude();
    after();
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'g') {
      renderer.focusGratitude();
      after();
      return;
    }
    if (key === 'p') {
      renderer.planetaryVantage();
      after();
      return;
    }
    const amount = event.shiftKey ? 28 : 11;
    if (event.key === 'ArrowLeft' || key === 'a') renderer.pan(-amount, 0);
    if (event.key === 'ArrowRight' || key === 'd') renderer.pan(amount, 0);
    if (event.key === 'ArrowUp' || key === 'w') renderer.pan(0, -amount);
    if (event.key === 'ArrowDown' || key === 's') renderer.pan(0, amount);
    after();
  });
  focusButton?.addEventListener('click', () => {
    renderer.focusGratitude();
    after();
  });
  window.addEventListener('resize', () => renderer.render());
}

async function observerAfterPaint(renderer) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const module = await import('./observer.mjs');
    const receipt = module.buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer);
    latestObserverReceipt = receipt;
    const pass = receipt.result === 'PASS';
    setStatus(pass ? 'PASS' : 'FAIL', pass ? 'OW01_OBSERVER_PASS' : 'OW01_OBSERVER_FAIL');
    updateScaleUI(renderer);
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__ = Object.freeze({
      operationId: OPERATION_ID,
      checkpoint: CHECKPOINT,
      lockGeneration: LOCK_GENERATION,
      renderer,
      observerReceipt: receipt
    });
  } catch (error) {
    console.warn('AUDRALIA_OW01_INSPECTOR_OBSERVER_FAILED', error);
    setStatus('READY', 'VISUAL_READY_OBSERVER_DEFERRED');
    setDiagnostic(`VISUAL_READY · observer deferred: ${error instanceof Error ? error.message : String(error)}`);
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__ = Object.freeze({
      operationId: OPERATION_ID,
      checkpoint: CHECKPOINT,
      lockGeneration: LOCK_GENERATION,
      renderer,
      observerReceipt: null,
      observerDeferredFailure: true
    });
  }
}

async function initialize() {
  try {
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('H_EARTH_OW01_CANVAS_MISSING');
    setStatus('world…', 'IMPORTING_AUDRALIA_OW01_WORLD');
    setDiagnostic('Building OW01 geometric stitch and single-surface ocean reconciliation…');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const module = await import('./renderer.mjs');
    setStatus('building…', 'BUILDING_OW01_GEOGRAPHIC_MODEL');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const renderer = module.createMapWideEnvironmentRenderer(canvas);
    renderer.render();
    wire(renderer);
    updateScaleUI(renderer);
    setStatus('READY', 'VISUAL_READY');
    requestAnimationFrame(() => observerAfterPaint(renderer));
  } catch (error) {
    fail('INITIALIZATION', error);
  }
}

setStatus('boot…', 'BOOTSTRAP_ACTIVE');
setDiagnostic('Starting Audralia OW01 nonpublic inspector…');
initialize();
