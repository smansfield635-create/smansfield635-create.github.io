// TARGET FILE: /assets/hearth/jeeves/jeeves.expression.js
// TNT FULL-FILE REPLACEMENT
// DIAMOND_GATE_BRIDGE_JEEVES_LEGACY_EXPRESSION_COMPATIBILITY_BRIDGE_TNT_v8_0_0
//
// Purpose:
// - Preserve the legacy Jeeves expression globals and callable surfaces.
// - Delegate canonical identity, personality, dialogue, routes, pathways,
//   agents, registers, and public-language authority to window.JEEVES_VOICE.
// - Translate legacy Hearth-era frame requests into the renewed
//   Welcome and Routing Guide architecture.
// - Preserve source-target and conversation-coordinate continuity where
//   legacy callers still depend on those values.
// - Preserve diagnostic restraint.
// - Preserve public route execution as an external responsibility.
// - Prevent legacy callers from reasserting Hearth as Jeeves's home,
//   Jeeves as Manor Interface, whole-House ownership, or earned Atrium depth.
//
// Canonical upstream authority:
// - /assets/hearth/jeeves/jeeves.voice.js
// - window.JEEVES_VOICE
//
// Legacy exports preserved:
// - window.HEARTH_JEEVES_EXPRESSION
// - window.HEARTH_JEEVES_EXPRESSION_BRIDGE
// - window.HEARTH.jeevesExpression
//
// Legacy ready event preserved:
// - hearth:jeeves-expression-ready
//
// Renewed ready event:
// - jeeves:expression-bridge-ready
//
// Does not own:
// - Jeeves's canonical identity
// - Jeeves's dialogue text
// - specialist ownership
// - DOM rendering
// - CSS
// - timers
// - reading rhythm
// - route execution
// - diagnostic interpretation
// - product implementation
// - protected architecture
//

"use strict";

(function attachJeevesExpressionCompatibilityBridge(global) {
  const CONTRACT =
    "DIAMOND_GATE_BRIDGE_JEEVES_LEGACY_EXPRESSION_COMPATIBILITY_BRIDGE_TNT_v8_0_0";

  const PREVIOUS_CONTRACT =
    "HEARTH_JEEVES_HOME_INSIDE_MIRRORLAND_EXPRESSION_TNT_v7_1_0";

  const VERSION =
    "8.0.0";

  const CANONICAL_GLOBAL =
    "JEEVES_VOICE";

  const VOICE_READY_EVENT =
    "jeeves:voice-ready";

  const BRIDGE_READY_EVENT =
    "jeeves:expression-bridge-ready";

  const LEGACY_READY_EVENT =
    "hearth:jeeves-expression-ready";

  if (
    Object.prototype.hasOwnProperty.call(
      global,
      "HEARTH_JEEVES_EXPRESSION"
    ) &&
    global.HEARTH_JEEVES_EXPRESSION &&
    global.HEARTH_JEEVES_EXPRESSION.contract === CONTRACT
  ) {
    return;
  }

  const safeText = value => {
    if (
      value === null ||
      typeof value === "undefined"
    ) {
      return "";
    }

    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  };

  const safeNumber = (
    value,
    fallback = 0
  ) => {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : Number(fallback || 0);
  };

  const clone = value => {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clone);
    }

    const output = {};

    Object.keys(value)
      .forEach(key => {
        output[key] =
          clone(value[key]);
      });

    return output;
  };

  const deepFreeze = value => {
    if (
      !value ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.freeze(value);

    Object.getOwnPropertyNames(value)
      .forEach(key => {
        deepFreeze(
          value[key]
        );
      });

    return value;
  };

  const dedupeStrings = values => {
    const seen =
      new Set();

    const output = [];

    (
      Array.isArray(values)
        ? values
        : []
    ).forEach(value => {
      const text =
        safeText(value);

      if (
        !text ||
        seen.has(text)
      ) {
        return;
      }

      seen.add(text);
      output.push(text);
    });

    return output;
  };

  const dedupeObjects = (
    values,
    keyBuilder
  ) => {
    const seen =
      new Set();

    const output = [];

    (
      Array.isArray(values)
        ? values
        : []
    ).forEach(value => {
      if (
        !value ||
        typeof value !== "object"
      ) {
        return;
      }

      const key =
        safeText(
          typeof keyBuilder === "function"
            ? keyBuilder(value)
            : JSON.stringify(value)
        );

      if (
        !key ||
        seen.has(key)
      ) {
        return;
      }

      seen.add(key);
      output.push(value);
    });

    return output;
  };

  const getVoice = () => {
    const voice =
      global[CANONICAL_GLOBAL];

    if (
      !voice ||
      voice.ready !== true
    ) {
      return null;
    }

    return voice;
  };

  const getVoiceValue = (
    key,
    fallback
  ) => {
    const voice =
      getVoice();

    if (
      !voice ||
      typeof voice[key] ===
        "undefined"
    ) {
      return fallback;
    }

    return voice[key];
  };

  const TARGETS = deepFreeze({
    DIAMOND_GATE_OVERVIEW:
      "overview",

    SPLIT_INTERFACE:
      "platform",

    TRADITIONAL_WEBSITE:
      "site_guide",

    NARRATIVE_PATH:
      "story_world",

    MISSION_OVERVIEW:
      "mission",

    MISSION_INNER:
      "human_story",

    MISSION_COMMUNITY:
      "human_story",

    MISSION_COLLABORATION:
      "human_story",

    PRACTICAL_RELEVANCE:
      "products",

    DIAGNOSTIC_REFERRAL:
      "self_understanding",

    DIAGNOSTIC:
      "self_understanding",

    CHARACTER_MIRROR:
      "characters",

    MIRRORLAND:
      "story_world",

    ATRIUM:
      "showroom",

    HEARTH:
      "overview",

    FRONTIER:
      "frontier",

    SCIENTIFIC_LAW:
      "laws",

    TRADITIONAL_COMPASS:
      "compass",

    SITE_GUIDE:
      "site_guide",

    PRODUCTS:
      "products",

    LAWS:
      "laws",

    GAUGES:
      "gauges",

    SEAN:
      "human_story",

    UNDERDOG:
      "human_story",

    CHARACTERS:
      "characters",

    RECENTER:
      "compass",

    CLEAN_DOOR:
      "direct_path",

    RETURN_FORK:
      "compass",

    RESTART_FORK:
      "overview",

    SHARP_QUESTION:
      "clarification"
  });

  const ROUTES = deepFreeze({
    HOME:
      "home",

    COMPASS:
      "compass",

    SITE_GUIDE:
      "siteGuide",

    COHERENCE_DIAGNOSTIC:
      "diagnostic",

    DIAGNOSTIC:
      "diagnostic",

    MEET_SEAN:
      "meetSean",

    PRODUCTS:
      "products",

    ARCHCOIN:
      "archcoin",

    LAWS:
      "laws",

    SCIENTIFIC_LAW:
      "scientificLaw",

    GAUGES:
      "gauges",

    SHOWROOM:
      "showroom",

    HEARTH:
      "siteGuide",

    MIRRORLAND:
      "showroom",

    ZIONTS:
      "zionts",

    AUDRALIA:
      "audralia",

    H_EARTH:
      "hEarth",

    FRONTIER:
      "frontier",

    FRONTIER_ENERGY:
      "frontier",

    FRONTIER_WATER:
      "frontierWater",

    FRONTIER_WASTE:
      "frontier",

    FRONTIER_CLOSED_LOOP:
      "frontier",

    FRONTIER_INFRASTRUCTURE:
      "frontier",

    FRONTIER_LATTICE:
      "frontier",

    FRONTIER_URBAN:
      "remoteField",

    FRONTIER_MANUAL:
      "frontier",

    FRONTIER_SHIMMER:
      "frontier",

    FRONTIER_TRAJECTORY:
      "frontierTrajectory",

    FRONTIER_VISION:
      "remoteField",

    CHARACTERS:
      "characters",

    CONTROL_ROOM:
      "controlRoom",

    NINE_SUMMITS:
      "nineSummits",

    NINE_SUMMITS_OF_LOVE:
      "book",

    ABOUT_UNDERDOG:
      "underdog",

    ELARA:
      "elara",

    AUREN:
      "auren",

    SOREN:
      "soren"
  });

  const FALLBACK_ROUTE_URLS = deepFreeze({
    home:
      "/home/",

    compass:
      "/",

    siteGuide:
      "/site-guide/",

    diagnostic:
      "/coherence-diagnostic/",

    meetSean:
      "/meet-sean-mansfield/",

    products:
      "/products/",

    archcoin:
      "/products/archcoin/",

    laws:
      "/laws/",

    scientificLaw:
      "/laws/",

    gauges:
      "/gauges/",

    showroom:
      "/showroom/",

    zionts:
      "/showroom/globe/earth/",

    audralia:
      "/showroom/globe/audralia/",

    hEarth:
      "/showroom/globe/h-earth/",

    frontier:
      "/explore/frontier/",

    frontierWater:
      "/explore/frontier/water/",

    frontierTrajectory:
      "/explore/frontier/",

    remoteField:
      "/explore/frontier/vision-remote/",

    characters:
      "/characters/",

    controlRoom:
      "/showroom/globe/audralia/disposition/",

    nineSummits:
      "/nine-summits/",

    book:
      "/nine-summits-of-love/",

    underdog:
      "/about-this-underdog/",

    elara:
      "/elara/index.html",

    auren:
      "/products/auren/",

    soren:
      "/coherence-diagnostic/"
  });

  const ENTRY_STACK_MODES = deepFreeze({
    ENTRANCE:
      "entrance",

    GUIDED_CHOOSER:
      "guidedChooser",

    PATH_SAMPLE:
      "pathSample",

    BASE_POOL:
      "basePool",

    DIG_DEEPER:
      "clarification",

    PREPARED_DOOR:
      "preparedDoor",

    RETURN:
      "return"
  });

  const BASE_POOL_MODES = deepFreeze({
    NONE:
      "none",

    ESTATE_OVERVIEW:
      "overview",

    GUIDED_CHOOSER:
      "guidedChooser",

    PUBLIC_MAP:
      "publicMap",

    NARRATIVE_PATH:
      "storyWorld",

    MISSION:
      "mission",

    INNER_MISSION:
      "humanStory",

    COMMUNITY_MISSION:
      "humanStory",

    COLLABORATION_MISSION:
      "humanStory",

    PRACTICAL:
      "products",

    DIAGNOSTIC:
      "diagnostic",

    CHARACTER:
      "characters",

    MIRRORLAND:
      "storyWorld",

    HEARTH:
      "overview",

    FRONTIER:
      "frontier",

    SCIENTIFIC_LAW:
      "laws",

    PRODUCTS:
      "products",

    GAUGES:
      "gauges",

    JEEVES_ATRIUM:
      "clarification"
  });

  const ILLUMINATION_MODES = deepFreeze({
    THRESHOLD:
      "threshold",

    PUBLIC:
      "public",

    BORDER:
      "handoff",

    MIRRORLAND:
      "storyWorld",

    COMPASS:
      "publicMap",

    HEARTH:
      "welcome",

    ATRIUM:
      "clarification",

    DIAGNOSTIC_BOUNDARY:
      "diagnosticBoundary"
  });

  const GATES = deepFreeze({
    ENTRANCE:
      "entrance",

    BASE_POOL:
      "orientation",

    CHOICE_CLOSURE:
      "clarification",

    PREPARED_DOOR:
      "handoff",

    RETURN:
      "return",

    DIAGNOSTIC_BOUNDARY:
      "boundary",

    TRUST_ESCALATION:
      "clarification"
  });

  const SOURCE_STABILITY_LAW = deepFreeze({
    preserveSourceTarget:
      true,

    preserveActiveTarget:
      true,

    preserveSelectedTarget:
      true,

    preserveConversationCoordinate:
      true,

    expressionMayShapePublicLanguage:
      true,

    expressionMayNotInventRouteExecution:
      true,

    expressionMayNotDiagnoseVisitor:
      true,

    expressionMayNotRenameCanonicalRooms:
      true,

    expressionMayNotCreateIdentityAuthority:
      true,

    canonicalVoiceRequiredForIdentity:
      true
  });

  const ROOM_IDENTITY = deepFreeze({
    publicName:
      "Jeeves",

    houseRole:
      "Welcome and Routing Guide for Diamond Gate Bridge",

    compassRelation:
      "Compass remains a public entrance. Jeeves is an optional guide, not a required gate.",

    publicEntryPhrase:
      "Talk to Jeeves",

    exitLaw:
      "A proper guide always leaves direct public paths visible.",

    route:
      ROUTES.SITE_GUIDE,

    routeUrl:
      FALLBACK_ROUTE_URLS.siteGuide,

    deeperArchitectureRoute:
      ROUTES.SHOWROOM,

    deeperArchitectureRouteUrl:
      FALLBACK_ROUTE_URLS.showroom,

    characterRosterRoute:
      ROUTES.CHARACTERS,

    characterRosterRouteUrl:
      FALLBACK_ROUTE_URLS.characters,

    hearthIsCanonicalHome:
      false,

    atriumIsEarnedDepth:
      false
  });

  const OPENING_SEQUENCE = deepFreeze([
    "Welcome to Diamond Gate Bridge.",
    "Tell me what brought you here, and I will introduce the room or guide that should take it further."
  ]);

  const RETIRED_OPENING_SEQUENCE = deepFreeze([
    "Welcome inside the House.",
    "You found me through the Compass.",
    "This is Hearth.",
    "This is my room inside Mirrorland.",
    "Ask for the longer map."
  ]);

  const INTERFACE_STATE_COPY = deepFreeze({
    listening:
      "Jeeves is listening.",

    typing:
      "Jeeves is responding.",

    reading:
      "Jeeves is letting that settle.",

    ready:
      "Jeeves is ready.",

    idle:
      "Jeeves is waiting.",

    handoff:
      "Jeeves found the right door.",

    boundary:
      "Jeeves is protecting the boundary."
  });

  const FALLBACK_AGENTS = deepFreeze({
    jeeves: {
      id:
        "jeeves",

      name:
        "Jeeves",

      role:
        "Welcome and Routing Guide",

      route:
        null,

      summary:
        "First-contact welcome, visitor orientation, route recognition, and specialist handoff."
    },

    elara: {
      id:
        "elara",

      name:
        "Elara",

      role:
        "Signal Bearer",

      route:
        "elara",

      summary:
        "Human meaning, Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate."
    },

    auren: {
      id:
        "auren",

      name:
        "Auren",

      role:
        "Practical Systems Guide",

      route:
        "auren",

      summary:
        "Products, Education, practical value, custody, and implementation."
    },

    soren: {
      id:
        "soren",

      name:
        "Soren",

      role:
        "Diagnostic Guide",

      route:
        "soren",

      summary:
        "Diagnostic boundaries, evidence, structural interpretation, and assessment."
    },

    dextrion: {
      id:
        "dextrion",

      name:
        "Dextrion",

      role:
        "Technical Repair Guide",

      route:
        "hEarth",

      summary:
        "H-Earth, anomaly, repair, experimental crossing, and technical systems."
    },

    alaric: {
      id:
        "alaric",

      name:
        "Alaric",

      role:
        "Frontier Navigator",

      route:
        "frontier",

      summary:
        "Frontier uncertainty, navigation, trajectory, and pathfinding."
    },

    tarian: {
      id:
        "tarian",

      name:
        "Tarian",

      role:
        "Water and Continuity Guide",

      route:
        "frontierWater",

      summary:
        "Water, hydrology, survival systems, continuity, and infrastructure."
    },

    remoteTeam: {
      id:
        "remoteTeam",

      name:
        "Remote Team",

      role:
        "Distributed Field Unit",

      route:
        "remoteField",

      summary:
        "Cities, climate, deployment, distributed systems, and remote response."
    }
  });

  const FALLBACK_KEYWORDS = deepFreeze({
    elara: [
      "sean",
      "mission",
      "book",
      "nine summits",
      "love",
      "human story",
      "human meaning",
      "mirrorland climate"
    ],

    soren: [
      "diagnostic",
      "diagnose",
      "assessment",
      "coherence",
      "gauge",
      "proof",
      "score",
      "test",
      "measure",
      "understand myself"
    ],

    auren: [
      "product",
      "products",
      "education",
      "arc coin",
      "archcoin",
      "custody",
      "implementation",
      "practical system"
    ],

    dextrion: [
      "h-earth",
      "h earth",
      "anomaly",
      "repair",
      "lab",
      "technical",
      "experiment"
    ],

    alaric: [
      "frontier",
      "navigation",
      "uncertainty",
      "trajectory",
      "pathfinding"
    ],

    tarian: [
      "water",
      "hydrology",
      "continuity",
      "survival",
      "infrastructure"
    ],

    remoteTeam: [
      "remote",
      "distributed",
      "city",
      "climate",
      "deployment",
      "field response"
    ]
  });

  const getRouteTable = () => {
    return getVoiceValue(
      "routes",
      {}
    );
  };

  const getAgentTable = () => {
    return getVoiceValue(
      "agents",
      FALLBACK_AGENTS
    );
  };

  const getRoute = routeId => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.getRoute ===
        "function"
    ) {
      const direct =
        voice.getRoute(
          routeId
        );

      if (direct) {
        return direct;
      }
    }

    const source =
      safeText(routeId);

    const routeTable =
      getRouteTable();

    if (
      Object.prototype.hasOwnProperty.call(
        routeTable,
        source
      )
    ) {
      return routeTable[source];
    }

    const legacyKey =
      Object.keys(ROUTES)
        .find(key => {
          return (
            ROUTES[key] === source ||
            key === source
          );
        });

    if (legacyKey) {
      const canonicalKey =
        ROUTES[legacyKey];

      if (
        Object.prototype.hasOwnProperty.call(
          routeTable,
          canonicalKey
        )
      ) {
        return routeTable[canonicalKey];
      }

      return {
        id:
          canonicalKey,

        label:
          shapeRouteLabel(
            canonicalKey,
            "Continue"
          ),

        href:
          FALLBACK_ROUTE_URLS[
            canonicalKey
          ] || "",

        owner:
          "Diamond Gate Bridge",

        purpose:
          "Continue to the selected public destination."
      };
    }

    const matched =
      Object.keys(routeTable)
        .map(key => routeTable[key])
        .find(route => {
          return (
            route &&
            (
              route.id === source ||
              route.href === source
            )
          );
        });

    return matched || null;
  };

  const getRouteKey = route => {
    if (!route) {
      return "";
    }

    const routeTable =
      getRouteTable();

    const matched =
      Object.keys(routeTable)
        .find(key => {
          return (
            routeTable[key] === route ||
            (
              routeTable[key] &&
              routeTable[key].id ===
                route.id
            )
          );
        });

    if (matched) {
      return matched;
    }

    const legacyMatched =
      Object.keys(ROUTES)
        .find(key => {
          return (
            ROUTES[key] ===
              route.id
          );
        });

    return legacyMatched
      ? ROUTES[legacyMatched]
      : safeText(route.id);
  };

  const getRouteUrlMap = () => {
    const output = {
      ...FALLBACK_ROUTE_URLS
    };

    const routeTable =
      getRouteTable();

    Object.keys(routeTable)
      .forEach(key => {
        const route =
          routeTable[key];

        if (
          route &&
          route.href
        ) {
          output[key] =
            route.href;

          if (route.id) {
            output[route.id] =
              route.href;
          }
        }
      });

    return output;
  };

  const sanitizePublicText = text => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.sanitizePublicText ===
        "function"
    ) {
      return voice.sanitizePublicText(
        text
      );
    }

    return safeText(text)
      .replace(
        /Welcome inside the House\.?/gi,
        "Welcome to Diamond Gate Bridge."
      )
      .replace(
        /You found me through the Compass\.?/gi,
        ""
      )
      .replace(
        /This is Hearth\.?/gi,
        ""
      )
      .replace(
        /Jeeves'? room inside Mirrorland/gi,
        "Jeeves's public welcome surface"
      )
      .replace(
        /Manor Interface/gi,
        "Welcome and Routing Guide"
      )
      .replace(
        /whole-House map/gi,
        "public route map"
      )
      .replace(
        /complete House map/gi,
        "public route map"
      )
      .replace(
        /earned depth/gi,
        "deeper public context"
      )
      .replace(
        /persistent visitors/gi,
        "visitors seeking more context"
      )
      .replace(
        /meet me in the Atrium/gi,
        "open the Showroom"
      )
      .replace(
        /the longer map/gi,
        "the public map"
      )
      .replace(
        /Hearth is where the House answers/gi,
        "Jeeves can help identify the next public route"
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  };

  const softenDiagnosticAssessmentLanguage =
    text => {
      return sanitizePublicText(
        text
      )
        .replace(
          /I can diagnose/gi,
          "I can route"
        )
        .replace(
          /I will assess/gi,
          "I can direct you toward"
        )
        .replace(
          /I can classify/gi,
          "I can route"
        )
        .replace(
          /I will score/gi,
          "I can direct you toward the diagnostic"
        );
    };

  const isDiagnosticAssessmentRequest =
    text => {
      return /diagnose me|assess me|score me|what archetype am i|which character am i|classify me|test me|coherence score|rate me/i.test(
        safeText(text)
      );
    };

  const isDiagnosticExplanationRequest =
    text => {
      return /what is the diagnostic|explain.*diagnostic|how.*diagnostic|why.*diagnostic/i.test(
        safeText(text)
      );
    };

  const isPlatformRealityRequest =
    text => {
      return /digital platform|digital reality|website.*world|platform.*reality|mirrorland.*border/i.test(
        safeText(text)
      );
    };

  const isWhereAmIRequest =
    text => {
      return /where am i|what is this place|what page|what room|where are we/i.test(
        safeText(text)
      );
    };

  const isHouseRequest =
    text => {
      return /what is the house|explain the house|talk to the house|inside the house|house mean/i.test(
        safeText(text)
      );
    };

  const isMirrorlandRequest =
    text => {
      return /what is mirrorland|explain mirrorland|mirrorland mean|inside mirrorland|story world/i.test(
        safeText(text)
      );
    };

  const isGuidedChooserRequest = (
    target,
    intent,
    context
  ) => {
    return /where|begin|start|choose|guide|compass|lost|map|show me around/i.test(
      [
        safeText(target),
        safeText(intent),
        safeText(
          context &&
          context.text
        ),
        safeText(
          context &&
          context.prompt
        )
      ].join(" ")
    );
  };

  const isTrueGuidedChooser =
    isGuidedChooserRequest;

  const isGuidedLabel =
    label => {
      return /where|begin|start|guide|choose|compass|map|show me around/i.test(
        safeText(label)
      );
    };

  const shouldTriggerAtriumBackdoor =
    () => false;

  const shouldUseTrainingWheels =
    context => {
      return Boolean(
        context &&
        (
          context.firstVisit ||
          context.entryStackMode ===
            ENTRY_STACK_MODES.ENTRANCE
        )
      );
    };

  const inferAgent = (
    target,
    intent,
    context,
    frame
  ) => {
    const voice =
      getVoice();

    const input = {
      target:
        safeText(target),

      intent:
        safeText(intent),

      text:
        safeText(
          context &&
          context.text
        ),

      prompt:
        safeText(
          context &&
          context.prompt
        ),

      framePrompt:
        safeText(
          frame &&
          frame.prompt
        ),

      userText:
        safeText(
          frame &&
          frame.userText
        )
    };

    if (
      voice &&
      typeof voice.inferAgent ===
        "function"
    ) {
      const inferred =
        voice.inferAgent(input);

      if (inferred) {
        return inferred;
      }
    }

    const haystack =
      Object.values(input)
        .join(" ")
        .toLowerCase();

    const agents =
      getAgentTable();

    const orderedIds = [
      "elara",
      "soren",
      "auren",
      "dextrion",
      "alaric",
      "tarian",
      "remoteTeam"
    ];

    for (
      let index = 0;
      index <
      orderedIds.length;
      index += 1
    ) {
      const agentId =
        orderedIds[index];

      const agent =
        agents[agentId] ||
        FALLBACK_AGENTS[agentId];

      const terms =
        agent &&
        Array.isArray(agent.owns)
          ? agent.owns
          : FALLBACK_KEYWORDS[
              agentId
            ] || [];

      const matched =
        terms.some(term => {
          return haystack.includes(
            safeText(term)
              .toLowerCase()
          );
        });

      if (matched) {
        return agent;
      }

      const fallbackMatched =
        (
          FALLBACK_KEYWORDS[
            agentId
          ] || []
        ).some(term => {
          return haystack.includes(
            safeText(term)
              .toLowerCase()
          );
        });

      if (fallbackMatched) {
        return agent;
      }
    }

    return (
      agents.jeeves ||
      FALLBACK_AGENTS.jeeves
    );
  };

  const inferRouteFromIntent = input => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.inferRouteFromIntent ===
        "function"
    ) {
      const inferred =
        voice.inferRouteFromIntent(
          input
        );

      if (inferred) {
        return inferred;
      }
    }

    const source =
      safeText(
        typeof input === "string"
          ? input
          : [
              input &&
              input.target,
              input &&
              input.intent,
              input &&
              input.text,
              input &&
              input.prompt
            ]
              .filter(Boolean)
              .join(" ")
      ).toLowerCase();

    const agent =
      inferAgent(
        "",
        source,
        input,
        {}
      );

    if (
      agent &&
      agent.route
    ) {
      return getRoute(
        agent.route
      );
    }

    if (
      /character|roster|portrait/.test(
        source
      )
    ) {
      return getRoute(
        ROUTES.CHARACTERS
      );
    }

    if (
      /law|standard|governance/.test(
        source
      )
    ) {
      return getRoute(
        ROUTES.LAWS
      );
    }

    if (
      /gauge|measurement|proof/.test(
        source
      )
    ) {
      return getRoute(
        ROUTES.GAUGES
      );
    }

    if (
      /mirrorland|story world|showroom/.test(
        source
      )
    ) {
      return getRoute(
        ROUTES.SHOWROOM
      );
    }

    return getRoute(
      ROUTES.SITE_GUIDE
    );
  };

  const inferRouteIdFromTarget = (
    target,
    basePoolMode,
    intent
  ) => {
    const source =
      [
        safeText(target),
        safeText(basePoolMode),
        safeText(intent)
      ]
        .join(" ")
        .toLowerCase();

    if (
      /site.?guide|website guide|public map/.test(
        source
      )
    ) {
      return ROUTES.SITE_GUIDE;
    }

    if (
      /compass|recenter|return/.test(
        source
      )
    ) {
      return ROUTES.COMPASS;
    }

    if (
      /diagnostic|coherence|assess|score|soren/.test(
        source
      )
    ) {
      return ROUTES.DIAGNOSTIC;
    }

    if (
      /sean|human story/.test(
        source
      )
    ) {
      return ROUTES.MEET_SEAN;
    }

    if (
      /nine summits of love|book/.test(
        source
      )
    ) {
      return ROUTES.NINE_SUMMITS_OF_LOVE;
    }

    if (
      /nine summits/.test(
        source
      )
    ) {
      return ROUTES.NINE_SUMMITS;
    }

    if (
      /auren/.test(
        source
      )
    ) {
      return ROUTES.AUREN;
    }

    if (
      /product/.test(
        source
      )
    ) {
      return ROUTES.PRODUCTS;
    }

    if (
      /archcoin|arc coin/.test(
        source
      )
    ) {
      return ROUTES.ARCHCOIN;
    }

    if (
      /law|scientific/.test(
        source
      )
    ) {
      return ROUTES.LAWS;
    }

    if (
      /gauge|measurement|proof/.test(
        source
      )
    ) {
      return ROUTES.GAUGES;
    }

    if (
      /showroom|mirrorland|atrium|story world/.test(
        source
      )
    ) {
      return ROUTES.SHOWROOM;
    }

    if (
      /h-earth|h earth|dextrion|technical|repair|lab/.test(
        source
      )
    ) {
      return ROUTES.H_EARTH;
    }

    if (
      /water|tarian|hydrology/.test(
        source
      )
    ) {
      return ROUTES.FRONTIER_WATER;
    }

    if (
      /remote|climate|deployment|city/.test(
        source
      )
    ) {
      return ROUTES.FRONTIER_VISION;
    }

    if (
      /frontier|alaric|trajectory|uncertainty/.test(
        source
      )
    ) {
      return ROUTES.FRONTIER;
    }

    if (
      /character|roster|portrait/.test(
        source
      )
    ) {
      return ROUTES.CHARACTERS;
    }

    if (
      /elara|mission|human meaning/.test(
        source
      )
    ) {
      return ROUTES.ELARA;
    }

    return ROUTES.SITE_GUIDE;
  };

  const inferBasePoolMode = (
    target,
    intent,
    context
  ) => {
    const source =
      [
        safeText(target),
        safeText(intent),
        safeText(
          context &&
          context.text
        ),
        safeText(
          context &&
          context.prompt
        )
      ]
        .join(" ")
        .toLowerCase();

    if (
      /diagnostic|coherence|gauge|proof|assess|score|test|classify/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.DIAGNOSTIC;
    }

    if (
      /sean|summit|book|mission|elara|human story|human meaning/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.MISSION;
    }

    if (
      /product|archcoin|arc coin|auren|value|custody|implementation/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.PRODUCTS;
    }

    if (
      /character|portrait|roster/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.CHARACTER;
    }

    if (
      /mirrorland|narrative|story world|showroom/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.NARRATIVE_PATH;
    }

    if (
      /frontier|water|remote|climate|field|tarian|alaric|deployment/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.FRONTIER;
    }

    if (
      /law|scientific|governance|standard/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.SCIENTIFIC_LAW;
    }

    if (
      /website|map|guide|compass|return|where to begin|show me around/.test(
        source
      )
    ) {
      return BASE_POOL_MODES.PUBLIC_MAP;
    }

    return BASE_POOL_MODES.ESTATE_OVERVIEW;
  };

  const inferIlluminationMode = (
    target,
    intent,
    context,
    basePoolMode
  ) => {
    if (
      basePoolMode ===
      BASE_POOL_MODES.MISSION
    ) {
      return ILLUMINATION_MODES.BORDER;
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.DIAGNOSTIC
    ) {
      return ILLUMINATION_MODES
        .DIAGNOSTIC_BOUNDARY;
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.NARRATIVE_PATH ||
      basePoolMode ===
      BASE_POOL_MODES.MIRRORLAND
    ) {
      return ILLUMINATION_MODES
        .MIRRORLAND;
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.PUBLIC_MAP
    ) {
      return ILLUMINATION_MODES
        .COMPASS;
    }

    return ILLUMINATION_MODES
      .THRESHOLD;
  };

  const inferEntryStackMode = (
    target,
    intent,
    context,
    basePoolMode
  ) => {
    const source =
      safeText(intent);

    if (
      /return|recenter|start over|back to compass/i.test(
        source
      )
    ) {
      return ENTRY_STACK_MODES
        .RETURN;
    }

    if (
      /open|take me|go to|door|enter/i.test(
        source
      )
    ) {
      return ENTRY_STACK_MODES
        .PREPARED_DOOR;
    }

    if (
      isGuidedChooserRequest(
        target,
        intent,
        context
      )
    ) {
      return ENTRY_STACK_MODES
        .GUIDED_CHOOSER;
    }

    return ENTRY_STACK_MODES
      .BASE_POOL;
  };

  const inferScopeLaneFromTarget =
    target => {
      const source =
        safeText(target)
          .toLowerCase();

      if (
        /sean|summit|mission|elara|human/.test(
          source
        )
      ) {
        return "mission";
      }

      if (
        /diagnostic|gauge|law|soren/.test(
          source
        )
      ) {
        return "diagnostic";
      }

      if (
        /character|portrait|roster/.test(
          source
        )
      ) {
        return "character";
      }

      if (
        /mirror|showroom|story/.test(
          source
        )
      ) {
        return "mirrorland";
      }

      if (
        /frontier|water|remote|climate/.test(
          source
        )
      ) {
        return "frontier";
      }

      if (
        /product|coin|auren|education/.test(
          source
        )
      ) {
        return "products";
      }

      if (
        /h-earth|technical|repair|dextrion/.test(
          source
        )
      ) {
        return "technical";
      }

      return "public";
    };

  const inferPromptModeFromPool =
    basePoolMode => {
      if (
        basePoolMode ===
        BASE_POOL_MODES.DIAGNOSTIC
      ) {
        return "diagnostic_boundary";
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.MISSION
      ) {
        return "handoff";
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.FRONTIER
      ) {
        return "orientation";
      }

      return "orientation";
    };

  const inferAlignmentFromPool =
    basePoolMode => {
      if (
        basePoolMode ===
        BASE_POOL_MODES.DIAGNOSTIC
      ) {
        return "boundary";
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.MISSION
      ) {
        return "signal";
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.FRONTIER
      ) {
        return "field";
      }

      return "orientation";
    };

  const inferBridgeMomentFromContext =
    context => {
      return (
        safeText(
          context &&
          context.bridgeMoment
        ) ||
        "before_handoff"
      );
    };

  const inferGateFromContext = (
    target,
    intent,
    context,
    entryStackMode,
    basePoolMode
  ) => {
    if (
      entryStackMode ===
      ENTRY_STACK_MODES.PREPARED_DOOR
    ) {
      return GATES.PREPARED_DOOR;
    }

    if (
      entryStackMode ===
      ENTRY_STACK_MODES.RETURN
    ) {
      return GATES.RETURN;
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.DIAGNOSTIC
    ) {
      return GATES
        .DIAGNOSTIC_BOUNDARY;
    }

    if (
      entryStackMode ===
      ENTRY_STACK_MODES
        .GUIDED_CHOOSER
    ) {
      return GATES.CHOICE_CLOSURE;
    }

    return GATES.BASE_POOL;
  };

  const inferGateFromOption = (
    option,
    target,
    basePoolMode
  ) => {
    const source =
      [
        safeText(
          option &&
          option.movementIntent
        ),
        safeText(
          option &&
          option.optionKind
        )
      ]
        .join(" ")
        .toLowerCase();

    if (
      /open_prepared_door|route|handoff/.test(
        source
      )
    ) {
      return GATES.PREPARED_DOOR;
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.DIAGNOSTIC
    ) {
      return GATES
        .DIAGNOSTIC_BOUNDARY;
    }

    return GATES.CHOICE_CLOSURE;
  };

  const inferPathFamily = (
    target,
    intent,
    basePoolMode
  ) => {
    if (
      basePoolMode ===
      BASE_POOL_MODES.MISSION
    ) {
      return "human_threshold";
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.DIAGNOSTIC
    ) {
      return "diagnostic_threshold";
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.FRONTIER
    ) {
      return "frontier";
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.PRODUCTS
    ) {
      return "practical_systems";
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.CHARACTER
    ) {
      return "character_roster";
    }

    if (
      basePoolMode ===
      BASE_POOL_MODES.NARRATIVE_PATH
    ) {
      return "story_world";
    }

    return "public_orientation";
  };

  const inferDialectMode = (
    target,
    intent,
    basePoolMode,
    illuminationMode
  ) => {
    if (
      illuminationMode ===
      ILLUMINATION_MODES.BORDER
    ) {
      return "handoff";
    }

    if (
      illuminationMode ===
      ILLUMINATION_MODES
        .DIAGNOSTIC_BOUNDARY
    ) {
      return "boundary";
    }

    return "welcome_and_routing";
  };

  const inferExpectation =
    gate => {
      if (
        gate ===
        GATES.PREPARED_DOOR
      ) {
        return "page_visit";
      }

      if (
        gate ===
        GATES.DIAGNOSTIC_BOUNDARY
      ) {
        return "diagnostic_referral";
      }

      if (
        gate ===
        GATES.RETURN
      ) {
        return "return_to_public_entry";
      }

      return "orientation_before_entry";
    };

  const stepForGate =
    gate => {
      if (
        gate ===
        GATES.ENTRANCE
      ) {
        return 1;
      }

      if (
        gate ===
        GATES.CHOICE_CLOSURE
      ) {
        return 2;
      }

      if (
        gate ===
        GATES.PREPARED_DOOR
      ) {
        return 3;
      }

      if (
        gate ===
        GATES.DIAGNOSTIC_BOUNDARY
      ) {
        return 2;
      }

      return 1;
    };

  const priorStepForGate =
    gate => {
      return Math.max(
        0,
        stepForGate(gate) - 1
      );
    };

  const nextForGate = (
    gate,
    path
  ) => {
    if (
      gate ===
      GATES.PREPARED_DOOR
    ) {
      return [
        "open_door",
        "return_main"
      ];
    }

    if (
      gate ===
      GATES.DIAGNOSTIC_BOUNDARY
    ) {
      return [
        "open_diagnostic",
        "return_main"
      ];
    }

    if (
      gate ===
      GATES.RETURN
    ) {
      return [
        "return_compass"
      ];
    }

    return [
      "choose_route",
      "return_main"
    ];
  };

  const isNoRepeatGate =
    gate => {
      return (
        gate ===
          GATES.PREPARED_DOOR ||
        gate ===
          GATES.DIAGNOSTIC_BOUNDARY ||
        gate ===
          GATES.RETURN
      );
    };

  const normalizeCoordinate =
    value => {
      if (
        !value ||
        typeof value !== "object"
      ) {
        return null;
      }

      const target =
        safeText(
          value.target ||
          value.activeTarget ||
          value.sourceTarget ||
          TARGETS.DIAMOND_GATE_OVERVIEW
        );

      const gate =
        safeText(
          value.gate ||
          GATES.BASE_POOL
        );

      return {
        step:
          safeNumber(
            value.step,
            stepForGate(gate)
          ),

        priorStep:
          safeNumber(
            value.priorStep,
            priorStepForGate(gate)
          ),

        gate,

        path:
          safeText(
            value.path ||
            inferPathFamily(
              target,
              "",
              value.mode
            )
          ),

        mode:
          safeText(
            value.mode ||
            value.basePoolMode ||
            BASE_POOL_MODES
              .ESTATE_OVERVIEW
          ),

        dialect:
          safeText(
            value.dialect ||
            "welcome_and_routing"
          ),

        expectation:
          safeText(
            value.expectation ||
            inferExpectation(gate)
          ),

        sourceTarget:
          safeText(
            value.sourceTarget ||
            target
          ),

        activeTarget:
          safeText(
            value.activeTarget ||
            target
          ),

        target,

        destination:
          safeText(
            value.destination
          ),

        routeId:
          safeText(
            value.routeId
          ),

        next:
          Array.isArray(
            value.next
          )
            ? value.next
                .map(safeText)
                .filter(Boolean)
                .slice(0, 8)
            : nextForGate(
                gate,
                value.path
              ),

        noRepeat:
          typeof value.noRepeat ===
            "boolean"
            ? value.noRepeat
            : isNoRepeatGate(gate)
      };
    };

  const buildFallbackCoordinate = (
    source,
    context
  ) => {
    const target =
      safeText(
        source ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const basePoolMode =
      inferBasePoolMode(
        target,
        "",
        context || {}
      );

    const illuminationMode =
      inferIlluminationMode(
        target,
        "",
        context || {},
        basePoolMode
      );

    const entryStackMode =
      inferEntryStackMode(
        target,
        "",
        context || {},
        basePoolMode
      );

    const gate =
      inferGateFromContext(
        target,
        "",
        context || {},
        entryStackMode,
        basePoolMode
      );

    const path =
      inferPathFamily(
        target,
        "",
        basePoolMode
      );

    return {
      step:
        stepForGate(gate),

      priorStep:
        priorStepForGate(gate),

      gate,

      path,

      mode:
        basePoolMode,

      dialect:
        inferDialectMode(
          target,
          "",
          basePoolMode,
          illuminationMode
        ),

      expectation:
        inferExpectation(gate),

      sourceTarget:
        target,

      activeTarget:
        target,

      target,

      destination:
        "",

      routeId:
        inferRouteIdFromTarget(
          target,
          basePoolMode,
          ""
        ),

      next:
        nextForGate(
          gate,
          path
        ),

      noRepeat:
        isNoRepeatGate(gate)
    };
  };

  const buildOptionCoordinate = (
    option,
    context
  ) => {
    const target =
      safeText(
        option &&
        option.target ||
        context &&
        context.target ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const intent =
      safeText(
        option &&
        option.intent ||
        option &&
        option.label ||
        context &&
        context.intent
      );

    const basePoolMode =
      option &&
      option.basePoolMode ||
      context &&
      context.basePoolMode ||
      inferBasePoolMode(
        target,
        intent,
        context || {}
      );

    const gate =
      inferGateFromOption(
        option || {},
        target,
        basePoolMode
      );

    const path =
      inferPathFamily(
        target,
        intent,
        basePoolMode
      );

    return {
      step:
        stepForGate(gate),

      priorStep:
        priorStepForGate(gate),

      gate,

      path,

      mode:
        basePoolMode,

      dialect:
        inferDialectMode(
          target,
          intent,
          basePoolMode,
          option &&
          option.illuminationMode
        ),

      expectation:
        inferExpectation(gate),

      sourceTarget:
        safeText(
          option &&
          option.sourceTarget ||
          target
        ),

      activeTarget:
        safeText(
          option &&
          option.activeTarget ||
          target
        ),

      target,

      destination:
        "",

      routeId:
        safeText(
          option &&
          option.routeId ||
          inferRouteIdFromTarget(
            target,
            basePoolMode,
            intent
          )
        ),

      next:
        nextForGate(
          gate,
          path
        ),

      noRepeat:
        true
    };
  };

  const ensureSourceStableCoordinate = (
    coordinate,
    identityInput
  ) => {
    const identity =
      identityInput &&
      typeof identityInput ===
        "object"
        ? identityInput
        : {};

    const base =
      normalizeCoordinate(
        coordinate
      ) ||
      buildFallbackCoordinate(
        identity.activeTarget ||
        identity.selectedTarget ||
        identity.sourceTarget ||
        TARGETS.DIAMOND_GATE_OVERVIEW,
        identity
      );

    const selectedTarget =
      safeText(
        identity.selectedTarget ||
        base.target
      );

    const sourceTarget =
      safeText(
        identity.sourceTarget ||
        base.sourceTarget ||
        selectedTarget
      );

    const activeTarget =
      safeText(
        identity.activeTarget ||
        base.activeTarget ||
        selectedTarget
      );

    return {
      ...base,

      target:
        selectedTarget,

      sourceTarget,

      activeTarget,

      routeId:
        safeText(
          identity.routeId ||
          base.routeId
        ),

      noRepeat:
        typeof base.noRepeat ===
          "boolean"
          ? base.noRepeat
          : true
    };
  };

  const resolveSourceIdentity = (
    frame,
    context,
    coordinate
  ) => {
    const source =
      frame &&
      typeof frame === "object"
        ? frame
        : {};

    const safeContext =
      context &&
      typeof context === "object"
        ? context
        : {};

    const normalizedCoordinate =
      normalizeCoordinate(
        coordinate
      );

    const selectedTarget =
      safeText(
        source.selectedTarget ||
        safeContext.selectedTarget ||
        source.target ||
        (
          normalizedCoordinate &&
          normalizedCoordinate.target
        ) ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const sourceTarget =
      safeText(
        source.sourceTarget ||
        safeContext.sourceTarget ||
        (
          normalizedCoordinate &&
          normalizedCoordinate
            .sourceTarget
        ) ||
        selectedTarget
      );

    const activeTarget =
      safeText(
        source.activeTarget ||
        safeContext.activeTarget ||
        (
          normalizedCoordinate &&
          normalizedCoordinate
            .activeTarget
        ) ||
        selectedTarget
      );

    return {
      selectedTarget,
      sourceTarget,
      activeTarget
    };
  };

  const sanitizeGuidedChooserState =
    context => {
      return {
        ...(
          context &&
          typeof context ===
            "object"
            ? context
            : {}
        ),

        guidedChooserSanitized:
          true,

        hearthRequirement:
          false,

        atriumEarnedDepth:
          false
      };
    };

  const sanitizeGateForSource = (
    sourceTarget,
    gate,
    context
  ) => {
    const normalized =
      safeText(
        gate ||
        GATES.BASE_POOL
      );

    if (
      normalized ===
      GATES.TRUST_ESCALATION
    ) {
      return GATES.CLARIFICATION ||
        GATES.CHOICE_CLOSURE;
    }

    return normalized;
  };

  const sanitizeBasePoolModeForSource = (
    sourceTarget,
    mode
  ) => {
    const normalized =
      safeText(
        mode ||
        inferBasePoolMode(
          sourceTarget,
          "",
          {}
        )
      );

    if (
      normalized ===
      BASE_POOL_MODES.HEARTH ||
      normalized ===
      BASE_POOL_MODES.JEEVES_ATRIUM
    ) {
      return BASE_POOL_MODES
        .ESTATE_OVERVIEW;
    }

    return normalized;
  };

  const sanitizeEntryStackModeForSource = (
    sourceTarget,
    mode
  ) => {
    const normalized =
      safeText(
        mode ||
        ENTRY_STACK_MODES.BASE_POOL
      );

    if (
      normalized ===
      ENTRY_STACK_MODES.DIG_DEEPER
    ) {
      return ENTRY_STACK_MODES
        .GUIDED_CHOOSER;
    }

    return normalized;
  };

  const inferBasePoolModeFromTarget =
    target => {
      return inferBasePoolMode(
        target,
        "",
        {}
      );
    };

  const shapeRouteLabel = (
    routeId,
    fallbackLabel
  ) => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.shapeRouteLabel ===
        "function"
    ) {
      const shaped =
        voice.shapeRouteLabel(
          routeId,
          fallbackLabel
        );

      if (shaped) {
        return shaped;
      }
    }

    const route =
      getRoute(
        routeId
      );

    if (
      route &&
      route.label
    ) {
      return route.label;
    }

    const targetLabel =
      safeText(routeId)
        .replace(
          /([A-Z])/g,
          " $1"
        )
        .replace(
          /Path$/i,
          ""
        )
        .replace(
          /_/g,
          " "
        )
        .trim();

    if (targetLabel) {
      return (
        targetLabel
          .charAt(0)
          .toUpperCase() +
        targetLabel.slice(1)
      );
    }

    return safeText(
      fallbackLabel ||
      "Continue"
    );
  };

  const rewritePromptLabel = (
    label,
    target,
    context
  ) => {
    const text =
      sanitizePublicText(
        label
      );

    if (text) {
      return text
        .replace(
          /backbrain|frontbrain|corpus|retrieval|source ranking/gi,
          "map"
        );
    }

    return shapeRouteLabel(
      inferRouteIdFromTarget(
        target,
        "",
        ""
      ),
      "Continue"
    );
  };

  const shapeHandoffLabels = (
    labels,
    handoffs
  ) => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.shapeHandoffLabels ===
        "function"
    ) {
      return voice.shapeHandoffLabels(
        labels,
        handoffs
      );
    }

    const output =
      labels &&
      typeof labels === "object"
        ? {
            ...labels
          }
        : {};

    (
      Array.isArray(handoffs)
        ? handoffs
        : []
    ).forEach(routeId => {
      if (
        !output[routeId]
      ) {
        output[routeId] =
          shapeRouteLabel(
            routeId,
            "Open Door"
          );
      }
    });

    return output;
  };

  const shapeInterfaceState =
    stateName => {
      const voice =
        getVoice();

      if (
        voice &&
        typeof voice.shapeInterfaceState ===
          "function"
      ) {
        return voice.shapeInterfaceState(
          stateName
        );
      }

      const key =
        safeText(stateName)
          .toLowerCase();

      if (
        /listen/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .listening;
      }

      if (
        /typ|speak|respond/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .typing;
      }

      if (
        /read|settle/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .reading;
      }

      if (
        /handoff|route|door/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .handoff;
      }

      if (
        /bound|protect|warning/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .boundary;
      }

      if (
        /ready/.test(key)
      ) {
        return INTERFACE_STATE_COPY
          .ready;
      }

      return INTERFACE_STATE_COPY
        .idle;
    };

  const normalizeBubbleList =
    value => {
      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .map(item => {
          if (
            typeof item ===
              "string"
          ) {
            return sanitizePublicText(
              item
            );
          }

          if (
            item &&
            typeof item ===
              "object"
          ) {
            return sanitizePublicText(
              item.text ||
              item.body ||
              item.copy
            );
          }

          return "";
        })
        .filter(Boolean)
        .slice(0, 2);
    };

  const sanitizeBubbleList = (
    value,
    context
  ) => {
    const diagnosticRequest =
      isDiagnosticAssessmentRequest(
        [
          safeText(
            context &&
            context.intent
          ),
          safeText(
            context &&
            context.text
          ),
          safeText(
            context &&
            context.prompt
          )
        ].join(" ")
      );

    return normalizeBubbleList(
      value
    ).map(text => {
      return diagnosticRequest
        ? softenDiagnosticAssessmentLanguage(
            text
          )
        : sanitizePublicText(
            text
          );
    });
  };

  const makeStaticOption = (
    label,
    target,
    promptMode,
    archetypeAlignment,
    bridgeMoment,
    movementIntent,
    scopeLane,
    extra
  ) => {
    const extension =
      extra &&
      typeof extra === "object"
        ? extra
        : {};

    const normalizedTarget =
      safeText(
        target ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const routeId =
      safeText(
        extension.routeId ||
        inferRouteIdFromTarget(
          normalizedTarget,
          extension.basePoolMode,
          label
        )
      );

    const route =
      getRoute(
        routeId
      );

    return {
      ...extension,

      label:
        sanitizePublicText(
          label
        ),

      target:
        normalizedTarget,

      routeId:
        route
          ? getRouteKey(route)
          : routeId,

      routeUrl:
        extension.routeUrl ||
        (
          route &&
          route.href
        ) ||
        "",

      sourceTarget:
        safeText(
          extension.sourceTarget ||
          normalizedTarget
        ),

      activeTarget:
        safeText(
          extension.activeTarget ||
          normalizedTarget
        ),

      type:
        safeText(
          extension.type ||
          "conversation"
        ),

      promptMode:
        safeText(
          promptMode ||
          extension.promptMode ||
          "orientation"
        ),

      archetypeAlignment:
        safeText(
          archetypeAlignment ||
          extension
            .archetypeAlignment ||
          "orientation"
        ),

      bridgeMoment:
        safeText(
          bridgeMoment ||
          extension.bridgeMoment ||
          "before_handoff"
        ),

      movementIntent:
        safeText(
          movementIntent ||
          extension.movementIntent ||
          "ask_jeeves"
        ),

      scopeLane:
        safeText(
          scopeLane ||
          extension.scopeLane ||
          inferScopeLaneFromTarget(
            normalizedTarget
          )
        ),

      optionKind:
        safeText(
          extension.optionKind ||
          "conversation_prompt"
        ),

      noRepeat:
        typeof extension.noRepeat ===
          "boolean"
          ? extension.noRepeat
          : true
    };
  };

  const shapeOption = (
    option,
    context
  ) => {
    if (
      !option ||
      typeof option !== "object"
    ) {
      return null;
    }

    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.shapeOption ===
        "function"
    ) {
      const shaped =
        voice.shapeOption(
          option,
          context || {}
        );

      if (shaped) {
        return shaped;
      }
    }

    const safeContext =
      context &&
      typeof context === "object"
        ? context
        : {};

    const target =
      safeText(
        option.target ||
        safeContext.target ||
        safeContext.activeTarget ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const sourceTarget =
      safeText(
        option.sourceTarget ||
        safeContext.sourceTarget ||
        target
      );

    const activeTarget =
      safeText(
        option.activeTarget ||
        safeContext.activeTarget ||
        target
      );

    const intent =
      safeText(
        option.intent ||
        option.label ||
        safeContext.intent
      );

    const basePoolMode =
      safeText(
        option.basePoolMode ||
        safeContext.basePoolMode ||
        inferBasePoolMode(
          target,
          intent,
          safeContext
        )
      );

    const illuminationMode =
      safeText(
        option.illuminationMode ||
        safeContext
          .illuminationMode ||
        inferIlluminationMode(
          target,
          intent,
          safeContext,
          basePoolMode
        )
      );

    const entryStackMode =
      safeText(
        option.entryStackMode ||
        safeContext.entryStackMode ||
        inferEntryStackMode(
          target,
          intent,
          safeContext,
          basePoolMode
        )
      );

    const routeId =
      safeText(
        option.routeId ||
        inferRouteIdFromTarget(
          target,
          basePoolMode,
          intent
        )
      );

    const route =
      getRoute(
        routeId
      );

    const coordinate =
      ensureSourceStableCoordinate(
        option.conversationCoordinate ||
        buildOptionCoordinate(
          option,
          safeContext
        ),
        {
          selectedTarget:
            target,

          sourceTarget,

          activeTarget,

          routeId:
            route
              ? getRouteKey(route)
              : routeId,

          entryStackMode,

          basePoolMode,

          illuminationMode
        }
      );

    return {
      ...option,

      label:
        rewritePromptLabel(
          option.label ||
          (
            route &&
            route.label
          ) ||
          "Continue",
          target,
          safeContext
        ),

      target,

      routeId:
        route
          ? getRouteKey(route)
          : routeId,

      routeUrl:
        option.routeUrl ||
        (
          route &&
          route.href
        ) ||
        "",

      sourceTarget,

      activeTarget,

      type:
        safeText(
          option.type ||
          "conversation"
        ),

      scopeLane:
        safeText(
          option.scopeLane ||
          inferScopeLaneFromTarget(
            target
          )
        ),

      promptMode:
        safeText(
          option.promptMode ||
          inferPromptModeFromPool(
            basePoolMode
          )
        ),

      optionKind:
        safeText(
          option.optionKind ||
          "conversation_prompt"
        ),

      archetypeAlignment:
        safeText(
          option
            .archetypeAlignment ||
          inferAlignmentFromPool(
            basePoolMode
          )
        ),

      bridgeMoment:
        safeText(
          option.bridgeMoment ||
          inferBridgeMomentFromContext(
            safeContext
          )
        ),

      movementIntent:
        safeText(
          option.movementIntent ||
          "ask_jeeves"
        ),

      entryStackMode,

      basePoolMode,

      illuminationMode,

      conversationCoordinate:
        coordinate,

      gateType:
        safeText(
          option.gateType ||
          coordinate.gate ||
          GATES.BASE_POOL
        ),

      pathFamily:
        safeText(
          option.pathFamily ||
          coordinate.path ||
          inferPathFamily(
            target,
            intent,
            basePoolMode
          )
        ),

      dialectMode:
        safeText(
          option.dialectMode ||
          coordinate.dialect ||
          inferDialectMode(
            target,
            intent,
            basePoolMode,
            illuminationMode
          )
        ),

      contextExpectation:
        safeText(
          option
            .contextExpectation ||
          coordinate.expectation ||
          inferExpectation(
            coordinate.gate
          )
        ),

      noRepeat:
        typeof option.noRepeat ===
          "boolean"
          ? option.noRepeat
          : Boolean(
              coordinate.noRepeat
            )
    };
  };

  const shapeOptions = (
    options,
    context
  ) => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.shapeOptions ===
        "function"
    ) {
      const shaped =
        voice.shapeOptions(
          options,
          context || {}
        );

      if (
        Array.isArray(shaped)
      ) {
        return shaped;
      }
    }

    if (!Array.isArray(options)) {
      return [];
    }

    return dedupeObjects(
      options
        .map(option => {
          return shapeOption(
            option,
            context || {}
          );
        })
        .filter(Boolean),
      option => {
        return [
          safeText(option.label),
          safeText(option.target),
          safeText(option.routeId),
          safeText(option.routeUrl)
        ].join("::");
      }
    ).slice(0, 7);
  };

  const normalizeOptions = (
    value,
    context
  ) => {
    return shapeOptions(
      value,
      context
    );
  };

  const makeReturnForkOption =
    basePoolMode => {
      return makeStaticOption(
        "Return to the Compass",
        TARGETS.TRADITIONAL_COMPASS,
        "return",
        "orientation",
        "return",
        "open_prepared_door",
        "public",
        {
          routeId:
            ROUTES.COMPASS,

          routeUrl:
            (
              getRoute(
                ROUTES.COMPASS
              ) || {}
            ).href ||
            FALLBACK_ROUTE_URLS
              .compass,

          basePoolMode:
            basePoolMode ||
            BASE_POOL_MODES
              .ESTATE_OVERVIEW,

          illuminationMode:
            ILLUMINATION_MODES
              .COMPASS,

          entryStackMode:
            ENTRY_STACK_MODES
              .RETURN
        }
      );
    };

  const makeDigDeeperOption = (
    target,
    intent,
    basePoolMode,
    context
  ) => {
    return makeStaticOption(
      "Show me the public map",
      TARGETS.SITE_GUIDE,
      "orientation",
      "orientation",
      "before_handoff",
      "open_prepared_door",
      "public",
      {
        routeId:
          ROUTES.SITE_GUIDE,

        routeUrl:
          (
            getRoute(
              ROUTES.SITE_GUIDE
            ) || {}
          ).href ||
          FALLBACK_ROUTE_URLS
            .siteGuide,

        basePoolMode:
          BASE_POOL_MODES.PUBLIC_MAP,

        illuminationMode:
          ILLUMINATION_MODES.COMPASS,

        entryStackMode:
          ENTRY_STACK_MODES
            .PREPARED_DOOR
      }
    );
  };

  const inferDigDeeperLabel =
    () => {
      return "Show me the public map";
    };

  const shapeEntranceOptions = () => {
    return shapeOptions(
      [
        makeStaticOption(
          "Show me around",
          TARGETS.SITE_GUIDE,
          "orientation",
          "orientation",
          "before_handoff",
          "open_prepared_door",
          "public",
          {
            routeId:
              ROUTES.SITE_GUIDE
          }
        ),

        makeStaticOption(
          "Help me understand the person behind this",
          TARGETS.MISSION_INNER,
          "orientation",
          "signal",
          "before_handoff",
          "ask_jeeves",
          "mission",
          {
            routeId:
              ROUTES.ELARA
          }
        ),

        makeStaticOption(
          "I want help understanding myself",
          TARGETS.DIAGNOSTIC,
          "diagnostic_boundary",
          "boundary",
          "before_handoff",
          "ask_jeeves",
          "diagnostic",
          {
            routeId:
              ROUTES.SOREN
          }
        ),

        makeStaticOption(
          "Show me products or practical systems",
          TARGETS.PRODUCTS,
          "orientation",
          "practical",
          "before_handoff",
          "ask_jeeves",
          "products",
          {
            routeId:
              ROUTES.AUREN
          }
        ),

        makeStaticOption(
          "Take me into the story world",
          TARGETS.MIRRORLAND,
          "orientation",
          "story",
          "before_handoff",
          "open_prepared_door",
          "mirrorland",
          {
            routeId:
              ROUTES.SHOWROOM
          }
        ),

        makeReturnForkOption(
          BASE_POOL_MODES
            .ESTATE_OVERVIEW
        )
      ],
      {}
    );
  };

  const shapeGuidedChooserOptions =
    () => {
      return shapeEntranceOptions();
    };

  const shapeMissionOptions = () => {
    return shapeOptions(
      [
        makeStaticOption(
          "Talk to Elara",
          TARGETS.MISSION_OVERVIEW,
          "handoff",
          "signal",
          "before_handoff",
          "open_prepared_door",
          "mission",
          {
            routeId:
              ROUTES.ELARA
          }
        ),

        makeStaticOption(
          "Meet Sean",
          TARGETS.SEAN,
          "handoff",
          "human",
          "before_handoff",
          "open_prepared_door",
          "mission",
          {
            routeId:
              ROUTES.MEET_SEAN
          }
        ),

        makeStaticOption(
          "Open The Nine Summits of Love",
          TARGETS.BOOK,
          "handoff",
          "human",
          "before_handoff",
          "open_prepared_door",
          "mission",
          {
            routeId:
              ROUTES
                .NINE_SUMMITS_OF_LOVE
          }
        ),

        makeReturnForkOption(
          BASE_POOL_MODES.MISSION
        )
      ],
      {}
    );
  };

  const shapeDiagnosticBoundaryOptions =
    () => {
      return shapeOptions(
        [
          makeStaticOption(
            "Talk to Soren",
            TARGETS.DIAGNOSTIC,
            "diagnostic_boundary",
            "boundary",
            "before_handoff",
            "open_prepared_door",
            "diagnostic",
            {
              routeId:
                ROUTES.SOREN
            }
          ),

          makeStaticOption(
            "Open the Coherence Diagnostic",
            TARGETS.DIAGNOSTIC,
            "diagnostic_boundary",
            "boundary",
            "before_handoff",
            "open_prepared_door",
            "diagnostic",
            {
              routeId:
                ROUTES.DIAGNOSTIC
            }
          ),

          makeStaticOption(
            "Open the Proof Gauges",
            TARGETS.GAUGES,
            "orientation",
            "measurement",
            "before_handoff",
            "open_prepared_door",
            "diagnostic",
            {
              routeId:
                ROUTES.GAUGES
            }
          ),

          makeReturnForkOption(
            BASE_POOL_MODES
              .DIAGNOSTIC
          )
        ],
        {}
      );
    };

  const buildDefaultOptions = (
    target,
    intent,
    agent,
    escalation,
    context
  ) => {
    const chosen =
      agent ||
      inferAgent(
        target,
        intent,
        context,
        {}
      );

    const options = [];

    if (
      chosen &&
      chosen.id !== "jeeves" &&
      chosen.route
    ) {
      options.push(
        makeStaticOption(
          `Talk to ${chosen.name}`,
          target,
          "handoff",
          "orientation",
          "before_handoff",
          "open_prepared_door",
          inferScopeLaneFromTarget(
            target
          ),
          {
            routeId:
              chosen.route
          }
        )
      );
    } else {
      options.push(
        makeDigDeeperOption(
          target,
          intent,
          inferBasePoolMode(
            target,
            intent,
            context
          ),
          context
        )
      );
    }

    options.push(
      makeReturnForkOption(
        inferBasePoolMode(
          target,
          intent,
          context
        )
      )
    );

    return options;
  };

  const shapeChoiceClosureOptions = (
    options,
    target,
    intent,
    context,
    basePoolMode
  ) => {
    const source =
      Array.isArray(options) &&
      options.length
        ? options
        : buildDefaultOptions(
            target,
            intent,
            inferAgent(
              target,
              intent,
              context,
              {}
            ),
            0,
            context
          );

    return shapeOptions(
      source,
      {
        target,
        intent,
        context,
        basePoolMode
      }
    );
  };

  const buildChoiceClosure = (
    target,
    intent,
    context,
    basePoolMode,
    coordinateArg
  ) => {
    return {
      preparedDoorAvailable:
        true,

      clarificationAvailable:
        true,

      returnForkAvailable:
        true,

      finalChatThreshold:
        false,

      atriumEarnedDepth:
        false,

      mode:
        basePoolMode ||
        inferBasePoolMode(
          target,
          intent,
          context
        )
    };
  };

  const shapeDiagnosticBoundaryFallback =
    () => {
      return [
        "I will not diagnose you from the welcome surface.",
        "Soren owns the diagnostic boundary, evidence, and interpretation required for that conversation."
      ];
    };

  const shapeIntrigueFallback =
    basePoolMode => {
      if (
        basePoolMode ===
        BASE_POOL_MODES
          .NARRATIVE_PATH ||
        basePoolMode ===
        BASE_POOL_MODES
          .MIRRORLAND
      ) {
        return [
          "The Showroom is the visible threshold into the story world.",
          "Enter there and let the world introduce itself in its own order."
        ];
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.PUBLIC_MAP
      ) {
        return [
          "Diamond Gate Bridge connects several distinct public paths.",
          "The Website Guide gives you the cleanest map."
        ];
      }

      if (
        basePoolMode ===
        BASE_POOL_MODES.CHARACTER
      ) {
        return [
          "The Character Roster identifies the public guides and their responsibilities.",
          "Use it when the people matter more than the general map."
        ];
      }

      return OPENING_SEQUENCE.slice();
    };

  const shapeDeeperFallback = (
    target,
    intent,
    context,
    basePoolMode
  ) => {
    return [
      "That question needs a more specific owner.",
      "I can identify the correct room or guide without pretending the welcome surface owns the depth."
    ];
  };

  const shapeCrossPathFallback =
    context => {
      return [
        "That crosses more than one public path.",
        "The Website Guide is the cleanest place to separate them."
      ];
    };

  const shapeBasePool = (
    target,
    intent,
    context,
    basePoolMode
  ) => {
    const mode =
      basePoolMode ||
      inferBasePoolMode(
        target,
        intent,
        context
      );

    if (
      mode ===
      BASE_POOL_MODES.DIAGNOSTIC
    ) {
      return shapeDiagnosticBoundaryFallback();
    }

    if (
      mode ===
      BASE_POOL_MODES.MISSION
    ) {
      return [
        "Elara owns the human meaning, Sean's public story, the Mission, and the Book threshold.",
        "I can open her door."
      ];
    }

    if (
      mode ===
      BASE_POOL_MODES.PRODUCTS
    ) {
      return [
        "Auren owns products, Education, practical value, custody, and implementation.",
        "I can open his door."
      ];
    }

    if (
      mode ===
      BASE_POOL_MODES.FRONTIER
    ) {
      return [
        "Frontier questions divide among navigation, water, and distributed field work.",
        "I can identify the correct owner from here."
      ];
    }

    if (
      mode ===
      BASE_POOL_MODES.CHARACTER
    ) {
      return [
        "The Character Roster identifies the public guides and their responsibilities.",
        "I can take you there."
      ];
    }

    return shapeIntrigueFallback(
      mode
    );
  };

  const shapeGatewayBubbles =
    args => {
      const source =
        args &&
        typeof args === "object"
          ? args
          : {};

      const target =
        safeText(
          source.target
        );

      const intent =
        safeText(
          source.intent
        );

      const context =
        source.context &&
        typeof source.context ===
          "object"
          ? source.context
          : {};

      const basePoolMode =
        source.basePoolMode ||
        inferBasePoolMode(
          target,
          intent,
          context
        );

      if (
        isDiagnosticAssessmentRequest(
          intent
        )
      ) {
        return shapeDiagnosticBoundaryFallback();
      }

      const agent =
        source.agent ||
        inferAgent(
          target,
          intent,
          context,
          {}
        );

      if (
        agent &&
        agent.id !== "jeeves"
      ) {
        return [
          `That belongs with ${agent.name}.`,
          agent.summary ||
          "I can open the correct next door."
        ];
      }

      if (
        isWhereAmIRequest(
          intent
        )
      ) {
        return [
          "You are on Jeeves's public welcome and routing page inside Diamond Gate Bridge.",
          "You may ask for direction or use a direct public path."
        ];
      }

      if (
        isPlatformRealityRequest(
          intent
        )
      ) {
        return [
          "Diamond Gate Bridge is the connected public platform.",
          "The Showroom is the visible threshold where that platform begins opening toward its narrative worlds."
        ];
      }

      if (
        isHouseRequest(
          intent
        )
      ) {
        return [
          "The House is a public metaphor for connected rooms, guides, systems, and worlds.",
          "The Website Guide shows the map without making Jeeves the owner of every room."
        ];
      }

      if (
        isMirrorlandRequest(
          intent
        )
      ) {
        return [
          "Mirrorland is part of the narrative world beyond the public platform threshold.",
          "The Showroom is the proper place to approach it."
        ];
      }

      return shapeIntrigueFallback(
        basePoolMode
      );
    };

  const shouldOverrideGenericBubbles = (
    bubbles,
    intent,
    source,
    context
  ) => {
    if (
      !Array.isArray(bubbles) ||
      !bubbles.length
    ) {
      return true;
    }

    const joined =
      bubbles
        .map(item => {
          return typeof item ===
            "string"
            ? item
            : safeText(
                item &&
                item.text
              );
        })
        .join(" ")
        .toLowerCase();

    if (
      /api fallback|undefined|null/.test(
        joined
      )
    ) {
      return true;
    }

    if (
      /welcome inside the house|this is hearth|my room inside mirrorland|manor interface|earned depth|persistent visitors/.test(
        joined
      )
    ) {
      return true;
    }

    if (
      isDiagnosticAssessmentRequest(
        intent
      ) &&
      !/will not diagnose|soren|diagnostic boundary/i.test(
        joined
      )
    ) {
      return true;
    }

    return false;
  };

  const inferHandoffs = (
    agent,
    target,
    escalation,
    source
  ) => {
    if (
      Array.isArray(
        source &&
        source.handoffs
      ) &&
      source.handoffs.length
    ) {
      return dedupeStrings(
        source.handoffs
      ).slice(0, 4);
    }

    const chosen =
      agent ||
      FALLBACK_AGENTS.jeeves;

    if (
      chosen.route
    ) {
      return [
        chosen.route
      ];
    }

    const inferred =
      inferRouteIdFromTarget(
        target,
        "",
        ""
      );

    return inferred
      ? [
          inferred
        ]
      : [
          ROUTES.SITE_GUIDE
        ];
  };

  const shapeConversationFrame = (
    frame,
    context
  ) => {
    const voice =
      getVoice();

    if (
      voice &&
      typeof voice.shapeConversationFrame ===
        "function"
    ) {
      const canonicalFrame =
        voice.shapeConversationFrame(
          frame,
          context
        );

      if (
        canonicalFrame &&
        typeof canonicalFrame ===
          "object"
      ) {
        return finalizeFrame(
          canonicalFrame,
          context
        );
      }
    }

    const source =
      frame &&
      typeof frame === "object"
        ? {
            ...frame
          }
        : {};

    const safeContext =
      context &&
      typeof context === "object"
        ? {
            ...context
          }
        : {};

    const coordinate =
      normalizeCoordinate(
        source.conversationCoordinate
      ) ||
      buildFallbackCoordinate(
        source.selectedTarget ||
        source.target,
        safeContext
      );

    const sourceIdentity =
      resolveSourceIdentity(
        source,
        safeContext,
        coordinate
      );

    const target =
      safeText(
        sourceIdentity.activeTarget ||
        sourceIdentity.selectedTarget ||
        sourceIdentity.sourceTarget ||
        source.target ||
        safeContext.target ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const intent =
      safeText(
        source.intent ||
        safeContext.intent ||
        safeContext.prompt ||
        safeContext.text ||
        ""
      );

    const agent =
      inferAgent(
        target,
        intent,
        safeContext,
        source
      );

    const basePoolMode =
      inferBasePoolMode(
        target,
        intent,
        safeContext
      );

    const illuminationMode =
      inferIlluminationMode(
        target,
        intent,
        safeContext,
        basePoolMode
      );

    const entryStackMode =
      inferEntryStackMode(
        target,
        intent,
        safeContext,
        basePoolMode
      );

    let bubbles =
      sanitizeBubbleList(
        source.bubbles,
        {
          ...safeContext,
          intent
        }
      );

    if (
      !bubbles.length ||
      shouldOverrideGenericBubbles(
        source.bubbles,
        intent,
        source,
        safeContext
      )
    ) {
      bubbles =
        shapeGatewayBubbles({
          target,
          intent,
          context:
            safeContext,
          agent,
          basePoolMode,
          illuminationMode
        });
    }

    bubbles =
      sanitizeBubbleList(
        bubbles,
        {
          ...safeContext,
          intent
        }
      );

    const suppliedOptions =
      Array.isArray(
        source.options
      ) &&
      source.options.length
        ? source.options
        : buildDefaultOptions(
            target,
            intent,
            agent,
            0,
            safeContext
          );

    const options =
      shapeOptions(
        suppliedOptions,
        {
          target,
          intent,
          agent,
          basePoolMode,
          illuminationMode,
          entryStackMode,
          sourceTarget:
            sourceIdentity.sourceTarget,
          activeTarget:
            target
        }
      );

    const handoffs =
      inferHandoffs(
        agent,
        target,
        0,
        source
      ).slice(0, 1);

    const handoffLabels =
      shapeHandoffLabels(
        source.handoffLabels ||
        {},
        handoffs
      );

    const stableCoordinate =
      ensureSourceStableCoordinate(
        source.conversationCoordinate ||
        coordinate,
        {
          selectedTarget:
            sourceIdentity
              .selectedTarget ||
            target,

          sourceTarget:
            sourceIdentity
              .sourceTarget ||
            target,

          activeTarget:
            target,

          routeId:
            handoffs[0] ||
            "",

          entryStackMode,

          basePoolMode,

          illuminationMode
        }
      );

    return finalizeFrame(
      {
        ...source,

        bubbles,

        options,

        handoffs,

        handoffLabels,

        selectedTarget:
          sourceIdentity
            .selectedTarget ||
          target,

        sourceTarget:
          sourceIdentity
            .sourceTarget ||
          target,

        activeTarget:
          target,

        target,

        intent,

        entryStackMode,

        basePoolMode,

        illuminationMode,

        conversationCoordinate:
          stableCoordinate,

        choiceClosure:
          buildChoiceClosure(
            target,
            intent,
            safeContext,
            basePoolMode,
            stableCoordinate
          ),

        expressionContract:
          CONTRACT,

        expressionVersion:
          VERSION,

        expressionAgent:
          agent
            ? agent.id
            : "jeeves",

        roomIdentity:
          ROOM_IDENTITY,

        noRepeat:
          typeof source.noRepeat ===
            "boolean"
            ? source.noRepeat
            : true
      },
      safeContext
    );
  };

  const finalizeFrame = (
    frame,
    context
  ) => {
    const source =
      frame &&
      typeof frame === "object"
        ? frame
        : {};

    const target =
      safeText(
        source.target ||
        source.activeTarget ||
        source.selectedTarget ||
        TARGETS.DIAMOND_GATE_OVERVIEW
      );

    const coordinate =
      ensureSourceStableCoordinate(
        source.conversationCoordinate ||
        buildFallbackCoordinate(
          target,
          context
        ),
        {
          selectedTarget:
            source.selectedTarget ||
            target,

          sourceTarget:
            source.sourceTarget ||
            target,

          activeTarget:
            source.activeTarget ||
            target,

          routeId:
            source.routeId ||
            (
              Array.isArray(
                source.handoffs
              )
                ? source.handoffs[0]
                : ""
            )
        }
      );

    return {
      ...source,

      bubbles:
        sanitizeBubbleList(
          source.bubbles,
          {
            ...(
              context &&
              typeof context ===
                "object"
                ? context
                : {}
            ),

            intent:
              source.intent
          }
        ).slice(0, 2),

      options:
        shapeOptions(
          source.options ||
          [],
          {
            target,
            intent:
              source.intent ||
              "",
            basePoolMode:
              source.basePoolMode,
            illuminationMode:
              source
                .illuminationMode,
            entryStackMode:
              source.entryStackMode,
            sourceTarget:
              source.sourceTarget ||
              target,
            activeTarget:
              source.activeTarget ||
              target
          }
        ).slice(0, 7),

      handoffs:
        dedupeStrings(
          source.handoffs ||
          []
        ).slice(0, 1),

      handoffLabels:
        source.handoffLabels &&
        typeof source.handoffLabels ===
          "object"
          ? source.handoffLabels
          : {},

      conversationCoordinate:
        coordinate,

      routeUrls:
        getRouteUrlMap(),

      roomIdentity:
        ROOM_IDENTITY,

      noRepeat:
        typeof source.noRepeat ===
          "boolean"
          ? source.noRepeat
          : true,

      hearthIsJeevesHome:
        false,

      atriumIsEarnedDepth:
        false,

      wholeHouseOwnership:
        false,

      routeExecutionAuthority:
        false
    };
  };

  const shapeForkBridge = (
    input,
    context
  ) => {
    const text =
      safeText(
        input &&
        input.text
          ? input.text
          : input
      );

    return (
      sanitizePublicText(
        text
      ) ||
      "The paths divide here. I can identify which guide or room owns the next question."
    );
  };

  const shapeTransitionBridge = (
    fromTarget,
    toTarget,
    context
  ) => {
    return (
      "We are moving from " +
      shapeRouteLabel(
        inferRouteIdFromTarget(
          fromTarget,
          "",
          ""
        ),
        "this path"
      ) +
      " toward " +
      shapeRouteLabel(
        inferRouteIdFromTarget(
          toTarget,
          "",
          ""
        ),
        "the next room"
      ) +
      "."
    );
  };

  const shapePreKnowledgeBridge =
    () => {
      return "Before the answer becomes specialized, choose the correct owner.";
    };

  const shapeBridgeContextLine =
    context => {
      const mode =
        safeText(
          context &&
          context.basePoolMode
        );

      if (
        mode ===
        BASE_POOL_MODES.MISSION
      ) {
        return "This is human-threshold work. Elara owns the depth.";
      }

      if (
        mode ===
        BASE_POOL_MODES.DIAGNOSTIC
      ) {
        return "This is diagnostic-boundary work. Soren owns the interpretation.";
      }

      if (
        mode ===
        BASE_POOL_MODES.PRODUCTS
      ) {
        return "This is practical-systems work. Auren owns the implementation.";
      }

      if (
        mode ===
        BASE_POOL_MODES.FRONTIER
      ) {
        return "This is field work. The next owner depends on the specific system.";
      }

      return "This is routing work: orientation before depth.";
    };

  const translateAdjacentReason = (
    reason,
    from,
    to
  ) => {
    return (
      sanitizePublicText(
        reason
      ) ||
      "These public paths touch, but they do not carry the same responsibility."
    );
  };

  const shouldLeadWithBridge =
    context => {
      return Boolean(
        context &&
        context.bridgeMoment
      );
    };

  const withBridgeLead = (
    bubbles,
    context
  ) => {
    const list =
      sanitizeBubbleList(
        bubbles,
        context
      );

    if (
      !shouldLeadWithBridge(
        context
      )
    ) {
      return list;
    }

    return [
      shapeBridgeContextLine(
        context
      ),
      ...list
    ].slice(0, 2);
  };

  const isProtectedInterfacePhrase =
    text => {
      return /compass|showroom|mirrorland|elara|soren|jeeves|auren|dextrion|alaric|tarian/i.test(
        safeText(text)
      );
    };

  const isDiagnosticBoundaryState = (
    target,
    intent,
    context,
    basePoolMode,
    gate
  ) => {
    return (
      basePoolMode ===
        BASE_POOL_MODES.DIAGNOSTIC ||
      gate ===
        GATES.DIAGNOSTIC_BOUNDARY ||
      isDiagnosticAssessmentRequest(
        intent
      )
    );
  };

  const isDiagnosticAssessmentTarget =
    target => {
      return /diagnostic|coherence|assessment|score|soren/i.test(
        safeText(target)
      );
    };

  const normalizeBridgeContext =
    value => {
      return value &&
        typeof value === "object"
        ? {
            ...value
          }
        : {};
    };

  const normalizeBasePoolKey =
    mode => {
      return (
        safeText(mode) ||
        BASE_POOL_MODES
          .ESTATE_OVERVIEW
      );
    };

  const api = {
    contract:
      CONTRACT,

    previousContract:
      PREVIOUS_CONTRACT,

    canonicalVoiceGlobal:
      CANONICAL_GLOBAL,

    version:
      VERSION,

    get ready() {
      return getVoice() !== null;
    },

    get voiceReady() {
      return getVoice() !== null;
    },

    get voiceContract() {
      const voice =
        getVoice();

      return voice
        ? voice.contract
        : "";
    },

    get identity() {
      return getVoiceValue(
        "identity",
        {
          name:
            "Jeeves",

          role:
            "Welcome and Routing Guide"
        }
      );
    },

    get ownership() {
      return getVoiceValue(
        "ownership",
        {
          owns: [
            "first-contact welcome",
            "visitor orientation",
            "route recognition",
            "specialist handoff"
          ],

          doesNotOwn: [
            "whole-House authority",
            "diagnostic interpretation",
            "product implementation",
            "protected architecture"
          ]
        }
      );
    },

    get delivery() {
      return getVoiceValue(
        "delivery",
        {
          maximumContextualRoutes:
            1,

          ordinaryAnswerMaximumBubbles:
            2
        }
      );
    },

    get language() {
      return getVoiceValue(
        "language",
        {}
      );
    },

    get registers() {
      return getVoiceValue(
        "registers",
        {}
      );
    },

    get ui() {
      return getVoiceValue(
        "ui",
        {}
      );
    },

    get routes() {
      return getRouteTable();
    },

    get routeUrls() {
      return getRouteUrlMap();
    },

    get agents() {
      return getAgentTable();
    },

    get modes() {
      return getVoiceValue(
        "modes",
        {}
      );
    },

    get dialogues() {
      return getVoiceValue(
        "dialogues",
        {}
      );
    },

    get pathways() {
      return getVoiceValue(
        "pathways",
        {}
      );
    },

    get team() {
      return getVoiceValue(
        "team",
        {}
      );
    },

    get dossier() {
      return getVoiceValue(
        "dossier",
        {}
      );
    },

    targets:
      TARGETS,

    legacyRoutes:
      ROUTES,

    entryStackModes:
      ENTRY_STACK_MODES,

    basePoolModes:
      BASE_POOL_MODES,

    illuminationModes:
      ILLUMINATION_MODES,

    coordinateGates:
      GATES,

    sourceStabilityLaw:
      SOURCE_STABILITY_LAW,

    roomIdentity:
      ROOM_IDENTITY,

    openingSequence:
      OPENING_SEQUENCE,

    retiredOpeningSequence:
      RETIRED_OPENING_SEQUENCE,

    interfaceStateCopy:
      INTERFACE_STATE_COPY,

    getRoute,

    shapeConversationFrame,
    shapeGatewayBubbles,
    shapeBasePool,
    shapeOptions,
    shapeOption,
    shapeChoiceClosureOptions,
    shapeForkBridge,
    shapeTransitionBridge,
    shapePreKnowledgeBridge,
    shapeBridgeContextLine,
    translateAdjacentReason,
    withBridgeLead,
    shouldLeadWithBridge,
    shapeRouteLabel,
    shapeHandoffLabels,
    shapeEntranceOptions,
    shapeGuidedChooserOptions,
    shapeMissionOptions,
    shapeDiagnosticBoundaryOptions,
    shapeInterfaceState,
    shapeDeeperFallback,
    shapeCrossPathFallback,
    shapeDiagnosticBoundaryFallback,
    shapeIntrigueFallback,

    inferAgent,
    inferRouteFromIntent,
    inferBasePoolMode,
    inferIlluminationMode,
    inferEntryStackMode,
    inferRouteIdFromTarget,
    inferScopeLaneFromTarget,
    inferPromptModeFromPool,
    inferAlignmentFromPool,
    inferBridgeMomentFromContext,
    inferGateFromContext,
    inferGateFromOption,
    inferPathFamily,
    inferDialectMode,
    inferExpectation,
    inferHandoffs,
    buildChoiceClosure,
    buildDefaultOptions,
    makeStaticOption,
    makeDigDeeperOption,
    makeReturnForkOption,
    inferDigDeeperLabel,

    normalizeCoordinate,
    normalizeBridgeContext,
    normalizeBasePoolKey,
    normalizeBubbleList,
    normalizeOptions,
    buildFallbackCoordinate,
    buildOptionCoordinate,

    sanitizePublicText,
    sanitizeBubbleList,
    softenDiagnosticAssessmentLanguage,
    rewritePromptLabel,
    shouldOverrideGenericBubbles,
    shouldUseTrainingWheels,
    shouldTriggerAtriumBackdoor,
    isDiagnosticAssessmentRequest,
    isDiagnosticExplanationRequest,
    isDiagnosticAssessmentTarget,
    isDiagnosticBoundaryState,
    isGuidedChooserRequest,
    isTrueGuidedChooser,
    isGuidedLabel,
    isPlatformRealityRequest,
    isWhereAmIRequest,
    isHouseRequest,
    isMirrorlandRequest,
    isProtectedInterfacePhrase,

    resolveSourceIdentity,
    ensureSourceStableCoordinate,
    sanitizeGuidedChooserState,
    sanitizeGateForSource,
    sanitizeBasePoolModeForSource,
    sanitizeEntryStackModeForSource,
    inferBasePoolModeFromTarget,

    frontalLobeAuthority:
      false,

    personalityAuthority:
      false,

    publicLanguageAuthority:
      false,

    canonicalVoiceAuthority:
      false,

    compatibilityBridgeOnly:
      true,

    localSpineAuthority:
      false,

    estateAgentSpineExtractable:
      false,

    meaningAuthority:
      false,

    sourceIdentityCreationAuthority:
      false,

    routeExecutionAuthority:
      false,

    sourceStabilityCompatible:
      true,

    coordinateCarrierCompatible:
      true,

    noRepeatCompatible:
      true,

    oneFileBuildPlan:
      false,

    hearthIsJeevesHome:
      false,

    compassIsAccessPoint:
      true,

    compassIsRequiredGate:
      false,

    atriumIsEarnedDepth:
      false,

    charactersArePortraitHall:
      false,

    charactersArePublicRoster:
      true,

    wholeHouseOwnership:
      false,

    diagnosticRestraint:
      true
  };

  Object.freeze(api);

  const installExport = (
    target,
    key,
    value
  ) => {
    if (
      Object.prototype.hasOwnProperty.call(
        target,
        key
      )
    ) {
      try {
        target[key] =
          value;
      } catch (error) {
        return false;
      }

      return (
        target[key] ===
        value
      );
    }

    try {
      Object.defineProperty(
        target,
        key,
        {
          value,
          enumerable:
            true,
          configurable:
            false,
          writable:
            false
        }
      );

      return true;
    } catch (error) {
      try {
        target[key] =
          value;

        return true;
      } catch (
        fallbackError
      ) {
        return false;
      }
    }
  };

  installExport(
    global,
    "HEARTH_JEEVES_EXPRESSION",
    api
  );

  installExport(
    global,
    "HEARTH_JEEVES_EXPRESSION_BRIDGE",
    api
  );

  global.HEARTH =
    global.HEARTH || {};

  installExport(
    global.HEARTH,
    "jeevesExpression",
    api
  );

  const emitReadyEvents = () => {
    if (
      typeof global.dispatchEvent !==
        "function" ||
      typeof global.CustomEvent !==
        "function"
    ) {
      return;
    }

    const detail = {
      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      canonicalVoiceGlobal:
        CANONICAL_GLOBAL,

      voiceReady:
        getVoice() !== null,

      voiceContract:
        (
          getVoice() &&
          getVoice().contract
        ) ||
        "",

      version:
        VERSION,

      compatibilityBridgeOnly:
        true,

      coordinateCarrierCompatible:
        true,

      noRepeatCompatible:
        true,

      sourceStabilityCompatible:
        true,

      frontalLobeAuthority:
        false,

      personalityAuthority:
        false,

      publicLanguageAuthority:
        false,

      canonicalVoiceAuthority:
        false,

      localSpineAuthority:
        false,

      estateAgentSpineExtractable:
        false,

      meaningAuthority:
        false,

      sourceIdentityCreationAuthority:
        false,

      routeExecutionAuthority:
        false,

      oneFileBuildPlan:
        false,

      hearthIsJeevesHome:
        false,

      compassIsAccessPoint:
        true,

      compassIsRequiredGate:
        false,

      atriumIsEarnedDepth:
        false,

      charactersArePortraitHall:
        false,

      charactersArePublicRoster:
        true,

      wholeHouseOwnership:
        false,

      diagnosticRestraint:
        true
    };

    global.dispatchEvent(
      new global.CustomEvent(
        BRIDGE_READY_EVENT,
        {
          detail
        }
      )
    );

    global.dispatchEvent(
      new global.CustomEvent(
        LEGACY_READY_EVENT,
        {
          detail
        }
      )
    );
  };

  if (
    typeof global.addEventListener ===
      "function"
  ) {
    global.addEventListener(
      VOICE_READY_EVENT,
      emitReadyEvents
    );
  }

  emitReadyEvents();
})(
  typeof window !== "undefined"
    ? window
    : globalThis
);
