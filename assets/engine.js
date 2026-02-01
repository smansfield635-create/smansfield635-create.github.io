/* =========================================================
   Geodiametrics · Lens Controller
   Purpose: Toggle Human / Scientific language consistently
   Scope: ALL pages with lens buttons
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'gd_lens'; // persist choice

  function setLens(lens) {
    // Save choice
    try {
      localStorage.setItem(STORAGE_KEY, lens);
    } catch (e) {}

    // Toggle buttons
    document.querySelectorAll('.lens-switch').forEach(group => {
      group.querySelectorAll('button[data-lens]').forEach(btn => {
        const active = btn.dataset.lens === lens;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });

    // Toggle panels
    document.querySelectorAll('[data-lens-panel]').forEach(panel => {
      const match = panel.getAttribute('data-lens-panel') === lens;
      panel.style.display = match ? '' : 'none';
      panel.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
  }

  function initLens() {
    let lens = 'human';

    try {
      lens = localStorage.getItem(STORAGE_KEY) || lens;
    } catch (e) {}

    setLens(lens);

    // Wire all buttons
    document.querySelectorAll('button[data-lens]').forEach(btn => {
      btn.addEventListener('click', () => {
        setLens(btn.dataset.lens);
      });
    });
  }

  // Boot once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLens);
  } else {
    initLens();
  }
})();
