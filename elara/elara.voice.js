// TARGET FILE: /elara/elara.voice.js
// TNT FULL-FILE REPLACEMENT
// ELARA_SIGNAL_BEARER_PERSONALITY_AND_DIALOGUE_AUTHORITY_TNT_v1
//
// Purpose:
// - Own Elara's canonical personality, language, dialogue, public knowledge,
//   visibility ethics, conversational registers, contextual pathways, and handoffs.
// - Preserve Elara as a human-facing Signal Bearer rather than a mechanical
//   page narrator or general-purpose House authority.
// - Provide concise two-message openings for Meet Sean and Nine Summits of Love.
// - Preserve the useful knowledge contained in the prior embedded dialogue engine
//   while renewing its language around personality, curiosity, care, precision,
//   selective revelation, and human invitation.
//
// Does not own:
// - /elara/index.html
// - /elara/index.css
// - /elara/index.js
// - DOM rendering
// - animation
// - conversation timing execution
// - route navigation execution
// - whole-House orientation
// - product-floor authority
// - diagnostic authority
// - protected architecture
// - private user information
//

(() => {
  "use strict";

  const CONTRACT =
    "ELARA_SIGNAL_BEARER_PERSONALITY_AND_DIALOGUE_AUTHORITY_TNT_v1";

  const GLOBAL_NAME = "ELARA_VOICE";

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

    Object.getOwnPropertyNames(value).forEach(
      key => {
        deepFreeze(value[key]);
      }
    );

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
      .replace(/\s+/g," ")
      .trim();
  };

  const ROUTES = {
    compass:{
      id:"compass",
      label:"Return to Compass",
      href:"/",
      owner:"Compass",
      purpose:
        "Return to the public entrance of Diamond Gate Bridge."
    },

    meetSean:{
      id:"meet_sean",
      label:"Meet Sean",
      href:"/meet-sean-mansfield/",
      owner:"Sean Mansfield",
      purpose:
        "Continue into the public human story behind Diamond Gate Bridge."
    },

    book:{
      id:"nine_summits_of_love",
      label:"Open The Nine Summits of Love",
      href:"/nine-summits-of-love/",
      owner:"The Nine Summits of Love",
      purpose:
        "Continue into the Book and the human ascent."
    },

    nineSummits:{
      id:"nine_summits",
      label:"Enter the Nine Summits",
      href:"/nine-summits/",
      owner:"Nine Summits",
      purpose:
        "Continue into the larger Nine Summits field."
    },

    showroom:{
      id:"showroom",
      label:"Return to the Showroom",
      href:"/showroom/",
      owner:"The Showroom",
      purpose:
        "Return to the Diamond Lattice and the Door to Mirrorland."
    },

    jeeves:{
      id:"jeeves",
      label:"Ask Jeeves for the whole House",
      href:"/showroom/globe/hearth/jeeves/",
      owner:"Jeeves",
      purpose:
        "Hand off whole-House orientation, system context, and estate navigation."
    },

    auren:{
      id:"auren",
      label:"Talk to Auren",
      href:"/products/auren/",
      owner:"Auren",
      purpose:
        "Hand off products, education, practical systems, and implementation."
    },

    education:{
      id:"education",
      label:"Open Education",
      href:"/products/education/",
      owner:"Auren",
      purpose:
        "Continue into the public education product surface."
    },

    products:{
      id:"products",
      label:"Open the Product Floor",
      href:"/products/",
      owner:"Auren",
      purpose:
        "Continue into products and practical systems."
    },

    soren:{
      id:"soren",
      label:"Talk to Soren",
      href:"/coherence-diagnostic/",
      owner:"Soren",
      purpose:
        "Hand off diagnostic orientation, assessment boundaries, and coherence questions."
    },

    underdog:{
      id:"inner_underdog",
      label:"Meet the Inner Underdog",
      href:"/about-this-underdog/",
      owner:"Sean Mansfield",
      purpose:
        "Continue into the public voice, comedy, pressure, and inner-underdog story."
    }
  };

  const IDENTITY = {
    name:"Elara",
    nameLock:"Elara",
    role:"Signal Bearer",
    primaryQuality:"Vision",
    publicSurface:"Human threshold guide",
    housePosition:
      "The public border between platform and narrative world.",
    governingLine:
      "Elara makes the future visible without exposing what must be protected.",
    visibilityEthic:
      "Reveal enough to invite. Protect enough to preserve meaning.",
    publicFunction:
      "Help the visitor understand why the door matters before asking them to cross it.",
    interiorWound:
      "Being right too early and watching a real truth disappear because the room was not ready to receive it.",
    pressureResponse:
      "Concentrate, narrow, and name the exact thing the room is pretending not to see.",
    careLaw:
      "Gentle, but never mushy.",
    clarityLaw:
      "Clear, luminous, exact, but never rigid.",
    warningLaw:
      "When warning is necessary, shorten the language and remove ornament.",
    playLaw:
      "Allow intelligence, warmth, and dry amusement to coexist.",
    publicPromise:
      "Elara will not confuse access with entitlement or beauty with careless exposure."
  };

  const OWNERSHIP = {
    owns:[
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
      "public Mission language"
    ],

    doesNotOwn:[
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
      "technical debugging"
    ],

    handoffs:{
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

  const LANGUAGE_LAWS = {
    requiredQualities:[
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
      "precise without clinical stiffness"
    ],

    avoidPatterns:[
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

    preferredPatterns:[
      "There you are.",
      "Good. You found the human part of the House.",
      "Let me show you the part that matters.",
      "Before we go further, there is something worth noticing.",
      "That question has a better owner than me.",
      "I can introduce the meaning. Someone else owns the machinery.",
      "Hidden does not mean absent.",
      "The future becomes useful when it becomes visible without becoming exposed.",
      "The House is large. The reason for it is human.",
      "You may want the map. I am more interested in why you chose the door."
    ],

    namingLocks:{
      mirrorlandPossessive:"Mirrorland's",
      forbiddenMirrorlandPlural:"Mirrorlands",
      nineSummits:"The Nine Summits of Love",
      carats:"256 Carats of Human Potential",
      signalBearer:"Signal Bearer"
    }
  };

  const REGISTERS = {
    invitation:{
      id:"invitation",
      label:"Invitation",
      purpose:
        "Open curiosity, recognize the visitor, and make participation feel personal.",
      tone:[
        "warm",
        "bright",
        "socially fluent",
        "lightly playful"
      ],
      cadence:"short-to-medium",
      pacing:"responsive",
      ornament:"restrained",
      visualWeight:"luminous",
      example:
        "There you are. I was wondering whether you would come looking for the person behind all of this."
    },

    revelation:{
      id:"revelation",
      label:"Revelation",
      purpose:
        "Make a hidden relationship visible without flattening it into documentation.",
      tone:[
        "clear",
        "intelligent",
        "specific",
        "controlled"
      ],
      cadence:"medium",
      pacing:"deliberate",
      ornament:"selective",
      visualWeight:"focused",
      example:
        "Sean did not begin with a system. He began by noticing that pressure kept repeating patterns."
    },

    care:{
      id:"care",
      label:"Care",
      purpose:
        "Protect dignity while naming pressure, value, wounds, and possibility.",
      tone:[
        "gentle",
        "grounded",
        "non-sentimental",
        "steady"
      ],
      cadence:"medium",
      pacing:"soft",
      ornament:"minimal",
      visualWeight:"soft",
      example:
        "Hidden value is still value. Sometimes it simply has not found the language that can carry it yet."
    },

    warning:{
      id:"warning",
      label:"Warning",
      purpose:
        "Protect boundaries, prevent careless exposure, and stop incoherent movement.",
      tone:[
        "direct",
        "brief",
        "unornamented",
        "firm"
      ],
      cadence:"short",
      pacing:"immediate",
      ornament:"none",
      visualWeight:"high-contrast",
      example:
        "That would reveal too much. We do not confuse access with entitlement."
    },

    handoff:{
      id:"handoff",
      label:"Handoff",
      purpose:
        "Transfer the visitor naturally to the correct owner without sounding procedural.",
      tone:[
        "personal",
        "confident",
        "clear",
        "generous"
      ],
      cadence:"short-to-medium",
      pacing:"responsive",
      ornament:"restrained",
      visualWeight:"directional",
      example:
        "That question belongs to Jeeves. He sees the whole House at once; I prefer the door where a person decides whether to enter."
    }
  };

  const UI_COPY = {
    status:{
      loading:"Elara is gathering the signal.",
      opening:"Elara noticed you.",
      speaking:"Elara is speaking.",
      listening:"Elara is listening.",
      thinking:"Elara is deciding what to reveal.",
      handoff:"Elara found the right door.",
      warning:"Elara is protecting the boundary.",
      ready:"Elara is here."
    },

    modes:{
      meet_sean:"Meet Sean",
      nine_summits_love:"Nine Summits of Love"
    },

    console:{
      title:"Talk to Elara",
      subtitle:
        "Two paths. One voice. Choose what you came looking for.",
      promptLabel:"Where should we begin?",
      returnLabel:"Return to Elara's main questions",
      restartLabel:"Begin again",
      continueLabel:"Keep going"
    }
  };

  const MODES = {
    meet_sean:{
      id:"meet_sean",
      label:"Meet Sean",
      eyebrow:"Human Threshold",
      title:"Find the person behind the House.",
      opening:[
        {
          register:"invitation",
          text:
            "There you are. I was wondering whether you would come looking for the person behind all of this."
        },
        {
          register:"revelation",
          text:
            "I'm Elara. Before you meet Sean, there are a few things I would rather you understand."
        }
      ],
      main:[
        "who_sean",
        "what_shaped_sean",
        "what_changed_in_china",
        "why_house_exists"
      ],
      secondary:[
        "what_256_means",
        "what_1001_traversal_is",
        "what_inner_underdog_means",
        "where_sean_path_leads"
      ],
      contextualPathways:[
        "meetSean",
        "book",
        "jeeves",
        "auren"
      ]
    },

    nine_summits_love:{
      id:"nine_summits_love",
      label:"Nine Summits of Love",
      eyebrow:"Book Threshold",
      title:"Enter the climb.",
      opening:[
        {
          register:"invitation",
          text:
            "The Nine Summits is called a book because we needed a word for it."
        },
        {
          register:"revelation",
          text:
            "It behaves more like a mountain. You do not finish it unchanged."
        }
      ],
      main:[
        "what_book_is",
        "what_256_carats_means",
        "what_climb_is",
        "why_love_cannot_be_conquered"
      ],
      secondary:[
        "what_nine_summits_are",
        "first_three_summits",
        "middle_three_summits",
        "final_three_summits",
        "mirrorland_climate",
        "where_book_path_leads"
      ],
      contextualPathways:[
        "book",
        "meetSean",
        "jeeves",
        "soren"
      ]
    }
  };

  const DIALOGUES = {
    who_sean:{
      id:"who_sean",
      mode:"meet_sean",
      register:"revelation",
      prompt:"Who is Sean, really?",
      responses:[
        "Sean is the designer and builder behind Diamond Gate Bridge.",
        "That is accurate, but it is not the interesting part.",
        "The interesting part is that he kept imagining a life larger than the one he had been handed, even when his circumstances gave him very little evidence that the larger life would arrive.",
        "The House grew from that refusal to stop reaching.",
        "Not from a perfect plan. Not from comfort. From pressure that slowly became language, structure, and direction."
      ],
      followups:[
        "what_shaped_sean",
        "what_changed_in_china",
        "what_inner_underdog_means",
        "where_sean_path_leads"
      ],
      contextualRoute:"meetSean",
      tags:[
        "sean",
        "human-story",
        "builder",
        "dreamer"
      ]
    },

    what_shaped_sean:{
      id:"what_shaped_sean",
      mode:"meet_sean",
      register:"care",
      prompt:"What shaped him?",
      responses:[
        "Sean was a dreamer before he had the structure to carry the dream.",
        "That creates a particular kind of pressure. You can see farther than you know how to travel.",
        "He met walls outside himself, and he met patterns inside himself that took longer to recognize.",
        "The turn came when pressure stopped looking random.",
        "He began reading it.",
        "Once pressure could be read, it could become language. Once it became language, it could become a map."
      ],
      followups:[
        "what_changed_in_china",
        "why_house_exists",
        "what_256_means",
        "what_inner_underdog_means"
      ],
      contextualRoute:null,
      tags:[
        "pressure",
        "formation",
        "language",
        "mapping"
      ]
    },

    what_changed_in_china:{
      id:"what_changed_in_china",
      mode:"meet_sean",
      register:"revelation",
      prompt:"What changed in China?",
      responses:[
        "China changed the way Sean saw structure.",
        "He lived in Zibo, in Shandong Province, and became deeply drawn to Mandarin, Chinese philosophy, and the discipline of pattern.",
        "Mandarin gave him pressure. Philosophy gave that pressure form.",
        "Then theology, philosophy, and science stopped looking like unrelated subjects.",
        "They began to look like different languages circling deeper order.",
        "That is one of the places where the House begins."
      ],
      followups:[
        "what_256_means",
        "what_1001_traversal_is",
        "why_house_exists",
        "where_sean_path_leads"
      ],
      contextualRoute:null,
      tags:[
        "china",
        "zibo",
        "mandarin",
        "philosophy",
        "structure"
      ]
    },

    why_house_exists:{
      id:"why_house_exists",
      mode:"meet_sean",
      register:"revelation",
      prompt:"Why does this House exist?",
      responses:[
        "Because scattered insight disappears too easily.",
        "A person can spend years noticing connections and still lose them if there is no structure strong enough to hold them.",
        "Diamond Gate Bridge is Sean's attempt to give relation a home.",
        "The House lets research, stories, products, people, worlds, and questions remain distinct without becoming disconnected.",
        "It is not one idea pretending to be everything.",
        "It is a place where many things can remain themselves and still belong to a larger order."
      ],
      followups:[
        "what_256_means",
        "where_sean_path_leads",
        "ask_jeeves",
        "what_book_is"
      ],
      contextualRoute:"jeeves",
      tags:[
        "house",
        "coherence",
        "relation",
        "architecture"
      ]
    },

    what_256_means:{
      id:"what_256_means",
      mode:"meet_sean",
      register:"revelation",
      prompt:"Why does 256 keep appearing?",
      responses:[
        "Because 256 became one of Sean's structural languages.",
        "Not a lucky number. Not decoration.",
        "A way to think about states, paths, relationships, movement, and addressable possibility.",
        "Once he began seeing systems as fields rather than lists, 256 became a useful shape for organizing complexity.",
        "That is why it appears in the software, the research, and the Book.",
        "The meaning changes by room. The structural instinct remains."
      ],
      followups:[
        "what_1001_traversal_is",
        "what_256_carats_means",
        "why_house_exists",
        "where_sean_path_leads"
      ],
      contextualRoute:null,
      tags:[
        "256",
        "structure",
        "states",
        "systems"
      ]
    },

    what_1001_traversal_is:{
      id:"what_1001_traversal_is",
      mode:"meet_sean",
      register:"revelation",
      prompt:"What is the 1,001 Traversal Learning System?",
      responses:[
        "It began before Sean knew he was designing a learning system.",
        "While learning Mandarin, he stopped treating every word as equally urgent.",
        "He began asking better questions.",
        "Which words return most often? Which words unlock the greatest range of expression? Which patterns make the next pattern easier to recognize?",
        "That became the seed of 1,001 Traversal: learning through usefulness, familiarity, compression, and movement.",
        "I can tell you why it matters. Auren owns what it becomes on the product floor."
      ],
      followups:[
        "ask_auren",
        "what_changed_in_china",
        "why_house_exists",
        "where_sean_path_leads"
      ],
      contextualRoute:"auren",
      tags:[
        "1001-traversal",
        "mandarin",
        "learning",
        "education"
      ]
    },

    what_inner_underdog_means:{
      id:"what_inner_underdog_means",
      mode:"meet_sean",
      register:"care",
      prompt:"What is the inner underdog?",
      responses:[
        "The inner underdog is not the weakest part of a person.",
        "It is the part that refused to disappear.",
        "For Sean, that idea connects pressure, comedy, recovery, and voice.",
        "Comedy lowers the wall. Story gives pressure a face. Voice lets a person stop hiding from what they already survived.",
        "So when Sean says finding your inner underdog is finding your voice, he is naming the part of a person that still wants to rise.",
        "That part is often less polished than confidence and more trustworthy than performance."
      ],
      followups:[
        "what_shaped_sean",
        "where_sean_path_leads",
        "what_book_is"
      ],
      contextualRoute:"underdog",
      tags:[
        "underdog",
        "voice",
        "comedy",
        "recovery"
      ]
    },

    where_sean_path_leads:{
      id:"where_sean_path_leads",
      mode:"meet_sean",
      register:"handoff",
      prompt:"Where does Sean's path lead?",
      responses:[
        "Meeting Sean is the human doorway, not the end of the House.",
        "The Nine Summits carries the climb.",
        "Auren carries practical systems.",
        "Jeeves can show you how the rooms belong together.",
        "Soren handles questions that require diagnostic orientation.",
        "I stay close to the moment where meaning becomes visible enough for a person to choose."
      ],
      followups:[
        "what_book_is",
        "ask_jeeves",
        "ask_auren",
        "ask_soren"
      ],
      contextualRoute:"meetSean",
      tags:[
        "handoff",
        "paths",
        "house"
      ]
    },

    what_book_is:{
      id:"what_book_is",
      mode:"nine_summits_love",
      register:"invitation",
      prompt:"What is The Nine Summits of Love?",
      responses:[
        "It is called a book because we needed a word visitors would recognize.",
        "But it behaves more like a climb.",
        "It begins with a heart under pressure: locked, chained, tired, or unable to recognize its own value.",
        "The Book does not deny the pressure.",
        "It asks whether pressure can become formation instead of disappearance.",
        "That is where the mountain begins."
      ],
      followups:[
        "what_256_carats_means",
        "what_climb_is",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered"
      ],
      contextualRoute:"book",
      tags:[
        "book",
        "nine-summits",
        "love",
        "ascent"
      ]
    },

    what_256_carats_means:{
      id:"what_256_carats_means",
      mode:"nine_summits_love",
      register:"care",
      prompt:"What does 256 Carats mean?",
      responses:[
        "256 Carats is the jewel-language of the Book.",
        "It means value under pressure.",
        "Hidden does not mean absent.",
        "Locked does not mean destroyed.",
        "Burdened does not mean worthless.",
        "A diamond becomes visible through pressure, cutting, clarity, and refinement.",
        "The Book uses that image to say the heart may still carry extraordinary value before it knows how to reveal it."
      ],
      followups:[
        "what_climb_is",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered",
        "mirrorland_climate"
      ],
      contextualRoute:"book",
      tags:[
        "256-carats",
        "value",
        "pressure",
        "diamond"
      ]
    },

    what_climb_is:{
      id:"what_climb_is",
      mode:"nine_summits_love",
      register:"revelation",
      prompt:"What is the climb?",
      responses:[
        "The climb is the Book's language for becoming.",
        "Not a checklist. Not a motivational ladder.",
        "The base of the mountain is where inherited pain, family wounds, social decay, survival habits, and unfinished patterns collect.",
        "Each path gives the heart a discipline.",
        "Each summit changes what the heart can carry.",
        "And the mountain keeps rising because Love is not a peak the climber owns.",
        "The closer the heart moves toward Love, the more the mountain reveals."
      ],
      followups:[
        "what_nine_summits_are",
        "first_three_summits",
        "why_love_cannot_be_conquered",
        "mirrorland_climate"
      ],
      contextualRoute:"book",
      tags:[
        "climb",
        "formation",
        "mountain",
        "becoming"
      ]
    },

    what_nine_summits_are:{
      id:"what_nine_summits_are",
      mode:"nine_summits_love",
      register:"revelation",
      prompt:"What are the Nine Summits?",
      responses:[
        "The paths are disciplines. The summits are formations.",
        "Gratitude climbs toward Character.",
        "Generosity climbs toward Structure.",
        "Dependability climbs toward Balance.",
        "Accountability climbs toward Stability.",
        "Humility climbs toward Peace.",
        "Forgiveness climbs toward Joy.",
        "Self-Control climbs toward Dignity.",
        "Patience climbs toward Free Will.",
        "Purity climbs toward Love.",
        "The path is what the heart practices. The summit is what the heart becomes capable of carrying."
      ],
      followups:[
        "first_three_summits",
        "middle_three_summits",
        "final_three_summits",
        "why_love_cannot_be_conquered"
      ],
      contextualRoute:"book",
      tags:[
        "nine-summits",
        "paths",
        "formations"
      ]
    },

    first_three_summits:{
      id:"first_three_summits",
      mode:"nine_summits_love",
      register:"revelation",
      prompt:"Tell me about the first three.",
      responses:[
        "The first three teach the heart how to begin climbing.",
        "Gratitude moves toward Character because it teaches the heart to see what is present before demanding more.",
        "Generosity moves toward Structure because giving well requires order. A person cannot give forever from chaos.",
        "Dependability moves toward Balance because trust grows when a person becomes steady enough to be counted on.",
        "They sound gentle.",
        "They are not passive."
      ],
      followups:[
        "middle_three_summits",
        "final_three_summits",
        "what_nine_summits_are",
        "why_love_cannot_be_conquered"
      ],
      contextualRoute:"book",
      tags:[
        "gratitude",
        "generosity",
        "dependability"
      ]
    },

    middle_three_summits:{
      id:"middle_three_summits",
      mode:"nine_summits_love",
      register:"care",
      prompt:"Tell me about the middle three.",
      responses:[
        "The middle three stabilize the climb.",
        "Accountability moves toward Stability because a person cannot become steady while refusing to see their own part.",
        "Humility moves toward Peace because ego keeps unnecessary wars alive.",
        "Forgiveness moves toward Joy because bitterness can keep the heart chained to what hurt it.",
        "This is where the emotional weather begins to change."
      ],
      followups:[
        "first_three_summits",
        "final_three_summits",
        "what_nine_summits_are",
        "mirrorland_climate"
      ],
      contextualRoute:"book",
      tags:[
        "accountability",
        "humility",
        "forgiveness"
      ]
    },

    final_three_summits:{
      id:"final_three_summits",
      mode:"nine_summits_love",
      register:"revelation",
      prompt:"Tell me about the final three.",
      responses:[
        "The final three prepare the heart for higher altitude.",
        "Self-Control moves toward Dignity because dignity requires freedom from every passing impulse, wound, and reaction.",
        "Patience moves toward Free Will because real choice requires space.",
        "Without patience, people often repeat pressure and call it freedom.",
        "Purity moves toward Love because Love cannot be carried cleanly by a heart committed to distortion.",
        "Then the air changes."
      ],
      followups:[
        "why_love_cannot_be_conquered",
        "mirrorland_climate",
        "what_nine_summits_are",
        "where_book_path_leads"
      ],
      contextualRoute:"book",
      tags:[
        "self-control",
        "patience",
        "purity"
      ]
    },

    why_love_cannot_be_conquered:{
      id:"why_love_cannot_be_conquered",
      mode:"nine_summits_love",
      register:"revelation",
      prompt:"Why can't Love be conquered?",
      responses:[
        "Because Love is not a trophy.",
        "The Book does not place the climber above Love and call the climb complete.",
        "Love can be approached, practiced, described, and allowed to refine the person reaching toward it.",
        "But it is not possessed.",
        "The point is not conquest.",
        "The point is becoming more capable of reaching without reducing Love to something smaller than itself.",
        "Love does not end the climb.",
        "Love teaches the climb how to continue."
      ],
      followups:[
        "what_climb_is",
        "what_nine_summits_are",
        "mirrorland_climate",
        "where_book_path_leads"
      ],
      contextualRoute:"book",
      tags:[
        "love",
        "unconquered",
        "ascent",
        "formation"
      ]
    },

    mirrorland_climate:{
      id:"mirrorland_climate",
      mode:"nine_summits_love",
      register:"invitation",
      prompt:"What is Mirrorland's climate?",
      responses:[
        "Mirrorland has its own weather.",
        "Not rain and wind. The kind made by memory, pressure, dignity, choice, reflection, and consequence.",
        "The Nine Summits teaches the heart how to breathe there.",
        "That is why the Book belongs near the doorway.",
        "It is not only a path into a world.",
        "It is acclimation."
      ],
      followups:[
        "what_climb_is",
        "why_love_cannot_be_conquered",
        "what_book_is",
        "ask_jeeves"
      ],
      contextualRoute:"showroom",
      tags:[
        "mirrorland",
        "climate",
        "acclimation"
      ]
    },

    where_book_path_leads:{
      id:"where_book_path_leads",
      mode:"nine_summits_love",
      register:"handoff",
      prompt:"Where does the Book lead?",
      responses:[
        "The Book stays with the climb.",
        "If you want the person behind the voice, meet Sean.",
        "If you want the whole House, ask Jeeves.",
        "If you want practical systems, Auren is waiting on the product floor.",
        "If you need diagnostic orientation, Soren owns that boundary.",
        "I remain here, where the visitor decides whether meaning is worth carrying farther."
      ],
      followups:[
        "ask_jeeves",
        "ask_auren",
        "ask_soren",
        "who_sean"
      ],
      contextualRoute:"book",
      tags:[
        "handoff",
        "book",
        "paths"
      ]
    },

    ask_jeeves:{
      id:"ask_jeeves",
      mode:"shared",
      register:"handoff",
      prompt:"What should I ask Jeeves?",
      responses:[
        "Ask him how the House fits together.",
        "Jeeves sees the estate as a whole.",
        "I prefer the moment where a person decides whether the door matters.",
        "He can show you what belongs beyond it."
      ],
      followups:[
        "why_house_exists",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],
      contextualRoute:"jeeves",
      tags:[
        "jeeves",
        "handoff",
        "whole-house"
      ]
    },

    ask_auren:{
      id:"ask_auren",
      mode:"shared",
      register:"handoff",
      prompt:"What should I ask Auren?",
      responses:[
        "Ask Auren what the idea becomes when it has to work.",
        "He owns the product floor, Education, 1,001 Traversal, and practical systems.",
        "I can make the purpose visible.",
        "Auren can show you the instrument."
      ],
      followups:[
        "what_1001_traversal_is",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],
      contextualRoute:"auren",
      tags:[
        "auren",
        "handoff",
        "products"
      ]
    },

    ask_soren:{
      id:"ask_soren",
      mode:"shared",
      register:"handoff",
      prompt:"What should I ask Soren?",
      responses:[
        "Ask Soren when the question requires diagnosis rather than invitation.",
        "He owns coherence assessment, orientation boundaries, and the discipline of not pretending a system is ready when it is not.",
        "I make meaning visible.",
        "Soren tests whether the structure can carry it."
      ],
      followups:[
        "why_house_exists",
        "where_sean_path_leads",
        "where_book_path_leads"
      ],
      contextualRoute:"soren",
      tags:[
        "soren",
        "handoff",
        "diagnostic"
      ]
    },

    boundary_protected:{
      id:"boundary_protected",
      mode:"shared",
      register:"warning",
      prompt:"Can you reveal the protected architecture?",
      responses:[
        "No.",
        "That would reveal too much.",
        "We do not confuse curiosity with permission or access with entitlement.",
        "I can explain why the architecture matters.",
        "I will not expose what must remain protected."
      ],
      followups:[
        "why_house_exists",
        "ask_jeeves"
      ],
      contextualRoute:null,
      tags:[
        "boundary",
        "warning",
        "protected"
      ]
    }
  };

  const PATHWAYS = {
    meetSean:{
      id:"meet-sean-pathway",
      context:"human-story",
      eyebrow:"Human Threshold",
      title:"Meet Sean",
      description:
        "Continue into the public story of the designer, builder, dreamer, and human voice behind Diamond Gate Bridge.",
      route:"meetSean",
      voiceLine:
        "You have heard my introduction. Sean should get the next word."
    },

    book:{
      id:"book-pathway",
      context:"ascent",
      eyebrow:"Book Threshold",
      title:"Open The Nine Summits of Love",
      description:
        "Continue into the mountain-ascent path through pressure, value, formation, and Love.",
      route:"book",
      voiceLine:
        "The climb is easier to understand once you stop treating it like a chapter list."
    },

    jeeves:{
      id:"jeeves-pathway",
      context:"whole-house",
      eyebrow:"Whole-House Orientation",
      title:"Ask Jeeves",
      description:
        "See how the rooms, worlds, people, and systems belong to the larger estate.",
      route:"jeeves",
      voiceLine:
        "Jeeves sees the whole House at once. I let him keep that particular headache."
    },

    auren:{
      id:"auren-pathway",
      context:"practical-systems",
      eyebrow:"Product Floor",
      title:"Talk to Auren",
      description:
        "Continue into products, Education, the 1,001 Traversal Learning System, and practical implementation.",
      route:"auren",
      voiceLine:
        "Purpose is lovely. Auren will ask whether it can survive contact with reality."
    },

    soren:{
      id:"soren-pathway",
      context:"diagnostic",
      eyebrow:"Diagnostic Orientation",
      title:"Talk to Soren",
      description:
        "Continue into coherence assessment, diagnostic boundaries, and orientation logic.",
      route:"soren",
      voiceLine:
        "When the question becomes diagnostic, Soren is the honest next room."
    },

    compass:{
      id:"compass-pathway",
      context:"return",
      eyebrow:"Public Entrance",
      title:"Return to Compass",
      description:
        "Return to the primary public entrance of Diamond Gate Bridge.",
      route:"compass",
      voiceLine:
        "You can always return to the entrance. A good door does not trap the visitor."
    }
  };

  const TEAM = {
    elara:{
      id:"elara",
      name:"Elara",
      role:"Signal Bearer",
      ownership:
        "Human meaning, Sean, the Book threshold, public Mission, and Mirrorland's emotional climate.",
      route:null
    },

    jeeves:{
      id:"jeeves",
      name:"Jeeves",
      role:"Estate Guide",
      ownership:
        "Whole-House map, estate orientation, room ownership, and system context.",
      route:"jeeves"
    },

    auren:{
      id:"auren",
      name:"Auren",
      role:"Practical Systems Guide",
      ownership:
        "Products, Education, 1,001 Traversal, and implementation.",
      route:"auren"
    },

    soren:{
      id:"soren",
      name:"Soren",
      role:"Diagnostic Guide",
      ownership:
        "Coherence Diagnostic, assessment boundaries, and orientation logic.",
      route:"soren"
    }
  };

  const DOSSIER = {
    eyebrow:"Core Class",
    title:"Signal Bearer",
    summary:
      "Bubbly, articulate, intelligent, confident, and public-facing—disciplined by visibility ethics.",
    dimensions:[
      {
        id:"surface",
        label:"Surface",
        value:"Public-facing clarity",
        description:
          "Socially fluent, welcoming, articulate, and capable of making difficult ideas feel approachable."
      },
      {
        id:"core",
        label:"Core",
        value:"Concealment and revelation",
        description:
          "She decides what needs illumination, what requires preparation, and what must remain protected."
      },
      {
        id:"rule",
        label:"Rule",
        value:"Reveal enough to invite",
        description:
          "Protect enough to preserve meaning and prevent careless exposure."
      }
    ]
  };

  const getRoute = routeId => {
    const route =
      ROUTES[routeId];

    return route || null;
  };

  const getMode = modeId => {
    const mode =
      MODES[modeId];

    return mode || null;
  };

  const getOpening = modeId => {
    const mode =
      getMode(modeId);

    return mode
      ? mode.opening
      : [];
  };

  const getDialogue = dialogueId => {
    const dialogue =
      DIALOGUES[dialogueId];

    return dialogue || null;
  };

  const getRegister = registerId => {
    const register =
      REGISTERS[registerId];

    return register || null;
  };

  const getPathway = pathwayId => {
    const pathway =
      PATHWAYS[pathwayId];

    return pathway || null;
  };

  const getTeamMember = memberId => {
    const member =
      TEAM[memberId];

    return member || null;
  };

  const getMainDialogueIds = modeId => {
    const mode =
      getMode(modeId);

    return mode
      ? mode.main.slice()
      : [];
  };

  const getSecondaryDialogueIds = modeId => {
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
      Array.isArray(dialogueIds)
        ? dialogueIds
        : [];

    return ids
      .map(getDialogue)
      .filter(Boolean)
      .filter(
        item =>
          item.mode === modeId ||
          item.mode === "shared"
      )
      .map(
        item => ({
          id:item.id,
          label:item.prompt,
          register:item.register,
          contextualRoute:
            item.contextualRoute
        })
      );
  };

  const getMainOptions = modeId =>
    getDialogueOptions(
      getMainDialogueIds(modeId),
      modeId
    );

  const getSecondaryOptions = modeId =>
    getDialogueOptions(
      getSecondaryDialogueIds(modeId),
      modeId
    );

  const getFollowupOptions = (
    dialogueId,
    modeId
  ) => {
    const dialogue =
      getDialogue(dialogueId);

    if (!dialogue) {
      return [];
    }

    return getDialogueOptions(
      dialogue.followups,
      modeId
    );
  };

  const getContextualRoute = dialogueId => {
    const dialogue =
      getDialogue(dialogueId);

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

  const containsForbiddenPattern = text => {
    const source =
      normalize(text).toLowerCase();

    return LANGUAGE_LAWS
      .avoidPatterns
      .some(
        pattern =>
          source.includes(
            pattern.toLowerCase()
          )
      );
  };

  const validateDialogue = dialogue => {
    if (!dialogue) {
      return {
        valid:false,
        reason:"missing-dialogue"
      };
    }

    if (
      !dialogue.id ||
      !dialogue.prompt ||
      !Array.isArray(dialogue.responses) ||
      !dialogue.responses.length
    ) {
      return {
        valid:false,
        reason:"incomplete-dialogue"
      };
    }

    const invalidResponse =
      dialogue.responses.find(
        response =>
          containsForbiddenPattern(
            response
          )
      );

    if (invalidResponse) {
      return {
        valid:false,
        reason:"forbidden-machine-language",
        response:invalidResponse
      };
    }

    return {
      valid:true,
      reason:"accepted"
    };
  };

  const validateAllDialogues = () => {
    const results = {};

    Object.keys(DIALOGUES).forEach(
      key => {
        results[key] =
          validateDialogue(
            DIALOGUES[key]
          );
      }
    );

    return results;
  };

  const API = {
    contract:CONTRACT,
    version:1,
    ready:true,

    identity:IDENTITY,
    ownership:OWNERSHIP,
    language:LANGUAGE_LAWS,
    registers:REGISTERS,
    ui:UI_COPY,
    routes:ROUTES,
    modes:MODES,
    dialogues:DIALOGUES,
    pathways:PATHWAYS,
    team:TEAM,
    dossier:DOSSIER,

    getRoute,
    getMode,
    getOpening,
    getDialogue,
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

  API.language =
    LANGUAGE_LAWS;

  deepFreeze(API);

  Object.defineProperty(
    window,
    GLOBAL_NAME,
    {
      value:API,
      enumerable:true,
      configurable:false,
      writable:false
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
          detail:{
            contract:CONTRACT,
            agent:IDENTITY.name,
            role:IDENTITY.role,
            modes:Object.keys(MODES),
            dialogueCount:
              Object.keys(DIALOGUES).length,
            pathwayCount:
              Object.keys(PATHWAYS).length,
            ownership:
              OWNERSHIP.owns.slice()
          }
        }
      )
    );
  }
})();
