/* =========================================================
   GEODIAMETRICS BACKGROUND ENGINE v1.4 (STABLE MOTION)
   FIXES
   • Moon completely static (no spin, no drift)
   • Clouds slow cinematic drift
   • Lanterns float slowly upward
   • Water ripple expands outward smoothly
   • No frame-rate speed spikes
   • Dragons handled ONLY by dragon-anatomy.js
========================================================= */

(function(){
"use strict";

/* ---------------------------------------------------------
   CANVAS
--------------------------------------------------------- */

function createCanvas(){
const c=document.createElement("canvas");
c.id="gd_bg_canvas";
c.style.position="fixed";
c.style.inset="0";
c.style.width="100%";
c.style.height="100%";
c.style.pointerEvents="none";
c.style.zIndex="0";
document.body.prepend(c);
return c;
}

function mount(opts){

opts=opts||{};
const canvas=createCanvas();
const ctx=canvas.getContext("2d");

let W=0,H=0,DPR=1;

function resize(){
DPR=Math.min(window.devicePixelRatio||1,1.6);
W=window.innerWidth*DPR;
H=window.innerHeight*DPR;
canvas.width=W;
canvas.height=H;
}
resize();
window.addEventListener("resize",resize);

/* ---------------------------------------------------------
   MOON
--------------------------------------------------------- */

const moonPhase=Math.random();

const moonX=()=>W*0.78;
const moonY=()=>H*0.18;
const moonR=()=>Math.min(W,H)*0.065;

function drawMoon(){

const mx=moonX();
const my=moonY();
const r=moonR();

/* glow */
const g=ctx.createRadialGradient(mx,my,r*0.2,mx,my,r*2.8);
g.addColorStop(0,"rgba(255,245,220,.25)");
g.addColorStop(.5,"rgba(255,200,150,.12)");
g.addColorStop(1,"rgba(0,0,0,0)");

ctx.fillStyle=g;
ctx.beginPath();
ctx.arc(mx,my,r*2.8,0,Math.PI*2);
ctx.fill();

/* moon disc */
ctx.fillStyle="rgba(255,248,230,0.95)";
ctx.beginPath();
ctx.arc(mx,my,r,0,Math.PI*2);
ctx.fill();

/* phase shadow */
const k=Math.cos(moonPhase*Math.PI*2);
const shift=k*r*0.55;

ctx.save();
ctx.beginPath();
ctx.arc(mx,my,r,0,Math.PI*2);
ctx.clip();

ctx.fillStyle="rgba(0,0,0,.6)";
ctx.beginPath();
ctx.arc(mx+shift,my,r,0,Math.PI*2);
ctx.fill();

ctx.restore();

}

/* ---------------------------------------------------------
   CLOUDS (PARALLAX)
--------------------------------------------------------- */

const clouds=[];

for(let i=0;i<20;i++){

clouds.push({
x:Math.random()*W,
y:H*(0.5+Math.random()*0.4),
w:200+Math.random()*400,
h:40+Math.random()*70,
speed:0.02+Math.random()*0.03
});

}

function drawCloud(c){

ctx.globalAlpha=.08;

ctx.fillStyle="rgba(255,210,160,1)";

ctx.beginPath();
ctx.ellipse(c.x,c.y,c.w,c.h,0,0,Math.PI*2);
ctx.fill();

ctx.beginPath();
ctx.ellipse(c.x-c.w*.3,c.y-c.h*.2,c.w*.6,c.h*.8,0,0,Math.PI*2);
ctx.fill();

ctx.beginPath();
ctx.ellipse(c.x+c.w*.3,c.y-c.h*.2,c.w*.6,c.h*.9,0,0,Math.PI*2);
ctx.fill();

ctx.globalAlpha=1;

}

function updateClouds(){

for(const c of clouds){

c.x+=c.speed;

if(c.x>W+c.w) c.x=-c.w;

}

}

/* ---------------------------------------------------------
   LANTERNS
--------------------------------------------------------- */

const lanterns=[];

for(let i=0;i<28;i++){

lanterns.push({
x:Math.random()*W,
y:H+Math.random()*H,
speed:0.05+Math.random()*0.08,
size:2+Math.random()*3
});

}

function updateLanterns(){

for(const l of lanterns){

l.y-=l.speed;

if(l.y<-50){
l.y=H+Math.random()*200;
l.x=Math.random()*W;
}

}

}

function drawLantern(l){

const g=ctx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.size*8);

g.addColorStop(0,"rgba(255,210,140,.6)");
g.addColorStop(.5,"rgba(255,160,90,.2)");
g.addColorStop(1,"rgba(0,0,0,0)");

ctx.fillStyle=g;

ctx.beginPath();
ctx.arc(l.x,l.y,l.size*8,0,Math.PI*2);
ctx.fill();

}

/* ---------------------------------------------------------
   WATER RIPPLE
--------------------------------------------------------- */

let ripple=0;

function drawRipple(){

const cx=W*.5;
const cy=H*.5;
const r=Math.min(W,H)*.32;

ctx.save();

ctx.beginPath();
ctx.arc(cx,cy,r,0,Math.PI*2);
ctx.clip();

for(let i=0;i<8;i++){

const rr=r*(0.2+i*.08+ripple);

ctx.strokeStyle="rgba(255,255,255,.05)";
ctx.lineWidth=1;

ctx.beginPath();
ctx.arc(cx,cy,rr,0,Math.PI*2);
ctx.stroke();

}

ctx.restore();

ripple+=0.0006;

if(ripple>.2) ripple=0;

}

/* ---------------------------------------------------------
   SKY
--------------------------------------------------------- */

function drawSky(){

const g=ctx.createLinearGradient(0,0,0,H);

g.addColorStop(0,"rgba(210,70,40,.25)");
g.addColorStop(.3,"rgba(120,20,20,.12)");
g.addColorStop(.6,"rgba(180,55,30,.15)");
g.addColorStop(1,"rgba(0,0,0,.15)");

ctx.fillStyle=g;
ctx.fillRect(0,0,W,H);

}

/* ---------------------------------------------------------
   LOOP
--------------------------------------------------------- */

function render(){

ctx.clearRect(0,0,W,H);

drawSky();

updateClouds();
for(const c of clouds) drawCloud(c);

updateLanterns();
for(const l of lanterns) drawLantern(l);

drawMoon();

drawRipple();

requestAnimationFrame(render);

}

render();

}

window.GD_BG={mount:mount};

})();
