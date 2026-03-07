(function(){
"use strict";

const TAU=Math.PI*2;

const DRAGON_RULES=Object.freeze({
BODY_SCALE:0.35,
GLOW_INTENSITY:0.40,
WAKE_INTENSITY:0.30,
REFLECTION_INTENSITY:0.20,
DISTANCE_FACTOR:0.55,
COLOR_DIM:0.72
});

const DRAGON_SEGMENTS=44;
const DRAGON_LAG=0.0092;
const DRAGON_CYCLE_FRAMES=1890;
const WISDOM_DELAY=0.12;

function angleBetween(a,b){
return Math.atan2(b.y-a.y,b.x-a.x);
}

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function getCycleProgress(state){
if(!state.dragonLoop)return null;
return ((state.tick-state.dragonStart)%DRAGON_CYCLE_FRAMES)/DRAGON_CYCLE_FRAMES;
}

function dragonOrbit(geo,t,dragonType,state){

const shell=(geo.size*4.6);

const phase=dragonType==="fear"?0:Math.PI;

const a=t*TAU*(0.86)+phase;

const x=Math.cos(a)*shell + Math.sin(a*2)*shell*0.14;
const y=Math.sin(a)*shell*0.18 - Math.cos(a*0.5)*shell*0.06;
const z=Math.sin(a)*shell*0.30;

return{
x:geo.centerX + x,
y:geo.centerY + y,
z:z/(shell*0.4),
a
};
}

function buildDragonBody(geo,dragonType,delay,state){

const prog=getCycleProgress(state);
if(prog===null)return null;

const points=[];

for(let i=0;i<DRAGON_SEGMENTS;i++){

const raw=prog-delay-i*DRAGON_LAG;
const t=((raw%1)+1)%1;

const p=dragonOrbit(geo,t,dragonType,state);

points.push({
x:p.x,
y:p.y,
z:p.z,
a:p.a,
t
});
}

return{points};
}

function getDragonBundles(geo,state){
return{
fear:buildDragonBody(geo,"fear",0,state),
wisdom:buildDragonBody(geo,"wisdom",WISDOM_DELAY,state)
};
}

function drawDragonBody(ctx,bundle,color){

if(!bundle||!bundle.points)return;

ctx.save();

ctx.lineCap="round";
ctx.lineJoin="round";
ctx.strokeStyle=color;
ctx.lineWidth=3;

ctx.beginPath();

for(let i=0;i<bundle.points.length;i++){

const p=bundle.points[i];

if(i===0)ctx.moveTo(p.x,p.y);
else ctx.lineTo(p.x,p.y);
}

ctx.stroke();

ctx.restore();
}

function drawDragonReflections(ctx,geo,preset,bundles,tick){

const horizon=window.innerHeight*preset.horizon;

const list=[
{bundle:bundles.fear,color:"rgba(255,100,76,0.16)"},
{bundle:bundles.wisdom,color:"rgba(255,214,126,0.14)"}
];

for(let i=0;i<list.length;i++){

const bundle=list[i].bundle;
if(!bundle)return;

ctx.save();

for(let j=0;j<bundle.points.length;j+=2){

const p=bundle.points[j];

const ry=horizon+(horizon-p.y);

ctx.globalAlpha=0.35;

ctx.beginPath();
ctx.ellipse(p.x,ry,6,2,0,0,TAU);
ctx.fillStyle=list[i].color;
ctx.fill();
}

ctx.restore();
}
}

function drawBack(ctx,geo,bundles,tick){

if(bundles.fear)
drawDragonBody(ctx,bundles.fear,"rgba(200,80,60,0.8)");

if(bundles.wisdom)
drawDragonBody(ctx,bundles.wisdom,"rgba(220,200,120,0.8)");
}

function drawFront(ctx,geo,bundles,tick,language,state){

if(bundles.fear)
drawDragonBody(ctx,bundles.fear,"rgba(255,120,100,1)");

if(bundles.wisdom)
drawDragonBody(ctx,bundles.wisdom,"rgba(255,230,160,1)");
}

window.OPENWORLD_DRAGON_RENDERER=Object.freeze({
version:"OPENWORLD_DRAGON_RENDERER_v1",
getDragonBundles,
drawDragonReflections,
drawBack,
drawFront
});

})();
