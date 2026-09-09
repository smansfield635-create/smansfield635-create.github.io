/* DOOR_MIRRORLAND_ENVIRONMENT_v1 */
(() => {
  "use strict";
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const threshold = document.querySelector('[data-door-mirrorland]');
  const windowEl = document.querySelector('[data-door-window]');
  if (!hero || !threshold || !windowEl) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const fine = window.matchMedia?.('(pointer: fine)')?.matches ?? false;
  const setShift = (x, y) => {
    root.style.setProperty('--door-shift-x', `${Math.max(-10, Math.min(10, x))}px`);
    root.style.setProperty('--door-shift-y', `${Math.max(-8, Math.min(8, y))}px`);
    windowEl.style.transform = `translate(-50%,-50%) perspective(700px) rotateX(${(-y * .08).toFixed(2)}deg) rotateY(${(x * .08).toFixed(2)}deg)`;
  };

  if (!reduced && fine) {
    threshold.addEventListener('pointermove', (event) => {
      const rect = threshold.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((event.clientX - rect.left) / rect.width) - .5;
      const ny = ((event.clientY - rect.top) / rect.height) - .5;
      setShift(nx * 14, ny * 10);
    }, { passive: true });
    threshold.addEventListener('pointerleave', () => setShift(0, 0), { passive: true });
  }

  threshold.dataset.doorMirrorlandReady = 'true';
  threshold.dataset.doorMirrorlandMotion = reduced ? 'reduced-static' : (fine ? 'pointer-parallax' : 'ambient-only');
  window.DGBDoorEnvironment = Object.freeze({
    contract: 'DOOR_MIRRORLAND_ENVIRONMENT_v1',
    ready: true,
    reducedMotion: reduced,
    legacyMirrorlandRendererAdopted: false
  });
})();
