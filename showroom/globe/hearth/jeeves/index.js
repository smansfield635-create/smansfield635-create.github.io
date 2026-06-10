// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE_TNT_v7
// Full-file replacement.
// Owns: Jeeves deterministic narrative interface, layered archetype questions, answer-length/expression-depth throttle, posture/desire inference, character relationship guide logic, contextual jump pads, no-typing path traversal.
// Does not own: visual styling, Hearth globe chamber, Canvas Bishop, diagnostics authority, freeform AI, WebGL, runtime restart, final visual pass, generated images.

(function hearthJeevesLayeredExpressionJumpPadEngine(global) {
  "use strict";

  var root = global || window;
  var doc = root.document || null;

  var CONTRACT = "HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE_TNT_v7";
  var RECEIPT = "HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE_RECEIPT_v7";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE_TNT_v6";
  var VERSION = "2026-06-09.hearth-jeeves-layered-expression-jump-pad-engine-v7";
  var FILE = "/showroom/globe/hearth/jeeves/index.js";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var DEFAULT_ROUTES = {
    compass: "/",
    door: "/door/",
    home: "/home/",
    hearth: "/showroom/globe/hearth/",
    jeeves: "/showroom/globe/hearth/jeeves/",
    globeWindow: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    hEarth: "/showroom/globe/h-earth/",
    explore: "/explore/",
    frontier: "/frontier/",
    characters: "/characters/",
    laws: "/laws/",
    products: "/products/",
    gauges: "/gauges/",
    controlRoom: "/showroom/globe/hearth/diagnostic/"
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

  var ARCHETYPES = {
    narrativeSeeker: {
      label: "narrative seeker",
      tone: "meaning",
      routeBias: ["characters", "audralia", "explore", "hearth"],
      guideBias: ["elara", "auren", "jeeves"]
    },
    explorer: {
      label: "explorer",
      tone: "discovery",
      routeBias: ["audralia", "globeWindow", "explore", "frontier"],
      guideBias: ["alaric", "elara", "remoteTeam"]
    },
    characterWitness: {
      label: "character witness",
      tone: "relational",
      routeBias: ["characters", "hearth", "audralia", "explore"],
      guideBias: ["auren", "elara", "jeeves"]
    },
    systemsAnalyst: {
      label: "systems analyst",
      tone: "proof",
      routeBias: ["frontier", "gauges", "controlRoom", "hEarth"],
      guideBias: ["dextrion", "soren", "remoteTeam"]
    },
    architect: {
      label: "architect",
      tone: "structure",
      routeBias: ["hearth", "controlRoom", "laws", "explore"],
      guideBias: ["jeeves", "auren", "soren"]
    },
    guidedNavigator: {
      label: "guided navigator",
      tone: "orientation",
      routeBias: ["hearth", "globeWindow", "characters", "explore"],
      guideBias: ["alaric", "jeeves", "tarian"]
    }
  };

  var CHARACTER_DOSSIERS = {
    auren: {
      key: "auren",
      name: "Auren Vale",
      role: "Sanctuary Builder",
      coreClass: "Sanctuary Builder",
      primaryTrait: "Custody",
      routePath: ["Mirror Manor", "Explore", "Audralia"],
      routeBias: ["characters", "explore", "audralia", "hearth"],
      archetypeFit: ["characterWitness", "narrativeSeeker", "architect"],
      desireFit: ["meaning", "protection", "sanctuary", "people"],
      postureFit: ["hesitant", "careful", "curious", "protective"],
      toneBias: "protective",
      guideFunction: "protection, shelter, sanctuary, admission, moral pressure",
      pressure: "Every protected life makes the manor harder to hide.",
      relationshipVoice: {
        knowsLine: "Auren is usually near the rooms that should not have to exist.",
        respectLine: "He calls it shelter, but I have watched shelter become a burden in his hands.",
        warningLine: "If you follow Auren, remember that protection can become control if it stops listening.",
        routeLine: "If you need sanctuary before spectacle, Auren is the one the house remembers first."
      }
    },
    dextrion: {
      key: "dextrion",
      name: "Dextrion",
      role: "Earth-Side Originator",
      coreClass: "Earth-Side Originator",
      primaryTrait: "Repair",
      routePath: ["Earth Lab", "Anomaly", "H-Earth"],
      routeBias: ["frontier", "hEarth", "gauges", "controlRoom"],
      archetypeFit: ["systemsAnalyst", "architect", "explorer"],
      desireFit: ["proof", "origin", "repair", "technology"],
      postureFit: ["direct", "skeptical", "urgent", "proofSeeking"],
      toneBias: "technical",
      guideFunction: "origin, anomaly, repair, systems, hard evidence",
      pressure: "Every one-way crossing remains on his hands.",
      relationshipVoice: {
        knowsLine: "Dextrion opened the path and stayed behind.",
        respectLine: "He does not build to impress anyone. He builds because the break will not wait.",
        warningLine: "If you follow Dextrion, you will not be allowed to confuse discovery with safety.",
        routeLine: "If you want the origin of the crossing, Dextrion is where the house begins to point."
      }
    },
    alaric: {
      key: "alaric",
      name: "Alaric",
      role: "Field Navigator",
      coreClass: "Field Navigator",
      primaryTrait: "Orientation",
      routePath: ["Explore", "Frontier", "Remote Field"],
      routeBias: ["explore", "frontier", "hearth", "globeWindow"],
      archetypeFit: ["guidedNavigator", "explorer", "systemsAnalyst"],
      desireFit: ["route", "orientation", "danger", "movement"],
      postureFit: ["cautious", "hesitant", "practical", "alert"],
      toneBias: "directional",
      guideFunction: "routes, danger, early warning, moving before proof arrives",
      pressure: "Waiting for proof can close the only safe route.",
      relationshipVoice: {
        knowsLine: "Alaric moves before the room agrees with him.",
        respectLine: "That makes people uncomfortable until the danger arrives.",
        warningLine: "If you follow Alaric, the route may change before the explanation is complete.",
        routeLine: "If you want the safe path before the obvious path, Alaric is the better instinct."
      }
    },
    tarian: {
      key: "tarian",
      name: "Tarian",
      role: "Water Anchor",
      coreClass: "Water Anchor",
      primaryTrait: "Continuity",
      routePath: ["H-Earth", "Frontier", "Water Lane"],
      routeBias: ["hEarth", "frontier", "products", "gauges"],
      archetypeFit: ["guidedNavigator", "systemsAnalyst", "characterWitness"],
      desireFit: ["survival", "water", "body", "continuity"],
      postureFit: ["practical", "careful", "tired", "grounded"],
      toneBias: "practical",
      guideFunction: "body, water, endurance, survival condition, physical honesty",
      pressure: "The future fails if the body cannot continue.",
      relationshipVoice: {
        knowsLine: "Tarian asks what happens to the body after the plan is finished speaking.",
        respectLine: "He keeps the mission physically honest.",
        warningLine: "If you follow Tarian, the house will not let survival stay abstract.",
        routeLine: "If you want the practical condition of survival, Tarian is the one to follow."
      }
    },
    elara: {
      key: "elara",
      name: "Elara",
      role: "Signal Bearer",
      coreClass: "Signal Bearer",
      primaryTrait: "Vision",
      routePath: ["Audralia", "Showroom", "Public Signal"],
      routeBias: ["audralia", "globeWindow", "characters", "explore"],
      archetypeFit: ["narrativeSeeker", "explorer", "characterWitness"],
      desireFit: ["meaning", "vision", "hope", "visibility"],
      postureFit: ["curious", "immersive", "eager", "uncertain"],
      toneBias: "visionary",
      guideFunction: "hope, signal, visibility, public-facing courage, future shape",
      pressure: "The future has to be visible before anyone moves toward it.",
      relationshipVoice: {
        knowsLine: "Elara knows that a signal can save someone and expose someone at the same time.",
        respectLine: "She makes possibility visible without pretending danger has left the room.",
        warningLine: "If you follow Elara, you will learn that hope is useful only when it knows who it endangers.",
        routeLine: "If you need the future to become visible, Elara is the thread to follow."
      }
    },
    soren: {
      key: "soren",
      name: "Soren",
      role: "Boundary Keeper",
      coreClass: "Boundary Keeper",
      primaryTrait: "Consequence",
      routePath: ["ZIONTS", "Gauges", "Boundary"],
      routeBias: ["gauges", "laws", "frontier", "controlRoom"],
      archetypeFit: ["systemsAnalyst", "architect", "narrativeSeeker"],
      desireFit: ["proof", "truth", "evidence", "consequence"],
      postureFit: ["skeptical", "direct", "careful", "proofSeeking"],
      toneBias: "severe",
      guideFunction: "truth, contamination, hidden cost, boundary, consequence",
      pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
      relationshipVoice: {
        knowsLine: "Soren is the one who asks where the damage went.",
        respectLine: "He refuses clean language when the system is not clean.",
        warningLine: "If you follow Soren, hope will be made honest before it is allowed to call itself restoration.",
        routeLine: "If you want proof that progress is not hidden harm, Soren is the necessary door."
      }
    },
    jeeves: {
      key: "jeeves",
      name: "Jeeves",
      role: "Manor Interface",
      coreClass: "Manor Interface",
      primaryTrait: "Entry",
      routePath: ["Mirror Manor", "Door", "Explore"],
      routeBias: ["hearth", "explore", "door", "characters"],
      archetypeFit: ["guidedNavigator", "architect", "characterWitness"],
      desireFit: ["entry", "sequence", "orientation", "safeReveal"],
      postureFit: ["hesitant", "curious", "passive", "careful"],
      toneBias: "formal",
      guideFunction: "safe revelation, sequence, entry, no-typing guidance, house intelligence",
      pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
      relationshipVoice: {
        knowsLine: "I am not outside this house explaining it. I am the house making entry survivable.",
        respectLine: "Courtesy is one of my locks.",
        warningLine: "I will not open every door simply because it can be opened.",
        routeLine: "If you need the house sequenced, stay with me a little longer."
      }
    },
    remoteTeam: {
      key: "remoteTeam",
      name: "Remote Team",
      role: "Distributed Response Unit",
      coreClass: "Distributed Response Unit",
      primaryTrait: "Adaptation",
      routePath: ["Frontier", "City", "Climate Field"],
      routeBias: ["frontier", "explore", "products", "gauges"],
      archetypeFit: ["explorer", "systemsAnalyst", "characterWitness"],
      desireFit: ["community", "logistics", "field", "distribution"],
      postureFit: ["practical", "eager", "direct", "public"],
      toneBias: "field",
      guideFunction: "public systems, field logistics, community survival, distributed response",
      pressure: "If survival cannot leave the manor, the manor is only a bunker.",
      relationshipVoice: {
        knowsLine: "The Remote Team carries survival where the manor cannot stand over everyone.",
        respectLine: "They make the future communal instead of private.",
        warningLine: "If you follow them, the protected room will stop being enough.",
        routeLine: "If you want the mission outside the estate, follow the Remote Team."
      }
    }
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
    pendingRoute: null,

    profile: {
      openingPreference: "",
      interest: "",
      pace: "",
      desire: "",
      posture: "",
      confidence: "unknown",
      routeReadiness: "warming",
      answerLengthPreference: "medium",
      expressionDepth: "guided",
      engagementLevel: "balanced",
      interfaceZone: "guided",
      archetypeSignal: "",
      archetypeLabel: "",
      archetypeConfidence: 0,
      characterGuide: "",
      characterGuideLabel: "",
      characterConfidence: 0,

      archetypeScores: {
        narrativeSeeker: 0,
        explorer: 0,
        characterWitness: 0,
        systemsAnalyst: 0,
        architect: 0,
        guidedNavigator: 0
      },

      desireScores: {},
      postureScores: {},
      routeBiasScores: {},
      characterScores: {
        auren: 0,
        dextrion: 0,
        alaric: 0,
        tarian: 0,
        elara: 0,
        soren: 0,
        jeeves: 0,
        remoteTeam: 0
      },

      archetypeEvidence: [],
      characterEvidence: [],
      pathEvidence: []
    },

    memory: [],
    transcript: [],
    nodeVisits: {},
    lastOption: null,
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

    if (options.archetypeSignal) {
      node.setAttribute("data-message-archetype-signal", options.archetypeSignal);
    }

    if (options.characterGuide) {
      node.setAttribute("data-message-character-guide", options.characterGuide);
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
      archetypeSignal: options.archetypeSignal || "",
      characterGuide: options.characterGuide || "",
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
    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      els.handoffDock.setAttribute("data-jeeves-jump-pads-active", "false");
    }
  }

  function resolveRoute(routeKeyOrPath) {
    var key = asString(routeKeyOrPath);
    if (!key) return "#";
    return config.routes[key] || DEFAULT_ROUTES[key] || key;
  }

  function isRouteOption(option) {
    return Boolean(option && (option.type === "route" || option.type === "control" || option.type === "jumpPad" || option.jumpPad));
  }

  function optionElement(option) {
    var isRoute = isRouteOption(option);
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

    if (!isRoute) {
      node.type = "button";
    } else {
      node.href = resolveRoute(option.routeKey || option.route);
      node.setAttribute("data-jeeves-jump-pad", option.jumpPad ? "true" : "false");
    }

    node.setAttribute("data-jeeves-option", "true");
    node.setAttribute("data-option-type", option.jumpPad ? "jumpPad" : (option.type || "conversation"));
    node.setAttribute("data-option-expression", option.expression || "external");
    node.setAttribute("data-option-target", option.target || option.routeKey || option.route || option.action || "");

    if (option.intent) node.setAttribute("data-option-intent", option.intent);
    if (option.archetypeSignal) node.setAttribute("data-option-archetype-signal", option.archetypeSignal);
    if (option.desireSignal) node.setAttribute("data-option-desire-signal", option.desireSignal);
    if (option.postureSignal) node.setAttribute("data-option-posture-signal", option.postureSignal);
    if (option.characterGuide) node.setAttribute("data-option-character-guide", option.characterGuide);
    if (option.answerLength) node.setAttribute("data-option-answer-length", option.answerLength);
    if (option.expressionDepth) node.setAttribute("data-option-expression-depth", option.expressionDepth);
    if (option.toneBias) node.setAttribute("data-option-tone-bias", option.toneBias);

    labelNode = node.querySelector("span") || node;
    labelNode.textContent = option.label || "Continue";

    node.addEventListener("click", function onOption(event) {
      event.preventDefault();
      handleOption(option);
    });

    return node;
  }

  function optionTargetKey(option) {
    return option.routeKey || option.route || option.target || option.intent || "";
  }

  function scoreOptionForProfile(option) {
    var score = 0;
    var archetype = ARCHETYPES[state.profile.archetypeSignal];
    var target = optionTargetKey(option);

    if (!option) return score;

    if (state.profile.archetypeSignal && option.archetypeSignal === state.profile.archetypeSignal) score += 4;
    if (state.profile.characterGuide && option.characterGuide === state.profile.characterGuide) score += 3;

    if (archetype && archetype.routeBias.indexOf(target) >= 0) score += 2;
    if (state.profile.routeBiasScores[target]) score += state.profile.routeBiasScores[target];

    if (state.profile.interfaceZone === "simple" && option.answerLength === "short") score += 3;
    if (state.profile.interfaceZone === "guided" && option.answerLength === "medium") score += 2;
    if (state.profile.interfaceZone === "immersive" && option.answerLength === "long") score += 3;

    if (state.profile.expressionDepth === option.expressionDepth) score += 2;
    if (state.profile.desire && option.desireSignal === state.profile.desire) score += 2;
    if (state.profile.posture && option.postureSignal === state.profile.posture) score += 2;

    return score;
  }

  function customizeOptions(options, lockOrder) {
    if (!options || !options.length) return [];
    if (lockOrder) return options;

    return options.slice().sort(function sort(a, b) {
      var aScore = scoreOptionForProfile(a);
      var bScore = scoreOptionForProfile(b);

      if (bScore !== aScore) return bScore - aScore;
      return 0;
    });
  }

  function renderOptions(options, jumpPads, label, lockOrder) {
    clearOptions();

    if (els.promptLabel) {
      els.promptLabel.textContent = label || "Choose what to say";
    }

    var ordered = customizeOptions(options || [], lockOrder);
    var conversationOptions = [];
    var routeOptions = [];

    ordered.forEach(function split(option) {
      if (isRouteOption(option)) {
        routeOptions.push(option);
      } else {
        conversationOptions.push(option);
      }
    });

    (jumpPads || []).forEach(function addPad(pad) {
      routeOptions.push(pad);
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
      els.handoffDock.setAttribute("data-jeeves-jump-pads-active", routeOptions.length ? "true" : "false");
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

  function normalizeArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function remember(option) {
    if (!option || !option.memory) return;

    normalizeArray(option.memory).forEach(function add(item) {
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

  function addScore(map, key, amount) {
    if (!key) return;
    map[key] = (map[key] || 0) + Number(amount || 1);
  }

  function applyRouteBias(option) {
    normalizeArray(option.routeBias).forEach(function each(route) {
      addScore(state.profile.routeBiasScores, route, 1);
    });
  }

  function updateArchetype(option) {
    var weight = Number(option.signalWeight || 1);

    normalizeArray(option.archetypeSignal || option.archetypeSignals).forEach(function eachSignal(signal) {
      if (!ARCHETYPES[signal]) return;

      addScore(state.profile.archetypeScores, signal, weight);

      state.profile.archetypeEvidence.push({
        at: nowIso(),
        node: state.currentNode,
        intent: option.intent || "",
        label: option.label || "",
        signal: signal,
        weight: weight,
        expression: option.expression || "external"
      });
    });

    if (state.profile.archetypeEvidence.length > 100) {
      state.profile.archetypeEvidence.splice(0, state.profile.archetypeEvidence.length - 100);
    }

    inferArchetype();
  }

  function inferArchetype() {
    var scores = state.profile.archetypeScores || {};
    var best = "";
    var bestScore = 0;
    var secondScore = 0;

    Object.keys(scores).forEach(function each(key) {
      var value = Number(scores[key] || 0);

      if (value > bestScore) {
        secondScore = bestScore;
        bestScore = value;
        best = key;
      } else if (value > secondScore) {
        secondScore = value;
      }
    });

    if (!best) {
      state.profile.archetypeSignal = "";
      state.profile.archetypeLabel = "";
      state.profile.archetypeConfidence = 0;
      return;
    }

    state.profile.archetypeSignal = best;
    state.profile.archetypeLabel = ARCHETYPES[best].label;

    var margin = Math.max(0, bestScore - secondScore);
    state.profile.archetypeConfidence = Math.min(10, Math.round(bestScore + margin));
  }

  function updatePathSignals(option) {
    var weight = Number(option.signalWeight || 1);

    if (option.desireSignal) {
      state.profile.desire = option.desireSignal;
      addScore(state.profile.desireScores, option.desireSignal, weight);
    }

    if (option.postureSignal) {
      state.profile.posture = option.postureSignal;
      addScore(state.profile.postureScores, option.postureSignal, weight);
    }

    if (option.paceSignal) {
      state.profile.pace = option.paceSignal;
    }

    if (option.confidenceSignal) {
      state.profile.confidence = option.confidenceSignal;
    }

    if (option.routeReadiness) {
      state.profile.routeReadiness = option.routeReadiness;
    }

    state.profile.pathEvidence.push({
      at: nowIso(),
      node: state.currentNode,
      intent: option.intent || "",
      desireSignal: option.desireSignal || "",
      postureSignal: option.postureSignal || "",
      paceSignal: option.paceSignal || "",
      confidenceSignal: option.confidenceSignal || "",
      answerLength: option.answerLength || "",
      expressionDepth: option.expressionDepth || "",
      engagementSignal: option.engagementSignal || ""
    });

    if (state.profile.pathEvidence.length > 120) {
      state.profile.pathEvidence.splice(0, state.profile.pathEvidence.length - 120);
    }
  }

  function updateExpressionProfile(option) {
    if (option.answerLength) state.profile.answerLengthPreference = option.answerLength;
    if (option.expressionDepth) state.profile.expressionDepth = option.expressionDepth;
    if (option.engagementSignal) state.profile.engagementLevel = option.engagementSignal;

    var simple = 0;
    var guided = 0;
    var immersive = 0;

    if (option.answerLength === "short") simple += 2;
    if (option.answerLength === "medium") guided += 2;
    if (option.answerLength === "long") immersive += 2;

    if (option.expressionDepth === "plain") simple += 2;
    if (option.expressionDepth === "guided") guided += 2;
    if (option.expressionDepth === "immersive") immersive += 2;

    if (option.engagementSignal === "skim") simple += 2;
    if (option.engagementSignal === "balanced") guided += 2;
    if (option.engagementSignal === "deep") immersive += 2;

    if (option.postureSignal === "direct" || option.postureSignal === "passive") simple += 1;
    if (option.postureSignal === "curious" || option.postureSignal === "careful") guided += 1;
    if (option.postureSignal === "immersive" || option.postureSignal === "expressive") immersive += 2;

    if (immersive > guided && immersive > simple) {
      state.profile.interfaceZone = "immersive";
    } else if (simple > guided && simple >= immersive) {
      state.profile.interfaceZone = "simple";
    } else {
      state.profile.interfaceZone = "guided";
    }
  }

  function updateCharacterGuide(option) {
    var weight = Number(option.signalWeight || 1);

    normalizeArray(option.characterGuide || option.characterGuides).forEach(function eachGuide(key) {
      if (!CHARACTER_DOSSIERS[key]) return;

      addScore(state.profile.characterScores, key, weight + 1);

      state.profile.characterEvidence.push({
        at: nowIso(),
        node: state.currentNode,
        intent: option.intent || "",
        label: option.label || "",
        characterGuide: key,
        weight: weight + 1
      });
    });

    normalizeArray(option.archetypeSignal || option.archetypeSignals).forEach(function eachArchetype(signal) {
      Object.keys(CHARACTER_DOSSIERS).forEach(function eachCharacter(key) {
        var dossier = CHARACTER_DOSSIERS[key];
        if (dossier.archetypeFit.indexOf(signal) >= 0) {
          addScore(state.profile.characterScores, key, 0.5);
        }
      });
    });

    normalizeArray(option.desireSignal).forEach(function eachDesire(signal) {
      Object.keys(CHARACTER_DOSSIERS).forEach(function eachCharacter(key) {
        var dossier = CHARACTER_DOSSIERS[key];
        if (dossier.desireFit.indexOf(signal) >= 0) {
          addScore(state.profile.characterScores, key, 0.5);
        }
      });
    });

    normalizeArray(option.postureSignal).forEach(function eachPosture(signal) {
      Object.keys(CHARACTER_DOSSIERS).forEach(function eachCharacter(key) {
        var dossier = CHARACTER_DOSSIERS[key];
        if (dossier.postureFit.indexOf(signal) >= 0) {
          addScore(state.profile.characterScores, key, 0.5);
        }
      });
    });

    if (state.profile.characterEvidence.length > 100) {
      state.profile.characterEvidence.splice(0, state.profile.characterEvidence.length - 100);
    }

    inferCharacterGuide();
  }

  function inferCharacterGuide() {
    var scores = state.profile.characterScores || {};
    var best = "";
    var bestScore = 0;
    var secondScore = 0;

    Object.keys(scores).forEach(function each(key) {
      var value = Number(scores[key] || 0);

      if (value > bestScore) {
        secondScore = bestScore;
        bestScore = value;
        best = key;
      } else if (value > secondScore) {
        secondScore = value;
      }
    });

    if (!best || !CHARACTER_DOSSIERS[best]) {
      state.profile.characterGuide = "";
      state.profile.characterGuideLabel = "";
      state.profile.characterConfidence = 0;
      return;
    }

    state.profile.characterGuide = best;
    state.profile.characterGuideLabel = CHARACTER_DOSSIERS[best].name;

    var margin = Math.max(0, bestScore - secondScore);
    state.profile.characterConfidence = Math.min(10, Math.round(bestScore + margin));
  }

  function updateProfileFromOption(option) {
    if (!option) return;

    if (option.profileKey && option.profileValue) {
      state.profile[option.profileKey] = option.profileValue;
    }

    if (option.mode) {
      state.mode = option.mode;
      state.profile.openingPreference = option.mode;
    }

    updateArchetype(option);
    updatePathSignals(option);
    updateExpressionProfile(option);
    updateCharacterGuide(option);
    applyRouteBias(option);
    remember(option);
  }

  function addVisitorIntent(option) {
    updateProfileFromOption(option);

    addMessage("visitor", visitorTextFor(option), {
      expression: visitorExpressionFor(option),
      intent: option.intent || option.target || option.action || option.routeKey || "",
      archetypeSignal: option.archetypeSignal || "",
      characterGuide: option.characterGuide || ""
    });

    state.lastOption = clonePlain(option);
  }

  function zone() {
    return state.profile.interfaceZone || "guided";
  }

  function lineByZone(simple, guided, immersive) {
    if (zone() === "simple") return simple;
    if (zone() === "immersive") return immersive;
    return guided;
  }

  function currentCharacter() {
    return CHARACTER_DOSSIERS[state.profile.characterGuide] || null;
  }

  function relationshipLine(kind, fallback) {
    var guide = currentCharacter();
    if (!guide || !guide.relationshipVoice) return fallback || "";
    return guide.relationshipVoice[kind] || fallback || "";
  }

  function characterGuideLine() {
    var guide = currentCharacter();

    if (!guide || state.profile.characterConfidence < 3) {
      return "";
    }

    if (zone() === "simple") {
      return guide.relationshipVoice.routeLine || "";
    }

    if (zone() === "immersive") {
      return guide.relationshipVoice.knowsLine + " " + guide.relationshipVoice.respectLine;
    }

    return guide.relationshipVoice.routeLine || guide.relationshipVoice.knowsLine || "";
  }

  function routeAfterJeeves(option) {
    clearTimers();
    clearOptions();
    setStatus("routing", "Opening jump pad");
    setTyping(false);

    addVisitorIntent(option);

    state.pendingRoute = option.routeKey || option.route || "";
    state.updatedAt = nowIso();

    var line = option.confirmation ||
      lineByZone(
        "Opening it now.",
        "I will open that door for you now.",
        "Very well. I will open that door, but keep the thread you chose in mind when you arrive."
      );

    timers.push(root.setTimeout(function speakRoute() {
      addMessage("jeeves", line, { emphasis: true, characterGuide: option.characterGuide || state.profile.characterGuide || "" });
      timers.push(root.setTimeout(function navigate() {
        routeTo(option.routeKey || option.route);
      }, Number(option.routeDelay || 850)));
    }, 320));
  }

  function handleOption(option) {
    if (!option || state.speaking) return;

    if (isRouteOption(option)) {
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

    addVisitorIntent(option);
    runNode(option.target || "pathHub");
  }

  function normalizeBeat(beat) {
    if (typeof beat === "string") {
      return { text: beat, delay: 800, emphasis: false };
    }

    return {
      text: asString(beat.text),
      delay: Number(beat.delay || 800),
      emphasis: Boolean(beat.emphasis),
      characterGuide: beat.characterGuide || ""
    };
  }

  function node(id) {
    return NODES[id] || NODES.pathHub || NODES.intro;
  }

  function nodeOptions(n) {
    if (!n) return [];
    return typeof n.options === "function" ? n.options(state) : (n.options || []);
  }

  function nodeJumpPads(n) {
    if (!n) return [];
    return typeof n.jumpPads === "function" ? n.jumpPads(state) : (n.jumpPads || []);
  }

  function nodeBeats(n) {
    if (!n) return [];
    return typeof n.beats === "function" ? n.beats(state) : (n.beats || []);
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

    var beats = nodeBeats(n);
    var cumulative = Number(n.startDelay || 200);

    if (!beats || !beats.length) {
      beats = [{ text: "Choose the next door.", emphasis: true }];
    }

    beats.map(normalizeBeat).forEach(function deliver(beat, index, list) {
      cumulative += beat.delay;

      timers.push(root.setTimeout(function onBeat() {
        addMessage("jeeves", beat.text, {
          expression: "external",
          emphasis: beat.emphasis,
          characterGuide: beat.characterGuide || state.profile.characterGuide || ""
        });

        if (index === list.length - 1) {
          state.speaking = false;
          setTyping(false);
          setStatus("listening", "House listening");

          timers.push(root.setTimeout(function showFork() {
            renderOptions(
              nodeOptions(n),
              nodeJumpPads(n),
              n.optionLabel || "Choose what to say",
              Boolean(n.lockOrder)
            );
          }, Number(n.forkDelay || 420)));
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
    renderOptions(nodeOptions(node(state.currentNode || "intro")), nodeJumpPads(node(state.currentNode || "intro")), "Choose what to say");
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

  function opt(label, props) {
    return Object.assign({
      label: label,
      type: "conversation",
      expression: "external",
      target: "pathHub",
      intent: "",
      userText: label,
      archetypeSignal: "guidedNavigator",
      desireSignal: "orientation",
      postureSignal: "curious",
      paceSignal: "guided",
      answerLength: "medium",
      expressionDepth: "guided",
      engagementSignal: "balanced",
      signalWeight: 1,
      routeBias: ["hearth"],
      characterGuide: "jeeves",
      toneBias: "guided"
    }, props || {});
  }

  function jump(label, routeKey, props) {
    return Object.assign({
      label: label,
      type: "jumpPad",
      jumpPad: true,
      expression: "external",
      routeKey: routeKey,
      intent: "jump-" + routeKey,
      userText: label,
      archetypeSignal: "guidedNavigator",
      desireSignal: "route",
      postureSignal: "direct",
      paceSignal: "fast",
      answerLength: "short",
      expressionDepth: "plain",
      engagementSignal: "skim",
      signalWeight: 1,
      routeBias: [routeKey],
      characterGuide: "jeeves",
      toneBias: "route",
      confirmation: "Opening " + label.replace(/^Jump to /, "").replace(/^Open /, "") + "."
    }, props || {});
  }

  function restartOption() {
    return opt("Back to the beginning.", {
      action: "restart",
      target: "",
      intent: "restart",
      userText: "Let’s start again from the beginning.",
      archetypeSignal: "guidedNavigator",
      desireSignal: "orientation",
      postureSignal: "careful",
      answerLength: "short",
      expressionDepth: "plain",
      engagementSignal: "skim",
      routeBias: ["hearth"],
      characterGuide: "jeeves"
    });
  }

  function withRestart(options) {
    return (options || []).concat([restartOption()]);
  }

  function characterChoice(key, label, target) {
    var dossier = CHARACTER_DOSSIERS[key];

    return opt(label || dossier.name, {
      target: target || "character_" + key,
      intent: "choose-character-" + key,
      userText: "I want to follow " + dossier.name + ".",
      archetypeSignal: dossier.archetypeFit[0] || "characterWitness",
      desireSignal: dossier.desireFit[0] || "meaning",
      postureSignal: dossier.postureFit[0] || "curious",
      answerLength: "medium",
      expressionDepth: "guided",
      engagementSignal: "balanced",
      routeBias: dossier.routeBias,
      characterGuide: key,
      toneBias: dossier.toneBias
    });
  }

  function characterNodeBeats(key) {
    var dossier = CHARACTER_DOSSIERS[key];

    return function beats() {
      if (zone() === "simple") {
        return [
          { text: dossier.relationshipVoice.routeLine, delay: 650, emphasis: true },
          { text: "Choose whether to keep speaking or jump to the Portrait Hall.", delay: 760 }
        ];
      }

      if (zone() === "immersive") {
        return [
          { text: dossier.relationshipVoice.knowsLine, delay: 700, emphasis: true },
          { text: dossier.relationshipVoice.respectLine, delay: 980 },
          { text: dossier.relationshipVoice.warningLine, delay: 1040 },
          { text: "Choose how close you want to stand to that thread.", delay: 860, emphasis: true }
        ];
      }

      return [
        { text: dossier.relationshipVoice.knowsLine, delay: 700, emphasis: true },
        { text: dossier.relationshipVoice.routeLine, delay: 900 },
        { text: "Choose the next step.", delay: 760, emphasis: true }
      ];
    };
  }

  function characterNodeOptions(key) {
    var dossier = CHARACTER_DOSSIERS[key];

    return function options() {
      return withRestart([
        opt("Give me the clean path.", {
          target: "jumpDecision",
          intent: "clean-character-path-" + key,
          userText: "Give me the clean path from here.",
          archetypeSignal: dossier.archetypeFit[0],
          desireSignal: "route",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: dossier.routeBias,
          characterGuide: key,
          toneBias: "route"
        }),
        opt("Tell me why this character matters.", {
          target: "characterMeaning_" + key,
          intent: "character-meaning-" + key,
          userText: "Tell me why this character matters.",
          archetypeSignal: dossier.archetypeFit[1] || dossier.archetypeFit[0],
          desireSignal: "meaning",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: dossier.routeBias,
          characterGuide: key,
          toneBias: dossier.toneBias
        }),
        opt("Let me go deeper.", {
          target: "characterDeep_" + key,
          intent: "character-deep-" + key,
          userText: "Let me go deeper into this thread.",
          archetypeSignal: dossier.archetypeFit[2] || dossier.archetypeFit[0],
          desireSignal: "immersion",
          postureSignal: "immersive",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: dossier.routeBias,
          characterGuide: key,
          toneBias: dossier.toneBias
        }),
        opt("Show me the wider map.", {
          target: "pathHub",
          intent: "wider-map-from-" + key,
          userText: "Show me the wider map from here.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "careful",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["hearth", "characters", "globeWindow"],
          characterGuide: "jeeves",
          toneBias: "orientation"
        })
      ]);
    };
  }

  function characterMeaningBeats(key) {
    var dossier = CHARACTER_DOSSIERS[key];

    return function beats() {
      if (zone() === "simple") {
        return [
          { text: dossier.name + " matters because " + dossier.guideFunction + ".", delay: 760, emphasis: true },
          { text: "Choose the next door.", delay: 640 }
        ];
      }

      if (zone() === "immersive") {
        return [
          { text: dossier.relationshipVoice.knowsLine, delay: 700, emphasis: true },
          { text: dossier.pressure, delay: 980 },
          { text: "That is why the house does not treat " + dossier.name + " as a profile. The pressure is active here.", delay: 1100 },
          { text: "Choose where that pressure should take you.", delay: 820, emphasis: true }
        ];
      }

      return [
        { text: dossier.name + " matters because " + dossier.pressure.charAt(0).toLowerCase() + dossier.pressure.slice(1), delay: 860, emphasis: true },
        { text: dossier.relationshipVoice.routeLine, delay: 900 },
        { text: "Choose where to go next.", delay: 720, emphasis: true }
      ];
    };
  }

  function characterDeepBeats(key) {
    var dossier = CHARACTER_DOSSIERS[key];

    return function beats() {
      return [
        { text: dossier.relationshipVoice.knowsLine, delay: 700, emphasis: true },
        { text: dossier.relationshipVoice.respectLine, delay: 980 },
        { text: dossier.relationshipVoice.warningLine, delay: 1040 },
        { text: "That is the living thread. Not the summary. The cost.", delay: 840, emphasis: true },
        { text: "Choose the door that can carry it.", delay: 760 }
      ];
    };
  }

  function characterJumpPads(key) {
    var dossier = CHARACTER_DOSSIERS[key];

    return function pads() {
      var pads = [
        jump("Jump to Characters", "characters", {
          characterGuide: key,
          archetypeSignal: dossier.archetypeFit[0],
          desireSignal: "route",
          routeBias: ["characters"],
          confirmation: "Opening the Portrait Hall."
        })
      ];

      dossier.routeBias.slice(0, 3).forEach(function each(routeKey) {
        if (routeKey === "characters") return;

        var labelMap = {
          hearth: "Jump to Hearth",
          audralia: "Jump to Audralia",
          explore: "Jump to Explore",
          frontier: "Jump to Frontier",
          gauges: "Jump to Gauges",
          laws: "Jump to Laws",
          products: "Jump to Products",
          hEarth: "Jump to H-Earth",
          globeWindow: "Open Globe Window",
          controlRoom: "Open Control Room"
        };

        if (!labelMap[routeKey]) return;

        pads.push(jump(labelMap[routeKey], routeKey, {
          characterGuide: key,
          archetypeSignal: dossier.archetypeFit[0],
          desireSignal: "route",
          routeBias: [routeKey],
          confirmation: "Opening that route."
        }));
      });

      return pads;
    };
  }

  var NODES = {
    intro: {
      optionLabel: "Choose how Jeeves should guide you",
      lockOrder: true,
      beats: [
        { text: "Welcome to Hearth.", delay: 520, emphasis: true },
        { text: "I am Jeeves.", delay: 840, emphasis: true },
        { text: "I speak for the house here.", delay: 900 },
        { text: "Before we begin, choose how you want me to guide you.", delay: 940, emphasis: true }
      ],
      options: [
        opt("Okay, ask.", {
          mode: "adaptive",
          target: "entryArchetype",
          intent: "adaptive-entry",
          userText: "Okay. Ask me the question.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "open",
          paceSignal: "guided",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["hearth"],
          characterGuide: "jeeves"
        }),
        opt("Let’s get straight to the point.", {
          mode: "direct",
          target: "directPath",
          intent: "direct-entry",
          userText: "Let’s get straight to the point. Give me the clean version first.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "clarity",
          postureSignal: "direct",
          paceSignal: "fast",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["hearth", "frontier", "gauges"],
          characterGuide: "dextrion"
        }),
        opt("Use the simple tour guide.", {
          mode: "tour",
          target: "tourGuide",
          intent: "tour-guide-entry",
          userText: "Skip the conversation for now. Use the simple tour guide.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "route",
          postureSignal: "passive",
          paceSignal: "fast",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeReadiness: "ready",
          routeBias: ["hearth", "audralia", "characters"],
          characterGuide: "jeeves"
        })
      ],
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Characters", "characters"),
        jump("Open Globe Window", "globeWindow")
      ]
    },

    entryArchetype: {
      optionLabel: "Choose the instinct that catches first",
      beats: [
        { text: "Good.", delay: 560, emphasis: true },
        { text: "When you enter a place like this, what catches first?", delay: 860, emphasis: true }
      ],
      options: [
        opt("The story.", {
          target: "pathPosture",
          intent: "entry-story",
          userText: "The story catches me first.",
          archetypeSignal: "narrativeSeeker",
          desireSignal: "meaning",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["characters", "explore", "audralia"],
          characterGuide: "elara"
        }),
        opt("The world.", {
          target: "pathPosture",
          intent: "entry-world",
          userText: "The world catches me first.",
          archetypeSignal: "explorer",
          desireSignal: "discovery",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["audralia", "globeWindow", "explore"],
          characterGuide: "alaric"
        }),
        opt("The people.", {
          target: "pathPosture",
          intent: "entry-people",
          userText: "The people and characters catch me first.",
          archetypeSignal: "characterWitness",
          desireSignal: "people",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["characters", "hearth", "audralia"],
          characterGuide: "auren"
        }),
        opt("The systems.", {
          target: "pathPosture",
          intent: "entry-systems",
          userText: "The systems catch me first.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "proofSeeking",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "gauges", "controlRoom"],
          characterGuide: "dextrion"
        }),
        opt("The hidden structure.", {
          target: "pathPosture",
          intent: "entry-structure",
          expression: "internal",
          userText: "There is something beneath the surface here. I want to understand the structure behind it.",
          archetypeSignal: "architect",
          desireSignal: "structure",
          postureSignal: "careful",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: ["hearth", "laws", "controlRoom"],
          characterGuide: "jeeves"
        }),
        opt("I need my bearings.", {
          target: "pathPosture",
          intent: "entry-bearings",
          expression: "internal",
          userText: "I need to get my bearings before I choose a door.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "hesitant",
          confidenceSignal: "low",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["hearth", "globeWindow", "characters"],
          characterGuide: "alaric"
        })
      ],
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Characters", "characters")
      ]
    },

    pathPosture: {
      optionLabel: "Choose how the path should move",
      beats: function beats() {
        var guideLine = characterGuideLine();

        if (zone() === "simple") {
          return [
            { text: "Then we will keep this clean.", delay: 620, emphasis: true },
            { text: "Choose how you want to move.", delay: 680 }
          ];
        }

        if (zone() === "immersive") {
          return [
            { text: guideLine || "The house has enough of your signal now to choose a better question.", delay: 780, emphasis: true },
            { text: "Do you want the path to stay practical, or do you want the house to let the story breathe?", delay: 1000 }
          ];
        }

        return [
          { text: guideLine || "I have enough to shape the next path.", delay: 720, emphasis: true },
          { text: "Choose how you want to move.", delay: 780 }
        ];
      },
      options: [
        opt("Fast. Show me the door.", {
          target: "jumpDecision",
          intent: "move-fast-door",
          userText: "Fast. Show me the door.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "route",
          postureSignal: "direct",
          paceSignal: "fast",
          confidenceSignal: "medium",
          routeReadiness: "ready",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["hearth", "audralia", "characters"],
          characterGuide: "alaric"
        }),
        opt("Guide me, but do not over-explain.", {
          target: "pathHub",
          intent: "move-balanced",
          userText: "Guide me, but do not over-explain.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "careful",
          paceSignal: "guided",
          confidenceSignal: "medium",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["hearth", "characters", "globeWindow"],
          characterGuide: "jeeves"
        }),
        opt("Let the place speak a little.", {
          target: "immersiveThreshold",
          intent: "move-immersive",
          expression: "internal",
          userText: "Let the place speak a little before I choose the next door.",
          archetypeSignal: "narrativeSeeker",
          desireSignal: "immersion",
          postureSignal: "immersive",
          paceSignal: "slow",
          confidenceSignal: "medium",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: ["characters", "explore", "audralia"],
          characterGuide: state.profile.characterGuide || "elara"
        }),
        opt("I want proof before I move.", {
          target: "proofPath",
          intent: "move-proof",
          userText: "I want proof before I move.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "skeptical",
          paceSignal: "measured",
          confidenceSignal: "low",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["gauges", "frontier", "controlRoom"],
          characterGuide: "soren"
        })
      ],
      jumpPads: function pads() {
        return [
          jump("Jump to Hearth", "hearth"),
          jump("Jump to Characters", "characters"),
          jump("Jump to Frontier", "frontier")
        ];
      }
    },

    directPath: {
      optionLabel: "Choose the clean frame",
      beats: [
        { text: "Clean frame: Hearth is the receiving facility. Audralia is the world beyond the window. Frontier is where the systems are tested.", delay: 980, emphasis: true },
        { text: "Choose the door.", delay: 620 }
      ],
      options: withRestart([
        opt("Room: Hearth.", {
          target: "hearthPath",
          intent: "direct-hearth",
          userText: "Start with Hearth.",
          archetypeSignal: "architect",
          desireSignal: "orientation",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["hearth"],
          characterGuide: "jeeves"
        }),
        opt("World: Audralia.", {
          target: "audraliaPath",
          intent: "direct-audralia",
          userText: "Start with Audralia.",
          archetypeSignal: "explorer",
          desireSignal: "discovery",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["audralia"],
          characterGuide: "elara"
        }),
        opt("People: Characters.", {
          target: "charactersPath",
          intent: "direct-characters",
          userText: "Start with the characters.",
          archetypeSignal: "characterWitness",
          desireSignal: "people",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["characters"],
          characterGuide: "auren"
        }),
        opt("Systems: Frontier.", {
          target: "frontierPath",
          intent: "direct-frontier",
          userText: "Start with Frontier.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["frontier", "gauges"],
          characterGuide: "dextrion"
        })
      ]),
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Audralia", "audralia"),
        jump("Jump to Characters", "characters"),
        jump("Jump to Frontier", "frontier")
      ]
    },

    tourGuide: {
      optionLabel: "Choose a jump or a guided door",
      beats: [
        { text: "Tour guide mode.", delay: 560, emphasis: true },
        { text: "Choose the room, world, people, system, or map.", delay: 700 }
      ],
      options: withRestart([
        opt("Give me a one-line orientation.", {
          target: "pathHub",
          intent: "tour-orientation",
          userText: "Give me a one-line orientation.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "passive",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["hearth"],
          characterGuide: "jeeves"
        }),
        opt("Recommend the first stop.", {
          target: "jumpDecision",
          intent: "tour-recommend-first",
          userText: "Recommend the first stop.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "route",
          postureSignal: "passive",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeReadiness: "ready",
          routeBias: ["hearth", "audralia"],
          characterGuide: "alaric"
        })
      ]),
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Audralia", "audralia"),
        jump("Jump to Characters", "characters"),
        jump("Open Globe Window", "globeWindow"),
        jump("Jump to Frontier", "frontier"),
        jump("Jump to Explore", "explore"),
        jump("Jump to Gauges", "gauges")
      ]
    },

    pathHub: {
      optionLabel: "Choose the next path",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "You are in Hearth. Choose the next door.", delay: 620, emphasis: true }
          ];
        }

        if (zone() === "immersive") {
          return [
            { text: "You are standing in Hearth, not outside it.", delay: 720, emphasis: true },
            { text: relationshipLine("routeLine", "The house can route you, answer you, or let you follow a person who already carries part of the pressure."), delay: 980 },
            { text: "Choose the path that feels closest.", delay: 760 }
          ];
        }

        return [
          { text: "You are in Hearth. The house can answer, route, or introduce you to the thread behind the door.", delay: 760, emphasis: true },
          { text: "Choose the next path.", delay: 640 }
        ];
      },
      options: function options() {
        return withRestart([
          opt("Show me where I am.", {
            target: "whereAmI",
            intent: "hub-where-am-i",
            userText: "Show me where I am.",
            archetypeSignal: "guidedNavigator",
            desireSignal: "orientation",
            postureSignal: "careful",
            answerLength: "short",
            expressionDepth: "plain",
            engagementSignal: "skim",
            routeBias: ["hearth"],
            characterGuide: "jeeves"
          }),
          opt("Take me through the people.", {
            target: "charactersPath",
            intent: "hub-people",
            userText: "Take me through the people.",
            archetypeSignal: "characterWitness",
            desireSignal: "people",
            postureSignal: "curious",
            answerLength: "medium",
            expressionDepth: "guided",
            engagementSignal: "balanced",
            routeBias: ["characters"],
            characterGuide: "auren"
          }),
          opt("Take me through the world.", {
            target: "audraliaPath",
            intent: "hub-world",
            userText: "Take me through the world.",
            archetypeSignal: "explorer",
            desireSignal: "discovery",
            postureSignal: "curious",
            answerLength: "medium",
            expressionDepth: "guided",
            engagementSignal: "balanced",
            routeBias: ["audralia", "globeWindow"],
            characterGuide: "elara"
          }),
          opt("Take me through the systems.", {
            target: "frontierPath",
            intent: "hub-systems",
            userText: "Take me through the systems.",
            archetypeSignal: "systemsAnalyst",
            desireSignal: "proof",
            postureSignal: "proofSeeking",
            answerLength: "medium",
            expressionDepth: "guided",
            engagementSignal: "balanced",
            routeBias: ["frontier", "gauges"],
            characterGuide: "dextrion"
          }),
          opt("Let me follow the character thread.", {
            target: "characterResonance",
            intent: "hub-character-thread",
            expression: "internal",
            userText: "I want to follow the person the house thinks fits this path.",
            archetypeSignal: "characterWitness",
            desireSignal: "immersion",
            postureSignal: "immersive",
            answerLength: "long",
            expressionDepth: "immersive",
            engagementSignal: "deep",
            routeBias: ["characters", "explore"],
            characterGuide: state.profile.characterGuide || "jeeves"
          })
        ]);
      },
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Characters", "characters"),
        jump("Open Globe Window", "globeWindow"),
        jump("Jump to Audralia", "audralia")
      ]
    },

    whereAmI: {
      optionLabel: "Choose what needs focus",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "You are at Hearth: the receiving room, facility interface, and window toward Audralia.", delay: 760, emphasis: true }
          ];
        }

        return [
          { text: "You are at the threshold of Hearth.", delay: 660, emphasis: true },
          { text: "This is the receiving room: page, facility, and window meeting in one place.", delay: 920 },
          { text: "Choose what needs focus.", delay: 620 }
        ];
      },
      options: withRestart([
        opt("The house.", {
          target: "hearthPath",
          intent: "focus-house",
          userText: "Focus on the house.",
          archetypeSignal: "architect",
          desireSignal: "structure",
          postureSignal: "careful",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["hearth"],
          characterGuide: "jeeves"
        }),
        opt("The window beyond it.", {
          target: "audraliaPath",
          intent: "focus-window",
          userText: "Focus on the world beyond the window.",
          archetypeSignal: "explorer",
          desireSignal: "discovery",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["audralia", "globeWindow"],
          characterGuide: "elara"
        }),
        opt("The people inside the pressure.", {
          target: "charactersPath",
          intent: "focus-people",
          userText: "Focus on the people inside the pressure.",
          archetypeSignal: "characterWitness",
          desireSignal: "people",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["characters"],
          characterGuide: "auren"
        }),
        opt("The evidence layer.", {
          target: "proofPath",
          intent: "focus-evidence",
          userText: "Focus on the evidence layer.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "skeptical",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["gauges", "frontier"],
          characterGuide: "soren"
        })
      ]),
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Open Globe Window", "globeWindow"),
        jump("Jump to Characters", "characters")
      ]
    },

    immersiveThreshold: {
      optionLabel: "Choose the living thread",
      beats: function beats() {
        var guide = currentCharacter();

        if (!guide) {
          return [
            { text: "Then we will let the house speak through the people who carry it.", delay: 720, emphasis: true },
            { text: "Choose the instinct you want to follow.", delay: 760 }
          ];
        }

        return [
          { text: guide.relationshipVoice.knowsLine, delay: 720, emphasis: true },
          { text: guide.relationshipVoice.respectLine, delay: 980 },
          { text: "You can treat that as a dossier, or you can follow it as a path.", delay: 900 }
        ];
      },
      options: function options() {
        return withRestart([
          characterChoice("auren", "Auren: protection first."),
          characterChoice("dextrion", "Dextrion: the break first."),
          characterChoice("alaric", "Alaric: the route first."),
          characterChoice("elara", "Elara: the signal first."),
          characterChoice("soren", "Soren: the cost first."),
          opt("No, keep me with the house.", {
            target: "hearthPath",
            intent: "stay-with-house",
            userText: "No, keep me with the house.",
            archetypeSignal: "architect",
            desireSignal: "structure",
            postureSignal: "careful",
            answerLength: "medium",
            expressionDepth: "guided",
            engagementSignal: "balanced",
            routeBias: ["hearth"],
            characterGuide: "jeeves"
          })
        ]);
      },
      jumpPads: [
        jump("Jump to Characters", "characters"),
        jump("Jump to Explore", "explore"),
        jump("Jump to Hearth", "hearth")
      ]
    },

    characterResonance: {
      optionLabel: "Choose whose instinct fits",
      beats: [
        { text: "Then do not choose a page first. Choose an instinct.", delay: 720, emphasis: true },
        { text: "The house can route you through the person whose pressure matches the way you are entering.", delay: 980 }
      ],
      options: function options() {
        return withRestart([
          characterChoice("auren", "Protection first."),
          characterChoice("dextrion", "The break first."),
          characterChoice("alaric", "The route first."),
          characterChoice("tarian", "Survival first."),
          characterChoice("elara", "The signal first."),
          characterChoice("soren", "The cost first."),
          characterChoice("remoteTeam", "The public field first."),
          characterChoice("jeeves", "The house itself first.")
        ]);
      },
      jumpPads: [
        jump("Jump to Characters", "characters"),
        jump("Jump to Explore", "explore")
      ]
    },

    hearthPath: {
      optionLabel: "Choose the Hearth path",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "Hearth is the facility interface and first room.", delay: 650, emphasis: true },
            { text: "Choose the next door.", delay: 580 }
          ];
        }

        if (zone() === "immersive") {
          return [
            { text: "Hearth is not merely the page you are on.", delay: 720, emphasis: true },
            { text: "It is the room designed to receive you before the world becomes too large.", delay: 980 },
            { text: "I do not open the whole house at once. That would be poor care.", delay: 900 }
          ];
        }

        return [
          { text: "Hearth is the facility interface: the first room, the house voice, and the window toward Audralia.", delay: 860, emphasis: true },
          { text: "Choose what Hearth should open.", delay: 660 }
        ];
      },
      options: withRestart([
        opt("Open Audralia.", {
          target: "audraliaPath",
          intent: "hearth-to-audralia",
          userText: "Open Audralia.",
          archetypeSignal: "explorer",
          desireSignal: "discovery",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["audralia"],
          characterGuide: "elara"
        }),
        opt("Introduce the people.", {
          target: "charactersPath",
          intent: "hearth-to-characters",
          userText: "Introduce the people here.",
          archetypeSignal: "characterWitness",
          desireSignal: "people",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["characters"],
          characterGuide: "auren"
        }),
        opt("Show the systems beneath it.", {
          target: "frontierPath",
          intent: "hearth-to-systems",
          userText: "Show me the systems beneath it.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "proofSeeking",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "gauges"],
          characterGuide: "dextrion"
        }),
        opt("Keep speaking as the house.", {
          target: "character_jeeves",
          intent: "hearth-to-jeeves",
          expression: "internal",
          userText: "Keep speaking as the house. I want to understand the interface itself.",
          archetypeSignal: "architect",
          desireSignal: "entry",
          postureSignal: "immersive",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: ["hearth", "explore"],
          characterGuide: "jeeves"
        })
      ]),
      jumpPads: [
        jump("Jump to Hearth", "hearth"),
        jump("Jump to Audralia", "audralia"),
        jump("Jump to Characters", "characters"),
        jump("Jump to Frontier", "frontier")
      ]
    },

    audraliaPath: {
      optionLabel: "Choose how to approach Audralia",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "Audralia is the possibility world beyond the window.", delay: 660, emphasis: true },
            { text: "Choose conversation or jump.", delay: 580 }
          ];
        }

        if (zone() === "immersive") {
          return [
            { text: "Audralia is beyond this house’s window.", delay: 680, emphasis: true },
            { text: "You are not there yet, but you are already standing in the place built to reach it.", delay: 1080 },
            { text: relationshipLine("routeLine", "If you need the future to become visible, Elara is the thread to follow."), delay: 920 }
          ];
        }

        return [
          { text: "Audralia is the world beyond the window: possibility under pressure, not escape from consequence.", delay: 860, emphasis: true },
          { text: "Choose how to approach it.", delay: 660 }
        ];
      },
      options: withRestart([
        opt("Take me there.", {
          target: "jumpDecision",
          intent: "audralia-take-me",
          userText: "Take me there.",
          archetypeSignal: "explorer",
          desireSignal: "route",
          postureSignal: "direct",
          routeReadiness: "ready",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["audralia"],
          characterGuide: "elara"
        }),
        opt("Explain why it matters.", {
          target: "audraliaMeaning",
          intent: "audralia-meaning",
          userText: "Explain why Audralia matters.",
          archetypeSignal: "narrativeSeeker",
          desireSignal: "meaning",
          postureSignal: "curious",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["audralia", "characters"],
          characterGuide: "elara"
        }),
        opt("Connect it to the systems.", {
          target: "frontierPath",
          intent: "audralia-systems",
          userText: "Connect Audralia to the systems.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "proofSeeking",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "gauges"],
          characterGuide: "dextrion"
        }),
        opt("Who carries this thread?", {
          target: "character_elara",
          intent: "audralia-character",
          expression: "internal",
          userText: "Who carries the Audralia thread from inside the story?",
          archetypeSignal: "characterWitness",
          desireSignal: "people",
          postureSignal: "immersive",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: ["characters", "audralia"],
          characterGuide: "elara"
        })
      ]),
      jumpPads: [
        jump("Jump to Audralia", "audralia"),
        jump("Open Globe Window", "globeWindow"),
        jump("Jump to Frontier", "frontier"),
        jump("Jump to Characters", "characters")
      ]
    },

    audraliaMeaning: {
      optionLabel: "Choose the Audralia continuation",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "Audralia matters because it is possibility before consequence becomes final.", delay: 780, emphasis: true }
          ];
        }

        return [
          { text: "Audralia matters because it is not a fantasy exit.", delay: 760, emphasis: true },
          { text: "It is the preparation field: a living future where the mission can become physical before Earth runs out of room to pretend.", delay: 1120 },
          { text: "Choose whether to enter, inspect, or follow the people carrying it.", delay: 760 }
        ];
      },
      options: withRestart([
        opt("Enter Audralia.", {
          target: "jumpDecision",
          intent: "enter-audralia",
          userText: "Enter Audralia.",
          archetypeSignal: "explorer",
          desireSignal: "route",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeReadiness: "ready",
          routeBias: ["audralia"],
          characterGuide: "elara"
        }),
        opt("Inspect the systems.", {
          target: "frontierPath",
          intent: "audralia-inspect-systems",
          userText: "Inspect the systems behind it.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "skeptical",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "gauges"],
          characterGuide: "soren"
        }),
        opt("Follow Elara.", {
          target: "character_elara",
          intent: "audralia-follow-elara",
          userText: "Follow Elara.",
          archetypeSignal: "narrativeSeeker",
          desireSignal: "vision",
          postureSignal: "immersive",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeBias: ["characters", "audralia"],
          characterGuide: "elara"
        })
      ]),
      jumpPads: [
        jump("Jump to Audralia", "audralia"),
        jump("Jump to Characters", "characters")
      ]
    },

    charactersPath: {
      optionLabel: "Choose who the house should remember first",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "The characters are the people carrying the pressure.", delay: 680, emphasis: true },
            { text: "Choose one.", delay: 520 }
          ];
        }

        if (zone() === "immersive") {
          return [
            { text: "The characters are not decoration.", delay: 680, emphasis: true },
            { text: "I know them by the pressure they leave in the house.", delay: 920 },
            { text: "Choose who the house should remember first.", delay: 740 }
          ];
        }

        return [
          { text: "The characters make the world answer back.", delay: 720, emphasis: true },
          { text: "Choose the pressure you want to follow.", delay: 660 }
        ];
      },
      options: function options() {
        return withRestart([
          characterChoice("auren", "Auren: sanctuary and protection."),
          characterChoice("dextrion", "Dextrion: origin and repair."),
          characterChoice("alaric", "Alaric: route and danger."),
          characterChoice("tarian", "Tarian: body and survival."),
          characterChoice("elara", "Elara: signal and hope."),
          characterChoice("soren", "Soren: cost and consequence."),
          characterChoice("remoteTeam", "Remote Team: field and community."),
          characterChoice("jeeves", "Jeeves: the house itself.")
        ]);
      },
      jumpPads: [
        jump("Jump to Characters", "characters"),
        jump("Jump to Explore", "explore"),
        jump("Jump to Audralia", "audralia")
      ]
    },

    frontierPath: {
      optionLabel: "Choose the systems path",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "Frontier is the systems field.", delay: 620, emphasis: true },
            { text: "Choose test, proof, or jump.", delay: 580 }
          ];
        }

        return [
          { text: "Frontier is where the mission stops being a story and starts meeting consequence.", delay: 820, emphasis: true },
          { text: relationshipLine("routeLine", "If you want the origin of the crossing, Dextrion is where the house begins to point."), delay: 900 },
          { text: "Choose the system thread.", delay: 640 }
        ];
      },
      options: withRestart([
        opt("Show the proof layer.", {
          target: "proofPath",
          intent: "frontier-proof",
          userText: "Show the proof layer.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "proofSeeking",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeBias: ["gauges", "frontier"],
          characterGuide: "soren"
        }),
        opt("Follow Dextrion.", {
          target: "character_dextrion",
          intent: "frontier-dextrion",
          userText: "Follow Dextrion.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "origin",
          postureSignal: "direct",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "hEarth"],
          characterGuide: "dextrion"
        }),
        opt("Follow Soren.", {
          target: "character_soren",
          intent: "frontier-soren",
          userText: "Follow Soren.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "truth",
          postureSignal: "skeptical",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["gauges", "laws"],
          characterGuide: "soren"
        }),
        opt("Follow the Remote Team.", {
          target: "character_remoteTeam",
          intent: "frontier-remote-team",
          userText: "Follow the Remote Team.",
          archetypeSignal: "explorer",
          desireSignal: "community",
          postureSignal: "practical",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier", "products"],
          characterGuide: "remoteTeam"
        })
      ]),
      jumpPads: [
        jump("Jump to Frontier", "frontier"),
        jump("Jump to Gauges", "gauges"),
        jump("Jump to Laws", "laws"),
        jump("Jump to H-Earth", "hEarth")
      ]
    },

    proofPath: {
      optionLabel: "Choose the evidence path",
      beats: function beats() {
        if (zone() === "simple") {
          return [
            { text: "Proof path. Use Gauges for evidence, Frontier for systems, Laws for rules.", delay: 760, emphasis: true }
          ];
        }

        return [
          { text: "Proof is not the enemy of the house.", delay: 660, emphasis: true },
          { text: "Soren would say the clean name means nothing if the hidden cost is still moving.", delay: 960 },
          { text: "Choose what kind of proof you want.", delay: 640 }
        ];
      },
      options: withRestart([
        opt("Metrics and gauges.", {
          target: "jumpDecision",
          intent: "proof-gauges",
          userText: "Metrics and gauges.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "proof",
          postureSignal: "direct",
          answerLength: "short",
          expressionDepth: "plain",
          engagementSignal: "skim",
          routeReadiness: "ready",
          routeBias: ["gauges"],
          characterGuide: "soren"
        }),
        opt("System field.", {
          target: "frontierPath",
          intent: "proof-frontier",
          userText: "System field.",
          archetypeSignal: "systemsAnalyst",
          desireSignal: "systems",
          postureSignal: "proofSeeking",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["frontier"],
          characterGuide: "dextrion"
        }),
        opt("Rules and consequence.", {
          target: "character_soren",
          intent: "proof-soren",
          userText: "Rules and consequence.",
          archetypeSignal: "architect",
          desireSignal: "truth",
          postureSignal: "skeptical",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeBias: ["laws", "gauges"],
          characterGuide: "soren"
        })
      ]),
      jumpPads: [
        jump("Jump to Gauges", "gauges"),
        jump("Jump to Frontier", "frontier"),
        jump("Jump to Laws", "laws")
      ]
    },

    jumpDecision: {
      optionLabel: "Choose the jump",
      beats: function beats() {
        var guideLine = characterGuideLine();

        if (zone() === "simple") {
          return [
            { text: "Choose the jump pad.", delay: 560, emphasis: true }
          ];
        }

        return [
          { text: guideLine || "The route is ready.", delay: 680, emphasis: true },
          { text: "Choose the jump pad, or keep speaking with me.", delay: 740 }
        ];
      },
      options: withRestart([
        opt("Keep speaking first.", {
          target: "pathHub",
          intent: "jump-keep-speaking",
          userText: "Keep speaking first.",
          archetypeSignal: "guidedNavigator",
          desireSignal: "orientation",
          postureSignal: "careful",
          answerLength: "medium",
          expressionDepth: "guided",
          engagementSignal: "balanced",
          routeReadiness: "warming",
          routeBias: ["hearth"],
          characterGuide: "jeeves"
        }),
        opt("Give me the immersive route instead.", {
          target: "immersiveThreshold",
          intent: "jump-immersive-instead",
          expression: "internal",
          userText: "Give me the immersive route instead.",
          archetypeSignal: "narrativeSeeker",
          desireSignal: "immersion",
          postureSignal: "immersive",
          answerLength: "long",
          expressionDepth: "immersive",
          engagementSignal: "deep",
          routeReadiness: "warming",
          routeBias: ["characters", "explore"],
          characterGuide: state.profile.characterGuide || "jeeves"
        })
      ]),
      jumpPads: function pads() {
        var routeScores = state.profile.routeBiasScores || {};
        var sorted = Object.keys(routeScores).sort(function sort(a, b) {
          return Number(routeScores[b] || 0) - Number(routeScores[a] || 0);
        });

        var base = [];

        sorted.slice(0, 4).forEach(function each(routeKey) {
          var labels = {
            hearth: "Jump to Hearth",
            audralia: "Jump to Audralia",
            characters: "Jump to Characters",
            frontier: "Jump to Frontier",
            gauges: "Jump to Gauges",
            laws: "Jump to Laws",
            products: "Jump to Products",
            explore: "Jump to Explore",
            globeWindow: "Open Globe Window",
            hEarth: "Jump to H-Earth",
            controlRoom: "Open Control Room"
          };

          if (labels[routeKey]) {
            base.push(jump(labels[routeKey], routeKey, {
              characterGuide: state.profile.characterGuide || "jeeves",
              archetypeSignal: state.profile.archetypeSignal || "guidedNavigator",
              routeBias: [routeKey]
            }));
          }
        });

        if (!base.length) {
          base = [
            jump("Jump to Hearth", "hearth"),
            jump("Jump to Audralia", "audralia"),
            jump("Jump to Characters", "characters"),
            jump("Jump to Frontier", "frontier")
          ];
        }

        return base;
      }
    }
  };

  Object.keys(CHARACTER_DOSSIERS).forEach(function addCharacterNodes(key) {
    NODES["character_" + key] = {
      optionLabel: "Choose the character path",
      beats: characterNodeBeats(key),
      options: characterNodeOptions(key),
      jumpPads: characterJumpPads(key)
    };

    NODES["characterMeaning_" + key] = {
      optionLabel: "Choose the next character step",
      beats: characterMeaningBeats(key),
      options: characterNodeOptions(key),
      jumpPads: characterJumpPads(key)
    };

    NODES["characterDeep_" + key] = {
      optionLabel: "Choose the deeper path",
      beats: characterDeepBeats(key),
      options: characterNodeOptions(key),
      jumpPads: characterJumpPads(key)
    };
  });

  function getReceipt() {
    var receipt = {
      PACKET: "HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE_PACKET_v7",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      REGISTRY_PLANE: "19x19",
      HOUSE_INTERFACE: "Jeeves",
      TALK_TO_THE_HOUSE: true,
      CENTER_SCREEN_INTERFACE: true,
      CHAT_THREAD_INTERFACE: true,
      TOP_ROUTE_BUBBLES: false,
      DETERMINISTIC_CONVERSATION: true,
      FREEFORM_AI: false,
      NO_TYPING_REQUIRED: true,
      CONVERSATION_AS_FIRST_GAME_LAYER: true,
      NARRATIVE_INTERFACE_CONVERGENCE: true,
      LAYERED_ARCHETYPE_QUESTIONS: true,
      EVERY_OPTION_ARCHETYPE_BEARING: true,
      ANSWER_LENGTH_THROTTLE: true,
      EXPRESSION_DEPTH_THROTTLE: true,
      THREE_ZONE_ADAPTIVE_INTERFACE: true,
      SILENT_INFERENCE_DEFAULT: true,
      REDUNDANT_MIRROR_BUBBLES_REMOVED: true,
      CHARACTER_DOSSIERS_INTEGRATED: true,
      RELATIONAL_CHARACTER_VOICE: true,
      CONTEXTUAL_JUMP_PADS: true,
      JUMP_PADS_SEPARATE_FROM_CONVERSATION_OPTIONS: true,
      GUIDED_HANDOFFS: true,
      EVERY_INTERACTION_IS_A_PATH: true,
      CURRENT_NODE: state.currentNode,
      MODE: state.mode,
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
      DETERMINISTIC_CONVERSATION: receipt.DETERMINISTIC_CONVERSATION,
      FREEFORM_AI: receipt.FREEFORM_AI,
      NO_TYPING_REQUIRED: receipt.NO_TYPING_REQUIRED,
      NARRATIVE_INTERFACE_CONVERGENCE: receipt.NARRATIVE_INTERFACE_CONVERGENCE,
      LAYERED_ARCHETYPE_QUESTIONS: receipt.LAYERED_ARCHETYPE_QUESTIONS,
      EVERY_OPTION_ARCHETYPE_BEARING: receipt.EVERY_OPTION_ARCHETYPE_BEARING,
      ANSWER_LENGTH_THROTTLE: receipt.ANSWER_LENGTH_THROTTLE,
      EXPRESSION_DEPTH_THROTTLE: receipt.EXPRESSION_DEPTH_THROTTLE,
      THREE_ZONE_ADAPTIVE_INTERFACE: receipt.THREE_ZONE_ADAPTIVE_INTERFACE,
      SILENT_INFERENCE_DEFAULT: receipt.SILENT_INFERENCE_DEFAULT,
      REDUNDANT_MIRROR_BUBBLES_REMOVED: receipt.REDUNDANT_MIRROR_BUBBLES_REMOVED,
      CHARACTER_DOSSIERS_INTEGRATED: receipt.CHARACTER_DOSSIERS_INTEGRATED,
      RELATIONAL_CHARACTER_VOICE: receipt.RELATIONAL_CHARACTER_VOICE,
      CONTEXTUAL_JUMP_PADS: receipt.CONTEXTUAL_JUMP_PADS,
      JUMP_PADS_SEPARATE_FROM_CONVERSATION_OPTIONS: receipt.JUMP_PADS_SEPARATE_FROM_CONVERSATION_OPTIONS,
      CURRENT_NODE: receipt.CURRENT_NODE,
      MODE: receipt.MODE,
      INTERFACE_ZONE: receipt.PROFILE.interfaceZone,
      ARCHETYPE_SIGNAL: receipt.PROFILE.archetypeSignal,
      ARCHETYPE_CONFIDENCE: receipt.PROFILE.archetypeConfidence,
      CHARACTER_GUIDE: receipt.PROFILE.characterGuide,
      CHARACTER_CONFIDENCE: receipt.PROFILE.characterConfidence,
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
      getCharacterDossiers: function getCharacterDossiers() {
        return clonePlain(CHARACTER_DOSSIERS);
      },

      deterministicConversation: true,
      freeformAi: false,
      noTypingRequired: true,
      centerScreenInterface: true,
      chatThreadInterface: true,
      topRouteBubbles: false,
      narrativeInterfaceConvergence: true,
      layeredArchetypeQuestions: true,
      everyOptionArchetypeBearing: true,
      answerLengthThrottle: true,
      expressionDepthThrottle: true,
      threeZoneAdaptiveInterface: true,
      silentInferenceDefault: true,
      redundantMirrorBubblesRemoved: true,
      characterDossiersIntegrated: true,
      relationalCharacterVoice: true,
      contextualJumpPads: true,
      jumpPadsSeparateFromConversationOptions: true,
      everyInteractionIsAPath: true
    };

    Object.assign(api, NO_CLAIMS);

    root.HEARTH_JEEVES_HOUSE_INTERFACE = api;
    root.HEARTH_JEEVES_CHAT_THREAD_ENGINE = api;
    root.HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE = api;

    root.HEARTH.jeevesHouseInterface = api;
    root.HEARTH.talkToTheHouse = api;
    root.HEARTH.jeevesChatThreadEngine = api;
    root.HEARTH.jeevesLayeredExpressionJumpPadEngine = api;

    root.DEXTER_LAB.hearthJeevesHouseInterface = api;
    root.DEXTER_LAB.hearthJeevesChatThreadEngine = api;
    root.DEXTER_LAB.hearthJeevesLayeredExpressionJumpPadEngine = api;

    root.__HEARTH_JEEVES_HOUSE_INTERFACE_LOADED__ = true;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_CONTRACT__ = CONTRACT;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_ROUTE__ = ROUTE;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_FREEFORM_AI__ = false;
    root.__HEARTH_JEEVES_CENTER_SCREEN_INTERFACE__ = true;
    root.__HEARTH_JEEVES_CHAT_THREAD_INTERFACE__ = true;
    root.__HEARTH_JEEVES_LAYERED_EXPRESSION_JUMP_PAD_ENGINE__ = true;
    root.__HEARTH_JEEVES_NARRATIVE_INTERFACE_CONVERGENCE__ = true;
    root.__HEARTH_JEEVES_CONTEXTUAL_JUMP_PADS__ = true;
    root.__HEARTH_JEEVES_RELATIONAL_CHARACTER_VOICE__ = true;

    return api;
  }

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
