(() => {
  'use strict';

  const root = document.querySelector('[data-mm-showroom]');
  const stage = root?.querySelector('.mm-stage');
  if (!root || !stage) throw new Error('MVR_V4_REQUIRED_SURFACE_MISSING');

  const important = (element, rules) => {
    if (!element) return;
    for (const [property, value] of Object.entries(rules)) element.style.setProperty(property, value, 'important');
  };
  const importantAll = (selector, rules, scope = document) => scope.querySelectorAll(selector).forEach(element => important(element, rules));

  let queued = false;
  function applyV4() {
    queued = false;
    const width = innerWidth;
    const height = innerHeight;
    const mobile = width <= 767;
    const compact = !mobile && (width <= 1180 || height <= 860);
    const browse = root.dataset.mmCamera === 'BROWSE';

    stage.querySelectorAll('.mm-family-tab').forEach(button => important(button, {
      'font-size': mobile ? '11px' : '12px',
      'line-height': '1.05'
    }));
    stage.querySelectorAll('[data-mm-lens-tab]').forEach(button => important(button, {
      'font-size': mobile ? '11px' : '12px',
      'line-height': '1.05'
    }));

    const instrument = stage.querySelector('.mm-instrument');
    const deck = instrument?.querySelector('[data-mm-model-deck]');
    const active = [...(deck?.querySelectorAll('.mm-model-card') || [])].find(card => card.dataset.position === 'active' || card.dataset.mmXPosition === 'active');
    if (active) {
      const gap = mobile ? 8 : compact ? 10 : 14;
      important(active, {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'stretch',
        gap: `${gap}px`,
        width: browse ? '100%' : mobile ? '90%' : compact ? '90%' : '84%',
        height: '100%',
        'max-height': '100%',
        padding: mobile ? '12px' : compact ? '18px' : '24px',
        transform: browse ? 'none' : 'translateY(3px)',
        overflow: 'hidden'
      });

      const meta = active.querySelector('.mm-model-card__meta');
      const statement = active.querySelector('.mm-model-card__statement');
      const theatre = active.querySelector('.mm-equation-theatre');
      const equationLabel = active.querySelector('.mm-equation-theatre__label');
      const equation = active.querySelector('.mm-equation');
      const footer = active.querySelector('.mm-model-card__footer');
      const inspect = active.querySelector('[data-mm-inspect]');
      const question = active.querySelector('.mm-model-card__question');

      important(meta, {
        position: 'static',
        flex: '0 0 auto',
        width: '100%',
        'min-height': '24px',
        margin: '0',
        transform: 'none'
      });
      important(statement, {
        position: 'static',
        flex: '0 0 auto',
        width: '100%',
        'max-width': browse ? '34ch' : '30ch',
        height: 'auto',
        'min-height': '0',
        margin: '0',
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': mobile ? (browse ? '4' : '3') : compact ? '4' : '4',
        'font-size': mobile ? (browse ? '24px' : '19px') : compact ? (browse ? '32px' : '28px') : (browse ? '38px' : '34px'),
        'line-height': mobile ? '1.07' : '1.12',
        transform: 'none'
      });
      important(theatre, {
        position: 'static',
        flex: '1 1 auto',
        width: '100%',
        'min-height': mobile ? (browse ? '92px' : '70px') : compact ? '112px' : '130px',
        height: 'auto',
        margin: '0',
        padding: mobile ? (browse ? '12px' : '9px') : compact ? '16px' : '20px',
        overflow: 'auto',
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center',
        gap: mobile ? '6px' : '10px',
        transform: 'none'
      });
      important(equationLabel, {
        position: 'static',
        flex: '0 0 auto',
        margin: '0',
        display: mobile && !browse ? 'none' : 'block',
        transform: 'none'
      });
      important(equation, {
        position: 'static',
        flex: '0 0 auto',
        width: '100%',
        height: 'auto',
        margin: '0',
        'font-size': mobile ? (browse ? '28px' : '24px') : compact ? '42px' : '48px',
        'line-height': '1.08',
        transform: 'none'
      });
      importantAll('.mm-equation *', { position: 'static', inset: 'auto', transform: 'none' }, active);
      important(footer, {
        position: 'static',
        flex: '0 0 auto',
        width: '100%',
        'min-height': '44px',
        margin: '0',
        display: 'grid',
        'grid-template-columns': mobile ? 'minmax(0,1fr)' : 'auto minmax(0,1fr)',
        gap: '12px',
        'align-items': 'center',
        transform: 'none'
      });
      important(inspect, {
        position: 'static',
        width: mobile ? '100%' : 'auto',
        'min-width': mobile ? '0' : '152px',
        height: '44px',
        'min-height': '44px',
        margin: '0',
        transform: 'none',
        zoom: '1'
      });
      important(question, {
        position: 'static',
        display: mobile ? 'none' : 'block',
        margin: '0',
        overflow: 'hidden',
        'max-height': '40px',
        transform: 'none'
      });
    }

    const lensPanel = stage.querySelector('[data-mm-lens-panel]');
    if (mobile) important(lensPanel, { display: 'none', height: '0', 'max-height': '0', padding: '0', margin: '0' });
  }

  function queueV4() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(applyV4)));
  }

  new MutationObserver(queueV4).observe(stage, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected', 'data-position', 'data-mm-x-position'] });
  globalThis.addEventListener('METHODS_MODELS_SHOWROOM_CHANGED', queueV4);
  globalThis.addEventListener('METHODS_MODELS_EUCLIDEAN_STATE_CHANGED', queueV4);
  globalThis.addEventListener('METHODS_MODELS_NATIVE_CAMERA_CHANGED', queueV4);
  globalThis.addEventListener('resize', queueV4);
  globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V4 = Object.freeze({ apply: applyV4 });
  queueV4();
})();
