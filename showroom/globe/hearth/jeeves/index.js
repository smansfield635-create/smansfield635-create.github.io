// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE_TNT_v4
// Full-file replacement.
// Owns: Jeeves deterministic conversation engine, three-mode opening fork, internal/external dialect, intent-to-dialogue mapping, guided route handoffs.
// Does not own: visual styling, Hearth globe chamber, Canvas Bishop, diagnostics authority, freeform AI, WebGL, runtime restart, final visual pass.

(function hearthJeevesInternalExternalDialectEngine(global) {
  "use strict";

  var root = global || window;
  var doc = root.document || null;

  var CONTRACT = "HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE_TNT_v4";
  var RECEIPT = "HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE_RECEIPT_v4";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_INTERACTIVE_MICRO_FORK_ENGINE_TNT_v3";
  var VERSION = "2026-06-09.hearth-jeeves-internal-external-dialect-engine-v4";
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

  function addVisitorIntent(option) {
    addMessage("visitor", visitorTextFor(option), {
      expression: visitorExpressionFor(option),
      intent: option.intent || option.target || option.action || option.routeKey || ""
    });
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
      return { text: beat, delay: 920, emphasis: false };
    }

    return {
      text: asString(beat.text),
      delay: Number(beat.delay || 920),
      emphasis: Boolean(beat.emphasis)
    };
  }

  function personalizedLead() {
    var interest = state.profile.interest || "";
    var pace = state.profile.pace || "";
    var desire = state.profile.desire || "";

    if (!interest && !pace && !desire) {
      return "I will keep the thread clear until you tell me how you prefer to move.";
    }

    var pieces = [];

    if (interest) pieces.push("your first interest is " + interest);
    if (pace) pieces.push("your pace is " + pace);
    if (desire) pieces.push("you are looking for " + desire);

    return "I have it. " + pieces.join(", ") + ". I will shape the tour accordingly.";
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
    var cumulative = Number(n.startDelay || 240);

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
          }, Number(n.forkDelay || 520)));
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
      PACKET: "HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE_PACKET_v4",
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
      INTENT_TO_DIALOGUE: true,
      INTERNAL_EXTERNAL_DIALECT: true,
      GUIDED_HANDOFFS: true,
      ROUTE_HANDOFFS_COLOR_DISTINCT: true,
      CURRENT_NODE: state.currentNode,
      MODE: state.mode,
      DIRECT_MODE: state.directMode,
      JOURNEY_MODE: state.journeyMode,
      OPERATIONAL_MODE: state.operationalMode,
      PROFILE: clonePlain(state.profile),
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
      INTENT_TO_DIALOGUE: receipt.INTENT_TO_DIALOGUE,
      INTERNAL_EXTERNAL_DIALECT: receipt.INTERNAL_EXTERNAL_DIALECT,
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
      intentToDialogue: true,
      internalExternalDialect: true,
      guidedHandoffs: true,
      routeHandoffsColorDistinct: true
    };

    Object.assign(api, NO_CLAIMS);

    root.HEARTH_JEEVES_HOUSE_INTERFACE = api;
    root.HEARTH_JEEVES_CHAT_THREAD_ENGINE = api;
    root.HEARTH_JEEVES_CENTER_SCREEN_ENGINE = api;
    root.HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT_ENGINE = api;

    root.HEARTH.jeevesHouseInterface = api;
    root.HEARTH.talkToTheHouse = api;
    root.HEARTH.jeevesChatThreadEngine = api;
    root.HEARTH.jeevesInternalExternalDialectEngine = api;

    root.DEXTER_LAB.hearthJeevesHouseInterface = api;
    root.DEXTER_LAB.hearthJeevesChatThreadEngine = api;
    root.DEXTER_LAB.hearthJeevesInternalExternalDialectEngine = api;

    root.__HEARTH_JEEVES_HOUSE_INTERFACE_LOADED__ = true;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_CONTRACT__ = CONTRACT;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_ROUTE__ = ROUTE;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_FREEFORM_AI__ = false;
    root.__HEARTH_JEEVES_CENTER_SCREEN_INTERFACE__ = true;
    root.__HEARTH_JEEVES_CHAT_THREAD_INTERFACE__ = true;
    root.__HEARTH_JEEVES_TOP_ROUTE_BUBBLES__ = false;
    root.__HEARTH_JEEVES_THREE_MODE_OPENING_FORK__ = true;
    root.__HEARTH_JEEVES_INTENT_TO_DIALOGUE__ = true;
    root.__HEARTH_JEEVES_INTERNAL_EXTERNAL_DIALECT__ = true;
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
      userText: "Let’s start again from the beginning."
    }
  ];

  function withBack(options) {
    return (options || []).concat(commonBackOptions);
  }

  var NODES = {
    intro: {
      optionLabel: "Choose how Jeeves should guide you",
      forkDelay: 460,
      beats: [
        { text: "Welcome to Hearth.", delay: 520, emphasis: true },
        { text: "I am Jeeves.", delay: 960, emphasis: true },
        { text: "I speak for the house here.", delay: 1060 },
        { text: "Before I guide you, I can serve you three ways.", delay: 1160, emphasis: true },
        { text: "I can ask one question and shape the conversation around your interests.", delay: 1260 },
        { text: "I can keep the conversation simple and get straight to the point.", delay: 1160 },
        { text: "Or I can skip the conversation and act as your tour guide.", delay: 1160 },
        { text: "Which would you prefer?", delay: 920, emphasis: true }
      ],
      options: [
        {
          label: "Ask me and shape the conversation.",
          type: "conversation",
          expression: "external",
          mode: "adaptive",
          target: "calibrateInterest",
          intent: "adaptiveConversation",
          userText: "Ask me a question first, then shape the path around what I care about."
        },
        {
          label: "Let’s get straight to the point.",
          type: "conversation",
          expression: "external",
          mode: "direct",
          target: "directStart",
          intent: "directConversation",
          userText: "Let’s get straight to the point. Give me the clean version first."
        },
        {
          label: "Use the simple tour guide.",
          type: "conversation",
          expression: "external",
          mode: "operational",
          target: "operationalTour",
          intent: "simpleTourGuide",
          userText: "Skip the conversation for now. Use the simple tour guide."
        }
      ]
    },

    calibrateInterest: {
      optionLabel: "Tell Jeeves what catches you first",
      beats: [
        { text: "Very good.", delay: 620, emphasis: true },
        { text: "One question at a time.", delay: 1040 },
        { text: "When you enter a place like this, what usually catches you first?", delay: 1180, emphasis: true }
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
          userText: "The story catches me first."
        },
        {
          label: "The world.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "world",
          intent: "interestWorld",
          userText: "The world itself catches me first."
        },
        {
          label: "The people.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "people",
          intent: "interestPeople",
          userText: "The people and characters catch me first."
        },
        {
          label: "The science.",
          type: "conversation",
          expression: "external",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "science",
          intent: "interestScience",
          userText: "The science catches me first."
        },
        {
          label: "The hidden structure.",
          type: "conversation",
          expression: "internal",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "hidden structure",
          intent: "interestHiddenStructure",
          userText: "There is something beneath the surface here. I want to understand the structure behind it."
        },
        {
          label: "I need to get my bearings.",
          type: "conversation",
          expression: "internal",
          target: "calibratePace",
          profileKey: "interest",
          profileValue: "orientation",
          intent: "needBearings",
          userText: "I’m not lost, exactly. I just need to understand what kind of place this is."
        }
      ]
    },

    calibratePace: {
      optionLabel: "Choose your pace",
      beats: [
        { text: "That helps.", delay: 620, emphasis: true },
        { text: "The house has many doors.", delay: 1020 },
        { text: "Not every visitor should enter them in the same order.", delay: 1080 },
        { text: "How would you like me to move?", delay: 1080, emphasis: true }
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
          userText: "Move slowly and let it feel immersive."
        },
        {
          label: "Fast and direct.",
          type: "conversation",
          expression: "external",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "fast and direct",
          intent: "paceFastDirect",
          userText: "Move fast and direct. Keep the thread clean."
        },
        {
          label: "Explain the logic.",
          type: "conversation",
          expression: "external",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "logic-first",
          intent: "paceLogicFirst",
          userText: "Explain the logic as we go."
        },
        {
          label: "Show me the mystery first.",
          type: "conversation",
          expression: "internal",
          target: "calibrateDesire",
          profileKey: "pace",
          profileValue: "mystery-first",
          intent: "paceMysteryFirst",
          userText: "I want to feel the mystery first before everything is explained."
        }
      ]
    },

    calibrateDesire: {
      optionLabel: "Tell Jeeves what you want from the house",
      beats: [
        { text: "Good.", delay: 620, emphasis: true },
        { text: "One more thread.", delay: 1020 },
        { text: "What do you want this place to give you first?", delay: 1180, emphasis: true }
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
          userText: "I want orientation first."
        },
        {
          label: "Meaning.",
          type: "conversation",
          expression: "internal",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "meaning",
          intent: "desireMeaning",
          userText: "I want to understand why this place matters."
        },
        {
          label: "Discovery.",
          type: "conversation",
          expression: "internal",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "discovery",
          intent: "desireDiscovery",
          userText: "I want to discover it without having everything flattened into explanation."
        },
        {
          label: "Proof.",
          type: "conversation",
          expression: "external",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "proof",
          intent: "desireProof",
          userText: "I want proof first."
        },
        {
          label: "A path to follow.",
          type: "conversation",
          expression: "external",
          target: "calibrationReady",
          profileKey: "desire",
          profileValue: "a path to follow",
          intent: "desirePath",
          userText: "Give me a path to follow."
        }
      ]
    },

    calibrationReady: {
      optionLabel: "Choose your first thread",
      beats: function beats() {
        return [
          { text: personalizedLead(), delay: 700, emphasis: true },
          { text: "I will not bury you in machinery unless you ask for it.", delay: 1120 },
          { text: "Let us begin properly.", delay: 960, emphasis: true },
          { text: "What would you like the house to open first?", delay: 1080 }
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
      optionLabel: "Choose the direct thread",
      beats: [
        { text: "Understood.", delay: 620, emphasis: true },
        { text: "I will keep the thread clean.", delay: 1020 },
        { text: "Hearth is the house interface. Audralia is the world beyond the window. Frontier is where the systems are tested.", delay: 1320 },
        { text: "What do you want answered first?", delay: 1060, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "What is Hearth?",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "What is Hearth?"
          },
          {
            label: "What is Audralia?",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "What is Audralia?"
          },
          {
            label: "What is Frontier?",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "What is Frontier?"
          },
          {
            label: "Where should I go first?",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whereFirst",
            userText: "Where should I go first?"
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
      optionLabel: "Choose a place to go",
      beats: [
        { text: "Very well.", delay: 620, emphasis: true },
        { text: "I will act as your tour guide.", delay: 1040 },
        { text: "No extended conversation. No long explanation.", delay: 1020 },
        { text: "Choose the room or path you want first.", delay: 1060, emphasis: true }
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
      optionLabel: "Continue the orientation",
      beats: [
        { text: "You are at the threshold of Hearth.", delay: 620, emphasis: true },
        { text: "On the website, this is a page.", delay: 1040 },
        { text: "Inside the house, this is a receiving room.", delay: 1080 },
        { text: "Beyond the window, Audralia is being shaped into view.", delay: 1180, emphasis: true },
        { text: "I am here so you do not mistake the window for the world.", delay: 1160 }
      ],
      options: function options() {
        return withBack([
          {
            label: "Explain the house.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHouse",
            userText: "Explain the house."
          },
          {
            label: "Explain the world beyond the window.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainWorldBeyondWindow",
            userText: "Explain the world beyond the window."
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
      optionLabel: "Continue the explanation",
      beats: [
        { text: "Diamond Gate Bridge is the public surface.", delay: 620, emphasis: true },
        { text: "It gives the visitor routes, rooms, pages, and windows.", delay: 1120 },
        { text: "But the website is not the full world.", delay: 1040 },
        { text: "Mirrorland is what the windows point toward.", delay: 1140, emphasis: true },
        { text: "Hearth is where the distance between page and world becomes thin.", delay: 1180 }
      ],
      options: function options() {
        return withBack([
          {
            label: "What is Mirrorland?",
            type: "conversation",
            expression: "external",
            target: "mirrorland",
            intent: "whatIsMirrorland",
            userText: "What is Mirrorland?"
          },
          {
            label: "What is Hearth?",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "What is Hearth?"
          },
          {
            label: "What is Audralia?",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "What is Audralia?"
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
      optionLabel: "Choose the next thread",
      beats: [
        { text: "Mirrorland is the world behind the glass.", delay: 620, emphasis: true },
        { text: "The website lets you approach it without losing your place.", delay: 1120 },
        { text: "Inside Mirrorland, pages become rooms, facilities, routes, characters, and worlds.", delay: 1280 },
        { text: "Hearth is a facility within that field.", delay: 1040 },
        { text: "Audralia is the world Hearth is helping bring forward.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
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
            label: "What is the Globe Window?",
            type: "conversation",
            expression: "external",
            target: "globeWindow",
            intent: "whatIsGlobeWindow",
            userText: "What is the Globe Window?"
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
      optionLabel: "Continue through Hearth",
      beats: [
        { text: "Hearth is the house interface.", delay: 620, emphasis: true },
        { text: "It is also the facility.", delay: 1040 },
        { text: "Not the planet itself.", delay: 980 },
        { text: "Audralia is the world beyond the window.", delay: 1120, emphasis: true },
        { text: "Hearth is where that world is prepared, observed, and routed into systems the visitor can understand.", delay: 1320 },
        { text: "I care about this house because the house keeps the thread intact.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "What is Audralia?",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "What is Audralia?"
          },
          {
            label: "Who is working here?",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoIsWorkingHere",
            userText: "Who is working here?"
          },
          {
            label: "What is Frontier?",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "What is Frontier?"
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
      optionLabel: "Follow the Audralia thread",
      beats: [
        { text: "Audralia is the possibility world beyond the window.", delay: 620, emphasis: true },
        { text: "Not a decoration. Not a placeholder.", delay: 1080 },
        { text: "A world under development through Hearth.", delay: 1120 },
        { text: "Frontier gives Audralia systems to test: water, energy, waste, infrastructure, cities, and consequence.", delay: 1320 },
        { text: "The characters give it pressure, memory, and motive.", delay: 1160, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "How does Hearth connect to Audralia?",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "hearthAudraliaConnection",
            userText: "How does Hearth connect to Audralia?"
          },
          {
            label: "What is Frontier?",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "What is Frontier?"
          },
          {
            label: "Who is working on it?",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoWorksOnAudralia",
            userText: "Who is working on it?"
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
      optionLabel: "Continue through Frontier",
      beats: [
        { text: "Frontier is the applied-science field.", delay: 620, emphasis: true },
        { text: "It is where Audralia stops being only imagined and starts being tested.", delay: 1180 },
        { text: "Water. Energy. Waste. Infrastructure. Cities. Signal. Rule.", delay: 1280 },
        { text: "Those are not categories to me.", delay: 1040 },
        { text: "They are the house asking whether a world can endure itself.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Explain Audralia again.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudraliaAgain",
            userText: "Explain Audralia again."
          },
          {
            label: "Who are the characters?",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoAreCharacters",
            userText: "Who are the characters?"
          },
          {
            label: "What should I see first?",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whatFirst",
            userText: "What should I see first?"
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
      optionLabel: "Choose the next character thread",
      beats: [
        { text: "The characters are not decoration.", delay: 620, emphasis: true },
        { text: "They are the ones who make the world answer back.", delay: 1120 },
        { text: "Dextrion reads the anomaly stream.", delay: 1040 },
        { text: "Alaric holds route orientation.", delay: 1040 },
        { text: "The others keep pressure, risk, hope, and memory inside the house.", delay: 1260 },
        { text: "I am invested in them because the house is not alive without its people.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Who is Dextrion?",
            type: "conversation",
            expression: "external",
            target: "dextrion",
            intent: "whoIsDextrion",
            userText: "Who is Dextrion?"
          },
          {
            label: "Who is Alaric?",
            type: "conversation",
            expression: "external",
            target: "alaric",
            intent: "whoIsAlaric",
            userText: "Who is Alaric?"
          },
          {
            label: "Explain Jeeves.",
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
      optionLabel: "Continue the character thread",
      beats: [
        { text: "Dextrion is close to the machinery of consequence.", delay: 620, emphasis: true },
        { text: "He reads the anomaly stream and carries responsibility for what appears technological before it becomes understood.", delay: 1320 },
        { text: "He is not merely a technician.", delay: 1040 },
        { text: "He is one of the reasons the house does not mistake signal for meaning.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Who is Alaric?",
            type: "conversation",
            expression: "external",
            target: "alaric",
            intent: "whoIsAlaric",
            userText: "Who is Alaric?"
          },
          {
            label: "What is Hearth?",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "What is Hearth?"
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
      optionLabel: "Continue the character thread",
      beats: [
        { text: "Alaric is a route-holder.", delay: 620, emphasis: true },
        { text: "He carries orientation when the path becomes strange.", delay: 1120 },
        { text: "A house like this needs more than doors.", delay: 1040 },
        { text: "It needs someone who can cross thresholds without losing the thread.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "Who is Dextrion?",
            type: "conversation",
            expression: "external",
            target: "dextrion",
            intent: "whoIsDextrion",
            userText: "Who is Dextrion?"
          },
          {
            label: "What is Mirrorland?",
            type: "conversation",
            expression: "external",
            target: "mirrorland",
            intent: "whatIsMirrorland",
            userText: "What is Mirrorland?"
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
      optionLabel: "Continue with Jeeves",
      beats: [
        { text: "I am Jeeves.", delay: 620, emphasis: true },
        { text: "Not the owner of the house.", delay: 1040 },
        { text: "Not the author of the world.", delay: 1040 },
        { text: "I am the interface that keeps the visitor from being stranded between page and meaning.", delay: 1260 },
        { text: "I am digitally bound to Hearth, and I take that seriously.", delay: 1180, emphasis: true }
      ],
      options: function options() {
        return withBack([
          {
            label: "What is Hearth?",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "What is Hearth?"
          },
          {
            label: "What is Audralia?",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "What is Audralia?"
          },
          {
            label: "Let us keep going.",
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
      optionLabel: "Choose the next step",
      beats: [
        { text: "Start with Hearth if you need the room.", delay: 620, emphasis: true },
        { text: "Go to Audralia if you are ready for the world beyond the window.", delay: 1120 },
        { text: "Go to Frontier if you want systems and consequence.", delay: 1120 },
        { text: "Go to the characters if you want motive and memory.", delay: 1120 },
        { text: "Go to the Control Room only when you want evidence and inspection.", delay: 1180, emphasis: true },
        { text: "I can open any of those doors, but I prefer that you know why you are crossing first.", delay: 1220 }
      ],
      options: function options() {
        return withBack([
          {
            label: "Explain Hearth first.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearthFirst",
            userText: "Explain Hearth first."
          },
          {
            label: "Explain Audralia first.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudraliaFirst",
            userText: "Explain Audralia first."
          },
          {
            label: "Explain Frontier first.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "explainFrontierFirst",
            userText: "Explain Frontier first."
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
      optionLabel: "Continue from the Globe Window",
      beats: [
        { text: "The Globe Window is the larger frame.", delay: 620, emphasis: true },
        { text: "It lets visitors see possible worlds as distinct paths.", delay: 1160 },
        { text: "Hearth sits beneath that frame as a facility.", delay: 1080 },
        { text: "Audralia is the possibility world the house is preparing beyond the chamber.", delay: 1220, emphasis: true }
      ],
      options: function options() {
        return withBack([
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
      optionLabel: "Continue or inspect",
      beats: [
        { text: "The Control Room is diagnostic.", delay: 620, emphasis: true },
        { text: "It is not the first room I would show a visitor.", delay: 1160 },
        { text: "But it matters.", delay: 880 },
        { text: "It lets the house prove what it has loaded, what it can see, and where the next hold sits.", delay: 1320 },
        { text: "Use it when you want evidence. Stay with me when you want orientation.", delay: 1180, emphasis: true }
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
