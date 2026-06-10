// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_COLLAPSED_CONVERSION_HOST_ENGINE_TNT_v3
// Full-file replacement.
// Owns: deterministic Jeeves conversation engine, visitor posture read, guided route handoffs, current-session state.
// Does not own: HTML shell, CSS styling, backend, storage, login, freeform AI, WebGL, Hearth globe chamber, diagnostics authority, final visual pass.

(function hearthJeevesCollapsedConversionHost(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_COLLAPSED_CONVERSION_HOST_ENGINE_TNT_v3";
  var ROUTE = "/showroom/globe/hearth/jeeves/";

  var DEFAULT_ROUTES = {
    compass: "/",
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    interactiveNarrative: "/showroom/globe/",
    audralia: "/showroom/globe/audralia/",
    frontier: "/explore/frontier/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/hearth/diagnostic/",
    siteGuide: "/site-guide/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    meetSean: "/meet-sean-mansfield/",
    products: "/products/",
    laws: "/laws/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    book: "/nine-summits-of-love/",
    nineSummits: "/nine-summits/",
    aboutUnderdog: "/about-this-underdog/"
  };

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    currentNode: "intro",
    lastNode: null,
    lastIntent: "arrival",
    cycleStep: 0,
    curiosityLevel: 1,
    skepticismLevel: 0,
    acceptedRoute: null,
    lastSuggestedRoutes: [],
    initialized: false
  };

  var els = {};
  var config = {};

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function readConfig() {
    var script = $("#jeevesConversationConfig");

    if (!script) {
      return {
        route: ROUTE,
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        route: ROUTE,
        routes: {}
      };
    }
  }

  function mergeRoutes() {
    var merged = {};
    var key;

    for (key in DEFAULT_ROUTES) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_ROUTES, key)) {
        merged[key] = DEFAULT_ROUTES[key];
      }
    }

    if (config.routes) {
      for (key in config.routes) {
        if (Object.prototype.hasOwnProperty.call(config.routes, key)) {
          merged[key] = config.routes[key];
        }
      }
    }

    return merged;
  }

  function routeLabel(id) {
    var labels = {
      compass: "Start at the Compass",
      siteGuide: "Open the Site Guide",
      coherenceDiagnostic: "Take the Coherence Diagnostic",
      meetSean: "Meet Sean Mansfield",
      products: "Open Products",
      laws: "Read the Laws",
      gauges: "Open Gauges",
      interactiveNarrative: "Enter the Interactive Narrative",
      globeWindow: "Enter the World Gate",
      hearth: "Return to Hearth",
      audralia: "Visit Audralia",
      frontier: "Explore Frontier",
      characters: "Meet the Characters",
      controlRoom: "Open the Control Room",
      book: "Open The Nine Summits of Love",
      nineSummits: "Open Nine Summits",
      aboutUnderdog: "About This Underdog"
    };

    return labels[id] || "Open Path";
  }

  function handoff(id, label) {
    var routes = mergeRoutes();

    return {
      id: id,
      label: label || routeLabel(id),
      href: routes[id] || "#"
    };
  }

  var NODES = {
    intro: {
      intent: "arrival",
      say:
        "Welcome to Diamond Gate Bridge. Most visitors arrive here asking the same thing: what exactly am I looking at? I can answer that two ways. I can guide you through the website, or I can take you toward the world behind it.",
      options: [
        { label: "Guide me through the website.", target: "website", type: "conversation" },
        { label: "Take me toward the world behind it.", target: "world", type: "conversation" },
        { label: "I’m skeptical. Explain it plainly.", target: "skeptic", type: "calibration" },
        { label: "Just tell me where to start.", target: "start", type: "conversation" }
      ],
      handoffs: []
    },

    website: {
      intent: "website",
      say:
        "The website is the public estate. It gives you doors into proof, products, Sean, self-reflection, and the story-world. You are not supposed to understand the whole house from the doorway. You are supposed to choose the door that matches your reason for arriving.",
      options: [
        { label: "Show me the proof path.", target: "proof", type: "topic" },
        { label: "Show me the practical tools.", target: "products", type: "topic" },
        { label: "Tell me who Sean is.", target: "sean", type: "topic" },
        { label: "Now take me toward the world.", target: "world", type: "conversation" }
      ],
      handoffs: ["compass", "siteGuide", "coherenceDiagnostic"]
    },

    world: {
      intent: "world",
      say:
        "The world behind the site is where the estate stops behaving like a list of pages and starts behaving like a place. Mirrorland, Hearth, Audralia, Frontier, characters, future profiles, NPCs, and Mirror Me all belong to that deeper path. I will not ask you to learn all of it now. I will help you choose the next door.",
      options: [
        { label: "Start me at the world gate.", target: "worldGate", type: "route" },
        { label: "Tell me about the characters.", target: "characters", type: "topic" },
        { label: "Explain Mirror Me and profiles.", target: "future", type: "topic" },
        { label: "Take me back to the website path.", target: "website", type: "back" }
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia"]
    },

    skeptic: {
      intent: "skeptic",
      skepticism: 2,
      say:
        "Plainly: this is a guided website that uses story, proof, diagnostics, and products to help people enter a large system without getting lost. If you want to test whether it has structure, do not start with the most imaginative part. Start with the Laws, the Diagnostic, or the Compass.",
      options: [
        { label: "Show me the Laws.", target: "proof", type: "topic" },
        { label: "Show me the Diagnostic.", target: "diagnostic", type: "topic" },
        { label: "Show me the practical use.", target: "products", type: "topic" },
        { label: "I’m ready for the world side.", target: "world", type: "conversation" }
      ],
      handoffs: ["laws", "coherenceDiagnostic", "compass"]
    },

    start: {
      intent: "orientation",
      say:
        "Start at the Compass if you want orientation. Start at the Coherence Diagnostic if you want to see where you fit. Start at Laws if you need proof before imagination. Start at Products if you want practical use first.",
      options: [
        { label: "I want orientation.", target: "compassPath", type: "route" },
        { label: "I want self-reflection.", target: "diagnostic", type: "topic" },
        { label: "I want proof.", target: "proof", type: "topic" },
        { label: "I want practical use.", target: "products", type: "topic" }
      ],
      handoffs: ["compass", "coherenceDiagnostic", "laws", "products"]
    },

    compassPath: {
      intent: "orientation",
      say:
        "The Compass is the simplest first door. It is not there to impress you. It is there to stop the estate from feeling like a maze. From there, you can move toward the Diagnostic, the site, or the guided path.",
      options: [
        { label: "Take me to the Compass.", target: "handoffCompass", type: "route" },
        { label: "Explain the Diagnostic first.", target: "diagnostic", type: "topic" },
        { label: "Explain the world path first.", target: "world", type: "conversation" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["compass"]
    },

    diagnostic: {
      intent: "diagnostic",
      say:
        "The Coherence Diagnostic is the personal mirror. It asks how coherent you believe yourself to be, then compares that claim against pressure scenarios. It is local-only, reflective, and not a medical, legal, employment, IQ, or official personality test. Later, this path can help seed a free character profile.",
      options: [
        { label: "Take me to the Diagnostic.", target: "handoffDiagnostic", type: "route" },
        { label: "Explain the future profile.", target: "future", type: "topic" },
        { label: "Show me proof instead.", target: "proof", type: "topic" },
        { label: "Back to the first fork.", target: "intro", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic"]
    },

    proof: {
      intent: "proof",
      skepticism: 1,
      say:
        "The proof path begins with the Laws. That is where the estate says what can be claimed, what must be checked, and why proof outranks confidence. Gauges are the more technical status path. If imagination is the front window, Laws are the foundation inspection.",
      options: [
        { label: "Read the Laws.", target: "handoffLaws", type: "route" },
        { label: "Open Gauges.", target: "handoffGauges", type: "route" },
        { label: "Show me the Diagnostic.", target: "diagnostic", type: "topic" },
        { label: "Show me the world side now.", target: "world", type: "conversation" }
      ],
      handoffs: ["laws", "gauges", "coherenceDiagnostic"]
    },

    products: {
      intent: "products",
      say:
        "Products are where the message becomes usable. They are not just labels. They are doors into tools, support paths, education, nutrition, games, the book, and practical ways to use the system without having to understand every chamber first.",
      options: [
        { label: "Open Products.", target: "handoffProducts", type: "route" },
        { label: "Show me the book path.", target: "book", type: "topic" },
        { label: "Tell me who Sean is.", target: "sean", type: "topic" },
        { label: "Back to website guide.", target: "website", type: "back" }
      ],
      handoffs: ["products", "book", "nineSummits"]
    },

    book: {
      intent: "book",
      say:
        "The Nine Summits path is the book and seminar side of the estate. It turns the larger message into a human development path: love, pressure, self-understanding, voice, and practical movement through inner barriers.",
      options: [
        { label: "Open the book.", target: "handoffBook", type: "route" },
        { label: "Open Nine Summits.", target: "handoffNineSummits", type: "route" },
        { label: "Tell me about Sean.", target: "sean", type: "topic" },
        { label: "Back to Products.", target: "products", type: "back" }
      ],
      handoffs: ["book", "nineSummits"]
    },

    sean: {
      intent: "sean",
      say:
        "Sean is the human voice behind this side of the bridge. He turns pressure into language, and language into rooms other people can walk through. If you want the person behind the estate, Meet Sean is the cleanest door.",
      options: [
        { label: "Meet Sean.", target: "handoffSean", type: "route" },
        { label: "Show me This Underdog.", target: "underdog", type: "topic" },
        { label: "Show me the practical doors.", target: "products", type: "topic" },
        { label: "Back to the website path.", target: "website", type: "back" }
      ],
      handoffs: ["meetSean", "aboutUnderdog"]
    },

    underdog: {
      intent: "sean",
      say:
        "This Underdog is part of the voice of the house: pressure turned into comedy, story, and usable language. It is not separate from the estate. It is one of the ways the estate stays human.",
      options: [
        { label: "Open About This Underdog.", target: "handoffUnderdog", type: "route" },
        { label: "Meet Sean instead.", target: "sean", type: "topic" },
        { label: "Show me the book path.", target: "book", type: "topic" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["aboutUnderdog", "meetSean"]
    },

    characters: {
      intent: "characters",
      say:
        "The characters are not menu labels. They are people inside the world path. Their job is to make the estate feel inhabited, not to make you memorize lore at the doorway. If that is the door you want, I would send you toward Characters or the Interactive Narrative.",
      options: [
        { label: "Meet the Characters.", target: "handoffCharacters", type: "route" },
        { label: "Enter the Interactive Narrative.", target: "worldGate", type: "route" },
        { label: "Explain Mirror Me first.", target: "future", type: "topic" },
        { label: "Back to world path.", target: "world", type: "back" }
      ],
      handoffs: ["characters", "interactiveNarrative"]
    },

    future: {
      intent: "future",
      say:
        "The future path is where the Diagnostic, character profile, NPCs, and Mirror Me start to connect. The goal is not to trap you in a chat. The goal is to make the estate respond to how you enter, what you choose, and what kind of pressure you carry. Some of that is live now. Some of it is coming.",
      options: [
        { label: "Start with the Diagnostic.", target: "diagnostic", type: "topic" },
        { label: "Enter the world path.", target: "worldGate", type: "route" },
        { label: "Meet the Characters.", target: "characters", type: "topic" },
        { label: "Back to first fork.", target: "intro", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic", "interactiveNarrative", "characters"]
    },

    worldGate: {
      intent: "world-route",
      say:
        "Then I would not keep you here. The next door is the world gate. Enter there when you want the estate to stop explaining itself and start opening.",
      options: [
        { label: "Enter the Interactive Narrative.", target: "handoffWorld", type: "route" },
        { label: "Visit Hearth first.", target: "handoffHearth", type: "route" },
        { label: "Visit Audralia.", target: "handoffAudralia", type: "route" },
        { label: "Return to the first fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["interactiveNarrative", "hearth", "audralia", "frontier"]
    },

    handoffCompass: {
      intent: "handoff",
      say:
        "Open the Compass. It is the cleanest orientation point.",
      options: [
        { label: "Restart the fork.", target: "intro", type: "restart" },
        { label: "Show me another path.", target: "website", type: "back" }
      ],
      handoffs: ["compass"]
    },

    handoffDiagnostic: {
      intent: "handoff",
      say:
        "Open the Diagnostic. It is the cleanest mirror path.",
      options: [
        { label: "Restart the fork.", target: "intro", type: "restart" },
        { label: "Show me proof instead.", target: "proof", type: "back" }
      ],
      handoffs: ["coherenceDiagnostic"]
    },

    handoffLaws: {
      intent: "handoff",
      say:
        "Open the Laws. That is where the estate makes its proof posture visible.",
      options: [
        { label: "Open Gauges too.", target: "handoffGauges", type: "route" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["laws"]
    },

    handoffGauges: {
      intent: "handoff",
      say:
        "Open Gauges if you want the technical status path rather than the public explanation path.",
      options: [
        { label: "Read the Laws too.", target: "handoffLaws", type: "route" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["gauges"]
    },

    handoffProducts: {
      intent: "handoff",
      say:
        "Open Products. That is where the estate becomes usable.",
      options: [
        { label: "Show me the book path.", target: "book", type: "topic" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["products"]
    },

    handoffSean: {
      intent: "handoff",
      say:
        "Open Meet Sean. That is the cleanest path to the human voice behind the house.",
      options: [
        { label: "Show me This Underdog too.", target: "underdog", type: "topic" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["meetSean"]
    },

    handoffUnderdog: {
      intent: "handoff",
      say:
        "Open About This Underdog if you want the voice, pressure, and comedy side of the estate.",
      options: [
        { label: "Meet Sean instead.", target: "sean", type: "topic" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["aboutUnderdog"]
    },

    handoffBook: {
      intent: "handoff",
      say:
        "Open The Nine Summits of Love if you want the book path.",
      options: [
        { label: "Open Nine Summits too.", target: "handoffNineSummits", type: "route" },
        { label: "Back to Products.", target: "products", type: "back" }
      ],
      handoffs: ["book"]
    },

    handoffNineSummits: {
      intent: "handoff",
      say:
        "Open Nine Summits if you want the wider development path around the book and seminar system.",
      options: [
        { label: "Open the book too.", target: "handoffBook", type: "route" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["nineSummits"]
    },

    handoffCharacters: {
      intent: "handoff",
      say:
        "Open Characters if you want the world to become populated instead of merely explained.",
      options: [
        { label: "Enter the Interactive Narrative too.", target: "worldGate", type: "route" },
        { label: "Back to world path.", target: "world", type: "back" }
      ],
      handoffs: ["characters"]
    },

    handoffWorld: {
      intent: "handoff",
      say:
        "Enter the Interactive Narrative. That is the right next door if you want the world behind the website.",
      options: [
        { label: "Visit Hearth first.", target: "handoffHearth", type: "route" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["interactiveNarrative"]
    },

    handoffHearth: {
      intent: "handoff",
      say:
        "Return to Hearth if you want the house-side world before moving farther outward.",
      options: [
        { label: "Enter the Interactive Narrative.", target: "handoffWorld", type: "route" },
        { label: "Visit Audralia.", target: "handoffAudralia", type: "route" }
      ],
      handoffs: ["hearth"]
    },

    handoffAudralia: {
      intent: "handoff",
      say:
        "Visit Audralia if you want one of the visible world lanes beyond Hearth.",
      options: [
        { label: "Enter the Interactive Narrative.", target: "handoffWorld", type: "route" },
        { label: "Explore Frontier.", target: "handoffFrontier", type: "route" }
      ],
      handoffs: ["audralia"]
    },

    handoffFrontier: {
      intent: "handoff",
      say:
        "Explore Frontier if you want the outward-facing discovery path.",
      options: [
        { label: "Back to world path.", target: "world", type: "back" },
        { label: "Restart the fork.", target: "intro", type: "restart" }
      ],
      handoffs: ["frontier"]
    }
  };

  function collectElements() {
    els.thread = $("#jeevesThread");
    els.typing = $("[data-jeeves-typing]");
    els.promptGrid = $("[data-jeeves-prompt-grid]");
    els.handoffDock = $("[data-jeeves-handoff-dock]");
    els.handoffGrid = $("[data-jeeves-handoff-grid]");
    els.status = $("[data-jeeves-status]");
    els.statusText = $("[data-jeeves-status-text]");
    els.messageTemplate = $("#jeevesMessageTemplate");
    els.optionTemplate = $("#jeevesOptionTemplate");
    els.routeOptionTemplate = $("#jeevesRouteOptionTemplate");
    els.restoreButton = $("[data-jeeves-action='restore']");
    els.minimized = $("[data-jeeves-minimized]");
  }

  function setStatus(value, text) {
    if (els.status) {
      els.status.setAttribute("data-jeeves-status", value);
    }

    if (els.statusText) {
      els.statusText.textContent = text;
    }
  }

  function setTyping(isTyping) {
    if (!els.typing) return;

    els.typing.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    els.typing.setAttribute("aria-hidden", isTyping ? "false" : "true");

    setStatus(isTyping ? "thinking" : "listening", isTyping ? "Jeeves considering" : "House listening");
  }

  function clearSeedMessage() {
    if (!els.thread) return;

    var seed = $("[data-seed-message='true']", els.thread);

    if (seed) {
      seed.remove();
    }
  }

  function scrollThread() {
    if (!els.thread) return;

    try {
      els.thread.scrollTop = els.thread.scrollHeight;
    } catch (_error) {
      // Non-critical.
    }
  }

  function cloneTemplate(template, fallbackTag) {
    if (template && template.content && template.content.firstElementChild) {
      return template.content.firstElementChild.cloneNode(true);
    }

    return document.createElement(fallbackTag || "div");
  }

  function addMessage(origin, text, options) {
    if (!els.thread) return null;

    var message = cloneTemplate(els.messageTemplate, "article");
    var name = $(".jeeves-message-name", message);
    var paragraph = $("p", message);

    message.classList.add("jeeves-message");
    message.setAttribute("data-message-origin", origin);

    if (options && options.emphasis) {
      message.setAttribute("data-message-emphasis", "true");
    }

    if (name) {
      if (origin === "visitor") name.textContent = "Visitor";
      else if (origin === "system") name.textContent = "House";
      else name.textContent = "Jeeves";
    }

    if (paragraph) {
      paragraph.textContent = text;
    } else {
      message.textContent = text;
    }

    els.thread.appendChild(message);
    scrollThread();

    return message;
  }

  function clearGrid(grid) {
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
  }

  function makeOptionButton(option) {
    var button = cloneTemplate(els.optionTemplate, "button");
    var label = $("span", button);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", option.type || "conversation");
    button.setAttribute("data-option-target", option.target || "");

    if (label) label.textContent = option.label;
    else button.textContent = option.label;

    button.addEventListener("click", function onOptionClick() {
      handleOption(option);
    });

    return button;
  }

  function makeRouteLink(routeOption) {
    var link = cloneTemplate(els.routeOptionTemplate, "a");
    var label = $("span", link);

    link.classList.add("jeeves-option");
    link.classList.add("jeeves-option-route");
    link.setAttribute("href", routeOption.href || "#");
    link.setAttribute("data-option-type", "route");
    link.setAttribute("data-option-target", routeOption.id || "");

    if (label) label.textContent = routeOption.label;
    else link.textContent = routeOption.label;

    link.addEventListener("click", function onRouteClick() {
      state.acceptedRoute = routeOption.id;
    });

    return link;
  }

  function renderOptions(options) {
    clearGrid(els.promptGrid);

    if (!els.promptGrid) return;

    (options || []).forEach(function eachOption(option) {
      els.promptGrid.appendChild(makeOptionButton(option));
    });
  }

  function renderHandoffs(ids) {
    clearGrid(els.handoffGrid);

    var list = (ids || []).map(function mapId(id) {
      return typeof id === "string" ? handoff(id) : id;
    }).filter(function valid(item) {
      return item && item.href && item.href !== "#";
    });

    state.lastSuggestedRoutes = list.map(function mapRoute(item) {
      return item.id;
    });

    if (!els.handoffDock || !els.handoffGrid) return;

    if (!list.length) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      return;
    }

    els.handoffDock.setAttribute("data-handoff-visible", "true");

    list.forEach(function eachHandoff(item) {
      els.handoffGrid.appendChild(makeRouteLink(item));
    });
  }

  function updateState(nodeId, node) {
    state.lastNode = state.currentNode;
    state.currentNode = nodeId;
    state.lastIntent = node.intent || state.lastIntent;
    state.cycleStep = (state.cycleStep + 1) % 9;

    if (typeof node.skepticism === "number") {
      state.skepticismLevel = Math.max(state.skepticismLevel, node.skepticism);
    }

    if (node.intent === "world" || node.intent === "characters" || node.intent === "future") {
      state.curiosityLevel = Math.max(state.curiosityLevel, 2);
    }
  }

  function runNode(nodeId, options) {
    var node = NODES[nodeId] || NODES.intro;

    updateState(nodeId, node);
    renderOptions([]);
    renderHandoffs([]);

    setTyping(true);

    window.setTimeout(function afterBriefPause() {
      setTyping(false);
      addMessage("jeeves", node.say, { emphasis: nodeId === "intro" || nodeId === "skeptic" });
      renderOptions(node.options);
      renderHandoffs(node.handoffs);

      if (options && options.silent !== true) {
        scrollThread();
      }
    }, options && options.fast ? 80 : 180);
  }

  function handleOption(option) {
    if (!option || !option.target) return;

    addMessage("visitor", option.label);
    runNode(option.target);
  }

  function bindRestore() {
    if (!els.restoreButton || !els.minimized) return;

    els.restoreButton.addEventListener("click", function restore() {
      els.minimized.setAttribute("data-jeeves-minimized", "false");
      setStatus("listening", "House listening");
      scrollThread();
    });
  }

  function exposeApi() {
    global.HEARTH = global.HEARTH || {};
    global.HEARTH.JEEVES = global.HEARTH.JEEVES || {};

    global.HEARTH.JEEVES.engine = {
      contract: CONTRACT,
      route: ROUTE,
      state: state,
      routes: mergeRoutes,
      runNode: runNode,
      getNode: function getNode(id) {
        return NODES[id] || null;
      },
      getNodes: function getNodes() {
        return NODES;
      }
    };

    global.JEEVES_ENGINE = global.HEARTH.JEEVES.engine;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
  }

  function init() {
    if (state.initialized) return;

    config = readConfig();
    collectElements();

    if (!els.thread || !els.promptGrid || !els.handoffGrid) {
      return;
    }

    clearSeedMessage();
    bindRestore();
    exposeApi();

    state.initialized = true;

    addMessage(
      "system",
      "The house interface is active. Jeeves will guide the route when the conversation earns the door."
    );

    runNode(config.initialNode || "intro", { fast: true, silent: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
