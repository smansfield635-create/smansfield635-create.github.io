// /api/jeeves.js
// HEARTH_JEEVES_BACKBRAIN_NORTH_SPLIT_INTERFACE_GUIDED_PATH_STANDARD_TNT_v5_1
// Full-file replacement.
// Server-side only.
// North / Backbrain coordinator.
// Purpose:
// - Renew Jeeves around the split-interface DiamondGateBridge entrance standard.
// - Add first-class paths for DiamondGateBridge overview, narrative path, traditional website,
//   mission layers, practical relevance, Mirrorland, and bridge logic.
// - Preserve v5 conversation grammar fields and response shape.
// - Keep Jeeves as guide / host / narrator / concierge / estate interpreter.
// - Remove miniature coherence diagnostic behavior from Jeeves.
// - Jeeves may explain and route to the Coherence Diagnostic, but does not assess, score,
//   classify, diagnose, or decide which archetype / Character fits the visitor.
// Does not own:
// - front-end DOM
// - CSS
// - HTML
// - browser API keys
// - route rendering
// - visual pacing
// - tap-to-advance
// - Expression transition language
// - final route authority
//

"use strict";

const CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_SPLIT_INTERFACE_GUIDED_PATH_STANDARD_TNT_v5_1";
const PREVIOUS_CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_CONVERSATION_GRAMMAR_STANDARD_TNT_v5";

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

const REQUEST_MODES = [
  "freeform",
  "node_enrichment",
  "route_explanation",
  "character_archetype",
  "recenter"
];

const PROMPT_MODES = [
  "story_prompt",
  "skeptic_prompt",
  "practical_prompt",
  "personal_prompt",
  "progression_prompt",
  "recenter_prompt",
  "unknown_prompt"
];

const OPTION_KINDS = [
  "conversation_prompt",
  "forward",
  "return",
  "parallel",
  "route",
  "control"
];

const ARCHETYPE_ALIGNMENTS = [
  "story_entry",
  "proof_entry",
  "practical_entry",
  "personal_entry",
  "source_entry",
  "boundary_entry",
  "systems_entry",
  "unknown_entry"
];

const BRIDGE_MOMENTS = [
  "entrance_fork",
  "before_knowledge",
  "after_knowledge",
  "return_fork",
  "parallel_crossing",
  "recenter_fork",
  "prepared_door",
  "none"
];

const MOVEMENT_INTENTS = [
  "ask_jeeves",
  "continue_current_path",
  "return_one_threshold",
  "cross_to_related_room",
  "open_prepared_door",
  "recenter",
  "unknown"
];

const INTENTS = [
  "diamondGate",
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
];

const CANON_STATUS = ["grounded", "limited", "fallback", "blocked"];

const CONCLUSIVE_STATES = [
  "open",
  "complete",
  "route_ready",
  "switch_recommended",
  "needs_sharper_question"
];

const SUGGESTED_MODES = [
  "objective",
  "threshold",
  "immersion",
  "diagnosticReferral"
];

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

const TARGET_ALIASES = Object.freeze({
  worldPath: "mirrorlandPath",
  worldGatePath: "atriumPath",
  globeWindowPath: "mirrorlandPath",
  characterMirrorPath: "characterMirrorPath",
  characterMirrorQuestionOne: "diagnosticReferralPath",
  characterMirrorQuestionTwo: "diagnosticReferralPath",
  characterMirrorQuestionThree: "diagnosticReferralPath",
  characterMirrorResult: "diagnosticReferralPath",
  characterArchetypeMirrorPath: "characterMirrorPath",
  characterArchetypeQuestionOne: "diagnosticReferralPath",
  characterArchetypeQuestionTwo: "diagnosticReferralPath",
  characterArchetypeQuestionThree: "diagnosticReferralPath",
  characterArchetypeResult: "diagnosticReferralPath",
  characterFactionsPath: "characterRelationshipsPath",
  bookPath: "nineSummitsBookPath",
  missionControlPath: "hearthPath",
  hearthMissionControlPath: "hearthPath",
  windowWithinWindowPath: "hearthPath",
  hearthWindowPath: "hearthPath",
  siteOverviewPath: "diamondGateOverviewPath",
  websiteOverviewPath: "diamondGateOverviewPath",
  traditionalPath: "traditionalWebsiteOverviewPath",
  narrativeOverviewPath: "narrativePathOverview",
  missionPath: "missionOverviewPath",
  practicalPath: "practicalRelevancePath",
  mirrorMePath: "diagnosticReferralPath",
  selfLearningPath: "diagnosticReferralPath"
});

const ROUTE_ALIASES = Object.freeze({
  worldGate: "mirrorland",
  globeWindow: "mirrorland",
  interactiveNarrative: "mirrorland",
  book: "nineSummits",
  traditionalWebsite: "siteGuide",
  narrativePath: "mirrorland",
  frontierPlayground: "frontier"
});

const FORBIDDEN_PUBLIC_LANGUAGE = [
  { pattern: /\bscope lane\b/gi, replacement: "path" },
  { pattern: /\bregistry\b/gi, replacement: "guide" },
  { pattern: /\borgan\b/gi, replacement: "part" },
  { pattern: /\broute lane\b/gi, replacement: "path" },
  { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
  { pattern: /\bexpression payload\b/gi, replacement: "answer" },
  { pattern: /\bprogression state\b/gi, replacement: "step" },
  { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
  { pattern: /\bAPI\b/g, replacement: "deeper answer path" },
  { pattern: /\bpublic human-voice side\b/gi, replacement: "place where the voice becomes human" },
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
  { pattern: /\bhuman source\b/gi, replacement: "creator behind all of this" },
  { pattern: /\brole map\b/gi, replacement: "Character path" },
  { pattern: /\brole functions\b/gi, replacement: "the parts each Character carries" }
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

const GUIDE_BLUEPRINT_ROOMS = Object.freeze({
  compass: {
    blueprintKey: "compass",
    roomId: "compassDesk",
    title: "Compass Desk",
    cardinal: AXIS_NORTH,
    coordinateName: "North Fork",
    jumpTarget: "#jump-compass",
    route: "compass",
    target: "compassPath",
    href: "/",
    disposition: "orientation room",
    placement: "Compass Desk is where visitors re-center when the estate feels large.",
    accord: "It complements Guide Desk, Main Hall, Law Library, The Lab, and Atrium because direction must remain close to proof and threshold."
  },
  guide: {
    blueprintKey: "guide",
    roomId: "guideDesk",
    title: "Guide Desk",
    cardinal: AXIS_NORTH,
    coordinateName: "North Map Hall",
    jumpTarget: "#jump-guide",
    route: "siteGuide",
    target: "siteGuidePath",
    href: "/site-guide/",
    disposition: "teaching room",
    placement: "Guide Desk is the room that teaches the estate’s buttons, maps, rooms, and movement patterns.",
    accord: "It complements Compass Desk because map-reading and orientation belong together."
  },
  main: {
    blueprintKey: "main",
    roomId: "mainHall",
    title: "Main Hall",
    cardinal: AXIS_CENTER,
    coordinateName: "Center Hall",
    jumpTarget: "#jump-main",
    route: "home",
    target: "websitePath",
    href: "/",
    disposition: "public website center",
    placement: "Main Hall is the ordinary public website center before visitors branch into products, laws, proof, or Mirrorland.",
    accord: "It complements Compass Desk because the public center needs a returnable orientation point."
  },
  atrium: {
    blueprintKey: "atrium",
    roomId: "atrium",
    title: "Atrium",
    cardinal: AXIS_SOUTH,
    coordinateName: "South Gate",
    jumpTarget: "#jump-atrium",
    route: "showroom",
    target: "atriumPath",
    href: "/showroom/",
    disposition: "threshold room",
    placement: "Atrium is the entrance into the Mirrorland side of the estate.",
    accord: "It complements Atlas Study and the Mirrorland window because threshold must come before deeper world choice."
  },
  atlas: {
    blueprintKey: "atlas",
    roomId: "atlasStudy",
    title: "Atlas Study",
    cardinal: AXIS_SOUTH,
    coordinateName: "South Map Hall",
    jumpTarget: "#jump-atlas",
    route: "mirrorland",
    target: "atlasPath",
    href: "/showroom/globe/",
    disposition: "world map room",
    placement: "Atlas Study gathers world-facing routes so planets, reference bodies, and world paths become easier to choose.",
    accord: "It complements ZIONTS, Audralia, H-Earth, and Hearth because a visitor needs coordinates before entering consequence, survival, possibility, or construction."
  },
  zionts: {
    blueprintKey: "zionts",
    roomId: "zionts",
    title: "ZIONTS Room",
    cardinal: AXIS_SOUTHWEST,
    coordinateName: "Southwest Consequence Road",
    jumpTarget: "#jump-zionts",
    route: "zionts",
    target: "ziontsPath",
    href: "/showroom/globe/earth/",
    disposition: "consequence room",
    placement: "ZIONTS is the consequence path currently served under Earth.",
    accord: "It complements Atlas Study and Audralia because consequence only becomes readable when possibility is nearby."
  },
  audralia: {
    blueprintKey: "audralia",
    roomId: "audralia",
    title: "Audralia Conservatory",
    cardinal: AXIS_SOUTHEAST,
    coordinateName: "Southeast Conservatory",
    jumpTarget: "#jump-audralia",
    route: "audralia",
    target: "audraliaPath",
    href: "/showroom/globe/audralia/",
    disposition: "constructive future-world room",
    placement: "Audralia Conservatory introduces the forming constructive world before deeper rooms, controls, terrain, and future systems are inspected.",
    accord: "It complements Worldroom, Control Cockpit, Frontier, and Hearth because possibility needs visible terrain, readouts, systems, and construct logic."
  },
  worldroom: {
    blueprintKey: "worldroom",
    roomId: "audraliaWorldroom",
    title: "Audralia Worldroom",
    cardinal: AXIS_SOUTHEAST,
    coordinateName: "East-South Worldroom",
    jumpTarget: "#jump-worldroom",
    route: "audralia",
    target: "audraliaWorldroomPath",
    href: "/showroom/globe/audralia/planet/",
    disposition: "world-body inspection room",
    placement: "Audralia Worldroom gives a focused look at the visible world-body without pretending the whole world is finished.",
    accord: "It complements Audralia Conservatory and Control Cockpit because visible body and readable state belong together."
  },
  cockpit: {
    blueprintKey: "cockpit",
    roomId: "controlCockpit",
    title: "Control Cockpit",
    cardinal: AXIS_EAST,
    coordinateName: "East Control Deck",
    jumpTarget: "#jump-cockpit",
    route: "controlRoom",
    target: "controlCockpitPath",
    href: "/showroom/globe/audralia/disposition/",
    disposition: "control and readout room",
    placement: "Control Cockpit is where Audralia’s readouts, controls, and instrument-facing views can be inspected.",
    accord: "It complements Worldroom, The Lab, and Frontier because readout must remain connected to visible terrain, proof, and applied systems."
  },
  frontier: {
    blueprintKey: "frontier",
    roomId: "frontier",
    title: "Frontier Playground",
    cardinal: AXIS_EAST,
    coordinateName: "East Yard",
    jumpTarget: "#jump-frontier",
    route: "frontier",
    target: "frontierPath",
    href: "/explore/frontier/",
    disposition: "applied future-systems yard",
    placement: "Frontier Playground is where energy, water, waste, feedback, infrastructure, manuals, and future ideas move toward practical shape.",
    accord: "It complements Audralia, Law Library, The Lab, and Product Gallery because future systems need a world, boundary, measurement, and usable public value."
  },
  product: {
    blueprintKey: "product",
    roomId: "productGallery",
    title: "Product Gallery",
    cardinal: AXIS_NORTHEAST,
    coordinateName: "Northeast Market Hall",
    jumpTarget: "#jump-product",
    route: "products",
    target: "productsPath",
    href: "/products/",
    disposition: "public-value room",
    placement: "Product Gallery shows how ideas, systems, tools, story-world objects, and practical offerings can become public-facing value.",
    accord: "It complements Main Hall, Frontier, and Atrium because usable value can come from ordinary site, applied systems, and narrative threshold."
  },
  lab: {
    blueprintKey: "lab",
    roomId: "theLab",
    title: "The Lab",
    cardinal: AXIS_WEST,
    coordinateName: "West Gauge Room",
    jumpTarget: "#jump-lab",
    route: "gauges",
    target: "gaugesPath",
    href: "/gauges/",
    disposition: "measurement room",
    placement: "The Lab helps separate what is working, what is held, and what still needs proof.",
    accord: "It complements Law Library, Scientific Law, Frontier, and Compass Desk because readiness needs boundary, test, future-system pressure, and orientation."
  },
  law: {
    blueprintKey: "law",
    roomId: "lawLibrary",
    title: "Law Library",
    cardinal: AXIS_WEST,
    coordinateName: "West Library",
    jumpTarget: "#jump-law",
    route: "laws",
    target: "lawsPath",
    href: "/laws/",
    disposition: "boundary and coherence room",
    placement: "Law Library holds the rules, categories, and constraints that keep the site from expanding without discipline.",
    accord: "It complements The Lab, Scientific Law, Frontier, and Compass Desk because boundary, measurement, future systems, and orientation must remain connected."
  }
});

const GUIDE_ROUTE_PLANNER = Object.freeze({
  startKeys: ["new", "mirrorland", "proof", "frontier"],
  goalKeys: ["orientation", "worlds", "proof", "frontier", "products"],
  count: 20,
  description: "Guide Desk route planner: four starting postures by five visitor goals."
});

const APPROVED_ROUTE_IDS = new Set([
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
  "mirrorland",
  "zionts",
  "audralia",
  "hEarth",
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
  "nineSummits",
  "aboutUnderdog"
]);

const APPROVED_TARGETS = new Set([
  "intro",
  "askFirst",

  "diamondGateOverviewPath",
  "splitInterfaceBridgePath",
  "traditionalWebsiteOverviewPath",
  "narrativePathOverview",
  "missionOverviewPath",
  "missionInnerPath",
  "missionCommunityPath",
  "missionCollaborationPath",
  "practicalRelevancePath",
  "diagnosticReferralPath",

  "websitePath",
  "skepticPlain",
  "proofPath",
  "diagnosticPath",
  "characterMirrorPath",
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
  "nineSummitsPath",
  "nineSummitsBookPath",
  "hearthPath",
  "hearthFacilityPath",
  "hearthConstructPath",
  "hearthFrontierPath",
  "hearthLawPath",
  "hEarthPath",
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
  "recenterNode",
  "loopRecovery",
  "cleanDoor",
  "switchTopics",
  "sharpQuestion",
  "returnFork",
  "restartFork",
  "priorTopicReturnPath",
  "originReturnPath"
]);

const DEFAULT_CONVERSATION_LABELS = {
  diamondGateOverviewPath: "What is DiamondGateBridge.com?",
  splitInterfaceBridgePath: "How do the two sides connect?",
  traditionalWebsiteOverviewPath: "What is the traditional website for?",
  narrativePathOverview: "What is the narrative path?",
  missionOverviewPath: "What is the mission behind this?",
  missionInnerPath: "What is the inner mission?",
  missionCommunityPath: "What is the community mission?",
  missionCollaborationPath: "How does the mission become practical?",
  practicalRelevancePath: "Why does this matter in the real world?",
  diagnosticReferralPath: "Where can I take the alignment diagnostic?",

  websitePath: "What is this place?",
  skepticPlain: "Can you explain this plainly?",
  proofPath: "Why should I trust this?",
  diagnosticPath: "What is the Coherence Diagnostic?",
  characterMirrorPath: "What does the Character Mirror show?",
  mirrorlandPath: "What is Mirrorland?",
  atriumPath: "Where does the South Gate lead?",
  atlasPath: "What are the roads inside Mirrorland?",
  charactersPath: "Who are the Characters?",
  compassPath: "How does the Compass help me start?",
  whereToStart: "Where should I start?",
  siteGuidePath: "How does the traditional website work?",
  lawsPath: "What keeps this honest?",
  scientificLawPath: "What needs to be tested?",
  scientificLawTheoryPath: "What theory is being tested?",
  scientificLawEvidencePath: "What would count as evidence?",
  scientificLawMeasurePath: "How would this be measured?",
  scientificLawLimitsPath: "What could prove this wrong?",
  scientificLawRoutePath: "How does a claim move through the test?",
  scientificLawLadderPath: "What makes a claim stronger?",
  scientificLawTermsPath: "Can you explain the proof terms?",
  gaugesPath: "What is working, and what still needs proof?",
  seanPath: "Who is Sean Mansfield?",
  underdogPath: "What is This Underdog?",
  productsPath: "What can I actually do here?",
  nineSummitsPath: "What is the Nine Summits road?",
  nineSummitsBookPath: "What is The Nine Summits of Love?",
  hearthPath: "What is Hearth?",
  hearthFacilityPath: "What is Hearth Mission Control?",
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
  futureProfilePath: "How does the Diagnostic become useful?",
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
};

const DEFAULT_HANDOFF_LABELS = {
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
  characters: "Open the Characters Hall",
  controlRoom: "Open the Control Room",
  nineSummits: "Open Nine Summits",
  aboutUnderdog: "Open This Underdog"
};

const ROUTE_HINTS = {
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
};

const DIAMOND_GATE_REGISTRY = Object.freeze({
  id: "diamondGateBridge",
  route: "siteGuide",
  target: "diamondGateOverviewPath",
  title: "DiamondGateBridge.com",
  splitInterface:
    "DiamondGateBridge.com has two ways in. One side is the traditional website: public pages, Compass, Products, Laws, and the creator path. The other side is the narrative path: Jeeves guides visitors through rooms, worlds, Characters, proof, and future-facing systems.",
  publicLane:
    "The traditional website gives visitors clear navigation, public structure, product context, laws, creator context, and practical entry points.",
  narrativeLane:
    "The narrative path carries the deeper mission: coherence, self-recognition, Mirrorland, Hearth, Characters, the Frontier Playground, and future-facing tests.",
  bridge:
    "The two sides are not separate websites. They are two entrances into one estate. Jeeves may move a visitor from the traditional website into Mirrorland, or from Mirrorland back into the traditional website structure."
});

const MISSION_REGISTRY = Object.freeze({
  id: "missionThreeLayerStructure",
  route: "mirrorland",
  target: "missionOverviewPath",
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
    from: "traditionalWebsiteOverviewPath",
    to: "narrativePathOverview",
    line: "Traditional Website and Narrative Path are separate entry lanes, but Jeeves should keep bridge doors open between them."
  },
  compassHearth: {
    from: "compassPath",
    to: "hearthPath",
    line: "Compass helps a visitor orient publicly. Hearth gives the narrative control-window version of orientation."
  },
  productsFrontier: {
    from: "productsPath",
    to: "frontierPath",
    line: "Products show public value. Frontier Playground shows how that value is tested as a future-facing system."
  },
  lawsScientificLaw: {
    from: "lawsPath",
    to: "scientificLawPath",
    line: "Law Library holds boundary. Scientific Law tests whether claims survive evidence, measurement, correction, and limits."
  },
  seanUnderdog: {
    from: "seanPath",
    to: "underdogPath",
    line: "Meet Sean gives creator context. This Underdog translates pressure, voice, and becoming into a human path."
  },
  missionNarrative: {
    from: "missionOverviewPath",
    to: "narrativePathOverview",
    line: "Mission belongs mainly to the narrative path because coherence, self-recognition, and the Frontier Playground carry its deeper work."
  },
  mirrorlandWebsite: {
    from: "mirrorlandPath",
    to: "traditionalWebsiteOverviewPath",
    line: "Mirrorland can always return to the traditional website when the visitor needs public structure, clear navigation, or a practical doorway."
  },
  diagnosticCharacterMirror: {
    from: "diagnosticReferralPath",
    to: "characterMirrorPath",
    line: "The Character Mirror may be explained by Jeeves, but assessment belongs to the Coherence Diagnostic."
  }
});

const CHARACTER_REGISTRY = {
  aurenVale: {
    id: "aurenVale",
    name: "Auren Vale",
    title: "Sanctuary Builder",
    target: "characterAurenValePath",
    route: "characters",
    oneLine: "Auren Vale protects the manor, but every life he shelters makes the sanctuary harder to hide.",
    pressure: "Every protected life makes the manor harder to hide.",
    function: "Guardian of the place everyone needs and everyone could expose.",
    mirror: "Protection, custody, shelter, and fear of exposure.",
    keywords: ["auren", "auren vale", "sanctuary", "shelter", "protection", "custody", "exposure", "hide", "protect"],
    summary:
      "Auren Vale is the Sanctuary Builder. He protects the manor, but every life he shelters makes the sanctuary harder to hide."
  },
  dextrion: {
    id: "dextrion",
    name: "Dextrion",
    title: "Earth-Side Originator",
    target: "characterDextrionPath",
    route: "characters",
    oneLine: "Dextrion opened the crossing from Earth and carries the burden of everyone who cannot return.",
    pressure: "Every one-way crossing remains on his hands.",
    function: "Earth-side sender of technology, people, and decisions into Mirrorland.",
    mirror: "Repair, responsibility, guilt, and pressure to fix what broke.",
    keywords: ["dextrion", "earth side", "earth-side", "originator", "repair", "fix", "guilt", "responsibility", "anomaly", "crossing"],
    summary:
      "Dextrion is the Earth-Side Originator. He opened the crossing from Earth and carries the burden of everyone who cannot return."
  },
  alaric: {
    id: "alaric",
    name: "Alaric",
    title: "Field Navigator",
    target: "characterAlaricPath",
    route: "characters",
    oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe.",
    pressure: "Waiting for proof can close the only safe route.",
    function: "Reads Audralia while the maps are incomplete and the planet is still teaching the team how it moves.",
    mirror: "Early warning, danger-reading, orientation, and action before others believe the proof.",
    keywords: ["alaric", "field navigator", "navigator", "danger", "warning", "route", "orientation", "before proof", "scout"],
    summary:
      "Alaric is the Field Navigator. He reads danger before proof arrives, which makes him necessary early and difficult to believe."
  },
  tarian: {
    id: "tarian",
    name: "Tarian",
    title: "Water Anchor",
    target: "characterTarianPath",
    route: "characters",
    oneLine: "Tarian keeps survival physical because no future matters if the body cannot continue.",
    pressure: "The future fails if the body cannot continue.",
    function: "Keeps survival tied to earth, water, air, distance, recovery, and human limit.",
    mirror: "Endurance, body-level survival, water, recovery, and carrying too much.",
    keywords: ["tarian", "water", "water anchor", "body", "endurance", "survival", "tired", "carry", "fatigue", "recovery"],
    summary:
      "Tarian is the Water Anchor. He keeps survival physical because no future matters if the body cannot continue."
  },
  elara: {
    id: "elara",
    name: "Elara",
    title: "Signal Bearer",
    target: "characterElaraPath",
    route: "characters",
    oneLine: "Elara makes the future visible before it disappears, but visibility always risks exposure.",
    pressure: "The future has to be visible before anyone moves toward it.",
    function: "Gives Audralia a visible future people can believe in without forgetting danger.",
    mirror: "Signal, visibility, hope, public voice, and risk of being seen.",
    keywords: ["elara", "signal", "signal bearer", "visible", "visibility", "hope", "future", "voice", "seen", "message"],
    summary:
      "Elara is the Signal Bearer. She makes the future visible before it disappears, but visibility always risks exposure."
  },
  soren: {
    id: "soren",
    name: "Soren",
    title: "Boundary Keeper",
    target: "characterSorenPath",
    route: "characters",
    oneLine: "Soren refuses fake restoration because hidden damage only creates another ZIONTS.",
    pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
    function: "Audits every claim that the new world is being saved cleanly.",
    mirror: "Truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
    keywords: ["soren", "boundary", "boundary keeper", "truth", "hidden cost", "cost", "evidence", "contradiction", "zionts", "contamination"],
    summary:
      "Soren is the Boundary Keeper. He refuses fake restoration because hidden damage only creates another ZIONTS."
  },
  jeeves: {
    id: "jeeves",
    name: "Jeeves",
    title: "Manor Interface",
    target: "characterJeevesPath",
    route: "characters",
    oneLine: "Jeeves sequences truth because the wrong amount of truth can send a visitor into the wrong room.",
    pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
    function: "Keeps the manor’s rooms, secrets, routes, and revelations in survivable order.",
    mirror: "Sequence, restraint, truth timing, entry, and controlled revelation.",
    keywords: ["jeeves", "manor interface", "sequence", "truth", "entry", "door", "timing", "control", "reveal", "permission"],
    summary:
      "Jeeves is the Manor Interface. He sequences truth because the wrong amount of truth can send a visitor into the wrong room."
  },
  remoteTeam: {
    id: "remoteTeam",
    name: "Remote Team",
    title: "Distributed Response Unit",
    target: "characterRemoteTeamPath",
    route: "characters",
    oneLine: "The Remote Team carries survival beyond the manor, where protection has to become distributable.",
    pressure: "If survival cannot leave the manor, the manor is only a bunker.",
    function: "Carries survival into cities, water lanes, field routes, climate zones, and public systems.",
    mirror: "Distributed responsibility, field logistics, public survival, and helping beyond the safe center.",
    keywords: ["remote team", "remote", "distributed", "team", "community", "field", "city", "help others", "beyond", "public survival"],
    summary:
      "The Remote Team is the Distributed Response Unit. They carry survival beyond the estate."
  }
};

const SCIENTIFIC_LAW_REGISTRY = {
  id: "scientificLaw",
  route: "scientificLaw",
  target: "scientificLawPath",
  chamber: "Reality Test Chamber",
  coreTruth:
    "A claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
  summary:
    "Scientific Law is the Reality Test chamber. It separates what sounds convincing from what keeps working after observation, evidence, measurement, comparison, correction, uncertainty, and limits.",
  doors: {
    theory: {
      target: "scientificLawTheoryPath",
      meaning: "Theory is the explanation that risks being wrong.",
      audit: "What would this theory predict, and what evidence would force it to be revised, narrowed, or rejected?"
    },
    evidence: {
      target: "scientificLawEvidencePath",
      meaning: "Evidence is the checkable record that survives preference.",
      audit: "Can this evidence be inspected, traced, compared, and matched to the exact claim it is being used to support?"
    },
    measure: {
      target: "scientificLawMeasurePath",
      meaning: "Measure is the coordinate system attached to a claim.",
      audit: "Is the method clear enough that another qualified observer could understand what was measured, how it was measured, and what error range travels with the result?"
    },
    limits: {
      target: "scientificLawLimitsPath",
      meaning: "Limits are the boundary that protects truth from overclaiming.",
      audit: "Does the claim carry its boundary clearly enough that a reader can tell where the claim stops being reliable?"
    }
  },
  routeSteps: ["Observe", "Define", "Measure", "Compare", "Revise", "Limit"],
  ladder: ["Impression", "Observation", "Evidence", "Measurement", "Repeatability", "Model", "Limitation", "Scientific Claim"]
};

const GAUGE_REGISTRY = {
  id: "gauges",
  route: "gauges",
  target: "gaugesPath",
  title: "Triple G",
  summary:
    "Triple G reads Goals, Gauges, and Gaps. It measures the jump between what the estate intends, what the current system shows, and what still has to be closed.",
  depth:
    "The Lab is the visible gauge room. It belongs near Law Library and Scientific Law because readiness only matters when the claim, the boundary, and the measurement agree.",
  gFields: {
    goals: "What the room or system is trying to become.",
    gauges: "What can be observed, measured, checked, or read back.",
    gaps: "What is still missing, held, unresolved, or not ready."
  }
};

const FRONTIER_REGISTRY = {
  id: "frontier",
  route: "frontier",
  target: "frontierPath",
  conjugation: "Mirrorland reveals. Audralia carries. Frontier tests. Hearth coordinates.",
  summary:
    "Frontier Playground is Audralia’s applied-science playground. It tests power, water, waste, feedback, infrastructure, ordered growth, city pressure, operating rules, visible signal, direction, and horizon aim.",
  systems: {
    energy: {
      name: "Energy",
      title: "Fusion Systems",
      route: "frontierEnergy",
      target: "frontierEnergyPath",
      status: "Fusion readiness",
      platform:
        "Energy starts with power readiness: how a future world stores energy, protects load, and prepares for cleaner power without pretending the final breakthrough is already solved.",
      engineering:
        "The engineering read separates today-ready power planning from frontier fusion readiness."
    },
    water: {
      name: "Water",
      title: "Closed Water Systems",
      route: "frontierWater",
      target: "frontierWaterPath",
      status: "Closed water systems",
      platform:
        "Water asks how water keeps moving without being wasted: capture, cleaning, routing, reuse, and continuity.",
      engineering:
        "The engineering read points toward source capture, filtration, storage, pressure routing, reuse loops, quality checks, and failure detection."
    },
    waste: {
      name: "Waste",
      title: "Wastewater Systems",
      route: "frontierWaste",
      target: "frontierWastePath",
      status: "Wastewater systems",
      platform:
        "Waste begins where discarded material becomes a design test: sanitation, recovery, cleaning, and reuse.",
      engineering:
        "The engineering read separates wastewater handling through intake, treatment stages, contaminant control, reuse classification, and return-material accounting."
    },
    closedLoop: {
      name: "Closed Loop",
      title: "Closed Loop Systems",
      route: "frontierClosedLoop",
      target: "frontierClosedLoopPath",
      status: "Answer-back systems",
      platform:
        "Closed Loop asks whether a system can answer back: detect pressure, register failure, correct course, and prove the correction returned somewhere useful.",
      engineering:
        "The engineering read focuses on feedback, receipts, thresholds, state changes, correction paths, and audit return."
    },
    infrastructure: {
      name: "Infrastructure",
      title: "Infrastructure Systems",
      route: "frontierInfrastructure",
      target: "frontierInfrastructurePath",
      status: "Support load",
      platform:
        "Infrastructure tests whether the world can carry weight: roads, supports, utilities, corridors, and load-bearing civic structure.",
      engineering:
        "The engineering read points toward load paths, utility layers, route capacity, maintenance access, redundancy, and failure isolation."
    },
    lattice: {
      name: "Lattice",
      title: "Lattice Systems",
      route: "frontierLattice",
      target: "frontierLatticePath",
      status: "Ordered growth",
      platform:
        "Lattice asks whether growth has order. Placement, count, relationship, and pattern keep a world from expanding randomly into noise.",
      engineering:
        "The engineering read treats lattice as coordinates, adjacency, hierarchy, repeatable nodes, and measured expansion."
    },
    urban: {
      name: "Urban",
      title: "Urban Systems",
      route: "frontierUrban",
      target: "frontierUrbanPath",
      status: "Civic pressure",
      platform:
        "Urban tests settlement pressure: corridors, density, shelter, public systems, and movement.",
      engineering:
        "The engineering read points toward civic load, mobility, zoning pressure, service corridors, density thresholds, and built-world consequence."
    },
    manual: {
      name: "Manual",
      title: "Frontier Manual",
      route: "frontierManual",
      target: "frontierManualPath",
      status: "Operating path",
      platform:
        "Manual turns the playground into instructions, handling rules, and readable next steps.",
      engineering:
        "The engineering read organizes procedures, terms, sequence, safety notes, and operating boundaries."
    },
    shimmer: {
      name: "Shimmer",
      title: "Shimmer Systems",
      route: "frontierShimmer",
      target: "frontierShimmerPath",
      status: "Visible signal",
      platform:
        "Shimmer makes change visible. A glint, warning, pulse, or surface shift tells the visitor that pressure is moving before the full system explains itself.",
      engineering:
        "The engineering read treats shimmer as signal logic: indication, detection, state cue, attention trigger, and visual feedback."
    },
    trajectory: {
      name: "Trajectory",
      title: "Trajectory Systems",
      route: "frontierTrajectory",
      target: "frontierTrajectoryPath",
      status: "Direction and timing",
      platform:
        "Trajectory asks where the future is moving. Direction, timing, path, and correction determine whether a system has motion or only activity.",
      engineering:
        "The engineering read points toward path modeling, timing windows, drift detection, course correction, and outcome tracking."
    },
    vision: {
      name: "Vision",
      title: "Vision Systems",
      route: "frontierVision",
      target: "frontierVisionPath",
      status: "Horizon aim",
      platform:
        "Vision keeps the horizon in view. It asks what kind of future the world is trying to reach before systems harden into habits.",
      engineering:
        "The engineering read connects purpose to roadmap structure: aims, constraints, future states, milestones, and risk of drift."
    }
  }
};

const HEARTH_CONSTRUCT_REGISTRY = {
  id: "hearthConstruct",
  route: "hearth",
  target: "hearthPath",
  role: "Hearth Mission Control",
  premise: "window_within_the_window",
  primaryLine: "Hearth is Mission Control — the window within the window.",
  portalLine:
    "The deeper unknown construct location is reached through the estate’s portal logic and exists somewhere in the universe; Hearth is the live estate chamber that gives the visitor and Jeeves a control view into it.",
  spine:
    "Mirrorland reveals. Audralia carries. Frontier tests. Scientific Law verifies. Hearth coordinates. Characters carry the pressure.",
  summary:
    "Hearth is the live Mission Control chamber inside the estate. Mirrorland is the larger future-facing window; Hearth is the inner control window where future potential is observed, coordinated, routed, and checked before it becomes world, system, route, or consequence.",
  operationalTruth:
    "Hearth should clarify why Jeeves is stationed here, why future systems converge here, and why the page can be local to the estate while still looking toward a cosmic unknown."
};

const MIRRORLAND_REGISTRY = {
  id: "mirrorland",
  route: "mirrorland",
  target: "mirrorlandPath",
  title: "Mirrorland",
  summary:
    "Mirrorland is where possible futures become visible before they become final. The website is the window, not the portal.",
  triad:
    "ZIONTS is consequence. H-Earth is survival. Audralia is possibility.",
  crossing:
    "Dextrion detects the Bermuda-area anomaly from Earth. The first team crosses into Mirrorland, the return path fails, and the mission becomes one-way.",
  hearthRelation:
    "Mirrorland is the larger future-facing field. Hearth is the window within that window, the inner Mission Control chamber where the view is coordinated."
};

const HEARTH_REGISTRY = {
  id: "hEarth",
  route: "hEarth",
  target: "hEarthPath",
  title: "H-Earth",
  summary:
    "H-Earth is the survival path. It treats Earth, Water, and Air as physical-condition logic, not generic world lore."
};

const CREATOR_REGISTRY = {
  id: "creator",
  route: "meetSean",
  target: "seanPath",
  title: "Meet the creator behind all of this",
  summary:
    "Sean Mansfield is the creator behind Diamond Gate Bridge: the estate, rooms, laws, worlds, characters, and conversation structure that holds them together.",
  depth:
    "The work comes from struggle, creative integrity, artistic integrity, a deep love for nature, preservation, growth, and societal understanding."
};

const UNDERDOG_REGISTRY = {
  id: "thisUnderdog",
  route: "aboutUnderdog",
  target: "underdogPath",
  title: "This Underdog",
  summary:
    "This Underdog is not Sean alone. It is the inner voice in the visitor that has carried pressure before it found language, direction, or use.",
  depth:
    "The underdog is the person whose strength has not fully been named yet. This path turns pain into orientation, pressure into voice, and survival into growth."
};

const SUMMITS_REGISTRY = {
  id: "nineSummits",
  route: "nineSummits",
  target: "nineSummitsPath",
  title: "Nine Summits",
  summary:
    "Nine Summits is the value road where the human climb becomes larger than a single page or product.",
  bookTarget: "nineSummitsBookPath",
  bookSummary:
    "The Nine Summits of Love is the book/seminar path. The nine summit sequence is Character, Structure, Balance, Stability, Peace, Joy, Dignity, Free Will, and Love.",
  carats:
    "256 carats names value under pressure, cut through experience, and clarified through love."
};

const COHERENCE_DIAGNOSTIC_REGISTRY = {
  id: "coherenceDiagnostic",
  route: "coherenceDiagnostic",
  target: "diagnosticPath",
  contract: "COHERENCE_DIAGNOSTIC_LINEAR_ONE_SCENARIO_SUBMIT_FLOW_TNT_v9",
  summary:
    "The Coherence Diagnostic is a local-only self-reflection and pattern-assessment tool. It uses self-rated coherence, claimed primary and secondary archetype, then real-world scenarios with a first move and support move.",
  boundaries:
    "It is not a medical, mental-health, legal, employment, intelligence, official IQ, or official MBTI diagnostic. It does not store, email, archive, submit, or save answers in the current version.",
  jeevesBoundary:
    "Jeeves may explain how the Coherence Diagnostic and Character Mirror connect, and may route the visitor to the Diagnostic. Jeeves does not conduct the assessment inside this chat."
};

const TARGET_INTENT_MAP = {
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

  compassPath: "orientation",
  whereToStart: "orientation",
  siteGuidePath: "traditionalWebsite",
  websitePath: "diamondGate",

  lawsPath: "laws",
  proofPath: "proof",
  scientificLawPath: "scientificLaw",
  scientificLawTheoryPath: "scientificLaw",
  scientificLawEvidencePath: "scientificLaw",
  scientificLawMeasurePath: "scientificLaw",
  scientificLawLimitsPath: "scientificLaw",
  scientificLawRoutePath: "scientificLaw",
  scientificLawLadderPath: "scientificLaw",
  scientificLawTermsPath: "scientificLaw",
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
  frontierLawPath: "frontier",
  frontierCharactersPath: "frontier",

  hearthPath: "hearth",
  hearthFacilityPath: "hearth",
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

  characterMirrorPath: "characterMirror",
  diagnosticPath: "diagnostic",
  futureProfilePath: "diagnosticReferral",

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
};

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
      maxItems: 4,
      items: { type: "string", maxLength: 420 }
    },
    options: {
      type: "array",
      maxItems: 6,
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
      maxItems: 6,
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

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, {
      ok: false,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      error: "METHOD_NOT_ALLOWED"
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
        handoffs: ["compass"],
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

    const payload = await readJsonBody(req);
    const normalized = normalizePayload(payload);
    const intent = classifyIntent(normalized);
    normalized.intent = intent;
    normalized.depthMode = inferDepthMode(normalized);
    normalized.fibonacciStage = inferFibonacciStage(normalized);
    normalized.promptMode = inferPromptMode(normalized);
    normalized.movementIntent = inferMovementIntent(normalized);

    const localSafety = localModerationCheck(normalized.visitorText);

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
        handoffs: ["compass", "laws", "coherenceDiagnostic"],
        confidence: "medium",
        needsRecenter: true,
        intent: "recenter",
        canonStatus: "blocked",
        nextTopic: "recenter",
        conclusiveState: "needs_sharper_question",
        usedRegistry: [],
        suggestedMode: "objective"
      }, normalized));
      return;
    }

    const memory = retrieveApprovedMemory(normalized);
    const allowed = buildAllowedSets(normalized, memory);

    if (shouldReturnDiagnosticReferral(normalized)) {
      const referral = buildDiagnosticReferralResponse(normalized);
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
      }, normalized, allowed));
      return;
    }

    if (!OPENAI_API_KEY) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "deterministic_fallback",
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
        bubbles: deterministicFallbackBubbles(normalized, memory),
        options: deterministicFallbackOptions(normalized, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        confidence: "medium",
        needsRecenter: shouldRecenter(normalized),
        intent,
        canonStatus: "fallback",
        nextTopic: inferNextTopic(normalized, memory),
        conclusiveState: inferConclusiveState(normalized, memory),
        usedRegistry: memory.map((item) => item.id),
        suggestedMode: inferSuggestedMode(intent, memory)
      }, normalized, allowed));
      return;
    }

    const inputModeration = await moderateText(normalized.visitorText);

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
        handoffs: ["compass", "siteGuide", "laws"],
        confidence: "medium",
        needsRecenter: true,
        intent: "recenter",
        canonStatus: "blocked",
        nextTopic: "recenter",
        conclusiveState: "needs_sharper_question",
        usedRegistry: [],
        suggestedMode: "objective"
      }, normalized, allowed));
      return;
    }

    const modelResult = await callModel(normalized, memory, allowed);
    const modelResponse = normalizeModelResponse(modelResult, normalized, memory, allowed);
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
        bubbles: deterministicFallbackBubbles(normalized, memory),
        options: deterministicFallbackOptions(normalized, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        confidence: "medium",
        needsRecenter: shouldRecenter(normalized),
        intent,
        canonStatus: "fallback",
        nextTopic: inferNextTopic(normalized, memory),
        conclusiveState: inferConclusiveState(normalized, memory),
        usedRegistry: memory.map((item) => item.id),
        suggestedMode: inferSuggestedMode(intent, memory)
      }, normalized, allowed));
      return;
    }

    sendJson(res, 200, safeResponse({
      ok: true,
      source: normalized.requestMode === "node_enrichment" ? "model_bridge_node_enrichment" : "model_bridge",
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
    }, normalized, allowed));
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
      handoffs: ["compass", "siteGuide"],
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

function setCorsHeaders(req, res) {
  const requestOrigin = req.headers && req.headers.origin ? String(req.headers.origin) : "";
  const allowOrigin = ALLOWED_ORIGIN || requestOrigin || "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function sendJson(res, status, data) {
  res.statusCode = status;

  if (typeof res.status === "function") {
    res.status(status);
  }

  if (typeof res.json === "function") {
    res.json(data);
    return;
  }

  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function normalizePayload(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  const visitorText = capString(raw.visitorText || raw.message || raw.query || raw.text || raw.selectedLabel || "", MAX_INPUT_CHARS);

  const selectedTarget = normalizeTarget(capString(raw.selectedTarget || raw.selectedOptionTarget || raw.optionTarget || "", 140));
  const selectedLabel = capString(raw.selectedLabel || raw.selectedOptionLabel || raw.optionLabel || "", 180);
  const requestMode = normalizeRequestMode(raw.requestMode || raw.mode || (selectedTarget ? "node_enrichment" : "freeform"));

  const currentRoomId = capString(raw.currentRoomId || raw.roomId || "", 140);
  const currentNode = normalizeTarget(capString(raw.currentNode || raw.target || "", 140));
  const currentEntry = normalizeTarget(capString(raw.currentEntry || raw.entry || "", 140));
  const currentPath = normalizeTarget(capString(raw.currentPath || raw.path || "", 140));
  const currentTopic = capString(raw.currentTopic || raw.topic || "", 140);

  const grammarFields = normalizeConversationGrammarFields(raw);

  return {
    visitorText,
    selectedTarget,
    selectedLabel,
    requestMode,

    promptMode: grammarFields.promptMode,
    optionKind: grammarFields.optionKind,
    archetypeAlignment: grammarFields.archetypeAlignment,
    bridgeMoment: grammarFields.bridgeMoment,
    movementIntent: grammarFields.movementIntent,
    bridgeContext: grammarFields.bridgeContext,
    branchStack: grammarFields.branchStack,
    transitionTrail: grammarFields.transitionTrail,

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

    currentNode,
    currentEntry,
    currentPath,
    currentTopic,
    currentRoomId,
    currentRoomName: capString(raw.currentRoomName || "", 160),
    currentCoordinateName: capString(raw.currentCoordinateName || "", 160),
    currentCardinal: capString(raw.currentCardinal || "", 16),
    currentPlaceType: capString(raw.currentPlaceType || "", 60),
    currentScopeLane: normalizeScope(raw.currentScopeLane || raw.scopeLane),
    currentVoiceMode: capString(raw.currentVoiceMode || raw.voiceMode || "", 100),
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
    cssContract: capString(raw.cssContract || "", 180),
    allowedTargets: normalizeList(raw.allowedTargets).map(normalizeTarget).filter((target) => APPROVED_TARGETS.has(target)),
    allowedRoutes: normalizeList(raw.allowedRoutes).map(normalizeRoute).filter((route) => APPROVED_ROUTE_IDS.has(route)),
    sessionTrail: normalizeList(raw.sessionTrail).slice(-MAX_TRAIL_ITEMS),
    visitedNodes: normalizeList(raw.visitedNodes).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),
    selectedTargets: normalizeList(raw.selectedTargets).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),
    selectedOptionKeys: normalizeList(raw.selectedOptionKeys).slice(-MAX_TRAIL_ITEMS),
    returnStack: normalizeList(raw.returnStack).map(normalizeTarget).slice(-MAX_TRAIL_ITEMS),
    requestedMode: capString(raw.requestedMode || "", 100),
    registryContext: sanitizeExternalRegistryContext(raw.registryContext),
    diagnosticResult: sanitizeDiagnosticResult(raw.diagnosticResult || raw.coherenceDiagnosticResult),
    guideBlueprintState: sanitizeGuideBlueprintState(raw.guideBlueprintState || raw.siteGuideState),
    intent: "unknown",
    fibonacciStage: FIBONACCI_STAGES[2]
  };
}

function normalizeConversationGrammarFields(raw) {
  return {
    promptMode: normalizePromptMode(raw.promptMode),
    optionKind: normalizeOptionKind(raw.optionKind),
    archetypeAlignment: normalizeArchetypeAlignment(raw.archetypeAlignment),
    bridgeMoment: normalizeBridgeMoment(raw.bridgeMoment),
    movementIntent: normalizeMovementIntent(raw.movementIntent),
    bridgeContext: sanitizeBridgeContext(raw.bridgeContext),
    branchStack: sanitizeTransitionList(raw.branchStack),
    transitionTrail: sanitizeTransitionList(raw.transitionTrail)
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

function sanitizeBridgeContext(value) {
  if (!value || typeof value !== "object") return null;

  return {
    currentNode: normalizeTarget(value.currentNode || ""),
    priorNode: normalizeTarget(value.priorNode || ""),
    selectedTarget: normalizeTarget(value.selectedTarget || ""),
    selectedLabel: capString(value.selectedLabel || "", 180),
    promptMode: normalizePromptMode(value.promptMode),
    optionKind: normalizeOptionKind(value.optionKind),
    archetypeAlignment: normalizeArchetypeAlignment(value.archetypeAlignment),
    bridgeMoment: normalizeBridgeMoment(value.bridgeMoment),
    movementIntent: normalizeMovementIntent(value.movementIntent),
    currentTopic: capString(value.currentTopic || "", 120),
    currentScopeStage: capString(value.currentScopeStage || "", 120),
    adjacentTarget: normalizeTarget(value.adjacentTarget || ""),
    adjacentLabel: capString(value.adjacentLabel || "", 160),
    adjacentReason: capString(value.adjacentReason || "", 400)
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

function sanitizeGuideBlueprintState(value) {
  if (!value || typeof value !== "object") return null;

  const activeBlueprintRoom = capString(value.activeBlueprintRoom || "", 80);
  const normalizedRoom = GUIDE_BLUEPRINT_ROOMS[activeBlueprintRoom] ? activeBlueprintRoom : "";

  return {
    contract: capString(value.contract || "", 180),
    activeBlueprintRoom: normalizedRoom,
    activeJumpSection: capString(value.activeJumpSection || "", 100),
    activeRouteStart: capString(value.activeRouteStart || "", 80),
    activeRouteGoal: capString(value.activeRouteGoal || "", 80),
    blueprintBootAuditPassed: Boolean(value.blueprintBootAuditPassed),
    diagnosticScope256: Boolean(value.diagnosticScope256),
    routeChoiceBoardController: Boolean(value.routeChoiceBoardController)
  };
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

function safeNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function capString(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function rateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = Number(process.env.JEEVES_RATE_LIMIT_PER_MINUTE || 60);
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
  if (ctx.selectedTarget && TARGET_INTENT_MAP[ctx.selectedTarget]) {
    return TARGET_INTENT_MAP[ctx.selectedTarget];
  }

  const text = [
    ctx.visitorText,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.requestMode,
    ctx.promptMode,
    ctx.optionKind,
    ctx.archetypeAlignment,
    ctx.bridgeMoment,
    ctx.movementIntent,
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
    ctx.requestedMode,
    ctx.sessionTrail.join(" "),
    ctx.selectedTargets.join(" ")
  ].join(" ").toLowerCase();

  if (/\b(recenter|lost|confused|start over|clean fork|reset|first fork|return to origin)\b/.test(text)) return "recenter";

  if (/\b(diamondgatebridge|diamond gate bridge|what is this place|what is diamondgate|what is the site|what is the website|two ways in|split interface|split-interface)\b/.test(text)) return "diamondGate";
  if (/\b(two sides|two ways|split interface|how do the two sides connect|bridge between website and narrative|traditional and narrative)\b/.test(text)) return "splitInterface";
  if (/\b(traditional website|public website|public pages|site guide|guide desk|compass|products|meet sean|public navigation|website side)\b/.test(text)) return "traditionalWebsite";
  if (/\b(narrative path|story path|enter the narrative|rooms worlds characters|worlds characters|mirrorland path|narrative side)\b/.test(text)) return "narrativePath";
  if (/\b(mission|inner mission|community mission|serve the community|protect children|protect animals|bullying|anti-bullying|stand up|collaboration|teamwork|growth|integrity|coherence)\b/.test(text)) return "mission";
  if (/\b(real world|practical relevance|why does this matter|why this matters|today's world|today’s world|practical today|why is this practical)\b/.test(text)) return "practicalRelevance";

  if (/\b(character mirror|diagnostic path|coherence diagnostic|alignment diagnostic|alignment read|archetype diagnostic|take the diagnostic|where can i take|which archetype|what archetype|what character am i|most like|assess me|score me|diagnose me)\b/.test(text)) {
    return "diagnosticReferral";
  }

  if (/\b(guide desk|blueprint|sitemap|jump pad|room map|estate map|route planner)\b/.test(text)) return "blueprint";

  if (/\b(scientific law|reality test|theory|evidence|measure|measurement|limits|claim testing|falsifiability|repeatability|calibration|uncertainty|causality|what would count as proof|what could prove this wrong|why should i trust)\b/.test(text)) {
    return "scientificLaw";
  }

  if (/\b(law library|laws|proof law|boundary|coherence law|law side|what keeps this honest)\b/.test(text)) return "laws";
  if (/\b(gauge|gauges|triple g|goals gauges gaps|readiness|pass|hold|fail|what is working)\b/.test(text)) return "gauges";

  if (/\b(frontier|playground|fusion|energy|water|waste|closed loop|infrastructure|lattice|urban|manual|shimmer|trajectory|vision|has to work)\b/.test(text)) {
    return "frontier";
  }

  if (/\b(hearth|mission control|window within the window|planetary construct|construct facility|construct engine|world-formation|planet construction)\b/.test(text)) {
    return "hearth";
  }

  if (findCharacterIdFromText(text) || /\b(character|characters|dossier|people|portrait hall|meet the characters|who are the characters)\b/.test(text)) {
    return "characters";
  }

  if (/\b(diagnostic|self[-\s]?rating|strategist|builder|mitigator|auditor|fragmentation)\b/.test(text)) {
    return "diagnostic";
  }

  if (/\b(mirrorland|audralia|zionts|h-earth|h earth|world window|south gate|atrium|atlas|interactive narrative)\b/.test(text)) {
    return "mirrorland";
  }

  if (/\b(sean|creator|designer|developer|founder|person behind|mind behind|artist|creative integrity|artistic integrity)\b/.test(text)) return "sean";
  if (/\b(underdog|inner voice|voice under pressure|pressure voice|underestimated)\b/.test(text)) return "underdog";
  if (/\b(nine summits|summits|summit|love|free will|dignity|joy|peace|stability|balance|structure|character)\b/.test(text)) return "summits";
  if (/\b(proof|real|testable|evidence)\b/.test(text)) return "proof";
  if (/\b(route|door|open|where should i go|next door|handoff|path)\b/.test(text)) return "route";

  return "diamondGate";
}

function inferPromptMode(ctx) {
  if (ctx.promptMode && ctx.promptMode !== "unknown_prompt") {
    return ctx.promptMode;
  }

  const text = [
    ctx.visitorText,
    ctx.selectedLabel,
    ctx.selectedTarget,
    ctx.currentTopic,
    ctx.movement,
    ctx.requestMode
  ].join(" ").toLowerCase();

  if (/\b(why should i trust|trust this|prove|proof|evidence|what proves|why does this matter|why is this important|what could prove this wrong|can this survive a real test|what would count as proof)\b/.test(text)) {
    return "skeptic_prompt";
  }

  if (/\b(real life|practical|work in the real world|what does this do|how does this work|use this|system|build|frontier|what has to work|what can i actually do|how does the mission become practical)\b/.test(text)) {
    return "practical_prompt";
  }

  if (/\b(inner mission|community mission|myself|personal|pressure|noise|integrity|coherence|underdog|diagnostic|alignment)\b/.test(text)) {
    return "personal_prompt";
  }

  if (/\b(continue|what happens next|next|go deeper|stay with this|show me more|who should i meet first|where should i go from here)\b/.test(text)) {
    return "progression_prompt";
  }

  if (/\b(recenter|lost|back|return|start over|where should i start|cleanest next door)\b/.test(text)) {
    return "recenter_prompt";
  }

  if (/\b(what is happening|what is this world|enter|meet|characters|story|mirrorland|audralia|zionts|h-earth|who is|what is|narrative path)\b/.test(text)) {
    return "story_prompt";
  }

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
  if (/\b(recenter|start over|lost)\b/.test(text)) return "recenter";

  return "ask_jeeves";
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

function inferDepthMode(ctx) {
  const requested = String(ctx.depthMode || "").toLowerCase();
  if (requested === DEPTH_INTRO || requested === DEPTH_INTERMEDIATE || requested === DEPTH_DEEP) return requested;

  if (ctx.requestMode === "node_enrichment") return DEPTH_INTERMEDIATE;
  if (ctx.selectedTarget && isNarrativeTarget(ctx.selectedTarget)) return DEPTH_INTERMEDIATE;
  if (ctx.revealDepth >= 8 || ctx.topicDepth >= 4 || ctx.pathDepth >= 4) return DEPTH_DEEP;
  if (ctx.revealDepth >= 3 || ctx.topicDepth >= 2 || ctx.pathDepth >= 2) return DEPTH_INTERMEDIATE;

  const deepWords = /\b(deep|full|complete|canon|gauge|g-level|g level|why exactly|show the whole|full picture|fine[-\s]?tooth)\b/i;
  if (deepWords.test(ctx.visitorText)) return DEPTH_DEEP;

  const midWords = /\b(connect|relate|where does it sit|how does it fit|why is it near|blueprint|cardinal|directional|bridge|mission)\b/i;
  if (midWords.test(ctx.visitorText)) return DEPTH_INTERMEDIATE;

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

function getAxis(cardinal) {
  return NEWS_AXES[cardinal] || NEWS_AXES.C;
}

function getBlueprintRoomByTarget(target) {
  const clean = normalizeTarget(target);

  for (const key of Object.keys(GUIDE_BLUEPRINT_ROOMS)) {
    const room = GUIDE_BLUEPRINT_ROOMS[key];
    if (room.target === clean) return room;
  }

  if (clean === "diamondGateOverviewPath") return GUIDE_BLUEPRINT_ROOMS.main;
  if (clean === "traditionalWebsiteOverviewPath") return GUIDE_BLUEPRINT_ROOMS.guide;
  if (clean === "narrativePathOverview") return GUIDE_BLUEPRINT_ROOMS.atrium;
  if (clean === "missionOverviewPath" || clean === "missionInnerPath" || clean === "missionCommunityPath" || clean === "missionCollaborationPath") return GUIDE_BLUEPRINT_ROOMS.atrium;
  if (clean === "practicalRelevancePath") return GUIDE_BLUEPRINT_ROOMS.frontier;
  if (clean === "diagnosticReferralPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "characterMirrorPath") return GUIDE_BLUEPRINT_ROOMS.atlas;

  if (clean === "scientificLawPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawTheoryPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawEvidencePath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawMeasurePath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawLimitsPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "gaugesPath") return GUIDE_BLUEPRINT_ROOMS.lab;
  if (clean === "hearthPath" || clean === "hearthFacilityPath" || clean === "hearthConstructPath" || clean === "hearthFrontierPath" || clean === "hearthLawPath") return GUIDE_BLUEPRINT_ROOMS.audralia;
  if (clean === "hEarthPath") return GUIDE_BLUEPRINT_ROOMS.atlas;
  if (clean === "charactersPath") return GUIDE_BLUEPRINT_ROOMS.atlas;
  if (clean === "seanPath") return GUIDE_BLUEPRINT_ROOMS.compass;
  if (clean === "underdogPath") return GUIDE_BLUEPRINT_ROOMS.compass;
  if (clean === "nineSummitsPath" || clean === "nineSummitsBookPath") return GUIDE_BLUEPRINT_ROOMS.compass;

  return null;
}

function getBlueprintRoomByCurrent(ctx) {
  if (ctx.selectedTarget) {
    const selectedRoom = getBlueprintRoomByTarget(ctx.selectedTarget);
    if (selectedRoom) return selectedRoom;
  }

  if (ctx.guideBlueprintState && ctx.guideBlueprintState.activeBlueprintRoom) {
    return GUIDE_BLUEPRINT_ROOMS[ctx.guideBlueprintState.activeBlueprintRoom] || null;
  }

  const search = [
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentRoomId,
    ctx.currentTopic
  ].filter(Boolean);

  for (const item of search) {
    const byTarget = getBlueprintRoomByTarget(item);
    if (byTarget) return byTarget;

    const exact = Object.values(GUIDE_BLUEPRINT_ROOMS).find((room) => {
      return room.roomId === item || room.blueprintKey === item || room.title === item;
    });

    if (exact) return exact;
  }

  return null;
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
    ctx.requestedMode,
    ctx.sessionTrail.join(" "),
    ctx.transitionTrail.map((item) => item.label || "").join(" "),
    ctx.registryContext ? ctx.registryContext.summary : ""
  ].join(" ").toLowerCase();

  const base = buildApprovedMemory();
  const intent = ctx.intent || classifyIntent(ctx);

  const scored = base.map((item) => {
    let score = 0;

    if (ctx.selectedTarget && item.targets.includes(ctx.selectedTarget)) score += 20;
    if (ctx.selectedTarget && ctx.selectedTarget.toLowerCase().includes(item.id.toLowerCase())) score += 5;
    if (ctx.selectedLabel && text.includes(ctx.selectedLabel.toLowerCase())) score += 2;
    if (ctx.requestMode === "node_enrichment" && item.intents && item.intents.includes(intent)) score += 4;
    if (ctx.promptMode && ctx.promptMode !== "unknown_prompt") score += promptModeMemoryBoost(ctx.promptMode, item);
    if (ctx.currentEntry && ctx.currentEntry.toLowerCase() === item.id.toLowerCase()) score += 8;
    if (ctx.currentNode && item.targets.includes(normalizeTarget(ctx.currentNode))) score += 6;
    if (ctx.currentPath && item.targets.includes(normalizeTarget(ctx.currentPath))) score += 6;
    if (ctx.currentRoomId && item.roomId === ctx.currentRoomId) score += 7;
    if (ctx.currentScopeLane === "narrative" && (item.scope === "narrative" || item.scope === "character")) score += 1;
    if (ctx.currentScopeLane === "objective" && item.scope === "objective") score += 1;
    if (item.intents && item.intents.includes(intent)) score += 8;

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
      base.find((item) => item.id === "missionThreeLayerStructure"),
      base.find((item) => item.id === "guideBlueprint"),
      base.find((item) => item.id === "compass")
    ].filter(Boolean);
  }

  return dedupeMemory(scored).slice(0, MAX_CONTEXT_ITEMS);
}

function promptModeMemoryBoost(promptMode, item) {
  if (promptMode === "skeptic_prompt" && (item.intents.includes("proof") || item.intents.includes("scientificLaw") || item.intents.includes("laws") || item.intents.includes("practicalRelevance"))) return 4;
  if (promptMode === "practical_prompt" && (item.intents.includes("frontier") || item.intents.includes("traditionalWebsite") || item.routes.includes("products"))) return 4;
  if (promptMode === "personal_prompt" && (item.intents.includes("mission") || item.intents.includes("diagnosticReferral") || item.intents.includes("underdog"))) return 4;
  if (promptMode === "story_prompt" && (item.scope === "narrative" || item.scope === "character" || item.intents.includes("narrativePath"))) return 3;
  if (promptMode === "progression_prompt") return 1;
  return 0;
}

function buildApprovedMemory() {
  const memory = [
    memoryFromRegistry("diamondGateBridgeSplitInterface", {
      scope: "objective",
      keywords: ["diamondgatebridge", "diamond gate bridge", "website", "estate", "site", "what is this", "split interface", "two ways in", "traditional website", "narrative path"],
      routes: ["siteGuide", "compass", "mirrorland", "meetSean"],
      targets: [
        "diamondGateOverviewPath",
        "splitInterfaceBridgePath",
        "traditionalWebsiteOverviewPath",
        "narrativePathOverview",
        "missionOverviewPath",
        "practicalRelevancePath"
      ],
      intents: ["diamondGate", "splitInterface", "orientation", "traditionalWebsite", "narrativePath", "mission", "practicalRelevance"],
      roomId: "mainHall",
      cardinal: AXIS_CENTER,
      summary:
        DIAMOND_GATE_REGISTRY.splitInterface + " " +
        DIAMOND_GATE_REGISTRY.publicLane + " " +
        DIAMOND_GATE_REGISTRY.narrativeLane + " " +
        DIAMOND_GATE_REGISTRY.bridge
    }),
    memoryFromRegistry("traditionalWebsiteLane", {
      scope: "objective",
      keywords: ["traditional website", "public website", "public pages", "compass", "products", "laws", "meet sean", "site guide", "public navigation"],
      routes: ["siteGuide", "compass", "products", "laws", "meetSean"],
      targets: [
        "traditionalWebsiteOverviewPath",
        "compassPath",
        "productsPath",
        "lawsPath",
        "seanPath",
        "splitInterfaceBridgePath",
        "narrativePathOverview"
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
      routes: ["mirrorland", "hearth", "characters", "frontier", "scientificLaw"],
      targets: [
        "narrativePathOverview",
        "missionOverviewPath",
        "mirrorlandPath",
        "hearthPath",
        "charactersPath",
        "frontierPath",
        "scientificLawPath",
        "traditionalWebsiteOverviewPath",
        "splitInterfaceBridgePath"
      ],
      intents: ["narrativePath", "mission", "mirrorland", "hearth", "characters", "frontier", "scientificLaw"],
      roomId: "atrium",
      cardinal: AXIS_SOUTH,
      summary:
        "The Narrative Path carries the deeper mission: coherence, self-recognition, Hearth, Mirrorland, Characters, Frontier Playground, Scientific Law, Audralia, H-Earth, and ZIONTS. It should always allow a bridge back to traditional website structure."
    }),
    memoryFromRegistry("missionThreeLayerStructure", {
      scope: "narrative",
      keywords: ["mission", "inner mission", "community mission", "service", "bullying", "children", "animals", "collaboration", "teamwork", "coherence", "higher self", "integrity", "growth", "development"],
      routes: ["mirrorland", "frontier", "coherenceDiagnostic", "compass"],
      targets: [
        "missionOverviewPath",
        "missionInnerPath",
        "missionCommunityPath",
        "missionCollaborationPath",
        "narrativePathOverview",
        "frontierPath",
        "practicalRelevancePath",
        "diagnosticReferralPath"
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
      routes: ["siteGuide", "mirrorland", "compass", "hearth", "frontier", "scientificLaw"],
      targets: [
        "splitInterfaceBridgePath",
        "traditionalWebsiteOverviewPath",
        "narrativePathOverview",
        "compassPath",
        "hearthPath",
        "productsPath",
        "frontierPath",
        "lawsPath",
        "scientificLawPath"
      ],
      intents: ["splitInterface", "route", "orientation", "narrativePath", "traditionalWebsite"],
      roomId: "bridgeMap",
      cardinal: AXIS_CENTER,
      summary:
        Object.keys(BRIDGE_PAIR_REGISTRY).map((key) => BRIDGE_PAIR_REGISTRY[key].line).join(" ")
    }),
    memoryFromRegistry("diagnosticReferralBoundary", {
      scope: "objective",
      keywords: ["diagnostic", "coherence diagnostic", "alignment diagnostic", "archetype", "character mirror", "assess", "assessment", "score", "which character", "which archetype", "most like"],
      routes: ["coherenceDiagnostic", "characters"],
      targets: ["diagnosticReferralPath", "diagnosticPath", "characterMirrorPath", "charactersPath"],
      intents: ["diagnosticReferral", "diagnostic", "characterMirror"],
      roomId: "diagnosticReferral",
      cardinal: AXIS_WEST_SOUTH,
      summary:
        COHERENCE_DIAGNOSTIC_REGISTRY.summary + " " +
        COHERENCE_DIAGNOSTIC_REGISTRY.boundaries + " " +
        COHERENCE_DIAGNOSTIC_REGISTRY.jeevesBoundary
    }),
    memoryFromRegistry("guideBlueprint", {
      scope: "objective",
      keywords: ["site guide", "guide desk", "blueprint", "sitemap", "room map", "jump pad", "route planner", "20 paths"],
      routes: ["siteGuide"],
      targets: ["siteGuidePath", "traditionalWebsiteOverviewPath", "compassPath", "lawsPath", "gaugesPath", "atriumPath", "frontierPath"],
      intents: ["blueprint", "orientation", "route", "traditionalWebsite"],
      roomId: "guideDesk",
      cardinal: AXIS_NORTH,
      summary:
        "Guide Desk is the directional blueprint authority. It defines public blueprint rooms, exact jump targets, and route planning."
    }),
    memoryFromRegistry("compass", {
      scope: "objective",
      keywords: ["compass", "orientation", "where to start", "start", "lost", "begin"],
      routes: ["compass", "siteGuide"],
      targets: ["compassPath", "siteGuidePath", "diamondGateOverviewPath", "traditionalWebsiteOverviewPath", "narrativePathOverview", "hearthPath"],
      intents: ["orientation", "recenter", "route", "traditionalWebsite"],
      roomId: "compassDesk",
      cardinal: AXIS_NORTH,
      summary:
        "The Compass is the cleanest public orientation point. It helps visitors choose between public structure, proof, mission, practical use, creator context, and Mirrorland."
    }),
    memoryFromRegistry("laws", {
      scope: "objective",
      keywords: ["laws", "law library", "law", "boundary", "proof hierarchy", "coherence"],
      routes: ["laws", "scientificLaw", "gauges"],
      targets: ["lawsPath", "scientificLawPath", "gaugesPath", "splitInterfaceBridgePath"],
      intents: ["laws", "proof", "scientificLaw"],
      roomId: "lawLibrary",
      cardinal: AXIS_WEST,
      summary:
        "Law Library holds the rules, categories, and constraints that keep the estate from expanding without discipline. It bridges naturally into Scientific Law."
    }),
    memoryFromRegistry("scientificLaw", {
      scope: "objective",
      keywords: ["scientific law", "reality test", "theory", "evidence", "measure", "limits", "claim", "falsifiability", "repeatability"],
      routes: ["scientificLaw", "laws", "gauges"],
      targets: [
        "scientificLawPath",
        "scientificLawTheoryPath",
        "scientificLawEvidencePath",
        "scientificLawMeasurePath",
        "scientificLawLimitsPath",
        "scientificLawRoutePath",
        "scientificLawLadderPath",
        "frontierLawPath",
        "lawsPath",
        "gaugesPath"
      ],
      intents: ["scientificLaw", "proof", "laws"],
      roomId: "scientificLaw",
      cardinal: AXIS_WEST,
      summary: SCIENTIFIC_LAW_REGISTRY.summary + " " + SCIENTIFIC_LAW_REGISTRY.coreTruth
    }),
    memoryFromRegistry("gauges", {
      scope: "objective",
      keywords: ["gauges", "gauge", "triple g", "goals gauges gaps", "readiness", "pass", "hold", "fail"],
      routes: ["gauges", "laws", "scientificLaw"],
      targets: ["gaugesPath", "lawsPath", "scientificLawPath"],
      intents: ["gauges", "proof", "scientificLaw"],
      roomId: "theLab",
      cardinal: AXIS_WEST,
      summary: GAUGE_REGISTRY.summary + " " + GAUGE_REGISTRY.depth
    }),
    memoryFromRegistry("frontier", {
      scope: "narrative",
      keywords: ["frontier", "frontier playground", "energy", "fusion", "water", "waste", "closed loop", "infrastructure", "lattice", "urban", "manual", "shimmer", "trajectory", "vision"],
      routes: ["frontier", "audralia", "laws", "gauges", "hearth", "products"],
      targets: ["frontierPath", "frontierSystemsPath", "frontierLawPath", "frontierCharactersPath", "hearthFrontierPath", "productsPath", "missionCollaborationPath", "practicalRelevancePath"],
      intents: ["frontier", "mirrorland", "hearth", "practicalRelevance", "mission"],
      roomId: "frontier",
      cardinal: AXIS_EAST,
      summary: FRONTIER_REGISTRY.summary + " " + FRONTIER_REGISTRY.conjugation
    }),
    memoryFromRegistry("hearthConstruct", {
      scope: "narrative",
      keywords: ["hearth", "mission control", "window within the window", "construct facility", "construct engine", "planetary", "world-formation", "portal", "unknown future"],
      routes: ["hearth", "frontier", "scientificLaw", "mirrorland"],
      targets: ["hearthPath", "hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath", "frontierPath", "scientificLawPath", "mirrorlandPath", "compassPath"],
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
      routes: ["mirrorland", "hearth", "audralia", "frontier", "characters", "siteGuide"],
      targets: ["mirrorlandPath", "atriumPath", "atlasPath", "hearthPath", "audraliaPath", "frontierPath", "charactersPath", "traditionalWebsiteOverviewPath", "splitInterfaceBridgePath"],
      intents: ["mirrorland", "hearth", "frontier", "characters", "narrativePath"],
      roomId: "mirrorland",
      cardinal: AXIS_SOUTH,
      summary: MIRRORLAND_REGISTRY.summary + " " + MIRRORLAND_REGISTRY.triad + " " + MIRRORLAND_REGISTRY.crossing + " " + MIRRORLAND_REGISTRY.hearthRelation
    }),
    memoryFromRegistry("hEarth", {
      scope: "narrative",
      keywords: ["h-earth", "h earth", "survival", "earth water air", "physical condition"],
      routes: ["hEarth", "mirrorland"],
      targets: ["hEarthPath", "atlasPath", "mirrorlandPath"],
      intents: ["mirrorland"],
      roomId: "hEarth",
      cardinal: AXIS_SOUTH,
      summary: HEARTH_REGISTRY.summary
    }),
    memoryFromRegistry("characters", {
      scope: "character",
      keywords: ["characters", "character hall", "character mirror", "who are the characters", "meet the characters"],
      routes: ["characters", "mirrorland", "coherenceDiagnostic"],
      targets: ["charactersPath", "characterIdentityPath", "characterFirstPath", "characterRelationshipsPath", "characterStoryPressurePath", "characterMirrorPath", "diagnosticReferralPath"],
      intents: ["characters", "characterMirror", "diagnosticReferral", "narrativePath"],
      roomId: "characters",
      cardinal: AXIS_SOUTH,
      summary:
        "The Characters turn Mirrorland from abstract explanation into encounter. Jeeves can introduce and explain them, but he does not classify the visitor as a Character."
    }),
    memoryFromRegistry("creator", {
      scope: "objective",
      keywords: ["sean", "creator", "designer", "developer", "person behind", "mind behind", "founder", "artistic integrity", "creative integrity"],
      routes: ["meetSean", "aboutUnderdog", "nineSummits"],
      targets: ["seanPath", "underdogPath", "nineSummitsPath", "productsPath", "traditionalWebsiteOverviewPath"],
      intents: ["sean", "orientation", "summits", "traditionalWebsite"],
      roomId: "meetSean",
      cardinal: AXIS_NORTH,
      summary: CREATOR_REGISTRY.summary + " " + CREATOR_REGISTRY.depth
    }),
    memoryFromRegistry("thisUnderdog", {
      scope: "objective",
      keywords: ["this underdog", "underdog", "inner voice", "voice", "pressure", "comedy", "becoming", "language", "underestimated"],
      routes: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "nineSummits"],
      targets: ["underdogPath", "seanPath", "diagnosticReferralPath", "nineSummitsPath"],
      intents: ["underdog", "diagnosticReferral", "summits"],
      roomId: "thisUnderdog",
      cardinal: AXIS_NORTH,
      summary: UNDERDOG_REGISTRY.summary + " " + UNDERDOG_REGISTRY.depth
    }),
    memoryFromRegistry("nineSummits", {
      scope: "objective",
      keywords: ["nine summits", "summits", "love", "256 carats", "character", "structure", "balance", "stability", "peace", "joy", "dignity", "free will"],
      routes: ["nineSummits", "meetSean", "aboutUnderdog"],
      targets: ["nineSummitsPath", "nineSummitsBookPath", "seanPath", "underdogPath"],
      intents: ["summits", "sean", "underdog"],
      roomId: "nineSummits",
      cardinal: AXIS_SOUTH_NORTH,
      summary: SUMMITS_REGISTRY.summary + " " + SUMMITS_REGISTRY.bookSummary + " " + SUMMITS_REGISTRY.carats
    })
  ];

  Object.keys(GUIDE_BLUEPRINT_ROOMS).forEach((key) => {
    const room = GUIDE_BLUEPRINT_ROOMS[key];
    memory.push(memoryFromRegistry("blueprint:" + key, {
      scope: room.cardinal === AXIS_SOUTH || room.cardinal === AXIS_EAST || room.cardinal === AXIS_SOUTHEAST || room.cardinal === AXIS_SOUTHWEST ? "narrative" : "objective",
      keywords: [key, room.title.toLowerCase(), room.roomId.toLowerCase(), room.coordinateName.toLowerCase()],
      routes: [room.route],
      targets: [room.target],
      intents: ["blueprint", "orientation", "route"],
      roomId: room.roomId,
      cardinal: room.cardinal,
      summary: room.title + ": " + room.placement + " " + room.accord
    }));
  });

  Object.keys(CHARACTER_REGISTRY).forEach((id) => {
    const character = CHARACTER_REGISTRY[id];
    memory.push(memoryFromRegistry("character:" + id, {
      scope: "character",
      keywords: character.keywords,
      routes: ["characters"],
      targets: [character.target, "charactersPath", "characterRelationshipsPath", "characterMirrorPath", "diagnosticReferralPath"],
      intents: ["characters", "characterMirror"],
      roomId: "characters",
      cardinal: AXIS_SOUTH,
      summary: character.summary + " Mirror signal: " + character.mirror
    }));
  });

  Object.keys(FRONTIER_REGISTRY.systems).forEach((id) => {
    const system = FRONTIER_REGISTRY.systems[id];
    memory.push(memoryFromRegistry("frontier:" + id, {
      scope: "narrative",
      keywords: [id, system.name.toLowerCase(), system.title.toLowerCase(), system.status.toLowerCase()],
      routes: [system.route, "frontier"],
      targets: [system.target, "frontierSystemsPath", "frontierLawPath", "hearthFrontierPath", "missionCollaborationPath", "practicalRelevancePath"],
      intents: ["frontier", "practicalRelevance", "mission"],
      roomId: "frontier",
      cardinal: AXIS_EAST,
      summary: system.name + " / " + system.title + ": " + system.platform + " Engineering lens: " + system.engineering
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

  if (ctx.selectedTarget && APPROVED_TARGETS.has(ctx.selectedTarget)) {
    targetSet.add(ctx.selectedTarget);
  }

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
      "diamondGateOverviewPath",
      "narrativePathOverview",
      "traditionalWebsiteOverviewPath",
      "missionOverviewPath",
      "practicalRelevancePath",
      "returnFork"
    ].forEach((target) => targetSet.add(target));
  }

  if (!routeSet.size) {
    ["compass", "siteGuide", "mirrorland"].forEach((route) => routeSet.add(route));
  }

  [
    "cleanDoor",
    "returnFork",
    "priorTopicReturnPath",
    "originReturnPath",
    "switchTopics",
    "sharpQuestion",
    "recenterNode"
  ].forEach((target) => targetSet.add(target));

  return { routeSet, targetSet };
}

function expandAllowedByIntent(intent, targetSet, routeSet) {
  const addTargets = (items) => items.forEach((target) => APPROVED_TARGETS.has(target) && targetSet.add(target));
  const addRoutes = (items) => items.forEach((route) => APPROVED_ROUTE_IDS.has(route) && routeSet.add(route));

  if (intent === "diamondGate" || intent === "splitInterface" || intent === "orientation" || intent === "unknown") {
    addTargets([
      "diamondGateOverviewPath",
      "splitInterfaceBridgePath",
      "traditionalWebsiteOverviewPath",
      "narrativePathOverview",
      "missionOverviewPath",
      "practicalRelevancePath",
      "mirrorlandPath",
      "compassPath",
      "siteGuidePath",
      "seanPath"
    ]);
    addRoutes(["mirrorland", "siteGuide", "compass", "meetSean"]);
  }

  if (intent === "traditionalWebsite" || intent === "blueprint") {
    addTargets([
      "traditionalWebsiteOverviewPath",
      "compassPath",
      "siteGuidePath",
      "productsPath",
      "lawsPath",
      "seanPath",
      "splitInterfaceBridgePath",
      "narrativePathOverview"
    ]);
    addRoutes(["siteGuide", "compass", "products", "laws", "meetSean", "mirrorland"]);
  }

  if (intent === "narrativePath") {
    addTargets([
      "narrativePathOverview",
      "missionOverviewPath",
      "missionInnerPath",
      "mirrorlandPath",
      "hearthPath",
      "charactersPath",
      "frontierPath",
      "scientificLawPath",
      "traditionalWebsiteOverviewPath",
      "splitInterfaceBridgePath"
    ]);
    addRoutes(["mirrorland", "hearth", "characters", "frontier", "scientificLaw", "siteGuide"]);
  }

  if (intent === "mission") {
    addTargets([
      "missionOverviewPath",
      "missionInnerPath",
      "missionCommunityPath",
      "missionCollaborationPath",
      "narrativePathOverview",
      "mirrorlandPath",
      "frontierPath",
      "practicalRelevancePath",
      "diagnosticReferralPath",
      "traditionalWebsiteOverviewPath"
    ]);
    addRoutes(["mirrorland", "frontier", "coherenceDiagnostic", "siteGuide", "compass"]);
  }

  if (intent === "practicalRelevance") {
    addTargets([
      "practicalRelevancePath",
      "missionCollaborationPath",
      "frontierPath",
      "productsPath",
      "scientificLawPath",
      "lawsPath",
      "narrativePathOverview",
      "traditionalWebsiteOverviewPath"
    ]);
    addRoutes(["frontier", "products", "scientificLaw", "laws", "siteGuide", "mirrorland"]);
  }

  if (intent === "diagnosticReferral" || intent === "diagnostic" || intent === "characterMirror") {
    addTargets([
      "diagnosticReferralPath",
      "diagnosticPath",
      "characterMirrorPath",
      "charactersPath",
      "missionInnerPath",
      "scientificLawPath",
      "cleanDoor"
    ]);
    addRoutes(["coherenceDiagnostic", "characters", "scientificLaw"]);
  }

  if (intent === "scientificLaw" || intent === "proof" || intent === "laws") {
    addTargets([
      "lawsPath",
      "scientificLawPath",
      "scientificLawTheoryPath",
      "scientificLawEvidencePath",
      "scientificLawMeasurePath",
      "scientificLawLimitsPath",
      "scientificLawRoutePath",
      "scientificLawLadderPath",
      "scientificLawTermsPath",
      "frontierLawPath",
      "gaugesPath",
      "splitInterfaceBridgePath",
      "cleanDoor"
    ]);
    addRoutes(["scientificLaw", "laws", "gauges"]);
  }

  if (intent === "gauges") {
    addTargets(["gaugesPath", "lawsPath", "scientificLawPath", "frontierLawPath", "cleanDoor"]);
    addRoutes(["gauges", "laws", "scientificLaw"]);
  }

  if (intent === "frontier") {
    addTargets([
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
      "hearthFrontierPath",
      "frontierLawPath",
      "frontierCharactersPath",
      "productsPath",
      "missionCollaborationPath",
      "practicalRelevancePath",
      "cleanDoor"
    ]);
    addRoutes([
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
      "audralia",
      "products"
    ]);
  }

  if (intent === "hearth") {
    addTargets([
      "hearthPath",
      "hearthFacilityPath",
      "hearthConstructPath",
      "hearthFrontierPath",
      "hearthLawPath",
      "frontierPath",
      "scientificLawPath",
      "mirrorlandPath",
      "compassPath",
      "cleanDoor"
    ]);
    addRoutes(["hearth", "frontier", "scientificLaw", "mirrorland", "compass"]);
  }

  if (intent === "characters") {
    addTargets([
      "charactersPath",
      "characterAurenValePath",
      "characterDextrionPath",
      "characterAlaricPath",
      "characterTarianPath",
      "characterElaraPath",
      "characterSorenPath",
      "characterJeevesPath",
      "characterRemoteTeamPath",
      "characterRelationshipsPath",
      "characterStoryPressurePath",
      "characterFirstPath",
      "characterMirrorPath",
      "diagnosticReferralPath",
      "mirrorlandPath"
    ]);
    addRoutes(["characters", "mirrorland", "coherenceDiagnostic"]);
  }

  if (intent === "mirrorland") {
    addTargets([
      "mirrorlandPath",
      "atriumPath",
      "atlasPath",
      "ziontsPath",
      "hEarthPath",
      "audraliaPath",
      "hearthPath",
      "frontierPath",
      "charactersPath",
      "traditionalWebsiteOverviewPath",
      "splitInterfaceBridgePath"
    ]);
    addRoutes(["mirrorland", "showroom", "hearth", "audralia", "hEarth", "frontier", "characters", "siteGuide"]);
  }

  if (intent === "sean") {
    addTargets(["seanPath", "underdogPath", "nineSummitsPath", "nineSummitsBookPath", "productsPath", "traditionalWebsiteOverviewPath"]);
    addRoutes(["meetSean", "aboutUnderdog", "nineSummits", "products", "siteGuide"]);
  }

  if (intent === "underdog") {
    addTargets(["underdogPath", "seanPath", "nineSummitsPath", "diagnosticReferralPath", "missionInnerPath"]);
    addRoutes(["aboutUnderdog", "meetSean", "nineSummits", "coherenceDiagnostic"]);
  }

  if (intent === "summits") {
    addTargets(["nineSummitsPath", "nineSummitsBookPath", "underdogPath", "seanPath", "missionOverviewPath"]);
    addRoutes(["nineSummits", "aboutUnderdog", "meetSean"]);
  }

  if (intent === "recenter" || intent === "route") {
    addTargets([
      "diamondGateOverviewPath",
      "compassPath",
      "siteGuidePath",
      "traditionalWebsiteOverviewPath",
      "narrativePathOverview",
      "missionOverviewPath",
      "lawsPath",
      "scientificLawPath",
      "diagnosticReferralPath",
      "mirrorlandPath",
      "frontierPath",
      "productsPath",
      "cleanDoor",
      "returnFork",
      "switchTopics",
      "sharpQuestion"
    ]);
    addRoutes(["compass", "siteGuide", "laws", "scientificLaw", "coherenceDiagnostic", "mirrorland", "frontier"]);
  }
}

function shouldRecenter(ctx) {
  return ctx.loopCount >= 3 || ctx.topicDepth >= 5 || ctx.intent === "recenter";
}

function shouldReturnDiagnosticReferral(ctx) {
  const intent = ctx.intent || classifyIntent(ctx);
  if (intent === "diagnosticReferral") return true;

  const text = [
    ctx.visitorText,
    ctx.selectedTarget,
    ctx.selectedLabel,
    ctx.currentTopic,
    ctx.requestedMode
  ].join(" ").toLowerCase();

  return /\b(which archetype|what archetype|which character am i|what character am i|most like|assess me|score me|diagnose me|run the mirror question|ask me the mirror question|first mirror question|second mirror question|third mirror question)\b/.test(text);
}

function buildDiagnosticReferralResponse(_ctx) {
  return {
    bubbles: [
      "I can explain how the Character Mirror and the Coherence Diagnostic connect, but I do not assess you here.",
      "Jeeves is here to orient you, introduce the estate, explain the Characters, and guide the paths.",
      "If you want an alignment read, that belongs in the Coherence Diagnostic."
    ],
    options: [
      makePromptOption("What is the Coherence Diagnostic?", "diagnosticPath", "personal_prompt", "personal_entry"),
      makePromptOption("What does the Character Mirror show?", "characterMirrorPath", "story_prompt", "story_entry"),
      makePromptOption("How does this connect to the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry")
    ],
    handoffs: ["coherenceDiagnostic", "characters"],
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

function makeForwardOption(label, target) {
  const normalizedTarget = normalizeTarget(target);

  return {
    label: capString(label, 110),
    target: normalizedTarget,
    type: "conversation",
    scopeLane: isNarrativeTarget(normalizedTarget) ? "narrative" : "objective",
    promptMode: "progression_prompt",
    optionKind: "forward",
    archetypeAlignment: "unknown_entry",
    bridgeMoment: "after_knowledge",
    movementIntent: "continue_current_path"
  };
}

function makeReturnOption(label, target) {
  return {
    label: capString(label, 110),
    target: normalizeTarget(target),
    type: "control",
    scopeLane: "objective",
    promptMode: "recenter_prompt",
    optionKind: "return",
    archetypeAlignment: "unknown_entry",
    bridgeMoment: "return_fork",
    movementIntent: "return_one_threshold"
  };
}

function makeParallelOption(label, target, archetypeAlignment) {
  const normalizedTarget = normalizeTarget(target);

  return {
    label: capString(label, 110),
    target: normalizedTarget,
    type: "conversation",
    scopeLane: isNarrativeTarget(normalizedTarget) ? "narrative" : "objective",
    promptMode: "progression_prompt",
    optionKind: "parallel",
    archetypeAlignment: normalizeArchetypeAlignment(archetypeAlignment || "unknown_entry"),
    bridgeMoment: "parallel_crossing",
    movementIntent: "cross_to_related_room"
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

function inferPromptModeFromLabel(label, target) {
  const text = [label, target].join(" ").toLowerCase();
  if (/\btrust|proof|evidence|wrong|matter|important|test\b/.test(text)) return "skeptic_prompt";
  if (/\breal world|work|system|use|frontier|product|energy|water|waste|practical\b/.test(text)) return "practical_prompt";
  if (/\bmission|inner|community|myself|mirror|diagnostic|underdog|coherence|alignment\b/.test(text)) return "personal_prompt";
  if (/\bnext|continue|first|return|start\b/.test(text)) return "progression_prompt";
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
          name: "jeeves_backbrain_v5_1_split_interface_guided_path_response",
          strict: true,
          schema: RESPONSE_SCHEMA
        }
      },
      max_output_tokens: 1200
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
    "Conversation options may be questions, requests, or statements of intent.",
    "Prepared-door labels may be navigation actions, but conversation options may not sound like route controls.",
    "Primary visitor experience: Jeeves orients, explains, guides, and routes. Jeeves does not assess.",
    "DiamondGateBridge has two ways in: the traditional website lane and the narrative path lane.",
    "The traditional website lane gives public structure: Compass, Products, Laws, Meet Sean, and clear navigation.",
    "The narrative path lane carries the deeper mission: coherence, self-recognition, Mirrorland, Hearth, Characters, Frontier Playground, and future-facing proof pressure.",
    "The two lanes are not isolated. Jeeves should periodically offer bridge paths between them.",
    "Mission is a three-layer structure: general shared direction, inner coherence / self-recognition, and outward service / community protection, with collaboration and Frontier Playground making it practical.",
    "Community mission includes service, standing against bullying, protecting children, protecting animals, and helping people feel safer and supported.",
    "The collaboration mission points toward teamwork, practical systems, public value, and building better outcomes together.",
    "The inner mission should avoid generic self-help language. Speak about clarity through noise, pressure, direction, honesty, capability, and integrity.",
    "Character Mirror rule: Jeeves may explain what the Character Mirror shows, how it relates to Characters, and where the Diagnostic fits.",
    "Jeeves may not assess, score, classify, diagnose, or decide which archetype or Character the visitor resembles.",
    "If the visitor asks to be assessed, scored, typed, or matched, refer them to the Coherence Diagnostic.",
    "Coherence Diagnostic boundary: it is local-only in its current version and is not medical, mental-health, legal, employment, official IQ, or official MBTI assessment.",
    "Characters are not merely roles. They are necessary people inside a greater story progression.",
    "Mirrorland does not stay abstract. The story becomes clearer when the Characters enter it.",
    "Hearth canon: Hearth is Mission Control, the window within the window. Mirrorland is the larger future-facing window. Hearth is the inner estate control view into unknown future potential.",
    "The deeper unknown construct location is reached through estate portal logic and exists somewhere in the universe. Hearth is the live estate chamber that gives the visitor and Jeeves a control view into it.",
    "Scientific Law rule: a claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
    "If requestMode is node_enrichment, selectedTarget and selectedLabel are the strongest signals for the answer.",
    "If promptMode is present, answer in that mode.",
    "If promptMode is missing, infer it from selectedLabel and visitorText.",
    "If promptMode is story_prompt, answer what is happening, who is involved, what the user is seeing, or what the room/story is.",
    "If promptMode is skeptic_prompt, answer why the claim matters, why it can be trusted, what proves it, what limits it, or what could break it.",
    "If promptMode is practical_prompt, answer what works, what can be used, what the real-world consequence is, or what system has to function.",
    "If promptMode is personal_prompt, answer how the visitor may relate, what mirror is being offered, or what pressure is being discussed, without diagnosing identity.",
    "If promptMode is progression_prompt, answer what happens next and give a clean next step.",
    "If the thread is already clear, use conclusiveState complete, route_ready, or switch_recommended instead of repeating definitions.",
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
      livePageAccess: ctx.livePageAccess,
      plannedLivePageAccess: ctx.plannedLivePageAccess,
      currentRoomContext: ctx.currentRoomContext,
      currentRoomRole: ctx.currentRoomRole,
      currentRoomPremise: ctx.currentRoomPremise,
      estateKnowledgeMode: ctx.estateKnowledgeMode,
      portalLogic: ctx.portalLogic,
      routeAuthority: ctx.routeAuthority,
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
      visitorPosture: ctx.visitorPosture,
      movement: ctx.movement,
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
    approvedRegistries: {
      diamondGate: DIAMOND_GATE_REGISTRY,
      mission: MISSION_REGISTRY,
      bridgePairs: BRIDGE_PAIR_REGISTRY,
      guideBlueprint: {
        rooms: GUIDE_BLUEPRINT_ROOMS,
        routePlanner: GUIDE_ROUTE_PLANNER
      },
      characters: Object.values(CHARACTER_REGISTRY).map((character) => ({
        id: character.id,
        name: character.name,
        title: character.title,
        pressure: character.pressure,
        mirror: character.mirror,
        summary: character.summary
      })),
      scientificLaw: SCIENTIFIC_LAW_REGISTRY,
      gauges: GAUGE_REGISTRY,
      frontierSystems: FRONTIER_REGISTRY.systems,
      hearth: HEARTH_CONSTRUCT_REGISTRY,
      mirrorland: MIRRORLAND_REGISTRY,
      creator: CREATOR_REGISTRY,
      underdog: UNDERDOG_REGISTRY,
      summits: SUMMITS_REGISTRY,
      coherenceDiagnostic: COHERENCE_DIAGNOSTIC_REGISTRY
    },
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
      conversationGrammarRule: "Conversation options must be complete user texts to Jeeves. They can be questions, requests, or statements of intent.",
      routeSeparationRule: "Conversation options explain or continue. Handoffs open pages.",
      promptModeRule: "Return promptMode, optionKind, archetypeAlignment, bridgeMoment, and movementIntent for every option.",
      diagnosticBoundaryRule: "Do not assess, score, classify, diagnose, or decide which archetype or Character resembles the visitor. Refer assessment requests to the Coherence Diagnostic.",
      mapVisibilityRule: "Use room map and route placement invisibly unless the visitor asks for room relationship, map, proof structure, or placement.",
      bridgeRule: "When a visitor is in one lane, offer at least one path that can eventually bridge to the other lane when useful."
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
  const subject = primary ? primary.id : ctx.intent || "orientation";

  return {
    narrativeDisposition: inferNarrativeDisposition(ctx, primary, blueprint),
    narrativePlacement: blueprint
      ? blueprint.placement
      : axis.publicLine,
    narrativeAccord: blueprint
      ? blueprint.accord
      : "This subject should be tied back to its nearest room, route, and neighboring meaning before the visitor moves.",
    narrativePath: inferNarrativePath(ctx, primary, blueprint, allowed),
    narrativeConclusion: inferNarrativeConclusion(ctx, primary, blueprint),
    fibonacciDepth: stage.step,
    fibonacciStage: stage.name,
    fibonacciPurpose: stage.purpose,
    cardinalFrame: axis,
    blueprintRoom: blueprint || null,
    subject,
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
    splitInterfaceFrame: {
      active: true,
      traditionalWebsite: DIAMOND_GATE_REGISTRY.publicLane,
      narrativePath: DIAMOND_GATE_REGISTRY.narrativeLane,
      bridge: DIAMOND_GATE_REGISTRY.bridge
    },
    diagnosticBoundaryFrame: {
      active: ctx.intent === "diagnosticReferral" || ctx.intent === "diagnostic" || ctx.intent === "characterMirror",
      boundary: COHERENCE_DIAGNOSTIC_REGISTRY.jeevesBoundary
    },
    hearthMissionControlFrame: {
      active: isHearthMissionControlContext(ctx),
      premise: HEARTH_CONSTRUCT_REGISTRY.primaryLine,
      portalLine: HEARTH_CONSTRUCT_REGISTRY.portalLine
    }
  };
}

function inferNarrativeDisposition(ctx, memoryItem, blueprint) {
  if (ctx.intent === "diamondGate") return "estate overview";
  if (ctx.intent === "splitInterface") return "bridge between entry lanes";
  if (ctx.intent === "traditionalWebsite") return "public website lane";
  if (ctx.intent === "narrativePath") return "guided narrative lane";
  if (ctx.intent === "mission") return "mission fork";
  if (ctx.intent === "practicalRelevance") return "real-world relevance bridge";
  if (ctx.intent === "diagnosticReferral") return "diagnostic referral boundary";
  if (ctx.intent === "characterMirror") return "Character Mirror explanation";
  if (ctx.intent === "hearth") return "mission-control chamber";
  if (blueprint) return blueprint.disposition;
  if (ctx.intent === "scientificLaw") return "reality-test chamber";
  if (ctx.intent === "laws") return "law and boundary room";
  if (ctx.intent === "gauges") return "measurement and readiness room";
  if (ctx.intent === "characters") return "character encounter path";
  if (ctx.intent === "frontier") return "future-systems yard";
  if (ctx.intent === "mirrorland") return "future-facing world window";
  if (ctx.intent === "sean") return "creator source room";
  if (ctx.intent === "underdog") return "inner voice lane";
  if (ctx.intent === "summits") return "value road";
  if (memoryItem && memoryItem.scope === "character") return "character pressure profile";
  return "estate orientation subject";
}

function inferNarrativePath(ctx, memoryItem, blueprint, allowed) {
  const targets = [];
  const routes = [];

  if (ctx.selectedTarget && allowed.targetSet.has(ctx.selectedTarget)) {
    targets.push(ctx.selectedTarget);
  }

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

function inferNarrativeConclusion(ctx, memoryItem, blueprint) {
  if (ctx.intent === "diamondGate") return "The visitor should understand that DiamondGateBridge has a traditional website lane and a narrative path lane.";
  if (ctx.intent === "splitInterface") return "The visitor should understand that the two lanes are separate entrances into one estate and may bridge both ways.";
  if (ctx.intent === "traditionalWebsite") return "The visitor should understand the public structure before choosing a deeper or practical route.";
  if (ctx.intent === "narrativePath") return "The visitor should understand that the narrative path carries the deeper mission through Hearth, Mirrorland, Characters, and Frontier Playground.";
  if (ctx.intent === "mission") return "The visitor should understand the three mission layers before choosing inner coherence, community service, or practical collaboration.";
  if (ctx.intent === "practicalRelevance") return "The visitor should understand why this matters beyond story: systems, behavior, proof, community, and practical future-building.";
  if (ctx.intent === "diagnosticReferral" || ctx.intent === "characterMirror") return "The visitor should understand that Jeeves can explain and route, but assessment belongs in the Coherence Diagnostic.";
  if (ctx.intent === "hearth") return "The visitor should understand that Hearth is Mission Control, not a decorative world label: it is the window within the window.";
  if (ctx.intent === "scientificLaw") return "The visitor should understand that a claim is not finished until it can be tested, measured, corrected, and limited.";
  if (ctx.intent === "laws") return "The visitor should understand that the Law Library gives boundary before the estate expands further.";
  if (ctx.intent === "gauges") return "The visitor should understand what is working, what is held, and what still needs proof.";
  if (ctx.intent === "characters") return "The visitor should understand that Characters turn Mirrorland from explanation into encounter.";
  if (ctx.intent === "frontier") return "The visitor should understand that Frontier Playground tests what future worlds may need.";
  if (ctx.intent === "sean") return "The visitor should understand the creator behind the estate before reducing the work to a website.";
  if (ctx.intent === "underdog") return "The visitor should recognize the underdog as inner pressure becoming voice, not only as Sean’s story.";
  if (ctx.intent === "summits") return "The visitor should understand that the Summit road turns pressure toward love, dignity, free will, and direction.";
  if (blueprint) return "The visitor should understand why this room belongs where it is before choosing the next door.";
  if (memoryItem) return "The visitor should receive a grounded answer and a clean next door.";
  return "The visitor should be re-centered before moving deeper.";
}

function extractResponseText(data) {
  if (!data) return "";

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

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
      const type = normalizeOptionType(item.type, optionKind);

      return {
        label,
        target,
        type,
        scopeLane: normalizeOptionScope(item.scopeLane, target),
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
  if (actionLike) {
    return DEFAULT_CONVERSATION_LABELS[target] || "";
  }

  return value;
}

function normalizeOptionType(type, optionKind) {
  if (optionKind === "control" || optionKind === "return") return "control";
  if (["conversation", "topic", "calibration", "back", "control"].includes(type)) return type;
  return "conversation";
}

function normalizeOptionScope(scopeLane, target) {
  if (scopeLane === "narrative") return "narrative";
  return isNarrativeTarget(target) ? "narrative" : "objective";
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

function isHearthMissionControlContext(ctx) {
  if (!ctx) return false;
  return isHearthContext(ctx) ||
    ctx.currentRoomContext === "hearth" ||
    ctx.currentRoomRole === "mission_control" ||
    ctx.currentRoomPremise === "window_within_the_window";
}

function deterministicFallbackBubbles(ctx, memory) {
  const intent = ctx.intent || classifyIntent(ctx);
  const promptMode = inferPromptMode(ctx);

  if (intent === "diagnosticReferral" || intent === "characterMirror") {
    return buildDiagnosticReferralResponse(ctx).bubbles;
  }

  if (intent === "diamondGate") {
    return [
      "DiamondGateBridge.com has two ways in.",
      "One side is the traditional website: the public pages, Compass, Products, Laws, and the creator path.",
      "The other side is the narrative path: I can guide you through rooms, worlds, Characters, proof, and future-facing systems.",
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

  if (intent === "scientificLaw") {
    if (promptMode === "skeptic_prompt") {
      return [
        "The trust test is simple: a claim has to risk being wrong.",
        SCIENTIFIC_LAW_REGISTRY.coreTruth,
        "The next useful question is whether you want to test theory, evidence, measurement, or limits."
      ];
    }

    return [
      "Scientific Law is the room where convincing language has to become testable.",
      SCIENTIFIC_LAW_REGISTRY.coreTruth,
      "The four main doors are Theory, Evidence, Measure, and Limits."
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

  if (intent === "blueprint") {
    return [
      "The Guide Desk is where the estate becomes easier to navigate.",
      "It gives you a readable map, but the map is not the experience. The map helps you choose a clean next door.",
      "You can start with the traditional website, the narrative path, proof, mission, or Frontier Playground."
    ];
  }

  if (intent === "laws") {
    return [
      "The Law Library keeps the estate from expanding without discipline.",
      "If you want to know whether something can be trusted, the next door is Scientific Law.",
      "If you want to know whether something is working, the next door is Triple G."
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
  if (intent === "characters" && characterId) {
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

function deterministicFallbackOptions(ctx, memory, allowed) {
  const intent = ctx.intent || classifyIntent(ctx);

  if (intent === "diamondGate") return filterOptionsForAllowed(conversationPromptSet("diamondGate"), allowed);
  if (intent === "splitInterface") return filterOptionsForAllowed(conversationPromptSet("splitInterface"), allowed);
  if (intent === "traditionalWebsite") return filterOptionsForAllowed(conversationPromptSet("traditionalWebsite"), allowed);
  if (intent === "narrativePath") return filterOptionsForAllowed(conversationPromptSet("narrativePath"), allowed);
  if (intent === "mission") return filterOptionsForAllowed(conversationPromptSet("mission"), allowed);
  if (intent === "practicalRelevance") return filterOptionsForAllowed(conversationPromptSet("practicalRelevance"), allowed);
  if (intent === "diagnosticReferral" || intent === "characterMirror" || intent === "diagnostic") return filterOptionsForAllowed(conversationPromptSet("diagnosticReferral"), allowed);
  if (intent === "mirrorland") return filterOptionsForAllowed(conversationPromptSet("mirrorland"), allowed);
  if (intent === "characters") return filterOptionsForAllowed(conversationPromptSet("characters"), allowed);
  if (intent === "scientificLaw" || intent === "laws" || intent === "proof") return filterOptionsForAllowed(conversationPromptSet("scientificLaw"), allowed);
  if (intent === "frontier") return filterOptionsForAllowed(conversationPromptSet("frontier"), allowed);
  if (intent === "hearth") return filterOptionsForAllowed(conversationPromptSet("hearth"), allowed);
  if (intent === "sean") return filterOptionsForAllowed(conversationPromptSet("sean"), allowed);
  if (intent === "underdog") return filterOptionsForAllowed(conversationPromptSet("underdog"), allowed);
  if (intent === "summits") return filterOptionsForAllowed(conversationPromptSet("summits"), allowed);
  if (intent === "gauges") return filterOptionsForAllowed(conversationPromptSet("gauges"), allowed);
  if (intent === "blueprint") return filterOptionsForAllowed(conversationPromptSet("blueprint"), allowed);

  return filterOptionsForAllowed(conversationPromptSet("orientation"), allowed);
}

function conversationPromptSet(key) {
  const sets = {
    diamondGate: [
      makePromptOption("What is the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("What is the traditional website for?", "traditionalWebsiteOverviewPath", "story_prompt", "story_entry"),
      makePromptOption("What is the mission behind this?", "missionOverviewPath", "personal_prompt", "personal_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry"),
      makePromptOption("What is Mirrorland?", "mirrorlandPath", "story_prompt", "story_entry")
    ],
    splitInterface: [
      makePromptOption("What is the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("What is the traditional website for?", "traditionalWebsiteOverviewPath", "story_prompt", "story_entry"),
      makePromptOption("How does Mirrorland connect back to the website?", "splitInterfaceBridgePath", "progression_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry")
    ],
    traditionalWebsite: [
      makePromptOption("How does the Compass help me start?", "compassPath", "story_prompt", "story_entry"),
      makePromptOption("What can I actually do here?", "productsPath", "practical_prompt", "practical_entry"),
      makePromptOption("What keeps this honest?", "lawsPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("Who is Sean Mansfield?", "seanPath", "story_prompt", "source_entry"),
      makePromptOption("Show me the narrative version.", "narrativePathOverview", "progression_prompt", "story_entry")
    ],
    narrativePath: [
      makePromptOption("What is the mission behind the narrative path?", "missionOverviewPath", "personal_prompt", "personal_entry"),
      makePromptOption("What is Mirrorland?", "mirrorlandPath", "story_prompt", "story_entry"),
      makePromptOption("Who are the Characters?", "charactersPath", "story_prompt", "story_entry"),
      makePromptOption("What is the Frontier Playground?", "frontierPath", "practical_prompt", "practical_entry"),
      makePromptOption("How does this connect back to the website?", "traditionalWebsiteOverviewPath", "progression_prompt", "story_entry")
    ],
    mission: [
      makePromptOption("What is the inner mission?", "missionInnerPath", "personal_prompt", "personal_entry"),
      makePromptOption("What is the community mission?", "missionCommunityPath", "personal_prompt", "personal_entry"),
      makePromptOption("How does the mission become practical?", "missionCollaborationPath", "practical_prompt", "practical_entry"),
      makePromptOption("How does this connect to Mirrorland?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry")
    ],
    practicalRelevance: [
      makePromptOption("What is the Frontier Playground?", "frontierPath", "practical_prompt", "practical_entry"),
      makePromptOption("Can this survive a real test?", "scientificLawPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("What can I actually do here?", "productsPath", "practical_prompt", "practical_entry"),
      makePromptOption("How does the mission become practical?", "missionCollaborationPath", "practical_prompt", "practical_entry")
    ],
    diagnosticReferral: [
      makePromptOption("What is the Coherence Diagnostic?", "diagnosticPath", "personal_prompt", "personal_entry"),
      makePromptOption("What does the Character Mirror show?", "characterMirrorPath", "story_prompt", "story_entry"),
      makePromptOption("How does this connect to the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry")
    ],
    mirrorland: [
      makePromptOption("What is Mirrorland?", "mirrorlandPath", "story_prompt", "story_entry"),
      makePromptOption("What could go wrong here?", "ziontsPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("What can still be saved?", "hEarthPath", "practical_prompt", "practical_entry"),
      makePromptOption("I’d like to meet the Characters.", "charactersPath", "story_prompt", "story_entry"),
      makePromptOption("How does this connect back to the website?", "traditionalWebsiteOverviewPath", "progression_prompt", "story_entry")
    ],
    characters: [
      makePromptOption("Who are the Characters?", "charactersPath", "story_prompt", "story_entry"),
      makePromptOption("Why do these Characters matter?", "characterStoryPressurePath", "skeptic_prompt", "proof_entry"),
      makePromptOption("Who should I meet first?", "characterFirstPath", "progression_prompt", "story_entry"),
      makePromptOption("What does the Character Mirror show?", "characterMirrorPath", "story_prompt", "story_entry"),
      makePromptOption("Where can I take the alignment diagnostic?", "diagnosticReferralPath", "personal_prompt", "personal_entry")
    ],
    scientificLaw: [
      makePromptOption("What needs to be tested?", "scientificLawPath", "story_prompt", "proof_entry"),
      makePromptOption("Why should I trust this?", "scientificLawEvidencePath", "skeptic_prompt", "proof_entry"),
      makePromptOption("What would count as proof?", "scientificLawMeasurePath", "practical_prompt", "practical_entry"),
      makePromptOption("What could prove this wrong?", "scientificLawLimitsPath", "skeptic_prompt", "boundary_entry"),
      makePromptOption("How does this bridge back to the Laws?", "lawsPath", "progression_prompt", "proof_entry")
    ],
    frontier: [
      makePromptOption("What is the Frontier Playground?", "frontierPath", "practical_prompt", "practical_entry"),
      makePromptOption("Which system should I look at first?", "frontierSystemsPath", "story_prompt", "systems_entry"),
      makePromptOption("Can this survive a real test?", "scientificLawPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("How does this become practical?", "missionCollaborationPath", "practical_prompt", "practical_entry"),
      makePromptOption("How does this connect to Products?", "productsPath", "progression_prompt", "practical_entry")
    ],
    hearth: [
      makePromptOption("What is Hearth?", "hearthPath", "story_prompt", "story_entry"),
      makePromptOption("What is Hearth coordinating?", "hearthConstructPath", "practical_prompt", "systems_entry"),
      makePromptOption("Why does this room answer to proof?", "hearthLawPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("How does Hearth connect to the Compass?", "compassPath", "progression_prompt", "story_entry")
    ],
    sean: [
      makePromptOption("Who is Sean Mansfield?", "seanPath", "story_prompt", "source_entry"),
      makePromptOption("What is This Underdog?", "underdogPath", "personal_prompt", "personal_entry"),
      makePromptOption("What is the mission behind this?", "missionOverviewPath", "personal_prompt", "personal_entry"),
      makePromptOption("How does this connect to the traditional website?", "traditionalWebsiteOverviewPath", "progression_prompt", "story_entry")
    ],
    underdog: [
      makePromptOption("What is This Underdog?", "underdogPath", "story_prompt", "personal_entry"),
      makePromptOption("How does pressure become a voice?", "underdogPath", "personal_prompt", "personal_entry"),
      makePromptOption("How does this connect back to Sean?", "seanPath", "progression_prompt", "source_entry"),
      makePromptOption("What is the inner mission?", "missionInnerPath", "personal_prompt", "personal_entry")
    ],
    summits: [
      makePromptOption("What is the Nine Summits road?", "nineSummitsPath", "story_prompt", "story_entry"),
      makePromptOption("What is The Nine Summits of Love?", "nineSummitsBookPath", "story_prompt", "story_entry"),
      makePromptOption("How does this connect to This Underdog?", "underdogPath", "personal_prompt", "personal_entry"),
      makePromptOption("What is the mission behind this?", "missionOverviewPath", "personal_prompt", "personal_entry")
    ],
    gauges: [
      makePromptOption("What is working, and what still needs proof?", "gaugesPath", "practical_prompt", "proof_entry"),
      makePromptOption("What are the Goals?", "gaugesPath", "story_prompt", "systems_entry"),
      makePromptOption("What do the Gauges show?", "gaugesPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("What are the Gaps?", "gaugesPath", "practical_prompt", "boundary_entry")
    ],
    blueprint: [
      makePromptOption("How does the traditional website work?", "traditionalWebsiteOverviewPath", "story_prompt", "story_entry"),
      makePromptOption("Where should I start?", "whereToStart", "progression_prompt", "story_entry"),
      makePromptOption("Why should I trust this map?", "lawsPath", "skeptic_prompt", "proof_entry"),
      makePromptOption("Show me the narrative path.", "narrativePathOverview", "story_prompt", "story_entry")
    ],
    orientation: [
      makePromptOption("What is DiamondGateBridge.com?", "diamondGateOverviewPath", "story_prompt", "story_entry"),
      makePromptOption("What is the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
      makePromptOption("What is the traditional website for?", "traditionalWebsiteOverviewPath", "story_prompt", "story_entry"),
      makePromptOption("What is the mission behind this?", "missionOverviewPath", "personal_prompt", "personal_entry"),
      makePromptOption("Why does this matter in the real world?", "practicalRelevancePath", "practical_prompt", "practical_entry")
    ]
  };

  return sets[key] || sets.orientation;
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
    routes.push("compass", "siteGuide", "mirrorland");
  }

  return Array.from(new Set(routes.map(normalizeRoute)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
}

function defaultRecenterOptions() {
  return [
    makeControlOption("Can you re-center me?", "recenterNode"),
    makePromptOption("What is DiamondGateBridge.com?", "diamondGateOverviewPath", "story_prompt", "story_entry"),
    makePromptOption("What is the narrative path?", "narrativePathOverview", "story_prompt", "story_entry"),
    makePromptOption("What is the traditional website for?", "traditionalWebsiteOverviewPath", "story_prompt", "story_entry"),
    makePromptOption("Where can I take the alignment diagnostic?", "diagnosticReferralPath", "personal_prompt", "personal_entry")
  ];
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
    .slice(0, MAX_HANDOFFS);
  const narrativeFrame = buildNarrativeFrame(safeCtx, memory, allowed);

  const resolvedHandoffs = handoffs.length ? handoffs : deterministicFallbackHandoffs(memory, allowed);

  return {
    ok: Boolean(data.ok),
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
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
    blueprintAuthority: "site_guide_blueprint_remains_directional_authority",
    diagnosticBoundary: "jeeves_explains_and_routes_but_does_not_assess"
  };
}

function buildHandoffLabels(routes) {
  const labels = {};
  (routes || []).forEach((route) => {
    const normalized = normalizeRoute(route);
    if (DEFAULT_HANDOFF_LABELS[normalized]) labels[normalized] = DEFAULT_HANDOFF_LABELS[normalized];
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

function isNarrativeTarget(target) {
  const clean = normalizeTarget(target);

  return [
    "narrativePathOverview",
    "missionOverviewPath",
    "missionInnerPath",
    "missionCommunityPath",
    "missionCollaborationPath",
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "charactersPath",
    "characterMirrorPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "audraliaPath",
    "audraliaWorldroomPath",
    "hEarthPath",
    "ziontsPath",
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
  ].includes(clean);
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch (_error) {
    return "";
  }
}

function safeErrorMessage(error) {
  return capString(error && error.message ? error.message : "Unknown server brain error.", 500);
}

if (typeof module !== "undefined") {
  module.exports = handler;
  module.exports.default = handler;
}
