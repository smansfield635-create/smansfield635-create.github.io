// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_GUIDED_ENTRANCE_TNT_v5_3
// Full-file replacement.
// Client-side expression authority only.
// Purpose:
// - Preserve v5.2 reading-rhythm compatibility.
// - Preserve protected house-state language.
// - Replace loose entrance with a guided five-option entrance.
// - Shape one guided chooser, two traditional/public paths, and two narrative/deeper paths.
// - Loop guided visitors back into the two-path structure.
// - Shape DiamondGateBridge split-interface language.
// - Shape mission language.
// - Shape Mirrorland / Hearth / Frontier / Character language.
// - Use bridgeContext when available.
// - Preserve diagnostic boundary: Jeeves explains and routes, but does not assess.
// - Separate diagnostic explanation from diagnostic referral.
// - Humanize API/North output without owning meaning, route authority, DOM, CSS, shell boot, timing, or state.
// Does not own:
// - API/North meaning authority
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
  const CONTRACT = "HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_GUIDED_ENTRANCE_TNT_v5_3";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_READING_RHYTHM_TNT_v5_2";

  const VERSION = "5.3.0";

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
    CLEAN_DOOR: "cleanDoor"
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
      "DiamondGateBridge.com has two ways in.",
      "One side is the traditional website: the public pages, Compass, Products, Laws, and the creator path.",
      "The other side is the narrative path: I can guide you through rooms, worlds, Characters, proof, and future-facing systems.",
      "You can choose either side, and I can bridge you from one into the other when the time is right."
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

  const MIRRORLAND_COPY = Object.freeze({
    overview:
      "Mirrorland is part of the narrative path. It is not there to label you; it is there to help you see the patterns, pressures, Characters, and choices moving through the story.",
    bridgeToWebsite:
      "Mirrorland can always return to the traditional website when you need the map, the public structure, or a practical doorway.",
    characters:
      "The Characters turn Mirrorland from explanation into encounter. They carry shelter, repair, warning, survival, signal, boundary, sequence, and help beyond the safe center."
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

  const DIRECTIONAL_CHOOSER_OPTIONS = Object.freeze([
    {
      label: "I want the clear public map.",
      target: TARGETS.TRADITIONAL_WEBSITE,
      type: "conversation",
      scopeLane: "objective",
      promptMode: "story_prompt",
      optionKind: "conversation_prompt",
      archetypeAlignment: "story_entry",
      bridgeMoment: "before_knowledge",
      movementIntent: "ask_jeeves"
    },
    {
      label: "I want something practical I can use.",
      target: TARGETS.PRACTICAL_RELEVANCE,
      type: "conversation",
      scopeLane: "objective",
      promptMode: "practical_prompt",
      optionKind: "conversation_prompt",
      archetypeAlignment: "practical_entry",
      bridgeMoment: "before_knowledge",
      movementIntent: "ask_jeeves"
    },
    {
      label: "I want the story world.",
      target: TARGETS.NARRATIVE_PATH,
      type: "conversation",
      scopeLane: "narrative",
      promptMode: "story_prompt",
      optionKind: "conversation_prompt",
      archetypeAlignment: "story_entry",
      bridgeMoment: "before_knowledge",
      movementIntent: "ask_jeeves"
    },
    {
      label: "I want the mission and meaning.",
      target: TARGETS.MISSION_OVERVIEW,
      type: "conversation",
      scopeLane: "narrative",
      promptMode: "personal_prompt",
      optionKind: "conversation_prompt",
      archetypeAlignment: "personal_entry",
      bridgeMoment: "before_knowledge",
      movementIntent: "ask_jeeves"
    },
    {
      label: "I want to know what makes this trustworthy.",
      target: TARGETS.SCIENTIFIC_LAW,
      type: "conversation",
      scopeLane: "objective",
      promptMode: "skeptic_prompt",
      optionKind: "conversation_prompt",
      archetypeAlignment: "proof_entry",
      bridgeMoment: "before_knowledge",
      movementIntent: "ask_jeeves"
    }
  ]);

  const PROMPT_REWRITES = [
    {
      pattern: /\bwhich character might i recognize in myself\??/gi,
      replacement: "What does the Character Mirror show?"
    },
    {
      pattern: /\bwhich character am i most like\??/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bwhat character am i\??/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bwhich archetype am i\??/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bwhat archetype am i\??/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bwhere do i fit into this\??/gi,
      replacement: "Can you help me choose where to start?"
    },
    {
      pattern: /\bwhat can i learn about myself here\??/gi,
      replacement: "How does the narrative path become personal?"
    },
    {
      pattern: /\bask me the first mirror question\.?/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bask me the second mirror question\.?/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bask me the third mirror question\.?/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\brun the mirror question\.?/gi,
      replacement: "Where can I take the alignment diagnostic?"
    },
    {
      pattern: /\bdiagnose me\b/gi,
      replacement: "Take me to the Coherence Diagnostic"
    },
    {
      pattern: /\bscore me\b/gi,
      replacement: "Take me to the Coherence Diagnostic"
    },
    {
      pattern: /\bassess me\b/gi,
      replacement: "Take me to the Coherence Diagnostic"
    },
    {
      pattern: /\bclassify me\b/gi,
      replacement: "Take me to the Coherence Diagnostic"
    },
    {
      pattern: /\btype me\b/gi,
      replacement: "Take me to the Coherence Diagnostic"
    }
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
    cleanDoor: "What is the cleanest next door?"
  });

  function shapeConversationFrame(frame, context) {
    const source = frame && typeof frame === "object" ? frame : {};
    const ctx = normalizeContext({
      ...(context && typeof context === "object" ? context : {}),
      bridgeContext: (context && context.bridgeContext) || source.bridgeContext || null
    });

    const target = normalizeTarget(source.selectedTarget || ctx.selectedTarget || "");
    const intent = normalizeIntent(source.intent || ctx.intent || "");
    const bubbles = normalizeBubbleList(source.bubbles || source.beats || []);

    const shaped = {
      ...source,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT
    };

    if (isGuidedChooserRequest(target, intent, ctx)) {
      shaped.bubbles = withBridgeLead(SPLIT_INTERFACE_COPY.guidedChooser.slice(), ctx);
      shaped.beats = shaped.bubbles;
      shaped.options = DIRECTIONAL_CHOOSER_OPTIONS.slice();
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || intent === "diamondGate") {
      shaped.bubbles = withBridgeLead(SPLIT_INTERFACE_COPY.overview.slice(), ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.TRADITIONAL_WEBSITE || intent === "traditionalWebsite") {
      shaped.bubbles = withBridgeLead([
        SPLIT_INTERFACE_COPY.traditionalWebsite,
        "It lets you understand the project without entering the story layer first.",
        "From there, I can keep you on the public map or show you the narrative version of the same idea."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.NARRATIVE_PATH || intent === "narrativePath") {
      shaped.bubbles = withBridgeLead([
        SPLIT_INTERFACE_COPY.narrativePath,
        "Instead of only reading pages, you move through rooms, worlds, Characters, mission, proof, and future-facing systems.",
        "I keep the map nearby, so the story can always return to the public website when you need structure."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.SPLIT_INTERFACE || intent === "splitInterface") {
      shaped.bubbles = withBridgeLead([
        SPLIT_INTERFACE_COPY.bridge,
        "The website gives the map. The narrative path gives the walk through the estate.",
        "The strongest version uses both."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_OVERVIEW || intent === "mission") {
      shaped.bubbles = withBridgeLead(MISSION_COPY.overview.slice(), ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_INNER) {
      shaped.bubbles = withBridgeLead(MISSION_COPY.inner.slice(), ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_COMMUNITY) {
      shaped.bubbles = withBridgeLead(MISSION_COPY.community.slice(), ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_COLLABORATION) {
      shaped.bubbles = withBridgeLead(MISSION_COPY.collaboration.slice(), ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.PRACTICAL_RELEVANCE || target === TARGETS.PRODUCTS || intent === "practicalRelevance") {
      shaped.bubbles = withBridgeLead([
        "This matters because clarity has to survive contact with the real world.",
        "DiamondGateBridge is not only a story or a website. It is a way to organize pressure, proof, systems, service, and direction.",
        "That is why the path eventually reaches the Frontier Playground, Scientific Law, Products, and community-facing work."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.SCIENTIFIC_LAW || intent === "scientificLaw") {
      shaped.bubbles = withBridgeLead([
        "This is the proof-facing path.",
        "It asks whether a claim can survive evidence, measurement, correction, and limits.",
        "That gives the public side a way to stay honest while the narrative side keeps the work alive."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.DIAGNOSTIC) {
      shaped.bubbles = withBridgeLead([
        DIAGNOSTIC_BOUNDARY_COPY.diagnostic,
        "If you want the actual alignment read, I can take you to the Coherence Diagnostic."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL || intent === "diagnosticReferral") {
      shaped.bubbles = withBridgeLead([
        DIAGNOSTIC_BOUNDARY_COPY.referral,
        "Jeeves can explain and guide, but the assessment belongs in the Diagnostic itself."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.CHARACTER_MIRROR || intent === "characterMirror") {
      shaped.bubbles = withBridgeLead([
        DIAGNOSTIC_BOUNDARY_COPY.characterMirror,
        "I can introduce the Characters and explain what they carry, or I can take you to the proper Diagnostic path."
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MIRRORLAND || intent === "mirrorland") {
      shaped.bubbles = withBridgeLead([
        MIRRORLAND_COPY.overview,
        "It gives the mission a world you can walk through instead of a paragraph you only read.",
        MIRRORLAND_COPY.bridgeToWebsite
      ], ctx);
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    shaped.bubbles = bubbles.length ? withBridgeLead(bubbles.map((item) => sanitizePublicText(item, ctx, "bubble")), ctx) : bubbles;
    shaped.beats = shaped.bubbles;

    return finalizeFrame(shaped, ctx);
  }

  function finalizeFrame(frame, context) {
    const shaped = frame && typeof frame === "object" ? frame : {};
    const ctx = normalizeContext(context);

    shaped.bubbles = normalizeBubbleList(shaped.bubbles || shaped.beats || []).map((bubble) => sanitizePublicText(bubble, ctx, "bubble"));
    shaped.beats = shaped.bubbles;
    shaped.options = shapeOptions(shaped.options || [], ctx);
    shaped.handoffLabels = shapeHandoffLabels(shaped.handoffLabels || {}, shaped.handoffs || []);
    shaped.expressionContract = CONTRACT;
    shaped.expressionVersion = VERSION;
    shaped.guidedEntranceCompatible = true;
    shaped.readingRhythmCompatible = true;
    shaped.bridgeContextCompatible = true;
    shaped.diagnosticBoundary = "jeeves_explains_and_routes_but_does_not_assess";

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
        movementIntent: "ask_jeeves"
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

    if (!shaped.optionKind) shaped.optionKind = "conversation_prompt";
    if (!shaped.bridgeMoment) shaped.bridgeMoment = inferBridgeMomentFromContext(ctx);
    if (!shaped.movementIntent) shaped.movementIntent = "ask_jeeves";
    if (!shaped.type) shaped.type = "conversation";

    return shaped;
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

    if (normalizedTarget === TARGETS.DIAGNOSTIC) {
      return TARGET_LABELS.diagnosticPath;
    }

    if (normalizedTarget === TARGETS.DIAGNOSTIC_REFERRAL) {
      return TARGET_LABELS.diagnosticReferralPath;
    }

    if (TARGET_LABELS[normalizedTarget]) {
      const rough = /^(visit|open|launch|go to|enter)\b/i.test(clean);
      if (rough) return TARGET_LABELS[normalizedTarget];
    }

    if (ctx.intent === "mission" && /community/i.test(clean)) {
      return "What is the community mission?";
    }

    if (ctx.intent === "mission" && /practical|collaboration|teamwork/i.test(clean)) {
      return "How does the mission become practical?";
    }

    return clean;
  }

  function shapeForkBridge(input, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (bridgeLine) return bridgeLine;

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || ctx.intent === "diamondGate") {
      return SPLIT_INTERFACE_COPY.bridge;
    }

    if (target === TARGETS.MISSION_OVERVIEW || ctx.intent === "mission") {
      return "The mission can move inward, outward, or into practical construction.";
    }

    if (target === TARGETS.NARRATIVE_PATH || ctx.currentEntryLane === "narrative") {
      return "You can stay inside the narrative path, or I can show you the public website version of this same idea.";
    }

    if (target === TARGETS.TRADITIONAL_WEBSITE || ctx.currentEntryLane === "traditional") {
      return "You can stay on the public map, or I can show you the narrative version of this same idea.";
    }

    return sanitizePublicText(input || "I can keep you on this path or bridge you to the next clean door.", ctx, "bubble");
  }

  function shapeTransitionBridge(fromTarget, toTarget, context) {
    const ctx = normalizeContext(context);
    const bridgeLine = shapeBridgeContextLine(ctx);

    if (bridgeLine) return bridgeLine;

    const from = normalizeTarget(fromTarget || "");
    const to = normalizeTarget(toTarget || "");

    if ((from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.NARRATIVE_PATH) ||
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE)) {
      return SPLIT_INTERFACE_COPY.bridge;
    }

    if ((from === TARGETS.TRADITIONAL_COMPASS && to === TARGETS.HEARTH) ||
        (from === TARGETS.HEARTH && to === TARGETS.TRADITIONAL_COMPASS)) {
      return BRIDGE_COPY.compassHearth;
    }

    if ((from === TARGETS.PRODUCTS && to === TARGETS.FRONTIER) ||
        (from === TARGETS.FRONTIER && to === TARGETS.PRODUCTS)) {
      return BRIDGE_COPY.productsFrontier;
    }

    if ((from === TARGETS.LAWS && to === TARGETS.SCIENTIFIC_LAW) ||
        (from === TARGETS.SCIENTIFIC_LAW && to === TARGETS.LAWS)) {
      return BRIDGE_COPY.lawsScientificLaw;
    }

    if ((from === TARGETS.SEAN && to === TARGETS.UNDERDOG) ||
        (from === TARGETS.UNDERDOG && to === TARGETS.SEAN)) {
      return BRIDGE_COPY.seanUnderdog;
    }

    if ((from === TARGETS.MISSION_OVERVIEW && to === TARGETS.NARRATIVE_PATH) ||
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.MISSION_OVERVIEW)) {
      return BRIDGE_COPY.missionNarrative;
    }

    if ((from === TARGETS.MIRRORLAND && to === TARGETS.TRADITIONAL_WEBSITE) ||
        (from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.MIRRORLAND)) {
      return BRIDGE_COPY.mirrorlandWebsite;
    }

    if ((from === TARGETS.CHARACTER_MIRROR && to === TARGETS.DIAGNOSTIC_REFERRAL) ||
        (from === TARGETS.DIAGNOSTIC_REFERRAL && to === TARGETS.CHARACTER_MIRROR)) {
      return BRIDGE_COPY.diagnosticCharacterMirror;
    }

    return sanitizePublicText("This is a bridge path. I can show how one side connects to the other before we move.", ctx, "bubble");
  }

  function shapePreKnowledgeBridge(input, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(ctx.selectedTarget || "");

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW) {
      return "Start with the whole estate before choosing a room.";
    }

    if (target === TARGETS.SPLIT_INTERFACE) {
      return "Start by choosing what you are looking for. I will turn that into the right doorway.";
    }

    if (target === TARGETS.MISSION_OVERVIEW) {
      return "Start with the larger mission, then choose the inner, community, or practical expression.";
    }

    if (target === TARGETS.DIAGNOSTIC) {
      return DIAGNOSTIC_BOUNDARY_COPY.diagnostic;
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL || target === TARGETS.CHARACTER_MIRROR) {
      return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    }

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
        (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE)) {
      return SPLIT_INTERFACE_COPY.bridge;
    }

    if ((from === TARGETS.CHARACTER_MIRROR && to === TARGETS.DIAGNOSTIC_REFERRAL) ||
        (from === TARGETS.DIAGNOSTIC_REFERRAL && to === TARGETS.CHARACTER_MIRROR)) {
      return BRIDGE_COPY.diagnosticCharacterMirror;
    }

    if (to === TARGETS.DIAGNOSTIC || to === TARGETS.DIAGNOSTIC_REFERRAL) {
      return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    }

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

    if (/diagnostic boundary/.test(clean)) {
      return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    }

    if (from === TARGETS.PRODUCTS && to === TARGETS.FRONTIER) {
      return BRIDGE_COPY.productsFrontier;
    }

    if (from === TARGETS.LAWS && to === TARGETS.SCIENTIFIC_LAW) {
      return BRIDGE_COPY.lawsScientificLaw;
    }

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

    if (isProtectedInterfacePhrase(clean)) {
      return clean;
    }

    PUBLIC_LANGUAGE_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (mode === "option") {
      PROMPT_REWRITES.forEach((rule) => {
        clean = clean.replace(rule.pattern, rule.replacement);
      });

      if (isDiagnosticAssessmentRequest(clean)) {
        clean = TARGET_LABELS.diagnosticReferralPath;
      }
    } else if (mode === "bubble") {
      clean = softenDiagnosticAssessmentLanguage(clean);
    } else {
      PROMPT_REWRITES.forEach((rule) => {
        clean = clean.replace(rule.pattern, rule.replacement);
      });
    }

    if (ctx && ctx.intent === "diagnosticReferral" && /\bI can assess\b/i.test(clean)) {
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

    if (isDiagnosticAssessmentRequest(clean)) {
      return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    }

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

    if (ctx.intent === "diamondGate") return true;
    if (ctx.intent === "splitInterface") return true;
    if (ctx.intent === "traditionalWebsite") return true;
    if (ctx.intent === "narrativePath") return true;
    if (ctx.intent === "mission") return true;
    if (ctx.intent === "diagnosticReferral") return true;
    if (ctx.currentConversationStage === "entrance_overview") return true;
    if (ctx.currentConversationStage === "split_interface_gate") return true;

    return false;
  }

  function shapeEntranceOptions() {
    return [
      {
        label: "Can you help me choose where to start?",
        target: TARGETS.SPLIT_INTERFACE,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What is the traditional website for?",
        target: TARGETS.TRADITIONAL_WEBSITE,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What can I actually do here?",
        target: TARGETS.PRACTICAL_RELEVANCE,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "practical_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "practical_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What is the narrative path?",
        target: TARGETS.NARRATIVE_PATH,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What is the mission behind this?",
        target: TARGETS.MISSION_OVERVIEW,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      }
    ];
  }

  function shapeGuidedChooserOptions() {
    return DIRECTIONAL_CHOOSER_OPTIONS.slice();
  }

  function shapeMissionOptions() {
    return [
      {
        label: "What is the inner mission?",
        target: TARGETS.MISSION_INNER,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What is the community mission?",
        target: TARGETS.MISSION_COMMUNITY,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "How does the mission become practical?",
        target: TARGETS.MISSION_COLLABORATION,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "practical_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "practical_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "How does this connect to Mirrorland?",
        target: TARGETS.NARRATIVE_PATH,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "parallel_crossing",
        movementIntent: "cross_to_related_room"
      }
    ];
  }

  function shapeDiagnosticBoundaryOptions() {
    return [
      {
        label: "What is the Coherence Diagnostic?",
        target: TARGETS.DIAGNOSTIC,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "Where can I take the alignment diagnostic?",
        target: TARGETS.DIAGNOSTIC_REFERRAL,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "What does the Character Mirror show?",
        target: TARGETS.CHARACTER_MIRROR,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "before_knowledge",
        movementIntent: "ask_jeeves"
      },
      {
        label: "How does this connect to the narrative path?",
        target: TARGETS.NARRATIVE_PATH,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
        bridgeMoment: "parallel_crossing",
        movementIntent: "cross_to_related_room"
      }
    ];
  }

  function inferBridgeMomentFromContext(context) {
    const ctx = normalizeContext(context);
    if (ctx.bridgeContext && ctx.bridgeContext.bridgeMoment) return ctx.bridgeContext.bridgeMoment;
    if (ctx.bridgeMoment) return ctx.bridgeMoment;
    return "before_knowledge";
  }

  function isGuidedChooserRequest(target, intent, context) {
    const ctx = normalizeContext(context);
    const selectedLabel = safeText(ctx.selectedLabel).toLowerCase();
    const cleanTarget = normalizeTarget(target);
    const cleanIntent = normalizeIntent(intent);

    return cleanTarget === TARGETS.SPLIT_INTERFACE &&
      (
        cleanIntent === "splitInterface" ||
        isGuidedLabel(selectedLabel) ||
        ctx.currentConversationStage === "split_interface_gate"
      );
  }

  function isGuidedLabel(label) {
    const value = safeText(label).toLowerCase();

    return /\b(help me choose|choose where to start|where should i start|need guidance|guide me|not sure where to start)\b/.test(value);
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
      startGuidePath: TARGETS.SPLIT_INTERFACE
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
      bridgeContext: normalizeBridgeContext(source.bridgeContext || null)
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

    splitInterfaceCopy: SPLIT_INTERFACE_COPY,
    missionCopy: MISSION_COPY,
    diagnosticBoundaryCopy: DIAGNOSTIC_BOUNDARY_COPY,
    mirrorlandCopy: MIRRORLAND_COPY,
    bridgeCopy: BRIDGE_COPY,
    interfaceStateCopy: INTERFACE_STATE_COPY,

    shapeConversationFrame,
    shapeOptions,
    shapeOption,
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
        version: VERSION
      }
    }));
  }
})(typeof window !== "undefined" ? window : globalThis);
