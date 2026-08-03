(() => {
  "use strict";

  const CONTRACT = "METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3";
  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;

  const elements = {
    stage: root.querySelector(".mm-stage"),
    familyTabs: root.querySelector("[data-mm-family-tabs]"),
    deck: root.querySelector("[data-mm-model-deck]"),
    previous: root.querySelector("[data-mm-previous]"),
    next: root.querySelector("[data-mm-next]"),
    lensTabs: root.querySelector(".mm-lens-tabs"),
    lensButtons: () => Array.from(root.querySelectorAll("[data-mm-lens-tab]")),
    lensPanel: root.querySelector("[data-mm-lens-panel]"),
    progress: root.querySelector("[data-mm-progress]"),
    familyPrevious: root.querySelector("[data-mm-family-previous]"),
    familyNext: root.querySelector("[data-mm-family-next]"),
    coordinate: root.querySelector("[data-mm-coordinate]"),
    coordinateX: root.querySelector("[data-mm-coordinate-x]"),
    coordinateY: root.querySelector("[data-mm-coordinate-y]"),
    coordinateZ: root.querySelector("[data-mm-coordinate-z]"),
    dock: document.querySelector("[data-mm-dock]"),
    dockCoordinate: document.querySelector("[data-mm-dock-coordinate]"),
    dialog: document.querySelector("[data-mm-dialog]")
  };

  if (!elements.stage || !elements.familyTabs || !elements.deck || !elements.lensTabs) return;

  const state = {
    familyIndex: 0,
    modelIndex: 0,
    modelCount: 0,
    lensIndex: 0,
    transitionTimer: 0,
    wheelLocks: { x: 0, y: 0, z: 0 },
    pointer: {
      deck: null,
      family: null,
      lens: null
    }
  };

  const normalize = (value, length) => length ? ((value % length) + length) % length : 0;

  function signedOffset(index, active, length) {
    if (!length) return 0;
    const forward = normalize(index - active, length);
    const backward = normalize(active - index, length);
    if (forward === 0) return 0;
    return forward <= backward ? forward : -backward;
  }

  function familyButtons() {
    return Array.from(elements.familyTabs.querySelectorAll(".mm-family-tab"));
  }

  function modelCards() {
    return Array.from(elements.deck.querySelectorAll(".mm-model-card"));
  }

  function activeFamilyIndex() {
    const buttons = familyButtons();
    const selected = buttons.findIndex(button => button.getAttribute("aria-selected") === "true");
    return selected >= 0 ? selected : 0;
  }

  function activeModelIndex() {
    const cards = modelCards();
    const selected = cards.findIndex(card => card.dataset.position === "active");
    return selected >= 0 ? selected : 0;
  }

  function activeLensIndex() {
    const buttons = elements.lensButtons();
    const selected = buttons.findIndex(button => button.getAttribute("aria-selected") === "true");
    return selected >= 0 ? selected : 0;
  }

  function xPosition(offset) {
    if (offset === 0) return "active";
    if (offset === -1) return "previous";
    if (offset === 1) return "next";
    if (offset === -2) return "previous-far";
    if (offset === 2) return "next-far";
    return "rear";
  }

  function yPosition(offset) {
    if (offset === 0) return "active";
    if (offset < 0) return "previous";
    return "next";
  }

  function zPosition(offset) {
    if (offset === 0) return "active";
    if (offset === -1) return "previous";
    if (offset === 1) return "next";
    return "far";
  }

  function setInteractive(element, interactive) {
    if (!element) return;
    if (interactive) {
      element.removeAttribute("aria-hidden");
      if ("inert" in element) element.inert = false;
      else element.removeAttribute("inert");
      return;
    }
    element.setAttribute("aria-hidden", "true");
    if ("inert" in element) element.inert = true;
    else element.setAttribute("inert", "");
  }

  function decorateFamilies() {
    const buttons = familyButtons();
    state.familyIndex = activeFamilyIndex();
    buttons.forEach((button, index) => {
      const offset = signedOffset(index, state.familyIndex, buttons.length);
      const position = zPosition(offset);
      button.dataset.mmZPosition = position;
      button.style.setProperty("--mm-z-offset", String(offset));
      button.setAttribute("aria-label", `Z axis family ${index + 1} of ${buttons.length}: ${button.textContent.trim()}`);
      button.setAttribute("aria-hidden", String(position !== "active"));
      if ("inert" in button) button.inert = false;
      else button.removeAttribute("inert");
      if (position !== "active") button.tabIndex = -1;
    });
  }

  function decorateModels() {
    const cards = modelCards();
    state.modelIndex = activeModelIndex();
    state.modelCount = cards.length;
    cards.forEach((card, index) => {
      const offset = signedOffset(index, state.modelIndex, cards.length);
      const position = xPosition(offset);
      card.dataset.mmXPosition = position;
      card.style.setProperty("--mm-x-offset", String(offset));
      card.style.setProperty("--mm-x-distance", String(Math.abs(offset)));
      setInteractive(card, position === "active");
    });
  }

  function decorateLenses() {
    const buttons = elements.lensButtons();
    state.lensIndex = activeLensIndex();
    buttons.forEach((button, index) => {
      const offset = signedOffset(index, state.lensIndex, buttons.length);
      const position = yPosition(offset);
      button.dataset.mmYPosition = position;
      button.style.setProperty("--mm-y-offset", String(offset));
      button.setAttribute("aria-label", `Y axis lens ${index + 1} of ${buttons.length}: ${button.textContent.trim()}`);
      if (position !== "active") button.tabIndex = -1;
    });
  }

  function familyLabel() {
    return familyButtons()[state.familyIndex]?.textContent?.trim() || "Family";
  }

  function lensLabel() {
    return elements.lensButtons()[state.lensIndex]?.textContent?.trim() || "Lens";
  }

  function coordinateText() {
    const x = `X ${String(state.modelIndex + 1).padStart(2, "0")}/${String(state.modelCount).padStart(2, "0")}`;
    const y = `Y ${lensLabel().toUpperCase()}`;
    const z = `Z ${familyLabel().toUpperCase()}`;
    return { x, y, z, complete: `${x} · ${y} · ${z}` };
  }

  function updateCoordinates() {
    const coordinates = coordinateText();
    if (elements.coordinateX) elements.coordinateX.textContent = coordinates.x;
    if (elements.coordinateY) elements.coordinateY.textContent = coordinates.y;
    if (elements.coordinateZ) elements.coordinateZ.textContent = coordinates.z;
    if (elements.coordinate) elements.coordinate.setAttribute("aria-label", coordinates.complete);
    if (elements.dockCoordinate) elements.dockCoordinate.textContent = coordinates.complete;
    root.dataset.mmX = String(state.modelIndex);
    root.dataset.mmY = String(state.lensIndex);
    root.dataset.mmZ = String(state.familyIndex);
  }

  function publish(source) {
    const detail = Object.freeze({
      contract: CONTRACT,
      source,
      x: Object.freeze({ index: state.modelIndex, count: state.modelCount, modelId: root.dataset.mmModel || "" }),
      y: Object.freeze({ index: state.lensIndex, count: elements.lensButtons().length, lens: elements.lensButtons()[state.lensIndex]?.dataset.mmLensTab || "" }),
      z: Object.freeze({ index: state.familyIndex, count: familyButtons().length, familyId: root.dataset.mmFamily || document.body.dataset.mmFamily || "" }),
      display: document.body.dataset.mmDisplay || "expanded",
      productAcceptanceGranted: false,
      sourceCompletenessClaimed: false
    });
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", { detail }));
  }

  function clearTransition() {
    globalThis.clearTimeout(state.transitionTimer);
    delete root.dataset.mmTransitionAxis;
    delete root.dataset.mmTransitionDirection;
    delete root.dataset.mmTransitioning;
  }

  function beginTransition(axis, direction) {
    clearTransition();
    root.dataset.mmTransitionAxis = axis;
    root.dataset.mmTransitionDirection = direction;
    root.dataset.mmTransitioning = "true";
    state.transitionTimer = globalThis.setTimeout(clearTransition, 560);
  }

  function sync(source = "sync") {
    queueMicrotask(() => {
      decorateFamilies();
      decorateModels();
      decorateLenses();
      updateCoordinates();
      root.dataset.mmEuclideanReady = "true";
      publish(source);
    });
  }

  function moveModel(delta, source = "x-control") {
    beginTransition("x", delta > 0 ? "next" : "previous");
    (delta > 0 ? elements.next : elements.previous)?.click();
    publish(source);
  }

  function moveFamily(delta, source = "z-control") {
    const buttons = familyButtons();
    if (!buttons.length) return;
    const preservedLensIndex = state.lensIndex;
    beginTransition("z", delta > 0 ? "next" : "previous");
    buttons[normalize(state.familyIndex + delta, buttons.length)]?.click();

    // The inherited family renderer defaults its lens to Practical. In the
    // Euclidean state model X, Y, and Z are independent coordinates, so a Z
    // rotation must restore the previously active Y plane immediately.
    const lenses = elements.lensButtons();
    if (lenses[preservedLensIndex]?.getAttribute("aria-selected") !== "true") {
      lenses[preservedLensIndex]?.click();
    }
    publish(source);
  }

  function moveLens(delta, source = "y-control") {
    const buttons = elements.lensButtons();
    if (!buttons.length) return;
    beginTransition("y", delta > 0 ? "next" : "previous");
    buttons[normalize(state.lensIndex + delta, buttons.length)]?.click();
    publish(source);
  }

  function captureFamilyClick(event) {
    const button = event.target.closest(".mm-family-tab");
    if (!button) return;
    const buttons = familyButtons();
    const target = buttons.indexOf(button);
    const offset = signedOffset(target, state.familyIndex, buttons.length);
    if (offset) beginTransition("z", offset > 0 ? "next" : "previous");
  }

  function captureLensClick(event) {
    const button = event.target.closest("[data-mm-lens-tab]");
    if (!button) return;
    const buttons = elements.lensButtons();
    const target = buttons.indexOf(button);
    const offset = signedOffset(target, state.lensIndex, buttons.length);
    if (offset) beginTransition("y", offset > 0 ? "next" : "previous");
  }

  function captureModelControl(event) {
    if (event.target.closest("[data-mm-next], [data-mm-dock-next]")) beginTransition("x", "next");
    if (event.target.closest("[data-mm-previous], [data-mm-dock-previous]")) beginTransition("x", "previous");
  }

  function pointerStart(slot, event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    state.pointer[slot] = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function pointerFinish(slot, event, handler) {
    const start = state.pointer[slot];
    state.pointer[slot] = null;
    if (!start || start.id !== event.pointerId) return;
    handler(event.clientX - start.x, event.clientY - start.y);
  }

  function wheelMove(axis, delta, callback) {
    const now = performance.now();
    if (now < state.wheelLocks[axis]) return;
    state.wheelLocks[axis] = now + 320;
    callback(delta > 0 ? 1 : -1);
  }

  elements.familyTabs.addEventListener("click", captureFamilyClick, true);
  elements.lensTabs.addEventListener("click", captureLensClick, true);
  root.addEventListener("click", captureModelControl, true);

  elements.familyPrevious?.addEventListener("click", () => moveFamily(-1, "z-previous-control"));
  elements.familyNext?.addEventListener("click", () => moveFamily(1, "z-next-control"));

  elements.familyTabs.addEventListener("pointerdown", event => pointerStart("family", event), true);
  elements.familyTabs.addEventListener("pointerup", event => pointerFinish("family", event, (_dx, dy) => {
    if (Math.abs(dy) >= 34) moveFamily(dy > 0 ? 1 : -1, "z-drag");
  }), true);
  elements.familyTabs.addEventListener("pointercancel", () => { state.pointer.family = null; }, true);
  elements.familyTabs.addEventListener("wheel", event => {
    event.preventDefault();
    wheelMove("z", event.deltaY || event.deltaX, delta => moveFamily(delta, "z-wheel"));
  }, { passive: false });

  elements.lensTabs.addEventListener("pointerdown", event => pointerStart("lens", event), true);
  elements.lensTabs.addEventListener("pointerup", event => pointerFinish("lens", event, (_dx, dy) => {
    if (Math.abs(dy) >= 30) moveLens(dy > 0 ? 1 : -1, "y-drag");
  }), true);
  elements.lensTabs.addEventListener("pointercancel", () => { state.pointer.lens = null; }, true);
  elements.lensTabs.addEventListener("wheel", event => {
    event.preventDefault();
    wheelMove("y", event.deltaY || event.deltaX, delta => moveLens(delta, "y-wheel"));
  }, { passive: false });

  elements.deck.addEventListener("pointerdown", event => pointerStart("deck", event), true);
  elements.deck.addEventListener("pointerup", event => pointerFinish("deck", event, (dx, dy) => {
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) >= 44) {
      event.preventDefault();
      moveLens(dy > 0 ? 1 : -1, "y-stage-swipe");
    } else if (Math.abs(dx) >= 44) {
      beginTransition("x", dx < 0 ? "next" : "previous");
    }
  }), true);
  elements.deck.addEventListener("pointercancel", () => { state.pointer.deck = null; }, true);

  root.addEventListener("keydown", event => {
    if (elements.dialog?.open || event.target !== elements.deck) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveLens(-1, "y-keyboard");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveLens(1, "y-keyboard");
    } else if (event.key === "PageUp" || event.key === "[") {
      event.preventDefault();
      moveFamily(-1, "z-keyboard");
    } else if (event.key === "PageDown" || event.key === "]") {
      event.preventDefault();
      moveFamily(1, "z-keyboard");
    }
  }, true);

  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", () => sync("base-state-change"));
  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_DISPLAY_CHANGED", () => sync("display-change"));

  const observer = new MutationObserver(() => sync("dom-change"));
  observer.observe(elements.familyTabs, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
  observer.observe(elements.deck, { childList: true, subtree: true });
  observer.observe(elements.lensTabs, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });

  if (elements.dialog) {
    const dialogObserver = new MutationObserver(() => {
      document.documentElement.dataset.methodsModelsInspection = elements.dialog.open ? "open" : "closed";
    });
    dialogObserver.observe(elements.dialog, { attributes: true, attributeFilter: ["open"] });
  }

  globalThis.METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3 = Object.freeze({
    contract: CONTRACT,
    getState: () => Object.freeze({
      x: state.modelIndex,
      y: state.lensIndex,
      z: state.familyIndex,
      display: document.body.dataset.mmDisplay || "expanded"
    }),
    moveModel,
    moveLens,
    moveFamily
  });

  document.documentElement.dataset.methodsModelsEuclideanShowroom = "active";
  document.documentElement.dataset.methodsModelsDisplayContract = CONTRACT;
  elements.stage.dataset.mmEuclideanStage = "active";
  elements.lensTabs.closest(".mm-lens")?.parentElement?.classList.add("mm-axis-footer");
  sync("initialization");
})();