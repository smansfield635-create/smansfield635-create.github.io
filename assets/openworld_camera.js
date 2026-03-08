(function(){
"use strict";

const PRESETS=Object.freeze({
fixed_harbor:{
horizon:0.62,
skyDrift:1.0,
waterDrift:1.0,
parallax:1.0
},
drag_view:{
horizon:0.60,
skyDrift:1.04,
waterDrift:1.02,
parallax:1.08
}
});

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function isValidMode(mode){
return Object.prototype.hasOwnProperty.call(PRESETS,mode);
}

function createState(initialMode){
const mode=isValidMode(initialMode)?initialMode:"fixed_harbor";
return{
mode:mode,
requested:mode,
transition:0
};
}

function blendTo(state,target){
if(!state||!isValidMode(target))return state;
state.requested=target;
return state;
}

function update(state,step){
if(!state)return state;

const dt=(typeof step==="number"&&isFinite(step))?step:0.08;

if(state.mode!==state.requested){
state.transition=clamp(state.transition+dt,0,1);
if(state.transition>=1){
state.mode=state.requested;
state.transition=0;
}
}else{
state.transition=0;
}

return state;
}

function getPreset(mode){
return PRESETS[mode]||PRESETS.fixed_harbor;
}

function getBlendedPreset(state){
if(!state)return PRESETS.fixed_harbor;

const current=getPreset(state.mode);
const target=getPreset(state.requested);
const t=state.transition||0;

if(state.mode===state.requested)return current;

return{
horizon:lerp(current.horizon,target.horizon,t),
skyDrift:lerp(current.skyDrift,target.skyDrift,t),
waterDrift:lerp(current.waterDrift,target.waterDrift,t),
parallax:lerp(current.parallax,target.parallax,t)
};
}

window.OPENWORLD_CAMERA=Object.freeze({
version:"OPENWORLD_CAMERA_vMIN1",
PRESETS:PRESETS,
createState:createState,
blendTo:blendTo,
update:update,
getPreset:getPreset,
getBlendedPreset:getBlendedPreset
});
})();
