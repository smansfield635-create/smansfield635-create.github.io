// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_FIGURE_EIGHT_CONVERSATION_BRAIN_ENGINE_TNT_v11
// Full-file replacement.
// Owns: collapsed Jeeves house intelligence, deterministic 256-state conversation scope, 20 internal conversational organs, 4x4 curiosity chamber, immersive question chamber, figure-eight traversal, conversation-brain awareness, reader-paced cadence, guided route handoffs, current-session memory.
// Does not own: HTML shell, CSS styling, backend, persistent storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeevesFigureEightConversationBrainEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_FIGURE_EIGHT_CONVERSATION_BRAIN_ENGINE_TNT_v11";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var PACING = {
    firstMessageDelayMs: 950,

    typingBaseMs: 1400,
    typingWordMs: 120,
    typingMinMs: 1450,
    typingMaxMs: 5200,

    readBaseMs: 1750,
    readWordMs: 115,
    readMinMs: 2100,
    readMaxMs: 6800,

    optionRevealDelayMs: 1200
  };

  var MAX_HISTORY = 40;
  var MAX_PATH_DEPTH = 4;
  var MAX_TRAIL = 8;

  var DEFAULT_ROUTES = {
    compass: "/",
    siteGuide: "/site-guide/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    meetSean: "/meet-sean-mansfield/",
    products: "/products/",
    laws: "/laws/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    interactiveNarrative: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    frontier: "/explore/frontier/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/hearth/diagnostic/",
    book: "/nine-summits-of-love/",
    nineSummits: "/nine-summits/",
    aboutUnderdog: "/about-this-underdog/"
  };

  var ROUTE_LABELS = {
    compass: "Start at the Compass",
    siteGuide: "Open the Site Guide",
    coherenceDiagnostic: "Take the Coherence Diagnostic",
    meetSean: "Meet Sean Mansfield",
    products: "Open Products",
    laws: "Read the Laws",
    gauges: "Open Gauges",
    showroom: "Open the Showroom",
    hearth: "Return to Hearth",
    globeWindow: "Open the World Gate",
    interactiveNarrative: "Enter the Interactive Narrative",
    audralia: "Visit Audralia",
    frontier: "Explore Frontier",
    characters: "Meet the Characters",
    controlRoom: "Open the Control Room",
    book: "Open The Nine Summits of Love",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "About This Underdog"
  };

  var POSTURES = [
    "arrival",
    "skeptic",
    "orientation",
    "proof",
    "diagnostic",
    "sean",
    "products",
    "book",
    "world",
    "hearth",
    "audralia",
    "frontier",
    "characters",
    "futureProfile",
    "mirrorMe",
    "handoff"
  ];

  var PHASES = [
    "receive",
    "ground",
    "fork",
    "clarify",
    "reflect",
    "reveal",
    "prove",
    "personalize",
    "invite",
    "deepen",
    "route",
    "handoff",
    "return",
    "reset",
    "close",
    "continue"
  ];

  var ORGANS = [
    "arrival",
    "firstFork",
    "skeptic",
    "orientation",
    "compass",
    "proof",
    "diagnostic",
    "sean",
    "products",
    "book",
    "worldGate",
    "hearth",
    "audralia",
    "frontier",
    "characters",
    "futureProfile",
    "mirrorMe",
    "routeHandoff",
    "return",
    "restart"
  ];

  var PATHS = ["website", "skeptic", "diagnostic", "world"];

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    initialized: false,
    busy: false,
    runToken: 0,

    currentNode: "intro",
    previousNode: null,
    currentOrgan: "arrival",
    currentPosture: "arrival",
    currentPhase: "receive",
    currentPath: null,
    currentPathDepth: 0,

    stateIndex: 0,
    cycleStep: 0,
    curiosityLevel: 1,
    skepticismLevel: 0,
    routePressure: 0,

    pathDepth: {
      website: 0,
      skeptic: 0,
      diagnostic: 0,
      world: 0
    },

    brain: {
      visitorPosture: "arrival",
      movement: "start",
      loopCount: 0,
      progressCount: 0,
      digressionCount: 0,
      lostSignal: false,
      routeReadiness: 0,
      inferredConclusion: "arriving at the house",
      recenterAvailable: false,
      lastPath: null,
      lastTarget: null,
      lastVisitorLabel: "",
      lastQuestionKey: "",
      pathTrail: [],
      conclusionTrail: []
    },

    lastSuggestedRoutes: [],
    acceptedRoute: null,
    history: []
  };

  var els = {};
  var config = {};

  function option(label, target, type, meta) {
    var item = {
      label: label,
      target: target,
      type: type || "conversation"
    };
    var key;

    if (meta) {
      for (key in meta) {
        if (Object.prototype.hasOwnProperty.call(meta, key)) {
          item[key] = meta[key];
        }
      }
    }

    return item;
  }

  function routeOption(label, target, meta) {
    return option(label, target, "route", meta);
  }

  function query(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function wait(ms) {
    return new Promise(function resolveWait(resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function indexOfValue(list, value) {
    var i;

    for (i = 0; i < list.length; i += 1) {
      if (list[i] === value) return i;
    }

    return 0;
  }

  function computeStateIndex(posture, phase) {
    var postureIndex = indexOfValue(POSTURES, posture);
    var phaseIndex = indexOfValue(PHASES, phase);

    return postureIndex * 16 + phaseIndex;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wordCount(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function trimTrail(list) {
    while (list.length > MAX_TRAIL) {
      list.shift();
    }
  }

  function getTypingDelay(text, index) {
    var words = wordCount(text);
    var delay = PACING.typingBaseMs + words * PACING.typingWordMs;

    if (index === 0) {
      delay += 220;
    }

    return clamp(delay, PACING.typingMinMs, PACING.typingMaxMs);
  }

  function getReadDelay(text) {
    var words = wordCount(text);
    var delay = PACING.readBaseMs + words * PACING.readWordMs;

    return clamp(delay, PACING.readMinMs, PACING.readMaxMs);
  }

  function readConfig() {
    var script = query("#jeevesConversationConfig");

    if (!script) {
      return {
        initialNode: "intro",
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        initialNode: "intro",
        routes: {}
      };
    }
  }

  function mergeRoutes() {
    var merged = {};
    var key;

    for (key in DEFAULT_ROUTES) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_ROUTES, key)) {
        merged[key] = DEFAULT_ROUTES[key];
      }
    }

    if (config.routes) {
      for (key in config.routes) {
        if (Object.prototype.hasOwnProperty.call(config.routes, key)) {
          merged[key] = config.routes[key];
        }
      }
    }

    return merged;
  }

  function getRouteLabel(id) {
    return ROUTE_LABELS[id] || "Open Path";
  }

  function getHandoff(id) {
    var routes = mergeRoutes();

    return {
      id: id,
      label: getRouteLabel(id),
      href: routes[id] || "#"
    };
  }

  var CHAMBER = {
    website: [
      {
        phase: "ground",
        beats: [
          "The website is the public side of the house.",
          "It gives you doors before it gives you depth."
        ],
        options: [
          option("Orient me first.", "compassPath", "topic", { signal: "lost" }),
          option("Show me proof.", "proofPath", "topic", { signal: "skeptic" }),
          option("Show me practical use.", "productsPath", "topic", { signal: "practical" }),
          option("Who is behind this?", "seanPath", "topic", { signal: "human" })
        ],
        handoffs: ["compass", "siteGuide"]
      },
      {
        phase: "reflect",
        beats: [
          "You do not need the whole map yet.",
          "You need the door that matches what you carried in."
        ],
        question: "What did you bring to the doorway first: confusion, doubt, usefulness, or curiosity?",
        questionOptions: [
          option("Confusion.", "compassPath", "topic", { signal: "lost" }),
          option("Doubt.", "proofPath", "topic", { signal: "skeptic" }),
          option("Usefulness.", "productsPath", "topic", { signal: "practical" }),
          option("Curiosity.", "worldPath", "conversation", { signal: "curious" })
        ],
        options: [
          option("Keep guiding me through the website.", "websitePath", "topic"),
          option("Show me the world side instead.", "worldPath", "conversation"),
          routeOption("Take me to the Compass.", "handoffCompass")
        ],
        handoffs: ["compass", "coherenceDiagnostic", "products"]
      },
      {
        phase: "reveal",
        beats: [
          "The public house has five useful doors.",
          "Compass orients you. Laws test the structure. Products make it usable. The Diagnostic reflects the visitor. Meet Sean anchors the voice."
        ],
        options: [
          routeOption("Orientation: Compass.", "handoffCompass"),
          routeOption("Proof: Laws.", "handoffLaws"),
          routeOption("Use: Products.", "handoffProducts"),
          routeOption("Self: Diagnostic.", "handoffDiagnostic"),
          routeOption("Voice: Meet Sean.", "handoffSean")
        ],
        handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed near the public doors long enough.",
          "Choose the room now: orientation, proof, use, self-reflection, or the voice behind the house."
        ],
        options: [
          routeOption("Orientation: Compass.", "handoffCompass"),
          routeOption("Proof: Laws.", "handoffLaws"),
          routeOption("Use: Products.", "handoffProducts"),
          routeOption("Self: Diagnostic.", "handoffDiagnostic"),
          routeOption("Voice: Meet Sean.", "handoffSean")
        ],
        handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
      }
    ],

    skeptic: [
      {
        phase: "clarify",
        beats: [
          "Good. Skepticism belongs at the front door.",
          "The house should not be trusted just because it sounds interesting."
        ],
        options: [
          option("Then show me what holds it up.", "proofPath", "topic", { signal: "skeptic" }),
          option("Show me the Diagnostic.", "diagnosticPath", "topic", { signal: "self" }),
          option("Show me practical use.", "productsPath", "topic", { signal: "practical" }),
          option("I’ll try the world side anyway.", "worldPath", "conversation", { signal: "curious" })
        ],
        handoffs: ["laws", "coherenceDiagnostic"]
      },
      {
        phase: "reflect",
        beats: [
          "You are right to test it before you enter deeper.",
          "If the story side has no floor, it should not carry weight."
        ],
        question: "What are you testing first: the claims, the structure, or the person behind it?",
        questionOptions: [
          routeOption("The claims: Laws.", "handoffLaws", { signal: "skeptic" }),
          routeOption("The structure: Gauges.", "handoffGauges", { signal: "skeptic" }),
          routeOption("The person: Meet Sean.", "handoffSean", { signal: "human" })
        ],
        options: [
          option("Keep me in proof.", "proofPath", "topic", { signal: "skeptic" }),
          option("Test me instead.", "diagnosticPath", "topic", { signal: "self" }),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      },
      {
        phase: "prove",
        beats: [
          "The proof path has three doors.",
          "Laws show what can be claimed. Gauges show whether the structure is holding. The Diagnostic tests the visitor’s own posture."
        ],
        options: [
          routeOption("Public proof: Laws.", "handoffLaws"),
          routeOption("Technical status: Gauges.", "handoffGauges"),
          routeOption("Personal test: Diagnostic.", "handoffDiagnostic"),
          option("Now show me the world side.", "worldPath", "conversation", { signal: "curious" })
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed in the proof room.",
          "Choose the test now before I take you farther."
        ],
        options: [
          routeOption("Read the Laws.", "handoffLaws"),
          routeOption("Open Gauges.", "handoffGauges"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Return to the doorway.", "returnFork", "back")
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      }
    ],

    diagnostic: [
      {
        phase: "personalize",
        beats: [
          "The Diagnostic is the mirror path.",
          "It does not begin by naming you."
        ],
        options: [
          option("Then what does it do?", "diagnosticPath", "topic", { signal: "self" }),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Show me proof instead.", "proofPath", "topic", { signal: "skeptic" }),
          option("Back to the doorway.", "returnFork", "back")
        ],
        handoffs: ["coherenceDiagnostic"]
      },
      {
        phase: "reflect",
        beats: [
          "It starts with how you think you move under pressure.",
          "Pressure usually reveals the first truth before preference does."
        ],
        question: "When pressure hits, do you want to know what you claim, what you choose, or what the gap between them says?",
        questionOptions: [
          option("What I claim.", "diagnosticPath", "topic", { signal: "self" }),
          option("What I choose.", "diagnosticPath", "topic", { signal: "self" }),
          option("What the gap says.", "futureProfilePath", "topic", { signal: "profile" })
        ],
        options: [
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Show me the future profile path.", "futureProfilePath", "topic"),
          option("Show me Laws instead.", "proofPath", "topic", { signal: "skeptic" })
        ],
        handoffs: ["coherenceDiagnostic", "laws"]
      },
      {
        phase: "reveal",
        beats: [
          "The mirror compares claimed coherence against scenario choices.",
          "That is where the visitor begins to see the distance between identity and behavior."
        ],
        options: [
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Explain the future profile.", "futureProfilePath", "topic"),
          option("Explain Mirror Me.", "mirrorMePath", "topic"),
          routeOption("Read the Laws first.", "handoffLaws")
        ],
        handoffs: ["coherenceDiagnostic", "laws"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed with the mirror long enough.",
          "Choose whether to test yourself now, follow the profile path, or return to proof."
        ],
        options: [
          routeOption("Test myself: Diagnostic.", "handoffDiagnostic"),
          option("Profile path: Future Profile.", "futureProfilePath", "topic"),
          option("Reflection path: Mirror Me.", "mirrorMePath", "topic"),
          routeOption("Proof path: Laws.", "handoffLaws")
        ],
        handoffs: ["coherenceDiagnostic", "laws", "interactiveNarrative"]
      }
    ],

    world: [
      {
        phase: "reveal",
        beats: [
          "The world side is where the house stops being a map.",
          "The rooms begin answering back."
        ],
        options: [
          routeOption("Enter the Interactive Narrative.", "handoffWorld"),
          option("Take me to Hearth.", "hearthPath", "topic", { signal: "house" }),
          option("Let me feel the people.", "charactersPath", "topic", { signal: "characters" }),
          option("Show me Mirror Me.", "mirrorMePath", "topic", { signal: "mirror" })
        ],
        handoffs: ["interactiveNarrative", "hearth"]
      },
      {
        phase: "reflect",
        beats: [
          "You are not entering lore.",
          "You are deciding which part of the house should notice you first."
        ],
        question: "Do you want the house, the people, or the distance beyond it?",
        questionOptions: [
          option("The house.", "hearthPath", "topic", { signal: "house" }),
          option("The people.", "charactersPath", "topic", { signal: "characters" }),
          option("The distance beyond it.", "audraliaPath", "topic", { signal: "world" })
        ],
        options: [
          routeOption("Open the world gate.", "handoffWorld"),
          option("Show me Mirror Me.", "mirrorMePath", "topic"),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["characters", "hearth", "audralia", "interactiveNarrative"]
      },
      {
        phase: "deepen",
        beats: [
          "Hearth is closest to where I’m speaking from. Audralia is farther out.",
          "The characters make the house feel occupied. Mirror Me is the room that looks back."
        ],
        options: [
          routeOption("Gate: Interactive Narrative.", "handoffWorld"),
          routeOption("House: Hearth.", "handoffHearth"),
          routeOption("Outward world: Audralia.", "handoffAudralia"),
          routeOption("People: Characters.", "handoffCharacters"),
          option("Reflection: Mirror Me.", "mirrorMePath", "topic")
        ],
        handoffs: ["interactiveNarrative", "hearth", "audralia", "characters"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed with the living side of the house.",
          "Choose how you want it to open: gate, house, distance, people, or reflection."
        ],
        options: [
          routeOption("Gate: Interactive Narrative.", "handoffWorld"),
          routeOption("House: Hearth.", "handoffHearth"),
          routeOption("Distance: Audralia.", "handoffAudralia"),
          routeOption("People: Characters.", "handoffCharacters"),
          option("Reflection: Mirror Me.", "mirrorMePath", "topic")
        ],
        handoffs: ["interactiveNarrative", "hearth", "audralia", "characters"]
      }
    ]
  };

  var NODE = {
    intro: {
      organ: "arrival",
      posture: "arrival",
      phase: "receive",
      beats: [
        "Hello. I’m Jeeves.",
        "I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole house at once.",
        "I can guide you through the website, take you toward the world behind it, or ask you one question first."
      ],
      options: [
        option("Guide me through the website.", "websitePath", "conversation", { signal: "orientation" }),
        option("Take me toward the world behind it.", "worldPath", "conversation", { signal: "curious" }),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration", { signal: "skeptic" }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost" }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question" })
      ],
      handoffs: []
    },

    askFirst: {
      organ: "firstFork",
      posture: "arrival",
      phase: "invite",
      forceQuestion: true,
      beats: [
        "Then I’ll ask plainly.",
        "What brought you to the doorway first?"
      ],
      options: [
        option("Curiosity.", "worldPath", "conversation", { signal: "curious" }),
        option("Skepticism.", "skepticPlain", "calibration", { signal: "skeptic" }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self" }),
        option("Practical use.", "productsPath", "topic", { signal: "practical" }),
        option("The story.", "worldPath", "conversation", { signal: "curious" })
      ],
      handoffs: []
    },

    websitePath: {
      organ: "firstFork",
      posture: "orientation",
      phase: "fork",
      pathKey: "website"
    },

    skepticPlain: {
      organ: "skeptic",
      posture: "skeptic",
      phase: "clarify",
      pathKey: "skeptic",
      skepticism: 2
    },

    proofPath: {
      organ: "proof",
      posture: "proof",
      phase: "prove",
      pathKey: "skeptic",
      skepticism: 1
    },

    diagnosticPath: {
      organ: "diagnostic",
      posture: "diagnostic",
      phase: "personalize",
      pathKey: "diagnostic"
    },

    worldPath: {
      organ: "worldGate",
      posture: "world",
      phase: "fork",
      pathKey: "world"
    },

    worldGatePath: {
      organ: "worldGate",
      posture: "world",
      phase: "route",
      pathKey: "world"
    },

    compassPath: {
      organ: "compass",
      posture: "orientation",
      phase: "route",
      beats: [
        "The Compass is the cleanest first door.",
        "It brings the house back into order."
      ],
      options: [
        routeOption("Take me to the Compass.", "handoffCompass"),
        option("Explain the Diagnostic first.", "diagnosticPath", "topic", { signal: "self" }),
        option("Explain proof first.", "proofPath", "topic", { signal: "skeptic" }),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["compass"]
    },

    whereToStart: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      beats: [
        "Then I’ll re-center the doorway.",
        "Confusion wants the Compass. Doubt wants Laws. Self-reflection wants the Diagnostic. Usefulness wants Products."
      ],
      options: [
        option("Orientation.", "websitePath", "topic", { signal: "orientation" }),
        option("Proof.", "proofPath", "topic", { signal: "skeptic" }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self" }),
        option("Practical use.", "productsPath", "topic", { signal: "practical" }),
        option("The world behind it.", "worldPath", "conversation", { signal: "curious" })
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
    },

    seanPath: {
      organ: "sean",
      posture: "sean",
      phase: "reflect",
      beats: [
        "Sean is the pressure source behind this side of the bridge.",
        "The house needed a voice because the pressure kept turning into rooms."
      ],
      question: "Do you want the person, the pressure, or the voice?",
      questionOptions: [
        routeOption("The person: Meet Sean.", "handoffSean"),
        option("The pressure: This Underdog.", "underdogPath", "topic"),
        option("The voice: book path.", "bookPath", "topic")
      ],
      options: [
        routeOption("Meet Sean.", "handoffSean"),
        option("What is This Underdog?", "underdogPath", "topic"),
        option("Show me the practical doors.", "productsPath", "topic"),
        option("Back to website path.", "websitePath", "back")
      ],
      handoffs: ["meetSean", "aboutUnderdog"]
    },

    underdogPath: {
      organ: "sean",
      posture: "sean",
      phase: "deepen",
      beats: [
        "This Underdog is where pressure learned to speak without pretending it was polished.",
        "It keeps the house human."
      ],
      options: [
        routeOption("Open About This Underdog.", "handoffUnderdog"),
        option("Meet Sean instead.", "seanPath", "topic"),
        option("Show me the book path.", "bookPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["aboutUnderdog", "meetSean"]
    },

    productsPath: {
      organ: "products",
      posture: "products",
      phase: "route",
      beats: [
        "Products are where the house has to become useful.",
        "No more atmosphere there. Something has to work."
      ],
      question: "Do you want something practical, personal, or book-shaped?",
      questionOptions: [
        routeOption("Practical: Products.", "handoffProducts"),
        option("Personal: Diagnostic.", "diagnosticPath", "topic"),
        option("Book-shaped: Nine Summits.", "bookPath", "topic")
      ],
      options: [
        routeOption("Open Products.", "handoffProducts"),
        option("Show me the book path.", "bookPath", "topic"),
        option("Tell me who Sean is.", "seanPath", "topic"),
        option("Back to website guide.", "websitePath", "back")
      ],
      handoffs: ["products", "book", "nineSummits"]
    },

    bookPath: {
      organ: "book",
      posture: "book",
      phase: "deepen",
      beats: [
        "The Nine Summits path carries the house as a human development route.",
        "That door is less about navigation and more about what the visitor is becoming."
      ],
      options: [
        routeOption("Open the book.", "handoffBook"),
        routeOption("Open Nine Summits.", "handoffNineSummits"),
        option("Tell me about Sean.", "seanPath", "topic"),
        option("Back to Products.", "productsPath", "back")
      ],
      handoffs: ["book", "nineSummits"]
    },

    hearthPath: {
      organ: "hearth",
      posture: "hearth",
      phase: "ground",
      beats: [
        "Hearth is the room closest to where I’m speaking from.",
        "If the world feels too wide, start here."
      ],
      question: "Do you want the room, the gate, or the world beyond the room?",
      questionOptions: [
        routeOption("The room: Hearth.", "handoffHearth"),
        routeOption("The gate: Interactive Narrative.", "handoffWorld"),
        option("The world beyond it: Audralia.", "audraliaPath", "topic")
      ],
      options: [
        routeOption("Return to Hearth.", "handoffHearth"),
        option("Enter the world gate.", "worldGatePath", "route"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Meet the Characters.", "charactersPath", "topic")
      ],
      handoffs: ["hearth", "interactiveNarrative", "audralia"]
    },

    audraliaPath: {
      organ: "audralia",
      posture: "audralia",
      phase: "deepen",
      beats: [
        "Audralia is farther out.",
        "You feel the estate widen there."
      ],
      options: [
        routeOption("Visit Audralia.", "handoffAudralia"),
        option("Explore Frontier.", "frontierPath", "topic"),
        option("Return to Hearth.", "hearthPath", "back"),
        option("Back to the world gate.", "worldGatePath", "back")
      ],
      handoffs: ["audralia", "frontier", "hearth"]
    },

    frontierPath: {
      organ: "frontier",
      posture: "frontier",
      phase: "deepen",
      beats: [
        "Frontier is the outward edge.",
        "It is not where the house begins. It is where the house starts pointing beyond itself."
      ],
      options: [
        routeOption("Explore Frontier.", "handoffFrontier"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Return to the world gate.", "worldGatePath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["frontier", "audralia", "interactiveNarrative"]
    },

    charactersPath: {
      organ: "characters",
      posture: "characters",
      phase: "personalize",
      beats: [
        "The characters are not waiting on a page.",
        "Some of them are already moving behind the doors."
      ],
      question: "Do you want to meet them as people, follow them into the story, or keep them in the distance for now?",
      questionOptions: [
        routeOption("Meet them: Characters.", "handoffCharacters"),
        routeOption("Follow them: Interactive Narrative.", "handoffWorld"),
        option("Keep distance: return to world gate.", "worldGatePath", "back")
      ],
      options: [
        routeOption("Meet the Characters.", "handoffCharacters"),
        option("Explain Mirror Me.", "mirrorMePath", "topic"),
        option("Enter the Interactive Narrative.", "worldGatePath", "route"),
        option("Back to world path.", "worldPath", "back")
      ],
      handoffs: ["characters", "interactiveNarrative"]
    },

    futureProfilePath: {
      organ: "futureProfile",
      posture: "futureProfile",
      phase: "reveal",
      beats: [
        "The future profile is what happens when the mirror starts remembering the visitor.",
        "Not permanently here. Not yet. But the room is being built for that kind of return."
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic"),
        option("Explain Mirror Me.", "mirrorMePath", "topic"),
        option("Enter the world path.", "worldGatePath", "route"),
        option("Back to the doorway.", "returnFork", "back")
      ],
      handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
    },

    mirrorMePath: {
      organ: "mirrorMe",
      posture: "mirrorMe",
      phase: "reveal",
      beats: [
        "Mirror Me is the room that looks back.",
        "Not as a clone. As a challenge."
      ],
      question: "Do you want the mirror as a test, a story device, or a future profile?",
      questionOptions: [
        option("A test.", "diagnosticPath", "topic"),
        routeOption("A story device.", "handoffWorld"),
        option("A future profile.", "futureProfilePath", "topic")
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic"),
        option("Meet the Characters.", "charactersPath", "topic"),
        option("Enter the world gate.", "worldGatePath", "route"),
        option("Back to future profile.", "futureProfilePath", "back")
      ],
      handoffs: ["coherenceDiagnostic", "characters", "interactiveNarrative"]
    },

    recenterNode: {
      organ: "return",
      posture: "orientation",
      phase: "return",
      recenterBrain: true,
      beats: [
        "I may have taken you too deep.",
        "Let me bring the house back to one doorway."
      ],
      options: [
        routeOption("Give me the Compass.", "handoffCompass"),
        option("Show me proof.", "proofPath", "topic", { signal: "skeptic" }),
        option("Show me the mirror.", "diagnosticPath", "topic", { signal: "self" }),
        option("Show me the world.", "worldPath", "conversation", { signal: "curious" })
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "interactiveNarrative"]
    },

    loopRecovery: {
      organ: "return",
      posture: "orientation",
      phase: "return",
      beats: [
        "You keep circling this room.",
        "That usually means you are not looking for more explanation. You are deciding whether to trust the door."
      ],
      options: [
        routeOption("Test it with Laws.", "handoffLaws"),
        routeOption("Take the Diagnostic.", "handoffDiagnostic"),
        routeOption("Enter the world anyway.", "handoffWorld"),
        option("Re-center me.", "recenterNode", "control", { signal: "lost" })
      ],
      handoffs: ["laws", "coherenceDiagnostic", "interactiveNarrative"]
    },

    cleanDoor: {
      dynamic: true
    },

    returnFork: {
      organ: "return",
      posture: "arrival",
      phase: "return",
      beats: [
        "Then we return to the clean fork.",
        "Website first, or world behind it."
      ],
      options: [
        option("Guide me through the website.", "websitePath", "conversation", { signal: "orientation" }),
        option("Take me toward the world behind it.", "worldPath", "conversation", { signal: "curious" }),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration", { signal: "skeptic" }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost" }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question" })
      ],
      handoffs: []
    },

    restartFork: {
      organ: "restart",
      posture: "arrival",
      phase: "reset",
      resetAll: true,
      beats: [
        "Clean reset.",
        "You are back at the doorway.",
        "Website, or the world behind it?"
      ],
      options: [
        option("Guide me through the website.", "websitePath", "conversation", { signal: "orientation" }),
        option("Take me toward the world behind it.", "worldPath", "conversation", { signal: "curious" }),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration", { signal: "skeptic" }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost" }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question" })
      ],
      handoffs: []
    }
  };

  var HANDOFF_NODE = {
    handoffCompass: {
      posture: "handoff",
      targetRoute: "compass",
      beats: [
        "Open the Compass.",
        "That is the cleanest orientation point."
      ],
      options: [
        option("Show me another website path.", "websitePath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffDiagnostic: {
      posture: "handoff",
      targetRoute: "coherenceDiagnostic",
      beats: [
        "Open the Diagnostic.",
        "That is the cleanest mirror path."
      ],
      options: [
        option("Show me proof instead.", "proofPath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffLaws: {
      posture: "handoff",
      targetRoute: "laws",
      beats: [
        "Open the Laws.",
        "That is where the house makes its proof posture visible."
      ],
      options: [
        routeOption("Open Gauges too.", "handoffGauges"),
        option("Show me the Diagnostic.", "diagnosticPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffGauges: {
      posture: "handoff",
      targetRoute: "gauges",
      beats: [
        "Open Gauges.",
        "That is the more technical status path."
      ],
      options: [
        routeOption("Read the Laws too.", "handoffLaws"),
        option("Back to proof path.", "proofPath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffProducts: {
      posture: "handoff",
      targetRoute: "products",
      beats: [
        "Open Products.",
        "That is where the house becomes usable."
      ],
      options: [
        option("Show me the book path.", "bookPath", "topic"),
        option("Tell me who Sean is.", "seanPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffSean: {
      posture: "handoff",
      targetRoute: "meetSean",
      beats: [
        "Open Meet Sean.",
        "That is the cleanest path to the human voice behind the house."
      ],
      options: [
        option("Show me This Underdog too.", "underdogPath", "topic"),
        option("Show me Products.", "productsPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffUnderdog: {
      posture: "handoff",
      targetRoute: "aboutUnderdog",
      beats: [
        "Open About This Underdog.",
        "That path carries the comedy, pressure, and voice side of the house."
      ],
      options: [
        option("Meet Sean instead.", "seanPath", "topic"),
        option("Show me the book path.", "bookPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffBook: {
      posture: "handoff",
      targetRoute: "book",
      beats: [
        "Open The Nine Summits of Love.",
        "That is the book path."
      ],
      options: [
        routeOption("Open Nine Summits too.", "handoffNineSummits"),
        option("Back to Products.", "productsPath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffNineSummits: {
      posture: "handoff",
      targetRoute: "nineSummits",
      beats: [
        "Open Nine Summits.",
        "That is the wider development path around the book and seminar system."
      ],
      options: [
        routeOption("Open the book too.", "handoffBook"),
        option("Back to Products.", "productsPath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffCharacters: {
      posture: "handoff",
      targetRoute: "characters",
      beats: [
        "Open Characters.",
        "That is where the house becomes occupied."
      ],
      options: [
        routeOption("Enter the Interactive Narrative too.", "handoffWorld"),
        option("Explain Mirror Me.", "mirrorMePath", "topic"),
        option("Back to world path.", "worldPath", "back")
      ]
    },

    handoffWorld: {
      posture: "handoff",
      targetRoute: "interactiveNarrative",
      beats: [
        "Enter the Interactive Narrative.",
        "That is the right door if you want the house to open as a world."
      ],
      options: [
        option("Visit Hearth first.", "hearthPath", "topic"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffHearth: {
      posture: "handoff",
      targetRoute: "hearth",
      beats: [
        "Return to Hearth.",
        "That is the room closest to where I’m speaking from."
      ],
      options: [
        option("Enter the Interactive Narrative.", "worldGatePath", "route"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffAudralia: {
      posture: "handoff",
      targetRoute: "audralia",
      beats: [
        "Visit Audralia.",
        "That is where the estate begins widening outward."
      ],
      options: [
        option("Explore Frontier.", "frontierPath", "topic"),
        option("Return to Hearth.", "hearthPath", "back"),
        option("Back to the world gate.", "worldGatePath", "back")
      ]
    },

    handoffFrontier: {
      posture: "handoff",
      targetRoute: "frontier",
      beats: [
        "Explore Frontier.",
        "That is the outward-facing discovery path."
      ],
      options: [
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Back to the world gate.", "worldGatePath", "back"),
        option("Return to the doorway.", "returnFork", "back")
      ]
    }
  };

  function resetAllState() {
    PATHS.forEach(function eachPath(path) {
      state.pathDepth[path] = 0;
    });

    state.brain.visitorPosture = "arrival";
    state.brain.movement = "start";
    state.brain.loopCount = 0;
    state.brain.progressCount = 0;
    state.brain.digressionCount = 0;
    state.brain.lostSignal = false;
    state.brain.routeReadiness = 0;
    state.brain.inferredConclusion = "arriving at the house";
    state.brain.recenterAvailable = false;
    state.brain.lastPath = null;
    state.brain.lastTarget = null;
    state.brain.lastVisitorLabel = "";
    state.brain.lastQuestionKey = "";
    state.brain.pathTrail = [];
    state.brain.conclusionTrail = [];

    state.curiosityLevel = 1;
    state.skepticismLevel = 0;
    state.routePressure = 0;
  }

  function normalizeNode(id) {
    if (id === "arrival") return "intro";
    return id || "intro";
  }

  function getPathDepth(pathKey) {
    if (!pathKey || PATHS.indexOf(pathKey) === -1) return 0;
    return state.pathDepth[pathKey] || 0;
  }

  function advancePathDepth(pathKey) {
    if (!pathKey || PATHS.indexOf(pathKey) === -1) return 0;

    state.pathDepth[pathKey] = clamp(
      (state.pathDepth[pathKey] || 0) + 1,
      1,
      MAX_PATH_DEPTH
    );

    return state.pathDepth[pathKey];
  }

  function getChamberExpression(pathKey, depth) {
    var expressions = CHAMBER[pathKey] || [];
    var index = clamp((depth || 1) - 1, 0, expressions.length - 1);

    return expressions[index] || null;
  }

  function mergeNode(base, expression, pathKey, depth) {
    var merged = {};
    var key;

    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) {
        merged[key] = base[key];
      }
    }

    if (expression) {
      for (key in expression) {
        if (Object.prototype.hasOwnProperty.call(expression, key)) {
          merged[key] = expression[key];
        }
      }
    }

    merged.pathKey = pathKey || base.pathKey || null;
    merged.pathDepth = depth || 0;

    return merged;
  }

  function getCleanDoorNode() {
    var path = state.currentPath || state.brain.lastPath;
    var conclusion = state.brain.inferredConclusion || "choosing the next door";

    if (path === "skeptic") {
      return {
        organ: "proof",
        posture: "proof",
        phase: "route",
        beats: [
          "The cleanest door is proof.",
          "It sounds like you are " + conclusion + "."
        ],
        options: [
          routeOption("Read the Laws.", "handoffLaws"),
          routeOption("Open Gauges.", "handoffGauges"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      };
    }

    if (path === "diagnostic") {
      return {
        organ: "diagnostic",
        posture: "diagnostic",
        phase: "route",
        beats: [
          "The cleanest door is the mirror.",
          "It sounds like you are " + conclusion + "."
        ],
        options: [
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Show me Mirror Me.", "mirrorMePath", "topic"),
          routeOption("Read the Laws first.", "handoffLaws"),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["coherenceDiagnostic", "laws"]
      };
    }

    if (path === "world") {
      return {
        organ: "worldGate",
        posture: "world",
        phase: "route",
        beats: [
          "The cleanest door is the world gate.",
          "It sounds like you are ready for the house to stop explaining and start opening."
        ],
        options: [
          routeOption("Enter the Interactive Narrative.", "handoffWorld"),
          routeOption("Return to Hearth.", "handoffHearth"),
          routeOption("Meet the Characters.", "handoffCharacters"),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["interactiveNarrative", "hearth", "characters"]
      };
    }

    return {
      organ: "compass",
      posture: "orientation",
      phase: "route",
      beats: [
        "The cleanest door is orientation.",
        "The house should not make you chase it."
      ],
      options: [
        routeOption("Start at the Compass.", "handoffCompass"),
        routeOption("Take the Diagnostic.", "handoffDiagnostic"),
        routeOption("Read the Laws.", "handoffLaws"),
        option("Show me the world instead.", "worldPath", "conversation", { signal: "curious" })
      ],
      handoffs: ["compass", "coherenceDiagnostic", "laws"]
    };
  }

  function getNode(id, shouldAdvanceDepth) {
    var nodeId = normalizeNode(id);
    var base;
    var depth;
    var expression;

    if (nodeId === "cleanDoor") {
      return getCleanDoorNode();
    }

    if (NODE[nodeId]) {
      base = NODE[nodeId];

      if (base.resetAll) {
        resetAllState();
      }

      if (base.recenterBrain) {
        state.brain.lostSignal = false;
        state.brain.recenterAvailable = false;
        state.brain.digressionCount = 0;
        state.brain.loopCount = 0;
      }

      if (base.pathKey) {
        depth = shouldAdvanceDepth === false
          ? Math.max(getPathDepth(base.pathKey), 1)
          : advancePathDepth(base.pathKey);

        expression = getChamberExpression(base.pathKey, depth);

        return mergeNode(base, expression, base.pathKey, depth);
      }

      return base;
    }

    if (HANDOFF_NODE[nodeId]) {
      return {
        organ: "routeHandoff",
        posture: HANDOFF_NODE[nodeId].posture || "handoff",
        phase: "handoff",
        beats: HANDOFF_NODE[nodeId].beats,
        options: HANDOFF_NODE[nodeId].options,
        handoffs: [HANDOFF_NODE[nodeId].targetRoute],
        pathKey: null,
        pathDepth: 0
      };
    }

    return NODE.intro;
  }

  function inferConclusion(path, depth, movement, signal) {
    if (signal === "lost") {
      return "trying to get re-centered";
    }

    if (path === "skeptic") {
      if (depth >= 4) return "ready to choose a proof door";
      if (depth >= 3) return "testing whether the house has a floor";
      if (movement === "loop") return "circling trust before entry";
      return "testing the claims before entering";
    }

    if (path === "diagnostic") {
      if (depth >= 4) return "ready to choose the mirror path";
      if (depth >= 3) return "looking for the gap between identity and behavior";
      return "checking what pressure reveals";
    }

    if (path === "world") {
      if (depth >= 4) return "ready to choose a world entry";
      if (depth >= 3) return "deciding which living room should open first";
      return "looking for the world behind the website";
    }

    if (path === "website") {
      if (depth >= 4) return "ready to choose a public door";
      if (depth >= 3) return "sorting the public estate into useful rooms";
      return "trying to orient inside the house";
    }

    if (signal === "practical") return "looking for use";
    if (signal === "human") return "looking for the voice behind the house";
    if (signal === "curious") return "following curiosity";
    if (signal === "self") return "looking for reflection";

    return "choosing the next door";
  }

  function inferPosture(signal, path, movement) {
    if (signal === "lost") return "lost";
    if (signal === "skeptic" || path === "skeptic") return "skeptical";
    if (signal === "self" || path === "diagnostic") return "self-reflective";
    if (signal === "curious" || path === "world") return "curious";
    if (signal === "practical") return "practical";
    if (signal === "human") return "human-context";
    if (movement === "digress") return "digressing";
    if (movement === "loop") return "looping";
    return "oriented";
  }

  function updateBrain(choice, node) {
    var brain = state.brain;
    var path = node.pathKey || null;
    var depth = node.pathDepth || 0;
    var signal = choice && choice.signal ? choice.signal : null;
    var movement = "neutral";
    var conclusion;

    if (path) {
      if (!brain.lastPath) {
        movement = "progress";
      } else if (brain.lastPath === path) {
        movement = depth >= MAX_PATH_DEPTH ? "loop" : "progress";
      } else {
        movement = "digress";
      }

      brain.pathTrail.push(path);
      trimTrail(brain.pathTrail);
      brain.lastPath = path;
    } else if (node.phase === "handoff") {
      movement = "route";
    } else if (signal === "lost") {
      movement = "recenter";
    }

    if (movement === "progress") {
      brain.progressCount += 1;
    }

    if (movement === "loop") {
      brain.loopCount += 1;
    }

    if (movement === "digress") {
      brain.digressionCount += 1;
    }

    if (movement === "route") {
      brain.routeReadiness = Math.max(0, brain.routeReadiness - 1);
    }

    if (depth >= 3) {
      brain.routeReadiness = Math.min(10, brain.routeReadiness + 1);
    }

    if (depth >= 4) {
      brain.routeReadiness = Math.min(10, brain.routeReadiness + 2);
    }

    if (signal === "lost" || brain.digressionCount >= 3 || brain.loopCount >= 2) {
      brain.lostSignal = true;
    }

    if (brain.lostSignal || brain.routeReadiness >= 3 || depth >= 4) {
      brain.recenterAvailable = true;
    }

    conclusion = inferConclusion(path, depth, movement, signal);

    brain.visitorPosture = inferPosture(signal, path, movement);
    brain.movement = movement;
    brain.inferredConclusion = conclusion;
    brain.lastTarget = state.currentNode;
    brain.lastVisitorLabel = choice && choice.label ? choice.label : brain.lastVisitorLabel;
    brain.conclusionTrail.push(conclusion);
    trimTrail(brain.conclusionTrail);
  }

  function collectElements() {
    els.thread = query("#jeevesThread");
    els.typing = query("[data-jeeves-typing]");
    els.promptGrid = query("[data-jeeves-prompt-grid]");
    els.handoffDock = query("[data-jeeves-handoff-dock]");
    els.handoffGrid = query("[data-jeeves-handoff-grid]");
    els.status = query("[data-jeeves-status]");
    els.statusText = query("[data-jeeves-status-text]");
    els.messageTemplate = query("#jeevesMessageTemplate");
    els.optionTemplate = query("#jeevesOptionTemplate");
    els.routeOptionTemplate = query("#jeevesRouteOptionTemplate");
    els.restoreButton = query("[data-jeeves-action='restore']");
    els.minimized = query("[data-jeeves-minimized]");
  }

  function setStatus(value, text) {
    if (els.status) {
      els.status.setAttribute("data-jeeves-status", value);
    }

    if (els.statusText) {
      els.statusText.textContent = text || "";
    }
  }

  function setTyping(isTyping) {
    if (!els.typing) return;

    els.typing.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    els.typing.setAttribute("aria-hidden", isTyping ? "false" : "true");

    setStatus(
      isTyping ? "thinking" : "listening",
      isTyping ? "Jeeves is typing" : "House listening"
    );
  }

  function clearSeedMessage() {
    if (!els.thread) return;

    var seed = query("[data-seed-message='true']", els.thread);

    if (seed) {
      seed.remove();
    }
  }

  function clearElement(element) {
    if (!element) return;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function hideOptions() {
    clearElement(els.promptGrid);
    clearElement(els.handoffGrid);

    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
    }
  }

  function scrollThread() {
    if (!els.thread) return;

    try {
      els.thread.scrollTop = els.thread.scrollHeight;
    } catch (_error) {
      /* non-critical */
    }
  }

  function cloneTemplate(template, fallbackTag) {
    if (template && template.content && template.content.firstElementChild) {
      return template.content.firstElementChild.cloneNode(true);
    }

    return document.createElement(fallbackTag || "div");
  }

  function addMessage(origin, text, settings) {
    var message;
    var name;
    var paragraph;

    if (!els.thread || !text) return null;

    message = cloneTemplate(els.messageTemplate, "article");
    name = query(".jeeves-message-name", message);
    paragraph = query("p", message);

    message.classList.add("jeeves-message");
    message.setAttribute("data-message-origin", origin);

    if (settings && settings.emphasis) {
      message.setAttribute("data-message-emphasis", "true");
    }

    if (name) {
      if (origin === "visitor") {
        name.textContent = "Visitor";
      } else if (origin === "system") {
        name.textContent = "House";
      } else {
        name.textContent = "Jeeves";
      }
    }

    if (paragraph) {
      paragraph.textContent = text;
    } else {
      message.textContent = text;
    }

    els.thread.appendChild(message);
    scrollThread();

    return message;
  }

  function makeOptionButton(item) {
    var button = cloneTemplate(els.optionTemplate, "button");
    var label = query("span", button);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", item.type || "conversation");
    button.setAttribute("data-option-target", item.target || "");

    if (label) {
      label.textContent = item.label;
    } else {
      button.textContent = item.label;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption(item);
    });

    return button;
  }

  function makeRouteLink(item) {
    var link = cloneTemplate(els.routeOptionTemplate, "a");
    var label = query("span", link);

    link.classList.add("jeeves-option");
    link.classList.add("jeeves-option-route");
    link.setAttribute("href", item.href || "#");
    link.setAttribute("data-option-type", "route");
    link.setAttribute("data-option-target", item.id || "");

    if (label) {
      label.textContent = item.label;
    } else {
      link.textContent = item.label;
    }

    link.addEventListener("click", function onRouteClick() {
      state.acceptedRoute = item.id || null;
    });

    return link;
  }

  function dedupeOptions(list) {
    var seen = {};
    var clean = [];

    (list || []).forEach(function eachOption(item) {
      var key;

      if (!item || !item.label || !item.target) return;

      key = item.label + "::" + item.target;

      if (!seen[key]) {
        seen[key] = true;
        clean.push(item);
      }
    });

    return clean;
  }

  function shouldAskQuestion(node) {
    var key;

    if (!node || !node.question) return false;
    if (node.phase === "handoff") return false;

    key = state.currentNode + "::" + (node.pathKey || "node") + "::" + (node.pathDepth || 0);

    if (state.brain.lastQuestionKey === key) return false;

    if (node.forceQuestion) {
      state.brain.lastQuestionKey = key;
      return true;
    }

    if (node.pathDepth === 2 || node.pathDepth === 3) {
      state.brain.lastQuestionKey = key;
      return true;
    }

    if (state.brain.movement === "digress" && node.question) {
      state.brain.lastQuestionKey = key;
      return true;
    }

    return false;
  }

  function addAdaptiveOptions(options, node, questionAsked) {
    var list = (options || []).slice();
    var hasRecenter = list.some(function hasRecenterOption(item) {
      return item && item.target === "recenterNode";
    });
    var hasCleanDoor = list.some(function hasCleanDoorOption(item) {
      return item && item.target === "cleanDoor";
    });
    var isRecoveryNode = state.currentNode === "recenterNode" ||
      state.currentNode === "loopRecovery" ||
      state.currentNode === "cleanDoor";

    if (
      questionAsked &&
      node.questionOptions &&
      node.questionOptions.length
    ) {
      list = node.questionOptions.concat(list);
    }

    if (
      !isRecoveryNode &&
      state.brain.loopCount >= 2 &&
      state.currentPhase !== "handoff"
    ) {
      list.push(option("I keep circling this room.", "loopRecovery", "control", { signal: "lost" }));
    }

    if (
      !isRecoveryNode &&
      state.brain.recenterAvailable &&
      !hasRecenter &&
      state.currentPhase !== "handoff"
    ) {
      list.push(option("Re-center me.", "recenterNode", "control", { signal: "lost" }));
    }

    if (
      !isRecoveryNode &&
      state.brain.routeReadiness >= 3 &&
      !hasCleanDoor &&
      state.currentPhase !== "handoff"
    ) {
      list.push(option("Give me the cleanest next door.", "cleanDoor", "control"));
    }

    return dedupeOptions(list);
  }

  function renderOptions(options) {
    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    (options || []).forEach(function eachOption(item) {
      els.promptGrid.appendChild(makeOptionButton(item));
    });
  }

  function renderHandoffs(ids) {
    var handoffs = [];

    clearElement(els.handoffGrid);

    (ids || []).forEach(function eachId(id) {
      var item = typeof id === "string" ? getHandoff(id) : id;

      if (item && item.href && item.href !== "#") {
        handoffs.push(item);
      }
    });

    state.lastSuggestedRoutes = handoffs.map(function mapHandoff(item) {
      return item.id;
    });

    if (!els.handoffDock || !els.handoffGrid) return;

    if (!handoffs.length) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      return;
    }

    els.handoffDock.setAttribute("data-handoff-visible", "true");

    handoffs.forEach(function eachHandoff(item) {
      els.handoffGrid.appendChild(makeRouteLink(item));
    });
  }

  function updateState(nodeId, node) {
    state.previousNode = state.currentNode;
    state.currentNode = normalizeNode(nodeId);
    state.currentOrgan = node.organ || "arrival";
    state.currentPosture = node.posture || "arrival";
    state.currentPhase = node.phase || "receive";
    state.currentPath = node.pathKey || null;
    state.currentPathDepth = node.pathDepth || 0;
    state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);
    state.cycleStep = (state.cycleStep + 1) % 16;

    if (typeof node.skepticism === "number") {
      state.skepticismLevel = Math.max(state.skepticismLevel, node.skepticism);
    }

    if (
      state.currentPosture === "world" ||
      state.currentPosture === "characters" ||
      state.currentPosture === "mirrorMe"
    ) {
      state.curiosityLevel = Math.max(state.curiosityLevel, 2);
    }

    if (
      state.currentPhase === "handoff" ||
      state.currentPhase === "route" ||
      state.currentPathDepth === 4
    ) {
      state.routePressure = Math.min(10, state.routePressure + 1);
    }

    state.history.push({
      node: state.currentNode,
      organ: state.currentOrgan,
      posture: state.currentPosture,
      phase: state.currentPhase,
      path: state.currentPath,
      pathDepth: state.currentPathDepth,
      brain: {
        visitorPosture: state.brain.visitorPosture,
        movement: state.brain.movement,
        inferredConclusion: state.brain.inferredConclusion,
        routeReadiness: state.brain.routeReadiness
      },
      stateIndex: state.stateIndex
    });

    while (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }
  }

  function compileBeats(node, questionAsked) {
    var beats = [];

    (node.beats || []).forEach(function eachBeat(beat) {
      beats.push(beat);
    });

    if (node.after && state.curiosityLevel >= 2) {
      node.after.forEach(function eachAfter(beat) {
        beats.push(beat);
      });
    }

    if (questionAsked && node.question) {
      beats.push(node.question);
    }

    return beats;
  }

  async function playBeats(beats, token) {
    var i;
    var beat;

    for (i = 0; i < beats.length; i += 1) {
      if (token !== state.runToken) return false;

      beat = beats[i];

      setTyping(true);
      await wait(getTypingDelay(beat, i));

      if (token !== state.runToken) return false;

      setTyping(false);

      addMessage("jeeves", beat, {
        emphasis: i === 0 && (
          state.currentPosture === "arrival" ||
          state.currentPosture === "skeptic"
        )
      });

      await wait(getReadDelay(beat));
    }

    if (token !== state.runToken) return false;

    await wait(PACING.optionRevealDelayMs);

    return token === state.runToken;
  }

  async function runNode(nodeId, settings) {
    var node;
    var beats;
    var token;
    var initialDelay;
    var completed;
    var questionAsked;
    var finalOptions;

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    node = getNode(nodeId, true);
    updateState(nodeId, node);

    if (settings && settings.choice) {
      updateBrain(settings.choice, node);
    }

    hideOptions();

    questionAsked = shouldAskQuestion(node);
    beats = compileBeats(node, questionAsked);
    finalOptions = addAdaptiveOptions(node.options || [], node, questionAsked);
    initialDelay = settings && settings.fast ? PACING.firstMessageDelayMs : 420;

    await wait(initialDelay);

    if (token !== state.runToken) {
      state.busy = false;
      return;
    }

    completed = await playBeats(beats, token);

    if (!completed || token !== state.runToken) {
      state.busy = false;
      return;
    }

    renderOptions(finalOptions);
    renderHandoffs(node.handoffs || []);

    state.busy = false;
    scrollThread();

    if (settings && settings.done && typeof settings.done === "function") {
      settings.done();
    }
  }

  function handleOption(item) {
    if (!item || !item.target || state.busy) return;

    addMessage("visitor", item.label);
    runNode(item.target, { choice: item });
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();

    if (
      value.indexOf("lost") !== -1 ||
      value.indexOf("confused") !== -1 ||
      value.indexOf("recenter") !== -1 ||
      value.indexOf("center") !== -1
    ) {
      return "recenterNode";
    }

    if (
      value.indexOf("sean") !== -1 ||
      value.indexOf("founder") !== -1 ||
      value.indexOf("person") !== -1 ||
      value.indexOf("human") !== -1
    ) {
      return "seanPath";
    }

    if (
      value.indexOf("proof") !== -1 ||
      value.indexOf("law") !== -1 ||
      value.indexOf("real") !== -1 ||
      value.indexOf("evidence") !== -1 ||
      value.indexOf("test") !== -1 ||
      value.indexOf("skeptic") !== -1 ||
      value.indexOf("plain") !== -1 ||
      value.indexOf("explain") !== -1
    ) {
      return "proofPath";
    }

    if (
      value.indexOf("diagnostic") !== -1 ||
      value.indexOf("coherence") !== -1 ||
      value.indexOf("fit") !== -1 ||
      value.indexOf("archetype") !== -1 ||
      value.indexOf("self") !== -1 ||
      value.indexOf("reflect") !== -1
    ) {
      return "diagnosticPath";
    }

    if (
      value.indexOf("product") !== -1 ||
      value.indexOf("tool") !== -1 ||
      value.indexOf("use") !== -1 ||
      value.indexOf("practical") !== -1
    ) {
      return "productsPath";
    }

    if (
      value.indexOf("book") !== -1 ||
      value.indexOf("summit") !== -1 ||
      value.indexOf("love") !== -1
    ) {
      return "bookPath";
    }

    if (
      value.indexOf("world") !== -1 ||
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("curious") !== -1
    ) {
      return "worldPath";
    }

    if (
      value.indexOf("character") !== -1 ||
      value.indexOf("npc") !== -1 ||
      value.indexOf("people") !== -1
    ) {
      return "charactersPath";
    }

    if (
      value.indexOf("mirror me") !== -1 ||
      value.indexOf("profile") !== -1 ||
      value.indexOf("future") !== -1
    ) {
      return "mirrorMePath";
    }

    if (
      value.indexOf("start") !== -1 ||
      value.indexOf("where") !== -1 ||
      value.indexOf("begin") !== -1
    ) {
      return "whereToStart";
    }

    return "askFirst";
  }

  function ask(text) {
    var target = classifyText(text);

    if (state.busy) return;

    addMessage("visitor", text);
    runNode(target, {
      choice: {
        label: text,
        target: target,
        signal: target === "recenterNode" ? "lost" : null
      }
    });
  }

  function bindRestore() {
    if (!els.restoreButton || !els.minimized) return;

    els.restoreButton.addEventListener("click", function restoreJeeves() {
      els.minimized.setAttribute("data-jeeves-minimized", "false");
      setStatus("listening", "House listening");
      scrollThread();
    });
  }

  function exposeApi() {
    global.HEARTH = global.HEARTH || {};
    global.HEARTH.JEEVES = global.HEARTH.JEEVES || {};

    global.HEARTH.JEEVES.engine = {
      contract: CONTRACT,
      route: ROUTE,
      state: state,
      organs: ORGANS.slice(),
      postures: POSTURES.slice(),
      phases: PHASES.slice(),
      paths: PATHS.slice(),
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      setPacing: function setPacing(nextPacing) {
        Object.keys(nextPacing || {}).forEach(function eachKey(key) {
          if (
            typeof nextPacing[key] === "number" &&
            Object.prototype.hasOwnProperty.call(PACING, key)
          ) {
            PACING[key] = nextPacing[key];
          }
        });
      },
      getPacing: function getPacing() {
        return safeClone(PACING);
      },
      getState: function getState() {
        return safeClone(state);
      },
      getBrain: function getBrain() {
        return safeClone(state.brain);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id, false));
      },
      getState256: function getState256() {
        return {
          posture: state.currentPosture,
          phase: state.currentPhase,
          index: state.stateIndex,
          label: "ST-" + String(state.stateIndex + 1).padStart(3, "0") + "-OF-256"
        };
      }
    };

    global.JEEVES_ENGINE = global.HEARTH.JEEVES.engine;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
    global.__HEARTH_JEEVES_ENGINE_ROUTE__ = ROUTE;
  }

  function init() {
    var initialNode;

    if (state.initialized) return;

    config = readConfig();
    collectElements();

    if (!els.thread || !els.promptGrid || !els.handoffGrid) {
      return;
    }

    clearSeedMessage();
    bindRestore();
    exposeApi();

    state.initialized = true;

    initialNode = normalizeNode(config.initialNode || "intro");
    runNode(initialNode, { fast: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
