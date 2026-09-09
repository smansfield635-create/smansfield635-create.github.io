/* DOOR_MIRRORLAND_DEPTH_ENVIRONMENT_v2 */
(() => {
  "use strict";
  const root = document.documentElement;
  const threshold = document.querySelector('[data-door-mirrorland]');
  const stage = document.querySelector('[data-door-depth-stage]');
  if (!threshold || !stage) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const fine = window.matchMedia?.('(pointer: fine)')?.matches ?? false;
  const baseYaw = fine ? -7 : -10;
  const basePitch = fine ? 3 : 4;

  const setPose = (yaw, pitch, rise = 0) => {
    root.style.setProperty('--door-yaw', `${yaw.toFixed(2)}deg`);
    root.style.setProperty('--door-pitch', `${pitch.toFixed(2)}deg`);
    root.style.setProperty('--door-rise', `${rise.toFixed(2)}px`);
  };

  setPose(baseYaw, basePitch, 0);

  if (!reduced && fine) {
    threshold.addEventListener('pointermove', (event) => {
      const rect = threshold.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((event.clientX - rect.left) / rect.width) - .5;
      const ny = ((event.clientY - rect.top) / rect.height) - .5;
      setPose(baseYaw + nx * 13, basePitch - ny * 8, ny * -3);
    }, { passive: true });
    threshold.addEventListener('pointerleave', () => setPose(baseYaw, basePitch, 0), { passive: true });
  }

  threshold.dataset.doorMirrorlandReady = 'true';
  threshold.dataset.doorMirrorlandMotion = reduced ? 'reduced-static-depth' : (fine ? 'pointer-depth-parallax' : 'static-mobile-depth');
  threshold.dataset.doorMirrorlandDepth = 'front-68-mid-20-back-72';

  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_MIRRORLAND_DEPTH_ENVIRONMENT_v2',
    ready: true,
    reducedMotion: reduced,
    mobileStaticPerspective: !fine,
    explicitDepthStack: true,
    legacyMirrorlandRendererAdopted: false
  });
})();
