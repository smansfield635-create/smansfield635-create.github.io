/* TNT — /server/feature-engine.js
   ENGINE 4/4 — FEATURE ENGINE (SERVER-ONLY)
   VERSION: HEL_FEATURE_ENGINE_v1
*/
"use strict";

/*
Attaches features (ridge, belly plates, scales) to the surface field.
Input:
  spine: [{x,y}]
  radiusFn(i,u)->r
  fieldFn(u,v)-> {id,loc}
Output:
  feature instances (no templates leaked client-side):
    - ridge: polyline points
    - belly: arc instances
    - scales: cell ids + anchor points
This is generator-side; client only receives instance payloads.
*/

function hypot(x,y){ return Math.hypot(x,y) || 1; }

function tangent(sp,i){
  const a=sp[Math.max(0,i-1)];
  const b=sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t=tangent(sp,i);
  return {x:-t.y,y:t.x};
}

function genRidge(spine, radiusFn){
  const pts=[];
  const n=spine.length;
  for(let i=6;i<Math.min(n, 64); i+=3){
    const p=spine[i];
    const nn=normal(spine,i);
    const u=i/(n-1);
    const r=radiusFn(i,u);
    pts.push({x:p.x + nn.x*r*0.95, y:p.y + nn.y*r*0.95});
  }
  return pts;
}

function genBelly(spine, radiusFn){
  const arcs=[];
  const n=spine.length;
  for(let i=10;i<n-18;i+=8){
    const p=spine[i];
    const nn=normal(spine,i);
    const u=i/(n-1);
    const r=radiusFn(i,u);
    arcs.push({
      x:p.x - nn.x*r*0.72,
      y:p.y - nn.y*r*0.72,
      rx:Math.max(6, r*0.24),
      ry:Math.max(3, r*0.10),
      u:u
    });
  }
  return arcs;
}

function genScales(spine, radiusFn, fieldFn){
  // produce scale instance anchors based on UV cell ids
  const inst=[];
  const n=spine.length;

  for(let i=14;i<n-22;i+=6){
    const p=spine[i];
    const nn=normal(spine,i);
    const u=i/(n-1);
    const r=radiusFn(i,u);

    // two rows across body
    const rows=[0.18, -0.06];
    for(let k=0;k<rows.length;k++){
      const v = rows[k]; // -1..1 across
      const f = fieldFn(u, v);
      inst.push({
        q:f.id.q, r:f.id.r,
        u:u, v:v,
        x:p.x + nn.x*r*v,
        y:p.y + nn.y*r*v
      });
    }
  }

  return inst;
}

function buildFeatures(payload){
  const spine = payload.spine;
  const radiusFn = payload.radiusFn;
  const fieldFn = payload.fieldFn;

  return {
    ridge: genRidge(spine, radiusFn),
    belly: genBelly(spine, radiusFn),
    scales: genScales(spine, radiusFn, fieldFn)
  };
}

module.exports = {
  VERSION: "HEL_FEATURE_ENGINE_v1",
  buildFeatures
};
