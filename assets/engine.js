/* engine.js — single source of truth for:
   (1) accordion toggles (data-acc)
   (2) lens toggles (data-lens-root)
   No dependencies.
*/

(function () {
  function qs(root, sel) { return Array.from((root || document).querySelectorAll(sel)); }

  // ---------- Accordion ----------
  function initAccordions(scope) {
    qs(scope, '[data-acc]').forEach(acc => {
      const head = acc.querySelector('[data-acc-head]');
      const body = acc.querySelector('[data-acc-body]');
      if (!head || !body) return;

      // default state
      const wantsOpen = (acc.getAttribute('data-acc-default') || '').toLowerCase() === 'open';
      acc.dataset.accOpen = wantsOpen ? '1' : '0';

      function apply() {
        const open = acc.dataset.accOpen === '1';
        body.style.display = open ? '' : 'none';
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      // ensure button semantics
      head.setAttribute('type', 'button');
      head.setAttribute('aria-expanded', 'false');

      // click
      head.addEventListener('click', () => {
        acc.dataset.accOpen = (acc.dataset.accOpen === '1') ? '0' : '1';
        apply();
      });

      apply();
    });
  }

  // ---------- Lens (Human / Scientific) ----------
  function initLens(scope) {
    qs(scope, '[data-lens-root]').forEach(root => {
      const defaultLens = (root.getAttribute('data-lens-default') || 'human').toLowerCase();

      const btns = qs(root, '[data-lens-btn]');
      const panels = qs(root, '[data-lens-panel]');

      if (!btns.length || !panels.length) return;

      function setLens(lens) {
        const L = (lens || defaultLens).toLowerCase();

        // buttons
        btns.forEach(b => {
          const isOn = (b.getAttribute('data-lens-btn') || '').toLowerCase() === L;
          b.classList.toggle('primary', isOn);
          b.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        });

        // panels
        panels.forEach(p => {
          const isOn = (p.getAttribute('data-lens-panel') || '').toLowerCase() === L;
          p.style.display = isOn ? '' : 'none';
        });
      }

      // bind
      btns.forEach(b => {
        b.setAttribute('type', 'button');
        b.addEventListener('click', () => setLens(b.getAttribute('data-lens-btn')));
      });

      // initial
      setLens(defaultLens);
    });
  }

  // ---------- Boot ----------
  function boot() {
    initAccordions(document);
    initLens(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
