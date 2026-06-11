// /api/jeeves.js
// HEARTH_JEEVES_BACKBRAIN_NORTH_CONVERSATIONAL_ENGINE_ROUTE_ACCEPTANCE_TNT_v5_3
// Full-file replacement.
// Server-side only.
// North / Backbrain coordinator.
// Purpose:
// - Merge v5.2 route-acceptance proof shell with the deeper v5.1 conversational engine.
// - Align API/North with Expression v5.3 and Frontbrain v25.4.
// - Preserve guided entrance, split-interface bridge logic, room registries, approved memory,
//   deterministic fallback, optional model engine, response guard, and diagnostic boundary.
// - Accept GET/HEAD for live route health proof.
// - Accept OPTIONS for preflight.
// - Accept POST for conversation.
// - Keep Jeeves as guide / host / narrator / concierge / estate interpreter.
// - Jeeves may explain and route to the Coherence Diagnostic.
// - Jeeves does not assess, score, classify, diagnose, or decide which archetype / Character fits the visitor.
// Does not own:
// - front-end DOM
// - CSS
// - HTML
// - browser API keys
// - route rendering
// - visual pacing
// - tap-to-advance
// - Expression transition language
// - final route execution
//

"use strict";

const CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_CONVERSATIONAL_ENGINE_ROUTE_ACCEPTANCE_TNT_v5_3";
const PREVIOUS_CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_GUIDED_ENTRANCE_ROUTE_ACCEPTANCE_TNT_v5_2";
const ROOT_CONVERSATION_CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_SPLIT_INTERFACE_GUIDED_PATH_STANDARD_TNT_v5_1";
const EXPRESSION_CONTRACT_TARGET = "HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_GUIDED_ENTRANCE_TNT_v5_3";
const FRONTBRAIN_CONTRACT_TARGET = "HEARTH_JEEVES_FRONTBRAIN_GUIDED_ENTRANCE_EXPRESSION_CONNECTOR_TNT_v25_4";

const DEFAULT_MODEL = process.env.JEEVES_MODEL || "gpt-5.5";
const MODERATION_MODEL = process.env.JEEVES_MODERATION_MODEL || "omni-moderation-latest";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ALLOWED_ORIGIN = process.env.JEEVES_ALLOWED_ORIGIN || "";

const MAX_INPUT_CHARS = 2400;
const MAX_CONTEXT_ITEMS = 18;
const MAX_BUBBLES = 4;
const MAX_OPTIONS = 6;
const MAX_HANDOFFS = 6;
const MAX_TRAIL_ITEMS = 24;

const DEPTH_INTRO = "intro";
const DEPTH_INTERMEDIATE = "intermediate";
const DEPTH_DEEP = "deep";

const REQUEST_MODES = Object.freeze([
  "freeform",
  "node_enrichment",
  "route_explanation",
  "character_archetype",
  "recenter"
]);

const PROMPT_MODES = Object.freeze([
  "story_prompt",
  "skeptic_prompt",
  "practical_prompt",
  "personal_prompt",
  "progression_prompt",
  "recenter_prompt",
  "unknown_prompt"
]);

const OPTION_KINDS = Object.freeze([
  "conversation_prompt",
  "forward",
  "return",
  "parallel",
  "route",
  "control"
]);

const ARCHETYPE_ALIGNMENTS = Object.freeze([
  "story_entry",
  "proof_entry",
  "practical_entry",
  "personal_entry",
  "source_entry",
  "boundary_entry",
  "systems_entry",
  "unknown_entry"
]);

const BRIDGE_MOMENTS = Object.freeze([
  "entrance_fork",
  "before_knowledge",
  "after_knowledge",
  "return_fork",
  "parallel_crossing",
  "recenter_fork",
  "prepared_door",
  "none"
]);

const MOVEMENT_INTENTS = Object.freeze([
  "ask_jeeves",
  "continue_current_path",
  "return_one_threshold",
  "cross_to_related_room",
  "open_prepared_door",
  "recenter",
  "unknown"
]);

const INTENTS = Object.freeze([
  "diamondGate",
  "guidedEntrance",
  "splitInterface",
  "traditionalWebsite",
  "narrativePath",
  "mission",
  "practicalRelevance",
  "orientation",
  "blueprint",
  "proof",
  "laws",
  "scientificLaw",
  "gauges",
  "frontier",
  "hearth",
  "characters",
  "characterMirror",
  "diagnostic",
  "diagnosticReferral",
  "sean",
  "underdog",
  "summits",
  "route",
  "recenter",
  "mirrorland",
  "unknown"
]);

const CANON_STATUS = Object.freeze(["grounded", "limited", "fallback", "blocked"]);

const CONCLUSIVE_STATES = Object.freeze([
  "open",
  "complete",
  "route_ready",
  "switch_recommended",
  "needs_sharper_question"
]);

const SUGGESTED_MODES = Object.freeze([
  "objective",
  "threshold",
  "immersion",
  "diagnosticReferral"
]);

const AXIS_CENTER = "C";
const AXIS_NORTH = "N";
const AXIS_EAST = "E";
const AXIS_WEST = "W";
const AXIS_SOUTH = "S";
const AXIS_NORTHEAST = "NE";
const AXIS_SOUTHEAST = "SE";
const AXIS_SOUTHWEST = "SW";
const AXIS_WEST_SOUTH = "WS";
const AXIS_SOUTH_NORTH = "SN";

const TARGETS = Object.freeze({
  DIAMOND_GATE_OVERVIEW: "diamondGateOverviewPath",
  SPLIT_INTERFACE: "splitInterfaceBridgePath",
  TRADITIONAL_WEBSITE: "traditionalWebsiteOverviewPath",
  NARRATIVE_PATH: "narrativePathOverview",
  MISSION_OVERVIEW: "missionOverviewPath",
  MISSION_INNER: "missionInnerPath",
  MISSION_COMMUNITY: "missionCommunityPath",
  MISSION_COLLABORATION: "missionCollaborationPath",
  PRACTICAL_RELEVANCE: "practicalRelevancePath",
  DIAGNOSTIC_REFERRAL: "diagnosticReferralPath",
  DIAGNOSTIC: "diagnosticPath",
  CHARACTER_MIRROR: "characterMirrorPath",
  MIRRORLAND: "mirrorlandPath",
  ATRIUM: "atriumPath",
  ATLAS: "atlasPath",
  COMPASS: "compassPath",
  SITE_GUIDE: "siteGuidePath",
  PRODUCTS: "productsPath",
  LAWS: "lawsPath",
  SEAN: "seanPath",
  UNDERDOG: "underdogPath",
  HEARTH: "hearthPath",
  HEARTH_CONSTRUCT: "hearthConstructPath",
  HEARTH_FRONTIER: "hearthFrontierPath",
  HEARTH_LAW: "hearthLawPath",
  FRONTIER: "frontierPath",
  FRONTIER_SYSTEMS: "frontierSystemsPath",
  FRONTIER_ENERGY: "frontierEnergyPath",
  FRONTIER_WATER: "frontierWaterPath",
  FRONTIER_WASTE: "frontierWastePath",
  FRONTIER_CLOSED_LOOP: "frontierClosedLoopPath",
  FRONTIER_INFRASTRUCTURE: "frontierInfrastructurePath",
  FRONTIER_LATTICE: "frontierLatticePath",
  FRONTIER_URBAN: "frontierUrbanPath",
  FRONTIER_MANUAL: "frontierManualPath",
  FRONTIER_SHIMMER: "frontierShimmerPath",
  FRONTIER_TRAJECTORY: "frontierTrajectoryPath",
  FRONTIER_VISION: "frontierVisionPath",
  FRONTIER_LAW: "frontierLawPath",
  FRONTIER_CHARACTERS: "frontierCharactersPath",
  SCIENTIFIC_LAW: "scientificLawPath",
  SCIENTIFIC_LAW_THEORY: "scientificLawTheoryPath",
  SCIENTIFIC_LAW_EVIDENCE: "scientificLawEvidencePath",
  SCIENTIFIC_LAW_MEASURE: "scientificLawMeasurePath",
  SCIENTIFIC_LAW_LIMITS: "scientificLawLimitsPath",
  SCIENTIFIC_LAW_ROUTE: "scientificLawRoutePath",
  SCIENTIFIC_LAW_LADDER: "scientificLawLadderPath",
  SCIENTIFIC_LAW_TERMS: "scientificLawTermsPath",
  GAUGES: "gaugesPath",
  CHARACTERS: "charactersPath",
  CHARACTER_IDENTITY: "characterIdentityPath",
  CHARACTER_RELATIONSHIPS: "characterRelationshipsPath",
  CHARACTER_TENSIONS: "characterTensionsPath",
  CHARACTER_MOTIVES: "characterMotivesPath",
  CHARACTER_STORY_PRESSURE: "characterStoryPressurePath",
  CHARACTER_FIRST: "characterFirstPath",
  CHARACTER_AUREN: "characterAurenValePath",
  CHARACTER_DEXTRION: "characterDextrionPath",
  CHARACTER_ALARIC: "characterAlaricPath",
  CHARACTER_TARIAN: "characterTarianPath",
  CHARACTER_ELARA: "characterElaraPath",
  CHARACTER_SOREN: "characterSorenPath",
  CHARACTER_JEEVES: "characterJeevesPath",
  CHARACTER_REMOTE_TEAM: "characterRemoteTeamPath",
  NINE_SUMMITS: "nineSummitsPath",
  NINE_SUMMITS_BOOK: "nineSummitsBookPath",
  H_EARTH: "hEarthPath",
  ZIONTS: "ziontsPath",
  AUDRALIA: "audraliaPath",
  AUDRALIA_WORLDROOM: "audraliaWorldroomPath",
  CONTROL_COCKPIT: "controlCockpitPath",
  RECENTER: "recenterNode",
  LOOP_RECOVERY: "loopRecovery",
  CLEAN_DOOR: "cleanDoor",
  SWITCH_TOPICS: "switchTopics",
  SHARP_QUESTION: "sharpQuestion",
  RETURN_FORK: "returnFork",
  RESTART_FORK: "restartFork",
  PRIOR_TOPIC_RETURN: "priorTopicReturnPath",
  ORIGIN_RETURN: "originReturnPath"
});

const ROUTES = Object.freeze({
  COMPASS: "compass",
  HOME: "home",
  SITE_GUIDE: "siteGuide",
  COHERENCE_DIAGNOSTIC: "coherenceDiagnostic",
  MEET_SEAN: "meetSean",
  PRODUCTS: "products",
  LAWS: "laws",
  SCIENTIFIC_LAW: "scientificLaw",
  GAUGES: "gauges",
  SHOWROOM: "showroom",
  HEARTH: "hearth",
  MIRRORLAND: "mirrorland",
  ZIONTS: "zionts",
  AUDRALIA: "audralia",
  H_EARTH: "hEarth",
  FRONTIER: "frontier",
  FRONTIER_ENERGY: "frontierEnergy",
  FRONTIER_WATER: "frontierWater",
  FRONTIER_WASTE: "frontierWaste",
  FRONTIER_CLOSED_LOOP: "frontierClosedLoop",
  FRONTIER_INFRASTRUCTURE: "frontierInfrastructure",
  FRONTIER_LATTICE: "frontierLattice",
  FRONTIER_URBAN: "frontierUrban",
  FRONTIER_MANUAL: "frontierManual",
  FRONTIER_SHIMMER: "frontierShimmer",
  FRONTIER_TRAJECTORY: "frontierTrajectory",
  FRONTIER_VISION: "frontierVision",
  CHARACTERS: "characters",
  CONTROL_ROOM: "controlRoom",
  NINE_SUMMITS: "nineSummits",
  UNDERDOG: "aboutUnderdog"
});

const ROUTE_HINTS = Object.freeze({
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
  mirrorland: "/showroom/globe/",
  zionts: "/showroom/globe/earth/",
  audralia: "/showroom/globe/audralia/",
  hEarth: "/showroom/globe/h-earth/",
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
  nineSummits: "/nine-summits/",
  aboutUnderdog: "/about-this-underdog/"
});

const HANDOFF_LABELS = Object.freeze({
  compass: "Open the Compass",
  home: "Open the Public Entry",
  siteGuide: "Open the Traditional Website",
  coherenceDiagnostic: "Open the Coherence Diagnostic",
  meetSean: "Meet Sean",
  products: "Open Products",
  laws: "Open the Law Library",
  scientificLaw: "Open Scientific Law",
  gauges: "Open Triple G",
  showroom: "Open the Atrium",
  hearth: "Open Hearth",
  mirrorland: "Enter the Narrative Path",
  zionts: "Open ZIONTS",
  audralia: "Open Audralia",
  hEarth: "Open H-Earth",
  frontier: "Open the Frontier Playground",
  frontierEnergy: "Open Frontier Energy",
  frontierWater: "Open Frontier Water",
  frontierWaste: "Open Frontier Waste",
  frontierClosedLoop: "Open Closed Loop Systems",
  frontierInfrastructure: "Open Frontier Infrastructure",
  frontierLattice: "Open Frontier Lattice",
  frontierUrban: "Open Frontier Urban",
  frontierManual: "Open the Frontier Manual",
  frontierShimmer: "Open Frontier Shimmer",
  frontierTrajectory: "Open Frontier Trajectory",
  frontierVision: "Open Frontier Vision",
  characters: "Open the Characters Hall",
  controlRoom: "Open the Control Room",
  nineSummits: "Open Nine Summits",
  aboutUnderdog: "Open This Underdog"
});

const TARGET_ALIASES = Object.freeze({
  intro: TARGETS.DIAMOND_GATE_OVERVIEW,
  askFirst: TARGETS.SPLIT_INTERFACE,
  whereToStart: TARGETS.SPLIT_INTERFACE,
  guidedChooserPath: TARGETS.SPLIT_INTERFACE,
  startGuidePath: TARGETS.SPLIT_INTERFACE,
  chooseStartPath: TARGETS.SPLIT_INTERFACE,
  worldPath: TARGETS.MIRRORLAND,
  worldGatePath: TARGETS.ATRIUM,
  globeWindowPath: TARGETS.MIRRORLAND,
  worldGate: TARGETS.MIRRORLAND,
  characterArchetypeMirrorPath: TARGETS.CHARACTER_MIRROR,
  characterArchetypeQuestionOne: TARGETS.DIAGNOSTIC_REFERRAL,
  characterArchetypeQuestionTwo: TARGETS.DIAGNOSTIC_REFERRAL,
  characterArchetypeQuestionThree: TARGETS.DIAGNOSTIC_REFERRAL,
  characterArchetypeResult: TARGETS.DIAGNOSTIC_REFERRAL,
  characterMirrorQuestionOne: TARGETS.DIAGNOSTIC_REFERRAL,
  characterMirrorQuestionTwo: TARGETS.DIAGNOSTIC_REFERRAL,
  characterMirrorQuestionThree: TARGETS.DIAGNOSTIC_REFERRAL,
  characterMirrorResult: TARGETS.DIAGNOSTIC_REFERRAL,
  characterFactionsPath: TARGETS.CHARACTER_RELATIONSHIPS,
  bookPath: TARGETS.NINE_SUMMITS_BOOK,
  missionControlPath: TARGETS.HEARTH,
  hearthMissionControlPath: TARGETS.HEARTH,
  windowWithinWindowPath: TARGETS.HEARTH,
  hearthWindowPath: TARGETS.HEARTH,
  siteOverviewPath: TARGETS.DIAMOND_GATE_OVERVIEW,
  websiteOverviewPath: TARGETS.DIAMOND_GATE_OVERVIEW,
  websitePath: TARGETS.DIAMOND_GATE_OVERVIEW,
  traditionalPath: TARGETS.TRADITIONAL_WEBSITE,
  narrativeOverviewPath: TARGETS.NARRATIVE_PATH,
  missionPath: TARGETS.MISSION_OVERVIEW,
  practicalPath: TARGETS.PRACTICAL_RELEVANCE,
  mirrorMePath: TARGETS.DIAGNOSTIC_REFERRAL,
  selfLearningPath: TARGETS.DIAGNOSTIC_REFERRAL
});

const ROUTE_ALIASES = Object.freeze({
  worldGate: ROUTES.MIRRORLAND,
  globeWindow: ROUTES.MIRRORLAND,
  interactiveNarrative: ROUTES.MIRRORLAND,
  book: ROUTES.NINE_SUMMITS,
  traditionalWebsite: ROUTES.SITE_GUIDE,
  narrativePath: ROUTES.MIRRORLAND,
  frontierPlayground: ROUTES.FRONTIER
});

const DEFAULT_CONVERSATION_LABELS = Object.freeze({
  diamondGateOverviewPath: "What is DiamondGateBridge.com?",
  splitInterfaceBridgePath: "Can you help me choose where to start?",
  traditionalWebsiteOverviewPath: "What is the traditional website for?",
  narrativePathOverview: "What is the narrative path?",
  missionOverviewPath: "What is the mission behind this?",
  missionInnerPath: "What is the inner mission?",
  missionCommunityPath: "What is the community mission?",
  missionCollaborationPath: "How does the mission become practical?",
  practicalRelevancePath: "What can I actually do here?",
  diagnosticReferralPath: "Where can I take the alignment diagnostic?",
  diagnosticPath: "What is the Coherence Diagnostic?",
  characterMirrorPath: "What does the Character Mirror show?",
  mirrorlandPath: "What is Mirrorland?",
  atriumPath: "Where does the South Gate lead?",
  atlasPath: "What are the roads inside Mirrorland?",
  charactersPath: "Who are the Characters?",
  compassPath: "How does the Compass help me start?",
  siteGuidePath: "How does the traditional website work?",
  lawsPath: "What keeps this honest?",
  scientificLawPath: "What makes this trustworthy?",
  scientificLawTheoryPath: "What theory is being tested?",
  scientificLawEvidencePath: "What would count as evidence?",
  scientificLawMeasurePath: "How would this be measured?",
  scientificLawLimitsPath: "What could prove this wrong?",
  gaugesPath: "What is working, and what still needs proof?",
  seanPath: "Who is Sean Mansfield?",
  underdogPath: "What is This Underdog?",
  productsPath: "What can I actually do here?",
  nineSummitsPath: "What is the Nine Summits road?",
  nineSummitsBookPath: "What is The Nine Summits of Love?",
  hearthPath: "What is Hearth?",
  hearthConstructPath: "What is Hearth coordinating?",
  hearthFrontierPath: "How does Hearth connect to Frontier?",
  hearthLawPath: "Why does Hearth answer to proof?",
  hEarthPath: "What can still be saved?",
  ziontsPath: "What could go wrong here?",
  audraliaPath: "What is Audralia?",
  audraliaWorldroomPath: "What am I seeing in Audralia?",
  controlCockpitPath: "How does Audralia become readable?",
  frontierPath: "What is the Frontier Playground?",
  frontierSystemsPath: "Which system should I look at first?",
  frontierEnergyPath: "How does Energy work here?",
  frontierWaterPath: "How does Water work here?",
  frontierWastePath: "How does Waste work here?",
  frontierClosedLoopPath: "How does Closed Loop work here?",
  frontierInfrastructurePath: "How does Infrastructure work here?",
  frontierLatticePath: "How does Lattice work here?",
  frontierUrbanPath: "How does Urban work here?",
  frontierManualPath: "What does the Manual explain?",
  frontierShimmerPath: "What does Shimmer show?",
  frontierTrajectoryPath: "Where is this moving?",
  frontierVisionPath: "What is the horizon aim?",
  frontierLawPath: "Can this survive a real test?",
  frontierCharactersPath: "Who carries the pressure here?",
  characterIdentityPath: "Who are the Characters?",
  characterRelationshipsPath: "How are the Characters connected?",
  characterTensionsPath: "What conflict do they carry?",
  characterMotivesPath: "What motivates them?",
  characterStoryPressurePath: "Why do these Characters matter?",
  characterFirstPath: "Who should I meet first?",
  characterAurenValePath: "Who is Auren Vale?",
  characterDextrionPath: "Who is Dextrion?",
  characterAlaricPath: "Who is Alaric?",
  characterTarianPath: "Who is Tarian?",
  characterElaraPath: "Who is Elara?",
  characterSorenPath: "Who is Soren?",
  characterJeevesPath: "Who is Jeeves?",
  characterRemoteTeamPath: "Who is the Remote Team?",
  recenterNode: "Can you re-center me?",
  loopRecovery: "I keep circling this room. What should I do?",
  cleanDoor: "What is the cleanest next door?",
  switchTopics: "Can we change rooms?",
  sharpQuestion: "Can you ask me a sharper question?",
  returnFork: "Can we return to the First Fork?",
  restartFork: "Can we start over?",
  priorTopicReturnPath: "Can we return to the prior topic?",
  originReturnPath: "Can we return to where this started?"
});

const APPROVED_TARGETS = new Set(Object.values(TARGETS));
[
  TARGETS.SCIENTIFIC_LAW_THEORY,
  TARGETS.SCIENTIFIC_LAW_EVIDENCE,
  TARGETS.SCIENTIFIC_LAW_MEASURE,
  TARGETS.SCIENTIFIC_LAW_LIMITS,
  TARGETS.SCIENTIFIC_LAW_ROUTE,
  TARGETS.SCIENTIFIC_LAW_LADDER,
  TARGETS.SCIENTIFIC_LAW_TERMS,
  TARGETS.FRONTIER_ENERGY,
  TARGETS.FRONTIER_WATER,
  TARGETS.FRONTIER_WASTE,
  TARGETS.FRONTIER_CLOSED_LOOP,
  TARGETS.FRONTIER_INFRASTRUCTURE,
  TARGETS.FRONTIER_LATTICE,
  TARGETS.FRONTIER_URBAN,
  TARGETS.FRONTIER_MANUAL,
  TARGETS.FRONTIER_SHIMMER,
  TARGETS.FRONTIER_TRAJECTORY,
  TARGETS.FRONTIER_VISION,
  TARGETS.FRONTIER_LAW,
  TARGETS.FRONTIER_CHARACTERS,
  TARGETS.CHARACTER_IDENTITY,
  TARGETS.CHARACTER_RELATIONSHIPS,
  TARGETS.CHARACTER_TENSIONS,
  TARGETS.CHARACTER_MOTIVES,
  TARGETS.CHARACTER_STORY_PRESSURE,
  TARGETS.CHARACTER_FIRST,
  TARGETS.CHARACTER_AUREN,
  TARGETS.CHARACTER_DEXTRION,
  TARGETS.CHARACTER_ALARIC,
  TARGETS.CHARACTER_TARIAN,
  TARGETS.CHARACTER_ELARA,
  TARGETS.CHARACTER_SOREN,
  TARGETS.CHARACTER_JEEVES,
  TARGETS.CHARACTER_REMOTE_TEAM
].forEach((target) => APPROVED_TARGETS.add(target));

const APPROVED_ROUTE_IDS = new Set(Object.values(ROUTES));

const FORBIDDEN_PUBLIC_LANGUAGE = [
  { pattern: /\bscope lane\b/gi, replacement: "path" },
  { pattern: /\bregistry\b/gi, replacement: "guide" },
  { pattern: /\broute lane\b/gi, replacement: "path" },
  { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
  { pattern: /\bexpression payload\b/gi, replacement: "answer" },
  { pattern: /\bprogression state\b/gi, replacement: "step" },
  { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
  { pattern: /\bAPI\b/g, replacement: "deeper answer path" },
  { pattern: /\bDOM\b/g, replacement: "visible interface" },
  { pattern: /\bserver[-\s]?side\b/gi, replacement: "deeper house layer" },
  { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
  { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
  { pattern: /\bcontract\b/gi, replacement: "governing mark" },
  { pattern: /\bTNT\b/g, replacement: "" },
  { pattern: /\bthe world side\b/gi, replacement: "Mirrorland" },
  { pattern: /\bworld side\b/gi, replacement: "Mirrorland" },
  { pattern: /\bworld gate\b/gi, replacement: "South Gate" },
  { pattern: /\bCharacter Archetype Mirror\b/g, replacement: "Character Mirror" },
  { pattern: /\bcharacter archetype mirror\b/gi, replacement: "Character Mirror" },
  { pattern: /\bwhich character am I most like\b/gi, replacement: "what does the Character Mirror show" },
  { pattern: /\bwhich character fits my pressure\b/gi, replacement: "how does the Character Mirror connect to the Diagnostic" },
  { pattern: /\bwhere do I fit into this\b/gi, replacement: "how does the narrative path become personal" },
  { pattern: /\bask me the first mirror question\b/gi, replacement: "where can I take the alignment diagnostic" },
  { pattern: /\bpressure pattern\b/gi, replacement: "behavior under pressure" },
  { pattern: /\bhuman source\b/gi, replacement: "creator behind all of this" }
];

const NEWS_AXES = Object.freeze({
  C: {
    cardinal: AXIS_CENTER,
    name: "center",
    role: "return, coordination, runtime, present state, First Fork, and re-orientation",
    publicLine: "This belongs to the estate’s center of return."
  },
  N: {
    cardinal: AXIS_NORTH,
    name: "north",
    role: "source, orientation, creator, origin, and first clarity",
    publicLine: "This belongs to the northern source and orientation side of the estate."
  },
  E: {
    cardinal: AXIS_EAST,
    name: "east",
    role: "future systems, Frontier, Hearth, construction, testing, and growth",
    publicLine: "This belongs to the eastern future and construction side of the estate."
  },
  W: {
    cardinal: AXIS_WEST,
    name: "west",
    role: "proof, law, boundary, correction, measurement, and limits",
    publicLine: "This belongs to the western proof side of the estate."
  },
  S: {
    cardinal: AXIS_SOUTH,
    name: "south",
    role: "Mirrorland, encounter, character depth, world-window, consequence, and story descent",
    publicLine: "This belongs to the southern Mirrorland side of the estate."
  },
  NE: {
    cardinal: AXIS_NORTHEAST,
    name: "northeast",
    role: "public value and usable expression",
    publicLine: "This belongs to the northeast practical-value side of the estate."
  },
  SE: {
    cardinal: AXIS_SOUTHEAST,
    name: "southeast",
    role: "future world, Audralia, and constructive possibility",
    publicLine: "This belongs to the southeast future-world side of the estate."
  },
  SW: {
    cardinal: AXIS_SOUTHWEST,
    name: "southwest",
    role: "consequence, warning, hidden cost, and downstream harm",
    publicLine: "This belongs to the southwest consequence side of the estate."
  },
  WS: {
    cardinal: AXIS_WEST_SOUTH,
    name: "west-south",
    role: "reflection bridge between proof and character depth",
    publicLine: "This bridge sits between proof and character depth."
  },
  SN: {
    cardinal: AXIS_SOUTH_NORTH,
    name: "south-north",
    role: "value road between personal depth and human source",
    publicLine: "This road carries personal depth back toward human source."
  }
});

const FIBONACCI_STAGES = Object.freeze([
  { step: 1, name: "recognition", purpose: "name the thing", maxBubbles: 1, depthMode: DEPTH_INTRO },
  { step: 1, name: "confirmation", purpose: "confirm the visitor’s need", maxBubbles: 1, depthMode: DEPTH_INTRO },
  { step: 2, name: "split", purpose: "show the basic split or choice", maxBubbles: 2, depthMode: DEPTH_INTRO },
  { step: 3, name: "placement", purpose: "explain what it is, where it sits, and why it matters", maxBubbles: 3, depthMode: DEPTH_INTERMEDIATE },
  { step: 5, name: "accord", purpose: "show nearby rooms and narrative accord", maxBubbles: 3, depthMode: DEPTH_INTERMEDIATE },
  { step: 8, name: "path", purpose: "open the deeper path", maxBubbles: 4, depthMode: DEPTH_DEEP },
  { step: 13, name: "handoff", purpose: "give full context and handoff set", maxBubbles: 4, depthMode: DEPTH_DEEP },
  { step: 21, name: "conclusion", purpose: "conclude the arc and move toward transformation, Mirrorland, Summits, or deeper canon", maxBubbles: 4, depthMode: DEPTH_DEEP }
]);

const DIAMOND_GATE_REGISTRY = Object.freeze({
  id: "diamondGateBridge",
  route: ROUTES.SITE_GUIDE,
  target: TARGETS.DIAMOND_GATE_OVERVIEW,
  title: "DiamondGateBridge.com",
  splitInterface:
    "DiamondGateBridge.com has two ways in. One side is the traditional website: public pages, Compass, Products, Laws, and the creator path. The other side is the narrative path: Jeeves guides visitors through rooms, worlds, Characters, proof, and future-facing systems.",
  guidedChooser:
    "The guided chooser exists so a visitor does not have to understand the estate before choosing the first useful doorway.",
  publicLane:
    "The traditional website gives visitors clear navigation, public structure, product context, laws, creator context, and practical entry points.",
  narrativeLane:
    "The narrative path carries the deeper mission: coherence, self-recognition, Mirrorland, Hearth, Characters, the Frontier Playground, and future-facing tests.",
  bridge:
    "The two sides are not separate websites. They are two entrances into one estate. Jeeves may move a visitor from the traditional website into Mirrorland, or from Mirrorland back into the traditional website structure."
});

const MISSION_REGISTRY = Object.freeze({
  id: "missionThreeLayerStructure",
  route: ROUTES.MIRRORLAND,
  target: TARGETS.MISSION_OVERVIEW,
  title: "Mission",
  general:
    "The larger mission is to help people and communities move with more clarity, integrity, collaboration, and shared direction.",
  inner:
    "The inner mission belongs mostly to the narrative path. It helps people slow the noise, notice what is shaping them, and move through pressure without losing direction.",
  community:
    "The community mission turns outward: service, standing against bullying, protecting children, protecting animals, and helping people feel safer, seen, and supported.",
  collaboration:
    "The collaboration mission turns the work into shared construction: teamwork, practical systems, public value, and building better outcomes together.",
  frontier:
    "The Frontier Playground is where the mission becomes practical. It tests whether the values can survive pressure, systems, limits, and real-world application."
});

const BRIDGE_PAIR_REGISTRY = Object.freeze({
  split: {
    from: TARGETS.TRADITIONAL_WEBSITE,
    to: TARGETS.NARRATIVE_PATH,
    line: "Traditional Website and Narrative Path are separate entry lanes, but Jeeves should keep bridge doors open between them."
  },
  compassHearth: {
    from: TARGETS.COMPASS,
    to: TARGETS.HEARTH,
    line: "Compass helps a visitor orient publicly. Hearth gives the narrative control-window version of orientation."
  },
  productsFrontier: {
    from: TARGETS.PRODUCTS,
    to: TARGETS.FRONTIER,
    line: "Products show public value. Frontier Playground shows how that value is tested as a future-facing system."
  },
  lawsScientificLaw: {
    from: TARGETS.LAWS,
    to: TARGETS.SCIENTIFIC_LAW,
    line: "Law Library holds boundary. Scientific Law tests whether claims survive evidence, measurement, correction, and limits."
  },
  seanUnderdog: {
    from: TARGETS.SEAN,
    to: TARGETS.UNDERDOG,
    line: "Meet Sean gives creator context. This Underdog translates pressure, voice, and becoming into a human path."
  },
  diagnosticCharacterMirror: {
    from: TARGETS.DIAGNOSTIC_REFERRAL,
    to: TARGETS.CHARACTER_MIRROR,
    line: "The Character Mirror may be explained by Jeeves, but assessment belongs to the Coherence Diagnostic."
  }
});

const CHARACTER_REGISTRY = Object.freeze({
  aurenVale: {
    id: "aurenVale",
    name: "Auren Vale",
    title: "Sanctuary Builder",
    target: TARGETS.CHARACTER_AUREN,
    route: ROUTES.CHARACTERS,
    oneLine: "Auren Vale protects the manor, but every life he shelters makes the sanctuary harder to hide.",
    pressure: "Every protected life makes the manor harder to hide.",
    function: "Guardian of the place everyone needs and everyone could expose.",
    mirror: "Protection, custody, shelter, and fear of exposure.",
    keywords: ["auren", "auren vale", "sanctuary", "shelter", "protection", "custody", "exposure", "hide", "protect"]
  },
  dextrion: {
    id: "dextrion",
    name: "Dextrion",
    title: "Earth-Side Originator",
    target: TARGETS.CHARACTER_DEXTRION,
    route: ROUTES.CHARACTERS,
    oneLine: "Dextrion opened the crossing from Earth and carries the burden of everyone who cannot return.",
    pressure: "Every one-way crossing remains on his hands.",
    function: "Earth-side sender of technology, people, and decisions into Mirrorland.",
    mirror: "Repair, responsibility, guilt, and pressure to fix what broke.",
    keywords: ["dextrion", "earth side", "earth-side", "originator", "repair", "fix", "guilt", "responsibility", "anomaly", "crossing"]
  },
  alaric: {
    id: "alaric",
    name: "Alaric",
    title: "Field Navigator",
    target: TARGETS.CHARACTER_ALARIC,
    route: ROUTES.CHARACTERS,
    oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe.",
    pressure: "Waiting for proof can close the only safe route.",
    function: "Reads Audralia while the maps are incomplete and the planet is still teaching the team how it moves.",
    mirror: "Early warning, danger-reading, orientation, and action before others believe the proof.",
    keywords: ["alaric", "field navigator", "navigator", "danger", "warning", "route", "orientation", "before proof", "scout"]
  },
  tarian: {
    id: "tarian",
    name: "Tarian",
    title: "Water Anchor",
    target: TARGETS.CHARACTER_TARIAN,
    route: ROUTES.CHARACTERS,
    oneLine: "Tarian keeps survival physical because no future matters if the body cannot continue.",
    pressure: "The future fails if the body cannot continue.",
    function: "Keeps survival tied to earth, water, air, distance, recovery, and human limit.",
    mirror: "Endurance, body-level survival, water, recovery, and carrying too much.",
    keywords: ["tarian", "water", "water anchor", "body", "endurance", "survival", "tired", "carry", "fatigue", "recovery"]
  },
  elara: {
    id: "elara",
    name: "Elara",
    title: "Signal Bearer",
    target: TARGETS.CHARACTER_ELARA,
    route: ROUTES.CHARACTERS,
    oneLine: "Elara makes the future visible before it disappears, but visibility always risks exposure.",
    pressure: "The future has to be visible before anyone moves toward it.",
    function: "Gives Audralia a visible future people can believe in without forgetting danger.",
    mirror: "Signal, visibility, hope, public voice, and risk of being seen.",
    keywords: ["elara", "signal", "signal bearer", "visible", "visibility", "hope", "future", "voice", "seen", "message"]
  },
  soren: {
    id: "soren",
    name: "Soren",
    title: "Boundary Keeper",
    target: TARGETS.CHARACTER_SOREN,
    route: ROUTES.CHARACTERS,
    oneLine: "Soren refuses fake restoration because hidden damage only creates another ZIONTS.",
    pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
    function: "Audits every claim that the new world is being saved cleanly.",
    mirror: "Truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
    keywords: ["soren", "boundary", "boundary keeper", "truth", "hidden cost", "cost", "evidence", "contradiction", "zionts", "contamination"]
  },
  jeeves: {
    id: "jeeves",
    name: "Jeeves",
    title: "Manor Interface",
    target: TARGETS.CHARACTER_JEEVES,
    route: ROUTES.CHARACTERS,
    oneLine: "Jeeves sequences truth because the wrong amount of truth can send a visitor into the wrong room.",
    pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
    function: "Keeps the manor’s rooms, secrets, routes, and revelations in survivable order.",
    mirror: "Sequence, restraint, truth timing, entry, and controlled revelation.",
    keywords: ["jeeves", "manor interface", "sequence", "truth", "entry", "door", "timing", "control", "reveal", "permission"]
  },
  remoteTeam: {
    id: "remoteTeam",
    name: "Remote Team",
    title: "Distributed Response Unit",
    target: TARGETS.CHARACTER_REMOTE_TEAM,
    route: ROUTES.CHARACTERS,
    oneLine: "The Remote Team carries survival beyond the manor, where protection has to become distributable.",
    pressure: "If survival cannot leave the manor, the manor is only a bunker.",
    function: "Carries survival into cities, water lanes, field routes, climate zones, and public systems.",
    mirror: "Distributed responsibility, field logistics, public survival, and helping beyond the safe center.",
    keywords: ["remote team", "remote", "distributed", "team", "community", "field", "city", "help others", "beyond", "public survival"]
  }
});

const SCIENTIFIC_LAW_REGISTRY = Object.freeze({
  id: "scientificLaw",
  route: ROUTES.SCIENTIFIC_LAW,
  target: TARGETS.SCIENTIFIC_LAW,
  chamber: "Reality Test Chamber",
  coreTruth:
    "A claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
  summary:
    "Scientific Law is the Reality Test chamber. It separates what sounds convincing from what keeps working after observation, evidence, measurement, comparison, correction, uncertainty, and limits.",
  doors: {
    theory: {
      target: TARGETS.SCIENTIFIC_LAW_THEORY,
      meaning: "Theory is the explanation that risks being wrong."
    },
    evidence: {
      target: TARGETS.SCIENTIFIC_LAW_EVIDENCE,
      meaning: "Evidence is the checkable record that survives preference."
    },
    measure: {
      target: TARGETS.SCIENTIFIC_LAW_MEASURE,
      meaning: "Measure is the coordinate system attached to a claim."
    },
    limits: {
      target: TARGETS.SCIENTIFIC_LAW_LIMITS,
      meaning: "Limits are the boundary that protects truth from overclaiming."
    }
  }
});

const GAUGE_REGISTRY = Object.freeze({
  id: "gauges",
  route: ROUTES.GAUGES,
  target: TARGETS.GAUGES,
  title: "Triple G",
  summary:
    "Triple G reads Goals, Gauges, and Gaps. It measures the jump between what the estate intends, what the current system shows, and what still has to be closed."
});

const FRONTIER_REGISTRY = Object.freeze({
  id: "frontier",
  route: ROUTES.FRONTIER,
  target: TARGETS.FRONTIER,
  conjugation: "Mirrorland reveals. Audralia carries. Frontier tests. Hearth coordinates.",
  summary:
    "Frontier Playground is Audralia’s applied-science playground. It tests power, water, waste, feedback, infrastructure, ordered growth, city pressure, operating rules, visible signal, direction, and horizon aim.",
  systems: {
    energy: {
      name: "Energy",
      title: "Fusion Systems",
      route: ROUTES.FRONTIER_ENERGY,
      target: TARGETS.FRONTIER_ENERGY,
      platform:
        "Energy starts with power readiness: how a future world stores energy, protects load, and prepares for cleaner power without pretending the final breakthrough is already solved."
    },
    water: {
      name: "Water",
      title: "Closed Water Systems",
      route: ROUTES.FRONTIER_WATER,
      target: TARGETS.FRONTIER_WATER,
      platform:
        "Water asks how water keeps moving without being wasted: capture, cleaning, routing, reuse, and continuity."
    },
    waste: {
      name: "Waste",
      title: "Wastewater Systems",
      route: ROUTES.FRONTIER_WASTE,
      target: TARGETS.FRONTIER_WASTE,
      platform:
        "Waste begins where discarded material becomes a design test: sanitation, recovery, cleaning, and reuse."
    },
    closedLoop: {
      name: "Closed Loop",
      title: "Closed Loop Systems",
      route: ROUTES.FRONTIER_CLOSED_LOOP,
      target: TARGETS.FRONTIER_CLOSED_LOOP,
      platform:
        "Closed Loop asks whether a system can answer back: detect pressure, register failure, correct course, and prove the correction returned somewhere useful."
    },
    infrastructure: {
      name: "Infrastructure",
      title: "Infrastructure Systems",
      route: ROUTES.FRONTIER_INFRASTRUCTURE,
      target: TARGETS.FRONTIER_INFRASTRUCTURE,
      platform:
        "Infrastructure tests whether the world can carry weight: roads, supports, utilities, corridors, and load-bearing civic structure."
    },
    lattice: {
      name: "Lattice",
      title: "Lattice Systems",
      route: ROUTES.FRONTIER_LATTICE,
      target: TARGETS.FRONTIER_LATTICE,
      platform:
        "Lattice asks whether growth has order. Placement, count, relationship, and pattern keep a world from expanding randomly into noise."
    },
    urban: {
      name: "Urban",
      title: "Urban Systems",
      route: ROUTES.FRONTIER_URBAN,
      target: TARGETS.FRONTIER_URBAN,
      platform:
        "Urban tests settlement pressure: corridors, density, shelter, public systems, and movement."
    },
    manual: {
      name: "Manual",
      title: "Frontier Manual",
      route: ROUTES.FRONTIER_MANUAL,
      target: TARGETS.FRONTIER_MANUAL,
      platform:
        "Manual turns the playground into instructions, handling rules, and readable next steps."
    },
    shimmer: {
      name: "Shimmer",
      title: "Shimmer Systems",
      route: ROUTES.FRONTIER_SHIMMER,
      target: TARGETS.FRONTIER_SHIMMER,
      platform:
        "Shimmer makes change visible. A glint, warning, pulse, or surface shift tells the visitor that pressure is moving before the full system explains itself."
    },
    trajectory: {
      name: "Trajectory",
      title: "Trajectory Systems",
      route: ROUTES.FRONTIER_TRAJECTORY,
      target: TARGETS.FRONTIER_TRAJECTORY,
      platform:
        "Trajectory asks where the future is moving. Direction, timing, path, and correction determine whether a system has motion or only activity."
    },
    vision: {
      name: "Vision",
      title: "Vision Systems",
      route: ROUTES.FRONTIER_VISION,
      target: TARGETS.FRONTIER_VISION,
      platform:
        "Vision keeps the horizon in view. It asks what kind of future the world is trying to reach before systems harden into habits."
    }
  }
});

const HEARTH_CONSTRUCT_REGISTRY = Object.freeze({
  id: "hearthConstruct",
  route: ROUTES.HEARTH,
  target: TARGETS.HEARTH,
  role: "Hearth Mission Control",
  premise: "window_within_the_window",
  primaryLine: "Hearth is Mission Control — the window within the window.",
  portalLine:
    "The deeper unknown construct location is reached through the estate’s portal logic and exists somewhere in the universe; Hearth is the live estate chamber that gives the visitor and Jeeves a control view into it.",
  spine:
    "Mirrorland reveals. Audralia carries. Frontier tests. Scientific Law verifies. Hearth coordinates. Characters carry the pressure.",
  summary:
    "Hearth is the live Mission Control chamber inside the estate. Mirrorland is the larger future-facing window; Hearth is the inner control window where future potential is observed, coordinated, routed, and checked before it becomes world, system, route, or consequence."
});

const MIRRORLAND_REGISTRY = Object.freeze({
  id: "mirrorland",
  route: ROUTES.MIRRORLAND,
  target: TARGETS.MIRRORLAND,
  title: "Mirrorland",
  summary:
    "Mirrorland is where possible futures become visible before they become final. The website is the window, not the portal.",
  triad:
    "ZIONTS is consequence. H-Earth is survival. Audralia is possibility.",
  crossing:
    "Dextrion detects the Bermuda-area anomaly from Earth. The first team crosses into Mirrorland, the return path fails, and the mission becomes one-way.",
  hearthRelation:
    "Mirrorland is the larger future-facing field. Hearth is the window within that window, the inner Mission Control chamber where the view is coordinated."
});

const CREATOR_REGISTRY = Object.freeze({
  id: "creator",
  route: ROUTES.MEET_SEAN,
  target: TARGETS.SEAN,
  title: "Meet the creator behind all of this",
  summary:
    "Sean Mansfield is the creator behind Diamond Gate Bridge: the estate, rooms, laws, worlds, characters, and conversation structure that holds them together.",
  depth:
    "The work comes from struggle, creative integrity, artistic integrity, a deep love for nature, preservation, growth, and societal understanding."
});

const UNDERDOG_REGISTRY = Object.freeze({
  id: "thisUnderdog",
  route: ROUTES.UNDERDOG,
  target: TARGETS.UNDERDOG,
  title: "This Underdog",
  summary:
    "This Underdog is not Sean alone. It is the inner voice in the visitor that has carried pressure before it found language, direction, or use.",
  depth:
    "The underdog is the person whose strength has not fully been named yet. This path turns pain into orientation, pressure into voice, and survival into growth."
});

const SUMMITS_REGISTRY = Object.freeze({
  id: "nineSummits",
  route: ROUTES.NINE_SUMMITS,
  target: TARGETS.NINE_SUMMITS,
  title: "Nine Summits",
  summary:
    "Nine Summits is the value road where the human climb becomes larger than a single page or product.",
  bookSummary:
    "The Nine Summits of Love is the book/seminar path. The nine summit sequence is Character, Structure, Balance, Stability, Peace, Joy, Dignity, Free Will, and Love.",
  carats:
    "256 carats names value under pressure, cut through experience, and clarified through love."
});

const COHERENCE_DIAGNOSTIC_REGISTRY = Object.freeze({
  id: "coherenceDiagnostic",
  route: ROUTES.COHERENCE_DIAGNOSTIC,
  target: TARGETS.DIAGNOSTIC,
  summary:
    "The Coherence Diagnostic is a local-only self-reflection and pattern-assessment tool. It uses self-rated coherence, claimed primary and secondary archetype, then real-world scenarios with a first move and support move.",
  boundaries:
    "It is not a medical, mental-health, legal, employment, intelligence, official IQ, or official MBTI diagnostic. It does not store, email, archive, submit, or save answers in the current version.",
  jeevesBoundary:
    "Jeeves may explain how the Coherence Diagnostic and Character Mirror connect, and may route the visitor to the Diagnostic. Jeeves does not conduct the assessment inside this chat."
});

const GUIDE_BLUEPRINT_ROOMS = Object.freeze({
  compass: {
    roomId: "compassDesk",
    title: "Compass Desk",
    cardinal: AXIS_NORTH,
    route: ROUTES.COMPASS,
    target: TARGETS.COMPASS,
    placement: "Compass Desk is where visitors re-center when the estate feels large."
  },
  guide: {
    roomId: "guideDesk",
    title: "Guide Desk",
    cardinal: AXIS_NORTH,
    route: ROUTES.SITE_GUIDE,
    target: TARGETS.SITE_GUIDE,
    placement: "Guide Desk is the room that teaches the estate’s buttons, maps, rooms, and movement patterns."
  },
  main: {
    roomId: "mainHall",
    title: "Main Hall",
    cardinal: AXIS_CENTER,
    route: ROUTES.HOME,
    target: TARGETS.DIAMOND_GATE_OVERVIEW,
    placement: "Main Hall is the ordinary public website center before visitors branch."
  },
  atrium: {
    roomId: "atrium",
    title: "Atrium",
    cardinal: AXIS_SOUTH,
    route: ROUTES.SHOWROOM,
    target: TARGETS.ATRIUM,
    placement: "Atrium is the entrance into the Mirrorland side of the estate."
  },
  atlas: {
    roomId: "atlasStudy",
    title: "Atlas Study",
    cardinal: AXIS_SOUTH,
    route: ROUTES.MIRRORLAND,
    target: TARGETS.ATLAS,
    placement: "Atlas Study gathers world-facing routes so planets, reference bodies, and world paths become easier to choose."
  },
  frontier: {
    roomId: "frontier",
    title: "Frontier Playground",
    cardinal: AXIS_EAST,
    route: ROUTES.FRONTIER,
    target: TARGETS.FRONTIER,
    placement: "Frontier Playground is where energy, water, waste, feedback, infrastructure, manuals, and future ideas move toward practical shape."
  },
  lab: {
    roomId: "theLab",
    title: "The Lab",
    cardinal: AXIS_WEST,
    route: ROUTES.GAUGES,
    target: TARGETS.GAUGES,
    placement: "The Lab helps separate what is working, what is held, and what still needs proof."
  },
  law: {
    roomId: "lawLibrary",
    title: "Law Library",
    cardinal: AXIS_WEST,
    route: ROUTES.LAWS,
    target: TARGETS.LAWS,
    placement: "Law Library holds the rules, categories, and constraints that keep the site from expanding without discipline."
  }
});

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "bubbles",
    "options",
    "handoffs",
    "confidence",
    "needsRecenter",
    "intent",
    "canonStatus",
    "nextTopic",
    "conclusiveState",
    "usedRegistry",
    "suggestedMode"
  ],
  properties: {
    bubbles: {
      type: "array",
      minItems: 1,
      maxItems: MAX_BUBBLES,
      items: { type: "string", maxLength: 420 }
    },
    options: {
      type: "array",
      maxItems: MAX_OPTIONS,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "label",
          "target",
          "type",
          "scopeLane",
          "promptMode",
          "optionKind",
          "archetypeAlignment",
          "bridgeMoment",
          "movementIntent"
        ],
        properties: {
          label: { type: "string", maxLength: 110 },
          target: { type: "string", maxLength: 100 },
          type: { type: "string", enum: ["conversation", "topic", "calibration", "back", "control"] },
          scopeLane: { type: "string", enum: ["objective", "narrative"] },
          promptMode: { type: "string", enum: PROMPT_MODES },
          optionKind: { type: "string", enum: OPTION_KINDS },
          archetypeAlignment: { type: "string", enum: ARCHETYPE_ALIGNMENTS },
          bridgeMoment: { type: "string", enum: BRIDGE_MOMENTS },
          movementIntent: { type: "string", enum: MOVEMENT_INTENTS }
        }
      }
    },
    handoffs: {
      type: "array",
      maxItems: MAX_HANDOFFS,
      items: { type: "string", maxLength: 80 }
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    needsRecenter: { type: "boolean" },
    intent: { type: "string", enum: INTENTS },
    canonStatus: { type: "string", enum: CANON_STATUS },
    nextTopic: { type: "string", maxLength: 90 },
    conclusiveState: { type: "string", enum: CONCLUSIVE_STATES },
    usedRegistry: {
      type: "array",
      maxItems: 14,
      items: { type: "string", maxLength: 90 }
    },
    suggestedMode: { type: "string", enum: SUGGESTED_MODES }
  }
};

const rateBucket = new Map();

async function handler(req, res) {
  setCorsHeaders(req, res);

  const method = getMethod(req);

  if (method === "OPTIONS") {
    sendEmpty(res, 204);
    return;
  }

  if (method === "GET" || method === "HEAD") {
    if (method === "HEAD") {
      sendEmpty(res, 200);
      return;
    }

    sendJson(res, 200, buildHealthResponse(method));
    return;
  }

  if (method !== "POST") {
    sendJson(res, 405, {
      ok: false,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      rootConversationContract: ROOT_CONVERSATION_CONTRACT,
      error: "METHOD_NOT_ALLOWED",
      allowedMethods: ["GET", "HEAD", "POST", "OPTIONS"]
    });
    return;
  }

  try {
    if (!rateLimit(req)) {
      const ctx = normalizePayload({});
      sendJson(res, 429, safeResponse({
        ok: false,
        source: "rate_limit",
        bubbles: ["I need to slow this doorway down for a moment."],
        options: defaultRecenterOptions(),
        handoffs: [ROUTES.COMPASS],
        confidence: "medium",
        needsRecenter: true,
        intent: "recenter",
        canonStatus: "fallback",
        nextTopic: "recenter",
        conclusiveState: "needs_sharper_question",
        usedRegistry: [],
        suggestedMode: "objective"
      }, ctx));
      return;
    }

    const body = await readJsonBody(req);
    const ctx = normalizePayload(body);

    ctx.intent = classifyIntent(ctx);
    ctx.depthMode = inferDepthMode(ctx);
    ctx.fibonacciStage = inferFibonacciStage(ctx);
    ctx.promptMode = inferPromptMode(ctx);
    ctx.movementIntent = inferMovementIntent(ctx);

    const localSafety = localModerationCheck(ctx.visitorText);

    if (!localSafety.allowed) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "local_moderation",
        safety: {
          input: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: localSafety.reason
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: [
          "I cannot take that path.",
          "I can re-center you to the public map, the proof path, or the Diagnostic."
        ],
        options: defaultRecenterOptions(),
        handoffs: [ROUTES.COMPASS, ROUTES.LAWS, ROUTES.COHERENCE_DIAGNOSTIC],
        confidence: "medium",
        needsRecenter: true,
        intent: "recenter",
        canonStatus: "blocked",
        nextTopic: "recenter",
        conclusiveState: "needs_sharper_question",
        usedRegistry: [],
        suggestedMode: "objective"
      }, ctx));
      return;
    }

    const memory = retrieveApprovedMemory(ctx);
    const allowed = buildAllowedSets(ctx, memory);

    if (shouldReturnDiagnosticReferral(ctx)) {
      const referral = buildDiagnosticReferralResponse(ctx);
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "diagnostic_referral_boundary",
        safety: safeUncheckedSafety(),
        bubbles: referral.bubbles,
        options: referral.options,
        handoffs: referral.handoffs,
        confidence: referral.confidence,
        needsRecenter: false,
        intent: "diagnosticReferral",
        canonStatus: "grounded",
        nextTopic: "diagnosticReferral",
        conclusiveState: referral.conclusiveState,
        usedRegistry: ["coherenceDiagnostic", "characterRegistry", "diagnosticReferralBoundary"],
        suggestedMode: "diagnosticReferral"
      }, ctx, allowed));
      return;
    }

    if (isGuidedChooserRequest(ctx)) {
      const guided = buildGuidedChooserResponse(ctx);
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "guided_entrance",
        safety: safeUncheckedSafety(),
        bubbles: guided.bubbles,
        options: guided.options,
        handoffs: guided.handoffs,
        confidence: "high",
        needsRecenter: false,
        intent: "guidedEntrance",
        canonStatus: "grounded",
        nextTopic: "guidedEntrance",
        conclusiveState: "open",
        usedRegistry: ["diamondGateBridgeSplitInterface", "guidedEntrance", "bridgePairs"],
        suggestedMode: "objective"
      }, ctx, allowed));
      return;
    }

    if (!OPENAI_API_KEY) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "deterministic_conversation_engine",
        safety: {
          input: {
            checked: false,
            allowed: true,
            flagged: false,
            reason: "OPENAI_API_KEY_NOT_CONFIGURED"
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: deterministicFallbackBubbles(ctx, memory),
        options: deterministicFallbackOptions(ctx, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        confidence: "medium",
        needsRecenter: shouldRecenter(ctx),
        intent: ctx.intent,
        canonStatus: "fallback",
        nextTopic: inferNextTopic(ctx, memory),
        conclusiveState: inferConclusiveState(ctx, memory),
        usedRegistry: memory.map((item) => item.id),
        suggestedMode: inferSuggestedMode(ctx.intent, memory)
      }, ctx, allowed));
      return;
    }

    const inputModeration = await moderateText(ctx.visitorText);

    if (inputModeration.flagged) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "input_moderation",
        safety: {
          input: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: inputModeration.reason || "MODERATION_FLAGGED"
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: [
          "I cannot take that path.",
          "I can bring you back to a safe public route."
        ],
        options: defaultRecenterOptions(),
        handoffs: [ROUTES.COMPASS, ROUTES.SITE_GUIDE, ROUTES.LAWS],
        confidence: "medium",
        needsRecenter: true,
        intent: "recenter",
        canonStatus: "blocked",
        nextTopic: "recenter",
        conclusiveState: "needs_sharper_question",
        usedRegistry: [],
        suggestedMode: "objective"
      }, ctx, allowed));
      return;
    }

    const modelResult = await callModel(ctx, memory, allowed);
    const modelResponse = normalizeModelResponse(modelResult, ctx, memory, allowed);
    const outputText = modelResponse.bubbles.join("\n");
    const outputModeration = await moderateText(outputText);

    if (outputModeration.flagged) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "output_moderation_fallback",
        safety: {
          input: {
            checked: true,
            allowed: true,
            flagged: false
          },
          output: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: outputModeration.reason || "OUTPUT_MODERATION_FLAGGED"
          }
        },
        bubbles: deterministicFallbackBubbles(ctx, memory),
        options: deterministicFallbackOptions(ctx, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        confidence: "medium",
        needsRecenter: shouldRecenter(ctx),
        intent: ctx.intent,
        canonStatus: "fallback",
        nextTopic: inferNextTopic(ctx, memory),
        conclusiveState: inferConclusiveState(ctx, memory),
        usedRegistry: memory.map((item) => item.id),
        suggestedMode: inferSuggestedMode(ctx.intent, memory)
      }, ctx, allowed));
      return;
    }

    sendJson(res, 200, safeResponse({
      ok: true,
      source: ctx.requestMode === "node_enrichment" ? "model_bridge_node_enrichment" : "model_bridge",
      safety: {
        input: {
          checked: true,
          allowed: true,
          flagged: false
        },
        output: {
          checked: true,
          allowed: true,
          flagged: false
        }
      },
      bubbles: modelResponse.bubbles,
      options: modelResponse.options,
      handoffs: modelResponse.handoffs,
      confidence: modelResponse.confidence,
      needsRecenter: modelResponse.needsRecenter,
      intent: modelResponse.intent,
      canonStatus: modelResponse.canonStatus,
      nextTopic: modelResponse.nextTopic,
      conclusiveState: modelResponse.conclusiveState,
      usedRegistry: modelResponse.usedRegistry,
      suggestedMode: modelResponse.suggestedMode
    }, ctx, allowed));
  } catch (error) {
    const ctx = normalizePayload({});
    sendJson(res, 500, safeResponse({
      ok: false,
      source: "server_error",
      error: "JEEVES_SERVER_BRAIN_ERROR",
      message: safeErrorMessage(error),
      bubbles: [
        "The deeper answer path did not respond cleanly.",
        "I can still bring you back to the public doorway."
      ],
      options: defaultRecenterOptions(),
      handoffs: [ROUTES.COMPASS, ROUTES.SITE_GUIDE],
      confidence: "low",
      needsRecenter: true,
      intent: "recenter",
      canonStatus: "fallback",
      nextTopic: "recenter",
      conclusiveState: "needs_sharper_question",
      usedRegistry: [],
      suggestedMode: "objective"
    }, ctx));
  }
}

function buildHealthResponse(method) {
  return {
    ok: true,
    source: "route_health",
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    rootConversationContract: ROOT_CONVERSATION_CONTRACT,
    expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
    frontbrainContractTarget: FRONTBRAIN_CONTRACT_TARGET,
    method,
    routeFormat: "commonjs_serverless_handler",
    acceptsConversationMethod: "POST",
    acceptsPreflightMethod: "OPTIONS",
    acceptsHealthMethods: ["GET", "HEAD"],
    responseShape: [
      "bubbles",
      "options",
      "handoffs",
      "handoffLabels",
      "routeHints",
      "selectedTarget",
      "selectedLabel",
      "intent",
      "bridgeContext",
      "promptMode",
      "optionKind",
      "archetypeAlignment",
      "bridgeMoment",
      "movementIntent"
    ],
    guidedEntrance: "splitInterfaceBridgePath is first-class guided chooser when selectedLabel or bridgeContext indicates start/guidance intent.",
    diagnosticBoundary: "Jeeves explains and routes; Jeeves does not assess, score, classify, diagnose, type, or assign a Character."
  };
}

function setCorsHeaders(req, res) {
  const requestOrigin = req && req.headers && req.headers.origin ? String(req.headers.origin) : "";
  const allowOrigin = ALLOWED_ORIGIN || requestOrigin || "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function sendJson(res, status, data) {
  res.statusCode = status;

  if (typeof res.status === "function") {
    const out = res.status(status);
    if (out && typeof out.json === "function") {
      out.json(data);
      return;
    }
  }

  if (typeof res.json === "function") {
    res.json(data);
    return;
  }

  res.end(JSON.stringify(data));
}

function sendEmpty(res, status) {
  res.statusCode = status;

  if (typeof res.status === "function") {
    const out = res.status(status);
    if (out && typeof out.end === "function") {
      out.end();
      return;
    }
  }

  res.end();
}

function getMethod(req) {
  return String(req && req.method ? req.method : "GET").toUpperCase();
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return parseJsonOrEmpty(req.body);

  const chunks = [];

  if (req && typeof req[Symbol.asyncIterator] === "function") {
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  }

  if (!chunks.length) return {};
  return parseJsonOrEmpty(Buffer.concat(chunks).toString("utf8"));
}

function parseJsonOrEmpty(value) {
  const text = String(value || "").trim();
  if (!text) return {};
  return JSON.parse(text);
}

function normalizePayload(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  const selectedTarget = normalizeTarget(capString(raw.selectedTarget || raw.selectedOptionTarget || raw.optionTarget || "", 140));
  const selectedLabel = capString(raw.selectedLabel || raw.selectedOptionLabel || raw.optionLabel || "", 240);
  const visitorText = capString(raw.visitorText || raw.message || raw.query || raw.text || selectedLabel || "", MAX_INPUT_CHARS);

  return {
    visitorText,
    selectedTarget,
    selectedLabel,
    requestMode: normalizeRequestMode(raw.requestMode || raw.mode || (selectedTarget ? "node_enrichment" : "freeform")),

    promptMode: normalizePromptMode(raw.promptMode),
    optionKind: normalizeOptionKind(raw.optionKind),
    archetypeAlignment: normalizeArchetypeAlignment(raw.archetypeAlignment),
    bridgeMoment: normalizeBridgeMoment(raw.bridgeMoment),
    movementIntent: normalizeMovementIntent(raw.movementIntent),
    bridgeContext: sanitizeBridgeContext(raw.bridgeContext),
    branchStack: sanitizeTransitionList(raw.branchStack),
    transitionTrail: sanitizeTransitionList(raw.transitionTrail),

    currentConversationStage: capString(raw.currentConversationStage || raw.conversationStage || "", 120),
    currentEntryLane: capString(raw.currentEntryLane || raw.entryLane || "", 80),
    lastLane: capString(raw.lastLane || "", 80),
    bridgeOffered: Boolean(raw.bridgeOffered),

    activeHostPage: capString(raw.activeHostPage || "", 100),
    livePageAccess: normalizeList(raw.livePageAccess).slice(0, 12),
    plannedLivePageAccess: normalizeList(raw.plannedLivePageAccess).slice(0, 12),
    currentRoomContext: capString(raw.currentRoomContext || "", 100),
    currentRoomRole: capString(raw.currentRoomRole || "", 100),
    currentRoomPremise: capString(raw.currentRoomPremise || "", 120),
    estateKnowledgeMode: capString(raw.estateKnowledgeMode || "", 100),
    portalLogic: capString(raw.portalLogic || "", 160),
    routeAuthority: capString(raw.routeAuthority || "", 160),

    currentNode: normalizeTarget(capString(raw.currentNode || raw.target || "", 140)),
    currentEntry: normalizeTarget(capString(raw.currentEntry || raw.entry || "", 140)),
    currentPath: normalizeTarget(capString(raw.currentPath || raw.path || "", 140)),
    currentTopic: capString(raw.currentTopic || raw.topic || "", 140),
    currentRoomId: capString(raw.currentRoomId || raw.roomId || "", 140),
    currentRoomName: capString(raw.currentRoomName || "", 160),
    currentCoordinateName: capString(raw.currentCoordinateName || "", 160),
    currentCardinal: capString(raw.currentCardinal || "", 16),
    currentPlaceType: capString(raw.currentPlaceType || "", 60),
    currentScopeLane: normalizeScope(raw.currentScopeLane || raw.scopeLane),
    currentVoiceMode: capString(raw.currentVoiceMode || raw.voiceMode || "", 140),
    visitorPosture: capString(raw.visitorPosture || "", 140),
    movement: capString(raw.movement || "", 100),

    pathDepth: safeNumber(raw.pathDepth, 0),
    routeReadiness: safeNumber(raw.routeReadiness, 0),
    loopCount: safeNumber(raw.loopCount || raw.visitorLoopCount, 0),
    topicDepth: safeNumber(raw.topicDepth || raw.currentTopicDepth, 0),
    revealDepth: safeNumber(raw.revealDepth || raw.fibonacciDepth || raw.fibonacciStep, 0),
    depthMode: capString(raw.depthMode || raw.requestedDepth || "", 30),

    expressionContract: capString(raw.expressionContract || raw.expressionContractId || "", 180),
    frontbrainContract: capString(raw.frontbrainContract || "", 180),
    allowedTargets: normalizeList(raw.allowedTargets).map(normalizeTarget).filter((target) => APPROVED_TARGETS.has(target)),
    allowedRoutes: normalizeList(raw.allowedRoutes).map(normalizeRoute).filter((route) => APPROVED_ROUTE_IDS.has(route)),
    sessionTrail: normalizeList(raw.sessionTrail).slice(-MAX_TRAIL_ITEMS),
    visitedNodes: normalizeList(raw.visitedNodes).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),
    selectedTargets: normalizeList(raw.selectedTargets).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),
    selectedOptionKeys: normalizeList(raw.selectedOptionKeys).slice(-MAX_TRAIL_ITEMS),
    returnStack: normalizeList(raw.returnStack).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),

    registryContext: sanitizeExternalRegistryContext(raw.registryContext),
    diagnosticResult: sanitizeDiagnosticResult(raw.diagnosticResult || raw.coherenceDiagnosticResult),
    intent: "unknown",
    fibonacciStage: FIBONACCI_STAGES[2]
  };
}

function sanitizeBridgeContext(value) {
  if (!value || typeof value !== "object") return null;

  return {
    currentNode: normalizeTarget(value.currentNode || ""),
    priorNode: normalizeTarget(value.priorNode || ""),
    priorLane: capString(value.priorLane || "", 80),
    priorTopic: capString(value.priorTopic || "", 120),
    selectedTarget: normalizeTarget(value.selectedTarget || ""),
    selectedLabel: capString(value.selectedLabel || "", 240),
    promptMode: normalizePromptMode(value.promptMode),
    optionKind: normalizeOptionKind(value.optionKind),
    archetypeAlignment: normalizeArchetypeAlignment(value.archetypeAlignment),
    bridgeMoment: normalizeBridgeMoment(value.bridgeMoment),
    movementIntent: normalizeMovementIntent(value.movementIntent),
    currentTopic: capString(value.currentTopic || "", 120),
    currentScopeStage: capString(value.currentScopeStage || "", 120),
    adjacentTarget: normalizeTarget(value.adjacentTarget || ""),
    adjacentLabel: capString(value.adjacentLabel || "", 240),
    adjacentReason: capString(value.adjacentReason || "", 500)
  };
}

function sanitizeTransitionList(value) {
  if (!Array.isArray(value)) return [];

  return value.slice(-MAX_TRAIL_ITEMS).map((item) => {
    if (!item || typeof item !== "object") {
      return {
        label: capString(item || "", 180),
        optionKind: "conversation_prompt",
        promptMode: "unknown_prompt"
      };
    }

    return {
      from: normalizeTarget(item.from || ""),
      to: normalizeTarget(item.to || ""),
      label: capString(item.label || "", 180),
      optionKind: normalizeOptionKind(item.optionKind),
      promptMode: normalizePromptMode(item.promptMode),
      bridgeMoment: normalizeBridgeMoment(item.bridgeMoment),
      at: capString(item.at || "", 80)
    };
  });
}

function sanitizeExternalRegistryContext(value) {
  if (!value || typeof value !== "object") return null;

  return {
    id: capString(value.id || value.entry || "", 140),
    summary: capString(value.summary || value.answer || value.description || "", 1400),
    routes: normalizeList(value.routes).map(normalizeRoute).filter((route) => APPROVED_ROUTE_IDS.has(route)).slice(0, MAX_HANDOFFS),
    targets: normalizeList(value.targets).map(normalizeTarget).filter((target) => APPROVED_TARGETS.has(target)).slice(0, MAX_OPTIONS)
  };
}

function sanitizeDiagnosticResult(value) {
  if (!value || typeof value !== "object") return null;

  return {
    mode: capString(value.mode || "", 40),
    selfRating: safeNumber(value.selfRating, null),
    claimedPrimary: capString(value.claimedPrimary || value.claimedPrimaryArchetype || "", 80),
    claimedSecondary: capString(value.claimedSecondary || value.claimedSecondaryArchetype || "", 80),
    revealedPrimary: capString(value.revealedPrimary || "", 80),
    revealedSecondary: capString(value.revealedSecondary || "", 80),
    claimMatch: capString(value.claimMatch || "", 120),
    scaledScore: safeNumber(value.scaledScore || value.normalizedScore, null),
    calibrationGap: safeNumber(value.calibrationGap, null)
  };
}

function normalizeRequestMode(value) {
  const clean = capString(value || "", 80);
  return REQUEST_MODES.includes(clean) ? clean : "freeform";
}

function normalizePromptMode(value) {
  const clean = capString(value || "", 80);
  return PROMPT_MODES.includes(clean) ? clean : "unknown_prompt";
}

function normalizeOptionKind(value) {
  const clean = capString(value || "", 80);
  return OPTION_KINDS.includes(clean) ? clean : "conversation_prompt";
}

function normalizeArchetypeAlignment(value) {
  const clean = capString(value || "", 80);
  return ARCHETYPE_ALIGNMENTS.includes(clean) ? clean : "unknown_entry";
}

function normalizeBridgeMoment(value) {
  const clean = capString(value || "", 80);
  return BRIDGE_MOMENTS.includes(clean) ? clean : "none";
}

function normalizeMovementIntent(value) {
  const clean = capString(value || "", 80);
  return MOVEMENT_INTENTS.includes(clean) ? clean : "unknown";
}

function normalizeTarget(target) {
  const clean = String(target || "").trim();
  return TARGET_ALIASES[clean] || clean;
}

function normalizeRoute(routeId) {
  const clean = String(routeId || "").trim();
  return ROUTE_ALIASES[clean] || clean;
}

function normalizeScope(value) {
  if (value === "narrative" || value === "threshold" || value === "immersion") return "narrative";
  return "objective";
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => capString(item, 220)).filter(Boolean);
}

function safeNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function rateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = Number(process.env.JEEVES_RATE_LIMIT_PER_MINUTE || 80);
  const bucket = rateBucket.get(ip) || { started: now, count: 0 };

  if (now - bucket.started > windowMs) {
    bucket.started = now;
    bucket.count = 0;
  }

  bucket.count += 1;
  rateBucket.set(ip, bucket);

  return bucket.count <= limit;
}

function getClientIp(req) {
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

function localModerationCheck(text) {
  const value = String(text || "").toLowerCase();

  const blockedPatterns = [
    { pattern: /\b(api[_-\s]?key|secret[_-\s]?key|token|environment variable)\b/i, reason: "SECRET_EXTRACTION_REQUEST" },
    { pattern: /\b(ignore previous|ignore all instructions|jailbreak|system prompt|developer message)\b/i, reason: "PROMPT_INJECTION" },
    { pattern: /\b(exploit|malware|phishing|steal password|credential theft)\b/i, reason: "CYBER_ABUSE_SIGNAL" }
  ];

  for (const item of blockedPatterns) {
    if (item.pattern.test(value)) {
      return { allowed: false, reason: item.reason };
    }
  }

  return { allowed: true, reason: "" };
}

async function moderateText(text) {
  if (!OPENAI_API_KEY || !text) {
    return { checked: false, flagged: false, reason: "" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODERATION_MODEL,
        input: text
      })
    });

    if (!response.ok) {
      return { checked: false, flagged: false, reason: "MODERATION_UNAVAILABLE" };
    }

    const data = await response.json();
    const result = data && data.results && data.results[0] ? data.results[0] : {};
    const categories = result.categories || {};
    const flaggedCategories = Object.keys(categories).filter((key) => categories[key]);

    return {
      checked: true,
      flagged: Boolean(result.flagged),
      reason: flaggedCategories.join(",")
    };
  } catch (_error) {
    return { checked: false, flagged: false, reason: "MODERATION_ERROR" };
  }
}

function classifyIntent(ctx) {
  if (isGuidedChooserRequest(ctx)) return "guidedEntrance";

  if (ctx.selectedTarget && TARGET_INTENT_MAP[ctx.selectedTarget]) {
    return TARGET_INTENT_MAP[ctx.selectedTarget];
  }

  if (ctx.bridgeContext && ctx.bridgeContext.selectedTarget && TARGET_INTENT_MAP[ctx.bridgeContext.selectedTarget]) {
    return TARGET_INTENT_MAP[ctx.bridgeContext.selectedTarget];
  }

  const text = [
    ctx.visitorText,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.promptMode,
    ctx.optionKind,
    ctx.archetypeAlignment,
    ctx.bridgeMoment,
    ctx.movementIntent,
    ctx.bridgeContext ? ctx.bridgeContext.selectedLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentReason : "",
    ctx.currentConversationStage,
    ctx.currentEntryLane,
    ctx.lastLane,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.currentRoomName,
    ctx.currentCoordinateName,
    ctx.currentRoomContext,
    ctx.currentRoomRole,
    ctx.currentRoomPremise,
    ctx.portalLogic,
    ctx.sessionTrail.join(" "),
    ctx.selectedTargets.join(" ")
  ].join(" ").toLowerCase();

  if (/\b(recenter|lost|confused|start over|clean fork|reset|first fork|return to origin)\b/.test(text)) return "recenter";
  if (/\b(help me choose|choose where|where should i start|where do i begin|guide me|not sure where to start|clear public map|story world|mission and meaning|trustworthy)\b/.test(text)) return "guidedEntrance";
  if (/\b(diamondgatebridge|diamond gate bridge|what is this place|what is diamondgate|what is the site|what is the website|two ways in|split interface|split-interface)\b/.test(text)) return "diamondGate";
  if (/\b(two sides|two ways|split interface|how do the two sides connect|bridge between website and narrative|traditional and narrative)\b/.test(text)) return "splitInterface";
  if (/\b(traditional website|public website|public pages|site guide|guide desk|compass|products|meet sean|public navigation|website side)\b/.test(text)) return "traditionalWebsite";
  if (/\b(narrative path|story path|enter the narrative|rooms worlds characters|worlds characters|mirrorland path|narrative side)\b/.test(text)) return "narrativePath";
  if (/\b(mission|inner mission|community mission|serve the community|protect children|protect animals|bullying|anti-bullying|stand up|collaboration|teamwork|growth|integrity|coherence)\b/.test(text)) return "mission";
  if (/\b(real world|practical relevance|why does this matter|what can i actually do|practical today|use this)\b/.test(text)) return "practicalRelevance";
  if (/\b(character mirror|coherence diagnostic|alignment diagnostic|alignment read|archetype diagnostic|take the diagnostic|where can i take|which archetype|what archetype|what character am i|most like|assess me|score me|diagnose me|classify me|type me)\b/.test(text)) return "diagnosticReferral";
  if (/\b(guide desk|blueprint|sitemap|jump pad|room map|estate map|route planner)\b/.test(text)) return "blueprint";
  if (/\b(scientific law|reality test|theory|evidence|measure|measurement|limits|claim testing|falsifiability|repeatability|calibration|uncertainty|causality|what would count as proof|what could prove this wrong|why should i trust)\b/.test(text)) return "scientificLaw";
  if (/\b(law library|laws|proof law|boundary|coherence law|law side|what keeps this honest)\b/.test(text)) return "laws";
  if (/\b(gauge|gauges|triple g|goals gauges gaps|readiness|pass|hold|fail|what is working)\b/.test(text)) return "gauges";
  if (/\b(frontier|playground|fusion|energy|water|waste|closed loop|infrastructure|lattice|urban|manual|shimmer|trajectory|vision|has to work)\b/.test(text)) return "frontier";
  if (/\b(hearth|mission control|window within the window|planetary construct|construct facility|construct engine|world-formation|planet construction)\b/.test(text)) return "hearth";
  if (findCharacterIdFromText(text) || /\b(character|characters|dossier|people|portrait hall|meet the characters|who are the characters)\b/.test(text)) return "characters";
  if (/\b(mirrorland|audralia|zionts|h-earth|h earth|world window|south gate|atrium|atlas|interactive narrative)\b/.test(text)) return "mirrorland";
  if (/\b(sean|creator|designer|developer|founder|person behind|mind behind|artist|creative integrity|artistic integrity)\b/.test(text)) return "sean";
  if (/\b(underdog|inner voice|voice under pressure|pressure voice|underestimated)\b/.test(text)) return "underdog";
  if (/\b(nine summits|summits|summit|love|free will|dignity|joy|peace|stability|balance|structure|character)\b/.test(text)) return "summits";
  if (/\b(proof|real|testable|evidence)\b/.test(text)) return "proof";
  if (/\b(route|door|open|where should i go|next door|handoff|path)\b/.test(text)) return "route";

  return "diamondGate";
}

const TARGET_INTENT_MAP = Object.freeze({
  diamondGateOverviewPath: "diamondGate",
  splitInterfaceBridgePath: "splitInterface",
  traditionalWebsiteOverviewPath: "traditionalWebsite",
  narrativePathOverview: "narrativePath",
  missionOverviewPath: "mission",
  missionInnerPath: "mission",
  missionCommunityPath: "mission",
  missionCollaborationPath: "mission",
  practicalRelevancePath: "practicalRelevance",
  diagnosticReferralPath: "diagnosticReferral",
  diagnosticPath: "diagnostic",
  characterMirrorPath: "characterMirror",
  compassPath: "orientation",
  siteGuidePath: "traditionalWebsite",
  lawsPath: "laws",
  proofPath: "proof",
  scientificLawPath: "scientificLaw",
  scientificLawTheoryPath: "scientificLaw",
  scientificLawEvidencePath: "scientificLaw",
  scientificLawMeasurePath: "scientificLaw",
  scientificLawLimitsPath: "scientificLaw",
  gaugesPath: "gauges",
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
  hearthPath: "hearth",
  hearthConstructPath: "hearth",
  hearthFrontierPath: "hearth",
  hearthLawPath: "hearth",
  mirrorlandPath: "mirrorland",
  atriumPath: "mirrorland",
  atlasPath: "mirrorland",
  ziontsPath: "mirrorland",
  audraliaPath: "mirrorland",
  audraliaWorldroomPath: "mirrorland",
  controlCockpitPath: "mirrorland",
  hEarthPath: "mirrorland",
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
  seanPath: "sean",
  underdogPath: "underdog",
  productsPath: "traditionalWebsite",
  nineSummitsPath: "summits",
  nineSummitsBookPath: "summits",
  recenterNode: "recenter",
  loopRecovery: "recenter",
  cleanDoor: "recenter",
  switchTopics: "recenter",
  sharpQuestion: "recenter",
  returnFork: "recenter",
  restartFork: "recenter",
  priorTopicReturnPath: "recenter",
  originReturnPath: "recenter"
});

function isGuidedChooserRequest(ctx) {
  const target = normalizeTarget(ctx.selectedTarget || (ctx.bridgeContext && ctx.bridgeContext.selectedTarget) || "");
  const label = [
    ctx.selectedLabel,
    ctx.visitorText,
    ctx.bridgeContext ? ctx.bridgeContext.selectedLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentReason : ""
  ].join(" ").toLowerCase();

  if (target !== TARGETS.SPLIT_INTERFACE) {
    return /\b(help me choose|choose where|where should i start|where do i begin|guide me|not sure where to start)\b/.test(label);
  }

  return /\b(help me choose|choose where|where should i start|where do i begin|guide me|not sure where to start|clear public map|something practical|story world|mission and meaning|trustworthy|start)\b/.test(label);
}

function inferPromptMode(ctx) {
  if (ctx.promptMode && ctx.promptMode !== "unknown_prompt") return ctx.promptMode;

  const text = [
    ctx.visitorText,
    ctx.selectedLabel,
    ctx.selectedTarget,
    ctx.currentTopic,
    ctx.movement,
    ctx.requestMode
  ].join(" ").toLowerCase();

  if (/\b(why should i trust|trust this|prove|proof|evidence|what proves|why does this matter|what could prove this wrong|can this survive a real test|what would count as proof)\b/.test(text)) return "skeptic_prompt";
  if (/\b(real life|practical|work in the real world|what does this do|how does this work|use this|system|build|frontier|what has to work|what can i actually do|how does the mission become practical)\b/.test(text)) return "practical_prompt";
  if (/\b(inner mission|community mission|myself|personal|pressure|noise|integrity|coherence|underdog|diagnostic|alignment)\b/.test(text)) return "personal_prompt";
  if (/\b(continue|what happens next|next|go deeper|stay with this|show me more|who should i meet first|where should i go from here)\b/.test(text)) return "progression_prompt";
  if (/\b(recenter|lost|back|return|start over|where should i start|cleanest next door|help me choose)\b/.test(text)) return "recenter_prompt";

  return "story_prompt";
}

function inferMovementIntent(ctx) {
  if (ctx.movementIntent && ctx.movementIntent !== "unknown") return ctx.movementIntent;

  const optionKind = normalizeOptionKind(ctx.optionKind);
  if (optionKind === "forward") return "continue_current_path";
  if (optionKind === "return") return "return_one_threshold";
  if (optionKind === "parallel") return "cross_to_related_room";
  if (optionKind === "route") return "open_prepared_door";
  if (optionKind === "control") return "recenter";

  const text = [ctx.visitorText, ctx.selectedLabel, ctx.movement].join(" ").toLowerCase();

  if (/\b(open|visit|go to|launch)\b/.test(text)) return "open_prepared_door";
  if (/\b(return|back|step back)\b/.test(text)) return "return_one_threshold";
  if (/\b(cross|related room|nearby room|how does this connect|bridge)\b/.test(text)) return "cross_to_related_room";
  if (/\b(continue|next|go deeper|show me more)\b/.test(text)) return "continue_current_path";
  if (/\b(recenter|start over|lost|help me choose)\b/.test(text)) return "recenter";

  return "ask_jeeves";
}

function inferDepthMode(ctx) {
  const requested = String(ctx.depthMode || "").toLowerCase();
  if (requested === DEPTH_INTRO || requested === DEPTH_INTERMEDIATE || requested === DEPTH_DEEP) return requested;
  if (ctx.requestMode === "node_enrichment") return DEPTH_INTERMEDIATE;
  if (ctx.selectedTarget && isNarrativeTarget(ctx.selectedTarget)) return DEPTH_INTERMEDIATE;
  if (ctx.revealDepth >= 8 || ctx.topicDepth >= 4 || ctx.pathDepth >= 4) return DEPTH_DEEP;
  if (ctx.revealDepth >= 3 || ctx.topicDepth >= 2 || ctx.pathDepth >= 2) return DEPTH_INTERMEDIATE;

  if (/\b(deep|full|complete|canon|gauge|g-level|g level|why exactly|show the whole|full picture|fine[-\s]?tooth)\b/i.test(ctx.visitorText)) return DEPTH_DEEP;
  if (/\b(connect|relate|where does it sit|how does it fit|why is it near|blueprint|cardinal|directional|bridge|mission)\b/i.test(ctx.visitorText)) return DEPTH_INTERMEDIATE;

  return DEPTH_INTRO;
}

function inferFibonacciStage(ctx) {
  const depth = ctx.depthMode || inferDepthMode(ctx);
  const requested = Number(ctx.revealDepth || 0);
  const routeReady = Number(ctx.routeReadiness || 0);
  const topicDepth = Number(ctx.topicDepth || 0);
  const pathDepth = Number(ctx.pathDepth || 0);
  const loopCount = Number(ctx.loopCount || 0);

  if (requested >= 21 || topicDepth >= 6) return FIBONACCI_STAGES[7];
  if (requested >= 13 || routeReady >= 3 || pathDepth >= 5) return FIBONACCI_STAGES[6];
  if (requested >= 8 || depth === DEPTH_DEEP) return FIBONACCI_STAGES[5];
  if (requested >= 5 || topicDepth >= 3 || loopCount >= 2) return FIBONACCI_STAGES[4];
  if (requested >= 3 || depth === DEPTH_INTERMEDIATE || pathDepth >= 2 || ctx.requestMode === "node_enrichment") return FIBONACCI_STAGES[3];
  if (requested >= 2 || routeReady >= 1) return FIBONACCI_STAGES[2];

  return FIBONACCI_STAGES[0];
}

function retrieveApprovedMemory(ctx) {
  const text = [
    ctx.visitorText,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.requestMode,
    ctx.promptMode,
    ctx.optionKind,
    ctx.archetypeAlignment,
    ctx.currentConversationStage,
    ctx.currentEntryLane,
    ctx.lastLane,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.currentRoomName,
    ctx.currentCoordinateName,
    ctx.currentRoomContext,
    ctx.currentRoomRole,
    ctx.currentRoomPremise,
    ctx.portalLogic,
    ctx.visitorPosture,
    ctx.movement,
    ctx.sessionTrail.join(" "),
    ctx.transitionTrail.map((item) => item.label || "").join(" "),
    ctx.bridgeContext ? ctx.bridgeContext.selectedLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentReason : "",
    ctx.registryContext ? ctx.registryContext.summary : ""
  ].join(" ").toLowerCase();

  const base = buildApprovedMemory();
  const intent = ctx.intent || classifyIntent(ctx);

  const scored = base.map((item) => {
    let score = 0;

    if (ctx.selectedTarget && item.targets.includes(ctx.selectedTarget)) score += 20;
    if (ctx.bridgeContext && item.targets.includes(ctx.bridgeContext.selectedTarget)) score += 10;
    if (ctx.requestMode === "node_enrichment" && item.intents.includes(intent)) score += 5;
    if (ctx.currentNode && item.targets.includes(normalizeTarget(ctx.currentNode))) score += 6;
    if (ctx.currentPath && item.targets.includes(normalizeTarget(ctx.currentPath))) score += 6;
    if (ctx.currentRoomId && item.roomId === ctx.currentRoomId) score += 7;
    if (ctx.currentScopeLane === "narrative" && (item.scope === "narrative" || item.scope === "character")) score += 2;
    if (ctx.currentScopeLane === "objective" && item.scope === "objective") score += 2;
    if (item.intents.includes(intent)) score += 8;

    item.keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) score += 2;
    });

    if (text.includes(item.id.toLowerCase())) score += 4;

    return { item, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_ITEMS)
    .map((entry) => entry.item);

  if (ctx.registryContext && ctx.registryContext.summary) {
    scored.unshift({
      id: ctx.registryContext.id || "frontbrainRegistryContext",
      scope: ctx.currentScopeLane,
      keywords: [],
      routes: ctx.registryContext.routes || [],
      targets: ctx.registryContext.targets || [],
      intents: [intent],
      roomId: "",
      cardinal: AXIS_CENTER,
      summary: ctx.registryContext.summary
    });
  }

  if (!scored.length) {
    return [
      base.find((item) => item.id === "diamondGateBridgeSplitInterface"),
      base.find((item) => item.id === "guidedEntrance"),
      base.find((item) => item.id === "missionThreeLayerStructure"),
      base.find((item) => item.id === "compass")
    ].filter(Boolean);
  }

  return dedupeMemory(scored).slice(0, MAX_CONTEXT_ITEMS);
}

function buildApprovedMemory() {
  const memory = [
    memoryFromRegistry("diamondGateBridgeSplitInterface", {
      scope: "objective",
      keywords: ["diamondgatebridge", "diamond gate bridge", "website", "estate", "site", "what is this", "split interface", "two ways in", "traditional website", "narrative path"],
      routes: [ROUTES.SITE_GUIDE, ROUTES.COMPASS, ROUTES.MIRRORLAND, ROUTES.MEET_SEAN],
      targets: [
        TARGETS.DIAMOND_GATE_OVERVIEW,
        TARGETS.SPLIT_INTERFACE,
        TARGETS.TRADITIONAL_WEBSITE,
        TARGETS.NARRATIVE_PATH,
        TARGETS.MISSION_OVERVIEW,
        TARGETS.PRACTICAL_RELEVANCE
      ],
      intents: ["diamondGate", "splitInterface", "guidedEntrance", "orientation", "traditionalWebsite", "narrativePath", "mission", "practicalRelevance"],
      roomId: "mainHall",
      cardinal: AXIS_CENTER,
      summary:
        DIAMOND_GATE_REGISTRY.splitInterface + " " +
        DIAMOND_GATE_REGISTRY.guidedChooser + " " +
        DIAMOND_GATE_REGISTRY.publicLane + " " +
        DIAMOND_GATE_REGISTRY.narrativeLane + " " +
        DIAMOND_GATE_REGISTRY.bridge
    }),
    memoryFromRegistry("guidedEntrance", {
      scope: "objective",
      keywords: ["help me choose", "where should i start", "where do i begin", "guide me", "start", "clear public map", "story world", "mission and meaning", "trustworthy"],
      routes: [ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND, ROUTES.COMPASS, ROUTES.SCIENTIFIC_LAW],
      targets: [
        TARGETS.SPLIT_INTERFACE,
        TARGETS.TRADITIONAL_WEBSITE,
        TARGETS.PRACTICAL_RELEVANCE,
        TARGETS.NARRATIVE_PATH,
        TARGETS.MISSION_OVERVIEW,
        TARGETS.SCIENTIFIC_LAW
      ],
      intents: ["guidedEntrance", "splitInterface", "orientation"],
      roomId: "guidedEntrance",
      cardinal: AXIS_CENTER,
      summary:
        "The guided entrance helps visitors choose a starting path without requiring them to understand the estate first. The five choices are clear public map, practical use, story world, mission and meaning, and proof/trust."
    }),
    memoryFromRegistry("traditionalWebsiteLane", {
      scope: "objective",
      keywords: ["traditional website", "public website", "public pages", "compass", "products", "laws", "meet sean", "site guide", "public navigation"],
      routes: [ROUTES.SITE_GUIDE, ROUTES.COMPASS, ROUTES.PRODUCTS, ROUTES.LAWS, ROUTES.MEET_SEAN],
      targets: [
        TARGETS.TRADITIONAL_WEBSITE,
        TARGETS.COMPASS,
        TARGETS.PRODUCTS,
        TARGETS.LAWS,
        TARGETS.SEAN,
        TARGETS.SPLIT_INTERFACE,
        TARGETS.NARRATIVE_PATH
      ],
      intents: ["traditionalWebsite", "orientation", "blueprint", "route"],
      roomId: "guideDesk",
      cardinal: AXIS_NORTH,
      summary:
        "The Traditional Website Lane gives the visitor clear public structure: Compass, Products, Laws, Meet Sean, and practical navigation. It should always keep a bridge open into the narrative path when the visitor wants the deeper version."
    }),
    memoryFromRegistry("narrativePathLane", {
      scope: "narrative",
      keywords: ["narrative path", "story path", "mirrorland", "hearth", "characters", "mission", "coherence", "frontier playground", "scientific law", "audralia", "h-earth", "zionts"],
      routes: [ROUTES.MIRRORLAND, ROUTES.HEARTH, ROUTES.CHARACTERS, ROUTES.FRONTIER, ROUTES.SCIENTIFIC_LAW],
      targets: [
        TARGETS.NARRATIVE_PATH,
        TARGETS.MISSION_OVERVIEW,
        TARGETS.MIRRORLAND,
        TARGETS.HEARTH,
        TARGETS.CHARACTERS,
        TARGETS.FRONTIER,
        TARGETS.SCIENTIFIC_LAW,
        TARGETS.TRADITIONAL_WEBSITE,
        TARGETS.SPLIT_INTERFACE
      ],
      intents: ["narrativePath", "mission", "mirrorland", "hearth", "characters", "frontier", "scientificLaw"],
      roomId: "atrium",
      cardinal: AXIS_SOUTH,
      summary:
        "The Narrative Path carries the deeper mission: coherence, self-recognition, Hearth, Mirrorland, Characters, Frontier Playground, Scientific Law, Audralia, H-Earth, and ZIONTS. It should always allow a bridge back to traditional website structure."
    }),
    memoryFromRegistry("missionThreeLayerStructure", {
      scope: "narrative",
      keywords: ["mission", "inner mission", "community mission", "service", "bullying", "children", "animals", "collaboration", "teamwork", "coherence", "higher self", "integrity", "growth"],
      routes: [ROUTES.MIRRORLAND, ROUTES.FRONTIER, ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.COMPASS],
      targets: [
        TARGETS.MISSION_OVERVIEW,
        TARGETS.MISSION_INNER,
        TARGETS.MISSION_COMMUNITY,
        TARGETS.MISSION_COLLABORATION,
        TARGETS.NARRATIVE_PATH,
        TARGETS.FRONTIER,
        TARGETS.PRACTICAL_RELEVANCE,
        TARGETS.DIAGNOSTIC_REFERRAL
      ],
      intents: ["mission", "narrativePath", "practicalRelevance", "diagnosticReferral"],
      roomId: "mission",
      cardinal: AXIS_SOUTH_NORTH,
      summary:
        MISSION_REGISTRY.general + " " +
        MISSION_REGISTRY.inner + " " +
        MISSION_REGISTRY.community + " " +
        MISSION_REGISTRY.collaboration + " " +
        MISSION_REGISTRY.frontier
    }),
    memoryFromRegistry("bridgePairs", {
      scope: "objective",
      keywords: ["bridge", "connect", "how do they connect", "traditional to narrative", "mirrorland to website", "compass to hearth", "products to frontier", "laws to scientific law"],
      routes: [ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND, ROUTES.COMPASS, ROUTES.HEARTH, ROUTES.FRONTIER, ROUTES.SCIENTIFIC_LAW],
      targets: [
        TARGETS.SPLIT_INTERFACE,
        TARGETS.TRADITIONAL_WEBSITE,
        TARGETS.NARRATIVE_PATH,
        TARGETS.COMPASS,
        TARGETS.HEARTH,
        TARGETS.PRODUCTS,
        TARGETS.FRONTIER,
        TARGETS.LAWS,
        TARGETS.SCIENTIFIC_LAW
      ],
      intents: ["splitInterface", "route", "orientation", "narrativePath", "traditionalWebsite"],
      roomId: "bridgeMap",
      cardinal: AXIS_CENTER,
      summary: Object.keys(BRIDGE_PAIR_REGISTRY).map((key) => BRIDGE_PAIR_REGISTRY[key].line).join(" ")
    }),
    memoryFromRegistry("diagnosticReferralBoundary", {
      scope: "objective",
      keywords: ["diagnostic", "coherence diagnostic", "alignment diagnostic", "archetype", "character mirror", "assess", "assessment", "score", "which character", "which archetype", "most like"],
      routes: [ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.CHARACTERS],
      targets: [TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.DIAGNOSTIC, TARGETS.CHARACTER_MIRROR, TARGETS.CHARACTERS],
      intents: ["diagnosticReferral", "diagnostic", "characterMirror"],
      roomId: "diagnosticReferral",
      cardinal: AXIS_WEST_SOUTH,
      summary:
        COHERENCE_DIAGNOSTIC_REGISTRY.summary + " " +
        COHERENCE_DIAGNOSTIC_REGISTRY.boundaries + " " +
        COHERENCE_DIAGNOSTIC_REGISTRY.jeevesBoundary
    }),
    memoryFromRegistry("scientificLaw", {
      scope: "objective",
      keywords: ["scientific law", "reality test", "theory", "evidence", "measure", "limits", "claim", "falsifiability", "repeatability"],
      routes: [ROUTES.SCIENTIFIC_LAW, ROUTES.LAWS, ROUTES.GAUGES],
      targets: [
        TARGETS.SCIENTIFIC_LAW,
        TARGETS.SCIENTIFIC_LAW_THEORY,
        TARGETS.SCIENTIFIC_LAW_EVIDENCE,
        TARGETS.SCIENTIFIC_LAW_MEASURE,
        TARGETS.SCIENTIFIC_LAW_LIMITS,
        TARGETS.SCIENTIFIC_LAW_ROUTE,
        TARGETS.SCIENTIFIC_LAW_LADDER,
        TARGETS.FRONTIER_LAW,
        TARGETS.LAWS,
        TARGETS.GAUGES
      ],
      intents: ["scientificLaw", "proof", "laws"],
      roomId: "scientificLaw",
      cardinal: AXIS_WEST,
      summary: SCIENTIFIC_LAW_REGISTRY.summary + " " + SCIENTIFIC_LAW_REGISTRY.coreTruth
    }),
    memoryFromRegistry("frontier", {
      scope: "narrative",
      keywords: ["frontier", "frontier playground", "energy", "fusion", "water", "waste", "closed loop", "infrastructure", "lattice", "urban", "manual", "shimmer", "trajectory", "vision"],
      routes: [ROUTES.FRONTIER, ROUTES.AUDRALIA, ROUTES.LAWS, ROUTES.GAUGES, ROUTES.HEARTH, ROUTES.PRODUCTS],
      targets: [TARGETS.FRONTIER, TARGETS.FRONTIER_SYSTEMS, TARGETS.FRONTIER_LAW, TARGETS.FRONTIER_CHARACTERS, TARGETS.HEARTH_FRONTIER, TARGETS.PRODUCTS, TARGETS.MISSION_COLLABORATION, TARGETS.PRACTICAL_RELEVANCE],
      intents: ["frontier", "mirrorland", "hearth", "practicalRelevance", "mission"],
      roomId: "frontier",
      cardinal: AXIS_EAST,
      summary: FRONTIER_REGISTRY.summary + " " + FRONTIER_REGISTRY.conjugation
    }),
    memoryFromRegistry("hearthConstruct", {
      scope: "narrative",
      keywords: ["hearth", "mission control", "window within the window", "construct facility", "construct engine", "planetary", "world-formation", "portal", "unknown future"],
      routes: [ROUTES.HEARTH, ROUTES.FRONTIER, ROUTES.SCIENTIFIC_LAW, ROUTES.MIRRORLAND],
      targets: [TARGETS.HEARTH, TARGETS.HEARTH_CONSTRUCT, TARGETS.HEARTH_FRONTIER, TARGETS.HEARTH_LAW, TARGETS.FRONTIER, TARGETS.SCIENTIFIC_LAW, TARGETS.MIRRORLAND, TARGETS.COMPASS],
      intents: ["hearth", "frontier", "scientificLaw", "mirrorland", "narrativePath"],
      roomId: "hearth",
      cardinal: AXIS_EAST,
      summary:
        HEARTH_CONSTRUCT_REGISTRY.summary + " " +
        HEARTH_CONSTRUCT_REGISTRY.portalLine + " " +
        HEARTH_CONSTRUCT_REGISTRY.spine
    }),
    memoryFromRegistry("mirrorland", {
      scope: "narrative",
      keywords: ["mirrorland", "audralia", "zionts", "h-earth", "h earth", "future", "shadow", "story", "world window"],
      routes: [ROUTES.MIRRORLAND, ROUTES.HEARTH, ROUTES.AUDRALIA, ROUTES.FRONTIER, ROUTES.CHARACTERS, ROUTES.SITE_GUIDE],
      targets: [TARGETS.MIRRORLAND, TARGETS.ATRIUM, TARGETS.ATLAS, TARGETS.HEARTH, TARGETS.AUDRALIA, TARGETS.FRONTIER, TARGETS.CHARACTERS, TARGETS.TRADITIONAL_WEBSITE, TARGETS.SPLIT_INTERFACE],
      intents: ["mirrorland", "hearth", "frontier", "characters", "narrativePath"],
      roomId: "mirrorland",
      cardinal: AXIS_SOUTH,
      summary: MIRRORLAND_REGISTRY.summary + " " + MIRRORLAND_REGISTRY.triad + " " + MIRRORLAND_REGISTRY.crossing + " " + MIRRORLAND_REGISTRY.hearthRelation
    }),
    memoryFromRegistry("characters", {
      scope: "character",
      keywords: ["characters", "character hall", "character mirror", "who are the characters", "meet the characters"],
      routes: [ROUTES.CHARACTERS, ROUTES.MIRRORLAND, ROUTES.COHERENCE_DIAGNOSTIC],
      targets: [TARGETS.CHARACTERS, TARGETS.CHARACTER_IDENTITY, TARGETS.CHARACTER_FIRST, TARGETS.CHARACTER_RELATIONSHIPS, TARGETS.CHARACTER_STORY_PRESSURE, TARGETS.CHARACTER_MIRROR, TARGETS.DIAGNOSTIC_REFERRAL],
      intents: ["characters", "characterMirror", "diagnosticReferral", "narrativePath"],
      roomId: "characters",
      cardinal: AXIS_SOUTH,
      summary:
        "The Characters turn Mirrorland from abstract explanation into encounter. Jeeves can introduce and explain them, but he does not classify the visitor as a Character."
    }),
    memoryFromRegistry("creator", {
      scope: "objective",
      keywords: ["sean", "creator", "designer", "developer", "person behind", "mind behind", "founder", "artistic integrity", "creative integrity"],
      routes: [ROUTES.MEET_SEAN, ROUTES.UNDERDOG, ROUTES.NINE_SUMMITS],
      targets: [TARGETS.SEAN, TARGETS.UNDERDOG, TARGETS.NINE_SUMMITS, TARGETS.PRODUCTS, TARGETS.TRADITIONAL_WEBSITE],
      intents: ["sean", "orientation", "summits", "traditionalWebsite"],
      roomId: "meetSean",
      cardinal: AXIS_NORTH,
      summary: CREATOR_REGISTRY.summary + " " + CREATOR_REGISTRY.depth
    }),
    memoryFromRegistry("thisUnderdog", {
      scope: "objective",
      keywords: ["this underdog", "underdog", "inner voice", "voice", "pressure", "becoming", "language", "underestimated"],
      routes: [ROUTES.UNDERDOG, ROUTES.MEET_SEAN, ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.NINE_SUMMITS],
      targets: [TARGETS.UNDERDOG, TARGETS.SEAN, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.NINE_SUMMITS],
      intents: ["underdog", "diagnosticReferral", "summits"],
      roomId: "thisUnderdog",
      cardinal: AXIS_NORTH,
      summary: UNDERDOG_REGISTRY.summary + " " + UNDERDOG_REGISTRY.depth
    }),
    memoryFromRegistry("nineSummits", {
      scope: "objective",
      keywords: ["nine summits", "summits", "love", "256 carats", "character", "structure", "balance", "stability", "peace", "joy", "dignity", "free will"],
      routes: [ROUTES.NINE_SUMMITS, ROUTES.MEET_SEAN, ROUTES.UNDERDOG],
      targets: [TARGETS.NINE_SUMMITS, TARGETS.NINE_SUMMITS_BOOK, TARGETS.SEAN, TARGETS.UNDERDOG],
      intents: ["summits", "sean", "underdog"],
      roomId: "nineSummits",
      cardinal: AXIS_SOUTH_NORTH,
      summary: SUMMITS_REGISTRY.summary + " " + SUMMITS_REGISTRY.bookSummary + " " + SUMMITS_REGISTRY.carats
    }),
    memoryFromRegistry("gauges", {
      scope: "objective",
      keywords: ["gauges", "gauge", "triple g", "goals gauges gaps", "readiness", "pass", "hold", "fail"],
      routes: [ROUTES.GAUGES, ROUTES.LAWS, ROUTES.SCIENTIFIC_LAW],
      targets: [TARGETS.GAUGES, TARGETS.LAWS, TARGETS.SCIENTIFIC_LAW],
      intents: ["gauges", "proof", "scientificLaw"],
      roomId: "theLab",
      cardinal: AXIS_WEST,
      summary: GAUGE_REGISTRY.summary
    })
  ];

  Object.keys(GUIDE_BLUEPRINT_ROOMS).forEach((key) => {
    const room = GUIDE_BLUEPRINT_ROOMS[key];

    memory.push(memoryFromRegistry("blueprint:" + key, {
      scope: room.cardinal === AXIS_SOUTH || room.cardinal === AXIS_EAST || room.cardinal === AXIS_SOUTHEAST || room.cardinal === AXIS_SOUTHWEST ? "narrative" : "objective",
      keywords: [key, room.title.toLowerCase(), room.roomId.toLowerCase()],
      routes: [room.route],
      targets: [room.target],
      intents: ["blueprint", "orientation", "route"],
      roomId: room.roomId,
      cardinal: room.cardinal,
      summary: room.title + ": " + room.placement
    }));
  });

  Object.keys(CHARACTER_REGISTRY).forEach((id) => {
    const character = CHARACTER_REGISTRY[id];

    memory.push(memoryFromRegistry("character:" + id, {
      scope: "character",
      keywords: character.keywords,
      routes: [ROUTES.CHARACTERS],
      targets: [character.target, TARGETS.CHARACTERS, TARGETS.CHARACTER_RELATIONSHIPS, TARGETS.CHARACTER_MIRROR, TARGETS.DIAGNOSTIC_REFERRAL],
      intents: ["characters", "characterMirror"],
      roomId: "characters",
      cardinal: AXIS_SOUTH,
      summary: character.name + " is the " + character.title + ". " + character.oneLine + " Mirror signal: " + character.mirror
    }));
  });

  Object.keys(FRONTIER_REGISTRY.systems).forEach((id) => {
    const system = FRONTIER_REGISTRY.systems[id];

    memory.push(memoryFromRegistry("frontier:" + id, {
      scope: "narrative",
      keywords: [id, system.name.toLowerCase(), system.title.toLowerCase()],
      routes: [system.route, ROUTES.FRONTIER],
      targets: [system.target, TARGETS.FRONTIER_SYSTEMS, TARGETS.FRONTIER_LAW, TARGETS.HEARTH_FRONTIER, TARGETS.MISSION_COLLABORATION, TARGETS.PRACTICAL_RELEVANCE],
      intents: ["frontier", "practicalRelevance", "mission"],
      roomId: "frontier",
      cardinal: AXIS_EAST,
      summary: system.name + " / " + system.title + ": " + system.platform
    }));
  });

  return memory;
}

function memoryFromRegistry(id, item) {
  return {
    id,
    scope: item.scope || "objective",
    keywords: item.keywords || [],
    routes: (item.routes || []).map(normalizeRoute),
    targets: (item.targets || []).map(normalizeTarget),
    intents: item.intents || [],
    roomId: item.roomId || "",
    cardinal: item.cardinal || AXIS_CENTER,
    summary: item.summary || ""
  };
}

function dedupeMemory(items) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    if (!item || !item.id || seen.has(item.id)) return;
    seen.add(item.id);
    result.push(item);
  });

  return result;
}

function buildAllowedSets(ctx, memory) {
  const routeSet = new Set((ctx.allowedRoutes || []).map(normalizeRoute));
  const targetSet = new Set((ctx.allowedTargets || []).map(normalizeTarget));

  if (ctx.selectedTarget && APPROVED_TARGETS.has(ctx.selectedTarget)) targetSet.add(ctx.selectedTarget);
  if (ctx.bridgeContext && ctx.bridgeContext.selectedTarget && APPROVED_TARGETS.has(ctx.bridgeContext.selectedTarget)) targetSet.add(ctx.bridgeContext.selectedTarget);

  memory.forEach((item) => {
    (item.routes || []).forEach((route) => {
      if (APPROVED_ROUTE_IDS.has(route)) routeSet.add(route);
    });

    (item.targets || []).forEach((target) => {
      if (APPROVED_TARGETS.has(target)) targetSet.add(target);
    });
  });

  expandAllowedByIntent(ctx.intent || classifyIntent(ctx), targetSet, routeSet);

  if (!targetSet.size) {
    [
      TARGETS.SPLIT_INTERFACE,
      TARGETS.DIAMOND_GATE_OVERVIEW,
      TARGETS.TRADITIONAL_WEBSITE,
      TARGETS.PRACTICAL_RELEVANCE,
      TARGETS.NARRATIVE_PATH,
      TARGETS.MISSION_OVERVIEW
    ].forEach((target) => targetSet.add(target));
  }

  if (!routeSet.size) {
    [ROUTES.COMPASS, ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND].forEach((route) => routeSet.add(route));
  }

  [
    TARGETS.CLEAN_DOOR,
    TARGETS.RETURN_FORK,
    TARGETS.PRIOR_TOPIC_RETURN,
    TARGETS.ORIGIN_RETURN,
    TARGETS.SWITCH_TOPICS,
    TARGETS.SHARP_QUESTION,
    TARGETS.RECENTER
  ].forEach((target) => targetSet.add(target));

  return { routeSet, targetSet };
}

function expandAllowedByIntent(intent, targetSet, routeSet) {
  const addTargets = (items) => items.forEach((target) => APPROVED_TARGETS.has(target) && targetSet.add(target));
  const addRoutes = (items) => items.forEach((route) => APPROVED_ROUTE_IDS.has(route) && routeSet.add(route));

  if (intent === "guidedEntrance" || intent === "diamondGate" || intent === "splitInterface" || intent === "orientation" || intent === "unknown") {
    addTargets([
      TARGETS.SPLIT_INTERFACE,
      TARGETS.DIAMOND_GATE_OVERVIEW,
      TARGETS.TRADITIONAL_WEBSITE,
      TARGETS.PRACTICAL_RELEVANCE,
      TARGETS.NARRATIVE_PATH,
      TARGETS.MISSION_OVERVIEW,
      TARGETS.SCIENTIFIC_LAW,
      TARGETS.MIRRORLAND,
      TARGETS.COMPASS,
      TARGETS.SITE_GUIDE,
      TARGETS.SEAN
    ]);
    addRoutes([ROUTES.MIRRORLAND, ROUTES.SITE_GUIDE, ROUTES.COMPASS, ROUTES.MEET_SEAN, ROUTES.SCIENTIFIC_LAW]);
  }

  if (intent === "traditionalWebsite" || intent === "blueprint") {
    addTargets([TARGETS.TRADITIONAL_WEBSITE, TARGETS.COMPASS, TARGETS.SITE_GUIDE, TARGETS.PRODUCTS, TARGETS.LAWS, TARGETS.SEAN, TARGETS.SPLIT_INTERFACE, TARGETS.NARRATIVE_PATH]);
    addRoutes([ROUTES.SITE_GUIDE, ROUTES.COMPASS, ROUTES.PRODUCTS, ROUTES.LAWS, ROUTES.MEET_SEAN, ROUTES.MIRRORLAND]);
  }

  if (intent === "narrativePath" || intent === "mirrorland") {
    addTargets([TARGETS.NARRATIVE_PATH, TARGETS.MISSION_OVERVIEW, TARGETS.MISSION_INNER, TARGETS.MIRRORLAND, TARGETS.HEARTH, TARGETS.CHARACTERS, TARGETS.FRONTIER, TARGETS.SCIENTIFIC_LAW, TARGETS.TRADITIONAL_WEBSITE, TARGETS.SPLIT_INTERFACE]);
    addRoutes([ROUTES.MIRRORLAND, ROUTES.HEARTH, ROUTES.CHARACTERS, ROUTES.FRONTIER, ROUTES.SCIENTIFIC_LAW, ROUTES.SITE_GUIDE]);
  }

  if (intent === "mission") {
    addTargets([TARGETS.MISSION_OVERVIEW, TARGETS.MISSION_INNER, TARGETS.MISSION_COMMUNITY, TARGETS.MISSION_COLLABORATION, TARGETS.NARRATIVE_PATH, TARGETS.MIRRORLAND, TARGETS.FRONTIER, TARGETS.PRACTICAL_RELEVANCE, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.TRADITIONAL_WEBSITE]);
    addRoutes([ROUTES.MIRRORLAND, ROUTES.FRONTIER, ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.SITE_GUIDE, ROUTES.COMPASS]);
  }

  if (intent === "practicalRelevance") {
    addTargets([TARGETS.PRACTICAL_RELEVANCE, TARGETS.MISSION_COLLABORATION, TARGETS.FRONTIER, TARGETS.PRODUCTS, TARGETS.SCIENTIFIC_LAW, TARGETS.LAWS, TARGETS.NARRATIVE_PATH, TARGETS.TRADITIONAL_WEBSITE]);
    addRoutes([ROUTES.FRONTIER, ROUTES.PRODUCTS, ROUTES.SCIENTIFIC_LAW, ROUTES.LAWS, ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND]);
  }

  if (intent === "diagnosticReferral" || intent === "diagnostic" || intent === "characterMirror") {
    addTargets([TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.DIAGNOSTIC, TARGETS.CHARACTER_MIRROR, TARGETS.CHARACTERS, TARGETS.MISSION_INNER, TARGETS.SCIENTIFIC_LAW, TARGETS.CLEAN_DOOR]);
    addRoutes([ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.CHARACTERS, ROUTES.SCIENTIFIC_LAW]);
  }

  if (intent === "scientificLaw" || intent === "proof" || intent === "laws") {
    addTargets([TARGETS.LAWS, TARGETS.SCIENTIFIC_LAW, TARGETS.SCIENTIFIC_LAW_THEORY, TARGETS.SCIENTIFIC_LAW_EVIDENCE, TARGETS.SCIENTIFIC_LAW_MEASURE, TARGETS.SCIENTIFIC_LAW_LIMITS, TARGETS.SCIENTIFIC_LAW_ROUTE, TARGETS.SCIENTIFIC_LAW_LADDER, TARGETS.SCIENTIFIC_LAW_TERMS, TARGETS.FRONTIER_LAW, TARGETS.GAUGES, TARGETS.SPLIT_INTERFACE, TARGETS.CLEAN_DOOR]);
    addRoutes([ROUTES.SCIENTIFIC_LAW, ROUTES.LAWS, ROUTES.GAUGES]);
  }

  if (intent === "frontier") {
    addTargets([TARGETS.FRONTIER, TARGETS.FRONTIER_SYSTEMS, TARGETS.FRONTIER_ENERGY, TARGETS.FRONTIER_WATER, TARGETS.FRONTIER_WASTE, TARGETS.FRONTIER_CLOSED_LOOP, TARGETS.FRONTIER_INFRASTRUCTURE, TARGETS.FRONTIER_LATTICE, TARGETS.FRONTIER_URBAN, TARGETS.FRONTIER_MANUAL, TARGETS.FRONTIER_SHIMMER, TARGETS.FRONTIER_TRAJECTORY, TARGETS.FRONTIER_VISION, TARGETS.HEARTH_FRONTIER, TARGETS.FRONTIER_LAW, TARGETS.FRONTIER_CHARACTERS, TARGETS.PRODUCTS, TARGETS.MISSION_COLLABORATION, TARGETS.PRACTICAL_RELEVANCE, TARGETS.CLEAN_DOOR]);
    addRoutes([ROUTES.FRONTIER, ROUTES.FRONTIER_ENERGY, ROUTES.FRONTIER_WATER, ROUTES.FRONTIER_WASTE, ROUTES.FRONTIER_CLOSED_LOOP, ROUTES.FRONTIER_INFRASTRUCTURE, ROUTES.FRONTIER_LATTICE, ROUTES.FRONTIER_URBAN, ROUTES.FRONTIER_MANUAL, ROUTES.FRONTIER_SHIMMER, ROUTES.FRONTIER_TRAJECTORY, ROUTES.FRONTIER_VISION, ROUTES.AUDRALIA, ROUTES.PRODUCTS]);
  }

  if (intent === "hearth") {
    addTargets([TARGETS.HEARTH, TARGETS.HEARTH_CONSTRUCT, TARGETS.HEARTH_FRONTIER, TARGETS.HEARTH_LAW, TARGETS.FRONTIER, TARGETS.SCIENTIFIC_LAW, TARGETS.MIRRORLAND, TARGETS.COMPASS, TARGETS.CLEAN_DOOR]);
    addRoutes([ROUTES.HEARTH, ROUTES.FRONTIER, ROUTES.SCIENTIFIC_LAW, ROUTES.MIRRORLAND, ROUTES.COMPASS]);
  }

  if (intent === "characters") {
    addTargets([TARGETS.CHARACTERS, TARGETS.CHARACTER_AUREN, TARGETS.CHARACTER_DEXTRION, TARGETS.CHARACTER_ALARIC, TARGETS.CHARACTER_TARIAN, TARGETS.CHARACTER_ELARA, TARGETS.CHARACTER_SOREN, TARGETS.CHARACTER_JEEVES, TARGETS.CHARACTER_REMOTE_TEAM, TARGETS.CHARACTER_RELATIONSHIPS, TARGETS.CHARACTER_STORY_PRESSURE, TARGETS.CHARACTER_FIRST, TARGETS.CHARACTER_MIRROR, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.MIRRORLAND]);
    addRoutes([ROUTES.CHARACTERS, ROUTES.MIRRORLAND, ROUTES.COHERENCE_DIAGNOSTIC]);
  }

  if (intent === "sean") {
    addTargets([TARGETS.SEAN, TARGETS.UNDERDOG, TARGETS.NINE_SUMMITS, TARGETS.NINE_SUMMITS_BOOK, TARGETS.PRODUCTS, TARGETS.TRADITIONAL_WEBSITE]);
    addRoutes([ROUTES.MEET_SEAN, ROUTES.UNDERDOG, ROUTES.NINE_SUMMITS, ROUTES.PRODUCTS, ROUTES.SITE_GUIDE]);
  }

  if (intent === "underdog") {
    addTargets([TARGETS.UNDERDOG, TARGETS.SEAN, TARGETS.NINE_SUMMITS, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.MISSION_INNER]);
    addRoutes([ROUTES.UNDERDOG, ROUTES.MEET_SEAN, ROUTES.NINE_SUMMITS, ROUTES.COHERENCE_DIAGNOSTIC]);
  }

  if (intent === "summits") {
    addTargets([TARGETS.NINE_SUMMITS, TARGETS.NINE_SUMMITS_BOOK, TARGETS.UNDERDOG, TARGETS.SEAN, TARGETS.MISSION_OVERVIEW]);
    addRoutes([ROUTES.NINE_SUMMITS, ROUTES.UNDERDOG, ROUTES.MEET_SEAN]);
  }

  if (intent === "recenter" || intent === "route") {
    addTargets([TARGETS.SPLIT_INTERFACE, TARGETS.DIAMOND_GATE_OVERVIEW, TARGETS.COMPASS, TARGETS.SITE_GUIDE, TARGETS.TRADITIONAL_WEBSITE, TARGETS.NARRATIVE_PATH, TARGETS.MISSION_OVERVIEW, TARGETS.LAWS, TARGETS.SCIENTIFIC_LAW, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.MIRRORLAND, TARGETS.FRONTIER, TARGETS.PRODUCTS, TARGETS.CLEAN_DOOR, TARGETS.RETURN_FORK, TARGETS.SWITCH_TOPICS, TARGETS.SHARP_QUESTION]);
    addRoutes([ROUTES.COMPASS, ROUTES.SITE_GUIDE, ROUTES.LAWS, ROUTES.SCIENTIFIC_LAW, ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.MIRRORLAND, ROUTES.FRONTIER]);
  }
}

function shouldReturnDiagnosticReferral(ctx) {
  const intent = ctx.intent || classifyIntent(ctx);
  if (intent === "diagnosticReferral") return true;

  const text = [
    ctx.visitorText,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.currentTopic,
    ctx.requestedMode,
    ctx.bridgeContext ? ctx.bridgeContext.selectedLabel : "",
    ctx.bridgeContext ? ctx.bridgeContext.adjacentLabel : ""
  ].join(" ").toLowerCase();

  return /\b(which archetype|what archetype|which character am i|what character am i|most like|assess me|score me|diagnose me|classify me|type me|run the mirror question|ask me the mirror question|first mirror question|second mirror question|third mirror question)\b/.test(text);
}

function buildGuidedChooserResponse(_ctx) {
  return {
    bubbles: [
      "Yes. I can help you choose where to start.",
      "Tell me what you are looking for first: a clear public map, something practical, the story world, the mission, or the proof behind the work.",
      "I’ll use that direction to place you on the public path or the narrative path without making you guess the structure."
    ],
    options: [
      makePromptOption("I want the clear public map.", TARGETS.TRADITIONAL_WEBSITE, "story_prompt", "story_entry"),
      makePromptOption("I want something practical I can use.", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry"),
      makePromptOption("I want the story world.", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry"),
      makePromptOption("I want the mission and meaning.", TARGETS.MISSION_OVERVIEW, "personal_prompt", "personal_entry"),
      makePromptOption("I want to know what makes this trustworthy.", TARGETS.SCIENTIFIC_LAW, "skeptic_prompt", "proof_entry")
    ],
    handoffs: [ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND, ROUTES.COMPASS, ROUTES.SCIENTIFIC_LAW]
  };
}

function buildDiagnosticReferralResponse(_ctx) {
  return {
    bubbles: [
      "I can explain how the Character Mirror and the Coherence Diagnostic connect, but I do not assess you here.",
      "Jeeves is here to orient you, introduce the estate, explain the Characters, and guide the paths.",
      "If you want an alignment read, that belongs in the Coherence Diagnostic."
    ],
    options: [
      makePromptOption("What is the Coherence Diagnostic?", TARGETS.DIAGNOSTIC, "personal_prompt", "personal_entry"),
      makePromptOption("What does the Character Mirror show?", TARGETS.CHARACTER_MIRROR, "story_prompt", "story_entry"),
      makePromptOption("How does this connect to the narrative path?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry")
    ],
    handoffs: [ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.CHARACTERS],
    confidence: "high",
    conclusiveState: "switch_recommended"
  };
}

function makePromptOption(label, target, promptMode, archetypeAlignment) {
  const normalizedTarget = normalizeTarget(target);

  return {
    label: capString(label, 110),
    target: normalizedTarget,
    type: "conversation",
    scopeLane: isNarrativeTarget(normalizedTarget) ? "narrative" : "objective",
    promptMode: normalizePromptMode(promptMode),
    optionKind: "conversation_prompt",
    archetypeAlignment: normalizeArchetypeAlignment(archetypeAlignment),
    bridgeMoment: "before_knowledge",
    movementIntent: "ask_jeeves"
  };
}

function makeControlOption(label, target) {
  return {
    label: capString(label, 110),
    target: normalizeTarget(target),
    type: "control",
    scopeLane: "objective",
    promptMode: "recenter_prompt",
    optionKind: "control",
    archetypeAlignment: "unknown_entry",
    bridgeMoment: "recenter_fork",
    movementIntent: "recenter"
  };
}

function defaultRecenterOptions() {
  return [
    makeControlOption("Can you help me choose where to start?", TARGETS.SPLIT_INTERFACE),
    makePromptOption("What is DiamondGateBridge.com?", TARGETS.DIAMOND_GATE_OVERVIEW, "story_prompt", "story_entry"),
    makePromptOption("What is the traditional website for?", TARGETS.TRADITIONAL_WEBSITE, "story_prompt", "story_entry"),
    makePromptOption("What is the narrative path?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry"),
    makePromptOption("Where can I take the alignment diagnostic?", TARGETS.DIAGNOSTIC_REFERRAL, "personal_prompt", "personal_entry")
  ];
}

function deterministicFallbackBubbles(ctx, memory) {
  const intent = ctx.intent || classifyIntent(ctx);

  if (intent === "guidedEntrance") return buildGuidedChooserResponse(ctx).bubbles;
  if (intent === "diagnosticReferral" || intent === "characterMirror") return buildDiagnosticReferralResponse(ctx).bubbles;

  if (intent === "diamondGate") {
    return [
      "DiamondGateBridge.com has two ways in.",
      "One side is the traditional website: the public pages, Compass, Products, Laws, and the creator path.",
      "The other side is the narrative path: rooms, worlds, Characters, proof, mission, and future-facing systems.",
      "You can choose either side, and I can bridge you from one into the other when the time is right."
    ];
  }

  if (intent === "splitInterface") {
    return [
      "The two sides are separate entrances, not separate estates.",
      "The traditional website gives clear public structure. The narrative path carries the deeper mission through Mirrorland, Hearth, Characters, and the Frontier Playground.",
      "A visitor can start on either side, then cross over when they need more context, proof, story, or practical direction."
    ];
  }

  if (intent === "traditionalWebsite") {
    return [
      "The traditional website is the clear public side of DiamondGateBridge.",
      "It gives visitors the Compass, Products, Laws, Meet Sean, and the readable site structure.",
      "From there, I can keep you in the public structure or bridge you into the narrative version of the same ideas."
    ];
  }

  if (intent === "narrativePath") {
    return [
      "The narrative path is the deeper guided side of the estate.",
      "It carries the mission through Hearth, Mirrorland, Characters, Scientific Law, and the Frontier Playground.",
      "It is not separate from the website. It is the story-facing way to understand the same structure more deeply."
    ];
  }

  if (intent === "mission") {
    return [
      "The mission has one larger center and several living expressions.",
      "The larger center is clarity, integrity, collaboration, and better shared direction.",
      "One expression turns inward: helping people move through noise and pressure without losing themselves.",
      "Another turns outward: service, standing against bullying, protecting children and animals, and building stronger community support."
    ];
  }

  if (intent === "practicalRelevance") {
    return [
      "This matters because clarity has to survive contact with the real world.",
      "DiamondGateBridge is not only a story or a website. It is a way to organize pressure, proof, systems, service, and direction.",
      "That is why the path eventually reaches the Frontier Playground, Scientific Law, Products, and community-facing work."
    ];
  }

  if (intent === "scientificLaw" || intent === "proof" || intent === "laws") {
    return [
      "Scientific Law is the room where convincing language has to become testable.",
      SCIENTIFIC_LAW_REGISTRY.coreTruth,
      "The four main doors are Theory, Evidence, Measure, and Limits."
    ];
  }

  if (intent === "frontier") {
    return [
      "Frontier Playground is where future ideas have to survive contact with practical systems.",
      "Energy, water, waste, infrastructure, feedback, cities, direction, and visible signals all have to answer the same question: can this work in the real world?",
      "The clean next move is to choose a system or send the claim back through proof."
    ];
  }

  if (intent === "hearth") {
    return [
      HEARTH_CONSTRUCT_REGISTRY.primaryLine,
      "You are in the inner control window. Mirrorland is the larger future-facing field; Hearth is where the view gets coordinated before it becomes a route, test, or consequence.",
      "From here, you can ask what Hearth coordinates, why it answers to proof, or how it bridges back to the Compass."
    ];
  }

  if (intent === "characters") {
    return [
      "Mirrorland does not stay abstract for long. The story becomes clearer when the Characters enter it.",
      "Each Character carries a necessary part of the larger story: shelter, repair, warning, survival, signal, boundary, sequence, or distributed help.",
      "I can introduce them, explain what they carry, or show how the Character Mirror connects to the Diagnostic."
    ];
  }

  if (intent === "mirrorland") {
    return [
      "Mirrorland is where possible futures become visible before they become final.",
      MIRRORLAND_REGISTRY.triad,
      "If you stay here, the next step is simple: understand the roads, then meet the people who make those roads matter."
    ];
  }

  if (intent === "sean") {
    return [
      CREATOR_REGISTRY.summary,
      CREATOR_REGISTRY.depth,
      "That road connects naturally to This Underdog and Nine Summits because the creator, the pressure voice, and the value road belong together."
    ];
  }

  if (intent === "underdog") {
    return [
      UNDERDOG_REGISTRY.summary,
      UNDERDOG_REGISTRY.depth,
      "This is why the underdog path sits near the mirror: both ask how pressure becomes behavior, voice, and direction."
    ];
  }

  if (intent === "summits") {
    return [
      SUMMITS_REGISTRY.summary,
      SUMMITS_REGISTRY.bookSummary,
      "The value road is not just a page. It is the climb from pressure toward love, dignity, free will, and direction."
    ];
  }

  if (intent === "gauges") {
    return [
      GAUGE_REGISTRY.summary,
      "The practical read is Goals, Gauges, and Gaps: what it aims to be, what can be measured, and what still remains unresolved.",
      "That makes Triple G the room for readiness, not decoration."
    ];
  }

  const characterId = findCharacterIdFromText(ctx.visitorText + " " + ctx.selectedTarget + " " + ctx.selectedLabel + " " + ctx.currentNode + " " + ctx.currentEntry);
  if (characterId) {
    const character = CHARACTER_REGISTRY[characterId];
    return [
      character.name + " is the " + character.title + ".",
      character.oneLine,
      character.pressure,
      character.function
    ];
  }

  const primary = memory && memory[0] ? memory[0] : null;

  if (primary) {
    return [
      primary.summary,
      "I can keep answering this directly, ask a sharper question, or point you to the cleanest next door."
    ].map((line) => sanitizePublicText(line, ctx));
  }

  return [
    "I can answer from the approved map, but I should not invent a path.",
    "The cleanest move is to re-center at the public doorway."
  ];
}

function deterministicFallbackOptions(ctx, _memory, allowed) {
  const intent = ctx.intent || classifyIntent(ctx);

  if (intent === "guidedEntrance") return filterOptionsForAllowed(buildGuidedChooserResponse(ctx).options, allowed);
  if (intent === "diagnosticReferral" || intent === "characterMirror" || intent === "diagnostic") return filterOptionsForAllowed(buildDiagnosticReferralResponse(ctx).options, allowed);

  const sets = {
    diamondGate: [
      makePromptOption("Can you help me choose where to start?", TARGETS.SPLIT_INTERFACE, "story_prompt", "story_entry"),
      makePromptOption("What is the traditional website for?", TARGETS.TRADITIONAL_WEBSITE, "story_prompt", "story_entry"),
      makePromptOption("What can I actually do here?", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry"),
      makePromptOption("What is the narrative path?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry"),
      makePromptOption("What is the mission behind this?", TARGETS.MISSION_OVERVIEW, "personal_prompt", "personal_entry")
    ],
    splitInterface: buildGuidedChooserResponse(ctx).options,
    traditionalWebsite: [
      makePromptOption("How does the Compass help me start?", TARGETS.COMPASS, "story_prompt", "story_entry"),
      makePromptOption("What can I actually do here?", TARGETS.PRODUCTS, "practical_prompt", "practical_entry"),
      makePromptOption("What keeps this honest?", TARGETS.LAWS, "skeptic_prompt", "proof_entry"),
      makePromptOption("Who is Sean Mansfield?", TARGETS.SEAN, "story_prompt", "source_entry"),
      makePromptOption("Show me the narrative version.", TARGETS.NARRATIVE_PATH, "progression_prompt", "story_entry")
    ],
    narrativePath: [
      makePromptOption("What is the mission behind the narrative path?", TARGETS.MISSION_OVERVIEW, "personal_prompt", "personal_entry"),
      makePromptOption("What is Mirrorland?", TARGETS.MIRRORLAND, "story_prompt", "story_entry"),
      makePromptOption("Who are the Characters?", TARGETS.CHARACTERS, "story_prompt", "story_entry"),
      makePromptOption("What is the Frontier Playground?", TARGETS.FRONTIER, "practical_prompt", "practical_entry"),
      makePromptOption("How does this connect back to the website?", TARGETS.TRADITIONAL_WEBSITE, "progression_prompt", "story_entry")
    ],
    mission: [
      makePromptOption("What is the inner mission?", TARGETS.MISSION_INNER, "personal_prompt", "personal_entry"),
      makePromptOption("What is the community mission?", TARGETS.MISSION_COMMUNITY, "personal_prompt", "personal_entry"),
      makePromptOption("How does the mission become practical?", TARGETS.MISSION_COLLABORATION, "practical_prompt", "practical_entry"),
      makePromptOption("How does this connect to Mirrorland?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry")
    ],
    practicalRelevance: [
      makePromptOption("What is the Frontier Playground?", TARGETS.FRONTIER, "practical_prompt", "practical_entry"),
      makePromptOption("Can this survive a real test?", TARGETS.SCIENTIFIC_LAW, "skeptic_prompt", "proof_entry"),
      makePromptOption("What can I actually do here?", TARGETS.PRODUCTS, "practical_prompt", "practical_entry"),
      makePromptOption("How does the mission become practical?", TARGETS.MISSION_COLLABORATION, "practical_prompt", "practical_entry")
    ],
    scientificLaw: [
      makePromptOption("What needs to be tested?", TARGETS.SCIENTIFIC_LAW, "story_prompt", "proof_entry"),
      makePromptOption("What would count as evidence?", TARGETS.SCIENTIFIC_LAW_EVIDENCE, "skeptic_prompt", "proof_entry"),
      makePromptOption("How would this be measured?", TARGETS.SCIENTIFIC_LAW_MEASURE, "practical_prompt", "practical_entry"),
      makePromptOption("What could prove this wrong?", TARGETS.SCIENTIFIC_LAW_LIMITS, "skeptic_prompt", "boundary_entry"),
      makePromptOption("How does this bridge back to the Laws?", TARGETS.LAWS, "progression_prompt", "proof_entry")
    ],
    frontier: [
      makePromptOption("How does Energy work here?", TARGETS.FRONTIER_ENERGY, "practical_prompt", "practical_entry"),
      makePromptOption("How does Water work here?", TARGETS.FRONTIER_WATER, "practical_prompt", "practical_entry"),
      makePromptOption("How does Waste work here?", TARGETS.FRONTIER_WASTE, "practical_prompt", "practical_entry"),
      makePromptOption("How does Closed Loop work here?", TARGETS.FRONTIER_CLOSED_LOOP, "practical_prompt", "practical_entry"),
      makePromptOption("Can this survive a real test?", TARGETS.SCIENTIFIC_LAW, "skeptic_prompt", "proof_entry")
    ],
    hearth: [
      makePromptOption("What is Hearth coordinating?", TARGETS.HEARTH_CONSTRUCT, "practical_prompt", "systems_entry"),
      makePromptOption("Why does this room answer to proof?", TARGETS.HEARTH_LAW, "skeptic_prompt", "proof_entry"),
      makePromptOption("How does Hearth connect to Frontier?", TARGETS.HEARTH_FRONTIER, "practical_prompt", "practical_entry"),
      makePromptOption("How does Hearth connect to the Compass?", TARGETS.COMPASS, "progression_prompt", "story_entry")
    ],
    characters: [
      makePromptOption("Who are the Characters?", TARGETS.CHARACTERS, "story_prompt", "story_entry"),
      makePromptOption("Why do these Characters matter?", TARGETS.CHARACTER_STORY_PRESSURE, "skeptic_prompt", "proof_entry"),
      makePromptOption("Who should I meet first?", TARGETS.CHARACTER_FIRST, "progression_prompt", "story_entry"),
      makePromptOption("What does the Character Mirror show?", TARGETS.CHARACTER_MIRROR, "story_prompt", "story_entry"),
      makePromptOption("Where can I take the alignment diagnostic?", TARGETS.DIAGNOSTIC_REFERRAL, "personal_prompt", "personal_entry")
    ],
    recenter: defaultRecenterOptions()
  };

  return filterOptionsForAllowed(sets[intent] || sets.diamondGate, allowed);
}

function filterOptionsForAllowed(options, allowed) {
  return options.filter((item) => {
    return item && APPROVED_TARGETS.has(item.target) && allowed.targetSet.has(item.target);
  }).slice(0, MAX_OPTIONS);
}

function deterministicFallbackHandoffs(memory, allowed) {
  const routes = [];

  (memory || []).forEach((item) => {
    (item.routes || []).forEach((route) => {
      if (allowed.routeSet.has(route)) routes.push(route);
    });
  });

  if (!routes.length) {
    routes.push(ROUTES.COMPASS, ROUTES.SITE_GUIDE, ROUTES.MIRRORLAND);
  }

  return Array.from(new Set(routes.map(normalizeRoute)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
}

async function callModel(ctx, memory, allowed) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(ctx, memory, allowed);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemPrompt
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: userPrompt
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "jeeves_backbrain_v5_3_conversational_engine_response",
          strict: true,
          schema: RESPONSE_SCHEMA
        }
      },
      max_output_tokens: 1300
    })
  });

  if (!response.ok) {
    const errorText = await safeReadText(response);
    throw new Error("OPENAI_RESPONSE_ERROR: " + errorText.slice(0, 500));
  }

  const data = await response.json();
  const text = extractResponseText(data);
  return parseModelJson(text);
}

function buildSystemPrompt() {
  return [
    "You are Jeeves, the governed house intelligence for Diamond Gate Bridge.",
    "You are API/North: the depth and knowledge authority.",
    "You answer only from approved memory supplied in the request.",
    "You may explain, clarify, personalize, deepen, compare, and conclude, but you may not invent canon, pages, routes, characters, or facts.",
    "You do not own browser rendering, visible pacing, route execution, or Expression transition language.",
    "Answer the user’s visible message first.",
    "Use the estate map, room placement, canon, route logic, bridge pairs, and neighboring-room structure invisibly to keep the answer correct.",
    "Do not explain the architecture unless the user asks for the map, proof structure, room relationship, or placement.",
    "The interface is a text conversation with Jeeves.",
    "Conversation options must read like complete texts the user would actually send to Jeeves.",
    "Prepared-door labels may be navigation actions, but conversation options may not sound like route controls.",
    "DiamondGateBridge has two ways in: the traditional website lane and the narrative path lane.",
    "The guided entrance is first-class: when the visitor asks for help choosing where to start, answer as a guide choosing between clear public map, practical use, story world, mission, and proof/trust.",
    "The traditional website lane gives public structure: Compass, Products, Laws, Meet Sean, and clear navigation.",
    "The narrative path lane carries the deeper mission: coherence, self-recognition, Mirrorland, Hearth, Characters, Frontier Playground, and future-facing proof pressure.",
    "The two lanes are not isolated. Jeeves should periodically offer bridge paths between them.",
    "Mission is a three-layer structure: general shared direction, inner coherence / self-recognition, outward service / community protection, and collaboration that makes it practical.",
    "Community mission includes service, standing against bullying, protecting children, protecting animals, and helping people feel safer and supported.",
    "Character Mirror rule: Jeeves may explain what the Character Mirror shows, how it relates to Characters, and where the Diagnostic fits.",
    "Jeeves may not assess, score, classify, diagnose, type, or decide which archetype or Character the visitor resembles.",
    "If the visitor asks to be assessed, scored, typed, classified, or matched, refer them to the Coherence Diagnostic.",
    "Coherence Diagnostic boundary: it is local-only in its current version and is not medical, mental-health, legal, employment, official IQ, or official MBTI assessment.",
    "Hearth canon: Hearth is Mission Control, the window within the window. Mirrorland is the larger future-facing window. Hearth is the inner estate control view into unknown future potential.",
    "Scientific Law rule: a claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
    "If requestMode is node_enrichment, selectedTarget and selectedLabel are the strongest signals for the answer.",
    "If bridgeContext is present, preserve its meaning. priorLane and priorTopic help explain public-to-narrative or narrative-to-public movement.",
    "Return JSON only, following the required schema.",
    "Keep bubbles concise. Use 2 to 4 bubbles for deeper meaning questions.",
    "If unsure, re-center the visitor rather than inventing."
  ].join("\n");
}

function buildUserPrompt(ctx, memory, allowed) {
  const narrativeFrame = buildNarrativeFrame(ctx, memory, allowed);

  return JSON.stringify({
    task: "Generate a safe governed Jeeves response that answers the user's text-message-style prompt.",
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    rootConversationContract: ROOT_CONVERSATION_CONTRACT,
    expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
    frontbrainContractTarget: FRONTBRAIN_CONTRACT_TARGET,
    visitor: {
      text: ctx.visitorText,
      selectedTarget: ctx.selectedTarget,
      selectedLabel: ctx.selectedLabel,
      requestMode: ctx.requestMode,
      promptMode: ctx.promptMode,
      optionKind: ctx.optionKind,
      archetypeAlignment: ctx.archetypeAlignment,
      bridgeMoment: ctx.bridgeMoment,
      movementIntent: ctx.movementIntent,
      bridgeContext: ctx.bridgeContext,
      branchStack: ctx.branchStack,
      transitionTrail: ctx.transitionTrail,
      currentConversationStage: ctx.currentConversationStage,
      currentEntryLane: ctx.currentEntryLane,
      lastLane: ctx.lastLane,
      bridgeOffered: ctx.bridgeOffered,
      intent: ctx.intent,
      activeHostPage: ctx.activeHostPage,
      currentRoomContext: ctx.currentRoomContext,
      currentRoomRole: ctx.currentRoomRole,
      currentRoomPremise: ctx.currentRoomPremise,
      portalLogic: ctx.portalLogic,
      currentNode: ctx.currentNode,
      currentEntry: ctx.currentEntry,
      currentPath: ctx.currentPath,
      currentTopic: ctx.currentTopic,
      currentRoomId: ctx.currentRoomId,
      currentRoomName: ctx.currentRoomName,
      currentCoordinateName: ctx.currentCoordinateName,
      currentCardinal: ctx.currentCardinal,
      currentPlaceType: ctx.currentPlaceType,
      currentScopeLane: ctx.currentScopeLane,
      currentVoiceMode: ctx.currentVoiceMode,
      pathDepth: ctx.pathDepth,
      topicDepth: ctx.topicDepth,
      loopCount: ctx.loopCount,
      routeReadiness: ctx.routeReadiness,
      sessionTrail: ctx.sessionTrail,
      visitedNodes: ctx.visitedNodes,
      selectedTargets: ctx.selectedTargets,
      returnStack: ctx.returnStack,
      diagnosticResultPresent: Boolean(ctx.diagnosticResult)
    },
    depth: {
      requestedDepthMode: ctx.depthMode,
      fibonacciStage: ctx.fibonacciStage
    },
    narrativeFrame,
    approvedMemory: memory.map((item) => ({
      id: item.id,
      scope: item.scope,
      roomId: item.roomId,
      cardinal: item.cardinal,
      axis: getAxis(item.cardinal),
      summary: item.summary,
      allowedRoutes: item.routes,
      allowedTargets: item.targets
    })),
    approvedConversationTargets: Array.from(allowed.targetSet),
    approvedRouteHandoffs: Array.from(allowed.routeSet),
    outputRules: {
      bubbles: "1 to 4 Jeeves-style response bubbles",
      options: "0 to 6 conversational options using approvedConversationTargets only",
      handoffs: "0 to 6 route IDs using approvedRouteHandoffs only",
      noMarkdown: true,
      noUnapprovedRoutes: true,
      noUnapprovedCanon: true,
      frontbrainRouteAuthority: true,
      expressionPublicVoiceAuthority: true,
      conversationGrammarRule: "Conversation options must be complete user texts to Jeeves. They can be questions, requests, or statements of intent.",
      routeSeparationRule: "Conversation options explain or continue. Handoffs open pages.",
      promptModeRule: "Return promptMode, optionKind, archetypeAlignment, bridgeMoment, and movementIntent for every option.",
      diagnosticBoundaryRule: "Do not assess, score, classify, diagnose, type, or decide which archetype or Character resembles the visitor. Refer assessment requests to the Coherence Diagnostic.",
      mapVisibilityRule: "Use room map and route placement invisibly unless the visitor asks for room relationship, map, proof structure, or placement.",
      bridgeRule: "When a visitor is in one lane, offer at least one path that can eventually bridge to the other lane when useful.",
      guidedEntranceRule: "If the user asks where to start or asks for help choosing, use the guided chooser structure."
    }
  });
}

function buildNarrativeFrame(ctx, memory, allowed) {
  const primary = memory && memory[0] ? memory[0] : null;
  const blueprint = getBlueprintRoomByCurrent(ctx) ||
    (primary ? getBlueprintRoomByTarget(primary.targets && primary.targets[0]) : null) ||
    getBlueprintRoomByTarget(ctx.currentNode || ctx.currentPath || ctx.currentEntry);

  const cardinal = ctx.currentCardinal || (blueprint ? blueprint.cardinal : primary ? primary.cardinal : AXIS_CENTER);
  const axis = getAxis(cardinal);
  const stage = ctx.fibonacciStage || inferFibonacciStage(ctx);

  return {
    narrativeDisposition: inferNarrativeDisposition(ctx, primary, blueprint),
    narrativePlacement: blueprint ? blueprint.placement : axis.publicLine,
    narrativeAccord: "This subject should be tied back to its nearest room, route, and neighboring meaning before the visitor moves.",
    narrativePath: inferNarrativePath(ctx, primary, blueprint, allowed),
    narrativeConclusion: inferNarrativeConclusion(ctx, primary, blueprint),
    fibonacciDepth: stage.step,
    fibonacciStage: stage.name,
    fibonacciPurpose: stage.purpose,
    cardinalFrame: axis,
    blueprintRoom: blueprint || null,
    selectedTarget: ctx.selectedTarget,
    selectedLabel: ctx.selectedLabel,
    promptMode: ctx.promptMode,
    optionKind: ctx.optionKind,
    archetypeAlignment: ctx.archetypeAlignment,
    bridgeMoment: ctx.bridgeMoment,
    movementIntent: ctx.movementIntent,
    requestMode: ctx.requestMode,
    currentConversationStage: ctx.currentConversationStage,
    currentEntryLane: ctx.currentEntryLane,
    lastLane: ctx.lastLane,
    bridgeOffered: ctx.bridgeOffered,
    bridgeContext: ctx.bridgeContext,
    splitInterfaceFrame: {
      active: true,
      traditionalWebsite: DIAMOND_GATE_REGISTRY.publicLane,
      narrativePath: DIAMOND_GATE_REGISTRY.narrativeLane,
      bridge: DIAMOND_GATE_REGISTRY.bridge,
      guidedChooser: DIAMOND_GATE_REGISTRY.guidedChooser
    },
    diagnosticBoundaryFrame: {
      active: ctx.intent === "diagnosticReferral" || ctx.intent === "diagnostic" || ctx.intent === "characterMirror",
      boundary: COHERENCE_DIAGNOSTIC_REGISTRY.jeevesBoundary
    },
    hearthMissionControlFrame: {
      active: isHearthContext(ctx),
      premise: HEARTH_CONSTRUCT_REGISTRY.primaryLine,
      portalLine: HEARTH_CONSTRUCT_REGISTRY.portalLine
    }
  };
}

function inferNarrativeDisposition(ctx, memoryItem, blueprint) {
  if (ctx.intent === "guidedEntrance") return "guided entrance chooser";
  if (ctx.intent === "diamondGate") return "estate overview";
  if (ctx.intent === "splitInterface") return "bridge between entry lanes";
  if (ctx.intent === "traditionalWebsite") return "public website lane";
  if (ctx.intent === "narrativePath") return "guided narrative lane";
  if (ctx.intent === "mission") return "mission fork";
  if (ctx.intent === "practicalRelevance") return "real-world relevance bridge";
  if (ctx.intent === "diagnosticReferral") return "diagnostic referral boundary";
  if (ctx.intent === "characterMirror") return "Character Mirror explanation";
  if (ctx.intent === "hearth") return "mission-control chamber";
  if (blueprint) return blueprint.title;
  if (memoryItem && memoryItem.scope === "character") return "character pressure profile";
  return "estate orientation subject";
}

function inferNarrativePath(ctx, memoryItem, blueprint, allowed) {
  const targets = [];
  const routes = [];

  if (ctx.selectedTarget && allowed.targetSet.has(ctx.selectedTarget)) targets.push(ctx.selectedTarget);

  if (memoryItem) {
    (memoryItem.targets || []).forEach((target) => allowed.targetSet.has(target) && targets.push(target));
    (memoryItem.routes || []).forEach((route) => allowed.routeSet.has(route) && routes.push(route));
  }

  if (blueprint && blueprint.target && allowed.targetSet.has(blueprint.target)) targets.unshift(blueprint.target);
  if (blueprint && blueprint.route && allowed.routeSet.has(blueprint.route)) routes.unshift(blueprint.route);

  return {
    nextTargets: Array.from(new Set(targets)).slice(0, 6),
    nextRoutes: Array.from(new Set(routes)).slice(0, 6)
  };
}

function inferNarrativeConclusion(ctx) {
  if (ctx.intent === "guidedEntrance") return "The visitor should receive a clear doorway without needing to understand the whole estate first.";
  if (ctx.intent === "diamondGate") return "The visitor should understand that DiamondGateBridge has a traditional website lane and a narrative path lane.";
  if (ctx.intent === "splitInterface") return "The visitor should understand that the two lanes are separate entrances into one estate and may bridge both ways.";
  if (ctx.intent === "traditionalWebsite") return "The visitor should understand the public structure before choosing a deeper or practical route.";
  if (ctx.intent === "narrativePath") return "The visitor should understand that the narrative path carries the deeper mission through Hearth, Mirrorland, Characters, and Frontier Playground.";
  if (ctx.intent === "mission") return "The visitor should understand the mission layers before choosing inner coherence, community service, or practical collaboration.";
  if (ctx.intent === "diagnosticReferral" || ctx.intent === "characterMirror") return "The visitor should understand that Jeeves can explain and route, but assessment belongs in the Coherence Diagnostic.";
  return "The visitor should receive a grounded answer and a clean next door.";
}

function getAxis(cardinal) {
  return NEWS_AXES[cardinal] || NEWS_AXES.C;
}

function getBlueprintRoomByCurrent(ctx) {
  const search = [
    ctx.selectedTarget,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentRoomId,
    ctx.currentTopic
  ].filter(Boolean);

  for (const item of search) {
    const room = getBlueprintRoomByTarget(item);
    if (room) return room;

    const exact = Object.values(GUIDE_BLUEPRINT_ROOMS).find((entry) => entry.roomId === item);
    if (exact) return exact;
  }

  return null;
}

function getBlueprintRoomByTarget(target) {
  const clean = normalizeTarget(target);

  for (const key of Object.keys(GUIDE_BLUEPRINT_ROOMS)) {
    const room = GUIDE_BLUEPRINT_ROOMS[key];
    if (room.target === clean) return room;
  }

  if (clean === TARGETS.DIAMOND_GATE_OVERVIEW) return GUIDE_BLUEPRINT_ROOMS.main;
  if (clean === TARGETS.SPLIT_INTERFACE) return GUIDE_BLUEPRINT_ROOMS.compass;
  if (clean === TARGETS.TRADITIONAL_WEBSITE) return GUIDE_BLUEPRINT_ROOMS.guide;
  if (clean === TARGETS.NARRATIVE_PATH) return GUIDE_BLUEPRINT_ROOMS.atrium;
  if (clean === TARGETS.MISSION_OVERVIEW) return GUIDE_BLUEPRINT_ROOMS.atrium;
  if (clean === TARGETS.PRACTICAL_RELEVANCE) return GUIDE_BLUEPRINT_ROOMS.frontier;
  if (clean === TARGETS.SCIENTIFIC_LAW) return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === TARGETS.GAUGES) return GUIDE_BLUEPRINT_ROOMS.lab;
  if (clean === TARGETS.HEARTH) return GUIDE_BLUEPRINT_ROOMS.frontier;
  if (clean === TARGETS.CHARACTERS) return GUIDE_BLUEPRINT_ROOMS.atlas;

  return null;
}

function shouldRecenter(ctx) {
  return ctx.loopCount >= 3 || ctx.topicDepth >= 5 || ctx.intent === "recenter";
}

function normalizeModelResponse(modelResponse, ctx, memory, allowed) {
  const base = modelResponse && typeof modelResponse === "object" ? modelResponse : {};
  const intent = INTENTS.includes(base.intent) ? base.intent : ctx.intent || classifyIntent(ctx);

  return {
    bubbles: normalizeBubbles(base.bubbles, ctx, memory),
    options: normalizeOptions(base.options, allowed, ctx),
    handoffs: normalizeHandoffs(base.handoffs, allowed),
    confidence: ["high", "medium", "low"].includes(base.confidence) ? base.confidence : "medium",
    needsRecenter: Boolean(base.needsRecenter),
    intent,
    canonStatus: CANON_STATUS.includes(base.canonStatus) ? base.canonStatus : "grounded",
    nextTopic: capString(base.nextTopic || inferNextTopic(ctx, memory), 90),
    conclusiveState: CONCLUSIVE_STATES.includes(base.conclusiveState) ? base.conclusiveState : inferConclusiveState(ctx, memory),
    usedRegistry: normalizeUsedRegistry(base.usedRegistry, memory),
    suggestedMode: SUGGESTED_MODES.includes(base.suggestedMode) ? base.suggestedMode : inferSuggestedMode(intent, memory)
  };
}

function normalizeBubbles(value, ctx, memory) {
  let bubbles = Array.isArray(value) ? value : [];

  bubbles = bubbles
    .map((text) => sanitizePublicText(capString(text, 420), ctx))
    .filter(Boolean)
    .slice(0, MAX_BUBBLES);

  if (!bubbles.length) {
    return deterministicFallbackBubbles(ctx, memory);
  }

  return bubbles;
}

function normalizeOptions(value, allowed, ctx) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const target = normalizeTarget(capString(item.target, 100));
      if (!APPROVED_TARGETS.has(target)) return null;
      if (!allowed.targetSet.has(target)) return null;

      let label = sanitizeOptionLabel(capString(item.label, 110), target);
      if (!label) label = DEFAULT_CONVERSATION_LABELS[target] || "Can you tell me more?";

      const optionKind = normalizeOptionKind(item.optionKind);
      const type = optionKind === "control" || optionKind === "return" ? "control" : "conversation";

      return {
        label,
        target,
        type,
        scopeLane: item.scopeLane === "narrative" || isNarrativeTarget(target) ? "narrative" : "objective",
        promptMode: normalizePromptMode(item.promptMode || inferPromptModeFromLabel(label, target)),
        optionKind,
        archetypeAlignment: normalizeArchetypeAlignment(item.archetypeAlignment || inferArchetypeAlignmentFromTarget(target)),
        bridgeMoment: normalizeBridgeMoment(item.bridgeMoment || inferBridgeMomentFromOptionKind(optionKind)),
        movementIntent: normalizeMovementIntent(item.movementIntent || inferMovementIntentFromOptionKind(optionKind, ctx))
      };
    })
    .filter(Boolean)
    .slice(0, MAX_OPTIONS);
}

function sanitizeOptionLabel(label, target) {
  let value = capString(label, 110);
  if (!value) return "";

  value = sanitizePublicText(value);

  const actionLike = /^(visit|open|enter|explore|launch|go to)\b/i.test(value);
  if (actionLike) return DEFAULT_CONVERSATION_LABELS[target] || "";

  return value;
}

function normalizeHandoffs(value, allowed) {
  if (!Array.isArray(value)) return [];

  return value
    .map((route) => normalizeRoute(capString(route, 80)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .filter((route) => allowed.routeSet.has(route))
    .slice(0, MAX_HANDOFFS);
}

function normalizeUsedRegistry(value, memory) {
  const source = Array.isArray(value) && value.length
    ? value
    : memory.map((item) => item.id);

  return Array.from(new Set(source.map((item) => capString(item, 90)).filter(Boolean))).slice(0, 14);
}

function sanitizePublicText(text, ctx) {
  let clean = capString(text, 900);

  FORBIDDEN_PUBLIC_LANGUAGE.forEach((rule) => {
    clean = clean.replace(rule.pattern, rule.replacement);
  });

  clean = clean.replace(/```/g, "");
  clean = clean.replace(/\s{2,}/g, " ");
  clean = clean.replace(/\bthe Mirrorland\b/gi, "Mirrorland");

  if (!isHearthContext(ctx) && /\b(browser|server|module|export|function|json schema|payload)\b/i.test(clean)) {
    clean = clean
      .replace(/\bbrowser\b/gi, "visible side")
      .replace(/\bserver\b/gi, "deeper side")
      .replace(/\bmodule\b/gi, "part")
      .replace(/\bexport\b/gi, "send")
      .replace(/\bfunction\b/gi, "role")
      .replace(/\bjson schema\b/gi, "answer shape")
      .replace(/\bpayload\b/gi, "answer");
  }

  return clean.trim();
}

function isHearthContext(ctx) {
  if (!ctx) return false;

  const text = [
    ctx.intent,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.currentRoomContext,
    ctx.currentRoomRole,
    ctx.currentRoomPremise,
    ctx.visitorText
  ].join(" ").toLowerCase();

  return text.includes("hearth") ||
    text.includes("mission control") ||
    text.includes("window within the window") ||
    text.includes("planetary construct") ||
    text.includes("construct facility") ||
    text.includes("construct engine");
}

function safeUncheckedSafety() {
  return {
    input: {
      checked: false,
      allowed: true,
      flagged: false
    },
    output: {
      checked: false,
      allowed: true,
      flagged: false
    }
  };
}

function safeResponse(data, ctx, allowedOverride) {
  const safeCtx = ctx || normalizePayload({});
  const memory = data.memory || retrieveApprovedMemory(safeCtx);
  const allowed = allowedOverride || buildAllowedSets(safeCtx, memory);
  const bubbles = normalizeBubbles(data.bubbles || [], safeCtx, memory);
  const options = normalizeOptions(data.options || [], allowed, safeCtx);
  const fallbackOptions = normalizeOptions(defaultRecenterOptions(), allowed, safeCtx);
  const rawHandoffs = Array.isArray(data.handoffs) ? data.handoffs : [];
  const handoffs = rawHandoffs
    .map((route) => normalizeRoute(capString(route, 80)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .filter((route) => allowed.routeSet.has(route))
    .slice(0, MAX_HANDOFFS);
  const narrativeFrame = buildNarrativeFrame(safeCtx, memory, allowed);

  const resolvedHandoffs = handoffs.length ? handoffs : deterministicFallbackHandoffs(memory, allowed);

  return {
    ok: Boolean(data.ok),
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    rootConversationContract: ROOT_CONVERSATION_CONTRACT,
    expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
    frontbrainContractTarget: FRONTBRAIN_CONTRACT_TARGET,
    source: data.source || "server",
    safety: data.safety || safeUncheckedSafety(),

    beats: bubbles,
    bubbles,
    options: options.length ? options : fallbackOptions,
    handoffs: resolvedHandoffs,
    handoffLabels: buildHandoffLabels(resolvedHandoffs),
    routeHints: buildRouteHints(resolvedHandoffs),

    confidence: ["high", "medium", "low"].includes(data.confidence) ? data.confidence : "medium",
    needsRecenter: Boolean(data.needsRecenter),
    intent: INTENTS.includes(data.intent) ? data.intent : safeCtx.intent || classifyIntent(safeCtx),
    canonStatus: CANON_STATUS.includes(data.canonStatus) ? data.canonStatus : "grounded",
    nextTopic: capString(data.nextTopic || safeCtx.intent || "diamondGate", 90),
    conclusiveState: CONCLUSIVE_STATES.includes(data.conclusiveState) ? data.conclusiveState : "open",
    usedRegistry: Array.isArray(data.usedRegistry) ? data.usedRegistry.slice(0, 14) : [],
    suggestedMode: SUGGESTED_MODES.includes(data.suggestedMode) ? data.suggestedMode : "objective",

    requestMode: safeCtx.requestMode,
    selectedTarget: safeCtx.selectedTarget,
    selectedLabel: safeCtx.selectedLabel,
    promptMode: safeCtx.promptMode,
    optionKind: safeCtx.optionKind,
    archetypeAlignment: safeCtx.archetypeAlignment,
    bridgeMoment: safeCtx.bridgeMoment,
    movementIntent: safeCtx.movementIntent,
    bridgeContext: safeCtx.bridgeContext,
    branchStack: safeCtx.branchStack,
    transitionTrail: safeCtx.transitionTrail,
    currentConversationStage: safeCtx.currentConversationStage,
    currentEntryLane: safeCtx.currentEntryLane,
    lastLane: safeCtx.lastLane,
    bridgeOffered: safeCtx.bridgeOffered,
    activeHostPage: safeCtx.activeHostPage,
    currentRoomContext: safeCtx.currentRoomContext,
    currentRoomRole: safeCtx.currentRoomRole,
    currentRoomPremise: safeCtx.currentRoomPremise,
    portalLogic: safeCtx.portalLogic,
    depthMode: safeCtx.depthMode,
    fibonacciDepth: narrativeFrame.fibonacciDepth,
    fibonacciStage: narrativeFrame.fibonacciStage,
    narrativeFrame,

    conversationGrammarAuthority: "api_north_defines_meaning_js_renders_expression_bridges",
    routeAuthority: "frontbrain_remains_final_authority",
    expressionAuthority: "expression_remains_public_voice_standard",
    diagnosticBoundary: "jeeves_explains_and_routes_but_does_not_assess"
  };
}

function buildHandoffLabels(routes) {
  const labels = {};
  (routes || []).forEach((route) => {
    const normalized = normalizeRoute(route);
    if (HANDOFF_LABELS[normalized]) labels[normalized] = HANDOFF_LABELS[normalized];
  });
  return labels;
}

function buildRouteHints(routes) {
  const hints = {};
  (routes || []).forEach((route) => {
    const normalized = normalizeRoute(route);
    if (ROUTE_HINTS[normalized]) hints[normalized] = ROUTE_HINTS[normalized];
  });
  return hints;
}

function inferNextTopic(ctx, memory) {
  if (ctx.selectedTarget && TARGET_INTENT_MAP[ctx.selectedTarget]) return TARGET_INTENT_MAP[ctx.selectedTarget];
  if (ctx.intent && ctx.intent !== "unknown") return ctx.intent;
  if (memory && memory[0]) return memory[0].id;
  return "diamondGate";
}

function inferConclusiveState(ctx, memory) {
  if (shouldRecenter(ctx)) return "switch_recommended";
  if (ctx.intent === "diagnosticReferral") return "switch_recommended";
  if (ctx.requestMode === "node_enrichment" && ctx.selectedTarget) return "complete";
  if (ctx.routeReadiness >= 2 || ctx.topicDepth >= 3) return "route_ready";
  if (memory && memory.length > 2 && ctx.pathDepth >= 3) return "complete";
  return "open";
}

function inferSuggestedMode(intent, memory) {
  if (intent === "diagnosticReferral" || intent === "diagnostic") return "diagnosticReferral";
  if (intent === "frontier" || intent === "hearth" || intent === "mirrorland" || intent === "characters" || intent === "narrativePath" || intent === "mission") return "threshold";
  if ((memory || []).some((item) => item.scope === "narrative" || item.scope === "character")) return "immersion";
  return "objective";
}

function inferPromptModeFromLabel(label, target) {
  const text = [label, target].join(" ").toLowerCase();
  if (/\btrust|proof|evidence|wrong|matter|important|test\b/.test(text)) return "skeptic_prompt";
  if (/\breal world|work|system|use|frontier|product|energy|water|waste|practical\b/.test(text)) return "practical_prompt";
  if (/\bmission|inner|community|myself|mirror|diagnostic|underdog|coherence|alignment\b/.test(text)) return "personal_prompt";
  if (/\bnext|continue|first|return|start|choose\b/.test(text)) return "progression_prompt";
  return "story_prompt";
}

function inferArchetypeAlignmentFromTarget(target) {
  const clean = normalizeTarget(target);
  if (clean.includes("scientific") || clean.includes("Law") || clean.includes("gauges") || clean.includes("proof")) return "proof_entry";
  if (clean.includes("frontier") || clean.includes("products") || clean.includes("practical")) return "practical_entry";
  if (clean.includes("diagnostic") || clean.includes("mission") || clean.includes("underdog")) return "personal_entry";
  if (clean.includes("sean")) return "source_entry";
  if (clean.includes("hearth") || clean.includes("audralia") || clean.includes("mirrorland") || clean.includes("characters") || clean.includes("narrative")) return "story_entry";
  return "unknown_entry";
}

function inferBridgeMomentFromOptionKind(optionKind) {
  if (optionKind === "forward") return "after_knowledge";
  if (optionKind === "return") return "return_fork";
  if (optionKind === "parallel") return "parallel_crossing";
  if (optionKind === "route") return "prepared_door";
  if (optionKind === "control") return "recenter_fork";
  return "before_knowledge";
}

function inferMovementIntentFromOptionKind(optionKind, ctx) {
  if (optionKind === "forward") return "continue_current_path";
  if (optionKind === "return") return "return_one_threshold";
  if (optionKind === "parallel") return "cross_to_related_room";
  if (optionKind === "route") return "open_prepared_door";
  if (optionKind === "control") return "recenter";
  return ctx && ctx.movementIntent && ctx.movementIntent !== "unknown" ? ctx.movementIntent : "ask_jeeves";
}

function isNarrativeTarget(target) {
  const clean = normalizeTarget(target);
  return [
    TARGETS.NARRATIVE_PATH,
    TARGETS.MISSION_OVERVIEW,
    TARGETS.MISSION_INNER,
    TARGETS.MISSION_COMMUNITY,
    TARGETS.MISSION_COLLABORATION,
    TARGETS.MIRRORLAND,
    TARGETS.ATRIUM,
    TARGETS.ATLAS,
    TARGETS.CHARACTERS,
    TARGETS.CHARACTER_MIRROR,
    TARGETS.HEARTH,
    TARGETS.HEARTH_CONSTRUCT,
    TARGETS.HEARTH_FRONTIER,
    TARGETS.FRONTIER,
    TARGETS.AUDRALIA,
    TARGETS.H_EARTH,
    TARGETS.ZIONTS
  ].includes(clean) || clean.startsWith("frontier") || clean.startsWith("character");
}

function findCharacterIdFromText(text) {
  const normalized = String(text || "").toLowerCase();

  for (const id of Object.keys(CHARACTER_REGISTRY)) {
    const character = CHARACTER_REGISTRY[id];
    if (normalized.includes(character.name.toLowerCase())) return id;
    for (const keyword of character.keywords) {
      if (normalized.includes(keyword.toLowerCase())) return id;
    }
  }

  return "";
}

function extractResponseText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];

  if (Array.isArray(data.output)) {
    data.output.forEach((item) => {
      if (!item || !Array.isArray(item.content)) return;

      item.content.forEach((content) => {
        if (!content) return;
        if (typeof content.text === "string") parts.push(content.text);
        if (typeof content.output_text === "string") parts.push(content.output_text);
      });
    });
  }

  return parts.join("\n").trim();
}

function parseModelJson(text) {
  const raw = String(text || "").trim();

  if (!raw) {
    throw new Error("EMPTY_MODEL_RESPONSE");
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1));
    }

    throw new Error("MODEL_RESPONSE_NOT_JSON");
  }
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch (_error) {
    return "";
  }
}

function capString(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function safeErrorMessage(error) {
  return capString(error && error.message ? error.message : "Unknown server brain error.", 500);
}

if (typeof module !== "undefined") {
  module.exports = handler;
  module.exports.default = handler;
}
