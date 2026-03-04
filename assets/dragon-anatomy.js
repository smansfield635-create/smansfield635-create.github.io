/* =====================================================
GEODIAMETRICS DRAGON ENGINE
STABLE MOTION VERSION
===================================================== */

(function(){

"use strict";

const canvas=document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.top=0;
canvas.style.left=0;
canvas.style.pointerEvents="none";
canvas.style.zIndex="9";

document.body.appendChild(canvas);

const ctx=canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}

resize();
window.addEventListener("resize",resize);

/* -----------------------------
CONFIG
----------------------------- */

const SEGMENTS=120;
const SPACING=18;
const SPEED=0.35;     // VERY slow
const AMPLITUDE=22;

const spine=[];

for(let i=0;i<SEGMENTS;i++){
spine.push({
x:-i*SPACING,
y:window.innerHeight*0.35
});
}

let phase=0;

/* -----------------------------
HEAD
----------------------------- */

function drawHead(p){

const x=p.x;
const y=p.y;

ctx.fillStyle="#063018";

ctx.beginPath();
ctx.ellipse(x,y,36,26,0,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="#082b17";

ctx.beginPath();
ctx.ellipse(x+20,y+6,26,16,0,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="#ffd54a";

ctx.beginPath();
ctx.arc(x+10,y-4,5,0,Math.PI*2);
ctx.fill();

/* horns */

ctx.strokeStyle="#d4af37";
ctx.lineWidth=2;

ctx.beginPath();
ctx.moveTo(x-8,y-16);
ctx.lineTo(x-24,y-36);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(x+8,y-16);
ctx.lineTo(x-6,y-38);
ctx.stroke();

/* whiskers */

ctx.lineWidth=1.5;

ctx.beginPath();
ctx.moveTo(x+30,y+4);
ctx.lineTo(x+70,y-10);
ctx.stroke();

}

/* -----------------------------
BODY
----------------------------- */

function drawBody(){

for(let i=0;i<spine.length;i++){

const p=spine[i];

const size=30 - i*0.18;

ctx.fillStyle="rgba(6,60,28,0.95)";
ctx.strokeStyle="rgba(212,175,55,0.45)";
ctx.lineWidth=1;

ctx.beginPath();
ctx.ellipse(p.x,p.y,size,size*0.72,0,0,Math.PI*2);
ctx.fill();
ctx.stroke();

/* scale highlight */

if(i%3===0){

ctx.fillStyle="rgba(212,175,55,0.18)";

ctx.beginPath();
ctx.arc(p.x,p.y,size*0.35,0,Math.PI*2);
ctx.fill();

}

}

}

/* -----------------------------
UPDATE
----------------------------- */

function update(){

phase+=0.015;

const head=spine[0];

head.x+=SPEED;

head.y=
window.innerHeight*0.35+
Math.sin(phase)*AMPLITUDE;

if(head.x>window.innerWidth+300){
head.x=-300;
}

/* follow chain */

for(let i=1;i<spine.length;i++){

const prev=spine[i-1];
const cur=spine[i];

const dx=prev.x-cur.x;
const dy=prev.y-cur.y;

const dist=Math.sqrt(dx*dx+dy*dy);

const target=SPACING;

cur.x=prev.x-dx/dist*target;
cur.y=prev.y-dy/dist*target;

}

}

/* -----------------------------
RENDER
----------------------------- */

function render(){

ctx.clearRect(0,0,canvas.width,canvas.height);

update();

drawBody();
drawHead(spine[0]);

requestAnimationFrame(render);

}

render();

})();
