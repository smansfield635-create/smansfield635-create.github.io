export const COMPASS_MASTER_TROPHY_PRESENTATION_ID = 'COMPASS_SINGLE_MASTER_TROPHY_PRESENTATION_v1';
export const COMPASS_MASTER_TROPHY_BINDING = Object.freeze({
  source: Object.freeze({
    path: 'assets/compass/compass.trophy-scene.js',
    blob: 'd281e18b06128671ffe2a19e8fdb272cc5544e31',
    renderer: 'procedural-webgl-trophy-v8-integrated-recessed-plaque'
  }),
  geometryMutation: false,
  visitorMeaning: Object.freeze([
    'Enter the Awards Chamber.',
    'See the work recognized — and why.'
  ])
});

function loadClassicScript(path, globalName) {
  if (globalThis[globalName]?.mount) return Promise.resolve(globalThis[globalName]);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-cinematic-master-source="${globalName}"]`);
    if (existing) {
      existing.addEventListener('load', () => globalThis[globalName]?.mount ? resolve(globalThis[globalName]) : reject(new Error(`${globalName}_API_MISSING`)), { once: true });
      existing.addEventListener('error', () => reject(new Error(`${globalName}_LOAD_FAILURE`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = path;
    script.dataset.cinematicMasterSource = globalName;
    script.onload = () => globalThis[globalName]?.mount ? resolve(globalThis[globalName]) : reject(new Error(`${globalName}_API_MISSING`));
    script.onerror = () => reject(new Error(`${globalName}_LOAD_FAILURE`));
    document.head.append(script);
  });
}

export async function createTrophyMasterPresentation(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('TROPHY_MASTER_CANVAS_REQUIRED');
  Object.assign(canvas.style, {
    display: 'block', width: '100%', height: '100%', background: 'transparent',
    border: '0', boxShadow: 'none', filter: 'brightness(1.08) saturate(1.02) contrast(1.06)'
  });
  const owner = await loadClassicScript('/assets/compass/compass.trophy-scene.js', 'CompassTrophyScene');
  const api = owner.mount(canvas, { foreground: () => true });
  if (!api || api.fallback === true) throw new Error('TROPHY_MASTER_SOURCE_FALLBACK_PROHIBITED');
  return Object.freeze({
    id: COMPASS_MASTER_TROPHY_PRESENTATION_ID,
    binding: COMPASS_MASTER_TROPHY_BINDING,
    api,
    capture: () => api.capture?.(),
    inspect: () => api.inspect?.()
  });
}
