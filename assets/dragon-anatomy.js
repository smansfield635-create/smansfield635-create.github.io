/* TNT — /assets/dragon-anatomy.js
   DRAGON SILHOUETTE ENGINE
   BUILD: DRAGON_SILHOUETTE_v1
   PURPOSE: render solid dragon body silhouette using spine hull
*/

(function(){
"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = {
version:"DRAGON_SILHOUETTE_v1",
mount:function(){}
};

/* ===== CANVAS ===== */

let canvas=document.createElement("canvas");
canvas.id="gd_dragon_canvas";
canvas.style.position="absolute";
canvas.style.inset="0";
canvas.style.pointerEvents="none";

let host=document.getElementById("gd-dragon")||document.body;
host.appendChild(canvas);

let ctx=canvas.getContext("2d");

let W=0,H=0,DPR=1;

function resize(){
DPR=Math.min(1.6,window.devicePixelRatio||1);
W=Math.floor(window.innerWidth*DPR);
H=Math.floor(window.innerHeight*DPR);
canvas.width=W;
canvas.height=H;
}

resize();
window.addEventListener("resize",resize);

/* ===== DRAGON CONFIG ===== */

const SEG=110;
const GAP=16;
const WIDTH=70;

const SPEED=60;

/* ===== DRAGON ===== */

class Dragon{

constructor(top){

this.top=top;
this.dir=top?1:-1;

this.spine=[];
this.reset();

}

reset(){

this.spine=[];

for(let i=0;i<SEG;i++){

this.spine.push({
x:this.dir>0?-i*GAP:W+i*GAP,
y:(this.top?0.35:0.65)*H
});

}

this.phase=Math.random()*10;

}

update(dt){

let head=this.spine[0];

head.x+=this.dir*SPEED*dt;

let wave=Math.sin(performance.now()*0.002+this.phase)*20;

head.y=(this.top?0.35:0.65)*H+wave;

for(let i=1;i<this.spine.length;i++){

let p=this.spine[i-1];
let c=this.spine[i];

let dx=p.x-c.x;
let dy=p.y-c.y;

let d=Math.hypot(dx,dy)||1;

c.x=p.x-(dx/d)*GAP;
c.y=p.y-(dy/d)*GAP;

}

if(head.x>W+200) head.x=-200;
if(head.x<-200) head.x=W+200;

}

draw(){

let left=[];
let right=[];

for(let i=0;i<this.spine.length;i++){

let p=this.spine[i];
let t=i/(this.spine.length-1);

let r=(WIDTH*(1-t*0.9))*DPR;

let nx=0,ny=1;

if(i>0){

let dx=this.spine[i].x-this.spine[i-1].x;
let dy=this.spine[i].y-this.spine[i-1].y;

let l=Math.hypot(dx,dy)||1;

nx=-dy/l;
ny=dx/l;

}

left.push({
x:p.x+nx*r,
y:p.y+ny*r
});

right.push({
x:p.x-nx*r,
y:p.y-ny*r
});

}

/* BODY SILHOUETTE */

ctx.beginPath();

ctx.moveTo(left[0].x,left[0].y);

for(let p of left) ctx.lineTo(p.x,p.y);

for(let i=right.length-1;i>=0;i--){
ctx.lineTo(right[i].x,right[i].y);
}

ctx.closePath();

ctx.fillStyle=this.top
? "rgba(0,110,60,0.95)"
: "rgba(170,20,20,0.95)";

ctx.fill();

/* SIMPLE HEAD */

let h=this.spine[0];

ctx.fillStyle="black";

ctx.beginPath();
ctx.ellipse(h.x,h.y,18,12,0,0,Math.PI*2);
ctx.fill();

}

}

/* ===== CREATE DRAGONS ===== */

const topDragon=new Dragon(true);
const botDragon=new Dragon(false);

let last=0;

function frame(t){

if(!last) last=t;

let dt=(t-last)/1000;
last=t;

ctx.clearRect(0,0,W,H);

topDragon.update(dt);
botDragon.update(dt);

topDragon.draw();
botDragon.draw();

requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

})();
