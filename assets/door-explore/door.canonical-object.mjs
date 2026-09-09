/* DOOR_CANONICAL_OBJECT_HOST_v1
   Isolated same-origin host for exact existing Compass object renderers.
   No invented geometry, no cinematic frames, no visitor interaction.
*/
const stage = document.querySelector('[data-door-object-stage]');
const canvas = document.querySelector('[data-door-canonical-object-canvas]');
const params = new URLSearchParams(location.search);
const scene = String(params.get('scene') || '').toLowerCase();
const ALLOWED = new Set(['trophy','brain']);

const post = (state, detail = {}) => {
  try {
    parent.postMessage(Object.freeze({
      type: 'DGB_DOOR_CANONICAL_OBJECT',
      scene,
      state,
      ...detail
    }), location.origin);
  } catch {}
};

const loadScript = src => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error(`SCRIPT_LOAD_FAILED:${src}`));
  document.head.appendChild(script);
});

const waitFrames = (count = 2) => new Promise(resolve => {
  const tick = () => count-- <= 0 ? resolve() : requestAnimationFrame(tick);
  requestAnimationFrame(tick);
});

async function mountTrophy() {
  await loadScript('/assets/compass/compass.trophy-scene.js');
  if (!window.CompassTrophyScene?.mount) throw new Error('COMPASS_TROPHY_SCENE_UNAVAILABLE');
  const api = window.CompassTrophyScene.mount(canvas, { foreground: () => !document.hidden });
  await waitFrames(3);
  const inspect = api?.inspect?.() || window.CompassTrophyScene.inspect?.();
  if (!api || inspect?.fallback === true || canvas.hidden) throw new Error('CANONICAL_TROPHY_RENDER_FAILED');
  post('ready', {
    authority: 'CompassTrophyScene',
    renderer: window.CompassTrophyScene.version || 'canonical-trophy'
  });
}

async function mountBrain() {
  await loadScript('/assets/compass/compass.hra-brain-scene.js');
  if (!window.CompassBrainScene?.mount) throw new Error('COMPASS_BRAIN_SCENE_UNAVAILABLE');
  const api = window.CompassBrainScene.mount(canvas, { foreground: () => !document.hidden });
  if (!api) throw new Error('CANONICAL_BRAIN_MOUNT_FAILED');
  const loaded = await api.load;
  if (!loaded || canvas.dataset.brainReady !== 'true') throw new Error('CANONICAL_BRAIN_LOAD_FAILED');
  await waitFrames(2);
  post('ready', {
    authority: 'CompassBrainScene',
    renderer: window.CompassBrainScene.version || 'canonical-brain',
    contract: window.CompassBrainScene.contract || ''
  });
}

async function start() {
  if (!stage || !canvas || !ALLOWED.has(scene)) {
    post('error', { reason: 'INVALID_CANONICAL_OBJECT_HOST' });
    return;
  }
  stage.dataset.scene = scene;
  try {
    if (scene === 'trophy') await mountTrophy();
    else await mountBrain();
  } catch (error) {
    post('error', { reason: String(error?.message || error) });
  }
}

window.addEventListener('pagehide', () => {
  try {
    const gl = canvas?.getContext?.('webgl') || canvas?.getContext?.('webgl2');
    gl?.getExtension?.('WEBGL_lose_context')?.loseContext?.();
  } catch {}
}, { once: true });

start();
