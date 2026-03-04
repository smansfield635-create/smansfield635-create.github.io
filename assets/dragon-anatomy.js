/* TNT — /assets/dragon-anatomy.js
   DRAGON ENGINE v5 — CELESTIAL CHINESE DRAGONS
*/

(function(){

"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

console.log("DRAGON ENGINE v5 LOADED");

window.GD_DRAGON = {
  version:"DRAGON_v5",
  mount:function(){}
};

/* CONFIG */

const BODY_WIDTH = 81;
const RADIUS = BODY_WIDTH/2;

const SEGMENTS = 140;
const GAP = 16;

const PASS_MIN=10;
const PASS_MAX=16;

const OFF_MIN=4;
const OFF_MAX=10;

/* CANVAS */

let canvas=document.getElementById("gd_dragon_canvas");

if(!canvas){
canvas=document.createElement("canvas");
canvas.id="gd_dragon_canvas";
canvas.style.position="absolute";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
(document.getElementById("gd-dragon")||document.body).appendChild(canvas);
}

const ctx=canvas.getContext("2d");

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

/* DRAGON CLASS */

class Dragon{

constructor(top){

this.top=top;
this.dir=top?1:-1;

this.color=top?"#0e7c3a":"#b32121";

this.reset();

}

reset(){

this.state="off";
this.timer=rand(OFF_MIN,OFF_MAX);

this.speed=rand(55,68);

this.phase=Math.random()*10;

this.spawn();

}

spawn(){

this.spine=[];

for(let i=0;i<SEGMENTS;i++){

this.spine.push({
x:this.dir>0?-i*GAP:W+i*GAP,
y:(this.top?0.28:0.72)*H
});

}

}

update(dt){

this.timer-=dt;

if(this.state==="off"){
if(this.timer<=0){
this.state="pass";
this.timer=rand(PASS_MIN,PASS_MAX);
}
return;
}

if(this.state==="pass"){
if(this.timer<=0){
this.state="off";
this.timer=rand(OFF_MIN,OFF_MAX);
return;
}
}

let head=this.spine[0];

head.x+=this.dir*this.speed*dt;

let wave=Math.sin(performance.now()*0.002+this.phase)*24;

head.y=(this.top?0.28:0.72)*H+wave;

for(let i=1;i<this.spine.length;i++){

let p=this.spine[i-1];
let c=this.spine[i];

let dx=p.x-c.x;
let dy=p.y-c.y;

let d=Math.hypot(dx,dy)||1;

c.x=p.x-(dx/d)*GAP;
c.y=p.y-(dy/d)*GAP;

}

}

draw(){

if(this.state!=="pass") return;

const left=[];
const right=[];

for(let i=0;i<this.spine.length;i++){

let p=this.spine[i];
let t=i/(this.spine.length-1);

let r=RADIUS*(1-t*0.85);

let nx=0,ny=1;

if(i>0){
let dx=this.spine[i].x-this.spine[i-1].x;
let dy=this.spine[i].y-this.spine[i-1].y;
let l=Math.hypot(dx,dy)||1;
nx=-dy/l;
ny=dx/l;
}

left.push({x:p.x+nx*r,y:p.y+ny*r});
right.push({x:p.x-nx*r,y:p.y-ny*r});

}

/* body */

ctx.beginPath();
ctx.moveTo(left[0].x,left[0].y);

for(let p of left) ctx.lineTo(p.x,p.y);

for(let i=right.length-1;i>=0;i--){
ctx.lineTo(right[i].x,right[i].y);
}

ctx.closePath();

ctx.fillStyle=this.color;
ctx.fill();

ctx.lineWidth=3;
ctx.strokeStyle="black";
ctx.stroke();

/* gold ridge */

ctx.strokeStyle="rgba(212,175,55,0.9)";
ctx.lineWidth=2;

ctx.beginPath();

for(let i=0;i<this.spine.length;i++){
let p=this.spine[i];
ctx.lineTo(p.x,p.y-RADIUS*0.55);
}

ctx.stroke();

/* diamond scales */

ctx.strokeStyle="rgba(255,255,255,0.3)";
ctx.lineWidth=1;

for(let i=12;i<this.spine.length-12;i+=3){

let p=this.spine[i];

ctx.beginPath();

ctx.moveTo(p.x,p.y-4);
ctx.lineTo(p.x+4,p.y);
ctx.lineTo(p.x,p.y+4);
ctx.lineTo(p.x-4,p.y);
ctx.closePath();

ctx.stroke();

}

/* head */

let p=this.spine[0];

ctx.fillStyle="black";

ctx.beginPath();
ctx.ellipse(p.x,p.y,16,11,0,0,Math.PI*2);
ctx.fill();

/* horns */

ctx.strokeStyle="gold";
ctx.lineWidth=2;

ctx.beginPath();
ctx.moveTo(p.x,p.y);
ctx.lineTo(p.x+20,p.y-16);
ctx.moveTo(p.x,p.y);
ctx.lineTo(p.x+20,p.y+16);
ctx.stroke();

/* whiskers */

ctx.strokeStyle="rgba(212,175,55,0.8)";
ctx.lineWidth=2;

ctx.beginPath();

ctx.moveTo(p.x+10,p.y);
ctx.quadraticCurveTo(p.x+30,p.y-15,p.x+60,p.y-8);

ctx.moveTo(p.x+10,p.y);
ctx.quadraticCurveTo(p.x+30,p.y+15,p.x+60,p.y+8);

ctx.stroke();

/* mane */

ctx.strokeStyle="rgba(255,255,255,0.25)";
ctx.lineWidth=1.5;

for(let i=0;i<6;i++){

ctx.beginPath();

ctx.moveTo(p.x-4,p.y-8+i*3);
ctx.quadraticCurveTo(p.x-20,p.y+i*4,p.x-30,p.y+6+i*4);

ctx.stroke();

}

}

}

/* UTIL */

function rand(a,b){
return a+Math.random()*(b-a);
}

/* INIT */

const dragonTop=new Dragon(true);
const dragonBottom=new Dragon(false);

dragonBottom.timer+=rand(3,7);

let last=0;

function frame(t){

if(!last) last=t;

let dt=(t-last)/1000;
last=t;

ctx.clearRect(0,0,W,H);

dragonTop.update(dt);
dragonBottom.update(dt);

dragonTop.draw();
dragonBottom.draw();

requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

})();
