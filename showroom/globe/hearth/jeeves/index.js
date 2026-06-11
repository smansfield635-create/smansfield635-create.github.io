// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_CONVERSATION_GRAMMAR_RENDERER_API_NORTH_COMPATIBLE_TNT_v25
// Full-file replacement.
// Browser-side only.
// Center / Frontbrain renderer.
// Owns visible Jeeves state, text-thread rendering, tap-to-rush, option rendering,
// API/North conversation grammar payloads, prepared-door rendering, local fallback,
// route execution, return stack, branch stack, transition trail, and visitor movement state.
// Does not own API/North depth, secure model bridge, moderation, canon, final Character reasoning,
// Expression public transition authorship, CSS authority, or server-side route handling.
//
// v25 renewal:
// - Built downstream from /api/jeeves.js v5.
// - API/North defines prompt grammar.
// - JS renders that grammar.
// - Expression may shape transition language, but does not own route execution.
// - Conversation options read as complete user texts to Jeeves.
// - Prepared doors remain route actions.

"use strict";

(function hearthJeevesFrontbrainConversationGrammarV25() {
  const CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_CONVERSATION_GRAMMAR_RENDERER_API_NORTH_COMPATIBLE_TNT_v25";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_FORK_BRIDGE_RENDERER_API_NORTH_COMPATIBLE_TNT_v24";
  const API_CONTRACT = "HEARTH_JEEVES_BACKBRAIN_NORTH_CONVERSATION_GRAMMAR_STANDARD_TNT_v5";

  const API_ENDPOINT = "/api/jeeves";

  const DEFAULT_NODE = "hearthPath";
  const DEFAULT_TOPIC = "hearth";
  const DEFAULT_ROOM_ID = "hearth";
  const DEFAULT_ROOM_NAME = "Hearth Mission Control";
  const DEFAULT_CARDINAL = "E";

  const MAX_TRAIL_ITEMS = 24;
  const MAX_VISIBLE_OPTIONS = 8;
  const MAX_VISIBLE_HANDOFFS = 8;

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

  const ROUTE_HINTS = Object.freeze({
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
  });

  const DEFAULT_HANDOFF_LABELS = Object.freeze({
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

  const TARGET_ROUTE_HINTS = Object.freeze({
    compassPath: "compass",
    whereToStart: "compass",
    siteGuidePath: "siteGuide",
    websitePath: "home",
    proofPath: "laws",
    lawsPath: "laws",
    scientificLawPath: "scientificLaw",
    scientificLawTheoryPath: "scientificLaw",
    scientificLawEvidencePath: "scientificLaw",
    scientificLawMeasurePath: "scientificLaw",
    scientificLawLimitsPath: "scientificLaw",
    gaugesPath: "gauges",
    diagnosticPath: "coherenceDiagnostic",
    futureProfilePath: "coherenceDiagnostic",
    mirrorMePath: "coherenceDiagnostic",
    seanPath: "meetSean",
    underdogPath: "aboutUnderdog",
    productsPath: "products",
    nineSummitsPath: "nineSummits",
    nineSummitsBookPath: "nineSummits",
    mirrorlandPath: "mirrorland",
    atriumPath: "showroom",
    atlasPath: "mirrorland",
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
    characterArchetypeMirrorPath: "coherenceDiagnostic",
    selfLearningPath: "coherenceDiagnostic",
    hearthPath: "hearth",
    hearthFacilityPath: "hearth",
    hearthConstructPath: "hearth",
    hearthFrontierPath: "hearth",
    hearthLawPath: "hearth",
    audraliaPath: "audralia",
    audraliaWorldroomPath: "audralia",
    controlCockpitPath: "controlRoom",
    hEarthPath: "hEarth",
    ziontsPath: "zionts",
    frontierPath: "frontier",
    frontierSystemsPath: "frontier",
    frontierEnergyPath: "frontierEnergy",
    frontierWaterPath: "frontierWater",
    frontierWastePath: "frontierWaste",
    frontierClosedLoopPath: "frontierClosedLoop",
    frontierInfrastructurePath: "frontierInfrastructure",
    frontierLatticePath: "frontierLattice",
    frontierUrbanPath: "frontierUrban",
    frontierManualPath: "frontierManual",
    frontierShimmerPath: "frontierShimmer",
    frontierTrajectoryPath: "frontierTrajectory",
    frontierVisionPath: "frontierVision",
    frontierLawPath: "scientificLaw",
    frontierCharactersPath: "characters"
  });

  const NODE_TOPIC_MAP = Object.freeze({
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
    characterArchetypeMirrorPath: "characterArchetypeMirror",
    selfLearningPath: "characterArchetypeMirror",
    diagnosticPath: "diagnostic",
    lawsPath: "laws",
    scientificLawPath: "scientificLaw",
    scientificLawTheoryPath: "scientificLaw",
    scientificLawEvidencePath: "scientificLaw",
    scientificLawMeasurePath: "scientificLaw",
    scientificLawLimitsPath: "scientificLaw",
    gaugesPath: "gauges",
    frontierPath: "frontier",
    frontierSystemsPath: "frontier",
    seanPath: "sean",
    underdogPath: "underdog",
    nineSummitsPath: "summits",
    nineSummitsBookPath: "summits",
    productsPath: "products",
    compassPath: "orientation",
    siteGuidePath: "blueprint",
    whereToStart: "orientation"
  });

  const PROMPT_MODE_GROUPS = Object.freeze({
    story_prompt: {
      key: "story",
      heading: "Ask Jeeves",
      order: 10
    },
    skeptic_prompt: {
      key: "skeptic",
      heading: "Ask Jeeves",
      order: 20
    },
    practical_prompt: {
      key: "practical",
      heading: "Ask Jeeves",
      order: 30
    },
    personal_prompt: {
      key: "personal",
      heading: "Ask Jeeves",
      order: 40
    },
    progression_prompt: {
      key: "progression",
      heading: "Continue With Jeeves",
      order: 50
    },
    recenter_prompt: {
      key: "recenter",
      heading: "Re-center",
      order: 90
    },
    unknown_prompt: {
      key: "unknown",
      heading: "Ask Jeeves",
      order: 60
    }
  });

  const OPTION_KIND_GROUPS = Object.freeze({
    conversation_prompt: {
      heading: "Text Jeeves",
      order: 10
    },
    forward: {
      heading: "Continue With Jeeves",
      order: 20
    },
    parallel: {
      heading: "Move Through the House",
      order: 30
    },
    return: {
      heading: "Move Through the House",
      order: 40
    },
    control: {
      heading: "Re-center",
      order: 50
    },
    route: {
      heading: "Prepared Doors",
      order: 60
    }
  });

  const START_OPTIONS = Object.freeze([
    makeConversationOption("Where am I right now?", "hearthPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.STORY),
    makeConversationOption("Why should I trust this?", "scientificLawPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
    makeConversationOption("What has to work in the real world?", "frontierPath", PROMPT_MODES.PRACTICAL, ARCHETYPE_ALIGNMENTS.PRACTICAL),
    makeConversationOption("What does this have to do with me?", "underdogPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL)
  ]);

  const START_HANDOFFS = Object.freeze(["hearth", "mirrorland", "frontier", "scientificLaw", "characters"]);

  const state = {
    mounted: false,
    root: null,
    thread: null,
    optionsPanel: null,
    doorsPanel: null,
    status: null,
    currentNode: DEFAULT_NODE,
    currentTopic: DEFAULT_TOPIC,
    currentRoomId: DEFAULT_ROOM_ID,
    currentRoomName: DEFAULT_ROOM_NAME,
    currentCardinal: DEFAULT_CARDINAL,
    currentScopeLane: "narrative",
    currentScopeStage: "entrance",
    lastResponse: null,
    lastOption: null,
    sessionTrail: [],
    visitedNodes: [],
    selectedTargets: [],
    selectedOptionKeys: [],
    returnStack: [],
    branchStack: [],
    transitionTrail: [],
    isRevealing: false,
    rushRequested: false,
    pendingController: null,
    apiAvailable: true,
    expressionAvailable: false,
    bootedAt: new Date().toISOString()
  };

  document.addEventListener("DOMContentLoaded", mountJeeves);

  if (document.readyState === "interactive" || document.readyState === "complete") {
    mountJeeves();
  }

  function mountJeeves() {
    if (state.mounted) return;

    const root = findOrCreateRoot();
    if (!root) return;

    state.root = root;
    state.root.setAttribute("data-jeeves-contract", CONTRACT);
    state.root.setAttribute("data-api-contract", API_CONTRACT);
    state.root.classList.add("hearth-jeeves-v25");

    ensureShell(root);
    bindRootEvents(root);

    state.expressionAvailable = Boolean(getExpression());

    state.mounted = true;

    const frame = applyExpressionFrame({
      source: "frontbrain_boot",
      bubbles: [
        "Welcome. I’m Jeeves.",
        "You are inside Hearth Mission Control — the window within the window.",
        "You can text me a question, continue deeper, or open a prepared door."
      ],
      options: cloneOptions(START_OPTIONS),
      handoffs: START_HANDOFFS.slice(),
      handoffLabels: buildHandoffLabels(START_HANDOFFS),
      routeHints: buildRouteHints(START_HANDOFFS),
      selectedTarget: DEFAULT_NODE,
      selectedLabel: "",
      promptMode: PROMPT_MODES.STORY,
      optionKind: OPTION_KINDS.CONVERSATION,
      bridgeMoment: BRIDGE_MOMENTS.ENTRANCE,
      movementIntent: MOVEMENT_INTENTS.ASK,
      conclusiveState: "open",
      currentTopic: DEFAULT_TOPIC
    }, {
      bridgeMoment: BRIDGE_MOMENTS.ENTRANCE,
      currentNode: DEFAULT_NODE,
      currentTopic: DEFAULT_TOPIC
    });

    renderFrame(frame, { boot: true });
  }

  function findOrCreateRoot() {
    const selectors = [
      "[data-jeeves-root]",
      "#hearthJeevesMount",
      "#jeevesMount",
      "#hearth-jeeves",
      ".hearth-jeeves"
    ];

    for (const selector of selectors) {
      const found = document.querySelector(selector);
      if (found) return found;
    }

    const host = document.querySelector("main") || document.body;
    if (!host) return null;

    const root = document.createElement("section");
    root.id = "hearthJeevesMount";
    root.setAttribute("data-jeeves-root", "true");
    root.setAttribute("aria-label", "Jeeves conversation");
    host.appendChild(root);

    return root;
  }

  function ensureShell(root) {
    let thread = root.querySelector("[data-jeeves-thread]");
    let optionsPanel = root.querySelector("[data-jeeves-options]");
    let doorsPanel = root.querySelector("[data-jeeves-doors]");
    let status = root.querySelector("[data-jeeves-status]");

    if (!thread) {
      thread = document.createElement("div");
      thread.setAttribute("data-jeeves-thread", "true");
      thread.className = "jeeves-thread";
      root.appendChild(thread);
    }

    if (!optionsPanel) {
      optionsPanel = document.createElement("div");
      optionsPanel.setAttribute("data-jeeves-options", "true");
      optionsPanel.className = "jeeves-options";
      root.appendChild(optionsPanel);
    }

    if (!doorsPanel) {
      doorsPanel = document.createElement("div");
      doorsPanel.setAttribute("data-jeeves-doors", "true");
      doorsPanel.className = "jeeves-doors";
      root.appendChild(doorsPanel);
    }

    if (!status) {
      status = document.createElement("div");
      status.setAttribute("data-jeeves-status", "true");
      status.className = "jeeves-status";
      status.setAttribute("aria-live", "polite");
      root.appendChild(status);
    }

    state.thread = thread;
    state.optionsPanel = optionsPanel;
    state.doorsPanel = doorsPanel;
    state.status = status;
  }

  function bindRootEvents(root) {
    root.addEventListener("click", function onRootClick(event) {
      const optionButton = event.target.closest("[data-jeeves-option-index]");
      if (optionButton) {
        event.preventDefault();
        const index = Number(optionButton.getAttribute("data-jeeves-option-index"));
        const option = state.lastResponse && state.lastResponse.options ? state.lastResponse.options[index] : null;
        if (option) handleOption(option);
        return;
      }

      const doorButton = event.target.closest("[data-jeeves-handoff-route]");
      if (doorButton) {
        event.preventDefault();
        const routeId = doorButton.getAttribute("data-jeeves-handoff-route");
        openRoute(routeId);
        return;
      }

      if (state.isRevealing) {
        state.rushRequested = true;
      }
    });
  }

  function renderFrame(rawFrame, meta) {
    const frame = normalizeFrame(rawFrame);
    state.lastResponse = frame;
    state.currentNode = frame.selectedTarget || state.currentNode || DEFAULT_NODE;
    state.currentTopic = frame.currentTopic || inferTopicFromTarget(state.currentNode);
    state.currentScopeLane = inferScopeLane(frame, state.currentNode);
    state.currentScopeStage = inferScopeStage(frame);

    clearPanel(state.optionsPanel);
    clearPanel(state.doorsPanel);

    setStatus("Jeeves is responding.");

    revealBeats(frame.bubbles, function afterReveal() {
      setStatus("");
      renderConversationOptions(frame.options);
      renderPreparedDoors(frame);
    }, meta);
  }

  function revealBeats(beats, done, meta) {
    const safeBeats = Array.isArray(beats) && beats.length ? beats : ["I’m here."];
    state.isRevealing = true;
    state.rushRequested = Boolean(meta && meta.rush);
    let index = 0;

    function next() {
      if (index >= safeBeats.length) {
        state.isRevealing = false;
        state.rushRequested = false;
        if (typeof done === "function") done();
        return;
      }

      appendBubble("jeeves", safeBeats[index]);
      index += 1;

      const delay = state.rushRequested ? 80 : delayForBeat(safeBeats[index - 1], index);
      window.setTimeout(next, delay);
    }

    next();
  }

  function delayForBeat(text, index) {
    const length = String(text || "").length;
    const base = 460;
    const scaled = Math.min(1100, Math.max(420, length * 8));
    return base + scaled + index * 80;
  }

  function appendBubble(speaker, text) {
    if (!state.thread) return;

    const bubble = document.createElement("div");
    bubble.className = "jeeves-bubble jeeves-bubble-" + speaker;
    bubble.setAttribute("data-jeeves-speaker", speaker);

    const body = document.createElement("div");
    body.className = "jeeves-bubble-body";
    body.textContent = sanitizeText(text);

    bubble.appendChild(body);
    state.thread.appendChild(bubble);
    scrollThreadToBottom();
  }

  function appendSystemBubble(text) {
    appendBubble("system", text);
  }

  function scrollThreadToBottom() {
    if (!state.thread) return;
    state.thread.scrollTop = state.thread.scrollHeight;
  }

  function renderConversationOptions(options) {
    clearPanel(state.optionsPanel);

    const normalized = normalizeOptions(options).slice(0, MAX_VISIBLE_OPTIONS);
    if (!normalized.length) return;

    const groups = groupOptions(normalized);

    groups.forEach(function renderGroup(group) {
      const section = document.createElement("section");
      section.className = "jeeves-option-group";
      section.setAttribute("data-jeeves-option-group", group.key);

      const heading = document.createElement("div");
      heading.className = "jeeves-option-heading";
      heading.textContent = group.heading;
      section.appendChild(heading);

      group.options.forEach(function renderOption(option) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "jeeves-option-button";
        button.setAttribute("data-jeeves-option-index", String(option.__index));
        button.setAttribute("data-option-kind", option.optionKind);
        button.setAttribute("data-prompt-mode", option.promptMode);
        button.setAttribute("data-archetype-alignment", option.archetypeAlignment);
        button.textContent = option.label;
        section.appendChild(button);
      });

      state.optionsPanel.appendChild(section);
    });
  }

  function groupOptions(options) {
    const indexed = options.map(function attachIndex(option, index) {
      return Object.assign({}, option, { __index: index });
    });

    const map = new Map();

    indexed.forEach(function addToGroup(option) {
      const kindMeta = OPTION_KIND_GROUPS[option.optionKind] || OPTION_KIND_GROUPS.conversation_prompt;
      const promptMeta = PROMPT_MODE_GROUPS[option.promptMode] || PROMPT_MODE_GROUPS.unknown_prompt;

      let key = option.optionKind;
      let heading = kindMeta.heading;
      let order = kindMeta.order;

      if (option.optionKind === OPTION_KINDS.CONVERSATION) {
        key = "conversation";
        heading = "Text Jeeves";
        order = 10;
      }

      if (option.optionKind === OPTION_KINDS.FORWARD) {
        key = "forward";
        heading = "Continue With Jeeves";
        order = 20;
      }

      if (option.optionKind === OPTION_KINDS.PARALLEL || option.optionKind === OPTION_KINDS.RETURN) {
        key = "movement";
        heading = "Move Through the House";
        order = 30;
      }

      if (option.optionKind === OPTION_KINDS.CONTROL) {
        key = "control";
        heading = "Re-center";
        order = 40;
      }

      if (!map.has(key)) {
        map.set(key, {
          key,
          heading,
          order,
          promptOrder: promptMeta.order,
          options: []
        });
      }

      map.get(key).options.push(option);
    });

    return Array.from(map.values()).sort(function sortGroups(a, b) {
      return a.order - b.order || a.promptOrder - b.promptOrder;
    });
  }

  function renderPreparedDoors(frame) {
    clearPanel(state.doorsPanel);

    const handoffs = Array.isArray(frame.handoffs) ? frame.handoffs.slice(0, MAX_VISIBLE_HANDOFFS) : [];
    if (!handoffs.length) return;

    const heading = document.createElement("div");
    heading.className = "jeeves-door-heading";
    heading.textContent = "Prepared Doors";
    state.doorsPanel.appendChild(heading);

    handoffs.forEach(function renderDoor(routeId) {
      const route = sanitizeRoute(routeId);
      const href = (frame.routeHints && frame.routeHints[route]) || ROUTE_HINTS[route] || "";
      if (!href) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "jeeves-door-button";
      button.setAttribute("data-jeeves-handoff-route", route);
      button.setAttribute("data-route-href", href);
      button.textContent = (frame.handoffLabels && frame.handoffLabels[route]) || DEFAULT_HANDOFF_LABELS[route] || ("Open " + route);
      state.doorsPanel.appendChild(button);
    });
  }

  function handleOption(rawOption) {
    const option = normalizeOption(rawOption);
    state.lastOption = option;

    appendBubble("visitor", option.label);
    clearPanel(state.optionsPanel);
    clearPanel(state.doorsPanel);

    updateMovementState(option);

    if (option.optionKind === OPTION_KINDS.ROUTE) {
      const route = TARGET_ROUTE_HINTS[option.target] || "";
      if (route) {
        openRoute(route);
        return;
      }
    }

    callNorth(option);
  }

  function callNorth(option) {
    const payload = buildApiPayload(option);

    if (state.pendingController) {
      try {
        state.pendingController.abort();
      } catch (_error) {}
    }

    const controller = new AbortController();
    state.pendingController = controller;

    setStatus("Jeeves is thinking.");
    appendSystemBubble("Jeeves is listening.");

    fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("JEEVES_API_" + response.status);
        }
        return response.json();
      })
      .then(function handleJson(json) {
        state.pendingController = null;
        removeLastSystemBubble();
        const frame = applyExpressionFrame(normalizeApiFrame(json, option), {
          bridgeMoment: option.bridgeMoment,
          selectedTarget: option.target,
          selectedLabel: option.label,
          currentNode: state.currentNode,
          currentTopic: state.currentTopic,
          option
        });
        renderFrame(frame);
      })
      .catch(function handleError(error) {
        state.pendingController = null;
        removeLastSystemBubble();

        if (error && error.name === "AbortError") return;

        state.apiAvailable = false;
        const fallback = applyExpressionFrame(localFallbackFrame(option, error), {
          bridgeMoment: option.bridgeMoment,
          selectedTarget: option.target,
          selectedLabel: option.label,
          currentNode: state.currentNode,
          currentTopic: state.currentTopic,
          option
        });

        renderFrame(fallback);
      });
  }

  function removeLastSystemBubble() {
    if (!state.thread) return;
    const bubbles = state.thread.querySelectorAll('[data-jeeves-speaker="system"]');
    const last = bubbles[bubbles.length - 1];
    if (last && last.parentNode) last.parentNode.removeChild(last);
  }

  function buildApiPayload(option) {
    const selectedTarget = option.target;
    const selectedLabel = option.label;
    const currentTopic = inferTopicFromTarget(selectedTarget);

    return {
      visitorText: selectedLabel,
      selectedLabel,
      selectedTarget,
      requestMode: "node_enrichment",

      promptMode: option.promptMode,
      optionKind: option.optionKind,
      archetypeAlignment: option.archetypeAlignment,
      bridgeMoment: option.bridgeMoment,
      movementIntent: option.movementIntent,

      bridgeContext: buildBridgeContext(option),
      branchStack: state.branchStack.slice(-MAX_TRAIL_ITEMS),
      transitionTrail: state.transitionTrail.slice(-MAX_TRAIL_ITEMS),

      activeHostPage: "hearth",
      currentRoomContext: "hearth",
      currentRoomRole: "mission_control",
      currentRoomPremise: "window_within_the_window",
      estateKnowledgeMode: "api_north_conversation_grammar",
      portalLogic: "hearth_mission_control_window_within_window",
      routeAuthority: "frontbrain_final_route_authority",

      currentNode: state.currentNode || DEFAULT_NODE,
      currentEntry: state.currentNode || DEFAULT_NODE,
      currentPath: state.currentNode || DEFAULT_NODE,
      currentTopic: state.currentTopic || currentTopic || DEFAULT_TOPIC,
      currentRoomId: state.currentRoomId || DEFAULT_ROOM_ID,
      currentRoomName: state.currentRoomName || DEFAULT_ROOM_NAME,
      currentCoordinateName: "East Control Deck",
      currentCardinal: state.currentCardinal || DEFAULT_CARDINAL,
      currentPlaceType: "mission_control",
      currentScopeLane: state.currentScopeLane || "narrative",
      currentVoiceMode: "conversation_thread",
      visitorPosture: option.promptMode,
      movement: option.movementIntent,

      pathDepth: state.transitionTrail.length,
      routeReadiness: computeRouteReadiness(),
      loopCount: computeLoopCount(selectedTarget),
      topicDepth: computeTopicDepth(currentTopic),
      revealDepth: state.transitionTrail.length + 1,

      expressionContract: getExpressionContract(),
      frontbrainContract: CONTRACT,
      cssContract: getCssContract(),

      allowedTargets: buildAllowedTargets(),
      allowedRoutes: buildAllowedRoutes(),

      sessionTrail: state.sessionTrail.slice(-MAX_TRAIL_ITEMS),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL_ITEMS),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL_ITEMS),
      selectedOptionKeys: state.selectedOptionKeys.slice(-MAX_TRAIL_ITEMS),
      returnStack: state.returnStack.slice(-MAX_TRAIL_ITEMS)
    };
  }

  function buildBridgeContext(option) {
    const priorNode = state.currentNode || DEFAULT_NODE;

    return {
      currentNode: priorNode,
      priorNode,
      selectedTarget: option.target,
      selectedLabel: option.label,
      promptMode: option.promptMode,
      optionKind: option.optionKind,
      archetypeAlignment: option.archetypeAlignment,
      bridgeMoment: option.bridgeMoment,
      movementIntent: option.movementIntent,
      currentTopic: state.currentTopic || inferTopicFromTarget(priorNode),
      currentScopeStage: state.currentScopeStage || "conversation",
      adjacentTarget: inferAdjacentTarget(option),
      adjacentLabel: inferAdjacentLabel(option),
      adjacentReason: inferAdjacentReason(option)
    };
  }

  function updateMovementState(option) {
    const priorNode = state.currentNode || DEFAULT_NODE;
    const nextNode = option.target || priorNode;
    const nextTopic = inferTopicFromTarget(nextNode);

    state.sessionTrail.push(option.label);
    state.selectedTargets.push(nextNode);
    state.selectedOptionKeys.push(option.promptMode + ":" + option.optionKind + ":" + nextNode);
    state.visitedNodes.push(nextNode);

    trimStateArrays();

    if (option.optionKind === OPTION_KINDS.RETURN) {
      const returned = state.returnStack.pop();
      if (returned) state.currentNode = returned;
    } else {
      if (nextNode !== priorNode) state.returnStack.push(priorNode);
      state.currentNode = nextNode;
    }

    state.currentTopic = nextTopic;

    if (option.optionKind === OPTION_KINDS.PARALLEL || option.optionKind === OPTION_KINDS.FORWARD) {
      state.branchStack.push({
        from: priorNode,
        to: nextNode,
        label: option.label,
        optionKind: option.optionKind,
        promptMode: option.promptMode,
        bridgeMoment: option.bridgeMoment,
        at: new Date().toISOString()
      });
    }

    state.transitionTrail.push({
      from: priorNode,
      to: nextNode,
      label: option.label,
      optionKind: option.optionKind,
      promptMode: option.promptMode,
      bridgeMoment: option.bridgeMoment,
      at: new Date().toISOString()
    });

    trimStateArrays();
  }

  function trimStateArrays() {
    state.sessionTrail = state.sessionTrail.slice(-MAX_TRAIL_ITEMS);
    state.visitedNodes = state.visitedNodes.slice(-MAX_TRAIL_ITEMS);
    state.selectedTargets = state.selectedTargets.slice(-MAX_TRAIL_ITEMS);
    state.selectedOptionKeys = state.selectedOptionKeys.slice(-MAX_TRAIL_ITEMS);
    state.returnStack = state.returnStack.slice(-MAX_TRAIL_ITEMS);
    state.branchStack = state.branchStack.slice(-MAX_TRAIL_ITEMS);
    state.transitionTrail = state.transitionTrail.slice(-MAX_TRAIL_ITEMS);
  }

  function normalizeApiFrame(json, option) {
    const frame = normalizeFrame({
      source: json && json.source ? json.source : "api_north",
      bubbles: (json && (json.bubbles || json.beats)) || [],
      options: (json && json.options) || [],
      handoffs: (json && json.handoffs) || [],
      handoffLabels: (json && json.handoffLabels) || {},
      routeHints: (json && json.routeHints) || {},
      selectedTarget: (json && json.selectedTarget) || option.target,
      selectedLabel: (json && json.selectedLabel) || option.label,
      promptMode: (json && json.promptMode) || option.promptMode,
      optionKind: (json && json.optionKind) || option.optionKind,
      archetypeAlignment: (json && json.archetypeAlignment) || option.archetypeAlignment,
      bridgeMoment: (json && json.bridgeMoment) || option.bridgeMoment,
      movementIntent: (json && json.movementIntent) || option.movementIntent,
      currentTopic: (json && json.intent) || inferTopicFromTarget(option.target),
      conclusiveState: (json && json.conclusiveState) || "open",
      confidence: (json && json.confidence) || "medium",
      canonStatus: (json && json.canonStatus) || "grounded",
      narrativeFrame: json && json.narrativeFrame ? json.narrativeFrame : null
    });

    return ensureMinimumOptions(frame, option);
  }

  function ensureMinimumOptions(frame, option) {
    if (frame.options.length) return frame;

    frame.options = fallbackOptionsForTopic(inferTopicFromTarget(option.target));
    return frame;
  }

  function localFallbackFrame(option, error) {
    const topic = inferTopicFromTarget(option.target);

    return {
      source: "frontbrain_local_fallback",
      bubbles: fallbackBubblesForOption(option, error),
      options: fallbackOptionsForTopic(topic),
      handoffs: fallbackHandoffsForTopic(topic),
      handoffLabels: buildHandoffLabels(fallbackHandoffsForTopic(topic)),
      routeHints: buildRouteHints(fallbackHandoffsForTopic(topic)),
      selectedTarget: option.target,
      selectedLabel: option.label,
      promptMode: option.promptMode,
      optionKind: option.optionKind,
      archetypeAlignment: option.archetypeAlignment,
      bridgeMoment: option.bridgeMoment,
      movementIntent: option.movementIntent,
      currentTopic: topic,
      conclusiveState: "open",
      confidence: "medium",
      canonStatus: "fallback"
    };
  }

  function fallbackBubblesForOption(option) {
    const topic = inferTopicFromTarget(option.target);

    if (topic === "characters") {
      return [
        "The Characters are not just labels. They are the people who make Mirrorland readable.",
        "Each one carries a necessary part of the larger story: shelter, repair, warning, survival, signal, boundary, sequence, or help beyond the manor.",
        "You can meet them one by one, ask why they matter, or use the mirror to see what pattern you recognize in yourself."
      ];
    }

    if (topic === "mirrorland") {
      return [
        "Mirrorland is where possible futures become visible before they become final.",
        "Three roads are already in motion: consequence, survival, and possibility.",
        "If you stay here, the next step is to understand the roads, then meet the people who make them matter."
      ];
    }

    if (topic === "scientificLaw" || topic === "laws") {
      return [
        "The proof path asks whether a claim can survive being tested.",
        "A claim is not strong because it sounds convincing. It becomes stronger when it can be checked, measured, corrected, and limited.",
        "You can ask what needs testing, what counts as evidence, or what could prove the claim wrong."
      ];
    }

    if (topic === "frontier") {
      return [
        "Frontier is where future ideas have to work in the real world.",
        "Energy, water, waste, infrastructure, feedback, cities, and direction all have to survive practical pressure.",
        "You can choose a system, test the claim, or return to Hearth."
      ];
    }

    if (topic === "hearth") {
      return [
        "Hearth is Mission Control — the window within the window.",
        "This is where the view into future possibility is coordinated before it becomes a route, test, or consequence.",
        "You can ask what Hearth controls, why it answers to proof, or where to go next."
      ];
    }

    if (topic === "sean") {
      return [
        "Sean Mansfield is the creator behind the estate, rooms, laws, worlds, characters, and conversation structure.",
        "That path connects naturally to This Underdog because the work is tied to pressure becoming voice.",
        "You can ask who Sean is, what This Underdog means, or how the work connects back to you."
      ];
    }

    if (topic === "underdog") {
      return [
        "This Underdog is the inner voice that carried pressure before it had language.",
        "It is not only a page about Sean. It is also a way for the visitor to recognize pressure becoming direction.",
        "You can ask what it means, how it connects to Sean, or where you fit into the mirror."
      ];
    }

    return [
      "I can still keep the conversation moving from here.",
      "Ask me what this place is, why it should be trusted, how it works in real life, or how it connects back to you."
    ];
  }

  function fallbackOptionsForTopic(topic) {
    if (topic === "mirrorland") {
      return [
        makeConversationOption("What is happening in Mirrorland?", "mirrorlandPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.STORY),
        makeConversationOption("What could go wrong here?", "ziontsPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("What can still be saved?", "hEarthPath", PROMPT_MODES.PRACTICAL, ARCHETYPE_ALIGNMENTS.PRACTICAL),
        makeConversationOption("I’d like to meet the Characters.", "charactersPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL)
      ];
    }

    if (topic === "characters") {
      return [
        makeConversationOption("Who are the Characters?", "charactersPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.STORY),
        makeConversationOption("Why do these Characters matter?", "characterStoryPressurePath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("Who should I meet first?", "characterFirstPath", PROMPT_MODES.PROGRESSION, ARCHETYPE_ALIGNMENTS.STORY),
        makeConversationOption("Which Character might I recognize in myself?", "characterArchetypeMirrorPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL)
      ];
    }

    if (topic === "scientificLaw" || topic === "laws") {
      return [
        makeConversationOption("What needs to be tested?", "scientificLawPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("Why should I trust this?", "scientificLawEvidencePath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("What would count as proof?", "scientificLawMeasurePath", PROMPT_MODES.PRACTICAL, ARCHETYPE_ALIGNMENTS.PRACTICAL),
        makeConversationOption("What could prove this wrong?", "scientificLawLimitsPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.BOUNDARY)
      ];
    }

    if (topic === "frontier") {
      return [
        makeConversationOption("What has to work in the real world?", "frontierPath", PROMPT_MODES.PRACTICAL, ARCHETYPE_ALIGNMENTS.PRACTICAL),
        makeConversationOption("Which system should I look at first?", "frontierSystemsPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.SYSTEMS),
        makeConversationOption("Can this survive a real test?", "scientificLawPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("What happens if the system fails?", "frontierLawPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.BOUNDARY)
      ];
    }

    if (topic === "hearth") {
      return [
        makeConversationOption("Where am I right now?", "hearthPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.STORY),
        makeConversationOption("What is Hearth controlling?", "hearthConstructPath", PROMPT_MODES.PRACTICAL, ARCHETYPE_ALIGNMENTS.SYSTEMS),
        makeConversationOption("Why does this room answer to proof?", "hearthLawPath", PROMPT_MODES.SKEPTIC, ARCHETYPE_ALIGNMENTS.PROOF),
        makeConversationOption("Where should I go from here?", "whereToStart", PROMPT_MODES.PROGRESSION, ARCHETYPE_ALIGNMENTS.STORY)
      ];
    }

    if (topic === "sean") {
      return [
        makeConversationOption("Who is Sean Mansfield?", "seanPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.SOURCE),
        makeConversationOption("What is This Underdog?", "underdogPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL),
        makeConversationOption("How did transition shape this?", "underdogPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.SOURCE),
        makeConversationOption("What does this have to do with me?", "characterArchetypeMirrorPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL)
      ];
    }

    if (topic === "underdog") {
      return [
        makeConversationOption("What is This Underdog?", "underdogPath", PROMPT_MODES.STORY, ARCHETYPE_ALIGNMENTS.PERSONAL),
        makeConversationOption("How does pressure become a voice?", "underdogPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL),
        makeConversationOption("How does this connect back to Sean?", "seanPath", PROMPT_MODES.PROGRESSION, ARCHETYPE_ALIGNMENTS.SOURCE),
        makeConversationOption("Where do I fit into this?", "characterArchetypeMirrorPath", PROMPT_MODES.PERSONAL, ARCHETYPE_ALIGNMENTS.PERSONAL)
      ];
    }

    return cloneOptions(START_OPTIONS);
  }

  function fallbackHandoffsForTopic(topic) {
    if (topic === "mirrorland") return ["mirrorland", "audralia", "hEarth", "characters", "hearth"];
    if (topic === "characters") return ["characters", "mirrorland", "coherenceDiagnostic", "hearth"];
    if (topic === "scientificLaw" || topic === "laws") return ["scientificLaw", "laws", "gauges", "frontier", "hearth"];
    if (topic === "frontier") return ["frontier", "scientificLaw", "audralia", "hearth"];
    if (topic === "hearth") return ["hearth", "mirrorland", "frontier", "scientificLaw", "characters"];
    if (topic === "sean") return ["meetSean", "aboutUnderdog", "nineSummits", "hearth"];
    if (topic === "underdog") return ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "nineSummits"];
    return START_HANDOFFS.slice();
  }

  function normalizeFrame(frame) {
    const safe = frame && typeof frame === "object" ? frame : {};

    const selectedTarget = sanitizeTarget(safe.selectedTarget || state.currentNode || DEFAULT_NODE);
    const topic = safe.currentTopic || safe.intent || inferTopicFromTarget(selectedTarget);

    return {
      source: safe.source || "frontbrain",
      bubbles: normalizeBubbles(safe.bubbles || safe.beats),
      options: normalizeOptions(safe.options || [], null, null),
      handoffs: normalizeHandoffs(safe.handoffs || []),
      handoffLabels: safe.handoffLabels || {},
      routeHints: safe.routeHints || {},
      selectedTarget,
      selectedLabel: sanitizeText(safe.selectedLabel || ""),
      promptMode: normalizePromptMode(safe.promptMode || PROMPT_MODES.UNKNOWN),
      optionKind: normalizeOptionKind(safe.optionKind || OPTION_KINDS.CONVERSATION),
      archetypeAlignment: normalizeArchetypeAlignment(safe.archetypeAlignment || ARCHETYPE_ALIGNMENTS.UNKNOWN),
      bridgeMoment: normalizeBridgeMoment(safe.bridgeMoment || BRIDGE_MOMENTS.NONE),
      movementIntent: normalizeMovementIntent(safe.movementIntent || MOVEMENT_INTENTS.UNKNOWN),
      currentTopic: topic,
      conclusiveState: safe.conclusiveState || "open",
      confidence: safe.confidence || "medium",
      canonStatus: safe.canonStatus || "grounded",
      narrativeFrame: safe.narrativeFrame || null
    };
  }

  function normalizeBubbles(bubbles) {
    if (!Array.isArray(bubbles)) return [];
    return bubbles.map(sanitizeText).filter(Boolean);
  }

  function normalizeOptions(options, allowed, ctx) {
    if (!Array.isArray(options)) return [];

    return options.map(function normalizeOptionItem(option) {
      return normalizeOption(option, ctx);
    }).filter(function keepOption(option) {
      if (!option || !option.label || !option.target) return false;
      if (allowed && allowed.targetSet && !allowed.targetSet.has(option.target)) return false;
      return true;
    });
  }

  function normalizeOption(option, ctx) {
    if (!option || typeof option !== "object") return null;

    const target = sanitizeTarget(option.target || "cleanDoor");
    const rawLabel = sanitizeText(option.label || "");
    const label = normalizeHumanPrompt(rawLabel, target);
    const optionKind = normalizeOptionKind(option.optionKind || inferOptionKind(option, label));
    const promptMode = normalizePromptMode(option.promptMode || inferPromptModeFromOption(option, label, target, ctx));
    const archetypeAlignment = normalizeArchetypeAlignment(option.archetypeAlignment || inferAlignmentFromTarget(target));
    const bridgeMoment = normalizeBridgeMoment(option.bridgeMoment || inferBridgeMoment(optionKind));
    const movementIntent = normalizeMovementIntent(option.movementIntent || inferMovementFromKind(optionKind));

    return {
      label,
      target,
      type: sanitizeOptionType(option.type, optionKind),
      scopeLane: sanitizeScopeLane(option.scopeLane, target),
      promptMode,
      optionKind,
      archetypeAlignment,
      bridgeMoment,
      movementIntent
    };
  }

  function normalizeHandoffs(handoffs) {
    if (!Array.isArray(handoffs)) return [];
    return handoffs.map(sanitizeRoute).filter(Boolean);
  }

  function normalizeHumanPrompt(label, target) {
    if (!label) return fallbackLabelForTarget(target);

    const trimmed = sanitizeText(label);
    const actionLike = /^(open|visit|launch|go to)\b/i.test(trimmed);

    if (actionLike) {
      return fallbackLabelForTarget(target);
    }

    return trimmed;
  }

  function fallbackLabelForTarget(target) {
    const topic = inferTopicFromTarget(target);

    const labels = {
      hearthPath: "Where am I right now?",
      mirrorlandPath: "What is happening in Mirrorland?",
      charactersPath: "I’d like to meet the Characters.",
      scientificLawPath: "What needs to be tested?",
      lawsPath: "What keeps this honest?",
      gaugesPath: "What is working, and what still needs proof?",
      frontierPath: "What has to work in the real world?",
      audraliaPath: "What is Audralia?",
      hEarthPath: "What can still be saved?",
      ziontsPath: "What could go wrong here?",
      seanPath: "Who is Sean Mansfield?",
      underdogPath: "What is This Underdog?",
      characterArchetypeMirrorPath: "Which Character might I recognize in myself?",
      whereToStart: "Where should I start?",
      cleanDoor: "What is the cleanest next door?",
      recenterNode: "Can you re-center me?"
    };

    return labels[target] || defaultPromptForTopic(topic);
  }

  function defaultPromptForTopic(topic) {
    if (topic === "characters") return "Who are the Characters?";
    if (topic === "mirrorland") return "What is happening here?";
    if (topic === "frontier") return "What has to work in the real world?";
    if (topic === "scientificLaw" || topic === "laws") return "Why should I trust this?";
    if (topic === "hearth") return "Where am I right now?";
    if (topic === "underdog") return "What does this have to do with me?";
    return "Can you tell me more?";
  }

  function inferOptionKind(option, label) {
    const text = [label, option && option.target, option && option.type].join(" ").toLowerCase();

    if (option && option.type === "control") return OPTION_KINDS.CONTROL;
    if (/\breturn|back|re-center|recenter|start over\b/.test(text)) return OPTION_KINDS.RETURN;
    if (/\bcross|nearby|related room|go into|go back into\b/.test(text)) return OPTION_KINDS.PARALLEL;
    if (/\bcontinue|next|deeper|what happens next|who should i meet first\b/.test(text)) return OPTION_KINDS.FORWARD;
    if (/^(open|visit|launch|go to)\b/.test(text)) return OPTION_KINDS.ROUTE;

    return OPTION_KINDS.CONVERSATION;
  }

  function inferPromptModeFromOption(option, label, target) {
    const text = [label, target, option && option.promptMode].join(" ").toLowerCase();

    if (/\bwhy should i trust|prove|proof|evidence|what could prove|why.*matter|why.*important|can this survive\b/.test(text)) return PROMPT_MODES.SKEPTIC;
    if (/\breal world|work|system|use|practical|frontier|what has to work|what can i do\b/.test(text)) return PROMPT_MODES.PRACTICAL;
    if (/\bme|myself|recognize|fit into|my pressure|underdog|diagnostic|archetype\b/.test(text)) return PROMPT_MODES.PERSONAL;
    if (/\bcontinue|next|deeper|who should i meet first|where should i go\b/.test(text)) return PROMPT_MODES.PROGRESSION;
    if (/\brecenter|re-center|return|back|start over|lost\b/.test(text)) return PROMPT_MODES.RECENTER;

    return PROMPT_MODES.STORY;
  }

  function inferAlignmentFromTarget(target) {
    if (/scientific|law|proof|gauge|limits|evidence|measure/i.test(target)) return ARCHETYPE_ALIGNMENTS.PROOF;
    if (/frontier|system|product|energy|water|waste|infrastructure/i.test(target)) return ARCHETYPE_ALIGNMENTS.PRACTICAL;
    if (/archetype|diagnostic|underdog|mirrorMe|self/i.test(target)) return ARCHETYPE_ALIGNMENTS.PERSONAL;
    if (/sean|summits/i.test(target)) return ARCHETYPE_ALIGNMENTS.SOURCE;
    if (/hearth|mirrorland|audralia|zionts|characters|hEarth/i.test(target)) return ARCHETYPE_ALIGNMENTS.STORY;
    return ARCHETYPE_ALIGNMENTS.UNKNOWN;
  }

  function inferBridgeMoment(optionKind) {
    if (optionKind === OPTION_KINDS.FORWARD) return BRIDGE_MOMENTS.AFTER_KNOWLEDGE;
    if (optionKind === OPTION_KINDS.RETURN) return BRIDGE_MOMENTS.RETURN;
    if (optionKind === OPTION_KINDS.PARALLEL) return BRIDGE_MOMENTS.PARALLEL;
    if (optionKind === OPTION_KINDS.ROUTE) return BRIDGE_MOMENTS.PREPARED_DOOR;
    if (optionKind === OPTION_KINDS.CONTROL) return BRIDGE_MOMENTS.RECENTER;
    return BRIDGE_MOMENTS.BEFORE_KNOWLEDGE;
  }

  function inferMovementFromKind(optionKind) {
    if (optionKind === OPTION_KINDS.FORWARD) return MOVEMENT_INTENTS.CONTINUE;
    if (optionKind === OPTION_KINDS.RETURN) return MOVEMENT_INTENTS.RETURN;
    if (optionKind === OPTION_KINDS.PARALLEL) return MOVEMENT_INTENTS.CROSS;
    if (optionKind === OPTION_KINDS.ROUTE) return MOVEMENT_INTENTS.OPEN;
    if (optionKind === OPTION_KINDS.CONTROL) return MOVEMENT_INTENTS.RECENTER;
    return MOVEMENT_INTENTS.ASK;
  }

  function sanitizeOptionType(type, optionKind) {
    if (optionKind === OPTION_KINDS.CONTROL || optionKind === OPTION_KINDS.RETURN) return "control";
    if (["conversation", "topic", "calibration", "back", "control"].includes(type)) return type;
    return "conversation";
  }

  function sanitizeScopeLane(scopeLane, target) {
    if (scopeLane === "narrative") return "narrative";
    return isNarrativeTarget(target) ? "narrative" : "objective";
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

  function sanitizeTarget(value) {
    return String(value || "").trim();
  }

  function sanitizeRoute(value) {
    return String(value || "").trim();
  }

  function sanitizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function clearPanel(panel) {
    if (!panel) return;
    while (panel.firstChild) panel.removeChild(panel.firstChild);
  }

  function setStatus(text) {
    if (!state.status) return;
    state.status.textContent = text || "";
  }

  function makeConversationOption(label, target, promptMode, archetypeAlignment) {
    return {
      label,
      target,
      type: "conversation",
      scopeLane: isNarrativeTarget(target) ? "narrative" : "objective",
      promptMode,
      optionKind: OPTION_KINDS.CONVERSATION,
      archetypeAlignment,
      bridgeMoment: BRIDGE_MOMENTS.BEFORE_KNOWLEDGE,
      movementIntent: MOVEMENT_INTENTS.ASK
    };
  }

  function cloneOptions(options) {
    return JSON.parse(JSON.stringify(options || []));
  }

  function inferTopicFromTarget(target) {
    return NODE_TOPIC_MAP[target] || DEFAULT_TOPIC;
  }

  function inferScopeLane(frame, target) {
    if (frame && frame.scopeLane) return frame.scopeLane;
    return isNarrativeTarget(target) ? "narrative" : "objective";
  }

  function inferScopeStage(frame) {
    if (!frame) return "conversation";
    if (frame.bridgeMoment === BRIDGE_MOMENTS.ENTRANCE) return "entrance";
    if (frame.conclusiveState === "complete") return "complete";
    if (frame.optionKind === OPTION_KINDS.FORWARD) return "deeper";
    return "conversation";
  }

  function buildAllowedTargets() {
    return Array.from(new Set([
      "hearthPath",
      "hearthFacilityPath",
      "hearthConstructPath",
      "hearthFrontierPath",
      "hearthLawPath",
      "mirrorlandPath",
      "atriumPath",
      "atlasPath",
      "audraliaPath",
      "hEarthPath",
      "ziontsPath",
      "charactersPath",
      "characterIdentityPath",
      "characterRelationshipsPath",
      "characterStoryPressurePath",
      "characterFirstPath",
      "characterArchetypeMirrorPath",
      "selfLearningPath",
      "scientificLawPath",
      "scientificLawTheoryPath",
      "scientificLawEvidencePath",
      "scientificLawMeasurePath",
      "scientificLawLimitsPath",
      "lawsPath",
      "gaugesPath",
      "frontierPath",
      "frontierSystemsPath",
      "frontierEnergyPath",
      "frontierWaterPath",
      "frontierWastePath",
      "frontierClosedLoopPath",
      "frontierInfrastructurePath",
      "frontierLawPath",
      "seanPath",
      "underdogPath",
      "nineSummitsPath",
      "nineSummitsBookPath",
      "productsPath",
      "diagnosticPath",
      "whereToStart",
      "compassPath",
      "siteGuidePath",
      "cleanDoor",
      "returnFork",
      "recenterNode",
      "switchTopics",
      "sharpQuestion"
    ]));
  }

  function buildAllowedRoutes() {
    return Array.from(new Set([
      "hearth",
      "mirrorland",
      "showroom",
      "audralia",
      "hEarth",
      "zionts",
      "frontier",
      "frontierEnergy",
      "frontierWater",
      "frontierWaste",
      "frontierClosedLoop",
      "frontierInfrastructure",
      "scientificLaw",
      "laws",
      "gauges",
      "characters",
      "coherenceDiagnostic",
      "meetSean",
      "aboutUnderdog",
      "nineSummits",
      "products",
      "siteGuide",
      "compass"
    ]));
  }

  function buildHandoffLabels(routes) {
    const labels = {};
    (routes || []).forEach(function addLabel(route) {
      labels[route] = DEFAULT_HANDOFF_LABELS[route] || ("Open " + route);
    });
    return labels;
  }

  function buildRouteHints(routes) {
    const hints = {};
    (routes || []).forEach(function addHint(route) {
      if (ROUTE_HINTS[route]) hints[route] = ROUTE_HINTS[route];
    });
    return hints;
  }

  function openRoute(routeId) {
    const route = sanitizeRoute(routeId);
    const href = ROUTE_HINTS[route];

    if (!href) {
      appendBubble("jeeves", "I do not have a clean door for that route yet.");
      renderPreparedDoors(state.lastResponse || {});
      return;
    }

    setStatus("Opening " + ((DEFAULT_HANDOFF_LABELS[route] || route).replace(/^Open\s+/i, "")) + ".");
    window.location.href = href;
  }

  function computeRouteReadiness() {
    return Math.min(4, Math.max(0, state.transitionTrail.length));
  }

  function computeLoopCount(target) {
    return state.selectedTargets.filter(function count(item) {
      return item === target;
    }).length;
  }

  function computeTopicDepth(topic) {
    return state.transitionTrail.filter(function count(item) {
      return inferTopicFromTarget(item.to) === topic;
    }).length;
  }

  function inferAdjacentTarget(option) {
    const topic = inferTopicFromTarget(option.target);

    if (topic === "characters") return "mirrorlandPath";
    if (topic === "mirrorland") return "charactersPath";
    if (topic === "frontier") return "scientificLawPath";
    if (topic === "scientificLaw" || topic === "laws") return "frontierPath";
    if (topic === "hearth") return "mirrorlandPath";
    if (topic === "sean") return "underdogPath";
    if (topic === "underdog") return "seanPath";

    return "";
  }

  function inferAdjacentLabel(option) {
    const adjacent = inferAdjacentTarget(option);
    if (!adjacent) return "";

    if (adjacent === "mirrorlandPath") return "What is happening in Mirrorland?";
    if (adjacent === "charactersPath") return "I’d like to meet the Characters.";
    if (adjacent === "scientificLawPath") return "Can this survive a real test?";
    if (adjacent === "frontierPath") return "What has to work in the real world?";
    if (adjacent === "underdogPath") return "What is This Underdog?";
    if (adjacent === "seanPath") return "Who is Sean Mansfield?";

    return fallbackLabelForTarget(adjacent);
  }

  function inferAdjacentReason(option) {
    const topic = inferTopicFromTarget(option.target);

    if (topic === "characters") return "Characters make Mirrorland readable.";
    if (topic === "mirrorland") return "Mirrorland becomes clearer when the Characters enter it.";
    if (topic === "frontier") return "Frontier claims have to answer to proof.";
    if (topic === "scientificLaw" || topic === "laws") return "Proof becomes useful when it can return to real systems.";
    if (topic === "hearth") return "Hearth coordinates the view before it becomes a path.";
    if (topic === "sean") return "The creator path connects to the pressure voice.";
    if (topic === "underdog") return "The underdog voice connects back to the creator path.";

    return "";
  }

  function getExpression() {
    return window.HEARTH_JEEVES_EXPRESSION ||
      window.HEARTH_JEEVES_EXPRESSION_BRIDGE ||
      (window.HEARTH && window.HEARTH.jeevesExpression) ||
      null;
  }

  function getExpressionContract() {
    const expression = getExpression();
    if (!expression) return "";
    return expression.CONTRACT || expression.contract || expression.contractId || "";
  }

  function getCssContract() {
    const root = document.documentElement;
    return root ? root.getAttribute("data-hearth-css-contract") || "" : "";
  }

  function applyExpressionFrame(frame, context) {
    const expression = getExpression();
    if (!expression) return frame;

    let shaped = frame;

    try {
      if (typeof expression.shapeConversationFrame === "function") {
        shaped = expression.shapeConversationFrame(shaped, context || {}) || shaped;
      }

      if (typeof expression.shapeOptions === "function") {
        shaped.options = expression.shapeOptions(shaped.options || [], context || {}) || shaped.options;
      }

      if (typeof expression.shapeForkBridge === "function" && context && context.bridgeMoment) {
        const bridge = expression.shapeForkBridge(context) || null;
        if (bridge && Array.isArray(bridge.bubbles) && bridge.bubbles.length) {
          shaped.bubbles = bridge.bubbles.concat(shaped.bubbles || []);
        }
        if (bridge && Array.isArray(bridge.options) && bridge.options.length) {
          shaped.options = bridge.options.concat(shaped.options || []);
        }
      }
    } catch (error) {
      console.warn("[Jeeves Expression] shaping failed", error);
    }

    return shaped;
  }

  window.HEARTH_JEEVES_FRONTBRAIN = {
    CONTRACT,
    PREVIOUS_CONTRACT,
    API_CONTRACT,
    state,
    renderFrame,
    handleOption,
    callNorth,
    buildApiPayload,
    normalizeFrame,
    normalizeOption,
    openRoute,
    mount: mountJeeves
  };
})();
