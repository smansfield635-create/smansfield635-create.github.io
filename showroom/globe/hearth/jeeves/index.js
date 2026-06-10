// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_PAIRED_SME_FRONTEND_ENGINE_TNT_v17
// Full-file replacement.
// Preserves existing HTML/CSS contract.
// Owns front-end DOM control, visual pacing, tap-to-advance, seed clearing, route rendering,
// v16-compatible deterministic fallback, paired back-brain request handling, visible options,
// route handoff filtering, and final route authority.
// Does not own server-side model execution, API keys, persistent memory, moderation authority,
// or backend canon storage.

(function hearthJeevesPairedSmeFrontendEngine(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_PAIRED_SME_FRONTEND_ENGINE_TNT_v17";
  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var JEEVES_BRAIN_ENDPOINT = "/api/jeeves.js";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";
  var MODE_CHARACTER_MIRROR = "characterMirror";

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
    scientificLaw: "/laws/scientific-law/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    interactiveNarrative: "/showroom/globe/",
    mirrorland: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    frontier: "/explore/frontier/",
    frontierEnergy: "/explore/frontier/energy/",
    frontierWater: "/explore/frontier/water/",
    frontierWaste: "/explore/frontier/waste/",
    frontierClosedLoop: "/explore/frontier/closed-loop/",
    frontierInfrastructure: "/explore/frontier/infrastructure/",
    frontierLattice: "/explore/frontier/lattice/",
    frontierUrban: "/explore/frontier/urban/",
    frontierManual: "/explore/frontier/manual/",
    frontierShimmer: "/explore/frontier/shimmer/",
    frontierTrajectory: "/explore/frontier/trajectory/",
    frontierVision: "/explore/frontier/vision/",
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
    scientificLaw: "Open Scientific Law",
    gauges: "Open Gauges",
    showroom: "Open the Showroom",
    hearth: "Open Hearth",
    globeWindow: "Open the World Gate",
    interactiveNarrative: "Enter the Interactive Narrative",
    mirrorland: "Open Mirrorland",
    audralia: "Visit Audralia",
    frontier: "Explore Frontier",
    frontierEnergy: "Open Energy",
    frontierWater: "Open Water",
    frontierWaste: "Open Waste",
    frontierClosedLoop: "Open Closed Loop",
    frontierInfrastructure: "Open Infrastructure",
    frontierLattice: "Open Lattice",
    frontierUrban: "Open Urban",
    frontierManual: "Open Manual",
    frontierShimmer: "Open Shimmer",
    frontierTrajectory: "Open Trajectory",
    frontierVision: "Open Vision",
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

  var APPROVED_ROUTE_IDS = [
    "compass",
    "home",
    "siteGuide",
    "coherenceDiagnostic",
    "meetSean",
    "products",
    "laws",
    "scientificLaw",
    "gauges",
    "showroom",
    "hearth",
    "globeWindow",
    "interactiveNarrative",
    "mirrorland",
    "audralia",
    "frontier",
    "frontierEnergy",
    "frontierWater",
    "frontierWaste",
    "frontierClosedLoop",
    "frontierInfrastructure",
    "frontierLattice",
    "frontierUrban",
    "frontierManual",
    "frontierShimmer",
    "frontierTrajectory",
    "frontierVision",
    "characters",
    "controlRoom",
    "book",
    "nineSummits",
    "aboutUnderdog"
  ];

  var APPROVED_TARGETS = [
    "intro",
    "askFirst",
    "websitePath",
    "skepticPlain",
    "proofPath",
    "diagnosticPath",
    "worldPath",
    "worldGatePath",
    "charactersPath",
    "compassPath",
    "whereToStart",
    "siteGuidePath",
    "lawsPath",
    "scientificLawPath",
    "scientificLawTheoryPath",
    "scientificLawEvidencePath",
    "scientificLawMeasurePath",
    "scientificLawLimitsPath",
    "scientificLawRoutePath",
    "scientificLawLadderPath",
    "scientificLawTermsPath",
    "gaugesPath",
    "seanPath",
    "underdogPath",
    "productsPath",
    "bookPath",
    "nineSummitsPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "audraliaPath",
    "frontierPath",
    "frontierSystemsPath",
    "frontierEnergyPath",
    "frontierWaterPath",
    "frontierWastePath",
    "frontierClosedLoopPath",
    "frontierInfrastructurePath",
    "frontierLatticePath",
    "frontierUrbanPath",
    "frontierManualPath",
    "frontierShimmerPath",
    "frontierTrajectoryPath",
    "frontierVisionPath",
    "frontierLawPath",
    "frontierCharactersPath",
    "futureProfilePath",
    "mirrorMePath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterFactionsPath",
    "characterStoryPressurePath",
    "characterFirstPath",
    "characterAurenValePath",
    "characterDextrionPath",
    "characterAlaricPath",
    "characterTarianPath",
    "characterElaraPath",
    "characterSorenPath",
    "characterJeevesPath",
    "characterRemoteTeamPath",
    "characterMirrorPath",
    "selfLearningPath",
    "characterMirrorQuestionOne",
    "characterMirrorQuestionTwo",
    "characterMirrorQuestionThree",
    "characterMirrorResult",
    "recenterNode",
    "loopRecovery",
    "cleanDoor",
    "switchTopics",
    "sharpQuestion",
    "returnFork",
    "restartFork"
  ];

  var FORBIDDEN_PUBLIC_LANGUAGE = [
    { pattern: /\bscope lane\b/gi, replacement: "path" },
    { pattern: /\bregistry\b/gi, replacement: "guide" },
    { pattern: /\borgan\b/gi, replacement: "part" },
    { pattern: /\broute lane\b/gi, replacement: "path" },
    { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
    { pattern: /\bexpression payload\b/gi, replacement: "answer" },
    { pattern: /\bprogression state\b/gi, replacement: "step" },
    { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
    { pattern: /\bAPI\b/g, replacement: "answer path" },
    { pattern: /\bpublic human-voice side\b/gi, replacement: "place where the voice becomes human" },
    { pattern: /\bDOM\b/g, replacement: "visible interface" },
    { pattern: /\bserver[-\s]?side\b/gi, replacement: "deeper house layer" },
    { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
    { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
    { pattern: /\bcontract\b/gi, replacement: "governing mark" },
    { pattern: /\bTNT\b/g, replacement: "" }
  ];

  var SPEECH_LABEL_FALLBACKS = {
    websitePath: "Guide me through the public estate.",
    skepticPlain: "Explain it plainly.",
    proofPath: "Tell me what proves it.",
    diagnosticPath: "Tell me about the Diagnostic.",
    worldPath: "Tell me about the world side.",
    worldGatePath: "Tell me about the Interactive Narrative.",
    charactersPath: "Who are the characters?",
    compassPath: "I need the Compass.",
    siteGuidePath: "Tell me how the estate is organized.",
    lawsPath: "Explain the Laws.",
    scientificLawPath: "Explain Scientific Law.",
    scientificLawTheoryPath: "Explain Theory.",
    scientificLawEvidencePath: "Explain Evidence.",
    scientificLawMeasurePath: "Explain Measure.",
    scientificLawLimitsPath: "Explain Limits.",
    scientificLawRoutePath: "Show the Scientific Route.",
    scientificLawLadderPath: "Show the claim testing ladder.",
    scientificLawTermsPath: "Explain the deeper terms.",
    gaugesPath: "Explain Gauges.",
    seanPath: "Tell me about Sean.",
    underdogPath: "Tell me about This Underdog.",
    productsPath: "Tell me about the practical wing.",
    bookPath: "Tell me about the book path.",
    nineSummitsPath: "Tell me about Nine Summits.",
    hearthPath: "I want to understand Hearth.",
    hearthFacilityPath: "Explain Hearth as a facility.",
    hearthConstructPath: "Explain Hearth as a planetary construct engine.",
    hearthFrontierPath: "Connect Hearth to Frontier.",
    hearthLawPath: "Connect Hearth to Scientific Law.",
    audraliaPath: "Tell me about Audralia.",
    frontierPath: "What is Frontier?",
    frontierSystemsPath: "Show the Frontier systems.",
    frontierEnergyPath: "Explain Energy.",
    frontierWaterPath: "Explain Water.",
    frontierWastePath: "Explain Waste.",
    frontierClosedLoopPath: "Explain Closed Loop.",
    frontierInfrastructurePath: "Explain Infrastructure.",
    frontierLatticePath: "Explain Lattice.",
    frontierUrbanPath: "Explain Urban.",
    frontierManualPath: "Explain Manual.",
    frontierShimmerPath: "Explain Shimmer.",
    frontierTrajectoryPath: "Explain Trajectory.",
    frontierVisionPath: "Explain Vision.",
    frontierLawPath: "Connect Frontier to Scientific Law.",
    frontierCharactersPath: "Connect Frontier to the characters.",
    futureProfilePath: "What is Future Profile?",
    mirrorMePath: "What is Mirror Me?",
    characterIdentityPath: "Who are the characters?",
    characterRelationshipsPath: "How do the characters relate?",
    characterTensionsPath: "What conflict do they carry?",
    characterMotivesPath: "What motivates them?",
    characterFactionsPath: "Are there sides or factions?",
    characterStoryPressurePath: "Why should I care about the characters?",
    characterFirstPath: "Who should I meet first?",
    characterAurenValePath: "Tell me about Auren Vale.",
    characterDextrionPath: "Tell me about Dextrion.",
    characterAlaricPath: "Tell me about Alaric.",
    characterTarianPath: "Tell me about Tarian.",
    characterElaraPath: "Tell me about Elara.",
    characterSorenPath: "Tell me about Soren.",
    characterJeevesPath: "Tell me about Jeeves.",
    characterRemoteTeamPath: "Tell me about the Remote Team.",
    characterMirrorPath: "Which character am I most like?",
    selfLearningPath: "Help me learn about myself.",
    characterMirrorQuestionOne: "Ask the first mirror question.",
    characterMirrorQuestionTwo: "Ask the second mirror question.",
    characterMirrorQuestionThree: "Ask the third mirror question.",
    characterMirrorResult: "Show my reflective match.",
    cleanDoor: "Which door fits this best?",
    sharpQuestion: "Ask me a sharper question.",
    switchTopics: "Switch topics.",
    recenterNode: "Re-center me.",
    returnFork: "I need the clean fork again.",
    restartFork: "Start this over."
  };

  var CHARACTER_REGISTRY = {
    aurenVale: {
      id: "aurenVale",
      name: "Auren Vale",
      shortName: "Auren",
      title: "Sanctuary Builder",
      target: "characterAurenValePath",
      route: "characters",
      oneLine: "He keeps the manor from becoming a beautiful cage.",
      pressure: "Every protected life makes the manor harder to hide.",
      mirror: "Protection, custody, shelter, and fear of exposure.",
      summary: "Auren Vale is the Sanctuary Builder. He keeps the manor from becoming a beautiful cage. His pressure is protection versus exposure."
    },
    dextrion: {
      id: "dextrion",
      name: "Dextrion",
      shortName: "Dextrion",
      title: "Earth-Side Originator",
      target: "characterDextrionPath",
      route: "characters",
      oneLine: "He opened the path and stayed behind.",
      pressure: "Every one-way crossing remains on his hands.",
      mirror: "Repair, responsibility, guilt, and pressure to fix what broke.",
      summary: "Dextrion is the Earth-Side Originator. He opened the path and stayed behind. His pressure is repair responsibility."
    },
    alaric: {
      id: "alaric",
      name: "Alaric",
      shortName: "Alaric",
      title: "Field Navigator",
      target: "characterAlaricPath",
      route: "characters",
      oneLine: "He reads danger before proof arrives.",
      pressure: "Waiting for proof can close the only safe route.",
      mirror: "Early warning, danger-reading, orientation, and acting before others believe the proof.",
      summary: "Alaric is the Field Navigator. He reads danger before proof arrives. His pressure is early warning versus trust."
    },
    tarian: {
      id: "tarian",
      name: "Tarian",
      shortName: "Tarian",
      title: "Water Anchor",
      target: "characterTarianPath",
      route: "characters",
      oneLine: "He keeps the mission physically honest.",
      pressure: "The future fails if the body cannot continue.",
      mirror: "Endurance, body-level survival, water, recovery, and carrying too much.",
      summary: "Tarian is the Water Anchor. He keeps the mission physically honest. His pressure is human limit versus mission demand."
    },
    elara: {
      id: "elara",
      name: "Elara",
      shortName: "Elara",
      title: "Signal Bearer",
      target: "characterElaraPath",
      route: "characters",
      oneLine: "She makes the future visible before it disappears.",
      pressure: "The future has to be visible before anyone moves toward it.",
      mirror: "Signal, visibility, hope, public voice, and risk of being seen.",
      summary: "Elara is the Signal Bearer. She makes the future visible before it disappears. Her pressure is visibility versus exposure."
    },
    soren: {
      id: "soren",
      name: "Soren",
      shortName: "Soren",
      title: "Boundary Keeper",
      target: "characterSorenPath",
      route: "characters",
      oneLine: "He refuses fake restoration.",
      pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
      mirror: "Truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
      summary: "Soren is the Boundary Keeper. He refuses fake restoration. His pressure is truth versus denial."
    },
    jeeves: {
      id: "jeeves",
      name: "Jeeves",
      shortName: "Jeeves",
      title: "Manor Interface",
      target: "characterJeevesPath",
      route: "characters",
      oneLine: "He decides how much truth the house can reveal.",
      pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
      mirror: "Sequence, restraint, truth timing, entry, and controlled revelation.",
      summary: "Jeeves is the Manor Interface. He decides how much truth the house can reveal. His pressure is protection versus revelation."
    },
    remoteTeam: {
      id: "remoteTeam",
      name: "Remote Team",
      shortName: "Remote Team",
      title: "Distributed Response Unit",
      target: "characterRemoteTeamPath",
      route: "characters",
      oneLine: "They carry survival beyond the estate.",
      pressure: "If survival cannot leave the manor, the manor is only a bunker.",
      mirror: "Distributed responsibility, field logistics, helping beyond the safe center, and public survival.",
      summary: "The Remote Team is the Distributed Response Unit. They carry survival beyond the estate. Their pressure is distribution versus collapse pressure."
    }
  };

  var ARCHETYPE_CHARACTER_MAP = {
    Strategist: ["jeeves", "aurenVale", "alaric"],
    Builder: ["dextrion", "remoteTeam", "tarian"],
    Mitigator: ["tarian", "aurenVale", "remoteTeam"],
    Auditor: ["soren", "dextrion", "jeeves"]
  };

  var LOCAL_MIRROR_KEYWORDS = [
    { id: "aurenVale", words: ["protect", "shelter", "safe", "hide", "custody", "exposure"] },
    { id: "dextrion", words: ["fix", "repair", "responsible", "guilt", "broken", "system"] },
    { id: "alaric", words: ["danger", "warning", "route", "early", "before proof", "not believed"] },
    { id: "tarian", words: ["tired", "body", "carry", "water", "survive", "endure"] },
    { id: "elara", words: ["hope", "visible", "signal", "voice", "seen", "future"] },
    { id: "soren", words: ["truth", "evidence", "hidden cost", "contradiction", "boundary", "denial"] },
    { id: "jeeves", words: ["sequence", "timing", "truth", "door", "entry", "reveal"] },
    { id: "remoteTeam", words: ["team", "community", "field", "distributed", "public", "beyond"] }
  ];

  var SCIENTIFIC_LAW = {
    core: "A claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
    summary: "Scientific Law is the Reality Test chamber. It separates what sounds convincing from what keeps working after observation, evidence, measurement, comparison, correction, uncertainty, and limits.",
    doors: {
      theory: "Theory is the explanation that risks being wrong.",
      evidence: "Evidence is the checkable record that survives preference.",
      measure: "Measure is the coordinate system attached to a claim.",
      limits: "Limits are the boundary that protects truth from overclaiming."
    },
    ladder: "Impression → Observation → Evidence → Measurement → Repeatability → Model → Limitation → Scientific Claim."
  };

  var FRONTIER_SYSTEMS = {
    energy: {
      target: "frontierEnergyPath",
      route: "frontierEnergy",
      name: "Energy",
      status: "Fusion readiness",
      text: "Energy starts with power readiness: storage, load protection, facility inputs, losses, and fusion readiness without pretending the final breakthrough is already solved."
    },
    water: {
      target: "frontierWaterPath",
      route: "frontierWater",
      name: "Water",
      status: "Closed water systems",
      text: "Water asks how water keeps moving without being wasted: capture, cleaning, routing, reuse, continuity, quality checks, and failure detection."
    },
    waste: {
      target: "frontierWastePath",
      route: "frontierWaste",
      name: "Waste",
      status: "Wastewater systems",
      text: "Waste begins where discarded material becomes a design test: sanitation, recovery, contaminant control, treatment, reuse classification, and return-material accounting."
    },
    closedLoop: {
      target: "frontierClosedLoopPath",
      route: "frontierClosedLoop",
      name: "Closed Loop",
      status: "Answer-back systems",
      text: "Closed Loop asks whether a system can answer back: detect pressure, register failure, correct course, and prove the correction returned somewhere useful."
    },
    infrastructure: {
      target: "frontierInfrastructurePath",
      route: "frontierInfrastructure",
      name: "Infrastructure",
      status: "Support load",
      text: "Infrastructure tests whether the world can carry weight: roads, supports, utilities, corridors, redundancy, and load-bearing civic structure."
    },
    lattice: {
      target: "frontierLatticePath",
      route: "frontierLattice",
      name: "Lattice",
      status: "Ordered growth",
      text: "Lattice asks whether growth has order. Placement, count, relationship, and pattern keep a world from expanding randomly into noise."
    },
    urban: {
      target: "frontierUrbanPath",
      route: "frontierUrban",
      name: "Urban",
      status: "Civic pressure",
      text: "Urban tests settlement pressure: corridors, density, shelter, public systems, movement, and built-world consequence."
    },
    manual: {
      target: "frontierManualPath",
      route: "frontierManual",
      name: "Manual",
      status: "Operating path",
      text: "Manual turns the playground into instructions, handling rules, readable next steps, safety notes, and operating boundaries."
    },
    shimmer: {
      target: "frontierShimmerPath",
      route: "frontierShimmer",
      name: "Shimmer",
      status: "Visible signal",
      text: "Shimmer makes change visible. A glint, warning, pulse, or surface shift tells the visitor that pressure is moving before the full system explains itself."
    },
    trajectory: {
      target: "frontierTrajectoryPath",
      route: "frontierTrajectory",
      name: "Trajectory",
      status: "Direction and timing",
      text: "Trajectory asks where the future is moving: direction, timing, path, drift detection, course correction, and outcome tracking."
    },
    vision: {
      target: "frontierVisionPath",
      route: "frontierVision",
      name: "Vision",
      status: "Horizon aim",
      text: "Vision keeps the horizon in view. It asks what kind of future the world is trying to reach before systems harden into habits."
    }
  };

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
      trail: [],
      characterMirrorAnswers: [],
      lastBrainIntent: "",
      lastBrainCanonStatus: "",
      lastBrainConclusiveState: ""
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

    brain: {
      endpoint: JEEVES_BRAIN_ENDPOINT,
      enabled: true,
      lastRequest: null,
      lastResponse: null,
      lastStatus: "ready",
      timeoutMs: 9000
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

  function route(id) {
    return getHandoff(id);
  }

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

  function isHearthContext() {
    var text = [
      state.currentNode,
      state.currentTopic,
      state.currentPosture,
      state.visitor.lastChoiceLabel
    ].join(" ").toLowerCase();

    return text.indexOf("hearth") !== -1 || text.indexOf("construct") !== -1;
  }

  function sanitizePublicText(text) {
    var clean = String(text || "");

    FORBIDDEN_PUBLIC_LANGUAGE.forEach(function eachRule(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (!isHearthContext()) {
      clean = clean.replace(/\bconstruct\b/gi, "work");
      clean = clean.replace(/\bengine\b/gi, "system");
    }

    clean = clean.replace(/\s{2,}/g, " ");
    return clean.trim();
  }

  function sanitizeConversationLabel(label, target) {
    var clean = String(label || "").trim();
    var actionStart = /^(open|visit|enter|explore|return to|go to|launch|take the|read the)\b/i;

    if (actionStart.test(clean)) {
      return SPEECH_LABEL_FALLBACKS[target] || "Tell me more about this.";
    }

    return sanitizePublicText(clean);
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
    state.visitor.characterMirrorAnswers = [];
    state.visitor.lastBrainIntent = "";
    state.visitor.lastBrainCanonStatus = "";
    state.visitor.lastBrainConclusiveState = "";
  }

  function inferItchFromChoice(choice, topic) {
    if (!choice) return state.visitor.lastItch || "choosing the next door";
    if (choice.signal === "skeptic") return "testing whether the estate deserves trust";
    if (choice.signal === "self") return "looking for a mirror";
    if (choice.signal === "world") return "trying to cross into the future-facing world side";
    if (choice.signal === "practical") return "looking for something usable";
    if (choice.signal === "lost") return "trying to get re-centered";
    if (choice.signal === "mirror") return "trying to learn about yourself through a character mirror";
    if (topic === "characterMirror") return "trying to learn which pressure pattern you currently resemble";
    if (topic === "characters" || topic.indexOf("character") === 0) return "trying to understand who carries the world’s pressure";
    if (topic === "scientificLaw") return "trying to test a claim before trusting it";
    if (topic === "frontier") return "trying to understand how future systems are tested";
    if (topic === "hearth") return "trying to understand where world-formation becomes operational";
    if (topic === "underdog") return "trying to understand the underdog voice in the visitor";
    if (topic === "book" || topic === "nineSummits") return "trying to understand the larger development path";
    return "choosing the next door";
  }

  function updateMirrorAnswers(choice) {
    if (!choice || !choice.label) return;

    if (
      state.currentNode === "characterMirrorQuestionOne" ||
      state.currentNode === "characterMirrorQuestionTwo" ||
      state.currentNode === "characterMirrorQuestionThree"
    ) {
      state.visitor.characterMirrorAnswers.push(choice.label);

      while (state.visitor.characterMirrorAnswers.length > 8) {
        state.visitor.characterMirrorAnswers.shift();
      }
    }
  }

  function updateVisitor(choice, node) {
    var topic = node.topic || "arrival";
    var sameTopic = state.visitor.lastTopic === topic;
    var scopeChanged = state.visitor.lastScopeLane !== node.scopeLane;

    updateMirrorAnswers(choice);

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

  function setDocumentState() {
    var state256 = getState256();

    document.documentElement.dataset.jeevesEngineContract = CONTRACT;
    document.documentElement.dataset.jeevesRuntimeReady = "true";
    document.documentElement.dataset.jeevesPairedBrain = "true";
    document.documentElement.dataset.jeevesBackBrainEndpoint = state.brain.endpoint;
    document.documentElement.dataset.jeevesState = state256.label;
    document.documentElement.dataset.jeevesPosture = state.currentPosture;
    document.documentElement.dataset.jeevesPhase = state.currentPhase;
    document.documentElement.dataset.jeevesTopic = state.currentTopic;
    document.documentElement.dataset.jeevesScopeLane = state.currentScopeLane;
    document.documentElement.dataset.jeevesVoiceMode = state.currentVoiceMode;
    document.documentElement.dataset.jeevesCharacterMirror = "active";
    document.documentElement.dataset.jeevesFinalRouteAuthority = "front-end";

    if (els.status) {
      els.status.setAttribute("data-jeeves-state", state256.label);
    }
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
    setDocumentState();

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

  function getState256() {
    return {
      posture: state.currentPosture,
      phase: state.currentPhase,
      index: state.stateIndex,
      label: "ST-" + String(state.stateIndex + 1).padStart(3, "0") + "-OF-256"
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

    if (settings && settings.source) {
      message.setAttribute("data-message-source", settings.source);
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
    var target = normalizeTarget(item.target);
    var cleanLabel = sanitizeConversationLabel(item.label, target);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", item.type || "conversation");
    button.setAttribute("data-option-target", target || "");
    button.setAttribute("data-option-scope-lane", item.scopeLane || (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE));

    if (label) {
      label.textContent = cleanLabel;
    } else {
      button.textContent = cleanLabel;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption({
        label: cleanLabel,
        target: target,
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

  function normalizeTarget(target) {
    var value = String(target || "").trim();
    if (APPROVED_TARGETS.indexOf(value) === -1) return "recenterNode";
    return value;
  }

  function normalizeRouteId(id) {
    var value = String(id || "").trim();
    if (APPROVED_ROUTE_IDS.indexOf(value) === -1) return "";
    return value;
  }

  function renderOptions(options) {
    var clean = dedupeOptions(options || []).filter(function filterOption(item) {
      return item && item.label && item.target;
    });

    if (!clean.length) {
      clean = [
        control("Ask me a sharper question.", "sharpQuestion"),
        control("Switch topics.", "switchTopics"),
        control("Re-center me.", "recenterNode"),
        control("Choose the next door.", "cleanDoor")
      ];
    }

    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    clean.slice(0, 8).forEach(function eachOption(item) {
      els.promptGrid.appendChild(makeOptionButton(item));
    });
  }

  function renderHandoffs(ids) {
    var handoffs = [];

    clearElement(els.handoffGrid);

    (ids || []).forEach(function eachId(id) {
      var routeId = typeof id === "string" ? normalizeRouteId(id) : normalizeRouteId(id.id);
      var item = routeId ? getHandoff(routeId) : null;

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

    handoffs.slice(0, 6).forEach(function eachHandoff(item) {
      els.handoffGrid.appendChild(makeRouteLink(item));
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

  async function playBeats(beats, token, source) {
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
          state.currentPosture === "characters" ||
          state.currentPosture === "diagnostic"
        ),
        source: source || "local"
      });

      await waitSkippable(getReadDelay(beat), "reading");
    }

    if (token !== state.runToken) return false;

    await waitSkippable(PACING.optionRevealDelayMs, "options");

    return token === state.runToken;
  }

  function makeNode(node, topic, posture, phase, scopeLane, voiceMode, depth, beats, options, handoffs) {
    return {
      node: node,
      topic: topic || node,
      posture: posture || "orientation",
      phase: phase || "ground",
      scopeLane: scopeLane || SCOPE_OBJECTIVE,
      voiceMode: voiceMode || MODE_OBJECTIVE,
      depth: depth || 0,
      beats: (beats || []).slice(),
      options: (options || []).slice(),
      handoffs: (handoffs || []).slice(),
      source: "local"
    };
  }

  function conclusiveOptions() {
    return [
      control("Ask me a sharper question.", "sharpQuestion"),
      control("Switch topics.", "switchTopics"),
      control("Choose the next door.", "cleanDoor"),
      back("I need the clean fork again.", "returnFork")
    ];
  }

  function getNode(nodeId, choice) {
    var id = normalizeNode(nodeId);
    var character;
    var frontierKey;

    if (id === "restartFork") {
      resetState();
      return getNode("intro", choice);
    }

    if (id === "intro") return makeIntroNode();
    if (id === "askFirst") return makeAskFirstNode();
    if (id === "returnFork") return makeReturnForkNode();
    if (id === "recenterNode" || id === "loopRecovery") return makeRecenterNode();
    if (id === "switchTopics") return makeSwitchTopicsNode();
    if (id === "sharpQuestion") return makeSharpQuestionNode();
    if (id === "cleanDoor") return makeCleanDoorNode();

    if (id === "websitePath") return makeWebsiteNode();
    if (id === "compassPath" || id === "whereToStart") return makeCompassNode();
    if (id === "siteGuidePath") return makeSiteGuideNode();
    if (id === "proofPath" || id === "skepticPlain" || id === "lawsPath") return makeProofNode();
    if (id === "gaugesPath") return makeGaugesNode();
    if (id === "diagnosticPath" || id === "futureProfilePath") return makeDiagnosticNode();
    if (id === "seanPath") return makeSeanNode();
    if (id === "underdogPath") return makeUnderdogNode();
    if (id === "productsPath") return makeProductsNode();
    if (id === "bookPath" || id === "nineSummitsPath") return makeBookNode();
    if (id === "worldPath" || id === "worldGatePath" || id === "mirrorland" || id === "mirrorMePath") return makeWorldNode();
    if (id === "hearthPath" || id === "hearthFacilityPath" || id === "hearthConstructPath" || id === "hearthFrontierPath" || id === "hearthLawPath") return makeHearthNode(id);
    if (id === "audraliaPath") return makeAudraliaNode();
    if (id === "scientificLawPath" || id.indexOf("scientificLaw") === 0) return makeScientificLawNode(id);
    if (id === "frontierPath" || id === "frontierSystemsPath" || id === "frontierLawPath" || id === "frontierCharactersPath" || id.indexOf("frontier") === 0) {
      frontierKey = targetToFrontierKey(id);
      return makeFrontierNode(id, frontierKey);
    }

    character = targetToCharacter(id);
    if (character) return makeCharacterNode(character);

    if (
      id === "charactersPath" ||
      id === "characterIdentityPath" ||
      id === "characterRelationshipsPath" ||
      id === "characterTensionsPath" ||
      id === "characterMotivesPath" ||
      id === "characterFactionsPath" ||
      id === "characterStoryPressurePath" ||
      id === "characterFirstPath"
    ) {
      return makeCharactersNode(id);
    }

    if (
      id === "characterMirrorPath" ||
      id === "selfLearningPath" ||
      id === "characterMirrorQuestionOne" ||
      id === "characterMirrorQuestionTwo" ||
      id === "characterMirrorQuestionThree" ||
      id === "characterMirrorResult"
    ) {
      return makeCharacterMirrorNode(id);
    }

    return makeRecenterNode();
  }

  function makeIntroNode() {
    return makeNode(
      "intro",
      "arrival",
      "arrival",
      "receive",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Hello. I’m Jeeves.",
        "I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole estate at once.",
        "I can guide you through the public estate, take you toward the world side, or help you begin with a mirror."
      ],
      [
        say("Guide me through the public estate.", "websitePath", { signal: "orientation" }),
        say("Take me toward the world side.", "worldPath", { signal: "world" }),
        say("I’m skeptical. Explain it plainly.", "skepticPlain", { signal: "skeptic" }),
        say("Which character am I most like?", "characterMirrorPath", { signal: "mirror" }),
        say("Help me learn about myself.", "selfLearningPath", { signal: "mirror" }),
        say("Ask me one question first.", "askFirst", { signal: "question" })
      ],
      []
    );
  }

  function makeAskFirstNode() {
    return makeNode(
      "askFirst",
      "arrival",
      "arrival",
      "invite",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask plainly.",
        "What brought you here first: orientation, skepticism, self-reflection, practical use, the world side, or the character mirror?"
      ],
      [
        say("Orientation.", "websitePath", { signal: "orientation" }),
        say("Skepticism.", "skepticPlain", { signal: "skeptic" }),
        say("Self-reflection.", "diagnosticPath", { signal: "self" }),
        say("Practical use.", "productsPath", { signal: "practical" }),
        say("The world side.", "worldPath", { signal: "world" }),
        say("The character mirror.", "characterMirrorPath", { signal: "mirror" })
      ],
      []
    );
  }

  function makeReturnForkNode() {
    return makeNode(
      "returnFork",
      "arrival",
      "arrival",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Then we return to the clean fork.",
        "Public estate, proof, Diagnostic, world side, practical wing, or character mirror?"
      ],
      [
        say("Public estate.", "websitePath", { signal: "orientation" }),
        say("Proof.", "proofPath", { signal: "skeptic" }),
        say("Diagnostic.", "diagnosticPath", { signal: "self" }),
        say("World side.", "worldPath", { signal: "world" }),
        say("Practical wing.", "productsPath", { signal: "practical" }),
        say("Character mirror.", "characterMirrorPath", { signal: "mirror" })
      ],
      []
    );
  }

  function makeRecenterNode() {
    return makeNode(
      "recenterNode",
      "recenter",
      "orientation",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "I may have taken you too deep too quickly.",
        "Let me bring this back to one clear doorway.",
        "Choose the kind of pressure you want to follow."
      ],
      [
        say("I need orientation.", "compassPath", { signal: "orientation" }),
        say("I want proof.", "proofPath", { signal: "skeptic" }),
        say("I want the Diagnostic.", "diagnosticPath", { signal: "self" }),
        say("I want the world side.", "worldPath", { signal: "world" }),
        say("I want the character mirror.", "characterMirrorPath", { signal: "mirror" }),
        back("I need the clean fork again.", "returnFork")
      ],
      ["compass", "laws", "coherenceDiagnostic", "interactiveNarrative"]
    );
  }

  function makeSwitchTopicsNode() {
    return makeNode(
      "switchTopics",
      "switchTopics",
      "orientation",
      "fork",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Then switch chambers.",
        "Do not stay in a loop. Choose a new pressure: proof, self-reflection, characters, Frontier, Hearth, or the world side."
      ],
      [
        say("Proof.", "scientificLawPath"),
        say("Self-reflection.", "diagnosticPath"),
        say("Characters.", "charactersPath"),
        say("Character mirror.", "characterMirrorPath"),
        say("Frontier.", "frontierPath"),
        say("Hearth.", "hearthPath")
      ],
      []
    );
  }

  function makeSharpQuestionNode() {
    var topic = state.currentTopic;

    if (topic === "characterMirror") {
      return makeNode(
        "sharpQuestion",
        "characterMirror",
        "diagnostic",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_MIRROR,
        1,
        [
          "Then I’ll ask sharply.",
          "Are you trying to find the character you resemble under pressure, the pattern you overuse, or the room that can teach you next?"
        ],
        [
          say("Character resemblance.", "characterMirrorQuestionOne", { signal: "mirror" }),
          say("Pattern I overuse.", "diagnosticPath", { signal: "self" }),
          say("Room that teaches me next.", "cleanDoor", { signal: "route" }),
          say("Show all characters first.", "charactersPath")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (topic === "scientificLaw" || topic === "proof") {
      return makeNode(
        "sharpQuestion",
        "scientificLaw",
        "proof",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_OBJECTIVE,
        1,
        [
          "Then I’ll ask sharply.",
          "Are you testing theory, evidence, measurement, limits, or whether the claim is mature enough to trust?"
        ],
        [
          say("Theory.", "scientificLawTheoryPath"),
          say("Evidence.", "scientificLawEvidencePath"),
          say("Measure.", "scientificLawMeasurePath"),
          say("Limits.", "scientificLawLimitsPath"),
          say("Claim maturity.", "scientificLawLadderPath")
        ],
        ["scientificLaw"]
      );
    }

    if (topic === "frontier") {
      return makeNode(
        "sharpQuestion",
        "frontier",
        "frontier",
        "clarify",
        SCOPE_NARRATIVE,
        MODE_THRESHOLD,
        1,
        [
          "Then I’ll ask sharply.",
          "Are you trying to understand Frontier as a whole, one system inside it, its engineering lens, or why it matters to Audralia?"
        ],
        [
          say("Frontier as a whole.", "frontierPath"),
          say("One system.", "frontierSystemsPath"),
          say("Scientific Law connection.", "frontierLawPath"),
          say("Character connection.", "frontierCharactersPath")
        ],
        ["frontier"]
      );
    }

    if (topic === "hearth") {
      return makeNode(
        "sharpQuestion",
        "hearth",
        "hearth",
        "clarify",
        SCOPE_NARRATIVE,
        MODE_THRESHOLD,
        1,
        [
          "Then I’ll ask sharply.",
          "Are you trying to understand Hearth as a facility, as a planetary construct engine, as a bridge to Frontier, or as a bridge to Scientific Law?"
        ],
        [
          say("Facility.", "hearthFacilityPath"),
          say("Planetary construct engine.", "hearthConstructPath"),
          say("Bridge to Frontier.", "hearthFrontierPath"),
          say("Bridge to Scientific Law.", "hearthLawPath")
        ],
        ["hearth"]
      );
    }

    return makeNode(
      "sharpQuestion",
      "orientation",
      "orientation",
      "clarify",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask sharply.",
        "Are you trying to understand the estate as proof, as personal reflection, as future-building, as a living world, or as a character mirror?"
      ],
      [
        say("Proof.", "scientificLawPath"),
        say("Personal reflection.", "diagnosticPath"),
        say("Future-building.", "frontierPath"),
        say("Living world.", "worldPath"),
        say("Character mirror.", "characterMirrorPath")
      ],
      []
    );
  }

  function makeCleanDoorNode() {
    var topic = state.currentTopic;
    var handoffs = ["compass", "siteGuide"];
    var options = [
      say("I need orientation.", "compassPath"),
      say("I want proof.", "scientificLawPath"),
      say("I want the Diagnostic.", "diagnosticPath"),
      say("I want the character mirror.", "characterMirrorPath"),
      say("I want the world side.", "worldPath")
    ];

    if (topic === "hearth") handoffs = ["hearth", "frontier", "scientificLaw"];
    if (topic === "frontier") handoffs = ["frontier", "audralia", "hearth"];
    if (topic === "characters" || topic === "characterMirror") handoffs = ["characters", "coherenceDiagnostic"];
    if (topic === "scientificLaw") handoffs = ["scientificLaw", "laws", "gauges"];

    return makeNode(
      "cleanDoor",
      topic,
      "handoff",
      "route",
      state.currentScopeLane,
      state.currentVoiceMode,
      3,
      [
        "The cleanest next door depends on why you are still here.",
        "Right now, you seem to be " + state.visitor.lastItch + ".",
        "You can keep talking here, or you can cross into the chamber that matches that pressure."
      ],
      options,
      handoffs
    );
  }

  function makeWebsiteNode() {
    return makeNode(
      "websitePath",
      "diamondGateBridge",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Diamond Gate Bridge is the estate: public proof wing, human-development chambers, practical wing, world threshold, and future-facing rooms gathered into one navigable place.",
        "It matters because what we build today casts a shadow forward.",
        "The point is not to understand the whole estate at once. The point is to choose the first useful door."
      ],
      [
        say("I need the Compass.", "compassPath"),
        say("I want proof.", "scientificLawPath"),
        say("I want the Diagnostic.", "diagnosticPath"),
        say("I want the character mirror.", "characterMirrorPath"),
        say("I want the world side.", "worldPath"),
        control("Which door fits this best?", "cleanDoor")
      ],
      ["compass", "siteGuide", "laws", "coherenceDiagnostic"]
    );
  }

  function makeCompassNode() {
    return makeNode(
      "compassPath",
      "compass",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Compass is the first orientation room.",
        "It helps the visitor choose between proof, self-reflection, practical use, the human designer behind the estate, the character mirror, and the world side."
      ],
      [
        say("Proof first.", "scientificLawPath"),
        say("Self-reflection.", "diagnosticPath"),
        say("Character mirror.", "characterMirrorPath"),
        say("Practical wing.", "productsPath"),
        say("World side.", "worldPath"),
        back("Clean fork.", "returnFork")
      ],
      ["compass", "siteGuide"]
    );
  }

  function makeSiteGuideNode() {
    return makeNode(
      "siteGuidePath",
      "siteGuide",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Site Guide is the public map of the estate.",
        "It separates public rooms from deeper world doors so a visitor can see what proves, what guides, what reflects, what can be used, and what begins crossing into Mirrorland."
      ],
      [
        say("Show me the public side.", "websitePath"),
        say("Show me proof.", "scientificLawPath"),
        say("Show me the Diagnostic.", "diagnosticPath"),
        say("Show me the world side.", "worldPath"),
        say("Show me the character mirror.", "characterMirrorPath")
      ],
      ["siteGuide", "showroom"]
    );
  }

  function makeProofNode() {
    return makeNode(
      "proofPath",
      "proof",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The proof wing is where the estate stops asking for trust and starts making its structure testable.",
        "Doubt should not be bypassed. It should be given something to examine.",
        "Scientific Law is the sharpest proof chamber because it asks whether a claim can be defined, tested, corrected, limited, and checked again."
      ],
      [
        say("Explain Scientific Law.", "scientificLawPath"),
        say("Explain Theory.", "scientificLawTheoryPath"),
        say("Explain Evidence.", "scientificLawEvidencePath"),
        say("Explain Measure.", "scientificLawMeasurePath"),
        say("Explain Limits.", "scientificLawLimitsPath"),
        say("Explain Gauges.", "gaugesPath")
      ],
      ["scientificLaw", "laws", "gauges", "coherenceDiagnostic"]
    );
  }

  function makeGaugesNode() {
    return makeNode(
      "gaugesPath",
      "gauges",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Gauges are the estate’s status instruments.",
        "They help the visitor distinguish ambition from visible status: what is held, what is working, what is still forming, and what should not be overclaimed."
      ],
      [
        say("Explain Scientific Law.", "scientificLawPath"),
        say("Explain the Laws.", "lawsPath"),
        say("Explain the Diagnostic.", "diagnosticPath"),
        say("Take me toward the world side.", "worldPath")
      ],
      ["gauges", "laws", "scientificLaw"]
    );
  }

  function makeScientificLawNode(id) {
    var target = id || "scientificLawPath";
    var beats = [
      SCIENTIFIC_LAW.summary,
      SCIENTIFIC_LAW.core,
      "The four main doors are Theory, Evidence, Measure, and Limits."
    ];

    if (target === "scientificLawTheoryPath") {
      beats = [
        SCIENTIFIC_LAW.doors.theory,
        "It organizes observations into a possible explanation, creates expectations, exposes assumptions, and must be able to lose.",
        "Audit question: what would force this theory to be revised, narrowed, or rejected?"
      ];
    } else if (target === "scientificLawEvidencePath") {
      beats = [
        SCIENTIFIC_LAW.doors.evidence,
        "Evidence must be inspectable, traceable, relevant, and separate from interpretation.",
        "Audit question: can this evidence be matched to the exact claim it is being used to support?"
      ];
    } else if (target === "scientificLawMeasurePath") {
      beats = [
        SCIENTIFIC_LAW.doors.measure,
        "Measurement needs object, variable, unit, method, instrument or observer, calibration, and uncertainty.",
        "Without measurement, people often argue from different maps."
      ];
    } else if (target === "scientificLawLimitsPath") {
      beats = [
        SCIENTIFIC_LAW.doors.limits,
        "Limits are not weakness. They protect truth from overclaiming.",
        "A strong claim says what it can say, what it cannot say, where it applies, and what would change the conclusion."
      ];
    } else if (target === "scientificLawRoutePath") {
      beats = [
        "The Scientific Route keeps a claim from jumping straight from impression to authority.",
        "Observe → Define → Measure → Compare → Revise → Limit.",
        "That route is how confidence learns to answer to reality."
      ];
    } else if (target === "scientificLawLadderPath") {
      beats = [
        "The claim testing ladder shows maturity.",
        SCIENTIFIC_LAW.ladder,
        "The final step is not certainty. It is a bounded, testable, correctable claim."
      ];
    } else if (target === "scientificLawTermsPath") {
      beats = [
        "The deeper terms are repeatability, falsifiability, calibration, uncertainty, causality, and model scope.",
        "They protect the estate from technical-sounding language that cannot survive reality.",
        "Use them when a claim sounds impressive but has not carried its boundary."
      ];
    }

    return makeNode(
      target,
      "scientificLaw",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      target === "scientificLawPath" ? 1 : 2,
      beats,
      [
        say("Theory.", "scientificLawTheoryPath"),
        say("Evidence.", "scientificLawEvidencePath"),
        say("Measure.", "scientificLawMeasurePath"),
        say("Limits.", "scientificLawLimitsPath"),
        say("Claim testing ladder.", "scientificLawLadderPath"),
        say("Connect this to Frontier.", "frontierLawPath")
      ],
      ["scientificLaw", "laws", "gauges"]
    );
  }

  function makeDiagnosticNode() {
    return makeNode(
      "diagnosticPath",
      "diagnostic",
      "diagnostic",
      "personalize",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Diagnostic is the estate’s public mirror chamber.",
        "It helps a visitor notice the difference between what they claim, what they choose, and what pressure reveals.",
        "In the current version, it is local-only. It does not store, email, archive, or save the result."
      ],
      [
        say("Which character am I most like?", "characterMirrorPath", { signal: "mirror" }),
        say("Help me learn about myself.", "selfLearningPath", { signal: "mirror" }),
        say("Show the characters first.", "charactersPath"),
        say("Explain Scientific Law.", "scientificLawPath"),
        say("Tell me about Mirror Me.", "mirrorMePath")
      ],
      ["coherenceDiagnostic", "characters"]
    );
  }

  function makeSeanNode() {
    return makeNode(
      "seanPath",
      "sean",
      "sean",
      "reflect",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Meet Sean is the estate chamber where the visitor meets Sean Mansfield, the designer and developer of Diamond Gate Bridge.",
        "Sean is building the bridge, the rooms, the logic, the public doorway, and the future-facing world path.",
        "This matters because the estate is not detached from human pressure. It is being built through it."
      ],
      [
        say("Tell me about This Underdog.", "underdogPath"),
        say("Tell me about the book path.", "bookPath"),
        say("Tell me about the Diagnostic.", "diagnosticPath"),
        say("Tell me about the character mirror.", "characterMirrorPath")
      ],
      ["meetSean", "aboutUnderdog", "book"]
    );
  }

  function makeUnderdogNode() {
    return makeNode(
      "underdogPath",
      "underdog",
      "sean",
      "deepen",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "This Underdog is not Sean alone.",
        "This Underdog is in the visitor too. It is the part of a person that has carried pressure before it found language, direction, or use.",
        "The point is not to admire pressure. The point is to learn what pressure has been trying to teach."
      ],
      [
        say("Help me learn about myself.", "selfLearningPath", { signal: "mirror" }),
        say("Which character am I most like?", "characterMirrorPath", { signal: "mirror" }),
        say("Tell me about the Diagnostic.", "diagnosticPath"),
        say("Tell me about Sean.", "seanPath"),
        say("Tell me about the book path.", "bookPath")
      ],
      ["aboutUnderdog", "coherenceDiagnostic", "book"]
    );
  }

  function makeProductsNode() {
    return makeNode(
      "productsPath",
      "products",
      "products",
      "route",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Products are the practical wing of the estate.",
        "They are where a message becomes usable: something a visitor can carry, read, wear, give, return to, or use as a reminder."
      ],
      [
        say("Tell me about the book path.", "bookPath"),
        say("Tell me about This Underdog.", "underdogPath"),
        say("Tell me about the Diagnostic.", "diagnosticPath"),
        say("Take me to the world side.", "worldPath")
      ],
      ["products", "book", "coherenceDiagnostic"]
    );
  }

  function makeBookNode() {
    return makeNode(
      "bookPath",
      "book",
      "book",
      "deepen",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Nine Summits of Love is the book path inside the estate.",
        "It turns pressure, voice, coherence, love, and becoming into a human-development journey.",
        "A room can orient. A diagnostic can reflect. A book can walk with the reader."
      ],
      [
        say("Tell me about Nine Summits.", "nineSummitsPath"),
        say("Tell me about This Underdog.", "underdogPath"),
        say("Tell me about Sean.", "seanPath"),
        say("Help me learn about myself.", "selfLearningPath")
      ],
      ["book", "nineSummits", "meetSean"]
    );
  }

  function makeWorldNode() {
    return makeNode(
      "worldPath",
      "mirrorland",
      "world",
      "fork",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      1,
      [
        "The world side begins where the estate stops only explaining and starts letting the visitor cross.",
        "Mirrorland reveals possible futures before they become final.",
        "Audralia carries. Frontier tests. Hearth constructs. Scientific Law verifies. Characters carry the pressure."
      ],
      [
        say("Tell me about Hearth.", "hearthPath"),
        say("Tell me about Audralia.", "audraliaPath"),
        say("Tell me about Frontier.", "frontierPath"),
        say("Who are the characters?", "charactersPath"),
        say("What is Mirror Me?", "mirrorMePath")
      ],
      ["interactiveNarrative", "hearth", "audralia", "frontier", "characters"]
    );
  }

  function makeHearthNode(id) {
    var beats = [
      "Hearth is the planetary construct facility where world-formation logic becomes operational.",
      "It is not merely a globe route.",
      "Hearth is the unknown-location facility tied to Mirrorland’s planetary construction logic.",
      "Mirrorland reveals. Audralia carries. Frontier tests. Hearth constructs. Scientific Law verifies. Characters carry the pressure."
    ];

    if (id === "hearthFacilityPath") {
      beats = [
        "Hearth is the unknown-location facility.",
        "That matters because it prevents Hearth from being reduced to a simple public globe.",
        "It is the chamber where planetary construction logic is organized before the visitor fully understands where that chamber is."
      ];
    } else if (id === "hearthConstructPath") {
      beats = [
        "Hearth is the planetary construct engine in the estate’s public canon.",
        "It is where world-formation logic becomes operational: structure, terrain, hydrology, surface behavior, motion, and the conditions that let a planet read as a constructed world.",
        "Hearth constructs. That is its governing verb."
      ];
    } else if (id === "hearthFrontierPath") {
      beats = [
        "Hearth and Frontier are paired, but not identical.",
        "Frontier tests systems: energy, water, waste, infrastructure, signal, direction, and civic pressure.",
        "Hearth constructs the planetary condition those systems must eventually live inside."
      ];
    } else if (id === "hearthLawPath") {
      beats = [
        "Hearth still answers to Scientific Law.",
        "A planetary construct can be imaginative, but the claims around it need theory, evidence, measurement, and limits.",
        "That is how Hearth stays disciplined instead of becoming only a visual idea."
      ];
    }

    return makeNode(
      id || "hearthPath",
      "hearth",
      "hearth",
      "reveal",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      2,
      beats,
      [
        say("Hearth as facility.", "hearthFacilityPath"),
        say("Hearth as construct engine.", "hearthConstructPath"),
        say("Connect Hearth to Frontier.", "hearthFrontierPath"),
        say("Connect Hearth to Scientific Law.", "hearthLawPath"),
        say("Tell me about Audralia.", "audraliaPath"),
        say("Tell me about the characters.", "charactersPath")
      ],
      ["hearth", "frontier", "scientificLaw"]
    );
  }

  function makeAudraliaNode() {
    return makeNode(
      "audraliaPath",
      "audralia",
      "audralia",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      [
        "Audralia is the constructive future world.",
        "It gives the estate distance, terrain, scale, and the feeling that the future is not only a room.",
        "Hearth is where construction logic becomes operational. Frontier tests the systems Audralia may need."
      ],
      [
        say("Tell me about Frontier.", "frontierPath"),
        say("Tell me about Hearth.", "hearthPath"),
        say("Tell me about the characters.", "charactersPath"),
        say("Connect Audralia to Scientific Law.", "scientificLawPath")
      ],
      ["audralia", "frontier", "hearth"]
    );
  }

  function makeFrontierNode(id, systemKey) {
    var system = systemKey ? FRONTIER_SYSTEMS[systemKey] : null;
    var beats;

    if (id === "frontierLawPath") {
      beats = [
        "Scientific Law keeps Frontier from becoming fantasy language.",
        "Frontier can imagine future systems, but Scientific Law asks whether each claim is defined, evidenced, measured, compared, revised, and limited.",
        "That is why Energy cannot pretend fusion is solved, Waste cannot hide downstream cost, and Closed Loop cannot claim closure without audit return."
      ];
    } else if (id === "frontierCharactersPath") {
      beats = [
        "The Frontier systems become human through the characters.",
        "Tarian belongs naturally to Water. Soren belongs to Waste and Boundary. Alaric belongs to Trajectory. Elara belongs to Shimmer and Vision. Dextrion belongs to Energy and repair readiness.",
        "Frontier tests systems. Characters carry the cost of living inside them."
      ];
    } else if (system) {
      beats = [
        system.name + " — " + system.status + ".",
        system.text,
        "This is a Frontier pressure test, not a claim that the future system is finished."
      ];
    } else {
      beats = [
        "Mirrorland reveals. Audralia carries. Frontier tests.",
        "Frontier is Audralia’s applied-science playground.",
        "It tests power, water, waste, feedback, support, growth, city pressure, operating rules, signal, direction, and horizon aim."
      ];
    }

    return makeNode(
      id || "frontierPath",
      "frontier",
      "frontier",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      system ? 2 : 1,
      beats,
      [
        say("Show Frontier systems.", "frontierSystemsPath"),
        say("Energy.", "frontierEnergyPath"),
        say("Water.", "frontierWaterPath"),
        say("Waste.", "frontierWastePath"),
        say("Connect Frontier to Scientific Law.", "frontierLawPath"),
        say("Connect Frontier to Hearth.", "hearthFrontierPath"),
        say("Connect Frontier to characters.", "frontierCharactersPath")
      ],
      system ? [system.route, "frontier"] : ["frontier", "audralia", "hearth"]
    );
  }

  function targetToFrontierKey(target) {
    var map = {
      frontierEnergyPath: "energy",
      frontierWaterPath: "water",
      frontierWastePath: "waste",
      frontierClosedLoopPath: "closedLoop",
      frontierInfrastructurePath: "infrastructure",
      frontierLatticePath: "lattice",
      frontierUrbanPath: "urban",
      frontierManualPath: "manual",
      frontierShimmerPath: "shimmer",
      frontierTrajectoryPath: "trajectory",
      frontierVisionPath: "vision"
    };

    return map[target] || "";
  }

  function makeCharactersNode(id) {
    if (id === "characterRelationshipsPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Character relationships are pressure lines.",
          "Auren and Jeeves connect through protection and entry. Alaric and Tarian connect through route and endurance. Elara and Soren connect through possibility and hidden cost. Dextrion and Soren connect through repair and proof.",
          "These are pressure relationships, not invented biography."
        ],
        [
          say("Auren Vale.", "characterAurenValePath"),
          say("Dextrion.", "characterDextrionPath"),
          say("Alaric.", "characterAlaricPath"),
          say("Tarian.", "characterTarianPath"),
          say("Elara.", "characterElaraPath"),
          say("Soren.", "characterSorenPath"),
          say("Which character am I most like?", "characterMirrorPath")
        ],
        ["characters"]
      );
    }

    if (id === "characterTensionsPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "The conflict is not only good against evil.",
          "It is memory against denial, survival against consequence, voice against silence, and choice against pressure.",
          "The characters matter because they turn future systems into lived cost."
        ],
        [
          say("Show relationships.", "characterRelationshipsPath"),
          say("Show motives.", "characterMotivesPath"),
          say("Which character am I most like?", "characterMirrorPath"),
          say("Who should I meet first?", "characterFirstPath")
        ],
        ["characters"]
      );
    }

    if (id === "characterFirstPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "route",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Start with the character who matches the pressure you want to understand.",
          "Protection begins with Auren. Repair begins with Dextrion. Early warning begins with Alaric. Endurance begins with Tarian. Signal begins with Elara. Hidden cost begins with Soren. Truth sequence begins with Jeeves. Distributed survival begins with the Remote Team."
        ],
        [
          say("Auren Vale.", "characterAurenValePath"),
          say("Dextrion.", "characterDextrionPath"),
          say("Alaric.", "characterAlaricPath"),
          say("Tarian.", "characterTarianPath"),
          say("Elara.", "characterElaraPath"),
          say("Soren.", "characterSorenPath"),
          say("Jeeves.", "characterJeevesPath"),
          say("Remote Team.", "characterRemoteTeamPath")
        ],
        ["characters"]
      );
    }

    return makeNode(
      "charactersPath",
      "characters",
      "characters",
      "personalize",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      1,
      [
        "The Characters are where the world stops feeling empty.",
        "Auren protects. Dextrion repairs. Alaric reads danger. Tarian keeps survival physical. Elara makes the future visible. Soren refuses fake restoration. Jeeves sequences truth. The Remote Team distributes survival.",
        "They are not labels. They are pressure carriers."
      ],
      [
        say("Auren Vale.", "characterAurenValePath"),
        say("Dextrion.", "characterDextrionPath"),
        say("Alaric.", "characterAlaricPath"),
        say("Tarian.", "characterTarianPath"),
        say("Elara.", "characterElaraPath"),
        say("Soren.", "characterSorenPath"),
        say("Jeeves.", "characterJeevesPath"),
        say("Remote Team.", "characterRemoteTeamPath"),
        say("Which character am I most like?", "characterMirrorPath")
      ],
      ["characters"]
    );
  }

  function targetToCharacter(target) {
    var map = {
      characterAurenValePath: "aurenVale",
      characterDextrionPath: "dextrion",
      characterAlaricPath: "alaric",
      characterTarianPath: "tarian",
      characterElaraPath: "elara",
      characterSorenPath: "soren",
      characterJeevesPath: "jeeves",
      characterRemoteTeamPath: "remoteTeam"
    };

    return map[target] || "";
  }

  function makeCharacterNode(characterId) {
    var character = CHARACTER_REGISTRY[characterId];

    if (!character) return makeCharactersNode("charactersPath");

    return makeNode(
      character.target,
      "characters",
      "characters",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      [
        character.name + " is the " + character.title + ".",
        character.oneLine,
        character.pressure,
        "Reflective pattern: " + character.mirror
      ],
      [
        say("Show character relationships.", "characterRelationshipsPath"),
        say("Show character conflict.", "characterTensionsPath"),
        say("Which character am I most like?", "characterMirrorPath"),
        say("Show all characters.", "charactersPath"),
        say("Choose the next door.", "cleanDoor")
      ],
      ["characters"]
    );
  }

  function makeCharacterMirrorNode(id) {
    if (id === "characterMirrorQuestionOne" || id === "selfLearningPath" || id === "characterMirrorPath") {
      return makeNode(
        "characterMirrorQuestionOne",
        "characterMirror",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_MIRROR,
        1,
        [
          "We can use the Character Mirror.",
          "This will not define you. It will compare your current pressure pattern to the characters.",
          "First question: under pressure, what do you usually notice first?"
        ],
        [
          say("Who needs protection?", "characterMirrorQuestionTwo", { signal: "mirror" }),
          say("What is broken and needs repair?", "characterMirrorQuestionTwo", { signal: "mirror" }),
          say("Where danger is forming early.", "characterMirrorQuestionTwo", { signal: "mirror" }),
          say("What the body or situation can actually endure.", "characterMirrorQuestionTwo", { signal: "mirror" }),
          say("What truth or hidden cost is being avoided.", "characterMirrorQuestionTwo", { signal: "mirror" }),
          say("What signal of hope needs to become visible.", "characterMirrorQuestionTwo", { signal: "mirror" })
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (id === "characterMirrorQuestionTwo") {
      return makeNode(
        "characterMirrorQuestionTwo",
        "characterMirror",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_MIRROR,
        2,
        [
          "Second question.",
          "When the pressure increases, what do you tend to rely on next?"
        ],
        [
          say("A clear sequence and controlled timing.", "characterMirrorQuestionThree", { signal: "mirror" }),
          say("Visible action or repair.", "characterMirrorQuestionThree", { signal: "mirror" }),
          say("Stability, continuity, and keeping people from breaking.", "characterMirrorQuestionThree", { signal: "mirror" }),
          say("Evidence, contradiction, and proof.", "characterMirrorQuestionThree", { signal: "mirror" }),
          say("A public signal that gives people hope.", "characterMirrorQuestionThree", { signal: "mirror" }),
          say("A team or field response beyond one safe center.", "characterMirrorQuestionThree", { signal: "mirror" })
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (id === "characterMirrorQuestionThree") {
      return makeNode(
        "characterMirrorQuestionThree",
        "characterMirror",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_MIRROR,
        3,
        [
          "Third question.",
          "What usually becomes your risk when you are under too much pressure?"
        ],
        [
          say("I overprotect or hide too much.", "characterMirrorResult", { signal: "mirror" }),
          say("I try to fix everything too fast.", "characterMirrorResult", { signal: "mirror" }),
          say("I see danger before people believe me.", "characterMirrorResult", { signal: "mirror" }),
          say("I keep carrying more than my body can sustain.", "characterMirrorResult", { signal: "mirror" }),
          say("I need the truth named before I can move.", "characterMirrorResult", { signal: "mirror" }),
          say("I manage how much truth people can receive.", "characterMirrorResult", { signal: "mirror" })
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    return makeCharacterMirrorResultNode();
  }

  function makeCharacterMirrorResultNode() {
    var mirror = computeLocalCharacterMirror();
    var top = mirror[0];
    var second = mirror[1];
    var third = mirror[2];
    var topCharacter;

    if (!top) {
      return makeNode(
        "characterMirrorResult",
        "characterMirror",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_MIRROR,
        3,
        [
          "I do not have enough pressure signal to name a clean match yet.",
          "That is not a failure. It means the mirror needs clearer answers.",
          "Take the Coherence Diagnostic if you want a stronger read."
        ],
        [
          say("Ask the first mirror question again.", "characterMirrorQuestionOne", { signal: "mirror" }),
          say("Take the Coherence Diagnostic.", "diagnosticPath"),
          say("Show the characters first.", "charactersPath"),
          control("Re-center me.", "recenterNode")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    topCharacter = CHARACTER_REGISTRY[top.id];

    return makeNode(
      "characterMirrorResult",
      "characterMirror",
      "diagnostic",
      "close",
      SCOPE_OBJECTIVE,
      MODE_CHARACTER_MIRROR,
      3,
      [
        "Reflective match, not identity: your answers currently resemble " + topCharacter.name + "’s pressure pattern most strongly.",
        topCharacter.name + " carries this pressure: " + topCharacter.pressure,
        second ? "Your secondary pressure reads closest to " + CHARACTER_REGISTRY[second.id].name + ": " + CHARACTER_REGISTRY[second.id].mirror : "The secondary pressure is not strong enough to name cleanly yet.",
        third ? "Your tension match is " + CHARACTER_REGISTRY[third.id].name + ": the pattern that may appear when pressure rises." : "This is enough to begin, but not enough to make a final label."
      ],
      [
        say("Show why this match appeared.", topCharacter.target),
        second ? say("Show the secondary pressure.", CHARACTER_REGISTRY[second.id].target) : say("Ask another mirror question.", "characterMirrorQuestionOne", { signal: "mirror" }),
        say("Take the full Diagnostic.", "diagnosticPath"),
        say("Show all characters.", "charactersPath"),
        control("Choose the next door.", "cleanDoor")
      ],
      ["characters", "coherenceDiagnostic"]
    );
  }

  function computeLocalCharacterMirror() {
    var scores = {};
    var answers = state.visitor.characterMirrorAnswers.join(" ").toLowerCase();

    Object.keys(CHARACTER_REGISTRY).forEach(function initScore(id) {
      scores[id] = 0;
    });

    LOCAL_MIRROR_KEYWORDS.forEach(function eachEntry(entry) {
      entry.words.forEach(function eachWord(word) {
        if (answers.indexOf(word.toLowerCase()) !== -1) {
          scores[entry.id] += 2;
        }
      });
    });

    if (answers.indexOf("protection") !== -1 || answers.indexOf("protect") !== -1) scores.aurenVale += 3;
    if (answers.indexOf("repair") !== -1 || answers.indexOf("fix") !== -1) scores.dextrion += 3;
    if (answers.indexOf("danger") !== -1 || answers.indexOf("early") !== -1) scores.alaric += 3;
    if (answers.indexOf("endure") !== -1 || answers.indexOf("body") !== -1) scores.tarian += 3;
    if (answers.indexOf("hope") !== -1 || answers.indexOf("visible") !== -1) scores.elara += 3;
    if (answers.indexOf("truth") !== -1 || answers.indexOf("hidden cost") !== -1) scores.soren += 3;
    if (answers.indexOf("sequence") !== -1 || answers.indexOf("timing") !== -1) scores.jeeves += 3;
    if (answers.indexOf("team") !== -1 || answers.indexOf("field") !== -1) scores.remoteTeam += 3;

    return Object.keys(scores)
      .map(function toRow(id) {
        return {
          id: id,
          score: scores[id]
        };
      })
      .filter(function hasScore(row) {
        return row.score > 0;
      })
      .sort(function sortScore(a, b) {
        return b.score - a.score || CHARACTER_REGISTRY[a.id].name.localeCompare(CHARACTER_REGISTRY[b.id].name);
      })
      .slice(0, 3);
  }

  function targetToCharacterFromText(text) {
    var normalized = String(text || "").toLowerCase();
    var id;

    for (id in CHARACTER_REGISTRY) {
      if (Object.prototype.hasOwnProperty.call(CHARACTER_REGISTRY, id)) {
        if (normalized.indexOf(CHARACTER_REGISTRY[id].name.toLowerCase()) !== -1) return id;
        if (normalized.indexOf(CHARACTER_REGISTRY[id].shortName.toLowerCase()) !== -1) return id;
      }
    }

    return "";
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();
    var characterId = targetToCharacterFromText(value);

    if (
      value.indexOf("which character am i") !== -1 ||
      value.indexOf("what character am i") !== -1 ||
      value.indexOf("most like") !== -1 ||
      value.indexOf("learn about myself") !== -1 ||
      value.indexOf("self learning") !== -1
    ) {
      return { target: "characterMirrorPath", signal: "mirror" };
    }

    if (characterId) {
      return { target: CHARACTER_REGISTRY[characterId].target, signal: "characters" };
    }

    if (
      value.indexOf("lost") !== -1 ||
      value.indexOf("confused") !== -1 ||
      value.indexOf("recenter") !== -1 ||
      value.indexOf("center") !== -1
    ) {
      return { target: "recenterNode", signal: "lost" };
    }

    if (
      value.indexOf("scientific law") !== -1 ||
      value.indexOf("theory") !== -1 ||
      value.indexOf("evidence") !== -1 ||
      value.indexOf("measure") !== -1 ||
      value.indexOf("limits") !== -1 ||
      value.indexOf("claim") !== -1 ||
      value.indexOf("proof") !== -1
    ) {
      return { target: "scientificLawPath", signal: "skeptic" };
    }

    if (
      value.indexOf("frontier") !== -1 ||
      value.indexOf("energy") !== -1 ||
      value.indexOf("fusion") !== -1 ||
      value.indexOf("water") !== -1 ||
      value.indexOf("waste") !== -1 ||
      value.indexOf("closed loop") !== -1 ||
      value.indexOf("infrastructure") !== -1 ||
      value.indexOf("lattice") !== -1 ||
      value.indexOf("urban") !== -1 ||
      value.indexOf("shimmer") !== -1 ||
      value.indexOf("trajectory") !== -1 ||
      value.indexOf("vision") !== -1
    ) {
      return { target: "frontierPath", signal: "world" };
    }

    if (
      value.indexOf("hearth") !== -1 ||
      value.indexOf("planetary construct") !== -1 ||
      value.indexOf("construct facility") !== -1 ||
      value.indexOf("construct engine") !== -1
    ) {
      return { target: "hearthPath", signal: "world" };
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
      value.indexOf("designer") !== -1 ||
      value.indexOf("developer") !== -1
    ) {
      return { target: "seanPath", signal: "human" };
    }

    if (
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("audralia") !== -1 ||
      value.indexOf("world") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("showroom") !== -1 ||
      value.indexOf("future") !== -1
    ) {
      return { target: "worldPath", signal: "world" };
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
      value.indexOf("practical") !== -1 ||
      value.indexOf("economic") !== -1 ||
      value.indexOf("impact") !== -1
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

  function isBackendEligible(target, settings) {
    if (!state.brain.enabled) return false;
    if (settings && settings.noBrain) return false;
    if (target === "intro" || target === "askFirst" || target === "returnFork" || target === "restartFork") return false;
    return true;
  }

  function buildBrainPayload(target, choice) {
    return {
      visitorText: choice && choice.label ? choice.label : "",
      currentNode: target,
      currentEntry: state.currentTopic,
      currentPath: state.currentTopic,
      currentScopeLane: state.currentScopeLane,
      currentVoiceMode: state.currentVoiceMode,
      visitorPosture: state.currentPosture,
      movement: choice && choice.signal ? choice.signal : "",
      pathDepth: state.currentDepth,
      topicDepth: state.topicDepth[state.currentTopic] || 0,
      loopCount: state.visitor.loopCount,
      routeReadiness: state.visitor.routeReadiness,
      allowedTargets: APPROVED_TARGETS.slice(),
      allowedRoutes: APPROVED_ROUTE_IDS.slice(),
      sessionTrail: state.visitor.trail.map(function trailToString(item) {
        return item.topic + ":" + item.node + ":" + item.label;
      }),
      requestedMode: state.currentVoiceMode,
      characterMirrorAnswers: state.visitor.characterMirrorAnswers.slice(),
      registryContext: {
        id: state.currentTopic,
        summary: state.visitor.lastItch,
        routes: state.currentRouteHandoffs,
        targets: []
      }
    };
  }

  async function requestJeevesBrain(target, choice) {
    var controller;
    var timeout;
    var payload;

    if (!state.brain.endpoint) return null;

    payload = buildBrainPayload(target, choice);
    state.brain.lastRequest = safeClone(payload);
    state.brain.lastStatus = "pending";

    controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    if (controller) {
      timeout = window.setTimeout(function abortBrain() {
        try {
          controller.abort();
        } catch (_error) {}
      }, state.brain.timeoutMs);
    }

    try {
      var response = await fetch(state.brain.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      });

      if (timeout) window.clearTimeout(timeout);

      if (!response.ok) {
        state.brain.lastStatus = "http_" + response.status;
        return null;
      }

      var data = await response.json();

      state.brain.lastResponse = safeClone(data);
      state.brain.lastStatus = data && data.ok ? "ok" : "fallback";

      return normalizeBrainResponse(data);
    } catch (_error) {
      if (timeout) window.clearTimeout(timeout);
      state.brain.lastStatus = "unavailable";
      return null;
    }
  }

  function normalizeBrainResponse(data) {
    var options;
    var handoffs;

    if (!data || !Array.isArray(data.bubbles) || !data.bubbles.length) {
      return null;
    }

    options = Array.isArray(data.options) ? data.options : [];
    handoffs = Array.isArray(data.handoffs) ? data.handoffs : [];

    state.visitor.lastBrainIntent = data.intent || "";
    state.visitor.lastBrainCanonStatus = data.canonStatus || "";
    state.visitor.lastBrainConclusiveState = data.conclusiveState || "";

    return {
      node: state.currentNode,
      topic: data.nextTopic || state.currentTopic,
      posture: state.currentPosture,
      phase: data.conclusiveState === "complete" ? "close" : state.currentPhase,
      scopeLane: data.suggestedMode === "immersion" || data.suggestedMode === "threshold" ? SCOPE_NARRATIVE : state.currentScopeLane,
      voiceMode: data.suggestedMode || state.currentVoiceMode,
      depth: state.currentDepth,
      beats: data.bubbles.slice(0, 4),
      options: options.map(function normalizeOption(item) {
        return {
          label: item.label,
          target: normalizeTarget(item.target),
          type: item.type || "conversation",
          scopeLane: item.scopeLane || null,
          signal: data.intent || ""
        };
      }),
      handoffs: handoffs.map(normalizeRouteId).filter(Boolean),
      source: data.source || "brain"
    };
  }

  function shouldAskBrainBeforeLocal(target) {
    return [
      "characterMirrorPath",
      "selfLearningPath",
      "characterMirrorResult",
      "scientificLawPath",
      "scientificLawTheoryPath",
      "scientificLawEvidencePath",
      "scientificLawMeasurePath",
      "scientificLawLimitsPath",
      "frontierPath",
      "frontierSystemsPath",
      "hearthPath",
      "hearthConstructPath",
      "hearthFacilityPath",
      "charactersPath"
    ].indexOf(target) !== -1;
  }

  async function runNode(nodeId, settings) {
    var token;
    var node;
    var localNode;
    var brainNode;
    var choice;
    var completed;

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    choice = settings && settings.choice ? settings.choice : null;
    nodeId = normalizeNode(nodeId);
    localNode = getNode(nodeId, choice);

    updateCurrentState(nodeId, localNode, choice);
    hideOptions();

    if (isBackendEligible(nodeId, settings) && shouldAskBrainBeforeLocal(nodeId)) {
      brainNode = await requestJeevesBrain(nodeId, choice);
      if (brainNode && brainNode.beats && brainNode.beats.length) {
        node = brainNode;
      } else {
        node = localNode;
      }
    } else {
      node = localNode;
    }

    if (node !== localNode) {
      state.currentTopic = node.topic || state.currentTopic;
      state.currentPhase = node.phase || state.currentPhase;
      state.currentScopeLane = node.scopeLane || state.currentScopeLane;
      state.currentVoiceMode = node.voiceMode || state.currentVoiceMode;
      state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);
      setDocumentState();
    }

    await waitFixed(settings && settings.fast ? PACING.firstMessageDelayMs : 420);

    if (token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    completed = await playBeats(node.beats || [], token, node.source || "local");

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
      brainEndpoint: JEEVES_BRAIN_ENDPOINT,
      state: state,
      characters: CHARACTER_REGISTRY,
      frontierSystems: FRONTIER_SYSTEMS,
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      requestJeevesBrain: requestJeevesBrain,
      tapAdvance: requestTapAdvance,
      getState: function getState() {
        return safeClone(state);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id, null));
      },
      getState256: getState256,
      getCharacterMirrorAnswers: function getCharacterMirrorAnswers() {
        return state.visitor.characterMirrorAnswers.slice();
      },
      resetCharacterMirror: function resetCharacterMirror() {
        state.visitor.characterMirrorAnswers = [];
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

    if (config && config.brainEndpoint) {
      state.brain.endpoint = String(config.brainEndpoint);
    }

    clearSeedMessage();
    bindRestore();
    bindTapAdvance();
    exposeApi();

    state.initialized = true;

    initialNode = normalizeNode(config.initialNode || "intro");
    runNode(initialNode, { fast: true, noBrain: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
