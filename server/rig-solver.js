/* TNT — /server/rig-solver.js
   ENGINE 1/4 — RIG SOLVER (SERVER-ONLY)
   VERSION: HEL_RIG_SOLVER_v1
*/
"use strict";

/*
Input:
  state: { t, dt, dir, x, yBase, phase, seg, gap, amp, wave, speed }
  spine: Array<{x,y}> length seg (in world units)
Output:
  { spine, headPose:{x,y,ang}, meta:{curvatureMax} }
Notes:
  - deterministic
  - length constraints + smoothing + curvature clamp
*/

function hypot(x,y){ return Math.hypot(x,y) || 1; }
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function tangent(sp,i){
  const a = sp[Math.max(0,i-1)];
  const b = sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}

function smoothSpine(sp, iters=2, alpha=0.35){
  for(let k=0;k<iters;k++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      const ax=(p0.x+p2.x)*0.5;
      const ay=(p0.y+p2.y)*0.5;
      p1.x=lerp(p1.x,ax,alpha);
      p1.y=lerp(p1.y,ay,alpha);
    }
  }
}

function enforceLengths(sp, gap, ease=0.58){
  for(let i=1;i<sp.length;i++){
    const p=sp[i-1], c=sp[i];
    let dx=p.x-c.x, dy=p.y-c.y, d=hypot(dx,dy);
    const tx=p.x-(dx/d)*gap;
    const ty=p.y-(dy/d)*gap;
    c.x=lerp(c.x,tx,ease);
    c.y=lerp(c.y,ty,ease);
  }
}

function curvatureMax(sp){
  // simple proxy: max turning angle between consecutive tangents
  let max=0;
  for(let i=2;i<sp.length-2;i++){
    const t0=tangent(sp,i-1), t1=tangent(sp,i+1);
    const dot = clamp(t0.x*t1.x + t0.y*t1.y, -1, 1);
    const ang = Math.acos(dot);
    if(ang>max) max=ang;
  }
  return max;
}

function clampCurvature(sp, kMax=0.55){
  // if curvature spikes, soften by extra smoothing
  const k=curvatureMax(sp);
  if(k <= kMax) return;
  const extra = Math.min(4, Math.ceil((k-kMax)/0.12));
  smoothSpine(sp, extra, 0.45);
}

function headPose(sp){
  const head=sp[0];
  const neck=sp[Math.min(10, sp.length-1)];
  const dx=head.x-neck.x, dy=head.y-neck.y;
  return {x:head.x,y:head.y,ang:Math.atan2(dy,dx)};
}

function stepRig(state, spine){
  const {
    t, dt, dir, x, yBase, phase,
    seg=120, gap=16, amp=9, wave=1.25, speed=54
  } = state;

  if(!spine || spine.length!==seg){
    spine = new Array(seg);
    for(let i=0;i<seg;i++) spine[i] = {x:x - dir*i*gap, y:yBase};
  }

  // head leads
  spine[0].x = x;
  spine[0].y = yBase + Math.sin(t*wave + phase) * amp;

  enforceLengths(spine, gap, 0.58);
  smoothSpine(spine, 2, 0.35);
  enforceLengths(spine, gap, 0.58);
  clampCurvature(spine, 0.55);

  return {
    spine,
    headPose: headPose(spine),
    meta: { curvatureMax: curvatureMax(spine) }
  };
}

module.exports = {
  VERSION: "HEL_RIG_SOLVER_v1",
  stepRig
};
