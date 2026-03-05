/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_HOLLOW_HEX_RIM_v1
   ONE FILE. CLEAN IMPLEMENTATION.

   DELIVERS:
   - Ribbon body (filled)
   - Hollow hex rim lattice scales (stroke only) clipped to body
   - Head (colored) excluded from lattice
   - Motion stress harness to try to break under motion (no extra files)

   HOTKEYS:
   0 = normal motion
   1 = zigzag max-turn stress
   2 = spiral-in stress
   3 = figure-8 stress
   4 = hairpin / reversal stress
   H = toggle lattice on/off (diagnostic)
   D = toggle debug overlay (counts/density)
*/

(function(){
"use strict";
if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* =========================
   PARAMETERS (EDIT HERE)
   ========================= */

const DPR_CAP = 1.6;

/* BODY */
const SEG = 26;
const GAP = 34;
const BASE_R = 34;          // base girth driver
const THICK_MULT = 1.25;    // +25% thicker (your request)

/* MOTION */
const SPEED = 0.45;         // travel speed
const WOB_AMP = 0.06;       // subtle wobble
const WOB_FREQ = 0.85;

/* HEAD (simple, readable) */
const HEAD_SIZE_MULT = 2.6; // head width relative to shoulder radius
const HEAD_EXCLUDE_U = 0.14; // exclude lattice on u∈[0,HEAD_EXCLUDE_U]

/* HOLLOW HEX LATTICE (the key concept) */
const HEX_RIM_RADIUS = 7.0;        // in CSS px units before DPR
const HEX_RIM_STROKE = 1.25;       // in CSS px units before DPR
const HEX_RIM_ALPHA  = 0.22;       // overlap densifies, won’t flood
const HEX_RIM_ROT_DEG= 9;          // breaks moiré (non-zero rotation)
const HEX_RIM_STEP   = 1.05;       // spacing factor (1.0–1.4); lower = denser
const HEX_RIM_CULL   = 0.62;       // draw only near surface (0..1); higher = fewer hexes

/* DRAGONS (distance separation + enter/exit) */
const OFFSCREEN_PAD = 260;
const SEPARATION_PX = 380;          // keep them apart vertically and phase-wise

/* COLORS */
const JADE_BODY   = "rgba(46,213,115,0.92)";
const JADE_HEAD   = "rgba(20,120,70,0.92)";
const CRIM_BODY   = "rgba(255,59,59,0.90)";
const CRIM_HEAD   = "rgba(160,30,30,0.90)";

/* =========================
   UTIL
   ========================= */

function lerp(a,b,t){return a+(b-a)*t;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function hypot(x,y){return Math.hypot(x,y)||1;}
function wrap(a){const two=Math.PI*2;while(a<0)a+=two;while(a>=two)a-=two;return a;}
function angDelta(a,b){
  const two=Math.PI*2;
  let d=(b-a)%two;
  if(d>Math.PI)d-=two;
  if(d<-Math.PI)d+=two;
  return d;
}

/* =========================
   CANVAS
   ========================= */

const host=document.getElementById("gd-dragon")||document.body;
const cv=document.createElement("canvas");
cv.id="dragon_engine_canvas";
cv.style.position="fixed";
cv.style.inset="0";
cv.style.width="100%";
cv.style.height="100%";
cv.style.pointerEvents="none";
cv.style.zIndex="6";
host.appendChild(cv);

const ctx=cv.getContext("2d",{alpha:true,desynchronized:true});
let W=0,H=0,DPR=1;

function resize(){
  let dpr=window.devicePixelRatio||1;
  DPR=Math.min(DPR_CAP,Math.max(1,dpr));
  W=Math.floor(innerWidth*DPR);
  H=Math.floor(innerHeight*DPR);
  cv.width=W; cv.height=H;
}
resize();
addEventListener("resize",resize,{passive:true});

function stage(){
  const vw=innerWidth||1, vh=innerHeight||1;
  return {vw,vh,Cx:vw*0.5,Cy:vh*0.55};
}

/* =========================
   BODY PROFILE (thick near head)
   ========================= */
function massProfile(u){
  if(u<0.18){ const t=u/0.18; return 1.45 - 0.10*t; }
  if(u<0.40){ const t=(u-0.18)/0.22; return 1.35 + 0.30*Math.sin(Math.PI*t); }
  if(u<0.74) return 1.20;
  const t=(u-0.74)/0.26;
  return Math.max(0.18, 1.20*Math.pow(1-t,0.72));
}
function bodyRadius(u){
  const rr=Math.max(10, BASE_R*THICK_MULT*massProfile(u));
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
    // stable but flexible follow
    c.x=lerp(c.x,tx,0.78);
    c.y=lerp(c.y,ty,0.78);
  }
}
function smooth(sp){
  for(let it=0;it<1;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.22);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.22);
    }
  }
}

/* =========================
   STRESS HARNESS
   ========================= */
let STRESS_MODE=0;
let SHOW_LATTICE=true;
let SHOW_DEBUG=false;

addEventListener("keydown",(e)=>{
  if(e.key==="0") STRESS_MODE=0;
  if(e.key==="1") STRESS_MODE=1;
  if(e.key==="2") STRESS_MODE=2;
  if(e.key==="3") STRESS_MODE=3;
  if(e.key==="4") STRESS_MODE=4;
  if(e.key==="h"||e.key==="H") SHOW_LATTICE=!SHOW_LATTICE;
  if(e.key==="d"||e.key==="D") SHOW_DEBUG=!SHOW_DEBUG;
});

/* =========================
   DRAGON (enter/exit + mirrored distance)
   ========================= */
class Dragon{
  constructor(dir, lane){
    this.dir=dir;            // +1 right, -1 left
    this.lane=lane;          // 0 top, 1 bottom
    this.phase=Math.random()*10;
    this.x = (dir>0)?(-OFFSCREEN_PAD):(innerWidth+OFFSCREEN_PAD);
    this.y = stage().Cy + (lane===0?-SEPARATION_PX:+SEPARATION_PX);

    this.spine=new Array(SEG);
    for(let i=0;i<SEG;i++){
      this.spine[i]={x:this.x - i*GAP*dir, y:this.y};
    }

    // head direction stabilizer
    this.headFwd=0;
    this.headYaw=0;
  }

  update(dt){
    const st=stage();

    // enter/exit translation (primary)
    const vx=this.dir*SPEED*360*dt;

    // stress motion injection (try to break)
    const t=performance.now()/1000;
    let yJitter = Math.sin(t*WOB_FREQ + this.phase) * (WOB_AMP*110);

    if(STRESS_MODE===1){ // zigzag
      yJitter += Math.sign(Math.sin(t*6.0 + this.phase))*120;
    }else if(STRESS_MODE===2){ // spiral-ish vertical oscillation
      yJitter += Math.sin(t*3.2 + this.phase)*220;
    }else if(STRESS_MODE===3){ // figure-8
      yJitter += Math.sin(t*2.4 + this.phase)*240;
      this.x += Math.cos(t*2.4 + this.phase)*55*dt*this.dir;
    }else if(STRESS_MODE===4){ // hairpin reversals (aggressive)
      yJitter += Math.sin(t*8.0 + this.phase)*160;
      // small reverse pulses
      const pulse = Math.sin(t*2.2 + this.phase)>0 ? 1 : -1;
      this.x += pulse*45*dt*this.dir;
    }

    this.x += vx;

    // wrap re-entry
    if(this.dir>0 && this.x > st.vw + OFFSCREEN_PAD){
      this.x = -OFFSCREEN_PAD;
    }
    if(this.dir<0 && this.x < -OFFSCREEN_PAD){
      this.x = st.vw + OFFSCREEN_PAD;
    }

    // set head
    this.y = st.Cy + (this.lane===0?-SEPARATION_PX:+SEPARATION_PX) + yJitter;
    this.spine[0].x=this.x;
    this.spine[0].y=this.y;

    // follow chain
    for(let i=SEG-1;i>=1;i--){
      this.spine[i].x=this.spine[i-1].x;
      this.spine[i].y=this.spine[i-1].y;
    }

    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);
  }

  frame(){
    const spinePx=[], tArr=[], nArr=[], rArr=[], L=[], R=[];
    let prevN=null;

    for(let i=0;i<SEG;i++){
      const p=this.spine[i];
      const u=i/(SEG-1);
      const rr=bodyRadius(u);

      const t=tangent(this.spine,i);
      let n={x:-t.y,y:t.x};
      if(prevN){
        const dot=n.x*prevN.x+n.y*prevN.y;
        if(dot<0){ n.x=-n.x; n.y=-n.y; }
      }
      prevN={x:n.x,y:n.y};

      spinePx[i]={x:p.x*DPR,y:p.y*DPR};
      tArr[i]=t; nArr[i]=n; rArr[i]=rr*DPR;
    }

    for(let i=0;i<SEG;i++){
      const p=spinePx[i], n=nArr[i], rr=rArr[i];
      L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
      R.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
    }

    // head frame: follow spine direction slowly + bounded yaw
    const P0=this.spine[0], P1=this.spine[1]||this.spine[0];
    const spineAng=Math.atan2(P1.y-P0.y, P1.x-P0.x);

    const fStep=HEAD_FWD_RATE*(1/60);
    this.headFwd = wrap(this.headFwd + clamp(angDelta(this.headFwd, spineAng), -fStep, fStep));

    const yStep=HEAD_YAW_RATE*(1/60);
    this.headYaw = clamp(this.headYaw + clamp(angDelta(this.headYaw, 0), -yStep, yStep), -HEAD_YAW_LIMIT, HEAD_YAW_LIMIT);

    const headAng=this.headFwd + this.headYaw;
    const th={x:Math.cos(headAng),y:Math.sin(headAng)};
    const nh={x:-th.y,y:th.x};

    const neckIdx=Math.min(3,SEG-1);
    const shoulderIdx=Math.min(6,SEG-1);
    const rShoulder=Math.max(rArr[neckIdx], rArr[shoulderIdx]);
    let headW = HEAD_SIZE_MULT*(2*rShoulder);
    const st=stage();
    headW=Math.min(headW,0.20*Math.min(st.vw,st.vh)*DPR);

    return {L,R,spine:spinePx,t:tArr,n:nArr,rad:rArr,headFrame:{P:spinePx[0],t:th,n:nh,W:headW}};
  }
}

/* =========================
   DRAW HELPERS
   ========================= */
function poly(pts){
  ctx.beginPath();
  ctx.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
  ctx.closePath();
  try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }
}
function qcurve(a,b,c,w){
  ctx.lineWidth=w;
  ctx.beginPath();
  ctx.moveTo(a.x,a.y);
  ctx.quadraticCurveTo(b.x,b.y,c.x,c.y);
  ctx.stroke();
}
function drawBody(frame, fill){
  const L=frame.L, R=frame.R;
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();
  ctx.fillStyle=fill;
  ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,0.28)";
  ctx.lineWidth=2*DPR;
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.stroke();
}

/* =========================
   HOLLOW HEX RIM LATTICE (CLIPPED TO BODY)
   ========================= */
function drawHexOutline(cx,cy,r,rotRad){
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a = rotRad + (Math.PI/3)*i;
    const x = cx + Math.cos(a)*r;
    const y = cy + Math.sin(a)*r;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.stroke();
}

/* Build a clipped lattice anchored to the body surface */
function drawHollowHexLattice(frame, strokeRGB){
  if(!SHOW_LATTICE) return;

  const L=frame.L, R=frame.R;
  const spine=frame.spine, nArr=frame.n, rad=frame.rad;

  // clip to body hull
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();
  ctx.clip();

  // exclude head region (keep head clean/readable)
  const headCut = Math.max(0, Math.floor(HEAD_EXCLUDE_U*(SEG-1)));

  const rimR = HEX_RIM_RADIUS*DPR;
  const rimW = HEX_RIM_STROKE*DPR;
  const rot = (HEX_RIM_ROT_DEG*Math.PI/180);

  ctx.strokeStyle = `rgba(${strokeRGB},${HEX_RIM_ALPHA})`;
  ctx.lineWidth = rimW;
  ctx.lineJoin="round";

  let count=0;

  // place hex centers along “skin bands” (near surface, not full fill)
  for(let i=headCut+3;i<spine.length-4;i++){
    const u=i/(spine.length-1);
    const p=spine[i];
    const n=nArr[i];
    const r=rad[i];

    // cull: only draw near surface using a few bands
    const bands = 3;
    for(let b=0;b<bands;b++){
      const frac = 0.35 + b*0.22; // near surface
      if(frac < HEX_RIM_CULL) continue;

      // two sides: top/bottom of tube
      for(const side of [+1,-1]){
        const cx = p.x + n.x*r*frac*side;
        const cy = p.y + n.y*r*frac*side;

        // spacing: stamp every Nth segment to control density
        if((i + b + (side>0?0:1)) % Math.max(1, Math.floor(HEX_RIM_STEP*2)) !== 0) continue;

        drawHexOutline(cx,cy,rimR,rot);
        count++;
      }
    }
  }

  ctx.restore();
  return count;
}

/* =========================
   HEAD (colored, readable)
   ========================= */
function drawHead(frame, base, shade){
  const HF=frame.headFrame;
  if(!HF) return;

  const P=HF.P, t=HF.t, n=HF.n, W=HF.W;

  const snout=0.95*W, back=0.55*W, jaw=0.55*W;
  const tip ={x:P.x+t.x*snout,y:P.y+t.y*snout};
  const jawL={x:P.x-t.x*back+n.x*jaw,y:P.y-t.y*back+n.y*jaw};
  const jawR={x:P.x-t.x*back-n.x*jaw,y:P.y-t.y*back-n.y*jaw};

  // skull
  ctx.fillStyle=shade;
  ctx.beginPath();
  ctx.ellipse(P.x,P.y,W*0.55,W*0.42,0,0,Math.PI*2);
  ctx.fill();

  // snout/jaw
  ctx.fillStyle=base;
  poly([tip,jawL,jawR]);

  // horns
  ctx.fillStyle="rgba(0,0,0,0.60)";
  const crown={x:P.x-t.x*(0.10*W),y:P.y-t.y*(0.10*W)};
  const hornLen=0.90*W, hornOff=0.55*W;
  const hbL={x:crown.x-t.x*(0.05*W)+n.x*hornOff,y:crown.y-t.y*(0.05*W)+n.y*hornOff};
  const hbR={x:crown.x-t.x*(0.05*W)-n.x*hornOff,y:crown.y-t.y*(0.05*W)-n.y*hornOff};
  const htL={x:hbL.x+t.x*hornLen+n.x*(0.18*W),y:hbL.y+t.y*hornLen+n.y*(0.18*W)};
  const htR={x:hbR.x+t.x*hornLen-n.x*(0.18*W),y:hbR.y+t.y*hornLen-n.y*(0.18*W)};
  poly([hbL,htL,crown]);
  poly([hbR,htR,crown]);

  // whiskers (curved)
  ctx.strokeStyle="rgba(0,0,0,0.55)";
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

  // eye
  ctx.fillStyle="rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(P.x+t.x*(0.25*W)+n.x*(0.12*W), P.y+t.y*(0.25*W)+n.y*(0.12*W), Math.max(2,0.06*W), 0, Math.PI*2);
  ctx.fill();
}

/* =========================
   RUN
   ========================= */
const A=new Dragon(+1,0);
const B=new Dragon(-1,1);

let last=0;
function loop(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;

  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);

  A.update(dt);
  B.update(dt);

  const fA=A.frame();
  const fB=B.frame();

  // bodies first
  drawBody(fA, JADE_BODY);
  drawBody(fB, CRIM_BODY);

  // lattice skin (hollow hex rims)
  const cA = drawHollowHexLattice(fA, "0,0,0");
  const cB = drawHollowHexLattice(fB, "0,0,0");

  // heads last (clean, no lattice)
  drawHead(fA, JADE_HEAD, "rgba(0,0,0,0.30)");
  drawHead(fB, CRIM_HEAD, "rgba(0,0,0,0.30)");

  if(SHOW_DEBUG){
    ctx.fillStyle="rgba(255,255,255,0.22)";
    ctx.font=(12*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
    ctx.fillText("DRAGON_ENGINE_HOLLOW_HEX_RIM_v1", 12*DPR, 18*DPR);
    ctx.fillText("MODE:"+STRESS_MODE+"  lattice:"+SHOW_LATTICE+"  hexA:"+(cA||0)+" hexB:"+(cB||0), 12*DPR, 36*DPR);
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
