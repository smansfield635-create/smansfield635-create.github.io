/* DOOR_MAGIC_MIRROR_AUTO_SEQUENCE_v5 */
(() => {
  'use strict';

  const reel = document.querySelector('[data-door-estate-reel]');
  const frame = reel?.querySelector('[data-door-reel-frame]');
  const video = reel?.querySelector('[data-door-reel-video]');
  const ghost = reel?.querySelector('[data-door-reel-ghost]');
  const label = reel?.querySelector('[data-door-reel-label]');
  const count = reel?.querySelector('[data-door-reel-count]');
  const legacySelectors = reel ? [...reel.querySelectorAll('[data-door-reel-index]')] : [];
  if (!reel || !frame || !video || !ghost || !label || !count) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const scenes = Object.freeze([
    Object.freeze({ label: 'Mirrorland', start: 39.55, motionMs: 850, dwellMs: 4050, zoom: 1.54, x: 0, y: -2.5 }),
    Object.freeze({ label: 'Audralia', start: 47.55, motionMs: 900, dwellMs: 4200, zoom: 1.68, x: 0, y: -7.5 }),
    Object.freeze({ label: 'Trophy', start: 57.22, motionMs: 820, dwellMs: 3950, zoom: 1.38, x: 0, y: -1.5 }),
    Object.freeze({ label: 'Brain', start: 53.30, motionMs: 900, dwellMs: 4050, zoom: 1.42, x: 0, y: -2.5 }),
    Object.freeze({ label: 'Mirror Manor', start: 60.86, motionMs: 850, dwellMs: 4300, zoom: 1.78, x: 0, y: -6.5 })
  ]);

  let index = 0;
  let ready = false;
  let changing = false;
  let visible = true;
  let nextTimer = 0;
  let motionTimer = 0;
  let currentScene = scenes[0];

  legacySelectors.forEach(button => {
    button.disabled = true;
    button.tabIndex = -1;
    button.setAttribute('aria-hidden', 'true');
  });

  reel.dataset.doorEstateReelState = 'loading';
  reel.dataset.doorEstateReelAutoplay = reduced ? 'reduced-static' : 'automatic';
  reel.dataset.doorEstateReelInteraction = 'none';

  const clearTimers = () => {
    if (nextTimer) clearTimeout(nextTimer);
    if (motionTimer) clearTimeout(motionTimer);
    nextTimer = 0;
    motionTimer = 0;
  };

  const applyCrop = scene => {
    frame.style.setProperty('--door-mirror-zoom', String(scene.zoom));
    frame.style.setProperty('--door-mirror-x', `${scene.x}%`);
    frame.style.setProperty('--door-mirror-y', `${scene.y}%`);
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

  const drawCover = (context, width, height, scene) => {
    if (!video.videoWidth || !video.videoHeight) return false;
    const baseScale = Math.max(width / video.videoWidth, height / video.videoHeight);
    const scale = baseScale * scene.zoom;
    const drawWidth = video.videoWidth * scale;
    const drawHeight = video.videoHeight * scale;
    const dx = (width - drawWidth) / 2 + width * scene.x / 100;
    const dy = (height - drawHeight) / 2 + height * scene.y / 100;
    context.drawImage(video, dx, dy, drawWidth, drawHeight);
    return true;
  };

  const captureCurrent = () => {
    if (!ready || video.readyState < 2) return false;
    try {
      const { width, height } = fitGhost();
      const context = ghost.getContext('2d', { alpha: false });
      if (!context) return false;
      context.fillStyle = '#01040a';
      context.fillRect(0, 0, width, height);
      if (!drawCover(context, width, height, currentScene)) return false;
      ghost.classList.add('is-visible');
      return true;
    } catch {
      return false;
    }
  };

  const updateCopy = () => {
    label.textContent = currentScene.label;
    count.textContent = `${index + 1} / ${scenes.length}`;
    reel.dataset.doorEstateReelScene = currentScene.label.toLowerCase().replace(/\s+/g, '-');
  };

  const scheduleNext = () => {
    if (reduced || !ready || !visible || document.hidden) return;
    if (nextTimer) clearTimeout(nextTimer);
    nextTimer = window.setTimeout(() => showScene((index + 1) % scenes.length), currentScene.dwellMs);
  };

  const playMicroMotion = () => {
    if (reduced || document.hidden || !visible) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    motionTimer = window.setTimeout(() => {
      video.pause();
      motionTimer = 0;
    }, currentScene.motionMs);
  };

  const finishScene = initial => {
    updateCopy();
    changing = false;
    if (!ready) {
      ready = true;
      reel.dataset.doorEstateReelReady = 'true';
    }
    reel.dataset.doorEstateReelState = reduced ? 'reduced-static' : 'ready';

    if (!initial) {
      frame.classList.add('is-transitioning');
      requestAnimationFrame(() => {
        ghost.classList.remove('is-visible');
        window.setTimeout(() => frame.classList.remove('is-transitioning'), 940);
      });
    } else {
      ghost.classList.remove('is-visible');
    }

    playMicroMotion();
    scheduleNext();
  };

  function showScene(nextIndex) {
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= scenes.length || changing) return;
    clearTimers();

    const initial = !ready;
    if (!initial) captureCurrent();

    changing = true;
    index = nextIndex;
    currentScene = scenes[index];
    applyCrop(currentScene);

    const maximum = Number.isFinite(video.duration) && video.duration > .2
      ? Math.max(.05, video.duration - .15)
      : currentScene.start;
    const target = Math.min(currentScene.start, maximum);

    const onSeeked = () => finishScene(initial);
    video.addEventListener('seeked', onSeeked, { once: true });
    try {
      video.pause();
      video.currentTime = target;
    } catch {
      video.removeEventListener('seeked', onSeeked);
      changing = false;
      ready = true;
      reel.dataset.doorEstateReelReady = 'true';
      reel.dataset.doorEstateReelState = 'fallback-static';
      updateCopy();
    }
  }

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = false;
  video.addEventListener('loadedmetadata', () => showScene(0), { once: true });
  video.addEventListener('error', () => {
    changing = false;
    ready = true;
    reel.dataset.doorEstateReelReady = 'true';
    reel.dataset.doorEstateReelState = 'fallback-static';
    updateCopy();
  }, { once: true });

  if (video.readyState >= 1) showScene(0);
  else video.load();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (!visible) {
        clearTimers();
        video.pause();
      } else if (ready && !reduced) {
        scheduleNext();
      }
    }, { rootMargin: '140px' }).observe(reel);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimers();
      video.pause();
    } else if (ready && visible && !reduced) {
      scheduleNext();
    }
  });

  window.addEventListener('resize', () => {
    if (ghost.classList.contains('is-visible')) captureCurrent();
  }, { passive: true });

  applyCrop(currentScene);
  updateCopy();

  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_MAGIC_MIRROR_AUTO_SEQUENCE_v5',
    ready: true,
    source: '/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4',
    sourceAuthority: 'owner-authorized-compass-cinematic-v2',
    sceneCount: scenes.length,
    sceneOrder: scenes.map(scene => scene.label),
    automaticSequence: !reduced,
    manualSelectorsEnabled: false,
    cleanFraming: 'scene-specific-zoom-and-offset',
    transition: 'canvas-crossfade-plus-reflective-ripple',
    embeddedAudraliaRuntime: false,
    additionalWebGLContexts: 0,
    generatedArtwork: false,
    reducedMotion: reduced
  });
})();
