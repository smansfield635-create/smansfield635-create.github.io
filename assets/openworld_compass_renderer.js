(function(){
"use strict";

const TAU=Math.PI*2;

function lerp(a,b,t){
return a+(b-a)*t;
}

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
[0,-1.55,0],   // top
[1,0,0],       // east
[0,0,1],       // south
[-1,0,0],      // west
[0,0,-1],      // north
[0,1.55,0]     // bottom
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

function drawFace(ctx,face){
ctx.save();
ctx.beginPath();
ctx.moveTo(face.poly[0].x,face.poly[0].y);
for(let i=1;i<face.poly.length;i++)ctx.lineTo(face.poly[i].x,face.poly[i].y);
ctx.closePath();
ctx.fillStyle="rgba(96,12,18,0.34)";
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
ctx.ellipse(geo.centerX,geo.centerY,geo.size*1.65,geo.size*0.52,0,0,TAU);
ctx.stroke();
ctx.restore();
}

function drawLabels(ctx,geo){
ctx.save();
ctx.fillStyle="rgba(255,236,196,0.92)";
ctx.font='700 11px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("N",geo.centerX,geo.centerY-(geo.size*0.78));
ctx.fillText("S",geo.centerX,geo.centerY+(geo.size*0.78));
ctx.fillText("E",geo.centerX+(geo.size*1.05),geo.centerY);
ctx.fillText("W",geo.centerX-(geo.size*1.05),geo.centerY);
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
version:"OPENWORLD_COMPASS_RENDERER_vL2",
getDiamondGeometry:getDiamondGeometry,
drawCompass:drawCompass
});
})();
