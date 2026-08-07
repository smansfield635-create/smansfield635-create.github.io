import { createMapWideEnvironmentRenderer } from './renderer.mjs';
import { buildHEarthMapWideEnvironmentPreviewObserverReceipt } from './observer.mjs';

const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const statsNode = document.querySelector('[data-h-earth-stats]');
const reliefToggle = document.querySelector('[data-toggle-relief]');
const estateToggle = document.querySelector('[data-toggle-estate]');
const entryToggle = document.querySelector('[data-toggle-entry]');
const wireToggle = document.querySelector('[data-toggle-wire]');
const resetButton = document.querySelector('[data-reset-view]');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('H_EARTH_MAP_WIDE_CANVAS_MISSING');
}

const renderer = createMapWideEnvironmentRenderer(canvas);
const receipt = buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer.mesh.statistics);

let pointer = null;

function setStatus() {
  statusNode.textContent = receipt.result === 'PASS'
    ? 'Candidate self-check: PASS — nonpublic construction preview'
    : 'Candidate self-check: FAIL_CLOSED';
  statusNode.dataset.status = receipt.result;

  const statistics = renderer.mesh.statistics;
  statsNode.textContent = [
    `${statistics.validSampleCount.toLocaleString()} terrain samples`,
    `${statistics.triangleCount.toLocaleString()} triangles`,
    `elevation ${statistics.minimumElevation.toFixed(1)}…${statistics.maximumElevation.toFixed(1)}`,
    `added presentation relief ${statistics.minimumRelief.toFixed(1)}…${statistics.maximumRelief.toFixed(1)}`
  ].join(' · ');
}

function render() {
  renderer.render();
  setStatus();
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointer || pointer.id !== event.pointerId) return;
  const deltaX = event.clientX - pointer.x;
  const deltaY = event.clientY - pointer.y;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  renderer.orbit(deltaX, deltaY);
});

const clearPointer = (event) => {
  if (pointer?.id === event.pointerId) pointer = null;
};
canvas.addEventListener('pointerup', clearPointer);
canvas.addEventListener('pointercancel', clearPointer);

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

resetButton?.addEventListener('click', () => {
  Object.assign(renderer.state, {
    yaw: -0.62,
    pitch: 0.72,
    zoom: 1,
    targetX: 34,
    targetZ: -190,
    verticalScale: 2.15,
    showEstate: true,
    showEntry: true,
    showRelief: true,
    wireframe: false
  });
  if (reliefToggle) reliefToggle.checked = true;
  if (estateToggle) estateToggle.checked = true;
  if (entryToggle) entryToggle.checked = true;
  if (wireToggle) wireToggle.checked = false;
  render();
});

window.addEventListener('resize', render);

window.__H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW__ = Object.freeze({
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  renderer,
  observerReceipt: receipt
});

render();
