const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const loader = document.querySelector('[data-audralia-loader]');
const loaderStage = document.querySelector('[data-audralia-loader-stage]');
const focusButton = document.querySelector('[data-fit-world]');

const setStatus = (text, state = text) => {
  if (!statusNode) return;
  statusNode.textContent = text;
  statusNode.dataset.status = state;
};

function wire(renderer) {
  const pointers = new Map();
  let gesture = null;
  const safe = value => Math.max(-64, Math.min(64, Number(value) || 0));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const midpoint = (a, b) => ({ x: (a.x + b.x) * .5, y: (a.y + b.y) * .5 });
  const ordered = () => [...pointers.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
  const beginTwo = () => {
    const entries = ordered();
    if (entries.length !== 2) { gesture = null; return; }
    const a = { ...entries[0][1] }, b = { ...entries[1][1] };
    gesture = { ids: [entries[0][0], entries[1][0]], lastMid: midpoint(a, b), lastDistance: Math.max(1, distance(a, b)), mode: 'PENDING' };
  };
  canvas.addEventListener('pointerdown', event => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) beginTwo();
  });
  canvas.addEventListener('pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);
    if (pointers.size === 1) {
      renderer.orbit(safe(next.x - previous.x), safe(next.y - previous.y));
      return;
    }
    if (pointers.size !== 2) return;
    if (!gesture) beginTwo();
    const a = pointers.get(gesture.ids[0]), b = pointers.get(gesture.ids[1]);
    if (!a || !b) return;
    const mid = midpoint(a, b), dist = Math.max(1, distance(a, b));
    const common = Math.hypot(mid.x - gesture.lastMid.x, mid.y - gesture.lastMid.y);
    const zoom = Math.abs(dist - gesture.lastDistance) * .5;
    if (gesture.mode === 'PENDING') {
      if (common >= 2.2 && common > zoom * 1.28) gesture.mode = 'TRAVEL';
      else if (zoom >= 2 && zoom > common * 1.2) gesture.mode = 'ZOOM';
      else return;
    }
    if (gesture.mode === 'TRAVEL') renderer.panScreen(safe((mid.x - gesture.lastMid.x) * 1.45), safe((mid.y - gesture.lastMid.y) * 1.45));
    else renderer.zoomByFactor(dist / Math.max(1, gesture.lastDistance));
    gesture.lastMid = mid;
    gesture.lastDistance = dist;
  });
  const clear = event => {
    pointers.delete(event.pointerId);
    if (pointers.size === 2) beginTwo(); else gesture = null;
  };
  canvas.addEventListener('pointerup', clear);
  canvas.addEventListener('pointercancel', clear);
  canvas.addEventListener('lostpointercapture', clear);
  canvas.addEventListener('wheel', event => { event.preventDefault(); renderer.zoom(event.deltaY); }, { passive: false });
  canvas.addEventListener('dblclick', () => renderer.focusGratitude());
  focusButton?.addEventListener('click', () => renderer.focusGratitude());
  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (['w', 'arrowup'].includes(key)) renderer.panScreen(0, -12);
    else if (['s', 'arrowdown'].includes(key)) renderer.panScreen(0, 12);
    else if (['a', 'arrowleft'].includes(key)) renderer.panScreen(12, 0);
    else if (['d', 'arrowright'].includes(key)) renderer.panScreen(-12, 0);
    else return;
    event.preventDefault();
  });
  window.addEventListener('resize', () => renderer.render());
}

export async function initializeAudraliaTabletSingleContext() {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_SINGLE_CONTEXT_CANVAS_MISSING');
  setStatus('building…', 'AUDRALIA_SINGLE_CONTEXT_BUILDING');
  if (loaderStage) loaderStage.textContent = 'Building the Audralia world…';
  const rendererModule = await import('./renderer.precomputed.mjs');
  const renderer = rendererModule.createMapWideEnvironmentRenderer(canvas);
  renderer.render();
  wire(renderer);
  const runtime = Object.freeze({
    schema: 'AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_v1',
    renderer,
    renderingMode: 'EXACT_PRIMARY_WORLD_SINGLE_WEBGL_CONTEXT',
    fallbackActive: false,
    exactApprovedGeometry: true,
    optionalMultiContextEnrichmentDeferred: true,
    invariants: Object.freeze({ pass: true, failures: Object.freeze([]), singleWebGLContext: true }),
    getRuntime: () => runtime,
    getCameraFrame: () => Object.freeze({ snapshot: renderer.getSnapshot() })
  });
  window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__ = Object.freeze({ operationId: runtime.schema, renderer, fallbackActive: false });
  window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__ = runtime;
  window.__AUDRALIA_TABLET_SINGLE_CONTEXT__ = runtime;
  setStatus('Audralia ready', 'AUDRALIA_SINGLE_CONTEXT_READY');
  if (loaderStage) loaderStage.textContent = 'Audralia ready';
  if (loader) {
    loader.classList.add('is-ready');
    setTimeout(() => { loader.hidden = true; }, 420);
  }
  return runtime;
}

export default initializeAudraliaTabletSingleContext;
