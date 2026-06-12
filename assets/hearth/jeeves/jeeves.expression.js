// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_HOME_INSIDE_MIRRORLAND_EXPRESSION_TNT_v7_1_0
// Full-file replacement.
// Client-side Expression authority only.
// One-file Jeeves expression + local House / Compass spine.
//
// Purpose:
// - Treat Hearth as Jeeves' home page inside the House / Mirrorland.
// - Preserve the Compass as the public access point through "Talk to the House."
// - Preserve Jeeves as the House guide: minimal, useful, mysterious, and restrained.
// - Preserve diagnostic restraint: Jeeves routes to the diagnostic; he does not diagnose.
// - Preserve Atrium as the deeper architecture threshold.
// - Preserve Characters / Portrait Hall as the roster / Character page.
// - Preserve page-local Character logic without requiring heavy cross-page integration.
//
// Does not own:
// - permanent DOM shell ownership
// - CSS / HTML shell
// - timers / reading rhythm
// - tap-to-speed behavior
// - route execution
// - API / North meaning authority
// - permanent multi-agent registry extraction
//
// Compatibility exports preserved:
// - window.HEARTH_JEEVES_EXPRESSION
// - window.HEARTH_JEEVES_EXPRESSION_BRIDGE
// - window.HEARTH.jeevesExpression
//

"use strict";

(function attachHearthJeevesExpression(global) {
  const CONTRACT = "HEARTH_JEEVES_HOME_INSIDE_MIRRORLAND_EXPRESSION_TNT_v7_1_0";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_COMPASS_EXPRESSION_LOCAL_SPINE_TNT_v6_0_0";
  const ROOT_EXPRESSION_CONTRACT = "HEARTH_JEEVES_EXPRESSION_ENTRY_STACK_BASE_POOL_ILLUMINATION_TNT_v5_4";
  const FRONTBRAIN_CONTRACT_TARGET = "HEARTH_JEEVES_FRONTBRAIN_SOURCE_IDENTITY_MOTOR_CARRIER_TNT_v25_6_1";
  const API_CONTRACT_TARGET = "HEARTH_JEEVES_BACKBRAIN_SOURCE_STABILITY_EXECUTIVE_COORDINATE_TNT_v5_4_1";
  const VERSION = "7.1.0";

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
    HEARTH: "hearthPath",
    FRONTIER: "frontierPath",
    SCIENTIFIC_LAW: "scientificLawPath",

    TRADITIONAL_COMPASS: "compassPath",
    SITE_GUIDE: "siteGuidePath",
    PRODUCTS: "productsPath",
    LAWS: "lawsPath",
    GAUGES: "gaugesPath",
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
    ARCHCOIN: "archcoin",
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
    NINE_SUMMITS_OF_LOVE: "nineSummitsOfLove",
    ABOUT_UNDERDOG: "aboutUnderdog"
  });

  const ROUTE_URLS = Object.freeze({
    home: "/home/",
    compass: "/",
    siteGuide: "/site-guide/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    meetSean: "/meet-sean-mansfield/",
    products: "/products/",
    archcoin: "/products/archcoin/",
    laws: "/laws/",
    scientificLaw: "/laws/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    hearth: "/showroom/globe/hearth/",
    mirrorland: "/showroom/",
    zionts: "/showroom/globe/earth/",
    audralia: "/showroom/globe/audralia/",
    hEarth: "/showroom/globe/h-earth/",
    frontier: "/explore/frontier/",
    frontierEnergy: "/explore/frontier/",
    frontierWater: "/explore/frontier/water/",
    frontierWaste: "/explore/frontier/",
    frontierClosedLoop: "/explore/frontier/",
    frontierInfrastructure: "/explore/frontier/",
    frontierLattice: "/explore/frontier/",
    frontierUrban: "/explore/frontier/",
    frontierManual: "/explore/frontier/",
    frontierShimmer: "/explore/frontier/",
    frontierTrajectory: "/explore/frontier/",
    frontierVision: "/explore/frontier/vision-remote/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/audralia/disposition/",
    nineSummits: "/nine-summits/",
    nineSummitsOfLove: "/nine-summits-of-love/",
    aboutUnderdog: "/meet-sean-mansfield/"
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
    HEARTH: "hearth",
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
    expressionMayNotDiagnoseVisitor: true,
    expressionMayNotRenameCanonicalRooms: true
  });

  const ROOM_IDENTITY = Object.freeze({
    publicName: "Hearth",
    houseRole: "Jeeves' room inside the House / Mirrorland",
    compassRelation: "The Compass is where the visitor finds the door. Hearth is where the House answers.",
    publicEntryPhrase: "Talk to the House",
    exitLaw: "A proper House never hides the exit.",
    route: ROUTES.HEARTH,
    routeUrl: ROUTE_URLS.hearth,
    deeperArchitectureRoute: ROUTES.SHOWROOM,
    deeperArchitectureRouteUrl: ROUTE_URLS.showroom,
    characterRosterRoute: ROUTES.CHARACTERS,
    characterRosterRouteUrl: ROUTE_URLS.characters
  });

  const OPENING_SEQUENCE = Object.freeze([
    "Welcome inside the House.",
    "You found me through the Compass. That means you did not wander here by accident.",
    "This is Hearth. For our purposes, it is my room inside Mirrorland.",
    "You do not have to stay here. I can guide you from here.",
    "Ask plainly. I will not give you the whole House at once; I will give you the next door."
  ]);

  const PERSISTENCE_BACKDOOR_COPY = Object.freeze([
    "Persistent. Good. Most visitors take the first door.",
    "You are still prying beyond the rooms I have offered.",
    "Very well. Meet me in the Atrium, and I will show you the longer map."
  ]);

  const AGENTS = Object.freeze({
    jeeves: Object.freeze({
      id: "jeeves",
      name: "Jeeves",
      title: "Manor Interface",
      primaryHome: ROUTES.HEARTH,
      compassAccessRoute: ROUTES.COMPASS,
      houseHomeRoute: ROUTES.HEARTH,
      earnedDepthRoute: ROUTES.SHOWROOM,
      characterRosterRoute: ROUTES.CHARACTERS,
      status: "house_guide",
      mode: "compass_to_hearth_to_atrium",
      summary: "Jeeves receives visitors who choose Talk to the House from the Compass, speaks from Hearth inside Mirrorland, and invites persistent visitors to the Atrium for the longer map.",
      owns: ["jeeves", "house", "hearth", "compass", "orientation", "handoff", "site map", "atrium", "where to begin", "talk to the house"]
    }),

    elara: Object.freeze({
      id: "elara",
      aliases: ["elara", "elora", "laura"],
      name: "Elara",
      title: "Signal Bearer",
      primaryHome: ROUTES.MEET_SEAN,
      secondaryRoutes: [ROUTES.NINE_SUMMITS, ROUTES.NINE_SUMMITS_OF_LOVE],
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
      secondaryRoutes: [ROUTES.PRODUCTS, ROUTES.ARCHCOIN],
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
      owns: ["h-earth", "h earth", "lab", "anomaly", "repair", "experiment", "technical", "planet"]
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
    archcoin: "Open Arc Coin",
    laws: "Open the Law Library",
    scientificLaw: "Open Scientific Law",
    gauges: "Open the Proof Gauges",
    showroom: "Enter the Atrium",
    hearth: "Return to Hearth",
    mirrorland: "Approach Mirrorland",
    zionts: "Open ZIONTS",
    audralia: "Open Audralia",
    hEarth: "Open H-Earth",
    frontier: "Open the Frontier Yard",
    frontierEnergy: "Open the Frontier Yard",
    frontierWater: "Open Tarian's Water Path",
    frontierWaste: "Open the Frontier Yard",
    frontierClosedLoop: "Open the Frontier Yard",
    frontierInfrastructure: "Open the Frontier Yard",
    frontierLattice: "Open the Frontier Yard",
    frontierUrban: "Open the Frontier Yard",
    frontierManual: "Open the Frontier Yard",
    frontierShimmer: "Open the Frontier Yard",
    frontierTrajectory: "Open the Trajectory Path",
    frontierVision: "Open the Remote Field Path",
    characters: "Open the Portrait Hall",
    controlRoom: "Open the Control Room",
    nineSummits: "Open the Nine Summits Border",
    nineSummitsOfLove: "Open The Nine Summits of Love",
    aboutUnderdog: "Open This Underdog"
  });

  const SPLIT_INTERFACE_COPY = Object.freeze({
    platform: "The platform is the usable surface: pages, routes, tools, diagnostics, products, and navigation.",
    reality: "The digital reality is the inhabited world the platform reveals: the Estate, the Manor, Mirrorland, Characters, rooms, thresholds, and paths.",
    bridge: "You are not only using a website. You are approaching a world through one."
  });

  const BASE_POOL_COPY = Object.freeze({
    estateOverview: OPENING_SEQUENCE.slice(),

    publicMap: [
      "The Compass is outside. The House is inside. I stand between them.",
      "The public site gives you routes. Mirrorland gives those routes a world.",
      "I can return you outward to the map or send you farther inward."
    ],

    narrativePath: [
      "Mirrorland is the world behind the public website.",
      "It is not separate from the platform; it is what the platform becomes when the rooms, Characters, laws, diagnostics, products, and story are allowed to connect.",
      "Elara stands near the border. The others wait farther in."
    ],

    diagnostic: [
      "I can show you the diagnostic door. I will not diagnose you from the hallway.",
      "That restraint is deliberate.",
      "Soren guards that threshold more properly than I do."
    ],

    mission: [
      "Sean, the book, and the Nine Summits belong with Elara at the border.",
      "That border is where the public mission begins to turn into story.",
      "I can take you there without pretending it belongs to me."
    ],

    products: [
      "Products, Arc Coin, value, custody, and protection belong with Auren.",
      "That room is not a shop window. It is a custody problem with public handles.",
      "I can open that door."
    ],

    frontier: [
      "The Frontier is for work that has not yet become a settled room.",
      "Alaric handles route choice there. Tarian handles water and continuity. The Remote Team handles distributed field response.",
      "I can send you to the proper edge."
    ],

    hearth: [
      "This is Hearth.",
      "It serves as my room inside the House.",
      "A visitor needs fire before architecture."
    ],

    character: [
      "The Characters are organized separately from the Atrium.",
      "Use the Portrait Hall when you want the roster.",
      "Use the Atrium when you are asking for the longer map behind the rooms."
    ],

    jeevesAtrium: PERSISTENCE_BACKDOOR_COPY.slice()
  });

  const MISSION_COPY = Object.freeze({
    public: "Sean, the book, and the Nine Summits belong with Elara at the border.",
    border: "That border is where the digital platform begins to become a digital reality.",
    handoff: "I can take you to Elara. She is better placed to explain that part than I am from Hearth."
  });

  const DIAGNOSTIC_BOUNDARY_COPY = Object.freeze({
    refusal: "I will not diagnose you from the doorway.",
    route: "I can explain the purpose of the diagnostic and take you to the proper threshold.",
    soren: "Soren is the Boundary Keeper. That is his room."
  });

  const BRIDGE_COPY = Object.freeze({
    compass: "The Compass is where you found the door. Hearth is where the House answers.",
    handoff: "The right answer is usually a room, not a speech.",
    atrium: "If you want my longer answer, meet me in the Atrium."
  });

  const INTRIGUE_COPY = Object.freeze({
    first: "There is more here than a menu. That is the point.",
    second: "A good house reveals itself by sequence, not by flood.",
    third: "I know the map. I am choosing not to throw the whole House at you all at once."
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
    const target = normalizeTarget(sourceIdentity.activeTarget || sourceIdentity.selectedTarget || sourceIdentity.sourceTarget || source.target || safeContext.target || TARGETS.HEARTH);
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
      roomIdentity: ROOM_IDENTITY,
      noRepeat: typeof source.noRepeat === "boolean" ? source.noRepeat : true
    }, safeContext);
  }

  function shapeGatewayBubbles(args) {
    const target = normalizeTarget(args && args.target);
    const intent = normalizeIntent(args && args.intent);
    const context = normalizeContext(args && args.context);
    const agent = args && args.agent ? args.agent : inferAgent(target, intent, context, {});
    const escalation = args && typeof args.escalation === "number" ? args.escalation : inferEscalation(intent, context, {});
    const basePoolMode = args && args.basePoolMode ? args.basePoolMode : inferBasePoolMode(target, intent, context);

    if (isDiagnosticAssessmentRequest(intent) || agent.id === "soren") {
      return shapeDiagnosticBoundaryFallback(target, basePoolMode);
    }

    if (escalation >= 2 || shouldTriggerAtriumBackdoor(intent, target, context)) {
      return PERSISTENCE_BACKDOOR_COPY.slice();
    }

    if (agent.id === "elara") {
      return [
        "That belongs with Elara.",
        "She stands near the border: Meet Sean, the Nine Summits, and the first edge of Mirrorland.",
        "I can take you to her. She is the one who should explain Sean, the book, and why the platform begins turning into a world."
      ];
    }

    if (agent.id === "auren") {
      return [
        "That is Auren Vale's side of the House.",
        "Products, Arc Coin, value, custody, and protection should not be explained as decoration.",
        "I can open that door for you."
      ];
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
        "Alaric is better suited to uncertainty, route choice, and the field beyond the settled Manor paths.",
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

    if (isWhereAmIRequest(intent)) {
      return [
        "You are inside the House, at Hearth.",
        "This is part of Mirrorland's interior path.",
        "The Compass brought you to the door; this room lets me speak with you without crowding the Compass page itself."
      ];
    }

    if (isHouseRequest(intent)) {
      return [
        "The House is the navigable form of the Estate.",
        "The website gives you routes. Mirrorland gives those routes a world.",
        "The House is where the routes begin to feel inhabited."
      ];
    }

    if (isMirrorlandRequest(intent)) {
      return [
        "Mirrorland is the world behind the public website.",
        "It is not separate from the platform; it is what the platform becomes when the rooms, Characters, laws, diagnostics, products, and story are allowed to connect.",
        "You are near the edge of it now."
      ];
    }

    return shapeIntrigueFallback(basePoolMode);
  }

  function shapeDiagnosticBoundaryFallback(target, basePoolMode) {
    return [
      DIAGNOSTIC_BOUNDARY_COPY.refusal,
      DIAGNOSTIC_BOUNDARY_COPY.route,
      DIAGNOSTIC_BOUNDARY_COPY.soren
    ];
  }

  function shapeIntrigueFallback(basePoolMode) {
    const mode = normalizeBasePoolKey(basePoolMode);

    if (mode === BASE_POOL_MODES.NARRATIVE_PATH || mode === BASE_POOL_MODES.MIRRORLAND) {
      return [
        "You are inside Mirrorland at its near edge.",
        "Elara stands near the border. The others wait deeper in the House.",
        "I can point you to the right threshold."
      ];
    }

    if (mode === BASE_POOL_MODES.PUBLIC_MAP) {
      return [
        SPLIT_INTERFACE_COPY.platform,
        SPLIT_INTERFACE_COPY.reality,
        "I can help you choose which side of the border to approach first."
      ];
    }

    if (mode === BASE_POOL_MODES.HEARTH) {
      return BASE_POOL_COPY.hearth.slice();
    }

    if (mode === BASE_POOL_MODES.CHARACTER) {
      return BASE_POOL_COPY.character.slice();
    }

    return [
      "Welcome inside the House.",
      "You found me through the Compass. This is Hearth; it serves as my room inside Mirrorland.",
      "You do not have to stay here. Ask plainly, and I will give you the next door."
    ];
  }

  function shapeDeeperFallback(target, intent, context, basePoolMode) {
    return [
      "You are asking for the map behind the map.",
      "That is not a doorway question anymore. It belongs deeper inside.",
      "Meet me in the Atrium if you want the longer answer."
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
    const target = normalizeTarget(source.target || source.activeTarget || source.selectedTarget || TARGETS.HEARTH);
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
      })).slice(0, 7),
      handoffs: Array.isArray(source.handoffs) ? dedupeStrings(source.handoffs).slice(0, 7) : [],
      handoffLabels: source.handoffLabels && typeof source.handoffLabels === "object" ? source.handoffLabels : {},
      conversationCoordinate: coordinate,
      routeUrls: ROUTE_URLS,
      roomIdentity: ROOM_IDENTITY,
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
    const target = normalizeTarget(option.target || safeContext.target || safeContext.activeTarget || TARGETS.HEARTH);
    const sourceTarget = normalizeTarget(option.sourceTarget || safeContext.sourceTarget || target);
    const activeTarget = normalizeTarget(option.activeTarget || safeContext.activeTarget || target);
    const intent = option.intent || safeContext.intent || "";
    const basePoolMode = option.basePoolMode || safeContext.basePoolMode || inferBasePoolMode(target, intent, safeContext);
    const illuminationMode = option.illuminationMode || safeContext.illuminationMode || inferIlluminationMode(target, intent, safeContext, basePoolMode);
    const entryStackMode = option.entryStackMode || safeContext.entryStackMode || inferEntryStackMode(target, intent, safeContext, basePoolMode);
    const coordinate = ensureSourceStableCoordinate(option.conversationCoordinate || buildOptionCoordinate(option, safeContext), {
      selectedTarget: target,
      sourceTarget,
      activeTarget,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      payload: option
    });

    const routeId = inferRouteIdFromTarget(target, basePoolMode, intent);

    return {
      ...option,
      label: rewritePromptLabel(option.label || shapeRouteLabel(routeId, "Continue"), target, safeContext),
      target,
      routeId,
      routeUrl: option.routeUrl || ROUTE_URLS[routeId] || "",
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
      pathFamily: safeText(option.pathFamily || coordinate.path || inferPathFamily(target, intent, basePoolMode)),
      dialectMode: safeText(option.dialectMode || coordinate.dialect || inferDialectMode(target, intent, basePoolMode, illuminationMode)),
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

    if (escalation >= 2 || shouldTriggerAtriumBackdoor(intent, target, context)) {
      options.push(makeStaticOption("Enter the Atrium", TARGETS.ATRIUM, "atrium", "character", "after_persistence", "open_prepared_door", "character", {
        activeTarget: TARGETS.ATRIUM,
        routeId: ROUTES.SHOWROOM,
        routeUrl: ROUTE_URLS.showroom,
        basePoolMode: BASE_POOL_MODES.JEEVES_ATRIUM,
        illuminationMode: ILLUMINATION_MODES.ATRIUM,
        entryStackMode: ENTRY_STACK_MODES.DIG_DEEPER
      }));
    } else {
      options.push(makeDigDeeperOption(target, intent, inferBasePoolMode(target, intent, context), context));
    }

    options.push(makeStaticOption("Return to the Compass", TARGETS.TRADITIONAL_COMPASS, "recenter", "compass", "return", "open_prepared_door", "compass", {
      routeId: ROUTES.COMPASS,
      routeUrl: ROUTE_URLS.compass
    }));

    return options;
  }

  function shapeChoiceClosureOptions(options, target, intent, context, basePoolMode) {
    const source = Array.isArray(options) && options.length ? options : buildDefaultOptions(target, intent, inferAgent(target, intent, context, {}), 0, context);
    return shapeOptions(source, { target, intent, context, basePoolMode });
  }

  function makeDigDeeperOption(target, intent, basePoolMode, context) {
    return makeStaticOption("Ask Jeeves for the longer map", TARGETS.ATRIUM, "atrium", "character", "after_persistence", "ask_jeeves", "character", {
      activeTarget: TARGETS.ATRIUM,
      routeId: ROUTES.SHOWROOM,
      routeUrl: ROUTE_URLS.showroom,
      basePoolMode: BASE_POOL_MODES.JEEVES_ATRIUM,
      illuminationMode: ILLUMINATION_MODES.ATRIUM,
      entryStackMode: ENTRY_STACK_MODES.DIG_DEEPER
    });
  }

  function makeReturnForkOption(basePoolMode) {
    return makeStaticOption("Return to the Compass", TARGETS.TRADITIONAL_COMPASS, "recenter", "compass", "return", "open_prepared_door", "compass", {
      routeId: ROUTES.COMPASS,
      routeUrl: ROUTE_URLS.compass,
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
    const haystack = [
      safeText(target),
      safeText(intent),
      safeText(context && context.text),
      safeText(context && context.prompt)
    ].join(" ").toLowerCase();

    if (/diagnostic|coherence|gauge|proof|boundary|assess|score|test|classify/.test(haystack)) return BASE_POOL_MODES.DIAGNOSTIC;
    if (/sean|summit|book|mission|elara|elora|laura/.test(haystack)) return BASE_POOL_MODES.MISSION;
    if (/product|archcoin|arc coin|auren|aurin|value|coin|custody|protection/.test(haystack)) return BASE_POOL_MODES.PRODUCTS;
    if (/atrium|jeeves|longer|deeper|trust|map behind the map|architecture behind|house behind|prying|persistent/.test(haystack)) return BASE_POOL_MODES.JEEVES_ATRIUM;
    if (/character|portrait hall|roster|dossier/.test(haystack)) return BASE_POOL_MODES.CHARACTER;
    if (/mirrorland|narrative|digital reality|story|house|estate/.test(haystack)) return BASE_POOL_MODES.NARRATIVE_PATH;
    if (/frontier|water|remote|climate|field|tarian|alaric|deployment/.test(haystack)) return BASE_POOL_MODES.FRONTIER;
    if (/platform|website|map|guide|compass|return/.test(haystack)) return BASE_POOL_MODES.PUBLIC_MAP;
    if (/hearth|home page|home room/.test(haystack)) return BASE_POOL_MODES.HEARTH;
    if (/h-earth|h earth|lab|dextrion|dexter|anomaly|repair/.test(haystack)) return BASE_POOL_MODES.HEARTH;

    return BASE_POOL_MODES.ESTATE_OVERVIEW;
  }

  function inferIlluminationMode(target, intent, context, basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.MISSION) return ILLUMINATION_MODES.BORDER;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return ILLUMINATION_MODES.ATRIUM;
    if (basePoolMode === BASE_POOL_MODES.NARRATIVE_PATH || basePoolMode === BASE_POOL_MODES.MIRRORLAND) return ILLUMINATION_MODES.MIRRORLAND;
    if (basePoolMode === BASE_POOL_MODES.HEARTH) return ILLUMINATION_MODES.HEARTH;
    if (basePoolMode === BASE_POOL_MODES.PUBLIC_MAP) return ILLUMINATION_MODES.COMPASS;
    return ILLUMINATION_MODES.THRESHOLD;
  }

  function inferEntryStackMode(target, intent, context, basePoolMode) {
    const text = safeText(intent);
    if (/return|recenter|start over|back to compass/i.test(text)) return ENTRY_STACK_MODES.RETURN;
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return ENTRY_STACK_MODES.DIG_DEEPER;
    if (/open|take me|go to|door|enter/i.test(text)) return ENTRY_STACK_MODES.PREPARED_DOOR;
    return ENTRY_STACK_MODES.BASE_POOL;
  }

  function rewritePromptLabel(label, target, context) {
    const text = sanitizePublicText(label, context, "label");
    if (!text) return shapeRouteLabel(inferRouteIdFromTarget(target), "Continue");
    return text.replace(/backbrain|frontbrain|corpus|retrieval|source ranking/gi, "map");
  }

  function shapeForkBridge(input, context) {
    const text = safeText(input && input.text ? input.text : input);
    return text || "The paths divide here. I can show you which door belongs to which guide.";
  }

  function shapeTransitionBridge(fromTarget, toTarget, context) {
    return "We are moving from " + shapeRouteLabel(inferRouteIdFromTarget(fromTarget), "this path") + " toward " + shapeRouteLabel(inferRouteIdFromTarget(toTarget), "the next room") + ".";
  }

  function shapePreKnowledgeBridge(input, context) {
    return "Before the answer, choose the room. The room matters here.";
  }

  function shapeBridgeContextLine(context) {
    const mode = context && context.basePoolMode ? context.basePoolMode : "estateOverview";
    if (mode === BASE_POOL_MODES.MISSION) return "This is border work: platform becoming narrative.";
    if (mode === BASE_POOL_MODES.DIAGNOSTIC) return "This is threshold work: explanation, not diagnosis.";
    if (mode === BASE_POOL_MODES.JEEVES_ATRIUM) return "This is Atrium work: the longer map behind the rooms.";
    return "This is House work: orientation before depth.";
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

    const targetLabel = String(key || "")
      .replace(/([A-Z])/g, " $1")
      .replace(/Path$/i, "")
      .replace(/_/g, " ")
      .trim();

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
      .replace(/PSALM authority/gi, "guiding structure")
      .replace(/Character Chamber/gi, "Atrium")
      .replace(/Character Atrium/gi, "Atrium")
      .replace(/Hearth Staging/gi, "Hearth")
      .replace(/staging chamber/gi, "room inside the House");
  }

  function softenDiagnosticAssessmentLanguage(text) {
    return safeText(text)
      .replace(/I can diagnose/gi, "I can route")
      .replace(/I will assess/gi, "I will explain the threshold for")
      .replace(/I can classify/gi, "I can route");
  }

  function isProtectedInterfacePhrase(text) {
    return /compass|atrium|mirrorland|hearth|elara|soren|jeeves/i.test(safeText(text));
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
      makeStaticOption("Where am I?", TARGETS.HEARTH, "orientation", "hearth", "before_knowledge", "ask_jeeves", "compass", {
        routeId: ROUTES.HEARTH,
        routeUrl: ROUTE_URLS.hearth
      }),
      makeStaticOption("Show me the map", TARGETS.SITE_GUIDE, "orientation", "compass", "before_knowledge", "open_prepared_door", "compass", {
        routeId: ROUTES.SITE_GUIDE,
        routeUrl: ROUTE_URLS.siteGuide
      }),
      makeStaticOption("Take me to the Diagnostic", TARGETS.DIAGNOSTIC, "diagnostic_boundary", "boundary", "before_knowledge", "open_prepared_door", "diagnostic", {
        routeId: ROUTES.COHERENCE_DIAGNOSTIC,
        routeUrl: ROUTE_URLS.coherenceDiagnostic
      }),
      makeStaticOption("Meet the Characters", TARGETS.CHARACTERS, "character", "character", "before_knowledge", "open_prepared_door", "character", {
        routeId: ROUTES.CHARACTERS,
        routeUrl: ROUTE_URLS.characters
      }),
      makeStaticOption("Return to the Compass", TARGETS.TRADITIONAL_COMPASS, "recenter", "compass", "return", "open_prepared_door", "compass", {
        routeId: ROUTES.COMPASS,
        routeUrl: ROUTE_URLS.compass
      })
    ], {});
  }

  function shapeGuidedChooserOptions() {
    return shapeEntranceOptions();
  }

  function shapeMissionOptions() {
    return shapeOptions([
      makeStaticOption("Meet Sean with Elara", TARGETS.SEAN, "border", "mission", "before_knowledge", "open_prepared_door", "mission", {
        routeId: ROUTES.MEET_SEAN,
        routeUrl: ROUTE_URLS.meetSean
      }),
      makeStaticOption("Open the Nine Summits", TARGETS.NARRATIVE_PATH, "border", "mission", "before_knowledge", "open_prepared_door", "mission", {
        routeId: ROUTES.NINE_SUMMITS,
        routeUrl: ROUTE_URLS.nineSummits
      }),
      makeStaticOption("Open The Nine Summits of Love", TARGETS.NARRATIVE_PATH, "border", "mission", "before_knowledge", "open_prepared_door", "mission", {
        routeId: ROUTES.NINE_SUMMITS_OF_LOVE,
        routeUrl: ROUTE_URLS.nineSummitsOfLove
      }),
      makeReturnForkOption(BASE_POOL_MODES.MISSION)
    ], {});
  }

  function shapeDiagnosticBoundaryOptions() {
    return shapeOptions([
      makeStaticOption("Open the Diagnostic", TARGETS.DIAGNOSTIC, "diagnostic", "boundary", "before_knowledge", "open_prepared_door", "diagnostic", {
        routeId: ROUTES.COHERENCE_DIAGNOSTIC,
        routeUrl: ROUTE_URLS.coherenceDiagnostic
      }),
      makeStaticOption("Open the Proof Gauges", TARGETS.GAUGES, "proof", "boundary", "before_knowledge", "open_prepared_door", "diagnostic", {
        routeId: ROUTES.GAUGES,
        routeUrl: ROUTE_URLS.gauges
      }),
      makeReturnForkOption(BASE_POOL_MODES.DIAGNOSTIC)
    ], {});
  }

  function makeStaticOption(label, target, promptMode, archetypeAlignment, bridgeMoment, movementIntent, scopeLane, extra) {
    const extension = extra && typeof extra === "object" ? extra : {};
    const normalizedTarget = normalizeTarget(target);
    const routeId = extension.routeId || inferRouteIdFromTarget(normalizedTarget, extension.basePoolMode, label);

    return {
      ...extension,
      label: safeText(label),
      target: normalizedTarget,
      routeId,
      routeUrl: extension.routeUrl || ROUTE_URLS[routeId] || "",
      sourceTarget: normalizeTarget(extension.sourceTarget || normalizedTarget),
      activeTarget: normalizeTarget(extension.activeTarget || normalizedTarget),
      type: safeText(extension.type || "conversation"),
      promptMode: safeText(promptMode || extension.promptMode || "orientation"),
      archetypeAlignment: safeText(archetypeAlignment || extension.archetypeAlignment || "compass"),
      bridgeMoment: safeText(bridgeMoment || extension.bridgeMoment || "before_knowledge"),
      movementIntent: safeText(movementIntent || extension.movementIntent || "ask_jeeves"),
      scopeLane: safeText(scopeLane || extension.scopeLane || inferScopeLaneFromTarget(normalizedTarget)),
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
    if (basePoolMode === BASE_POOL_MODES.HEARTH) return "hearth";
    return "orientation";
  }

  function inferAlignmentFromPool(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC) return "boundary";
    if (basePoolMode === BASE_POOL_MODES.MISSION) return "signal";
    if (basePoolMode === BASE_POOL_MODES.FRONTIER) return "field";
    if (basePoolMode === BASE_POOL_MODES.JEEVES_ATRIUM) return "atrium";
    return "compass";
  }

  function inferScopeLaneFromTarget(target) {
    const text = safeText(target).toLowerCase();

    if (/sean|summit|mission/.test(text)) return "mission";
    if (/diagnostic|gauge|law/.test(text)) return "diagnostic";
    if (/character|portrait/.test(text)) return "character";
    if (/atrium|mirror|hearth|house/.test(text)) return "mirrorland";
    if (/frontier|water|remote/.test(text)) return "frontier";
    if (/product|coin/.test(text)) return "products";

    return "compass";
  }

  function isTrueGuidedChooser(context, target, intent) {
    return isGuidedChooserRequest(target, intent, context);
  }

  function isGuidedChooserRequest(target, intent, context) {
    return /where|begin|start|choose|guide|compass|lost|map/i.test(safeText(intent) + " " + safeText(target));
  }

  function isGuidedLabel(label) {
    return /where|begin|start|guide|choose|compass|map/i.test(safeText(label));
  }

  function isDiagnosticBoundaryState(target, intent, context, basePoolMode, gate) {
    return basePoolMode === BASE_POOL_MODES.DIAGNOSTIC || gate === GATES.DIAGNOSTIC_BOUNDARY || isDiagnosticAssessmentRequest(intent);
  }

  function isDiagnosticAssessmentRequest(text) {
    return /diagnose me|assess me|score me|what archetype am i|which character am i|classify me|test me|coherence score|rate me/i.test(safeText(text));
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

  function isWhereAmIRequest(text) {
    return /where am i|what is this place|what room|where are we|am i in mirrorland/i.test(safeText(text));
  }

  function isHouseRequest(text) {
    return /what is the house|explain the house|talk to the house|inside the house|house mean/i.test(safeText(text));
  }

  function isMirrorlandRequest(text) {
    return /what is mirrorland|explain mirrorland|mirrorland mean|inside mirrorland/i.test(safeText(text));
  }

  function shouldTriggerAtriumBackdoor(intent, target, context) {
    const text = [
      safeText(intent),
      safeText(target),
      safeText(context && context.text),
      safeText(context && context.prompt)
    ].join(" ").toLowerCase();

    return /longer map|map behind the map|architecture behind|house behind|still prying|prying|persistent|tell me anyway|deeper dive|behind the rooms|not satisfied|more than rooms|full architecture/.test(text);
  }

  function inferAgent(target, intent, context, frame) {
    const haystack = [
      target,
      intent,
      context && context.text,
      context && context.prompt,
      frame && frame.prompt,
      frame && frame.userText
    ].map(safeText).join(" ").toLowerCase();

    const agents = [
      AGENTS.elara,
      AGENTS.soren,
      AGENTS.auren,
      AGENTS.dextrion,
      AGENTS.alaric,
      AGENTS.tarian,
      AGENTS.remoteTeam
    ];

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
    const text = [
      intent,
      context && context.text,
      context && context.prompt,
      frame && frame.prompt,
      frame && frame.lastUserText
    ].map(safeText).join(" ").toLowerCase();

    if (/longer|deeper|inside|atrium|trust|tell me anyway|press|persistent|again|more detail|map behind the map|architecture behind|still prying|not satisfied/.test(text)) return 2;
    if (/why|explain|more|not enough|keep going|what else/.test(text)) return 1;

    return 0;
  }

  function inferHandoffs(agent, target, escalation, source) {
    const chosen = agent || AGENTS.jeeves;

    if (Array.isArray(source && source.handoffs) && source.handoffs.length) return source.handoffs;
    if (escalation >= 2) return [ROUTES.SHOWROOM];

    if (chosen.id === "elara") return [ROUTES.MEET_SEAN, ROUTES.NINE_SUMMITS, ROUTES.NINE_SUMMITS_OF_LOVE];
    if (chosen.id === "auren") return [ROUTES.PRODUCTS, ROUTES.ARCHCOIN];
    if (chosen.id === "soren") return [ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.GAUGES];
    if (chosen.id === "dextrion") return [ROUTES.H_EARTH, ROUTES.GAUGES];
    if (chosen.id === "alaric") return [ROUTES.FRONTIER];
    if (chosen.id === "tarian") return [ROUTES.FRONTIER_WATER];
    if (chosen.id === "remoteTeam") return [ROUTES.FRONTIER_VISION];

    if (/atrium|longer|deeper|architecture/i.test(safeText(target))) return [ROUTES.SHOWROOM];
    if (/character|portrait|roster/i.test(safeText(target))) return [ROUTES.CHARACTERS];

    return [ROUTES.SITE_GUIDE, ROUTES.COHERENCE_DIAGNOSTIC, ROUTES.SHOWROOM, ROUTES.CHARACTERS];
  }

  function shouldOverrideGenericBubbles(bubbles, intent, source, context) {
    if (!Array.isArray(bubbles) || !bubbles.length) return true;

    const joined = bubbles.join(" ").toLowerCase();

    if (/api fallback|fallback|undefined|null/.test(joined)) return true;
    if (/staging chamber|character chamber|character atrium/.test(joined)) return true;
    if (isDiagnosticAssessmentRequest(intent) && !/will not diagnose|diagnostic|soren/i.test(joined)) return true;

    return false;
  }

  function normalizeBubbleList(value) {
    if (!Array.isArray(value)) return [];
    return value.map(safeText).filter(Boolean).slice(0, 7);
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
    return safeText(target || TARGETS.HEARTH);
  }

  function normalizeIntent(intent) {
    return safeText(intent);
  }

  function normalizeContext(context) {
    return context && typeof context === "object" ? { ...context } : {};
  }

  function normalizeCoordinate(value) {
    if (!value || typeof value !== "object") return null;

    const target = normalizeTarget(value.target || value.activeTarget || value.sourceTarget || TARGETS.HEARTH);

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

    const selectedTarget = normalizeTarget(source.selectedTarget || ctx.selectedTarget || source.target || (c && c.target) || TARGETS.HEARTH);
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
    const target = normalizeTarget(source || TARGETS.HEARTH);
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
    const target = normalizeTarget(option && option.target || context && context.target || TARGETS.HEARTH);
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
    if (mode === BASE_POOL_MODES.HEARTH) return "hearth";
    if (mode === BASE_POOL_MODES.CHARACTER) return "portrait_hall";

    return "center";
  }

  function inferDialectMode(target, intent, basePoolMode, illuminationMode) {
    if (illuminationMode === ILLUMINATION_MODES.BORDER) return "threshold_signal";
    if (illuminationMode === ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY) return "boundary_guard";
    if (illuminationMode === ILLUMINATION_MODES.ATRIUM) return "private_atrium";
    if (illuminationMode === ILLUMINATION_MODES.HEARTH) return "hearth_host";
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

  function inferRouteIdFromTarget(target, basePoolMode, intent) {
    const text = safeText(target).toLowerCase() + " " + safeText(basePoolMode).toLowerCase() + " " + safeText(intent).toLowerCase();

    if (/siteguide|site guide|website guide/.test(text)) return ROUTES.SITE_GUIDE;
    if (/compass|traditionalcompass|recenter/.test(text)) return ROUTES.COMPASS;
    if (/diagnostic|coherence/.test(text)) return ROUTES.COHERENCE_DIAGNOSTIC;
    if (/sean|mission/.test(text)) return ROUTES.MEET_SEAN;
    if (/nine/.test(text)) return ROUTES.NINE_SUMMITS;
    if (/product/.test(text)) return ROUTES.PRODUCTS;
    if (/archcoin|arc coin/.test(text)) return ROUTES.ARCHCOIN;
    if (/laws|scientific/.test(text)) return ROUTES.LAWS;
    if (/gauge/.test(text)) return ROUTES.GAUGES;
    if (/atrium|showroom|jeevesatrium|deeper|longer/.test(text)) return ROUTES.SHOWROOM;
    if (/hearth/.test(text)) return ROUTES.HEARTH;
    if (/h-earth|hearthpath|h earth/.test(text)) return ROUTES.H_EARTH;
    if (/character|portrait|roster/.test(text)) return ROUTES.CHARACTERS;
    if (/frontier/.test(text)) return ROUTES.FRONTIER;
    if (/water|tarian/.test(text)) return ROUTES.FRONTIER_WATER;
    if (/remote/.test(text)) return ROUTES.FRONTIER_VISION;

    return ROUTES.HEARTH;
  }

  function dedupeOptions(options) {
    const seen = Object.create(null);
    const output = [];

    (Array.isArray(options) ? options : []).forEach(function add(option) {
      if (!option || typeof option !== "object") return;

      const key = safeText(option.label).toLowerCase() + "::" + safeText(option.target).toLowerCase() + "::" + safeText(option.routeUrl).toLowerCase();

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
    routeUrls: ROUTE_URLS,
    agents: AGENTS,

    entryStackModes: ENTRY_STACK_MODES,
    basePoolModes: BASE_POOL_MODES,
    illuminationModes: ILLUMINATION_MODES,
    coordinateGates: GATES,
    sourceStabilityLaw: SOURCE_STABILITY_LAW,

    roomIdentity: ROOM_IDENTITY,
    openingSequence: OPENING_SEQUENCE,
    persistenceBackdoorCopy: PERSISTENCE_BACKDOOR_COPY,

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
    shapeDeeperFallback,
    shapeCrossPathFallback,

    inferBasePoolMode,
    inferIlluminationMode,
    inferEntryStackMode,
    inferRouteIdFromTarget,
    buildChoiceClosure,

    normalizeCoordinate,
    buildFallbackCoordinate,
    buildOptionCoordinate,

    sanitizePublicText,
    rewritePromptLabel,
    shouldUseTrainingWheels,
    shouldTriggerAtriumBackdoor,
    isDiagnosticAssessmentRequest,
    isDiagnosticExplanationRequest,
    isGuidedChooserRequest,
    isTrueGuidedChooser,
    isPlatformRealityRequest,
    isWhereAmIRequest,
    isHouseRequest,
    isMirrorlandRequest,

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
    oneFileBuildPlan: true,
    hearthIsJeevesHome: true,
    compassIsAccessPoint: true,
    atriumIsEarnedDepth: true,
    charactersArePortraitHall: true,
    diagnosticRestraint: true
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
        oneFileBuildPlan: true,
        hearthIsJeevesHome: true,
        compassIsAccessPoint: true,
        atriumIsEarnedDepth: true,
        charactersArePortraitHall: true,
        diagnosticRestraint: true
      }
    }));
  }
})(typeof window !== "undefined" ? window : globalThis);
