(function(){
"use strict";

const PRESETS=Object.freeze({
fixed_harbor:{
horizon:0.58,
parallax:1.08,
compassLift:0,
zoom:1,
tilt:0.08,
follow:0.12
},
drag_view:{
horizon:0.565,
parallax:1.14,
compassLift:0,
zoom:1.03,
tilt:0.1,
follow:0.16
},
compass_focus:{
horizon:0.555,
parallax:1.1,
compassLift:-10,
zoom:1.02,
tilt:0.11,
follow:0.14
},
summit_pull:{
horizon:0.53,
parallax:1.18,
compassLift:-14,
zoom:1.06,
tilt:0.13,
follow:0.18
}
});

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function createState(initialMode){
const mode=PRESETS[initialMode]?initialMode:"fixed_harbor";
const preset=PRESETS[mode];
return{
mode:mode,
requested:mode,
transition:0,
runtime:{
horizon:preset.horizon,
parallax:preset.parallax,
compassLift:preset.compassLift,
zoom:preset.zoom,
tilt:preset.tilt,
follow:preset.follow
}
};
}

function blendTo(state,target){
if(!state||!PRESETS[target])return state;
state.requested=target;
return state;
}

function update(state,step){
if(!state)return state;
const dt=typeof step==="number"&&isFinite(step)?step:0.08;

if(state.mode!==state.requested){
state.transition=clamp(state.transition+dt,0,1);
const current=PRESETS[state.mode]||PRESETS.fixed_harbor;
const target=PRESETS[state.requested]||PRESETS.fixed_harbor;
const t=state.transition;

state.runtime.horizon=lerp(current.horizon,target.horizon,t);
state.runtime.parallax=lerp(current.parallax,target.parallax,t);
state.runtime.compassLift=lerp(current.compassLift,target.compassLift,t);
state.runtime.zoom=lerp(current.zoom,target.zoom,t);
state.runtime.tilt=lerp(current.tilt,target.tilt,t);
state.runtime.follow=lerp(current.follow,target.follow,t);

if(state.transition>=1){
state.mode=state.requested;
state.transition=0;
}
}else{
const current=PRESETS[state.mode]||PRESETS.fixed_harbor;
state.runtime.horizon=current.horizon;
state.runtime.parallax=current.parallax;
state.runtime.compassLift=current.compassLift;
state.runtime.zoom=current.zoom;
state.runtime.tilt=current.tilt;
state.runtime.follow=current.follow;
}

return state;
}

function getPreset(mode){
return PRESETS[mode]||PRESETS.fixed_harbor;
}

function getBlendedPreset(state){
if(!state)return PRESETS.fixed_harbor;
return Object.freeze({
horizon:state.runtime.horizon,
parallax:state.runtime.parallax,
compassLift:state.runtime.compassLift,
zoom:state.runtime.zoom,
tilt:state.runtime.tilt,
follow:state.runtime.follow
});
}

function getViewportTransform(state,width,height,focusPoint){
const preset=getBlendedPreset(state);
const zoom=preset.zoom||1;
const tilt=preset.tilt||0;
const anchorX=width*0.5;
const anchorY=height*(preset.horizon||0.58);
const focusX=focusPoint&&isFinite(focusPoint.x)?focusPoint.x:0;
const focusY=focusPoint&&isFinite(focusPoint.y)?focusPoint.y:0;
const offsetX=anchorX-(focusX*zoom);
const offsetY=anchorY-((focusY*(1+tilt))*zoom);
return Object.freeze({
zoom:zoom,
tilt:tilt,
offsetX:offsetX,
offsetY:offsetY
});
}

window.OPENWORLD_CAMERA=Object.freeze({
version:"OPENWORLD_CAMERA_v2",
PRESETS:PRESETS,
createState:createState,
blendTo:blendTo,
update:update,
getPreset:getPreset,
getBlendedPreset:getBlendedPreset,
getViewportTransform:getViewportTransform
});
})();
