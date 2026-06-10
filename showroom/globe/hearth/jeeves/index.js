// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_DUAL_REGISTRY_VOICE_GOVERNOR_TAP_ADVANCE_ENGINE_TNT_v13
// Full-file replacement.
// Canvas/HTML/CSS remain external authority.
// Public Jeeves dialogue is governed by dual visitor-facing expression maps.
// Deterministic, button-led, no freeform AI, no fourth file.

(function hearthJeevesDualRegistryVoiceGovernorTapAdvanceEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_DUAL_REGISTRY_VOICE_GOVERNOR_TAP_ADVANCE_ENGINE_TNT_v13";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";

  var MAX_HISTORY = 48;
  var MAX_PATH_DEPTH = 4;
  var MAX_TRAIL = 10;

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

    optionRevealDelayMs: 1200,

    tapMaxDistancePx: 14,
    tapMaxDurationMs: 360
  };

  var DEFAULT_ROUTES = {
    compass: "/",
    home: "/",
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
    mirrorland: "/showroom/globe/",
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
    home: "Open the Public Entry",
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
    mirrorland: "Open Mirrorland",
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

  var FORBIDDEN_PUBLIC_LANGUAGE = [
    { pattern: /\bconstruct\b/gi, replacement: "work" },
    { pattern: /\bscope lane\b/gi, replacement: "path" },
    { pattern: /\bregistry\b/gi, replacement: "guide" },
    { pattern: /\borgan\b/gi, replacement: "part" },
    { pattern: /\bengine\b/gi, replacement: "system" },
    { pattern: /\broute lane\b/gi, replacement: "path" },
    { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
    { pattern: /\bexpression payload\b/gi, replacement: "answer" },
    { pattern: /\bprogression state\b/gi, replacement: "step" },
    { pattern: /\bpublic human-voice side\b/gi, replacement: "place where the voice becomes human" }
  ];

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
    currentScopeLane: SCOPE_OBJECTIVE,
    currentVoiceMode: MODE_OBJECTIVE,
    currentEntry: null,

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
      inferredConclusion: "arriving at the doorway",
      recenterAvailable: false,

      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      scopeShiftCount: 0,
      objectiveCount: 0,
      narrativeCount: 0,
      thresholdCount: 0,

      questionReadiness: 0,
      lastQuestionKey: "",
      lastPath: null,
      lastScopeLane: SCOPE_OBJECTIVE,
      lastTarget: null,
      lastVisitorLabel: "",
      lastEntry: null,

      pathTrail: [],
      scopeTrail: [],
      conclusionTrail: []
    },

    tapAdvance: {
      bound: false,
      active: false,
      resolver: null,
      timer: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      startTime: 0,
      phase: ""
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

  var OBJECTIVE_REALITY_REGISTRY = {
    diamondGateBridge: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Name the real public work.",
      itch: "What is this place, really?",
      answer: [
        "Diamond Gate Bridge is the public work: the site, the proof path, the human voice, the diagnostic tools, the products, and the world doorway all gathered under one roof.",
        "The right first move is not to understand everything. The right first move is to find the door that matches why you arrived."
      ],
      question: "Did you come here for orientation, proof, usefulness, self-reflection, or the world behind it?",
      questionOptions: [
        option("Orientation.", "websitePath", "topic", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Usefulness.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("The world behind it.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["compass", "siteGuide", "laws", "coherenceDiagnostic", "products"]
    },

    home: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Return to the public entry.",
      itch: "I need a clean starting point.",
      answer: [
        "The public entry is the clean reset point.",
        "Start there when the project feels too wide and you need the first door instead of the whole map."
      ],
      routes: ["home", "compass", "siteGuide"]
    },

    compass: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Orient the visitor.",
      itch: "Where do I start?",
      answer: [
        "The Compass is the cleanest first route.",
        "It helps you choose between proof, self-reflection, practical use, the human voice, and the world door without needing to hold the entire site in your head."
      ],
      routes: ["compass", "siteGuide"]
    },

    siteGuide: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Explain the site map.",
      itch: "Show me how the site is organized.",
      answer: [
        "The Site Guide is the public map.",
        "It separates ordinary website pages from the deeper doors so a visitor can see what is public structure, what is proof, what is practical, and what begins pointing toward the world side."
      ],
      question: "Do you want the public map first, or the threshold into the world side?",
      questionOptions: [
        routeOption("Public map: Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["siteGuide", "showroom"]
    },

    laws: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Make claims testable.",
      itch: "Is this real, or is it just language?",
      answer: [
        "The Laws page is where Diamond Gate Bridge makes its claims testable.",
        "It is for visitors who want proof before they give the world side any trust."
      ],
      question: "What are you testing first: the claims, the structure, or the person behind it?",
      questionOptions: [
        routeOption("Claims: Laws.", "handoffLaws", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Structure: Gauges.", "handoffGauges", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Person: Meet Sean.", "handoffSean", { signal: "human", scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["laws", "gauges", "coherenceDiagnostic", "meetSean"]
    },

    gauges: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Show status and technical proof.",
      itch: "What is working, and what is still being tested?",
      answer: [
        "Gauges are the status route.",
        "They are for visitors who want to see whether the site, worlds, routes, and systems are holding instead of only hearing what they are supposed to become."
      ],
      routes: ["gauges", "laws"]
    },

    diagnostic: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Turn reflection into a usable self-check.",
      itch: "What does this say about me?",
      answer: [
        "The Diagnostic is the mirror side of the public website.",
        "It helps a visitor notice the difference between what they claim, what they choose, and what pressure reveals."
      ],
      question: "Do you want to test what you claim, what you choose, or the gap between them?",
      questionOptions: [
        option("What I claim.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("What I choose.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("The gap.", "futureProfilePath", "topic", { signal: "profile", scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["coherenceDiagnostic", "laws"]
    },

    meetSean: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Introduce the person behind the voice.",
      itch: "Who made this, and why should I trust that there is a real person behind it?",
      answer: [
        "Meet Sean is where the voice becomes a person.",
        "That page connects the work to pressure, accountability, comedy, story, speaking, and the real human effort behind Diamond Gate Bridge."
      ],
      question: "Do you want the person, the pressure, or the larger work?",
      questionOptions: [
        routeOption("The person: Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
        option("The pressure: This Underdog.", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("The larger work: Nine Summits.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["meetSean", "aboutUnderdog", "book", "nineSummits"]
    },

    thisUnderdog: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Name the inner voice before it has language.",
      itch: "What does This Underdog actually mean?",
      answer: [
        "This Underdog is not only a page about Sean.",
        "It is the part of a person that has been carrying pressure before it has found language.",
        "It is the inner voice that knows something is there, but has not yet learned how to stand up, speak clearly, or become useful.",
        "That is why it lives near comedy, pressure, story, voice, and becoming."
      ],
      question: "Do you want to follow that voice toward Sean, toward the Diagnostic, or toward the book path?",
      questionOptions: [
        routeOption("Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "book"]
    },

    products: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Make the work usable.",
      itch: "Is there something practical here?",
      answer: [
        "Products are for visitors who do not want only ideas.",
        "They are for people who want something they can use, wear, read, give, or return to."
      ],
      question: "Do you want something practical, personal, or book-shaped?",
      questionOptions: [
        routeOption("Practical: Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
        option("Personal: Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Book-shaped: Nine Summits.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["products", "book", "coherenceDiagnostic"]
    },

    book: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Carry the book path.",
      itch: "Where does this become a written path?",
      answer: [
        "The Nine Summits of Love is the book path.",
        "It takes the pressure, voice, coherence, and becoming questions and turns them into a human-development journey."
      ],
      routes: ["book", "nineSummits", "meetSean"]
    },

    nineSummits: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Carry the larger human-development system.",
      itch: "Where does this become a larger framework?",
      answer: [
        "Nine Summits is where the work becomes a broader path for human potential.",
        "It is less about browsing pages and more about what a person is becoming through pressure, love, voice, and coherence."
      ],
      question: "Do you want the book, the wider summit path, or the person behind it?",
      questionOptions: [
        routeOption("Book.", "handoffBook", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Nine Summits.", "handoffNineSummits", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["book", "nineSummits", "meetSean"]
    },

    futureProfile: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      purpose: "Describe future returning-visitor continuity carefully.",
      itch: "Can this remember or develop with me later?",
      answer: [
        "Future Profile is the future-facing return path.",
        "It points toward a version of the Diagnostic that could become more personal over time, but it should not be treated as fully live until the route is actually ready."
      ],
      routes: ["coherenceDiagnostic", "interactiveNarrative"]
    },

    showroomPublicThreshold: {
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_THRESHOLD,
      purpose: "Explain the crossing from the public side.",
      itch: "Where does the website become the world?",
      answer: [
        "The Showroom is the threshold.",
        "On one side, the site explains itself. On the other, the world begins to open."
      ],
      question: "Do you want the public map first, or the first threshold into the world side?",
      questionOptions: [
        routeOption("Public map: Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["siteGuide", "showroom", "interactiveNarrative"]
    }
  };

  var NARRATIVE_IMMERSION_REGISTRY = {
    showroomThreshold: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      purpose: "Mark the crossing.",
      itch: "Where does the website become the world?",
      answer: [
        "The Showroom is the threshold.",
        "The public map is still visible there, but the world side begins to press against it."
      ],
      question: "Do you want to inspect the threshold, enter the world gate, or return to the public map?",
      questionOptions: [
        routeOption("Inspect the threshold.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("Enter the world gate.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("Return to the public map.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["showroom", "interactiveNarrative", "siteGuide"]
    },

    interactiveNarrative: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      purpose: "Begin world traversal.",
      itch: "How do I enter the story?",
      answer: [
        "The Interactive Narrative is the first active doorway into the world side.",
        "It is where the visitor stops only reading and begins moving through the structure."
      ],
      question: "Do you want the threshold, the closest room, the people, or the distance beyond it?",
      questionOptions: [
        routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
        option("Closest room: Hearth.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("People: Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Distance: Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["interactiveNarrative", "showroom", "hearth", "characters", "audralia"]
    },

    mirrorland: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      purpose: "Name the world side without overacting.",
      itch: "What is Mirrorland?",
      answer: [
        "Mirrorland is the world side of Diamond Gate Bridge.",
        "It is where pressure, reflection, characters, rooms, and choices begin to behave like a place instead of only a page."
      ],
      routes: ["interactiveNarrative", "characters", "hearth"]
    },

    hearth: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      purpose: "Start inside the closest room.",
      itch: "Where should I begin inside the world?",
      answer: [
        "Hearth is the closest room to where I speak from.",
        "If the world feels too wide, begin there."
      ],
      question: "Do you want the room, the gate, or the world beyond the room?",
      questionOptions: [
        routeOption("The room: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("The gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("The world beyond it: Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["hearth", "interactiveNarrative", "audralia"]
    },

    audralia: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      purpose: "Open outward world expansion.",
      itch: "What is beyond the first room?",
      answer: [
        "Audralia is farther out.",
        "It is where the world begins to widen beyond the first threshold."
      ],
      question: "Do you want to stay near Hearth, move through Audralia, or push toward Frontier?",
      questionOptions: [
        option("Stay near Hearth.", "hearthPath", "back", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("Move through Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
        option("Push toward Frontier.", "frontierPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["audralia", "frontier", "hearth"]
    },

    frontier: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      purpose: "Carry the outward edge.",
      itch: "What is at the edge of the world?",
      answer: [
        "Frontier is the outward edge.",
        "It is where the world starts pointing beyond its first rooms and toward discovery."
      ],
      routes: ["frontier", "audralia", "interactiveNarrative"]
    },

    characters: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      purpose: "Make the world inhabited.",
      itch: "Who lives in this world?",
      answer: [
        "The characters are where the world stops feeling empty.",
        "They are not menu labels. They are the people who make pressure, consequence, choice, and story personal."
      ],
      question: "Do you want to meet them as people, follow them into the story, or keep them in the distance for now?",
      questionOptions: [
        routeOption("Meet them.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("Follow them into the story.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("Keep distance for now.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE })
      ],
      routes: ["characters", "interactiveNarrative", "mirrorland"]
    },

    mirrorMe: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      purpose: "Separate narrative reflection from the public Diagnostic.",
      itch: "Where does the world look back at me?",
      answer: [
        "Mirror Me is the narrative reflection path.",
        "It should not replace the public Diagnostic. It begins where the mirror becomes part of the world."
      ],
      question: "Do you want the public test, the story reflection, or the future profile path?",
      questionOptions: [
        routeOption("Public test: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Story reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Future profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      routes: ["coherenceDiagnostic", "interactiveNarrative", "characters"]
    },

    futureProfileNarrative: {
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      purpose: "Treat future identity continuity as a threshold idea.",
      itch: "Can the world remember who I am becoming?",
      answer: [
        "Future Profile points toward return.",
        "It is the idea that a visitor may eventually come back with more than a single session behind them, but it should stay clearly marked as future-facing unless the route is live."
      ],
      routes: ["coherenceDiagnostic", "interactiveNarrative"]
    }
  };

  var ENTRY_ALIASES = {
    compass: "objective.compass",
    siteGuide: "objective.siteGuide",
    laws: "objective.laws",
    gauges: "objective.gauges",
    diagnostic: "objective.diagnostic",
    meetSean: "objective.meetSean",
    thisUnderdog: "objective.thisUnderdog",
    products: "objective.products",
    book: "objective.book",
    nineSummits: "objective.nineSummits",
    futureProfile: "objective.futureProfile",
    showroomPublicThreshold: "objective.showroomPublicThreshold",

    showroomThreshold: "narrative.showroomThreshold",
    interactiveNarrative: "narrative.interactiveNarrative",
    mirrorland: "narrative.mirrorland",
    hearth: "narrative.hearth",
    audralia: "narrative.audralia",
    frontier: "narrative.frontier",
    characters: "narrative.characters",
    mirrorMe: "narrative.mirrorMe",
    futureProfileNarrative: "narrative.futureProfileNarrative"
  };

  var CHAMBER = {
    website: {
      objective: [
        { entry: "diamondGateBridge" },
        { entry: "siteGuide" },
        { entry: "compass" },
        { entry: "diamondGateBridge", forceRoute: true }
      ],
      narrative: [
        { entry: "showroomPublicThreshold" },
        { entry: "showroomPublicThreshold" },
        { entry: "siteGuide" },
        { entry: "showroomPublicThreshold", forceRoute: true }
      ]
    },

    skeptic: {
      objective: [
        { entry: "laws" },
        { entry: "laws" },
        { entry: "gauges" },
        { entry: "laws", forceRoute: true }
      ],
      narrative: [
        { entry: "showroomPublicThreshold" },
        { entry: "laws" },
        { entry: "showroomThreshold" },
        { entry: "showroomThreshold", forceRoute: true }
      ]
    },

    diagnostic: {
      objective: [
        { entry: "diagnostic" },
        { entry: "diagnostic" },
        { entry: "futureProfile" },
        { entry: "diagnostic", forceRoute: true }
      ],
      narrative: [
        { entry: "diagnostic" },
        { entry: "mirrorMe" },
        { entry: "futureProfileNarrative" },
        { entry: "mirrorMe", forceRoute: true }
      ]
    },

    world: {
      objective: [
        { entry: "mirrorland" },
        { entry: "interactiveNarrative" },
        { entry: "characters" },
        { entry: "interactiveNarrative", forceRoute: true }
      ],
      narrative: [
        { entry: "showroomThreshold" },
        { entry: "interactiveNarrative" },
        { entry: "hearth" },
        { entry: "interactiveNarrative", forceRoute: true }
      ]
    }
  };

  var ENTRY_OPTIONS = {
    diamondGateBridge: [
      option("Orient me first.", "compassPath", "topic", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
      option("Show me proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
      option("Show me practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
      option("Take me toward the world side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
    ],

    compass: [
      routeOption("Take me to the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me proof first.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the world side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
    ],

    siteGuide: [
      routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
      option("Show me products.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the threshold.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
    ],

    laws: [
      routeOption("Read the Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Open Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
    ],

    gauges: [
      routeOption("Open Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Read the Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Return to the doorway.", "returnFork", "back")
    ],

    diagnostic: [
      routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me Future Profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Read the Laws first.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE })
    ],

    meetSean: [
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
      option("Tell me about This Underdog.", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me products.", "productsPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
    ],

    thisUnderdog: [
      routeOption("Open About This Underdog.", "handoffUnderdog", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
    ],

    products: [
      routeOption("Open Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
      option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
    ],

    book: [
      routeOption("Open the book.", "handoffBook", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Open Nine Summits.", "handoffNineSummits", { scopeLane: SCOPE_OBJECTIVE }),
      option("Tell me about This Underdog.", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
    ],

    nineSummits: [
      routeOption("Open Nine Summits.", "handoffNineSummits", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Open the book.", "handoffBook", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
    ],

    futureProfile: [
      routeOption("Start with the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Return to the public map.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE })
    ],

    showroomPublicThreshold: [
      routeOption("Open the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Return to the doorway.", "returnFork", "back")
    ],

    showroomThreshold: [
      routeOption("Open the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Return to the public map.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE }),
      option("Visit Hearth.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE })
    ],

    interactiveNarrative: [
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Return to Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Meet the Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
      option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE })
    ],

    mirrorland: [
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Visit Hearth.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Meet the Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Explain the threshold.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
    ],

    hearth: [
      routeOption("Return to Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Meet the Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE })
    ],

    audralia: [
      routeOption("Visit Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
      option("Explore Frontier.", "frontierPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Return to Hearth.", "hearthPath", "back", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE })
    ],

    frontier: [
      routeOption("Explore Frontier.", "handoffFrontier", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Visit Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Return to the doorway.", "returnFork", "back")
    ],

    characters: [
      routeOption("Meet the Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      option("Back to the world path.", "worldPath", "back", { scopeLane: SCOPE_NARRATIVE })
    ],

    mirrorMe: [
      option("Start with the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
      option("Meet the Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Show Future Profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE })
    ],

    futureProfileNarrative: [
      routeOption("Start with the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
      routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
      option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
    ]
  };

  var NODE = {
    intro: {
      organ: "arrival",
      posture: "arrival",
      phase: "receive",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      entry: "diamondGateBridge",
      beats: [
        "Hello. I’m Jeeves.",
        "I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole work at once.",
        "I can guide you through the public website, take you toward the world side, or ask one question first."
      ],
      options: [
        option("Guide me through the public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Take me toward the world side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
        option("I’m skeptical. Explain it plainly.", "skepticPlain", "calibration", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question", scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: []
    },

    askFirst: {
      organ: "firstFork",
      posture: "arrival",
      phase: "invite",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      forceQuestion: true,
      beats: [
        "Then I’ll ask plainly.",
        "What brought you to the doorway first?"
      ],
      options: [
        option("Orientation.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Skepticism.", "skepticPlain", "calibration", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
        option("The world side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: []
    },

    websitePath: {
      organ: "firstFork",
      posture: "orientation",
      phase: "fork",
      pathKey: "website",
      defaultScopeLane: SCOPE_OBJECTIVE
    },

    skepticPlain: {
      organ: "skeptic",
      posture: "skeptic",
      phase: "clarify",
      pathKey: "skeptic",
      defaultScopeLane: SCOPE_OBJECTIVE,
      skepticism: 2
    },

    proofPath: {
      organ: "proof",
      posture: "proof",
      phase: "prove",
      pathKey: "skeptic",
      defaultScopeLane: SCOPE_OBJECTIVE,
      skepticism: 1
    },

    diagnosticPath: {
      organ: "diagnostic",
      posture: "diagnostic",
      phase: "personalize",
      pathKey: "diagnostic",
      defaultScopeLane: SCOPE_OBJECTIVE
    },

    worldPath: {
      organ: "worldGate",
      posture: "world",
      phase: "fork",
      pathKey: "world",
      defaultScopeLane: SCOPE_NARRATIVE
    },

    worldGatePath: {
      organ: "worldGate",
      posture: "world",
      phase: "route",
      pathKey: "world",
      defaultScopeLane: SCOPE_NARRATIVE
    },

    compassPath: {
      organ: "compass",
      posture: "orientation",
      phase: "route",
      entry: "compass"
    },

    whereToStart: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      entry: "compass",
      beats: [
        "Then I’ll re-center the doorway.",
        "Confusion wants the Compass. Doubt wants Laws. Self-reflection wants the Diagnostic. Usefulness wants Products."
      ],
      options: [
        option("Orientation.", "websitePath", "topic", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
        option("World side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
    },

    siteGuidePath: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      entry: "siteGuide"
    },

    lawsPath: {
      organ: "proof",
      posture: "proof",
      phase: "prove",
      entry: "laws"
    },

    gaugesPath: {
      organ: "proof",
      posture: "proof",
      phase: "prove",
      entry: "gauges"
    },

    seanPath: {
      organ: "sean",
      posture: "sean",
      phase: "reflect",
      entry: "meetSean"
    },

    underdogPath: {
      organ: "sean",
      posture: "sean",
      phase: "deepen",
      entry: "thisUnderdog"
    },

    productsPath: {
      organ: "products",
      posture: "products",
      phase: "route",
      entry: "products"
    },

    bookPath: {
      organ: "book",
      posture: "book",
      phase: "deepen",
      entry: "book"
    },

    nineSummitsPath: {
      organ: "book",
      posture: "book",
      phase: "deepen",
      entry: "nineSummits"
    },

    hearthPath: {
      organ: "hearth",
      posture: "hearth",
      phase: "ground",
      entry: "hearth"
    },

    audraliaPath: {
      organ: "audralia",
      posture: "audralia",
      phase: "deepen",
      entry: "audralia"
    },

    frontierPath: {
      organ: "frontier",
      posture: "frontier",
      phase: "deepen",
      entry: "frontier"
    },

    charactersPath: {
      organ: "characters",
      posture: "characters",
      phase: "personalize",
      entry: "characters"
    },

    futureProfilePath: {
      organ: "futureProfile",
      posture: "futureProfile",
      phase: "reveal",
      entry: "futureProfile"
    },

    mirrorMePath: {
      organ: "mirrorMe",
      posture: "mirrorMe",
      phase: "reveal",
      entry: "mirrorMe"
    },

    recenterNode: {
      organ: "return",
      posture: "orientation",
      phase: "return",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      recenterBrain: true,
      beats: [
        "I may have taken you too deep.",
        "Let me bring this back to one clear doorway."
      ],
      options: [
        routeOption("Give me the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the Diagnostic.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the world side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "interactiveNarrative"]
    },

    loopRecovery: {
      organ: "return",
      posture: "orientation",
      phase: "return",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "You keep circling this route.",
        "That usually means you are not looking for more explanation. You are deciding which door deserves trust."
      ],
      options: [
        routeOption("Test the claims.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Cross to the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
        option("Re-center me.", "recenterNode", "control", { signal: "lost" })
      ],
      handoffs: ["laws", "coherenceDiagnostic", "showroom"]
    },

    cleanDoor: {
      dynamic: true
    },

    returnFork: {
      organ: "return",
      posture: "arrival",
      phase: "return",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Then we return to the clean fork.",
        "Public website, or world side?"
      ],
      options: [
        option("Public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("World side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
        option("I’m skeptical.", "skepticPlain", "calibration", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question", scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: []
    },

    restartFork: {
      organ: "restart",
      posture: "arrival",
      phase: "reset",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      resetAll: true,
      beats: [
        "Clean reset.",
        "You are back at the doorway.",
        "Public website, or world side?"
      ],
      options: [
        option("Public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("World side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
        option("I’m skeptical.", "skepticPlain", "calibration", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Just tell me where to start.", "whereToStart", "conversation", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
        option("Ask me one question first.", "askFirst", "conversation", { signal: "question", scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: []
    }
  };

  var HANDOFF_NODE = {
    handoffCompass: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "compass",
      entry: "compass",
      beats: [
        "Open the Compass.",
        "That is the cleanest public orientation point."
      ],
      options: [
        option("Show me another website route.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffSiteGuide: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "siteGuide",
      entry: "siteGuide",
      beats: [
        "Open the Site Guide.",
        "That is the public map of the pages and deeper doors."
      ],
      options: [
        option("Show me proof.", "proofPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the threshold.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffShowroom: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "showroom",
      entry: "showroomThreshold",
      beats: [
        "Open the Showroom.",
        "That is the threshold where the public site begins pointing toward Mirrorland."
      ],
      options: [
        routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the public map.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Visit Hearth.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ]
    },

    handoffDiagnostic: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "coherenceDiagnostic",
      entry: "diagnostic",
      beats: [
        "Open the Diagnostic.",
        "That is the cleanest public mirror path."
      ],
      options: [
        option("Show me proof instead.", "proofPath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffLaws: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "laws",
      entry: "laws",
      beats: [
        "Open the Laws.",
        "That is where the public structure makes its claims testable."
      ],
      options: [
        routeOption("Open Gauges too.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffGauges: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "gauges",
      entry: "gauges",
      beats: [
        "Open Gauges.",
        "That is the technical status route."
      ],
      options: [
        routeOption("Read the Laws too.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to proof path.", "proofPath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffProducts: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "products",
      entry: "products",
      beats: [
        "Open Products.",
        "That is where the message becomes usable."
      ],
      options: [
        option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Tell me who Sean is.", "seanPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffSean: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "meetSean",
      entry: "meetSean",
      beats: [
        "Open Meet Sean.",
        "That is where the voice becomes a person."
      ],
      options: [
        option("Show me This Underdog too.", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me Products.", "productsPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffUnderdog: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "aboutUnderdog",
      entry: "thisUnderdog",
      beats: [
        "Open About This Underdog.",
        "That is where the inner voice without language comes forward."
      ],
      options: [
        option("Meet Sean instead.", "seanPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffBook: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "book",
      entry: "book",
      beats: [
        "Open The Nine Summits of Love.",
        "That is the book path."
      ],
      options: [
        routeOption("Open Nine Summits too.", "handoffNineSummits", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to Products.", "productsPath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffNineSummits: {
      posture: "handoff",
      scopeLane: SCOPE_OBJECTIVE,
      targetRoute: "nineSummits",
      entry: "nineSummits",
      beats: [
        "Open Nine Summits.",
        "That is the wider human-development path."
      ],
      options: [
        routeOption("Open the book too.", "handoffBook", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to Products.", "productsPath", "back", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffCharacters: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "characters",
      entry: "characters",
      beats: [
        "Open Characters.",
        "That is where the world stops feeling empty."
      ],
      options: [
        routeOption("Enter the Interactive Narrative too.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to world path.", "worldPath", "back", { scopeLane: SCOPE_NARRATIVE })
      ]
    },

    handoffWorld: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "interactiveNarrative",
      entry: "interactiveNarrative",
      beats: [
        "Enter the Interactive Narrative.",
        "That is the route where the world side begins to open."
      ],
      options: [
        option("Visit Hearth first.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffHearth: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "hearth",
      entry: "hearth",
      beats: [
        "Return to Hearth.",
        "That is the room closest to where I speak from."
      ],
      options: [
        option("Enter the Interactive Narrative.", "worldGatePath", "route", { scopeLane: SCOPE_NARRATIVE }),
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffAudralia: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "audralia",
      entry: "audralia",
      beats: [
        "Visit Audralia.",
        "That is where the world begins widening outward."
      ],
      options: [
        option("Explore Frontier.", "frontierPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to Hearth.", "hearthPath", "back", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to the world gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE })
      ]
    },

    handoffFrontier: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "frontier",
      entry: "frontier",
      beats: [
        "Explore Frontier.",
        "That is the outward-facing discovery route."
      ],
      options: [
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to the world gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    }
  };

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
    return indexOfValue(POSTURES, posture) * 16 + indexOfValue(PHASES, phase);
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

  function sanitizePublicText(text) {
    var clean = String(text || "");

    FORBIDDEN_PUBLIC_LANGUAGE.forEach(function eachRule(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    return clean;
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

  function normalizeNode(id) {
    if (id === "arrival") return "intro";
    return id || "intro";
  }

  function getRegistryEntry(entryId) {
    var alias = ENTRY_ALIASES[entryId] || entryId;
    var parts = String(alias || "").split(".");
    var scope = parts[0];
    var key = parts[1];

    if (scope === "objective") {
      return OBJECTIVE_REALITY_REGISTRY[key] || null;
    }

    if (scope === "narrative") {
      return NARRATIVE_IMMERSION_REGISTRY[key] || null;
    }

    return OBJECTIVE_REALITY_REGISTRY[entryId] ||
      NARRATIVE_IMMERSION_REGISTRY[entryId] ||
      null;
  }

  function getEntryOptions(entryId) {
    return (ENTRY_OPTIONS[entryId] || []).slice();
  }

  function getEntryHandoffs(entry) {
    if (!entry || !entry.routes) return [];
    return entry.routes.slice();
  }

  function resetAllState() {
    PATHS.forEach(function eachPath(path) {
      state.pathDepth[path] = 0;
    });

    state.currentScopeLane = SCOPE_OBJECTIVE;
    state.currentVoiceMode = MODE_OBJECTIVE;
    state.currentEntry = null;

    state.brain.visitorPosture = "arrival";
    state.brain.movement = "start";
    state.brain.loopCount = 0;
    state.brain.progressCount = 0;
    state.brain.digressionCount = 0;
    state.brain.lostSignal = false;
    state.brain.routeReadiness = 0;
    state.brain.inferredConclusion = "arriving at the doorway";
    state.brain.recenterAvailable = false;

    state.brain.scopeLane = SCOPE_OBJECTIVE;
    state.brain.voiceMode = MODE_OBJECTIVE;
    state.brain.scopeShiftCount = 0;
    state.brain.objectiveCount = 0;
    state.brain.narrativeCount = 0;
    state.brain.thresholdCount = 0;

    state.brain.questionReadiness = 0;
    state.brain.lastQuestionKey = "";
    state.brain.lastPath = null;
    state.brain.lastScopeLane = SCOPE_OBJECTIVE;
    state.brain.lastTarget = null;
    state.brain.lastVisitorLabel = "";
    state.brain.lastEntry = null;
    state.brain.pathTrail = [];
    state.brain.scopeTrail = [];
    state.brain.conclusionTrail = [];

    state.curiosityLevel = 1;
    state.skepticismLevel = 0;
    state.routePressure = 0;
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

  function isNarrativeTarget(target) {
    return target === "worldPath" ||
      target === "worldGatePath" ||
      target === "hearthPath" ||
      target === "audraliaPath" ||
      target === "frontierPath" ||
      target === "charactersPath" ||
      target === "mirrorMePath" ||
      target === "handoffShowroom" ||
      target === "handoffWorld" ||
      target === "handoffHearth" ||
      target === "handoffAudralia" ||
      target === "handoffFrontier" ||
      target === "handoffCharacters";
  }

  function chooseScopeLane(base, choice) {
    if (choice && choice.scopeLane) return choice.scopeLane;
    if (base && base.scopeLane) return base.scopeLane;
    if (base && base.defaultScopeLane) return base.defaultScopeLane;
    if (choice && isNarrativeTarget(choice.target)) return SCOPE_NARRATIVE;
    if (base && base.pathKey === "world") return SCOPE_NARRATIVE;
    return SCOPE_OBJECTIVE;
  }

  function determineVoiceMode(pathKey, depth, scopeLane, base, entry) {
    if (base && base.voiceMode) return base.voiceMode;
    if (entry && entry.voiceMode) return entry.voiceMode;
    if (scopeLane === SCOPE_OBJECTIVE) return MODE_OBJECTIVE;
    if (pathKey === "world" && depth <= 2) return MODE_THRESHOLD;
    return MODE_IMMERSION;
  }

  function getChamberExpression(pathKey, depth, scopeLane) {
    var pathBlock = CHAMBER[pathKey] || {};
    var lane = pathBlock[scopeLane] || pathBlock.objective || [];
    var index = clamp((depth || 1) - 1, 0, lane.length - 1);

    return lane[index] || null;
  }

  function mergeNode(base, extra) {
    var merged = {};
    var key;

    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) {
        merged[key] = base[key];
      }
    }

    for (key in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, key)) {
        merged[key] = extra[key];
      }
    }

    return merged;
  }

  function buildNodeFromEntry(base, entryId, depth, scopeLane, voiceMode) {
    var entry = getRegistryEntry(entryId);
    var beats = [];
    var entryOptions = getEntryOptions(entryId);
    var handoffs = [];

    if (entry) {
      beats = (entry.answer || []).slice();
      handoffs = getEntryHandoffs(entry);
    }

    return mergeNode(base, {
      entry: entryId,
      entryData: entry,
      beats: base.beats || beats,
      options: base.options || entryOptions,
      question: base.question || (entry ? entry.question : ""),
      questionOptions: base.questionOptions || (entry ? entry.questionOptions : []),
      handoffs: base.handoffs || handoffs,
      pathDepth: depth || base.pathDepth || 0,
      scopeLane: scopeLane || base.scopeLane || (entry ? entry.scopeLane : SCOPE_OBJECTIVE),
      voiceMode: voiceMode || base.voiceMode || (entry ? entry.voiceMode : MODE_OBJECTIVE)
    });
  }

  function getCleanDoorNode() {
    var path = state.currentPath || state.brain.lastPath;
    var scopeLane = state.currentScopeLane || state.brain.scopeLane;
    var conclusion = state.brain.inferredConclusion || "choosing the next route";

    if (scopeLane === SCOPE_NARRATIVE || path === "world") {
      return {
        organ: "worldGate",
        posture: "world",
        phase: "route",
        scopeLane: SCOPE_NARRATIVE,
        voiceMode: MODE_THRESHOLD,
        entry: "showroomThreshold",
        beats: [
          "The cleanest world-side route is the threshold.",
          "It sounds like you are " + conclusion + "."
        ],
        options: [
          routeOption("Open the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
          routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
          routeOption("Meet the Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["showroom", "interactiveNarrative", "characters"]
      };
    }

    if (path === "skeptic") {
      return {
        organ: "proof",
        posture: "proof",
        phase: "route",
        scopeLane: SCOPE_OBJECTIVE,
        voiceMode: MODE_OBJECTIVE,
        entry: "laws",
        beats: [
          "The cleanest public route is proof.",
          "It sounds like you are " + conclusion + "."
        ],
        options: [
          routeOption("Read the Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
          routeOption("Open Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
          routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
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
        scopeLane: SCOPE_OBJECTIVE,
        voiceMode: MODE_OBJECTIVE,
        entry: "diagnostic",
        beats: [
          "The cleanest public route is the Diagnostic.",
          "It sounds like you are " + conclusion + "."
        ],
        options: [
          routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
          option("Show me Future Profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
          routeOption("Read the Laws first.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
          option("Re-center me.", "recenterNode", "control", { signal: "lost" })
        ],
        handoffs: ["coherenceDiagnostic", "laws"]
      };
    }

    return {
      organ: "compass",
      posture: "orientation",
      phase: "route",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      entry: "compass",
      beats: [
        "The cleanest public route is orientation.",
        "Diamond Gate Bridge should not make you chase the structure."
      ],
      options: [
        routeOption("Start at the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the world threshold.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["compass", "siteGuide", "coherenceDiagnostic"]
    };
  }

  function getNode(id, shouldAdvanceDepth, choice) {
    var nodeId = normalizeNode(id);
    var base;
    var depth;
    var expression;
    var scopeLane;
    var voiceMode;
    var entry;
    var entryId;

    if (nodeId === "cleanDoor") return getCleanDoorNode();

    if (NODE[nodeId]) {
      base = NODE[nodeId];

      if (base.resetAll) resetAllState();

      if (base.recenterBrain) {
        state.brain.lostSignal = false;
        state.brain.recenterAvailable = false;
        state.brain.digressionCount = 0;
        state.brain.loopCount = 0;
        state.brain.questionReadiness = 0;
      }

      if (base.pathKey) {
        depth = shouldAdvanceDepth === false
          ? Math.max(getPathDepth(base.pathKey), 1)
          : advancePathDepth(base.pathKey);

        scopeLane = chooseScopeLane(base, choice);
        expression = getChamberExpression(base.pathKey, depth, scopeLane);
        entryId = expression && expression.entry ? expression.entry : base.entry;
        entry = getRegistryEntry(entryId);
        voiceMode = determineVoiceMode(base.pathKey, depth, scopeLane, base, entry);

        return buildNodeFromEntry(
          mergeNode(base, {
            phase: expression && expression.forceRoute ? "route" : base.phase
          }),
          entryId,
          depth,
          scopeLane,
          voiceMode
        );
      }

      entryId = base.entry;
      entry = getRegistryEntry(entryId);
      scopeLane = chooseScopeLane(base, choice);
      voiceMode = determineVoiceMode(null, base.pathDepth || 0, scopeLane, base, entry);

      if (entryId) {
        return buildNodeFromEntry(base, entryId, base.pathDepth || 0, scopeLane, voiceMode);
      }

      return mergeNode(base, {
        scopeLane: scopeLane,
        voiceMode: voiceMode,
        pathDepth: base.pathDepth || 0
      });
    }

    if (HANDOFF_NODE[nodeId]) {
      base = HANDOFF_NODE[nodeId];
      entry = getRegistryEntry(base.entry);
      scopeLane = chooseScopeLane(base, choice);
      voiceMode = determineVoiceMode(null, 0, scopeLane, base, entry);

      return mergeNode(base, {
        organ: "routeHandoff",
        phase: "handoff",
        pathKey: null,
        pathDepth: 0,
        scopeLane: scopeLane,
        voiceMode: voiceMode,
        entryData: entry,
        handoffs: [base.targetRoute]
      });
    }

    return NODE.intro;
  }

  function inferConclusion(path, depth, movement, signal, scopeLane) {
    if (signal === "lost") return "trying to get re-centered";

    if (scopeLane === SCOPE_NARRATIVE) {
      if (path === "world" && depth >= 4) return "ready to choose a world-side route";
      if (path === "world" && depth >= 3) return "distinguishing threshold, place, people, and reflection";
      if (movement === "digress") return "testing the boundary between public site and world side";
      return "moving toward the world threshold";
    }

    if (path === "skeptic") {
      if (depth >= 4) return "ready to choose a proof route";
      if (depth >= 3) return "testing whether the public structure holds";
      if (movement === "loop") return "circling trust before entry";
      return "testing the claims before entering";
    }

    if (path === "diagnostic") {
      if (depth >= 4) return "ready to choose the mirror route";
      if (depth >= 3) return "looking for the gap between identity and behavior";
      return "checking what pressure reveals";
    }

    if (path === "website") {
      if (depth >= 4) return "ready to choose a public route";
      if (depth >= 3) return "sorting the public structure into useful paths";
      return "trying to orient inside the public website";
    }

    if (signal === "practical") return "looking for use";
    if (signal === "human") return "looking for the person behind the voice";
    if (signal === "curious") return "following curiosity";
    if (signal === "self") return "looking for reflection";

    return "choosing the next route";
  }

  function inferPosture(signal, path, movement, scopeLane) {
    if (signal === "lost") return "lost";
    if (signal === "skeptic" || path === "skeptic") return "skeptical";
    if (signal === "self" || path === "diagnostic") return "self-reflective";
    if (scopeLane === SCOPE_NARRATIVE || signal === "curious" || path === "world") return "world-curious";
    if (signal === "practical") return "practical";
    if (signal === "human") return "human-context";
    if (movement === "digress") return "digressing";
    if (movement === "loop") return "looping";
    return "oriented";
  }

  function computeQuestionReadiness(node, movement, signal) {
    var readiness = 0;

    if (!node || !node.question) return 0;
    if (node.phase === "handoff") return 0;
    if (node.pathDepth >= 4) return 0;
    if (state.brain.lostSignal || signal === "lost") return 0;

    if (node.pathDepth === 2) readiness += 3;
    if (node.pathDepth === 3) readiness += 2;
    if (movement === "digress") readiness += 2;
    if (movement === "loop") readiness += 1;
    if (state.brain.routeReadiness >= 3) readiness -= 2;
    if (node.forceQuestion) readiness += 5;

    if (
      node.scopeLane === SCOPE_NARRATIVE &&
      state.brain.lastScopeLane === SCOPE_OBJECTIVE
    ) {
      readiness += 2;
    }

    return clamp(readiness, 0, 8);
  }

  function updateBrain(choice, node) {
    var brain = state.brain;
    var path = node.pathKey || null;
    var depth = node.pathDepth || 0;
    var signal = choice && choice.signal ? choice.signal : null;
    var scopeLane = node.scopeLane || SCOPE_OBJECTIVE;
    var voiceMode = node.voiceMode || MODE_OBJECTIVE;
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

    if (scopeLane !== brain.lastScopeLane) brain.scopeShiftCount += 1;

    brain.scopeTrail.push(scopeLane);
    trimTrail(brain.scopeTrail);

    if (scopeLane === SCOPE_OBJECTIVE) brain.objectiveCount += 1;
    if (scopeLane === SCOPE_NARRATIVE) brain.narrativeCount += 1;
    if (voiceMode === MODE_THRESHOLD) brain.thresholdCount += 1;

    if (movement === "progress") brain.progressCount += 1;
    if (movement === "loop") brain.loopCount += 1;
    if (movement === "digress") brain.digressionCount += 1;
    if (movement === "route") brain.routeReadiness = Math.max(0, brain.routeReadiness - 1);

    if (depth >= 3) brain.routeReadiness = Math.min(10, brain.routeReadiness + 1);
    if (depth >= 4) brain.routeReadiness = Math.min(10, brain.routeReadiness + 2);

    if (signal === "lost" || brain.digressionCount >= 3 || brain.loopCount >= 2) {
      brain.lostSignal = true;
    }

    if (brain.lostSignal || brain.routeReadiness >= 3 || depth >= 4) {
      brain.recenterAvailable = true;
    }

    conclusion = inferConclusion(path, depth, movement, signal, scopeLane);

    brain.scopeLane = scopeLane;
    brain.voiceMode = voiceMode;
    brain.visitorPosture = inferPosture(signal, path, movement, scopeLane);
    brain.movement = movement;
    brain.inferredConclusion = conclusion;
    brain.lastScopeLane = scopeLane;
    brain.lastTarget = state.currentNode;
    brain.lastVisitorLabel = choice && choice.label ? choice.label : brain.lastVisitorLabel;
    brain.lastEntry = node.entry || null;
    brain.questionReadiness = computeQuestionReadiness(node, movement, signal);
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
    if (els.status) els.status.setAttribute("data-jeeves-status", value);
    if (els.statusText) els.statusText.textContent = text || "";
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
    var seed;

    if (!els.thread) return;

    seed = query("[data-seed-message='true']", els.thread);

    if (seed) seed.remove();
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
    var cleanText = origin === "jeeves" ? sanitizePublicText(text) : String(text || "");

    if (!els.thread || !cleanText) return null;

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
      paragraph.textContent = cleanText;
    } else {
      message.textContent = cleanText;
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
    if (node.pathDepth >= 4) return false;
    if (state.brain.lostSignal) return false;

    key = state.currentNode + "::" +
      (node.pathKey || "node") + "::" +
      (node.scopeLane || SCOPE_OBJECTIVE) + "::" +
      (node.entry || "entry") + "::" +
      (node.pathDepth || 0);

    if (state.brain.lastQuestionKey === key) return false;

    if (node.forceQuestion || state.brain.questionReadiness >= 3) {
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
      list.push(option("I keep circling this route.", "loopRecovery", "control", { signal: "lost" }));
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
      list.push(option("Give me the cleanest next route.", "cleanDoor", "control"));
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
    state.currentScopeLane = node.scopeLane || SCOPE_OBJECTIVE;
    state.currentVoiceMode = node.voiceMode || MODE_OBJECTIVE;
    state.currentEntry = node.entry || null;
    state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);
    state.cycleStep = (state.cycleStep + 1) % 16;

    if (typeof node.skepticism === "number") {
      state.skepticismLevel = Math.max(state.skepticismLevel, node.skepticism);
    }

    if (
      state.currentScopeLane === SCOPE_NARRATIVE ||
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
      scopeLane: state.currentScopeLane,
      voiceMode: state.currentVoiceMode,
      entry: state.currentEntry,
      brain: {
        visitorPosture: state.brain.visitorPosture,
        movement: state.brain.movement,
        inferredConclusion: state.brain.inferredConclusion,
        routeReadiness: state.brain.routeReadiness,
        questionReadiness: state.brain.questionReadiness
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

    if (beats.length < 2 && node.entryData && node.entryData.answer) {
      node.entryData.answer.forEach(function eachAnswer(beat) {
        if (beats.indexOf(beat) === -1) beats.push(beat);
      });
    }

    if (questionAsked && node.question) {
      beats.push(node.question);
    }

    return beats;
  }

  function clearTapAdvance() {
    if (state.tapAdvance.timer) {
      window.clearTimeout(state.tapAdvance.timer);
    }

    state.tapAdvance.active = false;
    state.tapAdvance.resolver = null;
    state.tapAdvance.timer = null;
    state.tapAdvance.phase = "";
  }

  function requestTapAdvance() {
    var resolver = state.tapAdvance.resolver;

    if (!state.tapAdvance.active || typeof resolver !== "function") return;

    clearTapAdvance();
    resolver("tap");
  }

  function waitSkippable(ms, phase) {
    return new Promise(function waitSkippablePromise(resolve) {
      if (!ms || ms <= 0) {
        resolve("instant");
        return;
      }

      clearTapAdvance();

      state.tapAdvance.active = true;
      state.tapAdvance.phase = phase || "wait";
      state.tapAdvance.resolver = resolve;
      state.tapAdvance.timer = window.setTimeout(function finishTimer() {
        clearTapAdvance();
        resolve("timer");
      }, ms);
    });
  }

  function waitFixed(ms) {
    return new Promise(function waitFixedPromise(resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function playBeats(beats, token) {
    var i;
    var beat;

    for (i = 0; i < beats.length; i += 1) {
      if (token !== state.runToken) return false;

      beat = beats[i];

      setTyping(true);
      await waitSkippable(getTypingDelay(beat, i), "typing");

      if (token !== state.runToken) return false;

      setTyping(false);

      addMessage("jeeves", beat, {
        emphasis: i === 0 && (
          state.currentPosture === "arrival" ||
          state.currentPosture === "skeptic"
        )
      });

      await waitSkippable(getReadDelay(beat), "reading");
    }

    if (token !== state.runToken) return false;

    await waitSkippable(PACING.optionRevealDelayMs, "options");

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
    var choice = settings && settings.choice ? settings.choice : null;

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    node = getNode(nodeId, true, choice);
    updateState(nodeId, node);
    updateBrain(choice, node);
    hideOptions();

    questionAsked = shouldAskQuestion(node);
    beats = compileBeats(node, questionAsked);
    finalOptions = addAdaptiveOptions(node.options || [], node, questionAsked);
    initialDelay = settings && settings.fast ? PACING.firstMessageDelayMs : 420;

    await waitFixed(initialDelay);

    if (token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    completed = await playBeats(beats, token);

    if (!completed || token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    renderOptions(finalOptions);
    renderHandoffs(node.handoffs || []);

    state.busy = false;
    clearTapAdvance();
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
      return { target: "recenterNode", signal: "lost", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("underdog") !== -1 ||
      value.indexOf("inner voice") !== -1 ||
      value.indexOf("voice") !== -1
    ) {
      return { target: "underdogPath", signal: "human", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("hearth") !== -1 ||
      value.indexOf("audralia") !== -1 ||
      value.indexOf("portal") !== -1 ||
      value.indexOf("world") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("character") !== -1 ||
      value.indexOf("people") !== -1
    ) {
      return { target: "worldPath", signal: "curious", scopeLane: SCOPE_NARRATIVE };
    }

    if (
      value.indexOf("sean") !== -1 ||
      value.indexOf("founder") !== -1 ||
      value.indexOf("person") !== -1 ||
      value.indexOf("human") !== -1
    ) {
      return { target: "seanPath", signal: "human", scopeLane: SCOPE_OBJECTIVE };
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
      return { target: "proofPath", signal: "skeptic", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("diagnostic") !== -1 ||
      value.indexOf("coherence") !== -1 ||
      value.indexOf("fit") !== -1 ||
      value.indexOf("archetype") !== -1 ||
      value.indexOf("self") !== -1 ||
      value.indexOf("reflect") !== -1
    ) {
      return { target: "diagnosticPath", signal: "self", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("product") !== -1 ||
      value.indexOf("tool") !== -1 ||
      value.indexOf("use") !== -1 ||
      value.indexOf("practical") !== -1
    ) {
      return { target: "productsPath", signal: "practical", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("book") !== -1 ||
      value.indexOf("summit") !== -1 ||
      value.indexOf("love") !== -1
    ) {
      return { target: "bookPath", signal: "book", scopeLane: SCOPE_OBJECTIVE };
    }

    if (
      value.indexOf("start") !== -1 ||
      value.indexOf("where") !== -1 ||
      value.indexOf("begin") !== -1
    ) {
      return { target: "whereToStart", signal: "lost", scopeLane: SCOPE_OBJECTIVE };
    }

    return { target: "askFirst", signal: "question", scopeLane: SCOPE_OBJECTIVE };
  }

  function ask(text) {
    var result = classifyText(text);

    if (state.busy) return;

    addMessage("visitor", text);
    runNode(result.target, {
      choice: {
        label: text,
        target: result.target,
        signal: result.signal,
        scopeLane: result.scopeLane
      }
    });
  }

  function isInteractiveTarget(target) {
    if (!target || !target.closest) return false;

    return Boolean(target.closest(
      "button,a,input,textarea,select,[role='button'],.jeeves-option,[data-no-tap-advance='true']"
    ));
  }

  function bindTapAdvance() {
    if (state.tapAdvance.bound) return;

    state.tapAdvance.bound = true;

    document.addEventListener("pointerdown", function onPointerDown(event) {
      if (isInteractiveTarget(event.target)) return;

      state.tapAdvance.pointerId = event.pointerId;
      state.tapAdvance.startX = event.clientX;
      state.tapAdvance.startY = event.clientY;
      state.tapAdvance.startTime = Date.now();
    }, { passive: true });

    document.addEventListener("pointerup", function onPointerUp(event) {
      var dx;
      var dy;
      var distance;
      var duration;

      if (isInteractiveTarget(event.target)) return;
      if (state.tapAdvance.pointerId !== event.pointerId) return;

      dx = event.clientX - state.tapAdvance.startX;
      dy = event.clientY - state.tapAdvance.startY;
      distance = Math.sqrt(dx * dx + dy * dy);
      duration = Date.now() - state.tapAdvance.startTime;

      state.tapAdvance.pointerId = null;

      if (
        distance <= PACING.tapMaxDistancePx &&
        duration <= PACING.tapMaxDurationMs
      ) {
        requestTapAdvance();
      }
    }, { passive: true });

    document.addEventListener("pointercancel", function onPointerCancel() {
      state.tapAdvance.pointerId = null;
    }, { passive: true });
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
      scopes: [SCOPE_OBJECTIVE, SCOPE_NARRATIVE],
      modes: [MODE_OBJECTIVE, MODE_THRESHOLD, MODE_IMMERSION],
      objectiveRegistry: OBJECTIVE_REALITY_REGISTRY,
      narrativeRegistry: NARRATIVE_IMMERSION_REGISTRY,
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      tapAdvance: requestTapAdvance,
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
        return safeClone(getNode(id, false, null));
      },
      getRegistryEntry: function getRegistryEntryPublic(id) {
        return safeClone(getRegistryEntry(id));
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
    bindTapAdvance();
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
