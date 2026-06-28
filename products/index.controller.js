/* /products/index.controller.js
   PRODUCTS
   Controller authority for primary-entry navigation state, six-product cluster
   orientation, semantic selection, preview-panel projection, return behavior,
   failure-safe receipts, and Products datasets.

   Surgical correction scope:
   - Bind final authority only to the single body-contained [data-page-id="products"] root.
   - Preserve Compass -> ARCHCOIN -> Products lineage.
   - Publish DGB_PRODUCTS_CONTROLLER and DGB_PRODUCTS_CONTROLLER_RECEIPT.
   - Keep fallback links outside enhanced semantic control handling.
   - Preserve preview-before-navigation, identity separation, return separation,
     and intentional empty bounded void.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "PRODUCTS_CONTROLLER_COMPASS_NAVIGATION_ANCHOR_v2",
    sourceContractId:
      "DGB_COMPASS_CONTROLLER_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3",
    continuationAnchorId: "ARCHCOIN_CONTROLLER_COMPASS_NAVIGATION_ANCHOR_v3",
    file: "/products/index.controller.js",
    releaseId: "products-compass-navigation-anchor-v2",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const CONTROLLER_SYMBOL = "DGB_PRODUCTS_CONTROLLER";
  const RECEIPT_SYMBOL = "DGB_PRODUCTS_CONTROLLER_RECEIPT";
  const FAILURE_EVENT = "PRODUCTS_CONTROLLER_FAILURE";

  const STATES = Object.freeze({
    PRIMARY_ENTRY: "PRIMARY_ENTRY",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    PRODUCT_SELECTED: "PRODUCT_SELECTED",
    HELD: "HELD"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    SETTLING: "SETTLING",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const QUATERNION = Object.freeze({
    minimumLength: 1e-8,
    identity: Object.freeze([0, 0, 0, 1])
  });

  const TRANSITIONS = Object.freeze({
    [STATES.PRIMARY_ENTRY]: Object.freeze([
      STATES.PRIMARY_ENTRY,
      STATES.CLUSTER_OPEN,
      STATES.HELD
    ]),
    [STATES.CLUSTER_OPEN]: Object.freeze([
      STATES.CLUSTER_OPEN,
      STATES.PRODUCT_SELECTED,
      STATES.PRIMARY_ENTRY,
      STATES.HELD
    ]),
    [STATES.PRODUCT_SELECTED]: Object.freeze([
      STATES.PRODUCT_SELECTED,
      STATES.CLUSTER_OPEN,
      STATES.PRIMARY_ENTRY,
      STATES.HELD
    ]),
    [STATES.HELD]: Object.freeze([STATES.HELD])
  });

  const PRIMARY_ENTRY = Object.freeze({
    id: "products",
    label: "PRODUCTS",
    shortLabel: "OPEN SIX PRODUCTS",
    destinationType: "cluster-entry",
    route: ""
  });

  const PRODUCTS = Object.freeze([
    Object.freeze({
      id: "archcoin",
      label: "ARCHCOIN",
      shortLabel: "TRACE",
      route: "/products/archcoin/",
      previewTitle: "ARCHCOIN",
      previewSummary:
        "Trace financial structure through contract, receivable, payable, and allocation.",
      relationshipCopy:
        "Enter when the need is operational financial clarity.",
      accessibleLabel: "Open ARCHCOIN product preview."
    }),

    Object.freeze({
      id: "five-flags",
      label: "FIVE FLAGS",
      shortLabel: "SIGNALS",
      route: "/products/five-flags/",
      previewTitle: "FIVE FLAGS",
      previewSummary:
        "Open the signal-facing product branch.",
      relationshipCopy:
        "Enter when the need is public signal, positioning, or visible game logic.",
      accessibleLabel: "Open FIVE FLAGS product preview."
    }),

    Object.freeze({
      id: "aai",
      label: "AAI",
      shortLabel: "SUPPORT",
      route: "/products/on-your-side-ai/",
      previewTitle: "AAI",
      previewSummary:
        "Open the support-facing product branch.",
      relationshipCopy:
        "Enter when the need is guided help, support structure, or assisted movement.",
      accessibleLabel: "Open AAI product preview."
    }),

    Object.freeze({
      id: "education",
      label: "EDUCATION",
      shortLabel: "LEARNING",
      route: "/products/education/",
      previewTitle: "EDUCATION",
      previewSummary:
        "Open the learning-facing product branch.",
      relationshipCopy:
        "Enter when the need is teaching, explanation, or structured understanding.",
      accessibleLabel: "Open EDUCATION product preview."
    }),

    Object.freeze({
      id: "nutrition",
      label: "NUTRITION",
      shortLabel: "BASELINE",
      route: "/products/nutrition/",
      previewTitle: "NUTRITION",
      previewSummary:
        "Open the baseline-facing product branch.",
      relationshipCopy:
        "Enter when the need is nutritional support or baseline intake structure.",
      accessibleLabel: "Open NUTRITION product preview."
    }),

    Object.freeze({
      id: "book",
      label: "BOOK",
      shortLabel: "LONG FORM",
      route: "/nine-summits-of-love/",
      previewTitle: "BOOK",
      previewSummary:
        "Read the long-form path through The Nine Summits of Love.",
      relationshipCopy:
        "Enter when the need is extended narrative, reflection, and long-form carrying capacity.",
      accessibleLabel: "Open BOOK product preview."
    })
  ]);

  const PRODUCT_MAP = new Map(PRODUCTS.map(product => [product.id, product]));

  const SELECTORS = Object.freeze({
    pageRoot: '[data-page-id="products"]',
    sceneRoot: "[data-products-scene]",
    semanticLayer: "[data-products-semantic]",
    primaryEntry: "[data-products-primary-entry]",
    productRecord: "[data-products-product]",
    fallbackRoot: "[data-products-fallback]",
    fallbackLink: "[data-products-fallback-link]",
    previewPanel: "[data-products-preview-panel]",
    previewEyebrow: "[data-products-preview-eyebrow]",
    previewTitle: "[data-products-preview-title]",
    previewSummary: "[data-products-preview-summary]",
    previewRelationship: "[data-products-preview-relationship]",
    enterProduct: "[data-products-enter]",
    returnToOrbit: "[data-products-return-to-orbit]",
    returnToConstellation: "[data-products-return-to-constellation]",
    guidance: "[data-products-guidance]",
    controllerReceipt: "[data-products-controller-receipt]",
    crystalsReceipt: "[data-products-crystals-receipt]"
  });

  const LEGACY_SELECTORS = Object.freeze({
    runtimeRoot: "[data-products-runtime-root]",
    runtimeMount: "[data-products-runtime-mount]"
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    sourceContractId: CONTRACT.sourceContractId,
    continuationAnchorId: CONTRACT.continuationAnchorId,
    status: "pending",
    state: STATES.PRIMARY_ENTRY,
    orbitFocus: PRIMARY_ENTRY.id,
    orbitPreviewFocus: PRIMARY_ENTRY.id,
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitRevision: 0,
    orbitQuaternion: QUATERNION.identity,
    activeClusterId: "",
    clusterPrimaryProduct: "",
    clusterPreviewPrimaryProduct: "",
    clusterPhase: ORIENTATION_PHASES.IDLE,
    clusterGestureActive: false,
    clusterRevision: 0,
    clusterQuaternion: QUATERNION.identity,
    selectedProductId: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    panelDescended: false,
    fallbackHiddenForEnhanced: false,
    legacyRuntimeRootPresent: false,
    legacyRuntimeMountPresent: false,
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    semanticLayer: null,
    fallbackRoot: null,
    fallbackLinks: [],
    previewPanel: null,
    previewEyebrow: null,
    previewTitle: null,
    previewSummary: null,
    previewRelationship: null,
    primaryEntry: null,
    productRecords: [],
    enterButton: null,
    returnToOrbitButton: null,
    returnToConstellationButton: null,
    guidance: null,
    controllerReceiptOutput: null,
    crystalsReceiptOutput: null,

    current: STATES.PRIMARY_ENTRY,

    orbitFocus: PRIMARY_ENTRY.id,
    orbitPreviewFocus: PRIMARY_ENTRY.id,
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitRevision: 0,
    orbitOrientation: null,
    committedOrbitOrientation: null,
    orbitGestureOrigin: null,

    activeClusterId: "",
    clusterPrimaryProduct: "",
    clusterPreviewPrimaryProduct: "",
    clusterPhase: ORIENTATION_PHASES.IDLE,
    clusterGestureActive: false,
    clusterRevision: 0,
    clusterOrientation: null,
    committedClusterOrientation: null,
    clusterGestureOrigin: null,

    selectedProductId: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedPreviewRecord: null,

    panelDescended: false,
    reducedMotion: false,
    initialized: false
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeProductId(value) {
    const id = String(value || "").trim().toLowerCase();
    return PRODUCT_MAP.has(id) ? id : "";
  }

  function normalizeRoute(value) {
    const route = String(value || "").trim();
    return route.startsWith("/") ? route : "";
  }

  function normalizeQuaternion(value, fallback = QUATERNION.identity) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];

    if (source.length !== 4) {
      return Array.from(fallback);
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

    const length = Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    if (!Number.isFinite(length) || length < QUATERNION.minimumLength) {
      return Array.from(fallback);
    }

    return quaternion.map(component => component / length);
  }

  function cloneOrientation(orientation) {
    const source = orientation || {
      quaternion: QUATERNION.identity,
      primaryId: PRIMARY_ENTRY.id
    };

    return {
      quaternion: normalizeQuaternion(source.quaternion),
      primaryId: String(source.primaryId || "").trim()
    };
  }

  function freezeOrientation(orientation) {
    const clone = cloneOrientation(orientation);

    return Object.freeze({
      quaternion: Object.freeze(clone.quaternion.slice()),
      primaryId: clone.primaryId
    });
  }

  function orientationFromPayload(payload, fallbackOrientation, fallbackPrimaryId) {
    const fallback = cloneOrientation(fallbackOrientation);
    const primaryId = String(
      (payload && (
        payload.primaryId ||
        payload.primaryProductsId ||
        payload.primaryProductId
      )) || fallbackPrimaryId || fallback.primaryId || ""
    ).trim();

    if (!payload || typeof payload !== "object") {
      return {
        quaternion: fallback.quaternion.slice(),
        primaryId
      };
    }

    return {
      quaternion: normalizeQuaternion(
        payload.quaternion ||
          (payload.orientation && payload.orientation.quaternion) ||
          fallback.quaternion
      ),
      primaryId
    };
  }

  function getProductById(productId) {
    return PRODUCT_MAP.get(normalizeProductId(productId)) || null;
  }

  function defaultClusterPrimaryProduct() {
    return PRODUCTS[0].id;
  }

  function clearPreviewSelection() {
    state.selectedProductId = "";
    state.selectedDestinationType = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedPreviewRecord = null;
    state.panelDescended = false;
  }

  function defaultPanel() {
    return {
      eyebrow: "Products",
      title: "Open the constellation",
      summary:
        "Products turn recurring needs into usable systems. Open the constellation to explore the active product chambers.",
      relationship:
        "Select the primary Products star to open the six-product cluster."
    };
  }

  function clusterPanel() {
    return {
      eyebrow: "Products cluster",
      title: "Six active products",
      summary:
        "Rotate the cluster, bring a product forward, and select one to populate the preview panel.",
      relationship:
        "Selection opens a preview first. Navigation requires explicit Enter Product."
    };
  }

  function panelFromProduct(product) {
    return {
      eyebrow: product.shortLabel,
      title: product.previewTitle,
      summary: product.previewSummary,
      relationship: product.relationshipCopy
    };
  }

  function setPanel(panelState) {
    if (state.previewEyebrow) {
      state.previewEyebrow.textContent = panelState.eyebrow || "";
    }
    if (state.previewTitle) {
      state.previewTitle.textContent = panelState.title || "";
    }
    if (state.previewSummary) {
      state.previewSummary.textContent = panelState.summary || "";
    }
    if (state.previewRelationship) {
      state.previewRelationship.textContent = panelState.relationship || "";
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent = message || "";
    }
  }

  function setEnterEnabled(enabled) {
    if (!state.enterButton) {
      return;
    }

    state.enterButton.hidden = false;
    state.enterButton.setAttribute("aria-disabled", enabled ? "false" : "true");

    if ("disabled" in state.enterButton) {
      state.enterButton.disabled = !enabled;
    }

    if (state.enterButton.tagName === "A") {
      if (enabled && state.selectedRoute) {
        state.enterButton.setAttribute("href", state.selectedRoute);
        state.enterButton.tabIndex = 0;
      } else {
        state.enterButton.removeAttribute("href");
        state.enterButton.tabIndex = -1;
      }
    }
  }

  function setHiddenControl(control, hidden) {
    if (!control) {
      return;
    }

    control.hidden = hidden;
    control.setAttribute("aria-hidden", hidden ? "true" : "false");
    control.setAttribute("aria-disabled", hidden ? "true" : "false");

    if ("disabled" in control) {
      control.disabled = hidden;
    }

    control.tabIndex = hidden ? -1 : 0;
  }

  function setFallbackEnhancedState(isEnhancedVisible) {
    if (!state.fallbackRoot) {
      return;
    }

    state.fallbackRoot.dataset.enhancedSuppressed = isEnhancedVisible ? "true" : "false";
    state.fallbackRoot.setAttribute("aria-hidden", isEnhancedVisible ? "true" : "false");

    state.fallbackLinks.forEach(link => {
      link.tabIndex = isEnhancedVisible ? -1 : 0;
    });
  }

  function syncDatasets() {
    if (!state.root) {
      return;
    }

    const orbit = cloneOrientation(
      state.orbitOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: PRIMARY_ENTRY.id
      }
    );

    const cluster = cloneOrientation(
      state.clusterOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: state.clusterPrimaryProduct || defaultClusterPrimaryProduct()
      }
    );

    state.root.dataset.productsState = state.current;
    state.root.dataset.productsHeld = state.current === STATES.HELD ? "true" : "false";

    state.root.dataset.orbitFocus = state.orbitFocus;
    state.root.dataset.orbitPreviewFocus = state.orbitPreviewFocus;
    state.root.dataset.orbitPhase = state.orbitPhase;
    state.root.dataset.orbitGestureActive = state.orbitGestureActive ? "true" : "false";
    state.root.dataset.orbitRevision = String(state.orbitRevision);
    state.root.dataset.orbitQuaternion = JSON.stringify(orbit.quaternion);

    state.root.dataset.productsActiveCluster = state.activeClusterId;
    state.root.dataset.clusterPrimaryProduct = state.clusterPrimaryProduct;
    state.root.dataset.clusterPreviewPrimaryProduct = state.clusterPreviewPrimaryProduct;
    state.root.dataset.clusterPhase = state.clusterPhase;
    state.root.dataset.clusterGestureActive = state.clusterGestureActive ? "true" : "false";
    state.root.dataset.clusterRevision = String(state.clusterRevision);
    state.root.dataset.clusterQuaternion = JSON.stringify(cluster.quaternion);

    state.root.dataset.productsSelectedId = state.selectedProductId;
    state.root.dataset.productsSelectedRoute = state.selectedRoute;
    state.root.dataset.productsPanelDescended = state.panelDescended ? "true" : "false";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";

    if (state.primaryEntry) {
      const primaryVisible = state.current === STATES.PRIMARY_ENTRY;
      state.primaryEntry.dataset.primary = primaryVisible ? "true" : "false";
      state.primaryEntry.dataset.selected = "false";
      if (primaryVisible) {
        state.primaryEntry.setAttribute("aria-current", "true");
      } else {
        state.primaryEntry.removeAttribute("aria-current");
      }
      state.primaryEntry.hidden = state.current === STATES.HELD;
    }

    state.productRecords.forEach(element => {
      const productId = normalizeProductId(
        element.dataset.productId ||
          element.dataset.destinationId ||
          element.dataset.productsId ||
          ""
      );

      const selected = productId && productId === state.selectedProductId;
      const primary = productId && productId === state.clusterPrimaryProduct;
      const visible =
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.PRODUCT_SELECTED;

      element.dataset.selected = selected ? "true" : "false";
      element.dataset.primary = primary ? "true" : "false";

      if (selected || primary) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }

      element.hidden = !visible;
    });
  }

  function emitReceipt(extra = {}) {
    const orbit = cloneOrientation(
      state.orbitOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: PRIMARY_ENTRY.id
      }
    );

    const cluster = cloneOrientation(
      state.clusterOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: state.clusterPrimaryProduct || defaultClusterPrimaryProduct()
      }
    );

    const fallbackHiddenForEnhanced =
      state.current === STATES.PRIMARY_ENTRY ||
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.PRODUCT_SELECTED;

    Object.assign(RECEIPT, {
      contractId: CONTRACT.id,
      sourceContractId: CONTRACT.sourceContractId,
      continuationAnchorId: CONTRACT.continuationAnchorId,
      status: state.current === STATES.HELD ? "held" : "available",
      state: state.current,
      orbitFocus: state.orbitFocus,
      orbitPreviewFocus: state.orbitPreviewFocus,
      orbitPhase: state.orbitPhase,
      orbitGestureActive: state.orbitGestureActive,
      orbitRevision: state.orbitRevision,
      orbitQuaternion: Object.freeze(orbit.quaternion.slice()),
      activeClusterId: state.activeClusterId,
      clusterPrimaryProduct: state.clusterPrimaryProduct,
      clusterPreviewPrimaryProduct: state.clusterPreviewPrimaryProduct,
      clusterPhase: state.clusterPhase,
      clusterGestureActive: state.clusterGestureActive,
      clusterRevision: state.clusterRevision,
      clusterQuaternion: Object.freeze(cluster.quaternion.slice()),
      selectedProductId: state.selectedProductId,
      selectedDestinationType: state.selectedDestinationType,
      selectedDestinationId: state.selectedDestinationId,
      selectedDestinationLabel: state.selectedDestinationLabel,
      selectedRoute: state.selectedRoute,
      panelDescended: state.panelDescended,
      fallbackHiddenForEnhanced,
      legacyRuntimeRootPresent: Boolean(qs(LEGACY_SELECTORS.runtimeRoot)),
      legacyRuntimeMountPresent: Boolean(qs(LEGACY_SELECTORS.runtimeMount)),
      visualPassClaimed: false
    }, extra);

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.productsControllerStatus = RECEIPT.status;
      state.root.dataset.productsControllerReceipt = serialized;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value = serialized;
      state.controllerReceiptOutput.textContent = serialized;
      state.controllerReceiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis[RECEIPT_SYMBOL] = Object.freeze({
      ...RECEIPT,
      orbitQuaternion: Object.freeze(Array.from(RECEIPT.orbitQuaternion)),
      clusterQuaternion: Object.freeze(Array.from(RECEIPT.clusterQuaternion))
    });
  }

  function syncPresentation() {
    syncDatasets();

    const enhancedActive =
      state.current === STATES.PRIMARY_ENTRY ||
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.PRODUCT_SELECTED;

    setFallbackEnhancedState(enhancedActive && state.current !== STATES.HELD);

    if (state.current === STATES.PRIMARY_ENTRY) {
      setPanel(defaultPanel());
      setEnterEnabled(false);
      setHiddenControl(state.returnToOrbitButton, true);
      setHiddenControl(state.returnToConstellationButton, true);
      setGuidance("Select the PRODUCTS star to open the six-product cluster.");
      emitReceipt({
        lastAction: RECEIPT.lastAction,
        lastFailure: RECEIPT.lastFailure
      });
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      setPanel(clusterPanel());
      setEnterEnabled(false);
      setHiddenControl(state.returnToOrbitButton, true);
      setHiddenControl(state.returnToConstellationButton, false);
      setGuidance(
        "Rotate the cluster to bring the nearest product forward. Select a product to populate the preview panel."
      );
      emitReceipt({
        lastAction: RECEIPT.lastAction,
        lastFailure: RECEIPT.lastFailure
      });
      return;
    }

    if (state.current === STATES.PRODUCT_SELECTED) {
      setPanel(
        state.selectedPreviewRecord
          ? panelFromProduct(state.selectedPreviewRecord)
          : clusterPanel()
      );
      setEnterEnabled(Boolean(state.selectedRoute));
      setHiddenControl(state.returnToOrbitButton, false);
      setHiddenControl(state.returnToConstellationButton, false);
      setGuidance(
        "Review the selected product preview. Enter Product commits navigation. Return to Orbit restores the six-product cluster."
      );
      emitReceipt({
        lastAction: RECEIPT.lastAction,
        lastFailure: RECEIPT.lastFailure
      });
      return;
    }

    setPanel({
      eyebrow: "Held",
      title: "Products controller unavailable",
      summary:
        "The enhanced Products controller is held. Static product paths remain usable.",
      relationship:
        "Use the fallback links while the enhanced controller is unavailable."
    });
    setEnterEnabled(false);
    setHiddenControl(state.returnToOrbitButton, true);
    setHiddenControl(state.returnToConstellationButton, true);
    setGuidance(
      "The enhanced Products controller is held. Static content remains readable and navigable."
    );
    setFallbackEnhancedState(false);
  }

  function canTransition(fromState, toState) {
    return (TRANSITIONS[fromState] || []).includes(toState);
  }

  function beginAtomicTransition(next) {
    const currentState = state.current;
    const nextState = next.state || currentState;

    if (!canTransition(currentState, nextState)) {
      throw new Error(`ILLEGAL_STATE_TRANSITION:${currentState}->${nextState}`);
    }

    const transaction = {
      currentState,
      nextState,

      orbitFocus:
        next.orbitFocus !== undefined ? next.orbitFocus : state.orbitFocus,
      orbitPreviewFocus:
        next.orbitPreviewFocus !== undefined
          ? next.orbitPreviewFocus
          : state.orbitPreviewFocus,
      orbitPhase:
        next.orbitPhase !== undefined ? next.orbitPhase : state.orbitPhase,
      orbitGestureActive:
        next.orbitGestureActive !== undefined
          ? next.orbitGestureActive
          : state.orbitGestureActive,
      orbitRevision:
        next.orbitRevision !== undefined ? next.orbitRevision : state.orbitRevision,
      orbitOrientation:
        next.orbitOrientation !== undefined ? next.orbitOrientation : state.orbitOrientation,
      committedOrbitOrientation:
        next.committedOrbitOrientation !== undefined
          ? next.committedOrbitOrientation
          : state.committedOrbitOrientation,
      orbitGestureOrigin:
        next.orbitGestureOrigin !== undefined
          ? next.orbitGestureOrigin
          : state.orbitGestureOrigin,

      activeClusterId:
        next.activeClusterId !== undefined ? next.activeClusterId : state.activeClusterId,
      clusterPrimaryProduct:
        next.clusterPrimaryProduct !== undefined
          ? next.clusterPrimaryProduct
          : state.clusterPrimaryProduct,
      clusterPreviewPrimaryProduct:
        next.clusterPreviewPrimaryProduct !== undefined
          ? next.clusterPreviewPrimaryProduct
          : state.clusterPreviewPrimaryProduct,
      clusterPhase:
        next.clusterPhase !== undefined ? next.clusterPhase : state.clusterPhase,
      clusterGestureActive:
        next.clusterGestureActive !== undefined
          ? next.clusterGestureActive
          : state.clusterGestureActive,
      clusterRevision:
        next.clusterRevision !== undefined ? next.clusterRevision : state.clusterRevision,
      clusterOrientation:
        next.clusterOrientation !== undefined ? next.clusterOrientation : state.clusterOrientation,
      committedClusterOrientation:
        next.committedClusterOrientation !== undefined
          ? next.committedClusterOrientation
          : state.committedClusterOrientation,
      clusterGestureOrigin:
        next.clusterGestureOrigin !== undefined
          ? next.clusterGestureOrigin
          : state.clusterGestureOrigin,

      selectedProductId:
        next.selectedProductId !== undefined ? next.selectedProductId : state.selectedProductId,
      selectedDestinationType:
        next.selectedDestinationType !== undefined
          ? next.selectedDestinationType
          : state.selectedDestinationType,
      selectedDestinationId:
        next.selectedDestinationId !== undefined
          ? next.selectedDestinationId
          : state.selectedDestinationId,
      selectedDestinationLabel:
        next.selectedDestinationLabel !== undefined
          ? next.selectedDestinationLabel
          : state.selectedDestinationLabel,
      selectedRoute:
        next.selectedRoute !== undefined ? next.selectedRoute : state.selectedRoute,
      selectedPreviewRecord:
        next.selectedPreviewRecord !== undefined
          ? next.selectedPreviewRecord
          : state.selectedPreviewRecord,
      panelDescended:
        next.panelDescended !== undefined ? next.panelDescended : state.panelDescended
    };

    if (transaction.nextState === STATES.CLUSTER_OPEN) {
      if (transaction.activeClusterId !== PRIMARY_ENTRY.id) {
        throw new Error("CLUSTER_OPEN_REQUIRES_PRODUCTS_CLUSTER");
      }

      const primaryProduct = normalizeProductId(transaction.clusterPrimaryProduct);
      if (!primaryProduct) {
        throw new Error("CLUSTER_OPEN_REQUIRES_PRIMARY_PRODUCT");
      }

      transaction.clusterPrimaryProduct = primaryProduct;

      const previewPrimaryProduct = normalizeProductId(
        transaction.clusterPreviewPrimaryProduct
      ) || primaryProduct;
      transaction.clusterPreviewPrimaryProduct = previewPrimaryProduct;

      if (normalizeProductId(transaction.selectedProductId)) {
        throw new Error("CLUSTER_OPEN_REQUIRES_EMPTY_SELECTED_PRODUCT");
      }

      if (normalizeRoute(transaction.selectedRoute)) {
        throw new Error("CLUSTER_OPEN_REQUIRES_EMPTY_SELECTED_ROUTE");
      }

      if (transaction.selectedPreviewRecord) {
        throw new Error("CLUSTER_OPEN_REQUIRES_EMPTY_SELECTED_PREVIEW");
      }
    }

    if (transaction.nextState === STATES.PRODUCT_SELECTED) {
      if (transaction.activeClusterId !== PRIMARY_ENTRY.id) {
        throw new Error("PRODUCT_SELECTED_REQUIRES_PRODUCTS_CLUSTER");
      }

      const selectedProduct = normalizeProductId(transaction.selectedProductId);
      if (!selectedProduct) {
        throw new Error("PRODUCT_SELECTED_REQUIRES_VALID_PRODUCT");
      }

      const product = getProductById(selectedProduct);
      if (!product) {
        throw new Error("PRODUCT_SELECTED_PRODUCT_NOT_FOUND");
      }

      const route = normalizeRoute(transaction.selectedRoute || product.route);
      if (!route) {
        throw new Error("PRODUCT_SELECTED_REQUIRES_VALID_ROUTE");
      }

      transaction.selectedProductId = product.id;
      transaction.selectedDestinationType = "product";
      transaction.selectedDestinationId = product.id;
      transaction.selectedDestinationLabel = product.label;
      transaction.selectedRoute = route;
      transaction.selectedPreviewRecord = product;
      transaction.clusterPrimaryProduct =
        normalizeProductId(transaction.clusterPrimaryProduct) ||
        state.clusterPrimaryProduct ||
        defaultClusterPrimaryProduct();
      transaction.clusterPreviewPrimaryProduct =
        normalizeProductId(transaction.clusterPreviewPrimaryProduct) ||
        transaction.clusterPrimaryProduct;
    }

    if (transaction.nextState === STATES.PRIMARY_ENTRY) {
      transaction.activeClusterId = "";
      transaction.selectedProductId = "";
      transaction.selectedDestinationType = "";
      transaction.selectedDestinationId = "";
      transaction.selectedDestinationLabel = "";
      transaction.selectedRoute = "";
      transaction.selectedPreviewRecord = null;
      transaction.panelDescended = false;
      transaction.orbitFocus = PRIMARY_ENTRY.id;
      transaction.orbitPreviewFocus = PRIMARY_ENTRY.id;
      transaction.orbitPhase = ORIENTATION_PHASES.COMMITTED;
      transaction.orbitGestureActive = false;
      transaction.clusterPhase = ORIENTATION_PHASES.COMMITTED;
      transaction.clusterGestureActive = false;
    }

    if (transaction.nextState === STATES.HELD) {
      transaction.activeClusterId = "";
      transaction.selectedProductId = "";
      transaction.selectedDestinationType = "";
      transaction.selectedDestinationId = "";
      transaction.selectedDestinationLabel = "";
      transaction.selectedRoute = "";
      transaction.selectedPreviewRecord = null;
      transaction.panelDescended = false;
      transaction.orbitGestureActive = false;
      transaction.clusterGestureActive = false;
    }

    return transaction;
  }

  function commitAtomicTransition(transaction, action) {
    state.current = transaction.nextState;

    state.orbitFocus = transaction.orbitFocus;
    state.orbitPreviewFocus = transaction.orbitPreviewFocus;
    state.orbitPhase = transaction.orbitPhase;
    state.orbitGestureActive = transaction.orbitGestureActive;
    state.orbitRevision = transaction.orbitRevision;
    state.orbitOrientation = transaction.orbitOrientation;
    state.committedOrbitOrientation = transaction.committedOrbitOrientation;
    state.orbitGestureOrigin = transaction.orbitGestureOrigin;

    state.activeClusterId = transaction.activeClusterId;
    state.clusterPrimaryProduct = transaction.clusterPrimaryProduct;
    state.clusterPreviewPrimaryProduct = transaction.clusterPreviewPrimaryProduct;
    state.clusterPhase = transaction.clusterPhase;
    state.clusterGestureActive = transaction.clusterGestureActive;
    state.clusterRevision = transaction.clusterRevision;
    state.clusterOrientation = transaction.clusterOrientation;
    state.committedClusterOrientation = transaction.committedClusterOrientation;
    state.clusterGestureOrigin = transaction.clusterGestureOrigin;

    state.selectedProductId = transaction.selectedProductId;
    state.selectedDestinationType = transaction.selectedDestinationType;
    state.selectedDestinationId = transaction.selectedDestinationId;
    state.selectedDestinationLabel = transaction.selectedDestinationLabel;
    state.selectedRoute = transaction.selectedRoute;
    state.selectedPreviewRecord = transaction.selectedPreviewRecord;
    state.panelDescended = transaction.panelDescended;

    syncPresentation();
    emitReceipt({
      lastAction: action,
      lastFailure: null
    });

    return true;
  }

  function setHeld(reason) {
    state.current = STATES.HELD;
    state.orbitFocus = PRIMARY_ENTRY.id;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.CANCELLED;
    state.orbitGestureActive = false;
    state.orbitGestureOrigin = null;

    state.activeClusterId = "";
    state.clusterPhase = ORIENTATION_PHASES.CANCELLED;
    state.clusterGestureActive = false;
    state.clusterGestureOrigin = null;

    clearPreviewSelection();
    syncPresentation();

    emitReceipt({
      status: "held",
      lastAction: "controller-held",
      lastFailure: String(reason || "PRODUCTS_CONTROLLER_FAILURE")
    });

    globalThis.dispatchEvent(
      new CustomEvent(FAILURE_EVENT, {
        detail: Object.freeze({
          reason: String(reason || "PRODUCTS_CONTROLLER_FAILURE")
        })
      })
    );
  }

  function requestPrimaryProductsSelection() {
    if (state.current !== STATES.PRIMARY_ENTRY) {
      return false;
    }

    const committedOrbit = cloneOrientation(
      state.committedOrbitOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: PRIMARY_ENTRY.id
      }
    );

    const committedCluster = cloneOrientation(
      state.committedClusterOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: state.clusterPrimaryProduct || defaultClusterPrimaryProduct()
      }
    );

    const primaryProduct =
      normalizeProductId(committedCluster.primaryId) ||
      normalizeProductId(state.clusterPrimaryProduct) ||
      defaultClusterPrimaryProduct();

    committedCluster.primaryId = primaryProduct;

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,

      orbitFocus: PRIMARY_ENTRY.id,
      orbitPreviewFocus: PRIMARY_ENTRY.id,
      orbitPhase: ORIENTATION_PHASES.COMMITTED,
      orbitGestureActive: false,
      orbitOrientation: committedOrbit,
      committedOrbitOrientation: committedOrbit,
      orbitGestureOrigin: null,

      activeClusterId: PRIMARY_ENTRY.id,
      clusterPrimaryProduct: primaryProduct,
      clusterPreviewPrimaryProduct: primaryProduct,
      clusterPhase: ORIENTATION_PHASES.COMMITTED,
      clusterGestureActive: false,
      clusterOrientation: committedCluster,
      committedClusterOrientation: committedCluster,
      clusterGestureOrigin: null,

      selectedProductId: "",
      selectedDestinationType: "",
      selectedDestinationId: "",
      selectedDestinationLabel: "",
      selectedRoute: "",
      selectedPreviewRecord: null,
      panelDescended: false
    });

    return commitAtomicTransition(
      transaction,
      `primary-products-selected:${PRIMARY_ENTRY.id}`
    );
  }

  function requestProductSelection(productId) {
    const product = getProductById(productId);

    if (!product) {
      emitReceipt({
        lastAction: "product-selection-rejected",
        lastFailure: `INVALID_PRODUCT:${String(productId || "")}`
      });
      return false;
    }

    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.PRODUCT_SELECTED
    ) {
      return false;
    }

    if (state.clusterGestureActive) {
      requestClusterCancel("semantic-product-selection");
    }

    const transaction = beginAtomicTransition({
      state: STATES.PRODUCT_SELECTED,
      activeClusterId: PRIMARY_ENTRY.id,
      clusterPrimaryProduct:
        normalizeProductId(state.clusterPrimaryProduct) ||
        defaultClusterPrimaryProduct(),
      clusterPreviewPrimaryProduct:
        normalizeProductId(state.clusterPreviewPrimaryProduct) ||
        normalizeProductId(state.clusterPrimaryProduct) ||
        defaultClusterPrimaryProduct(),
      selectedProductId: product.id,
      selectedDestinationType: "product",
      selectedDestinationId: product.id,
      selectedDestinationLabel: product.label,
      selectedRoute: product.route,
      selectedPreviewRecord: product,
      panelDescended: true
    });

    return commitAtomicTransition(
      transaction,
      `product-selected:${product.id}`
    );
  }

  function requestReturnToOrbit() {
    if (state.current !== STATES.PRODUCT_SELECTED) {
      return false;
    }

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,
      activeClusterId: PRIMARY_ENTRY.id,
      clusterPrimaryProduct:
        normalizeProductId(state.clusterPrimaryProduct) ||
        defaultClusterPrimaryProduct(),
      clusterPreviewPrimaryProduct:
        normalizeProductId(state.clusterPreviewPrimaryProduct) ||
        normalizeProductId(state.clusterPrimaryProduct) ||
        defaultClusterPrimaryProduct(),
      selectedProductId: "",
      selectedDestinationType: "",
      selectedDestinationId: "",
      selectedDestinationLabel: "",
      selectedRoute: "",
      selectedPreviewRecord: null,
      panelDescended: false
    });

    const committed = commitAtomicTransition(transaction, "return-to-orbit");

    if (!committed) {
      return false;
    }

    if (state.scene) {
      state.scene.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    emitReceipt({
      lastAction: "return-to-orbit",
      lastFailure: null
    });

    return true;
  }

  function requestReturnToConstellation(options = {}) {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.PRODUCT_SELECTED
    ) {
      return false;
    }

    const committedOrbit = cloneOrientation(
      state.committedOrbitOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: PRIMARY_ENTRY.id
      }
    );

    const transaction = beginAtomicTransition({
      state: STATES.PRIMARY_ENTRY,
      orbitFocus: PRIMARY_ENTRY.id,
      orbitPreviewFocus: PRIMARY_ENTRY.id,
      orbitPhase: ORIENTATION_PHASES.COMMITTED,
      orbitGestureActive: false,
      orbitOrientation: committedOrbit,
      committedOrbitOrientation: committedOrbit,
      orbitGestureOrigin: null,

      activeClusterId: "",
      selectedProductId: "",
      selectedDestinationType: "",
      selectedDestinationId: "",
      selectedDestinationLabel: "",
      selectedRoute: "",
      selectedPreviewRecord: null,
      panelDescended: false
    });

    const committed = commitAtomicTransition(
      transaction,
      "return-to-constellation"
    );

    if (!committed) {
      return false;
    }

    if (options.scrollToScene !== false && state.scene) {
      state.scene.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    emitReceipt({
      lastAction: "return-to-constellation",
      lastFailure: null,
      returnSource: String(options.source || "controller")
    });

    return true;
  }

  function requestEnterProduct() {
    if (state.current !== STATES.PRODUCT_SELECTED || !state.selectedRoute) {
      return false;
    }

    const route = normalizeRoute(state.selectedRoute);

    if (!route) {
      emitReceipt({
        lastAction: "enter-product-rejected",
        lastFailure: "INVALID_SELECTED_ROUTE"
      });
      return false;
    }

    globalThis.location.assign(route);
    return true;
  }

  function beginOrbitGesture(payload = {}) {
    if (state.current !== STATES.PRIMARY_ENTRY) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    const orientation = orientationFromPayload(
      payload,
      state.committedOrbitOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: PRIMARY_ENTRY.id
      },
      PRIMARY_ENTRY.id
    );

    state.orbitGestureOrigin = cloneOrientation(
      state.committedOrbitOrientation || orientation
    );
    state.orbitOrientation = orientation;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.PREVIEW;
    state.orbitGestureActive = true;

    syncDatasets();
    return true;
  }

  function requestOrbitPreview(payload = {}) {
    if (state.current !== STATES.PRIMARY_ENTRY) {
      return false;
    }

    if (!state.orbitGestureActive) {
      beginOrbitGesture(payload);
    }

    const orientation = orientationFromPayload(
      payload,
      state.orbitOrientation || state.committedOrbitOrientation,
      PRIMARY_ENTRY.id
    );

    state.orbitOrientation = orientation;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.PREVIEW;
    state.orbitGestureActive = true;

    syncDatasets();
    return true;
  }

  function requestOrbitCommit(payload = {}) {
    if (state.current !== STATES.PRIMARY_ENTRY) {
      return false;
    }

    const primaryId = String(
      payload.primaryProductsId ||
        payload.primaryId ||
        PRIMARY_ENTRY.id
    ).trim();

    if (primaryId !== PRIMARY_ENTRY.id) {
      emitReceipt({
        lastAction: "orbit-commit-rejected",
        lastFailure: "PRIMARY_PRODUCTS_ID_REQUIRED"
      });
      return false;
    }

    const orientation = orientationFromPayload(
      payload,
      state.orbitOrientation || state.committedOrbitOrientation,
      PRIMARY_ENTRY.id
    );

    state.orbitOrientation = cloneOrientation(orientation);
    state.committedOrbitOrientation = cloneOrientation(orientation);
    state.orbitFocus = PRIMARY_ENTRY.id;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitGestureOrigin = null;
    state.orbitRevision += 1;

    syncPresentation();
    emitReceipt({
      lastAction: "orbit-committed:products",
      lastFailure: null,
      orbitCommitSource: String(payload.source || "renderer")
    });

    return true;
  }

  function requestOrbitCancel(reason = "cancelled") {
    if (!state.orbitGestureActive && state.orbitPhase !== ORIENTATION_PHASES.PREVIEW) {
      return false;
    }

    const restored = cloneOrientation(
      state.orbitGestureOrigin ||
        state.committedOrbitOrientation || {
          quaternion: QUATERNION.identity,
          primaryId: PRIMARY_ENTRY.id
        }
    );

    state.orbitOrientation = restored;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitGestureOrigin = null;

    syncDatasets();
    emitReceipt({
      lastAction: `orbit-preview-cancelled:${String(reason || "cancelled")}`,
      lastFailure: null
    });

    return true;
  }

  function beginClusterGesture(payload = {}) {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.PRODUCT_SELECTED
    ) {
      return false;
    }

    if (state.clusterGestureActive) {
      return true;
    }

    const primaryProduct =
      normalizeProductId(
        payload.primaryProductId ||
          payload.primaryId ||
          state.clusterPreviewPrimaryProduct ||
          state.clusterPrimaryProduct
      ) || defaultClusterPrimaryProduct();

    const orientation = orientationFromPayload(
      payload,
      state.committedClusterOrientation || {
        quaternion: QUATERNION.identity,
        primaryId: primaryProduct
      },
      primaryProduct
    );

    orientation.primaryId = primaryProduct;

    state.clusterGestureOrigin = cloneOrientation(
      state.committedClusterOrientation || orientation
    );
    state.clusterOrientation = orientation;
    state.clusterPreviewPrimaryProduct = primaryProduct;
    state.clusterPhase = ORIENTATION_PHASES.PREVIEW;
    state.clusterGestureActive = true;

    syncDatasets();
    return true;
  }

  function requestClusterPreview(payload = {}) {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.PRODUCT_SELECTED
    ) {
      return false;
    }

    if (!state.clusterGestureActive) {
      beginClusterGesture(payload);
    }

    const primaryProduct =
      normalizeProductId(
        payload.primaryProductId ||
          payload.primaryId ||
          state.clusterPreviewPrimaryProduct ||
          state.clusterPrimaryProduct
      ) || defaultClusterPrimaryProduct();

    const orientation = orientationFromPayload(
      payload,
      state.clusterOrientation || state.committedClusterOrientation,
      primaryProduct
    );

    orientation.primaryId = primaryProduct;

    state.clusterOrientation = orientation;
    state.clusterPreviewPrimaryProduct = primaryProduct;
    state.clusterPhase = ORIENTATION_PHASES.PREVIEW;
    state.clusterGestureActive = true;

    syncDatasets();
    return true;
  }

  function requestClusterCommit(payload = {}) {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.PRODUCT_SELECTED
    ) {
      return false;
    }

    const primaryProduct =
      normalizeProductId(
        payload.primaryProductId ||
          payload.primaryId ||
          state.clusterPreviewPrimaryProduct ||
          state.clusterPrimaryProduct
      );

    if (!primaryProduct) {
      emitReceipt({
        lastAction: "cluster-commit-rejected",
        lastFailure: "CLUSTER_PRIMARY_PRODUCT_REQUIRED"
      });
      return false;
    }

    const orientation = orientationFromPayload(
      payload,
      state.clusterOrientation || state.committedClusterOrientation,
      primaryProduct
    );

    orientation.primaryId = primaryProduct;

    state.clusterOrientation = cloneOrientation(orientation);
    state.committedClusterOrientation = cloneOrientation(orientation);
    state.clusterPrimaryProduct = primaryProduct;
    state.clusterPreviewPrimaryProduct = primaryProduct;
    state.clusterPhase = ORIENTATION_PHASES.COMMITTED;
    state.clusterGestureActive = false;
    state.clusterGestureOrigin = null;
    state.clusterRevision += 1;

    syncPresentation();
    emitReceipt({
      lastAction: `cluster-committed:${primaryProduct}`,
      lastFailure: null,
      clusterCommitSource: String(payload.source || "renderer")
    });

    return true;
  }

  function requestClusterCancel(reason = "cancelled") {
    if (!state.clusterGestureActive && state.clusterPhase !== ORIENTATION_PHASES.PREVIEW) {
      return false;
    }

    const restored = cloneOrientation(
      state.clusterGestureOrigin ||
        state.committedClusterOrientation || {
          quaternion: QUATERNION.identity,
          primaryId: state.clusterPrimaryProduct || defaultClusterPrimaryProduct()
        }
    );

    state.clusterOrientation = restored;
    state.clusterPreviewPrimaryProduct =
      normalizeProductId(restored.primaryId) ||
      state.clusterPrimaryProduct ||
      defaultClusterPrimaryProduct();
    state.clusterPhase = ORIENTATION_PHASES.COMMITTED;
    state.clusterGestureActive = false;
    state.clusterGestureOrigin = null;

    syncDatasets();
    emitReceipt({
      lastAction: `cluster-preview-cancelled:${String(reason || "cancelled")}`,
      lastFailure: null
    });

    return true;
  }

  function shouldBlockEnhancedSemanticClick() {
    const crystalsReceipt = globalThis[RECEIPT_SYMBOL.replace("CONTROLLER", "CRYSTALS")];
    if (crystalsReceipt && crystalsReceipt.gestureActive) {
      return true;
    }

    const rootBlockedUntil = finiteNumber(state.root?.dataset?.productsSemanticBlockedUntil, 0);
    if (rootBlockedUntil && performance.now() < rootBlockedUntil) {
      return true;
    }

    return false;
  }

  function handleSemanticClick(event) {
    if (shouldBlockEnhancedSemanticClick()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const control = event.target.closest(
      `${SELECTORS.primaryEntry}, ${SELECTORS.productRecord}`
    );

    if (!control || !state.semanticLayer.contains(control)) {
      return;
    }

    if (control.matches(SELECTORS.primaryEntry)) {
      event.preventDefault();
      requestPrimaryProductsSelection();
      return;
    }

    const productId = normalizeProductId(
      control.dataset.productId ||
        control.dataset.destinationId ||
        control.dataset.productsId ||
        ""
    );

    if (!productId) {
      return;
    }

    event.preventDefault();
    requestProductSelection(productId);
  }

  function bindSemanticControls() {
    state.semanticLayer.addEventListener("click", handleSemanticClick);
  }

  function bindPanelControls() {
    if (state.enterButton) {
      state.enterButton.addEventListener("click", event => {
        event.preventDefault();
        requestEnterProduct();
      });
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener("click", event => {
        event.preventDefault();
        requestReturnToOrbit();
      });
    }

    if (state.returnToConstellationButton) {
      state.returnToConstellationButton.addEventListener("click", event => {
        event.preventDefault();
        requestReturnToConstellation();
      });
    }
  }

  function readReducedMotion() {
    state.reducedMotion =
      Boolean(
        globalThis.matchMedia &&
          typeof globalThis.matchMedia === "function" &&
          globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
  }

  function resolveDom() {
    const roots = qsa(SELECTORS.pageRoot);

    if (roots.length !== 1) {
      throw new Error(`PRODUCTS_ROOT_COUNT_INVALID:${roots.length}`);
    }

    state.root = roots[0];

    if (state.root.tagName.toLowerCase() === "html") {
      throw new Error("PRODUCTS_ROOT_MAY_NOT_BE_HTML");
    }

    state.scene = qs(SELECTORS.sceneRoot, state.root);
    if (!state.scene) {
      throw new Error("PRODUCTS_SCENE_NOT_FOUND");
    }

    state.semanticLayer = qs(SELECTORS.semanticLayer, state.root);
    if (!state.semanticLayer) {
      throw new Error("PRODUCTS_SEMANTIC_LAYER_NOT_FOUND");
    }

    state.fallbackRoot = qs(SELECTORS.fallbackRoot, state.root);
    if (!state.fallbackRoot) {
      throw new Error("PRODUCTS_FALLBACK_NOT_FOUND");
    }

    state.fallbackLinks = qsa(SELECTORS.fallbackLink, state.fallbackRoot);
    if (state.fallbackLinks.length !== PRODUCTS.length) {
      throw new Error(`PRODUCTS_FALLBACK_COUNT_INVALID:${state.fallbackLinks.length}`);
    }

    state.previewPanel = qs(SELECTORS.previewPanel, state.root);
    if (!state.previewPanel) {
      throw new Error("PRODUCTS_PREVIEW_PANEL_NOT_FOUND");
    }

    state.primaryEntry = qs(SELECTORS.primaryEntry, state.semanticLayer);
    if (!state.primaryEntry) {
      throw new Error("PRODUCTS_PRIMARY_ENTRY_NOT_FOUND");
    }

    state.productRecords = qsa(SELECTORS.productRecord, state.semanticLayer);
    if (state.productRecords.length !== PRODUCTS.length) {
      throw new Error(`PRODUCTS_SEMANTIC_PRODUCT_COUNT_INVALID:${state.productRecords.length}`);
    }

    state.previewEyebrow = qs(SELECTORS.previewEyebrow, state.previewPanel);
    state.previewTitle = qs(SELECTORS.previewTitle, state.previewPanel);
    state.previewSummary = qs(SELECTORS.previewSummary, state.previewPanel);
    state.previewRelationship = qs(SELECTORS.previewRelationship, state.previewPanel);

    state.enterButton = qs(SELECTORS.enterProduct, state.previewPanel);
    state.returnToOrbitButton = qs(SELECTORS.returnToOrbit, state.previewPanel);
    state.returnToConstellationButton = qs(SELECTORS.returnToConstellation, state.previewPanel);

    state.guidance = qs(SELECTORS.guidance, state.root);
    state.controllerReceiptOutput = qs(SELECTORS.controllerReceipt, state.root);
    state.crystalsReceiptOutput = qs(SELECTORS.crystalsReceipt, state.root);
  }

  function initializeState() {
    const clusterPrimary =
      normalizeProductId(state.root.dataset.clusterPrimaryProduct) ||
      defaultClusterPrimaryProduct();

    const orbitQuaternion = (() => {
      const serialized = String(state.root.dataset.orbitQuaternion || "").trim();
      if (!serialized) {
        return QUATERNION.identity.slice();
      }

      try {
        return normalizeQuaternion(JSON.parse(serialized));
      } catch (_) {
        return QUATERNION.identity.slice();
      }
    })();

    const clusterQuaternion = (() => {
      const serialized = String(state.root.dataset.clusterQuaternion || "").trim();
      if (!serialized) {
        return QUATERNION.identity.slice();
      }

      try {
        return normalizeQuaternion(JSON.parse(serialized));
      } catch (_) {
        return QUATERNION.identity.slice();
      }
    })();

    state.orbitFocus = PRIMARY_ENTRY.id;
    state.orbitPreviewFocus = PRIMARY_ENTRY.id;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitRevision = finiteNumber(state.root.dataset.orbitRevision, 0);
    state.orbitOrientation = {
      quaternion: orbitQuaternion,
      primaryId: PRIMARY_ENTRY.id
    };
    state.committedOrbitOrientation = cloneOrientation(state.orbitOrientation);

    state.activeClusterId = "";
    state.clusterPrimaryProduct = clusterPrimary;
    state.clusterPreviewPrimaryProduct = clusterPrimary;
    state.clusterPhase = ORIENTATION_PHASES.COMMITTED;
    state.clusterGestureActive = false;
    state.clusterRevision = finiteNumber(state.root.dataset.clusterRevision, 0);
    state.clusterOrientation = {
      quaternion: clusterQuaternion,
      primaryId: clusterPrimary
    };
    state.committedClusterOrientation = cloneOrientation(state.clusterOrientation);

    clearPreviewSelection();
    state.current = STATES.PRIMARY_ENTRY;
  }

  function exposeApi() {
    globalThis[CONTROLLER_SYMBOL] = Object.freeze({
      contract: CONTRACT,

      receipt: () =>
        Object.freeze({
          ...RECEIPT,
          orbitQuaternion: Object.freeze(Array.from(RECEIPT.orbitQuaternion)),
          clusterQuaternion: Object.freeze(Array.from(RECEIPT.clusterQuaternion))
        }),

      getFrameState: () =>
        Object.freeze({
          state: state.current,
          orbitFocus: state.orbitFocus,
          orbitPreviewFocus: state.orbitPreviewFocus,
          orbitPhase: state.orbitPhase,
          orbitGestureActive: state.orbitGestureActive,
          orbitRevision: state.orbitRevision,
          orbitOrientation: freezeOrientation(state.orbitOrientation),
          committedOrbitOrientation: freezeOrientation(state.committedOrbitOrientation),
          activeClusterId: state.activeClusterId,
          cluster: state.activeClusterId
            ? Object.freeze({
                id: state.activeClusterId,
                productIds: Object.freeze(PRODUCTS.map(product => product.id)),
                primaryProduct: state.clusterPrimaryProduct,
                previewPrimaryProduct: state.clusterPreviewPrimaryProduct,
                phase: state.clusterPhase,
                gestureActive: state.clusterGestureActive,
                revision: state.clusterRevision,
                orientation: freezeOrientation(state.clusterOrientation),
                committedOrientation: freezeOrientation(state.committedClusterOrientation)
              })
            : null,
          selectedProductId: state.selectedProductId,
          selectedDestinationType: state.selectedDestinationType,
          selectedDestinationId: state.selectedDestinationId,
          selectedDestinationLabel: state.selectedDestinationLabel,
          selectedRoute: state.selectedRoute,
          selectedPreviewRecord: state.selectedPreviewRecord
            ? Object.freeze({ ...state.selectedPreviewRecord })
            : null,
          panelDescended: state.panelDescended,
          reducedMotion: state.reducedMotion
        }),

      beginOrbitGesture,
      requestOrbitPreview,
      requestOrbitCommit,
      requestOrbitCancel,
      beginClusterGesture,
      requestClusterPreview,
      requestClusterCommit,
      requestClusterCancel,
      requestReturnToConstellation,
      requestPrimaryProductsSelection,
      requestProductSelection,

      requestReturnToOrbit,
      requestEnterProduct
    });
  }

  function initialize() {
    try {
      resolveDom();
      readReducedMotion();
      initializeState();
      exposeApi();
      bindSemanticControls();
      bindPanelControls();

      state.initialized = true;

      syncPresentation();
      emitReceipt({
        status: "available",
        lastAction: "controller-initialized",
        lastFailure: null
      });
    } catch (error) {
      setHeld(
        `CONTROLLER_INIT_FAILURE:${
          error && error.message ? error.message : String(error)
        }`
      );
    }
  }

  globalThis[RECEIPT_SYMBOL] = Object.freeze({
    ...RECEIPT,
    orbitQuaternion: Object.freeze(Array.from(RECEIPT.orbitQuaternion)),
    clusterQuaternion: Object.freeze(Array.from(RECEIPT.clusterQuaternion))
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
