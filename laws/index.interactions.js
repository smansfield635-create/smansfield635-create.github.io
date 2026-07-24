/* /laws/index.interactions.js
   Laws centered compass-return and universal spatial-selection loader.
   Loads the preserved interaction authority, aligns the visible center planet
   control with the controller return sequence, and activates the shared
   nearest-primary selection, glow, and release-settlement standard.
*/
(() => {
  "use strict";

  const BUILD =
    "LAWS_SPATIAL_PRIMARY_SELECTION_GLOW_SETTLEMENT_v1";
  const SOURCE_URL =
    `/laws/index.interactions.source.round4.js?build=${encodeURIComponent(BUILD)}`;
  const SELECTION_URL =
    `/laws/index.selection.js?build=${encodeURIComponent(BUILD)}`;

  function publish(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      preservedSource: "/laws/index.interactions.source.round4.js",
      spatialSelectionSource: "/laws/index.selection.js",
      visiblePlanetAndHitZoneAligned: true,
      explicitReturnFlowPreserved: true,
      immediateNavigationAdded: false,
      constellationSpatialPrimary: true,
      clusterSpatialPrimary: true,
      selectionDrivenGlow: true,
      releaseSettlement: true,
      ...detail
    });

    globalThis.DGB_LAWS_INTERACTION_STANDARD_RECEIPT = receipt;
    globalThis.dispatchEvent(
      new CustomEvent("DGB_LAWS_INTERACTION_STANDARD_READY", {
        detail: receipt
      })
    );
    return receipt;
  }

  function bindCenteredReturnControl() {
    const control = document.querySelector(
      "[data-laws-root] [data-upstream-compass-control]"
    );

    if (
      !control ||
      control.dataset.lawsRound4ReturnBound === "true"
    ) {
      return false;
    }

    control.dataset.lawsRound4ReturnBound = "true";
    control.dataset.lawsRound4HitZone =
      "visible-planet-control-bounds";

    control.addEventListener(
      "click",
      event => {
        const controller = globalThis.DGB_LAWS_CONTROLLER;
        if (
          !controller ||
          typeof controller.requestCompassSelection !== "function"
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        controller.requestCompassSelection();
      },
      true
    );

    return true;
  }

  function loadSpatialSelection() {
    if (
      globalThis.DGB_LAWS_SPATIAL_SELECTION ||
      document.querySelector("script[data-laws-spatial-selection]")
    ) {
      return false;
    }

    const script = document.createElement("script");
    script.src = SELECTION_URL;
    script.async = false;
    script.dataset.lawsSpatialSelection = BUILD;
    script.addEventListener(
      "load",
      () => publish({
        controlBound: bindCenteredReturnControl(),
        spatialSelectionLoaded: true
      }),
      { once: true }
    );
    script.addEventListener(
      "error",
      () => publish({
        controlBound: bindCenteredReturnControl(),
        spatialSelectionLoaded: false,
        failure: "LAWS_SPATIAL_SELECTION_LOAD_FAILED"
      }),
      { once: true }
    );
    document.head.append(script);
    return true;
  }

  function loadPreservedAuthority() {
    const script = document.createElement("script");
    script.src = SOURCE_URL;
    script.async = false;
    script.dataset.lawsInteractionSource = "preserved";
    script.addEventListener(
      "load",
      () => {
        bindCenteredReturnControl();
        [40, 160, 500].forEach(delay =>
          setTimeout(bindCenteredReturnControl, delay)
        );
        loadSpatialSelection();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => publish({
        controlBound: false,
        spatialSelectionLoaded: false,
        failure: "PRESERVED_INTERACTION_SOURCE_LOAD_FAILED"
      }),
      { once: true }
    );
    document.head.append(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      bindCenteredReturnControl,
      { once: true }
    );
  } else {
    bindCenteredReturnControl();
  }

  loadPreservedAuthority();
})();
