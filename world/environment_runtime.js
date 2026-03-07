(function(){
"use strict";

/* ══════════════════════════════════════════════════════════════════════
ENVIRONMENT_RUNTIME_v1
MODE: EXECUTION-ONLY · NON-DRIFT · VARIANT RUNTIME STATE
OWNER: SEAN

PURPOSE
Provide live environment state for Nine Summits Island.
This file contains only runtime / changing state.

REQUIRES
window.WORLD_KERNEL from /world/world_kernel.js

OUTPUT
window.ENVIRONMENT_RUNTIME
══════════════════════════════════════════════════════════════════════ */

const kernel=window.WORLD_KERNEL;
if(!kernel){
console.error("ENVIRONMENT_RUNTIME_v1: WORLD_KERNEL missing.");
return;
}

const celestial=kernel.environment&&kernel.environment.celestial?kernel.environment.celestial:{};
const sunCfg=celestial.sun||{};
const moonCfg=celestial.moon||{};

const state={
tick:0,
timeNorm:0,
interactionAdvance:0,
weatherModel:kernel.environment.weatherModel||"SECTOR_LOCAL_BIOME_WEATHER",
lightModel:kernel.environment.lightModel||"DUAL_CELESTIAL_DUSK_BASELINE",
currentSectorId:"harbor_core",
currentBiome:"HARBOR_DUSK",
fogLevel:0.10,
ambientLight:0.72,
sun:{
path:sunCfg.path||"U_ARC",
arcRadius:sunCfg.arcRadius||1100,
arcSpeed:sunCfg.arcSpeed||0.0035,
phase:0.08,
x:0,
y:0,
glow:0.78
},
moon:{
path:moonCfg.path||"U_ARC",
arcRadius:moonCfg.arcRadius||980,
arcSpeed:moonCfg.arcSpeed||0.0028,
phase:0.58,
x:0,
y:0,
glow:0.88
},
weather:{
type:"CLEAR_DUSK",
wind:0.22,
cloudDrift:0.26,
waveEnergy:0.34
}
};

const sectorBiomeMap={
harbor_core:"HARBOR_DUSK",
gratitude_southlands:"SPRING_FOREST",
generosity_delta:"SUMMER_TRADE_VALLEY",
dependability_pass:"WIND_MOUNTAIN_PASS",
accountability_canyon:"RED_CANYON_PLATEAU",
humility_terrace:"DEEP_RAINFOREST",
forgiveness_fields:"GOLDEN_AUTUMN_FIELDS",
selfcontrol_ridge:"WINTER_MONASTERY_RIDGE",
patience_expanse:"DESERT_PLATEAU",
purity_crown:"SNOW_PEAK_TEMPLE",
western_wilds:"DEEP_RAINFOREST",
eastern_trade_frontier:"SUMMER_TRADE_VALLEY",
northern_ice_approach:"SNOW_PEAK_TEMPLE",
southern_coastal_belt:"SPRING_FOREST",
dragon_corridor:"HARBOR_DUSK",
shadow_infrastructure:"HIDDEN"
};

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+(b-a)*t;}

function biomeFogLevel(biome){
switch(biome){
case "HARBOR_DUSK": return 0.10;
case "SPRING_FOREST": return 0.14;
case "SUMMER_TRADE_VALLEY": return 0.08;
case "WIND_MOUNTAIN_PASS": return 0.18;
case "RED_CANYON_PLATEAU": return 0.06;
case "DEEP_RAINFOREST": return 0.24;
case "GOLDEN_AUTUMN_FIELDS": return 0.12;
case "WINTER_MONASTERY_RIDGE": return 0.28;
case "DESERT_PLATEAU": return 0.05;
case "SNOW_PEAK_TEMPLE": return 0.34;
default: return 0.10;
}
}

function biomeAmbientLight(biome){
switch(biome){
case "HARBOR_DUSK": return 0.72;
case "SPRING_FOREST": return 0.78;
case "SUMMER_TRADE_VALLEY": return 0.82;
case "WIND_MOUNTAIN_PASS": return 0.68;
case "RED_CANYON_PLATEAU": return 0.84;
case "DEEP_RAINFOREST": return 0.58;
case "GOLDEN_AUTUMN_FIELDS": return 0.76;
case "WINTER_MONASTERY_RIDGE": return 0.64;
case "DESERT_PLATEAU": return 0.86;
case "SNOW_PEAK_TEMPLE": return 0.70;
default: return 0.72;
}
}

function biomeWeather(biome){
switch(biome){
case "SPRING_FOREST":
return{type:"SOFT_BREEZE",wind:0.24,cloudDrift:0.24,waveEnergy:0.28};
case "SUMMER_TRADE_VALLEY":
return{type:"WARM_CLEAR",wind:0.18,cloudDrift:0.22,waveEnergy:0.24};
case "WIND_MOUNTAIN_PASS":
return{type:"HIGH_WIND",wind:0.42,cloudDrift:0.40,waveEnergy:0.30};
case "RED_CANYON_PLATEAU":
return{type:"DRY_HEAT",wind:0.20,cloudDrift:0.16,waveEnergy:0.18};
case "DEEP_RAINFOREST":
return{type:"MIST_HUMID",wind:0.14,cloudDrift:0.18,waveEnergy:0.22};
case "GOLDEN_AUTUMN_FIELDS":
return{type:"AUTUMN_BREEZE",wind:0.30,cloudDrift:0.26,waveEnergy:0.24};
case "WINTER_MONASTERY_RIDGE":
return{type:"COLD_AIR",wind:0.34,cloudDrift:0.20,waveEnergy:0.20};
case "DESERT_PLATEAU":
return{type:"DRY_WIND",wind:0.28,cloudDrift:0.14,waveEnergy:0.14};
case "SNOW_PEAK_TEMPLE":
return{type:"THIN_AIR",wind:0.22,cloudDrift:0.18,waveEnergy:0.16};
case "HARBOR_DUSK":
default:
return{type:"CLEAR_DUSK",wind:0.22,cloudDrift:0.26,waveEnergy:0.34};
}
}

function getArcPosition(radius,phaseNorm,isSun){
const phase=phaseNorm*TAU;
const x=Math.cos(phase)*radius;
const y=Math.sin(phase)*radius*0.42;
return{
x:isSun?x:-x,
y:y
};
}

function resolveBiome(sectorId){
return sectorBiomeMap[sectorId]||"HARBOR_DUSK";
}

function setSector(sectorId){
state.currentSectorId=sectorId;
state.currentBiome=resolveBiome(sectorId);
state.fogLevel=biomeFogLevel(state.currentBiome);
state.ambientLight=biomeAmbientLight(state.currentBiome);
state.weather=biomeWeather(state.currentBiome);
return getSnapshot();
}

function advanceByInteraction(amount){
state.interactionAdvance+=amount||0.012;
if(state.interactionAdvance>1)state.interactionAdvance-=1;
return getSnapshot();
}

function tick(dt){
const step=typeof dt==="number"&&isFinite(dt)?dt:1;
state.tick+=step;
state.timeNorm=(state.timeNorm+(step*0.00045)+(state.interactionAdvance*0.00035))%1;

const sunPhase=(state.sun.phase+state.timeNorm)%1;
const moonPhase=(state.moon.phase+state.timeNorm)%1;

const sunPos=getArcPosition(state.sun.arcRadius,sunPhase,true);
const moonPos=getArcPosition(state.moon.arcRadius,moonPhase,false);

state.sun.x=sunPos.x;
state.sun.y=sunPos.y;
state.moon.x=moonPos.x;
state.moon.y=moonPos.y;

state.sun.glow=0.72+Math.sin(sunPhase*TAU)*0.10;
state.moon.glow=0.82+Math.cos(moonPhase*TAU)*0.08;

state.weather.wind=lerp(state.weather.wind,state.weather.wind,0.5);
state.weather.cloudDrift=lerp(state.weather.cloudDrift,state.weather.cloudDrift,0.5);
state.weather.waveEnergy=lerp(state.weather.waveEnergy,state.weather.waveEnergy,0.5);

return getSnapshot();
}

function getSnapshot(){
return{
tick:state.tick,
timeNorm:state.timeNorm,
currentSectorId:state.currentSectorId,
currentBiome:state.currentBiome,
fogLevel:state.fogLevel,
ambientLight:state.ambientLight,
weather:{
type:state.weather.type,
wind:state.weather.wind,
cloudDrift:state.weather.cloudDrift,
waveEnergy:state.weather.waveEnergy
},
sun:{
path:state.sun.path,
arcRadius:state.sun.arcRadius,
arcSpeed:state.sun.arcSpeed,
x:state.sun.x,
y:state.sun.y,
glow:state.sun.glow
},
moon:{
path:state.moon.path,
arcRadius:state.moon.arcRadius,
arcSpeed:state.moon.arcSpeed,
x:state.moon.x,
y:state.moon.y,
glow:state.moon.glow
}
};
}

window.ENVIRONMENT_RUNTIME={
version:"ENVIRONMENT_RUNTIME_v1",
setSector,
advanceByInteraction,
tick,
getSnapshot
};

setSector("harbor_core");
tick(0);

})();
