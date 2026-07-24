/* /laws/index.presentation.js
   Laws-only presentation standard.

   Owns:
   - Compass-family front/rear orbital contrast.
   - Attached constellation labels for Flow, Integrity, Reality, Structure.
   - Collapsed-by-default disclosure state with + closed / − open symbols.

   Preserves:
   - Laws geometry, controller state, spatial selection, release settlement,
     globe, routes, formulas, evidence posture, and page copy.
 */
(() => {
  "use strict";

  const CONTRACT =
    "DGB_LAWS_ORBITAL_CONTRAST_LABELS_AND_DISCLOSURES_v1";

  const DIRECTIONS = Object.freeze([
    "flow",
    "integrity",
    "reality",
    "structure"
  ]);

  const LABELS = Object.freeze({
    flow: "Flow",
    integrity: "Integrity",
    reality: "Reality",
    structure: "Structure"
  });

  const OFFSETS = Object.freeze({
    flow: Object.freeze({ x: "-50%", y: "-142%" }),
    integrity: Object.freeze({ x: "22%", y: "-52%" }),
    reality: Object.freeze({ x: "-50%", y: "48%" }),
    structure: Object.freeze({ x: "-122%", y: "-52%" })
  });

  const state = {
    root: null,
    field: null,
    controller: null,
    labels: new Map(),
    projections: Object.freeze([]),
    frame: null,
    bound: false,
    initializedAt: 0
  };

  const finite = (value, fallback = 0) =>
    Number.isFinite(Number(value)) ? Number(value) : fallback;

  const normalize = value =>
    String(value == null ? "" : value).trim().toLowerCase();

  function presentationMode(frame = state.frame) {
    return String(
      frame &&
      (
        frame.presentationMode ||
        (frame.presentation && frame.presentation.mode) ||
        ""
      )
    ).toUpperCase();
  }

  function installStyle() {
    if (
      document.querySelector(
        `style[data-laws-presentation-contract="${CONTRACT}"]`
      )
    ) {
      return false;
    }

    const style = document.createElement("style");
    style.dataset.lawsPresentationContract = CONTRACT;
    style.textContent = `
      [data-laws-compositor-layer="front"] {
        filter:
          contrast(1.20)
          brightness(1.12)
          saturate(1.12)
          drop-shadow(0 0 4px rgba(255, 255, 255, 0.10));
        opacity: 1;
      }

      [data-laws-compositor-layer="rear"] {
        filter:
          contrast(1.08)
          brightness(0.69)
          saturate(0.74);
        opacity: 0.76;
      }

      [data-laws-constellation-label-layer] {
        position: absolute;
        inset: 0;
        z-index: 19;
        pointer-events: none;
        overflow: hidden;
        contain: layout paint;
      }

      [data-laws-constellation-label] {
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2rem;
        padding: 0.34rem 0.62rem;
        border: 1px solid rgba(232, 227, 210, 0.18);
        border-radius: 999px;
        color: rgba(255, 248, 224, 0.92);
        background: rgba(5, 9, 18, 0.74);
        box-shadow:
          0 8px 22px rgba(0, 0, 0, 0.32),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        font: 800 0.72rem/1 Inter, ui-sans-serif, system-ui, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        white-space: nowrap;
        pointer-events: auto;
        cursor: pointer;
        opacity: 0;
        transform:
          translate(var(--laws-label-x, -50%), var(--laws-label-y, -50%))
          scale(var(--laws-label-scale, 0.92));
        transition:
          left 90ms linear,
          top 90ms linear,
          opacity 120ms ease,
          transform 140ms ease,
          filter 140ms ease,
          background 140ms ease,
          border-color 140ms ease;
        will-change: left, top, opacity, transform;
      }

      [data-laws-constellation-label][data-visible="true"] {
        opacity: var(--laws-label-opacity, 0.86);
      }

      [data-laws-constellation-label][data-depth="rear"] {
        filter: brightness(0.68) saturate(0.72);
      }

      [data-laws-constellation-label][data-primary="true"] {
        color: rgba(255, 252, 238, 1);
        background: rgba(9, 15, 28, 0.90);
        border-color: rgba(243, 217, 139, 0.58);
        filter:
          brightness(1.16)
          drop-shadow(0 0 8px rgba(243, 217, 139, 0.30));
        --laws-label-scale: 1.06;
        --laws-label-opacity: 1;
      }

      main details > summary {
        cursor: pointer;
      }

      main details > summary::after {
        content: "+" !important;
        display: inline-grid;
        place-items: center;
        min-width: 1.55rem;
        min-height: 1.55rem;
        margin-inline-start: 0.72rem;
        border: 1px solid rgba(216, 184, 106, 0.28);
        border-radius: 999px;
        color: rgba(243, 217, 139, 0.96);
        background: rgba(216, 184, 106, 0.07);
        font: 800 1rem/1 ui-sans-serif, system-ui, sans-serif;
        vertical-align: middle;
      }

      main details[open] > summary::after {
        content: "−" !important;
      }

      @media (max-width: 560px) {
        [data-laws-constellation-label] {
          min-height: 1.8rem;
          padding: 0.30rem 0.50rem;
          font-size: 0.66rem;
          letter-spacing: 0.10em;
        }

        [data-laws-compositor-layer="front"] {
          filter:
            contrast(1.22)
            brightness(1.14)
            saturate(1.14)
            drop-shadow(0 0 4px rgba(255, 255, 255, 0.10));
        }

        [data-laws-compositor-layer="rear"] {
          filter:
            contrast(1.07)
            brightness(0.66)
            saturate(0.70);
          opacity: 0.72;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-laws-constellation-label] {
          transition: none;
        }
      }
    `;

    document.head.append(style);
    return true;
  }

  function collapseDisclosures() {
    const details = Array.from(
      document.querySelectorAll("main details")
    );

    details.forEach(element => {
      element.open = false;
      element.dataset.lawsInitialDisclosureState = "collapsed";

      const summary = element.querySelector(":scope > summary");
      if (summary) {
        summary.setAttribute("aria-expanded", "false");
      }

      element.addEventListener("toggle", () => {
        const currentSummary = element.querySelector(":scope > summary");
        if (currentSummary) {
          currentSummary.setAttribute(
            "aria-expanded",
            element.open ? "true" : "false"
          );
        }
      });
    });

    if (state.root) {
      state.root.dataset.lawsDisclosureDefault = "collapsed";
      state.root.dataset.lawsDisclosureClosedSymbol = "+";
      state.root.dataset.lawsDisclosureOpenSymbol = "−";
    }

    return details.length;
  }

  function categoryRecord(direction) {
    return state.projections.find(record => {
      if (!record || record.visible === false) return false;

      const kind = normalize(record.kind);
      const id = normalize(
        record.id || record.direction || record.categoryId
      );

      return (
        (kind === "category" || kind === "direction") &&
        id === direction
      );
    }) || null;
  }

  function primaryDirection() {
    const rootPrimary = normalize(
      state.root && state.root.dataset.lawsSpatialPrimaryId
    );

    if (DIRECTIONS.includes(rootPrimary)) {
      return rootPrimary;
    }

    const framePrimary = normalize(
      state.frame && state.frame.orbitPreviewFocus
    );

    return DIRECTIONS.includes(framePrimary)
      ? framePrimary
      : "";
  }

  function controlFor(direction) {
    return state.root && state.root.querySelector(
      `[data-laws-category][data-direction="${direction}"]`
    );
  }

  function createLabelLayer() {
    let layer = state.field.querySelector(
      "[data-laws-constellation-label-layer]"
    );

    if (!layer) {
      layer = document.createElement("div");
      layer.dataset.lawsConstellationLabelLayer = CONTRACT;
      layer.setAttribute("aria-label", "Laws constellation labels");
      state.field.append(layer);
    }

    DIRECTIONS.forEach(direction => {
      let label = layer.querySelector(
        `[data-laws-constellation-label="${direction}"]`
      );

      if (!label) {
        label = document.createElement("button");
        label.type = "button";
        label.dataset.lawsConstellationLabel = direction;
        label.dataset.visible = "false";
        label.dataset.primary = "false";
        label.textContent = LABELS[direction];
        label.setAttribute(
          "aria-label",
          `Open the ${LABELS[direction]} law family`
        );

        label.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          const control = controlFor(direction);
          if (control && typeof control.click === "function") {
            control.click();
          }
        });

        layer.append(label);
      }

      state.labels.set(direction, label);
    });

    return layer;
  }

  function hideLabels() {
    state.labels.forEach(label => {
      label.dataset.visible = "false";
      label.dataset.primary = "false";
    });
  }

  function updateLabels() {
    if (!state.bound) return false;

    if (presentationMode() !== "CONSTELLATION") {
      hideLabels();
      return false;
    }

    const primary = primaryDirection();

    DIRECTIONS.forEach(direction => {
      const label = state.labels.get(direction);
      const record = categoryRecord(direction);

      if (!label || !record) {
        if (label) label.dataset.visible = "false";
        return;
      }

      const x = finite(record.x);
      const y = finite(record.y);
      const radius = Math.max(
        28,
        finite(
          record.radiusPx ||
          record.radius ||
          record.hitRadius ||
          record.screenRadius,
          54
        )
      );
      const depth = normalize(
        record.depthLayer || record.layer || record.depthClass
      );
      const rear = depth === "rear";
      const offset = OFFSETS[direction];
      const depthScale = rear ? 0.84 : 0.96;
      const radiusScale = Math.max(0.88, Math.min(1.12, radius / 58));

      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.style.setProperty("--laws-label-x", offset.x);
      label.style.setProperty("--laws-label-y", offset.y);
      label.style.setProperty(
        "--laws-label-scale",
        String(depthScale * radiusScale)
      );
      label.style.setProperty(
        "--laws-label-opacity",
        rear ? "0.58" : "0.90"
      );
      label.dataset.depth = rear ? "rear" : "front";
      label.dataset.primary = direction === primary ? "true" : "false";
      label.dataset.visible = "true";
    });

    return true;
  }

  function subscribeController() {
    try {
      state.frame = state.controller.getFrameState();
      state.projections = Object.freeze(
        Array.from(state.controller.getSemanticProjection() || [])
      );

      state.controller.subscribeFrameState(frame => {
        state.frame = frame;
        updateLabels();
      });

      state.controller.subscribeSemanticProjection(records => {
        state.projections = Object.freeze(Array.from(records || []));
        updateLabels();
      });

      return true;
    } catch (_) {
      return false;
    }
  }

  function initialize() {
    if (state.bound) return true;

    state.root = document.querySelector("[data-laws-root]");
    state.field = state.root && state.root.querySelector(
      "[data-laws-scene-field]"
    );
    state.controller = globalThis.DGB_LAWS_CONTROLLER;

    if (
      !state.root ||
      !state.field ||
      !state.controller ||
      typeof state.controller.getFrameState !== "function" ||
      typeof state.controller.getSemanticProjection !== "function" ||
      typeof state.controller.subscribeFrameState !== "function" ||
      typeof state.controller.subscribeSemanticProjection !== "function"
    ) {
      return false;
    }

    installStyle();
    collapseDisclosures();
    createLabelLayer();

    if (!subscribeController()) {
      return false;
    }

    state.bound = true;
    state.initializedAt = Date.now();

    state.root.dataset.lawsOrbitalContrastStandard = "compass-family";
    state.root.dataset.lawsConstellationLabels = "flow-integrity-reality-structure";
    state.root.dataset.lawsPresentationContract = CONTRACT;

    updateLabels();

    globalThis.DGB_LAWS_PRESENTATION = Object.freeze({
      contract: CONTRACT,
      getState: () => Object.freeze({
        bound: state.bound,
        labelCount: state.labels.size,
        disclosureDefault: "collapsed",
        frontContrast: true,
        rearRecession: true,
        initializedAt: state.initializedAt
      })
    });

    globalThis.dispatchEvent(
      new CustomEvent("DGB_LAWS_PRESENTATION_READY", {
        detail: Object.freeze({
          contract: CONTRACT,
          orbitalContrast: true,
          constellationLabels: DIRECTIONS.slice(),
          disclosureDefault: "collapsed",
          closedSymbol: "+",
          openSymbol: "−"
        })
      })
    );

    return true;
  }

  function activate() {
    if (!initialize()) {
      globalThis.setTimeout(activate, 80);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate, { once: true });
  } else {
    activate();
  }
})();