/* =====================================================
GEODIAMETRICS DRAGON ENGINE
HEX SCALE VERSION
Slow motion · Thick body · True dragon feel
===================================================== */

(function(){

"use strict";

/* -----------------------------------------
Canvas
----------------------------------------- */

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


/* -----------------------------------------
CONFIG
----------------------------------------- */

const SEGMENTS=140;
const SPACING=16;

const SPEED=0.22;        // VERY slow
const AMPLITUDE=18;

const BODY_SIZE=34;

const spine=[];

for(let i=0;i<SEGMENTS;i++){

spine.push({
x:-i*SPACING,
y:window.innerHeight*0.35
})

}

let phase=0;


/* -----------------------------------------
HEX SCALE
----------------------------------------- */

function drawHex(x,y,r){

ctx.beginPath();

for(let i=0;i<6;i++){

const a=Math.PI/3*i;

const px=x+r*Math.cos(a);
const py=y+r*Math.sin(a);

if(i===0) ctx.moveTo(px,py);
else ctx.lineTo(px,py);

}

ctx.closePath();

}


/* -----------------------------------------
DRAW BODY
----------------------------------------- */

function drawBody(){

for(let i=0;i<spine.length;i++){

const p=spine[i];

const size=BODY_SIZE - i*0.18;

ctx.fillStyle="rgba(6,60,28,0.96)";

ctx.beginPath();
ctx.ellipse(p.x,p.y,size,size*0.72,0,0,Math.PI*2);
ctx.fill();

/* scale grid */

const scale=size*0.28;

for(let sx=-1;sx<=1;sx++){
for(let sy=-1;sy<=1;sy++){

const px=p.x+sx*scale*1.6;
const py=p.y+sy*scale*1.6;

ctx.strokeStyle="rgba(212,175,55,0.35)";
ctx.lineWidth=0.8;

drawHex(px,py,scale*0.55);
ctx.stroke();

}

}

}

}


/* -----------------------------------------
HEAD
----------------------------------------- */

function drawHead(p){

const x=p.x;
const y=p.y;

/* skull */

ctx.fillStyle="#063018";

ctx.beginPath();
ctx.ellipse(x,y,42,28,0,0,Math.PI*2);
ctx.fill();

/* jaw */

ctx.fillStyle="#082b17";

ctx.beginPath();
ctx.ellipse(x+26,y+8,32,20,0,0,Math.PI*2);
ctx.fill();

/* eye */

ctx.fillStyle="#ffd54a";

ctx.beginPath();
ctx.arc(x+12,y-4,5,0,Math.PI*2);
ctx.fill();

/* horns */

ctx.strokeStyle="#d4af37";
ctx.lineWidth=2;

ctx.beginPath();
ctx.moveTo(x-8,y-16);
ctx.lineTo(x-28,y-40);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(x+10,y-16);
ctx.lineTo(x-6,y-44);
ctx.stroke();

/* whiskers */

ctx.lineWidth=1.6;

ctx.beginPath();
ctx.moveTo(x+40,y+4);
ctx.lineTo(x+90,y-16);
ctx.stroke();

}


/* -----------------------------------------
UPDATE MOTION
----------------------------------------- */

function update(){

phase+=0.012;

const head=spine[0];

head.x+=SPEED;

head.y=
window.innerHeight*0.35+
Math.sin(phase)*AMPLITUDE;

if(head.x>window.innerWidth+400){
head.x=-400;
}


/* spine follow */

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


/* -----------------------------------------
RENDER LOOP
----------------------------------------- */

function render(){

ctx.clearRect(0,0,canvas.width,canvas.height);

update();

drawBody();
drawHead(spine[0]);

requestAnimationFrame(render);

}

render();

})();
