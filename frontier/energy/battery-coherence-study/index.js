(() => {
  "use strict";

  const CONTRACT = "BATTERY_COHERENCE_HELDOUT_NATIVE_WORKFLOW_JS_TNT_v1";
  const root = document.documentElement;
  const buttons = Array.from(document.querySelectorAll("[data-lens-button]"));
  const copies = Array.from(document.querySelectorAll("[data-lens-copy]"));
  const disclosures = Array.from(document.querySelectorAll("details[data-disclosure]"));

  function normalizeLens(value) {
    return ["platform", "engineering", "evidence"].includes(value)
      ? value
      : "platform";
  }

  function setLens(value, source = "runtime") {
    const lens = normalizeLens(value);
    root.dataset.activeLens = lens;
    root.dataset.lensChangeSource = source;

    buttons.forEach((button) => {
      const selected = button.dataset.lensButton === lens;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
    });

    copies.forEach((copy) => {
      copy.dataset.active = copy.dataset.lensCopy === lens ? "true" : "false";
    });

    try {
      sessionStorage.setItem("dgbBatteryStudyLens", lens);
    } catch (_) {
      // Storage is optional; the page remains fully functional without it.
    }
  }

  function restoreLens() {
    let saved = "platform";
    try {
      saved = sessionStorage.getItem("dgbBatteryStudyLens") || saved;
    } catch (_) {
      // Ignore unavailable storage.
    }
    setLens(saved, "restore");
  }

  function bindLensButtons() {
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => setLens(button.dataset.lensButton, "pointer"));
      button.addEventListener("keydown", (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        buttons[next].focus();
        setLens(buttons[next].dataset.lensButton, "keyboard");
      });
    });
  }

  function bindDisclosurePolicy() {
    disclosures.forEach((details) => {
      details.addEventListener("toggle", () => {
        details.dataset.openState = details.open ? "open" : "closed";
      });
    });
  }

  function initialize() {
    root.dataset.batteryStudyInteractionContract = CONTRACT;
    root.dataset.progressiveDisclosure = "active";
    root.dataset.keyboardLensNavigation = "active";
    bindLensButtons();
    bindDisclosurePolicy();
    restoreLens();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();