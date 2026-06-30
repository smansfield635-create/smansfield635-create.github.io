/* TARGET FILE: /showroom/index.manifest.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_STATIC_PAGE_MANIFEST_VALIDATOR_TNT_v1 */

/*
  CONTROLLING TWO-FILE CONTRACT

  /showroom/index.html
  - Complete static page authority.
  - Owns all visible context and semantic structure.
  - Owns native <details> disclosures.
  - Owns controls, mounts, dialogs, fallbacks, accessibility
    relationships, receipt elements, stylesheets, and runtime script order.
  - Must exist as a complete usable DOM before runtime modules initialize.

  /showroom/index.manifest.js
  - Non-mutating technical manifest and validator only.
  - Owns technical declarations, route expectations, structural counts,
    ownership boundaries, selector expectations, dependency expectations,
    contract validation, and a bounded validation receipt.

  ABSOLUTE PROHIBITIONS

  This file must never:
  - create, replace, move, or remove DOM nodes;
  - write text, HTML, values, attributes, classes, styles, or datasets;
  - inject narrative, gauge, route, dialog, or fallback content;
  - open, close, or otherwise alter any <details> element;
  - intercept click, pointer, touch, wheel, or keyboard behavior;
  - call preventDefault(), stopPropagation(), or stopImmediatePropagation();
  - control navigation;
  - initialize controller, gauges, Compass, Diamond, compositor, crystals,
    Window, interactions, UI, manor blueprint, or Elara systems;
  - repair the page by mutation;
  - become a prerequisite for page visibility or usability.

  VALIDATION MODEL

  - Read-only inspection only.
  - Validation failure is reported, never repaired.
  - The bounded receipt is published only as an immutable JavaScript value.
  - Existing HTML receipt elements are inspected but never populated or changed.
*/

(() => {
  "use strict";

  const MANIFEST_ID =
    "SHOWROOM_MIRRORLAND_STATIC_PAGE_MANIFEST_VALIDATOR_TNT_v1";

  const MANIFEST_VERSION = "1.0.0";

  const PAGE_CONTRACT =
    "SHOWROOM_MIRRORLAND_OFFICIAL_GATE_STATIC_HTML_TNT_v6";

  const GLOBAL_MANIFEST_SYMBOL =
    "SHOWROOM_MIRRORLAND_STATIC_PAGE_MANIFEST_TNT_v1";

  const GLOBAL_RECEIPT_SYMBOL =
    "SHOWROOM_MIRRORLAND_STATIC_PAGE_VALIDATION_RECEIPT_TNT_v1";

  const STATUS = Object.freeze({
    PASS: "PASS",
    FAIL: "FAIL",
    UNEVALUABLE: "UNEVALUABLE"
  });

  const OWNERSHIP = deepFreeze({
    html: {
      file: "/showroom/index.html",
      role: "COMPLETE_STATIC_PAGE_AUTHORITY",

      owns: [
        "visible context",
        "semantic structure",
        "native details disclosures",
        "controls",
        "mounts",
        "dialogs",
        "fallbacks",
        "accessibility relationships",
        "receipt elements",
        "stylesheets",
        "runtime script order"
      ],

      requirements: {
        completeBeforeRuntimeInitialization: true,
        usableWithoutManifestMutation: true,
        runtimeCriticalNodesStatic: true
      }
    },

    manifest: {
      file: "/showroom/index.manifest.js",
      role: "NON_MUTATING_TECHNICAL_MANIFEST_AND_VALIDATOR",

      owns: [
        "technical declarations",
        "route expectations",
        "structural counts",
        "ownership boundaries",
        "selector expectations",
        "dependency expectations",
        "read-only contract validation",
        "bounded immutable validation receipt"
      ],

      prohibited: [
        "DOM node creation",
        "DOM node replacement",
        "DOM node movement",
        "DOM node removal",
        "content injection",
        "attribute mutation",
        "class mutation",
        "style mutation",
        "dataset mutation",
        "disclosure state mutation",
        "event interception",
        "navigation control",
        "runtime system initialization",
        "runtime system repair"
      ]
    },

    rejectedArchitecture: {
      files: [
        "/showroom/index.content.js",
        "/showroom/index.build.js"
      ],

      status: "REJECTED_RUNTIME_ASSEMBLY_ARCHITECTURE",

      mayLoadInFinalPage: false
    }
  });

  const ROUTES = deepFreeze({
    page: "/showroom/",
    mainCompass: "/index.html",
    characters: "/characters/",
    elara: "/elara/index.html",

    localTargets: {
      arrival: "#arrival",
      instructions: "#showroom-instructions",
      orbit: "#showroom-orbit",
      object: "#object-gauges",
      structure: "#structure-gauges",
      interaction: "#interaction-gauges",
      systems: "#systems-gauges",
      information: "#information-front",
      platformTab: "#platform-tab",
      engineeringTab: "#engineering-tab",
      evidenceTab: "#evidence-tab",
      diamondControls: "#showroom-diamond-controls"
    }
  });

  const STRUCTURAL_COUNTS = deepFreeze({
    primaryRouteStars: 2,
    primaryClusterStars: 2,
    totalPrimaryStars: 4,

    gaugeDestinationStars: 4,
    informationDestinationStars: 3,
    totalDestinationStars: 7,

    objectGaugeSelectors: 4,
    structureGaugeSelectors: 6,
    interactionGaugeSelectors: 10,
    systemsGaugeSelectors: 5,
    totalGaugeSelectors: 25,

    objectGaugeDetails: 4,
    structureGaugeDetails: 6,
    interactionGaugeDetails: 10,
    systemsGaugeDetails: 5,
    totalGaugeDetails: 25,

    compositionRegions: 5,

    informationTabs: 3,
    informationPanels: 3,

    prefaceSections: 5,
    instructionSteps: 5,

    constructionRecords: 9,
    constructionDisclosures: 5,

    routeDialogs: 1,
    compassDialogs: 1,
    constructionDialogs: 1,
    totalDialogs: 3,

    runtimeReceiptElements: 7
  });

  const GEOMETRY = deepFreeze({
    radialSectors: 16,
    structuralBands: 16,
    latticeSeats: 256,
    surfaceTriangles: 512,
    latticeConnections: 800,
    materialRegions: 14,
    publicViews: 2
  });

  const REQUIRED_PAGE_ATTRIBUTES = deepFreeze({
    "data-route": "/showroom/",
    "data-page": "showroom",

    "data-showroom-root-contract":
      "mirrorland-official-gate-constellation-gauge-information",

    "data-showroom-navigation-model":
      "compact-unlabeled-constellation",

    "data-showroom-primary-mode": "orbit",
    "data-showroom-local-front-model": "single-active-front",

    "data-showroom-stage-separation": "true",
    "data-showroom-orbit-stage-independent": "true",
    "data-showroom-diamond-stage-independent": "true",
    "data-showroom-window-stage-diamond-only": "true",

    "data-compass-fixed-center": "true",
    "data-compass-orbital-reference": "true",
    "data-compass-immediate-navigation": "false",
    "data-compass-renderer-navigation-authority": "false",
    "data-compass-controller-navigation-authority": "true",

    "data-mirrorland-window-independent": "true",
    "data-mirrorland-window-foreground": "true",
    "data-mirrorland-window-in-front-of-diamond": "true",
    "data-mirrorland-window-compass-owned": "false",
    "data-mirrorland-window-crystal-depth-participant": "false",

    "data-diamond-generation": "G3",
    "data-diamond-render-mode": "native-webgl",
    "data-diamond-protected-core": "true",

    "data-native-webgl": "true",
    "data-webgl-fallback": "true",

    "data-radial-sectors": "16",
    "data-structural-bands": "16",
    "data-lattice-seats": "256",
    "data-surface-triangles": "512",
    "data-lattice-connections": "800",
    "data-material-regions": "14",
    "data-public-views": "2",

    "data-generated-image": "false",
    "data-imported-3d-model": "false",
    "data-visual-pass-claimed": "false",
    "data-runtime-pass-claimed": "false",
    "data-production-authorized": "false",
    "data-deployment-authorized": "false"
  });

  const REQUIRED_UNIQUE_SELECTORS = deepFreeze([
    {
      label: "static page root",
      selector: "[data-showroom-root]"
    },

    {
      label: "main landmark",
      selector: "#main"
    },

    {
      label: "arrival section",
      selector: "#arrival"
    },

    {
      label: "page title",
      selector: "#page-title"
    },

    {
      label: "Mirrorland preface disclosure",
      selector: "#mirrorland-preface"
    },

    {
      label: "instructions section",
      selector: "#showroom-instructions"
    },

    {
      label: "instructions disclosure",
      selector: "#showroom-instructions-disclosure"
    },

    {
      label: "orbit section",
      selector: "#showroom-orbit"
    },

    {
      label: "orbit field",
      selector: "[data-showroom-orbit-field]"
    },

    {
      label: "Compass visual mount",
      selector: "[data-upstream-compass-mount]"
    },

    {
      label: "Compass semantic control",
      selector: "[data-showroom-compass-control]"
    },

    {
      label: "gauge cluster",
      selector: "#showroom-cluster-gauges"
    },

    {
      label: "information cluster",
      selector: "#showroom-cluster-information"
    },

    {
      label: "front host",
      selector: "[data-showroom-front-host]"
    },

    {
      label: "Object gauge front",
      selector: "#object-gauges"
    },

    {
      label: "Structure gauge front",
      selector: "#structure-gauges"
    },

    {
      label: "Interaction gauge front",
      selector: "#interaction-gauges"
    },

    {
      label: "Systems gauge front",
      selector: "#systems-gauges"
    },

    {
      label: "information front",
      selector: "#information-front"
    },

    {
      label: "Diamond stage",
      selector: "[data-showroom-diamond-stage]"
    },

    {
      label: "Diamond canvas",
      selector: "[data-showroom-diamond-canvas]"
    },

    {
      label: "Diamond controls",
      selector: "#showroom-diamond-controls"
    },

    {
      label: "Window mount",
      selector: "[data-showroom-window-mount]"
    },

    {
      label: "Window control",
      selector: "[data-showroom-window-control]"
    },

    {
      label: "route dialog",
      selector: "#showroom-route-dialog"
    },

    {
      label: "Compass dialog",
      selector: "#showroom-compass-dialog"
    },

    {
      label: "construction record dialog",
      selector: "#construction-record-dialog"
    }
  ]);

  const REQUIRED_SELECTOR_COUNTS = deepFreeze([
    {
      label: "primary semantic stars",
      selector:
        "[data-showroom-primary-stars] > [data-showroom-semantic-star]",
      expected: STRUCTURAL_COUNTS.totalPrimaryStars
    },

    {
      label: "gauge destination stars",
      selector:
        "#showroom-cluster-gauges [data-showroom-semantic-star]",
      expected: STRUCTURAL_COUNTS.gaugeDestinationStars
    },

    {
      label: "information destination stars",
      selector:
        "#showroom-cluster-information [data-showroom-semantic-star]",
      expected: STRUCTURAL_COUNTS.informationDestinationStars
    },

    {
      label: "Object gauge selectors",
      selector:
        '[data-gauge-dashboard-id="object"] [data-showroom-gauge]',
      expected: STRUCTURAL_COUNTS.objectGaugeSelectors
    },

    {
      label: "Structure gauge selectors",
      selector:
        '[data-gauge-dashboard-id="structure"] [data-showroom-gauge]',
      expected: STRUCTURAL_COUNTS.structureGaugeSelectors
    },

    {
      label: "Interaction gauge selectors",
      selector:
        '[data-gauge-dashboard-id="interaction"] [data-showroom-gauge]',
      expected: STRUCTURAL_COUNTS.interactionGaugeSelectors
    },

    {
      label: "Systems gauge selectors",
      selector:
        '[data-gauge-dashboard-id="systems"] [data-showroom-gauge]',
      expected: STRUCTURAL_COUNTS.systemsGaugeSelectors
    },

    {
      label: "Object gauge details",
      selector:
        '#object-gauges [data-showroom-gauge-detail]',
      expected: STRUCTURAL_COUNTS.objectGaugeDetails
    },

    {
      label: "Structure gauge details",
      selector:
        '#structure-gauges [data-showroom-gauge-detail]',
      expected: STRUCTURAL_COUNTS.structureGaugeDetails
    },

    {
      label: "Interaction gauge details",
      selector:
        '#interaction-gauges [data-showroom-gauge-detail]',
      expected: STRUCTURAL_COUNTS.interactionGaugeDetails
    },

    {
      label: "Systems gauge details",
      selector:
        '#systems-gauges [data-showroom-gauge-detail]',
      expected: STRUCTURAL_COUNTS.systemsGaugeDetails
    },

    {
      label: "composition regions",
      selector: "[data-showroom-composition-region]",
      expected: STRUCTURAL_COUNTS.compositionRegions
    },

    {
      label: "information tabs",
      selector: "[data-showroom-information-tab]",
      expected: STRUCTURAL_COUNTS.informationTabs
    },

    {
      label: "information panels",
      selector: "[data-showroom-information-panel]",
      expected: STRUCTURAL_COUNTS.informationPanels
    },

    {
      label: "preface sections",
      selector: "#mirrorland-preface .mirrorland-preface__content > section",
      expected: STRUCTURAL_COUNTS.prefaceSections
    },

    {
      label: "instruction steps",
      selector: "[data-showroom-instruction]",
      expected: STRUCTURAL_COUNTS.instructionSteps
    },

    {
      label: "construction records",
      selector:
        "#construction-record-dialog .construction-record",
      expected: STRUCTURAL_COUNTS.constructionRecords
    },

    {
      label: "construction disclosures",
      selector:
        "#construction-record-dialog .construction-details > details",
      expected: STRUCTURAL_COUNTS.constructionDisclosures
    },

    {
      label: "dialogs",
      selector: "dialog",
      expected: STRUCTURAL_COUNTS.totalDialogs
    },

    {
      label: "runtime receipt elements",
      selector: [
        "[data-showroom-controller-receipt]",
        "[data-showroom-controller-validation]",
        "[data-showroom-gauges-receipt]",
        "[data-showroom-interactions-receipt]",
        "[data-showroom-compositor-receipt]",
        "[data-showroom-crystals-receipt]",
        "[data-showroom-window-receipt]"
      ].join(","),
      expected: STRUCTURAL_COUNTS.runtimeReceiptElements
    }
  ]);

  const REQUIRED_NATIVE_DISCLOSURES = deepFreeze([
    {
      label: "fallback navigation disclosure",
      selector: ".route-menu"
    },

    {
      label: "Mirrorland preface disclosure",
      selector: "#mirrorland-preface"
    },

    {
      label: "instructions disclosure",
      selector: "#showroom-instructions-disclosure"
    },

    {
      label: "Diamond controls disclosure",
      selector: ".object-control-tray"
    }
  ]);

  const REQUIRED_RELATIONSHIPS = deepFreeze([
    {
      label: "instructions section heading",
      source: "#showroom-instructions",
      attribute: "aria-labelledby",
      target: "#showroom-instructions-title"
    },

    {
      label: "orbit section heading",
      source: "#showroom-orbit",
      attribute: "aria-labelledby",
      target: "#showroom-orbit-title"
    },

    {
      label: "Compass dialog control",
      source: "[data-showroom-compass-control]",
      attribute: "aria-controls",
      target: "#showroom-compass-dialog"
    },

    {
      label: "route dialog title",
      source: "#showroom-route-dialog",
      attribute: "aria-labelledby",
      target: "#showroom-route-dialog-title"
    },

    {
      label: "route dialog description",
      source: "#showroom-route-dialog",
      attribute: "aria-describedby",
      target: "#showroom-route-dialog-description"
    },

    {
      label: "Compass dialog title",
      source: "#showroom-compass-dialog",
      attribute: "aria-labelledby",
      target: "#showroom-compass-dialog-title"
    },

    {
      label: "Compass dialog description",
      source: "#showroom-compass-dialog",
      attribute: "aria-describedby",
      target: "#showroom-compass-dialog-description"
    },

    {
      label: "construction dialog title",
      source: "#construction-record-dialog",
      attribute: "aria-labelledby",
      target: "#construction-dialog-title"
    },

    {
      label: "platform tab panel",
      source: "#platform-tab",
      attribute: "aria-controls",
      target: "#platform-panel"
    },

    {
      label: "engineering tab panel",
      source: "#engineering-tab",
      attribute: "aria-controls",
      target: "#engineering-panel"
    },

    {
      label: "evidence tab panel",
      source: "#evidence-tab",
      attribute: "aria-controls",
      target: "#evidence-panel"
    }
  ]);

  const REQUIRED_GAUGE_IDS = deepFreeze({
    object: [
      "public-views",
      "geometry-authority",
      "renderer-state",
      "window-state"
    ],

    structure: [
      "radial-sectors",
      "structural-bands",
      "addressable-seats",
      "surface-triangles",
      "lattice-connections",
      "material-regions"
    ],

    interaction: [
      "pointer",
      "touch",
      "pinch-zoom",
      "wheel-zoom",
      "keyboard",
      "inspection",
      "reset",
      "reduced-motion",
      "responsive",
      "fallback"
    ],

    systems: [
      "narrative-environment",
      "character-paths",
      "frontier-sciences",
      "simulation-systems",
      "world-impact"
    ]
  });

  const EXPECTED_DEPENDENCIES = deepFreeze([
    {
      key: "manifest",
      src: "/showroom/index.manifest.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_STATIC_PAGE_MANIFEST_VALIDATOR_TNT_v1"
    },

    {
      key: "controller",
      src: "/showroom/index.controller.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v4"
    },

    {
      key: "gauges",
      src: "/showroom/index.gauges.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2"
    },

    {
      key: "compassGeometry",
      src: "/assets/compass/compass.geometry.js",
      requiredVersion: null
    },

    {
      key: "compassRenderer",
      src: "/assets/compass/compass.renderer.js",
      requiredVersion: null
    },

    {
      key: "diamondGeometry",
      src: "/showroom/index.diamond.geometry.js",
      requiredVersion:
        "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1"
    },

    {
      key: "diamondRenderer",
      src: "/showroom/index.diamond.js",
      requiredVersion:
        "SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1"
    },

    {
      key: "compositor",
      src: "/showroom/index.compositor.js",
      requiredVersion:
        "SHOWROOM_COMPASS_CENTERED_DEPTH_COMPOSITOR_TNT_v1"
    },

    {
      key: "crystals",
      src: "/showroom/index.crystals.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v3"
    },

    {
      key: "window",
      src: "/showroom/index.window.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1"
    },

    {
      key: "interactions",
      src: "/showroom/index.interactions.js",
      requiredVersion:
        "SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2"
    },

    {
      key: "diamondUi",
      src: "/showroom/index.ui.js",
      requiredVersion:
        "SHOWROOM_DIAMOND_G3_OBJECT_LATTICE_UI_CONTROLLER_TNT_v1"
    },

    {
      key: "blueprintRegistry",
      src: "/assets/manor-blueprint/manor.blueprint.registry.js",
      requiredVersion:
        "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1"
    },

    {
      key: "blueprintRuntime",
      src: "/assets/manor-blueprint/manor.blueprint.js",
      requiredVersion:
        "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1"
    },

    {
      key: "elaraEntry",
      src: "/assets/elara/elara.room-entry.js",
      requiredVersion:
        "ELARA_ROOM_ENTRY_ISOLATED_HARD_NAVIGATION_ASSET_TNT_v1"
    }
  ]);

  const FORBIDDEN_DEPENDENCIES = deepFreeze([
    "/showroom/index.content.js",
    "/showroom/index.build.js"
  ]);

  const MANIFEST = deepFreeze({
    manifestId: MANIFEST_ID,
    manifestVersion: MANIFEST_VERSION,
    pageContract: PAGE_CONTRACT,

    status: {
      official: false,
      canonical: false,
      runtimePassClaimed: false,
      visualPassClaimed: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    },

    ownership: OWNERSHIP,
    routes: ROUTES,
    structuralCounts: STRUCTURAL_COUNTS,
    geometry: GEOMETRY,

    validation: {
      mode: "READ_ONLY",
      mutationAuthorized: false,
      repairAuthorized: false,
      navigationAuthorized: false,
      initializationAuthorized: false,

      requiredPageAttributes: REQUIRED_PAGE_ATTRIBUTES,
      requiredUniqueSelectors: REQUIRED_UNIQUE_SELECTORS,
      requiredSelectorCounts: REQUIRED_SELECTOR_COUNTS,
      requiredNativeDisclosures: REQUIRED_NATIVE_DISCLOSURES,
      requiredRelationships: REQUIRED_RELATIONSHIPS,
      requiredGaugeIds: REQUIRED_GAUGE_IDS,
      expectedDependencies: EXPECTED_DEPENDENCIES,
      forbiddenDependencies: FORBIDDEN_DEPENDENCIES
    }
  });

  function deepFreeze(value) {
    if (
      value === null ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.getOwnPropertyNames(value).forEach((property) => {
      deepFreeze(value[property]);
    });

    return Object.freeze(value);
  }

  function normalizeScriptPath(src) {
    try {
      return new URL(src, document.baseURI).pathname;
    } catch {
      return String(src || "").split("?")[0];
    }
  }

  function readScriptVersion(src) {
    try {
      const url = new URL(src, document.baseURI);

      for (const value of url.searchParams.values()) {
        if (value) {
          return value;
        }
      }

      return null;
    } catch {
      const queryIndex = String(src || "").indexOf("?");

      if (queryIndex === -1) {
        return null;
      }

      const query = String(src).slice(queryIndex + 1);
      const equalsIndex = query.indexOf("=");

      return equalsIndex === -1
        ? decodeURIComponent(query)
        : decodeURIComponent(query.slice(equalsIndex + 1));
    }
  }

  function makeCheck({
    category,
    label,
    status,
    expected = null,
    actual = null,
    detail = null
  }) {
    return Object.freeze({
      category,
      label,
      status,
      expected,
      actual,
      detail
    });
  }

  function validatePageAttributes() {
    const root = document.documentElement;

    return Object.entries(REQUIRED_PAGE_ATTRIBUTES).map(
      ([attribute, expected]) => {
        const actual = root.getAttribute(attribute);

        return makeCheck({
          category: "PAGE_ATTRIBUTE",
          label: attribute,
          status:
            actual === expected
              ? STATUS.PASS
              : STATUS.FAIL,
          expected,
          actual
        });
      }
    );
  }

  function validateUniqueSelectors() {
    return REQUIRED_UNIQUE_SELECTORS.map((expectation) => {
      const actual = document.querySelectorAll(
        expectation.selector
      ).length;

      return makeCheck({
        category: "UNIQUE_SELECTOR",
        label: expectation.label,
        status:
          actual === 1
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: 1,
        actual,
        detail: expectation.selector
      });
    });
  }

  function validateSelectorCounts() {
    return REQUIRED_SELECTOR_COUNTS.map((expectation) => {
      const actual = document.querySelectorAll(
        expectation.selector
      ).length;

      return makeCheck({
        category: "SELECTOR_COUNT",
        label: expectation.label,
        status:
          actual === expectation.expected
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: expectation.expected,
        actual,
        detail: expectation.selector
      });
    });
  }

  function validateNativeDisclosures() {
    return REQUIRED_NATIVE_DISCLOSURES.map((expectation) => {
      const node = document.querySelector(
        expectation.selector
      );

      const isDetails =
        node instanceof HTMLDetailsElement;

      const hasDirectSummary =
        isDetails &&
        Array.from(node.children).some(
          (child) => child.tagName === "SUMMARY"
        );

      return makeCheck({
        category: "NATIVE_DISCLOSURE",
        label: expectation.label,
        status:
          isDetails && hasDirectSummary
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: "native details with direct summary",
        actual: node
          ? `${node.tagName.toLowerCase()}; directSummary=${String(
              hasDirectSummary
            )}`
          : "missing",
        detail: expectation.selector
      });
    });
  }

  function validateRelationships() {
    return REQUIRED_RELATIONSHIPS.map((relationship) => {
      const source = document.querySelector(
        relationship.source
      );

      const target = document.querySelector(
        relationship.target
      );

      const expectedTargetId =
        relationship.target.startsWith("#")
          ? relationship.target.slice(1)
          : null;

      const actual =
        source?.getAttribute(relationship.attribute) ?? null;

      const passes =
        Boolean(source) &&
        Boolean(target) &&
        expectedTargetId !== null &&
        actual === expectedTargetId;

      return makeCheck({
        category: "ACCESSIBILITY_RELATIONSHIP",
        label: relationship.label,
        status: passes ? STATUS.PASS : STATUS.FAIL,
        expected: expectedTargetId,
        actual,
        detail:
          `${relationship.source} -> ` +
          `${relationship.attribute} -> ` +
          `${relationship.target}`
      });
    });
  }

  function validateGaugeIds() {
    const checks = [];

    Object.entries(REQUIRED_GAUGE_IDS).forEach(
      ([dashboardId, expectedIds]) => {
        const dashboard = document.querySelector(
          `[data-gauge-dashboard-id="${dashboardId}"]`
        );

        if (!dashboard) {
          checks.push(
            makeCheck({
              category: "GAUGE_IDS",
              label: `${dashboardId} dashboard`,
              status: STATUS.FAIL,
              expected: expectedIds,
              actual: null,
              detail: "dashboard missing"
            })
          );

          return;
        }

        const actualIds = Array.from(
          dashboard.querySelectorAll("[data-showroom-gauge]")
        ).map((node) => node.getAttribute("data-gauge-id"));

        const passes =
          actualIds.length === expectedIds.length &&
          actualIds.every(
            (value, index) => value === expectedIds[index]
          );

        checks.push(
          makeCheck({
            category: "GAUGE_IDS",
            label: `${dashboardId} gauge order`,
            status: passes ? STATUS.PASS : STATUS.FAIL,
            expected: expectedIds,
            actual: actualIds
          })
        );
      }
    );

    return checks;
  }

  function validateGaugeRelationships() {
    const checks = [];

    document
      .querySelectorAll("[data-showroom-gauge]")
      .forEach((gauge) => {
        const gaugeId = gauge.getAttribute("data-gauge-id");
        const controlledId = gauge.getAttribute("aria-controls");
        const detail = controlledId
          ? document.getElementById(controlledId)
          : null;

        const detailGaugeId =
          detail?.getAttribute("data-gauge-detail-id") ?? null;

        const passes =
          Boolean(gaugeId) &&
          Boolean(controlledId) &&
          Boolean(detail) &&
          detailGaugeId === gaugeId;

        checks.push(
          makeCheck({
            category: "GAUGE_RELATIONSHIP",
            label: gaugeId || "unnamed gauge",
            status: passes ? STATUS.PASS : STATUS.FAIL,
            expected: {
              controlledId: gaugeId
                ? `gauge-detail-${gaugeId}`
                : null,
              detailGaugeId: gaugeId
            },
            actual: {
              controlledId,
              detailGaugeId
            }
          })
        );
      });

    return checks;
  }

  function validateRoutes() {
    const checks = [];

    const exactRouteExpectations = [
      {
        label: "brand return route",
        selector: ".brand",
        attribute: "href",
        expected: ROUTES.mainCompass
      },

      {
        label: "Elara primary route",
        selector: ".elara-primary-link",
        attribute: "href",
        expected: ROUTES.elara
      },

      {
        label: "characters constellation route",
        selector: '[data-showroom-route-id="characters"]',
        attribute: "data-showroom-route",
        expected: ROUTES.characters
      },

      {
        label: "Elara constellation route",
        selector: '[data-showroom-route-id="elara"]',
        attribute: "data-showroom-route",
        expected: ROUTES.elara
      },

      {
        label: "Compass return route",
        selector: "[data-showroom-compass-return]",
        attribute: "href",
        expected: ROUTES.mainCompass
      }
    ];

    exactRouteExpectations.forEach((expectation) => {
      const node = document.querySelector(
        expectation.selector
      );

      const actual =
        node?.getAttribute(expectation.attribute) ?? null;

      checks.push(
        makeCheck({
          category: "ROUTE",
          label: expectation.label,
          status:
            actual === expectation.expected
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: expectation.expected,
          actual,
          detail:
            `${expectation.selector} ` +
            `[${expectation.attribute}]`
        })
      );
    });

    return checks;
  }

  function validateDependencies() {
    const scripts = Array.from(
      document.querySelectorAll("script[src]")
    );

    const observed = scripts.map((script, index) => ({
      index,
      path: normalizeScriptPath(script.src),
      version: readScriptVersion(script.src),
      defer: script.defer,
      async: script.async
    }));

    const checks = [];
    let priorIndex = -1;

    EXPECTED_DEPENDENCIES.forEach((dependency) => {
      const match = observed.find(
        (script) => script.path === dependency.src
      );

      if (!match) {
        checks.push(
          makeCheck({
            category: "DEPENDENCY",
            label: dependency.key,
            status: STATUS.FAIL,
            expected: dependency,
            actual: null,
            detail: "required script missing"
          })
        );

        return;
      }

      const versionPasses =
        dependency.requiredVersion === null ||
        match.version === dependency.requiredVersion;

      const orderPasses = match.index > priorIndex;

      checks.push(
        makeCheck({
          category: "DEPENDENCY",
          label: dependency.key,
          status:
            versionPasses && orderPasses
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            path: dependency.src,
            version: dependency.requiredVersion,
            afterIndex: priorIndex
          },
          actual: match,
          detail: !versionPasses
            ? "version mismatch"
            : !orderPasses
              ? "dependency order mismatch"
              : null
        })
      );

      priorIndex = Math.max(priorIndex, match.index);
    });

    FORBIDDEN_DEPENDENCIES.forEach((path) => {
      const matches = observed.filter(
        (script) => script.path === path
      );

      checks.push(
        makeCheck({
          category: "FORBIDDEN_DEPENDENCY",
          label: path,
          status:
            matches.length === 0
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: 0,
          actual: matches.length
        })
      );
    });

    return checks;
  }

  function validateStaticCompleteness() {
    const forbiddenAssemblyMarkers = [
      "[data-showroom-build-mount]",
      "[data-showroom-content]",
      "[data-showroom-content-attr]",
      "[data-showroom-build-state]",
      "[data-showroom-build-receipt]"
    ];

    return forbiddenAssemblyMarkers.map((selector) => {
      const actual = document.querySelectorAll(selector).length;

      return makeCheck({
        category: "STATIC_COMPLETENESS",
        label: selector,
        status:
          actual === 0
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: 0,
        actual,
        detail:
          "runtime-assembly marker must not remain in final static HTML"
      });
    });
  }

  function validateReceiptElementsRemainPassive() {
    const selectors = [
      "[data-showroom-controller-receipt]",
      "[data-showroom-controller-validation]",
      "[data-showroom-gauges-receipt]",
      "[data-showroom-interactions-receipt]",
      "[data-showroom-compositor-receipt]",
      "[data-showroom-crystals-receipt]",
      "[data-showroom-window-receipt]"
    ];

    return selectors.map((selector) => {
      const node = document.querySelector(selector);

      const exists = Boolean(node);
      const hidden = node?.hasAttribute("hidden") ?? false;

      return makeCheck({
        category: "RECEIPT_ELEMENT",
        label: selector,
        status:
          exists && hidden
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          exists: true,
          hidden: true
        },
        actual: {
          exists,
          hidden
        }
      });
    });
  }

  function buildReceipt(checks) {
    const failures = checks.filter(
      (check) => check.status === STATUS.FAIL
    );

    const unevaluable = checks.filter(
      (check) => check.status === STATUS.UNEVALUABLE
    );

    const passed = checks.filter(
      (check) => check.status === STATUS.PASS
    );

    const overallStatus =
      failures.length > 0
        ? STATUS.FAIL
        : unevaluable.length > 0
          ? STATUS.UNEVALUABLE
          : STATUS.PASS;

    return deepFreeze({
      receiptId:
        "SHOWROOM_MIRRORLAND_STATIC_PAGE_VALIDATION_RECEIPT_TNT_v1",

      receiptVersion: "1.0.0",
      manifestId: MANIFEST_ID,
      manifestVersion: MANIFEST_VERSION,
      pageContract: PAGE_CONTRACT,

      validationMode: "READ_ONLY_NON_MUTATING",

      status: overallStatus,

      totals: {
        checks: checks.length,
        passed: passed.length,
        failed: failures.length,
        unevaluable: unevaluable.length
      },

      boundaries: {
        domMutated: false,
        repairAttempted: false,
        navigationControlled: false,
        eventsIntercepted: false,
        runtimeSystemsInitialized: false
      },

      failures: failures.map((check) => ({
        category: check.category,
        label: check.label,
        expected: check.expected,
        actual: check.actual,
        detail: check.detail
      })),

      unevaluable: unevaluable.map((check) => ({
        category: check.category,
        label: check.label,
        detail: check.detail
      })),

      checkedAt: new Date().toISOString()
    });
  }

  function validate() {
    const checks = [
      ...validatePageAttributes(),
      ...validateUniqueSelectors(),
      ...validateSelectorCounts(),
      ...validateNativeDisclosures(),
      ...validateRelationships(),
      ...validateGaugeIds(),
      ...validateGaugeRelationships(),
      ...validateRoutes(),
      ...validateDependencies(),
      ...validateStaticCompleteness(),
      ...validateReceiptElementsRemainPassive()
    ];

    return buildReceipt(checks);
  }

  function publishImmutableGlobal(name, value) {
    Object.defineProperty(globalThis, name, {
      value,
      enumerable: true,
      configurable: false,
      writable: false
    });
  }

  function run() {
    let receipt;

    try {
      receipt = validate();
    } catch (error) {
      receipt = deepFreeze({
        receiptId:
          "SHOWROOM_MIRRORLAND_STATIC_PAGE_VALIDATION_RECEIPT_TNT_v1",

        receiptVersion: "1.0.0",
        manifestId: MANIFEST_ID,
        manifestVersion: MANIFEST_VERSION,
        pageContract: PAGE_CONTRACT,

        validationMode: "READ_ONLY_NON_MUTATING",
        status: STATUS.UNEVALUABLE,

        totals: {
          checks: 0,
          passed: 0,
          failed: 0,
          unevaluable: 1
        },

        boundaries: {
          domMutated: false,
          repairAttempted: false,
          navigationControlled: false,
          eventsIntercepted: false,
          runtimeSystemsInitialized: false
        },

        failures: [],

        unevaluable: [
          {
            category: "VALIDATOR_EXECUTION",
            label: "manifest validator",
            detail:
              error instanceof Error
                ? error.message
                : String(error)
          }
        ],

        checkedAt: new Date().toISOString()
      });
    }

    publishImmutableGlobal(
      GLOBAL_MANIFEST_SYMBOL,
      MANIFEST
    );

    publishImmutableGlobal(
      GLOBAL_RECEIPT_SYMBOL,
      receipt
    );

    if (
      receipt.status !== STATUS.PASS &&
      typeof console !== "undefined" &&
      typeof console.warn === "function"
    ) {
      console.warn(
        `[${MANIFEST_ID}] Static Showroom validation status: ${receipt.status}`,
        receipt
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      run,
      {
        once: true,
        passive: true
      }
    );
  } else {
    run();
  }
})();
