// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_FORK_BRIDGE_RENDERER_API_NORTH_COMPATIBLE_TNT_v24
// Full-file replacement.
// Browser-side only.
// Center / Frontbrain runtime.
// Owns visible Jeeves state, button behavior, house-listening state, tap-to-rush,
// slow reveal pacing, API enrichment calls, local fallback, prepared-door rendering,
// fork-bridge rendering, traversal-control rendering, and final route authority.
// Does not own secure model bridge, deep canon storage, moderation, Brain depth,
// permanent public voice canon, or final Expression bridge language.
// Strategy:
// - API / North owns depth and knowledge.
// - Expression owns entrance forks, intermittent forks, threshold language,
//   transition bridges, forward/return/parallel bridge phrasing.
// - JS renders the bridge, preserves timing, carries the click, calls API,
//   and executes final route movement.

(function () {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_FORK_BRIDGE_RENDERER_API_NORTH_COMPATIBLE_TNT_v24";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_TRANSITORY_ENTRY_GATE_API_ANCHOR_TIMING_PRESERVED_PUBLIC_LANGUAGE_TNT_v23";

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
  var MAX_VISIBLE_OPTIONS = 5;
  var MAX_VISIBLE_ARCHETYPE_OPTIONS = 4;
  var MAX_VISIBLE_TRAVERSAL_CONTROLS = 3;
  var MAX_VISIBLE_HANDOFFS = 8;

  var OPTION_KIND = {
    ARCHETYPE: "archetype_answer",
    CONVERSATION: "conversation",
    FORWARD: "forward",
    RETURN: "return",
    PARALLEL: "parallel",
    CONTROL: "control",
    ROUTE: "route"
  };

  var BRIDGE_MOMENT = {
    ENTRANCE: "entrance_fork",
    BEFORE_KNOWLEDGE: "before_knowledge",
    AFTER_KNOWLEDGE: "after_knowledge",
    RECENTER: "recenter_fork",
    RETURN: "return_fork",
    PARALLEL: "parallel_crossing",
    PREPARED_DOOR: "prepared_door"
  };

  var CONVERSATION_LANGUAGE_PREFIXES = [
    "Tell me about",
    "Explain",
    "Show me why",
    "Help me understand",
    "Show me how",
    "Which Character Archetype",
    "Begin",
    "Continue",
    "Frame",
    "Reveal",
    "Clarify",
    "Complete",
    "Prepare",
    "Start",
    "Trace",
    "Orient",
    "Introduce",
    "Stay with",
    "Return",
    "Cross",
    "Enter",
    "Open beside",
    "Move toward",
    "Let me"
  ];

  var ROUTE_LANGUAGE_PREFIXES = [
    "Open",
    "Go to",
    "Visit",
    "Enter",
    "Launch"
  ];

  var ENTRY_GATE_TARGETS = {
    intro: true,
    askFirst: true,
    whereToStart: true,
    recenterNode: true,
    loopRecovery: true,
    cleanDoor: true,
    switchTopics: true,
    sharpQuestion: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturnPath: true,
    originReturnPath: true
  };

  var FORK_TARGETS = {
    intro: true,
    whereToStart: true,
    recenterNode: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturnPath: true,
    originReturnPath: true,
    cleanDoor: true,
    loopRecovery: true,
    switchTopics: true,
    sharpQuestion: true
  };

  var PUBLIC_LANGUAGE_REPLACEMENTS = [
    { pattern: /\bGuided House Handoffs\b/gi, value: "Prepared Doors" },
    { pattern: /\bHandoffs\b/g, value: "Prepared Doors" },
    { pattern: /\bhandoffs\b/g, value: "prepared doors" },
    { pattern: /\bHandoff\b/g, value: "Prepared Door" },
    { pattern: /\bhandoff\b/g, value: "prepared door" },
    { pattern: /\bscope\b/gi, value: "frame" },
    { pattern: /\broute movement\b/gi, value: "guided movement" },
    { pattern: /\bsystem lanes\b/gi, value: "system paths" },
    { pattern: /\blanes\b/gi, value: "paths" },
    { pattern: /\blane\b/gi, value: "path" },
    { pattern: /\bmenu\b/gi, value: "flat list" },
    { pattern: /\bvisitor\b/gi, value: "you" },
    { pattern: /\bpage\b/gi, value: "chamber" },
    { pattern: /\blocal\b/gi, value: "close at hand" },
    { pattern: /\bAPI\b/g, value: "deeper answer path" },
    { pattern: /\bDOM\b/g, value: "visible interface" },
    { pattern: /\bbrowser\b/gi, value: "visible side" },
    { pattern: /\bserver\b/gi, value: "deeper side" },
    { pattern: /\bserver-side\b/gi, value: "deeper house layer" },
    { pattern: /\bfrontbrain\b/gi, value: "visible side" },
    { pattern: /\bbackbrain\b/gi, value: "deeper side" },
    { pattern: /\bbackend\b/gi, value: "deeper side" },
    { pattern: /\bfrontend\b/gi, value: "visible side" },
    { pattern: /\bpayload\b/gi, value: "answer" },
    { pattern: /\bcontract\b/gi, value: "governing mark" },
    { pattern: /\bexpression engine\b/gi, value: "fork voice" },
    { pattern: /\bexpression payload\b/gi, value: "fork answer" },
    { pattern: /\broute lane\b/gi, value: "path" },
    { pattern: /\bscope lane\b/gi, value: "path" },
    { pattern: /\bregistry\b/gi, value: "guide" }
  ];

  var META_LANGUAGE_REPLACEMENTS = [
    {
      pattern: /I know the estate by its blueprint\.\s*I do not pretend to be stationed inside every page at once\.\s*For now, this is my live room\./gi,
      value: "From Hearth Mission Control, I can help you define the next question, complete the part of the picture in front of you, or prepare the right door."
    },
    { pattern: /I do not pretend to be stationed inside every page at once\./gi, value: "" },
    { pattern: /I am aware enough to know that I'?m not in all (?:of )?the rooms at once\.?/gi, value: "" },
    { pattern: /I only know this by blueprint\.?/gi, value: "" },
    { pattern: /For now, this is my live room\.?/gi, value: "" },
    {
      pattern: /without claiming to be mounted inside every page at once/gi,
      value: "while keeping the next door properly sequenced"
    },
    {
      pattern: /without pretending the visitor has already crossed into that deeper place/gi,
      value: "without forcing you across the threshold too early"
    },
    { pattern: /mounted inside every page/gi, value: "stationed beyond this chamber" },
    { pattern: /live room/gi, value: "present chamber" }
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
    characters: "Open the Characters Hall",
    controlRoom: "Open the Control Room",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "Open This Underdog"
  };

  var CONVERSATION_LABELS = {
    websitePath: "Frame how the estate is built.",
    skepticPlain: "Explain it plainly first.",
    proofPath: "Clarify what makes this trustworthy.",
    diagnosticPath: "Frame the self-reflection room.",
    mirrorlandPath: "Frame Mirrorland.",
    atriumPath: "Frame the South Gate threshold.",
    atlasPath: "Reveal the Mirrorland map logic.",
    charactersPath: "Begin the Character path.",
    characterIdentityPath: "Reveal the Character role map.",
    compassPath: "Orient the first path.",
    whereToStart: "Orient the first path.",
    siteGuidePath: "Frame how the rooms relate.",
    lawsPath: "Frame the proof path.",
    scientificLawPath: "Show how claims become testable.",
    scientificLawTheoryPath: "Clarify Theory.",
    scientificLawEvidencePath: "Clarify Evidence.",
    scientificLawMeasurePath: "Clarify Measure.",
    scientificLawLimitsPath: "Clarify Limits.",
    scientificLawRoutePath: "Reveal the testing route.",
    scientificLawLadderPath: "Reveal the claim ladder.",
    scientificLawTermsPath: "Clarify the proof terms.",
    gaugesPath: "Frame the status room.",
    seanPath: "Frame the creator path.",
    underdogPath: "Frame This Underdog.",
    productsPath: "Frame what can be used or carried.",
    nineSummitsPath: "Frame the value road.",
    nineSummitsBookPath: "Frame The Nine Summits of Love.",
    hearthPath: "Frame Hearth Mission Control.",
    hearthFacilityPath: "Clarify Hearth as Mission Control.",
    hearthConstructPath: "Explain the window within the window.",
    hearthFrontierPath: "Show why Hearth is near Frontier.",
    hearthLawPath: "Show why Hearth answers to proof.",
    hEarthPath: "Frame the survival path.",
    ziontsPath: "Frame the consequence road.",
    audraliaPath: "Frame Audralia.",
    audraliaWorldroomPath: "Reveal Audralia’s visible worldroom.",
    controlCockpitPath: "Show how Audralia becomes readable.",
    frontierPath: "Frame Frontier.",
    frontierSystemsPath: "Reveal the future systems.",
    frontierEnergyPath: "Clarify Energy.",
    frontierWaterPath: "Clarify Water.",
    frontierWastePath: "Clarify Waste.",
    frontierClosedLoopPath: "Clarify Closed Loop.",
    frontierInfrastructurePath: "Clarify Infrastructure.",
    frontierLatticePath: "Clarify Lattice.",
    frontierUrbanPath: "Clarify Urban.",
    frontierManualPath: "Clarify Manual.",
    frontierShimmerPath: "Clarify Shimmer.",
    frontierTrajectoryPath: "Clarify Trajectory.",
    frontierVisionPath: "Clarify Vision.",
    frontierLawPath: "Show why Frontier needs proof.",
    frontierCharactersPath: "Reveal who carries Frontier pressure.",
    futureProfilePath: "Frame the future profile.",
    mirrorMePath: "Frame the mirror path.",
    characterRelationshipsPath: "Reveal the Character relationship layer.",
    characterTensionsPath: "Reveal the conflict layer.",
    characterMotivesPath: "Reveal the motive layer.",
    characterStoryPressurePath: "Show why the Characters matter.",
    characterFirstPath: "Begin the first Character path.",
    characterAurenValePath: "Begin with Auren Vale.",
    characterDextrionPath: "Begin with Dextrion.",
    characterAlaricPath: "Begin with Alaric.",
    characterTarianPath: "Begin with Tarian.",
    characterElaraPath: "Begin with Elara.",
    characterSorenPath: "Begin with Soren.",
    characterJeevesPath: "Begin with Jeeves.",
    characterRemoteTeamPath: "Begin with the Remote Team.",
    characterArchetypeMirrorPath: "Prepare the Character Archetype Mirror.",
    selfLearningPath: "Reveal my behavior under pressure.",
    characterArchetypeQuestionOne: "Start the first mirror question.",
    characterArchetypeQuestionTwo: "Continue to the second mirror question.",
    characterArchetypeQuestionThree: "Continue to the third mirror question.",
    characterArchetypeResult: "Reveal the reflective match.",
    recenterNode: "Re-center me.",
    loopRecovery: "Re-center the loop.",
    cleanDoor: "Give me the cleanest next door.",
    switchTopics: "Change the room path.",
    sharpQuestion: "Ask me a sharper question.",
    returnFork: "Return to the First Fork.",
    restartFork: "Start over.",
    priorTopicReturnPath: "Return to the prior topic.",
    originReturnPath: "Return to the origin conversation."
  };

  var ADJACENT_ROOM_FALLBACKS = {
    seanPath: {
      target: "underdogPath",
      label: "Cross into This Underdog.",
      reason: "Sean’s creator path touches the inner underdog voice that formed through transition."
    },
    underdogPath: {
      target: "seanPath",
      label: "Cross back to Sean.",
      reason: "This Underdog connects back to the human builder behind the estate."
    },
    charactersPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      reason: "The Characters carry Mirrorland pressure in personal form."
    },
    characterIdentityPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      reason: "The role map belongs to the larger world pressure."
    },
    characterStoryPressurePath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      reason: "The Character pressure comes from the world that made those roles necessary."
    },
    mirrorlandPath: {
      target: "charactersPath",
      label: "Cross into the Characters Hall.",
      reason: "Mirrorland becomes readable when its pressure becomes personal."
    },
    atlasPath: {
      target: "charactersPath",
      label: "Cross into the Characters Hall.",
      reason: "The map touches the people who carry its consequences."
    },
    lawsPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      reason: "The Law Library opens into the chamber where claims become testable."
    },
    scientificLawPath: {
      target: "frontierPath",
      label: "Cross into Frontier.",
      reason: "Testable claims need a future-facing yard where they can be applied."
    },
    gaugesPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      reason: "Readiness gauges require a proof path behind them."
    },
    frontierPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      reason: "Frontier can build only what proof can keep honest."
    },
    frontierSystemsPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      reason: "Future systems need a testing chamber before they can be trusted."
    },
    hearthPath: {
      target: "frontierPath",
      label: "Cross into Frontier.",
      reason: "Hearth Mission Control sits near the yard where future systems are tested."
    },
    hearthConstructPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      reason: "The window within the window looks toward the larger future-facing field."
    },
    ziontsPath: {
      target: "characterSorenPath",
      label: "Cross toward the Boundary Keeper.",
      reason: "Consequence requires a boundary keeper who refuses false restoration."
    },
    audraliaPath: {
      target: "frontierPath",
      label: "Cross into Frontier.",
      reason: "Audralia’s possibility touches the system yard where future infrastructure is tested."
    },
    hEarthPath: {
      target: "frontierPath",
      label: "Cross into Frontier.",
      reason: "Survival becomes systems work when the future has to hold."
    },
    nineSummitsPath: {
      target: "underdogPath",
      label: "Cross into This Underdog.",
      reason: "The value road touches the inner voice that learned to climb."
    },
    diagnosticPath: {
      target: "characterArchetypeMirrorPath",
      label: "Cross into the Character Archetype Mirror.",
      reason: "Self-reflection becomes clearer when pressure behavior has a story mirror."
    }
  };

  var CHARACTER_TARGETS = {
    characterAurenValePath: {
      name: "Auren Vale",
      title: "Sanctuary Builder",
      roleName: "Sanctuary Builder",
      pressureName: "sanctuary",
      pressure: "Auren carries the pressure of sanctuary: every life protected inside the manor makes the sanctuary harder to hide.",
      oneLine: "Auren protects life inside the manor, and that protection turns shelter into risk."
    },
    characterDextrionPath: {
      name: "Dextrion",
      title: "Earth-Side Originator",
      roleName: "Earth-Side Originator",
      pressureName: "origin",
      pressure: "Dextrion carries the pressure of origin: every one-way consequence traces back to the crossing he opened.",
      oneLine: "Dextrion opened the crossing from Earth, and the cost of that opening remains attached to him."
    },
    characterAlaricPath: {
      name: "Alaric",
      title: "Field Navigator",
      roleName: "Field Navigator",
      pressureName: "route",
      pressure: "Alaric carries the pressure of route: waiting for proof can close the only safe path.",
      oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe."
    },
    characterTarianPath: {
      name: "Tarian",
      title: "Water Anchor",
      roleName: "Water Anchor",
      pressureName: "survival",
      pressure: "Tarian carries the pressure of survival: no future matters if the body cannot continue.",
      oneLine: "Tarian keeps the future physical, because endurance is not an abstract requirement."
    },
    characterElaraPath: {
      name: "Elara",
      title: "Signal Bearer",
      roleName: "Signal Bearer",
      pressureName: "signal",
      pressure: "Elara carries the pressure of signal: the future has to be visible before anyone can move toward it.",
      oneLine: "Elara makes what is coming visible, but every signal risks exposure."
    },
    characterSorenPath: {
      name: "Soren",
      title: "Boundary Keeper",
      roleName: "Boundary Keeper",
      pressureName: "boundary",
      pressure: "Soren carries the pressure of boundary: hidden damage only turns Mirrorland into another ZIONTS.",
      oneLine: "Soren refuses false restoration because comfort cannot be allowed to hide consequence."
    },
    characterJeevesPath: {
      name: "Jeeves",
      title: "Manor Interface",
      roleName: "Manor Interface",
      pressureName: "sequence",
      pressure: "Jeeves carries the pressure of sequence: too much truth breaks the path, and too little sends the visitor into the wrong room.",
      oneLine: "Jeeves sequences truth so you can move without losing the estate’s logic."
    },
    characterRemoteTeamPath: {
      name: "Remote Team",
      title: "Distributed Response Unit",
      roleName: "Distributed Response Unit",
      pressureName: "distribution",
      pressure: "The Remote Team carries the pressure of distribution: if survival cannot leave the manor, the manor becomes only a bunker.",
      oneLine: "The Remote Team carries help beyond the house, where survival must become distributable."
    }
  };

  var LOCAL_NODES = {
    intro: {
      roomId: "hearthMissionControl",
      beats: [
        "Welcome. I’m Jeeves.",
        "I am stationed in Hearth Mission Control — the window within the window.",
        "Hearth gives us the control view into the larger estate path.",
        "From here, I can help you define the next question, complete the part of the picture in front of you, or prepare the right door."
      ],
      options: [
        convo("Frame Hearth Mission Control.", "hearthPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Begin the Character path.", "charactersPath"),
        convo("Frame the proof path.", "lawsPath"),
        convo("Frame the creator path.", "seanPath")
      ],
      handoffs: ["hearth", "mirrorland", "frontier"]
    },
    whereToStart: {
      beats: [
        "There are three clean directions from Hearth Mission Control.",
        "Proof clarifies what can be tested.",
        "Story clarifies what the future is showing.",
        "Systems clarify what the future needs."
      ],
      options: [
        convo("Frame the proof path.", "lawsPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Frame Frontier.", "frontierPath"),
        convo("Frame Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["laws", "scientificLaw", "mirrorland", "frontier"]
    },
    hearthPath: {
      beats: [
        "Hearth is Mission Control — the window within the window.",
        "Mirrorland is the larger future-facing field. Hearth is the inner control view where the estate path can be oriented before you move deeper.",
        "Its role is coordination: define the question, complete the current frame, and prepare the right door when the next door is earned."
      ],
      options: [
        convo("Explain the window within the window.", "hearthConstructPath"),
        convo("Clarify Hearth as Mission Control.", "hearthFacilityPath"),
        convo("Show why Hearth is near Frontier.", "hearthFrontierPath"),
        convo("Show why Hearth answers to proof.", "hearthLawPath")
      ],
      handoffs: ["hearth", "frontier", "scientificLaw", "mirrorland"]
    },
    hearthFacilityPath: {
      beats: [
        "Hearth coordinates the estate’s working view.",
        "It does not flatten the house into one flat list. It keeps the current question, the next question, and the next possible door in order.",
        "That is why Hearth sits between world, proof, systems, and guided movement."
      ],
      options: [
        convo("Explain the window within the window.", "hearthConstructPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Frame Frontier.", "frontierPath"),
        convo("Frame the proof path.", "lawsPath")
      ],
      handoffs: ["hearth", "frontier", "scientificLaw"]
    },
    hearthConstructPath: {
      beats: [
        "The window within the window means this chamber is close at hand, but the view is larger than the chamber.",
        "Hearth is the control chamber inside the estate. It looks through portal logic toward future potential without forcing you across the threshold too early.",
        "That lets Jeeves sequence the room before opening the next door."
      ],
      options: [
        convo("Frame Hearth Mission Control.", "hearthPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Show why Hearth answers to proof.", "hearthLawPath")
      ],
      handoffs: ["hearth", "mirrorland", "scientificLaw"]
    },
    mirrorlandPath: {
      beats: [
        "Mirrorland is the larger future-facing window.",
        "It is where possible futures become visible before they become final.",
        "The first frame is the world pressure: consequence, survival, and possibility.",
        "ZIONTS is consequence. H-Earth is survival. Audralia is possibility."
      ],
      options: [
        convo("Reveal the three future roads.", "atlasPath"),
        convo("Begin the Character path.", "charactersPath"),
        convo("Frame Audralia.", "audraliaPath"),
        convo("Frame Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["mirrorland", "audralia", "characters", "hearth"]
    },
    atlasPath: {
      beats: [
        "Atlas Study is the map room for the world-facing side of the estate.",
        "It organizes the first frame before deeper movement begins.",
        "The map does not ask you to choose a door first. It clarifies whether you are looking at consequence, survival, possibility, or coordination."
      ],
      options: [
        convo("Frame the consequence road.", "ziontsPath"),
        convo("Frame the survival path.", "hEarthPath"),
        convo("Frame Audralia.", "audraliaPath"),
        convo("Frame Hearth Mission Control.", "hearthPath")
      ],
      handoffs: ["mirrorland", "zionts", "hEarth", "audralia", "hearth"]
    },
    charactersPath: {
      beats: [
        "The Character path begins with roles, not names.",
        "Mirrorland’s world pressure becomes personal through role functions: protection, origin, route, survival, signal, boundary, sequence, and distribution.",
        "Once those roles are visible, the named Characters can step into frame."
      ],
      options: [
        convo("Reveal the Character role map.", "characterIdentityPath"),
        convo("Show why the Characters matter.", "characterStoryPressurePath"),
        convo("Begin the first Character path.", "characterFirstPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterIdentityPath: {
      beats: [
        "The role map comes first.",
        "A Sanctuary Builder protects shelter. An Earth-Side Originator carries the cost of the crossing. A Field Navigator reads danger before consensus forms.",
        "A Water Anchor keeps survival physical. A Signal Bearer makes the future visible. A Boundary Keeper prevents false restoration.",
        "A Manor Interface sequences the house. A Distributed Response Unit carries survival beyond the manor."
      ],
      options: [
        convo("Begin the first Character path.", "characterFirstPath"),
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterFirstPath: {
      beats: [
        "The first clean reveal is the Sanctuary Builder.",
        "That role answers the first cinematic question: who protects life when the future becomes dangerous?",
        "The name that steps into that role is Auren Vale."
      ],
      options: [
        convo("Begin with Auren Vale.", "characterAurenValePath"),
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters"]
    },
    characterRelationshipsPath: {
      beats: [
        "The Characters connect through the forces their roles answer.",
        "Protection needs origin to explain how the danger began. Origin needs route to decide where movement is still possible. Route needs survival to keep the body in the story.",
        "Signal makes the future visible. Boundary prevents false restoration. Sequence keeps you from entering the wrong door. Distribution carries help beyond the manor."
      ],
      options: [
        convo("Reveal the conflict layer.", "characterTensionsPath"),
        convo("Reveal the motive layer.", "characterMotivesPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
        convo("Begin with Auren Vale.", "characterAurenValePath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterTensionsPath: {
      beats: [
        "The conflict layer is not simple opposition.",
        "It is protection against exposure, origin against consequence, route against uncertainty, survival against exhaustion, signal against invisibility, boundary against false repair, and sequence against confusion.",
        "That gives the Characters narrative purpose before you meet them one by one."
      ],
      options: [
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
        convo("Show why the Characters matter.", "characterStoryPressurePath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterMotivesPath: {
      beats: [
        "Motive comes from the role’s purpose.",
        "A protector acts because shelter can fail. An originator acts because consequence traces backward. A navigator acts because waiting can close the route.",
        "The motive is not decoration. It is the role’s logic under consequence."
      ],
      options: [
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
        convo("Reveal the conflict layer.", "characterTensionsPath"),
        convo("Begin the first Character path.", "characterFirstPath")
      ],
      handoffs: ["characters"]
    },
    characterStoryPressurePath: {
      beats: [
        "The Characters matter because world logic alone is too distant.",
        "A future can be mapped, tested, and measured, but you need role functions to understand who carries what consequence.",
        "That is why the role map appears before the named profiles."
      ],
      options: [
        convo("Reveal the Character role map.", "characterIdentityPath"),
        convo("Begin the first Character path.", "characterFirstPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs: ["characters", "mirrorland"]
    },
    characterArchetypeMirrorPath: {
      beats: [
        "The Character Archetype Mirror is a reflection layer.",
        "It should appear after you understand that the Characters are role functions, not just names.",
        "When it is earned, it asks which Character Archetype your behavior follows under pressure."
      ],
      options: [
        convo("Start the first mirror question.", "characterArchetypeQuestionOne"),
        convo("Reveal the Character role map.", "characterIdentityPath"),
        convo("Frame the self-reflection room.", "diagnosticPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeQuestionOne: {
      beats: [
        "First mirror question:",
        "When pressure rises, do you first protect shelter, explain origin, find the route, stabilize survival, reveal the signal, hold the boundary, sequence the room, or carry help outward?"
      ],
      options: [
        archetype("I protect shelter.", "characterArchetypeQuestionTwo"),
        archetype("I explain origin.", "characterArchetypeQuestionTwo"),
        archetype("I find the route.", "characterArchetypeQuestionTwo"),
        archetype("I hold the boundary.", "characterArchetypeQuestionTwo")
      ],
      handoffs: ["coherenceDiagnostic"]
    },
    characterArchetypeQuestionTwo: {
      beats: [
        "Second mirror question:",
        "When people misunderstand the situation, do you clarify the role, act before consensus, hold the line, or wait until the proof catches up?"
      ],
      options: [
        archetype("I clarify the role.", "characterArchetypeQuestionThree"),
        archetype("I act before consensus.", "characterArchetypeQuestionThree"),
        archetype("I hold the line.", "characterArchetypeQuestionThree"),
        archetype("I wait for proof.", "characterArchetypeQuestionThree")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeQuestionThree: {
      beats: [
        "Third mirror question:",
        "What do you protect first: the person, the system, the truth, the route, the signal, or the future?"
      ],
      options: [
        archetype("I protect the person.", "characterArchetypeResult"),
        archetype("I protect the system.", "characterArchetypeResult"),
        archetype("I protect the truth.", "characterArchetypeResult"),
        archetype("I protect the future.", "characterArchetypeResult")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    characterArchetypeResult: {
      beats: [
        "A clean reflective match needs more than one answer.",
        "This first pass identifies the direction of your pressure behavior, not a permanent label.",
        "The stronger route belongs with the Diagnostic when you are ready to test the pattern more carefully."
      ],
      options: [
        convo("Frame the self-reflection room.", "diagnosticPath"),
        convo("Reveal the Character role map.", "characterIdentityPath"),
        control("Re-center me.", "recenterNode")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    lawsPath: {
      beats: [
        "The proof path begins with the need for discipline.",
        "A claim cannot grow safely unless it can be defined, tested, corrected, limited, and checked again.",
        "Law Library sets boundary. Scientific Law tests the claim. Triple G reads readiness."
      ],
      options: [
        convo("Show how claims become testable.", "scientificLawPath"),
        convo("Frame the status room.", "gaugesPath"),
        convo("Show why Frontier needs proof.", "frontierLawPath"),
        convo("Show why Hearth answers to proof.", "hearthLawPath")
      ],
      handoffs: ["laws", "scientificLaw", "gauges"]
    },
    scientificLawPath: {
      beats: [
        "Scientific Law is the Reality Test chamber.",
        "A claim does not become scientific because it sounds technical.",
        "It becomes scientific when it can be defined, tested, corrected, limited, and checked again."
      ],
      options: [
        convo("Clarify Theory.", "scientificLawTheoryPath"),
        convo("Clarify Evidence.", "scientificLawEvidencePath"),
        convo("Clarify Measure.", "scientificLawMeasurePath"),
        convo("Clarify Limits.", "scientificLawLimitsPath")
      ],
      handoffs: ["scientificLaw", "laws", "gauges"]
    },
    gaugesPath: {
      beats: [
        "Triple G reads Goals, Gauges, and Gaps.",
        "Goals name what the room is trying to become. Gauges show what can be checked. Gaps show what remains unresolved.",
        "That makes the room a readiness surface, not a decorative status display."
      ],
      options: [
        convo("Frame the proof path.", "lawsPath"),
        convo("Show how claims become testable.", "scientificLawPath"),
        convo("Show why Frontier needs proof.", "frontierLawPath")
      ],
      handoffs: ["gauges", "laws", "scientificLaw"]
    },
    frontierPath: {
      beats: [
        "Frontier begins with system demand.",
        "The future needs power, water, waste recovery, closed-loop feedback, infrastructure, lattice structure, urban response, manuals, shimmer logic, trajectory, and vision.",
        "The system paths appear before you choose a specific test yard."
      ],
      options: [
        convo("Reveal the future systems.", "frontierSystemsPath"),
        convo("Clarify Energy.", "frontierEnergyPath"),
        convo("Clarify Water.", "frontierWaterPath"),
        convo("Show why Frontier needs proof.", "frontierLawPath"),
        convo("Frame Hearth Mission Control.", "hearthPath")
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
        convo("Clarify Energy.", "frontierEnergyPath"),
        convo("Clarify Water.", "frontierWaterPath"),
        convo("Clarify Closed Loop.", "frontierClosedLoopPath"),
        convo("Show why Hearth is near Frontier.", "hearthFrontierPath")
      ],
      handoffs: ["frontier", "hearth"]
    },
    seanPath: {
      beats: [
        "The creator path begins with source pressure, not biography.",
        "Sean Mansfield’s life has been shaped by transitions: ups, downs, reversals, recoveries, and turns of every size.",
        "Those crossings molded the person behind the estate, and they gave the work its central instinct: every path has a next door, and every pressure can become a passage."
      ],
      options: [
        convo("Frame This Underdog.", "underdogPath"),
        convo("Frame the value road.", "nineSummitsPath"),
        convo("Frame how the estate is built.", "websitePath")
      ],
      handoffs: ["meetSean", "aboutUnderdog", "nineSummits"]
    },
    underdogPath: {
      beats: [
        "This Underdog is not Sean alone.",
        "It is the inner voice in you that carried pressure before it had language, direction, or use.",
        "The underdog path turns survival into orientation, pressure into voice, and struggle into growth."
      ],
      options: [
        convo("Frame the creator path.", "seanPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
        convo("Frame the value road.", "nineSummitsPath")
      ],
      handoffs: ["aboutUnderdog", "meetSean", "nineSummits"]
    },
    nineSummitsPath: {
      beats: [
        "Nine Summits is the value road.",
        "It turns the human climb into a sequence instead of a slogan.",
        "The path moves through Character, Structure, Balance, Stability, Peace, Joy, Dignity, Free Will, and Love."
      ],
      options: [
        convo("Frame The Nine Summits of Love.", "nineSummitsBookPath"),
        convo("Frame This Underdog.", "underdogPath"),
        convo("Frame the creator path.", "seanPath")
      ],
      handoffs: ["nineSummits", "aboutUnderdog", "meetSean"]
    },
    diagnosticPath: {
      beats: [
        "The Diagnostic is a self-reflection and pattern-assessment room.",
        "It is not medical, mental-health, legal, employment, IQ, or MBTI diagnosis.",
        "Its role is to separate claimed pressure behavior from revealed pressure behavior."
      ],
      options: [
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
        convo("Reveal my behavior under pressure.", "selfLearningPath"),
        convo("Frame the proof path.", "lawsPath")
      ],
      handoffs: ["coherenceDiagnostic", "characters"]
    },
    recenterNode: {
      beats: [
        "We can re-center.",
        "From Hearth Mission Control, the clean directions are proof, Mirrorland, Characters, Frontier, and the creator path."
      ],
      options: [
        convo("Frame the proof path.", "lawsPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Begin the Character path.", "charactersPath"),
        convo("Frame Frontier.", "frontierPath"),
        convo("Frame the creator path.", "seanPath")
      ],
      handoffs: ["compass", "siteGuide", "laws", "mirrorland", "frontier"]
    },
    returnFork: {
      beats: [
        "We are back at the First Fork.",
        "Choose the next frame: proof, story, systems, self-reflection, or source."
      ],
      options: [
        convo("Frame the proof path.", "lawsPath"),
        convo("Frame Mirrorland.", "mirrorlandPath"),
        convo("Frame Frontier.", "frontierPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
        convo("Frame the creator path.", "seanPath")
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
    currentScopeStage: "orientation",
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
    transitionTrail: [],
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
    lastOptionKind: "",
    lastBridgeMoment: "",
    lastBridgeTarget: "",
    lastParallelTarget: "",
    apiReady: false,
    apiFailureCount: 0,
    houseListening: true,
    isTyping: false,
    rushActive: false,
    currentDelayResolve: null,
    characterOverviewDone: false,
    characterRolesRevealed: false,
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
    resolveConfig();
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

  function resolveConfig() {
    var script = document.querySelector("[data-jeeves-js]");
    if (script) {
      var endpoint = script.getAttribute("data-jeeves-api");
      if (endpoint) state.brainEndpoint = endpoint;
    }

    var configNode = document.getElementById("jeevesConversationConfig");
    if (!configNode) return;

    try {
      var config = JSON.parse(configNode.textContent || "{}");
      if (config && config.apiEndpoint) {
        state.brainEndpoint = config.apiEndpoint;
      }
    } catch (_error) {}
  }

  function resolveElements() {
    els.root =
      document.querySelector("[data-jeeves-root]") ||
      document.querySelector("#hearthJeeves") ||
      document.querySelector("#jeevesRoot") ||
      document.querySelector(".jeeves-root") ||
      document.querySelector(".hearth-jeeves") ||
      createRoot();

    els.transcript =
      els.root.querySelector("[data-jeeves-transcript]") ||
      els.root.querySelector("[data-jeeves-thread]") ||
      els.root.querySelector("[data-jeeves-log]") ||
      els.root.querySelector(".jeeves-transcript") ||
      els.root.querySelector(".jeeves-thread") ||
      els.root.querySelector(".jeeves-log") ||
      createSection("jeeves-transcript", "data-jeeves-transcript");

    els.optionsPanel =
      els.root.querySelector("[data-jeeves-options]") ||
      els.root.querySelector("[data-jeeves-prompt-grid]") ||
      els.root.querySelector("[data-jeeves-prompts]") ||
      els.root.querySelector(".jeeves-options") ||
      els.root.querySelector(".jeeves-prompt-grid") ||
      createSection("jeeves-options", "data-jeeves-options");

    els.handoffPanel =
      els.root.querySelector("[data-jeeves-handoffs]") ||
      els.root.querySelector("[data-jeeves-handoff-grid]") ||
      els.root.querySelector(".jeeves-handoffs") ||
      els.root.querySelector(".jeeves-handoff-grid") ||
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
    els.root.setAttribute("data-current-topic", state.currentTopic);
    els.root.setAttribute("data-current-scope-stage", state.currentScopeStage);
    els.root.setAttribute("data-jeeves-typing", state.isTyping ? "true" : "false");
    els.root.setAttribute("data-conversation-route-separation", "active");
    els.root.setAttribute("data-language-separation", "conversation-vs-door");
    els.root.setAttribute("data-api-enrichment", "available");
    els.root.setAttribute("data-expression-fork-bridge", "ready");
    els.root.setAttribute("data-expression-bridge-mode", "entrance-and-intermittent-forks");
    els.root.setAttribute("data-traversal-kinds", [
      OPTION_KIND.ARCHETYPE,
      OPTION_KIND.FORWARD,
      OPTION_KIND.RETURN,
      OPTION_KIND.PARALLEL,
      OPTION_KIND.CONVERSATION,
      OPTION_KIND.ROUTE
    ].join(","));
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

    var target = button.getAttribute("data-target") || button.getAttribute("data-option-target") || "";
    var label = button.textContent || "";
    var type = button.getAttribute("data-type") || button.getAttribute("data-option-type") || "conversation";
    var optionKind = button.getAttribute("data-option-kind") || OPTION_KIND.CONVERSATION;

    var option = {
      label: label,
      target: target,
      type: type,
      scopeLane: button.getAttribute("data-scope-lane") || "objective",
      scopeStage: button.getAttribute("data-scope-stage") || inferScopeStage(target),
      optionKind: optionKind
    };

    if (!target) return;

    addVisitorBubble(label);
    hideInteractivePanels();

    if (isControlTarget(target) || type === "control" || optionKind === OPTION_KIND.RETURN || optionKind === OPTION_KIND.CONTROL) {
      runControlTarget(target, option);
      return;
    }

    runEnrichedConversation(option);
  }

  function handleRouteHandoff(button, event) {
    var href = button.getAttribute("href") || button.getAttribute("data-href") || "";
    var routeId = button.getAttribute("data-route-id") || button.getAttribute("data-option-target") || "";

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
      requestMode: "freeform",
      optionKind: OPTION_KIND.CONVERSATION,
      bridgeMoment: BRIDGE_MOMENT.ENTRANCE
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
      state.transitionTrail = [];
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
      revealBeats(["Ask the sharper version of what you want to understand, and I will keep the answer inside the right room."]).then(function () {
        renderConversationOptions([
          convo("Frame Hearth Mission Control.", "hearthPath"),
          convo("Frame Mirrorland.", "mirrorlandPath"),
          convo("Frame the proof path.", "lawsPath"),
          convo("Begin the Character path.", "charactersPath")
        ], buildDefaultTraversalControls(buildConversationFrame({
          source: "local",
          beats: [],
          options: [],
          handoffs: [],
          routeHints: {},
          handoffLabels: {},
          requestMode: "local_fallback",
          selectedTarget: "sharpQuestion",
          selectedLabel: "Ask me a sharper question."
        })));
        renderHandoffs(["compass", "siteGuide"], {}, {});
      });
      return;
    }

    renderLocalNode("recenterNode", { silentVisitor: true });
  }

  function runEnrichedConversation(option) {
    var target = normalizeTarget(option.target);
    var fallbackTarget = target;
    var optionKind = normalizeOptionKind(option.optionKind || OPTION_KIND.CONVERSATION);

    updateStateForSelection(Object.assign({}, option, {
      target: target,
      optionKind: optionKind
    }));

    var preBridge = buildPreKnowledgeBridge(option, {
      bridgeMoment: optionKind === OPTION_KIND.PARALLEL ? BRIDGE_MOMENT.PARALLEL : BRIDGE_MOMENT.BEFORE_KNOWLEDGE,
      selectedTarget: target,
      selectedLabel: option.label,
      optionKind: optionKind
    });

    var preBridgeBeats = preBridge && Array.isArray(preBridge.beats) ? preBridge.beats.map(cleanPublicText).filter(Boolean) : [];
    var ready = preBridgeBeats.length ? revealBeats(preBridgeBeats) : Promise.resolve();

    ready.then(function () {
      return askBackbrain({
        visitorText: option.label,
        selectedTarget: target,
        selectedLabel: option.label,
        requestMode: "node_enrichment",
        optionKind: optionKind,
        bridgeMoment: optionKind === OPTION_KIND.PARALLEL ? BRIDGE_MOMENT.PARALLEL : BRIDGE_MOMENT.BEFORE_KNOWLEDGE
      });
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
        throw new Error("Jeeves deeper answer path returned " + response.status);
      }
      return response.json();
    }).then(function (data) {
      if (!data || typeof data !== "object") {
        throw new Error("Jeeves deeper answer path returned no object.");
      }

      state.apiReady = true;
      state.lastApiResponseAt = new Date().toISOString();
      return data;
    });
  }

  function buildBackbrainPayload(partial) {
    var selectedTarget = normalizeTarget(partial.selectedTarget || "");
    var optionKind = normalizeOptionKind(partial.optionKind || state.lastOptionKind || OPTION_KIND.CONVERSATION);
    var bridgeMoment = partial.bridgeMoment || state.lastBridgeMoment || "";

    return {
      message: partial.visitorText || "",
      visitorText: partial.visitorText || "",
      selectedTarget: selectedTarget,
      selectedLabel: partial.selectedLabel || "",
      requestMode: partial.requestMode || "freeform",
      optionKind: optionKind,
      bridgeMoment: bridgeMoment,
      movementIntent: inferMovementIntent(optionKind, selectedTarget),

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
      currentScopeStage: state.currentScopeStage,
      currentRoomId: state.currentRoomId,
      currentRoomName: state.currentRoomName,
      currentCoordinateName: state.currentCoordinateName,
      currentCardinal: state.currentCardinal,
      currentPlaceType: state.currentPlaceType,
      currentScopeLane: state.currentScopeLane,
      currentVoiceMode: state.currentVoiceMode,

      visitorPosture: "",
      movement: inferMovementIntent(optionKind, selectedTarget),
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

      bridgeContext: buildForkBridgeContext({
        selectedTarget: selectedTarget,
        selectedLabel: partial.selectedLabel || "",
        requestMode: partial.requestMode || "freeform",
        optionKind: optionKind,
        bridgeMoment: bridgeMoment
      }),

      sessionTrail: state.visitorTrail.slice(-MAX_TRAIL),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL),
      selectedNodes: state.selectedTargets.slice(-MAX_TRAIL),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL),
      selectedOptionKeys: state.selectedOptionKeys.slice(-MAX_TRAIL),
      returnStack: state.returnStack.slice(-MAX_TRAIL),
      branchStack: state.branchStack.slice(-MAX_TRAIL),
      roomTrail: state.roomTrail.slice(-MAX_TRAIL),
      transitionTrail: state.transitionTrail.slice(-MAX_TRAIL),

      requestedMode: partial.requestMode || "",
      registryContext: null,
      diagnosticResult: null,

      characterArchetypeAnswers: state.characterArchetypeAnswers.slice(-12),
      characterOverviewDone: state.characterOverviewDone,
      characterRolesRevealed: state.characterRolesRevealed,
      characterProfileViewCount: state.characterProfileViewCount,
      characterRelationshipViews: state.characterRelationshipViews,
      characterCompletionReady: state.characterOverviewDone && state.characterRolesRevealed && state.characterProfileViewCount >= 1
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
    state.lastSelectedTarget = normalizeTarget(response.selectedTarget || (sourceOption ? sourceOption.target : ""));
    state.lastSelectedLabel = response.selectedLabel || (sourceOption ? sourceOption.label : "");
    state.lastRequestMode = response.requestMode || (sourceOption ? "node_enrichment" : "freeform");
    state.lastOptionKind = normalizeOptionKind((sourceOption && sourceOption.optionKind) || response.optionKind || state.lastOptionKind || OPTION_KIND.CONVERSATION);
    state.lastBridgeMoment = response.bridgeMoment || BRIDGE_MOMENT.AFTER_KNOWLEDGE;

    if (response.contract) {
      els.root.setAttribute("data-api-contract", response.contract);
    }

    if (response.source) {
      els.root.setAttribute("data-api-source", response.source);
    }

    var frame = buildConversationFrame({
      source: response.source || "backbrain",
      beats: normalized.beats,
      options: normalized.options,
      traversalControls: normalized.traversalControls,
      handoffs: normalized.handoffs,
      routeHints: response.routeHints || {},
      handoffLabels: response.handoffLabels || {},
      response: response,
      sourceOption: sourceOption,
      requestMode: state.lastRequestMode,
      selectedTarget: state.lastSelectedTarget,
      selectedLabel: state.lastSelectedLabel,
      optionKind: state.lastOptionKind,
      bridgeMoment: BRIDGE_MOMENT.AFTER_KNOWLEDGE,
      depthMode: response.depthMode || "",
      fibonacciDepth: Number(response.fibonacciDepth || 0),
      fibonacciStage: String(response.fibonacciStage || ""),
      narrativeFrame: response.narrativeFrame || null
    });

    renderConversationFrame(frame);
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

    var controls = [];
    if (Array.isArray(response.traversalControls)) controls = response.traversalControls;
    else if (Array.isArray(response.controls)) controls = response.controls;
    var normalizedControls = normalizeConversationOptions(controls);

    var handoffs = Array.isArray(response.handoffs) ? response.handoffs : [];
    var normalizedHandoffs = normalizeHandoffs(handoffs, response.routeHints || {});

    return {
      beats: beats,
      options: normalizedOptions,
      traversalControls: normalizedControls,
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
    state.currentScopeStage = inferScopeStage(clean);
    state.lastOptionKind = isForkTarget(clean) ? OPTION_KIND.CONTROL : state.lastOptionKind;
    state.lastBridgeMoment = isForkTarget(clean) ? BRIDGE_MOMENT.RECENTER : state.lastBridgeMoment;

    if (clean === "charactersPath") state.characterOverviewDone = true;
    if (clean === "characterIdentityPath") state.characterRolesRevealed = true;
    if (CHARACTER_TARGETS[clean]) {
      state.characterProfileViews[clean] = true;
      state.characterProfileViewCount = Object.keys(state.characterProfileViews).length;
    }
    if (clean === "characterRelationshipsPath") state.characterRelationshipViews += 1;

    if (opts.replace) {
      clearTranscript();
    }

    stampRoot();

    var frame = buildConversationFrame({
      source: "local",
      beats: (node.beats || []).map(cleanPublicText).filter(Boolean),
      options: node.options || [],
      traversalControls: node.traversalControls || [],
      handoffs: node.handoffs || [],
      routeHints: {},
      handoffLabels: {},
      response: null,
      sourceOption: null,
      requestMode: "local_fallback",
      selectedTarget: clean,
      selectedLabel: CONVERSATION_LABELS[clean] || clean,
      optionKind: isForkTarget(clean) ? OPTION_KIND.CONTROL : OPTION_KIND.CONVERSATION,
      bridgeMoment: clean === "intro" ? BRIDGE_MOMENT.ENTRANCE : BRIDGE_MOMENT.RECENTER,
      depthMode: "",
      fibonacciDepth: state.lastFibonacciDepth || 0,
      fibonacciStage: state.lastFibonacciStage || "",
      narrativeFrame: state.lastBackbrainFrame || null
    });

    renderConversationFrame(frame);
  }

  function buildConversationFrame(parts) {
    var frame = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      source: parts.source || "local",
      beats: Array.isArray(parts.beats) ? parts.beats.slice() : [],
      options: Array.isArray(parts.options) ? parts.options.slice() : [],
      traversalControls: Array.isArray(parts.traversalControls) ? parts.traversalControls.slice() : [],
      handoffs: Array.isArray(parts.handoffs) ? parts.handoffs.slice() : [],
      routeHints: parts.routeHints || {},
      handoffLabels: parts.handoffLabels || {},
      currentNode: state.currentNode,
      currentTopic: state.currentTopic,
      currentScopeStage: state.currentScopeStage,
      selectedTarget: normalizeTarget(parts.selectedTarget || state.lastSelectedTarget || ""),
      selectedLabel: parts.selectedLabel || state.lastSelectedLabel || "",
      requestMode: parts.requestMode || state.lastRequestMode || "",
      optionKind: normalizeOptionKind(parts.optionKind || state.lastOptionKind || OPTION_KIND.CONVERSATION),
      bridgeMoment: parts.bridgeMoment || state.lastBridgeMoment || "",
      visitorTrail: state.visitorTrail.slice(-MAX_TRAIL),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL),
      returnStack: state.returnStack.slice(-MAX_TRAIL),
      branchStack: state.branchStack.slice(-MAX_TRAIL),
      transitionTrail: state.transitionTrail.slice(-MAX_TRAIL),
      currentRoomContext: CURRENT_ROOM_CONTEXT,
      currentRoomRole: CURRENT_ROOM_ROLE,
      currentRoomPremise: CURRENT_ROOM_PREMISE,
      estateKnowledgeMode: ESTATE_KNOWLEDGE_MODE,
      portalLogic: PORTAL_LOGIC,
      routeAuthority: ROUTE_AUTHORITY,
      depthMode: parts.depthMode || state.lastApiDepthMode || "",
      fibonacciDepth: Number(parts.fibonacciDepth || state.lastFibonacciDepth || 0),
      fibonacciStage: String(parts.fibonacciStage || state.lastFibonacciStage || ""),
      narrativeFrame: parts.narrativeFrame || state.lastBackbrainFrame || null,
      characterState: {
        overviewDone: state.characterOverviewDone,
        rolesRevealed: state.characterRolesRevealed,
        profileViewCount: state.characterProfileViewCount,
        relationshipViews: state.characterRelationshipViews,
        profileViews: Object.assign({}, state.characterProfileViews)
      },
      authorities: Object.assign({}, state.lastBackbrainAuthorities),
      response: parts.response || null,
      sourceOption: parts.sourceOption || null
    };

    return normalizeConversationFrame(frame);
  }

  function renderConversationFrame(frame) {
    var finalFrame = prepareFrameForRender(frame);

    state.currentScopeStage = finalFrame.currentScopeStage || state.currentScopeStage;
    stampRoot();

    revealBeats(finalFrame.beats).then(function () {
      renderConversationOptions(finalFrame.options, finalFrame.traversalControls);
      renderHandoffs(finalFrame.handoffs, finalFrame.handoffLabels || {}, finalFrame.routeHints || {});
      setHouseListening(true);
    });
  }

  function prepareFrameForRender(frame) {
    var cleanFrame = normalizeConversationFrame(frame);
    var withExpressionBridge = applyExpressionForkBridge(cleanFrame, {
      bridgeMoment: cleanFrame.bridgeMoment || inferBridgeMoment(cleanFrame),
      selectedTarget: cleanFrame.selectedTarget,
      selectedLabel: cleanFrame.selectedLabel,
      optionKind: cleanFrame.optionKind
    });

    var staged = normalizeConversationFrame(withExpressionBridge);

    if (shouldApplyLocalEntryStaging(staged) && staged.currentTopic === "characters") {
      staged.options = stageCharacterOptions(staged.options, staged);
    }

    staged.traversalControls = normalizeConversationOptions(
      staged.traversalControls.concat(buildDefaultTraversalControls(staged))
    );

    staged.options = limitPrimaryOptions(staged.options);
    staged.traversalControls = limitTraversalControls(staged.traversalControls);

    return staged;
  }

  function applyExpressionForkBridge(frame, overrides) {
    var expression = getExpression();
    var clean = normalizeConversationFrame(frame);
    var context = buildForkBridgeContext(Object.assign({}, clean, overrides || {}));
    var bridge = null;

    if (!expression) {
      return clean;
    }

    try {
      if (typeof expression.shapeForkBridge === "function") {
        bridge = expression.shapeForkBridge(cloneFrame(clean), context);
      } else if (typeof expression.shapeTransitionBridge === "function") {
        bridge = expression.shapeTransitionBridge(cloneFrame(clean), context);
      } else if (shouldUseLegacyExpressionGate(clean) && typeof expression.shapeConversationFrame === "function") {
        bridge = expression.shapeConversationFrame(cloneFrame(clean), buildExpressionContext(clean));
      }
    } catch (_error) {
      bridge = null;
    }

    if (!bridge || typeof bridge !== "object") {
      return clean;
    }

    return mergeBridgeIntoFrame(clean, normalizeBridgeResponse(bridge), context);
  }

  function buildPreKnowledgeBridge(option, overrides) {
    var expression = getExpression();
    if (!expression) return null;

    var target = normalizeTarget(option.target || "");
    var context = buildForkBridgeContext({
      selectedTarget: target,
      selectedLabel: option.label || "",
      optionKind: normalizeOptionKind(option.optionKind || OPTION_KIND.CONVERSATION),
      bridgeMoment: overrides && overrides.bridgeMoment ? overrides.bridgeMoment : BRIDGE_MOMENT.BEFORE_KNOWLEDGE,
      requestMode: "node_enrichment",
      currentNode: state.currentNode,
      currentTopic: state.currentTopic,
      currentScopeStage: state.currentScopeStage
    });

    try {
      if (typeof expression.shapePreKnowledgeBridge === "function") {
        return normalizeBridgeResponse(expression.shapePreKnowledgeBridge({
          selectedTarget: target,
          selectedLabel: option.label || "",
          optionKind: option.optionKind || OPTION_KIND.CONVERSATION
        }, context));
      }

      if (typeof expression.shapeTransitionBridge === "function") {
        return normalizeBridgeResponse(expression.shapeTransitionBridge({
          selectedTarget: target,
          selectedLabel: option.label || "",
          optionKind: option.optionKind || OPTION_KIND.CONVERSATION,
          bridgeMoment: context.bridgeMoment
        }, context));
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  function normalizeBridgeResponse(bridge) {
    var clean = bridge || {};

    var beats = [];
    if (Array.isArray(clean.beats)) beats = clean.beats;
    else if (Array.isArray(clean.bridgeBeats)) beats = clean.bridgeBeats;
    else if (typeof clean.beat === "string") beats = [clean.beat];

    var beatsBefore = [];
    if (Array.isArray(clean.beatsBefore)) beatsBefore = clean.beatsBefore;
    else if (Array.isArray(clean.bridgeBeatsBefore)) beatsBefore = clean.bridgeBeatsBefore;

    var beatsAfter = [];
    if (Array.isArray(clean.beatsAfter)) beatsAfter = clean.beatsAfter;
    else if (Array.isArray(clean.bridgeBeatsAfter)) beatsAfter = clean.bridgeBeatsAfter;

    var options = [];
    if (Array.isArray(clean.options)) options = clean.options;
    else if (Array.isArray(clean.archetypeOptions)) options = clean.archetypeOptions;

    var traversalControls = [];
    if (Array.isArray(clean.traversalControls)) traversalControls = clean.traversalControls;
    else if (Array.isArray(clean.controls)) traversalControls = clean.controls;
    else if (Array.isArray(clean.movementControls)) traversalControls = clean.movementControls;

    var handoffs = [];
    if (Array.isArray(clean.handoffs)) handoffs = clean.handoffs;
    else if (Array.isArray(clean.preparedDoors)) handoffs = clean.preparedDoors;

    return {
      replaceBeats: !!clean.replaceBeats,
      beats: beats.map(cleanPublicText).filter(Boolean),
      beatsBefore: beatsBefore.map(cleanPublicText).filter(Boolean),
      beatsAfter: beatsAfter.map(cleanPublicText).filter(Boolean),
      options: normalizeConversationOptions(options),
      traversalControls: normalizeConversationOptions(traversalControls),
      handoffs: handoffs,
      handoffLabels: clean.handoffLabels || {},
      routeHints: clean.routeHints || {},
      bridgeMoment: clean.bridgeMoment || "",
      bridgeTarget: normalizeTarget(clean.bridgeTarget || "")
    };
  }

  function mergeBridgeIntoFrame(frame, bridge, context) {
    var result = normalizeConversationFrame(frame);
    var brainLed = isBrainLedFrame(result);

    if (bridge.replaceBeats && !brainLed && bridge.beats.length) {
      result.beats = bridge.beats;
    } else {
      if (bridge.beatsBefore.length) {
        result.beats = bridge.beatsBefore.concat(result.beats);
      }

      if (bridge.beats.length && !brainLed) {
        result.beats = bridge.beats;
      } else if (bridge.beats.length && context.bridgeMoment !== BRIDGE_MOMENT.BEFORE_KNOWLEDGE) {
        result.beats = result.beats.concat(bridge.beats);
      }

      if (bridge.beatsAfter.length) {
        result.beats = result.beats.concat(bridge.beatsAfter);
      }
    }

    if (bridge.options.length) {
      result.options = bridge.options;
    }

    if (bridge.traversalControls.length) {
      result.traversalControls = bridge.traversalControls;
    }

    if (bridge.handoffs.length) {
      result.handoffs = normalizeHandoffs(bridge.handoffs, Object.assign({}, result.routeHints, bridge.routeHints));
    }

    result.handoffLabels = Object.assign({}, result.handoffLabels || {}, bridge.handoffLabels || {});
    result.routeHints = Object.assign({}, result.routeHints || {}, bridge.routeHints || {});

    if (bridge.bridgeMoment) result.bridgeMoment = bridge.bridgeMoment;
    if (bridge.bridgeTarget) state.lastBridgeTarget = bridge.bridgeTarget;

    return normalizeConversationFrame(result);
  }

  function isBrainLedFrame(frame) {
    var clean = normalizeConversationFrame(frame);
    return clean.requestMode === "node_enrichment" &&
      !!clean.selectedTarget &&
      !isForkTarget(clean.selectedTarget);
  }

  function shouldUseLegacyExpressionGate(frame) {
    var clean = normalizeConversationFrame(frame);
    var target = normalizeTarget(clean.selectedTarget || clean.currentNode || "");

    if (isForkTarget(target)) return true;

    if (clean.response && clean.response.needsRecenter) return true;

    if (clean.requestMode === "freeform" && !clean.selectedTarget) {
      return clean.currentTopic === "orientation" ||
        clean.currentScopeStage === "orientation" ||
        clean.currentNode === "intro";
    }

    if (clean.source === "local" && clean.currentScopeStage === "orientation") {
      return true;
    }

    return false;
  }

  function shouldUseExpressionTextSanitizer() {
    if (isActiveBrainLedState()) return false;

    return isForkTarget(state.currentNode) ||
      state.currentScopeStage === "orientation" ||
      state.currentTopic === "orientation";
  }

  function shouldUseExpressionHandoffGate() {
    if (isActiveBrainLedState()) return false;

    return isForkTarget(state.currentNode) ||
      state.currentScopeStage === "orientation";
  }

  function isActiveBrainLedState() {
    return state.lastRequestMode === "node_enrichment" &&
      !!state.lastSelectedTarget &&
      !isForkTarget(state.lastSelectedTarget);
  }

  function isForkTarget(target) {
    return !!FORK_TARGETS[normalizeTarget(target)] || !!ENTRY_GATE_TARGETS[normalizeTarget(target)];
  }

  function shouldApplyLocalEntryStaging(frame) {
    var clean = normalizeConversationFrame(frame);
    if (clean.source !== "local" && clean.requestMode !== "local_fallback") return false;
    if (isForkTarget(clean.selectedTarget || clean.currentNode)) return false;
    return true;
  }

  function buildDefaultTraversalControls(frame) {
    var clean = normalizeConversationFrame(frame);
    var controls = [];
    var adjacent = getFallbackAdjacentDoor(clean);

    if (state.returnStack.length && clean.currentNode !== "intro") {
      controls.push(traversal("Step back one threshold.", "priorTopicReturnPath", OPTION_KIND.RETURN, "control"));
    }

    if (adjacent && adjacent.target && adjacent.target !== clean.currentNode) {
      controls.push(traversal(adjacent.label, adjacent.target, OPTION_KIND.PARALLEL, "conversation", adjacent.reason));
    }

    if (!hasOptionTarget(clean.options, "returnFork") && clean.currentNode !== "intro") {
      controls.push(traversal("Return to the First Fork.", "returnFork", OPTION_KIND.RETURN, "control"));
    }

    return controls;
  }

  function getFallbackAdjacentDoor(frame) {
    var clean = normalizeConversationFrame(frame);
    var keys = [
      clean.selectedTarget,
      clean.currentNode,
      state.lastSelectedTarget,
      state.currentNode
    ].map(normalizeTarget).filter(Boolean);

    for (var i = 0; i < keys.length; i += 1) {
      if (ADJACENT_ROOM_FALLBACKS[keys[i]]) {
        return Object.assign({}, ADJACENT_ROOM_FALLBACKS[keys[i]]);
      }
    }

    if (clean.currentTopic === "characters") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.charactersPath);
    if (clean.currentTopic === "frontier") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.frontierPath);
    if (clean.currentTopic === "proof") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.scientificLawPath);
    if (clean.currentTopic === "mirrorland") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.mirrorlandPath);
    if (clean.currentTopic === "sean") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.seanPath);
    if (clean.currentTopic === "underdog") return Object.assign({}, ADJACENT_ROOM_FALLBACKS.underdogPath);

    return null;
  }

  function normalizeConversationFrame(frame) {
    var clean = frame || {};

    return {
      contract: clean.contract || CONTRACT,
      previousContract: clean.previousContract || PREVIOUS_CONTRACT,
      source: clean.source || "local",
      beats: (Array.isArray(clean.beats) ? clean.beats : []).map(cleanPublicText).filter(Boolean),
      options: normalizeConversationOptions(Array.isArray(clean.options) ? clean.options : []),
      traversalControls: normalizeConversationOptions(Array.isArray(clean.traversalControls) ? clean.traversalControls : []),
      handoffs: normalizeHandoffs(Array.isArray(clean.handoffs) ? clean.handoffs : [], clean.routeHints || {}),
      routeHints: clean.routeHints || {},
      handoffLabels: clean.handoffLabels || {},
      currentNode: normalizeTarget(clean.currentNode || state.currentNode || "intro"),
      currentTopic: clean.currentTopic || state.currentTopic || "orientation",
      currentScopeStage: clean.currentScopeStage || inferScopeStage(clean.currentNode || state.currentNode),
      selectedTarget: normalizeTarget(clean.selectedTarget || ""),
      selectedLabel: clean.selectedLabel || "",
      requestMode: clean.requestMode || "",
      optionKind: normalizeOptionKind(clean.optionKind || OPTION_KIND.CONVERSATION),
      bridgeMoment: clean.bridgeMoment || "",
      visitorTrail: Array.isArray(clean.visitorTrail) ? clean.visitorTrail.slice(-MAX_TRAIL) : [],
      visitedNodes: Array.isArray(clean.visitedNodes) ? clean.visitedNodes.slice(-MAX_TRAIL) : [],
      selectedTargets: Array.isArray(clean.selectedTargets) ? clean.selectedTargets.slice(-MAX_TRAIL) : [],
      returnStack: Array.isArray(clean.returnStack) ? clean.returnStack.slice(-MAX_TRAIL) : [],
      branchStack: Array.isArray(clean.branchStack) ? clean.branchStack.slice(-MAX_TRAIL) : [],
      transitionTrail: Array.isArray(clean.transitionTrail) ? clean.transitionTrail.slice(-MAX_TRAIL) : [],
      currentRoomContext: clean.currentRoomContext || CURRENT_ROOM_CONTEXT,
      currentRoomRole: clean.currentRoomRole || CURRENT_ROOM_ROLE,
      currentRoomPremise: clean.currentRoomPremise || CURRENT_ROOM_PREMISE,
      estateKnowledgeMode: clean.estateKnowledgeMode || ESTATE_KNOWLEDGE_MODE,
      portalLogic: clean.portalLogic || PORTAL_LOGIC,
      routeAuthority: clean.routeAuthority || ROUTE_AUTHORITY,
      depthMode: clean.depthMode || "",
      fibonacciDepth: Number(clean.fibonacciDepth || 0),
      fibonacciStage: String(clean.fibonacciStage || ""),
      narrativeFrame: clean.narrativeFrame || null,
      characterState: clean.characterState || {
        overviewDone: false,
        rolesRevealed: false,
        profileViewCount: 0,
        relationshipViews: 0,
        profileViews: {}
      },
      authorities: clean.authorities || {},
      response: clean.response || null,
      sourceOption: clean.sourceOption || null
    };
  }

  function cloneFrame(frame) {
    try {
      return JSON.parse(JSON.stringify(frame));
    } catch (_error) {
      return Object.assign({}, frame);
    }
  }

  function buildExpressionContext(frame) {
    return {
      panel: "fork_bridge",
      contract: CONTRACT,
      currentNode: frame.currentNode,
      currentTopic: frame.currentTopic,
      currentScopeStage: frame.currentScopeStage,
      selectedTarget: frame.selectedTarget,
      selectedLabel: frame.selectedLabel,
      requestMode: frame.requestMode,
      optionKind: frame.optionKind,
      bridgeMoment: frame.bridgeMoment,
      visitorTrail: frame.visitorTrail,
      visitedNodes: frame.visitedNodes,
      selectedTargets: frame.selectedTargets,
      returnStack: frame.returnStack,
      branchStack: frame.branchStack,
      transitionTrail: frame.transitionTrail,
      currentRoomContext: CURRENT_ROOM_CONTEXT,
      currentRoomRole: CURRENT_ROOM_ROLE,
      currentRoomPremise: CURRENT_ROOM_PREMISE,
      estateKnowledgeMode: ESTATE_KNOWLEDGE_MODE,
      portalLogic: PORTAL_LOGIC,
      routeAuthority: ROUTE_AUTHORITY,
      depthMode: frame.depthMode,
      fibonacciDepth: frame.fibonacciDepth,
      fibonacciStage: frame.fibonacciStage,
      narrativeFrame: frame.narrativeFrame,
      characterState: frame.characterState,
      source: frame.source,
      expressionMode: "narrative_fork_bridge"
    };
  }

  function buildForkBridgeContext(input) {
    var selectedTarget = normalizeTarget(input.selectedTarget || state.lastSelectedTarget || state.currentNode || "");
    var adjacent = getFallbackAdjacentDoor({
      currentNode: input.currentNode || state.currentNode,
      selectedTarget: selectedTarget,
      currentTopic: input.currentTopic || state.currentTopic,
      currentScopeStage: input.currentScopeStage || state.currentScopeStage,
      options: []
    });

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      bridgeMoment: input.bridgeMoment || inferBridgeMoment(input),
      movementIntent: inferMovementIntent(input.optionKind || state.lastOptionKind, selectedTarget),
      optionKind: normalizeOptionKind(input.optionKind || state.lastOptionKind || OPTION_KIND.CONVERSATION),

      currentNode: input.currentNode || state.currentNode,
      priorNode: state.returnStack.length ? state.returnStack[state.returnStack.length - 1] : "",
      selectedTarget: selectedTarget,
      selectedLabel: input.selectedLabel || state.lastSelectedLabel || "",
      requestMode: input.requestMode || state.lastRequestMode || "",

      currentTopic: input.currentTopic || state.currentTopic,
      currentScopeStage: input.currentScopeStage || state.currentScopeStage,
      currentRoomId: state.currentRoomId,
      currentRoomName: state.currentRoomName,
      currentCardinal: state.currentCardinal,
      currentCoordinateName: state.currentCoordinateName,
      currentPlaceType: state.currentPlaceType,

      currentRoomContext: CURRENT_ROOM_CONTEXT,
      currentRoomRole: CURRENT_ROOM_ROLE,
      currentRoomPremise: CURRENT_ROOM_PREMISE,
      estateKnowledgeMode: ESTATE_KNOWLEDGE_MODE,
      portalLogic: PORTAL_LOGIC,
      routeAuthority: ROUTE_AUTHORITY,

      adjacentTarget: adjacent ? adjacent.target : "",
      adjacentLabel: adjacent ? adjacent.label : "",
      adjacentReason: adjacent ? adjacent.reason : "",

      visitorTrail: state.visitorTrail.slice(-MAX_TRAIL),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL),
      selectedOptionKeys: state.selectedOptionKeys.slice(-MAX_TRAIL),
      returnStack: state.returnStack.slice(-MAX_TRAIL),
      branchStack: state.branchStack.slice(-MAX_TRAIL),
      transitionTrail: state.transitionTrail.slice(-MAX_TRAIL),

      routeHints: Object.assign({}, state.lastRouteHints),
      handoffLabels: Object.assign({}, state.lastHandoffLabels),
      characterState: {
        overviewDone: state.characterOverviewDone,
        rolesRevealed: state.characterRolesRevealed,
        profileViewCount: state.characterProfileViewCount,
        relationshipViews: state.characterRelationshipViews,
        profileViews: Object.assign({}, state.characterProfileViews)
      },

      authorities: Object.assign({}, state.lastBackbrainAuthorities),
      depthMode: state.lastApiDepthMode,
      fibonacciDepth: state.lastFibonacciDepth,
      fibonacciStage: state.lastFibonacciStage,
      narrativeFrame: state.lastBackbrainFrame,

      expects: {
        mayReturnBeatsBefore: true,
        mayReturnBeatsAfter: true,
        mayReturnArchetypeOptions: true,
        mayReturnTraversalControls: true,
        mayReturnPreparedDoors: true,
        mustNotOwnBrainDepth: true,
        mustNotExecuteRoute: true
      }
    };
  }

  function inferBridgeMoment(input) {
    var target = normalizeTarget((input && input.selectedTarget) || state.lastSelectedTarget || state.currentNode);
    var optionKind = normalizeOptionKind((input && input.optionKind) || state.lastOptionKind || OPTION_KIND.CONVERSATION);

    if (target === "intro" || target === "whereToStart") return BRIDGE_MOMENT.ENTRANCE;
    if (target === "recenterNode" || target === "loopRecovery" || target === "cleanDoor" || target === "switchTopics" || target === "sharpQuestion") return BRIDGE_MOMENT.RECENTER;
    if (target === "returnFork" || target === "priorTopicReturnPath" || target === "originReturnPath") return BRIDGE_MOMENT.RETURN;
    if (optionKind === OPTION_KIND.PARALLEL) return BRIDGE_MOMENT.PARALLEL;
    if ((input && input.requestMode) === "node_enrichment") return BRIDGE_MOMENT.AFTER_KNOWLEDGE;

    return BRIDGE_MOMENT.ENTRANCE;
  }

  function inferMovementIntent(optionKind, target) {
    var kind = normalizeOptionKind(optionKind);
    var clean = normalizeTarget(target || "");

    if (kind === OPTION_KIND.PARALLEL) return "parallel_crossing";
    if (kind === OPTION_KIND.RETURN || clean === "returnFork" || clean === "priorTopicReturnPath" || clean === "originReturnPath") return "return";
    if (kind === OPTION_KIND.FORWARD) return "forward";
    if (kind === OPTION_KIND.ARCHETYPE) return "archetypal_engagement";
    if (isControlTarget(clean)) return "control";
    return "conversation";
  }

  function getLocalNode(target) {
    var clean = normalizeTarget(target);

    if (LOCAL_NODES[clean]) return LOCAL_NODES[clean];

    if (CHARACTER_TARGETS[clean]) {
      var character = CHARACTER_TARGETS[clean];
      var hasDiscussed = !!state.characterProfileViews[clean];

      return {
        beats: [
          character.name + " steps into the role of " + character.roleName + ".",
          character.oneLine,
          character.pressure,
          hasDiscussed
            ? "The next frame is connection: how this role changes the rest of the Character field."
            : "The first frame is the role. The deeper frame is how this role connects to the others."
        ],
        options: [
          convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
          convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath"),
          convo("Reveal the Character role map.", "characterIdentityPath")
        ],
        handoffs: ["characters", "mirrorland"]
      };
    }

    if (clean.indexOf("frontier") === 0) {
      return {
        beats: [
          "This is one of the Frontier system paths.",
          "Frontier tests future-facing systems without treating speculation as proof.",
          "The next frame is function first, then test, then proof."
        ],
        options: [
          convo("Reveal the future systems.", "frontierSystemsPath"),
          convo("Show why Frontier needs proof.", "frontierLawPath"),
          convo("Frame Hearth Mission Control.", "hearthPath")
        ],
        handoffs: ["frontier", "scientificLaw", "gauges"]
      };
    }

    if (clean.indexOf("scientificLaw") === 0) {
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

  function renderConversationOptions(options, traversalControls) {
    clearElement(els.optionsPanel);

    var normalizedOptions = normalizeConversationOptions(options);
    var normalizedControls = normalizeConversationOptions(traversalControls || []);

    var archetypeOptions = normalizedOptions.filter(function (item) {
      return item.optionKind === OPTION_KIND.ARCHETYPE;
    }).slice(0, MAX_VISIBLE_ARCHETYPE_OPTIONS);

    var conversationOptions = normalizedOptions.filter(function (item) {
      return item.optionKind !== OPTION_KIND.ARCHETYPE &&
        item.optionKind !== OPTION_KIND.RETURN &&
        item.optionKind !== OPTION_KIND.PARALLEL &&
        item.optionKind !== OPTION_KIND.FORWARD &&
        item.optionKind !== OPTION_KIND.CONTROL;
    }).slice(0, MAX_VISIBLE_OPTIONS);

    var movementControls = normalizedOptions.concat(normalizedControls).filter(function (item) {
      return item.optionKind === OPTION_KIND.FORWARD ||
        item.optionKind === OPTION_KIND.RETURN ||
        item.optionKind === OPTION_KIND.PARALLEL ||
        item.optionKind === OPTION_KIND.CONTROL;
    });

    movementControls = uniqueOptions(movementControls).slice(0, MAX_VISIBLE_TRAVERSAL_CONTROLS);

    if (!archetypeOptions.length && !conversationOptions.length && !movementControls.length) {
      els.optionsPanel.setAttribute("hidden", "");
      return;
    }

    els.optionsPanel.removeAttribute("hidden");
    els.optionsPanel.setAttribute("data-panel-kind", "fork-bridge");
    els.optionsPanel.setAttribute("data-fork-bridge-renderer", "active");

    if (archetypeOptions.length) {
      appendOptionGroup("Choose How To Engage", archetypeOptions, "archetype");
    }

    if (conversationOptions.length) {
      appendOptionGroup(archetypeOptions.length ? "Stay With This Room" : "Choose What To Say", conversationOptions, "conversation");
    }

    if (movementControls.length) {
      appendOptionGroup("Choose How To Move", movementControls, "traversal");
    }
  }

  function appendOptionGroup(titleText, options, groupKind) {
    var group = document.createElement("section");
    group.className = "jeeves-option-group";
    group.setAttribute("data-jeeves-option-group", groupKind);

    var title = document.createElement("div");
    title.className = "jeeves-panel-title";
    title.textContent = titleText;
    group.appendChild(title);

    options.forEach(function (option, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "jeeves-option";
      button.setAttribute("data-jeeves-option", "");
      button.setAttribute("data-target", option.target);
      button.setAttribute("data-type", option.type || "conversation");
      button.setAttribute("data-scope-lane", option.scopeLane || "objective");
      button.setAttribute("data-scope-stage", option.scopeStage || inferScopeStage(option.target));
      button.setAttribute("data-option-kind", normalizeOptionKind(option.optionKind || OPTION_KIND.CONVERSATION));
      button.setAttribute("data-option-group", groupKind);
      button.setAttribute("data-option-index", String(index));
      if (option.bridgeReason) button.setAttribute("data-bridge-reason", option.bridgeReason);
      button.textContent = enforceConversationLanguage(option.label, option.target, option.optionKind);
      group.appendChild(button);
    });

    els.optionsPanel.appendChild(group);
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
    title.textContent = "Prepared Doors";
    els.handoffPanel.appendChild(title);

    normalized.forEach(function (handoff, index) {
      if (!handoff.href || handoff.href === "#") return;

      var link = document.createElement("a");
      link.className = "jeeves-route-option";
      link.setAttribute("data-jeeves-route-option", "");
      link.setAttribute("data-route-id", handoff.routeId);
      link.setAttribute("data-href", handoff.href);
      link.setAttribute("data-route-index", String(index));
      link.setAttribute("data-option-kind", OPTION_KIND.ROUTE);
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

      var optionKind = normalizeOptionKind(item.optionKind || item.kind || "");
      if (!optionKind) optionKind = deriveOptionKind(item, target, type);

      var label = item.label || CONVERSATION_LABELS[target] || "Tell me more.";
      var normalized = {
        label: enforceConversationLanguage(label, target, optionKind),
        target: target,
        type: isControlTarget(target) ? "control" : normalizeOptionType(type),
        scopeLane: item.scopeLane || (isNarrativeTarget(target) ? "narrative" : "objective"),
        scopeStage: item.scopeStage || inferScopeStage(target),
        optionKind: optionKind,
        bridgeReason: item.bridgeReason || item.reason || ""
      };

      var key = normalized.target + "::" + normalized.label + "::" + normalized.optionKind;
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

    handoffs.forEach(function (item) {
      var route = "";
      var href = "";
      var label = "";

      if (typeof item === "string") {
        route = normalizeRouteId(item);
        href = (routeHints && routeHints[route]) || LOCAL_ROUTE_HINTS[route] || "";
        label = LOCAL_HANDOFF_LABELS[route] || route;
      } else if (item && typeof item === "object") {
        route = normalizeRouteId(item.routeId || item.target || item.id || "");
        href = item.href || (routeHints && routeHints[route]) || LOCAL_ROUTE_HINTS[route] || "";
        label = item.label || LOCAL_HANDOFF_LABELS[route] || route;
      }

      if (!route || !href) return;

      var key = route + "::" + href;
      if (seen[key]) return;
      seen[key] = true;

      result.push({
        routeId: route,
        href: href,
        label: enforceRouteLanguage(label, route),
        optionKind: OPTION_KIND.ROUTE
      });
    });

    return result;
  }

  function shapeHandoffs(handoffs, handoffLabels, routeHints) {
    var expression = getExpression();

    return handoffs.map(function (handoff) {
      var label = handoffLabels[handoff.routeId] || handoff.label || LOCAL_HANDOFF_LABELS[handoff.routeId] || handoff.routeId;

      if (shouldUseExpressionHandoffGate() && expression && typeof expression.shapeRouteLabel === "function") {
        try {
          label = expression.shapeRouteLabel(label, {
            routeId: handoff.routeId,
            href: handoff.href,
            panel: "prepared_door",
            contract: CONTRACT,
            currentNode: state.currentNode,
            currentTopic: state.currentTopic,
            currentScopeStage: state.currentScopeStage,
            bridgeMoment: BRIDGE_MOMENT.PREPARED_DOOR,
            expressionMode: "narrative_fork_bridge"
          }) || label;
        } catch (_error) {
          label = handoff.label;
        }
      }

      return {
        routeId: handoff.routeId,
        href: (routeHints && routeHints[handoff.routeId]) || handoff.href,
        label: enforceRouteLanguage(label, handoff.routeId),
        optionKind: OPTION_KIND.ROUTE
      };
    }).filter(function (handoff) {
      return handoff.routeId && handoff.href;
    });
  }

  function stageCharacterOptions(options, frame) {
    var cleanOptions = normalizeConversationOptions(options);
    var target = normalizeTarget(frame.selectedTarget || frame.currentNode || "");
    var profileCount = frame.characterState && Number(frame.characterState.profileViewCount || 0);
    var rolesRevealed = !!(frame.characterState && frame.characterState.rolesRevealed);

    if (target === "charactersPath" || frame.currentNode === "charactersPath") {
      return [
        convo("Reveal the Character role map.", "characterIdentityPath"),
        convo("Show why the Characters matter.", "characterStoryPressurePath"),
        convo("Begin the first Character path.", "characterFirstPath")
      ];
    }

    if (!rolesRevealed && frame.currentTopic === "characters") {
      return [
        convo("Reveal the Character role map.", "characterIdentityPath"),
        convo("Show why the Characters matter.", "characterStoryPressurePath")
      ];
    }

    if (target === "characterIdentityPath" || frame.currentNode === "characterIdentityPath") {
      return [
        convo("Begin the first Character path.", "characterFirstPath"),
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath"),
        convo("Prepare the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ];
    }

    if (profileCount <= 0 && frame.currentTopic === "characters") {
      return [
        convo("Begin the first Character path.", "characterFirstPath"),
        convo("Reveal the Character relationship layer.", "characterRelationshipsPath")
      ];
    }

    return cleanOptions;
  }

  function limitPrimaryOptions(options) {
    var cleanOptions = uniqueOptions(normalizeConversationOptions(options));
    var archetypes = cleanOptions.filter(function (item) {
      return item.optionKind === OPTION_KIND.ARCHETYPE;
    }).slice(0, MAX_VISIBLE_ARCHETYPE_OPTIONS);

    var others = cleanOptions.filter(function (item) {
      return item.optionKind !== OPTION_KIND.ARCHETYPE;
    }).slice(0, MAX_VISIBLE_OPTIONS);

    return archetypes.concat(others);
  }

  function limitTraversalControls(controls) {
    return uniqueOptions(normalizeConversationOptions(controls)).slice(0, MAX_VISIBLE_TRAVERSAL_CONTROLS);
  }

  function uniqueOptions(options) {
    var seen = {};
    var result = [];

    normalizeConversationOptions(options).forEach(function (option) {
      var key = option.target + "::" + option.optionKind + "::" + option.label;
      if (seen[key]) return;
      seen[key] = true;
      result.push(option);
    });

    return result;
  }

  function hasOptionTarget(options, target) {
    var clean = normalizeTarget(target);
    return normalizeConversationOptions(options).some(function (option) {
      return normalizeTarget(option.target) === clean;
    });
  }

  function enforceConversationLanguage(label, target, optionKind) {
    var clean = cleanPublicText(label || "");
    var fallback = CONVERSATION_LABELS[target] || "";
    var kind = normalizeOptionKind(optionKind || OPTION_KIND.CONVERSATION);

    if (!clean) clean = fallback || "Tell me more.";

    if (kind === OPTION_KIND.RETURN && !/^(return|step back|go back|re-center|start over)/i.test(clean)) {
      clean = fallback || "Step back one threshold.";
    }

    if (kind === OPTION_KIND.PARALLEL && !/^(cross|open beside|move toward|show the nearby|enter|follow)/i.test(clean)) {
      clean = fallback || "Cross into the nearby room.";
    }

    if (kind === OPTION_KIND.FORWARD && !/^(continue|stay with|go deeper|move forward|follow)/i.test(clean)) {
      clean = fallback || "Continue on this path.";
    }

    if (/^(open|visit|explore|launch|go to)\b/i.test(clean) && kind !== OPTION_KIND.PARALLEL) {
      clean = fallback || makeTellMeLabel(target);
    }

    if (
      kind === OPTION_KIND.CONVERSATION &&
      !hasAnyPrefix(clean, CONVERSATION_LANGUAGE_PREFIXES) &&
      !/^(who|what|why|which|how|where|when)\b/i.test(clean) &&
      !/^(ask|re-center|return|start|give me|let’s change|change)\b/i.test(clean)
    ) {
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

  function normalizeOptionKind(kind) {
    var clean = String(kind || "").trim();

    if (clean === "archetype" || clean === "archetypeAnswer") return OPTION_KIND.ARCHETYPE;
    if (clean === "back") return OPTION_KIND.RETURN;
    if (clean === "adjacent" || clean === "sideways" || clean === "crossing") return OPTION_KIND.PARALLEL;
    if (clean === "continue" || clean === "depth") return OPTION_KIND.FORWARD;

    if (clean === OPTION_KIND.ARCHETYPE ||
      clean === OPTION_KIND.CONVERSATION ||
      clean === OPTION_KIND.FORWARD ||
      clean === OPTION_KIND.RETURN ||
      clean === OPTION_KIND.PARALLEL ||
      clean === OPTION_KIND.CONTROL ||
      clean === OPTION_KIND.ROUTE) {
      return clean;
    }

    return "";
  }

  function deriveOptionKind(item, target, type) {
    var cleanTarget = normalizeTarget(target);
    var label = String(item && item.label || "").toLowerCase();

    if (isControlTarget(cleanTarget) || type === "control") {
      if (cleanTarget === "priorTopicReturnPath" || cleanTarget === "originReturnPath" || cleanTarget === "returnFork" || cleanTarget === "restartFork") {
        return OPTION_KIND.RETURN;
      }
      return OPTION_KIND.CONTROL;
    }

    if (/^(i |let me|my |i’m |i am )/i.test(item && item.label || "")) {
      return OPTION_KIND.ARCHETYPE;
    }

    if (/^(cross|open beside|move toward|nearby|adjacent)/i.test(item && item.label || "")) {
      return OPTION_KIND.PARALLEL;
    }

    if (/^(continue|stay with|go deeper|move forward|follow)/i.test(item && item.label || "")) {
      return OPTION_KIND.FORWARD;
    }

    if (label.indexOf("return") === 0 || label.indexOf("step back") === 0 || label.indexOf("start over") === 0) {
      return OPTION_KIND.RETURN;
    }

    return OPTION_KIND.CONVERSATION;
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
      characterRolePath: "characterIdentityPath",
      characterRoleMapPath: "characterIdentityPath",
      characterRolesPath: "characterIdentityPath",
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

  function convo(label, target, type, optionKind) {
    var cleanTarget = normalizeTarget(target);
    return {
      label: label || CONVERSATION_LABELS[cleanTarget] || "Tell me more.",
      target: cleanTarget,
      type: type || "conversation",
      scopeLane: isNarrativeTarget(cleanTarget) ? "narrative" : "objective",
      scopeStage: inferScopeStage(cleanTarget),
      optionKind: normalizeOptionKind(optionKind || OPTION_KIND.CONVERSATION) || OPTION_KIND.CONVERSATION
    };
  }

  function archetype(label, target) {
    return convo(label, target, "conversation", OPTION_KIND.ARCHETYPE);
  }

  function traversal(label, target, optionKind, type, reason) {
    var option = convo(label, target, type || "conversation", optionKind || OPTION_KIND.FORWARD);
    option.bridgeReason = reason || "";
    return option;
  }

  function control(label, target) {
    return convo(label, target, "control", OPTION_KIND.CONTROL);
  }

  function isNarrativeTarget(target) {
    var clean = normalizeTarget(target);
    return [
      "mirrorlandPath",
      "atriumPath",
      "atlasPath",
      "charactersPath",
      "characterIdentityPath",
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

  function inferScopeStage(target) {
    var clean = normalizeTarget(target);

    if (clean === "intro" || clean === "whereToStart" || clean === "returnFork" || clean === "recenterNode") return "orientation";
    if (clean === "characterIdentityPath" || clean === "frontierSystemsPath" || clean === "atlasPath") return "structure";
    if (clean === "characterFirstPath" || clean === "cleanDoor") return "entry";
    if (CHARACTER_TARGETS[clean] || /EnergyPath$|WaterPath$|WastePath$|TheoryPath$|EvidencePath$|MeasurePath$|LimitsPath$/.test(clean)) return "profile";
    if (/RelationshipsPath$|TensionsPath$|MotivesPath$|StoryPressurePath$/.test(clean)) return "relationship";
    if (/Archetype|Diagnostic|selfLearning/.test(clean)) return "reflection";
    if (looksLikeRouteTarget(clean)) return "handoff";
    return "orientation";
  }

  function updateStateForSelection(option) {
    var target = normalizeTarget(option.target);
    var optionKind = normalizeOptionKind(option.optionKind || OPTION_KIND.CONVERSATION) || OPTION_KIND.CONVERSATION;

    state.returnStack.push(state.currentNode);
    state.returnStack = state.returnStack.slice(-MAX_TRAIL);

    if (optionKind === OPTION_KIND.PARALLEL) {
      state.branchStack.push({
        from: state.currentNode,
        to: target,
        at: new Date().toISOString()
      });
      state.branchStack = state.branchStack.slice(-MAX_TRAIL);
      state.lastParallelTarget = target;
    }

    if (optionKind === OPTION_KIND.ARCHETYPE) {
      state.characterArchetypeAnswers.push(cleanPublicText(option.label));
      state.characterArchetypeAnswers = state.characterArchetypeAnswers.slice(-12);
    }

    state.transitionTrail.push({
      from: state.currentNode,
      to: target,
      optionKind: optionKind,
      label: cleanPublicText(option.label),
      at: new Date().toISOString()
    });
    state.transitionTrail = state.transitionTrail.slice(-MAX_TRAIL);

    state.selectedTargets.push(target);
    state.selectedTargets = state.selectedTargets.slice(-MAX_TRAIL);

    state.selectedOptionKeys.push(target + "::" + optionKind + "::" + cleanPublicText(option.label));
    state.selectedOptionKeys = state.selectedOptionKeys.slice(-MAX_TRAIL);

    state.visitedNodes.push(target);
    state.visitedNodes = state.visitedNodes.slice(-MAX_TRAIL);

    state.visitorTrail.push(cleanPublicText(option.label));
    state.visitorTrail = state.visitorTrail.slice(-MAX_TRAIL);

    state.currentNode = target;
    state.currentEntry = target;
    state.currentPath = target;
    state.currentTopic = inferTopicFromTarget(target);
    state.currentScopeStage = inferScopeStage(target);
    state.lastOptionKind = optionKind;

    if (target === "charactersPath") state.characterOverviewDone = true;
    if (target === "characterIdentityPath") state.characterRolesRevealed = true;
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

    Object.keys(ADJACENT_ROOM_FALLBACKS).forEach(function (target) {
      set[target] = true;
      if (ADJACENT_ROOM_FALLBACKS[target] && ADJACENT_ROOM_FALLBACKS[target].target) {
        set[ADJACENT_ROOM_FALLBACKS[target].target] = true;
      }
    });

    state.selectedTargets.forEach(function (target) {
      set[normalizeTarget(target)] = true;
    });

    return Object.keys(set).map(normalizeTarget).filter(function (target, index, list) {
      return target && list.indexOf(target) === index;
    });
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

    META_LANGUAGE_REPLACEMENTS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    PUBLIC_LANGUAGE_REPLACEMENTS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    value = value.replace(/\s+/g, " ").trim();

    var expression = getExpression();
    if (shouldUseExpressionTextSanitizer() && expression && typeof expression.sanitizePublicText === "function") {
      try {
        value = expression.sanitizePublicText(value, {
          contract: CONTRACT,
          currentNode: state.currentNode,
          currentTopic: state.currentTopic,
          currentScopeStage: state.currentScopeStage,
          currentRoomContext: CURRENT_ROOM_CONTEXT,
          currentRoomRole: CURRENT_ROOM_ROLE,
          currentRoomPremise: CURRENT_ROOM_PREMISE,
          routeAuthority: ROUTE_AUTHORITY,
          expressionMode: "narrative_fork_bridge"
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
          requestMode: "freeform",
          optionKind: OPTION_KIND.CONVERSATION,
          bridgeMoment: BRIDGE_MOMENT.ENTRANCE
        }).then(function (response) {
          renderBackbrainResponse(response, null, {
            fallbackTarget: "sharpQuestion",
            fallbackLabel: text
          });
          return response;
        });
      },
      enrich: function (target, label, optionKind) {
        var cleanTarget = normalizeTarget(target);
        return runEnrichedConversation({
          target: cleanTarget,
          label: label || CONVERSATION_LABELS[cleanTarget] || "Tell me more.",
          type: "conversation",
          scopeLane: isNarrativeTarget(cleanTarget) ? "narrative" : "objective",
          scopeStage: inferScopeStage(cleanTarget),
          optionKind: normalizeOptionKind(optionKind || OPTION_KIND.CONVERSATION) || OPTION_KIND.CONVERSATION
        });
      },
      recenter: function () {
        renderLocalNode("recenterNode", { silentVisitor: true });
      },
      rush: rushReveal,
      setBrainEndpoint: function (endpoint) {
        if (endpoint) state.brainEndpoint = endpoint;
      },
      buildForkBridgeContext: buildForkBridgeContext
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
