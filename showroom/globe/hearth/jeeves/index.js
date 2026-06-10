// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_HEARTH_MISSION_CONTROL_WINDOW_WITHIN_WINDOW_API_V3_TNT_v20
// Full-file replacement.
// Browser frontbrain authority.
// Owns: visible Jeeves runtime, Hearth Mission Control location frame,
// DOM hooks, message rendering, prompt rendering, house-listening state,
// Jeeves-typing state, tap-to-rush beat pacing, room state, option progression,
// visited-option memory, Character sequence gating, character-profile routing,
// return-stack cleanup, origin/prior-topic return behavior, route handoff rendering,
// API v3 guard, API v3 response-field preservation, and final visible route authority.
// Consumes: /assets/hearth/jeeves/jeeves.expression.js
// Consumes: /api/jeeves.js
// Assumes: Expression contract will be renewed next and will preserve cooperative
// option metadata while owning final public voice.
// Does not own: CSS, server-side model execution, API keys, persistent memory,
// server-side moderation, final backbrain canon storage, or final public voice.
//

(function hearthJeevesFrontbrainHearthMissionControlWindowWithinWindowApiV3(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_HEARTH_MISSION_CONTROL_WINDOW_WITHIN_WINDOW_API_V3_TNT_v20";
  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var DEFAULT_BRAIN_ENDPOINT = "/api/jeeves.js";
  var DEFAULT_START_NODE = "intro";
  var DEFAULT_ROOM_ID = "hearthMissionControl";

  var ACTIVE_HOST_PAGE = "hearthJeeves";
  var CURRENT_ROOM_CONTEXT = "hearth";
  var CURRENT_ROOM_ROLE = "mission_control";
  var CURRENT_ROOM_PREMISE = "window_within_the_window";
  var ESTATE_KNOWLEDGE_MODE = "blueprint_reference";
  var PORTAL_LOGIC = "estate_window_to_unknown_future_potential";
  var ROUTE_AUTHORITY = "frontbrain_remains_final_authority";
  var LIVE_PAGE_ACCESS = ["hearthJeeves"];
  var PLANNED_LIVE_PAGE_ACCESS = ["compass"];

  var CHARACTER_TARGETS = {
    characterAurenValePath: "aurenVale",
    characterDextrionPath: "dextrion",
    characterAlaricPath: "alaric",
    characterTarianPath: "tarian",
    characterElaraPath: "elara",
    characterSorenPath: "soren",
    characterJeevesPath: "jeeves",
    characterRemoteTeamPath: "remoteTeam"
  };

  var CHARACTER_NAMES = {
    aurenVale: "Auren Vale",
    dextrion: "Dextrion",
    alaric: "Alaric",
    tarian: "Tarian",
    elara: "Elara",
    soren: "Soren",
    jeeves: "Jeeves",
    remoteTeam: "Remote Team"
  };

  var CHARACTER_RESULTS = {
    protect: {
      characterId: "aurenVale",
      title: "Auren Vale — Sanctuary Builder",
      line: "You tend to protect first. Under pressure, you look for who needs shelter, what must be guarded, and what cannot be exposed too early."
    },
    repair: {
      characterId: "dextrion",
      title: "Dextrion — Earth-Side Originator",
      line: "You tend to repair first. Under pressure, you look for the break, the responsibility, and the fastest way to make the system whole again."
    },
    warn: {
      characterId: "alaric",
      title: "Alaric — Field Navigator",
      line: "You tend to read danger first. Under pressure, you notice what is forming before everyone else has enough proof to believe it."
    },
    endure: {
      characterId: "tarian",
      title: "Tarian — Water Anchor",
      line: "You tend to endure first. Under pressure, you carry the physical reality of the situation and try to keep the body, the field, or the people moving."
    },
    signal: {
      characterId: "elara",
      title: "Elara — Signal Bearer",
      line: "You tend to signal first. Under pressure, you try to make the future visible enough that people can move toward it."
    },
    boundary: {
      characterId: "soren",
      title: "Soren — Boundary Keeper",
      line: "You tend to name the hidden cost first. Under pressure, you look for the contradiction, the boundary, and the damage people are trying not to see."
    },
    sequence: {
      characterId: "jeeves",
      title: "Jeeves — Manor Interface",
      line: "You tend to sequence first. Under pressure, you look for the right order, the clean next door, and the amount of truth the moment can hold."
    },
    distribute: {
      characterId: "remoteTeam",
      title: "Remote Team — Distributed Response Unit",
      line: "You tend to distribute responsibility first. Under pressure, you think about who needs help beyond the safe center and how survival reaches them."
    }
  };

  var ROUTE_HREFS = {
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
    frontier: "/explore/frontier/",
    characters: "/characters/",
    book: "/nine-summits-of-love/",
    nineSummits: "/nine-summits/",
    aboutUnderdog: "/about-this-underdog/"
  };

  var LOCAL_TARGET_ALIASES = {
    worldPath: "mirrorlandPath",
    worldGatePath: "atriumPath",
    characterMirrorPath: "characterArchetypeMirrorPath",
    characterMirrorQuestionOne: "characterArchetypeQuestionOne",
    characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
    characterMirrorQuestionThree: "characterArchetypeQuestionThree",
    characterMirrorResult: "characterArchetypeResult",
    characterFactionsPath: "characterRelationshipsPath",
    humanSourcePath: "seanPath",
    creatorPath: "seanPath",
    creatorSourcePath: "seanPath",
    missionControlPath: "hearthPath",
    hearthMissionControlPath: "hearthPath"
  };

  var REPEATABLE_TARGETS = {
    cleanDoor: true,
    sharpQuestion: true,
    switchTopics: true,
    recenterNode: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturn: true,
    priorTopicReturnPath: true,
    originReturn: true,
    originReturnPath: true,
    mirrorlandPath: true,
    atriumPath: true,
    characterArchetypeMirrorPath: true,
    selfLearningPath: true,
    diagnosticPath: true,
    compassPath: true,
    siteGuidePath: true,
    websitePath: true,
    charactersPath: true,
    hearthPath: true
  };

  var CONTROL_TARGETS = {
    cleanDoor: true,
    sharpQuestion: true,
    switchTopics: true,
    recenterNode: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturn: true,
    priorTopicReturnPath: true,
    originReturn: true,
    originReturnPath: true
  };

  var NO_STACK_TARGETS = {
    cleanDoor: true,
    sharpQuestion: true,
    switchTopics: true,
    recenterNode: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturn: true,
    priorTopicReturnPath: true,
    originReturn: true,
    originReturnPath: true
  };

  var CRITICAL_OPTION_FIELDS = [
    "target",
    "type",
    "value",
    "signal",
    "scopeLane",
    "cardinal",
    "coordinateName",
    "placeType",
    "roomId",
    "route",
    "href",
    "skipReturnPush",
    "restoreRoomId",
    "optionKind",
    "disabled",
    "visited",
    "handoff",
    "routeId"
  ];

  var state = {
    contract: CONTRACT,
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

    initialized: false,
    currentNode: DEFAULT_START_NODE,
    currentRoomId: DEFAULT_ROOM_ID,
    currentRoomName: "Hearth Mission Control",
    currentCoordinateName: "Window Within the Window",
    currentCardinal: "E",
    currentPlaceType: "mission-control",
    currentTopic: "origin",

    originNode: DEFAULT_START_NODE,
    originConversation: "First Fork",
    originAnchor: "firstFork",
    priorNode: "",
    priorTopic: "",
    priorTopicName: "",
    lastStableNode: DEFAULT_START_NODE,

    returnStack: [],
    branchStack: [],
    topicStack: [],
    visitorTrail: [],
    roomTrail: [],

    visitedNodes: Object.create(null),
    selectedOptionKeys: Object.create(null),
    selectedTargets: Object.create(null),
    selectedTargetsByRoom: Object.create(null),
    selectedLabelsByRoom: Object.create(null),

    characterOverviewDone: false,
    characterProfileViews: Object.create(null),
    characterProfileViewCount: 0,
    characterRelationshipViews: 0,
    characterLoopCount: 0,
    characterCompletionReady: false,
    characterCompletionPromptShown: false,
    characterArchetypeAnswers: [],

    pendingPriorReturn: null,
    pendingOriginReturn: false,

    isRendering: false,
    isTyping: false,
    houseListening: false,
    rushActive: false,
    rushRequestedAt: 0,
    beatQueue: [],
    currentBeatIndex: -1,
    typingTimer: null,
    typingResolve: null,
    lastInteractionAt: 0,

    optionSerial: 0,
    currentOptions: [],
    currentHandoffs: [],

    lastBackbrainFrame: null,
    lastFibonacciDepth: "",
    lastFibonacciStage: null,
    lastRouteHints: null,
    lastBackbrainAuthorities: null,
    lastApiContract: "",
    lastApiDepthMode: "",
    lastApiResponseAt: 0
  };

  var els = {
    root: null,
    thread: null,
    typing: null,
    promptDock: null,
    promptGrid: null,
    handoffDock: null,
    handoffGrid: null,
    status: null,
    statusText: null,
    input: null,
    form: null,
    send: null,
    messageTemplate: null,
    optionTemplate: null,
    routeOptionTemplate: null
  };

  function getExpression() {
    return (
      global.HEARTH &&
      (
        global.HEARTH.JEEVES_EXPRESSION ||
        (global.HEARTH.JEEVES && global.HEARTH.JEEVES.expression)
      )
    ) || global.JEEVES_EXPRESSION || null;
  }

  function normalizeTarget(target) {
    var clean = String(target || "").trim();
    var expr = getExpression();

    if (expr && typeof expr.normalizeTarget === "function") {
      return expr.normalizeTarget(clean);
    }

    return LOCAL_TARGET_ALIASES[clean] || clean;
  }

  function sanitize(text, context) {
    var expr = getExpression();
    var clean = String(text || "");

    if (expr && typeof expr.sanitizePublicText === "function") {
      return expr.sanitizePublicText(clean, context || createContext());
    }

    clean = clean.replace(/\bthe world side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld gate\b/gi, "South Gate");
    clean = clean.replace(/\bCharacter Mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bcharacter mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bwhich character am I most like\b/gi, "which Character Archetype do I follow under pressure");
    clean = clean.replace(/\bwhich character fits my pressure\b/gi, "which Character Archetype do I follow under pressure");
    clean = clean.replace(/\bpressure pattern\b/gi, "behavior under pressure");
    clean = clean.replace(/\bthe Mirrorland\b/gi, "Mirrorland");
    clean = clean.replace(/\bIntroduce me to the human source\b/g, "Meet the creator behind all of this");
    clean = clean.replace(/\bhuman source\b/gi, "creator behind the estate");
    clean = clean.replace(/\s{2,}/g, " ");

    return clean.trim();
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function keysOf(map) {
    if (!map) return [];
    return Object.keys(map).filter(function keepKey(key) {
      return !!key;
    });
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function ensureDom() {
    els.root = qs("[data-jeeves-root]") || qs(".jeeves-root") || document.body;

    els.root.setAttribute("data-frontbrain-contract", CONTRACT);
    els.root.setAttribute("data-jeeves-host-page", ACTIVE_HOST_PAGE);
    els.root.setAttribute("data-current-room-context", CURRENT_ROOM_CONTEXT);
    els.root.setAttribute("data-current-room-role", CURRENT_ROOM_ROLE);
    els.root.setAttribute("data-current-room-premise", CURRENT_ROOM_PREMISE);
    els.root.setAttribute("data-jeeves-live-access", LIVE_PAGE_ACCESS.join(" "));
    els.root.setAttribute("data-jeeves-estate-knowledge", ESTATE_KNOWLEDGE_MODE);
    els.root.setAttribute("data-route-authority", ROUTE_AUTHORITY);

    els.thread =
      byId("jeevesThread") ||
      qs("[data-jeeves-thread]") ||
      qs(".jeeves-thread");

    if (!els.thread) {
      els.thread = document.createElement("div");
      els.thread.id = "jeevesThread";
      els.thread.className = "jeeves-thread";
      els.thread.setAttribute("data-jeeves-thread", "true");
      els.root.appendChild(els.thread);
    }

    els.thread.setAttribute("data-tap-to-rush", "true");

    els.typing =
      qs("[data-jeeves-typing]") ||
      qs(".jeeves-typing");

    if (!els.typing) {
      els.typing = document.createElement("div");
      els.typing.className = "jeeves-typing";
      els.typing.setAttribute("data-jeeves-typing", "false");
      els.typing.textContent = "The house is listening.";
      els.root.appendChild(els.typing);
    }

    els.promptDock =
      qs(".jeeves-prompt-dock") ||
      qs("[data-jeeves-prompt-dock]");

    if (!els.promptDock) {
      els.promptDock = document.createElement("section");
      els.promptDock.className = "jeeves-prompt-dock";
      els.promptDock.setAttribute("data-jeeves-prompt-dock", "true");
      els.root.appendChild(els.promptDock);
    }

    els.promptGrid =
      qs(".jeeves-prompt-grid", els.promptDock) ||
      qs("[data-jeeves-prompt-grid]", els.promptDock);

    if (!els.promptGrid) {
      els.promptGrid = document.createElement("div");
      els.promptGrid.className = "jeeves-prompt-grid";
      els.promptGrid.setAttribute("data-jeeves-prompt-grid", "true");
      els.promptDock.appendChild(els.promptGrid);
    }

    els.handoffDock =
      qs(".jeeves-handoff-dock") ||
      qs("[data-jeeves-handoff-dock]");

    if (!els.handoffDock) {
      els.handoffDock = document.createElement("section");
      els.handoffDock.className = "jeeves-handoff-dock";
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      els.handoffDock.setAttribute("data-jeeves-handoff-dock", "true");
      els.root.appendChild(els.handoffDock);
    }

    els.handoffGrid =
      qs(".jeeves-handoff-grid", els.handoffDock) ||
      qs("[data-jeeves-handoff-grid]", els.handoffDock);

    if (!els.handoffGrid) {
      els.handoffGrid = document.createElement("div");
      els.handoffGrid.className = "jeeves-handoff-grid";
      els.handoffGrid.setAttribute("data-jeeves-handoff-grid", "true");
      els.handoffDock.appendChild(els.handoffGrid);
    }

    els.status = qs("[data-jeeves-status]");
    els.statusText = qs("[data-jeeves-status-text]");

    els.form =
      qs("[data-jeeves-form]") ||
      byId("jeevesForm") ||
      qs(".jeeves-form");

    els.input =
      qs("[data-jeeves-input]") ||
      byId("jeevesInput") ||
      qs(".jeeves-input") ||
      qs("textarea[name='jeeves']") ||
      qs("input[name='jeeves']");

    els.send =
      qs("[data-jeeves-send]") ||
      byId("jeevesSend") ||
      qs(".jeeves-send");

    els.messageTemplate = byId("jeevesMessageTemplate");
    els.optionTemplate = byId("jeevesOptionTemplate");
    els.routeOptionTemplate = byId("jeevesRouteOptionTemplate");
  }

  function setStatus(text) {
    var value = sanitize(text || "", createContext());

    if (els.status) {
      els.status.setAttribute("data-jeeves-status", value || "ready");
    }

    if (els.statusText) {
      els.statusText.textContent = value || "Ready";
    }
  }

  function setHouseListening(isListening) {
    state.houseListening = !!isListening;

    if (els.root) {
      els.root.setAttribute("data-house-listening", state.houseListening ? "true" : "false");
      els.root.setAttribute("data-room-state", state.houseListening ? "listening" : state.isTyping ? "typing" : "ready");
    }

    if (els.typing && state.houseListening && !state.isTyping) {
      els.typing.textContent = "The house is listening.";
      els.typing.setAttribute("data-house-listening", "true");
    }

    if (state.houseListening) {
      setStatus("The house is listening.");
    }
  }

  function setTyping(isTyping) {
    state.isTyping = !!isTyping;

    if (els.typing) {
      els.typing.setAttribute("data-jeeves-typing", state.isTyping ? "true" : "false");
      els.typing.setAttribute("data-house-listening", state.houseListening ? "true" : "false");
      els.typing.textContent = state.isTyping ? "Jeeves is typing." : "The house is listening.";
    }

    if (els.root) {
      els.root.setAttribute("data-jeeves-typing", state.isTyping ? "true" : "false");
      els.root.setAttribute("data-house-listening", state.houseListening ? "true" : "false");
      els.root.setAttribute("data-room-state", state.isTyping ? "typing" : state.houseListening ? "listening" : "ready");
    }

    if (state.isTyping) {
      setStatus("Jeeves is typing.");
    }
  }

  function clearTypingTimer() {
    if (state.typingTimer) {
      global.clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }
  }

  function requestRush() {
    if (!state.isRendering && !state.isTyping) return false;

    state.rushActive = true;
    state.rushRequestedAt = Date.now();

    clearTypingTimer();

    if (typeof state.typingResolve === "function") {
      var resolve = state.typingResolve;
      state.typingResolve = null;
      resolve(true);
    }

    return true;
  }

  function createContext(extra) {
    var expr = getExpression();
    var room = null;
    var ctx = extra || {};

    if (expr && typeof expr.getCurrentRoom === "function") {
      room = expr.getCurrentRoom({
        currentRoomId: state.currentRoomId,
        currentNode: state.currentNode,
        target: ctx.target || state.currentNode
      });
    }

    room = room || {
      id: state.currentRoomId,
      canonicalName: state.currentRoomName,
      coordinateName: state.currentCoordinateName,
      cardinal: state.currentCardinal,
      placeType: state.currentPlaceType
    };

    return {
      contract: CONTRACT,
      frontbrainContract: CONTRACT,
      expressionContract: expr ? expr.contract : "",
      cssContract: global.__HEARTH_JEEVES_CSS_CONTRACT__ || "",
      apiContract: state.lastApiContract || "",
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
      currentRoomId: state.currentRoomId,
      currentRoomName: room.canonicalName || state.currentRoomName,
      currentCoordinateName: room.coordinateName || state.currentCoordinateName,
      currentCardinal: room.cardinal || state.currentCardinal,
      currentPlaceType: room.placeType || state.currentPlaceType,
      currentTopic: state.currentTopic,

      target: ctx.target || "",
      label: ctx.label || "",
      priorNode: state.priorNode,
      priorTopic: state.priorTopic,
      priorTopicName: state.priorTopicName,
      originNode: state.originNode,
      originConversation: state.originConversation,
      originAnchor: state.originAnchor,

      returnStackLength: state.returnStack.length,
      branchStack: clone(state.branchStack),
      returnStack: clone(state.returnStack),

      characterOverviewDone: state.characterOverviewDone,
      hasSeenCharacterOverview: state.characterOverviewDone,
      characterProfileViews: clone(state.characterProfileViews),
      characterProfileViewCount: state.characterProfileViewCount,
      characterRelationshipViews: state.characterRelationshipViews,
      characterLoopCount: state.characterLoopCount,
      characterCompletionReady: state.characterCompletionReady,
      characterCompletionPromptShown: state.characterCompletionPromptShown,
      characterArchetypeAnswers: clone(state.characterArchetypeAnswers),

      lastBackbrainFrame: clone(state.lastBackbrainFrame),
      lastFibonacciDepth: state.lastFibonacciDepth,
      lastFibonacciStage: clone(state.lastFibonacciStage),
      lastRouteHints: clone(state.lastRouteHints)
    };
  }

  function getTargetRoom(target) {
    var expr = getExpression();
    var normalized = normalizeTarget(target);

    if (expr && typeof expr.getRoomForTarget === "function") {
      return expr.getRoomForTarget(normalized);
    }

    return null;
  }

  function updateRoomFromTarget(target) {
    var room = getTargetRoom(target);

    if (!room) return;

    state.currentRoomId = room.id || state.currentRoomId;
    state.currentRoomName = room.canonicalName || room.name || state.currentRoomName;
    state.currentCoordinateName = room.coordinateName || state.currentCoordinateName;
    state.currentCardinal = room.cardinal || state.currentCardinal;
    state.currentPlaceType = room.placeType || state.currentPlaceType;
  }

  function topicFromTarget(target) {
    var normalized = normalizeTarget(target);

    if (normalized.indexOf("characterArchetype") === 0 || normalized === "selfLearningPath") return "characterArchetype";
    if (normalized.indexOf("character") === 0 || normalized === "charactersPath") return "characters";
    if (normalized.indexOf("scientificLaw") === 0 || normalized === "lawsPath" || normalized === "proofPath") return "proof";
    if (normalized.indexOf("frontier") === 0 || normalized === "hearthPath" || normalized === "audraliaPath") return "future";
    if (normalized === "mirrorlandPath" || normalized === "atriumPath" || normalized === "atlasPath" || normalized === "ziontsPath") return "mirrorland";
    if (normalized === "seanPath" || normalized === "underdogPath" || normalized === "nineSummitsPath") return "source";
    if (CONTROL_TARGETS[normalized]) return state.currentTopic || "origin";
    return "orientation";
  }

  function optionKey(option) {
    var roomId = option.roomId || state.currentRoomId || "firstFork";
    var target = normalizeTarget(option.target || "");
    var label = sanitize(option.label || "", createContext({ target: target }));

    return roomId + "::" + target + "::" + label;
  }

  function markOptionSelected(option) {
    var target = normalizeTarget(option.target || "");
    var roomId = option.roomId || state.currentRoomId || "firstFork";
    var label = sanitize(option.label || "", createContext({ target: target }));

    if (!target) return;

    state.selectedOptionKeys[optionKey(option)] = true;
    state.selectedTargets[target] = true;
    state.selectedTargetsByRoom[roomId] = state.selectedTargetsByRoom[roomId] || Object.create(null);
    state.selectedLabelsByRoom[roomId] = state.selectedLabelsByRoom[roomId] || Object.create(null);
    state.selectedTargetsByRoom[roomId][target] = true;
    state.selectedLabelsByRoom[roomId][label] = true;
  }

  function hasOptionBeenSelected(option) {
    var target = normalizeTarget(option.target || "");
    var roomId = option.roomId || state.currentRoomId || "firstFork";
    var label = sanitize(option.label || "", createContext({ target: target }));

    if (state.selectedOptionKeys[optionKey(option)]) return true;
    if (CHARACTER_TARGETS[target] && state.characterProfileViews[CHARACTER_TARGETS[target]]) return true;
    if (target === "characterIdentityPath" && state.characterOverviewDone) return true;
    if (state.selectedTargetsByRoom[roomId] && state.selectedTargetsByRoom[roomId][target]) return true;
    if (state.selectedLabelsByRoom[roomId] && state.selectedLabelsByRoom[roomId][label]) return true;

    return false;
  }

  function isRepeatableOption(option) {
    var target = normalizeTarget(option.target || "");

    if (!target) return true;
    if (REPEATABLE_TARGETS[target]) return true;
    if (CONTROL_TARGETS[target]) return true;
    if (option.type === "control") return true;

    return false;
  }

  function shouldDisableOption(option) {
    return hasOptionBeenSelected(option) && !isRepeatableOption(option);
  }

  function inferOptionKind(option) {
    var target = normalizeTarget(option && option.target || "");
    var type = option && option.type || "";

    if (type === "control" || CONTROL_TARGETS[target]) return "return";
    if (CHARACTER_TARGETS[target] || target === "charactersPath" || target === "characterIdentityPath" || target === "characterRelationshipsPath") return "character";
    if (target.indexOf("characterArchetype") === 0 || target === "selfLearningPath") return "character";
    if (target.indexOf("scientificLaw") === 0 || target === "lawsPath" || target === "proofPath" || target === "gaugesPath" || target === "diagnosticPath") return "proof";
    if (target === "mirrorlandPath" || target === "atriumPath" || target === "atlasPath" || target === "ziontsPath") return "mirror";
    if (target.indexOf("frontier") === 0 || target.indexOf("hearth") === 0 || target.indexOf("audralia") === 0) return "future";
    if (target === "seanPath") return "source";
    if (target === "underdogPath") return "underdog";
    if (target === "nineSummitsPath" || target === "bookPath") return "summit";
    if (target === "compassPath" || target === "siteGuidePath" || target === "websitePath") return "room";
    if (option && option.route) return "route";

    return "conversation";
  }

  function clearNodeChildren(node) {
    if (!node) return;

    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function hideInteractiveDocks() {
    if (els.promptDock) {
      els.promptDock.setAttribute("data-options-visible", "false");
    }

    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
    }
  }

  function appendMessage(origin, text, meta) {
    var message;
    var body;
    var safe = sanitize(text, createContext(meta || {}));

    if (!safe) return null;

    if (els.messageTemplate && els.messageTemplate.content) {
      message = els.messageTemplate.content.firstElementChild.cloneNode(true);
      body =
        qs("[data-jeeves-message-body]", message) ||
        qs("[data-message-body]", message) ||
        qs(".jeeves-message-body", message) ||
        qs(".jeeves-message-text", message) ||
        message;
      body.textContent = safe;
    } else {
      message = document.createElement("article");
      message.className = "jeeves-message";
      body = document.createElement("p");
      body.className = "jeeves-message-body";
      body.textContent = safe;
      message.appendChild(body);
    }

    message.classList.add("jeeves-message");
    message.setAttribute("data-message-origin", origin || "jeeves");
    message.setAttribute("data-jeeves-message", "true");

    if (meta && meta.roomId) {
      message.setAttribute("data-message-room", meta.roomId);
    }

    if (meta && meta.coordinateName) {
      message.setAttribute("data-message-coordinate", meta.coordinateName);
    }

    els.thread.appendChild(message);
    els.thread.scrollTop = els.thread.scrollHeight;

    return message;
  }

  function appendVisitorMessage(text) {
    return appendMessage("visitor", text, createContext());
  }

  function appendSystemMessage(text) {
    return appendMessage("system", text, createContext());
  }

  function makeButtonFromTemplate(option) {
    var node;
    var labelNode;

    if (els.optionTemplate && els.optionTemplate.content) {
      node = els.optionTemplate.content.firstElementChild.cloneNode(true);
    } else {
      node = document.createElement("button");
      node.type = "button";
      node.className = "jeeves-option";
    }

    node.classList.add("jeeves-option");

    labelNode =
      qs("[data-jeeves-option-label]", node) ||
      qs("[data-option-label]", node) ||
      qs(".jeeves-option-label", node) ||
      node;

    labelNode.textContent = option.label;

    return node;
  }

  function preserveCriticalOptionFields(original, shaped) {
    var source = original || {};
    var next = shaped || {};

    CRITICAL_OPTION_FIELDS.forEach(function preserveField(field) {
      if (source[field] !== undefined && next[field] === undefined) {
        next[field] = source[field];
      }
    });

    next.target = normalizeTarget(next.target || source.target || "");
    next.type = next.type || source.type || "conversation";
    next.scopeLane = next.scopeLane || source.scopeLane || "objective";
    next.signal = next.signal || source.signal || "";
    next.cardinal = next.cardinal || source.cardinal || "";
    next.coordinateName = next.coordinateName || source.coordinateName || "";
    next.placeType = next.placeType || source.placeType || "";
    next.roomId = next.roomId || source.roomId || "";
    next.optionKind = next.optionKind || inferOptionKind(next);
    next.label = sanitize(next.label || source.label || "Continue.", createContext({ target: next.target }));

    return next;
  }

  function shapeOptions(options, meta) {
    var expr = getExpression();
    var original = (options || []).map(function cloneOption(option) {
      var next = clone(option || {});
      next.target = normalizeTarget(next.target || "");
      next.optionKind = next.optionKind || inferOptionKind(next);
      return next;
    });
    var shaped;
    var ctx = createContext(meta || {});

    if (expr && typeof expr.shapeOptions === "function") {
      shaped = expr.shapeOptions(original, ctx) || [];
    } else {
      shaped = original.map(function fallbackOption(option) {
        return {
          label: sanitize(option.label || "Continue.", ctx),
          target: normalizeTarget(option.target || ""),
          type: option.type || "conversation",
          scopeLane: option.scopeLane || "objective",
          signal: option.signal || "",
          cardinal: option.cardinal || "",
          coordinateName: option.coordinateName || "",
          placeType: option.placeType || "",
          roomId: option.roomId || "",
          optionKind: option.optionKind || inferOptionKind(option)
        };
      });
    }

    return shaped.map(function mergeShapedOption(option, index) {
      return preserveCriticalOptionFields(original[index], clone(option || {}));
    });
  }

  function renderOptions(options, meta) {
    var shaped = shapeOptions(options || [], meta || {});
    var visible = [];

    state.currentOptions = [];
    clearNodeChildren(els.promptGrid);

    shaped.forEach(function eachOption(option) {
      var normalized = normalizeTarget(option.target || "");

      if (!normalized) return;
      if (normalized === "characterIdentityPath" && state.characterOverviewDone) return;
      if (option.label === "Who are the Characters?" && state.characterOverviewDone) return;

      visible.push(option);
    });

    visible.forEach(function drawOption(option) {
      var button = makeButtonFromTemplate(option);
      var target = normalizeTarget(option.target || "");
      var visited = option.visited !== undefined ? !!option.visited : hasOptionBeenSelected(option);
      var disabled = option.disabled !== undefined ? !!option.disabled : shouldDisableOption(option);
      var serial = "jeeves-option-" + (++state.optionSerial);
      var kind = option.optionKind || inferOptionKind(option);

      option.target = target;
      option.optionKind = kind;
      option.__serial = serial;
      option.__visited = visited;
      option.__disabled = disabled;

      button.setAttribute("data-jeeves-option", "true");
      button.setAttribute("data-option-id", serial);
      button.setAttribute("data-option-target", target);
      button.setAttribute("data-option-type", option.type || "conversation");
      button.setAttribute("data-option-kind", kind);
      button.setAttribute("data-option-signal", option.signal || "");
      button.setAttribute("data-option-scope-lane", option.scopeLane || "objective");
      button.setAttribute("data-option-cardinal", option.cardinal || "");
      button.setAttribute("data-option-coordinate", option.coordinateName || "");
      button.setAttribute("data-option-place-type", option.placeType || "");
      button.setAttribute("data-option-room-id", option.roomId || "");
      button.setAttribute("data-option-visited", visited ? "true" : "false");
      button.setAttribute("data-option-disabled", disabled ? "true" : "false");
      button.setAttribute("data-option-active", "false");
      button.setAttribute("aria-disabled", disabled ? "true" : "false");

      if (disabled) {
        button.disabled = true;
        button.setAttribute("tabindex", "-1");
        button.title = "Already visited";
      } else {
        button.addEventListener("click", function onOptionClick(event) {
          event.preventDefault();
          event.stopPropagation();

          if (state.isRendering || state.isTyping) {
            requestRush();
            return;
          }

          button.setAttribute("data-option-active", "true");
          handleOption(option);
        });
      }

      state.currentOptions.push(option);
      els.promptGrid.appendChild(button);
    });

    els.promptDock.setAttribute("data-options-visible", visible.length ? "true" : "false");

    return visible;
  }

  function resolveRouteHref(routeId) {
    var route = String(routeId || "").trim();

    if (state.lastRouteHints && state.lastRouteHints[route]) {
      return state.lastRouteHints[route];
    }

    return ROUTE_HREFS[route] || "#";
  }

  function makeRouteButton(routeId, label) {
    var route = String(routeId || "").trim();
    var href = resolveRouteHref(route);
    var expr = getExpression();
    var safeLabel = label || route;
    var link;

    if (expr && typeof expr.shapeRouteLabel === "function") {
      safeLabel = expr.shapeRouteLabel(route, safeLabel);
    }

    if (els.routeOptionTemplate && els.routeOptionTemplate.content) {
      link = els.routeOptionTemplate.content.firstElementChild.cloneNode(true);
      var labelNode =
        qs("[data-jeeves-route-label]", link) ||
        qs("[data-route-label]", link) ||
        qs(".jeeves-route-label", link) ||
        link;
      labelNode.textContent = sanitize(safeLabel, createContext());
    } else {
      link = document.createElement("a");
      link.className = "jeeves-route-option";
      link.textContent = sanitize(safeLabel, createContext());
    }

    link.setAttribute("href", href);
    link.setAttribute("data-route-id", route);
    link.setAttribute("data-jeeves-route-option", "true");
    link.setAttribute("data-option-kind", "route");

    return link;
  }

  function renderHandoffs(handoffs, labels) {
    var list = (handoffs || []).filter(Boolean);

    state.currentHandoffs = list.slice();
    clearNodeChildren(els.handoffGrid);

    if (!list.length) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      return;
    }

    list.forEach(function eachRoute(routeId) {
      els.handoffGrid.appendChild(makeRouteButton(routeId, labels && labels[routeId]));
    });

    els.handoffDock.setAttribute("data-handoff-visible", "true");
  }

  function applyExpression(node, meta) {
    var expr = getExpression();
    var next = clone(node || {});
    var originalOptions = clone(next.options || []);
    var ctx = createContext(meta || {});

    if (expr && typeof expr.applyToNode === "function") {
      next = expr.applyToNode(next, ctx) || next;
      if (next.options && originalOptions && originalOptions.length) {
        next.options = (next.options || []).map(function mergeNodeOptions(option, index) {
          return preserveCriticalOptionFields(originalOptions[index], clone(option || {}));
        });
      }
    } else {
      next.beats = (next.beats || []).map(function cleanBeat(beat) {
        return sanitize(beat, ctx);
      });
      next.options = shapeOptions(next.options || [], ctx);
    }

    return next;
  }

  function buildOriginNode() {
    var expr = getExpression();
    var origin;

    if (expr && typeof expr.makeOriginIntro === "function") {
      origin = expr.makeOriginIntro(createContext({ target: "intro" }));
      return {
        id: "intro",
        roomId: "firstFork",
        topic: "origin",
        beats: origin.beats,
        options: origin.options,
        handoffs: [],
        markStable: true
      };
    }

    return {
      id: "intro",
      roomId: "firstFork",
      topic: "origin",
      beats: [
        "Welcome. I’m Jeeves.",
        "I’m currently stationed in Hearth Mission Control — the window within the window.",
        "Mirrorland opens the future-facing field. Hearth gives us the inner control view, where we can observe, coordinate, and route unknown future potential through the estate’s portal logic.",
        "I know the estate by its blueprint. I do not pretend to be stationed inside every page at once. For now, this is my live room."
      ],
      options: [
        { label: "Show me the blueprint.", target: "siteGuidePath", optionKind: "room" },
        { label: "Start with the proof side.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Help me choose where to begin.", target: "cleanDoor", type: "control", optionKind: "return" }
      ],
      handoffs: [],
      markStable: true
    };
  }

  function buildOrientationNode() {
    return {
      id: "compassPath",
      roomId: "compassDesk",
      topic: "orientation",
      beats: [
        "The Compass is the estate’s orientation room.",
        "It belongs north because this is where the visitor learns how the estate is organized before choosing a deeper road.",
        "From Hearth Mission Control, I can point toward the proof side, the future-facing rooms, Mirrorland, or the creator path without confusing the map for the whole estate."
      ],
      options: [
        { label: "Show me how the rooms relate.", target: "siteGuidePath", optionKind: "room" },
        { label: "Start with the proof side.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Show me the future-facing rooms.", target: "frontierPath", optionKind: "future" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["compass"],
      markStable: true
    };
  }

  function buildSiteGuideNode() {
    return {
      id: "siteGuidePath",
      roomId: "guideDesk",
      topic: "orientation",
      beats: [
        "The Guide Desk is the estate’s map hall.",
        "It does not only list rooms. It explains why certain rooms sit close together.",
        "Proof rooms gather on the western side. Future systems gather on the eastern side. Mirrorland, Characters, Audralia, and ZIONTS gather toward the southern world-window. Hearth Mission Control coordinates the inner view from this live chamber."
      ],
      options: [
        { label: "Show me the proof side of the estate.", target: "lawsPath", optionKind: "proof" },
        { label: "Show me the future-facing rooms.", target: "frontierPath", optionKind: "future" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["siteGuide"],
      markStable: true
    };
  }

  function buildScientificLawNode(target) {
    var id = normalizeTarget(target || "scientificLawPath");

    if (id === "scientificLawTheoryPath") {
      return simpleSubNode(id, "scientificLaw", "proof", [
        "Theory is the room where a claim becomes organized enough to test.",
        "It is not proof by itself. It is the shape of the question before evidence enters."
      ], [
        { label: "Tell me about Evidence.", target: "scientificLawEvidencePath", optionKind: "proof" },
        { label: "Tell me about Measure.", target: "scientificLawMeasurePath", optionKind: "proof" },
        { label: "Tell me about Limits.", target: "scientificLawLimitsPath", optionKind: "proof" },
        { label: "Return to Scientific Law.", target: "scientificLawPath", optionKind: "proof" }
      ]);
    }

    if (id === "scientificLawEvidencePath") {
      return simpleSubNode(id, "scientificLaw", "proof", [
        "Evidence is the room where the claim meets something outside the claim.",
        "A claim cannot become scientific only by sounding technical. It needs contact with observable reality."
      ], [
        { label: "Tell me about Theory.", target: "scientificLawTheoryPath", optionKind: "proof" },
        { label: "Tell me about Measure.", target: "scientificLawMeasurePath", optionKind: "proof" },
        { label: "Tell me about Limits.", target: "scientificLawLimitsPath", optionKind: "proof" },
        { label: "Return to Scientific Law.", target: "scientificLawPath", optionKind: "proof" }
      ]);
    }

    if (id === "scientificLawMeasurePath") {
      return simpleSubNode(id, "scientificLaw", "proof", [
        "Measure is where the claim becomes accountable.",
        "If nothing can be measured, compared, calibrated, or checked, then the claim may still be interesting, but it is not yet standing in the proof chamber."
      ], [
        { label: "Tell me about Theory.", target: "scientificLawTheoryPath", optionKind: "proof" },
        { label: "Tell me about Evidence.", target: "scientificLawEvidencePath", optionKind: "proof" },
        { label: "Tell me about Limits.", target: "scientificLawLimitsPath", optionKind: "proof" },
        { label: "Return to Scientific Law.", target: "scientificLawPath", optionKind: "proof" }
      ]);
    }

    if (id === "scientificLawLimitsPath") {
      return simpleSubNode(id, "scientificLaw", "proof", [
        "Limits keep the claim honest.",
        "A serious claim says where it applies, where it may fail, what it does not explain, and what would force it to change."
      ], [
        { label: "Tell me about Theory.", target: "scientificLawTheoryPath", optionKind: "proof" },
        { label: "Tell me about Evidence.", target: "scientificLawEvidencePath", optionKind: "proof" },
        { label: "Tell me about Measure.", target: "scientificLawMeasurePath", optionKind: "proof" },
        { label: "Return to Scientific Law.", target: "scientificLawPath", optionKind: "proof" }
      ]);
    }

    return {
      id: "scientificLawPath",
      roomId: "scientificLaw",
      topic: "proof",
      beats: [
        "Scientific Law is the estate’s Reality Test.",
        "It belongs to the western proof side because every future-facing claim has to survive definition, evidence, measurement, correction, and limits before it can be trusted.",
        "That matters inside Hearth Mission Control because a window into future potential still needs proof boundaries. Seeing possibility is not the same as proving it."
      ],
      options: [
        { label: "Tell me about Theory.", target: "scientificLawTheoryPath", optionKind: "proof" },
        { label: "Tell me about Evidence.", target: "scientificLawEvidencePath", optionKind: "proof" },
        { label: "Tell me about Measure.", target: "scientificLawMeasurePath", optionKind: "proof" },
        { label: "Tell me about Limits.", target: "scientificLawLimitsPath", optionKind: "proof" },
        { label: "Show me the status room.", target: "gaugesPath", optionKind: "proof" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["scientificLaw", "laws", "gauges"],
      markStable: true
    };
  }

  function buildFrontierNode(target) {
    var id = normalizeTarget(target || "frontierPath");
    var labelMap = {
      frontierEnergyPath: ["Energy", "Energy tests how a future system can hold, convert, distribute, and protect power without pretending that impossible shortcuts are already solved."],
      frontierWaterPath: ["Water", "Water tests survival at the body, city, and world level. It belongs near Tarian’s pressure because no future matters if life cannot continue physically."],
      frontierWastePath: ["Waste", "Waste tests whether hidden cost is being pushed out of view. It belongs near Soren’s pressure because denied damage becomes consequence."],
      frontierClosedLoopPath: ["Closed Loop", "Closed Loop tests whether a system can reduce loss, reuse what it can, and stop exporting its damage into another room."],
      frontierInfrastructurePath: ["Infrastructure", "Infrastructure tests whether the future can be carried by roads, buildings, logistics, energy, water, and people at scale."],
      frontierLatticePath: ["Lattice", "Lattice tests how many small structured parts can become a coherent operating field."],
      frontierUrbanPath: ["Urban", "Urban tests how future systems become livable inside public space, not only inside a lab."],
      frontierManualPath: ["Manual", "Manual tests whether the system can be taught, repeated, operated, and corrected by real people."],
      frontierShimmerPath: ["Shimmer", "Shimmer tests visibility, signal, perception, and the way a future appears before everyone understands it."],
      frontierTrajectoryPath: ["Trajectory", "Trajectory tests direction over time: what happens if this path continues, bends, or fails to correct itself."],
      frontierVisionPath: ["Vision", "Vision tests what kind of future is being made visible and whether it can survive contact with proof."]
    };

    if (labelMap[id]) {
      return simpleSubNode(id, "frontier", "future", [
        labelMap[id][0] + " is one of Frontier’s future-system rooms.",
        labelMap[id][1]
      ], [
        { label: "Show me the future systems.", target: "frontierSystemsPath", optionKind: "future" },
        { label: "Show why Frontier needs proof.", target: "frontierLawPath", optionKind: "proof" },
        { label: "Show who carries Frontier pressure.", target: "frontierCharactersPath", optionKind: "character" },
        { label: "Return to Frontier.", target: "frontierPath", optionKind: "future" }
      ], ["frontier"]);
    }

    if (id === "frontierSystemsPath") {
      return {
        id: id,
        roomId: "frontier",
        topic: "future",
        beats: [
          "Frontier’s systems are the future-facing test rooms.",
          "Energy, Water, Waste, Closed Loop, Infrastructure, Lattice, Urban, Manual, Shimmer, Trajectory, and Vision are not decorations. They are the practical questions a future world would have to answer."
        ],
        options: [
          { label: "Tell me about Energy.", target: "frontierEnergyPath", optionKind: "future" },
          { label: "Tell me about Water.", target: "frontierWaterPath", optionKind: "future" },
          { label: "Tell me about Waste.", target: "frontierWastePath", optionKind: "future" },
          { label: "Tell me about Closed Loop.", target: "frontierClosedLoopPath", optionKind: "future" },
          { label: "Tell me about Infrastructure.", target: "frontierInfrastructurePath", optionKind: "future" },
          { label: "Tell me about Lattice.", target: "frontierLatticePath", optionKind: "future" },
          { label: "Tell me about Urban.", target: "frontierUrbanPath", optionKind: "future" },
          { label: "Tell me about Manual.", target: "frontierManualPath", optionKind: "future" },
          { label: "Tell me about Shimmer.", target: "frontierShimmerPath", optionKind: "future" },
          { label: "Tell me about Trajectory.", target: "frontierTrajectoryPath", optionKind: "future" },
          { label: "Tell me about Vision.", target: "frontierVisionPath", optionKind: "future" }
        ],
        handoffs: ["frontier"],
        markStable: true
      };
    }

    if (id === "frontierLawPath") {
      return simpleSubNode(id, "frontier", "future", [
        "Frontier sits near the proof rooms because future systems can become dangerous if they are only imagined and never tested.",
        "Scientific Law keeps Frontier from becoming fantasy without correction."
      ], [
        { label: "Show me how claims are tested.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Return to Frontier.", target: "frontierPath", optionKind: "future" }
      ], ["frontier", "scientificLaw"]);
    }

    if (id === "frontierCharactersPath") {
      return simpleSubNode(id, "frontier", "future", [
        "The Characters carry Frontier pressure because systems become human when someone must survive inside them.",
        "Dextrion carries repair. Tarian carries water and endurance. Soren carries hidden cost. Alaric carries trajectory and warning. Elara carries signal and visibility."
      ], [
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Return to Frontier.", target: "frontierPath", optionKind: "future" }
      ], ["frontier", "characters"]);
    }

    return {
      id: "frontierPath",
      roomId: "frontier",
      topic: "future",
      beats: [
        "Frontier is the estate’s eastern testing yard.",
        "It belongs to the future-facing side because this is where future systems are tested before they are treated as real.",
        "From Hearth Mission Control, Frontier is not just a page. It is the test range for the potential seen through the window within the window."
      ],
      options: [
        { label: "Show me the future systems.", target: "frontierSystemsPath", optionKind: "future" },
        { label: "Show why Frontier needs proof.", target: "frontierLawPath", optionKind: "proof" },
        { label: "Show who carries Frontier pressure.", target: "frontierCharactersPath", optionKind: "character" },
        { label: "Show me Hearth Mission Control.", target: "hearthPath", optionKind: "future" },
        { label: "Show me Audralia.", target: "audraliaPath", optionKind: "future" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["frontier"],
      markStable: true
    };
  }

  function buildMirrorlandNode(target) {
    var id = normalizeTarget(target || "mirrorlandPath");

    if (id === "atriumPath") {
      return simpleSubNode(id, "atrium", "mirrorland", [
        "The Atrium is the southern threshold.",
        "It exists because Mirrorland should not be entered like a flat page. The visitor crosses into a world-window."
      ], [
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Show me the Mirrorland map.", target: "atlasPath", optionKind: "mirror" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Return to the First Fork.", target: "returnFork", type: "control", optionKind: "return" }
      ], ["showroom", "mirrorland"]);
    }

    if (id === "atlasPath") {
      return simpleSubNode(id, "atlasStudy", "mirrorland", [
        "The Atlas Study is the map hall for Mirrorland.",
        "It sits near Audralia and ZIONTS because the future window contains both possibility and consequence."
      ], [
        { label: "Show me Audralia.", target: "audraliaPath", optionKind: "future" },
        { label: "Show me the consequence road.", target: "ziontsPath", optionKind: "mirror" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" }
      ], ["mirrorland", "audralia"]);
    }

    if (id === "ziontsPath") {
      return simpleSubNode(id, "zionts", "mirrorland", [
        "ZIONTS is the consequence road.",
        "It belongs southwest because consequence stays close to Mirrorland but carries warning, hidden cost, and the price of ignored damage."
      ], [
        { label: "Show me Audralia.", target: "audraliaPath", optionKind: "future" },
        { label: "Show me how claims are tested.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Return to the Mirrorland map.", target: "atlasPath", optionKind: "mirror" }
      ], ["mirrorland"]);
    }

    return {
      id: "mirrorlandPath",
      roomId: "mirrorland",
      topic: "mirrorland",
      beats: [
        "Mirrorland is the estate’s larger future-facing window.",
        "Hearth Mission Control is the window within that window: the inner control view where the future can be observed, routed, and coordinated before it becomes world, system, or consequence.",
        "The Characters are nearby because they are what make the window feel alive."
      ],
      options: [
        { label: "Take me through the threshold.", target: "atriumPath", optionKind: "mirror" },
        { label: "Show me the Mirrorland map.", target: "atlasPath", optionKind: "mirror" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Show me Audralia.", target: "audraliaPath", optionKind: "future" },
        { label: "Show me the consequence road.", target: "ziontsPath", optionKind: "mirror" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["mirrorland"],
      markStable: true
    };
  }

  function buildHearthNode(target) {
    var id = normalizeTarget(target || "hearthPath");

    if (id === "hearthFacilityPath") {
      return simpleSubNode(id, "hearth", "future", [
        "Hearth is Mission Control inside the estate.",
        "The unknown construct location is reached through the estate’s portal logic. Hearth does not claim to be that entire location; it gives the visitor and Jeeves the control window into it."
      ], [
        { label: "Explain Hearth as the window within the window.", target: "hearthConstructPath", optionKind: "future" },
        { label: "Show why Hearth is near Frontier.", target: "hearthFrontierPath", optionKind: "future" },
        { label: "Show why Hearth must answer to proof.", target: "hearthLawPath", optionKind: "proof" },
        { label: "Return to Hearth Mission Control.", target: "hearthPath", optionKind: "future" }
      ], ["hearth"]);
    }

    if (id === "hearthConstructPath") {
      return simpleSubNode(id, "hearth", "future", [
        "Hearth is the window within the window.",
        "Mirrorland reveals the future-facing field. Hearth gives the inner control view, where unknown future potential can be watched, coordinated, and routed before it becomes world, system, or consequence."
      ], [
        { label: "Show why Hearth is near Frontier.", target: "hearthFrontierPath", optionKind: "future" },
        { label: "Show why Hearth must answer to proof.", target: "hearthLawPath", optionKind: "proof" },
        { label: "Return to Hearth Mission Control.", target: "hearthPath", optionKind: "future" }
      ], ["hearth"]);
    }

    if (id === "hearthFrontierPath") {
      return simpleSubNode(id, "hearth", "future", [
        "Hearth sits near Frontier because a control window needs a test range.",
        "Frontier tests what future worlds need. Hearth coordinates the view of that potential from inside the estate."
      ], [
        { label: "Show me Frontier.", target: "frontierPath", optionKind: "future" },
        { label: "Show me Audralia.", target: "audraliaPath", optionKind: "future" },
        { label: "Return to Hearth Mission Control.", target: "hearthPath", optionKind: "future" }
      ], ["hearth", "frontier"]);
    }

    if (id === "hearthLawPath") {
      return simpleSubNode(id, "hearth", "future", [
        "Hearth must sit within reach of the proof rooms.",
        "A window into unknown future potential can reveal possibility, but it still needs definition, measurement, and limits before the estate treats it as trustworthy."
      ], [
        { label: "Show me how claims are tested.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Show me the status room.", target: "gaugesPath", optionKind: "proof" },
        { label: "Return to Hearth Mission Control.", target: "hearthPath", optionKind: "future" }
      ], ["hearth", "scientificLaw"]);
    }

    return {
      id: "hearthPath",
      roomId: "hearth",
      topic: "future",
      beats: [
        "Hearth is Mission Control.",
        "It is the window within the window: the inner estate control view into unknown future potential.",
        "From here, Jeeves can help observe, coordinate, and route what the future may become without pretending to be mounted in every room at once."
      ],
      options: [
        { label: "Explain Hearth as Mission Control.", target: "hearthFacilityPath", optionKind: "future" },
        { label: "Explain Hearth as the window within the window.", target: "hearthConstructPath", optionKind: "future" },
        { label: "Show why Hearth is near Frontier.", target: "hearthFrontierPath", optionKind: "future" },
        { label: "Show why Hearth must answer to proof.", target: "hearthLawPath", optionKind: "proof" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["hearth"],
      markStable: true
    };
  }

  function buildAudraliaNode(target) {
    var id = normalizeTarget(target || "audraliaPath");

    if (id === "audraliaWorldroomPath") {
      return simpleSubNode(id, "audraliaWorldroom", "future", [
        "The Audralia Worldroom is where the future world becomes visible enough to inspect.",
        "It sits close to Hearth Mission Control because seeing a possible world and coordinating its state belong together."
      ], [
        { label: "Show me how Audralia becomes readable.", target: "controlCockpitPath", optionKind: "future" },
        { label: "Show me Hearth Mission Control.", target: "hearthPath", optionKind: "future" },
        { label: "Return to Audralia.", target: "audraliaPath", optionKind: "future" }
      ], ["audralia"]);
    }

    if (id === "controlCockpitPath") {
      return simpleSubNode(id, "controlCockpit", "future", [
        "The Control Deck is where a future world becomes readable.",
        "A surface is not enough. The estate needs state, motion, controls, and proof of what the visitor is seeing."
      ], [
        { label: "Show me Audralia’s visible worldroom.", target: "audraliaWorldroomPath", optionKind: "future" },
        { label: "Show me the status room.", target: "gaugesPath", optionKind: "proof" },
        { label: "Return to Audralia.", target: "audraliaPath", optionKind: "future" }
      ], ["audralia", "gauges"]);
    }

    return {
      id: "audraliaPath",
      roomId: "audralia",
      topic: "future",
      beats: [
        "Audralia is the future world of constructive possibility.",
        "It belongs southeast because possibility has to move out of pure idea and become terrain.",
        "From Hearth Mission Control, Audralia reads as potential terrain inside the larger future-facing window."
      ],
      options: [
        { label: "Show me Audralia’s visible worldroom.", target: "audraliaWorldroomPath", optionKind: "future" },
        { label: "Show me how Audralia becomes readable.", target: "controlCockpitPath", optionKind: "future" },
        { label: "Show me Hearth Mission Control.", target: "hearthPath", optionKind: "future" },
        { label: "Show me Frontier.", target: "frontierPath", optionKind: "future" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" }
      ],
      handoffs: ["audralia"],
      markStable: true
    };
  }

  function buildSourceNode(target) {
    var id = normalizeTarget(target || "seanPath");

    if (id === "underdogPath") {
      return simpleSubNode(id, "thisUnderdog", "source", [
        "This Underdog is the inner lane.",
        "It is not Sean alone. It is the pressure-carrier inside the visitor before pressure becomes language, direction, or use."
      ], [
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Show me the value road.", target: "nineSummitsPath", optionKind: "summit" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ], ["aboutUnderdog"]);
    }

    if (id === "nineSummitsPath" || id === "bookPath") {
      return simpleSubNode(id, "nineSummits", "source", [
        "Nine Summits is the value road.",
        "It runs between personal depth and human source because values turn inner pressure back into relationship, listening, laughter, love, and responsibility."
      ], [
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Show me This Underdog.", target: "underdogPath", optionKind: "underdog" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ], ["book", "nineSummits"]);
    }

    return {
      id: "seanPath",
      roomId: "meetSean",
      topic: "source",
      beats: [
        "Meet Sean is the source hall.",
        "It belongs north because the human origin, motive, and voice behind the estate need to be visible before the visitor mistakes the estate for only a map of pages.",
        "The rooms, laws, worlds, characters, and products all trace back to a human pressure: how to turn experience into usable structure."
      ],
      options: [
        { label: "Show me This Underdog.", target: "underdogPath", optionKind: "underdog" },
        { label: "Show me the value road.", target: "nineSummitsPath", optionKind: "summit" },
        { label: "Show me what can be used or carried.", target: "productsPath", optionKind: "source" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["meetSean", "aboutUnderdog", "book"],
      markStable: true
    };
  }

  function buildProductsNode() {
    return {
      id: "productsPath",
      roomId: "productGallery",
      topic: "source",
      beats: [
        "The Product Gallery is where value becomes usable.",
        "It sits northeast because source and practical use meet here: something can be read, carried, given, returned to, or placed in public view."
      ],
      options: [
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Show me the value road.", target: "nineSummitsPath", optionKind: "summit" },
        { label: "Show me how the rooms relate.", target: "siteGuidePath", optionKind: "room" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["products"],
      markStable: true
    };
  }

  function buildCharactersNode(target) {
    var id = normalizeTarget(target || "charactersPath");
    var expr = getExpression();
    var node;

    if (id === "characterRelationshipsPath") {
      return {
        id: id,
        roomId: "characters",
        topic: "characters",
        beats: [
          "The Characters relate by pressure, not by decoration.",
          "Auren protects. Dextrion repairs. Alaric warns. Tarian endures. Elara signals. Soren keeps boundaries. Jeeves sequences. The Remote Team distributes response.",
          "They sit close to Mirrorland because their pressure is what turns the window into encounter."
        ],
        options: characterFollowupOptions(true),
        handoffs: ["characters", "mirrorland"],
        markStable: true,
        markCharacterRelationshipViewedAfterDisplay: true,
        maybeCharacterCompletionCue: true
      };
    }

    if (id === "characterTensionsPath" || id === "characterMotivesPath" || id === "characterStoryPressurePath") {
      return {
        id: id,
        roomId: "characters",
        topic: "characters",
        beats: [
          "The Characters matter because each one carries a different behavior under pressure.",
          "They are not just names on the estate. They are the human cost of the world logic becoming personal."
        ],
        options: characterFollowupOptions(true),
        handoffs: ["characters"],
        markStable: true,
        maybeCharacterCompletionCue: true
      };
    }

    if (id === "characterFirstPath") {
      return {
        id: id,
        roomId: "characters",
        topic: "characters",
        beats: [
          "If you want the safest first meeting, begin with Auren Vale because he explains sanctuary.",
          "If you want the crossing that started the pressure, begin with Dextrion.",
          "If you want the future-warning side, begin with Alaric or Elara."
        ],
        options: characterRosterOptions(),
        handoffs: ["characters"],
        markStable: true
      };
    }

    if (id === "characterIdentityPath" || id === "charactersPath") {
      if (expr && typeof expr.makeCharacterOverview === "function") {
        node = expr.makeCharacterOverview(createContext({
          target: id,
          characterOverviewDone: state.characterOverviewDone,
          hasSeenCharacterOverview: state.characterOverviewDone
        }));
      }

      if (!node) {
        node = {
          beats: [
            state.characterOverviewDone ? "Now that you know who the Characters are, choose one to meet." : "The Characters are where Mirrorland becomes personal.",
            state.characterOverviewDone ? "We can move into an individual profile or cross into the Character Archetype Mirror." : "They are pressure carriers: protection, repair, warning, endurance, signal, boundary, guided entry, and distributed response."
          ],
          options: characterRosterOptions()
        };
      }

      return {
        id: id,
        roomId: "characters",
        topic: "characters",
        beats: node.beats,
        options: node.options && node.options.length ? node.options : characterRosterOptions(),
        handoffs: ["characters", "mirrorland"],
        markStable: true,
        markCharacterOverviewDoneAfterDisplay: true
      };
    }

    return {
      id: "charactersPath",
      roomId: "characters",
      topic: "characters",
      beats: [
        "The Character Lane is open.",
        "Choose who you want to meet, or cross to the Character Archetype Mirror."
      ],
      options: characterRosterOptions(),
      handoffs: ["characters"],
      markStable: true
    };
  }

  function characterRosterOptions() {
    return [
      { label: "Meet Auren Vale.", target: "characterAurenValePath", optionKind: "character" },
      { label: "Meet Dextrion.", target: "characterDextrionPath", optionKind: "character" },
      { label: "Meet Alaric.", target: "characterAlaricPath", optionKind: "character" },
      { label: "Meet Tarian.", target: "characterTarianPath", optionKind: "character" },
      { label: "Meet Elara.", target: "characterElaraPath", optionKind: "character" },
      { label: "Meet Soren.", target: "characterSorenPath", optionKind: "character" },
      { label: "Tell me about Jeeves.", target: "characterJeevesPath", optionKind: "character" },
      { label: "Meet the Remote Team.", target: "characterRemoteTeamPath", optionKind: "character" },
      { label: "Show how the Characters relate.", target: "characterRelationshipsPath", optionKind: "character" },
      { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
      { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" }
    ];
  }

  function characterFollowupOptions(includeRoster) {
    var options = [];

    if (includeRoster) {
      options.push({ label: "Meet another Character.", target: "charactersPath", optionKind: "character" });
    }

    options.push(
      { label: "Show how the Characters relate.", target: "characterRelationshipsPath", optionKind: "character" },
      { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
      { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
      { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
    );

    return options;
  }

  function buildCharacterProfileNode(target) {
    var normalized = normalizeTarget(target);
    var characterId = CHARACTER_TARGETS[normalized];
    var expr = getExpression();
    var node;

    if (!characterId) return buildCharactersNode("charactersPath");

    if (expr && typeof expr.makeCharacterProfile === "function") {
      node = expr.makeCharacterProfile(characterId, createContext({ target: normalized }));
    }

    if (!node) {
      node = {
        beats: [
          CHARACTER_NAMES[characterId] + " is one of the Mirrorland Characters.",
          "This profile shows what pressure that character carries and why the character belongs near Mirrorland."
        ],
        options: characterFollowupOptions(true)
      };
    }

    return {
      id: normalized,
      roomId: "characterDetails",
      topic: "characters",
      beats: node.beats,
      options: node.options && node.options.length ? node.options : characterFollowupOptions(true),
      handoffs: ["characters", "mirrorland"],
      markStable: true,
      markCharacterProfileViewedAfterDisplay: characterId,
      maybeCharacterCompletionCue: true
    };
  }

  function buildCharacterArchetypeNode(target) {
    var id = normalizeTarget(target || "characterArchetypeMirrorPath");
    var expr = getExpression();
    var node;

    if (id === "selfLearningPath") id = "characterArchetypeMirrorPath";

    if (id === "characterArchetypeQuestionOne") {
      if (expr && typeof expr.makeCharacterArchetypeQuestion === "function") {
        node = expr.makeCharacterArchetypeQuestion(1, createContext({ target: id }));
      }

      return withAnswerOptions({
        id: id,
        roomId: "characterArchetypeMirror",
        topic: "characterArchetype",
        beats: node && node.beats || [
          "First question.",
          "When pressure rises, what do you usually notice first?"
        ],
        options: node && node.options || [
          { label: "Who needs protection?", target: "characterArchetypeQuestionTwo", value: "protect", optionKind: "character" },
          { label: "What is broken and needs repair?", target: "characterArchetypeQuestionTwo", value: "repair", optionKind: "character" },
          { label: "Where danger is forming early.", target: "characterArchetypeQuestionTwo", value: "warn", optionKind: "character" },
          { label: "What the body or situation can actually endure.", target: "characterArchetypeQuestionTwo", value: "endure", optionKind: "character" },
          { label: "What truth or hidden cost is being avoided.", target: "characterArchetypeQuestionTwo", value: "boundary", optionKind: "character" }
        ],
        handoffs: ["coherenceDiagnostic"],
        markStable: true
      }, ["protect", "repair", "warn", "endure", "boundary"]);
    }

    if (id === "characterArchetypeQuestionTwo") {
      if (expr && typeof expr.makeCharacterArchetypeQuestion === "function") {
        node = expr.makeCharacterArchetypeQuestion(2, createContext({ target: id }));
      }

      return withAnswerOptions({
        id: id,
        roomId: "characterArchetypeMirror",
        topic: "characterArchetype",
        beats: node && node.beats || [
          "Second question.",
          "When pressure rises, what do you rely on next?"
        ],
        options: node && node.options || [
          { label: "A clear sequence and controlled timing.", target: "characterArchetypeQuestionThree", value: "sequence", optionKind: "character" },
          { label: "Visible action or repair.", target: "characterArchetypeQuestionThree", value: "repair", optionKind: "character" },
          { label: "Stability and continuity.", target: "characterArchetypeQuestionThree", value: "endure", optionKind: "character" },
          { label: "Evidence, contradiction, and proof.", target: "characterArchetypeQuestionThree", value: "boundary", optionKind: "character" },
          { label: "A signal that gives people hope.", target: "characterArchetypeQuestionThree", value: "signal", optionKind: "character" }
        ],
        handoffs: ["coherenceDiagnostic"],
        markStable: true
      }, ["sequence", "repair", "endure", "boundary", "signal"]);
    }

    if (id === "characterArchetypeQuestionThree") {
      if (expr && typeof expr.makeCharacterArchetypeQuestion === "function") {
        node = expr.makeCharacterArchetypeQuestion(3, createContext({ target: id }));
      }

      return withAnswerOptions({
        id: id,
        roomId: "characterArchetypeMirror",
        topic: "characterArchetype",
        beats: node && node.beats || [
          "Third question.",
          "What usually becomes your risk when the pressure gets too high?"
        ],
        options: node && node.options || [
          { label: "I overprotect or hide too much.", target: "characterArchetypeResult", value: "protect", optionKind: "character" },
          { label: "I try to fix everything too fast.", target: "characterArchetypeResult", value: "repair", optionKind: "character" },
          { label: "I see danger before people believe me.", target: "characterArchetypeResult", value: "warn", optionKind: "character" },
          { label: "I keep carrying more than I can sustain.", target: "characterArchetypeResult", value: "endure", optionKind: "character" },
          { label: "I need the truth named before I can move.", target: "characterArchetypeResult", value: "boundary", optionKind: "character" }
        ],
        handoffs: ["coherenceDiagnostic"],
        markStable: true
      }, ["protect", "repair", "warn", "endure", "boundary"]);
    }

    if (id === "characterArchetypeResult") {
      return buildCharacterArchetypeResultNode();
    }

    if (expr && typeof expr.makeCharacterArchetypeIntro === "function") {
      node = expr.makeCharacterArchetypeIntro(createContext({ target: id }));
    }

    return {
      id: "characterArchetypeMirrorPath",
      roomId: "characterArchetypeMirror",
      topic: "characterArchetype",
      beats: node && node.beats || [
        "We can use the Character Archetype Mirror.",
        "It does not tell you who you are. It looks at how you tend to behave under pressure, then shows which character pattern you are currently following."
      ],
      options: node && node.options || [
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeQuestionOne", optionKind: "character" },
        { label: "Introduce the Characters first.", target: "charactersPath", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["coherenceDiagnostic", "characters"],
      markStable: true
    };
  }

  function withAnswerOptions(node, values) {
    var next = clone(node);
    var list = next.options || [];

    next.options = list.map(function addValues(option, index) {
      var copy = clone(option);
      if (!copy.value && values[index]) copy.value = values[index];
      copy.optionKind = copy.optionKind || "character";
      return copy;
    });

    return next;
  }

  function buildCharacterArchetypeResultNode() {
    var resultKey = calculateCharacterArchetypeResult();
    var result = CHARACTER_RESULTS[resultKey] || CHARACTER_RESULTS.sequence;

    return {
      id: "characterArchetypeResult",
      roomId: "characterArchetypeMirror",
      topic: "characterArchetype",
      beats: [
        "The Character Archetype Mirror is not naming your identity. It is showing the pattern you most often follow under pressure.",
        result.title + ".",
        result.line,
        "You can meet that Character, keep exploring the roster, or enter Mirrorland where these patterns become encounter."
      ],
      options: [
        { label: "Meet " + CHARACTER_NAMES[result.characterId] + ".", target: characterTargetFromId(result.characterId), optionKind: "character" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Restart the Character Archetype Mirror.", target: "characterArchetypeQuestionOne", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["coherenceDiagnostic", "characters", "mirrorland"],
      markStable: true
    };
  }

  function characterTargetFromId(characterId) {
    var found = "charactersPath";

    Object.keys(CHARACTER_TARGETS).forEach(function eachTarget(target) {
      if (CHARACTER_TARGETS[target] === characterId) found = target;
    });

    return found;
  }

  function calculateCharacterArchetypeResult() {
    var counts = Object.create(null);
    var answers = state.characterArchetypeAnswers.slice();

    if (!answers.length) return "sequence";

    answers.forEach(function countAnswer(answer) {
      var key = String(answer || "").trim();
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.keys(counts).sort(function sortCounts(a, b) {
      return counts[b] - counts[a];
    })[0] || "sequence";
  }

  function peekReturnPoint() {
    var i;

    for (i = state.returnStack.length - 1; i >= 0; i -= 1) {
      var point = state.returnStack[i];
      if (!point) continue;
      if (point.node === state.currentNode) continue;
      if (NO_STACK_TARGETS[point.node]) continue;
      return clone(point);
    }

    return null;
  }

  function popReturnPoint() {
    while (state.returnStack.length) {
      var point = state.returnStack.pop();
      if (!point) continue;
      if (point.node === state.currentNode) continue;
      if (NO_STACK_TARGETS[point.node]) continue;
      return point;
    }

    return null;
  }

  function buildReturnNode(target, meta) {
    var id = normalizeTarget(target);
    var expr = getExpression();
    var node;
    var preview = meta && meta.preview;
    var returnPoint;

    if (id === "priorTopicReturn" || id === "priorTopicReturnPath") {
      returnPoint = preview ? peekReturnPoint() : popReturnPoint();
      if (!preview) state.pendingPriorReturn = returnPoint;

      if (!returnPoint) {
        return {
          id: id,
          roomId: state.currentRoomId,
          topic: state.currentTopic,
          beats: [
            "There is no prior topic in this visible thread yet.",
            "We can return to the First Fork and choose a clean door."
          ],
          options: [
            { label: "Return to the First Fork.", target: "returnFork", type: "control", optionKind: "return" },
            { label: "Help me choose the next door.", target: "cleanDoor", type: "control", optionKind: "return" }
          ],
          handoffs: [],
          skipStateUpdate: true
        };
      }

      if (expr && typeof expr.makeReturnExpression === "function") {
        node = expr.makeReturnExpression("prior", createContext({
          target: id,
          priorNode: returnPoint.node,
          priorTopic: returnPoint.topic,
          priorTopicName: returnPoint.label
        }));
      }

      return {
        id: id,
        roomId: state.currentRoomId,
        topic: state.currentTopic,
        beats: node && node.beats || [
          "We can return to " + (returnPoint.label || "the prior topic") + ".",
          "Nothing is lost. We are only stepping off this path and returning to the last thread."
        ],
        options: [
          {
            label: "Return to " + (returnPoint.label || "prior topic") + ".",
            target: returnPoint.node,
            type: "control",
            skipReturnPush: true,
            restoreRoomId: returnPoint.roomId,
            optionKind: "return"
          },
          { label: "Return to origin conversation.", target: "originReturnPath", type: "control", skipReturnPush: true, optionKind: "return" },
          { label: "Stay with this room.", target: state.currentNode || "cleanDoor", type: "control", skipReturnPush: true, optionKind: "return" },
          { label: "Help me choose the next door.", target: "cleanDoor", type: "control", skipReturnPush: true, optionKind: "return" }
        ],
        handoffs: [],
        skipStateUpdate: true,
        skipReturnPush: true
      };
    }

    if (id === "originReturn" || id === "originReturnPath" || id === "returnFork" || id === "restartFork") {
      if (expr && typeof expr.makeReturnExpression === "function") {
        node = expr.makeReturnExpression("origin", createContext({ target: id }));
      }

      return {
        id: id,
        roomId: "firstFork",
        topic: "origin",
        beats: node && node.beats || [
          "We are back at the origin conversation.",
          "This is the First Fork. From here, the estate becomes readable again."
        ],
        options: node && node.options || buildOriginNode().options,
        handoffs: [],
        skipReturnPush: true,
        markStable: true
      };
    }

    return buildOriginNode();
  }

  function buildCleanDoorNode() {
    return {
      id: "cleanDoor",
      roomId: state.currentRoomId,
      topic: state.currentTopic,
      beats: [
        "We can choose the next door by meaning rather than by menu.",
        "If you want source, I’ll take you toward the creator. If you want proof, we should go toward Scientific Law. If you want future systems, Frontier is nearby. If you want encounter, Mirrorland is the right threshold."
      ],
      options: [
        { label: "Meet the creator behind all of this.", target: "seanPath", optionKind: "source" },
        { label: "Start with the proof side.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Show me the future-facing rooms.", target: "frontierPath", optionKind: "future" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: [],
      skipReturnPush: true
    };
  }

  function simpleSubNode(id, roomId, topic, beats, options, handoffs) {
    return {
      id: id,
      roomId: roomId,
      topic: topic,
      beats: beats,
      options: options,
      handoffs: handoffs || [],
      markStable: true
    };
  }

  function buildGaugesNode() {
    return {
      id: "gaugesPath",
      roomId: "theLab",
      topic: "proof",
      beats: [
        "The Lab is the western gauge room.",
        "It belongs near Scientific Law because proof needs visible status, not only explanation."
      ],
      options: [
        { label: "Show me how claims are tested.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Show me the proof side of the estate.", target: "lawsPath", optionKind: "proof" },
        { label: "Show me the future-facing rooms.", target: "frontierPath", optionKind: "future" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["gauges", "scientificLaw"],
      markStable: true
    };
  }

  function buildDiagnosticNode() {
    return {
      id: "diagnosticPath",
      roomId: "diagnostic",
      topic: "proof",
      beats: [
        "The Coherence Diagnostic is the western mirror desk.",
        "It belongs near the proof rooms because self-reflection should stay honest, limited, and useful.",
        "It sits close to the Character Archetype Mirror because measured self-reflection can become a story pattern under pressure."
      ],
      options: [
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Show me how claims are tested.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Introduce the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: ["coherenceDiagnostic"],
      markStable: true
    };
  }

  function getNode(target, meta) {
    var id = normalizeTarget(target || DEFAULT_START_NODE);
    var data = meta || {};

    if (id === "intro" || id === "askFirst") return buildOriginNode();
    if (id === "compassPath" || id === "whereToStart") return buildOrientationNode();
    if (id === "siteGuidePath") return buildSiteGuideNode();

    if (id === "websitePath") {
      return simpleSubNode(id, "mainHall", "orientation", [
        "The public entry is the Center Hall.",
        "It keeps the estate familiar before the visitor chooses source, proof, future systems, or Mirrorland."
      ], [
        { label: "Begin with orientation.", target: "compassPath", optionKind: "room" },
        { label: "Show me how the rooms relate.", target: "siteGuidePath", optionKind: "room" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ], ["home"]);
    }

    if (id === "lawsPath" || id === "proofPath" || id.indexOf("scientificLaw") === 0 || id === "skepticPlain") return buildScientificLawNode(id);
    if (id.indexOf("frontier") === 0) return buildFrontierNode(id);
    if (id === "hearthPath" || id.indexOf("hearth") === 0) return buildHearthNode(id);
    if (id === "audraliaPath" || id === "audraliaWorldroomPath" || id === "controlCockpitPath") return buildAudraliaNode(id);
    if (id === "mirrorlandPath" || id === "atriumPath" || id === "atlasPath" || id === "ziontsPath" || id === "mirrorMePath") return buildMirrorlandNode(id);
    if (id === "seanPath" || id === "underdogPath" || id === "nineSummitsPath" || id === "bookPath") return buildSourceNode(id);
    if (id === "productsPath") return buildProductsNode();
    if (id === "gaugesPath") return buildGaugesNode();
    if (id === "diagnosticPath" || id === "futureProfilePath") return buildDiagnosticNode();

    if (id === "charactersPath" || id === "characterIdentityPath" || id === "characterRelationshipsPath" || id === "characterTensionsPath" || id === "characterMotivesPath" || id === "characterStoryPressurePath" || id === "characterFirstPath") {
      return buildCharactersNode(id, data);
    }

    if (CHARACTER_TARGETS[id]) return buildCharacterProfileNode(id);

    if (id === "characterArchetypeMirrorPath" || id === "selfLearningPath" || id.indexOf("characterArchetype") === 0) {
      return buildCharacterArchetypeNode(id);
    }

    if (id === "priorTopicReturn" || id === "priorTopicReturnPath" || id === "originReturn" || id === "originReturnPath" || id === "returnFork" || id === "restartFork") {
      return buildReturnNode(id, data);
    }

    if (id === "cleanDoor" || id === "switchTopics" || id === "sharpQuestion" || id === "recenterNode") return buildCleanDoorNode();

    return simpleSubNode(id, state.currentRoomId, state.currentTopic, [
      "I can help with that, but this path is not fully mapped in the visible estate yet.",
      "Let me bring you to a clean door so the conversation does not loop."
    ], [
      { label: "Help me choose the next door.", target: "cleanDoor", type: "control", optionKind: "return" },
      { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" },
      { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
    ]);
  }

  function pushReturnPoint(nextTarget, option) {
    var normalized = normalizeTarget(nextTarget);
    var current = state.currentNode;

    if (!current || current === normalized) return;
    if (NO_STACK_TARGETS[normalized]) return;
    if (option && option.skipReturnPush) return;

    var label = state.currentRoomName || state.currentTopic || current;

    if (state.returnStack.length) {
      var last = state.returnStack[state.returnStack.length - 1];
      if (last && last.node === current) return;
    }

    state.returnStack.push({
      node: current,
      roomId: state.currentRoomId,
      roomName: state.currentRoomName,
      coordinateName: state.currentCoordinateName,
      topic: state.currentTopic,
      label: label
    });

    if (state.returnStack.length > 12) {
      state.returnStack.shift();
    }
  }

  function updateVisitorForTarget(target, option) {
    var normalized = normalizeTarget(target);
    var topic = topicFromTarget(normalized);

    state.visitedNodes[normalized] = true;
    state.currentTopic = topic;

    state.visitorTrail.push({
      target: normalized,
      label: option && option.label || "",
      roomId: state.currentRoomId,
      topic: topic,
      timestamp: Date.now()
    });

    if (state.visitorTrail.length > 80) {
      state.visitorTrail.shift();
    }

    state.roomTrail.push({
      roomId: state.currentRoomId,
      roomName: state.currentRoomName,
      coordinateName: state.currentCoordinateName,
      target: normalized,
      timestamp: Date.now()
    });

    if (state.roomTrail.length > 80) {
      state.roomTrail.shift();
    }

    if (topic === "characters" && normalized === "charactersPath" && state.characterOverviewDone) {
      state.characterLoopCount += 1;
    }
  }

  function updateStateAfterDisplay(node, target, option) {
    var normalized = normalizeTarget(target);
    var priorNode = state.currentNode;
    var priorTopic = state.currentTopic;
    var priorTopicName = state.currentRoomName;

    if (node.skipStateUpdate) return;

    state.priorNode = priorNode;
    state.priorTopic = priorTopic;
    state.priorTopicName = priorTopicName;

    state.currentNode = node.id || normalized;
    state.currentRoomId = node.roomId || state.currentRoomId;
    updateRoomFromTarget(normalized);
    state.currentTopic = node.topic || topicFromTarget(normalized);

    if (node.markStable) {
      state.lastStableNode = state.currentNode;
    }

    if (node.markCharacterOverviewDoneAfterDisplay) {
      state.characterOverviewDone = true;
    }

    if (node.markCharacterProfileViewedAfterDisplay) {
      var characterId = node.markCharacterProfileViewedAfterDisplay;
      if (!state.characterProfileViews[characterId]) {
        state.characterProfileViews[characterId] = 1;
        state.characterProfileViewCount += 1;
      } else {
        state.characterProfileViews[characterId] += 1;
      }
    }

    if (node.markCharacterRelationshipViewedAfterDisplay) {
      state.characterRelationshipViews += 1;
    }

    if (node.markCharacterCompletionShownAfterDisplay) {
      state.characterCompletionPromptShown = true;
    }

    updateVisitorForTarget(normalized, option);
  }

  function maybeAddCharacterCompletionCue(node) {
    var expr = getExpression();
    var cue;
    var shouldShow =
      node &&
      node.maybeCharacterCompletionCue &&
      !state.characterCompletionPromptShown &&
      (
        state.characterCompletionReady ||
        state.characterProfileViewCount >= 3 ||
        state.characterProfileViewCount + state.characterRelationshipViews + state.characterLoopCount >= 3
      );

    if (!shouldShow) return node;

    if (expr && typeof expr.makeCharacterCompletionCue === "function") {
      cue = expr.makeCharacterCompletionCue(createContext({ target: node.id }));
    }

    cue = cue || {
      beats: [
        "You can keep asking me about them here.",
        "But if you are ready, Mirrorland is where this changes from explanation into encounter."
      ],
      options: [
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Keep asking about the Characters.", target: "charactersPath", optionKind: "character" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", optionKind: "character" },
        { label: "Return to the First Fork.", target: "returnFork", type: "control", optionKind: "return" }
      ]
    };

    if (cue.beats && cue.beats.length) {
      node.beats = (node.beats || []).concat(cue.beats);
    }

    if (cue.options && cue.options.length) {
      node.options = cue.options;
    }

    node.markCharacterCompletionShownAfterDisplay = true;
    return node;
  }

  function captureAnswerFromOption(option) {
    var target = normalizeTarget(option && option.target);

    if (
      target === "characterArchetypeQuestionTwo" ||
      target === "characterArchetypeQuestionThree" ||
      target === "characterArchetypeResult"
    ) {
      if (option.value) {
        state.characterArchetypeAnswers.push(option.value);
      } else if (option.label) {
        state.characterArchetypeAnswers.push(inferAnswerValue(option.label));
      }

      if (state.characterArchetypeAnswers.length > 3) {
        state.characterArchetypeAnswers = state.characterArchetypeAnswers.slice(-3);
      }
    }

    if (target === "characterArchetypeQuestionOne") {
      state.characterArchetypeAnswers = [];
    }
  }

  function inferAnswerValue(label) {
    var text = String(label || "").toLowerCase();

    if (text.indexOf("protect") !== -1 || text.indexOf("shelter") !== -1 || text.indexOf("hide") !== -1) return "protect";
    if (text.indexOf("repair") !== -1 || text.indexOf("broken") !== -1 || text.indexOf("fix") !== -1) return "repair";
    if (text.indexOf("danger") !== -1 || text.indexOf("warning") !== -1 || text.indexOf("believe") !== -1) return "warn";
    if (text.indexOf("endure") !== -1 || text.indexOf("body") !== -1 || text.indexOf("sustain") !== -1 || text.indexOf("stability") !== -1) return "endure";
    if (text.indexOf("signal") !== -1 || text.indexOf("hope") !== -1 || text.indexOf("visible") !== -1) return "signal";
    if (text.indexOf("truth") !== -1 || text.indexOf("hidden") !== -1 || text.indexOf("evidence") !== -1 || text.indexOf("proof") !== -1) return "boundary";
    if (text.indexOf("sequence") !== -1 || text.indexOf("timing") !== -1 || text.indexOf("controlled") !== -1) return "sequence";

    return "sequence";
  }

  function delayForBeat(beat, index, total) {
    if (state.rushActive) return 16;

    var text = String(beat || "");
    var base = index === 0 ? 220 : 340;
    var byLength = Math.min(1100, Math.max(220, text.length * 10));
    var byPosition = total > 1 && index === total - 1 ? 360 : 0;

    return base + byLength + byPosition;
  }

  function waitBeforeBeat(ms) {
    clearTypingTimer();

    if (state.rushActive) {
      return Promise.resolve(true);
    }

    return new Promise(function wait(resolve) {
      state.typingResolve = resolve;
      state.typingTimer = global.setTimeout(function doneWaiting() {
        state.typingTimer = null;
        state.typingResolve = null;
        resolve(false);
      }, ms);
    });
  }

  function playBeats(beats, meta) {
    var list = (beats || []).filter(Boolean);
    var index = 0;

    state.beatQueue = list.slice();
    state.currentBeatIndex = -1;
    state.rushActive = false;

    return new Promise(function resolveBeats(resolve) {
      function next() {
        if (index >= list.length) {
          state.currentBeatIndex = -1;
          state.beatQueue = [];
          resolve();
          return;
        }

        state.currentBeatIndex = index;

        waitBeforeBeat(delayForBeat(list[index], index, list.length)).then(function afterBeatDelay() {
          appendMessage("jeeves", list[index], meta);
          index += 1;
          next();
        });
      }

      next();
    });
  }

  function renderNode(node, target, option) {
    var prepared = applyExpression(maybeAddCharacterCompletionCue(node), {
      target: target,
      label: option && option.label || ""
    });
    var roomIdForMessage = prepared.roomId || state.currentRoomId;

    state.isRendering = true;
    state.rushActive = false;

    hideInteractiveDocks();
    setHouseListening(false);
    setTyping(true);

    return playBeats(prepared.beats || [], {
      target: target,
      roomId: roomIdForMessage,
      coordinateName: state.currentCoordinateName
    }).then(function afterBeats() {
      updateStateAfterDisplay(prepared, target, option);
      renderOptions(prepared.options || [], {
        target: target,
        label: option && option.label || "",
        roomId: prepared.roomId || state.currentRoomId
      });
      renderHandoffs(prepared.handoffs || [], prepared.handoffLabels || {});
      state.isRendering = false;
      state.rushActive = false;
      setTyping(false);
      setHouseListening(true);
    }).catch(function onRenderError(error) {
      state.isRendering = false;
      state.rushActive = false;
      setTyping(false);
      setHouseListening(true);
      appendSystemMessage("Jeeves could not open that room cleanly. Returning to the First Fork.");
      runNode("returnFork", { skipReturnPush: true });
      if (global.console && console.error) console.error(error);
    });
  }

  function runNode(target, option) {
    var normalized = normalizeTarget(target || DEFAULT_START_NODE);

    if (state.isRendering || state.isTyping) {
      requestRush();
      return Promise.resolve(false);
    }

    captureAnswerFromOption(option || { target: normalized });

    if (option) {
      markOptionSelected(option);
    }

    pushReturnPoint(normalized, option);

    if (option && option.restoreRoomId) {
      state.currentRoomId = option.restoreRoomId;
    }

    return renderNode(getNode(normalized, option), normalized, option);
  }

  function handleOption(option) {
    if (!option || shouldDisableOption(option)) return;

    appendVisitorMessage(option.label);
    runNode(option.target, option);
  }

  function classifyVisitorText(text) {
    var clean = String(text || "").toLowerCase().trim();

    if (!clean) return "";
    if (clean.indexOf("return to prior") !== -1 || clean.indexOf("last topic") !== -1 || clean.indexOf("previous topic") !== -1) return "priorTopicReturnPath";
    if (clean.indexOf("return to origin") !== -1 || clean.indexOf("start over") !== -1 || clean.indexOf("first fork") !== -1) return "originReturnPath";
    if (clean.indexOf("mission control") !== -1 || clean.indexOf("window within the window") !== -1) return "hearthPath";
    if (clean.indexOf("who are the characters") !== -1 || clean.indexOf("meet the characters") !== -1 || clean === "characters") return "charactersPath";
    if (clean.indexOf("auren") !== -1) return "characterAurenValePath";
    if (clean.indexOf("dextrion") !== -1) return "characterDextrionPath";
    if (clean.indexOf("alaric") !== -1) return "characterAlaricPath";
    if (clean.indexOf("tarian") !== -1) return "characterTarianPath";
    if (clean.indexOf("elara") !== -1) return "characterElaraPath";
    if (clean.indexOf("soren") !== -1) return "characterSorenPath";
    if (clean.indexOf("remote team") !== -1) return "characterRemoteTeamPath";
    if (clean.indexOf("which character") !== -1 || clean.indexOf("archetype") !== -1 || clean.indexOf("under pressure") !== -1) return "characterArchetypeMirrorPath";
    if (clean.indexOf("scientific law") !== -1 || clean.indexOf("proof") !== -1 || clean.indexOf("trustworthy") !== -1 || clean.indexOf("tested") !== -1) return "scientificLawPath";
    if (clean.indexOf("frontier") !== -1 || clean.indexOf("future system") !== -1) return "frontierPath";
    if (clean.indexOf("hearth") !== -1) return "hearthPath";
    if (clean.indexOf("audralia") !== -1) return "audraliaPath";
    if (clean.indexOf("mirrorland") !== -1 || clean.indexOf("world side") !== -1) return "mirrorlandPath";
    if (clean.indexOf("sean") !== -1 || clean.indexOf("creator") !== -1 || clean.indexOf("source") !== -1) return "seanPath";
    if (clean.indexOf("underdog") !== -1) return "underdogPath";
    if (clean.indexOf("summit") !== -1 || clean.indexOf("love") !== -1) return "nineSummitsPath";
    if (clean.indexOf("map") !== -1 || clean.indexOf("site guide") !== -1 || clean.indexOf("guide desk") !== -1 || clean.indexOf("rooms relate") !== -1 || clean.indexOf("blueprint") !== -1) return "siteGuidePath";
    if (clean.indexOf("compass") !== -1 || clean.indexOf("orientation") !== -1) return "compassPath";

    return "";
  }

  function submitVisitorText(text) {
    var clean = String(text || "").trim();
    var target;

    if (!clean) return;

    if (state.isRendering || state.isTyping) {
      requestRush();
      return;
    }

    appendVisitorMessage(clean);
    target = classifyVisitorText(clean);

    if (target) {
      runNode(target, { label: clean, target: target, type: "conversation", optionKind: inferOptionKind({ target: target }) });
      return;
    }

    askBackbrain(clean);
  }

  function buildBackbrainPayload(text) {
    return {
      message: text,
      visitorText: text,
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
      currentEntry: state.currentNode,
      currentPath: ROUTE,
      currentTopic: state.currentTopic,
      currentRoomId: state.currentRoomId,
      currentRoomName: state.currentRoomName,
      currentCoordinateName: state.currentCoordinateName,
      currentCardinal: state.currentCardinal,
      currentPlaceType: state.currentPlaceType,

      originConversation: state.originConversation,
      originAnchor: state.originAnchor,
      priorTopic: state.priorTopic,
      priorNode: state.priorNode,

      returnStack: clone(state.returnStack),
      branchStack: clone(state.branchStack),
      visitorTrail: clone(state.visitorTrail.slice(-12)),
      roomTrail: clone(state.roomTrail.slice(-12)),

      visitedNodes: keysOf(state.visitedNodes),
      selectedTargets: keysOf(state.selectedTargets),
      selectedOptionKeys: keysOf(state.selectedOptionKeys),

      characterOverviewDone: state.characterOverviewDone,
      characterProfileViews: clone(state.characterProfileViews),
      characterProfileViewCount: state.characterProfileViewCount,
      characterRelationshipViews: state.characterRelationshipViews,
      characterArchetypeAnswers: clone(state.characterArchetypeAnswers),

      expressionContract: getExpression() ? getExpression().contract : "",
      frontbrainContract: CONTRACT,
      cssContract: global.__HEARTH_JEEVES_CSS_CONTRACT__ || "",
      revealDepth: state.lastFibonacciDepth || "intro",
      fibonacciDepth: state.lastFibonacciDepth || "intro",
      lastFibonacciStage: clone(state.lastFibonacciStage),
      lastBackbrainFrame: clone(state.lastBackbrainFrame)
    };
  }

  function preserveBackbrainMeta(data) {
    var authorities = {};

    if (!data) return;

    state.lastBackbrainFrame = data.narrativeFrame || data.frame || null;
    state.lastFibonacciDepth = data.fibonacciDepth || data.revealDepth || state.lastFibonacciDepth || "";
    state.lastFibonacciStage = data.fibonacciStage || null;
    state.lastRouteHints = data.routeHints || state.lastRouteHints || null;
    state.lastApiDepthMode = data.depthMode || state.lastApiDepthMode || "";
    state.lastApiContract = data.contract || data.apiContract || state.lastApiContract || "";
    state.lastApiResponseAt = Date.now();

    authorities.routeAuthority = data.routeAuthority || "";
    authorities.expressionAuthority = data.expressionAuthority || "";
    authorities.blueprintAuthority = data.blueprintAuthority || "";
    state.lastBackbrainAuthorities = authorities;

    if (els.root && state.lastApiContract) {
      els.root.setAttribute("data-api-contract", state.lastApiContract);
    }
  }

  function normalizeBackbrainNode(data, text) {
    var beats = [];

    if (data.beats && data.beats.length) {
      beats = data.beats.slice();
    } else if (data.bubbles && data.bubbles.length) {
      beats = data.bubbles.slice();
    } else if (data.messages && data.messages.length) {
      beats = data.messages.slice();
    } else if (data.answer || data.text) {
      beats = [data.answer || data.text];
    } else {
      beats = ["I can help, but I should bring this back into the estate structure first."];
    }

    return {
      id: "backbrainResponse",
      roomId: state.currentRoomId,
      topic: state.currentTopic,
      beats: beats,
      options: data.options || [
        { label: "Help me choose the next door.", target: "cleanDoor", type: "control", optionKind: "return" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control", optionKind: "return" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ],
      handoffs: data.handoffs || [],
      handoffLabels: data.handoffLabels || {},
      routeHints: data.routeHints || null,
      skipReturnPush: true
    };
  }

  function askBackbrain(text) {
    var payload = buildBackbrainPayload(text);

    if (state.isRendering || state.isTyping) {
      requestRush();
      return Promise.resolve(false);
    }

    hideInteractiveDocks();
    setHouseListening(false);
    setTyping(true);

    return fetch(DEFAULT_BRAIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function parseResponse(response) {
      if (!response.ok) throw new Error("Jeeves backbrain response was not OK.");
      return response.json();
    }).then(function renderBackbrain(data) {
      var node;

      if (!data || data.ok === false) {
        throw new Error(data && data.error || "Jeeves backbrain returned no usable answer.");
      }

      preserveBackbrainMeta(data);
      node = normalizeBackbrainNode(data, text);

      return renderNode(node, "backbrainResponse", {
        label: text,
        target: "backbrainResponse",
        skipReturnPush: true
      });
    }).catch(function backbrainFallback(error) {
      setTyping(false);
      setHouseListening(true);
      appendMessage("jeeves", "I can answer that better if we place it inside the estate first. Let me give you a clean door.", createContext());
      renderOptions([
        { label: "Begin with orientation.", target: "compassPath", optionKind: "room" },
        { label: "Start with the proof side.", target: "scientificLawPath", optionKind: "proof" },
        { label: "Show me the future-facing rooms.", target: "frontierPath", optionKind: "future" },
        { label: "Open Mirrorland.", target: "mirrorlandPath", optionKind: "mirror" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control", optionKind: "return" }
      ]);
      if (global.console && console.warn) console.warn(error);
      return false;
    });
  }

  function bindInput() {
    if (els.form) {
      els.form.addEventListener("submit", function onSubmit(event) {
        event.preventDefault();

        if (state.isRendering || state.isTyping) {
          requestRush();
          return;
        }

        if (!els.input) return;
        var value = els.input.value;
        els.input.value = "";
        submitVisitorText(value);
      });
      return;
    }

    if (els.send && els.input) {
      els.send.addEventListener("click", function onSend(event) {
        event.preventDefault();

        if (state.isRendering || state.isTyping) {
          requestRush();
          return;
        }

        var value = els.input.value;
        els.input.value = "";
        submitVisitorText(value);
      });
    }

    if (els.input) {
      els.input.addEventListener("keydown", function onKeydown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (state.isRendering || state.isTyping) {
            requestRush();
            return;
          }

          var value = els.input.value;
          els.input.value = "";
          submitVisitorText(value);
        }
      });
    }
  }

  function bindTapToRush() {
    if (!els.root) return;

    els.root.addEventListener("pointerdown", function onPointerDown(event) {
      state.lastInteractionAt = Date.now();

      if (!(state.isRendering || state.isTyping)) return;

      var interactive = event.target && event.target.closest && event.target.closest("button, a, input, textarea, select, [data-jeeves-option], [data-jeeves-route-option]");
      if (interactive) return;

      event.preventDefault();
      requestRush();
    }, { passive: false });
  }

  function boot() {
    if (state.initialized) return;

    ensureDom();
    bindInput();
    bindTapToRush();

    state.initialized = true;

    global.HEARTH = global.HEARTH || {};
    global.HEARTH.JEEVES = global.HEARTH.JEEVES || {};
    global.HEARTH.JEEVES.frontbrain = api;
    global.HEARTH.JEEVES.engine = api;
    global.JEEVES_ENGINE = api;
    global.__HEARTH_JEEVES_FRONTBRAIN_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_ROUTE__ = ROUTE;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
    global.__HEARTH_JEEVES_FRONTBRAIN_CONTRACT__ = CONTRACT;

    setHouseListening(false);
    setTyping(false);
    runNode(DEFAULT_START_NODE, { target: DEFAULT_START_NODE, label: "Start", skipReturnPush: true });
  }

  var api = {
    contract: CONTRACT,
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
    state: state,

    boot: boot,
    runNode: runNode,
    requestRush: requestRush,

    getNode: function getNodePublic(target) {
      return clone(getNode(target || state.currentNode, { preview: true }));
    },

    getState: function getStatePublic() {
      return clone(state);
    },

    getExpression: getExpression,
    createContext: createContext,
    classifyVisitorText: classifyVisitorText,
    submitVisitorText: submitVisitorText,
    askBackbrain: askBackbrain,

    returnToPriorTopic: function returnToPriorTopic() {
      return runNode("priorTopicReturnPath", {
        target: "priorTopicReturnPath",
        label: "Return to prior topic.",
        type: "control",
        skipReturnPush: true,
        optionKind: "return"
      });
    },

    returnToOriginConversation: function returnToOriginConversation() {
      return runNode("originReturnPath", {
        target: "originReturnPath",
        label: "Return to origin conversation.",
        type: "control",
        skipReturnPush: true,
        optionKind: "return"
      });
    },

    markOptionSelected: markOptionSelected,
    hasOptionBeenSelected: hasOptionBeenSelected,
    shouldDisableOption: shouldDisableOption,

    getCharacterArchetypeAnswers: function getCharacterArchetypeAnswers() {
      return state.characterArchetypeAnswers.slice();
    },

    resetCharacterArchetype: function resetCharacterArchetype() {
      state.characterArchetypeAnswers = [];
      return state.characterArchetypeAnswers.slice();
    },

    getCharacterMirrorAnswers: function getCharacterMirrorAnswers() {
      return state.characterArchetypeAnswers.slice();
    },

    resetCharacterMirror: function resetCharacterMirror() {
      state.characterArchetypeAnswers = [];
      return state.characterArchetypeAnswers.slice();
    },

    resetVisitedOptions: function resetVisitedOptions() {
      state.selectedOptionKeys = Object.create(null);
      state.selectedTargets = Object.create(null);
      state.selectedTargetsByRoom = Object.create(null);
      state.selectedLabelsByRoom = Object.create(null);
      state.characterProfileViews = Object.create(null);
      state.characterProfileViewCount = 0;
      state.characterRelationshipViews = 0;
      state.characterLoopCount = 0;
      state.characterCompletionReady = false;
      state.characterCompletionPromptShown = false;
      return true;
    }
  };

  ready(boot);
})(typeof window !== "undefined" ? window : globalThis);
