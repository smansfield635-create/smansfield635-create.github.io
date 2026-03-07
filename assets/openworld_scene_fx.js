(function(){
"use strict";

const TAU=Math.PI*2;

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function roundedRectPath(ctx,x,y,w,h,r){
const rr=Math.min(r,w*0.5,h*0.5);
ctx.beginPath();
ctx.moveTo(x+rr,y);
ctx.lineTo(x+w-rr,y);
ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
ctx.lineTo(x+w,y+h-rr);
ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
ctx.lineTo(x+rr,y+h);
ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
ctx.lineTo(x,y+rr);
ctx.quadraticCurveTo(x,y,x+rr,y);
ctx.closePath();
}

function hash(n){
const x=Math.sin(n*127.1)*43758.5453123;
return x-Math.floor(x);
}

function createState(){
return{
fireworks:[],
lockedFace:null,
lockedPulse:0,
overlayAlpha:0
};
}

function triggerLocked(state,face){
state.lockedFace=face;
state.lockedPulse=1;
}

function triggerOverlay(state,alpha){
state.overlayAlpha=Math.max(state.overlayAlpha,alpha||0);
}

function spawnFirework(state,x,y,count,sizeBase){
const particles=[];
const total=count||16;
const base=sizeBase||1.5;

for(let i=0;i<total;i++){
const a=(i/total)*TAU+(hash(i+total)*0.32);
const speed=base*(0.75+hash(i*5.7)*0.65);
particles.push({
x,
y,
vx:Math.cos(a)*speed,
vy:Math.sin(a)*speed,
life:46+Math.floor(hash(i*2.1)*20)
});
}

state.fireworks.push({
particles,
life:60,
maxLife:60
});
}

function decay(state){
state.lockedPulse*=0.93;
state.overlayAlpha*=0.88;

for(let f=state.fireworks.length-1;f>=0;f--){
const burst=state.fireworks[f];
burst.life--;

for(let i=burst.particles.length-1;i>=0;i--){
const p=burst.particles[i];
p.x+=p.vx;
p.y+=p.vy;
p.vx*=0.985;
p.vy*=0.985;
p.vy+=0.012;
p.life--;
if(p.life<=0)burst.particles.splice(i,1);
}

if(burst.life<=0||burst.particles.length===0){
state.fireworks.splice(f,1);
}
}
}

function drawFireworks(ctx,state){
for(let f=0;f<state.fireworks.length;f++){
const burst=state.fireworks[f];
const alpha=burst.life/burst.maxLife;

for(let i=0;i<burst.particles.length;i++){
const p=burst.particles[i];
ctx.save();
ctx.globalAlpha=alpha*0.9;
ctx.fillStyle=i%3===0?"rgba(255,215,120,0.95)":(i%3===1?"rgba(255,82,82,0.92)":"rgba(255,245,225,0.92)");
ctx.shadowBlur=10;
ctx.shadowColor=ctx.fillStyle;
ctx.beginPath();
ctx.arc(p.x,p.y,1.8,0,TAU);
ctx.fill();
ctx.restore();
}
}
}

function drawLockedOverlay(ctx,state,getLockedLabel){
if(state.lockedPulse<=0||!state.lockedFace)return;

const alpha=clamp(state.lockedPulse,0,1);
const w=220;
const h=50;
const x=window.innerWidth*0.5-w*0.5;
const y=window.innerHeight*0.12;

ctx.save();
ctx.globalAlpha=0.82*alpha;
roundedRectPath(ctx,x,y,w,h,16);
ctx.fillStyle="rgba(20,18,28,0.88)";
ctx.fill();
ctx.lineWidth=1.4;
ctx.strokeStyle="rgba(255,215,150,0.52)";
ctx.stroke();
ctx.fillStyle="rgba(255,245,235,0.94)";
ctx.font="700 14px system-ui,Segoe UI,Roboto,sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(typeof getLockedLabel==="function"?getLockedLabel(state.lockedFace):"LOCKED",x+w*0.5,y+h*0.5);
ctx.restore();
}

function drawNavigationOverlay(ctx,state){
if(state.overlayAlpha<=0)return;
ctx.save();
ctx.globalAlpha=clamp(state.overlayAlpha,0,1)*0.22;
ctx.fillStyle="black";
ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
ctx.restore();
}

window.OPENWORLD_SCENE_FX=Object.freeze({
version:"OPENWORLD_SCENE_FX_v1",
createState,
triggerLocked,
triggerOverlay,
spawnFirework,
decay,
drawFireworks,
drawLockedOverlay,
drawNavigationOverlay
});

})();
