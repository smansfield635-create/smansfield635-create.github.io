/* /laws/index.interactions.js
   Laws centered compass-return and universal spatial-selection loader.
   Preserves the existing Laws interaction authority, aligns the visible center
   planet control, activates spatial primary selection and release settlement,
   suppresses the rejected external halo overlay, and projects attached labels
   for the four main constellation stars.
 */
(() => {
  "use strict";

  const BUILD =
    "LAWS_COMPASS_SHARED_SPHERICAL_XYZ_CLUSTER_v1";
  const SOURCE_URL =
    `/laws/index.interactions.source.round4.js?build=${encodeURIComponent(BUILD)}`;
  const SELECTION_URL =
    `/laws/index.selection.js?build=${encodeURIComponent(BUILD)}`;

  const CATEGORY_LABELS = Object.freeze({
    flow: "Flow",
    integrity: "Integrity",
    reality: "Reality",
    structure: "Structure"
  });

  function presentationMode(frame) {
    return String(
      frame &&
      (
        frame.presentationMode ||
        (frame.presentation && frame.presentation.mode) ||
        ""
      )
    ).toUpperCase();
  }

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

  function installProjectedCategoryLabels() {
    const root =
      document.querySelector("[data-laws-root]");
    const field =
      root && root.querySelector("[data-laws-scene-field]");
    const controller =
      globalThis.DGB_LAWS_CONTROLLER;

    if (
      !root ||
      !field ||
      !controller ||
      typeof controller.getFrameState !== "function"
    ) {
      return false;
    }

    if (
      root.dataset.lawsProjectedCategoryLabelsBound ===
      "true"
    ) {
      return true;
    }

    let layer = field.querySelector(
      "[data-laws-projected-category-labels]"
    );

    if (!layer) {
      layer = document.createElement("div");
      layer.className =
        "laws-projected-category-labels";
      layer.dataset.lawsProjectedCategoryLabels =
        "true";
      field.append(layer);
    }

    if (
      !document.getElementById(
        "laws-projected-category-label-style"
      )
    ) {
      const style = document.createElement("style");
      style.id =
        "laws-projected-category-label-style";
      style.textContent = `
        .laws-projected-category-labels {
          position: absolute;
          inset: 0;
          z-index: 22;
          pointer-events: none;
        }

        .laws-projected-category-label {
          position: absolute;
          display: block;
          min-width: 4.4rem;
          padding: .34rem .52rem;
          border: 0;
          color: rgba(246, 238, 223, .94);
          background: transparent;
          font: 850 clamp(.62rem, 1.35vw, .78rem)/1.05 Inter, ui-sans-serif, system-ui, sans-serif;
          letter-spacing: .09em;
          text-align: center;
          text-transform: uppercase;
          text-shadow:
            0 .1rem .18rem rgba(0, 0, 0, .98),
            0 0 .46rem rgba(0, 0, 0, .98),
            0 0 .78rem rgba(124, 220, 255, .22);
          white-space: nowrap;
          cursor: pointer;
          pointer-events: auto;
          transform: translate(-50%, -50%);
          transform-origin: center;
          transition:
            opacity 150ms ease,
            filter 150ms ease,
            transform 150ms ease;
        }

        .laws-projected-category-label[data-direction="flow"] {
          color: rgba(210, 224, 255, .96);
        }

        .laws-projected-category-label[data-direction="integrity"] {
          color: rgba(175, 241, 250, .96);
        }

        .laws-projected-category-label[data-direction="reality"] {
          color: rgba(255, 226, 157, .96);
        }

        .laws-projected-category-label[data-direction="structure"] {
          color: rgba(255, 187, 145, .96);
        }

        .laws-projected-category-label[data-depth-layer="rear"] {
          opacity: .44;
          filter: saturate(.68) brightness(.68);
          transform: translate(-50%, -50%) scale(.86);
        }

        .laws-projected-category-label[data-depth-layer="front"] {
          opacity: .9;
        }

        .laws-projected-category-label[data-primary="true"] {
          opacity: 1;
          color: #fff3be;
          filter:
            brightness(1.16)
            drop-shadow(0 0 .52rem rgba(245, 213, 130, .38));
          transform: translate(-50%, -50%) scale(1.08);
        }

        .laws-projected-category-label:hover,
        .laws-projected-category-label:focus-visible {
          color: #fff8dc;
          filter:
            brightness(1.18)
            drop-shadow(0 0 .62rem rgba(124, 220, 255, .38));
        }

        .laws-projected-category-label:focus-visible {
          outline: 2px solid rgba(124, 220, 255, .9);
          outline-offset: .16rem;
          border-radius: .4rem;
        }
      `;
      document.head.append(style);
    }

    const controls = new Map();

    for (
      const [direction, label]
      of Object.entries(CATEGORY_LABELS)
    ) {
      let control = layer.querySelector(
        `[data-laws-projected-category-label="${direction}"]`
      );

      if (!control) {
        control = document.createElement("button");
        control.type = "button";
        control.className =
          "laws-projected-category-label";
        control.dataset.lawsProjectedCategoryLabel =
          direction;
        control.dataset.direction = direction;
        control.textContent = label;
        control.setAttribute(
          "aria-label",
          `Open ${label}`
        );
        control.addEventListener(
          "click",
          event => {
            event.preventDefault();

            const activeController =
              globalThis.DGB_LAWS_CONTROLLER;

            if (
              activeController &&
              typeof activeController
                .requestCategorySelection ===
                "function"
            ) {
              activeController
                .requestCategorySelection(direction);
            }
          }
        );
        layer.append(control);
      }

      controls.set(direction, control);
    }

    function apply(records) {
      let frame = null;

      try {
        frame = controller.getFrameState();
      } catch (_) {
        frame = null;
      }

      const constellation =
        frame &&
        presentationMode(frame) === "CONSTELLATION" &&
        frame.held !== true;
      const fieldRect =
        field.getBoundingClientRect();
      const centerX =
        fieldRect.width * 0.5;
      const centerY =
        fieldRect.height * 0.5;
      const byId = new Map();

      for (const record of Array.from(records || [])) {
        const kind = String(record && record.kind || "")
          .toLowerCase();
        const id = String(
          record &&
          (
            record.id ||
            record.direction ||
            ""
          )
        ).toLowerCase();

        if (
          id &&
          (
            kind === "category" ||
            kind === "direction" ||
            !kind
          )
        ) {
          byId.set(id, record);
        }
      }

      const primaryId = String(
        root.dataset.lawsSpatialPrimaryId ||
        (frame && frame.orbitPreviewFocus) ||
        (frame && frame.orbitFocus) ||
        ""
      ).toLowerCase();

      for (const [direction, control] of controls) {
        const record = byId.get(direction);

        if (
          !constellation ||
          !record ||
          record.visible === false
        ) {
          control.hidden = true;
          continue;
        }

        const x = Number(record.x);
        const y = Number(record.y);

        if (
          !Number.isFinite(x) ||
          !Number.isFinite(y)
        ) {
          control.hidden = true;
          continue;
        }

        const dx = x - centerX;
        const dy = y - centerY;
        const length = Math.hypot(dx, dy) || 1;
        const radius = Math.max(
          28,
          Number(
            record.radiusPx ||
            record.radius ||
            record.hitRadius ||
            record.screenRadius
          ) || 28
        );
        const outward = Math.min(
          66,
          Math.max(36, radius * 0.66 + 10)
        );
        const depthLayer = String(
          record.depthLayer || "unknown"
        ).toLowerCase();

        control.hidden = false;
        control.style.left =
          `${x + (dx / length) * outward}px`;
        control.style.top =
          `${y + (dy / length) * outward}px`;
        control.style.zIndex = String(
          depthLayer === "rear" ? 2 : 9
        );
        control.dataset.depthLayer = depthLayer;
        control.dataset.primary = String(
          direction === primaryId
        );
      }
    }

    let records =
      typeof controller.getSemanticProjection ===
        "function"
        ? controller.getSemanticProjection()
        : [];

    apply(records);

    if (
      typeof controller.subscribeSemanticProjection ===
      "function"
    ) {
      controller.subscribeSemanticProjection(next => {
        records = Array.from(next || []);
        apply(records);
      });
    }

    if (
      typeof controller.subscribeFrameState ===
      "function"
    ) {
      controller.subscribeFrameState(() =>
        apply(records)
      );
    }

    globalThis.addEventListener(
      "resize",
      () => apply(records),
      { passive: true }
    );

    root.dataset.lawsProjectedCategoryLabelsBound =
      "true";
    root.dataset.lawsConstellationLabels =
      "flow-integrity-reality-structure";

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
      horizontalDragYawSign: "POSITIVE",
      clusterGeometryModel:
        "BOUNDED_NONCOPLANAR_SPHERICAL_XYZ_CLUSTER",
      lawScaleProfile:
        Object.freeze([0.68, 0.84, 0.91]),
      projectedConstellationLabels:
        Object.freeze({ ...CATEGORY_LABELS }),
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

  function finalizeSpatialSupport() {
    suppressExternalHaloOverlay();

    const labelsInstalled =
      installProjectedCategoryLabels();

    if (!labelsInstalled) {
      [80, 240, 600].forEach(delay =>
        setTimeout(
          installProjectedCategoryLabels,
          delay
        )
      );
    }

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
      externalHaloSuppressed: true,
      projectedCategoryLabelsInstalled:
        labelsInstalled
    });
  }

  function loadSpatialSelection() {
    if (
      globalThis.DGB_LAWS_SPATIAL_SELECTION ||
      document.querySelector(
        "script[data-laws-spatial-selection]"
      )
    ) {
      finalizeSpatialSupport();
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
      finalizeSpatialSupport,
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
        projectedCategoryLabelsInstalled:
          installProjectedCategoryLabels(),
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
        projectedCategoryLabelsInstalled:
          installProjectedCategoryLabels(),
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