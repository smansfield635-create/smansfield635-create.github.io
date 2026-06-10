// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_NARRATIVE_BLUEPRINT_ORIENTATION_TNT_v2
// Full-file replacement.
// Browser-safe expression authority.
// Owns: Jeeves public speech shaping, narrative blueprint orientation, quiet NEWS coordinates,
// room proximity meaning, First Fork origin language, room-aware phrasing,
// return-to-prior-topic phrasing, origin-return phrasing, Character Archetype Mirror wording,
// character sequence expression, character social cues, public-safe labels,
// option-label shaping, and non-redundant conversational expression.
// Does not own: DOM rendering, CSS, prompt dock behavior, tap-to-advance,
// route execution, API calls, model bridge, server-side moderation, visited-option state,
// option disabling, or final runtime state.
//

(function hearthJeevesExpressionNarrativeBlueprintOrientation(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_EXPRESSION_NARRATIVE_BLUEPRINT_ORIENTATION_TNT_v2";

  var AXIS_CENTER = "C";
  var AXIS_NORTH = "N";
  var AXIS_EAST = "E";
  var AXIS_WEST = "W";
  var AXIS_SOUTH = "S";
  var AXIS_NORTHEAST = "NE";
  var AXIS_SOUTHEAST = "SE";
  var AXIS_SOUTHWEST = "SW";
  var AXIS_WEST_SOUTH = "WS";
  var AXIS_SOUTH_NORTH = "SN";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var DEFAULT_CURRENT_ROOM_ID = "hearthProductionChamber";

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
    { pattern: /\bserver[-\s]?side\b/gi, replacement: "deeper side" },
    { pattern: /\bback[-\s]?end\b/gi, replacement: "deeper side" },
    { pattern: /\bfront[-\s]?end\b/gi, replacement: "visible side" },
    { pattern: /\bcontract\b/gi, replacement: "governing mark" },
    { pattern: /\bTNT\b/g, replacement: "" }
  ];

  var TARGET_ALIASES = {
    worldPath: "mirrorlandPath",
    worldGatePath: "atriumPath",
    characterMirrorPath: "characterArchetypeMirrorPath",
    characterMirrorQuestionOne: "characterArchetypeQuestionOne",
    characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
    characterMirrorQuestionThree: "characterArchetypeQuestionThree",
    characterMirrorResult: "characterArchetypeResult",
    characterFactionsPath: "characterRelationshipsPath"
  };

  var ROUTE_ALIASES = {
    worldGate: "mirrorland",
    globeWindow: "mirrorland"
  };

  var NEWS_AXES = {
    C: {
      cardinal: AXIS_CENTER,
      name: "center",
      role: "origin, return, and re-orientation",
      publicLine: "This is the estate’s center of return."
    },
    N: {
      cardinal: AXIS_NORTH,
      name: "north",
      role: "source, orientation, first clarity, and human origin",
      publicLine: "This belongs to the northern source and orientation side of the estate."
    },
    E: {
      cardinal: AXIS_EAST,
      name: "east",
      role: "future systems, construction, testing, and becoming",
      publicLine: "This belongs to the eastern future side of the estate."
    },
    W: {
      cardinal: AXIS_WEST,
      name: "west",
      role: "proof, truth, correction, law, and boundary",
      publicLine: "This belongs to the western proof side of the estate."
    },
    S: {
      cardinal: AXIS_SOUTH,
      name: "south",
      role: "Mirrorland, descent, encounter, character, and world-window",
      publicLine: "This belongs to the southern Mirrorland side of the estate."
    },
    NE: {
      cardinal: AXIS_NORTHEAST,
      name: "northeast",
      role: "public value and usable expression",
      publicLine: "This belongs to the northeast practical-value side of the estate."
    },
    SE: {
      cardinal: AXIS_SOUTHEAST,
      name: "southeast",
      role: "future world, Audralia, and constructive possibility",
      publicLine: "This belongs to the southeast future-world side of the estate."
    },
    SW: {
      cardinal: AXIS_SOUTHWEST,
      name: "southwest",
      role: "consequence, warning, and hidden cost",
      publicLine: "This belongs to the southwest consequence side of the estate."
    },
    WS: {
      cardinal: AXIS_WEST_SOUTH,
      name: "west-south",
      role: "reflection bridge between proof and character depth",
      publicLine: "This bridge sits between proof and character depth."
    },
    SN: {
      cardinal: AXIS_SOUTH_NORTH,
      name: "south-north",
      role: "value road between personal depth and human source",
      publicLine: "This road carries personal depth back toward human source."
    }
  };

  var PLACE_TYPES = {
    gate: "entry point",
    fork: "decision point",
    bridge: "crossing between related meanings",
    road: "main narrative route",
    lane: "narrower themed path",
    alley: "deeper intimate path",
    hall: "formal interior place",
    chamber: "focused room",
    yard: "testing or building area",
    deck: "control or readout area",
    library: "truth or archive area",
    atrium: "threshold space",
    desk: "working guidance point",
    gallery: "usable public display",
    window: "future-facing reveal",
    room: "defined estate space"
  };

  var ROOMS = {
    firstFork: {
      id: "firstFork",
      canonicalName: "First Fork",
      urbanName: "First Fork",
      coordinateName: "First Fork",
      cardinal: AXIS_CENTER,
      placeType: "fork",
      indoorOutdoor: "hybrid",
      role: "Starting point for every conversation.",
      narrativeReason: "The First Fork exists because every visitor needs a safe origin before the estate branches into proof, source, future, and Mirrorland.",
      proximityMeaning: "It sits close to every major wing so the visitor can return without losing the conversation.",
      speechRole: "origin construct",
      routeId: "jeeves",
      target: "intro",
      returnParent: "",
      originAnchor: "firstFork",
      nearRooms: ["compassDesk", "lawLibrary", "frontier", "atrium", "meetSean"],
      bridgeRooms: ["northBridge", "eastBridge", "westBridge", "southBridge"]
    },
    jeevesInterface: {
      id: "jeevesInterface",
      canonicalName: "Jeeves Interface",
      urbanName: "Front Gate",
      coordinateName: "Front Gate",
      cardinal: AXIS_CENTER,
      placeType: "gate",
      indoorOutdoor: "inside",
      role: "The estate intelligence that receives the visitor.",
      narrativeReason: "Jeeves stands at the gate because the estate needs a host before it needs a map.",
      proximityMeaning: "The gate is closest to the First Fork because welcome and orientation happen together.",
      speechRole: "origin voice",
      routeId: "jeeves",
      target: "intro",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["firstFork", "compassDesk", "guideDesk", "atrium"],
      bridgeRooms: ["northBridge", "southBridge", "westBridge", "eastBridge"]
    },
    hearthProductionChamber: {
      id: "hearthProductionChamber",
      canonicalName: "Hearth Production Chamber",
      urbanName: "Hearth Production Chamber",
      coordinateName: "East Construct Chamber",
      cardinal: AXIS_EAST,
      placeType: "chamber",
      indoorOutdoor: "inside",
      role: "Template production and stabilization before Compass promotion.",
      narrativeReason: "This room belongs near Hearth because it is where the house-conversation logic is stabilized before the public Compass receives it.",
      proximityMeaning: "It sits near Frontier, Hearth, and the proof side because the template must feel immersive, operational, and testable before it moves outward.",
      speechRole: "production guide",
      routeId: "hearth",
      target: "hearthPath",
      returnParent: "hearth",
      originAnchor: "firstFork",
      nearRooms: ["hearth", "frontier", "scientificLaw", "compassDesk"],
      bridgeRooms: ["eastBridge", "westProofBridge", "northReturn"],
      deploymentTarget: "compassPage"
    },
    compassDesk: {
      id: "compassDesk",
      canonicalName: "Compass Desk",
      urbanName: "North Fork",
      coordinateName: "North Fork",
      cardinal: AXIS_NORTH,
      placeType: "fork",
      indoorOutdoor: "inside",
      role: "Orientation and first direction.",
      narrativeReason: "The Compass belongs north because north is the estate’s source of first orientation.",
      proximityMeaning: "It sits near the Guide Desk and Meet Sean because map, source, and first clarity belong together.",
      speechRole: "direction guide",
      routeId: "compass",
      target: "compassPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["guideDesk", "meetSean", "mainHall", "firstFork"],
      bridgeRooms: ["northBridge", "westBridge", "southBridge"]
    },
    guideDesk: {
      id: "guideDesk",
      canonicalName: "Guide Desk",
      urbanName: "North Map Hall",
      coordinateName: "North Map Hall",
      cardinal: AXIS_NORTH,
      placeType: "hall",
      indoorOutdoor: "inside",
      role: "Estate map and route explanation.",
      narrativeReason: "The Guide Desk belongs north because the map should appear before the visitor enters deeper pressure.",
      proximityMeaning: "It sits close to the Compass because orientation and map-reading are adjacent functions.",
      speechRole: "map guide",
      routeId: "siteGuide",
      target: "siteGuidePath",
      returnParent: "compassDesk",
      originAnchor: "firstFork",
      nearRooms: ["compassDesk", "mainHall", "atlasStudy", "lawLibrary"],
      bridgeRooms: ["northBridge", "southBridge"]
    },
    mainHall: {
      id: "mainHall",
      canonicalName: "Main Hall",
      urbanName: "Center Hall",
      coordinateName: "Center Hall",
      cardinal: AXIS_CENTER,
      placeType: "hall",
      indoorOutdoor: "inside",
      role: "Public center before branching.",
      narrativeReason: "The Main Hall keeps the estate familiar before the visitor moves into proof, source, future, or Mirrorland.",
      proximityMeaning: "It sits close to the First Fork because public entry and conversation entry need to remain connected.",
      speechRole: "public center",
      routeId: "home",
      target: "websitePath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["firstFork", "compassDesk", "productGallery", "atrium"],
      bridgeRooms: ["northBridge", "eastBridge", "westBridge", "southBridge"]
    },
    meetSean: {
      id: "meetSean",
      canonicalName: "Meet Sean",
      urbanName: "North Source Hall",
      coordinateName: "North Source Hall",
      cardinal: AXIS_NORTH,
      placeType: "hall",
      indoorOutdoor: "inside",
      role: "Human source behind the estate.",
      narrativeReason: "Meet Sean belongs north because it reveals the human source, motive, and origin behind the estate.",
      proximityMeaning: "It sits near This Underdog and Summit Road because source, voice, and value are closely related.",
      speechRole: "source chamber",
      routeId: "meetSean",
      target: "seanPath",
      returnParent: "compassDesk",
      originAnchor: "firstFork",
      nearRooms: ["thisUnderdog", "nineSummits", "compassDesk", "productGallery"],
      bridgeRooms: ["northBridge", "southNorthBridge", "northwestProofBridge"]
    },
    thisUnderdog: {
      id: "thisUnderdog",
      canonicalName: "This Underdog",
      urbanName: "North Inner Lane",
      coordinateName: "North Inner Lane",
      cardinal: AXIS_NORTH,
      placeType: "lane",
      indoorOutdoor: "inside",
      role: "Inner human entry point.",
      narrativeReason: "This Underdog belongs near Meet Sean because the source room becomes personal only when the visitor recognizes pressure in themselves.",
      proximityMeaning: "It sits near the Character Archetype Mirror because inner voice and behavior under pressure are adjacent doors.",
      speechRole: "inner voice lane",
      routeId: "aboutUnderdog",
      target: "underdogPath",
      returnParent: "meetSean",
      originAnchor: "firstFork",
      nearRooms: ["meetSean", "characterArchetypeMirror", "nineSummits"],
      bridgeRooms: ["southNorthBridge", "westSouthMirrorBridge"]
    },
    productGallery: {
      id: "productGallery",
      canonicalName: "Product Gallery",
      urbanName: "Northeast Market Hall",
      coordinateName: "Northeast Market Hall",
      cardinal: AXIS_NORTHEAST,
      placeType: "gallery",
      indoorOutdoor: "inside",
      role: "Usable public value.",
      narrativeReason: "The Product Gallery belongs northeast because source and practical value meet there.",
      proximityMeaning: "It sits close to Meet Sean and Nine Summits because value becomes usable when it can be carried, read, worn, given, or returned to.",
      speechRole: "usable value gallery",
      routeId: "products",
      target: "productsPath",
      returnParent: "mainHall",
      originAnchor: "firstFork",
      nearRooms: ["mainHall", "meetSean", "nineSummits"],
      bridgeRooms: ["northBridge", "eastBridge"]
    },
    lawLibrary: {
      id: "lawLibrary",
      canonicalName: "Law Library",
      urbanName: "West Library",
      coordinateName: "West Library",
      cardinal: AXIS_WEST,
      placeType: "library",
      indoorOutdoor: "inside",
      role: "Truth boundary and law orientation.",
      narrativeReason: "The Law Library belongs west because the western side of the estate holds correction, proof, and boundary.",
      proximityMeaning: "It sits near Scientific Law and The Lab because claims need both principle and visible status.",
      speechRole: "truth keeper",
      routeId: "laws",
      target: "lawsPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["scientificLaw", "theLab", "diagnostic", "compassDesk"],
      bridgeRooms: ["westBridge", "northwestProofBridge", "westSouthMirrorBridge"]
    },
    scientificLaw: {
      id: "scientificLaw",
      canonicalName: "Scientific Law",
      urbanName: "West Proof Chamber",
      coordinateName: "West Proof Chamber",
      cardinal: AXIS_WEST,
      placeType: "chamber",
      indoorOutdoor: "inside",
      role: "Reality Test chamber.",
      narrativeReason: "Scientific Law belongs on the western proof side because every future-facing claim has to pass through truth before it becomes trustworthy.",
      proximityMeaning: "It sits near the Law Library and The Lab because theory, evidence, measurement, limits, and visible status belong close together.",
      speechRole: "proof chamber",
      routeId: "scientificLaw",
      target: "scientificLawPath",
      returnParent: "lawLibrary",
      originAnchor: "firstFork",
      nearRooms: ["lawLibrary", "theLab", "frontier", "hearthProductionChamber"],
      bridgeRooms: ["westBridge", "eastProofBridge", "westSouthMirrorBridge"]
    },
    theLab: {
      id: "theLab",
      canonicalName: "The Lab",
      urbanName: "West Gauge Room",
      coordinateName: "West Gauge Room",
      cardinal: AXIS_WEST,
      placeType: "room",
      indoorOutdoor: "inside",
      role: "Status, gauges, readiness, and visible proof state.",
      narrativeReason: "The Lab belongs west because proof needs visible status, not only explanation.",
      proximityMeaning: "It sits close to Scientific Law because testing and readout should remain together.",
      speechRole: "status room",
      routeId: "gauges",
      target: "gaugesPath",
      returnParent: "scientificLaw",
      originAnchor: "firstFork",
      nearRooms: ["scientificLaw", "lawLibrary", "frontier"],
      bridgeRooms: ["westBridge", "eastProofBridge"]
    },
    diagnostic: {
      id: "diagnostic",
      canonicalName: "Coherence Diagnostic",
      urbanName: "West Mirror Desk",
      coordinateName: "West Mirror Desk",
      cardinal: AXIS_WEST,
      placeType: "desk",
      indoorOutdoor: "inside",
      role: "Public self-reflection and coherence check.",
      narrativeReason: "The Diagnostic belongs near the western proof side because self-reflection should still respect evidence, limits, and correction.",
      proximityMeaning: "It sits close to the Character Archetype Mirror because measured self-reflection naturally crosses toward character pattern.",
      speechRole: "reflection desk",
      routeId: "coherenceDiagnostic",
      target: "diagnosticPath",
      returnParent: "lawLibrary",
      originAnchor: "firstFork",
      nearRooms: ["characterArchetypeMirror", "scientificLaw", "thisUnderdog"],
      bridgeRooms: ["westSouthMirrorBridge"]
    },
    characterArchetypeMirror: {
      id: "characterArchetypeMirror",
      canonicalName: "Character Archetype Mirror",
      urbanName: "West-South Mirror Bridge",
      coordinateName: "West-South Mirror Bridge",
      cardinal: AXIS_WEST_SOUTH,
      placeType: "bridge",
      indoorOutdoor: "hybrid",
      role: "Bridge from self-reflection to character pattern.",
      narrativeReason: "The Character Archetype Mirror sits between proof and Mirrorland because it translates self-reflection into character pattern.",
      proximityMeaning: "It is close to the Diagnostic, This Underdog, and the Characters because behavior under pressure belongs to all three.",
      speechRole: "archetype mirror",
      routeId: "coherenceDiagnostic",
      target: "characterArchetypeMirrorPath",
      returnParent: "diagnostic",
      originAnchor: "firstFork",
      nearRooms: ["diagnostic", "characters", "thisUnderdog", "nineSummits"],
      bridgeRooms: ["westSouthMirrorBridge", "southBridge", "westBridge"]
    },
    frontier: {
      id: "frontier",
      canonicalName: "Frontier",
      urbanName: "East Yard",
      coordinateName: "East Yard",
      cardinal: AXIS_EAST,
      placeType: "yard",
      indoorOutdoor: "outside",
      role: "Future systems testing yard.",
      narrativeReason: "Frontier belongs east because the east side of the estate is where future systems are tested before they are treated as real.",
      proximityMeaning: "It sits close to Hearth and Audralia because tested systems, world-formation, and future terrain belong together.",
      speechRole: "systems yard",
      routeId: "frontier",
      target: "frontierPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["hearth", "audralia", "scientificLaw"],
      bridgeRooms: ["eastBridge", "eastProofBridge", "southeastBridge"]
    },
    hearth: {
      id: "hearth",
      canonicalName: "Hearth",
      urbanName: "East Construct Chamber",
      coordinateName: "East Construct Chamber",
      cardinal: AXIS_EAST,
      placeType: "chamber",
      indoorOutdoor: "inside",
      role: "Planetary construct facility.",
      narrativeReason: "Hearth belongs near Frontier because Frontier tests what future worlds need, while Hearth is where world-formation logic becomes operational.",
      proximityMeaning: "It sits close to Scientific Law because planetary construction claims must still answer to proof, measurement, and limits.",
      speechRole: "construct chamber",
      routeId: "hearth",
      target: "hearthPath",
      returnParent: "frontier",
      originAnchor: "firstFork",
      nearRooms: ["frontier", "hearthProductionChamber", "audralia", "scientificLaw"],
      bridgeRooms: ["eastBridge", "eastProofBridge", "southeastBridge"]
    },
    audralia: {
      id: "audralia",
      canonicalName: "Audralia",
      urbanName: "Southeast Conservatory",
      coordinateName: "Southeast Conservatory",
      cardinal: AXIS_SOUTHEAST,
      placeType: "hall",
      indoorOutdoor: "hybrid",
      role: "Constructive future world.",
      narrativeReason: "Audralia belongs southeast because it is the future world where possibility becomes terrain.",
      proximityMeaning: "It sits close to Frontier, Hearth, and the Characters because future-world terrain needs systems, construction logic, and people who carry pressure.",
      speechRole: "future world hall",
      routeId: "audralia",
      target: "audraliaPath",
      returnParent: "atlasStudy",
      originAnchor: "firstFork",
      nearRooms: ["audraliaWorldroom", "frontier", "hearth", "characters"],
      bridgeRooms: ["southeastBridge", "southBridge", "eastBridge"]
    },
    audraliaWorldroom: {
      id: "audraliaWorldroom",
      canonicalName: "Audralia Worldroom",
      urbanName: "East-South Worldroom",
      coordinateName: "East-South Worldroom",
      cardinal: AXIS_SOUTHEAST,
      placeType: "room",
      indoorOutdoor: "inside",
      role: "Visible world-body inspection.",
      narrativeReason: "The Audralia Worldroom belongs near Audralia because the future world needs a visible body before the visitor can inspect it.",
      proximityMeaning: "It sits close to the Control Deck because seeing the world and reading its state are related acts.",
      speechRole: "worldroom",
      routeId: "audraliaWorldroom",
      target: "audraliaWorldroomPath",
      returnParent: "audralia",
      originAnchor: "firstFork",
      nearRooms: ["audralia", "controlCockpit", "hearth"],
      bridgeRooms: ["southeastBridge", "eastBridge"]
    },
    controlCockpit: {
      id: "controlCockpit",
      canonicalName: "Control Cockpit",
      urbanName: "East Control Deck",
      coordinateName: "East Control Deck",
      cardinal: AXIS_EAST,
      placeType: "deck",
      indoorOutdoor: "inside",
      role: "Readout and state-control area.",
      narrativeReason: "The Control Deck belongs near the Worldroom because a future world needs readable state, not only surface.",
      proximityMeaning: "It sits within reach of the proof rooms because readouts must remain accountable.",
      speechRole: "control deck",
      routeId: "controlCockpit",
      target: "controlCockpitPath",
      returnParent: "audraliaWorldroom",
      originAnchor: "firstFork",
      nearRooms: ["audraliaWorldroom", "hearth", "theLab"],
      bridgeRooms: ["eastBridge", "eastProofBridge"]
    },
    atrium: {
      id: "atrium",
      canonicalName: "Atrium",
      urbanName: "South Gate",
      coordinateName: "South Gate",
      cardinal: AXIS_SOUTH,
      placeType: "gate",
      indoorOutdoor: "hybrid",
      role: "Threshold into Mirrorland.",
      narrativeReason: "The Atrium belongs south because Mirrorland is a descent into world, character, consequence, and encounter.",
      proximityMeaning: "It sits close to the Characters and Atlas Study because entering the window immediately raises questions of people and place.",
      speechRole: "south threshold",
      routeId: "showroom",
      target: "atriumPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["mirrorland", "atlasStudy", "characters", "mainHall"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"]
    },
    mirrorland: {
      id: "mirrorland",
      canonicalName: "Mirrorland",
      urbanName: "South Window",
      coordinateName: "South Window",
      cardinal: AXIS_SOUTH,
      placeType: "window",
      indoorOutdoor: "hybrid",
      role: "Future-facing window.",
      narrativeReason: "Mirrorland belongs south because it is where the visitor descends from public explanation into world, encounter, and consequence.",
      proximityMeaning: "It sits close to the Characters, Audralia, ZIONTS, and Atlas Study because the window needs people, possibility, consequence, and coordinates.",
      speechRole: "future window",
      routeId: "mirrorland",
      target: "mirrorlandPath",
      returnParent: "atrium",
      originAnchor: "firstFork",
      nearRooms: ["atrium", "atlasStudy", "characters", "audralia", "zionts"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"]
    },
    atlasStudy: {
      id: "atlasStudy",
      canonicalName: "Atlas Study",
      urbanName: "South Map Hall",
      coordinateName: "South Map Hall",
      cardinal: AXIS_SOUTH,
      placeType: "hall",
      indoorOutdoor: "inside",
      role: "Map room for Mirrorland places.",
      narrativeReason: "The Atlas Study belongs near Mirrorland because the future-facing window needs coordinates before the visitor can choose intelligently.",
      proximityMeaning: "It sits between consequence and possibility so the visitor can understand why Audralia and ZIONTS are not the same path.",
      speechRole: "south map hall",
      routeId: "mirrorland",
      target: "atlasPath",
      returnParent: "atrium",
      originAnchor: "firstFork",
      nearRooms: ["atrium", "mirrorland", "audralia", "zionts"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"]
    },
    characters: {
      id: "characters",
      canonicalName: "Characters",
      urbanName: "South Character Lane",
      coordinateName: "South Character Lane",
      cardinal: AXIS_SOUTH,
      placeType: "lane",
      indoorOutdoor: "inside",
      role: "Character chamber and encounter path.",
      narrativeReason: "The Characters belong on the southern Mirrorland side because they turn the future window into encounter.",
      proximityMeaning: "They sit close to Mirrorland and the Character Archetype Mirror because story pressure and visitor pressure reflect one another.",
      speechRole: "character lane",
      routeId: "characters",
      target: "charactersPath",
      returnParent: "mirrorland",
      originAnchor: "firstFork",
      nearRooms: ["mirrorland", "characterDetails", "characterArchetypeMirror", "audralia"],
      bridgeRooms: ["southBridge", "westSouthMirrorBridge", "southeastBridge"]
    },
    characterDetails: {
      id: "characterDetails",
      canonicalName: "Character Details",
      urbanName: "South Character Alley",
      coordinateName: "South Character Alley",
      cardinal: AXIS_SOUTH,
      placeType: "alley",
      indoorOutdoor: "inside",
      role: "Individual character profile and deeper character route.",
      narrativeReason: "The Character Alley belongs near the Character Lane because individual profiles should open only after the visitor understands the roster.",
      proximityMeaning: "It sits close to Mirrorland because character explanation is meant to become encounter.",
      speechRole: "character alley",
      routeId: "characters",
      target: "characterIdentityPath",
      returnParent: "characters",
      originAnchor: "firstFork",
      nearRooms: ["characters", "characterArchetypeMirror", "mirrorland"],
      bridgeRooms: ["southBridge", "westSouthMirrorBridge"]
    },
    zionts: {
      id: "zionts",
      canonicalName: "ZIONTS",
      urbanName: "Southwest Consequence Road",
      coordinateName: "Southwest Consequence Road",
      cardinal: AXIS_SOUTHWEST,
      placeType: "road",
      indoorOutdoor: "hybrid",
      role: "Consequence and hidden cost path.",
      narrativeReason: "ZIONTS belongs southwest because consequence must remain close to Mirrorland but weighted toward warning and hidden cost.",
      proximityMeaning: "It sits near Scientific Law and Soren’s character pressure because consequence needs truth and boundary.",
      speechRole: "consequence road",
      routeId: "zionts",
      target: "ziontsPath",
      returnParent: "atlasStudy",
      originAnchor: "firstFork",
      nearRooms: ["atlasStudy", "mirrorland", "lawLibrary", "characters"],
      bridgeRooms: ["southwestBridge", "westBridge"]
    },
    nineSummits: {
      id: "nineSummits",
      canonicalName: "Nine Summits",
      urbanName: "Summit Road",
      coordinateName: "South-North Summit Road",
      cardinal: AXIS_SOUTH_NORTH,
      placeType: "road",
      indoorOutdoor: "hybrid",
      role: "Value road between personal depth and human source.",
      narrativeReason: "Summit Road runs between south and north because values turn personal depth back toward human source.",
      proximityMeaning: "It sits near Meet Sean, This Underdog, and the Character Archetype Mirror because value, source, and self-recognition belong together.",
      speechRole: "summit road",
      routeId: "nineSummits",
      target: "nineSummitsPath",
      returnParent: "meetSean",
      originAnchor: "firstFork",
      nearRooms: ["meetSean", "thisUnderdog", "characterArchetypeMirror", "productGallery"],
      bridgeRooms: ["southNorthBridge", "northBridge"]
    }
  };

  var TARGET_ROOM_MAP = {
    intro: "firstFork",
    askFirst: "firstFork",
    returnFork: "firstFork",
    restartFork: "firstFork",
    originReturn: "firstFork",
    originReturnPath: "firstFork",
    priorTopicReturn: "firstFork",
    priorTopicReturnPath: "firstFork",
    websitePath: "mainHall",
    compassPath: "compassDesk",
    whereToStart: "compassDesk",
    siteGuidePath: "guideDesk",
    proofPath: "lawLibrary",
    skepticPlain: "lawLibrary",
    lawsPath: "lawLibrary",
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
    characterArchetypeMirrorPath: "characterArchetypeMirror",
    selfLearningPath: "characterArchetypeMirror",
    characterArchetypeQuestionOne: "characterArchetypeMirror",
    characterArchetypeQuestionTwo: "characterArchetypeMirror",
    characterArchetypeQuestionThree: "characterArchetypeMirror",
    characterArchetypeResult: "characterArchetypeMirror",
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
    hearthProductionPath: "hearthProductionChamber",
    ziontsPath: "zionts",
    audraliaPath: "audralia",
    audraliaWorldroomPath: "audraliaWorldroom",
    controlCockpitPath: "controlCockpit",
    frontierPath: "frontier",
    frontierSystemsPath: "frontier",
    frontierEnergyPath: "frontier",
    frontierWaterPath: "frontier",
    frontierWastePath: "frontier",
    frontierClosedLoopPath: "frontier",
    frontierInfrastructurePath: "frontier",
    frontierLatticePath: "frontier",
    frontierUrbanPath: "frontier",
    frontierManualPath: "frontier",
    frontierShimmerPath: "frontier",
    frontierTrajectoryPath: "frontier",
    frontierVisionPath: "frontier",
    frontierLawPath: "frontier",
    frontierCharactersPath: "frontier",
    charactersPath: "characters",
    characterIdentityPath: "characters",
    characterRelationshipsPath: "characters",
    characterTensionsPath: "characters",
    characterMotivesPath: "characters",
    characterStoryPressurePath: "characters",
    characterFirstPath: "characters",
    characterAurenValePath: "characterDetails",
    characterDextrionPath: "characterDetails",
    characterAlaricPath: "characterDetails",
    characterTarianPath: "characterDetails",
    characterElaraPath: "characterDetails",
    characterSorenPath: "characterDetails",
    characterJeevesPath: "characterDetails",
    characterRemoteTeamPath: "characterDetails",
    cleanDoor: "firstFork",
    switchTopics: "firstFork",
    sharpQuestion: "firstFork",
    recenterNode: "firstFork",
    loopRecovery: "firstFork"
  };

  var CHARACTER_PROFILES = {
    aurenVale: {
      id: "aurenVale",
      name: "Auren Vale",
      title: "Sanctuary Builder",
      target: "characterAurenValePath",
      oneLine: "Auren Vale protects the manor, but every life he shelters makes the sanctuary harder to hide.",
      pressureLine: "Behavior under pressure: protection, custody, shelter, and fear of exposure.",
      profileLine: "He matters because protection becomes dangerous when it starts requiring concealment."
    },
    dextrion: {
      id: "dextrion",
      name: "Dextrion",
      title: "Earth-Side Originator",
      target: "characterDextrionPath",
      oneLine: "Dextrion opened the crossing from Earth and carries the burden of everyone who cannot return.",
      pressureLine: "Behavior under pressure: repair, responsibility, guilt, and pressure to fix what broke.",
      profileLine: "He matters because repair is never abstract when people are stranded inside the consequence."
    },
    alaric: {
      id: "alaric",
      name: "Alaric",
      title: "Field Navigator",
      target: "characterAlaricPath",
      oneLine: "Alaric reads danger before proof arrives, which makes him necessary early and difficult to believe.",
      pressureLine: "Behavior under pressure: early warning, danger-reading, orientation, and action before others believe the proof.",
      profileLine: "He matters because a late warning can be perfectly proven and still arrive too late."
    },
    tarian: {
      id: "tarian",
      name: "Tarian",
      title: "Water Anchor",
      target: "characterTarianPath",
      oneLine: "Tarian keeps survival physical because no future matters if the body cannot continue.",
      pressureLine: "Behavior under pressure: endurance, body-level survival, water, recovery, and carrying too much.",
      profileLine: "He matters because endurance has limits, and a mission that ignores the body eventually fails."
    },
    elara: {
      id: "elara",
      name: "Elara",
      title: "Signal Bearer",
      target: "characterElaraPath",
      oneLine: "Elara makes the future visible before it disappears, but visibility always risks exposure.",
      pressureLine: "Behavior under pressure: signal, visibility, hope, public voice, and risk of being seen.",
      profileLine: "She matters because people cannot move toward a future they cannot see."
    },
    soren: {
      id: "soren",
      name: "Soren",
      title: "Boundary Keeper",
      target: "characterSorenPath",
      oneLine: "Soren refuses fake restoration because hidden damage only creates another ZIONTS.",
      pressureLine: "Behavior under pressure: truth, hidden cost, contradiction, boundary, evidence, and refusal of fake restoration.",
      profileLine: "He matters because truth is not harshness when denial is what caused the wound."
    },
    jeeves: {
      id: "jeeves",
      name: "Jeeves",
      title: "Manor Interface",
      target: "characterJeevesPath",
      oneLine: "Jeeves sequences truth because the wrong amount of truth can send a visitor into the wrong room.",
      pressureLine: "Behavior under pressure: sequence, restraint, truth timing, entry, and controlled revelation.",
      profileLine: "He matters because guidance is not control; it is timing, restraint, and a clean next door."
    },
    remoteTeam: {
      id: "remoteTeam",
      name: "Remote Team",
      title: "Distributed Response Unit",
      target: "characterRemoteTeamPath",
      oneLine: "The Remote Team carries survival beyond the manor, where protection has to become distributable.",
      pressureLine: "Behavior under pressure: distributed responsibility, field logistics, public survival, and helping beyond the safe center.",
      profileLine: "They matter because a future that cannot leave the safe center is only a bunker."
    }
  };

  var PUBLIC_LABELS = {
    intro: "Start at the First Fork.",
    askFirst: "Let Jeeves ask one question.",
    returnFork: "Return to the First Fork.",
    originReturn: "Return to origin conversation.",
    originReturnPath: "Return to origin conversation.",
    priorTopicReturn: "Return to prior topic.",
    priorTopicReturnPath: "Return to prior topic.",
    websitePath: "Show me how the estate is built.",
    compassPath: "Let’s begin with orientation.",
    siteGuidePath: "Show me how the rooms relate.",
    proofPath: "Show me what makes it trustworthy.",
    skepticPlain: "Explain it plainly first.",
    lawsPath: "Show me the proof side of the estate.",
    scientificLawPath: "Show me how claims are tested.",
    scientificLawTheoryPath: "Tell me about Theory.",
    scientificLawEvidencePath: "Tell me about Evidence.",
    scientificLawMeasurePath: "Tell me about Measure.",
    scientificLawLimitsPath: "Tell me about Limits.",
    scientificLawRoutePath: "Show me the testing route.",
    scientificLawLadderPath: "Show me the claim ladder.",
    scientificLawTermsPath: "Explain the deeper proof terms.",
    gaugesPath: "Show me the status room.",
    diagnosticPath: "Show me the self-reflection room.",
    characterArchetypeMirrorPath: "Which Character Archetype do I follow under pressure?",
    selfLearningPath: "Show my behavior under pressure.",
    seanPath: "Introduce me to the human source.",
    underdogPath: "Show me This Underdog.",
    productsPath: "Show me what can be used or carried.",
    bookPath: "Show me the book path.",
    nineSummitsPath: "Show me the value road.",
    mirrorlandPath: "Let’s enter Mirrorland.",
    atriumPath: "Take me through the threshold.",
    atlasPath: "Show me the Mirrorland map.",
    hearthPath: "Show me Hearth.",
    hearthFacilityPath: "Explain Hearth as a hidden facility.",
    hearthConstructPath: "Explain Hearth as the planetary construct engine.",
    hearthFrontierPath: "Show why Hearth is near Frontier.",
    hearthLawPath: "Show why Hearth must answer to proof.",
    hearthProductionPath: "Return to the Hearth Production Chamber.",
    ziontsPath: "Show me the consequence road.",
    audraliaPath: "Show me Audralia.",
    audraliaWorldroomPath: "Show me Audralia’s visible worldroom.",
    controlCockpitPath: "Show me how Audralia becomes readable.",
    frontierPath: "Show me Frontier.",
    frontierSystemsPath: "Show me the future systems.",
    frontierEnergyPath: "Tell me about Energy.",
    frontierWaterPath: "Tell me about Water.",
    frontierWastePath: "Tell me about Waste.",
    frontierClosedLoopPath: "Tell me about Closed Loop.",
    frontierInfrastructurePath: "Tell me about Infrastructure.",
    frontierLatticePath: "Tell me about Lattice.",
    frontierUrbanPath: "Tell me about Urban.",
    frontierManualPath: "Tell me about Manual.",
    frontierShimmerPath: "Tell me about Shimmer.",
    frontierTrajectoryPath: "Tell me about Trajectory.",
    frontierVisionPath: "Tell me about Vision.",
    frontierLawPath: "Show why Frontier needs proof.",
    frontierCharactersPath: "Show who carries Frontier pressure.",
    charactersPath: "Introduce the Characters.",
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
    cleanDoor: "Help me choose the next door.",
    switchTopics: "Let’s change rooms.",
    sharpQuestion: "Ask me a sharper question.",
    recenterNode: "Re-center me."
  };

  var ROUTE_LABELS = {
    compass: "Open the Compass",
    home: "Open the Public Entry",
    siteGuide: "Open the Site Guide",
    coherenceDiagnostic: "Open the Diagnostic",
    meetSean: "Meet Sean Mansfield",
    products: "Open Products",
    laws: "Read the Laws",
    scientificLaw: "Open Scientific Law",
    gauges: "Open Gauges",
    showroom: "Open the Showroom",
    hearth: "Open Hearth",
    globeWindow: "Open the World Gate",
    interactiveNarrative: "Enter the Interactive Narrative",
    mirrorland: "Open Mirrorland",
    zionts: "Open ZIONTS",
    audralia: "Visit Audralia",
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

  function normalizeTarget(target) {
    var clean = String(target || "").trim();
    return TARGET_ALIASES[clean] || clean;
  }

  function normalizeRoute(routeId) {
    var clean = String(routeId || "").trim();
    return ROUTE_ALIASES[clean] || clean;
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function getAxis(cardinal) {
    return NEWS_AXES[cardinal] || NEWS_AXES.C;
  }

  function getRoom(roomId) {
    return ROOMS[roomId] || null;
  }

  function getRoomForTarget(target) {
    var roomId = TARGET_ROOM_MAP[normalizeTarget(target)] || "firstFork";
    return getRoom(roomId);
  }

  function getCurrentRoom(context) {
    var ctx = context || {};
    return getRoom(ctx.currentRoomId) ||
      getRoomForTarget(ctx.currentNode || ctx.target || ctx.currentTarget) ||
      getRoom(DEFAULT_CURRENT_ROOM_ID) ||
      getRoom("firstFork");
  }

  function getCoordinateName(input) {
    var room;

    if (!input) return "First Fork";

    if (typeof input === "string") {
      room = getRoom(input) || getRoomForTarget(input);
    } else {
      room = getRoom(input.id) || getRoom(input.roomId) || getRoomForTarget(input.target);
    }

    return room ? room.coordinateName : "First Fork";
  }

  function isHearthContext(context) {
    var ctx = context || {};
    var text = [
      ctx.currentRoomId,
      ctx.currentNode,
      ctx.target,
      ctx.currentTopic,
      ctx.visitorText,
      ctx.label
    ].join(" ").toLowerCase();

    return text.indexOf("hearth") !== -1 ||
      text.indexOf("planetary construct") !== -1 ||
      text.indexOf("construct chamber") !== -1 ||
      text.indexOf("construct engine") !== -1;
  }

  function sanitizePublicText(text, context) {
    var clean = String(text || "");

    clean = clean.replace(/\bthe world side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld side\b/gi, "Mirrorland");
    clean = clean.replace(/\bworld gate\b/gi, "South Gate");
    clean = clean.replace(/\bCharacter Mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bcharacter mirror\b/g, "Character Archetype Mirror");
    clean = clean.replace(/\bwhich character am I most like\b/gi, "which Character Archetype do I follow under pressure");
    clean = clean.replace(/\bwhich character fits my pressure\b/gi, "which Character Archetype do I follow under pressure");
    clean = clean.replace(/\bpressure pattern\b/gi, "behavior under pressure");

    FORBIDDEN_PUBLIC_LANGUAGE.forEach(function eachRule(rule) {
      clean = clean.replace(rule.pattern, rule.replacement);
    });

    if (!isHearthContext(context)) {
      clean = clean.replace(/\bconstruct engine\b/gi, "system");
      clean = clean.replace(/\bconstruct\b/gi, "build");
    }

    clean = clean.replace(/\bthe Mirrorland\b/gi, "Mirrorland");
    clean = clean.replace(/\s{2,}/g, " ");

    return clean.trim();
  }

  function describeRoomPlacement(roomInput, context) {
    var room = typeof roomInput === "string" ? (getRoom(roomInput) || getRoomForTarget(roomInput)) : roomInput;
    var axis;

    if (!room) {
      return "This room belongs to the estate’s central return path.";
    }

    axis = getAxis(room.cardinal);

    return sanitizePublicText(
      room.canonicalName + " belongs to the " + axis.name + " side of the estate because " +
      lowerFirst(room.narrativeReason || axis.role) + ".",
      context
    );
  }

  function describeNearbyRooms(roomInput, context) {
    var room = typeof roomInput === "string" ? (getRoom(roomInput) || getRoomForTarget(roomInput)) : roomInput;

    if (!room) {
      return "The nearby rooms help the visitor understand where this path belongs.";
    }

    return sanitizePublicText(room.proximityMeaning || "The nearby rooms explain why this path belongs where it is.", context);
  }

  function makeGuidedMovementLine(targetRoomInput, context) {
    var room = typeof targetRoomInput === "string" ? (getRoom(targetRoomInput) || getRoomForTarget(targetRoomInput)) : targetRoomInput;
    var axis;

    if (!room) {
      return "Here, I’ll take you back to the First Fork.";
    }

    axis = getAxis(room.cardinal);

    if (room.cardinal === AXIS_CENTER) {
      return "Here, I’ll bring you back to the First Fork.";
    }

    if (room.id === "mirrorland" || room.id === "atrium" || room.cardinal === AXIS_SOUTH) {
      return "If you would like to enter that side of the estate, we should go south through the threshold.";
    }

    if (room.cardinal === AXIS_WEST || room.cardinal === AXIS_WEST_SOUTH) {
      return "Here, let’s go west and test it properly.";
    }

    if (room.cardinal === AXIS_EAST || room.cardinal === AXIS_SOUTHEAST) {
      return "Here, I’ll take you east, where the future-facing rooms sit close together.";
    }

    if (room.cardinal === AXIS_NORTH || room.cardinal === AXIS_NORTHEAST) {
      return "Here, I’ll take you north, where the estate becomes easier to orient.";
    }

    return "Here, I’ll take you toward the " + axis.name + " side of the estate.";
  }

  function makePlacementBeat(target, context) {
    var room = getRoomForTarget(target);

    if (!room) return "";

    return describeRoomPlacement(room, context) + " " + describeNearbyRooms(room, context);
  }

  function lowerFirst(text) {
    var value = String(text || "").trim();
    if (!value) return value;
    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  function shapeLabel(label, target, context) {
    var cleanTarget = normalizeTarget(target);
    var clean = String(label || "").trim();

    if (!clean) clean = PUBLIC_LABELS[cleanTarget] || "Let’s continue.";

    clean = clean.replace(/^Take me north to orientation\.?$/i, "Let’s begin with orientation.");
    clean = clean.replace(/^North Fork\.?$/i, "Let’s begin with orientation.");
    clean = clean.replace(/^Take me west to proof\.?$/i, "Let’s test what makes it trustworthy.");
    clean = clean.replace(/^West Proof Chamber\.?$/i, "Let’s test what makes it trustworthy.");
    clean = clean.replace(/^Take me east to future systems\.?$/i, "Show me the future-facing rooms.");
    clean = clean.replace(/^East Yard\.?$/i, "Show me the future-facing rooms.");
    clean = clean.replace(/^Take me south into Mirrorland\.?$/i, "Let’s enter Mirrorland.");
    clean = clean.replace(/^South Window\.?$/i, "Let’s enter Mirrorland.");
    clean = clean.replace(/^Tell me about the world side\.?$/i, "Let’s enter Mirrorland.");
    clean = clean.replace(/^I want the world side\.?$/i, "Let’s enter Mirrorland.");
    clean = clean.replace(/^Which character am I most like\??$/i, "Which Character Archetype do I follow under pressure?");
    clean = clean.replace(/^Help me learn about myself\.?$/i, "Show my behavior under pressure.");
    clean = clean.replace(/^Tell me about Sean\.?$/i, "Introduce me to the human source.");
    clean = clean.replace(/^Bring me back to the doorway\.?$/i, "Return to the First Fork.");
    clean = clean.replace(/^Who are the Characters\??$/i, "Who are the Characters?");

    if (/^(open|visit|enter|explore|launch|go to)\b/i.test(clean) && PUBLIC_LABELS[cleanTarget]) {
      clean = PUBLIC_LABELS[cleanTarget];
    }

    return sanitizePublicText(clean, context);
  }

  function shapeOption(option, context) {
    var source = option || {};
    var target = normalizeTarget(source.target || "");
    var room = getRoomForTarget(target);
    var label = shapeLabel(source.label, target, context);

    return {
      label: label,
      target: target,
      type: source.type || inferOptionType(target),
      scopeLane: source.scopeLane || inferScopeLane(target),
      signal: source.signal || inferSignal(target),
      cardinal: room ? room.cardinal : AXIS_CENTER,
      coordinateName: room ? room.coordinateName : "First Fork",
      placeType: room ? room.placeType : "fork",
      roomId: room ? room.id : "firstFork",
      narrativePlacement: room ? room.narrativeReason : "",
      proximityMeaning: room ? room.proximityMeaning : ""
    };
  }

  function shapeOptions(options, context) {
    var seen = {};
    var result = [];
    var ctx = context || {};
    var characterOverviewDone = Boolean(
      ctx.characterOverviewDone ||
      ctx.hasSeenCharacterOverview ||
      (ctx.currentTopic === "characters" && ctx.characterProfileViewCount > 0)
    );

    (options || []).forEach(function eachOption(option) {
      var shaped = shapeOption(option, ctx);
      var key = shaped.label + "::" + shaped.target;

      if (!shaped.label || !shaped.target || seen[key]) return;

      if (
        characterOverviewDone &&
        (shaped.target === "characterIdentityPath" || shaped.label === "Who are the Characters?")
      ) {
        return;
      }

      seen[key] = true;
      result.push(shaped);
    });

    return result;
  }

  function inferOptionType(target) {
    var clean = normalizeTarget(target);

    if (
      clean === "cleanDoor" ||
      clean === "recenterNode" ||
      clean === "switchTopics" ||
      clean === "sharpQuestion" ||
      clean === "returnFork" ||
      clean === "originReturn" ||
      clean === "originReturnPath" ||
      clean === "priorTopicReturn" ||
      clean === "priorTopicReturnPath"
    ) {
      return "control";
    }

    return "conversation";
  }

  function inferScopeLane(target) {
    var room = getRoomForTarget(target);
    if (!room) return SCOPE_OBJECTIVE;

    if (
      room.cardinal === AXIS_SOUTH ||
      room.cardinal === AXIS_EAST ||
      room.cardinal === AXIS_SOUTHEAST ||
      room.cardinal === AXIS_SOUTHWEST ||
      room.cardinal === AXIS_WEST_SOUTH
    ) {
      return SCOPE_NARRATIVE;
    }

    return SCOPE_OBJECTIVE;
  }

  function inferSignal(target) {
    var room = getRoomForTarget(target);

    if (!room) return "orientation";
    if (room.id === "characterArchetypeMirror") return "archetype";
    if (room.id === "characters" || room.id === "characterDetails") return "characters";
    if (room.cardinal === AXIS_SOUTH) return "mirrorland";
    if (room.cardinal === AXIS_EAST || room.cardinal === AXIS_SOUTHEAST) return "future";
    if (room.cardinal === AXIS_WEST || room.cardinal === AXIS_WEST_SOUTH) return "proof";
    if (room.cardinal === AXIS_NORTH) return "orientation";
    return "orientation";
  }

  function shapeRouteLabel(routeId, fallback) {
    var clean = normalizeRoute(routeId);
    return ROUTE_LABELS[clean] || fallback || "Open route";
  }

  function makeOriginIntro(context) {
    var ctx = context || {};
    var currentRoom = getCurrentRoom(ctx);
    var priorAvailable = Boolean(ctx.priorTopic || ctx.priorNode || ctx.returnStackLength);
    var originAvailable = Boolean(ctx.originConversation || ctx.hasOrigin || ctx.returnStackLength);
    var beats = [
      "Welcome to the estate. I’m Jeeves.",
      "This is the First Fork, the starting point for every conversation inside Diamond Gate Bridge.",
      "The rooms are not arranged like a flat menu. They are arranged like a narrative blueprint, so you learn where proof, source, future systems, Mirrorland, and character pressure sit in relation to one another."
    ];

    if (currentRoom && currentRoom.id === "hearthProductionChamber") {
      beats.push("Right now, we are in the Hearth Production Chamber. It belongs to the eastern future side because this is where the Jeeves template is being stabilized before Compass receives it.");
    } else if (currentRoom && currentRoom.id !== "firstFork") {
      beats.push("Right now, we are speaking from " + currentRoom.canonicalName + ". " + describeNearbyRooms(currentRoom, ctx));
    }

    return {
      beats: beats.map(function cleanBeat(beat) {
        return sanitizePublicText(beat, ctx);
      }),
      options: makeOriginOptions({
        priorAvailable: priorAvailable,
        originAvailable: originAvailable
      }, ctx)
    };
  }

  function makeOriginOptions(flags, context) {
    var options = [
      { label: "Let’s begin with orientation.", target: "compassPath", type: "conversation" },
      { label: "Let’s test what makes it trustworthy.", target: "scientificLawPath", type: "conversation" },
      { label: "Show me the future-facing rooms.", target: "frontierPath", type: "conversation" },
      { label: "Let’s enter Mirrorland.", target: "mirrorlandPath", type: "conversation" },
      { label: "Introduce me to the human source.", target: "seanPath", type: "conversation" },
      { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath", type: "conversation" }
    ];

    if (flags && flags.priorAvailable) {
      options.push({ label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" });
    }

    if (flags && flags.originAvailable) {
      options.push({ label: "Return to origin conversation.", target: "originReturnPath", type: "control" });
    }

    return shapeOptions(options, context);
  }

  function makeCurrentRoomLine(context) {
    var room = getCurrentRoom(context);

    if (!room || room.id === "firstFork") {
      return "We are at the First Fork.";
    }

    return "We are in " + room.canonicalName + ". " + describeNearbyRooms(room, context);
  }

  function makeRoomAwareTransition(context) {
    var room = getCurrentRoom(context);

    if (!room) {
      return "We can return to the First Fork, choose a new direction, or continue down this path.";
    }

    return room.canonicalName + " is not isolated. " + describeNearbyRooms(room, context);
  }

  function makeDirectionalFork(context) {
    return {
      beats: [
        makeCurrentRoomLine(context),
        "The next door depends on what you want this room to become: orientation, proof, future systems, or Mirrorland."
      ],
      options: shapeOptions([
        { label: "Let’s begin with orientation.", target: "compassPath" },
        { label: "Let’s test what makes it trustworthy.", target: "scientificLawPath" },
        { label: "Show me the future-facing rooms.", target: "frontierPath" },
        { label: "Let’s enter Mirrorland.", target: "mirrorlandPath" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control" }
      ], context)
    };
  }

  function makeReturnExpression(kind, context) {
    var ctx = context || {};
    var currentRoom = getCurrentRoom(ctx);
    var priorName = ctx.priorTopicName || ctx.priorTopic || ctx.priorNode || "the prior topic";

    if (kind === "prior" || kind === "priorTopicReturn" || kind === "priorTopicReturnPath") {
      return {
        beats: [
          "We can return to " + priorName + ".",
          "Nothing is lost. We are only stepping off this path and returning to the last thread."
        ].map(function cleanBeat(beat) {
          return sanitizePublicText(beat, ctx);
        }),
        options: shapeOptions([
          { label: "Return to prior topic.", target: ctx.priorNode || "returnFork", type: "control" },
          { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
          { label: "Stay with this room.", target: ctx.currentNode || "cleanDoor", type: "conversation" },
          { label: "Help me choose the next door.", target: "cleanDoor", type: "control" }
        ], ctx)
      };
    }

    if (kind === "origin" || kind === "originReturn" || kind === "originReturnPath") {
      return {
        beats: [
          "We are back at the origin conversation.",
          "This is the First Fork. From here, the estate becomes readable again because each wing has a different narrative job."
        ],
        options: makeOriginOptions({
          priorAvailable: Boolean(ctx.priorTopic || ctx.priorNode),
          originAvailable: false
        }, ctx)
      };
    }

    return {
      beats: [
        currentRoom ? "You are in " + currentRoom.canonicalName + "." : "You are at the First Fork.",
        "You can return to the prior topic, return to the origin conversation, or let me choose the next door with you."
      ],
      options: shapeOptions([
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
        { label: "Help me choose the next door.", target: "cleanDoor", type: "control" }
      ], ctx)
    };
  }

  function makeCharacterOverview(context) {
    var ctx = context || {};
    var alreadyIntroduced = Boolean(ctx.characterOverviewDone || ctx.hasSeenCharacterOverview);

    if (alreadyIntroduced) {
      return {
        beats: [
          "Now that you know who the Characters are, we can stop circling the doorway.",
          "Choose a person to meet, or let me show how their pressure lines connect."
        ],
        options: makeCharacterRosterOptions(ctx)
      };
    }

    return {
      beats: [
        "The Characters are where Mirrorland becomes personal.",
        "They are not labels. They are pressure carriers: protection, repair, warning, endurance, signal, boundary, guided entry, and distributed response.",
        "Before you meet one directly, let me place the group for you. The Characters sit near Mirrorland because they make the future window feel alive, and they sit near the Character Archetype Mirror because their pressure patterns can reflect the visitor’s own behavior under pressure."
      ].map(function cleanBeat(beat) {
        return sanitizePublicText(beat, ctx);
      }),
      options: makeCharacterRosterOptions(ctx)
    };
  }

  function makeCharacterRosterOptions(context) {
    return shapeOptions([
      { label: "Meet Auren Vale.", target: "characterAurenValePath" },
      { label: "Meet Dextrion.", target: "characterDextrionPath" },
      { label: "Meet Alaric.", target: "characterAlaricPath" },
      { label: "Meet Tarian.", target: "characterTarianPath" },
      { label: "Meet Elara.", target: "characterElaraPath" },
      { label: "Meet Soren.", target: "characterSorenPath" },
      { label: "Tell me about Jeeves.", target: "characterJeevesPath" },
      { label: "Meet the Remote Team.", target: "characterRemoteTeamPath" },
      { label: "Show how the Characters relate.", target: "characterRelationshipsPath" },
      { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath" }
    ], context);
  }

  function makeCharacterProfile(characterId, context) {
    var profile = CHARACTER_PROFILES[characterId];

    if (!profile) {
      return makeCharacterOverview(context);
    }

    return {
      beats: [
        profile.name + " — " + profile.title + ".",
        profile.oneLine,
        profile.pressureLine,
        profile.profileLine
      ].map(function cleanBeat(beat) {
        return sanitizePublicText(beat, context);
      }),
      options: shapeOptions([
        { label: "Meet another Character.", target: "charactersPath" },
        { label: "Show how the Characters relate.", target: "characterRelationshipsPath" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath" },
        { label: "Let’s enter Mirrorland.", target: "mirrorlandPath" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" }
      ], context)
    };
  }

  function isCharacterCompletionReady(context) {
    var ctx = context || {};
    var views = Number(ctx.characterProfileViewCount || 0);
    var relationships = Number(ctx.characterRelationshipViews || 0);
    var loops = Number(ctx.characterLoopCount || 0);

    return views >= 3 || views + relationships + loops >= 3 || Boolean(ctx.characterCompletionReady);
  }

  function makeCharacterCompletionCue(context) {
    if (!isCharacterCompletionReady(context)) {
      return {
        beats: [],
        options: []
      };
    }

    return {
      beats: [
        "You can keep asking me about them here.",
        "But if you are ready, Mirrorland is where this changes from explanation into encounter. As the digital agents come online, you will be able to communicate with the Characters directly inside Mirrorland."
      ].map(function cleanBeat(beat) {
        return sanitizePublicText(beat, context);
      }),
      options: shapeOptions([
        { label: "Let’s enter Mirrorland.", target: "mirrorlandPath" },
        { label: "Keep asking about the Characters.", target: "charactersPath" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath" },
        { label: "Return to the First Fork.", target: "returnFork", type: "control" }
      ], context)
    };
  }

  function makeCharacterArchetypeIntro(context) {
    return {
      beats: [
        "We can use the Character Archetype Mirror.",
        "It does not tell you who you are. It looks at how you tend to behave under pressure, then shows which character pattern you are currently following.",
        "This bridge sits between proof and Mirrorland because self-reflection should become story only after it remains honest."
      ].map(function cleanBeat(beat) {
        return sanitizePublicText(beat, context);
      }),
      options: shapeOptions([
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeQuestionOne" },
        { label: "Show my behavior under pressure.", target: "characterArchetypeQuestionOne" },
        { label: "Introduce the Characters first.", target: "charactersPath" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control" }
      ], context)
    };
  }

  function makeCharacterArchetypeQuestion(questionIndex, context) {
    if (questionIndex === 2) {
      return {
        beats: [
          "Second question.",
          "When pressure rises, what do you rely on next?"
        ],
        options: shapeOptions([
          { label: "A clear sequence and controlled timing.", target: "characterArchetypeQuestionThree" },
          { label: "Visible action or repair.", target: "characterArchetypeQuestionThree" },
          { label: "Stability and continuity.", target: "characterArchetypeQuestionThree" },
          { label: "Evidence, contradiction, and proof.", target: "characterArchetypeQuestionThree" },
          { label: "A signal that gives people hope.", target: "characterArchetypeQuestionThree" }
        ], context)
      };
    }

    if (questionIndex === 3) {
      return {
        beats: [
          "Third question.",
          "What usually becomes your risk when the pressure gets too high?"
        ],
        options: shapeOptions([
          { label: "I overprotect or hide too much.", target: "characterArchetypeResult" },
          { label: "I try to fix everything too fast.", target: "characterArchetypeResult" },
          { label: "I see danger before people believe me.", target: "characterArchetypeResult" },
          { label: "I keep carrying more than I can sustain.", target: "characterArchetypeResult" },
          { label: "I need the truth named before I can move.", target: "characterArchetypeResult" }
        ], context)
      };
    }

    return {
      beats: [
        "First question.",
        "When pressure rises, what do you usually notice first?"
      ],
      options: shapeOptions([
        { label: "Who needs protection?", target: "characterArchetypeQuestionTwo" },
        { label: "What is broken and needs repair?", target: "characterArchetypeQuestionTwo" },
        { label: "Where danger is forming early.", target: "characterArchetypeQuestionTwo" },
        { label: "What the body or situation can actually endure.", target: "characterArchetypeQuestionTwo" },
        { label: "What truth or hidden cost is being avoided.", target: "characterArchetypeQuestionTwo" }
      ], context)
    };
  }

  function makeFrontierDirectionalLine(context) {
    return sanitizePublicText(
      "Frontier belongs to the eastern future side of the estate because it tests what future worlds may need before those systems are treated as finished.",
      context
    );
  }

  function makeHearthProductionLine(context) {
    return sanitizePublicText(
      "We are in the Hearth Production Chamber right now. This room belongs near Hearth because the house-conversation logic is being stabilized before Compass receives it.",
      context
    );
  }

  function makeCompassDeploymentLine(context) {
    return sanitizePublicText(
      "Compass will become the public orientation point. Once Jeeves is there, visitors can talk to the house and begin to understand which rooms sit close together and why.",
      context
    );
  }

  function makeEndpointShortcutLine(context) {
    return sanitizePublicText(
      "You can start down one path and still reach the endpoint faster by crossing to a room that sits closer to the meaning you are actually looking for.",
      context
    );
  }

  function applyToNode(node, context) {
    var next = clone(node || {});
    var ctx = context || {};

    if (Array.isArray(next.beats)) {
      next.beats = next.beats.map(function eachBeat(beat) {
        return sanitizePublicText(beat, ctx);
      });
    }

    if (Array.isArray(next.bubbles)) {
      next.bubbles = next.bubbles.map(function eachBubble(bubble) {
        return sanitizePublicText(bubble, ctx);
      });
    }

    if (Array.isArray(next.options)) {
      next.options = shapeOptions(next.options, ctx);
    }

    if (Array.isArray(next.handoffs)) {
      next.handoffLabels = {};
      next.handoffs.forEach(function eachHandoff(routeId) {
        next.handoffLabels[routeId] = shapeRouteLabel(routeId);
      });
    }

    return next;
  }

  function describePath(target, context) {
    var room = getRoomForTarget(target);

    if (!room) {
      return "This path returns to the First Fork.";
    }

    return sanitizePublicText(
      describeRoomPlacement(room, context) + " " + describeNearbyRooms(room, context),
      context
    );
  }

  function getDirectionalOptions(context) {
    return shapeOptions([
      { label: "Let’s begin with orientation.", target: "compassPath" },
      { label: "Let’s test what makes it trustworthy.", target: "scientificLawPath" },
      { label: "Show me the future-facing rooms.", target: "frontierPath" },
      { label: "Let’s enter Mirrorland.", target: "mirrorlandPath" }
    ], context);
  }

  function getReturnOptions(context) {
    return shapeOptions([
      { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
      { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
      { label: "Return to the First Fork.", target: "returnFork", type: "control" },
      { label: "Help me choose the next door.", target: "cleanDoor", type: "control" }
    ], context);
  }

  function createRoomDescriptor(roomId) {
    var room = getRoom(roomId);

    if (!room) return null;

    return {
      id: room.id,
      canonicalName: room.canonicalName,
      urbanName: room.urbanName,
      coordinateName: room.coordinateName,
      cardinal: room.cardinal,
      cardinalName: getAxis(room.cardinal).name,
      placeType: room.placeType,
      placeMeaning: PLACE_TYPES[room.placeType] || "place",
      indoorOutdoor: room.indoorOutdoor,
      role: room.role,
      narrativeReason: room.narrativeReason,
      proximityMeaning: room.proximityMeaning,
      speechRole: room.speechRole,
      routeId: room.routeId,
      target: room.target,
      returnParent: room.returnParent,
      originAnchor: room.originAnchor,
      nearRooms: room.nearRooms ? room.nearRooms.slice() : [],
      bridgeRooms: room.bridgeRooms ? room.bridgeRooms.slice() : []
    };
  }

  function createTargetDescriptor(target) {
    var normalized = normalizeTarget(target);
    var room = getRoomForTarget(normalized);

    return {
      target: normalized,
      label: PUBLIC_LABELS[normalized] || "Let’s continue.",
      room: room ? createRoomDescriptor(room.id) : createRoomDescriptor("firstFork"),
      scopeLane: inferScopeLane(normalized),
      signal: inferSignal(normalized)
    };
  }

  function expose() {
    var api = {
      contract: CONTRACT,

      axes: NEWS_AXES,
      placeTypes: PLACE_TYPES,
      rooms: ROOMS,
      targetRoomMap: TARGET_ROOM_MAP,
      targetAliases: TARGET_ALIASES,
      routeAliases: ROUTE_ALIASES,
      characterProfiles: CHARACTER_PROFILES,
      publicLabels: PUBLIC_LABELS,
      routeLabels: ROUTE_LABELS,

      normalizeTarget: normalizeTarget,
      normalizeRoute: normalizeRoute,
      sanitizePublicText: sanitizePublicText,
      shapeLabel: shapeLabel,
      shapeOption: shapeOption,
      shapeOptions: shapeOptions,
      shapeRouteLabel: shapeRouteLabel,

      describeRoomPlacement: describeRoomPlacement,
      describeNearbyRooms: describeNearbyRooms,
      makeGuidedMovementLine: makeGuidedMovementLine,
      makePlacementBeat: makePlacementBeat,

      getAxis: function getAxisPublic(cardinal) {
        return clone(getAxis(cardinal));
      },
      getRoom: function getRoomPublic(roomId) {
        return clone(getRoom(roomId));
      },
      getRoomForTarget: function getRoomForTargetPublic(target) {
        return clone(getRoomForTarget(target));
      },
      getCurrentRoom: function getCurrentRoomPublic(context) {
        return clone(getCurrentRoom(context));
      },
      getCoordinateName: getCoordinateName,
      createRoomDescriptor: createRoomDescriptor,
      createTargetDescriptor: createTargetDescriptor,
      describePath: describePath,

      makeOriginIntro: makeOriginIntro,
      makeOriginOptions: makeOriginOptions,
      makeCurrentRoomLine: makeCurrentRoomLine,
      makeRoomAwareTransition: makeRoomAwareTransition,
      makeDirectionalFork: makeDirectionalFork,
      makeReturnExpression: makeReturnExpression,
      getDirectionalOptions: getDirectionalOptions,
      getReturnOptions: getReturnOptions,

      makeCharacterOverview: makeCharacterOverview,
      makeCharacterProfile: makeCharacterProfile,
      makeCharacterCompletionCue: makeCharacterCompletionCue,
      isCharacterCompletionReady: isCharacterCompletionReady,
      makeCharacterArchetypeIntro: makeCharacterArchetypeIntro,
      makeCharacterArchetypeQuestion: makeCharacterArchetypeQuestion,
      makeCharacterRosterOptions: makeCharacterRosterOptions,

      makeFrontierDirectionalLine: makeFrontierDirectionalLine,
      makeHearthProductionLine: makeHearthProductionLine,
      makeCompassDeploymentLine: makeCompassDeploymentLine,
      makeEndpointShortcutLine: makeEndpointShortcutLine,

      applyToNode: applyToNode
    };

    global.HEARTH = global.HEARTH || {};
    global.HEARTH.JEEVES = global.HEARTH.JEEVES || {};
    global.HEARTH.JEEVES.expression = api;
    global.HEARTH.JEEVES_EXPRESSION = api;
    global.JEEVES_EXPRESSION = api;
    global.__HEARTH_JEEVES_EXPRESSION_LOADED__ = true;
    global.__HEARTH_JEEVES_EXPRESSION_CONTRACT__ = CONTRACT;

    if (typeof module !== "undefined" && module.exports) {
      module.exports = api;
      module.exports.default = api;
    }
  }

  expose();
})(typeof window !== "undefined" ? window : globalThis);
