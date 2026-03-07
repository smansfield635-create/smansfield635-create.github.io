(function(){
"use strict";

const TAU=Math.PI*2;
const HARBOR_RENDERER={};

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
const cy=horizon+92;
const rx=w*0.46;
const ry=h*0.18;
const innerRx=w*0.205;
const innerRy=h*0.078;

ctx.save();

ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);
ctx.ellipse(cx,cy,innerRx,innerRy,0,0,Math.PI,false);
ctx.closePath();

const land=ctx.createLinearGradient(0,horizon-12,0,h);
land.addColorStop(0,"rgba(48,28,24,0.98)");
land.addColorStop(0.38,"rgba(34,20,18,0.99)");
land.addColorStop(1,"rgba(18,10,14,1)");
ctx.fillStyle=land;
ctx.fill();

ctx.lineWidth=2.2;
ctx.strokeStyle="rgba(255,216,164,0.18)";
ctx.stroke();

ctx.globalAlpha=0.18;
ctx.fillStyle="rgba(255,194,132,0.16)";
ctx.beginPath();
ctx.ellipse(cx,cy+10,innerRx*1.34,innerRy*0.76,0,0,TAU);
ctx.fill();

ctx.restore();
}

function drawHarborCliffs(ctx,w,h){
const horizon=h*0.66;
const left=[
{x:0.00,y:horizon+28},
{x:0.08,y:horizon+16},
{x:0.16,y:horizon+22},
{x:0.24,y:horizon+40},
{x:0.32,y:horizon+28},
{x:0.38,y:horizon+48}
];
const right=[
{x:0.62,y:horizon+48},
{x:0.68,y:horizon+28},
{x:0.76,y:horizon+40},
{x:0.84,y:horizon+22},
{x:0.92,y:horizon+16},
{x:1.00,y:horizon+28}
];

ctx.save();
ctx.fillStyle="rgba(38,22,20,0.98)";
ctx.beginPath();
ctx.moveTo(0,h);
ctx.lineTo(0,left[0].y);
for(let i=0;i<left.length;i++)ctx.lineTo(w*left[i].x,left[i].y);
ctx.lineTo(w*0.38,h);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.moveTo(w,h);
ctx.lineTo(w,right[right.length-1].y);
for(let i=right.length-1;i>=0;i--)ctx.lineTo(w*right[i].x,right[i].y);
ctx.lineTo(w*0.62,h);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,214,164,0.10)";
ctx.lineWidth=1.2;
for(let i=0;i<5;i++){
ctx.beginPath();
ctx.moveTo(w*(0.06+i*0.05),horizon+28+i*8);
ctx.lineTo(w*(0.12+i*0.05),horizon+42+i*9);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(w*(0.94-i*0.05),horizon+28+i*8);
ctx.lineTo(w*(0.88-i*0.05),horizon+42+i*9);
ctx.stroke();
}
ctx.restore();
}

function drawHarborWalls(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+78;

const walls=[
{x:cx-w*0.19,y:cy-8,w:w*0.12,h:13},
{x:cx+w*0.07,y:cy-8,w:w*0.12,h:13}
];

ctx.save();
for(let i=0;i<walls.length;i++){
const m=walls[i];
ctx.fillStyle="rgba(92,84,76,0.96)";
ctx.fillRect(m.x,m.y,m.w,m.h);
ctx.fillStyle="rgba(146,134,118,0.26)";
ctx.fillRect(m.x,m.y,m.w,2);

for(let j=0;j<6;j++){
ctx.fillStyle="rgba(72,62,56,0.96)";
ctx.fillRect(m.x+6+j*(m.w-18)/5,m.y-8,6,8);
}
}
ctx.restore();
}

function drawVillageBackLayer(ctx,w,h,tick){
const horizon=h*0.66;
const cx=w*0.5;
const baseY=horizon+44;

const buildings=[
{x:cx-w*0.22,y:baseY-12,w:30,h:24,roof:"merchant",tone:0},
{x:cx-w*0.17,y:baseY-24,w:40,h:32,roof:"pagoda",tone:1},
{x:cx-w*0.12,y:baseY-6,w:28,h:22,roof:"merchant",tone:0},
{x:cx-w*0.05,y:baseY+8,w:34,h:26,roof:"merchant",tone:1},
{x:cx+w*0.05,y:baseY+8,w:34,h:26,roof:"merchant",tone:1},
{x:cx+w*0.12,y:baseY-6,w:28,h:22,roof:"merchant",tone:0},
{x:cx+w*0.17,y:baseY-24,w:40,h:32,roof:"pagoda",tone:1},
{x:cx+w*0.22,y:baseY-12,w:30,h:24,roof:"merchant",tone:0}
];

ctx.save();
for(let i=0;i<buildings.length;i++){
const b=buildings[i];
const body=b.tone===0?"rgba(30,20,20,0.96)":"rgba(36,24,22,0.96)";
ctx.fillStyle=body;
ctx.fillRect(b.x-b.w*0.5,b.y-b.h,b.w,b.h);

if(b.roof==="pagoda"){
ctx.fillStyle="rgba(126,30,24,0.98)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.74,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-14);
ctx.lineTo(b.x+b.w*0.74,b.y-b.h);
ctx.lineTo(b.x+b.w*0.46,b.y-b.h+4);
ctx.lineTo(b.x-b.w*0.46,b.y-b.h+4);
ctx.closePath();
ctx.fill();
}else{
ctx.fillStyle="rgba(194,176,148,0.96)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.60,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-12);
ctx.lineTo(b.x+b.w*0.60,b.y-b.h);
ctx.closePath();
ctx.fill();
}

const flicker=0.18+0.05*Math.sin(tick*0.08+i*0.8);
ctx.fillStyle=`rgba(255,220,156,${flicker})`;
for(let wi=0;wi<3;wi++){
ctx.fillRect(b.x-b.w*0.28+wi*(b.w*0.22),b.y-b.h*0.62,5,8);
}
}
ctx.restore();
}

function drawVillageFrontLayer(ctx,w,h,tick){
const horizon=h*0.66;
const cx=w*0.5;
const baseY=horizon+84;

const buildings=[
{x:cx-w*0.15,y:baseY-8,w:38,h:30,roof:"pagoda"},
{x:cx-w*0.06,y:baseY+10,w:30,h:24,roof:"merchant"},
{x:cx+w*0.06,y:baseY+10,w:30,h:24,roof:"merchant"},
{x:cx+w*0.15,y:baseY-8,w:38,h:30,roof:"pagoda"}
];

ctx.save();
for(let i=0;i<buildings.length;i++){
const b=buildings[i];
ctx.fillStyle="rgba(34,22,22,0.98)";
ctx.fillRect(b.x-b.w*0.5,b.y-b.h,b.w,b.h);

if(b.roof==="pagoda"){
ctx.fillStyle="rgba(150,36,28,0.98)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.72,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-13);
ctx.lineTo(b.x+b.w*0.72,b.y-b.h);
ctx.lineTo(b.x+b.w*0.42,b.y-b.h+4);
ctx.lineTo(b.x-b.w*0.42,b.y-b.h+4);
ctx.closePath();
ctx.fill();
}else{
ctx.fillStyle="rgba(220,198,166,0.98)";
ctx.beginPath();
ctx.moveTo(b.x-b.w*0.58,b.y-b.h);
ctx.lineTo(b.x,b.y-b.h-10);
ctx.lineTo(b.x+b.w*0.58,b.y-b.h);
ctx.closePath();
ctx.fill();
}

const flicker=0.22+0.06*Math.sin(tick*0.09+i*0.7);
ctx.fillStyle=`rgba(255,224,164,${flicker})`;
for(let wi=0;wi<2;wi++){
ctx.fillRect(b.x-b.w*0.18+wi*(b.w*0.22),b.y-b.h*0.60,6,9);
}

ctx.fillStyle="rgba(22,16,16,0.94)";
ctx.fillRect(b.x-4,b.y-12,8,12);
}
ctx.restore();
}

function drawLanternPosts(ctx,w,h,tick){
const horizon=h*0.66;
const posts=[
{x:0.41,y:horizon+94},
{x:0.59,y:horizon+94}
];

ctx.save();
for(let i=0;i<posts.length;i++){
const x=w*posts[i].x;
const y=posts[i].y;

ctx.strokeStyle="rgba(92,70,54,0.96)";
ctx.lineWidth=3;
ctx.beginPath();
ctx.moveTo(x,y);
ctx.lineTo(x,y-32);
ctx.stroke();

const glow=0.22+0.07*Math.sin(tick*0.11+i*1.2);

ctx.fillStyle="rgba(112,20,18,0.96)";
roundedRectPath(ctx,x-8,y-46,16,18,4);
ctx.fill();

ctx.strokeStyle="rgba(255,220,160,0.72)";
ctx.lineWidth=1;
ctx.stroke();

ctx.fillStyle=`rgba(255,216,144,${glow})`;
ctx.fillRect(x-3.5,y-40,7,7);
}
ctx.restore();
}

function drawDocks(ctx,w,h){
const horizon=h*0.66;
const dockY=horizon+88;
const cx=w*0.5;

const docks=[
{x:cx-w*0.12,len:114,beam:10,tilt:-0.06},
{x:cx-w*0.038,len:142,beam:12,tilt:-0.02},
{x:cx+w*0.04,len:136,beam:12,tilt:0.03},
{x:cx+w*0.12,len:112,beam:10,tilt:0.07}
];

ctx.save();

for(let i=0;i<docks.length;i++){
const d=docks[i];
ctx.save();
ctx.translate(d.x,dockY);
ctx.rotate(d.tilt);

ctx.strokeStyle="rgba(84,58,42,0.98)";
ctx.lineWidth=d.beam;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(0,d.len);
ctx.stroke();

ctx.strokeStyle="rgba(166,120,80,0.66)";
ctx.lineWidth=2;
for(let j=0;j<5;j++){
const yy=16+j*22;
ctx.beginPath();
ctx.moveTo(-d.beam*0.9,yy);
ctx.lineTo(d.beam*0.9,yy);
ctx.stroke();
}

ctx.lineWidth=3;
ctx.strokeStyle="rgba(66,44,34,0.96)";
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

function drawCrossPiers(ctx,w,h){
const horizon=h*0.66;
const dockY=horizon+116;
const piers=[
{x:0.35,y:dockY,len:36,dir:-1},
{x:0.65,y:dockY+6,len:40,dir:1}
];

ctx.save();
ctx.strokeStyle="rgba(88,60,42,0.94)";
ctx.lineWidth=7;
for(let i=0;i<piers.length;i++){
const p=piers[i];
const x=w*p.x;
ctx.beginPath();
ctx.moveTo(x,dockY+i*6);
ctx.lineTo(x+(p.len*p.dir),dockY+i*6+10);
ctx.stroke();
}
ctx.restore();
}

function drawBoats(ctx,w,h,tick){
const horizon=h*0.66;
const baseY=horizon+156;
const boats=[
{x:w*0.30,y:baseY+Math.sin(tick*0.018)*2,s:24,dir:1},
{x:w*0.70,y:baseY+Math.sin(tick*0.016+1.4)*2,s:28,dir:-1},
{x:w*0.56,y:baseY-10+Math.sin(tick*0.02+0.7)*1.6,s:18,dir:1}
];

ctx.save();
for(let i=0;i<boats.length;i++){
const b=boats[i];

ctx.fillStyle="rgba(34,22,24,0.98)";
ctx.beginPath();
ctx.moveTo(b.x-b.s,b.y);
ctx.quadraticCurveTo(b.x,b.y+b.s*0.46,b.x+b.s,b.y);
ctx.lineTo(b.x+b.s*0.76,b.y+8);
ctx.lineTo(b.x-b.s*0.76,b.y+8);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(182,154,116,0.74)";
ctx.lineWidth=1.2;
ctx.beginPath();
ctx.moveTo(b.x,b.y-20);
ctx.lineTo(b.x,b.y+1);
ctx.stroke();

ctx.fillStyle="rgba(220,206,184,0.84)";
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

function drawMarketStalls(ctx,w,h){
const horizon=h*0.66;
const stalls=[
{x:0.44,y:horizon+96,w:26,h:14,color:"rgba(182,52,38,0.96)"},
{x:0.56,y:horizon+96,w:26,h:14,color:"rgba(214,154,62,0.96)"}
];

ctx.save();
for(let i=0;i<stalls.length;i++){
const s=stalls[i];
const x=w*s.x;
const y=s.y;
ctx.fillStyle="rgba(28,18,18,0.96)";
ctx.fillRect(x-s.w*0.5,y,s.w,12);

ctx.fillStyle=s.color;
ctx.beginPath();
ctx.moveTo(x-s.w*0.60,y);
ctx.lineTo(x,y-s.h);
ctx.lineTo(x+s.w*0.60,y);
ctx.closePath();
ctx.fill();
}
ctx.restore();
}

function drawNorthPath(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const topY=horizon-26;
const bottomY=horizon+112;

ctx.save();

const g=ctx.createLinearGradient(cx,topY,cx,bottomY);
g.addColorStop(0,"rgba(182,150,112,0.20)");
g.addColorStop(1,"rgba(116,88,64,0.38)");
ctx.fillStyle=g;

ctx.beginPath();
ctx.moveTo(cx-18,topY);
ctx.lineTo(cx+18,topY);
ctx.lineTo(cx+78,bottomY);
ctx.lineTo(cx-78,bottomY);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,224,174,0.18)";
ctx.lineWidth=1.4;
ctx.beginPath();
ctx.moveTo(cx,topY-16);
ctx.lineTo(cx,bottomY);
ctx.stroke();

ctx.fillStyle="rgba(255,218,152,0.88)";
ctx.beginPath();
ctx.moveTo(cx,topY-30);
ctx.lineTo(cx+10,topY-10);
ctx.lineTo(cx,topY-16);
ctx.lineTo(cx-10,topY-10);
ctx.closePath();
ctx.fill();

ctx.restore();
}

function drawInnerBasin(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+122;
const rx=w*0.19;
const ry=h*0.055;

ctx.save();
ctx.strokeStyle="rgba(255,210,150,0.18)";
ctx.lineWidth=2;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.stroke();

const g=ctx.createRadialGradient(cx,cy,16,cx,cy,rx);
g.addColorStop(0,"rgba(255,194,120,0.18)");
g.addColorStop(0.48,"rgba(255,150,88,0.08)");
g.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=g;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.fill();

ctx.restore();
}

function drawWaterBasinGlow(ctx,w,h){
const horizon=h*0.66;
const cx=w*0.5;
const cy=horizon+94;
const rx=w*0.26;
const ry=h*0.085;

ctx.save();

const g=ctx.createRadialGradient(cx,cy,24,cx,cy,rx);
g.addColorStop(0,"rgba(255,196,120,0.24)");
g.addColorStop(0.45,"rgba(255,154,88,0.10)");
g.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=g;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.fill();

ctx.restore();
}

function drawWaterRipples(ctx,w,h,tick){
const horizon=h*0.66;
const startY=horizon+124;
ctx.save();
for(let i=0;i<4;i++){
ctx.beginPath();
for(let x=0;x<=w;x+=16){
const y=startY+i*18+
Math.sin(x*0.018+tick*0.028+i)*2.1+
Math.sin(x*0.006-tick*0.012+i*1.2)*0.8;
if(x===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.strokeStyle=`rgba(255,226,178,${0.032-i*0.005})`;
ctx.lineWidth=0.8;
ctx.stroke();
}
ctx.restore();
}

HARBOR_RENDERER.draw=function(ctx,w,h,tick){
drawHorseshoeTerrain(ctx,w,h);
drawHarborCliffs(ctx,w,h);
drawHarborWalls(ctx,w,h);
drawVillageBackLayer(ctx,w,h,tick);
drawNorthPath(ctx,w,h);
drawLanternPosts(ctx,w,h,tick);
drawMarketStalls(ctx,w,h);
drawVillageFrontLayer(ctx,w,h,tick);
drawDocks(ctx,w,h);
drawCrossPiers(ctx,w,h);
drawBoats(ctx,w,h,tick);
drawInnerBasin(ctx,w,h);
drawWaterBasinGlow(ctx,w,h);
drawWaterRipples(ctx,w,h,tick);
};

window.HARBOR_RENDERER=HARBOR_RENDERER;

})();
