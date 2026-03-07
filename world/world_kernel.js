/* ══════════════════════════════════════════════════════════════════════
WORLD_KERNEL_v1
MODE: EXECUTION-ONLY · NON-DRIFT · INVARIANT WORLD AUTHORITY
OWNER: SEAN

PURPOSE
Provide the canonical invariant data layer for Nine Summits Island.
All engines read from this file. No engine may mutate this state.

ENGINES USING THIS FILE
• World Geometry Engine
• Environment Engine
• Civilization Engine
• Interaction Engine
• Motion / Gravity Engine
• Knowledge / Narrative Engine
• Scene Engine

RULE
This file contains **only invariant structures**.

Variant runtime state must live in:
  /world/environment_runtime.js
  /variant/scene.js
══════════════════════════════════════════════════════════════════════ */

export const WORLD_KERNEL = {

version: "WORLD_KERNEL_v1",

/* ──────────────────────────────────────────────────────────────────
WORLD IDENTITY
────────────────────────────────────────────────────────────────── */

mapId: "NINE_SUMMITS_ISLAND_MAP_v1",

scale: 1.0,

center: { x:0, y:0, z:0 },

boundaryRadius: 900,

sectorGrid: {
x:16,
y:16
},

/* ──────────────────────────────────────────────────────────────────
HARBOR ORIGIN
────────────────────────────────────────────────────────────────── */

harbor: {
x:0,
y:-260,
z:0
},

/* ──────────────────────────────────────────────────────────────────
SUMMIT COORDINATES
────────────────────────────────────────────────────────────────── */

summits: {

gratitude:{
coord:{x:-220,y:-140,z:60},
biome:"SPRING_FOREST",
community:"AGRICULTURAL_VILLAGE"
},

generosity:{
coord:{x:-120,y:-60,z:120},
biome:"SUMMER_TRADE_VALLEY",
community:"MERCHANT_TOWN"
},

dependability:{
coord:{x:-20,y:10,z:190},
biome:"WIND_MOUNTAIN_PASS",
community:"ROAD_PASS_SETTLEMENT"
},

accountability:{
coord:{x:70,y:90,z:260},
biome:"RED_CANYON_PLATEAU",
community:"COURT_TERRACE_COMMUNITY"
},

humility:{
coord:{x:0,y:150,z:340},
biome:"DEEP_RAINFOREST",
community:"LEARNING_GARDEN_COMMUNITY"
},

forgiveness:{
coord:{x:-90,y:240,z:430},
biome:"GOLDEN_AUTUMN_FIELDS",
community:"TEMPLE_FIELD_SETTLEMENT"
},

self_control:{
coord:{x:-180,y:320,z:520},
biome:"WINTER_MONASTERY_RIDGE",
community:"MONASTERY_COMPLEX"
},

patience:{
coord:{x:-60,y:430,z:640},
biome:"DESERT_PLATEAU",
community:"SANCTUARY_OUTPOST"
},

purity:{
coord:{x:0,y:560,z:820},
biome:"SNOW_PEAK_TEMPLE",
community:"PEAK_SANCTUARY"
}

},

/* ──────────────────────────────────────────────────────────────────
TRAVERSAL GRAPH
────────────────────────────────────────────────────────────────── */

traversal:{

primary:[
"harbor",
"gratitude",
"generosity",
"dependability",
"accountability",
"humility",
"forgiveness",
"self_control",
"patience",
"purity"
],

branches:{
generosity:["humility"],
dependability:["forgiveness"],
accountability:["self_control"],
humility:["patience"]
},

returns:{
purity:"harbor",
patience:"generosity",
self_control:"accountability"
}

},

/* ──────────────────────────────────────────────────────────────────
ENVIRONMENT CONSTANTS
────────────────────────────────────────────────────────────────── */

environment:{

weatherModel:"SECTOR_LOCAL_BIOME_WEATHER",

celestial:{

sun:{
arcRadius:1100,
arcSpeed:0.0035,
path:"U_ARC"
},

moon:{
arcRadius:980,
arcSpeed:0.0028,
path:"U_ARC"
}

},

fogModel:{
harbor:"LOW",
ridge:"MID",
purity:"HIGH"
},

lightModel:"DUAL_CELESTIAL_DUSK_BASELINE"

},

/* ──────────────────────────────────────────────────────────────────
DRAGON CORRIDOR
────────────────────────────────────────────────────────────────── */

dragons:{

orbitCenter:{x:0,y:240,z:420},

orbitRadius:420,

orbitSpeed:0.0019,

figureEight:true,

persistence:true,

entryRule:"PORTAL_D1",

exitRule:"PORTAL_D4"

},

/* ──────────────────────────────────────────────────────────────────
INTERACTION TYPES
────────────────────────────────────────────────────────────────── */

interaction:{

lantern:[
"BRIGHTEN",
"EXTINGUISH",
"FIREWORKS",
"BUTTERFLIES",
"MESSAGE_REVEAL"
],

environmentTap:[
"CELESTIAL_ADVANCE",
"WATER_RIPPLE",
"CLOUD_DISTURB",
"LANTERN_TRIGGER"
],

summitTriggers:[
"SUMMIT_ENTRY",
"SUMMIT_COMPLETION",
"RETURN_PORTAL_UNLOCK"
]

},

/* ──────────────────────────────────────────────────────────────────
LANGUAGE / KNOWLEDGE
────────────────────────────────────────────────────────────────── */

knowledge:{

layers:[
"Informal",
"Formal",
"Platform",
"Engineering"
],

futureLayers:[
"Kids_Teens"
],

bannerRotation:"DRAGON_LANGUAGE_ALTERNATES_BY_CYCLE"

},

/* ──────────────────────────────────────────────────────────────────
WORLD BUDGET (from WORLD_BUDGET_RULES_v1)
────────────────────────────────────────────────────────────────── */

budget:{

fpsTarget:60,

activeFullFidelitySectors:1,

adjacentReducedFidelitySectors:2,

dragonsActive:2,

lanternsPerSector:40,

ambientActorsPerSector:20,

summitParticleCap:120,

harborParticleCap:220,

purityParticleCap:80,

degradeSequence:[
"particles",
"distantActors",
"shadows",
"decorationAnimation"
]

}

};

/* ══════════════════════════════════════════════════════════════════════
FREEZE INVARIANT STRUCTURE
══════════════════════════════════════════════════════════════════════ */

Object.freeze(WORLD_KERNEL);
