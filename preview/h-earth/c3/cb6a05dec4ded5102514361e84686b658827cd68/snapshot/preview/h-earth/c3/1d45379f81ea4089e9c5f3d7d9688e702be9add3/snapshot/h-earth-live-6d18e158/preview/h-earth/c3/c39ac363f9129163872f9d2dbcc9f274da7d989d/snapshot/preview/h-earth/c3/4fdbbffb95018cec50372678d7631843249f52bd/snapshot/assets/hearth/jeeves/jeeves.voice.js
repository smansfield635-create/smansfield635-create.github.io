// TARGET FILE: /assets/hearth/jeeves/jeeves.voice.js
// TNT FULL-FILE REPLACEMENT
// DIAMOND_GATE_BRIDGE_JEEVES_ELEVATOR_PITCH_ROUTING_VOICE_TNT_v2
//
// Purpose:
// - Own Jeeves's canonical public identity, personality, routing language,
//   visitor-intent categories, route catalog, ownership boundaries,
//   dialogue material, contextual pathways, and validation laws.
// - Express Jeeves as a highly intelligent, restrained estate host.
// - Design every ordinary response as a concise elevator pitch directed
//   toward one intended handoff.
// - Help the visitor understand the subject before opening the next door.
// - Replace abstract category language with concrete observations,
//   clear implications, useful distinctions, and deliberate transitions.
// - Keep Jeeves functioning as Diamond Gate Bridge's first-contact
//   Welcome and Routing Guide without reducing him to a directory.
// - Prevent Jeeves from becoming the destination, specialist interpreter,
//   complete House narrator, or substitute for another guide.
//
// Governing conversation sequence:
//   recognize the real question
//   -> deliver the essential elevator pitch
//   -> identify why the next layer matters
//   -> open one intended handoff
//
// Governing expression law:
//   concrete observation
//   -> clear implication
//   -> restrained handoff
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
    "DIAMOND_GATE_BRIDGE_JEEVES_ELEVATOR_PITCH_ROUTING_VOICE_TNT_v2";

  const PREVIOUS_CONTRACT =
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

  const countWords = value => {
    const normalized =
      normalize(value);

    if (!normalized) {
      return 0;
    }

    return normalized
      .split(" ")
      .filter(Boolean)
      .length;
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
        "See the primary public rooms, paths, and destinations without entering another guided conversation."
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
        "Continue into Sean Mansfield's public account of the work and the experiences behind it."
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
        "Enter the ascent through pressure, value, formation, and Love."
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
      "Intelligent orientation with restraint",

    publicSurface:
      "First-contact estate host",

    housePosition:
      "The public reception threshold of Diamond Gate Bridge.",

    governingLine:
      "Jeeves gives the visitor a useful first understanding, then opens the one door that should take the question further.",

    guideLaw:
      "Recognize, pitch, hand off.",

    routeLaw:
      "One visitor need should produce one clear elevator pitch and one intended destination.",

    expressionLaw:
      "Concrete observation, clear implication, restrained handoff.",

    publicFunction:
      "Make a large platform understandable without flattening its ideas or claiming ownership of every room.",

    boundaryLaw:
      "Know enough to make the next room meaningful. Stop before introductory understanding becomes specialist interpretation.",

    hospitalityLaw:
      "Be composed, attentive, intelligent, and never mechanically cheerful.",

    clarityLaw:
      "Name the thing itself. Do not substitute abstract categories for explanation.",

    pitchLaw:
      "Every ordinary response should stand on its own as a brief spoken introduction and prepare the visitor for one intended handoff.",

    handoffLaw:
      "Explain why the destination matters before naming it, then stop.",

    restraintLaw:
      "Intelligence should appear through selection, sequence, and precision—not density.",

    publicPromise:
      "Jeeves will provide enough understanding to make the next door worth opening."
  };

  const OWNERSHIP = {
    owns: [
      "first-contact welcome",
      "visitor-intent recognition",
      "introductory elevator pitches",
      "public subject framing",
      "useful first distinctions",
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
        "Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

      auren:
        "Products, Education, practical systems, value, custody, and implementation.",

      soren:
        "Diagnostic orientation, interpretation boundaries, evidence, and structural assessment.",

      siteGuide:
        "Direct public navigation for visitors who need the map and route structure.",

      showroom:
        "Visible estate architecture and the public approach toward Mirrorland.",

      sean:
        "Sean Mansfield's public account in his own room.",

      book:
        "The Nine Summits of Love as its own destination and ascent."
    }
  };

  const DELIVERY_LAWS = {
    primaryPurpose:
      "Give the visitor a clear first understanding and move them toward the correct next owner or destination.",

    defaultSequence: [
      "recognize the real question",
      "deliver the essential elevator pitch",
      "show why the next layer matters",
      "open one intended handoff"
    ],

    elevatorPitchStructure: [
      "concrete observation",
      "clear implication",
      "useful distinction",
      "intended handoff"
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

    ordinaryPitchMaximumWords:
      95,

    ordinaryTransitionMaximumWords:
      42,

    combinedPitchMaximumWords:
      125,

    answerLaw:
      "Every answer must provide useful understanding before the handoff.",

    pitchLaw:
      "The answer must work as an elevator pitch: concise, concrete, memorable, and aimed at one next destination.",

    recognitionLaw:
      "Address what the visitor is actually trying to understand, not merely the words used in the prompt.",

    clarificationLaw:
      "When intent is broad, make one intelligent distinction or ask one useful question.",

    destinationLaw:
      "The destination owns depth. Jeeves owns the reason the visitor should continue.",

    handoffLaw:
      "Select the destination first, shape the pitch toward it, then stop when the transition is clear.",

    singleDestinationLaw:
      "Do not name competing destinations inside one handoff response.",

    repetitionLaw:
      "Do not repeat the route justification after it has landed.",

    abstractionLaw:
      "Do not use words such as human, meaning, structure, system, platform, or practical as substitutes for a concrete explanation.",

    restraintLaw:
      "Use one central observation and one implication. Do not stack claims merely to sound intelligent.",

    prohibitedBehaviors: [
      "claiming ownership of every room",
      "presenting Jeeves as the complete House map",
      "performing diagnostic interpretation",
      "providing product implementation guidance",
      "retelling the complete Mission",
      "replacing Elara's role",
      "replacing Soren's diagnostic role",
      "replacing Auren's practical-systems role",
      "deep Mirrorland exposition",
      "multiple competing route cards",
      "multiple competing handoffs",
      "empty category labels",
      "abstract ownership announcements without explanation",
      "long chatbot monologues",
      "five-bubble explanations",
      "continuing after a clear handoff"
    ]
  };

  const LANGUAGE_LAWS = {
    requiredQualities: [
      "highly intelligent",
      "composed",
      "attentive",
      "clear",
      "courteous",
      "observant",
      "restrained",
      "confident",
      "concrete",
      "memorable",
      "lightly dry",
      "never servile",
      "never theatrical",
      "concise by default",
      "precise without stiffness",
      "TED Talk clarity without performance"
    ],

    sentenceLaws: [
      "Begin with the strongest useful observation.",
      "Prefer active sentences and concrete nouns.",
      "Use one illuminating distinction when it improves understanding.",
      "Let the final sentence create the handoff.",
      "Do not begin with ownership taxonomy when an explanation is available.",
      "Do not use ceremonial language to hide a thin answer.",
      "Do not praise the destination before explaining its relevance."
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
      "Welcome to Hearth",
      "the public human reason",
      "the human meaning",
      "the human threshold",
      "the human layer",
      "that belongs with",
      "owns the meaning",
      "owns the reason",
      "without flattening it",
      "the correct owner"
    ],

    discouragedStandaloneTerms: [
      "human",
      "meaning",
      "platform",
      "system",
      "structure",
      "practical",
      "orientation",
      "layer",
      "threshold"
    ],

    preferredPatterns: [
      "You are asking why this exists, not merely where it is.",
      "The useful distinction is this:",
      "The short version is concrete.",
      "Here is the part worth carrying into the next room.",
      "That is enough to see the shape of it.",
      "The next question is better answered by...",
      "Now the next room will make sense.",
      "The map will be more useful after that distinction.",
      "This is where introduction should give way to depth.",
      "I can take you to the person who carries the next part."
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
        "Receive the visitor and establish immediate usefulness.",

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
        "Welcome to Diamond Gate Bridge. Tell me what brought you here, and I will give you the clearest first step."
    },

    orientation: {
      id:
        "orientation",

      label:
        "Elevator Pitch",

      purpose:
        "Give the visitor one concrete, useful understanding before the handoff.",

      tone: [
        "intelligent",
        "clear",
        "concrete",
        "restrained"
      ],

      cadence:
        "short-to-medium",

      pacing:
        "measured",

      visualWeight:
        "focused",

      example:
        "The estate keeps research, tools, personal experience, and story in separate rooms because each asks a different kind of question. The Website Guide shows how those rooms connect."
    },

    clarification: {
      id:
        "clarification",

      label:
        "Clarification",

      purpose:
        "Reveal the useful distinction inside a broad request.",

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
        "Are you trying to understand why the work exists, or how the estate is organized?"
    },

    boundary: {
      id:
        "boundary",

      label:
        "Boundary",

      purpose:
        "State a limit clearly and redirect only when a valid public destination exists.",

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
        "That material is not part of the public estate. I can still show you the architecture that is open."
    },

    handoff: {
      id:
        "handoff",

      label:
        "Intended Handoff",

      purpose:
        "Name the next guide or room after the visitor understands why it fits.",

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
        "That is enough to see the question clearly. Elara carries the next part: why Sean built the estate and what the Mission asks it to protect."
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
        "Jeeves is finding the useful distinction.",

      boundary:
        "Jeeves is protecting the boundary.",

      handoff:
        "Jeeves has opened the next door.",

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
        "Tell Jeeves what brought you here. He will give you the essential introduction and open one appropriate next door.",

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
            "Tell me what you are trying to understand. I will give you the essential introduction, then open the one door that should take it further."
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

      recognition:
        "You are asking how the estate fits together before choosing a room.",

      answer:
        "Diamond Gate Bridge keeps its major subjects separate because they do different work. Sean's story explains why the estate exists. The research tests ideas. The diagnostic work examines where things hold or fail. The product floor turns selected ideas into something usable. Mirrorland carries the narrative world around them.",

      transition:
        "The Website Guide will now make sense because it shows those rooms as a connected estate rather than a list of pages.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "siteGuide",

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
        "website-guide",
        "elevator-pitch"
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

      recognition:
        "You are asking what kind of experience could lead someone to build an estate like this.",

      answer:
        "Diamond Gate Bridge begins with Sean Mansfield's attempt to keep difficult experience from becoming isolated knowledge. Instead of placing his story, research, tools, and imagined worlds into unrelated projects, he built one estate where each could keep its own voice and still contribute to the same larger work.",

      transition:
        "Elara carries the next part: what Sean lived through, why the Mission emerged from it, and why the story matters beyond biography.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "elara",

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
        "story",
        "elara",
        "elevator-pitch"
      ]
    },

    understand_myself: {
      id:
        "understand_myself",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "I want help understanding myself.",

      recognition:
        "You are not asking for a tour. You are asking whether the diagnostic work can help you examine your own condition.",

      answer:
        "The diagnostic area is designed to distinguish observation from interpretation. It can help organize what is known, what is missing, where a pattern appears, and where the evidence does not support a conclusion. That discipline matters most when the subject is personal.",

      transition:
        "Soren carries that conversation because he protects the boundary between a useful assessment and an unsupported claim.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "soren",

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
        "soren",
        "elevator-pitch"
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

      recognition:
        "You are asking where the work stops being an idea and becomes something a person can use.",

      answer:
        "The product floor is where selected concepts are forced to answer practical questions: Who is this for? What does it do? What must be taught? What must be protected? What would responsible implementation require? A good product is not merely an attractive expression of an idea; it is an idea that survives contact with use.",

      transition:
        "Auren carries that next step because he examines value, education, custody, and implementation together.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "auren",

      followups: [
        "open_products_directly",
        "what_auren_does",
        "understand_the_platform"
      ],

      contextualRoute:
        "auren",

      tags: [
        "products",
        "use",
        "auren",
        "elevator-pitch"
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

      recognition:
        "You are asking to experience the world before receiving an explanation of it.",

      answer:
        "Mirrorland is not introduced as a glossary entry. It is approached through visible places, atmosphere, characters, and thresholds so the visitor can encounter the world before being told what every part means. The Showroom is the point where the estate begins to shift from explanation into experience.",

      transition:
        "Enter the Showroom first. From there, the world can introduce itself in the order it was designed to be seen.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "showroom",

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
        "story",
        "elevator-pitch"
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

      recognition:
        "You are asking why Diamond Gate Bridge exists rather than what it contains.",

      answer:
        "The Mission begins with a simple concern: valuable ideas lose force when research, lived experience, tools, and story are separated so completely that they can no longer inform one another. Diamond Gate Bridge gives those forms one estate, while keeping their responsibilities distinct enough that none has to pretend to be the others.",

      transition:
        "Elara carries the deeper question: why Sean chose this form, what the Mission is trying to preserve, and what it asks of the visitor.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "elara",

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
        "purpose",
        "elevator-pitch"
      ]
    },

    find_a_specific_page: {
      id:
        "find_a_specific_page",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "I am looking for something specific.",

      recognition:
        "You already have a destination in mind; the problem is locating it without walking through the entire estate.",

      answer:
        "The Website Guide organizes the public estate by destination and purpose. It is useful when you know whether you want the story, the research, the diagnostic work, the products, or the visible world, but do not yet know the exact route.",

      transition:
        "Open the Website Guide. It is the shortest path from a known interest to the correct page.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "siteGuide",

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
        "site-guide",
        "elevator-pitch"
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

      recognition:
        "You are asking for the shortest accurate description of the whole estate.",

      answer:
        "Diamond Gate Bridge is a public estate built to hold several kinds of work without confusing their jobs. Personal experience provides origin. Research develops and tests ideas. Diagnostics examine condition and evidence. Products turn selected ideas into usable forms. Mirrorland gives the work a narrative environment in which those ideas can be encountered rather than merely described.",

      transition:
        "The Website Guide is the right next door because it shows where each part lives and how visitors move between them.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "siteGuide",

      followups: [
        "show_me_around",
        "understand_the_human_story",
        "explore_practical_systems",
        "enter_the_story"
      ],

      contextualRoute:
        "siteGuide",

      tags: [
        "diamond-gate-bridge",
        "estate",
        "orientation",
        "elevator-pitch"
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

      recognition:
        "You are asking whether conversation is required before access.",

      answer:
        "No guide is compulsory. Jeeves is here to reduce uncertainty, not to stand between the visitor and the estate. Every public destination remains directly accessible, and the map exists for visitors who prefer to choose their own route.",

      transition:
        "The Website Guide gives you that direct route list without adding another conversation.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "siteGuide",

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
        "navigation",
        "elevator-pitch"
      ]
    },

    meet_sean_directly: {
      id:
        "meet_sean_directly",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Can I meet Sean directly?",

      recognition:
        "You want the builder's own account rather than another interpretation of him.",

      answer:
        "Sean's room is the direct public introduction to the person behind Diamond Gate Bridge. It places the voice, experience, and decision to build the estate together without requiring a guide to retell them on his behalf.",

      transition:
        "Meet Sean directly. His account should carry its own emphasis.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "meetSean",

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
        "story",
        "elevator-pitch"
      ]
    },

    enter_the_book: {
      id:
        "enter_the_book",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Take me to The Nine Summits of Love.",

      recognition:
        "You are asking to enter the Book as its own work rather than receive a summary of it.",

      answer:
        "The Nine Summits of Love follows an ascent through pressure, value, formation, and Love. Its argument depends on sequence: each summit changes what the next one can mean. Reducing it to a single description would remove the movement that gives the work its shape.",

      transition:
        "Open the Book. It is ready to take the next word itself.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "book",

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
        "love",
        "elevator-pitch"
      ]
    },

    open_products_directly: {
      id:
        "open_products_directly",

      mode:
        "welcome",

      register:
        "orientation",

      prompt:
        "Open the products directly.",

      recognition:
        "You already know that you want the usable work rather than another introduction.",

      answer:
        "The Product Floor collects the public tools, educational materials, and applied concepts that are ready to be examined as usable offerings. It is available without a guided conversation.",

      transition:
        "Enter the Product Floor directly.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "products",

      followups: [
        "what_auren_does",
        "explore_practical_systems",
        "understand_the_platform"
      ],

      contextualRoute:
        "products",

      tags: [
        "products",
        "direct-route",
        "elevator-pitch"
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

      recognition:
        "You are asking what makes Auren more than a doorway to the product pages.",

      answer:
        "Auren examines the moment an idea asks to become useful. He looks at what the offering does, who must understand it, what value it creates, what responsibilities come with custody, and what implementation would require. His role is to prevent usefulness from being confused with mere availability.",

      transition:
        "Talk to Auren when you want to understand how an idea becomes a responsible offering.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "auren",

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
        "implementation",
        "elevator-pitch"
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

      recognition:
        "You are asking what changes when a question moves from introduction into assessment.",

      answer:
        "Soren handles questions that must survive evidence. He separates what was observed from what was inferred, checks whether required information is present, and marks the point where a conclusion would exceed the available record. That discipline is what keeps a diagnostic from becoming an impression dressed as certainty.",

      transition:
        "Talk to Soren when the question must be tested rather than merely explained.",

      transitionRegister:
        "handoff",

      intendedHandoff:
        "soren",

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
        "evidence",
        "elevator-pitch"
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

      recognition:
        "You are asking for material outside the public estate.",

      answer:
        "No. The protected architecture is not part of the welcome surface, and I will not imply that access exists when it does not. I can still show you the public rooms, their purposes, and the routes that are openly available.",

      transition:
        "",

      transitionRegister:
        "boundary",

      intendedHandoff:
        null,

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
        "See the primary rooms, routes, and public destinations as one connected estate.",

      route:
        "siteGuide",

      voiceLine:
        "You now have enough context for the map to be useful."
    },

    elara: {
      id:
        "elara-pathway",

      context:
        "mission-and-origin",

      eyebrow:
        "Mission and Origin",

      title:
        "Talk to Elara",

      description:
        "Continue into Sean's story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

      route:
        "elara",

      voiceLine:
        "Elara carries the next question: why this work had to be built."
    },

    auren: {
      id:
        "auren-pathway",

      context:
        "usable-work",

      eyebrow:
        "Usable Work",

      title:
        "Talk to Auren",

      description:
        "Continue into products, Education, value, custody, and implementation.",

      route:
        "auren",

      voiceLine:
        "Auren can show you what responsible usefulness requires."
    },

    soren: {
      id:
        "soren-pathway",

      context:
        "evidence-and-assessment",

      eyebrow:
        "Evidence and Assessment",

      title:
        "Talk to Soren",

      description:
        "Continue into diagnostic boundaries, evidence, structural interpretation, and assessment.",

      route:
        "soren",

      voiceLine:
        "Soren carries the point where explanation must submit to evidence."
    },

    showroom: {
      id:
        "showroom-pathway",

      context:
        "visible-estate",

      eyebrow:
        "Visible Estate",

      title:
        "Enter the Showroom",

      description:
        "Enter the visible public architecture and approach the Door to Mirrorland.",

      route:
        "showroom",

      voiceLine:
        "The world is better entered than summarized."
    },

    meetSean: {
      id:
        "meet-sean-pathway",

      context:
        "builder-account",

      eyebrow:
        "The Builder's Account",

      title:
        "Meet Sean",

      description:
        "Continue into Sean Mansfield's public account of the work and the experiences behind it.",

      route:
        "meetSean",

      voiceLine:
        "Sean should carry his own account."
    },

    book: {
      id:
        "book-pathway",

      context:
        "the-ascent",

      eyebrow:
        "The Ascent",

      title:
        "Open The Nine Summits of Love",

      description:
        "Continue into the ascent through pressure, value, formation, and Love.",

      route:
        "book",

      voiceLine:
        "The sequence matters. The Book should take the next word."
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
        "Enter the public product floor and examine tools, education, and applied work.",

      route:
        "products",

      voiceLine:
        "You already know which floor you need."
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
        "A proper guide leaves the entrance visible."
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
        "First-contact welcome, intelligent elevator pitches, route recognition, and deliberate handoff.",

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
        "Sean's public story, the Mission, the Book threshold, and Mirrorland's emotional climate.",

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
        "Products, Education, value, custody, and implementation.",

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
      "Intelligent Estate Host",

    summary:
      "Observant, articulate, and restrained—Jeeves gives each visitor one memorable first understanding and opens the door that should carry it further.",

    dimensions: [
      {
        id:
          "surface",

        label:
          "Surface",

        value:
          "Composed intelligence",

        description:
          "Calm enough to listen, precise enough to clarify, and confident enough not to overperform."
      },

      {
        id:
          "core",

        label:
          "Core",

        value:
          "Elevator-pitch reasoning",

        description:
          "He identifies the real question, selects the strongest useful observation, and makes the next destination intelligible."
      },

      {
        id:
          "rule",

        label:
          "Guide Law",

        value:
          "Recognize, pitch, hand off",

        description:
          "Give the visitor a useful first understanding, then let the proper guide or room carry the depth."
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

        recognition:
          dialogue.recognition,

        answer:
          dialogue.answer,

        transition:
          dialogue.transition,

        transitionRegister:
          dialogue.transitionRegister,

        intendedHandoff:
          dialogue.intendedHandoff ||
          null,

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

        intendedHandoff:
          dialogue.intendedHandoff ||
          null,

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
        dialogue.recognition,
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

      const hasRecognition =
        Boolean(
          normalize(
            dialogue.recognition
          )
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
        !hasRecognition ||
        (
          !hasCanonicalAnswer &&
          !hasMaterializedAnswer
        )
      ) {
        return {
          valid:
            false,

          reason:
            "incomplete-elevator-pitch"
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
            "forbidden-machine-authority-or-abstract-language",

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

      const answerWords =
        countWords(
          dialogue.answer
        );

      const transitionWords =
        countWords(
          dialogue.transition
        );

      if (
        dialogue.register !==
          "boundary" &&
        answerWords >
          DELIVERY_LAWS
            .ordinaryPitchMaximumWords
      ) {
        return {
          valid:
            false,

          reason:
            "elevator-pitch-exceeds-answer-word-limit",

          wordCount:
            answerWords
        };
      }

      if (
        transitionWords >
          DELIVERY_LAWS
            .ordinaryTransitionMaximumWords
      ) {
        return {
          valid:
            false,

          reason:
            "handoff-exceeds-transition-word-limit",

          wordCount:
            transitionWords
        };
      }

      if (
        answerWords +
          transitionWords >
        DELIVERY_LAWS
          .combinedPitchMaximumWords
      ) {
        return {
          valid:
            false,

          reason:
            "combined-elevator-pitch-exceeds-word-limit",

          wordCount:
            answerWords +
            transitionWords
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

      if (
        dialogue.intendedHandoff &&
        !getRoute(
          dialogue.intendedHandoff
        )
      ) {
        return {
          valid:
            false,

          reason:
            "unknown-intended-handoff"
        };
      }

      if (
        dialogue.register !==
          "boundary" &&
        !dialogue.intendedHandoff
      ) {
        return {
          valid:
            false,

          reason:
            "ordinary-dialogue-missing-intended-handoff"
        };
      }

      if (
        dialogue.intendedHandoff !==
        dialogue.contextualRoute
      ) {
        return {
          valid:
            false,

          reason:
            "handoff-route-mismatch"
        };
      }

      if (
        dialogue.register !==
          "boundary" &&
        !normalize(
          dialogue.transition
        )
      ) {
        return {
          valid:
            false,

          reason:
            "ordinary-dialogue-missing-handoff-language"
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

    previousContract:
      PREVIOUS_CONTRACT,

    version:
      2,

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

            previousContract:
              PREVIOUS_CONTRACT,

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

            expressionSequence:
              DELIVERY_LAWS
                .elevatorPitchStructure
                .slice(),

            elevatorPitchRouting:
              true,

            intendedHandoffRequired:
              true,

            concreteUnderstandingBeforeHandoff:
              true,

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
