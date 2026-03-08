(function(){
"use strict";

function createState(){
return{
fireworks:[],
overlay:0,
lockedFace:null
};
}

function triggerOverlay(state,intensity){
if(!state)return;
const v=typeof intensity==="number"&&isFinite(intensity)?intensity:0;
state.overlay=Math.max(state.overlay,v);
}

function triggerLocked(state,face){
if(!state)return;
state.lockedFace=face||null;
state.overlay=Math.max(state.overlay,0.22);
}

function spawnFirework(state,x,y,count,sizeBase){
if(!state)return;
state.fireworks.push({
x:typeof x==="number"?x:0,
y:typeof y==="number"?y:0,
life:1,
count:typeof count==="number"?count:10,
sizeBase:typeof sizeBase==="number"?sizeBase:1
});
if(state.fireworks.length>16){
state.fireworks.splice(0,state.fireworks.length-16);
}
}

function decay(state){
if(!state)return;
state.overlay*=0.92;
for(let i=state.fireworks.length-1;i>=0;i--){
state.fireworks[i].life*=0.90;
if(state.fireworks[i].life<0.05){
state.fireworks.splice(i,1);
}
}
}

function drawFireworks(ctx,state){
if(!state||!state.fireworks||!state.fireworks.length)return;

ctx.save();
for(let i=0;i<state.fireworks.length;i++){
const fw=state.fireworks[i];
ctx.globalAlpha=fw.life*0.45;
ctx.strokeStyle="rgba(255,220,150,0.92)";
ctx.lineWidth=1;
for(let j=0;j<fw.count;j++){
const a=(j/fw.count)*Math.PI*2;
const r=(14+fw.sizeBase*8)*(1-fw.life+0.15);
ctx.beginPath();
ctx.moveTo(fw.x,fw.y);
ctx.lineTo(fw.x+Math.cos(a)*r,fw.y+Math.sin(a)*r);
ctx.stroke();
}
}
ctx.restore();
}

function drawLockedOverlay(ctx,state,getLockedLabel){
if(!state||!state.lockedFace||state.overlay<0.04)return;

ctx.save();
ctx.globalAlpha=Math.min(0.26,state.overlay*0.8);
ctx.fillStyle="rgba(120,18,18,0.55)";
ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
ctx.globalAlpha=Math.min(0.9,state.overlay*2.0);
ctx.fillStyle="rgba(255,235,210,0.96)";
ctx.font='700 18px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
const label=typeof getLockedLabel==="function"?getLockedLabel(state.lockedFace):"LOCKED";
ctx.fillText(label,window.innerWidth*0.5,window.innerHeight*0.18);
ctx.restore();
}

function drawNavigationOverlay(ctx,state){
if(!state||state.overlay<0.02)return;

ctx.save();
ctx.globalAlpha=Math.min(0.18,state.overlay*0.4);
ctx.fillStyle="rgba(255,215,120,0.30)";
ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
ctx.restore();
}

window.OPENWORLD_SCENE_FX=Object.freeze({
version:"OPENWORLD_SCENE_FX_v1",
createState:createState,
triggerOverlay:triggerOverlay,
triggerLocked:triggerLocked,
spawnFirework:spawnFirework,
decay:decay,
drawFireworks:drawFireworks,
drawLockedOverlay:drawLockedOverlay,
drawNavigationOverlay:drawNavigationOverlay
});
})();
