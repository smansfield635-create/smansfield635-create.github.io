// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_GATEWAY_AUTHORITY_ENTRY_STACK_TNT_v5_4_1
// Full-file replacement.
// Client-side expression authority only.
// Purpose:
// - Preserve v5.4 public language, protected house-state language,
//   guided entrance, bridgeContext shaping, mission language,
//   Mirrorland / Hearth / Frontier / Character language,
//   diagnostic boundary, option labels, route labels, and choice closure.
// - Re-anchor Expression to the v25.6 frontbrain preset standard.
// - Behave as gateway authority, not baseline answer authority.
// - Preserve API/North bubbles whenever present.
// - Use base-pool copy only for fallback, arrival/intention gates,
//   or light gateway framing when North provides no usable answer.
// - Obey conversationCoordinate, gateType, pathFamily, dialectMode,
//   contextExpectation, noRepeat, entryStackMode, basePoolMode,
//   illuminationMode, and choiceClosure from API/North / frontbrain.
// - Enforce diagnostic boundary without assessing, scoring, typing,
//   classifying, or deciding user archetype.
// Does not own:
// - API/North meaning authority
// - deep canon
// - route execution
// - DOM mount lifecycle
// - transcript storage
// - prepared-door routing
// - visible shell layout
// - CSS
// - reading timers
// - tap-to-speed execution
//

"use strict";

(function attachHearthJeevesExpression(global) {
  const CONTRACT = "HEARTH_JEEVES_EXPRESSION_GATEWAY_AUTHORITY_ENTRY_STACK_TNT_v5_4_1";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_ENTRY_STACK_BASE_POOL_ILLUMINATION_TNT_v5_4";
  const VERSION = "5.4.1";

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
    COMPASS: "compass",
    HOME: "home",
    SITE_GUIDE: "siteGuide",

    MIRRORLAND: "mirrorland",
    HEARTH: "hearth",
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

    PRODUCTS: "products",
    LAWS: "laws",
    SCIENTIFIC_LAW: "scientificLaw",
    GAUGES: "gauges",
    SHOWROOM: "showroom",
    COHERENCE_DIAGNOSTIC: "coherenceDiagnostic",
    MEET_SEAN: "meetSean",
    CHARACTERS: "characters",
    UNDERDOG: "aboutUnderdog",
    NINE_SUMMITS: "nineSummits",

    AUDRALIA: "audralia",
    H_EARTH: "hEarth",
    ZIONTS: "zionts"
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
    PROOF: "proof",
    DIAGNOSTIC_BOUNDARY: "diagnosticBoundary",
    CHARACTER_MIRROR: "characterMirror",
    MIRRORLAND: "mirrorland",
    HEARTH: "hearth",
    FRONTIER: "frontier",
    CHARACTERS: "characters",
    CREATOR: "creator",
    UNDERDOG: "underdog",
    RETURN: "return"
  });

  const ILLUMINATION_MODES = Object.freeze({
    PUBLIC: "public",
    THRESHOLD: "threshold",
    NARRATIVE: "narrative",
    PROOF: "proof",
    PRACTICAL: "practical",
    RETURN: "return",
    DIAGNOSTIC_BOUNDARY: "diagnosticBoundary"
  });

  const GATES = Object.freeze({
    ARRIVAL: "arrival",
    SPLIT: "split",
    INTENTION: "intention",
    BASE_POOL: "base_pool",
    INTRIGUE_BRIDGE: "intrigue_bridge",
    DIG_DEEPER: "dig_deeper",
    PREPARED_DOOR: "prepared_door",
    RETURN_FORK: "return_fork",
    CROSS_PATH_BRIDGE: "cross_path_bridge",
    DIAGNOSTIC_BOUNDARY: "diagnostic_boundary"
  });

  const CHOICE_CLOSURE_DEFAULT = Object.freeze({
    preparedDoorAvailable: true,
    preparedDoorSuggested: false,
    digDeeperAvailable: true,
    returnForkAvailable: true,
    finalChatThreshold: false
  });

  const INTERFACE_STATE_COPY = Object.freeze({
    listening: "The house is listening.",
    typing: "The house is typing. Tap to speed the process.",
    reading: "Jeeves is reading the path.",
    ready: "Jeeves is ready."
  });

  const PROTECTED_INTERFACE_PHRASES = Object.freeze([
    INTERFACE_STATE_COPY.listening,
    INTERFACE_STATE_COPY.typing,
    INTERFACE_STATE_COPY.reading,
    INTERFACE_STATE_COPY.ready,
    "Jeeves is preparing the next answer...",
    "The house is typing.",
    "Tap to speed the process."
  ]);

  const SPLIT_INTERFACE_COPY = Object.freeze({
    entrance: [
      "Welcome. I’m Jeeves.",
      "I’m here to guide the house and open the right doors.",
      "DiamondGateBridge has a public side and a narrative side. You do not need to understand the whole estate before choosing a path.",
      "Tell me what you are looking for, and I’ll place you at the cleanest doorway."
    ],
    overview: [
      "DiamondGateBridge.com is an estate-style website with two coordinated entrances.",
      "The public side gives you the map: clear pages, practical value, Products, Laws, Compass, and creator context.",
      "The narrative side gives you the guided walk: rooms, worlds, Characters, Hearth, Mirrorland, mission, proof, and frontier systems.",
      "My role is to help you choose the doorway that fits why you came here."
    ],
    guidedChooser: [
      "Yes. I can help you choose where to start.",
      "Tell me what you are looking for first: a clear public map, something practical, the story world, the mission, or the proof behind the work.",
      "I’ll use that direction to place you on the public path or the narrative path without making you guess the structure."
    ],
    traditionalWebsite:
      "The traditional website is the clear public side of the estate. It gives you the map on the wall: Compass, Products, Laws, Meet Sean, and the readable structure.",
    narrativePath:
      "The narrative path is the walk through the estate. It carries mission, Hearth, Mirrorland, Characters, proof, and the Frontier Playground.",
    bridge:
      "The two sides are separate entrances, not separate worlds. I can guide you from the website into the narrative path, or from Mirrorland back to the public structure."
  });

  const BASE_POOL_COPY = Object.freeze({
    estateOverview: [
      "You are at the entrance to DiamondGateBridge.",
      "The point here is not to understand every room at once. It is to see the shape of the estate, then choose the doorway that matches why you came.",
      "The public side gives you the map. The narrative side gives you the walk."
    ],
    publicMap: [
      SPLIT_INTERFACE_COPY.traditionalWebsite,
      "It lets you understand the project without entering the story layer first.",
      "From there, I can keep you on the public map or show you the narrative version of the same idea."
    ],
    narrativePath: [
      SPLIT_INTERFACE_COPY.narrativePath,
      "Instead of only reading pages, you move through rooms, worlds, Characters, mission, proof, and future-facing systems.",
      "I keep the map nearby, so the story can always return to the public website when you need structure."
    ],
    practical: [
      "This matters because clarity has to survive contact with the real world.",
      "DiamondGateBridge is not only a story or a website. It is a way to organize pressure, proof, systems, service, and direction.",
      "That is why the path eventually reaches the Frontier Playground, Scientific Law, Products, and community-facing work."
    ],
    proof: [
      "This is the proof-facing path.",
      "It asks whether a claim can survive evidence, measurement, correction, and limits.",
      "That gives the public side a way to stay honest while the narrative side keeps the work alive."
    ],
    mirrorland: [
      "Mirrorland is part of the narrative path.",
      "It is not there to label you; it is there to help you see the patterns, pressures, Characters, and choices moving through the story.",
      "It gives the mission a world you can walk through instead of a paragraph you only read."
    ],
    hearth: [
      "Hearth is the Mission Control side of the estate.",
      "It is the window within the window: the place where the larger narrative field becomes visible, coordinated, and easier to route.",
      "From Hearth, the visitor can move toward Mirrorland, Frontier, proof, or back to the public map."
    ],
    frontier: [
      "Frontier Playground is where the work gets tested as systems.",
      "Energy, water, waste, infrastructure, feedback, direction, and future-facing design all have to answer the same question: can this work under pressure?",
      "It gives practical form to ideas that would otherwise stay abstract."
    ],
    characters: [
      "The Characters turn the estate from explanation into encounter.",
      "They carry shelter, repair, warning, survival, signal, boundary, sequence, and help beyond the safe center.",
      "They are not here so I can label you. They are here so the story has pressure you can recognize."
    ],
    creator: [
      "Meet Sean gives the human source behind the estate.",
      "That path explains the creator context, pressure, artistic integrity, and the reason the work is built as both public structure and narrative experience.",
      "It naturally connects to This Underdog and Nine Summits."
    ],
    underdog: [
      "This Underdog is the pressure voice translated back into human terms.",
      "It is not only about one person. It is about the part of a visitor that has carried pressure before it found language or direction.",
      "That is why it sits near the creator path, the mission, and the mirror."
    ],
    return: [
      "We can re-center cleanly.",
      "The strongest move is to return to the guided chooser, choose the public map, choose the narrative path, or ask one sharper question.",
      "You do not have to keep circling the same room."
    ]
  });

  const MISSION_COPY = Object.freeze({
    overview: [
      "The mission has one larger center and several living expressions.",
      "The larger center is clarity, integrity, collaboration, and better shared direction.",
      "One expression turns inward: helping people move through noise and pressure without losing themselves.",
      "Another turns outward: service, standing against bullying, protecting children and animals, and building stronger community support."
    ],
    inner: [
      "The inner mission is to help you see more clearly.",
      "There is a lot of noise in the world. Pressure comes from every direction, and after a while it can become hard to tell what is yours, what is useful, and what is pulling you away from yourself.",
      "DiamondGateBridge is built to help slow that noise down, recognize the pattern you are standing in, and move toward more honesty, capability, and integrity."
    ],
    community: [
      "The community mission turns the work outward.",
      "It is about serving people, standing against bullying, protecting children, protecting animals, and helping build places where people feel safer, seen, and supported."
    ],
    collaboration: [
      "The collaboration mission is where the idea becomes practical.",
      "The work has to become teamwork, tools, systems, public value, better decisions, and shared construction.",
      "That is why the mission eventually reaches Products, Frontier Playground, Scientific Law, and real-world application."
    ]
  });

  const DIAGNOSTIC_BOUNDARY_COPY = Object.freeze({
    boundary:
      "I can explain the Diagnostic and show you where it fits, but I do not assess you here. If you want an alignment read, I can take you to the Coherence Diagnostic.",
    characterMirror:
      "The Character Mirror is explanatory, not a test I run on you here. It shows how the Characters work as reflective patterns, while the actual alignment read belongs in the Coherence Diagnostic.",
    diagnostic:
      "The Coherence Diagnostic is a separate alignment tool. It helps a visitor reflect on coherence, claimed archetype, and scenario response patterns. I can explain it or route you there, but I do not run the assessment inside this chat.",
    referral:
      "That request belongs in the Coherence Diagnostic. I can take you there, or I can explain how the Diagnostic connects to the Character Mirror and the narrative path."
  });

  const BRIDGE_COPY = Object.freeze({
    compassHearth:
      "Compass is the public orientation door. Hearth is the narrative control-window version of orientation.",
    productsFrontier:
      "Products show public value. Frontier Playground shows how that value gets tested as a system.",
    lawsScientificLaw:
      "Laws give boundary. Scientific Law tests whether a claim survives evidence, measurement, correction, and limits.",
    seanUnderdog:
      "Meet Sean gives creator context. This Underdog carries the pressure voice back into human terms.",
    missionNarrative:
      "Mission belongs mostly to the narrative path because coherence, Mirrorland, Characters, and Frontier Playground carry its deeper work.",
    mirrorlandWebsite:
      "Mirrorland is the story-facing side. The traditional website is the public map back out.",
    diagnosticCharacterMirror:
      "The Character Mirror can be explained here, but the actual alignment read belongs in the Coherence Diagnostic."
  });

  const INTRIGUE_COPY = Object.freeze({
    estateOverview:
      "You do not have to know the whole estate yet. You only need to choose the first honest doorway.",
    publicMap:
      "This is the cleanest path if you want structure before depth.",
    narrativePath:
      "This is the right path if you want the estate to become something you move through, not only something you read.",
    mission:
      "This is where the work stops being only a website and starts becoming personal, communal, and practical.",
    practical:
      "This is the path for seeing whether the idea can touch real systems, tools, and public value.",
    proof:
      "This is the path for testing whether the work can stay honest under pressure.",
    diagnosticBoundary:
      "This is the boundary: I can explain the mirror, but the read itself belongs in the Diagnostic.",
    characterMirror:
      "This is the mirror boundary: Characters can clarify the story, but the personal read belongs in the Diagnostic.",
    mirrorland:
      "This is the story window. You can look through it first, or step into the page when you are ready.",
    hearth:
      "This is the control-window path. It shows how the larger field becomes coordinated.",
    frontier:
      "This is where future-facing ideas have to become testable systems.",
    characters:
      "This is where abstract pressure becomes human shape.",
    creator:
      "This path gives the human source before the estate becomes too large.",
    underdog:
      "This path gives pressure a voice before it becomes a system.",
    return:
      "The return fork is not failure. It is how the estate prevents drift."
  });

  const ROUTE_LABELS = Object.freeze({
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

  const TARGET_LABELS = Object.freeze({
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
    hearthPath: "What is Hearth?",
    frontierPath: "What is the Frontier Playground?",
    scientificLawPath: "What makes this trustworthy?",
    compassPath: "How does the Compass help me start?",
    productsPath: "What can I actually do here?",
    lawsPath: "What keeps this honest?",
    seanPath: "Who is Sean Mansfield?",
    underdogPath: "What is This Underdog?",
    charactersPath: "Who are the Characters?",
    recenterNode: "Can you re-center me?",
    cleanDoor: "What is the cleanest next door?",
    returnFork: "Can we return to the first fork?",
    restartFork: "Can we start over?",
    sharpQuestion: "Can you ask me a sharper question?"
  });

  const DIRECTIONAL_CHOOSER_OPTIONS = Object.freeze([
    makeStaticOption("I want the clear public map.", TARGETS.TRADITIONAL_WEBSITE, "story_prompt", "story_entry", "before_knowledge", "ask_jeeves", "objective"),
    makeStaticOption("I want something practical I can use.", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry", "before_knowledge", "ask_jeeves", "objective"),
    makeStaticOption("I want the story world.", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry", "before_knowledge", "ask_jeeves", "narrative"),
    makeStaticOption("I want the mission and meaning.", TARGETS.MISSION_OVERVIEW, "personal_prompt", "personal_entry", "before_knowledge", "ask_jeeves", "narrative"),
    makeStaticOption("I want to know what makes this trustworthy.", TARGETS.SCIENTIFIC_LAW, "skeptic_prompt", "proof_entry", "before_knowledge", "ask_jeeves", "objective")
  ]);

  const PROMPT_REWRITES = [
    { pattern: /\bwhich character might i recognize in myself\??/gi, replacement: "What does the Character Mirror show?" },
    { pattern: /\bwhich character am i most like\??/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bwhat character am i\??/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bwhich archetype am i\??/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bwhat archetype am i\??/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bwhere do i fit into this\??/gi, replacement: "Can you help me choose where to start?" },
    { pattern: /\bwhat can i learn about myself here\??/gi, replacement: "How does the narrative path become personal?" },
    { pattern: /\bask me the first mirror question\.?/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bask me the second mirror question\.?/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bask me the third mirror question\.?/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\brun the mirror question\.?/gi, replacement: "Where can I take the alignment diagnostic?" },
    { pattern: /\bdiagnose me\b/gi, replacement: "Take me to the Coherence Diagnostic" },
    { pattern: /\bscore me\b/gi, replacement: "Take me to the Coherence Diagnostic" },
    { pattern: /\bassess me\b/gi, replacement: "Take me to the Coherence Diagnostic" },
    { pattern: /\bclassify me\b/gi, replacement: "Take me to the Coherence Diagnostic" },
    { pattern: /\btype me\b/gi, replacement: "Take me to the Coherence Diagnostic" }
  ];

  const PUBLIC_LANGUAGE_REWRITES = [
    { pattern: /\bAPI\b/g, replacement: "deeper answer path" },
    { pattern: /\bDOM\b/g, replacement: "visible interface" },
    { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
    { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
    { pattern: /\bserver[-\s]?side\b/gi, replacement: "deeper house layer" },
    { pattern: /\bjson schema\b/gi, replacement: "answer shape" },
    { pattern: /\bpayload\b/gi, replacement: "answer" },
    { pattern: /\bregistry\b/gi, replacement: "guide" },
    { pattern: /\bscope lane\b/gi, replacement: "path" },
    { pattern: /\broute lane\b/gi, replacement: "path" },
    { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
    { pattern: /\bprogression state\b/gi, replacement: "step" },
    { pattern: /\bcontract\b/gi, replacement: "governing mark" },
    { pattern: /\bTNT\b/g, replacement: "" },
    { pattern: /\bCharacter Archetype Mirror\b/g, replacement: "Character Mirror" },
    { pattern: /\bcharacter archetype mirror\b/gi, replacement: "Character Mirror" },
    { pattern: /\bthe Mirrorland\b/gi, replacement: "Mirrorland" },
    { pattern: /\bworld side\b/gi, replacement: "Mirrorland" },
    { pattern: /\bworld gate\b/gi, replacement: "South Gate" }
  ];

  function shapeConversationFrame(frame, context) {
    const source = frame && typeof frame === "object" ? frame : {};
    const ctx = normalizeContext({
      ...(context && typeof context === "object" ? context : {}),
      bridgeContext: (context && context.bridgeContext) || source.bridgeContext || null,
      conversationCoordinate: source.conversationCoordinate || (context && context.conversationCoordinate) || null,
      gateType: source.gateType || (context && context.gateType) || "",
      pathFamily: source.pathFamily || (context && context.pathFamily) || "",
      dialectMode: source.dialectMode || (context && context.dialectMode) || "",
      contextExpectation: source.contextExpectation || (context && context.contextExpectation) || "",
      noRepeat: typeof source.noRepeat === "boolean"
        ? source.noRepeat
        : Boolean(context && typeof context.noRepeat === "boolean" ? context.noRepeat : false),
      illuminationMode: source.illuminationMode || (context && context.illuminationMode) || "",
      basePoolMode: source.basePoolMode || (context && context.basePoolMode) || "",
      entryStackMode: source.entryStackMode || (context && context.entryStackMode) || "",
      choiceClosure: source.choiceClosure || (context && context.choiceClosure) || null,
      selectedTarget: source.selectedTarget || (context && context.selectedTarget) || "",
      intent: source.intent || (context && context.intent) || ""
    });

    const coordinate = ctx.conversationCoordinate || buildFallbackCoordinate(source, ctx);
    const gate = safeText(source.gateType || ctx.gateType || coordinate.gate || "");
    const target = normalizeTarget(source.selectedTarget || coordinate.target || ctx.selectedTarget || "");
    const intent = normalizeIntent(source.intent || ctx.intent || "");
    const basePoolMode = safeText(source.basePoolMode || ctx.basePoolMode || coordinate.mode || inferBasePoolMode(target, intent, ctx));
    const illuminationMode = safeText(source.illuminationMode || ctx.illuminationMode || inferIlluminationMode(target, intent, ctx, basePoolMode));
    const entryStackMode = safeText(source.entryStackMode || ctx.entryStackMode || inferEntryStackMode(target, intent, ctx, basePoolMode));
    const noRepeat = Boolean(
      typeof source.noRepeat === "boolean"
        ? source.noRepeat
        : typeof ctx.noRepeat === "boolean"
          ? ctx.noRepeat
          : coordinate.noRepeat
    );

    const sourceBubbles = normalizeBubbleList(source.bubbles || source.beats || []);
    const shaped = {
      ...source,

      expressionContract: CONTRACT,
      expressionVersion: VERSION,
      previousExpressionContract: PREVIOUS_CONTRACT,

      conversationCoordinate: coordinate,
      gateType: gate,
      pathFamily: source.pathFamily || ctx.pathFamily || coordinate.path || inferPathFamily(target, intent, basePoolMode),
      dialectMode: source.dialectMode || ctx.dialectMode || coordinate.dialect || inferDialectMode(target, intent, basePoolMode, illuminationMode),
      contextExpectation: source.contextExpectation || ctx.contextExpectation || coordinate.expectation || inferExpectation(gate),
      noRepeat,

      basePoolMode,
      illuminationMode,
      entryStackMode,
      choiceClosure: source.choiceClosure || ctx.choiceClosure || buildChoiceClosure(target, intent, ctx, basePoolMode, coordinate)
    };

    shaped.bubbles = shapeGatewayBubbles({
      sourceBubbles,
      target,
      intent,
      ctx,
      coordinate,
      gate,
      basePoolMode,
      noRepeat
    });
    shaped.beats = shaped.bubbles;

    shaped.options = shapeChoiceClosureOptions(
      source.options || [],
      target,
      intent,
      {
        ...ctx,
        conversationCoordinate: coordinate,
        gateType: gate,
        noRepeat,
        basePoolMode,
        illuminationMode,
        entryStackMode,
        choiceClosure: shaped.choiceClosure
      },
      basePoolMode
    );

    return finalizeFrame(shaped, ctx);
  }

  function shapeGatewayBubbles(args) {
    const sourceBubbles = Array.isArray(args.sourceBubbles) ? args.sourceBubbles : [];
    const target = normalizeTarget(args.target || "");
    const intent = normalizeIntent(args.intent || "");
    const ctx = normalizeContext(args.ctx || {});
    const coordinate = args.coordinate || null;
    const gate = safeText(args.gate || (coordinate && coordinate.gate) || "");
    const basePoolMode = args.basePoolMode || inferBasePoolMode(target, intent, ctx);
    const noRepeat = Boolean(args.noRepeat);

    if (gate === GATES.ARRIVAL) {
      return withBridgeLead(SPLIT_INTERFACE_COPY.entrance.slice(), ctx);
    }

    if (gate === GATES.SPLIT || gate === GATES.INTENTION || isGuidedChooserRequest(target, intent, ctx)) {
      return withBridgeLead(SPLIT_INTERFACE_COPY.guidedChooser.slice(), ctx);
    }

    if (gate === GATES.PREPARED_DOOR) {
      if (sourceBubbles.length) return sanitizeBubbleList(sourceBubbles, ctx).slice(0, 2);
      return [
        "That door is ready.",
        "I do not need to re-explain the path. The clean move is to open it."
      ];
    }

    if (gate === GATES.RETURN_FORK) {
      if (sourceBubbles.length) return withBridgeLead(sanitizeBubbleList(sourceBubbles, ctx), ctx);
      return withBridgeLead(BASE_POOL_COPY.return.slice(), ctx);
    }

    if (gate === GATES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) {
      if (sourceBubbles.length) {
        return sanitizeBubbleList(sourceBubbles, ctx)
          .map(softenDiagnosticAssessmentLanguage)
          .slice(0, 4);
      }
      return shapeDiagnosticBoundaryFallback(target, basePoolMode);
    }

    if (sourceBubbles.length) {
      return withBridgeLead(sanitizeBubbleList(sourceBubbles, ctx), ctx);
    }

    if (gate === GATES.INTRIGUE_BRIDGE) {
      return withBridgeLead(shapeIntrigueFallback(basePoolMode), ctx);
    }

    if (gate === GATES.DIG_DEEPER) {
      return withBridgeLead(shapeDeeperFallback(target, intent, ctx, basePoolMode), ctx);
    }

    if (gate === GATES.CROSS_PATH_BRIDGE) {
      return withBridgeLead(shapeCrossPathFallback(ctx), ctx);
    }

    if (gate === GATES.BASE_POOL && !noRepeat) {
      const pool = shapeBasePool(target, intent, ctx, basePoolMode);
      if (pool.length) return withBridgeLead(pool, ctx);
    }

    const fallback = shapeBasePool(target, intent, ctx, basePoolMode);
    if (fallback.length) return withBridgeLead(fallback, ctx);

    return withBridgeLead(SPLIT_INTERFACE_COPY.overview.slice(), ctx);
  }

  function shapeDiagnosticBoundaryFallback(target, basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR || normalizeTarget(target) === TARGETS.CHARACTER_MIRROR) {
      return [
        DIAGNOSTIC_BOUNDARY_COPY.characterMirror,
        "I can introduce the Characters and explain what they carry, or I can take you to the proper Diagnostic path."
      ];
    }

    return [
      DIAGNOSTIC_BOUNDARY_COPY.referral,
      "Jeeves can explain and guide, but the assessment belongs in the Diagnostic itself."
    ];
  }

  function shapeIntrigueFallback(basePoolMode) {
    const mode = safeText(basePoolMode || BASE_POOL_MODES.NONE);
    const key = normalizeBasePoolKey(mode);
    const line = INTRIGUE_COPY[key] || "This path opens into a nearby room.";

    return [
      line,
      "From here, the next clean move is to go deeper, open the prepared door, or return to the fork."
    ];
  }

  function shapeDeeperFallback(target, intent, context, basePoolMode) {
    const ctx = normalizeContext(context);
    const mode = basePoolMode || inferBasePoolMode(target, intent, ctx);

    if (mode === BASE_POOL_MODES.PUBLIC_MAP) {
      return [
        "The deeper layer is that the public side keeps the estate readable before the visitor crosses into story, proof, products, or creator context.",
        "It gives the visitor a place to stand before depth becomes necessary."
      ];
    }

    if (mode === BASE_POOL_MODES.NARRATIVE_PATH) {
      return [
        "The deeper layer is that the narrative path turns the same structure into movement.",
        "The visitor is not only reading rooms. The visitor is crossing thresholds."
      ];
    }

    if (mode === BASE_POOL_MODES.MISSION) {
      return [
        "The deeper layer is that the mission has to move inward, outward, and then into construction.",
        "It has to help the person, protect the community, and prove itself through useful systems."
      ];
    }

    if (mode === BASE_POOL_MODES.PRACTICAL) {
      return [
        "The deeper layer is that practical value has to survive pressure.",
        "A useful idea has to become a tool, route, product, system, or decision structure."
      ];
    }

    if (mode === BASE_POOL_MODES.PROOF) {
      return [
        "The deeper layer is that proof is not decoration.",
        "Evidence, measurement, limits, and correction are what keep a convincing idea from becoming an unchecked claim."
      ];
    }

    return [
      "The deeper layer is available, but the clean move is to let North carry the meaning and let this gateway keep the path readable."
    ];
  }

  function shapeCrossPathFallback(context) {
    const ctx = normalizeContext(context);
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (bridgeLine) {
      return [
        bridgeLine,
        "The point is not to collapse the two paths into one. It is to show why the next door is adjacent."
      ];
    }

    return [
      "This is a bridge path.",
      "The next room is related, but it should remain distinct so the estate stays readable."
    ];
  }

  function shapeBasePool(target, intent, context, basePoolMode) {
    const ctx = normalizeContext(context);
    const cleanTarget = normalizeTarget(target);
    const cleanIntent = normalizeIntent(intent);
    const mode = basePoolMode || inferBasePoolMode(cleanTarget, cleanIntent, ctx);

    if (isGuidedChooserRequest(cleanTarget, cleanIntent, ctx)) {
      return SPLIT_INTERFACE_COPY.guidedChooser.slice();
    }

    if (mode === BASE_POOL_MODES.ESTATE_OVERVIEW) return SPLIT_INTERFACE_COPY.overview.slice();
    if (mode === BASE_POOL_MODES.PUBLIC_MAP) return BASE_POOL_COPY.publicMap.slice();
    if (mode === BASE_POOL_MODES.NARRATIVE_PATH) return BASE_POOL_COPY.narrativePath.slice();

    if (mode === BASE_POOL_MODES.MISSION) return MISSION_COPY.overview.slice();
    if (mode === BASE_POOL_MODES.INNER_MISSION) return MISSION_COPY.inner.slice();
    if (mode === BASE_POOL_MODES.COMMUNITY_MISSION) return MISSION_COPY.community.slice();
    if (mode === BASE_POOL_MODES.COLLABORATION_MISSION) return MISSION_COPY.collaboration.slice();

    if (mode === BASE_POOL_MODES.PRACTICAL) return BASE_POOL_COPY.practical.slice();
    if (mode === BASE_POOL_MODES.PROOF) return BASE_POOL_COPY.proof.slice();

    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY) {
      return [
        DIAGNOSTIC_BOUNDARY_COPY.referral,
        "Jeeves can explain and guide, but the assessment belongs in the Diagnostic itself."
      ];
    }

    if (mode === BASE_POOL_MODES.CHARACTER_MIRROR) {
      return [
        DIAGNOSTIC_BOUNDARY_COPY.characterMirror,
        "I can introduce the Characters and explain what they carry, or I can take you to the proper Diagnostic path."
      ];
    }

    if (mode === BASE_POOL_MODES.MIRRORLAND) return BASE_POOL_COPY.mirrorland.slice();
    if (mode === BASE_POOL_MODES.HEARTH) return BASE_POOL_COPY.hearth.slice();
    if (mode === BASE_POOL_MODES.FRONTIER) return BASE_POOL_COPY.frontier.slice();
    if (mode === BASE_POOL_MODES.CHARACTERS) return BASE_POOL_COPY.characters.slice();
    if (mode === BASE_POOL_MODES.CREATOR) return BASE_POOL_COPY.creator.slice();
    if (mode === BASE_POOL_MODES.UNDERDOG) return BASE_POOL_COPY.underdog.slice();
    if (mode === BASE_POOL_MODES.RETURN) return BASE_POOL_COPY.return.slice();

    return [];
  }

  function finalizeFrame(frame, context) {
    const shaped = frame && typeof frame === "object" ? frame : {};
    const ctx = normalizeContext(context);
    const coordinate = shaped.conversationCoordinate || ctx.conversationCoordinate || buildFallbackCoordinate(shaped, ctx);
    const target = normalizeTarget(shaped.selectedTarget || coordinate.target || ctx.selectedTarget || "");
    const intent = normalizeIntent(shaped.intent || ctx.intent || "");
    const basePoolMode = shaped.basePoolMode || coordinate.mode || inferBasePoolMode(target, intent, ctx);
    const illuminationMode = shaped.illuminationMode || inferIlluminationMode(target, intent, ctx, basePoolMode);
    const entryStackMode = shaped.entryStackMode || inferEntryStackMode(target, intent, ctx, basePoolMode);
    const gate = shaped.gateType || coordinate.gate || inferGateFromContext(target, intent, ctx, entryStackMode, basePoolMode);
    const noRepeat = typeof shaped.noRepeat === "boolean" ? shaped.noRepeat : Boolean(coordinate.noRepeat || isNoRepeatGate(gate));

    shaped.bubbles = normalizeBubbleList(shaped.bubbles || shaped.beats || [])
      .map((bubble) => sanitizePublicText(bubble, ctx, "bubble"));
    shaped.beats = shaped.bubbles;

    shaped.options = shapeOptions(shaped.options || [], {
      ...ctx,
      selectedTarget: target,
      intent,
      basePoolMode,
      illuminationMode,
      entryStackMode,
      conversationCoordinate: coordinate,
      gateType: gate,
      noRepeat
    });

    shaped.handoffLabels = shapeHandoffLabels(shaped.handoffLabels || {}, shaped.handoffs || []);

    shaped.expressionContract = CONTRACT;
    shaped.expressionVersion = VERSION;
    shaped.previousExpressionContract = PREVIOUS_CONTRACT;

    shaped.guidedEntranceCompatible = true;
    shaped.readingRhythmCompatible = true;
    shaped.bridgeContextCompatible = true;
    shaped.entryStackCompatible = true;
    shaped.basePoolCompatible = true;
    shaped.illuminationCompatible = true;
    shaped.choiceClosureCompatible = true;
    shaped.coordinateCarrierCompatible = true;
    shaped.gatewayAuthorityCompatible = true;
    shaped.noRepeatCompatible = true;

    shaped.conversationCoordinate = coordinate;
    shaped.gateType = gate;
    shaped.pathFamily = shaped.pathFamily || coordinate.path || inferPathFamily(target, intent, basePoolMode);
    shaped.dialectMode = shaped.dialectMode || coordinate.dialect || inferDialectMode(target, intent, basePoolMode, illuminationMode);
    shaped.contextExpectation = shaped.contextExpectation || coordinate.expectation || inferExpectation(gate);
    shaped.noRepeat = noRepeat;

    shaped.entryStackMode = entryStackMode;
    shaped.basePoolMode = basePoolMode;
    shaped.illuminationMode = illuminationMode;
    shaped.choiceClosure = shaped.choiceClosure || buildChoiceClosure(target, intent, ctx, basePoolMode, coordinate);

    shaped.debug = shaped.debug && typeof shaped.debug === "object" ? shaped.debug : {};
    shaped.debug.expressionAuthority = "gateway_language_authority_only";
    shaped.debug.meaningAuthority = "api_north";
    shaped.debug.frontbrainAuthority = "visible_carrier_and_route_execution";
    shaped.debug.diagnosticBoundary = "jeeves_explains_and_routes_but_does_not_assess";

    return shaped;
  }

  function shapeOptions(options, context) {
    const ctx = normalizeContext(context);

    if (!Array.isArray(options)) return [];

    const shaped = options
      .map((option) => shapeOption(option, ctx))
      .filter(Boolean);

    return dedupeOptions(shaped).slice(0, 6);
  }

  function shapeOption(option, context) {
    if (!option || typeof option !== "object") return null;

    const ctx = normalizeContext(context);
    const rawTarget = safeText(option.target || "");
    const target = normalizeTarget(rawTarget);
    const originalLabel = safeText(option.label || "");
    let label = originalLabel || TARGET_LABELS[target] || "Can you tell me more?";

    if (isDiagnosticAssessmentRequest(originalLabel) || isDiagnosticAssessmentTarget(rawTarget) || isDiagnosticAssessmentTarget(target)) {
      return {
        ...option,
        label: TARGET_LABELS.diagnosticReferralPath,
        target: TARGETS.DIAGNOSTIC_REFERRAL,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves",
        entryStackMode: ENTRY_STACK_MODES.BASE_POOL,
        basePoolMode: BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY,
        illuminationMode: ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY,
        gateType: GATES.DIAGNOSTIC_BOUNDARY,
        pathFamily: "diagnostic",
        dialectMode: "diagnostic_boundary_guide",
        contextExpectation: "diagnostic_referral",
        noRepeat: true
      };
    }

    label = rewritePromptLabel(label, target, ctx);
    label = sanitizePublicText(label, ctx, "option");

    const shaped = {
      ...option,
      label,
      target
    };

    if (isGuidedLabel(originalLabel) && target === TARGETS.SPLIT_INTERFACE) {
      shaped.label = TARGET_LABELS.splitInterfaceBridgePath;
      shaped.promptMode = "story_prompt";
      shaped.scopeLane = "objective";
      shaped.bridgeMoment = "entrance_fork";
      shaped.movementIntent = "ask_jeeves";
    }

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW) {
      shaped.label = TARGET_LABELS.diamondGateOverviewPath;
      shaped.promptMode = "story_prompt";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.NARRATIVE_PATH) {
      shaped.label = TARGET_LABELS.narrativePathOverview;
      shaped.promptMode = "story_prompt";
      shaped.scopeLane = "narrative";
    }

    if (target === TARGETS.TRADITIONAL_WEBSITE) {
      shaped.label = TARGET_LABELS.traditionalWebsiteOverviewPath;
      shaped.promptMode = "story_prompt";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.MISSION_OVERVIEW) {
      shaped.label = TARGET_LABELS.missionOverviewPath;
      shaped.scopeLane = "narrative";
      shaped.promptMode = "personal_prompt";
    }

    if (target === TARGETS.PRACTICAL_RELEVANCE || target === TARGETS.PRODUCTS) {
      shaped.label = TARGET_LABELS.practicalRelevancePath;
      shaped.promptMode = "practical_prompt";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.SCIENTIFIC_LAW || target === TARGETS.LAWS) {
      shaped.label = TARGET_LABELS.scientificLawPath;
      shaped.promptMode = "skeptic_prompt";
      shaped.archetypeAlignment = "proof_entry";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.DIAGNOSTIC) {
      shaped.label = TARGET_LABELS.diagnosticPath;
      shaped.promptMode = "personal_prompt";
      shaped.archetypeAlignment = "personal_entry";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL) {
      shaped.label = TARGET_LABELS.diagnosticReferralPath;
      shaped.promptMode = "personal_prompt";
      shaped.archetypeAlignment = "personal_entry";
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.CHARACTER_MIRROR) {
      shaped.label = TARGET_LABELS.characterMirrorPath;
      shaped.promptMode = "story_prompt";
      shaped.archetypeAlignment = "story_entry";
      shaped.scopeLane = "narrative";
    }

    if (target === TARGETS.CLEAN_DOOR || target === TARGETS.RECENTER || target === TARGETS.RETURN_FORK || target === TARGETS.RESTART_FORK) {
      shaped.promptMode = "recenter_prompt";
      shaped.optionKind = "control";
      shaped.bridgeMoment = "recenter_fork";
      shaped.movementIntent = "recenter";
      shaped.scopeLane = "objective";
      shaped.type = "control";
    }

    if (!shaped.optionKind) shaped.optionKind = "conversation_prompt";
    if (!shaped.bridgeMoment) shaped.bridgeMoment = inferBridgeMomentFromContext(ctx);
    if (!shaped.movementIntent) shaped.movementIntent = "ask_jeeves";
    if (!shaped.type) shaped.type = shaped.optionKind === "control" ? "control" : "conversation";
    if (!shaped.scopeLane) shaped.scopeLane = inferScopeLaneFromTarget(target);

    const optionCoordinate = normalizeCoordinate(shaped.conversationCoordinate || null) || buildOptionCoordinate(shaped, ctx);

    shaped.conversationCoordinate = optionCoordinate;
    shaped.gateType = shaped.gateType || optionCoordinate.gate;
    shaped.pathFamily = shaped.pathFamily || optionCoordinate.path;
    shaped.dialectMode = shaped.dialectMode || optionCoordinate.dialect;
    shaped.contextExpectation = shaped.contextExpectation || optionCoordinate.expectation;
    shaped.noRepeat = typeof shaped.noRepeat === "boolean" ? shaped.noRepeat : Boolean(optionCoordinate.noRepeat);

    return shaped;
  }

  function shapeChoiceClosureOptions(options, target, intent, context, basePoolMode) {
    const ctx = normalizeContext(context);
    const coordinate = ctx.conversationCoordinate || null;
    const gate = ctx.gateType || (coordinate && coordinate.gate) || "";
    const sourceOptions = Array.isArray(options) ? options.slice() : [];
    const cleanTarget = normalizeTarget(target || ctx.selectedTarget || "");
    const cleanIntent = normalizeIntent(intent || ctx.intent || "");
    const mode = basePoolMode || inferBasePoolMode(cleanTarget, cleanIntent, ctx);
    const closure = ctx.choiceClosure || buildChoiceClosure(cleanTarget, cleanIntent, ctx, mode, coordinate);
    const next = coordinate && Array.isArray(coordinate.next) ? coordinate.next : [];
    const shaped = sourceOptions.slice();

    if (isGuidedChooserRequest(cleanTarget, cleanIntent, ctx) || gate === GATES.INTENTION) {
      return DIRECTIONAL_CHOOSER_OPTIONS.slice();
    }

    if (
      closure.digDeeperAvailable &&
      gate !== GATES.DIG_DEEPER &&
      gate !== GATES.PREPARED_DOOR &&
      gate !== GATES.RETURN_FORK &&
      gate !== GATES.DIAGNOSTIC_BOUNDARY &&
      (next.length === 0 || next.includes("dig_deeper"))
    ) {
      shaped.push(makeDigDeeperOption(cleanTarget, cleanIntent, mode));
    }

    if (
      closure.returnForkAvailable &&
      gate !== GATES.RETURN_FORK &&
      (next.length === 0 || next.includes("return") || next.includes("guided_chooser"))
    ) {
      shaped.push(makeReturnForkOption(mode));
    }

    return shaped;
  }

  function makeDigDeeperOption(target, intent, basePoolMode) {
    const mode = basePoolMode || BASE_POOL_MODES.NONE;
    const cleanTarget = normalizeTarget(target) || TARGETS.SPLIT_INTERFACE;
    const label = inferDigDeeperLabel(cleanTarget, intent, mode);

    const option = {
      label,
      target: cleanTarget,
      type: "conversation",
      scopeLane: inferScopeLaneFromTarget(cleanTarget),
      promptMode: inferPromptModeFromPool(mode),
      optionKind: "forward",
      archetypeAlignment: inferAlignmentFromPool(mode),
      bridgeMoment: "after_knowledge",
      movementIntent: "continue_current_path",
      entryStackMode: ENTRY_STACK_MODES.DIG_DEEPER,
      basePoolMode: mode,
      gateType: GATES.DIG_DEEPER,
      noRepeat: true
    };

    option.conversationCoordinate = buildOptionCoordinate(option, {});
    option.pathFamily = option.conversationCoordinate.path;
    option.dialectMode = option.conversationCoordinate.dialect;
    option.contextExpectation = option.conversationCoordinate.expectation;

    return option;
  }

  function makeReturnForkOption(basePoolMode) {
    const mode = basePoolMode || BASE_POOL_MODES.NONE;

    const option = {
      label: mode === BASE_POOL_MODES.RETURN ? "Can you help me choose where to start?" : "Can we return to the guided chooser?",
      target: TARGETS.SPLIT_INTERFACE,
      type: "control",
      scopeLane: "objective",
      promptMode: "recenter_prompt",
      optionKind: "control",
      archetypeAlignment: "unknown_entry",
      bridgeMoment: "recenter_fork",
      movementIntent: "recenter",
      entryStackMode: ENTRY_STACK_MODES.RETURN,
      basePoolMode: BASE_POOL_MODES.RETURN,
      gateType: GATES.RETURN_FORK,
      noRepeat: true
    };

    option.conversationCoordinate = buildOptionCoordinate(option, {});
    option.pathFamily = option.conversationCoordinate.path;
    option.dialectMode = option.conversationCoordinate.dialect;
    option.contextExpectation = option.conversationCoordinate.expectation;

    return option;
  }

  function inferDigDeeperLabel(target, intent, basePoolMode) {
    const mode = basePoolMode || BASE_POOL_MODES.NONE;

    if (mode === BASE_POOL_MODES.PUBLIC_MAP) return "Can you show me the deeper version of the public map?";
    if (mode === BASE_POOL_MODES.NARRATIVE_PATH) return "Can you take me one layer deeper into the narrative path?";
    if (mode === BASE_POOL_MODES.MISSION) return "Can you take me deeper into the mission?";
    if (mode === BASE_POOL_MODES.PRACTICAL) return "Can you show how this becomes practical?";
    if (mode === BASE_POOL_MODES.PROOF) return "Can you show what makes this trustworthy?";
    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY) return "How does the Diagnostic connect to the Character Mirror?";
    if (mode === BASE_POOL_MODES.CHARACTER_MIRROR) return "How does the Character Mirror connect to the Diagnostic?";
    if (mode === BASE_POOL_MODES.MIRRORLAND) return "Can you take me deeper into Mirrorland?";
    if (mode === BASE_POOL_MODES.HEARTH) return "Can you explain Hearth as Mission Control?";
    if (mode === BASE_POOL_MODES.FRONTIER) return "Can you show how Frontier tests systems?";
    if (mode === BASE_POOL_MODES.CHARACTERS) return "Can you introduce the Characters?";
    if (mode === BASE_POOL_MODES.CREATOR) return "Can you explain the creator path?";
    if (mode === BASE_POOL_MODES.UNDERDOG) return "Can you explain This Underdog?";

    return "Can you take me one layer deeper?";
  }

  function buildChoiceClosure(target, intent, context, basePoolMode, coordinateArg) {
    const ctx = normalizeContext(context);
    const coordinate = coordinateArg || ctx.conversationCoordinate || null;
    const gate = ctx.gateType || (coordinate && coordinate.gate) || "";
    const cleanTarget = normalizeTarget(target || ctx.selectedTarget || "");
    const mode = basePoolMode || inferBasePoolMode(cleanTarget, intent, ctx);
    const next = coordinate && Array.isArray(coordinate.next) ? coordinate.next : [];

    const closure = {
      ...CHOICE_CLOSURE_DEFAULT,
      mode
    };

    if (coordinate) {
      closure.preparedDoorAvailable = next.includes("open_page") || gate === GATES.PREPARED_DOOR;
      closure.preparedDoorSuggested = gate === GATES.PREPARED_DOOR;
      closure.digDeeperAvailable =
        (next.includes("dig_deeper") || gate === GATES.BASE_POOL || gate === GATES.INTRIGUE_BRIDGE) &&
        gate !== GATES.DIG_DEEPER &&
        gate !== GATES.PREPARED_DOOR &&
        gate !== GATES.RETURN_FORK &&
        gate !== GATES.DIAGNOSTIC_BOUNDARY;
      closure.returnForkAvailable = next.includes("return") || next.includes("guided_chooser") || gate !== GATES.ARRIVAL;
      closure.finalChatThreshold = gate === GATES.DIAGNOSTIC_BOUNDARY || gate === GATES.PREPARED_DOOR;
      return closure;
    }

    if (mode === BASE_POOL_MODES.GUIDED_CHOOSER || cleanTarget === TARGETS.SPLIT_INTERFACE) {
      closure.preparedDoorAvailable = false;
      closure.digDeeperAvailable = false;
      closure.returnForkAvailable = false;
    }

    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || cleanTarget === TARGETS.DIAGNOSTIC_REFERRAL) {
      closure.preparedDoorAvailable = true;
      closure.digDeeperAvailable = false;
      closure.returnForkAvailable = true;
      closure.finalChatThreshold = true;
    }

    if (mode === BASE_POOL_MODES.RETURN) {
      closure.preparedDoorAvailable = false;
      closure.digDeeperAvailable = false;
      closure.returnForkAvailable = true;
    }

    return closure;
  }

  function inferBasePoolMode(target, intent, context) {
    const ctx = normalizeContext(context);
    if (ctx.basePoolMode) return ctx.basePoolMode;
    if (ctx.conversationCoordinate && ctx.conversationCoordinate.mode) return ctx.conversationCoordinate.mode;

    const cleanTarget = normalizeTarget(target || ctx.selectedTarget || "");
    const cleanIntent = normalizeIntent(intent || ctx.intent || "");

    if (isGuidedChooserRequest(cleanTarget, cleanIntent, ctx)) return BASE_POOL_MODES.GUIDED_CHOOSER;

    if (cleanTarget === TARGETS.DIAMOND_GATE_OVERVIEW || cleanIntent === "diamondGate") return BASE_POOL_MODES.ESTATE_OVERVIEW;
    if (cleanTarget === TARGETS.SPLIT_INTERFACE || cleanIntent === "splitInterface") return BASE_POOL_MODES.GUIDED_CHOOSER;
    if (cleanTarget === TARGETS.TRADITIONAL_WEBSITE || cleanIntent === "traditionalWebsite") return BASE_POOL_MODES.PUBLIC_MAP;
    if (cleanTarget === TARGETS.NARRATIVE_PATH || cleanIntent === "narrativePath") return BASE_POOL_MODES.NARRATIVE_PATH;

    if (cleanTarget === TARGETS.MISSION_OVERVIEW || cleanIntent === "mission") return BASE_POOL_MODES.MISSION;
    if (cleanTarget === TARGETS.MISSION_INNER) return BASE_POOL_MODES.INNER_MISSION;
    if (cleanTarget === TARGETS.MISSION_COMMUNITY) return BASE_POOL_MODES.COMMUNITY_MISSION;
    if (cleanTarget === TARGETS.MISSION_COLLABORATION) return BASE_POOL_MODES.COLLABORATION_MISSION;

    if (cleanTarget === TARGETS.PRACTICAL_RELEVANCE || cleanTarget === TARGETS.PRODUCTS || cleanIntent === "practicalRelevance") return BASE_POOL_MODES.PRACTICAL;
    if (cleanTarget === TARGETS.SCIENTIFIC_LAW || cleanTarget === TARGETS.LAWS || cleanIntent === "scientificLaw" || cleanIntent === "laws" || cleanIntent === "proof") return BASE_POOL_MODES.PROOF;

    if (cleanTarget === TARGETS.DIAGNOSTIC_REFERRAL || cleanIntent === "diagnosticReferral") return BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY;
    if (cleanTarget === TARGETS.DIAGNOSTIC || cleanIntent === "diagnostic") return BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY;
    if (cleanTarget === TARGETS.CHARACTER_MIRROR || cleanIntent === "characterMirror") return BASE_POOL_MODES.CHARACTER_MIRROR;

    if (cleanTarget === TARGETS.MIRRORLAND || cleanIntent === "mirrorland") return BASE_POOL_MODES.MIRRORLAND;
    if (cleanTarget === TARGETS.HEARTH || cleanIntent === "hearth") return BASE_POOL_MODES.HEARTH;
    if (cleanTarget === TARGETS.FRONTIER || cleanIntent === "frontier") return BASE_POOL_MODES.FRONTIER;
    if (cleanTarget === TARGETS.CHARACTERS || cleanIntent === "characters") return BASE_POOL_MODES.CHARACTERS;

    if (cleanTarget === TARGETS.SEAN || cleanIntent === "sean") return BASE_POOL_MODES.CREATOR;
    if (cleanTarget === TARGETS.UNDERDOG || cleanIntent === "underdog") return BASE_POOL_MODES.UNDERDOG;

    if (cleanTarget === TARGETS.RECENTER || cleanTarget === TARGETS.CLEAN_DOOR || cleanTarget === TARGETS.RETURN_FORK || cleanTarget === TARGETS.RESTART_FORK || cleanIntent === "recenter") return BASE_POOL_MODES.RETURN;

    return BASE_POOL_MODES.NONE;
  }

  function inferIlluminationMode(target, intent, context, basePoolMode) {
    const ctx = normalizeContext(context);
    if (ctx.illuminationMode) return ctx.illuminationMode;

    const coordinate = ctx.conversationCoordinate;
    if (coordinate) {
      if (coordinate.path === "proof") return ILLUMINATION_MODES.PROOF;
      if (coordinate.path === "practical" || coordinate.path === "frontier") return ILLUMINATION_MODES.PRACTICAL;
      if (coordinate.path === "return") return ILLUMINATION_MODES.RETURN;
      if (coordinate.path === "diagnostic" || coordinate.gate === GATES.DIAGNOSTIC_BOUNDARY) return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
      if (["narrative", "mission", "character", "hearth", "mirrorland", "creator"].includes(coordinate.path)) return ILLUMINATION_MODES.NARRATIVE;
    }

    const mode = basePoolMode || inferBasePoolMode(target, intent, ctx);

    if (mode === BASE_POOL_MODES.RETURN) return ILLUMINATION_MODES.RETURN;
    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || mode === BASE_POOL_MODES.CHARACTER_MIRROR) return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
    if (mode === BASE_POOL_MODES.PROOF) return ILLUMINATION_MODES.PROOF;
    if (mode === BASE_POOL_MODES.PRACTICAL || mode === BASE_POOL_MODES.COLLABORATION_MISSION || mode === BASE_POOL_MODES.FRONTIER) return ILLUMINATION_MODES.PRACTICAL;
    if (mode === BASE_POOL_MODES.GUIDED_CHOOSER) return ILLUMINATION_MODES.THRESHOLD;

    if ([
      BASE_POOL_MODES.NARRATIVE_PATH,
      BASE_POOL_MODES.MISSION,
      BASE_POOL_MODES.INNER_MISSION,
      BASE_POOL_MODES.COMMUNITY_MISSION,
      BASE_POOL_MODES.MIRRORLAND,
      BASE_POOL_MODES.HEARTH,
      BASE_POOL_MODES.CHARACTERS,
      BASE_POOL_MODES.UNDERDOG
    ].includes(mode)) return ILLUMINATION_MODES.NARRATIVE;

    return ILLUMINATION_MODES.PUBLIC;
  }

  function inferEntryStackMode(target, intent, context, basePoolMode) {
    const ctx = normalizeContext(context);
    if (ctx.entryStackMode) return ctx.entryStackMode;

    const coordinate = ctx.conversationCoordinate;
    if (coordinate) {
      if (coordinate.gate === GATES.ARRIVAL) return ENTRY_STACK_MODES.ENTRANCE;
      if (coordinate.gate === GATES.SPLIT || coordinate.gate === GATES.INTENTION) return ENTRY_STACK_MODES.GUIDED_CHOOSER;
      if (coordinate.gate === GATES.DIG_DEEPER) return ENTRY_STACK_MODES.DIG_DEEPER;
      if (coordinate.gate === GATES.PREPARED_DOOR) return ENTRY_STACK_MODES.PREPARED_DOOR;
      if (coordinate.gate === GATES.RETURN_FORK) return ENTRY_STACK_MODES.RETURN;
      if (coordinate.gate === GATES.CROSS_PATH_BRIDGE || coordinate.gate === GATES.INTRIGUE_BRIDGE) return ENTRY_STACK_MODES.PATH_SAMPLE;
    }

    const cleanTarget = normalizeTarget(target || ctx.selectedTarget || "");
    const cleanIntent = normalizeIntent(intent || ctx.intent || "");
    const mode = basePoolMode || inferBasePoolMode(cleanTarget, cleanIntent, ctx);

    if (mode === BASE_POOL_MODES.GUIDED_CHOOSER || cleanTarget === TARGETS.SPLIT_INTERFACE) return ENTRY_STACK_MODES.GUIDED_CHOOSER;
    if (mode === BASE_POOL_MODES.RETURN || cleanIntent === "recenter") return ENTRY_STACK_MODES.RETURN;
    if (ctx.movementIntent === "continue_current_path" || ctx.optionKind === "forward") return ENTRY_STACK_MODES.DIG_DEEPER;
    if (ctx.movementIntent === "open_prepared_door" || ctx.optionKind === "route") return ENTRY_STACK_MODES.PREPARED_DOOR;
    if (ctx.movementIntent === "cross_to_related_room" || ctx.optionKind === "parallel") return ENTRY_STACK_MODES.PATH_SAMPLE;
    if (mode !== BASE_POOL_MODES.NONE) return ENTRY_STACK_MODES.BASE_POOL;

    return ENTRY_STACK_MODES.PATH_SAMPLE;
  }

  function rewritePromptLabel(label, target, context) {
    let clean = safeText(label);
    const ctx = normalizeContext(context);
    const normalizedTarget = normalizeTarget(target);

    PROMPT_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (isDiagnosticAssessmentRequest(label)) {
      return TARGET_LABELS.diagnosticReferralPath;
    }

    if (isGuidedLabel(clean) && normalizedTarget === TARGETS.SPLIT_INTERFACE) {
      return TARGET_LABELS.splitInterfaceBridgePath;
    }

    if (normalizedTarget === TARGETS.DIAGNOSTIC) return TARGET_LABELS.diagnosticPath;
    if (normalizedTarget === TARGETS.DIAGNOSTIC_REFERRAL) return TARGET_LABELS.diagnosticReferralPath;

    if (TARGET_LABELS[normalizedTarget]) {
      const rough = /^(visit|open|launch|go to|enter)\b/i.test(clean);
      if (rough) return TARGET_LABELS[normalizedTarget];
    }

    if (ctx.intent === "mission" && /community/i.test(clean)) return "What is the community mission?";
    if (ctx.intent === "mission" && /practical|collaboration|teamwork/i.test(clean)) return "How does the mission become practical?";

    return clean;
  }

  function shapeForkBridge(input, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (bridgeLine) return bridgeLine;

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || ctx.intent === "diamondGate") return SPLIT_INTERFACE_COPY.bridge;
    if (target === TARGETS.MISSION_OVERVIEW || ctx.intent === "mission") return "The mission can move inward, outward, or into practical construction.";
    if (target === TARGETS.NARRATIVE_PATH || ctx.currentEntryLane === "narrative") return "You can stay inside the narrative path, or I can show you the public website version of this same idea.";
    if (target === TARGETS.TRADITIONAL_WEBSITE || ctx.currentEntryLane === "traditional") return "You can stay on the public map, or I can show you the narrative version of this same idea.";

    return sanitizePublicText(input || "I can keep you on this path or bridge you to the next clean door.", ctx, "bubble");
  }

  function shapeTransitionBridge(fromTarget, toTarget, context) {
    const ctx = normalizeContext(context);
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (bridgeLine) return bridgeLine;

    const from = normalizeTarget(fromTarget || "");
    const to = normalizeTarget(toTarget || "");

    if ((from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.NARRATIVE_PATH) ||
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE)) return SPLIT_INTERFACE_COPY.bridge;

    if ((from === TARGETS.TRADITIONAL_COMPASS && to === TARGETS.HEARTH) ||
        (from === TARGETS.HEARTH && to === TARGETS.TRADITIONAL_COMPASS)) return BRIDGE_COPY.compassHearth;

    if ((from === TARGETS.PRODUCTS && to === TARGETS.FRONTIER) ||
        (from === TARGETS.FRONTIER && to === TARGETS.PRODUCTS)) return BRIDGE_COPY.productsFrontier;

    if ((from === TARGETS.LAWS && to === TARGETS.SCIENTIFIC_LAW) ||
        (from === TARGETS.SCIENTIFIC_LAW && to === TARGETS.LAWS)) return BRIDGE_COPY.lawsScientificLaw;

    if ((from === TARGETS.SEAN && to === TARGETS.UNDERDOG) ||
        (from === TARGETS.UNDERDOG && to === TARGETS.SEAN)) return BRIDGE_COPY.seanUnderdog;

    if ((from === TARGETS.MISSION_OVERVIEW && to === TARGETS.NARRATIVE_PATH) ||
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.MISSION_OVERVIEW)) return BRIDGE_COPY.missionNarrative;

    if ((from === TARGETS.MIRRORLAND && to === TARGETS.TRADITIONAL_WEBSITE) ||
        (from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.MIRRORLAND)) return BRIDGE_COPY.mirrorlandWebsite;

    if ((from === TARGETS.CHARACTER_MIRROR && to === TARGETS.DIAGNOSTIC_REFERRAL) ||
        (from === TARGETS.DIAGNOSTIC_REFERRAL && to === TARGETS.CHARACTER_MIRROR)) return BRIDGE_COPY.diagnosticCharacterMirror;

    return sanitizePublicText("This is a bridge path. I can show how one side connects to the other before we move.", ctx, "bubble");
  }

  function shapePreKnowledgeBridge(input, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(ctx.selectedTarget || "");

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW) return "Start with the whole estate before choosing a room.";
    if (target === TARGETS.SPLIT_INTERFACE) return "Start by choosing what you are looking for. I will turn that into the right doorway.";
    if (target === TARGETS.MISSION_OVERVIEW) return "Start with the larger mission, then choose the inner, community, or practical expression.";
    if (target === TARGETS.DIAGNOSTIC) return DIAGNOSTIC_BOUNDARY_COPY.diagnostic;
    if (target === TARGETS.DIAGNOSTIC_REFERRAL || target === TARGETS.CHARACTER_MIRROR) return DIAGNOSTIC_BOUNDARY_COPY.boundary;

    return sanitizePublicText(input || "I’ll give the clean overview first, then the next door.", ctx, "bubble");
  }

  function shapeBridgeContextLine(context) {
    const ctx = normalizeContext(context);
    const bridge = ctx.bridgeContext;

    if (!bridge) return "";

    const from = normalizeTarget(bridge.priorNode || "");
    const to = normalizeTarget(bridge.selectedTarget || bridge.adjacentTarget || "");

    const translated = translateAdjacentReason(bridge.adjacentReason, from, to);
    if (translated) return translated;

    if ((from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.NARRATIVE_PATH) ||
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE)) return SPLIT_INTERFACE_COPY.bridge;

    if ((from === TARGETS.CHARACTER_MIRROR && to === TARGETS.DIAGNOSTIC_REFERRAL) ||
        (from === TARGETS.DIAGNOSTIC_REFERRAL && to === TARGETS.CHARACTER_MIRROR)) return BRIDGE_COPY.diagnosticCharacterMirror;

    if (to === TARGETS.DIAGNOSTIC || to === TARGETS.DIAGNOSTIC_REFERRAL) return DIAGNOSTIC_BOUNDARY_COPY.boundary;

    if (bridge.bridgeMoment === "parallel_crossing" || bridge.movementIntent === "cross_to_related_room") {
      return "This is a bridge path. I’ll show how the current room connects to the next one.";
    }

    return "";
  }

  function translateAdjacentReason(reason, from, to) {
    const clean = safeText(reason).toLowerCase();

    if (!clean) return "";

    if (/public website structure into the narrative path/.test(clean)) {
      return "The public map and the narrative path are connected. I can show you how this doorway crosses over.";
    }

    if (/narrative path back to public website structure/.test(clean)) {
      return "We can step out of the story layer and return to the public map whenever you need structure.";
    }

    if (/mission lane/.test(clean)) {
      return "This moves into the mission lane, where the estate becomes personal, communal, and practical.";
    }

    if (/practical/.test(clean)) {
      return "This turns the idea toward practical use, public value, and real-world application.";
    }

    if (/diagnostic boundary/.test(clean)) return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    if (from === TARGETS.PRODUCTS && to === TARGETS.FRONTIER) return BRIDGE_COPY.productsFrontier;
    if (from === TARGETS.LAWS && to === TARGETS.SCIENTIFIC_LAW) return BRIDGE_COPY.lawsScientificLaw;

    return "";
  }

  function withBridgeLead(bubbles, context) {
    const ctx = normalizeContext(context);
    const source = Array.isArray(bubbles) ? bubbles.slice() : [];
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (!bridgeLine) return source.slice(0, 4);
    if (!shouldLeadWithBridge(ctx)) return source.slice(0, 4);

    const alreadyPresent = source.some((bubble) => safeText(bubble).toLowerCase() === bridgeLine.toLowerCase());
    if (alreadyPresent) return source.slice(0, 4);

    return [bridgeLine].concat(source).slice(0, 4);
  }

  function shouldLeadWithBridge(context) {
    const ctx = normalizeContext(context);
    const bridge = ctx.bridgeContext;

    if (!bridge) return false;
    if (ctx.selectedTarget === TARGETS.DIAMOND_GATE_OVERVIEW && ctx.intent === "diamondGate") return false;
    if (isGuidedChooserRequest(ctx.selectedTarget, ctx.intent, ctx)) return false;

    return bridge.bridgeMoment === "parallel_crossing" ||
      bridge.movementIntent === "cross_to_related_room" ||
      bridge.priorLane !== ctx.currentEntryLane ||
      bridge.selectedTarget === TARGETS.SPLIT_INTERFACE ||
      bridge.selectedTarget === TARGETS.DIAGNOSTIC_REFERRAL ||
      bridge.selectedTarget === TARGETS.DIAGNOSTIC;
  }

  function shapeRouteLabel(routeId, fallbackLabel) {
    const route = safeText(routeId);
    return ROUTE_LABELS[route] || sanitizePublicText(fallbackLabel || route || "Open Door", {}, "route");
  }

  function shapeHandoffLabels(labels, handoffs) {
    const shaped = {};

    if (labels && typeof labels === "object") {
      Object.keys(labels).forEach((route) => {
        shaped[route] = shapeRouteLabel(route, labels[route]);
      });
    }

    if (Array.isArray(handoffs)) {
      handoffs.forEach((route) => {
        const key = safeText(route);
        if (!shaped[key]) shaped[key] = shapeRouteLabel(key, key);
      });
    }

    return shaped;
  }

  function sanitizePublicText(text, context, mode) {
    let clean = safeText(text);
    const ctx = normalizeContext(context);

    if (isProtectedInterfacePhrase(clean)) return clean;

    PUBLIC_LANGUAGE_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (mode === "option") {
      PROMPT_REWRITES.forEach((rule) => {
        clean = clean.replace(rule.pattern, rule.replacement);
      });

      if (isDiagnosticAssessmentRequest(clean)) clean = TARGET_LABELS.diagnosticReferralPath;
    } else if (mode === "bubble") {
      clean = softenDiagnosticAssessmentLanguage(clean);
    } else {
      PROMPT_REWRITES.forEach((rule) => {
        clean = clean.replace(rule.pattern, rule.replacement);
      });
    }

    if ((ctx.intent === "diagnosticReferral" || ctx.gateType === GATES.DIAGNOSTIC_BOUNDARY) && /\bI can assess\b/i.test(clean)) {
      clean = clean.replace(/\bI can assess\b/gi, "I can explain");
    }

    clean = clean
      .replace(/```/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+\./g, ".")
      .replace(/\s+,/g, ",")
      .trim();

    return clean;
  }

  function softenDiagnosticAssessmentLanguage(text) {
    let clean = safeText(text);

    clean = clean.replace(/\bI can assess you here\b/gi, "I can explain the Diagnostic and route you there");
    clean = clean.replace(/\bI can score you here\b/gi, "I can explain the Diagnostic and route you there");
    clean = clean.replace(/\bI can diagnose you here\b/gi, "I can explain the Diagnostic and route you there");
    clean = clean.replace(/\bI can classify you here\b/gi, "I can explain the Diagnostic and route you there");
    clean = clean.replace(/\bI can decide which archetype you are\b/gi, "I can explain how the Diagnostic handles alignment reads");
    clean = clean.replace(/\bI can decide which Character you are\b/gi, "I can explain how the Character Mirror relates to the Diagnostic");

    if (isDiagnosticAssessmentRequest(clean)) return DIAGNOSTIC_BOUNDARY_COPY.boundary;

    return clean;
  }

  function isProtectedInterfacePhrase(text) {
    const clean = safeText(text);
    return PROTECTED_INTERFACE_PHRASES.some((phrase) => phrase === clean);
  }

  function shapeInterfaceState(stateName) {
    const key = safeText(stateName);
    return INTERFACE_STATE_COPY[key] || "";
  }

  function shouldUseTrainingWheels(context) {
    const ctx = normalizeContext(context);

    return ctx.gateType === GATES.ARRIVAL ||
      ctx.gateType === GATES.INTENTION ||
      ctx.intent === "diamondGate" ||
      ctx.intent === "splitInterface" ||
      ctx.currentConversationStage === "entrance_overview" ||
      ctx.currentConversationStage === "split_interface_gate";
  }

  function shapeEntranceOptions() {
    return [
      makeStaticOption("Can you help me choose where to start?", TARGETS.SPLIT_INTERFACE, "story_prompt", "story_entry", "entrance_fork", "ask_jeeves", "objective"),
      makeStaticOption("What is the traditional website for?", TARGETS.TRADITIONAL_WEBSITE, "story_prompt", "story_entry", "entrance_fork", "ask_jeeves", "objective"),
      makeStaticOption("What can I actually do here?", TARGETS.PRACTICAL_RELEVANCE, "practical_prompt", "practical_entry", "entrance_fork", "ask_jeeves", "objective"),
      makeStaticOption("What is the narrative path?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry", "entrance_fork", "ask_jeeves", "narrative"),
      makeStaticOption("What is the mission behind this?", TARGETS.MISSION_OVERVIEW, "personal_prompt", "personal_entry", "entrance_fork", "ask_jeeves", "narrative")
    ];
  }

  function shapeGuidedChooserOptions() {
    return DIRECTIONAL_CHOOSER_OPTIONS.slice();
  }

  function shapeMissionOptions() {
    return [
      makeStaticOption("What is the inner mission?", TARGETS.MISSION_INNER, "personal_prompt", "personal_entry", "before_knowledge", "ask_jeeves", "narrative"),
      makeStaticOption("What is the community mission?", TARGETS.MISSION_COMMUNITY, "personal_prompt", "personal_entry", "before_knowledge", "ask_jeeves", "narrative"),
      makeStaticOption("How does the mission become practical?", TARGETS.MISSION_COLLABORATION, "practical_prompt", "practical_entry", "before_knowledge", "ask_jeeves", "objective"),
      makeStaticOption("How does this connect to Mirrorland?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry", "parallel_crossing", "cross_to_related_room", "narrative")
    ];
  }

  function shapeDiagnosticBoundaryOptions() {
    return [
      makeStaticOption("What is the Coherence Diagnostic?", TARGETS.DIAGNOSTIC, "personal_prompt", "personal_entry", "before_knowledge", "ask_jeeves", "objective"),
      makeStaticOption("Where can I take the alignment diagnostic?", TARGETS.DIAGNOSTIC_REFERRAL, "personal_prompt", "personal_entry", "before_knowledge", "ask_jeeves", "objective"),
      makeStaticOption("What does the Character Mirror show?", TARGETS.CHARACTER_MIRROR, "story_prompt", "story_entry", "before_knowledge", "ask_jeeves", "narrative"),
      makeStaticOption("How does this connect to the narrative path?", TARGETS.NARRATIVE_PATH, "story_prompt", "story_entry", "parallel_crossing", "cross_to_related_room", "narrative")
    ];
  }

  function makeStaticOption(label, target, promptMode, archetypeAlignment, bridgeMoment, movementIntent, scopeLane) {
    const option = {
      label,
      target,
      type: "conversation",
      scopeLane,
      promptMode,
      optionKind: "conversation_prompt",
      archetypeAlignment,
      bridgeMoment,
      movementIntent
    };

    option.conversationCoordinate = buildOptionCoordinate(option, {});
    option.gateType = option.conversationCoordinate.gate;
    option.pathFamily = option.conversationCoordinate.path;
    option.dialectMode = option.conversationCoordinate.dialect;
    option.contextExpectation = option.conversationCoordinate.expectation;
    option.noRepeat = option.conversationCoordinate.noRepeat;

    return option;
  }

  function inferBridgeMomentFromContext(context) {
    const ctx = normalizeContext(context);
    if (ctx.bridgeContext && ctx.bridgeContext.bridgeMoment) return ctx.bridgeContext.bridgeMoment;
    if (ctx.bridgeMoment) return ctx.bridgeMoment;
    return "before_knowledge";
  }

  function inferPromptModeFromPool(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.PROOF) return "skeptic_prompt";
    if (basePoolMode === BASE_POOL_MODES.PRACTICAL || basePoolMode === BASE_POOL_MODES.FRONTIER || basePoolMode === BASE_POOL_MODES.COLLABORATION_MISSION) return "practical_prompt";
    if (basePoolMode === BASE_POOL_MODES.MISSION || basePoolMode === BASE_POOL_MODES.INNER_MISSION || basePoolMode === BASE_POOL_MODES.COMMUNITY_MISSION || basePoolMode === BASE_POOL_MODES.UNDERDOG || basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY) return "personal_prompt";
    if (basePoolMode === BASE_POOL_MODES.RETURN) return "recenter_prompt";
    return "story_prompt";
  }

  function inferAlignmentFromPool(basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.PROOF) return "proof_entry";
    if (basePoolMode === BASE_POOL_MODES.PRACTICAL || basePoolMode === BASE_POOL_MODES.FRONTIER || basePoolMode === BASE_POOL_MODES.COLLABORATION_MISSION) return "practical_entry";
    if (basePoolMode === BASE_POOL_MODES.MISSION || basePoolMode === BASE_POOL_MODES.INNER_MISSION || basePoolMode === BASE_POOL_MODES.COMMUNITY_MISSION || basePoolMode === BASE_POOL_MODES.UNDERDOG || basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY) return "personal_entry";
    if (basePoolMode === BASE_POOL_MODES.CREATOR) return "source_entry";
    if (basePoolMode === BASE_POOL_MODES.RETURN) return "unknown_entry";
    return "story_entry";
  }

  function inferScopeLaneFromTarget(target) {
    const clean = normalizeTarget(target);

    if ([
      TARGETS.NARRATIVE_PATH,
      TARGETS.MISSION_OVERVIEW,
      TARGETS.MISSION_INNER,
      TARGETS.MISSION_COMMUNITY,
      TARGETS.MISSION_COLLABORATION,
      TARGETS.MIRRORLAND,
      TARGETS.HEARTH,
      TARGETS.FRONTIER,
      TARGETS.CHARACTERS,
      TARGETS.CHARACTER_MIRROR,
      TARGETS.UNDERDOG
    ].includes(clean)) return "narrative";

    return "objective";
  }

  function isGuidedChooserRequest(target, intent, context) {
    const ctx = normalizeContext(context);
    const selectedLabel = safeText(ctx.selectedLabel).toLowerCase();
    const cleanTarget = normalizeTarget(target);
    const cleanIntent = normalizeIntent(intent);
    const gate = ctx.gateType || (ctx.conversationCoordinate && ctx.conversationCoordinate.gate) || "";

    return gate === GATES.INTENTION ||
      gate === GATES.SPLIT ||
      (
        cleanTarget === TARGETS.SPLIT_INTERFACE &&
        (
          cleanIntent === "splitInterface" ||
          isGuidedLabel(selectedLabel) ||
          ctx.currentConversationStage === "split_interface_gate"
        )
      );
  }

  function isGuidedLabel(label) {
    const value = safeText(label).toLowerCase();
    return /\b(help me choose|choose where to start|where should i start|need guidance|guide me|not sure where to start|where do i begin)\b/.test(value);
  }

  function isDiagnosticAssessmentRequest(text) {
    const value = safeText(text).toLowerCase();

    return /\b(which archetype am i|what archetype am i|which character am i|what character am i|which character am i most like|what character am i most like|assess me|score me|diagnose me|classify me|type me|run the mirror question|ask me the first mirror question|ask me the second mirror question|ask me the third mirror question|first mirror question|second mirror question|third mirror question)\b/.test(value);
  }

  function isDiagnosticExplanationRequest(text) {
    const value = safeText(text).toLowerCase();
    return /\b(what is|explain|tell me about|how does|where does).*\b(coherence diagnostic|diagnostic|character mirror)\b/.test(value);
  }

  function isDiagnosticAssessmentTarget(target) {
    const raw = safeText(target);
    const clean = normalizeTarget(raw);

    return [
      "characterArchetypeQuestionOne",
      "characterArchetypeQuestionTwo",
      "characterArchetypeQuestionThree",
      "characterArchetypeResult",
      "characterMirrorQuestionOne",
      "characterMirrorQuestionTwo",
      "characterMirrorQuestionThree",
      "characterMirrorResult"
    ].includes(raw) || clean === TARGETS.DIAGNOSTIC_REFERRAL;
  }

  function normalizeBubbleList(value) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => safeText(item)).filter(Boolean).slice(0, 4);
  }

  function sanitizeBubbleList(value, context) {
    return normalizeBubbleList(value).map((item) => sanitizePublicText(item, context, "bubble"));
  }

  function normalizeTarget(target) {
    const clean = safeText(target);

    const aliases = {
      characterArchetypeMirrorPath: TARGETS.CHARACTER_MIRROR,
      characterMirrorPath: TARGETS.CHARACTER_MIRROR,
      selfLearningPath: TARGETS.DIAGNOSTIC_REFERRAL,
      mirrorMePath: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeQuestionOne: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeQuestionTwo: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeQuestionThree: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeResult: TARGETS.DIAGNOSTIC_REFERRAL,
      characterMirrorQuestionOne: TARGETS.DIAGNOSTIC_REFERRAL,
      characterMirrorQuestionTwo: TARGETS.DIAGNOSTIC_REFERRAL,
      characterMirrorQuestionThree: TARGETS.DIAGNOSTIC_REFERRAL,
      characterMirrorResult: TARGETS.DIAGNOSTIC_REFERRAL,
      missionPath: TARGETS.MISSION_OVERVIEW,
      websitePath: TARGETS.DIAMOND_GATE_OVERVIEW,
      siteOverviewPath: TARGETS.DIAMOND_GATE_OVERVIEW,
      traditionalPath: TARGETS.TRADITIONAL_WEBSITE,
      narrativeOverviewPath: TARGETS.NARRATIVE_PATH,
      whereToStart: TARGETS.SPLIT_INTERFACE,
      guidedChooserPath: TARGETS.SPLIT_INTERFACE,
      startGuidePath: TARGETS.SPLIT_INTERFACE,
      returnForkPath: TARGETS.RETURN_FORK,
      restartForkPath: TARGETS.RESTART_FORK
    };

    return aliases[clean] || clean;
  }

  function normalizeIntent(intent) {
    const clean = safeText(intent);

    const aliases = {
      characterArchetypeMirror: "diagnosticReferral",
      diamondGateBridge: "diamondGate",
      traditional: "traditionalWebsite",
      narrative: "narrativePath",
      guidedChooser: "splitInterface",
      whereToStart: "splitInterface"
    };

    return aliases[clean] || clean;
  }

  function normalizeContext(context) {
    const source = context && typeof context === "object" ? context : {};
    const coordinate = normalizeCoordinate(source.conversationCoordinate || null);

    return {
      intent: normalizeIntent(source.intent || ""),
      selectedTarget: normalizeTarget(source.selectedTarget || source.target || ""),
      selectedLabel: safeText(source.selectedLabel || source.label || ""),
      currentNode: normalizeTarget(source.currentNode || ""),
      currentPath: normalizeTarget(source.currentPath || ""),
      currentEntryLane: safeText(source.currentEntryLane || source.entryLane || ""),
      lastLane: safeText(source.lastLane || ""),
      currentConversationStage: safeText(source.currentConversationStage || source.conversationStage || ""),
      promptMode: safeText(source.promptMode || ""),
      optionKind: safeText(source.optionKind || ""),
      bridgeMoment: safeText(source.bridgeMoment || ""),
      movementIntent: safeText(source.movementIntent || ""),

      conversationCoordinate: coordinate,
      gateType: safeText(source.gateType || (coordinate && coordinate.gate) || ""),
      pathFamily: safeText(source.pathFamily || (coordinate && coordinate.path) || ""),
      dialectMode: safeText(source.dialectMode || (coordinate && coordinate.dialect) || ""),
      contextExpectation: safeText(source.contextExpectation || (coordinate && coordinate.expectation) || ""),
      noRepeat: typeof source.noRepeat === "boolean" ? source.noRepeat : Boolean(coordinate && coordinate.noRepeat),

      entryStackMode: safeText(source.entryStackMode || ""),
      basePoolMode: safeText(source.basePoolMode || (coordinate && coordinate.mode) || ""),
      illuminationMode: safeText(source.illuminationMode || ""),
      choiceClosure: source.choiceClosure && typeof source.choiceClosure === "object" ? source.choiceClosure : null,
      bridgeContext: normalizeBridgeContext(source.bridgeContext || null)
    };
  }

  function normalizeCoordinate(value) {
    if (!value || typeof value !== "object") return null;

    return {
      step: safeNumber(value.step, 5),
      priorStep: safeNumber(value.priorStep, 0),
      gate: safeText(value.gate || ""),
      path: safeText(value.path || ""),
      mode: safeText(value.mode || ""),
      dialect: safeText(value.dialect || ""),
      expectation: safeText(value.expectation || ""),
      target: normalizeTarget(value.target || ""),
      destination: safeText(value.destination || ""),
      next: Array.isArray(value.next) ? value.next.map(safeText).filter(Boolean).slice(0, 10) : [],
      noRepeat: Boolean(value.noRepeat)
    };
  }

  function normalizeBridgeContext(value) {
    if (!value || typeof value !== "object") return null;

    return {
      currentNode: normalizeTarget(value.currentNode || ""),
      priorNode: normalizeTarget(value.priorNode || ""),
      priorLane: safeText(value.priorLane || ""),
      priorTopic: safeText(value.priorTopic || ""),
      selectedTarget: normalizeTarget(value.selectedTarget || ""),
      selectedLabel: safeText(value.selectedLabel || ""),
      promptMode: safeText(value.promptMode || ""),
      optionKind: safeText(value.optionKind || ""),
      archetypeAlignment: safeText(value.archetypeAlignment || ""),
      bridgeMoment: safeText(value.bridgeMoment || ""),
      movementIntent: safeText(value.movementIntent || ""),
      currentTopic: safeText(value.currentTopic || ""),
      currentScopeStage: safeText(value.currentScopeStage || ""),
      adjacentTarget: normalizeTarget(value.adjacentTarget || ""),
      adjacentLabel: safeText(value.adjacentLabel || ""),
      adjacentReason: safeText(value.adjacentReason || "")
    };
  }

  function buildFallbackCoordinate(source, context) {
    const ctx = normalizeContext(context);
    const src = source && typeof source === "object" ? source : {};
    const target = normalizeTarget(src.selectedTarget || ctx.selectedTarget || "");
    const intent = normalizeIntent(src.intent || ctx.intent || "");
    const basePoolMode = src.basePoolMode || ctx.basePoolMode || inferBasePoolMode(target, intent, ctx);
    const entryStackMode = src.entryStackMode || ctx.entryStackMode || inferEntryStackMode(target, intent, ctx, basePoolMode);
    const gate = src.gateType || ctx.gateType || inferGateFromContext(target, intent, ctx, entryStackMode, basePoolMode);
    const path = src.pathFamily || ctx.pathFamily || inferPathFamily(target, intent, basePoolMode);
    const dialect = src.dialectMode || ctx.dialectMode || inferDialectMode(target, intent, basePoolMode, src.illuminationMode || ctx.illuminationMode);
    const expectation = src.contextExpectation || ctx.contextExpectation || inferExpectation(gate);

    return {
      step: stepForGate(gate),
      priorStep: priorStepForGate(gate),
      gate,
      path,
      mode: basePoolMode,
      dialect,
      expectation,
      target,
      destination: "",
      next: nextForGate(gate, path),
      noRepeat: Boolean(src.noRepeat || ctx.noRepeat || isNoRepeatGate(gate))
    };
  }

  function buildOptionCoordinate(option, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(option.target || ctx.selectedTarget || "");
    const intent = normalizeIntent(ctx.intent || "");
    const basePoolMode = option.basePoolMode || ctx.basePoolMode || inferBasePoolMode(target, intent, ctx);
    const gate = option.gateType || ctx.gateType || inferGateFromOption(option, target, basePoolMode);
    const path = option.pathFamily || inferPathFamily(target, intent, basePoolMode);
    const dialect = option.dialectMode || inferDialectMode(target, intent, basePoolMode, ctx.illuminationMode);
    const expectation = option.contextExpectation || inferExpectation(gate);

    return {
      step: stepForGate(gate),
      priorStep: priorStepForGate(gate),
      gate,
      path,
      mode: basePoolMode,
      dialect,
      expectation,
      target,
      destination: "",
      next: nextForGate(gate, path),
      noRepeat: Boolean(option.noRepeat || isNoRepeatGate(gate))
    };
  }

  function inferGateFromContext(target, intent, context, entryStackMode, basePoolMode) {
    const ctx = normalizeContext(context);

    if (ctx.gateType) return ctx.gateType;
    if (ctx.conversationCoordinate && ctx.conversationCoordinate.gate) return ctx.conversationCoordinate.gate;

    if (entryStackMode === ENTRY_STACK_MODES.ENTRANCE) return GATES.ARRIVAL;
    if (entryStackMode === ENTRY_STACK_MODES.GUIDED_CHOOSER) return GATES.INTENTION;
    if (entryStackMode === ENTRY_STACK_MODES.DIG_DEEPER) return GATES.DIG_DEEPER;
    if (entryStackMode === ENTRY_STACK_MODES.PREPARED_DOOR) return GATES.PREPARED_DOOR;
    if (entryStackMode === ENTRY_STACK_MODES.RETURN) return GATES.RETURN_FORK;
    if (entryStackMode === ENTRY_STACK_MODES.PATH_SAMPLE) return GATES.INTRIGUE_BRIDGE;

    if (ctx.movementIntent === "continue_current_path" || ctx.optionKind === "forward") return GATES.DIG_DEEPER;
    if (ctx.movementIntent === "open_prepared_door" || ctx.optionKind === "route") return GATES.PREPARED_DOOR;
    if (ctx.movementIntent === "recenter" || ctx.optionKind === "control") return GATES.RETURN_FORK;
    if (ctx.movementIntent === "cross_to_related_room" || ctx.optionKind === "parallel") return GATES.CROSS_PATH_BRIDGE;

    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) return GATES.DIAGNOSTIC_BOUNDARY;
    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || intent === "diamondGate") return GATES.ARRIVAL;
    if (target === TARGETS.SPLIT_INTERFACE || intent === "splitInterface") return GATES.INTENTION;

    return GATES.BASE_POOL;
  }

  function inferGateFromOption(option, target, basePoolMode) {
    if (option.gateType) return option.gateType;
    if (option.optionKind === "forward" || option.movementIntent === "continue_current_path") return GATES.DIG_DEEPER;
    if (option.optionKind === "route" || option.movementIntent === "open_prepared_door") return GATES.PREPARED_DOOR;
    if (option.optionKind === "control" || option.movementIntent === "recenter") return GATES.RETURN_FORK;
    if (option.optionKind === "parallel" || option.movementIntent === "cross_to_related_room") return GATES.CROSS_PATH_BRIDGE;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) return GATES.DIAGNOSTIC_BOUNDARY;
    if (target === TARGETS.SPLIT_INTERFACE) return GATES.INTENTION;
    return GATES.BASE_POOL;
  }

  function inferPathFamily(target, intent, basePoolMode) {
    if (basePoolMode === BASE_POOL_MODES.RETURN) return "return";
    if (basePoolMode === BASE_POOL_MODES.PUBLIC_MAP) return "public";
    if (basePoolMode === BASE_POOL_MODES.NARRATIVE_PATH) return "narrative";
    if (basePoolMode === BASE_POOL_MODES.MISSION || basePoolMode === BASE_POOL_MODES.INNER_MISSION || basePoolMode === BASE_POOL_MODES.COMMUNITY_MISSION || basePoolMode === BASE_POOL_MODES.COLLABORATION_MISSION) return "mission";
    if (basePoolMode === BASE_POOL_MODES.PRACTICAL) return "practical";
    if (basePoolMode === BASE_POOL_MODES.PROOF) return "proof";
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) return "diagnostic";
    if (basePoolMode === BASE_POOL_MODES.CHARACTERS) return "character";
    if (basePoolMode === BASE_POOL_MODES.FRONTIER) return "frontier";
    if (basePoolMode === BASE_POOL_MODES.HEARTH) return "hearth";
    if (basePoolMode === BASE_POOL_MODES.MIRRORLAND) return "mirrorland";
    if (basePoolMode === BASE_POOL_MODES.CREATOR || basePoolMode === BASE_POOL_MODES.UNDERDOG) return "creator";

    const clean = normalizeTarget(target);
    const cleanIntent = normalizeIntent(intent);

    if (clean === TARGETS.TRADITIONAL_WEBSITE || clean === TARGETS.TRADITIONAL_COMPASS || clean === TARGETS.PRODUCTS || clean === TARGETS.LAWS || cleanIntent === "traditionalWebsite") return "public";
    if (clean === TARGETS.NARRATIVE_PATH || cleanIntent === "narrativePath") return "narrative";
    if (clean === TARGETS.MISSION_OVERVIEW || cleanIntent === "mission") return "mission";
    if (clean === TARGETS.PRACTICAL_RELEVANCE || cleanIntent === "practicalRelevance") return "practical";
    if (clean === TARGETS.SCIENTIFIC_LAW || cleanIntent === "scientificLaw" || cleanIntent === "proof") return "proof";
    if (clean === TARGETS.FRONTIER || cleanIntent === "frontier") return "frontier";
    if (clean === TARGETS.HEARTH || cleanIntent === "hearth") return "hearth";
    if (clean === TARGETS.MIRRORLAND || cleanIntent === "mirrorland") return "mirrorland";
    if (clean === TARGETS.CHARACTERS || cleanIntent === "characters") return "character";
    if (clean === TARGETS.SEAN || clean === TARGETS.UNDERDOG || cleanIntent === "sean" || cleanIntent === "underdog") return "creator";
    if (clean === TARGETS.RECENTER || cleanIntent === "recenter") return "return";

    return "center";
  }

  function inferDialectMode(target, intent, basePoolMode, illuminationMode) {
    const path = inferPathFamily(target, intent, basePoolMode);

    if (path === "return") return "return_guide";
    if (path === "diagnostic") return "diagnostic_boundary_guide";
    if (path === "public") return "public_guide";
    if (path === "narrative") return "narrative_guide";
    if (path === "mission") return "mission_guide";
    if (path === "practical") return "practical_guide";
    if (path === "proof") return "proof_guide";
    if (path === "character") return "character_guide";
    if (path === "creator") return "creator_guide";
    if (path === "frontier") return "frontier_guide";
    if (path === "hearth") return "hearth_guide";
    if (path === "mirrorland") return "mirrorland_guide";

    if (illuminationMode === ILLUMINATION_MODES.PROOF) return "proof_guide";
    if (illuminationMode === ILLUMINATION_MODES.PRACTICAL) return "practical_guide";
    if (illuminationMode === ILLUMINATION_MODES.NARRATIVE) return "narrative_guide";

    return "estate_host";
  }

  function inferExpectation(gate) {
    if (gate === GATES.ARRIVAL) return "universal_entry";
    if (gate === GATES.SPLIT) return "two_path_orientation";
    if (gate === GATES.INTENTION) return "choice_help";
    if (gate === GATES.BASE_POOL) return "orientation_before_entry";
    if (gate === GATES.INTRIGUE_BRIDGE) return "intrigue_before_entry";
    if (gate === GATES.DIG_DEEPER) return "deeper_context";
    if (gate === GATES.PREPARED_DOOR) return "page_visit";
    if (gate === GATES.RETURN_FORK) return "safe_recenter";
    if (gate === GATES.CROSS_PATH_BRIDGE) return "bridge_context";
    if (gate === GATES.DIAGNOSTIC_BOUNDARY) return "diagnostic_referral";
    return "orientation_before_entry";
  }

  function stepForGate(gate) {
    if (gate === GATES.ARRIVAL) return 1;
    if (gate === GATES.SPLIT) return 2;
    if (gate === GATES.INTENTION) return 3;
    if (gate === GATES.BASE_POOL) return 5;
    if (gate === GATES.INTRIGUE_BRIDGE) return 8;
    if (gate === GATES.DIAGNOSTIC_BOUNDARY) return 8;
    if (gate === GATES.DIG_DEEPER) return 13;
    if (gate === GATES.PREPARED_DOOR) return 21;
    if (gate === GATES.RETURN_FORK) return 34;
    if (gate === GATES.CROSS_PATH_BRIDGE) return 55;
    return 5;
  }

  function priorStepForGate(gate) {
    const step = stepForGate(gate);
    if (step >= 55) return 5;
    if (step >= 34) return 5;
    if (step >= 21) return 5;
    if (step >= 13) return 5;
    if (step >= 8) return 5;
    if (step >= 5) return 3;
    if (step >= 3) return 2;
    if (step >= 2) return 1;
    return 0;
  }

  function nextForGate(gate, path) {
    if (gate === GATES.ARRIVAL) return ["choose_start", "public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === GATES.INTENTION) return ["public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === GATES.PREPARED_DOOR) return ["return"];
    if (gate === GATES.RETURN_FORK) return ["guided_chooser", "public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === GATES.CROSS_PATH_BRIDGE) return ["base_pool", "dig_deeper", "open_page", "return"];
    if (gate === GATES.DIAGNOSTIC_BOUNDARY) return ["open_diagnostic", "character_mirror", "narrative_bridge", "return"];

    if (path === "public") return ["dig_deeper", "open_page", "cross_path_bridge", "return"];
    if (path === "narrative") return ["dig_deeper", "open_page", "mirrorland_bridge", "character_bridge", "return"];
    if (path === "mission") return ["inner_mission", "community_mission", "collaboration_mission", "practical_bridge", "return"];
    if (path === "practical") return ["dig_deeper", "open_page", "proof_bridge", "frontier_bridge", "return"];
    if (path === "proof") return ["dig_deeper", "evidence", "measure", "limits", "open_page", "return"];
    if (path === "frontier") return ["energy", "water", "waste", "closed_loop", "infrastructure", "proof_bridge", "return"];
    if (path === "hearth") return ["hearth_construct", "hearth_frontier", "hearth_law", "open_page", "return"];
    if (path === "mirrorland") return ["dig_deeper", "hearth", "characters", "audralia", "h_earth", "zionts", "return"];
    if (path === "character") return ["character_first", "relationships", "story_pressure", "character_mirror", "return"];
    if (path === "creator") return ["underdog", "nine_summits", "products", "public_map", "return"];

    return ["dig_deeper", "open_page", "return"];
  }

  function isNoRepeatGate(gate) {
    return gate === GATES.DIG_DEEPER ||
      gate === GATES.PREPARED_DOOR ||
      gate === GATES.RETURN_FORK ||
      gate === GATES.CROSS_PATH_BRIDGE ||
      gate === GATES.DIAGNOSTIC_BOUNDARY;
  }

  function normalizeBasePoolKey(mode) {
    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY) return "diagnosticBoundary";
    if (mode === BASE_POOL_MODES.CHARACTER_MIRROR) return "characterMirror";
    return mode;
  }

  function dedupeOptions(options) {
    const seen = new Set();
    const result = [];

    options.forEach((option) => {
      if (!option || !option.target) return;
      const key = option.target + "::" + option.label;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(option);
    });

    return result;
  }

  function safeNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    targets: TARGETS,
    routes: ROUTES,

    entryStackModes: ENTRY_STACK_MODES,
    basePoolModes: BASE_POOL_MODES,
    illuminationModes: ILLUMINATION_MODES,
    coordinateGates: GATES,

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
    isDiagnosticExplanationRequest
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
        version: VERSION,
        entryStackCompatible: true,
        basePoolCompatible: true,
        illuminationCompatible: true,
        choiceClosureCompatible: true,
        coordinateCarrierCompatible: true,
        gatewayAuthorityCompatible: true,
        noRepeatCompatible: true
      }
    }));
  }
})(typeof window !== "undefined" ? window : globalThis);
