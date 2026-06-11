// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_TNT_v5_1
// Full-file replacement.
// Client-side expression authority only.
// Purpose:
// - Public language governor for Jeeves.
// - Shape DiamondGateBridge split-interface language.
// - Shape mission language.
// - Shape Mirrorland / Hearth / Frontier / Character language.
// - Preserve diagnostic boundary: Jeeves explains and routes, but does not assess.
// - Convert diagnostic-style prompts into referral / explanation language.
// - Humanize API/North output without owning meaning, route authority, DOM, CSS, shell boot, or state.
// Does not own:
// - API/North meaning authority
// - route execution
// - DOM mount lifecycle
// - transcript storage
// - prepared-door routing
// - visible shell layout
// - CSS
//

"use strict";

(function attachHearthJeevesExpression(global) {
  const CONTRACT = "HEARTH_JEEVES_EXPRESSION_SPLIT_INTERFACE_PUBLIC_LANGUAGE_TNT_v5_1";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_CONVERSATIONAL_CINEMATIC_FORK_BRIDGE_TNT_v5";

  const VERSION = "5.1.0";

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
    CHARACTERS: "charactersPath"
  });

  const ROUTES = Object.freeze({
    COMPASS: "compass",
    SITE_GUIDE: "siteGuide",
    MIRRORLAND: "mirrorland",
    HEARTH: "hearth",
    FRONTIER: "frontier",
    PRODUCTS: "products",
    LAWS: "laws",
    SCIENTIFIC_LAW: "scientificLaw",
    COHERENCE_DIAGNOSTIC: "coherenceDiagnostic",
    MEET_SEAN: "meetSean",
    CHARACTERS: "characters",
    UNDERDOG: "aboutUnderdog"
  });

  const SPLIT_INTERFACE_COPY = Object.freeze({
    entrance: [
      "DiamondGateBridge.com has two ways in.",
      "One side is the traditional website: the public pages, Compass, Products, Laws, and the creator path.",
      "The other side is the narrative path: I can guide you through rooms, worlds, Characters, proof, and future-facing systems.",
      "You can choose either side, and I can bridge you from one into the other when the time is right."
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
      "The Coherence Diagnostic is the proper place for an alignment read. I can explain it, route you there, or show how it connects to the Characters."
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
      "Mirrorland is the story-facing side. The traditional website is the public map back out."
  });

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
      replacement: "How does the narrative path become personal?"
    },
    {
      pattern: /\bwhat can i learn about myself here\??/gi,
      replacement: "How does this connect to the visitor?"
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
    characters: "Open the Characters Hall",
    controlRoom: "Open the Control Room",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "Open This Underdog"
  });

  const TARGET_LABELS = Object.freeze({
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
    diagnosticPath: "What is the Coherence Diagnostic?",
    characterMirrorPath: "What does the Character Mirror show?",
    mirrorlandPath: "What is Mirrorland?",
    hearthPath: "What is Hearth?",
    frontierPath: "What is the Frontier Playground?",
    scientificLawPath: "What needs to be tested?",
    compassPath: "How does the Compass help me start?",
    productsPath: "What can I actually do here?",
    lawsPath: "What keeps this honest?",
    seanPath: "Who is Sean Mansfield?",
    underdogPath: "What is This Underdog?",
    charactersPath: "Who are the Characters?"
  });

  function shapeConversationFrame(frame, context) {
    const ctx = normalizeContext(context);
    const source = frame && typeof frame === "object" ? frame : {};
    const target = normalizeTarget(source.selectedTarget || ctx.selectedTarget || "");
    const intent = normalizeIntent(source.intent || ctx.intent || "");
    const bubbles = normalizeBubbleList(source.bubbles || source.beats || []);
    const shaped = {
      ...source,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT
    };

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || intent === "diamondGate") {
      shaped.bubbles = SPLIT_INTERFACE_COPY.entrance.slice();
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.TRADITIONAL_WEBSITE || intent === "traditionalWebsite") {
      shaped.bubbles = [
        SPLIT_INTERFACE_COPY.traditionalWebsite,
        "It lets you understand the project without entering the story layer first.",
        "From there, I can keep you on the public map or show you the narrative version of the same idea."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.NARRATIVE_PATH || intent === "narrativePath") {
      shaped.bubbles = [
        SPLIT_INTERFACE_COPY.narrativePath,
        "Instead of only reading pages, you move through rooms, worlds, Characters, mission, proof, and future-facing systems.",
        "I keep the map nearby, so the story can always return to the public website when you need structure."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.SPLIT_INTERFACE || intent === "splitInterface") {
      shaped.bubbles = [
        SPLIT_INTERFACE_COPY.bridge,
        "The website gives the map. The narrative path gives the walk through the estate.",
        "The strongest version uses both."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_OVERVIEW || intent === "mission") {
      shaped.bubbles = MISSION_COPY.overview.slice();
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_INNER) {
      shaped.bubbles = MISSION_COPY.inner.slice();
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_COMMUNITY) {
      shaped.bubbles = MISSION_COPY.community.slice();
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MISSION_COLLABORATION) {
      shaped.bubbles = MISSION_COPY.collaboration.slice();
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.PRACTICAL_RELEVANCE || intent === "practicalRelevance") {
      shaped.bubbles = [
        "This matters because clarity has to survive contact with the real world.",
        "DiamondGateBridge is not only a story or a website. It is a way to organize pressure, proof, systems, service, and direction.",
        "That is why the path eventually reaches the Frontier Playground, Scientific Law, Products, and community-facing work."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL || intent === "diagnosticReferral") {
      shaped.bubbles = [
        DIAGNOSTIC_BOUNDARY_COPY.boundary,
        "I can also explain how the Diagnostic connects to the Character Mirror and the narrative path."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.CHARACTER_MIRROR || intent === "characterMirror") {
      shaped.bubbles = [
        DIAGNOSTIC_BOUNDARY_COPY.characterMirror,
        "I can introduce the Characters and explain what they carry, or I can take you to the proper Diagnostic path."
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    if (target === TARGETS.MIRRORLAND || intent === "mirrorland") {
      shaped.bubbles = [
        MIRRORLAND_COPY.overview,
        "It gives the mission a world you can walk through instead of a paragraph you only read.",
        MIRRORLAND_COPY.bridgeToWebsite
      ];
      shaped.beats = shaped.bubbles;
      return finalizeFrame(shaped, ctx);
    }

    shaped.bubbles = bubbles.length ? bubbles.map((item) => sanitizePublicText(item, ctx)) : bubbles;
    shaped.beats = shaped.bubbles;

    return finalizeFrame(shaped, ctx);
  }

  function finalizeFrame(frame, ctx) {
    const shaped = frame && typeof frame === "object" ? frame : {};
    const safeCtx = normalizeContext(ctx);

    shaped.bubbles = normalizeBubbleList(shaped.bubbles || shaped.beats || []).map((bubble) => sanitizePublicText(bubble, safeCtx));
    shaped.beats = shaped.bubbles;
    shaped.options = shapeOptions(shaped.options || [], safeCtx);
    shaped.handoffLabels = shapeHandoffLabels(shaped.handoffLabels || {}, shaped.handoffs || []);
    shaped.expressionContract = CONTRACT;
    shaped.expressionVersion = VERSION;
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
    const target = normalizeTarget(option.target || "");
    const originalLabel = safeText(option.label || "");
    let label = originalLabel || TARGET_LABELS[target] || "Can you tell me more?";

    label = rewritePromptLabel(label, target, ctx);
    label = sanitizePublicText(label, ctx);

    const shaped = {
      ...option,
      label,
      target
    };

    if (isDiagnosticAssessmentRequest(originalLabel) || isDiagnosticAssessmentTarget(target)) {
      shaped.label = TARGET_LABELS.diagnosticReferralPath;
      shaped.target = TARGETS.DIAGNOSTIC_REFERRAL;
      shaped.promptMode = "personal_prompt";
      shaped.optionKind = "conversation_prompt";
      shaped.archetypeAlignment = "personal_entry";
      shaped.bridgeMoment = "before_knowledge";
      shaped.movementIntent = "ask_jeeves";
      shaped.scopeLane = "objective";
      shaped.type = "conversation";
      return shaped;
    }

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW) {
      shaped.label = TARGET_LABELS.diamondGateOverviewPath;
    }

    if (target === TARGETS.NARRATIVE_PATH) {
      shaped.label = TARGET_LABELS.narrativePathOverview;
      shaped.scopeLane = "narrative";
    }

    if (target === TARGETS.TRADITIONAL_WEBSITE) {
      shaped.label = TARGET_LABELS.traditionalWebsiteOverviewPath;
      shaped.scopeLane = "objective";
    }

    if (target === TARGETS.MISSION_OVERVIEW) {
      shaped.label = TARGET_LABELS.missionOverviewPath;
      shaped.scopeLane = "narrative";
      shaped.promptMode = "personal_prompt";
    }

    if (target === TARGETS.PRACTICAL_RELEVANCE) {
      shaped.label = TARGET_LABELS.practicalRelevancePath;
      shaped.promptMode = "practical_prompt";
    }

    if (target === TARGETS.CHARACTER_MIRROR) {
      shaped.label = TARGET_LABELS.characterMirrorPath;
      shaped.promptMode = "story_prompt";
      shaped.archetypeAlignment = "story_entry";
    }

    return shaped;
  }

  function rewritePromptLabel(label, target, context) {
    let clean = safeText(label);
    const ctx = normalizeContext(context);

    PROMPT_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    const normalizedTarget = normalizeTarget(target);

    if (TARGET_LABELS[normalizedTarget]) {
      const isUnsafePersonalAsk = isDiagnosticAssessmentRequest(label);
      if (isUnsafePersonalAsk) return TARGET_LABELS.diagnosticReferralPath;

      const rough = /^(visit|open|launch|go to|enter)\b/i.test(clean);
      if (rough && normalizedTarget !== TARGETS.DIAGNOSTIC_REFERRAL) {
        return TARGET_LABELS[normalizedTarget];
      }
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

    return sanitizePublicText(input || "I can keep you on this path or bridge you to the next clean door.", ctx);
  }

  function shapeTransitionBridge(fromTarget, toTarget, context) {
    const from = normalizeTarget(fromTarget || "");
    const to = normalizeTarget(toTarget || "");
    const ctx = normalizeContext(context);

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
      return DIAGNOSTIC_BOUNDARY_COPY.characterMirror;
    }

    return sanitizePublicText("This is a bridge path. I can show how one side connects to the other before we move.", ctx);
  }

  function shapePreKnowledgeBridge(input, context) {
    const ctx = normalizeContext(context);
    const target = normalizeTarget(ctx.selectedTarget || "");

    if (target === TARGETS.DIAMOND_GATE_OVERVIEW) {
      return "Start with the whole estate before choosing a room.";
    }

    if (target === TARGETS.MISSION_OVERVIEW) {
      return "Start with the larger mission, then choose the inner, community, or practical expression.";
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL || target === TARGETS.CHARACTER_MIRROR) {
      return DIAGNOSTIC_BOUNDARY_COPY.boundary;
    }

    return sanitizePublicText(input || "I’ll give the clean overview first, then the next door.", ctx);
  }

  function shapeRouteLabel(routeId, fallbackLabel) {
    const route = safeText(routeId);
    return ROUTE_LABELS[route] || sanitizePublicText(fallbackLabel || route || "Open Door");
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

  function sanitizePublicText(text, context) {
    let clean = safeText(text);
    const ctx = normalizeContext(context);

    PUBLIC_LANGUAGE_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    PROMPT_REWRITES.forEach((rule) => {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (isDiagnosticAssessmentRequest(clean)) {
      clean = DIAGNOSTIC_BOUNDARY_COPY.boundary;
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
        label: "What is DiamondGateBridge.com?",
        target: TARGETS.DIAMOND_GATE_OVERVIEW,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "story_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "story_entry",
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
        label: "What is the mission behind this?",
        target: TARGETS.MISSION_OVERVIEW,
        type: "conversation",
        scopeLane: "narrative",
        promptMode: "personal_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "personal_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      },
      {
        label: "Why does this matter in the real world?",
        target: TARGETS.PRACTICAL_RELEVANCE,
        type: "conversation",
        scopeLane: "objective",
        promptMode: "practical_prompt",
        optionKind: "conversation_prompt",
        archetypeAlignment: "practical_entry",
        bridgeMoment: "entrance_fork",
        movementIntent: "ask_jeeves"
      }
    ];
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

  function isDiagnosticAssessmentRequest(text) {
    const value = safeText(text).toLowerCase();

    return /\b(which archetype am i|what archetype am i|which character am i|what character am i|which character am i most like|what character am i most like|assess me|score me|diagnose me|classify me|type me|run the mirror question|ask me the first mirror question|ask me the second mirror question|ask me the third mirror question|first mirror question|second mirror question|third mirror question)\b/.test(value);
  }

  function isDiagnosticAssessmentTarget(target) {
    const clean = normalizeTarget(target);

    return [
      "characterArchetypeQuestionOne",
      "characterArchetypeQuestionTwo",
      "characterArchetypeQuestionThree",
      "characterArchetypeResult"
    ].includes(clean);
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
      missionPath: TARGETS.MISSION_OVERVIEW,
      websitePath: TARGETS.DIAMOND_GATE_OVERVIEW,
      traditionalPath: TARGETS.TRADITIONAL_WEBSITE,
      narrativeOverviewPath: TARGETS.NARRATIVE_PATH
    };

    return aliases[clean] || clean;
  }

  function normalizeIntent(intent) {
    const clean = safeText(intent);

    const aliases = {
      characterArchetypeMirror: "diagnosticReferral",
      diagnostic: "diagnostic",
      diamondGateBridge: "diamondGate",
      traditional: "traditionalWebsite",
      narrative: "narrativePath"
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
      movementIntent: safeText(source.movementIntent || "")
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

    shapeConversationFrame,
    shapeOptions,
    shapeOption,
    shapeForkBridge,
    shapeTransitionBridge,
    shapePreKnowledgeBridge,
    shapeRouteLabel,
    shapeHandoffLabels,
    shapeEntranceOptions,
    shapeMissionOptions,
    shapeDiagnosticBoundaryOptions,
    sanitizePublicText,
    rewritePromptLabel,
    shouldUseTrainingWheels,
    isDiagnosticAssessmentRequest
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
