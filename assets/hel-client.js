/* TNT — /assets/hel-client.js
   HEL CLIENT — DRAGON RIG FIX (PIPE→CREATURE, HEAD SWIVEL→YAW CLAMP)
   BUILD: HEL_CLIENT_DRAGON_RIG_v2

   FIXES:
   - Body stops looking like a pipe: true mass profile (neck→shoulders→tail)
   - Spine becomes flexible: traveling wave + lighter smoothing
   - Head stops spinning on a swivel: head yaw is clamped to spine-forward with rate limit
   - Head scales off shoulder mass (not neck radius)
   - Still boots safely regardless of load timing
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
   RIG PARAMETERS (CREATURE, NOT PIPE)
   ========================= */
const SEG=96;

/* spacing: smaller = more flexible, larger = stiffer */
const GAP=22;

/* base mass: shoulders will be higher via profile */
const BASE_R=10;

/* motion */
const SPEED=0.55;
const WOB_AMP=0.18;             /* more flexible than before */
const WOB_FREQ=1.35;            /* temporal frequency */
const WAVE_K=0.22;              /* spatial frequency along spine */
const RELAX=0.55;               /* follow strength */

/* head yaw constraints */
const HEAD_YAW_LIMIT = 0.55;    /* ~31.5° left/right */
const HEAD_YAW_RATE  = 2.8;     /* rad/sec max yaw rate */

/* arc constraints */
const TOP_MIN=Math.PI*1.10, TOP_MAX=Math.PI*1.88;
const BOT_MIN=Math.PI*0.12, BOT_MAX=Math.PI*0.92;

function reflect(a,lo,hi){
  if(a<lo) return lo+(lo-a);
  if(a>hi) return hi-(a-hi);
  return a;
}

/* =========================
   MASS PROFILE (NECK→SHOULDERS→TAIL)
   u in [0,1]
   ========================= */
function massProfile(u){
  // neck taper
  if(u<0.14){
    const t=u/0.14;
    return 0.62 + 0.30*t; // 0.62 → 0.92
  }
  // shoulders peak
  if(u<0.42){
    const t=(u-0.14)/0.28;
    // peak at ~0.28
    return 0.92 + 0.55*Math.sin(Math.PI*t); // up to ~1.47
  }
  // torso steady
  if(u<0.72){
    return 1.10;
  }
  // tail taper (nonlinear)
  const t=(u-0.72)/0.28;
  return Math.max(0.20, 1.10*Math.pow(1-t,0.65));
}

/* tube safety: radius must be <= GAP/2 */
function R(u){
  const rr=Math.max(6, BASE_R*massProfile(u));
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
  // lighter smoothing (more flex)
  for(let it=0;it<1;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.32);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.32);
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

    // head yaw state
    this.headYaw=0;

    const st=stage();
    const a=this.theta;
    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    // initial forward direction along arc
    const tx=-Math.sin(a), ty=Math.cos(a)*0.55;
    for(let i=0;i<SEG;i++){
      this.spine[i]={x:hx - tx*i*GAP, y:hy - ty*i*GAP};
    }
  }

  update(dt){
    const st=stage();

    // move head along arc
    this.theta=wrap(this.theta + this.dir*SPEED*dt);

    // traveling wave adds flexibility to arc angle (acts like “body following”)
    const time=performance.now()/1000;
    let a=this.theta + Math.sin(time*WOB_FREQ + this.phase)*WOB_AMP;

    a = this.top ? reflect(a,TOP_MIN,TOP_MAX) : reflect(a,BOT_MIN,BOT_MAX);

    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    // set head
    this.spine[0].x=hx; this.spine[0].y=hy;

    // constraint passes
    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);

    // additional body wave: pushes interior points slightly along normal to look alive
    // (does NOT move head; does not break spacing if amplitude is limited)
    const amp=0.22*GAP;
    for(let i=3;i<SEG-3;i++){
      const u=i/(SEG-1);
      const t=tangent(this.spine,i);
      const n={x:-t.y,y:t.x};
      const w=Math.sin(time*WOB_FREQ*1.2 - i*WAVE_K + this.phase);
      const taper=(u<0.12)?0.25:(u>0.90?0.20:1.0);
      this.spine[i].x += n.x*w*amp*taper;
      this.spine[i].y += n.y*w*amp*taper;
    }

    // re-enforce after wave
    enforce(this.spine);
  }

  frame(dpr){
    const L=[], Rr=[];
    const spinePx=new Array(SEG);
    const tArr=new Array(SEG);
    const nArr=new Array(SEG);
    const rArr=new Array(SEG);

    // normal continuity
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

    // rails
    for(let i=0;i<SEG;i++){
      const p=spinePx[i], n=nArr[i], rr=rArr[i];
      L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
      Rr.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
    }

    // anchors
    const idx=(u)=>Math.max(0,Math.min(SEG-1, Math.round(u*(SEG-1))));
    const A={
      head: idx(0.00),
      neck: idx(0.10),
      shoulder: idx(0.28),
      leg1: idx(0.25),
      leg2: idx(0.40),
      leg3: idx(0.55),
      leg4: idx(0.70),
      ridge0: idx(0.10),
      ridge1: idx(0.80),
      tail: idx(0.98)
    };

    // head orientation: spine-forward (P0->P1), with yaw clamp
    const h=A.head;
    const P0=this.spine[h], P1=this.spine[Math.min(SEG-1,h+1)];
    let dx=(P1.x-P0.x), dy=(P1.y-P0.y), dd=Math.hypot(dx,dy)||1;
    const spineAng=Math.atan2(dy,dx);

    // desired yaw is 0 (point along spine); clamp any drift by rate + limit
    const yawTarget=0;
    const maxStep=HEAD_YAW_RATE*(1/60); // approximate per-frame (render loop is rAF)
    const dyaw=clamp(angDelta(this.headYaw,yawTarget),-maxStep,maxStep);
    this.headYaw=clamp(this.headYaw+dyaw,-HEAD_YAW_LIMIT,HEAD_YAW_LIMIT);

    const headAng=spineAng+this.headYaw;
    const th={x:Math.cos(headAng),y:Math.sin(headAng)};
    const nh={x:-th.y,y:th.x};

    // head size scales off shoulder radius (not neck)
    const rHead = Math.max(rArr[A.neck], rArr[A.shoulder]*0.95);
    const rNeck = Math.max(6, rArr[A.neck]);
    const headW = Math.max(1.4*rNeck, 1.8*rHead); // enforce head>=1.4×neck + shoulder-based mass

    const Ph=spinePx[h];

    const forward=0.95*headW;
    const back=0.55*headW;
    const jaw=0.55*headW;

    const tip ={x:Ph.x+th.x*forward,y:Ph.y+th.y*forward};
    const left={x:Ph.x-th.x*back+nh.x*jaw,y:Ph.y-th.y*back+nh.y*jaw};
    const right={x:Ph.x-th.x*back-nh.x*jaw,y:Ph.y-th.y*back-nh.y*jaw};

    const cap={x:Ph.x-th.x*(0.18*headW),y:Ph.y-th.y*(0.18*headW),rx:0.62*headW,ry:0.44*headW};

    // tail fin
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
    ctx.fillText("HEL_CLIENT_DRAGON_RIG_v2", 12*dpr, cv.height-14*dpr);

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
