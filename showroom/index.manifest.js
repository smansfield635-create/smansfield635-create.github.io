/* TARGET FILE: /showroom/index.manifest.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_MANIFEST_VALIDATOR_TNT_v3 */

/*
  CONTROLLING TWO-FILE CONTRACT

  /showroom/index.html
  - Complete static page authority.
  - Owns all visible context, semantic structure, native disclosures,
    controls, mounts, dialogs, fallbacks, accessibility relationships,
    receipt elements, stylesheets, runtime script order, the shared
    bottom return zone, and the accessible orbit escape.
  - Must exist as a complete usable DOM before runtime JavaScript initializes.

  /showroom/index.manifest.js
  - Non-mutating technical manifest and validator only.
  - Owns technical declarations, exact ledgers, structural counts,
    ownership boundaries, selector expectations, dependency expectations,
    contract validation, and a bounded immutable validation receipt.

  ABSOLUTE PROHIBITIONS

  This file must never:
  - create, replace, move, or remove DOM nodes;
  - write text, HTML, values, attributes, classes, styles, or datasets;
  - inject narrative, gauge, route, dialog, fallback, return, or receipt content;
  - alter disclosure state;
  - register click, pointer, touch, wheel, keyboard, or navigation behavior;
  - call preventDefault(), stopPropagation(), or stopImmediatePropagation();
  - control navigation;
  - initialize controller, gauges, Compass, Diamond, compositor, crystals,
    Window, interactions, UI, manor blueprint, or Elara systems;
  - repair validation failures by mutation;
  - become a prerequisite for page visibility or usability.

  VALIDATION MODEL

  - Read-only inspection only.
  - Validation failure is reported, never repaired.
  - The validation receipt is published only as an immutable JavaScript value.
  - Existing HTML receipt elements are inspected but never populated or changed.
  - The deferred script executes validation directly through run().
*/

(() => {
  "use strict";

  const MANIFEST_ID =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_MANIFEST_VALIDATOR_TNT_v3";

  const MANIFEST_VERSION = "3.0.0";

  const PAGE_CONTRACT =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_STATIC_HTML_TNT_v8";

  const PAGE_VERSION =
    "SHOWROOM-MIRRORLAND-NARRATIVE-CONSTELLATION-8.0.0";

  const GLOBAL_MANIFEST_SYMBOL =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_MANIFEST_TNT_v3";

  const GLOBAL_RECEIPT_SYMBOL =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_VALIDATION_RECEIPT_TNT_v3";

  const RECEIPT_ID =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_VALIDATION_RECEIPT_TNT_v3";

  const INFORMATION_FALLBACK_LIMITATION_ID =
    "INFORMATION_FRONT_HIDDEN_NONPRIMARY_PANELS_REQUIRE_RUNTIME";

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
        "constellation controls",
        "local destination surfaces",
        "portal controls",
        "shared bottom return zone",
        "accessible orbit escape",
        "mounts",
        "dialogs",
        "fallback navigation",
        "accessibility relationships",
        "receipt elements",
        "stylesheets",
        "runtime script order",
        "runtime selector hooks",
        "visible gauge descriptions",
        "visible information-front content",
        "Diamond stage markup",
        "Window stage markup",
        "Showroom-local Compass visual markup"
      ],

      requirements: {
        completeBeforeRuntimeInitialization: true,
        usableWithoutManifestMutation: true,
        runtimeCriticalNodesStatic: true,
        visibleContextStatic: true,
        nativeDisclosureStructureStatic: true,
        constellationLedgerStatic: true,
        portalConfirmationMarkupStatic: true,
        sharedReturnMarkupStatic: true,
        accessibleOrbitEscapeStatic: true,
        repeatedDestinationReturnMarkupAbsent: true
      }
    },

    manifest: {
      file: "/showroom/index.manifest.js",
      role: "NON_MUTATING_TECHNICAL_MANIFEST_AND_VALIDATOR",

      owns: [
        "technical declarations",
        "exact cardinal ledger",
        "exact child ledger",
        "local-target ledger",
        "portal-route ledger",
        "fallback-portal ledger",
        "shared-return contract",
        "structural counts",
        "geometry expectations",
        "ownership boundaries",
        "selector expectations",
        "dependency expectations",
        "claim boundaries",
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

    controller: {
      file: "/showroom/index.controller.js",
      role: "SEMANTIC_STATE_AND_NAVIGATION_AUTHORITY",

      owns: [
        "cardinal selection state",
        "child selection state",
        "local destination activation",
        "portal confirmation state",
        "route authorization enforcement",
        "route dialog lifecycle",
        "Compass return dialog lifecycle",
        "confirmed navigation"
      ]
    },

    compositor: {
      file: "/showroom/index.compositor.js",
      role: "CONSTELLATION_SINGLE_FRAME_COMPOSITION_AUTHORITY",

      owns: [
        "orbit camera",
        "view matrix",
        "projection matrix",
        "world-to-screen projection",
        "Compass visual-plane depth reference",
        "front and rear classification",
        "settlement",
        "authoritative hit coordinates",
        "rear Compass front orchestration"
      ],

      doesNotOwn: [
        "Compass navigation",
        "Compass semantic state",
        "Diamond rendering",
        "Window rendering",
        "portal route decisions"
      ]
    },

    crystals: {
      file: "/showroom/index.crystals.js",
      role: "CONSTELLATION_CRYSTAL_RENDERING_AUTHORITY",

      owns: [
        "cardinal crystal geometry",
        "child crystal geometry",
        "crystal materials",
        "orbital targets",
        "crystal animation",
        "crystal drawing",
        "semantic-control association"
      ],

      doesNotOwn: [
        "navigation decisions",
        "Compass navigation",
        "Diamond rendering",
        "Window rendering"
      ]
    },

    compass: {
      visualImplementation: "SHOWROOM_LOCAL",
      visualStylesheetAuthority: "/showroom/index.css",
      fullRootCompassStylesheetAllowed: false,
      CompassGeometryDependencyAllowed: false,
      CompassRendererDependencyAllowed: false,
      visualNavigationAuthority: false,
      controllerNavigationAuthority: true
    },

    returnSystem: {
      model: "SHARED_BOTTOM_ZONE",
      zone: "#showroom-return-zone",
      orbitTarget: "#showroom-orbit",
      compassRoute: "/index.html",

      visibleReturnZones: 1,
      accessibleOrbitEscapes: 1,

      destinationLocalReturnControlsAllowed: false,
      frontLocalReturnControlsAllowed: false,
      footerCompassControlAllowed: false,

      controllerOwnsCompassConfirmation: true,
      manifestOwnsNavigation: false
    },

    elara: {
      homeroom: true,
      primaryAccessLocations: 3,
      fallbackMenuRepresentations: 1,
      totalRouteRepresentations: 4,
      asset: "/assets/elara/elara.room-entry.js",
      assetRole: "PAGE_LEVEL_ELARA_HOMEROOM_ACCESSIBILITY_SUPPORT",
      assetPortalNavigationAuthority: false,
      controllerPortalNavigationAuthority: true
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

    authorizedPortalRoutes: [
      "/showroom/globe/hearth/jeeves/",
      "/elara/index.html",
      "/products/auren/",
      "/characters/",
      "/showroom/globe/hearth/",
      "/showroom/globe/audralia/"
    ],

    localTargets: [
      "#arrival",
      "#mirrorland-preface-mission",
      "#mirrorland-preface-timeline",
      "#mirrorland-preface-invitation",
      "#showroom-window-threshold",
      "#showroom-diamond-stage",
      "#showroom-star-reading",
      "#showroom-unfinished-world",
      "#mirrorland-preface-exploration",
      "#showroom-paths-not-yet-open"
    ]
  });

  const CARDINAL_LEDGER = deepFreeze([
    {
      cardinalId: "north",
      label: "The Story Begins",
      clusterId: "showroom-cluster-north",
      clusterAriaLabel: "The Story Begins destinations",
      childIds: [
        "north-1",
        "north-2",
        "north-3",
        "north-4"
      ]
    },

    {
      cardinalId: "east",
      label: "Meet the Characters",
      clusterId: "showroom-cluster-east",
      clusterAriaLabel: "Meet the Characters destinations",
      childIds: [
        "east-1",
        "east-2",
        "east-3",
        "east-4"
      ]
    },

    {
      cardinalId: "south",
      label: "Wonders of Mirrorland",
      clusterId: "showroom-cluster-south",
      clusterAriaLabel: "Wonders of Mirrorland destinations",
      childIds: [
        "south-1",
        "south-2",
        "south-3",
        "south-4"
      ]
    },

    {
      cardinalId: "west",
      label: "Mysteries Yet Unfolding",
      clusterId: "showroom-cluster-west",
      clusterAriaLabel: "Mysteries Yet Unfolding destinations",
      childIds: [
        "west-1",
        "west-2",
        "west-3",
        "west-4"
      ]
    }
  ]);

  const LOCAL_CHILD_LEDGER = deepFreeze([
    {
      childId: "north-1",
      cardinalId: "north",
      label: "Welcome to Mirrorland",
      destinationKind: "local-anchor",
      target: "#arrival",
      openAncestor: null,
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "north-2",
      cardinalId: "north",
      label: "Why Mirrorland Exists",
      destinationKind: "local-disclosure-target",
      target: "#mirrorland-preface-mission",
      openAncestor: "#mirrorland-preface",
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "north-3",
      cardinalId: "north",
      label: "The Story So Far",
      destinationKind: "local-disclosure-target",
      target: "#mirrorland-preface-timeline",
      openAncestor: "#mirrorland-preface",
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "north-4",
      cardinalId: "north",
      label: "Step Through the Door",
      destinationKind: "local-disclosure-target",
      target: "#mirrorland-preface-invitation",
      openAncestor: "#mirrorland-preface",
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "south-1",
      cardinalId: "south",
      label: "Open the Window",
      destinationKind: "local-window-experience",
      target: "#showroom-window-threshold",
      openAncestor: null,
      requiredFront: "#object-gauges",
      semanticActivation: "[data-showroom-window-control]",
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "south-2",
      cardinalId: "south",
      label: "Behold the Diamond",
      destinationKind: "local-diamond-experience",
      target: "#showroom-diamond-stage",
      openAncestor: null,
      requiredFront: "#object-gauges",
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "south-3",
      cardinalId: "south",
      label: "Read the Stars",
      destinationKind: "local-narrative-surface",
      target: "#showroom-star-reading",
      openAncestor: null,
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "west-1",
      cardinalId: "west",
      label: "The Unfinished World",
      destinationKind: "local-narrative-surface",
      target: "#showroom-unfinished-world",
      openAncestor: null,
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "west-2",
      cardinalId: "west",
      label: "Questions in the Glass",
      destinationKind: "local-disclosure-target",
      target: "#mirrorland-preface-exploration",
      openAncestor: "#mirrorland-preface",
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    },

    {
      childId: "west-3",
      cardinalId: "west",
      label: "Paths Not Yet Open",
      destinationKind: "local-narrative-surface",
      target: "#showroom-paths-not-yet-open",
      openAncestor: null,
      requiredFront: null,
      semanticActivation: null,
      returnModel: "shared-bottom-zone",
      returnZone: "#showroom-return-zone"
    }
  ]);

  const PORTAL_CHILD_LEDGER = deepFreeze([
    {
      childId: "east-1",
      cardinalId: "east",
      label: "Talk to Jeeves",
      route: "/showroom/globe/hearth/jeeves/",
      description:
        "Meet the House interface and receive guidance through the estate, the Hearth, Audralia, and Mirrorland.",
      visualClass: "PORTAL",
      emphasis: "external",
      primaryPortal: false,
      routeRole: null,
      ariaLabel:
        "Talk to Jeeves on another Mirrorland page. Confirmation required."
    },

    {
      childId: "east-2",
      cardinalId: "east",
      label: "Talk to Elara",
      route: "/elara/index.html",
      description:
        "Enter Elara’s mission, story, personal-origin, and literary conversation surface.",
      visualClass: "PORTAL",
      emphasis: "external",
      primaryPortal: false,
      routeRole: null,
      ariaLabel:
        "Talk to Elara on another Mirrorland page. Confirmation required."
    },

    {
      childId: "east-3",
      cardinalId: "east",
      label: "Talk to Auren",
      route: "/products/auren/",
      description:
        "Enter the product-floor specialist’s room for practical systems, product interpretation, and bounded handoffs.",
      visualClass: "PORTAL",
      emphasis: "external",
      primaryPortal: false,
      routeRole: null,
      ariaLabel:
        "Talk to Auren on another Diamond Gate Bridge page. Confirmation required."
    },

    {
      childId: "east-4",
      cardinalId: "east",
      label: "Meet All Characters",
      route: "/characters/",
      description:
        "Open the central character directory and discover the wider Mirrorland cast.",
      visualClass: "PRIMARY_PORTAL",
      emphasis: "primary-external",
      primaryPortal: true,
      routeRole: "directory",
      ariaLabel:
        "Meet all Mirrorland characters on the character-directory page. Confirmation required."
    },

    {
      childId: "south-4",
      cardinalId: "south",
      label: "Enter the Hearth",
      route: "/showroom/globe/hearth/",
      description:
        "Leave the Showroom for the inhabited facility where the House interface, characters, and Audralia-facing systems meet.",
      visualClass: "PORTAL",
      emphasis: "external",
      primaryPortal: false,
      routeRole: null,
      ariaLabel:
        "Enter the Hearth facility on another Mirrorland page. Confirmation required."
    },

    {
      childId: "west-4",
      cardinalId: "west",
      label: "Journey into Audralia",
      route: "/showroom/globe/audralia/",
      description:
        "Travel toward Mirrorland’s constructive possibility world and its developing planetary rooms.",
      visualClass: "PORTAL",
      emphasis: "external",
      primaryPortal: false,
      routeRole: null,
      ariaLabel:
        "Journey into Audralia on another Mirrorland page. Confirmation required."
    }
  ]);

  const FALLBACK_PORTAL_LEDGER = deepFreeze([
    {
      id: "header-elara",
      selector:
        "header .elara-primary-link[data-showroom-fallback-portal]",
      route: "/elara/index.html",
      label: "Talk to Elara",
      description:
        "Enter Elara’s mission, story, personal-origin, and literary conversation surface.",
      ariaLabel:
        "Talk to Elara on another Mirrorland page. Confirmation required."
    },

    {
      id: "fallback-jeeves",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/showroom/globe/hearth/jeeves/"]',
      route: "/showroom/globe/hearth/jeeves/",
      label: "Talk to Jeeves",
      description:
        "Meet the House interface and receive guidance through the estate, the Hearth, Audralia, and Mirrorland.",
      ariaLabel:
        "Talk to Jeeves on another Mirrorland page. Confirmation required."
    },

    {
      id: "fallback-elara",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/elara/index.html"]',
      route: "/elara/index.html",
      label: "Talk to Elara",
      description:
        "Enter Elara’s mission, story, personal-origin, and literary conversation surface.",
      ariaLabel:
        "Talk to Elara on another Mirrorland page. Confirmation required."
    },

    {
      id: "fallback-auren",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/products/auren/"]',
      route: "/products/auren/",
      label: "Talk to Auren",
      description:
        "Enter the product-floor specialist’s room for practical systems, product interpretation, and bounded handoffs.",
      ariaLabel:
        "Talk to Auren on another Diamond Gate Bridge page. Confirmation required."
    },

    {
      id: "fallback-characters",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/characters/"]',
      route: "/characters/",
      label: "Meet All Characters",
      description:
        "Open the central character directory and discover the wider Mirrorland cast.",
      ariaLabel:
        "Meet all Mirrorland characters on the character-directory page. Confirmation required."
    },

    {
      id: "fallback-hearth",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/showroom/globe/hearth/"]',
      route: "/showroom/globe/hearth/",
      label: "Enter the Hearth",
      description:
        "Leave the Showroom for the inhabited facility where the House interface, characters, and Audralia-facing systems meet.",
      ariaLabel:
        "Enter the Hearth facility on another Mirrorland page. Confirmation required."
    },

    {
      id: "fallback-audralia",
      selector:
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/showroom/globe/audralia/"]',
      route: "/showroom/globe/audralia/",
      label: "Journey into Audralia",
      description:
        "Travel toward Mirrorland’s constructive possibility world and its developing planetary rooms.",
      ariaLabel:
        "Journey into Audralia on another Mirrorland page. Confirmation required."
    },

    {
      id: "footer-elara",
      selector:
        '.showroom-footer [data-showroom-fallback-portal][data-showroom-route="/elara/index.html"]',
      route: "/elara/index.html",
      label: "Talk to Elara",
      description:
        "Enter Elara’s mission, story, personal-origin, and literary conversation surface.",
      ariaLabel:
        "Talk to Elara on another Mirrorland page. Confirmation required."
    }
  ]);

  const PRIMARY_ELARA_ACCESS_LEDGER = deepFreeze([
    {
      id: "header-elara",
      selector:
        'header .elara-primary-link[data-showroom-route="/elara/index.html"]'
    },

    {
      id: "east-constellation-elara",
      selector:
        '[data-showroom-child-id="east-2"][data-showroom-route="/elara/index.html"]'
    },

    {
      id: "footer-elara",
      selector:
        '.showroom-footer [data-showroom-fallback-portal][data-showroom-route="/elara/index.html"]'
    }
  ]);

  const STRUCTURAL_COUNTS = deepFreeze({
    cardinalControls: 4,
    cardinalClusters: 4,
    childControls: 16,

    northChildren: 4,
    eastChildren: 4,
    southChildren: 4,
    westChildren: 4,

    localChildDestinations: 10,
    portalChildDestinations: 6,
    primaryPortalChildren: 1,

    fallbackPortalControls: 8,
    totalControllerMediatedPortalTriggers: 14,

    primaryElaraAccessControls: 3,
    elaraFallbackMenuRepresentations: 1,
    totalElaraRouteRepresentations: 4,

    sharedReturnZones: 1,
    sharedReturnToOrbitControls: 1,
    sharedReturnToCompassControls: 1,
    accessibleOrbitEscapeControls: 1,

    repeatedLocalReturnBlocks: 0,
    repeatedFrontNavigationBlocks: 0,
    footerCompassControls: 0,
    obsoleteDestinationOrbitControls: 0,

    compassDialogTriggers: 2,

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

    runtimeReceiptElements: 7,

    stylesheets: 2,
    runtimeScripts: 13
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

  const CLAIM_BOUNDARIES = deepFreeze({
    generatedImage: false,
    imported3dModel: false,
    runtimePassClaimed: false,
    visualPassClaimed: false,
    awardPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    publicReleaseAuthorized: false,
    empiricalValidityClaimed: false
  });

  const RETURN_MODEL = deepFreeze({
    model: "shared-bottom-zone",
    zone: "#showroom-return-zone",
    sharedOrbitControls: 1,
    sharedCompassControls: 1,
    accessibleOrbitEscapes: 1,
    repeatedLocalReturnBlocks: 0,
    repeatedFrontNavigationBlocks: 0,
    footerCompassControls: 0,
    obsoleteDestinationOrbitControls: 0
  });

  const REQUIRED_PAGE_ATTRIBUTES = deepFreeze({
    "data-route": "/showroom/",
    "data-page": "showroom",
    "data-version": PAGE_VERSION,
    "data-contract": PAGE_CONTRACT,

    "data-house-room": "showroom",
    "data-house-room-title": "The Showroom",
    "data-room-welcome": "Welcome to Mirrorland",
    "data-room-narrative-title": "The Door to Mirrorland",
    "data-primary-subject": "mirrorland",
    "data-primary-narrative": "mirrorland",

    "data-homeroom-guide": "elara",
    "data-elara-homeroom": "true",
    "data-elara-route": "/elara/index.html",
    "data-talk-to-elara-prominent": "true",

    "data-showroom-root-contract":
      "mirrorland-narrative-constellation-gauge-information",

    "data-showroom-manifest":
      "/showroom/index.manifest.js",

    "data-showroom-controller":
      "/showroom/index.controller.js",

    "data-showroom-gauges":
      "/showroom/index.gauges.js",

    "data-showroom-compositor":
      "/showroom/index.compositor.js",

    "data-showroom-crystals":
      "/showroom/index.crystals.js",

    "data-showroom-interactions":
      "/showroom/index.interactions.js",

    "data-showroom-window":
      "/showroom/index.window.js",

    "data-showroom-css":
      "/showroom/index.css",

    "data-showroom-navigation-model":
      "four-cardinal-sixteen-child-narrative-constellation",

    "data-showroom-primary-mode":
      "constellation",

    "data-showroom-local-front-model":
      "single-active-front",

    "data-showroom-gauge-layout":
      "compact-selector-shared-detail",

    "data-showroom-instruction-layout":
      "summary-near-compass-nested-disclosure",

    "data-showroom-cardinal-count": "4",
    "data-showroom-child-count": "16",
    "data-showroom-local-destination-count": "10",
    "data-showroom-portal-destination-count": "6",
    "data-showroom-primary-portal-count": "1",

    "data-showroom-fallback-stars":
      "semantic-controls",

    "data-showroom-fallback-stars-visible-until-crystals-ready":
      "true",

    "data-showroom-crystals-ready":
      "false",

    "data-showroom-route-confirmation-required":
      "true",

    "data-showroom-return-to-orbit":
      "true",

    "data-showroom-return-to-compass":
      "true",

    "data-showroom-return-model":
      "shared-bottom-zone",

    "data-showroom-return-zone":
      "#showroom-return-zone",

    "data-showroom-orbit-target":
      "#showroom-orbit",

    "data-showroom-compass-route":
      "/index.html",

    "data-showroom-stage-separation":
      "true",

    "data-showroom-orbit-stage-independent":
      "true",

    "data-showroom-diamond-stage-independent":
      "true",

    "data-showroom-window-stage-diamond-only":
      "true",

    "data-compass-fixed-center":
      "true",

    "data-compass-orbital-reference":
      "true",

    "data-compass-page-local-decision":
      "true",

    "data-compass-immediate-navigation":
      "false",

    "data-compass-explicit-return-required":
      "true",

    "data-compass-main-route":
      "/index.html",

    "data-compass-control-purpose":
      "open-main-compass-return-dialog",

    "data-compass-renderer-navigation-authority":
      "false",

    "data-compass-controller-navigation-authority":
      "true",

    "data-compass-visual-implementation":
      "showroom-local",

    "data-mirrorland-window-independent":
      "true",

    "data-mirrorland-window-foreground":
      "true",

    "data-mirrorland-window-in-front-of-diamond":
      "true",

    "data-mirrorland-window-compass-owned":
      "false",

    "data-mirrorland-window-crystal-depth-participant":
      "false",

    "data-mirrorland-window-state":
      "closed",

    "data-diamond-generation":
      "G3",

    "data-diamond-render-mode":
      "native-webgl",

    "data-diamond-geometry":
      "/showroom/index.diamond.geometry.js",

    "data-diamond-renderer":
      "/showroom/index.diamond.js",

    "data-diamond-ui":
      "/showroom/index.ui.js",

    "data-diamond-protected-core":
      "true",

    "data-diamond-original-stage-restored":
      "true",

    "data-diamond-window-sibling-layer":
      "true"
  });

  const REQUIRED_SHOWROOM_ROOT_STATE = deepFreeze({
    "data-showroom-state": "CONSTELLATION",
    "data-showroom-presentation-mode": "constellation",
    "data-showroom-active-cardinal": "",
    "data-showroom-active-child": "",
    "data-showroom-active-cluster": "",
    "data-showroom-active-front": "",
    "data-showroom-active-gauge-set": "",
    "data-showroom-active-information-tab": "",
    "data-showroom-route-dialog-open": "false",
    "data-showroom-compass-dialog-open": "false",
    "data-showroom-window-state": "closed",
    "data-showroom-diamond-interactive": "false",
    "data-showroom-crystals-ready": "false",
    "data-showroom-held": "false"
  });

  const REQUIRED_META_CONTRACTS = deepFreeze([
    {
      name: "showroom-page-contract",
      content: PAGE_CONTRACT
    },

    {
      name: "showroom-manifest-contract",
      content: MANIFEST_ID
    }
  ]);

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
      label: "open-instructions control",
      selector: "[data-showroom-open-instructions]"
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
      label: "semantic star layer",
      selector: "[data-showroom-semantic-star-layer]"
    },

    {
      label: "primary cardinal layer",
      selector: "[data-showroom-primary-stars]"
    },

    {
      label: "Compass visual mount",
      selector: "[data-showroom-compass-visual-mount]"
    },

    {
      label: "orbit Compass semantic control",
      selector: "[data-showroom-compass-control]"
    },

    {
      label: "North cardinal cluster",
      selector: "#showroom-cluster-north"
    },

    {
      label: "East cardinal cluster",
      selector: "#showroom-cluster-east"
    },

    {
      label: "South cardinal cluster",
      selector: "#showroom-cluster-south"
    },

    {
      label: "West cardinal cluster",
      selector: "#showroom-cluster-west"
    },

    {
      label: "fallback navigation",
      selector: "[data-showroom-fallback-navigation]"
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
      label: "composition gauge",
      selector: "[data-showroom-composition-gauge]"
    },

    {
      label: "shared return zone",
      selector: "#showroom-return-zone[data-showroom-return-zone]"
    },

    {
      label: "shared return-zone heading",
      selector: "#showroom-return-zone-title"
    },

    {
      label: "shared Return to Orbit control",
      selector: "[data-showroom-shared-return-to-orbit]"
    },

    {
      label: "shared Return to Main Compass control",
      selector: "[data-showroom-shared-return-to-compass]"
    },

    {
      label: "accessible orbit escape",
      selector: "[data-showroom-accessible-orbit-return]"
    },

    {
      label: "route dialog",
      selector: "#showroom-route-dialog"
    },

    {
      label: "route continuation control",
      selector: "[data-showroom-route-continue]"
    },

    {
      label: "Compass dialog",
      selector: "#showroom-compass-dialog"
    },

    {
      label: "confirmed Compass return",
      selector: "[data-showroom-compass-return]"
    },

    {
      label: "construction record dialog",
      selector: "#construction-record-dialog"
    }
  ]);

  const REQUIRED_SELECTOR_COUNTS = deepFreeze([
    {
      label: "cardinal controls",
      selector: "[data-showroom-cardinal-control]",
      expected: STRUCTURAL_COUNTS.cardinalControls
    },

    {
      label: "cardinal clusters",
      selector: "[data-showroom-cluster]",
      expected: STRUCTURAL_COUNTS.cardinalClusters
    },

    {
      label: "child controls",
      selector: "[data-showroom-child-control]",
      expected: STRUCTURAL_COUNTS.childControls
    },

    {
      label: "North child controls",
      selector:
        '[data-showroom-child-control][data-showroom-cardinal-id="north"]',
      expected: STRUCTURAL_COUNTS.northChildren
    },

    {
      label: "East child controls",
      selector:
        '[data-showroom-child-control][data-showroom-cardinal-id="east"]',
      expected: STRUCTURAL_COUNTS.eastChildren
    },

    {
      label: "South child controls",
      selector:
        '[data-showroom-child-control][data-showroom-cardinal-id="south"]',
      expected: STRUCTURAL_COUNTS.southChildren
    },

    {
      label: "West child controls",
      selector:
        '[data-showroom-child-control][data-showroom-cardinal-id="west"]',
      expected: STRUCTURAL_COUNTS.westChildren
    },

    {
      label: "local child destinations",
      selector:
        '[data-showroom-child-control]:not([data-showroom-destination-kind="external-route"])',
      expected: STRUCTURAL_COUNTS.localChildDestinations
    },

    {
      label: "local children using shared return model",
      selector:
        '[data-showroom-child-control]' +
        '[data-showroom-return-model="shared-bottom-zone"]' +
        '[data-showroom-return-zone="#showroom-return-zone"]',
      expected: STRUCTURAL_COUNTS.localChildDestinations
    },

    {
      label: "obsolete local return-options declarations",
      selector:
        "[data-showroom-child-control][data-showroom-return-options]",
      expected: 0
    },

    {
      label: "portal child destinations",
      selector:
        '[data-showroom-child-control][data-showroom-destination-kind="external-route"]',
      expected: STRUCTURAL_COUNTS.portalChildDestinations
    },

    {
      label: "primary portal child",
      selector:
        '[data-showroom-child-control][data-showroom-visual-class="PRIMARY_PORTAL"]',
      expected: STRUCTURAL_COUNTS.primaryPortalChildren
    },

    {
      label: "fallback portal controls",
      selector: "[data-showroom-fallback-portal]",
      expected: STRUCTURAL_COUNTS.fallbackPortalControls
    },

    {
      label: "controller-mediated portal triggers",
      selector:
        '[data-showroom-destination-kind="external-route"]',
      expected:
        STRUCTURAL_COUNTS.totalControllerMediatedPortalTriggers
    },

    {
      label: "shared return zones",
      selector:
        "#showroom-return-zone[data-showroom-return-zone]",
      expected: STRUCTURAL_COUNTS.sharedReturnZones
    },

    {
      label: "shared Return to Orbit controls",
      selector: "[data-showroom-shared-return-to-orbit]",
      expected: STRUCTURAL_COUNTS.sharedReturnToOrbitControls
    },

    {
      label: "shared Return to Compass controls",
      selector: "[data-showroom-shared-return-to-compass]",
      expected: STRUCTURAL_COUNTS.sharedReturnToCompassControls
    },

    {
      label: "accessible orbit escape controls",
      selector: "[data-showroom-accessible-orbit-return]",
      expected: STRUCTURAL_COUNTS.accessibleOrbitEscapeControls
    },

    {
      label: "repeated local return blocks",
      selector: ".showroom-local-return",
      expected: STRUCTURAL_COUNTS.repeatedLocalReturnBlocks
    },

    {
      label: "repeated front navigation blocks",
      selector: ".showroom-front-navigation",
      expected: STRUCTURAL_COUNTS.repeatedFrontNavigationBlocks
    },

    {
      label: "footer Compass controls",
      selector:
        '.showroom-footer [data-showroom-open-compass-dialog]',
      expected: STRUCTURAL_COUNTS.footerCompassControls
    },

    {
      label: "obsolete destination-level Orbit controls",
      selector: 'main [data-showroom-return-to-orbit]',
      expected: STRUCTURAL_COUNTS.obsoleteDestinationOrbitControls
    },

    {
      label: "Compass dialog triggers",
      selector: "[data-showroom-open-compass-dialog]",
      expected: STRUCTURAL_COUNTS.compassDialogTriggers
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
      label: "all gauge selectors",
      selector: "[data-showroom-gauge]",
      expected: STRUCTURAL_COUNTS.totalGaugeSelectors
    },

    {
      label: "Object gauge details",
      selector:
        "#object-gauges [data-showroom-gauge-detail]",
      expected: STRUCTURAL_COUNTS.objectGaugeDetails
    },

    {
      label: "Structure gauge details",
      selector:
        "#structure-gauges [data-showroom-gauge-detail]",
      expected: STRUCTURAL_COUNTS.structureGaugeDetails
    },

    {
      label: "Interaction gauge details",
      selector:
        "#interaction-gauges [data-showroom-gauge-detail]",
      expected: STRUCTURAL_COUNTS.interactionGaugeDetails
    },

    {
      label: "Systems gauge details",
      selector:
        "#systems-gauges [data-showroom-gauge-detail]",
      expected: STRUCTURAL_COUNTS.systemsGaugeDetails
    },

    {
      label: "all gauge details",
      selector: "[data-showroom-gauge-detail]",
      expected: STRUCTURAL_COUNTS.totalGaugeDetails
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
      selector:
        "#mirrorland-preface .mirrorland-preface__content > section",
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
      selector: ".route-menu",
      initiallyOpen: null
    },

    {
      label: "Mirrorland preface disclosure",
      selector: "#mirrorland-preface",
      initiallyOpen: true
    },

    {
      label: "instructions disclosure",
      selector: "#showroom-instructions-disclosure",
      initiallyOpen: null
    },

    {
      label: "Diamond controls disclosure",
      selector: ".object-control-tray",
      initiallyOpen: true
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
      label: "open-instructions disclosure relationship",
      source: "[data-showroom-open-instructions]",
      attribute: "aria-controls",
      target: "#showroom-instructions-disclosure"
    },

    {
      label: "orbit section heading",
      source: "#showroom-orbit",
      attribute: "aria-labelledby",
      target: "#showroom-orbit-title"
    },

    {
      label: "orbit Compass dialog relationship",
      source: "[data-showroom-compass-control]",
      attribute: "aria-controls",
      target: "#showroom-compass-dialog"
    },

    {
      label: "shared return-zone heading",
      source: "#showroom-return-zone",
      attribute: "aria-labelledby",
      target: "#showroom-return-zone-title"
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

  const EXPECTED_STYLESHEETS = deepFreeze([
    {
      key: "manorBlueprint",
      href: "/assets/manor-blueprint/manor.blueprint.css",
      requiredVersion:
        "MANOR_BLUEPRINT_CARDINAL_ROOM_MAP_VISUAL_CSS_TNT_v1"
    },

    {
      key: "showroomPage",
      href: "/showroom/index.css",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_CSS_TNT_v6"
    }
  ]);

  const FORBIDDEN_STYLESHEETS = deepFreeze([
    "/assets/compass/compass.css"
  ]);

  const EXPECTED_DEPENDENCIES = deepFreeze([
    {
      key: "manifest",
      src: "/showroom/index.manifest.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_MANIFEST_VALIDATOR_TNT_v3"
    },

    {
      key: "controller",
      src: "/showroom/index.controller.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5"
    },

    {
      key: "gauges",
      src: "/showroom/index.gauges.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2"
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
        "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2"
    },

    {
      key: "crystals",
      src: "/showroom/index.crystals.js",
      requiredVersion:
        "SHOWROOM_FOUR_BY_FOUR_NARRATIVE_CONSTELLATION_CRYSTALS_TNT_v4"
    },

    {
      key: "interactions",
      src: "/showroom/index.interactions.js",
      requiredVersion:
        "SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v3"
    },

    {
      key: "window",
      src: "/showroom/index.window.js",
      requiredVersion:
        "SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1"
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
      key: "elaraHomeroomAccessibility",
      src: "/assets/elara/elara.room-entry.js",
      requiredVersion:
        "ELARA_ROOM_ENTRY_ISOLATED_HARD_NAVIGATION_ASSET_TNT_v1"
    }
  ]);

  const FORBIDDEN_DEPENDENCIES = deepFreeze([
    "/showroom/index.content.js",
    "/showroom/index.build.js",
    "/assets/compass/compass.geometry.js",
    "/assets/compass/compass.renderer.js"
  ]);

  const FORBIDDEN_ASSEMBLY_MARKERS = deepFreeze([
    "[data-showroom-build-mount]",
    "[data-showroom-content]",
    "[data-showroom-content-attr]",
    "[data-showroom-build-state]",
    "[data-showroom-build-receipt]"
  ]);

  const RECEIPT_ELEMENT_SELECTORS = deepFreeze([
    "[data-showroom-controller-receipt]",
    "[data-showroom-controller-validation]",
    "[data-showroom-gauges-receipt]",
    "[data-showroom-interactions-receipt]",
    "[data-showroom-compositor-receipt]",
    "[data-showroom-crystals-receipt]",
    "[data-showroom-window-receipt]"
  ]);

  const MANIFEST = deepFreeze({
    manifestId: MANIFEST_ID,
    manifestVersion: MANIFEST_VERSION,
    pageContract: PAGE_CONTRACT,
    pageVersion: PAGE_VERSION,

    status: CLAIM_BOUNDARIES,

    ownership: OWNERSHIP,
    routes: ROUTES,

    cardinalLedger: CARDINAL_LEDGER,
    localChildLedger: LOCAL_CHILD_LEDGER,
    portalChildLedger: PORTAL_CHILD_LEDGER,
    fallbackPortalLedger: FALLBACK_PORTAL_LEDGER,
    primaryElaraAccessLedger: PRIMARY_ELARA_ACCESS_LEDGER,

    structuralCounts: STRUCTURAL_COUNTS,
    geometry: GEOMETRY,

    boundedLimitations: [
      {
        limitationId: INFORMATION_FALLBACK_LIMITATION_ID,
        status: "KNOWN_BOUNDED_STATIC_FALLBACK_LIMITATION",
        description:
          "The Platform information panel is statically visible while the Engineering and Evidence panels begin hidden and require the information-tab runtime to reveal them.",
        constellationBlocking: false,
        manifestEligibilityBlocking: false,
        laterStaticFallbackReviewRequired: true
      }
    ],

    validation: {
      mode: "READ_ONLY",
      mutationAuthorized: false,
      repairAuthorized: false,
      navigationAuthorized: false,
      initializationAuthorized: false,
      eventRegistrationAuthorized: false,

      returnModel: RETURN_MODEL,

      requiredPageAttributes: REQUIRED_PAGE_ATTRIBUTES,
      requiredShowroomRootState: REQUIRED_SHOWROOM_ROOT_STATE,
      requiredMetaContracts: REQUIRED_META_CONTRACTS,
      requiredUniqueSelectors: REQUIRED_UNIQUE_SELECTORS,
      requiredSelectorCounts: REQUIRED_SELECTOR_COUNTS,
      requiredNativeDisclosures: REQUIRED_NATIVE_DISCLOSURES,
      requiredRelationships: REQUIRED_RELATIONSHIPS,
      requiredGaugeIds: REQUIRED_GAUGE_IDS,
      expectedStylesheets: EXPECTED_STYLESHEETS,
      forbiddenStylesheets: FORBIDDEN_STYLESHEETS,
      expectedDependencies: EXPECTED_DEPENDENCIES,
      forbiddenDependencies: FORBIDDEN_DEPENDENCIES,
      forbiddenAssemblyMarkers: FORBIDDEN_ASSEMBLY_MARKERS
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

  function normalizeResourcePath(value) {
    try {
      return new URL(value, document.baseURI).pathname;
    } catch {
      return String(value || "").split("?")[0];
    }
  }

  function readResourceVersion(value) {
    try {
      return new URL(value, document.baseURI).searchParams.get("v");
    } catch {
      const source = String(value || "");
      const queryIndex = source.indexOf("?");

      if (queryIndex === -1) {
        return null;
      }

      const query = source.slice(queryIndex + 1);
      const parts = query.split("&");

      for (const part of parts) {
        const separatorIndex = part.indexOf("=");

        const rawKey =
          separatorIndex === -1
            ? part
            : part.slice(0, separatorIndex);

        const rawValue =
          separatorIndex === -1
            ? ""
            : part.slice(separatorIndex + 1);

        let key;
        let parameterValue;

        try {
          key = decodeURIComponent(rawKey);
          parameterValue = decodeURIComponent(rawValue);
        } catch {
          key = rawKey;
          parameterValue = rawValue;
        }

        if (key === "v") {
          return parameterValue || null;
        }
      }

      return null;
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

  function exactAttributesPass(node, expectations) {
    if (!node) {
      return false;
    }

    return Object.entries(expectations).every(
      ([attribute, expected]) =>
        node.getAttribute(attribute) === expected
    );
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

  function validateShowroomRootState() {
    const matches =
      document.querySelectorAll("[data-showroom-root]");

    const root =
      matches.length === 1
        ? matches[0]
        : null;

    return Object.entries(REQUIRED_SHOWROOM_ROOT_STATE).map(
      ([attribute, expected]) => {
        const actual =
          root?.getAttribute(attribute) ?? null;

        return makeCheck({
          category: "SHOWROOM_ROOT_STATE",
          label: attribute,
          status:
            matches.length === 1 &&
            actual === expected
              ? STATUS.PASS
              : STATUS.FAIL,
          expected,
          actual,
          detail:
            matches.length === 1
              ? null
              : `Expected one Showroom root; found ${matches.length}.`
        });
      }
    );
  }

  function validateMetaContracts() {
    return REQUIRED_META_CONTRACTS.map((expectation) => {
      const selector =
        `meta[name="${expectation.name}"]`;

      const matches =
        document.querySelectorAll(selector);

      const actual =
        matches.length === 1
          ? matches[0].getAttribute("content")
          : null;

      return makeCheck({
        category: "META_CONTRACT",
        label: expectation.name,
        status:
          matches.length === 1 &&
          actual === expectation.content
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          content: expectation.content
        },
        actual: {
          count: matches.length,
          content: actual
        }
      });
    });
  }

  function validateUniqueSelectors() {
    return REQUIRED_UNIQUE_SELECTORS.map((expectation) => {
      const actual =
        document.querySelectorAll(expectation.selector).length;

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
      const actual =
        document.querySelectorAll(expectation.selector).length;

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

  function validateCardinalLedger() {
    return CARDINAL_LEDGER.flatMap((entry) => {
      const cardinalSelector =
        `[data-showroom-cardinal-control]` +
        `[data-showroom-cardinal-id="${entry.cardinalId}"]`;

      const clusterSelector =
        `#${entry.clusterId}` +
        `[data-showroom-cluster-id="${entry.cardinalId}"]`;

      const cardinalNodes =
        document.querySelectorAll(cardinalSelector);

      const clusterNodes =
        document.querySelectorAll(clusterSelector);

      const cardinal =
        cardinalNodes.length === 1
          ? cardinalNodes[0]
          : null;

      const cluster =
        clusterNodes.length === 1
          ? clusterNodes[0]
          : null;

      const directChildren =
        cluster
          ? Array.from(cluster.children).filter(
              (child) =>
                child.matches("[data-showroom-child-control]")
            )
          : [];

      const childIds =
        directChildren.map((node) =>
          node.getAttribute("data-showroom-child-id")
        );

      const cardinalPasses =
        cardinalNodes.length === 1 &&
        cardinal instanceof HTMLButtonElement &&
        cardinal.type === "button" &&
        cardinal.getAttribute(
          "data-showroom-cardinal-label"
        ) === entry.label &&
        cardinal.getAttribute(
          "data-showroom-object-behavior"
        ) === "cluster" &&
        cardinal.getAttribute(
          "aria-expanded"
        ) === "false" &&
        cardinal.getAttribute(
          "aria-controls"
        ) === entry.clusterId;

      const clusterPasses =
        clusterNodes.length === 1 &&
        cluster.hasAttribute("hidden") &&
        cluster.getAttribute(
          "data-showroom-cluster-state"
        ) === "collapsed" &&
        cluster.getAttribute(
          "aria-label"
        ) === entry.clusterAriaLabel &&
        directChildren.length === entry.childIds.length &&
        childIds.every(
          (childId, index) =>
            childId === entry.childIds[index]
        );

      return [
        makeCheck({
          category: "CARDINAL_LEDGER",
          label: `${entry.cardinalId} cardinal`,
          status:
            cardinalPasses
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            count: 1,
            element: "BUTTON",
            type: "button",
            label: entry.label,
            behavior: "cluster",
            ariaExpanded: "false",
            controls: entry.clusterId
          },
          actual: {
            count: cardinalNodes.length,
            element: cardinal?.tagName ?? null,
            type:
              cardinal instanceof HTMLButtonElement
                ? cardinal.type
                : null,
            label:
              cardinal?.getAttribute(
                "data-showroom-cardinal-label"
              ) ?? null,
            behavior:
              cardinal?.getAttribute(
                "data-showroom-object-behavior"
              ) ?? null,
            ariaExpanded:
              cardinal?.getAttribute(
                "aria-expanded"
              ) ?? null,
            controls:
              cardinal?.getAttribute(
                "aria-controls"
              ) ?? null
          }
        }),

        makeCheck({
          category: "CARDINAL_LEDGER",
          label: `${entry.cardinalId} cluster`,
          status:
            clusterPasses
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            count: 1,
            hidden: true,
            state: "collapsed",
            ariaLabel: entry.clusterAriaLabel,
            directChildIds: entry.childIds
          },
          actual: {
            count: clusterNodes.length,
            hidden:
              cluster?.hasAttribute("hidden") ?? false,
            state:
              cluster?.getAttribute(
                "data-showroom-cluster-state"
              ) ?? null,
            ariaLabel:
              cluster?.getAttribute("aria-label") ?? null,
            directChildIds: childIds
          }
        })
      ];
    });
  }

  function validateLocalChildLedger() {
    return LOCAL_CHILD_LEDGER.flatMap((entry) => {
      const selector =
        `[data-showroom-child-control]` +
        `[data-showroom-child-id="${entry.childId}"]`;

      const matches =
        document.querySelectorAll(selector);

      const node =
        matches.length === 1
          ? matches[0]
          : null;

      const target =
        node?.getAttribute("data-showroom-target") ?? null;

      const targetNode =
        target
          ? document.querySelector(target)
          : null;

      const targetSurfaceId =
        targetNode?.getAttribute(
          "data-showroom-local-destination-surface"
        ) ?? null;

      const expectedAttributes = {
        "data-showroom-cardinal-id":
          entry.cardinalId,

        "data-showroom-child-label":
          entry.label,

        "data-showroom-destination-kind":
          entry.destinationKind,

        "data-showroom-target":
          entry.target,

        "data-showroom-return-model":
          entry.returnModel,

        "data-showroom-return-zone":
          entry.returnZone,

        "data-showroom-visual-class":
          "LOCAL",

        "data-showroom-emphasis":
          "normal"
      };

      const openAncestorActual =
        node?.getAttribute(
          "data-showroom-open-ancestor"
        ) ?? null;

      const requiredFrontActual =
        node?.getAttribute(
          "data-showroom-required-front"
        ) ?? null;

      const semanticActivationActual =
        node?.getAttribute(
          "data-showroom-semantic-activation"
        ) ?? null;

      const optionalAttributesPass =
        openAncestorActual === entry.openAncestor &&
        requiredFrontActual === entry.requiredFront &&
        semanticActivationActual === entry.semanticActivation;

      return [
        makeCheck({
          category: "LOCAL_CHILD_LEDGER",
          label: `${entry.childId} declaration`,
          status:
            matches.length === 1 &&
            node instanceof HTMLButtonElement &&
            node.type === "button" &&
            exactAttributesPass(
              node,
              expectedAttributes
            ) &&
            optionalAttributesPass
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            count: 1,
            element: "BUTTON",
            type: "button",
            ...expectedAttributes,
            openAncestor: entry.openAncestor,
            requiredFront: entry.requiredFront,
            semanticActivation:
              entry.semanticActivation
          },
          actual: {
            count: matches.length,
            element: node?.tagName ?? null,
            type:
              node instanceof HTMLButtonElement
                ? node.type
                : null,
            cardinalId:
              node?.getAttribute(
                "data-showroom-cardinal-id"
              ) ?? null,
            childLabel:
              node?.getAttribute(
                "data-showroom-child-label"
              ) ?? null,
            destinationKind:
              node?.getAttribute(
                "data-showroom-destination-kind"
              ) ?? null,
            target,
            openAncestor: openAncestorActual,
            requiredFront: requiredFrontActual,
            semanticActivation:
              semanticActivationActual,
            returnModel:
              node?.getAttribute(
                "data-showroom-return-model"
              ) ?? null,
            returnZone:
              node?.getAttribute(
                "data-showroom-return-zone"
              ) ?? null
          }
        }),

        makeCheck({
          category: "LOCAL_TARGET",
          label: `${entry.childId} target`,
          status:
            target === entry.target &&
            Boolean(targetNode) &&
            targetSurfaceId === entry.childId
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            selector: entry.target,
            exists: true,
            destinationSurfaceId: entry.childId
          },
          actual: {
            selector: target,
            exists: Boolean(targetNode),
            destinationSurfaceId: targetSurfaceId
          }
        })
      ];
    });
  }

  function validateSharedReturnZone() {
    const zones =
      document.querySelectorAll(
        "#showroom-return-zone[data-showroom-return-zone]"
      );

    const zone =
      zones.length === 1
        ? zones[0]
        : null;

    const orbitControls =
      document.querySelectorAll(
        "[data-showroom-shared-return-to-orbit]"
      );

    const orbitControl =
      orbitControls.length === 1
        ? orbitControls[0]
        : null;

    const compassControls =
      document.querySelectorAll(
        "[data-showroom-shared-return-to-compass]"
      );

    const compassControl =
      compassControls.length === 1
        ? compassControls[0]
        : null;

    const accessibleEscapes =
      document.querySelectorAll(
        "[data-showroom-accessible-orbit-return]"
      );

    const accessibleEscape =
      accessibleEscapes.length === 1
        ? accessibleEscapes[0]
        : null;

    const repeatedLocalReturns =
      document.querySelectorAll(
        ".showroom-local-return"
      );

    const repeatedFrontReturns =
      document.querySelectorAll(
        ".showroom-front-navigation"
      );

    const footerCompassControls =
      document.querySelectorAll(
        '.showroom-footer [data-showroom-open-compass-dialog]'
      );

    const obsoleteDestinationOrbitControls =
      document.querySelectorAll(
        'main [data-showroom-return-to-orbit]'
      );

    const immediatelyAfterMain =
      zone?.previousElementSibling?.tagName === "MAIN";

    const immediatelyBeforeFooter =
      zone?.nextElementSibling?.tagName === "FOOTER";

    return [
      makeCheck({
        category: "SHARED_RETURN_ZONE",
        label: "shared return-zone placement",
        status:
          zones.length === 1 &&
          immediatelyAfterMain &&
          immediatelyBeforeFooter &&
          zone?.getAttribute(
            "aria-labelledby"
          ) === "showroom-return-zone-title"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          immediatelyAfterMain: true,
          immediatelyBeforeFooter: true,
          ariaLabelledby:
            "showroom-return-zone-title"
        },
        actual: {
          count: zones.length,
          immediatelyAfterMain,
          immediatelyBeforeFooter,
          ariaLabelledby:
            zone?.getAttribute(
              "aria-labelledby"
            ) ?? null
        }
      }),

      makeCheck({
        category: "SHARED_RETURN_ZONE",
        label: "shared Return to Orbit control",
        status:
          orbitControls.length === 1 &&
          orbitControl instanceof HTMLAnchorElement &&
          orbitControl.getAttribute("href") ===
            "#showroom-orbit" &&
          zone?.contains(orbitControl) === true
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "A",
          href: "#showroom-orbit",
          insideSharedZone: true
        },
        actual: {
          count: orbitControls.length,
          element:
            orbitControl?.tagName ?? null,
          href:
            orbitControl?.getAttribute("href") ?? null,
          insideSharedZone:
            zone?.contains(orbitControl) ?? false
        }
      }),

      makeCheck({
        category: "SHARED_RETURN_ZONE",
        label: "shared Return to Main Compass control",
        status:
          compassControls.length === 1 &&
          compassControl instanceof HTMLButtonElement &&
          compassControl.type === "button" &&
          compassControl.hasAttribute(
            "data-showroom-open-compass-dialog"
          ) &&
          compassControl.getAttribute(
            "aria-haspopup"
          ) === "dialog" &&
          compassControl.getAttribute(
            "aria-controls"
          ) === "showroom-compass-dialog" &&
          zone?.contains(compassControl) === true
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "BUTTON",
          type: "button",
          openCompassDialogMarker: true,
          ariaHaspopup: "dialog",
          ariaControls:
            "showroom-compass-dialog",
          insideSharedZone: true
        },
        actual: {
          count: compassControls.length,
          element:
            compassControl?.tagName ?? null,
          type:
            compassControl instanceof HTMLButtonElement
              ? compassControl.type
              : null,
          openCompassDialogMarker:
            compassControl?.hasAttribute(
              "data-showroom-open-compass-dialog"
            ) ?? false,
          ariaHaspopup:
            compassControl?.getAttribute(
              "aria-haspopup"
            ) ?? null,
          ariaControls:
            compassControl?.getAttribute(
              "aria-controls"
            ) ?? null,
          insideSharedZone:
            zone?.contains(compassControl) ?? false
        }
      }),

      makeCheck({
        category: "ACCESSIBLE_ORBIT_ESCAPE",
        label: "accessible orbit escape",
        status:
          accessibleEscapes.length === 1 &&
          accessibleEscape instanceof HTMLAnchorElement &&
          accessibleEscape.getAttribute("href") ===
            "#showroom-orbit"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "A",
          href: "#showroom-orbit"
        },
        actual: {
          count: accessibleEscapes.length,
          element:
            accessibleEscape?.tagName ?? null,
          href:
            accessibleEscape?.getAttribute(
              "href"
            ) ?? null
        }
      }),

      makeCheck({
        category: "OBSOLETE_RETURN_SURFACE",
        label: "obsolete repeated return surfaces absent",
        status:
          repeatedLocalReturns.length === 0 &&
          repeatedFrontReturns.length === 0 &&
          footerCompassControls.length === 0 &&
          obsoleteDestinationOrbitControls.length === 0
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          localReturnBlocks: 0,
          frontNavigationBlocks: 0,
          footerCompassControls: 0,
          destinationOrbitControls: 0
        },
        actual: {
          localReturnBlocks:
            repeatedLocalReturns.length,
          frontNavigationBlocks:
            repeatedFrontReturns.length,
          footerCompassControls:
            footerCompassControls.length,
          destinationOrbitControls:
            obsoleteDestinationOrbitControls.length
        }
      })
    ];
  }

  function validatePortalChildLedger() {
    return PORTAL_CHILD_LEDGER.map((entry) => {
      const selector =
        `[data-showroom-child-control]` +
        `[data-showroom-child-id="${entry.childId}"]`;

      const matches =
        document.querySelectorAll(selector);

      const node =
        matches.length === 1
          ? matches[0]
          : null;

      const expectedAttributes = {
        "data-showroom-cardinal-id":
          entry.cardinalId,

        "data-showroom-child-label":
          entry.label,

        "data-showroom-object-behavior":
          "portal",

        "data-showroom-destination-kind":
          "external-route",

        "data-showroom-route":
          entry.route,

        "data-showroom-route-label":
          entry.label,

        "data-showroom-route-description":
          entry.description,

        "data-showroom-route-confirmation-required":
          "true",

        "data-showroom-immediate-navigation":
          "false",

        "data-showroom-visual-class":
          entry.visualClass,

        "data-showroom-emphasis":
          entry.emphasis,

        "aria-label":
          entry.ariaLabel,

        "aria-haspopup":
          "dialog",

        "aria-controls":
          "showroom-route-dialog"
      };

      const routeRoleActual =
        node?.getAttribute(
          "data-showroom-route-role"
        ) ?? null;

      const routeRolePass =
        routeRoleActual === entry.routeRole;

      const primaryClassActual =
        node?.classList.contains(
          "showroom-star--primary-portal"
        ) ?? false;

      const primaryClassPass =
        primaryClassActual === entry.primaryPortal;

      const authorized =
        ROUTES.authorizedPortalRoutes.includes(
          node?.getAttribute(
            "data-showroom-route"
          )
        );

      return makeCheck({
        category: "PORTAL_CHILD_LEDGER",
        label: entry.childId,
        status:
          matches.length === 1 &&
          node instanceof HTMLButtonElement &&
          node.type === "button" &&
          exactAttributesPass(
            node,
            expectedAttributes
          ) &&
          routeRolePass &&
          primaryClassPass &&
          authorized
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "BUTTON",
          type: "button",
          authorizedRoute: true,
          primaryPortal: entry.primaryPortal,
          routeRole: entry.routeRole,
          ...expectedAttributes
        },
        actual: {
          count: matches.length,
          element: node?.tagName ?? null,
          type:
            node instanceof HTMLButtonElement
              ? node.type
              : null,
          route:
            node?.getAttribute(
              "data-showroom-route"
            ) ?? null,
          authorizedRoute: authorized,
          routeLabel:
            node?.getAttribute(
              "data-showroom-route-label"
            ) ?? null,
          routeDescription:
            node?.getAttribute(
              "data-showroom-route-description"
            ) ?? null,
          confirmationRequired:
            node?.getAttribute(
              "data-showroom-route-confirmation-required"
            ) ?? null,
          immediateNavigation:
            node?.getAttribute(
              "data-showroom-immediate-navigation"
            ) ?? null,
          visualClass:
            node?.getAttribute(
              "data-showroom-visual-class"
            ) ?? null,
          emphasis:
            node?.getAttribute(
              "data-showroom-emphasis"
            ) ?? null,
          routeRole: routeRoleActual,
          primaryPortalClass: primaryClassActual,
          ariaLabel:
            node?.getAttribute("aria-label") ?? null,
          ariaHaspopup:
            node?.getAttribute("aria-haspopup") ?? null,
          ariaControls:
            node?.getAttribute("aria-controls") ?? null
        }
      });
    });
  }

  function validateFallbackPortalLedger() {
    return FALLBACK_PORTAL_LEDGER.map((entry) => {
      const matches =
        document.querySelectorAll(entry.selector);

      const node =
        matches.length === 1
          ? matches[0]
          : null;

      const authorized =
        ROUTES.authorizedPortalRoutes.includes(
          node?.getAttribute(
            "data-showroom-route"
          )
        );

      const passes =
        matches.length === 1 &&
        node instanceof HTMLButtonElement &&
        node.type === "button" &&
        node.getAttribute(
          "data-showroom-destination-kind"
        ) === "external-route" &&
        node.getAttribute(
          "data-showroom-route"
        ) === entry.route &&
        node.getAttribute(
          "data-showroom-route-label"
        ) === entry.label &&
        node.getAttribute(
          "data-showroom-route-description"
        ) === entry.description &&
        node.getAttribute(
          "data-showroom-route-confirmation-required"
        ) === "true" &&
        node.getAttribute(
          "data-showroom-immediate-navigation"
        ) === "false" &&
        node.getAttribute(
          "aria-label"
        ) === entry.ariaLabel &&
        node.getAttribute(
          "aria-haspopup"
        ) === "dialog" &&
        node.getAttribute(
          "aria-controls"
        ) === "showroom-route-dialog" &&
        authorized;

      return makeCheck({
        category: "FALLBACK_PORTAL_LEDGER",
        label: entry.id,
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "BUTTON",
          type: "button",
          route: entry.route,
          label: entry.label,
          description: entry.description,
          ariaLabel: entry.ariaLabel,
          destinationKind: "external-route",
          confirmationRequired: "true",
          immediateNavigation: "false",
          ariaHaspopup: "dialog",
          ariaControls: "showroom-route-dialog",
          authorizedRoute: true
        },
        actual: {
          count: matches.length,
          element: node?.tagName ?? null,
          type:
            node instanceof HTMLButtonElement
              ? node.type
              : null,
          route:
            node?.getAttribute(
              "data-showroom-route"
            ) ?? null,
          label:
            node?.getAttribute(
              "data-showroom-route-label"
            ) ?? null,
          description:
            node?.getAttribute(
              "data-showroom-route-description"
            ) ?? null,
          ariaLabel:
            node?.getAttribute("aria-label") ?? null,
          destinationKind:
            node?.getAttribute(
              "data-showroom-destination-kind"
            ) ?? null,
          confirmationRequired:
            node?.getAttribute(
              "data-showroom-route-confirmation-required"
            ) ?? null,
          immediateNavigation:
            node?.getAttribute(
              "data-showroom-immediate-navigation"
            ) ?? null,
          ariaHaspopup:
            node?.getAttribute("aria-haspopup") ?? null,
          ariaControls:
            node?.getAttribute("aria-controls") ?? null,
          authorizedRoute: authorized
        },
        detail: entry.selector
      });
    });
  }

  function validateGlobalPortalSurface() {
    const portalTriggers =
      Array.from(
        document.querySelectorAll(
          '[data-showroom-destination-kind="external-route"]'
        )
      );

    const childPortals =
      portalTriggers.filter((node) =>
        node.hasAttribute("data-showroom-child-control")
      );

    const fallbackPortals =
      portalTriggers.filter((node) =>
        node.hasAttribute("data-showroom-fallback-portal")
      );

    const routes =
      portalTriggers.map((node) =>
        node.getAttribute("data-showroom-route")
      );

    const unauthorizedRoutes =
      routes.filter(
        (route) =>
          !ROUTES.authorizedPortalRoutes.includes(route)
      );

    const uniqueRoutes =
      Array.from(new Set(routes));

    const allUseControllerContract =
      portalTriggers.every(
        (node) =>
          node instanceof HTMLButtonElement &&
          node.type === "button" &&
          node.getAttribute(
            "data-showroom-route-confirmation-required"
          ) === "true" &&
          node.getAttribute(
            "data-showroom-immediate-navigation"
          ) === "false" &&
          node.getAttribute(
            "aria-haspopup"
          ) === "dialog" &&
          node.getAttribute(
            "aria-controls"
          ) === "showroom-route-dialog"
      );

    const passes =
      portalTriggers.length ===
        STRUCTURAL_COUNTS.totalControllerMediatedPortalTriggers &&
      childPortals.length ===
        STRUCTURAL_COUNTS.portalChildDestinations &&
      fallbackPortals.length ===
        STRUCTURAL_COUNTS.fallbackPortalControls &&
      unauthorizedRoutes.length === 0 &&
      uniqueRoutes.length ===
        ROUTES.authorizedPortalRoutes.length &&
      ROUTES.authorizedPortalRoutes.every(
        (route) => uniqueRoutes.includes(route)
      ) &&
      allUseControllerContract;

    return [
      makeCheck({
        category: "PORTAL_SURFACE",
        label: "complete portal trigger surface",
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          totalTriggers:
            STRUCTURAL_COUNTS
              .totalControllerMediatedPortalTriggers,
          childPortalTriggers:
            STRUCTURAL_COUNTS.portalChildDestinations,
          fallbackPortalTriggers:
            STRUCTURAL_COUNTS.fallbackPortalControls,
          authorizedUniqueRoutes:
            ROUTES.authorizedPortalRoutes,
          unauthorizedRoutes: [],
          allControllerMediated: true
        },
        actual: {
          totalTriggers: portalTriggers.length,
          childPortalTriggers: childPortals.length,
          fallbackPortalTriggers: fallbackPortals.length,
          uniqueRoutes,
          unauthorizedRoutes,
          allControllerMediated:
            allUseControllerContract
        }
      })
    ];
  }

  function validatePrimaryElaraAccess() {
    const checks =
      PRIMARY_ELARA_ACCESS_LEDGER.map((entry) => {
        const actual =
          document.querySelectorAll(entry.selector).length;

        return makeCheck({
          category: "ELARA_ACCESS",
          label: entry.id,
          status:
            actual === 1
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: 1,
          actual,
          detail: entry.selector
        });
      });

    const primaryTotal =
      PRIMARY_ELARA_ACCESS_LEDGER.reduce(
        (total, entry) =>
          total +
          document.querySelectorAll(entry.selector).length,
        0
      );

    const fallbackMenuElara =
      document.querySelectorAll(
        '.fallback-navigation [data-showroom-fallback-portal][data-showroom-route="/elara/index.html"]'
      ).length;

    const allElaraRepresentations =
      document.querySelectorAll(
        '[data-showroom-destination-kind="external-route"][data-showroom-route="/elara/index.html"]'
      ).length;

    checks.push(
      makeCheck({
        category: "ELARA_ACCESS",
        label: "primary Elara access controls",
        status:
          primaryTotal ===
          STRUCTURAL_COUNTS.primaryElaraAccessControls
            ? STATUS.PASS
            : STATUS.FAIL,
        expected:
          STRUCTURAL_COUNTS.primaryElaraAccessControls,
        actual: primaryTotal
      })
    );

    checks.push(
      makeCheck({
        category: "ELARA_ACCESS",
        label: "fallback-menu Elara representation",
        status:
          fallbackMenuElara ===
          STRUCTURAL_COUNTS
            .elaraFallbackMenuRepresentations
            ? STATUS.PASS
            : STATUS.FAIL,
        expected:
          STRUCTURAL_COUNTS
            .elaraFallbackMenuRepresentations,
        actual: fallbackMenuElara
      })
    );

    checks.push(
      makeCheck({
        category: "ELARA_ACCESS",
        label: "total Elara route representations",
        status:
          allElaraRepresentations ===
          STRUCTURAL_COUNTS.totalElaraRouteRepresentations
            ? STATUS.PASS
            : STATUS.FAIL,
        expected:
          STRUCTURAL_COUNTS.totalElaraRouteRepresentations,
        actual: allElaraRepresentations
      })
    );

    return checks;
  }

  function validateElaraAssetBoundary() {
    const selector =
      'script[data-elara-room-entry-asset="true"]';

    const matches =
      document.querySelectorAll(selector);

    const node =
      matches.length === 1
        ? matches[0]
        : null;

    const path =
      node
        ? normalizeResourcePath(node.src)
        : null;

    const explicitAccessibilityRole =
      node?.getAttribute(
        "data-elara-homeroom-accessibility-asset"
      ) ?? null;

    const explicitPortalAuthority =
      node?.getAttribute(
        "data-elara-portal-navigation-authority"
      ) ?? null;

    const explicitlyClaimsAuthority =
      explicitPortalAuthority === "true";

    const controllerDeclared =
      document.documentElement.getAttribute(
        "data-showroom-controller"
      ) === "/showroom/index.controller.js";

    const portalControls =
      Array.from(
        document.querySelectorAll(
          '[data-showroom-destination-kind="external-route"]'
        )
      );

    const portalControlsUseControllerContract =
      portalControls.length ===
        STRUCTURAL_COUNTS
          .totalControllerMediatedPortalTriggers &&
      portalControls.every(
        (portal) =>
          portal.getAttribute(
            "data-showroom-route-confirmation-required"
          ) === "true" &&
          portal.getAttribute(
            "data-showroom-immediate-navigation"
          ) === "false" &&
          portal.getAttribute(
            "aria-controls"
          ) === "showroom-route-dialog"
      );

    const controllerPortalAuthority =
      controllerDeclared &&
      portalControlsUseControllerContract;

    return [
      makeCheck({
        category: "ELARA_ASSET_BOUNDARY",
        label: "Elara homeroom asset present",
        status:
          matches.length === 1 &&
          path === OWNERSHIP.elara.asset
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          path: OWNERSHIP.elara.asset
        },
        actual: {
          count: matches.length,
          path
        }
      }),

      makeCheck({
        category: "ELARA_ASSET_BOUNDARY",
        label: "Elara asset accessibility role",
        status:
          matches.length === 1 &&
          !explicitlyClaimsAuthority
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          role:
            OWNERSHIP.elara.assetRole,
          explicitAccessibilityMetadata:
            "true or inferable",
          portalNavigationAuthority: false
        },
        actual: {
          role:
            explicitAccessibilityRole === "true"
              ? "EXPLICIT_PAGE_LEVEL_ELARA_HOMEROOM_ACCESSIBILITY_SUPPORT"
              : "INFERRED_PAGE_LEVEL_ELARA_HOMEROOM_ACCESSIBILITY_SUPPORT",
          explicitAccessibilityRole,
          explicitPortalAuthority,
          explicitlyClaimsAuthority
        }
      }),

      makeCheck({
        category: "ELARA_ASSET_BOUNDARY",
        label: "controller portal-navigation authority",
        status:
          controllerPortalAuthority
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          controllerDeclared: true,
          allPortalControlsUseControllerContract: true,
          controllerPortalNavigationAuthority: true
        },
        actual: {
          controllerDeclared,
          allPortalControlsUseControllerContract:
            portalControlsUseControllerContract,
          controllerPortalNavigationAuthority:
            controllerPortalAuthority
        }
      })
    ];
  }

  function validateRouteContinuation() {
    const matches =
      document.querySelectorAll(
        "[data-showroom-route-continue]"
      );

    const node =
      matches.length === 1
        ? matches[0]
        : null;

    const passes =
      matches.length === 1 &&
      node instanceof HTMLButtonElement &&
      node.type === "button" &&
      node.disabled === true &&
      node.getAttribute(
        "data-showroom-route-confirmed-navigation"
      ) === "true";

    return [
      makeCheck({
        category: "ROUTE_CONFIRMATION",
        label: "neutral route continuation control",
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count: 1,
          element: "BUTTON",
          type: "button",
          disabled: true,
          confirmedNavigationMarker: "true"
        },
        actual: {
          count: matches.length,
          element: node?.tagName ?? null,
          type:
            node instanceof HTMLButtonElement
              ? node.type
              : null,
          disabled:
            node instanceof HTMLButtonElement
              ? node.disabled
              : null,
          confirmedNavigationMarker:
            node?.getAttribute(
              "data-showroom-route-confirmed-navigation"
            ) ?? null
        }
      })
    ];
  }

  function validateCompassTriggers() {
    const triggers =
      Array.from(
        document.querySelectorAll(
          "[data-showroom-open-compass-dialog]"
        )
      );

    const brand =
      document.querySelector(
        ".brand[data-showroom-open-compass-dialog]"
      );

    const shared =
      document.querySelector(
        "[data-showroom-shared-return-to-compass]" +
        "[data-showroom-open-compass-dialog]"
      );

    const exactTriggerSet =
      triggers.length ===
        STRUCTURAL_COUNTS.compassDialogTriggers &&
      Boolean(brand) &&
      Boolean(shared) &&
      brand !== shared &&
      triggers.includes(brand) &&
      triggers.includes(shared);

    const checks =
      triggers.map((trigger, index) => {
        const passes =
          trigger instanceof HTMLButtonElement &&
          trigger.type === "button" &&
          trigger.getAttribute(
            "aria-haspopup"
          ) === "dialog" &&
          trigger.getAttribute(
            "aria-controls"
          ) === "showroom-compass-dialog";

        return makeCheck({
          category: "COMPASS_TRIGGER",
          label:
            trigger.getAttribute("aria-label") ||
            trigger.textContent.trim() ||
            `Compass trigger ${index + 1}`,
          status:
            passes
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            element: "BUTTON",
            type: "button",
            ariaHaspopup: "dialog",
            ariaControls:
              "showroom-compass-dialog"
          },
          actual: {
            element: trigger.tagName,
            type:
              trigger instanceof HTMLButtonElement
                ? trigger.type
                : null,
            ariaHaspopup:
              trigger.getAttribute(
                "aria-haspopup"
              ),
            ariaControls:
              trigger.getAttribute(
                "aria-controls"
              )
          }
        });
      });

    checks.push(
      makeCheck({
        category: "COMPASS_TRIGGER",
        label: "exact Compass trigger count",
        status:
          triggers.length ===
          STRUCTURAL_COUNTS.compassDialogTriggers
            ? STATUS.PASS
            : STATUS.FAIL,
        expected:
          STRUCTURAL_COUNTS.compassDialogTriggers,
        actual: triggers.length
      })
    );

    checks.push(
      makeCheck({
        category: "COMPASS_TRIGGER",
        label: "exact Compass trigger set",
        status:
          exactTriggerSet
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          count:
            STRUCTURAL_COUNTS.compassDialogTriggers,
          headerBrand: true,
          sharedReturnCompassControl: true,
          additionalMarkedTriggers: 0
        },
        actual: {
          count: triggers.length,
          headerBrand:
            Boolean(brand),
          sharedReturnCompassControl:
            Boolean(shared),
          exactTriggerSet
        }
      })
    );

    const orbitCompass =
      document.querySelector(
        "[data-showroom-compass-control]"
      );

    checks.push(
      makeCheck({
        category: "COMPASS_TRIGGER",
        label: "orbit Compass control contract",
        status:
          orbitCompass instanceof HTMLButtonElement &&
          orbitCompass.type === "button" &&
          orbitCompass.getAttribute(
            "data-showroom-controller-action"
          ) === "open-compass-return-dialog" &&
          orbitCompass.getAttribute(
            "data-showroom-object-behavior"
          ) === "compass-return" &&
          orbitCompass.getAttribute(
            "data-immediate-navigation"
          ) === "false" &&
          orbitCompass.getAttribute(
            "data-return-route"
          ) === ROUTES.mainCompass &&
          orbitCompass.getAttribute(
            "aria-expanded"
          ) === "false" &&
          orbitCompass.getAttribute(
            "aria-controls"
          ) === "showroom-compass-dialog"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          element: "BUTTON",
          type: "button",
          controllerAction:
            "open-compass-return-dialog",
          behavior:
            "compass-return",
          immediateNavigation:
            "false",
          returnRoute:
            ROUTES.mainCompass,
          ariaExpanded:
            "false",
          ariaControls:
            "showroom-compass-dialog"
        },
        actual: {
          element:
            orbitCompass?.tagName ?? null,
          type:
            orbitCompass instanceof HTMLButtonElement
              ? orbitCompass.type
              : null,
          controllerAction:
            orbitCompass?.getAttribute(
              "data-showroom-controller-action"
            ) ?? null,
          behavior:
            orbitCompass?.getAttribute(
              "data-showroom-object-behavior"
            ) ?? null,
          immediateNavigation:
            orbitCompass?.getAttribute(
              "data-immediate-navigation"
            ) ?? null,
          returnRoute:
            orbitCompass?.getAttribute(
              "data-return-route"
            ) ?? null,
          ariaExpanded:
            orbitCompass?.getAttribute(
              "aria-expanded"
            ) ?? null,
          ariaControls:
            orbitCompass?.getAttribute(
              "aria-controls"
            ) ?? null
        }
      })
    );

    return checks;
  }

  function validateCompassNavigationContracts() {
    const brand =
      document.querySelector(".brand");

    const confirmedReturn =
      document.querySelector(
        "[data-showroom-compass-return]"
      );

    const brandPasses =
      brand instanceof HTMLButtonElement &&
      brand.type === "button" &&
      brand.hasAttribute(
        "data-showroom-open-compass-dialog"
      ) &&
      brand.getAttribute(
        "aria-haspopup"
      ) === "dialog" &&
      brand.getAttribute(
        "aria-controls"
      ) === "showroom-compass-dialog" &&
      !brand.hasAttribute("href");

    const returnPasses =
      confirmedReturn instanceof HTMLAnchorElement &&
      confirmedReturn.getAttribute("href") ===
        ROUTES.mainCompass &&
      confirmedReturn.getAttribute(
        "data-showroom-controller-action"
      ) === "return-to-main-compass" &&
      confirmedReturn.getAttribute(
        "data-showroom-hard-navigation"
      ) === "true";

    return [
      makeCheck({
        category: "COMPASS_NAVIGATION",
        label: "header brand opens Compass confirmation",
        status:
          brandPasses
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          element: "BUTTON",
          type: "button",
          directHrefAbsent: true,
          openDialogMarker: true,
          ariaHaspopup: "dialog",
          ariaControls: "showroom-compass-dialog"
        },
        actual: {
          element: brand?.tagName ?? null,
          type:
            brand instanceof HTMLButtonElement
              ? brand.type
              : null,
          directHrefAbsent:
            brand
              ? !brand.hasAttribute("href")
              : null,
          openDialogMarker:
            brand?.hasAttribute(
              "data-showroom-open-compass-dialog"
            ) ?? false,
          ariaHaspopup:
            brand?.getAttribute("aria-haspopup") ?? null,
          ariaControls:
            brand?.getAttribute("aria-controls") ?? null
        }
      }),

      makeCheck({
        category: "COMPASS_NAVIGATION",
        label: "confirmed Compass destination",
        status:
          returnPasses
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          element: "A",
          href: ROUTES.mainCompass,
          controllerAction:
            "return-to-main-compass",
          hardNavigation: "true"
        },
        actual: {
          element: confirmedReturn?.tagName ?? null,
          href:
            confirmedReturn?.getAttribute("href") ?? null,
          controllerAction:
            confirmedReturn?.getAttribute(
              "data-showroom-controller-action"
            ) ?? null,
          hardNavigation:
            confirmedReturn?.getAttribute(
              "data-showroom-hard-navigation"
            ) ?? null
        }
      })
    ];
  }

  function validateCompassVisualBoundary() {
    const mount =
      document.querySelector(
        "[data-showroom-compass-visual-mount]"
      );

    return [
      makeCheck({
        category: "COMPASS_VISUAL_BOUNDARY",
        label: "Showroom-local Compass visual mount",
        status:
          Boolean(mount) &&
          mount.getAttribute(
            "data-showroom-compass-visual-only"
          ) === "true" &&
          mount.getAttribute(
            "data-showroom-compass-pointer-authority"
          ) === "false"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          exists: true,
          visualOnly: "true",
          pointerAuthority: "false"
        },
        actual: {
          exists: Boolean(mount),
          visualOnly:
            mount?.getAttribute(
              "data-showroom-compass-visual-only"
            ) ?? null,
          pointerAuthority:
            mount?.getAttribute(
              "data-showroom-compass-pointer-authority"
            ) ?? null
        }
      }),

      makeCheck({
        category: "COMPASS_VISUAL_BOUNDARY",
        label: "Showroom-local Compass visual authority",
        status:
          document.documentElement.getAttribute(
            "data-compass-visual-implementation"
          ) === "showroom-local"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: "showroom-local",
        actual:
          document.documentElement.getAttribute(
            "data-compass-visual-implementation"
          )
      }),

      makeCheck({
        category: "COMPASS_VISUAL_BOUNDARY",
        label: "Compass controller navigation authority",
        status:
          document.documentElement.getAttribute(
            "data-compass-controller-navigation-authority"
          ) === "true" &&
          document.documentElement.getAttribute(
            "data-compass-renderer-navigation-authority"
          ) === "false"
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          controllerAuthority: "true",
          rendererAuthority: "false"
        },
        actual: {
          controllerAuthority:
            document.documentElement.getAttribute(
              "data-compass-controller-navigation-authority"
            ),
          rendererAuthority:
            document.documentElement.getAttribute(
              "data-compass-renderer-navigation-authority"
            )
        }
      })
    ];
  }

  function validateNativeDisclosures() {
    return REQUIRED_NATIVE_DISCLOSURES.map((expectation) => {
      const node =
        document.querySelector(expectation.selector);

      const isDetails =
        node instanceof HTMLDetailsElement;

      const hasDirectSummary =
        isDetails &&
        Array.from(node.children).some(
          (child) =>
            child.tagName === "SUMMARY"
        );

      const openPasses =
        expectation.initiallyOpen === null ||
        (
          isDetails &&
          node.open === expectation.initiallyOpen
        );

      return makeCheck({
        category: "NATIVE_DISCLOSURE",
        label: expectation.label,
        status:
          isDetails &&
          hasDirectSummary &&
          openPasses
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          element: "DETAILS",
          directSummary: true,
          initiallyOpen:
            expectation.initiallyOpen
        },
        actual: node
          ? {
              element: node.tagName,
              directSummary: hasDirectSummary,
              open:
                isDetails
                  ? node.open
                  : null
            }
          : {
              element: null,
              directSummary: false,
              open: null
            },
        detail: expectation.selector
      });
    });
  }

  function validateRelationships() {
    return REQUIRED_RELATIONSHIPS.map((relationship) => {
      const source =
        document.querySelector(relationship.source);

      const target =
        document.querySelector(relationship.target);

      const expectedTargetId =
        relationship.target.startsWith("#")
          ? relationship.target.slice(1)
          : null;

      const actual =
        source?.getAttribute(
          relationship.attribute
        ) ?? null;

      const passes =
        Boolean(source) &&
        Boolean(target) &&
        expectedTargetId !== null &&
        actual === expectedTargetId;

      return makeCheck({
        category: "ACCESSIBILITY_RELATIONSHIP",
        label: relationship.label,
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
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

    Object.entries(
      REQUIRED_GAUGE_IDS
    ).forEach(
      ([dashboardId, expectedIds]) => {
        const dashboard =
          document.querySelector(
            `[data-gauge-dashboard-id="${dashboardId}"]`
          );

        if (!dashboard) {
          checks.push(
            makeCheck({
              category: "GAUGE_IDS",
              label:
                `${dashboardId} dashboard`,
              status: STATUS.FAIL,
              expected: expectedIds,
              actual: null,
              detail: "dashboard missing"
            })
          );

          return;
        }

        const actualIds =
          Array.from(
            dashboard.querySelectorAll(
              "[data-showroom-gauge]"
            )
          ).map((node) =>
            node.getAttribute(
              "data-gauge-id"
            )
          );

        const passes =
          actualIds.length === expectedIds.length &&
          actualIds.every(
            (value, index) =>
              value === expectedIds[index]
          );

        checks.push(
          makeCheck({
            category: "GAUGE_IDS",
            label:
              `${dashboardId} gauge order`,
            status:
              passes
                ? STATUS.PASS
                : STATUS.FAIL,
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
      .querySelectorAll(
        "[data-showroom-gauge]"
      )
      .forEach((gauge) => {
        const gaugeId =
          gauge.getAttribute(
            "data-gauge-id"
          );

        const controlledId =
          gauge.getAttribute(
            "aria-controls"
          );

        const detail =
          controlledId
            ? document.getElementById(
                controlledId
              )
            : null;

        const detailGaugeId =
          detail?.getAttribute(
            "data-gauge-detail-id"
          ) ?? null;

        const expectedControlledId =
          gaugeId
            ? `gauge-detail-${gaugeId}`
            : null;

        const passes =
          Boolean(gaugeId) &&
          controlledId === expectedControlledId &&
          Boolean(detail) &&
          detailGaugeId === gaugeId;

        checks.push(
          makeCheck({
            category: "GAUGE_RELATIONSHIP",
            label:
              gaugeId ||
              "unnamed gauge",
            status:
              passes
                ? STATUS.PASS
                : STATUS.FAIL,
            expected: {
              controlledId:
                expectedControlledId,
              detailGaugeId:
                gaugeId
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

  function validateDiamondGeometry() {
    const stage =
      document.querySelector(
        "[data-showroom-diamond-stage]"
      );

    const expectations = {
      "data-radial-sectors":
        String(GEOMETRY.radialSectors),

      "data-structural-bands":
        String(GEOMETRY.structuralBands),

      "data-lattice-seats":
        String(GEOMETRY.latticeSeats),

      "data-surface-triangles":
        String(GEOMETRY.surfaceTriangles),

      "data-lattice-connections":
        String(GEOMETRY.latticeConnections),

      "data-material-regions":
        String(GEOMETRY.materialRegions)
    };

    return Object.entries(
      expectations
    ).map(([attribute, expected]) => {
      const actual =
        stage?.getAttribute(attribute) ?? null;

      return makeCheck({
        category: "DIAMOND_GEOMETRY",
        label: attribute,
        status:
          actual === expected
            ? STATUS.PASS
            : STATUS.FAIL,
        expected,
        actual
      });
    });
  }

  function validateCompositionSemantics() {
    const rail =
      document.querySelector(
        ".showroom-composition-rail"
      );

    const directChildren =
      rail
        ? Array.from(rail.children)
        : [];

    const directListItems =
      directChildren.filter(
        (child) =>
          child.tagName === "LI"
      );

    const buttons =
      rail
        ? Array.from(
            rail.querySelectorAll(
              "[data-showroom-composition-region]"
            )
          )
        : [];

    const eachListItemHasOneButton =
      directListItems.length ===
        STRUCTURAL_COUNTS.compositionRegions &&
      directListItems.every(
        (item) => {
          const directButtons =
            Array.from(item.children).filter(
              (child) =>
                child.matches(
                  "[data-showroom-composition-region]"
                )
            );

          return directButtons.length === 1;
        }
      );

    const noButtonClaimsListItem =
      buttons.every(
        (button) =>
          button.getAttribute("role") !==
          "listitem"
      );

    return [
      makeCheck({
        category: "COMPOSITION_SEMANTICS",
        label: "native composition list",
        status:
          rail?.tagName === "UL" &&
          directChildren.length ===
            STRUCTURAL_COUNTS.compositionRegions &&
          directListItems.length ===
            STRUCTURAL_COUNTS.compositionRegions &&
          eachListItemHasOneButton &&
          buttons.length ===
            STRUCTURAL_COUNTS.compositionRegions &&
          noButtonClaimsListItem
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          railElement: "UL",
          directChildren:
            STRUCTURAL_COUNTS.compositionRegions,
          directListItems:
            STRUCTURAL_COUNTS.compositionRegions,
          oneDirectButtonPerListItem: true,
          compositionButtons:
            STRUCTURAL_COUNTS.compositionRegions,
          buttonRoleListitemCount: 0
        },
        actual: {
          railElement:
            rail?.tagName ?? null,
          directChildren:
            directChildren.length,
          directListItems:
            directListItems.length,
          oneDirectButtonPerListItem:
            eachListItemHasOneButton,
          compositionButtons:
            buttons.length,
          buttonRoleListitemCount:
            buttons.filter(
              (button) =>
                button.getAttribute(
                  "role"
                ) === "listitem"
            ).length
        }
      })
    ];
  }

  function validateStylesheets() {
    const links =
      Array.from(
        document.querySelectorAll(
          'link[rel~="stylesheet"][href]'
        )
      );

    const observed =
      links.map((link, index) => ({
        index,
        path:
          normalizeResourcePath(
            link.href
          ),
        version:
          readResourceVersion(
            link.href
          )
      }));

    const checks =
      EXPECTED_STYLESHEETS.map(
        (dependency) => {
          const matches =
            observed.filter(
              (stylesheet) =>
                stylesheet.path ===
                dependency.href
            );

          const match =
            matches.length === 1
              ? matches[0]
              : null;

          const passes =
            matches.length === 1 &&
            match.version ===
              dependency.requiredVersion;

          return makeCheck({
            category: "STYLESHEET",
            label: dependency.key,
            status:
              passes
                ? STATUS.PASS
                : STATUS.FAIL,
            expected: {
              count: 1,
              path:
                dependency.href,
              version:
                dependency.requiredVersion
            },
            actual: {
              count:
                matches.length,
              matches
            }
          });
        }
      );

    FORBIDDEN_STYLESHEETS.forEach(
      (path) => {
        const actual =
          observed.filter(
            (stylesheet) =>
              stylesheet.path === path
          ).length;

        checks.push(
          makeCheck({
            category:
              "FORBIDDEN_STYLESHEET",
            label: path,
            status:
              actual === 0
                ? STATUS.PASS
                : STATUS.FAIL,
            expected: 0,
            actual
          })
        );
      }
    );

    return checks;
  }

  function validateExactStylesheetSequence() {
    const actual =
      Array.from(
        document.querySelectorAll(
          'link[rel~="stylesheet"][href]'
        )
      ).map((link) => ({
        path:
          normalizeResourcePath(link.href),
        version:
          readResourceVersion(link.href)
      }));

    const expected =
      EXPECTED_STYLESHEETS.map((stylesheet) => ({
        path: stylesheet.href,
        version: stylesheet.requiredVersion
      }));

    const passes =
      actual.length === expected.length &&
      actual.length === STRUCTURAL_COUNTS.stylesheets &&
      actual.every(
        (entry, index) =>
          entry.path === expected[index].path &&
          entry.version === expected[index].version
      );

    return [
      makeCheck({
        category: "STYLESHEET_SEQUENCE",
        label: "exact stylesheet authority sequence",
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
        expected,
        actual
      })
    ];
  }

  function validateDependencies() {
    const scripts =
      Array.from(
        document.querySelectorAll(
          "script[src]"
        )
      );

    const observed =
      scripts.map((script, index) => ({
        index,
        path:
          normalizeResourcePath(
            script.src
          ),
        version:
          readResourceVersion(
            script.src
          ),
        defer:
          script.defer,
        async:
          script.async
      }));

    const checks = [];
    let priorIndex = -1;

    EXPECTED_DEPENDENCIES.forEach(
      (dependency) => {
        const matches =
          observed.filter(
            (script) =>
              script.path === dependency.src
          );

        if (matches.length !== 1) {
          checks.push(
            makeCheck({
              category: "DEPENDENCY",
              label: dependency.key,
              status: STATUS.FAIL,
              expected: {
                count: 1,
                path: dependency.src,
                version:
                  dependency.requiredVersion
              },
              actual: {
                count: matches.length,
                matches
              },
              detail:
                matches.length === 0
                  ? "required script missing"
                  : "required script duplicated"
            })
          );

          return;
        }

        const match = matches[0];

        const versionPasses =
          match.version ===
          dependency.requiredVersion;

        const orderPasses =
          match.index > priorIndex;

        const loadingPasses =
          match.defer === true &&
          match.async === false;

        checks.push(
          makeCheck({
            category: "DEPENDENCY",
            label: dependency.key,
            status:
              versionPasses &&
              orderPasses &&
              loadingPasses
                ? STATUS.PASS
                : STATUS.FAIL,
            expected: {
              path: dependency.src,
              version:
                dependency.requiredVersion,
              indexGreaterThan:
                priorIndex,
              defer: true,
              async: false
            },
            actual: match,
            detail:
              !versionPasses
                ? "version mismatch"
                : !orderPasses
                  ? "dependency order mismatch"
                  : !loadingPasses
                    ? "dependency loading mode mismatch"
                    : null
          })
        );

        priorIndex = match.index;
      }
    );

    FORBIDDEN_DEPENDENCIES.forEach(
      (path) => {
        const actual =
          observed.filter(
            (script) =>
              script.path === path
          ).length;

        checks.push(
          makeCheck({
            category:
              "FORBIDDEN_DEPENDENCY",
            label: path,
            status:
              actual === 0
                ? STATUS.PASS
                : STATUS.FAIL,
            expected: 0,
            actual
          })
        );
      }
    );

    return checks;
  }

  function validateExactDependencySequence() {
    const actual =
      Array.from(
        document.querySelectorAll(
          "script[src]"
        )
      ).map((script) => ({
        path:
          normalizeResourcePath(script.src),
        version:
          readResourceVersion(script.src),
        defer: script.defer,
        async: script.async
      }));

    const expected =
      EXPECTED_DEPENDENCIES.map((dependency) => ({
        path: dependency.src,
        version: dependency.requiredVersion,
        defer: true,
        async: false
      }));

    const passes =
      actual.length === expected.length &&
      actual.length === STRUCTURAL_COUNTS.runtimeScripts &&
      actual.every(
        (entry, index) =>
          entry.path === expected[index].path &&
          entry.version === expected[index].version &&
          entry.defer === expected[index].defer &&
          entry.async === expected[index].async
      );

    return [
      makeCheck({
        category: "DEPENDENCY_SEQUENCE",
        label: "exact runtime script sequence",
        status:
          passes
            ? STATUS.PASS
            : STATUS.FAIL,
        expected,
        actual
      })
    ];
  }

  function validateStaticCompleteness() {
    return FORBIDDEN_ASSEMBLY_MARKERS.map(
      (selector) => {
        const actual =
          document.querySelectorAll(selector).length;

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
      }
    );
  }

  function validateReceiptElementsRemainPassive() {
    return RECEIPT_ELEMENT_SELECTORS.map(
      (selector) => {
        const matches =
          document.querySelectorAll(selector);

        const node =
          matches.length === 1
            ? matches[0]
            : null;

        const hidden =
          node?.hasAttribute("hidden") ?? false;

        const empty =
          node
            ? node.textContent.trim() === ""
            : false;

        return makeCheck({
          category: "RECEIPT_ELEMENT",
          label: selector,
          status:
            matches.length === 1 &&
            hidden &&
            empty
              ? STATUS.PASS
              : STATUS.FAIL,
          expected: {
            count: 1,
            hidden: true,
            empty: true
          },
          actual: {
            count: matches.length,
            hidden,
            empty
          }
        });
      }
    );
  }

  function validateInformationFallbackLimitation() {
    const platform =
      document.querySelector("#platform-panel");

    const engineering =
      document.querySelector("#engineering-panel");

    const evidence =
      document.querySelector("#evidence-panel");

    const actual = {
      platformExists:
        Boolean(platform),
      platformHidden:
        platform?.hasAttribute("hidden") ?? null,

      engineeringExists:
        Boolean(engineering),
      engineeringHidden:
        engineering?.hasAttribute("hidden") ?? null,

      evidenceExists:
        Boolean(evidence),
      evidenceHidden:
        evidence?.hasAttribute("hidden") ?? null
    };

    const matchesKnownLimitation =
      actual.platformExists &&
      actual.platformHidden === false &&
      actual.engineeringExists &&
      actual.engineeringHidden === true &&
      actual.evidenceExists &&
      actual.evidenceHidden === true;

    return [
      makeCheck({
        category: "BOUNDED_LIMITATION",
        label:
          INFORMATION_FALLBACK_LIMITATION_ID,
        status:
          matchesKnownLimitation
            ? STATUS.PASS
            : STATUS.FAIL,
        expected: {
          platformVisible: true,
          engineeringInitiallyHidden: true,
          evidenceInitiallyHidden: true,
          constellationBlocking: false,
          manifestEligibilityBlocking: false,
          laterStaticFallbackReviewRequired: true
        },
        actual: {
          ...actual,
          matchesKnownLimitation
        },
        detail:
          "PASS means the document matches the declared limitation. It does not establish complete no-JavaScript access to all information panels."
      })
    ];
  }

  function buildConstellationLedger() {
    return {
      cardinalControls:
        STRUCTURAL_COUNTS.cardinalControls,
      cardinalClusters:
        STRUCTURAL_COUNTS.cardinalClusters,
      childControls:
        STRUCTURAL_COUNTS.childControls,
      localChildren:
        STRUCTURAL_COUNTS.localChildDestinations,
      portalChildren:
        STRUCTURAL_COUNTS.portalChildDestinations,
      primaryPortalChildren:
        STRUCTURAL_COUNTS.primaryPortalChildren,
      fallbackPortalControls:
        STRUCTURAL_COUNTS.fallbackPortalControls,
      totalPortalTriggers:
        STRUCTURAL_COUNTS
          .totalControllerMediatedPortalTriggers
    };
  }

  function buildAccessLedger() {
    return {
      primaryElaraAccessControls:
        STRUCTURAL_COUNTS
          .primaryElaraAccessControls,
      elaraFallbackMenuRepresentations:
        STRUCTURAL_COUNTS
          .elaraFallbackMenuRepresentations,
      totalElaraRouteRepresentations:
        STRUCTURAL_COUNTS
          .totalElaraRouteRepresentations,
      compassDialogTriggers:
        STRUCTURAL_COUNTS.compassDialogTriggers
    };
  }

  function buildReturnLedger() {
    return {
      model: RETURN_MODEL.model,

      sharedReturnZones:
        STRUCTURAL_COUNTS.sharedReturnZones,

      sharedReturnToOrbitControls:
        STRUCTURAL_COUNTS.sharedReturnToOrbitControls,

      sharedReturnToCompassControls:
        STRUCTURAL_COUNTS.sharedReturnToCompassControls,

      accessibleOrbitEscapeControls:
        STRUCTURAL_COUNTS.accessibleOrbitEscapeControls,

      repeatedLocalReturnBlocks:
        STRUCTURAL_COUNTS.repeatedLocalReturnBlocks,

      repeatedFrontNavigationBlocks:
        STRUCTURAL_COUNTS.repeatedFrontNavigationBlocks,

      footerCompassControls:
        STRUCTURAL_COUNTS.footerCompassControls,

      obsoleteDestinationOrbitControls:
        STRUCTURAL_COUNTS.obsoleteDestinationOrbitControls
    };
  }

  function buildResourceSurface() {
    return {
      stylesheets:
        STRUCTURAL_COUNTS.stylesheets,
      runtimeScripts:
        STRUCTURAL_COUNTS.runtimeScripts,
      fullCompassStylesheetAllowed: false,
      CompassGeometryDependencyAllowed: false,
      CompassRendererDependencyAllowed: false
    };
  }

  function buildReceipt(checks) {
    const failures =
      checks.filter(
        (check) =>
          check.status === STATUS.FAIL
      );

    const unevaluable =
      checks.filter(
        (check) =>
          check.status === STATUS.UNEVALUABLE
      );

    const passed =
      checks.filter(
        (check) =>
          check.status === STATUS.PASS
      );

    const overallStatus =
      failures.length > 0
        ? STATUS.FAIL
        : unevaluable.length > 0
          ? STATUS.UNEVALUABLE
          : STATUS.PASS;

    return deepFreeze({
      receiptId: RECEIPT_ID,
      receiptVersion: MANIFEST_VERSION,

      manifestId: MANIFEST_ID,
      manifestVersion: MANIFEST_VERSION,

      pageContract: PAGE_CONTRACT,
      pageVersion: PAGE_VERSION,

      validationMode:
        "READ_ONLY_NON_MUTATING",

      status: overallStatus,

      totals: {
        checks: checks.length,
        passed: passed.length,
        failed: failures.length,
        unevaluable: unevaluable.length
      },

      constellationLedger:
        buildConstellationLedger(),

      accessLedger:
        buildAccessLedger(),

      returnLedger:
        buildReturnLedger(),

      resourceSurface:
        buildResourceSurface(),

      boundaries: {
        domMutated: false,
        repairAttempted: false,
        navigationControlled: false,
        eventsIntercepted: false,
        eventListenersRegistered: false,
        runtimeSystemsInitialized: false,
        disclosureStateChanged: false,
        receiptElementsChanged: false
      },

      limitations: [
        {
          limitationId:
            INFORMATION_FALLBACK_LIMITATION_ID,
          status:
            "KNOWN_BOUNDED_STATIC_FALLBACK_LIMITATION",
          constellationBlocking: false,
          manifestEligibilityBlocking: false,
          laterStaticFallbackReviewRequired: true
        }
      ],

      failures:
        failures.map((check) => ({
          category: check.category,
          label: check.label,
          expected: check.expected,
          actual: check.actual,
          detail: check.detail
        })),

      unevaluable:
        unevaluable.map((check) => ({
          category: check.category,
          label: check.label,
          detail: check.detail
        })),

      checkedAt:
        new Date().toISOString()
    });
  }

  function buildUnevaluableReceipt(error) {
    return deepFreeze({
      receiptId: RECEIPT_ID,
      receiptVersion: MANIFEST_VERSION,

      manifestId: MANIFEST_ID,
      manifestVersion: MANIFEST_VERSION,

      pageContract: PAGE_CONTRACT,
      pageVersion: PAGE_VERSION,

      validationMode:
        "READ_ONLY_NON_MUTATING",

      status:
        STATUS.UNEVALUABLE,

      totals: {
        checks: 0,
        passed: 0,
        failed: 0,
        unevaluable: 1
      },

      constellationLedger:
        buildConstellationLedger(),

      accessLedger:
        buildAccessLedger(),

      returnLedger:
        buildReturnLedger(),

      resourceSurface:
        buildResourceSurface(),

      boundaries: {
        domMutated: false,
        repairAttempted: false,
        navigationControlled: false,
        eventsIntercepted: false,
        eventListenersRegistered: false,
        runtimeSystemsInitialized: false,
        disclosureStateChanged: false,
        receiptElementsChanged: false
      },

      limitations: [
        {
          limitationId:
            INFORMATION_FALLBACK_LIMITATION_ID,
          status: "NOT_EVALUATED",
          constellationBlocking: false,
          manifestEligibilityBlocking: false,
          laterStaticFallbackReviewRequired: true
        }
      ],

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

      checkedAt:
        new Date().toISOString()
    });
  }

  function validate() {
    const checks = [
      ...validatePageAttributes(),
      ...validateShowroomRootState(),
      ...validateMetaContracts(),

      ...validateUniqueSelectors(),
      ...validateSelectorCounts(),

      ...validateCardinalLedger(),
      ...validateLocalChildLedger(),
      ...validateSharedReturnZone(),
      ...validatePortalChildLedger(),
      ...validateFallbackPortalLedger(),
      ...validateGlobalPortalSurface(),

      ...validatePrimaryElaraAccess(),
      ...validateElaraAssetBoundary(),

      ...validateRouteContinuation(),

      ...validateCompassTriggers(),
      ...validateCompassNavigationContracts(),
      ...validateCompassVisualBoundary(),

      ...validateNativeDisclosures(),
      ...validateRelationships(),

      ...validateGaugeIds(),
      ...validateGaugeRelationships(),

      ...validateDiamondGeometry(),
      ...validateCompositionSemantics(),

      ...validateStylesheets(),
      ...validateExactStylesheetSequence(),

      ...validateDependencies(),
      ...validateExactDependencySequence(),

      ...validateStaticCompleteness(),
      ...validateReceiptElementsRemainPassive(),

      ...validateInformationFallbackLimitation()
    ];

    return buildReceipt(checks);
  }

  function publishImmutableGlobal(name, value) {
    if (
      Object.prototype.hasOwnProperty.call(
        globalThis,
        name
      )
    ) {
      throw new Error(
        `Immutable global already exists: ${name}`
      );
    }

    Object.defineProperty(
      globalThis,
      name,
      {
        value,
        enumerable: true,
        configurable: false,
        writable: false
      }
    );
  }

  function run() {
    let receipt;

    try {
      receipt = validate();
    } catch (error) {
      receipt =
        buildUnevaluableReceipt(error);
    }

    try {
      publishImmutableGlobal(
        GLOBAL_MANIFEST_SYMBOL,
        MANIFEST
      );

      publishImmutableGlobal(
        GLOBAL_RECEIPT_SYMBOL,
        receipt
      );
    } catch (error) {
      if (
        typeof console !== "undefined" &&
        typeof console.warn === "function"
      ) {
        console.warn(
          `[${MANIFEST_ID}] Immutable publication failed.`,
          error
        );
      }

      return;
    }

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

  run();
})();
