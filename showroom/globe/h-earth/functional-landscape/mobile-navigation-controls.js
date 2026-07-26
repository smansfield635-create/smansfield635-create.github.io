/**
 * H_EARTH_RUN_8E_MOBILE_NAVIGATION_CONTROLS_v1
 *
 * Adds an explicit coarse-pointer movement surface without creating a new
 * navigation authority. All actions are proposals to the existing Run 6F
 * navigation API, which the Run 8E adapter renders through the successor
 * environment.
 */

const CONTROL_ID = 'h-earth-run8e-mobile-navigation-controls';
const STYLE_ID = 'h-earth-run8e-mobile-navigation-controls-style';
const HOLD_DELAY_MS = 260;
const HOLD_REPEAT_MS = 120;
const MOVE_MAGNITUDE = 6;

const freeze = (value) => Object.freeze(value);
const clonePlain = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

const styleText = `
  #${CONTROL_ID} {
    position: absolute;
    left: max(12px, env(safe-area-inset-left));
    bottom: max(72px, calc(env(safe-area-inset-bottom) + 64px));
    z-index: 12;
    display: none;
    grid-template-columns: repeat(3, 52px);
    grid-template-rows: repeat(3, 52px);
    gap: 6px;
    padding: 8px;
    border: 1px solid rgba(226, 255, 246, 0.26);
    border-radius: 22px;
    background: rgba(2, 8, 10, 0.78);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36);
    backdrop-filter: blur(14px);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  #${CONTROL_ID}[data-ready="true"] { opacity: 1; }

  #${CONTROL_ID} button {
    display: grid;
    place-items: center;
    min-width: 52px;
    min-height: 52px;
    margin: 0;
    border: 1px solid rgba(226, 255, 246, 0.3);
    border-radius: 16px;
    color: #f2fbf8;
    background: rgba(18, 34, 35, 0.94);
    font: 800 1.2rem/1 system-ui, sans-serif;
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
  }

  #${CONTROL_ID} button:active,
  #${CONTROL_ID} button[data-active="true"] {
    translate: 0 1px;
    background: rgba(62, 104, 91, 0.98);
    border-color: rgba(224, 255, 244, 0.7);
  }

  #${CONTROL_ID} [data-h-earth-mobile-action="MOVE_FORWARD"] { grid-column: 2; grid-row: 1; }
  #${CONTROL_ID} [data-h-earth-mobile-action="STRAFE_LEFT"] { grid-column: 1; grid-row: 2; }
  #${CONTROL_ID} [data-h-earth-mobile-reset="true"] {
    grid-column: 2;
    grid-row: 2;
    font-size: 0.65rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  #${CONTROL_ID} [data-h-earth-mobile-action="STRAFE_RIGHT"] { grid-column: 3; grid-row: 2; }
  #${CONTROL_ID} [data-h-earth-mobile-action="MOVE_BACKWARD"] { grid-column: 2; grid-row: 3; }

  @media (pointer: coarse), (max-width: 820px) {
    #${CONTROL_ID} { display: grid; }
  }

  @media (orientation: landscape) and (max-height: 560px) {
    #${CONTROL_ID} {
      left: max(8px, env(safe-area-inset-left));
      bottom: max(12px, env(safe-area-inset-bottom));
      grid-template-columns: repeat(3, 46px);
      grid-template-rows: repeat(3, 46px);
      padding: 6px;
    }
    #${CONTROL_ID} button { min-width: 46px; min-height: 46px; }
  }
`;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = styleText;
  document.head.append(style);
}

function createControls() {
  const controls = document.createElement('nav');
  controls.id = CONTROL_ID;
  controls.dataset.ready = 'false';
  controls.setAttribute('aria-label', 'H-Earth mobile movement controls');
  controls.innerHTML = `
    <button type="button" data-h-earth-mobile-action="MOVE_FORWARD" aria-label="Move forward">▲</button>
    <button type="button" data-h-earth-mobile-action="STRAFE_LEFT" aria-label="Move left">◀</button>
    <button type="button" data-h-earth-mobile-reset="true" aria-label="Return to coast and level the view">Coast</button>
    <button type="button" data-h-earth-mobile-action="STRAFE_RIGHT" aria-label="Move right">▶</button>
    <button type="button" data-h-earth-mobile-action="MOVE_BACKWARD" aria-label="Move backward">▼</button>
  `;
  return controls;
}

export function installHEarthRun8EMobileNavigationControls({ root, mount }) {
  if (!root || !mount) throw new Error('Run 8E mobile navigation host is incomplete.');
  const existing = document.getElementById(CONTROL_ID);
  if (existing) return window.H_EARTH_RUN8E_MOBILE_NAVIGATION;

  ensureStyle();
  const controls = createControls();
  mount.append(controls);

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_MOBILE_NAVIGATION_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_8E_MOBILE_NAVIGATION_READY',
    controlCount: 5,
    directionalControlCount: 4,
    resetControlCount: 1,
    actionDispatchCount: 0,
    holdSessionCount: 0,
    resetCount: 0,
    lastAction: null,
    lastError: null,
    existingNavigationAuthorityPreserved: true,
    rendererAuthorityCreated: false,
    navigationAuthorityCreated: false
  };

  let holdDelay = null;
  let holdRepeat = null;
  let activeButton = null;

  const api = () => window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
  const dispatch = (action) => {
    const navigation = api();
    if (!navigation?.ready || typeof navigation.dispatch !== 'function') return;
    receipt.actionDispatchCount += 1;
    receipt.lastAction = action;
    navigation.dispatch({ action, magnitude: MOVE_MAGNITUDE }).catch((error) => {
      receipt.lastError = error instanceof Error ? error.message : String(error);
      console.error(error);
    });
  };

  const stopHold = () => {
    if (holdDelay != null) window.clearTimeout(holdDelay);
    if (holdRepeat != null) window.clearInterval(holdRepeat);
    holdDelay = null;
    holdRepeat = null;
    if (activeButton) activeButton.dataset.active = 'false';
    activeButton = null;
  };

  controls.querySelectorAll('[data-h-earth-mobile-action]').forEach((button) => {
    const action = button.dataset.hEarthMobileAction;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      stopHold();
      activeButton = button;
      button.dataset.active = 'true';
      receipt.holdSessionCount += 1;
      dispatch(action);
      holdDelay = window.setTimeout(() => {
        holdRepeat = window.setInterval(() => dispatch(action), HOLD_REPEAT_MS);
      }, HOLD_DELAY_MS);
    });
    button.addEventListener('pointerup', (event) => {
      event.preventDefault();
      event.stopPropagation();
      stopHold();
    });
    button.addEventListener('pointercancel', stopHold);
    button.addEventListener('lostpointercapture', stopHold);
  });

  const reset = controls.querySelector('[data-h-earth-mobile-reset]');
  const activateReset = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    stopHold();
    const navigation = api();
    if (!navigation?.ready) return;
    receipt.resetCount += 1;
    receipt.lastAction = 'RESET_TO_COAST';
    try {
      if (typeof navigation.reset === 'function') await navigation.reset();
      else await navigation.gotoWaypoint('COAST');
    } catch (error) {
      receipt.lastError = error instanceof Error ? error.message : String(error);
      console.error(error);
    }
  };
  reset.addEventListener('pointerdown', activateReset);
  reset.addEventListener('click', (event) => {
    if (event.detail === 0) activateReset(event);
  });

  window.addEventListener('pointerup', stopHold, { passive: true });
  window.addEventListener('pointercancel', stopHold, { passive: true });
  window.addEventListener('blur', stopHold);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopHold();
  });

  const hint = document.getElementById('h-earth-gesture-instructions');
  if (hint) hint.textContent = 'Drag to look · Use arrows to move · Pinch to zoom';
  root.dataset.mobileNavigationControls = 'true';
  controls.dataset.ready = 'true';
  receipt.status = 'RUN_8E_MOBILE_NAVIGATION_ACTIVE';

  const publicApi = freeze({
    ready: true,
    getReceipt() {
      return clonePlain(receipt);
    },
    stop() {
      stopHold();
      return clonePlain(receipt);
    }
  });
  window.H_EARTH_RUN8E_MOBILE_NAVIGATION = publicApi;
  return publicApi;
}
