/* TNT — /assets/hel-client.js
   HEL_CLIENT_BASE_v1
   PURPOSE: stable spine simulation + stable ribbon body frame
   RULE: NEVER PUT DRAGON MORPHOLOGY HERE AGAIN. THIS FILE STAYS STABLE.
*/
(function(){
"use strict";
if(window.__HEL_CLIENT_RUNNING__) return;
window.__HEL_CLIENT_RUNNING__=true;

const DPR_CAP=1.6;

/* ===== BASE STABLE PARAMS (LOCKED) ===== */
const SEG=28;                // stable default
const GAP=26;                // spacing
const BASE_R=18;             // thickness baseline (UI can scale via style)
const SPEED=0.40;            // arc speed
const WOB_AMP=0.06;          // small wobble for life
const WOB_FREQ=0.85;         // wobble speed
const RELAX=0.74;            // constraint strength
const SMOOTH_ITERS=1;        // keep flexible but stable

const TOP_MIN=Math.PI*1.10, TOP_MAX=Math.PI*1.88;
const BOT_MIN=Math.PI*0.12, BOT_MAX=Math.PI*0.92;

function lerp(a,b,t){return a+(b-a)*t;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function hypot(x,y){return Math.hypot(x,y)||1;}
function wrap(a){const two=Math.PI*2; while(a<0)a+=two; while(a>=two)a-=two; return a;}
function reflect(a,lo,hi){ if(a<lo) return lo+(lo-a); if(a>hi) return hi-(a-hi); return a; }

function cssNum(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){return NaN;}
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

/* ===== MASS PROFILE (LOCKED, NON-SNAKE PIPE MITIGATION) ===== */
function massProfile(u){
  // neck not too thin, shoulders near front, tail taper
  if(u<0.14){ const t=u/0.14; return 1.10 - 0.05*t; }                 // thick neck
  if(u<0.38){ const t=(u-0.14)/0.24; return 1.05 + 0.30*Math.sin(Math.PI*t); } // shoulders
  if(u<0.72) return 1.00;                                              // torso
  const t=(u-0.72)/0.28; return Math.max(0.22, 1.00*Math.pow(1-t,0.70));// tail
}
function R(u){
  const rr=Math.max(8, BASE_R*massProfile(u));
  return Math.min(rr, GAP*0.49); // tube safety
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
  for(let it=0;it<SMOOTH_ITERS;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.30);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.30);
    }
  }
}

class HelSerpent{
  constructor(top){
    this.top=top;
    this.dir=top?-1:1;
    this.phase=Math.random()*10;
    this.theta=top?Math.PI*1.62:Math.PI*0.38;
    this.spine=new Array(SEG);

    const st=stage();
    const a=this.theta;
    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;
    const tx=-Math.sin(a), ty=Math.cos(a)*0.55;
    for(let i=0;i<SEG;i++) this.spine[i]={x:hx - tx*i*GAP, y:hy - ty*i*GAP};
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
    enforce(this.spine); smooth(this.spine); enforce(this.spine);
  }
  frame(dpr){
    const L=[], Rr=[], spinePx=[], tArr=[], nArr=[], rArr=[];
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
      tArr[i]=t;
      nArr[i]=n;
      rArr[i]=rr*dpr;
    }

    for(let i=0;i<SEG;i++){
      const p=spinePx[i], n=nArr[i], rr=rArr[i];
      L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
      Rr.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
    }

    const idx=(u)=>Math.max(0,Math.min(SEG-1, Math.round(u*(SEG-1))));
    const anchors={
      head: idx(0.00),
      neck: idx(0.10),
      shoulder: idx(0.26),
      leg1: idx(0.28),
      leg2: idx(0.42),
      leg3: idx(0.58),
      leg4: idx(0.72),
      ridge0: idx(0.12),
      ridge1: idx(0.82),
      tail: idx(0.98)
    };

    return {L, R:Rr, spine:spinePx, t:tArr, n:nArr, rad:rArr, anchors:anchors};
  }
}

function BOOT(){
  const cv=mountCanvas();
  const ctx=cv.getContext("2d",{alpha:true,desynchronized:true});
  let dpr=resize(cv);
  addEventListener("resize", ()=>{ dpr=resize(cv); }, {passive:true });

  const top=new HelSerpent(true);
  const bot=new HelSerpent(false);

  let last=0;
  function loop(ts){
    if(!last) last=ts;
    const dt=(ts-last)/1000;
    last=ts;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,cv.width,cv.height);

    top.update(dt);
    bot.update(dt);

    const fT=top.frame(dpr);
    const fB=bot.frame(dpr);

    if(window.HEL_RENDER && window.HEL_RENDER.drawDragon){
      window.HEL_RENDER.drawDragon(ctx, fT, {fill:"rgba(0,110,60,0.92)", strokeW:2.2*dpr});
      window.HEL_RENDER.drawDragon(ctx, fB, {fill:"rgba(170,20,20,0.90)", strokeW:2.2*dpr});
    }

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
