/* DOOR_CANONICAL_ESTATE_REEL_v4 */
(() => {
  "use strict";

  const reel = document.querySelector('[data-door-estate-reel]');
  const frame = reel?.querySelector('[data-door-reel-frame]');
  const video = reel?.querySelector('[data-door-reel-video]');
  const ghost = reel?.querySelector('[data-door-reel-ghost]');
  const label = reel?.querySelector('[data-door-reel-label]');
  const count = reel?.querySelector('[data-door-reel-count]');
  const selectors = reel ? [...reel.querySelectorAll('[data-door-reel-index]')] : [];
  if (!reel || !frame || !video || !ghost || !label || !count || selectors.length !== 5) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const scenes = Object.freeze([
    Object.freeze({ label: 'Mirrorland', time: 37.6 }),
    Object.freeze({ label: 'Audralia', time: 49.6 }),
    Object.freeze({ label: 'Trophy', time: 57.4 }),
    Object.freeze({ label: 'Brain', time: 53.6 }),
    Object.freeze({ label: 'Mirror Manor', time: 61.03 })
  ]);

  let index = 0;
  let ready = false;
  let changing = false;
  let timer = 0;
  let visible = true;

  const clearTimer = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  };

  const updateLabels = () => {
    const scene = scenes[index];
    label.textContent = scene.label;
    count.textContent = `${index + 1} / ${scenes.length}`;
    reel.dataset.doorEstateReelScene = scene.label.toLowerCase().replace(/\s+/g, '-');
    selectors.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.dataset.active = selected ? 'true' : 'false';
    });
  };

  const fitGhost = () => {
    const rect = frame.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(2, Math.round(rect.width * dpr));
    const height = Math.max(2, Math.round(rect.height * dpr));
    if (ghost.width !== width) ghost.width = width;
    if (ghost.height !== height) ghost.height = height;
    return { width, height };
  };

  const captureCurrentFrame = () => {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return false;
    try {
      const { width, height } = fitGhost();
      const context = ghost.getContext('2d', { alpha: false });
      if (!context) return false;
      context.clearRect(0, 0, width, height);
      context.drawImage(video, 0, 0, width, height);
      ghost.classList.add('is-visible');
      void ghost.offsetWidth;
      return true;
    } catch {
      return false;
    }
  };

  const markReady = (state = 'ready') => {
    ready = true;
    reel.dataset.doorEstateReelReady = 'true';
    reel.dataset.doorEstateReelState = state;
    reel.dataset.doorEstateReelSource = 'compass-main-orientation-final-v2';
    reel.dataset.doorEstateReelSceneCount = String(scenes.length);
    reel.dataset.doorEstateReelMotion = reduced ? 'manual-reduced-motion' : 'timed-crossfade';
  };

  const schedule = () => {
    clearTimer();
    if (reduced || !ready || !visible || document.hidden) return;
    timer = window.setTimeout(() => selectScene((index + 1) % scenes.length, false), 4200);
  };

  const finishSeek = (initial = false) => {
    updateLabels();
    changing = false;
    if (!ready) markReady('ready');
    if (!initial) {
      frame.classList.remove('is-arriving');
      void frame.offsetWidth;
      frame.classList.add('is-arriving');
      requestAnimationFrame(() => ghost.classList.remove('is-visible'));
      window.setTimeout(() => frame.classList.remove('is-arriving'), 780);
    } else {
      ghost.classList.remove('is-visible');
    }
    schedule();
  };

  function selectScene(nextIndex, manual = false) {
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= scenes.length) return;
    if (changing && nextIndex !== index) return;
    if (manual) clearTimer();
    if (ready && nextIndex === index) {
      schedule();
      return;
    }

    changing = true;
    const initial = !ready;
    if (!initial) captureCurrentFrame();
    index = nextIndex;
    const scene = scenes[index];
    const maximum = Number.isFinite(video.duration) && video.duration > .2 ? Math.max(.05, video.duration - .12) : scene.time;
    const target = Math.min(scene.time, maximum);

    const onSeeked = () => finishSeek(initial);
    video.addEventListener('seeked', onSeeked, { once: true });
    try {
      video.pause();
      video.currentTime = target;
    } catch {
      video.removeEventListener('seeked', onSeeked);
      changing = false;
      markReady('poster-fallback');
      updateLabels();
      schedule();
    }
  }

  selectors.forEach((button, buttonIndex) => {
    button.addEventListener('click', () => selectScene(buttonIndex, true));
  });

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.addEventListener('loadedmetadata', () => selectScene(0, false), { once: true });
  video.addEventListener('error', () => {
    changing = false;
    markReady('poster-fallback');
    updateLabels();
  }, { once: true });

  if (video.readyState >= 1) selectScene(0, false);
  else video.load();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) schedule(); else clearTimer();
    }, { rootMargin: '160px' }).observe(reel);
  }

  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('resize', () => {
    if (ghost.classList.contains('is-visible')) captureCurrentFrame();
  }, { passive: true });

  updateLabels();

  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_CANONICAL_ESTATE_REEL_v4',
    ready: true,
    source: '/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4',
    sourceAuthority: 'owner-authorized-compass-cinematic-v2',
    sceneCount: scenes.length,
    sceneOrder: scenes.map(scene => scene.label),
    embeddedAudraliaRuntime: false,
    additionalWebGLContexts: 0,
    generatedArtwork: false,
    reducedMotion: reduced
  });
})();
