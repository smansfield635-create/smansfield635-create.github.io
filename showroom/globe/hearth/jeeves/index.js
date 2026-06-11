// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_GUIDED_PATH_READING_RHYTHM_ALIGNMENT_TNT_v25_3
// Full-file replacement.
// Client-side frontbrain / visible conversation carrier only.
// Purpose:
// - Preserve v25.1 shell boot repair.
// - Preserve the v25.2 split-interface Jeeves construct.
// - Close loose front-end alignment against API/North v5.1 and Expression v5.1.
// - Restore reading rhythm: Jeeves reveals messages one at a time.
// - Toggle house state between listening and typing.
// - Let screen taps speed the current Jeeves reveal.
// - Add API endpoint fallback without changing the meaning contract.
// - Send explicit bridgeContext to API/North.
// Does not own:
// - API/North canon
// - Expression wording authority
// - CSS layout
// - HTML shell authority
// - final server meaning
//

"use strict";

(function mountHearthJeevesFrontbrain(global) {
  const CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_GUIDED_PATH_READING_RHYTHM_ALIGNMENT_TNT_v25_3";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_GUIDED_PATH_RHYTHM_SHELL_BOUND_TNT_v25_2";

  const API_ENDPOINTS = Object.freeze([
    "/api/jeeves",
    "/api/jeeves.js"
  ]);

  const ROOT_ID = "hearthJeevesMount";

  const MAX_THREAD_BUBBLES = 80;
  const MAX_TRAIL_ITEMS = 24;

  const READ_BASE_MS = 650;
  const READ_PER_CHAR_MS = 20;
  const READ_MAX_MS = 3600;

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
    BEFORE: "before_knowledge",
    AFTER: "after_knowledge",
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
    OPEN_DOOR: "open_prepared_door",
    RECENTER: "recenter",
    UNKNOWN: "unknown"
  });

  const STAGES = Object.freeze({
    BOOT: "boot",
    ENTRANCE_OVERVIEW: "entrance_overview",
    SPLIT_INTERFACE_GATE: "split_interface_gate",
    TRADITIONAL_WEBSITE_LANE: "traditional_website_lane",
    NARRATIVE_PATH_LANE: "narrative_path_lane",
    MISSION_LANE: "mission_lane",
    BRIDGE_LANE: "bridge_lane",
    DIAGNOSTIC_REFERRAL: "diagnostic_referral",
    OPEN_CONVERSATION: "open_conversation"
  });

  const LANES = Object.freeze({
    UNKNOWN: "",
    TRADITIONAL: "traditional",
    NARRATIVE: "narrative",
    BRIDGE: "bridge",
    DIAGNOSTIC: "diagnostic"
  });

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
    COMPASS: "compassPath",
    PRODUCTS: "productsPath",
    LAWS: "lawsPath",
    SEAN: "seanPath",
    UNDERDOG: "underdogPath",
    HEARTH: "hearthPath",
    FRONTIER: "frontierPath",
    SCIENTIFIC_LAW: "scientificLawPath",
    CHARACTERS: "charactersPath",
    RECENTER: "recenterNode",
    CLEAN_DOOR: "cleanDoor"
  });

  const ROUTES = Object.freeze({
    COMPASS: "compass",
    HOME: "home",
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
    ZIONTS: "zionts",
    AUDRALIA: "audralia",
    H_EARTH: "hEarth",
    FRONTIER: "frontier",
    CHARACTERS: "characters",
    NINE_SUMMITS: "nineSummits",
    UNDERDOG: "aboutUnderdog"
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

  const HANDOFF_LABELS = Object.freeze({
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
    compassPath: "How does the Compass help me start?",
    productsPath: "What can I actually do here?",
    lawsPath: "What keeps this honest?",
    seanPath: "Who is Sean Mansfield?",
    underdogPath: "What is This Underdog?",
    hearthPath: "What is Hearth?",
    frontierPath: "What is the Frontier Playground?",
    scientificLawPath: "What needs to be tested?",
    charactersPath: "Who are the Characters?",
    recenterNode: "Can you re-center me?",
    cleanDoor: "What is the cleanest next door?"
  });

  const BOOT_BUBBLES = Object.freeze([
    "Welcome. I’m Jeeves.",
    "DiamondGateBridge.com has two ways in.",
    "One side is the traditional website: the public pages, Compass, Products, Laws, and the creator path.",
    "The other side is the narrative path: I can guide you through rooms, worlds, Characters, proof, and future-facing systems."
  ]);

  const START_OPTIONS = Object.freeze([
    makeConversationOption(
      "What is DiamondGateBridge.com?",
      TARGETS.DIAMOND_GATE_OVERVIEW,
      PROMPT_MODES.STORY,
      ARCHETYPE_ALIGNMENTS.STORY,
      BRIDGE_MOMENTS.ENTRANCE,
      MOVEMENT_INTENTS.ASK,
      "objective"
    ),
    makeConversationOption(
      "What is the narrative path?",
      TARGETS.NARRATIVE_PATH,
      PROMPT_MODES.STORY,
      ARCHETYPE_ALIGNMENTS.STORY,
      BRIDGE_MOMENTS.ENTRANCE,
      MOVEMENT_INTENTS.ASK,
      "narrative"
    ),
    makeConversationOption(
      "What is the traditional website for?",
      TARGETS.TRADITIONAL_WEBSITE,
      PROMPT_MODES.STORY,
      ARCHETYPE_ALIGNMENTS.STORY,
      BRIDGE_MOMENTS.ENTRANCE,
      MOVEMENT_INTENTS.ASK,
      "objective"
    ),
    makeConversationOption(
      "What is the mission behind this?",
      TARGETS.MISSION_OVERVIEW,
      PROMPT_MODES.PERSONAL,
      ARCHETYPE_ALIGNMENTS.PERSONAL,
      BRIDGE_MOMENTS.ENTRANCE,
      MOVEMENT_INTENTS.ASK,
      "narrative"
    ),
    makeConversationOption(
      "Why does this matter in the real world?",
      TARGETS.PRACTICAL_RELEVANCE,
      PROMPT_MODES.PRACTICAL,
      ARCHETYPE_ALIGNMENTS.PRACTICAL,
      BRIDGE_MOMENTS.ENTRANCE,
      MOVEMENT_INTENTS.ASK,
      "objective"
    )
  ]);

  const START_HANDOFFS = Object.freeze([
    ROUTES.MIRRORLAND,
    ROUTES.SITE_GUIDE,
    ROUTES.COMPASS,
    ROUTES.MEET_SEAN
  ]);

  const state = {
    ready: false,
    busy: false,
    booted: false,
    userInteracted: false,

    root: null,
    shell: null,

    currentConversationStage: STAGES.BOOT,
    currentEntryLane: LANES.UNKNOWN,
    lastLane: LANES.UNKNOWN,
    bridgeOffered: false,

    currentNode: TARGETS.DIAMOND_GATE_OVERVIEW,
    currentPath: TARGETS.DIAMOND_GATE_OVERVIEW,
    currentTopic: "diamondGate",
    currentScopeLane: "objective",

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
    expressionReadyPending: false
  };

  global.HEARTH_JEEVES_READY = false;
  global.mountHearthJeeves = safeMountJeeves;
  global.mountJeeves = safeMountJeeves;

  global.HEARTH_JEEVES_FRONTBRAIN = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: "25.3.0",
    mount: safeMountJeeves,
    getState: () => cloneState(),
    send: (text) => submitVisitorText(text),
    reset: () => resetConversation(),
    speed: () => advanceReveal()
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeMountJeeves, { once: true });
  } else {
    safeMountJeeves();
  }

  global.addEventListener("hearth:jeeves-expression-ready", handleExpressionReady);

  function safeMountJeeves() {
    try {
      mountJeeves();
    } catch (error) {
      visibleBootFailure(error);
    }
  }

  function mountJeeves() {
    if (state.booted) return;

    const root = findOrCreateRoot();
    state.root = root;

    bindRootToShellContract(root);
    state.shell = ensureShell(root);
    bindEvents(state.shell);

    state.booted = true;
    state.currentConversationStage = STAGES.ENTRANCE_OVERVIEW;
    state.currentNode = TARGETS.DIAMOND_GATE_OVERVIEW;
    state.currentPath = TARGETS.DIAMOND_GATE_OVERVIEW;
    state.currentTopic = "diamondGate";

    clearShell(state.shell);
    releaseReadyState();
    renderBootEntrance();
  }

  function findOrCreateRoot() {
    let root = document.getElementById(ROOT_ID);

    if (!root) {
      root = document.querySelector("[data-jeeves-root]") || document.querySelector(".hearth-jeeves");
    }

    if (!root) {
      root = document.createElement("section");
      root.id = ROOT_ID;
      document.body.appendChild(root);
    }

    return root;
  }

  function bindRootToShellContract(root) {
    root.classList.add("hearth-jeeves");
    root.classList.add("hearth-jeeves-v25");
    root.classList.add("hearth-jeeves-v25-3");
    root.classList.add("jeeves-screen-glass");

    root.setAttribute("data-jeeves-root", "true");
    root.setAttribute("data-jeeves-contract", CONTRACT);
    root.setAttribute("data-jeeves-previous-contract", PREVIOUS_CONTRACT);
    root.setAttribute("data-jeeves-ready", "false");
    root.setAttribute("data-house-listening", "false");
    root.setAttribute("data-jeeves-typing", "false");
    root.setAttribute("data-jeeves-stage", state.currentConversationStage);
    root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
  }

  function ensureShell(root) {
    const shell = {};

    shell.topline = ensureChild(root, ".jeeves-screen-topline", "div", [
      "jeeves-screen-topline"
    ]);

    shell.status = ensureChild(root, ".jeeves-status", "div", [
      "jeeves-status"
    ]);

    shell.threadScreen = ensureChild(root, ".jeeves-thread-screen", "div", [
      "jeeves-thread-screen"
    ]);

    shell.thread = shell.threadScreen.querySelector(".jeeves-thread.jeeves-transcript.jeeves-log") ||
      shell.threadScreen.querySelector(".jeeves-thread") ||
      document.createElement("div");

    shell.thread.classList.add("jeeves-thread");
    shell.thread.classList.add("jeeves-transcript");
    shell.thread.classList.add("jeeves-log");
    shell.thread.setAttribute("data-jeeves-thread", "true");

    if (!shell.thread.parentNode) {
      shell.threadScreen.appendChild(shell.thread);
    }

    shell.typing = ensureChild(root, ".jeeves-typing", "div", [
      "jeeves-typing"
    ]);
    shell.typing.setAttribute("data-jeeves-typing-indicator", "true");

    shell.options = ensureChild(root, ".jeeves-options.jeeves-prompt-dock", "div", [
      "jeeves-options",
      "jeeves-prompt-dock"
    ]);
    shell.options.setAttribute("data-jeeves-options", "true");
    shell.options.setAttribute("aria-label", "Text Jeeves");

    shell.handoffs = ensureChild(root, ".jeeves-handoffs.jeeves-doors.jeeves-handoff-dock", "div", [
      "jeeves-handoffs",
      "jeeves-doors",
      "jeeves-handoff-dock"
    ]);
    shell.handoffs.setAttribute("data-jeeves-handoffs", "true");
    shell.handoffs.setAttribute("data-jeeves-doors", "true");
    shell.handoffs.setAttribute("aria-label", "Prepared Doors");

    shell.form = root.querySelector("[data-jeeves-form]") ||
      root.querySelector(".jeeves-input-form") ||
      root.querySelector("form.jeeves-form") ||
      null;

    shell.input = root.querySelector("[data-jeeves-input]") ||
      root.querySelector(".jeeves-input") ||
      root.querySelector("textarea[name='jeeves']") ||
      root.querySelector("input[name='jeeves']") ||
      null;

    shell.submit = root.querySelector("[data-jeeves-submit]") ||
      root.querySelector(".jeeves-submit") ||
      null;

    ensureDockLabel(shell.options, "Text Jeeves");
    ensureDockLabel(shell.handoffs, "Prepared Doors");

    return shell;
  }

  function ensureChild(parent, selector, tagName, classNames) {
    let child = parent.querySelector(selector);

    if (!child) {
      child = document.createElement(tagName);
      parent.appendChild(child);
    }

    classNames.forEach((name) => child.classList.add(name));

    return child;
  }

  function ensureDockLabel(dock, label) {
    let title = dock.querySelector(".jeeves-dock-label");

    if (!title) {
      title = document.createElement("div");
      title.className = "jeeves-dock-label";
      dock.insertBefore(title, dock.firstChild);
    }

    title.textContent = label;
  }

  function bindEvents(shell) {
    shell.options.addEventListener("click", (event) => {
      const button = event.target.closest("[data-jeeves-option]");
      if (!button || state.busy || state.revealActive) return;

      const option = readOptionFromButton(button);
      handleConversationOption(option);
    });

    shell.handoffs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-jeeves-route-option]");
      if (!button || state.busy || state.revealActive) return;

      const routeId = button.getAttribute("data-jeeves-route-option") || "";
      const href = button.getAttribute("data-jeeves-handoff-route") || ROUTE_HINTS[routeId] || "";

      handlePreparedDoor(routeId, href);
    });

    state.root.addEventListener("click", (event) => {
      if (!state.revealActive) return;
      if (event.target.closest("[data-jeeves-option]")) return;
      if (event.target.closest("[data-jeeves-route-option]")) return;
      if (event.target.closest("[data-jeeves-input]")) return;
      if (event.target.closest("input, textarea, button, a")) return;

      advanceReveal();
    });

    if (shell.threadScreen) {
      shell.threadScreen.addEventListener("click", () => {
        if (state.revealActive) advanceReveal();
      });
    }

    if (shell.form) {
      shell.form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitInputValue();
      });
    }

    if (shell.input) {
      shell.input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (event.shiftKey) return;
        if (shell.input.tagName === "TEXTAREA") {
          event.preventDefault();
        }
        submitInputValue();
      });
    }

    if (shell.submit) {
      shell.submit.addEventListener("click", (event) => {
        event.preventDefault();
        submitInputValue();
      });
    }
  }

  function clearShell(shell) {
    shell.thread.innerHTML = "";
    shell.options.innerHTML = "";
    shell.handoffs.innerHTML = "";
    ensureDockLabel(shell.options, "Text Jeeves");
    ensureDockLabel(shell.handoffs, "Prepared Doors");
    shell.typing.textContent = "";
  }

  function renderBootEntrance() {
    const expression = getExpression();
    const entranceOptions = expression && typeof expression.shapeEntranceOptions === "function"
      ? expression.shapeEntranceOptions()
      : START_OPTIONS.slice();

    const bubbles = BOOT_BUBBLES.map((bubble) => shapeText(bubble, {
      intent: "diamondGate",
      selectedTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      currentConversationStage: STAGES.ENTRANCE_OVERVIEW
    }));

    renderAssistantSequence(bubbles, () => {
      renderOptions(entranceOptions);
      renderHandoffs(START_HANDOFFS, HANDOFF_LABELS);
      renderSystemStatus("The house is listening.");
    });
  }

  function releaseReadyState() {
    state.ready = true;
    global.HEARTH_JEEVES_READY = true;

    if (state.root) {
      state.root.setAttribute("data-jeeves-ready", "true");
      state.root.setAttribute("data-house-listening", "false");
      state.root.setAttribute("data-jeeves-typing", "false");
      state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
      state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
    }

    dispatch("hearth:jeeves-ready", {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT
    });
  }

  function handleExpressionReady() {
    if (!state.booted) return;
    if (state.userInteracted) return;

    if (state.revealActive) {
      state.expressionReadyPending = true;
      return;
    }

    resetConversation();
  }

  function visibleBootFailure(error) {
    state.lastError = error;

    try {
      const root = findOrCreateRoot();
      bindRootToShellContract(root);
      const shell = ensureShell(root);

      root.setAttribute("data-jeeves-ready", "false");
      root.setAttribute("data-jeeves-error", "true");
      root.setAttribute("data-house-listening", "false");
      root.setAttribute("data-jeeves-typing", "false");

      shell.status.textContent = "Jeeves could not finish preparing.";
      shell.thread.innerHTML = "";

      renderBubbleInto(shell.thread, "system", "Jeeves hit a visible boot error instead of silently freezing.");
      renderBubbleInto(shell.thread, "system", safeErrorMessage(error));
    } catch (_innerError) {
      console.error("[Jeeves boot failure]", error);
    }
  }

  function renderSystemStatus(text) {
    if (!state.shell || !state.shell.status) return;
    state.shell.status.textContent = safeText(text);
  }

  function setHouseListening(isListening) {
    if (!state.root) return;
    state.root.setAttribute("data-house-listening", isListening ? "true" : "false");
  }

  function setTyping(isTyping, message) {
    if (!state.root || !state.shell) return;

    state.root.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    state.shell.typing.textContent = isTyping ? (message || "The house is typing. Tap to speed the process.") : "";
  }

  function renderBubble(speaker, text) {
    if (!state.shell || !state.shell.thread) return;
    renderBubbleInto(state.shell.thread, speaker, text);
    trimThread();
    scrollThreadToBottom();
  }

  function renderBubbleInto(thread, speaker, text) {
    const bubble = document.createElement("div");
    const safeSpeaker = speaker === "user" ? "user" : speaker === "system" ? "system" : "assistant";

    bubble.classList.add("jeeves-bubble");

    if (safeSpeaker === "assistant") {
      bubble.classList.add("jeeves-bubble-assistant");
      bubble.classList.add("jeeves-bubble-jeeves");
      bubble.setAttribute("data-jeeves-bubble", "assistant");
      bubble.setAttribute("data-jeeves-speaker", "assistant");
    } else if (safeSpeaker === "user") {
      bubble.classList.add("jeeves-bubble-user");
      bubble.classList.add("jeeves-bubble-visitor");
      bubble.setAttribute("data-jeeves-bubble", "user");
      bubble.setAttribute("data-jeeves-speaker", "user");
    } else {
      bubble.classList.add("jeeves-bubble-system");
      bubble.setAttribute("data-jeeves-bubble", "system");
      bubble.setAttribute("data-jeeves-speaker", "system");
    }

    bubble.textContent = safeText(text);
    thread.appendChild(bubble);
  }

  async function renderAssistantSequence(bubbles, done) {
    const cleanBubbles = normalizeBubbles(bubbles);
    const token = ++state.revealToken;

    if (!cleanBubbles.length) {
      if (typeof done === "function") done();
      return;
    }

    state.revealActive = true;
    state.busy = true;

    setHouseListening(false);
    setTyping(true, "The house is typing. Tap to speed the process.");
    renderSystemStatus("The house is typing. Tap to speed the process.");

    try {
      for (const bubble of cleanBubbles) {
        if (token !== state.revealToken) return;
        renderBubble("assistant", bubble);
        await waitForReading(bubble, token);
      }
    } finally {
      if (token === state.revealToken) {
        state.revealActive = false;
        state.busy = false;
        state.revealSkipResolver = null;

        setTyping(false);
        setHouseListening(true);

        if (typeof done === "function") done();

        if (state.expressionReadyPending && !state.userInteracted) {
          state.expressionReadyPending = false;
          resetConversation();
        }
      }
    }
  }

  function waitForReading(text, token) {
    const delay = Math.min(READ_MAX_MS, READ_BASE_MS + safeText(text).length * READ_PER_CHAR_MS);

    return new Promise((resolve) => {
      if (token !== state.revealToken) {
        resolve();
        return;
      }

      const timer = global.setTimeout(() => {
        if (state.revealSkipResolver === skip) {
          state.revealSkipResolver = null;
        }
        resolve();
      }, delay);

      function skip() {
        global.clearTimeout(timer);
        if (state.revealSkipResolver === skip) {
          state.revealSkipResolver = null;
        }
        resolve();
      }

      state.revealSkipResolver = skip;
    });
  }

  function advanceReveal() {
    if (typeof state.revealSkipResolver === "function") {
      state.revealSkipResolver();
    }
  }

  function trimThread() {
    const bubbles = Array.from(state.shell.thread.querySelectorAll(".jeeves-bubble"));
    const excess = bubbles.length - MAX_THREAD_BUBBLES;

    if (excess > 0) {
      bubbles.slice(0, excess).forEach((node) => node.remove());
    }
  }

  function scrollThreadToBottom() {
    if (!state.shell || !state.shell.threadScreen) return;
    state.shell.threadScreen.scrollTop = state.shell.threadScreen.scrollHeight;
  }

  function renderOptions(options) {
    if (!state.shell || !state.shell.options) return;

    const expression = getExpression();
    const shapedOptions = expression && typeof expression.shapeOptions === "function"
      ? expression.shapeOptions(options || [], buildExpressionContext())
      : options || [];

    clearDockButtons(state.shell.options, "Text Jeeves");

    shapedOptions.slice(0, 6).forEach((option, index) => {
      const normalizedOption = normalizeOption(option);
      const button = document.createElement("button");

      button.type = "button";
      button.classList.add("jeeves-option");
      button.classList.add("jeeves-option-button");

      button.textContent = normalizedOption.label || "Can you tell me more?";

      button.setAttribute("data-jeeves-option", normalizedOption.target || "");
      button.setAttribute("data-jeeves-option-index", String(index));
      button.setAttribute("data-option-kind", normalizedOption.optionKind || OPTION_KINDS.CONVERSATION);
      button.setAttribute("data-prompt-mode", normalizedOption.promptMode || PROMPT_MODES.UNKNOWN);
      button.setAttribute("data-archetype-alignment", normalizedOption.archetypeAlignment || ARCHETYPE_ALIGNMENTS.UNKNOWN);
      button.setAttribute("data-bridge-moment", normalizedOption.bridgeMoment || BRIDGE_MOMENTS.NONE);
      button.setAttribute("data-movement-intent", normalizedOption.movementIntent || MOVEMENT_INTENTS.ASK);
      button.setAttribute("data-scope-lane", normalizedOption.scopeLane || inferScopeLane(normalizedOption.target));
      button.setAttribute("data-option-type", normalizedOption.type || "conversation");
      button.setAttribute("data-option-label", normalizedOption.label || "");

      state.shell.options.appendChild(button);
    });
  }

  function renderHandoffs(handoffs, handoffLabels, routeHints) {
    if (!state.shell || !state.shell.handoffs) return;

    const routes = Array.isArray(handoffs) ? handoffs : [];
    const expression = getExpression();
    const labels = expression && typeof expression.shapeHandoffLabels === "function"
      ? expression.shapeHandoffLabels(handoffLabels || {}, routes)
      : handoffLabels || {};

    clearDockButtons(state.shell.handoffs, "Prepared Doors");

    routes.slice(0, 6).forEach((routeId, index) => {
      const route = normalizeRoute(routeId);
      const href = (routeHints && routeHints[route]) || ROUTE_HINTS[route] || "";
      const label = labels[route] || HANDOFF_LABELS[route] || route;

      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("jeeves-route-option");
      button.classList.add("jeeves-door-button");

      button.textContent = label;

      button.setAttribute("data-jeeves-route-option", route);
      button.setAttribute("data-jeeves-route-option-index", String(index));
      button.setAttribute("data-jeeves-handoff-route", href);
      button.setAttribute("data-option-kind", OPTION_KINDS.ROUTE);
      button.setAttribute("data-bridge-moment", BRIDGE_MOMENTS.PREPARED_DOOR);
      button.setAttribute("data-movement-intent", MOVEMENT_INTENTS.OPEN_DOOR);

      state.shell.handoffs.appendChild(button);
    });
  }

  function clearDockButtons(dock, title) {
    dock.innerHTML = "";
    ensureDockLabel(dock, title);
  }

  function readOptionFromButton(button) {
    return {
      label: button.getAttribute("data-option-label") || button.textContent || "",
      target: normalizeTarget(button.getAttribute("data-jeeves-option") || ""),
      type: button.getAttribute("data-option-type") || "conversation",
      scopeLane: button.getAttribute("data-scope-lane") || "objective",
      promptMode: button.getAttribute("data-prompt-mode") || PROMPT_MODES.UNKNOWN,
      optionKind: button.getAttribute("data-option-kind") || OPTION_KINDS.CONVERSATION,
      archetypeAlignment: button.getAttribute("data-archetype-alignment") || ARCHETYPE_ALIGNMENTS.UNKNOWN,
      bridgeMoment: button.getAttribute("data-bridge-moment") || BRIDGE_MOMENTS.NONE,
      movementIntent: button.getAttribute("data-movement-intent") || MOVEMENT_INTENTS.ASK
    };
  }

  function handleConversationOption(option) {
    const safeOption = normalizeOption(option);
    const priorNode = state.currentNode;
    const priorLane = state.currentEntryLane;
    const priorTopic = state.currentTopic;

    state.userInteracted = true;

    const bridgeContext = buildBridgeContext({
      priorNode,
      priorLane,
      priorTopic,
      option: safeOption
    });

    updateStateForOption(safeOption, bridgeContext);
    renderBubble("user", safeOption.label);

    submitToApi({
      visitorText: safeOption.label,
      selectedTarget: safeOption.target,
      selectedLabel: safeOption.label,
      requestMode: "node_enrichment",
      promptMode: safeOption.promptMode,
      optionKind: safeOption.optionKind,
      archetypeAlignment: safeOption.archetypeAlignment,
      bridgeMoment: safeOption.bridgeMoment,
      movementIntent: safeOption.movementIntent,
      currentScopeLane: safeOption.scopeLane,
      bridgeContext
    });
  }

  function handlePreparedDoor(routeId, href) {
    const route = normalizeRoute(routeId);
    const targetHref = href || ROUTE_HINTS[route];

    state.userInteracted = true;

    pushTrail({
      type: "handoff",
      route,
      href: targetHref,
      from: state.currentNode,
      at: new Date().toISOString()
    });

    dispatch("hearth:jeeves-prepared-door", {
      contract: CONTRACT,
      route,
      href: targetHref,
      from: state.currentNode
    });

    if (!targetHref) {
      renderBubble("system", "That door is listed, but it does not have a visible route yet.");
      return;
    }

    global.location.href = targetHref;
  }

  function submitInputValue() {
    if (!state.shell || !state.shell.input || state.busy || state.revealActive) return;

    const value = safeText(state.shell.input.value);
    if (!value) return;

    state.shell.input.value = "";
    submitVisitorText(value);
  }

  function submitVisitorText(text) {
    const visitorText = safeText(text);
    if (!visitorText || state.busy || state.revealActive) return;

    const target = inferTargetFromText(visitorText);
    const option = {
      label: visitorText,
      target,
      type: "conversation",
      scopeLane: inferScopeLane(target),
      promptMode: inferPromptModeFromText(visitorText),
      optionKind: OPTION_KINDS.CONVERSATION,
      archetypeAlignment: inferAlignmentFromTarget(target),
      bridgeMoment: BRIDGE_MOMENTS.BEFORE,
      movementIntent: MOVEMENT_INTENTS.ASK
    };

    handleConversationOption(option);
  }

  async function submitToApi(partialPayload) {
    if (state.busy && !state.revealActive) return;

    state.busy = true;
    setHouseListening(false);
    setTyping(true, "Jeeves is reading the path.");
    renderSystemStatus("Jeeves is reading the path.");

    try {
      const payload = buildApiPayload(partialPayload);
      const result = await postToFirstAvailableApi(payload);
      const shaped = shapeApiFrame(result.data);

      state.lastSuccessfulEndpoint = result.endpoint;
      state.lastResponse = shaped;

      applyApiState(shaped);
      renderApiFrame(shaped);
    } catch (error) {
      state.lastError = error;
      renderApiFailure(error);
    }
  }

  async function postToFirstAvailableApi(payload) {
    let lastError = null;

    for (let i = 0; i < API_ENDPOINTS.length; i += 1) {
      const endpoint = API_ENDPOINTS[i];

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          return {
            endpoint,
            data: await response.json()
          };
        }

        const status = response.status;
        const bodyText = await safeReadResponseText(response);

        lastError = new Error("Jeeves API returned " + status + " at " + endpoint);

        if ((status === 404 || status === 405) && i < API_ENDPOINTS.length - 1) {
          continue;
        }

        if (bodyText) {
          lastError.message = lastError.message + ": " + bodyText.slice(0, 240);
        }

        throw lastError;
      } catch (error) {
        lastError = error;

        if (i < API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }

    throw lastError || new Error("Jeeves API did not respond.");
  }

  function buildApiPayload(partialPayload) {
    const payload = partialPayload && typeof partialPayload === "object" ? partialPayload : {};
    const selectedTarget = normalizeTarget(payload.selectedTarget || state.currentNode || TARGETS.DIAMOND_GATE_OVERVIEW);
    const currentLane = payload.currentScopeLane || inferScopeLane(selectedTarget);
    const bridgeContext = sanitizeBridgeContext(payload.bridgeContext || state.lastBridgeContext || null);

    return {
      visitorText: safeText(payload.visitorText || ""),
      selectedTarget,
      selectedLabel: safeText(payload.selectedLabel || ""),
      requestMode: payload.requestMode || "node_enrichment",

      promptMode: payload.promptMode || PROMPT_MODES.UNKNOWN,
      optionKind: payload.optionKind || OPTION_KINDS.CONVERSATION,
      archetypeAlignment: payload.archetypeAlignment || inferAlignmentFromTarget(selectedTarget),
      bridgeMoment: payload.bridgeMoment || BRIDGE_MOMENTS.BEFORE,
      movementIntent: payload.movementIntent || MOVEMENT_INTENTS.ASK,
      bridgeContext,

      currentConversationStage: state.currentConversationStage,
      currentEntryLane: state.currentEntryLane,
      lastLane: state.lastLane,
      bridgeOffered: state.bridgeOffered,

      activeHostPage: "hearth-jeeves",
      currentRoomContext: "hearth",
      currentRoomRole: "mission_control",
      currentRoomPremise: "window_within_the_window",
      estateKnowledgeMode: "split_interface_guided_path",
      portalLogic: "hearth_is_window_within_the_window",
      routeAuthority: "frontbrain_final_route_execution",

      currentNode: state.currentNode,
      currentEntry: state.currentPath,
      currentPath: state.currentPath,
      currentTopic: state.currentTopic,
      currentRoomId: "hearthJeeves",
      currentRoomName: "Hearth Jeeves",
      currentCoordinateName: "Hearth Mission Control",
      currentCardinal: inferCardinalForTarget(selectedTarget),
      currentPlaceType: currentLane === "narrative" ? "narrative_path" : "traditional_website",
      currentScopeLane: currentLane,
      currentVoiceMode: "jeeves_expression_v5_1",

      visitorPosture: "guided",
      movement: payload.movementIntent || MOVEMENT_INTENTS.ASK,

      pathDepth: state.visitedNodes.length,
      routeReadiness: state.bridgeOffered ? 2 : 1,
      loopCount: inferLoopCount(selectedTarget),
      topicDepth: inferTopicDepth(selectedTarget),
      revealDepth: state.transitionTrail.length,

      allowedTargets: buildAllowedTargets(),
      allowedRoutes: buildAllowedRoutes(),

      sessionTrail: state.sessionTrail.slice(-MAX_TRAIL_ITEMS),
      visitedNodes: state.visitedNodes.slice(-MAX_TRAIL_ITEMS),
      selectedTargets: state.selectedTargets.slice(-MAX_TRAIL_ITEMS),
      selectedOptionKeys: state.selectedOptionKeys.slice(-MAX_TRAIL_ITEMS),
      returnStack: state.returnStack.slice(-MAX_TRAIL_ITEMS),
      transitionTrail: state.transitionTrail.slice(-MAX_TRAIL_ITEMS),
      branchStack: state.branchStack.slice(-MAX_TRAIL_ITEMS),

      expressionContract: getExpressionContract(),
      frontbrainContract: CONTRACT
    };
  }

  function buildBridgeContext(input) {
    const option = normalizeOption(input.option || {});
    const priorNode = normalizeTarget(input.priorNode || state.currentNode || "");
    const selectedTarget = normalizeTarget(option.target || "");
    const currentScopeStage = state.currentConversationStage;

    const bridgeContext = {
      currentNode: state.currentNode,
      priorNode,
      priorLane: safeText(input.priorLane || state.currentEntryLane || ""),
      priorTopic: safeText(input.priorTopic || state.currentTopic || ""),
      selectedTarget,
      selectedLabel: option.label,
      promptMode: option.promptMode,
      optionKind: option.optionKind,
      archetypeAlignment: option.archetypeAlignment,
      bridgeMoment: option.bridgeMoment,
      movementIntent: option.movementIntent,
      currentTopic: state.currentTopic,
      currentScopeStage,
      adjacentTarget: selectedTarget,
      adjacentLabel: TARGET_LABELS[selectedTarget] || option.label,
      adjacentReason: inferBridgeReason(priorNode, selectedTarget, option)
    };

    state.lastBridgeContext = bridgeContext;

    return bridgeContext;
  }

  function sanitizeBridgeContext(context) {
    if (!context || typeof context !== "object") return null;

    return {
      currentNode: normalizeTarget(context.currentNode || ""),
      priorNode: normalizeTarget(context.priorNode || ""),
      priorLane: safeText(context.priorLane || ""),
      priorTopic: safeText(context.priorTopic || ""),
      selectedTarget: normalizeTarget(context.selectedTarget || ""),
      selectedLabel: safeText(context.selectedLabel || ""),
      promptMode: safeText(context.promptMode || PROMPT_MODES.UNKNOWN),
      optionKind: safeText(context.optionKind || OPTION_KINDS.CONVERSATION),
      archetypeAlignment: safeText(context.archetypeAlignment || ARCHETYPE_ALIGNMENTS.UNKNOWN),
      bridgeMoment: safeText(context.bridgeMoment || BRIDGE_MOMENTS.NONE),
      movementIntent: safeText(context.movementIntent || MOVEMENT_INTENTS.ASK),
      currentTopic: safeText(context.currentTopic || ""),
      currentScopeStage: safeText(context.currentScopeStage || ""),
      adjacentTarget: normalizeTarget(context.adjacentTarget || ""),
      adjacentLabel: safeText(context.adjacentLabel || ""),
      adjacentReason: safeText(context.adjacentReason || "")
    };
  }

  function inferBridgeReason(priorTarget, selectedTarget, option) {
    const from = normalizeTarget(priorTarget);
    const to = normalizeTarget(selectedTarget);

    if (from === TARGETS.TRADITIONAL_WEBSITE && to === TARGETS.NARRATIVE_PATH) {
      return "The visitor is moving from public website structure into the narrative path.";
    }

    if (from === TARGETS.NARRATIVE_PATH && to === TARGETS.TRADITIONAL_WEBSITE) {
      return "The visitor is moving from narrative path back to public website structure.";
    }

    if (to === TARGETS.MISSION_OVERVIEW) {
      return "The visitor is entering the mission lane.";
    }

    if (to === TARGETS.PRACTICAL_RELEVANCE || to === TARGETS.FRONTIER || to === TARGETS.PRODUCTS) {
      return "The visitor is asking how the estate becomes practical.";
    }

    if (to === TARGETS.DIAGNOSTIC_REFERRAL || to === TARGETS.DIAGNOSTIC || to === TARGETS.CHARACTER_MIRROR) {
      return "The visitor is near the diagnostic boundary; Jeeves should explain or route, not assess.";
    }

    if (option.bridgeMoment === BRIDGE_MOMENTS.PARALLEL) {
      return "The visitor is crossing to a related room.";
    }

    return "The visitor selected a conversational path from Jeeves.";
  }

  function shapeApiFrame(data) {
    const expression = getExpression();
    const source = data && typeof data === "object" ? data : {};

    if (expression && typeof expression.shapeConversationFrame === "function") {
      return expression.shapeConversationFrame(source, buildExpressionContext(source));
    }

    return source;
  }

  function renderApiFrame(frame) {
    const bubbles = normalizeBubbles(frame.bubbles || frame.beats || []);
    const options = Array.isArray(frame.options) ? frame.options : [];
    const handoffs = Array.isArray(frame.handoffs) ? frame.handoffs : [];

    renderAssistantSequence(bubbles, () => {
      renderOptions(options);
      renderHandoffs(handoffs, frame.handoffLabels || {}, frame.routeHints || {});
      renderSystemStatus("The house is listening.");
    });
  }

  function renderApiFailure(error) {
    state.busy = false;
    state.revealActive = false;
    state.revealSkipResolver = null;

    setTyping(false);
    setHouseListening(true);

    renderBubble("system", "Jeeves could not reach the deeper answer path cleanly.");
    renderBubble("system", safeErrorMessage(error));

    renderOptions([
      makeConversationOption(
        "What is DiamondGateBridge.com?",
        TARGETS.DIAMOND_GATE_OVERVIEW,
        PROMPT_MODES.STORY,
        ARCHETYPE_ALIGNMENTS.STORY
      ),
      makeConversationOption(
        "Can you re-center me?",
        TARGETS.RECENTER,
        PROMPT_MODES.RECENTER,
        ARCHETYPE_ALIGNMENTS.UNKNOWN,
        BRIDGE_MOMENTS.RECENTER,
        MOVEMENT_INTENTS.RECENTER,
        "objective",
        OPTION_KINDS.CONTROL,
        "control"
      )
    ]);

    renderHandoffs([ROUTES.COMPASS, ROUTES.SITE_GUIDE], HANDOFF_LABELS);
    renderSystemStatus("The house is listening.");
  }

  function applyApiState(frame) {
    const target = normalizeTarget(frame.selectedTarget || state.currentNode || TARGETS.DIAMOND_GATE_OVERVIEW);
    const intent = safeText(frame.intent || inferIntentFromTarget(target));

    state.currentNode = target;
    state.currentPath = target;
    state.currentTopic = intent;
    state.currentScopeLane = inferScopeLane(target);

    const nextLane = inferLaneFromTarget(target, intent);

    if (nextLane && nextLane !== state.currentEntryLane) {
      state.lastLane = state.currentEntryLane || LANES.UNKNOWN;
      state.currentEntryLane = nextLane;
    }

    state.currentConversationStage = inferStageFromTarget(target, intent);

    if (
      state.currentConversationStage === STAGES.BRIDGE_LANE ||
      target === TARGETS.SPLIT_INTERFACE ||
      safeText(frame.bridgeMoment) === BRIDGE_MOMENTS.PARALLEL
    ) {
      state.bridgeOffered = true;
    }

    syncRootState();
  }

  function updateStateForOption(option, bridgeContext) {
    const target = normalizeTarget(option.target || "");
    const label = safeText(option.label || "");
    const nextLane = inferLaneFromTarget(target, inferIntentFromTarget(target));
    const priorTarget = normalizeTarget(bridgeContext && bridgeContext.priorNode ? bridgeContext.priorNode : state.currentNode);

    state.selectedTargets.push(target);
    state.selectedOptionKeys.push(makeOptionKey(option));
    state.visitedNodes.push(target);

    if (priorTarget) {
      state.returnStack.push(priorTarget);
    }

    pushTrail({
      type: "conversation_option",
      label,
      target,
      from: priorTarget,
      to: target,
      promptMode: option.promptMode,
      optionKind: option.optionKind,
      bridgeMoment: option.bridgeMoment,
      movementIntent: option.movementIntent,
      bridgeContext: sanitizeBridgeContext(bridgeContext),
      at: new Date().toISOString()
    });

    state.transitionTrail.push({
      from: priorTarget,
      to: target,
      label,
      optionKind: option.optionKind,
      promptMode: option.promptMode,
      bridgeMoment: option.bridgeMoment,
      at: new Date().toISOString()
    });

    if (
      option.bridgeMoment === BRIDGE_MOMENTS.PARALLEL ||
      target === TARGETS.SPLIT_INTERFACE ||
      nextLane === LANES.BRIDGE
    ) {
      state.bridgeOffered = true;
    }

    if (nextLane && nextLane !== state.currentEntryLane) {
      state.lastLane = state.currentEntryLane || LANES.UNKNOWN;
      state.currentEntryLane = nextLane;
    }

    state.currentNode = target;
    state.currentPath = target;
    state.currentTopic = inferIntentFromTarget(target);
    state.currentConversationStage = inferStageFromTarget(target, state.currentTopic);

    trimStateArrays();
    syncRootState();
  }

  function pushTrail(item) {
    state.sessionTrail.push(JSON.stringify(item));
    trimStateArrays();
  }

  function trimStateArrays() {
    [
      "selectedTargets",
      "selectedOptionKeys",
      "visitedNodes",
      "sessionTrail",
      "transitionTrail",
      "branchStack",
      "returnStack"
    ].forEach((key) => {
      if (state[key].length > MAX_TRAIL_ITEMS) {
        state[key] = state[key].slice(-MAX_TRAIL_ITEMS);
      }
    });
  }

  function resetConversation() {
    if (!state.shell) return;

    state.busy = false;
    state.revealActive = false;
    state.revealToken += 1;
    state.revealSkipResolver = null;

    state.currentConversationStage = STAGES.ENTRANCE_OVERVIEW;
    state.currentEntryLane = LANES.UNKNOWN;
    state.lastLane = LANES.UNKNOWN;
    state.bridgeOffered = false;
    state.currentNode = TARGETS.DIAMOND_GATE_OVERVIEW;
    state.currentPath = TARGETS.DIAMOND_GATE_OVERVIEW;
    state.currentTopic = "diamondGate";
    state.currentScopeLane = "objective";
    state.selectedTargets = [];
    state.selectedOptionKeys = [];
    state.visitedNodes = [];
    state.sessionTrail = [];
    state.transitionTrail = [];
    state.branchStack = [];
    state.returnStack = [];
    state.lastBridgeContext = null;

    clearShell(state.shell);
    syncRootState();
    renderBootEntrance();
  }

  function buildAllowedTargets() {
    return [
      TARGETS.DIAMOND_GATE_OVERVIEW,
      TARGETS.SPLIT_INTERFACE,
      TARGETS.TRADITIONAL_WEBSITE,
      TARGETS.NARRATIVE_PATH,
      TARGETS.MISSION_OVERVIEW,
      TARGETS.MISSION_INNER,
      TARGETS.MISSION_COMMUNITY,
      TARGETS.MISSION_COLLABORATION,
      TARGETS.PRACTICAL_RELEVANCE,
      TARGETS.DIAGNOSTIC_REFERRAL,
      TARGETS.DIAGNOSTIC,
      TARGETS.CHARACTER_MIRROR,
      TARGETS.MIRRORLAND,
      TARGETS.HEARTH,
      TARGETS.FRONTIER,
      TARGETS.SCIENTIFIC_LAW,
      TARGETS.COMPASS,
      TARGETS.PRODUCTS,
      TARGETS.LAWS,
      TARGETS.SEAN,
      TARGETS.UNDERDOG,
      TARGETS.CHARACTERS,
      TARGETS.RECENTER,
      TARGETS.CLEAN_DOOR
    ];
  }

  function buildAllowedRoutes() {
    return [
      ROUTES.COMPASS,
      ROUTES.HOME,
      ROUTES.SITE_GUIDE,
      ROUTES.COHERENCE_DIAGNOSTIC,
      ROUTES.MEET_SEAN,
      ROUTES.PRODUCTS,
      ROUTES.LAWS,
      ROUTES.SCIENTIFIC_LAW,
      ROUTES.GAUGES,
      ROUTES.SHOWROOM,
      ROUTES.HEARTH,
      ROUTES.MIRRORLAND,
      ROUTES.ZIONTS,
      ROUTES.AUDRALIA,
      ROUTES.H_EARTH,
      ROUTES.FRONTIER,
      ROUTES.CHARACTERS,
      ROUTES.NINE_SUMMITS,
      ROUTES.UNDERDOG
    ];
  }

  function buildExpressionContext(extra) {
    const source = extra && typeof extra === "object" ? extra : {};

    return {
      intent: source.intent || state.currentTopic,
      selectedTarget: source.selectedTarget || state.currentNode,
      selectedLabel: source.selectedLabel || "",
      currentNode: state.currentNode,
      currentPath: state.currentPath,
      currentEntryLane: state.currentEntryLane,
      lastLane: state.lastLane,
      currentConversationStage: state.currentConversationStage,
      promptMode: source.promptMode || "",
      optionKind: source.optionKind || "",
      bridgeMoment: source.bridgeMoment || "",
      movementIntent: source.movementIntent || ""
    };
  }

  function getExpression() {
    return global.HEARTH_JEEVES_EXPRESSION ||
      global.HEARTH_JEEVES_EXPRESSION_BRIDGE ||
      (global.HEARTH && global.HEARTH.jeevesExpression) ||
      null;
  }

  function getExpressionContract() {
    const expression = getExpression();
    return expression && expression.contract ? expression.contract : "";
  }

  function shapeText(text, context) {
    const expression = getExpression();
    if (expression && typeof expression.sanitizePublicText === "function") {
      return expression.sanitizePublicText(text, context || buildExpressionContext());
    }
    return safeText(text);
  }

  function makeConversationOption(
    label,
    target,
    promptMode,
    archetypeAlignment,
    bridgeMoment,
    movementIntent,
    scopeLane,
    optionKind,
    type
  ) {
    const normalizedTarget = normalizeTarget(target);

    return {
      label: safeText(label),
      target: normalizedTarget,
      type: type || "conversation",
      scopeLane: scopeLane || inferScopeLane(normalizedTarget),
      promptMode: promptMode || PROMPT_MODES.UNKNOWN,
      optionKind: optionKind || OPTION_KINDS.CONVERSATION,
      archetypeAlignment: archetypeAlignment || inferAlignmentFromTarget(normalizedTarget),
      bridgeMoment: bridgeMoment || BRIDGE_MOMENTS.BEFORE,
      movementIntent: movementIntent || MOVEMENT_INTENTS.ASK
    };
  }

  function normalizeOption(option) {
    const source = option && typeof option === "object" ? option : {};
    const target = normalizeTarget(source.target || "");

    return {
      label: safeText(source.label || TARGET_LABELS[target] || ""),
      target,
      type: source.type || "conversation",
      scopeLane: source.scopeLane || inferScopeLane(target),
      promptMode: source.promptMode || PROMPT_MODES.UNKNOWN,
      optionKind: source.optionKind || OPTION_KINDS.CONVERSATION,
      archetypeAlignment: source.archetypeAlignment || inferAlignmentFromTarget(target),
      bridgeMoment: source.bridgeMoment || BRIDGE_MOMENTS.BEFORE,
      movementIntent: source.movementIntent || MOVEMENT_INTENTS.ASK
    };
  }

  function normalizeBubbles(value) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => safeText(item)).filter(Boolean).slice(0, 4);
  }

  function normalizeTarget(target) {
    const clean = safeText(target);

    const aliases = {
      websitePath: TARGETS.DIAMOND_GATE_OVERVIEW,
      siteOverviewPath: TARGETS.DIAMOND_GATE_OVERVIEW,
      traditionalPath: TARGETS.TRADITIONAL_WEBSITE,
      narrativeOverviewPath: TARGETS.NARRATIVE_PATH,
      missionPath: TARGETS.MISSION_OVERVIEW,
      characterArchetypeMirrorPath: TARGETS.CHARACTER_MIRROR,
      characterMirrorPath: TARGETS.CHARACTER_MIRROR,
      characterArchetypeQuestionOne: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeQuestionTwo: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeQuestionThree: TARGETS.DIAGNOSTIC_REFERRAL,
      characterArchetypeResult: TARGETS.DIAGNOSTIC_REFERRAL,
      mirrorMePath: TARGETS.DIAGNOSTIC_REFERRAL,
      selfLearningPath: TARGETS.DIAGNOSTIC_REFERRAL
    };

    return aliases[clean] || clean;
  }

  function normalizeRoute(route) {
    const clean = safeText(route);

    const aliases = {
      traditionalWebsite: ROUTES.SITE_GUIDE,
      narrativePath: ROUTES.MIRRORLAND,
      frontierPlayground: ROUTES.FRONTIER,
      worldGate: ROUTES.MIRRORLAND,
      globeWindow: ROUTES.MIRRORLAND
    };

    return aliases[clean] || clean;
  }

  function inferTargetFromText(text) {
    const value = safeText(text).toLowerCase();

    if (/\bwhat is diamondgatebridge|what is diamond gate bridge|what is this place|what is this site\b/.test(value)) return TARGETS.DIAMOND_GATE_OVERVIEW;
    if (/\bnarrative path|story path|narrative side\b/.test(value)) return TARGETS.NARRATIVE_PATH;
    if (/\btraditional website|public website|website for|public pages|site guide\b/.test(value)) return TARGETS.TRADITIONAL_WEBSITE;
    if (/\bmission|inner mission|community mission|protect children|protect animals|bullying|collaboration\b/.test(value)) return TARGETS.MISSION_OVERVIEW;
    if (/\breal world|practical|why does this matter|why this matters\b/.test(value)) return TARGETS.PRACTICAL_RELEVANCE;
    if (/\bwhich archetype|what archetype|which character am i|what character am i|assess me|score me|diagnose me|alignment read|mirror question\b/.test(value)) return TARGETS.DIAGNOSTIC_REFERRAL;
    if (/\bcoherence diagnostic|diagnostic\b/.test(value)) return TARGETS.DIAGNOSTIC;
    if (/\bcharacter mirror\b/.test(value)) return TARGETS.CHARACTER_MIRROR;
    if (/\bmirrorland|world window|south gate\b/.test(value)) return TARGETS.MIRRORLAND;
    if (/\bhearth|mission control|window within the window\b/.test(value)) return TARGETS.HEARTH;
    if (/\bfrontier|playground|energy|water|waste|infrastructure\b/.test(value)) return TARGETS.FRONTIER;
    if (/\bscientific law|proof|evidence|test\b/.test(value)) return TARGETS.SCIENTIFIC_LAW;
    if (/\bcompass|where should i start|start\b/.test(value)) return TARGETS.COMPASS;

    return TARGETS.DIAMOND_GATE_OVERVIEW;
  }

  function inferPromptModeFromText(text) {
    const value = safeText(text).toLowerCase();

    if (/\btrust|proof|evidence|test|wrong|matter|important\b/.test(value)) return PROMPT_MODES.SKEPTIC;
    if (/\breal world|practical|work|system|use|frontier|product|energy|water|waste\b/.test(value)) return PROMPT_MODES.PRACTICAL;
    if (/\bmission|inner|community|myself|diagnostic|alignment|underdog|pressure|noise\b/.test(value)) return PROMPT_MODES.PERSONAL;
    if (/\bnext|continue|go deeper|show me more\b/.test(value)) return PROMPT_MODES.PROGRESSION;
    if (/\brecenter|lost|start over|return\b/.test(value)) return PROMPT_MODES.RECENTER;

    return PROMPT_MODES.STORY;
  }

  function inferAlignmentFromTarget(target) {
    const clean = normalizeTarget(target);

    if ([TARGETS.SCIENTIFIC_LAW, TARGETS.LAWS].includes(clean)) return ARCHETYPE_ALIGNMENTS.PROOF;
    if ([TARGETS.FRONTIER, TARGETS.PRACTICAL_RELEVANCE, TARGETS.PRODUCTS, TARGETS.MISSION_COLLABORATION].includes(clean)) return ARCHETYPE_ALIGNMENTS.PRACTICAL;
    if ([TARGETS.MISSION_OVERVIEW, TARGETS.MISSION_INNER, TARGETS.MISSION_COMMUNITY, TARGETS.DIAGNOSTIC_REFERRAL, TARGETS.DIAGNOSTIC, TARGETS.UNDERDOG].includes(clean)) return ARCHETYPE_ALIGNMENTS.PERSONAL;
    if ([TARGETS.SEAN].includes(clean)) return ARCHETYPE_ALIGNMENTS.SOURCE;
    if ([TARGETS.NARRATIVE_PATH, TARGETS.MIRRORLAND, TARGETS.HEARTH, TARGETS.CHARACTERS, TARGETS.CHARACTER_MIRROR].includes(clean)) return ARCHETYPE_ALIGNMENTS.STORY;

    return ARCHETYPE_ALIGNMENTS.UNKNOWN;
  }

  function inferScopeLane(target) {
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
      TARGETS.CHARACTER_MIRROR
    ].includes(clean)) return "narrative";

    return "objective";
  }

  function inferLaneFromTarget(target, intent) {
    const clean = normalizeTarget(target);
    const safeIntent = safeText(intent);

    if (clean === TARGETS.SPLIT_INTERFACE || safeIntent === "splitInterface") return LANES.BRIDGE;
    if (clean === TARGETS.DIAGNOSTIC_REFERRAL || safeIntent === "diagnosticReferral") return LANES.DIAGNOSTIC;

    if ([
      TARGETS.TRADITIONAL_WEBSITE,
      TARGETS.COMPASS,
      TARGETS.PRODUCTS,
      TARGETS.LAWS,
      TARGETS.SEAN,
      TARGETS.DIAGNOSTIC,
      TARGETS.SCIENTIFIC_LAW,
      TARGETS.PRACTICAL_RELEVANCE
    ].includes(clean)) return LANES.TRADITIONAL;

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
    ].includes(clean)) return LANES.NARRATIVE;

    return state.currentEntryLane || LANES.UNKNOWN;
  }

  function inferStageFromTarget(target, intent) {
    const clean = normalizeTarget(target);
    const safeIntent = safeText(intent);

    if (clean === TARGETS.DIAMOND_GATE_OVERVIEW || safeIntent === "diamondGate") return STAGES.SPLIT_INTERFACE_GATE;
    if (clean === TARGETS.TRADITIONAL_WEBSITE || safeIntent === "traditionalWebsite") return STAGES.TRADITIONAL_WEBSITE_LANE;
    if (clean === TARGETS.NARRATIVE_PATH || safeIntent === "narrativePath") return STAGES.NARRATIVE_PATH_LANE;
    if (clean === TARGETS.MISSION_OVERVIEW || clean === TARGETS.MISSION_INNER || clean === TARGETS.MISSION_COMMUNITY || clean === TARGETS.MISSION_COLLABORATION || safeIntent === "mission") return STAGES.MISSION_LANE;
    if (clean === TARGETS.SPLIT_INTERFACE || safeIntent === "splitInterface") return STAGES.BRIDGE_LANE;
    if (clean === TARGETS.DIAGNOSTIC_REFERRAL || safeIntent === "diagnosticReferral") return STAGES.DIAGNOSTIC_REFERRAL;

    return STAGES.OPEN_CONVERSATION;
  }

  function inferIntentFromTarget(target) {
    const clean = normalizeTarget(target);

    const map = {
      diamondGateOverviewPath: "diamondGate",
      splitInterfaceBridgePath: "splitInterface",
      traditionalWebsiteOverviewPath: "traditionalWebsite",
      narrativePathOverview: "narrativePath",
      missionOverviewPath: "mission",
      missionInnerPath: "mission",
      missionCommunityPath: "mission",
      missionCollaborationPath: "mission",
      practicalRelevancePath: "practicalRelevance",
      diagnosticReferralPath: "diagnosticReferral",
      diagnosticPath: "diagnostic",
      characterMirrorPath: "characterMirror",
      mirrorlandPath: "mirrorland",
      hearthPath: "hearth",
      frontierPath: "frontier",
      scientificLawPath: "scientificLaw",
      compassPath: "orientation",
      productsPath: "traditionalWebsite",
      lawsPath: "laws",
      seanPath: "sean",
      underdogPath: "underdog",
      charactersPath: "characters",
      recenterNode: "recenter",
      cleanDoor: "recenter"
    };

    return map[clean] || "diamondGate";
  }

  function inferCardinalForTarget(target) {
    const clean = normalizeTarget(target);

    if ([TARGETS.SCIENTIFIC_LAW, TARGETS.LAWS, TARGETS.DIAGNOSTIC, TARGETS.DIAGNOSTIC_REFERRAL].includes(clean)) return "W";
    if ([TARGETS.FRONTIER, TARGETS.HEARTH, TARGETS.MISSION_COLLABORATION, TARGETS.PRACTICAL_RELEVANCE].includes(clean)) return "E";
    if ([TARGETS.MIRRORLAND, TARGETS.NARRATIVE_PATH, TARGETS.CHARACTERS, TARGETS.CHARACTER_MIRROR].includes(clean)) return "S";
    if ([TARGETS.COMPASS, TARGETS.SEAN, TARGETS.UNDERDOG, TARGETS.TRADITIONAL_WEBSITE].includes(clean)) return "N";

    return "C";
  }

  function inferLoopCount(target) {
    const clean = normalizeTarget(target);
    return state.selectedTargets.filter((item) => item === clean).length;
  }

  function inferTopicDepth(target) {
    const intent = inferIntentFromTarget(target);
    return state.transitionTrail.filter((item) => inferIntentFromTarget(item.to) === intent).length;
  }

  function makeOptionKey(option) {
    return [
      option.target || "",
      option.label || "",
      option.promptMode || "",
      option.optionKind || ""
    ].join("::");
  }

  function syncRootState() {
    if (!state.root) return;

    state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
    state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
    state.root.setAttribute("data-jeeves-current-target", state.currentNode || "");
    state.root.setAttribute("data-jeeves-current-topic", state.currentTopic || "");
    state.root.setAttribute("data-jeeves-bridge-offered", state.bridgeOffered ? "true" : "false");
  }

  function cloneState() {
    return {
      ready: state.ready,
      busy: state.busy,
      booted: state.booted,
      revealActive: state.revealActive,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      currentConversationStage: state.currentConversationStage,
      currentEntryLane: state.currentEntryLane,
      lastLane: state.lastLane,
      bridgeOffered: state.bridgeOffered,
      currentNode: state.currentNode,
      currentPath: state.currentPath,
      currentTopic: state.currentTopic,
      currentScopeLane: state.currentScopeLane,
      lastSuccessfulEndpoint: state.lastSuccessfulEndpoint,
      selectedTargets: state.selectedTargets.slice(),
      selectedOptionKeys: state.selectedOptionKeys.slice(),
      visitedNodes: state.visitedNodes.slice(),
      sessionTrail: state.sessionTrail.slice(),
      transitionTrail: state.transitionTrail.slice(),
      branchStack: state.branchStack.slice(),
      returnStack: state.returnStack.slice(),
      lastBridgeContext: state.lastBridgeContext,
      lastError: state.lastError ? safeErrorMessage(state.lastError) : ""
    };
  }

  async function safeReadResponseText(response) {
    try {
      return await response.text();
    } catch (_error) {
      return "";
    }
  }

  function dispatch(name, detail) {
    if (typeof global.dispatchEvent !== "function" || typeof global.CustomEvent !== "function") return;
    global.dispatchEvent(new global.CustomEvent(name, { detail }));
  }

  function safeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function safeErrorMessage(error) {
    return safeText(error && error.message ? error.message : "Unknown Jeeves frontbrain error.").slice(0, 500);
  }
})(typeof window !== "undefined" ? window : globalThis);
