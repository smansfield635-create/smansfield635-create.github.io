(() => {
  'use strict';

  const CONTRACT = 'LAWS_CONTEXTUAL_READABLE_TABS_FOUR_MODEL_SPECIMEN_V1';
  const OBJECT_IDENTITY_INVARIANT = 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION';
  const INTERACTION_DOMAIN_INVARIANT = 'ORBIT_INPUT_DOMAIN_INTERSECT_FOCUSED_READER_INPUT_DOMAIN=EMPTY';
  const FOCUS_TRANSFORM_INVARIANT = 'FOCUS_START_IMPLIES_T_ORBIT_EQUALS_T_FROZEN_UNTIL_RETURN_TO_ORBIT';
  const ORBIT_DRAG_THRESHOLD = 8;
  const READ_AXIS_THRESHOLD = 12;
  const READ_TRAVERSE_THRESHOLD = 60;
  const space = document.querySelector('[data-context-space]');
  const field = document.querySelector('[data-context-field]');
  const tabs = [...document.querySelectorAll('[data-tab-object]')];
  const status = document.querySelector('[data-status]');
  if (!space || !field || tabs.length !== 4) return;

  const stableIdentity = new Map(tabs.map((tab) => [tab.dataset.tabObject, tab]));
  const suppressedClickTabs = new WeakSet();
  const state = {
    mode: 'ORBIT',
    rx: -2,
    ry: 0,
    roll: 0,
    zoom: 0,
    focused: null,
    focusFrozen: null,
    categories: new Map(tabs.map((tab) => [tab.dataset.tabObject, 'Practical'])),
    backgroundPointers: new Map(),
    fieldGesture: null,
    cardGesture: null,
    readGesture: null,
    lastGestureAxis: null
  };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const normalizeYaw = (degrees) => ((degrees % 360) + 360) % 360;
  const tabIndex = (tab) => tabs.indexOf(tab);
  const orbitSnapshot = () => Object.freeze({
    yaw: state.ry,
    pitch: state.rx,
    roll: state.roll,
    zoom: state.zoom
  });
  const orbitKey = (snapshot = orbitSnapshot()) => [snapshot.yaw, snapshot.pitch, snapshot.roll, snapshot.zoom].join('|');
  const focusOrbitInvariantHolds = () => state.mode !== 'FOCUS' || (!!state.focusFrozen && orbitKey() === orbitKey(state.focusFrozen));

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
    if (state.mode === 'ORBIT') {
      state.focusFrozen = orbitSnapshot();
      state.mode = 'FOCUS';
    }
    const previous = state.focused;
    state.focused = tab;
    state.cardGesture = null;
    state.backgroundPointers.clear();
    state.fieldGesture = null;
    space.classList.remove('is-dragging');
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

  const returnToOrbit = () => {
    if (state.mode !== 'FOCUS') return;
    if (state.focusFrozen) {
      state.ry = state.focusFrozen.yaw;
      state.rx = state.focusFrozen.pitch;
      state.roll = state.focusFrozen.roll;
      state.zoom = state.focusFrozen.zoom;
      applyField();
    }
    state.mode = 'ORBIT';
    state.focused = null;
    state.focusFrozen = null;
    state.readGesture = null;
    state.lastGestureAxis = null;
    space.classList.remove('has-focus', 'is-dragging');
    tabs.forEach((item) => {
      item.classList.remove('is-focused', 'is-receded');
      item.setAttribute('aria-current', 'false');
    });
    setStatus();
  };

  const focusAdjacent = (direction) => {
    if (state.mode !== 'FOCUS' || !state.focused) return;
    const current = tabIndex(state.focused);
    const next = (current + direction + tabs.length) % tabs.length;
    setFocused(tabs[next]);
  };

  const interactiveTarget = (event) => event.target.closest('[data-category-select],[data-return-orbit],details,summary,a,input,select,textarea');

  tabs.forEach((tab) => {
    tab.dataset.category = 'Practical';

    tab.addEventListener('click', (event) => {
      if (interactiveTarget(event)) return;
      event.stopPropagation();
      if (suppressedClickTabs.has(tab)) return;
      if (state.mode === 'ORBIT') setFocused(tab);
    });

    tab.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && state.mode === 'ORBIT' && event.target === tab) {
        event.preventDefault();
        setFocused(tab);
        return;
      }
      if (event.key === 'Escape' && state.mode === 'FOCUS') {
        event.preventDefault();
        event.stopPropagation();
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
      returnToOrbit();
    });
    returnButton?.addEventListener('pointerdown', (event) => event.stopPropagation());

    tab.querySelectorAll('details,summary').forEach((node) => {
      node.addEventListener('pointerdown', (event) => event.stopPropagation());
      node.addEventListener('click', (event) => event.stopPropagation());
    });

    tab.addEventListener('pointerdown', (event) => {
      if (interactiveTarget(event)) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      if (state.mode === 'ORBIT') {
        event.preventDefault();
        event.stopPropagation();
        state.cardGesture = {
          tab,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          x: event.clientX,
          y: event.clientY,
          cancelled: false
        };
        tab.setPointerCapture?.(event.pointerId);
        return;
      }

      if (state.mode !== 'FOCUS' || state.focused !== tab) return;
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
    }, { passive: false });

    tab.addEventListener('pointermove', (event) => {
      if (state.mode === 'ORBIT') {
        const gesture = state.cardGesture;
        if (!gesture || gesture.tab !== tab || gesture.pointerId !== event.pointerId) return;
        gesture.x = event.clientX;
        gesture.y = event.clientY;
        if (!gesture.cancelled && Math.hypot(gesture.x - gesture.startX, gesture.y - gesture.startY) >= ORBIT_DRAG_THRESHOLD) {
          gesture.cancelled = true;
        }
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const gesture = state.readGesture;
      if (!gesture || gesture.pointerId !== event.pointerId || state.focused !== tab) return;
      gesture.x = event.clientX;
      gesture.y = event.clientY;
      const dx = gesture.x - gesture.startX;
      const dy = gesture.y - gesture.startY;
      if (!gesture.axis && Math.hypot(dx, dy) >= READ_AXIS_THRESHOLD) {
        gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical';
        state.lastGestureAxis = gesture.axis;
      }
      if (gesture.axis === 'horizontal') {
        event.preventDefault();
        event.stopPropagation();
      }
    }, { passive: false });

    const endTabPointer = (event, platformCancelled = false) => {
      if (state.mode === 'ORBIT') {
        const gesture = state.cardGesture;
        if (!gesture || gesture.tab !== tab || gesture.pointerId !== event.pointerId) return;
        state.cardGesture = null;
        if (tab.hasPointerCapture?.(event.pointerId)) tab.releasePointerCapture?.(event.pointerId);
        suppressedClickTabs.add(tab);
        setTimeout(() => suppressedClickTabs.delete(tab), 0);
        event.preventDefault();
        event.stopPropagation();
        if (!gesture.cancelled && !platformCancelled) setFocused(tab);
        return;
      }

      const gesture = state.readGesture;
      if (!gesture || gesture.pointerId !== event.pointerId || state.focused !== tab) return;
      if (!platformCancelled) {
        const dx = gesture.x - gesture.startX;
        if (gesture.axis === 'horizontal' && Math.abs(dx) >= READ_TRAVERSE_THRESHOLD) {
          focusAdjacent(dx < 0 ? 1 : -1);
        }
      }
      state.readGesture = null;
      event.stopPropagation();
    };
    tab.addEventListener('pointerup', (event) => endTabPointer(event, false));
    tab.addEventListener('pointercancel', (event) => endTabPointer(event, true));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.mode === 'FOCUS') {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  const pointerPair = () => [...state.backgroundPointers.values()].slice(0, 2);
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  const beginFieldGesture = () => {
    const pair = pointerPair();
    if (pair.length === 2) {
      state.fieldGesture = {
        distance: distance(pair[0], pair[1]),
        angle: angle(pair[0], pair[1]),
        zoom: state.zoom,
        roll: state.roll
      };
    }
  };

  space.addEventListener('pointerdown', (event) => {
    if (state.mode !== 'ORBIT') return;
    if (event.target.closest('.context-tab')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    state.backgroundPointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      px: event.clientX,
      py: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      crossedThreshold: false
    });
    space.setPointerCapture?.(event.pointerId);
    space.classList.add('is-dragging');
    beginFieldGesture();
  });

  space.addEventListener('pointermove', (event) => {
    if (state.mode !== 'ORBIT') return;
    const p = state.backgroundPointers.get(event.pointerId);
    if (!p) return;
    p.x = event.clientX;
    p.y = event.clientY;
    if (state.backgroundPointers.size >= 2) {
      if (!state.fieldGesture) beginFieldGesture();
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

  const endBackgroundPointer = (event) => {
    const p = state.backgroundPointers.get(event.pointerId);
    if (!p) return;
    state.backgroundPointers.delete(event.pointerId);
    if (space.hasPointerCapture?.(event.pointerId)) space.releasePointerCapture?.(event.pointerId);
    if (state.backgroundPointers.size < 2) state.fieldGesture = null;
    if (state.backgroundPointers.size === 0) space.classList.remove('is-dragging');
  };
  space.addEventListener('pointerup', endBackgroundPointer);
  space.addEventListener('pointercancel', endBackgroundPointer);

  space.addEventListener('wheel', (event) => {
    if (state.mode !== 'ORBIT') return;
    event.preventDefault();
    state.zoom = clamp(state.zoom - event.deltaY * .22, -260, 360);
    applyField();
  }, { passive: false });

  space.addEventListener('dblclick', (event) => {
    if (state.mode === 'ORBIT' && !event.target.closest('.context-tab')) {
      state.rx = -2;
      state.ry = 0;
      state.roll = 0;
      state.zoom = 0;
      applyField();
    }
  });

  applyField();
  tabs.forEach((tab) => setCategory(tab, 'Practical'));
  setStatus();

  window.__LAWS_FOUR_TAB_SPECIMEN__ = Object.freeze({
    contract: CONTRACT,
    objectIdentityInvariant: OBJECT_IDENTITY_INVARIANT,
    interactionDomainInvariant: INTERACTION_DOMAIN_INVARIANT,
    focusTransformInvariant: FOCUS_TRANSFORM_INVARIANT,
    tabObjectCount: tabs.length,
    proxyObjectCount: 0,
    orbitDragThreshold: ORBIT_DRAG_THRESHOLD,
    orbitInputDomain: 'BACKGROUND_FIELD_ONLY',
    cardSurfaceOrbitDragAllowed: false,
    cardDragThresholdDisposition: 'CANCEL_AND_CONSUME_WITHOUT_ORBIT_MUTATION',
    focusExitLaw: 'RETURN_TO_ORBIT_CONTROL_ONLY',
    escapeMayExitFocus: false,
    yawLaw: 'THETA_Y_MOD_360_DEGREES',
    focusedAdjacencyLaw: 'MODULO_4_BIDIRECTIONAL',
    selectedModelIds: Object.freeze(tabs.map((tab) => tab.dataset.tabObject)),
    stableObjectCount: stableIdentity.size,
    snapshot: () => ({
      mode: state.mode,
      focused: state.focused?.dataset.tabObject || null,
      focusedIdentityStable: state.focused ? stableIdentity.get(state.focused.dataset.tabObject) === state.focused : true,
      category: state.focused ? state.categories.get(state.focused.dataset.tabObject) : null,
      categories: Object.fromEntries(state.categories),
      objectIdentities: tabs.map((tab) => tab.dataset.objectIdentity),
      lastGestureAxis: state.lastGestureAxis,
      backgroundOrbitPointerCount: state.backgroundPointers.size,
      cardGestureActive: !!state.cardGesture,
      orbitTransform: orbitSnapshot(),
      orbitTransformKey: orbitKey(),
      focusFrozen: state.focusFrozen ? { ...state.focusFrozen } : null,
      focusFrozenKey: state.focusFrozen ? orbitKey(state.focusFrozen) : null,
      focusOrbitInvariant: focusOrbitInvariantHolds(),
      rx: state.rx,
      ry: state.ry,
      roll: state.roll,
      zoom: state.zoom,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
    })
  });
})();
