/* EXPLORE_EXPEDITION_ENVIRONMENT_v1 */
(() => {
  "use strict";
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const object = document.querySelector('[data-explore-expedition]');
  const lens = document.querySelector('[data-explore-lens]');
  if (!hero || !object || !lens) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

  const setLens = (x, y) => {
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    root.style.setProperty('--explore-lens-x', `${clamp(x, 24, 78)}%`);
    root.style.setProperty('--explore-lens-y', `${clamp(y, 22, 70)}%`);
  };

  if (!reduced && !coarse) {
    object.addEventListener('pointermove', (event) => {
      const rect = object.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setLens(x, y);
    }, { passive: true });
    object.addEventListener('pointerleave', () => setLens(66, 41), { passive: true });
  } else if (!reduced) {
    let phase = 0;
    const sweep = () => {
      phase += 1;
      if (phase === 1) setLens(58, 44);
      if (phase === 2) setLens(70, 35);
      if (phase === 3) setLens(66, 41);
    };
    setTimeout(sweep, 420);
    setTimeout(sweep, 1120);
    setTimeout(sweep, 1880);
  }

  object.dataset.exploreExpeditionReady = 'true';
  object.dataset.exploreLensMode = reduced ? 'fixed-reduced-motion' : (coarse ? 'intro-sweep-touch' : 'pointer-follow');
  window.DGBExploreEnvironment = Object.freeze({
    contract: 'EXPLORE_EXPEDITION_ENVIRONMENT_v1',
    ready: true,
    reducedMotion: reduced,
    inputMode: coarse ? 'coarse' : 'fine'
  });
})();
