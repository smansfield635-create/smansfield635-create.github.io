(function(){
"use strict";

const HARBOR_RENDERER={};

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function lerp(a,b,t){
return a+(b-a)*t;
}

function roundedRectPath(ctx,x,y,w,h,r){
const rr=Math.min(r,w*0.5,h*0.5);
ctx.beginPath();
ctx.moveTo(x+rr,y);
ctx.lineTo(x+w-rr,y);
ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
ctx.lineTo(x+w,y+h-rr);
ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
ctx.lineTo(x+rr,y+h);
ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
ctx.lineTo(x,y+rr);
ctx.quadraticCurveTo(x,y,x+rr,y);
ctx.closePath();
}

function drawHorseshoeTerrain(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+86;
const rx=w*0.44;
const ry=h*0.17;
const innerRx=w*0.19;
const innerRy=h*0.075;

ctx.save();

ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);
ctx.ellipse(cx,cy,innerRx,innerRy,0,0,Math.PI,false);
ctx.closePath();

const land=ctx.createLinearGradient(0,horizon-10,0,h);
land.addColorStop(0,"rgba(48,28,24,0.96)");
land.addColorStop(0.45,"rgba(34,20,18,0.98)");
land.addColorStop(1,"rgba(20,12,14,1)");
ctx.fillStyle=land;
ctx.fill();

ctx.lineWidth=2;
ctx.strokeStyle="rgba(255,216,164,0.16)";
ctx.stroke();

ctx.globalAlpha=0.22;
ctx.fillStyle="rgba(255,194,132,0.14)";
ctx.beginPath();
ctx.ellipse(cx,cy+8,innerRx*1.25,innerRy*0.72,0,0,Math.PI*2);
ctx.fill();

ctx.restore();
}

function drawHarborWalls(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+74;

const walls=[
{x:cx-w*0.18,y:cy-8,w:w*0.11,h:12},
{x:cx+w*0.07,y:cy-8,w:w*0.11,h:12}
];

ctx.save();
for(let i=0;i<walls.length;i++){
const m=walls[i];
ctx.fillStyle="rgba(90,82,74,0.92)";
ctx.fillRect(m.x,m.y,m.w,m.h);
ctx.fillStyle="rgba(140,128,116,0.28)";
ctx.fillRect(m.x,m.y,m.w,2);

for(let j=0;j<5;j++){
ctx.fillStyle="rgba(72,62,56,0.94)";
ctx.fillRect(m.x+8+j*(m.w-20)/4,m.y-8,6,8);
}
}
ctx.restore();
}

function drawVillage(ctx,w,h,tick){
const horizon=h*0.66;
const cx=w*0.5;
const baseY=horizon+42;

const buildings=[
{x:cx-w*0.19,y:baseY-18,w:34,h:28,roof:"pagoda"},
{x:cx-w*0.145,y:baseY-26,w:42,h:34,roof:"merchant"},
{x:cx-w*0.095,y:baseY-10,w:30,h:24,roof:"merchant"},
{x:cx-w*0.04,y:baseY+8,w:36,h:28,roof:"pagoda"},
{x:cx+w*0.04,y:baseY+8,w:36,h:28,roof:"pagoda"},
{x:cx+w*0.095,y:baseY-10,w:30,h:24,roof:"merchant"},
{x:cx+w*0.145,y:baseY-26,w:42,h:34,roof:"merchant"},
{x:cx+w*0.19,y:baseY-18,w:34,h:28,roof:"pagoda"}
];

ctx.save();

for(let i=0;i<buildings.length;i++){
const b=buildings[i];

ctx.fillStyle="rgba(26,18,18,0.94)";
ctx.fillRect(b.x-b.w*0.5,b.y-b.h,b.w,b.h);

if(b.roof==="pagoda"){
ctx.fillStyle="rgba(120,28,24,0.96)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.72,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-14);
ctx.lineTo(b.x+b.w*0.72,b.y-b.h);
ctx.lineTo(b.x+b.w*0.46,b.y-b.h+4);
ctx.lineTo(b.x-b.w*0.46,b.y-b.h+4);
ctx.closePath();
ctx.fill();

ctx.fillStyle="rgba(88,20,18,0.96)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.46,b.y-b.h+4);
ctx.lineTo(b.x,b.y-b.h-5);
ctx.lineTo(b.x+b.w*0.46,b.y-b.h+4);
ctx.lineTo(b.x+b.w*0.28,b.y-b.h+8);
ctx.lineTo(b.x-b.w*0.28,b.y-b.h+8);
ctx.closePath();
ctx.fill();
}else{
ctx.fillStyle="rgba(188,170,142,0.94)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.60,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-12);
ctx.lineTo(b.x+b.w*0.60,b.y-b.h);
ctx.closePath();
ctx.fill();
}

const flicker=0.18+0.06*Math.sin(tick*0.08+i*0.9);
ctx.fillStyle=`rgba(255,216,150,${flicker})`;
for(let wi=0;wi<3;wi++){
ctx.fillRect(b.x-b.w*0.28+wi*(b.w*0.21),b.y-b.h*0.62,5,8);
}
}

ctx.restore();
}

function drawDocks(ctx,w,h){
const horizon=h*0.66;
const dockY=horizon+82;
const cx=w*0.5;

const docks=[
{x:cx-w*0.11,len:112,beam:10,tilt:-0.05},
{x:cx-w*0.035,len:136,beam:12,tilt:-0.02},
{x:cx+w*0.04,len:128,beam:12,tilt:0.02},
{x:cx+w*0.11,len:106,beam:10,tilt:0.06}
];

ctx.save();

for(let i=0;i<docks.length;i++){
const d=docks[i];
ctx.save();
ctx.translate(d.x,dockY);
ctx.rotate(d.tilt);

ctx.strokeStyle="rgba(84,58,42,0.96)";
ctx.lineWidth=d.beam;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(0,d.len);
ctx.stroke();

ctx.strokeStyle="rgba(160,114,76,0.62)";
ctx.lineWidth=2;
for(let j=0;j<5;j++){
const yy=16+j*22;
ctx.beginPath();
ctx.moveTo(-d.beam*0.9,yy);
ctx.lineTo(d.beam*0.9,yy);
ctx.stroke();
}

ctx.lineWidth=3;
ctx.strokeStyle="rgba(66,44,34,0.94)";
for(let p=14;p<d.len;p+=26){
ctx.beginPath();
ctx.moveTo(-d.beam*0.68,p);
ctx.lineTo(-d.beam*0.68,p+12);
ctx.moveTo(d.beam*0.68,p);
ctx.lineTo(d.beam*0.68,p+12);
ctx.stroke();
}
ctx.restore();
}

ctx.restore();
}

function drawBoats(ctx,w,h,tick){
const horizon=h*0.66;
const baseY=horizon+148;
const boats=[
{x:w*0.31,y:baseY+Math.sin(tick*0.018)*2,s:24,dir:1},
{x:w*0.69,y:baseY+Math.sin(tick*0.016+1.4)*2,s:28,dir:-1}
];

ctx.save();
for(let i=0;i<boats.length;i++){
const b=boats[i];

ctx.fillStyle="rgba(34,22,24,0.96)";
ctx.beginPath();
ctx.moveTo(b.x-b.s,b.y);
ctx.quadraticCurveTo(b.x,b.y+b.s*0.46,b.x+b.s,b.y);
ctx.lineTo(b.x+b.s*0.76,b.y+8);
ctx.lineTo(b.x-b.s*0.76,b.y+8);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(176,150,114,0.72)";
ctx.lineWidth=1.2;
ctx.beginPath();
ctx.moveTo(b.x,b.y-20);
ctx.lineTo(b.x,b.y+1);
ctx.stroke();

ctx.fillStyle="rgba(220,206,184,0.82)";
ctx.beginPath();
if(b.dir>0){
ctx.moveTo(b.x,b.y-20);
ctx.lineTo(b.x+b.s*0.74,b.y-7);
ctx.lineTo(b.x,b.y-3);
}else{
ctx.moveTo(b.x,b.y-20);
ctx.lineTo(b.x-b.s*0.74,b.y-7);
ctx.lineTo(b.x,b.y-3);
}
ctx.closePath();
ctx.fill();
}
ctx.restore();
}

function drawNorthPath(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const topY=horizon-26;
const bottomY=horizon+108;

ctx.save();

const g=ctx.createLinearGradient(cx,topY,cx,bottomY);
g.addColorStop(0,"rgba(170,142,108,0.18)");
g.addColorStop(1,"rgba(110,84,62,0.36)");
ctx.fillStyle=g;

ctx.beginPath();
ctx.moveTo(cx-16,topY);
ctx.lineTo(cx+16,topY);
ctx.lineTo(cx+74,bottomY);
ctx.lineTo(cx-74,bottomY);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,220,170,0.16)";
ctx.lineWidth=1.4;
ctx.beginPath();
ctx.moveTo(cx,topY-16);
ctx.lineTo(cx,bottomY);
ctx.stroke();

ctx.fillStyle="rgba(255,214,150,0.84)";
ctx.beginPath();
ctx.moveTo(cx,topY-28);
ctx.lineTo(cx+10,topY-10);
ctx.lineTo(cx,topY-16);
ctx.lineTo(cx-10,topY-10);
ctx.closePath();
ctx.fill();

ctx.restore();
}

function drawWaterBasinGlow(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+88;
const rx=w*0.24;
const ry=h*0.08;

ctx.save();

const g=ctx.createRadialGradient(cx,cy,24,cx,cy,rx);
g.addColorStop(0,"rgba(255,196,120,0.22)");
g.addColorStop(0.45,"rgba(255,154,88,0.10)");
g.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=g;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.fill();

ctx.restore();
}

HARBOR_RENDERER.draw=function(ctx,w,h,tick){
drawHorseshoeTerrain(ctx,w,h);
drawHarborWalls(ctx,w,h);
drawVillage(ctx,w,h,tick);
drawDocks(ctx,w,h);
drawBoats(ctx,w,h,tick);
drawNorthPath(ctx,w,h);
drawWaterBasinGlow(ctx,w,h);
};

window.HARBOR_RENDERER=HARBOR_RENDERER;

})();
