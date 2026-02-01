(() => {
  "use strict";

  function qs(root, sel) { return root.querySelector(sel); }
  function qsa(root, sel) { return Array.from(root.querySelectorAll(sel)); }

  function setActiveTab(tabsRoot, value) {
    const buttons = qsa(tabsRoot, '[data-tab]');
    const panels = qsa(tabsRoot, '[data-panel]');

    buttons.forEach((b) => {
      const on = b.getAttribute('data-tab') === value;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('tabindex', on ? '0' : '-1');
    });

    panels.forEach((p) => {
      const on = p.getAttribute('data-panel') === value;
      p.hidden = !on;
    });

    // Optional: persist per-page
    const key = tabsRoot.getAttribute('data-tabs-key');
    if (key) {
      try { localStorage.setItem(`gd.tabs.${key}`, value); } catch (_) {}
    }
  }

  function initTabs(tabsRoot) {
    // Determine default
    let value = tabsRoot.getAttribute('data-default') || 'human';

    // Optional: restore
    const key = tabsRoot.getAttribute('data-tabs-key');
    if (key) {
      try {
        const saved = localStorage.getItem(`gd.tabs.${key}`);
        if (saved) value = saved;
      } catch (_) {}
    }

    // If URL has ?lens=scientific
    try {
      const url = new URL(window.location.href);
      const param = url.searchParams.get('lens');
      if (param && (param === 'human' || param === 'scientific' || param === 'software')) {
        value = param;
      }
    } catch (_) {}

    // Ensure buttons behave
    qsa(tabsRoot, '[data-tab]').forEach((b) => {
      b.setAttribute('role', 'tab');
      b.setAttribute('type', 'button');
      if (!b.hasAttribute('aria-selected')) b.setAttribute('aria-selected', 'false');
    });

    // Set initial state
    setActiveTab(tabsRoot, value);
  }

  function onClick(e) {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;

    const tabsRoot = btn.closest('[data-tabs]');
    if (!tabsRoot) return;

    e.preventDefault();
    const value = btn.getAttribute('data-tab');
    if (!value) return;

    setActiveTab(tabsRoot, value);
  }

  function onKeydown(e) {
    const activeBtn = e.target.closest('[data-tab]');
    if (!activeBtn) return;

    const tabsRoot = activeBtn.closest('[data-tabs]');
    if (!tabsRoot) return;

    const buttons = qsa(tabsRoot, '[data-tab]');
    const idx = buttons.indexOf(activeBtn);
    if (idx < 0) return;

    const key = e.key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

    e.preventDefault();

    let nextIdx = idx;
    if (key === 'ArrowLeft') nextIdx = Math.max(0, idx - 1);
    if (key === 'ArrowRight') nextIdx = Math.min(buttons.length - 1, idx + 1);
    if (key === 'Home') nextIdx = 0;
    if (key === 'End') nextIdx = buttons.length - 1;

    const nextBtn = buttons[nextIdx];
    nextBtn.focus();
    setActiveTab(tabsRoot, nextBtn.getAttribute('data-tab'));
  }

  function boot() {
    // Init all tab sets
    qsa(document, '[data-tabs]').forEach(initTabs);

    // One event delegation for the whole site
    document.addEventListener('click', onClick, { passive: false });
    document.addEventListener('keydown', onKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
