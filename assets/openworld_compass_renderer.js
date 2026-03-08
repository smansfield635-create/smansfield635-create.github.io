(function(){
"use strict";

const TAU=Math.PI*2;

function rotateVertex(x,y,z,rotY,rotX){
const cy=Math.cos(rotY);
const sy=Math.sin(rotY);
const cx=Math.cos(rotX);
const sx=Math.sin(rotX);

const x1=x*cy-z*sy;
const z1=x*sy+z*cy;
const y2=y*cx-z1*sx;
const z2=y*sx+z1*cx;

return{x:x1,y:y2,z:z2};
}

function project(centerX,centerY,x,y,z){
const perspective=420/(420+z);
return{
x:centerX+(x*perspective),
y:centerY+(y*perspective),
z:z,
scale:perspective
};
}

function polyCenter(poly){
let x=0;
let y=0;
for(let i=0;i<poly.length;i++){
x+=poly[i].x;
y+=poly[i].y;
}
return{x:x/poly.length,y:y/poly.length};
}

function getDiamondGeometry(opts){
const cx=opts.centerX;
const cy=opts.centerY;
const size=opts.size||80;
const rotX=opts.rotX||0;
const rotY=opts.rotY||0;

const vertsRaw=[
[0,-1.62,0],
[1.06,0,0],
[0,0,1.06],
[-1.06,0,0],
[0,0,-1.06],
[0,1.62,0]
];

const faces3D=[
{name:"NE",idx:[0,4,1]},
{name:"ES",idx:[0,1,2]},
{name:"SW",idx:[0,2,3]},
{name:"WN",idx:[0,3,4]},
{name:"nE",idx:[5,1,4]},
{name:"sE",idx:[5,2,1]},
{name:"sW",idx:[5,3,2]},
{name:"nW",idx:[5,4,3]}
];

const edges=[
[0,1],[0,2],[0,3],[0,4],
[5,1],[5,2],[5,3],[5,4],
[1,2],[2,3],[3,4],[4,1]
];

const rotated=[];
const pts=[];

for(let i=0;i<vertsRaw.length;i++){
const v=vertsRaw[i];
const p=rotateVertex(v[0]*size,v[1]*size,v[2]*size,rotY,rotX);
rotated.push(p);
pts.push(project(cx,cy,p.x,p.y,p.z));
}

const faces=faces3D.map(function(face){
const poly=face.idx.map(function(i){return pts[i];});
const avgZ=(rotated[face.idx[0]].z+rotated[face.idx[1]].z+rotated[face.idx[2]].z)/3;
return{
name:face.name,
poly:poly,
avgZ:avgZ,
center:polyCenter(poly)
};
}).sort(function(a,b){
return a.avgZ-b.avgZ;
});

return{
pts:pts,
edges:edges,
faces:faces,
centerX:cx,
centerY:cy,
size:size
};
}

function faceFill(name){
if(name==="NE"||name==="nE")return "rgba(162,42,36,0.34)";
if(name==="ES"||name==="sE")return "rgba(128,24,22,0.30)";
if(name==="SW"||name==="sW")return "rgba(92,12,18,0.28)";
return "rgba(116,16,22,0.28)";
}

function drawFace(ctx,face){
ctx.save();
ctx.beginPath();
ctx.moveTo(face.poly[0].x,face.poly[0].y);
for(let i=1;i<face.poly.length;i++)ctx.lineTo(face.poly[i].x,face.poly[i].y);
ctx.closePath();
ctx.fillStyle=faceFill(face.name);
ctx.fill();
ctx.lineWidth=1.1;
ctx.strokeStyle="rgba(255,222,160,0.76)";
ctx.stroke();
ctx.restore();
}

function drawHalo(ctx,geo){
ctx.save();
ctx.globalAlpha=0.14;
ctx.strokeStyle="rgba(255,222,160,0.74)";
ctx.lineWidth=1.0;

ctx.beginPath();
ctx.ellipse(geo.centerX,geo.centerY,geo.size*1.70,geo.size*0.54,0,0,TAU);
ctx.stroke();

ctx.beginPath();
ctx.ellipse(geo.centerX,geo.centerY,geo.size*0.94,geo.size*0.30,0,0,TAU);
ctx.stroke();

ctx.restore();
}

function drawLabels(ctx,geo){
ctx.save();
ctx.fillStyle="rgba(255,236,196,0.92)";
ctx.font='700 11px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("N",geo.centerX,geo.centerY-(geo.size*0.82));
ctx.fillText("S",geo.centerX,geo.centerY+(geo.size*0.82));
ctx.fillText("E",geo.centerX+(geo.size*1.08),geo.centerY);
ctx.fillText("W",geo.centerX-(geo.size*1.08),geo.centerY);
ctx.restore();
}

function drawCompass(ctx,geo,opts){
const settings=opts||{};
if(settings.showHalo)drawHalo(ctx,geo);

for(let i=0;i<geo.faces.length;i++){
drawFace(ctx,geo.faces[i]);
}

ctx.save();
ctx.shadowBlur=14;
ctx.shadowColor="rgba(255,215,120,0.18)";
for(let i=0;i<geo.edges.length;i++){
const e=geo.edges[i];
ctx.beginPath();
ctx.moveTo(geo.pts[e[0]].x,geo.pts[e[0]].y);
ctx.lineTo(geo.pts[e[1]].x,geo.pts[e[1]].y);
ctx.lineWidth=1.4;
ctx.strokeStyle="rgba(255,220,160,0.86)";
ctx.stroke();
}
ctx.restore();

if(settings.showLabels)drawLabels(ctx,geo);
}

window.OPENWORLD_COMPASS_RENDERER=Object.freeze({
version:"OPENWORLD_COMPASS_RENDERER_vL2B",
getDiamondGeometry:getDiamondGeometry,
drawCompass:drawCompass
});
})();
