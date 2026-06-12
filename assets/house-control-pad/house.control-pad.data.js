// /assets/house-control-pad/house.control-pad.data.js
// HOUSE_CONTROL_PAD_STATIC_ESTATE_DATA_TNT_v1
// Full-file addition.
//
// Canonical five-layer House Control Pad architecture:
//
// 1. house.control-pad.data.js
//    Stable room, corridor, route, authority, camera, architecture,
//    content, and agent identity definitions.
//
// 2. house.control-pad.js
//    Controller, camera, selection, routing, travel, public API,
//    focus management, and lifecycle coordination.
//
// 3. house.avatar-life.js
//    Independent blinking, inactivity, gestures, yawns, state priority,
//    room-aware reactions, reduced-motion behavior, and timer ownership.
//
// 4. house.control-pad.css
//    Static estate architecture, panel structure, rooms, walls,
//    corridors, information zones, and responsive floor-plan presentation.
//
// 5. house.avatars.css
//    Avatar anatomy, silhouettes, clothing, accessories, eyelids,
//    pupils, expressions, gesture presentation, and animation keyframes.
//
// Separation law:
//
// Data describes.
// House CSS renders architecture.
// Controller coordinates.
// Avatar life schedules.
// Avatar CSS expresses the residents.
//
// This file owns:
// - immutable room definitions
// - room routes
// - room authority
// - room summaries and detail content
// - visitor actions
// - related-room relationships
// - room geometry
// - cardinal sectors
// - estate wings
// - architecture shape names
// - architecture feature definitions
// - room information zones
// - camera framing metadata
// - room-aware behavior metadata
// - corridor graph definitions
// - authority fallback definitions
// - immutable agent identity metadata
// - agent routes
// - avatar scale profiles
// - blink profiles
// - idle gesture catalogs
// - home-room assignments
//
// This file does not own:
// - DOM creation
// - event listeners
// - controller state
// - camera execution
// - route execution
// - pathfinding execution
// - travel execution
// - timers
// - blink scheduling
// - inactivity tracking
// - gesture scheduling
// - CSS
// - rendering
//
// Public data authority:
//
// window.HOUSE_CONTROL_PAD_DATA
//
// Consumers must treat exported data as read-only.
// Runtime state must never be written into these definitions.
//

(function bindHouseControlPadStaticEstateData(global) {
  "use strict";

  var CONTRACT = "HOUSE_CONTROL_PAD_STATIC_ESTATE_DATA_TNT_v1";
  var SCHEMA_VERSION = "1.0.0";
  var DEFAULT_ROOM_ID = "house-core";

  var VIEW_MODES = Object.freeze({
    ESTATE: "estate",
    ROOM: "room"
  });

  var IDLE_STAGES = Object.freeze({
    ACTIVE: "active",
    SETTLED: "settled",
    IDLE: "idle",
    LONG_IDLE: "long-idle"
  });

  var AVATAR_STATE_PRIORITY = Object.freeze({
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
  });

  var TIMING = Object.freeze({
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
  });

  var AUTHORITY_FALLBACK = deepFreeze({
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
  });

  var HOME_AGENT_LOCATIONS = deepFreeze({
    jeeves: "house-core",
    auren: "product-gallery",
    soren: "diagnostic-room",
    elara: "human-threshold"
  });

  var ROOMS = deepFreeze({
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

      labelZone: {
        x: 7,
        y: 8,
        width: 52,
        height: 24
      },

      summaryZone: {
        x: 7,
        y: 37,
        width: 53,
        height: 34
      },

      detailZone: {
        x: 7,
        y: 24,
        width: 57,
        height: 56
      },

      portraitZone: {
        x: 69,
        y: 26,
        width: 24,
        height: 62
      },

      actionZone: {
        x: 7,
        y: 77,
        width: 85,
        height: 18
      },

      architecturalFeatureZones: [
        {
          type: "entry-seal",
          x: 44,
          y: 66,
          width: 12,
          height: 20
        },
        {
          type: "double-door",
          x: 42,
          y: 86,
          width: 16,
          height: 12
        }
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

      labelZone: {
        x: 7,
        y: 7,
        width: 58,
        height: 22
      },

      summaryZone: {
        x: 7,
        y: 33,
        width: 53,
        height: 38
      },

      detailZone: {
        x: 7,
        y: 23,
        width: 55,
        height: 55
      },

      portraitZone: {
        x: 62,
        y: 40,
        width: 30,
        height: 50
      },

      actionZone: {
        x: 7,
        y: 80,
        width: 85,
        height: 14
      },

      architecturalFeatureZones: [
        {
          type: "angled-wall",
          x: 0,
          y: 0,
          width: 24,
          height: 100
        },
        {
          type: "threshold-light",
          x: 36,
          y: 68,
          width: 18,
          height: 18
        }
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

      labelZone: {
        x: 8,
        y: 8,
        width: 78,
        height: 22
      },

      summaryZone: {
        x: 8,
        y: 34,
        width: 78,
        height: 42
      },

      detailZone: {
        x: 8,
        y: 23,
        width: 82,
        height: 55
      },

      portraitZone: {
        x: 45,
        y: 48,
        width: 47,
        height: 44
      },

      actionZone: {
        x: 8,
        y: 79,
        width: 84,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "instrument-bay",
          x: 5,
          y: 45,
          width: 30,
          height: 42
        },
        {
          type: "gauge-bank",
          x: 7,
          y: 15,
          width: 82,
          height: 18
        }
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

      labelZone: {
        x: 7,
        y: 7,
        width: 57,
        height: 22
      },

      summaryZone: {
        x: 7,
        y: 33,
        width: 53,
        height: 38
      },

      detailZone: {
        x: 7,
        y: 23,
        width: 56,
        height: 55
      },

      portraitZone: {
        x: 61,
        y: 40,
        width: 31,
        height: 50
      },

      actionZone: {
        x: 7,
        y: 80,
        width: 85,
        height: 14
      },

      architecturalFeatureZones: [
        {
          type: "reading-apse",
          x: 63,
          y: 2,
          width: 34,
          height: 38
        },
        {
          type: "book-wall",
          x: 4,
          y: 52,
          width: 18,
          height: 38
        },
        {
          type: "reading-table",
          x: 31,
          y: 58,
          width: 24,
          height: 20
        }
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

      labelZone: {
        x: 8,
        y: 8,
        width: 80,
        height: 22
      },

      summaryZone: {
        x: 8,
        y: 34,
        width: 80,
        height: 42
      },

      detailZone: {
        x: 8,
        y: 23,
        width: 82,
        height: 55
      },

      portraitZone: {
        x: 43,
        y: 48,
        width: 49,
        height: 44
      },

      actionZone: {
        x: 8,
        y: 79,
        width: 84,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "archive-aisle",
          x: 41,
          y: 17,
          width: 18,
          height: 60
        },
        {
          type: "shelf-left",
          x: 5,
          y: 18,
          width: 28,
          height: 62
        },
        {
          type: "shelf-right",
          x: 67,
          y: 18,
          width: 28,
          height: 62
        }
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

      labelZone: {
        x: 7,
        y: 7,
        width: 56,
        height: 20
      },

      summaryZone: {
        x: 7,
        y: 31,
        width: 52,
        height: 34
      },

      detailZone: {
        x: 7,
        y: 22,
        width: 54,
        height: 54
      },

      portraitZone: {
        x: 60,
        y: 42,
        width: 32,
        height: 50
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 15
      },

      architecturalFeatureZones: [
        {
          type: "exhibit-bay",
          x: 7,
          y: 46,
          width: 20,
          height: 28
        },
        {
          type: "exhibit-bay",
          x: 31,
          y: 46,
          width: 20,
          height: 28
        },
        {
          type: "bowed-wall",
          x: 0,
          y: 7,
          width: 22,
          height: 86
        }
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

      labelZone: {
        x: 7,
        y: 6,
        width: 55,
        height: 18
      },

      summaryZone: {
        x: 7,
        y: 28,
        width: 48,
        height: 28
      },

      detailZone: {
        x: 7,
        y: 22,
        width: 51,
        height: 48
      },

      portraitZone: {
        x: 61,
        y: 39,
        width: 30,
        height: 45
      },

      actionZone: {
        x: 7,
        y: 78,
        width: 85,
        height: 14
      },

      architecturalFeatureZones: [
        {
          type: "central-seal",
          x: 36,
          y: 37,
          width: 28,
          height: 28
        },
        {
          type: "north-crossing",
          x: 42,
          y: 0,
          width: 16,
          height: 21
        },
        {
          type: "south-crossing",
          x: 42,
          y: 79,
          width: 16,
          height: 21
        },
        {
          type: "west-crossing",
          x: 0,
          y: 42,
          width: 21,
          height: 16
        },
        {
          type: "east-crossing",
          x: 79,
          y: 42,
          width: 21,
          height: 16
        }
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

      labelZone: {
        x: 7,
        y: 7,
        width: 56,
        height: 20
      },

      summaryZone: {
        x: 7,
        y: 31,
        width: 51,
        height: 34
      },

      detailZone: {
        x: 7,
        y: 22,
        width: 53,
        height: 54
      },

      portraitZone: {
        x: 60,
        y: 42,
        width: 32,
        height: 50
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 15
      },

      architecturalFeatureZones: [
        {
          type: "display-bay",
          x: 5,
          y: 47,
          width: 19,
          height: 27
        },
        {
          type: "workbench",
          x: 29,
          y: 50,
          width: 25,
          height: 20
        },
        {
          type: "service-wall",
          x: 78,
          y: 5,
          width: 17,
          height: 84
        }
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

      labelZone: {
        x: 7,
        y: 8,
        width: 56,
        height: 25
      },

      summaryZone: {
        x: 7,
        y: 38,
        width: 56,
        height: 39
      },

      detailZone: {
        x: 7,
        y: 21,
        width: 55,
        height: 58
      },

      portraitZone: {
        x: 64,
        y: 20,
        width: 28,
        height: 70
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "atlas-table",
          x: 33,
          y: 34,
          width: 28,
          height: 36
        },
        {
          type: "radial-floor",
          x: 6,
          y: 7,
          width: 86,
          height: 86
        }
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

      labelZone: {
        x: 7,
        y: 13,
        width: 55,
        height: 34
      },

      summaryZone: {
        x: 7,
        y: 50,
        width: 55,
        height: 38
      },

      detailZone: {
        x: 7,
        y: 21,
        width: 54,
        height: 58
      },

      portraitZone: {
        x: 69,
        y: 8,
        width: 24,
        height: 84
      },

      actionZone: {
        x: 7,
        y: 77,
        width: 85,
        height: 18
      },

      architecturalFeatureZones: [
        {
          type: "hearth-fire",
          x: 35,
          y: 24,
          width: 24,
          height: 45
        },
        {
          type: "rounded-wall",
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }
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

      labelZone: {
        x: 7,
        y: 7,
        width: 54,
        height: 20
      },

      summaryZone: {
        x: 7,
        y: 31,
        width: 51,
        height: 34
      },

      detailZone: {
        x: 7,
        y: 22,
        width: 54,
        height: 54
      },

      portraitZone: {
        x: 61,
        y: 42,
        width: 30,
        height: 50
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 15
      },

      architecturalFeatureZones: [
        {
          type: "portrait-niche",
          x: 5,
          y: 42,
          width: 14,
          height: 35
        },
        {
          type: "portrait-niche",
          x: 22,
          y: 42,
          width: 14,
          height: 35
        },
        {
          type: "portrait-niche",
          x: 39,
          y: 42,
          width: 14,
          height: 35
        },
        {
          type: "portrait-niche",
          x: 56,
          y: 42,
          width: 14,
          height: 35
        }
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

      labelZone: {
        x: 7,
        y: 8,
        width: 55,
        height: 25
      },

      summaryZone: {
        x: 7,
        y: 39,
        width: 54,
        height: 38
      },

      detailZone: {
        x: 7,
        y: 21,
        width: 54,
        height: 58
      },

      portraitZone: {
        x: 65,
        y: 17,
        width: 27,
        height: 74
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "teaching-wall",
          x: 7,
          y: 18,
          width: 52,
          height: 18
        },
        {
          type: "tier",
          x: 9,
          y: 48,
          width: 46,
          height: 9
        },
        {
          type: "tier",
          x: 9,
          y: 61,
          width: 46,
          height: 9
        }
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

      labelZone: {
        x: 7,
        y: 10,
        width: 78,
        height: 30
      },

      summaryZone: {
        x: 7,
        y: 47,
        width: 78,
        height: 38
      },

      detailZone: {
        x: 7,
        y: 24,
        width: 78,
        height: 55
      },

      portraitZone: {
        x: 51,
        y: 43,
        width: 41,
        height: 49
      },

      actionZone: {
        x: 7,
        y: 79,
        width: 85,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "diagnostic-seal",
          x: 24,
          y: 35,
          width: 30,
          height: 38
        },
        {
          type: "controlled-entry",
          x: 0,
          y: 39,
          width: 16,
          height: 22
        }
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

      labelZone: {
        x: 8,
        y: 9,
        width: 84,
        height: 30
      },

      summaryZone: {
        x: 8,
        y: 46,
        width: 84,
        height: 40
      },

      detailZone: {
        x: 8,
        y: 23,
        width: 84,
        height: 57
      },

      portraitZone: {
        x: 46,
        y: 44,
        width: 46,
        height: 48
      },

      actionZone: {
        x: 8,
        y: 79,
        width: 84,
        height: 16
      },

      architecturalFeatureZones: [
        {
          type: "future-bay",
          x: 54,
          y: 5,
          width: 42,
          height: 42
        },
        {
          type: "workbench",
          x: 9,
          y: 51,
          width: 39,
          height: 24
        }
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
  });

  var AGENTS = deepFreeze({
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
  });

  var CORRIDORS = deepFreeze({
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
  });

  var ROUTE_ROOM_HINTS = deepFreeze([
    {
      prefix: "/meet-sean-mansfield/",
      roomId: "human-threshold"
    },
    {
      prefix: "/nine-summits-of-love/",
      roomId: "book-chamber"
    },
    {
      prefix: "/elara/",
      roomId: "human-threshold"
    },
    {
      prefix: "/products/auren/",
      roomId: "product-gallery"
    },
    {
      prefix: "/products/education/",
      roomId: "education-room"
    },
    {
      prefix: "/products/",
      roomId: "product-gallery"
    },
    {
      prefix: "/coherence-diagnostic/",
      roomId: "diagnostic-room"
    },
    {
      prefix: "/showroom/globe/hearth/",
      roomId: "hearth-room"
    },
    {
      prefix: "/showroom/globe/",
      roomId: "atlas-study"
    },
    {
      prefix: "/showroom/",
      roomId: "showroom"
    },
    {
      prefix: "/site-guide/",
      roomId: "guide-foyer"
    },
    {
      prefix: "/gauges/",
      roomId: "lab"
    },
    {
      prefix: "/laws/",
      roomId: "law-library"
    },
    {
      prefix: "/characters/",
      roomId: "portrait-hall"
    },
    {
      prefix: "/explore/frontier/",
      roomId: "frontier-workshop"
    }
  ]);

  var ARCHITECTURAL_SHAPES = deepFreeze([
    "great-hall",
    "formal-foyer",
    "angled-threshold",
    "book-apse",
    "archive-aisle",
    "bowed-atrium",
    "workshop-gallery",
    "round-study",
    "rounded-hearth",
    "portrait-gallery",
    "tiered-classroom",
    "hex-diagnostic",
    "technical-annex",
    "frontier-wedge"
  ]);

  var ROOM_TYPES = deepFreeze([
    "orientation",
    "human",
    "book",
    "proof",
    "law",
    "showroom",
    "world",
    "product",
    "diagnostic",
    "frontier",
    "future-character"
  ]);

  var ROOM_RANKS = deepFreeze([
    "small",
    "medium",
    "grand"
  ]);

  var DATA = {
    contract: CONTRACT,
    schemaVersion: SCHEMA_VERSION,
    defaultRoomId: DEFAULT_ROOM_ID,

    viewModes: VIEW_MODES,
    idleStages: IDLE_STAGES,
    avatarStatePriority: AVATAR_STATE_PRIORITY,
    timing: TIMING,

    authorityFallback: AUTHORITY_FALLBACK,
    homeAgentLocations: HOME_AGENT_LOCATIONS,

    rooms: ROOMS,
    agents: AGENTS,
    corridors: CORRIDORS,

    routeRoomHints: ROUTE_ROOM_HINTS,
    architecturalShapes: ARCHITECTURAL_SHAPES,
    roomTypes: ROOM_TYPES,
    roomRanks: ROOM_RANKS,

    getRoom: getRoom,
    getAgent: getAgent,
    getCorridor: getCorridor,
    roomExists: roomExists,
    agentExists: agentExists,
    corridorExists: corridorExists,
    resolveAuthority: resolveAuthority,
    resolveRoomFromPath: resolveRoomFromPath,
    createRuntimeCopy: createRuntimeCopy,
    getValidationReport: getValidationReport
  };

  deepFreeze(DATA);

  global.HOUSE_CONTROL_PAD_DATA = DATA;

  try {
    global.dispatchEvent(
      new CustomEvent("house-control-pad:data-ready", {
        detail: {
          contract: CONTRACT,
          schemaVersion: SCHEMA_VERSION,
          defaultRoomId: DEFAULT_ROOM_ID,
          roomCount: Object.keys(ROOMS).length,
          agentCount: Object.keys(AGENTS).length,
          corridorCount: Object.keys(CORRIDORS).length
        }
      })
    );
  } catch (error) {
    // The data authority remains available even where CustomEvent is limited.
  }

  function roomExists(roomId) {
    return Boolean(
      typeof roomId === "string" &&
      Object.prototype.hasOwnProperty.call(ROOMS, roomId)
    );
  }

  function agentExists(agentId) {
    return Boolean(
      typeof agentId === "string" &&
      Object.prototype.hasOwnProperty.call(AGENTS, agentId)
    );
  }

  function corridorExists(corridorId) {
    return Boolean(
      typeof corridorId === "string" &&
      Object.prototype.hasOwnProperty.call(
        CORRIDORS,
        corridorId
      )
    );
  }

  function getRoom(roomId) {
    if (roomExists(roomId)) {
      return ROOMS[roomId];
    }

    return ROOMS[DEFAULT_ROOM_ID];
  }

  function getAgent(agentId) {
    if (agentExists(agentId)) {
      return AGENTS[agentId];
    }

    return AGENTS.jeeves;
  }

  function getCorridor(corridorId) {
    if (corridorExists(corridorId)) {
      return CORRIDORS[corridorId];
    }

    return null;
  }

  function resolveAuthority(roomOrRoomId) {
    var room =
      typeof roomOrRoomId === "string"
        ? getRoom(roomOrRoomId)
        : roomOrRoomId;

    if (!room) {
      return "jeeves";
    }

    if (agentExists(room.authority)) {
      return room.authority;
    }

    if (
      typeof room.type === "string" &&
      Object.prototype.hasOwnProperty.call(
        AUTHORITY_FALLBACK,
        room.type
      )
    ) {
      return AUTHORITY_FALLBACK[room.type];
    }

    return "jeeves";
  }

  function resolveRoomFromPath(pathname) {
    var route = normalizeRoute(pathname);

    var exactRoomId = Object.keys(ROOMS).find(
      function findExactRoom(roomId) {
        return normalizeRoute(ROOMS[roomId].route) === route;
      }
    );

    if (exactRoomId) {
      return exactRoomId;
    }

    for (
      var i = 0;
      i < ROUTE_ROOM_HINTS.length;
      i += 1
    ) {
      var hint = ROUTE_ROOM_HINTS[i];

      if (route.indexOf(hint.prefix) === 0) {
        return hint.roomId;
      }
    }

    return DEFAULT_ROOM_ID;
  }

  function normalizeRoute(pathname) {
    var value =
      typeof pathname === "string"
        ? pathname.trim()
        : "/";

    if (!value) {
      return "/";
    }

    if (value.charAt(0) !== "/") {
      value = "/" + value;
    }

    return value.replace(/\/+$/, "/");
  }

  function createRuntimeCopy() {
    return {
      authorityFallback: deepClone(AUTHORITY_FALLBACK),
      homeAgentLocations: deepClone(HOME_AGENT_LOCATIONS),
      rooms: deepClone(ROOMS),
      agents: deepClone(AGENTS),
      corridors: deepClone(CORRIDORS),
      routeRoomHints: deepClone(ROUTE_ROOM_HINTS),
      timing: deepClone(TIMING),
      avatarStatePriority: deepClone(
        AVATAR_STATE_PRIORITY
      )
    };
  }

  function getValidationReport() {
    var errors = [];
    var warnings = [];

    Object.keys(ROOMS).forEach(
      function validateRoom(roomId) {
        var room = ROOMS[roomId];

        if (room.id !== roomId) {
          errors.push(
            "Room key and room.id differ: " + roomId
          );
        }

        if (!agentExists(room.authority)) {
          errors.push(
            "Unknown authority for room " +
            roomId +
            ": " +
            room.authority
          );
        }

        if (
          ARCHITECTURAL_SHAPES.indexOf(
            room.architecturalShape
          ) === -1
        ) {
          errors.push(
            "Unknown architecturalShape for room " +
            roomId +
            ": " +
            room.architecturalShape
          );
        }

        if (ROOM_TYPES.indexOf(room.type) === -1) {
          errors.push(
            "Unknown room type for room " +
            roomId +
            ": " +
            room.type
          );
        }

        if (ROOM_RANKS.indexOf(room.rank) === -1) {
          errors.push(
            "Unknown room rank for room " +
            roomId +
            ": " +
            room.rank
          );
        }

        if (!Array.isArray(room.corridorAccess)) {
          errors.push(
            "corridorAccess must be an array for room " +
            roomId
          );
        } else {
          room.corridorAccess.forEach(
            function validateRoomCorridor(corridorId) {
              if (!corridorExists(corridorId)) {
                errors.push(
                  "Room " +
                  roomId +
                  " references unknown corridor " +
                  corridorId
                );
              }
            }
          );
        }

        if (!Array.isArray(room.relatedRooms)) {
          warnings.push(
            "relatedRooms is not an array for room " +
            roomId
          );
        } else {
          room.relatedRooms.forEach(
            function validateRelatedRoom(relatedRoomId) {
              if (!roomExists(relatedRoomId)) {
                errors.push(
                  "Room " +
                  roomId +
                  " references unknown related room " +
                  relatedRoomId
                );
              }
            }
          );
        }

        validateZone(
          roomId,
          "labelZone",
          room.labelZone,
          errors
        );

        validateZone(
          roomId,
          "summaryZone",
          room.summaryZone,
          errors
        );

        validateZone(
          roomId,
          "detailZone",
          room.detailZone,
          errors
        );

        validateZone(
          roomId,
          "portraitZone",
          room.portraitZone,
          errors
        );

        validateZone(
          roomId,
          "actionZone",
          room.actionZone,
          errors
        );

        if (
          !room.cameraFocus ||
          typeof room.cameraFocus.scale !== "number"
        ) {
          errors.push(
            "Missing camera scale for room " +
            roomId
          );
        }

        if (
          room.cameraFocus &&
          room.cameraFocus.preserveDoor &&
          !corridorExists(
            room.cameraFocus.preserveDoor
          )
        ) {
          warnings.push(
            "Room " +
            roomId +
            " preserveDoor references a non-corridor identifier: " +
            room.cameraFocus.preserveDoor
          );
        }
      }
    );

    Object.keys(AGENTS).forEach(
      function validateAgent(agentId) {
        var agent = AGENTS[agentId];

        if (agent.id !== agentId) {
          errors.push(
            "Agent key and agent.id differ: " +
            agentId
          );
        }

        if (!roomExists(agent.homeRoom)) {
          errors.push(
            "Agent " +
            agentId +
            " references unknown home room " +
            agent.homeRoom
          );
        }

        if (
          !agent.blinkProfile ||
          typeof agent.blinkProfile.min !== "number" ||
          typeof agent.blinkProfile.max !== "number"
        ) {
          errors.push(
            "Agent " +
            agentId +
            " has an invalid blink profile."
          );
        }

        if (
          agent.blinkProfile &&
          agent.blinkProfile.min >
            agent.blinkProfile.max
        ) {
          errors.push(
            "Agent " +
            agentId +
            " blink minimum exceeds maximum."
          );
        }
      }
    );

    Object.keys(CORRIDORS).forEach(
      function validateCorridor(corridorId) {
        var corridor = CORRIDORS[corridorId];

        if (corridor.id !== corridorId) {
          errors.push(
            "Corridor key and corridor.id differ: " +
            corridorId
          );
        }

        if (!Array.isArray(corridor.connections)) {
          errors.push(
            "Corridor connections must be an array: " +
            corridorId
          );

          return;
        }

        corridor.connections.forEach(
          function validateConnection(connectionId) {
            if (connectionId.indexOf("room:") === 0) {
              var roomId = connectionId.slice(5);

              if (!roomExists(roomId)) {
                errors.push(
                  "Corridor " +
                  corridorId +
                  " references unknown room " +
                  roomId
                );
              }

              return;
            }

            if (!corridorExists(connectionId)) {
              errors.push(
                "Corridor " +
                corridorId +
                " references unknown corridor " +
                connectionId
              );
            }
          }
        );
      }
    );

    return {
      contract: CONTRACT,
      schemaVersion: SCHEMA_VERSION,
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings,
      counts: {
        rooms: Object.keys(ROOMS).length,
        agents: Object.keys(AGENTS).length,
        corridors: Object.keys(CORRIDORS).length
      }
    };
  }

  function validateZone(
    roomId,
    zoneName,
    zone,
    errors
  ) {
    if (!zone || typeof zone !== "object") {
      errors.push(
        "Missing " +
        zoneName +
        " for room " +
        roomId
      );

      return;
    }

    [
      "x",
      "y",
      "width",
      "height"
    ].forEach(function validateZoneValue(key) {
      if (typeof zone[key] !== "number") {
        errors.push(
          "Invalid " +
          zoneName +
          "." +
          key +
          " for room " +
          roomId
        );
      }
    });
  }

  function deepClone(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(deepClone);
    }

    var copy = {};

    Object.keys(value).forEach(
      function cloneProperty(key) {
        copy[key] = deepClone(value[key]);
      }
    );

    return copy;
  }

  function deepFreeze(value) {
    if (
      value === null ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.keys(value).forEach(
      function freezeProperty(key) {
        deepFreeze(value[key]);
      }
    );

    return Object.freeze(value);
  }
})(window);
