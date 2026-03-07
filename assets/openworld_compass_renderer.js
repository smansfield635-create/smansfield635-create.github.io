(function(){
"use strict";

const TAU=Math.PI*2;

function lerp(a,b,t){return a+(b-a)*t;}

function polyCenter(poly){
let x=0,y=0;
for(let i=0;i<poly.length;i++){
x+=poly[i].x;
y+=poly[i].y;
}
return{x:x/poly.length,y:y/poly.length};
}

function insetPoly(poly,amount){
const c=polyCenter(poly);
return poly.map(p=>({
x:lerp(p.x,c.x,amount),
y:lerp(p.y,c.y,amount)
}));
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

function project(w,h,preset,req,x,y,z){

const perspective=420/(420+z+preset.perspectiveBias);

return{
x:w*0.5+x*perspective,
y:h*(preset.cubeYOffset+0.26)+y*perspective,
scale:perspective
};

}

function getCubeGeometry(opts){

const w=opts.width;
const h=opts.height;
const preset=opts.preset;
const rotX=opts.rotX;
const rotY=opts.rotY;

const size=Math.min(w,h)*preset.cubeScale;

const verts=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];

const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];

const faces3D={
M:[0,1,2,3],
C:[4,5,6,7],
W:[0,3,7,4],
E:[1,2,6,5],
N:[3,2,6,7],
S:[0,1,5,4]
};

const rotated=[];
const pts=[];

for(const v of verts){

const p=rotateVertex(v[0]*size,v[1]*size,v[2]*size,rotY,rotX);

rotated.push(p);

pts.push(project(w,h,preset,opts.cameraRequested,p.x,p.y,p.z));

}

const faces2D={
M:[pts[0],pts[1],pts[2],pts[3]],
C:[pts[4],pts[5],pts[6],pts[7]],
W:[pts[0],pts[3],pts[7],pts[4]],
E:[pts[1],pts[2],pts[6],pts[5]],
N:[pts[3],pts[2],pts[6],pts[7]],
S:[pts[0],pts[1],pts[5],pts[4]]
};

const renderFaces=Object.entries(faces3D)
.map(([key,idxs])=>{

const avgZ=(rotated[idxs[0]].z+
rotated[idxs[1]].z+
rotated[idxs[2]].z+
rotated[idxs[3]].z)/4;

return{key,idxs,avgZ};

})
.sort((a,b)=>a.avgZ-b.avgZ);

const faceCenters={};

Object.keys(faces2D).forEach(k=>{
faceCenters[k]=polyCenter(faces2D[k]);
});

const centerX=(pts[4].x+pts[5].x+pts[6].x+pts[7].x)/4;
const centerY=(pts[4].y+pts[5].y+pts[6].y+pts[7].y)/4;

return{
pts,
rotated,
edges,
faces:faces2D,
renderFaces,
faceCenters,
centerX,
centerY,
size
};

}

function drawCube(ctx,geo,tick,metaResolver,hover){

for(const face of geo.renderFaces){

const poly=face.idxs.map(i=>geo.pts[i]);

ctx.beginPath();
ctx.moveTo(poly[0].x,poly[0].y);

for(let i=1;i<poly.length;i++)
ctx.lineTo(poly[i].x,poly[i].y);

ctx.closePath();

ctx.fillStyle="rgba(80,0,0,0.18)";
ctx.fill();

}

}

function drawNavigationStick(ctx,geo){

const cx=geo.centerX;
const cy=geo.centerY;
const h=geo.size*3;

ctx.save();

ctx.fillStyle="rgba(10,10,20,0.8)";
ctx.fillRect(cx-10,cy-h*0.5,20,h);

ctx.restore();

}

window.OPENWORLD_COMPASS_RENDERER=Object.freeze({

getCubeGeometry,
drawCube,
drawNavigationStick

});

})();
