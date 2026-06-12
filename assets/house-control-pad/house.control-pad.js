// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_IMMERSIVE_CARDINAL_ESTATE_AVATAR_LIFE_JS_TNT_v5
// Full-file replacement.
//
// Governing design:
// HOUSE_CONTROL_PAD_IMMERSIVE_CARDINAL_ESTATE_STRATEGIC_LOGIC_FINAL_DRAFT_v5
//
// Purpose:
// - Preserve the House as a cardinally organized estate floor plan.
// - Open in a full-estate overview.
// - Zoom into a selected room before route entry.
// - Reveal room-integrated context and explicit actions.
// - Preserve room-first authority.
// - Route guides through declared corridors.
// - Preserve guide locations during the open controller session.
// - Give Jeeves, Auren, Soren, and Elara independent life behavior.
// - Schedule independent blinking, glances, gestures, stretches, and rare yawns.
// - Respect reduced-motion preferences.
// - Prevent stale camera, travel, blink, and gesture callbacks.
// - Preserve existing public API while adding v5 view and life controls.
//
// Required companion:
// /assets/house-control-pad/house.control-pad.css
//
// Canonical names:
// - Jeeves
// - Auren
// - Soren
// - Elara
//
// Primary public API:
// window.HOUSE_CONTROL_PAD.open({ room: "book-chamber" })
// window.HOUSE_CONTROL_PAD.close()
// window.HOUSE_CONTROL_PAD.travelToRoom("product-gallery")
// window.HOUSE_CONTROL_PAD.enterRoomView("book-chamber")
// window.HOUSE_CONTROL_PAD.returnToEstate()
// window.HOUSE_CONTROL_PAD.focusRoom("book-chamber")
// window.HOUSE_CONTROL_PAD.registerRoom({...})
// window.HOUSE_CONTROL_PAD.registerAgent({...})
// window.HOUSE_CONTROL_PAD.getRouteGraph()
// window.HOUSE_CONTROL_PAD.getAgentLocation("auren")
// window.HOUSE_CONTROL_PAD.resetAgentLocations()
// window.HOUSE_CONTROL_PAD.getEstateState()
// window.HOUSE_CONTROL_PAD.getViewMode()
// window.HOUSE_CONTROL_PAD.getAvatarLifeState("elara")
// window.HOUSE_CONTROL_PAD.pauseAvatarLife()
// window.HOUSE_CONTROL_PAD.resumeAvatarLife()
// window.HOUSE_CONTROL_PAD.recordInteraction()
//
// Final governing law:
// The cardinal law determines placement.
// The estate architecture determines meaning.
// The camera determines context.
// The room determines authority.
// The corridor determines travel.
// The guide provides presence.
// The room information provides clarity.
// The visitor determines entry.
// The House remains alive without becoming noisy.
//

(function houseControlPadImmersiveEstateAvatarLife() {
  "use strict";

  var CONTRACT =
    "HOUSE_CONTROL_PAD_IMMERSIVE_CARDINAL_ESTATE_AVATAR_LIFE_JS_TNT_v5";

  var DEFAULT_ROOM_ID = "house-core";

  var VIEW_MODE = {
    ESTATE: "estate",
    ROOM: "room"
  };

  var AVATAR_STATE_PRIORITY = {
    resting: 10,
    blinking: 20,
    glancing: 30,
    sleepy: 40,
    gesturing: 50,
    focused: 60,
    speaking: 70,
    arriving: 80,
    traveling: 90,
    disabled: 100
  };

  var IDLE_STAGE = {
    ACTIVE: "active",
    SETTLED: "settled",
    IDLE: "idle",
    LONG_IDLE: "long-idle"
  };

  var TIMING = {
    CAMERA_MS: 620,
    CAMERA_SETTLE_MS: 90,
    TRAVEL_SEGMENT_MS: 250,
    TRAVEL_SETTLE_MS: 130,
    ARRIVAL_HOLD_MS: 560,
    LIFE_EVALUATION_MS: 3000,
    INTERACTION_THROTTLE_MS: 300,
    LARGE_GESTURE_MIN_GAP_MS: 18000,
    BLINK_SINGLE_MS: 150,
    BLINK_DOUBLE_GAP_MS: 110,
    BLINK_SLOW_MS: 340
  };

  var HOME_AGENT_LOCATIONS = {
    jeeves: "house-core",
    auren: "product-gallery",
    soren: "diagnostic-room",
    elara: "human-threshold"
  };

  var STATE = {
    initialized: false,
    isOpen: false,
    isAnimating: false,
    reducedMotion: false,

    viewMode: VIEW_MODE.ESTATE,
    zoomLevel: 1,
    focusedRoom: null,
    previousFocusedRoom: null,
    currentPageRoom: DEFAULT_ROOM_ID,
    selectedRoom: null,
    selectedAgent: null,

    cameraTransitioning: false,
    cameraToken: 0,
    travelToken: 0,
    renderToken: 0,

    activePath: [],
    cameraTimers: [],
    travelTimers: [],
    lifeTimers: [],

    root: null,
    overlay: null,
    panel: null,
    header: null,
    estateViewport: null,
    estateStage: null,
    estateCanvas: null,
    roomLayer: null,
    routeLayer: null,
    avatarLayer: null,
    arrivalSheet: null,
    returnButton: null,
    status: null,
    previousFocus: null,

    lastInteractionAt: Date.now(),
    lastInteractionRecordedAt: 0,
    idleStage: IDLE_STAGE.ACTIVE,
    activeLargeGestureAgent: null,
    lastLargeGestureAt: 0,
    lifeEnabled: true,

    agentLocations: clone(HOME_AGENT_LOCATIONS),
    avatarRuntime: {}
  };

  var ROOMS = {
    "guide-foyer": {
      id: "guide-foyer",
      label: "Guide Foyer",
      shortLabel: "Guide Foyer",
      categoryLabel: "Orientation",
      type: "orientation",
      route: "/site-guide/",
      authority: "jeeves",

      cardinalSector: "north",
      estateWing: "north",
      rank: "small",
      architecturalShape: "formal-foyer",

      x: 31,
      y: 3,
      width: 38,
      height: 13,

      labelZone: { x: 7, y: 8, width: 52, height: 24 },
      summaryZone: { x: 7, y: 37, width: 53, height: 34 },
      detailZone: { x: 7, y: 24, width: 57, height: 56 },
      portraitZone: { x: 69, y: 26, width: 24, height: 62 },
      actionZone: { x: 7, y: 77, width: 85, height: 18 },

      architecturalFeatureZones: [
        { type: "entry-seal", x: 44, y: 66, width: 12, height: 20 },
        { type: "double-door", x: 42, y: 86, width: 16, height: 12 }
      ],

      summary:
        "Begin here for orientation, routes, rooms, and House guidance.",

      detail:
        "The Guide Foyer is the formal threshold of the estate. It introduces the House, explains how rooms relate, and helps visitors choose a route without requiring prior knowledge of the guides.",

      visitorCan: [
        "Understand the House",
        "Choose a destination",
        "Ask Jeeves for orientation"
      ],

      relatedRooms: [
        "house-core",
        "human-threshold"
      ],

      cameraFocus: {
        scale: 1.9,
        offsetX: 0,
        offsetY: 5,
        preserveCorridor: true,
        preserveDoor: "north-entry-corridor",
        framingPadding: 12,
        portraitScale: 1.65
      },

      roomBehavior: {
        idleAnchor: "portrait",
        glanceTargets: [
          "north-entry-corridor",
          "northwest-wing-corridor",
          "northeast-wing-corridor"
        ],
        arrivalGesture: "formal-welcome",
        ambientFeature: "entry-seal"
      },

      corridorAccess: [
        "north-entry-corridor",
        "northwest-wing-corridor",
        "northeast-wing-corridor"
      ],

      visible: true
    },

    "human-threshold": {
      id: "human-threshold",
      label: "Human Threshold",
      shortLabel: "Human Threshold",
      categoryLabel: "Human Origin",
      type: "human",
      route: "/meet-sean-mansfield/",
      authority: "elara",

      cardinalSector: "northwest",
      estateWing: "west",
      rank: "medium",
      architecturalShape: "angled-threshold",

      x: 3,
      y: 3,
      width: 25,
      height: 22,

      labelZone: { x: 7, y: 7, width: 58, height: 22 },
      summaryZone: { x: 7, y: 33, width: 53, height: 38 },
      detailZone: { x: 7, y: 23, width: 55, height: 55 },
      portraitZone: { x: 62, y: 40, width: 30, height: 50 },
      actionZone: { x: 7, y: 80, width: 85, height: 14 },

      architecturalFeatureZones: [
        { type: "angled-wall", x: 0, y: 0, width: 24, height: 100 },
        { type: "threshold-light", x: 36, y: 68, width: 18, height: 18 }
      ],

      summary:
        "Meet Sean and enter the human origin of the House.",

      detail:
        "The Human Threshold introduces Sean, the voice behind the estate, and the lived experiences that shaped its architecture. Elara guides the transition from the person into the larger House.",

      visitorCan: [
        "Meet Sean",
        "Understand the origin",
        "Talk to Elara"
      ],

      relatedRooms: [
        "guide-foyer",
        "book-chamber"
      ],

      cameraFocus: {
        scale: 1.68,
        offsetX: 7,
        offsetY: 7,
        preserveCorridor: true,
        preserveDoor: "northwest-wing-corridor",
        framingPadding: 13,
        portraitScale: 1.7
      },

      roomBehavior: {
        idleAnchor: "threshold-light",
        glanceTargets: [
          "guide-foyer",
          "west-main-corridor"
        ],
        arrivalGesture: "signal-greeting",
        ambientFeature: "threshold-light"
      },

      corridorAccess: [
        "northwest-wing-corridor",
        "west-main-corridor"
      ],

      visible: true
    },

    "lab": {
      id: "lab",
      label: "The Lab",
      shortLabel: "The Lab",
      categoryLabel: "Proof and Testing",
      type: "proof",
      route: "/gauges/",
      authority: "jeeves",

      cardinalSector: "northwest",
      estateWing: "west",
      rank: "small",
      architecturalShape: "technical-annex",

      x: 3,
      y: 28,
      width: 12,
      height: 16,

      labelZone: { x: 8, y: 8, width: 78, height: 22 },
      summaryZone: { x: 8, y: 34, width: 78, height: 42 },
      detailZone: { x: 8, y: 23, width: 82, height: 55 },
      portraitZone: { x: 45, y: 48, width: 47, height: 44 },
      actionZone: { x: 8, y: 79, width: 84, height: 16 },

      architecturalFeatureZones: [
        { type: "instrument-bay", x: 5, y: 45, width: 30, height: 42 },
        { type: "gauge-bank", x: 7, y: 15, width: 82, height: 18 }
      ],

      summary:
        "Inspect gauges, proof surfaces, and technical testing systems.",

      detail:
        "The Lab contains the House’s instrumentation, gauges, and proof surfaces. It is where visible behavior can be tested against runtime truth and where technical claims can be inspected.",

      visitorCan: [
        "Open the gauges",
        "Inspect proof surfaces",
        "Ask Jeeves about testing"
      ],

      relatedRooms: [
        "house-core",
        "law-library"
      ],

      cameraFocus: {
        scale: 2.3,
        offsetX: 11,
        offsetY: 1,
        preserveCorridor: true,
        preserveDoor: "west-main-corridor",
        framingPadding: 11,
        portraitScale: 1.85
      },

      roomBehavior: {
        idleAnchor: "gauge-bank",
        glanceTargets: [
          "instrument-bay",
          "west-main-corridor"
        ],
        arrivalGesture: "instrument-check",
        ambientFeature: "gauge-pulse"
      },

      corridorAccess: [
        "northwest-wing-corridor",
        "west-main-corridor"
      ],

      visible: true
    },

    "book-chamber": {
      id: "book-chamber",
      label: "Book Chamber",
      shortLabel: "Book Chamber",
      categoryLabel: "Narrative and Love",
      type: "book",
      route: "/nine-summits-of-love/",
      authority: "elara",

      cardinalSector: "northeast",
      estateWing: "east",
      rank: "medium",
      architecturalShape: "book-apse",

      x: 72,
      y: 3,
      width: 25,
      height: 22,

      labelZone: { x: 7, y: 7, width: 57, height: 22 },
      summaryZone: { x: 7, y: 33, width: 53, height: 38 },
      detailZone: { x: 7, y: 23, width: 56, height: 55 },
      portraitZone: { x: 61, y: 40, width: 31, height: 50 },
      actionZone: { x: 7, y: 80, width: 85, height: 14 },

      architecturalFeatureZones: [
        { type: "reading-apse", x: 63, y: 2, width: 34, height: 38 },
        { type: "book-wall", x: 4, y: 52, width: 18, height: 38 },
        { type: "reading-table", x: 31, y: 58, width: 24, height: 20 }
      ],

      summary:
        "Enter the Nine Summits and the architecture of Love.",

      detail:
        "The Book Chamber opens the Nine Summits of Love as a structured climb through human potential, fragmentation, coherence, and Love. Elara serves as the room’s signal bearer and narrative guide.",

      visitorCan: [
        "Enter the Nine Summits",
        "Understand the 256-carats structure",
        "Meet Elara"
      ],

      relatedRooms: [
        "human-threshold",
        "portrait-hall"
      ],

      cameraFocus: {
        scale: 1.72,
        offsetX: -7,
        offsetY: 7,
        preserveCorridor: true,
        preserveDoor: "northeast-wing-corridor",
        framingPadding: 13,
        portraitScale: 1.78
      },

      roomBehavior: {
        idleAnchor: "reading-table",
        glanceTargets: [
          "reading-apse",
          "book-wall"
        ],
        arrivalGesture: "signal-illumination",
        ambientFeature: "page-light"
      },

      corridorAccess: [
        "northeast-wing-corridor",
        "east-main-corridor"
      ],

      visible: true
    },

    "law-library": {
      id: "law-library",
      label: "Law Library",
      shortLabel: "Law Library",
      categoryLabel: "Governance",
      type: "law",
      route: "/laws/",
      authority: "jeeves",

      cardinalSector: "northeast",
      estateWing: "east",
      rank: "small",
      architecturalShape: "archive-aisle",

      x: 85,
      y: 28,
      width: 12,
      height: 16,

      labelZone: { x: 8, y: 8, width: 80, height: 22 },
      summaryZone: { x: 8, y: 34, width: 80, height: 42 },
      detailZone: { x: 8, y: 23, width: 82, height: 55 },
      portraitZone: { x: 43, y: 48, width: 49, height: 44 },
      actionZone: { x: 8, y: 79, width: 84, height: 16 },

      architecturalFeatureZones: [
        { type: "archive-aisle", x: 41, y: 17, width: 18, height: 60 },
        { type: "shelf-left", x: 5, y: 18, width: 28, height: 62 },
        { type: "shelf-right", x: 67, y: 18, width: 28, height: 62 }
      ],

      summary:
        "Enter the formal archive of laws, governance, and canonical structure.",

      detail:
        "The Law Library gathers governance language, formal laws, canonical bindings, and proof-oriented structure. Jeeves provides orientation between the formal archive and the rest of the estate.",

      visitorCan: [
        "Open the laws",
        "Inspect canonical structure",
        "Ask Jeeves for context"
      ],

      relatedRooms: [
        "lab",
        "house-core"
      ],

      cameraFocus: {
        scale: 2.25,
        offsetX: -12,
        offsetY: 1,
        preserveCorridor: true,
        preserveDoor: "east-main-corridor",
        framingPadding: 11,
        portraitScale: 1.85
      },

      roomBehavior: {
        idleAnchor: "archive-aisle",
        glanceTargets: [
          "shelf-left",
          "shelf-right"
        ],
        arrivalGesture: "formal-reference",
        ambientFeature: "archive-glow"
      },

      corridorAccess: [
        "northeast-wing-corridor",
        "east-main-corridor"
      ],

      visible: true
    },

    "showroom": {
      id: "showroom",
      label: "Showroom / Atrium",
      shortLabel: "Showroom",
      categoryLabel: "Visible Proof",
      type: "showroom",
      route: "/showroom/",
      authority: "jeeves",

      cardinalSector: "west",
      estateWing: "west",
      rank: "grand",
      architecturalShape: "bowed-atrium",

      x: 3,
      y: 47,
      width: 25,
      height: 27,

      labelZone: { x: 7, y: 7, width: 56, height: 20 },
      summaryZone: { x: 7, y: 31, width: 52, height: 34 },
      detailZone: { x: 7, y: 22, width: 54, height: 54 },
      portraitZone: { x: 60, y: 42, width: 32, height: 50 },
      actionZone: { x: 7, y: 79, width: 85, height: 15 },

      architecturalFeatureZones: [
        { type: "exhibit-bay", x: 7, y: 46, width: 20, height: 28 },
        { type: "exhibit-bay", x: 31, y: 46, width: 20, height: 28 },
        { type: "bowed-wall", x: 0, y: 7, width: 22, height: 86 }
      ],

      summary:
        "Explore public proof, visible systems, worlds, and working demonstrations.",

      detail:
        "The Showroom is the public atrium of the House. It presents visible proof objects, worlds, interfaces, and working systems before visitors move into more specialized rooms.",

      visitorCan: [
        "Enter the Showroom",
        "Inspect visible systems",
        "Ask Jeeves for orientation"
      ],

      relatedRooms: [
        "atlas-study",
        "house-core"
      ],

      cameraFocus: {
        scale: 1.45,
        offsetX: 8,
        offsetY: 0,
        preserveCorridor: true,
        preserveDoor: "west-main-corridor",
        framingPadding: 14,
        portraitScale: 1.62
      },

      roomBehavior: {
        idleAnchor: "exhibit-bay",
        glanceTargets: [
          "atlas-study",
          "house-core"
        ],
        arrivalGesture: "atrium-present",
        ambientFeature: "exhibit-pulse"
      },

      corridorAccess: [
        "west-main-corridor",
        "core-crossing",
        "southwest-corridor"
      ],

      visible: true
    },

    "house-core": {
      id: "house-core",
      label: "House Core / Great Hall",
      shortLabel: "House Core",
      categoryLabel: "Central Orientation",
      type: "orientation",
      route: "/",
      authority: "jeeves",

      cardinalSector: "center",
      estateWing: "central",
      rank: "grand",
      architecturalShape: "great-hall",

      x: 31,
      y: 22,
      width: 38,
      height: 49,

      labelZone: { x: 7, y: 6, width: 55, height: 18 },
      summaryZone: { x: 7, y: 28, width: 48, height: 28 },
      detailZone: { x: 7, y: 22, width: 51, height: 48 },
      portraitZone: { x: 61, y: 39, width: 30, height: 45 },
      actionZone: { x: 7, y: 78, width: 85, height: 14 },

      architecturalFeatureZones: [
        { type: "central-seal", x: 36, y: 37, width: 28, height: 28 },
        { type: "north-crossing", x: 42, y: 0, width: 16, height: 21 },
        { type: "south-crossing", x: 42, y: 79, width: 16, height: 21 },
        { type: "west-crossing", x: 0, y: 42, width: 21, height: 16 },
        { type: "east-crossing", x: 79, y: 42, width: 21, height: 16 }
      ],

      summary:
        "Orient within the estate and understand how every room connects.",

      detail:
        "The House Core is the central Great Hall and circulation exchange. It explains the relationship between rooms, preserves whole-estate orientation, and provides the primary home position for Jeeves.",

      visitorCan: [
        "Understand the estate",
        "Choose a connected room",
        "Ask Jeeves for guidance"
      ],

      relatedRooms: [
        "guide-foyer",
        "portrait-hall"
      ],

      cameraFocus: {
        scale: 1.35,
        offsetX: 0,
        offsetY: 0,
        preserveCorridor: true,
        preserveDoor: "core-crossing",
        framingPadding: 15,
        portraitScale: 1.6
      },

      roomBehavior: {
        idleAnchor: "central-seal",
        glanceTargets: [
          "north-entry-corridor",
          "west-main-corridor",
          "east-main-corridor",
          "south-gallery-corridor"
        ],
        arrivalGesture: "formal-center",
        ambientFeature: "central-seal"
      },

      corridorAccess: [
        "north-entry-corridor",
        "west-main-corridor",
        "east-main-corridor",
        "core-crossing",
        "south-gallery-corridor"
      ],

      visible: true
    },

    "product-gallery": {
      id: "product-gallery",
      label: "Product Gallery",
      shortLabel: "Product Gallery",
      categoryLabel: "Applied Systems",
      type: "product",
      route: "/products/",
      authority: "auren",

      cardinalSector: "east",
      estateWing: "east",
      rank: "grand",
      architecturalShape: "workshop-gallery",

      x: 72,
      y: 47,
      width: 25,
      height: 27,

      labelZone: { x: 7, y: 7, width: 56, height: 20 },
      summaryZone: { x: 7, y: 31, width: 51, height: 34 },
      detailZone: { x: 7, y: 22, width: 53, height: 54 },
      portraitZone: { x: 60, y: 42, width: 32, height: 50 },
      actionZone: { x: 7, y: 79, width: 85, height: 15 },

      architecturalFeatureZones: [
        { type: "display-bay", x: 5, y: 47, width: 19, height: 27 },
        { type: "workbench", x: 29, y: 50, width: 25, height: 20 },
        { type: "service-wall", x: 78, y: 5, width: 17, height: 84 }
      ],

      summary:
        "Explore products, practical tools, and applied systems.",

      detail:
        "The Product Gallery is a workshop-gallery hybrid where practical tools, public products, and applied systems are presented. Auren guides visitors from concept toward usable value.",

      visitorCan: [
        "Browse products",
        "Inspect practical systems",
        "Talk to Auren"
      ],

      relatedRooms: [
        "education-room",
        "frontier-workshop"
      ],

      cameraFocus: {
        scale: 1.45,
        offsetX: -8,
        offsetY: 0,
        preserveCorridor: true,
        preserveDoor: "east-main-corridor",
        framingPadding: 14,
        portraitScale: 1.72
      },

      roomBehavior: {
        idleAnchor: "workbench",
        glanceTargets: [
          "education-room",
          "frontier-workshop",
          "display-bay"
        ],
        arrivalGesture: "tool-ready",
        ambientFeature: "workbench-light"
      },

      corridorAccess: [
        "east-main-corridor",
        "core-crossing",
        "southeast-corridor"
      ],

      visible: true
    },

    "atlas-study": {
      id: "atlas-study",
      label: "Atlas Study",
      shortLabel: "Atlas Study",
      categoryLabel: "World Navigation",
      type: "world",
      route: "/showroom/globe/",
      authority: "jeeves",

      cardinalSector: "southwest",
      estateWing: "west",
      rank: "medium",
      architecturalShape: "round-study",

      x: 3,
      y: 77,
      width: 25,
      height: 12,

      labelZone: { x: 7, y: 8, width: 56, height: 25 },
      summaryZone: { x: 7, y: 38, width: 56, height: 39 },
      detailZone: { x: 7, y: 21, width: 55, height: 58 },
      portraitZone: { x: 64, y: 20, width: 28, height: 70 },
      actionZone: { x: 7, y: 79, width: 85, height: 16 },

      architecturalFeatureZones: [
        { type: "atlas-table", x: 33, y: 34, width: 28, height: 36 },
        { type: "radial-floor", x: 6, y: 7, width: 86, height: 86 }
      ],

      summary:
        "Study worlds, planets, maps, and the routes between them.",

      detail:
        "The Atlas Study gathers the House’s worlds, globes, planets, and navigational lanes. Its circular structure emphasizes orientation, scale, and movement across larger systems.",

      visitorCan: [
        "Open the Atlas",
        "Explore the worlds",
        "Ask Jeeves for context"
      ],

      relatedRooms: [
        "showroom",
        "hearth-room"
      ],

      cameraFocus: {
        scale: 1.95,
        offsetX: 9,
        offsetY: -7,
        preserveCorridor: true,
        preserveDoor: "southwest-corridor",
        framingPadding: 12,
        portraitScale: 1.75
      },

      roomBehavior: {
        idleAnchor: "atlas-table",
        glanceTargets: [
          "hearth-room",
          "showroom"
        ],
        arrivalGesture: "map-reference",
        ambientFeature: "radial-floor"
      },

      corridorAccess: [
        "southwest-corridor",
        "south-gallery-corridor"
      ],

      visible: true
    },

    "hearth-room": {
      id: "hearth-room",
      label: "Hearth Room",
      shortLabel: "Hearth Room",
      categoryLabel: "World and Home",
      type: "world",
      route: "/showroom/globe/hearth/",
      authority: "jeeves",

      cardinalSector: "southwest",
      estateWing: "west",
      rank: "small",
      architecturalShape: "rounded-hearth",

      x: 3,
      y: 91,
      width: 25,
      height: 7,

      labelZone: { x: 7, y: 13, width: 55, height: 34 },
      summaryZone: { x: 7, y: 50, width: 55, height: 38 },
      detailZone: { x: 7, y: 21, width: 54, height: 58 },
      portraitZone: { x: 69, y: 8, width: 24, height: 84 },
      actionZone: { x: 7, y: 77, width: 85, height: 18 },

      architecturalFeatureZones: [
        { type: "hearth-fire", x: 35, y: 24, width: 24, height: 45 },
        { type: "rounded-wall", x: 0, y: 0, width: 100, height: 100 }
      ],

      summary:
        "Enter Hearth as a world, a home, and a living planetary lane.",

      detail:
        "The Hearth Room is an intimate planetary chamber centered on continuity, home, and world presence. Its architecture is protective, rounded, and deliberately quieter than the public rooms.",

      visitorCan: [
        "Enter Hearth",
        "Inspect the planet",
        "Ask Jeeves about the world"
      ],

      relatedRooms: [
        "atlas-study",
        "house-core"
      ],

      cameraFocus: {
        scale: 2.28,
        offsetX: 10,
        offsetY: -11,
        preserveCorridor: true,
        preserveDoor: "southwest-corridor",
        framingPadding: 10,
        portraitScale: 1.9
      },

      roomBehavior: {
        idleAnchor: "hearth-fire",
        glanceTargets: [
          "atlas-study",
          "hearth-fire"
        ],
        arrivalGesture: "hearth-settle",
        ambientFeature: "hearth-fire"
      },

      corridorAccess: [
        "southwest-corridor"
      ],

      visible: true
    },

    "portrait-hall": {
      id: "portrait-hall",
      label: "Portrait Hall",
      shortLabel: "Portrait Hall",
      categoryLabel: "Characters",
      type: "future-character",
      route: "/characters/",
      authority: "jeeves",

      cardinalSector: "south",
      estateWing: "south",
      rank: "grand",
      architecturalShape: "portrait-gallery",

      x: 31,
      y: 74,
      width: 38,
      height: 24,

      labelZone: { x: 7, y: 7, width: 54, height: 20 },
      summaryZone: { x: 7, y: 31, width: 51, height: 34 },
      detailZone: { x: 7, y: 22, width: 54, height: 54 },
      portraitZone: { x: 61, y: 42, width: 30, height: 50 },
      actionZone: { x: 7, y: 79, width: 85, height: 15 },

      architecturalFeatureZones: [
        { type: "portrait-niche", x: 5, y: 42, width: 14, height: 35 },
        { type: "portrait-niche", x: 22, y: 42, width: 14, height: 35 },
        { type: "portrait-niche", x: 39, y: 42, width: 14, height: 35 },
        { type: "portrait-niche", x: 56, y: 42, width: 14, height: 35 }
      ],

      summary:
        "Explore identities, characters, and future person-first routes.",

      detail:
        "Portrait Hall is the estate’s character gallery and future person-first routing chamber. It preserves identities as residents of the House without replacing room-first authority.",

      visitorCan: [
        "Open the characters",
        "Inspect identities",
        "Return to House orientation"
      ],

      relatedRooms: [
        "house-core",
        "book-chamber"
      ],

      cameraFocus: {
        scale: 1.5,
        offsetX: 0,
        offsetY: -8,
        preserveCorridor: true,
        preserveDoor: "south-gallery-corridor",
        framingPadding: 14,
        portraitScale: 1.68
      },

      roomBehavior: {
        idleAnchor: "portrait-niche",
        glanceTargets: [
          "house-core",
          "book-chamber"
        ],
        arrivalGesture: "gallery-present",
        ambientFeature: "portrait-light"
      },

      corridorAccess: [
        "south-gallery-corridor",
        "southwest-corridor",
        "southeast-corridor"
      ],

      visible: true
    },

    "education-room": {
      id: "education-room",
      label: "Education Room",
      shortLabel: "Education",
      categoryLabel: "Learning Systems",
      type: "product",
      route: "/products/education/",
      authority: "auren",

      cardinalSector: "east",
      estateWing: "east",
      rank: "medium",
      architecturalShape: "tiered-classroom",

      x: 72,
      y: 77,
      width: 25,
      height: 10,

      labelZone: { x: 7, y: 8, width: 55, height: 25 },
      summaryZone: { x: 7, y: 39, width: 54, height: 38 },
      detailZone: { x: 7, y: 21, width: 54, height: 58 },
      portraitZone: { x: 65, y: 17, width: 27, height: 74 },
      actionZone: { x: 7, y: 79, width: 85, height: 16 },

      architecturalFeatureZones: [
        { type: "teaching-wall", x: 7, y: 18, width: 52, height: 18 },
        { type: "tier", x: 9, y: 48, width: 46, height: 9 },
        { type: "tier", x: 9, y: 61, width: 46, height: 9 }
      ],

      summary:
        "Enter practical learning systems and 1,001 Traversal.",

      detail:
        "The Education Room organizes practical learning, structured exploration, and 1,001 Traversal. Auren connects educational ideas to usable tools and applied systems.",

      visitorCan: [
        "Open Education",
        "Explore 1,001 Traversal",
        "Talk to Auren"
      ],

      relatedRooms: [
        "product-gallery",
        "frontier-workshop"
      ],

      cameraFocus: {
        scale: 2.02,
        offsetX: -9,
        offsetY: -7,
        preserveCorridor: true,
        preserveDoor: "southeast-corridor",
        framingPadding: 11,
        portraitScale: 1.86
      },

      roomBehavior: {
        idleAnchor: "teaching-wall",
        glanceTargets: [
          "product-gallery",
          "teaching-wall"
        ],
        arrivalGesture: "teaching-ready",
        ambientFeature: "teaching-wall"
      },

      corridorAccess: [
        "southeast-corridor",
        "south-gallery-corridor"
      ],

      visible: true
    },

    "diagnostic-room": {
      id: "diagnostic-room",
      label: "Diagnostic Room",
      shortLabel: "Diagnostic",
      categoryLabel: "Coherence Orientation",
      type: "diagnostic",
      route: "/coherence-diagnostic/",
      authority: "soren",

      cardinalSector: "southeast",
      estateWing: "east",
      rank: "medium",
      architecturalShape: "hex-diagnostic",

      x: 72,
      y: 89,
      width: 14,
      height: 9,

      labelZone: { x: 7, y: 10, width: 78, height: 30 },
      summaryZone: { x: 7, y: 47, width: 78, height: 38 },
      detailZone: { x: 7, y: 24, width: 78, height: 55 },
      portraitZone: { x: 51, y: 43, width: 41, height: 49 },
      actionZone: { x: 7, y: 79, width: 85, height: 16 },

      architecturalFeatureZones: [
        { type: "diagnostic-seal", x: 24, y: 35, width: 30, height: 38 },
        { type: "controlled-entry", x: 0, y: 39, width: 16, height: 22 }
      ],

      summary:
        "Approach coherence diagnostics through a controlled orientation boundary.",

      detail:
        "The Diagnostic Room provides orientation to coherence tools and assessment boundaries. Soren explains the diagnostic route without replacing the formal diagnostic instrument or assigning a visitor’s archetype.",

      visitorCan: [
        "Open the diagnostic",
        "Understand the boundary",
        "Talk to Soren"
      ],

      relatedRooms: [
        "house-core",
        "frontier-workshop"
      ],

      cameraFocus: {
        scale: 2.38,
        offsetX: -10,
        offsetY: -11,
        preserveCorridor: true,
        preserveDoor: "southeast-corridor",
        framingPadding: 10,
        portraitScale: 1.95
      },

      roomBehavior: {
        idleAnchor: "diagnostic-seal",
        glanceTargets: [
          "diagnostic-seal",
          "controlled-entry"
        ],
        arrivalGesture: "diagnostic-attend",
        ambientFeature: "diagnostic-seal"
      },

      corridorAccess: [
        "southeast-corridor",
        "frontier-threshold"
      ],

      visible: true
    },

    "frontier-workshop": {
      id: "frontier-workshop",
      label: "Frontier Workshop",
      shortLabel: "Frontier",
      categoryLabel: "Future Development",
      type: "frontier",
      route: "/explore/frontier/",
      authority: "auren",

      cardinalSector: "southeast",
      estateWing: "east",
      rank: "small",
      architecturalShape: "frontier-wedge",

      x: 88,
      y: 89,
      width: 9,
      height: 9,

      labelZone: { x: 8, y: 9, width: 84, height: 30 },
      summaryZone: { x: 8, y: 46, width: 84, height: 40 },
      detailZone: { x: 8, y: 23, width: 84, height: 57 },
      portraitZone: { x: 46, y: 44, width: 46, height: 48 },
      actionZone: { x: 8, y: 79, width: 84, height: 16 },

      architecturalFeatureZones: [
        { type: "future-bay", x: 54, y: 5, width: 42, height: 42 },
        { type: "workbench", x: 9, y: 51, width: 39, height: 24 }
      ],

      summary:
        "Enter experimental systems, unresolved work, and future development.",

      detail:
        "The Frontier Workshop is the outward-facing development edge of the estate. It contains experimental systems, unresolved work, and future-facing applied ideas guided by Auren.",

      visitorCan: [
        "Open the frontier",
        "Inspect experimental work",
        "Talk to Auren"
      ],

      relatedRooms: [
        "product-gallery",
        "diagnostic-room"
      ],

      cameraFocus: {
        scale: 2.5,
        offsetX: -14,
        offsetY: -11,
        preserveCorridor: true,
        preserveDoor: "frontier-threshold",
        framingPadding: 9,
        portraitScale: 2
      },

      roomBehavior: {
        idleAnchor: "workbench",
        glanceTargets: [
          "future-bay",
          "diagnostic-room"
        ],
        arrivalGesture: "frontier-ready",
        ambientFeature: "future-bay"
      },

      corridorAccess: [
        "frontier-threshold",
        "southeast-corridor"
      ],

      visible: true
    }
  };

  var AGENTS = {
    jeeves: {
      id: "jeeves",
      label: "Jeeves",
      title: "House Guide",
      homeRoom: "house-core",
      route: "/showroom/globe/hearth/jeeves/",
      actionLabel: "Ask Jeeves",

      visualIdentity: {
        silhouette: "formal-upright",
        faceShape: "narrow-formal",
        hairStyle: "controlled-side-part",
        browStyle: "measured",
        eyeStyle: "composed",
        mouthStyle: "restrained",
        clothingStyle: "butler-coat",
        posture: "upright",
        accessory: "monocle",
        identityCue: "house-seal"
      },

      scale: {
        overview: 1,
        room: 1.72,
        conversation: 2.05
      },

      blinkProfile: {
        min: 4500,
        max: 8200,
        doubleBlinkChance: 0.08,
        slowBlinkChance: 0.12,
        initialOffset: 1100
      },

      idleProfile: {
        minorGestures: [
          "corridor-glance",
          "cuff-correction",
          "posture-reset"
        ],

        mediumGestures: [
          "monocle-adjust",
          "jacket-smooth"
        ],

        rareGestures: [
          "restrained-yawn",
          "formal-recovery"
        ],

        yawnChance: 0.055,
        yawnCooldown: 420000
      },

      arrivalGesture: "formal-center",
      travelExpression: "attentive",
      focusedExpression: "composed",

      authorityLine:
        "Jeeves has authority for whole-House orientation, the Showroom, the Atlas, the Lab, the Law Library, and the current Portrait Hall orientation phase.",

      description:
        "Whole-House orientation, navigation, placement, and room relationships."
    },

    auren: {
      id: "auren",
      label: "Auren",
      title: "Product Guide",
      homeRoom: "product-gallery",
      route: "/products/auren/",
      actionLabel: "Talk to Auren",

      visualIdentity: {
        silhouette: "practical-forward",
        faceShape: "open-angular",
        hairStyle: "maker-tousled",
        browStyle: "active",
        eyeStyle: "alert",
        mouthStyle: "open-friendly",
        clothingStyle: "maker-jacket",
        posture: "forward-relaxed",
        accessory: "tool-loop",
        identityCue: "gear"
      },

      scale: {
        overview: 1.02,
        room: 1.82,
        conversation: 2.12
      },

      blinkProfile: {
        min: 3400,
        max: 6800,
        doubleBlinkChance: 0.15,
        slowBlinkChance: 0.06,
        initialOffset: 2200
      },

      idleProfile: {
        minorGestures: [
          "tool-glance",
          "eyebrow-shift",
          "shoulder-shift"
        ],

        mediumGestures: [
          "gear-adjust",
          "tool-check",
          "hand-stretch"
        ],

        rareGestures: [
          "maker-stretch",
          "quiet-yawn"
        ],

        yawnChance: 0.085,
        yawnCooldown: 360000
      },

      arrivalGesture: "tool-ready",
      travelExpression: "engaged",
      focusedExpression: "ready",

      authorityLine:
        "Auren has authority for products, practical tools, Education, 1,001 Traversal, and applied frontier systems.",

      description:
        "Products, tools, Education, 1,001 Traversal, and applied systems."
    },

    soren: {
      id: "soren",
      label: "Soren",
      title: "Diagnostic Guide",
      homeRoom: "diagnostic-room",
      route: "/coherence-diagnostic/",
      actionLabel: "Talk to Soren",

      visualIdentity: {
        silhouette: "contained-symmetrical",
        faceShape: "balanced-oval",
        hairStyle: "structured-silver",
        browStyle: "analytical",
        eyeStyle: "measured",
        mouthStyle: "neutral",
        clothingStyle: "diagnostic-coat",
        posture: "centered",
        accessory: "diagnostic-lens",
        identityCue: "seal"
      },

      scale: {
        overview: 0.98,
        room: 1.76,
        conversation: 2.02
      },

      blinkProfile: {
        min: 5200,
        max: 9500,
        doubleBlinkChance: 0.04,
        slowBlinkChance: 0.2,
        initialOffset: 3400
      },

      idleProfile: {
        minorGestures: [
          "slow-head-tilt",
          "diagnostic-glance",
          "small-brow-shift"
        ],

        mediumGestures: [
          "lens-adjust",
          "seal-inspection"
        ],

        rareGestures: [
          "brief-eye-rest",
          "posture-release"
        ],

        yawnChance: 0.025,
        yawnCooldown: 540000
      },

      arrivalGesture: "diagnostic-attend",
      travelExpression: "focused",
      focusedExpression: "analytical",

      authorityLine:
        "Soren has authority for diagnostic boundaries, coherence orientation, and assessment logic.",

      description:
        "Diagnostic boundaries, coherence orientation, and assessment routing."
    },

    elara: {
      id: "elara",
      label: "Elara",
      title: "Signal Bearer",
      homeRoom: "human-threshold",
      route: "/elara/",
      actionLabel: "Talk to Elara",

      visualIdentity: {
        silhouette: "expressive-soft",
        faceShape: "soft-heart",
        hairStyle: "flowing-sculpted",
        browStyle: "expressive",
        eyeStyle: "bright",
        mouthStyle: "warm",
        clothingStyle: "signal-robe",
        posture: "soft-asymmetrical",
        accessory: "signal-orb",
        identityCue: "speech-light"
      },

      scale: {
        overview: 1.03,
        room: 1.88,
        conversation: 2.16
      },

      blinkProfile: {
        min: 3800,
        max: 7400,
        doubleBlinkChance: 0.13,
        slowBlinkChance: 0.1,
        initialOffset: 4600
      },

      idleProfile: {
        minorGestures: [
          "visitor-glance",
          "small-head-move",
          "signal-pulse"
        ],

        mediumGestures: [
          "signal-interaction",
          "expressive-blink",
          "hair-adjust"
        ],

        rareGestures: [
          "soft-stretch",
          "quiet-yawn",
          "signal-dim-recover"
        ],

        yawnChance: 0.1,
        yawnCooldown: 390000
      },

      arrivalGesture: "signal-illumination",
      travelExpression: "expressive-attentive",
      focusedExpression: "warm",

      authorityLine:
        "Elara has authority for the Human Threshold, Sean, the Book Chamber, and Mirrorland’s climate.",

      description:
        "The human threshold, the Book Chamber, and Mirrorland’s climate."
    }
  };

  var AUTHORITY_FALLBACK = {
    orientation: "jeeves",
    showroom: "jeeves",
    world: "jeeves",
    proof: "jeeves",
    law: "jeeves",
    product: "auren",
    frontier: "auren",
    diagnostic: "soren",
    human: "elara",
    book: "elara",
    "future-character": "jeeves"
  };

  var CORRIDORS = {
    "north-entry-corridor": {
      id: "north-entry-corridor",
      x: 50,
      y: 19,
      connections: [
        "room:guide-foyer",
        "room:house-core",
        "northwest-wing-corridor",
        "northeast-wing-corridor",
        "core-crossing"
      ]
    },

    "northwest-wing-corridor": {
      id: "northwest-wing-corridor",
      x: 29.5,
      y: 22,
      connections: [
        "north-entry-corridor",
        "west-main-corridor",
        "room:guide-foyer",
        "room:human-threshold",
        "room:lab"
      ]
    },

    "northeast-wing-corridor": {
      id: "northeast-wing-corridor",
      x: 70.5,
      y: 22,
      connections: [
        "north-entry-corridor",
        "east-main-corridor",
        "room:guide-foyer",
        "room:book-chamber",
        "room:law-library"
      ]
    },

    "west-main-corridor": {
      id: "west-main-corridor",
      x: 29.5,
      y: 49,
      connections: [
        "northwest-wing-corridor",
        "core-crossing",
        "southwest-corridor",
        "room:human-threshold",
        "room:lab",
        "room:showroom"
      ]
    },

    "east-main-corridor": {
      id: "east-main-corridor",
      x: 70.5,
      y: 49,
      connections: [
        "northeast-wing-corridor",
        "core-crossing",
        "southeast-corridor",
        "room:book-chamber",
        "room:law-library",
        "room:product-gallery"
      ]
    },

    "core-crossing": {
      id: "core-crossing",
      x: 50,
      y: 49,
      connections: [
        "north-entry-corridor",
        "west-main-corridor",
        "east-main-corridor",
        "south-gallery-corridor",
        "room:house-core",
        "room:showroom",
        "room:product-gallery"
      ]
    },

    "south-gallery-corridor": {
      id: "south-gallery-corridor",
      x: 50,
      y: 72.5,
      connections: [
        "core-crossing",
        "southwest-corridor",
        "southeast-corridor",
        "room:house-core",
        "room:portrait-hall"
      ]
    },

    "southwest-corridor": {
      id: "southwest-corridor",
      x: 29.5,
      y: 82,
      connections: [
        "west-main-corridor",
        "south-gallery-corridor",
        "room:showroom",
        "room:atlas-study",
        "room:hearth-room",
        "room:portrait-hall"
      ]
    },

    "southeast-corridor": {
      id: "southeast-corridor",
      x: 70.5,
      y: 82,
      connections: [
        "east-main-corridor",
        "south-gallery-corridor",
        "frontier-threshold",
        "room:product-gallery",
        "room:education-room",
        "room:diagnostic-room",
        "room:portrait-hall"
      ]
    },

    "frontier-threshold": {
      id: "frontier-threshold",
      x: 87,
      y: 93.5,
      connections: [
        "southeast-corridor",
        "room:diagnostic-room",
        "room:frontier-workshop"
      ]
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalize(value) {
    if (value === null || typeof value === "undefined") return "";
    return String(value).replace(/\s+/g, " ").trim();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  function chance(probability) {
    return Math.random() < probability;
  }

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function create(tag, className, attrs) {
    var node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (attrs && typeof attrs === "object") {
      Object.keys(attrs).forEach(function applyAttribute(key) {
        var value = attrs[key];

        if (key === "text") {
          node.textContent = value;
          return;
        }

        if (key === "html") {
          node.innerHTML = value;
          return;
        }

        if (key === "dataset" && value) {
          Object.keys(value).forEach(function applyDataset(dataKey) {
            node.dataset[dataKey] = value[dataKey];
          });
          return;
        }

        if (key === "aria" && value) {
          Object.keys(value).forEach(function applyAria(ariaKey) {
            node.setAttribute("aria-" + ariaKey, value[ariaKey]);
          });
          return;
        }

        if (value !== null && typeof value !== "undefined") {
          node.setAttribute(key, value);
        }
      });
    }

    return node;
  }

  function roomExists(roomId) {
    return Boolean(ROOMS[roomId]);
  }

  function agentExists(agentId) {
    return Boolean(AGENTS[agentId]);
  }

  function getRoom(roomId) {
    if (roomExists(roomId)) return ROOMS[roomId];
    return ROOMS[DEFAULT_ROOM_ID];
  }

  function getAgent(agentId) {
    if (agentExists(agentId)) return AGENTS[agentId];
    return AGENTS.jeeves;
  }

  function resolveAuthority(room) {
    if (!room) return "jeeves";
    if (agentExists(room.authority)) return room.authority;
    if (AUTHORITY_FALLBACK[room.type]) return AUTHORITY_FALLBACK[room.type];
    return "jeeves";
  }

  function getRoomAnchorId(roomId) {
    return "room:" + roomId;
  }

  function getRoomCenter(roomId) {
    var room = getRoom(roomId);

    return {
      x: room.x + room.width / 2,
      y: room.y + room.height / 2
    };
  }

  function getRoomZonePoint(roomId, zoneName) {
    var room = getRoom(roomId);
    var zone = room[zoneName] || {
      x: 50,
      y: 50,
      width: 0,
      height: 0
    };

    return {
      x:
        room.x +
        room.width *
          ((zone.x + zone.width / 2) / 100),

      y:
        room.y +
        room.height *
          ((zone.y + zone.height / 2) / 100)
    };
  }

  function getRoomPortraitPoint(roomId) {
    return getRoomZonePoint(roomId, "portraitZone");
  }

  function getGraphNeighbors(nodeId) {
    if (nodeId.indexOf("room:") === 0) {
      var roomId = nodeId.slice(5);
      var room = getRoom(roomId);
      return (room.corridorAccess || []).slice();
    }

    return CORRIDORS[nodeId]
      ? (CORRIDORS[nodeId].connections || []).slice()
      : [];
  }

  function findGraphPath(fromRoomId, toRoomId) {
    var start = getRoomAnchorId(fromRoomId);
    var goal = getRoomAnchorId(toRoomId);

    if (start === goal) return [start];

    var queue = [start];
    var visited = {};
    var previous = {};

    visited[start] = true;

    while (queue.length) {
      var current = queue.shift();
      var neighbors = getGraphNeighbors(current);

      for (var i = 0; i < neighbors.length; i += 1) {
        var next = neighbors[i];

        if (visited[next]) continue;

        visited[next] = true;
        previous[next] = current;

        if (next === goal) {
          var path = [goal];
          var cursor = goal;

          while (previous[cursor]) {
            cursor = previous[cursor];
            path.unshift(cursor);
          }

          return path;
        }

        queue.push(next);
      }
    }

    return [
      start,
      "core-crossing",
      goal
    ];
  }

  function graphNodePoint(nodeId) {
    if (nodeId.indexOf("room:") === 0) {
      return getRoomPortraitPoint(nodeId.slice(5));
    }

    var corridor = CORRIDORS[nodeId];

    return corridor
      ? { x: corridor.x, y: corridor.y }
      : { x: 50, y: 50 };
  }

  function graphPathToVisualPoints(path) {
    return path.map(function mapNode(nodeId) {
      return {
        id: nodeId,
        roomId:
          nodeId.indexOf("room:") === 0
            ? nodeId.slice(5)
            : null,
        point: graphNodePoint(nodeId)
      };
    });
  }

  function getCurrentRoomFromDOM() {
    var root = q("[data-house-control-pad-root]");
    var rootRoom = root && root.getAttribute("data-house-room");

    if (roomExists(rootRoom)) return rootRoom;

    var bodyRoom =
      document.body &&
      document.body.getAttribute("data-house-room");

    if (roomExists(bodyRoom)) return bodyRoom;

    var htmlRoom =
      document.documentElement.getAttribute("data-house-room");

    if (roomExists(htmlRoom)) return htmlRoom;

    var route = location.pathname.replace(/\/+$/, "/");

    var exact = Object.keys(ROOMS).find(function findExact(roomId) {
      return ROOMS[roomId].route === route;
    });

    if (exact) return exact;

    if (route.indexOf("/meet-sean-mansfield/") === 0) {
      return "human-threshold";
    }

    if (route.indexOf("/nine-summits-of-love/") === 0) {
      return "book-chamber";
    }

    if (route.indexOf("/elara/") === 0) {
      return "human-threshold";
    }

    if (route.indexOf("/products/auren/") === 0) {
      return "product-gallery";
    }

    if (route.indexOf("/products/education/") === 0) {
      return "education-room";
    }

    if (route.indexOf("/products/") === 0) {
      return "product-gallery";
    }

    if (route.indexOf("/coherence-diagnostic/") === 0) {
      return "diagnostic-room";
    }

    if (route.indexOf("/showroom/globe/hearth/") === 0) {
      return "hearth-room";
    }

    if (route.indexOf("/showroom/globe/") === 0) {
      return "atlas-study";
    }

    if (route.indexOf("/showroom/") === 0) {
      return "showroom";
    }

    if (route.indexOf("/site-guide/") === 0) {
      return "guide-foyer";
    }

    if (route.indexOf("/gauges/") === 0) {
      return "lab";
    }

    if (route.indexOf("/laws/") === 0) {
      return "law-library";
    }

    if (route.indexOf("/characters/") === 0) {
      return "portrait-hall";
    }

    if (route.indexOf("/explore/frontier/") === 0) {
      return "frontier-workshop";
    }

    return DEFAULT_ROOM_ID;
  }

  function ensureRoot() {
    var root = q("[data-house-control-pad-root]");

    if (!root) {
      root = create("div", "", {
        "data-house-control-pad-root": "true",
        "data-house-room": getCurrentRoomFromDOM()
      });

      document.body.appendChild(root);
    }

    STATE.root = root;
    return root;
  }

  function setStatus(message) {
    if (STATE.status) {
      STATE.status.textContent = normalize(message);
    }
  }

  function setBodyOpen(isOpen) {
    var value = isOpen ? "true" : "false";

    document.documentElement.setAttribute(
      "data-house-control-pad-open",
      value
    );

    document.body.setAttribute(
      "data-house-control-pad-open",
      value
    );
  }

  function safeFocus(node) {
    if (!node || typeof node.focus !== "function") return;

    try {
      node.focus({ preventScroll: true });
    } catch (error) {
      node.focus();
    }
  }

  function getFocusable(root) {
    return qa(
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
      root
    ).filter(function filterFocusable(node) {
      return node.offsetParent !== null || node === document.activeElement;
    });
  }

  function trapFocus(event) {
    if (!STATE.isOpen || !STATE.panel || event.key !== "Tab") return;

    var focusables = getFocusable(STATE.panel);

    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      safeFocus(last);
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      safeFocus(first);
    }
  }

  function handleKeydown(event) {
    recordInteraction();

    if (!STATE.isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();

      if (STATE.viewMode === VIEW_MODE.ROOM) {
        returnToEstate();
      } else {
        closeControlPad();
      }

      return;
    }

    trapFocus(event);
  }

  function clearTimerList(list) {
    list.forEach(function clearTimer(timerId) {
      window.clearTimeout(timerId);
      window.clearInterval(timerId);
    });

    list.length = 0;
  }

  function cancelCameraTransition() {
    STATE.cameraToken += 1;
    STATE.cameraTransitioning = false;
    clearTimerList(STATE.cameraTimers);
  }

  function cancelTravel() {
    STATE.travelToken += 1;
    STATE.isAnimating = false;
    STATE.activePath = [];

    clearTimerList(STATE.travelTimers);
    clearTravelSegments();

    qa("[data-house-avatar]", STATE.panel).forEach(function clearTravel(node) {
      node.setAttribute("data-traveling", "false");
    });
  }

  function clearTravelSegments() {
    qa("[data-house-travel-segment]", STATE.routeLayer)
      .forEach(function removeSegment(segment) {
        segment.remove();
      });
  }

  function clearRoomInteractionStates() {
    qa("[data-house-room-node]", STATE.panel).forEach(function clearRoom(node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-destination", "false");
      node.setAttribute("data-arrived", "false");
      node.setAttribute("data-focused", "false");
    });

    qa("[data-house-avatar]", STATE.panel).forEach(function clearAgent(node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-arrived", "false");
      node.setAttribute("data-focused", "false");
    });
  }

  function markRoomState(roomId, key, value) {
    var node = q(
      '[data-house-room-node="' + roomId + '"]',
      STATE.panel
    );

    if (node) {
      node.setAttribute(key, value ? "true" : "false");
    }
  }

  function markAgentState(agentId, key, value) {
    var node = q(
      '[data-house-avatar="' + agentId + '"]',
      STATE.panel
    );

    if (node) {
      node.setAttribute(key, value ? "true" : "false");
    }
  }

  function setCurrentPageRoom(roomId) {
    var room = getRoom(roomId);

    STATE.currentPageRoom = room.id;

    if (STATE.root) {
      STATE.root.setAttribute("data-house-room", room.id);
    }

    qa("[data-house-room-node]", STATE.panel).forEach(function clearCurrent(node) {
      node.setAttribute("data-current", "false");
    });

    markRoomState(room.id, "data-current", true);
  }

  function getAgentLocation(agentId) {
    var agent = getAgent(agentId);
    return STATE.agentLocations[agent.id] || agent.homeRoom;
  }

  function setAgentLocation(agentId, roomId) {
    if (!agentExists(agentId) || !roomExists(roomId)) return false;
    STATE.agentLocations[agentId] = roomId;
    return true;
  }

  function setAvatarPoint(agentId, point, roomId) {
    var avatar = q(
      '[data-house-avatar="' + agentId + '"]',
      STATE.panel
    );

    if (!avatar || !point) return;

    avatar.style.left = point.x + "%";
    avatar.style.top = point.y + "%";

    if (roomId) {
      avatar.setAttribute("data-current-room", roomId);
    }
  }

  function setAvatarRoom(agentId, roomId) {
    setAvatarPoint(
      agentId,
      getRoomPortraitPoint(roomId),
      roomId
    );
  }

  function restoreAgentPositions() {
    Object.keys(AGENTS).forEach(function restoreAgent(agentId) {
      setAvatarRoom(agentId, getAgentLocation(agentId));
    });
  }

  function resetAgentLocations() {
    cancelTravel();

    STATE.agentLocations = clone(HOME_AGENT_LOCATIONS);

    if (STATE.initialized) {
      restoreAgentPositions();
    }

    setStatus("All guides returned to their home rooms.");

    return clone(STATE.agentLocations);
  }

  function setViewMode(mode) {
    STATE.viewMode =
      mode === VIEW_MODE.ROOM
        ? VIEW_MODE.ROOM
        : VIEW_MODE.ESTATE;

    STATE.zoomLevel =
      STATE.viewMode === VIEW_MODE.ROOM
        ? 2
        : 1;

    if (STATE.panel) {
      STATE.panel.setAttribute(
        "data-house-view-mode",
        STATE.viewMode
      );

      STATE.panel.setAttribute(
        "data-house-zoom-level",
        String(STATE.zoomLevel)
      );
    }

    if (STATE.returnButton) {
      STATE.returnButton.hidden =
        STATE.viewMode !== VIEW_MODE.ROOM;
    }
  }

  function getViewMode() {
    return STATE.viewMode;
  }

  function getOverviewTransform() {
    if (!STATE.estateViewport || !STATE.estateCanvas) {
      return {
        scale: 1,
        x: 0,
        y: 0
      };
    }

    var viewportWidth = STATE.estateViewport.clientWidth;
    var viewportHeight = STATE.estateViewport.clientHeight;
    var canvasWidth = STATE.estateCanvas.offsetWidth;
    var canvasHeight = STATE.estateCanvas.offsetHeight;

    if (!viewportWidth || !viewportHeight || !canvasWidth || !canvasHeight) {
      return {
        scale: 1,
        x: 0,
        y: 0
      };
    }

    var scale = Math.min(
      viewportWidth / canvasWidth,
      viewportHeight / canvasHeight
    );

    scale = clamp(scale, 0.28, 1);

    var x =
      (viewportWidth - canvasWidth * scale) / 2;

    var y =
      (viewportHeight - canvasHeight * scale) / 2;

    return {
      scale: scale,
      x: x,
      y: y
    };
  }

  function getRoomTransform(roomId) {
    var room = getRoom(roomId);
    var camera = room.cameraFocus || {};
    var scale = Number(camera.scale) || 1.7;

    if (!STATE.estateViewport || !STATE.estateCanvas) {
      return {
        scale: scale,
        x: 0,
        y: 0
      };
    }

    var viewportWidth = STATE.estateViewport.clientWidth;
    var viewportHeight = STATE.estateViewport.clientHeight;
    var canvasWidth = STATE.estateCanvas.offsetWidth;
    var canvasHeight = STATE.estateCanvas.offsetHeight;
    var center = getRoomCenter(roomId);

    var roomCenterX =
      canvasWidth * (center.x / 100);

    var roomCenterY =
      canvasHeight * (center.y / 100);

    var x =
      viewportWidth / 2 -
      roomCenterX * scale +
      Number(camera.offsetX || 0);

    var y =
      viewportHeight / 2 -
      roomCenterY * scale +
      Number(camera.offsetY || 0);

    return {
      scale: scale,
      x: x,
      y: y
    };
  }

  function applyCameraTransform(transform, immediate) {
    if (!STATE.estateStage) return;

    STATE.estateStage.style.transition =
      immediate || STATE.reducedMotion
        ? "none"
        : "";

    STATE.estateStage.style.transform =
      "translate3d(" +
      transform.x +
      "px," +
      transform.y +
      "px,0) scale(" +
      transform.scale +
      ")";
  }

  function focusRoom(roomId, options) {
    options = options || {};

    if (!roomExists(roomId)) return false;

    var transform =
      options.overview
        ? getOverviewTransform()
        : getRoomTransform(roomId);

    applyCameraTransform(
      transform,
      Boolean(options.immediate)
    );

    return true;
  }

  function revealRoomInformation(roomId, visible) {
    var roomNode = q(
      '[data-house-room-node="' + roomId + '"]',
      STATE.panel
    );

    if (!roomNode) return;

    roomNode.setAttribute(
      "data-information-visible",
      visible ? "true" : "false"
    );
  }

  function hideAllRoomInformation() {
    qa("[data-house-room-node]", STATE.panel).forEach(function hideInfo(node) {
      node.setAttribute("data-information-visible", "false");
    });
  }

  function enterRoomView(roomId, options) {
    options = options || {};

    if (!STATE.initialized) render();

    var room = getRoom(roomId);
    var token;

    cancelCameraTransition();
    hideAllRoomInformation();

    STATE.previousFocusedRoom = STATE.focusedRoom;
    STATE.focusedRoom = room.id;
    STATE.selectedRoom = room.id;
    STATE.selectedAgent = resolveAuthority(room);
    STATE.cameraTransitioning = true;

    setViewMode(VIEW_MODE.ROOM);

    clearRoomInteractionStates();
    setCurrentPageRoom(STATE.currentPageRoom);

    markRoomState(room.id, "data-selected", true);
    markRoomState(room.id, "data-focused", true);
    markAgentState(STATE.selectedAgent, "data-focused", true);

    updateFocusedAvatarVisibility(room.id);
    updateAvatarScaleStates();

    token = STATE.cameraToken;

    focusRoom(room.id, {
      immediate: Boolean(options.immediate)
    });

    setStatus(
      "Entering " +
      room.label +
      ". " +
      room.summary
    );

    var revealDelay =
      STATE.reducedMotion || options.immediate
        ? 0
        : TIMING.CAMERA_MS;

    var revealTimer = window.setTimeout(function revealFocusedRoom() {
      if (token !== STATE.cameraToken) return;

      STATE.cameraTransitioning = false;
      revealRoomInformation(room.id, true);

      var roomNode = q(
        '[data-house-room-node="' + room.id + '"]',
        STATE.panel
      );

      safeFocus(roomNode);

      if (options.summon !== false) {
        var summonTimer = window.setTimeout(function summonAfterCamera() {
          if (token !== STATE.cameraToken) return;

          travelToRoom(room.id, {
            source: "room-view",
            preserveCamera: true
          });
        }, STATE.reducedMotion ? 0 : TIMING.CAMERA_SETTLE_MS);

        STATE.cameraTimers.push(summonTimer);
      }

      window.dispatchEvent(
        new CustomEvent("house-control-pad:room-view", {
          detail: {
            contract: CONTRACT,
            room: room.id,
            agent: STATE.selectedAgent,
            camera: clone(room.cameraFocus),
            architecture: room.architecturalShape
          }
        })
      );
    }, revealDelay);

    STATE.cameraTimers.push(revealTimer);

    return true;
  }

  function returnToEstate(options) {
    options = options || {};

    if (!STATE.initialized) return false;

    cancelCameraTransition();
    hideArrivalSheet();
    hideAllRoomInformation();

    var previouslyFocused = STATE.focusedRoom;

    STATE.previousFocusedRoom = STATE.focusedRoom;
    STATE.focusedRoom = null;
    STATE.cameraTransitioning = true;

    setViewMode(VIEW_MODE.ESTATE);

    updateFocusedAvatarVisibility(null);
    updateAvatarScaleStates();

    var token = STATE.cameraToken;

    focusRoom(DEFAULT_ROOM_ID, {
      overview: true,
      immediate: Boolean(options.immediate)
    });

    setStatus(
      previouslyFocused
        ? "Returned to the full estate from " +
          getRoom(previouslyFocused).label +
          "."
        : "Full estate overview."
    );

    var settleDelay =
      STATE.reducedMotion || options.immediate
        ? 0
        : TIMING.CAMERA_MS;

    var settleTimer = window.setTimeout(function settleEstate() {
      if (token !== STATE.cameraToken) return;

      STATE.cameraTransitioning = false;

      if (previouslyFocused) {
        markRoomState(previouslyFocused, "data-selected", true);

        var roomNode = q(
          '[data-house-room-node="' + previouslyFocused + '"]',
          STATE.panel
        );

        safeFocus(roomNode);
      }

      window.dispatchEvent(
        new CustomEvent("house-control-pad:estate-view", {
          detail: {
            contract: CONTRACT,
            previousRoom: previouslyFocused
          }
        })
      );
    }, settleDelay);

    STATE.cameraTimers.push(settleTimer);

    return true;
  }

  function updateAvatarScaleStates() {
    Object.keys(AGENTS).forEach(function updateScale(agentId) {
      var avatar = q(
        '[data-house-avatar="' + agentId + '"]',
        STATE.panel
      );

      if (!avatar) return;

      var agent = getAgent(agentId);
      var roomId = getAgentLocation(agentId);
      var isFocusedRoom =
        STATE.viewMode === VIEW_MODE.ROOM &&
        roomId === STATE.focusedRoom;

      avatar.setAttribute(
        "data-avatar-scale-mode",
        isFocusedRoom ? "room" : "overview"
      );

      avatar.style.setProperty(
        "--hcp-agent-overview-scale",
        String(agent.scale.overview)
      );

      avatar.style.setProperty(
        "--hcp-agent-room-scale",
        String(agent.scale.room)
      );

      avatar.style.setProperty(
        "--hcp-agent-conversation-scale",
        String(agent.scale.conversation)
      );
    });
  }

  function updateFocusedAvatarVisibility(roomId) {
    Object.keys(AGENTS).forEach(function updateVisibility(agentId) {
      var avatar = q(
        '[data-house-avatar="' + agentId + '"]',
        STATE.panel
      );

      if (!avatar) return;

      if (!roomId || STATE.viewMode === VIEW_MODE.ESTATE) {
        avatar.setAttribute("data-camera-visible", "true");
        return;
      }

      var currentRoomId = getAgentLocation(agentId);
      var focusedRoom = getRoom(roomId);
      var currentRoom = getRoom(currentRoomId);

      var sameRoom = currentRoomId === roomId;
      var related =
        focusedRoom.relatedRooms.indexOf(currentRoomId) !== -1 ||
        currentRoom.relatedRooms.indexOf(roomId) !== -1;

      avatar.setAttribute(
        "data-camera-visible",
        sameRoom || related ? "true" : "false"
      );
    });
  }

  function getEstateCanvasPixelPoint(percentPoint) {
    if (!STATE.estateCanvas) {
      return { x: 0, y: 0 };
    }

    return {
      x:
        STATE.estateCanvas.offsetWidth *
        (percentPoint.x / 100),

      y:
        STATE.estateCanvas.offsetHeight *
        (percentPoint.y / 100)
    };
  }

  function drawTravelSegment(fromPoint, toPoint, index) {
    if (!STATE.routeLayer) return null;

    var fromPixels = getEstateCanvasPixelPoint(fromPoint);
    var toPixels = getEstateCanvasPixelPoint(toPoint);
    var dx = toPixels.x - fromPixels.x;
    var dy = toPixels.y - fromPixels.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    var segment = create("span", "hcp-travel-segment", {
      "data-house-travel-segment": "true",
      "aria-hidden": "true"
    });

    segment.style.left = fromPixels.x + "px";
    segment.style.top = fromPixels.y + "px";
    segment.style.width = length + "px";
    segment.style.transform = "rotate(" + angle + "deg)";
    segment.style.animationDelay = index * 55 + "ms";

    STATE.routeLayer.appendChild(segment);

    return segment;
  }

  function drawTravelPath(points) {
    clearTravelSegments();

    for (var i = 0; i < points.length - 1; i += 1) {
      drawTravelSegment(
        points[i].point,
        points[i + 1].point,
        i
      );
    }
  }

  function hideArrivalSheet() {
    if (!STATE.arrivalSheet) return;

    STATE.arrivalSheet.setAttribute(
      "data-visible",
      "false"
    );
  }

  function showArrivalSheet(room, agent, sameRoom) {
    if (!STATE.arrivalSheet) return;

    var title = q(
      "[data-hcp-arrival-title]",
      STATE.arrivalSheet
    );

    var body = q(
      "[data-hcp-arrival-body]",
      STATE.arrivalSheet
    );

    var talkButton = q(
      "[data-hcp-arrival-talk]",
      STATE.arrivalSheet
    );

    var roomButton = q(
      "[data-hcp-arrival-room]",
      STATE.arrivalSheet
    );

    if (title) {
      title.textContent = sameRoom
        ? agent.label +
          " is already in " +
          room.label +
          "."
        : agent.label +
          " has arrived at " +
          room.label +
          ".";
    }

    if (body) {
      body.textContent = agent.authorityLine;
    }

    if (talkButton) {
      talkButton.textContent = agent.actionLabel;
    }

    if (roomButton) {
      roomButton.textContent =
        room.visitorCan && room.visitorCan.length
          ? room.visitorCan[0]
          : "Open " + room.shortLabel;
    }

    STATE.arrivalSheet.setAttribute(
      "data-visible",
      "true"
    );
  }

  function completeArrival(room, agent, sameRoom, token) {
    if (token !== STATE.travelToken) return;

    STATE.isAnimating = false;
    STATE.activePath = [];

    clearTimerList(STATE.travelTimers);
    clearTravelSegments();

    setAgentLocation(agent.id, room.id);
    setAvatarRoom(agent.id, room.id);

    setAvatarPrimaryState(
      agent.id,
      "arriving",
      {
        gesture:
          room.roomBehavior.arrivalGesture ||
          agent.arrivalGesture
      }
    );

    markAgentState(agent.id, "data-traveling", false);
    markAgentState(agent.id, "data-arrived", true);

    markRoomState(room.id, "data-destination", false);
    markRoomState(room.id, "data-arrived", true);

    updateFocusedAvatarVisibility(STATE.focusedRoom);
    updateAvatarScaleStates();

    setStatus(
      sameRoom
        ? agent.label +
          " is already in " +
          room.label +
          "."
        : agent.label +
          " has arrived at " +
          room.label +
          "."
    );

    showArrivalSheet(room, agent, sameRoom);

    var settleTimer = window.setTimeout(function settleArrival() {
      if (token !== STATE.travelToken) return;

      releaseAvatarState(agent.id, "arriving");
      setAvatarPrimaryState(
        agent.id,
        STATE.focusedRoom === room.id
          ? "focused"
          : "resting"
      );

      scheduleNextBlink(agent.id);
    }, STATE.reducedMotion ? 0 : TIMING.ARRIVAL_HOLD_MS);

    STATE.travelTimers.push(settleTimer);

    window.dispatchEvent(
      new CustomEvent("house-control-pad:arrival", {
        detail: {
          contract: CONTRACT,
          room: room.id,
          agent: agent.id,
          sameRoom: Boolean(sameRoom),
          roomRoute: room.route,
          agentRoute: agent.route
        }
      })
    );
  }

  function animateAgentAlongPath(agent, room, visualPoints, token) {
    if (!visualPoints.length) {
      completeArrival(room, agent, false, token);
      return;
    }

    STATE.activePath = visualPoints.map(function mapPoint(item) {
      return item.id;
    });

    setAvatarPrimaryState(agent.id, "traveling", {
      expression: agent.travelExpression
    });

    markAgentState(agent.id, "data-traveling", true);

    drawTravelPath(visualPoints);

    for (var i = 1; i < visualPoints.length; i += 1) {
      (function schedulePoint(pointItem, index) {
        var timer = window.setTimeout(function moveAgent() {
          if (token !== STATE.travelToken) return;

          setAvatarPoint(
            agent.id,
            pointItem.point,
            pointItem.roomId
          );
        }, index * TIMING.TRAVEL_SEGMENT_MS);

        STATE.travelTimers.push(timer);
      })(visualPoints[i], i);
    }

    var completionDelay =
      Math.max(1, visualPoints.length - 1) *
        TIMING.TRAVEL_SEGMENT_MS +
      TIMING.TRAVEL_SETTLE_MS;

    var completionTimer = window.setTimeout(function finishTravel() {
      completeArrival(
        room,
        agent,
        false,
        token
      );
    }, STATE.reducedMotion ? 0 : completionDelay);

    STATE.travelTimers.push(completionTimer);
  }

  function travelToRoom(roomId, options) {
    options = options || {};

    if (!STATE.initialized) render();

    if (!STATE.isOpen) {
      openControlPad({
        room: roomId
      });
    }

    var room = getRoom(roomId);

    if (
      STATE.viewMode === VIEW_MODE.ESTATE &&
      options.skipRoomView !== true
    ) {
      enterRoomView(room.id, {
        summon: false
      });

      var token = STATE.cameraToken;

      var delayedTravel = window.setTimeout(function travelAfterView() {
        if (token !== STATE.cameraToken) return;

        travelToRoom(room.id, {
          source: options.source || "estate-selection",
          preserveCamera: true,
          skipRoomView: true,
          agent: options.agent
        });
      }, STATE.reducedMotion ? 0 : TIMING.CAMERA_MS + TIMING.CAMERA_SETTLE_MS);

      STATE.cameraTimers.push(delayedTravel);

      return;
    }

    cancelTravel();
    hideArrivalSheet();

    var authorityId =
      options.agent && agentExists(options.agent)
        ? options.agent
        : resolveAuthority(room);

    var agent = getAgent(authorityId);
    var fromRoomId = getAgentLocation(agent.id);
    var token = STATE.travelToken;

    STATE.selectedRoom = room.id;
    STATE.selectedAgent = agent.id;

    clearRoomInteractionStates();
    setCurrentPageRoom(STATE.currentPageRoom);

    markRoomState(room.id, "data-selected", true);
    markRoomState(room.id, "data-destination", true);
    markRoomState(room.id, "data-focused", true);
    markAgentState(agent.id, "data-selected", true);
    markAgentState(agent.id, "data-focused", true);

    revealRoomInformation(room.id, true);

    if (fromRoomId === room.id) {
      completeArrival(room, agent, true, token);

      window.dispatchEvent(
        new CustomEvent("house-control-pad:same-room", {
          detail: {
            contract: CONTRACT,
            room: room.id,
            agent: agent.id
          }
        })
      );

      return;
    }

    STATE.isAnimating = true;

    var graphPath = findGraphPath(
      fromRoomId,
      room.id
    );

    var visualPoints = graphPathToVisualPoints(
      graphPath
    );

    setStatus(
      agent.label +
      " is traveling from " +
      getRoom(fromRoomId).label +
      " to " +
      room.label +
      "."
    );

    animateAgentAlongPath(
      agent,
      room,
      visualPoints,
      token
    );

    window.dispatchEvent(
      new CustomEvent("house-control-pad:travel", {
        detail: {
          contract: CONTRACT,
          source: options.source || "unknown",
          room: room.id,
          agent: agent.id,
          from: fromRoomId,
          to: room.id,
          graphPath: graphPath.slice(),
          visualPath: visualPoints.map(function mapVisual(item) {
            return item.id;
          })
        }
      })
    );
  }

  function getAvatarRuntime(agentId) {
    if (!STATE.avatarRuntime[agentId]) {
      STATE.avatarRuntime[agentId] = {
        primaryState: "resting",
        gesture: null,
        expression: null,
        blinkTimer: null,
        gestureTimer: null,
        stateTimer: null,
        lastBlinkAt: 0,
        lastGestureAt: 0,
        lastYawnAt: 0,
        gestureCooldowns: {},
        stateToken: 0
      };
    }

    return STATE.avatarRuntime[agentId];
  }

  function canOverrideAvatarState(currentState, nextState) {
    return (
      AVATAR_STATE_PRIORITY[nextState] >=
      AVATAR_STATE_PRIORITY[currentState]
    );
  }

  function syncAvatarRuntimeToDOM(agentId) {
    var runtime = getAvatarRuntime(agentId);
    var avatar = q(
      '[data-house-avatar="' + agentId + '"]',
      STATE.panel
    );

    if (!avatar) return;

    avatar.setAttribute(
      "data-avatar-state",
      runtime.primaryState
    );

    avatar.setAttribute(
      "data-avatar-gesture",
      runtime.gesture || ""
    );

    avatar.setAttribute(
      "data-avatar-expression",
      runtime.expression || ""
    );
  }

  function setAvatarPrimaryState(agentId, nextState, metadata) {
    metadata = metadata || {};

    var runtime = getAvatarRuntime(agentId);
    var currentState = runtime.primaryState || "resting";

    if (!canOverrideAvatarState(currentState, nextState)) {
      return false;
    }

    runtime.stateToken += 1;
    runtime.primaryState = nextState;
    runtime.gesture = metadata.gesture || null;
    runtime.expression = metadata.expression || null;

    syncAvatarRuntimeToDOM(agentId);

    return true;
  }

  function releaseAvatarState(agentId, expectedState) {
    var runtime = getAvatarRuntime(agentId);

    if (
      expectedState &&
      runtime.primaryState !== expectedState
    ) {
      return false;
    }

    runtime.primaryState =
      STATE.focusedRoom === getAgentLocation(agentId)
        ? "focused"
        : "resting";

    runtime.gesture = null;
    runtime.expression = null;

    syncAvatarRuntimeToDOM(agentId);

    return true;
  }

  function performBlink(agentId, blinkType) {
    if (
      !STATE.lifeEnabled ||
      !STATE.lifeEnabled ||
      !STATE.isOpen
    ) {
      return;
    }

    var runtime = getAvatarRuntime(agentId);
    var currentState = runtime.primaryState;

    if (
      currentState === "traveling" ||
      currentState === "arriving" ||
      currentState === "gesturing" ||
      currentState === "sleepy" ||
      currentState === "disabled"
    ) {
      scheduleNextBlink(agentId);
      return;
    }

    var avatar = q(
      '[data-house-avatar="' + agentId + '"]',
      STATE.panel
    );

    if (!avatar) return;

    runtime.lastBlinkAt = Date.now();

    avatar.setAttribute(
      "data-blink-type",
      blinkType
    );

    avatar.setAttribute(
      "data-blinking",
      "true"
    );

    var duration =
      blinkType === "slow"
        ? TIMING.BLINK_SLOW_MS
        : TIMING.BLINK_SINGLE_MS;

    var finishTimer = window.setTimeout(function finishBlink() {
      avatar.setAttribute("data-blinking", "false");
      avatar.setAttribute("data-blink-type", "");

      if (blinkType === "double") {
        var secondBlinkTimer = window.setTimeout(function secondBlink() {
          avatar.setAttribute("data-blink-type", "single");
          avatar.setAttribute("data-blinking", "true");

          var secondFinishTimer = window.setTimeout(function finishSecondBlink() {
            avatar.setAttribute("data-blinking", "false");
            avatar.setAttribute("data-blink-type", "");
            scheduleNextBlink(agentId);
          }, TIMING.BLINK_SINGLE_MS);

          STATE.lifeTimers.push(secondFinishTimer);
        }, TIMING.BLINK_DOUBLE_GAP_MS);

        STATE.lifeTimers.push(secondBlinkTimer);
        return;
      }

      scheduleNextBlink(agentId);
    }, duration);

    STATE.lifeTimers.push(finishTimer);
  }

  function chooseBlinkType(agent) {
    if (chance(agent.blinkProfile.doubleBlinkChance)) {
      return "double";
    }

    if (chance(agent.blinkProfile.slowBlinkChance)) {
      return "slow";
    }

    return "single";
  }

  function scheduleNextBlink(agentId, initial) {
    var runtime = getAvatarRuntime(agentId);
    var agent = getAgent(agentId);

    if (runtime.blinkTimer) {
      window.clearTimeout(runtime.blinkTimer);
      runtime.blinkTimer = null;
    }

    if (
      !STATE.lifeEnabled ||
      !STATE.isOpen ||
      STATE.reducedMotion
    ) {
      return;
    }

    var delay = initial
      ? agent.blinkProfile.initialOffset
      : randomBetween(
          agent.blinkProfile.min,
          agent.blinkProfile.max
        );

    runtime.blinkTimer = window.setTimeout(function runBlink() {
      runtime.blinkTimer = null;
      performBlink(
        agentId,
        chooseBlinkType(agent)
      );
    }, delay);

    STATE.lifeTimers.push(runtime.blinkTimer);
  }

  function deriveIdleStage() {
    var idleFor = Date.now() - STATE.lastInteractionAt;

    if (idleFor < 20000) {
      return IDLE_STAGE.ACTIVE;
    }

    if (idleFor < 45000) {
      return IDLE_STAGE.SETTLED;
    }

    if (idleFor < 90000) {
      return IDLE_STAGE.IDLE;
    }

    return IDLE_STAGE.LONG_IDLE;
  }

  function canPerformGesture(agentId, gestureLevel) {
    if (
      !STATE.lifeEnabled ||
      !STATE.isOpen ||
      STATE.reducedMotion ||
      STATE.cameraTransitioning
    ) {
      return false;
    }

    var runtime = getAvatarRuntime(agentId);

    if (
      runtime.primaryState === "traveling" ||
      runtime.primaryState === "arriving" ||
      runtime.primaryState === "speaking" ||
      runtime.primaryState === "gesturing" ||
      runtime.primaryState === "sleepy" ||
      runtime.primaryState === "disabled"
    ) {
      return false;
    }

    if (
      gestureLevel === "large" &&
      STATE.activeLargeGestureAgent &&
      STATE.activeLargeGestureAgent !== agentId
    ) {
      return false;
    }

    if (
      gestureLevel === "large" &&
      Date.now() - STATE.lastLargeGestureAt <
        TIMING.LARGE_GESTURE_MIN_GAP_MS
    ) {
      return false;
    }

    return true;
  }

  function performGesture(agentId, gesture, options) {
    options = options || {};

    var level = options.level || "medium";
    var state =
      options.sleepy
        ? "sleepy"
        : "gesturing";

    if (!canPerformGesture(agentId, level)) {
      return false;
    }

    var runtime = getAvatarRuntime(agentId);
    var duration =
      Number(options.duration) ||
      (level === "large" ? 2200 : 1100);

    if (level === "large") {
      STATE.activeLargeGestureAgent = agentId;
      STATE.lastLargeGestureAt = Date.now();
    }

    runtime.lastGestureAt = Date.now();

    setAvatarPrimaryState(agentId, state, {
      gesture: gesture
    });

    var token = runtime.stateToken;

    runtime.gestureTimer = window.setTimeout(function finishGesture() {
      if (token !== runtime.stateToken) return;

      if (STATE.activeLargeGestureAgent === agentId) {
        STATE.activeLargeGestureAgent = null;
      }

      releaseAvatarState(agentId, state);
      scheduleNextBlink(agentId);
    }, duration);

    STATE.lifeTimers.push(runtime.gestureTimer);

    return true;
  }

  function chooseFrom(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function evaluateAgentIdle(agentId) {
    var agent = getAgent(agentId);
    var runtime = getAvatarRuntime(agentId);
    var stage = STATE.idleStage;

    if (
      runtime.primaryState !== "resting" &&
      runtime.primaryState !== "focused"
    ) {
      return;
    }

    if (stage === IDLE_STAGE.ACTIVE) {
      return;
    }

    if (
      Date.now() - runtime.lastGestureAt <
      13000
    ) {
      return;
    }

    if (stage === IDLE_STAGE.SETTLED) {
      if (chance(0.12)) {
        performGesture(
          agentId,
          chooseFrom(agent.idleProfile.minorGestures),
          {
            level: "minor",
            duration: randomBetween(700, 1100)
          }
        );
      }

      return;
    }

    if (stage === IDLE_STAGE.IDLE) {
      if (chance(0.11)) {
        performGesture(
          agentId,
          chooseFrom(agent.idleProfile.mediumGestures),
          {
            level: "medium",
            duration: randomBetween(900, 1500)
          }
        );
      } else if (chance(0.16)) {
        performGesture(
          agentId,
          chooseFrom(agent.idleProfile.minorGestures),
          {
            level: "minor",
            duration: randomBetween(700, 1100)
          }
        );
      }

      return;
    }

    if (stage === IDLE_STAGE.LONG_IDLE) {
      var yawnEligible =
        Date.now() - runtime.lastYawnAt >
          agent.idleProfile.yawnCooldown &&
        chance(agent.idleProfile.yawnChance);

      if (yawnEligible) {
        runtime.lastYawnAt = Date.now();

        performGesture(
          agentId,
          chooseFrom(agent.idleProfile.rareGestures),
          {
            level: "large",
            sleepy: true,
            duration: randomBetween(1900, 2800)
          }
        );

        return;
      }

      if (chance(0.08)) {
        performGesture(
          agentId,
          chooseFrom(agent.idleProfile.mediumGestures),
          {
            level: "medium",
            duration: randomBetween(1000, 1600)
          }
        );
      }
    }
  }

  function evaluateAvatarLife() {
    if (
      !STATE.lifeEnabled ||
      !STATE.isOpen ||
      STATE.reducedMotion
    ) {
      return;
    }

    STATE.idleStage = deriveIdleStage();

    Object.keys(AGENTS).forEach(function evaluateAgent(agentId) {
      evaluateAgentIdle(agentId);
    });
  }

  function startAvatarLife() {
    stopAvatarLife();

    if (
      !STATE.lifeEnabled ||
      !STATE.isOpen
    ) {
      return;
    }

    Object.keys(AGENTS).forEach(function startAgentBlink(agentId) {
      getAvatarRuntime(agentId);
      scheduleNextBlink(agentId, true);
    });

    var evaluationTimer = window.setInterval(
      evaluateAvatarLife,
      TIMING.LIFE_EVALUATION_MS
    );

    STATE.lifeTimers.push(evaluationTimer);
  }

  function stopAvatarLife() {
    clearTimerList(STATE.lifeTimers);

    Object.keys(STATE.avatarRuntime).forEach(function resetRuntime(agentId) {
      var runtime = STATE.avatarRuntime[agentId];

      if (runtime.blinkTimer) {
        window.clearTimeout(runtime.blinkTimer);
      }

      if (runtime.gestureTimer) {
        window.clearTimeout(runtime.gestureTimer);
      }

      runtime.blinkTimer = null;
      runtime.gestureTimer = null;
      runtime.primaryState = "resting";
      runtime.gesture = null;
      runtime.expression = null;

      syncAvatarRuntimeToDOM(agentId);

      var avatar = q(
        '[data-house-avatar="' + agentId + '"]',
        STATE.panel
      );

      if (avatar) {
        avatar.setAttribute("data-blinking", "false");
        avatar.setAttribute("data-blink-type", "");
      }
    });

    STATE.activeLargeGestureAgent = null;
  }

  function pauseAvatarLife() {
    STATE.lifeEnabled = false;
    stopAvatarLife();

    Object.keys(AGENTS).forEach(function disableAgent(agentId) {
      setAvatarPrimaryState(agentId, "disabled");
    });

    return true;
  }

  function resumeAvatarLife() {
    STATE.lifeEnabled = true;

    Object.keys(AGENTS).forEach(function restoreAgent(agentId) {
      releaseAvatarState(agentId);
    });

    if (STATE.isOpen) {
      startAvatarLife();
    }

    return true;
  }

  function getAvatarLifeState(agentId) {
    if (!agentExists(agentId)) return null;

    var runtime = getAvatarRuntime(agentId);

    return {
      agent: agentId,
      primaryState: runtime.primaryState,
      gesture: runtime.gesture,
      expression: runtime.expression,
      lastBlinkAt: runtime.lastBlinkAt,
      lastGestureAt: runtime.lastGestureAt,
      lastYawnAt: runtime.lastYawnAt,
      idleStage: STATE.idleStage,
      lifeEnabled: STATE.lifeEnabled,
      reducedMotion: STATE.reducedMotion
    };
  }

  function recordInteraction() {
    var now = Date.now();

    if (
      now - STATE.lastInteractionRecordedAt <
      TIMING.INTERACTION_THROTTLE_MS
    ) {
      return;
    }

    STATE.lastInteractionRecordedAt = now;
    STATE.lastInteractionAt = now;
    STATE.idleStage = IDLE_STAGE.ACTIVE;
  }

  function bindInteractionTracking() {
    [
      "pointerdown",
      "touchstart",
      "wheel",
      "keydown",
      "scroll"
    ].forEach(function bindEvent(eventName) {
      document.addEventListener(
        eventName,
        recordInteraction,
        {
          passive: true
        }
      );
    });

    document.addEventListener(
      "pointermove",
      recordInteraction,
      {
        passive: true
      }
    );
  }

  function detectReducedMotion() {
    var media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    STATE.reducedMotion = media.matches;

    document.documentElement.setAttribute(
      "data-house-reduced-motion",
      STATE.reducedMotion ? "true" : "false"
    );

    var changeHandler = function handleReducedMotionChange(event) {
      STATE.reducedMotion = event.matches;

      document.documentElement.setAttribute(
        "data-house-reduced-motion",
        STATE.reducedMotion ? "true" : "false"
      );

      stopAvatarLife();

      if (
        STATE.isOpen &&
        STATE.lifeEnabled &&
        !STATE.reducedMotion
      ) {
        startAvatarLife();
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", changeHandler);
    } else if (typeof media.addListener === "function") {
      media.addListener(changeHandler);
    }
  }

  function buildRoomActions(room) {
    var actions = create("div", "hcp-room-actions", {
      "data-house-room-actions": room.id
    });

    var primary = create(
      "button",
      "hcp-room-action hcp-room-action-primary",
      {
        type: "button",
        "data-house-room-open": room.id,
        text:
          room.visitorCan && room.visitorCan.length
            ? room.visitorCan[0]
            : "Open Room"
      }
    );

    var talk = create(
      "button",
      "hcp-room-action",
      {
        type: "button",
        "data-house-agent-open": resolveAuthority(room),
        text: getAgent(resolveAuthority(room)).actionLabel
      }
    );

    var relatedRoomId =
      room.relatedRooms && room.relatedRooms.length
        ? room.relatedRooms[0]
        : null;

    var related = create(
      "button",
      "hcp-room-action",
      {
        type: "button",
        text: relatedRoomId
          ? "Visit " + getRoom(relatedRoomId).shortLabel
          : "Return to Estate"
      }
    );

    var back = create(
      "button",
      "hcp-room-action hcp-room-action-muted",
      {
        type: "button",
        text: "Return to Estate"
      }
    );

    primary.addEventListener("click", function openRoomRoute(event) {
      event.stopPropagation();
      window.location.href = room.route;
    });

    talk.addEventListener("click", function openAgentRoute(event) {
      event.stopPropagation();
      window.location.href =
        getAgent(resolveAuthority(room)).route;
    });

    related.addEventListener("click", function openRelated(event) {
      event.stopPropagation();

      if (relatedRoomId) {
        enterRoomView(relatedRoomId);
      } else {
        returnToEstate();
      }
    });

    back.addEventListener("click", function returnFromRoom(event) {
      event.stopPropagation();
      returnToEstate();
    });

    actions.appendChild(primary);
    actions.appendChild(talk);
    actions.appendChild(related);
    actions.appendChild(back);

    return actions;
  }

  function buildFeatureNode(feature) {
    var node = create(
      "span",
      "hcp-room-feature hcp-room-feature-" + feature.type,
      {
        "data-house-feature-type": feature.type,
        "aria-hidden": "true"
      }
    );

    node.style.left = feature.x + "%";
    node.style.top = feature.y + "%";
    node.style.width = feature.width + "%";
    node.style.height = feature.height + "%";

    return node;
  }

  function buildRoomNode(room) {
    var authority = getAgent(resolveAuthority(room));

    var node = create(
      "section",
      [
        "hcp-room-node",
        "hcp-room-" + room.type,
        "hcp-room-rank-" + room.rank,
        "hcp-room-shape-" + room.architecturalShape,
        "hcp-room-wing-" + room.estateWing
      ].join(" "),
      {
        tabindex: "0",
        role: "button",
        "data-house-room-node": room.id,
        "data-house-room-type": room.type,
        "data-house-room-rank": room.rank,
        "data-house-room-shape": room.architecturalShape,
        "data-house-cardinal-sector": room.cardinalSector,
        "data-house-estate-wing": room.estateWing,
        "data-current": "false",
        "data-selected": "false",
        "data-destination": "false",
        "data-arrived": "false",
        "data-focused": "false",
        "data-information-visible": "false",
        "aria-label":
          room.label +
          ". " +
          room.summary +
          " Guide: " +
          authority.label +
          "."
      }
    );

    node.style.left = room.x + "%";
    node.style.top = room.y + "%";
    node.style.width = room.width + "%";
    node.style.height = room.height + "%";

    var architecture = create(
      "div",
      "hcp-room-architecture",
      {
        "aria-hidden": "true"
      }
    );

    (room.architecturalFeatureZones || []).forEach(function appendFeature(feature) {
      architecture.appendChild(
        buildFeatureNode(feature)
      );
    });

    var labelZone = create(
      "div",
      "hcp-room-label-zone"
    );

    positionZone(labelZone, room.labelZone);

    labelZone.appendChild(
      create("span", "hcp-room-label", {
        text: room.shortLabel
      })
    );

    labelZone.appendChild(
      create("span", "hcp-room-category", {
        text: room.categoryLabel
      })
    );

    var summaryZone = create(
      "div",
      "hcp-room-summary-zone"
    );

    positionZone(summaryZone, room.summaryZone);

    summaryZone.appendChild(
      create("p", "hcp-room-summary", {
        text: room.summary
      })
    );

    summaryZone.appendChild(
      create("span", "hcp-room-guide", {
        text: "Guide: " + authority.label
      })
    );

    var detailZone = create(
      "div",
      "hcp-room-detail-zone"
    );

    positionZone(detailZone, room.detailZone);

    detailZone.appendChild(
      create("h3", "hcp-room-detail-title", {
        text: room.label
      })
    );

    detailZone.appendChild(
      create("p", "hcp-room-detail-copy", {
        text: room.detail
      })
    );

    var visitorList = create(
      "ul",
      "hcp-room-visitor-list"
    );

    (room.visitorCan || []).forEach(function appendVisitorItem(item) {
      visitorList.appendChild(
        create("li", "", {
          text: item
        })
      );
    });

    detailZone.appendChild(visitorList);

    var portraitZone = create(
      "div",
      "hcp-room-portrait-zone",
      {
        "aria-hidden": "true"
      }
    );

    positionZone(portraitZone, room.portraitZone);

    var actionZone = create(
      "div",
      "hcp-room-action-zone"
    );

    positionZone(actionZone, room.actionZone);
    actionZone.appendChild(buildRoomActions(room));

    node.appendChild(architecture);
    node.appendChild(labelZone);
    node.appendChild(summaryZone);
    node.appendChild(detailZone);
    node.appendChild(portraitZone);
    node.appendChild(actionZone);

    node.addEventListener("click", function selectRoom(event) {
      if (event.target.closest("button")) return;

      recordInteraction();

      if (
        STATE.viewMode === VIEW_MODE.ROOM &&
        STATE.focusedRoom === room.id
      ) {
        revealRoomInformation(room.id, true);
        return;
      }

      enterRoomView(room.id);
    });

    node.addEventListener("keydown", function activateRoom(event) {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();
      recordInteraction();

      if (
        STATE.viewMode === VIEW_MODE.ROOM &&
        STATE.focusedRoom === room.id
      ) {
        revealRoomInformation(room.id, true);
        return;
      }

      enterRoomView(room.id);
    });

    node.addEventListener("mouseenter", function revealSummary() {
      node.setAttribute("data-summary-active", "true");
    });

    node.addEventListener("mouseleave", function hideSummary() {
      node.setAttribute("data-summary-active", "false");
    });

    node.addEventListener("focus", function focusSummary() {
      node.setAttribute("data-summary-active", "true");
    });

    node.addEventListener("blur", function blurSummary() {
      node.setAttribute("data-summary-active", "false");
    });

    return node;
  }

  function positionZone(node, zone) {
    node.style.left = zone.x + "%";
    node.style.top = zone.y + "%";
    node.style.width = zone.width + "%";
    node.style.height = zone.height + "%";
  }

  function buildAvatarAnatomy(agent) {
    var identity = agent.visualIdentity;

    var portrait = create(
      "span",
      [
        "hcp-avatar-portrait",
        "hcp-silhouette-" + identity.silhouette,
        "hcp-face-shape-" + identity.faceShape,
        "hcp-hair-" + identity.hairStyle,
        "hcp-brows-" + identity.browStyle,
        "hcp-eyes-" + identity.eyeStyle,
        "hcp-mouth-" + identity.mouthStyle,
        "hcp-clothing-" + identity.clothingStyle,
        "hcp-posture-" + identity.posture,
        "hcp-accessory-" + identity.accessory,
        "hcp-cue-" + identity.identityCue
      ].join(" "),
      {
        "aria-hidden": "true"
      }
    );

    var frame = create("span", "hcp-portrait-frame");
    var torso = create("span", "hcp-portrait-torso");
    var shoulders = create("span", "hcp-portrait-shoulders");
    var clothing = create("span", "hcp-portrait-clothing");
    var neck = create("span", "hcp-portrait-neck");
    var ears = create("span", "hcp-portrait-ears");
    var head = create("span", "hcp-portrait-head");
    var hairBack = create("span", "hcp-portrait-hair-back");
    var hairFront = create("span", "hcp-portrait-hair-front");
    var brows = create("span", "hcp-portrait-brows");
    var eyes = create("span", "hcp-portrait-eyes");
    var leftEye = create("span", "hcp-portrait-eye hcp-portrait-eye-left");
    var rightEye = create("span", "hcp-portrait-eye hcp-portrait-eye-right");
    var leftLid = create("span", "hcp-portrait-lid hcp-portrait-lid-left");
    var rightLid = create("span", "hcp-portrait-lid hcp-portrait-lid-right");
    var pupils = create("span", "hcp-portrait-pupils");
    var leftPupil = create("span", "hcp-portrait-pupil hcp-portrait-pupil-left");
    var rightPupil = create("span", "hcp-portrait-pupil hcp-portrait-pupil-right");
    var nose = create("span", "hcp-portrait-nose");
    var mouth = create("span", "hcp-portrait-mouth");
    var accessory = create("span", "hcp-portrait-accessory");
    var cue = create("span", "hcp-portrait-identity-cue");
    var badge = create("span", "hcp-portrait-badge", {
      text: agent.label.charAt(0)
    });

    leftEye.appendChild(leftLid);
    rightEye.appendChild(rightLid);

    pupils.appendChild(leftPupil);
    pupils.appendChild(rightPupil);

    eyes.appendChild(leftEye);
    eyes.appendChild(rightEye);
    eyes.appendChild(pupils);

    head.appendChild(brows);
    head.appendChild(eyes);
    head.appendChild(nose);
    head.appendChild(mouth);

    torso.appendChild(shoulders);
    torso.appendChild(clothing);
    torso.appendChild(neck);

    frame.appendChild(torso);
    frame.appendChild(ears);
    frame.appendChild(hairBack);
    frame.appendChild(head);
    frame.appendChild(hairFront);
    frame.appendChild(accessory);
    frame.appendChild(cue);
    frame.appendChild(badge);

    portrait.appendChild(frame);

    return portrait;
  }

  function buildAvatar(agent) {
    var avatar = create(
      "button",
      "hcp-avatar hcp-avatar-" + agent.id,
      {
        type: "button",
        "data-house-avatar": agent.id,
        "data-avatar-state": "resting",
        "data-avatar-gesture": "",
        "data-avatar-expression": "",
        "data-avatar-scale-mode": "overview",
        "data-camera-visible": "true",
        "data-blinking": "false",
        "data-blink-type": "",
        "data-traveling": "false",
        "data-arrived": "false",
        "data-selected": "false",
        "data-focused": "false",
        "data-current-room": agent.homeRoom,
        "aria-label":
          agent.label +
          ". " +
          agent.description
      }
    );

    avatar.appendChild(buildAvatarAnatomy(agent));

    avatar.appendChild(
      create("span", "hcp-avatar-nameplate", {
        text: agent.label
      })
    );

    avatar.addEventListener("click", function selectAvatar(event) {
      event.stopPropagation();
      recordInteraction();

      enterRoomView(
        getAgentLocation(agent.id),
        {
          summon: false
        }
      );
    });

    return avatar;
  }

  function buildHeader() {
    var header = create("header", "hcp-header");

    var titleWrap = create("div", "hcp-title-wrap");

    titleWrap.appendChild(
      create("div", "hcp-kicker", {
        text: "Universal House Controller"
      })
    );

    titleWrap.appendChild(
      create("h2", "hcp-title", {
        text:
          "Choose a room. The House summons the right guide."
      })
    );

    titleWrap.appendChild(
      create("p", "hcp-subtitle", {
        text:
          "Explore the full estate, enter a room, understand its purpose, and meet its resident guide."
      })
    );

    var controls = create(
      "div",
      "hcp-header-controls"
    );

    var returnButton = create(
      "button",
      "hcp-return-estate",
      {
        type: "button",
        hidden: "hidden",
        text: "Return to Estate"
      }
    );

    var closeButton = create(
      "button",
      "hcp-close",
      {
        type: "button",
        "data-house-control-pad-close": "true",
        "aria-label": "Close House controller",
        text: "×"
      }
    );

    returnButton.addEventListener("click", function returnFromHeader() {
      recordInteraction();
      returnToEstate();
    });

    closeButton.addEventListener(
      "click",
      closeControlPad
    );

    controls.appendChild(returnButton);
    controls.appendChild(closeButton);

    header.appendChild(titleWrap);
    header.appendChild(controls);

    STATE.returnButton = returnButton;
    STATE.header = header;

    return header;
  }

  function buildArrivalSheet() {
    var sheet = create(
      "section",
      "hcp-arrival-sheet",
      {
        "data-house-control-pad-arrival": "true",
        "data-visible": "false",
        "aria-label": "Guide arrival"
      }
    );

    var content = create(
      "div",
      "hcp-arrival-content"
    );

    content.appendChild(
      create("div", "hcp-arrival-eyebrow", {
        text: "Guide Authority"
      })
    );

    content.appendChild(
      create("h3", "hcp-arrival-title", {
        "data-hcp-arrival-title": "true",
        text: "Choose a room."
      })
    );

    content.appendChild(
      create("p", "hcp-arrival-body", {
        "data-hcp-arrival-body": "true",
        text:
          "The House will summon the correct guide."
      })
    );

    var actions = create(
      "div",
      "hcp-arrival-actions"
    );

    var roomButton = create(
      "button",
      "hcp-arrival-action hcp-arrival-primary",
      {
        type: "button",
        "data-hcp-arrival-room": "true",
        text: "Open Room"
      }
    );

    var talkButton = create(
      "button",
      "hcp-arrival-action",
      {
        type: "button",
        "data-hcp-arrival-talk": "true",
        text: "Talk to Guide"
      }
    );

    var dismissButton = create(
      "button",
      "hcp-arrival-action hcp-arrival-muted",
      {
        type: "button",
        text: "Dismiss"
      }
    );

    roomButton.addEventListener("click", function openSelectedRoom() {
      if (!STATE.selectedRoom) return;
      window.location.href = getRoom(STATE.selectedRoom).route;
    });

    talkButton.addEventListener("click", function openSelectedAgent() {
      if (!STATE.selectedAgent) return;
      window.location.href = getAgent(STATE.selectedAgent).route;
    });

    dismissButton.addEventListener(
      "click",
      hideArrivalSheet
    );

    actions.appendChild(roomButton);
    actions.appendChild(talkButton);
    actions.appendChild(dismissButton);

    content.appendChild(actions);
    sheet.appendChild(content);

    STATE.arrivalSheet = sheet;

    return sheet;
  }

  function buildFooter() {
    var footer = create("footer", "hcp-footer");

    var status = create(
      "div",
      "hcp-status",
      {
        "data-house-control-pad-status": "true",
        "aria-live": "polite",
        text: "House controller ready."
      }
    );

    var actions = create(
      "div",
      "hcp-footer-actions"
    );

    var summonButton = create(
      "button",
      "hcp-footer-button",
      {
        type: "button",
        text: "Summon guide for this page"
      }
    );

    summonButton.addEventListener("click", function summonCurrent() {
      recordInteraction();

      enterRoomView(
        STATE.currentPageRoom
      );
    });

    actions.appendChild(summonButton);
    footer.appendChild(status);
    footer.appendChild(actions);

    STATE.status = status;

    return footer;
  }

  function buildEstate() {
    var viewport = create(
      "section",
      "hcp-estate-viewport",
      {
        "data-house-estate-viewport": "true",
        tabindex: "0",
        "aria-label": "Immersive House estate"
      }
    );

    var stage = create(
      "div",
      "hcp-estate-stage",
      {
        "data-house-estate-stage": "true"
      }
    );

    var canvas = create(
      "div",
      "hcp-estate-canvas",
      {
        "data-house-estate-canvas": "true",
        "data-blueprint-layout":
          "immersive-cardinal-estate"
      }
    );

    var routeLayer = create(
      "div",
      "hcp-route-layer",
      {
        "data-house-route-layer": "true",
        "aria-hidden": "true"
      }
    );

    var roomLayer = create(
      "div",
      "hcp-room-layer",
      {
        "data-house-room-layer": "true"
      }
    );

    Object.keys(ROOMS).forEach(function appendRoom(roomId) {
      var room = ROOMS[roomId];

      if (room.visible !== false) {
        roomLayer.appendChild(
          buildRoomNode(room)
        );
      }
    });

    var avatarLayer = create(
      "div",
      "hcp-avatar-layer",
      {
        "data-house-avatar-layer": "true"
      }
    );

    Object.keys(AGENTS).forEach(function appendAvatar(agentId) {
      avatarLayer.appendChild(
        buildAvatar(AGENTS[agentId])
      );
    });

    canvas.appendChild(routeLayer);
    canvas.appendChild(roomLayer);
    canvas.appendChild(avatarLayer);
    stage.appendChild(canvas);
    viewport.appendChild(stage);

    STATE.estateViewport = viewport;
    STATE.estateStage = stage;
    STATE.estateCanvas = canvas;
    STATE.routeLayer = routeLayer;
    STATE.roomLayer = roomLayer;
    STATE.avatarLayer = avatarLayer;

    return viewport;
  }

  function buildPanel() {
    var overlay = create(
      "div",
      "hcp-overlay",
      {
        "data-house-control-pad-overlay": "true",
        "data-open": "false",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "House controller"
      }
    );

    var panel = create(
      "div",
      "hcp-panel",
      {
        "data-house-control-pad-panel": "true",
        "data-house-view-mode": VIEW_MODE.ESTATE,
        "data-house-zoom-level": "1"
      }
    );

    panel.appendChild(buildHeader());
    panel.appendChild(buildEstate());
    panel.appendChild(buildArrivalSheet());
    panel.appendChild(buildFooter());

    overlay.appendChild(panel);

    overlay.addEventListener("click", function closeBackdrop(event) {
      if (event.target === overlay) {
        closeControlPad();
      }
    });

    STATE.overlay = overlay;
    STATE.panel = panel;

    return overlay;
  }

  function render() {
    ensureRoot();

    cancelCameraTransition();
    cancelTravel();
    stopAvatarLife();

    STATE.renderToken += 1;

    if (
      STATE.overlay &&
      STATE.overlay.parentNode
    ) {
      STATE.overlay.parentNode.removeChild(
        STATE.overlay
      );
    }

    document.body.appendChild(
      buildPanel()
    );

    restoreAgentPositions();
    updateAvatarScaleStates();
    updateFocusedAvatarVisibility(null);

    STATE.initialized = true;

    document.documentElement.setAttribute(
      "data-house-control-pad-ready",
      "true"
    );

    document.documentElement.setAttribute(
      "data-house-control-pad-layout",
      "immersive-cardinal-estate"
    );

    window.dispatchEvent(
      new CustomEvent("house-control-pad:ready", {
        detail: {
          contract: CONTRACT,
          currentPageRoom: STATE.currentPageRoom,
          viewMode: STATE.viewMode,
          avatarLife: true,
          roomFirst: true,
          immersiveCamera: true,
          uniqueArchitecture: true
        }
      })
    );
  }

  function openControlPad(options) {
    options = options || {};

    if (!STATE.initialized) render();

    cancelCameraTransition();
    cancelTravel();
    hideArrivalSheet();
    hideAllRoomInformation();
    clearRoomInteractionStates();

    STATE.previousFocus = document.activeElement;
    STATE.currentPageRoom = getRoom(
      options.room || getCurrentRoomFromDOM()
    ).id;

    STATE.selectedRoom = null;
    STATE.selectedAgent = null;
    STATE.focusedRoom = null;
    STATE.previousFocusedRoom = null;

    setCurrentPageRoom(STATE.currentPageRoom);
    setViewMode(VIEW_MODE.ESTATE);

    STATE.overlay.setAttribute("data-open", "true");
    STATE.isOpen = true;

    setBodyOpen(true);
    restoreAgentPositions();
    updateAvatarScaleStates();
    updateFocusedAvatarVisibility(null);

    recordInteraction();
    startAvatarLife();

    setStatus(
      "Estate overview. Select a room to zoom in and meet its guide."
    );

    document.addEventListener(
      "keydown",
      handleKeydown
    );

    window.setTimeout(function initializeEstateView() {
      focusRoom(DEFAULT_ROOM_ID, {
        overview: true,
        immediate: true
      });

      safeFocus(STATE.estateViewport);
    }, 40);

    if (options.autoSummon) {
      window.setTimeout(function autoSummon() {
        enterRoomView(STATE.currentPageRoom);
      }, 220);
    }

    window.dispatchEvent(
      new CustomEvent("house-control-pad:open", {
        detail: {
          contract: CONTRACT,
          currentPageRoom: STATE.currentPageRoom,
          viewMode: VIEW_MODE.ESTATE
        }
      })
    );
  }

  function closeControlPad() {
    if (!STATE.overlay) return;

    cancelCameraTransition();
    cancelTravel();
    stopAvatarLife();
    hideArrivalSheet();

    STATE.overlay.setAttribute("data-open", "false");
    STATE.isOpen = false;

    setBodyOpen(false);

    document.removeEventListener(
      "keydown",
      handleKeydown
    );

    if (STATE.previousFocus) {
      safeFocus(STATE.previousFocus);
      STATE.previousFocus = null;
    }

    window.dispatchEvent(
      new CustomEvent("house-control-pad:close", {
        detail: {
          contract: CONTRACT
        }
      })
    );
  }

  function registerRoom(room) {
    if (!room || !room.id) return false;

    var id = normalize(room.id);

    ROOMS[id] = Object.assign(
      {
        id: id,
        label: id,
        shortLabel: id,
        categoryLabel: "Room",
        type: "orientation",
        route: "/",
        authority: "jeeves",

        cardinalSector: "center",
        estateWing: "central",
        rank: "small",
        architecturalShape: "technical-annex",

        x: 40,
        y: 40,
        width: 18,
        height: 14,

        labelZone: { x: 7, y: 7, width: 55, height: 20 },
        summaryZone: { x: 7, y: 31, width: 52, height: 34 },
        detailZone: { x: 7, y: 22, width: 54, height: 54 },
        portraitZone: { x: 61, y: 42, width: 30, height: 50 },
        actionZone: { x: 7, y: 79, width: 85, height: 15 },

        architecturalFeatureZones: [],
        summary: "",
        detail: "",
        visitorCan: [],
        relatedRooms: [],

        cameraFocus: {
          scale: 1.8,
          offsetX: 0,
          offsetY: 0,
          preserveCorridor: true,
          preserveDoor: null,
          framingPadding: 12,
          portraitScale: 1.7
        },

        roomBehavior: {
          idleAnchor: "portrait",
          glanceTargets: [],
          arrivalGesture: "arrive",
          ambientFeature: null
        },

        corridorAccess: [
          "core-crossing"
        ],

        visible: true
      },
      clone(room)
    );

    if (STATE.initialized) render();

    return true;
  }

  function registerAgent(agent) {
    if (!agent || !agent.id) return false;

    var id = normalize(agent.id);

    AGENTS[id] = Object.assign(
      {
        id: id,
        label: id,
        title: "Guide",
        homeRoom: DEFAULT_ROOM_ID,
        route: "/",
        actionLabel: "Talk to Guide",

        visualIdentity: {
          silhouette: "formal-upright",
          faceShape: "balanced-oval",
          hairStyle: "controlled-side-part",
          browStyle: "measured",
          eyeStyle: "composed",
          mouthStyle: "neutral",
          clothingStyle: "guide-coat",
          posture: "upright",
          accessory: "none",
          identityCue: "none"
        },

        scale: {
          overview: 1,
          room: 1.7,
          conversation: 2
        },

        blinkProfile: {
          min: 4500,
          max: 8000,
          doubleBlinkChance: 0.08,
          slowBlinkChance: 0.1,
          initialOffset: 1500
        },

        idleProfile: {
          minorGestures: ["glance"],
          mediumGestures: ["adjust"],
          rareGestures: ["stretch"],
          yawnChance: 0.05,
          yawnCooldown: 420000
        },

        arrivalGesture: "arrive",
        travelExpression: "attentive",
        focusedExpression: "focused",
        authorityLine: "",
        description: ""
      },
      clone(agent)
    );

    STATE.agentLocations[id] =
      AGENTS[id].homeRoom;

    getAvatarRuntime(id);

    if (STATE.initialized) render();

    return true;
  }

  function bindOpenButtons() {
    qa("[data-house-control-pad-open]")
      .forEach(function bindButton(button) {
        if (
          button.getAttribute(
            "data-house-control-pad-bound"
          ) === "true"
        ) {
          return;
        }

        button.setAttribute(
          "data-house-control-pad-bound",
          "true"
        );

        button.addEventListener("click", function openFromButton() {
          openControlPad({
            room:
              button.getAttribute("data-house-room") ||
              getCurrentRoomFromDOM(),

            autoSummon:
              button.getAttribute(
                "data-house-control-pad-auto-summon"
              ) === "true"
          });
        });
      });
  }

  function getRouteGraph() {
    var graph = {};

    Object.keys(ROOMS).forEach(function addRoom(roomId) {
      graph[getRoomAnchorId(roomId)] =
        getGraphNeighbors(
          getRoomAnchorId(roomId)
        );
    });

    Object.keys(CORRIDORS).forEach(function addCorridor(corridorId) {
      graph[corridorId] =
        getGraphNeighbors(corridorId);
    });

    return clone(graph);
  }

  function getEstateState() {
    return {
      contract: CONTRACT,
      initialized: STATE.initialized,
      isOpen: STATE.isOpen,
      isAnimating: STATE.isAnimating,
      reducedMotion: STATE.reducedMotion,

      viewMode: STATE.viewMode,
      zoomLevel: STATE.zoomLevel,
      focusedRoom: STATE.focusedRoom,
      previousFocusedRoom: STATE.previousFocusedRoom,
      currentPageRoom: STATE.currentPageRoom,
      selectedRoom: STATE.selectedRoom,
      selectedAgent: STATE.selectedAgent,

      cameraTransitioning: STATE.cameraTransitioning,
      activePath: STATE.activePath.slice(),
      idleStage: STATE.idleStage,
      lifeEnabled: STATE.lifeEnabled,

      agentLocations: clone(STATE.agentLocations)
    };
  }

  function cleanup() {
    cancelCameraTransition();
    cancelTravel();
    stopAvatarLife();
  }

  function boot() {
    STATE.currentPageRoom =
      getCurrentRoomFromDOM();

    detectReducedMotion();
    bindInteractionTracking();

    Object.keys(AGENTS).forEach(function initializeRuntime(agentId) {
      getAvatarRuntime(agentId);
    });

    ensureRoot();
    render();
    bindOpenButtons();

    window.addEventListener(
      "beforeunload",
      cleanup
    );

    window.HOUSE_CONTROL_PAD = {
      contract: CONTRACT,

      open: openControlPad,
      close: closeControlPad,

      travelToRoom: travelToRoom,
      enterRoomView: enterRoomView,
      returnToEstate: returnToEstate,
      focusRoom: focusRoom,

      registerRoom: registerRoom,
      registerAgent: registerAgent,

      getRouteGraph: getRouteGraph,
      getAgentLocation: getAgentLocation,
      resetAgentLocations: resetAgentLocations,
      getEstateState: getEstateState,
      getState: getEstateState,
      getViewMode: getViewMode,

      getAvatarLifeState: getAvatarLifeState,
      pauseAvatarLife: pauseAvatarLife,
      resumeAvatarLife: resumeAvatarLife,
      recordInteraction: recordInteraction,

      rooms: ROOMS,
      agents: AGENTS,
      corridors: CORRIDORS
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once: true
      }
    );
  } else {
    window.setTimeout(boot, 0);
  }
})();
