// /showroom/index.ui.js
// SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Bind the public Object View and Lattice View controls.
// - Bind Inspect and Reset without owning rendering.
// - Synchronize aria-pressed, active-state, status text, and selected-facet text.
// - Wait for the G3 renderer and respond to its public events.
// - Preserve hidden technical dimension controls for internal diagnostics.
// - Provide keyboard access without introducing additional public buttons.
//
// Owns:
// - showroom diamond UI controls
// - accessible control state
// - renderer-ready synchronization
// - status text
// - selected-facet descriptions
// - keyboard commands
// - UI receipt
//
// Does not own:
// - geometry
// - Canvas context
// - WebGL
// - shaders
// - GPU buffers
// - requestAnimationFrame
// - camera mathematics
// - pointer rotation
// - touch rotation
// - rendering
// - Map Portal

(function installShowroomDiamondG3UI(root, doc) {
  "use strict";

  const CONTRACT =
    "SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_TNT_v1";

  const RENDERER_CONTRACT =
    "SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1";

  const GEOMETRY_CONTRACT =
    "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1";

  const CONTRACT_FAMILY =
    "SHOWROOM_DIAMOND_G3_TRUE_3D_OBJECT_LATTICE_FOUR_FILE_FAMILY_v1";

  const ROUTE = "/showroom/";
  const FILE = "/showroom/index.ui.js";

  const EVENT_READY = "showroom-diamond-g3-ready";
  const EVENT_STATE = "showroom-diamond-g3-state";
  const EVENT_SELECTION = "showroom-diamond-g3-selection";
  const EVENT_CONTEXT_LOST = "showroom-diamond-g3-context-lost";
  const EVENT_FALLBACK = "showroom-diamond-g3-fallback";

  const SELECTORS = Object.freeze({
    stage:
      "[data-showroom-diamond-stage]",

    status:
      "[data-showroom-diamond-status]",

    inspect:
      "[data-showroom-diamond-inspect]",

    reset:
      "[data-showroom-diamond-reset]",

    objectView:
      '[data-diamond-lens="crystal"]',

    latticeView:
      '[data-diamond-lens="lattice"]',

    lensControls:
      "[data-diamond-lens]",

    dimensionControls:
      "[data-diamond-dimension]",

    publicControls:
      ".two-view-buttons button",

    technicalBridge:
      "[data-technical-control-options-hidden]"
  });

  const VIEW_COPY = Object.freeze({
    object: Object.freeze({
      label:
        "Object View",

      status:
        "Object View active · gold crown · bridge girdle · sapphire pavilion",

      shortStatus:
        "Object View active",

      lens:
        "crystal",

      dimension:
        "object"
    }),

    lattice: Object.freeze({
      label:
        "Lattice View",

      status:
        "Lattice View active · 16 radial sectors · 16 structural bands · 256 internal seats",

      shortStatus:
        "Lattice View active",

      lens:
        "lattice",

      dimension:
        "through"
    })
  });

  const DIMENSION_COPY = Object.freeze({
    object:
      "Object View active · complete physical computational gem",

    memory:
      "World Memory active · physical object with restrained internal pressure",

    behind:
      "Lattice Behind active · major structural proof behind the surface",

    through:
      "Lattice Through active · 256-seat internal structure visible",

    full:
      "Full Proof active · complete 16 × 16 structural field"
  });

  const state = {
    renderer:
      null,

    stage:
      null,

    statusNode:
      null,

    inspectButton:
      null,

    resetButton:
      null,

    objectButton:
      null,

    latticeButton:
      null,

    publicButtons:
      [],

    lensButtons:
      [],

    dimensionButtons:
      [],

    technicalBridge:
      null,

    initialized:
      false,

    disposed:
      false,

    rendererBound:
      false,

    rendererReady:
      false,

    activeView:
      "object",

    activeLens:
      "crystal",

    activeDimension:
      "object",

    selectedFacet:
      null,

    lastRendererStatus:
      null,

    lastStatusText:
      "",

    bindAttempts:
      0,

    eventCount:
      0,

    actionCount:
      0,

    selectionCount:
      0,

    errors:
      [],

    lastReceipt:
      null,

    abortController:
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null
  };

  const signal =
    state.abortController
      ? state.abortController.signal
      : undefined;

  if (
    root.__SHOWROOM_DIAMOND_G3_UI_CONTROLLER__ &&
    typeof root.__SHOWROOM_DIAMOND_G3_UI_CONTROLLER__.dispose === "function"
  ) {
    try {
      root.__SHOWROOM_DIAMOND_G3_UI_CONTROLLER__.dispose();
    } catch (_error) {}
  }

  function query(selector, owner) {
    const scope =
      owner ||
      doc;

    try {
      return scope.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function queryAll(selector, owner) {
    const scope =
      owner ||
      doc;

    try {
      return Array.from(
        scope.querySelectorAll(selector)
      );
    } catch (_error) {
      return [];
    }
  }

  function setDataset(name, value) {
    const text =
      String(value);

    try {
      doc.documentElement.dataset[name] =
        text;

      if (doc.body) {
        doc.body.dataset[name] =
          text;
      }
    } catch (_error) {}
  }

  function dispatch(name, detail) {
    try {
      root.dispatchEvent(
        new CustomEvent(
          name,
          {
            detail
          }
        )
      );
    } catch (_error) {}
  }

  function recordError(scope, error) {
    const message =
      error &&
      error.message
        ? error.message
        : String(
            error ||
            scope
          );

    state.errors.push(
      Object.freeze({
        scope,
        message,
        time:
          new Date().toISOString()
      })
    );

    setDataset(
      "showroomDiamondG3UiError",
      message
    );

    setStatus(
      `Diamond controls unavailable · ${message}`,
      {
        force:
          true,

        error:
          true
      }
    );

    publishReceipt(
      `error:${scope}`
    );
  }

  function setStatus(text, options) {
    const settings =
      options ||
      {};

    const value =
      String(
        text ||
        ""
      );

    if (
      !settings.force &&
      value ===
      state.lastStatusText
    ) {
      return false;
    }

    state.lastStatusText =
      value;

    if (
      state.statusNode &&
      state.statusNode.textContent !==
      value
    ) {
      state.statusNode.textContent =
        value;
    }

    if (state.statusNode) {
      state.statusNode.dataset.statusKind =
        settings.error
          ? "error"
          : settings.selection
            ? "selection"
            : settings.waiting
              ? "waiting"
              : "normal";
    }

    setDataset(
      "showroomDiamondG3UiStatus",
      value
    );

    return true;
  }

  function setButtonPressed(button, pressed) {
    if (!button) {
      return;
    }

    const active =
      Boolean(
        pressed
      );

    button.setAttribute(
      "aria-pressed",
      String(active)
    );

    if (active) {
      button.setAttribute(
        "data-active",
        ""
      );
    } else {
      button.removeAttribute(
        "data-active"
      );
    }
  }

  function setButtonEnabled(button, enabled) {
    if (!button) {
      return;
    }

    button.disabled =
      !enabled;

    button.setAttribute(
      "aria-disabled",
      String(!enabled)
    );
  }

  function enableControls(enabled) {
    for (
      const button of
      [
        ...state.publicButtons,
        ...state.dimensionButtons,
        state.inspectButton,
        state.resetButton
      ]
    ) {
      setButtonEnabled(
        button,
        enabled
      );
    }
  }

  function normalizeView(value) {
    return value ===
    "lattice"
      ? "lattice"
      : "object";
  }

  function normalizeLens(value) {
    return value ===
    "lattice"
      ? "lattice"
      : "crystal";
  }

  function normalizeDimension(value) {
    return Object.prototype.hasOwnProperty.call(
      DIMENSION_COPY,
      value
    )
      ? value
      : "object";
  }

  function resolveRenderer() {
    const candidate =
      root.DGBShowroomDiamondG3 ||
      root.DGBShowroomDiamondG2 ||
      null;

    if (!candidate) {
      return null;
    }

    if (
      typeof candidate.status !==
      "function"
    ) {
      return null;
    }

    const rendererStatus =
      candidate.status();

    if (
      rendererStatus &&
      rendererStatus.contract &&
      rendererStatus.contract !==
      RENDERER_CONTRACT
    ) {
      return null;
    }

    return candidate;
  }

  function getRendererStatus() {
    if (
      !state.renderer ||
      typeof state.renderer.status !==
      "function"
    ) {
      return null;
    }

    try {
      return state.renderer.status();
    } catch (error) {
      recordError(
        "renderer-status",
        error
      );

      return null;
    }
  }

  function describeSelection(selection) {
    if (!selection) {
      return null;
    }

    const facetId =
      selection.facetId ||
      selection.selectedFacetId ||
      "Facet";

    const material =
      selection.materialRegion ||
      "unclassified material";

    const bandUpper =
      Number.isInteger(
        selection.bandUpper
      )
        ? `B${selection.bandUpper}`
        : null;

    const bandLower =
      Number.isInteger(
        selection.bandLower
      )
        ? `B${selection.bandLower}`
        : null;

    const radialStart =
      Number.isInteger(
        selection.radialStart
      )
        ? `R${selection.radialStart}`
        : null;

    const radialEnd =
      Number.isInteger(
        selection.radialEnd
      )
        ? `R${selection.radialEnd}`
        : null;

    const bands =
      bandUpper &&
      bandLower
        ? bandUpper === bandLower
          ? bandUpper
          : `${bandUpper}–${bandLower}`
        : "band unreported";

    const radials =
      radialStart &&
      radialEnd
        ? radialStart === radialEnd
          ? radialStart
          : `${radialStart}–${radialEnd}`
        : "sector unreported";

    return (
      `${facetId} selected · ` +
      `${material.replaceAll("_", " ")} · ` +
      `${bands} · ${radials}`
    );
  }

  function statusForRendererSnapshot(snapshot) {
    if (!snapshot) {
      return "Preparing the G3 Diamond Lattice…";
    }

    if (snapshot.contextLost) {
      return "WebGL context lost · waiting for restoration";
    }

    if (
      Array.isArray(
        snapshot.errors
      ) &&
      snapshot.errors.length
    ) {
      const latest =
        snapshot.errors[
          snapshot.errors.length -
          1
        ];

      return (
        "Diamond renderer error · " +
        (
          latest &&
          latest.message
            ? latest.message
            : "unknown renderer error"
        )
      );
    }

    if (!snapshot.ready) {
      if (!snapshot.geometryReady) {
        return "Preparing the 16 × 16 geometry authority…";
      }

      if (!snapshot.canvasReady) {
        return "Preparing the showroom diamond stage…";
      }

      if (!snapshot.webglReady) {
        return "Preparing native WebGL…";
      }

      return "Preparing the G3 Diamond Lattice…";
    }

    if (state.selectedFacet) {
      return describeSelection(
        state.selectedFacet
      );
    }

    const dimension =
      normalizeDimension(
        snapshot.activeDimension
      );

    if (
      Object.prototype.hasOwnProperty.call(
        DIMENSION_COPY,
        dimension
      )
    ) {
      return DIMENSION_COPY[
        dimension
      ];
    }

    return snapshot.activeView ===
    "lattice"
      ? VIEW_COPY.lattice.status
      : VIEW_COPY.object.status;
  }

  function synchronizeButtons(snapshot) {
    const current =
      snapshot ||
      state.lastRendererStatus ||
      {};

    const view =
      normalizeView(
        current.activeView ||
        state.activeView
      );

    const lens =
      normalizeLens(
        current.activeLens ||
        state.activeLens
      );

    const dimension =
      normalizeDimension(
        current.activeDimension ||
        state.activeDimension
      );

    state.activeView =
      view;

    state.activeLens =
      lens;

    state.activeDimension =
      dimension;

    setButtonPressed(
      state.objectButton,
      view ===
      "object"
    );

    setButtonPressed(
      state.latticeButton,
      view ===
      "lattice"
    );

    for (
      const button of
      state.lensButtons
    ) {
      const buttonLens =
        normalizeLens(
          button.dataset.diamondLens
        );

      setButtonPressed(
        button,
        buttonLens ===
        lens
      );
    }

    for (
      const button of
      state.dimensionButtons
    ) {
      const buttonDimension =
        normalizeDimension(
          button.dataset.diamondDimension
        );

      const publicObjectButton =
        button ===
        state.objectButton;

      if (
        publicObjectButton &&
        view ===
        "object"
      ) {
        setButtonPressed(
          button,
          true
        );

        continue;
      }

      setButtonPressed(
        button,
        buttonDimension ===
        dimension
      );
    }

    setDataset(
      "showroomDiamondG3UiView",
      view
    );

    setDataset(
      "showroomDiamondG3UiLens",
      lens
    );

    setDataset(
      "showroomDiamondG3UiDimension",
      dimension
    );

    if (state.stage) {
      state.stage.dataset.uiView =
        view;

      state.stage.dataset.uiLens =
        lens;

      state.stage.dataset.uiDimension =
        dimension;
    }
  }

  function synchronizeFromRenderer(snapshot, scope) {
    const current =
      snapshot ||
      getRendererStatus();

    if (!current) {
      state.rendererReady =
        false;

      enableControls(
        false
      );

      setStatus(
        "Preparing the G3 Diamond Lattice…",
        {
          waiting:
            true
        }
      );

      publishReceipt(
        scope ||
        "renderer-unavailable"
      );

      return false;
    }

    state.lastRendererStatus =
      current;

    state.rendererReady =
      Boolean(
        current.ready
      );

    synchronizeButtons(
      current
    );

    enableControls(
      state.rendererReady
    );

    const statusText =
      statusForRendererSnapshot(
        current
      );

    const hasError =
      Boolean(
        current.contextLost ||
        (
          Array.isArray(
            current.errors
          ) &&
          current.errors.length
        )
      );

    setStatus(
      statusText,
      {
        error:
          hasError,

        waiting:
          !current.ready,

        selection:
          Boolean(
            state.selectedFacet
          )
      }
    );

    publishReceipt(
      scope ||
      "renderer-sync"
    );

    return true;
  }

  function executeRendererAction(scope, action) {
    if (
      !state.renderer ||
      typeof action !==
      "function"
    ) {
      setStatus(
        "Diamond renderer is not ready.",
        {
          waiting:
            true,

          force:
            true
        }
      );

      return null;
    }

    try {
      state.actionCount += 1;

      const result =
        action();

      synchronizeFromRenderer(
        result &&
        result.contract
          ? result
          : null,
        scope
      );

      return result;
    } catch (error) {
      recordError(
        scope,
        error
      );

      return null;
    }
  }

  function activateObjectView() {
    state.selectedFacet =
      null;

    return executeRendererAction(
      "object-view",
      () => {
        if (
          typeof state.renderer.setView ===
          "function"
        ) {
          return state.renderer.setView(
            "object"
          );
        }

        if (
          typeof state.renderer.setLens ===
          "function"
        ) {
          state.renderer.setLens(
            "crystal"
          );
        }

        if (
          typeof state.renderer.setDimension ===
          "function"
        ) {
          return state.renderer.setDimension(
            "object"
          );
        }

        return null;
      }
    );
  }

  function activateLatticeView() {
    state.selectedFacet =
      null;

    return executeRendererAction(
      "lattice-view",
      () => {
        if (
          typeof state.renderer.setView ===
          "function"
        ) {
          return state.renderer.setView(
            "lattice"
          );
        }

        if (
          typeof state.renderer.setLens ===
          "function"
        ) {
          state.renderer.setLens(
            "lattice"
          );
        }

        if (
          typeof state.renderer.setDimension ===
          "function"
        ) {
          return state.renderer.setDimension(
            "through"
          );
        }

        return null;
      }
    );
  }

  function activateDimension(dimension) {
    const normalized =
      normalizeDimension(
        dimension
      );

    state.selectedFacet =
      null;

    return executeRendererAction(
      `dimension:${normalized}`,
      () => {
        if (
          typeof state.renderer.setDimension !==
          "function"
        ) {
          return null;
        }

        return state.renderer.setDimension(
          normalized
        );
      }
    );
  }

  function inspectCenterFacet() {
    if (
      !state.renderer ||
      typeof state.renderer.inspectAt !==
      "function"
    ) {
      setStatus(
        "Inspect is waiting for the G3 renderer.",
        {
          waiting:
            true,

          force:
            true
        }
      );

      return null;
    }

    if (!state.stage) {
      setStatus(
        "Diamond stage is unavailable.",
        {
          error:
            true,

          force:
            true
        }
      );

      return null;
    }

    const rectangle =
      state.stage.getBoundingClientRect();

    if (
      !rectangle.width ||
      !rectangle.height
    ) {
      setStatus(
        "Diamond stage has no measurable viewport.",
        {
          error:
            true,

          force:
            true
        }
      );

      return null;
    }

    return executeRendererAction(
      "inspect",
      () => {
        const selection =
          state.renderer.inspectAt(
            rectangle.left +
            rectangle.width /
            2,

            rectangle.top +
            rectangle.height /
            2
          );

        if (!selection) {
          state.selectedFacet =
            null;

          setStatus(
            "No facet intersects the center inspection ray.",
            {
              force:
                true
            }
          );

          return getRendererStatus();
        }

        state.selectedFacet =
          selection;

        state.selectionCount += 1;

        setStatus(
          describeSelection(
            selection
          ),
          {
            selection:
              true,

            force:
              true
          }
        );

        return getRendererStatus();
      }
    );
  }

  function resetDiamond() {
    state.selectedFacet =
      null;

    return executeRendererAction(
      "reset",
      () => {
        if (
          typeof state.renderer.reset !==
          "function"
        ) {
          return null;
        }

        return state.renderer.reset();
      }
    );
  }

  function bindControlEvents() {
    if (state.objectButton) {
      state.objectButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          activateObjectView();
        },
        signal
          ? {
              signal
            }
          : false
      );
    }

    if (state.latticeButton) {
      state.latticeButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          activateLatticeView();
        },
        signal
          ? {
              signal
            }
          : false
      );
    }

    for (
      const button of
      state.dimensionButtons
    ) {
      if (
        button ===
        state.objectButton
      ) {
        continue;
      }

      button.addEventListener(
        "click",
        event => {
          event.preventDefault();

          activateDimension(
            button.dataset.diamondDimension
          );
        },
        signal
          ? {
              signal
            }
          : false
      );
    }

    if (state.inspectButton) {
      state.inspectButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          inspectCenterFacet();
        },
        signal
          ? {
              signal
            }
          : false
      );
    }

    if (state.resetButton) {
      state.resetButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          resetDiamond();
        },
        signal
          ? {
              signal
            }
          : false
      );
    }
  }

  function shouldIgnoreKeyboardEvent(event) {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return true;
    }

    const target =
      event.target;

    if (!target) {
      return false;
    }

    const tag =
      target.tagName
        ? target.tagName.toLowerCase()
        : "";

    if (
      tag ===
      "input" ||
      tag ===
      "textarea" ||
      tag ===
      "select"
    ) {
      return true;
    }

    if (
      target.isContentEditable
    ) {
      return true;
    }

    return false;
  }

  function bindKeyboardEvents() {
    doc.addEventListener(
      "keydown",
      event => {
        if (
          shouldIgnoreKeyboardEvent(
            event
          )
        ) {
          return;
        }

        const key =
          String(
            event.key ||
            ""
          ).toLowerCase();

        if (
          key ===
          "1" ||
          key ===
          "o"
        ) {
          event.preventDefault();
          activateObjectView();
          return;
        }

        if (
          key ===
          "2" ||
          key ===
          "l"
        ) {
          event.preventDefault();
          activateLatticeView();
          return;
        }

        if (
          key ===
          "i"
        ) {
          event.preventDefault();
          inspectCenterFacet();
          return;
        }

        if (
          key ===
          "r" ||
          key ===
          "0"
        ) {
          event.preventDefault();
          resetDiamond();
        }
      },
      signal
        ? {
            signal
          }
        : false
    );
  }

  function handleRendererReady(event) {
    state.eventCount += 1;

    const candidate =
      resolveRenderer();

    if (candidate) {
      state.renderer =
        candidate;

      state.rendererBound =
        true;
    }

    const snapshot =
      event &&
      event.detail
        ? event.detail
        : getRendererStatus();

    synchronizeFromRenderer(
      snapshot,
      "renderer-ready-event"
    );
  }

  function handleRendererState(event) {
    state.eventCount += 1;

    if (!state.renderer) {
      state.renderer =
        resolveRenderer();
    }

    const snapshot =
      event &&
      event.detail
        ? event.detail
        : getRendererStatus();

    synchronizeFromRenderer(
      snapshot,
      "renderer-state-event"
    );
  }

  function handleSelection(event) {
    state.eventCount += 1;

    const selection =
      event &&
      event.detail
        ? event.detail
        : null;

    if (!selection) {
      state.selectedFacet =
        null;

      synchronizeFromRenderer(
        null,
        "selection-clear"
      );

      return;
    }

    state.selectedFacet =
      selection;

    state.selectionCount += 1;

    setStatus(
      describeSelection(
        selection
      ),
      {
        selection:
          true,

        force:
          true
      }
    );

    setDataset(
      "showroomDiamondG3UiSelectedFacet",
      selection.facetId ||
      "unknown"
    );

    publishReceipt(
      "selection-event"
    );
  }

  function handleContextLost(event) {
    state.eventCount += 1;

    setStatus(
      "WebGL context lost · waiting for restoration",
      {
        error:
          true,

        force:
          true
      }
    );

    enableControls(
      false
    );

    publishReceipt(
      "context-lost-event",
      event &&
      event.detail
        ? event.detail
        : null
    );
  }

  function handleFallback(event) {
    state.eventCount += 1;

    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    const reason =
      detail.reason ||
      "renderer fallback active";

    setStatus(
      `Diamond fallback active · ${reason}`,
      {
        error:
          true,

        force:
          true
      }
    );

    enableControls(
      false
    );

    publishReceipt(
      "fallback-event",
      detail
    );
  }

  function bindRendererEvents() {
    root.addEventListener(
      EVENT_READY,
      handleRendererReady,
      signal
        ? {
            signal
          }
        : false
    );

    root.addEventListener(
      EVENT_STATE,
      handleRendererState,
      signal
        ? {
            signal
          }
        : false
    );

    root.addEventListener(
      EVENT_SELECTION,
      handleSelection,
      signal
        ? {
            signal
          }
        : false
    );

    root.addEventListener(
      EVENT_CONTEXT_LOST,
      handleContextLost,
      signal
        ? {
            signal
          }
        : false
    );

    root.addEventListener(
      EVENT_FALLBACK,
      handleFallback,
      signal
        ? {
            signal
          }
        : false
    );
  }

  function locateNodes() {
    state.stage =
      query(
        SELECTORS.stage
      );

    state.statusNode =
      query(
        SELECTORS.status
      );

    state.inspectButton =
      query(
        SELECTORS.inspect
      );

    state.resetButton =
      query(
        SELECTORS.reset
      );

    state.objectButton =
      query(
        SELECTORS.objectView
      );

    state.latticeButton =
      query(
        SELECTORS.latticeView
      );

    state.publicButtons =
      queryAll(
        SELECTORS.publicControls
      );

    state.lensButtons =
      queryAll(
        SELECTORS.lensControls
      );

    state.dimensionButtons =
      queryAll(
        SELECTORS.dimensionControls
      );

    state.technicalBridge =
      query(
        SELECTORS.technicalBridge
      );

    const required = [
      [
        "stage",
        state.stage
      ],

      [
        "status",
        state.statusNode
      ],

      [
        "object-view",
        state.objectButton
      ],

      [
        "lattice-view",
        state.latticeButton
      ],

      [
        "inspect",
        state.inspectButton
      ],

      [
        "reset",
        state.resetButton
      ]
    ];

    const missing =
      required
        .filter(
          entry =>
            !entry[1]
        )
        .map(
          entry =>
            entry[0]
        );

    if (missing.length) {
      throw new Error(
        `Missing showroom UI nodes: ${missing.join(", ")}`
      );
    }
  }

  function prepareAccessibility() {
    state.statusNode.setAttribute(
      "role",
      "status"
    );

    state.statusNode.setAttribute(
      "aria-live",
      "polite"
    );

    state.statusNode.setAttribute(
      "aria-atomic",
      "true"
    );

    state.objectButton.setAttribute(
      "aria-label",
      "Show the complete three-dimensional diamond object"
    );

    state.latticeButton.setAttribute(
      "aria-label",
      "Reveal the internal 16 by 16 lattice"
    );

    state.inspectButton.setAttribute(
      "aria-label",
      "Inspect the facet at the center of the diamond"
    );

    state.inspectButton.setAttribute(
      "title",
      "Inspect center facet · keyboard I"
    );

    state.resetButton.setAttribute(
      "aria-label",
      "Reset the diamond camera, view, zoom, and selected facet"
    );

    state.resetButton.setAttribute(
      "title",
      "Reset diamond · keyboard R or 0"
    );

    state.objectButton.setAttribute(
      "title",
      "Object View · keyboard O or 1"
    );

    state.latticeButton.setAttribute(
      "title",
      "Lattice View · keyboard L or 2"
    );

    if (state.stage) {
      state.stage.setAttribute(
        "aria-label",
        "Interactive G3 Diamond Gate Bridge computational gem. Drag or swipe to rotate. Pinch or use the mouse wheel to zoom."
      );

      state.stage.dataset.uiController =
        CONTRACT;
    }

    if (state.technicalBridge) {
      state.technicalBridge.setAttribute(
        "aria-hidden",
        "true"
      );

      state.technicalBridge.dataset.uiOwnership =
        "internal-diagnostic-only";
    }
  }

  function bindRenderer(attempt) {
    if (
      state.disposed ||
      state.rendererBound
    ) {
      return;
    }

    state.bindAttempts =
      attempt;

    const renderer =
      resolveRenderer();

    if (renderer) {
      state.renderer =
        renderer;

      state.rendererBound =
        true;

      synchronizeFromRenderer(
        null,
        "renderer-bound"
      );

      return;
    }

    if (attempt >= 160) {
      enableControls(
        false
      );

      setStatus(
        "G3 diamond renderer was not found.",
        {
          error:
            true,

          force:
            true
        }
      );

      publishReceipt(
        "renderer-bind-timeout"
      );

      return;
    }

    root.setTimeout(
      () => {
        bindRenderer(
          attempt +
          1
        );
      },
      50
    );
  }

  function buildReceipt(scope, extra) {
    const rendererStatus =
      state.lastRendererStatus ||
      getRendererStatus();

    return Object.freeze({
      contract:
        CONTRACT,

      rendererContract:
        RENDERER_CONTRACT,

      geometryContract:
        GEOMETRY_CONTRACT,

      contractFamily:
        CONTRACT_FAMILY,

      route:
        ROUTE,

      file:
        FILE,

      generation:
        "G3",

      scope:
        scope ||
        "status",

      status:
        state.disposed
          ? "DISPOSED"
          : state.errors.length
            ? "ERROR"
            : state.rendererReady
              ? "READY"
              : "HELD",

      initialized:
        state.initialized,

      disposed:
        state.disposed,

      rendererBound:
        state.rendererBound,

      rendererReady:
        state.rendererReady,

      activeView:
        state.activeView,

      activeLens:
        state.activeLens,

      activeDimension:
        state.activeDimension,

      selectedFacetId:
        state.selectedFacet &&
        state.selectedFacet.facetId
          ? state.selectedFacet.facetId
          : null,

      statusText:
        state.lastStatusText,

      bindAttempts:
        state.bindAttempts,

      eventCount:
        state.eventCount,

      actionCount:
        state.actionCount,

      selectionCount:
        state.selectionCount,

      rendererStatus:
        rendererStatus ||
        null,

      ownsGeometry:
        false,

      ownsCanvas:
        false,

      ownsWebGL:
        false,

      ownsShaders:
        false,

      ownsAnimation:
        false,

      ownsPointerRotation:
        false,

      ownsTouchRotation:
        false,

      ownsUI:
        true,

      ownsMapPortal:
        false,

      errors:
        state.errors.slice(),

      extra:
        extra ||
        null
    });
  }

  function publishReceipt(scope, extra) {
    const receipt =
      buildReceipt(
        scope,
        extra
      );

    state.lastReceipt =
      receipt;

    root.SHOWROOM_DIAMOND_G3_UI_RECEIPT =
      receipt;

    root.DGB_SHOWROOM_DIAMOND_G3_UI_STATUS =
      receipt;

    setDataset(
      "showroomDiamondG3UiContract",
      CONTRACT
    );

    setDataset(
      "showroomDiamondG3UiReady",
      receipt.status ===
      "READY"
    );

    dispatch(
      "showroom-diamond-g3-ui-state",
      receipt
    );

    return receipt;
  }

  function status() {
    return buildReceipt(
      "api-status"
    );
  }

  function getReceipt() {
    return {
      ...buildReceipt(
        "api-receipt"
      )
    };
  }

  function sync() {
    return synchronizeFromRenderer(
      null,
      "api-sync"
    );
  }

  function dispose() {
    if (state.disposed) {
      return status();
    }

    state.disposed =
      true;

    if (state.abortController) {
      try {
        state.abortController.abort();
      } catch (_error) {}
    }

    enableControls(
      false
    );

    publishReceipt(
      "dispose"
    );

    return status();
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        rendererContract:
          RENDERER_CONTRACT,

        geometryContract:
          GEOMETRY_CONTRACT,

        activateObjectView,

        activateLatticeView,

        activateDimension,

        inspect:
          inspectCenterFacet,

        reset:
          resetDiamond,

        sync,

        status,

        getReceipt,

        dispose
      });

    root.DGBShowroomDiamondUIG3 =
      api;

    root.__SHOWROOM_DIAMOND_G3_UI_CONTROLLER__ =
      {
        contract:
          CONTRACT,

        state,

        sync,

        status,

        dispose
      };
  }

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      locateNodes();
      prepareAccessibility();
      exposeApi();
      bindControlEvents();
      bindKeyboardEvents();
      bindRendererEvents();

      state.initialized =
        true;

      enableControls(
        false
      );

      synchronizeButtons({
        activeView:
          "object",

        activeLens:
          "crystal",

        activeDimension:
          "object"
      });

      setStatus(
        "Preparing the G3 Diamond Lattice…",
        {
          waiting:
            true,

          force:
            true
        }
      );

      publishReceipt(
        "init"
      );

      bindRenderer(
        0
      );
    } catch (error) {
      exposeApi();
      recordError(
        "initialize",
        error
      );
    }
  }

  if (
    doc.readyState ===
    "loading"
  ) {
    doc.addEventListener(
      "DOMContentLoaded",
      initialize,
      signal
        ? {
            signal,
            once:
              true
          }
        : {
            once:
              true
          }
    );
  } else {
    initialize();
  }
})(window, document);
