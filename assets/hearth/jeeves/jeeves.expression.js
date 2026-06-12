// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_COMPASS_EXPRESSION_LOCAL_SPINE_TNT_v6_0_0
// Full-file replacement.
// Client-side Expression authority only.
// One-file Jeeves build: expression + local Compass spine.
//
// Purpose:
// - Build Jeeves as a small-role Compass guide while keeping Hearth as the staging chamber.
// - Preserve the existing Hearth Jeeves frontbrain/API compatibility surface.
// - Give Jeeves an embedded local spine for route/agent handoff decisions.
// - Preserve Elara as the platform-side border Character for Meet Sean / Nine Summits.
// - Preserve Jeeves' three placements: Hearth staging, Compass operation, earned-depth Atrium.
// - Preserve diagnostic restraint: Jeeves explains and routes; he does not diagnose.
//
// Does not own:
// - DOM rendering
// - timers / reading rhythm
// - tap-to-speed behavior
// - route execution
// - API/North meaning authority
// - CSS / HTML shell
// - permanent multi-agent registry extraction
//
// Compatibility exports preserved:
// - window.HEARTH_JEEVES_EXPRESSION
// - window.HEARTH_JEEVES_EXPRESSION_BRIDGE
// - window.HEARTH.jeevesExpression
//

"use strict";

(function attachHearthJeevesExpression(global) {
  const CONTRACT = "HEARTH_JEEVES_COMPASS_EXPRESSION_LOCAL_SPINE_TNT_v6_0_0";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_SOURCE_STABILITY_FRONTAL_LOBE_TNT_v5_4_2";
  const ROOT_EXPRESSION_CONTRACT = "HEARTH_JEEVES_EXPRESSION_ENTRY_STACK_BASE_POOL_ILLUMINATION_TNT_v5_4";
  const FRONTBRAIN_CONTRACT_TARGET = "HEARTH_JEEVES_FRONTBRAIN_SOURCE_IDENTITY_MOTOR_CARRIER_TNT_v25_6_1";
  const API_CONTRACT_TARGET = "HEARTH_JEEVES_BACKBRAIN_SOURCE_STABILITY_EXECUTIVE_COORDINATE_TNT_v5_4_1";
  const VERSION = "6.0.0";

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
    HEARTH: "hearthPath",
    FRONTIER: "frontierPath",
    SCIENTIFIC_LAW: "scientificLawPath",

    TRADITIONAL_COMPASS: "compassPath",
    PRODUCTS: "productsPath",
    LAWS: "lawsPath",
    SEAN: "seanPath",
    UNDERDOG: "underdogPath",
    CHARACTERS: "charactersPath",

    RECENTER: "recenterNode",
    CLEAN_DOOR: "cleanDoor",
    RETURN_FORK: "returnFork",
    RESTART_FORK: "restartFork",
    SHARP_QUESTION: "sharpQuestion"
  });

  const ROUTES = Object.freeze({
    HOME: "home",
    COMPASS: "compass",
    SITE_GUIDE: "siteGuide",
    COHERENCE_DIAGNOSTIC: "coherenceDiagnostic",
    DIAGNOSTIC: "coherenceDiagnostic",
    MEET_SEAN: "meetSean",
    PRODUCTS: "products",
    ARCHCOIN: "products",
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
    ABOUT_UNDERDOG: "aboutUnderdog"
  });

  const ENTRY_STACK_MODES = Object.freeze({
    ENTRANCE: "entrance",
    GUIDED_CHOOSER: "guidedChooser",
    PATH_SAMPLE: "pathSample",
    BASE_POOL: "basePool",
    DIG_DEEPER: "digDeeper",
    PREPARED_DOOR: "preparedDoor",
    RETURN: "return"
  });

  const BASE_POOL_MODES = Object.freeze({
    NONE: "none",
    ESTATE_OVERVIEW: "estateOverview",
    GUIDED_CHOOSER: "guidedChooser",
    PUBLIC_MAP: "publicMap",
    NARRATIVE_PATH: "narrativePath",
    MISSION: "mission",
    INNER_MISSION: "innerMission",
    COMMUNITY_MISSION: "communityMission",
    COLLABORATION_MISSION: "collaborationMission",
    PRACTICAL: "practical",
    DIAGNOSTIC: "diagnostic",
    CHARACTER: "character",
    MIRRORLAND: "mirrorland",
    HEARTH: "hearth",
    FRONTIER: "frontier",
    SCIENTIFIC_LAW: "scientificLaw",
    PRODUCTS: "products",
    GAUGES: "gauges",
    JEEVES_ATRIUM: "jeevesAtrium"
  });

  const ILLUMINATION_MODES = Object.freeze({
    THRESHOLD: "threshold",
    PUBLIC: "public",
    BORDER: "border",
    MIRRORLAND: "mirrorland",
    COMPASS: "compass",
    STAGING: "staging",
    ATRIUM: "atrium",
    DIAGNOSTIC_BOUNDARY: "diagnosticBoundary"
  });

  const GATES = Object.freeze({
    ENTRANCE: "entrance",
    BASE_POOL: "base_pool",
    CHOICE_CLOSURE: "choice_closure",
    PREPARED_DOOR: "prepared_door",
    RETURN: "return",
    DIAGNOSTIC_BOUNDARY: "diagnostic_boundary",
    TRUST_ESCALATION: "trust_escalation"
  });

  const SOURCE_STABILITY_LAW = Object.freeze({
    preserveSourceTarget: true,
    preserveActiveTarget: true,
    preserveSelectedTarget: true,
    preserveConversationCoordinate: true,
    expressionMayShapePublicLanguage: true,
    expressionMayNotInventRouteExecution: true,
    expressionMayNotDiagnoseVisitor: true
  });

  const AGENTS = Object.freeze({
    jeeves: Object.freeze({
      id: "jeeves",
      name: "Jeeves",
      title: "Manor Interface",
      primaryHome: ROUTES.CHARACTERS,
      stagingRoute: ROUTES.HEARTH,
      operatingRoute: ROUTES.COMPASS,
      earnedDepthRoute: ROUTES.CHARACTERS,
      status: "compass_character",
      mode: "compass_to_atrium",
      summary: "Jeeves orients visitors at the Compass, stages in Hearth, and invites persistent visitors into his own Atrium for the longer map.",
      owns: ["compass", "orientation", "handoff", "site map", "atrium", "jeeves", "where to begin"]
    }),
    elara: Object.freeze({
      id: "elara",
      aliases: ["elara", "elora", "laura"],
      name: "Elara",
      title: "Signal Bearer",
      primaryHome: ROUTES.MEET_SEAN,
      secondaryRoutes: [ROUTES.NINE_SUMMITS],
      status: "border_character",
      mode: "platform_side_border",
      summary: "Elara stands on the platform side of the Mirrorland border and explains Sean, the book, the Nine Summits, and the transition into the narrative world.",
      owns: ["sean", "meet sean", "nine summits", "book", "mission", "border", "threshold", "digital platform", "digital reality"]
    }),
    auren: Object.freeze({
      id: "auren",
      aliases: ["auren", "aurin", "auren vale", "aurin vale"],
      name: "Auren Vale",
      title: "Sanctuary Builder",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.PRODUCTS],
      status: "mirrorland_character_with_platform_placement",
      summary: "Auren carries products, Arc Coin, protection, value, custody, and sanctuary logic.",
      owns: ["product", "products", "arc coin", "archcoin", "coin", "value", "investment", "custody", "protection", "sanctuary"]
    }),
    soren: Object.freeze({
      id: "soren",
      name: "Soren",
      title: "Boundary Keeper",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.GAUGES],
      status: "diagnostic_boundary_character",
      summary: "Soren guards diagnostic threshold, proof, gauges, boundaries, and admissibility without letting Jeeves diagnose from the doorway.",
      owns: ["diagnostic", "diagnose", "diagnosis", "coherence", "gauge", "gauges", "proof", "boundary", "admissibility", "score", "test", "assessment", "measure"]
    }),
    dextrion: Object.freeze({
      id: "dextrion",
      aliases: ["dextrion", "dexter"],
      name: "Dextrion",
      title: "Earth-Side Originator",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.H_EARTH, ROUTES.GAUGES],
      status: "lab_character",
      summary: "Dextrion carries H-Earth, lab, anomaly, repair, and experimental crossing logic.",
      owns: ["h-earth", "hearth", "h earth", "lab", "anomaly", "repair", "experiment", "technical", "planet"]
    }),
    alaric: Object.freeze({
      id: "alaric",
      name: "Alaric",
      title: "Field Navigator",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.FRONTIER, ROUTES.FRONTIER_TRAJECTORY],
      status: "frontier_character",
      summary: "Alaric carries Frontier Yard, route choice, navigation, and uncertainty.",
      owns: ["frontier", "yard", "navigation", "uncertainty", "trajectory", "route", "field", "explore"]
    }),
    tarian: Object.freeze({
      id: "tarian",
      name: "Tarian",
      title: "Water Anchor",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.FRONTIER_WATER],
      status: "systems_character",
      summary: "Tarian carries water, continuity, survival systems, and practical infrastructure.",
      owns: ["water", "continuity", "survival", "infrastructure", "systems", "hydrology"]
    }),
    remoteTeam: Object.freeze({
      id: "remoteTeam",
      aliases: ["remote team", "distributed team", "field team"],
      name: "Remote Team",
      title: "Distributed Response Unit",
      primaryHome: ROUTES.CHARACTERS,
      secondaryRoutes: [ROUTES.FRONTIER_VISION],
      status: "distributed_field_unit",
      summary: "The Remote Team carries distributed field, city, climate, deployment, and remote systems.",
      owns: ["remote", "distributed", "city", "climate", "deployment", "field systems", "vision remote", "response"]
    })
  });

  const ROUTE_LABEL_OVERRIDES = Object.freeze({
    home: "Open the Public Entry",
    compass: "Return to the Compass",
    siteGuide: "Open the Website Guide",
    coherenceDiagnostic: "Open the Coherence Diagnostic",
    meetSean: "Meet Elara at the Border",
    products: "Open Auren's Product Door",
    laws: "Open the Law Library",
    scientificLaw: "Open Scientific Law",
    gauges: "Open the Proof Gauges",
    showroom: "Open the Showroom",
    hearth: "Return to Hearth Staging",
    mirrorland: "Approach Mirrorland",
    zionts: "Open ZIONTS",
    audralia: "Open Audralia",
    hEarth: "Open H-Earth",
    frontier: "Open the Frontier Yard",
    frontierWater: "Open Tarian's Water Path",
    frontierVision: "Open the Remote Field Path",
    frontierTrajectory: "Open the Trajectory Path",
    characters: "Enter the Character Atrium",
    controlRoom: "Open the Control Room",
    nineSummits: "Open the Nine Summits Border",
    aboutUnderdog: "Open This Underdog"
  });

  const SPLIT_INTERFACE_COPY = Object.freeze({
    platform: "The platform is the usable surface: pages, routes, tools, diagnostics, products, and navigation.",
    reality: "The digital reality is the inhabited world the platform reveals: the Estate, the Manor, Mirrorland, Characters, rooms, thresholds, and paths.",
    bridge: "You are not only using a website. You are approaching a world through one."
  });

  const BASE_POOL_COPY = Object.freeze({
    estateOverview: [
      "You are at the edge of a large Estate. My work here is not to drag you through every room. It is to find the right door.",
      "Ask plainly. I will either answer at the doorway or introduce you to the person who owns the room."
    ],
    publicMap: [
      "The public site is the platform. The Manor is what begins to appear through it.",
      "The trick is not to confuse the map with the house. I can help with that."
    ],
    narrativePath: [
      "Mirrorland is not the whole website. It is the deeper narrative reality inside it.",
      "Elara stands at the border. The others wait farther in."
    ],
    diagnostic: [
      "I can show you the diagnostic door. I will not diagnose you from the hallway.",
      "That restraint is deliberate. Soren guards that threshold more properly than I do."
    ],
    jeevesAtrium: [
      "Persistent. Good. Most people take the first door.",
      "If you want the longer map, meet me inside the Character Atrium. I will be less brief there."
    ]
  });

  const MISSION_COPY = Object.freeze({
    public: "Sean, the book, and the Nine Summits belong with Elara at the border.",
    border: "That border is where the digital platform begins to become a digital reality.",
    handoff: "I can take you to Elara. She is better placed to explain that part than I am from the Compass."
  });

  const DIAGNOSTIC_BOUNDARY_COPY = Object.freeze({
    refusal: "I will not diagnose you from the doorway.",
    route: "I can explain the purpose of the diagnostic and take you to the proper threshold.",
    soren: "Soren is the Boundary Keeper. That is his room."
  });

  const BRIDGE_COPY = Object.freeze({
    compass: "The Compass is for direction, not for swallowing the entire Estate at once.",
    handoff: "The right answer is usually a room, not a speech.",
    atrium: "If you want my longer answer, you have to stop asking from the doorway."
  });

  const INTRIGUE_COPY = Object.freeze({
    first: "There is more here than a menu. That is the point.",
    second: "A good house reveals itself by sequence, not by flood.",
    third: "I know the map. I am choosing not to throw it at you all at once."
  });

  const INTERFACE_STATE_COPY = Object.freeze({
    listening: "Jeeves is listening.",
    typing: "Jeeves is choosing his words.",
    reading: "Jeeves is letting that settle.",
    ready: "Jeeves is ready.",
    idle: "Jeeves is waiting."
  });

  function shapeConversationFrame(frame, context) {
    const source = frame && typeof frame === "object" ? frame : {};
    const safeContext = normalizeContext(context);
    const coordinate = normalizeCoordinate(source.conversationCoordinate || buildFallbackCoordinate(source.selectedTarget || source.target, safeContext));
    const sourceIdentity = resolveSourceIdentity(source, safeContext, coordinate);
    const target = normalizeTarget(sourceIdentity.activeTarget || sourceIdentity.selectedTarget || sourceIdentity.sourceTarget || source.target || safeContext.target || TARGETS.DIAMOND_GATE_OVERVIEW);
    const intent = normalizeIntent(source.intent || safeContext.intent || safeContext.prompt || safeContext.text || "");
    const agent = inferAgent(target, intent, safeContext, source);
    const escalation = inferEscalation(intent, safeContext, source);
    const basePoolMode = inferBasePoolMode(target, intent, safeContext);
    const illuminationMode = inferIlluminationMode(target, intent, safeContext, basePoolMode);
    const entryStackMode = inferEntryStackMode(target, intent, safeContext, basePoolMode);

    let bubbles = normalizeBubbleList(source.bubbles);
    if (!bubbles.length || shouldOverrideGenericBubbles(bubbles, intent, source, safeContext)) {
      bubbles = shapeGatewayBubbles({
        target,
        intent,
        context: safeContext,
        agent,
        escalation,
        basePoolMode,
        illuminationMode
      });
    } else {
      bubbles = sanitizeBubbleList(bubbles, safeContext);
    }

    const options = shapeOptions(source.options && source.options.length ? source.options : buildDefaultOptions(target, intent, agent, escalation, safeContext), {
      target,
      intent,
      agent,
      escalation,
      basePoolMode,
      illuminationMode,
      entryStackMode,
      sourceTarget: sourceIdentity.sourceTarget,
      activeTarget: target
    });

    const handoffs = inferHandoffs(agent, target, escalation, source);
    const handoffLabels = shapeHandoffLabels(source.handoffLabels || {}, handoffs);
    const conversationCoordinate = ensureSourceStableCoordinate(source.conversationCoordinate || coordinate || buildFallbackCoordinate(target, safeContext), {
      selectedTarget: sourceIdentity.selectedTarget || target,
      sourceTarget: sourceIdentity.sourceTarget || target,
      activeTarget: target,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      payload: source
    });

    return finalizeFrame({
      ...source,
      bubbles,
      options,
      handoffs,
      handoffLabels,
      selectedTarget: sourceIdentity.selectedTarget || target,
      sourceTarget: sourceIdentity.sourceTarget || target,
      activeTarget: target,
      target,
      intent,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      conversationCoordinate,
      choiceClosure: buildChoiceClosure(target, intent, safeContext, basePoolMode, conversationCoordinate),
      expressionContract: CONTRACT,
      expressionVersion: VERSION,
      expressionAgent: agent ? agent.id : "jeeves",
      noRepeat: typeof source.noRepeat === "boolean" ? source.noRepeat : true
    }, safeContext);
  }

  function shapeGatewayBubbles(args) {
    const target = args.target;
    const intent = args.intent;
    const context = args.context;
    const agent = args.agent || AGENTS.jeeves;
    const escalation = args.escalation || 0;

    if (isDiagnosticAssessmentRequest(intent) || agent.id === "soren") {
      return shapeDiagnosticBoundaryFallback(target, inferBasePoolMode(target, intent, context));
    }

    if (escalation >= 2 || agent.id === "jeeves" && /jeeves|atrium|longer|deeper|trust|tell me/i.test(intent)) {
      return [
        "Persistent. Good. Most people take the first door I point to.",
        "If you want my longer answer, do not ask me to give it from the threshold.",
        "Meet me in the Character Atrium. I will show you more of the map from inside."
      ];
    }

    if (agent.id === "elara") {
      return [
        "That belongs with Elara.",
        "She stands at the border: Meet Sean, the Nine Summits, and the first edge of Mirrorland.",
        "I can take you to her. She is the one who should explain Sean, the book, and why the platform begins turning into a world."
      ];
    }

    if (agent.id === "auren") {
      return [
        "That is Auren Vale's side of the house.",
        "Products, Arc Coin, value, custody, and protection should not be explained as decoration.",
        "I can open that door for you."
      ];
    }

    if (agent.id === "soren") {
      return shapeDiagnosticBoundaryFallback(target, inferBasePoolMode(target, intent, context));
    }

    if (agent.id === "dextrion") {
      return [
        "That question points toward Dextrion.",
        "H-Earth, anomaly, repair, and lab logic belong with the Earth-side originator.",
        "I can take you to the H-Earth path."
      ];
    }

    if (agent.id === "alaric") {
      return [
        "That is Frontier territory.",
        "Alaric is better suited to uncertainty, route choice, and the field beyond the Manor paths.",
        "I can send you toward the Frontier Yard."
      ];
    }

    if (agent.id === "tarian") {
      return [
        "Water is not a side hallway here.",
        "Tarian carries continuity, survival systems, and the practical infrastructure beneath the surface.",
        "I can take you to that path."
      ];
    }

    if (agent.id === "remoteTeam") {
      return [
        "That belongs with the Remote Team.",
        "Distributed field systems, city response, climate, and deployment require a different kind of guide.",
        "I can open the remote field path."
      ];
    }

    if (isPlatformRealityRequest(intent)) {
      return [
        SPLIT_INTERFACE_COPY.platform,
        SPLIT_INTERFACE_COPY.reality,
        SPLIT_INTERFACE_COPY.bridge
      ];
    }

    return shapeIntrigueFallback(inferBasePoolMode(target, intent, context));
  }

  function shapeDiagnosticBoundaryFallback(target, basePoolMode) {
    return [
      DIAGNOSTIC_BOUNDARY_COPY.refusal,
      DIAGNOSTIC_BOUNDARY_COPY.route,
      DIAGNOSTIC_BOUNDARY_COPY.soren
    ];
  }

  function shapeIntrigueFallback(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.NARRATIVE_PATH || basePoolMode === BASE_POOL_MODES.MIRRORLAND) {
      return [
        "You are near the story-side of the Estate.",
        "Elara stands at the border. The others wait deeper in Mirrorland.",
        "I can point you to the right threshold."
      ];
    }

    if (basePoolMode === BASE_POOL_MODES.PUBLIC_MAP) {
      return [
        SPLIT_INTERFACE_COPY.platform,
        SPLIT_INTERFACE_COPY.reality,
        "I can help you choose which side of the border to approach first."
      ];
    }

    return [
      "You are at the Compass.",
      "My role is simple: identify the right door, introduce the right guide, and avoid burying you under the whole house at once.",
      "Ask me where you want to go. I will point cleanly."
    ];
  }

  function shapeDeeperFallback(target, intent, context, basePoolMode) {
    return [
      "You are asking for the map behind the map.",
      "I can give you more, but not while we are standing in the doorway.",
      "Meet me in the Character Atrium if you want my longer answer."
    ];
  }

  function shapeCrossPathFallback(context) {
    return [
      "That crosses more than one path.",
      "I can separate the platform, the border, and Mirrorland before we move.",
      "Start with the Compass if you want the cleanest route."
    ];
  }

  function shapeBasePool(target, intent, context, basePoolMode) {
    const mode = normalizeBasePoolKey(basePoolMode || inferBasePoolMode(target, intent, context));
    return (BASE_POOL_COPY[mode] || BASE_POOL_COPY.estateOverview || []).slice();
  }

  function finalizeFrame(frame, context) {
    const source = frame && typeof frame === "object" ? frame : {};
    const target = normalizeTarget(source.target || source.activeTarget || source.selectedTarget || TARGETS.DIAMOND_GATE_OVERVIEW);
    const coordinate = ensureSourceStableCoordinate(source.conversationCoordinate || buildFallbackCoordinate(target, context), {
      selectedTarget: source.selectedTarget || target,
      sourceTarget: source.sourceTarget || target,
      activeTarget: source.activeTarget || target,
      payload: source
    });

    return {
      ...source,
      bubbles: normalizeBubbleList(source.bubbles).slice(0, 6),
      options: dedupeOptions(normalizeOptions(source.options || [], {
        target,
        intent: source.intent || "",
        basePoolMode: source.basePoolMode,
        illuminationMode: source.illuminationMode,
        entryStackMode: source.entryStackMode,
        sourceTarget: source.sourceTarget || target,
        activeTarget: source.activeTarget || target
      })).slice(0, 6),
      handoffs: Array.isArray(source.handoffs) ? dedupeStrings(source.handoffs).slice(0, 6) : [],
      handoffLabels: source.handoffLabels && typeof source.handoffLabels === "object" ? source.handoffLabels : {},
      conversationCoordinate: coordinate,
      noRepeat: typeof source.noRepeat === "boolean" ? source.noRepeat : true
    };
  }

  function shapeOptions(options, context) {
    if (!Array.isArray(options)) return [];
    return options.map(function mapOption(option) {
      return shapeOption(option, context || {});
    }).filter(Boolean);
  }

  function shapeOption(option, context) {
    if (!option || typeof option !== "object") return null;
    const safeContext = context && typeof context === "object" ? context : {};
    const target = normalizeTarget(option.target || safeContext.target || safeContext.activeTarget || TARGETS.DIAMOND_GATE_OVERVIEW);
    const sourceTarget = normalizeTarget(option.sourceTarget || safeContext.sourceTarget || target);
    const activeTarget = normalizeTarget(option.activeTarget || safeContext.activeTarget || target);
    const basePoolMode = option.basePoolMode || safeContext.basePoolMode || inferBasePoolMode(target, option.intent || safeContext.intent || "", safeContext);
    const illuminationMode = option.illuminationMode || safeContext.illuminationMode || inferIlluminationMode(target, option.intent || safeContext.intent || "", safeContext, basePoolMode);
    const entryStackMode = option.entryStackMode || safeContext.entryStackMode || inferEntryStackMode(target, option.intent || safeContext.intent || "", safeContext, basePoolMode);
    const coordinate = ensureSourceStableCoordinate(option.conversationCoordinate || buildOptionCoordinate(option, safeContext), {
      selectedTarget: target,
      sourceTarget,
      activeTarget,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      payload: option
    });

    return {
      ...option,
      label: rewritePromptLabel(option.label || shapeRouteLabel(target, "Continue"), target, safeContext),
      target,
      sourceTarget,
      activeTarget,
      type: safeText(option.type || "conversation"),
      scopeLane: safeText(option.scopeLane || inferScopeLaneFromTarget(target)),
      promptMode: safeText(option.promptMode || inferPromptModeFromPool(basePoolMode)),
      optionKind: safeText(option.optionKind || "conversation_prompt"),
      archetypeAlignment: safeText(option.archetypeAlignment || inferAlignmentFromPool(basePoolMode)),
      bridgeMoment: safeText(option.bridgeMoment || inferBridgeMomentFromContext(safeContext)),
      movementIntent: safeText(option.movementIntent || "ask_jeeves"),
      entryStackMode,
      basePoolMode,
      illuminationMode,
      conversationCoordinate: coordinate,
      gateType: safeText(option.gateType || coordinate.gate || "base_pool"),
      pathFamily: safeText(option.pathFamily || coordinate.path || inferPathFamily(target, option.intent || "", basePoolMode)),
      dialectMode: safeText(option.dialectMode || coordinate.dialect || inferDialectMode(target, option.intent || "", basePoolMode, illuminationMode)),
      contextExpectation: safeText(option.contextExpectation || coordinate.expectation || inferExpectation(coordinate.gate)),
      noRepeat: typeof option.noRepeat === "boolean" ? option.noRepeat : Boolean(coordinate.noRepeat)
    };
  }

  function buildDefaultOptions(target, intent, agent, escalation, context) {
    const options = [];
    const chosen = agent || inferAgent(target, intent, context, {});

    if (chosen && chosen.id !== "jeeves") {
      options.push(makeStaticOption("Why this guide?", target, "explanation", "orientation", "before_knowledge", "ask_jeeves", inferScopeLaneFromTarget(target)));
    }

    if (escalation >= 1) {
      options.push(makeStaticOption("Meet Jeeves inside the Atrium", TARGETS.CHARACTERS, "atrium", "character", "after_persistence", "open_prepared_door", "character"));
    } else {
      options.push(makeDigDeeperOption(target, intent, inferBasePoolMode(target, intent, context), context));
    }

    options.push(makeStaticOption("Return to the Compass", TARGETS.TRADITIONAL_COMPASS, "recenter", "compass", "return", "ask_jeeves", "compass"));
    return options;
  }

  function shapeChoiceClosureOptions(options, target, intent, context, basePoolMode) {
    const source = Array.isArray(options) && options.length ? options : buildDefaultOptions(target, intent, inferAgent(target, intent, context, {}), 0, context);
    return shapeOptions(source, { target, intent, context, basePoolMode });
  }

  function makeDigDeeperOption(target, intent, basePoolMode, context) {
    return makeStaticOption("Ask Jeeves for the longer map", TARGETS.CHARACTERS, "atrium", "character", "after_persistence", "ask_jeeves", "character", {
      activeTarget: TARGETS.CHARACTERS,
      basePoolMode: BASE_POOL_MODES.JEEVES_ATRIUM,
      illuminationMode: ILLUMINATION_MODES.ATRIUM,
      entryStackMode: ENTRY_STACK_MODES.DIG_DEEPER
    });
  }

  function makeReturnForkOption(basePoolMode) {
    return makeStaticOption("Return to the Compass", TARGETS.TRADITIONAL_COMPASS, "recenter", "compass", "return", "ask_jeeves", "compass", {
      basePoolMode: basePoolMode || BASE_POOL_MODES.ESTATE_OVERVIEW,
      illuminationMode: ILLUMINATION_MODES.COMPASS,
      entryStackMode: ENTRY_STACK_MODES.RETURN
    });
  }

  function inferDigDeeperLabel(target, intent, basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return "Ask why Soren owns that threshold";
    if (basePoolMode === BASE_POOL_MODES.MISSION) return "Ask why Elara stands at the border";
    return "Ask Jeeves for the longer map";
  }

  function buildChoiceClosure(target, intent, context, basePoolMode, coordinateArg) {
    return {
      preparedDoorAvailable: true,
      digDeeperAvailable: true,
      returnForkAvailable: true,
      finalChatThreshold: Boolean(coordinateArg && coordinateArg.gate === GATES.TRUST_ESCALATION),
      mode: basePoolMode || inferBasePoolMode(target, intent, context)
    };
  }

  function inferBasePoolMode(target, intent, context) {
    const t = safeText(target).toLowerCase();
    const i = safeText(intent).toLowerCase();
    if (/diagnostic|coherence|gauge|proof|boundary|assess|score|test/.test(t + " " + i)) return BASE_POOL_MODES.DIAGNOSTIC;
    if (/sean|summit|book|mission|elara|elora|laura/.test(t + " " + i)) return BASE_POOL_MODES.MISSION;
    if (/product|archcoin|arc coin|auren|aurin|value|coin/.test(t + " " + i)) return BASE_POOL_MODES.PRODUCTS;
    if (/character|mirror|atrium|jeeves|longer|deeper|trust/.test(t + " " + i)) return BASE_POOL_MODES.JEEVES_ATRIUM;
    if (/mirrorland|narrative|digital reality|story/.test(t + " " + i)) return BASE_POOL_MODES.NARRATIVE_PATH;
    if (/frontier|water|remote|climate|field|tarian|alaric/.test(t + " " + i)) return BASE_POOL_MODES.FRONTIER;
    if (/platform|website|map|guide|compass/.test(t + " " + i)) return BASE_POOL_MODES.PUBLIC_MAP;
    if (/hearth|h-earth|lab|dextrion|dexter/.test(t + " " + i)) return BASE_POOL_MODES.HEARTH;
    return BASE_POOL_MODES.ESTATE_OVERVIEW;
  }

  function inferIlluminationMode(target, intent, context, basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.MISSION) return ILLUMINATION_MODES.BORDER;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return ILLUMINATION_MODES.ATRIUM;
    if (basePoolMode === BASE_POOL_MODES.NARRATIVE_PATH || basePoolMode === BASE_POOL_MODES.MIRRORLAND) return ILLUMINATION_MODES.MIRRORLAND;
    if (basePoolMode === BASE_POOL_MODES.HEARTH) return ILLUMINATION_MODES.STAGING;
    if (basePoolMode === BASE_POOL_MODES.PUBLIC_MAP) return ILLUMINATION_MODES.COMPASS;
    return ILLUMINATION_MODES.THRESHOLD;
  }

  function inferEntryStackMode(target, intent, context, basePoolMode) {
    if (/return|recenter|start over/i.test(safeText(intent))) return ENTRY_STACK_MODES.RETURN;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return ENTRY_STACK_MODES.DIG_DEEPER;
    if (/open|take me|go to|door/i.test(safeText(intent))) return ENTRY_STACK_MODES.PREPARED_DOOR;
    return ENTRY_STACK_MODES.BASE_POOL;
  }

  function rewritePromptLabel(label, target, context) {
    const text = sanitizePublicText(label, context, "label");
    if (!text) return shapeRouteLabel(target, "Continue");
    return text.replace(/backbrain|frontbrain|corpus|retrieval|source ranking/gi, "map");
  }

  function shapeForkBridge(input, context) {
    const text = safeText(input && input.text ? input.text : input);
    return text || "The paths divide here. I can show you which door belongs to which guide.";
  }

  function shapeTransitionBridge(fromTarget, toTarget, context) {
    return "We are moving from " + shapeRouteLabel(fromTarget, "this path") + " toward " + shapeRouteLabel(toTarget, "the next room") + ".";
  }

  function shapePreKnowledgeBridge(input, context) {
    return "Before the answer, choose the room. The room matters here.";
  }

  function shapeBridgeContextLine(context) {
    const mode = context && context.basePoolMode ? context.basePoolMode : "estateOverview";
    if (mode === BASE_POOL_MODES.MISSION) return "This is border work: platform becoming narrative.";
    if (mode === BASE_POOL_MODES.DIAGNOSTIC) return "This is threshold work: explanation, not diagnosis.";
    return "This is Compass work: orientation before depth.";
  }

  function translateAdjacentReason(reason, from, to) {
    return safeText(reason) || "These rooms touch, but they do not do the same work.";
  }

  function withBridgeLead(bubbles, context) {
    const list = normalizeBubbleList(bubbles);
    if (!shouldLeadWithBridge(context)) return list;
    return [shapeBridgeContextLine(context)].concat(list).slice(0, 6);
  }

  function shouldLeadWithBridge(context) {
    return Boolean(context && (context.bridgeMoment || context.basePoolMode === BASE_POOL_MODES.MISSION));
  }

  function shapeRouteLabel(routeId, fallbackLabel) {
    const key = safeText(routeId);
    if (ROUTE_LABEL_OVERRIDES[key]) return ROUTE_LABEL_OVERRIDES[key];
    const targetLabel = String(key || "").replace(/([A-Z])/g, " $1").replace(/Path$/i, "").trim();
    return targetLabel ? targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1) : safeText(fallbackLabel || "Continue");
  }

  function shapeHandoffLabels(labels, handoffs) {
    const output = labels && typeof labels === "object" ? { ...labels } : {};
    (Array.isArray(handoffs) ? handoffs : []).forEach(function addLabel(route) {
      if (!output[route]) output[route] = ROUTE_LABEL_OVERRIDES[route] || shapeRouteLabel(route, "Open Door");
    });
    return output;
  }

  function sanitizePublicText(text, context, mode) {
    return safeText(text)
      .replace(/Mission corpus/gi, "the Estate material")
      .replace(/corpus/gi, "the material here")
      .replace(/retrieval layer/gi, "the right section")
      .replace(/source ranking/gi, "the current path")
      .replace(/backbrain|frontbrain/gi, "engine")
      .replace(/PSALM authority/gi, "guiding structure");
  }

  function softenDiagnosticAssessmentLanguage(text) {
    return safeText(text).replace(/I can diagnose/gi, "I can route").replace(/I will assess/gi, "I will explain the threshold for");
  }

  function isProtectedInterfacePhrase(text) {
    return /compass|atrium|mirrorland|elara|soren|jeeves/i.test(safeText(text));
  }

  function shapeInterfaceState(stateName) {
    const key = safeText(stateName).toLowerCase();
    if (/listen/.test(key)) return INTERFACE_STATE_COPY.listening;
    if (/typ/.test(key)) return INTERFACE_STATE_COPY.typing;
    if (/read/.test(key)) return INTERFACE_STATE_COPY.reading;
    if (/ready/.test(key)) return INTERFACE_STATE_COPY.ready;
    return INTERFACE_STATE_COPY.idle;
  }

  function shouldUseTrainingWheels(context) {
    return Boolean(context && (context.firstVisit || context.entryStackMode === ENTRY_STACK_MODES.ENTRANCE));
  }

  function shapeEntranceOptions() {
    return shapeOptions([
      makeStaticOption("Show me the Compass", TARGETS.TRADITIONAL_COMPASS, "orientation", "compass", "before_knowledge", "ask_jeeves", "compass"),
      makeStaticOption("Meet Elara at the border", TARGETS.SEAN, "border", "mission", "before_knowledge", "open_prepared_door", "mission"),
      makeStaticOption("Enter the Character Atrium", TARGETS.CHARACTERS, "atrium", "character", "after_persistence", "open_prepared_door", "character")
    ], {});
  }

  function shapeGuidedChooserOptions() {
    return shapeEntranceOptions();
  }

  function shapeMissionOptions() {
    return shapeOptions([
      makeStaticOption("Meet Sean with Elara", TARGETS.SEAN, "border", "mission", "before_knowledge", "open_prepared_door", "mission"),
      makeStaticOption("Open the Nine Summits", TARGETS.NARRATIVE_PATH, "border", "mission", "before_knowledge", "open_prepared_door", "mission"),
      makeReturnForkOption(BASE_POOL_MODES.MISSION)
    ], {});
  }

  function shapeDiagnosticBoundaryOptions() {
    return shapeOptions([
      makeStaticOption("Open the Diagnostic", TARGETS.DIAGNOSTIC, "diagnostic", "boundary", "before_knowledge", "open_prepared_door", "diagnostic"),
      makeStaticOption("Open the Proof Gauges", TARGETS.LAWS, "proof", "boundary", "before_knowledge", "open_prepared_door", "diagnostic"),
      makeReturnForkOption(BASE_POOL_MODES.DIAGNOSTIC)
    ], {});
  }

  function makeStaticOption(label, target, promptMode, archetypeAlignment, bridgeMoment, movementIntent, scopeLane, extra) {
    const extension = extra && typeof extra === "object" ? extra : {};
    return {
      ...extension,
      label: safeText(label),
      target: normalizeTarget(target),
      sourceTarget: normalizeTarget(extension.sourceTarget || target),
      activeTarget: normalizeTarget(extension.activeTarget || target),
      type: safeText(extension.type || "conversation"),
      promptMode: safeText(promptMode || extension.promptMode || "orientation"),
      archetypeAlignment: safeText(archetypeAlignment || extension.archetypeAlignment || "compass"),
      bridgeMoment: safeText(bridgeMoment || extension.bridgeMoment || "before_knowledge"),
      movementIntent: safeText(movementIntent || extension.movementIntent || "ask_jeeves"),
      scopeLane: safeText(scopeLane || extension.scopeLane || inferScopeLaneFromTarget(target)),
      optionKind: safeText(extension.optionKind || "conversation_prompt"),
      noRepeat: true
    };
  }

  function inferBridgeMomentFromContext(context) {
    return safeText(context && context.bridgeMoment) || "before_knowledge";
  }

  function inferPromptModeFromPool(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return "diagnostic_boundary";
    if (basePoolMode === BASE_POOL_MODES.MISSION) return "border";
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return "atrium";
    return "orientation";
  }

  function inferAlignmentFromPool(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return "boundary";
    if (basePoolMode === BASE_POOL_MODES.MISSION) return "signal";
    if (basePoolMode === BASE_POOL_MODES.FRONTIER) return "field";
    return "compass";
  }

  function inferScopeLaneFromTarget(target) {
    const text = safeText(target).toLowerCase();
    if (/sean|summit|mission/.test(text)) return "mission";
    if (/diagnostic|gauge|law/.test(text)) return "diagnostic";
    if (/character|mirror|atrium/.test(text)) return "character";
    if (/frontier|water|remote/.test(text)) return "frontier";
    if (/product|coin/.test(text)) return "products";
    return "compass";
  }

  function isTrueGuidedChooser(context, target, intent) {
    return isGuidedChooserRequest(target, intent, context);
  }

  function isGuidedChooserRequest(target, intent, context) {
    return /where|begin|start|choose|guide|compass|lost/i.test(safeText(intent) + " " + safeText(target));
  }

  function isGuidedLabel(label) {
    return /where|begin|start|guide|choose|compass/i.test(safeText(label));
  }

  function isDiagnosticBoundaryState(target, intent, context, basePoolMode, gate) {
    return basePoolMode === BASE_POOL_MODES.DIAGNOSTIC || gate === GATES.DIAGNOSTIC_BOUNDARY || isDiagnosticAssessmentRequest(intent);
  }

  function isDiagnosticAssessmentRequest(text) {
    return /diagnose me|assess me|score me|what archetype am i|which character am i|classify me|test me|coherence score/i.test(safeText(text));
  }

  function isDiagnosticExplanationRequest(text) {
    return /what is the diagnostic|explain.*diagnostic|how.*diagnostic|why.*diagnostic/i.test(safeText(text));
  }

  function isDiagnosticAssessmentTarget(target) {
    return /diagnostic|coherence|assessment|score/i.test(safeText(target));
  }

  function isPlatformRealityRequest(text) {
    return /digital platform|digital reality|website.*world|platform.*reality|mirrorland.*border/i.test(safeText(text));
  }

  function inferAgent(target, intent, context, frame) {
    const haystack = [target, intent, context && context.text, context && context.prompt, frame && frame.prompt, frame && frame.userText].map(safeText).join(" ").toLowerCase();
    const agents = [AGENTS.elara, AGENTS.soren, AGENTS.auren, AGENTS.dextrion, AGENTS.alaric, AGENTS.tarian, AGENTS.remoteTeam];
    for (let i = 0; i < agents.length; i += 1) {
      const agent = agents[i];
      const owns = (agent.owns || []).concat(agent.aliases || []);
      for (let j = 0; j < owns.length; j += 1) {
        if (owns[j] && haystack.indexOf(String(owns[j]).toLowerCase()) >= 0) return agent;
      }
    }
    return AGENTS.jeeves;
  }

  function inferEscalation(intent, context, frame) {
    const text = [intent, context && context.text, context && context.prompt, frame && frame.prompt, frame && frame.lastUserText].map(safeText).join(" ").toLowerCase();
    if (/longer|deeper|inside|atrium|trust|tell me anyway|press|persistent|again|more detail|map behind the map/.test(text)) return 2;
    if (/why|explain|more|not enough|keep going/.test(text)) return 1;
    return 0;
  }

  function inferHandoffs(agent, target, escalation, source) {
    const chosen = agent || AGENTS.jeeves;
    if (Array.isArray(source && source.handoffs) && source.handoffs.length) return source.handoffs;
    if (escalation >= 2) return [ROUTES.CHARACTERS];
    if (chosen.id === "elara") return [ROUTES.MEET_SEAN, ROUTES.NINE_SUMMITS];
    if (chosen.id === "auren") return [ROUTES.PRODUCTS];
    if (chosen.id === "soren") return [ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.GAUGES];
    if (chosen.id === "dextrion") return [ROUTES.H_EARTH, ROUTES.GAUGES];
    if (chosen.id === "alaric") return [ROUTES.FRONTIER];
    if (chosen.id === "tarian") return [ROUTES.FRONTIER_WATER];
    if (chosen.id === "remoteTeam") return [ROUTES.FRONTIER_VISION];
    if (/character|atrium|mirror/i.test(safeText(target))) return [ROUTES.CHARACTERS];
    return [ROUTES.MEET_SEAN, ROUTES.CHARACTERS, ROUTES.COHERENCE_DIAGNOSTIC];
  }

  function shouldOverrideGenericBubbles(bubbles, intent, source, context) {
    if (!Array.isArray(bubbles) || !bubbles.length) return true;
    const joined = bubbles.join(" ").toLowerCase();
    if (/api fallback|fallback|undefined|null/.test(joined)) return true;
    if (isDiagnosticAssessmentRequest(intent) && !/will not diagnose|diagnostic|soren/i.test(joined)) return true;
    return false;
  }

  function normalizeBubbleList(value) {
    if (!Array.isArray(value)) return [];
    return value.map(safeText).filter(Boolean).slice(0, 6);
  }

  function sanitizeBubbleList(value, context) {
    return normalizeBubbleList(value).map(function sanitizeBubble(text) {
      const cleaned = sanitizePublicText(text, context, "bubble");
      return isDiagnosticAssessmentRequest(cleaned) ? softenDiagnosticAssessmentLanguage(cleaned) : cleaned;
    });
  }

  function normalizeOptions(value, context) {
    if (!Array.isArray(value)) return [];
    return value.map(function normalizeOne(option) {
      return shapeOption(option, context || {});
    }).filter(Boolean);
  }

  function normalizeTarget(target) {
    return safeText(target || TARGETS.DIAMOND_GATE_OVERVIEW);
  }

  function normalizeIntent(intent) {
    return safeText(intent);
  }

  function normalizeContext(context) {
    return context && typeof context === "object" ? { ...context } : {};
  }

  function normalizeCoordinate(value) {
    if (!value || typeof value !== "object") return null;
    const target = normalizeTarget(value.target || value.activeTarget || value.sourceTarget || TARGETS.DIAMOND_GATE_OVERVIEW);
    return {
      step: safeNumber(value.step, 5),
      priorStep: safeNumber(value.priorStep, 0),
      gate: safeText(value.gate || GATES.BASE_POOL),
      path: safeText(value.path || inferPathFamily(target, "", value.mode)),
      mode: safeText(value.mode || value.basePoolMode || BASE_POOL_MODES.ESTATE_OVERVIEW),
      dialect: safeText(value.dialect || "estate_host"),
      expectation: safeText(value.expectation || "orientation_before_entry"),
      sourceTarget: normalizeTarget(value.sourceTarget || target),
      activeTarget: normalizeTarget(value.activeTarget || target),
      target,
      destination: safeText(value.destination || ""),
      next: Array.isArray(value.next) ? value.next.map(safeText).filter(Boolean).slice(0, 10) : [],
      noRepeat: typeof value.noRepeat === "boolean" ? value.noRepeat : true
    };
  }

  function normalizeBridgeContext(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function resolveSourceIdentity(frame, context, coordinate) {
    const source = frame && typeof frame === "object" ? frame : {};
    const ctx = context && typeof context === "object" ? context : {};
    const c = normalizeCoordinate(coordinate) || null;
    const selectedTarget = normalizeTarget(source.selectedTarget || ctx.selectedTarget || source.target || (c && c.target) || TARGETS.DIAMOND_GATE_OVERVIEW);
    const sourceTarget = normalizeTarget(source.sourceTarget || ctx.sourceTarget || (c && c.sourceTarget) || selectedTarget);
    const activeTarget = normalizeTarget(source.activeTarget || ctx.activeTarget || (c && c.activeTarget) || selectedTarget);
    return { selectedTarget, sourceTarget, activeTarget };
  }

  function ensureSourceStableCoordinate(coordinate, identityInput) {
    const identity = identityInput && typeof identityInput === "object" ? identityInput : {};
    const base = normalizeCoordinate(coordinate) || buildFallbackCoordinate(identity.activeTarget || identity.selectedTarget || identity.sourceTarget, identity);
    const selectedTarget = normalizeTarget(identity.selectedTarget || base.target || base.activeTarget);
    const sourceTarget = normalizeTarget(identity.sourceTarget || base.sourceTarget || selectedTarget);
    const activeTarget = normalizeTarget(identity.activeTarget || base.activeTarget || selectedTarget);
    const gate = safeText(base.gate || inferGateFromContext(activeTarget, "", identity, identity.entryStackMode, identity.basePoolMode));
    return {
      ...base,
      target: selectedTarget,
      sourceTarget,
      activeTarget,
      gate,
      path: safeText(base.path || inferPathFamily(activeTarget, "", identity.basePoolMode)),
      mode: safeText(base.mode || identity.basePoolMode || BASE_POOL_MODES.ESTATE_OVERVIEW),
      dialect: safeText(base.dialect || inferDialectMode(activeTarget, "", identity.basePoolMode, identity.illuminationMode)),
      expectation: safeText(base.expectation || inferExpectation(gate)),
      noRepeat: typeof base.noRepeat === "boolean" ? base.noRepeat : true
    };
  }

  function sanitizeGuidedChooserState(context) {
    return context && typeof context === "object" ? { ...context, guidedChooserSanitized: true } : { guidedChooserSanitized: true };
  }

  function sanitizeGateForSource(sourceTarget, gate, context) {
    return safeText(gate || GATES.BASE_POOL);
  }

  function sanitizeBasePoolModeForSource(sourceTarget, mode) {
    return safeText(mode || inferBasePoolModeFromTarget(sourceTarget));
  }

  function sanitizeEntryStackModeForSource(sourceTarget, mode) {
    return safeText(mode || ENTRY_STACK_MODES.BASE_POOL);
  }

  function inferBasePoolModeFromTarget(target) {
    return inferBasePoolMode(target, "", {});
  }

  function buildFallbackCoordinate(source, context) {
    const target = normalizeTarget(source || TARGETS.DIAMOND_GATE_OVERVIEW);
    const basePoolMode = inferBasePoolMode(target, "", context || {});
    const illuminationMode = inferIlluminationMode(target, "", context || {}, basePoolMode);
    const gate = inferGateFromContext(target, "", context || {}, ENTRY_STACK_MODES.BASE_POOL, basePoolMode);
    return {
      step: stepForGate(gate),
      priorStep: priorStepForGate(gate),
      gate,
      path: inferPathFamily(target, "", basePoolMode),
      mode: basePoolMode,
      dialect: inferDialectMode(target, "", basePoolMode, illuminationMode),
      expectation: inferExpectation(gate),
      sourceTarget: target,
      activeTarget: target,
      target,
      destination: "",
      next: nextForGate(gate, inferPathFamily(target, "", basePoolMode)),
      noRepeat: isNoRepeatGate(gate)
    };
  }

  function buildOptionCoordinate(option, context) {
    const target = normalizeTarget(option && option.target || context && context.target || TARGETS.DIAMOND_GATE_OVERVIEW);
    const basePoolMode = option && option.basePoolMode || context && context.basePoolMode || inferBasePoolMode(target, option && option.intent || "", context || {});
    const gate = inferGateFromOption(option || {}, target, basePoolMode);
    return {
      step: stepForGate(gate),
      priorStep: priorStepForGate(gate),
      gate,
      path: inferPathFamily(target, option && option.intent || "", basePoolMode),
      mode: basePoolMode,
      dialect: inferDialectMode(target, option && option.intent || "", basePoolMode, option && option.illuminationMode),
      expectation: inferExpectation(gate),
      sourceTarget: normalizeTarget(option && option.sourceTarget || target),
      activeTarget: normalizeTarget(option && option.activeTarget || target),
      target,
      destination: "",
      next: nextForGate(gate, inferPathFamily(target, "", basePoolMode)),
      noRepeat: true
    };
  }

  function inferGateFromContext(target, intent, context, entryStackMode, basePoolMode) {
    if (entryStackMode === ENTRY_STACK_MODES.PREPARED_DOOR) return GATES.PREPARED_DOOR;
    if (entryStackMode === ENTRY_STACK_MODES.RETURN) return GATES.RETURN;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return GATES.DIAGNOSTIC_BOUNDARY;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return GATES.TRUST_ESCALATION;
    return GATES.BASE_POOL;
  }

  function inferGateFromOption(option, target, basePoolMode) {
    if (option && /open_prepared_door|route/i.test(safeText(option.movementIntent) + " " + safeText(option.optionKind))) return GATES.PREPARED_DOOR;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return GATES.TRUST_ESCALATION;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return GATES.DIAGNOSTIC_BOUNDARY;
    return GATES.CHOICE_CLOSURE;
  }

  function inferPathFamily(target, intent, basePoolMode) {
    const mode = safeText(basePoolMode);
    if (mode === BASE_POOL_MODES.MISSION) return "border";
    if (mode === BASE_POOL_MODES.DIAGNOSTIC) return "threshold";
    if (mode === BASE_POOL_MODES.JEEVES_ATRIUM) return "atrium";
    if (mode === BASE_POOL_MODES.FRONTIER) return "frontier";
    if (mode === BASE_POOL_MODES.PRODUCTS) return "value";
    return "center";
  }

  function inferDialectMode(target, intent, basePoolMode, illuminationMode) {
    if (illuminationMode === ILLUMINATION_MODES.BORDER) return "threshold_signal";
    if (illuminationMode === ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY) return "boundary_guard";
    if (illuminationMode === ILLUMINATION_MODES.ATRIUM) return "private_atrium";
    return "estate_host";
  }

  function inferExpectation(gate) {
    if (gate === GATES.PREPARED_DOOR) return "page_visit";
    if (gate === GATES.TRUST_ESCALATION) return "earned_depth";
    if (gate === GATES.DIAGNOSTIC_BOUNDARY) return "diagnostic_referral";
    return "orientation_before_entry";
  }

  function stepForGate(gate) {
    if (gate === GATES.ENTRANCE) return 1;
    if (gate === GATES.CHOICE_CLOSURE) return 4;
    if (gate === GATES.PREPARED_DOOR) return 6;
    if (gate === GATES.TRUST_ESCALATION) return 7;
    return 5;
  }

  function priorStepForGate(gate) {
    return Math.max(0, stepForGate(gate) - 1);
  }

  function nextForGate(gate, path) {
    if (gate === GATES.PREPARED_DOOR) return ["open_door", "return_compass"];
    if (gate === GATES.TRUST_ESCALATION) return ["enter_atrium", "return_compass"];
    return ["choose_door", "ask_jeeves", "return_compass"];
  }

  function isNoRepeatGate(gate) {
    return gate === GATES.PREPARED_DOOR || gate === GATES.TRUST_ESCALATION || gate === GATES.DIAGNOSTIC_BOUNDARY;
  }

  function normalizeBasePoolKey(mode) {
    const text = safeText(mode);
    return text || BASE_POOL_MODES.ESTATE_OVERVIEW;
  }

  function dedupeOptions(options) {
    const seen = Object.create(null);
    const output = [];
    (Array.isArray(options) ? options : []).forEach(function add(option) {
      if (!option || typeof option !== "object") return;
      const key = safeText(option.label).toLowerCase() + "::" + safeText(option.target).toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      output.push(option);
    });
    return output;
  }

  function dedupeStrings(values) {
    const seen = Object.create(null);
    const output = [];
    (Array.isArray(values) ? values : []).forEach(function add(value) {
      const text = safeText(value);
      if (!text || seen[text]) return;
      seen[text] = true;
      output.push(text);
    });
    return output;
  }

  function safeNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : Number(fallback || 0);
  }

  function safeText(value) {
    if (value === null || typeof value === "undefined") return "";
    return String(value).replace(/\s+/g, " ").trim();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    rootExpressionContract: ROOT_EXPRESSION_CONTRACT,
    frontbrainContractTarget: FRONTBRAIN_CONTRACT_TARGET,
    apiContractTarget: API_CONTRACT_TARGET,
    version: VERSION,

    targets: TARGETS,
    routes: ROUTES,
    agents: AGENTS,

    entryStackModes: ENTRY_STACK_MODES,
    basePoolModes: BASE_POOL_MODES,
    illuminationModes: ILLUMINATION_MODES,
    coordinateGates: GATES,
    sourceStabilityLaw: SOURCE_STABILITY_LAW,

    splitInterfaceCopy: SPLIT_INTERFACE_COPY,
    basePoolCopy: BASE_POOL_COPY,
    missionCopy: MISSION_COPY,
    diagnosticBoundaryCopy: DIAGNOSTIC_BOUNDARY_COPY,
    bridgeCopy: BRIDGE_COPY,
    intrigueCopy: INTRIGUE_COPY,
    interfaceStateCopy: INTERFACE_STATE_COPY,

    shapeConversationFrame,
    shapeBasePool,
    shapeOptions,
    shapeOption,
    shapeChoiceClosureOptions,
    shapeForkBridge,
    shapeTransitionBridge,
    shapePreKnowledgeBridge,
    shapeBridgeContextLine,
    shapeRouteLabel,
    shapeHandoffLabels,
    shapeEntranceOptions,
    shapeGuidedChooserOptions,
    shapeMissionOptions,
    shapeDiagnosticBoundaryOptions,
    shapeInterfaceState,

    inferBasePoolMode,
    inferIlluminationMode,
    inferEntryStackMode,
    buildChoiceClosure,

    normalizeCoordinate,
    buildFallbackCoordinate,
    buildOptionCoordinate,

    sanitizePublicText,
    rewritePromptLabel,
    shouldUseTrainingWheels,
    isDiagnosticAssessmentRequest,
    isDiagnosticExplanationRequest,
    isGuidedChooserRequest,
    isTrueGuidedChooser,

    resolveSourceIdentity,
    ensureSourceStableCoordinate,
    sanitizeGuidedChooserState,

    frontalLobeAuthority: true,
    personalityAuthority: true,
    publicLanguageAuthority: true,
    localSpineAuthority: true,
    estateAgentSpineExtractable: true,
    meaningAuthority: false,
    sourceIdentityCreationAuthority: false,
    routeExecutionAuthority: false,
    sourceStabilityCompatible: true,
    oneFileBuildPlan: true
  });

  global.HEARTH_JEEVES_EXPRESSION = api;
  global.HEARTH_JEEVES_EXPRESSION_BRIDGE = api;

  global.HEARTH = global.HEARTH || {};
  global.HEARTH.jeevesExpression = api;

  if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
    global.dispatchEvent(new global.CustomEvent("hearth:jeeves-expression-ready", {
      detail: {
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        rootExpressionContract: ROOT_EXPRESSION_CONTRACT,
        frontbrainContractTarget: FRONTBRAIN_CONTRACT_TARGET,
        apiContractTarget: API_CONTRACT_TARGET,
        version: VERSION,
        entryStackCompatible: true,
        basePoolCompatible: true,
        illuminationCompatible: true,
        choiceClosureCompatible: true,
        coordinateCarrierCompatible: true,
        gatewayAuthorityCompatible: true,
        noRepeatCompatible: true,
        sourceStabilityCompatible: true,
        frontalLobeAuthority: true,
        personalityAuthority: true,
        publicLanguageAuthority: true,
        localSpineAuthority: true,
        estateAgentSpineExtractable: true,
        meaningAuthority: false,
        sourceIdentityCreationAuthority: false,
        routeExecutionAuthority: false,
        oneFileBuildPlan: true
      }
    }));
  }
})(typeof window !== "undefined" ? window : globalThis);
