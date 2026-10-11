(() => {
  'use strict';

  const CONTRACT = 'LAWS_CONTEXTUAL_READABLE_TABS_FOUR_MODEL_EUCLIDEAN_CAROUSEL_R1_R2_V1';
  const OBJECT_IDENTITY_INVARIANT = 'ORBIT=FOCUS=SCROLL=PRACTICAL=ENGINEERING=EVIDENCE=INFORMATION';
  const GEOMETRY_INVARIANT = 'THETA_N_EQUALS_THETA_WHEEL_PLUS_PHI_N';
  const PAIRWISE_INVARIANT = 'THETA_N_MINUS_THETA_M_EQUALS_PHI_N_MINUS_PHI_M';
  const FOCUS_INVARIANT = 'FOCUS_START_IMPLIES_THETA_WHEEL_EQUALS_THETA_FROZEN_UNTIL_RETURN_TO_ORBIT';
  const FOCUS_EXIT_LAW = 'RETURN_TO_ORBIT_CONTROL_ONLY';
  const CARD_ORIGIN_LAW = 'CARD_MOVEMENT_AT_OR_ABOVE_8PX_DOES_NOT_MUTATE_THETA_WHEEL';
  const MINIMAL_CUE = 'Rotate to browse · Tap to read';
  const TAP_DRAG_THRESHOLD = 8;
  const PHI = Object.freeze([0, 90, 180, 270]);
  const INITIAL_THETA = -18;

  const space = document.querySelector('[data-context-space]');
  const field = document.querySelector('[data-context-field]');
  const tabs = [...document.querySelectorAll('[data-tab-object]')];
  const status = document.querySelector('[data-status]');
  const cue = document.querySelector('.instruction');
  if (!space || !field || tabs.length !== 4) return;

  const stableIdentity = new Map(tabs.map((tab) => [tab.dataset.tabObject, tab]));
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  const state = {
    mode: 'ORBIT',
    thetaWheel: INITIAL_THETA,
    focused: null,
    focusFrozen: null,
    gesture: null,
    suppressClickUntil: 0,
    categories: new Map(tabs.map((tab) => [tab.dataset.tabObject, 'Practical'])),
    radius: 0,
    fieldTop: 0,
    focusedMaxWidth: 0,
    focusedMaxHeight: 0
  };

  const dynamicStyle = document.createElement('style');
  dynamicStyle.dataset.euclideanCarouselRuntime = 'r1-r2';
  dynamicStyle.textContent = `
    .instruction.carousel-cue{display:inline-flex;align-items:center;width:auto;max-width:max-content;margin:9px 0 0;padding:5px 9px;border:1px solid rgba(217,180,98,.22);border-radius:999px;background:rgba(2,6,16,.58);color:rgba(196,204,210,.84);font-size:11px;line-height:1.15;letter-spacing:.02em;transition:opacity .28s ease,border-color .28s ease;pointer-events:none}
    .instruction.carousel-cue.is-used{opacity:.34;border-color:rgba(217,180,98,.1)}
    .context-space{touch-action:none!important}
    .context-space.has-focus{touch-action:pan-y!important}
    .context-field{display:block!important;padding:0!important;transform:var(--carousel-field-transform)!important;transform-style:preserve-3d!important}
    .context-tab{transform:var(--carousel-transform)!important;transform-origin:0 0!important;touch-action:none!important;will-change:transform,opacity}
    .context-tab.is-focused{width:min(760px,var(--focused-max-width))!important;max-width:var(--focused-max-width)!important;max-height:var(--focused-max-height)!important;transform:var(--carousel-transform)!important;touch-action:pan-y!important}
    .context-tab.is-receded{transform:var(--carousel-transform)!important}
    .context-space.is-dragging .context-tab{transition:none!important}
    @media(prefers-reduced-motion:reduce){
      html,body{overflow:hidden!important}
      body{min-height:100dvh!important}
      .specimen{min-height:100dvh!important;overflow:hidden!important}
      .specimen-heading{position:fixed!important;top:max(14px,env(safe-area-inset-top))!important;left:18px!important;right:18px!important;padding:0!important;max-width:800px!important}
      .context-space{position:absolute!important;inset:0!important;overflow:hidden!important;perspective:1050px!important;touch-action:none!important}
      .context-space.has-focus{touch-action:pan-y!important}
      .context-field{position:absolute!important;left:50%!important;width:0!important;height:0!important;display:block!important;padding:0!important;transform:var(--carousel-field-transform)!important;transform-style:preserve-3d!important;transition:none!important}
      .context-tab,#tab-collapse-qualified,#tab-pcr,#tab-mass-ledger,#tab-first,.context-tab.is-focused,.context-tab.is-receded{position:absolute!important;left:0!important;top:0!important;margin:0!important;max-width:var(--focused-max-width)!important;transform:var(--carousel-transform)!important;transform-style:preserve-3d!important;transition:none!important}
      .context-tab.is-focused{width:min(760px,var(--focused-max-width))!important;max-height:var(--focused-max-height)!important;cursor:default!important;touch-action:pan-y!important}
      .context-tab.is-receded{pointer-events:none!important}
    }
  `;
  document.head.appendChild(dynamicStyle);

  if (cue) {
    cue.textContent = MINIMAL_CUE;
    cue.classList.add('carousel-cue');
  }

  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
  const wheelSnapshot = () => Object.freeze({ thetaWheel: state.thetaWheel });
  const focusInvariantHolds = () => state.mode !== 'FOCUS' || (!!state.focusFrozen && state.thetaWheel === state.focusFrozen.thetaWheel);

  const computeEnvelope = () => {
    const width = Math.max(320, window.innerWidth || 320);
    const height = Math.max(520, window.innerHeight || 520);
    state.radius = width <= 520
      ? clamp(width * 0.62, 205, 280)
      : width <= 900
        ? clamp(width * 0.47, 300, 390)
        : clamp(width * 0.36, 390, 520);
    state.fieldTop = width <= 760 ? Math.min(height * 0.65, height - 230) : width <= 900 ? height * 0.60 : height * 0.57;
    state.focusedMaxWidth = Math.max(280, width - (width <= 760 ? 28 : width <= 900 ? 36 : 48));
    const topSafe = width <= 760 ? Math.max(118, height * 0.15) : width <= 900 ? Math.max(126, height * 0.12) : Math.max(110, height * 0.10);
    const bottomSafe = width <= 760 ? 18 : 24;
    const symmetricHeight = 2 * Math.max(180, Math.min(state.fieldTop - topSafe, height - bottomSafe - state.fieldTop));
    state.focusedMaxHeight = Math.floor(Math.min(width <= 760 ? height * 0.64 : width <= 900 ? height * 0.72 : 780, symmetricHeight - 8));
    field.style.top = `${state.fieldTop.toFixed(1)}px`;
    document.documentElement.style.setProperty('--focused-max-width', `${state.focusedMaxWidth.toFixed(1)}px`);
    document.documentElement.style.setProperty('--focused-max-height', `${state.focusedMaxHeight.toFixed(1)}px`);
  };

  const orbitTransformFor = (index) => `rotateY(${PHI[index]}deg) translateZ(${state.radius.toFixed(1)}px) translate(-50%,-50%)`;
  const focusedTransform = () => `rotateY(${(-state.thetaWheel).toFixed(4)}deg) translateZ(0px) translate(-50%,-50%)`;

  const applyGeometry = () => {
    field.style.setProperty('--carousel-field-transform', `rotateX(-2deg) rotateY(${state.thetaWheel.toFixed(4)}deg)`);
    tabs.forEach((tab, index) => {
      const transform = state.mode === 'FOCUS' && state.focused === tab ? focusedTransform() : orbitTransformFor(index);
      tab.style.setProperty('--carousel-transform', transform);
      tab.dataset.phi = String(PHI[index]);
      tab.dataset.theta = String(state.thetaWheel + PHI[index]);
    });
  };

  const markCueUsed = () => cue?.classList.add('is-used');
  const setStatus = () => {
    if (!status) return;
    status.textContent = state.focused
      ? `${state.focused.dataset.tabObject} · same Euclidean object · ${state.categories.get(state.focused.dataset.tabObject)} · carousel frozen`
      : `Four surfaces · shared Y axis · θ ${state.thetaWheel.toFixed(1)}°`;
  };

  const setCategory = (tab, category) => {
    if (!['Practical', 'Engineering', 'Evidence', 'Information'].includes(category)) return;
    const id = tab.dataset.tabObject;
    state.categories.set(id, category);
    tab.querySelectorAll('[data-category-select]').forEach((button) => button.setAttribute('aria-selected', button.dataset.categorySelect === category ? 'true' : 'false'));
    tab.querySelectorAll('[data-category-panel]').forEach((panel) => {
      const active = panel.dataset.categoryPanel === category;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    tab.dataset.category = category;
    setStatus();
  };

  const enterFocus = (tab) => {
    if (!tab || state.mode !== 'ORBIT') return;
    state.focusFrozen = wheelSnapshot();
    state.mode = 'FOCUS';
    state.focused = tab;
    state.gesture = null;
    space.classList.remove('is-dragging');
    space.classList.add('has-focus');
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-focused', active);
      item.classList.toggle('is-receded', !active);
      item.setAttribute('aria-current', active ? 'true' : 'false');
    });
    tab.scrollTop = 0;
    applyGeometry();
    tab.focus({ preventScroll: true });
    setStatus();
  };

  const returnToOrbit = () => {
    if (state.mode !== 'FOCUS') return;
    if (state.focusFrozen) state.thetaWheel = state.focusFrozen.thetaWheel;
    state.mode = 'ORBIT';
    state.focused = null;
    state.focusFrozen = null;
    state.gesture = null;
    space.classList.remove('has-focus', 'is-dragging');
    tabs.forEach((item) => {
      item.classList.remove('is-focused', 'is-receded');
      item.setAttribute('aria-current', 'false');
    });
    applyGeometry();
    setStatus();
  };

  tabs.forEach((tab) => {
    tab.dataset.category = 'Practical';
    tab.querySelectorAll('[data-category-select]').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (state.mode === 'FOCUS' && state.focused === tab) setCategory(tab, button.dataset.categorySelect);
    }));
    tab.querySelector('[data-return-orbit]')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      returnToOrbit();
    });
    tab.addEventListener('keydown', (event) => {
      if (state.mode === 'ORBIT' && event.target === tab && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        enterFocus(tab);
      }
      if (state.mode === 'FOCUS' && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });

  const frontDistance = (index) => {
    const raw = ((state.thetaWheel + PHI[index] + 180) % 360 + 360) % 360 - 180;
    return Math.abs(raw);
  };
  const pickVisibleTabAtPoint = (x, y) => {
    const candidates = tabs
      .map((tab, index) => ({ tab, rect: tab.getBoundingClientRect(), frontDistance: frontDistance(index) }))
      .filter(({ rect, frontDistance }) => frontDistance <= 100 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
      .sort((a, b) => a.frontDistance - b.frontDistance);
    return candidates[0]?.tab || null;
  };

  const beginOrbitGesture = (event) => {
    if (state.mode !== 'ORBIT') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const touchedTab = event.target.closest?.('[data-tab-object]') || pickVisibleTabAtPoint(event.clientX, event.clientY);
    state.gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      appliedPrimary: 0,
      axis: null,
      moved: false,
      touchedTab,
      inputDomain: touchedTab ? 'CARD' : 'BACKGROUND'
    };
    space.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };

  const moveOrbitGesture = (event) => {
    if (state.mode !== 'ORBIT') return;
    const gesture = state.gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const totalDx = event.clientX - gesture.startX;
    const totalDy = event.clientY - gesture.startY;
    const distance = Math.hypot(totalDx, totalDy);
    if (!gesture.moved && distance >= TAP_DRAG_THRESHOLD) {
      gesture.moved = true;
      gesture.axis = Math.abs(totalDx) >= Math.abs(totalDy) ? 'horizontal' : 'vertical';
      markCueUsed();
      if (gesture.inputDomain === 'BACKGROUND') space.classList.add('is-dragging');
    }
    if (gesture.moved && gesture.inputDomain === 'BACKGROUND') {
      const primary = gesture.axis === 'horizontal' ? totalDx : -totalDy;
      const delta = primary - gesture.appliedPrimary;
      gesture.appliedPrimary = primary;
      state.thetaWheel += delta * 0.22;
      applyGeometry();
      setStatus();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const endOrbitGesture = (event, cancelled = false) => {
    const gesture = state.gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    state.gesture = null;
    space.classList.remove('is-dragging');
    if (space.hasPointerCapture?.(event.pointerId)) space.releasePointerCapture?.(event.pointerId);
    state.suppressClickUntil = performance.now() + 420;
    event.preventDefault();
    event.stopPropagation();
    if (!cancelled && !gesture.moved && gesture.touchedTab) enterFocus(gesture.touchedTab);
  };

  space.addEventListener('pointerdown', beginOrbitGesture, { capture: true, passive: false });
  space.addEventListener('pointermove', moveOrbitGesture, { capture: true, passive: false });
  space.addEventListener('pointerup', (event) => endOrbitGesture(event, false), { capture: true, passive: false });
  space.addEventListener('pointercancel', (event) => endOrbitGesture(event, true), { capture: true, passive: false });

  space.addEventListener('click', (event) => {
    if (performance.now() < state.suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (state.mode === 'ORBIT' && event.target.closest?.('[data-tab-object]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  space.addEventListener('wheel', (event) => {
    if (state.mode !== 'ORBIT') return;
    event.preventDefault();
    const modeScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? Math.max(320, window.innerHeight) : 1;
    const px = clamp((Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * modeScale, -260, 260);
    state.thetaWheel += px * 0.10;
    markCueUsed();
    applyGeometry();
    setStatus();
  }, { passive: false });

  document.addEventListener('keydown', (event) => {
    if (state.mode === 'FOCUS' && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (state.mode !== 'ORBIT') return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      state.thetaWheel += event.key === 'ArrowLeft' ? -18 : 18;
      markCueUsed();
      applyGeometry();
      setStatus();
    }
  }, true);

  window.addEventListener('resize', () => {
    computeEnvelope();
    applyGeometry();
  }, { passive: true });

  tabs.forEach((tab) => setCategory(tab, 'Practical'));
  computeEnvelope();
  applyGeometry();
  setStatus();

  const angles = () => PHI.map((phi) => state.thetaWheel + phi);
  const pairwiseSpacingInvariant = () => {
    const theta = angles();
    for (let n = 0; n < theta.length; n += 1) {
      for (let m = 0; m < theta.length; m += 1) {
        if (Math.abs(((theta[n] - theta[m]) - (PHI[n] - PHI[m]))) > 1e-9) return false;
      }
    }
    return true;
  };

  window.__LAWS_EUCLIDEAN_CAROUSEL__ = Object.freeze({
    contract: CONTRACT,
    objectIdentityInvariant: OBJECT_IDENTITY_INVARIANT,
    geometryInvariant: GEOMETRY_INVARIANT,
    pairwiseInvariant: PAIRWISE_INVARIANT,
    focusInvariant: FOCUS_INVARIANT,
    focusExitLaw: FOCUS_EXIT_LAW,
    cardOriginLaw: CARD_ORIGIN_LAW,
    sharedAxis: 'Y',
    tabObjectCount: tabs.length,
    proxyObjectCount: 0,
    fixedAngularOffsets: PHI,
    tapDragThreshold: TAP_DRAG_THRESHOLD,
    orbitPointerInputDomain: 'BACKGROUND_EMPTY_FIELD_ONLY',
    pageSurfaceCarouselDragAllowed: false,
    wheelScrollRotatesCarousel: true,
    thetaWheelIsUnbounded: true,
    reducedMotion,
    selectedModelIds: Object.freeze(tabs.map((tab) => tab.dataset.tabObject)),
    stableObjectCount: stableIdentity.size,
    angles,
    pairwiseSpacingInvariant,
    focusCarouselInvariantHolds: focusInvariantHolds,
    snapshot: () => Object.freeze({
      mode: state.mode,
      thetaWheel: state.thetaWheel,
      focusedId: state.focused?.dataset.tabObject || null,
      focusFrozenTheta: state.focusFrozen?.thetaWheel ?? null,
      radius: state.radius,
      fieldTop: state.fieldTop,
      focusedMaxWidth: state.focusedMaxWidth,
      focusedMaxHeight: state.focusedMaxHeight,
      fixedAngularOffsets: [...PHI],
      angles: angles(),
      pairwiseSpacingInvariant: pairwiseSpacingInvariant(),
      focusCarouselInvariantHolds: focusInvariantHolds()
    })
  });
})();
