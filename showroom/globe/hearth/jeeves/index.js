// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE_TNT_v6
// Full-file replacement.
// Owns: Jeeves deterministic conversation engine, archetype-bearing options, adaptive archetype inference, internal/external dialect, intent-to-dialogue mapping, subtle behavior mirroring, guided route handoffs.
// Does not own: visual styling, Hearth globe chamber, Canvas Bishop, diagnostics authority, freeform AI, WebGL, runtime restart, final visual pass.

(function hearthJeevesArchetypeOptionSignalEngine(global) {
  "use strict";

  var root = global || window;
  var doc = root.document || null;

  var CONTRACT = "HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE_TNT_v6";
  var RECEIPT = "HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE_RECEIPT_v6";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_HALF_STEP_CUSTOMIZED_TRAVERSAL_ENGINE_TNT_v5";
  var VERSION = "2026-06-09.hearth-jeeves-archetype-option-signal-engine-v6";
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

  var ARCHETYPES = {
    narrativeSeeker: {
      label: "narrative seeker",
      tone: "meaning",
      preferredTargets: ["characters", "mirrorland", "hearth", "audralia"],
      mirrorLines: [
        "You seem to be following the thread by meaning first.",
        "You are listening for the story under the room. Good. I will keep that thread close.",
        "You are not just looking for a door. You are looking for why the door matters."
      ]
    },
    explorer: {
      label: "explorer",
      tone: "discovery",
      preferredTargets: ["audralia", "globeWindow", "frontier", "hearth"],
      mirrorLines: [
        "You seem to be moving toward the world before the machinery.",
        "You are reading this place like a threshold. I will keep the window open.",
        "You are choosing by discovery. That is a valid way into Hearth."
      ]
    },
    characterWitness: {
      label: "character witness",
      tone: "relational",
      preferredTargets: ["characters", "audralia", "hearth", "mirrorland"],
      mirrorLines: [
        "You are following the people first. That is a valid way into the house.",
        "You seem to understand that a world is not alive without its people.",
        "You are listening for motive and memory. I will not treat the characters as decoration."
      ]
    },
    systemsAnalyst: {
      label: "systems analyst",
      tone: "proof",
      preferredTargets: ["frontier", "controlRoom", "hearth", "audralia"],
      mirrorLines: [
        "You seem to be looking for the machinery beneath the room.",
        "You are asking for structure and evidence. I will keep the systems visible.",
        "You are not resisting the mystery. You are asking how it holds together."
      ]
    },
    architect: {
      label: "architect",
      tone: "structure",
      preferredTargets: ["hearth", "controlRoom", "frontier", "globeWindow"],
      mirrorLines: [
        "You seem to be looking beneath the surface. Good. I will keep the structure visible.",
        "You are reading the house like an architecture, not merely a page.",
        "You are watching for pattern. I will not flatten the structure into scenery."
      ]
    },
    guidedNavigator: {
      label: "guided navigator",
      tone: "orientation",
      preferredTargets: ["whereAmI", "hearth", "firstPath", "globeWindow"],
      mirrorLines: [
        "You seem to want the map before the mystery.",
        "You are asking for orientation. I will keep the path clean.",
        "You are moving carefully. That is reasonable here."
      ]
    }
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
    lastOption: null,
    mirrorCount: 0,
    lastMirrorAtTranscriptCount: 0,
    profile: {
      openingPreference: "",
      interest: "",
      pace: "",
      desire: "",
      routeStyle: "",
      archetypeSignal: "",
      archetypeLabel: "",
      archetypeConfidence: 0,
      archetypeEvidence: [],
      archetypeScores: {
        narrativeSeeker: 0,
        explorer: 0,
        characterWitness: 0,
        systemsAnalyst: 0,
        architect: 0,
        guidedNavigator: 0
      },
      routeBiasScores: {}
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

    if (options.archetypeSignal) {
      node.setAttribute("data-message-archetype-signal", options.archetypeSignal);
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

    if (option.archetypeSignal) {
      node.setAttribute("data-option-archetype-signal", option.archetypeSignal);
    }

    if (option.toneBias) {
      node.setAttribute("data-option-tone-bias", option.toneBias);
    }

    labelNode = node.querySelector("span") || node;
    labelNode.textContent = option.label || "Continue";

    node.addEventListener("click", function onOption(event) {
      event.preventDefault();
      handleOption(option);
    });

    return node;
  }

  function optionTargetKey(option) {
    return option.routeKey || option.target || option.intent || "";
  }

  function scoreOptionForCurrentArchetype(option) {
    var signal = state.profile.archetypeSignal;
    var archetype = ARCHETYPES[signal];
    var score = 0;
    var target = optionTargetKey(option);

    if (!option) return score;

    if (signal && option.archetypeSignal === signal) score += 4;
    if (archetype && archetype.preferredTargets.indexOf(target) >= 0) score += 3;

    if (option.routeBias && Array.isArray(option.routeBias)) {
      option.routeBias.forEach(function eachBias(route) {
        if (archetype && archetype.preferredTargets.indexOf(route) >= 0) score += 2;
      });
    }

    if (state.profile.routeBiasScores[target]) {
      score += state.profile.routeBiasScores[target];
    }

    return score;
  }

  function customizeOptionsByArchetype(options, lockOrder) {
    if (lockOrder || !options || !options.length) return options || [];

    if (!state.profile.archetypeSignal || state.profile.archetypeConfidence < 2) {
      return options;
    }

    return options.slice().sort(function sort(a, b) {
      var aScore = scoreOptionForCurrentArchetype(a);
      var bScore = scoreOptionForCurrentArchetype(b);

      if (bScore !== aScore) return bScore - aScore;
      return 0;
    });
  }

  function renderOptions(options, label, lockOrder) {
    clearOptions();

    if (els.promptLabel) {
      els.promptLabel.textContent = label || "Choose what to say";
    }

    var ordered = customizeOptionsByArchetype(options || [], lockOrder);
    var conversationOptions = [];
    var routeOptions = [];

    ordered.forEach(function sort(option) {
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

  function applyRouteBias(option) {
    if (!option || !Array.isArray(option.routeBias)) return;

    option.routeBias.forEach(function each(route) {
      if (!route) return;
      state.profile.routeBiasScores[route] = (state.profile.routeBiasScores[route] || 0) + 1;
    });
  }

  function updateArchetype(option) {
    if (!option) return;

    var signals = option.archetypeSignal || option.archetypeSignals || "";
    var weight = Number(option.signalWeight || 1);

    if (!signals) return;

    if (!Array.isArray(signals)) signals = [signals];

    signals.forEach(function eachSignal(signal) {
      if (!ARCHETYPES[signal]) return;

      state.profile.archetypeScores[signal] = (state.profile.archetypeScores[signal] || 0) + weight;

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

    applyRouteBias(option);
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

  function addVisitorIntent(option) {
    addMessage("visitor", visitorTextFor(option), {
      expression: visitorExpressionFor(option),
      intent: option.intent || option.target || option.action || option.routeKey || "",
      archetypeSignal: option.archetypeSignal || ""
    });

    state.lastOption = clonePlain(option);
    remember(option);
    updateArchetype(option);
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

  function deterministicPick(list, salt) {
    if (!list || !list.length) return "";
    var text = asString(salt || "") + "|" + state.transcript.length + "|" + state.memory.join(",");
    var hash = 0;

    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    return list[Math.abs(hash) % list.length];
  }

  function getMirrorLine(nodeId) {
    var signal = state.profile.archetypeSignal;
    var archetype = ARCHETYPES[signal];

    if (!signal || !archetype) return "";
    if (state.profile.archetypeConfidence < 3) return "";
    if (state.transcript.length - state.lastMirrorAtTranscriptCount < 4) return "";
    if (nodeId === "intro" || nodeId === "operationalTour") return "";

    state.lastMirrorAtTranscriptCount = state.transcript.length;
    state.mirrorCount += 1;

    return deterministicPick(archetype.mirrorLines, nodeId + "|" + signal + "|" + state.mirrorCount);
  }

  function customizedNudge() {
    var signal = state.profile.archetypeSignal;
    var interest = state.profile.interest || "";
    var pace = state.profile.pace || "";
    var desire = state.profile.desire || "";

    if (signal === "narrativeSeeker") return "You are following meaning first. I will keep the story close.";
    if (signal === "explorer") return "You are moving toward discovery. I will keep the window open.";
    if (signal === "characterWitness") return "You are following the people. I will keep motive and memory visible.";
    if (signal === "systemsAnalyst") return "You are looking for systems. I will keep the structure and evidence near the path.";
    if (signal === "architect") return "You are reading the architecture underneath. I will keep the pattern visible.";
    if (signal === "guidedNavigator") return "You are asking for orientation. I will keep the route clean.";

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

  function nodeBeats(n, id) {
    var beats = typeof n.beats === "function" ? n.beats(state) : (n.beats || []);
    var mirror = getMirrorLine(id);

    if (mirror) {
      return [{ text: mirror, delay: 640, emphasis: true }].concat(beats);
    }

    return beats;
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

    var beats = nodeBeats(n, id);
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
            renderOptions(nodeOptions(n), n.optionLabel || "Choose what to say", Boolean(n.lockOrder));
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
      PACKET: "HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE_PACKET_v6",
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
      ARCHETYPE_OPTION_SIGNAL_ENGINE: true,
      ARCHETYPE_INFERENCE: true,
      BEHAVIOR_MIRRORING: true,
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
      ARCHETYPE_OPTION_SIGNAL_ENGINE: receipt.ARCHETYPE_OPTION_SIGNAL_ENGINE,
      ARCHETYPE_INFERENCE: receipt.ARCHETYPE_INFERENCE,
      BEHAVIOR_MIRRORING: receipt.BEHAVIOR_MIRRORING,
      CUSTOMIZED_TRAVERSAL: receipt.CUSTOMIZED_TRAVERSAL,
      GUIDED_HANDOFFS: receipt.GUIDED_HANDOFFS,
      ROUTE_HANDOFFS_COLOR_DISTINCT: receipt.ROUTE_HANDOFFS_COLOR_DISTINCT,
      EVERY_NODE_ENDS_IN_FORK: receipt.EVERY_NODE_ENDS_IN_FORK,
      CURRENT_NODE: receipt.CURRENT_NODE,
      MODE: receipt.MODE,
      ARCHETYPE_SIGNAL: receipt.PROFILE.archetypeSignal,
      ARCHETYPE_CONFIDENCE: receipt.PROFILE.archetypeConfidence,
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
      archetypeOptionSignalEngine: true,
      archetypeInference: true,
      behaviorMirroring: true,
      customizedTraversal: true,
      guidedHandoffs: true,
      routeHandoffsColorDistinct: true
    };

    Object.assign(api, NO_CLAIMS);

    root.HEARTH_JEEVES_HOUSE_INTERFACE = api;
    root.HEARTH_JEEVES_CHAT_THREAD_ENGINE = api;
    root.HEARTH_JEEVES_CENTER_SCREEN_ENGINE = api;
    root.HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE = api;

    root.HEARTH.jeevesHouseInterface = api;
    root.HEARTH.talkToTheHouse = api;
    root.HEARTH.jeevesChatThreadEngine = api;
    root.HEARTH.jeevesArchetypeOptionSignalEngine = api;

    root.DEXTER_LAB.hearthJeevesHouseInterface = api;
    root.DEXTER_LAB.hearthJeevesChatThreadEngine = api;
    root.DEXTER_LAB.hearthJeevesArchetypeOptionSignalEngine = api;

    root.__HEARTH_JEEVES_HOUSE_INTERFACE_LOADED__ = true;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_CONTRACT__ = CONTRACT;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_ROUTE__ = ROUTE;
    root.__HEARTH_JEEVES_HOUSE_INTERFACE_FREEFORM_AI__ = false;
    root.__HEARTH_JEEVES_CENTER_SCREEN_INTERFACE__ = true;
    root.__HEARTH_JEEVES_CHAT_THREAD_INTERFACE__ = true;
    root.__HEARTH_JEEVES_TOP_ROUTE_BUBBLES__ = false;
    root.__HEARTH_JEEVES_ARCHETYPE_OPTION_SIGNAL_ENGINE__ = true;
    root.__HEARTH_JEEVES_ARCHETYPE_INFERENCE__ = true;
    root.__HEARTH_JEEVES_BEHAVIOR_MIRRORING__ = true;
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
      archetypeSignal: "guidedNavigator",
      signalWeight: 1,
      routeBias: ["whereAmI", "hearth"],
      toneBias: "orientation",
      memory: "returned-to-start"
    }
  ];

  function withBack(options) {
    return (options || []).concat(commonBackOptions);
  }

  var NODES = {
    intro: {
      optionLabel: "Choose how Jeeves should guide you",
      lockOrder: true,
      forkDelay: 420,
      beats: [
        { text: "Welcome to Hearth.", delay: 520, emphasis: true },
        { text: "I am Jeeves.", delay: 900, emphasis: true },
        { text: "I speak for the house here.", delay: 960 },
        { text: "Before we begin, choose how you want me to guide you.", delay: 1040, emphasis: true }
      ],
      options: [
        {
          label: "Okay, ask.",
          type: "conversation",
          expression: "external",
          mode: "adaptive",
          target: "calibrateInterest",
          intent: "adaptiveConversation",
          userText: "Okay. Ask me the question.",
          archetypeSignal: "guidedNavigator",
          signalWeight: 1,
          routeBias: ["whereAmI", "hearth"],
          toneBias: "adaptive",
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
          archetypeSignal: "systemsAnalyst",
          signalWeight: 1,
          routeBias: ["hearth", "frontier", "controlRoom"],
          toneBias: "direct",
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
          archetypeSignal: "guidedNavigator",
          signalWeight: 2,
          routeBias: ["hearth", "audralia", "frontier", "characters"],
          toneBias: "operational",
          memory: "mode-operational"
        }
      ]
    },

    calibrateInterest: {
      optionLabel: "Choose what catches you first",
      beats: [
        { text: "Good.", delay: 620, emphasis: true },
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
          archetypeSignal: "narrativeSeeker",
          signalWeight: 2,
          routeBias: ["characters", "mirrorland", "audralia"],
          toneBias: "meaning",
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
          archetypeSignal: "explorer",
          signalWeight: 2,
          routeBias: ["audralia", "globeWindow", "frontier"],
          toneBias: "discovery",
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
          archetypeSignal: "characterWitness",
          signalWeight: 2,
          routeBias: ["characters", "audralia", "hearth"],
          toneBias: "relational",
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
          archetypeSignal: "systemsAnalyst",
          signalWeight: 2,
          routeBias: ["frontier", "controlRoom", "hearth"],
          toneBias: "proof",
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
          archetypeSignal: "architect",
          signalWeight: 3,
          routeBias: ["hearth", "controlRoom", "frontier"],
          toneBias: "structure",
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
          archetypeSignal: "guidedNavigator",
          signalWeight: 3,
          routeBias: ["whereAmI", "hearth", "firstPath"],
          toneBias: "orientation",
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
          archetypeSignal: "narrativeSeeker",
          signalWeight: 1,
          routeBias: ["mirrorland", "characters", "audralia"],
          toneBias: "immersive",
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
          archetypeSignal: "systemsAnalyst",
          signalWeight: 1,
          routeBias: ["frontier", "controlRoom", "firstPath"],
          toneBias: "direct",
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
          archetypeSignal: "architect",
          signalWeight: 2,
          routeBias: ["hearth", "frontier", "controlRoom"],
          toneBias: "logic",
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
          archetypeSignal: "explorer",
          signalWeight: 2,
          routeBias: ["audralia", "mirrorland", "globeWindow"],
          toneBias: "mystery",
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
          archetypeSignal: "guidedNavigator",
          signalWeight: 2,
          routeBias: ["whereAmI", "hearth", "firstPath"],
          toneBias: "orientation",
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
          archetypeSignal: "narrativeSeeker",
          signalWeight: 2,
          routeBias: ["characters", "mirrorland", "hearth"],
          toneBias: "meaning",
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
          archetypeSignal: "explorer",
          signalWeight: 2,
          routeBias: ["audralia", "globeWindow", "frontier"],
          toneBias: "discovery",
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
          archetypeSignal: "systemsAnalyst",
          signalWeight: 3,
          routeBias: ["controlRoom", "frontier", "hearth"],
          toneBias: "proof",
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
          archetypeSignal: "guidedNavigator",
          signalWeight: 2,
          routeBias: ["firstPath", "hearth", "audralia"],
          toneBias: "route",
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
            userText: "Show me where I am.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["whereAmI", "hearth"],
            toneBias: "orientation"
          },
          {
            label: "Explain Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearth",
            userText: "Explain Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth", "controlRoom"],
            toneBias: "structure"
          },
          {
            label: "Explain Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Explain Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia", "globeWindow"],
            toneBias: "discovery"
          },
          {
            label: "Who is working here?",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "characters",
            userText: "Who is working here?",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters", "hearth"],
            toneBias: "relational"
          },
          {
            label: "I think I’m ready to choose a door.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "readyForDoor",
            userText: "I think I’m ready to choose a door now.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath"],
            toneBias: "route"
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
            userText: "Start with Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth", "controlRoom"],
            toneBias: "structure"
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Start with Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia", "globeWindow"],
            toneBias: "discovery"
          },
          {
            label: "Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "Start with Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier", "controlRoom"],
            toneBias: "systems"
          },
          {
            label: "First door.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whereFirst",
            userText: "Show me the first door.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath", "hearth"],
            toneBias: "route"
          },
          {
            label: "I still need the basic map.",
            type: "conversation",
            expression: "internal",
            target: "whereAmI",
            intent: "needBasicMap",
            userText: "I still need the basic map before I choose anything.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 2,
            routeBias: ["whereAmI", "hearth"],
            toneBias: "orientation"
          }
        ]);
      }
    },

    operationalTour: {
      optionLabel: "Choose a place",
      lockOrder: true,
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
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "route",
            confirmation: "Hearth chamber first. Good. I will take you there."
          },
          {
            label: "Audralia.",
            type: "route",
            expression: "external",
            routeKey: "audralia",
            intent: "routeAudralia",
            userText: "Take me to Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "discovery",
            confirmation: "Audralia is the world beyond the window. I will open it now."
          },
          {
            label: "Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Take me to Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier"],
            toneBias: "systems",
            confirmation: "Frontier is the systems field. I will take you there."
          },
          {
            label: "Characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Take me to the characters.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "relational",
            confirmation: "The character wing is the right place for people and motive. I will open it now."
          },
          {
            label: "Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["globeWindow"],
            toneBias: "world",
            confirmation: "The Globe Window widens the frame. I will open it now."
          },
          {
            label: "Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["controlRoom"],
            toneBias: "proof",
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
            userText: "Focus on the house.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "The world beyond the window.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainWorldBeyondWindow",
            userText: "Focus on the world beyond the window.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "discovery"
          },
          {
            label: "I’m starting to see the frame.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "seeingFrame",
            userText: "I’m starting to see the frame. I may be ready for a path.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath"],
            toneBias: "route"
          },
          {
            label: "Show me the Hearth page.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Show me the Hearth page.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "route",
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
            userText: "Tell me about Mirrorland.",
            archetypeSignal: "narrativeSeeker",
            signalWeight: 1,
            routeBias: ["mirrorland"],
            toneBias: "meaning"
          },
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Tell me about Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Tell me about Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "I need the next door.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "needNextDoor",
            userText: "I think I understand the website enough. I need the next door.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath"],
            toneBias: "route"
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
            userText: "Open the Hearth layer.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Open the Audralia layer.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "Globe Window.",
            type: "conversation",
            expression: "external",
            target: "globeWindow",
            intent: "whatIsGlobeWindow",
            userText: "Open the Globe Window layer.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["globeWindow"],
            toneBias: "world"
          },
          {
            label: "Take me to the Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["globeWindow"],
            toneBias: "route",
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
            userText: "Open Audralia for me.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "The people working here.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoIsWorkingHere",
            userText: "Show me who is working here.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "relational"
          },
          {
            label: "The systems field.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "whatIsFrontier",
            userText: "Show me the systems field.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier"],
            toneBias: "systems"
          },
          {
            label: "The house feels like the real doorway.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "houseAsDoorway",
            userText: "The house feels like the real doorway. I need to know where to go next.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["firstPath", "hearth"],
            toneBias: "structure"
          },
          {
            label: "Show me the Hearth chamber.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Show me the Hearth chamber.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "route",
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
            userText: "Approach Audralia through Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Through Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "frontierAudraliaConnection",
            userText: "Approach Audralia through Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier"],
            toneBias: "systems"
          },
          {
            label: "Through the characters.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "charactersAudraliaConnection",
            userText: "Approach Audralia through the characters.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "relational"
          },
          {
            label: "I think I’m ready to see it.",
            type: "route",
            expression: "internal",
            routeKey: "audralia",
            intent: "readyToSeeAudralia",
            userText: "I think I’m ready to see Audralia directly.",
            archetypeSignal: "explorer",
            signalWeight: 2,
            routeBias: ["audralia"],
            toneBias: "discovery",
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
            userText: "Bring Audralia back into view.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "The people.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "whoAreCharacters",
            userText: "Bring the people into view.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "relational"
          },
          {
            label: "First route.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "whatFirst",
            userText: "Give me the first route.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath"],
            toneBias: "route"
          },
          {
            label: "Show me Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Show me Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 2,
            routeBias: ["frontier"],
            toneBias: "systems",
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
            userText: "Tell me about Dextrion.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["characters", "frontier"],
            toneBias: "systems"
          },
          {
            label: "Alaric.",
            type: "conversation",
            expression: "external",
            target: "alaric",
            intent: "whoIsAlaric",
            userText: "Tell me about Alaric.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["characters", "whereAmI"],
            toneBias: "orientation"
          },
          {
            label: "Jeeves.",
            type: "conversation",
            expression: "external",
            target: "jeevesSelf",
            intent: "explainJeeves",
            userText: "Explain yourself, Jeeves.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "The people make it feel alive.",
            type: "conversation",
            expression: "internal",
            target: "firstPath",
            intent: "peopleMakeAlive",
            userText: "The people make this feel alive. I want to know where that leads.",
            archetypeSignal: "characterWitness",
            signalWeight: 2,
            routeBias: ["characters", "audralia"],
            toneBias: "relational"
          },
          {
            label: "Take me to the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Take me to the characters.",
            archetypeSignal: "characterWitness",
            signalWeight: 2,
            routeBias: ["characters"],
            toneBias: "route",
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
            userText: "Now tell me about Alaric.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["alaric", "characters"],
            toneBias: "orientation"
          },
          {
            label: "Hearth.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "whatIsHearth",
            userText: "Bring this back to Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Show me the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Show me the characters.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "route",
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
            userText: "Now tell me about Dextrion.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["dextrion", "frontier"],
            toneBias: "systems"
          },
          {
            label: "Mirrorland.",
            type: "conversation",
            expression: "external",
            target: "mirrorland",
            intent: "whatIsMirrorland",
            userText: "Bring this back to Mirrorland.",
            archetypeSignal: "narrativeSeeker",
            signalWeight: 1,
            routeBias: ["mirrorland"],
            toneBias: "meaning"
          },
          {
            label: "Show me the characters.",
            type: "route",
            expression: "external",
            routeKey: "characters",
            intent: "routeCharacters",
            userText: "Show me the characters.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "route",
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
            userText: "Explain Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Explain Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "whatIsAudralia",
            userText: "Explain Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "Keep going.",
            type: "conversation",
            expression: "external",
            target: "firstPath",
            intent: "keepGoing",
            userText: "Let us keep going.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["firstPath"],
            toneBias: "route"
          },
          {
            label: "Minimize for now.",
            type: "conversation",
            expression: "external",
            action: "minimize",
            intent: "minimize",
            userText: "Minimize for now.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "pause"
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
            userText: "Start with the room: Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "World: Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudraliaFirst",
            userText: "Start with the world: Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "System: Frontier.",
            type: "conversation",
            expression: "external",
            target: "frontier",
            intent: "explainFrontierFirst",
            userText: "Start with the systems field: Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier"],
            toneBias: "systems"
          },
          {
            label: "People: Characters.",
            type: "conversation",
            expression: "external",
            target: "characters",
            intent: "explainCharactersFirst",
            userText: "Start with the people.",
            archetypeSignal: "characterWitness",
            signalWeight: 1,
            routeBias: ["characters"],
            toneBias: "relational"
          },
          {
            label: "Take me to Audralia.",
            type: "route",
            expression: "external",
            routeKey: "audralia",
            intent: "routeAudralia",
            userText: "Take me to Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "route",
            confirmation: "Audralia is the strongest first crossing after Hearth. I will open it now."
          },
          {
            label: "Take me to Frontier.",
            type: "route",
            expression: "external",
            routeKey: "frontier",
            intent: "routeFrontier",
            userText: "Take me to Frontier.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["frontier"],
            toneBias: "route",
            confirmation: "Frontier is the systems path. I will open that field now."
          },
          {
            label: "Open the Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 1,
            routeBias: ["controlRoom"],
            toneBias: "proof",
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
            userText: "Bring this back to Hearth.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Audralia.",
            type: "conversation",
            expression: "external",
            target: "audralia",
            intent: "explainAudralia",
            userText: "Bring this back to Audralia.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["audralia"],
            toneBias: "world"
          },
          {
            label: "Take me to the Globe Window.",
            type: "route",
            expression: "external",
            routeKey: "globeWindow",
            intent: "routeGlobeWindow",
            userText: "Take me to the Globe Window.",
            archetypeSignal: "explorer",
            signalWeight: 1,
            routeBias: ["globeWindow"],
            toneBias: "route",
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
            userText: "Keep me oriented.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["whereAmI"],
            toneBias: "orientation"
          },
          {
            label: "Explain Hearth instead.",
            type: "conversation",
            expression: "external",
            target: "hearth",
            intent: "explainHearthInstead",
            userText: "Explain Hearth instead.",
            archetypeSignal: "architect",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "structure"
          },
          {
            label: "Open the Control Room.",
            type: "control",
            expression: "external",
            routeKey: "controlRoom",
            intent: "routeControlRoom",
            userText: "Open the Control Room.",
            archetypeSignal: "systemsAnalyst",
            signalWeight: 2,
            routeBias: ["controlRoom"],
            toneBias: "proof",
            confirmation: "Very well. I will open the Control Room. The evidence will be waiting there."
          },
          {
            label: "Return to Hearth.",
            type: "route",
            expression: "external",
            routeKey: "hearth",
            intent: "routeHearth",
            userText: "Return to Hearth.",
            archetypeSignal: "guidedNavigator",
            signalWeight: 1,
            routeBias: ["hearth"],
            toneBias: "route",
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
