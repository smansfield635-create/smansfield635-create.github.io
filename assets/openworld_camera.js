(function(){
"use strict";

const PRESETS={
fixed_harbor:{
horizon:0.66,
cubeScale:0.118,
cubeYOffset:0.22,
perspectiveBias:0
},
travel_projection:{
horizon:0.62,
cubeScale:0.10,
cubeYOffset:0.22,
perspectiveBias:80
},
aerial_one:{
horizon:0.57,
cubeScale:0.092,
cubeYOffset:0.20,
perspectiveBias:120
},
aerial_two:{
horizon:0.52,
cubeScale:0.084,
cubeYOffset:0.18,
perspectiveBias:160
}
};

const ORDER=[
"fixed_harbor",
"travel_projection",
"aerial_one",
"aerial_two"
];

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function createState(mode){
return{
mode:mode||"fixed_harbor",
requested:mode||"fixed_harbor",
transition:0
};
}

function blendTo(state,target){
state.requested=target;
}

function cycle(state){
const i=ORDER.indexOf(state.requested);
state.requested=ORDER[(i+1)%ORDER.length];
}

function update(state,dt){

if(state.mode!==state.requested){

state.transition+=dt;

if(state.transition>=1){
state.mode=state.requested;
state.transition=0;
}

}else{
state.transition=0;
}

}

function getPreset(mode){
return PRESETS[mode]||PRESETS.fixed_harbor;
}

function getBlendedPreset(state){

const a=getPreset(state.mode);
const b=getPreset(state.requested);

const t=state.transition;

if(state.mode===state.requested)return a;

return{
horizon:lerp(a.horizon,b.horizon,t),
cubeScale:lerp(a.cubeScale,b.cubeScale,t),
cubeYOffset:lerp(a.cubeYOffset,b.cubeYOffset,t),
perspectiveBias:lerp(a.perspectiveBias,b.perspectiveBias,t)
};

}

window.OPENWORLD_CAMERA={
createState,
blendTo,
cycle,
update,
getPreset,
getBlendedPreset
};

})();
