/* =====================================================
   GEODIAMETRICS DRAGON ANATOMY ENGINE — RIBBON MESH
   FILE: /assets/dragon-anatomy.js
   TNT: FULL FILE REPLACEMENT

   FEATURES
   - Ribbon mesh body (dragon silhouette)
   - Thick torso profile taper
   - Dorsal spikes
   - Belly shading
   - Honeycomb scale glints
   - Singleton guard (prevents duplicate loops)
   - dt-based motion (speed stable)

   ENGLISH-ONLY VISUAL PASS
   NO NEW gd_* KEYS
===================================================== */

(function(){
"use strict";

/* =====================================================
   SINGLETON GUARD
===================================================== */

if (window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

/* =====================================================
   CONFIG
===================================================== */

const CFG = {
speed: 48,          // px/sec (stable readable motion)
segments: 120,
girth: 4.8,         // THICK dragon
amplitude: 20,
laneY: 0.30
};

/* allow index override */
if(window.__GD_DRAGON_CFG__){
Object.assign(CFG,window.__GD_DRAGON_CFG__);
}

/* public API */

window.GD_DRAGON = {
mount(opts){
Object.assign(CFG,opts||{});
},
version:"RIBBON_DRAGON_v1"
};

/* =====================================================
   CANVAS
===================================================== */

let canvas=document.getElementById("gd_dragon_canvas");

if(!canvas){
canvas=document.createElement("canvas");
canvas.id="gd_dragon_canvas";
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="9";
document.body.appendChild(canvas);
}

const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});

let W=0,H=0,DPR=1;

function resize(){
let dpr=window.devicePixelRatio||1;
DPR=Math.min(1.6,Math.max(1,dpr));

W=Math.floor(window.innerWidth*DPR);
H=Math.floor(window.innerHeight*DPR);

canvas.width=W;
canvas.height=H;
}

resize();
window.addEventListener("resize",resize);

/* =====================================================
   SPINE
===================================================== */

let spine=[];
function initSpine(){
spine=[];
for(let i=0;i<CFG.segments;i++){
spine.push({
x:-i*18*DPR,
y:H*CFG.laneY
});
}
}
initSpine();

/* =====================================================
   PROFILE (thick torso taper)
===================================================== */

function radius(i){
const t=i/(spine.length-1);

if(t<0.12) return 22*CFG.girth*DPR*(0.5+t*2);
if(t<0.45) return 30*CFG.girth*DPR;
if(t<0.75) return 28*CFG.girth*DPR*(1-(t-0.45));
return 10*CFG.girth*DPR*(1-t);
}

/* =====================================================
   NORMAL + TANGENT
===================================================== */

function normal(i){

const p0=spine[Math.max(0,i-1)];
const p1=spine[Math.min(spine.length-1,i+1)];

let dx=p1.x-p0.x;
let dy=p1.y-p0.y;

let len=Math.hypot(dx,dy)||1;

dx/=len;
dy/=len;

/* perpendicular */

return {x:-dy,y:dx};
}

/* =====================================================
   DRAW BODY (RIBBON MESH)
===================================================== */

function drawBody(){

const left=[];
const right=[];

for(let i=0;i<spine.length;i++){

const n=normal(i);
const r=radius(i);

left.push({
x:spine[i].x+n.x*r,
y:spine[i].y+n.y*r
});

right.push({
x:spine[i].x-n.x*r,
y:spine[i].y-n.y*r
});
}

/* main fill */

ctx.beginPath();

ctx.moveTo(left[0].x,left[0].y);

for(let p of left){
ctx.lineTo(p.x,p.y);
}

for(let i=right.length-1;i>=0;i--){
ctx.lineTo(right[i].x,right[i].y);
}

ctx.closePath();

ctx.fillStyle="rgba(0,70,40,0.95)";
ctx.fill();

/* belly shading */

ctx.globalAlpha=0.45;

ctx.beginPath();

for(let i=0;i<spine.length;i++){
const p=spine[i];
ctx.lineTo(p.x,p.y+radius(i)*0.4);
}

ctx.strokeStyle="rgba(0,0,0,0.4)";
ctx.lineWidth=radius(2)*0.3;
ctx.stroke();

ctx.globalAlpha=1;

/* rim highlight */

ctx.strokeStyle="rgba(255,255,255,0.12)";
ctx.lineWidth=2*DPR;

ctx.beginPath();

for(let p of left){
ctx.lineTo(p.x,p.y);
}

ctx.stroke();
}

/* =====================================================
   DORSAL SPIKES
===================================================== */

function drawSpikes(){

ctx.fillStyle="rgba(0,55,30,1)";

for(let i=6;i<spine.length-6;i+=4){

const p=spine[i];
const n=normal(i);

const r=radius(i);

ctx.beginPath();

ctx.moveTo(p.x+n.x*r,p.y+n.y*r);

ctx.lineTo(
p.x+n.x*(r+14*DPR),
p.y+n.y*(r+14*DPR)
);

ctx.lineTo(
p.x+n.x*(r*0.5),
p.y+n.y*(r*0.5)
);

ctx.closePath();
ctx.fill();
}
}

/* =====================================================
   SCALE GLINTS (honeycomb illusion)
===================================================== */

function drawScales(){

ctx.strokeStyle="rgba(255,255,255,0.08)";
ctx.lineWidth=1.2*DPR;

for(let i=8;i<spine.length-8;i+=3){

const p=spine[i];
const r=radius(i)*0.6;

ctx.beginPath();

ctx.arc(p.x,p.y,r,0.2,1.6);

ctx.stroke();
}
}

/* =====================================================
   HEAD
===================================================== */

function drawHead(){

const p=spine[0];

const s=radius(0)*1.2;

/* skull */

ctx.fillStyle="rgba(0,80,45,1)";

ctx.beginPath();
ctx.ellipse(p.x,p.y,s,s*0.7,0,0,Math.PI*2);
ctx.fill();

/* snout */

ctx.beginPath();
ctx.ellipse(p.x+s*0.9,p.y+s*0.1,s*0.9,s*0.5,0,0,Math.PI*2);
ctx.fill();

/* eye */

ctx.fillStyle="rgba(212,175,55,1)";
ctx.beginPath();
ctx.arc(p.x+s*0.3,p.y-s*0.1,s*0.12,0,Math.PI*2);
ctx.fill();

/* whiskers */

ctx.strokeStyle="rgba(212,175,55,0.6)";
ctx.lineWidth=2*DPR;

ctx.beginPath();
ctx.moveTo(p.x+s*1.4,p.y);
ctx.lineTo(p.x+s*2.3,p.y-s*0.4);

ctx.moveTo(p.x+s*1.4,p.y);
ctx.lineTo(p.x+s*2.2,p.y+s*0.5);

ctx.stroke();
}

/* =====================================================
   MOTION
===================================================== */

let phase=Math.random()*10;
let last=0;

function step(t){

if(!last) last=t;

const dt=(t-last)/1000;
last=t;

phase+=dt;

/* head motion */

const head=spine[0];

head.x+=CFG.speed*DPR*dt;

head.y=H*CFG.laneY+Math.sin(phase*2)*CFG.amplitude*DPR;

/* wrap */

if(head.x>W+300*DPR){
head.x=-300*DPR;
}

/* follow */

const target=18*DPR;

for(let i=1;i<spine.length;i++){

const prev=spine[i-1];
const cur=spine[i];

let dx=prev.x-cur.x;
let dy=prev.y-cur.y;

let dist=Math.hypot(dx,dy)||1;

cur.x=prev.x-(dx/dist)*target;
cur.y=prev.y-(dy/dist)*target;
}
}

/* =====================================================
   RENDER LOOP
===================================================== */

function render(t){

ctx.clearRect(0,0,W,H);

step(t);

drawBody();
drawSpikes();
drawScales();
drawHead();

requestAnimationFrame(render);
}

requestAnimationFrame(render);

})();
