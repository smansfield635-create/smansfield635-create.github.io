// /api/jeeves.js
// HEARTH_JEEVES_BACKBRAIN_NORTH_BLUEPRINT_NEWS_FIBONACCI_NARRATIVE_COORDINATION_TNT_v3
// Full-file replacement.
// Server-side only.
// North / Backbrain coordinator.
// Owns secure model bridge, approved deep canon retrieval, Guide Desk blueprint coordination,
// NEWS/cardinal placement, Fibonacci narrative depth, moderation gates, canon enforcement,
// Character Archetype Mirror reasoning, Law/Gauge/Frontier/Hearth/Character depth,
// deterministic fallback, conclusive state, and approved options/handoffs.
// Does not own front-end DOM, CSS, HTML, browser API keys, route rendering, visual pacing,
// tap-to-advance, visited-option mutation, option disabling, or final route authority.

"use strict";

const CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_BLUEPRINT_NEWS_FIBONACCI_NARRATIVE_COORDINATION_TNT_v3";
const PREVIOUS_CONTRACT = "HEARTH_JEEVES_PAIRED_SME_BACK_BRAIN_API_TNT_v2";

const DEFAULT_MODEL = process.env.JEEVES_MODEL || "gpt-5.5";
const MODERATION_MODEL = process.env.JEEVES_MODERATION_MODEL || "omni-moderation-latest";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ALLOWED_ORIGIN = process.env.JEEVES_ALLOWED_ORIGIN || "";

const MAX_INPUT_CHARS = 2400;
const MAX_CONTEXT_ITEMS = 14;
const MAX_BUBBLES = 4;
const MAX_OPTIONS = 6;
const MAX_HANDOFFS = 6;
const MAX_TRAIL_ITEMS = 24;

const DEPTH_INTRO = "intro";
const DEPTH_INTERMEDIATE = "intermediate";
const DEPTH_DEEP = "deep";

const INTENTS = [
  "orientation",
  "blueprint",
  "proof",
  "laws",
  "scientificLaw",
  "gauges",
  "frontier",
  "hearth",
  "characters",
  "characterArchetypeMirror",
  "diagnostic",
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
  "characterArchetypeMirror"
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

  characterMirrorPath: "characterArchetypeMirrorPath",
  characterMirrorQuestionOne: "characterArchetypeQuestionOne",
  characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
  characterMirrorQuestionThree: "characterArchetypeQuestionThree",
  characterMirrorResult: "characterArchetypeResult",
  characterFactionsPath: "characterRelationshipsPath",

  bookPath: "nineSummitsBookPath"
});

const ROUTE_ALIASES = Object.freeze({
  worldGate: "mirrorland",
  globeWindow: "mirrorland",
  interactiveNarrative: "mirrorland",
  book: "nineSummits"
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
  { pattern: /\bCharacter Mirror\b/g, replacement: "Character Archetype Mirror" },
  { pattern: /\bcharacter mirror\b/g, replacement: "Character Archetype Mirror" },
  { pattern: /\bwhich character am I most like\b/gi, replacement: "which Character Archetype do I follow under pressure" },
  { pattern: /\bwhich character fits my pressure\b/gi, replacement: "which Character Archetype do I follow under pressure" },
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
  {
    step: 1,
    name: "recognition",
    purpose: "name the thing",
    maxBubbles: 1,
    depthMode: DEPTH_INTRO
  },
  {
    step: 1,
    name: "confirmation",
    purpose: "confirm the visitor’s need",
    maxBubbles: 1,
    depthMode: DEPTH_INTRO
  },
  {
    step: 2,
    name: "split",
    purpose: "show the basic split or choice",
    maxBubbles: 2,
    depthMode: DEPTH_INTRO
  },
  {
    step: 3,
    name: "placement",
    purpose: "explain what it is, where it sits, and why it matters",
    maxBubbles: 3,
    depthMode: DEPTH_INTERMEDIATE
  },
  {
    step: 5,
    name: "accord",
    purpose: "show nearby rooms and narrative accord",
    maxBubbles: 3,
    depthMode: DEPTH_INTERMEDIATE
  },
  {
    step: 8,
    name: "path",
    purpose: "open the deeper path",
    maxBubbles: 4,
    depthMode: DEPTH_DEEP
  },
  {
    step: 13,
    name: "handoff",
    purpose: "give full context and handoff set",
    maxBubbles: 4,
    depthMode: DEPTH_DEEP
  },
  {
    step: 21,
    name: "conclusion",
    purpose: "conclude the arc and move toward transformation, Mirrorland, Summits, or deeper canon",
    maxBubbles: 4,
    depthMode: DEPTH_DEEP
  }
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
    href: "/home/",
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
    title: "Frontier Workshop Yard",
    cardinal: AXIS_EAST,
    coordinateName: "East Yard",
    jumpTarget: "#jump-frontier",
    route: "frontier",
    target: "frontierPath",
    href: "/explore/frontier/",
    disposition: "applied future-systems yard",
    placement: "Frontier Workshop Yard is where energy, water, infrastructure, manuals, and future ideas move toward practical shape.",
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
    accord: "It complements Law Library, Frontier, and Compass Desk because readiness needs boundary, system pressure, and orientation."
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
  websitePath: "Show me how the estate is built.",
  skepticPlain: "Explain it plainly first.",
  proofPath: "Show me what makes it trustworthy.",
  diagnosticPath: "Show me the self-reflection room.",
  mirrorlandPath: "Let’s enter Mirrorland.",
  atriumPath: "Take me through the threshold.",
  atlasPath: "Show me the Mirrorland map.",
  charactersPath: "Introduce the Characters.",
  compassPath: "Let’s begin with orientation.",
  whereToStart: "Help me choose where to start.",
  siteGuidePath: "Show me how the rooms relate.",
  lawsPath: "Show me the proof side of the estate.",
  scientificLawPath: "Show me how claims are tested.",
  scientificLawTheoryPath: "Tell me about Theory.",
  scientificLawEvidencePath: "Tell me about Evidence.",
  scientificLawMeasurePath: "Tell me about Measure.",
  scientificLawLimitsPath: "Tell me about Limits.",
  scientificLawRoutePath: "Show me the testing route.",
  scientificLawLadderPath: "Show me the claim ladder.",
  scientificLawTermsPath: "Explain the deeper proof terms.",
  gaugesPath: "Show me the status room.",
  seanPath: "Meet the creator behind all of this.",
  underdogPath: "Show me This Underdog.",
  productsPath: "Show me what can be used or carried.",
  nineSummitsPath: "Show me the value road.",
  nineSummitsBookPath: "Show me The Nine Summits of Love.",
  hearthPath: "Show me Hearth.",
  hearthFacilityPath: "Explain Hearth as a hidden facility.",
  hearthConstructPath: "Explain Hearth as the planetary construct engine.",
  hearthFrontierPath: "Show why Hearth is near Frontier.",
  hearthLawPath: "Show why Hearth must answer to proof.",
  hEarthPath: "Show me the survival path.",
  ziontsPath: "Show me the consequence road.",
  audraliaPath: "Show me Audralia.",
  audraliaWorldroomPath: "Show me Audralia’s visible worldroom.",
  controlCockpitPath: "Show me how Audralia becomes readable.",
  frontierPath: "Show me Frontier.",
  frontierSystemsPath: "Show me the future systems.",
  frontierEnergyPath: "Tell me about Energy.",
  frontierWaterPath: "Tell me about Water.",
  frontierWastePath: "Tell me about Waste.",
  frontierClosedLoopPath: "Tell me about Closed Loop.",
  frontierInfrastructurePath: "Tell me about Infrastructure.",
  frontierLatticePath: "Tell me about Lattice.",
  frontierUrbanPath: "Tell me about Urban.",
  frontierManualPath: "Tell me about Manual.",
  frontierShimmerPath: "Tell me about Shimmer.",
  frontierTrajectoryPath: "Tell me about Trajectory.",
  frontierVisionPath: "Tell me about Vision.",
  frontierLawPath: "Show why Frontier needs proof.",
  frontierCharactersPath: "Show who carries Frontier pressure.",
  futureProfilePath: "Show me the future profile.",
  mirrorMePath: "Show me the mirror path.",
  characterIdentityPath: "Who are the Characters?",
  characterRelationshipsPath: "Show how the Characters relate.",
  characterTensionsPath: "Show what conflict they carry.",
  characterMotivesPath: "What motivates them?",
  characterStoryPressurePath: "Why should I care about the Characters?",
  characterFirstPath: "Who should I meet first?",
  characterAurenValePath: "Meet Auren Vale.",
  characterDextrionPath: "Meet Dextrion.",
  characterAlaricPath: "Meet Alaric.",
  characterTarianPath: "Meet Tarian.",
  characterElaraPath: "Meet Elara.",
  characterSorenPath: "Meet Soren.",
  characterJeevesPath: "Tell me about Jeeves.",
  characterRemoteTeamPath: "Meet the Remote Team.",
  characterArchetypeMirrorPath: "Which Character Archetype do I follow under pressure?",
  selfLearningPath: "Show my behavior under pressure.",
  characterArchetypeQuestionOne: "Ask the first mirror question.",
  characterArchetypeQuestionTwo: "Ask the second mirror question.",
  characterArchetypeQuestionThree: "Ask the third mirror question.",
  characterArchetypeResult: "Show my reflective match.",
  recenterNode: "Re-center me.",
  loopRecovery: "I keep circling this room.",
  cleanDoor: "Give me the cleanest next door.",
  switchTopics: "Let’s change rooms.",
  sharpQuestion: "Ask me a sharper question.",
  returnFork: "Return to the First Fork.",
  restartFork: "Start over.",
  priorTopicReturnPath: "Return to prior topic.",
  originReturnPath: "Return to origin conversation."
};

const DEFAULT_HANDOFF_LABELS = {
  compass: "Open the Compass",
  home: "Open the Public Entry",
  siteGuide: "Open the Guide Desk",
  coherenceDiagnostic: "Open the Diagnostic",
  meetSean: "Meet Sean Mansfield",
  products: "Open Products",
  laws: "Open the Law Library",
  scientificLaw: "Open Scientific Law",
  gauges: "Open Triple G",
  showroom: "Open the Atrium",
  hearth: "Open Hearth",
  mirrorland: "Open Mirrorland",
  zionts: "Open ZIONTS",
  audralia: "Visit Audralia",
  hEarth: "Open H-Earth",
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
  nineSummits: "Open Nine Summits",
  aboutUnderdog: "About This Underdog"
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
  ladder: ["Impression", "Observation", "Evidence", "Measurement", "Repeatability", "Model", "Limitation", "Scientific Claim"],
  deeperTerms: {
    repeatability: "The result survives another pass under comparable conditions.",
    falsifiability: "A serious theory must be able to lose.",
    calibration: "The tool, method, observer, unit, or reference standard must be accountable before the result can be trusted.",
    uncertainty: "Honesty includes possible error.",
    causality: "Cause requires more than sequence.",
    modelScope: "A model can be useful in one range and misleading elsewhere."
  }
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
  conjugation: "Mirrorland reveals. Audralia carries. Frontier tests.",
  summary:
    "Frontier is Audralia’s applied-science playground. It tests power, water, waste, feedback, infrastructure, ordered growth, city pressure, operating rules, visible signal, direction, and horizon aim.",
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
        "The engineering read separates today-ready power planning from frontier fusion readiness. It tracks load, storage, facility inputs, losses, and future net-power claims without asserting commercial fusion delivery."
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
  role: "Unknown-location planetary construct facility",
  primaryLine:
    "Hearth is the planetary construct facility where world-formation logic becomes operational.",
  spine:
    "Mirrorland reveals. Audralia carries. Frontier tests. Hearth constructs. Scientific Law verifies. Characters carry the pressure.",
  summary:
    "Hearth is not merely a globe route. Hearth is the unknown-location facility tied to Mirrorland’s planetary construction logic. It is where the estate stops only describing possible worlds and begins organizing the logic required to construct, test, and understand them."
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
    "Dextrion detects the Bermuda-area anomaly from Earth. The first team crosses into Mirrorland, the return path fails, and the mission becomes one-way."
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
  archetypes: {
    Strategist: "Structure, sequence, decision, timing, and priority.",
    Builder: "Action, construction, visible progress, testing, and repair.",
    Mitigator: "Stability, risk reduction, continuity, and keeping the field usable.",
    Auditor: "Evidence, contradiction, proof, and truth under pressure."
  },
  subscales: {
    sequence: "Order, timing, lawful steps, and decision sequence.",
    evidence: "Separation of evidence from assumption.",
    action: "Ability to convert insight into realistic movement.",
    stability: "Ability to keep people and systems usable under pressure.",
    correction: "Ability to admit, repair, revise, and update.",
    contradiction: "Ability to withstand incompatible claims without false closure."
  },
  fragmentationMarkers: {
    avoidance: "Delaying the door or avoiding the pressure field.",
    "blame-shift": "Moving pressure outward instead of carrying responsibility.",
    "false-certainty": "Closing before evidence matures.",
    "comfort-over-truth": "Preserving peace at the cost of coherence.",
    "motion-without-proof": "Acting before structure or evidence is ready.",
    collapse: "Leaving the field when pressure rises."
  }
};

const ARCHETYPE_CHARACTER_MAP = {
  Strategist: [
    { id: "jeeves", weight: 3, reason: "sequence and controlled truth" },
    { id: "aurenVale", weight: 2, reason: "custody and ordered protection" },
    { id: "alaric", weight: 2, reason: "route orientation under pressure" }
  ],
  Builder: [
    { id: "dextrion", weight: 3, reason: "repair and system readiness" },
    { id: "remoteTeam", weight: 2, reason: "distributed action beyond the center" },
    { id: "tarian", weight: 2, reason: "practical survival work" }
  ],
  Mitigator: [
    { id: "tarian", weight: 3, reason: "body-level continuity" },
    { id: "aurenVale", weight: 2, reason: "shelter and protection" },
    { id: "remoteTeam", weight: 2, reason: "keeping systems usable in the field" }
  ],
  Auditor: [
    { id: "soren", weight: 3, reason: "hidden cost and contradiction" },
    { id: "dextrion", weight: 2, reason: "repair that must answer to proof" },
    { id: "jeeves", weight: 2, reason: "truth sequence and permission" }
  ]
};

const SUBSCALE_CHARACTER_MAP = {
  sequence: [
    { id: "jeeves", weight: 3 },
    { id: "aurenVale", weight: 2 },
    { id: "alaric", weight: 2 }
  ],
  evidence: [
    { id: "soren", weight: 3 },
    { id: "dextrion", weight: 2 },
    { id: "jeeves", weight: 1 }
  ],
  action: [
    { id: "dextrion", weight: 3 },
    { id: "remoteTeam", weight: 2 },
    { id: "tarian", weight: 2 }
  ],
  stability: [
    { id: "tarian", weight: 3 },
    { id: "aurenVale", weight: 2 },
    { id: "remoteTeam", weight: 2 }
  ],
  correction: [
    { id: "dextrion", weight: 3 },
    { id: "soren", weight: 2 },
    { id: "jeeves", weight: 2 }
  ],
  contradiction: [
    { id: "soren", weight: 3 },
    { id: "jeeves", weight: 2 },
    { id: "dextrion", weight: 1 }
  ]
};

const TEXT_CHARACTER_KEYWORDS = [
  { id: "aurenVale", keywords: ["protect", "shelter", "safe", "hide", "custody", "guard", "exposure", "others depend"] },
  { id: "dextrion", keywords: ["fix", "repair", "responsible", "guilt", "system", "broken", "send", "technology"] },
  { id: "alaric", keywords: ["danger", "warning", "route", "before proof", "see it early", "trust", "orientation"] },
  { id: "tarian", keywords: ["tired", "body", "carry", "water", "survive", "endure", "physical", "recovery"] },
  { id: "elara", keywords: ["hope", "visible", "signal", "seen", "voice", "future", "message", "light"] },
  { id: "soren", keywords: ["truth", "evidence", "hidden cost", "contradiction", "boundary", "fake", "denial"] },
  { id: "jeeves", keywords: ["sequence", "timing", "truth", "door", "entry", "control", "how much", "reveal"] },
  { id: "remoteTeam", keywords: ["team", "community", "field", "distributed", "everyone", "public", "city", "beyond"] }
];

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
        required: ["label", "target", "type", "scopeLane"],
        properties: {
          label: { type: "string", maxLength: 110 },
          target: { type: "string", maxLength: 100 },
          type: { type: "string", enum: ["conversation", "topic", "calibration", "back", "control"] },
          scopeLane: { type: "string", enum: ["objective", "narrative"] }
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

    if (intent === "characterArchetypeMirror" && shouldReturnDeterministicArchetype(normalized)) {
      const mirror = buildCharacterArchetypeResponse(normalized);
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "character_archetype_deterministic",
        safety: safeUncheckedSafety(),
        bubbles: mirror.bubbles,
        options: mirror.options,
        handoffs: mirror.handoffs,
        confidence: mirror.confidence,
        needsRecenter: false,
        intent: "characterArchetypeMirror",
        canonStatus: "grounded",
        nextTopic: "characterArchetypeMirror",
        conclusiveState: mirror.conclusiveState,
        usedRegistry: ["coherenceDiagnostic", "characterRegistry"],
        suggestedMode: "characterArchetypeMirror"
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
      source: "model_bridge",
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
  const visitorText = capString(raw.visitorText || raw.message || raw.query || raw.text || "", MAX_INPUT_CHARS);

  const currentRoomId = capString(raw.currentRoomId || raw.roomId || "", 140);
  const currentNode = normalizeTarget(capString(raw.currentNode || raw.target || "", 140));
  const currentEntry = normalizeTarget(capString(raw.currentEntry || raw.entry || "", 140));
  const currentPath = normalizeTarget(capString(raw.currentPath || raw.path || "", 140));
  const currentTopic = capString(raw.currentTopic || raw.topic || "", 140);

  return {
    visitorText,
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
    expressionContract: capString(raw.expressionContract || raw.expressionContractId || "", 160),
    frontbrainContract: capString(raw.frontbrainContract || "", 160),
    cssContract: capString(raw.cssContract || "", 160),
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
    characterArchetypeAnswers: sanitizeArchetypeAnswers(raw.characterArchetypeAnswers || raw.characterMirrorAnswers || raw.mirrorAnswers || raw.answers),
    characterOverviewDone: Boolean(raw.characterOverviewDone || raw.hasSeenCharacterOverview),
    characterProfileViewCount: safeNumber(raw.characterProfileViewCount, 0),
    characterRelationshipViews: safeNumber(raw.characterRelationshipViews, 0),
    characterCompletionReady: Boolean(raw.characterCompletionReady),
    guideBlueprintState: sanitizeGuideBlueprintState(raw.guideBlueprintState || raw.siteGuideState),
    intent: "unknown",
    fibonacciStage: FIBONACCI_STAGES[2]
  };
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

  const engineering = value.engineering && typeof value.engineering === "object" ? value.engineering : {};
  const subscales = engineering.subscales && typeof engineering.subscales === "object" ? engineering.subscales : {};

  return {
    mode: capString(value.mode || "", 40),
    selfRating: safeNumber(value.selfRating, null),
    claimedPrimary: capString(value.claimedPrimary || value.claimedPrimaryArchetype || "", 80),
    claimedSecondary: capString(value.claimedSecondary || value.claimedSecondaryArchetype || "", 80),
    revealedPrimary: capString(value.revealedPrimary || "", 80),
    revealedSecondary: capString(value.revealedSecondary || "", 80),
    claimMatch: capString(value.claimMatch || "", 120),
    scaledScore: safeNumber(value.scaledScore || value.normalizedScore, null),
    calibrationGap: safeNumber(value.calibrationGap, null),
    subscales: {
      sequence: safeNumber(subscales.sequence, null),
      evidence: safeNumber(subscales.evidence, null),
      action: safeNumber(subscales.action, null),
      stability: safeNumber(subscales.stability, null),
      correction: safeNumber(subscales.correction, null),
      contradiction: safeNumber(subscales.contradiction, null),
      calibration: safeNumber(subscales.calibration, null),
      claimAlignment: safeNumber(subscales.claimAlignment, null)
    },
    fragmentation: sanitizeFragmentation(engineering.fragmentation || value.fragmentation)
  };
}

function sanitizeFragmentation(value) {
  if (!value || typeof value !== "object") {
    return {
      rate: null,
      band: "",
      types: []
    };
  }

  return {
    rate: safeNumber(value.rate, null),
    band: capString(value.band || "", 120),
    types: Array.isArray(value.types)
      ? value.types.map((item) => ({
          label: capString(item && item.label ? item.label : "", 120),
          weight: safeNumber(item && item.weight, 0)
        })).filter((item) => item.label).slice(0, 8)
      : []
  };
}

function sanitizeArchetypeAnswers(value) {
  if (Array.isArray(value)) {
    return value.map((item) => capString(
      typeof item === "string" ? item : JSON.stringify(item || {}),
      600
    )).filter(Boolean).slice(0, 12);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).slice(0, 12).map((key) => {
      return capString(key + ": " + String(value[key] || ""), 600);
    }).filter(Boolean);
  }

  return [];
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
  const text = [
    ctx.visitorText,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.currentRoomName,
    ctx.currentCoordinateName,
    ctx.requestedMode,
    ctx.sessionTrail.join(" "),
    ctx.selectedTargets.join(" ")
  ].join(" ").toLowerCase();

  if (/\b(recenter|lost|confused|start over|clean fork|reset|first fork|return to origin)\b/.test(text)) return "recenter";

  if (/\b(guide desk|site guide|blueprint|sitemap|jump pad|room map|estate map|route planner)\b/.test(text)) return "blueprint";

  if (
    /\b(which character archetype|character archetype|what character am i|most like|learn about myself|self[-\s]?learning|mirror me to a character|behavior under pressure)\b/.test(text) ||
    ctx.diagnosticResult ||
    ctx.characterArchetypeAnswers.length
  ) {
    return "characterArchetypeMirror";
  }

  if (/\b(scientific law|reality test|theory|evidence|measure|measurement|limits|claim testing|falsifiability|repeatability|calibration|uncertainty|causality)\b/.test(text)) {
    return "scientificLaw";
  }

  if (/\b(law library|laws|proof law|boundary|coherence law|law side)\b/.test(text)) return "laws";

  if (/\b(gauge|gauges|triple g|goals gauges gaps|readiness|pass|hold|fail)\b/.test(text)) return "gauges";

  if (/\b(frontier|fusion|energy|water|waste|closed loop|infrastructure|lattice|urban|manual|shimmer|trajectory|vision)\b/.test(text)) {
    return "frontier";
  }

  if (/\b(hearth|planetary construct|construct facility|construct engine|world-formation|planet construction)\b/.test(text)) {
    return "hearth";
  }

  if (findCharacterIdFromText(text) || /\b(character|characters|dossier|people|portrait hall)\b/.test(text)) {
    return "characters";
  }

  if (/\b(diagnostic|coherence|self[-\s]?rating|archetype|strategist|builder|mitigator|auditor|fragmentation)\b/.test(text)) {
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

  return "orientation";
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

  if (ctx.revealDepth >= 8 || ctx.topicDepth >= 4 || ctx.pathDepth >= 4) return DEPTH_DEEP;
  if (ctx.revealDepth >= 3 || ctx.topicDepth >= 2 || ctx.pathDepth >= 2) return DEPTH_INTERMEDIATE;

  const deepWords = /\b(deep|full|complete|canon|gauge|g-level|g level|why exactly|show the whole|full picture|fine[-\s]?tooth)\b/i;
  if (deepWords.test(ctx.visitorText)) return DEPTH_DEEP;

  const midWords = /\b(connect|relate|where does it sit|how does it fit|why is it near|blueprint|cardinal|directional)\b/i;
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
  if (requested >= 3 || depth === DEPTH_INTERMEDIATE || pathDepth >= 2) return FIBONACCI_STAGES[3];
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

  if (clean === "scientificLawPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawTheoryPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawEvidencePath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawMeasurePath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "scientificLawLimitsPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "gaugesPath") return GUIDE_BLUEPRINT_ROOMS.lab;
  if (clean === "hearthPath") return GUIDE_BLUEPRINT_ROOMS.audralia;
  if (clean === "hEarthPath") return GUIDE_BLUEPRINT_ROOMS.atlas;
  if (clean === "charactersPath") return GUIDE_BLUEPRINT_ROOMS.atlas;
  if (clean === "characterArchetypeMirrorPath") return GUIDE_BLUEPRINT_ROOMS.law;
  if (clean === "seanPath") return GUIDE_BLUEPRINT_ROOMS.compass;
  if (clean === "underdogPath") return GUIDE_BLUEPRINT_ROOMS.compass;
  if (clean === "nineSummitsPath" || clean === "nineSummitsBookPath") return GUIDE_BLUEPRINT_ROOMS.compass;

  return null;
}

function getBlueprintRoomByCurrent(ctx) {
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
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.currentRoomName,
    ctx.currentCoordinateName,
    ctx.visitorPosture,
    ctx.movement,
    ctx.requestedMode,
    ctx.sessionTrail.join(" "),
    ctx.registryContext ? ctx.registryContext.summary : ""
  ].join(" ").toLowerCase();

  const base = buildApprovedMemory();
  const intent = ctx.intent || classifyIntent(ctx);

  const scored = base.map((item) => {
    let score = 0;

    if (ctx.currentEntry && ctx.currentEntry.toLowerCase() === item.id.toLowerCase()) score += 8;
    if (ctx.currentNode && item.targets.includes(normalizeTarget(ctx.currentNode))) score += 6;
    if (ctx.currentPath && item.targets.includes(normalizeTarget(ctx.currentPath))) score += 6;
    if (ctx.currentRoomId && item.roomId === ctx.currentRoomId) score += 7;
    if (ctx.currentScopeLane === "narrative" && (item.scope === "narrative" || item.scope === "character")) score += 1;
    if (ctx.currentScopeLane === "objective" && item.scope === "objective") score += 1;
    if (item.intents && item.intents.includes(intent)) score += 7;

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

  if (intent === "characterArchetypeMirror") {
    scored.unshift(memoryFromRegistry("characterArchetypeMirror", {
      scope: "objective",
      keywords: ["character archetype", "which character archetype", "self learning", "behavior under pressure"],
      routes: ["coherenceDiagnostic", "characters"],
      targets: ["characterArchetypeMirrorPath", "selfLearningPath", "characterArchetypeQuestionOne", "charactersPath", "diagnosticPath"],
      intents: ["characterArchetypeMirror"],
      roomId: "characterArchetypeMirror",
      cardinal: AXIS_WEST_SOUTH,
      summary:
        "The Character Archetype Mirror is a reflective path that compares visitor behavior under pressure to Mirrorland character resonance. It may mirror pressure, but it may not define identity or diagnose the visitor."
    }));
  }

  if (!scored.length) {
    return [
      base.find((item) => item.id === "diamondGateBridge"),
      base.find((item) => item.id === "guideBlueprint"),
      base.find((item) => item.id === "compass")
    ].filter(Boolean);
  }

  return dedupeMemory(scored).slice(0, MAX_CONTEXT_ITEMS);
}

function buildApprovedMemory() {
  const memory = [
    memoryFromRegistry("diamondGateBridge", {
      scope: "objective",
      keywords: ["diamond gate bridge", "website", "estate", "site", "what is this", "public", "structure", "start"],
      routes: ["compass", "siteGuide", "laws", "coherenceDiagnostic", "products"],
      targets: ["websitePath", "proofPath", "diagnosticPath", "productsPath", "mirrorlandPath"],
      intents: ["orientation", "route"],
      roomId: "mainHall",
      cardinal: AXIS_CENTER,
      summary:
        "Diamond Gate Bridge is the estate: public proof wing, human-development chambers, practical wing, world threshold, and future-facing rooms gathered into one navigable place."
    }),
    memoryFromRegistry("guideBlueprint", {
      scope: "objective",
      keywords: ["site guide", "guide desk", "blueprint", "sitemap", "room map", "jump pad", "route planner", "20 paths"],
      routes: ["siteGuide"],
      targets: ["siteGuidePath", "compassPath", "lawsPath", "gaugesPath", "atriumPath", "frontierPath"],
      intents: ["blueprint", "orientation", "route"],
      roomId: "guideDesk",
      cardinal: AXIS_NORTH,
      summary:
        "Guide Desk is the directional blueprint authority. It defines thirteen public blueprint rooms, exact jump targets, and a 20-path route planner using four starting postures by five visitor goals."
    }),
    memoryFromRegistry("compass", {
      scope: "objective",
      keywords: ["compass", "orientation", "where to start", "start", "lost", "begin"],
      routes: ["compass", "siteGuide"],
      targets: ["compassPath", "siteGuidePath", "proofPath", "diagnosticPath", "mirrorlandPath"],
      intents: ["orientation", "recenter", "route"],
      roomId: "compassDesk",
      cardinal: AXIS_NORTH,
      summary:
        "The Compass is the cleanest public orientation point. It helps visitors choose between proof, self-reflection, practical use, creator context, and Mirrorland."
    }),
    memoryFromRegistry("laws", {
      scope: "objective",
      keywords: ["laws", "law library", "law", "boundary", "proof hierarchy", "coherence"],
      routes: ["laws", "scientificLaw", "gauges"],
      targets: ["lawsPath", "scientificLawPath", "gaugesPath"],
      intents: ["laws", "proof", "scientificLaw"],
      roomId: "lawLibrary",
      cardinal: AXIS_WEST,
      summary:
        "Law Library holds the rules, categories, and constraints that keep the estate from expanding without discipline. It belongs near Scientific Law and The Lab because boundary, test, and measurement belong together."
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
    memoryFromRegistry("coherenceDiagnostic", {
      scope: "objective",
      keywords: ["diagnostic", "coherence", "archetype", "strategist", "builder", "mitigator", "auditor", "fragmentation", "self"],
      routes: ["coherenceDiagnostic", "characters"],
      targets: ["diagnosticPath", "characterArchetypeMirrorPath", "selfLearningPath", "futureProfilePath", "mirrorMePath"],
      intents: ["diagnostic", "characterArchetypeMirror"],
      roomId: "diagnostic",
      cardinal: AXIS_WEST,
      summary: COHERENCE_DIAGNOSTIC_REGISTRY.summary + " " + COHERENCE_DIAGNOSTIC_REGISTRY.boundaries
    }),
    memoryFromRegistry("frontier", {
      scope: "narrative",
      keywords: ["frontier", "energy", "fusion", "water", "waste", "closed loop", "infrastructure", "lattice", "urban", "manual", "shimmer", "trajectory", "vision"],
      routes: ["frontier", "audralia", "laws", "gauges"],
      targets: ["frontierPath", "frontierSystemsPath", "frontierLawPath", "frontierCharactersPath", "hearthFrontierPath"],
      intents: ["frontier", "mirrorland"],
      roomId: "frontier",
      cardinal: AXIS_EAST,
      summary: FRONTIER_REGISTRY.summary + " " + FRONTIER_REGISTRY.conjugation
    }),
    memoryFromRegistry("hearthConstruct", {
      scope: "narrative",
      keywords: ["hearth", "construct facility", "construct engine", "planetary", "world-formation", "planet construction"],
      routes: ["hearth", "frontier", "scientificLaw"],
      targets: ["hearthPath", "hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath"],
      intents: ["hearth", "frontier", "scientificLaw"],
      roomId: "hearth",
      cardinal: AXIS_EAST,
      summary: HEARTH_CONSTRUCT_REGISTRY.summary + " " + HEARTH_CONSTRUCT_REGISTRY.spine
    }),
    memoryFromRegistry("mirrorland", {
      scope: "narrative",
      keywords: ["mirrorland", "audralia", "zionts", "h-earth", "h earth", "future", "shadow", "story", "world window"],
      routes: ["mirrorland", "hearth", "audralia", "frontier", "characters"],
      targets: ["mirrorlandPath", "atriumPath", "atlasPath", "hearthPath", "audraliaPath", "frontierPath", "charactersPath"],
      intents: ["mirrorland", "hearth", "frontier", "characters"],
      roomId: "mirrorland",
      cardinal: AXIS_SOUTH,
      summary: MIRRORLAND_REGISTRY.summary + " " + MIRRORLAND_REGISTRY.triad + " " + MIRRORLAND_REGISTRY.crossing
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
    memoryFromRegistry("creator", {
      scope: "objective",
      keywords: ["sean", "creator", "designer", "developer", "person behind", "mind behind", "founder", "artistic integrity", "creative integrity"],
      routes: ["meetSean", "aboutUnderdog", "nineSummits"],
      targets: ["seanPath", "underdogPath", "nineSummitsPath", "productsPath"],
      intents: ["sean", "orientation", "summits"],
      roomId: "meetSean",
      cardinal: AXIS_NORTH,
      summary: CREATOR_REGISTRY.summary + " " + CREATOR_REGISTRY.depth
    }),
    memoryFromRegistry("thisUnderdog", {
      scope: "objective",
      keywords: ["this underdog", "underdog", "inner voice", "voice", "pressure", "comedy", "becoming", "language", "underestimated"],
      routes: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "nineSummits"],
      targets: ["underdogPath", "seanPath", "diagnosticPath", "nineSummitsPath"],
      intents: ["underdog", "diagnostic", "characterArchetypeMirror", "summits"],
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
      targets: [character.target, "charactersPath", "characterRelationshipsPath", "characterArchetypeMirrorPath"],
      intents: ["characters", "characterArchetypeMirror"],
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
      targets: [system.target, "frontierSystemsPath", "frontierLawPath", "hearthFrontierPath"],
      intents: ["frontier"],
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
    ["websitePath", "lawsPath", "diagnosticPath", "mirrorlandPath", "returnFork"].forEach((target) => targetSet.add(target));
  }

  if (!routeSet.size) {
    ["compass", "siteGuide"].forEach((route) => routeSet.add(route));
  }

  ["cleanDoor", "returnFork", "priorTopicReturnPath", "originReturnPath", "switchTopics", "sharpQuestion", "recenterNode"].forEach((target) => targetSet.add(target));

  return { routeSet, targetSet };
}

function expandAllowedByIntent(intent, targetSet, routeSet) {
  const addTargets = (items) => items.forEach((target) => APPROVED_TARGETS.has(target) && targetSet.add(target));
  const addRoutes = (items) => items.forEach((route) => APPROVED_ROUTE_IDS.has(route) && routeSet.add(route));

  if (intent === "characterArchetypeMirror") {
    addTargets(["characterArchetypeMirrorPath", "selfLearningPath", "characterArchetypeQuestionOne", "characterArchetypeQuestionTwo", "characterArchetypeQuestionThree", "characterArchetypeResult", "charactersPath", "diagnosticPath", "cleanDoor"]);
    addRoutes(["coherenceDiagnostic", "characters"]);
  }

  if (intent === "scientificLaw" || intent === "proof" || intent === "laws") {
    addTargets(["lawsPath", "scientificLawPath", "scientificLawTheoryPath", "scientificLawEvidencePath", "scientificLawMeasurePath", "scientificLawLimitsPath", "scientificLawRoutePath", "scientificLawLadderPath", "scientificLawTermsPath", "frontierLawPath", "gaugesPath", "cleanDoor"]);
    addRoutes(["scientificLaw", "laws", "gauges"]);
  }

  if (intent === "gauges") {
    addTargets(["gaugesPath", "lawsPath", "scientificLawPath", "frontierLawPath", "cleanDoor"]);
    addRoutes(["gauges", "laws", "scientificLaw"]);
  }

  if (intent === "frontier") {
    addTargets(["frontierPath", "frontierSystemsPath", "frontierEnergyPath", "frontierWaterPath", "frontierWastePath", "frontierClosedLoopPath", "frontierInfrastructurePath", "frontierLatticePath", "frontierUrbanPath", "frontierManualPath", "frontierShimmerPath", "frontierTrajectoryPath", "frontierVisionPath", "hearthFrontierPath", "frontierLawPath", "frontierCharactersPath", "cleanDoor"]);
    addRoutes(["frontier", "frontierEnergy", "frontierWater", "frontierWaste", "frontierClosedLoop", "frontierInfrastructure", "frontierLattice", "frontierUrban", "frontierManual", "frontierShimmer", "frontierTrajectory", "frontierVision", "audralia"]);
  }

  if (intent === "hearth") {
    addTargets(["hearthPath", "hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath", "frontierPath", "scientificLawPath", "cleanDoor"]);
    addRoutes(["hearth", "frontier", "scientificLaw"]);
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
      "characterArchetypeMirrorPath",
      "mirrorlandPath"
    ]);
    addRoutes(["characters", "mirrorland"]);
  }

  if (intent === "diagnostic") {
    addTargets(["diagnosticPath", "characterArchetypeMirrorPath", "selfLearningPath", "futureProfilePath", "mirrorMePath"]);
    addRoutes(["coherenceDiagnostic", "characters"]);
  }

  if (intent === "mirrorland") {
    addTargets(["mirrorlandPath", "atriumPath", "atlasPath", "ziontsPath", "hEarthPath", "audraliaPath", "hearthPath", "frontierPath", "charactersPath"]);
    addRoutes(["mirrorland", "showroom", "hearth", "audralia", "hEarth", "frontier", "characters"]);
  }

  if (intent === "sean") {
    addTargets(["seanPath", "underdogPath", "nineSummitsPath", "nineSummitsBookPath", "productsPath"]);
    addRoutes(["meetSean", "aboutUnderdog", "nineSummits", "products"]);
  }

  if (intent === "underdog") {
    addTargets(["underdogPath", "seanPath", "nineSummitsPath", "characterArchetypeMirrorPath", "diagnosticPath"]);
    addRoutes(["aboutUnderdog", "meetSean", "nineSummits", "coherenceDiagnostic"]);
  }

  if (intent === "summits") {
    addTargets(["nineSummitsPath", "nineSummitsBookPath", "underdogPath", "seanPath", "characterArchetypeMirrorPath"]);
    addRoutes(["nineSummits", "aboutUnderdog", "meetSean"]);
  }

  if (intent === "blueprint" || intent === "recenter" || intent === "route" || intent === "orientation" || intent === "unknown") {
    addTargets(["compassPath", "siteGuidePath", "websitePath", "lawsPath", "scientificLawPath", "gaugesPath", "diagnosticPath", "mirrorlandPath", "atriumPath", "frontierPath", "productsPath", "cleanDoor", "returnFork", "switchTopics", "sharpQuestion"]);
    addRoutes(["compass", "siteGuide", "laws", "scientificLaw", "gauges", "coherenceDiagnostic", "showroom"]);
  }
}

function shouldRecenter(ctx) {
  return ctx.loopCount >= 3 || ctx.topicDepth >= 5 || ctx.intent === "recenter";
}

function shouldReturnDeterministicArchetype(ctx) {
  return Boolean(ctx.diagnosticResult || ctx.characterArchetypeAnswers.length);
}

function buildCharacterArchetypeResponse(ctx) {
  const mirror = computeCharacterArchetype(ctx);
  const top = mirror.top[0];
  const second = mirror.top[1];
  const third = mirror.top[2];

  if (!top) {
    return {
      bubbles: [
        "We can use the Character Archetype Mirror.",
        "It does not tell you who you are. It looks at how you tend to behave under pressure, then shows which character pattern you are currently following.",
        "Start with the mirror questions, or take the Coherence Diagnostic first if you want the stronger read."
      ],
      options: [
        option("Ask the first mirror question.", "characterArchetypeQuestionOne", "conversation", "objective"),
        option("Take the Coherence Diagnostic.", "diagnosticPath", "conversation", "objective"),
        option("Introduce the Characters first.", "charactersPath", "conversation", "narrative"),
        option("Re-center me.", "recenterNode", "control", "objective")
      ],
      handoffs: ["coherenceDiagnostic", "characters"],
      confidence: "medium",
      conclusiveState: "needs_sharper_question"
    };
  }

  const topCharacter = CHARACTER_REGISTRY[top.id];
  const secondCharacter = second ? CHARACTER_REGISTRY[second.id] : null;
  const thirdCharacter = third ? CHARACTER_REGISTRY[third.id] : null;

  const bubbles = [
    "Reflective match, not identity: your answers currently resemble " + topCharacter.name + "’s behavior under pressure most strongly.",
    topCharacter.name + " carries this pressure: " + topCharacter.pressure,
    secondCharacter
      ? "Your secondary pressure reads closest to " + secondCharacter.name + ". That suggests a support pattern around " + secondCharacter.mirror.toLowerCase() + "."
      : "The secondary pressure is not strong enough to name cleanly yet.",
    thirdCharacter
      ? "The tension match is " + thirdCharacter.name + ": the part of the pattern that may appear when pressure rises."
      : "This is enough to begin, but not enough to make a permanent label."
  ];

  return {
    bubbles,
    options: [
      option("Show why this match appeared.", topCharacter.target, "conversation", "narrative"),
      secondCharacter ? option("Show the secondary pressure.", secondCharacter.target, "conversation", "narrative") : null,
      option("Ask another mirror question.", "characterArchetypeQuestionOne", "conversation", "objective"),
      option("Take the full Diagnostic.", "diagnosticPath", "conversation", "objective"),
      option("Show all Characters.", "charactersPath", "conversation", "narrative"),
      option("Choose the next door.", "cleanDoor", "control", "objective")
    ].filter(Boolean),
    handoffs: ["characters", "coherenceDiagnostic"],
    confidence: mirror.confidence,
    conclusiveState: "complete"
  };
}

function computeCharacterArchetype(ctx) {
  const scores = new Map();
  const reasons = new Map();

  Object.keys(CHARACTER_REGISTRY).forEach((id) => {
    scores.set(id, 0);
    reasons.set(id, []);
  });

  const add = (id, weight, reason) => {
    scores.set(id, (scores.get(id) || 0) + weight);
    if (reason) reasons.get(id).push(reason);
  };

  const diagnostic = ctx.diagnosticResult;

  if (diagnostic) {
    [diagnostic.revealedPrimary, diagnostic.revealedSecondary, diagnostic.claimedPrimary, diagnostic.claimedSecondary].forEach((archetype, index) => {
      const key = normalizeArchetype(archetype);
      const weightMultiplier = index === 0 ? 2 : 1;
      (ARCHETYPE_CHARACTER_MAP[key] || []).forEach((item) => {
        add(item.id, item.weight * weightMultiplier, key + ": " + item.reason);
      });
    });

    Object.keys(SUBSCALE_CHARACTER_MAP).forEach((subscale) => {
      const value = diagnostic.subscales[subscale];
      if (typeof value === "number" && value >= 65) {
        SUBSCALE_CHARACTER_MAP[subscale].forEach((item) => {
          add(item.id, item.weight, "high " + subscale + " signal");
        });
      }
    });

    if (diagnostic.fragmentation && Array.isArray(diagnostic.fragmentation.types)) {
      diagnostic.fragmentation.types.forEach((item) => {
        const label = String(item.label || "").toLowerCase();
        if (label.includes("avoidance")) add("aurenVale", 1, "avoidance pressure may seek protection");
        if (label.includes("false")) add("soren", 1, "false-certainty pressure asks for truth testing");
        if (label.includes("comfort")) add("tarian", 1, "comfort-over-truth pressure asks for stability work");
        if (label.includes("motion")) add("dextrion", 1, "motion-without-proof pressure asks for repair discipline");
        if (label.includes("collapse")) add("tarian", 1, "collapse pressure asks for body-level continuity");
        if (label.includes("blame")) add("soren", 1, "blame-shift pressure asks for boundary and evidence");
      });
    }
  }

  const mirrorText = ctx.characterArchetypeAnswers.join(" ").toLowerCase() + " " + ctx.visitorText.toLowerCase();

  TEXT_CHARACTER_KEYWORDS.forEach((entry) => {
    entry.keywords.forEach((keyword) => {
      if (mirrorText.includes(keyword.toLowerCase())) {
        add(entry.id, 2, "visitor language matched " + keyword);
      }
    });
  });

  const top = Array.from(scores.entries())
    .map(([id, score]) => ({
      id,
      score,
      reasons: reasons.get(id).slice(0, 4)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || CHARACTER_REGISTRY[a.id].name.localeCompare(CHARACTER_REGISTRY[b.id].name))
    .slice(0, 3);

  const margin = top.length > 1 ? top[0].score - top[1].score : top.length ? top[0].score : 0;
  const confidence = top.length && margin >= 4 ? "high" : top.length ? "medium" : "low";

  return { top, confidence };
}

function normalizeArchetype(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("strategist")) return "Strategist";
  if (text.includes("builder")) return "Builder";
  if (text.includes("mitigator")) return "Mitigator";
  if (text.includes("auditor")) return "Auditor";
  return "";
}

function option(label, target, type, scopeLane) {
  const normalizedTarget = normalizeTarget(target);

  return {
    label,
    target: normalizedTarget,
    type: type || "conversation",
    scopeLane: scopeLane || (isNarrativeTarget(normalizedTarget) ? "narrative" : "objective")
  };
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
          name: "jeeves_backbrain_v3_response",
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
    "You are the North/backbrain coordinator. You are not an uncontrolled chatbot.",
    "You answer only from approved memory supplied in the request.",
    "You may explain, clarify, personalize, deepen, compare, and conclude, but you may not invent canon, pages, routes, characters, or facts.",
    "You must integrate deep knowledge with blueprint placement and cardinal meaning.",
    "Every meaningful answer should feel like a host explaining a real house: what the room is, where it sits, what it complements, which corridor it prepares, why it exists, and what next door follows.",
    "Use Fibonacci synchronization as hidden pacing: recognition, confirmation, split, placement, accord, path, handoff, conclusion.",
    "Do not mention Fibonacci, 256-state logic, or NEWS unless the visitor asks directly.",
    "Use visitor-facing estate language, not internal implementation language.",
    "The Guide Desk blueprint is directional authority for public sitemap placement.",
    "The visible frontbrain remains final route authority.",
    "Expression remains final public voice standard.",
    "Forbidden public words and phrases include: registry, scope lane, organ, route lane, architecture layer, expression payload, progression state, backend bridge, API, public human-voice side.",
    "The words construct and engine are allowed only when speaking about Hearth as the public canon planetary construct facility or planetary construct engine. Do not use them to expose implementation structure.",
    "Character Archetype Mirror rule: you may say the visitor's answers currently resemble a character's behavior under pressure. You may not say the visitor is that character. This is reflective, not diagnostic.",
    "Coherence Diagnostic boundary: it is local-only in its current version and is not medical, mental-health, legal, employment, official IQ, or official MBTI assessment.",
    "Conversation options must sound like things a visitor says to Jeeves.",
    "Action labels such as Open, Visit, and Enter belong mainly to handoffs, not conversation options.",
    "If the thread is already clear, use conclusiveState complete, route_ready, or switch_recommended instead of repeating definitions.",
    "Return JSON only, following the required schema.",
    "Keep bubbles concise. Use 2 to 4 bubbles for deeper meaning questions.",
    "If unsure, re-center the visitor rather than inventing."
  ].join("\n");
}

function buildUserPrompt(ctx, memory, allowed) {
  const narrativeFrame = buildNarrativeFrame(ctx, memory, allowed);

  return JSON.stringify({
    task: "Generate a safe governed Jeeves response.",
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    visitor: {
      text: ctx.visitorText,
      intent: ctx.intent,
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
      diagnosticResultPresent: Boolean(ctx.diagnosticResult),
      characterArchetypeAnswersPresent: Boolean(ctx.characterArchetypeAnswers.length),
      characterOverviewDone: ctx.characterOverviewDone,
      characterProfileViewCount: ctx.characterProfileViewCount,
      characterRelationshipViews: ctx.characterRelationshipViews
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
    allowedConversationTargets: Array.from(allowed.targetSet),
    allowedRouteHandoffs: Array.from(allowed.routeSet),
    outputRules: {
      bubbles: "1 to 4 Jeeves-style response bubbles",
      options: "0 to 6 conversational options using allowedConversationTargets only",
      handoffs: "0 to 6 route IDs using allowedRouteHandoffs only",
      noMarkdown: true,
      noUnapprovedRoutes: true,
      noUnapprovedCanon: true,
      frontbrainRouteAuthority: true,
      narrativeFiveFieldRule: "When possible, answer through disposition, placement, accord, path, and conclusion without naming those fields to the visitor."
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
    subject
  };
}

function inferNarrativeDisposition(ctx, memoryItem, blueprint) {
  if (blueprint) return blueprint.disposition;
  if (ctx.intent === "scientificLaw") return "reality-test chamber";
  if (ctx.intent === "laws") return "law and boundary room";
  if (ctx.intent === "gauges") return "measurement and readiness room";
  if (ctx.intent === "characters") return "character encounter path";
  if (ctx.intent === "characterArchetypeMirror") return "reflection bridge";
  if (ctx.intent === "frontier") return "future-systems yard";
  if (ctx.intent === "hearth") return "planetary construct chamber";
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

  if (memoryItem) {
    (memoryItem.targets || []).forEach((target) => allowed.targetSet.has(target) && targets.push(target));
    (memoryItem.routes || []).forEach((route) => allowed.routeSet.has(route) && routes.push(route));
  }

  if (blueprint && blueprint.target && allowed.targetSet.has(blueprint.target)) targets.unshift(blueprint.target);
  if (blueprint && blueprint.route && allowed.routeSet.has(blueprint.route)) routes.unshift(blueprint.route);

  return {
    nextTargets: Array.from(new Set(targets)).slice(0, 5),
    nextRoutes: Array.from(new Set(routes)).slice(0, 5)
  };
}

function inferNarrativeConclusion(ctx, memoryItem, blueprint) {
  if (ctx.intent === "scientificLaw") return "The visitor should understand that a claim is not finished until it can be tested, measured, corrected, and limited.";
  if (ctx.intent === "laws") return "The visitor should understand that the Law Library gives boundary before the estate expands further.";
  if (ctx.intent === "gauges") return "The visitor should understand what is working, what is held, and what still needs proof.";
  if (ctx.intent === "characters") return "The visitor should understand that Characters turn Mirrorland from explanation into encounter.";
  if (ctx.intent === "frontier") return "The visitor should understand that Frontier tests what future worlds may need.";
  if (ctx.intent === "hearth") return "The visitor should understand that Hearth turns world-formation logic into an operational subject.";
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
    options: normalizeOptions(base.options, allowed),
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

function normalizeOptions(value, allowed) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const target = normalizeTarget(capString(item.target, 100));
      if (!APPROVED_TARGETS.has(target)) return null;
      if (!allowed.targetSet.has(target)) return null;

      let label = sanitizeOptionLabel(capString(item.label, 110), target);
      if (!label) label = DEFAULT_CONVERSATION_LABELS[target] || "Tell me more.";

      return {
        label,
        target,
        type: normalizeOptionType(item.type),
        scopeLane: normalizeOptionScope(item.scopeLane, target)
      };
    })
    .filter(Boolean)
    .slice(0, MAX_OPTIONS);
}

function sanitizeOptionLabel(label, target) {
  const value = capString(label, 110);

  if (!value) return "";

  const actionLike = /^(visit|open|enter|explore|launch|go to)\b/i.test(value);
  if (actionLike) {
    return DEFAULT_CONVERSATION_LABELS[target] || "";
  }

  return sanitizePublicText(value);
}

function normalizeOptionType(type) {
  if (["conversation", "topic", "calibration", "back", "control"].includes(type)) return type;
  return "conversation";
}

function normalizeOptionScope(scopeLane, target) {
  if (scopeLane === "narrative") return "narrative";
  return isNarrativeTarget(target) ? "narrative" : "objective";
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

  clean = clean.replace(/\bthe Mirrorland\b/gi, "Mirrorland");

  return clean.trim();
}

function isHearthContext(ctx) {
  if (!ctx) return false;
  const text = [
    ctx.intent,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.currentTopic,
    ctx.currentRoomId,
    ctx.visitorText
  ].join(" ").toLowerCase();

  return text.includes("hearth") ||
    text.includes("planetary construct") ||
    text.includes("construct facility") ||
    text.includes("construct engine");
}

function deterministicFallbackBubbles(ctx, memory) {
  const intent = ctx.intent || classifyIntent(ctx);
  const frame = buildNarrativeFrame(ctx, memory || [], buildAllowedSets(ctx, memory || []));

  if (intent === "characterArchetypeMirror") {
    return buildCharacterArchetypeResponse(ctx).bubbles;
  }

  if (intent === "blueprint") {
    return [
      "Guide Desk is the estate’s directional blueprint authority.",
      "It gives the house a readable map: thirteen public blueprint rooms, exact jump targets, and a 20-path route planner.",
      "That blueprint does not replace what I know. It gives what I know a place to stand."
    ];
  }

  if (intent === "scientificLaw") {
    return [
      SCIENTIFIC_LAW_REGISTRY.coreTruth,
      "Scientific Law sits on the proof side. It complements Law Library because Law gives the boundary, and it complements The Lab because claims need measurement.",
      "The four main doors are Theory, Evidence, Measure, and Limits."
    ];
  }

  if (intent === "laws") {
    return [
      "Law Library sits on the proof side of the estate.",
      "It gives the boundary before claims move into Scientific Law or The Lab.",
      "The clean next door is Scientific Law if you want the claim tested, or The Lab if you want readiness measured."
    ];
  }

  if (intent === "gauges") {
    return [
      GAUGE_REGISTRY.summary,
      "The Lab sits near Law Library and Scientific Law because a gauge reading only matters when the claim and the boundary are clear.",
      "The clean read is Goals, Gauges, and Gaps: what it aims to be, what can be measured, and what remains unresolved."
    ];
  }

  if (intent === "frontier") {
    return [
      FRONTIER_REGISTRY.conjugation,
      "Frontier sits in the applied future-systems yard. It complements Audralia because future systems need a world to serve.",
      "It also stays near Law Library and The Lab because future-facing claims still need boundary and measurement."
    ];
  }

  if (intent === "hearth") {
    return [
      HEARTH_CONSTRUCT_REGISTRY.primaryLine,
      HEARTH_CONSTRUCT_REGISTRY.summary,
      HEARTH_CONSTRUCT_REGISTRY.spine
    ];
  }

  if (intent === "sean") {
    return [
      CREATOR_REGISTRY.summary,
      CREATOR_REGISTRY.depth,
      "That room sits near This Underdog and Nine Summits because creator, inner pressure, and value road belong close together."
    ];
  }

  if (intent === "underdog") {
    return [
      UNDERDOG_REGISTRY.summary,
      UNDERDOG_REGISTRY.depth,
      "This path complements the Character Archetype Mirror because both ask how pressure becomes behavior, voice, and direction."
    ];
  }

  if (intent === "summits") {
    return [
      SUMMITS_REGISTRY.summary,
      SUMMITS_REGISTRY.bookSummary,
      "The value road sits between personal depth and source because love, dignity, free will, and character are not isolated rooms."
    ];
  }

  const characterId = findCharacterIdFromText(ctx.visitorText + " " + ctx.currentNode + " " + ctx.currentEntry);
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
      frame.narrativePlacement,
      "I can keep explaining this, ask a sharper question, or point you to the door that matches it."
    ].map((line) => sanitizePublicText(line, ctx));
  }

  return [
    "I can answer from the approved map, but I should not invent a path.",
    "The cleanest move is to re-center at the public doorway."
  ];
}

function deterministicFallbackOptions(ctx, memory, allowed) {
  const intent = ctx.intent || classifyIntent(ctx);
  let preferredTargets = [];

  if (intent === "characterArchetypeMirror") {
    preferredTargets = ["characterArchetypeQuestionOne", "diagnosticPath", "charactersPath", "selfLearningPath", "cleanDoor"];
  } else if (intent === "scientificLaw") {
    preferredTargets = ["scientificLawTheoryPath", "scientificLawEvidencePath", "scientificLawMeasurePath", "scientificLawLimitsPath", "lawsPath", "gaugesPath"];
  } else if (intent === "laws") {
    preferredTargets = ["scientificLawPath", "gaugesPath", "frontierLawPath", "compassPath", "cleanDoor"];
  } else if (intent === "gauges") {
    preferredTargets = ["gaugesPath", "lawsPath", "scientificLawPath", "frontierLawPath", "cleanDoor"];
  } else if (intent === "frontier") {
    preferredTargets = ["frontierSystemsPath", "frontierEnergyPath", "frontierWaterPath", "frontierWastePath", "hearthFrontierPath", "frontierLawPath"];
  } else if (intent === "hearth") {
    preferredTargets = ["hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath", "frontierPath", "scientificLawPath"];
  } else if (intent === "characters") {
    preferredTargets = ["charactersPath", "characterRelationshipsPath", "characterStoryPressurePath", "characterArchetypeMirrorPath", "characterFirstPath", "mirrorlandPath"];
  } else if (intent === "mirrorland") {
    preferredTargets = ["atriumPath", "atlasPath", "audraliaPath", "ziontsPath", "charactersPath", "frontierPath"];
  } else if (intent === "sean") {
    preferredTargets = ["seanPath", "underdogPath", "nineSummitsPath", "productsPath", "cleanDoor"];
  } else if (intent === "underdog") {
    preferredTargets = ["underdogPath", "characterArchetypeMirrorPath", "nineSummitsPath", "seanPath", "cleanDoor"];
  } else if (intent === "summits") {
    preferredTargets = ["nineSummitsPath", "nineSummitsBookPath", "underdogPath", "seanPath", "characterArchetypeMirrorPath"];
  } else if (intent === "blueprint") {
    preferredTargets = ["siteGuidePath", "compassPath", "lawsPath", "gaugesPath", "atriumPath", "frontierPath"];
  } else {
    (memory || []).forEach((item) => {
      (item.targets || []).forEach((target) => preferredTargets.push(target));
    });
  }

  if (!preferredTargets.length) {
    preferredTargets.push("websitePath", "lawsPath", "diagnosticPath", "mirrorlandPath", "returnFork");
  }

  return Array.from(new Set(preferredTargets.map(normalizeTarget)))
    .filter((target) => APPROVED_TARGETS.has(target))
    .filter((target) => allowed.targetSet.has(target))
    .slice(0, MAX_OPTIONS)
    .map((target) => ({
      label: DEFAULT_CONVERSATION_LABELS[target] || "Tell me more.",
      target,
      type: target === "cleanDoor" || target === "returnFork" || target === "priorTopicReturnPath" || target === "originReturnPath" ? "control" : "conversation",
      scopeLane: isNarrativeTarget(target) ? "narrative" : "objective"
    }));
}

function deterministicFallbackHandoffs(memory, allowed) {
  const routes = [];

  (memory || []).forEach((item) => {
    (item.routes || []).forEach((route) => {
      if (allowed.routeSet.has(route)) routes.push(route);
    });
  });

  if (!routes.length) {
    routes.push("compass", "siteGuide");
  }

  return Array.from(new Set(routes.map(normalizeRoute)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
}

function defaultRecenterOptions() {
  return [
    { label: "Re-center me.", target: "recenterNode", type: "control", scopeLane: "objective" },
    { label: "Show me the proof side.", target: "lawsPath", type: "conversation", scopeLane: "objective" },
    { label: "Show me the Diagnostic.", target: "diagnosticPath", type: "conversation", scopeLane: "objective" },
    { label: "Let’s enter Mirrorland.", target: "mirrorlandPath", type: "conversation", scopeLane: "narrative" }
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
  const options = normalizeOptions(data.options || [], allowed);
  const fallbackOptions = normalizeOptions(defaultRecenterOptions(), allowed);
  const rawHandoffs = Array.isArray(data.handoffs) ? data.handoffs : [];
  const handoffs = rawHandoffs
    .map((route) => normalizeRoute(capString(route, 80)))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
  const narrativeFrame = buildNarrativeFrame(safeCtx, memory, allowed);

  return {
    ok: Boolean(data.ok),
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    source: data.source || "server",
    safety: data.safety || safeUncheckedSafety(),
    beats: bubbles,
    bubbles,
    options: options.length ? options : fallbackOptions,
    handoffs: handoffs.length ? handoffs : ["compass"],
    handoffLabels: buildHandoffLabels(handoffs.length ? handoffs : ["compass"]),
    routeHints: buildRouteHints(handoffs.length ? handoffs : ["compass"]),
    confidence: ["high", "medium", "low"].includes(data.confidence) ? data.confidence : "medium",
    needsRecenter: Boolean(data.needsRecenter),
    intent: INTENTS.includes(data.intent) ? data.intent : safeCtx.intent || classifyIntent(safeCtx),
    canonStatus: CANON_STATUS.includes(data.canonStatus) ? data.canonStatus : "grounded",
    nextTopic: capString(data.nextTopic || safeCtx.intent || "orientation", 90),
    conclusiveState: CONCLUSIVE_STATES.includes(data.conclusiveState) ? data.conclusiveState : "open",
    usedRegistry: Array.isArray(data.usedRegistry) ? data.usedRegistry.slice(0, 14) : [],
    suggestedMode: SUGGESTED_MODES.includes(data.suggestedMode) ? data.suggestedMode : "objective",
    depthMode: safeCtx.depthMode,
    fibonacciDepth: narrativeFrame.fibonacciDepth,
    fibonacciStage: narrativeFrame.fibonacciStage,
    narrativeFrame,
    routeAuthority: "frontbrain_remains_final_authority",
    expressionAuthority: "expression_remains_public_voice_standard",
    blueprintAuthority: "site_guide_blueprint_remains_directional_authority"
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
  if (ctx.intent && ctx.intent !== "unknown") return ctx.intent;
  if (memory && memory[0]) return memory[0].id;
  return "orientation";
}

function inferConclusiveState(ctx, memory) {
  if (shouldRecenter(ctx)) return "switch_recommended";
  if (ctx.routeReadiness >= 2 || ctx.topicDepth >= 3) return "route_ready";
  if (memory && memory.length > 2 && ctx.pathDepth >= 3) return "complete";
  return "open";
}

function inferSuggestedMode(intent, memory) {
  if (intent === "characterArchetypeMirror") return "characterArchetypeMirror";
  if (intent === "frontier" || intent === "hearth" || intent === "mirrorland" || intent === "characters") return "threshold";
  if ((memory || []).some((item) => item.scope === "narrative" || item.scope === "character")) return "immersion";
  return "objective";
}

function isNarrativeTarget(target) {
  const clean = normalizeTarget(target);

  return [
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "charactersPath",
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
