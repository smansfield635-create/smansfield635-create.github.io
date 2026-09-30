/* DOOR_CANONICAL_RENDERER_MIRROR_v7_2
   Background-only correction on accepted G7 source strategy:
   - preserve three clean cinematic states;
   - preserve canonical Trophy and Brain renderers;
   - preserve visitor-facing labels;
   - force a fresh canonical-object host so the retired white stage cannot persist from cache;
   - remain passive: no scene buttons or visitor interaction.
*/
(() => {
  'use strict';

  const mirror = document.querySelector('[data-door-canonical-mirror]');
  const frame = mirror?.querySelector('[data-door-canonical-frame]');
  const film = mirror?.querySelector('[data-door-canonical-film]');
  const objects = mirror?.querySelector('[data-door-canonical-objects]');
  const label = mirror?.querySelector('[data-door-canonical-label]');
  const count = mirror?.querySelector('[data-door-canonical-count]');
  if (!mirror || !frame || !film || !objects || !label || !count) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const TRANSITION_MS = 920;
  const OBJECT_HOST_VERSION = 'door-canonical-object-host-g7-2-20260909-1';
  const scenes = Object.freeze([
    Object.freeze({ label: 'Mirrorland', kind: 'film', time: 39.55, motionMs: 820, dwellMs: 4300, zoom: 1.54, x: 0, y: -2.5, authority: 'owner-authorized-compass-cinematic-clean-state' }),
    Object.freeze({ label: 'Audralia', kind: 'film', time: 47.55, motionMs: 880, dwellMs: 4450, zoom: 1.68, x: 0, y: -7.5, authority: 'owner-authorized-compass-cinematic-clean-state' }),
    Object.freeze({ label: 'Explore the Awards Chamber', kind: 'canonical', object: 'trophy', dwellMs: 4400, authority: 'CompassTrophyScene' }),
    Object.freeze({ label: 'Discover your Coherence Index', kind: 'canonical', object: 'brain', dwellMs: 4700, authority: 'CompassBrainScene' }),
    Object.freeze({ label: 'Mirror Manor', kind: 'film', time: 60.86, motionMs: 820, dwellMs: 4550, zoom: 1.78, x: 0, y: -6.5, authority: 'owner-authorized-compass-cinematic-clean-state' })
  ]);

  let index = 0;
  let activeKind = '';
  let activeObject = null;
  let timer = 0;
  let motionTimer = 0;
  let visible = true;
  let changing = false;
  let generation = 0;

  const clearTimers = () => {
    if (timer) clearTimeout(timer);
    if (motionTimer) clearTimeout(motionTimer);
    timer = 0;
    motionTimer = 0;
  };

  const setCopy = nextIndex => {
    index = nextIndex;
    const scene = scenes[index];
    label.textContent = scene.label;
    count.textContent = `${index + 1} / ${scenes.length}`;
    mirror.dataset.doorCanonicalMirrorScene = scene.label.toLowerCase().replace(/\s+/g, '-');
    mirror.dataset.doorCanonicalMirrorAuthority = scene.authority;
  };

  const pulseMirror = () => {
    frame.classList.remove('is-changing');
    void frame.offsetWidth;
    frame.classList.add('is-changing');
    setTimeout(() => frame.classList.remove('is-changing'), TRANSITION_MS + 80);
  };

  const controlObject = (iframe, active) => {
    try {
      iframe?.contentWindow?.postMessage({ type: 'DGB_DOOR_CANONICAL_OBJECT_CONTROL', active: Boolean(active) }, location.origin);
    } catch {}
  };

  const schedule = () => {
    if (reduced || !visible || document.hidden || changing) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => showScene((index + 1) % scenes.length), scenes[index].dwellMs);
  };

  const playFilmMotion = scene => {
    if (reduced || !visible || document.hidden) return;
    film.muted = true;
    const attempt = film.play();
    attempt?.catch?.(() => {});
    motionTimer = setTimeout(() => {
      film.pause();
      motionTimer = 0;
    }, scene.motionMs);
  };

  const seekFilm = scene => new Promise(resolve => {
    frame.style.setProperty('--door-film-zoom', String(scene.zoom));
    frame.style.setProperty('--door-film-x', `${scene.x}%`);
    frame.style.setProperty('--door-film-y', `${scene.y}%`);
    const target = Number.isFinite(film.duration) && film.duration > .2
      ? Math.min(scene.time, Math.max(.05, film.duration - .15))
      : scene.time;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      film.removeEventListener('seeked', finish);
      resolve();
    };
    film.addEventListener('seeked', finish, { once: true });
    try {
      film.pause();
      film.currentTime = target;
      setTimeout(finish, 1800);
    } catch {
      finish();
    }
  });

  async function showFilm(nextIndex, stamp) {
    const scene = scenes[nextIndex];
    const previousObject = activeObject;

    if (activeKind === 'film') {
      film.classList.remove('is-visible');
      pulseMirror();
      await new Promise(resolve => setTimeout(resolve, 180));
    }

    await seekFilm(scene);
    if (stamp !== generation) return;

    changing = false;
    setCopy(nextIndex);
    if (activeKind !== 'film') pulseMirror();
    film.classList.add('is-visible');
    activeKind = 'film';
    activeObject = null;

    if (previousObject) {
      controlObject(previousObject, false);
      previousObject.classList.remove('is-visible');
      setTimeout(() => previousObject.remove(), TRANSITION_MS + 80);
    }
    if (!objects.querySelector('.door-canonical-mirror__object.is-visible')) {
      objects.classList.remove('is-visible');
    }

    mirror.dataset.doorCanonicalMirrorReady = 'true';
    mirror.dataset.doorCanonicalMirrorState = 'ready';
    playFilmMotion(scene);
    schedule();
  }

  function createObjectFrame(scene, stamp) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.className = 'door-canonical-mirror__object';
      iframe.src = `/door/canonical-object.html?v=${OBJECT_HOST_VERSION}&scene=${encodeURIComponent(scene.object)}&g=${stamp}`;
      iframe.title = `${scene.label} canonical estate geometry`;
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('loading', 'eager');
      objects.appendChild(iframe);

      const timeout = setTimeout(() => finish(false, 'CANONICAL_OBJECT_TIMEOUT'), scene.object === 'brain' ? 24000 : 12000);
      const onMessage = event => {
        if (event.origin !== location.origin || event.source !== iframe.contentWindow) return;
        const data = event.data;
        if (!data || data.type !== 'DGB_DOOR_CANONICAL_OBJECT' || data.scene !== scene.object) return;
        if (data.state === 'ready') finish(true, data);
        else if (data.state === 'error') finish(false, data.reason || 'CANONICAL_OBJECT_ERROR');
      };
      const finish = (ok, value) => {
        clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
        if (ok) resolve({ iframe, detail: value });
        else {
          iframe.remove();
          reject(new Error(String(value)));
        }
      };
      window.addEventListener('message', onMessage);
    });
  }

  async function showCanonical(nextIndex, stamp) {
    const scene = scenes[nextIndex];
    let incoming;
    try {
      incoming = await createObjectFrame(scene, stamp);
    } catch {
      changing = false;
      mirror.dataset.doorCanonicalMirrorState = 'source-skip';
      const fallbackIndex = (nextIndex + 1) % scenes.length;
      setTimeout(() => showScene(fallbackIndex), 500);
      return;
    }
    if (stamp !== generation) {
      incoming.iframe.remove();
      return;
    }

    const previousObject = activeObject;
    setCopy(nextIndex);
    pulseMirror();
    objects.classList.add('is-visible');
    incoming.iframe.classList.add('is-visible');
    controlObject(incoming.iframe, visible && !document.hidden);
    film.classList.remove('is-visible');

    if (previousObject && previousObject !== incoming.iframe) {
      controlObject(previousObject, false);
      previousObject.classList.remove('is-visible');
      setTimeout(() => previousObject.remove(), TRANSITION_MS + 80);
    }

    activeKind = 'canonical';
    activeObject = incoming.iframe;
    changing = false;
    mirror.dataset.doorCanonicalMirrorReady = 'true';
    mirror.dataset.doorCanonicalMirrorState = 'ready';
    mirror.dataset.doorCanonicalObjectRenderer = String(incoming.detail?.renderer || scene.authority);
    schedule();
  }

  async function showScene(nextIndex) {
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= scenes.length || changing) return;
    clearTimers();
    changing = true;
    const stamp = ++generation;
    const scene = scenes[nextIndex];
    mirror.dataset.doorCanonicalMirrorState = 'changing';
    if (scene.kind === 'film') await showFilm(nextIndex, stamp);
    else await showCanonical(nextIndex, stamp);
  }

  film.muted = true;
  film.defaultMuted = true;
  film.playsInline = true;
  film.preload = 'metadata';

  const begin = () => {
    if (mirror.dataset.doorCanonicalMirrorStarted === 'true') return;
    mirror.dataset.doorCanonicalMirrorStarted = 'true';
    mirror.dataset.doorCanonicalMirrorState = 'loading';
    showScene(0);
  };
  if (film.readyState >= 1) begin();
  else {
    film.addEventListener('loadedmetadata', begin, { once: true });
    film.addEventListener('error', () => {
      mirror.dataset.doorCanonicalMirrorState = 'film-source-error';
    }, { once: true });
    film.load();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (!visible) {
        clearTimers();
        film.pause();
        controlObject(activeObject, false);
      } else {
        controlObject(activeObject, true);
        schedule();
      }
    }, { rootMargin: '140px' }).observe(mirror);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimers();
      film.pause();
      controlObject(activeObject, false);
    } else {
      controlObject(activeObject, visible);
      schedule();
    }
  });

  setCopy(0);

  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_CANONICAL_RENDERER_MIRROR_v7_2',
    ready: true,
    sceneOrder: scenes.map(scene => scene.label),
    automaticSequence: !reduced,
    manualSelectorsEnabled: false,
    cinematicCleanStates: Object.freeze(['Mirrorland', 'Audralia', 'Mirror Manor']),
    canonicalRendererStates: Object.freeze(['Explore the Awards Chamber', 'Discover your Coherence Index']),
    canonicalObjectHostVersion: OBJECT_HOST_VERSION,
    trophyAuthority: 'CompassTrophyScene',
    brainAuthority: 'CompassBrainScene',
    trophySource: '/assets/compass/compass.trophy-scene.js',
    brainSource: '/assets/compass/compass.hra-brain-scene.js',
    generatedArtwork: false,
    inventedGeometry: false,
    reducedMotion: reduced
  });
})();
