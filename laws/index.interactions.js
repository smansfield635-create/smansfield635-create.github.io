/* /laws/index.interactions.js
   Laws Round 4 centered compass-return wrapper.
   Loads the preserved interaction authority, then aligns the semantic return
   control with the visible center planet without changing Laws motion logic.
*/
(() => {
  "use strict";

  const BUILD = "LAWS_ROUND4_CENTER_RETURN_FIX_v1";
  const SOURCE_URL = `/laws/index.interactions.source.round4.js?build=${encodeURIComponent(BUILD)}`;

  function publish(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      preservedSource: "/laws/index.interactions.source.round4.js",
      visiblePlanetAndHitZoneAligned: true,
      explicitReturnFlowPreserved: true,
      immediateNavigationAdded: false,
      ...detail
    });
    globalThis.DGB_LAWS_ROUND4_COMPASS_RETURN_RECEIPT = receipt;
    globalThis.dispatchEvent(new CustomEvent("DGB_LAWS_ROUND4_COMPASS_RETURN_READY", {
      detail: receipt
    }));
    return receipt;
  }

  function bindCenteredReturnControl() {
    const control = document.querySelector("[data-laws-root] [data-upstream-compass-control]");
    if (!control || control.dataset.lawsRound4ReturnBound === "true") return false;

    control.dataset.lawsRound4ReturnBound = "true";
    control.dataset.lawsRound4HitZone = "visible-planet-bounds";

    control.addEventListener("click", event => {
      if (event.defaultPrevented) return;
      const controller = globalThis.DGB_LAWS_CONTROLLER;
      if (!controller || typeof controller.requestCompassSelection !== "function") return;
      event.preventDefault();
      controller.requestCompassSelection();
    });

    publish({ controlBound: true });
    return true;
  }

  function loadPreservedAuthority() {
    const script = document.createElement("script");
    script.src = SOURCE_URL;
    script.async = false;
    script.dataset.lawsRound4InteractionSource = "preserved";
    script.addEventListener("load", () => {
      bindCenteredReturnControl();
      [40, 160, 500].forEach(delay => setTimeout(bindCenteredReturnControl, delay));
    }, { once: true });
    script.addEventListener("error", () => {
      throw new Error("LAWS_ROUND4_PRESERVED_INTERACTION_SOURCE_LOAD_FAILED");
    }, { once: true });
    document.head.append(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindCenteredReturnControl, { once: true });
  } else {
    bindCenteredReturnControl();
  }

  loadPreservedAuthority();
})();