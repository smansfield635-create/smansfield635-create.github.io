(() => {
  "use strict";

  const CONTRACT = "METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3";
  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;

  const stage = root.querySelector(".mm-stage");
  const familyTabs = root.querySelector("[data-mm-family-tabs]");
  const deck = root.querySelector("[data-mm-model-deck]");
  const lensTabs = root.querySelector(".mm-lens-tabs");
  const coordinate = root.querySelector("[data-mm-coordinate]");
  const coordinateX = root.querySelector("[data-mm-coordinate-x]");
  const coordinateY = root.querySelector("[data-mm-coordinate-y]");
  const coordinateZ = root.querySelector("[data-mm-coordinate-z]");
  const dockCoordinate = document.querySelector("[data-mm-dock-coordinate]");
  if (!stage || !familyTabs || !deck || !lensTabs) return;

  let desiredLens = root.querySelector('[data-mm-lens-tab][aria-selected="true"]')?.dataset.mmLensTab || "practical";
  let syncQueued = false;
  let restoring = false;

  const normalize = (value, length) => length ? ((value % length) + length) % length : 0;
  const signedOffset = (index, active, length) => {
    if (!length) return 0;
    const forward = normalize(index - active, length);
    const backward = normalize(active - index, length);
    if (forward === 0) return 0;
    return forward <= backward ? forward : -backward;
  };

  const familyButtons = () => Array.from(familyTabs.querySelectorAll(".mm-family-tab"));
  const modelCards = () => Array.from(deck.querySelectorAll(".mm-model-card"));
  const lensButtons = () => Array.from(root.querySelectorAll("[data-mm-lens-tab]"));
  const selectedIndex = (items, predicate) => {
    const index = items.findIndex(predicate);
    return index >= 0 ? index : 0;
  };

  function setInteractive(element, interactive) {
    if (!element) return;
    if (interactive) {
      element.removeAttribute("aria-hidden");
      if ("inert" in element) element.inert = false;
      else element.removeAttribute("inert");
    } else {
      element.setAttribute("aria-hidden", "true");
      if ("inert" in element) element.inert = true;
      else element.setAttribute("inert", "");
    }
  }

  function restoreDesiredLens() {
    const buttons = lensButtons();
    const target = buttons.find(button => button.dataset.mmLensTab === desiredLens);
    if (!target || target.getAttribute("aria-selected") === "true") return false;
    restoring = true;
    target.click();
    restoring = false;
    return true;
  }

  function decorate(source) {
    if (restoreDesiredLens()) {
      scheduleSync("lens-restored");
      return;
    }

    const families = familyButtons();
    const models = modelCards();
    const lenses = lensButtons();
    const familyIndex = selectedIndex(families, button => button.getAttribute("aria-selected") === "true");
    const modelIndex = selectedIndex(models, card => card.dataset.position === "active");
    const lensIndex = selectedIndex(lenses, button => button.getAttribute("aria-selected") === "true");

    families.forEach((button, index) => {
      const offset = signedOffset(index, familyIndex, families.length);
      button.dataset.mmZPosition = offset === 0 ? "active" : offset === -1 ? "previous" : offset === 1 ? "next" : "far";
      button.style.setProperty("--mm-z-offset", String(offset));
      button.tabIndex = offset === 0 ? 0 : -1;
    });

    models.forEach((card, index) => {
      const offset = signedOffset(index, modelIndex, models.length);
      card.dataset.mmXPosition = offset === 0 ? "active" : offset === -1 ? "previous" : offset === 1 ? "next" : offset === -2 ? "previous-far" : offset === 2 ? "next-far" : "rear";
      card.style.setProperty("--mm-x-offset", String(offset));
      card.style.setProperty("--mm-x-distance", String(Math.abs(offset)));
      setInteractive(card, offset === 0);
    });

    lenses.forEach((button, index) => {
      const offset = signedOffset(index, lensIndex, lenses.length);
      button.dataset.mmYPosition = offset === 0 ? "active" : offset < 0 ? "previous" : "next";
      button.style.setProperty("--mm-y-offset", String(offset));
      button.tabIndex = offset === 0 ? 0 : -1;
    });

    const familyLabel = families[familyIndex]?.textContent?.trim() || "Family";
    const lensLabel = lenses[lensIndex]?.textContent?.trim() || "Lens";
    const x = `X ${String(modelIndex + 1).padStart(2, "0")}/${String(models.length).padStart(2, "0")}`;
    const y = `Y ${lensLabel.toUpperCase()}`;
    const z = `Z ${familyLabel.toUpperCase()}`;
    const complete = `${x} · ${y} · ${z}`;

    if (coordinateX) coordinateX.textContent = x;
    if (coordinateY) coordinateY.textContent = y;
    if (coordinateZ) coordinateZ.textContent = z;
    if (coordinate) coordinate.setAttribute("aria-label", complete);
    if (dockCoordinate) dockCoordinate.textContent = complete;
    root.dataset.mmX = String(modelIndex);
    root.dataset.mmY = String(lensIndex);
    root.dataset.mmZ = String(familyIndex);
    root.dataset.mmEuclideanReady = "true";

    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", {
      detail: Object.freeze({
        contract: CONTRACT,
        source,
        x: Object.freeze({ index: modelIndex, count: models.length, modelId: root.dataset.mmModel || "" }),
        y: Object.freeze({ index: lensIndex, count: lenses.length, lens: lenses[lensIndex]?.dataset.mmLensTab || "" }),
        z: Object.freeze({ index: familyIndex, count: families.length, familyId: root.dataset.mmFamily || document.body.dataset.mmFamily || "" }),
        display: document.body.dataset.mmDisplay || "expanded",
        productAcceptanceGranted: false
      })
    }));
  }

  function scheduleSync(source = "sync") {
    if (syncQueued) return;
    syncQueued = true;
    queueMicrotask(() => {
      syncQueued = false;
      decorate(source);
    });
  }

  lensTabs.addEventListener("click", event => {
    const button = event.target.closest("[data-mm-lens-tab]");
    if (!button || restoring) return;
    desiredLens = button.dataset.mmLensTab || desiredLens;
    scheduleSync("lens-selection");
  }, true);

  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", () => scheduleSync("base-state-change"));
  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_DISPLAY_CHANGED", () => scheduleSync("display-change"));

  const observer = new MutationObserver(() => scheduleSync("dom-change"));
  observer.observe(familyTabs, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
  observer.observe(deck, { childList: true, subtree: true });
  observer.observe(lensTabs, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });

  globalThis.METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3 = Object.freeze({
    contract: CONTRACT,
    getState: () => Object.freeze({
      x: Number(root.dataset.mmX || 0),
      y: Number(root.dataset.mmY || 0),
      z: Number(root.dataset.mmZ || 0),
      lens: desiredLens,
      display: document.body.dataset.mmDisplay || "expanded"
    })
  });

  document.documentElement.dataset.methodsModelsEuclideanShowroom = "active";
  document.documentElement.dataset.methodsModelsDisplayContract = CONTRACT;
  stage.dataset.mmEuclideanStage = "active";
  lensTabs.closest(".mm-lens")?.parentElement?.classList.add("mm-axis-footer");
  scheduleSync("initialization");
})();