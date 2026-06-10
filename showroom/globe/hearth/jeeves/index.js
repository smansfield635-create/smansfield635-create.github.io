// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE_TNT_v5
// Full-file replacement.
// Owns: Jeeves deterministic conversation engine, half-step fork logic, customized traversal, internal/external dialect, intent-to-dialogue mapping, guided route handoffs.
// Does not own: visual styling, Hearth globe chamber, Canvas Bishop, diagnostics authority, freeform AI, WebGL, runtime restart, final visual pass.

(function hearthJeevesHalfStepCustomizedTraversalEngine(global) {
  "use strict";

  var root = global || window;
  var doc = root.document || null;

  var CONTRACT = "HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE_TNT_v5";
  var RECEIPT = "HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE_RECEIPT_v5";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE_TNT_v4";
  var VERSION = "2026-06-09.hearth-jeeves-half-step-customized-traversal-engine-v5";
  var FILE = "/showroom/globe/hearth/jeeves/index.js";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var DEFAULT_ROUTES = {
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    frontier: "/explore/frontier/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/hearth/diagnostic/",
    compass: "/"
  };

  var NO_CLAIMS = {
    freeformAi: false,
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  };

  var els = {};
  var templates = {};
  var config = {};
  var timers = [];

  var state = {
    booted: false,
    initializedAt: "",
    updatedAt: "",
    currentNode: "",
    previousNodes: [],
    speaking: false,
    minimized: false,
    mode: "",
    directMode: false,
    journeyMode: false,
    operationalMode: false,
    pendingRoute: null,
    memory: [],
    profile: {
      openingPreference: "",
      interest: "",
      pace: "",
      desire: "",
      routeStyle: ""
    },
    transcript: [],
    nodeVisits: {},
    lastReceipt: null
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function $(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function $all(selector) {
    if (!doc) return [];
    try {
      return Array.prototype.slice.call(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function readConfig() {
    var node = $("#jeevesConversationConfig");
    var parsed = {};

    if (node && node.textContent) {
      try {
        parsed = JSON.parse(node.textContent);
      } catch (_error) {
        parsed = {};
      }
    }

    if (!isObject(parsed.routes)) parsed.routes = {};
    parsed.routes = Object.assign({}, DEFAULT_ROUTES, parsed.routes);

    return parsed;
  }

  function cacheElements() {
    els.page = $("[data-jeeves-page='true']");
    els.screenShell = $("[data-jeeves-screen-shell='true']");
    els.screenGlass = $("[data-jeeves-screen-glass='true']");
    els.thread = $("[data-jeeves-thread='true']");
    els.promptGrid = $("[data-jeeves-prompt-grid='true']");
    els.promptLabel = $("[data-jeeves-prompt-label]");
    els.typing = $("[data-jeeves-typing]");
    els.handoffDock = $("[data-jeeves-handoff-dock='true']");
    els.handoffGrid = $("[data-jeeves-handoff-grid='true']");
    els.status = $("[data-jeeves-status]");
    els.statusText = $("[data-jeeves-status-text]");
    els.minimized = $("[data-jeeves-minimized]");
    els.contextRail = $("[data-jeeves-context-rail='true']");

    templates.message = $("#jeevesMessageTemplate");
    templates.option = $("#jeevesOptionTemplate");
    templates.routeOption = $("#jeevesRouteOptionTemplate");
  }

  function clearTimers() {
    timers.forEach(function clear(timer) {
      root.clearTimeout(timer);
    });
    timers = [];
    state.speaking = false;
  }

  function setStatus(status, label) {
    if (els.status) {
      els.status.setAttribute("data-jeeves-status", status || "listening");
    }

    if (els.statusText) {
      els.statusText.textContent = label || "House listening";
    }
  }

  function setTyping(active) {
    if (!els.typing) return;
    els.typing.setAttribute("data-jeeves-typing", active ? "true" : "false");
  }

  function scrollThread() {
    if (!els.thread) return;

    try {
      var isMobile = root.matchMedia && root.matchMedia("(max-width: 720px)").matches;

      if (isMobile) {
        root.requestAnimationFrame(function scrollPage() {
          var message = els.thread.lastElementChild;
          if (message && message.scrollIntoView) {
            message.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
        return;
      }

      els.thread.scrollTop = els.thread.scrollHeight;
    } catch (_error) {}
  }

  function expressionLabel(origin, expression) {
    if (origin === "system") return "House";
    if (origin === "jeeves") return "Jeeves";
    if (expression === "internal") return "Thought";
    return "You";
  }

  function createMessage(origin, text, options) {
    options = options || {};

    var expression = options.expression || "external";
    var node = null;
    var p = null;
    var name = null;

    if (templates.message && templates.message.content) {
      node = templates.message.content.firstElementChild.cloneNode(true);
    } else {
      node = doc.createElement("article");
      node.className = "jeeves-message";
      name = doc.createElement("div");
      name.className = "jeeves-message-name";
      p = doc.createElement("p");
      node.appendChild(name);
      node.appendChild(p);
    }

    node.setAttribute("data-message-origin", origin);
    node.setAttribute("data-message-expression", expression);

    if (options.emphasis) {
      node.setAttribute("data-message-emphasis", "true");
    }

    if (options.intent) {
      node.setAttribute("data-message-intent", options.intent);
    }

    name = node.querySelector(".jeeves-message-name");
    p = node.querySelector("p");

    if (name) {
      name.textContent = expressionLabel(origin, expression);
    }

    if (p) {
      p.textContent = asString(text);
    }

    return node;
  }

  function addMessage(origin, text, options) {
    if (!els.thread) return null;

    options = options || {};

    var node = createMessage(origin, text, options);
    els.thread.appendChild(node);
    scrollThread();

    state.transcript.push({
      at: nowIso(),
      origin: origin,
      expression: options.expression || "external",
      intent: options.intent || "",
      text: asString(text),
      emphasis: Boolean(options.emphasis)
    });

    if (state.transcript.length > 500) {
      state.transcript.splice(0, state.transcript.length - 500);
    }

    state.updatedAt = nowIso();
    return node;
  }

  function clearInitialSeed() {
    if (!els.thread) return;
    var seed = els.thread.querySelector("[data-seed-message='true']");
    if (seed) {
      seed.remove();
    }
  }

  function clearOptions() {
    if (els.promptGrid) els.promptGrid.innerHTML = "";
    if (els.handoffGrid) els.handoffGrid.innerHTML = "";
    if (els.handoffDock) els.handoffDock.setAttribute("data-handoff-visible", "false");
  }

  function resolveRoute(routeKeyOrPath) {
    var key = asString(routeKeyOrPath);
    if (!key) return "#";
    return config.routes[key] || key;
  }

  function optionElement(option) {
    var isRoute = option.type === "route" || option.type === "control";
    var node = null;
    var labelNode = null;

    if (isRoute && templates.routeOption && templates.routeOption.content) {
      node = templates.routeOption.content.firstElementChild.cloneNode(true);
    } else if (templates.option && templates.option.content) {
      node = templates.option.content.firstElementChild.cloneNode(true);
    } else {
      node = isRoute ? doc.createElement("a") : doc.createElement("button");
      node.className = isRoute ? "jeeves-option jeeves-option-route" : "jeeves-option";
      if (!isRoute) node.type = "button";
      labelNode = doc.createElement("span");
      node.appendChild(labelNode);
    }

    if (!isRoute) node.type = "button";
    if (isRoute) node.href = resolveRoute(option.routeKey || option.route);

    node.setAttribute("data-option-type", option.type || "conversation");
    node.setAttribute("data-option-expression", option.expression || "external");
    node.setAttribute("data-option-target", option.target || option.routeKey || option.route || option.action || "");
    node.setAttribute("data-jeeves-option", "true");

    if (option.intent) {
      node.setAttribute("data-option-intent", option.intent);
    }

    labelNode = node.querySelector("span") || node;
    labelNode.textContent = option.label || "Continue";

    node.addEventListener("click", function onOption(event) {
      event.preventDefault();
      handleOption(option);
    });

    return node;
  }

  function renderOptions(options, label) {
    clearOptions();

    if (els.promptLabel) {
      els.promptLabel.textContent = label || "Choose what to say";
    }

    var conversationOptions = [];
    var routeOptions = [];

    (options || []).forEach(function sort(option) {
      if (option.type === "route" || option.type === "control") {
        routeOptions.push(option);
      } else {
        conversationOptions.push(option);
      }
    });

    conversationOptions.forEach(function appendConversation(option) {
      if (!els.promptGrid) return;
      els.promptGrid.appendChild(optionElement(option));
    });

    routeOptions.forEach(function appendRoute(option) {
      if (!els.handoffGrid) return;
      els.handoffGrid.appendChild(optionElement(option));
    });

    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", routeOptions.length ? "true" : "false");
    }
  }

  function routeTo(routeKeyOrPath) {
    var route = resolveRoute(routeKeyOrPath);
    if (!route || route === "#") return false;

    root.location.href = route;
    return true;
  }

  function visitorTextFor(option) {
    return option.userText || option.label || "Continue.";
  }

  function visitorExpressionFor(option) {
    return option.expression || "external";
  }

  function remember(option) {
    if (!option || !option.memory) return;

    var memory = Array.isArray(option.memory) ? option.memory : [option.memory];

    memory.forEach(function add(item) {
      var value = asString(item);
      if (!value) return;
      if (state.memory.indexOf(value) === -1) {
        state.memory.push(value);
      }
    });

    if (state.memory.length > 100) {
      state.memory.splice(0, state.memory.length - 100);
    }
  }

  function addVisitorIntent(option) {
    addMessage("visitor", visitorTextFor(option), {
      expression: visitorExpressionFor(option),
      intent: option.intent || option.target || option.action || option.routeKey || ""
    });

    remember(option);
  }

  function routeAfterJeeves(option) {
    clearTimers();
    clearOptions();
    setStatus("routing", "Opening a guided door");
    setTyping(false);

    addVisitorIntent(option);

    state.pendingRoute = option.routeKey || option.route || "";
    state.updatedAt = nowIso();

    var line = option.confirmation ||
      "Very well. I will open that door for you now. Keep the thread in mind when you arrive.";

    timers.push(root.setTimeout(function speakRoute() {
      addMessage("jeeves", line, { emphasis: true });
      timers.push(root.setTimeout(function navigate() {
        routeTo(option.routeKey || option.route);
      }, Number(option.routeDelay || 1000)));
    }, 420));
  }

  function handleMode(option) {
    if (!option.mode) return;

    state.mode = option.mode;
    state.directMode = option.mode === "direct";
    state.operationalMode = option.mode === "operational";
    state.journeyMode = option.mode === "adaptive";

    state.profile.openingPreference = option.mode;
  }

  function handleOption(option) {
    if (!option || state.speaking) return;

    if (option.type === "route" || option.type === "control") {
      routeAfterJeeves(option);
      return;
    }

    if (option.action === "minimize") {
      addVisitorIntent(option);
      minimize();
      return;
    }

    if (option.action === "restore") {
      restore();
      return;
    }

    if (option.action === "back") {
      addVisitorIntent(option);
      goBack();
      return;
    }

    if (option.action === "restart") {
      addVisitorIntent(option);
      runNode("intro", { preserveHistory: false });
      return;
    }

    handleMode(option);

    if (option.profileKey && option.profileValue) {
      state.profile[option.profileKey] = option.profileValue;
      if (!state.mode) state.mode = "adaptive";
      state.journeyMode = true;
      state.directMode = false;
      state.operationalMode = false;
    }

    addVisitorIntent(option);
    runNode(option.target || "directStart");
  }

  function normalizeBeat(beat) {
    if (typeof beat === "string") {
      return { text: beat, delay: 900, emphasis: false };
    }

    return {
      text: asString(beat.text),
      delay: Number(beat.delay || 900),
      emphasis: Boolean(beat.emphasis)
    };
  }

  function customizedNudge() {
    var interest = state.profile.interest || "";
    var pace = state.profile.pace || "";
    var desire = state.profile.desire || "";

    if (interest === "story") return "Then I will begin where the house becomes a story.";
    if (interest === "world") return "Then I will keep the world in view.";
    if (interest === "people") return "Then we should not ignore the people who make it alive.";
    if (interest === "science") return "Then I will keep the systems visible.";
    if (interest === "hidden structure") return "Then I will leave the hidden structure close to the surface.";
    if (desire === "proof") return "Then evidence should not be too far from the path.";
    if (pace === "fast and direct") return "Then I will move cleanly.";
    if (pace === "mystery-first") return "Then I will not explain the wonder out of it.";

    return "Good. I will keep your route responsive.";
  }

  function node(id) {
    return NODES[id] || NODES.directStart || NODES.intro;
  }

  function nodeOptions(n) {
    if (!n) return [];
    return typeof n.options === "function" ? n.options(state) : (n.options || []);
  }

  function runNode(id, options) {
    options = options || {};
    var n = node(id);
    var previous = state.currentNode;

    clearTimers();
    clearInitialSeed();
    clearOptions();
    setTyping(true);
    setStatus("speaking", "Jeeves is speaking");

    if (!options.preserveHistory && id === "intro") {
      state.previousNodes = [];
    } else if (previous && previous !== id) {
      state.previousNodes.push(previous);
      if (state.previousNodes.length > 50) {
        state.previousNodes.splice(0, state.previousNodes.length - 50);
      }
    }

    state.currentNode = id;
    state.nodeVisits[id] = (state.nodeVisits[id] || 0) + 1;
    state.speaking = true;
    state.updatedAt = nowIso();

    var beats = typeof n.beats === "function" ? n.beats(state) : n.beats;
    var cumulative = Number(n.startDelay || 220);

    (beats || []).map(normalizeBeat).forEach(function deliver(beat, index, list) {
      cumulative += beat.delay;

      timers.push(root.setTimeout(function onBeat() {
        addMessage("jeeves", beat.text, {
          expression: "external",
          emphasis: beat.emphasis
        });

        if (index === list.length - 1) {
          state.speaking = false;
          setTyping(false);
          setStatus("listening", "House listening");

          timers.push(root.setTimeout(function showFork() {
            renderOptions(nodeOptions(n), n.optionLabel || "Choose what to say");
          }, Number(n.forkDelay || 480)));
        }
      }, cumulative));
    });
  }

  function goBack() {
    var previous = state.previousNodes.pop();
    if (!previous) {
      runNode("intro", { preserveHistory: false });
      return;
    }

    runNode(previous, { fromBack: true });
  }

  function minimize() {
    state.minimized = true;

    if (els.screenShell) {
      els.screenShell.hidden = true;
      els.screenShell.setAttribute("aria-hidden", "true");
    }

    if (els.contextRail) {
      els.contextRail.hidden = true;
      els.contextRail.setAttribute("aria-hidden", "true");
    }

    if (els.minimized) {
      els.minimized.setAttribute("data-jeeves-minimized", "true");
      els.minimized.hidden = false;
    }

    setStatus("minimized", "House minimized");
  }

  function restore() {
    state.minimized = false;

    if (els.screenShell) {
      els.screenShell.hidden = false;
      els.screenShell.setAttribute("aria-hidden", "false");
    }

    if (els.contextRail) {
      els.contextRail.hidden = false;
      els.contextRail.setAttribute("aria-hidden", "false");
    }

    if (els.minimized) {
      els.minimized.setAttribute("data-jeeves-minimized", "false");
    }

    setStatus("listening", "House listening");
    addMessage("jeeves", "I am here. The house did not lose the thread.", { emphasis: true });
    renderOptions(nodeOptions(node(state.currentNode || "intro")), "Choose what to say");
  }

  function bindStaticActions() {
    $all("[data-jeeves-action]").forEach(function bind(nodeEl) {
      if (nodeEl.dataset.jeevesActionBound === "true") return;
      nodeEl.dataset.jeevesActionBound = "true";

      nodeEl.addEventListener("click", function click(event) {
        event.preventDefault();

        var action = nodeEl.getAttribute("data-jeeves-action");
        if (action === "restore") restore();
        if (action === "minimize") minimize();
      });
    });
  }

  function getReceipt() {
    var receipt = {
      PACKET: "HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE_PACKET_v5",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      REGISTRY_PLANE: "19x19",
      EXTENSION_PATH: true,
      HOUSE_INTERFACE: "Jeeves",
      TALK_TO_THE_HOUSE: true,
      CENTER_SCREEN_INTERFACE: true,
      CHAT_THREAD_INTERFACE: true,
      TOP_ROUTE_BUBBLES: false,
      DETERMINISTIC_CONVERSATION: true,
      FREEFORM_AI: false,
      CONVERSATION_FORK_MAP: true,
      EVERY_NODE_ENDS_IN_FORK: true,
      THREE_MODE_OPENING_FORK: true,
      HALF_STEP_FORK_LOGIC: true,
      DUPLICATE_PREFACE_REDUCTION: true,
      INTENT_TO_DIALOGUE: true,
      INTERNAL_EXTERNAL_DIALECT: true,
      CUSTOMIZED_TRAVERSAL: true,
      GUIDED_HANDOFFS: true,
      ROUTE_HANDOFFS_COLOR_DISTINCT: true,
      CURRENT_NODE: state.currentNode,
      MODE: state.mode,
      DIRECT_MODE: state.directMode,
      JOURNEY_MODE: state.journeyMode,
      OPERATIONAL_MODE: state.operationalMode,
      PROFILE: clonePlain(state.profile),
      MEMORY: clonePlain(state.memory),
      TRANSCRIPT_COUNT: state.transcript.length,
      NODE_VISITS: clonePlain(state.nodeVisits),
      MINIMIZED: state.minimized,
      SPEAKING: state.speaking,
      INITIALIZED_AT: state.initializedAt,
      UPDATED_AT: nowIso()
    };

    Object.assign(receipt, NO_CLAIMS);

    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function getReceiptLight() {
    var receipt = getReceipt();

    return {
      CONTRACT: receipt.CONTRACT,
      RECEIPT: receipt.RECEIPT,
      VERSION: receipt.VERSION,
      FILE: receipt.FILE,
      ROUTE: receipt.ROUTE,
      CENTER_SCREEN_INTERFACE: receipt.CENTER_SCREEN_INTERFACE,
      CHAT_THREAD_INTERFACE: receipt.CHAT_THREAD_INTERFACE,
      TOP_ROUTE_BUBBLES: receipt.TOP_ROUTE_BUBBLES,
      DETERMINISTIC_CONVERSATION: receipt.DETERMINISTIC_CONVERSATION,
      FREEFORM_AI: receipt.FREEFORM_AI,
      THREE_MODE_OPENING_FORK: receipt.THREE_MODE_OPENING_FORK,
      HALF_STEP_FORK_LOGIC: receipt.HALF_STEP_FORK_LOGIC,
      INTENT_TO_DIALOGUE: receipt.INTENT_TO_DIALOGUE,
      INTERNAL_EXTERNAL_DIALECT: receipt.INTERNAL_EXTERNAL_DIALECT,
      CUSTOMIZED_TRAVERSAL: receipt.CUSTOMIZED_TRAVERSAL,
      GUIDED_HANDOFFS: receipt.GUIDED_HANDOFFS,
      ROUTE_HANDOFFS_COLOR_DISTINCT: receipt.ROUTE_HANDOFFS_COLOR_DISTINCT,
      EVERY_NODE_ENDS_IN_FORK: receipt.EVERY_NODE_ENDS_IN_FORK,
      CURRENT_NODE: receipt.CURRENT_NODE,
      MODE: receipt.MODE,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      UPDATED_AT: receipt.UPDATED_AT
    };
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,

      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      speak: runNode,
      runNode: runNode,
      goBack: goBack,
      minimize: minimize,
      restore: restore,
      getState: function getState() {
        return clonePlain(state);
      },
      getReceipt: getReceipt,
      getReceiptLight: getReceiptLight,
      getTranscript: function getTranscript() {
        return clonePlain(state.transcript);
      },
      getConversationMap: function getConversationMap() {
        return Object.keys(NODES);
      },

      deterministicConversation: true,
      freeformAi: false,
      centerScreenInterface: true,
      chatThreadInterface: true,
      topRouteBubbles: false,
      everyNodeEndsInFork: true,
      threeModeOpeningFork: true,
      halfStepForkLogic: true,
      duplicatePrefaceReduction: true,
      intentToDialogue: true,
      internalExternalDialect: true,
      customizedTraversal: true,
      guidedHandoffs: true,
      routeHandoffsColorDistinct: true
    };

    Object.assign(api, NO_CLAIMS);

    root.HEARTH_JEEVES_HOUSE_INTERFACE = api;
    root.HEARTH_JEEVES_CHAT_THREAD_ENGINE = api;
    root.HEARTH_JEEVES_CENTER_SCREEN_ENGINE = api;
    root.HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE = api;

    root.HEARTH.jeevesHouseInterface = api;
    root.HEARTH.talkToTheHouse = api;
    root.HEARTH.jeevesChatThreadEngine = api;
    root.HEARTH.jeevesHalfStepCustomizedTraversalEngine = api;

    root.DEXTER_LAB.hearthJeevesHouseInterface = api;
    root.DEXTER_LAB.hearthJeevesChatThreadEngine = api;
    root.DEXTER_LAB.hearthJeevesHalfStepCustomizedTraversalEngine = api;

    root.__HEARTH_JEEVES_HOUSE_INTERFACE_LOADED__ = true;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_CONTRACT__ = CONTRACT;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_ROUTE__ = ROUTE;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_FREEFORM_AI__ = false;
    root.__HEARTH_JEEVES_CENTER_SCREEN_INTERFACE__ = true;
    root.__HEARTH_JEEVES_CHAT_THREAD_INTERFACE__ = true;
    root.__HEARTH_JEEVES_TOP_ROUTE_BUBBLES__ = false;
    root.__HEARTH_JEEVES_THREE_MODE_OPENING_FORK__ = true;
    root.__HEARTH_JEEVES_HALF_STEP_FORK_LOGIC__ = true;
    root.__HEARTH_JEEVES_INTENT_TO_DIALOGUE__ = true;
    root.__HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT__ = true;
    root.__HEARTH_JEEVES_CUSTOMIZED_TRAVERSAL__ = true;
    root.__HEARTH_JEEVES_GUIDED_HANDOFFS__ = true;
    root.__HEARTH_JEEVES_ROUTE_HANDOFFS_COLOR_DISTINCT__ = true;

    return api;
  }

  var commonBackOptions = [
    {
      label: "Back to the beginning.",
      type: "restart",
      expression: "external",
      action: "restart",
      intent: "restart",
      userText: "Let’s start again from the beginning.",
      memory: "returned-to-start"
    }
  ];

  function withBack(options) {
    return (options || []).concat(commonBackOptions);
  }

  var NODES = {
    intro: {
      optionLabel: "Choose how Jeeves should guide you",
      forkDelay: 420,
      beats: [
        { text: "Welcome to Hearth.", delay: 520, emphasis: true },
        { text: "I am Jeeves.", delay: 900, emphasis: true },
        { text: "I speak for the house here.", delay: 960 },
        { text: "Before we begin, choose how you want me to guide you.", delay: 1040, emphasis: true }
      ],
      options: [
        {
          label: "Ask me and shape the conversation.",
          type: "conversation",
          expression: "external",
          mode: "adaptive",
          target: "calibrateInterest",
          intent: "adaptiveConversation",
          userText: "Ask me a question first, then shape the path around what I care about.",
          memory: "mode-adaptive"
        },
        {
          label: "Let’s get straight to the point.",
          type: "conversation",
          expression: "external",
          mode: "direct",
          target: "directStart",
          intent: "directConversation",
          userText: "Let’s get straight to the point. Give me the clean version first.",
          memory: "mode-direct"
        },
        {
          label: "Use the simple tour guide.",
          type: "conversation",
          expression: "external",
          mode: "operational",
          target: "operationalTour",
          intent: "simpleTourGuide",
          userText: "Skip the conversation for now. Use the simple tour guide.",
          memory: "mode-operational"
        }
      ]
    },

    calibrateInterest: {
      optionLabel: "Choose what catches you first",
      beats: [
        { text: "Good.", delay: 620, emphasis: true },
        { text: "One question first.", delay: 900 },
        { text: "What catches you first in a place like this?", delay: 1040, emphasis: true }
      ],
      options: [
        {
          label: "The story.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "story",
          intent: "interestStory",
          userText: "The story catches me first.",
          memory: "interest-story"
        },
        {
          label: "The world.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "world",
          intent: "interestWorld",
          userText: "The world itself catches me first.",
          memory: "interest-world"
        },
        {
          label: "The people.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "people",
          intent: "interestPeople",
          userText: "The people and characters catch me first.",
          memory: "interest-people"
        },
        {
          label: "The science.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "science",
          intent: "interestScience",
          userText: "The science catches me first.",
          memory: "interest-science"
        },
        {
          label: "The hidden structure.",
          type: "conversation",
          expression: "internal",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "hidden structure",
          intent: "interestHiddenStructure",
          userText: "There is something beneath the surface here. I want to understand the structure behind it.",
          memory: "interest-hidden-structure"
        },
        {
          label: "I need to get my bearings.",
          type: "conversation",
          expression: "internal",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "orientation",
          intent: "needBearings",
          userText: "I’m not lost, exactly. I just need to understand what kind of place this is.",
          memory: "interest-orientation"
        }
      ]
    },

    calibratePace: {
      optionLabel: "Choose your pace",
      beats: [
        { text: customizedNudge(), delay: 720, emphasis: true },
        { text: "How should I move?", delay: 940, emphasis: true }
      ],
      options: [
        {
          label: "Slow and immersive.",
          type: "conversation",
          expression: "external",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "slow and immersive",
          intent: "paceSlowImmersive",
          userText: "Move slowly and let it feel immersive.",
          memory: "pace-slow-immersive"
        },
        {
          label: "Fast and direct.",
          type: "conversation",
          expression: "external",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "fast and direct",
          intent: "paceFastDirect",
          userText: "Move fast and direct. Keep the thread clean.",
          memory: "pace-fast-direct"
        },
        {
          label: "Explain the logic.",
          type: "conversation",
          expression: "external",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "logic-first",
          intent: "paceLogicFirst",
          userText: "Explain the logic as we go.",
          memory: "pace-logic-first"
        },
        {
          label: "Show me the mystery first.",
          type: "conversation",
          expression: "internal",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "mystery-first",
          intent: "paceMysteryFirst",
          userText: "I want to feel the mystery first before everything is explained.",
          memory: "pace-mystery-first"
        }
      ]
    },

    calibrateDesire: {
      optionLabel: "Choose what you want first",
      beats: [
        { text: "Good.", delay: 620, emphasis: true },
        { text: "What should the house give you first?", delay: 1040, emphasis: true }
      ],
      options: [
        {
          label: "Orientation.",
          type: "conversation",
          expression: "external",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "orientation",
          intent: "desireOrientation",
          userText: "I want orientation first.",
          memory: "desire-orientation"
        },
        {
          label: "Meaning.",
          type: "conversation",
          expression: "internal",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "meaning",
          intent: "desireMeaning",
          userText: "I want to understand why this place matters.",
          memory: "desire-meaning"
        },
        {
          label: "Discovery.",
          type: "conversation",
          expression: "internal",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "discovery",
          intent: "desireDiscovery",
          userText: "I want to discover it without having everything flattened into explanation.",
          memory: "desire-discovery"
        },
        {
          label: "Proof.",
          type: "conversation",
          expression: "external",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "proof",
          intent: "desireProof",
          userText: "I want proof first.",
          memory: "desire-proof"
        },
        {
          label: "A path to follow.",
          type: "conversation",
          expression: "external",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "a path to follow",
          intent: "desirePath",
          userText: "Give me a path to follow.",
          memory: "desire-path"
        }
      ]
    },

    calibrationReady: {
      optionLabel: "Choose the first door",
      beats: function beats() {
        return [
          { text: customizedNudge(), delay: 720, emphasis: true },
          { text: "Choose the first door.", delay: 940, emphasis: true }
        ];
      },
      options: function options() {
        return withBack([
          {
            label: "Show me where I am.",
            type: "conversation",
            expression: "external",
            target: "whereAmI",
            intent: "whereAmI",
            userText: "Show me where I am."
          },
          {
            label: "Explain Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearth",
            userText: "Explain Hearth."
          },
          {
            label: "Explain Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Explain Audralia."
          },
          {
            label: "Who is working here?",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "characters",
            userText: "Who is working here?"
          },
          {
            label: "I think I’m ready to choose a door.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "readyForDoor",
            userText: "I think I’m ready to choose a door now."
          }
        ]);
      }
    },

    directStart: {
      optionLabel: "Choose what to unpack",
      beats: [
        { text: "Understood.", delay: 620, emphasis: true },
        { text: "Here is the clean frame: Hearth is the house interface. Audralia is the world beyond the window. Frontier is where the systems are tested.", delay: 1320 },
        { text: "Choose what to unpack.", delay: 920, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Start with Hearth."
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Start with Audralia."
          },
          {
            label: "Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "Start with Frontier."
          },
          {
            label: "First door.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whereFirst",
            userText: "Show me the first door."
          },
          {
            label: "I still need the basic map.",
            type: "conversation",
            expression: "internal",
            target: "whereAmI",
            intent: "needBasicMap",
            userText: "I still need the basic map before I choose anything."
          }
        ]);
      }
    },

    operationalTour: {
      optionLabel: "Choose a place",
      beats: [
        { text: "Very well.", delay: 620, emphasis: true },
        { text: "I will act as your tour guide.", delay: 940 },
        { text: "Choose a place.", delay: 860, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Hearth chamber.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Take me to the Hearth chamber.",
            confirmation: "Hearth chamber first. Good. I will take you there."
          },
          {
            label: "Audralia.",
            type: "route",
            expression: "external",
            routeKey: "audralia",
            intent: "routeAudralia",
            userText: "Take me to Audralia.",
            confirmation: "Audralia is the world beyond the window. I will open it now."
          },
          {
            label: "Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Take me to Frontier.",
            confirmation: "Frontier is the systems field. I will take you there."
          },
          {
            label: "Characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Take me to the characters.",
            confirmation: "The character wing is the right place for people and motive. I will open it now."
          },
          {
            label: "Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            confirmation: "The Globe Window widens the frame. I will open it now."
          },
          {
            label: "Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            confirmation: "The Control Room is diagnostic. I will take you there."
          }
        ]);
      }
    },

    whereAmI: {
      optionLabel: "Choose the next orientation",
      beats: [
        { text: "You are at the threshold of Hearth.", delay: 620, emphasis: true },
        { text: "This is the receiving room: page, house, and window meeting in one place.", delay: 1120 },
        { text: "Choose what needs focus.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "The house.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHouse",
            userText: "Focus on the house."
          },
          {
            label: "The world beyond the window.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainWorldBeyondWindow",
            userText: "Focus on the world beyond the window."
          },
          {
            label: "I’m starting to see the frame.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "seeingFrame",
            userText: "I’m starting to see the frame. I may be ready for a path."
          },
          {
            label: "Show me the Hearth page.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Show me the Hearth page.",
            confirmation: "Yes. Hearth is the proper first room. I will take you back to the chamber."
          }
        ]);
      }
    },

    website: {
      optionLabel: "Choose the next frame",
      beats: [
        { text: "Diamond Gate Bridge is the public surface.", delay: 620, emphasis: true },
        { text: "It gives the visitor routes, rooms, pages, and windows.", delay: 1040 },
        { text: "Choose the frame you want next.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Mirrorland.",
            type: "conversation",
            expression: "external",
            target: "mirrorland",
            intent: "whatIsMirrorland",
            userText: "Tell me about Mirrorland."
          },
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Tell me about Hearth."
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Tell me about Audralia."
          },
          {
            label: "I need the next door.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "needNextDoor",
            userText: "I think I understand the website enough. I need the next door."
          }
        ]);
      }
    },

    mirrorland: {
      optionLabel: "Choose what Mirrorland opens",
      beats: [
        { text: "Mirrorland is the world behind the glass.", delay: 620, emphasis: true },
        { text: "Inside it, pages become rooms, routes, characters, and worlds.", delay: 1120 },
        { text: "Choose the next layer.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearth",
            userText: "Open the Hearth layer."
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Open the Audralia layer."
          },
          {
            label: "Globe Window.",
            type: "conversation",
            expression: "external",
            target: "globeWindow",
            intent: "whatIsGlobeWindow",
            userText: "Open the Globe Window layer."
          },
          {
            label: "Take me to the Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            confirmation: "The Globe Window will show you the larger frame. I will open it now."
          }
        ]);
      }
    },

    hearth: {
      optionLabel: "Choose what Hearth opens",
      beats: [
        { text: "Hearth is the house interface and the facility.", delay: 620, emphasis: true },
        { text: "It is where the world beyond the window becomes understandable.", delay: 1120 },
        { text: "Choose what Hearth should open.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Open Audralia for me."
          },
          {
            label: "The people working here.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoIsWorkingHere",
            userText: "Show me who is working here."
          },
          {
            label: "The systems field.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "Show me the systems field."
          },
          {
            label: "The house feels like the real doorway.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "houseAsDoorway",
            userText: "The house feels like the real doorway. I need to know where to go next."
          },
          {
            label: "Show me the Hearth chamber.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Show me the Hearth chamber.",
            confirmation: "Yes. The chamber is the proper place to see Hearth directly. I will return you there."
          }
        ]);
      }
    },

    audralia: {
      optionLabel: "Choose how to approach Audralia",
      beats: [
        { text: "Audralia is the possibility world beyond the window.", delay: 620, emphasis: true },
        { text: "It is being developed through Hearth, tested through systems, and given pressure through people.", delay: 1180 },
        { text: "Choose how to approach it.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Through Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "hearthAudraliaConnection",
            userText: "Approach Audralia through Hearth."
          },
          {
            label: "Through Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "frontierAudraliaConnection",
            userText: "Approach Audralia through Frontier."
          },
          {
            label: "Through the characters.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "charactersAudraliaConnection",
            userText: "Approach Audralia through the characters."
          },
          {
            label: "I think I’m ready to see it.",
            type: "route",
            expression: "internal",
            routeKey: "audralia",
            intent: "readyToSeeAudralia",
            userText: "I think I’m ready to see Audralia directly.",
            confirmation: "You are ready to see the world beyond the window. I will take you to Audralia."
          }
        ]);
      }
    },

    frontier: {
      optionLabel: "Choose the system thread",
      beats: [
        { text: "Frontier is the applied-science field.", delay: 620, emphasis: true },
        { text: "It is where Audralia is tested against systems and consequence.", delay: 1120 },
        { text: "Choose the thread.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Audralia again.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudraliaAgain",
            userText: "Bring Audralia back into view."
          },
          {
            label: "The people.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoAreCharacters",
            userText: "Bring the people into view."
          },
          {
            label: "First route.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whatFirst",
            userText: "Give me the first route."
          },
          {
            label: "Show me Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Show me Frontier.",
            confirmation: "Frontier is a systems door. I will open it, but keep the house in mind when you arrive."
          }
        ]);
      }
    },

    characters: {
      optionLabel: "Choose the character thread",
      beats: [
        { text: "The characters are not decoration.", delay: 620, emphasis: true },
        { text: "They make the world answer back.", delay: 1040 },
        { text: "Choose the thread.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Dextrion.",
            type: "conversation",
            expression: "external",
            target: "dextrion",
            intent: "whoIsDextrion",
            userText: "Tell me about Dextrion."
          },
          {
            label: "Alaric.",
            type: "conversation",
            expression: "external",
            target: "alaric",
            intent: "whoIsAlaric",
            userText: "Tell me about Alaric."
          },
          {
            label: "Jeeves.",
            type: "conversation",
            expression: "external",
            target: "jeevesSelf",
            intent: "explainJeeves",
            userText: "Explain yourself, Jeeves."
          },
          {
            label: "The people make it feel alive.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "peopleMakeAlive",
            userText: "The people make this feel alive. I want to know where that leads."
          },
          {
            label: "Take me to the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Take me to the characters.",
            confirmation: "Yes. The character wing is where the house begins to feel populated. I will take you there."
          }
        ]);
      }
    },

    dextrion: {
      optionLabel: "Choose the next character thread",
      beats: [
        { text: "Dextrion is close to the machinery of consequence.", delay: 620, emphasis: true },
        { text: "He helps the house avoid mistaking signal for meaning.", delay: 1080 },
        { text: "Choose the next thread.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Alaric.",
            type: "conversation",
            expression: "external",
            target: "alaric",
            intent: "whoIsAlaric",
            userText: "Now tell me about Alaric."
          },
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Bring this back to Hearth."
          },
          {
            label: "Show me the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Show me the characters.",
            confirmation: "I will take you to the character wing. Dextrion belongs in a larger company."
          }
        ]);
      }
    },

    alaric: {
      optionLabel: "Choose the next route-holder thread",
      beats: [
        { text: "Alaric is a route-holder.", delay: 620, emphasis: true },
        { text: "He carries orientation when the path becomes strange.", delay: 1080 },
        { text: "Choose the next thread.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Dextrion.",
            type: "conversation",
            expression: "external",
            target: "dextrion",
            intent: "whoIsDextrion",
            userText: "Now tell me about Dextrion."
          },
          {
            label: "Mirrorland.",
            type: "conversation",
            expression: "external",
            target: "mirrorland",
            intent: "whatIsMirrorland",
            userText: "Bring this back to Mirrorland."
          },
          {
            label: "Show me the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Show me the characters.",
            confirmation: "Yes. Alaric is better understood among the others. I will take you there."
          }
        ]);
      }
    },

    jeevesSelf: {
      optionLabel: "Choose what Jeeves does next",
      beats: [
        { text: "I am the interface that keeps the visitor from being stranded between page and meaning.", delay: 720, emphasis: true },
        { text: "I am digitally bound to Hearth, and I take that seriously.", delay: 1080 },
        { text: "Choose what I should do next.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Explain Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Explain Hearth."
          },
          {
            label: "Explain Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Explain Audralia."
          },
          {
            label: "Keep going.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "keepGoing",
            userText: "Let us keep going."
          },
          {
            label: "Minimize for now.",
            type: "conversation",
            expression: "external",
            action: "minimize",
            intent: "minimize",
            userText: "Minimize for now."
          }
        ]);
      }
    },

    firstPath: {
      optionLabel: "Choose the first route",
      beats: [
        { text: "We can choose by room, world, system, people, or evidence.", delay: 720, emphasis: true },
        { text: "Pick the route that fits your next move.", delay: 920 }
      ],
      options: function options() {
        return withBack([
          {
            label: "Room: Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearthFirst",
            userText: "Start with the room: Hearth."
          },
          {
            label: "World: Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudraliaFirst",
            userText: "Start with the world: Audralia."
          },
          {
            label: "System: Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "explainFrontierFirst",
            userText: "Start with the systems field: Frontier."
          },
          {
            label: "Take me to Audralia.",
            type: "route",
            expression: "external",
            routeKey: "audralia",
            intent: "routeAudralia",
            userText: "Take me to Audralia.",
            confirmation: "Audralia is the strongest first crossing after Hearth. I will open it now."
          },
          {
            label: "Take me to Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Take me to Frontier.",
            confirmation: "Frontier is the systems path. I will open that field now."
          },
          {
            label: "Open the Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            confirmation: "The Control Room is diagnostic. I will take you there, but remember: it inspects the house. It does not replace the house."
          }
        ]);
      }
    },

    globeWindow: {
      optionLabel: "Choose the next frame",
      beats: [
        { text: "The Globe Window is the larger frame.", delay: 620, emphasis: true },
        { text: "It lets visitors see possible worlds as distinct paths.", delay: 1040 },
        { text: "Choose what frame comes next.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearth",
            userText: "Bring this back to Hearth."
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Bring this back to Audralia."
          },
          {
            label: "Take me to the Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            confirmation: "The Globe Window will widen the frame. I will open it now."
          }
        ]);
      }
    },

    controlRoom: {
      optionLabel: "Choose conversation or evidence",
      beats: [
        { text: "The Control Room is diagnostic.", delay: 620, emphasis: true },
        { text: "Use it when you want evidence. Stay with me when you want orientation.", delay: 1120 },
        { text: "Choose the next move.", delay: 900, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Keep me oriented.",
            type: "conversation",
            expression: "external",
            target: "whereAmI",
            intent: "keepOriented",
            userText: "Keep me oriented."
          },
          {
            label: "Explain Hearth instead.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearthInstead",
            userText: "Explain Hearth instead."
          },
          {
            label: "Open the Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            confirmation: "Very well. I will open the Control Room. The evidence will be waiting there."
          },
          {
            label: "Return to Hearth.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Return to Hearth.",
            confirmation: "Good. Hearth is the better room for orientation. I will take you back."
          }
        ]);
      }
    }
  };

  function boot() {
    if (!doc || state.booted) return;

    state.booted = true;
    state.initializedAt = nowIso();
    state.updatedAt = state.initializedAt;

    config = readConfig();
    cacheElements();
    bindStaticActions();
    publishApi();

    if (els.minimized) {
      els.minimized.setAttribute("data-jeeves-minimized", "false");
    }

    runNode("intro", { preserveHistory: false });
  }

  if (!doc) {
    publishApi();
    return;
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
