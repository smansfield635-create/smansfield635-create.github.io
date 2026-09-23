import fs from 'node:fs/promises';

const paths = {
  html: 'showroom/globe/h-earth/index.html',
  navigation: 'showroom/globe/h-earth/functional-landscape/index.js',
  integration: 'showroom/globe/h-earth/functional-landscape/environment-integration.js',
  controls: 'showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js'
};

const replaceOnce = (source, before, after, label) => {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`MISSING_${label}`);
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`NON_UNIQUE_${label}`);
  }
  return `${source.slice(0, first)}${after}${source.slice(first + before.length)}`;
};

const replaceAllExact = (source, before, after, minimum, label) => {
  const matches = source.split(before).length - 1;
  if (matches < minimum) throw new Error(`INSUFFICIENT_${label}:${matches}`);
  return source.split(before).join(after);
};

async function updateNavigationSource() {
  let source = await fs.readFile(paths.navigation, 'utf8');
  if (source.includes('dispatchNavigationOnly(intent)')) return false;
  const before = `  async dispatch(intent) {\n    return applyIntent(intent);\n  },\n  async gotoWaypoint(waypointId) {\n    return applyIntent({\n      action: 'GOTO_WAYPOINT',\n      waypointId\n    });\n  },`;
  const after = `  async dispatch(intent) {\n    return applyIntent(intent);\n  },\n  async dispatchNavigationOnly(intent) {\n    return applyIntent(intent, { render: false });\n  },\n  async gotoWaypointNavigationOnly(waypointId) {\n    return applyIntent({\n      action: 'GOTO_WAYPOINT',\n      waypointId\n    }, { render: false });\n  },\n  async resetNavigationOnly() {\n    return applyIntent({ action: 'RESET' }, { render: false });\n  },\n  async forceBelowTerrainRecoveryNavigationOnly() {\n    return applyIntent({\n      action: 'SET_CAMERA_POSITION',\n      position: {\n        x: navigationState.position.x,\n        y: -999,\n        z: navigationState.position.z\n      }\n    }, { render: false });\n  },\n  async gotoWaypoint(waypointId) {\n    return applyIntent({\n      action: 'GOTO_WAYPOINT',\n      waypointId\n    });\n  },`;
  source = replaceOnce(source, before, after, 'RUN6F_NAVIGATION_ONLY_API');
  await fs.writeFile(paths.navigation, source, 'utf8');
  return true;
}

async function updateIntegrationSource() {
  let source = await fs.readFile(paths.integration, 'utf8');
  if (!source.includes("from './mobile-navigation-controls.js'")) {
    source = replaceOnce(
      source,
      `} from '../render/run8e-successor-environment.js';\n\nconst root`,
      `} from '../render/run8e-successor-environment.js';\nimport {\n  installHEarthRun8EMobileNavigationControls\n} from './mobile-navigation-controls.js';\n\nconst root`,
      'RUN8E_MOBILE_CONTROL_IMPORT'
    );
  }

  if (!source.includes('dispatchNavigationOnly.bind(api)')) {
    const before = `function installNavigationBridge(api) {\n  const original = {\n    dispatch: api.dispatch.bind(api),\n    gotoWaypoint: api.gotoWaypoint.bind(api),\n    runGeographicPath: api.runGeographicPath.bind(api),\n    forceBelowTerrainRecovery: api.forceBelowTerrainRecovery.bind(api)\n  };\n  api.dispatch = async (intent) => {\n    const result = await original.dispatch(intent);\n    await renderRun8E();\n    return result;\n  };\n  api.gotoWaypoint = async (waypointId) => {\n    const result = await original.gotoWaypoint(waypointId);\n    await renderRun8E();\n    return result;\n  };\n  api.runGeographicPath = async () => {\n    const result = await original.runGeographicPath();\n    await renderRun8E();\n    return result;\n  };\n  api.forceBelowTerrainRecovery = async () => {\n    const result = await original.forceBelowTerrainRecovery();\n    await renderRun8E();\n    return result;\n  };\n}`;
    const after = `function installNavigationBridge(api) {\n  const original = {\n    dispatchNavigationOnly: typeof api.dispatchNavigationOnly === 'function'\n      ? api.dispatchNavigationOnly.bind(api)\n      : api.dispatch.bind(api),\n    gotoWaypointNavigationOnly: typeof api.gotoWaypointNavigationOnly === 'function'\n      ? api.gotoWaypointNavigationOnly.bind(api)\n      : api.gotoWaypoint.bind(api),\n    resetNavigationOnly: typeof api.resetNavigationOnly === 'function'\n      ? api.resetNavigationOnly.bind(api)\n      : () => api.dispatch({ action: 'RESET' }),\n    forceBelowTerrainRecoveryNavigationOnly:\n      typeof api.forceBelowTerrainRecoveryNavigationOnly === 'function'\n        ? api.forceBelowTerrainRecoveryNavigationOnly.bind(api)\n        : api.forceBelowTerrainRecovery.bind(api)\n  };\n\n  const renderAfterNavigation = async (operation) => {\n    const result = await operation();\n    const run8ERenderReceipt = await renderRun8E();\n    return {\n      ...result,\n      run8ERenderReceipt\n    };\n  };\n\n  api.dispatch = async (intent) => renderAfterNavigation(\n    () => original.dispatchNavigationOnly(intent)\n  );\n  api.gotoWaypoint = async (waypointId) => renderAfterNavigation(\n    () => original.gotoWaypointNavigationOnly(waypointId)\n  );\n  api.reset = async () => renderAfterNavigation(\n    () => original.resetNavigationOnly()\n  );\n  api.runGeographicPath = async () => {\n    const results = [];\n    for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {\n      results.push(await api.gotoWaypoint(waypointId));\n    }\n    return results;\n  };\n  api.forceBelowTerrainRecovery = async () => renderAfterNavigation(\n    () => original.forceBelowTerrainRecoveryNavigationOnly()\n  );\n}`;
    source = replaceOnce(source, before, after, 'RUN8E_NAVIGATION_BRIDGE');
  }

  if (!source.includes('installHEarthRun8EMobileNavigationControls({')) {
    source = replaceOnce(
      source,
      `await renderRun8E();\ninstallPublicApi();\n\nlet resizeTimer`,
      `await renderRun8E();\ninstallPublicApi();\ninstallHEarthRun8EMobileNavigationControls({ root, mount });\n\nlet resizeTimer`,
      'RUN8E_MOBILE_CONTROL_INSTALL'
    );
  }

  await fs.writeFile(paths.integration, source, 'utf8');
  return true;
}

async function updatePublicHtml() {
  let source = await fs.readFile(paths.html, 'utf8');
  let changed = false;
  const cacheBefore = './functional-landscape/environment-integration.js?v=run7i-public-route-001';
  const cacheAfter = './functional-landscape/environment-integration.js?v=run8e-mobile-navigation-001';
  if (source.includes(cacheBefore)) {
    source = replaceOnce(source, cacheBefore, cacheAfter, 'RUN8E_CACHE_KEY');
    changed = true;
  }

  if (source.includes('data-h-earth-stage-contains-controls="false"')) {
    source = replaceAllExact(
      source,
      'data-h-earth-stage-contains-controls="false"',
      'data-h-earth-stage-contains-controls="true"',
      2,
      'MOBILE_CONTROL_STATE'
    );
    changed = true;
  }

  const guidanceBefore = `            <strong>Direct manipulation:</strong> drag to look, slide two\n              fingers or use the mouse wheel to move, and pinch to zoom.`;
  const guidanceAfter = `            <strong>Direct manipulation:</strong> drag to look, use the\n              on-screen arrows to move, and pinch to zoom.`;
  if (source.includes(guidanceBefore)) {
    source = replaceOnce(source, guidanceBefore, guidanceAfter, 'MOBILE_GUIDANCE');
    changed = true;
  }

  const ariaBefore = 'aria-label="Navigable H-Earth landscape. Drag to look. Slide two fingers or use the mouse wheel to move. Pinch to zoom."';
  const ariaAfter = 'aria-label="Navigable H-Earth landscape. Drag to look. Use the on-screen arrows to move. Pinch to zoom. Use Coast to reset the view."';
  if (source.includes(ariaBefore)) {
    source = replaceOnce(source, ariaBefore, ariaAfter, 'MOBILE_ARIA_GUIDANCE');
    changed = true;
  }

  const hintBefore = 'Drag to look · Two-finger slide or wheel to move · Pinch to zoom';
  const hintAfter = 'Drag to look · Use arrows to move · Pinch to zoom';
  if (source.includes(hintBefore)) {
    source = replaceOnce(source, hintBefore, hintAfter, 'MOBILE_HINT');
    changed = true;
  }

  if (changed) await fs.writeFile(paths.html, source, 'utf8');
  return changed;
}

const mobileControlsSource = `/**\n * H_EARTH_RUN_8E_MOBILE_NAVIGATION_CONTROLS_v1\n *\n * Adds an explicit coarse-pointer movement surface without creating a new\n * navigation authority. All actions are proposals to the existing Run 6F\n * navigation API, which the Run 8E adapter renders through the successor\n * environment.\n */\n\nconst CONTROL_ID = 'h-earth-run8e-mobile-navigation-controls';\nconst STYLE_ID = 'h-earth-run8e-mobile-navigation-controls-style';\nconst HOLD_DELAY_MS = 260;\nconst HOLD_REPEAT_MS = 120;\nconst MOVE_MAGNITUDE = 6;\n\nconst freeze = (value) => Object.freeze(value);\nconst clonePlain = (value) => value == null ? value : JSON.parse(JSON.stringify(value));\n\nconst styleText = \`\n  #\${CONTROL_ID} {\n    position: absolute;\n    left: max(12px, env(safe-area-inset-left));\n    bottom: max(72px, calc(env(safe-area-inset-bottom) + 64px));\n    z-index: 12;\n    display: none;\n    grid-template-columns: repeat(3, 52px);\n    grid-template-rows: repeat(3, 52px);\n    gap: 6px;\n    padding: 8px;\n    border: 1px solid rgba(226, 255, 246, 0.26);\n    border-radius: 22px;\n    background: rgba(2, 8, 10, 0.78);\n    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36);\n    backdrop-filter: blur(14px);\n    touch-action: none;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n\n  #\${CONTROL_ID}[data-ready=\"true\"] { opacity: 1; }\n\n  #\${CONTROL_ID} button {\n    display: grid;\n    place-items: center;\n    min-width: 52px;\n    min-height: 52px;\n    margin: 0;\n    border: 1px solid rgba(226, 255, 246, 0.3);\n    border-radius: 16px;\n    color: #f2fbf8;\n    background: rgba(18, 34, 35, 0.94);\n    font: 800 1.2rem/1 system-ui, sans-serif;\n    -webkit-tap-highlight-color: transparent;\n    touch-action: none;\n  }\n\n  #\${CONTROL_ID} button:active,\n  #\${CONTROL_ID} button[data-active=\"true\"] {\n    translate: 0 1px;\n    background: rgba(62, 104, 91, 0.98);\n    border-color: rgba(224, 255, 244, 0.7);\n  }\n\n  #\${CONTROL_ID} [data-h-earth-mobile-action=\"MOVE_FORWARD\"] { grid-column: 2; grid-row: 1; }\n  #\${CONTROL_ID} [data-h-earth-mobile-action=\"STRAFE_LEFT\"] { grid-column: 1; grid-row: 2; }\n  #\${CONTROL_ID} [data-h-earth-mobile-reset=\"true\"] {\n    grid-column: 2;\n    grid-row: 2;\n    font-size: 0.65rem;\n    letter-spacing: 0.04em;\n    text-transform: uppercase;\n  }\n  #\${CONTROL_ID} [data-h-earth-mobile-action=\"STRAFE_RIGHT\"] { grid-column: 3; grid-row: 2; }\n  #\${CONTROL_ID} [data-h-earth-mobile-action=\"MOVE_BACKWARD\"] { grid-column: 2; grid-row: 3; }\n\n  @media (pointer: coarse), (max-width: 820px) {\n    #\${CONTROL_ID} { display: grid; }\n  }\n\n  @media (orientation: landscape) and (max-height: 560px) {\n    #\${CONTROL_ID} {\n      left: max(8px, env(safe-area-inset-left));\n      bottom: max(12px, env(safe-area-inset-bottom));\n      grid-template-columns: repeat(3, 46px);\n      grid-template-rows: repeat(3, 46px);\n      padding: 6px;\n    }\n    #\${CONTROL_ID} button { min-width: 46px; min-height: 46px; }\n  }\n\`;

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
  controls.innerHTML = \`\n    <button type=\"button\" data-h-earth-mobile-action=\"MOVE_FORWARD\" aria-label=\"Move forward\">▲</button>\n    <button type=\"button\" data-h-earth-mobile-action=\"STRAFE_LEFT\" aria-label=\"Move left\">◀</button>\n    <button type=\"button\" data-h-earth-mobile-reset=\"true\" aria-label=\"Return to coast and level the view\">Coast</button>\n    <button type=\"button\" data-h-earth-mobile-action=\"STRAFE_RIGHT\" aria-label=\"Move right\">▶</button>\n    <button type=\"button\" data-h-earth-mobile-action=\"MOVE_BACKWARD\" aria-label=\"Move backward\">▼</button>\n  \`;
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
  reset.addEventListener('click', async (event) => {
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
}\n`;

async function writeControlsModule() {
  let existing = null;
  try {
    existing = await fs.readFile(paths.controls, 'utf8');
  } catch {}
  if (existing === mobileControlsSource) return false;
  await fs.writeFile(paths.controls, mobileControlsSource, 'utf8');
  return true;
}

const results = {
  navigation: await updateNavigationSource(),
  integration: await updateIntegrationSource(),
  html: await updatePublicHtml(),
  controls: await writeControlsModule()
};

console.log(JSON.stringify({
  constructor: 'H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_CONSTRUCTOR_v1',
  results,
  changed: Object.values(results).some(Boolean)
}, null, 2));
