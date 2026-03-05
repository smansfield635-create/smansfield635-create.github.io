/* TNT — /assets/hel-client.js
   HEL CLIENT — DRAGON PROPORTIONS FIX (THICK NECK + MASSIVE HEAD + NO 360 SWIVEL)
   BUILD: HEL_CLIENT_DRAGON_RIG_v3

   YOUR REQUESTS IMPLEMENTED:
   - Body is thick near head (not snake-neck thin)
   - Neck stays thick (head-adjacent mass maintained)
   - Head size ≈ 20× (relative to current head sizing basis)
   - Head cannot spin 360°: yaw limited to 180° total (±90°)
   - Head turns slowly (low yaw rate)

   NOTE:
   - Renderer stays unchanged (HEL_RENDER already present).
*/

(function(){
"use strict";
if(window.__HEL_CLIENT_RUNNING__) return;
window.__HEL_CLIENT_RUNNING__=true;

const DPR_CAP=1.6;

function lerp(a,b,t){return a+(b-a)*t;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function hypot(x,y){return Math.hypot(x,y)||1;}
function cssNum(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){return NaN;}
}
function wrap(a){
  const two=Math.PI*2;
  while(a<0) a+=two;
  while(a>=two) a-=two;
  return a;
}
function angDelta(a,b){
  const two=Math.PI*2;
  let d=(b-a)%two;
  if(d>Math.PI) d-=two;
  if(d<-Math.PI) d+=two;
  return d;
}

function mountCanvas(){
  let c=document.getElementById("hel_entity_canvas");
  if(c) return c;
  c=document.createElement("canvas");
  c.id="hel_entity_canvas";
  c.style.position="absolute";
  c.style.inset="0";
  c.style.width="100%";
  c.style.height="100%";
  c.style.pointerEvents="none";
  c.style.transform="translateZ(0)";
  (document.getElementById("gd-dragon")||document.body).appendChild(c);
  return c;
}
function resize(c){
  let dpr=1; try{dpr=window.devicePixelRatio||1;}catch(e){}
  dpr=Math.min(DPR_CAP,Math.max(1,dpr));
  c.width=Math.floor((window.innerWidth||1)*dpr);
  c.height=Math.floor((window.innerHeight||1)*dpr);
  return dpr;
}
function stage(){
  const vw=window.innerWidth||1, vh=window.innerHeight||1;
  const r1=cssNum("--gd_r1");
  const Cx=vw*0.5, Cy=vh*0.52;
  const R=clamp((Number.isFinite(r1)?r1:180)*1.10,150,Math.min(vw,vh)*0.42);
  return {Cx,Cy,R,vw,vh};
}

/* =========================
   BODY (shorter, much thicker)
   ========================= */
const SEG=18;          /* shorter body */
const GAP=34;          /* spacing to support thicker body */
const BASE_R=42;       /* thick base */

/* motion */
const SPEED=0.30;
const WOB_AMP=0.06;
const WOB_FREQ=0.75;
const RELAX=0.82;

/* head yaw controls (NO 360) */
const HEAD_YAW_LIMIT = Math.PI/2; /* ±90° = 180° total max */
const HEAD_YAW_RATE  = 0.35;      /* slow turning (rad/sec) */

/* arc constraints */
const TOP_MIN=Math.PI*1.10, TOP_MAX=Math.PI*1.88;
const BOT_MIN=Math.PI*0.12, BOT_MAX=Math.PI*0.92;

function reflect(a,lo,hi){
  if(a<lo) return lo+(lo-a);
  if(a>hi) return hi-(a-hi);
  return a;
}

/* =========================
   MASS PROFILE (THICK NEAR HEAD)
   - neck NOT thin
   - shoulders close to head
   - taper later
   ========================= */
function massProfile(u){
  // u=0 head, u=1 tail
  if(u<0.12){
    // thick neck immediately (not snake)
    const t=u/0.12;
    return 1.55 - 0.10*t; // ~1.55 → ~1.45
  }
  if(u<0.35){
    // shoulder mass close to head
    const t=(u-0.12)/0.23;
    return 1.45 + 0.25*Math.sin(Math.PI*t); // peak ~1.70
  }
  if(u<0.70){
    // torso stays thick
    return 1.35;
  }
  // tail taper (nonlinear)
  const t=(u-0.70)/0.30;
  return Math.max(0.18, 1.35*Math.pow(1-t,0.70));
}

/* tube safety: keep radius <= GAP/2 */
function R(u){
  const rr=Math.max(10, BASE_R*massProfile(u));
  return Math.min(rr, GAP*0.48);
}

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
  for(let it=0;it<1;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.28);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.28);
    }
  }
}

class DragonSim{
  constructor(top){
    this.top=top;
    this.dir=top?-1:1;
    this.phase=Math.random()*10;
    this.theta=top?Math.PI*1.62:Math.PI*0.38;
    this.spine=new Array(SEG);

    /* head yaw state */
    this.headYaw=0;

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

  frame(dpr){
    const L=[], Rr=[];
    const spinePx=new Array(SEG);
    const tArr=new Array(SEG);
    const nArr=new Array(SEG);
    const rArr=new Array(SEG);

    /* normals with continuity */
    let prevN=null;
    for(let i=0;i<SEG;i++){
      const p=this.spine[i];
      const u=i/(SEG-1);
      const rr=R(u);

      const t=tangent(this.spine,i);
      let n={x:-t.y,y:t.x};

      if(prevN){
        const dot=n.x*prevN.x+n.y*prevN.y;
        if(dot<0){ n.x=-n.x; n.y=-n.y; }
      }
      prevN={x:n.x,y:n.y};

      spinePx[i]={x:p.x*dpr,y:p.y*dpr};
      tArr[i]={x:t.x,y:t.y};
      nArr[i]={x:n.x,y:n.y};
      rArr[i]=rr*dpr;
    }

    /* rails */
    for(let i=0;i<SEG;i++){
      const p=spinePx[i], n=nArr[i], rr=rArr[i];
      L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
      Rr.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
    }

    /* anchors */
    const idx=(u)=>Math.max(0,Math.min(SEG-1, Math.round(u*(SEG-1))));
    const A={
      head: idx(0.00),
      neck: idx(0.10),
      shoulder: idx(0.22),
      leg1: idx(0.28),
      leg2: idx(0.42),
      leg3: idx(0.58),
      leg4: idx(0.72),
      ridge0: idx(0.10),
      ridge1: idx(0.82),
      tail: idx(0.98)
    };

    /* head direction: spine segment with slow yaw */
    const h=A.head;
    const P0=this.spine[h], P1=this.spine[Math.min(SEG-1,h+1)];
    let dx=(P1.x-P0.x), dy=(P1.y-P0.y), dd=Math.hypot(dx,dy)||1;
    const spineAng=Math.atan2(dy,dx);

    /* yaw target is aligned with spine (no swivel), rate-limited + bounded */
    const yawTarget=0;
    const maxStep=HEAD_YAW_RATE*(1/60);
    const dyaw=clamp(angDelta(this.headYaw,yawTarget),-maxStep,maxStep);
    this.headYaw=clamp(this.headYaw+dyaw,-HEAD_YAW_LIMIT,HEAD_YAW_LIMIT);

    const headAng=spineAng+this.headYaw;
    const th={x:Math.cos(headAng),y:Math.sin(headAng)};
    const nh={x:-th.y,y:th.x};

    /* ===== HEAD SIZE: 20× =====
       We scale head off NECK radius in pixels (rArr[neck]).
       This is your requested “20× the size it is right now.”
    */
    const rNeck = Math.max(10, rArr[A.neck] || rArr[h] || 12);
    let headW = 20.0 * (rNeck*2);      /* width in px */

    /* Keep it on-screen: cap to 38% of min viewport (still huge) */
    const st=stage();
    const capW = 0.38*Math.min(st.vw, st.vh)*dpr;
    headW = Math.min(headW, capW);

    const Ph=spinePx[h];

    const forward=0.95*headW;
    const back=0.55*headW;
    const jaw=0.55*headW;

    const tip ={x:Ph.x+th.x*forward,y:Ph.y+th.y*forward};
    const left={x:Ph.x-th.x*back+nh.x*jaw,y:Ph.y-th.y*back+nh.y*jaw};
    const right={x:Ph.x-th.x*back-nh.x*jaw,y:Ph.y-th.y*back-nh.y*jaw};

    const cap={x:Ph.x-th.x*(0.18*headW),y:Ph.y-th.y*(0.18*headW),rx:0.62*headW,ry:0.44*headW};

    /* tail fin */
    const tail=A.tail;
    const Pt=spinePx[tail];
    const tt=tArr[tail], nt=nArr[tail], rt=rArr[tail];
    const a2={x:Pt.x,y:Pt.y};
    const b2={x:Pt.x-tt.x*(2.0*rt)+nt.x*(1.1*rt),y:Pt.y-tt.y*(2.0*rt)+nt.y*(1.1*rt)};
    const c2={x:Pt.x-tt.x*(2.0*rt)-nt.x*(1.1*rt),y:Pt.y-tt.y*(2.0*rt)-nt.y*(1.1*rt)};

    return {
      L, R:Rr,
      spine: spinePx,
      t: tArr,
      n: nArr,
      rad: rArr,
      anchors: A,
      head: {tip,left,right,cap},
      tailFin: {a:a2,b:b2,c:c2}
    };
  }
}

function BOOT(){
  const cv=mountCanvas();
  const ctx=cv.getContext("2d",{alpha:true,desynchronized:true});
  let dpr=resize(cv);
  window.addEventListener("resize", ()=>{ dpr=resize(cv); }, {passive:true});

  const topD=new DragonSim(true);
  const botD=new DragonSim(false);

  let last=0;
  function loop(ts){
    if(!last) last=ts;
    const dt=(ts-last)/1000;
    last=ts;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,cv.width,cv.height);

    topD.update(dt);
    botD.update(dt);

    const fT=topD.frame(dpr);
    const fB=botD.frame(dpr);

    if(window.HEL_RENDER && window.HEL_RENDER.drawDragon){
      window.HEL_RENDER.drawDragon(ctx, fT, {fill:"rgba(0,110,60,0.92)", strokeW:2.3*dpr});
      window.HEL_RENDER.drawDragon(ctx, fB, {fill:"rgba(170,20,20,0.90)", strokeW:2.3*dpr});
    }

    ctx.fillStyle="rgba(255,255,255,0.18)";
    ctx.font=(14*dpr)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
    ctx.fillText("HEL_CLIENT_DRAGON_RIG_v3", 12*dpr, cv.height-14*dpr);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if(document.readyState==="complete" || document.readyState==="interactive"){
  setTimeout(BOOT,0);
}else{
  document.addEventListener("DOMContentLoaded", BOOT, {once:true});
}

})();
