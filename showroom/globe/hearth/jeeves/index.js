// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_SOURCE_IDENTITY_MOTOR_CARRIER_TNT_v25_6_1
// Full-file replacement.
// Client-side frontbrain / visible conversation carrier only.
// Distributed brain pair member:
// - Frontbrain lobe 1: sensory / source identity.
// - Frontbrain lobe 2: motor / carrier.
// Pair target:
// - /api/jeeves.js
// - HEARTH_JEEVES_BACKBRAIN_SOURCE_STABILITY_EXECUTIVE_COORDINATE_TNT_v5_4_1
// Purpose:
// - Preserve v25.6 guided entrance, reading rhythm, tap-to-speed,
//   endpoint fallback, bridgeContext, clicked-label priority,
//   Expression shaping, option rendering, route handoff rendering,
//   and route execution.
// - Add first-class sourceTarget and activeTarget carriage.
// - Treat clicked option identity as the strongest outbound source signal.
// - Prevent stale guidedChooser frame state from overpowering a non-split clicked source.
// - Align with the API/North source-stability coordinate authority.
// - Carry selectedTarget, sourceTarget, activeTarget, conversationCoordinate,
//   gateType, pathFamily, dialectMode, contextExpectation, noRepeat,
//   entryStackMode, basePoolMode, illuminationMode, and choiceClosure
//   into API/North and Expression.
// - Render visible user turns for clicked options and freeform input.
// - Keep frontbrain as carrier only: it captures identity and carries packets;
//   post-response meaning belongs to API/North and Expression.
// Does not own:
// - API/North canon
// - deep meaning
// - deep route expansion
// - Expression public wording authority
// - CSS layout
// - HTML shell authority
// - final server meaning
//

"use strict";

(function attachHearthJeevesFrontbrain(global) {
  const CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_SOURCE_IDENTITY_MOTOR_CARRIER_TNT_v25_6_1";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_COORDINATE_CARRIER_TURN_RHYTHM_TNT_v25_6";
  const ROOT_FRONTBRAIN_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_ENTRY_STACK_CONNECTOR_READING_RHYTHM_TNT_v25_5";
  const EXPRESSION_CONTRACT_TARGET = "HEARTH_JEEVES_EXPRESSION_GATEWAY_AUTHORITY_ENTRY_STACK_TNT_v5_4_1";
  const EXPRESSION_CONTRACT_NEXT = "HEARTH_JEEVES_EXPRESSION_SOURCE_STABILITY_GATEWAY_AUTHORITY_TNT_v5_4_2";
  const API_CONTRACT_TARGET = "HEARTH_JEEVES_BACKBRAIN_SOURCE_STABILITY_EXECUTIVE_COORDINATE_TNT_v5_4_1";
  const API_CONTRACT_PREVIOUS = "HEARTH_JEEVES_BACKBRAIN_FIBONACCI_COORDINATE_DIALOGUE_SYNCHRONIZATION_TNT_v5_4";

  const VERSION = "25.6.1";
  const ROOT_ID = "hearthJeevesMount";

  const API_ENDPOINTS = Object.freeze([
    "/api/jeeves",
    "/api/jeeves.js"
  ]);

  const READ_BASE_MS = 650;
  const READ_PER_CHAR_MS = 20;
  const READ_MAX_MS = 3600;

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
    MEET_SEAN: "meetSean",
    PRODUCTS: "products",
    LAWS: "laws",
    SCIENTIFIC_LAW: "scientificLaw",
    GAUGES: "gauges",
    SHOWROOM: "showroom",

    HEARTH: "hearth",
    MIRRORLAND: "mirrorland",
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
    UNDERDOG: "aboutUnderdog",

    AUDRALIA: "audralia",
    H_EARTH: "hEarth",
    ZIONTS: "zionts"
  });

  const ROUTE_HREFS = Object.freeze({
    home: "/",
    compass: "/",
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
  });

  const ROUTE_LABELS = Object.freeze({
    home: "Open the Public Entry",
    compass: "Open the Compass",
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

  const REQUEST_MODES = Object.freeze({
    FREEFORM: "freeform",
    NODE_ENRICHMENT: "node_enrichment",
    ROUTE_EXPLANATION: "route_explanation",
    CHARACTER_ARCHETYPE: "character_archetype",
    RECENTER: "recenter"
  });

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
    CONVERSATION_PROMPT: "conversation_prompt",
    FORWARD: "forward",
    RETURN: "return",
    PARALLEL: "parallel",
    ROUTE: "route",
    CONTROL: "control"
  });

  const MOVEMENT_INTENTS = Object.freeze({
    ASK_JEEVES: "ask_jeeves",
    CONTINUE_CURRENT_PATH: "continue_current_path",
    RETURN_ONE_THRESHOLD: "return_one_threshold",
    CROSS_TO_RELATED_ROOM: "cross_to_related_room",
    OPEN_PREPARED_DOOR: "open_prepared_door",
    RECENTER: "recenter",
    UNKNOWN: "unknown"
  });

  const SOURCE_STABILITY_LAW = Object.freeze({
    active: true,
    sourceTargetRequired: true,
    activeTargetRequired: true,
    depthDoesNotChangeSource: true,
    gateDoesNotReplaceSource: true,
    modeDoesNotReplaceSource: true,
    guidedChooserRequiresSplitInterfaceSource: true,
    clickedOptionIdentityOverridesPriorFrame: true,
    expressionReceivesSourceButDoesNotCreateIt: true
  });

  const ROUTE_FAMILIES = Object.freeze({
    traditionalWebsiteOverviewPath: Object.freeze([
      "siteGuide",
      "compass",
      "products",
      "laws",
      "meetSean"
    ]),
    narrativePathOverview: Object.freeze([
      "mirrorland",
      "hearth",
      "characters",
      "frontier",
      "audralia",
      "hEarth",
      "zionts"
    ]),
    missionOverviewPath: Object.freeze([
      "mirrorland",
      "frontier",
      "coherenceDiagnostic",
      "nineSummits",
      "aboutUnderdog"
    ]),
    practicalRelevancePath: Object.freeze([
      "products",
      "frontier",
      "frontierEnergy",
      "frontierWater",
      "frontierWaste",
      "frontierClosedLoop",
      "frontierInfrastructure",
      "scientificLaw",
      "gauges"
    ]),
    scientificLawPath: Object.freeze([
      "scientificLaw",
      "laws",
      "gauges"
    ]),
    frontierPath: Object.freeze([
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
      "frontierVision"
    ]),
    charactersPath: Object.freeze([
      "characters",
      "coherenceDiagnostic",
      "mirrorland"
    ]),
    diagnosticReferralPath: Object.freeze([
      "coherenceDiagnostic",
      "characters",
      "scientificLaw"
    ]),
    mirrorlandPath: Object.freeze([
      "mirrorland",
      "characters",
      "hearth",
      "siteGuide"
    ]),
    hearthPath: Object.freeze([
      "hearth",
      "mirrorland",
      "frontier",
      "scientificLaw",
      "showroom"
    ]),
    seanPath: Object.freeze([
      "meetSean",
      "aboutUnderdog",
      "nineSummits",
      "siteGuide"
    ]),
    underdogPath: Object.freeze([
      "aboutUnderdog",
      "meetSean",
      "nineSummits",
      "mirrorland"
    ])
  });

  const TARGET_ROUTE_HINTS = Object.freeze({
    diamondGateOverviewPath: ["siteGuide", "compass", "mirrorland"],
    splitInterfaceBridgePath: ["siteGuide", "mirrorland", "compass"],
    traditionalWebsiteOverviewPath: ["siteGuide", "compass", "products", "laws", "meetSean"],
    narrativePathOverview: ["mirrorland", "hearth", "characters", "frontier"],
    missionOverviewPath: ["mirrorland", "frontier", "nineSummits"],
    missionInnerPath: ["nineSummits", "mirrorland"],
    missionCommunityPath: ["nineSummits", "aboutUnderdog"],
    missionCollaborationPath: ["frontier", "products", "scientificLaw"],
    practicalRelevancePath: ["products", "frontier", "scientificLaw"],
    diagnosticReferralPath: ["coherenceDiagnostic", "characters"],
    diagnosticPath: ["coherenceDiagnostic"],
    characterMirrorPath: ["characters", "coherenceDiagnostic", "mirrorland"],
    mirrorlandPath: ["mirrorland", "characters"],
    hearthPath: ["hearth", "mirrorland", "frontier"],
    frontierPath: ["frontier", "frontierEnergy", "frontierWater", "frontierWaste"],
    scientificLawPath: ["scientificLaw", "laws", "gauges"],
    compassPath: ["compass", "siteGuide"],
    productsPath: ["products", "frontier"],
    lawsPath: ["laws", "scientificLaw"],
    seanPath: ["meetSean", "aboutUnderdog"],
    underdogPath: ["aboutUnderdog", "meetSean"],
    charactersPath: ["characters", "mirrorland", "coherenceDiagnostic"]
  });

  const START_COORDINATE = Object.freeze({
    step: 1,
    priorStep: 0,
    gate: "arrival",
    path: "center",
    mode: "estateOverview",
    dialect: "estate_host",
    expectation: "universal_entry",
    sourceTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
    activeTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
    target: TARGETS.DIAMOND_GATE_OVERVIEW,
    destination: "",
    next: Object.freeze(["choose_start", "public_map", "practical", "narrative_path", "mission", "proof"]),
    noRepeat: false
  });

  const START_BUBBLES = Object.freeze([
    "Welcome. I’m Jeeves.",
    "I’m here to guide the house and open the right doors.",
    "DiamondGateBridge has a public side and a narrative side. You do not need to understand the whole estate before choosing a path.",
    "Tell me what you are looking for, and I’ll place you at the cleanest doorway."
  ]);

  const START_OPTIONS = Object.freeze([
    makeOption("Can you help me choose where to start?", TARGETS.SPLIT_INTERFACE, PROMPT_MODES.STORY, "story_entry", "entrance_fork", MOVEMENT_INTENTS.ASK_JEEVES, "objective", ENTRY_STACK_MODES.GUIDED_CHOOSER, BASE_POOL_MODES.GUIDED_CHOOSER, ILLUMINATION_MODES.THRESHOLD),
    makeOption("What is the traditional website for?", TARGETS.TRADITIONAL_WEBSITE, PROMPT_MODES.STORY, "story_entry", "entrance_fork", MOVEMENT_INTENTS.ASK_JEEVES, "objective", ENTRY_STACK_MODES.BASE_POOL, BASE_POOL_MODES.PUBLIC_MAP, ILLUMINATION_MODES.PUBLIC),
    makeOption("What can I actually do here?", TARGETS.PRACTICAL_RELEVANCE, PROMPT_MODES.PRACTICAL, "practical_entry", "entrance_fork", MOVEMENT_INTENTS.ASK_JEEVES, "objective", ENTRY_STACK_MODES.BASE_POOL, BASE_POOL_MODES.PRACTICAL, ILLUMINATION_MODES.PRACTICAL),
    makeOption("What is the narrative path?", TARGETS.NARRATIVE_PATH, PROMPT_MODES.STORY, "story_entry", "entrance_fork", MOVEMENT_INTENTS.ASK_JEEVES, "narrative", ENTRY_STACK_MODES.BASE_POOL, BASE_POOL_MODES.NARRATIVE_PATH, ILLUMINATION_MODES.NARRATIVE),
    makeOption("What is the mission behind this?", TARGETS.MISSION_OVERVIEW, PROMPT_MODES.PERSONAL, "personal_entry", "entrance_fork", MOVEMENT_INTENTS.ASK_JEEVES, "narrative", ENTRY_STACK_MODES.BASE_POOL, BASE_POOL_MODES.MISSION, ILLUMINATION_MODES.NARRATIVE)
  ]);

  const START_HANDOFFS = Object.freeze([
    "siteGuide",
    "compass",
    "mirrorland",
    "meetSean"
  ]);

  const state = {
    root: null,
    transcriptEl: null,
    optionsEl: null,
    handoffsEl: null,
    inputEl: null,
    formEl: null,
    statusEl: null,

    mounted: false,
    busy: false,
    initialized: false,

    currentConversationStage: "entrance_overview",
    currentEntryLane: "entrance",
    lastLane: "",
    bridgeOffered: false,

    currentNode: TARGETS.DIAMOND_GATE_OVERVIEW,
    currentPath: TARGETS.DIAMOND_GATE_OVERVIEW,
    currentTopic: "entrance",
    currentScopeLane: "objective",

    selectedTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
    sourceTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
    activeTarget: TARGETS.DIAMOND_GATE_OVERVIEW,

    entryStackMode: ENTRY_STACK_MODES.ENTRANCE,
    basePoolMode: BASE_POOL_MODES.ESTATE_OVERVIEW,
    illuminationMode: ILLUMINATION_MODES.THRESHOLD,
    choiceClosure: null,

    conversationCoordinate: cloneCoordinate(START_COORDINATE),
    gateType: "arrival",
    pathFamily: "center",
    dialectMode: "estate_host",
    contextExpectation: "universal_entry",
    noRepeat: false,

    selectedTargets: [],
    selectedOptionKeys: [],
    visitedNodes: [],
    sessionTrail: [],
    transitionTrail: [],
    branchStack: [],
    returnStack: [],

    lastBridgeContext: null,
    lastResponse: null,
    lastError: null,
    lastSuccessfulEndpoint: "",

    revealActive: false,
    revealToken: 0,
    revealSkipResolver: null,
    revealTimer: null,

    expressionReadyPending: true
  };

  function mountHearthJeeves(rootOrSelector) {
    const root = resolveRoot(rootOrSelector);
    if (!root) return null;

    state.root = root;
    state.mounted = true;

    ensureShell();
    bindEvents();

    if (!state.initialized) {
      state.initialized = true;
      bootConversation();
    }

    dispatchReady();

    return api;
  }

  function resolveRoot(rootOrSelector) {
    if (rootOrSelector && typeof rootOrSelector === "object" && rootOrSelector.nodeType === 1) {
      return rootOrSelector;
    }

    if (typeof rootOrSelector === "string" && rootOrSelector.trim()) {
      const found = global.document && global.document.querySelector(rootOrSelector);
      if (found) return found;
    }

    if (global.document) {
      return global.document.getElementById(ROOT_ID) ||
        global.document.querySelector("[data-hearth-jeeves-mount]") ||
        global.document.querySelector(".hearth-jeeves");
    }

    return null;
  }

  function ensureShell() {
    if (!state.root) return;

    state.root.setAttribute("data-jeeves-frontbrain", CONTRACT);
    state.root.setAttribute("data-jeeves-version", VERSION);
    state.root.setAttribute("data-jeeves-reading-rhythm", "frontbrain");
    state.root.setAttribute("data-jeeves-expression-target", EXPRESSION_CONTRACT_TARGET);
    state.root.setAttribute("data-jeeves-expression-next", EXPRESSION_CONTRACT_NEXT);
    state.root.setAttribute("data-jeeves-api-target", API_CONTRACT_TARGET);
    state.root.setAttribute("data-jeeves-coordinate-carrier", "true");
    state.root.setAttribute("data-jeeves-source-identity-carrier", "true");

    state.root.innerHTML = [
      '<section class="hearth-jeeves__panel" data-jeeves-panel>',
      '  <div class="hearth-jeeves__status" data-jeeves-status>The house is listening.</div>',
      '  <div class="hearth-jeeves__transcript" data-jeeves-transcript aria-live="polite"></div>',
      '  <div class="hearth-jeeves__options" data-jeeves-options></div>',
      '  <div class="hearth-jeeves__handoffs" data-jeeves-handoffs></div>',
      '  <form class="hearth-jeeves__form" data-jeeves-form autocomplete="off">',
      '    <label class="hearth-jeeves__input-label">',
      '      <span class="hearth-jeeves__input-label-text">Ask Jeeves</span>',
      '      <input class="hearth-jeeves__input" data-jeeves-input type="text" placeholder="Ask where to begin..." />',
      '    </label>',
      '    <button class="hearth-jeeves__submit" data-jeeves-submit type="submit">Send</button>',
      '  </form>',
      '</section>'
    ].join("");

    state.statusEl = state.root.querySelector("[data-jeeves-status]");
    state.transcriptEl = state.root.querySelector("[data-jeeves-transcript]");
    state.optionsEl = state.root.querySelector("[data-jeeves-options]");
    state.handoffsEl = state.root.querySelector("[data-jeeves-handoffs]");
    state.formEl = state.root.querySelector("[data-jeeves-form]");
    state.inputEl = state.root.querySelector("[data-jeeves-input]");

    syncRootCoordinateAttrs();
  }

  function bindEvents() {
    if (!state.root || state.root.__hearthJeevesBound) return;

    state.root.__hearthJeevesBound = true;

    state.root.addEventListener("click", function onRootClick(event) {
      const optionButton = event.target.closest("[data-jeeves-option]");
      if (optionButton) {
        event.preventDefault();
        if (state.busy) return;
        handleConversationOption(readOptionFromButton(optionButton));
        return;
      }

      const routeButton = event.target.closest("[data-jeeves-route-option]");
      if (routeButton) {
        event.preventDefault();
        if (state.busy) return;
        handleRouteHandoff(readRouteFromButton(routeButton));
        return;
      }

      if (!state.revealActive) return;
      if (event.target.closest("[data-jeeves-input]")) return;
      if (event.target.closest("input, textarea, button, a")) return;

      advanceReveal();
    });

    if (state.formEl) {
      state.formEl.addEventListener("submit", function onSubmit(event) {
        event.preventDefault();
        if (state.busy) return;

        const text = safeText(state.inputEl && state.inputEl.value);
        if (!text) return;

        if (state.inputEl) state.inputEl.value = "";
        handleFreeform(text);
      });
    }

    if (typeof global.addEventListener === "function") {
      global.addEventListener("hearth:jeeves-expression-ready", function onExpressionReady() {
        state.expressionReadyPending = false;
      });
    }
  }

  function bootConversation() {
    setHouseListening(false);
    renderSystemStatus("Jeeves is reading the path.");
    clearOptions();
    clearHandoffs();

    const startFrame = shapeFrameThroughExpression({
      bubbles: START_BUBBLES.slice(),
      options: START_OPTIONS.slice(),
      handoffs: START_HANDOFFS.slice(),
      selectedTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      sourceTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      activeTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      intent: "diamondGate",

      conversationCoordinate: cloneCoordinate(START_COORDINATE),
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType: "arrival",
      pathFamily: "center",
      dialectMode: "estate_host",
      contextExpectation: "universal_entry",
      noRepeat: false,

      entryStackMode: ENTRY_STACK_MODES.ENTRANCE,
      basePoolMode: BASE_POOL_MODES.ESTATE_OVERVIEW,
      illuminationMode: ILLUMINATION_MODES.THRESHOLD,
      choiceClosure: {
        preparedDoorAvailable: true,
        digDeeperAvailable: true,
        returnForkAvailable: false,
        finalChatThreshold: false,
        mode: BASE_POOL_MODES.ESTATE_OVERVIEW
      }
    }, {
      selectedTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      sourceTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      activeTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      intent: "diamondGate",
      currentConversationStage: state.currentConversationStage,
      currentEntryLane: state.currentEntryLane,

      conversationCoordinate: cloneCoordinate(START_COORDINATE),
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType: "arrival",
      pathFamily: "center",
      dialectMode: "estate_host",
      contextExpectation: "universal_entry",
      noRepeat: false,

      entryStackMode: ENTRY_STACK_MODES.ENTRANCE,
      basePoolMode: BASE_POOL_MODES.ESTATE_OVERVIEW,
      illuminationMode: ILLUMINATION_MODES.THRESHOLD
    });

    applyFrameModes(startFrame);

    renderAssistantSequence(startFrame.bubbles || START_BUBBLES.slice(), function afterBoot() {
      renderOptions(startFrame.options || START_OPTIONS.slice());
      renderHandoffs(startFrame.handoffs || START_HANDOFFS.slice(), startFrame.handoffLabels || {});
      setHouseListening(true);
      renderSystemStatus("The house is listening.");
    });
  }

  function handleConversationOption(option) {
    const safeOption = normalizeOption(option);
    if (!safeOption || !safeOption.target) return;

    appendBubble("user", safeOption.label);

    const previousNode = state.currentNode;
    const previousLane = state.currentEntryLane;

    const target = normalizeTarget(safeOption.target);
    const sourcePacket = resolveOptionSourcePacket(safeOption, {
      selectedTarget: target,
      sourceTarget: state.sourceTarget,
      activeTarget: state.activeTarget
    });

    const selectedTarget = sourcePacket.selectedTarget;
    const sourceTarget = sourcePacket.sourceTarget;
    const activeTarget = sourcePacket.activeTarget;

    const lane = safeOption.scopeLane || inferLaneFromTarget(sourceTarget);
    const stage = inferStageFromTarget(sourceTarget, safeOption);

    const sanitizedModes = sanitizeModesForSource(sourceTarget, {
      entryStackMode: safeOption.entryStackMode || inferEntryStackModeForPayload(sourceTarget, safeOption),
      basePoolMode: safeOption.basePoolMode || inferBasePoolModeForPayload(sourceTarget, safeOption),
      illuminationMode: safeOption.illuminationMode || inferIlluminationModeForPayload(sourceTarget, safeOption)
    }, safeOption);

    const entryStackMode = sanitizedModes.entryStackMode;
    const basePoolMode = sanitizedModes.basePoolMode;
    const illuminationMode = sanitizedModes.illuminationMode;
    const choiceClosure = safeOption.choiceClosure || buildChoiceClosureForTarget(sourceTarget, safeOption, basePoolMode);
    const provisionalCoordinate = ensureCoordinateSourceIdentity(
      safeOption.conversationCoordinate || buildProvisionalCoordinate(sourceTarget, safeOption, {
        entryStackMode,
        basePoolMode,
        illuminationMode,
        sourceTarget,
        activeTarget
      }),
      {
        selectedTarget,
        sourceTarget,
        activeTarget,
        entryStackMode,
        basePoolMode,
        illuminationMode,
        payload: safeOption
      }
    );

    const bridgeContext = buildBridgeContext({
      priorNode: previousNode,
      priorLane: previousLane,
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: safeOption.label,
      promptMode: safeOption.promptMode,
      optionKind: safeOption.optionKind,
      archetypeAlignment: safeOption.archetypeAlignment,
      bridgeMoment: safeOption.bridgeMoment,
      movementIntent: safeOption.movementIntent,
      currentTopic: state.currentTopic,
      adjacentTarget: inferAdjacentTarget(sourceTarget),
      adjacentLabel: "",
      adjacentReason: inferBridgeReason(previousNode, sourceTarget, safeOption)
    });

    state.lastLane = previousLane;
    state.currentEntryLane = lane;
    state.currentConversationStage = stage;
    state.currentNode = selectedTarget;
    state.currentPath = sourceTarget;
    state.currentScopeLane = lane;
    state.selectedTarget = selectedTarget;
    state.sourceTarget = sourceTarget;
    state.activeTarget = activeTarget;
    state.entryStackMode = entryStackMode;
    state.basePoolMode = basePoolMode;
    state.illuminationMode = illuminationMode;
    state.choiceClosure = choiceClosure;
    state.conversationCoordinate = provisionalCoordinate;
    state.gateType = provisionalCoordinate.gate || "";
    state.pathFamily = provisionalCoordinate.path || "";
    state.dialectMode = provisionalCoordinate.dialect || "";
    state.contextExpectation = provisionalCoordinate.expectation || "";
    state.noRepeat = Boolean(provisionalCoordinate.noRepeat);
    state.lastBridgeContext = bridgeContext;

    syncRootCoordinateAttrs();

    pushUnique(state.selectedTargets, selectedTarget, 32);
    pushUnique(state.selectedOptionKeys, selectedTarget + "::" + safeOption.label, 64);
    pushUnique(state.visitedNodes, sourceTarget, 64);
    state.sessionTrail.push({
      selectedTarget,
      sourceTarget,
      activeTarget,
      target: selectedTarget,
      label: safeOption.label,
      timestamp: Date.now(),
      entryStackMode,
      basePoolMode,
      illuminationMode,
      conversationCoordinate: provisionalCoordinate
    });
    trimArray(state.sessionTrail, 80);

    submitToApi({
      visitorText: safeOption.label,
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: safeOption.label,
      requestMode: safeOption.requestMode || REQUEST_MODES.NODE_ENRICHMENT,
      promptMode: safeOption.promptMode,
      optionKind: safeOption.optionKind,
      archetypeAlignment: safeOption.archetypeAlignment,
      bridgeMoment: safeOption.bridgeMoment,
      movementIntent: safeOption.movementIntent,
      currentScopeLane: lane,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      choiceClosure,
      conversationCoordinate: provisionalCoordinate,
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType: provisionalCoordinate.gate,
      pathFamily: provisionalCoordinate.path,
      dialectMode: provisionalCoordinate.dialect,
      contextExpectation: provisionalCoordinate.expectation,
      noRepeat: provisionalCoordinate.noRepeat,
      digDeeperRequested: isDigDeeperOption(safeOption),
      returnForkRequested: isReturnForkOption(safeOption),
      preparedDoorSuggested: isPreparedDoorOption(safeOption),
      bridgeContext
    });
  }

  function handleFreeform(text) {
    appendBubble("user", text);

    const inferredTarget = inferTargetFromText(text) || state.currentNode || TARGETS.SPLIT_INTERFACE;
    const requestMode = inferRequestModeFromText(text);
    const promptMode = inferPromptModeFromText(text, inferredTarget);
    const movementIntent = inferMovementIntentFromText(text);
    const optionKind = movementIntent === MOVEMENT_INTENTS.RECENTER ? OPTION_KINDS.CONTROL : OPTION_KINDS.CONVERSATION_PROMPT;

    const sourcePacket = resolveFreeformSourcePacket(text, inferredTarget, movementIntent);
    const selectedTarget = sourcePacket.selectedTarget;
    const sourceTarget = sourcePacket.sourceTarget;
    const activeTarget = sourcePacket.activeTarget;

    const rawModes = {
      entryStackMode: inferEntryStackModeForPayload(sourceTarget, { movementIntent, optionKind, label: text }),
      basePoolMode: inferBasePoolModeForPayload(sourceTarget, { movementIntent, optionKind, label: text }),
      illuminationMode: inferIlluminationModeForPayload(sourceTarget, { movementIntent, optionKind, label: text })
    };
    const sanitizedModes = sanitizeModesForSource(sourceTarget, rawModes, { movementIntent, optionKind, label: text });

    const entryStackMode = sanitizedModes.entryStackMode;
    const basePoolMode = sanitizedModes.basePoolMode;
    const illuminationMode = sanitizedModes.illuminationMode;
    const lane = inferLaneFromTarget(sourceTarget);
    const provisionalCoordinate = ensureCoordinateSourceIdentity(
      buildProvisionalCoordinate(sourceTarget, {
        label: text,
        promptMode,
        optionKind,
        movementIntent,
        bridgeMoment: movementIntent === MOVEMENT_INTENTS.RECENTER ? "recenter_fork" : "before_knowledge",
        sourceTarget,
        activeTarget
      }, {
        entryStackMode,
        basePoolMode,
        illuminationMode,
        sourceTarget,
        activeTarget
      }),
      {
        selectedTarget,
        sourceTarget,
        activeTarget,
        entryStackMode,
        basePoolMode,
        illuminationMode,
        payload: { label: text, promptMode, optionKind, movementIntent }
      }
    );

    const bridgeContext = buildBridgeContext({
      priorNode: state.currentNode,
      priorLane: state.currentEntryLane,
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: text,
      promptMode,
      optionKind,
      archetypeAlignment: inferArchetypeAlignment(promptMode, sourceTarget),
      bridgeMoment: movementIntent === MOVEMENT_INTENTS.RECENTER ? "recenter_fork" : "before_knowledge",
      movementIntent,
      currentTopic: state.currentTopic,
      adjacentTarget: inferAdjacentTarget(sourceTarget),
      adjacentLabel: "",
      adjacentReason: inferBridgeReason(state.currentNode, sourceTarget, { movementIntent, optionKind })
    });

    state.lastLane = state.currentEntryLane;
    state.currentEntryLane = lane;
    state.currentConversationStage = inferStageFromTarget(sourceTarget, { movementIntent, optionKind });
    state.currentNode = selectedTarget;
    state.currentPath = sourceTarget;
    state.currentScopeLane = lane;
    state.selectedTarget = selectedTarget;
    state.sourceTarget = sourceTarget;
    state.activeTarget = activeTarget;
    state.entryStackMode = entryStackMode;
    state.basePoolMode = basePoolMode;
    state.illuminationMode = illuminationMode;
    state.choiceClosure = buildChoiceClosureForTarget(sourceTarget, { movementIntent, optionKind }, basePoolMode);
    state.conversationCoordinate = provisionalCoordinate;
    state.gateType = provisionalCoordinate.gate || "";
    state.pathFamily = provisionalCoordinate.path || "";
    state.dialectMode = provisionalCoordinate.dialect || "";
    state.contextExpectation = provisionalCoordinate.expectation || "";
    state.noRepeat = Boolean(provisionalCoordinate.noRepeat);
    state.lastBridgeContext = bridgeContext;

    syncRootCoordinateAttrs();

    submitToApi({
      visitorText: text,
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: text,
      requestMode,
      promptMode,
      optionKind,
      archetypeAlignment: inferArchetypeAlignment(promptMode, sourceTarget),
      bridgeMoment: movementIntent === MOVEMENT_INTENTS.RECENTER ? "recenter_fork" : "before_knowledge",
      movementIntent,
      currentScopeLane: lane,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      choiceClosure: state.choiceClosure,
      conversationCoordinate: provisionalCoordinate,
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType: provisionalCoordinate.gate,
      pathFamily: provisionalCoordinate.path,
      dialectMode: provisionalCoordinate.dialect,
      contextExpectation: provisionalCoordinate.expectation,
      noRepeat: provisionalCoordinate.noRepeat,
      digDeeperRequested: isDigDeeperText(text),
      returnForkRequested: movementIntent === MOVEMENT_INTENTS.RECENTER,
      preparedDoorSuggested: false,
      bridgeContext
    });
  }

  function submitToApi(payload) {
    const apiPayload = buildApiPayload(payload);

    state.busy = true;
    clearOptions();
    clearHandoffs();
    setHouseListening(false);
    setTyping(true, "The house is typing. Tap to speed the process.");
    renderSystemStatus("The house is typing. Tap to speed the process.");

    callApiWithFallback(apiPayload)
      .then(function onApiFrame(frame) {
        applyFrameModes(frame);

        const shaped = shapeFrameThroughExpression(frame, buildExpressionContext(apiPayload, frame));
        state.lastResponse = shaped;
        applyFrameModes(shaped);

        renderAssistantSequence(shaped.bubbles || shaped.beats || [], function afterSequence() {
          renderOptions(shaped.options || []);
          renderHandoffs(shaped.handoffs || [], shaped.handoffLabels || {});
          setHouseListening(true);
          setTyping(false);
          renderSystemStatus("The house is listening.");
        });
      })
      .catch(function onApiError(error) {
        state.lastError = error;
        const fallback = renderApiFailure(apiPayload, error);
        applyFrameModes(fallback);

        const shaped = shapeFrameThroughExpression(fallback, buildExpressionContext(apiPayload, fallback));
        state.lastResponse = shaped;
        applyFrameModes(shaped);

        renderAssistantSequence(shaped.bubbles || shaped.beats || [], function afterFallback() {
          renderOptions(shaped.options || []);
          renderHandoffs(shaped.handoffs || [], shaped.handoffLabels || {});
          setHouseListening(true);
          setTyping(false);
          renderSystemStatus("The house is listening.");
        });
      });
  }

  function buildApiPayload(payload) {
    const source = payload && typeof payload === "object" ? payload : {};
    const selectedTarget = normalizeTarget(source.selectedTarget || state.selectedTarget || state.currentNode || TARGETS.SPLIT_INTERFACE);
    const sourceTarget = normalizeTarget(source.sourceTarget || selectedTarget || state.sourceTarget || TARGETS.SPLIT_INTERFACE);
    const activeTarget = normalizeTarget(source.activeTarget || selectedTarget || sourceTarget || state.activeTarget || "");
    const selectedLabel = safeText(source.selectedLabel || source.visitorText || "");
    const promptMode = safeText(source.promptMode || inferPromptModeFromTarget(sourceTarget));
    const optionKind = safeText(source.optionKind || OPTION_KINDS.CONVERSATION_PROMPT);
    const movementIntent = safeText(source.movementIntent || MOVEMENT_INTENTS.ASK_JEEVES);

    const sanitizedModes = sanitizeModesForSource(sourceTarget, {
      entryStackMode: source.entryStackMode || inferEntryStackModeForPayload(sourceTarget, source),
      basePoolMode: source.basePoolMode || inferBasePoolModeForPayload(sourceTarget, source),
      illuminationMode: source.illuminationMode || inferIlluminationModeForPayload(sourceTarget, source)
    }, source);

    const entryStackMode = sanitizedModes.entryStackMode;
    const basePoolMode = sanitizedModes.basePoolMode;
    const illuminationMode = sanitizedModes.illuminationMode;

    const conversationCoordinate = ensureCoordinateSourceIdentity(
      source.conversationCoordinate || state.conversationCoordinate || buildProvisionalCoordinate(sourceTarget, source, {
        entryStackMode,
        basePoolMode,
        illuminationMode,
        sourceTarget,
        activeTarget
      }),
      {
        selectedTarget,
        sourceTarget,
        activeTarget,
        entryStackMode,
        basePoolMode,
        illuminationMode,
        payload: source
      }
    );

    const gateType = safeText(source.gateType || conversationCoordinate.gate || state.gateType);
    const pathFamily = safeText(source.pathFamily || conversationCoordinate.path || state.pathFamily);
    const dialectMode = safeText(source.dialectMode || conversationCoordinate.dialect || state.dialectMode);
    const contextExpectation = safeText(source.contextExpectation || conversationCoordinate.expectation || state.contextExpectation);
    const noRepeat = typeof source.noRepeat === "boolean" ? source.noRepeat : Boolean(conversationCoordinate.noRepeat || state.noRepeat);
    const allowedRouteFamilies = buildAllowedRouteFamilies(sourceTarget);
    const allowedRoutes = buildAllowedRoutes(sourceTarget, allowedRouteFamilies);
    const allowedTargets = buildAllowedTargets(sourceTarget);

    return {
      visitorText: safeText(source.visitorText || selectedLabel),
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel,
      requestMode: safeText(source.requestMode || REQUEST_MODES.NODE_ENRICHMENT),
      promptMode,
      optionKind,
      archetypeAlignment: safeText(source.archetypeAlignment || inferArchetypeAlignment(promptMode, sourceTarget)),
      bridgeMoment: safeText(source.bridgeMoment || "before_knowledge"),
      movementIntent,
      currentScopeLane: safeText(source.currentScopeLane || state.currentScopeLane || inferLaneFromTarget(sourceTarget)),
      bridgeContext: source.bridgeContext || state.lastBridgeContext || null,

      conversationHistory: getConversationHistory(),
      currentNode: state.currentNode,
      currentPath: state.currentPath,
      currentTopic: state.currentTopic,
      currentConversationStage: state.currentConversationStage,
      currentEntryLane: state.currentEntryLane,
      lastLane: state.lastLane,

      allowedTargets,
      allowedRoutes,
      routeHints: TARGET_ROUTE_HINTS[sourceTarget] || allowedRoutes,

      expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
      expressionContractNext: EXPRESSION_CONTRACT_NEXT,
      frontbrainContract: CONTRACT,
      previousFrontbrainContract: PREVIOUS_CONTRACT,
      rootFrontbrainContract: ROOT_FRONTBRAIN_CONTRACT,
      apiContractTarget: API_CONTRACT_TARGET,
      previousApiContractTarget: API_CONTRACT_PREVIOUS,

      entryStackMode,
      basePoolMode,
      illuminationMode,
      routeExpansionMode: "source_stable_distributed_brain_pair",
      allowedRouteFamilies,
      choiceClosure: source.choiceClosure || buildChoiceClosureForTarget(sourceTarget, source, basePoolMode),

      conversationCoordinate,
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType,
      pathFamily,
      dialectMode,
      contextExpectation,
      noRepeat,

      digDeeperRequested: Boolean(source.digDeeperRequested || isDigDeeperOption(source) || isDigDeeperText(source.visitorText || selectedLabel)),
      returnForkRequested: Boolean(source.returnForkRequested || isReturnForkOption(source)),
      preparedDoorSuggested: Boolean(source.preparedDoorSuggested || isPreparedDoorOption(source)),

      readingRhythmAuthority: "frontbrain",
      sourceIdentityAuthority: "frontbrain",
      coordinateCarrierAuthority: "frontbrain",
      protectedCopyAuthority: "expression",
      routeExecutionAuthority: "frontbrain",
      sourceValidationAuthority: "north",
      deepExpansionAuthority: "north"
    };
  }

  function callApiWithFallback(payload) {
    const endpoints = state.lastSuccessfulEndpoint
      ? [state.lastSuccessfulEndpoint].concat(API_ENDPOINTS.filter((item) => item !== state.lastSuccessfulEndpoint))
      : API_ENDPOINTS.slice();

    let index = 0;

    function tryNext() {
      const endpoint = endpoints[index++];
      if (!endpoint) {
        return Promise.reject(new Error("No Jeeves endpoint responded."));
      }

      return fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function onResponse(response) {
          if (!response.ok) {
            const error = new Error("Jeeves endpoint returned " + response.status);
            error.status = response.status;
            throw error;
          }
          state.lastSuccessfulEndpoint = endpoint;
          return response.json();
        })
        .catch(function onFailure(error) {
          if (index < endpoints.length) return tryNext();
          throw error;
        });
    }

    return tryNext();
  }

  function renderAssistantSequence(bubbles, done) {
    const cleanBubbles = normalizeBubbles(bubbles);
    const token = ++state.revealToken;

    state.revealActive = true;
    state.busy = true;

    setHouseListening(false);
    setTyping(true, "The house is typing. Tap to speed the process.");
    renderSystemStatus("The house is typing. Tap to speed the process.");

    let index = 0;

    function next() {
      if (token !== state.revealToken) return;

      if (index >= cleanBubbles.length) {
        state.revealActive = false;
        state.busy = false;
        state.revealSkipResolver = null;
        clearRevealTimer();
        if (typeof done === "function") done();
        return;
      }

      const text = cleanBubbles[index++];
      appendBubble("assistant", text);

      waitForReading(text, token).then(next);
    }

    if (!cleanBubbles.length) {
      state.revealActive = false;
      state.busy = false;
      if (typeof done === "function") done();
      return;
    }

    next();
  }

  function waitForReading(text, token) {
    const delay = Math.min(READ_MAX_MS, READ_BASE_MS + safeText(text).length * READ_PER_CHAR_MS);

    return new Promise(function wait(resolve) {
      let settled = false;

      function finish() {
        if (settled) return;
        settled = true;
        if (token === state.revealToken) {
          clearRevealTimer();
          state.revealSkipResolver = null;
        }
        resolve();
      }

      state.revealSkipResolver = finish;
      clearRevealTimer();
      state.revealTimer = global.setTimeout(finish, delay);
    });
  }

  function advanceReveal() {
    if (typeof state.revealSkipResolver === "function") {
      state.revealSkipResolver();
    }
  }

  function clearRevealTimer() {
    if (state.revealTimer) {
      global.clearTimeout(state.revealTimer);
      state.revealTimer = null;
    }
  }

  function appendBubble(role, text) {
    if (!state.transcriptEl) return;

    const bubble = global.document.createElement("div");
    bubble.className = "hearth-jeeves__bubble hearth-jeeves__bubble--" + role;
    bubble.setAttribute("data-jeeves-bubble", role);
    bubble.textContent = safeText(text);

    state.transcriptEl.appendChild(bubble);
    state.transcriptEl.scrollTop = state.transcriptEl.scrollHeight;
  }

  function renderOptions(options) {
    clearOptions();

    if (!state.optionsEl || !Array.isArray(options) || !options.length) return;

    const shaped = normalizeOptions(options).slice(0, 6);

    shaped.forEach(function renderOption(option, index) {
      const normalizedOption = normalizeOption(option);
      if (!normalizedOption) return;

      const button = global.document.createElement("button");
      button.type = "button";
      button.className = "hearth-jeeves__option";
      button.textContent = normalizedOption.label;

      button.setAttribute("data-jeeves-option", normalizedOption.target);
      button.setAttribute("data-jeeves-option-index", String(index));
      button.setAttribute("data-source-target", normalizedOption.sourceTarget || normalizedOption.target || "");
      button.setAttribute("data-active-target", normalizedOption.activeTarget || normalizedOption.target || "");
      button.setAttribute("data-option-kind", normalizedOption.optionKind || "");
      button.setAttribute("data-prompt-mode", normalizedOption.promptMode || "");
      button.setAttribute("data-archetype-alignment", normalizedOption.archetypeAlignment || "");
      button.setAttribute("data-bridge-moment", normalizedOption.bridgeMoment || "");
      button.setAttribute("data-movement-intent", normalizedOption.movementIntent || "");
      button.setAttribute("data-scope-lane", normalizedOption.scopeLane || "");
      button.setAttribute("data-option-type", normalizedOption.type || "");
      button.setAttribute("data-option-label", normalizedOption.label || "");

      button.setAttribute("data-entry-stack-mode", normalizedOption.entryStackMode || "");
      button.setAttribute("data-base-pool-mode", normalizedOption.basePoolMode || "");
      button.setAttribute("data-illumination-mode", normalizedOption.illuminationMode || "");

      button.setAttribute("data-gate-type", normalizedOption.gateType || "");
      button.setAttribute("data-path-family", normalizedOption.pathFamily || "");
      button.setAttribute("data-dialect-mode", normalizedOption.dialectMode || "");
      button.setAttribute("data-context-expectation", normalizedOption.contextExpectation || "");
      button.setAttribute("data-no-repeat", normalizedOption.noRepeat ? "true" : "false");

      button.__jeevesOption = normalizedOption;

      state.optionsEl.appendChild(button);
    });
  }

  function renderHandoffs(handoffs, handoffLabels) {
    clearHandoffs();

    if (!state.handoffsEl || !Array.isArray(handoffs) || !handoffs.length) return;

    const labels = handoffLabels && typeof handoffLabels === "object" ? handoffLabels : {};
    const unique = dedupeStrings(handoffs).slice(0, 6);

    unique.forEach(function renderRoute(routeId) {
      const route = safeText(routeId);
      const href = ROUTE_HREFS[route];
      if (!route || !href) return;

      const button = global.document.createElement("button");
      button.type = "button";
      button.className = "hearth-jeeves__handoff";
      button.textContent = labels[route] || ROUTE_LABELS[route] || "Open Door";

      button.setAttribute("data-jeeves-route-option", route);
      button.setAttribute("data-route-href", href);
      button.setAttribute("data-option-kind", OPTION_KINDS.ROUTE);
      button.setAttribute("data-movement-intent", MOVEMENT_INTENTS.OPEN_PREPARED_DOOR);
      button.setAttribute("data-source-target", state.sourceTarget || state.currentPath || "");
      button.setAttribute("data-active-target", route);
      button.setAttribute("data-entry-stack-mode", ENTRY_STACK_MODES.PREPARED_DOOR);
      button.setAttribute("data-base-pool-mode", state.basePoolMode || "");
      button.setAttribute("data-illumination-mode", state.illuminationMode || ILLUMINATION_MODES.PUBLIC);
      button.setAttribute("data-gate-type", "prepared_door");
      button.setAttribute("data-path-family", state.pathFamily || "");
      button.setAttribute("data-dialect-mode", state.dialectMode || "");
      button.setAttribute("data-context-expectation", "page_visit");
      button.setAttribute("data-no-repeat", "true");

      state.handoffsEl.appendChild(button);
    });
  }

  function handleRouteHandoff(route) {
    const routeId = safeText(route && route.routeId);
    const href = safeText(route && route.href) || ROUTE_HREFS[routeId];

    if (!routeId || !href) return;

    dispatchPreparedDoor(routeId, href);

    if (global.location && typeof global.location.assign === "function") {
      global.location.assign(href);
    } else if (global.location) {
      global.location.href = href;
    }
  }

  function readOptionFromButton(button) {
    if (!button) return null;
    if (button.__jeevesOption) return button.__jeevesOption;

    const target = button.getAttribute("data-jeeves-option") || "";

    return {
      label: button.getAttribute("data-option-label") || button.textContent || "",
      target,
      sourceTarget: button.getAttribute("data-source-target") || target,
      activeTarget: button.getAttribute("data-active-target") || target,
      type: button.getAttribute("data-option-type") || "conversation",
      scopeLane: button.getAttribute("data-scope-lane") || "",
      promptMode: button.getAttribute("data-prompt-mode") || "",
      optionKind: button.getAttribute("data-option-kind") || "",
      archetypeAlignment: button.getAttribute("data-archetype-alignment") || "",
      bridgeMoment: button.getAttribute("data-bridge-moment") || "",
      movementIntent: button.getAttribute("data-movement-intent") || "",
      entryStackMode: button.getAttribute("data-entry-stack-mode") || "",
      basePoolMode: button.getAttribute("data-base-pool-mode") || "",
      illuminationMode: button.getAttribute("data-illumination-mode") || "",
      gateType: button.getAttribute("data-gate-type") || "",
      pathFamily: button.getAttribute("data-path-family") || "",
      dialectMode: button.getAttribute("data-dialect-mode") || "",
      contextExpectation: button.getAttribute("data-context-expectation") || "",
      noRepeat: button.getAttribute("data-no-repeat") === "true"
    };
  }

  function readRouteFromButton(button) {
    if (!button) return null;

    return {
      routeId: button.getAttribute("data-jeeves-route-option") || "",
      href: button.getAttribute("data-route-href") || "",
      label: button.textContent || "",
      sourceTarget: button.getAttribute("data-source-target") || state.sourceTarget || "",
      activeTarget: button.getAttribute("data-active-target") || button.getAttribute("data-jeeves-route-option") || "",
      entryStackMode: button.getAttribute("data-entry-stack-mode") || ENTRY_STACK_MODES.PREPARED_DOOR,
      movementIntent: button.getAttribute("data-movement-intent") || MOVEMENT_INTENTS.OPEN_PREPARED_DOOR,
      gateType: button.getAttribute("data-gate-type") || "prepared_door",
      pathFamily: button.getAttribute("data-path-family") || "",
      contextExpectation: button.getAttribute("data-context-expectation") || "page_visit",
      noRepeat: true
    };
  }

  function shapeFrameThroughExpression(frame, context) {
    const expression = getExpression();
    const source = frame && typeof frame === "object" ? frame : {};

    if (expression && typeof expression.shapeConversationFrame === "function") {
      try {
        return expression.shapeConversationFrame(source, context || {});
      } catch (error) {
        state.lastError = error;
      }
    }

    return source;
  }

  function buildExpressionContext(payload, frame) {
    const source = payload && typeof payload === "object" ? payload : {};
    const response = frame && typeof frame === "object" ? frame : {};
    const responseNoRepeat = typeof response.noRepeat === "boolean" ? response.noRepeat : null;
    const sourceNoRepeat = typeof source.noRepeat === "boolean" ? source.noRepeat : null;

    const selectedTarget = normalizeTarget(response.selectedTarget || source.selectedTarget || state.selectedTarget || state.currentNode);
    const sourceTarget = normalizeTarget(response.sourceTarget || source.sourceTarget || (response.conversationCoordinate && response.conversationCoordinate.sourceTarget) || state.sourceTarget || selectedTarget);
    const activeTarget = normalizeTarget(response.activeTarget || source.activeTarget || (response.conversationCoordinate && response.conversationCoordinate.activeTarget) || state.activeTarget || selectedTarget);

    return {
      intent: response.intent || source.intent || "",
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: source.selectedLabel || source.visitorText || "",
      currentNode: state.currentNode,
      currentPath: state.currentPath,
      currentEntryLane: state.currentEntryLane,
      lastLane: state.lastLane,
      currentConversationStage: state.currentConversationStage,
      promptMode: source.promptMode || "",
      optionKind: source.optionKind || "",
      bridgeMoment: source.bridgeMoment || "",
      movementIntent: source.movementIntent || "",

      conversationCoordinate: response.conversationCoordinate || source.conversationCoordinate || state.conversationCoordinate,
      sourceStabilityLaw: response.sourceStabilityLaw || source.sourceStabilityLaw || SOURCE_STABILITY_LAW,
      gateType: response.gateType || source.gateType || state.gateType,
      pathFamily: response.pathFamily || source.pathFamily || state.pathFamily,
      dialectMode: response.dialectMode || source.dialectMode || state.dialectMode,
      contextExpectation: response.contextExpectation || source.contextExpectation || state.contextExpectation,
      noRepeat: responseNoRepeat !== null ? responseNoRepeat : sourceNoRepeat !== null ? sourceNoRepeat : state.noRepeat,

      entryStackMode: response.entryStackMode || source.entryStackMode || state.entryStackMode,
      basePoolMode: response.basePoolMode || source.basePoolMode || state.basePoolMode,
      illuminationMode: response.illuminationMode || source.illuminationMode || state.illuminationMode,
      choiceClosure: response.choiceClosure || source.choiceClosure || state.choiceClosure,
      bridgeContext: source.bridgeContext || response.bridgeContext || state.lastBridgeContext
    };
  }

  function getExpression() {
    return global.HEARTH_JEEVES_EXPRESSION ||
      global.HEARTH_JEEVES_EXPRESSION_BRIDGE ||
      (global.HEARTH && global.HEARTH.jeevesExpression) ||
      null;
  }

  function applyFrameModes(frame) {
    if (!frame || typeof frame !== "object") return;

    const coordinate = frame.conversationCoordinate && typeof frame.conversationCoordinate === "object"
      ? ensureCoordinateSourceIdentity(frame.conversationCoordinate, {
        selectedTarget: frame.selectedTarget || state.selectedTarget,
        sourceTarget: frame.sourceTarget || state.sourceTarget,
        activeTarget: frame.activeTarget || state.activeTarget,
        entryStackMode: frame.entryStackMode || state.entryStackMode,
        basePoolMode: frame.basePoolMode || state.basePoolMode,
        illuminationMode: frame.illuminationMode || state.illuminationMode,
        payload: frame
      })
      : null;

    if (frame.selectedTarget) state.selectedTarget = normalizeTarget(frame.selectedTarget);
    if (frame.sourceTarget) state.sourceTarget = normalizeTarget(frame.sourceTarget);
    else if (coordinate && coordinate.sourceTarget) state.sourceTarget = normalizeTarget(coordinate.sourceTarget);

    if (frame.activeTarget) state.activeTarget = normalizeTarget(frame.activeTarget);
    else if (coordinate && coordinate.activeTarget) state.activeTarget = normalizeTarget(coordinate.activeTarget);

    if (coordinate) state.conversationCoordinate = coordinate;

    if (frame.gateType) state.gateType = safeText(frame.gateType);
    else if (coordinate && coordinate.gate) state.gateType = coordinate.gate;

    if (frame.pathFamily) state.pathFamily = safeText(frame.pathFamily);
    else if (coordinate && coordinate.path) state.pathFamily = coordinate.path;

    if (frame.dialectMode) state.dialectMode = safeText(frame.dialectMode);
    else if (coordinate && coordinate.dialect) state.dialectMode = coordinate.dialect;

    if (frame.contextExpectation) state.contextExpectation = safeText(frame.contextExpectation);
    else if (coordinate && coordinate.expectation) state.contextExpectation = coordinate.expectation;

    if (typeof frame.noRepeat === "boolean") state.noRepeat = frame.noRepeat;
    else if (coordinate && typeof coordinate.noRepeat === "boolean") state.noRepeat = coordinate.noRepeat;

    if (frame.entryStackMode) state.entryStackMode = safeText(frame.entryStackMode);
    else if (coordinate) state.entryStackMode = entryStackModeFromCoordinate(coordinate);

    if (frame.basePoolMode) state.basePoolMode = safeText(frame.basePoolMode);
    else if (coordinate && coordinate.mode) state.basePoolMode = coordinate.mode;

    if (frame.illuminationMode) state.illuminationMode = safeText(frame.illuminationMode);
    else if (coordinate) state.illuminationMode = illuminationModeFromCoordinate(coordinate);

    if (frame.choiceClosure && typeof frame.choiceClosure === "object") state.choiceClosure = frame.choiceClosure;
    else if (coordinate) state.choiceClosure = buildChoiceClosureFromCoordinate(coordinate);

    if (frame.nextTopic) state.currentTopic = safeText(frame.nextTopic);

    if (frame.selectedTarget) {
      state.currentNode = normalizeTarget(frame.selectedTarget);
    }

    if (frame.sourceTarget) {
      state.currentPath = normalizeTarget(frame.sourceTarget);
    } else if (coordinate && coordinate.sourceTarget) {
      state.currentPath = normalizeTarget(coordinate.sourceTarget);
    } else if (frame.selectedTarget) {
      state.currentPath = normalizeTarget(frame.selectedTarget);
    }

    syncRootCoordinateAttrs();
  }

  function renderApiFailure(payload, error) {
    const source = payload && typeof payload === "object" ? payload : {};
    const selectedTarget = normalizeTarget(source.selectedTarget || state.selectedTarget || TARGETS.SPLIT_INTERFACE);
    const sourceTarget = normalizeTarget(source.sourceTarget || state.sourceTarget || selectedTarget);
    const activeTarget = normalizeTarget(source.activeTarget || state.activeTarget || selectedTarget);

    const coordinate = {
      step: 34,
      priorStep: 5,
      gate: "return_fork",
      path: "return",
      mode: "return",
      dialect: "return_guide",
      expectation: "safe_recenter",
      sourceTarget,
      activeTarget,
      target: selectedTarget,
      destination: "",
      next: ["guided_chooser", "public_map", "practical", "narrative_path", "mission", "proof"],
      noRepeat: true
    };

    return {
      bubbles: [
        "I can still keep the entrance stable.",
        "The deeper answer path did not respond cleanly, so I will return you to the guided chooser instead of leaving you in a broken room.",
        "Choose the public map, the narrative path, something practical, the mission, or the proof-facing path."
      ],
      options: START_OPTIONS.slice(),
      handoffs: START_HANDOFFS.slice(),
      selectedTarget: TARGETS.SPLIT_INTERFACE,
      sourceTarget,
      activeTarget,
      intent: "splitInterface",
      confidence: 0.42,
      needsRecenter: true,
      nextTopic: "guided chooser",

      conversationCoordinate: coordinate,
      sourceStabilityLaw: SOURCE_STABILITY_LAW,
      gateType: coordinate.gate,
      pathFamily: coordinate.path,
      dialectMode: coordinate.dialect,
      contextExpectation: coordinate.expectation,
      noRepeat: true,

      entryStackMode: ENTRY_STACK_MODES.RETURN,
      basePoolMode: BASE_POOL_MODES.RETURN,
      illuminationMode: ILLUMINATION_MODES.RETURN,
      choiceClosure: {
        preparedDoorAvailable: false,
        digDeeperAvailable: false,
        returnForkAvailable: true,
        finalChatThreshold: false,
        mode: BASE_POOL_MODES.RETURN
      },
      errorMessage: error && error.message ? error.message : ""
    };
  }

  function clearOptions() {
    if (state.optionsEl) state.optionsEl.innerHTML = "";
  }

  function clearHandoffs() {
    if (state.handoffsEl) state.handoffsEl.innerHTML = "";
  }

  function setHouseListening(isListening) {
    if (!state.root) return;
    state.root.setAttribute("data-house-listening", isListening ? "true" : "false");
  }

  function setTyping(isTyping, label) {
    if (!state.root) return;
    state.root.setAttribute("data-house-typing", isTyping ? "true" : "false");
    if (label) state.root.setAttribute("data-house-typing-label", label);
  }

  function renderSystemStatus(text) {
    if (!state.statusEl) return;

    const expression = getExpression();
    let value = safeText(text);

    if (expression && typeof expression.shapeInterfaceState === "function") {
      if (/listening/i.test(value)) value = expression.shapeInterfaceState("listening") || value;
      if (/typing/i.test(value)) value = expression.shapeInterfaceState("typing") || value;
      if (/reading/i.test(value)) value = expression.shapeInterfaceState("reading") || value;
      if (/ready/i.test(value)) value = expression.shapeInterfaceState("ready") || value;
    }

    state.statusEl.textContent = value;
  }

  function normalizeBubbles(value) {
    if (!Array.isArray(value)) return [];
    return value.map(safeText).filter(Boolean).slice(0, 6);
  }

  function normalizeOptions(value) {
    if (!Array.isArray(value)) return [];
    return value.map(normalizeOption).filter(Boolean);
  }

  function normalizeOption(option) {
    if (!option || typeof option !== "object") return null;

    const target = normalizeTarget(option.target || "");
    const label = safeText(option.label || inferLabelFromTarget(target));
    if (!target || !label) return null;

    const sourceTarget = normalizeTarget(option.sourceTarget || target);
    const activeTarget = normalizeTarget(option.activeTarget || target);

    const rawModes = {
      entryStackMode: option.entryStackMode || inferEntryStackModeForPayload(sourceTarget, option),
      basePoolMode: option.basePoolMode || inferBasePoolModeForPayload(sourceTarget, option),
      illuminationMode: option.illuminationMode || inferIlluminationModeForPayload(sourceTarget, option)
    };
    const modes = sanitizeModesForSource(sourceTarget, rawModes, option);
    const entryStackMode = safeText(modes.entryStackMode);
    const basePoolMode = safeText(modes.basePoolMode);
    const illuminationMode = safeText(modes.illuminationMode);

    const coordinate = ensureCoordinateSourceIdentity(option.conversationCoordinate || buildProvisionalCoordinate(sourceTarget, option, {
      entryStackMode,
      basePoolMode,
      illuminationMode,
      sourceTarget,
      activeTarget
    }), {
      selectedTarget: target,
      sourceTarget,
      activeTarget,
      entryStackMode,
      basePoolMode,
      illuminationMode,
      payload: option
    });

    return {
      label,
      target,
      sourceTarget,
      activeTarget,
      type: safeText(option.type || "conversation"),
      scopeLane: safeText(option.scopeLane || inferLaneFromTarget(sourceTarget)),
      promptMode: safeText(option.promptMode || inferPromptModeFromTarget(sourceTarget)),
      optionKind: safeText(option.optionKind || OPTION_KINDS.CONVERSATION_PROMPT),
      archetypeAlignment: safeText(option.archetypeAlignment || inferArchetypeAlignment(option.promptMode, sourceTarget)),
      bridgeMoment: safeText(option.bridgeMoment || "before_knowledge"),
      movementIntent: safeText(option.movementIntent || MOVEMENT_INTENTS.ASK_JEEVES),
      entryStackMode,
      basePoolMode,
      illuminationMode,
      choiceClosure: option.choiceClosure && typeof option.choiceClosure === "object" ? option.choiceClosure : null,
      requestMode: safeText(option.requestMode || REQUEST_MODES.NODE_ENRICHMENT),

      conversationCoordinate: coordinate,
      gateType: safeText(option.gateType || coordinate.gate || ""),
      pathFamily: safeText(option.pathFamily || coordinate.path || ""),
      dialectMode: safeText(option.dialectMode || coordinate.dialect || ""),
      contextExpectation: safeText(option.contextExpectation || coordinate.expectation || ""),
      noRepeat: typeof option.noRepeat === "boolean" ? option.noRepeat : Boolean(coordinate.noRepeat)
    };
  }

  function normalizeCoordinate(value) {
    if (!value || typeof value !== "object") return null;

    const target = normalizeTarget(value.target || "");
    const sourceTarget = normalizeTarget(value.sourceTarget || target || "");
    const activeTarget = normalizeTarget(value.activeTarget || target || sourceTarget || "");

    return {
      step: safeNumber(value.step, 5),
      priorStep: safeNumber(value.priorStep, 0),
      gate: safeText(value.gate || "base_pool"),
      path: safeText(value.path || "center"),
      mode: safeText(value.mode || BASE_POOL_MODES.ESTATE_OVERVIEW),
      dialect: safeText(value.dialect || "estate_host"),
      expectation: safeText(value.expectation || "orientation_before_entry"),
      sourceTarget,
      activeTarget,
      target,
      destination: safeText(value.destination || ""),
      next: Array.isArray(value.next) ? value.next.map(safeText).filter(Boolean).slice(0, 10) : [],
      noRepeat: Boolean(value.noRepeat)
    };
  }

  function cloneCoordinate(value) {
    const coordinate = normalizeCoordinate(value);
    if (!coordinate) return null;
    return {
      step: coordinate.step,
      priorStep: coordinate.priorStep,
      gate: coordinate.gate,
      path: coordinate.path,
      mode: coordinate.mode,
      dialect: coordinate.dialect,
      expectation: coordinate.expectation,
      sourceTarget: coordinate.sourceTarget,
      activeTarget: coordinate.activeTarget,
      target: coordinate.target,
      destination: coordinate.destination,
      next: coordinate.next.slice(),
      noRepeat: coordinate.noRepeat
    };
  }

  function buildProvisionalCoordinate(target, payload, modes) {
    const clean = normalizeTarget(target);
    const source = payload && typeof payload === "object" ? payload : {};
    const modeBundle = modes && typeof modes === "object" ? modes : {};
    const sourceTarget = normalizeTarget(modeBundle.sourceTarget || source.sourceTarget || clean);
    const activeTarget = normalizeTarget(modeBundle.activeTarget || source.activeTarget || clean);
    const rawModes = {
      entryStackMode: modeBundle.entryStackMode || source.entryStackMode || inferEntryStackModeForPayload(sourceTarget, source),
      basePoolMode: modeBundle.basePoolMode || source.basePoolMode || inferBasePoolModeForPayload(sourceTarget, source),
      illuminationMode: modeBundle.illuminationMode || source.illuminationMode || inferIlluminationModeForPayload(sourceTarget, source)
    };
    const sanitizedModes = sanitizeModesForSource(sourceTarget, rawModes, source);
    const entryStackMode = safeText(sanitizedModes.entryStackMode);
    const basePoolMode = safeText(sanitizedModes.basePoolMode);
    const illuminationMode = safeText(sanitizedModes.illuminationMode);
    const movementIntent = safeText(source.movementIntent || MOVEMENT_INTENTS.ASK_JEEVES);
    const optionKind = safeText(source.optionKind || OPTION_KINDS.CONVERSATION_PROMPT);

    const gate = inferGateForCoordinate(sourceTarget, {
      entryStackMode,
      movementIntent,
      optionKind,
      bridgeMoment: source.bridgeMoment,
      basePoolMode
    });
    const step = stepForGate(gate);
    const path = pathForCoordinate(sourceTarget, basePoolMode);
    const dialect = dialectForCoordinate(path, gate, basePoolMode, illuminationMode);
    const expectation = expectationForGate(gate, path, basePoolMode);
    const noRepeat = gate === "dig_deeper" ||
      gate === "prepared_door" ||
      gate === "return_fork" ||
      gate === "cross_path_bridge" ||
      gate === "diagnostic_boundary";

    return {
      step,
      priorStep: priorStepForStep(step),
      gate,
      path,
      mode: basePoolMode || BASE_POOL_MODES.ESTATE_OVERVIEW,
      dialect,
      expectation,
      sourceTarget,
      activeTarget,
      target: clean,
      destination: "",
      next: nextForCoordinate(gate, path),
      noRepeat
    };
  }

  function ensureCoordinateSourceIdentity(coordinateInput, data) {
    const source = data && typeof data === "object" ? data : {};
    const selectedTarget = normalizeTarget(source.selectedTarget || "");
    const sourceTarget = normalizeTarget(source.sourceTarget || selectedTarget || "");
    const activeTarget = normalizeTarget(source.activeTarget || selectedTarget || sourceTarget || "");
    const entryStackMode = safeText(source.entryStackMode || "");
    const basePoolMode = safeText(source.basePoolMode || "");
    const illuminationMode = safeText(source.illuminationMode || "");
    let coordinate = normalizeCoordinate(coordinateInput);

    const needsRebuild =
      !coordinate ||
      !coordinate.sourceTarget ||
      (sourceTarget && coordinate.sourceTarget !== sourceTarget) ||
      shouldRebuildCoordinateForSource(sourceTarget, coordinate, entryStackMode, basePoolMode);

    if (needsRebuild) {
      coordinate = buildProvisionalCoordinate(sourceTarget || selectedTarget, source.payload || {}, {
        entryStackMode,
        basePoolMode,
        illuminationMode,
        sourceTarget,
        activeTarget
      });
    }

    coordinate.sourceTarget = sourceTarget || coordinate.sourceTarget || coordinate.target;
    coordinate.activeTarget = activeTarget || coordinate.activeTarget || coordinate.target;
    coordinate.target = selectedTarget || coordinate.target || coordinate.sourceTarget;

    if (coordinate.sourceTarget !== TARGETS.SPLIT_INTERFACE && coordinate.gate === "intention") {
      coordinate.gate = "base_pool";
      coordinate.step = 5;
      coordinate.priorStep = 3;
      coordinate.path = pathForCoordinate(coordinate.sourceTarget, basePoolMode || coordinate.mode);
      coordinate.mode = basePoolMode && basePoolMode !== BASE_POOL_MODES.GUIDED_CHOOSER
        ? basePoolMode
        : inferBasePoolModeForPayload(coordinate.sourceTarget, {});
      coordinate.dialect = dialectForCoordinate(coordinate.path, coordinate.gate, coordinate.mode, illuminationMode);
      coordinate.expectation = expectationForGate(coordinate.gate, coordinate.path, coordinate.mode);
      coordinate.next = nextForCoordinate(coordinate.gate, coordinate.path);
      coordinate.noRepeat = Boolean(coordinate.noRepeat && coordinate.gate !== "base_pool");
    }

    if (coordinate.sourceTarget !== TARGETS.SPLIT_INTERFACE && coordinate.mode === BASE_POOL_MODES.GUIDED_CHOOSER) {
      coordinate.mode = inferBasePoolModeForPayload(coordinate.sourceTarget, {});
      coordinate.path = pathForCoordinate(coordinate.sourceTarget, coordinate.mode);
      coordinate.dialect = dialectForCoordinate(coordinate.path, coordinate.gate, coordinate.mode, illuminationMode);
      coordinate.expectation = expectationForGate(coordinate.gate, coordinate.path, coordinate.mode);
    }

    return coordinate;
  }

  function shouldRebuildCoordinateForSource(sourceTarget, coordinate, entryStackMode, basePoolMode) {
    if (!coordinate) return true;
    if (!sourceTarget) return false;
    if (sourceTarget === TARGETS.SPLIT_INTERFACE) return false;
    if (coordinate.gate === "intention") return true;
    if (coordinate.mode === BASE_POOL_MODES.GUIDED_CHOOSER) return true;
    if (entryStackMode === ENTRY_STACK_MODES.GUIDED_CHOOSER) return true;
    if (basePoolMode === BASE_POOL_MODES.GUIDED_CHOOSER) return true;
    return false;
  }

  function sanitizeModesForSource(sourceTarget, modes, payload) {
    const clean = normalizeTarget(sourceTarget);
    const source = payload && typeof payload === "object" ? payload : {};
    let entryStackMode = safeText(modes && modes.entryStackMode);
    let basePoolMode = safeText(modes && modes.basePoolMode);
    let illuminationMode = safeText(modes && modes.illuminationMode);

    if (!entryStackMode) entryStackMode = inferEntryStackModeForPayload(clean, source);
    if (!basePoolMode) basePoolMode = inferBasePoolModeForPayload(clean, source);
    if (!illuminationMode) illuminationMode = inferIlluminationModeForPayload(clean, source);

    if (clean !== TARGETS.SPLIT_INTERFACE) {
      if (entryStackMode === ENTRY_STACK_MODES.GUIDED_CHOOSER) {
        entryStackMode = inferEntryStackModeForPayload(clean, Object.assign({}, source, {
          entryStackMode: "",
          basePoolMode: ""
        }));
        if (entryStackMode === ENTRY_STACK_MODES.GUIDED_CHOOSER) entryStackMode = ENTRY_STACK_MODES.BASE_POOL;
      }

      if (basePoolMode === BASE_POOL_MODES.GUIDED_CHOOSER) {
        basePoolMode = inferBasePoolModeForPayload(clean, Object.assign({}, source, {
          basePoolMode: "",
          entryStackMode: ""
        }));
        if (basePoolMode === BASE_POOL_MODES.GUIDED_CHOOSER) basePoolMode = BASE_POOL_MODES.NONE;
      }

      if (illuminationMode === ILLUMINATION_MODES.THRESHOLD && basePoolMode !== BASE_POOL_MODES.ESTATE_OVERVIEW) {
        illuminationMode = inferIlluminationModeForPayload(clean, {
          basePoolMode,
          illuminationMode: ""
        });
      }
    }

    return {
      entryStackMode,
      basePoolMode,
      illuminationMode
    };
  }

  function resolveOptionSourcePacket(option, fallback) {
    const source = option && typeof option === "object" ? option : {};
    const back = fallback && typeof fallback === "object" ? fallback : {};
    const selectedTarget = normalizeTarget(source.target || source.selectedTarget || back.selectedTarget || "");
    const sourceTarget = normalizeTarget(source.sourceTarget || selectedTarget || back.sourceTarget || "");
    const activeTarget = normalizeTarget(source.activeTarget || selectedTarget || sourceTarget || back.activeTarget || "");

    return {
      selectedTarget,
      sourceTarget,
      activeTarget
    };
  }

  function resolveFreeformSourcePacket(text, inferredTarget, movementIntent) {
    const target = normalizeTarget(inferredTarget);
    const movement = safeText(movementIntent);

    if (
      movement === MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH ||
      movement === MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM ||
      movement === MOVEMENT_INTENTS.OPEN_PREPARED_DOOR
    ) {
      return {
        selectedTarget: target || state.selectedTarget || state.currentNode,
        sourceTarget: state.sourceTarget || state.currentPath || target || state.currentNode,
        activeTarget: target || state.activeTarget || state.sourceTarget || state.currentNode
      };
    }

    if (movement === MOVEMENT_INTENTS.RECENTER) {
      return {
        selectedTarget: target || TARGETS.RECENTER,
        sourceTarget: target || TARGETS.RECENTER,
        activeTarget: target || TARGETS.RECENTER
      };
    }

    return {
      selectedTarget: target,
      sourceTarget: target,
      activeTarget: target
    };
  }

  function inferGateForCoordinate(target, data) {
    const source = data && typeof data === "object" ? data : {};
    const entryStackMode = safeText(source.entryStackMode);
    const movementIntent = safeText(source.movementIntent);
    const optionKind = safeText(source.optionKind);
    const bridgeMoment = safeText(source.bridgeMoment);

    if (entryStackMode === ENTRY_STACK_MODES.RETURN || movementIntent === MOVEMENT_INTENTS.RECENTER || optionKind === OPTION_KINDS.CONTROL || target === TARGETS.RECENTER || target === TARGETS.RETURN_FORK || target === TARGETS.RESTART_FORK) return "return_fork";
    if (entryStackMode === ENTRY_STACK_MODES.PREPARED_DOOR || movementIntent === MOVEMENT_INTENTS.OPEN_PREPARED_DOOR || optionKind === OPTION_KINDS.ROUTE) return "prepared_door";
    if (entryStackMode === ENTRY_STACK_MODES.DIG_DEEPER || movementIntent === MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH || optionKind === OPTION_KINDS.FORWARD) return "dig_deeper";
    if (entryStackMode === ENTRY_STACK_MODES.PATH_SAMPLE || movementIntent === MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM || optionKind === OPTION_KINDS.PARALLEL || bridgeMoment === "parallel_crossing") return "cross_path_bridge";
    if (target === TARGETS.DIAGNOSTIC_REFERRAL || target === TARGETS.DIAGNOSTIC || target === TARGETS.CHARACTER_MIRROR) return "diagnostic_boundary";
    if (target === TARGETS.SPLIT_INTERFACE) return "intention";
    if (target === TARGETS.DIAMOND_GATE_OVERVIEW || entryStackMode === ENTRY_STACK_MODES.ENTRANCE) return "arrival";

    return "base_pool";
  }

  function stepForGate(gate) {
    if (gate === "arrival") return 1;
    if (gate === "split") return 2;
    if (gate === "intention") return 3;
    if (gate === "base_pool") return 5;
    if (gate === "intrigue_bridge") return 8;
    if (gate === "diagnostic_boundary") return 8;
    if (gate === "dig_deeper") return 13;
    if (gate === "prepared_door") return 21;
    if (gate === "return_fork") return 34;
    if (gate === "cross_path_bridge") return 55;
    return 5;
  }

  function priorStepForStep(step) {
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

  function pathForCoordinate(target, basePoolMode) {
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

    if (target === TARGETS.TRADITIONAL_WEBSITE || target === TARGETS.TRADITIONAL_COMPASS || target === TARGETS.PRODUCTS || target === TARGETS.LAWS) return "public";
    if (target === TARGETS.NARRATIVE_PATH) return "narrative";
    if (target === TARGETS.MISSION_OVERVIEW) return "mission";
    if (target === TARGETS.PRACTICAL_RELEVANCE) return "practical";
    if (target === TARGETS.SCIENTIFIC_LAW) return "proof";
    if (target === TARGETS.FRONTIER) return "frontier";
    if (target === TARGETS.HEARTH) return "hearth";
    if (target === TARGETS.MIRRORLAND) return "mirrorland";
    if (target === TARGETS.CHARACTERS) return "character";
    if (target === TARGETS.SEAN || target === TARGETS.UNDERDOG) return "creator";
    if (target === TARGETS.RECENTER) return "return";

    return "center";
  }

  function dialectForCoordinate(path, gate, basePoolMode, illuminationMode) {
    if (gate === "return_fork" || path === "return") return "return_guide";
    if (gate === "diagnostic_boundary" || path === "diagnostic") return "diagnostic_boundary_guide";
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

  function expectationForGate(gate, path, basePoolMode) {
    if (gate === "arrival") return "universal_entry";
    if (gate === "split") return "two_path_orientation";
    if (gate === "intention") return "choice_help";
    if (gate === "base_pool") return "orientation_before_entry";
    if (gate === "intrigue_bridge") return "intrigue_before_entry";
    if (gate === "dig_deeper") return "deeper_context";
    if (gate === "prepared_door") return "page_visit";
    if (gate === "return_fork") return "safe_recenter";
    if (gate === "cross_path_bridge") return "bridge_context";
    if (gate === "diagnostic_boundary" || path === "diagnostic" || basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) return "diagnostic_referral";
    return "orientation_before_entry";
  }

  function nextForCoordinate(gate, path) {
    if (gate === "arrival") return ["choose_start", "public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === "intention") return ["public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === "prepared_door") return ["return"];
    if (gate === "return_fork") return ["guided_chooser", "public_map", "practical", "narrative_path", "mission", "proof"];
    if (gate === "cross_path_bridge") return ["base_pool", "dig_deeper", "open_page", "return"];
    if (gate === "diagnostic_boundary") return ["open_diagnostic", "character_mirror", "narrative_bridge", "return"];
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

  function entryStackModeFromCoordinate(coordinate) {
    if (!coordinate) return ENTRY_STACK_MODES.BASE_POOL;
    if (coordinate.gate === "arrival") return ENTRY_STACK_MODES.ENTRANCE;
    if (coordinate.gate === "intention") return ENTRY_STACK_MODES.GUIDED_CHOOSER;
    if (coordinate.gate === "dig_deeper") return ENTRY_STACK_MODES.DIG_DEEPER;
    if (coordinate.gate === "prepared_door") return ENTRY_STACK_MODES.PREPARED_DOOR;
    if (coordinate.gate === "return_fork") return ENTRY_STACK_MODES.RETURN;
    if (coordinate.gate === "cross_path_bridge" || coordinate.gate === "intrigue_bridge") return ENTRY_STACK_MODES.PATH_SAMPLE;
    return ENTRY_STACK_MODES.BASE_POOL;
  }

  function illuminationModeFromCoordinate(coordinate) {
    if (!coordinate) return ILLUMINATION_MODES.PUBLIC;
    if (coordinate.path === "proof") return ILLUMINATION_MODES.PROOF;
    if (coordinate.path === "practical" || coordinate.path === "frontier") return ILLUMINATION_MODES.PRACTICAL;
    if (coordinate.path === "return") return ILLUMINATION_MODES.RETURN;
    if (coordinate.path === "diagnostic" || coordinate.gate === "diagnostic_boundary") return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
    if (["narrative", "mission", "character", "hearth", "mirrorland", "creator"].includes(coordinate.path)) return ILLUMINATION_MODES.NARRATIVE;
    return ILLUMINATION_MODES.PUBLIC;
  }

  function buildChoiceClosureFromCoordinate(coordinate) {
    const next = coordinate && Array.isArray(coordinate.next) ? coordinate.next : [];
    return {
      preparedDoorAvailable: next.includes("open_page") || coordinate.gate === "prepared_door",
      preparedDoorSuggested: coordinate.gate === "prepared_door",
      digDeeperAvailable: next.includes("dig_deeper") || coordinate.gate === "base_pool" || coordinate.gate === "intrigue_bridge",
      returnForkAvailable: next.includes("return") || coordinate.gate !== "arrival",
      finalChatThreshold: coordinate.gate === "diagnostic_boundary" || coordinate.gate === "prepared_door",
      mode: coordinate.mode || ""
    };
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

  function inferLabelFromTarget(target) {
    const clean = normalizeTarget(target);

    const labels = {
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
    };

    return labels[clean] || "Can you tell me more?";
  }

  function inferTargetFromText(text) {
    const value = safeText(text).toLowerCase();

    if (/\b(where should i start|help me choose|guide me|not sure where|where do i begin)\b/.test(value)) return TARGETS.SPLIT_INTERFACE;
    if (/\btraditional|website|site guide|public map|compass\b/.test(value)) return TARGETS.TRADITIONAL_WEBSITE;
    if (/\bnarrative|story|world|mirrorland|walk\b/.test(value)) return TARGETS.NARRATIVE_PATH;
    if (/\bmission|meaning|purpose|why\b/.test(value)) return TARGETS.MISSION_OVERVIEW;
    if (/\bpractical|use|products|real world|value\b/.test(value)) return TARGETS.PRACTICAL_RELEVANCE;
    if (/\btrust|proof|scientific|law|evidence|measurement\b/.test(value)) return TARGETS.SCIENTIFIC_LAW;
    if (/\bdiagnostic|assess|score|type me|archetype|which character\b/.test(value)) return TARGETS.DIAGNOSTIC_REFERRAL;
    if (/\bcharacter mirror|characters\b/.test(value)) return TARGETS.CHARACTER_MIRROR;
    if (/\bhearth\b/.test(value)) return TARGETS.HEARTH;
    if (/\bfrontier|energy|water|waste|infrastructure|closed loop\b/.test(value)) return TARGETS.FRONTIER;
    if (/\bsean|creator\b/.test(value)) return TARGETS.SEAN;
    if (/\bunderdog\b/.test(value)) return TARGETS.UNDERDOG;
    if (/\brecenter|start over|beginning|return\b/.test(value)) return TARGETS.RECENTER;

    return state.sourceTarget || state.currentNode || TARGETS.SPLIT_INTERFACE;
  }

  function inferRequestModeFromText(text) {
    const value = safeText(text).toLowerCase();

    if (/\brecenter|start over|beginning|return\b/.test(value)) return REQUEST_MODES.RECENTER;
    if (/\bopen|go to|take me to|launch|enter\b/.test(value)) return REQUEST_MODES.ROUTE_EXPLANATION;
    if (/\barchetype|character|diagnostic|type me|score me|assess me\b/.test(value)) return REQUEST_MODES.CHARACTER_ARCHETYPE;

    return REQUEST_MODES.FREEFORM;
  }

  function inferPromptModeFromText(text, target) {
    const value = safeText(text).toLowerCase();

    if (/\btrust|proof|scientific|evidence|measurement|law\b/.test(value)) return PROMPT_MODES.SKEPTIC;
    if (/\bpractical|use|real world|product|system|frontier\b/.test(value)) return PROMPT_MODES.PRACTICAL;
    if (/\bself|me|mission|meaning|diagnostic|archetype|character\b/.test(value)) return PROMPT_MODES.PERSONAL;
    if (/\brecenter|start over|return\b/.test(value)) return PROMPT_MODES.RECENTER;
    if (/\bdeeper|continue|next|show me more\b/.test(value)) return PROMPT_MODES.PROGRESSION;

    return inferPromptModeFromTarget(target);
  }

  function inferPromptModeFromTarget(target) {
    const clean = normalizeTarget(target);

    if (clean === TARGETS.SCIENTIFIC_LAW || clean === TARGETS.LAWS) return PROMPT_MODES.SKEPTIC;
    if (clean === TARGETS.PRACTICAL_RELEVANCE || clean === TARGETS.PRODUCTS || clean === TARGETS.FRONTIER) return PROMPT_MODES.PRACTICAL;
    if (clean === TARGETS.MISSION_OVERVIEW || clean === TARGETS.MISSION_INNER || clean === TARGETS.MISSION_COMMUNITY || clean === TARGETS.DIAGNOSTIC_REFERRAL || clean === TARGETS.DIAGNOSTIC || clean === TARGETS.UNDERDOG) return PROMPT_MODES.PERSONAL;
    if (clean === TARGETS.RECENTER || clean === TARGETS.CLEAN_DOOR || clean === TARGETS.RETURN_FORK || clean === TARGETS.RESTART_FORK) return PROMPT_MODES.RECENTER;

    return PROMPT_MODES.STORY;
  }

  function inferMovementIntentFromText(text) {
    const value = safeText(text).toLowerCase();

    if (/\brecenter|start over|beginning|return\b/.test(value)) return MOVEMENT_INTENTS.RECENTER;
    if (/\bdeeper|dig deeper|more detail|one layer deeper|show me more|continue\b/.test(value)) return MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH;
    if (/\bopen|go to|take me to|launch|enter\b/.test(value)) return MOVEMENT_INTENTS.OPEN_PREPARED_DOOR;
    if (/\bconnect|bridge|related path|related room|other side\b/.test(value)) return MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM;

    return MOVEMENT_INTENTS.ASK_JEEVES;
  }

  function inferArchetypeAlignment(promptMode, target) {
    const mode = safeText(promptMode);
    const clean = normalizeTarget(target);

    if (mode === PROMPT_MODES.SKEPTIC || clean === TARGETS.SCIENTIFIC_LAW || clean === TARGETS.LAWS) return "proof_entry";
    if (mode === PROMPT_MODES.PRACTICAL || clean === TARGETS.PRACTICAL_RELEVANCE || clean === TARGETS.FRONTIER || clean === TARGETS.PRODUCTS) return "practical_entry";
    if (mode === PROMPT_MODES.PERSONAL || clean === TARGETS.MISSION_OVERVIEW || clean === TARGETS.DIAGNOSTIC_REFERRAL || clean === TARGETS.UNDERDOG) return "personal_entry";
    if (clean === TARGETS.SEAN) return "source_entry";
    if (clean === TARGETS.RECENTER) return "unknown_entry";

    return "story_entry";
  }

  function inferLaneFromTarget(target) {
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

    if (clean === TARGETS.TRADITIONAL_WEBSITE || clean === TARGETS.TRADITIONAL_COMPASS || clean === TARGETS.PRODUCTS || clean === TARGETS.LAWS || clean === TARGETS.SCIENTIFIC_LAW || clean === TARGETS.SEAN) return "traditional";

    return "objective";
  }

  function inferStageFromTarget(target, option) {
    const clean = normalizeTarget(target);
    const movement = safeText(option && option.movementIntent);
    const entryStackMode = safeText(option && option.entryStackMode);

    if (clean === TARGETS.SPLIT_INTERFACE) return "split_interface_gate";
    if (movement === MOVEMENT_INTENTS.RECENTER || entryStackMode === ENTRY_STACK_MODES.RETURN) return "return_fork";
    if (movement === MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH || entryStackMode === ENTRY_STACK_MODES.DIG_DEEPER) return "dig_deeper_threshold";
    if (movement === MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM || entryStackMode === ENTRY_STACK_MODES.PATH_SAMPLE) return "cross_path_bridge";
    if (movement === MOVEMENT_INTENTS.OPEN_PREPARED_DOOR || entryStackMode === ENTRY_STACK_MODES.PREPARED_DOOR) return "prepared_door";
    if (clean === TARGETS.DIAGNOSTIC_REFERRAL || clean === TARGETS.DIAGNOSTIC || clean === TARGETS.CHARACTER_MIRROR) return "diagnostic_boundary";
    if (clean === TARGETS.DIAMOND_GATE_OVERVIEW) return "entrance_overview";

    return "base_pool";
  }

  function inferEntryStackModeForPayload(target, payload) {
    const clean = normalizeTarget(target);
    const source = payload && typeof payload === "object" ? payload : {};
    const movement = safeText(source.movementIntent);
    const kind = safeText(source.optionKind);

    if (source.entryStackMode && !(clean !== TARGETS.SPLIT_INTERFACE && source.entryStackMode === ENTRY_STACK_MODES.GUIDED_CHOOSER)) return safeText(source.entryStackMode);
    if (clean === TARGETS.SPLIT_INTERFACE) return ENTRY_STACK_MODES.GUIDED_CHOOSER;
    if (movement === MOVEMENT_INTENTS.RECENTER || kind === OPTION_KINDS.CONTROL || clean === TARGETS.RECENTER) return ENTRY_STACK_MODES.RETURN;
    if (movement === MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH || kind === OPTION_KINDS.FORWARD) return ENTRY_STACK_MODES.DIG_DEEPER;
    if (movement === MOVEMENT_INTENTS.OPEN_PREPARED_DOOR || kind === OPTION_KINDS.ROUTE) return ENTRY_STACK_MODES.PREPARED_DOOR;
    if (movement === MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM || kind === OPTION_KINDS.PARALLEL) return ENTRY_STACK_MODES.PATH_SAMPLE;

    return ENTRY_STACK_MODES.BASE_POOL;
  }

  function inferBasePoolModeForPayload(target, payload) {
    const clean = normalizeTarget(target);
    const source = payload && typeof payload === "object" ? payload : {};

    if (source.basePoolMode && !(clean !== TARGETS.SPLIT_INTERFACE && source.basePoolMode === BASE_POOL_MODES.GUIDED_CHOOSER)) return safeText(source.basePoolMode);

    if (clean === TARGETS.DIAMOND_GATE_OVERVIEW) return BASE_POOL_MODES.ESTATE_OVERVIEW;
    if (clean === TARGETS.SPLIT_INTERFACE) return BASE_POOL_MODES.GUIDED_CHOOSER;
    if (clean === TARGETS.TRADITIONAL_WEBSITE || clean === TARGETS.TRADITIONAL_COMPASS) return BASE_POOL_MODES.PUBLIC_MAP;
    if (clean === TARGETS.NARRATIVE_PATH) return BASE_POOL_MODES.NARRATIVE_PATH;
    if (clean === TARGETS.MISSION_OVERVIEW) return BASE_POOL_MODES.MISSION;
    if (clean === TARGETS.MISSION_INNER) return BASE_POOL_MODES.INNER_MISSION;
    if (clean === TARGETS.MISSION_COMMUNITY) return BASE_POOL_MODES.COMMUNITY_MISSION;
    if (clean === TARGETS.MISSION_COLLABORATION) return BASE_POOL_MODES.COLLABORATION_MISSION;
    if (clean === TARGETS.PRACTICAL_RELEVANCE || clean === TARGETS.PRODUCTS) return BASE_POOL_MODES.PRACTICAL;
    if (clean === TARGETS.SCIENTIFIC_LAW || clean === TARGETS.LAWS) return BASE_POOL_MODES.PROOF;
    if (clean === TARGETS.DIAGNOSTIC_REFERRAL || clean === TARGETS.DIAGNOSTIC) return BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY;
    if (clean === TARGETS.CHARACTER_MIRROR) return BASE_POOL_MODES.CHARACTER_MIRROR;
    if (clean === TARGETS.MIRRORLAND) return BASE_POOL_MODES.MIRRORLAND;
    if (clean === TARGETS.HEARTH) return BASE_POOL_MODES.HEARTH;
    if (clean === TARGETS.FRONTIER) return BASE_POOL_MODES.FRONTIER;
    if (clean === TARGETS.CHARACTERS) return BASE_POOL_MODES.CHARACTERS;
    if (clean === TARGETS.SEAN) return BASE_POOL_MODES.CREATOR;
    if (clean === TARGETS.UNDERDOG) return BASE_POOL_MODES.UNDERDOG;
    if (clean === TARGETS.RECENTER || clean === TARGETS.CLEAN_DOOR || clean === TARGETS.RETURN_FORK || clean === TARGETS.RESTART_FORK) return BASE_POOL_MODES.RETURN;

    return BASE_POOL_MODES.NONE;
  }

  function inferIlluminationModeForPayload(target, payload) {
    const source = payload && typeof payload === "object" ? payload : {};
    if (source.illuminationMode) return safeText(source.illuminationMode);

    const basePoolMode = source.basePoolMode || inferBasePoolModeForPayload(target, source);

    if (basePoolMode === BASE_POOL_MODES.RETURN) return ILLUMINATION_MODES.RETURN;
    if (basePoolMode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || basePoolMode === BASE_POOL_MODES.CHARACTER_MIRROR) return ILLUMINATION_MODES.DIAGNOSTIC_BOUNDARY;
    if (basePoolMode === BASE_POOL_MODES.PROOF) return ILLUMINATION_MODES.PROOF;
    if (basePoolMode === BASE_POOL_MODES.PRACTICAL || basePoolMode === BASE_POOL_MODES.FRONTIER || basePoolMode === BASE_POOL_MODES.COLLABORATION_MISSION) return ILLUMINATION_MODES.PRACTICAL;
    if (basePoolMode === BASE_POOL_MODES.GUIDED_CHOOSER) return ILLUMINATION_MODES.THRESHOLD;

    if ([
      BASE_POOL_MODES.NARRATIVE_PATH,
      BASE_POOL_MODES.MISSION,
      BASE_POOL_MODES.INNER_MISSION,
      BASE_POOL_MODES.COMMUNITY_MISSION,
      BASE_POOL_MODES.MIRRORLAND,
      BASE_POOL_MODES.HEARTH,
      BASE_POOL_MODES.CHARACTERS,
      BASE_POOL_MODES.UNDERDOG
    ].includes(basePoolMode)) return ILLUMINATION_MODES.NARRATIVE;

    return ILLUMINATION_MODES.PUBLIC;
  }

  function buildChoiceClosureForTarget(target, payload, basePoolMode) {
    const clean = normalizeTarget(target);
    const mode = basePoolMode || inferBasePoolModeForPayload(clean, payload);
    const closure = {
      preparedDoorAvailable: true,
      preparedDoorSuggested: false,
      digDeeperAvailable: true,
      returnForkAvailable: true,
      finalChatThreshold: false,
      mode
    };

    if (clean === TARGETS.SPLIT_INTERFACE || mode === BASE_POOL_MODES.GUIDED_CHOOSER) {
      closure.preparedDoorAvailable = false;
      closure.digDeeperAvailable = false;
      closure.returnForkAvailable = false;
    }

    if (mode === BASE_POOL_MODES.DIAGNOSTIC_BOUNDARY || clean === TARGETS.DIAGNOSTIC_REFERRAL) {
      closure.finalChatThreshold = true;
    }

    if (mode === BASE_POOL_MODES.RETURN) {
      closure.preparedDoorAvailable = false;
      closure.digDeeperAvailable = false;
      closure.returnForkAvailable = true;
    }

    if (payload && typeof payload === "object" && isPreparedDoorOption(payload)) {
      closure.preparedDoorSuggested = true;
    }

    return closure;
  }

  function buildAllowedRouteFamilies(selectedTarget) {
    const target = normalizeTarget(selectedTarget);
    const families = {};

    Object.keys(ROUTE_FAMILIES).forEach(function eachFamily(key) {
      if (
        key === target ||
        target === TARGETS.SPLIT_INTERFACE ||
        target === TARGETS.DIAMOND_GATE_OVERVIEW
      ) {
        families[key] = ROUTE_FAMILIES[key].slice();
      }
    });

    if (!Object.keys(families).length && ROUTE_FAMILIES[target]) {
      families[target] = ROUTE_FAMILIES[target].slice();
    }

    return families;
  }

  function buildAllowedRoutes(selectedTarget, allowedRouteFamilies) {
    const target = normalizeTarget(selectedTarget);
    const routes = [];
    const families = allowedRouteFamilies && typeof allowedRouteFamilies === "object"
      ? allowedRouteFamilies
      : buildAllowedRouteFamilies(target);

    Object.keys(families).forEach(function eachFamily(key) {
      families[key].forEach(function addRoute(route) {
        if (ROUTE_HREFS[route]) routes.push(route);
      });
    });

    if (TARGET_ROUTE_HINTS[target]) {
      TARGET_ROUTE_HINTS[target].forEach(function addHint(route) {
        if (ROUTE_HREFS[route]) routes.push(route);
      });
    }

    return dedupeStrings(routes).slice(0, 16);
  }

  function buildAllowedTargets(selectedTarget) {
    const target = normalizeTarget(selectedTarget);
    const targets = [
      TARGETS.SPLIT_INTERFACE,
      TARGETS.TRADITIONAL_WEBSITE,
      TARGETS.PRACTICAL_RELEVANCE,
      TARGETS.NARRATIVE_PATH,
      TARGETS.MISSION_OVERVIEW,
      TARGETS.SCIENTIFIC_LAW,
      target
    ];

    if (target === TARGETS.MISSION_OVERVIEW) {
      targets.push(TARGETS.MISSION_INNER, TARGETS.MISSION_COMMUNITY, TARGETS.MISSION_COLLABORATION);
    }

    if (target === TARGETS.DIAGNOSTIC_REFERRAL || target === TARGETS.CHARACTER_MIRROR) {
      targets.push(TARGETS.DIAGNOSTIC, TARGETS.CHARACTER_MIRROR, TARGETS.DIAGNOSTIC_REFERRAL);
    }

    return dedupeStrings(targets).filter(Boolean);
  }

  function buildBridgeContext(input) {
    const source = input && typeof input === "object" ? input : {};
    const selectedTarget = normalizeTarget(source.selectedTarget || "");
    const sourceTarget = normalizeTarget(source.sourceTarget || selectedTarget || "");
    const activeTarget = normalizeTarget(source.activeTarget || selectedTarget || sourceTarget || "");

    return {
      currentNode: state.currentNode,
      priorNode: normalizeTarget(source.priorNode || state.currentNode || ""),
      priorLane: safeText(source.priorLane || state.currentEntryLane || ""),
      priorTopic: safeText(state.currentTopic || ""),
      selectedTarget,
      sourceTarget,
      activeTarget,
      selectedLabel: safeText(source.selectedLabel || ""),
      promptMode: safeText(source.promptMode || ""),
      optionKind: safeText(source.optionKind || ""),
      archetypeAlignment: safeText(source.archetypeAlignment || ""),
      bridgeMoment: safeText(source.bridgeMoment || ""),
      movementIntent: safeText(source.movementIntent || ""),
      currentTopic: safeText(source.currentTopic || state.currentTopic || ""),
      currentScopeStage: safeText(state.currentConversationStage || ""),
      adjacentTarget: normalizeTarget(source.adjacentTarget || ""),
      adjacentLabel: safeText(source.adjacentLabel || ""),
      adjacentReason: safeText(source.adjacentReason || "")
    };
  }

  function inferAdjacentTarget(target) {
    const clean = normalizeTarget(target);

    if (clean === TARGETS.TRADITIONAL_WEBSITE) return TARGETS.NARRATIVE_PATH;
    if (clean === TARGETS.NARRATIVE_PATH) return TARGETS.TRADITIONAL_WEBSITE;
    if (clean === TARGETS.PRODUCTS) return TARGETS.FRONTIER;
    if (clean === TARGETS.FRONTIER) return TARGETS.PRODUCTS;
    if (clean === TARGETS.LAWS) return TARGETS.SCIENTIFIC_LAW;
    if (clean === TARGETS.SCIENTIFIC_LAW) return TARGETS.LAWS;
    if (clean === TARGETS.SEAN) return TARGETS.UNDERDOG;
    if (clean === TARGETS.UNDERDOG) return TARGETS.SEAN;
    if (clean === TARGETS.CHARACTER_MIRROR) return TARGETS.DIAGNOSTIC_REFERRAL;
    if (clean === TARGETS.DIAGNOSTIC_REFERRAL) return TARGETS.CHARACTER_MIRROR;
    if (clean === TARGETS.MIRRORLAND) return TARGETS.TRADITIONAL_WEBSITE;

    return "";
  }

  function inferBridgeReason(fromTarget, toTarget, option) {
    const from = normalizeTarget(fromTarget);
    const to = normalizeTarget(toTarget);
    const movement = safeText(option && option.movementIntent);

    if (from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.NARRATIVE_PATH) return "public website structure into the narrative path";
    if (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE) return "narrative path back to public website structure";
    if (to === TARGETS.MISSION_OVERVIEW || /^mission/.test(to)) return "mission lane";
    if (to === TARGETS.PRACTICAL_RELEVANCE || to === TARGETS.FRONTIER || to === TARGETS.PRODUCTS) return "practical";
    if (to === TARGETS.DIAGNOSTIC_REFERRAL || to === TARGETS.DIAGNOSTIC || to === TARGETS.CHARACTER_MIRROR) return "diagnostic boundary";
    if (movement === MOVEMENT_INTENTS.CROSS_TO_RELATED_ROOM) return "parallel bridge";
    return "";
  }

  function getConversationHistory() {
    if (!state.transcriptEl) return [];

    const bubbles = Array.prototype.slice.call(state.transcriptEl.querySelectorAll("[data-jeeves-bubble]"));
    return bubbles.slice(-12).map(function mapBubble(node) {
      return {
        role: node.getAttribute("data-jeeves-bubble") || "assistant",
        text: safeText(node.textContent || "")
      };
    });
  }

  function isDigDeeperOption(option) {
    const source = option && typeof option === "object" ? option : {};
    const label = safeText(source.label || source.visitorText || "").toLowerCase();

    return source.entryStackMode === ENTRY_STACK_MODES.DIG_DEEPER ||
      source.movementIntent === MOVEMENT_INTENTS.CONTINUE_CURRENT_PATH ||
      source.optionKind === OPTION_KINDS.FORWARD ||
      source.gateType === "dig_deeper" ||
      /\b(deeper|dig deeper|one layer deeper|more detail)\b/.test(label);
  }

  function isDigDeeperText(text) {
    return /\b(deeper|dig deeper|one layer deeper|more detail|go further|show me more|continue)\b/i.test(safeText(text));
  }

  function isReturnForkOption(option) {
    const source = option && typeof option === "object" ? option : {};
    const label = safeText(source.label || source.visitorText || "").toLowerCase();

    return source.entryStackMode === ENTRY_STACK_MODES.RETURN ||
      source.movementIntent === MOVEMENT_INTENTS.RECENTER ||
      source.optionKind === OPTION_KINDS.CONTROL ||
      source.gateType === "return_fork" ||
      /\b(return|recenter|start over|guided chooser|beginning)\b/.test(label);
  }

  function isPreparedDoorOption(option) {
    const source = option && typeof option === "object" ? option : {};
    const label = safeText(source.label || source.visitorText || "").toLowerCase();

    return source.entryStackMode === ENTRY_STACK_MODES.PREPARED_DOOR ||
      source.movementIntent === MOVEMENT_INTENTS.OPEN_PREPARED_DOOR ||
      source.optionKind === OPTION_KINDS.ROUTE ||
      source.gateType === "prepared_door" ||
      /\b(open|go to|take me to|launch|enter)\b/.test(label);
  }

  function makeOption(label, target, promptMode, archetypeAlignment, bridgeMoment, movementIntent, scopeLane, entryStackMode, basePoolMode, illuminationMode) {
    const normalizedTarget = normalizeTarget(target);
    const sourceTarget = normalizedTarget;
    const activeTarget = normalizedTarget;
    const sanitizedModes = sanitizeModesForSource(sourceTarget, {
      entryStackMode,
      basePoolMode,
      illuminationMode
    }, {
      label,
      promptMode,
      archetypeAlignment,
      bridgeMoment,
      movementIntent,
      optionKind: OPTION_KINDS.CONVERSATION_PROMPT
    });

    const coordinate = buildProvisionalCoordinate(sourceTarget, {
      label,
      promptMode,
      archetypeAlignment,
      bridgeMoment,
      movementIntent,
      optionKind: OPTION_KINDS.CONVERSATION_PROMPT,
      sourceTarget,
      activeTarget
    }, {
      entryStackMode: sanitizedModes.entryStackMode,
      basePoolMode: sanitizedModes.basePoolMode,
      illuminationMode: sanitizedModes.illuminationMode,
      sourceTarget,
      activeTarget
    });

    return {
      label,
      target: normalizedTarget,
      sourceTarget,
      activeTarget,
      type: "conversation",
      scopeLane,
      promptMode,
      optionKind: OPTION_KINDS.CONVERSATION_PROMPT,
      archetypeAlignment,
      bridgeMoment,
      movementIntent,
      entryStackMode: sanitizedModes.entryStackMode,
      basePoolMode: sanitizedModes.basePoolMode,
      illuminationMode: sanitizedModes.illuminationMode,
      conversationCoordinate: coordinate,
      gateType: coordinate.gate,
      pathFamily: coordinate.path,
      dialectMode: coordinate.dialect,
      contextExpectation: coordinate.expectation,
      noRepeat: coordinate.noRepeat
    };
  }

  function syncRootCoordinateAttrs() {
    if (!state.root) return;

    state.root.setAttribute("data-selected-target", state.selectedTarget || "");
    state.root.setAttribute("data-source-target", state.sourceTarget || "");
    state.root.setAttribute("data-active-target", state.activeTarget || "");
    state.root.setAttribute("data-source-stability-active", "true");

    state.root.setAttribute("data-entry-stack-mode", state.entryStackMode || "");
    state.root.setAttribute("data-base-pool-mode", state.basePoolMode || "");
    state.root.setAttribute("data-illumination-mode", state.illuminationMode || "");
    state.root.setAttribute("data-gate-type", state.gateType || "");
    state.root.setAttribute("data-path-family", state.pathFamily || "");
    state.root.setAttribute("data-dialect-mode", state.dialectMode || "");
    state.root.setAttribute("data-context-expectation", state.contextExpectation || "");
    state.root.setAttribute("data-no-repeat", state.noRepeat ? "true" : "false");

    if (state.conversationCoordinate && typeof state.conversationCoordinate === "object") {
      state.root.setAttribute("data-coordinate-step", String(state.conversationCoordinate.step || ""));
      state.root.setAttribute("data-coordinate-gate", state.conversationCoordinate.gate || "");
      state.root.setAttribute("data-coordinate-path", state.conversationCoordinate.path || "");
      state.root.setAttribute("data-coordinate-mode", state.conversationCoordinate.mode || "");
      state.root.setAttribute("data-coordinate-source-target", state.conversationCoordinate.sourceTarget || "");
      state.root.setAttribute("data-coordinate-active-target", state.conversationCoordinate.activeTarget || "");
      state.root.setAttribute("data-coordinate-target", state.conversationCoordinate.target || "");
    }
  }

  function dispatchReady() {
    if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("hearth:jeeves-ready", {
        detail: {
          contract: CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          rootFrontbrainContract: ROOT_FRONTBRAIN_CONTRACT,
          version: VERSION,
          expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
          expressionContractNext: EXPRESSION_CONTRACT_NEXT,
          apiContractTarget: API_CONTRACT_TARGET,
          previousApiContractTarget: API_CONTRACT_PREVIOUS,
          entryStackCompatible: true,
          basePoolCompatible: true,
          illuminationCompatible: true,
          coordinateCarrierCompatible: true,
          sourceIdentityCarrierCompatible: true,
          sourceStabilityLaw: SOURCE_STABILITY_LAW,
          userTurnRendering: true,
          readingRhythmAuthority: "frontbrain",
          sourceIdentityAuthority: "frontbrain"
        }
      }));
    }
  }

  function dispatchPreparedDoor(routeId, href) {
    if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("hearth:jeeves-prepared-door", {
        detail: {
          contract: CONTRACT,
          routeId,
          href,
          selectedTarget: state.selectedTarget || "",
          sourceTarget: state.sourceTarget || "",
          activeTarget: routeId,
          entryStackMode: ENTRY_STACK_MODES.PREPARED_DOOR,
          movementIntent: MOVEMENT_INTENTS.OPEN_PREPARED_DOOR,
          gateType: "prepared_door",
          pathFamily: state.pathFamily || "",
          contextExpectation: "page_visit",
          noRepeat: true,
          sourceStabilityLaw: SOURCE_STABILITY_LAW,
          conversationCoordinate: {
            step: 21,
            priorStep: state.conversationCoordinate ? state.conversationCoordinate.step || 5 : 5,
            gate: "prepared_door",
            path: state.pathFamily || "",
            mode: state.basePoolMode || "",
            dialect: state.dialectMode || "",
            expectation: "page_visit",
            sourceTarget: state.sourceTarget || "",
            activeTarget: routeId,
            target: state.selectedTarget || state.currentNode || "",
            destination: routeId,
            next: ["return"],
            noRepeat: true
          }
        }
      }));
    }
  }

  function pushUnique(list, value, max) {
    const clean = safeText(value);
    if (!clean || !Array.isArray(list)) return;
    const index = list.indexOf(clean);
    if (index >= 0) list.splice(index, 1);
    list.push(clean);
    trimArray(list, max || 32);
  }

  function trimArray(list, max) {
    if (!Array.isArray(list)) return;
    while (list.length > max) list.shift();
  }

  function dedupeStrings(values) {
    const seen = new Set();
    const result = [];

    (Array.isArray(values) ? values : []).forEach(function each(value) {
      const clean = safeText(value);
      if (!clean || seen.has(clean)) return;
      seen.add(clean);
      result.push(clean);
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
    rootFrontbrainContract: ROOT_FRONTBRAIN_CONTRACT,
    version: VERSION,

    expressionContractTarget: EXPRESSION_CONTRACT_TARGET,
    expressionContractNext: EXPRESSION_CONTRACT_NEXT,
    apiContractTarget: API_CONTRACT_TARGET,
    previousApiContractTarget: API_CONTRACT_PREVIOUS,

    sourceStabilityLaw: SOURCE_STABILITY_LAW,
    targets: TARGETS,
    routes: ROUTES,
    routeHrefs: ROUTE_HREFS,
    routeFamilies: ROUTE_FAMILIES,

    entryStackModes: ENTRY_STACK_MODES,
    basePoolModes: BASE_POOL_MODES,
    illuminationModes: ILLUMINATION_MODES,

    readingRhythm: Object.freeze({
      authority: "frontbrain",
      baseMs: READ_BASE_MS,
      perCharMs: READ_PER_CHAR_MS,
      maxMs: READ_MAX_MS,
      tapToSpeed: true,
      listeningState: "frontbrain",
      typingState: "frontbrain",
      protectedCopyAuthority: "expression",
      sourceIdentityAuthority: "frontbrain"
    }),

    mount: mountHearthJeeves,
    send: handleFreeform,
    reset: function reset() {
      if (!state.root) return;
      state.initialized = false;
      state.currentConversationStage = "entrance_overview";
      state.currentEntryLane = "entrance";
      state.lastLane = "";
      state.currentNode = TARGETS.DIAMOND_GATE_OVERVIEW;
      state.currentPath = TARGETS.DIAMOND_GATE_OVERVIEW;
      state.currentTopic = "entrance";
      state.currentScopeLane = "objective";
      state.selectedTarget = TARGETS.DIAMOND_GATE_OVERVIEW;
      state.sourceTarget = TARGETS.DIAMOND_GATE_OVERVIEW;
      state.activeTarget = TARGETS.DIAMOND_GATE_OVERVIEW;
      state.entryStackMode = ENTRY_STACK_MODES.ENTRANCE;
      state.basePoolMode = BASE_POOL_MODES.ESTATE_OVERVIEW;
      state.illuminationMode = ILLUMINATION_MODES.THRESHOLD;
      state.choiceClosure = null;
      state.conversationCoordinate = cloneCoordinate(START_COORDINATE);
      state.gateType = "arrival";
      state.pathFamily = "center";
      state.dialectMode = "estate_host";
      state.contextExpectation = "universal_entry";
      state.noRepeat = false;
      state.selectedTargets = [];
      state.selectedOptionKeys = [];
      state.visitedNodes = [];
      state.sessionTrail = [];
      state.transitionTrail = [];
      state.branchStack = [];
      state.returnStack = [];
      state.lastBridgeContext = null;
      state.lastResponse = null;
      state.lastError = null;
      clearRevealTimer();
      ensureShell();
      bindEvents();
      bootConversation();
    },
    speed: advanceReveal,
    getState: function getState() {
      return {
        contract: CONTRACT,
        version: VERSION,
        mounted: state.mounted,
        busy: state.busy,
        currentConversationStage: state.currentConversationStage,
        currentEntryLane: state.currentEntryLane,
        lastLane: state.lastLane,
        currentNode: state.currentNode,
        currentPath: state.currentPath,
        currentTopic: state.currentTopic,
        currentScopeLane: state.currentScopeLane,
        selectedTarget: state.selectedTarget,
        sourceTarget: state.sourceTarget,
        activeTarget: state.activeTarget,
        entryStackMode: state.entryStackMode,
        basePoolMode: state.basePoolMode,
        illuminationMode: state.illuminationMode,
        choiceClosure: state.choiceClosure,
        conversationCoordinate: state.conversationCoordinate,
        gateType: state.gateType,
        pathFamily: state.pathFamily,
        dialectMode: state.dialectMode,
        contextExpectation: state.contextExpectation,
        noRepeat: state.noRepeat,
        sourceStabilityLaw: SOURCE_STABILITY_LAW,
        lastBridgeContext: state.lastBridgeContext,
        lastResponse: state.lastResponse,
        lastError: state.lastError ? String(state.lastError.message || state.lastError) : "",
        lastSuccessfulEndpoint: state.lastSuccessfulEndpoint,
        readingRhythmAuthority: "frontbrain",
        sourceIdentityAuthority: "frontbrain",
        coordinateCarrierAuthority: "frontbrain"
      };
    },

    buildApiPayload,
    buildAllowedRouteFamilies,
    buildAllowedRoutes,
    buildBridgeContext,
    buildProvisionalCoordinate,
    inferEntryStackModeForPayload,
    inferBasePoolModeForPayload,
    inferIlluminationModeForPayload,
    normalizeOption,
    normalizeCoordinate,
    resolveOptionSourcePacket,
    resolveFreeformSourcePacket,
    sanitizeModesForSource,
    ensureCoordinateSourceIdentity
  });

  global.mountHearthJeeves = mountHearthJeeves;
  global.mountJeeves = mountHearthJeeves;
  global.HEARTH_JEEVES_FRONTBRAIN = api;

  global.HEARTH = global.HEARTH || {};
  global.HEARTH.jeevesFrontbrain = api;

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function onReady() {
      mountHearthJeeves();
    });
  } else {
    mountHearthJeeves();
  }
})(typeof window !== "undefined" ? window : globalThis);
