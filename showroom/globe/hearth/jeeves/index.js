// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_256_STATE_DEEP_CONTINUATION_CONVERSATION_ENGINE_TNT_v15
// Full-file replacement.
// Preserves existing HTML/CSS contract.
// Owns deterministic Jeeves interface control, deep continuation ladders, conversational option language, dual public/narrative registries, character relationship registry, tap-to-advance, guided route handoffs, and dormant backend bridge stub.
// Does not own HTML, CSS, backend execution, server memory, API keys, persistent storage, or open freeform AI.

(function hearthJeevesDeepContinuationConversationEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_256_STATE_DEEP_CONTINUATION_CONVERSATION_ENGINE_TNT_v15";
  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var FUTURE_BRAIN_ENDPOINT = "/api/jeeves.js";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";

  var MAX_HISTORY = 80;
  var MAX_TOPIC_DEPTH = 3;

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
    { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
    { pattern: /\bAPI\b/g, replacement: "answer path" },
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
    currentTopic: "arrival",
    currentPosture: "arrival",
    currentPhase: "receive",
    currentScopeLane: SCOPE_OBJECTIVE,
    currentVoiceMode: MODE_OBJECTIVE,
    currentDepth: 0,
    currentRouteHandoffs: [],
    stateIndex: 0,

    topicDepth: {},

    visitor: {
      lastChoiceLabel: "",
      lastSignal: "",
      lastItch: "",
      lastTopic: "",
      lastScopeLane: SCOPE_OBJECTIVE,
      routeReadiness: 0,
      loopCount: 0,
      digressionCount: 0,
      progressCount: 0,
      needsRecenter: false,
      trail: []
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

    backendBridge: {
      endpoint: FUTURE_BRAIN_ENDPOINT,
      enabled: false,
      lastRequest: null,
      lastResponse: null,
      lastStatus: "dormant"
    },

    history: []
  };

  var els = {};
  var config = {};

  function say(label, target, meta) {
    var item = {
      label: label,
      target: target,
      type: "conversation"
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

  function control(label, target, meta) {
    var item = say(label, target, meta);
    item.type = "control";
    return item;
  }

  function back(label, target, meta) {
    var item = say(label, target, meta);
    item.type = "back";
    return item;
  }

  var SPEECH_LABEL_FALLBACKS = {
    websitePath: "Guide me through the public website.",
    skepticPlain: "Explain it plainly.",
    proofPath: "Tell me what proves it.",
    diagnosticPath: "Tell me about the Diagnostic.",
    worldPath: "Tell me about the world side.",
    worldGatePath: "Tell me about the Interactive Narrative.",
    charactersPath: "Who are the characters?",
    compassPath: "I need the Compass.",
    siteGuidePath: "Tell me how the site is organized.",
    lawsPath: "Explain the Laws.",
    gaugesPath: "Explain Gauges.",
    seanPath: "Tell me about Sean.",
    underdogPath: "Tell me about This Underdog.",
    productsPath: "Tell me about Products.",
    bookPath: "Tell me about the book path.",
    nineSummitsPath: "Tell me about Nine Summits.",
    hearthPath: "I want to understand Hearth.",
    audraliaPath: "Tell me about Audralia.",
    frontierPath: "What is Frontier?",
    futureProfilePath: "What is Future Profile?",
    mirrorMePath: "What is Mirror Me?",
    characterIdentityPath: "Who are the characters?",
    characterRelationshipsPath: "How do the characters relate?",
    characterTensionsPath: "What conflict do they carry?",
    characterMotivesPath: "What motivates them?",
    characterFactionsPath: "Are there sides or factions?",
    characterStoryPressurePath: "Why should I care about the characters?",
    characterFirstPath: "Who should I meet first?",
    cleanDoor: "Which door fits this best?",
    recenterNode: "Re-center me.",
    returnFork: "I need the clean fork again.",
    restartFork: "Start this over."
  };

  var TOPICS = {
    diamondGateBridge: {
      posture: "orientation",
      phase: "ground",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["compass", "siteGuide", "laws", "coherenceDiagnostic"],
      stages: [
        {
          title: "what",
          beats: [
            "Diamond Gate Bridge is the public work: the site, the proof path, the human voice, the diagnostic tools, the products, and the world doorway gathered under one roof.",
            "The first move is not to understand everything. The first move is to find the door that matches why you arrived."
          ],
          options: [
            say("Why does that matter?", "diamondGateBridgeWhy"),
            say("Where does that lead?", "diamondGateBridgeLead"),
            say("I need orientation.", "compassPath", { signal: "orientation" }),
            say("I want proof.", "proofPath", { signal: "skeptic" }),
            say("I want the world side.", "worldPath", { signal: "world" })
          ]
        },
        {
          title: "why",
          beats: [
            "It matters because the project is too large to be treated like a normal menu.",
            "A normal site asks you to browse. This one has to read why you arrived, then bring you to the right kind of door: proof, reflection, usefulness, human voice, or world entry."
          ],
          options: [
            say("Show me those doors.", "diamondGateBridgeLead"),
            say("Tell me about proof.", "proofPath"),
            say("Tell me about self-reflection.", "diagnosticPath"),
            say("Tell me about the human voice.", "seanPath"),
            say("Tell me about the world entry.", "worldPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "It leads in two directions at once.",
            "On the public side, you can follow proof, products, diagnostics, laws, gauges, Sean, and the book path.",
            "On the world side, the Showroom becomes the threshold, then the Interactive Narrative, Hearth, Audralia, Frontier, and the Characters begin to open."
          ],
          options: [
            say("Keep me on the public side.", "websitePath"),
            say("Take me toward proof.", "proofPath"),
            say("Take me toward the Diagnostic.", "diagnosticPath"),
            say("Take me toward the world side.", "worldPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    compass: {
      posture: "orientation",
      phase: "ground",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["compass", "siteGuide"],
      stages: [
        {
          title: "what",
          beats: [
            "The Compass is the cleanest first route.",
            "It helps you choose between proof, self-reflection, practical use, the human voice, and the world door without needing to hold the entire site in your head."
          ],
          options: [
            say("Why is the Compass first?", "compassWhy"),
            say("What doors does it point to?", "compassLead"),
            say("I want proof first.", "proofPath"),
            say("I want self-reflection.", "diagnosticPath"),
            say("I want the world side.", "worldPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The Compass is first because orientation has to come before belief.",
            "A visitor can reject the work too quickly if they meet the wrong door first. The Compass slows that down and gives the right kind of entry."
          ],
          options: [
            say("Show me the doors.", "compassLead"),
            say("Tell me about the Site Guide.", "siteGuidePath"),
            say("Tell me about the Laws.", "lawsPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about the Showroom.", "worldPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The Compass points to five basic doors.",
            "Proof belongs to Laws and Gauges. Self-reflection belongs to the Diagnostic. Practical use belongs to Products. Human voice belongs to Sean and This Underdog. The world side begins at the Showroom."
          ],
          options: [
            say("Explain proof.", "proofPath"),
            say("Explain self-reflection.", "diagnosticPath"),
            say("Explain the human voice.", "seanPath"),
            say("Explain the world side.", "worldPath"),
            control("Which door fits me best?", "cleanDoor")
          ]
        }
      ]
    },

    siteGuide: {
      posture: "orientation",
      phase: "ground",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["siteGuide", "compass", "showroom"],
      stages: [
        {
          title: "what",
          beats: [
            "The Site Guide is the public map.",
            "It separates ordinary website rooms from the deeper rooms so a visitor can see what is public structure, what is proof, what is practical, and what begins pointing toward the world side."
          ],
          options: [
            say("Why does the map need separation?", "siteGuideWhy"),
            say("Where does the map lead?", "siteGuideLead"),
            say("Tell me about the Compass.", "compassPath"),
            say("Tell me about the Showroom.", "worldPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The separation matters because the site has two kinds of rooms.",
            "Some pages explain the work in ordinary public terms. Other doors begin crossing into Mirrorland, Hearth, Audralia, Characters, and the interactive world."
          ],
          options: [
            say("Show me the public side.", "websitePath"),
            say("Show me the world side.", "worldPath"),
            say("Tell me about the threshold.", "showroomWhy"),
            say("Tell me about characters.", "charactersPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The public map leads to Compass, Laws, Governance, Gauges, Products, the Diagnostic, and the human voice.",
            "The deeper map leads toward the Showroom, the Interactive Narrative, Hearth, Audralia, Frontier, and the Characters."
          ],
          options: [
            say("Keep me public.", "compassPath"),
            say("Take me toward proof.", "proofPath"),
            say("Take me toward the world threshold.", "worldPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    proof: {
      posture: "proof",
      phase: "prove",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["laws", "gauges", "coherenceDiagnostic"],
      stages: [
        {
          title: "what",
          beats: [
            "The proof path is where the work stops asking for trust and starts making its structure testable.",
            "If you are skeptical, this is the right path. Doubt should not be bypassed; it should be given something to examine."
          ],
          options: [
            say("What makes it testable?", "proofWhy"),
            say("Where should I test it first?", "proofLead"),
            say("Explain the Laws.", "lawsPath"),
            say("Explain Gauges.", "gaugesPath"),
            say("Explain the Diagnostic.", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "It becomes testable when claims are separated from decoration.",
            "The Laws show the governing claims. Gauges show whether routes and systems are holding. The Diagnostic lets a visitor test pressure and coherence through themselves."
          ],
          options: [
            say("Tell me about the Laws.", "lawsPath"),
            say("Tell me about Gauges.", "gaugesPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Where does proof lead?", "proofLead")
          ]
        },
        {
          title: "lead",
          beats: [
            "If you want the claim layer, go to Laws.",
            "If you want status and technical confidence, go to Gauges.",
            "If you want to test the work through your own pressure, go to the Diagnostic."
          ],
          options: [
            say("The claim layer.", "lawsPath"),
            say("The status layer.", "gaugesPath"),
            say("The self-test layer.", "diagnosticPath"),
            say("I want the person behind it.", "seanPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    laws: {
      posture: "proof",
      phase: "prove",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["laws", "gauges", "coherenceDiagnostic"],
      stages: [
        {
          title: "what",
          beats: [
            "The Laws page is where the structure makes its claims testable.",
            "It is for visitors who want proof before they give the world side any trust."
          ],
          options: [
            say("Why do the Laws matter?", "lawsWhy"),
            say("Where do the Laws lead?", "lawsLead"),
            say("How do Gauges relate?", "gaugesPath"),
            say("How does the Diagnostic relate?", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The Laws matter because imagination without constraint collapses into decoration.",
            "The Laws keep the work accountable. They say: this is not merely a mood, a menu, or a story. It has claims that can be checked."
          ],
          options: [
            say("Show me what checks them.", "gaugesPath"),
            say("Show me how they apply to me.", "diagnosticPath"),
            say("Where do they lead?", "lawsLead"),
            say("I want the world side anyway.", "worldPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The Laws lead either to Gauges, where the structure is checked, or to the Diagnostic, where pressure becomes personal.",
            "They also protect the world side from becoming vague fantasy. The deeper doors need rules beneath them."
          ],
          options: [
            say("Tell me about Gauges.", "gaugesPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about the world side.", "worldPath"),
            control("Which proof door fits me?", "cleanDoor")
          ]
        }
      ]
    },

    gauges: {
      posture: "proof",
      phase: "prove",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["gauges", "laws"],
      stages: [
        {
          title: "what",
          beats: [
            "Gauges are the status route.",
            "They are for visitors who want to see whether the site, worlds, routes, and systems are holding instead of only hearing what they are supposed to become."
          ],
          options: [
            say("Why do Gauges matter?", "gaugesWhy"),
            say("Where do Gauges lead?", "gaugesLead"),
            say("How do the Laws relate?", "lawsPath"),
            say("How does the Diagnostic relate?", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Gauges matter because a large work needs visible status.",
            "They keep the visitor from confusing ambition with completion. A held route, a working gate, and a visible system are different from a promise."
          ],
          options: [
            say("Where do Gauges lead?", "gaugesLead"),
            say("Tell me about the Laws.", "lawsPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about the world side.", "worldPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Gauges lead back into trust.",
            "If a route is visible, held, and tested, the visitor can move forward with more confidence. If it is not, the right move is to say so clearly."
          ],
          options: [
            say("Take me to the proof layer.", "proofPath"),
            say("Take me to the Diagnostic explanation.", "diagnosticPath"),
            say("Take me toward the world threshold.", "worldPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    diagnostic: {
      posture: "diagnostic",
      phase: "personalize",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["coherenceDiagnostic", "laws"],
      stages: [
        {
          title: "what",
          beats: [
            "The Diagnostic is the public mirror path.",
            "It helps a visitor notice the difference between what they claim, what they choose, and what pressure reveals."
          ],
          options: [
            say("Why does that matter?", "diagnosticWhy"),
            say("Where does it lead?", "diagnosticLead"),
            say("How is this different from Mirror Me?", "mirrorMePath"),
            say("How do the Laws relate?", "lawsPath")
          ]
        },
        {
          title: "why",
          beats: [
            "It matters because people often describe themselves from intention, but pressure reveals them through movement.",
            "The Diagnostic does not need to flatter the visitor. It needs to help them see where claim, choice, and pressure do not match."
          ],
          options: [
            say("Where does that lead?", "diagnosticLead"),
            say("Tell me about Future Profile.", "futureProfilePath"),
            say("Tell me about Mirror Me.", "mirrorMePath"),
            say("Tell me about This Underdog.", "underdogPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The Diagnostic leads toward a cleaner self-check.",
            "Future Profile points toward continuity over time. Mirror Me points toward the narrative reflection side. This Underdog points toward the voice that pressure has not yet taught how to speak."
          ],
          options: [
            say("What is Future Profile?", "futureProfilePath"),
            say("What is Mirror Me?", "mirrorMePath"),
            say("What is This Underdog?", "underdogPath"),
            control("Which mirror path fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    futureProfile: {
      posture: "futureProfile",
      phase: "reveal",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["coherenceDiagnostic", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Future Profile is the future-facing return path.",
            "It points toward a version of the Diagnostic that could become more personal over time, but it should not be treated as fully live until that route is actually ready."
          ],
          options: [
            say("Why does return matter?", "futureProfileWhy"),
            say("Where does this lead?", "futureProfileLead"),
            say("How is this different from Mirror Me?", "mirrorMePath"),
            say("Tell me about the Diagnostic first.", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Return matters because one visit can show interest, but repeated visits can show pattern.",
            "The future version of this path is not only what a visitor says once. It is what the visitor keeps becoming when pressure, choice, and memory begin to line up."
          ],
          options: [
            say("Where does that lead?", "futureProfileLead"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about Mirror Me.", "mirrorMePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Future Profile leads toward continuity.",
            "The public version belongs near the Diagnostic. The narrative version belongs near Mirror Me. Both should stay honest about what is live now and what is still future-facing."
          ],
          options: [
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about Mirror Me.", "mirrorMePath"),
            say("Tell me about the world side.", "worldPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    mirrorMe: {
      posture: "mirrorMe",
      phase: "reveal",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      handoffs: ["coherenceDiagnostic", "interactiveNarrative", "characters"],
      stages: [
        {
          title: "what",
          beats: [
            "Mirror Me is the narrative reflection path.",
            "It should not replace the public Diagnostic. It begins where the mirror becomes part of the world."
          ],
          options: [
            say("Why is Mirror Me different?", "mirrorMeWhy"),
            say("Where does Mirror Me lead?", "mirrorMeLead"),
            say("How does the Diagnostic differ?", "diagnosticPath"),
            say("How do the characters connect?", "charactersPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The Diagnostic tests a visitor on the public side.",
            "Mirror Me belongs to the world side. It asks a different question: what happens when the world begins reflecting the visitor back through rooms, characters, choices, and pressure?"
          ],
          options: [
            say("Where does that lead?", "mirrorMeLead"),
            say("Tell me about the characters.", "charactersPath"),
            say("Tell me about the Interactive Narrative.", "worldGatePath"),
            say("Tell me about the Diagnostic.", "diagnosticPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Mirror Me leads toward playable reflection.",
            "The visitor is no longer only reading a description of pressure. The visitor begins meeting pressure through the world itself."
          ],
          options: [
            say("Tell me about the characters.", "charactersPath"),
            say("Tell me about character relationships.", "characterRelationshipsPath"),
            say("Tell me about the Interactive Narrative.", "worldGatePath"),
            control("Which mirror door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    sean: {
      posture: "sean",
      phase: "reflect",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["meetSean", "aboutUnderdog", "book", "nineSummits"],
      stages: [
        {
          title: "what",
          beats: [
            "Meet Sean is where the voice becomes a person.",
            "That page connects the work to pressure, accountability, comedy, story, speaking, and the real human effort behind Diamond Gate Bridge."
          ],
          options: [
            say("Why does Sean matter here?", "seanWhy"),
            say("Where does Sean’s path lead?", "seanLead"),
            say("How does This Underdog connect?", "underdogPath"),
            say("How does the book path connect?", "bookPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Sean matters here because a work this large needs a human pressure trail.",
            "The site is not only a polished structure. It carries struggle, voice, comedy, risk, redirection, and the attempt to make pressure useful."
          ],
          options: [
            say("Where does that lead?", "seanLead"),
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about the book path.", "bookPath"),
            say("Tell me about Products.", "productsPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Sean’s path leads toward three public doors.",
            "This Underdog explains the inner voice under pressure. The book path turns becoming into a longer journey. Products make the message usable."
          ],
          options: [
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about the book path.", "bookPath"),
            say("Tell me about Products.", "productsPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    underdog: {
      posture: "sean",
      phase: "deepen",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "book"],
      stages: [
        {
          title: "what",
          beats: [
            "This Underdog is not only a page about Sean.",
            "It is the part of a person that has been carrying pressure before it has found language.",
            "It is the inner voice that knows something is there, but has not yet learned how to stand up, speak clearly, or become useful."
          ],
          options: [
            say("Why does that matter?", "underdogWhy"),
            say("Where does that voice lead?", "underdogLead"),
            say("How does this connect to Sean?", "seanPath"),
            say("How does this connect to the Diagnostic?", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "It matters because many people do not lack potential. They lack a language strong enough to hold what pressure has been trying to teach them.",
            "The Underdog is not weakness. It is the unorganized voice before it becomes direction."
          ],
          options: [
            say("Where does that voice lead?", "underdogLead"),
            say("How does pressure become language?", "underdogPressureLanguage"),
            say("How does this connect to comedy?", "underdogComedy"),
            say("How does this connect to the book?", "bookPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "That voice can lead in several directions.",
            "Toward Sean, it becomes the person behind the work. Toward the Diagnostic, it becomes a mirror. Toward the book path, it becomes a longer journey. Toward comedy, it becomes pressure learning how to speak without breaking."
          ],
          options: [
            say("How does pressure become language?", "underdogPressureLanguage"),
            say("How does this connect to comedy?", "underdogComedy"),
            say("Tell me about the book path.", "bookPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ],
      continuations: {
        underdogPressureLanguage: [
          "Pressure becomes language when a person stops treating the pain as only damage and begins reading it as information.",
          "That does not make the pressure good. It means the person finally starts extracting voice, boundary, judgment, and direction from it."
        ],
        underdogComedy: [
          "Comedy matters because it lets pressure speak without pretending to be untouched by it.",
          "The comic voice can carry pain, intelligence, embarrassment, timing, and defiance in the same breath. That is why This Underdog lives near comedy."
        ]
      }
    },

    products: {
      posture: "products",
      phase: "route",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["products", "book", "coherenceDiagnostic"],
      stages: [
        {
          title: "what",
          beats: [
            "Products are where the message becomes usable.",
            "They are for visitors who do not want only ideas. They want something they can use, wear, read, give, or return to."
          ],
          options: [
            say("Why do Products matter?", "productsWhy"),
            say("Where do Products lead?", "productsLead"),
            say("How do Products connect to the book?", "bookPath"),
            say("How do Products connect to the Diagnostic?", "diagnosticPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Products matter because a message that never becomes usable can stay trapped in admiration.",
            "The practical wing lets the work become touchable. It turns concept into object, reminder, ritual, gift, or tool."
          ],
          options: [
            say("Where does that lead?", "productsLead"),
            say("Tell me about the book path.", "bookPath"),
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Products lead toward practical entry.",
            "A visitor may not be ready for the full structure, but they may be ready for a phrase, a symbol, a book, a diagnostic, or a piece of the work they can carry."
          ],
          options: [
            say("Tell me about the book.", "bookPath"),
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    book: {
      posture: "book",
      phase: "deepen",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["book", "nineSummits", "meetSean"],
      stages: [
        {
          title: "what",
          beats: [
            "The Nine Summits of Love is the book path.",
            "It takes the pressure, voice, coherence, and becoming questions and turns them into a human-development journey."
          ],
          options: [
            say("Why does the book matter?", "bookWhy"),
            say("Where does the book lead?", "bookLead"),
            say("How does Nine Summits connect?", "nineSummitsPath"),
            say("How does This Underdog connect?", "underdogPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The book matters because the work needs a path a person can stay with.",
            "A page can orient. A diagnostic can reflect. A product can remind. But a book can walk with the reader through pressure, love, voice, and becoming."
          ],
          options: [
            say("Where does the book lead?", "bookLead"),
            say("Tell me about Nine Summits.", "nineSummitsPath"),
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about Sean.", "seanPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The book leads toward the broader Nine Summits path.",
            "It also leads back to Sean’s voice and This Underdog, because the larger human-development path still begins with pressure learning how to speak."
          ],
          options: [
            say("Tell me about Nine Summits.", "nineSummitsPath"),
            say("Tell me about Sean.", "seanPath"),
            say("Tell me about This Underdog.", "underdogPath"),
            say("Tell me about Products.", "productsPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    nineSummits: {
      posture: "book",
      phase: "deepen",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      handoffs: ["nineSummits", "book", "meetSean"],
      stages: [
        {
          title: "what",
          beats: [
            "Nine Summits is the wider human-development path.",
            "It is less about browsing pages and more about what a person is becoming through pressure, love, voice, and coherence."
          ],
          options: [
            say("Why do the Summits matter?", "nineSummitsWhy"),
            say("Where do the Summits lead?", "nineSummitsLead"),
            say("How does the book connect?", "bookPath"),
            say("How does Sean connect?", "seanPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The Summits matter because human development cannot be reduced to motivation alone.",
            "It needs pressure, love, boundary, voice, coherence, and repeated ascent. A summit is not only inspiration. It is a climb."
          ],
          options: [
            say("Where does that lead?", "nineSummitsLead"),
            say("Tell me about the book.", "bookPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about This Underdog.", "underdogPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Nine Summits leads toward a longer development path.",
            "The book can introduce it. The Diagnostic can personalize it. Sean’s page can humanize it. Products can make pieces of it usable."
          ],
          options: [
            say("Tell me about the book.", "bookPath"),
            say("Tell me about the Diagnostic.", "diagnosticPath"),
            say("Tell me about Sean.", "seanPath"),
            say("Tell me about Products.", "productsPath"),
            control("Which door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    showroom: {
      posture: "world",
      phase: "fork",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      handoffs: ["showroom", "interactiveNarrative", "siteGuide"],
      stages: [
        {
          title: "what",
          beats: [
            "The Showroom is the threshold.",
            "The public map is still visible there, but the world side begins to press against it."
          ],
          options: [
            say("Why is the Showroom the threshold?", "showroomWhy"),
            say("Where does the threshold lead?", "showroomLead"),
            say("What happens inside the Interactive Narrative?", "worldGatePath"),
            say("I want to understand Hearth.", "hearthPath")
          ]
        },
        {
          title: "why",
          beats: [
            "It is the threshold because the visitor is not fully inside the world yet.",
            "The Showroom still lets you see the public site, but it also begins preparing you for rooms, characters, portals, and a world that behaves differently from an ordinary page."
          ],
          options: [
            say("Where does it lead?", "showroomLead"),
            say("Tell me about the Interactive Narrative.", "worldGatePath"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about the Characters.", "charactersPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The threshold leads first into the Interactive Narrative.",
            "From there, the world can move toward Hearth, Audralia, Frontier, Characters, and Mirror Me. The point is not to browse the world. The point is to cross it carefully."
          ],
          options: [
            say("Tell me about the Interactive Narrative.", "worldGatePath"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about Audralia.", "audraliaPath"),
            say("Who are the characters?", "charactersPath"),
            control("Which world door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    interactiveNarrative: {
      posture: "world",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_THRESHOLD,
      handoffs: ["interactiveNarrative", "showroom", "hearth", "characters"],
      stages: [
        {
          title: "what",
          beats: [
            "The Interactive Narrative is the first active doorway into the world side.",
            "It is where the visitor stops only reading and begins moving through the structure."
          ],
          options: [
            say("Why does movement matter?", "interactiveNarrativeWhy"),
            say("Where does the narrative lead?", "interactiveNarrativeLead"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about Audralia.", "audraliaPath"),
            say("Who are the characters?", "charactersPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Movement matters because Mirrorland should not remain a museum of ideas.",
            "The visitor has to choose, cross, return, inspect, and feel the difference between reading the map and walking through the pressure of the world."
          ],
          options: [
            say("Where does that lead?", "interactiveNarrativeLead"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about Characters.", "charactersPath"),
            say("Tell me about Mirror Me.", "mirrorMePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The Interactive Narrative leads into rooms and people.",
            "Hearth is the closest room. Audralia is farther out. Frontier is the outer edge. Characters make the world inhabited. Mirror Me lets the world reflect the visitor back."
          ],
          options: [
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about Audralia.", "audraliaPath"),
            say("What is Frontier?", "frontierPath"),
            say("Who are the characters?", "charactersPath"),
            say("What is Mirror Me?", "mirrorMePath")
          ]
        }
      ]
    },

    hearth: {
      posture: "hearth",
      phase: "ground",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["hearth", "interactiveNarrative", "audralia"],
      stages: [
        {
          title: "what",
          beats: [
            "Hearth is the closest room to where I speak from.",
            "If the world feels too wide, begin there."
          ],
          options: [
            say("Why begin with Hearth?", "hearthWhy"),
            say("Where does Hearth lead?", "hearthLead"),
            say("How does Hearth relate to Audralia?", "audraliaPath"),
            say("How do the characters connect?", "charactersPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Hearth matters because every world needs a first room that can hold the visitor.",
            "It is not the farthest edge. It is the point of contact. It gives the world a voice, a floor, and a place to begin."
          ],
          options: [
            say("Where does Hearth lead?", "hearthLead"),
            say("Tell me about Audralia.", "audraliaPath"),
            say("Tell me about Characters.", "charactersPath"),
            say("Tell me about the Interactive Narrative.", "worldGatePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Hearth leads outward.",
            "From Hearth, the visitor can move toward Audralia, the Characters, the world gate, and eventually the wider frontier. Hearth is not the whole world. It is the room that lets the world begin."
          ],
          options: [
            say("Tell me about Audralia.", "audraliaPath"),
            say("Who are the characters?", "charactersPath"),
            say("What is Frontier?", "frontierPath"),
            say("What is Mirror Me?", "mirrorMePath"),
            control("Which world door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    audralia: {
      posture: "audralia",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["audralia", "frontier", "hearth"],
      stages: [
        {
          title: "what",
          beats: [
            "Audralia is farther out.",
            "It is where the world begins to widen beyond the first threshold."
          ],
          options: [
            say("Why does Audralia matter?", "audraliaWhy"),
            say("Where does Audralia lead?", "audraliaLead"),
            say("How does Hearth relate?", "hearthPath"),
            say("What is Frontier?", "frontierPath"),
            say("Who are the characters there?", "charactersPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Audralia matters because the world needs scale.",
            "Hearth gives you a room. Audralia gives you distance, terrain, expansion, and the sense that the world continues beyond the first doorway."
          ],
          options: [
            say("Where does Audralia lead?", "audraliaLead"),
            say("Tell me about Frontier.", "frontierPath"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about the Characters.", "charactersPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Audralia leads toward the outward world.",
            "It points back to Hearth as the first room, forward to Frontier as the edge, and sideways into Characters because a widened world needs people, motives, conflict, and consequence."
          ],
          options: [
            say("What is Frontier?", "frontierPath"),
            say("How do the Characters relate?", "characterRelationshipsPath"),
            say("Tell me about Hearth.", "hearthPath"),
            say("Tell me about Mirror Me.", "mirrorMePath"),
            control("Which world door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    frontier: {
      posture: "frontier",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["frontier", "audralia", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Frontier is the outward edge.",
            "It is where the world starts pointing beyond its first rooms and toward discovery."
          ],
          options: [
            say("Why does Frontier matter?", "frontierWhy"),
            say("Where does Frontier lead?", "frontierLead"),
            say("How does Audralia connect?", "audraliaPath"),
            say("How do the Characters connect?", "charactersPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Frontier matters because a world that never reaches an edge never creates real discovery.",
            "The edge tells the visitor that the estate is not only contained rooms. It has unknown distance."
          ],
          options: [
            say("Where does Frontier lead?", "frontierLead"),
            say("Tell me about Audralia.", "audraliaPath"),
            say("Tell me about the Characters.", "charactersPath"),
            say("Bring me back toward the threshold.", "worldPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Frontier leads toward expansion and uncertainty.",
            "It is the place where the world begins asking what else may exist beyond the rooms already named."
          ],
          options: [
            say("Tell me about Audralia.", "audraliaPath"),
            say("Tell me about the Interactive Narrative.", "worldGatePath"),
            say("Tell me about the Characters.", "charactersPath"),
            control("Which world door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characters: {
      posture: "characters",
      phase: "personalize",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative", "mirrorland"],
      stages: [
        {
          title: "what",
          beats: [
            "The characters are where the world stops feeling empty.",
            "They are not menu labels. They are the people who make pressure, consequence, choice, and story personal."
          ],
          options: [
            say("Why do the characters matter?", "charactersWhy"),
            say("Where do the characters lead?", "charactersLead"),
            say("How do the characters relate?", "characterRelationshipsPath"),
            say("What conflict do they carry?", "characterTensionsPath"),
            say("Who should I meet first?", "characterFirstPath")
          ]
        },
        {
          title: "why",
          beats: [
            "They matter because scenery can only carry so much pressure.",
            "Once a person carries the pressure, the world becomes accountable. Choices have consequence. Memory has a face. Survival has a cost."
          ],
          options: [
            say("Where do they lead?", "charactersLead"),
            say("How do they relate?", "characterRelationshipsPath"),
            say("What motivates them?", "characterMotivesPath"),
            say("Are there sides or factions?", "characterFactionsPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The characters lead into relationships, motives, tensions, factions, and story pressure.",
            "They also lead toward Mirror Me, because once the world has people inside it, the visitor can begin to feel what the world reflects back."
          ],
          options: [
            say("How do the characters relate?", "characterRelationshipsPath"),
            say("What motivates them?", "characterMotivesPath"),
            say("What conflict do they carry?", "characterTensionsPath"),
            say("What is Mirror Me?", "mirrorMePath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterRelationships: {
      posture: "characters",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Character relationships are pressure lines.",
            "One character can reveal what another refuses to face. One can carry the memory another tries to bury. One can become the consequence of a choice someone else made too late."
          ],
          options: [
            say("Why do those relationships matter?", "characterRelationshipsWhy"),
            say("Where do they lead?", "characterRelationshipsLead"),
            say("What motivates them?", "characterMotivesPath"),
            say("What conflict do they carry?", "characterTensionsPath"),
            say("Are there sides or factions?", "characterFactionsPath")
          ]
        },
        {
          title: "why",
          beats: [
            "They matter because Mirrorland is not only a place. It is a pressure field.",
            "Relationships show what the world costs. Alliance, warning, mirror, betrayal, memory, consequence, and unfinished crossing can all live between two characters."
          ],
          options: [
            say("Where do those relationships lead?", "characterRelationshipsLead"),
            say("Explain motives.", "characterMotivesPath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Explain factions.", "characterFactionsPath"),
            say("Who should I meet first?", "characterFirstPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The relationships lead toward story pressure.",
            "Once you understand who reflects whom, who owes whom, who fears whom, and who remembers what the others deny, the world begins to feel inhabited instead of arranged."
          ],
          options: [
            say("Explain story pressure.", "characterStoryPressurePath"),
            say("Explain motives.", "characterMotivesPath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Who should I meet first?", "characterFirstPath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterTensions: {
      posture: "characters",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "The conflict is not only good against evil.",
            "It is memory against denial, survival against consequence, voice against silence, and choice against the pressure that shaped it."
          ],
          options: [
            say("Why does that conflict matter?", "characterTensionsWhy"),
            say("Where does that conflict lead?", "characterTensionsLead"),
            say("What motivates them?", "characterMotivesPath"),
            say("How do they relate?", "characterRelationshipsPath"),
            say("Are there sides or factions?", "characterFactionsPath")
          ]
        },
        {
          title: "why",
          beats: [
            "The conflict matters because it makes the world argue with itself.",
            "A character may want repair while another protects denial. One may want survival while another demands consequence. That pressure is where story begins."
          ],
          options: [
            say("Where does that conflict lead?", "characterTensionsLead"),
            say("Explain relationships.", "characterRelationshipsPath"),
            say("Explain motives.", "characterMotivesPath"),
            say("Explain story pressure.", "characterStoryPressurePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "The conflict leads toward choice.",
            "The question is not only who wins. The deeper question is whether a person can cross pressure, consequence, and memory without losing the self."
          ],
          options: [
            say("Explain story pressure.", "characterStoryPressurePath"),
            say("Explain Mirror Me.", "mirrorMePath"),
            say("Who should I meet first?", "characterFirstPath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterMotives: {
      posture: "characters",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Character motives should be read through pressure.",
            "A character may want safety, recognition, escape, control, repair, truth, or a second chance."
          ],
          options: [
            say("Why do motives matter?", "characterMotivesWhy"),
            say("Where do motives lead?", "characterMotivesLead"),
            say("How do relationships shape them?", "characterRelationshipsPath"),
            say("What conflict do they create?", "characterTensionsPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Motives matter because biography is not enough.",
            "What a character wants becomes meaningful only when the world refuses to make it easy. Pressure reveals whether the motive becomes courage, denial, control, or collapse."
          ],
          options: [
            say("Where do those motives lead?", "characterMotivesLead"),
            say("Explain relationships.", "characterRelationshipsPath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Explain factions.", "characterFactionsPath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Motives lead to movement.",
            "Once you know what each character wants, you can see why they cross, refuse, betray, protect, hide, confess, return, or run."
          ],
          options: [
            say("Explain relationships.", "characterRelationshipsPath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Explain story pressure.", "characterStoryPressurePath"),
            say("Who should I meet first?", "characterFirstPath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterFactions: {
      posture: "characters",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "There can be sides, but the important division is deeper than teams.",
            "Some forces preserve memory. Some protect denial. Some chase survival. Some want control over the crossing itself."
          ],
          options: [
            say("Why do factions matter?", "characterFactionsWhy"),
            say("Where do factions lead?", "characterFactionsLead"),
            say("How do relationships shape them?", "characterRelationshipsPath"),
            say("What conflict do they create?", "characterTensionsPath")
          ]
        },
        {
          title: "why",
          beats: [
            "Factions matter when they become pressure patterns.",
            "A side is not just a group. It is a way of answering the world: remember it, deny it, survive it, control it, repair it, or cross it."
          ],
          options: [
            say("Where do factions lead?", "characterFactionsLead"),
            say("Explain relationships.", "characterRelationshipsPath"),
            say("Explain motives.", "characterMotivesPath"),
            say("Explain story pressure.", "characterStoryPressurePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Factions lead toward alignment.",
            "Once the visitor sees what each side protects, the conflict becomes more than plot. It becomes a map of what the world believes is worth saving."
          ],
          options: [
            say("Explain story pressure.", "characterStoryPressurePath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Who should I meet first?", "characterFirstPath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterStoryPressure: {
      posture: "characters",
      phase: "deepen",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Story pressure is what happens when the world makes a character pay for what they believe, avoid, remember, or choose.",
            "A landscape can be beautiful and still empty. A character brings consequence."
          ],
          options: [
            say("Why does story pressure matter?", "characterStoryPressureWhy"),
            say("Where does story pressure lead?", "characterStoryPressureLead"),
            say("How do relationships carry it?", "characterRelationshipsPath"),
            say("How does Mirror Me connect?", "mirrorMePath")
          ]
        },
        {
          title: "why",
          beats: [
            "It matters because pressure is how the world becomes honest.",
            "When a person carries the cost, the world can no longer hide behind scenery. The story has to answer for itself."
          ],
          options: [
            say("Where does that lead?", "characterStoryPressureLead"),
            say("Explain relationships.", "characterRelationshipsPath"),
            say("Explain conflict.", "characterTensionsPath"),
            say("Explain Mirror Me.", "mirrorMePath")
          ]
        },
        {
          title: "lead",
          beats: [
            "Story pressure leads toward choice and reflection.",
            "That is where the Characters path begins touching Mirror Me: the visitor starts seeing not only what the characters carry, but what kind of pressure the visitor recognizes."
          ],
          options: [
            say("Tell me about Mirror Me.", "mirrorMePath"),
            say("Tell me about character relationships.", "characterRelationshipsPath"),
            say("Who should I meet first?", "characterFirstPath"),
            control("Which character door fits this best?", "cleanDoor")
          ]
        }
      ]
    },

    characterFirst: {
      posture: "characters",
      phase: "route",
      scopeLane: SCOPE_NARRATIVE,
      voiceMode: MODE_IMMERSION,
      handoffs: ["characters", "interactiveNarrative"],
      stages: [
        {
          title: "what",
          beats: [
            "Start with the character who best matches the pressure you want to understand.",
            "If you want memory, follow the one who cannot forget. If you want consequence, follow the one who arrived too late. If you want survival, follow the one who keeps moving. If you want voice, follow the one who has not learned how to speak yet."
          ],
          options: [
            say("I want memory.", "characterRelationshipsPath"),
            say("I want consequence.", "characterTensionsPath"),
            say("I want survival.", "characterMotivesPath"),
            say("I want voice.", "underdogPath"),
            say("I want the world gate first.", "worldGatePath")
          ]
        }
      ]
    }
  };

  var TARGETS = {
    websitePath: { topic: "diamondGateBridge", level: 1 },
    diamondGateBridgeWhy: { topic: "diamondGateBridge", level: 2 },
    diamondGateBridgeLead: { topic: "diamondGateBridge", level: 3 },

    compassPath: { topic: "compass", level: 1 },
    compassWhy: { topic: "compass", level: 2 },
    compassLead: { topic: "compass", level: 3 },

    siteGuidePath: { topic: "siteGuide", level: 1 },
    siteGuideWhy: { topic: "siteGuide", level: 2 },
    siteGuideLead: { topic: "siteGuide", level: 3 },

    proofPath: { topic: "proof", level: 1 },
    skepticPlain: { topic: "proof", level: 1 },
    proofWhy: { topic: "proof", level: 2 },
    proofLead: { topic: "proof", level: 3 },

    lawsPath: { topic: "laws", level: 1 },
    lawsWhy: { topic: "laws", level: 2 },
    lawsLead: { topic: "laws", level: 3 },

    gaugesPath: { topic: "gauges", level: 1 },
    gaugesWhy: { topic: "gauges", level: 2 },
    gaugesLead: { topic: "gauges", level: 3 },

    diagnosticPath: { topic: "diagnostic", level: 1 },
    diagnosticWhy: { topic: "diagnostic", level: 2 },
    diagnosticLead: { topic: "diagnostic", level: 3 },

    futureProfilePath: { topic: "futureProfile", level: 1 },
    futureProfileWhy: { topic: "futureProfile", level: 2 },
    futureProfileLead: { topic: "futureProfile", level: 3 },

    mirrorMePath: { topic: "mirrorMe", level: 1 },
    mirrorMeWhy: { topic: "mirrorMe", level: 2 },
    mirrorMeLead: { topic: "mirrorMe", level: 3 },

    seanPath: { topic: "sean", level: 1 },
    seanWhy: { topic: "sean", level: 2 },
    seanLead: { topic: "sean", level: 3 },

    underdogPath: { topic: "underdog", level: 1 },
    underdogWhy: { topic: "underdog", level: 2 },
    underdogLead: { topic: "underdog", level: 3 },
    underdogPressureLanguage: { topic: "underdog", continuation: "underdogPressureLanguage" },
    underdogComedy: { topic: "underdog", continuation: "underdogComedy" },

    productsPath: { topic: "products", level: 1 },
    productsWhy: { topic: "products", level: 2 },
    productsLead: { topic: "products", level: 3 },

    bookPath: { topic: "book", level: 1 },
    bookWhy: { topic: "book", level: 2 },
    bookLead: { topic: "book", level: 3 },

    nineSummitsPath: { topic: "nineSummits", level: 1 },
    nineSummitsWhy: { topic: "nineSummits", level: 2 },
    nineSummitsLead: { topic: "nineSummits", level: 3 },

    worldPath: { topic: "showroom", level: 1 },
    showroomWhy: { topic: "showroom", level: 2 },
    showroomLead: { topic: "showroom", level: 3 },

    worldGatePath: { topic: "interactiveNarrative", level: 1 },
    interactiveNarrativeWhy: { topic: "interactiveNarrative", level: 2 },
    interactiveNarrativeLead: { topic: "interactiveNarrative", level: 3 },

    hearthPath: { topic: "hearth", level: 1 },
    hearthWhy: { topic: "hearth", level: 2 },
    hearthLead: { topic: "hearth", level: 3 },

    audraliaPath: { topic: "audralia", level: 1 },
    audraliaWhy: { topic: "audralia", level: 2 },
    audraliaLead: { topic: "audralia", level: 3 },

    frontierPath: { topic: "frontier", level: 1 },
    frontierWhy: { topic: "frontier", level: 2 },
    frontierLead: { topic: "frontier", level: 3 },

    charactersPath: { topic: "characters", level: 1 },
    characterIdentityPath: { topic: "characters", level: 1 },
    charactersWhy: { topic: "characters", level: 2 },
    charactersLead: { topic: "characters", level: 3 },

    characterRelationshipsPath: { topic: "characterRelationships", level: 1 },
    characterRelationshipsWhy: { topic: "characterRelationships", level: 2 },
    characterRelationshipsLead: { topic: "characterRelationships", level: 3 },

    characterTensionsPath: { topic: "characterTensions", level: 1 },
    characterTensionsWhy: { topic: "characterTensions", level: 2 },
    characterTensionsLead: { topic: "characterTensions", level: 3 },

    characterMotivesPath: { topic: "characterMotives", level: 1 },
    characterMotivesWhy: { topic: "characterMotives", level: 2 },
    characterMotivesLead: { topic: "characterMotives", level: 3 },

    characterFactionsPath: { topic: "characterFactions", level: 1 },
    characterFactionsWhy: { topic: "characterFactions", level: 2 },
    characterFactionsLead: { topic: "characterFactions", level: 3 },

    characterStoryPressurePath: { topic: "characterStoryPressure", level: 1 },
    characterStoryPressureWhy: { topic: "characterStoryPressure", level: 2 },
    characterStoryPressureLead: { topic: "characterStoryPressure", level: 3 },

    characterFirstPath: { topic: "characterFirst", level: 1 }
  };

  var SPECIAL_NODES = {
    intro: {
      posture: "arrival",
      phase: "receive",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Hello. I’m Jeeves.",
        "I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole work at once.",
        "I can guide you through the public website, take you toward the world side, or ask one question first."
      ],
      options: [
        say("Guide me through the public website.", "websitePath", { signal: "orientation" }),
        say("Take me toward the world side.", "worldPath", { signal: "world" }),
        say("I’m skeptical. Explain it plainly.", "skepticPlain", { signal: "skeptic" }),
        say("Just tell me where to start.", "compassPath", { signal: "lost" }),
        say("Ask me one question first.", "askFirst", { signal: "question" })
      ],
      handoffs: []
    },

    askFirst: {
      posture: "arrival",
      phase: "invite",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Then I’ll ask plainly.",
        "What brought you here first: orientation, skepticism, self-reflection, practical use, or the story?"
      ],
      options: [
        say("Orientation.", "websitePath", { signal: "orientation" }),
        say("Skepticism.", "skepticPlain", { signal: "skeptic" }),
        say("Self-reflection.", "diagnosticPath", { signal: "self" }),
        say("Practical use.", "productsPath", { signal: "practical" }),
        say("The story.", "worldPath", { signal: "world" })
      ],
      handoffs: []
    },

    returnFork: {
      posture: "arrival",
      phase: "return",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Then we return to the clean fork.",
        "Public website, world side, proof, self-reflection, or practical use?"
      ],
      options: [
        say("Public website.", "websitePath", { signal: "orientation" }),
        say("World side.", "worldPath", { signal: "world" }),
        say("Proof.", "proofPath", { signal: "skeptic" }),
        say("Self-reflection.", "diagnosticPath", { signal: "self" }),
        say("Practical use.", "productsPath", { signal: "practical" })
      ],
      handoffs: []
    },

    restartFork: {
      reset: true,
      posture: "arrival",
      phase: "reset",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "Clean reset.",
        "You are back at the doorway."
      ],
      options: [
        say("Guide me through the public website.", "websitePath", { signal: "orientation" }),
        say("Take me toward the world side.", "worldPath", { signal: "world" }),
        say("I’m skeptical. Explain it plainly.", "skepticPlain", { signal: "skeptic" }),
        say("Ask me one question first.", "askFirst", { signal: "question" })
      ],
      handoffs: []
    },

    recenterNode: {
      posture: "orientation",
      phase: "return",
      scopeLane: SCOPE_OBJECTIVE,
      voiceMode: MODE_OBJECTIVE,
      beats: [
        "I may have taken you too deep too quickly.",
        "Let me bring this back to one clear doorway."
      ],
      options: [
        say("I need orientation.", "compassPath", { signal: "orientation" }),
        say("I want proof.", "proofPath", { signal: "skeptic" }),
        say("I want the Diagnostic.", "diagnosticPath", { signal: "self" }),
        say("I want the world side.", "worldPath", { signal: "world" }),
        back("I need the clean fork again.", "returnFork")
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "interactiveNarrative"]
    },

    cleanDoor: {
      dynamic: true
    }
  };

  var HandoffTargets = {
    compass: "compassPath",
    siteGuide: "siteGuidePath",
    laws: "lawsPath",
    gauges: "gaugesPath",
    coherenceDiagnostic: "diagnosticPath",
    meetSean: "seanPath",
    aboutUnderdog: "underdogPath",
    products: "productsPath",
    book: "bookPath",
    nineSummits: "nineSummitsPath",
    showroom: "worldPath",
    interactiveNarrative: "worldGatePath",
    hearth: "hearthPath",
    audralia: "audraliaPath",
    frontier: "frontierPath",
    characters: "charactersPath"
  };

  function query(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function wordCount(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
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

  function getTypingDelay(text, index) {
    var delay = PACING.typingBaseMs + wordCount(text) * PACING.typingWordMs;
    if (index === 0) delay += 220;
    return clamp(delay, PACING.typingMinMs, PACING.typingMaxMs);
  }

  function getReadDelay(text) {
    return clamp(
      PACING.readBaseMs + wordCount(text) * PACING.readWordMs,
      PACING.readMinMs,
      PACING.readMaxMs
    );
  }

  function sanitizePublicText(text) {
    var clean = String(text || "");

    FORBIDDEN_PUBLIC_LANGUAGE.forEach(function eachRule(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    return clean;
  }

  function sanitizeConversationLabel(label, target) {
    var clean = String(label || "").trim();
    var actionStart = /^(open|visit|enter|explore|return to|go to|launch|take the|read the)\b/i;

    if (actionStart.test(clean)) {
      return SPEECH_LABEL_FALLBACKS[target] || "Tell me more about this.";
    }

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
    var routes = {};
    var key;

    for (key in DEFAULT_ROUTES) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_ROUTES, key)) {
        routes[key] = DEFAULT_ROUTES[key];
      }
    }

    if (config.routes) {
      for (key in config.routes) {
        if (Object.prototype.hasOwnProperty.call(config.routes, key)) {
          routes[key] = config.routes[key];
        }
      }
    }

    return routes;
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
    if (!id || id === "arrival") return "intro";
    return String(id);
  }

  function resetState() {
    state.currentNode = "intro";
    state.previousNode = null;
    state.currentTopic = "arrival";
    state.currentPosture = "arrival";
    state.currentPhase = "receive";
    state.currentScopeLane = SCOPE_OBJECTIVE;
    state.currentVoiceMode = MODE_OBJECTIVE;
    state.currentDepth = 0;
    state.currentRouteHandoffs = [];
    state.topicDepth = {};

    state.visitor.lastChoiceLabel = "";
    state.visitor.lastSignal = "";
    state.visitor.lastItch = "";
    state.visitor.lastTopic = "";
    state.visitor.lastScopeLane = SCOPE_OBJECTIVE;
    state.visitor.routeReadiness = 0;
    state.visitor.loopCount = 0;
    state.visitor.digressionCount = 0;
    state.visitor.progressCount = 0;
    state.visitor.needsRecenter = false;
    state.visitor.trail = [];
  }

  function inferItchFromChoice(choice, topic) {
    if (!choice) return state.visitor.lastItch || "choosing the next door";
    if (choice.signal === "skeptic") return "testing whether the work deserves trust";
    if (choice.signal === "self") return "looking for a mirror";
    if (choice.signal === "world") return "trying to cross into the world side";
    if (choice.signal === "practical") return "looking for something usable";
    if (choice.signal === "lost") return "trying to get re-centered";
    if (topic === "characters" || topic.indexOf("character") === 0) return "trying to understand who carries the world’s pressure";
    if (topic === "underdog") return "trying to understand the voice beneath pressure";
    if (topic === "book" || topic === "nineSummits") return "trying to understand the larger development path";
    return "choosing the next door";
  }

  function updateVisitor(choice, node) {
    var topic = node.topic || "arrival";
    var sameTopic = state.visitor.lastTopic === topic;
    var scopeChanged = state.visitor.lastScopeLane !== node.scopeLane;

    if (sameTopic) {
      state.visitor.progressCount += 1;
      if (node.depth >= 3) state.visitor.routeReadiness += 1;
    } else if (state.visitor.lastTopic) {
      state.visitor.digressionCount += 1;
    }

    if (scopeChanged && state.visitor.lastTopic) {
      state.visitor.digressionCount += 1;
    }

    if (sameTopic && node.depth >= 3) {
      state.visitor.loopCount += 1;
    }

    state.visitor.lastChoiceLabel = choice && choice.label ? choice.label : state.visitor.lastChoiceLabel;
    state.visitor.lastSignal = choice && choice.signal ? choice.signal : "";
    state.visitor.lastItch = inferItchFromChoice(choice, topic);
    state.visitor.lastTopic = topic;
    state.visitor.lastScopeLane = node.scopeLane;

    state.visitor.trail.push({
      node: state.currentNode,
      topic: topic,
      depth: node.depth,
      scopeLane: node.scopeLane,
      label: state.visitor.lastChoiceLabel
    });

    while (state.visitor.trail.length > 16) {
      state.visitor.trail.shift();
    }

    if (state.visitor.digressionCount >= 4 || state.visitor.loopCount >= 3) {
      state.visitor.needsRecenter = true;
    }
  }

  function getTopicStage(topicId, level) {
    var topic = TOPICS[topicId];
    var stageIndex;

    if (!topic) return null;

    stageIndex = clamp((level || 1) - 1, 0, topic.stages.length - 1);
    return topic.stages[stageIndex] || null;
  }

  function makeTopicNode(nodeId, info) {
    var topic = TOPICS[info.topic];
    var stage;
    var level;
    var continuationText;

    if (!topic) return SPECIAL_NODES.intro;

    if (info.continuation && topic.continuations && topic.continuations[info.continuation]) {
      continuationText = topic.continuations[info.continuation];
      level = 3;
      stage = {
        title: "continuation",
        beats: continuationText,
        options: [
          say("Take that deeper.", topicIdToLeadTarget(info.topic)),
          say("Show me where it connects.", topicIdToWhyTarget(info.topic)),
          control("Which door fits this best?", "cleanDoor"),
          back("I need the clean fork again.", "returnFork")
        ]
      };
    } else {
      level = clamp(info.level || 1, 1, MAX_TOPIC_DEPTH);
      stage = getTopicStage(info.topic, level);
    }

    state.topicDepth[info.topic] = Math.max(state.topicDepth[info.topic] || 0, level);

    return {
      node: nodeId,
      topic: info.topic,
      posture: topic.posture,
      phase: level >= 3 ? "continue" : topic.phase,
      scopeLane: topic.scopeLane,
      voiceMode: topic.voiceMode,
      depth: level,
      beats: (stage && stage.beats ? stage.beats : []).slice(),
      options: buildContinuationOptions(info.topic, level, stage),
      handoffs: (topic.handoffs || []).slice()
    };
  }

  function topicIdToWhyTarget(topicId) {
    var map = {
      diamondGateBridge: "diamondGateBridgeWhy",
      compass: "compassWhy",
      siteGuide: "siteGuideWhy",
      proof: "proofWhy",
      laws: "lawsWhy",
      gauges: "gaugesWhy",
      diagnostic: "diagnosticWhy",
      futureProfile: "futureProfileWhy",
      mirrorMe: "mirrorMeWhy",
      sean: "seanWhy",
      underdog: "underdogWhy",
      products: "productsWhy",
      book: "bookWhy",
      nineSummits: "nineSummitsWhy",
      showroom: "showroomWhy",
      interactiveNarrative: "interactiveNarrativeWhy",
      hearth: "hearthWhy",
      audralia: "audraliaWhy",
      frontier: "frontierWhy",
      characters: "charactersWhy",
      characterRelationships: "characterRelationshipsWhy",
      characterTensions: "characterTensionsWhy",
      characterMotives: "characterMotivesWhy",
      characterFactions: "characterFactionsWhy",
      characterStoryPressure: "characterStoryPressureWhy"
    };

    return map[topicId] || "cleanDoor";
  }

  function topicIdToLeadTarget(topicId) {
    var map = {
      diamondGateBridge: "diamondGateBridgeLead",
      compass: "compassLead",
      siteGuide: "siteGuideLead",
      proof: "proofLead",
      laws: "lawsLead",
      gauges: "gaugesLead",
      diagnostic: "diagnosticLead",
      futureProfile: "futureProfileLead",
      mirrorMe: "mirrorMeLead",
      sean: "seanLead",
      underdog: "underdogLead",
      products: "productsLead",
      book: "bookLead",
      nineSummits: "nineSummitsLead",
      showroom: "showroomLead",
      interactiveNarrative: "interactiveNarrativeLead",
      hearth: "hearthLead",
      audralia: "audraliaLead",
      frontier: "frontierLead",
      characters: "charactersLead",
      characterRelationships: "characterRelationshipsLead",
      characterTensions: "characterTensionsLead",
      characterMotives: "characterMotivesLead",
      characterFactions: "characterFactionsLead",
      characterStoryPressure: "characterStoryPressureLead"
    };

    return map[topicId] || "cleanDoor";
  }

  function buildContinuationOptions(topicId, level, stage) {
    var options = stage && stage.options ? stage.options.slice() : [];

    if (level === 1) {
      if (!hasTarget(options, topicIdToWhyTarget(topicId))) {
        options.push(say("Why does this matter?", topicIdToWhyTarget(topicId)));
      }
      if (!hasTarget(options, topicIdToLeadTarget(topicId))) {
        options.push(say("Where does this lead?", topicIdToLeadTarget(topicId)));
      }
    }

    if (level === 2 && !hasTarget(options, topicIdToLeadTarget(topicId))) {
      options.push(say("Where does this lead?", topicIdToLeadTarget(topicId)));
    }

    if (level >= 2 && !hasTarget(options, "cleanDoor")) {
      options.push(control("Which door fits this best?", "cleanDoor"));
    }

    if (state.visitor.needsRecenter && !hasTarget(options, "recenterNode")) {
      options.push(control("Re-center me.", "recenterNode"));
    }

    if (!hasTarget(options, "returnFork") && level >= 3) {
      options.push(back("I need the clean fork again.", "returnFork"));
    }

    return dedupeOptions(options).slice(0, 6);
  }

  function hasTarget(options, target) {
    return (options || []).some(function someOption(item) {
      return item && item.target === target;
    });
  }

  function dedupeOptions(options) {
    var seen = {};
    var clean = [];

    (options || []).forEach(function eachOption(item) {
      var key;

      if (!item || !item.label || !item.target) return;

      key = item.label + "::" + item.target;
      if (seen[key]) return;

      seen[key] = true;
      clean.push(item);
    });

    return clean;
  }

  function buildCleanDoorNode() {
    var topic = state.currentTopic;
    var current = TOPICS[topic];
    var scope = state.currentScopeLane;
    var beats = [];
    var options = [];
    var handoffs = [];

    if (!current) {
      return SPECIAL_NODES.recenterNode;
    }

    beats.push("The cleanest next door depends on why you are still here.");
    beats.push("Right now, you seem to be " + state.visitor.lastItch + ".");

    if (topic.indexOf("character") === 0 || topic === "characters") {
      beats.push("Stay with the Characters if you want pressure to become personal. Move to the Interactive Narrative if you want the world path around them.");
      options = [
        say("Keep explaining the characters.", "charactersLead"),
        say("Explain their relationships.", "characterRelationshipsPath"),
        say("Explain their conflict.", "characterTensionsPath"),
        say("Tell me about Mirror Me.", "mirrorMePath"),
        back("I need the clean fork again.", "returnFork")
      ];
      handoffs = ["characters", "interactiveNarrative"];
    } else if (scope === SCOPE_NARRATIVE) {
      beats.push("Stay on the world side if you want threshold, rooms, people, and traversal. Return to the public side if you want proof or orientation first.");
      options = [
        say("Tell me about the Interactive Narrative.", "worldGatePath"),
        say("Tell me about Hearth.", "hearthPath"),
        say("Tell me about Audralia.", "audraliaPath"),
        say("Who are the characters?", "charactersPath"),
        back("I need the public fork again.", "returnFork")
      ];
      handoffs = ["interactiveNarrative", "hearth", "audralia", "characters"];
    } else if (topic === "proof" || topic === "laws" || topic === "gauges") {
      beats.push("Stay with proof if you want the work tested before you trust it.");
      options = [
        say("Explain the Laws.", "lawsPath"),
        say("Explain Gauges.", "gaugesPath"),
        say("Explain the Diagnostic.", "diagnosticPath"),
        say("Tell me about Sean.", "seanPath"),
        back("I need the clean fork again.", "returnFork")
      ];
      handoffs = ["laws", "gauges", "coherenceDiagnostic"];
    } else if (topic === "diagnostic" || topic === "futureProfile" || topic === "mirrorMe") {
      beats.push("Stay with the mirror path if you want pressure, choice, and self-recognition to become visible.");
      options = [
        say("Tell me about the Diagnostic.", "diagnosticPath"),
        say("Tell me about Future Profile.", "futureProfilePath"),
        say("Tell me about Mirror Me.", "mirrorMePath"),
        say("Tell me about This Underdog.", "underdogPath"),
        back("I need the clean fork again.", "returnFork")
      ];
      handoffs = ["coherenceDiagnostic", "interactiveNarrative"];
    } else {
      beats.push("Stay public if you need orientation, proof, usefulness, or the human voice. Cross the threshold if you want the world side.");
      options = [
        say("I need orientation.", "compassPath"),
        say("I want proof.", "proofPath"),
        say("I want self-reflection.", "diagnosticPath"),
        say("I want the world side.", "worldPath"),
        back("I need the clean fork again.", "returnFork")
      ];
      handoffs = ["compass", "siteGuide", "laws", "coherenceDiagnostic"];
    }

    return {
      node: "cleanDoor",
      topic: topic,
      posture: scope === SCOPE_NARRATIVE ? "world" : "orientation",
      phase: "route",
      scopeLane: scope,
      voiceMode: scope === SCOPE_NARRATIVE ? MODE_THRESHOLD : MODE_OBJECTIVE,
      depth: 3,
      beats: beats,
      options: options,
      handoffs: handoffs
    };
  }

  function getNode(nodeId, choice) {
    var id = normalizeNode(nodeId);
    var special = SPECIAL_NODES[id];
    var info = TARGETS[id];

    if (special && special.reset) {
      resetState();
    }

    if (id === "cleanDoor") {
      return buildCleanDoorNode();
    }

    if (special) {
      return {
        node: id,
        topic: id,
        posture: special.posture || "arrival",
        phase: special.phase || "receive",
        scopeLane: special.scopeLane || SCOPE_OBJECTIVE,
        voiceMode: special.voiceMode || MODE_OBJECTIVE,
        depth: 0,
        beats: (special.beats || []).slice(),
        options: (special.options || []).slice(),
        handoffs: (special.handoffs || []).slice()
      };
    }

    if (info) {
      return makeTopicNode(id, info, choice);
    }

    return getNode("intro", choice);
  }

  function updateCurrentState(nodeId, node, choice) {
    state.previousNode = state.currentNode;
    state.currentNode = normalizeNode(nodeId);
    state.currentTopic = node.topic || "arrival";
    state.currentPosture = node.posture || "arrival";
    state.currentPhase = node.phase || "receive";
    state.currentScopeLane = node.scopeLane || SCOPE_OBJECTIVE;
    state.currentVoiceMode = node.voiceMode || MODE_OBJECTIVE;
    state.currentDepth = node.depth || 0;
    state.currentRouteHandoffs = (node.handoffs || []).slice();
    state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);

    updateVisitor(choice, node);

    state.history.push({
      node: state.currentNode,
      topic: state.currentTopic,
      posture: state.currentPosture,
      phase: state.currentPhase,
      scopeLane: state.currentScopeLane,
      voiceMode: state.currentVoiceMode,
      depth: state.currentDepth,
      itch: state.visitor.lastItch,
      stateIndex: state.stateIndex
    });

    while (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }
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
    var cleanLabel = sanitizeConversationLabel(item.label, item.target);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", item.type || "conversation");
    button.setAttribute("data-option-target", item.target || "");

    if (label) {
      label.textContent = cleanLabel;
    } else {
      button.textContent = cleanLabel;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption({
        label: cleanLabel,
        target: item.target,
        type: item.type || "conversation",
        signal: item.signal || "",
        scopeLane: item.scopeLane || null
      });
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
          state.currentPosture === "skeptic" ||
          state.currentPosture === "characters"
        )
      });

      await waitSkippable(getReadDelay(beat), "reading");
    }

    if (token !== state.runToken) return false;

    await waitSkippable(PACING.optionRevealDelayMs, "options");

    return token === state.runToken;
  }

  async function requestJeevesBrain(payload) {
    state.backendBridge.lastRequest = safeClone(payload);
    state.backendBridge.lastStatus = "dormant";

    return {
      enabled: false,
      status: "dormant",
      bubbles: [],
      options: [],
      handoffs: [],
      reason: "Backend brain endpoint is assigned but not connected in this front-end pass."
    };
  }

  async function maybeUseGenerativeResponse(_node, _choice) {
    return null;
  }

  async function runNode(nodeId, settings) {
    var token;
    var node;
    var choice;
    var completed;
    var generated;

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    choice = settings && settings.choice ? settings.choice : null;
    node = getNode(nodeId, choice);

    updateCurrentState(nodeId, node, choice);
    hideOptions();

    generated = await maybeUseGenerativeResponse(node, choice);

    if (generated && generated.bubbles && generated.bubbles.length) {
      node.beats = generated.bubbles;
      if (generated.options) node.options = generated.options;
      if (generated.handoffs) node.handoffs = generated.handoffs;
    }

    await waitFixed(settings && settings.fast ? PACING.firstMessageDelayMs : 420);

    if (token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    completed = await playBeats(node.beats || [], token);

    if (!completed || token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    renderOptions(node.options || []);
    renderHandoffs(node.handoffs || []);

    state.busy = false;
    clearTapAdvance();
    scrollThread();
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
      return { target: "recenterNode", signal: "lost" };
    }

    if (
      value.indexOf("relationship") !== -1 ||
      value.indexOf("relate") !== -1 ||
      value.indexOf("between characters") !== -1
    ) {
      return { target: "characterRelationshipsPath", signal: "characters" };
    }

    if (
      value.indexOf("conflict") !== -1 ||
      value.indexOf("tension") !== -1 ||
      value.indexOf("pressure") !== -1
    ) {
      return { target: "characterTensionsPath", signal: "characters" };
    }

    if (
      value.indexOf("motive") !== -1 ||
      value.indexOf("want") !== -1 ||
      value.indexOf("why do") !== -1
    ) {
      return { target: "characterMotivesPath", signal: "characters" };
    }

    if (
      value.indexOf("faction") !== -1 ||
      value.indexOf("side") !== -1 ||
      value.indexOf("alliance") !== -1
    ) {
      return { target: "characterFactionsPath", signal: "characters" };
    }

    if (
      value.indexOf("character") !== -1 ||
      value.indexOf("people") !== -1 ||
      value.indexOf("who lives") !== -1
    ) {
      return { target: "charactersPath", signal: "characters" };
    }

    if (
      value.indexOf("underdog") !== -1 ||
      value.indexOf("inner voice") !== -1 ||
      value.indexOf("voice") !== -1
    ) {
      return { target: "underdogPath", signal: "human" };
    }

    if (
      value.indexOf("sean") !== -1 ||
      value.indexOf("founder") !== -1 ||
      value.indexOf("person") !== -1 ||
      value.indexOf("human") !== -1
    ) {
      return { target: "seanPath", signal: "human" };
    }

    if (
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("hearth") !== -1 ||
      value.indexOf("audralia") !== -1 ||
      value.indexOf("frontier") !== -1 ||
      value.indexOf("world") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("showroom") !== -1
    ) {
      return { target: "worldPath", signal: "world" };
    }

    if (
      value.indexOf("proof") !== -1 ||
      value.indexOf("law") !== -1 ||
      value.indexOf("real") !== -1 ||
      value.indexOf("evidence") !== -1 ||
      value.indexOf("test") !== -1 ||
      value.indexOf("skeptic") !== -1
    ) {
      return { target: "proofPath", signal: "skeptic" };
    }

    if (
      value.indexOf("diagnostic") !== -1 ||
      value.indexOf("coherence") !== -1 ||
      value.indexOf("self") !== -1 ||
      value.indexOf("reflect") !== -1
    ) {
      return { target: "diagnosticPath", signal: "self" };
    }

    if (
      value.indexOf("product") !== -1 ||
      value.indexOf("tool") !== -1 ||
      value.indexOf("use") !== -1 ||
      value.indexOf("practical") !== -1
    ) {
      return { target: "productsPath", signal: "practical" };
    }

    if (
      value.indexOf("book") !== -1 ||
      value.indexOf("summit") !== -1 ||
      value.indexOf("love") !== -1
    ) {
      return { target: "bookPath", signal: "book" };
    }

    if (
      value.indexOf("start") !== -1 ||
      value.indexOf("where") !== -1 ||
      value.indexOf("begin") !== -1
    ) {
      return { target: "compassPath", signal: "orientation" };
    }

    return { target: "askFirst", signal: "question" };
  }

  function ask(text) {
    var result = classifyText(text);

    if (state.busy) return;

    addMessage("visitor", text);
    runNode(result.target, {
      choice: {
        label: text,
        target: result.target,
        signal: result.signal
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
      futureBrainEndpoint: FUTURE_BRAIN_ENDPOINT,
      state: state,
      topics: TOPICS,
      targets: TARGETS,
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      requestJeevesBrain: requestJeevesBrain,
      maybeUseGenerativeResponse: maybeUseGenerativeResponse,
      tapAdvance: requestTapAdvance,
      getState: function getState() {
        return safeClone(state);
      },
      getTopic: function getTopic(id) {
        return safeClone(TOPICS[id]);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id, null));
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
