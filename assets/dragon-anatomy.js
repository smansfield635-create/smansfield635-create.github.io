/* TNT — /assets/dragon-anatomy.js
   DRAGON SILHOUETTE — STABLE ARC (NO KNOT) v1
   VERSION: DRAGON_SILHOUETTE_ARC_STABLE_V1
   FIXES:
   - removes clamp convergence (no more CORE knot)
   - distinct arc centers: top uses upper arc, bottom uses lower arc
   - initializes spine along arc tangent (prevents pile-up)
   - keeps wedge head + hull + tail fin
*/
(function(){
"use strict";
if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__=true;

window.GD_DRAGON={version:"DRAGON_SILHOUETTE_ARC_STABLE_V1",mount:function(){}};

const DPR_CAP=1.6;
function lerp(a,b,t){return a+(b-a)*t;}
function hypot(x,y){return Math.hypot(x,y)||1;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function cssNum(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){return NaN;}
}

/* canvas */
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
  let dpr=1; try{dpr=window.devicePixelRatio||1;}catch(e){}
  DPR=Math.min(DPR_CAP,Math.max(1,dpr));
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  canvas.width=W; canvas.height=H;
}
resize();
window.addEventListener("resize",resize,{passive:true});

function stage(){
  const vw=(window.innerWidth||1), vh=(window.innerHeight||1);
  const cx=cssNum("--gd_centerX"), cy=cssNum("--gd_centerY"), r1=cssNum("--gd_r1");
  const Cx=Number.isFinite(cx)?cx:vw*0.5;
  const Cy=Number.isFinite(cy)?cy:vh*0.52;
  const baseR=Number.isFinite(r1)?r1:180;
  const R=clamp(baseR*1.10, 150, Math.min(vw,vh)*0.42);
  return {Cx,Cy,R};
}

/* creature params */
const SEG=96;
const GAP=18;
const SPEED=0.45;   // slower
const WOB=0.06;     // calmer wobble
const R0=26;

function radiusProfile(i){
  const u=i/(SEG-1);
  let m=1.0;
  if(u<0.06) m*=lerp(1.45,1.10,u/0.06);                    // head
  if(u>=0.06&&u<0.18){ const t=(u-0.06)/0.12; m*=lerp(0.84,0.56,Math.sin(Math.PI*t)); } // neck
  if(u>=0.18&&u<0.34){ const t=(u-0.18)/0.16; m*=(1.05+0.58*Math.sin(Math.PI*t)); }    // shoulder
  if(u>=0.34&&u<0.78) m*=1.06;
  if(u>=0.78){ const t=(u-0.78)/0.22; m*=lerp(1.0,0.20,t); }
  return Math.max(6,R0*m);
}

function tangent(sp,i){
  const a=sp[Math.max(0,i-1)];
  const b=sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t=tangent(sp,i);
  return {x:-t.y,y:t.x};
}
function enforce(sp){
  for(let i=1;i<sp.length;i++){
    const p=sp[i-1], c=sp[i];
    const dx=p.x-c.x, dy=p.y-c.y, d=hypot(dx,dy);
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

/* stable arc windows (no clamp convergence) */
const TOP_ARC_MIN = Math.PI*1.10; // ~198°
const TOP_ARC_MAX = Math.PI*1.88; // ~339°
const BOT_ARC_MIN = Math.PI*0.12; // ~22°
const BOT_ARC_MAX = Math.PI*0.92; // ~166°

function wrap(a){
  const two=Math.PI*2;
  while(a<0) a+=two;
  while(a>=two) a-=two;
  return a;
}
function reflectInRange(a, lo, hi){
  // bounce within [lo,hi] without clamping to endpoints
  if(a<lo) return lo + (lo-a);
  if(a>hi) return hi - (a-hi);
  return a;
}

class Dragon{
  constructor(top){
    this.top=top;
    this.dir = top ? -1 : 1;
    this.phase=Math.random()*10;
    this.theta = top ? Math.PI*1.60 : Math.PI*0.40;
    this.spine=new Array(SEG);
    this.init();
  }
  init(){
    const st=stage();
    const a=this.theta;
    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    // tangent of circle at angle a: (-sin, cos)
    const tx=-Math.sin(a);
    const ty= Math.cos(a)*0.55;

    for(let i=0;i<SEG;i++){
      this.spine[i]={ x: hx - tx*i*GAP, y: hy - ty*i*GAP };
    }
  }
  update(dt){
    const st=stage();
    this.theta = wrap(this.theta + this.dir*SPEED*dt);

    // keep in separate bands by reflection (no endpoint pile-up)
    let a = this.theta + Math.sin((performance.now()/1000)*1.1 + this.phase)*WOB;
    if(this.top) a = reflectInRange(a, TOP_ARC_MIN, TOP_ARC_MAX);
    else         a = reflectInRange(a, BOT_ARC_MIN, BOT_ARC_MAX);

    const hx=st.Cx + Math.cos(a)*st.R;
    const hy=st.Cy + Math.sin(a)*st.R*0.55;

    this.spine[0].x=hx;
    this.spine[0].y=hy;

    enforce(this.spine);
    smooth(this.spine);
    enforce(this.spine);
  }
  draw(fill){
    const L=[], Rr=[];
    for(let i=0;i<SEG;i++){
      const p=this.spine[i];
      const n=normal(this.spine,i);
      const rr=radiusProfile(i)*DPR;
      L.push({x:p.x*DPR + n.x*rr, y:p.y*DPR + n.y*rr});
      Rr.push({x:p.x*DPR - n.x*rr, y:p.y*DPR - n.y*rr});
    }

    // body hull
    ctx.beginPath();
    ctx.moveTo(L[0].x,L[0].y);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
    for(let i=Rr.length-1;i>=0;i--) ctx.lineTo(Rr[i].x,Rr[i].y);
    ctx.closePath();

    ctx.fillStyle="rgba(0,0,0,0.35)";
    ctx.fill();
    ctx.fillStyle=fill;
    ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.70)";
    ctx.lineWidth=2.6*DPR;
    ctx.lineJoin="round";
    ctx.stroke();

    // wedge head
    const head=this.spine[0];
    const t=tangent(this.spine,0);
    const nx=-t.y, ny=t.x;
    const hx=head.x*DPR, hy=head.y*DPR;
    const forward=34*DPR, back=22*DPR, jaw=18*DPR;

    ctx.fillStyle="rgba(0,0,0,0.62)";
    ctx.beginPath();
    ctx.moveTo(hx + t.x*forward, hy + t.y*forward);
    ctx.lineTo(hx - t.x*back + nx*jaw, hy - t.y*back + ny*jaw);
    ctx.lineTo(hx - t.x*back - nx*jaw, hy - t.y*back - ny*jaw);
    ctx.closePath();
    ctx.fill();

    // tail fin
    const tail=this.spine[SEG-1];
    const tt=tangent(this.spine,SEG-1);
    const fnx=-tt.y, fny=tt.x;
    const tx=tail.x*DPR, ty=tail.y*DPR;
    ctx.fillStyle="rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.moveTo(tx,ty);
    ctx.lineTo(tx - tt.x*28*DPR + fnx*16*DPR, ty - tt.y*28*DPR + fny*16*DPR);
    ctx.lineTo(tx - tt.x*28*DPR - fnx*16*DPR, ty - tt.y*28*DPR - fny*16*DPR);
    ctx.closePath();
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
  ctx.font=(14*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_SILHOUETTE_ARC_STABLE_V1", 12*DPR, H-14*DPR);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
