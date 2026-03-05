/* TNT — /assets/hel-client.js
   BUILD: HEL_CLIENT_BASE_LOCKED_v1
   PURPOSE: LOCKED engine simulation (spine + ribbon frame). NO dragon art here.
*/
(function(){
"use strict";
if(window.__HEL_CLIENT_RUNNING__) return;
window.__HEL_CLIENT_RUNNING__=true;

const DPR_CAP=1.6;

/* LOCKED SIM PARAMS */
const SEG=26;
const GAP=34;
const SPEED_PX_PER_S=520;
const OFFSCREEN_PAD=260;
const SEPARATION_PX=380;
const Y_BOB_AMP=26;
const Y_BOB_FREQ=0.9;

/* LOCKED BODY PROFILE */
const BASE_R=34;
const THICK_MULT=1.25;
const RELAX=0.74;
const SMOOTH_ITERS=1;

function lerp(a,b,t){return a+(b-a)*t;}
function hypot(x,y){return Math.hypot(x,y)||1;}

function mountCanvas(){
  let c=document.getElementById("hel_entity_canvas");
  if(c) return c;
  c=document.createElement("canvas");
  c.id="hel_entity_canvas";
  c.style.position="fixed";
  c.style.inset="0";
  c.style.width="100%";
  c.style.height="100%";
  c.style.pointerEvents="none";
  c.style.zIndex="6";
  (document.getElementById("gd-dragon")||document.body).appendChild(c);
  return c;
}

let cv=null, ctx=null, W=0, H=0, DPR=1;

function resize(){
  let dpr=1; try{dpr=window.devicePixelRatio||1;}catch(e){}
  DPR=Math.min(DPR_CAP,Math.max(1,dpr));
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  if(cv){ cv.width=W; cv.height=H; }
}

function stage(){
  const vw=window.innerWidth||1, vh=window.innerHeight||1;
  return {vw,vh, baseY:vh*0.55};
}
function laneY(vh,lane){
  const base=vh*0.55;
  const sep=Math.min(vh*0.18,180);
  return lane===0 ? (base-sep) : (base+sep);
}

/* thick near head */
function massProfile(u){
  if(u<0.20) return 1.45;
  if(u<0.42){ const t=(u-0.20)/0.22; return 1.35 + 0.30*Math.sin(Math.PI*t); }
  if(u<0.75) return 1.20;
  const t=(u-0.75)/0.25;
  return Math.max(0.20, 1.20*Math.pow(1-t,0.72));
}
function radiusAt(u){
  const rr=BASE_R*THICK_MULT*massProfile(u);
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
  for(let it=0;it<SMOOTH_ITERS;it++){
    for(let i=2;i<sp.length-2;i++){
      const p0=sp[i-1], p1=sp[i], p2=sp[i+1];
      p1.x=lerp(p1.x,(p0.x+p2.x)*0.5,0.24);
      p1.y=lerp(p1.y,(p0.y+p2.y)*0.5,0.24);
    }
  }
}

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

    const px=p.x*DPR, py=p.y*DPR;
    spinePx.push({x:px,y:py});
    tArr.push(t);
    nArr.push(n);
    rArr.push(rr*DPR);
  }

  for(let i=0;i<spinePx.length;i++){
    const p=spinePx[i], n=nArr[i], rr=rArr[i];
    L.push({x:p.x+n.x*rr,y:p.y+n.y*rr});
    R.push({x:p.x-n.x*rr,y:p.y-n.y*rr});
  }

  const idx=(u)=>Math.max(0,Math.min(sp.length-1, Math.round(u*(sp.length-1))));
  const anchors={
    head:0,
    neck:idx(0.12),
    shoulder:idx(0.26),
    ridge0:idx(0.12),
    ridge1:idx(0.84),
    leg1:idx(0.30),
    leg2:idx(0.44),
    leg3:idx(0.60),
    leg4:idx(0.74),
    tail:idx(0.98)
  };

  return {L,R,spine:spinePx,t:tArr,n:nArr,rad:rArr,anchors,meta:{DPR,W,H}};
}

class DragonSim{
  constructor(dir,lane){
    this.dir=dir;
    this.lane=lane;
    this.seed=Math.random()*10;
    this.t=0;
    const st=stage();
    this.x=(dir>0)?(-OFFSCREEN_PAD):(st.vw+OFFSCREEN_PAD);
    this.y=laneY(st.vh,lane);
    this.spine=new Array(SEG);
    for(let i=0;i<SEG;i++){
      this.spine[i]={x:this.x - i*GAP*dir, y:this.y};
    }
  }
  update(dt){
    const st=stage();
    this.t += dt;
    this.x += this.dir*SPEED_PX_PER_S*dt;

    const bob = Math.sin(this.t*Y_BOB_FREQ + this.seed) * Y_BOB_AMP;
    this.y = laneY(st.vh,this.lane) + bob;

    this.spine[0].x=this.x;
    this.spine[0].y=this.y;

    for(let i=SEG-1;i>=1;i--){
      this.spine[i].x=this.spine[i-1].x;
      this.spine[i].y=this.spine[i-1].y;
    }

    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);

    if(this.dir>0 && this.x > st.vw + OFFSCREEN_PAD) this.x = -OFFSCREEN_PAD;
    if(this.dir<0 && this.x < -OFFSCREEN_PAD) this.x = st.vw + OFFSCREEN_PAD;
  }
}

function BOOT(){
  cv=mountCanvas();
  ctx=cv.getContext("2d",{alpha:true,desynchronized:true});
  resize();
  addEventListener("resize",resize,{passive:true});

  const A=new DragonSim(+1,0);
  const B=new DragonSim(-1,1);

  let last=0;
  function loop(ts){
    if(!last) last=ts;
    const dt=(ts-last)/1000;
    last=ts;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,W,H);

    A.update(dt);
    B.update(dt);

    const fA=buildFrame(A.spine);
    const fB=buildFrame(B.spine);

    if(window.HEL_RENDER && window.HEL_RENDER.drawDragon){
      window.HEL_RENDER.drawDragon(ctx,fA,{lane:0});
      window.HEL_RENDER.drawDragon(ctx,fB,{lane:1});
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if(document.readyState==="complete"||document.readyState==="interactive") setTimeout(BOOT,0);
else document.addEventListener("DOMContentLoaded",BOOT,{once:true});

})();
