export const COMPASS_MASTER_HOUSE_PRESENTATION_ID = 'COMPASS_SINGLE_MASTER_HOUSE_PRESENTATION_v1';
export const COMPASS_MASTER_HOUSE_BINDING = Object.freeze({
  source: Object.freeze({
    path: 'assets/compass/compass.house-scene.js',
    blob: 'a82e3c963a10808b9f8f1922faab45155ea4a62b',
    renderer: 'mirror-manor-gothic-phase3-carousel-v6-material-detail-final',
    contract: 'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'
  }),
  geometryMutation: false,
  visitorMeaning: Object.freeze([
    'Meet the characters.',
    'Choose who you want to speak with.'
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

function waitForHouse(canvas, timeoutMs = 14000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const poll = () => {
      if (canvas.dataset.houseAssetReady === 'true') return resolve(true);
      if (canvas.dataset.houseError) return reject(new Error(canvas.dataset.houseError));
      if (performance.now() - start >= timeoutMs) return reject(new Error('HOUSE_MASTER_READY_TIMEOUT'));
      setTimeout(poll, 70);
    };
    poll();
  });
}

export async function createHouseMasterPresentation(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('HOUSE_MASTER_CANVAS_REQUIRED');
  Object.assign(canvas.style, {
    display: 'block', width: '100%', height: '100%', background: 'transparent',
    border: '0', boxShadow: 'none', filter: 'brightness(1.12) saturate(.98) contrast(1.08) drop-shadow(0 24px 30px rgba(0,0,0,.34))'
  });
  const owner = await loadClassicScript('/assets/compass/compass.house-scene.js', 'CompassHouseScene');
  const api = owner.mount(canvas, { foreground: () => true });
  if (!api || api.fallback === true) throw new Error('HOUSE_MASTER_SOURCE_FALLBACK_PROHIBITED');
  api.setForeground?.(true);
  await waitForHouse(canvas);
  api.draw?.();
  return Object.freeze({
    id: COMPASS_MASTER_HOUSE_PRESENTATION_ID,
    binding: COMPASS_MASTER_HOUSE_BINDING,
    api,
    draw: () => api.draw?.(),
    inspect: () => api.inspect?.()
  });
}
