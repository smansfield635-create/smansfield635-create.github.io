(() => {
  'use strict';
  const space = document.querySelector('[data-context-space]');
  const field = document.querySelector('[data-context-field]');
  const tabs = [...document.querySelectorAll('[data-tab-object]')];
  const status = document.querySelector('[data-status]');
  if (!space || !field || tabs.length !== 2) return;

  const state = { rx: -2, ry: 0, roll: 0, zoom: 0, focused: null, pointers: new Map(), gesture: null, dragged: false };
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const applyField = () => {
    document.documentElement.style.setProperty('--field-rx', `${state.rx.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-ry', `${state.ry.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-roll', `${state.roll.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-z', `${state.zoom.toFixed(1)}px`);
  };
  const setStatus = () => {
    status.textContent = state.focused ? `${state.focused.dataset.tabObject} · same surface in reading position` : 'Two readable surfaces · no proxy geometry';
  };
  const setFocused = (tab) => {
    state.focused = state.focused === tab ? null : tab;
    tabs.forEach((item) => {
      item.classList.toggle('is-focused', item === state.focused);
      item.classList.toggle('is-receded', Boolean(state.focused && item !== state.focused));
      item.setAttribute('aria-current', item === state.focused ? 'true' : 'false');
    });
    if (state.focused) state.focused.focus({ preventScroll: true });
    setStatus();
  };
  const restore = () => {
    state.focused = null;
    tabs.forEach((item) => { item.classList.remove('is-focused', 'is-receded'); item.setAttribute('aria-current', 'false'); });
    setStatus();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => { if (!state.dragged) setFocused(tab); event.stopPropagation(); });
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFocused(tab); }
      if (event.key === 'Escape') { event.preventDefault(); restore(); }
    });
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') restore(); });

  const pointerPair = () => [...state.pointers.values()].slice(0, 2);
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  const beginGesture = () => {
    const pair = pointerPair();
    if (pair.length === 2) state.gesture = { distance: distance(pair[0], pair[1]), angle: angle(pair[0], pair[1]), zoom: state.zoom, roll: state.roll };
  };

  space.addEventListener('pointerdown', (event) => {
    if (state.focused && event.target.closest('.context-tab') === state.focused && state.focused.scrollHeight > state.focused.clientHeight) return;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, px: event.clientX, py: event.clientY });
    space.setPointerCapture?.(event.pointerId);
    space.classList.add('is-dragging');
    state.dragged = false;
    beginGesture();
  });
  space.addEventListener('pointermove', (event) => {
    const p = state.pointers.get(event.pointerId);
    if (!p) return;
    p.x = event.clientX; p.y = event.clientY;
    if (state.pointers.size >= 2) {
      if (!state.gesture) beginGesture();
      const pair = pointerPair();
      const d = distance(pair[0], pair[1]);
      const a = angle(pair[0], pair[1]);
      state.zoom = clamp(state.gesture.zoom + (d - state.gesture.distance) * 1.25, -260, 360);
      state.roll = clamp(state.gesture.roll + (a - state.gesture.angle), -18, 18);
      state.dragged = true;
    } else {
      const dx = p.x - p.px; const dy = p.y - p.py;
      if (Math.abs(dx) + Math.abs(dy) > 1) state.dragged = true;
      state.ry = clamp(state.ry + dx * .14, -42, 42);
      state.rx = clamp(state.rx - dy * .11, -24, 24);
    }
    p.px = p.x; p.py = p.y;
    applyField();
  });
  const endPointer = (event) => {
    state.pointers.delete(event.pointerId);
    if (state.pointers.size < 2) state.gesture = null;
    if (state.pointers.size === 0) {
      space.classList.remove('is-dragging');
      setTimeout(() => { state.dragged = false; }, 0);
    }
  };
  space.addEventListener('pointerup', endPointer);
  space.addEventListener('pointercancel', endPointer);
  space.addEventListener('wheel', (event) => { event.preventDefault(); state.zoom = clamp(state.zoom - event.deltaY * .22, -260, 360); applyField(); }, { passive: false });
  space.addEventListener('dblclick', (event) => { if (!event.target.closest('.context-tab')) { restore(); state.rx = -2; state.ry = 0; state.roll = 0; state.zoom = 0; applyField(); } });

  applyField();
  setStatus();
  window.__LAWS_READABLE_TABS_SPECIMEN__ = {
    contract: 'LAWS_CONTEXTUAL_READABLE_TABS_TWO_EQUATION_SPECIMEN_V1',
    tabObjectCount: tabs.length,
    proxyObjectCount: 0,
    selectedModelIds: tabs.map((tab) => tab.dataset.tabObject),
    snapshot: () => ({ focused: state.focused?.dataset.tabObject || null, rx: state.rx, ry: state.ry, roll: state.roll, zoom: state.zoom })
  };
})();
