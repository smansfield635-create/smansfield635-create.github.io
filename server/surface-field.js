/* TNT — /server/surface-field.js
   ENGINE 3/4 — SURFACE FIELD (SERVER-ONLY)
   VERSION: HEL_SURFACE_FIELD_v1
*/
"use strict";

/*
Defines a stable (u,v) coordinate field and a hex/elongated-hex lattice in UV space.
Input:
  u in [0,1] along body length
  v in [-1,1] across body (2D), or [0,1] around circumference (3D UV)
Output:
  cellId {q,r} + local {fu,fv} for shading/feature placement
Note:
  - This does NOT draw anything; it produces stable IDs for mapping scales/features.
*/

function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

// axial hex coords utilities (pointy-top style in UV space)
function uvToAxial(u,v, scaleU, scaleV, elong=1.35){
  // elongation applied along u axis by default
  const x = (u * scaleU) * elong;
  const y = (v * scaleV);

  // pointy-top axial conversion (approx)
  const q = (Math.sqrt(3)/3 * x - 1/3 * y);
  const r = (2/3 * y);

  return axialRound(q,r);
}

function axialRound(q,r){
  // convert axial to cube, round, convert back
  let x=q, z=r, y=-x-z;

  let rx=Math.round(x), ry=Math.round(y), rz=Math.round(z);

  const dx=Math.abs(rx-x), dy=Math.abs(ry-y), dz=Math.abs(rz-z);

  if(dx>dy && dx>dz) rx=-ry-rz;
  else if(dy>dz) ry=-rx-rz;
  else rz=-rx-ry;

  return {q:rx, r:rz};
}

function cellLocal(u,v, q,r, scaleU, scaleV, elong=1.35){
  // approximate local coords within the cell (for jitter/shading); keep bounded.
  // This is a lightweight placeholder; full barycentric hex local can come later.
  const fu = (u*scaleU*elong) - q;
  const fv = (v*scaleV) - r;
  return {fu:fu, fv:fv};
}

function field(u, v, opts){
  opts = opts || {};
  const scaleU = opts.scaleU || 24; // density along length
  const scaleV = opts.scaleV || 12; // density across
  const elong  = opts.elong  || 1.35;

  u = clamp(u,0,1);
  v = clamp(v,-1,1);

  const id = uvToAxial(u, v, scaleU, scaleV, elong);
  const loc = cellLocal(u, v, id.q, id.r, scaleU, scaleV, elong);

  return { id, loc, params:{scaleU,scaleV,elong} };
}

module.exports = {
  VERSION: "HEL_SURFACE_FIELD_v1",
  field
};
