// /assets/house-control-pad/house.control-pad.data.js
// HOUSE_CONTROL_PAD_DIAMOND_HEART_3D_STATIC_ESTATE_DATA_TNT_v2
// Full-file replacement.
//
// Five-layer House Control Pad architecture:
//
// 1. house.control-pad.data.js
//    Stable room, route, authority, corridor, facet, camera,
//    coordinate, and resident identity definitions.
//
// 2. house.control-pad.js
//    Controller, camera, selection, routing, pathfinding,
//    travel execution, focus, and public API.
//
// 3. house.avatar-life.js
//    Blink scheduling, inactivity, gestures, yawns,
//    and resident runtime state.
//
// 4. house.control-pad.css
//    Static diamond-heart estate architecture.
//
// 5. house.avatars.css
//    Resident appearance and motion presentation.
//
// Separation law:
//
// Data describes.
// Architecture renders.
// Controller coordinates.
// Avatar life schedules.
// Avatar CSS expresses.
//
// This file owns:
//
// - canonical room identities
// - canonical routes
// - room authority assignments
// - room summaries and details
// - visitor actions
// - related-room declarations
// - three-dimensional heart world dimensions
// - heart-facet polygons
// - room X, Y, and Z coordinates
// - room architecture envelopes
// - room label anchors
// - room avatar anchors
// - room camera targets
// - room focus bounds
// - room mobile camera metadata
// - corridor declarations
// - corridor X, Y, and Z coordinates
// - resident identity metadata
// - resident home locations
// - timing constants
// - stable validation helpers
//
// This file does not own:
//
// - DOM construction
// - event listeners
// - camera execution
// - route execution
// - pathfinding execution
// - travel interpolation
// - timers
// - animation state
// - blink scheduling
// - CSS presentation
// - runtime mutation
//
// Diamond-heart world:
//
// Width:  1000
// Height:  900
// Depth:   320
//
// X: left to right
// Y: top to bottom
// Z: rear to front
//
// Origin:
//
// X = 500
// Y = 430
// Z = 0
//
// Canonical guides:
//
// - Jeeves
// - Auren
// - Soren
// - Elara
//

(function bindHouseControlPadDiamondHeartData(global) {
  "use strict";

  var CONTRACT =
    "HOUSE_CONTROL_PAD_DIAMOND_HEART_3D_STATIC_ESTATE_DATA_TNT_v2";

  var DEFAULT_ROOM_ID =
    "house-core";

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

  var TIMING = Object.freeze({
    CAMERA_MS: 620,
    CAMERA_SETTLE_MS: 170,

    TRAVEL_SEGMENT_MS: 235,
    TRAVEL_SETTLE_MS: 220,

    ARRIVAL_HOLD_MS: 1450,

    BLINK_SINGLE_MS: 125,
    BLINK_SLOW_MS: 290,
    BLINK_DOUBLE_GAP_MS: 145,

    INTERACTION_THROTTLE_MS: 180,
    LIFE_EVALUATION_MS: 2400,
    LARGE_GESTURE_MIN_GAP_MS: 24000
  });

  var AVATAR_STATE_PRIORITY = Object.freeze({
    disabled: 100,
    traveling: 90,
    arriving: 80,
    speaking: 70,
    sleepy: 60,
    gesturing: 50,
    glancing: 40,
    focused: 30,
    resting: 10
  });

  var HEART_WORLD = deepFreeze({
    id: "diamond-heart-estate",

    coordinateSystem: "heart-world-xyz",

    width: 1000,
    height: 900,
    depth: 320,

    minZ: -120,
    maxZ: 200,

    origin: {
      x: 500,
      y: 430,
      z: 0
    },

    perspective: 1180,

    outerBounds: {
      minX: 92,
      maxX: 908,
      minY: 70,
      maxY: 865,
      minZ: -100,
      maxZ: 110
    },

    silhouette: {
      path:
        "M500 865 " +
        "L382 746 " +
        "L252 637 " +
        "Q128 531 92 382 " +
        "Q52 215 157 105 " +
        "Q251 6 379 70 " +
        "Q446 104 500 196 " +
        "Q554 104 621 70 " +
        "Q749 6 843 105 " +
        "Q948 215 908 382 " +
        "Q872 531 748 637 " +
        "L618 746 Z",

      controlPoints: [
        {
          id: "heart-bottom-point",
          x: 500,
          y: 865,
          z: -20
        },
        {
          id: "heart-lower-left-taper",
          x: 390,
          y: 755,
          z: -5
        },
        {
          id: "heart-lower-left-body",
          x: 255,
          y: 645,
          z: 5
        },
        {
          id: "heart-left-body",
          x: 145,
          y: 500,
          z: 10
        },
        {
          id: "heart-left-shoulder",
          x: 100,
          y: 330,
          z: 0
        },
        {
          id: "heart-left-lobe-edge",
          x: 125,
          y: 190,
          z: -10
        },
        {
          id: "heart-left-lobe-crown",
          x: 225,
          y: 105,
          z: 10
        },
        {
          id: "heart-inner-left-crown",
          x: 355,
          y: 115,
          z: 20
        },
        {
          id: "heart-cleft",
          x: 500,
          y: 265,
          z: 35
        },
        {
          id: "heart-inner-right-crown",
          x: 645,
          y: 115,
          z: 20
        },
        {
          id: "heart-right-lobe-crown",
          x: 775,
          y: 105,
          z: 10
        },
        {
          id: "heart-right-lobe-edge",
          x: 875,
          y: 190,
          z: -10
        },
        {
          id: "heart-right-shoulder",
          x: 900,
          y: 330,
          z: 0
        },
        {
          id: "heart-right-body",
          x: 855,
          y: 500,
          z: 10
        },
        {
          id: "heart-lower-right-body",
          x: 745,
          y: 645,
          z: 5
        },
        {
          id: "heart-lower-right-taper",
          x: 610,
          y: 755,
          z: -5
        }
      ]
    },

    depthPlanes: {
      rearShadow: -120,
      rearShell: -80,
      facetUnderstructure: -45,
      roomFloor: -20,
      corridor: 0,
      roomArchitecture: 20,
      raisedArchitecture: 55,
      facetEdge: 85,
      avatar: 110,
      label: 140,
      controls: 165,
      selectedGlow: 190
    },

    defaultCamera: {
      target: {
        x: 500,
        y: 440,
        z: 15
      },

      position: {
        x: 500,
        y: 440,
        z: 1250
      },

      distance: 1250,
      perspective: 1180,

      rotateX: 7,
      rotateY: 0,
      rotateZ: 0,

      scale: 0.86,

      mobile: {
        target: {
          x: 500,
          y: 445,
          z: 8
        },

        distance: 1420,
        perspective: 1320,

        rotateX: 4,
        rotateY: 0,
        rotateZ: 0,

        scale: 0.72
      }
    },

    roomViewLaw: {
      preserveNeighborContext: true,
      minimumVisibleHeartFraction: 0.28,
      maximumAvatarFieldFraction: 0.36,
      mobileMaximumAvatarFieldFraction: 0.32,
      arrivalSheetMaximumViewportFraction: 0.24
    }
  });

  var HEART_FACETS = deepFreeze({
    "human-threshold": {
      id: "heart-facet-human-threshold",
      roomId: "human-threshold",

      rank: "major",
      depthBand: "middle",

      polygon: [
        [96, 376, -10],
        [145, 174, 10],
        [224, 87, 28],
        [380, 70, 34],
        [422, 241, 50],
        [270, 330, 22]
      ],

      centroid: {
        x: 270,
        y: 215,
        z: 28
      }
    },

    "product-gallery": {
      id: "heart-facet-product-gallery",
      roomId: "product-gallery",

      rank: "major",
      depthBand: "middle",

      polygon: [
        [578, 241, 50],
        [620, 70, 34],
        [776, 87, 28],
        [855, 174, 10],
        [904, 376, -10],
        [730, 330, 22]
      ],

      centroid: {
        x: 730,
        y: 215,
        z: 28
      }
    },

    "guide-foyer": {
      id: "heart-facet-guide-foyer",
      roomId: "guide-foyer",

      rank: "medium",
      depthBand: "front",

      polygon: [
        [380, 70, 34],
        [500, 196, 58],
        [500, 327, 70],
        [422, 241, 50]
      ],

      centroid: {
        x: 430,
        y: 190,
        z: 42
      }
    },

    "book-chamber": {
      id: "heart-facet-book-chamber",
      roomId: "book-chamber",

      rank: "medium",
      depthBand: "front",

      polygon: [
        [500, 196, 58],
        [620, 70, 34],
        [578, 241, 50],
        [500, 327, 70]
      ],

      centroid: {
        x: 570,
        y: 190,
        z: 42
      }
    },

    "law-library": {
      id: "heart-facet-law-library",
      roomId: "law-library",

      rank: "medium",
      depthBand: "middle",

      polygon: [
        [270, 330, 22],
        [422, 241, 50],
        [500, 327, 70],
        [410, 430, 58],
        [230, 450, 10]
      ],

      centroid: {
        x: 355,
        y: 335,
        z: 24
      }
    },

    "diagnostic-room": {
      id: "heart-facet-diagnostic-room",
      roomId: "diagnostic-room",

      rank: "medium",
      depthBand: "middle",

      polygon: [
        [500, 327, 70],
        [578, 241, 50],
        [730, 330, 22],
        [770, 450, 10],
        [590, 430, 58]
      ],

      centroid: {
        x: 645,
        y: 335,
        z: 24
      }
    },

    showroom: {
      id: "heart-facet-showroom",
      roomId: "showroom",

      rank: "medium",
      depthBand: "rear",

      polygon: [
        [96, 376, -10],
        [270, 330, 22],
        [230, 450, 10],
        [330, 548, 8],
        [252, 637, -2],
        [148, 533, -8]
      ],

      centroid: {
        x: 215,
        y: 415,
        z: 12
      }
    },

    lab: {
      id: "heart-facet-lab",
      roomId: "lab",

      rank: "medium",
      depthBand: "rear",

      polygon: [
        [730, 330, 22],
        [904, 376, -10],
        [852, 533, -8],
        [748, 637, -2],
        [670, 548, 8],
        [770, 450, 10]
      ],

      centroid: {
        x: 785,
        y: 415,
        z: 12
      }
    },

    "house-core": {
      id: "heart-facet-house-core",
      roomId: "house-core",

      rank: "grand",
      depthBand: "front",

      polygon: [
        [500, 327, 70],
        [590, 430, 58],
        [560, 535, 48],
        [500, 580, 55],
        [440, 535, 48],
        [410, 430, 58]
      ],

      centroid: {
        x: 500,
        y: 430,
        z: 65
      }
    },

    "education-room": {
      id: "heart-facet-education-room",
      roomId: "education-room",

      rank: "small",
      depthBand: "middle",

      polygon: [
        [230, 450, 10],
        [410, 430, 58],
        [440, 535, 48],
        [380, 650, 12],
        [252, 637, -2],
        [330, 548, 8]
      ],

      centroid: {
        x: 290,
        y: 545,
        z: 8
      }
    },

    "portrait-hall": {
      id: "heart-facet-portrait-hall",
      roomId: "portrait-hall",

      rank: "medium",
      depthBand: "middle",

      polygon: [
        [440, 535, 48],
        [500, 580, 55],
        [560, 535, 48],
        [620, 650, 12],
        [500, 720, 20],
        [380, 650, 12]
      ],

      centroid: {
        x: 500,
        y: 555,
        z: 18
      }
    },

    "atlas-study": {
      id: "heart-facet-atlas-study",
      roomId: "atlas-study",

      rank: "small",
      depthBand: "middle",

      polygon: [
        [252, 637, -2],
        [380, 650, 12],
        [500, 720, 20],
        [382, 746, -4]
      ],

      centroid: {
        x: 390,
        y: 650,
        z: 4
      }
    },

    "frontier-workshop": {
      id: "heart-facet-frontier-workshop",
      roomId: "frontier-workshop",

      rank: "small",
      depthBand: "middle",

      polygon: [
        [500, 720, 20],
        [620, 650, 12],
        [748, 637, -2],
        [618, 746, -4]
      ],

      centroid: {
        x: 610,
        y: 650,
        z: 4
      }
    },

    "hearth-room": {
      id: "heart-facet-hearth-room",
      roomId: "hearth-room",

      rank: "medium",
      depthBand: "front",

      polygon: [
        [382, 746, -4],
        [500, 720, 20],
        [618, 746, -4],
        [500, 860, -20]
      ],

      centroid: {
        x: 500,
        y: 750,
        z: 16
      }
    }
  });

  var CORRIDORS = deepFreeze({
    "north-left-junction": {
      id: "north-left-junction",
      label: "North-Left Junction",

      x: 410,
      y: 275,
      z: 8,

      connections: [
        "room:guide-foyer",
        "room:human-threshold",
        "room:law-library",
        "core-convergence"
      ]
    },

    "north-right-junction": {
      id: "north-right-junction",
      label: "North-Right Junction",

      x: 590,
      y: 275,
      z: 8,

      connections: [
        "room:book-chamber",
        "room:product-gallery",
        "room:diagnostic-room",
        "core-convergence"
      ]
    },

    "west-junction": {
      id: "west-junction",
      label: "West Junction",

      x: 330,
      y: 430,
      z: 4,

      connections: [
        "room:showroom",
        "room:law-library",
        "southwest-junction",
        "core-convergence"
      ]
    },

    "east-junction": {
      id: "east-junction",
      label: "East Junction",

      x: 670,
      y: 430,
      z: 4,

      connections: [
        "room:lab",
        "room:diagnostic-room",
        "southeast-junction",
        "core-convergence"
      ]
    },

    "southwest-junction": {
      id: "southwest-junction",
      label: "Southwest Junction",

      x: 390,
      y: 545,
      z: 2,

      connections: [
        "room:education-room",
        "room:atlas-study",
        "west-junction",
        "south-junction",
        "core-convergence"
      ]
    },

    "southeast-junction": {
      id: "southeast-junction",
      label: "Southeast Junction",

      x: 610,
      y: 545,
      z: 2,

      connections: [
        "room:frontier-workshop",
        "room:portrait-hall",
        "east-junction",
        "south-junction",
        "core-convergence"
      ]
    },

    "south-junction": {
      id: "south-junction",
      label: "South Junction",

      x: 500,
      y: 625,
      z: 5,

      connections: [
        "room:portrait-hall",
        "room:atlas-study",
        "room:frontier-workshop",
        "room:hearth-room",
        "southwest-junction",
        "southeast-junction",
        "core-convergence"
      ]
    },

    "core-convergence": {
      id: "core-convergence",
      label: "House Core Convergence",

      x: 500,
      y: 430,
      z: 38,

      connections: [
        "room:house-core",
        "north-left-junction",
        "north-right-junction",
        "west-junction",
        "east-junction",
        "southwest-junction",
        "southeast-junction",
        "south-junction"
      ]
    }
  });

  var AGENTS = deepFreeze({
    jeeves: {
      id: "jeeves",
      label: "Jeeves",

      route:
        "/showroom/globe/hearth/jeeves/",

      homeRoom:
        "house-core",

      description:
        "The formal whole-House guide and orientation authority.",

      authorityLine:
        "Jeeves has authority for whole-House orientation, the Showroom, the Atlas, the Lab, the Law Library, and the current Portrait Hall orientation phase.",

      actionLabel:
        "Ask Jeeves",

      travelExpression:
        "formal-transit",

      focusedExpression:
        "attentive-formal",

      arrivalGesture:
        "formal-welcome",

      scale: {
        overview: 0.9,
        room: 1.08,
        conversation: 1.34
      },

      visualIdentity: {
        silhouette:
          "formal-upright",

        faceShape:
          "narrow-formal",

        hairStyle:
          "controlled-side-part",

        browStyle:
          "measured",

        eyeStyle:
          "composed",

        mouthStyle:
          "restrained",

        clothingStyle:
          "butler-coat",

        posture:
          "upright",

        accessory:
          "monocle",

        identityCue:
          "house-seal"
      },

      blinkProfile: {
        min: 4200,
        max: 7600,
        initialOffset: 1200,

        doubleBlinkChance: 0.09,
        slowBlinkChance: 0.12
      },

      idleProfile: {
        minorGestures: [
          "corridor-glance",
          "eyebrow-shift",
          "small-head-move"
        ],

        mediumGestures: [
          "monocle-adjust",
          "cuff-correction",
          "jacket-smooth",
          "posture-reset"
        ],

        rareGestures: [
          "brief-eye-rest",
          "formal-recovery"
        ],

        yawnChance: 0.012,
        yawnCooldown: 180000
      }
    },

    auren: {
      id: "auren",
      label: "Auren",

      route:
        "/showroom/globe/hearth/auren/",

      homeRoom:
        "product-gallery",

      description:
        "The practical maker, product, education, and frontier guide.",

      authorityLine:
        "Auren has authority for Products, Education, practical construction, and the Frontier Workshop.",

      actionLabel:
        "Ask Auren",

      travelExpression:
        "maker-transit",

      focusedExpression:
        "ready-practical",

      arrivalGesture:
        "tool-ready",

      scale: {
        overview: 0.94,
        room: 1.05,
        conversation: 1.3
      },

      visualIdentity: {
        silhouette:
          "practical-forward",

        faceShape:
          "open-angular",

        hairStyle:
          "maker-tousled",

        browStyle:
          "active",

        eyeStyle:
          "alert",

        mouthStyle:
          "open-friendly",

        clothingStyle:
          "maker-jacket",

        posture:
          "forward-relaxed",

        accessory:
          "tool-loop",

        identityCue:
          "gear"
      },

      blinkProfile: {
        min: 3500,
        max: 6400,
        initialOffset: 1800,

        doubleBlinkChance: 0.12,
        slowBlinkChance: 0.06
      },

      idleProfile: {
        minorGestures: [
          "tool-glance",
          "small-brow-shift",
          "shoulder-shift"
        ],

        mediumGestures: [
          "gear-adjust",
          "tool-check",
          "hand-stretch"
        ],

        rareGestures: [
          "maker-stretch",
          "brief-eye-rest"
        ],

        yawnChance: 0.017,
        yawnCooldown: 165000
      }
    },

    soren: {
      id: "soren",
      label: "Soren",

      route:
        "/showroom/globe/hearth/soren/",

      homeRoom:
        "diagnostic-room",

      description:
        "The measured diagnostic and coherence-orientation guide.",

      authorityLine:
        "Soren has authority for the Diagnostic Room and coherence-orientation references. Assessment remains with the proper diagnostic instrument.",

      actionLabel:
        "Ask Soren",

      travelExpression:
        "measured-transit",

      focusedExpression:
        "diagnostic-attention",

      arrivalGesture:
        "diagnostic-attend",

      scale: {
        overview: 0.88,
        room: 1.02,
        conversation: 1.26
      },

      visualIdentity: {
        silhouette:
          "contained-symmetrical",

        faceShape:
          "balanced-oval",

        hairStyle:
          "structured-silver",

        browStyle:
          "analytical",

        eyeStyle:
          "measured",

        mouthStyle:
          "neutral",

        clothingStyle:
          "diagnostic-coat",

        posture:
          "centered",

        accessory:
          "diagnostic-lens",

        identityCue:
          "seal"
      },

      blinkProfile: {
        min: 5200,
        max: 9000,
        initialOffset: 2500,

        doubleBlinkChance: 0.05,
        slowBlinkChance: 0.18
      },

      idleProfile: {
        minorGestures: [
          "diagnostic-glance",
          "small-brow-shift",
          "slow-head-tilt"
        ],

        mediumGestures: [
          "lens-adjust",
          "seal-inspection",
          "posture-release"
        ],

        rareGestures: [
          "brief-eye-rest",
          "posture-release"
        ],

        yawnChance: 0.008,
        yawnCooldown: 210000
      }
    },

    elara: {
      id: "elara",
      label: "Elara",

      route:
        "/showroom/globe/hearth/elara/",

      homeRoom:
        "human-threshold",

      description:
        "The human-threshold, expression, and Book Chamber guide.",

      authorityLine:
        "Elara has authority for the Human Threshold, Sean, the Book Chamber, and Mirrorland’s climate.",

      actionLabel:
        "Talk to Elara",

      travelExpression:
        "signal-transit",

      focusedExpression:
        "warm-attention",

      arrivalGesture:
        "signal-greeting",

      scale: {
        overview: 0.9,
        room: 1.04,
        conversation: 1.32
      },

      visualIdentity: {
        silhouette:
          "expressive-soft",

        faceShape:
          "soft-heart",

        hairStyle:
          "flowing-sculpted",

        browStyle:
          "expressive",

        eyeStyle:
          "bright",

        mouthStyle:
          "warm",

        clothingStyle:
          "signal-robe",

        posture:
          "soft-asymmetrical",

        accessory:
          "signal-orb",

        identityCue:
          "speech-light"
      },

      blinkProfile: {
        min: 3000,
        max: 5900,
        initialOffset: 700,

        doubleBlinkChance: 0.16,
        slowBlinkChance: 0.1
      },

      idleProfile: {
        minorGestures: [
          "visitor-glance",
          "expressive-blink",
          "small-head-move"
        ],

        mediumGestures: [
          "signal-pulse",
          "hair-adjust",
          "soft-stretch"
        ],

        rareGestures: [
          "brief-eye-rest",
          "signal-dim-recover"
        ],

        yawnChance: 0.014,
        yawnCooldown: 175000
      }
    }
  });

  var ROOMS = deepFreeze({
    "house-core": createRoom({
      id: "house-core",

      label:
        "House Core",

      shortLabel:
        "House Core",

      categoryLabel:
        "Whole-House Orientation",

      route: "/",

      authority:
        "jeeves",

      type:
        "orientation",

      rank:
        "grand",

      cardinalSector:
        "center",

      estateWing:
        "core",

      architecturalShape:
        "great-hall",

      summary:
        "The central convergence chamber of the House.",

      detail:
        "The House Core is the orientation center for the complete estate. Every major corridor converges here, and Jeeves maintains whole-House context without replacing the authority of the individual rooms.",

      visitorCan: [
        "Return to Compass",
        "Understand the House",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "guide-foyer",
        "book-chamber",
        "portrait-hall",
        "hearth-room"
      ],

      corridorAccess: [
        "core-convergence"
      ],

      legacyGeometry: {
        x: 39.5,
        y: 36.2,
        width: 21,
        height: 21.2
      },

      architecturalFeatureZones: [
        feature(
          "central-seal",
          34,
          31,
          32,
          38
        ),
        feature(
          "north-crossing",
          45,
          0,
          10,
          22
        ),
        feature(
          "south-crossing",
          45,
          78,
          10,
          22
        ),
        feature(
          "west-crossing",
          0,
          45,
          22,
          10
        ),
        feature(
          "east-crossing",
          78,
          45,
          22,
          10
        )
      ],

      zones: zones({
        label: [28, 7, 44, 13],
        summary: [16, 21, 68, 17],
        detail: [8, 12, 46, 52],
        portrait: [57, 23, 34, 53],
        action: [8, 70, 84, 22]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-house-core",

        center:
          [500, 430, 65],

        size:
          [210, 190, 105],

        floorZ:
          18,

        wallZ:
          88,

        avatarAnchor:
          [500, 462, 142],

        labelAnchor:
          [500, 358, 174],

        actionAnchor:
          [500, 532, 158],

        corridorNode:
          "core-convergence",

        camera: camera({
          target:
            [500, 430, 84],

          distance: 520,

          perspective: 1040,

          rotateX: 9,
          rotateY: 0,
          rotateZ: 0,

          scale: 1.34,

          mobileTarget:
            [500, 445, 72],

          mobileDistance: 720,
          mobileScale: 1.02,

          contextRadius: 255
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "formal-center",

        residentScale:
          "contained",

        preserveNeighborContext:
          true
      }
    }),

    "guide-foyer": createRoom({
      id:
        "guide-foyer",

      label:
        "Guide Foyer",

      shortLabel:
        "Guide Foyer",

      categoryLabel:
        "House Entry",

      route:
        "/showroom/globe/hearth/jeeves/",

      authority:
        "jeeves",

      type:
        "orientation",

      rank:
        "medium",

      cardinalSector:
        "north",

      estateWing:
        "north-inner-left",

      architecturalShape:
        "formal-foyer",

      summary:
        "The formal entry chamber for House orientation.",

      detail:
        "The Guide Foyer introduces the House, identifies the resident guides, and prepares visitors to move through the estate without turning orientation into assessment.",

      visitorCan: [
        "Meet the Guides",
        "Understand House Navigation",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "house-core",
        "human-threshold",
        "book-chamber"
      ],

      corridorAccess: [
        "north-left-junction"
      ],

      legacyGeometry: {
        x: 34.5,
        y: 14.2,
        width: 17,
        height: 14
      },

      architecturalFeatureZones: [
        feature(
          "entry-seal",
          39,
          39,
          22,
          29
        ),
        feature(
          "double-door",
          42,
          0,
          16,
          22
        ),
        feature(
          "service-wall",
          6,
          20,
          15,
          64
        )
      ],

      zones: zones({
        label: [22, 7, 56, 15],
        summary: [14, 25, 72, 22],
        detail: [8, 17, 49, 50],
        portrait: [60, 22, 31, 48],
        action: [8, 72, 84, 20]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-guide-foyer",

        center:
          [430, 190, 42],

        size:
          [170, 125, 58],

        floorZ:
          10,

        wallZ:
          62,

        avatarAnchor:
          [430, 208, 118],

        labelAnchor:
          [430, 132, 147],

        actionAnchor:
          [430, 250, 132],

        corridorNode:
          "north-left-junction",

        camera: camera({
          target:
            [430, 196, 56],

          distance: 455,

          perspective: 1010,

          rotateX: 10,
          rotateY: -5,
          rotateZ: 0,

          scale: 1.42,

          mobileTarget:
            [446, 214, 46],

          mobileDistance: 670,
          mobileScale: 1,

          contextRadius: 230
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "formal-welcome",

        residentScale:
          "contained",

        preserveNeighborContext:
          true
      }
    }),

    "book-chamber": createRoom({
      id:
        "book-chamber",

      label:
        "Book Chamber",

      shortLabel:
        "Book Chamber",

      categoryLabel:
        "Nine Summits Book",

      route:
        "/nine-summits-of-love/",

      authority:
        "elara",

      type:
        "book",

      rank:
        "medium",

      cardinalSector:
        "north",

      estateWing:
        "north-inner-right",

      architecturalShape:
        "book-apse",

      summary:
        "The human-first chamber of The Nine Summits of Love.",

      detail:
        "The Book Chamber begins with the locked heart and follows the human climb through Character, Structure, Balance, Stability, Peace, Joy, Dignity, Free Will, and Love.",

      visitorCan: [
        "Open Nine Summits",
        "Understand the Book Path",
        "Talk to Elara"
      ],

      relatedRooms: [
        "house-core",
        "human-threshold",
        "guide-foyer",
        "hearth-room"
      ],

      corridorAccess: [
        "north-right-junction"
      ],

      legacyGeometry: {
        x: 51.5,
        y: 14.2,
        width: 17,
        height: 14
      },

      architecturalFeatureZones: [
        feature(
          "reading-apse",
          55,
          3,
          40,
          45
        ),
        feature(
          "book-wall",
          5,
          15,
          16,
          67
        ),
        feature(
          "reading-table",
          29,
          48,
          38,
          15
        )
      ],

      zones: zones({
        label: [18, 7, 64, 15],
        summary: [12, 24, 76, 22],
        detail: [8, 17, 50, 50],
        portrait: [61, 22, 31, 49],
        action: [8, 72, 84, 20]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-book-chamber",

        center:
          [570, 190, 42],

        size:
          [170, 125, 58],

        floorZ:
          10,

        wallZ:
          62,

        avatarAnchor:
          [570, 208, 118],

        labelAnchor:
          [570, 132, 147],

        actionAnchor:
          [570, 250, 132],

        corridorNode:
          "north-right-junction",

        camera: camera({
          target:
            [570, 196, 56],

          distance: 455,

          perspective: 1010,

          rotateX: 10,
          rotateY: 5,
          rotateZ: 0,

          scale: 1.42,

          mobileTarget:
            [554, 214, 46],

          mobileDistance: 670,
          mobileScale: 1,

          contextRadius: 230
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "signal-illumination",

        residentScale:
          "contained",

        preserveNeighborContext:
          true
      }
    }),

    "human-threshold": createRoom({
      id:
        "human-threshold",

      label:
        "Human Threshold",

      shortLabel:
        "Human Threshold",

      categoryLabel:
        "Human Origin",

      route:
        "/meet-sean-mansfield/",

      authority:
        "elara",

      type:
        "human",

      rank:
        "grand",

      cardinalSector:
        "northwest",

      estateWing:
        "upper-left-lobe",

      architecturalShape:
        "angled-threshold",

      summary:
        "The human entrance into the larger House.",

      detail:
        "The Human Threshold introduces Sean, the voice behind the estate, and the lived experiences that shaped its architecture. Elara guides the transition from the person into the larger House.",

      visitorCan: [
        "Meet Sean",
        "Understand the Origin",
        "Talk to Elara"
      ],

      relatedRooms: [
        "guide-foyer",
        "book-chamber",
        "law-library",
        "showroom"
      ],

      corridorAccess: [
        "north-left-junction"
      ],

      legacyGeometry: {
        x: 15.25,
        y: 13.05,
        width: 23.5,
        height: 19.45
      },

      architecturalFeatureZones: [
        feature(
          "angled-wall",
          0,
          0,
          28,
          100
        ),
        feature(
          "threshold-light",
          43,
          34,
          18,
          26
        ),
        feature(
          "portrait-niche",
          68,
          15,
          22,
          52
        )
      ],

      zones: zones({
        label: [8, 8, 66, 14],
        summary: [8, 25, 58, 21],
        detail: [6, 18, 50, 51],
        portrait: [55, 18, 41, 58],
        action: [6, 73, 88, 20]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-human-threshold",

        center:
          [270, 215, 28],

        size:
          [235, 175, 76],

        floorZ:
          -2,

        wallZ:
          72,

        avatarAnchor:
          [300, 246, 118],

        labelAnchor:
          [244, 132, 144],

        actionAnchor:
          [274, 310, 132],

        corridorNode:
          "north-left-junction",

        camera: camera({
          target:
            [282, 228, 44],

          distance: 535,

          perspective: 1040,

          rotateX: 9,
          rotateY: -8,
          rotateZ: -1,

          scale: 1.28,

          mobileTarget:
            [310, 258, 32],

          mobileDistance: 760,
          mobileScale: 0.9,

          contextRadius: 265
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "signal-greeting",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "product-gallery": createRoom({
      id:
        "product-gallery",

      label:
        "Product Gallery",

      shortLabel:
        "Products",

      categoryLabel:
        "Tools and Use",

      route:
        "/products/",

      authority:
        "auren",

      type:
        "product",

      rank:
        "grand",

      cardinalSector:
        "northeast",

      estateWing:
        "upper-right-lobe",

      architecturalShape:
        "workshop-gallery",

      summary:
        "Where ideas become practical tools and usable systems.",

      detail:
        "The Product Gallery contains practical expressions of the House: tools, games, learning systems, support surfaces, and products that translate ideas into use.",

      visitorCan: [
        "Open Products",
        "Explore Practical Tools",
        "Ask Auren"
      ],

      relatedRooms: [
        "book-chamber",
        "diagnostic-room",
        "lab",
        "frontier-workshop"
      ],

      corridorAccess: [
        "north-right-junction"
      ],

      legacyGeometry: {
        x: 61.25,
        y: 13.05,
        width: 23.5,
        height: 19.45
      },

      architecturalFeatureZones: [
        feature(
          "display-bay",
          5,
          16,
          17,
          62
        ),
        feature(
          "workbench",
          28,
          54,
          42,
          14
        ),
        feature(
          "instrument-bay",
          76,
          18,
          18,
          58
        )
      ],

      zones: zones({
        label: [26, 8, 66, 14],
        summary: [34, 25, 58, 21],
        detail: [43, 18, 51, 51],
        portrait: [5, 18, 39, 58],
        action: [6, 73, 88, 20]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-product-gallery",

        center:
          [730, 215, 28],

        size:
          [235, 175, 76],

        floorZ:
          -2,

        wallZ:
          72,

        avatarAnchor:
          [700, 246, 118],

        labelAnchor:
          [756, 132, 144],

        actionAnchor:
          [726, 310, 132],

        corridorNode:
          "north-right-junction",

        camera: camera({
          target:
            [718, 228, 44],

          distance: 535,

          perspective: 1040,

          rotateX: 9,
          rotateY: 8,
          rotateZ: 1,

          scale: 1.28,

          mobileTarget:
            [690, 258, 32],

          mobileDistance: 760,
          mobileScale: 0.9,

          contextRadius: 265
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "tool-ready",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "law-library": createRoom({
      id:
        "law-library",

      label:
        "Law Library",

      shortLabel:
        "Law Library",

      categoryLabel:
        "Governance and Canon",

      route:
        "/laws/",

      authority:
        "jeeves",

      type:
        "law",

      rank:
        "medium",

      cardinalSector:
        "northwest-inner",

      estateWing:
        "left-shoulder",

      architecturalShape:
        "archive-aisle",

      summary:
        "The House archive for governing laws and canonical bindings.",

      detail:
        "The Law Library preserves governing laws, formal bindings, canonical distinctions, and orientation structures that must remain stable across implementation.",

      visitorCan: [
        "Open the Laws",
        "Read Canonical Bindings",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "human-threshold",
        "house-core",
        "showroom",
        "atlas-study"
      ],

      corridorAccess: [
        "north-left-junction",
        "west-junction"
      ],

      legacyGeometry: {
        x: 27.25,
        y: 29.15,
        width: 16.5,
        height: 16.1
      },

      architecturalFeatureZones: [
        feature(
          "shelf-left",
          4,
          12,
          14,
          70
        ),
        feature(
          "archive-aisle",
          43,
          12,
          14,
          70
        ),
        feature(
          "shelf-right",
          82,
          12,
          14,
          70
        )
      ],

      zones: zones({
        label: [17, 7, 66, 15],
        summary: [14, 25, 72, 22],
        detail: [7, 17, 50, 51],
        portrait: [60, 19, 33, 53],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-law-library",

        center:
          [355, 335, 24],

        size:
          [165, 145, 62],

        floorZ:
          -4,

        wallZ:
          58,

        avatarAnchor:
          [372, 360, 108],

        labelAnchor:
          [340, 272, 138],

        actionAnchor:
          [356, 411, 126],

        corridorNode:
          "west-junction",

        camera: camera({
          target:
            [360, 344, 38],

          distance: 470,

          perspective: 1010,

          rotateX: 10,
          rotateY: -7,
          rotateZ: 0,

          scale: 1.38,

          mobileTarget:
            [380, 370, 26],

          mobileDistance: 700,
          mobileScale: 0.94,

          contextRadius: 225
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "formal-reference",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "diagnostic-room": createRoom({
      id:
        "diagnostic-room",

      label:
        "Diagnostic Room",

      shortLabel:
        "Diagnostic",

      categoryLabel:
        "Coherence Orientation",

      route:
        "/diagnostic/",

      authority:
        "soren",

      type:
        "diagnostic",

      rank:
        "medium",

      cardinalSector:
        "northeast-inner",

      estateWing:
        "right-shoulder",

      architecturalShape:
        "hex-diagnostic",

      summary:
        "A protected orientation chamber for coherence tools.",

      detail:
        "The Diagnostic Room provides orientation to coherence instruments and directs visitors to the proper diagnostic surface. Soren explains the tools but does not classify the visitor.",

      visitorCan: [
        "Open the Diagnostic",
        "Understand the Instrument",
        "Ask Soren"
      ],

      relatedRooms: [
        "product-gallery",
        "house-core",
        "lab",
        "frontier-workshop"
      ],

      corridorAccess: [
        "north-right-junction",
        "east-junction"
      ],

      legacyGeometry: {
        x: 56.25,
        y: 29.15,
        width: 16.5,
        height: 16.1
      },

      architecturalFeatureZones: [
        feature(
          "diagnostic-seal",
          35,
          25,
          30,
          36
        ),
        feature(
          "gauge-bank",
          6,
          18,
          14,
          63
        ),
        feature(
          "instrument-bay",
          80,
          18,
          14,
          63
        )
      ],

      zones: zones({
        label: [17, 7, 66, 15],
        summary: [14, 25, 72, 22],
        detail: [43, 17, 50, 51],
        portrait: [7, 19, 33, 53],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-diagnostic-room",

        center:
          [645, 335, 24],

        size:
          [165, 145, 62],

        floorZ:
          -4,

        wallZ:
          58,

        avatarAnchor:
          [628, 360, 108],

        labelAnchor:
          [660, 272, 138],

        actionAnchor:
          [644, 411, 126],

        corridorNode:
          "east-junction",

        camera: camera({
          target:
            [640, 344, 38],

          distance: 470,

          perspective: 1010,

          rotateX: 10,
          rotateY: 7,
          rotateZ: 0,

          scale: 1.38,

          mobileTarget:
            [620, 370, 26],

          mobileDistance: 700,
          mobileScale: 0.94,

          contextRadius: 225
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "diagnostic-attend",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    showroom: createRoom({
      id:
        "showroom",

      label:
        "Showroom",

      shortLabel:
        "Showroom",

      categoryLabel:
        "Public Proof",

      route:
        "/showroom/",

      authority:
        "jeeves",

      type:
        "showroom",

      rank:
        "medium",

      cardinalSector:
        "west",

      estateWing:
        "left-middle",

      architecturalShape:
        "bowed-atrium",

      summary:
        "The public-facing demonstration chamber.",

      detail:
        "The Showroom makes the build visible through public demonstrations, planets, products, rooms, and proof surfaces without requiring the visitor to understand the entire system first.",

      visitorCan: [
        "Open Showroom",
        "See Public Proof",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "human-threshold",
        "law-library",
        "house-core",
        "atlas-study"
      ],

      corridorAccess: [
        "west-junction"
      ],

      legacyGeometry: {
        x: 12,
        y: 36.7,
        width: 19,
        height: 18.9
      },

      architecturalFeatureZones: [
        feature(
          "bowed-wall",
          0,
          4,
          28,
          92
        ),
        feature(
          "exhibit-bay",
          36,
          14,
          18,
          62
        ),
        feature(
          "display-bay",
          69,
          14,
          20,
          62
        )
      ],

      zones: zones({
        label: [15, 7, 68, 15],
        summary: [12, 24, 74, 22],
        detail: [7, 17, 52, 51],
        portrait: [60, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-showroom",

        center:
          [215, 415, 12],

        size:
          [190, 170, 66],

        floorZ:
          -10,

        wallZ:
          52,

        avatarAnchor:
          [242, 448, 102],

        labelAnchor:
          [192, 342, 126],

        actionAnchor:
          [218, 500, 118],

        corridorNode:
          "west-junction",

        camera: camera({
          target:
            [226, 427, 24],

          distance: 510,

          perspective: 1040,

          rotateX: 10,
          rotateY: -10,
          rotateZ: -1,

          scale: 1.28,

          mobileTarget:
            [258, 462, 14],

          mobileDistance: 760,
          mobileScale: 0.88,

          contextRadius: 245
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "atrium-present",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    lab: createRoom({
      id:
        "lab",

      label:
        "The Lab",

      shortLabel:
        "The Lab",

      categoryLabel:
        "Technical Development",

      route:
        "/lab/",

      authority:
        "jeeves",

      type:
        "proof",

      rank:
        "medium",

      cardinalSector:
        "east",

      estateWing:
        "right-middle",

      architecturalShape:
        "technical-annex",

      summary:
        "The technical chamber for active development and testing.",

      detail:
        "The Lab contains active development lanes, technical experiments, interface tests, and system construction that are not yet ready to become public proof surfaces.",

      visitorCan: [
        "Open the Lab",
        "Review Active Development",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "product-gallery",
        "diagnostic-room",
        "house-core",
        "frontier-workshop"
      ],

      corridorAccess: [
        "east-junction"
      ],

      legacyGeometry: {
        x: 69,
        y: 36.7,
        width: 19,
        height: 18.9
      },

      architecturalFeatureZones: [
        feature(
          "controlled-entry",
          35,
          0,
          30,
          14
        ),
        feature(
          "instrument-bay",
          7,
          16,
          17,
          65
        ),
        feature(
          "gauge-bank",
          76,
          16,
          17,
          65
        )
      ],

      zones: zones({
        label: [17, 7, 66, 15],
        summary: [14, 24, 72, 22],
        detail: [41, 17, 52, 51],
        portrait: [7, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-lab",

        center:
          [785, 415, 12],

        size:
          [190, 170, 66],

        floorZ:
          -10,

        wallZ:
          52,

        avatarAnchor:
          [758, 448, 102],

        labelAnchor:
          [808, 342, 126],

        actionAnchor:
          [782, 500, 118],

        corridorNode:
          "east-junction",

        camera: camera({
          target:
            [774, 427, 24],

          distance: 510,

          perspective: 1040,

          rotateX: 10,
          rotateY: 10,
          rotateZ: 1,

          scale: 1.28,

          mobileTarget:
            [742, 462, 14],

          mobileDistance: 760,
          mobileScale: 0.88,

          contextRadius: 245
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "instrument-check",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "education-room": createRoom({
      id:
        "education-room",

      label:
        "Education Room",

      shortLabel:
        "Education",

      categoryLabel:
        "Learning and Formation",

      route:
        "/education/",

      authority:
        "auren",

      type:
        "product",

      rank:
        "small",

      cardinalSector:
        "southwest",

      estateWing:
        "lower-left-middle",

      architecturalShape:
        "tiered-classroom",

      summary:
        "A practical learning chamber for formation and instruction.",

      detail:
        "The Education Room translates House ideas into teachable sequences, structured learning, accessible instruction, and practical formation.",

      visitorCan: [
        "Open Education",
        "Review Learning Paths",
        "Ask Auren"
      ],

      relatedRooms: [
        "showroom",
        "atlas-study",
        "house-core",
        "portrait-hall"
      ],

      corridorAccess: [
        "southwest-junction"
      ],

      legacyGeometry: {
        x: 20.5,
        y: 52.5,
        width: 17,
        height: 16.1
      },

      architecturalFeatureZones: [
        feature(
          "teaching-wall",
          16,
          7,
          68,
          14
        ),
        feature(
          "tier",
          9,
          66,
          82,
          9
        ),
        feature(
          "tier",
          15,
          79,
          70,
          8
        )
      ],

      zones: zones({
        label: [15, 7, 70, 15],
        summary: [12, 24, 76, 22],
        detail: [7, 17, 52, 51],
        portrait: [60, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-education-room",

        center:
          [290, 545, 8],

        size:
          [170, 145, 58],

        floorZ:
          -12,

        wallZ:
          46,

        avatarAnchor:
          [310, 572, 92],

        labelAnchor:
          [274, 480, 116],

        actionAnchor:
          [292, 620, 108],

        corridorNode:
          "southwest-junction",

        camera: camera({
          target:
            [298, 556, 20],

          distance: 470,

          perspective: 1010,

          rotateX: 11,
          rotateY: -8,
          rotateZ: -1,

          scale: 1.34,

          mobileTarget:
            [326, 585, 8],

          mobileDistance: 700,
          mobileScale: 0.92,

          contextRadius: 220
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "teaching-ready",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "portrait-hall": createRoom({
      id:
        "portrait-hall",

      label:
        "Portrait Hall",

      shortLabel:
        "Portrait Hall",

      categoryLabel:
        "Characters and Identity",

      route:
        "/characters/",

      authority:
        "jeeves",

      type:
        "future-character",

      rank:
        "medium",

      cardinalSector:
        "south-center",

      estateWing:
        "central-lower-gallery",

      architecturalShape:
        "portrait-gallery",

      summary:
        "The estate’s character gallery and routing chamber.",

      detail:
        "Portrait Hall is the estate’s character gallery and future character-first routing chamber. It preserves identities as residents of the House without replacing room-first navigation.",

      visitorCan: [
        "Open the Characters",
        "Inspect Identities",
        "Return to House Orientation"
      ],

      relatedRooms: [
        "house-core",
        "education-room",
        "atlas-study",
        "frontier-workshop",
        "hearth-room"
      ],

      corridorAccess: [
        "southeast-junction",
        "south-junction"
      ],

      legacyGeometry: {
        x: 39.75,
        y: 53.6,
        width: 20.5,
        height: 14.45
      },

      architecturalFeatureZones: [
        feature(
          "portrait-niche",
          5,
          18,
          15,
          55
        ),
        feature(
          "portrait-niche",
          30,
          18,
          15,
          55
        ),
        feature(
          "portrait-niche",
          55,
          18,
          15,
          55
        ),
        feature(
          "portrait-niche",
          80,
          18,
          15,
          55
        )
      ],

      zones: zones({
        label: [19, 7, 62, 15],
        summary: [13, 25, 74, 20],
        detail: [7, 17, 52, 51],
        portrait: [60, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-portrait-hall",

        center:
          [500, 555, 18],

        size:
          [205, 130, 62],

        floorZ:
          -8,

        wallZ:
          54,

        avatarAnchor:
          [530, 580, 102],

        labelAnchor:
          [500, 495, 126],

        actionAnchor:
          [500, 630, 116],

        corridorNode:
          "south-junction",

        camera: camera({
          target:
            [500, 561, 30],

          distance: 500,

          perspective: 1030,

          rotateX: 11,
          rotateY: 0,
          rotateZ: 0,

          scale: 1.32,

          mobileTarget:
            [510, 592, 18],

          mobileDistance: 730,
          mobileScale: 0.9,

          contextRadius: 235
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "gallery-present",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "atlas-study": createRoom({
      id:
        "atlas-study",

      label:
        "Atlas Study",

      shortLabel:
        "Atlas",

      categoryLabel:
        "World Orientation",

      route:
        "/showroom/globe/",

      authority:
        "jeeves",

      type:
        "world",

      rank:
        "small",

      cardinalSector:
        "southwest-lower",

      estateWing:
        "lower-left-interior",

      architecturalShape:
        "round-study",

      summary:
        "The world-orientation study for planets, regions, and routes.",

      detail:
        "The Atlas Study orients visitors across Earth, Audralia, Hearth, H-Earth, and the wider planetary lanes without collapsing those worlds into one another.",

      visitorCan: [
        "Open the Atlas",
        "Review World Routes",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "showroom",
        "education-room",
        "portrait-hall",
        "hearth-room"
      ],

      corridorAccess: [
        "southwest-junction",
        "south-junction"
      ],

      legacyGeometry: {
        x: 31,
        y: 64.7,
        width: 16,
        height: 15
      },

      architecturalFeatureZones: [
        feature(
          "radial-floor",
          17,
          12,
          66,
          70
        ),
        feature(
          "atlas-table",
          34,
          38,
          32,
          29
        ),
        feature(
          "map-reference",
          73,
          15,
          17,
          55
        )
      ],

      zones: zones({
        label: [15, 7, 70, 15],
        summary: [12, 24, 76, 22],
        detail: [7, 17, 52, 51],
        portrait: [60, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-atlas-study",

        center:
          [390, 650, 4],

        size:
          [160, 135, 54],

        floorZ:
          -16,

        wallZ:
          38,

        avatarAnchor:
          [406, 676, 84],

        labelAnchor:
          [380, 590, 106],

        actionAnchor:
          [392, 718, 100],

        corridorNode:
          "southwest-junction",

        camera: camera({
          target:
            [394, 660, 14],

          distance: 450,

          perspective: 1000,

          rotateX: 12,
          rotateY: -6,
          rotateZ: 0,

          scale: 1.38,

          mobileTarget:
            [418, 688, 4],

          mobileDistance: 680,
          mobileScale: 0.9,

          contextRadius: 210
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "map-reference",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "frontier-workshop": createRoom({
      id:
        "frontier-workshop",

      label:
        "Frontier Workshop",

      shortLabel:
        "Frontier",

      categoryLabel:
        "Future Construction",

      route:
        "/frontier/",

      authority:
        "auren",

      type:
        "frontier",

      rank:
        "small",

      cardinalSector:
        "southeast-lower",

      estateWing:
        "lower-right-interior",

      architecturalShape:
        "frontier-wedge",

      summary:
        "The future-facing chamber for emerging work.",

      detail:
        "The Frontier Workshop holds emerging construction, experimental products, future rooms, and development lanes that have not yet stabilized into permanent architecture.",

      visitorCan: [
        "Open Frontier Work",
        "Review Emerging Construction",
        "Ask Auren"
      ],

      relatedRooms: [
        "product-gallery",
        "lab",
        "portrait-hall",
        "hearth-room"
      ],

      corridorAccess: [
        "southeast-junction",
        "south-junction"
      ],

      legacyGeometry: {
        x: 53,
        y: 64.7,
        width: 16,
        height: 15
      },

      architecturalFeatureZones: [
        feature(
          "future-bay",
          8,
          18,
          22,
          60
        ),
        feature(
          "workbench",
          37,
          54,
          36,
          14
        ),
        feature(
          "future-bay",
          78,
          18,
          14,
          60
        )
      ],

      zones: zones({
        label: [15, 7, 70, 15],
        summary: [12, 24, 76, 22],
        detail: [41, 17, 52, 51],
        portrait: [7, 20, 33, 52],
        action: [7, 73, 86, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-frontier-workshop",

        center:
          [610, 650, 4],

        size:
          [160, 135, 54],

        floorZ:
          -16,

        wallZ:
          38,

        avatarAnchor:
          [594, 676, 84],

        labelAnchor:
          [620, 590, 106],

        actionAnchor:
          [608, 718, 100],

        corridorNode:
          "southeast-junction",

        camera: camera({
          target:
            [606, 660, 14],

          distance: 450,

          perspective: 1000,

          rotateX: 12,
          rotateY: 6,
          rotateZ: 0,

          scale: 1.38,

          mobileTarget:
            [582, 688, 4],

          mobileDistance: 680,
          mobileScale: 0.9,

          contextRadius: 210
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "frontier-ready",

        residentScale:
          "reduced",

        preserveNeighborContext:
          true
      }
    }),

    "hearth-room": createRoom({
      id:
        "hearth-room",

      label:
        "Hearth Room",

      shortLabel:
        "Hearth",

      categoryLabel:
        "Recenter and Return",

      route:
        "/showroom/globe/hearth/",

      authority:
        "jeeves",

      type:
        "world",

      rank:
        "medium",

      cardinalSector:
        "south",

      estateWing:
        "heart-point",

      architecturalShape:
        "rounded-hearth",

      summary:
        "The lower heart chamber for recentering and return.",

      detail:
        "The Hearth Room is the quiet convergence chamber at the point of the diamond heart. It reconnects visitors to Hearth, the resident guides, and the larger House after deeper travel.",

      visitorCan: [
        "Open Hearth",
        "Return to the Guides",
        "Ask Jeeves"
      ],

      relatedRooms: [
        "house-core",
        "book-chamber",
        "portrait-hall",
        "atlas-study",
        "frontier-workshop"
      ],

      corridorAccess: [
        "south-junction"
      ],

      legacyGeometry: {
        x: 41.25,
        y: 73.9,
        width: 17.5,
        height: 14.45
      },

      architecturalFeatureZones: [
        feature(
          "rounded-wall",
          3,
          5,
          94,
          90
        ),
        feature(
          "hearth-fire",
          37,
          33,
          26,
          30
        ),
        feature(
          "south-crossing",
          45,
          0,
          10,
          21
        )
      ],

      zones: zones({
        label: [18, 7, 64, 15],
        summary: [14, 24, 72, 22],
        detail: [8, 17, 48, 51],
        portrait: [59, 20, 33, 52],
        action: [8, 73, 84, 19]
      }),

      heart3d: heartRoom({
        facetId:
          "heart-facet-hearth-room",

        center:
          [500, 750, 16],

        size:
          [175, 130, 72],

        floorZ:
          -12,

        wallZ:
          58,

        avatarAnchor:
          [500, 775, 104],

        labelAnchor:
          [500, 700, 126],

        actionAnchor:
          [500, 820, 116],

        corridorNode:
          "south-junction",

        camera: camera({
          target:
            [500, 754, 30],

          distance: 430,

          perspective: 990,

          rotateX: 12,
          rotateY: 0,
          rotateZ: 0,

          scale: 1.42,

          mobileTarget:
            [500, 782, 18],

          mobileDistance: 660,
          mobileScale: 0.94,

          contextRadius: 215
        })
      }),

      roomBehavior: {
        arrivalGesture:
          "hearth-settle",

        residentScale:
          "contained",

        preserveNeighborContext:
          true
      }
    })
  });

  var HOME_AGENT_LOCATIONS = deepFreeze({
    jeeves:
      "house-core",

    auren:
      "product-gallery",

    soren:
      "diagnostic-room",

    elara:
      "human-threshold"
  });

  var ROUTE_ALIASES = deepFreeze({
    "/":
      "house-core",

    "/index.html":
      "house-core",

    "/nine-summits-of-love":
      "book-chamber",

    "/nine-summits-of-love/":
      "book-chamber",

    "/nine-summits":
      "book-chamber",

    "/nine-summits/":
      "book-chamber",

    "/meet-sean-mansfield":
      "human-threshold",

    "/meet-sean-mansfield/":
      "human-threshold",

    "/about-this-underdog":
      "human-threshold",

    "/about-this-underdog/":
      "human-threshold",

    "/products":
      "product-gallery",

    "/products/":
      "product-gallery",

    "/showroom":
      "showroom",

    "/showroom/":
      "showroom",

    "/showroom/globe":
      "atlas-study",

    "/showroom/globe/":
      "atlas-study",

    "/showroom/globe/hearth":
      "hearth-room",

    "/showroom/globe/hearth/":
      "hearth-room",

    "/laws":
      "law-library",

    "/laws/":
      "law-library",

    "/diagnostic":
      "diagnostic-room",

    "/diagnostic/":
      "diagnostic-room",

    "/education":
      "education-room",

    "/education/":
      "education-room",

    "/lab":
      "lab",

    "/lab/":
      "lab",

    "/characters":
      "portrait-hall",

    "/characters/":
      "portrait-hall",

    "/frontier":
      "frontier-workshop",

    "/frontier/":
      "frontier-workshop"
  });

  function createRoom(definition) {
    var legacy =
      definition.legacyGeometry;

    var room = {
      id:
        definition.id,

      label:
        definition.label,

      shortLabel:
        definition.shortLabel,

      categoryLabel:
        definition.categoryLabel,

      route:
        definition.route,

      authority:
        definition.authority,

      type:
        definition.type,

      rank:
        definition.rank,

      cardinalSector:
        definition.cardinalSector,

      estateWing:
        definition.estateWing,

      architecturalShape:
        definition.architecturalShape,

      summary:
        definition.summary,

      detail:
        definition.detail,

      visitorCan:
        definition.visitorCan.slice(),

      relatedRooms:
        definition.relatedRooms.slice(),

      corridorAccess:
        definition.corridorAccess.slice(),

      visible: true,

      x:
        legacy.x,

      y:
        legacy.y,

      width:
        legacy.width,

      height:
        legacy.height,

      legacyEstate:
        clone(legacy),

      labelZone:
        clone(
          definition.zones.label
        ),

      summaryZone:
        clone(
          definition.zones.summary
        ),

      detailZone:
        clone(
          definition.zones.detail
        ),

      portraitZone:
        clone(
          definition.zones.portrait
        ),

      actionZone:
        clone(
          definition.zones.action
        ),

      architecturalFeatureZones:
        definition.architecturalFeatureZones.map(
          clone
        ),

      heart3d:
        clone(
          definition.heart3d
        ),

      cameraFocus:
        {
          scale:
            definition.heart3d.camera
              .legacyScale,

          offsetX:
            definition.heart3d.camera
              .legacyOffsetX,

          offsetY:
            definition.heart3d.camera
              .legacyOffsetY
        },

      roomBehavior:
        clone(
          definition.roomBehavior
        )
    };

    return room;
  }

  function heartRoom(definition) {
    return {
      enabled: true,

      facetId:
        definition.facetId,

      center: xyz(
        definition.center
      ),

      size: {
        width:
          definition.size[0],

        height:
          definition.size[1],

        depth:
          definition.size[2]
      },

      floorZ:
        definition.floorZ,

      wallZ:
        definition.wallZ,

      avatarAnchor: xyz(
        definition.avatarAnchor
      ),

      labelAnchor: xyz(
        definition.labelAnchor
      ),

      actionAnchor: xyz(
        definition.actionAnchor
      ),

      corridorNode:
        definition.corridorNode,

      focusBounds: {
        minX:
          definition.center[0] -
          definition.size[0] / 2,

        maxX:
          definition.center[0] +
          definition.size[0] / 2,

        minY:
          definition.center[1] -
          definition.size[1] / 2,

        maxY:
          definition.center[1] +
          definition.size[1] / 2,

        minZ:
          definition.floorZ,

        maxZ:
          definition.wallZ
      },

      camera:
        clone(
          definition.camera
        )
    };
  }

  function camera(definition) {
    return {
      target:
        xyz(
          definition.target
        ),

      distance:
        definition.distance,

      perspective:
        definition.perspective,

      rotateX:
        definition.rotateX,

      rotateY:
        definition.rotateY,

      rotateZ:
        definition.rotateZ,

      scale:
        definition.scale,

      contextRadius:
        definition.contextRadius,

      preserveNeighborContext:
        true,

      avatarMaxFieldFraction:
        HEART_WORLD.roomViewLaw
          .maximumAvatarFieldFraction,

      mobile: {
        target:
          xyz(
            definition.mobileTarget
          ),

        distance:
          definition.mobileDistance,

        perspective:
          definition.perspective + 180,

        rotateX:
          Math.max(
            4,
            definition.rotateX - 3
          ),

        rotateY:
          definition.rotateY * 0.45,

        rotateZ:
          definition.rotateZ * 0.35,

        scale:
          definition.mobileScale,

        contextRadius:
          definition.contextRadius + 45,

        preserveNeighborContext:
          true,

        avatarMaxFieldFraction:
          HEART_WORLD.roomViewLaw
            .mobileMaximumAvatarFieldFraction
      },

      legacyScale:
        definition.scale,

      legacyOffsetX:
        definition.rotateY * -3,

      legacyOffsetY:
        definition.rotateX * -2
    };
  }

  function zones(definition) {
    return {
      label:
        rectangle(
          definition.label
        ),

      summary:
        rectangle(
          definition.summary
        ),

      detail:
        rectangle(
          definition.detail
        ),

      portrait:
        rectangle(
          definition.portrait
        ),

      action:
        rectangle(
          definition.action
        )
    };
  }

  function rectangle(values) {
    return {
      x: values[0],
      y: values[1],
      width: values[2],
      height: values[3]
    };
  }

  function feature(
    type,
    x,
    y,
    width,
    height
  ) {
    return {
      type: type,
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  function xyz(values) {
    return {
      x: values[0],
      y: values[1],
      z: values[2]
    };
  }

  function clone(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clone);
    }

    var copy = {};

    Object.keys(value).forEach(
      function cloneKey(key) {
        copy[key] =
          clone(value[key]);
      }
    );

    return copy;
  }

  function deepFreeze(value) {
    if (
      !value ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.keys(value).forEach(
      function freezeChild(key) {
        deepFreeze(value[key]);
      }
    );

    return Object.freeze(value);
  }

  function normalizePath(pathname) {
    var path =
      typeof pathname === "string"
        ? pathname
        : "/";

    path =
      path.split("?")[0]
        .split("#")[0]
        .replace(/\/+/g, "/");

    if (!path) {
      return "/";
    }

    if (
      path.length > 1 &&
      path.endsWith("/index.html")
    ) {
      path =
        path.slice(
          0,
          -"index.html".length
        );
    }

    if (
      path.length > 1 &&
      path.endsWith("/")
    ) {
      return path;
    }

    return path;
  }

  function roomExists(roomId) {
    return Boolean(
      typeof roomId === "string" &&
      Object.prototype.hasOwnProperty.call(
        ROOMS,
        roomId
      )
    );
  }

  function agentExists(agentId) {
    return Boolean(
      typeof agentId === "string" &&
      Object.prototype.hasOwnProperty.call(
        AGENTS,
        agentId
      )
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

  function facetExists(facetIdOrRoomId) {
    if (
      typeof facetIdOrRoomId !==
      "string"
    ) {
      return false;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        HEART_FACETS,
        facetIdOrRoomId
      )
    ) {
      return true;
    }

    return Object.keys(
      HEART_FACETS
    ).some(function matchFacet(roomId) {
      return (
        HEART_FACETS[roomId].id ===
        facetIdOrRoomId
      );
    });
  }

  function getRoom(roomId) {
    if (roomExists(roomId)) {
      return ROOMS[roomId];
    }

    return ROOMS[
      DEFAULT_ROOM_ID
    ];
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

  function getHeartFacet(
    facetIdOrRoomId
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        HEART_FACETS,
        facetIdOrRoomId
      )
    ) {
      return HEART_FACETS[
        facetIdOrRoomId
      ];
    }

    var roomId =
      Object.keys(
        HEART_FACETS
      ).find(function findFacet(key) {
        return (
          HEART_FACETS[key].id ===
          facetIdOrRoomId
        );
      });

    return roomId
      ? HEART_FACETS[roomId]
      : null;
  }

  function resolveAuthority(
    roomOrRoomId
  ) {
    var room =
      typeof roomOrRoomId ===
        "string"
        ? getRoom(roomOrRoomId)
        : roomOrRoomId;

    if (
      room &&
      agentExists(room.authority)
    ) {
      return room.authority;
    }

    return "jeeves";
  }

  function resolveRoomFromPath(
    pathname
  ) {
    var normalized =
      normalizePath(pathname);

    if (
      Object.prototype.hasOwnProperty.call(
        ROUTE_ALIASES,
        normalized
      )
    ) {
      return ROUTE_ALIASES[
        normalized
      ];
    }

    var normalizedWithSlash =
      normalized === "/"
        ? normalized
        : normalized + "/";

    if (
      Object.prototype.hasOwnProperty.call(
        ROUTE_ALIASES,
        normalizedWithSlash
      )
    ) {
      return ROUTE_ALIASES[
        normalizedWithSlash
      ];
    }

    var directRoom =
      Object.keys(ROOMS).find(
        function matchRoomRoute(roomId) {
          var route =
            normalizePath(
              ROOMS[roomId].route
            );

          return (
            route === normalized ||
            route ===
              normalizedWithSlash
          );
        }
      );

    return directRoom ||
      DEFAULT_ROOM_ID;
  }

  function worldToPercent(point) {
    return {
      x:
        point.x /
        HEART_WORLD.width *
        100,

      y:
        point.y /
        HEART_WORLD.height *
        100,

      z:
        point.z
    };
  }

  function getRoomHeartCenter(
    roomId
  ) {
    return clone(
      getRoom(roomId)
        .heart3d.center
    );
  }

  function getRoomAvatarAnchor(
    roomId
  ) {
    return clone(
      getRoom(roomId)
        .heart3d.avatarAnchor
    );
  }

  function getRoomCamera(
    roomId,
    mobile
  ) {
    var cameraData =
      getRoom(roomId)
        .heart3d.camera;

    return clone(
      mobile
        ? cameraData.mobile
        : cameraData
    );
  }

  function getValidationReport() {
    var errors = [];
    var warnings = [];

    Object.keys(ROOMS).forEach(
      function validateRoom(roomId) {
        var room =
          ROOMS[roomId];

        if (room.id !== roomId) {
          errors.push(
            "Room key mismatch: " +
            roomId
          );
        }

        if (
          !agentExists(
            room.authority
          )
        ) {
          errors.push(
            roomId +
            " has invalid authority " +
            room.authority
          );
        }

        if (
          !room.route ||
          typeof room.route !==
            "string"
        ) {
          errors.push(
            roomId +
            " has no route."
          );
        }

        if (
          !room.heart3d ||
          !room.heart3d.enabled
        ) {
          errors.push(
            roomId +
            " has no active heart3d definition."
          );
        }

        if (
          !facetExists(
            room.heart3d.facetId
          )
        ) {
          errors.push(
            roomId +
            " references an unavailable heart facet."
          );
        }

        if (
          !corridorExists(
            room.heart3d
              .corridorNode
          )
        ) {
          errors.push(
            roomId +
            " references an unavailable heart corridor."
          );
        }

        room.corridorAccess.forEach(
          function validateAccess(corridorId) {
            if (
              !corridorExists(
                corridorId
              )
            ) {
              errors.push(
                roomId +
                " has invalid corridor access " +
                corridorId
              );
            }
          }
        );

        room.relatedRooms.forEach(
          function validateRelated(relatedRoomId) {
            if (
              !roomExists(
                relatedRoomId
              )
            ) {
              errors.push(
                roomId +
                " has invalid related room " +
                relatedRoomId
              );
            }
          }
        );

        var center =
          room.heart3d.center;

        if (
          center.x < 0 ||
          center.x >
            HEART_WORLD.width ||
          center.y < 0 ||
          center.y >
            HEART_WORLD.height ||
          center.z <
            HEART_WORLD.minZ ||
          center.z >
            HEART_WORLD.maxZ
        ) {
          errors.push(
            roomId +
            " falls outside the heart world."
          );
        }

        if (
          room.roomBehavior
            .residentScale !==
            "reduced" &&
          room.roomBehavior
            .residentScale !==
            "contained"
        ) {
          warnings.push(
            roomId +
            " does not declare a contained resident scale."
          );
        }
      }
    );

    Object.keys(AGENTS).forEach(
      function validateAgent(agentId) {
        var agent =
          AGENTS[agentId];

        if (
          agent.id !== agentId
        ) {
          errors.push(
            "Agent key mismatch: " +
            agentId
          );
        }

        if (
          !roomExists(
            agent.homeRoom
          )
        ) {
          errors.push(
            agentId +
            " has invalid home room " +
            agent.homeRoom
          );
        }
      }
    );

    Object.keys(CORRIDORS).forEach(
      function validateCorridor(corridorId) {
        var corridor =
          CORRIDORS[corridorId];

        corridor.connections.forEach(
          function validateConnection(connection) {
            if (
              connection.indexOf(
                "room:"
              ) === 0
            ) {
              var roomId =
                connection.slice(5);

              if (
                !roomExists(roomId)
              ) {
                errors.push(
                  corridorId +
                  " references invalid room " +
                  roomId
                );
              }

              return;
            }

            if (
              !corridorExists(
                connection
              )
            ) {
              errors.push(
                corridorId +
                " references invalid corridor " +
                connection
              );
            }
          }
        );
      }
    );

    return {
      contract:
        CONTRACT,

      valid:
        errors.length === 0,

      roomCount:
        Object.keys(ROOMS).length,

      agentCount:
        Object.keys(AGENTS).length,

      corridorCount:
        Object.keys(CORRIDORS).length,

      facetCount:
        Object.keys(HEART_FACETS).length,

      errors:
        errors,

      warnings:
        warnings
    };
  }

  var DATA = {
    contract:
      CONTRACT,

    version:
      "2.0.0",

    architecture:
      "diamond-heart-3d",

    defaultRoomId:
      DEFAULT_ROOM_ID,

    viewModes:
      VIEW_MODES,

    idleStages:
      IDLE_STAGES,

    timing:
      TIMING,

    avatarStatePriority:
      AVATAR_STATE_PRIORITY,

    heartWorld:
      HEART_WORLD,

    heartFacets:
      HEART_FACETS,

    rooms:
      ROOMS,

    agents:
      AGENTS,

    corridors:
      CORRIDORS,

    homeAgentLocations:
      HOME_AGENT_LOCATIONS,

    routeAliases:
      ROUTE_ALIASES,

    roomExists:
      roomExists,

    agentExists:
      agentExists,

    corridorExists:
      corridorExists,

    facetExists:
      facetExists,

    getRoom:
      getRoom,

    getAgent:
      getAgent,

    getCorridor:
      getCorridor,

    getHeartFacet:
      getHeartFacet,

    resolveAuthority:
      resolveAuthority,

    resolveRoomFromPath:
      resolveRoomFromPath,

    worldToPercent:
      worldToPercent,

    getRoomHeartCenter:
      getRoomHeartCenter,

    getRoomAvatarAnchor:
      getRoomAvatarAnchor,

    getRoomCamera:
      getRoomCamera,

    getValidationReport:
      getValidationReport
  };

  deepFreeze(DATA);

  global.HOUSE_CONTROL_PAD_DATA =
    DATA;

  try {
    global.dispatchEvent(
      new CustomEvent(
        "house-control-pad:data-ready",
        {
          detail: {
            contract:
              CONTRACT,

            architecture:
              "diamond-heart-3d",

            roomCount:
              Object.keys(
                ROOMS
              ).length,

            agentCount:
              Object.keys(
                AGENTS
              ).length,

            corridorCount:
              Object.keys(
                CORRIDORS
              ).length,

            facetCount:
              Object.keys(
                HEART_FACETS
              ).length,

            world: {
              width:
                HEART_WORLD.width,

              height:
                HEART_WORLD.height,

              depth:
                HEART_WORLD.depth,

              origin:
                clone(
                  HEART_WORLD.origin
                )
            }
          }
        }
      )
    );
  } catch (error) {
    // No-op.
  }
})(window);
