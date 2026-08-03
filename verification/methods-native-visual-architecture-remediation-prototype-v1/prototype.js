(() => {
  'use strict';

  const CONTRACT = 'METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_v1';
  const root = document.querySelector('[data-mm-showroom]');
  const header = document.querySelector('.mm-stage__header');
  if (!root || !header) throw new Error('MVR_PROTOTYPE_REQUIRED_SURFACE_MISSING');

  const camera = { current: 'OVERVIEW' };
  const controls = document.createElement('div');
  controls.dataset.mvrCameraControls = 'true';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Native camera composition');

  const makeButton = (state, label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mvrCamera = state;
    button.textContent = label;
    button.setAttribute('aria-pressed', 'false');
    return button;
  };

  controls.append(makeButton('OVERVIEW', 'Overview'), makeButton('BROWSE', 'Browse'));
  header.insertAdjacentElement('afterend', controls);

  function publish(source) {
    const detail = Object.freeze({
      contract: CONTRACT,
      source,
      camera: camera.current,
      x: Number(root.dataset.mmX),
      y: Number(root.dataset.mmY),
      z: Number(root.dataset.mmZ),
      productAcceptanceGranted: false,
      publicMutation: false
    });
    globalThis.dispatchEvent(new CustomEvent('METHODS_MODELS_NATIVE_CAMERA_CHANGED', { detail }));
  }

  function setCamera(next, source = 'camera-control') {
    const normalized = String(next || '').toUpperCase();
    if (!['OVERVIEW', 'BROWSE'].includes(normalized)) return false;
    camera.current = normalized;
    root.dataset.mmCamera = normalized;
    document.documentElement.dataset.mmCamera = normalized;
    document.body.dataset.mmCamera = normalized;
    controls.querySelectorAll('[data-mvr-camera]').forEach(button => {
      const active = button.dataset.mvrCamera === normalized;
      button.setAttribute('aria-pressed', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    publish(source);
    return true;
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-mvr-camera]');
    if (button) setCamera(button.dataset.mvrCamera, 'pointer-or-touch');
  });

  controls.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' || event.key === 'ArrowLeft' ? 'OVERVIEW' : 'BROWSE';
    setCamera(next, 'keyboard');
    controls.querySelector(`[data-mvr-camera="${next}"]`)?.focus({ preventScroll: true });
  });

  globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V1 = Object.freeze({
    contract: CONTRACT,
    getCamera: () => camera.current,
    setCamera
  });

  document.documentElement.dataset.methodsNativeVisualPrototype = 'active';
  root.dataset.mvrPrototype = 'active';
  setCamera('OVERVIEW', 'initialization');
})();
