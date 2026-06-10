// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_CONVERSATIONAL_FUNNEL_ENGINE_TNT_v5
// Full-file replacement.
// Owns: collapsed Jeeves house intelligence, deterministic 256-state conversation scope, 20 internal organs, visitor posture, route handoffs, current-session memory.
// Does not own: HTML shell, CSS styling, backend, persistent storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeeves256StateConversationalFunnel(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_CONVERSATIONAL_FUNNEL_ENGINE_TNT_v5";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var BEAT_DELAY_MS = 95;
  var THINK_DELAY_MS = 80;
  var MAX_HISTORY = 32;

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

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    initialized: false,
    busy: false,
    currentNode: "arrival",
    previousNode: null,
    currentOrgan: "arrival",
    currentPosture: "arrival",
    currentPhase: "receive",
    stateIndex: 0,
    cycleStep: 0,
    curiosityLevel: 1,
    skepticismLevel: 0,
    routePressure: 0,
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

  function readConfig() {
    var script = query("#jeevesConversationConfig");

    if (!script) {
      return {
        initialNode: "arrival",
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        initialNode: "arrival",
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

  var NODE = {
    arrival: {
      organ: "arrival",
      posture: "arrival",
      phase: "receive",
      beats: [
        "Welcome to Diamond Gate Bridge.",
        "You do not need the whole house at once.",
        "Tell me whether you want the website first, or the world behind it."
      ],
      options: [
        option("Guide me through the website.", "websitePath"),
        option("Take me toward the world behind it.", "worldPath"),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration"),
        option("Just tell me where to start.", "whereToStart")
      ],
      handoffs: []
    },

    websitePath: {
      organ: "firstFork",
      posture: "orientation",
      phase: "fork",
      beats: [
        "Then we use the public estate.",
        "That means proof, products, Sean, self-reflection, and the first story doors.",
        "The right path depends on what you need first."
      ],
      options: [
        option("I need proof before imagination.", "proofPath", "topic"),
        option("I want practical use.", "productsPath", "topic"),
        option("I want to know who Sean is.", "seanPath", "topic"),
        option("I want the world side instead.", "worldPath")
      ],
      handoffs: ["compass", "siteGuide", "coherenceDiagnostic"]
    },

    worldPath: {
      organ: "worldGate",
      posture: "world",
      phase: "fork",
      beats: [
        "Then we move toward the world behind the website.",
        "That is where the estate stops acting like a list of pages.",
        "It starts becoming a place."
      ],
      options: [
        routeOption("Open the world gate.", "worldGatePath"),
        option("Tell me about Hearth.", "hearthPath", "topic"),
        option("Tell me about the characters.", "charactersPath", "topic"),
        option("Explain Mirror Me.", "mirrorMePath", "topic")
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia"]
    },

    skepticPlain: {
      organ: "skeptic",
      posture: "skeptic",
      phase: "clarify",
      skepticism: 2,
      beats: [
        "Plainly: this is a guided estate.",
        "It uses story, diagnostics, proof, products, and world-building to make a large system enterable.",
        "If you want to test structure first, start with Laws or the Diagnostic."
      ],
      options: [
        option("Show me the Laws.", "proofPath", "topic"),
        option("Show me the Diagnostic.", "diagnosticPath", "topic"),
        option("Show me practical use.", "productsPath", "topic"),
        option("Now I’ll try the world side.", "worldPath")
      ],
      handoffs: ["laws", "coherenceDiagnostic", "compass"]
    },

    whereToStart: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      beats: [
        "Start with the pressure you brought in.",
        "Confused visitors should use the Compass.",
        "Skeptical visitors should use Laws. Reflective visitors should use the Diagnostic. Practical visitors should use Products."
      ],
      options: [
        option("I want orientation.", "compassPath", "topic"),
        option("I want proof.", "proofPath", "topic"),
        option("I want self-reflection.", "diagnosticPath", "topic"),
        option("I want practical use.", "productsPath", "topic")
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
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

    proofPath: {
      organ: "proof",
      posture: "proof",
      phase: "prove",
      skepticism: 1,
      beats: [
        "The proof path begins with the Laws.",
        "That is where the estate says what can be claimed and what must be checked.",
        "Proof outranks confidence there."
      ],
      options: [
        routeOption("Read the Laws.", "handoffLaws"),
        routeOption("Open Gauges.", "handoffGauges"),
        option("Show me the Diagnostic.", "diagnosticPath", "topic"),
        option("I’m ready for the world side.", "worldPath")
      ],
      handoffs: ["laws", "gauges", "coherenceDiagnostic"]
    },

    diagnosticPath: {
      organ: "diagnostic",
      posture: "diagnostic",
      phase: "personalize",
      beats: [
        "The Coherence Diagnostic is the personal mirror.",
        "It asks how coherent you believe yourself to be.",
        "Then it compares that claim against pressure scenarios."
      ],
      after: [
        "It is local-only and reflective.",
        "It is not medical, legal, employment screening, an IQ test, or official MBTI."
      ],
      options: [
        routeOption("Take me to the Diagnostic.", "handoffDiagnostic"),
        option("How does this become a profile later?", "futureProfilePath", "topic"),
        option("Show me proof instead.", "proofPath", "topic"),
        option("Back to the first fork.", "returnFork", "back")
      ],
      handoffs: ["coherenceDiagnostic"]
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

    worldGatePath: {
      organ: "worldGate",
      posture: "world",
      phase: "route",
      beats: [
        "The world gate is where explanation gives way to entry.",
        "The estate should stop acting like a brochure there.",
        "It should start opening."
      ],
      options: [
        routeOption("Enter the Interactive Narrative.", "handoffWorld"),
        option("Visit Hearth first.", "hearthPath", "topic"),
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Back to the first fork.", "returnFork", "back")
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia", "frontier"]
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
        "It is not the first explanation door.",
        "It is a wider crossing once the visitor understands this is a world path."
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

    charactersPath: {
      organ: "characters",
      posture: "characters",
      phase: "personalize",
      beats: [
        "The characters are not menu labels.",
        "They are people inside the world path.",
        "Their job is to make the estate feel inhabited."
      ],
      after: [
        "You do not need to memorize them at the doorway.",
        "You only need to decide whether you want the world to become personal."
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
      beats: [
        "Mirror Me is the higher-self challenge path.",
        "Not a clone. Not a gimmick.",
        "A reflected version of what the visitor could become when the world begins answering them back."
      ],
      after: [
        "That is future-facing.",
        "So I will not pretend it is fully live today."
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic"),
        option("Meet the Characters.", "charactersPath", "topic"),
        option("Enter the world gate.", "worldGatePath", "route"),
        option("Back to future profile.", "futureProfilePath", "back")
      ],
      handoffs: ["coherenceDiagnostic", "characters", "interactiveNarrative"]
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
        option("Just tell me where to start.", "whereToStart")
      ],
      handoffs: []
    },

    restartFork: {
      organ: "restart",
      posture: "arrival",
      phase: "reset",
      beats: [
        "Clean reset.",
        "You are back at the doorway.",
        "Website, or the world behind it?"
      ],
      options: [
        option("Guide me through the website.", "websitePath"),
        option("Take me toward the world behind it.", "worldPath"),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration"),
        option("Just tell me where to start.", "whereToStart")
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
        "It is the cleanest orientation point.",
        "Use it when you want the estate to stop feeling like a maze."
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
        "It is the cleanest mirror path.",
        "That is where the estate starts with the visitor instead of the map."
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
        "That is where the estate makes its proof posture visible.",
        "If you need structure before story, that is the correct door."
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
        "Laws explain the standard.",
        "Gauges point toward whether the estate is holding that standard."
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
        "That is where the estate becomes usable.",
        "Use that door when you want application before explanation."
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
        "That is the cleanest path to the human voice behind the house.",
        "If the estate feels unusual, that door explains the person behind the pressure and language."
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
        "That path carries the comedy, pressure, and human voice side of the estate.",
        "It keeps the system from becoming only architecture."
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
        "That is the book path.",
        "Use it when you want the message carried as human development rather than site navigation."
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
        "That is the wider development path around the book and seminar system.",
        "It is a better door for the framework than for the world-lore path."
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
        "That is where the world becomes populated instead of merely explained.",
        "Use that door if you want people, not just architecture."
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
        "That is the right next door if you want the world behind the website.",
        "At that point, the estate should stop explaining itself and start opening."
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
        "That is the house-side world before the outward lanes.",
        "It is the proper place to re-enter close to the home chamber."
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
        "That is one of the visible world lanes beyond Hearth.",
        "Use it when you want the estate to expand outward."
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
        "That is the outward-facing discovery path.",
        "It is best used after you know you are leaving the lobby."
      ],
      options: [
        option("Visit Audralia.", "audraliaPath", "topic"),
        option("Back to the world gate.", "worldGatePath", "back"),
        option("Restart the first fork.", "restartFork", "restart")
      ]
    }
  };

  function normalizeNode(id) {
    if (id === "intro") return "arrival";
    return id || "arrival";
  }

  function getNode(id) {
    var nodeId = normalizeNode(id);

    if (NODE[nodeId]) return NODE[nodeId];

    if (HANDOFF_NODE[nodeId]) {
      return {
        organ: "routeHandoff",
        posture: HANDOFF_NODE[nodeId].posture || "handoff",
        phase: "handoff",
        beats: HANDOFF_NODE[nodeId].beats,
        options: HANDOFF_NODE[nodeId].options,
        handoffs: [HANDOFF_NODE[nodeId].targetRoute]
      };
    }

    return NODE.arrival;
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
      isTyping ? "Jeeves considering" : "House listening"
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
    state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);
    state.cycleStep = (state.cycleStep + 1) % 16;

    if (typeof node.skepticism === "number") {
      state.skepticismLevel = Math.max(state.skepticismLevel, node.skepticism);
    }

    if (state.currentPosture === "world" || state.currentPosture === "characters" || state.currentPosture === "mirrorMe") {
      state.curiosityLevel = Math.max(state.curiosityLevel, 2);
    }

    if (state.currentPhase === "handoff" || state.currentPhase === "route") {
      state.routePressure = Math.min(10, state.routePressure + 1);
    }

    state.history.push({
      node: state.currentNode,
      organ: state.currentOrgan,
      posture: state.currentPosture,
      phase: state.currentPhase,
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

  function playBeats(beats, index, done) {
    if (index >= beats.length) {
      setTyping(false);
      if (typeof done === "function") done();
      return;
    }

    setTyping(true);

    window.setTimeout(function afterThinking() {
      setTyping(false);

      addMessage("jeeves", beats[index], {
        emphasis: index === 0 && (state.currentPosture === "arrival" || state.currentPosture === "skeptic")
      });

      window.setTimeout(function nextBeat() {
        playBeats(beats, index + 1, done);
      }, BEAT_DELAY_MS);
    }, THINK_DELAY_MS);
  }

  function runNode(nodeId, settings) {
    var node = getNode(nodeId);
    var beats;

    if (state.busy) return;

    state.busy = true;

    updateState(nodeId, node);
    renderOptions([]);
    renderHandoffs([]);

    beats = compileBeats(node);

    playBeats(beats, 0, function afterBeats() {
      renderOptions(node.options || []);
      renderHandoffs(node.handoffs || []);
      state.busy = false;
      scrollThread();

      if (settings && settings.done && typeof settings.done === "function") {
        settings.done();
      }
    });
  }

  function handleOption(item) {
    if (!item || !item.target || state.busy) return;

    addMessage("visitor", item.label);
    runNode(item.target);
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();

    if (value.indexOf("sean") !== -1 || value.indexOf("founder") !== -1 || value.indexOf("person") !== -1) {
      return "seanPath";
    }

    if (value.indexOf("proof") !== -1 || value.indexOf("law") !== -1 || value.indexOf("real") !== -1 || value.indexOf("evidence") !== -1) {
      return "proofPath";
    }

    if (value.indexOf("diagnostic") !== -1 || value.indexOf("coherence") !== -1 || value.indexOf("fit") !== -1 || value.indexOf("archetype") !== -1) {
      return "diagnosticPath";
    }

    if (value.indexOf("product") !== -1 || value.indexOf("tool") !== -1 || value.indexOf("use") !== -1) {
      return "productsPath";
    }

    if (value.indexOf("book") !== -1 || value.indexOf("summit") !== -1 || value.indexOf("love") !== -1) {
      return "bookPath";
    }

    if (value.indexOf("world") !== -1 || value.indexOf("mirrorland") !== -1 || value.indexOf("story") !== -1) {
      return "worldPath";
    }

    if (value.indexOf("character") !== -1 || value.indexOf("npc") !== -1) {
      return "charactersPath";
    }

    if (value.indexOf("mirror me") !== -1 || value.indexOf("profile") !== -1 || value.indexOf("future") !== -1) {
      return "mirrorMePath";
    }

    if (value.indexOf("start") !== -1 || value.indexOf("where") !== -1 || value.indexOf("lost") !== -1) {
      return "whereToStart";
    }

    if (value.indexOf("skeptic") !== -1 || value.indexOf("confused") !== -1 || value.indexOf("plain") !== -1) {
      return "skepticPlain";
    }

    return "whereToStart";
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
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      getState: function getState() {
        return safeClone(state);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id));
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

    initialNode = normalizeNode(config.initialNode || "arrival");
    runNode(initialNode, { fast: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
