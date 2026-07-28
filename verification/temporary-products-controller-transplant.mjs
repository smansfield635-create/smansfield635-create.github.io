import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const FILES = Object.freeze({
  controller: "products/index.controller.js",
  html: "products/index.html",
  css: "products/index.arena.css"
});

const EXPECTED = Object.freeze({
  [FILES.controller]: "3eb38cc35a88936b884891d3dfe735a71583bf34",
  [FILES.html]: "61766e2d79dc4448d5c7772109e9383afa1eeca7",
  [FILES.css]: "eaed7439f2423375db90941f375dba6879654b0c"
});

function gitBlob(path) {
  return execFileSync("git", ["hash-object", path], { encoding: "utf8" }).trim();
}

function assertBaseline() {
  for (const [path, expected] of Object.entries(EXPECTED)) {
    const actual = gitBlob(path);
    if (actual !== expected) {
      throw new Error(`BASELINE_BLOB_MISMATCH:${path}:${actual}:${expected}`);
    }
  }
}

function count(source, anchor) {
  return source.split(anchor).length - 1;
}

function replaceUnique(source, anchor, replacement, label) {
  const occurrences = count(source, anchor);
  if (occurrences !== 1) {
    throw new Error(`ANCHOR_COUNT_INVALID:${label}:${occurrences}`);
  }
  return source.replace(anchor, replacement);
}

function patchController(source) {
  source = replaceUnique(
    source,
    '  const QUATERNION = Object.freeze({\n    minimumLength: 1e-8,\n    identity: Object.freeze([0, 0, 0, 1])\n  });',
    '  const QUATERNION = Object.freeze({\n    minimumLength: 1e-8,\n    identity: Object.freeze([0, 0, 0, 1])\n  });\n\n  const CENTER_CONTINUITY = Object.freeze({\n    route: "/",\n    allowedStates: Object.freeze([STATES.CLUSTER_OPEN, STATES.PRODUCT_SELECTED]),\n    doubleTapWindowMs: 300,\n    tapMaximumMovementPx: 10\n  });',
    "controller-center-constants"
  );

  source = replaceUnique(
    source,
    '    returnToConstellation: "[data-products-return-to-constellation]",\n    guidance: "[data-products-guidance]",',
    '    returnToConstellation: "[data-products-return-to-constellation]",\n    centerControl: "[data-products-center-control]",\n    returnMainCompass: "[data-products-return-main-compass]",\n    guidance: "[data-products-guidance]",',
    "controller-selectors"
  );

  source = replaceUnique(
    source,
    '    returnToConstellationButton: null,\n    guidance: null,',
    '    returnToConstellationButton: null,\n    centerControl: null,\n    returnMainCompass: null,\n    centerDisclosureOpen: false,\n    centerLastTapAt: 0,\n    centerPointer: null,\n    centerSuppressClickUntil: 0,\n    guidance: null,',
    "controller-state"
  );

  source = replaceUnique(
    source,
    '  function syncPresentation() {\n    syncDatasets();',
    '  function syncPresentation() {\n    syncDatasets();\n    syncCenterAvailability();',
    "controller-sync-presentation"
  );

  const centerFunctions = `
  function centerStateAllowed() {
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
      state.centerLastTapAt = 0;
      state.centerPointer = null;
      setCenterDisclosure(false);
    }

    return available;
  }

  function navigateToMainCompass(event, action) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!centerStateAllowed()) {
      return false;
    }

    emitReceipt({
      lastAction: action,
      lastFailure: null,
      returnRoute: CENTER_CONTINUITY.route
    });
    globalThis.location.assign(CENTER_CONTINUITY.route);
    return true;
  }

  function activateCenterDisclosure(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!centerStateAllowed()) {
      return false;
    }

    setCenterDisclosure(!state.centerDisclosureOpen);
    emitReceipt({
      lastAction: state.centerDisclosureOpen
        ? "center-disclosure-opened"
        : "center-disclosure-closed",
      lastFailure: null
    });
    return true;
  }

  function resetCenterPointer() {
    if (
      state.centerPointer &&
      state.centerControl?.hasPointerCapture?.(state.centerPointer.id)
    ) {
      try {
        state.centerControl.releasePointerCapture(state.centerPointer.id);
      } catch (_) {}
    }
    state.centerPointer = null;
  }

  function onCenterPointerDown(event) {
    if (!centerStateAllowed()) return;
    state.centerPointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false
    };
    try {
      state.centerControl.setPointerCapture(event.pointerId);
    } catch (_) {}
  }

  function onCenterPointerMove(event) {
    if (!state.centerPointer || event.pointerId !== state.centerPointer.id) return;
    const distance = Math.hypot(
      event.clientX - state.centerPointer.x,
      event.clientY - state.centerPointer.y
    );
    if (distance > CENTER_CONTINUITY.tapMaximumMovementPx) {
      state.centerPointer.moved = true;
      state.centerLastTapAt = 0;
    }
  }

  function onCenterPointerCancel(event) {
    if (!state.centerPointer || event.pointerId !== state.centerPointer.id) return;
    state.centerLastTapAt = 0;
    resetCenterPointer();
  }

  function onCenterPointerUp(event) {
    if (!state.centerPointer || event.pointerId !== state.centerPointer.id) return;
    const moved = state.centerPointer.moved;
    resetCenterPointer();
    if (moved) return;

    event.preventDefault();
    event.stopPropagation();
    state.centerSuppressClickUntil = performance.now() + 500;

    const now = performance.now();
    const doubleTap =
      state.centerLastTapAt > 0 &&
      now - state.centerLastTapAt <= CENTER_CONTINUITY.doubleTapWindowMs;

    if (doubleTap) {
      state.centerLastTapAt = 0;
      navigateToMainCompass(event, "double-tap-main-compass-navigation-requested");
      return;
    }

    state.centerLastTapAt = now;
    activateCenterDisclosure(event);
  }

  function onCenterClick(event) {
    if (performance.now() < state.centerSuppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    activateCenterDisclosure(event);
  }

  function bindCenterControls() {
    state.centerControl.addEventListener("pointerdown", onCenterPointerDown);
    state.centerControl.addEventListener("pointermove", onCenterPointerMove);
    state.centerControl.addEventListener("pointerup", onCenterPointerUp);
    state.centerControl.addEventListener("pointercancel", onCenterPointerCancel);
    state.centerControl.addEventListener("click", onCenterClick);
    state.returnMainCompass.addEventListener("click", event => {
      navigateToMainCompass(event, "explicit-main-compass-navigation-requested");
    });
  }

`;

  source = replaceUnique(
    source,
    '  function handleSemanticClick(event) {',
    `${centerFunctions}  function handleSemanticClick(event) {`,
    "controller-center-functions"
  );

  source = replaceUnique(
    source,
    '    state.returnToConstellationButton = qs(SELECTORS.returnToConstellation, state.root);\n    state.guidance = qs(SELECTORS.guidance, state.root);',
    '    state.returnToConstellationButton = qs(SELECTORS.returnToConstellation, state.root);\n    state.centerControl = qs(SELECTORS.centerControl, state.root);\n    if (!state.centerControl) {\n      throw new Error("PRODUCTS_CENTER_CONTROL_NOT_FOUND");\n    }\n    state.returnMainCompass = qs(SELECTORS.returnMainCompass, state.root);\n    if (!state.returnMainCompass) {\n      throw new Error("PRODUCTS_CENTER_RETURN_OPTION_NOT_FOUND");\n    }\n    if (String(state.centerControl.dataset.productsCenterRoute || "").trim() !== CENTER_CONTINUITY.route) {\n      throw new Error("PRODUCTS_CENTER_ROUTE_INVALID");\n    }\n    if (String(state.returnMainCompass.getAttribute("href") || "").trim() !== CENTER_CONTINUITY.route) {\n      throw new Error("PRODUCTS_CENTER_RETURN_OPTION_ROUTE_INVALID");\n    }\n    state.guidance = qs(SELECTORS.guidance, state.root);',
    "controller-resolve-dom"
  );

  source = replaceUnique(
    source,
    '      bindSemanticControls();\n      bindPanelControls();',
    '      bindSemanticControls();\n      bindPanelControls();\n      bindCenterControls();',
    "controller-initialize-binding"
  );

  if (source.includes("DGB_PRODUCTS_CONTROLLER_CENTER")) {
    throw new Error("SECOND_CONTROLLER_SYMBOL_DETECTED");
  }
  if (source.includes("DGB_PRODUCTS_CENTER_CONTROL_RECEIPT")) {
    throw new Error("SECOND_CONTROLLER_RECEIPT_DETECTED");
  }

  return source;
}

function patchHtml(source) {
  source = replaceUnique(
    source,
    '            <span>Compass-standard terminal arena</span>',
    '            <span>Center world opens return options</span>',
    "html-legend"
  );

  source = replaceUnique(
    source,
    '            ></div>\n\n            <div class="products-semantic" data-products-semantic aria-label="Enhanced Products semantic controls">',
    `            ></div>

            <button
              type="button"
              class="products-center-control"
              data-products-center-control
              data-products-center-route="/"
              data-products-center-role="MAIN_COMPASS_RETURN_DISCLOSURE"
              aria-label="Open Main Compass return option"
              aria-controls="products-context"
              aria-expanded="false"
              hidden
            >
              <span class="products-center-control__label">Main Compass options</span>
            </button>

            <div class="products-semantic" data-products-semantic aria-label="Enhanced Products semantic controls">`,
    "html-center-control"
  );

  source = replaceUnique(
    source,
    '              <button type="button" class="products-action" data-products-return-to-constellation hidden aria-hidden="true" aria-disabled="true" tabindex="-1">Return to Constellation</button>',
    '              <button type="button" class="products-action" data-products-return-to-constellation hidden aria-hidden="true" aria-disabled="true" tabindex="-1">Return to Constellation</button>\n              <a class="products-action products-action--main-compass" href="/" data-products-return-main-compass hidden aria-hidden="true" tabindex="-1">Return to Main Compass</a>',
    "html-return-option"
  );

  return source;
}

function patchCss(source) {
  if (source.includes("PRODUCTS_CENTER_CONTINUITY_PRESENTATION")) {
    throw new Error("CSS_CENTER_CONTINUITY_ALREADY_PRESENT");
  }

  return `${source.trimEnd()}\n\n/* PRODUCTS_CENTER_CONTINUITY_PRESENTATION */\n.products-center-control {\n  position: absolute;\n  inset: 50% auto auto 50%;\n  z-index: 4;\n  width: clamp(108px, 24vw, 148px);\n  height: clamp(108px, 24vw, 148px);\n  transform: translate(-50%, -50%);\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  touch-action: manipulation;\n}\n\n.products-center-control[hidden] {\n  display: none !important;\n}\n\n.products-center-control__label {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n}\n\n.products-action--main-compass[hidden] {\n  display: none !important;\n}\n`;
}

assertBaseline();

const originals = Object.freeze({
  controller: readFileSync(FILES.controller, "utf8"),
  html: readFileSync(FILES.html, "utf8"),
  css: readFileSync(FILES.css, "utf8")
});

const patched = Object.freeze({
  controller: patchController(originals.controller),
  html: patchHtml(originals.html),
  css: patchCss(originals.css)
});

writeFileSync(FILES.controller, patched.controller, "utf8");
writeFileSync(FILES.html, patched.html, "utf8");
writeFileSync(FILES.css, patched.css, "utf8");
