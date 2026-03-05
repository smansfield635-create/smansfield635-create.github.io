/* TNT — /server/mesh-generator.js
   ENGINE 2/4 — MESH GENERATOR (SERVER-ONLY)
   VERSION: HEL_MESH_GEN_v1
*/
"use strict";

/*
Generates a quad-loft mesh around a 2D spine (for WebGL later),
and also provides a 2D silhouette hull for Canvas.
Input:
  spine: [{x,y}]
  radiusFn: (i, u)->r
  rings: number of samples around circumference (>=6), default 12
Output:
  {
    hull2d: {L:[{x,y}], R:[{x,y}]},
    mesh: {positions:Float32Array, uvs:Float32Array, indices:Uint32Array}
  }
Note:
  - In 2D, hull uses normal offset (L/R).
  - 3D mesh is a “tube” with rings around the spine line (z=0 baseline).
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

function buildHull2D(spine, radiusFn){
  const L=[], R=[];
  const n=spine.length;
  for(let i=0;i<n;i++){
    const p=spine[i];
    const nn=normal(spine,i);
    const u=i/(n-1);
    const r=radiusFn(i,u);
    L.push({x:p.x + nn.x*r, y:p.y + nn.y*r});
    R.push({x:p.x - nn.x*r, y:p.y - nn.y*r});
  }
  return {L,R};
}

function buildTubeMesh(spine, radiusFn, rings=12){
  const n=spine.length;
  const ringN=Math.max(6, rings|0);

  // positions: (n * ringN) vertices, each xyz
  const positions = new Float32Array(n*ringN*3);
  const uvs = new Float32Array(n*ringN*2);

  // indices for quads → triangles: (n-1)*ringN quads, 2 tris each
  const triCount = (n-1)*ringN*2;
  const indices = new Uint32Array(triCount*3);

  let vp=0, up=0;

  for(let i=0;i<n;i++){
    const p=spine[i];
    const nn=normal(spine,i);
    const u=i/(n-1);
    const r=radiusFn(i,u);

    // ring plane: use normal + tangent rotated basis in 2D→pseudo-3D
    // basis1 = normal in XY, basis2 = perpendicular in Z for “roundness”
    // This yields a stable tube even in 2D. (Real 3D would use Frenet frame.)
    for(let k=0;k<ringN;k++){
      const a=(k/ringN)*Math.PI*2;
      const ca=Math.cos(a), sa=Math.sin(a);

      const x = p.x + nn.x*r*ca;
      const y = p.y + nn.y*r*ca;
      const z = r*sa;

      positions[vp++] = x;
      positions[vp++] = y;
      positions[vp++] = z;

      uvs[up++] = k/(ringN-1);
      uvs[up++] = u;
    }
  }

  let ip=0;
  function vid(i,k){ return i*ringN + k; }

  for(let i=0;i<n-1;i++){
    for(let k=0;k<ringN;k++){
      const k2=(k+1)%ringN;
      const a=vid(i,k);
      const b=vid(i,k2);
      const c=vid(i+1,k);
      const d=vid(i+1,k2);

      // tri1: a c b
      indices[ip++] = a;
      indices[ip++] = c;
      indices[ip++] = b;

      // tri2: b c d
      indices[ip++] = b;
      indices[ip++] = c;
      indices[ip++] = d;
    }
  }

  return {positions, uvs, indices};
}

module.exports = {
  VERSION: "HEL_MESH_GEN_v1",
  buildHull2D,
  buildTubeMesh
};
