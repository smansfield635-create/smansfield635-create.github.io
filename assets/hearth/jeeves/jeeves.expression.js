// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_CONVERSATIONAL_CINEMATIC_FORK_BRIDGE_TNT_v5
// Full-file replacement.
// Browser-side only.
// Expression / Narrative Fork Bridge.
// Owns public-facing conversation phrasing, cinematic fork language, transition bridge language,
// text-message-style option shaping, room-entry tone, skeptic/practical/personal prompt softening,
// and prepared-door label refinement.
// Does not own API/North depth, secure model bridge, canon authority, moderation, route execution,
// DOM timing, visual pacing, option disabling, final navigation, or server-side route handling.
//
// v5 renewal:
// - Built downstream from /api/jeeves.js v5 and /showroom/globe/hearth/jeeves/index.js v25.
// - API/North defines prompt grammar.
// - JS renders and carries prompt grammar.
// - Expression makes the thread feel like a human conversation with Jeeves.
// - Conversation options read as complete user texts to Jeeves.
// - Prepared doors remain direct route actions.

"use strict";

(function hearthJeevesExpressionConversationalCinematicForkBridgeV5() {
  const CONTRACT = "HEARTH_JEEVES_EXPRESSION_CONVERSATIONAL_CINEMATIC_FORK_BRIDGE_TNT_v5";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_NARRATIVE_FORK_BRIDGE_TRAVERSAL_TNT_v4";
  const API_CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_CONVERSATION_GRAMMAR_STANDARD_TNT_v5";
  const FRONTBRAIN_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_CONVERSATION_GRAMMAR_RENDERER_API_NORTH_COMPATIBLE_TNT_v25";

  const PROMPT_MODES = Object.freeze({
    STORY: "story_prompt",
    SKEPTIC: "skeptic_prompt",
    PRACTICAL: "practical_prompt",
    PERSONAL: "personal_prompt",
    PROGRESSION: "progression_prompt",
    RECENTER: "recenter_prompt",
    UNKNOWN: "unknown_prompt"
  });

  const OPTION_KINDS = Object.freeze({
    CONVERSATION: "conversation_prompt",
    FORWARD: "forward",
    RETURN: "return",
    PARALLEL: "parallel",
    ROUTE: "route",
    CONTROL: "control"
  });

  const ARCHETYPE_ALIGNMENTS = Object.freeze({
    STORY: "story_entry",
    PROOF: "proof_entry",
    PRACTICAL: "practical_entry",
    PERSONAL: "personal_entry",
    SOURCE: "source_entry",
    BOUNDARY: "boundary_entry",
    SYSTEMS: "systems_entry",
    UNKNOWN: "unknown_entry"
  });

  const BRIDGE_MOMENTS = Object.freeze({
    ENTRANCE: "entrance_fork",
    BEFORE_KNOWLEDGE: "before_knowledge",
    AFTER_KNOWLEDGE: "after_knowledge",
    RETURN: "return_fork",
    PARALLEL: "parallel_crossing",
    RECENTER: "recenter_fork",
    PREPARED_DOOR: "prepared_door",
    NONE: "none"
  });

  const MOVEMENT_INTENTS = Object.freeze({
    ASK: "ask_jeeves",
    CONTINUE: "continue_current_path",
    RETURN: "return_one_threshold",
    CROSS: "cross_to_related_room",
    OPEN: "open_prepared_door",
    RECENTER: "recenter",
    UNKNOWN: "unknown"
  });

  const ROOM_NAMES = Object.freeze({
    hearthPath: "Hearth Mission Control",
    hearthFacilityPath: "Hearth Mission Control",
    hearthConstructPath: "Hearth Mission Control",
    hearthFrontierPath: "Hearth Mission Control",
    hearthLawPath: "Hearth Mission Control",
    mirrorlandPath: "Mirrorland",
    atriumPath: "South Gate",
    atlasPath: "Atlas Study",
    ziontsPath: "ZIONTS",
    hEarthPath: "H-Earth",
    audraliaPath: "Audralia",
    audraliaWorldroomPath: "Audralia Worldroom",
    controlCockpitPath: "Control Cockpit",
    frontierPath: "Frontier Yard",
    frontierSystemsPath: "Frontier Yard",
    frontierEnergyPath: "Energy",
    frontierWaterPath: "Water",
    frontierWastePath: "Waste",
    frontierClosedLoopPath: "Closed Loop",
    frontierInfrastructurePath: "Infrastructure",
    frontierLatticePath: "Lattice",
    frontierUrbanPath: "Urban",
    frontierManualPath: "Manual",
    frontierShimmerPath: "Shimmer",
    frontierTrajectoryPath: "Trajectory",
    frontierVisionPath: "Vision",
    frontierLawPath: "Scientific Law",
    frontierCharactersPath: "Characters Hall",
    scientificLawPath: "Scientific Law",
    scientificLawTheoryPath: "Theory",
    scientificLawEvidencePath: "Evidence",
    scientificLawMeasurePath: "Measure",
    scientificLawLimitsPath: "Limits",
    lawsPath: "Law Library",
    gaugesPath: "Triple G",
    charactersPath: "Characters Hall",
    characterIdentityPath: "Characters Hall",
    characterRelationshipsPath: "Characters Hall",
    characterTensionsPath: "Characters Hall",
    characterMotivesPath: "Characters Hall",
    characterStoryPressurePath: "Characters Hall",
    characterFirstPath: "Characters Hall",
    characterAurenValePath: "Auren Vale",
    characterDextrionPath: "Dextrion",
    characterAlaricPath: "Alaric",
    characterTarianPath: "Tarian",
    characterElaraPath: "Elara",
    characterSorenPath: "Soren",
    characterJeevesPath: "Jeeves",
    characterRemoteTeamPath: "Remote Team",
    characterArchetypeMirrorPath: "Character Archetype Mirror",
    selfLearningPath: "Character Archetype Mirror",
    diagnosticPath: "Coherence Diagnostic",
    futureProfilePath: "Coherence Diagnostic",
    mirrorMePath: "Character Archetype Mirror",
    seanPath: "Meet Sean",
    underdogPath: "This Underdog",
    nineSummitsPath: "Nine Summits",
    nineSummitsBookPath: "The Nine Summits of Love",
    productsPath: "Products",
    compassPath: "Compass",
    whereToStart: "Compass",
    siteGuidePath: "Guide Desk",
    cleanDoor: "Clean Door",
    recenterNode: "Center",
    returnFork: "First Fork",
    restartFork: "First Fork",
    switchTopics: "Guide Desk",
    sharpQuestion: "Jeeves"
  });

  const ROUTE_LABELS = Object.freeze({
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
    frontier: "Open Frontier Yard",
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
  });

  const TARGET_TOPIC = Object.freeze({
    hearthPath: "hearth",
    hearthFacilityPath: "hearth",
    hearthConstructPath: "hearth",
    hearthFrontierPath: "hearth",
    hearthLawPath: "hearth",
    mirrorlandPath: "mirrorland",
    atriumPath: "mirrorland",
    atlasPath: "mirrorland",
    ziontsPath: "mirrorland",
    hEarthPath: "mirrorland",
    audraliaPath: "mirrorland",
    audraliaWorldroomPath: "mirrorland",
    controlCockpitPath: "mirrorland",
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
    characterArchetypeMirrorPath: "characterMirror",
    selfLearningPath: "characterMirror",
    diagnosticPath: "diagnostic",
    futureProfilePath: "diagnostic",
    mirrorMePath: "characterMirror",
    scientificLawPath: "scientificLaw",
    scientificLawTheoryPath: "scientificLaw",
    scientificLawEvidencePath: "scientificLaw",
    scientificLawMeasurePath: "scientificLaw",
    scientificLawLimitsPath: "scientificLaw",
    lawsPath: "law",
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
    frontierLawPath: "scientificLaw",
    frontierCharactersPath: "characters",
    seanPath: "sean",
    underdogPath: "underdog",
    nineSummitsPath: "summits",
    nineSummitsBookPath: "summits",
    productsPath: "products",
    compassPath: "orientation",
    whereToStart: "orientation",
    siteGuidePath: "guide",
    cleanDoor: "recenter",
    recenterNode: "recenter",
    returnFork: "recenter",
    restartFork: "recenter",
    switchTopics: "recenter",
    sharpQuestion: "recenter"
  });

  const ROOM_ENTRANCE_COPY = Object.freeze({
    hearth: [
      "You are inside Hearth Mission Control — the window within the window.",
      "From here, you can ask me what this room is controlling, test whether the path is trustworthy, or move toward the next room."
    ],
    mirrorland: [
      "Mirrorland is where possible futures become visible before they become final.",
      "You can ask what is happening here, what could go wrong, what can still be saved, or who enters the story next."
    ],
    characters: [
      "Before the story can move forward, you need to meet the Characters.",
      "Each one carries a necessary part of the larger story."
    ],
    scientificLaw: [
      "Scientific Law is where a claim has to survive being tested.",
      "You can ask what needs testing, what counts as proof, or what could prove the claim wrong."
    ],
    frontier: [
      "Frontier Yard is where future ideas have to work in the real world.",
      "You can ask which system matters first, what could fail, or whether the claim can survive a real test."
    ],
    sean: [
      "This path leads to the creator behind the estate.",
      "You can ask who Sean is, what shaped the work, or why this road connects to This Underdog."
    ],
    underdog: [
      "This Underdog is where pressure starts becoming a voice.",
      "You can ask what it means, how it connects back to Sean, or what it has to do with you."
    ],
    summits: [
      "Nine Summits is the value road.",
      "You can ask what the climb is, what the book is, or how pressure becomes love, dignity, and free will."
    ],
    orientation: [
      "We can start cleanly.",
      "Ask me where to begin, why to trust the estate, what you can do here, or how any of this connects back to you."
    ]
  });

  const EXACT_TEXT_REPLACEMENTS = Object.freeze([
    [
      "The Character path begins with roles, not names.",
      "Before the story can move forward, you need to meet the Characters."
    ],
    [
      "Mirrorland’s world pressure becomes personal through role functions: protection, origin, route, survival, signal, boundary, sequence, and distribution.",
      "Mirrorland does not stay abstract for long. The story becomes clearer when the Characters enter it."
    ],
    [
      "Mirrorland's world pressure becomes personal through role functions: protection, origin, route, survival, signal, boundary, sequence, and distribution.",
      "Mirrorland does not stay abstract for long. The story becomes clearer when the Characters enter it."
    ],
    [
      "Once those roles are visible, the named Characters can step into frame.",
      "Each Character carries a piece of the larger story. Meeting them shows what this world is really asking for."
    ],
    [
      "The role map comes first.",
      "The Characters step forward one by one."
    ],
    [
      "The first frame is the world pressure: consequence, survival, and possibility.",
      "Every future asks three questions before it becomes real: what breaks, what survives, and what still has a chance."
    ],
    [
      "ZIONTS is consequence. H-Earth is survival. Audralia is possibility.",
      "ZIONTS stands where consequence has a name. H-Earth holds the survival road. Audralia keeps possibility alive."
    ],
    [
      "A Sanctuary Builder protects shelter. An Earth-Side Originator carries the crossing. A Field Navigator reads danger before proof arrives.",
      "Someone has to protect the shelter. Someone has to carry the cost of the crossing. Someone has to see danger before everyone else believes it."
    ],
    [
      "A Water Anchor keeps survival physical. A Signal Bearer makes the future visible. A Boundary Keeper prevents false restoration.",
      "Someone has to keep survival physical. Someone has to make the future visible. Someone has to hold the boundary so restoration does not become a lie."
    ],
    [
      "A Manor Interface sequences the house. A Distributed Response Unit carries survival beyond the manor.",
      "Someone has to keep the house in sequence. Someone has to carry help beyond the manor."
    ]
  ]);

  const PUBLIC_TEXT_SOFTENERS = Object.freeze([
    { pattern: /\bFrame Mirrorland\b/gi, replacement: "Ask about Mirrorland" },
    { pattern: /\bFrame Audralia\b/gi, replacement: "Ask about Audralia" },
    { pattern: /\bFrame Hearth Mission Control\b/gi, replacement: "Ask about Hearth Mission Control" },
    { pattern: /\bFrame the proof path\b/gi, replacement: "Ask how this can be trusted" },
    { pattern: /\bFrame the creator path\b/gi, replacement: "Ask about the creator" },
    { pattern: /\bFrame This Underdog\b/gi, replacement: "Ask about This Underdog" },
    { pattern: /\bReveal the Character role map\b/gi, replacement: "I’d like to meet the Characters" },
    { pattern: /\bReveal the Character path\b/gi, replacement: "I’d like to meet the Characters" },
    { pattern: /\bReveal the three future roads\b/gi, replacement: "Show me the three roads" },
    { pattern: /\bBegin the Character path\b/gi, replacement: "I’d like to meet the Characters" },
    { pattern: /\bBegin the first Character path\b/gi, replacement: "Who should I meet first" },
    { pattern: /\bShow why the Characters matter\b/gi, replacement: "Why do these Characters matter" },
    { pattern: /\bShow why Frontier needs proof\b/gi, replacement: "Can this survive a real test" },
    { pattern: /\bShow why Hearth answers to proof\b/gi, replacement: "Why does this room answer to proof" },
    { pattern: /\bShow why claims become testable\b/gi, replacement: "What needs to be tested" },
    { pattern: /\bPrepare the Character Archetype Mirror\b/gi, replacement: "Which Character might I recognize in myself" },
    { pattern: /\bClarify\b/gi, replacement: "Explain" },
    { pattern: /\brole map\b/gi, replacement: "Character path" },
    { pattern: /\brole functions\b/gi, replacement: "the parts each Character carries" },
    { pattern: /\bsource pressure\b/gi, replacement: "starting pressure" },
    { pattern: /\bworld pressure\b/gi, replacement: "what this world is facing" },
    { pattern: /\broute authority\b/gi, replacement: "door choice" },
    { pattern: /\bprogression state\b/gi, replacement: "next step" },
    { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
    { pattern: /\bunder the hood\b/gi, replacement: "inside the house" },
    { pattern: /\bcanonical\b/gi, replacement: "governing" },
    { pattern: /\bcanon\b/gi, replacement: "governing story" }
  ]);

  const LABEL_OVERRIDES = Object.freeze({
    hearthPath: {
      story_prompt: "Where am I right now?",
      skeptic_prompt: "Why does this room answer to proof?",
      practical_prompt: "What is Hearth controlling?",
      personal_prompt: "Where do I fit from here?",
      progression_prompt: "Where should I go from here?"
    },
    hearthConstructPath: {
      story_prompt: "What is Hearth Mission Control?",
      practical_prompt: "What is Hearth controlling?",
      skeptic_prompt: "Why should I trust this room?"
    },
    hearthLawPath: {
      skeptic_prompt: "Why does this room answer to proof?"
    },
    mirrorlandPath: {
      story_prompt: "What is happening in Mirrorland?",
      skeptic_prompt: "What could go wrong here?",
      practical_prompt: "What can still be saved?",
      personal_prompt: "Where do I fit into Mirrorland?",
      progression_prompt: "What should I see next?"
    },
    atlasPath: {
      story_prompt: "What are the roads inside Mirrorland?",
      progression_prompt: "Show me the three roads."
    },
    ziontsPath: {
      story_prompt: "What happened to ZIONTS?",
      skeptic_prompt: "What could go wrong here?"
    },
    hEarthPath: {
      story_prompt: "What is H-Earth?",
      practical_prompt: "What can still be saved?"
    },
    audraliaPath: {
      story_prompt: "What is Audralia?",
      practical_prompt: "What can be built here?",
      skeptic_prompt: "Can this future survive a real test?"
    },
    charactersPath: {
      story_prompt: "Who are the Characters?",
      skeptic_prompt: "Why do these Characters matter?",
      practical_prompt: "What part does each Character carry?",
      personal_prompt: "Which Character might I recognize in myself?",
      progression_prompt: "I’d like to meet the Characters."
    },
    characterIdentityPath: {
      story_prompt: "Who are the Characters?"
    },
    characterStoryPressurePath: {
      skeptic_prompt: "Why do these Characters matter?"
    },
    characterFirstPath: {
      progression_prompt: "Who should I meet first?"
    },
    characterRelationshipsPath: {
      story_prompt: "How are the Characters connected?"
    },
    characterArchetypeMirrorPath: {
      personal_prompt: "Which Character might I recognize in myself?",
      story_prompt: "What is the Character Archetype Mirror?",
      skeptic_prompt: "Can this define who I am?"
    },
    selfLearningPath: {
      personal_prompt: "What can this show me about myself?"
    },
    scientificLawPath: {
      story_prompt: "What needs to be tested?",
      skeptic_prompt: "Why should I trust this?",
      practical_prompt: "What would count as proof?",
      progression_prompt: "How does a claim move through the test?"
    },
    scientificLawEvidencePath: {
      skeptic_prompt: "What would count as evidence?"
    },
    scientificLawMeasurePath: {
      practical_prompt: "How would this be measured?"
    },
    scientificLawLimitsPath: {
      skeptic_prompt: "What could prove this wrong?"
    },
    lawsPath: {
      story_prompt: "What keeps this honest?",
      skeptic_prompt: "Why should I trust this?",
      practical_prompt: "What boundary does this need?"
    },
    gaugesPath: {
      practical_prompt: "What is working, and what still needs proof?",
      story_prompt: "What does Triple G show?"
    },
    frontierPath: {
      practical_prompt: "What has to work in the real world?",
      story_prompt: "What is Frontier Yard?",
      skeptic_prompt: "Can this survive a real test?",
      progression_prompt: "Which system should I look at first?"
    },
    frontierSystemsPath: {
      story_prompt: "Which system should I look at first?",
      practical_prompt: "What has to work first?"
    },
    frontierLawPath: {
      skeptic_prompt: "Can this survive a real test?"
    },
    seanPath: {
      story_prompt: "Who is Sean Mansfield?",
      personal_prompt: "How does this connect back to the creator?"
    },
    underdogPath: {
      story_prompt: "What is This Underdog?",
      personal_prompt: "What does this have to do with me?",
      progression_prompt: "How does this connect back to Sean?"
    },
    nineSummitsPath: {
      story_prompt: "What is the Nine Summits road?",
      personal_prompt: "What does this climb ask of me?"
    },
    nineSummitsBookPath: {
      story_prompt: "What is The Nine Summits of Love?"
    },
    productsPath: {
      practical_prompt: "What can I actually do here?"
    },
    compassPath: {
      story_prompt: "Where should I start?",
      recenter_prompt: "Can you re-center me?"
    },
    whereToStart: {
      story_prompt: "Where should I start?",
      progression_prompt: "Where should I go from here?"
    },
    siteGuidePath: {
      story_prompt: "How do the rooms connect?"
    },
    cleanDoor: {
      recenter_prompt: "What is the cleanest next door?"
    },
    recenterNode: {
      recenter_prompt: "Can you re-center me?"
    },
    sharpQuestion: {
      recenter_prompt: "Can you ask me a sharper question?"
    },
    returnFork: {
      recenter_prompt: "Can we return to the First Fork?"
    },
    restartFork: {
      recenter_prompt: "Can we start over?"
    }
  });

  const ROUTE_TARGET_BY_ROUTE = Object.freeze({
    hearth: "hearthPath",
    mirrorland: "mirrorlandPath",
    characters: "charactersPath",
    scientificLaw: "scientificLawPath",
    laws: "lawsPath",
    gauges: "gaugesPath",
    frontier: "frontierPath",
    audralia: "audraliaPath",
    hEarth: "hEarthPath",
    zionts: "ziontsPath",
    meetSean: "seanPath",
    aboutUnderdog: "underdogPath",
    nineSummits: "nineSummitsPath",
    products: "productsPath",
    siteGuide: "siteGuidePath",
    compass: "compassPath",
    coherenceDiagnostic: "diagnosticPath"
  });

  function shapeConversationFrame(frame, context) {
    const shaped = cloneFrame(frame);
    const ctx = normalizeContext(context, shaped);
    const topic = inferTopic(shaped, ctx);

    shaped.bubbles = shapeBubbles(shaped.bubbles, ctx, topic);
    shaped.options = shapeOptions(shaped.options || [], ctx);
    shaped.handoffLabels = shapeHandoffLabels(shaped.handoffLabels || {}, shaped.handoffs || [], ctx);

    if (shouldAddDirectionalBridge(shaped, ctx, topic)) {
      const bridge = buildDirectionalBridge(shaped, ctx, topic);
      if (bridge) shaped.bubbles = appendUniqueBubble(shaped.bubbles, bridge);
    }

    return shaped;
  }

  function shapeOptions(options, context) {
    const ctx = normalizeContext(context, null);
    const list = Array.isArray(options) ? options : [];

    return list
      .map(function mapOption(option) {
        return shapeOption(option, ctx);
      })
      .filter(Boolean);
  }

  function shapeOption(option, context) {
    if (!option || typeof option !== "object") return null;

    const ctx = normalizeContext(context, null);
    const next = Object.assign({}, option);

    next.target = sanitizeTarget(next.target || "");
    next.promptMode = normalizePromptMode(next.promptMode || inferPromptMode(next.label, next.target));
    next.optionKind = normalizeOptionKind(next.optionKind || inferOptionKind(next));
    next.archetypeAlignment = normalizeArchetypeAlignment(next.archetypeAlignment || inferAlignment(next.target));
    next.bridgeMoment = normalizeBridgeMoment(next.bridgeMoment || inferBridgeMoment(next.optionKind));
    next.movementIntent = normalizeMovementIntent(next.movementIntent || inferMovementIntent(next.optionKind));

    if (next.optionKind === OPTION_KINDS.ROUTE) {
      next.label = shapeRouteLabel(next.label, next.route || next.target, ctx);
      return next;
    }

    if (next.optionKind === OPTION_KINDS.CONVERSATION || next.optionKind === OPTION_KINDS.FORWARD) {
      next.label = shapeConversationLabel(next.label, next.target, next.promptMode, ctx);
      next.type = next.type || "conversation";
      return next;
    }

    if (next.optionKind === OPTION_KINDS.PARALLEL) {
      next.label = shapeParallelLabel(next.label, next.target, ctx);
      next.type = next.type || "conversation";
      return next;
    }

    if (next.optionKind === OPTION_KINDS.RETURN) {
      next.label = shapeReturnLabel(next.label, next.target, ctx);
      next.type = "control";
      return next;
    }

    if (next.optionKind === OPTION_KINDS.CONTROL) {
      next.label = shapeControlLabel(next.label, next.target, ctx);
      next.type = "control";
      return next;
    }

    next.label = shapeConversationLabel(next.label, next.target, next.promptMode, ctx);
    return next;
  }

  function shapeForkBridge(context) {
    const ctx = normalizeContext(context, null);
    const moment = normalizeBridgeMoment(ctx.bridgeMoment);
    const topic = inferTopic(null, ctx);

    if (moment === BRIDGE_MOMENTS.ENTRANCE) {
      return {
        bubbles: roomEntranceCopy(topic),
        options: []
      };
    }

    if (moment === BRIDGE_MOMENTS.RETURN) {
      return {
        bubbles: ["Of course. We can step back one threshold."],
        options: []
      };
    }

    if (moment === BRIDGE_MOMENTS.RECENTER) {
      return {
        bubbles: ["We can re-center from here."],
        options: []
      };
    }

    if (moment === BRIDGE_MOMENTS.PARALLEL) {
      const targetName = roomName(ctx.selectedTarget || ctx.adjacentTarget);
      return {
        bubbles: [targetName ? "That connects cleanly to " + targetName + "." : "That connects to a nearby room."],
        options: []
      };
    }

    if (moment === BRIDGE_MOMENTS.PREPARED_DOOR) {
      return {
        bubbles: [],
        options: []
      };
    }

    return {
      bubbles: [],
      options: []
    };
  }

  function shapeTransitionBridge(bridge, context) {
    const ctx = normalizeContext(context, null);
    const shaped = bridge && typeof bridge === "object" ? Object.assign({}, bridge) : {};

    shaped.bubbles = shapeBubbles(shaped.bubbles || [], ctx, inferTopic(null, ctx));
    shaped.options = shapeOptions(shaped.options || [], ctx);

    return shaped;
  }

  function shapePreKnowledgeBridge(option, context) {
    const ctx = normalizeContext(context, null);
    const shapedOption = shapeOption(option, ctx);
    const promptMode = shapedOption ? shapedOption.promptMode : ctx.promptMode;
    const target = shapedOption ? shapedOption.target : ctx.selectedTarget;

    if (promptMode === PROMPT_MODES.SKEPTIC) {
      return {
        bubbles: ["Good question. I’ll answer that directly."],
        selectedTarget: target
      };
    }

    if (promptMode === PROMPT_MODES.PRACTICAL) {
      return {
        bubbles: ["Good. Let’s bring this down to what has to work."],
        selectedTarget: target
      };
    }

    if (promptMode === PROMPT_MODES.PERSONAL) {
      return {
        bubbles: ["Good. I’ll keep this reflective, not diagnostic."],
        selectedTarget: target
      };
    }

    return {
      bubbles: [],
      selectedTarget: target
    };
  }

  function shapeRouteLabel(label, routeOrTarget, context) {
    const route = sanitizeRoute(routeOrTarget);
    const target = ROUTE_TARGET_BY_ROUTE[route] || route;
    const known = ROUTE_LABELS[route];

    if (known) return known;

    if (label && /^open\b/i.test(label)) {
      return sanitizePublicText(label, context);
    }

    const name = roomName(target);
    return name ? "Open " + name : sanitizePublicText(label || "Open the next door", context);
  }

  function sanitizePublicText(text, context) {
    let clean = sanitizeText(text);

    EXACT_TEXT_REPLACEMENTS.forEach(function replaceExact(pair) {
      if (clean === pair[0]) clean = pair[1];
    });

    PUBLIC_TEXT_SOFTENERS.forEach(function replaceSoft(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    clean = clean
      .replace(/```/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\bthe Mirrorland\b/g, "Mirrorland")
      .trim();

    return clean;
  }

  function shouldUseTrainingWheels(context) {
    const ctx = normalizeContext(context, null);
    return ctx.bridgeMoment === BRIDGE_MOMENTS.ENTRANCE ||
      ctx.bridgeMoment === BRIDGE_MOMENTS.RECENTER ||
      ctx.promptMode === PROMPT_MODES.RECENTER;
  }

  function shapeBubbles(bubbles, context, topic) {
    const list = Array.isArray(bubbles) ? bubbles : [];

    return list
      .map(function mapBubble(text) {
        return sanitizePublicText(text, context);
      })
      .map(function repairBubble(text) {
        return repairArchitecturalBubble(text, topic);
      })
      .filter(Boolean);
  }

  function repairArchitecturalBubble(text, topic) {
    let clean = text;

    if (topic === "characters") {
      clean = clean
        .replace(/The Character path begins with roles, not names\./gi, "Before the story can move forward, you need to meet the Characters.")
        .replace(/roles are visible/gi, "the Characters are visible")
        .replace(/role functions/gi, "what each Character carries")
        .replace(/role map/gi, "Character path");
    }

    if (topic === "mirrorland") {
      clean = clean
        .replace(/The first frame is/gi, "The first thing to notice is")
        .replace(/world pressure/gi, "what this world is facing");
    }

    if (topic === "scientificLaw" || topic === "law") {
      clean = clean
        .replace(/proof side/gi, "proof path")
        .replace(/western proof side of the estate/gi, "proof path");
    }

    if (topic === "frontier") {
      clean = clean
        .replace(/future-systems yard/gi, "place where future ideas have to work")
        .replace(/applied future-systems yard/gi, "place where future ideas have to work");
    }

    return clean;
  }

  function shouldAddDirectionalBridge(frame, context, topic) {
    if (!frame || !Array.isArray(frame.bubbles) || !frame.bubbles.length) return false;
    if (context.bridgeMoment === BRIDGE_MOMENTS.ENTRANCE) return false;
    if (context.bridgeMoment === BRIDGE_MOMENTS.RETURN) return false;
    if (context.bridgeMoment === BRIDGE_MOMENTS.RECENTER) return false;
    if (frame.source === "frontbrain_boot") return false;
    if (frame.conclusiveState === "complete") return true;
    if (frame.conclusiveState === "route_ready") return true;
    return false;
  }

  function buildDirectionalBridge(frame, context, topic) {
    const promptMode = normalizePromptMode(context.promptMode || frame.promptMode);

    if (topic === "characters") {
      if (promptMode === PROMPT_MODES.SKEPTIC) {
        return "Now you can meet them directly, or use the mirror to see which pattern you recognize in yourself.";
      }
      return "From here, the next move is simple: meet them directly, ask how they connect, or use the mirror.";
    }

    if (topic === "mirrorland") {
      return "From here, you can follow the roads, meet the Characters, or open the next world.";
    }

    if (topic === "scientificLaw" || topic === "law") {
      return "From here, you can test the claim, check the evidence, or take the question to the real world.";
    }

    if (topic === "frontier") {
      return "From here, choose a system or send the claim back through proof.";
    }

    if (topic === "hearth") {
      return "From here, you can stay in Mission Control, cross into Mirrorland, or take the question to proof.";
    }

    if (topic === "underdog") {
      return "From here, you can stay with the pressure voice, meet Sean, or step into the mirror.";
    }

    if (topic === "sean") {
      return "From here, you can stay with the creator path, meet This Underdog, or follow the value road.";
    }

    return "";
  }

  function appendUniqueBubble(bubbles, text) {
    const clean = sanitizeText(text);
    if (!clean) return bubbles;
    if (bubbles.some(function hasBubble(item) { return item === clean; })) return bubbles;
    return bubbles.concat(clean);
  }

  function shapeConversationLabel(label, target, promptMode, context) {
    const cleanTarget = sanitizeTarget(target);
    const cleanMode = normalizePromptMode(promptMode);
    const override = LABEL_OVERRIDES[cleanTarget] && LABEL_OVERRIDES[cleanTarget][cleanMode];

    if (override) return ensureSentence(override);

    let clean = sanitizePublicText(label || "", context);

    if (!clean || isControlPanelLabel(clean)) {
      clean = fallbackConversationLabel(cleanTarget, cleanMode);
    }

    clean = convertCommandFragmentToText(clean, cleanTarget, cleanMode);

    return ensureSentence(clean);
  }

  function shapeParallelLabel(label, target, context) {
    const cleanTarget = sanitizeTarget(target);
    let clean = sanitizePublicText(label || "", context);

    if (!clean || isControlPanelLabel(clean)) {
      const name = roomName(cleanTarget);
      clean = name ? "Can we go to " + name : "Can we cross into the next room";
    }

    clean = clean
      .replace(/^Cross into /i, "Can we go into ")
      .replace(/^Go to /i, "Can we go to ")
      .replace(/^Return to /i, "Can we return to ");

    return ensureSentence(clean);
  }

  function shapeReturnLabel(label, target, context) {
    const cleanTarget = sanitizeTarget(target);
    let clean = sanitizePublicText(label || "", context);

    if (!clean || isControlPanelLabel(clean)) {
      clean = cleanTarget === "returnFork" ? "Can we return to the First Fork" : "Can we step back";
    }

    clean = clean
      .replace(/^Step back one threshold\.?$/i, "Can we step back one threshold")
      .replace(/^Return to the First Fork\.?$/i, "Can we return to the First Fork")
      .replace(/^Go back\.?$/i, "Can we go back");

    return ensureSentence(clean);
  }

  function shapeControlLabel(label, target, context) {
    const cleanTarget = sanitizeTarget(target);
    let clean = sanitizePublicText(label || "", context);

    if (!clean || isControlPanelLabel(clean)) {
      if (cleanTarget === "recenterNode") clean = "Can you re-center me";
      else if (cleanTarget === "cleanDoor") clean = "What is the cleanest next door";
      else if (cleanTarget === "sharpQuestion") clean = "Can you ask me a sharper question";
      else clean = "Can you help me reset this";
    }

    return ensureSentence(clean);
  }

  function fallbackConversationLabel(target, promptMode) {
    const cleanTarget = sanitizeTarget(target);
    const cleanMode = normalizePromptMode(promptMode);
    const topic = inferTopicFromTarget(cleanTarget);

    if (LABEL_OVERRIDES[cleanTarget] && LABEL_OVERRIDES[cleanTarget][cleanMode]) {
      return LABEL_OVERRIDES[cleanTarget][cleanMode];
    }

    if (cleanMode === PROMPT_MODES.SKEPTIC) {
      if (topic === "characters") return "Why do these Characters matter";
      if (topic === "frontier") return "Can this survive a real test";
      if (topic === "scientificLaw" || topic === "law") return "Why should I trust this";
      return "Why should I trust this";
    }

    if (cleanMode === PROMPT_MODES.PRACTICAL) {
      if (topic === "frontier") return "What has to work in the real world";
      if (topic === "hearth") return "What is Hearth controlling";
      return "How does this work in real life";
    }

    if (cleanMode === PROMPT_MODES.PERSONAL) {
      if (topic === "characters" || topic === "characterMirror") return "Which Character might I recognize in myself";
      return "What does this have to do with me";
    }

    if (cleanMode === PROMPT_MODES.PROGRESSION) {
      if (topic === "characters") return "Who should I meet first";
      return "What happens next";
    }

    if (topic === "mirrorland") return "What is happening in Mirrorland";
    if (topic === "characters") return "Who are the Characters";
    if (topic === "hearth") return "Where am I right now";
    if (topic === "frontier") return "What is Frontier Yard";
    if (topic === "scientificLaw") return "What needs to be tested";
    if (topic === "sean") return "Who is Sean Mansfield";
    if (topic === "underdog") return "What is This Underdog";

    return "Can you tell me more";
  }

  function convertCommandFragmentToText(label, target, promptMode) {
    let clean = sanitizeText(label);
    const cleanMode = normalizePromptMode(promptMode);

    clean = clean
      .replace(/^Tell me how /i, "How ")
      .replace(/^Tell me why /i, "Why ")
      .replace(/^Tell me what /i, "What ")
      .replace(/^Tell me who /i, "Who ")
      .replace(/^Tell me about /i, "What is ")
      .replace(/^Show me how /i, "How ")
      .replace(/^Show me why /i, "Why ")
      .replace(/^Show me what /i, "What ")
      .replace(/^Show my /i, "What does my ");

    if (/^Introduce the Characters\.?$/i.test(clean)) {
      clean = "I’d like to meet the Characters";
    }

    if (/^Ask the first mirror question\.?$/i.test(clean)) {
      clean = "Ask me the first mirror question";
    }

    if (/^Take the Coherence Diagnostic\.?$/i.test(clean)) {
      clean = "I want to take the Coherence Diagnostic";
    }

    if (/^Show all Characters\.?$/i.test(clean)) {
      clean = "I’d like to see all the Characters";
    }

    if (/^Re-center me\.?$/i.test(clean)) {
      clean = "Can you re-center me";
    }

    if (/^Choose the next door\.?$/i.test(clean)) {
      clean = "What is the cleanest next door";
    }

    if (/^Start over\.?$/i.test(clean)) {
      clean = "Can we start over";
    }

    if (cleanMode === PROMPT_MODES.PERSONAL && /^What is /.test(clean) && /myself|mirror|Character/i.test(clean) === false) {
      const fallback = fallbackConversationLabel(target, cleanMode);
      if (fallback) clean = fallback;
    }

    return clean;
  }

  function isControlPanelLabel(label) {
    const clean = sanitizeText(label);

    return /^(frame|reveal|prepare|clarify|begin|route|execute|load|render|hydrate|mount)\b/i.test(clean) ||
      /\brole map\b/i.test(clean) ||
      /\brole functions\b/i.test(clean) ||
      /\bsource pressure\b/i.test(clean) ||
      /\bprogression state\b/i.test(clean) ||
      /\barchitecture\b/i.test(clean);
  }

  function ensureSentence(label) {
    const clean = sanitizeText(label);
    if (!clean) return clean;

    if (/[?.!]$/.test(clean)) return clean;

    if (/^(who|what|when|where|why|how|can|could|would|should|is|are|do|does|did)\b/i.test(clean)) {
      return clean + "?";
    }

    return clean + ".";
  }

  function shapeHandoffLabels(labels, handoffs, context) {
    const next = Object.assign({}, labels || {});

    (handoffs || []).forEach(function setLabel(route) {
      const cleanRoute = sanitizeRoute(route);
      next[cleanRoute] = shapeRouteLabel(next[cleanRoute] || ROUTE_LABELS[cleanRoute] || "", cleanRoute, context);
    });

    return next;
  }

  function roomEntranceCopy(topic) {
    const key = topic || "orientation";
    return ROOM_ENTRANCE_COPY[key] || ROOM_ENTRANCE_COPY.orientation;
  }

  function roomName(target) {
    const cleanTarget = sanitizeTarget(target);
    return ROOM_NAMES[cleanTarget] || "";
  }

  function inferTopic(frame, context) {
    if (frame && frame.currentTopic) return normalizeTopic(frame.currentTopic);
    if (frame && frame.intent) return normalizeTopic(frame.intent);
    if (frame && frame.selectedTarget) return inferTopicFromTarget(frame.selectedTarget);
    if (context && context.currentTopic) return normalizeTopic(context.currentTopic);
    if (context && context.selectedTarget) return inferTopicFromTarget(context.selectedTarget);
    if (context && context.currentNode) return inferTopicFromTarget(context.currentNode);
    return "orientation";
  }

  function inferTopicFromTarget(target) {
    return TARGET_TOPIC[sanitizeTarget(target)] || "orientation";
  }

  function normalizeTopic(topic) {
    const clean = sanitizeText(topic);
    if (clean === "laws" || clean === "proof") return "law";
    if (clean === "scientificLaw") return "scientificLaw";
    if (clean === "characterArchetypeMirror") return "characterMirror";
    if (clean === "recenter") return "orientation";
    return clean || "orientation";
  }

  function inferPromptMode(label, target) {
    const text = [label, target].join(" ").toLowerCase();

    if (/\bwhy should i trust|what proves|proof|evidence|wrong|why.*matter|why.*important|survive a real test\b/.test(text)) {
      return PROMPT_MODES.SKEPTIC;
    }

    if (/\breal world|work|practical|system|use|build|frontier|what can i actually do\b/.test(text)) {
      return PROMPT_MODES.PRACTICAL;
    }

    if (/\bme|myself|fit into|recognize|mirror|underdog|diagnostic|archetype\b/.test(text)) {
      return PROMPT_MODES.PERSONAL;
    }

    if (/\bnext|continue|go deeper|who should i meet first|where should i go\b/.test(text)) {
      return PROMPT_MODES.PROGRESSION;
    }

    if (/\brecenter|re-center|return|back|start over|lost\b/.test(text)) {
      return PROMPT_MODES.RECENTER;
    }

    return PROMPT_MODES.STORY;
  }

  function inferOptionKind(option) {
    const label = option && option.label ? option.label : "";
    const text = [label, option && option.target, option && option.type].join(" ").toLowerCase();

    if (option && option.type === "control") return OPTION_KINDS.CONTROL;
    if (/\breturn|back|re-center|recenter|start over\b/.test(text)) return OPTION_KINDS.RETURN;
    if (/\bcross|nearby|related room|go into|go back into\b/.test(text)) return OPTION_KINDS.PARALLEL;
    if (/\bcontinue|next|deeper|what happens next|who should i meet first\b/.test(text)) return OPTION_KINDS.FORWARD;
    if (/^(open|visit|launch|go to)\b/.test(text)) return OPTION_KINDS.ROUTE;

    return OPTION_KINDS.CONVERSATION;
  }

  function inferAlignment(target) {
    const clean = sanitizeTarget(target);

    if (/scientific|law|proof|gauge|evidence|measure|limits/i.test(clean)) return ARCHETYPE_ALIGNMENTS.PROOF;
    if (/frontier|system|energy|water|waste|infrastructure|product/i.test(clean)) return ARCHETYPE_ALIGNMENTS.PRACTICAL;
    if (/archetype|diagnostic|underdog|mirrorMe|self/i.test(clean)) return ARCHETYPE_ALIGNMENTS.PERSONAL;
    if (/sean|summit/i.test(clean)) return ARCHETYPE_ALIGNMENTS.SOURCE;
    if (/hearth|mirrorland|audralia|zionts|characters|hEarth/i.test(clean)) return ARCHETYPE_ALIGNMENTS.STORY;

    return ARCHETYPE_ALIGNMENTS.UNKNOWN;
  }

  function inferBridgeMoment(optionKind) {
    const clean = normalizeOptionKind(optionKind);

    if (clean === OPTION_KINDS.FORWARD) return BRIDGE_MOMENTS.AFTER_KNOWLEDGE;
    if (clean === OPTION_KINDS.RETURN) return BRIDGE_MOMENTS.RETURN;
    if (clean === OPTION_KINDS.PARALLEL) return BRIDGE_MOMENTS.PARALLEL;
    if (clean === OPTION_KINDS.ROUTE) return BRIDGE_MOMENTS.PREPARED_DOOR;
    if (clean === OPTION_KINDS.CONTROL) return BRIDGE_MOMENTS.RECENTER;

    return BRIDGE_MOMENTS.BEFORE_KNOWLEDGE;
  }

  function inferMovementIntent(optionKind) {
    const clean = normalizeOptionKind(optionKind);

    if (clean === OPTION_KINDS.FORWARD) return MOVEMENT_INTENTS.CONTINUE;
    if (clean === OPTION_KINDS.RETURN) return MOVEMENT_INTENTS.RETURN;
    if (clean === OPTION_KINDS.PARALLEL) return MOVEMENT_INTENTS.CROSS;
    if (clean === OPTION_KINDS.ROUTE) return MOVEMENT_INTENTS.OPEN;
    if (clean === OPTION_KINDS.CONTROL) return MOVEMENT_INTENTS.RECENTER;

    return MOVEMENT_INTENTS.ASK;
  }

  function normalizeContext(context, frame) {
    const source = context && typeof context === "object" ? context : {};

    return {
      currentNode: sanitizeTarget(source.currentNode || (frame && frame.selectedTarget) || ""),
      priorNode: sanitizeTarget(source.priorNode || ""),
      selectedTarget: sanitizeTarget(source.selectedTarget || (frame && frame.selectedTarget) || ""),
      selectedLabel: sanitizeText(source.selectedLabel || (frame && frame.selectedLabel) || ""),
      promptMode: normalizePromptMode(source.promptMode || (source.option && source.option.promptMode) || (frame && frame.promptMode)),
      optionKind: normalizeOptionKind(source.optionKind || (source.option && source.option.optionKind) || (frame && frame.optionKind)),
      archetypeAlignment: normalizeArchetypeAlignment(source.archetypeAlignment || (source.option && source.option.archetypeAlignment) || (frame && frame.archetypeAlignment)),
      bridgeMoment: normalizeBridgeMoment(source.bridgeMoment || (source.option && source.option.bridgeMoment) || (frame && frame.bridgeMoment)),
      movementIntent: normalizeMovementIntent(source.movementIntent || (source.option && source.option.movementIntent) || (frame && frame.movementIntent)),
      currentTopic: sanitizeText(source.currentTopic || (frame && frame.currentTopic) || ""),
      currentScopeStage: sanitizeText(source.currentScopeStage || ""),
      adjacentTarget: sanitizeTarget(source.adjacentTarget || ""),
      adjacentLabel: sanitizeText(source.adjacentLabel || ""),
      adjacentReason: sanitizeText(source.adjacentReason || "")
    };
  }

  function normalizePromptMode(value) {
    return Object.values(PROMPT_MODES).includes(value) ? value : PROMPT_MODES.UNKNOWN;
  }

  function normalizeOptionKind(value) {
    return Object.values(OPTION_KINDS).includes(value) ? value : OPTION_KINDS.CONVERSATION;
  }

  function normalizeArchetypeAlignment(value) {
    return Object.values(ARCHETYPE_ALIGNMENTS).includes(value) ? value : ARCHETYPE_ALIGNMENTS.UNKNOWN;
  }

  function normalizeBridgeMoment(value) {
    return Object.values(BRIDGE_MOMENTS).includes(value) ? value : BRIDGE_MOMENTS.NONE;
  }

  function normalizeMovementIntent(value) {
    return Object.values(MOVEMENT_INTENTS).includes(value) ? value : MOVEMENT_INTENTS.UNKNOWN;
  }

  function sanitizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function sanitizeTarget(value) {
    return String(value || "").trim();
  }

  function sanitizeRoute(value) {
    return String(value || "").trim();
  }

  function cloneFrame(frame) {
    const base = frame && typeof frame === "object" ? frame : {};
    return Object.assign({}, base, {
      bubbles: Array.isArray(base.bubbles) ? base.bubbles.slice() : Array.isArray(base.beats) ? base.beats.slice() : [],
      options: Array.isArray(base.options) ? base.options.map(function cloneOption(item) { return Object.assign({}, item); }) : [],
      handoffs: Array.isArray(base.handoffs) ? base.handoffs.slice() : [],
      handoffLabels: base.handoffLabels && typeof base.handoffLabels === "object" ? Object.assign({}, base.handoffLabels) : {},
      routeHints: base.routeHints && typeof base.routeHints === "object" ? Object.assign({}, base.routeHints) : {}
    });
  }

  const api = {
    CONTRACT,
    PREVIOUS_CONTRACT,
    API_CONTRACT,
    FRONTBRAIN_CONTRACT,
    PROMPT_MODES,
    OPTION_KINDS,
    ARCHETYPE_ALIGNMENTS,
    BRIDGE_MOMENTS,
    MOVEMENT_INTENTS,
    ROOM_NAMES,
    shapeConversationFrame,
    shapeOptions,
    shapeOption,
    shapeForkBridge,
    shapeTransitionBridge,
    shapePreKnowledgeBridge,
    shapeRouteLabel,
    sanitizePublicText,
    shouldUseTrainingWheels
  };

  window.HEARTH_JEEVES_EXPRESSION = api;
  window.HEARTH_JEEVES_EXPRESSION_BRIDGE = api;

  if (!window.HEARTH) window.HEARTH = {};
  window.HEARTH.jeevesExpression = api;
})();
