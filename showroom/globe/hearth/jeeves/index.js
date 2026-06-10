// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_4X4_CURIOSITY_CHAMBER_ENGINE_TNT_v9
// Full-file replacement.
// Owns: collapsed Jeeves house intelligence, deterministic 256-state conversation scope, 20 internal conversational organs, 4x4 curiosity chamber, progressive disclosure, reader-paced cadence, guided route handoffs, current-session memory.
// Does not own: HTML shell, CSS styling, backend, persistent storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeeves256State4x4CuriosityChamberEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_4X4_CURIOSITY_CHAMBER_ENGINE_TNT_v9";
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

  var MAX_HISTORY = 36;
  var MAX_PATH_DEPTH = 4;

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

    lastSuggestedRoutes: [],
    acceptedRoute: null,
    history: []
  };

  var els = {};
  var config = {};

  function option(label, target, type) {
    return {
      label: label,
      target: target,
      type: type || "conversation"
    };
  }

  function routeOption(label, target) {
    return option(label, target, "route");
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
          "The website is the public side of the estate.",
          "It is where the house gives you doors before it gives you depth."
        ],
        options: [
          option("Orient me first.", "compassPath", "topic"),
          option("Show me proof.", "proofPath", "topic"),
          option("Show me practical use.", "productsPath", "topic"),
          option("Who is behind this?", "seanPath", "topic")
        ],
        handoffs: ["compass", "siteGuide"]
      },
      {
        phase: "reflect",
        beats: [
          "You do not need the whole map yet.",
          "You need the door that matches why you arrived."
        ],
        options: [
          option("I’m here to understand the layout.", "compassPath", "topic"),
          option("I’m here to test the claims.", "proofPath", "topic"),
          option("I’m here for something useful.", "productsPath", "topic"),
          option("I’m here for the world behind it.", "worldPath", "conversation")
        ],
        handoffs: ["compass", "coherenceDiagnostic", "products"]
      },
      {
        phase: "reveal",
        beats: [
          "The public estate divides into five useful doors.",
          "Compass orients you. Laws test the structure. Products make it usable. The Diagnostic reflects the visitor. Meet Sean anchors the human voice."
        ],
        options: [
          routeOption("Start at the Compass.", "handoffCompass"),
          routeOption("Read the Laws.", "handoffLaws"),
          routeOption("Open Products.", "handoffProducts"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic")
        ],
        handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed with the website path long enough.",
          "Choose your first public door now: orientation, proof, practical use, self-reflection, or the human voice."
        ],
        options: [
          routeOption("Orientation: Compass.", "handoffCompass"),
          routeOption("Proof: Laws.", "handoffLaws"),
          routeOption("Use: Products.", "handoffProducts"),
          routeOption("Self: Diagnostic.", "handoffDiagnostic"),
          routeOption("Human voice: Meet Sean.", "handoffSean")
        ],
        handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
      }
    ],

    skeptic: [
      {
        phase: "clarify",
        beats: [
          "Good. Skepticism belongs at the front door.",
          "This house should not be trusted just because it sounds interesting."
        ],
        options: [
          option("Then show me what holds it up.", "proofPath", "topic"),
          option("Show me the Diagnostic.", "diagnosticPath", "topic"),
          option("Show me practical use.", "productsPath", "topic"),
          option("I’ll try the world side anyway.", "worldPath", "conversation")
        ],
        handoffs: ["laws", "coherenceDiagnostic"]
      },
      {
        phase: "reflect",
        beats: [
          "You are right to test it before buying into the language.",
          "If the story side has no floor, it should not be allowed to carry weight."
        ],
        options: [
          option("Where is the floor?", "proofPath", "topic"),
          routeOption("Read the Laws.", "handoffLaws"),
          routeOption("Open Gauges.", "handoffGauges"),
          option("Test me instead.", "diagnosticPath", "topic")
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      },
      {
        phase: "prove",
        beats: [
          "The proof path has three different doors.",
          "Laws show what can be claimed. Gauges point toward whether the structure is holding. The Diagnostic tests the visitor’s own entry posture."
        ],
        options: [
          routeOption("Public proof: Laws.", "handoffLaws"),
          routeOption("Technical status: Gauges.", "handoffGauges"),
          routeOption("Personal test: Diagnostic.", "handoffDiagnostic"),
          option("Now show me the world side.", "worldPath", "conversation")
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed in the proof path.",
          "Choose the kind of proof you want before I take you any farther."
        ],
        options: [
          routeOption("Read the Laws.", "handoffLaws"),
          routeOption("Open Gauges.", "handoffGauges"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Return to the first fork.", "returnFork", "back")
        ],
        handoffs: ["laws", "gauges", "coherenceDiagnostic"]
      }
    ],

    diagnostic: [
      {
        phase: "personalize",
        beats: [
          "The Diagnostic is the mirror path.",
          "It does not begin by labeling you."
        ],
        options: [
          option("Then what does it do?", "diagnosticPath", "topic"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("Show me proof instead.", "proofPath", "topic"),
          option("Back to the first fork.", "returnFork", "back")
        ],
        handoffs: ["coherenceDiagnostic"]
      },
      {
        phase: "reflect",
        beats: [
          "It starts with how you think you move under pressure.",
          "That claim matters because pressure usually reveals the truth faster than preference does."
        ],
        options: [
          option("Go deeper.", "diagnosticPath", "topic"),
          routeOption("Take the Diagnostic.", "handoffDiagnostic"),
          option("What happens later with profiles?", "futureProfilePath", "topic"),
          option("Show me Laws instead.", "proofPath", "topic")
        ],
        handoffs: ["coherenceDiagnostic", "laws"]
      },
      {
        phase: "reveal",
        beats: [
          "The Diagnostic compares claimed coherence against scenario choices.",
          "That reveals the gap between who you think you are under pressure and what you actually choose first."
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
          "You have stayed with the mirror path long enough.",
          "Choose whether you want to test yourself now, learn why the profile matters, or return to proof."
        ],
        options: [
          routeOption("Test myself: Diagnostic.", "handoffDiagnostic"),
          option("Profile path: future profile.", "futureProfilePath", "topic"),
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
          "The world side is where the estate stops being a map.",
          "It begins behaving like a place."
        ],
        options: [
          routeOption("Enter the Interactive Narrative.", "handoffWorld"),
          option("Tell me about Hearth.", "hearthPath", "topic"),
          option("Tell me about the characters.", "charactersPath", "topic"),
          option("Explain Mirror Me.", "mirrorMePath", "topic")
        ],
        handoffs: ["interactiveNarrative", "hearth"]
      },
      {
        phase: "reflect",
        beats: [
          "You are not entering lore.",
          "You are entering a place that needs people, doors, pressure, and memory to feel alive."
        ],
        options: [
          option("Show me the people.", "charactersPath", "topic"),
          option("Show me the house-side world.", "hearthPath", "topic"),
          option("Show me the outward world.", "audraliaPath", "topic"),
          routeOption("Open the world gate.", "handoffWorld")
        ],
        handoffs: ["characters", "hearth", "audralia", "interactiveNarrative"]
      },
      {
        phase: "deepen",
        beats: [
          "Hearth is the house-side chamber. Audralia is an outward world lane.",
          "Characters make the world personal. Mirror Me is the future reflection challenge."
        ],
        options: [
          routeOption("World gate: Interactive Narrative.", "handoffWorld"),
          routeOption("House chamber: Hearth.", "handoffHearth"),
          routeOption("World lane: Audralia.", "handoffAudralia"),
          routeOption("People: Characters.", "handoffCharacters")
        ],
        handoffs: ["interactiveNarrative", "hearth", "audralia", "characters"]
      },
      {
        phase: "route",
        beats: [
          "You have stayed with the world path.",
          "Choose how you want to enter it: gate, house, outward world, characters, or future reflection."
        ],
        options: [
          routeOption("Gate: Interactive Narrative.", "handoffWorld"),
          routeOption("House: Hearth.", "handoffHearth"),
          routeOption("Outward world: Audralia.", "handoffAudralia"),
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
        "You do not need to understand the whole estate at once.",
        "I can guide you through the website, take you toward the world behind it, or ask you one question first."
      ],
      options: [
        option("Guide me through the website.", "websitePath"),
        option("Take me toward the world behind it.", "worldPath"),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration"),
        option("Just tell me where to start.", "whereToStart"),
        option("Go ahead and ask.", "askFirst", "conversation")
      ],
      handoffs: []
    },

    askFirst: {
      organ: "firstFork",
      posture: "arrival",
      phase: "invite",
      beats: [
        "Then I’ll ask plainly.",
        "What brought you here first?",
        "Curiosity, skepticism, self-reflection, practical use, or the story?"
      ],
      options: [
        option("Curiosity.", "worldPath", "conversation"),
        option("Skepticism.", "skepticPlain", "calibration"),
        option("Self-reflection.", "diagnosticPath", "topic"),
        option("Practical use.", "productsPath", "topic"),
        option("The story.", "worldPath", "conversation")
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

    charactersPath: {
      organ: "characters",
      posture: "characters",
      phase: "personalize",
      pathKey: "world"
    },

    compassPath: {
      organ: "compass",
      posture: "orientation",
      phase: "route",
      beats: [
        "The Compass is the cleanest first door.",
        "It keeps the estate from feeling like a maze.",
        "Use it when you want orientation before depth."
      ],
      options: [
        routeOption("Take me to the Compass.", "handoffCompass"),
        option("Explain the Diagnostic first.", "diagnosticPath", "topic"),
        option("Explain proof first.", "proofPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
      ],
      handoffs: ["compass"]
    },

    whereToStart: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      beats: [
        "Start with the pressure you brought in.",
        "If you are confused, choose orientation. If you are skeptical, choose proof.",
        "If you want the mirror, choose the Diagnostic. If you want application, choose Products."
      ],
      options: [
        option("Orientation.", "websitePath", "topic"),
        option("Proof.", "proofPath", "topic"),
        option("Self-reflection.", "diagnosticPath", "topic"),
        option("Practical use.", "productsPath", "topic"),
        option("The world behind it.", "worldPath", "conversation")
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
    },

    seanPath: {
      organ: "sean",
      posture: "sean",
      phase: "reflect",
      beats: [
        "Sean is the human voice behind this side of the bridge.",
        "He turns pressure into language.",
        "Then he turns that language into rooms other people can walk through."
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
        "This Underdog is part of the house’s human voice.",
        "It is pressure turned into comedy, story, and usable language.",
        "It keeps the estate from becoming only technical."
      ],
      options: [
        routeOption("Open About This Underdog.", "handoffUnderdog"),
        option("Meet Sean instead.", "seanPath", "topic"),
        option("Show me the book path.", "bookPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
      ],
      handoffs: ["aboutUnderdog", "meetSean"]
    },

    productsPath: {
      organ: "products",
      posture: "products",
      phase: "route",
      beats: [
        "Products are where the message becomes usable.",
        "They are not just labels on a shelf.",
        "They are doors into support, games, education, nutrition, the book, and practical paths."
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
        "The Nine Summits path is the book and seminar side.",
        "It carries pressure, love, voice, and self-understanding as a human development path.",
        "Use that door when you want the message in a more personal form."
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
        "Hearth is the house-side world.",
        "It is the place from which this interface speaks.",
        "If Mirrorland is the larger direction, Hearth is the immediate chamber."
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
        "Audralia is one of the visible world lanes beyond Hearth.",
        "It is a wider crossing once the visitor understands this is a world path.",
        "Use it when you want the estate to expand outward."
      ],
      options: [
        routeOption("Visit Audralia.", "handoffAudralia"),
        option("Explore Frontier.", "frontierPath", "topic"),
        option("Return to Hearth.", "hearthPath", "back"),
        option("Back to world gate.", "worldGatePath", "back")
      ],
      handoffs: ["audralia", "frontier", "hearth"]
    },

    frontierPath: {
      organ: "frontier",
      posture: "frontier",
      phase: "deepen",
      beats: [
        "Frontier is the outward discovery path.",
        "Use it when you want the edge of the estate rather than the center of the house.",
        "It is stronger after Hearth or Audralia than before orientation."
      ],
      options: [
        routeOption("Explore Frontier.", "handoffFrontier"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Return to the world gate.", "worldGatePath", "back"),
        option("Restart the first fork.", "restartFork", "restart")
      ],
      handoffs: ["frontier", "audralia", "interactiveNarrative"]
    },

    futureProfilePath: {
      organ: "futureProfile",
      posture: "futureProfile",
      phase: "reveal",
      beats: [
        "The future profile is where the Diagnostic becomes more than a result on a page.",
        "The idea is that your pattern can eventually travel with you through the estate.",
        "That should be a user path, not a paywall at the gate."
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic"),
        option("Explain Mirror Me.", "mirrorMePath", "topic"),
        option("Enter the world path.", "worldGatePath", "route"),
        option("Back to the first fork.", "returnFork", "back")
      ],
      handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
    },

    mirrorMePath: {
      organ: "mirrorMe",
      posture: "mirrorMe",
      phase: "reveal",
      pathKey: "world"
    },

    returnFork: {
      organ: "return",
      posture: "arrival",
      phase: "return",
      beats: [
        "Then we return to the clean fork.",
        "Website first, or world behind it.",
        "That choice decides the next door."
      ],
      options: [
        option("Guide me through the website.", "websitePath"),
        option("Take me toward the world behind it.", "worldPath"),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration"),
        option("Just tell me where to start.", "whereToStart"),
        option("Go ahead and ask.", "askFirst", "conversation")
      ],
      handoffs: []
    },

    restartFork: {
      organ: "restart",
      posture: "arrival",
      phase: "reset",
      resetDepth: true,
      beats: [
        "Clean reset.",
        "You are back at the doorway.",
        "Website, or the world behind it?"
      ],
      options: [
        option("Guide me through the website.", "websitePath"),
        option("Take me toward the world behind it.", "worldPath"),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration"),
        option("Just tell me where to start.", "whereToStart"),
        option("Go ahead and ask.", "askFirst", "conversation")
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
        option("Restart the first fork.", "restartFork", "restart")
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
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffLaws: {
      posture: "handoff",
      targetRoute: "laws",
      beats: [
        "Open the Laws.",
        "That is where the estate makes its proof posture visible."
      ],
      options: [
        routeOption("Open Gauges too.", "handoffGauges"),
        option("Show me the Diagnostic.", "diagnosticPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
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
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffProducts: {
      posture: "handoff",
      targetRoute: "products",
      beats: [
        "Open Products.",
        "That is where the estate becomes usable."
      ],
      options: [
        option("Show me the book path.", "bookPath", "topic"),
        option("Tell me who Sean is.", "seanPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
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
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffUnderdog: {
      posture: "handoff",
      targetRoute: "aboutUnderdog",
      beats: [
        "Open About This Underdog.",
        "That path carries the comedy, pressure, and voice side of the estate."
      ],
      options: [
        option("Meet Sean instead.", "seanPath", "topic"),
        option("Show me the book path.", "bookPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
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
        option("Restart the first fork.", "restartFork", "restart")
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
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffCharacters: {
      posture: "handoff",
      targetRoute: "characters",
      beats: [
        "Open Characters.",
        "That is where the world becomes populated instead of merely explained."
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
        "That is the right next door if you want the world behind the website."
      ],
      options: [
        option("Visit Hearth first.", "hearthPath", "topic"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffHearth: {
      posture: "handoff",
      targetRoute: "hearth",
      beats: [
        "Return to Hearth.",
        "That is the house-side world before the outward lanes."
      ],
      options: [
        option("Enter the Interactive Narrative.", "worldGatePath", "route"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Restart the first fork.", "restartFork", "restart")
      ]
    },

    handoffAudralia: {
      posture: "handoff",
      targetRoute: "audralia",
      beats: [
        "Visit Audralia.",
        "That is one of the visible world lanes beyond Hearth."
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
        option("Restart the first fork.", "restartFork", "restart")
      ]
    }
  };

  function appendAskOption(options, nodeId) {
    var list = (options || []).slice();
    var hasAsk = list.some(function hasAskOption(item) {
      return item && item.target === "askFirst";
    });

    if (!hasAsk && nodeId !== "askFirst") {
      list.push(option("Go ahead and ask.", "askFirst", "conversation"));
    }

    return list;
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

  function resetPathDepth() {
    PATHS.forEach(function eachPath(path) {
      state.pathDepth[path] = 0;
    });
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

  function getNode(id, shouldAdvanceDepth) {
    var nodeId = normalizeNode(id);
    var base;
    var depth;
    var expression;

    if (NODE[nodeId]) {
      base = NODE[nodeId];

      if (base.resetDepth) {
        resetPathDepth();
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

  function renderOptions(options, nodeId) {
    var finalOptions = appendAskOption(options, nodeId);

    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    finalOptions.forEach(function eachOption(item) {
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
      stateIndex: state.stateIndex
    });

    while (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }
  }

  function compileBeats(node) {
    var beats = [];

    (node.beats || []).forEach(function eachBeat(beat) {
      beats.push(beat);
    });

    if (node.after && state.curiosityLevel >= 2) {
      node.after.forEach(function eachAfter(beat) {
        beats.push(beat);
      });
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

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    node = getNode(nodeId, true);
    updateState(nodeId, node);

    hideOptions();

    beats = compileBeats(node);
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

    renderOptions(node.options || [], state.currentNode);
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
    runNode(item.target);
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();

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
      value.indexOf("lost") !== -1 ||
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
    runNode(target);
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
