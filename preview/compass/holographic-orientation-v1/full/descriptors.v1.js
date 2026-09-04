(() => {
  "use strict";

  const PUBLIC_BASE_HEAD = "8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

  const source = Object.freeze({
    P1: Object.freeze({path:"assets/build/fibonacci-cosmos-core-v7.js",blob:"93a9fc9989b53ef75319dc1af0206ebc6a2b537c"}),
    P2: Object.freeze({path:"assets/compass/upstream-compass.geometry.js",blob:"fe35d8d844859a6af810684ace53d2c65258522f"}),
    P3: Object.freeze({path:"nine-summits-of-love/index.html",blob:"ac955931681b46e39706d298f4f83d4cf50a50c5"}),
    P4: Object.freeze({path:"evidence/agentic-frontier/index.html",blob:"06a82735deec6e577b71cf47b2d7246a9d853f0f"}),
    P5: Object.freeze({path:"coherence-diagnostic/index.html",blob:"bef36f101c15fe949b89dd6ecea6117cd471680e"}),
    P6: Object.freeze({path:"assets/compass/compass.brain-scene.js",blob:"325b9486d0ab2136d425aed9468c22c28c67a57b"}),
    P7A:Object.freeze({path:"assets/compass/compass.house-scene.js",blob:"a82e3c963a10808b9f8f1922faab45155ea4a62b"}),
    P7B:Object.freeze({path:"assets/shared/mirrorland-window.geometry.js",blob:"fb3ee8ab92fa4b08e7708b83780de75d1a6f8595"}),
    P7C:Object.freeze({path:"showroom/globe/hearth/jeeves/index.html",blob:"fe909379190431baaf825df1b776ec1d66c305f2"}),
    P8: Object.freeze({path:"build/index.html",blob:"7875a6a220fa44da24fe2ad805bb1e146440b5d6"}),
    P9: Object.freeze({path:"inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs",blob:"872d20b17bb0cd89d9613ca0262b25350890a617"}),
    P10:Object.freeze({path:"assets/compass/compass.trophy-scene.js",blob:"d281e18b06128671ffe2a19e8fdb272cc5544e31"}),
    P11:Object.freeze({path:"assets/compass/upstream-compass.geometry.js",blob:"fe35d8d844859a6af810684ace53d2c65258522f"})
  });

  const fibonacci = Object.freeze({
    goldenAngle:GOLDEN_ANGLE,
    seed:0xD1A60D,
    minimumStars:84,
    maximumStars:233,
    areaDivisor:5200,
    rogueRatio:0.055,
    colors:Object.freeze(["242,232,191","173,229,235","141,198,219","255,248,225"])
  });

  const heart = Object.freeze({
    sourceContract:"NINE_SUMMITS_OF_LOVE_TED_RUBY_HEART_MOBILE_CONTAINMENT_HTML_TNT_v7",
    geometryIdentity:"rounded-double-convex-diamond-heart",
    width:377,
    height:368,
    depth:89,
    rimDepth:13,
    domeRise:31.5,
    rotationDurationSeconds:34,
    fibonacciSync:Object.freeze([13,21,34,55,89,144,233,377,610,987]),
    colors:Object.freeze({rose:"#ff5f87",ruby:"#c91442",crimson:"#981032",garnet:"#6d0b29",burgundy:"#47071e",gold:"#f3c86f"}),
    perimeterSamples:89,
    ringScales:Object.freeze([1,.944,.786,.618,.486,.382,.300,.236,.146,.090]),
    shrinkFocus:Object.freeze([0,18]),
    sourceCenter:Object.freeze([500,475]),
    sourceScale:377/800,
    bezierSegments:Object.freeze([
      [[500,865],[444,805],[350,734],[255,645]],
      [[255,645],[153,550],[94,440],[100,330]],
      [[100,330],[106,215],[166,119],[270,101]],
      [[270,101],[361,85],[433,133],[500,238]],
      [[500,238],[567,133],[639,85],[730,101]],
      [[730,101],[834,119],[894,215],[900,330]],
      [[900,330],[906,440],[847,550],[745,645]],
      [[745,645],[650,734],[556,805],[500,865]]
    ].map(segment=>Object.freeze(segment.map(Object.freeze))))
  });

  const research = Object.freeze({
    title:"Research Frontier", planeLabel:"PUBLIC EVIDENCE", proposition:"Measured. Tested. Bounded.",
    colors:Object.freeze({gold:"#ecd38e",cyan:"#78ddef",violet:"#c0adff",green:"#91e7b9",red:"#ef9a9a"}),
    planes:Object.freeze([
      Object.freeze({tag:"MEASURE",title:"Measurable coherence",detail:"Signal before story",state:"PASS"}),
      Object.freeze({tag:"TEST",title:"Controlled studies",detail:"Positive and negative results",state:"EVIDENCE"}),
      Object.freeze({tag:"BOUND",title:"Claim limits",detail:"What the evidence does not establish",state:"HOLD"})
    ]),
    chain:Object.freeze(["SOURCE","METHOD","RESULT","CLAIM"])
  });

  const diagnostic = Object.freeze({
    title:"How coherent are your decisions under pressure?",
    stages:Object.freeze([Object.freeze({id:"01",name:"SELF-RATING"}),Object.freeze({id:"02",name:"ARCHETYPE"}),Object.freeze({id:"03",name:"PRESSURE"})]),
    boundaries:Object.freeze(["NO_MEDICAL_DIAGNOSIS","NO_EMPLOYMENT_SCREENING","NO_LEGAL_DETERMINATION","NO_IQ_CLAIM","NO_OFFICIAL_MBTI_CLAIM"]),
    localOnly:true,
    colors:Object.freeze({gold:"#f4cf83",blue:"#8dd8ff",mint:"#a7f3c6",violet:"#ad8cff"})
  });

  const brain = Object.freeze({
    version:"anatomical-webgl-v8-3d-only",
    components:Object.freeze(["LEFT_HEMISPHERE","RIGHT_HEMISPHERE","LONGITUDINAL_FISSURE","CEREBELLUM","PONS","BRAINSTEM"]),
    palette:Object.freeze({frontal:Object.freeze([0.98,0.69,0.66]),parietal:Object.freeze([0.90,0.57,0.58]),temporal:Object.freeze([0.82,0.43,0.49]),occipital:Object.freeze([0.72,0.33,0.41]),cerebellum:Object.freeze([0.43,0.18,0.24]),stem:Object.freeze([0.72,0.37,0.39])}),
    rows:18, cols:30
  });

  const house = Object.freeze({
    version:"mirror-manor-gothic-phase3-carousel-v6-material-detail-final",
    contract:"MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1",
    principalSpan:27,
    identity:Object.freeze(["TWO_STORY_PRINCIPAL_FACADE","TRUE_FACADE_OPENINGS","OPEN_POINTED_PORTALS","TRUE_DORMER_APERTURES","TOWER_CROWNS","SLATE_SHINGLE_COURSES","ENGRAVED_STONE_COURT"]),
    colors:Object.freeze({roof:"#26282f",stone:"#6e6b68",court:"#5c5957",line:"#d5e7e6"})
  });

  const windowFallback = Object.freeze({
    designWidth:480, designHeight:720, paneCount:21,
    colors:Object.freeze({cyan:[87,210,231],blue:[67,112,204],violet:[133,83,201],amber:[226,164,79],rose:[198,85,132],paleCyan:[161,235,244],paleBlue:[143,181,234],paleViolet:[184,149,232],paleAmber:[239,202,132],paleRose:[229,151,185]}),
    panes:Object.freeze([
      ["crown-left","paleCyan",[[240,46],[164,106],[204,168],[240,134]]],["crown-right","paleViolet",[[240,46],[240,134],[278,168],[318,106]]],
      ["upper-left-edge","blue",[[164,106],[98,210],[154,246],[204,168]]],["upper-right-edge","violet",[[318,106],[278,168],[326,246],[382,210]]],
      ["upper-center-left","cyan",[[204,168],[154,246],[216,268],[240,208],[240,134]]],["upper-center-right","rose",[[240,134],[240,208],[264,268],[326,246],[278,168]]],
      ["mid-left-high","paleBlue",[[98,210],[66,332],[148,338],[154,246]]],["mid-left-inner","violet",[[154,246],[148,338],[212,334],[216,268]]],
      ["mid-center","paleAmber",[[216,268],[212,334],[240,382],[268,334],[264,268],[240,208]]],["mid-right-inner","cyan",[[264,268],[268,334],[332,338],[326,246]]],
      ["mid-right-high","blue",[[326,246],[332,338],[414,332],[382,210]]],["lower-left-edge","rose",[[66,332],[82,470],[156,446],[148,338]]],
      ["lower-left-center","cyan",[[148,338],[156,446],[216,430],[240,382],[212,334]]],["lower-right-center","violet",[[268,334],[240,382],[264,430],[324,446],[332,338]]]
    ].map(Object.freeze))
  });

  const build = Object.freeze({eyebrow:"Custom Software Construction",headline:"Build something worth returning to.",destination:"A website used to be an address. Now it can be a destination.",scope:Object.freeze(["Business · trust · action","Personal brand · identity · home","Idea · experience · possibility"]),rail:Object.freeze(["YOURS","NATIVE","FORWARD"])});

  const audralia = Object.freeze({
    planetRadius:6200,planetCenter:Object.freeze([0,-6200,0]),localCenterZ:-128,
    bounds:Object.freeze({uMin:-2180,uMax:2130,vMin:-2310,vMax:320}),continentFootprintAreaTarget:0.70,continentScaleAnchor:Object.freeze([0,-128]),
    coastControlPoints:Object.freeze([[-520,-40],[-760,-80],[-980,-180],[-1180,-340],[-1500,-520],[-1660,-720],[-1500,-900],[-1260,-850],[-1080,-700],[-1180,-1010],[-1380,-1260],[-1510,-1490],[-1370,-1710],[-1080,-1880],[-760,-1990],[-470,-1910],[-190,-2050],[120,-2010],[390,-2160],[650,-2050],[760,-1850],[1040,-1700],[1370,-1800],[1650,-1600],[1760,-1360],[1580,-1260],[1350,-1220],[1140,-1100],[900,-1040],[690,-900],[560,-700],[760,-430],[-420,90]].map(Object.freeze))
  });

  const trophy = Object.freeze({
    cupBody:Object.freeze([[.095,.13],[.14,.18],[.18,.245],[.245,.315],[.35,.385],[.445,.48],[.515,.60],[.548,.70],[.535,.80],[.495,.88],[.455,.925]].map(Object.freeze)),
    shoulder:Object.freeze([[.455,.905],[.492,.918],[.515,.938],[.505,.956],[.472,.966]].map(Object.freeze)),
    rim:Object.freeze([[.465,.945],[.505,.955],[.535,.976],[.528,1.006],[.488,1.026],[.458,1.017]].map(Object.freeze)),
    stem:Object.freeze([[.118,.145],[.108,.065],[.104,-.12],[.112,-.225],[.135,-.305]].map(Object.freeze)),
    foot:Object.freeze([[.135,-.305],[.18,-.34],[.27,-.385],[.355,-.425],[.382,-.455],[.365,-.485],[.30,-.515],[.215,-.53]].map(Object.freeze)),
    handles:Object.freeze([Object.freeze({cx:-.55,cy:.625,major:.285,minor:.060,a0:Math.PI*.57,a1:Math.PI*1.43}),Object.freeze({cx:.55,cy:.625,major:.285,minor:.060,a0:Math.PI*1.57,a1:Math.PI*2.43})]),
    claimBoundary:"TARGETS_AND_RATIONALE_NOT_NOMINATIONS_OR_WINS"
  });

  const timeline = Object.freeze([
    Object.freeze({passage:"P1",startMs:0,endMs:3000,label:"ARRIVAL",copy:"Before you enter."}),Object.freeze({passage:"P2",startMs:3000,endMs:6800,label:"ORIENTATION",copy:"Everything begins with a direction."}),Object.freeze({passage:"P3",startMs:6800,endMs:10000,label:"CHAPTER ONE",copy:"Start with the story."}),Object.freeze({passage:"P4",startMs:10000,endMs:13400,label:"RESEARCH FRONTIER",copy:"Test the ideas."}),Object.freeze({passage:"P5",startMs:13400,endMs:16900,label:"PERSONAL ALIGNMENT",copy:"How coherent are your decisions under pressure?"}),Object.freeze({passage:"P6",startMs:16900,endMs:20300,label:"INSTRUMENT",copy:"Coheriscope."}),Object.freeze({passage:"P7",startMs:20300,endMs:24400,label:"HOUSE",copy:"Talk to the House."}),Object.freeze({passage:"P8",startMs:24400,endMs:28000,label:"BUILD",copy:"Build something of your own."}),Object.freeze({passage:"P9",startMs:28000,endMs:31800,label:"AUDRALIA",copy:"Enter another world."}),Object.freeze({passage:"P10",startMs:31800,endMs:35100,label:"AWARDS",copy:"Built to be judged."}),Object.freeze({passage:"P11",startMs:35100,endMs:40600,label:"RETURN",copy:"Now choose a direction."})
  ]);

  globalThis.DGB_HOLOGRAPHIC_FULL_DESCRIPTORS = Object.freeze({schema:"COMPASS_HOLOGRAPHIC_DESCRIPTOR_MANIFEST_v1",publicBaseHead:PUBLIC_BASE_HEAD,source,fibonacci,heart,research,diagnostic,brain,house,windowFallback,build,audralia,trophy,timeline,masterDurationMs:40600});
})();
