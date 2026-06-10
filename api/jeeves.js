// /api/jeeves.js
// HEARTH_JEEVES_PAIRED_SME_BACK_BRAIN_API_TNT_v2
// Full-file replacement.
// Server-side only.
// Owns secure model bridge, approved memory retrieval, SME canon registries, moderation gates,
// canon enforcement, Character Mirror/self-learning logic, controlled generative responses,
// deterministic fallback, conclusive state, and approved options/handoffs.
// Does not own front-end DOM, CSS, HTML, browser API keys, route rendering, visual pacing,
// tap-to-advance, or final route authority.

"use strict";

const CONTRACT = "HEARTH_JEEVES_PAIRED_SME_BACK_BRAIN_API_TNT_v2";

const DEFAULT_MODEL = process.env.JEEVES_MODEL || "gpt-5.5";
const MODERATION_MODEL = process.env.JEEVES_MODERATION_MODEL || "omni-moderation-latest";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ALLOWED_ORIGIN = process.env.JEEVES_ALLOWED_ORIGIN || "";
const MAX_INPUT_CHARS = 2200;
const MAX_CONTEXT_ITEMS = 12;
const MAX_BUBBLES = 4;
const MAX_OPTIONS = 6;
const MAX_HANDOFFS = 5;

const INTENTS = [
  "orientation",
  "proof",
  "scientificLaw",
  "frontier",
  "hearth",
  "characters",
  "characterMirror",
  "diagnostic",
  "sean",
  "underdog",
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
  "characterMirror"
];

const FORBIDDEN_PUBLIC_LANGUAGE = [
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
  { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
  { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
  { pattern: /\bcontract\b/gi, replacement: "governing mark" },
  { pattern: /\bTNT\b/g, replacement: "" }
];

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
]);

const APPROVED_TARGETS = new Set([
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
]);

const DEFAULT_CONVERSATION_LABELS = {
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
  recenterNode: "Re-center me.",
  loopRecovery: "I keep circling this room.",
  cleanDoor: "Give me the cleanest next door.",
  switchTopics: "Switch topics.",
  sharpQuestion: "Ask me a sharper question.",
  returnFork: "Bring me back to the doorway.",
  restartFork: "Start over."
};

const DEFAULT_HANDOFF_LABELS = {
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

const CHARACTER_REGISTRY = {
  aurenVale: {
    id: "aurenVale",
    name: "Auren Vale",
    title: "Sanctuary Builder",
    target: "characterAurenValePath",
    route: "characters",
    oneLine: "He keeps the manor from becoming a beautiful cage.",
    pressure: "Every protected life makes the manor harder to hide.",
    function: "Guardian of the place everyone needs and everyone could expose.",
    mirror: "Protection, custody, shelter, and fear of exposure.",
    keywords: ["auren", "auren vale", "sanctuary", "shelter", "protection", "custody", "exposure", "hide", "protect"],
    summary:
      "Auren Vale is the Sanctuary Builder. He keeps the manor from becoming a beautiful cage. His pressure is protection versus exposure: every protected life makes the manor harder to hide."
  },
  dextrion: {
    id: "dextrion",
    name: "Dextrion",
    title: "Earth-Side Originator",
    target: "characterDextrionPath",
    route: "characters",
    oneLine: "He opened the path and stayed behind.",
    pressure: "Every one-way crossing remains on his hands.",
    function: "Earth-side sender of technology, people, and decisions into Mirrorland.",
    mirror: "Repair, responsibility, guilt, and pressure to fix what broke.",
    keywords: ["dextrion", "earth side", "earth-side", "originator", "repair", "fix", "guilt", "responsibility", "anomaly", "crossing"],
    summary:
      "Dextrion is the Earth-Side Originator. He opened the path and stayed behind. His pressure is repair responsibility: every one-way crossing remains on his hands."
  },
  alaric: {
    id: "alaric",
    name: "Alaric",
    title: "Field Navigator",
    target: "characterAlaricPath",
    route: "characters",
    oneLine: "He reads danger before proof arrives.",
    pressure: "Waiting for proof can close the only safe route.",
    function: "Reads Audralia while the maps are incomplete and the planet is still teaching the team how it moves.",
    mirror: "Early warning, danger-reading, orientation, and acting before others believe the proof.",
    keywords: ["alaric", "field navigator", "navigator", "danger", "warning", "route", "orientation", "before proof", "scout"],
    summary:
      "Alaric is the Field Navigator. He reads danger before proof arrives. His pressure is early warning versus trust: waiting for proof can close the only safe route."
  },
  tarian: {
    id: "tarian",
    name: "Tarian",
    title: "Water Anchor",
    target: "characterTarianPath",
    route: "characters",
    oneLine: "He keeps the mission physically honest.",
    pressure: "The future fails if the body cannot continue.",
    function: "Keeps survival tied to earth, water, air, distance, recovery, and human limit.",
    mirror: "Endurance, body-level survival, water, recovery, and carrying too much.",
    keywords: ["tarian", "water", "water anchor", "body", "endurance", "survival", "tired", "carry", "fatigue", "recovery"],
    summary:
      "Tarian is the Water Anchor. He keeps the mission physically honest. His pressure is human limit versus mission demand: the future fails if the body cannot continue."
  },
  elara: {
    id: "elara",
    name: "Elara",
    title: "Signal Bearer",
    target: "characterElaraPath",
    route: "characters",
    oneLine: "She makes the future visible before it disappears.",
    pressure: "The future has to be visible before anyone moves toward it.",
    function: "Gives Audralia a visible future people can believe in without forgetting danger.",
    mirror: "Signal, visibility, hope, public voice, and risk of being seen.",
    keywords: ["elara", "signal", "signal bearer", "visible", "visibility", "hope", "future", "voice", "seen", "message"],
    summary:
      "Elara is the Signal Bearer. She makes the future visible before it disappears. Her pressure is visibility versus exposure: the future has to be visible before anyone moves toward it."
  },
  soren: {
    id: "soren",
    name: "Soren",
    title: "Boundary Keeper",
    target: "characterSorenPath",
    route: "characters",
    oneLine: "He refuses fake restoration.",
    pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
    function: "Audits every claim that the new world is being saved cleanly.",
    mirror: "Truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
    keywords: ["soren", "boundary", "boundary keeper", "truth", "hidden cost", "cost", "evidence", "contradiction", "zionts", "contamination"],
    summary:
      "Soren is the Boundary Keeper. He refuses fake restoration. His pressure is truth versus denial: saving Mirrorland by hiding damage only creates another ZIONTS."
  },
  jeeves: {
    id: "jeeves",
    name: "Jeeves",
    title: "Manor Interface",
    target: "characterJeevesPath",
    route: "characters",
    oneLine: "He decides how much truth the house can reveal.",
    pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
    function: "Keeps the manor’s rooms, secrets, routes, and revelations in survivable order.",
    mirror: "Sequence, restraint, truth timing, entry, and controlled revelation.",
    keywords: ["jeeves", "manor interface", "sequence", "truth", "entry", "door", "timing", "control", "reveal", "permission"],
    summary:
      "Jeeves is the Manor Interface. He decides how much truth the house can reveal. His pressure is protection versus revelation."
  },
  remoteTeam: {
    id: "remoteTeam",
    name: "Remote Team",
    title: "Distributed Response Unit",
    target: "characterRemoteTeamPath",
    route: "characters",
    oneLine: "They carry survival beyond the estate.",
    pressure: "If survival cannot leave the manor, the manor is only a bunker.",
    function: "Carries survival into cities, water lanes, field routes, climate zones, and public systems.",
    mirror: "Distributed responsibility, field logistics, helping beyond the safe center, and public survival.",
    keywords: ["remote team", "remote", "distributed", "team", "community", "field", "city", "help others", "beyond", "public survival"],
    summary:
      "The Remote Team is the Distributed Response Unit. They carry survival beyond the estate. Their pressure is distribution versus collapse pressure."
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

const FRONTIER_REGISTRY = {
  id: "frontier",
  route: "frontier",
  target: "frontierPath",
  conjugation: "Mirrorland reveals. Audralia carries. Frontier tests.",
  summary:
    "Frontier is Audralia’s applied-science playground. It is the pressure field where future systems are inspected one at a time: power, water, waste, infrastructure, city pressure, signal, direction, and rules that keep the world coherent.",
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
  },
  primaryWeight: 2,
  secondaryWeight: 1
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
      items: { type: "string", maxLength: 360 }
    },
    options: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "target", "type", "scopeLane"],
        properties: {
          label: { type: "string", maxLength: 96 },
          target: { type: "string", maxLength: 90 },
          type: { type: "string", enum: ["conversation", "topic", "calibration", "back", "control"] },
          scopeLane: { type: "string", enum: ["objective", "narrative"] }
        }
      }
    },
    handoffs: {
      type: "array",
      maxItems: 5,
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
      maxItems: 12,
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
      error: "METHOD_NOT_ALLOWED"
    });
    return;
  }

  try {
    if (!rateLimit(req)) {
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
      }, normalizePayload({})));
      return;
    }

    const payload = await readJsonBody(req);
    const normalized = normalizePayload(payload);
    const intent = classifyIntent(normalized);
    normalized.intent = intent;

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

    if (intent === "characterMirror" && shouldReturnDeterministicMirror(normalized)) {
      const mirror = buildCharacterMirrorResponse(normalized);
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "character_mirror_deterministic",
        safety: safeUncheckedSafety(),
        bubbles: mirror.bubbles,
        options: mirror.options,
        handoffs: mirror.handoffs,
        confidence: mirror.confidence,
        needsRecenter: false,
        intent: "characterMirror",
        canonStatus: "grounded",
        nextTopic: "characterMirror",
        conclusiveState: mirror.conclusiveState,
        usedRegistry: ["coherenceDiagnostic", "characterRegistry"],
        suggestedMode: "characterMirror"
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
  const visitorText = capString(
    raw.visitorText || raw.message || raw.query || raw.text || "",
    MAX_INPUT_CHARS
  );

  return {
    visitorText,
    currentNode: capString(raw.currentNode || "", 140),
    currentEntry: capString(raw.currentEntry || raw.entry || "", 140),
    currentPath: capString(raw.currentPath || raw.path || "", 100),
    currentScopeLane: normalizeScope(raw.currentScopeLane || raw.scopeLane),
    currentVoiceMode: capString(raw.currentVoiceMode || raw.voiceMode || "", 100),
    visitorPosture: capString(raw.visitorPosture || "", 140),
    movement: capString(raw.movement || "", 100),
    pathDepth: safeNumber(raw.pathDepth, 0),
    routeReadiness: safeNumber(raw.routeReadiness, 0),
    loopCount: safeNumber(raw.loopCount || raw.visitorLoopCount, 0),
    topicDepth: safeNumber(raw.topicDepth || raw.currentTopicDepth, 0),
    allowedTargets: normalizeList(raw.allowedTargets).filter((target) => APPROVED_TARGETS.has(target)),
    allowedRoutes: normalizeList(raw.allowedRoutes).filter((route) => APPROVED_ROUTE_IDS.has(route)),
    sessionTrail: normalizeList(raw.sessionTrail).slice(-16),
    requestedMode: capString(raw.requestedMode || "", 100),
    registryContext: sanitizeExternalRegistryContext(raw.registryContext),
    diagnosticResult: sanitizeDiagnosticResult(raw.diagnosticResult || raw.coherenceDiagnosticResult),
    characterMirrorAnswers: sanitizeMirrorAnswers(raw.characterMirrorAnswers || raw.mirrorAnswers || raw.answers),
    intent: "unknown"
  };
}

function normalizeScope(value) {
  if (value === "narrative" || value === "threshold" || value === "immersion") return "narrative";
  return "objective";
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => capString(item, 180)).filter(Boolean);
}

function sanitizeExternalRegistryContext(value) {
  if (!value || typeof value !== "object") return null;

  return {
    id: capString(value.id || value.entry || "", 140),
    summary: capString(value.summary || value.answer || value.description || "", 1200),
    routes: normalizeList(value.routes).filter((route) => APPROVED_ROUTE_IDS.has(route)).slice(0, MAX_HANDOFFS),
    targets: normalizeList(value.targets).filter((target) => APPROVED_TARGETS.has(target)).slice(0, MAX_OPTIONS)
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

function sanitizeMirrorAnswers(value) {
  if (Array.isArray(value)) {
    return value.map((item) => capString(
      typeof item === "string" ? item : JSON.stringify(item || {}),
      500
    )).filter(Boolean).slice(0, 10);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).slice(0, 12).map((key) => {
      return capString(key + ": " + String(value[key] || ""), 500);
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
    ctx.requestedMode,
    ctx.sessionTrail.join(" ")
  ].join(" ").toLowerCase();

  if (/\b(recenter|lost|confused|start over|clean fork|reset)\b/.test(text)) return "recenter";

  if (
    /\b(which character am i|what character am i|most like|character am i mostly like|learn about myself|self[-\s]?learning|mirror me to a character)\b/.test(text) ||
    ctx.diagnosticResult ||
    ctx.characterMirrorAnswers.length
  ) {
    return "characterMirror";
  }

  if (/\b(scientific law|reality test|theory|evidence|measure|measurement|limits|claim testing|falsifiability|repeatability|calibration|uncertainty|causality)\b/.test(text)) {
    return "scientificLaw";
  }

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

  if (/\b(mirrorland|audralia|zionts|h-earth|world side|world gate|interactive narrative)\b/.test(text)) {
    return "mirrorland";
  }

  if (/\b(sean|designer|developer|founder|person behind|human behind)\b/.test(text)) return "sean";
  if (/\b(underdog|inner voice|voice under pressure|pressure voice)\b/.test(text)) return "underdog";

  if (/\b(proof|real|testable|laws|gauges|evidence)\b/.test(text)) return "proof";
  if (/\b(route|door|open|where should i go|next door|handoff)\b/.test(text)) return "route";

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

function retrieveApprovedMemory(ctx) {
  const text = [
    ctx.visitorText,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
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
    if (ctx.currentPath && item.keywords.includes(ctx.currentPath.toLowerCase())) score += 3;
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
      id: ctx.registryContext.id || "frontEndRegistryContext",
      scope: ctx.currentScopeLane,
      keywords: [],
      routes: ctx.registryContext.routes || [],
      targets: ctx.registryContext.targets || [],
      intents: [intent],
      summary: ctx.registryContext.summary
    });
  }

  if (intent === "characterMirror") {
    scored.unshift(memoryFromRegistry("characterMirror", {
      scope: "objective",
      keywords: ["which character am i most like", "self learning", "character mirror"],
      routes: ["coherenceDiagnostic", "characters"],
      targets: ["characterMirrorPath", "selfLearningPath", "characterMirrorQuestionOne", "charactersPath", "diagnosticPath"],
      intents: ["characterMirror"],
      summary:
        "Character Mirror is a reflective path that compares visitor pressure patterns to Mirrorland character resonance. It may mirror pressure, but it may not define identity or diagnose the visitor."
    }));
  }

  if (!scored.length) {
    return [
      base.find((item) => item.id === "diamondGateBridge"),
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
      targets: ["websitePath", "proofPath", "diagnosticPath", "productsPath", "worldPath"],
      intents: ["orientation", "route"],
      summary:
        "Diamond Gate Bridge is the estate: public proof wing, human-development chambers, practical wing, world threshold, and future-facing rooms gathered into one navigable place."
    }),
    memoryFromRegistry("compass", {
      scope: "objective",
      keywords: ["compass", "orientation", "where to start", "start", "lost", "begin"],
      routes: ["compass", "siteGuide"],
      targets: ["compassPath", "siteGuidePath", "proofPath", "diagnosticPath", "worldPath"],
      intents: ["orientation", "recenter", "route"],
      summary:
        "The Compass is the cleanest public orientation point. It helps visitors choose between proof, self-reflection, practical use, human voice, and the world door."
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
        "frontierLawPath"
      ],
      intents: ["scientificLaw", "proof"],
      summary: SCIENTIFIC_LAW_REGISTRY.summary + " " + SCIENTIFIC_LAW_REGISTRY.coreTruth
    }),
    memoryFromRegistry("coherenceDiagnostic", {
      scope: "objective",
      keywords: ["diagnostic", "coherence", "archetype", "strategist", "builder", "mitigator", "auditor", "fragmentation", "self"],
      routes: ["coherenceDiagnostic", "characters"],
      targets: ["diagnosticPath", "characterMirrorPath", "selfLearningPath", "futureProfilePath", "mirrorMePath"],
      intents: ["diagnostic", "characterMirror"],
      summary: COHERENCE_DIAGNOSTIC_REGISTRY.summary + " " + COHERENCE_DIAGNOSTIC_REGISTRY.boundaries
    }),
    memoryFromRegistry("frontier", {
      scope: "narrative",
      keywords: ["frontier", "energy", "fusion", "water", "waste", "closed loop", "infrastructure", "lattice", "urban", "manual", "shimmer", "trajectory", "vision"],
      routes: ["frontier", "audralia"],
      targets: ["frontierPath", "frontierSystemsPath", "frontierLawPath", "frontierCharactersPath", "hearthFrontierPath"],
      intents: ["frontier", "mirrorland"],
      summary: FRONTIER_REGISTRY.summary + " " + FRONTIER_REGISTRY.conjugation
    }),
    memoryFromRegistry("hearthConstruct", {
      scope: "narrative",
      keywords: ["hearth", "construct facility", "construct engine", "planetary", "world-formation", "planet construction"],
      routes: ["hearth", "frontier", "scientificLaw"],
      targets: ["hearthPath", "hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath"],
      intents: ["hearth", "frontier", "scientificLaw"],
      summary: HEARTH_CONSTRUCT_REGISTRY.summary + " " + HEARTH_CONSTRUCT_REGISTRY.spine
    }),
    memoryFromRegistry("mirrorland", {
      scope: "narrative",
      keywords: ["mirrorland", "audralia", "zionts", "h-earth", "world side", "future", "shadow", "story"],
      routes: ["interactiveNarrative", "hearth", "audralia", "frontier", "characters"],
      targets: ["worldPath", "worldGatePath", "hearthPath", "audraliaPath", "frontierPath", "charactersPath"],
      intents: ["mirrorland", "hearth", "frontier"],
      summary:
        "Mirrorland is where possible futures become visible before they become final. ZIONTS is consequence, H-Earth is survival, Audralia is possibility."
    }),
    memoryFromRegistry("sean", {
      scope: "objective",
      keywords: ["sean", "designer", "developer", "person behind", "human behind", "founder"],
      routes: ["meetSean", "aboutUnderdog", "book", "nineSummits"],
      targets: ["seanPath", "underdogPath", "bookPath", "productsPath"],
      intents: ["sean", "orientation"],
      summary:
        "Meet Sean is the chamber where the visitor meets Sean Mansfield, the designer and developer of Diamond Gate Bridge."
    }),
    memoryFromRegistry("thisUnderdog", {
      scope: "objective",
      keywords: ["this underdog", "underdog", "inner voice", "voice", "pressure", "comedy", "becoming", "language"],
      routes: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "book"],
      targets: ["underdogPath", "seanPath", "diagnosticPath", "bookPath"],
      intents: ["underdog", "diagnostic", "characterMirror"],
      summary:
        "This Underdog is not Sean alone. It is in the visitor too: the inner voice that has carried pressure before it found language, direction, or use."
    })
  ];

  Object.keys(CHARACTER_REGISTRY).forEach((id) => {
    const character = CHARACTER_REGISTRY[id];
    memory.push(memoryFromRegistry("character:" + id, {
      scope: "character",
      keywords: character.keywords,
      routes: ["characters"],
      targets: [character.target, "charactersPath", "characterRelationshipsPath", "characterMirrorPath"],
      intents: ["characters", "characterMirror"],
      summary: character.summary + " Mirror pattern: " + character.mirror
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
    routes: item.routes || [],
    targets: item.targets || [],
    intents: item.intents || [],
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
  const routeSet = new Set(ctx.allowedRoutes || []);
  const targetSet = new Set(ctx.allowedTargets || []);

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
    ["websitePath", "proofPath", "diagnosticPath", "worldPath", "returnFork"].forEach((target) => targetSet.add(target));
  }

  if (!routeSet.size) {
    ["compass", "siteGuide"].forEach((route) => routeSet.add(route));
  }

  return { routeSet, targetSet };
}

function expandAllowedByIntent(intent, targetSet, routeSet) {
  const addTargets = (items) => items.forEach((target) => APPROVED_TARGETS.has(target) && targetSet.add(target));
  const addRoutes = (items) => items.forEach((route) => APPROVED_ROUTE_IDS.has(route) && routeSet.add(route));

  if (intent === "characterMirror") {
    addTargets(["characterMirrorPath", "selfLearningPath", "characterMirrorQuestionOne", "characterMirrorQuestionTwo", "characterMirrorQuestionThree", "characterMirrorResult", "charactersPath", "diagnosticPath", "cleanDoor"]);
    addRoutes(["coherenceDiagnostic", "characters"]);
  }

  if (intent === "scientificLaw" || intent === "proof") {
    addTargets(["scientificLawPath", "scientificLawTheoryPath", "scientificLawEvidencePath", "scientificLawMeasurePath", "scientificLawLimitsPath", "scientificLawRoutePath", "scientificLawLadderPath", "frontierLawPath", "cleanDoor"]);
    addRoutes(["scientificLaw", "laws", "gauges"]);
  }

  if (intent === "frontier") {
    addTargets(["frontierPath", "frontierSystemsPath", "frontierEnergyPath", "frontierWaterPath", "frontierWastePath", "frontierClosedLoopPath", "frontierLawPath", "hearthFrontierPath", "frontierCharactersPath", "cleanDoor"]);
    addRoutes(["frontier", "frontierEnergy", "frontierWater", "frontierWaste", "frontierClosedLoop", "audralia"]);
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
      "characterMirrorPath"
    ]);
    addRoutes(["characters"]);
  }

  if (intent === "diagnostic") {
    addTargets(["diagnosticPath", "characterMirrorPath", "selfLearningPath", "futureProfilePath", "mirrorMePath"]);
    addRoutes(["coherenceDiagnostic", "characters"]);
  }

  if (intent === "mirrorland") {
    addTargets(["worldPath", "worldGatePath", "hearthPath", "audraliaPath", "frontierPath", "charactersPath"]);
    addRoutes(["interactiveNarrative", "globeWindow", "hearth", "audralia", "frontier", "characters"]);
  }

  if (intent === "recenter" || intent === "route" || intent === "orientation" || intent === "unknown") {
    addTargets(["compassPath", "siteGuidePath", "proofPath", "diagnosticPath", "worldPath", "cleanDoor", "returnFork", "switchTopics", "sharpQuestion"]);
    addRoutes(["compass", "siteGuide", "laws", "coherenceDiagnostic", "showroom"]);
  }
}

function shouldRecenter(ctx) {
  return ctx.loopCount >= 3 || ctx.topicDepth >= 4 || ctx.intent === "recenter";
}

function shouldReturnDeterministicMirror(ctx) {
  return Boolean(ctx.diagnosticResult || ctx.characterMirrorAnswers.length);
}

function buildCharacterMirrorResponse(ctx) {
  const mirror = computeCharacterMirror(ctx);
  const top = mirror.top[0];
  const second = mirror.top[1];
  const third = mirror.top[2];

  if (!top) {
    return {
      bubbles: [
        "I can help you learn about yourself through the Character Mirror.",
        "This will not define you. It will compare your pressure pattern to the characters and show which resonance is strongest right now.",
        "Start with the mirror questions, or take the Coherence Diagnostic first if you want the stronger read."
      ],
      options: [
        option("Ask the first mirror question.", "characterMirrorQuestionOne", "conversation", "objective"),
        option("Take the Coherence Diagnostic.", "diagnosticPath", "conversation", "objective"),
        option("Show the characters first.", "charactersPath", "conversation", "narrative"),
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
    "Reflective match, not identity: your answers currently resemble " + topCharacter.name + "’s pressure pattern most strongly.",
    topCharacter.name + " carries this pressure: " + topCharacter.pressure,
    secondCharacter
      ? "Your secondary pressure reads closest to " + secondCharacter.name + ". That suggests a support pattern around " + secondCharacter.mirror.toLowerCase() + "."
      : "The secondary pressure is not strong enough to name cleanly yet.",
    thirdCharacter
      ? "The tension match is " + thirdCharacter.name + ": the part of the pattern that may appear when pressure rises."
      : "This is enough to begin, but not enough to make a final label."
  ];

  return {
    bubbles,
    options: [
      option("Show why this match appeared.", topCharacter.target, "conversation", "narrative"),
      secondCharacter ? option("Show the secondary pressure.", secondCharacter.target, "conversation", "narrative") : null,
      option("Ask another mirror question.", "characterMirrorQuestionOne", "conversation", "objective"),
      option("Take the full Diagnostic.", "diagnosticPath", "conversation", "objective"),
      option("Show all characters.", "charactersPath", "conversation", "narrative"),
      option("Choose the next door.", "cleanDoor", "control", "objective")
    ].filter(Boolean),
    handoffs: ["characters", "coherenceDiagnostic"],
    confidence: mirror.confidence,
    conclusiveState: "complete"
  };
}

function computeCharacterMirror(ctx) {
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

  const mirrorText = ctx.characterMirrorAnswers.join(" ").toLowerCase() + " " + ctx.visitorText.toLowerCase();

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
  return {
    label,
    target,
    type: type || "conversation",
    scopeLane: scopeLane || (isNarrativeTarget(target) ? "narrative" : "objective")
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
          name: "jeeves_back_brain_response",
          strict: true,
          schema: RESPONSE_SCHEMA
        }
      },
      max_output_tokens: 1100
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
    "You are not an uncontrolled chatbot.",
    "You answer only from approved memory supplied in the request.",
    "You may explain, clarify, personalize, deepen, compare, and conclude, but you may not invent canon, pages, routes, characters, or facts.",
    "You must satisfy the visitor's actual itch before routing.",
    "You must use visitor-facing estate language, not internal implementation language.",
    "Forbidden public words and phrases include: registry, scope lane, organ, route lane, architecture layer, expression payload, progression state, backend bridge, API, public human-voice side.",
    "The words construct and engine are allowed only when speaking about Hearth as the public canon planetary construct facility or planetary construct engine. Do not use them to expose implementation structure.",
    "Character Mirror rule: you may say the visitor's answers currently resemble a character's pressure pattern. You may not say the visitor is that character. This is reflective, not diagnostic.",
    "Coherence Diagnostic boundary: it is local-only in its current version and is not medical, mental-health, legal, employment, official IQ, or official MBTI assessment.",
    "Conversation options must sound like things a visitor says to Jeeves.",
    "Action labels such as Open, Visit, and Enter belong only to handoffs, not conversation options.",
    "If the thread is already clear, use conclusiveState complete, route_ready, or switch_recommended instead of repeating definitions.",
    "You must return JSON only, following the required schema.",
    "Keep bubbles concise. Use 2 to 4 bubbles for deeper meaning questions.",
    "If unsure, re-center the visitor rather than inventing."
  ].join("\n");
}

function buildUserPrompt(ctx, memory, allowed) {
  return JSON.stringify({
    task: "Generate a safe governed Jeeves response.",
    visitor: {
      text: ctx.visitorText,
      intent: ctx.intent,
      currentNode: ctx.currentNode,
      currentEntry: ctx.currentEntry,
      currentPath: ctx.currentPath,
      currentScopeLane: ctx.currentScopeLane,
      currentVoiceMode: ctx.currentVoiceMode,
      visitorPosture: ctx.visitorPosture,
      movement: ctx.movement,
      pathDepth: ctx.pathDepth,
      topicDepth: ctx.topicDepth,
      loopCount: ctx.loopCount,
      routeReadiness: ctx.routeReadiness,
      sessionTrail: ctx.sessionTrail,
      diagnosticResultPresent: Boolean(ctx.diagnosticResult),
      characterMirrorAnswersPresent: Boolean(ctx.characterMirrorAnswers.length)
    },
    approvedMemory: memory.map((item) => ({
      id: item.id,
      scope: item.scope,
      summary: item.summary,
      allowedRoutes: item.routes,
      allowedTargets: item.targets
    })),
    approvedRegistries: {
      characters: Object.values(CHARACTER_REGISTRY).map((character) => ({
        id: character.id,
        name: character.name,
        title: character.title,
        pressure: character.pressure,
        mirror: character.mirror,
        summary: character.summary
      })),
      scientificLaw: SCIENTIFIC_LAW_REGISTRY,
      frontierSystems: FRONTIER_REGISTRY.systems,
      hearth: HEARTH_CONSTRUCT_REGISTRY,
      coherenceDiagnostic: COHERENCE_DIAGNOSTIC_REGISTRY
    },
    allowedConversationTargets: Array.from(allowed.targetSet),
    allowedRouteHandoffs: Array.from(allowed.routeSet),
    outputRules: {
      bubbles: "1 to 4 Jeeves-style response bubbles",
      options: "0 to 6 conversational options using allowedConversationTargets only",
      handoffs: "0 to 5 route IDs using allowedRouteHandoffs only",
      noMarkdown: true,
      noUnapprovedRoutes: true,
      noUnapprovedCanon: true,
      frontEndRouteAuthority: true
    }
  });
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
    .map((text) => sanitizePublicText(capString(text, 360), ctx))
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

      const target = capString(item.target, 90);
      if (!APPROVED_TARGETS.has(target)) return null;
      if (!allowed.targetSet.has(target)) return null;

      let label = sanitizeOptionLabel(capString(item.label, 96), target);
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
  const value = capString(label, 96);

  if (!value) return "";

  const actionLike = /^(visit|open|enter|explore|return to|take me to|go to|launch)\b/i.test(value);
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
    .map((route) => capString(route, 80))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .filter((route) => allowed.routeSet.has(route))
    .slice(0, MAX_HANDOFFS);
}

function normalizeUsedRegistry(value, memory) {
  const source = Array.isArray(value) && value.length
    ? value
    : memory.map((item) => item.id);

  return Array.from(new Set(source.map((item) => capString(item, 90)).filter(Boolean))).slice(0, 12);
}

function sanitizePublicText(text, ctx) {
  let clean = capString(text, 700);

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

  return clean.trim();
}

function isHearthContext(ctx) {
  if (!ctx) return false;
  const text = [
    ctx.intent,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.visitorText
  ].join(" ").toLowerCase();

  return text.includes("hearth") || text.includes("planetary construct") || text.includes("construct facility") || text.includes("construct engine");
}

function deterministicFallbackBubbles(ctx, memory) {
  const intent = ctx.intent || classifyIntent(ctx);

  if (intent === "characterMirror") {
    return buildCharacterMirrorResponse(ctx).bubbles;
  }

  if (intent === "scientificLaw") {
    return [
      SCIENTIFIC_LAW_REGISTRY.coreTruth,
      "The four main doors are Theory, Evidence, Measure, and Limits.",
      "Use Scientific Law when a claim sounds convincing but still needs to survive reality."
    ];
  }

  if (intent === "frontier") {
    return [
      FRONTIER_REGISTRY.conjugation,
      "Frontier is Audralia’s applied-science playground.",
      "It tests power, water, waste, feedback, infrastructure, ordered growth, city pressure, operating rules, visible signal, direction, and horizon aim."
    ];
  }

  if (intent === "hearth") {
    return [
      HEARTH_CONSTRUCT_REGISTRY.primaryLine,
      HEARTH_CONSTRUCT_REGISTRY.summary,
      HEARTH_CONSTRUCT_REGISTRY.spine
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

  if (intent === "characterMirror") {
    preferredTargets = ["characterMirrorQuestionOne", "diagnosticPath", "charactersPath", "selfLearningPath", "cleanDoor"];
  } else if (intent === "scientificLaw") {
    preferredTargets = ["scientificLawTheoryPath", "scientificLawEvidencePath", "scientificLawMeasurePath", "scientificLawLimitsPath", "scientificLawLadderPath", "frontierLawPath"];
  } else if (intent === "frontier") {
    preferredTargets = ["frontierSystemsPath", "frontierEnergyPath", "frontierWaterPath", "frontierWastePath", "hearthFrontierPath", "frontierLawPath"];
  } else if (intent === "hearth") {
    preferredTargets = ["hearthFacilityPath", "hearthConstructPath", "hearthFrontierPath", "hearthLawPath", "frontierPath", "scientificLawPath"];
  } else if (intent === "characters") {
    preferredTargets = ["charactersPath", "characterRelationshipsPath", "characterTensionsPath", "characterMirrorPath", "characterFirstPath"];
  } else {
    (memory || []).forEach((item) => {
      (item.targets || []).forEach((target) => preferredTargets.push(target));
    });
  }

  if (!preferredTargets.length) {
    preferredTargets.push("websitePath", "proofPath", "diagnosticPath", "worldPath", "returnFork");
  }

  return Array.from(new Set(preferredTargets))
    .filter((target) => APPROVED_TARGETS.has(target))
    .filter((target) => allowed.targetSet.has(target))
    .slice(0, MAX_OPTIONS)
    .map((target) => ({
      label: DEFAULT_CONVERSATION_LABELS[target] || "Tell me more.",
      target,
      type: target === "cleanDoor" || target === "returnFork" ? "control" : "conversation",
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

  return Array.from(new Set(routes))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
}

function defaultRecenterOptions() {
  return [
    { label: "Re-center me.", target: "recenterNode", type: "control", scopeLane: "objective" },
    { label: "I want proof.", target: "proofPath", type: "conversation", scopeLane: "objective" },
    { label: "I want the Diagnostic.", target: "diagnosticPath", type: "conversation", scopeLane: "objective" },
    { label: "I want the world side.", target: "worldPath", type: "conversation", scopeLane: "narrative" }
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
  const memory = data.memory || [];
  const allowed = allowedOverride || buildAllowedSets(safeCtx, memory);
  const bubbles = normalizeBubbles(data.bubbles || [], safeCtx, memory);
  const options = normalizeOptions(data.options || [], allowed);
  const rawHandoffs = Array.isArray(data.handoffs) ? data.handoffs : [];
  const handoffs = rawHandoffs
    .map((route) => capString(route, 80))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);

  return {
    ok: Boolean(data.ok),
    contract: CONTRACT,
    source: data.source || "server",
    safety: data.safety || safeUncheckedSafety(),
    bubbles,
    options: options.length ? options : defaultRecenterOptions(),
    handoffs: handoffs.length ? handoffs : ["compass"],
    handoffLabels: buildHandoffLabels(handoffs.length ? handoffs : ["compass"]),
    routeHints: buildRouteHints(handoffs.length ? handoffs : ["compass"]),
    confidence: ["high", "medium", "low"].includes(data.confidence) ? data.confidence : "medium",
    needsRecenter: Boolean(data.needsRecenter),
    intent: INTENTS.includes(data.intent) ? data.intent : safeCtx.intent || classifyIntent(safeCtx),
    canonStatus: CANON_STATUS.includes(data.canonStatus) ? data.canonStatus : "grounded",
    nextTopic: capString(data.nextTopic || safeCtx.intent || "orientation", 90),
    conclusiveState: CONCLUSIVE_STATES.includes(data.conclusiveState) ? data.conclusiveState : "open",
    usedRegistry: Array.isArray(data.usedRegistry) ? data.usedRegistry.slice(0, 12) : [],
    suggestedMode: SUGGESTED_MODES.includes(data.suggestedMode) ? data.suggestedMode : "objective",
    routeAuthority: "front_end_remains_final_authority"
  };
}

function buildHandoffLabels(routes) {
  const labels = {};
  (routes || []).forEach((route) => {
    if (DEFAULT_HANDOFF_LABELS[route]) labels[route] = DEFAULT_HANDOFF_LABELS[route];
  });
  return labels;
}

function buildRouteHints(routes) {
  const hints = {};
  (routes || []).forEach((route) => {
    if (ROUTE_HINTS[route]) hints[route] = ROUTE_HINTS[route];
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
  if (intent === "characterMirror") return "characterMirror";
  if (intent === "frontier" || intent === "hearth" || intent === "mirrorland") return "threshold";
  if ((memory || []).some((item) => item.scope === "narrative" || item.scope === "character")) return "immersion";
  return "objective";
}

function isNarrativeTarget(target) {
  return [
    "worldPath",
    "worldGatePath",
    "charactersPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
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
    "characterRemoteTeamPath"
  ].includes(target);
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
