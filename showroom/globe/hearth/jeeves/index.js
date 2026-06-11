// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_FRONTBRAIN_GUIDED_PATH_RHYTHM_SHELL_BOUND_TNT_v25_2
// Full-file replacement.
// Client-side frontbrain / visible conversation carrier only.
// Purpose:
// - Preserve v25.1 shell boot repair.
// - Close the gap between API/North v5.1 and Expression v5.1.
// - Render the new DiamondGateBridge split-interface entrance rhythm.
// - Keep Text Jeeves options conversational.
// - Keep Prepared Doors as route actions.
// - Pass lane/stage/bridge context downstream to API/North.
// - Use Expression as public-language governor when available.
// - Prevent Jeeves from becoming an in-chat assessment engine.
// Does not own:
// - API/North canon
// - Expression wording authority
// - CSS layout
// - HTML shell authority
// - final server meaning
//

"use strict";

(function mountHearthJeevesFrontbrain(global) {
  const CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_GUIDED_PATH_RHYTHM_SHELL_BOUND_TNT_v25_2";
  const PREVIOUS_CONTRACT = "HEARTH_JEEVES_FRONTBRAIN_SHELL_BOOT_BINDING_CONVERSATION_GRAMMAR_TNT_v25_1";

  const API_ENDPOINT = "/api/jeeves";

  const ROOT_ID = "hearthJeevesMount";

  const MAX_THREAD_BUBBLES = 80;
  const MAX_TRAIL_ITEMS = 24;

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

    lastResponse: null,
    lastError: null
  };

  global.HEARTH_JEEVES_READY = false;
  global.mountHearthJeeves = safeMountJeeves;
  global.mountJeeves = safeMountJeeves;

  global.HEARTH_JEEVES_FRONTBRAIN = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: "25.2.0",
    mount: safeMountJeeves,
    getState: () => cloneState(),
    send: (text) => submitVisitorText(text),
    reset: () => resetConversation()
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeMountJeeves, { once: true });
  } else {
    safeMountJeeves();
  }

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
    renderSystemStatus("Jeeves is ready.");
    renderBootEntrance();

    releaseReadyState();
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
    root.classList.add("hearth-jeeves-v25-2");
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
      if (!button || state.busy) return;

      const option = readOptionFromButton(button);
      handleConversationOption(option);
    });

    shell.handoffs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-jeeves-route-option]");
      if (!button || state.busy) return;

      const routeId = button.getAttribute("data-jeeves-route-option") || "";
      const href = button.getAttribute("data-jeeves-handoff-route") || ROUTE_HINTS[routeId] || "";

      handlePreparedDoor(routeId, href);
    });
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

    BOOT_BUBBLES.forEach((bubble) => renderBubble("assistant", shapeText(bubble, {
      intent: "diamondGate",
      selectedTarget: TARGETS.DIAMOND_GATE_OVERVIEW,
      currentConversationStage: STAGES.ENTRANCE_OVERVIEW
    })));

    renderOptions(entranceOptions);
    renderHandoffs(START_HANDOFFS, HANDOFF_LABELS);
  }

  function releaseReadyState() {
    state.ready = true;
    global.HEARTH_JEEVES_READY = true;

    if (state.root) {
      state.root.setAttribute("data-jeeves-ready", "true");
      state.root.setAttribute("data-house-listening", "true");
      state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
      state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
    }

    dispatch("hearth:jeeves-ready", {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT
    });
  }

  function visibleBootFailure(error) {
    state.lastError = error;

    try {
      const root = findOrCreateRoot();
      bindRootToShellContract(root);
      const shell = ensureShell(root);

      root.setAttribute("data-jeeves-ready", "false");
      root.setAttribute("data-jeeves-error", "true");

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
    state.shell.status.textContent = text;
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
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("jeeves-option");
      button.classList.add("jeeves-option-button");

      button.textContent = option.label || "Can you tell me more?";

      button.setAttribute("data-jeeves-option", option.target || "");
      button.setAttribute("data-jeeves-option-index", String(index));
      button.setAttribute("data-option-kind", option.optionKind || OPTION_KINDS.CONVERSATION);
      button.setAttribute("data-prompt-mode", option.promptMode || PROMPT_MODES.UNKNOWN);
      button.setAttribute("data-archetype-alignment", option.archetypeAlignment || ARCHETYPE_ALIGNMENTS.UNKNOWN);
      button.setAttribute("data-bridge-moment", option.bridgeMoment || BRIDGE_MOMENTS.NONE);
      button.setAttribute("data-movement-intent", option.movementIntent || MOVEMENT_INTENTS.ASK);
      button.setAttribute("data-scope-lane", option.scopeLane || inferScopeLane(option.target));
      button.setAttribute("data-option-type", option.type || "conversation");
      button.setAttribute("data-option-label", option.label || "");

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

    updateStateForOption(safeOption);

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
      currentScopeLane: safeOption.scopeLane
    });
  }

  function handlePreparedDoor(routeId, href) {
    const route = normalizeRoute(routeId);
    const targetHref = href || ROUTE_HINTS[route];

    pushTrail({
      type: "handoff",
      route,
      href: targetHref,
      at: new Date().toISOString()
    });

    if (!targetHref) {
      renderBubble("system", "That door is listed, but it does not have a visible route yet.");
      return;
    }

    global.location.href = targetHref;
  }

  function submitVisitorText(text) {
    const visitorText = safeText(text);
    if (!visitorText || state.busy) return;

    renderBubble("user", visitorText);

    const target = inferTargetFromText(visitorText);

    updateStateForOption({
      label: visitorText,
      target,
      type: "conversation",
      scopeLane: inferScopeLane(target),
      promptMode: inferPromptModeFromText(visitorText),
      optionKind: OPTION_KINDS.CONVERSATION,
      archetypeAlignment: inferAlignmentFromTarget(target),
      bridgeMoment: BRIDGE_MOMENTS.BEFORE,
      movementIntent: MOVEMENT_INTENTS.ASK
    });

    submitToApi({
      visitorText,
      selectedTarget: target,
      selectedLabel: visitorText,
      requestMode: target ? "node_enrichment" : "freeform",
      promptMode: inferPromptModeFromText(visitorText),
      optionKind: OPTION_KINDS.CONVERSATION,
      archetypeAlignment: inferAlignmentFromTarget(target),
      bridgeMoment: BRIDGE_MOMENTS.BEFORE,
      movementIntent: MOVEMENT_INTENTS.ASK,
      currentScopeLane: inferScopeLane(target)
    });
  }

  async function submitToApi(partialPayload) {
    if (state.busy) return;

    state.busy = true;
    setTyping(true);
    renderSystemStatus("Jeeves is reading the path.");

    try {
      const payload = buildApiPayload(partialPayload);
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Jeeves API returned " + response.status);
      }

      const data = await response.json();
      const shaped = shapeApiFrame(data);

      state.lastResponse = shaped;

      applyApiState(shaped);
      renderApiFrame(shaped);
    } catch (error) {
      state.lastError = error;
      renderApiFailure(error);
    } finally {
      state.busy = false;
      setTyping(false);
      renderSystemStatus("Jeeves is ready.");
    }
  }

  function buildApiPayload(partialPayload) {
    const payload = partialPayload && typeof partialPayload === "object" ? partialPayload : {};
    const selectedTarget = normalizeTarget(payload.selectedTarget || state.currentNode || TARGETS.DIAMOND_GATE_OVERVIEW);
    const currentLane = payload.currentScopeLane || inferScopeLane(selectedTarget);

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

    bubbles.forEach((bubble) => renderBubble("assistant", bubble));

    renderOptions(options);
    renderHandoffs(handoffs, frame.handoffLabels || {}, frame.routeHints || {});
  }

  function renderApiFailure(error) {
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

    if (state.root) {
      state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
      state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
      state.root.setAttribute("data-jeeves-current-target", state.currentNode || "");
      state.root.setAttribute("data-jeeves-current-topic", state.currentTopic || "");
    }
  }

  function updateStateForOption(option) {
    const target = normalizeTarget(option.target || "");
    const label = safeText(option.label || "");
    const nextLane = inferLaneFromTarget(target, inferIntentFromTarget(target));
    const priorTarget = state.currentNode;

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

    if (state.root) {
      state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
      state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
      state.root.setAttribute("data-jeeves-current-target", state.currentNode || "");
    }
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

    clearShell(state.shell);
    renderSystemStatus("Jeeves is ready.");
    renderBootEntrance();

    if (state.root) {
      state.root.setAttribute("data-jeeves-stage", state.currentConversationStage);
      state.root.setAttribute("data-jeeves-entry-lane", state.currentEntryLane || "");
    }
  }

  function setTyping(isTyping) {
    if (!state.root || !state.shell) return;

    state.root.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    state.shell.typing.textContent = isTyping ? "Jeeves is preparing the next answer..." : "";
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

    return {
      label: safeText(source.label || ""),
      target: normalizeTarget(source.target || ""),
      type: source.type || "conversation",
      scopeLane: source.scopeLane || inferScopeLane(source.target),
      promptMode: source.promptMode || PROMPT_MODES.UNKNOWN,
      optionKind: source.optionKind || OPTION_KINDS.CONVERSATION,
      archetypeAlignment: source.archetypeAlignment || inferAlignmentFromTarget(source.target),
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

    if (/\bwhat is diamondgatebridge|what is diamond gate bridge|what is this place|what is this site\b/.test(value)) {
      return TARGETS.DIAMOND_GATE_OVERVIEW;
    }

    if (/\bnarrative path|story path|narrative side\b/.test(value)) {
      return TARGETS.NARRATIVE_PATH;
    }

    if (/\btraditional website|public website|website for|public pages|site guide\b/.test(value)) {
      return TARGETS.TRADITIONAL_WEBSITE;
    }

    if (/\bmission|inner mission|community mission|protect children|protect animals|bullying|collaboration\b/.test(value)) {
      return TARGETS.MISSION_OVERVIEW;
    }

    if (/\breal world|practical|why does this matter|why this matters\b/.test(value)) {
      return TARGETS.PRACTICAL_RELEVANCE;
    }

    if (/\bwhich archetype|what archetype|which character am i|what character am i|assess me|score me|diagnose me|alignment read|mirror question\b/.test(value)) {
      return TARGETS.DIAGNOSTIC_REFERRAL;
    }

    if (/\bcoherence diagnostic|diagnostic\b/.test(value)) {
      return TARGETS.DIAGNOSTIC;
    }

    if (/\bcharacter mirror\b/.test(value)) {
      return TARGETS.CHARACTER_MIRROR;
    }

    if (/\bmirrorland|world window|south gate\b/.test(value)) {
      return TARGETS.MIRRORLAND;
    }

    if (/\bhearth|mission control|window within the window\b/.test(value)) {
      return TARGETS.HEARTH;
    }

    if (/\bfrontier|playground|energy|water|waste|infrastructure\b/.test(value)) {
      return TARGETS.FRONTIER;
    }

    if (/\bscientific law|proof|evidence|test\b/.test(value)) {
      return TARGETS.SCIENTIFIC_LAW;
    }

    if (/\bcompass|where should i start|start\b/.test(value)) {
      return TARGETS.COMPASS;
    }

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

    if ([
      TARGETS.SCIENTIFIC_LAW,
      TARGETS.LAWS
    ].includes(clean)) return ARCHETYPE_ALIGNMENTS.PROOF;

    if ([
      TARGETS.FRONTIER,
      TARGETS.PRACTICAL_RELEVANCE,
      TARGETS.PRODUCTS,
      TARGETS.MISSION_COLLABORATION
    ].includes(clean)) return ARCHETYPE_ALIGNMENTS.PRACTICAL;

    if ([
      TARGETS.MISSION_OVERVIEW,
      TARGETS.MISSION_INNER,
      TARGETS.MISSION_COMMUNITY,
      TARGETS.DIAGNOSTIC_REFERRAL,
      TARGETS.DIAGNOSTIC,
      TARGETS.UNDERDOG
    ].includes(clean)) return ARCHETYPE_ALIGNMENTS.PERSONAL;

    if ([
      TARGETS.SEAN
    ].includes(clean)) return ARCHETYPE_ALIGNMENTS.SOURCE;

    if ([
      TARGETS.NARRATIVE_PATH,
      TARGETS.MIRRORLAND,
      TARGETS.HEARTH,
      TARGETS.CHARACTERS,
      TARGETS.CHARACTER_MIRROR
    ].includes(clean)) return ARCHETYPE_ALIGNMENTS.STORY;

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

    if ([
      TARGETS.SCIENTIFIC_LAW,
      TARGETS.LAWS,
      TARGETS.DIAGNOSTIC,
      TARGETS.DIAGNOSTIC_REFERRAL
    ].includes(clean)) return "W";

    if ([
      TARGETS.FRONTIER,
      TARGETS.HEARTH,
      TARGETS.MISSION_COLLABORATION,
      TARGETS.PRACTICAL_RELEVANCE
    ].includes(clean)) return "E";

    if ([
      TARGETS.MIRRORLAND,
      TARGETS.NARRATIVE_PATH,
      TARGETS.CHARACTERS,
      TARGETS.CHARACTER_MIRROR
    ].includes(clean)) return "S";

    if ([
      TARGETS.COMPASS,
      TARGETS.SEAN,
      TARGETS.UNDERDOG,
      TARGETS.TRADITIONAL_WEBSITE
    ].includes(clean)) return "N";

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

  function cloneState() {
    return {
      ready: state.ready,
      busy: state.busy,
      booted: state.booted,
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
      selectedTargets: state.selectedTargets.slice(),
      selectedOptionKeys: state.selectedOptionKeys.slice(),
      visitedNodes: state.visitedNodes.slice(),
      sessionTrail: state.sessionTrail.slice(),
      transitionTrail: state.transitionTrail.slice(),
      branchStack: state.branchStack.slice(),
      returnStack: state.returnStack.slice(),
      lastError: state.lastError ? safeErrorMessage(state.lastError) : ""
    };
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
