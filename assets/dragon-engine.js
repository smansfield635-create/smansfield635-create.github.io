/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_ALLINONE_v1
   PURPOSE: ONE FILE. DELIVERS A DRAGON (ribbon body + real dragon head + horns + whiskers + legs + ridge + tail fin + fire cue).
   NOTES:
   - No external engines. No hel-* dependencies. No extra files.
   - Stable tube math (no self-intersection artifacts under normal motion).
   - Head cannot spin 360: yaw bounded + rate limited + locked to spine-forward.
*/

(function(){
"use strict";
if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* =========================
   CORE PARAMS (EDIT HERE ONLY)
   ========================= */
const DPR_CAP = 1.6;

/* BODY SHAPE */
const SEG = 24;            // body point count (shorter than “snake”)
const GAP = 34;            // segment spacing (px, world units)
const BASE_R = 32;         // base thickness driver (will be clamped by GAP)
const THICK_MULT = 5.5;    // your request: 5–6× thicker vs earlier ribbon baseline

/* MOTION */
const SPEED = 0.38;        // head travel speed around arc
const WOB_AMP = 0.055;     // subtle wobble
const WOB_FREQ = 0.85;     // wobble frequency
const RELAX = 0.80;        // constraint relaxation (higher = stiffer)
const SMOOTH = 1;          // smoothing passes

/* HEAD BEHAVIOR (NO 360 SPIN) */
const HEAD_YAW_LIMIT = Math.PI * 0.50;   // 180° total max (±90°)
const HEAD_YAW_RATE  = 0.28;             // slow yaw rate (rad/sec)
const HEAD_FWD_RATE  = 0.35;             // slow follow of spine direction (rad/sec)

/* ARC LIMITS (TOP & BOTTOM DRAGONS) */
const TOP_MIN = Math.PI*1.10, TOP_MAX = Math.PI*1.88;
const BOT_MIN = Math.PI*0.12, BOT_MAX = Math.PI*0.92;

/* COLORS */
const JADE   = "rgba(0,130,70,0.92)";
const CRIMSON= "rgba(190,25,25,0.90)";

/* =========================
   UTIL
   ========================= */
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function hypot(x,y){ return Math.hypot(x,y) || 1; }
function wrap(a){ const two=Math.PI*2; while(a<0)a+=two; while(a>=two)a-=two; return a; }
function angDelta(a,b){
  const two=Math.PI*2;
  let d=(b-a)%two;
  if(d>Math.PI) d-=two;
  if(d<-Math.PI) d+=two;
  return d;
}
function reflect(a,lo,hi){
  if(a<lo) return lo+(lo-a);
  if(a>hi) return hi-(a-hi);
  return a;
}
function cssNum(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){ return NaN; }
}
function stage(){
  const vw=window.innerWidth||1, vh=window.innerHeight||1;
  const r1=cssNum("--gd_r1");
  const Cx=vw*0.5, Cy=vh*0.52;
  const R=clamp((Number.isFinite(r1)?r1:180)*1.10,150,Math.min(vw,vh)*0.42);
  return {Cx,Cy,R,vw,vh};
}

/* =========================
   CANVAS
   ========================= */
const host = document.getElementById("gd-dragon") || document.body;

const cv = document.createElement("canvas");
cv.id = "dragon_engine_canvas";
cv.style.position="fixed";
cv.style.inset="0";
cv.style.width="100%";
cv.style.height="100%";
cv.style.pointerEvents="none";
cv.style.zIndex="6";
host.appendChild(cv);

const ctx = cv.getContext("2d",{alpha:true, desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1,dpr));
  W = Math.floor((window.innerWidth||1)*DPR);
  H = Math.floor((window.innerHeight||1)*DPR);
  cv.width=W; cv.height=H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* =========================
   BODY MASS PROFILE (THICK NEAR HEAD, NOT SNAKE-NECK)
   Returns multiplier on BASE_R then scaled by THICK_MULT.
   ========================= */
function massProfile(u){
  // u=0 head, u=1 tail
  if(u<0.18){
    const t=u/0.18;
    return 1.45 - 0.10*t;                 // thick neck
  }
  if(u<0.40){
    const t=(u-0.18)/0.22;
    return 1.35 + 0.30*Math.sin(Math.PI*t); // shoulders close to head
  }
  if(u<0.74) return 1.20;                 // torso thick
  const t=(u-0.74)/0.26;
  return Math.max(0.18, 1.20*Math.pow(1-t,0.72)); // tail taper
}

/* Tube safety: radius must stay <= ~0.48*GAP (prevents rail crossings). */
function bodyRadius(u){
  const rr = Math.max(10, BASE_R*THICK_MULT*massProfile(u));
  return Math.min(rr, GAP*0.48);
}

/* =========================
   SPINE MECHANICS
   ========================= */
function tangent(sp,i){
  const a=sp[Math.max(0,i-1)], b=sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=Math.max(0.0001,hypot(dx,dy));
  return {x:dx/d,y:dy/d};
}
function enforce(sp){
  for(let i=1;i<sp.length;i++){
    const p=sp[i-1], c=sp[i];
    const dx=p.x-c.x, dy=p.y-c.y, d=Math.max(0.0001,hypot(dx,dy));
    const tx=p.x-(dx/d)*GAP;
    const ty=p.y-(dy/d)*GAP;
    c.x=lerp(c.x,tx,RELAX);
    c.y=lerp(c.y,ty,RELAX);
  }
}
function smooth(sp){
  for(let it=0;it<SMOOTH;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.24);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.24);
    }
  }
}

class Dragon {
  constructor(top){
    this.top=top;
    this.dir=top?-1:1;
    this.phase=Math.random()*10;
    this.theta=top?Math.PI*1.62:Math.PI*0.38;

    this.spine=new Array(SEG);
    this.headYaw=0;
    this.headFwd=0;

    const st=stage();
    const a=this.theta;
    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    const tx=-Math.sin(a), ty=Math.cos(a)*0.55;
    for(let i=0;i<SEG;i++){
      this.spine[i]={x:hx - tx*i*GAP, y:hy - ty*i*GAP};
    }
  }

  update(dt){
    const st=stage();
    this.theta=wrap(this.theta + this.dir*SPEED*dt);

    const time=performance.now()/1000;
    let a=this.theta + Math.sin(time*WOB_FREQ + this.phase)*WOB_AMP;
    a = this.top ? reflect(a,TOP_MIN,TOP_MAX) : reflect(a,BOT_MIN,BOT_MAX);

    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    this.spine[0].x=hx; this.spine[0].y=hy;
    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);
  }

  frame(){
    const L=[], R=[], spinePx=[], tArr=[], nArr=[], rArr=[];
    let prevN=null;

    for(let i=0;i<SEG;i++){
      const p=this.spine[i];
      const u=i/(SEG-1);
      const rr=bodyRadius(u);

      const t=tangent(this.spine,i);
      let n={x:-t.y,y:t.x};

      // normal continuity
      if(prevN){
        const dot=n.x*prevN.x+n.y*prevN.y;
        if(dot<0){ n.x=-n.x; n.y=-n.y; }
      }
      prevN={x:n.x,y:n.y};

      spinePx[i]={x:p.x*DPR,y:p.y*DPR};
      tArr[i]=t;
      nArr[i]=n;
      rArr[i]=rr*DPR;
    }

    // rails
    for(let i=0;i<SEG;i++){
      const p=spinePx[i], n=nArr[i], rr=rArr[i];
      L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
      R.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
    }

    // anchors by fraction (legs/ridge/head)
    const idx=(u)=>Math.max(0,Math.min(SEG-1, Math.round(u*(SEG-1))));
    const A={
      head: 0,
      neck: idx(0.12),
      shoulder: idx(0.26),
      leg1: idx(0.30),
      leg2: idx(0.44),
      leg3: idx(0.60),
      leg4: idx(0.74),
      ridge0: idx(0.12),
      ridge1: idx(0.84),
      tail: idx(0.98)
    };

    // head direction: follow spine direction slowly + bounded yaw (NO 360)
    const P0=this.spine[0], P1=this.spine[1]||this.spine[0];
    const spineAng=Math.atan2(P1.y-P0.y, P1.x-P0.x);

    const fStep=HEAD_FWD_RATE*(1/60);
    this.headFwd = wrap(this.headFwd + clamp(angDelta(this.headFwd, spineAng), -fStep, fStep));

    const yStep=HEAD_YAW_RATE*(1/60);
    this.headYaw = clamp(this.headYaw + clamp(angDelta(this.headYaw, 0), -yStep, yStep), -HEAD_YAW_LIMIT, HEAD_YAW_LIMIT);

    const headAng=this.headFwd + this.headYaw;
    const th={x:Math.cos(headAng), y:Math.sin(headAng)};
    const nh={x:-th.y, y:th.x};

    // head size: big, but sane (scaled off shoulder radius)
    const rShoulder = Math.max(rArr[A.neck], rArr[A.shoulder]);
    let headW = 2.6*(2*rShoulder);
    const st=stage();
    headW = Math.min(headW, 0.22*Math.min(st.vw, st.vh)*DPR);

    return {L,R,spine:spinePx,t:tArr,n:nArr,rad:rArr,anchors:A,headFrame:{P:spinePx[0],t:th,n:nh,W:headW}};
  }
}

/* =========================
   DRAWING PRIMITIVES
   ========================= */
function evenoddFill(){ try{ctx.fill("evenodd");}catch(e){ctx.fill();} }
function poly(pts){
  ctx.beginPath();
  ctx.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
  ctx.closePath();
  evenoddFill();
}
function qcurve(a,b,c,w){
  ctx.lineWidth=w;
  ctx.beginPath();
  ctx.moveTo(a.x,a.y);
  ctx.quadraticCurveTo(b.x,b.y,c.x,c.y);
  ctx.stroke();
}

/* =========================
   DRAGON RENDER (BODY + MORPHOLOGY)
   ========================= */
function drawDragon(frame, fill){
  const L=frame.L, R=frame.R;
  ctx.save();

  // body hull
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();

  ctx.fillStyle="rgba(0,0,0,0.22)";
  evenoddFill();

  ctx.fillStyle=fill;
  evenoddFill();

  ctx.strokeStyle="rgba(0,0,0,0.72)";
  ctx.lineWidth=Math.max(1,2.2*DPR);
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.stroke();

  // dorsal ridge
  const A=frame.anchors, spine=frame.spine, nArr=frame.n, rad=frame.rad;
  for(let i=A.ridge0;i<A.ridge1;i+=5){
    const P=spine[i]; if(!P) continue;
    const n=nArr[i]||{x:0,y:-1};
    const r=Math.max(6,rad[i]||10);
    const base={x:P.x+n.x*r,y:P.y+n.y*r};
    const tip ={x:base.x+n.x*(0.55*r),y:base.y+n.y*(0.55*r)};
    ctx.strokeStyle="rgba(0,0,0,0.45)";
    ctx.lineWidth=Math.max(1,1.1*DPR);
    ctx.beginPath(); ctx.moveTo(base.x,base.y); ctx.lineTo(tip.x,tip.y); ctx.stroke();
  }

  // legs
  function leg(idx){
    const P=spine[idx]; if(!P) return;
    const n=nArr[idx]||{x:0,y:1};
    const r=Math.max(8,rad[idx]||12);
    const root={x:P.x-n.x*r,y:P.y-n.y*r};
    const foot={x:root.x-n.x*(1.15*r),y:root.y-n.y*(1.15*r)};
    ctx.strokeStyle="rgba(0,0,0,0.55)";
    ctx.lineWidth=Math.max(1,2.0*DPR);
    ctx.beginPath(); ctx.moveTo(root.x,root.y); ctx.lineTo(foot.x,foot.y); ctx.stroke();
  }
  leg(A.leg1); leg(A.leg2); leg(A.leg3); leg(A.leg4);

  // head (snout + crown + horns + whiskers + fire cue)
  const HF=frame.headFrame;
  if(HF){
    const P=HF.P, t=HF.t, n=HF.n;
    const W=HF.W;

    const snout=0.95*W, back=0.55*W, jaw=0.55*W;
    const tip ={x:P.x+t.x*snout,y:P.y+t.y*snout};
    const jawL={x:P.x-t.x*back+n.x*jaw,y:P.y-t.y*back+n.y*jaw};
    const jawR={x:P.x-t.x*back-n.x*jaw,y:P.y-t.y*back-n.y*jaw};

    ctx.fillStyle="rgba(0,0,0,0.38)";
    poly([tip,jawL,jawR]);

    // crown
    const crownC={x:P.x-t.x*(0.10*W),y:P.y-t.y*(0.10*W)};
    const crownL={x:crownC.x+n.x*(0.62*W),y:crownC.y+n.y*(0.62*W)};
    const crownR={x:crownC.x-n.x*(0.62*W),y:crownC.y-n.y*(0.62*W)};
    const crownB={x:crownC.x-t.x*(0.45*W),y:crownC.y-t.y*(0.45*W)};
    ctx.fillStyle="rgba(0,0,0,0.28)";
    poly([crownL,crownC,crownR,crownB]);

    // horns
    const hornLen=0.95*W, hornOff=0.55*W;
    const hbL={x:crownC.x-t.x*(0.05*W)+n.x*hornOff,y:crownC.y-t.y*(0.05*W)+n.y*hornOff};
    const hbR={x:crownC.x-t.x*(0.05*W)-n.x*hornOff,y:crownC.y-t.y*(0.05*W)-n.y*hornOff};
    const htL={x:hbL.x+t.x*hornLen+n.x*(0.25*W),y:hbL.y+t.y*hornLen+n.y*(0.25*W)};
    const htR={x:hbR.x+t.x*hornLen-n.x*(0.25*W),y:hbR.y+t.y*hornLen-n.y*(0.25*W)};
    ctx.fillStyle="rgba(0,0,0,0.40)";
    poly([hbL,{x:hbL.x+n.x*(0.22*W),y:hbL.y+n.y*(0.22*W)},htL]);
    poly([hbR,{x:hbR.x-n.x*(0.22*W),y:hbR.y-n.y*(0.22*W)},htR]);

    // whiskers (4)
    ctx.strokeStyle="rgba(0,0,0,0.62)";
    const wW=Math.max(1,1.6*DPR);
    function whisk(side,lift){
      const s=side;
      const root={x:P.x+t.x*(0.42*W)+n.x*(s*0.42*W),y:P.y+t.y*(0.42*W)+n.y*(s*0.42*W)};
      const mid ={x:root.x+t.x*(0.55*W)+n.x*(s*lift*0.55*W),y:root.y+t.y*(0.55*W)+n.y*(s*lift*0.55*W)};
      const end ={x:root.x+t.x*(1.05*W)+n.x*(s*lift*0.95*W),y:root.y+t.y*(1.05*W)+n.y*(s*lift*0.95*W)};
      qcurve(root,mid,end,wW);
    }
    whisk(+1,+1); whisk(+1,-1);
    whisk(-1,+1); whisk(-1,-1);

    // fire direction cue (subtle triangle)
    const fireA={x:tip.x+t.x*(0.10*W),y:tip.y+t.y*(0.10*W)};
    const fireB={x:tip.x+t.x*(0.90*W)+n.x*(0.15*W),y:tip.y+t.y*(0.90*W)+n.y*(0.15*W)};
    const fireC={x:tip.x+t.x*(0.90*W)-n.x*(0.15*W),y:tip.y+t.y*(0.90*W)-n.y*(0.15*W)};
    ctx.fillStyle="rgba(0,0,0,0.10)";
    poly([fireA,fireB,fireC]);
  }

  // tail fin
  const tail=A.tail;
  if(spine[tail]){
    const P=spine[tail];
    const tt=frame.t[tail]||{x:-1,y:0};
    const nt=frame.n[tail]||{x:0,y:-1};
    const rt=Math.max(6,frame.rad[tail]||10);
    const a={x:P.x,y:P.y};
    const b={x:P.x-tt.x*(2.0*rt)+nt.x*(1.1*rt),y:P.y-tt.y*(2.0*rt)+nt.y*(1.1*rt)};
    const c={x:P.x-tt.x*(2.0*rt)-nt.x*(1.1*rt),y:P.y-tt.y*(2.0*rt)-nt.y*(1.1*rt)};
    ctx.fillStyle="rgba(0,0,0,0.14)";
    poly([a,b,c]);
  }

  ctx.restore();
}

/* =========================
   RUN
   ========================= */
const top = new Dragon(true);
const bot = new Dragon(false);

let last=0;
function loop(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;

  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);

  top.update(dt);
  bot.update(dt);

  drawDragon(top.frame(), JADE);
  drawDragon(bot.frame(), CRIMSON);

  // watermark
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(14*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_ENGINE_ALLINONE_v1", 12*DPR, H-14*DPR);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
