(() => {
  'use strict';

  const CONTRACT = 'LAWS_CONTEXTUAL_READABLE_TABS_FOUR_MODEL_SPECIMEN_V1';
  const OBJECT_IDENTITY_INVARIANT = 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION';
  const ORBIT_DRAG_THRESHOLD = 8;
  const space = document.querySelector('[data-context-space]');
  const field = document.querySelector('[data-context-field]');
  const tabs = [...document.querySelectorAll('[data-tab-object]')];
  const status = document.querySelector('[data-status]');
  if (!space || !field || tabs.length !== 4) return;

  const stableIdentity = new Map(tabs.map((tab) => [tab.dataset.tabObject, tab]));
  const state = {
    rx: -2, ry: 0, roll: 0, zoom: 0,
    focused: null,
    categories: new Map(tabs.map((tab) => [tab.dataset.tabObject, 'Practical'])),
    pointers: new Map(),
    fieldGesture: null,
    dragged: false,
    orbitClickSuppressed: false,
    readGesture: null,
    lastGestureAxis: null
  };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const normalizeYaw = (degrees) => ((degrees % 360) + 360) % 360;
  const tabIndex = (tab) => tabs.indexOf(tab);
  const applyField = () => {
    document.documentElement.style.setProperty('--field-rx', `${state.rx.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-ry', `${state.ry.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--counter-ry', `${(-state.ry).toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-roll', `${state.roll.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--field-z', `${state.zoom.toFixed(1)}px`);
  };
  const setStatus = () => {
    if (state.focused) {
      const id = state.focused.dataset.tabObject;
      status.textContent = `${id} · same Euclidean object · ${state.categories.get(id)}`;
    } else {
      status.textContent = 'Four readable surfaces · zero proxy geometry';
    }
  };

  const setCategory = (tab, category) => {
    const id = tab.dataset.tabObject;
    if (!['Practical', 'Engineering', 'Evidence', 'Information'].includes(category)) return;
    state.categories.set(id, category);
    tab.querySelectorAll('[data-category-select]').forEach((button) => {
      button.setAttribute('aria-selected', button.dataset.categorySelect === category ? 'true' : 'false');
    });
    tab.querySelectorAll('[data-category-panel]').forEach((panel) => {
      const active = panel.dataset.categoryPanel === category;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    tab.dataset.category = category;
    setStatus();
  };

  const setFocused = (tab, { preserveScroll = false } = {}) => {
    if (!tab) return;
    const previous = state.focused;
    state.focused = tab;
    space.classList.add('has-focus');
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-focused', active);
      item.classList.toggle('is-receded', !active);
      item.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (!preserveScroll || previous !== tab) tab.scrollTop = 0;
    tab.focus({ preventScroll: true });
    setStatus();
  };

  const restore = () => {
    state.focused = null;
    state.readGesture = null;
    state.lastGestureAxis = null;
    space.classList.remove('has-focus');
    tabs.forEach((item) => {
      item.classList.remove('is-focused', 'is-receded');
      item.setAttribute('aria-current', 'false');
    });
    setStatus();
  };

  const focusAdjacent = (direction) => {
    if (!state.focused) return;
    const current = tabIndex(state.focused);
    const next = (current + direction + tabs.length) % tabs.length;
    setFocused(tabs[next]);
  };

  tabs.forEach((tab) => {
    tab.dataset.category = 'Practical';

    tab.addEventListener('click', (event) => {
      if (event.target.closest('[data-category-select],[data-return-orbit],details,summary,a,input,select,textarea')) return;
      if (!state.orbitClickSuppressed && !state.dragged && state.focused !== tab) setFocused(tab);
      event.stopPropagation();
    });

    tab.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && state.focused !== tab && event.target === tab) {
        event.preventDefault();
        setFocused(tab);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        restore();
      }
    });

    tab.querySelectorAll('[data-category-select]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setCategory(tab, button.dataset.categorySelect);
      });
      button.addEventListener('pointerdown', (event) => event.stopPropagation());
    });

    const returnButton = tab.querySelector('[data-return-orbit]');
    returnButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      restore();
    });
    returnButton?.addEventListener('pointerdown', (event) => event.stopPropagation());

    tab.querySelectorAll('details,summary').forEach((node) => {
      node.addEventListener('pointerdown', (event) => event.stopPropagation());
      node.addEventListener('click', (event) => event.stopPropagation());
    });

    tab.addEventListener('pointerdown', (event) => {
      if (state.focused !== tab) return;
      if (event.target.closest('[data-category-select],[data-return-orbit],details,summary,a,input,select,textarea')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      state.readGesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: event.clientX,
        y: event.clientY,
        axis: null
      };
      state.lastGestureAxis = null;
      event.stopPropagation();
    });

    tab.addEventListener('pointermove', (event) => {
      const gesture = state.readGesture;
      if (!gesture || gesture.pointerId !== event.pointerId || state.focused !== tab) return;
      gesture.x = event.clientX;
      gesture.y = event.clientY;
      const dx = gesture.x - gesture.startX;
      const dy = gesture.y - gesture.startY;
      if (!gesture.axis && Math.hypot(dx, dy) >= 12) {
        gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical';
        state.lastGestureAxis = gesture.axis;
      }
      if (gesture.axis === 'horizontal') {
        event.preventDefault();
        event.stopPropagation();
      }
    }, { passive: false });

    const endReadGesture = (event) => {
      const gesture = state.readGesture;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const dx = gesture.x - gesture.startX;
      if (gesture.axis === 'horizontal' && Math.abs(dx) >= 60) {
        focusAdjacent(dx < 0 ? 1 : -1);
      }
      state.readGesture = null;
      event.stopPropagation();
    };
    tab.addEventListener('pointerup', endReadGesture);
    tab.addEventListener('pointercancel', endReadGesture);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') restore();
  });

  const pointerPair = () => [...state.pointers.values()].slice(0, 2);
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  const markOrbitDrag = () => {
    state.dragged = true;
    state.orbitClickSuppressed = true;
    state.pointers.forEach((pointer) => { pointer.crossedThreshold = true; });
  };
  const beginFieldGesture = () => {
    const pair = pointerPair();
    if (pair.length === 2) {
      markOrbitDrag();
      state.fieldGesture = {
        distance: distance(pair[0], pair[1]),
        angle: angle(pair[0], pair[1]),
        zoom: state.zoom,
        roll: state.roll
      };
    }
  };

  space.addEventListener('pointerdown', (event) => {
    if (state.focused) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const targetTab = event.target.closest('.context-tab');
    state.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      px: event.clientX,
      py: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      crossedThreshold: false,
      targetTab
    });
    space.setPointerCapture?.(event.pointerId);
    space.classList.add('is-dragging');
    if (state.pointers.size === 1) {
      state.dragged = false;
      state.orbitClickSuppressed = true;
    }
    beginFieldGesture();
  });

  space.addEventListener('pointermove', (event) => {
    if (state.focused) return;
    const p = state.pointers.get(event.pointerId);
    if (!p) return;
    p.x = event.clientX;
    p.y = event.clientY;
    if (state.pointers.size >= 2) {
      if (!state.fieldGesture) beginFieldGesture();
      markOrbitDrag();
      const pair = pointerPair();
      const d = distance(pair[0], pair[1]);
      const a = angle(pair[0], pair[1]);
      state.zoom = clamp(state.fieldGesture.zoom + (d - state.fieldGesture.distance) * 1.25, -260, 360);
      state.roll = clamp(state.fieldGesture.roll + (a - state.fieldGesture.angle), -18, 18);
    } else {
      const totalDx = p.x - p.startX;
      const totalDy = p.y - p.startY;
      if (!p.crossedThreshold && Math.hypot(totalDx, totalDy) >= ORBIT_DRAG_THRESHOLD) {
        p.crossedThreshold = true;
        state.dragged = true;
        state.orbitClickSuppressed = true;
      }
      if (p.crossedThreshold) {
        const dx = p.x - p.px;
        const dy = p.y - p.py;
        state.ry = normalizeYaw(state.ry + dx * .14);
        state.rx = clamp(state.rx - dy * .11, -24, 24);
      }
    }
    p.px = p.x;
    p.py = p.y;
    applyField();
  });

  const endFieldPointer = (event) => {
    const p = state.pointers.get(event.pointerId);
    if (!p) return;
    const wasLastPointer = state.pointers.size === 1;
    const shouldFocusTouchedTab = wasLastPointer && !p.crossedThreshold && p.targetTab instanceof Element;
    if (p.crossedThreshold) state.orbitClickSuppressed = true;
    state.pointers.delete(event.pointerId);
    if (space.hasPointerCapture?.(event.pointerId)) space.releasePointerCapture?.(event.pointerId);
    if (state.pointers.size < 2) state.fieldGesture = null;
    if (state.pointers.size === 0) {
      space.classList.remove('is-dragging');
      const focusTarget = shouldFocusTouchedTab ? p.targetTab : null;
      setTimeout(() => {
        if (focusTarget) setFocused(focusTarget);
        state.dragged = false;
        state.orbitClickSuppressed = false;
      }, 0);
    }
  };
  space.addEventListener('pointerup', endFieldPointer);
  space.addEventListener('pointercancel', endFieldPointer);

  space.addEventListener('wheel', (event) => {
    if (state.focused) return;
    event.preventDefault();
    state.zoom = clamp(state.zoom - event.deltaY * .22, -260, 360);
    applyField();
  }, { passive: false });

  space.addEventListener('dblclick', (event) => {
    if (!state.focused && !event.target.closest('.context-tab')) {
      state.rx = -2; state.ry = 0; state.roll = 0; state.zoom = 0;
      applyField();
    }
  });

  applyField();
  tabs.forEach((tab) => setCategory(tab, 'Practical'));
  setStatus();

  window.__LAWS_FOUR_TAB_SPECIMEN__ = Object.freeze({
    contract: CONTRACT,
    objectIdentityInvariant: OBJECT_IDENTITY_INVARIANT,
    tabObjectCount: tabs.length,
    proxyObjectCount: 0,
    orbitDragThreshold: ORBIT_DRAG_THRESHOLD,
    yawLaw: 'THETA_Y_MOD_360_DEGREES',
    focusedAdjacencyLaw: 'MODULO_4_BIDIRECTIONAL',
    selectedModelIds: Object.freeze(tabs.map((tab) => tab.dataset.tabObject)),
    stableObjectCount: stableIdentity.size,
    snapshot: () => ({
      focused: state.focused?.dataset.tabObject || null,
      focusedIdentityStable: state.focused ? stableIdentity.get(state.focused.dataset.tabObject) === state.focused : true,
      category: state.focused ? state.categories.get(state.focused.dataset.tabObject) : null,
      categories: Object.fromEntries(state.categories),
      objectIdentities: tabs.map((tab) => tab.dataset.objectIdentity),
      lastGestureAxis: state.lastGestureAxis,
      orbitPointerCount: state.pointers.size,
      orbitClickSuppressed: state.orbitClickSuppressed,
      rx: state.rx, ry: state.ry, roll: state.roll, zoom: state.zoom,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
    })
  });
})();
