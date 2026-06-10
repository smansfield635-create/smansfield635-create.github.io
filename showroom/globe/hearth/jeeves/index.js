// /showroom/globe/hearth/jeeves/index.js
// HEARTH_JEEVES_CONVERSATIONAL_ESTATE_CHARACTER_ARCHETYPE_CARTOGRAPHY_COMPLETION_TNT_v18_1
// Full-file replacement.
// Preserves existing HTML/CSS contract.
// Purpose:
// - Preserve v18 semantic skeleton and v17.2 working prompt continuity.
// - Shorten Jeeves' intro and make the first tone hosted, conversational, and estate-native.
// - Replace generic world-path language with named Mirrorland / Atrium / Audralia / Hearth / Frontier language.
// - Complete missing cartography joints.
// - Upgrade Character Mirror language to Character Archetype Mirror.
// - Add character-path social cue logic without blocking character questions.
// - Guard source/value/character/Mirrorland/Hearth paths from older advisory override.
// Does not own:
// - server-side model execution
// - API keys
// - persistent memory
// - backend canon storage
//

(function hearthJeevesConversationalEstateCharacterArchetypeCartographyCompletion(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_CONVERSATIONAL_ESTATE_CHARACTER_ARCHETYPE_CARTOGRAPHY_COMPLETION_TNT_v18_1";
  var ROUTE = "/showroom/globe/hearth/jeeves/";
  var DEFAULT_BRAIN_ENDPOINT = "/api/jeeves.js";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";
  var MODE_CHARACTER_ARCHETYPE = "characterArchetype";

  var MAX_HISTORY = 80;

  var PACING = {
    firstMessageDelayMs: 950,
    typingBaseMs: 1380,
    typingWordMs: 112,
    typingMinMs: 1320,
    typingMaxMs: 5000,
    readBaseMs: 1600,
    readWordMs: 105,
    readMinMs: 1850,
    readMaxMs: 6400,
    optionRevealDelayMs: 900,
    tapMaxDistancePx: 14,
    tapMaxDurationMs: 360
  };

  var POSTURES = [
    "arrival",
    "skeptic",
    "orientation",
    "proof",
    "diagnostic",
    "sean",
    "products",
    "book",
    "mirrorland",
    "hearth",
    "audralia",
    "frontier",
    "characters",
    "futureProfile",
    "mirrorMe",
    "handoff"
  ];

  var PHASES = [
    "receive",
    "ground",
    "fork",
    "clarify",
    "reflect",
    "reveal",
    "prove",
    "personalize",
    "invite",
    "deepen",
    "route",
    "handoff",
    "return",
    "reset",
    "close",
    "continue"
  ];

  var HOUSE_SKELETON = {
    orientation: {
      key: "orientation",
      name: "Orientation",
      governingPhrase: "Orientation gives direction.",
      estateFunction: "Give the visitor direction before depth.",
      visitorQuestion: "Where am I, what is this, and where do I go next?",
      primaryRooms: ["jeevesInterface", "compassDesk", "guideDesk", "mainHall"],
      relatedPeople: ["Jeeves"],
      practicalRule: "If the visitor is lost, return to Jeeves, the Compass Desk, or the Guide Desk."
    },
    truth: {
      key: "truth",
      name: "Truth",
      governingPhrase: "The Laws provide truth.",
      estateFunction: "Give claims a boundary, a test, and a correction path.",
      visitorQuestion: "What can I trust?",
      primaryRooms: ["lawLibrary", "scientificLaw", "theLab"],
      relatedPeople: ["Soren", "Jeeves"],
      practicalRule: "If the visitor doubts, route to Scientific Law, the Law Library, or The Lab."
    },
    future: {
      key: "future",
      name: "Future",
      governingPhrase: "The Frontier provides the future.",
      estateFunction: "Give future-facing systems a place to be tested.",
      visitorQuestion: "What can be built, tested, or prepared?",
      primaryRooms: ["frontierWorkshopYard", "hearth", "audraliaConservatory"],
      relatedPeople: ["Dextrion", "Tarian", "Soren", "Alaric", "Elara", "Remote Team"],
      practicalRule: "If the visitor wants possibility, systems, or future pressure, route to Frontier."
    },
    window: {
      key: "window",
      name: "Window",
      governingPhrase: "Mirrorland is the window.",
      estateFunction: "Let the visitor see possible futures through story, pressure, consequence, and choice.",
      visitorQuestion: "What does the future look like when it becomes lived?",
      primaryRooms: ["atrium", "atlasStudy", "audraliaConservatory", "mirrorland"],
      relatedPeople: ["Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Remote Team"],
      practicalRule: "If the visitor wants the immersive window, name Mirrorland and open the Atrium."
    },
    depth: {
      key: "depth",
      name: "Depth",
      governingPhrase: "The Characters give depth.",
      estateFunction: "Make systems personal by giving pressure to people.",
      visitorQuestion: "Who carries this?",
      primaryRooms: ["characters", "characterArchetypeMirror"],
      relatedPeople: ["Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Jeeves", "Remote Team"],
      practicalRule: "If the visitor asks who carries the story, invite them to meet the Characters."
    },
    guide: {
      key: "guide",
      name: "Guide",
      governingPhrase: "Jeeves is the guide.",
      estateFunction: "Sequence truth, depth, and route choice without taking over the visitor’s mind.",
      visitorQuestion: "Who can help me choose without forcing me?",
      primaryRooms: ["jeevesInterface", "guideDesk", "compassDesk"],
      relatedPeople: ["Jeeves"],
      practicalRule: "If the visitor needs sequence, re-center and choose the next door."
    },
    source: {
      key: "source",
      name: "Source",
      governingPhrase: "Meet Sean reveals the human source behind the estate.",
      estateFunction: "Show the person building the estate, not only the estate itself.",
      visitorQuestion: "Who built this and why?",
      primaryRooms: ["meetSean", "thisUnderdog"],
      relatedPeople: ["Sean Mansfield"],
      practicalRule: "If the visitor asks who built this, why it exists, or where the human source is, route to Meet Sean."
    },
    value: {
      key: "value",
      name: "Value",
      governingPhrase: "The Nine Summits provide value logic.",
      estateFunction: "Give the estate a moral and relational spine.",
      visitorQuestion: "What human values govern this journey?",
      primaryRooms: ["nineSummits", "meetSean", "thisUnderdog"],
      relatedPeople: ["Sean Mansfield", "This Underdog"],
      practicalRule: "If the visitor asks about love, listening, limitation, expectation, manipulation, growth, or purpose, route to Nine Summits, Meet Sean, or This Underdog."
    },
    innerEntry: {
      key: "innerEntry",
      name: "Inner Human Entry",
      governingPhrase: "This Underdog is the inner human entry point.",
      estateFunction: "Let the visitor locate their own behavior under pressure inside the estate.",
      visitorQuestion: "Where do I personally enter this?",
      primaryRooms: ["thisUnderdog", "diagnostic", "characterArchetypeMirror"],
      relatedPeople: ["This Underdog", "Jeeves"],
      practicalRule: "If the visitor asks about self, behavior under pressure, voice, or reflection, route to This Underdog, Diagnostic, or Character Archetype Mirror."
    }
  };

  var SEAN_VALUE_AXIOMS = {
    expectationLimitation: {
      id: "expectationLimitation",
      source: "Sean Mansfield",
      sourceRoom: "meetSean",
      phrase: "When you learn to live a life without expectations, you experience a life without limitations.",
      functionName: "Release law",
      useCase: "Fear, control, disappointment, self-comparison, and the need to move without demanding the outcome first.",
      routeTargets: ["nineSummitsPath", "underdogPath", "seanPath", "diagnosticPath", "characterArchetypeMirrorPath"]
    },
    liveLoveLaughListen: {
      id: "liveLoveLaughListen",
      source: "Sean Mansfield",
      sourceRoom: "meetSean",
      phrase: "The secret of life: learn to live to love, learn to love to laugh, learn to live to listen.",
      functionName: "Relational law",
      useCase: "Love, listening, laughter, humility, relational participation, Nine Summits, and human-centered meaning.",
      routeTargets: ["nineSummitsPath", "bookPath", "underdogPath", "seanPath"]
    },
    manipulationMindOwnership: {
      id: "manipulationMindOwnership",
      source: "Sean Mansfield",
      sourceRoom: "meetSean",
      phrase: "Manipulation is when you use other people’s minds rather than your own.",
      functionName: "Agency law",
      useCase: "Ethics, influence, leadership, guidance, persuasion, coherence, and visitor agency.",
      routeTargets: ["nineSummitsPath", "scientificLawPath", "seanPath", "diagnosticPath", "characterArchetypeMirrorPath"]
    }
  };

  var NINE_SUMMITS_RELATIVITY = {
    name: "Nine Summits Relativity",
    rule: "The Nine Summits are not isolated virtues. Each summit modifies and corrects the others.",
    governingLine: "Release expectation. Enter relationship. Keep your own mind. Move with love. Listen before leading. Laugh without cruelty. Guide without manipulation. Choose without coercion. Grow without demanding the outcome first.",
    relationalPairs: [
      "Love without listening becomes projection.",
      "Listening without boundaries becomes absorption.",
      "Laughter without love becomes cruelty.",
      "Freedom without responsibility becomes drift.",
      "Vision without humility becomes manipulation.",
      "Strength without compassion becomes domination.",
      "Reflection without action becomes paralysis.",
      "Action without reflection becomes fragmentation.",
      "Purpose without love becomes performance."
    ]
  };

  var SITE_CARTOGRAPHY = {
    jeevesInterface: {
      roomId: "jeevesInterface",
      publicName: "Jeeves",
      estateLocation: "Front receiving chamber.",
      whatItIs: "The estate intelligence that receives the visitor at the door.",
      whyItMatters: "The visitor should feel hosted, not processed.",
      whoIsConnected: ["Jeeves"],
      visitorPressure: "I have arrived, but I do not know what I am standing inside.",
      abstractFunction: "Jeeves is the guide.",
      practicalAction: "Let Jeeves show you around, then choose a named door.",
      routeId: "jeeves",
      target: "intro",
      nextRooms: ["compassDesk", "guideDesk", "meetSean", "atrium", "characters"],
      proofBoundary: "Jeeves guides; the Laws still verify claims.",
      localGuideBehavior: "Welcome first, then orient.",
      returnToJeevesRule: "If the visitor is overwhelmed, return to Jeeves."
    },
    compassDesk: {
      roomId: "compassDesk",
      publicName: "Compass Desk",
      estateLocation: "Orientation layer / first direction point.",
      whatItIs: "The first practical direction room.",
      whyItMatters: "It prevents the estate from becoming overwhelming.",
      whoIsConnected: ["Jeeves"],
      visitorPressure: "I do not know where to begin.",
      abstractFunction: "Orientation gives direction.",
      practicalAction: "Choose truth, source, value, self-reflection, practical use, or Mirrorland.",
      routeId: "compass",
      target: "compassPath",
      nextRooms: ["guideDesk", "lawLibrary", "meetSean", "characterArchetypeMirror", "atrium"],
      proofBoundary: "Orientation is not proof; it only chooses the next room.",
      localGuideBehavior: "Explain the available doors without forcing the visitor.",
      returnToJeevesRule: "If the visitor asks for the whole estate, return to Jeeves."
    },
    guideDesk: {
      roomId: "guideDesk",
      publicName: "Guide Desk",
      estateLocation: "Public map / site guide.",
      whatItIs: "The public map of the estate.",
      whyItMatters: "It shows how the rooms relate before the visitor goes deep.",
      whoIsConnected: ["Jeeves"],
      visitorPressure: "I need the map.",
      abstractFunction: "Orientation becomes readable.",
      practicalAction: "Open the Site Guide or choose a room path.",
      routeId: "siteGuide",
      target: "siteGuidePath",
      nextRooms: ["compassDesk", "mainHall", "atrium", "lawLibrary", "frontierWorkshopYard"],
      proofBoundary: "The guide organizes rooms; it does not replace the rooms.",
      localGuideBehavior: "Explain room relationships, not full narrative depth.",
      returnToJeevesRule: "If the visitor needs interpretation, return to Jeeves."
    },
    mainHall: {
      roomId: "mainHall",
      publicName: "Main Hall",
      estateLocation: "Public estate center.",
      whatItIs: "The regular public center before branching.",
      whyItMatters: "It gives ordinary web visitors a familiar entry point.",
      whoIsConnected: ["Jeeves", "Sean Mansfield"],
      visitorPressure: "I want the public version first.",
      abstractFunction: "Access becomes organized.",
      practicalAction: "Choose proof, source, products, Diagnostic, or Mirrorland.",
      routeId: "home",
      target: "websitePath",
      nextRooms: ["compassDesk", "guideDesk", "lawLibrary", "meetSean", "productGallery", "atrium"],
      proofBoundary: "The Main Hall introduces; it does not complete proof.",
      localGuideBehavior: "Keep the first explanation plain.",
      returnToJeevesRule: "Return to Jeeves when the visitor asks which path matters."
    },
    atrium: {
      roomId: "atrium",
      publicName: "Atrium",
      estateLocation: "Threshold into Mirrorland.",
      whatItIs: "The doorway where ordinary web use begins crossing into Mirrorland.",
      whyItMatters: "It turns reading and looking into participation.",
      whoIsConnected: ["Jeeves", "Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Remote Team"],
      visitorPressure: "I want to enter Mirrorland.",
      abstractFunction: "Mirrorland is the window.",
      practicalAction: "Enter Mirrorland, open Atlas Study, meet the Characters, or visit Hearth, Audralia, or Frontier.",
      routeId: "showroom",
      target: "mirrorlandPath",
      nextRooms: ["atlasStudy", "audraliaConservatory", "hearth", "frontierWorkshopYard", "characters"],
      proofBoundary: "The window reveals possibility; truth still answers to the Laws.",
      localGuideBehavior: "Invite crossing, then ground with a named room.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs route sequence."
    },
    atlasStudy: {
      roomId: "atlasStudy",
      publicName: "Atlas Study",
      estateLocation: "World selection room.",
      whatItIs: "The place where Mirrorland’s worlds and reference bodies become easier to choose.",
      whyItMatters: "It prevents the Mirrorland side from becoming one undifferentiated idea.",
      whoIsConnected: ["Jeeves"],
      visitorPressure: "I want to understand which place I am looking at.",
      abstractFunction: "The window gains coordinates.",
      practicalAction: "Choose Earth reference, ZIONTS, Audralia, Hearth, or other world-facing rooms.",
      routeId: "globeWindow",
      target: "atlasPath",
      nextRooms: ["ziontsRoom", "audraliaConservatory", "hearth", "frontierWorkshopYard", "characters"],
      proofBoundary: "World selection is orientation, not claim verification.",
      localGuideBehavior: "Name the place and its role.",
      returnToJeevesRule: "Return to Jeeves if the visitor asks why the worlds matter."
    },
    ziontsRoom: {
      roomId: "ziontsRoom",
      publicName: "ZIONTS Room",
      estateLocation: "Consequence world reference.",
      whatItIs: "The room that carries the consequence side of the world logic.",
      whyItMatters: "It reminds the visitor that the future has a cost when systems fail or truth is hidden.",
      whoIsConnected: ["Soren", "Dextrion", "Jeeves"],
      visitorPressure: "I want to understand consequence.",
      abstractFunction: "ZIONTS is consequence.",
      practicalAction: "Study consequence, then compare it with Audralia, Frontier, Hearth, and Scientific Law.",
      routeId: "zionts",
      target: "ziontsPath",
      nextRooms: ["audraliaConservatory", "scientificLaw", "frontierWorkshopYard", "characters"],
      proofBoundary: "Consequence language must not become unsupported certainty.",
      localGuideBehavior: "Explain consequence without overstating lore.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs consequence placed in the full estate."
    },
    audraliaConservatory: {
      roomId: "audraliaConservatory",
      publicName: "Audralia Conservatory",
      estateLocation: "Constructive future world.",
      whatItIs: "The future world carried by the Mirrorland side.",
      whyItMatters: "It gives the future terrain, scale, and consequence.",
      whoIsConnected: ["Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Remote Team"],
      visitorPressure: "What world carries the future?",
      abstractFunction: "Audralia carries.",
      practicalAction: "Visit Audralia, open the Audralia Worldroom, continue to Frontier, Hearth, or the Characters.",
      routeId: "audralia",
      target: "audraliaPath",
      nextRooms: ["audraliaWorldroom", "controlCockpit", "frontierWorkshopYard", "hearth", "characters"],
      proofBoundary: "The world can reveal possibility; claims still answer to law.",
      localGuideBehavior: "Explain Audralia as a world, not decoration.",
      returnToJeevesRule: "Return to Jeeves when the visitor asks how Audralia relates to the estate."
    },
    audraliaWorldroom: {
      roomId: "audraliaWorldroom",
      publicName: "Audralia Worldroom",
      estateLocation: "Visible Audralia inspection chamber.",
      whatItIs: "The place where Audralia becomes a visible world-body for inspection.",
      whyItMatters: "It moves Audralia from idea into observable form.",
      whoIsConnected: ["Jeeves", "Alaric", "Tarian", "Elara"],
      visitorPressure: "I want to see the future world more directly.",
      abstractFunction: "Audralia becomes visible.",
      practicalAction: "Open the Worldroom, then continue to Control Cockpit, Frontier, Hearth, or Characters.",
      routeId: "audraliaWorldroom",
      target: "audraliaWorldroomPath",
      nextRooms: ["controlCockpit", "frontierWorkshopYard", "hearth", "characters"],
      proofBoundary: "Visual presence is not the same as full proof.",
      localGuideBehavior: "Describe the visible world without claiming completion.",
      returnToJeevesRule: "Return to Jeeves if the visitor needs the world-body placed in context."
    },
    controlCockpit: {
      roomId: "controlCockpit",
      publicName: "Control Cockpit",
      estateLocation: "Audralia readout and disposition chamber.",
      whatItIs: "The room where visible controls and world-readouts become understandable.",
      whyItMatters: "It shows that a world needs readable state, not only visual surface.",
      whoIsConnected: ["Jeeves", "Dextrion", "Alaric"],
      visitorPressure: "I want to understand the controls and current state.",
      abstractFunction: "State becomes readable.",
      practicalAction: "Open the Control Cockpit, then return to Audralia, Frontier, or Hearth.",
      routeId: "controlCockpit",
      target: "controlCockpitPath",
      nextRooms: ["audraliaWorldroom", "frontierWorkshopYard", "hearth", "theLab"],
      proofBoundary: "Readouts guide interpretation; they do not replace testing.",
      localGuideBehavior: "Explain what controls mean without overclaiming.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs the state interpreted."
    },
    lawLibrary: {
      roomId: "lawLibrary",
      publicName: "Law Library",
      estateLocation: "Truth and boundary wing.",
      whatItIs: "The room where the estate keeps claims disciplined.",
      whyItMatters: "It prevents language from outrunning truth.",
      whoIsConnected: ["Soren", "Jeeves"],
      visitorPressure: "I need to know what is true.",
      abstractFunction: "The Laws provide truth.",
      practicalAction: "Open Scientific Law, The Lab, or a proof path.",
      routeId: "laws",
      target: "proofPath",
      nextRooms: ["scientificLaw", "theLab", "frontierWorkshopYard", "hearth"],
      proofBoundary: "No claim outranks its evidence, measurement, correction path, and limits.",
      localGuideBehavior: "Name the rule, boundary, and test.",
      returnToJeevesRule: "Return to Jeeves if the visitor asks where the proof belongs."
    },
    scientificLaw: {
      roomId: "scientificLaw",
      publicName: "Scientific Law",
      estateLocation: "Reality Test chamber under the Laws.",
      whatItIs: "The claim-testing chamber.",
      whyItMatters: "It separates technical-sounding language from testable reality.",
      whoIsConnected: ["Soren", "Dextrion", "Jeeves"],
      visitorPressure: "I do not want to be fooled.",
      abstractFunction: "Truth becomes testable.",
      practicalAction: "Choose Theory, Evidence, Measure, Limits, or the claim ladder.",
      routeId: "scientificLaw",
      target: "scientificLawPath",
      nextRooms: ["lawLibrary", "theLab", "frontierWorkshopYard", "hearth"],
      proofBoundary: "A claim becomes scientific only when it can be defined, tested, corrected, limited, and checked again.",
      localGuideBehavior: "Test the claim before expanding it.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs the claim placed inside the estate."
    },
    theLab: {
      roomId: "theLab",
      publicName: "The Lab",
      estateLocation: "Status, gauges, and readiness room.",
      whatItIs: "The room that separates working, held, forming, and unproven states.",
      whyItMatters: "It prevents overclaiming.",
      whoIsConnected: ["Jeeves", "Soren"],
      visitorPressure: "What is actually working?",
      abstractFunction: "Truth gains visible status.",
      practicalAction: "Open Gauges or return to Scientific Law.",
      routeId: "gauges",
      target: "gaugesPath",
      nextRooms: ["scientificLaw", "lawLibrary", "frontierWorkshopYard"],
      proofBoundary: "Status is not the same as completion.",
      localGuideBehavior: "Show what is visible without exaggeration.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs status interpreted."
    },
    frontierWorkshopYard: {
      roomId: "frontierWorkshopYard",
      publicName: "Frontier Workshop Yard",
      estateLocation: "Future systems testing area.",
      whatItIs: "The applied-science yard for future systems.",
      whyItMatters: "The future needs systems that survive pressure, not only ideas.",
      whoIsConnected: ["Dextrion", "Tarian", "Soren", "Alaric", "Elara", "Remote Team"],
      visitorPressure: "I want to see what the future needs.",
      abstractFunction: "The Frontier provides the future.",
      practicalAction: "Choose Energy, Water, Waste, Closed Loop, Infrastructure, Lattice, Urban, Manual, Shimmer, Trajectory, or Vision.",
      routeId: "frontier",
      target: "frontierPath",
      nextRooms: ["hearth", "audraliaConservatory", "scientificLaw", "characters"],
      proofBoundary: "Future systems must remain bounded by Scientific Law.",
      localGuideBehavior: "Show the system, behavior under pressure, related character, and test boundary.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs to connect the system to the whole estate."
    },
    productGallery: {
      roomId: "productGallery",
      publicName: "Product Gallery",
      estateLocation: "Practical public value wing.",
      whatItIs: "The place where messages, tools, books, objects, and offerings become usable.",
      whyItMatters: "The estate must create public value, not only meaning.",
      whoIsConnected: ["Sean Mansfield", "This Underdog"],
      visitorPressure: "What can I use, buy, carry, or return to?",
      abstractFunction: "Meaning becomes practical.",
      practicalAction: "Open Products, Book, Nine Summits, or This Underdog.",
      routeId: "products",
      target: "productsPath",
      nextRooms: ["nineSummits", "meetSean", "thisUnderdog", "mainHall"],
      proofBoundary: "Practical value should not overstate readiness.",
      localGuideBehavior: "Explain usefulness plainly.",
      returnToJeevesRule: "Return to Jeeves when the visitor asks how practical value connects to the full estate."
    },
    meetSean: {
      roomId: "meetSean",
      publicName: "Meet Sean",
      estateLocation: "Human source chamber.",
      whatItIs: "The place where the visitor meets Sean Mansfield as writer, designer, and developer.",
      whyItMatters: "The estate needs a human source, not only rooms and systems.",
      whoIsConnected: ["Sean Mansfield", "This Underdog", "Jeeves"],
      visitorPressure: "Who built this and why?",
      abstractFunction: "Meet Sean reveals the human source behind the estate.",
      practicalAction: "Meet Sean, continue to This Underdog, Nine Summits, Diagnostic, or Character Archetype Mirror.",
      routeId: "meetSean",
      target: "seanPath",
      nextRooms: ["thisUnderdog", "nineSummits", "diagnostic", "characterArchetypeMirror", "mainHall"],
      proofBoundary: "The source explains origin; proof still answers to the Laws.",
      localGuideBehavior: "Explain Sean as source without turning the room into autobiography alone.",
      returnToJeevesRule: "Return to Jeeves when the visitor wants the source connected to the estate."
    },
    thisUnderdog: {
      roomId: "thisUnderdog",
      publicName: "This Underdog",
      estateLocation: "Inner human entry chamber.",
      whatItIs: "The visitor’s inner behavior-under-pressure entry point.",
      whyItMatters: "The estate becomes personal when the visitor recognizes their own behavior under pressure.",
      whoIsConnected: ["Sean Mansfield", "This Underdog", "Jeeves"],
      visitorPressure: "Where do I fit inside this?",
      abstractFunction: "This Underdog is the inner human entry point.",
      practicalAction: "Open This Underdog, Character Archetype Mirror, Diagnostic, Nine Summits, or Meet Sean.",
      routeId: "aboutUnderdog",
      target: "underdogPath",
      nextRooms: ["characterArchetypeMirror", "diagnostic", "nineSummits", "meetSean"],
      proofBoundary: "This is reflection, not diagnosis.",
      localGuideBehavior: "Return the visitor to agency.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs a clean next door."
    },
    nineSummits: {
      roomId: "nineSummits",
      publicName: "The Nine Summits",
      estateLocation: "Value construct chamber.",
      whatItIs: "The relational value system inside the estate.",
      whyItMatters: "It gives the journey moral and human-development logic.",
      whoIsConnected: ["Sean Mansfield", "This Underdog", "Jeeves"],
      visitorPressure: "What values guide this?",
      abstractFunction: "The Nine Summits provide value logic.",
      practicalAction: "Open the book path, Meet Sean, This Underdog, or Character Archetype Mirror.",
      routeId: "nineSummits",
      target: "nineSummitsPath",
      nextRooms: ["meetSean", "thisUnderdog", "characterArchetypeMirror", "productGallery"],
      proofBoundary: "Value guidance is reflective, not coercive.",
      localGuideBehavior: "Show connected relativity, not isolated slogans.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs the value construct placed in the full estate."
    },
    hearth: {
      roomId: "hearth",
      publicName: "Hearth",
      estateLocation: "Planetary construct facility.",
      whatItIs: "The unknown-location facility where world-formation logic becomes operational.",
      whyItMatters: "It gives planetary construction a named place.",
      whoIsConnected: ["Jeeves", "Dextrion", "Soren", "Remote Team"],
      visitorPressure: "Where does world construction become operational?",
      abstractFunction: "Hearth constructs.",
      practicalAction: "Open Hearth, connect to Frontier, Scientific Law, Audralia, or the Characters.",
      routeId: "hearth",
      target: "hearthPath",
      nextRooms: ["frontierWorkshopYard", "scientificLaw", "audraliaConservatory", "characters"],
      proofBoundary: "Construct claims remain bounded by Scientific Law.",
      localGuideBehavior: "Name Hearth as facility, not merely route or visual.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs Hearth placed in the whole world logic."
    },
    characters: {
      roomId: "characters",
      publicName: "Characters",
      estateLocation: "Mirrorland character chamber.",
      whatItIs: "The place where Mirrorland becomes personal through people.",
      whyItMatters: "Visitors should meet them as characters, not as labels.",
      whoIsConnected: ["Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Jeeves", "Remote Team"],
      visitorPressure: "Who are they?",
      abstractFunction: "The Characters give depth.",
      practicalAction: "Meet one character, see relationships, or use the Character Archetype Mirror.",
      routeId: "characters",
      target: "charactersPath",
      nextRooms: ["characterArchetypeMirror", "mirrorland", "frontierWorkshopYard", "audraliaConservatory", "hearth"],
      proofBoundary: "Character reflection is narrative and behavioral, not identity assignment.",
      localGuideBehavior: "Let the character profile carry the depth.",
      returnToJeevesRule: "Return to Jeeves for the full estate map."
    },
    characterArchetypeMirror: {
      roomId: "characterArchetypeMirror",
      publicName: "Character Archetype Mirror",
      estateLocation: "Reflective bridge between visitor and Characters.",
      whatItIs: "A guided reflection that compares the visitor’s behavior under pressure to a character pattern.",
      whyItMatters: "It lets the visitor enter Mirrorland through self-recognition without being labeled.",
      whoIsConnected: ["Jeeves", "Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Remote Team"],
      visitorPressure: "Which pattern do I follow when pressure rises?",
      abstractFunction: "Behavior under pressure becomes reflective.",
      practicalAction: "Answer three questions, view a Character Archetype reflection, then choose a character, Diagnostic, or Nine Summits.",
      routeId: "coherenceDiagnostic",
      target: "characterArchetypeMirrorPath",
      nextRooms: ["characters", "diagnostic", "nineSummits", "thisUnderdog"],
      proofBoundary: "Reflective pattern, not identity; current behavior under pressure, not permanent label.",
      localGuideBehavior: "Return the visitor to agency.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs broader direction."
    },
    mirrorland: {
      roomId: "mirrorland",
      publicName: "Mirrorland",
      estateLocation: "Future-facing window.",
      whatItIs: "The named place where truth and future become visible through story.",
      whyItMatters: "It gives the website more than reading, looking, and exploring.",
      whoIsConnected: ["Jeeves", "Auren Vale", "Dextrion", "Alaric", "Tarian", "Elara", "Soren", "Remote Team"],
      visitorPressure: "I want to enter the window.",
      abstractFunction: "Mirrorland is the window.",
      practicalAction: "Enter the Atrium, open Atlas Study, visit Audralia, Frontier, Hearth, or meet the Characters.",
      routeId: "mirrorland",
      target: "mirrorlandPath",
      nextRooms: ["atrium", "atlasStudy", "audraliaConservatory", "frontierWorkshopYard", "characters"],
      proofBoundary: "The window reveals possibility; truth still answers to the Laws.",
      localGuideBehavior: "Reveal without floating.",
      returnToJeevesRule: "Return to Jeeves for route sequence."
    },
    diagnostic: {
      roomId: "diagnostic",
      publicName: "Coherence Diagnostic",
      estateLocation: "Public self-reflection chamber.",
      whatItIs: "The local-only self-check that reflects behavior, coherence, and response patterns.",
      whyItMatters: "It gives the visitor a practical mirror before deeper interpretation.",
      whoIsConnected: ["Jeeves", "This Underdog"],
      visitorPressure: "I want to understand myself without being defined.",
      abstractFunction: "Inner behavior becomes visible.",
      practicalAction: "Take Diagnostic, use Character Archetype Mirror, or continue to This Underdog.",
      routeId: "coherenceDiagnostic",
      target: "diagnosticPath",
      nextRooms: ["characterArchetypeMirror", "thisUnderdog", "nineSummits", "scientificLaw"],
      proofBoundary: "Not medical, legal, official IQ, official MBTI, or stored profile.",
      localGuideBehavior: "Reflect without diagnosis.",
      returnToJeevesRule: "Return to Jeeves when the visitor needs next direction."
    }
  };

  var DEFAULT_ROUTES = {
    jeeves: ROUTE,
    compass: "/",
    home: "/",
    siteGuide: "/site-guide/",
    coherenceDiagnostic: "/coherence-diagnostic/",
    meetSean: "/meet-sean-mansfield/",
    products: "/products/",
    laws: "/laws/",
    scientificLaw: "/laws/scientific-law/",
    gauges: "/gauges/",
    showroom: "/showroom/",
    hearth: "/showroom/globe/hearth/",
    globeWindow: "/showroom/globe/",
    interactiveNarrative: "/showroom/globe/",
    mirrorland: "/showroom/globe/",
    zionts: "/showroom/globe/earth/",
    audralia: "/showroom/globe/audralia/",
    audraliaWorldroom: "/showroom/globe/audralia/planet/",
    controlCockpit: "/showroom/globe/audralia/disposition/",
    frontier: "/explore/frontier/",
    frontierEnergy: "/explore/frontier/energy/",
    frontierWater: "/explore/frontier/water/",
    frontierWaste: "/explore/frontier/waste/",
    frontierClosedLoop: "/explore/frontier/closed-loop/",
    frontierInfrastructure: "/explore/frontier/infrastructure/",
    frontierLattice: "/explore/frontier/lattice/",
    frontierUrban: "/explore/frontier/urban/",
    frontierManual: "/explore/frontier/manual/",
    frontierShimmer: "/explore/frontier/shimmer/",
    frontierTrajectory: "/explore/frontier/trajectory/",
    frontierVision: "/explore/frontier/vision/",
    characters: "/characters/",
    controlRoom: "/showroom/globe/hearth/diagnostic/",
    book: "/nine-summits-of-love/",
    nineSummits: "/nine-summits/",
    aboutUnderdog: "/about-this-underdog/"
  };

  var ROUTE_LABELS = {
    jeeves: "Return to Jeeves",
    compass: "Start at the Compass Desk",
    home: "Open the Main Hall",
    siteGuide: "Open the Guide Desk",
    coherenceDiagnostic: "Take the Coherence Diagnostic",
    meetSean: "Meet Sean",
    products: "Open the Product Gallery",
    laws: "Open the Law Library",
    scientificLaw: "Open Scientific Law",
    gauges: "Open The Lab",
    showroom: "Enter the Atrium",
    hearth: "Open Hearth",
    globeWindow: "Open the Atlas Study",
    interactiveNarrative: "Enter Mirrorland",
    mirrorland: "Open Mirrorland",
    zionts: "Open ZIONTS",
    audralia: "Visit Audralia",
    audraliaWorldroom: "Open the Audralia Worldroom",
    controlCockpit: "Open the Control Cockpit",
    frontier: "Explore Frontier",
    frontierEnergy: "Open Energy",
    frontierWater: "Open Water",
    frontierWaste: "Open Waste",
    frontierClosedLoop: "Open Closed Loop",
    frontierInfrastructure: "Open Infrastructure",
    frontierLattice: "Open Lattice",
    frontierUrban: "Open Urban",
    frontierManual: "Open Manual",
    frontierShimmer: "Open Shimmer",
    frontierTrajectory: "Open Trajectory",
    frontierVision: "Open Vision",
    characters: "Meet the Characters",
    controlRoom: "Open the Control Room",
    book: "Open The Nine Summits of Love",
    nineSummits: "Open Nine Summits",
    aboutUnderdog: "About This Underdog"
  };

  var APPROVED_ROUTE_IDS = Object.keys(DEFAULT_ROUTES);

  var APPROVED_TARGETS = [
    "intro",
    "askFirst",
    "websitePath",
    "skepticPlain",
    "proofPath",
    "diagnosticPath",
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "charactersPath",
    "compassPath",
    "whereToStart",
    "siteGuidePath",
    "lawsPath",
    "scientificLawPath",
    "scientificLawTheoryPath",
    "scientificLawEvidencePath",
    "scientificLawMeasurePath",
    "scientificLawLimitsPath",
    "scientificLawRoutePath",
    "scientificLawLadderPath",
    "scientificLawTermsPath",
    "gaugesPath",
    "seanPath",
    "underdogPath",
    "productsPath",
    "bookPath",
    "nineSummitsPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "ziontsPath",
    "audraliaPath",
    "audraliaWorldroomPath",
    "controlCockpitPath",
    "frontierPath",
    "frontierSystemsPath",
    "frontierEnergyPath",
    "frontierWaterPath",
    "frontierWastePath",
    "frontierClosedLoopPath",
    "frontierInfrastructurePath",
    "frontierLatticePath",
    "frontierUrbanPath",
    "frontierManualPath",
    "frontierShimmerPath",
    "frontierTrajectoryPath",
    "frontierVisionPath",
    "frontierLawPath",
    "frontierCharactersPath",
    "futureProfilePath",
    "mirrorMePath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterStoryPressurePath",
    "characterFirstPath",
    "characterAurenValePath",
    "characterDextrionPath",
    "characterAlaricPath",
    "characterTarianPath",
    "characterElaraPath",
    "characterSorenPath",
    "characterJeevesPath",
    "characterRemoteTeamPath",
    "characterArchetypeMirrorPath",
    "selfLearningPath",
    "characterArchetypeQuestionOne",
    "characterArchetypeQuestionTwo",
    "characterArchetypeQuestionThree",
    "characterArchetypeResult",
    "recenterNode",
    "loopRecovery",
    "cleanDoor",
    "switchTopics",
    "sharpQuestion",
    "returnFork",
    "restartFork"
  ];

  var LOCAL_FINAL_TARGETS = [
    "intro",
    "askFirst",
    "websitePath",
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "seanPath",
    "underdogPath",
    "bookPath",
    "nineSummitsPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "charactersPath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterStoryPressurePath",
    "characterFirstPath",
    "characterAurenValePath",
    "characterDextrionPath",
    "characterAlaricPath",
    "characterTarianPath",
    "characterElaraPath",
    "characterSorenPath",
    "characterJeevesPath",
    "characterRemoteTeamPath",
    "characterArchetypeMirrorPath",
    "selfLearningPath",
    "characterArchetypeQuestionOne",
    "characterArchetypeQuestionTwo",
    "characterArchetypeQuestionThree",
    "characterArchetypeResult"
  ];

  var NARRATIVE_TARGETS = [
    "mirrorlandPath",
    "atriumPath",
    "atlasPath",
    "hearthPath",
    "hearthFacilityPath",
    "hearthConstructPath",
    "hearthFrontierPath",
    "hearthLawPath",
    "ziontsPath",
    "audraliaPath",
    "audraliaWorldroomPath",
    "controlCockpitPath",
    "frontierPath",
    "frontierSystemsPath",
    "frontierEnergyPath",
    "frontierWaterPath",
    "frontierWastePath",
    "frontierClosedLoopPath",
    "frontierInfrastructurePath",
    "frontierLatticePath",
    "frontierUrbanPath",
    "frontierManualPath",
    "frontierShimmerPath",
    "frontierTrajectoryPath",
    "frontierVisionPath",
    "frontierLawPath",
    "frontierCharactersPath",
    "mirrorMePath",
    "charactersPath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterStoryPressurePath",
    "characterFirstPath",
    "characterAurenValePath",
    "characterDextrionPath",
    "characterAlaricPath",
    "characterTarianPath",
    "characterElaraPath",
    "characterSorenPath",
    "characterJeevesPath",
    "characterRemoteTeamPath"
  ];

  var TARGET_ROOM_MAP = {
    intro: "jeevesInterface",
    askFirst: "compassDesk",
    websitePath: "mainHall",
    skepticPlain: "lawLibrary",
    proofPath: "lawLibrary",
    lawsPath: "lawLibrary",
    compassPath: "compassDesk",
    whereToStart: "compassDesk",
    siteGuidePath: "guideDesk",
    scientificLawPath: "scientificLaw",
    scientificLawTheoryPath: "scientificLaw",
    scientificLawEvidencePath: "scientificLaw",
    scientificLawMeasurePath: "scientificLaw",
    scientificLawLimitsPath: "scientificLaw",
    scientificLawRoutePath: "scientificLaw",
    scientificLawLadderPath: "scientificLaw",
    scientificLawTermsPath: "scientificLaw",
    gaugesPath: "theLab",
    diagnosticPath: "diagnostic",
    futureProfilePath: "diagnostic",
    seanPath: "meetSean",
    underdogPath: "thisUnderdog",
    productsPath: "productGallery",
    bookPath: "nineSummits",
    nineSummitsPath: "nineSummits",
    mirrorlandPath: "mirrorland",
    atriumPath: "atrium",
    atlasPath: "atlasStudy",
    mirrorMePath: "mirrorland",
    hearthPath: "hearth",
    hearthFacilityPath: "hearth",
    hearthConstructPath: "hearth",
    hearthFrontierPath: "hearth",
    hearthLawPath: "hearth",
    ziontsPath: "ziontsRoom",
    audraliaPath: "audraliaConservatory",
    audraliaWorldroomPath: "audraliaWorldroom",
    controlCockpitPath: "controlCockpit",
    frontierPath: "frontierWorkshopYard",
    frontierSystemsPath: "frontierWorkshopYard",
    frontierEnergyPath: "frontierWorkshopYard",
    frontierWaterPath: "frontierWorkshopYard",
    frontierWastePath: "frontierWorkshopYard",
    frontierClosedLoopPath: "frontierWorkshopYard",
    frontierInfrastructurePath: "frontierWorkshopYard",
    frontierLatticePath: "frontierWorkshopYard",
    frontierUrbanPath: "frontierWorkshopYard",
    frontierManualPath: "frontierWorkshopYard",
    frontierShimmerPath: "frontierWorkshopYard",
    frontierTrajectoryPath: "frontierWorkshopYard",
    frontierVisionPath: "frontierWorkshopYard",
    frontierLawPath: "frontierWorkshopYard",
    frontierCharactersPath: "frontierWorkshopYard",
    charactersPath: "characters",
    characterIdentityPath: "characters",
    characterRelationshipsPath: "characters",
    characterTensionsPath: "characters",
    characterMotivesPath: "characters",
    characterStoryPressurePath: "characters",
    characterFirstPath: "characters",
    characterAurenValePath: "characters",
    characterDextrionPath: "characters",
    characterAlaricPath: "characters",
    characterTarianPath: "characters",
    characterElaraPath: "characters",
    characterSorenPath: "characters",
    characterJeevesPath: "characters",
    characterRemoteTeamPath: "characters",
    characterArchetypeMirrorPath: "characterArchetypeMirror",
    selfLearningPath: "characterArchetypeMirror",
    characterArchetypeQuestionOne: "characterArchetypeMirror",
    characterArchetypeQuestionTwo: "characterArchetypeMirror",
    characterArchetypeQuestionThree: "characterArchetypeMirror",
    characterArchetypeResult: "characterArchetypeMirror",
    recenterNode: "compassDesk",
    loopRecovery: "compassDesk",
    cleanDoor: "compassDesk",
    switchTopics: "guideDesk",
    sharpQuestion: "guideDesk",
    returnFork: "compassDesk",
    restartFork: "compassDesk"
  };

  var TARGET_SKELETON_MAP = {
    intro: "guide",
    askFirst: "guide",
    websitePath: "orientation",
    compassPath: "orientation",
    whereToStart: "orientation",
    siteGuidePath: "orientation",
    proofPath: "truth",
    skepticPlain: "truth",
    lawsPath: "truth",
    scientificLawPath: "truth",
    scientificLawTheoryPath: "truth",
    scientificLawEvidencePath: "truth",
    scientificLawMeasurePath: "truth",
    scientificLawLimitsPath: "truth",
    scientificLawRoutePath: "truth",
    scientificLawLadderPath: "truth",
    scientificLawTermsPath: "truth",
    gaugesPath: "truth",
    frontierPath: "future",
    frontierSystemsPath: "future",
    frontierEnergyPath: "future",
    frontierWaterPath: "future",
    frontierWastePath: "future",
    frontierClosedLoopPath: "future",
    frontierInfrastructurePath: "future",
    frontierLatticePath: "future",
    frontierUrbanPath: "future",
    frontierManualPath: "future",
    frontierShimmerPath: "future",
    frontierTrajectoryPath: "future",
    frontierVisionPath: "future",
    frontierLawPath: "future",
    frontierCharactersPath: "future",
    mirrorlandPath: "window",
    atriumPath: "window",
    atlasPath: "window",
    ziontsPath: "window",
    audraliaPath: "window",
    audraliaWorldroomPath: "window",
    controlCockpitPath: "window",
    mirrorMePath: "window",
    hearthPath: "future",
    hearthFacilityPath: "future",
    hearthConstructPath: "future",
    hearthFrontierPath: "future",
    hearthLawPath: "future",
    charactersPath: "depth",
    characterIdentityPath: "depth",
    characterRelationshipsPath: "depth",
    characterTensionsPath: "depth",
    characterMotivesPath: "depth",
    characterStoryPressurePath: "depth",
    characterFirstPath: "depth",
    characterAurenValePath: "depth",
    characterDextrionPath: "depth",
    characterAlaricPath: "depth",
    characterTarianPath: "depth",
    characterElaraPath: "depth",
    characterSorenPath: "depth",
    characterJeevesPath: "depth",
    characterRemoteTeamPath: "depth",
    characterArchetypeMirrorPath: "innerEntry",
    selfLearningPath: "innerEntry",
    characterArchetypeQuestionOne: "innerEntry",
    characterArchetypeQuestionTwo: "innerEntry",
    characterArchetypeQuestionThree: "innerEntry",
    characterArchetypeResult: "innerEntry",
    seanPath: "source",
    underdogPath: "innerEntry",
    diagnosticPath: "innerEntry",
    futureProfilePath: "innerEntry",
    productsPath: "orientation",
    bookPath: "value",
    nineSummitsPath: "value",
    recenterNode: "orientation",
    loopRecovery: "orientation",
    cleanDoor: "guide",
    switchTopics: "guide",
    sharpQuestion: "guide",
    returnFork: "guide",
    restartFork: "guide"
  };

  var FORBIDDEN_PUBLIC_LANGUAGE = [
    { pattern: /\bscope lane\b/gi, replacement: "path" },
    { pattern: /\bregistry\b/gi, replacement: "guide" },
    { pattern: /\borgan\b/gi, replacement: "part" },
    { pattern: /\broute lane\b/gi, replacement: "path" },
    { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
    { pattern: /\bexpression payload\b/gi, replacement: "answer" },
    { pattern: /\bprogression state\b/gi, replacement: "step" },
    { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
    { pattern: /\bAPI\b/g, replacement: "answer path" },
    { pattern: /\bDOM\b/g, replacement: "visible interface" },
    { pattern: /\bserver[-\s]?side\b/gi, replacement: "deeper house layer" },
    { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
    { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
    { pattern: /\bcontract\b/gi, replacement: "governing mark" },
    { pattern: /\bTNT\b/g, replacement: "" }
  ];

  var SPEECH_LABEL_FALLBACKS = {
    websitePath: "Show me around the estate.",
    skepticPlain: "Explain it plainly.",
    proofPath: "Show me the proof path.",
    diagnosticPath: "Tell me about the Diagnostic.",
    mirrorlandPath: "Enter Mirrorland.",
    atriumPath: "Take me to the Atrium.",
    atlasPath: "Open the Atlas Study.",
    charactersPath: "Meet the Characters.",
    compassPath: "I need the Compass Desk.",
    siteGuidePath: "Show me the Guide Desk.",
    lawsPath: "Open the Law Library.",
    scientificLawPath: "Explain Scientific Law.",
    scientificLawTheoryPath: "Explain Theory.",
    scientificLawEvidencePath: "Explain Evidence.",
    scientificLawMeasurePath: "Explain Measure.",
    scientificLawLimitsPath: "Explain Limits.",
    scientificLawRoutePath: "Show the Scientific Route.",
    scientificLawLadderPath: "Show the claim testing ladder.",
    scientificLawTermsPath: "Explain the deeper terms.",
    gaugesPath: "Explain The Lab.",
    seanPath: "Meet Sean.",
    underdogPath: "Tell me about This Underdog.",
    productsPath: "Show me the Product Gallery.",
    bookPath: "Tell me about the book path.",
    nineSummitsPath: "Tell me about Nine Summits.",
    hearthPath: "Open Hearth.",
    hearthFacilityPath: "Explain Hearth as a facility.",
    hearthConstructPath: "Explain Hearth as a planetary construct engine.",
    hearthFrontierPath: "Connect Hearth to Frontier.",
    hearthLawPath: "Connect Hearth to Scientific Law.",
    ziontsPath: "Tell me about ZIONTS.",
    audraliaPath: "Show me Audralia.",
    audraliaWorldroomPath: "Open the Audralia Worldroom.",
    controlCockpitPath: "Open the Control Cockpit.",
    frontierPath: "Open Frontier.",
    frontierSystemsPath: "Show the Frontier systems.",
    frontierEnergyPath: "Explain Energy.",
    frontierWaterPath: "Explain Water.",
    frontierWastePath: "Explain Waste.",
    frontierClosedLoopPath: "Explain Closed Loop.",
    frontierInfrastructurePath: "Explain Infrastructure.",
    frontierLatticePath: "Explain Lattice.",
    frontierUrbanPath: "Explain Urban.",
    frontierManualPath: "Explain Manual.",
    frontierShimmerPath: "Explain Shimmer.",
    frontierTrajectoryPath: "Explain Trajectory.",
    frontierVisionPath: "Explain Vision.",
    frontierLawPath: "Connect Frontier to Scientific Law.",
    frontierCharactersPath: "Meet the Characters through Frontier.",
    futureProfilePath: "What is Future Profile?",
    mirrorMePath: "What is Mirror Me?",
    characterIdentityPath: "Who are the Characters?",
    characterRelationshipsPath: "Show how the Characters relate.",
    characterTensionsPath: "Show what conflict they carry.",
    characterMotivesPath: "What motivates them?",
    characterStoryPressurePath: "Why should I care about the Characters?",
    characterFirstPath: "Who should I meet first?",
    characterAurenValePath: "Meet Auren Vale.",
    characterDextrionPath: "Meet Dextrion.",
    characterAlaricPath: "Meet Alaric.",
    characterTarianPath: "Meet Tarian.",
    characterElaraPath: "Meet Elara.",
    characterSorenPath: "Meet Soren.",
    characterJeevesPath: "Tell me about Jeeves.",
    characterRemoteTeamPath: "Meet the Remote Team.",
    characterArchetypeMirrorPath: "Which Character Archetype do I follow under pressure?",
    selfLearningPath: "Show my behavior under pressure.",
    characterArchetypeQuestionOne: "Ask the first archetype question.",
    characterArchetypeQuestionTwo: "Ask the second archetype question.",
    characterArchetypeQuestionThree: "Ask the third archetype question.",
    characterArchetypeResult: "Show my Character Archetype.",
    cleanDoor: "Which door fits this best?",
    sharpQuestion: "Ask me a sharper question.",
    switchTopics: "Switch topics.",
    recenterNode: "Re-center me.",
    returnFork: "Show me the clean fork again.",
    restartFork: "Start this over."
  };

  var CHARACTER_REGISTRY = {
    aurenVale: {
      id: "aurenVale",
      name: "Auren Vale",
      shortName: "Auren",
      title: "Sanctuary Builder",
      target: "characterAurenValePath",
      route: "characters",
      oneLine: "Auren Vale protects the manor, but every life he shelters makes the sanctuary harder to hide.",
      pressure: "Every protected life makes the manor harder to hide.",
      mirror: "Protection, custody, shelter, and fear of exposure.",
      estateFunction: "He makes protection personal.",
      relatedRooms: ["characters", "atrium", "audraliaConservatory"],
      frontierConnection: "Infrastructure and sanctuary load.",
      lawConnection: "Protection must not hide hidden cost.",
      hearthConnection: "Hearth gives sanctuary logic a world-condition problem.",
      compositionProfile: "Auren Vale is the Sanctuary Builder. He protects the manor, but every life he shelters makes the sanctuary harder to hide. He matters because protection becomes dangerous when it starts requiring concealment."
    },
    dextrion: {
      id: "dextrion",
      name: "Dextrion",
      shortName: "Dextrion",
      title: "Earth-Side Originator",
      target: "characterDextrionPath",
      route: "characters",
      oneLine: "Dextrion opened the crossing from Earth and carries the burden of everyone who cannot return.",
      pressure: "Every one-way crossing remains on his hands.",
      mirror: "Repair, responsibility, guilt, and pressure to fix what broke.",
      estateFunction: "He makes repair personal.",
      relatedRooms: ["characters", "frontierWorkshopYard", "scientificLaw", "hearth"],
      frontierConnection: "Energy, repair readiness, and system responsibility.",
      lawConnection: "Repair must answer to evidence and downstream consequence.",
      hearthConnection: "Hearth turns repair into world-formation accountability.",
      compositionProfile: "Dextrion is the Earth-Side Originator. He opened the crossing and stayed behind, carrying the burden of every one-way path. He matters because repair is never abstract when people are stranded inside the consequence."
    },
    alaric: {
      id: "alaric",
      name: "Alaric",
      shortName: "Alaric",
      title: "Field Navigator",
      target: "characterAlaricPath",
      route: "characters",
      oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe.",
      pressure: "Waiting for proof can close the only safe route.",
      mirror: "Early warning, danger-reading, orientation, and acting before others believe the proof.",
      estateFunction: "He makes warning personal.",
      relatedRooms: ["characters", "frontierWorkshopYard", "compassDesk"],
      frontierConnection: "Trajectory, drift detection, and early danger.",
      lawConnection: "Warning must eventually meet evidence.",
      hearthConnection: "Hearth gives route-reading planetary consequence.",
      compositionProfile: "Alaric is the Field Navigator. He reads danger before proof arrives, which makes him necessary early and difficult to believe. He matters because a late warning can be perfectly proven and still arrive too late."
    },
    tarian: {
      id: "tarian",
      name: "Tarian",
      shortName: "Tarian",
      title: "Water Anchor",
      target: "characterTarianPath",
      route: "characters",
      oneLine: "Tarian keeps survival physical because no future matters if the body cannot continue.",
      pressure: "The future fails if the body cannot continue.",
      mirror: "Endurance, body-level survival, water, recovery, and carrying too much.",
      estateFunction: "He makes survival personal.",
      relatedRooms: ["characters", "frontierWorkshopYard", "audraliaConservatory"],
      frontierConnection: "Water, continuity, and physical survival.",
      lawConnection: "Endurance must respect limits.",
      hearthConnection: "Hearth gives survival a planetary condition.",
      compositionProfile: "Tarian is the Water Anchor. He keeps survival physical because no future matters if the body cannot continue. He matters because endurance has limits, and a mission that ignores the body eventually fails."
    },
    elara: {
      id: "elara",
      name: "Elara",
      shortName: "Elara",
      title: "Signal Bearer",
      target: "characterElaraPath",
      route: "characters",
      oneLine: "Elara makes the future visible before it disappears, but visibility always risks exposure.",
      pressure: "The future has to be visible before anyone moves toward it.",
      mirror: "Signal, visibility, hope, public voice, and risk of being seen.",
      estateFunction: "She makes vision personal.",
      relatedRooms: ["characters", "frontierWorkshopYard", "mirrorland"],
      frontierConnection: "Shimmer, Vision, and public signal.",
      lawConnection: "Signal must not become false certainty.",
      hearthConnection: "Hearth gives visible future a construct condition.",
      compositionProfile: "Elara is the Signal Bearer. She makes the future visible before it disappears, but visibility always risks exposure. She matters because people cannot move toward a future they cannot see."
    },
    soren: {
      id: "soren",
      name: "Soren",
      shortName: "Soren",
      title: "Boundary Keeper",
      target: "characterSorenPath",
      route: "characters",
      oneLine: "Soren refuses fake restoration because hidden damage only creates another ZIONTS.",
      pressure: "Saving Mirrorland by hiding damage only creates another ZIONTS.",
      mirror: "Truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
      estateFunction: "He makes consequence personal.",
      relatedRooms: ["characters", "lawLibrary", "scientificLaw", "frontierWorkshopYard"],
      frontierConnection: "Waste, Closed Loop, hidden cost, and boundary.",
      lawConnection: "Truth must expose concealed consequence.",
      hearthConnection: "Hearth cannot construct by hiding damage.",
      compositionProfile: "Soren is the Boundary Keeper. He refuses fake restoration because hidden damage only creates another ZIONTS. He matters because truth is not harshness when denial is what caused the wound."
    },
    jeeves: {
      id: "jeeves",
      name: "Jeeves",
      shortName: "Jeeves",
      title: "Manor Interface",
      target: "characterJeevesPath",
      route: "characters",
      oneLine: "Jeeves sequences truth because the wrong amount of truth can send a visitor into the wrong room.",
      pressure: "Too much truth breaks people. Too little sends them into the wrong room.",
      mirror: "Sequence, restraint, truth timing, entry, and controlled revelation.",
      estateFunction: "He makes entry personal.",
      relatedRooms: ["jeevesInterface", "compassDesk", "guideDesk", "characters"],
      frontierConnection: "Manual, sequence, and safe operation.",
      lawConnection: "Truth timing must not manipulate the visitor.",
      hearthConnection: "Hearth requires guided entry because construct logic can overwhelm.",
      compositionProfile: "Jeeves is the Manor Interface. He sequences truth because the wrong amount of truth can send a visitor into the wrong room. He matters because guidance is not control; it is timing, restraint, and a clean next door."
    },
    remoteTeam: {
      id: "remoteTeam",
      name: "Remote Team",
      shortName: "Remote Team",
      title: "Distributed Response Unit",
      target: "characterRemoteTeamPath",
      route: "characters",
      oneLine: "The Remote Team carries survival beyond the manor, where protection has to become distributable.",
      pressure: "If survival cannot leave the manor, the manor is only a bunker.",
      mirror: "Distributed responsibility, field logistics, helping beyond the safe center, and public survival.",
      estateFunction: "They make distribution personal.",
      relatedRooms: ["characters", "frontierWorkshopYard", "audraliaConservatory"],
      frontierConnection: "Urban, infrastructure, field distribution, and public survival.",
      lawConnection: "Distribution must survive reality, not only intention.",
      hearthConnection: "Hearth gives distribution a world-scale test.",
      compositionProfile: "The Remote Team is the Distributed Response Unit. They carry survival beyond the manor, where protection has to become distributable. They matter because a future that cannot leave the safe center is only a bunker."
    }
  };

  var LOCAL_ARCHETYPE_KEYWORDS = [
    { id: "aurenVale", words: ["protect", "shelter", "safe", "hide", "custody", "exposure", "overprotect"] },
    { id: "dextrion", words: ["fix", "repair", "responsible", "guilt", "broken", "system", "fast"] },
    { id: "alaric", words: ["danger", "warning", "route", "early", "before proof", "not believed"] },
    { id: "tarian", words: ["tired", "body", "carry", "water", "survive", "endure", "sustain"] },
    { id: "elara", words: ["hope", "visible", "signal", "voice", "seen", "future"] },
    { id: "soren", words: ["truth", "evidence", "hidden cost", "contradiction", "boundary", "denial"] },
    { id: "jeeves", words: ["sequence", "timing", "truth", "door", "entry", "reveal", "manage"] },
    { id: "remoteTeam", words: ["team", "community", "field", "distributed", "public", "beyond"] }
  ];

  var SCIENTIFIC_LAW = {
    core: "A claim does not become scientific because it sounds technical. It becomes scientific when it can be defined, tested, corrected, limited, and checked again.",
    summary: "Scientific Law is the Reality Test chamber inside the Law Library. It separates what sounds convincing from what keeps working after observation, evidence, measurement, comparison, correction, uncertainty, and limits.",
    doors: {
      theory: "Theory is the explanation that risks being wrong.",
      evidence: "Evidence is the checkable record that survives preference.",
      measure: "Measure is the coordinate system attached to a claim.",
      limits: "Limits are the boundary that protects truth from overclaiming."
    },
    ladder: "Impression → Observation → Evidence → Measurement → Repeatability → Model → Limitation → Scientific Claim."
  };

  var FRONTIER_SYSTEMS = {
    energy: {
      target: "frontierEnergyPath",
      route: "frontierEnergy",
      name: "Energy",
      status: "Fusion readiness",
      character: "Dextrion",
      text: "Energy starts with power readiness: storage, load protection, facility inputs, losses, and fusion readiness without pretending the final breakthrough is already solved."
    },
    water: {
      target: "frontierWaterPath",
      route: "frontierWater",
      name: "Water",
      status: "Closed water systems",
      character: "Tarian",
      text: "Water asks how water keeps moving without being wasted: capture, cleaning, routing, reuse, continuity, quality checks, and failure detection."
    },
    waste: {
      target: "frontierWastePath",
      route: "frontierWaste",
      name: "Waste",
      status: "Wastewater systems",
      character: "Soren",
      text: "Waste begins where discarded material becomes a design test: sanitation, recovery, contaminant control, treatment, reuse classification, and return-material accounting."
    },
    closedLoop: {
      target: "frontierClosedLoopPath",
      route: "frontierClosedLoop",
      name: "Closed Loop",
      status: "Answer-back systems",
      character: "Soren",
      text: "Closed Loop asks whether a system can answer back: detect pressure, register failure, correct course, and prove the correction returned somewhere useful."
    },
    infrastructure: {
      target: "frontierInfrastructurePath",
      route: "frontierInfrastructure",
      name: "Infrastructure",
      status: "Support load",
      character: "Auren Vale",
      text: "Infrastructure tests whether the world can carry weight: roads, supports, utilities, corridors, redundancy, and load-bearing civic structure."
    },
    lattice: {
      target: "frontierLatticePath",
      route: "frontierLattice",
      name: "Lattice",
      status: "Ordered growth",
      character: "Jeeves",
      text: "Lattice asks whether growth has order. Placement, count, relationship, and pattern keep a world from expanding randomly into noise."
    },
    urban: {
      target: "frontierUrbanPath",
      route: "frontierUrban",
      name: "Urban",
      status: "Civic pressure",
      character: "Remote Team",
      text: "Urban tests settlement pressure: corridors, density, shelter, public systems, movement, and built-world consequence."
    },
    manual: {
      target: "frontierManualPath",
      route: "frontierManual",
      name: "Manual",
      status: "Operating path",
      character: "Jeeves",
      text: "Manual turns the playground into instructions, handling rules, readable next steps, safety notes, and operating boundaries."
    },
    shimmer: {
      target: "frontierShimmerPath",
      route: "frontierShimmer",
      name: "Shimmer",
      status: "Visible signal",
      character: "Elara",
      text: "Shimmer makes change visible. A glint, warning, pulse, or surface shift tells the visitor that pressure is moving before the full system explains itself."
    },
    trajectory: {
      target: "frontierTrajectoryPath",
      route: "frontierTrajectory",
      name: "Trajectory",
      status: "Direction and timing",
      character: "Alaric",
      text: "Trajectory asks where the future is moving: direction, timing, path, drift detection, course correction, and outcome tracking."
    },
    vision: {
      target: "frontierVisionPath",
      route: "frontierVision",
      name: "Vision",
      status: "Horizon aim",
      character: "Elara",
      text: "Vision keeps the horizon in view. It asks what kind of future the world is trying to reach before systems harden into habits."
    }
  };

  var state = {
    contract: CONTRACT,
    route: ROUTE,
    initialized: false,
    busy: false,
    runToken: 0,

    currentNode: "intro",
    previousNode: null,
    currentTopic: "arrival",
    currentPosture: "arrival",
    currentPhase: "receive",
    currentScopeLane: SCOPE_OBJECTIVE,
    currentVoiceMode: MODE_OBJECTIVE,
    currentDepth: 0,
    currentRouteHandoffs: [],
    currentRoomId: "jeevesInterface",
    currentSkeletonKey: "guide",
    currentWhoFocus: "",
    currentValueAxiom: "",
    currentPracticalNeed: "orientation",
    stateIndex: 0,

    visitor: {
      lastChoiceLabel: "",
      lastSignal: "",
      lastItch: "",
      lastTopic: "",
      lastScopeLane: SCOPE_OBJECTIVE,
      routeReadiness: 0,
      loopCount: 0,
      digressionCount: 0,
      progressCount: 0,
      needsRecenter: false,
      trail: [],
      cartographyTrail: [],
      characterArchetypeAnswers: [],
      characterProfileViews: [],
      characterRelationshipViews: 0,
      characterCompletionReadiness: 0,
      characterCompletionPromptShown: false,
      lastCharacterViewed: "",
      lastBrainIntent: "",
      lastBrainCanonStatus: "",
      lastBrainConclusiveState: ""
    },

    tapAdvance: {
      bound: false,
      active: false,
      resolver: null,
      timer: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      startTime: 0,
      phase: ""
    },

    brain: {
      endpoint: DEFAULT_BRAIN_ENDPOINT,
      enabled: true,
      lastRequest: null,
      lastResponse: null,
      lastStatus: "ready",
      timeoutMs: 9000
    },

    history: []
  };

  var els = {};
  var config = {};

  function say(label, target, meta) {
    var item = {
      label: label,
      target: target,
      type: "conversation"
    };
    var key;

    if (meta) {
      for (key in meta) {
        if (Object.prototype.hasOwnProperty.call(meta, key)) {
          item[key] = meta[key];
        }
      }
    }

    return item;
  }

  function control(label, target, meta) {
    var item = say(label, target, meta);
    item.type = "control";
    return item;
  }

  function back(label, target, meta) {
    var item = say(label, target, meta);
    item.type = "back";
    return item;
  }

  function query(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeClone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function wordCount(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function indexOfValue(list, value) {
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i] === value) return i;
    }
    return 0;
  }

  function computeStateIndex(posture, phase) {
    return indexOfValue(POSTURES, posture) * 16 + indexOfValue(PHASES, phase);
  }

  function getTypingDelay(text, index) {
    var delay = PACING.typingBaseMs + wordCount(text) * PACING.typingWordMs;
    if (index === 0) delay += 160;
    return clamp(delay, PACING.typingMinMs, PACING.typingMaxMs);
  }

  function getReadDelay(text) {
    return clamp(
      PACING.readBaseMs + wordCount(text) * PACING.readWordMs,
      PACING.readMinMs,
      PACING.readMaxMs
    );
  }

  function isNarrativeTarget(target) {
    return NARRATIVE_TARGETS.indexOf(String(target || "")) !== -1;
  }

  function getRoom(roomId) {
    return SITE_CARTOGRAPHY[roomId] || null;
  }

  function getSkeleton(key) {
    return HOUSE_SKELETON[key] || null;
  }

  function getRoomForTarget(target) {
    return getRoom(TARGET_ROOM_MAP[String(target || "")] || "compassDesk");
  }

  function getSkeletonForTarget(target) {
    return getSkeleton(TARGET_SKELETON_MAP[String(target || "")] || "guide");
  }

  function composeValueAxiom(topic) {
    if (topic === "book" || topic === "nineSummits" || topic === "sean" || topic === "underdog") {
      return SEAN_VALUE_AXIOMS.liveLoveLaughListen.phrase;
    }

    if (topic === "diagnostic" || topic === "characterArchetype") {
      return SEAN_VALUE_AXIOMS.expectationLimitation.phrase;
    }

    if (topic === "scientificLaw" || topic === "proof") {
      return SEAN_VALUE_AXIOMS.manipulationMindOwnership.phrase;
    }

    return "";
  }

  function resolveCartographyFromTarget(target) {
    var room = getRoomForTarget(target);
    var skeleton = getSkeletonForTarget(target);

    return {
      roomId: room ? room.roomId : "",
      roomName: room ? room.publicName : "",
      skeletonKey: skeleton ? skeleton.key : "",
      skeletonPhrase: skeleton ? skeleton.governingPhrase : "",
      practicalAction: room ? room.practicalAction : "",
      visitorPressure: room ? room.visitorPressure : "",
      who: room ? room.whoIsConnected.slice() : []
    };
  }

  function isHearthContext() {
    var text = [
      state.currentNode,
      state.currentTopic,
      state.currentPosture,
      state.currentRoomId,
      state.visitor.lastChoiceLabel
    ].join(" ").toLowerCase();

    return text.indexOf("hearth") !== -1 || text.indexOf("construct") !== -1;
  }

  function sanitizePublicText(text) {
    var clean = String(text || "");

    FORBIDDEN_PUBLIC_LANGUAGE.forEach(function eachRule(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (!isHearthContext()) {
      clean = clean.replace(/\bconstruct\b/gi, "work");
      clean = clean.replace(/\bengine\b/gi, "system");
    }

    clean = clean.replace(/\bworld side\b/gi, "Mirrorland");
    clean = clean.replace(/\bthe world side\b/gi, "Mirrorland");
    clean = clean.replace(/\bChoose the world\b/gi, "Enter Mirrorland");
    clean = clean.replace(/\s{2,}/g, " ");

    return clean.trim();
  }

  function sanitizeConversationLabel(label, target) {
    var clean = String(label || "").trim();
    var actionStart = /^(open|visit|enter|explore|return to|go to|launch|take the|read the)\b/i;

    if (actionStart.test(clean) && SPEECH_LABEL_FALLBACKS[target]) {
      return SPEECH_LABEL_FALLBACKS[target];
    }

    return sanitizePublicText(clean);
  }

  function readConfig() {
    var script = query("#jeevesConversationConfig");

    if (!script) {
      return {
        initialNode: "intro",
        routes: {}
      };
    }

    try {
      return JSON.parse(script.textContent || "{}");
    } catch (_error) {
      return {
        initialNode: "intro",
        routes: {}
      };
    }
  }

  function mergeRoutes() {
    var routes = {};
    var key;

    for (key in DEFAULT_ROUTES) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_ROUTES, key)) {
        routes[key] = DEFAULT_ROUTES[key];
      }
    }

    if (config.routes) {
      for (key in config.routes) {
        if (Object.prototype.hasOwnProperty.call(config.routes, key)) {
          routes[key] = config.routes[key];
        }
      }
    }

    return routes;
  }

  function getRouteLabel(id) {
    return ROUTE_LABELS[id] || "Open Path";
  }

  function getHandoff(id) {
    var routes = mergeRoutes();

    return {
      id: id,
      label: getRouteLabel(id),
      href: routes[id] || "#"
    };
  }

  function normalizeNode(id) {
    if (!id || id === "arrival") return "intro";
    if (id === "worldPath" || id === "worldGatePath") return "mirrorlandPath";
    if (id === "characterMirrorPath") return "characterArchetypeMirrorPath";
    if (id === "characterMirrorQuestionOne") return "characterArchetypeQuestionOne";
    if (id === "characterMirrorQuestionTwo") return "characterArchetypeQuestionTwo";
    if (id === "characterMirrorQuestionThree") return "characterArchetypeQuestionThree";
    if (id === "characterMirrorResult") return "characterArchetypeResult";
    return String(id);
  }

  function normalizeTarget(target) {
    var value = normalizeNode(String(target || "").trim());
    if (APPROVED_TARGETS.indexOf(value) === -1) return "recenterNode";
    return value;
  }

  function normalizeRouteId(id) {
    var value = String(id || "").trim();
    if (APPROVED_ROUTE_IDS.indexOf(value) === -1) return "";
    return value;
  }

  function resetState() {
    state.currentNode = "intro";
    state.previousNode = null;
    state.currentTopic = "arrival";
    state.currentPosture = "arrival";
    state.currentPhase = "receive";
    state.currentScopeLane = SCOPE_OBJECTIVE;
    state.currentVoiceMode = MODE_OBJECTIVE;
    state.currentDepth = 0;
    state.currentRouteHandoffs = [];
    state.currentRoomId = "jeevesInterface";
    state.currentSkeletonKey = "guide";
    state.currentWhoFocus = "";
    state.currentValueAxiom = "";
    state.currentPracticalNeed = "orientation";

    state.visitor.lastChoiceLabel = "";
    state.visitor.lastSignal = "";
    state.visitor.lastItch = "";
    state.visitor.lastTopic = "";
    state.visitor.lastScopeLane = SCOPE_OBJECTIVE;
    state.visitor.routeReadiness = 0;
    state.visitor.loopCount = 0;
    state.visitor.digressionCount = 0;
    state.visitor.progressCount = 0;
    state.visitor.needsRecenter = false;
    state.visitor.trail = [];
    state.visitor.cartographyTrail = [];
    state.visitor.characterArchetypeAnswers = [];
    state.visitor.characterProfileViews = [];
    state.visitor.characterRelationshipViews = 0;
    state.visitor.characterCompletionReadiness = 0;
    state.visitor.characterCompletionPromptShown = false;
    state.visitor.lastCharacterViewed = "";
    state.visitor.lastBrainIntent = "";
    state.visitor.lastBrainCanonStatus = "";
    state.visitor.lastBrainConclusiveState = "";
  }

  function inferItchFromChoice(choice, topic) {
    if (!choice) return state.visitor.lastItch || "choosing the next door";
    if (choice.signal === "skeptic") return "testing whether the estate deserves trust";
    if (choice.signal === "self") return "looking for a mirror";
    if (choice.signal === "mirrorland") return "trying to enter Mirrorland";
    if (choice.signal === "practical") return "looking for something usable";
    if (choice.signal === "lost") return "trying to get re-centered";
    if (choice.signal === "archetype") return "trying to understand behavior under pressure";
    if (choice.signal === "source") return "trying to find the human source behind the estate";
    if (choice.signal === "value") return "trying to understand the values underneath the journey";
    if (topic === "characterArchetype") return "trying to understand behavior under pressure";
    if (topic === "characters" || topic.indexOf("character") === 0) return "trying to understand who the Characters are";
    if (topic === "scientificLaw") return "trying to test a claim before trusting it";
    if (topic === "frontier") return "trying to understand how future systems are tested";
    if (topic === "hearth") return "trying to understand where world-formation becomes operational";
    if (topic === "underdog") return "trying to understand the underdog voice in the visitor";
    if (topic === "book" || topic === "nineSummits") return "trying to understand the larger development path";
    if (topic === "sean") return "trying to understand who built this and why";
    return "choosing the next door";
  }

  function targetToCharacter(target) {
    var map = {
      characterAurenValePath: "aurenVale",
      characterDextrionPath: "dextrion",
      characterAlaricPath: "alaric",
      characterTarianPath: "tarian",
      characterElaraPath: "elara",
      characterSorenPath: "soren",
      characterJeevesPath: "jeeves",
      characterRemoteTeamPath: "remoteTeam"
    };

    return map[target] || "";
  }

  function updateArchetypeAnswers(choice, sourceNode) {
    var fromNode = sourceNode || state.previousNode || state.currentNode;

    if (!choice || !choice.label) return;

    if (
      fromNode === "characterArchetypeQuestionOne" ||
      fromNode === "characterArchetypeQuestionTwo" ||
      fromNode === "characterArchetypeQuestionThree"
    ) {
      state.visitor.characterArchetypeAnswers.push(choice.label);

      while (state.visitor.characterArchetypeAnswers.length > 8) {
        state.visitor.characterArchetypeAnswers.shift();
      }
    }
  }

  function uniquePush(list, value) {
    if (!value) return;
    if (list.indexOf(value) === -1) list.push(value);
  }

  function updateCharacterSocialCues(node) {
    var characterId = targetToCharacter(node.node);

    if (characterId) {
      uniquePush(state.visitor.characterProfileViews, characterId);
      state.visitor.lastCharacterViewed = characterId;
    }

    if (
      node.node === "characterRelationshipsPath" ||
      node.node === "characterTensionsPath" ||
      node.node === "characterMotivesPath" ||
      node.node === "characterStoryPressurePath"
    ) {
      state.visitor.characterRelationshipViews += 1;
    }

    state.visitor.characterCompletionReadiness =
      state.visitor.characterProfileViews.length +
      state.visitor.characterRelationshipViews +
      (state.currentTopic === "characters" && state.visitor.loopCount > 1 ? 1 : 0);
  }

  function isCharacterCompletionReady() {
    return state.visitor.characterCompletionReadiness >= 3 || state.visitor.characterProfileViews.length >= 3;
  }

  function updateVisitor(choice, node, sourceNode) {
    var topic = node.topic || "arrival";
    var sameTopic = state.visitor.lastTopic === topic;
    var scopeChanged = state.visitor.lastScopeLane !== node.scopeLane;
    var cartography = resolveCartographyFromTarget(node.node || state.currentNode);

    updateArchetypeAnswers(choice, sourceNode);

    if (sameTopic) {
      state.visitor.progressCount += 1;
      if (node.depth >= 3) state.visitor.routeReadiness += 1;
    } else if (state.visitor.lastTopic) {
      state.visitor.digressionCount += 1;
    }

    if (scopeChanged && state.visitor.lastTopic) {
      state.visitor.digressionCount += 1;
    }

    if (sameTopic && node.depth >= 2) {
      state.visitor.loopCount += 1;
    }

    state.visitor.lastChoiceLabel = choice && choice.label ? choice.label : state.visitor.lastChoiceLabel;
    state.visitor.lastSignal = choice && choice.signal ? choice.signal : "";
    state.visitor.lastItch = inferItchFromChoice(choice, topic);
    state.visitor.lastTopic = topic;
    state.visitor.lastScopeLane = node.scopeLane;

    state.visitor.trail.push({
      node: state.currentNode,
      topic: topic,
      depth: node.depth,
      scopeLane: node.scopeLane,
      label: state.visitor.lastChoiceLabel
    });

    state.visitor.cartographyTrail.push({
      node: state.currentNode,
      roomId: cartography.roomId,
      roomName: cartography.roomName,
      skeletonKey: cartography.skeletonKey,
      pressure: cartography.visitorPressure
    });

    while (state.visitor.trail.length > 16) {
      state.visitor.trail.shift();
    }

    while (state.visitor.cartographyTrail.length > 16) {
      state.visitor.cartographyTrail.shift();
    }

    updateCharacterSocialCues(node);

    if (state.visitor.digressionCount >= 4 || state.visitor.loopCount >= 4) {
      state.visitor.needsRecenter = true;
    }
  }

  function getState256() {
    return {
      posture: state.currentPosture,
      phase: state.currentPhase,
      index: state.stateIndex,
      label: "ST-" + String(state.stateIndex + 1).padStart(3, "0") + "-OF-256"
    };
  }

  function setDocumentState() {
    var state256 = getState256();

    document.documentElement.dataset.jeevesEngineContract = CONTRACT;
    document.documentElement.dataset.jeevesRuntimeReady = "true";
    document.documentElement.dataset.jeevesPairedBrain = "true";
    document.documentElement.dataset.jeevesBackBrainEndpoint = state.brain.endpoint;
    document.documentElement.dataset.jeevesState = state256.label;
    document.documentElement.dataset.jeevesPosture = state.currentPosture;
    document.documentElement.dataset.jeevesPhase = state.currentPhase;
    document.documentElement.dataset.jeevesTopic = state.currentTopic;
    document.documentElement.dataset.jeevesScopeLane = state.currentScopeLane;
    document.documentElement.dataset.jeevesVoiceMode = state.currentVoiceMode;
    document.documentElement.dataset.jeevesRoomId = state.currentRoomId;
    document.documentElement.dataset.jeevesSkeleton = state.currentSkeletonKey;
    document.documentElement.dataset.jeevesCharacterArchetype = "active";
    document.documentElement.dataset.jeevesFinalRouteAuthority = "front-end";

    if (els.status) {
      els.status.setAttribute("data-jeeves-state", state256.label);
    }
  }

  function collectElements() {
    els.thread = query("#jeevesThread");
    els.typing = query("[data-jeeves-typing]");
    els.promptGrid =
      query("[data-jeeves-prompt-grid]") ||
      query("[data-jeeves-options-grid]") ||
      query(".jeeves-prompt-grid") ||
      query(".jeeves-options-grid");

    els.promptDock =
      query("[data-jeeves-prompt-dock]") ||
      query("[data-jeeves-options-dock]") ||
      query("[data-jeeves-prompt-panel]") ||
      query("[data-jeeves-response-panel]") ||
      query(".jeeves-prompt-dock") ||
      query(".jeeves-options-dock") ||
      query(".jeeves-prompt-panel") ||
      query(".jeeves-response-panel") ||
      (els.promptGrid ? els.promptGrid.closest("[data-jeeves-prompt-dock],[data-jeeves-options-dock],[data-jeeves-prompt-panel],[data-jeeves-response-panel],.jeeves-prompt-dock,.jeeves-options-dock,.jeeves-prompt-panel,.jeeves-response-panel") : null) ||
      (els.promptGrid ? els.promptGrid.parentElement : null);

    els.handoffDock = query("[data-jeeves-handoff-dock]");
    els.handoffGrid = query("[data-jeeves-handoff-grid]");
    els.status = query("[data-jeeves-status]");
    els.statusText = query("[data-jeeves-status-text]");
    els.messageTemplate = query("#jeevesMessageTemplate");
    els.optionTemplate = query("#jeevesOptionTemplate");
    els.routeOptionTemplate = query("#jeevesRouteOptionTemplate");
    els.restoreButton = query("[data-jeeves-action='restore']");
    els.minimized = query("[data-jeeves-minimized]");

    ensurePromptDock();
  }

  function ensurePromptDock() {
    var parent;
    var title;

    if (els.promptGrid) {
      if (!els.promptDock) {
        els.promptDock = els.promptGrid.parentElement;
      }
      return;
    }

    if (!els.thread || !els.thread.parentElement) return;

    parent = els.thread.parentElement;

    els.promptDock = document.createElement("section");
    els.promptDock.className = "jeeves-prompt-dock";
    els.promptDock.setAttribute("data-jeeves-prompt-dock", "");
    els.promptDock.setAttribute("data-jeeves-generated-prompt-dock", "true");
    els.promptDock.setAttribute("data-prompt-visible", "false");
    els.promptDock.setAttribute("data-options-visible", "false");
    els.promptDock.setAttribute("aria-hidden", "true");
    els.promptDock.hidden = true;

    title = document.createElement("p");
    title.className = "jeeves-prompt-title";
    title.textContent = "Choose what to say";
    title.setAttribute("data-jeeves-prompt-title", "");

    els.promptGrid = document.createElement("div");
    els.promptGrid.className = "jeeves-prompt-grid";
    els.promptGrid.setAttribute("data-jeeves-prompt-grid", "");
    els.promptGrid.setAttribute("data-options-visible", "false");
    els.promptGrid.setAttribute("aria-hidden", "true");
    els.promptGrid.hidden = true;

    els.promptDock.appendChild(title);
    els.promptDock.appendChild(els.promptGrid);

    if (els.thread.nextSibling) {
      parent.insertBefore(els.promptDock, els.thread.nextSibling);
    } else {
      parent.appendChild(els.promptDock);
    }
  }

  function revealElement(element) {
    if (!element) return;

    element.hidden = false;
    element.removeAttribute("hidden");
    element.removeAttribute("inert");
    element.removeAttribute("aria-disabled");

    if (element.style) {
      element.style.removeProperty("display");
      element.style.removeProperty("visibility");
      element.style.removeProperty("opacity");
      element.style.removeProperty("pointer-events");
      element.style.removeProperty("height");
      element.style.removeProperty("max-height");
    }
  }

  function concealElement(element) {
    if (!element) return;

    element.hidden = true;
    element.setAttribute("aria-hidden", "true");

    if (element.style) {
      element.style.display = "none";
    }
  }

  function setPromptVisible(isVisible) {
    document.documentElement.dataset.jeevesOptionsVisible = isVisible ? "true" : "false";
    document.documentElement.dataset.jeevesPromptVisible = isVisible ? "true" : "false";

    if (isVisible) {
      revealElement(els.promptDock);
      revealElement(els.promptGrid);
    } else {
      concealElement(els.promptDock);
      concealElement(els.promptGrid);
    }

    if (els.promptDock) {
      els.promptDock.setAttribute("aria-hidden", isVisible ? "false" : "true");
      els.promptDock.setAttribute("data-prompt-visible", isVisible ? "true" : "false");
      els.promptDock.setAttribute("data-options-visible", isVisible ? "true" : "false");
      els.promptDock.setAttribute("data-jeeves-options-visible", isVisible ? "true" : "false");
    }

    if (els.promptGrid) {
      els.promptGrid.setAttribute("aria-hidden", isVisible ? "false" : "true");
      els.promptGrid.setAttribute("data-options-visible", isVisible ? "true" : "false");
      els.promptGrid.setAttribute("data-jeeves-options-visible", isVisible ? "true" : "false");
    }
  }

  function setStatus(value, text) {
    if (els.status) els.status.setAttribute("data-jeeves-status", value);
    if (els.statusText) els.statusText.textContent = text || "";
  }

  function setTyping(isTyping) {
    if (!els.typing) return;

    els.typing.setAttribute("data-jeeves-typing", isTyping ? "true" : "false");
    els.typing.setAttribute("aria-hidden", isTyping ? "false" : "true");

    setStatus(
      isTyping ? "thinking" : "listening",
      isTyping ? "Jeeves is typing" : "House listening"
    );
  }

  function clearSeedMessage() {
    var seed;

    if (!els.thread) return;

    seed = query("[data-seed-message='true']", els.thread);
    if (seed) seed.remove();
  }

  function clearElement(element) {
    if (!element) return;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function hideOptions() {
    clearElement(els.promptGrid);
    clearElement(els.handoffGrid);
    setPromptVisible(false);

    if (els.handoffDock) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
    }
  }

  function scrollThread() {
    if (!els.thread) return;

    try {
      els.thread.scrollTop = els.thread.scrollHeight;
    } catch (_error) {
      /* Non-critical. */
    }
  }

  function cloneTemplate(template, fallbackTag) {
    if (template && template.content && template.content.firstElementChild) {
      return template.content.firstElementChild.cloneNode(true);
    }

    return document.createElement(fallbackTag || "div");
  }

  function addMessage(origin, text, settings) {
    var message;
    var name;
    var paragraph;
    var cleanText = origin === "jeeves" ? sanitizePublicText(text) : String(text || "");

    if (!els.thread || !cleanText) return null;

    message = cloneTemplate(els.messageTemplate, "article");
    name = query(".jeeves-message-name", message);
    paragraph = query("p", message);

    message.classList.add("jeeves-message");
    message.setAttribute("data-message-origin", origin);

    if (settings && settings.emphasis) {
      message.setAttribute("data-message-emphasis", "true");
    }

    if (settings && settings.source) {
      message.setAttribute("data-message-source", settings.source);
    }

    if (name) {
      if (origin === "visitor") {
        name.textContent = "Visitor";
      } else if (origin === "system") {
        name.textContent = "House";
      } else {
        name.textContent = "Jeeves";
      }
    }

    if (paragraph) {
      paragraph.textContent = cleanText;
    } else {
      message.textContent = cleanText;
    }

    els.thread.appendChild(message);
    scrollThread();

    return message;
  }

  function normalizeButtonElement(element) {
    var button = element;
    var replacement;

    if (!button || button.nodeType !== 1) {
      button = document.createElement("button");
    }

    if (button.tagName && button.tagName.toLowerCase() !== "button") {
      replacement = document.createElement("button");
      replacement.className = button.className || "";
      while (button.firstChild) {
        replacement.appendChild(button.firstChild);
      }
      button = replacement;
    }

    return button;
  }

  function makeOptionButton(item) {
    var button = normalizeButtonElement(cloneTemplate(els.optionTemplate, "button"));
    var label = query("span", button);
    var target = normalizeTarget(item.target);
    var cleanLabel = sanitizeConversationLabel(item.label, target);
    var scopeLane = item.scopeLane || (isNarrativeTarget(target) ? SCOPE_NARRATIVE : SCOPE_OBJECTIVE);
    var cartography = resolveCartographyFromTarget(target);

    button.classList.add("jeeves-option");
    button.setAttribute("type", "button");
    button.setAttribute("data-option-type", item.type || "conversation");
    button.setAttribute("data-option-target", target || "");
    button.setAttribute("data-option-scope-lane", scopeLane);
    button.setAttribute("data-option-room-id", cartography.roomId || "");
    button.setAttribute("data-option-skeleton", cartography.skeletonKey || "");

    if (label) {
      label.textContent = cleanLabel;
    } else {
      button.textContent = cleanLabel;
    }

    button.addEventListener("click", function onOptionClick() {
      handleOption({
        label: cleanLabel,
        target: target,
        type: item.type || "conversation",
        signal: item.signal || "",
        scopeLane: scopeLane
      });
    });

    return button;
  }

  function makeRouteLink(item) {
    var link = cloneTemplate(els.routeOptionTemplate, "a");
    var label;

    if (!link || !link.tagName || link.tagName.toLowerCase() !== "a") {
      link = document.createElement("a");
    }

    label = query("span", link);

    link.classList.add("jeeves-option");
    link.classList.add("jeeves-option-route");
    link.setAttribute("href", item.href || "#");
    link.setAttribute("data-option-type", "route");
    link.setAttribute("data-option-target", item.id || "");

    if (label) {
      label.textContent = item.label;
    } else {
      link.textContent = item.label;
    }

    return link;
  }

  function ensureGeneratedPromptTitle() {
    var title;

    if (!els.promptDock || !els.promptGrid) return;
    if (els.promptDock.getAttribute("data-jeeves-generated-prompt-dock") !== "true") return;

    title =
      query("[data-jeeves-prompt-title]", els.promptDock) ||
      query(".jeeves-prompt-title", els.promptDock);

    if (title) return;

    title = document.createElement("p");
    title.className = "jeeves-prompt-title";
    title.textContent = "Choose what to say";
    title.setAttribute("data-jeeves-prompt-title", "");

    els.promptDock.insertBefore(title, els.promptGrid);
  }

  function renderOptions(options) {
    var clean = dedupeOptions(options || []).filter(function filterOption(item) {
      return item && item.label && item.target;
    });

    if (!clean.length) {
      clean = [
        control("Ask me a sharper question.", "sharpQuestion"),
        control("Switch topics.", "switchTopics"),
        control("Re-center me.", "recenterNode"),
        control("Choose the next door.", "cleanDoor")
      ];
    }

    ensurePromptDock();
    clearElement(els.promptGrid);

    if (!els.promptGrid) return;

    ensureGeneratedPromptTitle();

    clean.slice(0, 8).forEach(function eachOption(item) {
      els.promptGrid.appendChild(makeOptionButton(item));
    });

    if (els.promptGrid.children.length > 0) {
      setPromptVisible(true);
    } else {
      setPromptVisible(false);
    }
  }

  function renderHandoffs(ids) {
    var handoffs = [];

    clearElement(els.handoffGrid);

    (ids || []).forEach(function eachId(id) {
      var routeId = typeof id === "string" ? normalizeRouteId(id) : normalizeRouteId(id.id);
      var item = routeId ? getHandoff(routeId) : null;

      if (item && item.href && item.href !== "#") {
        handoffs.push(item);
      }
    });

    if (!els.handoffDock || !els.handoffGrid) return;

    if (!handoffs.length) {
      els.handoffDock.setAttribute("data-handoff-visible", "false");
      return;
    }

    revealElement(els.handoffDock);
    revealElement(els.handoffGrid);
    els.handoffDock.setAttribute("data-handoff-visible", "true");

    handoffs.slice(0, 6).forEach(function eachHandoff(item) {
      els.handoffGrid.appendChild(makeRouteLink(item));
    });
  }

  function dedupeOptions(options) {
    var seen = {};
    var clean = [];

    (options || []).forEach(function eachOption(item) {
      var key;

      if (!item || !item.label || !item.target) return;

      key = item.label + "::" + item.target;
      if (seen[key]) return;

      seen[key] = true;
      clean.push(item);
    });

    return clean;
  }

  function clearTapAdvance() {
    if (state.tapAdvance.timer) {
      window.clearTimeout(state.tapAdvance.timer);
    }

    state.tapAdvance.active = false;
    state.tapAdvance.resolver = null;
    state.tapAdvance.timer = null;
    state.tapAdvance.phase = "";
  }

  function requestTapAdvance() {
    var resolver = state.tapAdvance.resolver;

    if (!state.tapAdvance.active || typeof resolver !== "function") return;

    clearTapAdvance();
    resolver("tap");
  }

  function waitSkippable(ms, phase) {
    return new Promise(function waitSkippablePromise(resolve) {
      if (!ms || ms <= 0) {
        resolve("instant");
        return;
      }

      clearTapAdvance();

      state.tapAdvance.active = true;
      state.tapAdvance.phase = phase || "wait";
      state.tapAdvance.resolver = resolve;
      state.tapAdvance.timer = window.setTimeout(function finishTimer() {
        clearTapAdvance();
        resolve("timer");
      }, ms);
    });
  }

  function waitFixed(ms) {
    return new Promise(function waitFixedPromise(resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function playBeats(beats, token, source) {
    var i;
    var beat;

    for (i = 0; i < beats.length; i += 1) {
      if (token !== state.runToken) return false;

      beat = beats[i];

      setTyping(true);
      await waitSkippable(getTypingDelay(beat, i), "typing");

      if (token !== state.runToken) return false;

      setTyping(false);

      addMessage("jeeves", beat, {
        emphasis: i === 0 && (
          state.currentPosture === "arrival" ||
          state.currentPosture === "skeptic" ||
          state.currentPosture === "characters" ||
          state.currentPosture === "diagnostic" ||
          state.currentPosture === "sean"
        ),
        source: source || "local"
      });

      await waitSkippable(getReadDelay(beat), "reading");
    }

    if (token !== state.runToken) return false;

    await waitSkippable(PACING.optionRevealDelayMs, "options");

    return token === state.runToken;
  }

  function makeNode(node, topic, posture, phase, scopeLane, voiceMode, depth, beats, options, handoffs, meta) {
    var roomId = meta && meta.roomId ? meta.roomId : (TARGET_ROOM_MAP[node] || "compassDesk");
    var skeletonKey = meta && meta.skeletonKey ? meta.skeletonKey : (TARGET_SKELETON_MAP[node] || "guide");
    var valueAxiom = meta && meta.valueAxiom ? meta.valueAxiom : composeValueAxiom(topic || "");
    var room = getRoom(roomId);
    var skeleton = getSkeleton(skeletonKey);

    return {
      node: node,
      topic: topic || node,
      posture: posture || "orientation",
      phase: phase || "ground",
      scopeLane: scopeLane || SCOPE_OBJECTIVE,
      voiceMode: voiceMode || MODE_OBJECTIVE,
      depth: depth || 0,
      beats: (beats || []).slice(),
      options: (options || []).slice(),
      handoffs: (handoffs || []).slice(),
      roomId: roomId,
      roomName: room ? room.publicName : "",
      skeletonKey: skeletonKey,
      skeletonPhrase: skeleton ? skeleton.governingPhrase : "",
      whoFocus: meta && meta.whoFocus ? meta.whoFocus : "",
      valueAxiom: valueAxiom,
      practicalNeed: room ? room.visitorPressure : "",
      source: "local"
    };
  }

  function getNode(nodeId, choice) {
    var id = normalizeNode(nodeId);
    var character;
    var frontierKey;

    if (id === "restartFork") {
      resetState();
      return getNode("intro", choice);
    }

    if (id === "intro") return makeIntroNode();
    if (id === "askFirst") return makeAskFirstNode();
    if (id === "returnFork") return makeReturnForkNode();
    if (id === "recenterNode" || id === "loopRecovery") return makeRecenterNode();
    if (id === "switchTopics") return makeSwitchTopicsNode();
    if (id === "sharpQuestion") return makeSharpQuestionNode();
    if (id === "cleanDoor") return makeCleanDoorNode();

    if (id === "websitePath") return makeWebsiteNode();
    if (id === "compassPath" || id === "whereToStart") return makeCompassNode();
    if (id === "siteGuidePath") return makeSiteGuideNode();
    if (id === "proofPath" || id === "skepticPlain" || id === "lawsPath") return makeProofNode();
    if (id === "gaugesPath") return makeGaugesNode();
    if (id === "diagnosticPath" || id === "futureProfilePath") return makeDiagnosticNode();
    if (id === "seanPath") return makeSeanNode();
    if (id === "underdogPath") return makeUnderdogNode();
    if (id === "productsPath") return makeProductsNode();
    if (id === "bookPath" || id === "nineSummitsPath") return makeBookNode(id);
    if (id === "mirrorlandPath" || id === "atriumPath" || id === "atlasPath" || id === "mirrorMePath") return makeMirrorlandNode(id);
    if (id === "hearthPath" || id === "hearthFacilityPath" || id === "hearthConstructPath" || id === "hearthFrontierPath" || id === "hearthLawPath") return makeHearthNode(id);
    if (id === "ziontsPath") return makeZiontsNode();
    if (id === "audraliaPath" || id === "audraliaWorldroomPath" || id === "controlCockpitPath") return makeAudraliaNode(id);
    if (id === "scientificLawPath" || id.indexOf("scientificLaw") === 0) return makeScientificLawNode(id);

    if (
      id === "frontierPath" ||
      id === "frontierSystemsPath" ||
      id === "frontierLawPath" ||
      id === "frontierCharactersPath" ||
      id.indexOf("frontier") === 0
    ) {
      frontierKey = targetToFrontierKey(id);
      return makeFrontierNode(id, frontierKey);
    }

    character = targetToCharacter(id);
    if (character) return makeCharacterNode(character);

    if (
      id === "charactersPath" ||
      id === "characterIdentityPath" ||
      id === "characterRelationshipsPath" ||
      id === "characterTensionsPath" ||
      id === "characterMotivesPath" ||
      id === "characterStoryPressurePath" ||
      id === "characterFirstPath"
    ) {
      return makeCharactersNode(id);
    }

    if (
      id === "characterArchetypeMirrorPath" ||
      id === "selfLearningPath" ||
      id === "characterArchetypeQuestionOne" ||
      id === "characterArchetypeQuestionTwo" ||
      id === "characterArchetypeQuestionThree" ||
      id === "characterArchetypeResult"
    ) {
      return makeCharacterArchetypeNode(id);
    }

    return makeRecenterNode();
  }

  function makeIntroNode() {
    return makeNode(
      "intro",
      "arrival",
      "arrival",
      "receive",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Welcome to the estate. Let me show you around.",
        "I’m Jeeves, and I help visitors find the right door inside Diamond Gate Bridge.",
        "You do not need to understand the whole estate at once.",
        "Orientation gives direction, the Laws provide truth, the Frontier provides the future, Mirrorland is the window, the Characters give it depth, and Meet Sean reveals the human source behind the estate."
      ],
      [
        say("Show me around the estate.", "websitePath", { signal: "orientation" }),
        say("Enter Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
        say("Explain it plainly.", "skepticPlain", { signal: "skeptic" }),
        say("Meet Sean.", "seanPath", { signal: "source" }),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath", { signal: "archetype" }),
        say("Ask me one question first.", "askFirst", { signal: "question" })
      ],
      []
    );
  }

  function makeAskFirstNode() {
    return makeNode(
      "askFirst",
      "arrival",
      "arrival",
      "invite",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask simply.",
        "What brought you to the estate first: direction, proof, self-reflection, Meet Sean, practical use, Mirrorland, or the Character Archetype Mirror?"
      ],
      [
        say("Direction.", "websitePath", { signal: "orientation" }),
        say("Proof.", "skepticPlain", { signal: "skeptic" }),
        say("Self-reflection.", "diagnosticPath", { signal: "self" }),
        say("Meet Sean.", "seanPath", { signal: "source" }),
        say("Practical use.", "productsPath", { signal: "practical" }),
        say("Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath", { signal: "archetype" })
      ],
      []
    );
  }

  function makeReturnForkNode() {
    return makeNode(
      "returnFork",
      "arrival",
      "arrival",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Let’s return to the clean fork.",
        "Every meaning needs a name and a place. Choose the place that fits what you want next."
      ],
      [
        say("Show me around the estate.", "websitePath", { signal: "orientation" }),
        say("Show me the proof path.", "proofPath", { signal: "skeptic" }),
        say("Meet Sean.", "seanPath", { signal: "source" }),
        say("This Underdog.", "underdogPath", { signal: "self" }),
        say("Enter Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath", { signal: "archetype" })
      ],
      []
    );
  }

  function makeRecenterNode() {
    return makeNode(
      "recenterNode",
      "recenter",
      "orientation",
      "return",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Let me bring you back to the estate floor.",
        "Direction begins at the Compass Desk. Truth is kept in the Law Library. The future is tested in Frontier. Mirrorland is the window. The Characters are the people inside it. Meet Sean is the human source."
      ],
      [
        say("Compass Desk.", "compassPath", { signal: "orientation" }),
        say("Law Library.", "proofPath", { signal: "skeptic" }),
        say("Frontier.", "frontierPath", { signal: "mirrorland" }),
        say("Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
        say("Meet Sean.", "seanPath", { signal: "source" }),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath", { signal: "archetype" })
      ],
      ["compass", "laws", "frontier", "interactiveNarrative", "meetSean"]
    );
  }

  function makeSwitchTopicsNode() {
    return makeNode(
      "switchTopics",
      "switchTopics",
      "orientation",
      "fork",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      0,
      [
        "Of course. We can change rooms.",
        "Choose a named door, and I’ll take you there without dragging the last room behind us."
      ],
      [
        say("Compass Desk.", "compassPath"),
        say("Law Library.", "scientificLawPath"),
        say("Frontier.", "frontierPath"),
        say("Mirrorland.", "mirrorlandPath"),
        say("Meet the Characters.", "charactersPath"),
        say("Meet Sean.", "seanPath"),
        say("Nine Summits.", "nineSummitsPath")
      ],
      []
    );
  }

  function makeSharpQuestionNode() {
    var topic = state.currentTopic;

    if (topic === "characterArchetype") {
      return makeNode(
        "sharpQuestion",
        "characterArchetype",
        "diagnostic",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        1,
        [
          "Then I’ll ask it cleanly.",
          "Do you want to know which Character Archetype you follow under pressure, what behavior shows up first, or which room should teach you next?"
        ],
        [
          say("Which Character Archetype do I follow under pressure?", "characterArchetypeQuestionOne", { signal: "archetype" }),
          say("What behavior shows up first?", "characterArchetypeQuestionOne", { signal: "archetype" }),
          say("Which room should teach me next?", "cleanDoor", { signal: "route" }),
          say("Meet the Characters first.", "charactersPath")
        ],
        ["coherenceDiagnostic", "characters", "nineSummits"]
      );
    }

    if (topic === "scientificLaw" || topic === "proof") {
      return makeNode(
        "sharpQuestion",
        "scientificLaw",
        "proof",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_OBJECTIVE,
        1,
        [
          "Then the sharper question is this:",
          "Are you testing theory, evidence, measurement, limits, or whether the claim is mature enough to trust?"
        ],
        [
          say("Theory.", "scientificLawTheoryPath"),
          say("Evidence.", "scientificLawEvidencePath"),
          say("Measure.", "scientificLawMeasurePath"),
          say("Limits.", "scientificLawLimitsPath"),
          say("Claim maturity.", "scientificLawLadderPath")
        ],
        ["scientificLaw"]
      );
    }

    if (topic === "frontier") {
      return makeNode(
        "sharpQuestion",
        "frontier",
        "frontier",
        "clarify",
        SCOPE_NARRATIVE,
        MODE_THRESHOLD,
        1,
        [
          "Then let’s narrow Frontier.",
          "Do you want the whole yard, one system, the Scientific Law boundary, or the Characters who carry the system pressure?"
        ],
        [
          say("Show me Frontier.", "frontierPath"),
          say("Show one system.", "frontierSystemsPath"),
          say("Show the Scientific Law boundary.", "frontierLawPath"),
          say("Meet the Characters through Frontier.", "frontierCharactersPath")
        ],
        ["frontier"]
      );
    }

    if (topic === "hearth") {
      return makeNode(
        "sharpQuestion",
        "hearth",
        "hearth",
        "clarify",
        SCOPE_NARRATIVE,
        MODE_THRESHOLD,
        1,
        [
          "Then let’s place Hearth precisely.",
          "Do you want Hearth as a hidden facility, a planetary construct engine, a bridge to Frontier, or a claim that must answer to Scientific Law?"
        ],
        [
          say("Hearth as a facility.", "hearthFacilityPath"),
          say("Planetary construct engine.", "hearthConstructPath"),
          say("Bridge to Frontier.", "hearthFrontierPath"),
          say("Scientific Law boundary.", "hearthLawPath")
        ],
        ["hearth"]
      );
    }

    if (topic === "sean" || topic === "underdog" || topic === "book" || topic === "nineSummits") {
      return makeNode(
        "sharpQuestion",
        topic,
        "sean",
        "clarify",
        SCOPE_OBJECTIVE,
        MODE_OBJECTIVE,
        1,
        [
          "Then we’ll keep the source path clean.",
          "Do you want Meet Sean, This Underdog, Nine Summits, or the value line that belongs under the moment?"
        ],
        [
          say("Meet Sean.", "seanPath"),
          say("This Underdog.", "underdogPath"),
          say("Nine Summits.", "nineSummitsPath"),
          say("Which value fits this moment?", "nineSummitsPath"),
          say("Character Archetype Mirror.", "characterArchetypeMirrorPath")
        ],
        ["meetSean", "aboutUnderdog", "nineSummits"]
      );
    }

    return makeNode(
      "sharpQuestion",
      "orientation",
      "orientation",
      "clarify",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then I’ll ask it plainly.",
        "Do you want direction, truth, future systems, Mirrorland, the Characters, Meet Sean, Nine Summits, or your behavior under pressure?"
      ],
      [
        say("Direction.", "compassPath"),
        say("Truth.", "scientificLawPath"),
        say("Future systems.", "frontierPath"),
        say("Mirrorland.", "mirrorlandPath"),
        say("Meet the Characters.", "charactersPath"),
        say("Meet Sean.", "seanPath"),
        say("Nine Summits.", "nineSummitsPath"),
        say("Behavior under pressure.", "characterArchetypeMirrorPath")
      ],
      []
    );
  }

  function makeCleanDoorNode() {
    var topic = state.currentTopic;
    var handoffs = ["compass", "siteGuide"];
    var room = getRoom(state.currentRoomId);
    var skeleton = getSkeleton(state.currentSkeletonKey);

    if (topic === "hearth") handoffs = ["hearth", "frontier", "scientificLaw"];
    if (topic === "frontier") handoffs = ["frontier", "audralia", "hearth"];
    if (topic === "characters" || topic === "characterArchetype") handoffs = ["characters", "mirrorland", "coherenceDiagnostic"];
    if (topic === "scientificLaw") handoffs = ["scientificLaw", "laws", "gauges"];
    if (topic === "sean" || topic === "underdog" || topic === "book" || topic === "nineSummits") handoffs = ["meetSean", "aboutUnderdog", "nineSummits"];

    return makeNode(
      "cleanDoor",
      topic,
      "handoff",
      "route",
      state.currentScopeLane,
      state.currentVoiceMode,
      3,
      [
        "The cleanest next door depends on what you want to do now.",
        skeleton ? skeleton.governingPhrase : "Jeeves is the guide.",
        room ? room.publicName + " is the current place. " + room.practicalAction : "The Compass Desk can return you to direction.",
        "Right now, you seem to be " + state.visitor.lastItch + "."
      ],
      [
        say("I need direction.", "compassPath"),
        say("I want truth.", "scientificLawPath"),
        say("I want Frontier.", "frontierPath"),
        say("I want Mirrorland.", "mirrorlandPath"),
        say("I want Meet Sean.", "seanPath"),
        say("I want the Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      handoffs
    );
  }

  function makeWebsiteNode() {
    return makeNode(
      "websitePath",
      "diamondGateBridge",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The estate has a public side and a Mirrorland side.",
        "The public side gives visitors what they already know how to ask for: direction, proof, products, source, and self-reflection.",
        "Mirrorland is different. That is where the future becomes a window, the Characters become active, and the estate starts feeling less like a site and more like a place."
      ],
      [
        say("Compass Desk.", "compassPath"),
        say("Guide Desk.", "siteGuidePath"),
        say("Law Library.", "scientificLawPath"),
        say("Meet Sean.", "seanPath"),
        say("This Underdog.", "underdogPath"),
        say("Enter Mirrorland.", "mirrorlandPath"),
        control("Which door fits this best?", "cleanDoor")
      ],
      ["compass", "siteGuide", "laws", "meetSean"]
    );
  }

  function makeCompassNode() {
    return makeNode(
      "compassPath",
      "compass",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Compass Desk is where I slow the estate down for you.",
        "If you want direction, stay here. If you want truth, I’ll take you to the Law Library. If you want the human source, Meet Sean. If you want the window, enter Mirrorland."
      ],
      [
        say("Guide Desk.", "siteGuidePath"),
        say("Truth first.", "scientificLawPath"),
        say("Meet Sean.", "seanPath"),
        say("This Underdog.", "underdogPath"),
        say("Frontier.", "frontierPath"),
        say("Mirrorland.", "mirrorlandPath"),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      ["compass", "siteGuide", "meetSean"]
    );
  }

  function makeSiteGuideNode() {
    return makeNode(
      "siteGuidePath",
      "siteGuide",
      "orientation",
      "ground",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Guide Desk is the estate map.",
        "Compass gives direction. The Law Library tests truth. The Lab shows status. Frontier tests future systems. The Atrium opens Mirrorland. Meet Sean reveals the human source. The Characters make Mirrorland personal."
      ],
      [
        say("Compass Desk.", "compassPath"),
        say("Law Library.", "scientificLawPath"),
        say("The Lab.", "gaugesPath"),
        say("Meet Sean.", "seanPath"),
        say("Frontier.", "frontierPath"),
        say("Atrium into Mirrorland.", "atriumPath"),
        say("Meet the Characters.", "charactersPath")
      ],
      ["siteGuide", "compass", "showroom"]
    );
  }

  function makeProofNode() {
    return makeNode(
      "proofPath",
      "proof",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "If you are skeptical, good. The estate has a room for that.",
        "The Laws provide truth. The Law Library keeps claims from outrunning evidence.",
        "Scientific Law is the sharper chamber. It asks whether a claim can be defined, tested, corrected, limited, and checked again."
      ],
      [
        say("Scientific Law.", "scientificLawPath"),
        say("Theory.", "scientificLawTheoryPath"),
        say("Evidence.", "scientificLawEvidencePath"),
        say("Measure.", "scientificLawMeasurePath"),
        say("Limits.", "scientificLawLimitsPath"),
        say("The Lab.", "gaugesPath")
      ],
      ["scientificLaw", "laws", "gauges", "coherenceDiagnostic"]
    );
  }

  function makeGaugesNode() {
    return makeNode(
      "gaugesPath",
      "gauges",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Lab is the status room.",
        "It helps separate what is working, what is held, what is forming, and what should not be overclaimed.",
        "Truth needs instruments as well as language."
      ],
      [
        say("Scientific Law.", "scientificLawPath"),
        say("Law Library.", "lawsPath"),
        say("Diagnostic.", "diagnosticPath"),
        say("Enter Mirrorland.", "mirrorlandPath")
      ],
      ["gauges", "laws", "scientificLaw"]
    );
  }

  function makeScientificLawNode(id) {
    var target = id || "scientificLawPath";
    var beats = [
      SCIENTIFIC_LAW.summary,
      SCIENTIFIC_LAW.core,
      "The four doors are Theory, Evidence, Measure, and Limits."
    ];

    if (target === "scientificLawTheoryPath") {
      beats = [
        SCIENTIFIC_LAW.doors.theory,
        "It organizes observations into a possible explanation, creates expectations, exposes assumptions, and must be able to lose.",
        "Audit question: what would force this theory to be revised, narrowed, or rejected?"
      ];
    } else if (target === "scientificLawEvidencePath") {
      beats = [
        SCIENTIFIC_LAW.doors.evidence,
        "Evidence must be inspectable, traceable, relevant, and separate from interpretation.",
        "Audit question: can this evidence be matched to the exact claim it is being used to support?"
      ];
    } else if (target === "scientificLawMeasurePath") {
      beats = [
        SCIENTIFIC_LAW.doors.measure,
        "Measurement needs object, variable, unit, method, instrument or observer, calibration, and uncertainty.",
        "Without measurement, people often argue from different maps."
      ];
    } else if (target === "scientificLawLimitsPath") {
      beats = [
        SCIENTIFIC_LAW.doors.limits,
        "Limits are not weakness. They protect truth from overclaiming.",
        "A strong claim says what it can say, what it cannot say, where it applies, and what would change the conclusion."
      ];
    } else if (target === "scientificLawRoutePath") {
      beats = [
        "The Scientific Route keeps a claim from jumping straight from impression to authority.",
        "Observe → Define → Measure → Compare → Revise → Limit.",
        "That route is how confidence learns to answer to reality."
      ];
    } else if (target === "scientificLawLadderPath") {
      beats = [
        "The claim testing ladder shows maturity.",
        SCIENTIFIC_LAW.ladder,
        "The final step is not certainty. It is a bounded, testable, correctable claim."
      ];
    } else if (target === "scientificLawTermsPath") {
      beats = [
        "The deeper terms are repeatability, falsifiability, calibration, uncertainty, causality, and model scope.",
        "They protect the estate from technical-sounding language that cannot survive reality."
      ];
    }

    return makeNode(
      target,
      "scientificLaw",
      "proof",
      "prove",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      target === "scientificLawPath" ? 1 : 2,
      beats,
      [
        say("Theory.", "scientificLawTheoryPath"),
        say("Evidence.", "scientificLawEvidencePath"),
        say("Measure.", "scientificLawMeasurePath"),
        say("Limits.", "scientificLawLimitsPath"),
        say("Claim testing ladder.", "scientificLawLadderPath"),
        say("Frontier boundary.", "frontierLawPath")
      ],
      ["scientificLaw", "laws", "gauges"]
    );
  }

  function makeDiagnosticNode() {
    return makeNode(
      "diagnosticPath",
      "diagnostic",
      "diagnostic",
      "personalize",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Diagnostic is the estate’s public mirror chamber.",
        "It helps a visitor notice the difference between what they claim, what they choose, and what their behavior under pressure reveals.",
        "In the current version, it is local-only. It does not store, email, archive, or save the result.",
        "If you want that reflection to become narrative, use the Character Archetype Mirror."
      ],
      [
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath", { signal: "archetype" }),
        say("Show my behavior under pressure.", "selfLearningPath", { signal: "archetype" }),
        say("Meet the Characters first.", "charactersPath"),
        say("This Underdog.", "underdogPath"),
        say("Nine Summits.", "nineSummitsPath"),
        say("Scientific Law.", "scientificLawPath")
      ],
      ["coherenceDiagnostic", "characters", "aboutUnderdog"]
    );
  }

  function makeSeanNode() {
    return makeNode(
      "seanPath",
      "sean",
      "sean",
      "reflect",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "Then you should Meet Sean.",
        "The estate has rooms, laws, worlds, and characters, but Sean is where the human pressure behind all of it becomes visible.",
        "Sean Mansfield is the writer, designer, and developer behind Diamond Gate Bridge.",
        "One of Sean’s governing lines is: “When you learn to live a life without expectations, you experience a life without limitations.”"
      ],
      [
        say("This Underdog.", "underdogPath"),
        say("Nine Summits.", "nineSummitsPath"),
        say("The value logic.", "bookPath"),
        say("Diagnostic.", "diagnosticPath"),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath")
      ],
      ["meetSean", "aboutUnderdog", "book"]
    );
  }

  function makeUnderdogNode() {
    return makeNode(
      "underdogPath",
      "underdog",
      "sean",
      "deepen",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "This Underdog is not Sean alone.",
        "This Underdog is in the visitor too. It is the part of a person that carried pressure before it found language, direction, or use.",
        "The point is not to admire pressure. The point is to learn what your behavior under pressure has been trying to teach."
      ],
      [
        say("Show my behavior under pressure.", "selfLearningPath", { signal: "archetype" }),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath", { signal: "archetype" }),
        say("Diagnostic.", "diagnosticPath"),
        say("Meet Sean.", "seanPath"),
        say("Nine Summits.", "nineSummitsPath")
      ],
      ["aboutUnderdog", "coherenceDiagnostic", "nineSummits"]
    );
  }

  function makeProductsNode() {
    return makeNode(
      "productsPath",
      "products",
      "products",
      "route",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      [
        "The Product Gallery is the practical public value wing.",
        "It is where a message becomes usable: something a visitor can carry, read, wear, give, return to, or use as a reminder.",
        "The estate should not only mean something. It should give the visitor a way to use what they found."
      ],
      [
        say("Book path.", "bookPath"),
        say("Nine Summits.", "nineSummitsPath"),
        say("This Underdog.", "underdogPath"),
        say("Meet Sean.", "seanPath"),
        say("Diagnostic.", "diagnosticPath"),
        say("Enter Mirrorland.", "mirrorlandPath")
      ],
      ["products", "book", "coherenceDiagnostic"]
    );
  }

  function makeBookNode(id) {
    var beats;

    if (id === "nineSummitsPath") {
      beats = [
        "The Nine Summits are the estate’s value construct.",
        "They are not nine isolated slogans. They are a relational mountain range: each summit changes meaning depending on the others around it.",
        SEAN_VALUE_AXIOMS.liveLoveLaughListen.phrase,
        "Love without listening becomes projection. Laughter without love becomes cruelty. Vision without humility becomes manipulation. Purpose without love becomes performance."
      ];
    } else {
      beats = [
        "The Nine Summits of Love is the book path inside the estate.",
        "It turns pressure, voice, coherence, love, and becoming into a human-development journey.",
        "A room can orient. A diagnostic can reflect. A book can walk with the reader."
      ];
    }

    return makeNode(
      id || "bookPath",
      "nineSummits",
      "book",
      "deepen",
      SCOPE_OBJECTIVE,
      MODE_OBJECTIVE,
      1,
      beats,
      [
        say("Meet Sean.", "seanPath"),
        say("This Underdog.", "underdogPath"),
        say("Character Archetype Mirror.", "characterArchetypeMirrorPath", { signal: "archetype" }),
        say("Diagnostic.", "diagnosticPath"),
        say("Product Gallery.", "productsPath")
      ],
      ["book", "nineSummits", "meetSean"]
    );
  }

  function makeMirrorlandNode(id) {
    var beats;

    if (id === "atriumPath") {
      beats = [
        "The Atrium is the threshold into Mirrorland.",
        "This is where the estate begins to feel less like a site and more like a place.",
        "From here, I can take you to Audralia, Hearth, Frontier, or the Characters."
      ];
    } else if (id === "atlasPath") {
      beats = [
        "The Atlas Study is where Mirrorland gains coordinates.",
        "It helps you choose what you are looking at: consequence, possibility, construction, systems, or people.",
        "If you want the future world, look toward Audralia. If you want the construction chamber, open Hearth."
      ];
    } else if (id === "mirrorMePath") {
      beats = [
        "Mirror Me is the reflective side of Mirrorland.",
        "The Diagnostic reflects how you answer. The Character Archetype Mirror reflects how you behave under pressure.",
        "Mirror Me belongs where reflection starts becoming story."
      ];
    } else {
      beats = [
        "Mirrorland is the window.",
        "The public estate lets a visitor read, look, and explore. Mirrorland lets the visitor step closer to the future as a lived place.",
        "The Characters are the people inside it. As the digital agents come online, the visitor will be able to communicate with them directly inside Mirrorland."
      ];
    }

    return makeNode(
      id || "mirrorlandPath",
      "mirrorland",
      "mirrorland",
      "fork",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      1,
      beats,
      [
        say("Take me to the Atrium.", "atriumPath"),
        say("Open the Atlas Study.", "atlasPath"),
        say("Show me Audralia.", "audraliaPath"),
        say("Open Hearth.", "hearthPath"),
        say("Open Frontier.", "frontierPath"),
        say("Meet the Characters.", "charactersPath")
      ],
      ["interactiveNarrative", "audralia", "hearth", "frontier", "characters"]
    );
  }

  function makeHearthNode(id) {
    var beats = [
      "Hearth is the planetary construct facility where world-formation logic becomes operational.",
      "It is not merely a globe route.",
      "Mirrorland reveals. Audralia carries. Frontier tests. Hearth constructs. Scientific Law verifies. The Characters carry the human cost."
    ];

    if (id === "hearthFacilityPath") {
      beats = [
        "Hearth is the unknown-location facility.",
        "That matters because it prevents Hearth from being reduced to a simple public globe.",
        "It is the chamber where planetary construction logic is organized before the visitor fully understands where that chamber is."
      ];
    } else if (id === "hearthConstructPath") {
      beats = [
        "Hearth is the planetary construct engine in the estate’s public canon.",
        "It is where world-formation logic becomes operational: structure, terrain, hydrology, surface behavior, motion, and the conditions that let a planet read as a constructed world.",
        "Hearth constructs. That is its governing verb."
      ];
    } else if (id === "hearthFrontierPath") {
      beats = [
        "Hearth and Frontier are paired, but not identical.",
        "Frontier tests systems: energy, water, waste, infrastructure, signal, direction, and civic pressure.",
        "Hearth constructs the planetary condition those systems must eventually live inside."
      ];
    } else if (id === "hearthLawPath") {
      beats = [
        "Hearth still answers to Scientific Law.",
        "A planetary construct can be imaginative, but the claims around it need theory, evidence, measurement, and limits.",
        "That is how Hearth stays disciplined instead of becoming only a visual idea."
      ];
    }

    return makeNode(
      id || "hearthPath",
      "hearth",
      "hearth",
      "reveal",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      2,
      beats,
      [
        say("Hearth as facility.", "hearthFacilityPath"),
        say("Planetary construct engine.", "hearthConstructPath"),
        say("Hearth and Frontier.", "hearthFrontierPath"),
        say("Hearth and Scientific Law.", "hearthLawPath"),
        say("Audralia.", "audraliaPath"),
        say("Meet the Characters.", "charactersPath")
      ],
      ["hearth", "frontier", "scientificLaw"]
    );
  }

  function makeZiontsNode() {
    return makeNode(
      "ziontsPath",
      "zionts",
      "mirrorland",
      "reveal",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      2,
      [
        "ZIONTS is the consequence room.",
        "It exists so the future cannot be treated as only possibility.",
        "Audralia shows constructive future. ZIONTS reminds the visitor what happens when truth, systems, and responsibility fail."
      ],
      [
        say("Show me Audralia.", "audraliaPath"),
        say("Scientific Law.", "scientificLawPath"),
        say("Frontier.", "frontierPath"),
        say("Meet Soren.", "characterSorenPath")
      ],
      ["zionts", "audralia", "scientificLaw"]
    );
  }

  function makeAudraliaNode(id) {
    var beats;

    if (id === "audraliaWorldroomPath") {
      beats = [
        "The Audralia Worldroom is where Audralia becomes visible enough to inspect.",
        "It is not merely a picture of a world. It is the place where a future-world body starts to become legible.",
        "From there, the Control Cockpit can help you read the state."
      ];
    } else if (id === "controlCockpitPath") {
      beats = [
        "The Control Cockpit is where Audralia becomes readable as state.",
        "A world needs visible controls, readouts, and disposition before the visitor can understand what is changing.",
        "It is the difference between looking at a world and learning how to read it."
      ];
    } else {
      beats = [
        "Audralia is the constructive future world.",
        "It gives Mirrorland terrain, scale, and consequence.",
        "Hearth is where construction logic becomes operational. Frontier tests the systems Audralia may need. The Characters make those systems personal."
      ];
    }

    return makeNode(
      id || "audraliaPath",
      "audralia",
      "audralia",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      beats,
      [
        say("Open the Audralia Worldroom.", "audraliaWorldroomPath"),
        say("Open the Control Cockpit.", "controlCockpitPath"),
        say("Frontier.", "frontierPath"),
        say("Hearth.", "hearthPath"),
        say("Meet the Characters.", "charactersPath"),
        say("Scientific Law.", "scientificLawPath")
      ],
      ["audralia", "audraliaWorldroom", "controlCockpit", "frontier", "hearth"]
    );
  }

  function targetToFrontierKey(target) {
    var map = {
      frontierEnergyPath: "energy",
      frontierWaterPath: "water",
      frontierWastePath: "waste",
      frontierClosedLoopPath: "closedLoop",
      frontierInfrastructurePath: "infrastructure",
      frontierLatticePath: "lattice",
      frontierUrbanPath: "urban",
      frontierManualPath: "manual",
      frontierShimmerPath: "shimmer",
      frontierTrajectoryPath: "trajectory",
      frontierVisionPath: "vision"
    };

    return map[target] || "";
  }

  function makeFrontierNode(id, systemKey) {
    var system = systemKey ? FRONTIER_SYSTEMS[systemKey] : null;
    var beats;

    if (id === "frontierLawPath") {
      beats = [
        "Scientific Law keeps Frontier from becoming fantasy language.",
        "Frontier can imagine future systems, but Scientific Law asks whether each claim is defined, evidenced, measured, compared, revised, and limited.",
        "That is why Energy cannot pretend fusion is solved, Waste cannot hide downstream cost, and Closed Loop cannot claim closure without audit return."
      ];
    } else if (id === "frontierCharactersPath") {
      beats = [
        "Frontier becomes more readable when you meet the Characters.",
        "Tarian belongs naturally to Water. Soren belongs to Waste and Boundary. Alaric belongs to Trajectory. Elara belongs to Shimmer and Vision. Dextrion belongs to Energy and repair readiness.",
        "Frontier tests systems. The Characters show how people behave under the pressure those systems create."
      ];
    } else if (system) {
      beats = [
        system.name + " — " + system.status + ".",
        system.text,
        system.character + " is the character closest to this system.",
        "This is a Frontier pressure test, not a claim that the future system is finished."
      ];
    } else {
      beats = [
        "Frontier is where the future becomes testable.",
        "It is Audralia’s applied-science yard: energy, water, waste, feedback, infrastructure, lattice, urban pressure, manuals, signals, trajectory, and vision.",
        "If Mirrorland is the window, Frontier is where the future starts answering practical questions."
      ];
    }

    return makeNode(
      id || "frontierPath",
      "frontier",
      "frontier",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_THRESHOLD,
      system ? 2 : 1,
      beats,
      [
        say("Show Frontier systems.", "frontierSystemsPath"),
        say("Energy.", "frontierEnergyPath"),
        say("Water.", "frontierWaterPath"),
        say("Waste.", "frontierWastePath"),
        say("Scientific Law boundary.", "frontierLawPath"),
        say("Hearth and Frontier.", "hearthFrontierPath"),
        say("Meet the Characters through Frontier.", "frontierCharactersPath")
      ],
      system ? [system.route, "frontier"] : ["frontier", "audralia", "hearth"]
    );
  }

  function makeCharacterCompletionCueBeats() {
    if (!isCharacterCompletionReady()) return [];

    state.visitor.characterCompletionPromptShown = true;

    return [
      "You can keep asking me about them here.",
      "But if you are ready, Mirrorland is where this changes from explanation into encounter. As the digital agents come online, you will be able to communicate with the Characters directly inside Mirrorland."
    ];
  }

  function makeCharacterCompletionOptions() {
    if (!isCharacterCompletionReady()) return [];

    return [
      say("Enter Mirrorland.", "mirrorlandPath", { signal: "mirrorland" }),
      say("Keep asking about the Characters.", "charactersPath", { signal: "characters" }),
      say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath", { signal: "archetype" }),
      say("Return to the estate.", "compassPath", { signal: "orientation" })
    ];
  }

  function makeCharactersNode(id) {
    var completionBeats = state.visitor.characterCompletionPromptShown ? [] : makeCharacterCompletionCueBeats();
    var completionOptions = makeCharacterCompletionOptions();

    if (id === "characterRelationshipsPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "The relationships are not decorative. They are pressure lines.",
          "Auren and Jeeves meet where protection needs permission. Alaric and Tarian meet where warning has to survive the body. Elara and Soren meet where possibility has to answer hidden cost. Dextrion and Soren meet where repair has to face proof."
        ].concat(completionBeats),
        [
          say("Meet Auren Vale.", "characterAurenValePath"),
          say("Meet Dextrion.", "characterDextrionPath"),
          say("Meet Alaric.", "characterAlaricPath"),
          say("Meet Tarian.", "characterTarianPath"),
          say("Meet Elara.", "characterElaraPath"),
          say("Meet Soren.", "characterSorenPath"),
          say("Character Archetype Mirror.", "characterArchetypeMirrorPath")
        ].concat(completionOptions),
        ["characters", "mirrorland"]
      );
    }

    if (id === "characterTensionsPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "deepen",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Their conflict is not only good against evil.",
          "It is memory against denial, survival against consequence, voice against silence, and choice against pressure.",
          "The Characters matter because they turn future systems into lived cost."
        ].concat(completionBeats),
        [
          say("Show relationships.", "characterRelationshipsPath"),
          say("Who should I meet first?", "characterFirstPath"),
          say("Character Archetype Mirror.", "characterArchetypeMirrorPath"),
          say("Enter Mirrorland.", "mirrorlandPath")
        ],
        ["characters", "mirrorland"]
      );
    }

    if (id === "characterFirstPath") {
      return makeNode(
        id,
        "characters",
        "characters",
        "route",
        SCOPE_NARRATIVE,
        MODE_IMMERSION,
        2,
        [
          "Start with the behavior you want to understand.",
          "If you want protection, meet Auren. If you want repair, meet Dextrion. If you want warning, meet Alaric. If you want endurance, meet Tarian. If you want signal, meet Elara. If you want truth and boundary, meet Soren. If you want guided sequence, stay with Jeeves. If you want survival beyond the safe center, meet the Remote Team."
        ].concat(completionBeats),
        [
          say("Meet Auren Vale.", "characterAurenValePath"),
          say("Meet Dextrion.", "characterDextrionPath"),
          say("Meet Alaric.", "characterAlaricPath"),
          say("Meet Tarian.", "characterTarianPath"),
          say("Meet Elara.", "characterElaraPath"),
          say("Meet Soren.", "characterSorenPath"),
          say("Tell me about Jeeves.", "characterJeevesPath"),
          say("Meet the Remote Team.", "characterRemoteTeamPath")
        ].concat(completionOptions),
        ["characters", "mirrorland"]
      );
    }

    return makeNode(
      "charactersPath",
      "characters",
      "characters",
      "personalize",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      1,
      [
        "The Characters are where Mirrorland starts breathing.",
        CHARACTER_REGISTRY.aurenVale.oneLine,
        CHARACTER_REGISTRY.dextrion.oneLine,
        CHARACTER_REGISTRY.alaric.oneLine,
        CHARACTER_REGISTRY.tarian.oneLine,
        "I can introduce them properly, or we can use the Character Archetype Mirror to see which pattern you follow when pressure rises."
      ].concat(completionBeats),
      [
        say("Who are the Characters?", "characterIdentityPath"),
        say("Meet Auren Vale.", "characterAurenValePath"),
        say("Meet Dextrion.", "characterDextrionPath"),
        say("Meet Alaric.", "characterAlaricPath"),
        say("Meet Tarian.", "characterTarianPath"),
        say("Meet Elara.", "characterElaraPath"),
        say("Meet Soren.", "characterSorenPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath")
      ].concat(completionOptions),
      ["characters", "mirrorland"]
    );
  }

  function makeCharacterNode(characterId) {
    var character = CHARACTER_REGISTRY[characterId];
    var completionBeats = state.visitor.characterCompletionPromptShown ? [] : makeCharacterCompletionCueBeats();
    var completionOptions = makeCharacterCompletionOptions();

    if (!character) return makeCharactersNode("charactersPath");

    return makeNode(
      character.target,
      "characters",
      "characters",
      "deepen",
      SCOPE_NARRATIVE,
      MODE_IMMERSION,
      2,
      [
        character.compositionProfile,
        "Behavior under pressure: " + character.mirror,
        character.estateFunction + " " + character.frontierConnection
      ].concat(completionBeats),
      [
        say("Show how the Characters relate.", "characterRelationshipsPath"),
        say("Show what conflict they carry.", "characterTensionsPath"),
        say("Which Character Archetype do I follow under pressure?", "characterArchetypeMirrorPath"),
        say("Meet another Character.", "charactersPath"),
        say("Enter Mirrorland.", "mirrorlandPath"),
        control("Choose the next door.", "cleanDoor")
      ].concat(completionOptions),
      ["characters", "mirrorland"]
    );
  }

  function makeCharacterArchetypeNode(id) {
    if (id === "characterArchetypeQuestionOne" || id === "selfLearningPath" || id === "characterArchetypeMirrorPath") {
      return makeNode(
        "characterArchetypeQuestionOne",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        1,
        [
          "We can use the Character Archetype Mirror.",
          "It does not tell you who you are. It looks at how you tend to behave under pressure, then shows which character pattern you are currently following.",
          "First question: when pressure rises, what do you usually notice first?"
        ],
        [
          say("Who needs protection?", "characterArchetypeQuestionTwo", { signal: "archetype" }),
          say("What is broken and needs repair?", "characterArchetypeQuestionTwo", { signal: "archetype" }),
          say("Where danger is forming early.", "characterArchetypeQuestionTwo", { signal: "archetype" }),
          say("What the body or situation can actually endure.", "characterArchetypeQuestionTwo", { signal: "archetype" }),
          say("What truth or hidden cost is being avoided.", "characterArchetypeQuestionTwo", { signal: "archetype" }),
          say("What signal of hope needs to become visible.", "characterArchetypeQuestionTwo", { signal: "archetype" })
        ],
        ["coherenceDiagnostic", "characters", "nineSummits"]
      );
    }

    if (id === "characterArchetypeQuestionTwo") {
      return makeNode(
        "characterArchetypeQuestionTwo",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        2,
        [
          "Second question.",
          "When the pressure increases, what do you rely on next?"
        ],
        [
          say("A clear sequence and controlled timing.", "characterArchetypeQuestionThree", { signal: "archetype" }),
          say("Visible action or repair.", "characterArchetypeQuestionThree", { signal: "archetype" }),
          say("Stability, continuity, and keeping people from breaking.", "characterArchetypeQuestionThree", { signal: "archetype" }),
          say("Evidence, contradiction, and proof.", "characterArchetypeQuestionThree", { signal: "archetype" }),
          say("A public signal that gives people hope.", "characterArchetypeQuestionThree", { signal: "archetype" }),
          say("A team or field response beyond one safe center.", "characterArchetypeQuestionThree", { signal: "archetype" })
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    if (id === "characterArchetypeQuestionThree") {
      return makeNode(
        "characterArchetypeQuestionThree",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        3,
        [
          "Third question.",
          "What usually becomes your risk when the pressure gets too high?"
        ],
        [
          say("I overprotect or hide too much.", "characterArchetypeResult", { signal: "archetype" }),
          say("I try to fix everything too fast.", "characterArchetypeResult", { signal: "archetype" }),
          say("I see danger before people believe me.", "characterArchetypeResult", { signal: "archetype" }),
          say("I keep carrying more than I can sustain.", "characterArchetypeResult", { signal: "archetype" }),
          say("I need the truth named before I can move.", "characterArchetypeResult", { signal: "archetype" }),
          say("I manage how much truth people can receive.", "characterArchetypeResult", { signal: "archetype" })
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    return makeCharacterArchetypeResultNode();
  }

  function makeCharacterArchetypeResultNode() {
    var mirror = computeLocalCharacterArchetype();
    var top = mirror[0];
    var second = mirror[1];
    var third = mirror[2];
    var topCharacter;

    if (!top) {
      return makeNode(
        "characterArchetypeResult",
        "characterArchetype",
        "diagnostic",
        "personalize",
        SCOPE_OBJECTIVE,
        MODE_CHARACTER_ARCHETYPE,
        3,
        [
          "I do not have enough signal to name a clean Character Archetype yet.",
          "That is not a failure. It means the mirror needs clearer answers.",
          "Take the Coherence Diagnostic if you want a stronger read."
        ],
        [
          say("Ask the first archetype question again.", "characterArchetypeQuestionOne", { signal: "archetype" }),
          say("Take the Coherence Diagnostic.", "diagnosticPath"),
          say("Meet the Characters first.", "charactersPath"),
          control("Re-center me.", "recenterNode")
        ],
        ["coherenceDiagnostic", "characters"]
      );
    }

    topCharacter = CHARACTER_REGISTRY[top.id];

    return makeNode(
      "characterArchetypeResult",
      "characterArchetype",
      "diagnostic",
      "close",
      SCOPE_OBJECTIVE,
      MODE_CHARACTER_ARCHETYPE,
      3,
      [
        "Your current Character Archetype under pressure is closest to " + topCharacter.name + ".",
        "That does not mean you are " + topCharacter.name + ". It means your answers follow a similar behavior pattern when pressure rises.",
        topCharacter.compositionProfile,
        second ? "Your secondary pattern is closest to " + CHARACTER_REGISTRY[second.id].name + "." : "The secondary pattern is not strong enough to name cleanly yet.",
        third ? "Your tension pattern is closest to " + CHARACTER_REGISTRY[third.id].name + ": the behavior that may appear when pressure gets too high." : "This is enough to begin, not enough to make a final label."
      ],
      [
        say("Show why this archetype appeared.", topCharacter.target),
        second ? say("Show the secondary pattern.", CHARACTER_REGISTRY[second.id].target) : say("Ask another archetype question.", "characterArchetypeQuestionOne", { signal: "archetype" }),
        say("Take the full Diagnostic.", "diagnosticPath"),
        say("Connect this to Nine Summits.", "nineSummitsPath"),
        say("Meet all the Characters.", "charactersPath"),
        say("Enter Mirrorland.", "mirrorlandPath")
      ],
      ["characters", "coherenceDiagnostic", "nineSummits", "mirrorland"]
    );
  }

  function computeLocalCharacterArchetype() {
    var scores = {};
    var answers = state.visitor.characterArchetypeAnswers.join(" ").toLowerCase();

    Object.keys(CHARACTER_REGISTRY).forEach(function initScore(id) {
      scores[id] = 0;
    });

    LOCAL_ARCHETYPE_KEYWORDS.forEach(function eachEntry(entry) {
      entry.words.forEach(function eachWord(word) {
        if (answers.indexOf(word.toLowerCase()) !== -1) {
          scores[entry.id] += 2;
        }
      });
    });

    if (answers.indexOf("protection") !== -1 || answers.indexOf("protect") !== -1) scores.aurenVale += 3;
    if (answers.indexOf("repair") !== -1 || answers.indexOf("fix") !== -1) scores.dextrion += 3;
    if (answers.indexOf("danger") !== -1 || answers.indexOf("early") !== -1) scores.alaric += 3;
    if (answers.indexOf("endure") !== -1 || answers.indexOf("body") !== -1 || answers.indexOf("sustain") !== -1) scores.tarian += 3;
    if (answers.indexOf("hope") !== -1 || answers.indexOf("visible") !== -1) scores.elara += 3;
    if (answers.indexOf("truth") !== -1 || answers.indexOf("hidden cost") !== -1) scores.soren += 3;
    if (answers.indexOf("sequence") !== -1 || answers.indexOf("timing") !== -1) scores.jeeves += 3;
    if (answers.indexOf("team") !== -1 || answers.indexOf("field") !== -1) scores.remoteTeam += 3;

    return Object.keys(scores)
      .map(function toRow(id) {
        return {
          id: id,
          score: scores[id]
        };
      })
      .filter(function hasScore(row) {
        return row.score > 0;
      })
      .sort(function sortScore(a, b) {
        return b.score - a.score || CHARACTER_REGISTRY[a.id].name.localeCompare(CHARACTER_REGISTRY[b.id].name);
      })
      .slice(0, 3);
  }

  function targetToCharacterFromText(text) {
    var normalized = String(text || "").toLowerCase();
    var id;

    for (id in CHARACTER_REGISTRY) {
      if (Object.prototype.hasOwnProperty.call(CHARACTER_REGISTRY, id)) {
        if (normalized.indexOf(CHARACTER_REGISTRY[id].name.toLowerCase()) !== -1) return id;
        if (normalized.indexOf(CHARACTER_REGISTRY[id].shortName.toLowerCase()) !== -1) return id;
      }
    }

    return "";
  }

  function classifyText(text) {
    var value = String(text || "").toLowerCase();
    var characterId = targetToCharacterFromText(value);

    if (
      value.indexOf("character archetype") !== -1 ||
      value.indexOf("archetype") !== -1 ||
      value.indexOf("under pressure") !== -1 ||
      value.indexOf("behavior under pressure") !== -1 ||
      value.indexOf("how do i respond") !== -1 ||
      value.indexOf("learn about myself") !== -1 ||
      value.indexOf("self learning") !== -1
    ) {
      return { target: "characterArchetypeMirrorPath", signal: "archetype" };
    }

    if (characterId) {
      return { target: CHARACTER_REGISTRY[characterId].target, signal: "characters" };
    }

    if (
      value.indexOf("lost") !== -1 ||
      value.indexOf("confused") !== -1 ||
      value.indexOf("recenter") !== -1 ||
      value.indexOf("center") !== -1
    ) {
      return { target: "recenterNode", signal: "lost" };
    }

    if (
      value.indexOf("sean") !== -1 ||
      value.indexOf("founder") !== -1 ||
      value.indexOf("creator") !== -1 ||
      value.indexOf("source") !== -1 ||
      value.indexOf("designer") !== -1 ||
      value.indexOf("developer") !== -1 ||
      value.indexOf("who built") !== -1
    ) {
      return { target: "seanPath", signal: "source" };
    }

    if (
      value.indexOf("underdog") !== -1 ||
      value.indexOf("inner voice") !== -1 ||
      value.indexOf("voice") !== -1 ||
      value.indexOf("pressure in me") !== -1
    ) {
      return { target: "underdogPath", signal: "human" };
    }

    if (
      value.indexOf("expectation") !== -1 ||
      value.indexOf("limitations") !== -1 ||
      value.indexOf("limitation") !== -1 ||
      value.indexOf("live to love") !== -1 ||
      value.indexOf("love to laugh") !== -1 ||
      value.indexOf("live to listen") !== -1 ||
      value.indexOf("manipulation") !== -1 ||
      value.indexOf("use other people's minds") !== -1 ||
      value.indexOf("use other people’s minds") !== -1
    ) {
      return { target: "nineSummitsPath", signal: "value" };
    }

    if (
      value.indexOf("scientific law") !== -1 ||
      value.indexOf("theory") !== -1 ||
      value.indexOf("evidence") !== -1 ||
      value.indexOf("measure") !== -1 ||
      value.indexOf("limits") !== -1 ||
      value.indexOf("claim") !== -1 ||
      value.indexOf("proof") !== -1 ||
      value.indexOf("truth") !== -1 ||
      value.indexOf("law library") !== -1
    ) {
      return { target: "scientificLawPath", signal: "skeptic" };
    }

    if (
      value.indexOf("frontier") !== -1 ||
      value.indexOf("energy") !== -1 ||
      value.indexOf("fusion") !== -1 ||
      value.indexOf("water") !== -1 ||
      value.indexOf("waste") !== -1 ||
      value.indexOf("closed loop") !== -1 ||
      value.indexOf("infrastructure") !== -1 ||
      value.indexOf("lattice") !== -1 ||
      value.indexOf("urban") !== -1 ||
      value.indexOf("shimmer") !== -1 ||
      value.indexOf("trajectory") !== -1 ||
      value.indexOf("vision") !== -1 ||
      value.indexOf("future") !== -1
    ) {
      return { target: "frontierPath", signal: "mirrorland" };
    }

    if (
      value.indexOf("hearth") !== -1 ||
      value.indexOf("planetary construct") !== -1 ||
      value.indexOf("construct facility") !== -1 ||
      value.indexOf("construct engine") !== -1
    ) {
      return { target: "hearthPath", signal: "mirrorland" };
    }

    if (
      value.indexOf("character") !== -1 ||
      value.indexOf("people") !== -1 ||
      value.indexOf("who lives") !== -1
    ) {
      return { target: "charactersPath", signal: "characters" };
    }

    if (
      value.indexOf("mirrorland") !== -1 ||
      value.indexOf("audralia") !== -1 ||
      value.indexOf("story") !== -1 ||
      value.indexOf("showroom") !== -1 ||
      value.indexOf("window") !== -1 ||
      value.indexOf("atrium") !== -1
    ) {
      return { target: "mirrorlandPath", signal: "mirrorland" };
    }

    if (
      value.indexOf("diagnostic") !== -1 ||
      value.indexOf("coherence") !== -1 ||
      value.indexOf("self") !== -1 ||
      value.indexOf("reflect") !== -1
    ) {
      return { target: "diagnosticPath", signal: "self" };
    }

    if (
      value.indexOf("product") !== -1 ||
      value.indexOf("tool") !== -1 ||
      value.indexOf("use") !== -1 ||
      value.indexOf("practical") !== -1 ||
      value.indexOf("economic") !== -1 ||
      value.indexOf("impact") !== -1
    ) {
      return { target: "productsPath", signal: "practical" };
    }

    if (
      value.indexOf("book") !== -1 ||
      value.indexOf("summit") !== -1 ||
      value.indexOf("love") !== -1 ||
      value.indexOf("laugh") !== -1 ||
      value.indexOf("listen") !== -1
    ) {
      return { target: "bookPath", signal: "book" };
    }

    if (
      value.indexOf("start") !== -1 ||
      value.indexOf("where") !== -1 ||
      value.indexOf("begin") !== -1 ||
      value.indexOf("orientation") !== -1 ||
      value.indexOf("direction") !== -1
    ) {
      return { target: "compassPath", signal: "orientation" };
    }

    return { target: "askFirst", signal: "question" };
  }

  function isBackendEligible(target, settings) {
    if (!state.brain.enabled) return false;
    if (settings && settings.noBrain) return false;
    if (LOCAL_FINAL_TARGETS.indexOf(normalizeNode(target)) !== -1) return false;
    return true;
  }

  function shouldAskBrainBeforeLocal(target) {
    return [
      "scientificLawPath",
      "scientificLawTheoryPath",
      "scientificLawEvidencePath",
      "scientificLawMeasurePath",
      "scientificLawLimitsPath",
      "frontierPath",
      "frontierSystemsPath"
    ].indexOf(normalizeNode(target)) !== -1;
  }

  function buildBrainPayload(target, choice) {
    var cartography = resolveCartographyFromTarget(target);

    return {
      visitorText: choice && choice.label ? choice.label : "",
      currentNode: target,
      currentEntry: state.currentTopic,
      currentPath: state.currentTopic,
      currentScopeLane: state.currentScopeLane,
      currentVoiceMode: state.currentVoiceMode,
      currentRoomId: cartography.roomId,
      currentRoomName: cartography.roomName,
      currentSkeletonKey: cartography.skeletonKey,
      currentSkeletonPhrase: cartography.skeletonPhrase,
      visitorPosture: state.currentPosture,
      movement: choice && choice.signal ? choice.signal : "",
      pathDepth: state.currentDepth,
      loopCount: state.visitor.loopCount,
      routeReadiness: state.visitor.routeReadiness,
      allowedTargets: APPROVED_TARGETS.slice(),
      allowedRoutes: APPROVED_ROUTE_IDS.slice(),
      sessionTrail: state.visitor.trail.map(function trailToString(item) {
        return item.topic + ":" + item.node + ":" + item.label;
      }),
      cartographyTrail: state.visitor.cartographyTrail.slice(),
      requestedMode: state.currentVoiceMode,
      characterArchetypeAnswers: state.visitor.characterArchetypeAnswers.slice(),
      registryContext: {
        id: state.currentTopic,
        summary: state.visitor.lastItch,
        routes: state.currentRouteHandoffs,
        targets: [],
        room: cartography,
        skeleton: HOUSE_SKELETON[cartography.skeletonKey] || null
      }
    };
  }

  async function requestJeevesBrain(target, choice) {
    var controller;
    var timeout;
    var payload;
    var response;
    var data;

    if (!state.brain.endpoint) return null;

    payload = buildBrainPayload(target, choice);
    state.brain.lastRequest = safeClone(payload);
    state.brain.lastStatus = "pending";

    controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    if (controller) {
      timeout = window.setTimeout(function abortBrain() {
        try {
          controller.abort();
        } catch (_error) {
          /* Non-critical. */
        }
      }, state.brain.timeoutMs);
    }

    try {
      response = await fetch(state.brain.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      });

      if (timeout) window.clearTimeout(timeout);

      if (!response.ok) {
        state.brain.lastStatus = "http_" + response.status;
        return null;
      }

      data = await response.json();

      state.brain.lastResponse = safeClone(data);
      state.brain.lastStatus = data && data.ok ? "ok" : "fallback";

      return normalizeBrainResponse(data);
    } catch (_error) {
      if (timeout) window.clearTimeout(timeout);
      state.brain.lastStatus = "unavailable";
      return null;
    }
  }

  function normalizeBrainResponse(data) {
    var options;
    var handoffs;

    if (!data || !Array.isArray(data.bubbles) || !data.bubbles.length) {
      return null;
    }

    options = Array.isArray(data.options) ? data.options : [];
    handoffs = Array.isArray(data.handoffs) ? data.handoffs : [];

    state.visitor.lastBrainIntent = data.intent || "";
    state.visitor.lastBrainCanonStatus = data.canonStatus || "";
    state.visitor.lastBrainConclusiveState = data.conclusiveState || "";

    return {
      topic: data.nextTopic || state.currentTopic,
      posture: state.currentPosture,
      phase: data.conclusiveState === "complete" ? "close" : state.currentPhase,
      scopeLane: data.suggestedMode === "immersion" || data.suggestedMode === "threshold" ? SCOPE_NARRATIVE : state.currentScopeLane,
      voiceMode: data.suggestedMode || state.currentVoiceMode,
      depth: state.currentDepth,
      beats: data.bubbles.slice(0, 4),
      options: options.map(function normalizeOption(item) {
        return {
          label: item.label,
          target: normalizeTarget(item.target),
          type: item.type || "conversation",
          scopeLane: item.scopeLane || null,
          signal: data.intent || ""
        };
      }),
      handoffs: handoffs.map(normalizeRouteId).filter(Boolean),
      roomId: state.currentRoomId,
      skeletonKey: state.currentSkeletonKey,
      source: data.source || "brain"
    };
  }

  function updateCurrentState(nodeId, node, choice) {
    var sourceNode = state.currentNode;
    var roomId = node.roomId || TARGET_ROOM_MAP[nodeId] || "compassDesk";
    var skeletonKey = node.skeletonKey || TARGET_SKELETON_MAP[nodeId] || "guide";

    state.previousNode = state.currentNode;
    state.currentNode = normalizeNode(nodeId);
    state.currentTopic = node.topic || "arrival";
    state.currentPosture = node.posture || "arrival";
    state.currentPhase = node.phase || "receive";
    state.currentScopeLane = node.scopeLane || SCOPE_OBJECTIVE;
    state.currentVoiceMode = node.voiceMode || MODE_OBJECTIVE;
    state.currentDepth = node.depth || 0;
    state.currentRouteHandoffs = (node.handoffs || []).slice();
    state.currentRoomId = roomId;
    state.currentSkeletonKey = skeletonKey;
    state.currentWhoFocus = node.whoFocus || "";
    state.currentValueAxiom = node.valueAxiom || "";
    state.currentPracticalNeed = node.practicalNeed || "";
    state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);

    updateVisitor(choice, node, sourceNode);
    setDocumentState();

    state.history.push({
      node: state.currentNode,
      topic: state.currentTopic,
      posture: state.currentPosture,
      phase: state.currentPhase,
      scopeLane: state.currentScopeLane,
      voiceMode: state.currentVoiceMode,
      depth: state.currentDepth,
      itch: state.visitor.lastItch,
      roomId: state.currentRoomId,
      skeletonKey: state.currentSkeletonKey,
      stateIndex: state.stateIndex
    });

    while (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }
  }

  async function runNode(nodeId, settings) {
    var token;
    var node;
    var localNode;
    var brainNode;
    var choice;
    var completed;

    if (state.busy) return;

    state.busy = true;
    state.runToken += 1;
    token = state.runToken;

    choice = settings && settings.choice ? settings.choice : null;
    nodeId = normalizeNode(nodeId);
    localNode = getNode(nodeId, choice);

    updateCurrentState(nodeId, localNode, choice);
    hideOptions();

    if (isBackendEligible(nodeId, settings) && shouldAskBrainBeforeLocal(nodeId)) {
      brainNode = await requestJeevesBrain(nodeId, choice);
      if (brainNode && brainNode.beats && brainNode.beats.length) {
        node = brainNode;
      } else {
        node = localNode;
      }
    } else {
      node = localNode;
    }

    if (node !== localNode) {
      state.currentTopic = node.topic || state.currentTopic;
      state.currentPhase = node.phase || state.currentPhase;
      state.currentScopeLane = node.scopeLane || state.currentScopeLane;
      state.currentVoiceMode = node.voiceMode || state.currentVoiceMode;
      state.currentRoomId = node.roomId || state.currentRoomId;
      state.currentSkeletonKey = node.skeletonKey || state.currentSkeletonKey;
      state.stateIndex = computeStateIndex(state.currentPosture, state.currentPhase);
      setDocumentState();
    }

    await waitFixed(settings && settings.fast ? PACING.firstMessageDelayMs : 420);

    if (token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    completed = await playBeats(node.beats || [], token, node.source || "local");

    if (!completed || token !== state.runToken) {
      state.busy = false;
      clearTapAdvance();
      return;
    }

    renderOptions(node.options || []);
    renderHandoffs(node.handoffs || []);

    state.busy = false;
    clearTapAdvance();
    scrollThread();
  }

  function handleOption(item) {
    if (!item || !item.target || state.busy) return;

    addMessage("visitor", item.label);
    runNode(item.target, { choice: item });
  }

  function ask(text) {
    var result = classifyText(text);

    if (state.busy) return;

    addMessage("visitor", text);
    runNode(result.target, {
      choice: {
        label: text,
        target: result.target,
        signal: result.signal
      }
    });
  }

  function isInteractiveTarget(target) {
    if (!target || !target.closest) return false;

    return Boolean(target.closest(
      "button,a,input,textarea,select,[role='button'],.jeeves-option,[data-no-tap-advance='true']"
    ));
  }

  function bindTapAdvance() {
    if (state.tapAdvance.bound) return;

    state.tapAdvance.bound = true;

    document.addEventListener("pointerdown", function onPointerDown(event) {
      if (isInteractiveTarget(event.target)) return;

      state.tapAdvance.pointerId = event.pointerId;
      state.tapAdvance.startX = event.clientX;
      state.tapAdvance.startY = event.clientY;
      state.tapAdvance.startTime = Date.now();
    }, { passive: true });

    document.addEventListener("pointerup", function onPointerUp(event) {
      var dx;
      var dy;
      var distance;
      var duration;

      if (isInteractiveTarget(event.target)) return;
      if (state.tapAdvance.pointerId !== event.pointerId) return;

      dx = event.clientX - state.tapAdvance.startX;
      dy = event.clientY - state.tapAdvance.startY;
      distance = Math.sqrt(dx * dx + dy * dy);
      duration = Date.now() - state.tapAdvance.startTime;

      state.tapAdvance.pointerId = null;

      if (
        distance <= PACING.tapMaxDistancePx &&
        duration <= PACING.tapMaxDurationMs
      ) {
        requestTapAdvance();
      }
    }, { passive: true });

    document.addEventListener("pointercancel", function onPointerCancel() {
      state.tapAdvance.pointerId = null;
    }, { passive: true });
  }

  function bindRestore() {
    if (!els.restoreButton || !els.minimized) return;

    els.restoreButton.addEventListener("click", function restoreJeeves() {
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
      brainEndpoint: state.brain.endpoint,
      state: state,
      houseSkeleton: HOUSE_SKELETON,
      siteCartography: SITE_CARTOGRAPHY,
      valueAxioms: SEAN_VALUE_AXIOMS,
      nineSummitsRelativity: NINE_SUMMITS_RELATIVITY,
      characters: CHARACTER_REGISTRY,
      frontierSystems: FRONTIER_SYSTEMS,
      routes: mergeRoutes,
      runNode: runNode,
      ask: ask,
      classifyText: classifyText,
      requestJeevesBrain: requestJeevesBrain,
      tapAdvance: requestTapAdvance,
      renderOptions: renderOptions,
      setPromptVisible: setPromptVisible,
      isNarrativeTarget: isNarrativeTarget,
      getRoom: function getRoomPublic(roomId) {
        return safeClone(getRoom(roomId));
      },
      getSkeleton: function getSkeletonPublic(key) {
        return safeClone(getSkeleton(key));
      },
      getRoomForTarget: function getRoomForTargetPublic(target) {
        return safeClone(getRoomForTarget(target));
      },
      resolveCartographyFromTarget: function resolveCartographyFromTargetPublic(target) {
        return safeClone(resolveCartographyFromTarget(target));
      },
      getElements: function getElements() {
        return els;
      },
      getState: function getState() {
        return safeClone(state);
      },
      getNode: function getNodePublic(id) {
        return safeClone(getNode(id, null));
      },
      getState256: getState256,
      getCharacterArchetypeAnswers: function getCharacterArchetypeAnswers() {
        return state.visitor.characterArchetypeAnswers.slice();
      },
      resetCharacterArchetype: function resetCharacterArchetype() {
        state.visitor.characterArchetypeAnswers = [];
      },
      getCharacterCompletionState: function getCharacterCompletionState() {
        return {
          views: state.visitor.characterProfileViews.slice(),
          relationshipViews: state.visitor.characterRelationshipViews,
          readiness: state.visitor.characterCompletionReadiness,
          promptShown: state.visitor.characterCompletionPromptShown,
          lastCharacterViewed: state.visitor.lastCharacterViewed
        };
      }
    };

    global.JEEVES_ENGINE = global.HEARTH.JEEVES.engine;
    global.__HEARTH_JEEVES_ENGINE_LOADED__ = true;
    global.__HEARTH_JEEVES_ENGINE_CONTRACT__ = CONTRACT;
    global.__HEARTH_JEEVES_ENGINE_ROUTE__ = ROUTE;
  }

  function init() {
    var initialNode;

    if (state.initialized) return;

    config = readConfig();
    collectElements();

    if (!els.thread) {
      return;
    }

    ensurePromptDock();

    if (!els.promptGrid) {
      return;
    }

    if (!els.handoffGrid) {
      els.handoffGrid = document.createElement("div");
      els.handoffGrid.setAttribute("data-jeeves-handoff-grid", "");
      if (els.handoffDock) els.handoffDock.appendChild(els.handoffGrid);
    }

    if (config && config.brainEndpoint) {
      state.brain.endpoint = String(config.brainEndpoint);
    }

    clearSeedMessage();
    bindRestore();
    bindTapAdvance();
    exposeApi();

    state.initialized = true;

    initialNode = normalizeNode(config.initialNode || "intro");
    runNode(initialNode, { fast: true, noBrain: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
