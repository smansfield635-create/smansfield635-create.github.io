export const COMPASS_MASTER_BRAIN_PRESENTATION_ID = 'COMPASS_SINGLE_MASTER_BRAIN_PRESENTATION_v1';
export const COMPASS_MASTER_BRAIN_BINDING = Object.freeze({
  source: Object.freeze({
    path: 'assets/compass/compass.hra-brain-scene.js',
    blob: 'c26603744e55c8ede2c82944bd0fd117d04dcbdb',
    contract: 'COMPASS_BRAIN_GEN1_HRA_GEOMETRY_FREEZE_v1'
  }),
  geometryMutation: false,
  deterministicPose: true,
  visitorMeaning: Object.freeze([
    'Discover your Coherence Index.',
    'Take a free coherence assessment.'
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

export async function createBrainMasterPresentation(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('BRAIN_MASTER_CANVAS_REQUIRED');
  Object.assign(canvas.style, {
    display: 'block', width: '100%', height: '100%', background: 'transparent',
    border: '0', boxShadow: 'none', filter: 'brightness(1.08) saturate(1.04) contrast(1.08)'
  });
  const owner = await loadClassicScript('/assets/compass/compass.hra-brain-scene.js', 'CompassBrainScene');
  const api = owner.mount(canvas, { foreground: () => false });
  if (!api || api.fallback === true) throw new Error('BRAIN_MASTER_SOURCE_FALLBACK_PROHIBITED');
  if (api.load) {
    const loaded = await api.load;
    if (loaded !== true || canvas.dataset.brainReady !== 'true') throw new Error('BRAIN_MASTER_SOURCE_NOT_READY');
  }
  api.capture?.();
  return Object.freeze({
    id: COMPASS_MASTER_BRAIN_PRESENTATION_ID,
    binding: COMPASS_MASTER_BRAIN_BINDING,
    api,
    capture: () => api.capture?.(),
    inspect: () => api.inspect?.()
  });
}
