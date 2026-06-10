// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_4X4X2_SCOPE_GOVERNED_PROGRESSION_ENGINE_TNT_v12
// Full-file replacement.
// Owns: collapsed Jeeves house intelligence, deterministic 256-state conversation scope, 20 internal conversational organs, 4x4x2 scope-governed expression chamber, individual progression engine, figure-eight traversal, reader-paced cadence, guided route handoffs, current-session memory.
// Does not own: HTML shell, CSS styling, backend, persistent storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeeves4x4x2ScopeGovernedProgressionEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_4X4X2_SCOPE_GOVERNED_PROGRESSION_ENGINE_TNT_v12";
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

  var MAX_HISTORY = 42;
  var MAX_PATH_DEPTH = 4;
  var MAX_TRAIL = 8;

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";

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
    currentScopeLane: SCOPE_OBJECTIVE,
    currentVoiceMode: MODE_OBJECTIVE,

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
      pathTrail: [],
      scopeTrail: [],
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
    website: {
      objective: [
        {
          phase: "ground",
          beats: [
            "The website is the public side of Diamond Gate Bridge.",
            "It gives you routes before it gives you depth."
          ],
          options: [
            option("Orient me first.", "compassPath", "topic", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
            option("Show me proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            option("Show me practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
            option("Who is behind this?", "seanPath", "topic", { signal: "human", scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["compass", "siteGuide"]
        },
        {
          phase: "reflect",
          beats: [
            "You do not need the full structure yet.",
            "You need the route that matches why you arrived."
          ],
          question: "What brought you to the public side first: orientation, proof, use, or the person behind it?",
          questionOptions: [
            option("Orientation.", "compassPath", "topic", { signal: "lost", scopeLane: SCOPE_OBJECTIVE }),
            option("Proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            option("Use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
            option("The person behind it.", "seanPath", "topic", { signal: "human", scopeLane: SCOPE_OBJECTIVE })
          ],
          options: [
            option("Keep guiding me through the website.", "websitePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Show me the narrative side instead.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
            routeOption("Take me to the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["compass", "coherenceDiagnostic", "products"]
        },
        {
          phase: "reveal",
          beats: [
            "The public structure has five useful lanes.",
            "Compass orients. Laws test claims. Products make the message usable. The Diagnostic reflects the visitor. Meet Sean anchors the human source."
          ],
          options: [
            routeOption("Orientation: Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Proof: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Use: Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Self: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Human source: Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
        },
        {
          phase: "route",
          beats: [
            "You have stayed with the public structure long enough.",
            "Choose the route now: orientation, proof, use, self-reflection, or the person behind it."
          ],
          options: [
            routeOption("Orientation: Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Proof: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Use: Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Self: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Person: Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["compass", "laws", "products", "coherenceDiagnostic", "meetSean"]
        }
      ],

      narrative: [
        {
          phase: "ground",
          beats: [
            "You are still on the public side.",
            "The narrative rooms are nearby, but this route has not crossed the threshold yet."
          ],
          options: [
            option("Stay with the website.", "websitePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Take me to the threshold.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
            routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["siteGuide", "showroom"]
        },
        {
          phase: "reflect",
          beats: [
            "This is the place where the site can still explain itself plainly.",
            "If you cross from here, the language changes because the function changes."
          ],
          question: "Do you want the public map, or do you want the door that leads past the map?",
          questionOptions: [
            option("Public map.", "websitePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Door past the map.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
          ],
          options: [
            routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Open the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            option("Re-center me.", "recenterNode", "control", { signal: "lost" })
          ],
          handoffs: ["siteGuide", "showroom"]
        },
        {
          phase: "reveal",
          beats: [
            "The public rooms and Mirrorland doors are not the same kind of thing.",
            "One explains the structure. The other begins the narrative construct."
          ],
          options: [
            routeOption("Public map: Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("World gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["siteGuide", "showroom", "interactiveNarrative"]
        },
        {
          phase: "route",
          beats: [
            "Now choose the scope.",
            "Stay with the public structure, or cross toward the narrative world."
          ],
          options: [
            routeOption("Stay public: Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Cross threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Enter narrative: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["siteGuide", "showroom", "interactiveNarrative"]
        }
      ]
    },

    skeptic: {
      objective: [
        {
          phase: "clarify",
          beats: [
            "Good. Skepticism belongs on the public side first.",
            "Diamond Gate Bridge should not be trusted because it sounds interesting."
          ],
          options: [
            option("Then show me what holds it up.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            option("Show me the Diagnostic.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
            option("Show me practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
            option("I’ll look at the narrative side anyway.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "coherenceDiagnostic"]
        },
        {
          phase: "reflect",
          beats: [
            "You are right to test it before entering deeper.",
            "If the structure cannot hold plainly, the narrative side has no business carrying weight."
          ],
          question: "What are you testing first: the claims, the system, or the person behind it?",
          questionOptions: [
            routeOption("Claims: Laws.", "handoffLaws", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            routeOption("System: Gauges.", "handoffGauges", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Person: Meet Sean.", "handoffSean", { signal: "human", scopeLane: SCOPE_OBJECTIVE })
          ],
          options: [
            option("Keep me in proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
            option("Test me instead.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
            option("Re-center me.", "recenterNode", "control", { signal: "lost" })
          ],
          handoffs: ["laws", "gauges", "coherenceDiagnostic"]
        },
        {
          phase: "prove",
          beats: [
            "The proof lane has three public doors.",
            "Laws define what can be claimed. Gauges point toward structural status. The Diagnostic tests the visitor’s own posture."
          ],
          options: [
            routeOption("Public proof: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Technical status: Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Personal test: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Now show me the narrative side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "gauges", "coherenceDiagnostic"]
        },
        {
          phase: "route",
          beats: [
            "You have stayed in the proof lane.",
            "Choose the test now before the conversation drifts."
          ],
          options: [
            routeOption("Read the Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Open Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Return to the doorway.", "returnFork", "back")
          ],
          handoffs: ["laws", "gauges", "coherenceDiagnostic"]
        }
      ],

      narrative: [
        {
          phase: "clarify",
          beats: [
            "If you are skeptical of the narrative side, stay near the threshold.",
            "Do not let the world language outrun the public structure."
          ],
          options: [
            routeOption("Test claims first: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("See the threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            option("Take me to the world gate.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "showroom"]
        },
        {
          phase: "reflect",
          beats: [
            "The narrative construct is not supposed to erase the real site.",
            "It should become visible only after the public structure is clear enough to support it."
          ],
          question: "Do you want to test the foundation, or inspect the threshold?",
          questionOptions: [
            routeOption("Foundation: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
          ],
          options: [
            option("Keep me in proof.", "proofPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Move toward the world.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "showroom"]
        },
        {
          phase: "prove",
          beats: [
            "There are two tests here.",
            "One tests the public claim. The other tests whether the crossing into Mirrorland is earned."
          ],
          options: [
            routeOption("Test the claim: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Check status: Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Inspect threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "gauges", "showroom"]
        },
        {
          phase: "route",
          beats: [
            "Choose the scope of your skepticism.",
            "Public proof belongs in Laws and Gauges. Narrative threshold belongs at the Showroom."
          ],
          options: [
            routeOption("Public proof: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Technical status: Gauges.", "handoffGauges", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Narrative threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["laws", "gauges", "showroom"]
        }
      ]
    },

    diagnostic: {
      objective: [
        {
          phase: "personalize",
          beats: [
            "The Diagnostic is the self-reflection lane.",
            "It is not here to decorate the website with a label."
          ],
          options: [
            option("Then what does it do?", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Show me proof instead.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
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
          question: "Do you want to test what you claim, what you choose, or the gap between them?",
          questionOptions: [
            option("What I claim.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
            option("What I choose.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
            option("The gap.", "futureProfilePath", "topic", { signal: "profile", scopeLane: SCOPE_OBJECTIVE })
          ],
          options: [
            routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Show me the future profile path.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Show me Laws instead.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["coherenceDiagnostic", "laws"]
        },
        {
          phase: "reveal",
          beats: [
            "The Diagnostic compares claimed coherence against scenario choices.",
            "That is where the visitor begins to see the distance between identity and behavior."
          ],
          options: [
            routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Explain the future profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Read the Laws first.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["coherenceDiagnostic", "laws"]
        },
        {
          phase: "route",
          beats: [
            "You have stayed with the mirror lane long enough.",
            "Choose whether to test yourself now, follow the future profile path, or return to public proof."
          ],
          options: [
            routeOption("Test myself: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Profile path: Future Profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Narrative reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Proof path: Laws.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["coherenceDiagnostic", "laws"]
        }
      ],

      narrative: [
        {
          phase: "personalize",
          beats: [
            "The mirror has a public side and a narrative side.",
            "On the public side, it tests response. On the narrative side, it begins to look back."
          ],
          options: [
            routeOption("Public test: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Narrative reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            option("Show me the world gate.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
        },
        {
          phase: "reflect",
          beats: [
            "Mirror Me should not appear before the visitor understands the public mirror.",
            "Otherwise reflection becomes theater instead of consequence."
          ],
          question: "Do you want the public test first, or the narrative reflection?",
          questionOptions: [
            routeOption("Public test: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Narrative reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          options: [
            option("Keep me in the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Move toward Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
        },
        {
          phase: "reveal",
          beats: [
            "The objective lane asks what you choose under pressure.",
            "The narrative lane asks what kind of room could answer that choice back."
          ],
          options: [
            routeOption("Objective: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Narrative: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("World gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
        },
        {
          phase: "route",
          beats: [
            "Choose the mirror lane now.",
            "Public test, future profile, or narrative reflection."
          ],
          options: [
            routeOption("Public test: Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Future profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
            option("Narrative reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
        }
      ]
    },

    world: {
      objective: [
        {
          phase: "reveal",
          beats: [
            "The narrative side includes Mirrorland, Hearth, Audralia, characters, and interactive entry points.",
            "That is different from the public website structure."
          ],
          options: [
            routeOption("Showroom threshold.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            option("Explain Hearth.", "hearthPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            option("Stay objective.", "websitePath", "topic", { scopeLane: SCOPE_OBJECTIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth"]
        },
        {
          phase: "reflect",
          beats: [
            "You are near the crossing now.",
            "I can describe the narrative construct objectively, or I can let the route become more immersive after you choose it."
          ],
          question: "Do you want the map of the narrative side, or the first threshold into it?",
          questionOptions: [
            option("Map it objectively.", "worldPath", "conversation", { scopeLane: SCOPE_OBJECTIVE }),
            routeOption("Take me to the threshold.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE })
          ],
          options: [
            routeOption("Open the Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            option("Re-center me.", "recenterNode", "control", { signal: "lost" })
          ],
          handoffs: ["showroom", "interactiveNarrative"]
        },
        {
          phase: "deepen",
          beats: [
            "Objectively, the narrative lane has a threshold, a world gate, house-side rooms, outward world lanes, characters, and future reflection paths.",
            "The right choice depends on whether you want entry, place, people, or reflection."
          ],
          options: [
            routeOption("Entry: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("World gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Place: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("People: Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
            option("Reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth", "characters"]
        },
        {
          phase: "route",
          beats: [
            "Choose the narrative route now.",
            "Threshold, world gate, place, people, or reflection."
          ],
          options: [
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Place: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("People: Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
            option("Reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth", "characters"]
        }
      ],

      narrative: [
        {
          phase: "reveal",
          beats: [
            "You are near the world door.",
            "I will not make the room theatrical before you cross it."
          ],
          options: [
            routeOption("Open the threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Enter the Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            option("Take me to Hearth.", "hearthPath", "topic", { signal: "house", scopeLane: SCOPE_NARRATIVE }),
            option("Let me meet the people.", "charactersPath", "topic", { signal: "characters", scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth"]
        },
        {
          phase: "reflect",
          beats: [
            "Now the site becomes a threshold.",
            "Beyond this point, I speak less like a map and more like part of the place."
          ],
          question: "Do you want the threshold, the room closest to me, the people, or the distance beyond it?",
          questionOptions: [
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            option("Closest room: Hearth.", "hearthPath", "topic", { signal: "house", scopeLane: SCOPE_NARRATIVE }),
            option("People: Characters.", "charactersPath", "topic", { signal: "characters", scopeLane: SCOPE_NARRATIVE }),
            option("Distance: Audralia.", "audraliaPath", "topic", { signal: "world", scopeLane: SCOPE_NARRATIVE })
          ],
          options: [
            routeOption("Open the world gate.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            option("Show me Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
            option("Re-center me.", "recenterNode", "control", { signal: "lost" })
          ],
          handoffs: ["showroom", "interactiveNarrative", "characters", "hearth", "audralia"]
        },
        {
          phase: "deepen",
          beats: [
            "Hearth is closest to where I speak from. Audralia is farther out.",
            "The characters make the world occupied. Mirror Me is the room that looks back."
          ],
          options: [
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("House-side: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Outward world: Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("People: Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth", "audralia", "characters"]
        },
        {
          phase: "route",
          beats: [
            "You have stayed with the narrative side long enough.",
            "Choose how it opens: threshold, gate, room, distance, people, or reflection."
          ],
          options: [
            routeOption("Threshold: Showroom.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Room: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("Distance: Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
            routeOption("People: Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
            option("Reflection: Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE })
          ],
          handoffs: ["showroom", "interactiveNarrative", "hearth", "audralia", "characters"]
        }
      ]
    }
  };

  var NODE = {
    intro: {
      organ: "arrival",
      posture: "arrival",
      phase: "receive",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Hello. I’m Jeeves.",
        "I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole structure at once.",
        "I can guide you through the public website, take you toward the narrative world, or ask one question first."
      ],
      options: [
        option("Guide me through the public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Take me toward the narrative world.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
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
        option("The narrative world.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
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
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "The Compass is the cleanest first route.",
        "It brings the public structure back into order."
      ],
      options: [
        routeOption("Take me to the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
        option("Explain the Diagnostic first.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Explain proof first.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["compass"]
    },

    whereToStart: {
      organ: "orientation",
      posture: "orientation",
      phase: "ground",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Then I’ll re-center the public doorway.",
        "Confusion wants the Compass. Doubt wants Laws. Self-reflection wants the Diagnostic. Usefulness wants Products."
      ],
      options: [
        option("Orientation.", "websitePath", "topic", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Self-reflection.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Practical use.", "productsPath", "topic", { signal: "practical", scopeLane: SCOPE_OBJECTIVE }),
        option("Narrative world.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
    },

    seanPath: {
      organ: "sean",
      posture: "sean",
      phase: "reflect",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Meet Sean is the public route to the person behind the voice.",
        "That page keeps the work connected to pressure, accountability, comedy, story, speaking, and the human side of the construct."
      ],
      question: "Do you want the person, the pressure, or the public voice?",
      questionOptions: [
        routeOption("The person: Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
        option("The pressure: This Underdog.", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("The public voice: Book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      options: [
        routeOption("Meet Sean.", "handoffSean", { scopeLane: SCOPE_OBJECTIVE }),
        option("What is This Underdog?", "underdogPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the practical routes.", "productsPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to website path.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: ["meetSean", "aboutUnderdog"]
    },

    underdogPath: {
      organ: "sean",
      posture: "sean",
      phase: "deepen",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "This Underdog belongs to the public human-voice side.",
        "It carries comedy, pressure, and language without turning the project into only architecture."
      ],
      options: [
        routeOption("Open About This Underdog.", "handoffUnderdog", { scopeLane: SCOPE_OBJECTIVE }),
        option("Meet Sean instead.", "seanPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["aboutUnderdog", "meetSean"]
    },

    productsPath: {
      organ: "products",
      posture: "products",
      phase: "route",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Products are where the message becomes usable.",
        "That route should stay practical."
      ],
      question: "Do you want something practical, personal, or book-shaped?",
      questionOptions: [
        routeOption("Practical: Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
        option("Personal: Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Book-shaped: Nine Summits.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      options: [
        routeOption("Open Products.", "handoffProducts", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the book path.", "bookPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Tell me who Sean is.", "seanPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to website guide.", "websitePath", "back", { scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: ["products", "book", "nineSummits"]
    },

    bookPath: {
      organ: "book",
      posture: "book",
      phase: "deepen",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "The Nine Summits route carries the human-development side of the work.",
        "That is public structure, not Mirrorland immersion."
      ],
      options: [
        routeOption("Open the book.", "handoffBook", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Open Nine Summits.", "handoffNineSummits", { scopeLane: SCOPE_OBJECTIVE }),
        option("Tell me about Sean.", "seanPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Back to Products.", "productsPath", "back", { scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: ["book", "nineSummits"]
    },

    hearthPath: {
      organ: "hearth",
      posture: "hearth",
      phase: "ground",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      beats: [
        "Hearth is the room closest to where I speak from.",
        "If the narrative side feels too wide, start here."
      ],
      question: "Do you want the room, the gate, or the world beyond the room?",
      questionOptions: [
        routeOption("The room: Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("The gate: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("The world beyond it: Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ],
      options: [
        routeOption("Return to Hearth.", "handoffHearth", { scopeLane: SCOPE_NARRATIVE }),
        option("Enter the world gate.", "worldGatePath", "route", { scopeLane: SCOPE_NARRATIVE }),
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Meet the Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["hearth", "interactiveNarrative", "audralia"]
    },

    audraliaPath: {
      organ: "audralia",
      posture: "audralia",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      beats: [
        "Audralia is farther out.",
        "You feel the narrative construct widen there."
      ],
      options: [
        routeOption("Visit Audralia.", "handoffAudralia", { scopeLane: SCOPE_NARRATIVE }),
        option("Explore Frontier.", "frontierPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to Hearth.", "hearthPath", "back", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to the world gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["audralia", "frontier", "hearth"]
    },

    frontierPath: {
      organ: "frontier",
      posture: "frontier",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      beats: [
        "Frontier is the outward edge of the narrative construct.",
        "It is not where the public site begins. It is where the world starts pointing beyond itself."
      ],
      options: [
        routeOption("Explore Frontier.", "handoffFrontier", { scopeLane: SCOPE_NARRATIVE }),
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the world gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ],
      handoffs: ["frontier", "audralia", "interactiveNarrative"]
    },

    charactersPath: {
      organ: "characters",
      posture: "characters",
      phase: "personalize",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      beats: [
        "The characters belong beyond the public map.",
        "Some of them are already moving behind the narrative doors."
      ],
      question: "Do you want to meet them as people, follow them into the story, or keep them in the distance for now?",
      questionOptions: [
        routeOption("Meet them: Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
        routeOption("Follow them: Interactive Narrative.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("Keep distance: World gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE })
      ],
      options: [
        routeOption("Meet the Characters.", "handoffCharacters", { scopeLane: SCOPE_NARRATIVE }),
        option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Enter the Interactive Narrative.", "worldGatePath", "route", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to world path.", "worldPath", "back", { scopeLane: SCOPE_NARRATIVE })
      ],
      handoffs: ["characters", "interactiveNarrative"]
    },

    futureProfilePath: {
      organ: "futureProfile",
      posture: "futureProfile",
      phase: "reveal",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "The future profile belongs to the real progression layer.",
        "It is where the Diagnostic could eventually become a returning visitor path."
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Explain Mirror Me.", "mirrorMePath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Enter the narrative path.", "worldGatePath", "route", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to the doorway.", "returnFork", "back")
      ],
      handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
    },

    mirrorMePath: {
      organ: "mirrorMe",
      posture: "mirrorMe",
      phase: "reveal",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      beats: [
        "Mirror Me belongs to the narrative reflection side.",
        "It should not replace the public Diagnostic. It answers after the mirror has become a room."
      ],
      question: "Do you want the mirror as a public test, a story device, or a future profile?",
      questionOptions: [
        option("Public test.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Story device.", "handoffWorld", { scopeLane: SCOPE_NARRATIVE }),
        option("Future profile.", "futureProfilePath", "topic", { scopeLane: SCOPE_OBJECTIVE })
      ],
      options: [
        option("Start with the Diagnostic.", "diagnosticPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Meet the Characters.", "charactersPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Enter the world gate.", "worldGatePath", "route", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to future profile.", "futureProfilePath", "back", { scopeLane: SCOPE_OBJECTIVE })
      ],
      handoffs: ["coherenceDiagnostic", "characters", "interactiveNarrative"]
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
        "Let me bring this back to one public doorway."
      ],
      options: [
        routeOption("Give me the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me proof.", "proofPath", "topic", { signal: "skeptic", scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the Diagnostic.", "diagnosticPath", "topic", { signal: "self", scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the narrative side.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE })
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
        "That usually means you are not looking for more explanation. You are deciding which scope to trust."
      ],
      options: [
        routeOption("Test the public claims.", "handoffLaws", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Cross to the narrative world.", "handoffShowroom", { scopeLane: SCOPE_NARRATIVE }),
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
        "Public website, or narrative world?"
      ],
      options: [
        option("Public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Narrative world.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
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
        "Public website, or narrative world?"
      ],
      options: [
        option("Public website.", "websitePath", "conversation", { signal: "orientation", scopeLane: SCOPE_OBJECTIVE }),
        option("Narrative world.", "worldPath", "conversation", { signal: "curious", scopeLane: SCOPE_NARRATIVE }),
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
      beats: [
        "Open the Site Guide.",
        "That is the public map of the rooms and doors."
      ],
      options: [
        option("Show me proof.", "proofPath", "topic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the narrative threshold.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE }),
        option("Return to the doorway.", "returnFork", "back")
      ]
    },

    handoffShowroom: {
      posture: "handoff",
      scopeLane: SCOPE_NARRATIVE,
      targetRoute: "showroom",
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
      beats: [
        "Open Products.",
        "That is where the public message becomes usable."
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
      beats: [
        "Open Meet Sean.",
        "That is the public route to the person behind the voice."
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
      beats: [
        "Open About This Underdog.",
        "That route carries comedy, pressure, and the public human voice."
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
      beats: [
        "Open The Nine Summits of Love.",
        "That is the book route."
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
      beats: [
        "Open Nine Summits.",
        "That is the wider development route around the book and seminar system."
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
      beats: [
        "Open Characters.",
        "That is where the narrative construct becomes inhabited."
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
      beats: [
        "Enter the Interactive Narrative.",
        "That is the route where the narrative side begins to open."
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
      beats: [
        "Return to Hearth.",
        "That is the narrative room closest to where I speak from."
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
      beats: [
        "Visit Audralia.",
        "That is where the narrative world begins widening outward."
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
      beats: [
        "Explore Frontier.",
        "That is the outward-facing narrative discovery route."
      ],
      options: [
        option("Visit Audralia.", "audraliaPath", "topic", { scopeLane: SCOPE_NARRATIVE }),
        option("Back to the world gate.", "worldGatePath", "back", { scopeLane: SCOPE_NARRATIVE }),
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
    state.brain.pathTrail = [];
    state.brain.scopeTrail = [];
    state.brain.conclusionTrail = [];

    state.currentScopeLane = SCOPE_OBJECTIVE;
    state.currentVoiceMode = MODE_OBJECTIVE;
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
    if (choice && choice.scopeLane) {
      return choice.scopeLane;
    }

    if (base && base.scopeLane) {
      return base.scopeLane;
    }

    if (base && base.defaultScopeLane) {
      return base.defaultScopeLane;
    }

    if (choice && isNarrativeTarget(choice.target)) {
      return SCOPE_NARRATIVE;
    }

    if (base && base.pathKey === "world") {
      return SCOPE_NARRATIVE;
    }

    return SCOPE_OBJECTIVE;
  }

  function determineVoiceMode(pathKey, depth, scopeLane, base) {
    if (base && base.voiceMode) {
      return base.voiceMode;
    }

    if (scopeLane === SCOPE_OBJECTIVE) {
      return MODE_OBJECTIVE;
    }

    if (pathKey === "world" && depth <= 2) {
      return MODE_THRESHOLD;
    }

    return MODE_IMMERSION;
  }

  function getChamberExpression(pathKey, depth, scopeLane) {
    var pathBlock = CHAMBER[pathKey] || {};
    var lane = pathBlock[scopeLane] || pathBlock.objective || [];
    var index = clamp((depth || 1) - 1, 0, lane.length - 1);

    return lane[index] || null;
  }

  function mergeNode(base, expression, pathKey, depth, scopeLane, voiceMode) {
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
    merged.scopeLane = scopeLane || base.scopeLane || SCOPE_OBJECTIVE;
    merged.voiceMode = voiceMode || base.voiceMode || MODE_OBJECTIVE;

    return merged;
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
        beats: [
          "The cleanest narrative route is the threshold.",
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
      beats: [
        "The cleanest public route is orientation.",
        "Diamond Gate Bridge should not make you chase the structure."
      ],
      options: [
        routeOption("Start at the Compass.", "handoffCompass", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Open the Site Guide.", "handoffSiteGuide", { scopeLane: SCOPE_OBJECTIVE }),
        routeOption("Take the Diagnostic.", "handoffDiagnostic", { scopeLane: SCOPE_OBJECTIVE }),
        option("Show me the narrative threshold.", "worldPath", "conversation", { scopeLane: SCOPE_NARRATIVE })
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
        state.brain.questionReadiness = 0;
      }

      if (base.pathKey) {
        depth = shouldAdvanceDepth === false
          ? Math.max(getPathDepth(base.pathKey), 1)
          : advancePathDepth(base.pathKey);

        scopeLane = chooseScopeLane(base, choice);
        voiceMode = determineVoiceMode(base.pathKey, depth, scopeLane, base);
        expression = getChamberExpression(base.pathKey, depth, scopeLane);

        return mergeNode(base, expression, base.pathKey, depth, scopeLane, voiceMode);
      }

      scopeLane = chooseScopeLane(base, choice);
      voiceMode = determineVoiceMode(base.pathKey, base.pathDepth || 0, scopeLane, base);
      return mergeNode(base, null, base.pathKey || null, base.pathDepth || 0, scopeLane, voiceMode);
    }

    if (HANDOFF_NODE[nodeId]) {
      base = HANDOFF_NODE[nodeId];
      scopeLane = chooseScopeLane(base, choice);
      voiceMode = determineVoiceMode(null, 0, scopeLane, base);

      return {
        organ: "routeHandoff",
        posture: base.posture || "handoff",
        phase: "handoff",
        scopeLane: scopeLane,
        voiceMode: voiceMode,
        beats: base.beats,
        options: base.options,
        handoffs: [base.targetRoute],
        pathKey: null,
        pathDepth: 0
      };
    }

    return NODE.intro;
  }

  function inferConclusion(path, depth, movement, signal, scopeLane) {
    if (signal === "lost") {
      return "trying to get re-centered";
    }

    if (scopeLane === SCOPE_NARRATIVE) {
      if (path === "world" && depth >= 4) return "ready to choose a narrative route";
      if (path === "world" && depth >= 3) return "distinguishing threshold, place, people, and reflection";
      if (movement === "digress") return "testing the boundary between public site and narrative world";
      return "moving toward the narrative threshold";
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
      if (depth >= 3) return "sorting the public structure into useful lanes";
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
    if (scopeLane === SCOPE_NARRATIVE || signal === "curious" || path === "world") return "narrative-curious";
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

    if (scopeLane !== brain.lastScopeLane) {
      brain.scopeShiftCount += 1;
    }

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
    if (node.pathDepth >= 4) return false;
    if (state.brain.lostSignal) return false;

    key = state.currentNode + "::" +
      (node.pathKey || "node") + "::" +
      (node.scopeLane || SCOPE_OBJECTIVE) + "::" +
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

    node = getNode(nodeId, true, settings && settings.choice ? settings.choice : null);
    updateState(nodeId, node);

    if (settings && settings.choice) {
      updateBrain(settings.choice, node);
    } else {
      updateBrain(null, node);
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
      return {
        target: "recenterNode",
        signal: "lost",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    if (
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("hearth") !== -1 ||
      value.indexOf("audralia") !== -1 ||
      value.indexOf("portal") !== -1 ||
      value.indexOf("world") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("character") !== -1 ||
      value.indexOf("npc") !== -1 ||
      value.indexOf("people") !== -1
    ) {
      return {
        target: "worldPath",
        signal: "curious",
        scopeLane: SCOPE_NARRATIVE
      };
    }

    if (
      value.indexOf("sean") !== -1 ||
      value.indexOf("founder") !== -1 ||
      value.indexOf("person") !== -1 ||
      value.indexOf("human") !== -1
    ) {
      return {
        target: "seanPath",
        signal: "human",
        scopeLane: SCOPE_OBJECTIVE
      };
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
      return {
        target: "proofPath",
        signal: "skeptic",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    if (
      value.indexOf("diagnostic") !== -1 ||
      value.indexOf("coherence") !== -1 ||
      value.indexOf("fit") !== -1 ||
      value.indexOf("archetype") !== -1 ||
      value.indexOf("self") !== -1 ||
      value.indexOf("reflect") !== -1
    ) {
      return {
        target: "diagnosticPath",
        signal: "self",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    if (
      value.indexOf("product") !== -1 ||
      value.indexOf("tool") !== -1 ||
      value.indexOf("use") !== -1 ||
      value.indexOf("practical") !== -1
    ) {
      return {
        target: "productsPath",
        signal: "practical",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    if (
      value.indexOf("book") !== -1 ||
      value.indexOf("summit") !== -1 ||
      value.indexOf("love") !== -1
    ) {
      return {
        target: "bookPath",
        signal: "book",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    if (
      value.indexOf("start") !== -1 ||
      value.indexOf("where") !== -1 ||
      value.indexOf("begin") !== -1
    ) {
      return {
        target: "whereToStart",
        signal: "lost",
        scopeLane: SCOPE_OBJECTIVE
      };
    }

    return {
      target: "askFirst",
      signal: "question",
      scopeLane: SCOPE_OBJECTIVE
    };
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
        return safeClone(getNode(id, false, null));
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
