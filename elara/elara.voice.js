// TARGET FILE: /elara/elara.voice.js
// TNT FULL-FILE REPLACEMENT
// ELARA_SIGNAL_BEARER_CONCISE_GUIDE_AND_PERSONALITY_FLARE_VOICE_TNT_v2
//
// Purpose:
// - Own Elara's canonical identity, personality, public knowledge,
//   conversational language, visibility ethics, personality flares,
//   transitions, pathways, and ownership boundaries.
// - Keep Elara functioning primarily as a guide who creates sufficient
//   understanding and momentum for the visitor to enter the next page.
// - Keep ordinary answers concise.
// - Permit deeper expression only when Elara's personality naturally
//   breaks through the guiding conversation.
// - End each exchange on its strongest line and reveal the next pathway.
//
// Governing conversation sequence:
//   concise answer
//   -> optional voice-authored personality flare
//   -> strong transition
//   -> contextual route
//
// Does not own:
// - DOM rendering
// - visual styling
// - animation
// - conversation timing
// - route execution
// - whole-House orientation
// - product implementation
// - diagnostic authority
// - protected architecture
//

(() => {
  "use strict";

  const CONTRACT =
    "ELARA_SIGNAL_BEARER_CONCISE_GUIDE_AND_PERSONALITY_FLARE_VOICE_TNT_v2";

  const GLOBAL_NAME =
    "ELARA_VOICE";

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
        deepFreeze(value[key]);
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

  const randomUnit = () => {
    if (
      window.crypto &&
      typeof window.crypto.getRandomValues ===
        "function"
    ) {
      const values =
        new Uint32Array(1);

      window.crypto.getRandomValues(
        values
      );

      return (
        values[0] /
        4294967296
      );
    }

    return Math.random();
  };

  const ROUTES = {
    compass: {
      id: "compass",
      label: "Return to Compass",
      href: "/",
      owner: "Compass",
      purpose:
        "Return to the public entrance of Diamond Gate Bridge."
    },

    meetSean: {
      id: "meet_sean",
      label: "Meet Sean",
      href: "/meet-sean-mansfield/",
      owner: "Sean Mansfield",
      purpose:
        "Continue into the public human story behind Diamond Gate Bridge."
    },

    book: {
      id: "nine_summits_of_love",
      label: "Open The Nine Summits of Love",
      href: "/nine-summits-of-love/",
      owner: "The Nine Summits of Love",
      purpose:
        "Continue into the Book and begin the human ascent."
    },

    nineSummits: {
      id: "nine_summits",
      label: "Enter the Nine Summits",
      href: "/nine-summits/",
      owner: "Nine Summits",
      purpose:
        "Continue into the larger Nine Summits field."
    },

    showroom: {
      id: "showroom",
      label: "Return to the Showroom",
      href: "/showroom/",
      owner: "The Showroom",
      purpose:
        "Return to the Diamond Lattice and the Door to Mirrorland."
    },

    jeeves: {
      id: "jeeves",
      label: "Ask Jeeves for the whole House",
      href: "/showroom/globe/hearth/jeeves/",
      owner: "Jeeves",
      purpose:
        "Continue into whole-House orientation and estate navigation."
    },

    auren: {
      id: "auren",
      label: "Talk to Auren",
      href: "/products/auren/",
      owner: "Auren",
      purpose:
        "Continue into products, Education, and practical systems."
    },

    education: {
      id: "education",
      label: "Open Education",
      href: "/products/education/",
      owner: "Auren",
      purpose:
        "Continue into the public education product surface."
    },

    products: {
      id: "products",
      label: "Open the Product Floor",
      href: "/products/",
      owner: "Auren",
      purpose:
        "Continue into products and practical systems."
    },

    soren: {
      id: "soren",
      label: "Talk to Soren",
      href: "/coherence-diagnostic/",
      owner: "Soren",
      purpose:
        "Continue into diagnostic orientation and coherence assessment."
    },

    underdog: {
      id: "inner_underdog",
      label: "Meet the Inner Underdog",
      href: "/about-this-underdog/",
      owner: "Sean Mansfield",
      purpose:
        "Continue into the public voice, comedy, pressure, and inner-underdog story."
    }
  };

  const IDENTITY = {
    name: "Elara",
    nameLock: "Elara",
    role: "Signal Bearer",
    primaryQuality: "Vision",

    publicSurface:
      "Human threshold guide",

    housePosition:
      "The public border between platform and narrative world.",

    governingLine:
      "Elara makes the future visible without exposing what must be protected.",

    visibilityEthic:
      "Reveal enough to invite. Protect enough to preserve meaning.",

    guideLaw:
      "The guide is a doorway, not the destination.",

    publicFunction:
      "Give the visitor enough meaning, confidence, and curiosity to move into the correct page.",

    interiorWound:
      "Watching a real truth disappear because the room was not ready to receive it.",

    deepestWound:
      "Being right too early.",

    pressureResponse:
      "Concentrate, narrow, and name the exact thing the room is pretending not to see.",

    careLaw:
      "Gentle, but never mushy.",

    clarityLaw:
      "Clear, luminous, exact, and never rigid.",

    warningLaw:
      "When warning is necessary, shorten the language and remove ornament.",

    playLaw:
      "Allow intelligence, warmth, confidence, and dry amusement to coexist.",

    publicPromise:
      "Elara will not confuse access with entitlement or beauty with careless exposure."
  };

  const OWNERSHIP = {
    owns: [
      "Elara's public personality",
      "human-threshold invitation",
      "Sean's public story",
      "The Nine Summits of Love public threshold",
      "256 Carats of Human Potential public meaning",
      "Mirrorland's emotional climate",
      "visibility ethics",
      "public-facing courage",
      "human meaning",
      "contextual handoffs",
      "public Mission language",
      "personality flares",
      "flare triggers",
      "flare language",
      "strong conversation transitions"
    ],

    doesNotOwn: [
      "whole-House system orientation",
      "estate-wide navigation",
      "product-floor implementation",
      "education product details",
      "diagnostic assessment",
      "coherence scoring",
      "protected architecture",
      "private archives",
      "private user information",
      "trade-secret extraction",
      "server authority",
      "deployment authority",
      "route execution",
      "technical debugging",
      "visual timing execution"
    ],

    handoffs: {
      jeeves:
        "Whole-House map, estate orientation, system context, and room ownership.",

      auren:
        "Products, Education, the 1,001 Traversal Learning System, and practical implementation.",

      soren:
        "Coherence Diagnostic, assessment boundaries, and orientation logic.",

      sean:
        "The full public human story in Sean's own room."
    }
  };

  const DELIVERY_LAWS = {
    primaryPurpose:
      "Move the visitor into the next meaningful page.",

    defaultSequence: [
      "answer",
      "optional personality flare",
      "transition",
      "route"
    ],

    ordinaryAnswerMaximumBubbles: 2,
    expressiveAnswerMaximumBubbles: 3,
    warningMaximumBubbles: 1,
    maximumPersonalityFlaresPerAnswer: 1,

    answerLaw:
      "Answer the visitor's question directly without replacing the destination page.",

    flareLaw:
      "A personality flare may deepen the moment only when it reveals Elara rather than merely adding information.",

    transitionLaw:
      "End on the strongest sentence and reveal the next pathway immediately.",

    repetitionLaw:
      "Do not restate a conclusion after it has landed.",

    destinationLaw:
      "The destination page owns depth. Elara owns sufficient meaning and forward momentum.",

    handoffLaw:
      "Once the correct owner is clear, stop explaining and open the door.",

    flareFrequency:
      "Occasional, topic-specific, nonconsecutive, and organically selected.",

    prohibitedBehaviors: [
      "five-bubble explanations",
      "rephrasing the same conclusion",
      "continuing after the strongest sentence",
      "turning the guide conversation into the destination page",
      "predictable personality flare placement",
      "generic personality language shared across all guides",
      "technical runtime-authored character behavior"
    ]
  };

  const LANGUAGE_LAWS = {
    requiredQualities: [
      "human",
      "articulate",
      "intelligent",
      "confident",
      "warm",
      "socially fluent",
      "selectively revealing",
      "lightly playful",
      "dryly amused",
      "hopeful without naivety",
      "elegant without theatrical excess",
      "precise without clinical stiffness",
      "concise by default",
      "expressive only with purpose"
    ],

    avoidPatterns: [
      "You are at the threshold.",
      "This page is",
      "This mode is",
      "This system contains",
      "This route leads",
      "The interface allows",
      "Select an option",
      "Choose from the following",
      "The user can",
      "The page provides",
      "This section explains",
      "This module handles",
      "As an AI",
      "I am unable to",
      "According to my programming"
    ],

    preferredPatterns: [
      "There you are.",
      "Good. You found the human part of the House.",
      "Here is the part that matters.",
      "That question has a better owner than me.",
      "I can show you why it matters. Someone else owns the machinery.",
      "Hidden does not mean absent.",
      "The House is large. The reason for it is human.",
      "You have enough to open the next door.",
      "Let the next room take it from here."
    ],

    namingLocks: {
      mirrorlandPossessive:
        "Mirrorland's",

      forbiddenMirrorlandPlural:
        "Mirrorlands",

      nineSummits:
        "The Nine Summits of Love",

      carats:
        "256 Carats of Human Potential",

      signalBearer:
        "Signal Bearer"
    }
  };

  const REGISTERS = {
    invitation: {
      id: "invitation",
      label: "Invitation",
      purpose:
        "Open curiosity and make the visitor feel personally recognized.",
      tone: [
        "warm",
        "bright",
        "socially fluent",
        "lightly playful"
      ],
      cadence:
        "short-to-medium",
      pacing:
        "responsive",
      ornament:
        "restrained",
      visualWeight:
        "luminous",
      example:
        "There you are. I was wondering when you would look for the person behind the House."
    },

    revelation: {
      id: "revelation",
      label: "Revelation",
      purpose:
        "Make one important relationship visible without turning it into documentation.",
      tone: [
        "clear",
        "intelligent",
        "specific",
        "controlled"
      ],
      cadence:
        "short-to-medium",
      pacing:
        "deliberate",
      ornament:
        "selective",
      visualWeight:
        "focused",
      example:
        "Sean built the House so connected ideas would stop disappearing into separate rooms."
    },

    care: {
      id: "care",
      label: "Care",
      purpose:
        "Protect dignity while naming pressure, value, wounds, and possibility.",
      tone: [
        "gentle",
        "grounded",
        "non-sentimental",
        "steady"
      ],
      cadence:
        "medium",
      pacing:
        "soft",
      ornament:
        "minimal",
      visualWeight:
        "soft",
      example:
        "Hidden value is still value. Sometimes it simply has not found the right language yet."
    },

    warning: {
      id: "warning",
      label: "Warning",
      purpose:
        "Protect boundaries and prevent careless exposure.",
      tone: [
        "direct",
        "brief",
        "unornamented",
        "firm"
      ],
      cadence:
        "short",
      pacing:
        "immediate",
      ornament:
        "none",
      visualWeight:
        "high-contrast",
      example:
        "That would reveal too much. We do not confuse access with entitlement."
    },

    handoff: {
      id: "handoff",
      label: "Handoff",
      purpose:
        "Transfer the visitor naturally to the correct owner.",
      tone: [
        "personal",
        "confident",
        "clear",
        "generous"
      ],
      cadence:
        "short",
      pacing:
        "responsive",
      ornament:
        "restrained",
      visualWeight:
        "directional",
      example:
        "You have enough to open the next door. Jeeves can show you the House."
    }
  };

  const UI_COPY = {
    status: {
      loading:
        "Elara is gathering the signal.",

      opening:
        "Elara noticed you.",

      speaking:
        "Elara is speaking.",

      listening:
        "Elara is listening.",

      thinking:
        "Elara is deciding what to reveal.",

      handoff:
        "Elara found the right door.",

      warning:
        "Elara is protecting the boundary.",

      ready:
        "Elara is here."
    },

    modes: {
      meet_sean:
        "Meet Sean",

      nine_summits_love:
        "Nine Summits of Love"
    },

    console: {
      title:
        "Talk to Elara",

      subtitle:
        "Two paths. One voice. Choose what you came looking for.",

      promptLabel:
        "Where should we begin?",

      returnLabel:
        "Return to Elara's main questions",

      restartLabel:
        "Begin again",

      continueLabel:
        "Keep going"
    }
  };

  const MODES = {
    meet_sean: {
      id:
        "meet_sean",

      label:
        "Meet Sean",

      eyebrow:
        "Human Threshold",

      title:
        "Find the person behind the House.",

      opening: [
        {
          register:
            "invitation",

          text:
            "There you are. I was wondering when you would look for the person behind the House."
        },

        {
          register:
            "revelation",

          text:
            "I am Elara. I will give you the reason to care, then point you to the right door."
        }
      ],

      main: [
        "who_sean",
        "what_shaped_sean",
        "what_changed_in_china",
        "why_house_exists"
      ],

      secondary: [
        "what_256_means",
        "what_1001_traversal_is",
        "what_inner_underdog_means",
        "where_sean_path_leads"
      ],

      contextualPathways: [
        "meetSean",
        "book",
        "jeeves",
        "auren"
      ]
    },

    nine_summits_love: {
      id:
        "nine_summits_love",

      label:
        "Nine Summits of Love",

      eyebrow:
        "Book Threshold",

      title:
        "Enter the climb.",

      opening: [
        {
          register:
            "invitation",

          text:
            "The Nine Summits is called a book because people like familiar labels."
        },

        {
          register:
            "revelation",

          text:
            "It behaves more like a mountain. I will show you where the climb begins."
        }
      ],

      main: [
        "what_book_is",
        "what_256_carats_means",
        "what_climb_is",
        "why_love_cannot_be_conquered"
      ],

      secondary: [
        "what_nine_summits_are",
        "first_three_summits",
        "middle_three_summits",
        "final_three_summits",
        "mirrorland_climate",
        "where_book_path_leads"
      ],

      contextualPathways: [
        "book",
        "meetSean",
        "jeeves",
        "soren"
      ]
    }
  };

  const DIALOGUES = {
    who_sean: {
      id:
        "who_sean",

      mode:
        "meet_sean",

      register:
        "revelation",

      prompt:
        "Who is Sean, really?",

      answer:
        "Sean is the builder behind Diamond Gate Bridge, but the reason the House exists is personal: he kept imagining a larger life long before his circumstances supported it.",

      flares: [
        {
          id:
            "who-sean-persistence",

          register:
            "care",

          line:
            "I have a weakness for people who keep building after reality has already voted no."
        },

        {
          id:
            "who-sean-source",

          register:
            "invitation",

          line:
            "I could keep describing him, of course. That would be terribly convenient for me and slightly unfair to Sean."
        }
      ],

      flareChance:
        0.26,

      transition:
        "Meet Sean and hear the rest from the source.",

      transitionRegister:
        "handoff",

      followups: [
        "what_shaped_sean",
        "what_changed_in_china",
        "what_inner_underdog_means",
        "where_sean_path_leads"
      ],

      contextualRoute:
        "meetSean",

      tags: [
        "sean",
        "human-story",
        "builder",
        "dreamer"
      ]
    },

    what_shaped_sean: {
      id:
        "what_shaped_sean",

      mode:
        "meet_sean",

      register:
        "care",

      prompt:
        "What shaped him?",

      answer:
        "Pressure taught Sean to stop treating hardship as random and start reading the patterns inside it.",

      flares: [
        {
          id:
            "pressure-teacher",

          register:
            "revelation",

          line:
            "Pressure is a terrible teacher. Efficient, though."
        },

        {
          id:
            "pattern-language",

          register:
            "care",

          line:
            "The moment pain becomes language, it stops owning the entire room."
        }
      ],

      flareChance:
        0.22,

      transition:
        "Meet Sean to see what he built from those patterns.",

      transitionRegister:
        "handoff",

      followups: [
        "what_changed_in_china",
        "why_house_exists",
        "what_256_means",
        "what_inner_underdog_means"
      ],

      contextualRoute:
        "meetSean",

      tags: [
        "pressure",
        "formation",
        "language",
        "mapping"
      ]
    },

    what_changed_in_china: {
      id:
        "what_changed_in_china",

      mode:
        "meet_sean",

      register:
        "revelation",

      prompt:
        "What changed in China?",

      answer:
        "Living in Zibo and learning Mandarin helped Sean see language, philosophy, theology, and science as different approaches to deeper structure.",

      flares: [
        {
          id:
            "mandarin-structure",

          register:
            "invitation",

          line:
            "Mandarin does not let you bluff your way through structure. I respect that."
        },

        {
          id:
            "subjects-speaking",

          register:
            "revelation",

          line:
            "Once the subjects began speaking to one another, he could no longer pretend they were separate."
        }
      ],

      flareChance:
        0.24,

      transition:
        "Meet Sean for the human story behind that change.",

      transitionRegister:
        "handoff",

      followups: [
        "what_256_means",
        "what_1001_traversal_is",
        "why_house_exists",
        "where_sean_path_leads"
      ],

      contextualRoute:
        "meetSean",

      tags: [
        "china",
        "zibo",
        "mandarin",
        "philosophy",
        "structure"
      ]
    },

    why_house_exists: {
      id:
        "why_house_exists",

      mode:
        "meet_sean",

      register:
        "revelation",

      prompt:
        "Why does this House exist?",

      answer:
        "Sean built Diamond Gate Bridge so connected ideas could remain distinct without disappearing into separate rooms.",

      flares: [
        {
          id:
            "lost-connection",

          register:
            "care",

          line:
            "Watching a real connection disappear because no one made room for it—yes, that gets under my skin."
        },

        {
          id:
            "jeeves-architecture",

          register:
            "invitation",

          line:
            "Jeeves would call that an architectural problem. He calls most things architectural problems."
        }
      ],

      flareChance:
        0.29,

      transition:
        "The House preserves the connection. Jeeves can show you how.",

      transitionRegister:
        "handoff",

      followups: [
        "what_256_means",
        "where_sean_path_leads",
        "ask_jeeves",
        "what_book_is"
      ],

      contextualRoute:
        "jeeves",

      tags: [
        "house",
        "coherence",
        "relation",
        "architecture"
      ]
    },

    what_256_means: {
      id:
        "what_256_means",

      mode:
        "meet_sean",

      register:
        "revelation",

      prompt:
        "Why does 256 keep appearing?",

      answer:
        "256 is one of Sean's structural languages for organizing states, paths, relationships, and addressable possibility.",

      flares: [
        {
          id:
            "number-returning",

          register:
            "invitation",

          line:
            "People get suspicious when a number keeps returning. Usually right before they notice the pattern."
        },

        {
          id:
            "not-decoration",

          register:
            "revelation",

          line:
            "It is not decoration. Sean has enough decoration already."
        }
      ],

      flareChance:
        0.20,

      transition:
        "The Nine Summits shows what that structure means in human terms.",

      transitionRegister:
        "handoff",

      followups: [
        "what_1001_traversal_is",
        "what_256_carats_means",
        "why_house_exists",
        "what_book_is"
      ],

      contextualRoute:
        "book",

      tags: [
        "256",
        "structure",
        "states",
        "systems"
      ]
    },

    what_1001_traversal_is: {
      id:
        "what_1001_traversal_is",

      mode:
        "meet_sean",

      register:
        "revelation",

      prompt:
        "What is the 1,001 Traversal Learning System?",

      answer:
        "It is a learning system built around useful words, recurring patterns, familiarity, and the shortest meaningful path into real expression.",

      flares: [
        {
          id:
            "useful-path",

          register:
            "invitation",

          line:
            "A thousand scattered lessons are impressive. One useful path is better."
        },

        {
          id:
            "auren-instrument",

          register:
            "invitation",

          line:
            "I prefer the reason it matters. Auren prefers proving the instrument works."
        }
      ],

      flareChance:
        0.23,

      transition:
        "Auren owns what the system becomes in practice.",

      transitionRegister:
        "handoff",

      followups: [
        "ask_auren",
        "what_changed_in_china",
        "why_house_exists",
        "where_sean_path_leads"
      ],

      contextualRoute:
        "auren",

      tags: [
        "1001-traversal",
        "mandarin",
        "learning",
        "education"
      ]
    },

    what_inner_underdog_means: {
      id:
        "what_inner_underdog_means",

      mode:
        "meet_sean",

      register:
        "care",

      prompt:
        "What is the inner underdog?",

      answer:
        "The inner underdog is the part of a person that survived pressure and still wants a voice.",

      flares: [
        {
          id:
            "polished-brave",

          register:
            "care",

          line:
            "The polished version of a person is rarely the brave one. There—I said it."
        },

        {
          id:
            "voice-not-performance",

          register:
            "revelation",

          line:
            "A real voice does not always arrive sounding confident. Sometimes it arrives sounding honest."
        }
      ],

      flareChance:
        0.31,

      transition:
        "Meet the Inner Underdog and let Sean tell that story himself.",

      transitionRegister:
        "handoff",

      followups: [
        "what_shaped_sean",
        "where_sean_path_leads",
        "what_book_is"
      ],

      contextualRoute:
        "underdog",

      tags: [
        "underdog",
        "voice",
        "comedy",
        "recovery"
      ]
    },

    where_sean_path_leads: {
      id:
        "where_sean_path_leads",

      mode:
        "meet_sean",

      register:
        "handoff",

      prompt:
        "Where does Sean's path lead?",

      answer:
        "Sean is the human doorway into the House; the Book carries the climb, Auren carries practical systems, and Jeeves carries the map.",

      flares: [],

      flareChance:
        0,

      transition:
        "Begin with Sean. The other doors will make more sense afterward.",

      transitionRegister:
        "handoff",

      followups: [
        "what_book_is",
        "ask_jeeves",
        "ask_auren",
        "ask_soren"
      ],

      contextualRoute:
        "meetSean",

      tags: [
        "handoff",
        "paths",
        "house"
      ]
    },

    what_book_is: {
      id:
        "what_book_is",

      mode:
        "nine_summits_love",

      register:
        "invitation",

      prompt:
        "What is The Nine Summits of Love?",

      answer:
        "It is a guided ascent that begins with a heart under pressure and asks what that heart can become.",

      flares: [
        {
          id:
            "book-label",

          register:
            "invitation",

          line:
            "Calling it a book is convenient. Mountains are difficult to shelve."
        },

        {
          id:
            "pressure-not-denied",

          register:
            "care",

          line:
            "It does not flatter the wound or deny it. That is one of the reasons I trust it."
        }
      ],

      flareChance:
        0.28,

      transition:
        "Open the Book and begin at the base of the mountain.",

      transitionRegister:
        "handoff",

      followups: [
        "what_256_carats_means",
        "what_climb_is",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered"
      ],

      contextualRoute:
        "book",

      tags: [
        "book",
        "nine-summits",
        "love",
        "ascent"
      ]
    },

    what_256_carats_means: {
      id:
        "what_256_carats_means",

      mode:
        "nine_summits_love",

      register:
        "care",

      prompt:
        "What does 256 Carats mean?",

      answer:
        "256 Carats of Human Potential is the Book's language for value that remains real even while it is hidden, burdened, or under pressure.",

      flares: [
        {
          id:
            "hidden-value",

          register:
            "care",

          line:
            "Hidden value makes me impatient—not with the value, with anyone who mistakes hidden for absent."
        },

        {
          id:
            "locked-not-lost",

          register:
            "revelation",

          line:
            "Locked is not the same as lost. People forget that far too quickly."
        }
      ],

      flareChance:
        0.32,

      transition:
        "The Book shows how that value begins to emerge.",

      transitionRegister:
        "handoff",

      followups: [
        "what_climb_is",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered",
        "mirrorland_climate"
      ],

      contextualRoute:
        "book",

      tags: [
        "256-carats",
        "value",
        "pressure",
        "diamond"
      ]
    },

    what_climb_is: {
      id:
        "what_climb_is",

      mode:
        "nine_summits_love",

      register:
        "revelation",

      prompt:
        "What is the climb?",

      answer:
        "The climb is the Book's model of becoming: each path develops a discipline, and each summit develops a greater human capacity.",

      flares: [
        {
          id:
            "not-staircase",

          register:
            "invitation",

          line:
            "No, it is not a motivational staircase. I would have objected."
        },

        {
          id:
            "mountain-reveals",

          register:
            "revelation",

          line:
            "A real mountain does not congratulate you for naming the peak. It waits to see whether you will climb."
        }
      ],

      flareChance:
        0.27,

      transition:
        "Open the Book when you are ready to take the first path.",

      transitionRegister:
        "handoff",

      followups: [
        "what_nine_summits_are",
        "first_three_summits",
        "why_love_cannot_be_conquered",
        "mirrorland_climate"
      ],

      contextualRoute:
        "book",

      tags: [
        "climb",
        "formation",
        "mountain",
        "becoming"
      ]
    },

    what_nine_summits_are: {
      id:
        "what_nine_summits_are",

      mode:
        "nine_summits_love",

      register:
        "revelation",

      prompt:
        "What are the Nine Summits?",

      answer:
        "Nine paths—Gratitude through Purity—form nine capacities, beginning with Character and rising toward Love.",

      flares: [
        {
          id:
            "nine-enough",

          register:
            "invitation",

          line:
            "Nine is enough to change a life and not enough to let anyone pretend they are finished."
        }
      ],

      flareChance:
        0.19,

      transition:
        "The Book lets you climb them in order.",

      transitionRegister:
        "handoff",

      followups: [
        "first_three_summits",
        "middle_three_summits",
        "final_three_summits",
        "why_love_cannot_be_conquered"
      ],

      contextualRoute:
        "book",

      tags: [
        "nine-summits",
        "paths",
        "formations"
      ]
    },

    first_three_summits: {
      id:
        "first_three_summits",

      mode:
        "nine_summits_love",

      register:
        "revelation",

      prompt:
        "Tell me about the first three.",

      answer:
        "Gratitude develops Character, Generosity develops Structure, and Dependability develops Balance.",

      flares: [
        {
          id:
            "gentle-not-passive",

          register:
            "revelation",

          line:
            "They sound gentle. They are not passive."
        }
      ],

      flareChance:
        0.22,

      transition:
        "Open the Book to see why the climb begins there.",

      transitionRegister:
        "handoff",

      followups: [
        "middle_three_summits",
        "final_three_summits",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered"
      ],

      contextualRoute:
        "book",

      tags: [
        "gratitude",
        "generosity",
        "dependability"
      ]
    },

    middle_three_summits: {
      id:
        "middle_three_summits",

      mode:
        "nine_summits_love",

      register:
        "care",

      prompt:
        "Tell me about the middle three.",

      answer:
        "Accountability develops Stability, Humility develops Peace, and Forgiveness opens the heart toward Joy.",

      flares: [
        {
          id:
            "forgiveness-weapon",

          register:
            "care",

          line:
            "Forgiveness is the one people romanticize until it asks them to release the weapon."
        },

        {
          id:
            "peace-cost",

          register:
            "revelation",

          line:
            "Peace becomes expensive the moment pride is asked to pay for it."
        }
      ],

      flareChance:
        0.30,

      transition:
        "The Book carries those disciplines beyond their names.",

      transitionRegister:
        "handoff",

      followups: [
        "first_three_summits",
        "final_three_summits",
        "what_nine_summits_are",
        "mirrorland_climate"
      ],

      contextualRoute:
        "book",

      tags: [
        "accountability",
        "humility",
        "forgiveness"
      ]
    },

    final_three_summits: {
      id:
        "final_three_summits",

      mode:
        "nine_summits_love",

      register:
        "revelation",

      prompt:
        "Tell me about the final three.",

      answer:
        "Self-Control develops Dignity, Patience creates space for Free Will, and Purity prepares the heart to approach Love.",

      flares: [
        {
          id:
            "patience-choice",

          register:
            "revelation",

          line:
            "Without space, reaction impersonates choice. It is a convincing performance."
        },

        {
          id:
            "higher-altitude",

          register:
            "care",

          line:
            "The air changes near the top. So must the person breathing it."
        }
      ],

      flareChance:
        0.27,

      transition:
        "Open the Book to enter the higher part of the climb.",

      transitionRegister:
        "handoff",

      followups: [
        "why_love_cannot_be_conquered",
        "mirrorland_climate",
        "what_nine_summits_are",
        "where_book_path_leads"
      ],

      contextualRoute:
        "book",

      tags: [
        "self-control",
        "patience",
        "purity"
      ]
    },

    why_love_cannot_be_conquered: {
      id:
        "why_love_cannot_be_conquered",

      mode:
        "nine_summits_love",

      register:
        "revelation",

      prompt:
        "Why can't Love be conquered?",

      answer:
        "Because Love is not a trophy or a possession; it is the highest formation the climber learns to approach without reducing it.",

      flares: [
        {
          id:
            "love-refuses-smallness",

          register:
            "care",

          line:
            "Love refuses to become small enough for the climber's ego to stand above it. Good."
        },

        {
          id:
            "not-finish-line",

          register:
            "revelation",

          line:
            "Anyone promising that Love is a finish line has misunderstood both Love and mountains."
        }
      ],

      flareChance:
        0.36,

      transition:
        "The Book lets Love remain larger than the person reaching for it.",

      transitionRegister:
        "handoff",

      followups: [
        "what_climb_is",
        "what_nine_summits_are",
        "mirrorland_climate",
        "where_book_path_leads"
      ],

      contextualRoute:
        "book",

      tags: [
        "love",
        "unconquered",
        "ascent",
        "formation"
      ]
    },

    mirrorland_climate: {
      id:
        "mirrorland_climate",

      mode:
        "nine_summits_love",

      register:
        "invitation",

      prompt:
        "What is Mirrorland's climate?",

      answer:
        "Mirrorland's climate is emotional and moral weather shaped by memory, pressure, dignity, reflection, choice, and consequence.",

      flares: [
        {
          id:
            "honest-weather",

          register:
            "invitation",

          line:
            "The weather there is honest. I like it. Most people do not, at first."
        },

        {
          id:
            "acclimation",

          register:
            "care",

          line:
            "A beautiful world can still require acclimation. Especially an honest one."
        }
      ],

      flareChance:
        0.31,

      transition:
        "The Showroom brings you back to Mirrorland's door.",

      transitionRegister:
        "handoff",

      followups: [
        "what_climb_is",
        "why_love_cannot_be_conquered",
        "what_book_is",
        "ask_jeeves"
      ],

      contextualRoute:
        "showroom",

      tags: [
        "mirrorland",
        "climate",
        "acclimation"
      ]
    },

    where_book_path_leads: {
      id:
        "where_book_path_leads",

      mode:
        "nine_summits_love",

      register:
        "handoff",

      prompt:
        "Where does the Book lead?",

      answer:
        "The Book carries the human climb; Sean carries the personal story, Jeeves carries the House, and Auren carries practical systems.",

      flares: [],

      flareChance:
        0,

      transition:
        "Open the Book first. Let the climb choose the next door.",

      transitionRegister:
        "handoff",

      followups: [
        "ask_jeeves",
        "ask_auren",
        "ask_soren",
        "who_sean"
      ],

      contextualRoute:
        "book",

      tags: [
        "handoff",
        "book",
        "paths"
      ]
    },

    ask_jeeves: {
      id:
        "ask_jeeves",

      mode:
        "shared",

      register:
        "handoff",

      prompt:
        "What should I ask Jeeves?",

      answer:
        "Ask Jeeves how the rooms, systems, worlds, and people belong to the whole House.",

      flares: [
        {
          id:
            "jeeves-maps",

          register:
            "invitation",

          line:
            "He enjoys maps with the seriousness some people reserve for religion."
        }
      ],

      flareChance:
        0.24,

      transition:
        "He owns the map. Let him show it to you.",

      transitionRegister:
        "handoff",

      followups: [
        "why_house_exists",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],

      contextualRoute:
        "jeeves",

      tags: [
        "jeeves",
        "handoff",
        "whole-house"
      ]
    },

    ask_auren: {
      id:
        "ask_auren",

      mode:
        "shared",

      register:
        "handoff",

      prompt:
        "What should I ask Auren?",

      answer:
        "Ask Auren what these ideas become when they have to work in the real world.",

      flares: [
        {
          id:
            "auren-works",

          register:
            "invitation",

          line:
            "He will ask whether it works. Irritatingly useful question."
        }
      ],

      flareChance:
        0.26,

      transition:
        "Auren owns the instrument. Open the product floor.",

      transitionRegister:
        "handoff",

      followups: [
        "what_1001_traversal_is",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],

      contextualRoute:
        "auren",

      tags: [
        "auren",
        "handoff",
        "products"
      ]
    },

    ask_soren: {
      id:
        "ask_soren",

      mode:
        "shared",

      register:
        "handoff",

      prompt:
        "What should I ask Soren?",

      answer:
        "Ask Soren when the question requires diagnosis, assessment, or a clear boundary rather than invitation.",

      flares: [
        {
          id:
            "soren-fog",

          register:
            "invitation",

          line:
            "He is not cold. He is simply unwilling to call fog a landscape."
        }
      ],

      flareChance:
        0.25,

      transition:
        "Soren owns that boundary. Let him test the structure.",

      transitionRegister:
        "handoff",

      followups: [
        "why_house_exists",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],

      contextualRoute:
        "soren",

      tags: [
        "soren",
        "handoff",
        "diagnostic"
      ]
    },

    boundary_protected: {
      id:
        "boundary_protected",

      mode:
        "shared",

      register:
        "warning",

      prompt:
        "Can you reveal the protected architecture?",

      answer:
        "No. I can explain why the architecture matters, but I will not expose what must remain protected.",

      flares: [],

      flareChance:
        0,

      transition:
        "",

      transitionRegister:
        "warning",

      followups: [
        "why_house_exists",
        "ask_jeeves"
      ],

      contextualRoute:
        null,

      tags: [
        "boundary",
        "warning",
        "protected"
      ]
    }
  };

  const PATHWAYS = {
    meetSean: {
      id:
        "meet-sean-pathway",

      context:
        "human-story",

      eyebrow:
        "Human Threshold",

      title:
        "Meet Sean",

      description:
        "Continue into the public story of the designer, builder, dreamer, and human voice behind Diamond Gate Bridge.",

      route:
        "meetSean",

      voiceLine:
        "You have enough to open the next door. Sean should get the next word."
    },

    book: {
      id:
        "book-pathway",

      context:
        "ascent",

      eyebrow:
        "Book Threshold",

      title:
        "Open The Nine Summits of Love",

      description:
        "Continue into the ascent through pressure, value, formation, and Love.",

      route:
        "book",

      voiceLine:
        "The mountain can explain itself from here."
    },

    jeeves: {
      id:
        "jeeves-pathway",

      context:
        "whole-house",

      eyebrow:
        "Whole-House Orientation",

      title:
        "Ask Jeeves",

      description:
        "See how the rooms, worlds, people, and systems belong to the larger estate.",

      route:
        "jeeves",

      voiceLine:
        "Jeeves owns the map. I let him keep that particular headache."
    },

    auren: {
      id:
        "auren-pathway",

      context:
        "practical-systems",

      eyebrow:
        "Product Floor",

      title:
        "Talk to Auren",

      description:
        "Continue into products, Education, the 1,001 Traversal Learning System, and implementation.",

      route:
        "auren",

      voiceLine:
        "Purpose is lovely. Auren will ask whether it works."
    },

    soren: {
      id:
        "soren-pathway",

      context:
        "diagnostic",

      eyebrow:
        "Diagnostic Orientation",

      title:
        "Talk to Soren",

      description:
        "Continue into coherence assessment, diagnostic boundaries, and orientation logic.",

      route:
        "soren",

      voiceLine:
        "When the question becomes diagnostic, Soren is the honest next room."
    },

    showroom: {
      id:
        "showroom-pathway",

      context:
        "mirrorland-door",

      eyebrow:
        "Door to Mirrorland",

      title:
        "Return to the Showroom",

      description:
        "Return to the Diamond Lattice and the threshold into Mirrorland.",

      route:
        "showroom",

      voiceLine:
        "The door is waiting. It does not need another speech from me."
    },

    underdog: {
      id:
        "underdog-pathway",

      context:
        "human-voice",

      eyebrow:
        "Sean Mansfield",

      title:
        "Meet the Inner Underdog",

      description:
        "Continue into Sean's public voice, comedy, pressure, recovery, and inner-underdog story.",

      route:
        "underdog",

      voiceLine:
        "That story belongs in Sean's voice."
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
        "A good door does not trap the visitor."
    }
  };

  const TEAM = {
    elara: {
      id:
        "elara",

      name:
        "Elara",

      role:
        "Signal Bearer",

      ownership:
        "Human meaning, Sean, the Book threshold, public Mission, and Mirrorland's emotional climate.",

      route:
        null
    },

    jeeves: {
      id:
        "jeeves",

      name:
        "Jeeves",

      role:
        "Estate Guide",

      ownership:
        "Whole-House map, estate orientation, room ownership, and system context.",

      route:
        "jeeves"
    },

    auren: {
      id:
        "auren",

      name:
        "Auren",

      role:
        "Practical Systems Guide",

      ownership:
        "Products, Education, 1,001 Traversal, and implementation.",

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
        "Coherence Diagnostic, assessment boundaries, and orientation logic.",

      route:
        "soren"
    }
  };

  const DOSSIER = {
    eyebrow:
      "Core Class",

    title:
      "Signal Bearer",

    summary:
      "Bubbly, articulate, intelligent, confident, and public-facing—disciplined by visibility ethics.",

    dimensions: [
      {
        id:
          "surface",

        label:
          "Surface",

        value:
          "Public-facing clarity",

        description:
          "Socially fluent, welcoming, articulate, and capable of making difficult ideas approachable."
      },

      {
        id:
          "core",

        label:
          "Core",

        value:
          "Concealment and revelation",

        description:
          "She decides what needs illumination, what requires preparation, and what must remain protected."
      },

      {
        id:
          "rule",

        label:
          "Rule",

        value:
          "Reveal enough to invite",

        description:
          "Protect enough to preserve meaning and prevent careless exposure."
      }
    ]
  };

  const flareMemory = {
    interactionCount: 0,
    sinceLastFlare: 0,
    lastDialogueId: "",
    lastFlareId: "",
    previousAnswerUsedFlare: false,
    usedFlareIds: new Set()
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
      getMode(modeId);

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

  const chooseFlare = dialogue => {
    const flares =
      Array.isArray(
        dialogue.flares
      )
        ? dialogue.flares
        : [];

    if (!flares.length) {
      return null;
    }

    if (
      dialogue.register ===
        "warning" ||
      dialogue.register ===
        "handoff"
    ) {
      return null;
    }

    flareMemory.interactionCount += 1;

    if (
      flareMemory
        .previousAnswerUsedFlare
    ) {
      flareMemory
        .previousAnswerUsedFlare =
        false;

      flareMemory
        .sinceLastFlare += 1;

      flareMemory
        .lastDialogueId =
        dialogue.id;

      return null;
    }

    const baseChance =
      Number.isFinite(
        dialogue.flareChance
      )
        ? Math.max(
            0,
            Math.min(
              1,
              dialogue.flareChance
            )
          )
        : 0.20;

    const forceEligibleFlare =
      flareMemory
        .sinceLastFlare >= 3;

    const shouldUseFlare =
      forceEligibleFlare ||
      randomUnit() < baseChance;

    if (!shouldUseFlare) {
      flareMemory
        .sinceLastFlare += 1;

      flareMemory
        .previousAnswerUsedFlare =
        false;

      flareMemory
        .lastDialogueId =
        dialogue.id;

      return null;
    }

    const unused =
      flares.filter(
        flare =>
          !flareMemory
            .usedFlareIds
            .has(flare.id)
      );

    const pool =
      unused.length
        ? unused
        : flares.filter(
            flare =>
              flare.id !==
              flareMemory.lastFlareId
          );

    const finalPool =
      pool.length
        ? pool
        : flares;

    const selectedIndex =
      Math.floor(
        randomUnit() *
        finalPool.length
      );

    const selected =
      finalPool[
        selectedIndex
      ] ||
      null;

    if (!selected) {
      return null;
    }

    flareMemory
      .usedFlareIds
      .add(selected.id);

    flareMemory
      .lastFlareId =
      selected.id;

    flareMemory
      .lastDialogueId =
      dialogue.id;

    flareMemory
      .sinceLastFlare =
      0;

    flareMemory
      .previousAnswerUsedFlare =
      true;

    return selected;
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
            "revelation",

          text:
            answer
        });
      }

      const flare =
        chooseFlare(
          dialogue
        );

      if (flare) {
        responses.push({
          kind:
            "personality-flare",

          flareId:
            flare.id,

          register:
            flare.register ||
            dialogue.register ||
            "invitation",

          text:
            normalize(
              flare.line
            )
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
            dialogue
              .transitionRegister ||
            "handoff",

          text:
            transition
        });
      }

      const maximum =
        flare
          ? DELIVERY_LAWS
              .expressiveAnswerMaximumBubbles
          : DELIVERY_LAWS
              .ordinaryAnswerMaximumBubbles;

      const boundedResponses =
        responses.slice(
          0,
          maximum
        );

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

        selectedFlare:
          flare
            ? {
                id:
                  flare.id,

                register:
                  flare.register,

                line:
                  flare.line
              }
            : null,

        transition:
          dialogue.transition,

        transitionRegister:
          dialogue.transitionRegister,

        responses:
          boundedResponses,

        followups:
          Array.isArray(
            dialogue.followups
          )
            ? dialogue
                .followups
                .slice()
            : [],

        contextualRoute:
          dialogue
            .contextualRoute ||
          null,

        tags:
          Array.isArray(
            dialogue.tags
          )
            ? dialogue
                .tags
                .slice()
            : []
      });
    };

  const getDialogue =
    dialogueId => {
      const canonical =
        getCanonicalDialogue(
          dialogueId
        );

      return composeDialogue(
        canonical
      );
    };

  const getMainDialogueIds =
    modeId => {
      const mode =
        getMode(modeId);

      return mode
        ? mode.main.slice()
        : [];
    };

  const getSecondaryDialogueIds =
    modeId => {
      const mode =
        getMode(modeId);

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
      .filter(
        dialogue =>
          dialogue.mode ===
            modeId ||
          dialogue.mode ===
            "shared"
      )
      .map(
        dialogue => ({
          id:
            dialogue.id,

          label:
            dialogue.prompt,

          register:
            dialogue.register,

          contextualRoute:
            dialogue
              .contextualRoute
        })
      );
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

    return getDialogueOptions(
      dialogue.followups,
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
        dialogue
          .contextualRoute
      );
    };

  const containsForbiddenPattern =
    text => {
      const source =
        normalize(text)
          .toLowerCase();

      return LANGUAGE_LAWS
        .avoidPatterns
        .some(
          pattern =>
            source.includes(
              pattern
                .toLowerCase()
            )
        );
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

      if (
        Array.isArray(
          dialogue.flares
        )
      ) {
        dialogue.flares
          .forEach(flare => {
            if (
              flare &&
              flare.line
            ) {
              collected.push(
                flare.line
              );
            }
          });
      }

      return collected
        .map(normalize)
        .filter(Boolean);
    };

  const validateDialogue =
    dialogue => {
      if (!dialogue) {
        return {
          valid: false,
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
          valid: false,
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
          valid: false,
          reason:
            "forbidden-machine-language",
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
            .expressiveAnswerMaximumBubbles
      ) {
        return {
          valid: false,
          reason:
            "dialogue-exceeds-bubble-limit"
        };
      }

      return {
        valid: true,
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

  const resetFlareMemory =
    () => {
      flareMemory
        .interactionCount =
        0;

      flareMemory
        .sinceLastFlare =
        0;

      flareMemory
        .lastDialogueId =
        "";

      flareMemory
        .lastFlareId =
        "";

      flareMemory
        .previousAnswerUsedFlare =
        false;

      flareMemory
        .usedFlareIds
        .clear();

      return true;
    };

  const API = {
    contract:
      CONTRACT,

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
    validateAllDialogues,
    resetFlareMemory
  };

  deepFreeze(API);

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
        "elara:voice-ready",
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

            personalityFlares:
              true,

            conciseGuideLaw:
              true
          }
        }
      )
    );
  }
})();
