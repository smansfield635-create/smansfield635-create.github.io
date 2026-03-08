(function(){
"use strict";

function createState(){
return{
mode:"idle",
targets:[]
};
}

function refreshTargets(state,w,h){
if(!state)return;
state.targets=[
{x:w*0.38,y:h*0.42},
{x:w*0.50,y:h*0.36},
{x:w*0.62,y:h*0.42}
];
}

function start(state,cube,dispatch,spawnFirework){
if(!state)return;
state.mode="show";
if(typeof dispatch==="function")dispatch("morph:open",{});
if(cube&&typeof spawnFirework==="function"){
spawnFirework(cube.centerX,cube.centerY,12,1.5);
}
}

function close(state,dispatch){
if(!state)return;
state.mode="idle";
if(typeof dispatch==="function")dispatch("morph:close",{mode:"return"});
}

function update(state,onReturnComplete){
if(!state)return;
if(state.mode==="return"){
state.mode="idle";
if(typeof onReturnComplete==="function")onReturnComplete();
}
}

function drawFragments(ctx,state,tick){
if(!state||state.mode==="idle"||!state.targets||!state.targets.length)return;

ctx.save();
ctx.globalAlpha=0.18;
ctx.fillStyle="rgba(255,220,160,0.72)";
for(let i=0;i<state.targets.length;i++){
const t=state.targets[i];
const r=6+Math.sin(tick*0.03+i)*2;
ctx.beginPath();
ctx.arc(t.x,t.y,r,0,Math.PI*2);
ctx.fill();
}
ctx.restore();
}

function drawCompass(ctx,state){
if(!state||state.mode!=="show")return;

ctx.save();
ctx.globalAlpha=0.12;
ctx.strokeStyle="rgba(255,220,160,0.82)";
ctx.lineWidth=1.2;
ctx.beginPath();
ctx.arc(window.innerWidth*0.5,window.innerHeight*0.5,38,0,Math.PI*2);
ctx.stroke();
ctx.restore();
}

window.OPENWORLD_SHOWROOM_RENDERER=Object.freeze({
version:"OPENWORLD_SHOWROOM_RENDERER_v1",
createState:createState,
refreshTargets:refreshTargets,
start:start,
close:close,
update:update,
drawFragments:drawFragments,
drawCompass:drawCompass
});
})();
