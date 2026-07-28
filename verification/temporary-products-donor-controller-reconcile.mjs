import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const path = 'products/index.controller.js';
let source = fs.readFileSync(path, 'utf8');

function replaceExact(label, before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one anchor, found ${count}`);
  source = source.replace(before, after);
}

replaceExact(
  'center continuity constants',
`  const CENTER_CONTINUITY = Object.freeze({
    route: "/",
    allowedStates: Object.freeze([STATES.CLUSTER_OPEN, STATES.PRODUCT_SELECTED]),
    doubleTapWindowMs: 300,
    tapMaximumMovementPx: 10
  });`,
`  const CENTER_CONTINUITY = Object.freeze({
    route: "/",
    allowedStates: Object.freeze([STATES.CLUSTER_OPEN, STATES.PRODUCT_SELECTED]),
    immediateNavigation: false,
    explicitReturnRequired: true
  });`
);

replaceExact(
  'contaminated center state',
`    centerDisclosureOpen: false,
    centerLastTapAt: 0,
    centerPointer: null,
    centerSuppressClickUntil: 0,`,
`    centerDisclosureOpen: false,`
);

const blockStart = source.indexOf('  function centerStateAllowed() {');
const blockEnd = source.indexOf('  function handleSemanticClick(event) {');
if (blockStart < 0 || blockEnd < 0 || blockEnd <= blockStart) {
  throw new Error('center behavior block anchors not found');
}

const donorBlock = `  function centerStateAllowed() {
    return CENTER_CONTINUITY.allowedStates.includes(state.current);
  }

  function setCenterDisclosure(open) {
    state.centerDisclosureOpen = Boolean(open) && centerStateAllowed();

    if (state.centerControl) {
      state.centerControl.setAttribute(
        "aria-expanded",
        state.centerDisclosureOpen ? "true" : "false"
      );
    }

    if (state.returnMainCompass) {
      state.returnMainCompass.hidden = !state.centerDisclosureOpen;
      state.returnMainCompass.setAttribute(
        "aria-hidden",
        state.centerDisclosureOpen ? "false" : "true"
      );
      state.returnMainCompass.tabIndex = state.centerDisclosureOpen ? 0 : -1;
    }

    if (state.root) {
      state.root.dataset.productsCenterDisclosure = state.centerDisclosureOpen
        ? "open"
        : "closed";
    }

    return state.centerDisclosureOpen;
  }

  function syncCenterAvailability() {
    if (!state.centerControl) {
      return false;
    }

    const available = centerStateAllowed() && state.current !== STATES.HELD;
    state.centerControl.hidden = !available;
    state.centerControl.disabled = !available;
    state.centerControl.setAttribute("aria-hidden", available ? "false" : "true");
    state.centerControl.setAttribute("aria-disabled", available ? "false" : "true");
    state.centerControl.tabIndex = available ? 0 : -1;

    if (!available) {
      setCenterDisclosure(false);
    }

    return available;
  }

  function requestCompassSelection(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!centerStateAllowed() || state.current === STATES.HELD) {
      return false;
    }

    clearViewportSchedules();
    setCenterDisclosure(true);

    emitReceipt({
      lastAction: "compass-selected-local",
      lastFailure: null,
      selectedDestinationType: "home-compass",
      selectedDestinationId: "main-compass",
      selectedDestinationLabel: "Main Compass",
      selectedRoute: CENTER_CONTINUITY.route,
      immediateNavigation: false,
      explicitReturnRequired: true
    });

    if (state.previewPanel) {
      state.previewPanel.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    return true;
  }

  function requestReturnToMainCompass(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (
      !centerStateAllowed() ||
      !state.centerDisclosureOpen ||
      state.current === STATES.HELD
    ) {
      return false;
    }

    emitReceipt({
      lastAction: "main-compass-return-confirmed",
      lastFailure: null,
      returnRoute: CENTER_CONTINUITY.route
    });

    globalThis.location.assign(CENTER_CONTINUITY.route);
    return true;
  }

  function bindCenterControls() {
    state.centerControl.addEventListener("click", requestCompassSelection);
    state.returnMainCompass.addEventListener("click", requestReturnToMainCompass);
  }

`;

source = source.slice(0, blockStart) + donorBlock + source.slice(blockEnd);

replaceExact(
  'public API center methods',
`      requestReturnToConstellation,
      requestPrimaryProductsSelection,
      requestProductSelection,

      /* DOM-facing extensions outside the frozen renderer-facing grammar. */`,
`      requestReturnToConstellation,
      requestPrimaryProductsSelection,
      requestProductSelection,
      requestCompassSelection,
      requestReturnToMainCompass,

      /* DOM-facing extensions outside the frozen renderer-facing grammar. */`
);

for (const forbidden of [
  'doubleTapWindowMs',
  'tapMaximumMovementPx',
  'centerLastTapAt',
  'centerPointer',
  'centerSuppressClickUntil',
  'onCenterPointerDown',
  'onCenterPointerMove',
  'onCenterPointerUp',
  'onCenterPointerCancel',
  'double-tap-main-compass-navigation-requested'
]) {
  if (source.includes(forbidden)) throw new Error(`forbidden contaminated token remains: ${forbidden}`);
}

for (const required of [
  'function requestCompassSelection(event)',
  'function requestReturnToMainCompass(event)',
  '"compass-selected-local"',
  '"main-compass-return-confirmed"',
  'explicitReturnRequired: true'
]) {
  if (!source.includes(required)) throw new Error(`required donor token missing: ${required}`);
}

fs.writeFileSync(path, source);
execFileSync('node', ['--check', path], { stdio: 'inherit' });
execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });
console.log('PRODUCTS_DONOR_CONTROLLER_RECONCILIATION_PASS');
