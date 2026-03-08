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
  const perspective=520/(520+z);
  return{
    x:centerX+(x*perspective),
    y:centerY+(y*perspective),
    z:z
  };
}

function getGeometry(centerX,centerY,size,rotX,rotY){
  const vertsRaw=[
    [0,-1.8,0],
    [1.2,0,0],
    [0,0,1.2],
    [-1.2,0,0],
    [0,0,-1.2],
    [0,1.8,0]
  ];

  const facesRaw=[
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
    pts.push(project(centerX,centerY,p.x,p.y,p.z));
  }

  const faces=facesRaw.map(function(face){
    const poly=face.idx.map(function(i){return pts[i];});
    const avgZ=(rotated[face.idx[0]].z+rotated[face.idx[1]].z+rotated[face.idx[2]].z)/3;
    const c=poly.reduce(function(a,p){
      return{x:a.x+p.x,y:a.y+p.y};
    },{x:0,y:0});
    return{
      name:face.name,
      poly:poly,
      avgZ:avgZ,
      center:{x:c.x/3,y:c.y/3}
    };
  }).sort(function(a,b){
    return a.avgZ-b.avgZ;
  });

  return{
    pts:pts,
    edges:edges,
    faces:faces,
    centerX:centerX,
    centerY:centerY,
    size:size
  };
}

function faceFill(name){
  if(name==="NE"||name==="nE")return"rgba(255,210,120,0.52)";
  if(name==="ES"||name==="sE")return"rgba(210,90,54,0.48)";
  if(name==="SW"||name==="sW")return"rgba(128,24,18,0.44)";
  return"rgba(180,48,34,0.46)";
}

function drawCompass(ctx,opts){
  const geo=getGeometry(opts.centerX,opts.centerY,opts.size,opts.rotX||0,opts.rotY||0);

  ctx.save();
  ctx.globalAlpha=0.22;
  ctx.strokeStyle="rgba(255,226,170,0.86)";
  ctx.lineWidth=1.2;
  ctx.beginPath();
  ctx.ellipse(geo.centerX,geo.centerY,geo.size*1.95,geo.size*0.62,0,0,TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(geo.centerX,geo.centerY,geo.size*1.15,geo.size*0.34,0,0,TAU);
  ctx.stroke();
  ctx.restore();

  for(const face of geo.faces){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(face.poly[0].x,face.poly[0].y);
    ctx.lineTo(face.poly[1].x,face.poly[1].y);
    ctx.lineTo(face.poly[2].x,face.poly[2].y);
    ctx.closePath();
    ctx.fillStyle=faceFill(face.name);
    ctx.fill();
    ctx.lineWidth=1.8;
    ctx.strokeStyle="rgba(255,236,186,0.96)";
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.shadowBlur=16;
  ctx.shadowColor="rgba(255,220,150,0.28)";
  for(const e of geo.edges){
    ctx.beginPath();
    ctx.moveTo(geo.pts[e[0]].x,geo.pts[e[0]].y);
    ctx.lineTo(geo.pts[e[1]].x,geo.pts[e[1]].y);
    ctx.lineWidth=2;
    ctx.strokeStyle="rgba(255,236,186,0.98)";
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(geo.centerX,geo.centerY,geo.size*0.10,0,TAU);
  ctx.fillStyle="rgba(255,242,208,0.98)";
  ctx.fill();

  ctx.fillStyle="rgba(255,244,214,0.98)";
  ctx.font='700 12px system-ui,Segoe UI,Roboto,sans-serif';
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.fillText("N",geo.centerX,geo.centerY-(geo.size*0.96));
  ctx.fillText("S",geo.centerX,geo.centerY+(geo.size*0.96));
  ctx.fillText("E",geo.centerX+(geo.size*1.18),geo.centerY);
  ctx.fillText("W",geo.centerX-(geo.size*1.18),geo.centerY);
  ctx.restore();
}

window.VARIANT_COMPASS_RENDERER=Object.freeze({
  version:"VARIANT_COMPASS_RENDERER_v1",
  drawCompass:drawCompass
});
})();
