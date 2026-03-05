/* TNT — /assets/dragon-anatomy.js
   CORE L1 — ENGINE (CATEGORY 4/4)
   PURPOSE: minimum two-dragon silhouette (top/bottom lanes), visible body (no banner)
   BUILD: CORE_DRAGON_SILHOUETTE_L1
*/
(function(){
"use strict";
if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON={version:"CORE_DRAGON_SILHOUETTE_L1",mount:function(){}};

const DPR_CAP=1.6;

function lerp(a,b,t){return a+(b-a)*t;}
function hypot(x,y){return Math.hypot(x,y)||1;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function cssPx(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    if(!v) return NaN;
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){return NaN;}
}
function laneFrac(top){
  const vh=(window.innerHeight||1);
  const lt=cssPx("--gd_laneTop");
  const lb=cssPx("--gd_laneBot");
  if(top && Number.isFinite(lt)) return clamp(lt/vh,0.18,0.48);
  if(!top && Number.isFinite(lb)) return clamp(lb/vh,0.52,0.88);
  return top?0.33:0.67;
}

let canvas=document.getElementById("gd_dragon_canvas");
if(!canvas){
  canvas=document.createElement("canvas");
  canvas.id="gd_dragon_canvas";
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.style.pointerEvents="none";
  (document.getElementById("gd-dragon")||document.body).appendChild(canvas);
}
const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  DPR=Math.min(DPR_CAP,window.devicePixelRatio||1);
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  canvas.width=W; canvas.height=H;
}
resize();
window.addEventListener("resize",resize,{passive:true});

const SEG=110;
const GAP=16;      // CSS px
const SPEED=54;    // CSS px/s
const AMP=9;       // CSS px
const BASE_R=34;   // CSS px radius baseline

function radius(i){
  const u=i/(SEG-1);
  let m=1.0;

  // head fullness
  if(u<0.06) m*=lerp(1.15,1.00,u/0.06);

  // neck dip
  if(u>=0.06 && u<0.18){
    const t=(u-0.06)/0.12;
    m*=lerp(0.82,0.62,Math.sin(Math.PI*t));
  }

  // shoulder bulge
  if(u>=0.18 && u<0.34){
    const t=(u-0.18)/0.16;
    m*=(1.05+0.42*Math.sin(Math.PI*t));
  }

  // main body
  if(u>=0.34 && u<0.78) m*=1.04;

  // tail taper (no needle)
  if(u>=0.78){
    const t=(u-0.78)/0.22;
    m*=lerp(1.0,0.22,t);
  }

  return Math.max(7, BASE_R*m);
}

class Dragon{
  constructor(top){
    this.top=top;
    this.dir=top?1:-1;
    this.phase=Math.random()*10;
    const vw=(window.innerWidth||1);
    this.x=top?-vw*0.25:vw*1.25; // CSS px
    this.spine=new Array(SEG);
    this.init();
  }
  init(){
    const baseY=(laneFrac(this.top))*(window.innerHeight||1);
    for(let i=0;i<SEG;i++){
      this.spine[i]={x:this.x - this.dir*i*GAP, y:baseY};
    }
  }
  update(dt){
    const vw=(window.innerWidth||1);
    const margin=vw*0.35;
    this.x += this.dir*SPEED*dt;
    if(this.dir>0 && this.x>vw+margin) this.x=-margin;
    if(this.dir<0 && this.x<-margin) this.x=vw+margin;

    const baseY=(laneFrac(this.top))*(window.innerHeight||1);
    const wave=Math.sin(performance.now()*0.0016 + this.phase)*AMP;

    this.spine[0].x=this.x;
    this.spine[0].y=baseY + wave;

    for(let i=1;i<SEG;i++){
      const p=this.spine[i-1];
      const c=this.spine[i];
      const dx=p.x-c.x, dy=p.y-c.y;
      const d=hypot(dx,dy);
      const tx=p.x-(dx/d)*GAP;
      const ty=p.y-(dy/d)*GAP;
      c.x=lerp(c.x,tx,0.58);
      c.y=lerp(c.y,ty,0.58);
    }
  }
  draw(fill){
    // outline underlay
    ctx.fillStyle="rgba(0,0,0,0.55)";
    for(let i=SEG-1;i>=0;i--){
      const p=this.spine[i];
      const rr=radius(i)*1.12;
      ctx.beginPath();
      ctx.ellipse(p.x*DPR,p.y*DPR,rr*DPR,rr*0.72*DPR,0,0,Math.PI*2);
      ctx.fill();
    }
    // fill volumes
    ctx.fillStyle=fill;
    for(let i=SEG-1;i>=0;i--){
      const p=this.spine[i];
      const rr=radius(i);
      ctx.beginPath();
      ctx.ellipse(p.x*DPR,p.y*DPR,rr*DPR,rr*0.72*DPR,0,0,Math.PI*2);
      ctx.fill();
    }
    // head cap
    const h=this.spine[0];
    ctx.fillStyle="rgba(0,0,0,0.70)";
    ctx.beginPath();
    ctx.ellipse(h.x*DPR,h.y*DPR,13*DPR,9*DPR,0,0,Math.PI*2);
    ctx.fill();
  }
}

const topD=new Dragon(true);
const botD=new Dragon(false);

let last=0;
function frame(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;

  ctx.clearRect(0,0,W,H);

  topD.update(dt);
  botD.update(dt);

  topD.draw("rgba(0,110,60,0.92)");
  botD.draw("rgba(170,20,20,0.90)");

  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(16*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("CORE_DRAGON_SILHOUETTE_L1", 12*DPR, H-14*DPR);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
