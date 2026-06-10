// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_ROOM_AWARE_EXPRESSION_ENGINE_SPLIT_TNT_v19
// Full-file replacement.
// Preserves existing HTML/CSS contract.
// Owns: visible Jeeves runtime, DOM hooks, prompt rendering, message rendering,
// tap-to-advance, current-room state, First Fork origin construct, internavigable paths,
// return-to-prior-topic, return-to-origin-conversation, route handoffs, API guard,
// and final route authority.
// Consumes: /assets/hearth/jeeves/jeeves.expression.js
// Does not own: CSS, server-side model execution, API keys, persistent memory,
// server-side moderation, or final backbrain canon storage.
//

(function hearthJeevesFrontbrainRoomAwareExpressionEngineSplit(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_ROOM_AWARE_EXPRESSION_ENGINE_SPLIT_TNT_v19";
  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var DEFAULT_BRAIN_ENDPOINT = "/api/jeeves.js";
  var DEFAULT_EXPRESSION_CONTRACT = "HEARTH_JEEVES_EXPRESSION_ENGINE_NEWS_URBAN_RETURN_CONSTRUCT_TNT_v1";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";
  var MODE_CHARACTER_ARCHETYPE = "characterArchetype";

  var DEFAULT_CURRENT_ROOM_ID = "hearthProductionChamber";
  var DEFAULT_ORIGIN_NODE = "intro";
  var DEFAULT_ORIGIN_ANCHOR = "firstFork";

  var MAX_HISTORY = 96;
  var MAX_STACK = 28;

  var PACING = {
    firstMessageDelayMs: 720,
    typingBaseMs: 960,
    typingWordMs: 72,
    typingMinMs: 920,
    typingMaxMs: 3600,
    readBaseMs: 1120,
    readWordMs: 72,
    readMinMs: 1320,
    readMaxMs: 4200,
    optionRevealDelayMs: 520,
    tapMaxDistancePx: 14,
    tapMaxDurationMs: 360
  };

  var DEFAULT_ROUTES = {
    jeeves: ROUTE,
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
    zionts: "/showroom/globe/earth/",
    audralia: "/showroom/globe/audralia/",
    audraliaWorldroom: "/showroom/globe/audralia/planet/",
    controlCockpit: "/showroom/globe/audralia/disposition/",
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
    jeeves: "Return to Jeeves",
    compass: "Open North Fork",
    home: "Open Center Hall",
    siteGuide: "Open North Map Hall",
    coherenceDiagnostic: "Open West Mirror Desk",
    meetSean: "Open North Source Hall",
    products: "Open Northeast Market Hall",
    laws: "Open West Library",
    scientificLaw: "Open West Proof Chamber",
    gauges: "Open West Gauge Room",
    showroom: "Enter South Gate",
    hearth: "Open East Construct Chamber",
    globeWindow: "Open South Map Hall",
    interactiveNarrative: "Enter Mirrorland",
    mirrorland: "Open South Window",
    zionts: "Open Southwest Consequence Road",
    audralia: "Open Southeast Conservatory",
    audraliaWorldroom: "Open East-South Worldroom",
    controlCockpit: "Open East Control Deck",
    frontier: "Open East Yard",
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
    characters: "Open South Character Lane",
    controlRoom: "Open Control Room",
    book: "Open The Nine Summits of Love",
    nineSummits: "Open Summit Road",
    aboutUnderdog: "Open North Inner Lane"
  };

  var TARGET_ALIASES = {
    worldPath: "mirrorlandPath",
    worldGatePath: "atriumPath",
    characterMirrorPath: "characterArchetypeMirrorPath",
    characterMirrorQuestionOne: "characterArchetypeQuestionOne",
    characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
    characterMirrorQuestionThree: "characterArchetypeQuestionThree",
    characterMirrorResult: "characterArchetypeResult",
    characterFactionsPath: "characterRelationshipsPath"
  };

  var ROUTE_ALIASES = {
    worldGate: "mirrorland",
    globeWindow: "mirrorland"
  };

  var APPROVED_TARGETS = [
    "intro",
    "askFirst",
    "websitePath",
    "skepticPlain",
    "proofPath",
    "diagnosticPath",
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
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
    "hearthProductionPath",
    "ziontsPath",
    "audraliaPath",
    "audraliaWorldroomPath",
    "controlCockpitPath",
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
    "characterArchetypeMirrorPath",
    "selfLearningPath",
    "characterArchetypeQuestionOne",
    "characterArchetypeQuestionTwo",
    "characterArchetypeQuestionThree",
    "characterArchetypeResult",
    "originReturn",
    "originReturnPath",
    "priorTopicReturn",
    "priorTopicReturnPath",
    "recenterNode",
    "loopRecovery",
    "cleanDoor",
    "switchTopics",
    "sharpQuestion",
    "returnFork",
    "restartFork"
  ];

  var LOCAL_FINAL_TARGETS = [
    "intro",
    "askFirst",
    "websitePath",
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "seanPath",
    "underdogPath",
    "bookPath",
    "nineSummitsPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "hearthProductionPath",
    "charactersPath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
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
    "characterArchetypeMirrorPath",
    "selfLearningPath",
    "characterArchetypeQuestionOne",
    "characterArchetypeQuestionTwo",
    "characterArchetypeQuestionThree",
    "characterArchetypeResult",
    "originReturn",
    "originReturnPath",
    "priorTopicReturn",
    "priorTopicReturnPath"
  ];

  var NARRATIVE_TARGETS = [
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "hearthProductionPath",
    "ziontsPath",
    "audraliaPath",
    "audraliaWorldroomPath",
    "controlCockpitPath",
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
    "mirrorMePath",
    "charactersPath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterStoryPressurePath",
    "characterFirstPath",
    "characterAurenValePath",
    "characterDextrionPath",
    "characterAlaricPath",
    "characterTarianPath",
    "characterElaraPath",
    "characterSorenPath",
    "characterJeevesPath",
    "characterRemoteTeamPath"
  ];

  var TARGET_TOPIC_MAP = {
    intro: "origin",
    askFirst: "origin",
    websitePath: "estate",
    compassPath: "orientation",
    whereToStart: "orientation",
    siteGuidePath: "orientation",
    skepticPlain: "proof",
    proofPath: "proof",
    lawsPath: "proof",
    scientificLawPath: "scientificLaw",
    scientificLawTheoryPath: "scientificLaw",
    scientificLawEvidencePath: "scientificLaw",
    scientificLawMeasurePath: "scientificLaw",
    scientificLawLimitsPath: "scientificLaw",
    scientificLawRoutePath: "scientificLaw",
    scientificLawLadderPath: "scientificLaw",
    scientificLawTermsPath: "scientificLaw",
    gaugesPath: "proof",
    diagnosticPath: "diagnostic",
    futureProfilePath: "diagnostic",
    seanPath: "sean",
    underdogPath: "underdog",
    productsPath: "products",
    bookPath: "nineSummits",
    nineSummitsPath: "nineSummits",
    mirrorlandPath: "mirrorland",
    atriumPath: "mirrorland",
    atlasPath: "mirrorland",
    mirrorMePath: "mirrorland",
    hearthPath: "hearth",
    hearthFacilityPath: "hearth",
    hearthConstructPath: "hearth",
    hearthFrontierPath: "hearth",
    hearthLawPath: "hearth",
    hearthProductionPath: "hearthProduction",
    ziontsPath: "mirrorland",
    audraliaPath: "audralia",
    audraliaWorldroomPath: "audralia",
    controlCockpitPath: "audralia",
    frontierPath: "frontier",
    frontierSystemsPath: "frontier",
    frontierEnergyPath: "frontier",
    frontierWaterPath: "frontier",
    frontierWastePath: "frontier",
    frontierClosedLoopPath: "frontier",
    frontierInfrastructurePath: "frontier",
    frontierLatticePath: "frontier",
    frontierUrbanPath: "frontier",
    frontierManualPath: "frontier",
    frontierShimmerPath: "frontier",
    frontierTrajectoryPath: "frontier",
    frontierVisionPath: "frontier",
    frontierLawPath: "frontier",
    frontierCharactersPath: "frontier",
    charactersPath: "characters",
    characterIdentityPath: "characters",
    characterRelationshipsPath: "characters",
    characterTensionsPath: "characters",
    characterMotivesPath: "characters",
    characterStoryPressurePath: "characters",
    characterFirstPath: "characters",
    characterAurenValePath: "characters",
    characterDextrionPath: "characters",
    characterAlaricPath: "characters",
    characterTarianPath: "characters",
    characterElaraPath: "characters",
    characterSorenPath: "characters",
    characterJeevesPath: "characters",
    characterRemoteTeamPath: "characters",
    characterArchetypeMirrorPath: "characterArchetype",
    selfLearningPath: "characterArchetype",
    characterArchetypeQuestionOne: "characterArchetype",
    characterArchetypeQuestionTwo: "characterArchetype",
    characterArchetypeQuestionThree: "characterArchetype",
    characterArchetypeResult: "characterArchetype",
    originReturn: "origin",
    originReturnPath: "origin",
    priorTopicReturn: "return",
    priorTopicReturnPath: "return",
    recenterNode: "orientation",
    loopRecovery: "orientation",
    cleanDoor: "orientation",
    switchTopics: "orientation",
    sharpQuestion: "orientation",
    returnFork: "origin",
    restartFork: "origin"
  };

  var TARGET_ROUTE_HANDOFFS = {
    compassPath: ["compass"],
    siteGuidePath: ["siteGuide"],
    websitePath: ["compass", "siteGuide", "laws", "showroom"],
    proofPath: ["laws", "scientificLaw", "gauges"],
    lawsPath: ["laws", "scientificLaw"],
    scientificLawPath: ["scientificLaw", "laws", "gauges"],
    scientificLawTheoryPath: ["scientificLaw"],
    scientificLawEvidencePath: ["scientificLaw"],
    scientificLawMeasurePath: ["scientificLaw"],
    scientificLawLimitsPath: ["scientificLaw"],
    scientificLawRoutePath: ["scientificLaw"],
    scientificLawLadderPath: ["scientificLaw"],
    scientificLawTermsPath: ["scientificLaw"],
    gaugesPath: ["gauges", "scientificLaw"],
    diagnosticPath: ["coherenceDiagnostic"],
    characterArchetypeMirrorPath: ["coherenceDiagnostic", "characters"],
    seanPath: ["meetSean"],
    underdogPath: ["aboutUnderdog", "meetSean"],
    productsPath: ["products"],
    bookPath: ["book"],
    nineSummitsPath: ["nineSummits", "book"],
    mirrorlandPath: ["interactiveNarrative", "mirrorland", "characters"],
    atriumPath: ["showroom", "interactiveNarrative"],
    atlasPath: ["globeWindow", "mirrorland"],
    hearthPath: ["hearth"],
    hearthFacilityPath: ["hearth"],
    hearthConstructPath: ["hearth"],
    hearthFrontierPath: ["hearth", "frontier"],
    hearthLawPath: ["hearth", "scientificLaw"],
    hearthProductionPath: ["hearth"],
    ziontsPath: ["zionts", "scientificLaw"],
    audraliaPath: ["audralia"],
    audraliaWorldroomPath: ["audraliaWorldroom", "audralia"],
    controlCockpitPath: ["controlCockpit", "audralia"],
    frontierPath: ["frontier"],
    frontierSystemsPath: ["frontier"],
    frontierEnergyPath: ["frontierEnergy", "frontier"],
    frontierWaterPath: ["frontierWater", "frontier"],
    frontierWastePath: ["frontierWaste", "frontier"],
    frontierClosedLoopPath: ["frontierClosedLoop", "frontier"],
    frontierInfrastructurePath: ["frontierInfrastructure", "frontier"],
    frontierLatticePath: ["frontierLattice", "frontier"],
    frontierUrbanPath: ["frontierUrban", "frontier"],
    frontierManualPath: ["frontierManual", "frontier"],
    frontierShimmerPath: ["frontierShimmer", "frontier"],
    frontierTrajectoryPath: ["frontierTrajectory", "frontier"],
    frontierVisionPath: ["frontierVision", "frontier"],
    frontierLawPath: ["frontier", "scientificLaw"],
    frontierCharactersPath: ["frontier", "characters"],
    charactersPath: ["characters", "interactiveNarrative"],
    characterIdentityPath: ["characters"],
    characterRelationshipsPath: ["characters"],
    characterTensionsPath: ["characters"],
    characterMotivesPath: ["characters"],
    characterStoryPressurePath: ["characters"],
    characterFirstPath: ["characters"],
    characterAurenValePath: ["characters"],
    characterDextrionPath: ["characters"],
    characterAlaricPath: ["characters"],
    characterTarianPath: ["characters"],
    characterElaraPath: ["characters"],
    characterSorenPath: ["characters"],
    characterJeevesPath: ["characters"],
    characterRemoteTeamPath: ["characters"]
  };

  var TARGET_CHARACTER_MAP = {
    characterAurenValePath: "aurenVale",
    characterDextrionPath: "dextrion",
    characterAlaricPath: "alaric",
    characterTarianPath: "tarian",
    characterElaraPath: "elara",
    characterSorenPath: "soren",
    characterJeevesPath: "jeeves",
    characterRemoteTeamPath: "remoteTeam"
  };

  var FRONTIER_TARGET_MAP = {
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

  var SCIENTIFIC_LAW = {
    core: "A claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
    summary: "Scientific Law is the Reality Test chamber inside the West Library. It separates what sounds convincing from what keeps working after observation, evidence, measurement, comparison, correction, uncertainty, and limits.",
    ladder: "Impression → Observation → Evidence → Measurement → Repeatability → Model → Limitation → Scientific Claim."
  };

  var FRONTIER_SYSTEMS = {
    energy: {
      target: "frontierEnergyPath",
      route: "frontierEnergy",
      name: "Energy",
      status: "Fusion readiness",
      character: "Dextrion",
      text: "Energy starts with power readiness: storage, load protection, facility inputs, losses, and fusion readiness without pretending the final breakthrough is already solved."
    },
    water: {
      target: "frontierWaterPath",
      route: "frontierWater",
      name: "Water",
      status: "Closed water systems",
      character: "Tarian",
      text: "Water asks how water keeps moving without being wasted: capture, cleaning, routing, reuse, continuity, quality checks, and failure detection."
    },
    waste: {
      target: "frontierWastePath",
      route: "frontierWaste",
      name: "Waste",
      status: "Wastewater systems",
      character: "Soren",
      text: "Waste begins where discarded material becomes a design test: sanitation, recovery, contaminant control, treatment, reuse classification, and return-material accounting."
    },
    closedLoop: {
      target: "frontierClosedLoopPath",
      route: "frontierClosedLoop",
      name: "Closed Loop",
      status: "Answer-back systems",
      character: "Soren",
      text: "Closed Loop asks whether a system can answer back: detect pressure, register failure, correct course, and prove the correction returned somewhere useful."
    },
    infrastructure: {
      target: "frontierInfrastructurePath",
      route: "frontierInfrastructure",
      name: "Infrastructure",
      status: "Support load",
      character: "Auren Vale",
      text: "Infrastructure tests whether the world can carry weight: roads, supports, utilities, corridors, redundancy, and load-bearing civic structure."
    },
    lattice: {
      target: "frontierLatticePath",
      route: "frontierLattice",
      name: "Lattice",
      status: "Ordered growth",
      character: "Jeeves",
      text: "Lattice asks whether growth has order. Placement, count, relationship, and pattern keep a world from expanding randomly into noise."
    },
    urban: {
      target: "frontierUrbanPath",
      route: "frontierUrban",
      name: "Urban",
      status: "Civic pressure",
      character: "Remote Team",
      text: "Urban tests settlement pressure: corridors, density, shelter, public systems, movement, and built-world consequence."
    },
    manual: {
      target: "frontierManualPath",
      route: "frontierManual",
      name: "Manual",
      status: "Operating path",
      character: "Jeeves",
      text: "Manual turns the playground into instructions, handling rules, readable next steps, safety notes, and operating boundaries."
    },
    shimmer: {
      target: "frontierShimmerPath",
      route: "frontierShimmer",
      name: "Shimmer",
      status: "Visible signal",
      character: "Elara",
      text: "Shimmer makes change visible. A glint, warning, pulse, or surface shift tells the visitor that pressure is moving before the full system explains itself."
    },
    trajectory: {
      target: "frontierTrajectoryPath",
      route: "frontierTrajectory",
      name: "Trajectory",
      status: "Direction and timing",
      character: "Alaric",
      text: "Trajectory asks where the future is moving: direction, timing, path, drift detection, course correction, and outcome tracking."
    },
    vision: {
      target: "frontierVisionPath",
      route: "frontierVision",
      name: "Vision",
      status: "Horizon aim",
      character: "Elara",
      text: "Vision keeps the horizon in view. It asks what kind of future the world is trying to reach before systems harden into habits."
    }
  };

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    initialized: false,
    busy: false,
    runToken: 0,

    currentNode: DEFAULT_ORIGIN_NODE,
    previousNode: "",
    currentTopic: "origin",
    currentPosture: "arrival",
    currentPhase: "receive",
    currentScopeLane: SCOPE_OBJECTIVE,
    currentVoiceMode: MODE_OBJECTIVE,
    currentDepth: 0,
    currentRouteHandoffs: [],
    currentRoomId: DEFAULT_CURRENT_ROOM_ID,
    currentRoomName: "Hearth Production Chamber",
    currentCoordinateName: "East Construct Chamber",
    currentCardinal: "E",
    currentPlaceType: "chamber",
    originAnchor: DEFAULT_ORIGIN_ANCHOR,
    originConversation: {
      node: DEFAULT_ORIGIN_NODE,
      topic: "origin",
      roomId: DEFAULT_CURRENT_ROOM_ID,
      coordinateName: "East Construct Chamber"
    },
    priorTopic: null,
    priorNode: "",
    lastStableNode: DEFAULT_ORIGIN_NODE,
    returnStack: [],
    branchStack: [],
    topicStack: [],
    stateIndex: 0,

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
      roomTrail: [],
      characterArchetypeAnswers: [],
      characterProfileViews: [],
      characterRelationshipViews: 0,
      characterCompletionReadiness: 0,
      characterCompletionPromptShown: false,
      lastCharacterViewed: "",
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
      endpoint: DEFAULT_BRAIN_ENDPOINT,
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
  var expression = null;

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

  function normalizeTarget(target) {
    var clean = String(target || "").trim();
    clean = TARGET_ALIASES[clean] || clean;
    if (!clean) return "recenterNode";
    if (APPROVED_TARGETS.indexOf(clean) === -1) return "recenterNode";
    return clean;
  }

  function normalizeRouteId(routeId) {
    var clean = String(routeId || "").trim();
    clean = ROUTE_ALIASES[clean] || clean;
    if (Object.prototype.hasOwnProperty.call(DEFAULT_ROUTES, clean)) return clean;
    return "";
  }

  function isNarrativeTarget(target) {
    return NARRATIVE_TARGETS.indexOf(normalizeTarget(target)) !== -1;
  }

  function getExpression() {
    if (expression) return expression;

    expression =
      (global.HEARTH && global.HEARTH.JEEVES_EXPRESSION) ||
      (global.HEARTH && global.HEARTH.JEEVES && global.HEARTH.JEEVES.expression) ||
      global.JEEVES_EXPRESSION ||
      null;

    return expression;
  }

  function expressionReady() {
    return Boolean(getExpression() && getExpression().contract);
  }

  function expressionSanitize(text, context) {
    var exp = getExpression();
    if (exp && typeof exp.sanitizePublicText === "function") {
      return exp.sanitizePublicText(text, buildExpressionContext(context));
    }

    return fallbackSanitize(text);
  }

  function fallbackSanitize(text) {
    var clean = String(text || "");

    clean = clean.replace(/\bthe world side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld gate\b/gi, "South Gate");
    clean = clean.replace(/\bCharacter Mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bcharacter mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bwhich character am I most like\b/gi, "which Character Archetype do I follow under pressure");
    clean = clean.replace(/\bscope lane\b/gi, "path");
    clean = clean.replace(/\bregistry\b/gi, "guide");
    clean = clean.replace(/\broute lane\b/gi, "path");
    clean = clean.replace(/\bbackend bridge\b/gi, "deeper answer path");
    clean = clean.replace(/\bAPI\b/g, "answer path");
    clean = clean.replace(/\bDOM\b/g, "visible interface");
    clean = clean.replace(/\bthe Mirrorland\b/gi, "Mirrorland");
    clean = clean.replace(/\s{2,}/g, " ");

    return clean.trim();
  }

  function expressionShapeOptions(options, context) {
    var exp = getExpression();
    if (exp && typeof exp.shapeOptions === "function") {
      return exp.shapeOptions(options, buildExpressionContext(context)).map(normalizeShapedOption);
    }

    return (options || []).map(function fallbackShape(item) {
      var target = normalizeTarget(item.target);
      return normalizeShapedOption({
        label: item.label || target,
        target: target,
        type: item.type || inferOptionType(target),
        scopeLane: item.scopeLane || (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE),
        signal: item.signal || inferSignal(target),
        roomId: getRoomDescriptorForTarget(target).id,
        coordinateName: getRoomDescriptorForTarget(target).coordinateName,
        cardinal: getRoomDescriptorForTarget(target).cardinal,
        placeType: getRoomDescriptorForTarget(target).placeType
      });
    });
  }

  function normalizeShapedOption(item) {
    var target = normalizeTarget(item && item.target ? item.target : "");
    var room = getRoomDescriptorForTarget(target);

    return {
      label: expressionSanitize(item && item.label ? item.label : target, { target: target }),
      target: target,
      type: item && item.type ? item.type : inferOptionType(target),
      scopeLane: item && item.scopeLane ? item.scopeLane : (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE),
      signal: item && item.signal ? item.signal : inferSignal(target),
      roomId: item && item.roomId ? item.roomId : room.id,
      coordinateName: item && item.coordinateName ? item.coordinateName : room.coordinateName,
      cardinal: item && item.cardinal ? item.cardinal : room.cardinal,
      placeType: item && item.placeType ? item.placeType : room.placeType
    };
  }

  function buildExpressionContext(extra) {
    var ctx = {
      currentNode: state.currentNode,
      currentRoomId: state.currentRoomId,
      currentRoomName: state.currentRoomName,
      currentCoordinateName: state.currentCoordinateName,
      currentCardinal: state.currentCardinal,
      currentPlaceType: state.currentPlaceType,
      currentTopic: state.currentTopic,
      target: extra && extra.target ? extra.target : "",
      visitorText: extra && extra.visitorText ? extra.visitorText : "",
      label: extra && extra.label ? extra.label : "",
      priorTopic: state.priorTopic ? state.priorTopic.topic : "",
      priorTopicName: state.priorTopic ? state.priorTopic.label || state.priorTopic.topic : "",
      priorNode: state.priorNode,
      originConversation: state.originConversation ? state.originConversation.node : "",
      originConversationName: "the origin conversation",
      hasOrigin: Boolean(state.originConversation),
      returnStackLength: state.returnStack.length,
      characterProfileViewCount: state.visitor.characterProfileViews.length,
      characterRelationshipViews: state.visitor.characterRelationshipViews,
      characterLoopCount: state.currentTopic === "characters" ? state.visitor.loopCount : 0,
      characterCompletionReady: state.visitor.characterCompletionReadiness >= 3
    };

    if (extra) {
      Object.keys(extra).forEach(function copyExtra(key) {
        ctx[key] = extra[key];
      });
    }

    return ctx;
  }

  function wordCount(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function getTypingDelay(text, index) {
    var delay = PACING.typingBaseMs + wordCount(text) * PACING.typingWordMs;
    if (index === 0) delay += 130;
    return clamp(delay, PACING.typingMinMs, PACING.typingMaxMs);
  }

  function getReadDelay(text) {
    return clamp(
      PACING.readBaseMs + wordCount(text) * PACING.readWordMs,
      PACING.readMinMs,
      PACING.readMaxMs
    );
  }

  function say(label, target, meta) {
    var item = {
      label: label,
      target: normalizeTarget(target),
      type: "conversation"
    };

    if (meta) {
      Object.keys(meta).forEach(function copyMeta(key) {
        item[key] = meta[key];
      });
    }

    return item;
  }

  function control(label, target, meta) {
    var item = say(label, target, meta);
    item.type = "control";
    return item;
  }

  function inferOptionType(target) {
    var clean = normalizeTarget(target);

    if (
      clean === "cleanDoor" ||
      clean === "recenterNode" ||
      clean === "switchTopics" ||
      clean === "sharpQuestion" ||
      clean === "returnFork" ||
      clean === "restartFork" ||
      clean === "originReturn" ||
      clean === "originReturnPath" ||
      clean === "priorTopicReturn" ||
      clean === "priorTopicReturnPath"
    ) {
      return "control";
    }

    return "conversation";
  }

  function inferSignal(target) {
    var clean = normalizeTarget(target);

    if (clean.indexOf("characterArchetype") === 0 || clean === "selfLearningPath") return "archetype";
    if (clean.indexOf("character") === 0 || clean === "charactersPath") return "characters";
    if (clean.indexOf("scientificLaw") === 0 || clean === "proofPath" || clean === "lawsPath") return "proof";
    if (clean.indexOf("frontier") === 0) return "future";
    if (clean.indexOf("hearth") === 0) return "hearth";
    if (clean === "mirrorlandPath" || clean === "atriumPath" || clean === "atlasPath" || clean === "audraliaPath") return "mirrorland";
    if (clean === "seanPath") return "source";
    if (clean === "underdogPath" || clean === "diagnosticPath") return "self";
    if (clean === "originReturnPath" || clean === "priorTopicReturnPath" || clean === "returnFork") return "return";

    return "orientation";
  }

  function makeNode(node, topic, posture, phase, scopeLane, voiceMode, depth, beats, options, handoffs, meta) {
    var cleanNode = normalizeTarget(node);
    var room = getRoomDescriptorForTarget(cleanNode);

    if (meta && meta.roomId) {
      room = getRoomDescriptor(meta.roomId) || room;
    }

    return {
      node: cleanNode,
      topic: topic || TARGET_TOPIC_MAP[cleanNode] || cleanNode,
      posture: posture || "orientation",
      phase: phase || "ground",
      scopeLane: scopeLane || (isNarrativeTarget(cleanNode) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE),
      voiceMode: voiceMode || MODE_OBJECTIVE,
      depth: depth || 0,
      beats: (beats || []).map(function cleanBeat(beat) {
        return expressionSanitize(beat, { target: cleanNode });
      }),
      options: expressionShapeOptions(options || [], { target: cleanNode }),
      handoffs: normalizeHandoffs(handoffs || TARGET_ROUTE_HANDOFFS[cleanNode] || []),
      roomId: room.id,
      roomName: room.canonicalName || room.name || "",
      coordinateName: room.coordinateName || "First Fork",
      cardinal: room.cardinal || "C",
      placeType: room.placeType || "fork",
      source: meta && meta.source ? meta.source : "frontbrain"
    };
  }

  function getRoomDescriptor(roomId) {
    var exp = getExpression();
    var room = null;

    if (exp && typeof exp.createRoomDescriptor === "function") {
      room = exp.createRoomDescriptor(roomId);
      if (room) return room;
    }

    if (exp && typeof exp.getRoom === "function") {
      room = exp.getRoom(roomId);
      if (room) return room;
    }

    return fallbackRoomDescriptor(roomId);
  }

  function getRoomDescriptorForTarget(target) {
    var clean = normalizeTarget(target);
    var exp = getExpression();
    var descriptor = null;

    if (exp && typeof exp.createTargetDescriptor === "function") {
      descriptor = exp.createTargetDescriptor(clean);
      if (descriptor && descriptor.room) return descriptor.room;
    }

    if (exp && typeof exp.getRoomForTarget === "function") {
      descriptor = exp.getRoomForTarget(clean);
      if (descriptor) return descriptor;
    }

    return fallbackRoomDescriptorForTarget(clean);
  }

  function fallbackRoomDescriptor(roomId) {
    var map = {
      hearthProductionChamber: {
        id: "hearthProductionChamber",
        canonicalName: "Hearth Production Chamber",
        coordinateName: "East Construct Chamber",
        cardinal: "E",
        placeType: "chamber",
        returnParent: "hearth",
        originAnchor: "firstFork"
      },
      firstFork: {
        id: "firstFork",
        canonicalName: "First Fork",
        coordinateName: "First Fork",
        cardinal: "C",
        placeType: "fork",
        returnParent: "",
        originAnchor: "firstFork"
      }
    };

    return map[roomId] || map.firstFork;
  }

  function fallbackRoomDescriptorForTarget(target) {
    if (target.indexOf("hearth") === 0) return fallbackRoomDescriptor("hearthProductionChamber");
    if (target.indexOf("frontier") === 0) return { id: "frontier", canonicalName: "Frontier", coordinateName: "East Yard", cardinal: "E", placeType: "yard" };
    if (target.indexOf("scientificLaw") === 0 || target === "proofPath") return { id: "scientificLaw", canonicalName: "Scientific Law", coordinateName: "West Proof Chamber", cardinal: "W", placeType: "chamber" };
    if (target.indexOf("character") === 0 || target === "charactersPath") return { id: "characters", canonicalName: "Characters", coordinateName: "South Character Lane", cardinal: "S", placeType: "lane" };
    if (target === "mirrorlandPath") return { id: "mirrorland", canonicalName: "Mirrorland", coordinateName: "South Window", cardinal: "S", placeType: "window" };
    if (target === "seanPath") return { id: "meetSean", canonicalName: "Meet Sean", coordinateName: "North Source Hall", cardinal: "N", placeType: "hall" };
    if (target === "compassPath") return { id: "compassDesk", canonicalName: "Compass Desk", coordinateName: "North Fork", cardinal: "N", placeType: "fork" };
    return fallbackRoomDescriptor("firstFork");
  }

  function normalizeHandoffs(handoffs) {
    var seen = {};
    var result = [];

    (handoffs || []).forEach(function eachHandoff(routeId) {
      var clean = normalizeRouteId(routeId);
      if (!clean || seen[clean]) return;
      seen[clean] = true;
      result.push(clean);
    });

    return result;
  }

  function dedupeOptions(options) {
    var seen = {};
    var result = [];

    (options || []).forEach(function eachOption(option) {
      var target = normalizeTarget(option && option.target);
      var label = option && option.label ? option.label : target;
      var key = label + "::" + target;

      if (!label || !target || seen[key]) return;

      seen[key] = true;
      result.push(option);
    });

    return result;
  }

  function readConfig() {
    var script = query("#jeevesConversationConfig");

    if (!script) {
      return {
        initialNode: "intro",
        currentRoomId: DEFAULT_CURRENT_ROOM_ID,
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        initialNode: "intro",
        currentRoomId: DEFAULT_CURRENT_ROOM_ID,
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
    var exp = getExpression();

    if (exp && typeof exp.shapeRouteLabel === "function") {
      return exp.shapeRouteLabel(id, ROUTE_LABELS[id] || "Open route");
    }

    return ROUTE_LABELS[id] || "Open route";
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
    els.promptGrid =
      query("[data-jeeves-prompt-grid]") ||
      query("[data-jeeves-options-grid]") ||
      query(".jeeves-prompt-grid") ||
      query(".jeeves-options-grid");

    els.promptDock =
      query("[data-jeeves-prompt-dock]") ||
      query("[data-jeeves-options-dock]") ||
      query("[data-jeeves-prompt-panel]") ||
      query("[data-jeeves-response-panel]") ||
      query(".jeeves-prompt-dock") ||
      query(".jeeves-options-dock") ||
      query(".jeeves-prompt-panel") ||
      query(".jeeves-response-panel") ||
      (els.promptGrid ? els.promptGrid.closest("[data-jeeves-prompt-dock],[data-jeeves-options-dock],[data-jeeves-prompt-panel],[data-jeeves-response-panel],.jeeves-prompt-dock,.jeeves-options-dock,.jeeves-prompt-panel,.jeeves-response-panel") : null) ||
      (els.promptGrid ? els.promptGrid.parentElement : null);

    els.handoffDock = query("[data-jeeves-handoff-dock]") || query(".jeeves-handoff-dock");
    els.handoffGrid = query("[data-jeeves-handoff-grid]") || query(".jeeves-handoff-grid");
    els.status = query("[data-jeeves-status]");
    els.statusText = query("[data-jeeves-status-text]");
    els.messageTemplate = query("#jeevesMessageTemplate");
    els.optionTemplate = query("#jeevesOptionTemplate");
    els.routeOptionTemplate = query("#jeevesRouteOptionTemplate");
    els.restoreButton = query("[data-jeeves-action='restore']");
    els.minimized = query("[data-jeeves-minimized]");

    ensurePromptDock();
    ensureHandoffDock();
  }

  function ensurePromptDock() {
    var parent;
    var title;

    if (els.promptGrid) {
      if (!els.promptDock) {
        els.promptDock = els.promptGrid.parentElement;
      }
      return;
    }

    if (!els.thread || !els.thread.parentElement) return;

    parent = els.thread.parentElement;

    els.promptDock = document.createElement("section");
    els.promptDock.className = "jeeves-prompt-dock";
    els.promptDock.setAttribute("data-jeeves-prompt-dock", "");
    els.promptDock.setAttribute("data-jeeves-generated-prompt-dock", "true");
    els.promptDock.setAttribute("data-prompt-visible", "false");
    els.promptDock.setAttribute("data-options-visible", "false");
    els.promptDock.setAttribute("aria-hidden", "true");
    els.promptDock.hidden = true;

    title = document.createElement("p");
    title.className = "jeeves-prompt-dock-label";
    title.textContent = "Choose what to say";
    title.setAttribute("data-jeeves-prompt-title", "");

    els.promptGrid = document.createElement("div");
    els.promptGrid.className = "jeeves-prompt-grid";
    els.promptGrid.setAttribute("data-jeeves-prompt-grid", "");
    els.promptGrid.setAttribute("data-options-visible", "false");
    els.promptGrid.setAttribute("aria-hidden", "true");
    els.promptGrid.hidden = true;

    els.promptDock.appendChild(title);
    els.promptDock.appendChild(els.promptGrid);

    if (els.thread.nextSibling) {
      parent.insertBefore(els.promptDock, els.thread.nextSibling);
    } else {
      parent.appendChild(els.promptDock);
    }
  }

  function ensureHandoffDock() {
    var parent;
    var label;

    if (els.handoffDock && els.handoffGrid) return;
    if (!els.thread || !els.thread.parentElement) return;

    parent = els.promptDock && els.promptDock.parentElement ? els.promptDock.parentElement : els.thread.parentElement;

    if (!els.handoffDock) {
      els.handoffDock = document.createElement("section");
      els.handoffDock.className = "jeeves-handoff-dock";
      els.handoffDock.setAttribute("data-jeeves-handoff-dock", "");
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      els.handoffDock.hidden = true;

      label = document.createElement("p");
      label.className = "jeeves-handoff-dock-label";
      label.textContent = "Open a room";
      els.handoffDock.appendChild(label);
    }

    if (!els.handoffGrid) {
      els.handoffGrid = document.createElement("div");
      els.handoffGrid.className = "jeeves-handoff-grid";
      els.handoffGrid.setAttribute("data-jeeves-handoff-grid", "");
      els.handoffDock.appendChild(els.handoffGrid);
    }

    if (!els.handoffDock.parentElement) {
      if (els.promptDock && els.promptDock.nextSibling) {
        parent.insertBefore(els.handoffDock, els.promptDock.nextSibling);
      } else {
        parent.appendChild(els.handoffDock);
      }
    }
  }

  function revealElement(element) {
    if (!element) return;

    element.hidden = false;
    element.removeAttribute("hidden");
    element.removeAttribute("inert");
    element.removeAttribute("aria-disabled");

    if (element.style) {
      element.style.removeProperty("display");
      element.style.removeProperty("visibility");
      element.style.removeProperty("opacity");
      element.style.removeProperty("pointer-events");
      element.style.removeProperty("height");
      element.style.removeProperty("max-height");
    }
  }

  function concealElement(element) {
    if (!element) return;

    element.hidden = true;
    element.setAttribute("aria-hidden", "true");

    if (element.style) {
      element.style.display = "none";
    }
  }

  function clearElement(element) {
    if (!element) return;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function setPromptVisible(isVisible) {
    document.documentElement.dataset.jeevesOptionsVisible = isVisible ? "true" : "false";
    document.documentElement.dataset.jeevesPromptVisible = isVisible ? "true" : "false";

    if (isVisible) {
      revealElement(els.promptDock);
      revealElement(els.promptGrid);
    } else {
      concealElement(els.promptDock);
      concealElement(els.promptGrid);
    }

    if (els.promptDock) {
      els.promptDock.setAttribute("aria-hidden", isVisible ? "false" : "true");
      els.promptDock.setAttribute("data-prompt-visible", isVisible ? "true" : "false");
      els.promptDock.setAttribute("data-options-visible", isVisible ? "true" : "false");
      els.promptDock.setAttribute("data-jeeves-options-visible", isVisible ? "true" : "false");
    }

    if (els.promptGrid) {
      els.promptGrid.setAttribute("aria-hidden", isVisible ? "false" : "true");
      els.promptGrid.setAttribute("data-options-visible", isVisible ? "true" : "false");
      els.promptGrid.setAttribute("data-jeeves-options-visible", isVisible ? "true" : "false");
    }
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

  function scrollThread() {
    if (!els.thread) return;

    try {
      els.thread.scrollTop = els.thread.scrollHeight;
    } catch (_error) {
      /* Non-critical. */
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
    var cleanText = origin === "visitor" ? String(text || "") : expressionSanitize(text, settings || {});

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

  function hideOptions() {
    clearElement(els.promptGrid);
    clearElement(els.handoffGrid);
    setPromptVisible(false);

    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      els.handoffDock.hidden = true;
    }
  }

  function normalizeButtonElement(element) {
    var button = element;
    var replacement;

    if (!button || button.nodeType !== 1) {
      button = document.createElement("button");
    }

    if (button.tagName && button.tagName.toLowerCase() !== "button") {
      replacement = document.createElement("button");
      replacement.className = button.className || "";
      while (button.firstChild) {
        replacement.appendChild(button.firstChild);
      }
      button = replacement;
    }

    return button;
  }

  function makeOptionButton(item) {
    var button = normalizeButtonElement(cloneTemplate(els.optionTemplate, "button"));
    var label = query("span", button);
    var target = normalizeTarget(item.target);
    var cleanLabel = expressionSanitize(item.label, { target: target, label: item.label });
    var room = getRoomDescriptorForTarget(target);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", item.type || inferOptionType(target));
    button.setAttribute("data-option-target", target);
    button.setAttribute("data-option-scope-lane", item.scopeLane || (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE));
    button.setAttribute("data-option-room-id", item.roomId || room.id);
    button.setAttribute("data-option-coordinate", item.coordinateName || room.coordinateName || "");
    button.setAttribute("data-option-cardinal", item.cardinal || room.cardinal || "");
    button.setAttribute("data-option-place-type", item.placeType || room.placeType || "");
    button.setAttribute("data-option-signal", item.signal || inferSignal(target));

    if (label) {
      label.textContent = cleanLabel;
    } else {
      button.textContent = cleanLabel;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption({
        label: cleanLabel,
        target: target,
        type: item.type || inferOptionType(target),
        signal: item.signal || inferSignal(target),
        scopeLane: item.scopeLane || (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE),
        roomId: item.roomId || room.id,
        coordinateName: item.coordinateName || room.coordinateName,
        cardinal: item.cardinal || room.cardinal,
        placeType: item.placeType || room.placeType
      });
    });

    return button;
  }

  function makeRouteLink(item) {
    var link = cloneTemplate(els.routeOptionTemplate, "a");
    var label;

    if (!link || !link.tagName || link.tagName.toLowerCase() !== "a") {
      link = document.createElement("a");
    }

    label = query("span", link);

    link.classList.add("jeeves-option");
    link.classList.add("jeeves-option-route");
    link.setAttribute("href", item.href || "#");
    link.setAttribute("data-option-type", "route");
    link.setAttribute("data-option-target", item.id || "");
    link.setAttribute("data-route-id", item.id || "");

    if (label) {
      label.textContent = item.label;
    } else {
      link.textContent = item.label;
    }

    return link;
  }

  function renderOptions(options) {
    var shaped = dedupeOptions(expressionShapeOptions(options || [], {}));
    var fallback = [
      control("Choose a new door.", "cleanDoor"),
      control("Return to prior topic.", "priorTopicReturnPath"),
      control("Return to origin conversation.", "originReturnPath"),
      control("Re-center me.", "recenterNode")
    ];

    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    if (!shaped.length) {
      shaped = expressionShapeOptions(fallback, {});
    }

    shaped.slice(0, 9).forEach(function eachOption(item) {
      els.promptGrid.appendChild(makeOptionButton(item));
    });

    setPromptVisible(els.promptGrid.children.length > 0);
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
      els.handoffDock.hidden = true;
      return;
    }

    revealElement(els.handoffDock);
    revealElement(els.handoffGrid);
    els.handoffDock.setAttribute("data-handoff-visible", "true");
    els.handoffDock.setAttribute("aria-hidden", "false");

    handoffs.slice(0, 6).forEach(function eachHandoff(item) {
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
        emphasis: i === 0,
        source: source || "frontbrain"
      });

      await waitSkippable(getReadDelay(beat), "reading");
    }

    if (token !== state.runToken) return false;

    await waitSkippable(PACING.optionRevealDelayMs, "options");

    return token === state.runToken;
  }

  function setCurrentRoomFromNode(node) {
    var room = getRoomDescriptor(node.roomId) || getRoomDescriptorForTarget(node.node);

    state.currentRoomId = room.id || DEFAULT_CURRENT_ROOM_ID;
    state.currentRoomName = room.canonicalName || room.name || "";
    state.currentCoordinateName = room.coordinateName || "";
    state.currentCardinal = room.cardinal || "";
    state.currentPlaceType = room.placeType || "";

    document.documentElement.dataset.jeevesRoomId = state.currentRoomId;
    document.documentElement.dataset.jeevesRoomName = state.currentRoomName;
    document.documentElement.dataset.jeevesCoordinateName = state.currentCoordinateName;
    document.documentElement.dataset.jeevesCardinal = state.currentCardinal;
    document.documentElement.dataset.jeevesPlaceType = state.currentPlaceType;
    document.documentElement.dataset.currentRoom = state.currentRoomId;
    document.documentElement.dataset.currentRoomCoordinate = state.currentCoordinateName;
  }

  function setDocumentState() {
    document.documentElement.dataset.jeevesEngineContract = CONTRACT;
    document.documentElement.dataset.jeevesExpressionContract =
      expressionReady() ? getExpression().contract : "missing";
    document.documentElement.dataset.jeevesExpressionExpected = DEFAULT_EXPRESSION_CONTRACT;
    document.documentElement.dataset.jeevesRuntimeReady = "true";
    document.documentElement.dataset.jeevesPairedBrain = "true";
    document.documentElement.dataset.jeevesBackBrainEndpoint = state.brain.endpoint;
    document.documentElement.dataset.jeevesPosture = state.currentPosture;
    document.documentElement.dataset.jeevesPhase = state.currentPhase;
    document.documentElement.dataset.jeevesTopic = state.currentTopic;
    document.documentElement.dataset.jeevesScopeLane = state.currentScopeLane;
    document.documentElement.dataset.jeevesVoiceMode = state.currentVoiceMode;
    document.documentElement.dataset.jeevesFinalRouteAuthority = "frontbrain";
    document.documentElement.dataset.jeevesOriginAnchor = state.originAnchor;
    document.documentElement.dataset.jeevesReturnStackLength = String(state.returnStack.length);
    document.documentElement.dataset.jeevesOriginNode = state.originConversation ? state.originConversation.node : DEFAULT_ORIGIN_NODE;
    document.documentElement.dataset.jeevesInternavigable = "true";

    if (els.status) {
      els.status.setAttribute("data-jeeves-state", state.currentTopic + ":" + state.currentPhase);
    }
  }

  function pushReturnPoint(nextTarget, choice) {
    var nextTopic = TARGET_TOPIC_MAP[normalizeTarget(nextTarget)] || "orientation";
    var currentTopic = state.currentTopic;
    var stable = {
      node: state.currentNode,
      topic: state.currentTopic,
      label: state.visitor.lastChoiceLabel || state.currentTopic || "prior topic",
      roomId: state.currentRoomId,
      coordinateName: state.currentCoordinateName,
      timestamp: Date.now()
    };

    if (!state.currentNode || state.currentNode === "priorTopicReturnPath" || state.currentNode === "originReturnPath") {
      return;
    }

    if (nextTopic !== currentTopic || nextTarget === "cleanDoor" || nextTarget === "switchTopics") {
      state.priorTopic = stable;
      state.priorNode = state.currentNode;
      state.returnStack.push(stable);
      state.branchStack.push({
        from: state.currentNode,
        to: normalizeTarget(nextTarget),
        label: choice && choice.label ? choice.label : "",
        timestamp: Date.now()
      });
      state.topicStack.push(currentTopic);
    }

    while (state.returnStack.length > MAX_STACK) state.returnStack.shift();
    while (state.branchStack.length > MAX_STACK) state.branchStack.shift();
    while (state.topicStack.length > MAX_STACK) state.topicStack.shift();
  }

  function popPriorReturnPoint() {
    var point = state.returnStack.pop();

    while (point && (!point.node || point.node === state.currentNode)) {
      point = state.returnStack.pop();
    }

    return point || state.priorTopic || null;
  }

  function updateVisitor(choice, node) {
    var sameTopic = state.visitor.lastTopic === node.topic;

    if (sameTopic) {
      state.visitor.progressCount += 1;
      if (node.depth >= 2) state.visitor.loopCount += 1;
    } else if (state.visitor.lastTopic) {
      state.visitor.digressionCount += 1;
      state.visitor.loopCount = 0;
    }

    state.visitor.lastChoiceLabel = choice && choice.label ? choice.label : state.visitor.lastChoiceLabel;
    state.visitor.lastSignal = choice && choice.signal ? choice.signal : inferSignal(node.node);
    state.visitor.lastItch = inferItchFromChoice(choice, node);
    state.visitor.lastTopic = node.topic;
    state.visitor.lastScopeLane = node.scopeLane;

    state.visitor.trail.push({
      node: node.node,
      topic: node.topic,
      depth: node.depth,
      scopeLane: node.scopeLane,
      label: state.visitor.lastChoiceLabel
    });

    state.visitor.roomTrail.push({
      node: node.node,
      roomId: node.roomId,
      roomName: node.roomName,
      coordinateName: node.coordinateName,
      cardinal: node.cardinal,
      placeType: node.placeType
    });

    while (state.visitor.trail.length > 18) state.visitor.trail.shift();
    while (state.visitor.roomTrail.length > 18) state.visitor.roomTrail.shift();

    updateCharacterState(node);

    if (state.visitor.digressionCount >= 5 || state.visitor.loopCount >= 4) {
      state.visitor.needsRecenter = true;
    }
  }

  function inferItchFromChoice(choice, node) {
    if (choice && choice.signal === "proof") return "testing whether the estate deserves trust";
    if (choice && choice.signal === "self") return "looking for a mirror";
    if (choice && choice.signal === "mirrorland") return "trying to enter Mirrorland";
    if (choice && choice.signal === "source") return "trying to find the human source behind the estate";
    if (choice && choice.signal === "archetype") return "trying to understand behavior under pressure";
    if (choice && choice.signal === "return") return "returning to a known thread";
    if (node.topic === "frontier") return "trying to understand future systems";
    if (node.topic === "hearth") return "trying to understand where world-formation becomes operational";
    if (node.topic === "characters") return "trying to understand who carries the story";
    if (node.topic === "scientificLaw") return "testing a claim before trusting it";
    return "choosing the next door";
  }

  function updateCharacterState(node) {
    var characterId = TARGET_CHARACTER_MAP[node.node];

    if (characterId) {
      if (state.visitor.characterProfileViews.indexOf(characterId) === -1) {
        state.visitor.characterProfileViews.push(characterId);
      }
      state.visitor.lastCharacterViewed = characterId;
    }

    if (
      node.node === "characterRelationshipsPath" ||
      node.node === "characterTensionsPath" ||
      node.node === "characterMotivesPath" ||
      node.node === "characterStoryPressurePath"
    ) {
      state.visitor.characterRelationshipViews += 1;
    }

    state.visitor.characterCompletionReadiness =
      state.visitor.characterProfileViews.length + state.visitor.characterRelationshipViews;
  }

  function updateArchetypeAnswers(choice, sourceNode) {
    var fromNode = sourceNode || state.currentNode;

    if (!choice || !choice.label) return;

    if (
      fromNode === "characterArchetypeQuestionOne" ||
      fromNode === "characterArchetypeQuestionTwo" ||
      fromNode === "characterArchetypeQuestionThree"
    ) {
      state.visitor.characterArchetypeAnswers.push(choice.label);

      while (state.visitor.characterArchetypeAnswers.length > 10) {
        state.visitor.characterArchetypeAnswers.shift();
      }
    }
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();
    var characterTarget = findCharacterTarget(value);

    if (
      value.indexOf("character archetype") !== -1 ||
      value.indexOf("archetype") !== -1 ||
      value.indexOf("under pressure") !== -1 ||
      value.indexOf("behavior under pressure") !== -1 ||
      value.indexOf("which character am i") !== -1 ||
      value.indexOf("which character am i most like") !== -1 ||
      value.indexOf("what character am i like") !== -1 ||
      value.indexOf("who do i act like") !== -1 ||
      value.indexOf("how do i respond") !== -1 ||
      value.indexOf("learn about myself") !== -1 ||
      value.indexOf("self learning") !== -1
    ) {
      return { target: "characterArchetypeMirrorPath", signal: "archetype" };
    }

    if (characterTarget) return { target: characterTarget, signal: "characters" };

    if (/\b(return|back|prior topic|previous topic|origin conversation|first fork)\b/.test(value)) {
      if (value.indexOf("origin") !== -1 || value.indexOf("first fork") !== -1) {
        return { target: "originReturnPath", signal: "return" };
      }
      return { target: "priorTopicReturnPath", signal: "return" };
    }

    if (/\b(lost|confused|recenter|center|reset|start over)\b/.test(value)) {
      return { target: "recenterNode", signal: "lost" };
    }

    if (/\b(sean|founder|creator|source|designer|developer|who built|human behind)\b/.test(value)) {
      return { target: "seanPath", signal: "source" };
    }

    if (/\b(underdog|inner voice|pressure in me)\b/.test(value)) {
      return { target: "underdogPath", signal: "self" };
    }

    if (/\b(expectation|limitations|limitation|live to love|love to laugh|live to listen|manipulation|use other people['’]s minds|summit|love)\b/.test(value)) {
      return { target: "nineSummitsPath", signal: "value" };
    }

    if (/\b(scientific law|theory|evidence|measure|measurement|limits|claim|proof|truth|law library|reality test)\b/.test(value)) {
      return { target: "scientificLawPath", signal: "proof" };
    }

    if (/\b(frontier|energy|fusion|water|waste|closed loop|infrastructure|lattice|urban|manual|shimmer|trajectory|vision|future systems)\b/.test(value)) {
      return { target: "frontierPath", signal: "future" };
    }

    if (/\b(hearth|planetary construct|construct facility|construct engine|production chamber|east construct)\b/.test(value)) {
      return { target: "hearthPath", signal: "hearth" };
    }

    if (/\b(character|characters|people inside|who lives)\b/.test(value)) {
      return { target: "charactersPath", signal: "characters" };
    }

    if (/\b(mirrorland|audralia|zionts|story|showroom|window|atrium|atlas)\b/.test(value)) {
      return { target: "mirrorlandPath", signal: "mirrorland" };
    }

    if (/\b(diagnostic|coherence|self|reflect|reflection)\b/.test(value)) {
      return { target: "diagnosticPath", signal: "self" };
    }

    if (/\b(product|tool|use|practical|economic|impact|gallery)\b/.test(value)) {
      return { target: "productsPath", signal: "practical" };
    }

    if (/\b(book|summit|love|laugh|listen)\b/.test(value)) {
      return { target: "bookPath", signal: "book" };
    }

    if (/\b(start|where|begin|orientation|direction|north|compass)\b/.test(value)) {
      return { target: "compassPath", signal: "orientation" };
    }

    return { target: "askFirst", signal: "question" };
  }

  function findCharacterTarget(text) {
    var value = String(text || "").toLowerCase();

    if (value.indexOf("auren") !== -1) return "characterAurenValePath";
    if (value.indexOf("dextrion") !== -1) return "characterDextrionPath";
    if (value.indexOf("alaric") !== -1) return "characterAlaricPath";
    if (value.indexOf("tarian") !== -1) return "characterTarianPath";
    if (value.indexOf("elara") !== -1) return "characterElaraPath";
    if (value.indexOf("soren") !== -1) return "characterSorenPath";
    if (value.indexOf("remote team") !== -1 || value.indexOf("distributed response") !== -1) return "characterRemoteTeamPath";

    if (value.indexOf("jeeves") !== -1 && value.indexOf("tell me about") !== -1) {
      return "characterJeevesPath";
    }

    return "";
  }

  function getNode(nodeId, choice) {
    var id = normalizeTarget(nodeId);
    var exp = getExpression();
    var result;
    var characterId;
    var frontierKey;

    if (id === "restartFork") {
      resetState();
      id = "intro";
    }

    if (id === "intro") return makeOriginNode();
    if (id === "returnFork") return makeOriginNode();
    if (id === "askFirst") return makeAskFirstNode();
    if (id === "priorTopicReturn" || id === "priorTopicReturnPath") return makePriorTopicReturnNode();
    if (id === "originReturn" || id === "originReturnPath") return makeOriginReturnNode();
    if (id === "recenterNode" || id === "loopRecovery") return makeRecenterNode();
    if (id === "switchTopics") return makeSwitchTopicsNode();
    if (id === "sharpQuestion") return makeSharpQuestionNode();
    if (id === "cleanDoor") return makeCleanDoorNode();

    if (id === "characterArchetypeMirrorPath" || id === "selfLearningPath") {
      if (exp && typeof exp.makeCharacterArchetypeIntro === "function") {
        result = exp.makeCharacterArchetypeIntro(buildExpressionContext({ target: id }));
        return nodeFromExpressionResult(id, "characterArchetype", "diagnostic", "personalize", SCOPE_OBJECTIVE, MODE_CHARACTER_ARCHETYPE, 1, result, ["coherenceDiagnostic", "characters"]);
      }
      return makeCharacterArchetypeIntroFallback();
    }

    if (id === "characterArchetypeQuestionOne") {
      return makeArchetypeQuestionNode(1);
    }

    if (id === "characterArchetypeQuestionTwo") {
      return makeArchetypeQuestionNode(2);
    }

    if (id === "characterArchetypeQuestionThree") {
      return makeArchetypeQuestionNode(3);
    }

    if (id === "characterArchetypeResult") {
      return makeArchetypeResultNode();
    }

    characterId = TARGET_CHARACTER_MAP[id];
    if (characterId) {
      if (exp && typeof exp.makeCharacterProfile === "function") {
        result = exp.makeCharacterProfile(characterId, buildExpressionContext({ target: id }));
        return nodeFromExpressionResult(id, "characters", "characters", "deepen", SCOPE_NARRATIVE, MODE_IMMERSION, 2, result, ["characters", "mirrorland"]);
      }
      return makeCharacterFallbackNode(id, characterId);
    }

    if (
      id === "charactersPath" ||
      id === "characterIdentityPath" ||
      id === "characterRelationshipsPath" ||
      id === "characterTensionsPath" ||
      id === "characterMotivesPath" ||
      id === "characterStoryPressurePath" ||
      id === "characterFirstPath"
    ) {
      return makeCharactersNode(id);
    }

    if (id.indexOf("scientificLaw") === 0 || id === "proofPath" || id === "skepticPlain" || id === "lawsPath") {
      return makeScientificLawNode(id);
    }

    if (id.indexOf("frontier") === 0) {
      frontierKey = FRONTIER_TARGET_MAP[id] || "";
      return makeFrontierNode(id, frontierKey);
    }

    if (id.indexOf("hearth") === 0) return makeHearthNode(id);

    if (id === "websitePath") return makeEstateNode();
    if (id === "compassPath" || id === "whereToStart") return makeCompassNode();
    if (id === "siteGuidePath") return makeSiteGuideNode();
    if (id === "gaugesPath") return makeGaugesNode();
    if (id === "diagnosticPath" || id === "futureProfilePath") return makeDiagnosticNode();
    if (id === "seanPath") return makeSeanNode();
    if (id === "underdogPath") return makeUnderdogNode();
    if (id === "productsPath") return makeProductsNode();
    if (id === "bookPath" || id === "nineSummitsPath") return makeNineSummitsNode(id);
    if (id === "mirrorlandPath" || id === "atriumPath" || id === "atlasPath" || id === "mirrorMePath") return makeMirrorlandNode(id);
    if (id === "ziontsPath") return makeZiontsNode();
    if (id === "audraliaPath" || id === "audraliaWorldroomPath" || id === "controlCockpitPath") return makeAudraliaNode(id);

    return makeRecenterNode();
  }

  function nodeFromExpressionResult(id, topic, posture, phase, scopeLane, voiceMode, depth, result, handoffs) {
    return makeNode(
      id,
      topic,
      posture,
      phase,
      scopeLane,
      voiceMode,
      depth,
      result && result.beats ? result.beats : [],
      result && result.options ? result.options : [],
      handoffs || TARGET_ROUTE_HANDOFFS[id] || [],
      { source: "expression" }
    );
  }

  function makeOriginNode() {
    var exp = getExpression();
    var result;

    if (exp && typeof exp.makeOriginIntro === "function") {
      result = exp.makeOriginIntro(buildExpressionContext({ target: "intro" }));
      return nodeFromExpressionResult("intro", "origin", "arrival", "receive", SCOPE_OBJECTIVE, MODE_OBJECTIVE, 0, result, []);
    }

    return makeNode(
      "intro",
      "origin",
      "arrival",
      "receive",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Welcome to the estate. I’m Jeeves.",
        "This is the First Fork, the starting point for every conversation inside Diamond Gate Bridge.",
        "Every path is connected. You can follow one road, cross to another, return to a prior topic, or choose a faster way to the endpoint you’re looking for.",
        "Right now, we are in the Hearth Production Chamber, the East Construct Chamber where this template is being stabilized before it moves to Compass."
      ],
      [
        say("Take me north to orientation.", "compassPath"),
        say("Take me west to proof.", "scientificLawPath"),
        say("Take me east to future systems.", "frontierPath"),
        say("Take me south into Mirrorland.", "mirrorlandPath"),
        say("Meet Sean.", "seanPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath")
      ],
      []
    );
  }

  function makeAskFirstNode() {
    return makeNode(
      "askFirst",
      "origin",
      "arrival",
      "invite",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask simply.",
        "What brought you to the estate first: direction, proof, self-reflection, Meet Sean, practical use, Mirrorland, or the Character Archetype Mirror?"
      ],
      [
        say("Direction.", "compassPath", { signal: "orientation" }),
        say("Proof.", "scientificLawPath", { signal: "proof" }),
        say("Self-reflection.", "diagnosticPath", { signal: "self" }),
        say("Meet Sean.", "seanPath", { signal: "source" }),
        say("Practical use.", "productsPath", { signal: "practical" }),
        say("Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath", { signal: "archetype" })
      ],
      []
    );
  }

  function makePriorTopicReturnNode() {
    var exp = getExpression();
    var point = popPriorReturnPoint();
    var result;
    var target = point && point.node ? point.node : "returnFork";

    if (point && point.node) {
      state.priorTopic = point;
      state.priorNode = point.node;
    }

    if (exp && typeof exp.makeReturnExpression === "function") {
      result = exp.makeReturnExpression("prior", buildExpressionContext({
        target: "priorTopicReturnPath",
        priorNode: target,
        priorTopicName: point ? point.label || point.topic : "the prior topic"
      }));

      return nodeFromExpressionResult(
        "priorTopicReturnPath",
        "return",
        "orientation",
        "return",
        SCOPE_OBJECTIVE,
        MODE_OBJECTIVE,
        1,
        result,
        []
      );
    }

    return makeNode(
      "priorTopicReturnPath",
      "return",
      "orientation",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "We can return to the prior topic.",
        "Nothing is lost. We are only stepping off this lane and returning to the last thread."
      ],
      [
        say("Return now.", target, { signal: "return" }),
        say("Return to origin conversation.", "originReturnPath", { signal: "return" }),
        say("Choose a new door.", "cleanDoor")
      ],
      []
    );
  }

  function makeOriginReturnNode() {
    var exp = getExpression();
    var result;

    if (exp && typeof exp.makeReturnExpression === "function") {
      result = exp.makeReturnExpression("origin", buildExpressionContext({ target: "originReturnPath" }));
      return nodeFromExpressionResult("originReturnPath", "origin", "arrival", "return", SCOPE_OBJECTIVE, MODE_OBJECTIVE, 0, result, []);
    }

    return makeNode(
      "originReturnPath",
      "origin",
      "arrival",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "We are back at the origin conversation.",
        "This is the First Fork. From here, every road is still connected."
      ],
      [
        say("North Fork.", "compassPath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("East Yard.", "frontierPath"),
        say("South Window.", "mirrorlandPath")
      ],
      []
    );
  }

  function makeRecenterNode() {
    return makeNode(
      "recenterNode",
      "orientation",
      "orientation",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Let me bring you back to the estate floor.",
        "You are not trapped in any one room. We can go north to orientation, west to proof, east to future systems, or south into Mirrorland."
      ],
      [
        say("North Fork.", "compassPath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("East Yard.", "frontierPath"),
        say("South Window.", "mirrorlandPath"),
        say("Return to prior topic.", "priorTopicReturnPath"),
        say("Return to origin conversation.", "originReturnPath")
      ],
      ["compass", "scientificLaw", "frontier", "mirrorland"]
    );
  }

  function makeSwitchTopicsNode() {
    return makeNode(
      "switchTopics",
      "orientation",
      "orientation",
      "fork",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Of course. We can change rooms.",
        "Choose a named door, and I’ll take you there without dragging the last room behind us."
      ],
      [
        say("North Fork.", "compassPath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("East Yard.", "frontierPath"),
        say("South Window.", "mirrorlandPath"),
        say("South Character Lane.", "charactersPath"),
        say("North Source Hall.", "seanPath"),
        say("Return to prior topic.", "priorTopicReturnPath")
      ],
      []
    );
  }

  function makeSharpQuestionNode() {
    if (state.currentTopic === "characterArchetype") {
      return makeNode(
        "sharpQuestion",
        "characterArchetype",
        "diagnostic",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        1,
        [
          "Then I’ll ask it cleanly.",
          "Do you want your dominant pattern, your support pattern, your behavior-break risk, or which Character Archetype you currently follow under pressure?"
        ],
        [
          say("Dominant pattern.", "characterArchetypeQuestionOne"),
          say("Support pattern.", "characterArchetypeQuestionOne"),
          say("Behavior-break risk.", "characterArchetypeQuestionOne"),
          say("Which Character Archetype do I follow under pressure?", "characterArchetypeQuestionOne")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (state.currentTopic === "scientificLaw" || state.currentTopic === "proof") {
      return makeNode(
        "sharpQuestion",
        "scientificLaw",
        "proof",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_OBJECTIVE,
        1,
        [
          "Then the sharper question is this:",
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

    return makeNode(
      "sharpQuestion",
      "orientation",
      "orientation",
      "clarify",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask it plainly.",
        "Do you want direction, truth, future systems, Mirrorland, the Characters, Meet Sean, Nine Summits, or your behavior under pressure?"
      ],
      [
        say("Direction.", "compassPath"),
        say("Truth.", "scientificLawPath"),
        say("Future systems.", "frontierPath"),
        say("Mirrorland.", "mirrorlandPath"),
        say("Meet the Characters.", "charactersPath"),
        say("Meet Sean.", "seanPath"),
        say("Nine Summits.", "nineSummitsPath"),
        say("Behavior under pressure.", "characterArchetypeMirrorPath")
      ],
      []
    );
  }

  function makeCleanDoorNode() {
    return makeNode(
      "cleanDoor",
      "orientation",
      "handoff",
      "route",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      2,
      [
        "The cleanest next door depends on what you want to do now.",
        "Right now, you seem to be " + (state.visitor.lastItch || "choosing the next door") + ".",
        "Every road remains connected, so this choice does not trap the conversation."
      ],
      [
        say("I need direction.", "compassPath"),
        say("I want truth.", "scientificLawPath"),
        say("I want Frontier.", "frontierPath"),
        say("I want Mirrorland.", "mirrorlandPath"),
        say("I want Meet Sean.", "seanPath"),
        say("I want the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
        say("Return to prior topic.", "priorTopicReturnPath")
      ],
      ["compass", "scientificLaw", "frontier", "mirrorland", "meetSean"]
    );
  }

  function makeEstateNode() {
    return makeNode(
      "websitePath",
      "estate",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The estate has a public side and a Mirrorland side.",
        "The public side gives visitors what they already know how to ask for: direction, proof, products, source, and self-reflection.",
        "Mirrorland is different. That is where the future becomes a window, the Characters become active, and the estate starts feeling less like a site and more like a place."
      ],
      [
        say("North Fork.", "compassPath"),
        say("North Map Hall.", "siteGuidePath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("North Source Hall.", "seanPath"),
        say("Northeast Market Hall.", "productsPath"),
        say("South Window.", "mirrorlandPath")
      ],
      ["compass", "siteGuide", "scientificLaw", "meetSean"]
    );
  }

  function makeCompassNode() {
    return makeNode(
      "compassPath",
      "orientation",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The North Fork is where I slow the estate down for you.",
        "If you want direction, stay here. If you want truth, I’ll take you west. If you want future systems, go east. If you want the window, go south into Mirrorland."
      ],
      [
        say("North Map Hall.", "siteGuidePath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("North Source Hall.", "seanPath"),
        say("North Inner Lane.", "underdogPath"),
        say("East Yard.", "frontierPath"),
        say("South Window.", "mirrorlandPath"),
        say("West-South Mirror Bridge.", "characterArchetypeMirrorPath")
      ],
      ["compass", "siteGuide"]
    );
  }

  function makeSiteGuideNode() {
    return makeNode(
      "siteGuidePath",
      "orientation",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The North Map Hall is the estate map.",
        "North gives orientation. West tests truth. East tests future systems. South opens Mirrorland. Center returns you to the First Fork."
      ],
      [
        say("North Fork.", "compassPath"),
        say("West Library.", "lawsPath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("East Yard.", "frontierPath"),
        say("South Gate.", "atriumPath"),
        say("South Character Lane.", "charactersPath")
      ],
      ["siteGuide", "compass", "showroom"]
    );
  }

  function makeScientificLawNode(id) {
    var clean = normalizeTarget(id);
    var beats = [
      SCIENTIFIC_LAW.summary,
      SCIENTIFIC_LAW.core,
      "The four doors are Theory, Evidence, Measure, and Limits."
    ];

    if (clean === "scientificLawTheoryPath") {
      beats = [
        "Theory is the explanation that risks being wrong.",
        "It organizes observations into a possible explanation, creates expectations, exposes assumptions, and must be able to lose.",
        "Audit question: what would force this theory to be revised, narrowed, or rejected?"
      ];
    } else if (clean === "scientificLawEvidencePath") {
      beats = [
        "Evidence is the checkable record that survives preference.",
        "Evidence must be inspectable, traceable, relevant, and separate from interpretation.",
        "Audit question: can this evidence be matched to the exact claim it is being used to support?"
      ];
    } else if (clean === "scientificLawMeasurePath") {
      beats = [
        "Measure is the coordinate system attached to a claim.",
        "Measurement needs object, variable, unit, method, instrument or observer, calibration, and uncertainty.",
        "Without measurement, people often argue from different maps."
      ];
    } else if (clean === "scientificLawLimitsPath") {
      beats = [
        "Limits are the boundary that protects truth from overclaiming.",
        "A strong claim says what it can say, what it cannot say, where it applies, and what would change the conclusion."
      ];
    } else if (clean === "scientificLawRoutePath") {
      beats = [
        "The Scientific Route keeps a claim from jumping straight from impression to authority.",
        "Observe → Define → Measure → Compare → Revise → Limit.",
        "That route is how confidence learns to answer to reality."
      ];
    } else if (clean === "scientificLawLadderPath") {
      beats = [
        "The claim testing ladder shows maturity.",
        SCIENTIFIC_LAW.ladder,
        "The final step is not certainty. It is a bounded, testable, correctable claim."
      ];
    } else if (clean === "scientificLawTermsPath") {
      beats = [
        "The deeper terms are repeatability, falsifiability, calibration, uncertainty, causality, and model scope.",
        "They protect the estate from technical-sounding language that cannot survive reality."
      ];
    }

    return makeNode(
      clean,
      "scientificLaw",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      clean === "scientificLawPath" ? 1 : 2,
      beats,
      [
        say("Theory.", "scientificLawTheoryPath"),
        say("Evidence.", "scientificLawEvidencePath"),
        say("Measure.", "scientificLawMeasurePath"),
        say("Limits.", "scientificLawLimitsPath"),
        say("Claim testing ladder.", "scientificLawLadderPath"),
        say("Cross east to Frontier.", "frontierLawPath"),
        say("Return to prior topic.", "priorTopicReturnPath")
      ],
      ["scientificLaw", "laws", "gauges"]
    );
  }

  function makeGaugesNode() {
    return makeNode(
      "gaugesPath",
      "proof",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The West Gauge Room is the status room.",
        "It separates what is working, what is held, what is forming, and what should not be overclaimed.",
        "Truth needs instruments as well as language."
      ],
      [
        say("West Proof Chamber.", "scientificLawPath"),
        say("West Library.", "lawsPath"),
        say("West Mirror Desk.", "diagnosticPath"),
        say("South Window.", "mirrorlandPath")
      ],
      ["gauges", "laws", "scientificLaw"]
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
        "The West Mirror Desk is the estate’s public self-reflection chamber.",
        "It helps a visitor notice the difference between what they claim, what they choose, and what their behavior under pressure reveals.",
        "In the current version, it is local-only. It does not store, email, archive, or save the result.",
        "If you want that reflection to become narrative, use the Character Archetype Mirror."
      ],
      [
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        say("Show my behavior under pressure.", "selfLearningPath"),
        say("Meet the Characters first.", "charactersPath"),
        say("North Inner Lane.", "underdogPath"),
        say("Summit Road.", "nineSummitsPath"),
        say("West Proof Chamber.", "scientificLawPath")
      ],
      ["coherenceDiagnostic", "characters", "aboutUnderdog"]
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
        "Then you should go north to the Source Hall.",
        "The estate has rooms, laws, worlds, and characters, but Sean is where the human pressure behind all of it becomes visible.",
        "Sean Mansfield is the writer, designer, and developer behind Diamond Gate Bridge.",
        "One of Sean’s governing lines is: “When you learn to live a life without expectations, you experience a life without limitations.”"
      ],
      [
        say("North Inner Lane.", "underdogPath"),
        say("Summit Road.", "nineSummitsPath"),
        say("West-South Mirror Bridge.", "characterArchetypeMirrorPath"),
        say("West Mirror Desk.", "diagnosticPath"),
        say("Northeast Market Hall.", "productsPath")
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
        "This Underdog is in the visitor too. It is the part of a person that carried pressure before it found language, direction, or use.",
        "The point is not to admire pressure. The point is to learn what your behavior under pressure has been trying to teach."
      ],
      [
        say("Show my behavior under pressure.", "selfLearningPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        say("West Mirror Desk.", "diagnosticPath"),
        say("North Source Hall.", "seanPath"),
        say("Summit Road.", "nineSummitsPath")
      ],
      ["aboutUnderdog", "coherenceDiagnostic", "nineSummits"]
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
        "The Northeast Market Hall is the practical public value wing.",
        "It is where a message becomes usable: something a visitor can carry, read, wear, give, return to, or use as a reminder.",
        "The estate should not only mean something. It should give the visitor a way to use what they found."
      ],
      [
        say("Book path.", "bookPath"),
        say("Summit Road.", "nineSummitsPath"),
        say("North Inner Lane.", "underdogPath"),
        say("North Source Hall.", "seanPath"),
        say("West Mirror Desk.", "diagnosticPath"),
        say("South Window.", "mirrorlandPath")
      ],
      ["products", "book", "coherenceDiagnostic"]
    );
  }

  function makeNineSummitsNode(id) {
    var clean = normalizeTarget(id);
    var beats = clean === "nineSummitsPath"
      ? [
        "Summit Road is the estate’s value path.",
        "The Nine Summits are not nine isolated slogans. They are a relational mountain range: each summit changes meaning depending on the others around it.",
        "The secret of life: learn to live to love, learn to love to laugh, learn to live to listen.",
        "Love without listening becomes projection. Laughter without love becomes cruelty. Vision without humility becomes manipulation. Purpose without love becomes performance."
      ]
      : [
        "The Nine Summits of Love is the book path inside the estate.",
        "It turns pressure, voice, coherence, love, and becoming into a human-development journey.",
        "A room can orient. A diagnostic can reflect. A book can walk with the reader."
      ];

    return makeNode(
      clean,
      "nineSummits",
      "book",
      "deepen",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      beats,
      [
        say("North Source Hall.", "seanPath"),
        say("North Inner Lane.", "underdogPath"),
        say("West-South Mirror Bridge.", "characterArchetypeMirrorPath"),
        say("West Mirror Desk.", "diagnosticPath"),
        say("Northeast Market Hall.", "productsPath")
      ],
      ["book", "nineSummits", "meetSean"]
    );
  }

  function makeMirrorlandNode(id) {
    var clean = normalizeTarget(id);
    var beats;

    if (clean === "atriumPath") {
      beats = [
        "The South Gate is the threshold into Mirrorland.",
        "This is where the estate begins to feel less like a site and more like a place.",
        "From here, I can take you to Audralia, Hearth, Frontier, or the Characters."
      ];
    } else if (clean === "atlasPath") {
      beats = [
        "The South Map Hall is where Mirrorland gains coordinates.",
        "It helps you choose what you are looking at: consequence, possibility, construction, systems, or people.",
        "If you want the future world, look toward Audralia. If you want the production chamber, open Hearth."
      ];
    } else if (clean === "mirrorMePath") {
      beats = [
        "Mirror Me is the reflective side of Mirrorland.",
        "The Diagnostic reflects how you answer. The Character Archetype Mirror reflects how you behave under pressure.",
        "Mirror Me belongs where reflection starts becoming story."
      ];
    } else {
      beats = [
        "Mirrorland is the South Window.",
        "The public estate lets a visitor read, look, and explore. Mirrorland lets the visitor step closer to the future as a lived place.",
        "The Characters are the people inside it. As the digital agents come online, the visitor will be able to communicate with them directly inside Mirrorland."
      ];
    }

    return makeNode(
      clean,
      "mirrorland",
      "mirrorland",
      "fork",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      1,
      beats,
      [
        say("South Gate.", "atriumPath"),
        say("South Map Hall.", "atlasPath"),
        say("Southeast Conservatory.", "audraliaPath"),
        say("East Construct Chamber.", "hearthPath"),
        say("East Yard.", "frontierPath"),
        say("South Character Lane.", "charactersPath"),
        say("Return to prior topic.", "priorTopicReturnPath")
      ],
      ["interactiveNarrative", "audralia", "hearth", "frontier", "characters"]
    );
  }

  function makeHearthNode(id) {
    var clean = normalizeTarget(id);
    var beats = [
      "Hearth is the East Construct Chamber.",
      "It is the planetary construct facility where world-formation logic becomes operational.",
      "Mirrorland reveals. Audralia carries. Frontier tests. Hearth constructs. Scientific Law verifies. The Characters carry the human cost."
    ];

    if (clean === "hearthFacilityPath") {
      beats = [
        "Hearth is the unknown-location facility.",
        "That matters because it prevents Hearth from being reduced to a simple public globe.",
        "It is the chamber where planetary construction logic is organized before the visitor fully understands where that chamber is."
      ];
    } else if (clean === "hearthConstructPath") {
      beats = [
        "Hearth is the planetary construct engine in the estate’s public canon.",
        "It is where world-formation logic becomes operational: structure, terrain, hydrology, surface behavior, motion, and the conditions that let a planet read as a constructed world.",
        "Hearth constructs. That is its governing verb."
      ];
    } else if (clean === "hearthFrontierPath") {
      beats = [
        "Hearth and Frontier are paired, but not identical.",
        "Frontier tests systems: energy, water, waste, infrastructure, signal, direction, and civic pressure.",
        "Hearth constructs the planetary condition those systems must eventually live inside."
      ];
    } else if (clean === "hearthLawPath") {
      beats = [
        "Hearth still answers to Scientific Law.",
        "A planetary construct can be imaginative, but the claims around it need theory, evidence, measurement, and limits.",
        "That is how Hearth stays disciplined instead of becoming only a visual idea."
      ];
    } else if (clean === "hearthProductionPath") {
      var exp = getExpression();
      if (exp && typeof exp.makeHearthProductionLine === "function") {
        beats = [
          exp.makeHearthProductionLine(buildExpressionContext({ target: clean })),
          exp.makeCompassDeploymentLine(buildExpressionContext({ target: clean })),
          exp.makeEndpointShortcutLine(buildExpressionContext({ target: clean }))
        ];
      } else {
        beats = [
          "We are in the Hearth Production Chamber right now.",
          "This is where the Jeeves template is being stabilized before Compass receives it.",
          "The purpose is not only to make a page talk, but to let visitors enter the estate through conversation."
        ];
      }
    }

    return makeNode(
      clean,
      clean === "hearthProductionPath" ? "hearthProduction" : "hearth",
      "hearth",
      "reveal",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      2,
      beats,
      [
        say("Hearth as facility.", "hearthFacilityPath"),
        say("Planetary construct engine.", "hearthConstructPath"),
        say("Hearth and Frontier.", "hearthFrontierPath"),
        say("Hearth and Scientific Law.", "hearthLawPath"),
        say("Hearth Production Chamber.", "hearthProductionPath"),
        say("Southeast Conservatory.", "audraliaPath"),
        say("South Character Lane.", "charactersPath")
      ],
      ["hearth", "frontier", "scientificLaw"]
    );
  }

  function makeZiontsNode() {
    return makeNode(
      "ziontsPath",
      "mirrorland",
      "mirrorland",
      "reveal",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      2,
      [
        "ZIONTS is Southwest Consequence Road.",
        "It exists so the future cannot be treated as only possibility.",
        "Audralia shows constructive future. ZIONTS reminds the visitor what happens when truth, systems, and responsibility fail."
      ],
      [
        say("Southeast Conservatory.", "audraliaPath"),
        say("West Proof Chamber.", "scientificLawPath"),
        say("East Yard.", "frontierPath"),
        say("Meet Soren.", "characterSorenPath")
      ],
      ["zionts", "audralia", "scientificLaw"]
    );
  }

  function makeAudraliaNode(id) {
    var clean = normalizeTarget(id);
    var beats;

    if (clean === "audraliaWorldroomPath") {
      beats = [
        "The East-South Worldroom is where Audralia becomes visible enough to inspect.",
        "It is not merely a picture of a world. It is the place where a future-world body starts to become legible.",
        "From there, the East Control Deck can help you read the state."
      ];
    } else if (clean === "controlCockpitPath") {
      beats = [
        "The East Control Deck is where Audralia becomes readable as state.",
        "A world needs visible controls, readouts, and disposition before the visitor can understand what is changing.",
        "It is the difference between looking at a world and learning how to read it."
      ];
    } else {
      beats = [
        "Audralia is the Southeast Conservatory.",
        "It gives Mirrorland terrain, scale, and consequence.",
        "Hearth is where construction logic becomes operational. Frontier tests the systems Audralia may need. The Characters make those systems personal."
      ];
    }

    return makeNode(
      clean,
      "audralia",
      "audralia",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      beats,
      [
        say("East-South Worldroom.", "audraliaWorldroomPath"),
        say("East Control Deck.", "controlCockpitPath"),
        say("East Yard.", "frontierPath"),
        say("East Construct Chamber.", "hearthPath"),
        say("South Character Lane.", "charactersPath"),
        say("West Proof Chamber.", "scientificLawPath")
      ],
      ["audralia", "audraliaWorldroom", "controlCockpit", "frontier", "hearth"]
    );
  }

  function makeFrontierNode(id, systemKey) {
    var clean = normalizeTarget(id);
    var system = systemKey ? FRONTIER_SYSTEMS[systemKey] : null;
    var beats;

    if (clean === "frontierLawPath") {
      beats = [
        "Scientific Law keeps Frontier from becoming fantasy language.",
        "Frontier can imagine future systems, but Scientific Law asks whether each claim is defined, evidenced, measured, compared, revised, and limited.",
        "That is why Energy cannot pretend fusion is solved, Waste cannot hide downstream cost, and Closed Loop cannot claim closure without audit return."
      ];
    } else if (clean === "frontierCharactersPath") {
      beats = [
        "Frontier becomes more readable when you meet the Characters.",
        "Tarian belongs naturally to Water. Soren belongs to Waste and Boundary. Alaric belongs to Trajectory. Elara belongs to Shimmer and Vision. Dextrion belongs to Energy and repair readiness.",
        "Frontier tests systems. The Characters show how people behave under the pressure those systems create."
      ];
    } else if (system) {
      beats = [
        system.name + " — " + system.status + ".",
        system.text,
        system.character + " is the character closest to this system.",
        "This is a Frontier pressure test, not a claim that the future system is finished."
      ];
    } else {
      beats = [
        "Frontier is the East Yard.",
        "It is where the future becomes testable: energy, water, waste, feedback, infrastructure, lattice, urban pressure, manuals, signals, trajectory, and vision.",
        "If Mirrorland is the window, Frontier is where the future starts answering practical questions."
      ];
    }

    return makeNode(
      clean,
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
        say("Scientific Law boundary.", "frontierLawPath"),
        say("Hearth and Frontier.", "hearthFrontierPath"),
        say("Meet the Characters through Frontier.", "frontierCharactersPath")
      ],
      system ? [system.route, "frontier"] : ["frontier", "audralia", "hearth"]
    );
  }

  function makeCharactersNode(id) {
    var clean = normalizeTarget(id);
    var exp = getExpression();
    var completion = exp && typeof exp.makeCharacterCompletionCue === "function"
      ? exp.makeCharacterCompletionCue(buildExpressionContext({ target: clean }))
      : { beats: [], options: [] };
    var completionBeats = state.visitor.characterCompletionPromptShown ? [] : (completion.beats || []);
    var completionOptions = completion.options || [];

    if (completionBeats.length) {
      state.visitor.characterCompletionPromptShown = true;
    }

    if (clean === "characterRelationshipsPath") {
      return makeNode(
        clean,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "The relationships are not decorative. They are pressure lines.",
          "Auren and Jeeves meet where protection needs permission. Alaric and Tarian meet where warning has to survive the body. Elara and Soren meet where possibility has to answer hidden cost. Dextrion and Soren meet where repair has to face proof."
        ].concat(completionBeats),
        [
          say("Meet Auren Vale.", "characterAurenValePath"),
          say("Meet Dextrion.", "characterDextrionPath"),
          say("Meet Alaric.", "characterAlaricPath"),
          say("Meet Tarian.", "characterTarianPath"),
          say("Meet Elara.", "characterElaraPath"),
          say("Meet Soren.", "characterSorenPath"),
          say("Character Archetype Mirror.", "characterArchetypeMirrorPath")
        ].concat(completionOptions),
        ["characters", "mirrorland"]
      );
    }

    if (clean === "characterTensionsPath") {
      return makeNode(
        clean,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Their conflict is not only good against evil.",
          "It is memory against denial, survival against consequence, voice against silence, and choice against pressure.",
          "The Characters matter because they turn future systems into lived cost."
        ].concat(completionBeats),
        [
          say("Show relationships.", "characterRelationshipsPath"),
          say("Who should I meet first?", "characterFirstPath"),
          say("Character Archetype Mirror.", "characterArchetypeMirrorPath"),
          say("Enter Mirrorland.", "mirrorlandPath")
        ].concat(completionOptions),
        ["characters", "mirrorland"]
      );
    }

    if (clean === "characterFirstPath") {
      return makeNode(
        clean,
        "characters",
        "characters",
        "route",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Start with the behavior you want to understand.",
          "If you want protection, meet Auren. If you want repair, meet Dextrion. If you want warning, meet Alaric. If you want endurance, meet Tarian. If you want signal, meet Elara. If you want truth and boundary, meet Soren. If you want guided sequence, stay with Jeeves. If you want survival beyond the safe center, meet the Remote Team."
        ].concat(completionBeats),
        [
          say("Meet Auren Vale.", "characterAurenValePath"),
          say("Meet Dextrion.", "characterDextrionPath"),
          say("Meet Alaric.", "characterAlaricPath"),
          say("Meet Tarian.", "characterTarianPath"),
          say("Meet Elara.", "characterElaraPath"),
          say("Meet Soren.", "characterSorenPath"),
          say("Tell me about Jeeves.", "characterJeevesPath"),
          say("Meet the Remote Team.", "characterRemoteTeamPath")
        ].concat(completionOptions),
        ["characters", "mirrorland"]
      );
    }

    if (exp && typeof exp.makeCharacterOverview === "function") {
      var result = exp.makeCharacterOverview(buildExpressionContext({ target: clean }));
      result.beats = (result.beats || []).concat(completionBeats);
      result.options = (result.options || []).concat(completionOptions);
      return nodeFromExpressionResult(clean, "characters", "characters", "personalize", SCOPE_NARRATIVE, MODE_IMMERSION, 1, result, ["characters", "mirrorland"]);
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
        "The Characters are where Mirrorland starts breathing.",
        "Auren Vale protects the manor, Dextrion carries the crossing, Alaric reads danger early, Tarian keeps survival physical, Elara makes the future visible, Soren refuses hidden damage, Jeeves sequences truth, and the Remote Team carries survival beyond the manor."
      ].concat(completionBeats),
      [
        say("Who are the Characters?", "characterIdentityPath"),
        say("Meet Auren Vale.", "characterAurenValePath"),
        say("Meet Dextrion.", "characterDextrionPath"),
        say("Meet Alaric.", "characterAlaricPath"),
        say("Meet Tarian.", "characterTarianPath"),
        say("Meet Elara.", "characterElaraPath"),
        say("Meet Soren.", "characterSorenPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath")
      ].concat(completionOptions),
      ["characters", "mirrorland"]
    );
  }

  function makeCharacterFallbackNode(id, characterId) {
    var exp = getExpression();
    var profile = exp && exp.characterProfiles ? exp.characterProfiles[characterId] : null;

    if (!profile) return makeCharactersNode("charactersPath");

    return makeNode(
      id,
      "characters",
      "characters",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      [
        profile.name + " — " + profile.title + ".",
        profile.oneLine,
        profile.pressureLine,
        profile.profileLine
      ],
      [
        say("Show how the Characters relate.", "characterRelationshipsPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        say("Meet another Character.", "charactersPath"),
        say("Enter Mirrorland.", "mirrorlandPath"),
        control("Choose the next door.", "cleanDoor")
      ],
      ["characters", "mirrorland"]
    );
  }

  function makeCharacterArchetypeIntroFallback() {
    return makeNode(
      "characterArchetypeMirrorPath",
      "characterArchetype",
      "diagnostic",
      "personalize",
      SCOPE_OBJECTIVE,
      MODE_CHARACTER_ARCHETYPE,
      1,
      [
        "We can use the Character Archetype Mirror.",
        "It does not tell you who you are. It looks at how you tend to behave under pressure, then shows which character pattern you are currently following.",
        "This is reflection, not identity."
      ],
      [
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeQuestionOne"),
        say("Show my behavior under pressure.", "characterArchetypeQuestionOne"),
        say("Meet the Characters first.", "charactersPath"),
        say("Return to prior topic.", "priorTopicReturnPath"),
        say("Return to origin conversation.", "originReturnPath")
      ],
      ["coherenceDiagnostic", "characters"]
    );
  }

  function makeArchetypeQuestionNode(index) {
    var exp = getExpression();
    var result;

    if (exp && typeof exp.makeCharacterArchetypeQuestion === "function") {
      result = exp.makeCharacterArchetypeQuestion(index, buildExpressionContext({ target: "characterArchetypeQuestion" + index }));
      return nodeFromExpressionResult(
        index === 1 ? "characterArchetypeQuestionOne" : index === 2 ? "characterArchetypeQuestionTwo" : "characterArchetypeQuestionThree",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        index,
        result,
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (index === 2) {
      return makeNode(
        "characterArchetypeQuestionTwo",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        2,
        ["Second question.", "When the pressure increases, what do you rely on next?"],
        [
          say("A clear sequence and controlled timing.", "characterArchetypeQuestionThree"),
          say("Visible action or repair.", "characterArchetypeQuestionThree"),
          say("Stability and continuity.", "characterArchetypeQuestionThree"),
          say("Evidence, contradiction, and proof.", "characterArchetypeQuestionThree")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (index === 3) {
      return makeNode(
        "characterArchetypeQuestionThree",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        3,
        ["Third question.", "What usually becomes your risk when the pressure gets too high?"],
        [
          say("I overprotect or hide too much.", "characterArchetypeResult"),
          say("I try to fix everything too fast.", "characterArchetypeResult"),
          say("I see danger before people believe me.", "characterArchetypeResult"),
          say("I keep carrying more than I can sustain.", "characterArchetypeResult"),
          say("I need the truth named before I can move.", "characterArchetypeResult")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    return makeNode(
      "characterArchetypeQuestionOne",
      "characterArchetype",
      "diagnostic",
      "personalize",
      SCOPE_OBJECTIVE,
      MODE_CHARACTER_ARCHETYPE,
      1,
      ["First question.", "When pressure rises, what do you usually notice first?"],
      [
        say("Who needs protection?", "characterArchetypeQuestionTwo"),
        say("What is broken and needs repair?", "characterArchetypeQuestionTwo"),
        say("Where danger is forming early.", "characterArchetypeQuestionTwo"),
        say("What the body or situation can actually endure.", "characterArchetypeQuestionTwo"),
        say("What truth or hidden cost is being avoided.", "characterArchetypeQuestionTwo")
      ],
      ["coherenceDiagnostic", "characters"]
    );
  }

  function makeArchetypeResultNode() {
    var match = computeLocalCharacterArchetype();
    var top = match[0];
    var second = match[1];
    var exp = getExpression();
    var profiles = exp && exp.characterProfiles ? exp.characterProfiles : {};
    var topProfile = top ? profiles[top.id] : null;
    var secondProfile = second ? profiles[second.id] : null;

    if (!top || !topProfile) {
      return makeNode(
        "characterArchetypeResult",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        3,
        [
          "I do not have enough signal to name a clean Character Archetype yet.",
          "That is not a failure. It means the mirror needs clearer answers.",
          "Take the Coherence Diagnostic if you want a stronger read."
        ],
        [
          say("Ask the first archetype question again.", "characterArchetypeQuestionOne"),
          say("Take the Coherence Diagnostic.", "diagnosticPath"),
          say("Meet the Characters first.", "charactersPath"),
          control("Re-center me.", "recenterNode")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    return makeNode(
      "characterArchetypeResult",
      "characterArchetype",
      "diagnostic",
      "close",
      SCOPE_OBJECTIVE,
      MODE_CHARACTER_ARCHETYPE,
      3,
      [
        "Your current Character Archetype under pressure is closest to " + topProfile.name + ".",
        "That does not mean you are " + topProfile.name + ". It means your answers follow a similar behavior pattern when pressure rises.",
        topProfile.oneLine,
        secondProfile ? "Your secondary pattern is closest to " + secondProfile.name + "." : "The secondary pattern is not strong enough to name cleanly yet."
      ],
      [
        say("Show why this archetype appeared.", topProfile.target),
        secondProfile ? say("Show the secondary pattern.", secondProfile.target) : say("Ask another archetype question.", "characterArchetypeQuestionOne"),
        say("Take the full Diagnostic.", "diagnosticPath"),
        say("Connect this to Nine Summits.", "nineSummitsPath"),
        say("Meet all the Characters.", "charactersPath"),
        say("Enter Mirrorland.", "mirrorlandPath")
      ],
      ["characters", "coherenceDiagnostic", "nineSummits", "mirrorland"]
    );
  }

  function computeLocalCharacterArchetype() {
    var answers = state.visitor.characterArchetypeAnswers.join(" ").toLowerCase();
    var scores = {
      aurenVale: 0,
      dextrion: 0,
      alaric: 0,
      tarian: 0,
      elara: 0,
      soren: 0,
      jeeves: 0,
      remoteTeam: 0
    };

    function add(id, words, weight) {
      words.forEach(function eachWord(word) {
        if (answers.indexOf(word) !== -1) scores[id] += weight;
      });
    }

    add("aurenVale", ["protect", "shelter", "safe", "hide", "overprotect"], 2);
    add("dextrion", ["repair", "fix", "broken", "fast"], 2);
    add("alaric", ["danger", "early", "warning", "believe"], 2);
    add("tarian", ["body", "endure", "sustain", "carry"], 2);
    add("elara", ["hope", "visible", "signal"], 2);
    add("soren", ["truth", "hidden cost", "evidence", "proof"], 2);
    add("jeeves", ["sequence", "timing", "manage", "truth"], 2);
    add("remoteTeam", ["team", "field", "public", "beyond"], 2);

    return Object.keys(scores)
      .map(function toRow(id) {
        return { id: id, score: scores[id] };
      })
      .filter(function hasScore(row) {
        return row.score > 0;
      })
      .sort(function sortScore(a, b) {
        return b.score - a.score || a.id.localeCompare(b.id);
      })
      .slice(0, 3);
  }

  function isBackendEligible(target, settings) {
    var clean = normalizeTarget(target);

    if (!state.brain.enabled) return false;
    if (settings && settings.noBrain) return false;
    if (LOCAL_FINAL_TARGETS.indexOf(clean) !== -1) return false;

    return true;
  }

  function shouldAskBrainBeforeLocal(target) {
    var clean = normalizeTarget(target);

    return (
      clean.indexOf("scientificLaw") === 0 ||
      clean.indexOf("frontier") === 0 ||
      clean === "proofPath" ||
      clean === "lawsPath"
    );
  }

  function buildBrainPayload(target, choice) {
    var clean = normalizeTarget(target);
    var room = getRoomDescriptorForTarget(clean);

    return {
      visitorText: choice && choice.label ? choice.label : "",
      currentNode: clean,
      currentEntry: state.currentTopic,
      currentPath: state.currentTopic,
      currentScopeLane: state.currentScopeLane,
      currentVoiceMode: state.currentVoiceMode,
      currentRoomId: room.id,
      currentRoomName: room.canonicalName || room.name || "",
      currentCoordinateName: room.coordinateName || "",
      currentCardinal: room.cardinal || "",
      currentPlaceType: room.placeType || "",
      originAnchor: state.originAnchor,
      originConversation: state.originConversation,
      priorTopic: state.priorTopic,
      returnStack: state.returnStack.slice(-8),
      branchStack: state.branchStack.slice(-8),
      availableBridges: room.bridgeRooms || [],
      availableRoads: room.nearRooms || [],
      expressionContract: expressionReady() ? getExpression().contract : "",
      visitorPosture: state.currentPosture,
      movement: choice && choice.signal ? choice.signal : "",
      pathDepth: state.currentDepth,
      loopCount: state.visitor.loopCount,
      routeReadiness: state.visitor.routeReadiness,
      allowedTargets: APPROVED_TARGETS.slice(),
      allowedRoutes: Object.keys(DEFAULT_ROUTES),
      sessionTrail: state.visitor.trail.map(function trailToString(item) {
        return item.topic + ":" + item.node + ":" + item.label;
      }),
      roomTrail: state.visitor.roomTrail.slice(),
      requestedMode: state.currentVoiceMode,
      characterArchetypeAnswers: state.visitor.characterArchetypeAnswers.slice(),
      registryContext: {
        id: state.currentTopic,
        summary: state.visitor.lastItch,
        routes: state.currentRouteHandoffs,
        targets: [],
        room: room
      }
    };
  }

  async function requestJeevesBrain(target, choice) {
    var controller;
    var timeout;
    var payload;
    var response;
    var data;

    if (!state.brain.endpoint) return null;

    payload = buildBrainPayload(target, choice);
    state.brain.lastRequest = safeClone(payload);
    state.brain.lastStatus = "pending";

    controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    if (controller) {
      timeout = window.setTimeout(function abortBrain() {
        try {
          controller.abort();
        } catch (_error) {
          /* Non-critical. */
        }
      }, state.brain.timeoutMs);
    }

    try {
      response = await fetch(state.brain.endpoint, {
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

      data = await response.json();

      state.brain.lastResponse = safeClone(data);
      state.brain.lastStatus = data && data.ok ? "ok" : "fallback";

      return normalizeBrainResponse(data, target);
    } catch (_error) {
      if (timeout) window.clearTimeout(timeout);
      state.brain.lastStatus = "unavailable";
      return null;
    }
  }

  function normalizeBrainResponse(data, target) {
    var cleanTarget = normalizeTarget(target);
    var room = getRoomDescriptorForTarget(cleanTarget);
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

    return makeNode(
      cleanTarget,
      data.nextTopic || state.currentTopic,
      state.currentPosture,
      data.conclusiveState === "complete" ? "close" : state.currentPhase,
      data.suggestedMode === "immersion" || data.suggestedMode === "threshold" ? SCOPE_NARRATIVE : state.currentScopeLane,
      data.suggestedMode || state.currentVoiceMode,
      state.currentDepth,
      data.bubbles.slice(0, 4),
      options.map(function normalizeOption(item) {
        return {
          label: item.label,
          target: normalizeTarget(item.target),
          type: item.type || "conversation",
          scopeLane: item.scopeLane || null,
          signal: data.intent || ""
        };
      }),
      handoffs.map(normalizeRouteId).filter(Boolean),
      {
        roomId: room.id,
        source: data.source || "backbrain"
      }
    );
  }

  function updateCurrentState(nodeId, node, choice, settings) {
    var cleanNode = normalizeTarget(nodeId);

    if (!settings || !settings.isReturnPreview) {
      updateArchetypeAnswers(choice, state.currentNode);
    }

    state.previousNode = state.currentNode;
    state.currentNode = cleanNode;
    state.currentTopic = node.topic || TARGET_TOPIC_MAP[cleanNode] || "orientation";
    state.currentPosture = node.posture || "orientation";
    state.currentPhase = node.phase || "ground";
    state.currentScopeLane = node.scopeLane || SCOPE_OBJECTIVE;
    state.currentVoiceMode = node.voiceMode || MODE_OBJECTIVE;
    state.currentDepth = node.depth || 0;
    state.currentRouteHandoffs = (node.handoffs || []).slice();

    setCurrentRoomFromNode(node);
    updateVisitor(choice, node);

    if (state.currentTopic !== "return" && state.currentTopic !== "origin") {
      state.lastStableNode = cleanNode;
    }

    state.history.push({
      node: state.currentNode,
      topic: state.currentTopic,
      posture: state.currentPosture,
      phase: state.currentPhase,
      scopeLane: state.currentScopeLane,
      voiceMode: state.currentVoiceMode,
      depth: state.currentDepth,
      itch: state.visitor.lastItch,
      roomId: state.currentRoomId,
      roomName: state.currentRoomName,
      coordinateName: state.currentCoordinateName,
      cardinal: state.currentCardinal,
      placeType: state.currentPlaceType
    });

    while (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }

    setDocumentState();
  }

  async function runNode(nodeId, settings) {
    var token;
    var node;
    var localNode;
    var brainNode;
    var choice;
    var completed;
    var cleanNode = normalizeTarget(nodeId);

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    choice = settings && settings.choice ? settings.choice : null;

    if (!settings || !settings.skipReturnPush) {
      if (choice && cleanNode !== "priorTopicReturnPath" && cleanNode !== "originReturnPath") {
        pushReturnPoint(cleanNode, choice);
      }
    }

    localNode = getNode(cleanNode, choice);

    updateCurrentState(cleanNode, localNode, choice, settings || {});
    hideOptions();

    if (isBackendEligible(cleanNode, settings) && shouldAskBrainBeforeLocal(cleanNode)) {
      brainNode = await requestJeevesBrain(cleanNode, choice);
      node = brainNode && brainNode.beats && brainNode.beats.length ? brainNode : localNode;
    } else {
      node = localNode;
    }

    if (node !== localNode) {
      updateCurrentState(cleanNode, node, choice, { isReturnPreview: true });
    }

    await waitFixed(settings && settings.fast ? PACING.firstMessageDelayMs : 260);

    if (token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    completed = await playBeats(node.beats || [], token, node.source || "frontbrain");

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

  function resetState() {
    state.currentNode = DEFAULT_ORIGIN_NODE;
    state.previousNode = "";
    state.currentTopic = "origin";
    state.currentPosture = "arrival";
    state.currentPhase = "receive";
    state.currentScopeLane = SCOPE_OBJECTIVE;
    state.currentVoiceMode = MODE_OBJECTIVE;
    state.currentDepth = 0;
    state.currentRouteHandoffs = [];
    state.currentRoomId = DEFAULT_CURRENT_ROOM_ID;
    state.currentRoomName = "Hearth Production Chamber";
    state.currentCoordinateName = "East Construct Chamber";
    state.currentCardinal = "E";
    state.currentPlaceType = "chamber";
    state.originAnchor = DEFAULT_ORIGIN_ANCHOR;
    state.originConversation = {
      node: DEFAULT_ORIGIN_NODE,
      topic: "origin",
      roomId: DEFAULT_CURRENT_ROOM_ID,
      coordinateName: "East Construct Chamber"
    };
    state.priorTopic = null;
    state.priorNode = "";
    state.lastStableNode = DEFAULT_ORIGIN_NODE;
    state.returnStack = [];
    state.branchStack = [];
    state.topicStack = [];

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
    state.visitor.roomTrail = [];
    state.visitor.characterArchetypeAnswers = [];
    state.visitor.characterProfileViews = [];
    state.visitor.characterRelationshipViews = 0;
    state.visitor.characterCompletionReadiness = 0;
    state.visitor.characterCompletionPromptShown = false;
    state.visitor.lastCharacterViewed = "";
    state.visitor.lastBrainIntent = "";
    state.visitor.lastBrainCanonStatus = "";
    state.visitor.lastBrainConclusiveState = "";

    state.history = [];
  }

  function exposeApi() {
    global.HEARTH = global.HEARTH || {};
    global.HEARTH.JEEVES = global.HEARTH.JEEVES || {};

    global.HEARTH.JEEVES.frontbrain = {
      contract: CONTRACT,
      route: ROUTE,
      brainEndpoint: state.brain.endpoint,
      state: state,
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      requestJeevesBrain: requestJeevesBrain,
      tapAdvance: requestTapAdvance,
      renderOptions: renderOptions,
      setPromptVisible: setPromptVisible,
      isNarrativeTarget: isNarrativeTarget,
      getExpression: getExpression,
      expressionReady: expressionReady,
      getRoomDescriptor: function getRoomDescriptorPublic(roomId) {
        return safeClone(getRoomDescriptor(roomId));
      },
      getRoomDescriptorForTarget: function getRoomDescriptorForTargetPublic(target) {
        return safeClone(getRoomDescriptorForTarget(target));
      },
      getElements: function getElements() {
        return els;
      },
      getState: function getState() {
        return safeClone(state);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id, null));
      },
      getCharacterArchetypeAnswers: function getCharacterArchetypeAnswers() {
        return state.visitor.characterArchetypeAnswers.slice();
      },
      resetCharacterArchetype: function resetCharacterArchetype() {
        state.visitor.characterArchetypeAnswers = [];
      },
      getCharacterMirrorAnswers: function getCharacterMirrorAnswers() {
        return state.visitor.characterArchetypeAnswers.slice();
      },
      resetCharacterMirror: function resetCharacterMirror() {
        state.visitor.characterArchetypeAnswers = [];
      },
      getCharacterCompletionState: function getCharacterCompletionState() {
        return {
          views: state.visitor.characterProfileViews.slice(),
          relationshipViews: state.visitor.characterRelationshipViews,
          readiness: state.visitor.characterCompletionReadiness,
          promptShown: state.visitor.characterCompletionPromptShown,
          lastCharacterViewed: state.visitor.lastCharacterViewed
        };
      },
      returnToPriorTopic: function returnToPriorTopic() {
        runNode("priorTopicReturnPath", { skipReturnPush: true });
      },
      returnToOriginConversation: function returnToOriginConversation() {
        runNode("originReturnPath", { skipReturnPush: true });
      }
    };

    global.HEARTH.JEEVES.engine = global.HEARTH.JEEVES.frontbrain;
    global.JEEVES_ENGINE = global.HEARTH.JEEVES.frontbrain;
    global.__HEARTH_JEEVES_FRONTBRAIN_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
    global.__HEARTH_JEEVES_ENGINE_ROUTE__ = ROUTE;
  }

  function init() {
    var initialNode;
    var initialRoom;

    if (state.initialized) return;

    config = readConfig();
    collectElements();
    getExpression();

    if (!els.thread || !els.promptGrid) {
      return;
    }

    if (config && config.brainEndpoint) {
      state.brain.endpoint = String(config.brainEndpoint);
    }

    if (config && config.currentRoomId) {
      initialRoom = getRoomDescriptor(config.currentRoomId);
      if (initialRoom) {
        state.currentRoomId = initialRoom.id;
        state.currentRoomName = initialRoom.canonicalName || initialRoom.name || "";
        state.currentCoordinateName = initialRoom.coordinateName || "";
        state.currentCardinal = initialRoom.cardinal || "";
        state.currentPlaceType = initialRoom.placeType || "";
        state.originConversation.roomId = initialRoom.id;
        state.originConversation.coordinateName = initialRoom.coordinateName || "";
      }
    }

    clearSeedMessage();
    bindRestore();
    bindTapAdvance();
    exposeApi();
    setDocumentState();

    state.initialized = true;

    initialNode = normalizeTarget(config.initialNode || DEFAULT_ORIGIN_NODE);
    runNode(initialNode, { fast: true, noBrain: true, skipReturnPush: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
