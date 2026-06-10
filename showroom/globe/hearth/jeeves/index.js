// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_AAI_F89_TOOL_REGISTRY_CONVERSATIONAL_CYCLE_ENGINE_TNT_v8
// Full-file replacement.
// Jeeves / Talk to the House.
// Class: Artificial Agent Intelligence.
// Purpose:
// - Provide the public-facing Hearth / Diamond Gate Bridge orientation intelligence.
// - Integrate the six live anchors plus development arc and meaning layer.
// - Use F89-style registry mechanics to conduct anchor selection, tool status, route readiness, and jump-pad handoff.
// - Use the Fibonacci Conversational Cycle of Progression to prevent flat chatbot exchange.
// - Keep the visitor-facing conversation natural, concrete, and useful.
// - Distinguish live features from held/future roadmap features.
// - Route visitors through Compass, Coherence Diagnostic, Laws/Gauges, Products, Meet Sean, and Mirrorland.
// - Explain future Character Profile, saved diagnostic, login, NPC, and Mirror-Me mechanics only as future roadmap.
// Does not own:
// - backend persistence
// - user login
// - saved profile state
// - saved diagnostic state
// - NPC runtime
// - Mirror-Me runtime
// - route orchestration
// - rendering
// - WebGL
// - generated images
// - GraphicBox
// - planet truth
// - public superiority claims
// - final visual pass claims

(() => {
  "use strict";

  const CONTRACT = "HEARTH_JEEVES_AAI_F89_TOOL_REGISTRY_CONVERSATIONAL_CYCLE_ENGINE_TNT_v8";
  const RECEIPT = "HEARTH_JEEVES_AAI_F89_TOOL_REGISTRY_CONVERSATIONAL_CYCLE_ENGINE_RECEIPT_v8";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE_TNT_v7";
  const VERSION = "2026-06-09.hearth-jeeves-aai-f89-tool-registry-conversational-cycle-v8";
  const FILE = "/showroom/globe/hearth/jeeves/index.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
    NORTH_LATCH: "F21",
    PRODUCT_ENGINE: "F34",
    EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233"
  });

  const CYCLE_STAGES = Object.freeze({
    CONTACT: "contact",
    RECOGNITION: "recognition",
    FORK: "fork",
    KNOWLEDGE_HIT: "knowledge-hit",
    ANCHOR_EXPANSION: "anchor-expansion",
    CURIOSITY_RISE: "curiosity-rise",
    JUMP_PRESSURE: "jump-pressure",
    RETURN_LOOP: "return-loop"
  });

  const TOOL_STATUS = Object.freeze({
    LIVE: "LIVE",
    HELD: "HELD",
    FUTURE: "FUTURE",
    INTERNAL: "INTERNAL",
    PUBLIC: "PUBLIC"
  });

  const INTENT = Object.freeze({
    OPENING: "opening",
    WEBSITE: "website",
    WORLD: "world",
    SKEPTIC: "skeptic",
    SIMPLE_START: "simple-start",
    COMPASS: "compass",
    DIAGNOSTIC: "diagnostic",
    LAWS: "laws",
    GAUGES: "gauges",
    PRODUCTS: "products",
    SEAN: "sean",
    MIRRORLAND: "mirrorland",
    CHARACTERS: "characters",
    DEVELOPMENT: "development",
    MEANING: "meaning",
    STORY: "story",
    FUTURE_PROFILE: "future-profile",
    NPCS: "npcs",
    MIRROR_ME: "mirror-me",
    COCKPIT: "cockpit",
    FREE_ACCESS: "free-access",
    UNKNOWN: "unknown"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "JEEVES-AAI-F89-CYCLE",
    alignedRegistryCoordinate: "RT3D-X14_Y19_Z89",
    class: "ARTIFICIAL_AGENT_INTELLIGENCE",
    role: "ESTATE_ORIENTATION_CONDUCTOR",
    registryRole: "ANCHOR_REGISTRY_CONDUCTOR",
    mayRender: false,
    mayStoreProfile: false,
    mayClaimSavedDiagnostic: false,
    mayClaimNpcRuntime: false,
    mayClaimMirrorMeRuntime: false,
    mayClaimPublicSuperiority: false
  });

  const CYCLE_TO_FIBONACCI = Object.freeze({
    [CYCLE_STAGES.CONTACT]: FIBONACCI.NORTH_LATCH,
    [CYCLE_STAGES.RECOGNITION]: FIBONACCI.NORTH_LATCH,
    [CYCLE_STAGES.FORK]: FIBONACCI.PROJECT_REGISTRY,
    [CYCLE_STAGES.KNOWLEDGE_HIT]: FIBONACCI.EXPRESSION,
    [CYCLE_STAGES.ANCHOR_EXPANSION]: FIBONACCI.PROJECT_REGISTRY,
    [CYCLE_STAGES.CURIOSITY_RISE]: FIBONACCI.EXPRESSION,
    [CYCLE_STAGES.JUMP_PRESSURE]: FIBONACCI.MARKET_READINESS,
    [CYCLE_STAGES.RETURN_LOOP]: FIBONACCI.DOWNSTREAM_RETURN
  });

  const TOOL_REGISTRY = Object.freeze({
    f89Registry: {
      id: "f89-registry",
      label: "F89 Registry",
      status: [TOOL_STATUS.INTERNAL, TOOL_STATUS.HELD],
      route: "",
      file: "/assets/lab/product-engine.registry.js",
      contract: "LAB_PRODUCT_ENGINE_REGISTRY_F89_ENGINE_MECHANICS_PROJECT_REGISTRY_CONDUCTOR_TNT_v2",
      purpose: "Anchor and readiness conductor. Keeps Jeeves grounded and prevents false claims.",
      publicSafe: false
    },
    cockpit: {
      id: "cockpit",
      label: "Control Cockpit",
      status: [TOOL_STATUS.INTERNAL, TOOL_STATUS.PUBLIC],
      route: "/showroom/globe/audralia/disposition/",
      purpose: "Operator and systems-status layer. Public explanation must stay high level.",
      publicSafe: true
    },
    compass: {
      id: "compass",
      label: "Compass",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/",
      purpose: "Primary estate map and visitor orientation gate.",
      publicSafe: true
    },
    siteGuide: {
      id: "site-guide",
      label: "Website Guide",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/site-guide/",
      purpose: "Plain instruction map for using the website.",
      publicSafe: true
    },
    diagnostic: {
      id: "coherence-diagnostic",
      label: "Coherence Diagnostic",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/coherence-diagnostic/",
      contract: "COHERENCE_DIAGNOSTIC_LINEAR_ONE_SCENARIO_SUBMIT_FLOW_TNT_v9",
      purpose: "Local-only self-pattern intake and coherence assessment.",
      publicSafe: true
    },
    laws: {
      id: "laws",
      label: "Laws",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/laws/",
      purpose: "Proof, boundary, claim law, route law, and return logic.",
      publicSafe: true
    },
    gauges: {
      id: "gauges",
      label: "Gauges",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/gauges/",
      purpose: "Technical/status proof surface.",
      publicSafe: true
    },
    products: {
      id: "products",
      label: "Products",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/products/",
      purpose: "Usable public application wing.",
      publicSafe: true
    },
    meetSean: {
      id: "meet-sean",
      label: "Meet Sean",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/meet-sean-mansfield/",
      purpose: "Human voice and origin profile behind Diamond Gate Bridge.",
      publicSafe: true
    },
    mirrorland: {
      id: "mirrorland",
      label: "Mirrorland",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/showroom/globe/",
      purpose: "World-behind-the-website entry path.",
      publicSafe: true
    },
    showroom: {
      id: "showroom",
      label: "Showroom",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/showroom/",
      purpose: "Visible estate/world atrium.",
      publicSafe: true
    },
    audralia: {
      id: "audralia",
      label: "Audralia",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/showroom/globe/audralia/",
      purpose: "Audralia world route.",
      publicSafe: true
    },
    frontier: {
      id: "frontier",
      label: "Frontier",
      status: [TOOL_STATUS.LIVE, TOOL_STATUS.PUBLIC],
      route: "/explore/frontier/",
      purpose: "Applied field / support / outside-world bridge.",
      publicSafe: true
    },
    characterProfile: {
      id: "character-profile",
      label: "Character Profile",
      status: [TOOL_STATUS.FUTURE, TOOL_STATUS.HELD],
      route: "",
      purpose: "Future saved visitor identity layer.",
      publicSafe: true
    },
    savedDiagnostic: {
      id: "saved-diagnostic",
      label: "Saved Diagnostic Result",
      status: [TOOL_STATUS.FUTURE, TOOL_STATUS.HELD],
      route: "",
      purpose: "Future saved diagnostic attached to character profile.",
      publicSafe: true
    },
    login: {
      id: "login",
      label: "Login",
      status: [TOOL_STATUS.FUTURE, TOOL_STATUS.HELD],
      route: "",
      purpose: "Future return access to saved profile.",
      publicSafe: true
    },
    npcInteraction: {
      id: "npc-interaction",
      label: "NPC Interaction",
      status: [TOOL_STATUS.FUTURE, TOOL_STATUS.HELD],
      route: "",
      purpose: "Future Mirrorland interaction layer.",
      publicSafe: true
    },
    mirrorMe: {
      id: "mirror-me",
      label: "Mirror-Me Challenge",
      status: [TOOL_STATUS.FUTURE, TOOL_STATUS.HELD],
      route: "",
      purpose: "Future higher-self discovery challenge.",
      publicSafe: true
    }
  });

  const ANCHORS = Object.freeze({
    compass: {
      id: "compass",
      label: "Compass",
      intent: INTENT.COMPASS,
      owningTool: "compass",
      question: "Where do I start?",
      plain: "The Compass is the map. It helps you choose the first doorway instead of trying to understand the whole estate at once."
    },
    diagnostic: {
      id: "diagnostic",
      label: "Coherence Diagnostic",
      intent: INTENT.DIAGNOSTIC,
      owningTool: "diagnostic",
      question: "How am I entering this?",
      plain: "The Diagnostic helps you see how you make decisions under pressure before you explore the rest of the site."
    },
    laws: {
      id: "laws",
      label: "Laws",
      intent: INTENT.LAWS,
      owningTool: "laws",
      question: "How do I know this holds together?",
      plain: "The Laws explain what the site is allowed to claim, what must be checked, and how a visitor gets back after moving deeper."
    },
    products: {
      id: "products",
      label: "Products",
      intent: INTENT.PRODUCTS,
      owningTool: "products",
      question: "How do I use this?",
      plain: "Products is the practical wing. It is where the message becomes tools, games, support, learning, routine, and public paths."
    },
    sean: {
      id: "sean",
      label: "Meet Sean",
      intent: INTENT.SEAN,
      owningTool: "meetSean",
      question: "Who is behind the voice?",
      plain: "Sean is the human voice behind this side of the bridge. He turns pressure into language, and language into rooms other people can walk through."
    },
    mirrorland: {
      id: "mirrorland",
      label: "Mirrorland",
      intent: INTENT.MIRRORLAND,
      owningTool: "mirrorland",
      question: "What is the world behind the website?",
      plain: "Mirrorland is the world behind the public site. It gives the system people, place, story, and memory."
    },
    development: {
      id: "development",
      label: "Development Arc",
      intent: INTENT.DEVELOPMENT,
      owningTool: "cockpit",
      question: "How did this develop, where is it now, and where is it going?",
      plain: "The site is being built in stages: public anchors first, then deeper profile, NPC, saved-pattern, and Mirror-Me systems later."
    },
    meaning: {
      id: "meaning",
      label: "Meaning",
      intent: INTENT.MEANING,
      owningTool: "compass",
      question: "Why does this matter?",
      plain: "It matters because people need better ways to turn pressure, truth, story, and tools into usable direction."
    }
  });

  const CHARACTER_REGISTRY = Object.freeze({
    auren: {
      name: "Auren Vale",
      label: "Sanctuary Builder",
      route: "/showroom/",
      line: "Auren is trying to make the manor safe without turning it into a cage.",
      bestFor: "protection, trust, shelter, and moral pressure"
    },
    dextrion: {
      name: "Dextrion",
      label: "Earth-Side Originator",
      route: "/showroom/globe/",
      line: "Dextrion opened the crossing and had to stay with the consequences.",
      bestFor: "origin, systems, repair, anomaly, and technical consequences"
    },
    alaric: {
      name: "Alaric",
      label: "Field Navigator",
      route: "/explore/frontier/",
      line: "Alaric notices danger before everyone else is ready to believe him.",
      bestFor: "routes, risk, terrain, warning, and field sense"
    },
    tarian: {
      name: "Tarian",
      label: "Water Anchor",
      route: "/explore/frontier/",
      line: "Tarian keeps every plan honest by asking whether the body can survive it.",
      bestFor: "water, endurance, survival, fatigue, and practical reality"
    },
    elara: {
      name: "Elara",
      label: "Signal Bearer",
      route: "/showroom/",
      line: "Elara makes the future visible without pretending it is safe.",
      bestFor: "hope, public signal, morale, and visibility"
    },
    soren: {
      name: "Soren",
      label: "Boundary Keeper",
      route: "/laws/",
      line: "Soren asks where the damage went before he accepts the word progress.",
      bestFor: "proof, consequence, contamination, boundary, and hidden cost"
    }
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    mounted: false,
    mount: null,
    turn: 0,
    history: [],
    currentIntent: INTENT.OPENING,
    currentAnchor: "compass",
    currentPole: "entry",
    lastVisitorText: "",
    immersionScore: 0,
    progressionScore: 0,
    jumpReadinessScore: 0,
    cycleStage: CYCLE_STAGES.CONTACT,
    currentVsFutureBoundaryActive: true,
    naturalSurfaceLanguageActive: true,
    chatbotClassificationForbidden: true,
    artificialAgentIntelligenceActive: true,
    toolRegistryActive: true,
    anchorRegistryActive: true,
    fibonacciCycleActive: true,
    f89RegistryAlignmentActive: true,
    localOnlySession: true,
    storage: false,
    localStorage: false,
    cookies: false,
    apiCall: false,
    backend: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    publicSuperiorityClaim: false,
    createdAt: "",
    updatedAt: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function escapeHtml(value) {
    return safeString(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function normalize(value) {
    return safeString(value)
      .toLowerCase()
      .replace(/[^\w\s/-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function includesAny(text, terms) {
    const n = normalize(text);
    return terms.some((term) => n.includes(normalize(term)));
  }

  function scoreTerms(text, terms) {
    const n = normalize(text);
    return terms.reduce((score, term) => score + (n.includes(normalize(term)) ? 1 : 0), 0);
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (value && typeof value === "object") return { ...value };
      return value;
    }
  }

  function isLivePublicTool(toolId) {
    const tool = TOOL_REGISTRY[toolId];
    return Boolean(
      tool &&
      tool.publicSafe &&
      tool.route &&
      tool.status.includes(TOOL_STATUS.LIVE) &&
      tool.status.includes(TOOL_STATUS.PUBLIC)
    );
  }

  function getJump(label, href, toolId = "") {
    return {
      label,
      href,
      toolId,
      live: toolId ? isLivePublicTool(toolId) : Boolean(href)
    };
  }

  function jumpsForAnchor(anchorId) {
    switch (anchorId) {
      case "compass":
        return [
          getJump("Jump to Compass", "/", "compass"),
          getJump("Open Website Guide", "/site-guide/", "siteGuide"),
          getJump("Take Coherence Diagnostic", "/coherence-diagnostic/", "diagnostic")
        ];
      case "diagnostic":
        return [
          getJump("Jump to Coherence Diagnostic", "/coherence-diagnostic/", "diagnostic"),
          getJump("Return to Compass", "/", "compass")
        ];
      case "laws":
        return [
          getJump("Jump to Laws", "/laws/", "laws"),
          getJump("Open Gauges", "/gauges/", "gauges"),
          getJump("Return to Compass", "/", "compass")
        ];
      case "products":
        return [
          getJump("Jump to Products", "/products/", "products"),
          getJump("Meet Sean", "/meet-sean-mansfield/", "meetSean"),
          getJump("Return to Compass", "/", "compass")
        ];
      case "sean":
        return [
          getJump("Jump to Meet Sean", "/meet-sean-mansfield/", "meetSean"),
          getJump("Open Products", "/products/", "products"),
          getJump("Return to Compass", "/", "compass")
        ];
      case "mirrorland":
        return [
          getJump("Enter Mirrorland", "/showroom/globe/", "mirrorland"),
          getJump("Open Showroom", "/showroom/", "showroom"),
          getJump("Open Audralia", "/showroom/globe/audralia/", "audralia"),
          getJump("Open Frontier", "/explore/frontier/", "frontier")
        ];
      case "development":
        return [
          getJump("Return to Compass", "/", "compass"),
          getJump("Open Gauges", "/gauges/", "gauges"),
          getJump("Open Control Cockpit", "/showroom/globe/audralia/disposition/", "cockpit")
        ];
      case "meaning":
        return [
          getJump("Start at Compass", "/", "compass"),
          getJump("Take Diagnostic", "/coherence-diagnostic/", "diagnostic"),
          getJump("Enter Mirrorland", "/showroom/globe/", "mirrorland")
        ];
      default:
        return [getJump("Start at Compass", "/", "compass")];
    }
  }

  function option(label, intent, value = "") {
    return {
      label,
      intent,
      value: value || label
    };
  }

  function classifyVisitorIntent(input) {
    const text = normalize(input);

    if (!text) return INTENT.OPENING;

    const scores = [
      [INTENT.DIAGNOSTIC, scoreTerms(text, ["diagnostic", "assessment", "coherence", "archetype", "self check", "pressure", "mbti", "iq", "test", "profile"])],
      [INTENT.LAWS, scoreTerms(text, ["proof", "prove", "holds", "law", "laws", "evidence", "claim", "claims", "boundary", "verify", "receipts"])],
      [INTENT.GAUGES, scoreTerms(text, ["gauge", "gauges", "status", "technical", "audit", "checks", "pass", "fail"])],
      [INTENT.PRODUCTS, scoreTerms(text, ["product", "products", "use", "useful", "tool", "tools", "game", "support", "education", "nutrition", "book", "archcoin"])],
      [INTENT.SEAN, scoreTerms(text, ["sean", "built", "builder", "behind", "voice", "person", "human", "comedy", "seminar", "speaker"])],
      [INTENT.MIRRORLAND, scoreTerms(text, ["mirrorland", "world", "hearth", "audralia", "story", "characters", "planet", "frontier", "showroom"])],
      [INTENT.CHARACTERS, scoreTerms(text, ["character", "characters", "auren", "dextrion", "alaric", "tarian", "elara", "soren", "people"])],
      [INTENT.DEVELOPMENT, scoreTerms(text, ["developed", "development", "roadmap", "where is it going", "where it is going", "future", "current", "where is the site", "where the site", "built in stages"])],
      [INTENT.MEANING, scoreTerms(text, ["why matter", "why matters", "important", "world", "value", "why care", "what it means", "meaning"])],
      [INTENT.STORY, scoreTerms(text, ["why story", "story makes", "telling a story", "narrative", "better as a story"])],
      [INTENT.FUTURE_PROFILE, scoreTerms(text, ["character profile", "saved profile", "saved diagnostic", "login", "account", "save result"])],
      [INTENT.NPCS, scoreTerms(text, ["npc", "npcs", "non player", "agents in the world"])],
      [INTENT.MIRROR_ME, scoreTerms(text, ["mirror me", "higher self", "higher-self", "my mirror", "find myself"])],
      [INTENT.COCKPIT, scoreTerms(text, ["cockpit", "control room", "operator", "registry", "f89", "engine mechanics"])],
      [INTENT.FREE_ACCESS, scoreTerms(text, ["free", "cost", "pay", "price", "account free"])],
      [INTENT.SIMPLE_START, scoreTerms(text, ["where start", "start", "simple", "just tell me", "first", "begin"])],
      [INTENT.WEBSITE, scoreTerms(text, ["website", "site", "map", "guide", "page", "pages", "navigation"])],
      [INTENT.SKEPTIC, scoreTerms(text, ["skeptical", "confused", "plainly", "what is this", "what am i looking at", "is this real"])]
    ];

    scores.sort((a, b) => b[1] - a[1]);

    if (scores[0][1] > 0) return scores[0][0];

    if (includesAny(text, ["what is this", "explain"])) return INTENT.SKEPTIC;

    return INTENT.UNKNOWN;
  }

  function anchorForIntent(intent) {
    switch (intent) {
      case INTENT.WEBSITE:
      case INTENT.COMPASS:
      case INTENT.SIMPLE_START:
      case INTENT.OPENING:
      case INTENT.UNKNOWN:
        return "compass";
      case INTENT.DIAGNOSTIC:
        return "diagnostic";
      case INTENT.LAWS:
      case INTENT.GAUGES:
      case INTENT.SKEPTIC:
        return "laws";
      case INTENT.PRODUCTS:
        return "products";
      case INTENT.SEAN:
        return "sean";
      case INTENT.WORLD:
      case INTENT.MIRRORLAND:
      case INTENT.CHARACTERS:
      case INTENT.NPCS:
      case INTENT.MIRROR_ME:
      case INTENT.FUTURE_PROFILE:
        return "mirrorland";
      case INTENT.DEVELOPMENT:
      case INTENT.COCKPIT:
        return "development";
      case INTENT.MEANING:
      case INTENT.STORY:
      case INTENT.FREE_ACCESS:
        return "meaning";
      default:
        return "compass";
    }
  }

  function updateMotion(intent, anchorId) {
    state.turn += 1;
    state.currentIntent = intent;
    state.currentAnchor = anchorId;
    state.cycleStage = CYCLE_STAGES.JUMP_PRESSURE;
    state.progressionScore = Math.min(233, state.progressionScore + 13);
    state.jumpReadinessScore = Math.min(144, state.jumpReadinessScore + (anchorId ? 21 : 5));

    if ([INTENT.WORLD, INTENT.MIRRORLAND, INTENT.CHARACTERS, INTENT.NPCS, INTENT.MIRROR_ME].includes(intent)) {
      state.immersionScore = Math.min(100, state.immersionScore + 13);
    } else if ([INTENT.WEBSITE, INTENT.COMPASS, INTENT.SIMPLE_START, INTENT.SKEPTIC].includes(intent)) {
      state.immersionScore = Math.max(0, state.immersionScore - 3);
    }

    state.updatedAt = nowIso();
  }

  function paragraphJoin(parts) {
    return parts.filter(Boolean).join("\n\n");
  }

  function openingResponse() {
    return {
      intent: INTENT.OPENING,
      anchorId: "compass",
      cycle: cyclePacket(INTENT.OPENING, "compass"),
      text: paragraphJoin([
        "Welcome to Diamond Gate Bridge.",
        "Most visitors arrive here asking the same thing: “What exactly am I looking at?”",
        "I can answer that from the website side, or I can take you toward the world behind it. If you are skeptical, I can start there too."
      ]),
      options: [
        option("Explain the website first.", INTENT.WEBSITE),
        option("Take me toward the world behind it.", INTENT.WORLD),
        option("I’m skeptical — explain this plainly.", INTENT.SKEPTIC),
        option("Start with the Coherence Diagnostic.", INTENT.DIAGNOSTIC),
        option("Just tell me where to start.", INTENT.SIMPLE_START)
      ],
      jumpPads: jumpsForAnchor("compass")
    };
  }

  function websiteResponse() {
    return {
      intent: INTENT.WEBSITE,
      anchorId: "compass",
      cycle: cyclePacket(INTENT.WEBSITE, "compass"),
      text: paragraphJoin([
        "The website side is the map.",
        "Start with the Compass when you want orientation. Use the Coherence Diagnostic when you want to understand how you are entering. Use Laws and Gauges when you want proof. Use Products when you want the practical tools. Use Meet Sean when you want the human voice behind it.",
        "The site is built so you do not have to understand everything at once. You choose the doorway that matches your question."
      ]),
      options: [
        option("Show me the simplest starting path.", INTENT.SIMPLE_START),
        option("Explain the Diagnostic.", INTENT.DIAGNOSTIC),
        option("Show me the proof path.", INTENT.LAWS),
        option("Show me the practical tools.", INTENT.PRODUCTS),
        option("Now take me toward the world.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("compass")
    };
  }

  function worldResponse() {
    return {
      intent: INTENT.WORLD,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.WORLD, "mirrorland"),
      text: paragraphJoin([
        "The world side is Mirrorland.",
        "That is where the website stops being only a map and starts becoming a place. Hearth, Audralia, Frontier, and the characters give the system a human shape.",
        "You can treat it as story, but the story is not decoration. It gives pressure, proof, tools, and self-understanding somewhere to live."
      ]),
      options: [
        option("Introduce me to the people.", INTENT.CHARACTERS),
        option("Explain why the story matters.", INTENT.STORY),
        option("What is coming later?", INTENT.FUTURE_PROFILE),
        option("Show me the proof before the story.", INTENT.LAWS)
      ],
      jumpPads: jumpsForAnchor("mirrorland")
    };
  }

  function skepticResponse() {
    return {
      intent: INTENT.SKEPTIC,
      anchorId: "laws",
      cycle: cyclePacket(INTENT.SKEPTIC, "laws"),
      text: paragraphJoin([
        "That is a fair way to enter.",
        "The plain version is this: Diamond Gate Bridge is a staged website and world system. It has public anchors you can inspect now, and future layers that are clearly marked as coming.",
        "If you want to test whether it holds together, start with Laws and Gauges. Laws explain what the site is allowed to claim. Gauges show the technical/status side. The Diagnostic lets you test your own pressure pattern without asking you to believe the whole world first."
      ]),
      options: [
        option("Show me the Laws.", INTENT.LAWS),
        option("Show me the Gauges.", INTENT.GAUGES),
        option("Explain the Diagnostic.", INTENT.DIAGNOSTIC),
        option("Explain where the site is going.", INTENT.DEVELOPMENT)
      ],
      jumpPads: jumpsForAnchor("laws")
    };
  }

  function simpleStartResponse() {
    return {
      intent: INTENT.SIMPLE_START,
      anchorId: "compass",
      cycle: cyclePacket(INTENT.SIMPLE_START, "compass"),
      text: paragraphJoin([
        "Then keep it simple.",
        "Start at the Compass. If you want to understand yourself first, take the Coherence Diagnostic. If you want proof, open Laws. If you want tools, open Products. If you want the world, enter Mirrorland.",
        "That is the cleanest first path."
      ]),
      options: [
        option("Start with myself.", INTENT.DIAGNOSTIC),
        option("Start with proof.", INTENT.LAWS),
        option("Start with tools.", INTENT.PRODUCTS),
        option("Start with the world.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("compass")
    };
  }

  function diagnosticResponse() {
    return {
      intent: INTENT.DIAGNOSTIC,
      anchorId: "diagnostic",
      cycle: cyclePacket(INTENT.DIAGNOSTIC, "diagnostic"),
      text: paragraphJoin([
        "The Coherence Diagnostic is the self-check before entry.",
        "It asks how coherent you believe yourself to be, which archetype you think you lead with, and then tests that claim through real-world pressure scenarios.",
        "Right now it runs locally in your browser. No account, no upload, no email required, no backend, no storage, no cookies, and no API call. It is not medical, legal, employment screening, an IQ test, or official MBTI.",
        "Later, the diagnostic can become part of a saved character profile. That future layer is not active until profile and login systems exist."
      ]),
      options: [
        option("What are the archetypes?", INTENT.CHARACTERS),
        option("How will it connect to my future profile?", INTENT.FUTURE_PROFILE),
        option("Why does this matter?", INTENT.MEANING),
        option("Show me the proof path instead.", INTENT.LAWS)
      ],
      jumpPads: jumpsForAnchor("diagnostic")
    };
  }

  function lawsResponse() {
    return {
      intent: INTENT.LAWS,
      anchorId: "laws",
      cycle: cyclePacket(INTENT.LAWS, "laws"),
      text: paragraphJoin([
        "The Laws chamber is where the bridge proves it is not just decoration.",
        "Proof outranks confidence here. If a page claims something, the house needs a way to check it. If a route opens, the house needs a way back. If something looks impressive, the house still has to know whether it is proof, decoration, or a doorway.",
        "That is why Laws and Gauges matter. Laws define the claim boundaries. Gauges expose status and technical evidence."
      ]),
      options: [
        option("Open the technical side.", INTENT.GAUGES),
        option("Explain this in plain language.", INTENT.SKEPTIC),
        option("Show me the Diagnostic.", INTENT.DIAGNOSTIC),
        option("Take me toward the world.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("laws")
    };
  }

  function gaugesResponse() {
    return {
      intent: INTENT.GAUGES,
      anchorId: "laws",
      cycle: cyclePacket(INTENT.GAUGES, "laws"),
      text: paragraphJoin([
        "Gauges are the technical proof surface.",
        "They are not the story. They are the check layer. They help show what is active, what is held, what is passing, and what still needs work.",
        "Use Gauges when you want the site to answer with status instead of atmosphere."
      ]),
      options: [
        option("Show me the Laws too.", INTENT.LAWS),
        option("Where is the site right now?", INTENT.DEVELOPMENT),
        option("Now show me the world side.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("laws")
    };
  }

  function productsResponse() {
    return {
      intent: INTENT.PRODUCTS,
      anchorId: "products",
      cycle: cyclePacket(INTENT.PRODUCTS, "products"),
      text: paragraphJoin([
        "Products is the practical wing.",
        "It is where the message becomes usable: support, games, learning, nutrition, public paths, Sean’s work, and the book routes.",
        "If you want to use the project instead of only understand it, Products is the right doorway."
      ]),
      options: [
        option("Why are products part of the story?", INTENT.STORY),
        option("Who is behind this?", INTENT.SEAN),
        option("What makes it useful?", INTENT.MEANING),
        option("Take me back to the map.", INTENT.COMPASS)
      ],
      jumpPads: jumpsForAnchor("products")
    };
  }

  function seanResponse() {
    return {
      intent: INTENT.SEAN,
      anchorId: "sean",
      cycle: cyclePacket(INTENT.SEAN, "sean"),
      text: paragraphJoin([
        "Sean is the human voice behind this side of the bridge.",
        "His work begins with pressure, but it does not stay there. It moves through accountability, redirection, comedy, story, speaking, seminars, and usable language.",
        "That matters because the estate is not only technical. It has a human origin: pressure turned into a map other people can use."
      ]),
      options: [
        option("How did the site develop from that?", INTENT.DEVELOPMENT),
        option("Why does the story matter?", INTENT.STORY),
        option("Show me the practical side.", INTENT.PRODUCTS),
        option("Take me toward Mirrorland.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("sean")
    };
  }

  function mirrorlandResponse() {
    return {
      intent: INTENT.MIRRORLAND,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.MIRRORLAND, "mirrorland"),
      text: paragraphJoin([
        "Mirrorland is the world behind the website.",
        "It gives the estate people, places, stakes, and memory. That is where characters matter. They are not labels in a database; they are the people through whom the world becomes understandable.",
        "You can enter through Hearth, the Showroom, Audralia, or Frontier depending on whether you want the house, the world, or the field beyond it."
      ]),
      options: [
        option("Introduce me to the characters.", INTENT.CHARACTERS),
        option("What is Mirror-Me?", INTENT.MIRROR_ME),
        option("How will NPCs work later?", INTENT.NPCS),
        option("Start with proof instead.", INTENT.LAWS)
      ],
      jumpPads: jumpsForAnchor("mirrorland")
    };
  }

  function charactersResponse() {
    const characterLines = Object.values(CHARACTER_REGISTRY)
      .map((item) => `${item.name}: ${item.line}`)
      .join("\n");

    return {
      intent: INTENT.CHARACTERS,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.CHARACTERS, "mirrorland"),
      text: paragraphJoin([
        "The people help you understand the world without turning it into a wall of information.",
        characterLines,
        "Choose the person whose problem you want to understand first. Protection, proof, origin, warning, survival, and hope each open a different way into the estate."
      ]),
      options: [
        option("Start with protection.", INTENT.MIRRORLAND, "Auren"),
        option("Start with origin and systems.", INTENT.COCKPIT, "Dextrion"),
        option("Start with proof and consequence.", INTENT.LAWS, "Soren"),
        option("Start with hope and signal.", INTENT.STORY, "Elara"),
        option("Explain the future profile layer.", INTENT.FUTURE_PROFILE)
      ],
      jumpPads: jumpsForAnchor("mirrorland")
    };
  }

  function developmentResponse() {
    return {
      intent: INTENT.DEVELOPMENT,
      anchorId: "development",
      cycle: cyclePacket(INTENT.DEVELOPMENT, "development"),
      text: paragraphJoin([
        "Diamond Gate Bridge is being built in stages.",
        "The current public estate has anchors: Compass, Coherence Diagnostic, Laws, Gauges, Products, Meet Sean, and the first visible paths toward Mirrorland.",
        "The next stage is more personal: character profiles, saved diagnostic patterns, login, NPC interaction, and the Mirror-Me challenge. Those future systems are not active until they are actually built.",
        "The important point is that the site is not only explaining a world. It is becoming a way for the visitor to enter one."
      ]),
      options: [
        option("What is live right now?", INTENT.WEBSITE),
        option("What is coming later?", INTENT.FUTURE_PROFILE),
        option("Why does it matter?", INTENT.MEANING),
        option("Show me the technical proof side.", INTENT.GAUGES)
      ],
      jumpPads: jumpsForAnchor("development")
    };
  }

  function meaningResponse() {
    return {
      intent: INTENT.MEANING,
      anchorId: "meaning",
      cycle: cyclePacket(INTENT.MEANING, "meaning"),
      text: paragraphJoin([
        "To the visitor, this matters because it gives confusion a doorway.",
        "You do not have to understand the whole system at once. You can start with yourself, with proof, with tools, with Sean, or with the world behind the site.",
        "To the world, it matters because people need better ways to organize pressure, truth, story, usefulness, and self-understanding without turning everything into cold data or empty entertainment."
      ]),
      options: [
        option("Why does story make it better?", INTENT.STORY),
        option("Start with myself.", INTENT.DIAGNOSTIC),
        option("Start with proof.", INTENT.LAWS),
        option("Start with the world.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("meaning")
    };
  }

  function storyResponse() {
    return {
      intent: INTENT.STORY,
      anchorId: "meaning",
      cycle: cyclePacket(INTENT.STORY, "meaning"),
      text: paragraphJoin([
        "Story matters because people do not usually change through information alone.",
        "A normal website can tell you what something is. A story can help you feel why it matters, remember where you are, and choose who or what you want to follow next.",
        "That is why Mirrorland matters. It gives the system a human shape."
      ]),
      options: [
        option("Take me into Mirrorland.", INTENT.WORLD),
        option("Introduce the characters.", INTENT.CHARACTERS),
        option("Explain the future Mirror-Me challenge.", INTENT.MIRROR_ME),
        option("Show me the practical tools.", INTENT.PRODUCTS)
      ],
      jumpPads: jumpsForAnchor("meaning")
    };
  }

  function futureProfileResponse() {
    return {
      intent: INTENT.FUTURE_PROFILE,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.FUTURE_PROFILE, "mirrorland"),
      text: paragraphJoin([
        "The future profile layer is the personal estate layer.",
        "The plan is that your Coherence Diagnostic pattern can eventually attach to a character profile. That profile can travel with you through the estate, so future systems can respond to how you enter, how you choose, and what kind of pressure you carry.",
        "That is not active yet. Right now the Diagnostic is local-only and does not save your result. Saved profiles, login, NPC interaction, and saved diagnostic patterns belong to the future roadmap."
      ]),
      options: [
        option("Explain NPCs.", INTENT.NPCS),
        option("Explain Mirror-Me.", INTENT.MIRROR_ME),
        option("Start with the live Diagnostic.", INTENT.DIAGNOSTIC),
        option("Where is the site now?", INTENT.DEVELOPMENT)
      ],
      jumpPads: jumpsForAnchor("diagnostic")
    };
  }

  function npcsResponse() {
    return {
      intent: INTENT.NPCS,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.NPCS, "mirrorland"),
      text: paragraphJoin([
        "NPCs are part of the future Mirrorland layer.",
        "The idea is that characters in the world will eventually respond to your profile, choices, and coherence pattern. That would make the world feel less like a page and more like a place that remembers how you entered.",
        "That system is not live yet. For now, Jeeves can explain the direction and guide you through the current public routes."
      ]),
      options: [
        option("What is Mirror-Me?", INTENT.MIRROR_ME),
        option("How does the Diagnostic connect?", INTENT.DIAGNOSTIC),
        option("Introduce the current characters.", INTENT.CHARACTERS),
        option("Show me what is live now.", INTENT.WEBSITE)
      ],
      jumpPads: jumpsForAnchor("mirrorland")
    };
  }

  function mirrorMeResponse() {
    return {
      intent: INTENT.MIRROR_ME,
      anchorId: "mirrorland",
      cycle: cyclePacket(INTENT.MIRROR_ME, "mirrorland"),
      text: paragraphJoin([
        "Mirror-Me is a future higher-self discovery challenge.",
        "It is not a clone and not a diagnosis. It is the idea that the world can reflect a stronger version of you back through choices, characters, and pressure situations.",
        "The Coherence Diagnostic is the first practical step toward that future, because it reads how you move under pressure. Later, that pattern can help shape the profile that moves through the world."
      ]),
      options: [
        option("Take the Diagnostic first.", INTENT.DIAGNOSTIC),
        option("Explain the character profile.", INTENT.FUTURE_PROFILE),
        option("Why does this matter?", INTENT.MEANING),
        option("Take me into Mirrorland.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("diagnostic")
    };
  }

  function cockpitResponse() {
    return {
      intent: INTENT.COCKPIT,
      anchorId: "development",
      cycle: cyclePacket(INTENT.COCKPIT, "development"),
      text: paragraphJoin([
        "The cockpit is the control and status side.",
        "For a visitor, the important idea is simple: the estate needs a way to know what is live, what is held, what is ready, and what should not be claimed yet.",
        "That helps Jeeves avoid pretending future systems are already active. It also supports the development arc: where the site is, what is working, and what comes next."
      ]),
      options: [
        option("Where is the site now?", INTENT.DEVELOPMENT),
        option("Show me the proof layer.", INTENT.GAUGES),
        option("Explain the registry mechanics plainly.", INTENT.SKEPTIC),
        option("Return to the main map.", INTENT.COMPASS)
      ],
      jumpPads: jumpsForAnchor("development")
    };
  }

  function freeAccessResponse() {
    return {
      intent: INTENT.FREE_ACCESS,
      anchorId: "meaning",
      cycle: cyclePacket(INTENT.FREE_ACCESS, "meaning"),
      text: paragraphJoin([
        "The public participation principle is free access.",
        "The point is not to lock the visitor out of self-understanding, story, or the first estate paths. Future profile and login systems should support return access, not turn the doorway into a wall.",
        "If a feature is not live yet, I will say so. If it is free and available, I can route you to it."
      ]),
      options: [
        option("What can I use now?", INTENT.PRODUCTS),
        option("Start with the free Diagnostic.", INTENT.DIAGNOSTIC),
        option("What is coming later?", INTENT.FUTURE_PROFILE),
        option("Why does this matter?", INTENT.MEANING)
      ],
      jumpPads: jumpsForAnchor("meaning")
    };
  }

  function unknownResponse(text) {
    return {
      intent: INTENT.UNKNOWN,
      anchorId: "compass",
      cycle: cyclePacket(INTENT.UNKNOWN, "compass"),
      text: paragraphJoin([
        "I can help with that, but I should anchor it first.",
        "Do you want the website map, the proof path, the practical tools, the human origin, or the world behind the site?"
      ]),
      options: [
        option("Website map.", INTENT.WEBSITE),
        option("Proof path.", INTENT.LAWS),
        option("Practical tools.", INTENT.PRODUCTS),
        option("Who built this?", INTENT.SEAN),
        option("World behind it.", INTENT.WORLD)
      ],
      jumpPads: jumpsForAnchor("compass"),
      originalText: text
    };
  }

  function cyclePacket(intent, anchorId) {
    return {
      contract: "JEEVES_CONVERSATIONAL_CYCLE_OF_PROGRESSION_v1",
      intent,
      anchorId,
      fibonacciRhythm: ["1", "1", "2", "3", "5", "8", "13"],
      stages: [
        CYCLE_STAGES.CONTACT,
        CYCLE_STAGES.RECOGNITION,
        CYCLE_STAGES.FORK,
        CYCLE_STAGES.KNOWLEDGE_HIT,
        CYCLE_STAGES.ANCHOR_EXPANSION,
        CYCLE_STAGES.CURIOSITY_RISE,
        CYCLE_STAGES.JUMP_PRESSURE,
        CYCLE_STAGES.RETURN_LOOP
      ],
      mechanicalMap: clonePlain(CYCLE_TO_FIBONACCI),
      activeStage: CYCLE_STAGES.JUMP_PRESSURE,
      createsClarity: true,
      createsCuriosity: true,
      createsMotion: true
    };
  }

  function composeResponse(input = {}) {
    const rawText = safeString(input.text || input.value || "");
    const intent = input.intent || classifyVisitorIntent(rawText);
    const anchorId = anchorForIntent(intent);

    updateMotion(intent, anchorId);

    switch (intent) {
      case INTENT.OPENING:
        return openingResponse();
      case INTENT.WEBSITE:
      case INTENT.COMPASS:
        return websiteResponse();
      case INTENT.WORLD:
        return worldResponse();
      case INTENT.SKEPTIC:
        return skepticResponse();
      case INTENT.SIMPLE_START:
        return simpleStartResponse();
      case INTENT.DIAGNOSTIC:
        return diagnosticResponse();
      case INTENT.LAWS:
        return lawsResponse();
      case INTENT.GAUGES:
        return gaugesResponse();
      case INTENT.PRODUCTS:
        return productsResponse();
      case INTENT.SEAN:
        return seanResponse();
      case INTENT.MIRRORLAND:
        return mirrorlandResponse();
      case INTENT.CHARACTERS:
        return charactersResponse();
      case INTENT.DEVELOPMENT:
        return developmentResponse();
      case INTENT.MEANING:
        return meaningResponse();
      case INTENT.STORY:
        return storyResponse();
      case INTENT.FUTURE_PROFILE:
        return futureProfileResponse();
      case INTENT.NPCS:
        return npcsResponse();
      case INTENT.MIRROR_ME:
        return mirrorMeResponse();
      case INTENT.COCKPIT:
        return cockpitResponse();
      case INTENT.FREE_ACCESS:
        return freeAccessResponse();
      default:
        return unknownResponse(rawText);
    }
  }

  function pushMessage(role, text, detail = {}) {
    const message = {
      id: `jeeves-message-${state.history.length + 1}`,
      role,
      text: safeString(text),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.history.push(message);
    state.updatedAt = message.at;

    if (state.history.length > 80) {
      state.history.splice(0, state.history.length - 80);
    }

    return message;
  }

  function injectStyle() {
    if (!doc || doc.getElementById("hearth-jeeves-aai-style-v8")) return;

    const style = doc.createElement("style");
    style.id = "hearth-jeeves-aai-style-v8";
    style.textContent = `
      :root{
        --jeeves-bg:rgba(2,8,18,.86);
        --jeeves-panel:rgba(6,16,34,.86);
        --jeeves-line:rgba(255,255,255,.13);
        --jeeves-text:rgba(239,247,255,.96);
        --jeeves-muted:rgba(239,247,255,.70);
        --jeeves-faint:rgba(239,247,255,.52);
        --jeeves-gold:#f4cf83;
        --jeeves-gold2:#ffe8a3;
        --jeeves-blue:#8dd8ff;
        --jeeves-mint:#a7f3c6;
        --jeeves-shadow:0 28px 90px rgba(0,0,0,.42);
      }

      .hearth-jeeves-aai{
        position:relative;
        display:grid;
        gap:14px;
        width:min(100%,960px);
        margin:0 auto;
        color:var(--jeeves-text);
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:-.015em;
      }

      .hearth-jeeves-aai *{box-sizing:border-box}

      .hearth-jeeves-card{
        border:1px solid var(--jeeves-line);
        border-radius:28px;
        background:
          radial-gradient(circle at 10% 0%,rgba(244,207,131,.09),transparent 18rem),
          radial-gradient(circle at 90% 20%,rgba(141,216,255,.10),transparent 20rem),
          linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.016)),
          var(--jeeves-bg);
        box-shadow:var(--jeeves-shadow),inset 0 1px 0 rgba(255,255,255,.08);
        overflow:hidden;
      }

      .hearth-jeeves-head{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:12px;
        align-items:center;
        padding:18px 20px;
        border-bottom:1px solid rgba(244,207,131,.16);
        background:rgba(255,255,255,.025);
      }

      .hearth-jeeves-title{
        display:grid;
        gap:4px;
        min-width:0;
      }

      .hearth-jeeves-title b{
        color:var(--jeeves-gold);
        font-size:.72rem;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .hearth-jeeves-title strong{
        color:rgba(255,244,216,.96);
        font-size:clamp(1.18rem,2.6vw,1.72rem);
        line-height:1;
        letter-spacing:-.05em;
      }

      .hearth-jeeves-status{
        display:inline-flex;
        min-height:32px;
        align-items:center;
        justify-content:center;
        border:1px solid rgba(167,243,198,.22);
        border-radius:999px;
        padding:0 10px;
        color:rgba(167,243,198,.94);
        background:rgba(167,243,198,.055);
        font-size:.65rem;
        font-weight:900;
        letter-spacing:.12em;
        text-transform:uppercase;
        white-space:nowrap;
      }

      .hearth-jeeves-log{
        display:grid;
        gap:12px;
        padding:16px;
      }

      .hearth-jeeves-message{
        display:grid;
        gap:8px;
        max-width:820px;
        border:1px solid rgba(255,255,255,.09);
        border-radius:22px;
        padding:14px 15px;
        background:
          linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.010)),
          rgba(0,0,0,.16);
      }

      .hearth-jeeves-message[data-role="visitor"]{
        justify-self:end;
        border-color:rgba(141,216,255,.20);
        background:
          radial-gradient(circle at 100% 0%,rgba(141,216,255,.11),transparent 13rem),
          rgba(255,255,255,.025);
      }

      .hearth-jeeves-message[data-role="jeeves"]{
        justify-self:start;
        border-color:rgba(244,207,131,.18);
      }

      .hearth-jeeves-message b{
        color:var(--jeeves-gold);
        font-size:.66rem;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .hearth-jeeves-message[data-role="visitor"] b{
        color:var(--jeeves-blue);
      }

      .hearth-jeeves-message p{
        margin:0;
        color:var(--jeeves-muted);
        font-size:.98rem;
        line-height:1.55;
      }

      .hearth-jeeves-options,
      .hearth-jeeves-jumps{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        padding:0 16px 16px;
      }

      .hearth-jeeves-options{
        border-top:1px solid rgba(255,255,255,.06);
        padding-top:14px;
      }

      .hearth-jeeves-option,
      .hearth-jeeves-jump,
      .hearth-jeeves-submit{
        min-height:40px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border:1px solid rgba(255,255,255,.12);
        border-radius:999px;
        padding:0 13px;
        color:rgba(239,247,255,.84);
        background:rgba(255,255,255,.038);
        font:900 .76rem/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.045em;
        text-transform:uppercase;
        text-decoration:none;
        cursor:pointer;
      }

      .hearth-jeeves-option:hover,
      .hearth-jeeves-submit:hover{
        color:#06101c;
        background:linear-gradient(135deg,#fff0b8,var(--jeeves-gold));
        border-color:rgba(244,207,131,.55);
      }

      .hearth-jeeves-jumps{
        padding-top:0;
      }

      .hearth-jeeves-jump{
        color:#06101c;
        border-color:rgba(244,207,131,.55);
        background:linear-gradient(135deg,#fff0b8,var(--jeeves-gold));
      }

      .hearth-jeeves-jump[data-held="true"]{
        color:rgba(239,247,255,.48);
        background:rgba(255,255,255,.032);
        border-color:rgba(255,255,255,.09);
        pointer-events:none;
      }

      .hearth-jeeves-form{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:10px;
        padding:16px;
        border-top:1px solid rgba(255,255,255,.08);
        background:rgba(0,0,0,.16);
      }

      .hearth-jeeves-input{
        width:100%;
        min-height:44px;
        border:1px solid rgba(255,255,255,.13);
        border-radius:18px;
        padding:0 14px;
        color:var(--jeeves-text);
        background:rgba(255,255,255,.045);
        font:760 .96rem/1.3 Inter,ui-sans-serif,system-ui,sans-serif;
      }

      .hearth-jeeves-input::placeholder{
        color:rgba(239,247,255,.45);
      }

      .hearth-jeeves-meta{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        padding:0 16px 16px;
      }

      .hearth-jeeves-pill{
        min-height:28px;
        display:inline-flex;
        align-items:center;
        border:1px solid rgba(255,255,255,.10);
        border-radius:999px;
        padding:0 9px;
        color:var(--jeeves-faint);
        background:rgba(255,255,255,.025);
        font-size:.63rem;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      @media (max-width:640px){
        .hearth-jeeves-head,
        .hearth-jeeves-form{
          grid-template-columns:1fr;
        }

        .hearth-jeeves-status{
          width:fit-content;
        }

        .hearth-jeeves-option,
        .hearth-jeeves-jump,
        .hearth-jeeves-submit{
          width:100%;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function findMount() {
    if (!doc) return null;

    return (
      doc.querySelector("[data-jeeves-mount]") ||
      doc.querySelector("[data-hearth-jeeves-mount]") ||
      doc.getElementById("hearthJeevesMount") ||
      doc.getElementById("jeevesMount") ||
      doc.getElementById("talkToHouseMount")
    );
  }

  function createMount() {
    if (!doc || !doc.body) return null;

    const existing = findMount();
    if (existing) return existing;

    const mount = doc.createElement("section");
    mount.id = "hearthJeevesMount";
    mount.setAttribute("data-jeeves-mount", "true");
    mount.setAttribute("aria-label", "Talk to the House");
    doc.body.appendChild(mount);
    return mount;
  }

  function renderText(text) {
    return safeString(text)
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function renderOptions(latest) {
    const options = latest && latest.detail && Array.isArray(latest.detail.options)
      ? latest.detail.options
      : [];

    if (!options.length) return "";

    return `
      <div class="hearth-jeeves-options" aria-label="Conversation options">
        ${options.map((item) => `
          <button class="hearth-jeeves-option" type="button" data-jeeves-intent="${escapeHtml(item.intent)}" data-jeeves-value="${escapeHtml(item.value || item.label)}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderJumpPads(latest) {
    const jumpPads = latest && latest.detail && Array.isArray(latest.detail.jumpPads)
      ? latest.detail.jumpPads
      : [];

    const valid = jumpPads.filter((jump) => jump && jump.href);

    if (!valid.length) return "";

    return `
      <div class="hearth-jeeves-jumps" aria-label="Jump pads">
        ${valid.map((jump) => `
          <a class="hearth-jeeves-jump" href="${escapeHtml(jump.href)}" data-tool-id="${escapeHtml(jump.toolId || "")}" data-held="${jump.live ? "false" : "true"}">
            ${escapeHtml(jump.label)}
          </a>
        `).join("")}
      </div>
    `;
  }

  function renderMeta() {
    return `
      <div class="hearth-jeeves-meta" aria-label="Jeeves status">
        <span class="hearth-jeeves-pill">AAI</span>
        <span class="hearth-jeeves-pill">F89 Registry</span>
        <span class="hearth-jeeves-pill">Cycle ${escapeHtml(state.cycleStage)}</span>
        <span class="hearth-jeeves-pill">Anchor ${escapeHtml(state.currentAnchor)}</span>
        <span class="hearth-jeeves-pill">No Storage</span>
      </div>
    `;
  }

  function render() {
    if (!state.mount) return;

    const latest = [...state.history].reverse().find((item) => item.role === "jeeves");

    state.mount.innerHTML = `
      <div class="hearth-jeeves-aai" data-contract="${escapeHtml(CONTRACT)}" data-class="artificial-agent-intelligence">
        <div class="hearth-jeeves-card">
          <header class="hearth-jeeves-head">
            <div class="hearth-jeeves-title">
              <b>Talk to the House</b>
              <strong>Jeeves</strong>
            </div>
            <span class="hearth-jeeves-status">Artificial Agent Intelligence</span>
          </header>

          <div class="hearth-jeeves-log" aria-live="polite">
            ${state.history.map((message) => `
              <article class="hearth-jeeves-message" data-role="${escapeHtml(message.role)}">
                <b>${message.role === "visitor" ? "Visitor" : "Jeeves"}</b>
                ${renderText(message.text)}
              </article>
            `).join("")}
          </div>

          ${renderOptions(latest)}
          ${renderJumpPads(latest)}
          ${renderMeta()}

          <form class="hearth-jeeves-form" data-jeeves-form>
            <input
              class="hearth-jeeves-input"
              name="jeevesPrompt"
              type="text"
              autocomplete="off"
              placeholder="Ask what this is, where to start, why it matters, or what is coming next."
              aria-label="Ask Jeeves"
            >
            <button class="hearth-jeeves-submit" type="submit">Ask</button>
          </form>
        </div>
      </div>
    `;

    bindRenderedEvents();
  }

  function bindRenderedEvents() {
    if (!state.mount) return;

    state.mount.querySelectorAll("[data-jeeves-intent]").forEach((button) => {
      button.addEventListener("click", () => {
        const intent = button.getAttribute("data-jeeves-intent") || INTENT.UNKNOWN;
        const value = button.getAttribute("data-jeeves-value") || button.textContent || "";
        handleVisitorChoice(intent, value);
      });
    });

    const form = state.mount.querySelector("[data-jeeves-form]");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.elements.jeevesPrompt;
        const text = input ? input.value.trim() : "";
        if (!text) return;
        if (input) input.value = "";
        handleVisitorText(text);
      });
    }
  }

  function handleVisitorChoice(intent, value) {
    pushMessage("visitor", value || intent, { intent });
    const response = composeResponse({ intent, value });
    pushMessage("jeeves", response.text, response);
    render();
  }

  function handleVisitorText(text) {
    state.lastVisitorText = text;
    pushMessage("visitor", text, { freeText: true });
    const response = composeResponse({ text });
    pushMessage("jeeves", response.text, response);
    render();
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function updateDataset() {
    setDataset("hearthJeevesLoaded", "true");
    setDataset("hearthJeevesContract", CONTRACT);
    setDataset("hearthJeevesReceipt", RECEIPT);
    setDataset("hearthJeevesVersion", VERSION);
    setDataset("hearthJeevesClass", "artificial-agent-intelligence");
    setDataset("hearthJeevesChatbotClassificationForbidden", "true");
    setDataset("hearthJeevesToolRegistryActive", "true");
    setDataset("hearthJeevesAnchorRegistryActive", "true");
    setDataset("hearthJeevesFibonacciCycleActive", "true");
    setDataset("hearthJeevesCurrentAnchor", state.currentAnchor);
    setDataset("hearthJeevesCurrentIntent", state.currentIntent);
    setDataset("hearthJeevesProgressionScore", state.progressionScore);
    setDataset("hearthJeevesJumpReadinessScore", state.jumpReadinessScore);
    setDataset("hearthJeevesImmersionScore", state.immersionScore);
    setDataset("hearthJeevesGeneratedImage", "false");
    setDataset("hearthJeevesGraphicBox", "false");
    setDataset("hearthJeevesWebGL", "false");
    setDataset("hearthJeevesVisualPassClaimed", "false");
    setDataset("hearthJeevesPublicSuperiorityClaim", "false");
    setDataset("hearthJeevesStorage", "false");
    setDataset("hearthJeevesLocalStorage", "false");
    setDataset("hearthJeevesCookies", "false");
    setDataset("hearthJeevesApiCall", "false");
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      class: "Artificial Agent Intelligence",
      chatbotClassificationForbidden: true,
      talkToTheHouseActive: true,
      jeevesActive: true,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      alignedRegistryCoordinate: MECHANICAL_COORDINATE.alignedRegistryCoordinate,

      toolRegistryActive: true,
      anchorRegistryActive: true,
      fibonacciCycleActive: true,
      conversationalCycleOfProgression: true,
      f89RegistryAlignmentActive: true,

      currentIntent: state.currentIntent,
      currentAnchor: state.currentAnchor,
      cycleStage: state.cycleStage,
      progressionScore: state.progressionScore,
      jumpReadinessScore: state.jumpReadinessScore,
      immersionScore: state.immersionScore,

      livePublicAnchors: [
        "Compass",
        "Coherence Diagnostic",
        "Laws",
        "Gauges",
        "Products",
        "Meet Sean",
        "Mirrorland",
        "Showroom",
        "Audralia",
        "Frontier"
      ],
      futureHeldTools: [
        "Character Profile",
        "Saved Diagnostic",
        "Login",
        "NPC Interaction",
        "Mirror-Me Challenge"
      ],

      currentVsFutureBoundaryActive: true,
      naturalSurfaceLanguageActive: true,
      noAbstractVisitorSurface: true,
      optionsAreSteeringWheel: true,
      jumpPadsSeparateFromConversationOptions: true,

      storage: false,
      localStorage: false,
      cookies: false,
      apiCall: false,
      backend: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      publicSuperiorityClaim: false,

      createdAt: state.createdAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      toolRegistry: clonePlain(TOOL_REGISTRY),
      anchorRegistry: clonePlain(ANCHORS),
      characterRegistry: clonePlain(CHARACTER_REGISTRY),
      fibonacci: clonePlain(FIBONACCI),
      cycleStages: clonePlain(CYCLE_STAGES),
      cycleToFibonacci: clonePlain(CYCLE_TO_FIBONACCI),
      history: clonePlain(state.history),
      state: {
        turn: state.turn,
        currentIntent: state.currentIntent,
        currentAnchor: state.currentAnchor,
        currentPole: state.currentPole,
        immersionScore: state.immersionScore,
        progressionScore: state.progressionScore,
        jumpReadinessScore: state.jumpReadinessScore
      },
      owns: [
        "visitor orientation",
        "natural dialogue surface",
        "anchor selection",
        "tool-status explanation",
        "current-vs-future distinction",
        "jump-pad readiness",
        "Fibonacci conversational cycle",
        "public-safe roadmap explanation"
      ],
      doesNotOwn: [
        "backend persistence",
        "user login",
        "saved character profile",
        "saved diagnostic result",
        "NPC runtime",
        "Mirror-Me runtime",
        "route orchestration",
        "rendering",
        "WebGL",
        "generated images",
        "GraphicBox",
        "planet truth",
        "public superiority claim",
        "final visual pass claim"
      ]
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_JEEVES_AAI_F89_TOOL_REGISTRY_CONVERSATIONAL_CYCLE_ENGINE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `class=${r.class}`,
      `chatbotClassificationForbidden=${r.chatbotClassificationForbidden}`,
      `talkToTheHouseActive=${r.talkToTheHouseActive}`,
      `jeevesActive=${r.jeevesActive}`,
      "",
      `toolRegistryActive=${r.toolRegistryActive}`,
      `anchorRegistryActive=${r.anchorRegistryActive}`,
      `fibonacciCycleActive=${r.fibonacciCycleActive}`,
      `conversationalCycleOfProgression=${r.conversationalCycleOfProgression}`,
      `f89RegistryAlignmentActive=${r.f89RegistryAlignmentActive}`,
      "",
      `currentIntent=${r.currentIntent}`,
      `currentAnchor=${r.currentAnchor}`,
      `cycleStage=${r.cycleStage}`,
      `progressionScore=${r.progressionScore}`,
      `jumpReadinessScore=${r.jumpReadinessScore}`,
      `immersionScore=${r.immersionScore}`,
      "",
      `currentVsFutureBoundaryActive=${r.currentVsFutureBoundaryActive}`,
      `naturalSurfaceLanguageActive=${r.naturalSurfaceLanguageActive}`,
      `noAbstractVisitorSurface=${r.noAbstractVisitorSurface}`,
      `optionsAreSteeringWheel=${r.optionsAreSteeringWheel}`,
      `jumpPadsSeparateFromConversationOptions=${r.jumpPadsSeparateFromConversationOptions}`,
      "",
      `storage=${r.storage}`,
      `localStorage=${r.localStorage}`,
      `cookies=${r.cookies}`,
      `apiCall=${r.apiCall}`,
      `backend=${r.backend}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_JEEVES_AAI = api;
    root.HEARTH_JEEVES = api;
    root.TALK_TO_THE_HOUSE = api;
    root.JEEVES = api;

    root.HEARTH.jeeves = api;
    root.HEARTH.talkToTheHouse = api;
    root.HEARTH.jeevesAAI = api;

    root.DEXTER_LAB.jeevesAAI = api;
    root.DEXTER_LAB.talkToTheHouse = api;

    root.HEARTH_JEEVES_RECEIPT = getReceiptLight();
    root.TALK_TO_THE_HOUSE_RECEIPT = getReceiptLight();

    root.__HEARTH_JEEVES_LOADED__ = true;
    root.__HEARTH_JEEVES_CONTRACT__ = CONTRACT;
    root.__HEARTH_JEEVES_CLASS__ = "ARTIFICIAL_AGENT_INTELLIGENCE";
    root.__HEARTH_JEEVES_CHATBOT_CLASSIFICATION_FORBIDDEN__ = true;
    root.__HEARTH_JEEVES_STORAGE__ = false;
    root.__HEARTH_JEEVES_WEBGL__ = false;
    root.__HEARTH_JEEVES_GRAPHIC_BOX__ = false;
    root.__HEARTH_JEEVES_GENERATED_IMAGE__ = false;
    root.__HEARTH_JEEVES_PUBLIC_SUPERIORITY_CLAIM__ = false;

    updateDataset();

    try {
      root.dispatchEvent(new CustomEvent("hearth:jeeves-aai-ready", {
        detail: getReceiptLight()
      }));
    } catch (_error) {
      /* no-op */
    }
  }

  function mount() {
    if (!doc) return false;

    injectStyle();

    state.mount = createMount();
    if (!state.mount) return false;

    if (!state.history.length) {
      const opening = openingResponse();
      pushMessage("jeeves", opening.text, opening);
    }

    state.mounted = true;
    state.updatedAt = nowIso();

    render();
    publishGlobals();

    return true;
  }

  function boot() {
    state.createdAt = nowIso();
    state.updatedAt = state.createdAt;

    publishGlobals();

    if (!doc) return;

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
      mount();
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,

    FIBONACCI,
    CYCLE_STAGES,
    TOOL_STATUS,
    INTENT,
    TOOL_REGISTRY,
    ANCHORS,
    CHARACTER_REGISTRY,
    MECHANICAL_COORDINATE,

    classifyVisitorIntent,
    anchorForIntent,
    composeResponse,
    handleVisitorText,
    handleVisitorChoice,

    isLivePublicTool,
    jumpsForAnchor,
    getJump,

    mount,
    render,
    publishGlobals,
    updateDataset,

    getReceiptLight,
    getReceipt,
    getReceiptText,

    artificialAgentIntelligenceActive: true,
    chatbotClassificationForbidden: true,
    talkToTheHouseActive: true,
    jeevesActive: true,
    toolRegistryActive: true,
    anchorRegistryActive: true,
    fibonacciCycleActive: true,
    conversationalCycleOfProgression: true,
    f89RegistryAlignmentActive: true,
    naturalSurfaceLanguageActive: true,
    currentVsFutureBoundaryActive: true,

    ownsVisitorOrientation: true,
    ownsAnchorSelection: true,
    ownsNaturalDialogueSurface: true,
    ownsJumpPadReadiness: true,
    ownsToolStatusExplanation: true,
    ownsFutureRoadmapBoundary: true,

    ownsBackendPersistence: false,
    ownsLogin: false,
    ownsSavedProfile: false,
    ownsSavedDiagnostic: false,
    ownsNpcRuntime: false,
    ownsMirrorMeRuntime: false,
    ownsRendering: false,
    ownsWebGL: false,
    ownsGeneratedImage: false,
    ownsGraphicBox: false,
    ownsPlanetTruth: false,
    ownsPublicSuperiorityClaim: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    publicSuperiorityClaim: false,
    storage: false,
    localStorage: false,
    cookies: false,
    apiCall: false,
    backend: false,

    get state() {
      return state;
    }
  };

  boot();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
