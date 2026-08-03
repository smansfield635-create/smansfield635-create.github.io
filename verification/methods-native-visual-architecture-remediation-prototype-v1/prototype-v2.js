(() => {
  'use strict';

  const CONTRACT = 'METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_v1';
  const root = document.querySelector('[data-mm-showroom]');
  const stage = root?.querySelector('.mm-stage');
  const header = stage?.querySelector('.mm-stage__header');
  if (!root || !stage || !header) throw new Error('MVR_V2_REQUIRED_SURFACE_MISSING');

  const important = (element, rules) => {
    if (!element) return;
    for (const [property, value] of Object.entries(rules)) element.style.setProperty(property, value, 'important');
  };
  const importantAll = (selector, rules, scope = document) => scope.querySelectorAll(selector).forEach(element => important(element, rules));
  const px = value => `${value}px`;
  const cameraState = { current: 'OVERVIEW' };

  let overrideStyle = document.querySelector('[data-mvr-v2-override]');
  if (!overrideStyle) {
    overrideStyle = document.createElement('style');
    overrideStyle.dataset.mvrV2Override = 'true';
    overrideStyle.textContent = `
      html[data-methods-native-visual-prototype="active"] body[data-mm-display="expanded"] [data-mm-showroom][data-mvr-prototype="active"] .mm-stage::before,
      html[data-methods-native-visual-prototype="active"] body[data-mm-display="expanded"] [data-mm-showroom][data-mvr-prototype="active"] .mm-stage::after,
      html[data-methods-native-visual-prototype="active"] body[data-mm-display="expanded"] [data-mm-showroom][data-mvr-prototype="active"] .mm-family-tabs::before { content: none !important; display: none !important; }
      html[data-methods-native-visual-prototype="active"] body[data-mm-display="expanded"] [data-mm-showroom][data-mvr-prototype="active"] * { box-sizing: border-box; }
      html[data-methods-native-visual-prototype="active"] body[data-mm-display="expanded"] [data-mm-showroom][data-mvr-prototype="active"] button:focus-visible { outline: 2px solid #fff0a8 !important; outline-offset: 2px !important; }
    `;
    document.head.append(overrideStyle);
  }

  let controls = stage.querySelector('[data-mvr-camera-controls]');
  if (!controls) {
    controls = document.createElement('div');
    controls.dataset.mvrCameraControls = 'true';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Native camera composition');
    for (const [state, label] of [['OVERVIEW', 'Overview'], ['BROWSE', 'Browse']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.mvrCamera = state;
      button.textContent = label;
      button.setAttribute('aria-pressed', 'false');
      controls.append(button);
    }
    header.insertAdjacentElement('afterend', controls);
  }

  function publish(source) {
    globalThis.dispatchEvent(new CustomEvent('METHODS_MODELS_NATIVE_CAMERA_CHANGED', {
      detail: Object.freeze({
        contract: CONTRACT,
        source,
        camera: cameraState.current,
        x: Number(root.dataset.mmX),
        y: Number(root.dataset.mmY),
        z: Number(root.dataset.mmZ),
        productAcceptanceGranted: false,
        publicMutation: false
      })
    }));
  }

  function setCamera(next, source = 'camera-control') {
    const normalized = String(next || '').toUpperCase();
    if (!['OVERVIEW', 'BROWSE'].includes(normalized)) return false;
    cameraState.current = normalized;
    root.dataset.mmCamera = normalized;
    document.documentElement.dataset.mmCamera = normalized;
    document.body.dataset.mmCamera = normalized;
    controls.querySelectorAll('[data-mvr-camera]').forEach(button => {
      const active = button.dataset.mvrCamera === normalized;
      button.setAttribute('aria-pressed', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    apply();
    publish(source);
    return true;
  }

  function apply() {
    const width = innerWidth;
    const height = innerHeight;
    const mobile = width <= 767;
    const compact = !mobile && (width <= 1180 || height <= 860);
    const browse = cameraState.current === 'BROWSE';
    const safe = mobile ? 12 : compact ? 14 : 20;
    const gap = mobile ? 8 : compact ? 10 : 14;

    document.documentElement.dataset.methodsNativeVisualPrototype = 'active';
    root.dataset.mvrPrototype = 'active';
    important(document.documentElement, { overflow: 'hidden' });
    important(document.body, { overflow: 'hidden', 'overscroll-behavior': 'none' });
    important(document.querySelector('.mm-shell'), { 'min-height': '100dvh' });
    important(document.querySelector('.mm-main'), { display: 'block', 'min-height': '0' });
    important(document.querySelector('.mm-topbar'), {
      'min-height': mobile ? '64px' : '70px', height: mobile ? '64px' : '70px', padding: mobile ? '8px 12px' : '10px 20px', transform: 'none', zoom: '1'
    });
    if (mobile) important(document.querySelector('.mm-nav'), { display: 'none' });

    important(root, {
      position: 'fixed', inset: 'var(--mm-overlay-top, 64px) 0 0', width: 'auto', height: 'auto', 'min-height': '0', margin: '0', padding: '0',
      overflow: 'hidden', transform: 'none', zoom: '1', perspective: 'none', 'transform-style': 'flat',
      background: 'radial-gradient(circle at 76% 8%, rgba(47,145,178,.13), transparent 34%), linear-gradient(150deg,#071620 0%,#030a10 72%,#02070b 100%)'
    });
    important(stage, {
      position: 'relative', inset: 'auto', width: '100%', height: '100%', 'min-height': '0', margin: '0', padding: px(safe), overflow: 'hidden',
      display: 'grid', gap: px(gap), transform: 'none', zoom: '1', perspective: 'none', 'transform-style': 'flat', isolation: 'isolate',
      'grid-template-columns': mobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto',
      'grid-template-rows': browse && mobile ? 'auto auto auto minmax(0,1fr) auto' : 'auto auto minmax(0,1fr) auto auto',
      'grid-template-areas': mobile
        ? (browse ? '"header" "camera" "families" "instrument" "lens"' : '"header" "camera" "families" "instrument" "lens" "coordinate"')
        : '"header camera" "families families" "instrument instrument" "lens lens" "coordinate coordinate"'
    });

    important(header, {
      'grid-area': 'header', position: 'static', inset: 'auto', margin: '0', padding: `0 0 ${mobile ? 7 : 10}px`, display: 'grid',
      'grid-template-columns': 'minmax(0,1fr)', gap: '0', transform: 'none', zoom: '1', 'max-width': 'none',
      'border-bottom': '1px solid rgba(241,217,120,.32)', background: 'transparent', 'z-index': '20'
    });
    important(header.firstElementChild, { 'max-width': 'none', width: '100%', transform: 'none' });
    important(header.querySelector('.mm-kicker'), { display: 'none' });
    important(header.querySelector('[data-mm-family-title]'), {
      margin: '0', 'max-width': mobile ? 'none' : '24ch', 'font-size': mobile ? (browse ? '25px' : '28px') : compact ? '38px' : '52px',
      'line-height': mobile ? '1.02' : '.98', 'letter-spacing': '-.03em', color: '#f5f2e8', transform: 'none', 'text-wrap': 'balance'
    });
    important(header.querySelector('[data-mm-family-question]'), {
      display: browse && mobile ? 'none' : '-webkit-box', margin: '6px 0 0', 'max-width': mobile ? 'none' : '72ch',
      'font-size': mobile ? '14px' : '16px', 'line-height': '1.32', color: '#b8c2cb', overflow: 'hidden',
      '-webkit-line-clamp': mobile ? '2' : '2', '-webkit-box-orient': 'vertical', transform: 'none'
    });
    important(header.querySelector('[data-mm-collapse-showroom]'), { display: 'none' });

    important(controls, {
      'grid-area': 'camera', position: 'static', inset: 'auto', width: mobile ? '100%' : '260px', height: 'auto', margin: '0', padding: '4px',
      display: 'grid', 'grid-template-columns': 'repeat(2,minmax(0,1fr))', gap: '6px', transform: 'none', zoom: '1',
      border: '1px solid rgba(120,217,237,.22)', 'border-radius': '14px', background: 'rgba(2,10,16,.9)', 'z-index': '30'
    });
    controls.querySelectorAll('button').forEach(button => important(button, {
      position: 'static', width: 'auto', 'min-width': '0', height: '44px', 'min-height': '44px', margin: '0', padding: '10px 12px', transform: 'none', zoom: '1',
      border: button.getAttribute('aria-pressed') === 'true' ? '1px solid rgba(241,217,120,.62)' : '1px solid transparent', 'border-radius': '10px',
      background: button.getAttribute('aria-pressed') === 'true' ? 'linear-gradient(115deg,rgba(120,217,237,.24),rgba(241,217,120,.18))' : 'transparent',
      color: button.getAttribute('aria-pressed') === 'true' ? '#f6f2e7' : '#aeb9c4', 'font-size': '12px', 'line-height': '1', 'font-weight': '800', 'letter-spacing': '.08em'
    }));

    const familyTabs = stage.querySelector('[data-mm-family-tabs]');
    important(familyTabs, {
      'grid-area': 'families', position: 'static', inset: 'auto', width: '100%', height: 'auto', 'min-height': '44px', margin: '0', padding: '0',
      display: mobile ? 'flex' : 'grid', 'grid-template-columns': mobile ? 'none' : 'repeat(4,minmax(0,1fr))', gap: '8px', overflow: mobile ? 'auto hidden' : 'hidden',
      transform: 'none', zoom: '1', perspective: 'none', 'transform-style': 'flat', 'touch-action': mobile ? 'pan-x' : 'auto', 'z-index': '22'
    });
    familyTabs.querySelectorAll('.mm-family-tab').forEach(button => {
      const selected = button.getAttribute('aria-selected') === 'true';
      button.removeAttribute('aria-hidden');
      if ('inert' in button) button.inert = false;
      else button.removeAttribute('inert');
      button.tabIndex = selected ? 0 : -1;
      important(button, {
        position: 'static', inset: 'auto', flex: mobile ? '0 0 auto' : '1 1 auto', width: mobile ? '150px' : 'auto', 'min-width': mobile ? '150px' : '0',
        height: '44px', 'min-height': '44px', margin: '0', padding: '8px 10px', transform: 'none', zoom: '1', opacity: selected ? '1' : (browse ? '.58' : '.78'),
        filter: 'none', visibility: 'visible', 'clip-path': 'none', border: selected ? '1px solid rgba(255,244,194,.58)' : '1px solid rgba(120,217,237,.18)',
        'border-radius': '10px', background: selected ? 'linear-gradient(110deg,#75d7eb,#f0d978)' : 'rgba(2,10,16,.82)',
        color: selected ? '#071017' : '#c4ced6', 'font-size': '12px', 'line-height': '1.15', 'font-weight': '800', 'text-align': 'center', 'white-space': 'normal'
      });
    });
    important(stage.querySelector('.mm-z-axis-controls'), { display: 'none' });

    const instrument = stage.querySelector('.mm-instrument');
    important(instrument, {
      'grid-area': 'instrument', position: 'relative', inset: 'auto', width: '100%', height: '100%', 'min-height': '0', margin: '0',
      padding: browse ? (mobile ? '6px' : '10px') : (mobile ? '12px' : compact ? '16px' : '22px'), overflow: 'hidden',
      display: 'grid', 'grid-template-rows': 'minmax(0,1fr) auto', gap: mobile ? '6px' : '10px', transform: 'none', zoom: '1', perspective: 'none', 'transform-style': 'flat',
      border: browse ? '1px solid rgba(120,217,237,.38)' : '1px solid rgba(241,217,120,.26)', 'border-radius': mobile ? '16px' : '22px',
      background: browse ? 'linear-gradient(150deg,rgba(4,17,25,.99),rgba(1,7,11,.99))' : 'linear-gradient(150deg,rgba(8,26,37,.94),rgba(2,9,14,.99))',
      'box-shadow': 'inset 0 0 0 1px rgba(120,217,237,.05),0 18px 48px rgba(0,0,0,.22)', 'z-index': '10'
    });
    importantAll('.mm-depth-plane', { display: 'none' }, instrument);
    const deck = instrument.querySelector('[data-mm-model-deck]');
    important(deck, {
      position: 'relative', inset: 'auto', width: '100%', height: '100%', 'min-height': '0', margin: '0', padding: '0', overflow: 'hidden',
      display: 'grid', 'place-items': 'center', transform: 'none', zoom: '1', perspective: 'none', 'transform-style': 'flat', 'touch-action': 'pan-y'
    });
    deck.querySelectorAll('.mm-model-card').forEach(card => {
      const active = card.dataset.position === 'active' || card.dataset.mmXPosition === 'active';
      important(card, active ? {
        position: 'relative', inset: 'auto', top: 'auto', left: 'auto', width: browse ? '100%' : (mobile ? '92%' : compact ? '90%' : '84%'), height: browse ? '100%' : (mobile ? '92%' : '90%'),
        'min-height': '0', 'max-height': '100%', margin: '0', padding: mobile ? '14px' : compact ? '18px' : '24px', 'padding-bottom': mobile ? '14px' : '24px', overflow: 'auto',
        display: 'grid', 'grid-template-rows': 'auto auto minmax(92px,1fr) auto', gap: mobile ? '9px' : '14px', transform: browse ? 'none' : 'scale(.94)',
        zoom: '1', opacity: '1', filter: 'none', visibility: 'visible', 'pointer-events': 'auto', border: '1px solid rgba(120,217,237,.2)',
        'border-radius': mobile ? '14px' : '18px', background: 'linear-gradient(150deg,rgba(4,15,23,.99),rgba(1,7,11,.99))', 'box-shadow': 'none', 'z-index': '8'
      } : {
        position: 'absolute', display: 'none', width: '0', height: '0', transform: 'none', opacity: '0', visibility: 'hidden', 'pointer-events': 'none'
      });
      if (!active) return;
      important(card.querySelector('.mm-model-card__meta'), { display: 'flex', 'justify-content': 'space-between', gap: '12px', 'font-size': '12px', 'line-height': '1.2' });
      importantAll('.mm-model-card__index,.mm-model-card__status', { 'font-size': '12px', 'line-height': '1.2' }, card);
      important(card.querySelector('.mm-model-card__statement'), {
        margin: '0', 'max-width': browse ? '34ch' : '28ch', 'font-size': mobile ? (browse ? '24px' : '21px') : compact ? (browse ? '34px' : '30px') : (browse ? '44px' : '38px'),
        'line-height': '1.08', 'letter-spacing': '-.025em', color: '#f4f1e7', transform: 'none', 'text-wrap': 'balance'
      });
      important(card.querySelector('.mm-equation-theatre'), {
        width: '100%', 'min-height': mobile ? '88px' : '116px', margin: '0', padding: mobile ? '12px' : '18px', overflow: 'auto', display: 'grid',
        'align-content': 'center', gap: '8px', transform: 'none', border: '1px solid rgba(120,217,237,.2)', 'border-radius': '14px', background: 'rgba(0,6,10,.82)'
      });
      important(card.querySelector('.mm-equation-theatre__label'), { 'font-size': '12px', 'line-height': '1.2', color: '#f1d978' });
      important(card.querySelector('.mm-equation'), { 'font-size': mobile ? '30px' : compact ? '44px' : '58px', 'line-height': '1.08', 'text-align': 'center', 'overflow-wrap': 'anywhere', transform: 'none' });
      important(card.querySelector('.mm-model-card__footer'), { display: 'grid', 'grid-template-columns': mobile ? 'minmax(0,1fr)' : 'auto minmax(0,1fr)', gap: '10px', 'align-items': 'center' });
      important(card.querySelector('[data-mm-inspect]'), { position: 'static', width: mobile ? '100%' : 'auto', 'min-width': mobile ? '0' : '150px', height: '44px', 'min-height': '44px', margin: '0', padding: '10px 14px', transform: 'none', 'font-size': '13px' });
      important(card.querySelector('.mm-model-card__question'), { display: mobile ? 'none' : 'block', margin: '0', 'font-size': '14px', 'line-height': '1.35', color: '#aeb9c4', 'text-align': 'right' });
    });

    const deckControls = instrument.querySelector('.mm-deck-controls');
    important(deckControls, { position: 'static', inset: 'auto', display: 'flex', 'justify-self': 'end', gap: '8px', margin: '0', transform: 'none', 'z-index': '30' });
    deckControls?.querySelectorAll('button').forEach(button => important(button, {
      position: 'static', width: '44px', 'min-width': '44px', height: '44px', 'min-height': '44px', margin: '0', padding: '0', transform: 'none', zoom: '1',
      border: '1px solid rgba(241,217,120,.46)', 'border-radius': '12px', background: 'rgba(2,10,16,.96)', color: '#fff0bd', 'font-size': '20px'
    }));

    const lens = stage.querySelector('.mm-lens');
    const lensWrap = lens?.parentElement;
    important(lensWrap, { 'grid-area': 'lens', position: 'static', width: '100%', margin: '0', padding: '0', display: 'grid', 'grid-template-columns': 'minmax(0,1fr)', gap: '6px', transform: 'none' });
    important(lens, {
      position: 'static', inset: 'auto', width: '100%', margin: '0', padding: mobile ? '8px' : '10px', display: 'grid',
      'grid-template-columns': mobile || compact ? 'minmax(0,1fr)' : 'auto minmax(0,1fr)', gap: mobile ? '8px' : '12px', 'align-items': 'center',
      transform: 'none', zoom: '1', border: '1px solid rgba(120,217,237,.18)', 'border-radius': '14px', background: 'rgba(3,12,18,.94)', 'z-index': '20'
    });
    const lensTabs = lens?.querySelector('.mm-lens-tabs');
    important(lensTabs, { position: 'static', inset: 'auto', display: 'grid', 'grid-template-columns': 'repeat(3,minmax(0,1fr))', gap: '6px', margin: '0', padding: '0', transform: 'none', zoom: '1' });
    lensTabs?.querySelectorAll('[data-mm-lens-tab]').forEach(button => important(button, {
      position: 'static', inset: 'auto', width: 'auto', 'min-width': '0', height: '44px', 'min-height': '44px', margin: '0', padding: mobile ? '8px 4px' : '8px 10px',
      transform: 'none', zoom: '1', opacity: '1', visibility: 'visible', 'font-size': mobile ? '11px' : '12px', 'line-height': '1.1', 'border-radius': '10px'
    }));
    important(lens?.querySelector('[data-mm-lens-panel]'), {
      display: browse && mobile ? 'none' : '-webkit-box', margin: '0', padding: '0', 'min-width': '0', 'font-size': '14px', 'line-height': '1.35', color: '#c9d2da',
      overflow: 'hidden', '-webkit-line-clamp': mobile ? '2' : '2', '-webkit-box-orient': 'vertical', transform: 'none'
    });
    important(lensWrap?.querySelector('[data-mm-progress]'), { display: 'none' });

    const coordinate = stage.querySelector('[data-mm-coordinate]');
    important(coordinate, {
      'grid-area': 'coordinate', position: 'static', inset: 'auto', width: '100%', margin: '0', padding: '0', display: browse && mobile ? 'none' : 'flex',
      'justify-content': 'center', 'flex-wrap': 'wrap', gap: '5px 14px', transform: 'none', zoom: '1', color: 'rgba(120,217,237,.8)', 'font-size': mobile ? '11px' : '12px', 'line-height': '1.2', 'z-index': '20'
    });

    const dialog = document.querySelector('[data-mm-dialog]');
    important(dialog, { width: 'min(980px,calc(100vw - 24px))', 'max-width': 'calc(100vw - 24px)', 'max-height': 'calc(100dvh - 24px)', margin: 'auto', padding: '0', transform: 'none' });
    important(dialog?.querySelector('.mm-dialog__inner'), { 'max-height': 'calc(100dvh - 48px)', overflow: 'auto' });
    important(dialog?.querySelector('[data-mm-dialog-close]'), { width: '44px', 'min-width': '44px', height: '44px', 'min-height': '44px' });
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

  let queued = false;
  const queueApply = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; apply(); });
  };
  new MutationObserver(queueApply).observe(stage, { childList: true, subtree: true });
  globalThis.addEventListener('METHODS_MODELS_SHOWROOM_CHANGED', queueApply);
  globalThis.addEventListener('METHODS_MODELS_EUCLIDEAN_STATE_CHANGED', queueApply);
  globalThis.addEventListener('METHODS_MODELS_SHOWROOM_DISPLAY_CHANGED', queueApply);
  globalThis.addEventListener('resize', queueApply);

  globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V1 = Object.freeze({ contract: CONTRACT, getCamera: () => cameraState.current, setCamera, apply });
  setCamera('OVERVIEW', 'initialization');
})();
