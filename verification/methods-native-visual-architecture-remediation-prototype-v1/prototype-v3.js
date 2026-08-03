(() => {
  'use strict';

  const root = document.querySelector('[data-mm-showroom]');
  const stage = root?.querySelector('.mm-stage');
  if (!root || !stage) throw new Error('MVR_V3_REQUIRED_SURFACE_MISSING');

  const important = (element, rules) => {
    if (!element) return;
    for (const [property, value] of Object.entries(rules)) element.style.setProperty(property, value, 'important');
  };
  const importantAll = (selector, rules, scope = document) => scope.querySelectorAll(selector).forEach(element => important(element, rules));

  let queued = false;
  function applyV3() {
    queued = false;
    const width = innerWidth;
    const height = innerHeight;
    const mobile = width <= 767;
    const compact = !mobile && (width <= 1180 || height <= 860);
    const browse = root.dataset.mmCamera === 'BROWSE';

    if (mobile) {
      important(stage, {
        'grid-template-columns': 'minmax(0,1fr)',
        'grid-template-rows': 'auto auto auto minmax(0,1fr) auto auto',
        'grid-template-areas': '"header" "camera" "families" "instrument" "lens" "coordinate"'
      });
    }

    const familyTabs = stage.querySelector('[data-mm-family-tabs]');
    important(familyTabs, {
      display: 'grid',
      'grid-template-columns': 'repeat(4,minmax(0,1fr))',
      width: '100%',
      'max-width': 'none',
      overflow: 'hidden',
      'touch-action': 'pan-y'
    });
    familyTabs?.querySelectorAll('.mm-family-tab').forEach(button => important(button, {
      position: 'static',
      flex: '1 1 auto',
      width: '100%',
      'min-width': '0',
      'max-width': 'none',
      height: '44px',
      'min-height': '44px',
      padding: mobile ? '6px 4px' : '8px 10px',
      transform: 'none',
      'font-size': mobile ? '10px' : '12px',
      'line-height': '1.08',
      'white-space': 'normal',
      overflow: 'hidden'
    }));

    const instrument = stage.querySelector('.mm-instrument');
    const deck = instrument?.querySelector('[data-mm-model-deck]');
    const active = [...(deck?.querySelectorAll('.mm-model-card') || [])].find(card => card.dataset.position === 'active' || card.dataset.mmXPosition === 'active');
    if (active) {
      important(active, {
        width: browse ? '100%' : mobile ? '90%' : compact ? '90%' : '84%',
        height: browse ? '100%' : mobile ? '92%' : '88%',
        'max-height': '100%',
        transform: 'none',
        zoom: '1',
        overflow: 'auto'
      });
      importantAll(':scope > *', { position: 'static', inset: 'auto', transform: 'none', 'max-width': 'none' }, active);
      importantAll('.mm-equation *, .mm-model-card__meta *, .mm-model-card__footer *', { position: 'static', inset: 'auto', transform: 'none' }, active);
      important(active.querySelector('.mm-model-card__statement'), {
        width: 'auto',
        'max-width': browse ? '34ch' : '28ch',
        overflow: 'visible'
      });
      important(active.querySelector('.mm-equation-theatre'), {
        width: '100%',
        'max-width': 'none',
        overflow: 'auto'
      });
      important(active.querySelector('.mm-equation'), {
        width: '100%',
        'max-width': 'none'
      });
      important(active.querySelector('.mm-model-card__footer'), {
        width: '100%',
        'max-width': 'none'
      });
      important(active.querySelector('[data-mm-inspect]'), {
        height: '44px',
        'min-height': '44px',
        transform: 'none',
        zoom: '1'
      });
    }

    const lens = stage.querySelector('.mm-lens');
    const lensWrap = lens?.parentElement;
    const lensTabs = lens?.querySelector('.mm-lens-tabs');
    const lensPanel = lens?.querySelector('[data-mm-lens-panel]');
    important(lensWrap, {
      width: '100%',
      'max-width': 'none',
      transform: 'none',
      zoom: '1'
    });
    important(lens, {
      display: 'flex',
      'flex-direction': 'column',
      width: '100%',
      'max-width': 'none',
      height: 'auto',
      gap: '8px',
      transform: 'none',
      zoom: '1'
    });
    important(lensTabs, {
      position: 'static',
      inset: 'auto',
      display: 'grid',
      'grid-template-columns': 'repeat(3,minmax(0,1fr))',
      width: '100%',
      'min-width': '0',
      'max-width': 'none',
      height: '44px',
      margin: '0',
      padding: '0',
      gap: '6px',
      transform: 'none',
      zoom: '1',
      flex: '0 0 auto'
    });
    lensTabs?.querySelectorAll('[data-mm-lens-tab]').forEach(button => important(button, {
      position: 'static',
      inset: 'auto',
      display: 'block',
      width: '100%',
      'min-width': '0',
      'max-width': 'none',
      height: '44px',
      'min-height': '44px',
      margin: '0',
      padding: mobile ? '8px 3px' : '8px 10px',
      transform: 'none',
      zoom: '1',
      'font-size': mobile ? '10px' : '12px',
      'line-height': '1.1',
      overflow: 'hidden'
    }));
    important(lensPanel, {
      position: 'static',
      inset: 'auto',
      display: browse && mobile ? 'none' : '-webkit-box',
      width: '100%',
      'min-width': '0',
      'max-width': 'none',
      height: 'auto',
      'max-height': mobile ? '38px' : '44px',
      margin: '0',
      padding: '0 2px',
      overflow: 'hidden',
      transform: 'none',
      zoom: '1',
      border: '0',
      'border-radius': '0',
      background: 'transparent',
      'box-shadow': 'none',
      color: '#c9d2da',
      'font-size': '14px',
      'line-height': '1.35',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      flex: '0 0 auto'
    });

    const coordinate = stage.querySelector('[data-mm-coordinate]');
    important(coordinate, {
      display: 'flex',
      width: '100%',
      'min-height': '16px',
      'max-height': '32px',
      overflow: 'hidden',
      transform: 'none',
      zoom: '1'
    });
  }

  function queueV3() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(applyV3));
  }

  new MutationObserver(queueV3).observe(stage, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected', 'data-position', 'data-mm-x-position'] });
  globalThis.addEventListener('METHODS_MODELS_SHOWROOM_CHANGED', queueV3);
  globalThis.addEventListener('METHODS_MODELS_EUCLIDEAN_STATE_CHANGED', queueV3);
  globalThis.addEventListener('METHODS_MODELS_NATIVE_CAMERA_CHANGED', queueV3);
  globalThis.addEventListener('resize', queueV3);
  globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V3 = Object.freeze({ apply: applyV3 });
  queueV3();
})();
