// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_SELF_MOUNTING_EXPRESSION_ENGINE_TNT_v7_0_0
// Full-file replacement.
// One Jeeves. One file. No frontbrain. No backbrain. No API dependency.
//
// Purpose:
// - Self-mount the Hearth Jeeves staging interface.
// - Retire dependence on /showroom/globe/hearth/jeeves/index.js.
// - Retire dependence on /api/jeeves.js.
// - Carry Jeeves as Compass guide, Hearth staging guide, and earned-depth Atrium guide.
// - Carry the local repo-aware agent spine.
// - Render message thread, typing dots, timed bubbles, tap-to-advance, options, and route handoffs.
// - Preserve Elara as platform-side border Character for Meet Sean / Nine Summits.
// - Preserve diagnostic restraint: Jeeves routes and explains; he does not diagnose.
//
// Required companion changes after this file:
// - Remove the script tag for /showroom/globe/hearth/jeeves/index.js from index.html.
// - Keep only this file as the Jeeves script.
// - Renew index.css after this if visual polishing is needed.
//

"use strict";

(function mountSelfContainedJeeves(global) {
  const CONTRACT = "HEARTH_JEEVES_SELF_MOUNTING_EXPRESSION_ENGINE_TNT_v7_0_0";
  const VERSION = "7.0.0";

  const SELECTORS = Object.freeze({
    rootCandidates: [
      "#jeevesApp",
      "#hearthJeevesApp",
      "#jeeves-root",
      "#jeevesRoot",
      "[data-jeeves-root]",
      "main",
      "body"
    ]
  });

  const ROUTES = Object.freeze({
    compass: "/showroom/globe/hearth/jeeves/",
    characters: "/characters/",
    meetSean: "/meet-sean-mansfield/",
    nineSummits: "/nine-summits/",
    nineSummitsOfLove: "/nine-summits-of-love/",
    products: "/products/",
    archcoin: "/products/archcoin/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    diagnostic: "/diagnostic/",
    gauges: "/gauges/",
    coherenceGauge: "/gauges/coherence/",
    admissibilityGauge: "/gauges/admissibility/",
    hEarth: "/showroom/globe/h-earth/",
    hEarthGauge: "/gauges/h-earth/",
    frontier: "/explore/frontier/",
    frontierWater: "/explore/frontier/water/",
    frontierVisionRemote: "/explore/frontier/vision-remote/",
    showroom: "/showroom/",
    home: "/"
  });

  const AGENTS = Object.freeze({
    jeeves: Object.freeze({
      id: "jeeves",
      name: "Jeeves",
      title: "Manor Interface",
      role: "Compass guide, Hearth staging guide, and earned-depth Atrium guide.",
      home: ROUTES.characters,
      staging: ROUTES.compass,
      owns: [
        "jeeves",
        "compass",
        "where do i start",
        "where should i go",
        "website",
        "map",
        "manor",
        "estate",
        "atrium",
        "character room",
        "guide",
        "help"
      ]
    }),

    elara: Object.freeze({
      id: "elara",
      aliases: ["elara", "elora", "laura"],
      name: "Elara",
      title: "Signal Bearer",
      role: "Platform-side border Character for Meet Sean, Nine Summits, the book, and the public Mission.",
      home: ROUTES.meetSean,
      secondary: [ROUTES.nineSummits, ROUTES.nineSummitsOfLove],
      owns: [
        "elara",
        "elora",
        "laura",
        "sean",
        "meet sean",
        "nine summits",
        "book",
        "mission",
        "border",
        "threshold",
        "digital platform",
        "digital reality",
        "story",
        "narrative"
      ]
    }),

    auren: Object.freeze({
      id: "auren",
      aliases: ["auren", "aurin", "auren vale", "aurin vale"],
      name: "Auren Vale",
      title: "Sanctuary Builder",
      role: "Products, Arc Coin, value, custody, protection, and sanctuary logic.",
      home: ROUTES.characters,
      secondary: [ROUTES.products, ROUTES.archcoin],
      owns: [
        "auren",
        "aurin",
        "product",
        "products",
        "arc coin",
        "archcoin",
        "coin",
        "value",
        "investment",
        "custody",
        "protection",
        "sanctuary",
        "store"
      ]
    }),

    soren: Object.freeze({
      id: "soren",
      name: "Soren",
      title: "Boundary Keeper",
      role: "Diagnostic threshold, gauges, proof, boundaries, and admissibility.",
      home: ROUTES.characters,
      secondary: [ROUTES.coherenceDiagnostic, ROUTES.gauges],
      owns: [
        "soren",
        "diagnostic",
        "diagnose",
        "diagnosis",
        "coherence",
        "gauge",
        "gauges",
        "proof",
        "boundary",
        "admissibility",
        "score",
        "test",
        "assessment",
        "measure",
        "which character am i",
        "what archetype am i"
      ]
    }),

    dextrion: Object.freeze({
      id: "dextrion",
      aliases: ["dextrion", "dexter"],
      name: "Dextrion",
      title: "Earth-Side Originator",
      role: "H-Earth, lab, anomaly, repair, planet, and technical crossing logic.",
      home: ROUTES.characters,
      secondary: [ROUTES.hEarth, ROUTES.hEarthGauge],
      owns: [
        "dextrion",
        "dexter",
        "h-earth",
        "h earth",
        "lab",
        "anomaly",
        "repair",
        "planet",
        "technical",
        "experiment",
        "earth"
      ]
    }),

    alaric: Object.freeze({
      id: "alaric",
      name: "Alaric",
      title: "Field Navigator",
      role: "Frontier Yard, route choice, navigation, uncertainty, and field direction.",
      home: ROUTES.characters,
      secondary: [ROUTES.frontier],
      owns: [
        "alaric",
        "frontier",
        "yard",
        "navigation",
        "uncertainty",
        "trajectory",
        "route",
        "field",
        "explore"
      ]
    }),

    tarian: Object.freeze({
      id: "tarian",
      name: "Tarian",
      title: "Water Anchor",
      role: "Water, continuity, practical systems, survival, and infrastructure.",
      home: ROUTES.characters,
      secondary: [ROUTES.frontierWater],
      owns: [
        "tarian",
        "water",
        "continuity",
        "survival",
        "infrastructure",
        "systems",
        "hydrology"
      ]
    }),

    remoteTeam: Object.freeze({
      id: "remoteTeam",
      aliases: ["remote team", "distributed team", "field team"],
      name: "Remote Team",
      title: "Distributed Response Unit",
      role: "Distributed field systems, city, climate, deployment, and remote response.",
      home: ROUTES.characters,
      secondary: [ROUTES.frontierVisionRemote],
      owns: [
        "remote",
        "remote team",
        "distributed",
        "city",
        "climate",
        "deployment",
        "field systems",
        "vision remote",
        "response"
      ]
    })
  });

  const STATE = {
    mounted: false,
    root: null,
    shell: null,
    thread: null,
    options: null,
    status: null,
    typing: null,
    skipRequested: false,
    messageCount: 0,
    persistence: 0,
    lastAgentId: "jeeves",
    lastIntent: "",
    activeSequence: Promise.resolve()
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function boot() {
    mount();
  });

  function mount() {
    if (STATE.mounted) return;

    const root = findRoot();
    if (!root) return;

    STATE.root = root;
    STATE.root.innerHTML = "";

    injectBaseClass();
    buildShell(root);
    bindGlobalAdvance();

    STATE.mounted = true;

    runSequence([
      "Good. You found me in Hearth.",
      "This is still the staging chamber, not my final post.",
      "My public work belongs at the Compass. My longer answers belong inside the Character Atrium.",
      "Ask plainly. I will point you to the right room."
    ], buildOpeningOptions());

    announceReady();
  }

  function findRoot() {
    for (const selector of SELECTORS.rootCandidates) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return document.body;
  }

  function injectBaseClass() {
    document.documentElement.classList.add("hearth-jeeves-v7-ready");
    document.body.classList.add("hearth-jeeves-self-mounted");
  }

  function buildShell(root) {
    const shell = document.createElement("section");
    shell.className = "jeeves-v7-shell";
    shell.setAttribute("data-jeeves-contract", CONTRACT);

    shell.innerHTML = [
      '<div class="jeeves-v7-orb" aria-hidden="true">',
      '  <div class="jeeves-v7-orb-core"></div>',
      '</div>',
      '<header class="jeeves-v7-header">',
      '  <p class="jeeves-v7-kicker">Hearth Staging Chamber</p>',
      '  <h1>Jeeves</h1>',
      '  <p class="jeeves-v7-subtitle">Compass guide. Manor interface. Earned-depth Atrium host.</p>',
      '</header>',
      '<div class="jeeves-v7-panel">',
      '  <div class="jeeves-v7-thread" data-jeeves-thread aria-live="polite"></div>',
      '  <div class="jeeves-v7-typing" data-jeeves-typing hidden>',
      '    <span></span><span></span><span></span>',
      '  </div>',
      '  <div class="jeeves-v7-options" data-jeeves-options></div>',
      '</div>',
      '<footer class="jeeves-v7-footer">',
      '  <span data-jeeves-status>Jeeves is ready.</span>',
      '</footer>'
    ].join("");

    root.appendChild(shell);

    STATE.shell = shell;
    STATE.thread = shell.querySelector("[data-jeeves-thread]");
    STATE.typing = shell.querySelector("[data-jeeves-typing]");
    STATE.options = shell.querySelector("[data-jeeves-options]");
    STATE.status = shell.querySelector("[data-jeeves-status]");
  }

  function bindGlobalAdvance() {
    document.addEventListener("click", function handleClick(event) {
      const target = event.target;
      if (target && target.closest && target.closest("[data-jeeves-option], a, button")) return;
      STATE.skipRequested = true;
    });

    document.addEventListener("keydown", function handleKeydown(event) {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        STATE.skipRequested = true;
      }
    });
  }

  function runSequence(messages, options) {
    STATE.activeSequence = STATE.activeSequence.then(async function sequence() {
      clearOptions();
      for (const message of messages) {
        await showTyping();
        await addBubble(message, "jeeves");
        await waitReadable(message);
      }
      renderOptions(options || []);
    });
    return STATE.activeSequence;
  }

  function showTyping() {
    setStatus("Jeeves is choosing his words.");
    STATE.typing.hidden = false;
    return wait(620, true).then(function done() {
      STATE.typing.hidden = true;
    });
  }

  function addBubble(text, speaker) {
    const bubble = document.createElement("article");
    bubble.className = "jeeves-v7-bubble " + (speaker === "visitor" ? "is-visitor" : "is-jeeves");
    bubble.textContent = text;
    STATE.thread.appendChild(bubble);
    STATE.messageCount += 1;
    scrollThread();
    return wait(60, false);
  }

  function renderOptions(options) {
    clearOptions();

    const clean = Array.isArray(options) ? options.filter(Boolean) : [];
    if (!clean.length) return;

    setStatus("Choose a door, or press Jeeves for the longer map.");

    clean.forEach(function eachOption(option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "jeeves-v7-option";
      button.setAttribute("data-jeeves-option", option.id || option.label);
      button.textContent = option.label;
      button.addEventListener("click", function onClick() {
        handleOption(option);
      });
      STATE.options.appendChild(button);
    });

    scrollThread();
  }

  function clearOptions() {
    if (STATE.options) STATE.options.innerHTML = "";
  }

  function handleOption(option) {
    if (!option) return;

    if (option.kind === "route") {
      runSequence(option.beforeRoute || ["Very well. I will open that door."], []);
      setTimeout(function routeLater() {
        global.location.href = option.route;
      }, 900);
      return;
    }

    if (option.kind === "ask") {
      STATE.persistence += option.persistence ? 1 : 0;
      const response = respond(option.intent || option.label || "");
      runSequence(response.messages, response.options);
      return;
    }
  }

  function respond(input) {
    const intent = normalize(input);
    const agent = inferAgent(intent);
    STATE.lastIntent = intent;
    STATE.lastAgentId = agent.id;

    if (isPersistenceIntent(intent)) {
      STATE.persistence += 1;
    }

    if (STATE.persistence >= 2 || /atrium|longer map|trust|inside|deeper/.test(intent)) {
      return {
        messages: [
          "Persistent. Good. Most people take the first door.",
          "You are not asking for a brochure. You are asking for the map behind the map.",
          "I will give you more, but not from the threshold. Meet me inside the Character Atrium."
        ],
        options: [
          routeOption("Enter the Character Atrium", ROUTES.characters, [
            "Very well. Step inside. I will be less brief there."
          ]),
          askOption("Stay at the Compass a moment longer", "compass", false),
          askOption("Why will you not answer everything here?", "why restrained", true)
        ]
      };
    }

    if (isDiagnosticAssessment(intent)) {
      return {
        messages: [
          "No. I will not diagnose you from the doorway.",
          "That restraint is part of the design.",
          "Soren guards the diagnostic threshold. I can take you there, or I can explain why that boundary exists."
        ],
        options: [
          routeOption("Open the Coherence Diagnostic", ROUTES.coherenceDiagnostic),
          routeOption("Open the Proof Gauges", ROUTES.gauges),
          askOption("Why Soren?", "why soren", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (isPlatformRealityIntent(intent)) {
      return {
        messages: [
          "A digital platform is the usable surface: pages, routes, tools, diagnostics, products, and navigation.",
          "A digital reality is the inhabited world revealed through that surface: the Estate, the Manor, Mirrorland, Characters, borders, and rooms.",
          "Elara stands at the border. I stand at the Compass."
        ],
        options: [
          routeOption("Meet Elara at the Border", ROUTES.meetSean),
          routeOption("Open the Nine Summits", ROUTES.nineSummits),
          routeOption("Enter the Character Atrium", ROUTES.characters),
          askOption("Stay with Jeeves", "compass", false)
        ]
      };
    }

    if (agent.id === "elara") {
      return {
        messages: [
          "That belongs with Elara.",
          "She is not hidden deep inside Mirrorland. She stands on the platform side of the border.",
          "Meet Sean and the Nine Summits are where the public site begins to become the narrative construct."
        ],
        options: [
          routeOption("Meet Elara", ROUTES.meetSean),
          routeOption("Open the Nine Summits", ROUTES.nineSummits),
          routeOption("Open Nine Summits of Love", ROUTES.nineSummitsOfLove),
          askOption("Why is Elara at the border?", "why elara border", true)
        ]
      };
    }

    if (agent.id === "auren") {
      return {
        messages: [
          "That is Auren Vale's territory.",
          "Products, Arc Coin, value, custody, and protection belong with the Sanctuary Builder.",
          "I can open that door without pretending it is my room."
        ],
        options: [
          routeOption("Open Products", ROUTES.products),
          routeOption("Open Arc Coin", ROUTES.archcoin),
          askOption("Why Auren?", "why auren", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (agent.id === "soren") {
      return {
        messages: [
          "That is Soren's threshold.",
          "Coherence, proof, gauges, and diagnostic boundaries should not be handled casually from the front step.",
          "I can take you to the right place."
        ],
        options: [
          routeOption("Open the Coherence Diagnostic", ROUTES.coherenceDiagnostic),
          routeOption("Open the Gauges", ROUTES.gauges),
          routeOption("Open the Coherence Gauge", ROUTES.coherenceGauge),
          askOption("Why Soren?", "why soren", true)
        ]
      };
    }

    if (agent.id === "dextrion") {
      return {
        messages: [
          "That points toward Dextrion.",
          "H-Earth, anomaly, repair, and lab logic belong with the Earth-side originator.",
          "I can take you to the H-Earth path."
        ],
        options: [
          routeOption("Open H-Earth", ROUTES.hEarth),
          routeOption("Open H-Earth Gauge", ROUTES.hEarthGauge),
          askOption("Why Dextrion?", "why dextrion", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (agent.id === "alaric") {
      return {
        messages: [
          "That is Frontier territory.",
          "Alaric handles uncertainty, route choice, and the field beyond the settled rooms.",
          "I can point you to the Frontier Yard."
        ],
        options: [
          routeOption("Open the Frontier Yard", ROUTES.frontier),
          askOption("Why Alaric?", "why alaric", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (agent.id === "tarian") {
      return {
        messages: [
          "Water is not a side matter here.",
          "Tarian carries continuity, survival systems, and the practical infrastructure below the surface.",
          "I can take you to that path."
        ],
        options: [
          routeOption("Open the Water Path", ROUTES.frontierWater),
          askOption("Why Tarian?", "why tarian", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (agent.id === "remoteTeam") {
      return {
        messages: [
          "That belongs with the Remote Team.",
          "Distributed field systems, city response, climate, and deployment require a different kind of guide.",
          "I can open the remote field path."
        ],
        options: [
          routeOption("Open the Remote Field Path", ROUTES.frontierVisionRemote),
          askOption("Why the Remote Team?", "why remote team", true),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (/why restrained|why will you not answer|why not answer|why doorway/.test(intent)) {
      return {
        messages: [
          "Because the Estate has order.",
          "I know more than I reveal at the Compass, but the answer is often a room, not a speech.",
          "If you keep pressing, I will invite you inside. That is different from flooding the doorway."
        ],
        options: [
          askOption("I am pressing. Give me the longer map.", "longer map", true),
          routeOption("Enter the Character Atrium", ROUTES.characters),
          askOption("Return to the Compass", "compass", false)
        ]
      };
    }

    if (/compass|start|begin|lost|where|help|guide/.test(intent)) {
      return {
        messages: [
          "Then start cleanly.",
          "Elara handles Sean and the Nine Summits border. Soren handles the diagnostic threshold. Auren handles value. Dextrion handles H-Earth. Alaric handles the Frontier. Tarian handles water. The Remote Team handles distributed field systems.",
          "I am the Compass. Choose a door."
        ],
        options: buildOpeningOptions()
      };
    }

    return {
      messages: [
        "That question has a door.",
        "I can keep this simple: tell me whether you want the public path, the border, the diagnostic threshold, the Character Atrium, or the Frontier.",
        "The Estate is large. The sequence matters."
      ],
      options: buildOpeningOptions()
    };
  }

  function buildOpeningOptions() {
    return [
      routeOption("Meet Elara at the Border", ROUTES.meetSean),
      routeOption("Enter the Character Atrium", ROUTES.characters),
      routeOption("Open the Coherence Diagnostic", ROUTES.coherenceDiagnostic),
      routeOption("Open Products / Arc Coin", ROUTES.products),
      routeOption("Open H-Earth", ROUTES.hEarth),
      askOption("Ask Jeeves for the longer map", "longer map", true)
    ];
  }

  function inferAgent(intent) {
    const text = normalize(intent);

    const orderedAgents = [
      AGENTS.elara,
      AGENTS.soren,
      AGENTS.auren,
      AGENTS.dextrion,
      AGENTS.alaric,
      AGENTS.tarian,
      AGENTS.remoteTeam
    ];

    for (const agent of orderedAgents) {
      const terms = []
        .concat(agent.owns || [])
        .concat(agent.aliases || [])
        .concat([agent.name || "", agent.title || ""]);

      for (const term of terms) {
        if (term && text.includes(normalize(term))) return agent;
      }
    }

    return AGENTS.jeeves;
  }

  function routeOption(label, route, beforeRoute) {
    return {
      id: slug(label),
      kind: "route",
      label,
      route,
      beforeRoute: beforeRoute || ["Very well. I will open that door."]
    };
  }

  function askOption(label, intent, persistence) {
    return {
      id: slug(label),
      kind: "ask",
      label,
      intent,
      persistence: Boolean(persistence)
    };
  }

  function isPersistenceIntent(intent) {
    return /why|more|longer|deeper|again|not enough|press|persistent|trust|inside|atrium|map behind/.test(normalize(intent));
  }

  function isDiagnosticAssessment(intent) {
    return /diagnose me|assess me|score me|classify me|which character am i|what archetype am i|test me|coherence score/.test(normalize(intent));
  }

  function isPlatformRealityIntent(intent) {
    return /digital platform|digital reality|platform.*reality|website.*world|mirrorland.*border|narrative construct/.test(normalize(intent));
  }

  function waitReadable(message) {
    const length = String(message || "").length;
    const duration = Math.min(2600, Math.max(900, 450 + length * 22));
    return wait(duration, true);
  }

  function wait(ms, skippable) {
    return new Promise(function resolveLater(resolve) {
      const start = Date.now();

      function tick() {
        if (skippable && STATE.skipRequested) {
          STATE.skipRequested = false;
          resolve();
          return;
        }

        if (Date.now() - start >= ms) {
          resolve();
          return;
        }

        setTimeout(tick, 40);
      }

      tick();
    });
  }

  function scrollThread() {
    if (!STATE.thread) return;
    STATE.thread.scrollTop = STATE.thread.scrollHeight;
  }

  function setStatus(text) {
    if (STATE.status) STATE.status.textContent = text;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function slug(value) {
    return String(value || "option")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64);
  }

  function announceReady() {
    global.HEARTH_JEEVES_EXPRESSION = API;
    global.HEARTH_JEEVES_EXPRESSION_BRIDGE = API;
    global.HEARTH = global.HEARTH || {};
    global.HEARTH.jeevesExpression = API;

    if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("hearth:jeeves-expression-ready", {
        detail: {
          contract: CONTRACT,
          version: VERSION,
          selfMounting: true,
          noFrontbrain: true,
          noBackbrain: true,
          noApiDependency: true,
          oneFileJeeves: true
        }
      }));
    }
  }

  const API = Object.freeze({
    contract: CONTRACT,
    version: VERSION,
    routes: ROUTES,
    agents: AGENTS,

    mount,
    respond,
    inferAgent,

    selfMounting: true,
    oneFileJeeves: true,
    frontbrainRequired: false,
    backbrainRequired: false,
    apiRequired: false,

    compassAuthority: true,
    hearthStagingAuthority: true,
    atriumEscalationAuthority: true,
    diagnosticRestraint: true,

    shapeConversationFrame: function shapeConversationFrame(frame, context) {
      const source = frame && typeof frame === "object" ? frame : {};
      const intent = source.intent || source.prompt || source.text || "";
      const response = respond(intent);
      return {
        ...source,
        bubbles: response.messages,
        options: response.options,
        expressionContract: CONTRACT,
        selfMounting: true
      };
    },

    shapeInterfaceState: function shapeInterfaceState(stateName) {
      const key = normalize(stateName);
      if (key.includes("typing")) return "Jeeves is choosing his words.";
      if (key.includes("listening")) return "Jeeves is listening.";
      if (key.includes("reading")) return "Jeeves is letting that settle.";
      return "Jeeves is ready.";
    }
  });

  global.HEARTH_JEEVES_EXPRESSION = API;
  global.HEARTH_JEEVES_EXPRESSION_BRIDGE = API;
  global.HEARTH = global.HEARTH || {};
  global.HEARTH.jeevesExpression = API;
})(typeof window !== "undefined" ? window : globalThis);
