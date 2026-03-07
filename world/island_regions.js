(function(){
"use strict";

/* ══════════════════════════════════════════════════════════════════════
ISLAND_REGIONS_v1
MODE: EXECUTION-ONLY · NON-DRIFT · REGION AUTHORITY
OWNER: SEAN

PURPOSE
Define the 16 canonical world regions for Nine Summits Island.

REQUIRES
window.WORLD_KERNEL from /world/world_kernel.js

OUTPUT
window.ISLAND_REGIONS
══════════════════════════════════════════════════════════════════════ */

const kernel=window.WORLD_KERNEL;
if(!kernel){
console.error("ISLAND_REGIONS_v1: WORLD_KERNEL missing.");
return;
}

const REGIONS=[

{
id:"harbor_core",
index:1,
label:"Harbor Core",
type:"core",
route:"/harbor/",
biome:"HARBOR_DUSK",
anchor:{x:kernel.harbor.x,y:kernel.harbor.y,z:kernel.harbor.z},
ingress:["gratitude_southlands","southern_coastal_belt","dragon_corridor"],
egress:["gratitude_southlands","southern_coastal_belt","dragon_corridor"],
localBudget:{
particles:kernel.budget.harborParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"gratitude_southlands",
index:2,
label:"Gratitude Southlands",
type:"summit",
route:"/gratitude/",
biome:"SPRING_FOREST",
summitKey:"gratitude",
anchor:{x:kernel.summits.gratitude.coord.x,y:kernel.summits.gratitude.coord.y,z:kernel.summits.gratitude.coord.z},
ingress:["harbor_core","southern_coastal_belt"],
egress:["harbor_core","generosity_delta","southern_coastal_belt"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"generosity_delta",
index:3,
label:"Generosity Delta",
type:"summit",
route:"/generosity/",
biome:"SUMMER_TRADE_VALLEY",
summitKey:"generosity",
anchor:{x:kernel.summits.generosity.coord.x,y:kernel.summits.generosity.coord.y,z:kernel.summits.generosity.coord.z},
ingress:["gratitude_southlands","southern_coastal_belt","patience_expanse"],
egress:["dependability_pass","humility_terrace","patience_expanse"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"dependability_pass",
index:4,
label:"Dependability Pass",
type:"summit",
route:"/dependability/",
biome:"WIND_MOUNTAIN_PASS",
summitKey:"dependability",
anchor:{x:kernel.summits.dependability.coord.x,y:kernel.summits.dependability.coord.y,z:kernel.summits.dependability.coord.z},
ingress:["generosity_delta","eastern_trade_frontier","western_wilds"],
egress:["accountability_canyon","forgiveness_fields","eastern_trade_frontier"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"accountability_canyon",
index:5,
label:"Accountability Canyon",
type:"summit",
route:"/accountability/",
biome:"RED_CANYON_PLATEAU",
summitKey:"accountability",
anchor:{x:kernel.summits.accountability.coord.x,y:kernel.summits.accountability.coord.y,z:kernel.summits.accountability.coord.z},
ingress:["dependability_pass","eastern_trade_frontier","selfcontrol_ridge"],
egress:["humility_terrace","selfcontrol_ridge","eastern_trade_frontier"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"humility_terrace",
index:6,
label:"Humility Terrace",
type:"summit",
route:"/humility/",
biome:"DEEP_RAINFOREST",
summitKey:"humility",
anchor:{x:kernel.summits.humility.coord.x,y:kernel.summits.humility.coord.y,z:kernel.summits.humility.coord.z},
ingress:["accountability_canyon","generosity_delta","western_wilds"],
egress:["forgiveness_fields","patience_expanse","western_wilds"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"forgiveness_fields",
index:7,
label:"Forgiveness Fields",
type:"summit",
route:"/forgiveness/",
biome:"GOLDEN_AUTUMN_FIELDS",
summitKey:"forgiveness",
anchor:{x:kernel.summits.forgiveness.coord.x,y:kernel.summits.forgiveness.coord.y,z:kernel.summits.forgiveness.coord.z},
ingress:["humility_terrace","dependability_pass","western_wilds"],
egress:["selfcontrol_ridge","western_wilds","northern_ice_approach"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"selfcontrol_ridge",
index:8,
label:"Self-Control Ridge",
type:"summit",
route:"/self-control/",
biome:"WINTER_MONASTERY_RIDGE",
summitKey:"self_control",
anchor:{x:kernel.summits.self_control.coord.x,y:kernel.summits.self_control.coord.y,z:kernel.summits.self_control.coord.z},
ingress:["forgiveness_fields","accountability_canyon","northern_ice_approach"],
egress:["patience_expanse","accountability_canyon","northern_ice_approach"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"patience_expanse",
index:9,
label:"Patience Expanse",
type:"summit",
route:"/patience/",
biome:"DESERT_PLATEAU",
summitKey:"patience",
anchor:{x:kernel.summits.patience.coord.x,y:kernel.summits.patience.coord.y,z:kernel.summits.patience.coord.z},
ingress:["selfcontrol_ridge","humility_terrace","generosity_delta"],
egress:["purity_crown","generosity_delta","northern_ice_approach"],
localBudget:{
particles:kernel.budget.summitParticleCap,
lanterns:kernel.budget.lanternsPerSector,
ambientActors:kernel.budget.ambientActorsPerSector
}
},

{
id:"purity_crown",
index:10,
label:"Purity Crown",
type:"summit",
route:"/purity/",
biome:"SNOW_PEAK_TEMPLE",
summitKey:"purity",
anchor:{x:kernel.summits.purity.coord.x,y:kernel.summits.purity.coord.y,z:kernel.summits.purity.coord.z},
ingress:["patience_expanse","northern_ice_approach"],
egress:["harbor_core","northern_ice_approach"],
localBudget:{
particles:kernel.budget.purityParticleCap,
lanterns:12,
ambientActors:6
}
},

{
id:"western_wilds",
index:11,
label:"Western Wilds",
type:"support",
route:"/western-wilds/",
biome:"DEEP_RAINFOREST",
anchor:{x:-280,y:180,z:300},
ingress:["dependability_pass","humility_terrace","forgiveness_fields"],
egress:["dependability_pass","humility_terrace","forgiveness_fields"],
localBudget:{
particles:80,
lanterns:18,
ambientActors:14
}
},

{
id:"eastern_trade_frontier",
index:12,
label:"Eastern Trade Frontier",
type:"support",
route:"/eastern-trade-frontier/",
biome:"SUMMER_TRADE_VALLEY",
anchor:{x:220,y:110,z:250},
ingress:["dependability_pass","accountability_canyon"],
egress:["dependability_pass","accountability_canyon"],
localBudget:{
particles:80,
lanterns:18,
ambientActors:14
}
},

{
id:"northern_ice_approach",
index:13,
label:"Northern Ice Approach",
type:"support",
route:"/northern-ice-approach/",
biome:"SNOW_PEAK_TEMPLE",
anchor:{x:-20,y:460,z:700},
ingress:["forgiveness_fields","selfcontrol_ridge","patience_expanse"],
egress:["selfcontrol_ridge","patience_expanse","purity_crown"],
localBudget:{
particles:64,
lanterns:8,
ambientActors:10
}
},

{
id:"southern_coastal_belt",
index:14,
label:"Southern Coastal Belt",
type:"support",
route:"/southern-coastal-belt/",
biome:"SPRING_FOREST",
anchor:{x:-80,y:-220,z:20},
ingress:["harbor_core","gratitude_southlands"],
egress:["harbor_core","gratitude_southlands","generosity_delta"],
localBudget:{
particles:90,
lanterns:22,
ambientActors:16
}
},

{
id:"dragon_corridor",
index:15,
label:"Dragon Corridor",
type:"support",
route:"/dragon-corridor/",
biome:"HARBOR_DUSK",
anchor:{x:kernel.dragons.orbitCenter.x,y:kernel.dragons.orbitCenter.y,z:kernel.dragons.orbitCenter.z},
ingress:["harbor_core"],
egress:["harbor_core","purity_crown"],
localBudget:{
particles:96,
lanterns:0,
ambientActors:0
}
},

{
id:"shadow_infrastructure",
index:16,
label:"Shadow Infrastructure",
type:"hidden",
route:"/shadow-infrastructure/",
biome:"HIDDEN",
anchor:{x:0,y:-20,z:-120},
ingress:[],
egress:[],
localBudget:{
particles:0,
lanterns:0,
ambientActors:0
}
}

];

const REGION_BY_ID=Object.create(null);
for(let i=0;i<REGIONS.length;i++){
REGION_BY_ID[REGIONS[i].id]=REGIONS[i];
}

const PAGE_TO_REGION=Object.freeze({
"/harbor/":"harbor_core",
"/gratitude/":"gratitude_southlands",
"/generosity/":"generosity_delta",
"/dependability/":"dependability_pass",
"/accountability/":"accountability_canyon",
"/humility/":"humility_terrace",
"/forgiveness/":"forgiveness_fields",
"/self-control/":"selfcontrol_ridge",
"/patience/":"patience_expanse",
"/purity/":"purity_crown",
"/western-wilds/":"western_wilds",
"/eastern-trade-frontier/":"eastern_trade_frontier",
"/northern-ice-approach/":"northern_ice_approach",
"/southern-coastal-belt/":"southern_coastal_belt",
"/dragon-corridor/":"dragon_corridor",
"/shadow-infrastructure/":"shadow_infrastructure"
});

function getRegionById(id){
return REGION_BY_ID[id]||null;
}

function getRegionByRoute(route){
const clean=(route||"/").replace(/\/+$/,"/").startsWith("/")?(route||"/").replace(/\/+$/,"/"):"/"+(route||"").replace(/\/+$/,"/");
const id=PAGE_TO_REGION[clean];
return id?REGION_BY_ID[id]:null;
}

function getNextPrimaryRegion(regionId){
const path=kernel.traversal.primary;
const idx=path.indexOf(regionId);
if(idx<0||idx>=path.length-1)return null;
return REGION_BY_ID[path[idx+1]]||null;
}

function getPreviousPrimaryRegion(regionId){
const path=kernel.traversal.primary;
const idx=path.indexOf(regionId);
if(idx<=0)return null;
return REGION_BY_ID[path[idx-1]]||null;
}

window.ISLAND_REGIONS={
version:"ISLAND_REGIONS_v1",
list:Object.freeze(REGIONS),
byId:getRegionById,
byRoute:getRegionByRoute,
nextPrimary:getNextPrimaryRegion,
previousPrimary:getPreviousPrimaryRegion,
pageToRegion:PAGE_TO_REGION
};

})();
