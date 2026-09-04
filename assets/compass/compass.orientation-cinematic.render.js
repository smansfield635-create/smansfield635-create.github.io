const RENDERER_SCHEMA = 'COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_v1';

export function createCinematicRenderer({ stage, media }) {
  if (!(stage instanceof HTMLElement)) throw new Error('CINEMATIC_STAGE_MISSING');
  if (media?.schema !== 'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1') throw new Error('CINEMATIC_MEDIA_INVALID');

  let root = null;
  let disposed = false;
  let lastShot = null;

  function mount() {
    if (disposed) throw new Error('CINEMATIC_RENDERER_DISPOSED');
    if (root) return root;
    root = document.createElement('div');
    root.className = 'compass-orientation-cinematic__render-root';
    root.dataset.rendererSchema = RENDERER_SCHEMA;
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="compass-orientation-cinematic__page-night"></div><div class="compass-orientation-cinematic__shot-plane" data-cinematic-shot-plane></div>';
    stage.prepend(root);
    return root;
  }

  function renderFrame(frame) {
    if (disposed) return;
    const host = mount();
    const shot = frame?.shot;
    if (!shot) return;
    host.dataset.shotId = shot.id;
    host.style.setProperty('--cinematic-elapsed', String(frame.elapsedMs ?? 0));
    host.style.setProperty('--cinematic-shot-progress', String(frame.shotProgress ?? 0));
    if (lastShot !== shot.id) {
      lastShot = shot.id;
      const plane = host.querySelector('[data-cinematic-shot-plane]');
      if (plane) plane.dataset.shotId = shot.id;
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    root?.remove();
    root = null;
  }

  function inspect() {
    return Object.freeze({ schema: RENDERER_SCHEMA, mounted: Boolean(root), disposed, shotId: lastShot });
  }

  return Object.freeze({ schema: RENDERER_SCHEMA, mount, renderFrame, dispose, inspect });
}
