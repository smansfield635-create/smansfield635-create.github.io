// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_BACKBRAIN_ENRICHMENT_ROUTE_SEPARATION_SLOW_REVEAL_TNT_v21
// Full-file replacement.
// Browser-side only.
// Center / Frontbrain runtime.
// Owns visible Jeeves state, button behavior, house-listening state, tap-to-rush,
// slow reveal pacing, API enrichment calls, local fallback, route handoff rendering,
// and final route authority.
// Does not own secure model bridge, deep canon storage, moderation, or final public voice canon.

(function () {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_BACKBRAIN_ENRICHMENT_ROUTE_SEPARATION_SLOW_REVEAL_TNT_v21";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_HEARTH_MISSION_CONTROL_WINDOW_WITHIN_WINDOW_API_V3_TNT_v20";

  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var DEFAULT_BRAIN_ENDPOINT = "/api/jeeves.js";

  var ACTIVE_HOST_PAGE = "hearthJeeves";
  var CURRENT_ROOM_CONTEXT = "hearth";
  var CURRENT_ROOM_ROLE = "mission_control";
  var CURRENT_ROOM_PREMISE = "window_within_the_window";
  var ESTATE_KNOWLEDGE_MODE = "blueprint_reference";
  var PORTAL_LOGIC = "estate_window_to_unknown_future_potential";
  var ROUTE_AUTHORITY = "frontbrain_remains_final_authority";
  var LIVE_PAGE_ACCESS = ["hearthJeeves"];
  var PLANNED_LIVE_PAGE_ACCESS = ["compass"];

  var MAX_TRAIL = 32;
  var MAX_VISIBLE_OPTIONS = 8;
  var MAX_VISIBLE_HANDOFFS = 8;

  var CONVERSATION_LANGUAGE_PREFIXES = [
    "Tell me about",
    "Explain",
    "Show me why",
    "Help me understand",
    "Show me how",
    "Which Character Archetype"
  ];

  var ROUTE_LANGUAGE_PREFIXES = [
    "Open",
    "Go to",
    "Visit",
    "Enter",
    "Launch"
  ];

  var LOCAL_ROUTE_HINTS = {
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

  var LOCAL_HANDOFF_LABELS = {
    compass: "Open the Compass",
    home: "Open the Public Entry",
    siteGuide: "Open the Guide Desk",
    coherenceDiagnostic: "Open the Diagnostic",
    meetSean: "Open Meet Sean",
    products: "Open Products",
    laws: "Open the Law Library",
    scientificLaw: "Open Scientific Law",
    gauges: "Open Triple G",
    showroom: "Open the Atrium",
    hearth: "Open Hearth",
    mirrorland: "Open Mirrorland",
    zionts: "Open ZIONTS",
    audralia: "Open Audralia",
    hEarth: "Open H-Earth",
    frontier: "Open Frontier",
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
    characters: "Open the Characters Page",
    controlRoom: "Open the Control Room",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "Open This Underdog"
  };

  var CONVERSATION_LABELS = {
    websitePath: "Tell me how the estate is built.",
    skepticPlain: "Explain it plainly first.",
    proofPath: "Tell me what makes this trustworthy.",
    diagnosticPath: "Tell me about the self-reflection room.",
    mirrorlandPath: "Tell me what Mirrorland is before I enter.",
    atriumPath: "Tell me about the South Gate threshold.",
    atlasPath: "Tell me how the Mirrorland map works.",
    charactersPath: "Introduce the Characters.",
    compassPath: "Orient me first.",
    whereToStart: "Help me choose where to start.",
    siteGuidePath: "Tell me how the rooms relate.",
    lawsPath: "Tell me about the proof side of the estate.",
    scientificLawPath: "Tell me how claims are tested.",
    scientificLawTheoryPath: "Tell me about Theory.",
    scientificLawEvidencePath: "Tell me about Evidence.",
    scientificLawMeasurePath: "Tell me about Measure.",
    scientificLawLimitsPath: "Tell me about Limits.",
    scientificLawRoutePath: "Show me the testing route.",
    scientificLawLadderPath: "Show me the claim ladder.",
    scientificLawTermsPath: "Explain the deeper proof terms.",
    gaugesPath: "Tell me about the status room.",
    seanPath: "Tell me about the creator behind all of this.",
    underdogPath: "Tell me about This Underdog.",
    productsPath: "Tell me what can be used or carried.",
    nineSummitsPath: "Tell me about the value road.",
    nineSummitsBookPath: "Tell me about The Nine Summits of Love.",
    hearthPath: "Tell me about Hearth Mission Control.",
    hearthFacilityPath: "Explain Hearth as Mission Control.",
    hearthConstructPath: "Explain the window within the window.",
    hearthFrontierPath: "Tell me why Hearth is near Frontier.",
    hearthLawPath: "Tell me why Hearth must answer to proof.",
    hEarthPath: "Tell me about the survival path.",
    ziontsPath: "Tell me about the consequence road.",
    audraliaPath: "Tell me about Audralia.",
    audraliaWorldroomPath: "Tell me about Audralia’s visible worldroom.",
    controlCockpitPath: "Tell me how Audralia becomes readable.",
    frontierPath: "Tell me what Frontier tests.",
    frontierSystemsPath: "Tell me about the future systems.",
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
    frontierLawPath: "Tell me why Frontier needs proof.",
    frontierCharactersPath: "Tell me who carries Frontier pressure.",
    futureProfilePath: "Tell me about the future profile.",
    mirrorMePath: "Tell me about the mirror path.",
    characterIdentityPath: "Who are the Characters?",
    characterRelationshipsPath: "Tell me how the Characters relate.",
    characterTensionsPath: "Tell me what conflict they carry.",
    characterMotivesPath: "Tell me what motivates them.",
    characterStoryPressurePath: "Tell me why the Characters matter.",
    characterFirstPath: "Tell me who I should meet first.",
    characterAurenValePath: "Tell me about Auren Vale.",
    characterDextrionPath: "Tell me about Dextrion.",
    characterAlaricPath: "Tell me about Alaric.",
    characterTarianPath: "Tell me about Tarian.",
    characterElaraPath: "Tell me about Elara.",
    characterSorenPath: "Tell me about Soren.",
    characterJeevesPath: "Tell me about Jeeves.",
    characterRemoteTeamPath: "Tell me about the Remote Team.",
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

  var CHARACTER_TARGETS = {
    characterAurenValePath: {
      name: "Auren Vale",
      title: "Sanctuary Builder",
      pressure: "Every protected life makes the manor harder to hide.",
      oneLine: "Auren Vale protects the manor, but every life he shelters makes the sanctuary harder to hide."
    },
    characterDextrionPath: {
      name: "Dextrion",
      title: "Earth-Side Originator",
      pressure: "Every one-way crossing remains on his hands.",
      oneLine: "Dextrion opened the crossing from Earth and carries the burden of everyone who cannot return."
    },
    characterAlaricPath: {
      name: "Alaric",
      title: "Field Navigator",
      pressure: "Waiting for proof can close the only safe route.",
      oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe."
    },
    characterTarianPath: {
      name: "Tarian",
      title: "Water Anchor",
      pressure: "The future fails if the body cannot continue.",
      oneLine: "Tarian keeps survival physical because no future matters if the body cannot continue."
    },
    characterElaraPath: {
      name: "Elara",
      title: "Signal Bearer",
      pressure: "The future has to be visible before anyone moves toward it.",
      oneLine: "Elara makes the future visible before it disappears, but visibility always risks exposure."
    },
    characterSorenPath: {
      name: "Soren",
      title: "Boundary Keeper",
      pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
      oneLine: "Soren refuses fake restoration because hidden damage only creates another ZIONTS."
    },
    characterJeevesPath: {
      name: "Jeeves",
      title: "Manor Interface",
      pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
      oneLine: "Jeeves sequences truth because the wrong amount of truth can send a visitor into the wrong room."
    },
    characterRemoteTeamPath: {
      name: "Remote Team",
      title: "Distributed Response Unit",
      pressure: "If survival cannot leave the manor, the manor is only a bunker.",
      oneLine: "The Remote Team carries survival beyond the manor, where protection has to become distributable."
    }
  };

  var LOCAL_NODES = {
    intro: {
      roomId: "hearthMissionControl",
      beats: [
        "Welcome. I’m Jeeves.",
        "I’m currently stationed in Hearth Mission Control — the window within the window.",
        "Mirrorland opens the larger future-facing field. Hearth gives us the inner control view, where we can observe, coordinate, and route unknown future potential through the estate’s portal logic.",
        "I know the estate by its blueprint. I do not pretend to be stationed inside every page at once. For now, this is my live room."
      ],
      options: [
        convo("Tell me about Hearth Mission Control.", "hearthPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
        convo("Introduce the Characters.", "charactersPath"),
        convo("Tell me about the proof side of the estate.", "lawsPath"),
        convo("Tell me about the creator behind all of this.", "seanPath"),
        convo("Help me choose where to start.", "whereToStart")
      ],
      handoffs: ["hearth", "mirrorland", "frontier"]
    },
    whereToStart: {
      beats: [
        "There are three clean ways to begin.",
        "If you want proof, start west with Law Library and Scientific Law.",
        "If you want story, start south with Mirrorland and the Characters.",
        "If you want systems, start east with Frontier and Hearth."
      ],
      options: [
        convo("Tell me about the proof side of the estate.", "lawsPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
        convo("Tell me what Frontier tests.", "frontierPath"),
        convo("Tell me about Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["laws", "scientificLaw", "mirrorland", "frontier"]
    },
    hearthPath: {
      beats: [
        "Hearth is Mission Control — the window within the window.",
        "Mirrorland is the larger future-facing field. Hearth is the inner estate control view where Jeeves can coordinate what the visitor is seeing.",
        "That means Hearth is not merely a globe route. It is where future potential, world logic, proof boundaries, and route decisions come into view together."
      ],
      options: [
        convo("Explain the window within the window.", "hearthConstructPath"),
        convo("Tell me why Hearth is near Frontier.", "hearthFrontierPath"),
        convo("Tell me why Hearth must answer to proof.", "hearthLawPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath")
      ],
      handoffs: ["hearth", "frontier", "scientificLaw", "mirrorland"]
    },
    hearthConstructPath: {
      beats: [
        "The window within the window means the page is local, but the view is larger than the page.",
        "Hearth is the control chamber inside the estate. It looks toward unknown future potential through portal logic without pretending the visitor has already crossed into that deeper place.",
        "That is why Jeeves can speak from Hearth without claiming to be mounted inside every page at once."
      ],
      options: [
        convo("Tell me about Hearth Mission Control.", "hearthPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
        convo("Tell me why Hearth must answer to proof.", "hearthLawPath")
      ],
      handoffs: ["hearth", "mirrorland", "scientificLaw"]
    },
    mirrorlandPath: {
      beats: [
        "Mirrorland is the larger future-facing window.",
        "It is where possible futures become visible before they become final.",
        "ZIONTS is consequence. H-Earth is survival. Audralia is possibility.",
        "Hearth does not replace Mirrorland. Hearth coordinates the inner view into it."
      ],
      options: [
        convo("Tell me how the Mirrorland map works.", "atlasPath"),
        convo("Introduce the Characters.", "charactersPath"),
        convo("Tell me about Audralia.", "audraliaPath"),
        convo("Tell me about Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["mirrorland", "audralia", "characters", "hearth"]
    },
    atlasPath: {
      beats: [
        "Atlas Study is the map room for the world-facing side of the estate.",
        "It helps the visitor choose between consequence, survival, possibility, and construction before entering deeper rooms.",
        "That keeps Mirrorland from feeling like a random world menu."
      ],
      options: [
        convo("Tell me about the consequence road.", "ziontsPath"),
        convo("Tell me about the survival path.", "hEarthPath"),
        convo("Tell me about Audralia.", "audraliaPath"),
        convo("Tell me about Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["mirrorland", "zionts", "hEarth", "audralia", "hearth"]
    },
    charactersPath: {
      beats: [
        "The Characters are where Mirrorland becomes personal.",
        "They are not decorations. They are pressure carriers.",
        "Each one carries a different form of responsibility, survival, proof, signal, shelter, field reading, or public action."
      ],
      options: [
        convo("Tell me who I should meet first.", "characterFirstPath"),
        convo("Tell me about Auren Vale.", "characterAurenValePath"),
        convo("Tell me how the Characters relate.", "characterRelationshipsPath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterFirstPath: {
      beats: [
        "Start with Auren Vale if you want shelter and protection.",
        "Start with Dextrion if you want origin, repair, and responsibility.",
        "Start with Soren if you want proof, hidden cost, and boundary.",
        "Start with Jeeves if you want the rule of sequence itself."
      ],
      options: [
        convo("Tell me about Auren Vale.", "characterAurenValePath"),
        convo("Tell me about Dextrion.", "characterDextrionPath"),
        convo("Tell me about Soren.", "characterSorenPath"),
        convo("Tell me about Jeeves.", "characterJeevesPath")
      ],
      handoffs: ["characters"]
    },
    characterRelationshipsPath: {
      beats: [
        "The Characters relate through pressure, not biography alone.",
        "Auren protects the sanctuary. Dextrion carries the origin burden. Alaric reads danger before others believe it. Tarian keeps survival physical.",
        "Elara makes the future visible. Soren refuses hidden cost. Jeeves sequences truth. The Remote Team carries survival beyond the manor."
      ],
      options: [
        convo("Tell me what conflict they carry.", "characterTensionsPath"),
        convo("Tell me what motivates them.", "characterMotivesPath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Tell me about Auren Vale.", "characterAurenValePath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterTensionsPath: {
      beats: [
        "Their conflict is not simple good versus evil.",
        "It is protection versus exposure, repair versus guilt, warning versus disbelief, survival versus exhaustion, visibility versus risk, and truth versus false restoration.",
        "That is why Mirrorland needs Characters: the world pressure has to become human pressure."
      ],
      options: [
        convo("Tell me how the Characters relate.", "characterRelationshipsPath"),
        convo("Tell me why the Characters matter.", "characterStoryPressurePath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterMotivesPath: {
      beats: [
        "The Characters are motivated by what they cannot safely ignore.",
        "Some protect. Some repair. Some warn. Some endure. Some reveal. Some audit. Some sequence. Some carry help into the field.",
        "That gives each one a different kind of pressure."
      ],
      options: [
        convo("Tell me how the Characters relate.", "characterRelationshipsPath"),
        convo("Tell me what conflict they carry.", "characterTensionsPath"),
        convo("Tell me who I should meet first.", "characterFirstPath")
      ],
      handoffs: ["characters"]
    },
    characterStoryPressurePath: {
      beats: [
        "The Characters matter because world logic alone is too abstract.",
        "A future can be mapped, tested, and measured, but someone still has to carry the pressure of what it means.",
        "That is where the Characters enter."
      ],
      options: [
        convo("Tell me how the Characters relate.", "characterRelationshipsPath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterArchetypeMirrorPath: {
      beats: [
        "The Character Archetype Mirror is reflective, not diagnostic.",
        "It does not tell you who you are. It asks which Character Archetype your behavior follows under pressure.",
        "The stronger version belongs with the Diagnostic. Here, we can begin with the mirror path."
      ],
      options: [
        convo("Ask the first mirror question.", "characterArchetypeQuestionOne"),
        convo("Tell me about the self-reflection room.", "diagnosticPath"),
        convo("Introduce the Characters.", "charactersPath"),
        convo("Show my behavior under pressure.", "selfLearningPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeQuestionOne: {
      beats: [
        "First mirror question:",
        "When pressure rises, do you usually try to structure the field, build a solution, stabilize the damage, or audit the truth?"
      ],
      options: [
        convo("I try to structure the field.", "characterArchetypeQuestionTwo"),
        convo("I try to build a solution.", "characterArchetypeQuestionTwo"),
        convo("I try to stabilize the damage.", "characterArchetypeQuestionTwo"),
        convo("I try to audit the truth.", "characterArchetypeQuestionTwo")
      ],
      handoffs: ["coherenceDiagnostic"]
    },
    characterArchetypeQuestionTwo: {
      beats: [
        "Second mirror question:",
        "When people misunderstand the pressure, do you explain, act, hold the line, or withdraw until the proof catches up?"
      ],
      options: [
        convo("Ask the third mirror question.", "characterArchetypeQuestionThree"),
        convo("Tell me about the self-reflection room.", "diagnosticPath"),
        convo("Introduce the Characters.", "charactersPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeQuestionThree: {
      beats: [
        "Third mirror question:",
        "What do you protect first: the person, the system, the truth, the route, the signal, or the future?"
      ],
      options: [
        convo("Show my reflective match.", "characterArchetypeResult"),
        convo("Take me to the stronger Diagnostic path.", "diagnosticPath"),
        convo("Introduce the Characters again.", "charactersPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeResult: {
      beats: [
        "A clean reflective match needs more than one answer.",
        "From here, the better route is the Diagnostic, because it gives your pressure behavior more structure before Jeeves reflects it against the Characters.",
        "This path remains a mirror, not a label."
      ],
      options: [
        convo("Tell me about the self-reflection room.", "diagnosticPath"),
        convo("Introduce the Characters.", "charactersPath"),
        convo("Re-center me.", "recenterNode", "control")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    lawsPath: {
      beats: [
        "Law Library is the proof side of the estate.",
        "It keeps the work from expanding without discipline.",
        "If Law Library sets the boundary, Scientific Law tests the claim, and The Lab reads readiness."
      ],
      options: [
        convo("Tell me how claims are tested.", "scientificLawPath"),
        convo("Tell me about the status room.", "gaugesPath"),
        convo("Tell me why Frontier needs proof.", "frontierLawPath"),
        convo("Tell me why Hearth must answer to proof.", "hearthLawPath")
      ],
      handoffs: ["laws", "scientificLaw", "gauges"]
    },
    scientificLawPath: {
      beats: [
        "A claim does not become scientific because it sounds technical.",
        "It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
        "Scientific Law is the Reality Test chamber."
      ],
      options: [
        convo("Tell me about Theory.", "scientificLawTheoryPath"),
        convo("Tell me about Evidence.", "scientificLawEvidencePath"),
        convo("Tell me about Measure.", "scientificLawMeasurePath"),
        convo("Tell me about Limits.", "scientificLawLimitsPath")
      ],
      handoffs: ["scientificLaw", "laws", "gauges"]
    },
    gaugesPath: {
      beats: [
        "Triple G reads Goals, Gauges, and Gaps.",
        "Goals name what the room is trying to become. Gauges show what can be checked. Gaps show what remains unresolved.",
        "That makes The Lab a readiness room, not just a status display."
      ],
      options: [
        convo("Tell me about the proof side of the estate.", "lawsPath"),
        convo("Tell me how claims are tested.", "scientificLawPath"),
        convo("Tell me why Frontier needs proof.", "frontierLawPath")
      ],
      handoffs: ["gauges", "laws", "scientificLaw"]
    },
    frontierPath: {
      beats: [
        "Frontier tests what the future needs.",
        "It is Audralia’s applied-science yard: energy, water, waste, feedback, infrastructure, lattice, urban pressure, manuals, shimmer, trajectory, and vision.",
        "Frontier stays near Hearth because tested systems still need coordination."
      ],
      options: [
        convo("Tell me about the future systems.", "frontierSystemsPath"),
        convo("Tell me about Energy.", "frontierEnergyPath"),
        convo("Tell me about Water.", "frontierWaterPath"),
        convo("Tell me why Frontier needs proof.", "frontierLawPath"),
        convo("Tell me about Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["frontier", "hearth", "audralia", "scientificLaw"]
    },
    frontierSystemsPath: {
      beats: [
        "Frontier is not one system. It is a yard of future-system tests.",
        "Energy asks how power survives. Water asks how flow returns. Waste asks what can be recovered. Closed Loop asks whether the system can answer back.",
        "Infrastructure, Lattice, Urban, Manual, Shimmer, Trajectory, and Vision keep the future from becoming vague."
      ],
      options: [
        convo("Tell me about Energy.", "frontierEnergyPath"),
        convo("Tell me about Water.", "frontierWaterPath"),
        convo("Tell me about Closed Loop.", "frontierClosedLoopPath"),
        convo("Tell me why Hearth is near Frontier.", "hearthFrontierPath")
      ],
      handoffs: ["frontier", "hearth"]
    },
    seanPath: {
      beats: [
        "Sean Mansfield is the creator behind Diamond Gate Bridge: the estate, rooms, laws, worlds, characters, and conversation structure that holds them together.",
        "The work comes from struggle, creative integrity, artistic integrity, love for nature, preservation, growth, and societal understanding.",
        "That is why this path sits near This Underdog and Nine Summits."
      ],
      options: [
        convo("Tell me about This Underdog.", "underdogPath"),
        convo("Tell me about the value road.", "nineSummitsPath"),
        convo("Tell me how the estate is built.", "websitePath")
      ],
      handoffs: ["meetSean", "aboutUnderdog", "nineSummits"]
    },
    underdogPath: {
      beats: [
        "This Underdog is not Sean alone.",
        "It is the inner voice in the visitor that has carried pressure before it found language, direction, or use.",
        "The underdog path turns pain into orientation, pressure into voice, and survival into growth."
      ],
      options: [
        convo("Tell me about the creator behind all of this.", "seanPath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Tell me about the value road.", "nineSummitsPath")
      ],
      handoffs: ["aboutUnderdog", "meetSean", "nineSummits"]
    },
    nineSummitsPath: {
      beats: [
        "Nine Summits is the value road.",
        "It is where the human climb becomes larger than a single page or product.",
        "The path moves through Character, Structure, Balance, Stability, Peace, Joy, Dignity, Free Will, and Love."
      ],
      options: [
        convo("Tell me about The Nine Summits of Love.", "nineSummitsBookPath"),
        convo("Tell me about This Underdog.", "underdogPath"),
        convo("Tell me about the creator behind all of this.", "seanPath")
      ],
      handoffs: ["nineSummits", "aboutUnderdog", "meetSean"]
    },
    diagnosticPath: {
      beats: [
        "The Diagnostic is a self-reflection and pattern-assessment room.",
        "It is not medical, mental-health, legal, employment, IQ, or MBTI diagnosis.",
        "It helps separate claimed pressure behavior from revealed pressure behavior."
      ],
      options: [
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Show my behavior under pressure.", "selfLearningPath"),
        convo("Tell me about the proof side of the estate.", "lawsPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    recenterNode: {
      beats: [
        "We can re-center.",
        "From Hearth Mission Control, the clean doors are proof, Mirrorland, Characters, Frontier, or the creator path."
      ],
      options: [
        convo("Tell me about the proof side of the estate.", "lawsPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
        convo("Introduce the Characters.", "charactersPath"),
        convo("Tell me what Frontier tests.", "frontierPath"),
        convo("Tell me about the creator behind all of this.", "seanPath")
      ],
      handoffs: ["compass", "siteGuide", "laws", "mirrorland", "frontier"]
    },
    returnFork: {
      beats: [
        "We are back at the First Fork.",
        "Choose proof, story, systems, self-reflection, or source."
      ],
      options: [
        convo("Tell me about the proof side of the estate.", "lawsPath"),
        convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
        convo("Tell me what Frontier tests.", "frontierPath"),
        convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        convo("Tell me about the creator behind all of this.", "seanPath")
      ],
      handoffs: ["compass", "siteGuide"]
    }
  };

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    brainEndpoint: DEFAULT_BRAIN_ENDPOINT,
    mounted: false,
    currentNode: "intro",
    currentTopic: "hearth",
    currentRoomId: "hearthMissionControl",
    currentRoomName: "Hearth Mission Control",
    currentCardinal: "E",
    currentCoordinateName: "East Mission Control",
    currentPlaceType: "mission-control chamber",
    currentScopeLane: "narrative",
    currentVoiceMode: "jeeves",
    currentEntry: "intro",
    currentPath: "intro",
    selectedTargets: [],
    selectedOptionKeys: [],
    visitedNodes: [],
    visitorTrail: [],
    roomTrail: [],
    returnStack: [],
    branchStack: [],
    lastBackbrainFrame: null,
    lastFibonacciDepth: 0,
    lastFibonacciStage: "",
    lastRouteHints: {},
    lastHandoffLabels: {},
    lastApiDepthMode: "",
    lastApiContract: "",
    lastApiResponseAt: "",
    lastBackbrainAuthorities: {},
    lastSelectedTarget: "",
    lastSelectedLabel: "",
    lastRequestMode: "",
    apiReady: false,
    apiFailureCount: 0,
    houseListening: true,
    isTyping: false,
    rushActive: false,
    currentDelayResolve: null,
    characterOverviewDone: false,
    characterProfileViews: {},
    characterProfileViewCount: 0,
    characterRelationshipViews: 0,
    characterArchetypeAnswers: []
  };

  var els = {
    root: null,
    transcript: null,
    optionsPanel: null,
    handoffPanel: null,
    status: null,
    input: null,
    send: null
  };

  function boot() {
    ensureNamespace();
    resolveElements();
    stampRoot();
    bindEvents();
    exposeApi();
    renderLocalNode("intro", { silentVisitor: true, replace: true });
  }

  function ensureNamespace() {
    window.HEARTH = window.HEARTH || {};
    window.HEARTH.JEEVES = window.HEARTH.JEEVES || {};
  }

  function resolveElements() {
    els.root =
      document.querySelector("[data-jeeves-root]") ||
      document.querySelector("#jeevesRoot") ||
      document.querySelector("#hearthJeeves") ||
      document.querySelector(".jeeves-root") ||
      document.querySelector(".hearth-jeeves") ||
      createRoot();

    els.transcript =
      els.root.querySelector("[data-jeeves-transcript]") ||
      els.root.querySelector("[data-jeeves-log]") ||
      els.root.querySelector(".jeeves-transcript") ||
      els.root.querySelector(".jeeves-log") ||
      createSection("jeeves-transcript", "data-jeeves-transcript");

    els.optionsPanel =
      els.root.querySelector("[data-jeeves-options]") ||
      els.root.querySelector("[data-jeeves-prompts]") ||
      els.root.querySelector(".jeeves-options") ||
      createSection("jeeves-options", "data-jeeves-options");

    els.handoffPanel =
      els.root.querySelector("[data-jeeves-handoffs]") ||
      els.root.querySelector(".jeeves-handoffs") ||
      createSection("jeeves-handoffs", "data-jeeves-handoffs");

    els.status =
      els.root.querySelector("[data-jeeves-status]") ||
      els.root.querySelector(".jeeves-status") ||
      createSection("jeeves-status", "data-jeeves-status");

    els.input =
      els.root.querySelector("[data-jeeves-input]") ||
      els.root.querySelector("textarea") ||
      els.root.querySelector("input[type='text']");

    els.send =
      els.root.querySelector("[data-jeeves-send]") ||
      els.root.querySelector(".jeeves-send") ||
      els.root.querySelector("button[type='submit']");
  }

  function createRoot() {
    var root = document.createElement("section");
    root.className = "hearth-jeeves";
    root.setAttribute("data-jeeves-root", "");
    document.body.appendChild(root);
    return root;
  }

  function createSection(className, dataName) {
    var section = document.createElement("section");
    section.className = className;
    section.setAttribute(dataName, "");
    els.root.appendChild(section);
    return section;
  }

  function stampRoot() {
    if (!els.root) return;

    els.root.setAttribute("data-frontbrain-contract", CONTRACT);
    els.root.setAttribute("data-frontbrain-previous-contract", PREVIOUS_CONTRACT);
    els.root.setAttribute("data-jeeves-host-page", ACTIVE_HOST_PAGE);
    els.root.setAttribute("data-current-room-context", CURRENT_ROOM_CONTEXT);
    els.root.setAttribute("data-current-room-role", CURRENT_ROOM_ROLE);
    els.root.setAttribute("data-current-room-premise", CURRENT_ROOM_PREMISE);
    els.root.setAttribute("data-jeeves-live-access", LIVE_PAGE_ACCESS.join(","));
    els.root.setAttribute("data-jeeves-planned-live-access", PLANNED_LIVE_PAGE_ACCESS.join(","));
    els.root.setAttribute("data-jeeves-estate-knowledge", ESTATE_KNOWLEDGE_MODE);
    els.root.setAttribute("data-route-authority", ROUTE_AUTHORITY);
    els.root.setAttribute("data-house-listening", state.houseListening ? "true" : "false");
    els.root.setAttribute("data-room-state", state.currentNode);
    els.root.setAttribute("data-jeeves-typing", state.isTyping ? "true" : "false");
    els.root.setAttribute("data-conversation-route-separation", "active");
    els.root.setAttribute("data-language-separation", "conversation-vs-handoff");
    els.root.setAttribute("data-api-enrichment", "available");
  }

  function bindEvents() {
    els.root.addEventListener("click", function (event) {
      var optionButton = event.target.closest("[data-jeeves-option]");
      var routeButton = event.target.closest("[data-jeeves-route-option]");

      if (optionButton) {
        event.preventDefault();
        handleConversationButton(optionButton);
        return;
      }

      if (routeButton) {
        handleRouteHandoff(routeButton, event);
        return;
      }

      if (state.isTyping && !event.target.closest("button, a, input, textarea, select, [data-jeeves-option], [data-jeeves-route-option]")) {
        rushReveal();
      }
    });

    if (els.send && els.input) {
      els.send.addEventListener("click", function (event) {
        event.preventDefault();
        submitFreeform();
      });
    }

    if (els.input) {
      els.input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitFreeform();
        }
      });
    }
  }

  function handleConversationButton(button) {
    if (state.isTyping) {
      rushReveal();
      return;
    }

    var target = button.getAttribute("data-target") || "";
    var label = button.textContent || "";
    var type = button.getAttribute("data-type") || "conversation";
    var option = {
      label: label,
      target: target,
      type: type,
      scopeLane: button.getAttribute("data-scope-lane") || "objective",
      optionKind: button.getAttribute("data-option-kind") || "conversation"
    };

    if (!target) return;

    addVisitorBubble(label);
    hideInteractivePanels();

    if (isControlTarget(target) || type === "control") {
      runControlTarget(target, option);
      return;
    }

    runEnrichedConversation(option);
  }

  function handleRouteHandoff(button, event) {
    var href = button.getAttribute("href") || button.getAttribute("data-href") || "";
    var routeId = button.getAttribute("data-route-id") || "";

    if (!routeId || !href || href === "#") {
      event.preventDefault();
      addAssistantSystemBubble("That door is not ready yet. I will hold it rather than send you to a broken path.");
      return;
    }

    state.houseListening = false;
    stampRoot();
  }

  function submitFreeform() {
    if (!els.input || state.isTyping) {
      if (state.isTyping) rushReveal();
      return;
    }

    var text = String(els.input.value || "").trim();
    if (!text) return;

    els.input.value = "";
    addVisitorBubble(text);
    hideInteractivePanels();

    askBackbrain({
      visitorText: text,
      selectedTarget: "",
      selectedLabel: "",
      requestMode: "freeform"
    }).then(function (response) {
      renderBackbrainResponse(response, null, {
        fallbackTarget: "sharpQuestion",
        fallbackLabel: text
      });
    }).catch(function () {
      state.apiFailureCount += 1;
      renderLocalNode("sharpQuestion", { silentVisitor: true });
    });
  }

  function runControlTarget(target) {
    var clean = normalizeTarget(target);

    if (clean === "restartFork") {
      state.returnStack = [];
      state.branchStack = [];
      renderLocalNode("intro", { silentVisitor: true, replace: false });
      return;
    }

    if (clean === "returnFork") {
      renderLocalNode("returnFork", { silentVisitor: true });
      return;
    }

    if (clean === "priorTopicReturnPath" || clean === "originReturnPath") {
      var prior = state.returnStack.pop() || "intro";
      renderLocalNode(prior, { silentVisitor: true });
      return;
    }

    if (clean === "switchTopics" || clean === "cleanDoor" || clean === "loopRecovery" || clean === "recenterNode") {
      renderLocalNode("recenterNode", { silentVisitor: true });
      return;
    }

    if (clean === "sharpQuestion") {
      revealBeats(["Ask me a little more directly what you want to understand, and I will keep the answer inside the right room."]).then(function () {
        renderConversationOptions([
          convo("Tell me about Hearth Mission Control.", "hearthPath"),
          convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath"),
          convo("Tell me about the proof side of the estate.", "lawsPath"),
          convo("Introduce the Characters.", "charactersPath")
        ]);
        renderHandoffs(["compass", "siteGuide"], {}, {});
      });
      return;
    }

    renderLocalNode("recenterNode", { silentVisitor: true });
  }

  function runEnrichedConversation(option) {
    var target = normalizeTarget(option.target);
    var fallbackTarget = target;

    updateStateForSelection(option);

    askBackbrain({
      visitorText: option.label,
      selectedTarget: target,
      selectedLabel: option.label,
      requestMode: "node_enrichment"
    }).then(function (response) {
      renderBackbrainResponse(response, option, {
        fallbackTarget: fallbackTarget,
        fallbackLabel: option.label
      });
    }).catch(function () {
      state.apiFailureCount += 1;
      renderLocalNode(fallbackTarget, { silentVisitor: true });
    });
  }

  function askBackbrain(partialPayload) {
    var payload = buildBackbrainPayload(partialPayload || {});

    return fetch(state.brainEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Jeeves backbrain returned " + response.status);
      }
      return response.json();
    }).then(function (data) {
      if (!data || typeof data !== "object") {
        throw new Error("Jeeves backbrain returned no object.");
      }

      state.apiReady = true;
      state.lastApiResponseAt = new Date().toISOString();
      return data;
    });
  }

  function buildBackbrainPayload(partial) {
    return {
      message: partial.visitorText || "",
      visitorText: partial.visitorText || "",
      selectedTarget: partial.selectedTarget || "",
      selectedLabel: partial.selectedLabel || "",
      requestMode: partial.requestMode || "freeform",

      route: ROUTE,
      activeHostPage: ACTIVE_HOST_PAGE,
      currentRoomContext: CURRENT_ROOM_CONTEXT,
      currentRoomRole: CURRENT_ROOM_ROLE,
      currentRoomPremise: CURRENT_ROOM_PREMISE,
      estateKnowledgeMode: ESTATE_KNOWLEDGE_MODE,
      portalLogic: PORTAL_LOGIC,
      routeAuthority: ROUTE_AUTHORITY,
      livePageAccess: LIVE_PAGE_ACCESS.slice(),
      plannedLivePageAccess: PLANNED_LIVE_PAGE_ACCESS.slice(),

      currentNode: state.currentNode,
      currentEntry: state.currentEntry,
      currentPath: state.currentPath,
      currentTopic: state.currentTopic,
      currentRoomId: state.currentRoomId,
      currentRoomName: state.currentRoomName,
      currentCoordinateName: state.currentCoordinateName,
      currentCardinal: state.currentCardinal,
      currentPlaceType: state.currentPlaceType,
      currentScopeLane: state.currentScopeLane,
      currentVoiceMode: state.currentVoiceMode,

      visitorPosture: "",
      movement: "",
      pathDepth: state.visitedNodes.length,
      routeReadiness: state.lastRouteHints && Object.keys(state.lastRouteHints).length ? 2 : 0,
      loopCount: countRecentTarget(partial.selectedTarget || state.currentNode),
      topicDepth: state.visitorTrail.length,
      revealDepth: state.lastFibonacciDepth || 0,
      depthMode: state.lastApiDepthMode || "",

      expressionContract: getExpressionContract(),
      frontbrainContract: CONTRACT,
      cssContract: getCssContract(),

      allowedTargets: collectAllowedTargets(),
      allowedRoutes: collectAllowedRoutes(),

      sessionTrail: state.visitorTrail.slice(-MAX_TRAIL),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL),
      selectedNodes: state.selectedTargets.slice(-MAX_TRAIL),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL),
      selectedOptionKeys: state.selectedOptionKeys.slice(-MAX_TRAIL),
      returnStack: state.returnStack.slice(-MAX_TRAIL),
      branchStack: state.branchStack.slice(-MAX_TRAIL),
      roomTrail: state.roomTrail.slice(-MAX_TRAIL),

      requestedMode: partial.requestMode || "",
      registryContext: null,
      diagnosticResult: null,

      characterArchetypeAnswers: state.characterArchetypeAnswers.slice(-12),
      characterOverviewDone: state.characterOverviewDone,
      characterProfileViewCount: state.characterProfileViewCount,
      characterRelationshipViews: state.characterRelationshipViews,
      characterCompletionReady: state.characterOverviewDone && state.characterProfileViewCount >= 2
    };
  }

  function renderBackbrainResponse(response, sourceOption, fallback) {
    var normalized = normalizeBackbrainResponse(response);

    if (!normalized.beats.length) {
      renderLocalNode(fallback && fallback.fallbackTarget ? fallback.fallbackTarget : "recenterNode", { silentVisitor: true });
      return;
    }

    state.lastBackbrainFrame = response.narrativeFrame || null;
    state.lastFibonacciDepth = Number(response.fibonacciDepth || 0);
    state.lastFibonacciStage = String(response.fibonacciStage || "");
    state.lastRouteHints = response.routeHints || {};
    state.lastHandoffLabels = response.handoffLabels || {};
    state.lastApiDepthMode = response.depthMode || "";
    state.lastApiContract = response.contract || "";
    state.lastBackbrainAuthorities = {
      routeAuthority: response.routeAuthority || "",
      expressionAuthority: response.expressionAuthority || "",
      blueprintAuthority: response.blueprintAuthority || ""
    };
    state.lastSelectedTarget = response.selectedTarget || (sourceOption ? sourceOption.target : "");
    state.lastSelectedLabel = response.selectedLabel || (sourceOption ? sourceOption.label : "");
    state.lastRequestMode = response.requestMode || (sourceOption ? "node_enrichment" : "freeform");

    if (response.contract) {
      els.root.setAttribute("data-api-contract", response.contract);
    }

    if (response.source) {
      els.root.setAttribute("data-api-source", response.source);
    }

    revealBeats(normalized.beats).then(function () {
      renderConversationOptions(normalized.options);
      renderHandoffs(normalized.handoffs, response.handoffLabels || {}, response.routeHints || {});
      setHouseListening(true);
    });
  }

  function normalizeBackbrainResponse(response) {
    var rawBeats = [];

    if (Array.isArray(response.beats)) rawBeats = response.beats;
    else if (Array.isArray(response.bubbles)) rawBeats = response.bubbles;
    else if (Array.isArray(response.messages)) rawBeats = response.messages;
    else if (typeof response.answer === "string") rawBeats = [response.answer];
    else if (typeof response.text === "string") rawBeats = [response.text];

    var beats = rawBeats.map(cleanPublicText).filter(Boolean);

    var options = Array.isArray(response.options) ? response.options : [];
    var normalizedOptions = normalizeConversationOptions(options);

    var handoffs = Array.isArray(response.handoffs) ? response.handoffs : [];
    var normalizedHandoffs = normalizeHandoffs(handoffs, response.routeHints || {});

    return {
      beats: beats,
      options: normalizedOptions,
      handoffs: normalizedHandoffs
    };
  }

  function renderLocalNode(target, options) {
    var clean = normalizeTarget(target || "intro");
    var opts = options || {};
    var node = getLocalNode(clean);

    if (!node) {
      node = getLocalNode("recenterNode");
    }

    state.currentNode = clean;
    state.currentEntry = clean;
    state.currentPath = clean;
    state.currentTopic = inferTopicFromTarget(clean);

    if (clean === "charactersPath") state.characterOverviewDone = true;
    if (CHARACTER_TARGETS[clean]) {
      state.characterProfileViews[clean] = true;
      state.characterProfileViewCount = Object.keys(state.characterProfileViews).length;
    }
    if (clean === "characterRelationshipsPath") state.characterRelationshipViews += 1;

    if (opts.replace) {
      clearTranscript();
    }

    stampRoot();

    revealBeats((node.beats || []).map(cleanPublicText).filter(Boolean)).then(function () {
      renderConversationOptions(node.options || []);
      renderHandoffs(node.handoffs || [], {}, {});
      setHouseListening(true);
    });
  }

  function getLocalNode(target) {
    var clean = normalizeTarget(target);

    if (LOCAL_NODES[clean]) return LOCAL_NODES[clean];

    if (CHARACTER_TARGETS[clean]) {
      var character = CHARACTER_TARGETS[clean];
      return {
        beats: [
          character.name + " is the " + character.title + ".",
          character.oneLine,
          character.pressure,
          "I can keep this at the character level, show how the Characters relate, or move toward the Character Archetype Mirror."
        ],
        options: [
          convo("Tell me how the Characters relate.", "characterRelationshipsPath"),
          convo("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
          convo("Tell me who I should meet first.", "characterFirstPath"),
          convo("Tell me what Mirrorland is before I enter.", "mirrorlandPath")
        ],
        handoffs: ["characters", "mirrorland"]
      };
    }

    if (target.indexOf("frontier") === 0) {
      return {
        beats: [
          "This is one of the Frontier system paths.",
          "Frontier tests future-facing systems without pretending every future claim is already solved.",
          "The clean rule is that Frontier can imagine and prototype, but Scientific Law and The Lab still have to test and measure."
        ],
        options: [
          convo("Tell me about the future systems.", "frontierSystemsPath"),
          convo("Tell me why Frontier needs proof.", "frontierLawPath"),
          convo("Tell me about Hearth Mission Control.", "hearthPath")
        ],
        handoffs: ["frontier", "scientificLaw", "gauges"]
      };
    }

    if (target.indexOf("scientificLaw") === 0) {
      return LOCAL_NODES.scientificLawPath;
    }

    return null;
  }

  function revealBeats(beats) {
    var queue = Array.isArray(beats) ? beats.slice() : [];
    setTyping(true);
    setHouseListening(false);

    return new Promise(function (resolve) {
      var index = 0;

      function next() {
        if (index >= queue.length) {
          setTyping(false);
          state.rushActive = false;
          state.currentDelayResolve = null;
          resolve();
          return;
        }

        var beat = cleanPublicText(queue[index]);
        if (beat) {
          addAssistantBubble(beat);
        }

        var delay = delayForBeat(beat, index, queue.length);
        index += 1;

        wait(delay).then(next);
      }

      next();
    });
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(finish, ms);

      function finish() {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (state.currentDelayResolve === finish) {
          state.currentDelayResolve = null;
        }
        resolve();
      }

      state.currentDelayResolve = finish;
    });
  }

  function delayForBeat(beat, index, total) {
    if (state.rushActive) return 16;

    var text = String(beat || "");
    var wordCount = text.split(/\s+/).filter(Boolean).length;

    var base = index === 0 ? 900 : 1200;
    var byLength = Math.min(4200, Math.max(1400, wordCount * 260));
    var byPosition = total > 1 && index === total - 1 ? 900 : 0;

    return base + byLength + byPosition;
  }

  function rushReveal() {
    state.rushActive = true;
    if (typeof state.currentDelayResolve === "function") {
      state.currentDelayResolve();
    }
  }

  function renderConversationOptions(options) {
    clearElement(els.optionsPanel);

    var normalized = normalizeConversationOptions(options).slice(0, MAX_VISIBLE_OPTIONS);
    normalized = shapeConversationOptions(normalized);

    if (!normalized.length) {
      els.optionsPanel.setAttribute("hidden", "");
      return;
    }

    els.optionsPanel.removeAttribute("hidden");
    els.optionsPanel.setAttribute("data-panel-kind", "conversation");

    var title = document.createElement("div");
    title.className = "jeeves-panel-title";
    title.textContent = "Choose What To Say";
    els.optionsPanel.appendChild(title);

    normalized.forEach(function (option, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "jeeves-option";
      button.setAttribute("data-jeeves-option", "");
      button.setAttribute("data-target", option.target);
      button.setAttribute("data-type", option.type || "conversation");
      button.setAttribute("data-scope-lane", option.scopeLane || "objective");
      button.setAttribute("data-option-kind", "conversation");
      button.setAttribute("data-option-index", String(index));
      button.textContent = enforceConversationLanguage(option.label, option.target);
      els.optionsPanel.appendChild(button);
    });
  }

  function renderHandoffs(handoffs, handoffLabels, routeHints) {
    clearElement(els.handoffPanel);

    var normalized = normalizeHandoffs(handoffs, routeHints || {}).slice(0, MAX_VISIBLE_HANDOFFS);
    normalized = shapeHandoffs(normalized, handoffLabels || {}, routeHints || {});

    if (!normalized.length) {
      els.handoffPanel.setAttribute("hidden", "");
      return;
    }

    els.handoffPanel.removeAttribute("hidden");
    els.handoffPanel.setAttribute("data-panel-kind", "handoff");

    var title = document.createElement("div");
    title.className = "jeeves-panel-title";
    title.textContent = "Guided House Handoffs";
    els.handoffPanel.appendChild(title);

    normalized.forEach(function (handoff, index) {
      if (!handoff.href || handoff.href === "#") return;

      var link = document.createElement("a");
      link.className = "jeeves-route-option";
      link.setAttribute("data-jeeves-route-option", "");
      link.setAttribute("data-route-id", handoff.routeId);
      link.setAttribute("data-href", handoff.href);
      link.setAttribute("data-route-index", String(index));
      link.href = handoff.href;
      link.textContent = enforceRouteLanguage(handoff.label, handoff.routeId);
      els.handoffPanel.appendChild(link);
    });

    if (!els.handoffPanel.querySelector("[data-jeeves-route-option]")) {
      els.handoffPanel.setAttribute("hidden", "");
    }
  }

  function normalizeConversationOptions(options) {
    if (!Array.isArray(options)) return [];

    var seen = {};
    var result = [];

    options.forEach(function (item) {
      if (!item || typeof item !== "object") return;

      var target = normalizeTarget(item.target || "");
      if (!target) return;
      if (looksLikeRouteTarget(target)) return;

      var type = item.type || "conversation";
      if (type === "route" || type === "handoff") return;

      var label = item.label || CONVERSATION_LABELS[target] || "Tell me more.";
      var normalized = {
        label: enforceConversationLanguage(label, target),
        target: target,
        type: isControlTarget(target) ? "control" : normalizeOptionType(type),
        scopeLane: item.scopeLane || (isNarrativeTarget(target) ? "narrative" : "objective")
      };

      var key = normalized.target + "::" + normalized.label;
      if (seen[key]) return;
      seen[key] = true;
      result.push(normalized);
    });

    return result;
  }

  function normalizeHandoffs(handoffs, routeHints) {
    if (!Array.isArray(handoffs)) return [];

    var seen = {};
    var result = [];

    handoffs.forEach(function (routeId) {
      var route = normalizeRouteId(routeId);
      if (!route) return;

      var href = (routeHints && routeHints[route]) || LOCAL_ROUTE_HINTS[route] || "";
      if (!href) return;

      var label = LOCAL_HANDOFF_LABELS[route] || route;
      var key = route + "::" + href;
      if (seen[key]) return;
      seen[key] = true;

      result.push({
        routeId: route,
        href: href,
        label: enforceRouteLanguage(label, route)
      });
    });

    return result;
  }

  function shapeConversationOptions(options) {
    var expression = getExpression();
    if (!expression || typeof expression.shapeOptions !== "function") return options;

    try {
      var shaped = expression.shapeOptions(options.slice(), {
        panel: "conversation",
        contract: CONTRACT,
        currentRoomContext: CURRENT_ROOM_CONTEXT,
        currentRoomRole: CURRENT_ROOM_ROLE,
        currentRoomPremise: CURRENT_ROOM_PREMISE
      });

      if (!Array.isArray(shaped)) return options;

      return shaped.map(function (item, index) {
        var base = options[index] || {};
        return {
          label: item.label || base.label,
          target: normalizeTarget(item.target || base.target),
          type: item.type || base.type || "conversation",
          scopeLane: item.scopeLane || base.scopeLane || "objective"
        };
      }).filter(function (item) {
        return item.target && !looksLikeRouteTarget(item.target);
      });
    } catch (_error) {
      return options;
    }
  }

  function shapeHandoffs(handoffs, handoffLabels, routeHints) {
    var expression = getExpression();

    return handoffs.map(function (handoff) {
      var label = handoffLabels[handoff.routeId] || handoff.label || LOCAL_HANDOFF_LABELS[handoff.routeId] || handoff.routeId;

      if (expression && typeof expression.shapeRouteLabel === "function") {
        try {
          label = expression.shapeRouteLabel(label, {
            routeId: handoff.routeId,
            href: handoff.href,
            panel: "handoff",
            contract: CONTRACT
          }) || label;
        } catch (_error) {
          label = handoff.label;
        }
      }

      return {
        routeId: handoff.routeId,
        href: (routeHints && routeHints[handoff.routeId]) || handoff.href,
        label: enforceRouteLanguage(label, handoff.routeId)
      };
    }).filter(function (handoff) {
      return handoff.routeId && handoff.href;
    });
  }

  function enforceConversationLanguage(label, target) {
    var clean = cleanPublicText(label || "");
    var fallback = CONVERSATION_LABELS[target] || "";

    if (!clean) clean = fallback || "Tell me more.";

    if (/^(open|visit|enter|explore|launch|go to)\b/i.test(clean)) {
      clean = fallback || makeTellMeLabel(target);
    }

    if (!hasAnyPrefix(clean, CONVERSATION_LANGUAGE_PREFIXES) && !/^(who|what|why|which|how|where|when)\b/i.test(clean) && !/^(ask|re-center|return|start|give me|let’s change)\b/i.test(clean)) {
      clean = fallback || makeTellMeLabel(target);
    }

    return cleanPublicText(clean);
  }

  function enforceRouteLanguage(label, routeId) {
    var clean = cleanPublicText(label || "");
    var fallback = LOCAL_HANDOFF_LABELS[routeId] || "";

    if (!clean) clean = fallback || "Open " + titleFromKey(routeId);

    if (!hasAnyPrefix(clean, ROUTE_LANGUAGE_PREFIXES)) {
      clean = fallback || "Open " + titleFromKey(routeId);
    }

    return cleanPublicText(clean);
  }

  function hasAnyPrefix(text, prefixes) {
    var value = String(text || "").toLowerCase();
    return prefixes.some(function (prefix) {
      return value.indexOf(prefix.toLowerCase()) === 0;
    });
  }

  function makeTellMeLabel(target) {
    return "Tell me about " + titleFromKey(target) + ".";
  }

  function titleFromKey(key) {
    return String(key || "")
      .replace(/Path$/g, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, function (char) {
        return char.toUpperCase();
      });
  }

  function normalizeOptionType(type) {
    if (type === "topic" || type === "calibration" || type === "back" || type === "control") return type;
    return "conversation";
  }

  function normalizeRouteId(routeId) {
    var clean = String(routeId || "").trim();
    if (!clean) return "";
    if (clean === "worldGate" || clean === "globeWindow" || clean === "interactiveNarrative") return "mirrorland";
    if (clean === "book") return "nineSummits";
    return clean;
  }

  function normalizeTarget(target) {
    var clean = String(target || "").trim();

    var aliases = {
      worldPath: "mirrorlandPath",
      worldGatePath: "atriumPath",
      globeWindowPath: "mirrorlandPath",
      characterMirrorPath: "characterArchetypeMirrorPath",
      characterMirrorQuestionOne: "characterArchetypeQuestionOne",
      characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
      characterMirrorQuestionThree: "characterArchetypeQuestionThree",
      characterMirrorResult: "characterArchetypeResult",
      characterFactionsPath: "characterRelationshipsPath",
      bookPath: "nineSummitsBookPath",
      missionControlPath: "hearthPath",
      hearthMissionControlPath: "hearthPath",
      windowWithinWindowPath: "hearthPath",
      hearthWindowPath: "hearthPath"
    };

    return aliases[clean] || clean;
  }

  function looksLikeRouteTarget(target) {
    return !!LOCAL_ROUTE_HINTS[target] && target.indexOf("Path") === -1;
  }

  function isControlTarget(target) {
    return [
      "recenterNode",
      "loopRecovery",
      "cleanDoor",
      "switchTopics",
      "sharpQuestion",
      "returnFork",
      "restartFork",
      "priorTopicReturnPath",
      "originReturnPath"
    ].indexOf(normalizeTarget(target)) !== -1;
  }

  function convo(label, target, type) {
    return {
      label: label || CONVERSATION_LABELS[target] || "Tell me more.",
      target: normalizeTarget(target),
      type: type || "conversation",
      scopeLane: isNarrativeTarget(target) ? "narrative" : "objective",
      optionKind: "conversation"
    };
  }

  function isNarrativeTarget(target) {
    var clean = normalizeTarget(target);
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
    ].indexOf(clean) !== -1;
  }

  function inferTopicFromTarget(target) {
    var clean = normalizeTarget(target);
    if (clean.indexOf("character") === 0 || clean === "charactersPath") return "characters";
    if (clean.indexOf("scientificLaw") === 0 || clean === "lawsPath") return "proof";
    if (clean.indexOf("frontier") === 0) return "frontier";
    if (clean.indexOf("hearth") === 0) return "hearth";
    if (clean === "mirrorlandPath" || clean === "atriumPath" || clean === "atlasPath" || clean === "audraliaPath" || clean === "ziontsPath" || clean === "hEarthPath") return "mirrorland";
    if (clean === "seanPath") return "sean";
    if (clean === "underdogPath") return "underdog";
    if (clean.indexOf("nineSummits") === 0) return "summits";
    if (clean === "diagnosticPath") return "diagnostic";
    return "orientation";
  }

  function updateStateForSelection(option) {
    var target = normalizeTarget(option.target);
    state.returnStack.push(state.currentNode);
    state.returnStack = state.returnStack.slice(-MAX_TRAIL);

    state.selectedTargets.push(target);
    state.selectedTargets = state.selectedTargets.slice(-MAX_TRAIL);

    state.selectedOptionKeys.push(target + "::" + cleanPublicText(option.label));
    state.selectedOptionKeys = state.selectedOptionKeys.slice(-MAX_TRAIL);

    state.visitedNodes.push(target);
    state.visitedNodes = state.visitedNodes.slice(-MAX_TRAIL);

    state.visitorTrail.push(cleanPublicText(option.label));
    state.visitorTrail = state.visitorTrail.slice(-MAX_TRAIL);

    state.currentNode = target;
    state.currentEntry = target;
    state.currentPath = target;
    state.currentTopic = inferTopicFromTarget(target);

    if (target === "charactersPath") state.characterOverviewDone = true;
    if (target === "characterRelationshipsPath") state.characterRelationshipViews += 1;
    if (CHARACTER_TARGETS[target]) {
      state.characterProfileViews[target] = true;
      state.characterProfileViewCount = Object.keys(state.characterProfileViews).length;
    }

    stampRoot();
  }

  function countRecentTarget(target) {
    if (!target) return 0;
    var clean = normalizeTarget(target);
    return state.selectedTargets.filter(function (item) {
      return item === clean;
    }).length;
  }

  function collectAllowedTargets() {
    var set = {};

    Object.keys(CONVERSATION_LABELS).forEach(function (target) {
      set[target] = true;
    });

    Object.keys(LOCAL_NODES).forEach(function (target) {
      set[target] = true;
    });

    Object.keys(CHARACTER_TARGETS).forEach(function (target) {
      set[target] = true;
    });

    state.selectedTargets.forEach(function (target) {
      set[target] = true;
    });

    return Object.keys(set);
  }

  function collectAllowedRoutes() {
    return Object.keys(LOCAL_ROUTE_HINTS);
  }

  function clearTranscript() {
    clearElement(els.transcript);
  }

  function clearElement(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function hideInteractivePanels() {
    clearElement(els.optionsPanel);
    clearElement(els.handoffPanel);
    els.optionsPanel.setAttribute("hidden", "");
    els.handoffPanel.setAttribute("hidden", "");
  }

  function addVisitorBubble(text) {
    var bubble = document.createElement("div");
    bubble.className = "jeeves-bubble jeeves-bubble-user";
    bubble.setAttribute("data-jeeves-bubble", "user");
    bubble.textContent = cleanPublicText(text);
    els.transcript.appendChild(bubble);
    scrollTranscript();
  }

  function addAssistantBubble(text) {
    var bubble = document.createElement("div");
    bubble.className = "jeeves-bubble jeeves-bubble-assistant";
    bubble.setAttribute("data-jeeves-bubble", "assistant");
    bubble.textContent = cleanPublicText(text);
    els.transcript.appendChild(bubble);
    scrollTranscript();
  }

  function addAssistantSystemBubble(text) {
    var bubble = document.createElement("div");
    bubble.className = "jeeves-bubble jeeves-bubble-system";
    bubble.setAttribute("data-jeeves-bubble", "system");
    bubble.textContent = cleanPublicText(text);
    els.transcript.appendChild(bubble);
    scrollTranscript();
  }

  function scrollTranscript() {
    try {
      els.transcript.scrollTop = els.transcript.scrollHeight;
    } catch (_error) {}
  }

  function setTyping(value) {
    state.isTyping = Boolean(value);
    if (els.root) els.root.setAttribute("data-jeeves-typing", state.isTyping ? "true" : "false");
    updateStatus();
  }

  function setHouseListening(value) {
    state.houseListening = Boolean(value);
    if (els.root) els.root.setAttribute("data-house-listening", state.houseListening ? "true" : "false");
    updateStatus();
  }

  function updateStatus() {
    if (!els.status) return;

    if (state.isTyping) {
      els.status.textContent = "Jeeves is speaking. Tap the chamber to hurry him.";
      els.status.setAttribute("data-state", "typing");
      return;
    }

    if (state.houseListening) {
      els.status.textContent = "The house is listening.";
      els.status.setAttribute("data-state", "listening");
      return;
    }

    els.status.textContent = "The house is holding.";
    els.status.setAttribute("data-state", "holding");
  }

  function cleanPublicText(text) {
    var value = String(text || "")
      .replace(/\s+/g, " ")
      .replace(/```/g, "")
      .trim();

    var expression = getExpression();
    if (expression && typeof expression.sanitizePublicText === "function") {
      try {
        value = expression.sanitizePublicText(value, {
          contract: CONTRACT,
          currentRoomContext: CURRENT_ROOM_CONTEXT,
          currentRoomRole: CURRENT_ROOM_ROLE,
          currentRoomPremise: CURRENT_ROOM_PREMISE
        }) || value;
      } catch (_error) {}
    }

    return value;
  }

  function getExpression() {
    return (
      window.HEARTH &&
      window.HEARTH.JEEVES &&
      (window.HEARTH.JEEVES.expression || window.HEARTH.JEEVES_EXPRESSION)
    ) || window.JEEVES_EXPRESSION || null;
  }

  function getExpressionContract() {
    var expression = getExpression();
    if (!expression) return "";
    return expression.contract || expression.CONTRACT || "";
  }

  function getCssContract() {
    var node = document.querySelector("[data-jeeves-css-contract]");
    return node ? node.getAttribute("data-jeeves-css-contract") || "" : "";
  }

  function exposeApi() {
    var api = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      state: state,
      runNode: function (target) {
        renderLocalNode(target, { silentVisitor: true });
      },
      ask: function (text) {
        addVisitorBubble(text);
        hideInteractivePanels();
        return askBackbrain({
          visitorText: text,
          selectedTarget: "",
          selectedLabel: "",
          requestMode: "freeform"
        }).then(function (response) {
          renderBackbrainResponse(response, null, {
            fallbackTarget: "sharpQuestion",
            fallbackLabel: text
          });
          return response;
        });
      },
      enrich: function (target, label) {
        return runEnrichedConversation({
          target: target,
          label: label || CONVERSATION_LABELS[target] || "Tell me more.",
          type: "conversation",
          scopeLane: isNarrativeTarget(target) ? "narrative" : "objective"
        });
      },
      recenter: function () {
        renderLocalNode("recenterNode", { silentVisitor: true });
      },
      rush: rushReveal,
      setBrainEndpoint: function (endpoint) {
        if (endpoint) state.brainEndpoint = endpoint;
      }
    };

    window.HEARTH.JEEVES.frontbrain = api;
    window.HEARTH.JEEVES.engine = api;
    window.JEEVES_ENGINE = api;
    window.__HEARTH_JEEVES_FRONTBRAIN_LOADED__ = true;
    window.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    window.__HEARTH_JEEVES_ENGINE_ROUTE__ = ROUTE;
    window.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
    window.__HEARTH_JEEVES_FRONTBRAIN_CONTRACT__ = CONTRACT;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
