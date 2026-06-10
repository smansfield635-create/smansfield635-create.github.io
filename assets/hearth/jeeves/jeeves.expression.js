// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_ENGINE_NEWS_URBAN_RETURN_CONSTRUCT_TNT_v1
// Full-file replacement.
// Browser-safe expression authority.
// Owns: Jeeves public speech shaping, First Fork origin language, room-aware phrasing,
// NEWS urban coordinate language, return-to-prior-topic phrasing, origin-return phrasing,
// Character Archetype Mirror wording, character social cues, public-safe labels,
// option-label shaping, and non-redundant conversational expression.
// Does not own: DOM rendering, CSS, prompt dock behavior, tap-to-advance,
// route execution, API calls, model bridge, server-side moderation, or final runtime state.
//

(function hearthJeevesExpressionEngineNewsUrbanReturnConstruct(global) {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_EXPRESSION_ENGINE_NEWS_URBAN_RETURN_CONSTRUCT_TNT_v1";

  var AXIS_CENTER = "C";
  var AXIS_NORTH = "N";
  var AXIS_EAST = "E";
  var AXIS_WEST = "W";
  var AXIS_SOUTH = "S";
  var AXIS_NORTHEAST = "NE";
  var AXIS_NORTHWEST = "NW";
  var AXIS_SOUTHEAST = "SE";
  var AXIS_SOUTHWEST = "SW";
  var AXIS_WEST_SOUTH = "WS";
  var AXIS_SOUTH_NORTH = "SN";

  var SCOPE_OBJECTIVE = "objective";
  var SCOPE_NARRATIVE = "narrative";

  var MODE_OBJECTIVE = "objective";
  var MODE_THRESHOLD = "threshold";
  var MODE_IMMERSION = "immersion";
  var MODE_CHARACTER_ARCHETYPE = "characterArchetype";

  var DEFAULT_CURRENT_ROOM_ID = "hearthProductionChamber";
  var DEFAULT_ORIGIN_ANCHOR = "firstFork";

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
      name: "Center",
      role: "origin and central return",
      publicLine: "Center is the origin point where the conversation can restart without losing the trail."
    },
    N: {
      cardinal: AXIS_NORTH,
      name: "North",
      role: "orientation, source, command, and starting clarity",
      publicLine: "North is direction and source."
    },
    E: {
      cardinal: AXIS_EAST,
      name: "East",
      role: "future systems, construction, testing, and becoming",
      publicLine: "East is future systems and construction."
    },
    W: {
      cardinal: AXIS_WEST,
      name: "West",
      role: "truth, proof, correction, reflection, and boundaries",
      publicLine: "West is truth and proof."
    },
    S: {
      cardinal: AXIS_SOUTH,
      name: "South",
      role: "Mirrorland, depth, character encounter, and story immersion",
      publicLine: "South is Mirrorland and depth."
    },
    NE: {
      cardinal: AXIS_NORTHEAST,
      name: "Northeast",
      role: "public value and usable expression",
      publicLine: "Northeast turns meaning into something usable."
    },
    NW: {
      cardinal: AXIS_NORTHWEST,
      name: "Northwest",
      role: "source-to-proof crossing",
      publicLine: "Northwest connects source to verification."
    },
    SE: {
      cardinal: AXIS_SOUTHEAST,
      name: "Southeast",
      role: "future world, Audralia, and constructive possibility",
      publicLine: "Southeast carries constructive future."
    },
    SW: {
      cardinal: AXIS_SOUTHWEST,
      name: "Southwest",
      role: "consequence, warning, and hidden cost",
      publicLine: "Southwest carries consequence."
    },
    WS: {
      cardinal: AXIS_WEST_SOUTH,
      name: "West-South",
      role: "reflection bridge between proof and character depth",
      publicLine: "West-South lets self-reflection cross into character meaning."
    },
    SN: {
      cardinal: AXIS_SOUTH_NORTH,
      name: "South-North",
      role: "value road between personal depth and source",
      publicLine: "South-North carries value back toward source."
    }
  };

  var PLACE_TYPES = {
    gate: "entry point",
    fork: "decision point",
    bridge: "crossing between major zones",
    road: "main directional route",
    lane: "narrower themed path",
    alley: "deeper intimate path",
    hall: "formal interior place",
    chamber: "focused room",
    yard: "outside testing or building area",
    deck: "control or readout area",
    library: "truth or archive area",
    atrium: "threshold interior/exterior hybrid",
    desk: "working guidance point",
    gallery: "usable public display",
    window: "future-facing reveal",
    room: "defined estate space"
  };

  var ROOMS = {
    jeevesInterface: {
      id: "jeevesInterface",
      canonicalName: "Jeeves Interface",
      urbanName: "Front Gate",
      coordinateName: "Front Gate",
      cardinal: AXIS_CENTER,
      placeType: "gate",
      indoorOutdoor: "inside",
      role: "Jeeves receives the visitor and opens the estate.",
      speechRole: "origin voice",
      routeId: "jeeves",
      target: "intro",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["firstFork", "northFork", "northMapHall", "southGate"],
      bridgeRooms: ["northBridge", "southBridge", "westBridge", "eastBridge"],
      stabilizationRole: "Keeps Jeeves anchored as the house voice rather than a generic chatbox."
    },
    firstFork: {
      id: "firstFork",
      canonicalName: "First Fork",
      urbanName: "First Fork",
      coordinateName: "First Fork",
      cardinal: AXIS_CENTER,
      placeType: "fork",
      indoorOutdoor: "hybrid",
      role: "Starting point for every conversation.",
      speechRole: "origin construct",
      routeId: "jeeves",
      target: "intro",
      returnParent: "",
      originAnchor: "firstFork",
      nearRooms: ["frontGate", "northFork", "westLibrary", "eastYard", "southGate"],
      bridgeRooms: ["northBridge", "eastBridge", "westBridge", "southBridge"],
      stabilizationRole: "Lets every conversation return, branch, or cross without losing orientation."
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
      speechRole: "production guide",
      routeId: "hearth",
      target: "hearthPath",
      returnParent: "hearth",
      originAnchor: "firstFork",
      nearRooms: ["eastYard", "hearth", "westProofChamber", "northFork"],
      bridgeRooms: ["eastBridge", "westProofBridge", "northReturn"],
      deploymentTarget: "compassPage",
      stabilizationRole: "Current working room for building the Jeeves template before moving it to Compass."
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
      speechRole: "direction guide",
      routeId: "compass",
      target: "compassPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["frontGate", "northMapHall", "northSourceHall", "westLibrary", "southGate"],
      bridgeRooms: ["northBridge", "westBridge", "southBridge"],
      stabilizationRole: "Gives the visitor direction before depth."
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
      speechRole: "map guide",
      routeId: "siteGuide",
      target: "siteGuidePath",
      returnParent: "compassDesk",
      originAnchor: "firstFork",
      nearRooms: ["northFork", "centerHall", "southMapHall", "westLibrary"],
      bridgeRooms: ["northBridge", "southBridge"],
      stabilizationRole: "Makes the estate readable without forcing a path."
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
      speechRole: "public center",
      routeId: "home",
      target: "websitePath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["frontGate", "northFork", "productGallery", "southGate"],
      bridgeRooms: ["northBridge", "eastBridge", "westBridge", "southBridge"],
      stabilizationRole: "Keeps the public site familiar before immersion."
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
      speechRole: "source chamber",
      routeId: "meetSean",
      target: "seanPath",
      returnParent: "northFork",
      originAnchor: "firstFork",
      nearRooms: ["northFork", "northInnerLane", "summitRoad", "westLibrary"],
      bridgeRooms: ["northBridge", "southNorthBridge", "northwestProofBridge"],
      stabilizationRole: "Shows the human source without replacing proof."
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
      speechRole: "inner voice lane",
      routeId: "aboutUnderdog",
      target: "underdogPath",
      returnParent: "meetSean",
      originAnchor: "firstFork",
      nearRooms: ["northSourceHall", "westSouthMirrorBridge", "summitRoad"],
      bridgeRooms: ["southNorthBridge", "westSouthMirrorBridge"],
      stabilizationRole: "Turns source into personal recognition."
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
      speechRole: "usable value gallery",
      routeId: "products",
      target: "productsPath",
      returnParent: "mainHall",
      originAnchor: "firstFork",
      nearRooms: ["centerHall", "summitRoad", "northSourceHall"],
      bridgeRooms: ["northBridge", "eastBridge"],
      stabilizationRole: "Turns meaning into something the visitor can use."
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
      speechRole: "truth keeper",
      routeId: "laws",
      target: "lawsPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["westProofChamber", "westGaugeRoom", "westMirrorDesk", "northFork"],
      bridgeRooms: ["westBridge", "northwestProofBridge", "westSouthMirrorBridge"],
      stabilizationRole: "Keeps claims from outrunning truth."
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
      speechRole: "proof chamber",
      routeId: "scientificLaw",
      target: "scientificLawPath",
      returnParent: "lawLibrary",
      originAnchor: "firstFork",
      nearRooms: ["westLibrary", "westGaugeRoom", "eastYard", "hearthProductionChamber"],
      bridgeRooms: ["westBridge", "eastProofBridge", "westSouthMirrorBridge"],
      stabilizationRole: "Separates technical-sounding language from what can be tested."
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
      speechRole: "status room",
      routeId: "gauges",
      target: "gaugesPath",
      returnParent: "scientificLaw",
      originAnchor: "firstFork",
      nearRooms: ["westProofChamber", "westLibrary", "eastYard"],
      bridgeRooms: ["westBridge", "eastProofBridge"],
      stabilizationRole: "Shows what is working, held, forming, or unproven."
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
      speechRole: "reflection desk",
      routeId: "coherenceDiagnostic",
      target: "diagnosticPath",
      returnParent: "westLibrary",
      originAnchor: "firstFork",
      nearRooms: ["westSouthMirrorBridge", "westProofChamber", "northInnerLane"],
      bridgeRooms: ["westSouthMirrorBridge"],
      stabilizationRole: "Reflects behavior without diagnosing identity."
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
      speechRole: "archetype mirror",
      routeId: "coherenceDiagnostic",
      target: "characterArchetypeMirrorPath",
      returnParent: "diagnostic",
      originAnchor: "firstFork",
      nearRooms: ["westMirrorDesk", "southCharacterLane", "northInnerLane", "summitRoad"],
      bridgeRooms: ["westSouthMirrorBridge", "southBridge", "westBridge"],
      stabilizationRole: "Shows which Character Archetype the visitor tends to follow under pressure."
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
      speechRole: "systems yard",
      routeId: "frontier",
      target: "frontierPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["eastConstructChamber", "southeastConservatory", "westProofChamber"],
      bridgeRooms: ["eastBridge", "eastProofBridge", "southeastBridge"],
      stabilizationRole: "Tests what the future needs."
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
      speechRole: "construct chamber",
      routeId: "hearth",
      target: "hearthPath",
      returnParent: "frontier",
      originAnchor: "firstFork",
      nearRooms: ["eastYard", "hearthProductionChamber", "southeastWorldroom", "westProofChamber"],
      bridgeRooms: ["eastBridge", "eastProofBridge", "southeastBridge"],
      stabilizationRole: "Makes planetary construction a named place, not a floating idea."
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
      speechRole: "future world hall",
      routeId: "audralia",
      target: "audraliaPath",
      returnParent: "atlasStudy",
      originAnchor: "firstFork",
      nearRooms: ["southeastWorldroom", "eastYard", "southWindow", "southCharacterLane"],
      bridgeRooms: ["southeastBridge", "southBridge", "eastBridge"],
      stabilizationRole: "Carries constructive future possibility."
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
      speechRole: "worldroom",
      routeId: "audraliaWorldroom",
      target: "audraliaWorldroomPath",
      returnParent: "audralia",
      originAnchor: "firstFork",
      nearRooms: ["southeastConservatory", "eastControlDeck", "eastConstructChamber"],
      bridgeRooms: ["southeastBridge", "eastBridge"],
      stabilizationRole: "Makes Audralia visible enough to inspect."
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
      speechRole: "control deck",
      routeId: "controlCockpit",
      target: "controlCockpitPath",
      returnParent: "audraliaWorldroom",
      originAnchor: "firstFork",
      nearRooms: ["eastSouthWorldroom", "eastConstructChamber", "westGaugeRoom"],
      bridgeRooms: ["eastBridge", "eastProofBridge"],
      stabilizationRole: "Makes world state readable."
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
      speechRole: "south threshold",
      routeId: "showroom",
      target: "atriumPath",
      returnParent: "firstFork",
      originAnchor: "firstFork",
      nearRooms: ["southWindow", "southMapHall", "southCharacterLane", "centerHall"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"],
      stabilizationRole: "Turns the website into an immersive threshold."
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
      speechRole: "future window",
      routeId: "mirrorland",
      target: "mirrorlandPath",
      returnParent: "atrium",
      originAnchor: "firstFork",
      nearRooms: ["southGate", "southMapHall", "southCharacterLane", "southeastConservatory", "southwestConsequenceRoad"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"],
      stabilizationRole: "Makes possible futures visible before final."
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
      speechRole: "south map hall",
      routeId: "mirrorland",
      target: "atlasPath",
      returnParent: "atrium",
      originAnchor: "firstFork",
      nearRooms: ["southGate", "southWindow", "southeastConservatory", "southwestConsequenceRoad"],
      bridgeRooms: ["southBridge", "southeastBridge", "southwestBridge"],
      stabilizationRole: "Gives Mirrorland coordinates."
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
      speechRole: "character lane",
      routeId: "characters",
      target: "charactersPath",
      returnParent: "mirrorland",
      originAnchor: "firstFork",
      nearRooms: ["southWindow", "southCharacterAlley", "westSouthMirrorBridge", "southeastConservatory"],
      bridgeRooms: ["southBridge", "westSouthMirrorBridge", "southeastBridge"],
      stabilizationRole: "Lets the character profiles carry depth without over-explaining."
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
      speechRole: "character alley",
      routeId: "characters",
      target: "characterIdentityPath",
      returnParent: "characters",
      originAnchor: "firstFork",
      nearRooms: ["southCharacterLane", "westSouthMirrorBridge", "southWindow"],
      bridgeRooms: ["southBridge", "westSouthMirrorBridge"],
      stabilizationRole: "Keeps individual character discussion available without trapping the visitor."
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
      speechRole: "consequence road",
      routeId: "zionts",
      target: "ziontsPath",
      returnParent: "atlasStudy",
      originAnchor: "firstFork",
      nearRooms: ["southMapHall", "southWindow", "westLibrary", "southCharacterLane"],
      bridgeRooms: ["southwestBridge", "westBridge"],
      stabilizationRole: "Keeps consequence present in the future map."
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
      speechRole: "summit road",
      routeId: "nineSummits",
      target: "nineSummitsPath",
      returnParent: "meetSean",
      originAnchor: "firstFork",
      nearRooms: ["northSourceHall", "northInnerLane", "westSouthMirrorBridge", "productGallery"],
      bridgeRooms: ["southNorthBridge", "northBridge"],
      stabilizationRole: "Connects value, source, and personal development."
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
    intro: "First Fork.",
    askFirst: "Ask me one question first.",
    returnFork: "Return to the First Fork.",
    originReturn: "Return to origin conversation.",
    originReturnPath: "Return to origin conversation.",
    priorTopicReturn: "Return to prior topic.",
    priorTopicReturnPath: "Return to prior topic.",
    websitePath: "Show me around the estate.",
    compassPath: "Take me north to orientation.",
    siteGuidePath: "Open the North Map Hall.",
    proofPath: "Take me west to proof.",
    skepticPlain: "Explain it plainly.",
    lawsPath: "Open the West Library.",
    scientificLawPath: "Open the West Proof Chamber.",
    gaugesPath: "Open the West Gauge Room.",
    diagnosticPath: "Open the West Mirror Desk.",
    characterArchetypeMirrorPath: "Which Character Archetype do I follow under pressure?",
    selfLearningPath: "Show my behavior under pressure.",
    seanPath: "Meet Sean.",
    underdogPath: "This Underdog.",
    productsPath: "Open the Northeast Market Hall.",
    bookPath: "Open The Nine Summits of Love.",
    nineSummitsPath: "Take me to Summit Road.",
    mirrorlandPath: "Take me south into Mirrorland.",
    atriumPath: "Enter the South Gate.",
    atlasPath: "Open the South Map Hall.",
    hearthPath: "Open the East Construct Chamber.",
    hearthFacilityPath: "Explain Hearth as a facility.",
    hearthConstructPath: "Explain Hearth as a planetary construct engine.",
    hearthFrontierPath: "Cross from Hearth to Frontier.",
    hearthLawPath: "Cross from Hearth to Scientific Law.",
    hearthProductionPath: "Return to the Hearth Production Chamber.",
    ziontsPath: "Take me down Southwest Consequence Road.",
    audraliaPath: "Open the Southeast Conservatory.",
    audraliaWorldroomPath: "Open the East-South Worldroom.",
    controlCockpitPath: "Open the East Control Deck.",
    frontierPath: "Take me east to Frontier.",
    frontierSystemsPath: "Show the East Yard systems.",
    frontierEnergyPath: "Open Energy.",
    frontierWaterPath: "Open Water.",
    frontierWastePath: "Open Waste.",
    frontierClosedLoopPath: "Open Closed Loop.",
    frontierInfrastructurePath: "Open Infrastructure.",
    frontierLatticePath: "Open Lattice.",
    frontierUrbanPath: "Open Urban.",
    frontierManualPath: "Open Manual.",
    frontierShimmerPath: "Open Shimmer.",
    frontierTrajectoryPath: "Open Trajectory.",
    frontierVisionPath: "Open Vision.",
    frontierLawPath: "Cross west to Scientific Law.",
    frontierCharactersPath: "Meet the Characters through Frontier.",
    charactersPath: "Meet the Characters.",
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
    cleanDoor: "Choose the next door.",
    switchTopics: "Switch topics.",
    sharpQuestion: "Ask me a sharper question.",
    recenterNode: "Re-center me."
  };

  var ROUTE_LABELS = {
    compass: "Open North Fork",
    home: "Open Center Hall",
    siteGuide: "Open North Map Hall",
    coherenceDiagnostic: "Open West Mirror Desk",
    meetSean: "Open North Source Hall",
    products: "Open Northeast Market Hall",
    laws: "Open West Library",
    scientificLaw: "Open West Proof Chamber",
    gauges: "Open West Gauge Room",
    showroom: "Enter South Gate",
    hearth: "Open East Construct Chamber",
    mirrorland: "Open South Window",
    interactiveNarrative: "Enter Mirrorland",
    audralia: "Open Southeast Conservatory",
    audraliaWorldroom: "Open East-South Worldroom",
    controlCockpit: "Open East Control Deck",
    zionts: "Open Southwest Consequence Road",
    frontier: "Open East Yard",
    characters: "Open South Character Lane",
    book: "Open Summit Road",
    nineSummits: "Open Summit Road",
    aboutUnderdog: "Open North Inner Lane"
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

  function shapeLabel(label, target, context) {
    var cleanTarget = normalizeTarget(target);
    var clean = String(label || "").trim();

    if (!clean) {
      clean = PUBLIC_LABELS[cleanTarget] || "Choose this path.";
    }

    clean = clean.replace(/^Tell me about the world side\.?$/i, "Take me south into Mirrorland.");
    clean = clean.replace(/^I want the world side\.?$/i, "Take me south into Mirrorland.");
    clean = clean.replace(/^Which character am I most like\??$/i, "Which Character Archetype do I follow under pressure?");
    clean = clean.replace(/^Help me learn about myself\.?$/i, "Show my behavior under pressure.");
    clean = clean.replace(/^Tell me about Sean\.?$/i, "Meet Sean.");
    clean = clean.replace(/^Who are the characters\??$/i, "Who are the Characters?");
    clean = clean.replace(/^Bring me back to the doorway\.?$/i, "Return to the First Fork.");

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
      roomId: room ? room.id : "firstFork"
    };
  }

  function shapeOptions(options, context) {
    var seen = {};
    var result = [];

    (options || []).forEach(function eachOption(option) {
      var shaped = shapeOption(option, context);
      var key = shaped.label + "::" + shaped.target;

      if (!shaped.label || !shaped.target || seen[key]) return;

      seen[key] = true;
      result.push(shaped);
    });

    return result;
  }

  function inferOptionType(target) {
    if (
      target === "cleanDoor" ||
      target === "recenterNode" ||
      target === "switchTopics" ||
      target === "sharpQuestion" ||
      target === "returnFork" ||
      target === "originReturn" ||
      target === "originReturnPath" ||
      target === "priorTopicReturn" ||
      target === "priorTopicReturnPath"
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
      "Every path is connected. You can follow one road, cross to another, return to a prior topic, or choose a faster way to the endpoint you’re looking for."
    ];

    if (currentRoom && currentRoom.id === "hearthProductionChamber") {
      beats.push("Right now, we are in the Hearth Production Chamber, the East Construct Chamber where this template is being stabilized before it moves to Compass.");
    } else if (currentRoom && currentRoom.id !== "firstFork") {
      beats.push("Right now, we are speaking from " + currentRoom.coordinateName + ".");
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
      { label: "Take me north to orientation.", target: "compassPath", type: "conversation" },
      { label: "Take me west to proof.", target: "scientificLawPath", type: "conversation" },
      { label: "Take me east to future systems.", target: "frontierPath", type: "conversation" },
      { label: "Take me south into Mirrorland.", target: "mirrorlandPath", type: "conversation" },
      { label: "Meet Sean.", target: "seanPath", type: "conversation" },
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
    if (!room) return "We are at the First Fork.";

    if (room.id === "firstFork") {
      return "We are at the First Fork.";
    }

    return "We are in " + room.coordinateName + ".";
  }

  function makeRoomAwareTransition(context) {
    var room = getCurrentRoom(context);
    var axis = getAxis(room ? room.cardinal : AXIS_CENTER);

    if (!room) {
      return "We can return to the First Fork, choose a new direction, or continue down this path.";
    }

    return "You are in " + room.coordinateName + ". " +
      axis.publicLine + " We can stay here, return to the First Fork, or cross to another road.";
  }

  function makeDirectionalFork(context) {
    return {
      beats: [
        makeCurrentRoomLine(context),
        "We can go north to orientation, west to proof, east to future systems, or south into Mirrorland."
      ],
      options: shapeOptions([
        { label: "North Fork.", target: "compassPath" },
        { label: "West Proof Chamber.", target: "scientificLawPath" },
        { label: "East Yard.", target: "frontierPath" },
        { label: "South Window.", target: "mirrorlandPath" },
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control" }
      ], context)
    };
  }

  function makeReturnExpression(kind, context) {
    var ctx = context || {};
    var currentRoom = getCurrentRoom(ctx);
    var priorName = ctx.priorTopicName || ctx.priorTopic || ctx.priorNode || "the prior topic";
    var originName = ctx.originConversationName || "the origin conversation";

    if (kind === "prior" || kind === "priorTopicReturn" || kind === "priorTopicReturnPath") {
      return {
        beats: [
          "We can return to " + priorName + ".",
          "Nothing is lost. We are only stepping off this lane and returning to the last thread."
        ].map(function cleanBeat(beat) {
          return sanitizePublicText(beat, ctx);
        }),
        options: shapeOptions([
          { label: "Return to prior topic.", target: ctx.priorNode || "returnFork", type: "control" },
          { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
          { label: "Stay here.", target: ctx.currentNode || "cleanDoor", type: "conversation" },
          { label: "Choose a new door.", target: "cleanDoor", type: "control" }
        ], ctx)
      };
    }

    if (kind === "origin" || kind === "originReturn" || kind === "originReturnPath") {
      return {
        beats: [
          "We are back at the origin conversation.",
          "This is the First Fork. From here, every road is still connected."
        ],
        options: makeOriginOptions({
          priorAvailable: Boolean(ctx.priorTopic || ctx.priorNode),
          originAvailable: false
        }, ctx)
      };
    }

    return {
      beats: [
        currentRoom ? "You are in " + currentRoom.coordinateName + "." : "You are at the First Fork.",
        "You can return to the prior topic, return to the origin conversation, or choose a new road."
      ],
      options: shapeOptions([
        { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
        { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
        { label: "Choose a new door.", target: "cleanDoor", type: "control" }
      ], ctx)
    };
  }

  function makeCharacterOverview(context) {
    var beats = [
      "The Characters are where Mirrorland starts breathing.",
      CHARACTER_PROFILES.aurenVale.oneLine,
      CHARACTER_PROFILES.dextrion.oneLine,
      CHARACTER_PROFILES.alaric.oneLine,
      CHARACTER_PROFILES.tarian.oneLine,
      "I can introduce them one at a time, show how they relate, or use the Character Archetype Mirror to show which pattern you follow when pressure rises."
    ];

    return {
      beats: beats.map(function cleanBeat(beat) {
        return sanitizePublicText(beat, context);
      }),
      options: shapeOptions([
        { label: "Who are the Characters?", target: "characterIdentityPath" },
        { label: "Meet Auren Vale.", target: "characterAurenValePath" },
        { label: "Meet Dextrion.", target: "characterDextrionPath" },
        { label: "Meet Alaric.", target: "characterAlaricPath" },
        { label: "Show how the Characters relate.", target: "characterRelationshipsPath" },
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeMirrorPath" }
      ], context)
    };
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
        { label: "Enter Mirrorland.", target: "mirrorlandPath" },
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
        { label: "Enter Mirrorland.", target: "mirrorlandPath" },
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
        "This is reflection, not identity."
      ].map(function cleanBeat(beat) {
        return sanitizePublicText(beat, context);
      }),
      options: shapeOptions([
        { label: "Which Character Archetype do I follow under pressure?", target: "characterArchetypeQuestionOne" },
        { label: "Show my behavior under pressure.", target: "characterArchetypeQuestionOne" },
        { label: "Meet the Characters first.", target: "charactersPath" },
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
      "Frontier sits east in the estate: the East Yard where future systems are tested before the visitor treats them as finished.",
      context
    );
  }

  function makeHearthProductionLine(context) {
    return sanitizePublicText(
      "We are in the Hearth Production Chamber right now, the East Construct Chamber where the Jeeves template is being stabilized before Compass receives it.",
      context
    );
  }

  function makeCompassDeploymentLine(context) {
    return sanitizePublicText(
      "Compass will become the North Fork: the public starting point where visitors can talk to the house and move through the estate by direction, road, bridge, lane, or return.",
      context
    );
  }

  function makeEndpointShortcutLine(context) {
    return sanitizePublicText(
      "You can start down one road and still reach the endpoint faster by crossing to another bridge.",
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
    var axis;

    if (!room) {
      return "This path returns to the First Fork.";
    }

    axis = getAxis(room.cardinal);

    return sanitizePublicText(
      room.coordinateName + " is " + axis.name + " in the estate. It functions as the " + room.role.toLowerCase(),
      context
    );
  }

  function getDirectionalOptions(context) {
    return shapeOptions([
      { label: "North Fork.", target: "compassPath" },
      { label: "West Proof Chamber.", target: "scientificLawPath" },
      { label: "East Yard.", target: "frontierPath" },
      { label: "South Window.", target: "mirrorlandPath" }
    ], context);
  }

  function getReturnOptions(context) {
    return shapeOptions([
      { label: "Return to prior topic.", target: "priorTopicReturnPath", type: "control" },
      { label: "Return to origin conversation.", target: "originReturnPath", type: "control" },
      { label: "Return to the First Fork.", target: "returnFork", type: "control" },
      { label: "Choose a new door.", target: "cleanDoor", type: "control" }
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
      speechRole: room.speechRole,
      routeId: room.routeId,
      target: room.target,
      returnParent: room.returnParent,
      originAnchor: room.originAnchor,
      nearRooms: room.nearRooms ? room.nearRooms.slice() : [],
      bridgeRooms: room.bridgeRooms ? room.bridgeRooms.slice() : [],
      stabilizationRole: room.stabilizationRole
    };
  }

  function createTargetDescriptor(target) {
    var normalized = normalizeTarget(target);
    var room = getRoomForTarget(normalized);

    return {
      target: normalized,
      label: PUBLIC_LABELS[normalized] || "Choose this path.",
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
    global.__HEARTH_JEEVES_EXPRESSION_LOADED__ = true;
    global.__HEARTH_JEEVES_EXPRESSION_CONTRACT__ = CONTRACT;

    if (typeof module !== "undefined" && module.exports) {
      module.exports = api;
      module.exports.default = api;
    }
  }

  expose();
})(typeof window !== "undefined" ? window : globalThis);
