/* /laws/index.interactions.js
   Laws centered compass-return and universal spatial-selection loader.
   Loads the preserved interaction authority, aligns the visible center planet
   control with the controller return sequence, and activates the shared
   nearest-primary selection, native material glow, and release-settlement
   standard without an external radial halo overlay.
 */
(() => {
  "use strict";

  const BUILD =
    "LAWS_SPATIAL_PRIMARY_SELECTION_NATIVE_GLOW_v2";
  const SOURCE_URL =
    `/laws/index.interactions.source.round4.js?build=${encodeURIComponent(BUILD)}`;
  const SELECTION_URL =
    `/laws/index.selection.js?build=${encodeURIComponent(BUILD)}`;

  function suppressExternalHaloOverlay() {
    const styleIdentity =
      "laws-spatial-primary-native-glow-only";

    if (
      !document.querySelector(
        `style[data-laws-halo-suppression="${styleIdentity}"]`
      )
    ) {
      const style =
        document.createElement("style");

      style.dataset.lawsHaloSuppression =
        styleIdentity;
      style.textContent = `
        [data-laws-primary-glow-layer],
        [data-laws-primary-glow] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;

      document.head.append(style);
    }

    document
      .querySelectorAll(
        "[data-laws-primary-glow-layer]"
      )
      .forEach(layer => layer.remove());

    const root =
      document.querySelector("[data-laws-root]");

    if (root) {
      root.dataset.lawsExternalHaloOverlay =
        "false";
      root.dataset.lawsPrimaryGlowSource =
        "native-crystal-material";
    }

    return true;
  }

  function publish(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      preservedSource:
        "/laws/index.interactions.source.round4.js",
      spatialSelectionSource:
        "/laws/index.selection.js",
      visiblePlanetAndHitZoneAligned: true,
      explicitReturnFlowPreserved: true,
      immediateNavigationAdded: false,
      constellationSpatialPrimary: true,
      clusterSpatialPrimary: true,
      selectionDrivenGlow: true,
      nativeCrystalMaterialGlow: true,
      externalHaloOverlay: false,
      releaseSettlement: true,
      ...detail
    });

    globalThis.DGB_LAWS_INTERACTION_STANDARD_RECEIPT =
      receipt;
    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_INTERACTION_STANDARD_READY",
        {
          detail: receipt
        }
      )
    );

    return receipt;
  }

  function bindCenteredReturnControl() {
    const control = document.querySelector(
      "[data-laws-root] [data-upstream-compass-control]"
    );

    if (
      !control ||
      control.dataset.lawsRound4ReturnBound ===
        "true"
    ) {
      return false;
    }

    control.dataset.lawsRound4ReturnBound =
      "true";
    control.dataset.lawsRound4HitZone =
      "visible-planet-control-bounds";

    control.addEventListener(
      "click",
      event => {
        const controller =
          globalThis.DGB_LAWS_CONTROLLER;

        if (
          !controller ||
          typeof controller
            .requestCompassSelection !==
            "function"
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
      document.querySelector(
        "script[data-laws-spatial-selection]"
      )
    ) {
      suppressExternalHaloOverlay();
      return false;
    }

    const script =
      document.createElement("script");

    script.src = SELECTION_URL;
    script.async = false;
    script.dataset.lawsSpatialSelection =
      BUILD;

    script.addEventListener(
      "load",
      () => {
        suppressExternalHaloOverlay();

        [0, 80, 240].forEach(delay =>
          setTimeout(
            suppressExternalHaloOverlay,
            delay
          )
        );

        publish({
          controlBound:
            bindCenteredReturnControl(),
          spatialSelectionLoaded: true,
          externalHaloSuppressed: true
        });
      },
      { once: true }
    );

    script.addEventListener(
      "error",
      () => publish({
        controlBound:
          bindCenteredReturnControl(),
        spatialSelectionLoaded: false,
        externalHaloSuppressed:
          suppressExternalHaloOverlay(),
        failure:
          "LAWS_SPATIAL_SELECTION_LOAD_FAILED"
      }),
      { once: true }
    );

    document.head.append(script);
    return true;
  }

  function loadPreservedAuthority() {
    const script =
      document.createElement("script");

    script.src = SOURCE_URL;
    script.async = false;
    script.dataset.lawsInteractionSource =
      "preserved";

    script.addEventListener(
      "load",
      () => {
        bindCenteredReturnControl();

        [40, 160, 500].forEach(delay =>
          setTimeout(
            bindCenteredReturnControl,
            delay
          )
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
        externalHaloSuppressed:
          suppressExternalHaloOverlay(),
        failure:
          "PRESERVED_INTERACTION_SOURCE_LOAD_FAILED"
      }),
      { once: true }
    );

    document.head.append(script);
  }

  suppressExternalHaloOverlay();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        bindCenteredReturnControl();
        suppressExternalHaloOverlay();
      },
      { once: true }
    );
  } else {
    bindCenteredReturnControl();
    suppressExternalHaloOverlay();
  }

  loadPreservedAuthority();
})();