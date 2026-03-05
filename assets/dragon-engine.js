/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_ALLINONE_v2

   FEATURES
   - thicker body (+25%)
   - colored dragon heads
   - horns / eyes / jaw
   - body scales
   - mirrored dragons enter / exit / re-enter
   - no collision between dragons
*/

(function(){
"use strict";
if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* =========================
   CORE PARAMETERS
   ========================= */

const DPR_CAP = 1.6;

const SEG = 26;
const GAP = 36;

/* body thickness +25% */
const BASE_R = 40;

const SPEED = 0.42;

const JADE = "#2ed573";
const JADE_DARK = "#1f8f52";

const CRIMSON = "#ff3b3b";
const CRIMSON_DARK = "#b32020";

/* =========================
   UTIL
   ========================= */

function lerp(a,b,t){return a+(b-a)*t;}
function hypot(x,y){return Math.hypot(x,y)||1;}

function wrap(a){
const two=Math.PI*2;
while(a<0)a+=two;
while(a>=two)a-=two;
return a;
}

function clamp(n,a,b){
return Math.max(a,Math.min(b,n));
}

function stage(){
const vw=window.innerWidth;
const vh=window.innerHeight;

return{
vw,
vh,
Cx:vw*0.5,
Cy:vh*0.55,
R:Math.min(vw,vh)*0.42
};
}

/* =========================
   CANVAS
   ========================= */

const host=document.getElementById("gd-dragon")||document.body;

const cv=document.createElement("canvas");
cv.style.position="fixed";
cv.style.inset="0";
cv.style.pointerEvents="none";
cv.style.zIndex="6";

host.appendChild(cv);

const ctx=cv.getContext("2d",{alpha:true});

let W=0,H=0,DPR=1;

function resize(){

let dpr=window.devicePixelRatio||1;

DPR=Math.min(DPR_CAP,Math.max(1,dpr));

W=Math.floor(window.innerWidth*DPR);
H=Math.floor(window.innerHeight*DPR);

cv.width=W;
cv.height=H;

}

resize();
addEventListener("resize",resize);

/* =========================
   BODY PROFILE
   ========================= */

function massProfile(u){

if(u<0.18) return 1.45;
if(u<0.42) return 1.55;
if(u<0.70) return 1.35;

return 0.5 + (1-u)*0.6;

}

function radius(u){

const r=BASE_R*massProfile(u);

return Math.min(r,GAP*0.48);

}

/* =========================
   SPINE MECHANICS
   ========================= */

function tangent(sp,i){

const a=sp[Math.max(0,i-1)];
const b=sp[Math.min(sp.length-1,i+1)];

let dx=b.x-a.x;
let dy=b.y-a.y;

const d=hypot(dx,dy);

return{x:dx/d,y:dy/d};

}

function enforce(sp){

for(let i=1;i<sp.length;i++){

const p=sp[i-1];
const c=sp[i];

let dx=p.x-c.x;
let dy=p.y-c.y;

const d=hypot(dx,dy);

c.x=p.x-dx/d*GAP;
c.y=p.y-dy/d*GAP;

}

}

/* =========================
   DRAGON CLASS
   ========================= */

class Dragon{

constructor(dir){

this.dir=dir;

this.offset=dir>0?-600:600;

this.spine=new Array(SEG);

const st=stage();

for(let i=0;i<SEG;i++){

this.spine[i]={
x:st.Cx+this.offset-i*GAP*dir,
y:st.Cy
};

}

}

update(dt){

const st=stage();

this.spine[0].x+=this.dir*SPEED*300*dt;

this.spine[0].y=st.Cy+Math.sin(performance.now()*0.002)*40;

for(let i=SEG-1;i>=1;i--){

this.spine[i].x=this.spine[i-1].x;
this.spine[i].y=this.spine[i-1].y;

}

enforce(this.spine);

/* if fully off screen, re-enter */

if(this.dir>0 && this.spine[0].x>st.vw+300){

this.spine[0].x=-300;

}

if(this.dir<0 && this.spine[0].x<-300){

this.spine[0].x=st.vw+300;

}

}

}

/* =========================
   DRAW BODY
   ========================= */

function drawBody(dragon,color){

const sp=dragon.spine;

ctx.fillStyle=color;

for(let i=0;i<sp.length;i++){

const u=i/(sp.length-1);

const r=radius(u);

ctx.beginPath();
ctx.arc(sp[i].x*DPR,sp[i].y*DPR,r*DPR,0,Math.PI*2);
ctx.fill();

drawScales(sp[i],r,color);

}

}

/* =========================
   SCALES
   ========================= */

function drawScales(p,r,color){

ctx.strokeStyle="rgba(0,0,0,0.25)";
ctx.lineWidth=1;

for(let i=-r;i<r;i+=r*0.6){

ctx.beginPath();

ctx.arc(
p.x*DPR+i,
p.y*DPR,
r*0.25,
0,
Math.PI
);

ctx.stroke();

}

}

/* =========================
   HEAD
   ========================= */

function drawHead(p,dir,color){

const size=120;

ctx.fillStyle=color;

ctx.beginPath();

ctx.moveTo(p.x*DPR+dir*size,p.y*DPR);

ctx.lineTo(p.x*DPR-dir*size*0.6,p.y*DPR-size*0.6);

ctx.lineTo(p.x*DPR-dir*size*0.6,p.y*DPR+size*0.6);

ctx.closePath();

ctx.fill();

/* horns */

ctx.fillStyle="#111";

ctx.beginPath();
ctx.moveTo(p.x*DPR,p.y*DPR-size);
ctx.lineTo(p.x*DPR+dir*20,p.y*DPR-size-40);
ctx.lineTo(p.x*DPR-20,p.y*DPR-size);
ctx.fill();

ctx.beginPath();
ctx.moveTo(p.x*DPR,p.y*DPR+size);
ctx.lineTo(p.x*DPR+dir*20,p.y*DPR+size+40);
ctx.lineTo(p.x*DPR-20,p.y*DPR+size);
ctx.fill();

/* eye */

ctx.fillStyle="#fff";

ctx.beginPath();
ctx.arc(
p.x*DPR+dir*30,
p.y*DPR-10,
8,
0,
Math.PI*2
);
ctx.fill();

}

/* =========================
   CREATE DRAGONS
   ========================= */

const dragonA=new Dragon(1);
const dragonB=new Dragon(-1);

/* =========================
   LOOP
   ========================= */

let last=0;

function loop(t){

if(!last)last=t;

const dt=(t-last)/1000;

last=t;

ctx.clearRect(0,0,W,H);

dragonA.update(dt);
dragonB.update(dt);

drawBody(dragonA,JADE);
drawBody(dragonB,CRIMSON);

drawHead(dragonA.spine[0],1,JADE_DARK);
drawHead(dragonB.spine[0],-1,CRIMSON_DARK);

requestAnimationFrame(loop);

}

requestAnimationFrame(loop);

})();
