/* TNT — /assets/hel-client.js
   HEL CLIENT (HELL MODE)
   PURPOSE: prove boot, prove draw, prove renderer presence, surface errors on-screen
   BUILD: HEL_CLIENT_HELL_DIAG_v1
   OUTPUT: same two dragons when HEL_RENDER is present; fallback drawing if not
*/
(function(){
"use strict";
if(window.__HEL_CLIENT_RUNNING__) return;
window.__HEL_CLIENT_RUNNING__ = true;

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

function ensureBootPanel(){
  let b=document.getElementById("hel_boot_panel");
  if(b) return b;
  b=document.createElement("div");
  b.id="hel_boot_panel";
  b.style.position="fixed";
  b.style.left="10px";
  b.style.top="10px";
  b.style.zIndex="99999";
  b.style.padding="8px 10px";
  b.style.borderRadius="10px";
  b.style.background="rgba(0,0,0,.70)";
  b.style.color="rgba(255,255,255,.92)";
  b.style.font="12px ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";
  b.style.pointerEvents="none";
  b.textContent="HEL: init…";
  document.body.appendChild(b);
  return b;
}
function bootMsg(s){
  try{
    const b=ensureBootPanel();
    b.textContent=s;
  }catch(e){}
  try{ console.log(s); }catch(e){}
}

/* Catch hard failures */
window.addEventListener("error", function(ev){
  bootMsg("HEL ERROR: "+(ev && ev.message ? ev.message : "unknown"));
});
window.addEventListener("unhandledrejection", function(ev){
  bootMsg("HEL REJECT: "+(ev && ev.reason ? String(ev.reason) : "unknown"));
});

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

const SEG=96;
const GAP=18;
const SPEED=0.45;
const WOB=0.06;
const BASE_R=28;

const TOP_MIN=Math.PI*1.10, TOP_MAX=Math.PI*1.88;
const BOT_MIN=Math.PI*0.12, BOT_MAX=Math.PI*0.92;

function wrap(a){
  const two=Math.PI*2;
  while(a<0) a+=two;
  while(a>=two) a-=two;
  return a;
}
function reflect(a,lo,hi){
  if(a<lo) return lo+(lo-a);
  if(a>hi) return hi-(a-hi);
  return a;
}

function radiusMul(u){
  if(u<0.06) return 1.45;
  if(u<0.18){ const t=(u-0.06)/0.12; return 0.65 + 0.35*Math.sin(Math.PI*t); }
  if(u<0.34){ const t=(u-0.18)/0.16; return 1.25 + 0.35*Math.sin(Math.PI*t); }
  if(u<0.78) return 1.05;
  const t=(u-0.78)/0.22;
  return Math.max(0.18, 1.05*(1-0.82*t));
}
function R(u){ return Math.max(6, BASE_R*radiusMul(u)); }

function tangent(sp,i){
  const a=sp[Math.max(0,i-1)], b=sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=Math.max(0.0001,hypot(dx,dy));
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t=tangent(sp,i);
  return {x:-t.y,y:t.x};
}
function enforce(sp){
  for(let i=1;i<sp.length;i++){
    const p=sp[i-1], c=sp[i];
    const dx=p.x-c.x, dy=p.y-c.y, d=Math.max(0.0001,hypot(dx,dy));
    const tx=p.x-(dx/d)*GAP;
    const ty=p.y-(dy/d)*GAP;
    c.x=lerp(c.x,tx,0.62);
    c.y=lerp(c.y,ty,0.62);
  }
}
function smooth(sp){
  for(let it=0;it<2;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.40);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.40);
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
    let a=this.theta + Math.sin((performance.now()/1000)*1.1 + this.phase)*WOB;
    a = this.top ? reflect(a,TOP_MIN,TOP_MAX) : reflect(a,BOT_MIN,BOT_MAX);
    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;
    this.spine[0].x=hx; this.spine[0].y=hy;
    enforce(this.spine); smooth(this.spine); enforce(this.spine);
  }
  frame(dpr){
    const L=[], Rr=[];
    for(let i=0;i<SEG;i++){
      const p=this.spine[i];
      const u=i/(SEG-1);
      const rr=R(u);
      const n=normal(this.spine,i);
      L.push({x:(p.x+n.x*rr)*dpr,y:(p.y+n.y*rr)*dpr});
      Rr.push({x:(p.x-n.x*rr)*dpr,y:(p.y-n.y*rr)*dpr});
    }
    const h=this.spine[0];
    const t=tangent(this.spine,0);
    const nx=-t.y, ny=t.x;
    const forward=34, back=22, jaw=18;
    const tip={x:(h.x+t.x*forward)*dpr,y:(h.y+t.y*forward)*dpr};
    const left={x:(h.x-t.x*back+nx*jaw)*dpr,y:(h.y-t.y*back+ny*jaw)*dpr};
    const right={x:(h.x-t.x*back-nx*jaw)*dpr,y:(h.y-t.y*back-ny*jaw)*dpr};
    const cap={x:(h.x-t.x*10)*dpr,y:(h.y-t.y*10)*dpr,rx:18*dpr,ry:12*dpr};

    const tail=this.spine[SEG-1];
    const tt=tangent(this.spine,SEG-1);
    const fnx=-tt.y, fny=tt.x;
    const a2={x:tail.x*dpr,y:tail.y*dpr};
    const b2={x:(tail.x-tt.x*28+fnx*16)*dpr,y:(tail.y-tt.y*28+fny*16)*dpr};
    const c2={x:(tail.x-tt.x*28-fnx*16)*dpr,y:(tail.y-tt.y*28-fny*16)*dpr};

    return {L:L,R:Rr,head:{tip,left,right,cap},tailFin:{a:a2,b:b2,c:c2}};
  }
}

/* FALLBACK DRAW (if renderer missing) */
function fallback(ctx, f, fill){
  const L=f.L, R=f.R;
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();
  ctx.fillStyle=fill;
  ctx.fill();
}

function BOOT(){
  bootMsg("HEL: boot start (client running)");
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

    const hasRenderer = !!(window.HEL_RENDER && window.HEL_RENDER.drawDragon);

    if(hasRenderer){
      window.HEL_RENDER.drawDragon(ctx, fT, {fill:"rgba(0,110,60,0.92)", strokeW:2.6*dpr});
      window.HEL_RENDER.drawDragon(ctx, fB, {fill:"rgba(170,20,20,0.90)", strokeW:2.6*dpr});
      bootMsg("HEL: DRAW OK (renderer present)");
    }else{
      fallback(ctx, fT, "rgba(0,110,60,0.92)");
      fallback(ctx, fB, "rgba(170,20,20,0.90)");
      bootMsg("HEL: FALLBACK (renderer missing)");
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* Boot regardless of script timing */
if(document.readyState==="complete" || document.readyState==="interactive"){
  setTimeout(BOOT,0);
}else{
  document.addEventListener("DOMContentLoaded", BOOT, {once:true});
}

})();
