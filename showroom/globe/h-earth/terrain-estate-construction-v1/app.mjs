import { createMapWideEnvironmentRenderer } from './renderer.mjs';
import { buildHEarthMapWideEnvironmentPreviewObserverReceipt } from './observer.mjs';

const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const statsNode = document.querySelector('[data-h-earth-stats]');
const reliefToggle = document.querySelector('[data-toggle-relief]');
const estateToggle = document.querySelector('[data-toggle-estate]');
const entryToggle = document.querySelector('[data-toggle-entry]');
const wireToggle = document.querySelector('[data-toggle-wire]');
const fitWorldButton = document.querySelector('[data-fit-world]');
const estateFocusButton = document.querySelector('[data-estate-focus]');
const topViewButton = document.querySelector('[data-top-view]');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('H_EARTH_MAP_WIDE_CANVAS_MISSING');
}

const renderer = createMapWideEnvironmentRenderer(canvas);
const receipt = buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer.mesh.statistics);
const pointers = new Map();
let gesture = null;

const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 });
const safeDelta = (value) => Math.max(-64, Math.min(64, value));

function setStatus() {
  const cameraSafety = renderer.getCameraSafety();
  const safe = Object.values(cameraSafety).every((value) => value === true);
  statusNode.textContent = receipt.result === 'PASS' && safe
    ? 'Candidate self-check: PASS · stable inspection controls active'
    : 'Candidate self-check: FAIL_CLOSED';
  statusNode.dataset.status = receipt.result === 'PASS' && safe ? 'PASS' : 'FAIL_CLOSED';

  const statistics = renderer.mesh.statistics;
  statsNode.textContent = [
    `${statistics.validSampleCount.toLocaleString()} terrain samples`,
    `${statistics.triangleCount.toLocaleString()} triangles`,
    `${statistics.sitePreparationSampleCount.toLocaleString()} prepared-site samples`,
    `elevation ${statistics.minimumElevation.toFixed(1)}…${statistics.maximumElevation.toFixed(1)}`
  ].join(' · ');
}

function render() {
  renderer.render();
  setStatus();
}

function refreshGesture() {
  const active = [...pointers.values()];
  if (active.length === 2) {
    gesture = {
      midpoint: midpoint(active[0], active[1]),
      distance: Math.max(1, pointDistance(active[0], active[1]))
    };
  } else {
    gesture = null;
  }
}

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

function clearPointer(event) {
  pointers.delete(event.pointerId);
  refreshGesture();
}
canvas.addEventListener('pointerup', clearPointer);
canvas.addEventListener('pointercancel', clearPointer);
canvas.addEventListener('lostpointercapture', clearPointer);

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  renderer.zoom(event.deltaY);
}, { passive: false });

window.addEventListener('keydown', (event) => {
  const distance = event.shiftKey ? 16 : 7;
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') renderer.pan(-distance, 0);
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') renderer.pan(distance, 0);
  if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') renderer.pan(0, -distance);
  if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') renderer.pan(0, distance);
});

reliefToggle?.addEventListener('change', () => renderer.setOption('showRelief', reliefToggle.checked));
estateToggle?.addEventListener('change', () => renderer.setOption('showEstate', estateToggle.checked));
entryToggle?.addEventListener('change', () => renderer.setOption('showEntry', entryToggle.checked));
wireToggle?.addEventListener('change', () => renderer.setOption('wireframe', wireToggle.checked));
fitWorldButton?.addEventListener('click', () => renderer.fitWorld());
estateFocusButton?.addEventListener('click', () => renderer.focusEstate());
topViewButton?.addEventListener('click', () => renderer.topView());

window.addEventListener('resize', render);

window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__ = Object.freeze({
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  inspectorRepairRevision: 1,
  renderer,
  observerReceipt: receipt
});

render();
