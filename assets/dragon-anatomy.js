/* TNT — DRAGON ENGINE v3
   Diagnostic-safe version
*/

(function(){

"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__=true;

console.log("DRAGON ENGINE v3 LOADED");

window.GD_DRAGON={
version:"DRAGON_v3",
mount:function(){}
};

const BODY_WIDTH = 81;
const R = BODY_WIDTH/2;

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

let W=0,H=0;

function resize(){
W=window.innerWidth;
H=window.innerHeight;
canvas.width=W;
canvas.height=H;
}

resize();
window.addEventListener("resize",resize);

class Dragon{

constructor(top){

this.top=top;

this.dir=top?1:-1;

this.color=top?"green":"red";

this.spine=[];

for(let i=0;i<90;i++){

this.spine.push({
x:this.dir>0?-i*18:W+i*18,
y:(top?0.35:0.65)*H
});

}

this.phase=Math.random()*10;
this.speed=65;

}

update(dt){

let head=this.spine[0];

head.x+=this.dir*this.speed*dt;

head.y=(this.top?0.35:0.65)*H+
Math.sin(performance.now()*0.002+this.phase)*20;

for(let i=1;i<this.spine.length;i++){

let p=this.spine[i-1];
let c=this.spine[i];

let dx=p.x-c.x;
let dy=p.y-c.y;

let d=Math.hypot(dx,dy)||1;

c.x=p.x-(dx/d)*18;
c.y=p.y-(dy/d)*18;

}

}

draw(){

const left=[],right=[];

for(let i=0;i<this.spine.length;i++){

let p=this.spine[i];

let r=R*(1-i/this.spine.length*0.7);

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

ctx.beginPath();
ctx.moveTo(left[0].x,left[0].y);

for(let p of left) ctx.lineTo(p.x,p.y);
for(let i=right.length-1;i>=0;i--) ctx.lineTo(right[i].x,right[i].y);

ctx.closePath();

ctx.fillStyle=this.color==="green"?"#0f7c3a":"#b71c1c";
ctx.fill();

ctx.lineWidth=4;
ctx.strokeStyle="black";
ctx.stroke();

/* dorsal fins */

ctx.fillStyle="black";

for(let i=8;i<this.spine.length-8;i+=4){

let p=this.spine[i];

ctx.beginPath();
ctx.moveTo(p.x,p.y-R);
ctx.lineTo(p.x+8,p.y-R-12);
ctx.lineTo(p.x-8,p.y-R-12);
ctx.closePath();
ctx.fill();

}

/* visible scales */

ctx.strokeStyle="rgba(255,255,255,0.3)";
ctx.lineWidth=1;

for(let i=10;i<this.spine.length-10;i+=3){

let p=this.spine[i];

ctx.strokeRect(p.x-3,p.y-3,6,6);

}

/* head */

let p=this.spine[0];

ctx.fillStyle="black";

ctx.beginPath();
ctx.arc(p.x,p.y,14,0,Math.PI*2);
ctx.fill();

ctx.strokeStyle="gold";
ctx.lineWidth=3;

ctx.beginPath();
ctx.moveTo(p.x,p.y);
ctx.lineTo(p.x+20,p.y-20);

ctx.moveTo(p.x,p.y);
ctx.lineTo(p.x+20,p.y+20);

ctx.stroke();

}

}

const topDragon=new Dragon(true);
const bottomDragon=new Dragon(false);

let last=0;

function frame(t){

if(!last) last=t;

let dt=(t-last)/1000;
last=t;

ctx.clearRect(0,0,W,H);

topDragon.update(dt);
bottomDragon.update(dt);

topDragon.draw();
bottomDragon.draw();

requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

})();
