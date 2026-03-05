/* TNT — /assets/hel-mesh.js
   ENGINE: MESH GENERATOR (CANON)
   VERSION: HEL_MESH_v1
   PURPOSE:
     - Consume a solved spine (from Rig Solver) + a body profile
     - Output:
         (1) Silhouette Hull (Left/Right edges)  ✅ fixes “toothbrush”
         (2) Surface Param Field (u,v) basis for scales/skin
         (3) Optional Triangulated Mesh (2.5D tube) for future WebGL
   RULES:
     - No DOM access, no rendering, no RAF
     - Pure functions only
     - Deterministic for same inputs
*/

(function(global){
"use strict";

function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function hypot(x,y){ return Math.hypot(x,y) || 1; }

/* ---------- Frames ---------- */
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

/* ---------- Default Dragon Profile (can be replaced by caller) ---------- */
function defaultRadiusProfile(i, u){
  // BASE_R concept baked as R0; caller can override via custom fn
  const R0 = 28;
  let m=1.0;

  // head mass
  if(u<0.06) m*=lerp(1.45,1.10,u/0.06);

  // neck pinch
  if(u>=0.06 && u<0.18){
    const t=(u-0.06)/0.12;
    m*=lerp(0.84,0.56,Math.sin(Math.PI*t));
  }

  // shoulder bulge
  if(u>=0.18 && u<0.34){
    const t=(u-0.18)/0.16;
    m*=(1.05 + 0.58*Math.sin(Math.PI*t));
  }

  // body
  if(u>=0.34 && u<0.78) m*=1.06;

  // tail taper (no dot)
  if(u>=0.78){
    const t=(u-0.78)/0.22;
    m*=lerp(1.0,0.20,t);
  }

  return Math.max(6, R0*m);
}

/* ---------- 1) Silhouette Hull (what you needed) ---------- */
function buildHull2D(spine, radiusFn){
  const n=spine.length;
  const L=new Array(n);
  const R=new Array(n);

  for(let i=0;i<n;i++){
    const p=spine[i];
    const u = (n<=1)?0:(i/(n-1));
    const r = radiusFn(i,u);
    const nn=normal(spine,i);
    L[i] = { x: p.x + nn.x*r, y: p.y + nn.y*r, u:u, v:+1 };
    R[i] = { x: p.x - nn.x*r, y: p.y - nn.y*r, u:u, v:-1 };
  }

  // Closed polygon order (for rendering):
  // [L0..Ln-1, Rn-1..R0]
  return { L, R };
}

/* ---------- 2) Surface Field (u,v mapping + lattice helpers) ---------- */
/* This returns stable anchors to draw scales/etc. WITHOUT inventing a new engine. */
function buildSurfaceField(spine, radiusFn, opts){
  opts = opts || {};
  const n=spine.length;

  // density controls (lightweight)
  const along = Math.max(4, (opts.along|0) || 28);  // samples along u
  const across= Math.max(2, (opts.across|0) || 4);  // samples across v
  const rows  = (opts.rows || [0.42, 0.18, -0.06, -0.30]); // default 4 “scale rows” across body
  const anchors=[];

  for(let ai=0; ai<along; ai++){
    const u = (along<=1)?0:(ai/(along-1));
    const i = Math.round(u*(n-1));
    const p = spine[i];
    const nn=normal(spine,i);
    const r = radiusFn(i,u);

    for(let ri=0; ri<rows.length; ri++){
      const v = clamp(rows[ri], -1, 1);
      anchors.push({
        u:u, v:v,
        x: p.x + nn.x*r*v,
        y: p.y + nn.y*r*v,
        // local frame for oriented scale placement
        tx: tangent(spine,i).x,
        ty: tangent(spine,i).y,
        nx: nn.x,
        ny: nn.y
      });
    }
  }

  return { anchors };
}

/* ---------- 3) Optional tube mesh (2.5D) for future WebGL ---------- */
/* Quad-author, tri-commit: returns positions + uvs + indices */
function buildTubeMesh(spine, radiusFn, rings){
  const n=spine.length;
  const ringN = Math.max(6, (rings|0) || 12);

  const positions = new Float32Array(n*ringN*3);
  const uvs = new Float32Array(n*ringN*2);
  const indices = new Uint32Array((n-1)*ringN*6);

  let vp=0, up=0;

  for(let i=0;i<n;i++){
    const p=spine[i];
    const u=(n<=1)?0:(i/(n-1));
    const r=radiusFn(i,u);
    const nn=normal(spine,i);

    // Frenet-lite basis: normal in XY, and pseudo-binormal in Z
    for(let k=0;k<ringN;k++){
      const a=(k/ringN)*Math.PI*2;
      const ca=Math.cos(a), sa=Math.sin(a);

      const x = p.x + nn.x*r*ca;
      const y = p.y + nn.y*r*ca;
      const z = r*sa;

      positions[vp++]=x;
      positions[vp++]=y;
      positions[vp++]=z;

      uvs[up++]=k/(ringN-1);
      uvs[up++]=u;
    }
  }

  let ip=0;
  const vid=(i,k)=> i*ringN + k;

  for(let i=0;i<n-1;i++){
    for(let k=0;k<ringN;k++){
      const k2=(k+1)%ringN;
      const a=vid(i,k);
      const b=vid(i,k2);
      const c=vid(i+1,k);
      const d=vid(i+1,k2);

      indices[ip++]=a; indices[ip++]=c; indices[ip++]=b;
      indices[ip++]=b; indices[ip++]=c; indices[ip++]=d;
    }
  }

  return { positions, uvs, indices, ringN };
}

/* ---------- Public API ---------- */
const HEL_MESH = {
  version: "HEL_MESH_v1",
  defaultRadiusProfile,

  buildHull2D,        // <- silhouette hull (main deliverable)
  buildSurfaceField,  // <- anchors for scales/skin/whisker roots, etc.
  buildTubeMesh        // <- optional future WebGL mesh output
};

global.HEL_MESH = HEL_MESH;

})(typeof window!=="undefined" ? window : globalThis);
