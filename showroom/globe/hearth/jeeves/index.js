// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_20_ORGAN_CONVERSATIONAL_FUNNEL_ENGINE_TNT_v4
// Full-file replacement.
// Owns: collapsed Jeeves conversation host, 20 internal conversational organs, deterministic visitor funnel, guided route handoffs.
// Does not own: HTML shell, CSS styling, backend, storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeevesTwentyOrganConversationalFunnel(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_20_ORGAN_CONVERSATIONAL_FUNNEL_ENGINE_TNT_v4";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var BEAT_DELAY_MS = 115;
  var START_DELAY_MS = 90;

  var DEFAULT_ROUTES = {
    compass: "/",
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    interactiveNarrative: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    frontier: "/explore/frontier/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/hearth/diagnostic/",
    siteGuide: "/site-guide/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    meetSean: "/meet-sean-mansfield/",
    products: "/products/",
    laws: "/laws/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    book: "/nine-summits-of-love/",
    nineSummits: "/nine-summits/",
    aboutUnderdog: "/about-this-underdog/"
  };

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    currentNode: "arrival",
    previousNode: null,
    currentOrgan: "arrival",
    currentIntent: "arrival",
    cycleStep: 0,
    curiosityLevel: 1,
    skepticismLevel: 0,
    lastSuggestedRoutes: [],
    acceptedRoute: null,
    history: [],
    busy: false,
    initialized: false
  };

  var els = {};
  var config = {};

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

  var ROUTE_LABELS = {
    compass: "Start at the Compass",
    siteGuide: "Open the Site Guide",
    coherenceDiagnostic: "Take the Coherence Diagnostic",
    meetSean: "Meet Sean Mansfield",
    products: "Open Products",
    laws: "Read the Laws",
    gauges: "Open Gauges",
    interactiveNarrative: "Enter the Interactive Narrative",
    globeWindow: "Enter the World Gate",
    hearth: "Return to Hearth",
    audralia: "Visit Audralia",
    frontier: "Explore Frontier",
    characters: "Meet the Characters",
    controlRoom: "Open the Control Room",
    book: "Open The Nine Summits of Love",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "About This Underdog"
  };

  var NODES = {
    arrival: {
      organ: "arrival",
      intent: "arrival",
      beats: [
        "Welcome to Diamond Gate Bridge.",
        "You are not meant to understand the whole house from the doorway.",
        "I can guide you through the website, or I can take you toward the world behind it."
      ],
      options: [
        { label: "Guide me through the website.", target: "websitePath", type: "conversation" },
        { label: "Take me toward the world behind it.", target: "worldPath", type: "conversation" },
        { label: "I’m skeptical. Explain it plainly.", target: "skepticPlain", type: "calibration" },
        { label: "Just tell me where to start.", target: "whereToStart", type: "conversation" }
      ],
      handoffs: []
    },

    websitePath: {
      organ: "firstFork",
      intent: "website",
      beats: [
        "Then we will use the public side of the estate.",
        "The website gives you doors into proof, products, Sean, self-reflection, and the story-world.",
        "The right first door depends on why you came in."
      ],
      options: [
        { label: "I need proof before imagination.", target: "proofPath", type: "topic" },
        { label: "I want practical use.", target: "productsPath", type: "topic" },
        { label: "I want to know who Sean is.", target: "seanPath", type: "topic" },
        { label: "I want the world side instead.", target: "worldPath", type: "conversation" }
      ],
      handoffs: ["compass", "siteGuide", "coherenceDiagnostic"]
    },

    worldPath: {
      organ: "firstFork",
      intent: "world",
      beats: [
        "Then we move toward the world behind the site.",
        "That path is not a lecture. It is the place where the estate begins to feel inhabited.",
        "Mirrorland, Hearth, Audralia, Frontier, characters, profiles, NPCs, and Mirror Me all belong to that deeper direction."
      ],
      options: [
        { label: "Open the world gate.", target: "worldGatePath", type: "route" },
        { label: "Tell me about the characters.", target: "charactersPath", type: "topic" },
        { label: "Explain Mirror Me.", target: "mirrorMePath", type: "topic" },
        { label: "Take me back to the website path.", target: "websitePath", type: "back" }
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia"]
    },

    skepticPlain: {
      organ: "skeptic",
      intent: "skeptic",
      skepticism: 2,
      beats: [
        "Plainly: this is a guided estate, not a normal website.",
        "It uses story, proof, diagnostics, and practical doors to help a visitor enter a large system without getting lost.",
        "If you want to test whether it has structure, start with Laws or the Diagnostic before the imaginative rooms."
      ],
      options: [
        { label: "Show me the Laws.", target: "proofPath", type: "topic" },
        { label: "Show me the Diagnostic.", target: "diagnosticPath", type: "topic" },
        { label: "Show me practical use.", target: "productsPath", type: "topic" },
        { label: "Now I’ll try the world side.", target: "worldPath", type: "conversation" }
      ],
      handoffs: ["laws", "coherenceDiagnostic", "compass"]
    },

    whereToStart: {
      organ: "orientation",
      intent: "orientation",
      beats: [
        "Start by choosing your pressure point.",
        "If you are confused, use the Compass. If you are skeptical, use Laws. If you want to see yourself in the system, use the Diagnostic.",
        "If you want practical use, go to Products."
      ],
      options: [
        { label: "I want orientation.", target: "compassPath", type: "topic" },
        { label: "I want proof.", target: "proofPath", type: "topic" },
        { label: "I want self-reflection.", target: "diagnosticPath", type: "topic" },
        { label: "I want practical use.", target: "productsPath", type: "topic" }
      ],
      handoffs: ["compass", "laws", "coherenceDiagnostic", "products"]
    },

    compassPath: {
      organ: "compass",
      intent: "orientation",
      beats: [
        "The Compass is the cleanest first door.",
        "It is not there to impress you. It is there to stop the estate from feeling like a maze.",
        "From there, you can choose the Diagnostic, the public site, or a guided path inward."
      ],
      options: [
        { label: "Take me to the Compass.", target: "handoffCompass", type: "route" },
        { label: "Explain the Diagnostic first.", target: "diagnosticPath", type: "topic" },
        { label: "Explain proof first.", target: "proofPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["compass"]
    },

    proofPath: {
      organ: "proof",
      intent: "proof",
      skepticism: 1,
      beats: [
        "The proof path begins with the Laws.",
        "That is where the estate says what can be claimed, what must be checked, and why proof outranks confidence.",
        "Gauges are the more technical status path."
      ],
      options: [
        { label: "Read the Laws.", target: "handoffLaws", type: "route" },
        { label: "Open Gauges.", target: "handoffGauges", type: "route" },
        { label: "Show me the Diagnostic.", target: "diagnosticPath", type: "topic" },
        { label: "I’m ready for the world side.", target: "worldPath", type: "conversation" }
      ],
      handoffs: ["laws", "gauges", "coherenceDiagnostic"]
    },

    diagnosticPath: {
      organ: "diagnostic",
      intent: "diagnostic",
      beats: [
        "The Coherence Diagnostic is the personal mirror.",
        "It asks how coherent you believe yourself to be, then compares that claim against pressure scenarios.",
        "It is reflective, local-only, and not a medical, legal, employment, IQ, or official personality test."
      ],
      options: [
        { label: "Take me to the Diagnostic.", target: "handoffDiagnostic", type: "route" },
        { label: "How does this become a profile later?", target: "futureProfilePath", type: "topic" },
        { label: "Show me proof instead.", target: "proofPath", type: "topic" },
        { label: "Back to the first fork.", target: "returnFork", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic"]
    },

    seanPath: {
      organ: "sean",
      intent: "sean",
      beats: [
        "Sean is the human voice behind this side of the bridge.",
        "He turns pressure into language, and language into rooms other people can walk through.",
        "If you want the person behind the estate, Meet Sean is the cleanest door."
      ],
      options: [
        { label: "Meet Sean.", target: "handoffSean", type: "route" },
        { label: "What is This Underdog?", target: "underdogPath", type: "topic" },
        { label: "Show me the practical doors.", target: "productsPath", type: "topic" },
        { label: "Back to website path.", target: "websitePath", type: "back" }
      ],
      handoffs: ["meetSean", "aboutUnderdog"]
    },

    underdogPath: {
      organ: "sean",
      intent: "sean",
      beats: [
        "This Underdog is part of the voice of the house.",
        "It is pressure turned into comedy, story, and usable language.",
        "That matters because the estate cannot become only technical. It has to stay human."
      ],
      options: [
        { label: "Open About This Underdog.", target: "handoffUnderdog", type: "route" },
        { label: "Meet Sean instead.", target: "seanPath", type: "topic" },
        { label: "Show me the book path.", target: "bookPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["aboutUnderdog", "meetSean"]
    },

    productsPath: {
      organ: "products",
      intent: "products",
      beats: [
        "Products are where the message becomes usable.",
        "They are not just labels on a shelf. They are doors into support, games, education, nutrition, the book, and practical paths.",
        "This is the route for a visitor who wants use before lore."
      ],
      options: [
        { label: "Open Products.", target: "handoffProducts", type: "route" },
        { label: "Show me the book path.", target: "bookPath", type: "topic" },
        { label: "Tell me who Sean is.", target: "seanPath", type: "topic" },
        { label: "Back to website guide.", target: "websitePath", type: "back" }
      ],
      handoffs: ["products", "book", "nineSummits"]
    },

    bookPath: {
      organ: "book",
      intent: "book",
      beats: [
        "The Nine Summits path is the book and seminar side of the estate.",
        "It turns pressure, love, self-understanding, and voice into a human development path.",
        "Use that door if you want the message in a more personal form."
      ],
      options: [
        { label: "Open the book.", target: "handoffBook", type: "route" },
        { label: "Open Nine Summits.", target: "handoffNineSummits", type: "route" },
        { label: "Tell me about Sean.", target: "seanPath", type: "topic" },
        { label: "Back to Products.", target: "productsPath", type: "back" }
      ],
      handoffs: ["book", "nineSummits"]
    },

    worldGatePath: {
      organ: "worldGate",
      intent: "world-route",
      beats: [
        "The world gate is where explanation gives way to entry.",
        "If you choose that door, the estate should stop acting like a brochure and start acting like a place.",
        "That is the correct path if you want Mirrorland rather than a site tour."
      ],
      options: [
        { label: "Enter the Interactive Narrative.", target: "handoffWorld", type: "route" },
        { label: "Visit Hearth first.", target: "hearthPath", type: "topic" },
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Back to the first fork.", target: "returnFork", type: "back" }
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia", "frontier"]
    },

    hearthPath: {
      organ: "hearth",
      intent: "hearth",
      beats: [
        "Hearth is the house-side world.",
        "It is the place from which this interface is speaking.",
        "If Mirrorland is the larger direction, Hearth is the immediate chamber."
      ],
      options: [
        { label: "Return to Hearth.", target: "handoffHearth", type: "route" },
        { label: "Enter the world gate.", target: "worldGatePath", type: "route" },
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Meet the Characters.", target: "charactersPath", type: "topic" }
      ],
      handoffs: ["hearth", "interactiveNarrative", "audralia"]
    },

    audraliaPath: {
      organ: "audralia",
      intent: "audralia",
      beats: [
        "Audralia is one of the visible world lanes beyond Hearth.",
        "It is not the first explanation door. It is a deeper route for visitors who want the estate to expand outward.",
        "I would send you there after you understand that this is a world path, not a normal page jump."
      ],
      options: [
        { label: "Visit Audralia.", target: "handoffAudralia", type: "route" },
        { label: "Explore Frontier.", target: "frontierPath", type: "topic" },
        { label: "Return to Hearth.", target: "hearthPath", type: "back" },
        { label: "Back to world gate.", target: "worldGatePath", type: "back" }
      ],
      handoffs: ["audralia", "frontier", "hearth"]
    },

    frontierPath: {
      organ: "frontier",
      intent: "frontier",
      beats: [
        "Frontier is the outward discovery path.",
        "Use it when you want the edge of the estate rather than the center of the house.",
        "It is a good route after Hearth or Audralia, not before orientation."
      ],
      options: [
        { label: "Explore Frontier.", target: "handoffFrontier", type: "route" },
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Return to the world gate.", target: "worldGatePath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["frontier", "audralia", "interactiveNarrative"]
    },

    charactersPath: {
      organ: "characters",
      intent: "characters",
      beats: [
        "The characters are not menu labels.",
        "They are people inside the world path, and their job is to make the estate feel inhabited.",
        "You do not need to memorize them at the doorway. You only need to decide whether you want the world to become personal."
      ],
      options: [
        { label: "Meet the Characters.", target: "handoffCharacters", type: "route" },
        { label: "Explain Mirror Me.", target: "mirrorMePath", type: "topic" },
        { label: "Enter the Interactive Narrative.", target: "worldGatePath", type: "route" },
        { label: "Back to world path.", target: "worldPath", type: "back" }
      ],
      handoffs: ["characters", "interactiveNarrative"]
    },

    futureProfilePath: {
      organ: "futureProfile",
      intent: "future-profile",
      beats: [
        "The future profile is where the Diagnostic becomes more than a result on a page.",
        "The idea is that your pattern can eventually travel with you through the estate.",
        "That should remain a user path, not a paywall at the gate."
      ],
      options: [
        { label: "Start with the Diagnostic.", target: "diagnosticPath", type: "topic" },
        { label: "Explain Mirror Me.", target: "mirrorMePath", type: "topic" },
        { label: "Enter the world path.", target: "worldGatePath", type: "route" },
        { label: "Back to the first fork.", target: "returnFork", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic", "interactiveNarrative"]
    },

    mirrorMePath: {
      organ: "mirrorMe",
      intent: "mirror-me",
      beats: [
        "Mirror Me is the higher-self challenge path.",
        "Not a clone. Not a gimmick. A reflected version of what the visitor could become when the world begins answering them back.",
        "That is future-facing, so I will not pretend it is fully live today."
      ],
      options: [
        { label: "Start with the Diagnostic.", target: "diagnosticPath", type: "topic" },
        { label: "Meet the Characters.", target: "charactersPath", type: "topic" },
        { label: "Enter the world gate.", target: "worldGatePath", type: "route" },
        { label: "Back to future profile.", target: "futureProfilePath", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic", "characters", "interactiveNarrative"]
    },

    routeHandoff: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "That is the right door.",
        "The point of this conversation is not to keep you here.",
        "It is to make the next click feel earned."
      ],
      options: [
        { label: "Restart the first fork.", target: "restartFork", type: "restart" },
        { label: "Show me another path.", target: "websitePath", type: "back" }
      ],
      handoffs: ["compass"]
    },

    returnFork: {
      organ: "return",
      intent: "return",
      beats: [
        "Then we will return to the clean fork.",
        "Website first, or world behind it.",
        "That choice decides the next door."
      ],
      options: [
        { label: "Guide me through the website.", target: "websitePath", type: "conversation" },
        { label: "Take me toward the world behind it.", target: "worldPath", type: "conversation" },
        { label: "I’m skeptical. Explain it plainly.", target: "skepticPlain", type: "calibration" },
        { label: "Just tell me where to start.", target: "whereToStart", type: "conversation" }
      ],
      handoffs: []
    },

    restartFork: {
      organ: "restart",
      intent: "restart",
      beats: [
        "Clean reset.",
        "You are back at the doorway.",
        "Do you want the website, or the world behind it?"
      ],
      options: [
        { label: "Guide me through the website.", target: "websitePath", type: "conversation" },
        { label: "Take me toward the world behind it.", target: "worldPath", type: "conversation" },
        { label: "I’m skeptical. Explain it plainly.", target: "skepticPlain", type: "calibration" },
        { label: "Just tell me where to start.", target: "whereToStart", type: "conversation" }
      ],
      handoffs: []
    },

    handoffCompass: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open the Compass.",
        "It is the cleanest orientation point.",
        "Use it when you want the estate to stop feeling like a maze."
      ],
      options: [
        { label: "Show me another path.", target: "websitePath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["compass"]
    },

    handoffDiagnostic: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open the Diagnostic.",
        "It is the cleanest mirror path.",
        "That is where the estate starts with the visitor instead of the map."
      ],
      options: [
        { label: "Show me proof instead.", target: "proofPath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["coherenceDiagnostic"]
    },

    handoffLaws: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open the Laws.",
        "That is where the estate makes its proof posture visible.",
        "If you need structure before story, that is the correct door."
      ],
      options: [
        { label: "Open Gauges too.", target: "handoffGauges", type: "route" },
        { label: "Show me the Diagnostic.", target: "diagnosticPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["laws"]
    },

    handoffGauges: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open Gauges if you want the more technical status path.",
        "Laws explain the standard.",
        "Gauges point toward whether the estate is holding that standard."
      ],
      options: [
        { label: "Read the Laws too.", target: "handoffLaws", type: "route" },
        { label: "Back to proof path.", target: "proofPath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["gauges"]
    },

    handoffProducts: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open Products.",
        "That is where the estate becomes usable.",
        "Use that door when you want application before explanation."
      ],
      options: [
        { label: "Show me the book path.", target: "bookPath", type: "topic" },
        { label: "Tell me who Sean is.", target: "seanPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["products"]
    },

    handoffSean: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open Meet Sean.",
        "That is the cleanest path to the human voice behind the house.",
        "If the estate feels unusual, that door explains the person behind the pressure and language."
      ],
      options: [
        { label: "Show me This Underdog too.", target: "underdogPath", type: "topic" },
        { label: "Show me the Products path.", target: "productsPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["meetSean"]
    },

    handoffUnderdog: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open About This Underdog.",
        "That path carries the comedy, pressure, and human voice side of the estate.",
        "It keeps the system from becoming only architecture."
      ],
      options: [
        { label: "Meet Sean instead.", target: "seanPath", type: "topic" },
        { label: "Show me the book path.", target: "bookPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["aboutUnderdog"]
    },

    handoffBook: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open The Nine Summits of Love.",
        "That is the book path.",
        "Use it when you want the message carried as human development rather than site navigation."
      ],
      options: [
        { label: "Open Nine Summits too.", target: "handoffNineSummits", type: "route" },
        { label: "Back to Products.", target: "productsPath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["book"]
    },

    handoffNineSummits: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open Nine Summits.",
        "That is the wider development path around the book and seminar system.",
        "It is a better door for the framework than for the world-lore path."
      ],
      options: [
        { label: "Open the book too.", target: "handoffBook", type: "route" },
        { label: "Back to Products.", target: "productsPath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["nineSummits"]
    },

    handoffCharacters: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Open Characters.",
        "That is where the world becomes populated instead of merely explained.",
        "Use that door if you want people, not just architecture."
      ],
      options: [
        { label: "Enter the Interactive Narrative too.", target: "worldGatePath", type: "route" },
        { label: "Explain Mirror Me.", target: "mirrorMePath", type: "topic" },
        { label: "Back to world path.", target: "worldPath", type: "back" }
      ],
      handoffs: ["characters"]
    },

    handoffWorld: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Enter the Interactive Narrative.",
        "That is the right next door if you want the world behind the website.",
        "At that point, the estate should stop explaining itself and start opening."
      ],
      options: [
        { label: "Visit Hearth first.", target: "hearthPath", type: "topic" },
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["interactiveNarrative"]
    },

    handoffHearth: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Return to Hearth.",
        "That is the house-side world before the outward lanes.",
        "It is the proper place to re-enter if you want the estate close to its home chamber."
      ],
      options: [
        { label: "Enter the Interactive Narrative.", target: "worldGatePath", type: "route" },
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["hearth"]
    },

    handoffAudralia: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Visit Audralia.",
        "That is one of the visible world lanes beyond Hearth.",
        "Use it when you want the estate to expand outward."
      ],
      options: [
        { label: "Explore Frontier.", target: "frontierPath", type: "topic" },
        { label: "Return to Hearth.", target: "hearthPath", type: "back" },
        { label: "Back to the world gate.", target: "worldGatePath", type: "back" }
      ],
      handoffs: ["audralia"]
    },

    handoffFrontier: {
      organ: "routeHandoff",
      intent: "handoff",
      beats: [
        "Explore Frontier.",
        "That is the outward-facing discovery path.",
        "It is best used after you know you are leaving the lobby."
      ],
      options: [
        { label: "Visit Audralia.", target: "audraliaPath", type: "topic" },
        { label: "Back to the world gate.", target: "worldGatePath", type: "back" },
        { label: "Restart the first fork.", target: "restartFork", type: "restart" }
      ],
      handoffs: ["frontier"]
    }
  };

  function query(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function readConfig() {
    var script = query("#jeevesConversationConfig");

    if (!script) {
      return {
        route: ROUTE,
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        route: ROUTE,
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
      els.statusText.textContent = text;
    }
  }

  function setTyping(isTyping) {
    if (!els.typing) return;

    els.typing.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    els.typing.setAttribute("aria-hidden", isTyping ? "false" : "true");

    setStatus(isTyping ? "thinking" : "listening", isTyping ? "Jeeves considering" : "House listening");
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
      // Non-critical.
    }
  }

  function cloneTemplate(template, fallbackTag) {
    if (template && template.content && template.content.firstElementChild) {
      return template.content.firstElementChild.cloneNode(true);
    }

    return document.createElement(fallbackTag || "div");
  }

  function addMessage(origin, text, settings) {
    if (!els.thread) return null;

    var message = cloneTemplate(els.messageTemplate, "article");
    var name = query(".jeeves-message-name", message);
    var paragraph = query("p", message);

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

  function makeOptionButton(option) {
    var button = cloneTemplate(els.optionTemplate, "button");
    var label = query("span", button);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", option.type || "conversation");
    button.setAttribute("data-option-target", option.target || "");

    if (label) {
      label.textContent = option.label;
    } else {
      button.textContent = option.label;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption(option);
    });

    return button;
  }

  function makeRouteLink(routeOption) {
    var link = cloneTemplate(els.routeOptionTemplate, "a");
    var label = query("span", link);

    link.classList.add("jeeves-option");
    link.classList.add("jeeves-option-route");
    link.setAttribute("href", routeOption.href || "#");
    link.setAttribute("data-option-type", "route");
    link.setAttribute("data-option-target", routeOption.id || "");

    if (label) {
      label.textContent = routeOption.label;
    } else {
      link.textContent = routeOption.label;
    }

    link.addEventListener("click", function onRouteClick() {
      state.acceptedRoute = routeOption.id;
    });

    return link;
  }

  function renderOptions(options) {
    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    (options || []).forEach(function eachOption(option) {
      els.promptGrid.appendChild(makeOptionButton(option));
    });
  }

  function renderHandoffs(ids) {
    var handoffs = (ids || [])
      .map(function mapHandoff(item) {
        if (typeof item === "string") {
          return getHandoff(item);
        }

        return item;
      })
      .filter(function validHandoff(item) {
        return item && item.href && item.href !== "#";
      });

    clearElement(els.handoffGrid);

    state.lastSuggestedRoutes = handoffs.map(function mapRoute(item) {
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
    state.currentNode = nodeId;
    state.currentOrgan = node.organ || state.currentOrgan;
    state.currentIntent = node.intent || state.currentIntent;
    state.cycleStep = (state.cycleStep + 1) % 9;

    if (typeof node.skepticism === "number") {
      state.skepticismLevel = Math.max(state.skepticismLevel, node.skepticism);
    }

    if (
      node.intent === "world" ||
      node.intent === "characters" ||
      node.intent === "mirror-me" ||
      node.intent === "future-profile"
    ) {
      state.curiosityLevel = Math.max(state.curiosityLevel, 2);
    }

    state.history.push({
      node: nodeId,
      organ: state.currentOrgan,
      intent: state.currentIntent
    });

    if (state.history.length > 24) {
      state.history.shift();
    }
  }

  function renderBeats(beats, index, done) {
    var list = beats || [];

    if (index >= list.length) {
      done();
      return;
    }

    addMessage("jeeves", list[index], {
      emphasis: index === 0 && (state.currentNode === "arrival" || state.currentNode === "skepticPlain")
    });

    window.setTimeout(function nextBeat() {
      renderBeats(list, index + 1, done);
    }, BEAT_DELAY_MS);
  }

  function runNode(nodeId, settings) {
    var node = NODES[nodeId] || NODES.arrival;
    var startDelay = settings && settings.fast ? START_DELAY_MS : START_DELAY_MS + 40;

    if (state.busy) return;

    state.busy = true;
    updateState(nodeId, node);
    renderOptions([]);
    renderHandoffs([]);
    setTyping(true);

    window.setTimeout(function beginResponse() {
      setTyping(false);

      renderBeats(node.beats, 0, function afterBeats() {
        renderOptions(node.options);
        renderHandoffs(node.handoffs);
        state.busy = false;
        scrollThread();
      });
    }, startDelay);
  }

  function handleOption(option) {
    if (!option || !option.target || state.busy) return;

    addMessage("visitor", option.label);
    runNode(option.target);
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
      routes: mergeRoutes,
      runNode: runNode,
      getNode: function getNode(id) {
        return NODES[id] || null;
      },
      getNodes: function getNodes() {
        return NODES;
      }
    };

    global.JEEVES_ENGINE = global.HEARTH.JEEVES.engine;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
  }

  function init() {
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

    addMessage("system", "The house interface is active. Jeeves will guide the route when the conversation earns the door.");

    runNode(config.initialNode || "arrival", {
      fast: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
