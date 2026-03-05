/* TNT — /assets/dragon-engine.js
   DRAGON HEX SILHOUETTE ENGINE
   BUILD: DRAGON_HEX_L3
*/

(function(){

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

const HEX = 3;           // <-- resolution (3px hex)
const SPINE_LEN = 36;
const SHOULDER = 6;

const canvas=document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
document.body.appendChild(canvas);

const ctx=canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

function hexToXY(q,r){
const x = HEX * Math.sqrt(3) * (q + r/2);
const y = HEX * 1.5 * r;
return [x,y];
}

function hexDisk(q,r,rad){
const cells=[];
for(let dq=-rad;dq<=rad;dq++){
const r1=Math.max(-rad,-dq-rad);
const r2=Math.min(rad,-dq+rad);
for(let dr=r1;dr<=r2;dr++){
cells.push([q+dq,r+dr]);
}
}
return cells;
}

function radiusProfile(i){
const u=i/(SPINE_LEN-1);

if(u<0.08) return 5;
if(u<0.20) return 3;
if(u<0.35) return 6;
if(u<0.60) return 5;
if(u<0.80) return 3;
if(u<0.92) return 2;
if(u<0.97) return 1;

return 0;
}

function buildDragonCells(headQ,headR){

const cells=new Set();

for(let i=0;i<SPINE_LEN;i++){

const q=headQ-i;
const r=headR;

const rad=radiusProfile(i);

const disk=hexDisk(q,r,rad);

for(const c of disk){
cells.add(c[0]+","+c[1]);
}

}

return cells;

}

function drawHex(q,r,color){

const [x,y]=hexToXY(q,r);

ctx.beginPath();

for(let i=0;i<6;i++){
const ang=Math.PI/3*i + Math.PI/6;
const px=x + HEX*Math.cos(ang);
const py=y + HEX*Math.sin(ang);

if(i===0) ctx.moveTo(px,py);
else ctx.lineTo(px,py);
}

ctx.closePath();

ctx.fillStyle=color;
ctx.fill();

}

let t=0;

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const cx=canvas.width/2;
const cy=canvas.height/2;

const q0=Math.floor(cx/(HEX*Math.sqrt(3)));
const r0=Math.floor(cy/(HEX*1.5));

t+=0.02;

const topCells=buildDragonCells(q0-40+Math.floor(Math.sin(t)*6),r0-20);
const botCells=buildDragonCells(q0+40+Math.floor(Math.sin(t+1.4)*6),r0+20);

ctx.save();
ctx.translate(cx,cy);

for(const key of topCells){

const [q,r]=key.split(",").map(Number);

drawHex(q-q0,r-r0,"#0e7c3a");

}

for(const key of botCells){

const [q,r]=key.split(",").map(Number);

drawHex(q-q0,r-r0,"#b32121");

}

ctx.restore();

requestAnimationFrame(frame);

}

frame();

})();
