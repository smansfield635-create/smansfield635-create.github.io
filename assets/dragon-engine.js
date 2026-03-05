/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_CORE+SKIN_v1
   RULE: DRAGON_CORE is LOCKED. Only edit DRAGON_SKIN going forward.
   GOAL: two dragons, separated lanes, enter→exit→re-enter, ribbon body, hollow hex rim scales, readable head.
*/

(function(){
"use strict";
if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* ============================================================
   DRAGON_CORE (LOCKED)
   - canvas + DPR
   - spine + ribbon hull
   - enter/exit choreography (two lanes, no clashing)
   - body clip + hollow-hex rim lattice scaffolding
   - calls DRAGON_SKIN hooks only
   ============================================================ */

/* ---------- CORE PARAMS (LOCKED) ---------- */
const CORE = {
  DPR_CAP: 1.6,

  /* motion + lanes */
  SPEED_PX_PER_S: 520,
  OFFSCREEN_PAD: 260,
  SEPARATION_PX: 380,
  Y_BOB_AMP: 26,
  Y_BOB_FREQ: 0.9,

  /* spine/body */
  SEG: 26,
  GAP: 34,
  BASE_R: 34,
  THICK_MULT: 1.25,      // base thickness (+25%)
  RELAX: 0.74,
  SMOOTH_ITERS: 1,

  /* lattice region exclusion near head */
  HEAD_EXCLUDE_U: 0.14,

  /* lattice rendering defaults (stroke-only) */
  HEX_RIM_RADIUS: 7.0,
  HEX_RIM_STROKE: 1.25,
  HEX_RIM_ALPHA: 0.22,
  HEX_RIM_ROT_DEG: 9,
  HEX_RIM_STEP: 1.05,    // density control
  HEX_RIM_CULL: 0.62     // near-surface band threshold
};

/* ---------- CORE UTILS ---------- */
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function hypot(x,y){return Math.hypot(x,y)||1;}
function stage(){
  const vw=window.innerWidth||1, vh=window.innerHeight||1;
  return {vw,vh,Cy:vh*0.55};
}
function laneY(vh,lane){
  const base=vh*0.55;
  const sep=Math.min(vh*0.18,180);
  return lane===0 ? (base-sep) : (base+sep);
}

/* ---------- CANVAS (LOCKED) ---------- */
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
  let dpr=1; try{dpr=window.devicePixelRatio||1;}catch(e){}
  DPR=Math.min(CORE.DPR_CAP,Math.max(1,dpr));
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  cv.width=W; cv.height=H;
}
resize();
addEventListener("resize",resize,{passive:true});

/* ---------- BODY PROFILE (LOCKED) ---------- */
function massProfile(u){
  if(u<0.20) return 1.45;
  if(u<0.42){
    const t=(u-0.20)/0.22;
    return 1.35 + 0.30*Math.sin(Math.PI*t);
  }
  if(u<0.75) return 1.20;
  const t=(u-0.75)/0.25;
  return Math.max(0.20, 1.20*Math.pow(1-t,0.72));
}
function radiusAt(u){
  const rr = CORE.BASE_R*CORE.THICK_MULT*massProfile(u);
  return Math.min(rr, CORE.GAP*0.48);
}

/* ---------- SPINE CONSTRAINTS (LOCKED) ---------- */
function tangent(sp,i){
  const a=sp[Math.max(0,i-1)], b=sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=Math.max(0.0001,hypot(dx,dy));
  return {x:dx/d,y:dy/d};
}
function enforce(sp){
  for(let i=1;i<sp.length;i++){
    const p=sp[i-1], c=sp[i];
    const dx=p.x-c.x, dy=p.y-c.y, d=Math.max(0.0001,hypot(dx,dy));
    const tx=p.x-(dx/d)*CORE.GAP;
    const ty=p.y-(dy/d)*CORE.GAP;
    c.x=lerp(c.x,tx,CORE.RELAX);
    c.y=lerp(c.y,ty,CORE.RELAX);
  }
}
function smooth(sp){
  for(let it=0;it<CORE.SMOOTH_ITERS;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.24);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.24);
    }
  }
}

/* ---------- FRAME BUILD (LOCKED) ---------- */
function buildFrame(sp){
  const spinePx=[], tArr=[], nArr=[], rArr=[], L=[], R=[];
  let prevN=null;

  for(let i=0;i<sp.length;i++){
    const p=sp[i];
    const u=i/(sp.length-1);
    const rr=radiusAt(u);

    const t=tangent(sp,i);
    let n={x:-t.y,y:t.x};
    if(prevN){
      const dot=n.x*prevN.x+n.y*prevN.y;
      if(dot<0){ n.x=-n.x; n.y=-n.y; }
    }
    prevN={x:n.x,y:n.y};

    spinePx.push({x:p.x*DPR,y:p.y*DPR});
    tArr.push(t);
    nArr.push(n);
    rArr.push(rr*DPR);
  }

  for(let i=0;i<spinePx.length;i++){
    const p=spinePx[i], n=nArr[i], rr=rArr[i];
    L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
    R.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
  }

  // anchors (locked canonical)
  const idx=(u)=>Math.max(0,Math.min(sp.length-1, Math.round(u*(sp.length-1))));
  const anchors={
    head: 0,
    neck: idx(0.12),
    shoulder: idx(0.26),
    ridge0: idx(0.12),
    ridge1: idx(0.84),
    leg1: idx(0.30),
    leg2: idx(0.44),
    leg3: idx(0.60),
    leg4: idx(0.74),
    tail: idx(0.98)
  };

  return {L,R,spine:spinePx,t:tArr,n:nArr,rad:rArr,anchors};
}

/* ---------- DRAW HELPERS (LOCKED) ---------- */
function drawBodyHull(L,R,fill){
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

function clipToBody(L,R){
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();
  ctx.clip();
}

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

/* Hollow hex rims clipped to body. Head region excluded by u. */
function drawHollowHexRims(frame, strokeRGB){
  const L=frame.L, R=frame.R;
  const spine=frame.spine, nArr=frame.n, rad=frame.rad;

  ctx.save();
  clipToBody(L,R);

  const headCut = Math.max(0, Math.floor(CORE.HEAD_EXCLUDE_U*(CORE.SEG-1)));

  const rimR = CORE.HEX_RIM_RADIUS*DPR;
  const rimW = CORE.HEX_RIM_STROKE*DPR;
  const rot = (CORE.HEX_RIM_ROT_DEG*Math.PI/180);

  ctx.strokeStyle = `rgba(${strokeRGB},${CORE.HEX_RIM_ALPHA})`;
  ctx.lineWidth = Math.max(1,rimW);
  ctx.lineJoin="round";

  for(let i=headCut+3;i<spine.length-4;i++){
    const u=i/(spine.length-1);
    const p=spine[i];
    const n=nArr[i];
    const r=rad[i];

    // near-surface bands only (keeps it from becoming a solid screen)
    const bands = 3;
    for(let b=0;b<bands;b++){
      const frac = 0.35 + b*0.22;
      if(frac < CORE.HEX_RIM_CULL) continue;

      for(const side of [+1,-1]){
        if((i + b + (side>0?0:1)) % Math.max(1, Math.floor(CORE.HEX_RIM_STEP*2)) !== 0) continue;
        const cx = p.x + n.x*r*frac*side;
        const cy = p.y + n.y*r*frac*side;
        drawHexOutline(cx,cy,rimR,rot);
      }
    }
  }

  ctx.restore();
}

/* ---------- CHOREOGRAPHY (LOCKED) ---------- */
class DragonCore{
  constructor(dir,lane){
    this.dir=dir;   // +1 right, -1 left
    this.lane=lane; // 0 top, 1 bottom
    this.seed=Math.random()*10;
    this.t=0;

    const st=stage();
    this.x=(dir>0)?(-CORE.OFFSCREEN_PAD):(st.vw+CORE.OFFSCREEN_PAD);
    this.y=laneY(st.vh,lane);

    this.spine=new Array(CORE.SEG);
    for(let i=0;i<CORE.SEG;i++){
      this.spine[i]={x:this.x - i*CORE.GAP*dir, y:this.y};
    }
  }

  update(dt){
    const st=stage();
    this.t += dt;

    this.x += this.dir*CORE.SPEED_PX_PER_S*dt;

    const bob = Math.sin(this.t*CORE.Y_BOB_FREQ + this.seed) * CORE.Y_BOB_AMP;
    this.y = laneY(st.vh,this.lane) + bob;

    this.spine[0].x=this.x;
    this.spine[0].y=this.y;

    for(let i=CORE.SEG-1;i>=1;i--){
      this.spine[i].x=this.spine[i-1].x;
      this.spine[i].y=this.spine[i-1].y;
    }

    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);

    // exit/re-enter from the side exited
    if(this.dir>0 && this.x > st.vw + CORE.OFFSCREEN_PAD){
      this.x = -CORE.OFFSCREEN_PAD;
    }
    if(this.dir<0 && this.x < -CORE.OFFSCREEN_PAD){
      this.x = st.vw + CORE.OFFSCREEN_PAD;
    }
  }
}

/* ============================================================
   DRAGON_SKIN (EDIT THIS SECTION ONLY)
   - head / horns / whiskers / eyes / fire cue
   - optional extra skin layers
   ============================================================ */

const DRAGON_SKIN = {

  /* Colors per dragon */
  paletteA:{
    body:"rgba(46,213,115,0.92)",
    rimRGB:"0,0,0",
    head:"rgba(20,120,70,0.92)",
    skull:"rgba(0,0,0,0.30)"
  },
  paletteB:{
    body:"rgba(255,59,59,0.90)",
    rimRGB:"0,0,0",
    head:"rgba(160,30,30,0.90)",
    skull:"rgba(0,0,0,0.30)"
  },

  /* Head draw: colored skull + snout + horns + whiskers + eye */
  drawHead(frame, headFill, skullFill){
    const spine=frame.spine, tArr=frame.t, nArr=frame.n, rad=frame.rad;

    const P=spine[0];
    const t=tArr[0]||{x:1,y:0};
    const n=nArr[0]||{x:0,y:-1};

    const neckIdx=Math.min(3,rad.length-1);
    const shoulderIdx=Math.min(6,rad.length-1);
    const rShoulder=Math.max(rad[neckIdx]||20, rad[shoulderIdx]||20);

    // head width derived from body (sane, readable)
    const Whead = Math.min(2.6*(2*rShoulder), 0.22*Math.min(W,H));

    const skullR=0.55*Whead;
    const snout =0.95*Whead;
    const back  =0.55*Whead;
    const jaw   =0.55*Whead;

    const nose={x:P.x+t.x*snout,y:P.y+t.y*snout};
    const jawL={x:P.x-t.x*back+n.x*jaw,y:P.y-t.y*back+n.y*jaw};
    const jawR={x:P.x-t.x*back-n.x*jaw,y:P.y-t.y*back-n.y*jaw};

    // skull
    ctx.fillStyle=skullFill;
    ctx.beginPath();
    ctx.ellipse(P.x,P.y,skullR,skullR*0.78,0,0,Math.PI*2);
    ctx.fill();

    // snout/jaw
    ctx.fillStyle=headFill;
    ctx.beginPath();
    ctx.moveTo(nose.x,nose.y);
    ctx.lineTo(jawL.x,jawL.y);
    ctx.lineTo(jawR.x,jawR.y);
    ctx.closePath();
    try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }

    // horns
    ctx.fillStyle="rgba(0,0,0,0.60)";
    const crown={x:P.x-t.x*(0.10*Whead),y:P.y-t.y*(0.10*Whead)};
    const hornLen=0.90*Whead, hornOff=0.55*Whead;
    const hbL={x:crown.x-t.x*(0.05*Whead)+n.x*hornOff,y:crown.y-t.y*(0.05*Whead)+n.y*hornOff};
    const hbR={x:crown.x-t.x*(0.05*Whead)-n.x*hornOff,y:crown.y-t.y*(0.05*Whead)-n.y*hornOff};
    const htL={x:hbL.x+t.x*hornLen+n.x*(0.18*Whead),y:hbL.y+t.y*hornLen+n.y*(0.18*Whead)};
    const htR={x:hbR.x+t.x*hornLen-n.x*(0.18*Whead),y:hbR.y+t.y*hornLen-n.y*(0.18*Whead)};

    ctx.beginPath(); ctx.moveTo(hbL.x,hbL.y); ctx.lineTo(htL.x,htL.y); ctx.lineTo(crown.x,crown.y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hbR.x,hbR.y); ctx.lineTo(htR.x,htR.y); ctx.lineTo(crown.x,crown.y); ctx.closePath(); ctx.fill();

    // whiskers
    ctx.strokeStyle="rgba(0,0,0,0.55)";
    ctx.lineWidth=Math.max(1,1.6*DPR);
    function whisk(side,lift){
      const s=side;
      const root={x:P.x+t.x*(0.42*Whead)+n.x*(s*0.42*Whead),y:P.y+t.y*(0.42*Whead)+n.y*(s*0.42*Whead)};
      const mid ={x:root.x+t.x*(0.55*Whead)+n.x*(s*lift*0.55*Whead),y:root.y+t.y*(0.55*Whead)+n.y*(s*lift*0.55*Whead)};
      const end ={x:root.x+t.x*(1.05*Whead)+n.x*(s*lift*0.95*Whead),y:root.y+t.y*(1.05*Whead)+n.y*(s*lift*0.95*Whead)};
      ctx.beginPath(); ctx.moveTo(root.x,root.y); ctx.quadraticCurveTo(mid.x,mid.y,end.x,end.y); ctx.stroke();
    }
    whisk(+1,+1); whisk(+1,-1);
    whisk(-1,+1); whisk(-1,-1);

    // eye
    ctx.fillStyle="rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(P.x+t.x*(0.25*Whead)+n.x*(0.12*Whead), P.y+t.y*(0.25*Whead)+n.y*(0.12*Whead), Math.max(2,0.06*Whead), 0, Math.PI*2);
    ctx.fill();
  }
};

/* ============================================================
   MAIN (LOCKED WIRING)
   ============================================================ */

const dragonA=new DragonCore(+1,0);
const dragonB=new DragonCore(-1,1);

let last=0;
function loop(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;

  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);

  dragonA.update(dt);
  dragonB.update(dt);

  const fA=buildFrame(dragonA.spine);
  const fB=buildFrame(dragonB.spine);

  // A
  drawBodyHull(fA.L,fA.R,DRAGON_SKIN.paletteA.body);
  drawHollowHexRims(fA,DRAGON_SKIN.paletteA.rimRGB);
  DRAGON_SKIN.drawHead(fA, DRAGON_SKIN.paletteA.head, DRAGON_SKIN.paletteA.skull);

  // B
  drawBodyHull(fB.L,fB.R,DRAGON_SKIN.paletteB.body);
  drawHollowHexRims(fB,DRAGON_SKIN.paletteB.rimRGB);
  DRAGON_SKIN.drawHead(fB, DRAGON_SKIN.paletteB.head, DRAGON_SKIN.paletteB.skull);

  // watermark
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(14*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_ENGINE_CORE+SKIN_v1", 12*DPR, H-14*DPR);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
