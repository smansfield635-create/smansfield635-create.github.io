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

function drawOuterSea(ctx,w,h,horizon){
ctx.save();

const seaTop=horizon-10;
const g=ctx.createLinearGradient(0,seaTop,0,h);
g.addColorStop(0,"rgba(62,74,112,0.26)");
g.addColorStop(0.08,"rgba(44,52,84,0.42)");
g.addColorStop(0.20,"rgba(20,26,44,0.72)");
g.addColorStop(0.42,"rgba(12,18,34,0.92)");
g.addColorStop(1,"rgba(8,12,24,0.98)");
ctx.fillStyle=g;
ctx.fillRect(0,seaTop,w,h-seaTop);

ctx.globalAlpha=0.12;
const glow=ctx.createLinearGradient(0,horizon-18,0,horizon+120);
glow.addColorStop(0,"rgba(255,196,138,0.22)");
glow.addColorStop(0.30,"rgba(110,136,210,0.10)");
glow.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=glow;
ctx.fillRect(0,horizon-18,w,160);

ctx.restore();
}

function drawHarborShoulders(ctx,w,h,horizon){
const left=[
{x:0.00,y:horizon+44},
{x:0.08,y:horizon+24},
{x:0.16,y:horizon+18},
{x:0.24,y:horizon+28},
{x:0.32,y:horizon+48},
{x:0.38,y:horizon+78},
{x:0.42,y:horizon+116},
{x:0.44,y:horizon+154},
{x:0.45,y:h}
];
const right=[
{x:1.00,y:horizon+44},
{x:0.92,y:horizon+24},
{x:0.84,y:horizon+18},
{x:0.76,y:horizon+28},
{x:0.68,y:horizon+48},
{x:0.62,y:horizon+78},
{x:0.58,y:horizon+116},
{x:0.56,y:horizon+154},
{x:0.55,y:h}
];

ctx.save();

const leftGrad=ctx.createLinearGradient(0,horizon,0,h);
leftGrad.addColorStop(0,"rgba(58,34,30,0.94)");
leftGrad.addColorStop(0.38,"rgba(34,20,20,0.98)");
leftGrad.addColorStop(1,"rgba(18,10,14,1)");
ctx.fillStyle=leftGrad;
ctx.beginPath();
ctx.moveTo(0,h);
ctx.lineTo(0,left[0].y);
for(let i=0;i<left.length;i++)ctx.lineTo(w*left[i].x,left[i].y);
ctx.lineTo(w*0.45,h);
ctx.closePath();
ctx.fill();

const rightGrad=ctx.createLinearGradient(0,horizon,0,h);
rightGrad.addColorStop(0,"rgba(58,34,30,0.94)");
rightGrad.addColorStop(0.38,"rgba(34,20,20,0.98)");
rightGrad.addColorStop(1,"rgba(18,10,14,1)");
ctx.fillStyle=rightGrad;
ctx.beginPath();
ctx.moveTo(w,h);
ctx.lineTo(w,right[0].y);
for(let i=1;i<right.length;i++)ctx.lineTo(w*right[i].x,right[i].y);
ctx.lineTo(w*0.55,h);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,220,168,0.10)";
ctx.lineWidth=1.3;
for(let i=0;i<5;i++){
ctx.beginPath();
ctx.moveTo(w*(0.06+i*0.055),horizon+30+i*10);
ctx.lineTo(w*(0.13+i*0.050),horizon+48+i*14);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(w*(0.94-i*0.055),horizon+30+i*10);
ctx.lineTo(w*(0.87-i*0.050),horizon+48+i*14);
ctx.stroke();
}

ctx.restore();
}

function drawHarborMouthWater(ctx,w,h,horizon,tick){
const cx=w*0.5;
const mouthTop=horizon+18;
const mouthBottom=horizon+126;

ctx.save();

const mouth=ctx.createLinearGradient(0,mouthTop,0,mouthBottom);
mouth.addColorStop(0,"rgba(78,94,138,0.36)");
mouth.addColorStop(0.18,"rgba(40,50,82,0.56)");
mouth.addColorStop(0.52,"rgba(18,24,42,0.88)");
mouth.addColorStop(1,"rgba(10,16,30,0.98)");
ctx.fillStyle=mouth;

ctx.beginPath();
ctx.moveTo(cx-w*0.11,mouthTop);
ctx.lineTo(cx+w*0.11,mouthTop);
ctx.lineTo(cx+w*0.19,mouthBottom);
ctx.lineTo(cx-w*0.19,mouthBottom);
ctx.closePath();
ctx.fill();

ctx.globalAlpha=0.18;
ctx.strokeStyle="rgba(255,220,166,0.34)";
ctx.lineWidth=1.5;
ctx.beginPath();
ctx.moveTo(cx-w*0.11,mouthTop+2);
ctx.lineTo(cx-w*0.19,mouthBottom);
ctx.moveTo(cx+w*0.11,mouthTop+2);
ctx.lineTo(cx+w*0.19,mouthBottom);
ctx.stroke();

ctx.globalAlpha=0.16;
for(let i=0;i<4;i++){
ctx.beginPath();
for(let x=-w*0.18;x<=w*0.18;x+=14){
const px=cx+x;
const y=horizon+42+i*16+
Math.sin((x*0.022)+(tick*0.028)+i*0.9)*2.4+
Math.sin((x*0.008)-(tick*0.012)+i*1.4)*1.0;
if(x<=-w*0.18)ctx.moveTo(px,y);
else ctx.lineTo(px,y);
}
ctx.strokeStyle=`rgba(255,232,182,${0.06-(i*0.008)})`;
ctx.lineWidth=0.9;
ctx.stroke();
}

ctx.restore();
}

function drawShelteredBayWater(ctx,w,h,horizon,tick){
const cx=w*0.5;
const cy=horizon+146;
const rx=w*0.235;
const ry=h*0.102;

ctx.save();

const bay=ctx.createRadialGradient(cx,cy-h*0.01,18,cx,cy,rx);
bay.addColorStop(0,"rgba(112,132,188,0.30)");
bay.addColorStop(0.20,"rgba(54,68,108,0.42)");
bay.addColorStop(0.54,"rgba(18,26,48,0.88)");
bay.addColorStop(1,"rgba(10,14,28,0.98)");
ctx.fillStyle=bay;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.fill();

ctx.globalAlpha=0.20;
ctx.strokeStyle="rgba(255,224,172,0.24)";
ctx.lineWidth=2.0;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,0,TAU);
ctx.stroke();

ctx.globalAlpha=0.16;
ctx.strokeStyle="rgba(255,236,196,0.18)";
ctx.lineWidth=1.2;
ctx.beginPath();
ctx.ellipse(cx,cy+8,rx*0.78,ry*0.52,0,0,TAU);
ctx.stroke();

for(let i=0;i<5;i++){
ctx.beginPath();
for(let x=-rx*0.88;x<=rx*0.88;x+=14){
const px=cx+x;
const y=cy-8+i*18+
Math.sin((x*0.020)+(tick*0.026)+i*0.9)*2.8+
Math.sin((x*0.006)-(tick*0.010)+i*1.5)*1.1;
if(x<=-rx*0.88)ctx.moveTo(px,y);
else ctx.lineTo(px,y);
}
ctx.strokeStyle=`rgba(255,230,184,${0.05-(i*0.006)})`;
ctx.lineWidth=0.9;
ctx.stroke();
}

const reflection=ctx.createRadialGradient(cx,cy-14,10,cx,cy-4,rx*0.82);
reflection.addColorStop(0,"rgba(255,214,150,0.18)");
reflection.addColorStop(0.40,"rgba(255,180,122,0.08)");
reflection.addColorStop(1,"rgba(0,0,0,0)");
ctx.fillStyle=reflection;
ctx.beginPath();
ctx.ellipse(cx,cy-4,rx*0.82,ry*0.46,0,0,TAU);
ctx.fill();

ctx.restore();
}

function drawShorelineRims(ctx,w,h,horizon){
const cx=w*0.5;
const cy=horizon+146;
const rx=w*0.235;
const ry=h*0.102;

ctx.save();

ctx.strokeStyle="rgba(255,214,154,0.20)";
ctx.lineWidth=2.2;
ctx.beginPath();
ctx.ellipse(cx,cy,rx,ry,0,Math.PI*0.94,Math.PI*0.06,true);
ctx.stroke();

ctx.strokeStyle="rgba(255,218,160,0.16)";
ctx.lineWidth=2.0;
ctx.beginPath();
ctx.moveTo(cx-w*0.11,horizon+18);
ctx.lineTo(cx-w*0.17,horizon+92);
ctx.moveTo(cx+w*0.11,horizon+18);
ctx.lineTo(cx+w*0.17,horizon+92);
ctx.stroke();

ctx.restore();
}

function drawHarborWalls(ctx,w,h,horizon){
const cx=w*0.5;
const cy=horizon+86;

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

function drawVillageBackLayer(ctx,w,h,horizon,tick){
const cx=w*0.5;
const baseY=horizon+50;

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

function drawVillageFrontLayer(ctx,w,h,horizon,tick){
const cx=w*0.5;
const baseY=horizon+92;

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

function drawLanternPosts(ctx,w,h,horizon,tick){
const posts=[
{x:0.41,y:horizon+102},
{x:0.59,y:horizon+102}
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

function drawNorthPath(ctx,w,h,horizon){
const cx=w*0.5;
const topY=horizon-26;
const bottomY=horizon+120;

ctx.save();

const g=ctx.createLinearGradient(cx,topY,cx,bottomY);
g.addColorStop(0,"rgba(182,150,112,0.18)");
g.addColorStop(1,"rgba(116,88,64,0.30)");
ctx.fillStyle=g;

ctx.beginPath();
ctx.moveTo(cx-16,topY);
ctx.lineTo(cx+16,topY);
ctx.lineTo(cx+76,bottomY);
ctx.lineTo(cx-76,bottomY);
ctx.closePath();
ctx.fill();

ctx.strokeStyle="rgba(255,224,174,0.16)";
ctx.lineWidth=1.3;
ctx.beginPath();
ctx.moveTo(cx,topY-14);
ctx.lineTo(cx,bottomY);
ctx.stroke();

ctx.fillStyle="rgba(255,218,152,0.86)";
ctx.beginPath();
ctx.moveTo(cx,topY-28);
ctx.lineTo(cx+10,topY-10);
ctx.lineTo(cx,topY-16);
ctx.lineTo(cx-10,topY-10);
ctx.closePath();
ctx.fill();

ctx.restore();
}

function drawDockWaterSlot(ctx,w,h,horizon,tick){
const cx=w*0.5;
const topY=horizon+138;
const bottomY=h;

ctx.save();

const slot=ctx.createLinearGradient(0,topY,0,bottomY);
slot.addColorStop(0,"rgba(46,58,92,0.30)");
slot.addColorStop(0.18,"rgba(18,26,46,0.74)");
slot.addColorStop(1,"rgba(6,10,20,0.98)");
ctx.fillStyle=slot;
ctx.beginPath();
ctx.moveTo(cx-w*0.082,topY);
ctx.lineTo(cx+w*0.082,topY);
ctx.lineTo(cx+w*0.050,bottomY);
ctx.lineTo(cx-w*0.050,bottomY);
ctx.closePath();
ctx.fill();

ctx.globalAlpha=0.16;
for(let i=0;i<6;i++){
ctx.beginPath();
for(let x=-w*0.072;x<=w*0.072;x+=14){
const px=cx+x;
const y=topY+10+i*20+
Math.sin((x*0.024)+(tick*0.032)+i*0.9)*2.0+
Math.sin((x*0.008)-(tick*0.012)+i*1.2)*0.8;
if(x<=-w*0.072)ctx.moveTo(px,y);
else ctx.lineTo(px,y);
}
ctx.strokeStyle=`rgba(255,226,182,${0.044-(i*0.005)})`;
ctx.lineWidth=0.8;
ctx.stroke();
}

ctx.restore();
}

function drawDocks(ctx,w,h,horizon){
const dockY=horizon+98;
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

function drawDockReflections(ctx,w,h,horizon,tick){
const cx=w*0.5;
const waterTop=horizon+146;

const lines=[
{x:cx-w*0.12,len:120,tilt:-0.06},
{x:cx-w*0.038,len:146,tilt:-0.02},
{x:cx+w*0.04,len:140,tilt:0.03},
{x:cx+w*0.12,len:116,tilt:0.07}
];

ctx.save();
for(let i=0;i<lines.length;i++){
const d=lines[i];
ctx.save();
ctx.translate(d.x,waterTop+4);
ctx.rotate(d.tilt);
ctx.globalAlpha=0.16;
ctx.strokeStyle="rgba(255,206,146,0.20)";
ctx.lineWidth=3.2;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(0,d.len*0.58);
ctx.stroke();

ctx.globalAlpha=0.10;
ctx.strokeStyle="rgba(255,236,188,0.16)";
ctx.lineWidth=1.1;
for(let j=0;j<4;j++){
const yy=18+j*20+Math.sin(tick*0.028+j+i)*1.4;
ctx.beginPath();
ctx.moveTo(-10,yy);
ctx.lineTo(10,yy+2);
ctx.stroke();
}
ctx.restore();
}
ctx.restore();
}

function drawCrossPiers(ctx,w,h,horizon){
const dockY=horizon+126;
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

function drawBoats(ctx,w,h,horizon,tick){
const baseY=horizon+172;
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

function drawMarketStalls(ctx,w,h,horizon){
const stalls=[
{x:0.44,y:horizon+104,w:26,h:14,color:"rgba(182,52,38,0.96)"},
{x:0.56,y:horizon+104,w:26,h:14,color:"rgba(214,154,62,0.96)"}
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

function drawHarborMist(ctx,w,h,horizon,tick){
const cx=w*0.5;
const baseY=horizon+72;

ctx.save();
ctx.globalAlpha=0.10;

for(let i=0;i<4;i++){
const drift=Math.sin(tick*0.010+i*1.2)*12;
const rise=Math.cos(tick*0.008+i*0.9)*4;
const x=cx+drift+(i-1.5)*34;
const y=baseY-18-(i*10)+rise;
const rx=48-(i*6);
const ry=16-(i*2);

const g=ctx.createRadialGradient(x,y,4,x,y,rx);
g.addColorStop(0,"rgba(232,240,255,0.26)");
g.addColorStop(0.55,"rgba(210,228,248,0.10)");
g.addColorStop(1,"rgba(210,228,248,0)");
ctx.fillStyle=g;
ctx.beginPath();
ctx.ellipse(x,y,rx,ry,0,0,TAU);
ctx.fill();
}

ctx.restore();
}

HARBOR_RENDERER.draw=function(ctx,w,h,tick){
const horizon=h*0.59;

drawOuterSea(ctx,w,h,horizon);
drawHarborShoulders(ctx,w,h,horizon);
drawHarborMouthWater(ctx,w,h,horizon,tick);
drawShelteredBayWater(ctx,w,h,horizon,tick);
drawShorelineRims(ctx,w,h,horizon);
drawHarborWalls(ctx,w,h,horizon);
drawVillageBackLayer(ctx,w,h,horizon,tick);
drawNorthPath(ctx,w,h,horizon);
drawHarborMist(ctx,w,h,horizon,tick);
drawLanternPosts(ctx,w,h,horizon,tick);
drawMarketStalls(ctx,w,h,horizon);
drawVillageFrontLayer(ctx,w,h,horizon,tick);
drawDockWaterSlot(ctx,w,h,horizon,tick);
drawDockReflections(ctx,w,h,horizon,tick);
drawDocks(ctx,w,h,horizon);
drawCrossPiers(ctx,w,h,horizon);
drawBoats(ctx,w,h,horizon,tick);
};

window.HARBOR_RENDERER=HARBOR_RENDERER;

})();
