/* TNT — /assets/dragon-anatomy.js
   DRAGON ENGINE — SILHOUETTE vB
*/

(function(){
"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = { version:"DRAGON_SILHOUETTE_vB", mount:function(){} };

let canvas=document.createElement("canvas");
canvas.style.position="absolute";
canvas.style.inset="0";
canvas.style.pointerEvents="none";

(document.getElementById("gd-dragon")||document.body).appendChild(canvas);

let ctx=canvas.getContext("2d");

let W=0,H=0,DPR=1;

function resize(){
DPR=Math.min(1.6,window.devicePixelRatio||1);
W=canvas.width=Math.floor(window.innerWidth*DPR);
H=canvas.height=Math.floor(window.innerHeight*DPR);
}
resize();
window.addEventListener("resize",resize);

const SEG=130;
const GAP=16;
const SPEED=50;
const BODY=70;

class Dragon{

constructor(top){
this.top=top;
this.dir=top?1:-1;
this.spine=[];
this.reset();
}

reset(){
for(let i=0;i<SEG;i++){
this.spine.push({
x:(this.dir>0?-i*GAP:W+i*GAP),
y:(this.top?0.34:0.66)*H
});
}
}

update(dt){

let head=this.spine[0];
head.x+=this.dir*SPEED*dt;

let wave=Math.sin(performance.now()*0.002)*18;
head.y=(this.top?0.34:0.66)*H+wave;

for(let i=1;i<SEG;i++){

let p=this.spine[i-1];
let c=this.spine[i];

let dx=p.x-c.x;
let dy=p.y-c.y;

let d=Math.hypot(dx,dy)||1;

c.x=p.x-(dx/d)*GAP;
c.y=p.y-(dy/d)*GAP;

}

if(head.x>W+250) head.x=-250;
if(head.x<-250) head.x=W+250;

}

draw(color){

for(let i=SEG-1;i>=0;i--){

let p=this.spine[i];
let t=i/(SEG-1);

/* neck bulge */
let profile=(1-t);
if(t<0.15) profile=0.8+(t*1.2);

/* tail taper */
if(t>0.75) profile=0.25*(1-t);

let r=(BODY*profile)*DPR;

ctx.beginPath();
ctx.ellipse(p.x,p.y,r,r*0.65,0,0,Math.PI*2);
ctx.fillStyle=color;
ctx.fill();

}

let h=this.spine[0];

ctx.beginPath();
ctx.ellipse(h.x,h.y,20,14,0,0,Math.PI*2);
ctx.fillStyle="black";
ctx.fill();

}

}

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

topDragon.draw("rgba(0,120,60,0.95)");
botDragon.draw("rgba(170,20,20,0.95)");

requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

})();
