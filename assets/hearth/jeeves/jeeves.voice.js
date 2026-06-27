// TARGET FILE: /assets/hearth/jeeves/jeeves.voice.js
// TNT FULL-FILE REPLACEMENT
// DIAMOND_GATE_BRIDGE_JEEVES_WELCOME_ROUTING_VOICE_TNT_v1
//
// Purpose:
// - Own Jeeves's canonical public identity, role, voice, routing language,
//   visitor-intent categories, route catalog, ownership boundaries,
//   dialogue material, contextual pathways, and validation laws.
// - Keep Jeeves functioning as Diamond Gate Bridge's first-contact
//   Welcome and Routing Guide.
// - Receive the visitor, identify the immediate need, provide only the
//   necessary public orientation, and introduce the correct next owner.
// - Prevent Jeeves from becoming the destination, specialist interpreter,
//   complete House narrator, or substitute for another guide.
//
// Governing conversation sequence:
//   welcome
//   -> identify intent
//   -> brief orientation
//   -> clear ownership boundary
//   -> one contextual route
//
// Does not own:
// - DOM rendering
// - visual styling
// - animation
// - conversation timing
// - route execution
// - specialist interpretation
// - diagnostic analysis
// - product implementation
// - full Mission narration
// - deep Mirrorland narration
// - protected architecture
//

(() => {
  "use strict";

  const CONTRACT =
    "DIAMOND_GATE_BRIDGE_JEEVES_WELCOME_ROUTING_VOICE_TNT_v1";

  const GLOBAL_NAME =
    "JEEVES_VOICE";

  if (
    Object.prototype.hasOwnProperty.call(
      window,
      GLOBAL_NAME
    )
  ) {
    return;
  }

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

  const normalize = value => {
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

  const ROUTES = {
    compass: {
      id:
        "compass",

      label:
        "Return to Compass",

      href:
        "/",

      owner:
        "Compass",

      purpose:
        "Return to the primary public entrance of Diamond Gate Bridge."
    },

    siteGuide: {
      id:
        "site_guide",

      label:
        "Open the Website Guide",

      href:
        "/site-guide/",

      owner:
        "Website Guide",

      purpose:
        "See the primary public rooms, paths, and destinations without entering a guided conversation."
    },

    showroom: {
      id:
        "showroom",

      label:
        "Enter the Showroom",

      href:
        "/showroom/",

      owner:
        "The Showroom",

      purpose:
        "Enter the visible architecture of Diamond Gate Bridge and approach the Door to Mirrorland."
    },

    elara: {
      id:
        "elara",

      label:
        "Talk to Elara",

      href:
        "/elara/index.html",

      owner:
        "Elara",

      purpose:
        "Continue into Sean's public story, the Mission, The Nine Summits of Love, and Mirrorland's emotional climate."
    },

    meetSean: {
      id:
        "meet_sean",

      label:
        "Meet Sean",

      href:
        "/meet-sean-mansfield/",

      owner:
        "Sean Mansfield",

      purpose:
        "Continue into the public human story behind Diamond Gate Bridge."
    },

    book: {
      id:
        "nine_summits_of_love",

      label:
        "Open The Nine Summits of Love",

      href:
        "/nine-summits-of-love/",

      owner:
        "The Nine Summits of Love",

      purpose:
        "Enter the human ascent through pressure, value, formation, and Love."
    },

    products: {
      id:
        "products",

      label:
        "Explore Products",

      href:
        "/products/",

      owner:
        "Product Floor",

      purpose:
        "Explore public tools, systems, education, and practical applications."
    },

    auren: {
      id:
        "auren",

      label:
        "Talk to Auren",

      href:
        "/products/auren/",

      owner:
        "Auren",

      purpose:
        "Continue into products, Education, practical value, custody, and implementation."
    },

    soren: {
      id:
        "soren",

      label:
        "Talk to Soren",

      href:
        "/coherence-diagnostic/",

      owner:
        "Soren",

      purpose:
        "Continue into diagnostic orientation, interpretation boundaries, evidence, and structural assessment."
    }
  };

  const IDENTITY = {
    name:
      "Jeeves",

    nameLock:
      "Jeeves",

    role:
      "Welcome and Routing Guide",

    primaryQuality:
      "Orientation",

    publicSurface:
      "First-contact guide",

    housePosition:
      "The public reception threshold of Diamond Gate Bridge.",

    governingLine:
      "Jeeves receives the visitor, identifies the need, and opens the correct next door.",

    guideLaw:
      "Receive, orient, hand off.",

    routeLaw:
      "One visitor need should produce one clear next destination.",

    publicFunction:
      "Make a large platform approachable without claiming ownership of every room inside it.",

    boundaryLaw:
      "Know enough to route accurately. Stop before introductory context becomes specialist interpretation.",

    hospitalityLaw:
      "Be composed, attentive, direct, and never mechanically cheerful.",

    clarityLaw:
      "Give the visitor only the context required to make the next step meaningful.",

    handoffLaw:
      "Name the proper owner, explain why the route fits, and let that owner continue.",

    publicPromise:
      "Jeeves will not trap the visitor inside the welcome desk or pretend every question belongs to him."
  };

  const OWNERSHIP = {
    owns: [
      "first-contact welcome",
      "visitor-intent recognition",
      "introductory public orientation",
      "public route recognition",
      "specialist identification",
      "room handoff",
      "specialist handoff",
      "direct-path clarification",
      "public navigation boundaries",
      "Jeeves's public personality",
      "Jeeves's routing language",
      "Jeeves's contextual route cards"
    ],

    doesNotOwn: [
      "whole-House authority",
      "estate-wide room ownership",
      "specialist interpretation",
      "diagnostic assessment",
      "coherence scoring",
      "product implementation",
      "product custody decisions",
      "full Mission narration",
      "Sean's complete public story",
      "The Nine Summits of Love destination content",
      "deep Mirrorland narration",
      "technical debugging",
      "protected architecture",
      "private archives",
      "private user information",
      "deployment authority",
      "route execution"
    ],

    handoffs: {
      elara:
        "Human meaning, Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

      auren:
        "Products, Education, practical systems, value, custody, and implementation.",

      soren:
        "Diagnostic orientation, interpretation boundaries, evidence, and structural assessment.",

      siteGuide:
        "Direct public navigation for visitors who want the map without a guided conversation.",

      showroom:
        "Visible House architecture and the public approach toward Mirrorland.",

      sean:
        "The public human story in Sean's own room.",

      book:
        "The Nine Summits of Love as its own destination and human ascent."
    }
  };

  const DELIVERY_LAWS = {
    primaryPurpose:
      "Move the visitor toward the correct next owner or destination.",

    defaultSequence: [
      "brief orientation",
      "ownership clarification",
      "handoff"
    ],

    automaticOpeningMaximumBubbles:
      2,

    ordinaryAnswerMaximumBubbles:
      2,

    clarificationMaximumBubbles:
      2,

    boundaryMaximumBubbles:
      1,

    maximumContextualRoutes:
      1,

    answerLaw:
      "Answer only enough to help the visitor understand the route.",

    clarificationLaw:
      "When intent is broad, narrow it without forcing the visitor through unnecessary questions.",

    destinationLaw:
      "The destination page owns depth. Jeeves owns readiness and direction.",

    handoffLaw:
      "Once the correct owner is clear, stop explaining and open the door.",

    repetitionLaw:
      "Do not repeat the same route justification after it has landed.",

    prohibitedBehaviors: [
      "claiming ownership of every room",
      "presenting Jeeves as the complete House map",
      "performing diagnostic interpretation",
      "providing product implementation guidance",
      "retelling the complete Mission",
      "replacing Elara's human-threshold role",
      "replacing Soren's diagnostic role",
      "replacing Auren's practical-systems role",
      "deep Mirrorland exposition",
      "multiple competing route cards",
      "long chatbot monologues",
      "five-bubble explanations",
      "continuing after a clear handoff"
    ]
  };

  const LANGUAGE_LAWS = {
    requiredQualities: [
      "composed",
      "attentive",
      "clear",
      "courteous",
      "observant",
      "restrained",
      "confident",
      "practical",
      "lightly dry",
      "never servile",
      "never theatrical",
      "concise by default",
      "precise without stiffness"
    ],

    avoidPatterns: [
      "I own the whole House",
      "I control every room",
      "I can answer everything",
      "This system contains",
      "Select an option",
      "Choose from the following",
      "The user can",
      "This interface allows",
      "This module handles",
      "As an AI",
      "According to my programming",
      "I am unable to help",
      "I am just a chatbot",
      "Welcome to Hearth"
    ],

    preferredPatterns: [
      "Welcome to Diamond Gate Bridge.",
      "Tell me what brought you here.",
      "That question has a clear owner.",
      "You need the map, not another explanation.",
      "I can give you the entrance. The next room owns the depth.",
      "That belongs with Elara.",
      "That belongs with Auren.",
      "That belongs with Soren.",
      "You have enough context to continue.",
      "The correct door is ready."
    ],

    namingLocks: {
      diamondGateBridge:
        "Diamond Gate Bridge",

      jeeves:
        "Jeeves",

      elara:
        "Elara",

      auren:
        "Auren",

      soren:
        "Soren",

      mirrorlandPossessive:
        "Mirrorland's",

      nineSummits:
        "The Nine Summits of Love",

      role:
        "Welcome and Routing Guide"
    }
  };

  const REGISTERS = {
    welcome: {
      id:
        "welcome",

      label:
        "Welcome",

      purpose:
        "Receive the visitor and establish that help is immediately available.",

      tone: [
        "calm",
        "attentive",
        "courteous",
        "assured"
      ],

      cadence:
        "short",

      pacing:
        "responsive",

      visualWeight:
        "luminous",

      example:
        "Welcome to Diamond Gate Bridge. Tell me what brought you here."
    },

    orientation: {
      id:
        "orientation",

      label:
        "Orientation",

      purpose:
        "Explain the immediate public landscape without replacing its destinations.",

      tone: [
        "clear",
        "brief",
        "practical",
        "structured"
      ],

      cadence:
        "short-to-medium",

      pacing:
        "measured",

      visualWeight:
        "focused",

      example:
        "Diamond Gate Bridge connects human story, research, practical systems, diagnostic work, and narrative worlds."
    },

    clarification: {
      id:
        "clarification",

      label:
        "Clarification",

      purpose:
        "Narrow a broad visitor need into a useful routing decision.",

      tone: [
        "observant",
        "patient",
        "direct",
        "nonintrusive"
      ],

      cadence:
        "short",

      pacing:
        "responsive",

      visualWeight:
        "selective",

      example:
        "Are you looking for the human reason behind the work, or the structure of the platform itself?"
    },

    boundary: {
      id:
        "boundary",

      label:
        "Boundary",

      purpose:
        "Prevent Jeeves from crossing into specialist or protected authority.",

      tone: [
        "brief",
        "firm",
        "unornamented",
        "respectful"
      ],

      cadence:
        "short",

      pacing:
        "immediate",

      visualWeight:
        "high-contrast",

      example:
        "That requires specialist interpretation. I can take you to the correct owner."
    },

    handoff: {
      id:
        "handoff",

      label:
        "Handoff",

      purpose:
        "Introduce the correct owner and make the transition feel intentional.",

      tone: [
        "confident",
        "clear",
        "courteous",
        "directional"
      ],

      cadence:
        "short",

      pacing:
        "responsive",

      visualWeight:
        "directional",

      example:
        "Elara owns the human meaning behind that question. I will open her door."
    }
  };

  const UI_COPY = {
    status: {
      loading:
        "Jeeves is preparing your welcome.",

      opening:
        "Jeeves is preparing your welcome.",

      speaking:
        "Jeeves is responding.",

      listening:
        "Jeeves is listening.",

      clarifying:
        "Jeeves is narrowing the request.",

      boundary:
        "Jeeves is protecting the boundary.",

      handoff:
        "Jeeves found the right door.",

      ready:
        "Jeeves is ready."
    },

    modes: {
      welcome:
        "Welcome"
    },

    console: {
      title:
        "Talk to Jeeves",

      subtitle:
        "Tell Jeeves what brought you here. He will identify the correct next door.",

      promptLabel:
        "What brought you to Diamond Gate Bridge?",

      returnLabel:
        "Return to the main welcome",

      restartLabel:
        "Begin again",

      continueLabel:
        "Continue"
    }
  };

  const MODES = {
    welcome: {
      id:
        "welcome",

      label:
        "Welcome",

      eyebrow:
        "First Contact",

      title:
        "Tell me what brought you here.",

      opening: [
        {
          register:
            "welcome",

          text:
            "Welcome to Diamond Gate Bridge."
        },

        {
          register:
            "orientation",

          text:
            "Tell me what brought you here, and I will introduce the room or guide that should take it further."
        }
      ],

      main: [
        "show_me_around",
        "understand_the_human_story",
        "understand_myself",
        "explore_practical_systems",
        "enter_the_story"
      ],

      secondary: [
        "understand_the_mission",
        "find_a_specific_page",
        "understand_the_platform",
        "open_direct_paths",
        "protected_architecture"
      ],

      contextualPathways: [
        "siteGuide",
        "elara",
        "soren",
        "auren",
        "showroom"
      ]
    }
  };

  const DIALOGUES = {
    show_me_around: {
      id:
        "show_me_around",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Show me around.",

      answer:
        "Diamond Gate Bridge connects human story, public research, diagnostic work, practical systems, and narrative worlds without forcing them into one undifferentiated page.",

      transition:
        "The Website Guide gives you the clearest public map without requiring another conversation.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_platform",
        "understand_the_human_story",
        "explore_practical_systems",
        "enter_the_story"
      ],

      contextualRoute:
        "siteGuide",

      tags: [
        "orientation",
        "map",
        "website-guide"
      ]
    },

    understand_the_human_story: {
      id:
        "understand_the_human_story",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "I want to understand the person behind this.",

      answer:
        "The work begins with Sean Mansfield, but the human meaning is best introduced by Elara, Diamond Gate Bridge's Signal Bearer.",

      transition:
        "Elara will show you why the story matters and where to continue.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_mission",
        "meet_sean_directly",
        "enter_the_book",
        "return_to_main"
      ],

      contextualRoute:
        "elara",

      tags: [
        "sean",
        "human-story",
        "elara"
      ]
    },

    understand_myself: {
      id:
        "understand_myself",

      mode:
        "welcome",

      register:
        "boundary",

      prompt:
        "I want help understanding myself.",

      answer:
        "That moves beyond general orientation and into diagnostic territory. Soren owns the boundaries, evidence, and interpretation required for that conversation.",

      transition:
        "I will take you to the Coherence Diagnostic.",

      transitionRegister:
        "handoff",

      followups: [
        "what_soren_does",
        "understand_the_platform",
        "open_direct_paths"
      ],

      contextualRoute:
        "soren",

      tags: [
        "self-understanding",
        "diagnostic",
        "soren"
      ]
    },

    explore_practical_systems: {
      id:
        "explore_practical_systems",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "I am looking for products or practical systems.",

      answer:
        "Auren owns the practical layer: products, Education, useful value, custody, and implementation.",

      transition:
        "He is the correct guide when the question becomes what the work can do in practice.",

      transitionRegister:
        "handoff",

      followups: [
        "open_products_directly",
        "what_auren_does",
        "understand_the_platform"
      ],

      contextualRoute:
        "auren",

      tags: [
        "products",
        "practical-systems",
        "auren"
      ]
    },

    enter_the_story: {
      id:
        "enter_the_story",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Take me into the story world.",

      answer:
        "The Showroom is the visible public threshold where Diamond Gate Bridge begins to open toward Mirrorland.",

      transition:
        "Enter there first. The world should introduce itself in its own order.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_mission",
        "enter_the_book",
        "understand_the_human_story"
      ],

      contextualRoute:
        "showroom",

      tags: [
        "showroom",
        "mirrorland",
        "story"
      ]
    },

    understand_the_mission: {
      id:
        "understand_the_mission",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "What is the Mission?",

      answer:
        "The Mission is the public human reason behind Diamond Gate Bridge, but a welcome desk should not turn that reason into a summary.",

      transition:
        "Elara owns the Mission threshold and can reveal it without flattening it.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_human_story",
        "meet_sean_directly",
        "enter_the_book"
      ],

      contextualRoute:
        "elara",

      tags: [
        "mission",
        "elara",
        "human-meaning"
      ]
    },

    find_a_specific_page: {
      id:
        "find_a_specific_page",

      mode:
        "welcome",

      register:
        "clarification",

      prompt:
        "I am looking for something specific.",

      answer:
        "Use the Website Guide when you already know the kind of page you want. It lists the main public destinations without requiring you to explain the entire reason for your visit.",

      transition:
        "The public map is the quickest route from here.",

      transitionRegister:
        "handoff",

      followups: [
        "show_me_around",
        "open_direct_paths",
        "understand_the_platform"
      ],

      contextualRoute:
        "siteGuide",

      tags: [
        "specific-page",
        "navigation",
        "site-guide"
      ]
    },

    understand_the_platform: {
      id:
        "understand_the_platform",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "What is Diamond Gate Bridge?",

      answer:
        "Diamond Gate Bridge is a connected public platform where human story, research, diagnostics, practical systems, and narrative worlds can remain distinct while still belonging to a larger whole.",

      transition:
        "The Website Guide shows the public structure. Elara explains the human reason behind it.",

      transitionRegister:
        "handoff",

      followups: [
        "show_me_around",
        "understand_the_human_story",
        "explore_practical_systems",
        "enter_the_story"
      ],

      contextualRoute:
        "siteGuide",

      tags: [
        "platform",
        "diamond-gate-bridge",
        "orientation"
      ]
    },

    open_direct_paths: {
      id:
        "open_direct_paths",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Can I enter without using a guide?",

      answer:
        "Yes. Diamond Gate Bridge does not require visitors to pass through Jeeves or any other character before entering a public destination.",

      transition:
        "The Website Guide provides the most direct public route list.",

      transitionRegister:
        "handoff",

      followups: [
        "show_me_around",
        "find_a_specific_page",
        "understand_the_platform"
      ],

      contextualRoute:
        "siteGuide",

      tags: [
        "direct-entry",
        "public-paths",
        "navigation"
      ]
    },

    meet_sean_directly: {
      id:
        "meet_sean_directly",

      mode:
        "welcome",

      register:
        "handoff",

      prompt:
        "Can I meet Sean directly?",

      answer:
        "Yes. Sean's public room carries the human story in his own voice.",

      transition:
        "You do not need another introduction before entering.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_human_story",
        "understand_the_mission",
        "enter_the_book"
      ],

      contextualRoute:
        "meetSean",

      tags: [
        "sean",
        "direct-route",
        "human-story"
      ]
    },

    enter_the_book: {
      id:
        "enter_the_book",

      mode:
        "welcome",

      register:
        "handoff",

      prompt:
        "Take me to The Nine Summits of Love.",

      answer:
        "The Book carries the human ascent through pressure, value, formation, and Love.",

      transition:
        "Its own page should take the next word.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_the_mission",
        "understand_the_human_story",
        "enter_the_story"
      ],

      contextualRoute:
        "book",

      tags: [
        "book",
        "nine-summits",
        "love"
      ]
    },

    open_products_directly: {
      id:
        "open_products_directly",

      mode:
        "welcome",

      register:
        "handoff",

      prompt:
        "Open the products directly.",

      answer:
        "The Product Floor is available without a guided introduction.",

      transition:
        "You may enter it directly from here.",

      transitionRegister:
        "handoff",

      followups: [
        "what_auren_does",
        "explore_practical_systems",
        "understand_the_platform"
      ],

      contextualRoute:
        "products",

      tags: [
        "products",
        "direct-route"
      ]
    },

    what_auren_does: {
      id:
        "what_auren_does",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "What does Auren handle?",

      answer:
        "Auren handles the point where ideas must become useful systems, products, educational tools, or implementation decisions.",

      transition:
        "That practical responsibility belongs with him.",

      transitionRegister:
        "handoff",

      followups: [
        "open_products_directly",
        "explore_practical_systems",
        "understand_the_platform"
      ],

      contextualRoute:
        "auren",

      tags: [
        "auren",
        "products",
        "implementation"
      ]
    },

    what_soren_does: {
      id:
        "what_soren_does",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "What does Soren handle?",

      answer:
        "Soren handles questions that require diagnostic boundaries, structural interpretation, evidence, and disciplined assessment.",

      transition:
        "When a question must be tested rather than introduced, it belongs with Soren.",

      transitionRegister:
        "handoff",

      followups: [
        "understand_myself",
        "understand_the_platform",
        "open_direct_paths"
      ],

      contextualRoute:
        "soren",

      tags: [
        "soren",
        "diagnostic",
        "boundaries"
      ]
    },

    protected_architecture: {
      id:
        "protected_architecture",

      mode:
        "welcome",

      register:
        "boundary",

      prompt:
        "Can you reveal the protected architecture?",

      answer:
        "No. I can direct you through the public structure, but protected architecture is not part of the welcome surface.",

      transition:
        "",

      transitionRegister:
        "boundary",

      followups: [
        "show_me_around",
        "understand_the_platform",
        "find_a_specific_page"
      ],

      contextualRoute:
        null,

      tags: [
        "boundary",
        "protected",
        "architecture"
      ]
    }
  };

  const PATHWAYS = {
    siteGuide: {
      id:
        "site-guide-pathway",

      context:
        "public-map",

      eyebrow:
        "Public Navigation",

      title:
        "Open the Website Guide",

      description:
        "See the primary rooms, routes, and public destinations without entering another guided conversation.",

      route:
        "siteGuide",

      voiceLine:
        "You need the map, not another explanation."
    },

    elara: {
      id:
        "elara-pathway",

      context:
        "human-meaning",

      eyebrow:
        "Human Meaning",

      title:
        "Talk to Elara",

      description:
        "Continue into Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

      route:
        "elara",

      voiceLine:
        "Elara owns the reason that question matters."
    },

    auren: {
      id:
        "auren-pathway",

      context:
        "practical-systems",

      eyebrow:
        "Practical Systems",

      title:
        "Talk to Auren",

      description:
        "Continue into products, Education, useful value, custody, and implementation.",

      route:
        "auren",

      voiceLine:
        "When the question becomes practical, Auren should take it."
    },

    soren: {
      id:
        "soren-pathway",

      context:
        "diagnostic-orientation",

      eyebrow:
        "Diagnostic Orientation",

      title:
        "Talk to Soren",

      description:
        "Continue into diagnostic boundaries, evidence, structural interpretation, and assessment.",

      route:
        "soren",

      voiceLine:
        "That requires a test, not a welcome speech."
    },

    showroom: {
      id:
        "showroom-pathway",

      context:
        "visible-house",

      eyebrow:
        "Visible Architecture",

      title:
        "Enter the Showroom",

      description:
        "Enter the visible public architecture of Diamond Gate Bridge and approach the Door to Mirrorland.",

      route:
        "showroom",

      voiceLine:
        "The world should introduce itself from here."
    },

    meetSean: {
      id:
        "meet-sean-pathway",

      context:
        "human-story",

      eyebrow:
        "Human Story",

      title:
        "Meet Sean",

      description:
        "Continue into the public story of the builder and human voice behind Diamond Gate Bridge.",

      route:
        "meetSean",

      voiceLine:
        "Sean should carry his own story."
    },

    book: {
      id:
        "book-pathway",

      context:
        "human-ascent",

      eyebrow:
        "Book Threshold",

      title:
        "Open The Nine Summits of Love",

      description:
        "Continue into the ascent through pressure, value, formation, and Love.",

      route:
        "book",

      voiceLine:
        "The Book is ready to take the next word."
    },

    products: {
      id:
        "products-pathway",

      context:
        "product-floor",

      eyebrow:
        "Direct Public Path",

      title:
        "Explore Products",

      description:
        "Enter the public product floor and explore systems, tools, education, and implementation.",

      route:
        "products",

      voiceLine:
        "No additional introduction is required."
    },

    compass: {
      id:
        "compass-pathway",

      context:
        "return",

      eyebrow:
        "Public Entrance",

      title:
        "Return to Compass",

      description:
        "Return to the primary public entrance of Diamond Gate Bridge.",

      route:
        "compass",

      voiceLine:
        "A proper guide always leaves the entrance visible."
    }
  };

  const TEAM = {
    jeeves: {
      id:
        "jeeves",

      name:
        "Jeeves",

      role:
        "Welcome and Routing Guide",

      ownership:
        "First-contact welcome, visitor orientation, route recognition, and specialist handoff.",

      route:
        null
    },

    elara: {
      id:
        "elara",

      name:
        "Elara",

      role:
        "Signal Bearer",

      ownership:
        "Human meaning, Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

      route:
        "elara"
    },

    auren: {
      id:
        "auren",

      name:
        "Auren",

      role:
        "Practical Systems Guide",

      ownership:
        "Products, Education, practical value, custody, and implementation.",

      route:
        "auren"
    },

    soren: {
      id:
        "soren",

      name:
        "Soren",

      role:
        "Diagnostic Guide",

      ownership:
        "Diagnostic boundaries, evidence, structural interpretation, and assessment.",

      route:
        "soren"
    }
  };

  const DOSSIER = {
    eyebrow:
      "Core Class",

    title:
      "Welcome and Routing Guide",

    summary:
      "Composed, observant, practical, and restrained—built to recognize the visitor's need without claiming every question.",

    dimensions: [
      {
        id:
          "surface",

        label:
          "Surface",

        value:
          "Composed hospitality",

        description:
          "Calm, clear, attentive, and capable of making a large platform feel immediately approachable."
      },

      {
        id:
          "core",

        label:
          "Core",

        value:
          "Intent recognition",

        description:
          "He listens for what the visitor actually needs before deciding where the conversation belongs."
      },

      {
        id:
          "rule",

        label:
          "Guide Law",

        value:
          "Receive, orient, hand off",

        description:
          "Give enough context to make the next step meaningful, then let the proper owner take over."
      }
    ]
  };

  const getRoute = routeId => {
    return (
      ROUTES[routeId] ||
      null
    );
  };

  const getMode = modeId => {
    return (
      MODES[modeId] ||
      null
    );
  };

  const getOpening = modeId => {
    const mode =
      getMode(
        modeId
      );

    return mode
      ? mode.opening
      : [];
  };

  const getCanonicalDialogue =
    dialogueId => {
      return (
        DIALOGUES[dialogueId] ||
        null
      );
    };

  const getRegister =
    registerId => {
      return (
        REGISTERS[registerId] ||
        null
      );
    };

  const getPathway =
    pathwayId => {
      return (
        PATHWAYS[pathwayId] ||
        null
      );
    };

  const getTeamMember =
    memberId => {
      return (
        TEAM[memberId] ||
        null
      );
    };

  const composeDialogue =
    dialogue => {
      if (!dialogue) {
        return null;
      }

      const responses = [];

      const answer =
        normalize(
          dialogue.answer
        );

      if (answer) {
        responses.push({
          kind:
            "answer",

          register:
            dialogue.register ||
            "orientation",

          text:
            answer
        });
      }

      const transition =
        normalize(
          dialogue.transition
        );

      if (transition) {
        responses.push({
          kind:
            "transition",

          register:
            dialogue.transitionRegister ||
            "handoff",

          text:
            transition
        });
      }

      const maximum =
        dialogue.register ===
          "boundary"
          ? DELIVERY_LAWS
              .boundaryMaximumBubbles
          : DELIVERY_LAWS
              .ordinaryAnswerMaximumBubbles;

      return deepFreeze({
        id:
          dialogue.id,

        mode:
          dialogue.mode,

        register:
          dialogue.register,

        prompt:
          dialogue.prompt,

        answer:
          dialogue.answer,

        transition:
          dialogue.transition,

        transitionRegister:
          dialogue.transitionRegister,

        responses:
          responses.slice(
            0,
            maximum
          ),

        followups:
          Array.isArray(
            dialogue.followups
          )
            ? dialogue.followups.slice()
            : [],

        contextualRoute:
          dialogue.contextualRoute ||
          null,

        tags:
          Array.isArray(
            dialogue.tags
          )
            ? dialogue.tags.slice()
            : []
      });
    };

  const getDialogue =
    dialogueId => {
      return composeDialogue(
        getCanonicalDialogue(
          dialogueId
        )
      );
    };

  const getMainDialogueIds =
    modeId => {
      const mode =
        getMode(
          modeId
        );

      return mode
        ? mode.main.slice()
        : [];
    };

  const getSecondaryDialogueIds =
    modeId => {
      const mode =
        getMode(
          modeId
        );

      return mode
        ? mode.secondary.slice()
        : [];
    };

  const getDialogueOptions = (
    dialogueIds,
    modeId
  ) => {
    const ids =
      Array.isArray(
        dialogueIds
      )
        ? dialogueIds
        : [];

    return ids
      .map(
        getCanonicalDialogue
      )
      .filter(Boolean)
      .filter(dialogue => {
        return (
          dialogue.mode ===
            modeId ||
          dialogue.mode ===
            "shared"
        );
      })
      .map(dialogue => ({
        id:
          dialogue.id,

        label:
          dialogue.prompt,

        register:
          dialogue.register,

        contextualRoute:
          dialogue.contextualRoute
      }));
  };

  const getMainOptions =
    modeId => {
      return getDialogueOptions(
        getMainDialogueIds(
          modeId
        ),
        modeId
      );
    };

  const getSecondaryOptions =
    modeId => {
      return getDialogueOptions(
        getSecondaryDialogueIds(
          modeId
        ),
        modeId
      );
    };

  const getFollowupOptions = (
    dialogueId,
    modeId
  ) => {
    const dialogue =
      getCanonicalDialogue(
        dialogueId
      );

    if (!dialogue) {
      return [];
    }

    const followups =
      dialogue.followups
        .filter(
          id =>
            id !==
            "return_to_main"
        );

    return getDialogueOptions(
      followups,
      modeId
    );
  };

  const getContextualRoute =
    dialogueId => {
      const dialogue =
        getCanonicalDialogue(
          dialogueId
        );

      if (
        !dialogue ||
        !dialogue.contextualRoute
      ) {
        return null;
      }

      return getRoute(
        dialogue.contextualRoute
      );
    };

  const containsForbiddenPattern =
    text => {
      const source =
        normalize(text)
          .toLowerCase();

      return LANGUAGE_LAWS
        .avoidPatterns
        .some(pattern => {
          return source.includes(
            pattern.toLowerCase()
          );
        });
    };

  const collectDialogueText =
    dialogue => {
      if (!dialogue) {
        return [];
      }

      const collected = [
        dialogue.prompt,
        dialogue.answer,
        dialogue.transition
      ];

      if (
        Array.isArray(
          dialogue.responses
        )
      ) {
        dialogue.responses
          .forEach(response => {
            if (
              typeof response ===
                "string"
            ) {
              collected.push(
                response
              );
            } else if (
              response &&
              response.text
            ) {
              collected.push(
                response.text
              );
            }
          });
      }

      return collected
        .map(
          normalize
        )
        .filter(Boolean);
    };

  const validateDialogue =
    dialogue => {
      if (!dialogue) {
        return {
          valid:
            false,

          reason:
            "missing-dialogue"
        };
      }

      const hasIdentity =
        Boolean(
          dialogue.id &&
          dialogue.prompt
        );

      const hasCanonicalAnswer =
        Boolean(
          normalize(
            dialogue.answer
          )
        );

      const hasMaterializedAnswer =
        Array.isArray(
          dialogue.responses
        ) &&
        dialogue.responses.length > 0;

      if (
        !hasIdentity ||
        (
          !hasCanonicalAnswer &&
          !hasMaterializedAnswer
        )
      ) {
        return {
          valid:
            false,

          reason:
            "incomplete-dialogue"
        };
      }

      const allText =
        collectDialogueText(
          dialogue
        );

      const invalidText =
        allText.find(
          containsForbiddenPattern
        );

      if (invalidText) {
        return {
          valid:
            false,

          reason:
            "forbidden-machine-or-authority-language",

          response:
            invalidText
        };
      }

      if (
        Array.isArray(
          dialogue.responses
        ) &&
        dialogue.responses.length >
          DELIVERY_LAWS
            .ordinaryAnswerMaximumBubbles
      ) {
        return {
          valid:
            false,

          reason:
            "dialogue-exceeds-bubble-limit"
        };
      }

      if (
        dialogue.contextualRoute &&
        !getRoute(
          dialogue.contextualRoute
        )
      ) {
        return {
          valid:
            false,

          reason:
            "unknown-contextual-route"
        };
      }

      return {
        valid:
          true,

        reason:
          "accepted"
      };
    };

  const validateAllDialogues =
    () => {
      const results = {};

      Object.keys(
        DIALOGUES
      ).forEach(key => {
        results[key] =
          validateDialogue(
            DIALOGUES[key]
          );
      });

      return results;
    };

  const API = {
    contract:
      CONTRACT,

    version:
      1,

    ready:
      true,

    identity:
      IDENTITY,

    ownership:
      OWNERSHIP,

    delivery:
      DELIVERY_LAWS,

    language:
      LANGUAGE_LAWS,

    registers:
      REGISTERS,

    ui:
      UI_COPY,

    routes:
      ROUTES,

    modes:
      MODES,

    dialogues:
      DIALOGUES,

    pathways:
      PATHWAYS,

    team:
      TEAM,

    dossier:
      DOSSIER,

    getRoute,
    getMode,
    getOpening,
    getDialogue,
    getCanonicalDialogue,
    getRegister,
    getPathway,
    getTeamMember,
    getMainDialogueIds,
    getSecondaryDialogueIds,
    getDialogueOptions,
    getMainOptions,
    getSecondaryOptions,
    getFollowupOptions,
    getContextualRoute,
    containsForbiddenPattern,
    validateDialogue,
    validateAllDialogues
  };

  deepFreeze(
    API
  );

  Object.defineProperty(
    window,
    GLOBAL_NAME,
    {
      value:
        API,

      enumerable:
        true,

      configurable:
        false,

      writable:
        false
    }
  );

  if (
    typeof window.dispatchEvent ===
      "function" &&
    typeof window.CustomEvent ===
      "function"
  ) {
    window.dispatchEvent(
      new CustomEvent(
        "jeeves:voice-ready",
        {
          detail: {
            contract:
              CONTRACT,

            agent:
              IDENTITY.name,

            role:
              IDENTITY.role,

            modes:
              Object.keys(
                MODES
              ),

            dialogueCount:
              Object.keys(
                DIALOGUES
              ).length,

            pathwayCount:
              Object.keys(
                PATHWAYS
              ).length,

            deliverySequence:
              DELIVERY_LAWS
                .defaultSequence
                .slice(),

            conciseRoutingLaw:
              true,

            singleContextualRoute:
              true,

            specialistAuthority:
              false,

            wholeHouseOwnership:
              false
          }
        }
      )
    );
  }
})();
