/*
 * Laws root Rolodex placement continuity.
 * Retires the superseded CP6 tab relocation so visitor-intent navigation
 * remains in the full-width root flow beneath the accepted Compass.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOT_ROLODEX_PLACEMENT_CONTINUITY_v1";
  let originSnapshot = null;

  function viewportSnapshots() {
    return Array.from(document.querySelectorAll(".laws-rolodex-viewport")).map(viewport => ({
      viewport,
      scrollLeft: viewport.scrollLeft
    }));
  }

  function captureOrigin() {
    originSnapshot = {
      scrollX: globalThis.scrollX,
      scrollY: globalThis.scrollY,
      viewports: viewportSnapshots()
    };
  }

  function restoreOrigin() {
    if (!originSnapshot) return;
    const snapshot = originSnapshot;
    originSnapshot = null;
    requestAnimationFrame(() => {
      for (const entry of snapshot.viewports) {
        entry.viewport.scrollLeft = entry.scrollLeft;
      }
      globalThis.scrollTo(snapshot.scrollX, snapshot.scrollY);
    });
  }

  function placeRolodex() {
    const section = document.querySelector("[data-laws-root-rolodex-section]");
    if (!section) return false;

    const useStage = document.querySelector(".laws-use-stage[data-laws-experience-stage='use']");
    if (useStage) {
      useStage.replaceWith(section);
    } else {
      const hero = document.querySelector("[data-laws-experience-stage='hero']");
      if (hero?.parentElement && section.previousElementSibling !== hero) hero.after(section);
    }

    section.dataset.lawsExperienceVisible = "true";
    document.querySelector(".laws-accessibility-note")?.remove();

    const footerDescription = document.querySelector(".laws-footer > div > span");
    if (footerDescription) {
      footerDescription.textContent = "Choose a direction in the Compass or continue to a destination.";
    }

    document.documentElement.dataset.lawsRolodexPlacement = "full-width-root-flow";
    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_PLACEMENT_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        fullWidthRootFlow: true,
        redundantUseStageVisible: false,
        runtimeCustodyNoteVisible: false,
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
    return true;
  }

  function initialize() {
    placeRolodex();
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", placeRolodex);
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_OPENED", captureOrigin);
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_CLOSED", restoreOrigin);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
