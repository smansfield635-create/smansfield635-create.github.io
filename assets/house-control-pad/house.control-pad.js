// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_CARDINAL_ESTATE_ROUTE_GRAPH_JS_TNT_v4
// Full-file replacement.
//
// Purpose:
// - Render the House as an estate floor plan.
// - Preserve cardinal placement as the estate's hidden structural law.
// - Represent every canonical room as a visible architectural container.
// - Separate room labels from avatar portrait zones.
// - Route guides through declared doors and corridors.
// - Prevent movement through walls.
// - Preserve guide locations during the active controller session.
// - Prevent same-room travel animation.
// - Cancel stale travel operations before a new movement begins.
// - Keep the estate blueprint as the primary controller.
// - Keep character-first routing deferred to Portrait Hall.
//
// Required companion:
// - /assets/house-control-pad/house.control-pad.css
//
// Public API preserved:
// - window.HOUSE_CONTROL_PAD.open({ room: "book-chamber" })
// - window.HOUSE_CONTROL_PAD.close()
// - window.HOUSE_CONTROL_PAD.travelToRoom("product-gallery")
// - window.HOUSE_CONTROL_PAD.registerRoom({...})
// - window.HOUSE_CONTROL_PAD.registerAgent({...})
//
// Public API added:
// - window.HOUSE_CONTROL_PAD.getRouteGraph()
// - window.HOUSE_CONTROL_PAD.getAgentLocation("auren")
// - window.HOUSE_CONTROL_PAD.resetAgentLocations()
// - window.HOUSE_CONTROL_PAD.focusRoom("book-chamber")
// - window.HOUSE_CONTROL_PAD.getEstateState()
//
// Authority law:
// - The visitor selects a room.
// - The room determines authority.
// - The route graph determines how the guide arrives.
//

(function houseControlPadCardinalEstateRouteGraph() {
  "use strict";

  var CONTRACT = "HOUSE_CONTROL_PAD_CARDINAL_ESTATE_ROUTE_GRAPH_JS_TNT_v4";
  var DEFAULT_ROOM_ID = "house-core";
  var TRAVEL_SEGMENT_MS = 260;
  var TRAVEL_SETTLE_MS = 120;

  var STATE = {
    initialized: false,
    isOpen: false,
    isAnimating: false,

    currentPageRoom: DEFAULT_ROOM_ID,
    selectedRoom: null,
    selectedAgent: null,

    activePath: [],
    travelToken: 0,
    travelTimers: [],

    root: null,
    overlay: null,
    panel: null,
    estateViewport: null,
    estateCanvas: null,
    avatarLayer: null,
    arrivalSheet: null,
    status: null,

    previousFocus: null,

    agentLocations: {
      jeeves: "house-core",
      auren: "product-gallery",
      soren: "diagnostic-room",
      elara: "human-threshold"
    }
  };

  /*
    ESTATE GEOMETRY LAW

    All x, y, width, and height values are percentages of the estate canvas.

    labelZone and portraitZone are room-local percentages.

    labelZone:
    - reserved for room naming
    - must not be occupied by a portrait

    portraitZone:
    - reserved for guide placement
    - must not block a doorway
  */

  var ROOMS = {
    "guide-foyer": {
      id: "guide-foyer",
      label: "Guide Foyer",
      shortLabel: "Guide Foyer",
      type: "orientation",
      route: "/site-guide/",
      authority: "jeeves",

      cardinalSector: "north",
      estateWing: "north",
      rank: "small",

      x: 31,
      y: 3,
      width: 38,
      height: 13,

      labelZone: {
        x: 7,
        y: 10,
        width: 54,
        height: 28
      },

      portraitZone: {
        x: 69,
        y: 30,
        width: 24,
        height: 58
      },

      doors: [
        "door-guide-north-corridor",
        "door-guide-human",
        "door-guide-book"
      ],

      corridorAccess: [
        "north-entry-corridor"
      ],

      visible: true,

      description:
        "The formal entry and practical orientation threshold of the estate."
    },

    "human-threshold": {
      id: "human-threshold",
      label: "Human Threshold",
      shortLabel: "Human Threshold",
      type: "human",
      route: "/meet-sean-mansfield/",
      authority: "elara",

      cardinalSector: "northwest",
      estateWing: "west",
      rank: "medium",

      x: 3,
      y: 3,
      width: 25,
      height: 22,

      labelZone: {
        x: 7,
        y: 8,
        width: 58,
        height: 26
      },

      portraitZone: {
        x: 60,
        y: 43,
        width: 32,
        height: 48
      },

      doors: [
        "door-guide-human",
        "door-human-west-corridor",
        "door-human-lab"
      ],

      corridorAccess: [
        "northwest-wing-corridor",
        "west-main-corridor"
      ],

      visible: true,

      description:
        "The human threshold and the room introducing Sean and the voice behind the House."
    },

    "lab": {
      id: "lab",
      label: "The Lab",
      shortLabel: "The Lab",
      type: "proof",
      route: "/gauges/",
      authority: "jeeves",

      cardinalSector: "northwest",
      estateWing: "west",
      rank: "small",

      x: 3,
      y: 28,
      width: 12,
      height: 16,

      labelZone: {
        x: 8,
        y: 9,
        width: 78,
        height: 28
      },

      portraitZone: {
        x: 48,
        y: 46,
        width: 44,
        height: 46
      },

      doors: [
        "door-human-lab",
        "door-lab-west-corridor"
      ],

      corridorAccess: [
        "northwest-wing-corridor",
        "west-main-corridor"
      ],

      visible: true,

      description:
        "The instrumentation, gauges, proof surfaces, and technical testing room."
    },

    "book-chamber": {
      id: "book-chamber",
      label: "Book Chamber",
      shortLabel: "Book Chamber",
      type: "book",
      route: "/nine-summits-of-love/",
      authority: "elara",

      cardinalSector: "northeast",
      estateWing: "east",
      rank: "medium",

      x: 72,
      y: 3,
      width: 25,
      height: 22,

      labelZone: {
        x: 7,
        y: 8,
        width: 58,
        height: 26
      },

      portraitZone: {
        x: 58,
        y: 43,
        width: 34,
        height: 48
      },

      doors: [
        "door-guide-book",
        "door-book-east-corridor",
        "door-book-law"
      ],

      corridorAccess: [
        "northeast-wing-corridor",
        "east-main-corridor"
      ],

      visible: true,

      description:
        "The Nine Summits of Love and the climb toward Love."
    },

    "law-library": {
      id: "law-library",
      label: "Law Library",
      shortLabel: "Law Library",
      type: "law",
      route: "/laws/",
      authority: "jeeves",

      cardinalSector: "northeast",
      estateWing: "east",
      rank: "small",

      x: 85,
      y: 28,
      width: 12,
      height: 16,

      labelZone: {
        x: 8,
        y: 9,
        width: 80,
        height: 28
      },

      portraitZone: {
        x: 45,
        y: 46,
        width: 47,
        height: 46
      },

      doors: [
        "door-book-law",
        "door-law-east-corridor"
      ],

      corridorAccess: [
        "northeast-wing-corridor",
        "east-main-corridor"
      ],

      visible: true,

      description:
        "The formal study for laws, governance, proof language, and canonical structure."
    },

    "showroom": {
      id: "showroom",
      label: "Showroom / Atrium",
      shortLabel: "Showroom",
      type: "showroom",
      route: "/showroom/",
      authority: "jeeves",

      cardinalSector: "west",
      estateWing: "west",
      rank: "grand",

      x: 3,
      y: 47,
      width: 25,
      height: 27,

      labelZone: {
        x: 7,
        y: 7,
        width: 56,
        height: 24
      },

      portraitZone: {
        x: 58,
        y: 46,
        width: 34,
        height: 45
      },

      doors: [
        "door-showroom-west-corridor",
        "door-showroom-atlas",
        "door-showroom-core"
      ],

      corridorAccess: [
        "west-main-corridor",
        "core-crossing"
      ],

      visible: true,

      description:
        "The public atrium and visible proof-object entry of the House."
    },

    "house-core": {
      id: "house-core",
      label: "House Core / Great Hall",
      shortLabel: "House Core",
      type: "orientation",
      route: "/",
      authority: "jeeves",

      cardinalSector: "center",
      estateWing: "central",
      rank: "grand",

      x: 32,
      y: 23,
      width: 36,
      height: 47,

      labelZone: {
        x: 7,
        y: 7,
        width: 57,
        height: 23
      },

      portraitZone: {
        x: 57,
        y: 43,
        width: 34,
        height: 46
      },

      doors: [
        "door-core-north",
        "door-showroom-core",
        "door-product-core",
        "door-core-portrait"
      ],

      corridorAccess: [
        "north-entry-corridor",
        "west-main-corridor",
        "east-main-corridor",
        "core-crossing",
        "south-gallery-corridor"
      ],

      visible: true,

      description:
        "The central Great Hall, circulation anchor, and whole-House orientation room."
    },

    "product-gallery": {
      id: "product-gallery",
      label: "Product Gallery",
      shortLabel: "Product Gallery",
      type: "product",
      route: "/products/",
      authority: "auren",

      cardinalSector: "east",
      estateWing: "east",
      rank: "grand",

      x: 72,
      y: 47,
      width: 25,
      height: 27,

      labelZone: {
        x: 7,
        y: 7,
        width: 56,
        height: 24
      },

      portraitZone: {
        x: 58,
        y: 46,
        width: 34,
        height: 45
      },

      doors: [
        "door-product-east-corridor",
        "door-product-education",
        "door-product-core"
      ],

      corridorAccess: [
        "east-main-corridor",
        "core-crossing"
      ],

      visible: true,

      description:
        "The practical product floor, tools, and public value gallery."
    },

    "atlas-study": {
      id: "atlas-study",
      label: "Atlas Study",
      shortLabel: "Atlas Study",
      type: "world",
      route: "/showroom/globe/",
      authority: "jeeves",

      cardinalSector: "southwest",
      estateWing: "west",
      rank: "medium",

      x: 3,
      y: 77,
      width: 25,
      height: 12,

      labelZone: {
        x: 7,
        y: 10,
        width: 55,
        height: 35
      },

      portraitZone: {
        x: 62,
        y: 25,
        width: 30,
        height: 65
      },

      doors: [
        "door-showroom-atlas",
        "door-atlas-hearth",
        "door-atlas-southwest-corridor"
      ],

      corridorAccess: [
        "southwest-corridor",
        "south-gallery-corridor"
      ],

      visible: true,

      description:
        "The study for worlds, planets, maps, and atlas navigation."
    },

    "hearth-room": {
      id: "hearth-room",
      label: "Hearth Room",
      shortLabel: "Hearth Room",
      type: "world",
      route: "/showroom/globe/hearth/",
      authority: "jeeves",

      cardinalSector: "southwest",
      estateWing: "west",
      rank: "small",

      x: 3,
      y: 91,
      width: 25,
      height: 7,

      labelZone: {
        x: 7,
        y: 18,
        width: 58,
        height: 48
      },

      portraitZone: {
        x: 70,
        y: 12,
        width: 23,
        height: 76
      },

      doors: [
        "door-atlas-hearth"
      ],

      corridorAccess: [
        "southwest-corridor"
      ],

      visible: true,

      description:
        "The intimate Hearth world room and planetary lane."
    },

    "portrait-hall": {
      id: "portrait-hall",
      label: "Portrait Hall",
      shortLabel: "Portrait Hall",
      type: "future-character",
      route: "/characters/",
      authority: "jeeves",

      cardinalSector: "south",
      estateWing: "south",
      rank: "grand",

      x: 32,
      y: 73,
      width: 36,
      height: 25,

      labelZone: {
        x: 7,
        y: 8,
        width: 58,
        height: 25
      },

      portraitZone: {
        x: 58,
        y: 45,
        width: 34,
        height: 46
      },

      doors: [
        "door-core-portrait",
        "door-portrait-southwest",
        "door-portrait-southeast"
      ],

      corridorAccess: [
        "south-gallery-corridor",
        "southwest-corridor",
        "southeast-corridor"
      ],

      visible: true,

      description:
        "The future character-first routing gallery and southern circulation anchor."
    },

    "education-room": {
      id: "education-room",
      label: "Education Room",
      shortLabel: "Education",
      type: "product",
      route: "/products/education/",
      authority: "auren",

      cardinalSector: "east",
      estateWing: "east",
      rank: "medium",

      x: 72,
      y: 77,
      width: 25,
      height: 10,

      labelZone: {
        x: 7,
        y: 10,
        width: 56,
        height: 38
      },

      portraitZone: {
        x: 63,
        y: 22,
        width: 29,
        height: 68
      },

      doors: [
        "door-product-education",
        "door-education-diagnostic",
        "door-education-southeast-corridor"
      ],

      corridorAccess: [
        "southeast-corridor",
        "south-gallery-corridor"
      ],

      visible: true,

      description:
        "The education chamber for learning systems and 1,001 Traversal."
    },

    "diagnostic-room": {
      id: "diagnostic-room",
      label: "Diagnostic Room",
      shortLabel: "Diagnostic",
      type: "diagnostic",
      route: "/coherence-diagnostic/",
      authority: "soren",

      cardinalSector: "southeast",
      estateWing: "east",
      rank: "medium",

      x: 72,
      y: 89,
      width: 14,
      height: 9,

      labelZone: {
        x: 7,
        y: 12,
        width: 76,
        height: 34
      },

      portraitZone: {
        x: 49,
        y: 42,
        width: 43,
        height: 50
      },

      doors: [
        "door-education-diagnostic",
        "door-diagnostic-frontier",
        "door-diagnostic-southeast-corridor"
      ],

      corridorAccess: [
        "southeast-corridor"
      ],

      visible: true,

      description:
        "The coherence diagnostic boundary and assessment orientation room."
    },

    "frontier-workshop": {
      id: "frontier-workshop",
      label: "Frontier Workshop",
      shortLabel: "Frontier",
      type: "frontier",
      route: "/explore/frontier/",
      authority: "auren",

      cardinalSector: "southeast",
      estateWing: "east",
      rank: "small",

      x: 88,
      y: 89,
      width: 9,
      height: 9,

      labelZone: {
        x: 8,
        y: 10,
        width: 84,
        height: 38
      },

      portraitZone: {
        x: 46,
        y: 46,
        width: 46,
        height: 46
      },

      doors: [
        "door-diagnostic-frontier"
      ],

      corridorAccess: [
        "southeast-corridor"
      ],

      visible: true,

      description:
        "The specialized workshop for frontier systems and experimental applied lanes."
    }
  };

  var AGENTS = {
    jeeves: {
      id: "jeeves",
      label: "Jeeves",
      title: "House Guide",
      homeRoom: "house-core",
      route: "/showroom/globe/hearth/jeeves/",
      palette: "jeeves",
      face: "butler",
      actionLabel: "Ask Jeeves",
      authorityLine:
        "Jeeves has authority for whole-House orientation, the Showroom, the Atlas, the Lab, the Law Library, and the Portrait Hall.",
      description:
        "Whole-House orientation, map, circulation, and placement."
    },

    auren: {
      id: "auren",
      label: "Auren",
      title: "Product Guide",
      homeRoom: "product-gallery",
      route: "/products/auren/",
      palette: "auren",
      face: "maker",
      actionLabel: "Talk to Auren",
      authorityLine:
        "Auren has authority for products, practical tools, Education, 1,001 Traversal, and the Frontier Workshop.",
      description:
        "Product floor, practical tools, applied systems, and Education."
    },

    soren: {
      id: "soren",
      label: "Soren",
      title: "Diagnostic Guide",
      homeRoom: "diagnostic-room",
      route: "/coherence-diagnostic/",
      palette: "soren",
      face: "diagnostic",
      actionLabel: "Talk to Soren",
      authorityLine:
        "Soren has authority for the Diagnostic Room, coherence boundaries, and assessment orientation.",
      description:
        "Diagnostic boundary, coherence orientation, and assessment logic."
    },

    elara: {
      id: "elara",
      label: "Elara",
      title: "Signal Bearer",
      homeRoom: "human-threshold",
      route: "/elara/",
      palette: "elara",
      face: "signal",
      actionLabel: "Talk to Elara",
      authorityLine:
        "Elara has authority for the Human Threshold, Sean, the Book Chamber, and Mirrorland’s climate.",
      description:
        "Human threshold, the Book Chamber, and Mirrorland’s climate."
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

  /*
    DOOR LAW

    Doors are architectural openings and graph edges.

    side:
    - north
    - east
    - south
    - west

    position:
    - percentage along the selected room wall

    graphNode:
    - route-graph node reached through the door
  */

  var DOORS = {
    "door-guide-north-corridor": {
      id: "door-guide-north-corridor",
      room: "guide-foyer",
      side: "south",
      position: 50,
      width: 14,
      graphNode: "north-entry-corridor"
    },

    "door-guide-human": {
      id: "door-guide-human",
      room: "guide-foyer",
      side: "west",
      position: 58,
      width: 15,
      graphNode: "northwest-wing-corridor"
    },

    "door-guide-book": {
      id: "door-guide-book",
      room: "guide-foyer",
      side: "east",
      position: 58,
      width: 15,
      graphNode: "northeast-wing-corridor"
    },

    "door-human-west-corridor": {
      id: "door-human-west-corridor",
      room: "human-threshold",
      side: "south",
      position: 70,
      width: 15,
      graphNode: "west-main-corridor"
    },

    "door-human-lab": {
      id: "door-human-lab",
      room: "human-threshold",
      side: "south",
      position: 24,
      width: 14,
      graphNode: "northwest-wing-corridor"
    },

    "door-lab-west-corridor": {
      id: "door-lab-west-corridor",
      room: "lab",
      side: "east",
      position: 64,
      width: 18,
      graphNode: "west-main-corridor"
    },

    "door-book-east-corridor": {
      id: "door-book-east-corridor",
      room: "book-chamber",
      side: "south",
      position: 30,
      width: 15,
      graphNode: "east-main-corridor"
    },

    "door-book-law": {
      id: "door-book-law",
      room: "book-chamber",
      side: "south",
      position: 78,
      width: 14,
      graphNode: "northeast-wing-corridor"
    },

    "door-law-east-corridor": {
      id: "door-law-east-corridor",
      room: "law-library",
      side: "west",
      position: 64,
      width: 18,
      graphNode: "east-main-corridor"
    },

    "door-core-north": {
      id: "door-core-north",
      room: "house-core",
      side: "north",
      position: 50,
      width: 12,
      graphNode: "north-entry-corridor"
    },

    "door-showroom-west-corridor": {
      id: "door-showroom-west-corridor",
      room: "showroom",
      side: "east",
      position: 43,
      width: 14,
      graphNode: "west-main-corridor"
    },

    "door-showroom-core": {
      id: "door-showroom-core",
      room: "showroom",
      side: "east",
      position: 70,
      width: 14,
      graphNode: "core-crossing"
    },

    "door-showroom-atlas": {
      id: "door-showroom-atlas",
      room: "showroom",
      side: "south",
      position: 52,
      width: 15,
      graphNode: "southwest-corridor"
    },

    "door-product-east-corridor": {
      id: "door-product-east-corridor",
      room: "product-gallery",
      side: "west",
      position: 43,
      width: 14,
      graphNode: "east-main-corridor"
    },

    "door-product-core": {
      id: "door-product-core",
      room: "product-gallery",
      side: "west",
      position: 70,
      width: 14,
      graphNode: "core-crossing"
    },

    "door-product-education": {
      id: "door-product-education",
      room: "product-gallery",
      side: "south",
      position: 52,
      width: 15,
      graphNode: "southeast-corridor"
    },

    "door-core-portrait": {
      id: "door-core-portrait",
      room: "house-core",
      side: "south",
      position: 50,
      width: 13,
      graphNode: "south-gallery-corridor"
    },

    "door-atlas-southwest-corridor": {
      id: "door-atlas-southwest-corridor",
      room: "atlas-study",
      side: "east",
      position: 52,
      width: 17,
      graphNode: "southwest-corridor"
    },

    "door-atlas-hearth": {
      id: "door-atlas-hearth",
      room: "atlas-study",
      side: "south",
      position: 54,
      width: 17,
      graphNode: "southwest-corridor"
    },

    "door-portrait-southwest": {
      id: "door-portrait-southwest",
      room: "portrait-hall",
      side: "west",
      position: 43,
      width: 14,
      graphNode: "southwest-corridor"
    },

    "door-portrait-southeast": {
      id: "door-portrait-southeast",
      room: "portrait-hall",
      side: "east",
      position: 43,
      width: 14,
      graphNode: "southeast-corridor"
    },

    "door-education-southeast-corridor": {
      id: "door-education-southeast-corridor",
      room: "education-room",
      side: "west",
      position: 52,
      width: 18,
      graphNode: "southeast-corridor"
    },

    "door-education-diagnostic": {
      id: "door-education-diagnostic",
      room: "education-room",
      side: "south",
      position: 40,
      width: 17,
      graphNode: "southeast-corridor"
    },

    "door-diagnostic-southeast-corridor": {
      id: "door-diagnostic-southeast-corridor",
      room: "diagnostic-room",
      side: "west",
      position: 54,
      width: 20,
      graphNode: "southeast-corridor"
    },

    "door-diagnostic-frontier": {
      id: "door-diagnostic-frontier",
      room: "diagnostic-room",
      side: "east",
      position: 52,
      width: 20,
      graphNode: "frontier-threshold"
    }
  };

  /*
    CORRIDOR GRAPH

    The graph is intentionally small.

    Each corridor node contains:
    - a visual point on the estate
    - neighboring corridor nodes
    - connected room-anchor nodes

    Breadth-first search is sufficient.
  */

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
      y: 71.5,
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
      y: 81,
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

  function normalize(value) {
    if (value === null || typeof value === "undefined") return "";
    return String(value).replace(/\s+/g, " ").trim();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

  function escapeHTML(value) {
    return normalize(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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

    if (agentExists(room.authority)) {
      return room.authority;
    }

    if (room.type && AUTHORITY_FALLBACK[room.type]) {
      return AUTHORITY_FALLBACK[room.type];
    }

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

  function getRoomLocalPoint(roomId, zoneName) {
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
    return getRoomLocalPoint(roomId, "portraitZone");
  }

  function getRoomLabelPoint(roomId) {
    return getRoomLocalPoint(roomId, "labelZone");
  }

  function getDoorPoint(doorId) {
    var door = DOORS[doorId];

    if (!door || !roomExists(door.room)) {
      return {
        x: 50,
        y: 50
      };
    }

    var room = getRoom(door.room);
    var position = Math.max(0, Math.min(100, Number(door.position) || 50));

    if (door.side === "north") {
      return {
        x: room.x + room.width * (position / 100),
        y: room.y
      };
    }

    if (door.side === "east") {
      return {
        x: room.x + room.width,
        y: room.y + room.height * (position / 100)
      };
    }

    if (door.side === "south") {
      return {
        x: room.x + room.width * (position / 100),
        y: room.y + room.height
      };
    }

    return {
      x: room.x,
      y: room.y + room.height * (position / 100)
    };
  }

  function getNearestDoorForGraphNode(roomId, graphNodeId) {
    var room = getRoom(roomId);
    var matchingDoors = (room.doors || [])
      .map(function mapDoorId(doorId) {
        return DOORS[doorId];
      })
      .filter(function filterDoor(door) {
        return door && door.graphNode === graphNodeId;
      });

    if (matchingDoors.length) {
      return matchingDoors[0];
    }

    var availableDoors = (room.doors || [])
      .map(function mapFallbackDoorId(doorId) {
        return DOORS[doorId];
      })
      .filter(Boolean);

    return availableDoors.length ? availableDoors[0] : null;
  }

  function getCorridorPoint(corridorId) {
    var corridor = CORRIDORS[corridorId];

    if (!corridor) {
      return {
        x: 50,
        y: 50
      };
    }

    return {
      x: corridor.x,
      y: corridor.y
    };
  }

  function getGraphNeighbors(nodeId) {
    if (nodeId.indexOf("room:") === 0) {
      var roomId = nodeId.slice(5);
      var room = getRoom(roomId);

      return (room.corridorAccess || []).slice();
    }

    var corridor = CORRIDORS[nodeId];

    if (!corridor) return [];

    return (corridor.connections || []).slice();
  }

  function findGraphPath(fromRoomId, toRoomId) {
    var start = getRoomAnchorId(fromRoomId);
    var goal = getRoomAnchorId(toRoomId);

    if (start === goal) {
      return [start];
    }

    var queue = [start];
    var visited = {};
    var previous = {};

    visited[start] = true;

    while (queue.length) {
      var current = queue.shift();
      var neighbors = getGraphNeighbors(current);

      for (var i = 0; i < neighbors.length; i += 1) {
        var neighbor = neighbors[i];

        if (visited[neighbor]) continue;

        visited[neighbor] = true;
        previous[neighbor] = current;

        if (neighbor === goal) {
          var path = [goal];
          var cursor = goal;

          while (previous[cursor]) {
            cursor = previous[cursor];
            path.unshift(cursor);
          }

          return path;
        }

        queue.push(neighbor);
      }
    }

    return [
      start,
      "core-crossing",
      goal
    ];
  }

  function graphPathToVisualPoints(path) {
    if (!Array.isArray(path) || !path.length) return [];

    var points = [];

    for (var i = 0; i < path.length; i += 1) {
      var nodeId = path[i];

      if (nodeId.indexOf("room:") === 0) {
        var roomId = nodeId.slice(5);

        if (i === 0) {
          points.push({
            id: "portrait:" + roomId,
            type: "portrait",
            roomId: roomId,
            point: getRoomPortraitPoint(roomId)
          });

          if (path[i + 1]) {
            var firstDoor = getNearestDoorForGraphNode(roomId, path[i + 1]);

            if (firstDoor) {
              points.push({
                id: firstDoor.id,
                type: "door",
                roomId: roomId,
                point: getDoorPoint(firstDoor.id)
              });
            }
          }

          continue;
        }

        if (i === path.length - 1) {
          var previousNode = path[i - 1];
          var arrivalDoor = getNearestDoorForGraphNode(roomId, previousNode);

          if (arrivalDoor) {
            points.push({
              id: arrivalDoor.id,
              type: "door",
              roomId: roomId,
              point: getDoorPoint(arrivalDoor.id)
            });
          }

          points.push({
            id: "portrait:" + roomId,
            type: "portrait",
            roomId: roomId,
            point: getRoomPortraitPoint(roomId)
          });
        }

        continue;
      }

      points.push({
        id: nodeId,
        type: "corridor",
        point: getCorridorPoint(nodeId)
      });
    }

    return dedupeVisualPoints(points);
  }

  function dedupeVisualPoints(points) {
    var result = [];

    points.forEach(function addPoint(item) {
      var previous = result[result.length - 1];

      if (
        previous &&
        Math.abs(previous.point.x - item.point.x) < 0.01 &&
        Math.abs(previous.point.y - item.point.y) < 0.01
      ) {
        return;
      }

      result.push(item);
    });

    return result;
  }

  function getCurrentRoomFromDOM() {
    var root = q("[data-house-control-pad-root]");
    var explicitRoom = root && root.getAttribute("data-house-room");

    if (roomExists(explicitRoom)) {
      return explicitRoom;
    }

    var bodyRoom =
      document.body &&
      document.body.getAttribute("data-house-room");

    if (roomExists(bodyRoom)) {
      return bodyRoom;
    }

    var htmlRoom =
      document.documentElement.getAttribute("data-house-room");

    if (roomExists(htmlRoom)) {
      return htmlRoom;
    }

    var route = location.pathname.replace(/\/+$/, "/");

    var exactMatch = Object.keys(ROOMS).find(function findExactRoom(roomId) {
      return ROOMS[roomId].route === route;
    });

    if (exactMatch) {
      return exactMatch;
    }

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
      node.focus({
        preventScroll: true
      });
    } catch (error) {
      node.focus();
    }
  }

  function getFocusable(root) {
    return qa(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    if (!STATE.isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeControlPad();
      return;
    }

    trapFocus(event);
  }

  function clearTravelTimers() {
    STATE.travelTimers.forEach(function clearTimer(timerId) {
      window.clearTimeout(timerId);
    });

    STATE.travelTimers = [];
  }

  function cancelActiveTravel() {
    STATE.travelToken += 1;
    STATE.isAnimating = false;
    STATE.activePath = [];

    clearTravelTimers();
    clearTravelSegments();

    qa("[data-house-avatar]", STATE.panel).forEach(function clearAvatarState(node) {
      node.setAttribute("data-traveling", "false");
    });
  }

  function clearTravelSegments() {
    qa("[data-house-control-pad-travel-segment]", STATE.estateCanvas)
      .forEach(function removeSegment(segment) {
        segment.remove();
      });
  }

  function clearRoomInteractionStates() {
    qa("[data-house-room-node]", STATE.panel).forEach(function clearRoom(node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-destination", "false");
      node.setAttribute("data-arrived", "false");
    });

    qa("[data-house-avatar]", STATE.panel).forEach(function clearAvatar(node) {
      node.setAttribute("data-selected", "false");
      node.setAttribute("data-arrived", "false");
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
      STATE.root.setAttribute(
        "data-house-room",
        room.id
      );
    }

    qa("[data-house-room-node]", STATE.panel).forEach(function clearCurrent(node) {
      node.setAttribute("data-current", "false");
    });

    markRoomState(room.id, "data-current", true);
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
      avatar.setAttribute(
        "data-current-room",
        roomId
      );
    }
  }

  function setAvatarRoom(agentId, roomId) {
    setAvatarPoint(
      agentId,
      getRoomPortraitPoint(roomId),
      roomId
    );
  }

  function resetAgentLocations() {
    Object.keys(AGENTS).forEach(function resetAgent(agentId) {
      var agent = AGENTS[agentId];

      STATE.agentLocations[agentId] = agent.homeRoom;

      if (STATE.initialized) {
        setAvatarRoom(agentId, agent.homeRoom);
      }
    });

    return clone(STATE.agentLocations);
  }

  function getAgentLocation(agentId) {
    var agent = getAgent(agentId);

    return STATE.agentLocations[agent.id] || agent.homeRoom;
  }

  function restoreAgentPositions() {
    Object.keys(AGENTS).forEach(function restoreAgent(agentId) {
      setAvatarRoom(
        agentId,
        getAgentLocation(agentId)
      );
    });
  }

  function getEstateCanvasPixelPoint(percentPoint) {
    if (!STATE.estateCanvas) {
      return {
        x: 0,
        y: 0
      };
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
    if (!STATE.estateCanvas) return null;

    var fromPixels = getEstateCanvasPixelPoint(fromPoint);
    var toPixels = getEstateCanvasPixelPoint(toPoint);

    var dx = toPixels.x - fromPixels.x;
    var dy = toPixels.y - fromPixels.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    var segment = create("span", "hcp-travel-segment", {
      "data-house-control-pad-travel-segment": "true",
      "aria-hidden": "true"
    });

    segment.style.left = fromPixels.x + "px";
    segment.style.top = fromPixels.y + "px";
    segment.style.width = length + "px";
    segment.style.transform = "rotate(" + angle + "deg)";
    segment.style.animationDelay = index * 60 + "ms";

    STATE.estateCanvas.appendChild(segment);

    return segment;
  }

  function drawTravelPath(visualPoints) {
    clearTravelSegments();

    for (var i = 0; i < visualPoints.length - 1; i += 1) {
      drawTravelSegment(
        visualPoints[i].point,
        visualPoints[i + 1].point,
        i
      );
    }
  }

  function focusRoom(roomId, options) {
    options = options || {};

    if (!STATE.estateViewport || !STATE.estateCanvas) return false;

    var roomNode = q(
      '[data-house-room-node="' + roomId + '"]',
      STATE.estateCanvas
    );

    if (!roomNode) return false;

    var viewportRect = STATE.estateViewport.getBoundingClientRect();
    var roomRect = roomNode.getBoundingClientRect();

    var left =
      STATE.estateViewport.scrollLeft +
      roomRect.left -
      viewportRect.left -
      viewportRect.width / 2 +
      roomRect.width / 2;

    var top =
      STATE.estateViewport.scrollTop +
      roomRect.top -
      viewportRect.top -
      viewportRect.height / 2 +
      roomRect.height / 2;

    var behavior =
      options.immediate ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

    STATE.estateViewport.scrollTo({
      left: Math.max(0, left),
      top: Math.max(0, top),
      behavior: behavior
    });

    return true;
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

    var talk = q(
      "[data-hcp-arrival-talk]",
      STATE.arrivalSheet
    );

    var roomButton = q(
      "[data-hcp-arrival-room]",
      STATE.arrivalSheet
    );

    if (title) {
      title.textContent = sameRoom
        ? agent.label + " is already in " + room.label + "."
        : agent.label + " has arrived at " + room.label + ".";
    }

    if (body) {
      body.textContent = agent.authorityLine;
    }

    if (talk) {
      talk.textContent = agent.actionLabel;
    }

    if (roomButton) {
      roomButton.textContent = "Open " + room.shortLabel;
    }

    STATE.arrivalSheet.setAttribute(
      "data-visible",
      "true"
    );

    var primaryAction = q(
      "[data-hcp-arrival-talk]",
      STATE.arrivalSheet
    );

    window.setTimeout(function focusArrivalAction() {
      safeFocus(primaryAction);
    }, 80);

    window.dispatchEvent(
      new CustomEvent("house-control-pad:arrival", {
        detail: {
          contract: CONTRACT,
          room: room.id,
          agent: agent.id,
          sameRoom: Boolean(sameRoom),
          agentRoute: agent.route,
          roomRoute: room.route
        }
      })
    );
  }

  function completeArrival(room, agent, sameRoom, token) {
    if (token !== STATE.travelToken) return;

    STATE.isAnimating = false;
    STATE.activePath = [];

    clearTravelTimers();
    clearTravelSegments();

    STATE.agentLocations[agent.id] = room.id;

    setAvatarRoom(agent.id, room.id);

    markAgentState(agent.id, "data-traveling", false);
    markAgentState(agent.id, "data-arrived", true);

    markRoomState(room.id, "data-destination", false);
    markRoomState(room.id, "data-arrived", true);

    setStatus(
      sameRoom
        ? agent.label + " is already in " + room.label + "."
        : agent.label + " has arrived at " + room.label + "."
    );

    focusRoom(room.id);
    showArrivalSheet(room, agent, sameRoom);
  }

  function animateGuideAlongPath(agent, room, visualPoints, token) {
    if (!visualPoints.length) {
      completeArrival(room, agent, false, token);
      return;
    }

    STATE.activePath = visualPoints.map(function mapVisualPoint(item) {
      return item.id;
    });

    markAgentState(agent.id, "data-traveling", true);

    drawTravelPath(visualPoints);

    for (var i = 1; i < visualPoints.length; i += 1) {
      (function schedulePoint(pointItem, index) {
        var timerId = window.setTimeout(function moveAvatar() {
          if (token !== STATE.travelToken) return;

          setAvatarPoint(
            agent.id,
            pointItem.point,
            pointItem.type === "portrait"
              ? pointItem.roomId
              : null
          );
        }, index * TRAVEL_SEGMENT_MS);

        STATE.travelTimers.push(timerId);
      })(visualPoints[i], i);
    }

    var completionDelay =
      Math.max(1, visualPoints.length - 1) *
        TRAVEL_SEGMENT_MS +
      TRAVEL_SETTLE_MS;

    var completionTimer = window.setTimeout(function finishTravel() {
      completeArrival(
        room,
        agent,
        false,
        token
      );
    }, completionDelay);

    STATE.travelTimers.push(completionTimer);
  }

  function travelToRoom(roomId, options) {
    options = options || {};

    if (!STATE.initialized) {
      render();
    }

    if (!STATE.isOpen) {
      openControlPad({
        room: roomId
      });
    }

    cancelActiveTravel();
    clearRoomInteractionStates();
    hideArrivalSheet();

    var room = getRoom(roomId);
    var authorityId =
      options.agent && agentExists(options.agent)
        ? options.agent
        : resolveAuthority(room);

    var agent = getAgent(authorityId);
    var fromRoomId = getAgentLocation(agent.id);
    var token = STATE.travelToken;

    STATE.selectedRoom = room.id;
    STATE.selectedAgent = agent.id;

    markRoomState(
      STATE.currentPageRoom,
      "data-current",
      true
    );

    markRoomState(
      room.id,
      "data-selected",
      true
    );

    markRoomState(
      room.id,
      "data-destination",
      true
    );

    markAgentState(
      agent.id,
      "data-selected",
      true
    );

    focusRoom(room.id);

    if (fromRoomId === room.id) {
      STATE.isAnimating = false;

      completeArrival(
        room,
        agent,
        true,
        token
      );

      window.dispatchEvent(
        new CustomEvent("house-control-pad:same-room", {
          detail: {
            contract: CONTRACT,
            room: room.id,
            agent: agent.id,
            location: fromRoomId
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

    animateGuideAlongPath(
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
          visualPath: visualPoints.map(function mapPathPoint(item) {
            return item.id;
          }),
          layout: "cardinal-estate-floor-plan"
        }
      })
    );
  }

  function openSelectedAgent() {
    var agent = getAgent(STATE.selectedAgent);

    if (agent.route) {
      window.location.href = agent.route;
    }
  }

  function openSelectedRoom() {
    var room = getRoom(STATE.selectedRoom);

    if (room.route) {
      window.location.href = room.route;
    }
  }

  function buildHeader() {
    var header = create("header", "hcp-header", {
      "aria-label": "House controller header"
    });

    var titleWrap = create("div", "hcp-title-wrap");

    var kicker = create("div", "hcp-kicker", {
      text: "Universal House Controller"
    });

    var title = create("h2", "hcp-title", {
      text: "Choose a room. The House summons the right guide."
    });

    var subtitle = create("p", "hcp-subtitle", {
      text:
        "The estate is arranged by cardinal law, but experienced as a navigable floor plan."
    });

    var closeButton = create("button", "hcp-close", {
      type: "button",
      "data-house-control-pad-close": "true",
      "aria-label": "Close House controller",
      text: "×"
    });

    closeButton.addEventListener(
      "click",
      closeControlPad
    );

    titleWrap.appendChild(kicker);
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    header.appendChild(titleWrap);
    header.appendChild(closeButton);

    return header;
  }

  function buildRoomNode(room) {
    var agent = getAgent(
      resolveAuthority(room)
    );

    var node = create(
      "button",
      "hcp-room-node hcp-room-" +
        room.type +
        " hcp-room-rank-" +
        room.rank +
        " hcp-room-wing-" +
        room.estateWing,
      {
        type: "button",
        "data-house-room-node": room.id,
        "data-house-room-type": room.type,
        "data-house-room-rank": room.rank,
        "data-house-cardinal-sector": room.cardinalSector,
        "data-house-estate-wing": room.estateWing,
        "data-current": "false",
        "data-selected": "false",
        "data-destination": "false",
        "data-arrived": "false",
        "aria-label":
          room.label +
          ". " +
          room.description +
          " Authority: " +
          agent.label +
          "."
      }
    );

    node.style.left = room.x + "%";
    node.style.top = room.y + "%";
    node.style.width = room.width + "%";
    node.style.height = room.height + "%";

    var labelZone = create(
      "span",
      "hcp-room-label-zone"
    );

    labelZone.style.left =
      room.labelZone.x + "%";

    labelZone.style.top =
      room.labelZone.y + "%";

    labelZone.style.width =
      room.labelZone.width + "%";

    labelZone.style.height =
      room.labelZone.height + "%";

    var shortLabel = create(
      "span",
      "hcp-room-label",
      {
        text: room.shortLabel
      }
    );

    var authority = create(
      "span",
      "hcp-room-authority",
      {
        text: agent.label
      }
    );

    labelZone.appendChild(shortLabel);
    labelZone.appendChild(authority);

    var portraitZone = create(
      "span",
      "hcp-room-portrait-zone",
      {
        "aria-hidden": "true"
      }
    );

    portraitZone.style.left =
      room.portraitZone.x + "%";

    portraitZone.style.top =
      room.portraitZone.y + "%";

    portraitZone.style.width =
      room.portraitZone.width + "%";

    portraitZone.style.height =
      room.portraitZone.height + "%";

    node.appendChild(labelZone);
    node.appendChild(portraitZone);

    node.addEventListener("click", function selectRoom() {
      travelToRoom(room.id, {
        source: "estate-room"
      });
    });

    return node;
  }

  function buildDoorNode(door) {
    var node = create(
      "span",
      "hcp-door hcp-door-" + door.side,
      {
        "data-house-door": door.id,
        "data-house-door-room": door.room,
        "data-house-door-side": door.side,
        "aria-hidden": "true"
      }
    );

    var room = getRoom(door.room);
    var width = Math.max(
      5,
      Math.min(30, Number(door.width) || 12)
    );

    if (
      door.side === "north" ||
      door.side === "south"
    ) {
      node.style.left =
        room.x +
        room.width *
          ((Number(door.position) || 50) / 100) +
        "%";

      node.style.top =
        door.side === "north"
          ? room.y + "%"
          : room.y + room.height + "%";

      node.style.width =
        room.width * (width / 100) + "%";
    } else {
      node.style.left =
        door.side === "west"
          ? room.x + "%"
          : room.x + room.width + "%";

      node.style.top =
        room.y +
        room.height *
          ((Number(door.position) || 50) / 100) +
        "%";

      node.style.height =
        room.height * (width / 100) + "%";
    }

    return node;
  }

  function buildCorridorNode(corridor) {
    var node = create(
      "span",
      "hcp-route-node",
      {
        "data-house-route-node": corridor.id,
        "aria-hidden": "true"
      }
    );

    node.style.left = corridor.x + "%";
    node.style.top = corridor.y + "%";

    return node;
  }

  function buildAvatarFace(agent) {
    var face = create(
      "span",
      "hcp-avatar-face hcp-face-" + agent.face,
      {
        "aria-hidden": "true"
      }
    );

    var frame = create(
      "span",
      "hcp-face-frame"
    );

    var shoulders = create(
      "span",
      "hcp-face-shoulders"
    );

    var neck = create(
      "span",
      "hcp-face-neck"
    );

    var head = create(
      "span",
      "hcp-face-head"
    );

    var hair = create(
      "span",
      "hcp-face-hair"
    );

    var leftEye = create(
      "span",
      "hcp-face-eye hcp-face-eye-left"
    );

    var rightEye = create(
      "span",
      "hcp-face-eye hcp-face-eye-right"
    );

    var nose = create(
      "span",
      "hcp-face-nose"
    );

    var mouth = create(
      "span",
      "hcp-face-mouth"
    );

    var cue = create(
      "span",
      "hcp-face-cue"
    );

    var badge = create(
      "span",
      "hcp-face-badge",
      {
        text: agent.label.charAt(0)
      }
    );

    head.appendChild(leftEye);
    head.appendChild(rightEye);
    head.appendChild(nose);
    head.appendChild(mouth);

    frame.appendChild(shoulders);
    frame.appendChild(neck);
    frame.appendChild(head);
    frame.appendChild(hair);
    frame.appendChild(cue);
    frame.appendChild(badge);

    face.appendChild(frame);

    return face;
  }

  function buildAvatar(agent) {
    var avatar = create(
      "button",
      "hcp-avatar hcp-avatar-" + agent.palette,
      {
        type: "button",
        "data-house-avatar": agent.id,
        "data-house-avatar-face": agent.face,
        "data-selected": "false",
        "data-traveling": "false",
        "data-arrived": "false",
        "data-current-room": agent.homeRoom,
        "aria-label":
          agent.label +
          ". " +
          agent.description
      }
    );

    var face = buildAvatarFace(agent);

    var label = create(
      "span",
      "hcp-avatar-label",
      {
        text: agent.label
      }
    );

    avatar.appendChild(face);
    avatar.appendChild(label);

    avatar.addEventListener("click", function selectAgentRoom() {
      travelToRoom(
        getAgentLocation(agent.id),
        {
          source: "avatar",
          agent: agent.id
        }
      );
    });

    return avatar;
  }

  function buildEstateCanvas() {
    var viewport = create(
      "section",
      "hcp-estate-viewport",
      {
        "data-house-estate-viewport": "true",
        "aria-label": "House estate floor plan",
        tabindex: "0"
      }
    );

    var canvas = create(
      "div",
      "hcp-estate-canvas",
      {
        "data-house-estate-canvas": "true",
        "data-blueprint-layout": "cardinal-estate-floor-plan"
      }
    );

    var estateBoundary = create(
      "div",
      "hcp-estate-boundary",
      {
        "aria-hidden": "true"
      }
    );

    var northMark = create(
      "span",
      "hcp-estate-cardinal hcp-estate-cardinal-north",
      {
        text: "N",
        "aria-hidden": "true"
      }
    );

    var eastMark = create(
      "span",
      "hcp-estate-cardinal hcp-estate-cardinal-east",
      {
        text: "E",
        "aria-hidden": "true"
      }
    );

    var southMark = create(
      "span",
      "hcp-estate-cardinal hcp-estate-cardinal-south",
      {
        text: "S",
        "aria-hidden": "true"
      }
    );

    var westMark = create(
      "span",
      "hcp-estate-cardinal hcp-estate-cardinal-west",
      {
        text: "W",
        "aria-hidden": "true"
      }
    );

    var corridorLayer = create(
      "div",
      "hcp-corridor-layer",
      {
        "aria-hidden": "true"
      }
    );

    [
      "north-entry",
      "northwest-wing",
      "northeast-wing",
      "west-main",
      "east-main",
      "core-crossing",
      "south-gallery",
      "southwest",
      "southeast"
    ].forEach(function buildCorridorSurface(name) {
      corridorLayer.appendChild(
        create(
          "span",
          "hcp-corridor hcp-corridor-" + name
        )
      );
    });

    canvas.appendChild(estateBoundary);
    canvas.appendChild(northMark);
    canvas.appendChild(eastMark);
    canvas.appendChild(southMark);
    canvas.appendChild(westMark);
    canvas.appendChild(corridorLayer);

    Object.keys(ROOMS).forEach(function appendRoom(roomId) {
      var room = ROOMS[roomId];

      if (room.visible !== false) {
        canvas.appendChild(
          buildRoomNode(room)
        );
      }
    });

    Object.keys(DOORS).forEach(function appendDoor(doorId) {
      canvas.appendChild(
        buildDoorNode(DOORS[doorId])
      );
    });

    Object.keys(CORRIDORS).forEach(function appendRouteNode(corridorId) {
      canvas.appendChild(
        buildCorridorNode(CORRIDORS[corridorId])
      );
    });

    var avatarLayer = create(
      "div",
      "hcp-avatar-layer",
      {
        "data-house-control-pad-avatar-layer": "true"
      }
    );

    Object.keys(AGENTS).forEach(function appendAvatar(agentId) {
      avatarLayer.appendChild(
        buildAvatar(AGENTS[agentId])
      );
    });

    canvas.appendChild(avatarLayer);
    viewport.appendChild(canvas);

    STATE.estateViewport = viewport;
    STATE.estateCanvas = canvas;
    STATE.avatarLayer = avatarLayer;

    return viewport;
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

    var eyebrow = create(
      "div",
      "hcp-arrival-eyebrow",
      {
        text: "Guide Authority"
      }
    );

    var title = create(
      "h3",
      "hcp-arrival-title",
      {
        "data-hcp-arrival-title": "true",
        text: "Choose a room."
      }
    );

    var body = create(
      "p",
      "hcp-arrival-body",
      {
        "data-hcp-arrival-body": "true",
        text: "The House will summon the correct guide."
      }
    );

    var actions = create(
      "div",
      "hcp-arrival-actions"
    );

    var talkButton = create(
      "button",
      "hcp-arrival-action hcp-arrival-primary",
      {
        type: "button",
        "data-hcp-arrival-talk": "true",
        text: "Talk to Guide"
      }
    );

    var roomButton = create(
      "button",
      "hcp-arrival-action",
      {
        type: "button",
        "data-hcp-arrival-room": "true",
        text: "Open Room"
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

    talkButton.addEventListener(
      "click",
      openSelectedAgent
    );

    roomButton.addEventListener(
      "click",
      openSelectedRoom
    );

    dismissButton.addEventListener(
      "click",
      hideArrivalSheet
    );

    actions.appendChild(talkButton);
    actions.appendChild(roomButton);
    actions.appendChild(dismissButton);

    content.appendChild(eyebrow);
    content.appendChild(title);
    content.appendChild(body);
    content.appendChild(actions);

    sheet.appendChild(content);

    STATE.arrivalSheet = sheet;

    return sheet;
  }

  function buildFooter() {
    var footer = create(
      "footer",
      "hcp-footer"
    );

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
        text: "Summon guide for this room"
      }
    );

    var coreButton = create(
      "button",
      "hcp-footer-button",
      {
        type: "button",
        text: "Focus House Core"
      }
    );

    summonButton.addEventListener("click", function summonCurrentRoom() {
      travelToRoom(
        STATE.currentPageRoom,
        {
          source: "current-page-room"
        }
      );
    });

    coreButton.addEventListener("click", function focusCore() {
      focusRoom("house-core");
    });

    actions.appendChild(summonButton);
    actions.appendChild(coreButton);

    footer.appendChild(status);
    footer.appendChild(actions);

    STATE.status = status;

    return footer;
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
        "data-house-control-pad-panel": "true"
      }
    );

    panel.appendChild(buildHeader());
    panel.appendChild(buildEstateCanvas());
    panel.appendChild(buildArrivalSheet());
    panel.appendChild(buildFooter());

    overlay.appendChild(panel);

    overlay.addEventListener("click", function closeFromBackdrop(event) {
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

    if (
      STATE.overlay &&
      STATE.overlay.parentNode
    ) {
      STATE.overlay.parentNode.removeChild(
        STATE.overlay
      );
    }

    var overlay = buildPanel();

    document.body.appendChild(overlay);

    restoreAgentPositions();

    STATE.initialized = true;

    document.documentElement.setAttribute(
      "data-house-control-pad-ready",
      "true"
    );

    document.documentElement.setAttribute(
      "data-house-control-pad-layout",
      "cardinal-estate-floor-plan"
    );

    document.body.setAttribute(
      "data-house-control-pad-ready",
      "true"
    );

    document.body.setAttribute(
      "data-house-control-pad-layout",
      "cardinal-estate-floor-plan"
    );

    window.dispatchEvent(
      new CustomEvent("house-control-pad:ready", {
        detail: {
          contract: CONTRACT,
          currentPageRoom: STATE.currentPageRoom,
          layout: "cardinal-estate-floor-plan",
          roomContainers: true,
          routeGraph: true,
          roomFirst: true,
          avatarPortraits: true,
          characterFirstDeferredToPortraitHall: true
        }
      })
    );
  }

  function openControlPad(options) {
    options = options || {};

    if (!STATE.initialized) {
      render();
    }

    cancelActiveTravel();
    hideArrivalSheet();
    clearRoomInteractionStates();

    STATE.previousFocus = document.activeElement;

    var requestedRoom =
      options.room ||
      getCurrentRoomFromDOM();

    var room = getRoom(requestedRoom);

    setCurrentPageRoom(room.id);

    STATE.selectedRoom = null;
    STATE.selectedAgent = null;

    STATE.overlay.setAttribute(
      "data-open",
      "true"
    );

    STATE.isOpen = true;
    setBodyOpen(true);

    restoreAgentPositions();

    setStatus(
      "Current room: " +
        room.label +
        ". Select a room to summon its guide."
    );

    document.addEventListener(
      "keydown",
      handleKeydown
    );

    window.setTimeout(function prepareOpenView() {
      focusRoom(room.id, {
        immediate: true
      });

      var closeButton = q(
        "[data-house-control-pad-close]",
        STATE.panel
      );

      safeFocus(
        closeButton ||
        STATE.estateViewport
      );
    }, 40);

    if (options.autoSummon) {
      window.setTimeout(function autoSummon() {
        travelToRoom(room.id, {
          source: "auto-summon"
        });
      }, 220);
    }

    window.dispatchEvent(
      new CustomEvent("house-control-pad:open", {
        detail: {
          contract: CONTRACT,
          currentPageRoom: room.id,
          layout: "cardinal-estate-floor-plan"
        }
      })
    );
  }

  function closeControlPad() {
    if (!STATE.overlay) return;

    cancelActiveTravel();
    hideArrivalSheet();

    STATE.overlay.setAttribute(
      "data-open",
      "false"
    );

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

    var roomId = normalize(room.id);

    ROOMS[roomId] = {
      id: roomId,
      label: normalize(room.label || roomId),
      shortLabel: normalize(
        room.shortLabel ||
        room.label ||
        roomId
      ),
      type: normalize(room.type || "orientation"),
      route: normalize(room.route || "/"),
      authority: normalize(room.authority || "jeeves"),

      cardinalSector: normalize(
        room.cardinalSector || "center"
      ),

      estateWing: normalize(
        room.estateWing || "central"
      ),

      rank: normalize(
        room.rank || "small"
      ),

      x:
        typeof room.x === "number"
          ? room.x
          : 40,

      y:
        typeof room.y === "number"
          ? room.y
          : 40,

      width:
        typeof room.width === "number"
          ? room.width
          : 18,

      height:
        typeof room.height === "number"
          ? room.height
          : 14,

      labelZone:
        room.labelZone || {
          x: 7,
          y: 8,
          width: 58,
          height: 25
        },

      portraitZone:
        room.portraitZone || {
          x: 58,
          y: 45,
          width: 34,
          height: 46
        },

      doors:
        Array.isArray(room.doors)
          ? room.doors.slice()
          : [],

      corridorAccess:
        Array.isArray(room.corridorAccess)
          ? room.corridorAccess.slice()
          : [],

      visible:
        room.visible !== false,

      description: normalize(
        room.description || ""
      )
    };

    if (STATE.initialized) {
      render();
    }

    return true;
  }

  function registerAgent(agent) {
    if (!agent || !agent.id) return false;

    var agentId = normalize(agent.id);

    AGENTS[agentId] = {
      id: agentId,
      label: normalize(
        agent.label || agentId
      ),
      title: normalize(
        agent.title || "Guide"
      ),
      homeRoom: roomExists(agent.homeRoom)
        ? agent.homeRoom
        : DEFAULT_ROOM_ID,
      route: normalize(agent.route || "/"),
      palette: normalize(
        agent.palette || agentId
      ),
      face: normalize(
        agent.face || "guide"
      ),
      actionLabel: normalize(
        agent.actionLabel ||
        "Talk to Guide"
      ),
      authorityLine: normalize(
        agent.authorityLine || ""
      ),
      description: normalize(
        agent.description || ""
      )
    };

    STATE.agentLocations[agentId] =
      AGENTS[agentId].homeRoom;

    if (STATE.initialized) {
      render();
    }

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
          var room =
            button.getAttribute("data-house-room") ||
            getCurrentRoomFromDOM();

          var autoSummon =
            button.getAttribute(
              "data-house-control-pad-auto-summon"
            ) === "true";

          openControlPad({
            room: room,
            autoSummon: autoSummon
          });
        });
      });
  }

  function getRouteGraph() {
    var graph = {};

    Object.keys(ROOMS).forEach(function addRoomNode(roomId) {
      graph[getRoomAnchorId(roomId)] =
        getGraphNeighbors(
          getRoomAnchorId(roomId)
        );
    });

    Object.keys(CORRIDORS).forEach(function addCorridorNode(corridorId) {
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
      currentPageRoom: STATE.currentPageRoom,
      selectedRoom: STATE.selectedRoom,
      selectedAgent: STATE.selectedAgent,
      activePath: STATE.activePath.slice(),
      travelToken: STATE.travelToken,
      agentLocations: clone(STATE.agentLocations),
      layout: "cardinal-estate-floor-plan",
      roomFirst: true,
      routeGraph: true,
      avatarPortraits: true
    };
  }

  function boot() {
    STATE.currentPageRoom =
      getCurrentRoomFromDOM();

    ensureRoot();
    render();
    bindOpenButtons();

    window.HOUSE_CONTROL_PAD = {
      contract: CONTRACT,

      open: openControlPad,
      close: closeControlPad,
      travelToRoom: travelToRoom,

      registerRoom: registerRoom,
      registerAgent: registerAgent,

      getRouteGraph: getRouteGraph,
      getAgentLocation: getAgentLocation,
      resetAgentLocations: resetAgentLocations,
      focusRoom: focusRoom,
      getEstateState: getEstateState,

      getState: getEstateState,

      rooms: ROOMS,
      agents: AGENTS,
      doors: DOORS,
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
