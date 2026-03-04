/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — SILHOUETTE FIRST (YOU WILL SEE A DRAGON)
   VERSION: DRAGON_v8_SILHOUETTE

   DELIVERS (RIGHT NOW):
   - CLEAR DRAGON SILHOUETTE (BODY + HEAD PROFILE) — NOT A TUBE, NOT A RIG
   - REAL FACE: snout + jaw + nostril + eye + horns + whiskers + beard + mane
   - SCALES: large diamond tiles that are visible at BODY_WIDTH=81
   - COLOR DEPTH: body gradient + belly shadow band
   - TWO DRAGONS: TOP jade L→R, BOTTOM crimson R→L
   - HEAD ON SWIVEL (bounded), FACE ALWAYS POINTS INTO TRAVEL DIRECTION
   - SINGLE CANVAS, SINGLE RAF, DT-BASED, MOUNTS INTO #gd-dragon
   - WATERMARK PROOF ON CANVAS

   NOTE:
   - Layout/lane tuning comes AFTER you can see the dragon. This is the dragon.
*/
(function(){
"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = { version:"DRAGON_v8_SILHOUETTE", mount:function(){} };

const DPR_CAP = 1.6;
const BODY_W  = 81;
const BODY_R  = BODY_W * 0.5;

const SEG   = 160;
const GAP   = 16;
const SPEED = 92;     // px/sec
const AMP   = 14;     // px
const SWIV  = 10;     // px (gentle depth swivel)

const YAW_MAX = 0.33; // radians (head swivel)
const YAW_RATE= 4.0;  // follow rate

let canvas = document.getElementById("gd_dragon_canvas");
if(!canvas){
  canvas = document.createElement("canvas");
  canvas.id = "gd_dragon_canvas";
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.style.pointerEvents="none";
  (document.getElementById("gd-dragon") || document.body).appendChild(canvas);
}
const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  let dpr=1; try{ dpr = window.devicePixelRatio || 1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1, dpr));
  W = Math.floor((window.innerWidth||1) * DPR);
  H = Math.floor((window.innerHeight||1) * DPR);
  canvas.width=W; canvas.height=H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function hypot(x,y){ return Math.hypot(x,y) || 1; }

function palJade(){
  return {
    a:"rgba(0,165,92,0.95)",
    b:"rgba(0,88,54,0.95)",
    outline:"rgba(0,0,0,0.68)",
    rim:"rgba(255,255,255,0.14)",
    gold:"rgba(212,175,55,0.96)",
    goldSoft:"rgba(212,175,55,0.24)",
    belly:"rgba(0,0,0,0.22)"
  };
}
function palCrimson(){
  return {
    a:"rgba(235,70,70,0.95)",
    b:"rgba(125,22,24,0.95)",
    outline:"rgba(0,0,0,0.68)",
    rim:"rgba(255,255,255,0.14)",
    gold:"rgba(212,175,55,0.98)",
    goldSoft:"rgba(212,175,55,0.24)",
    belly:"rgba(0,0,0,0.22)"
  };
}

function makeDragon(isTop){
  return {
    top:isTop,
    dir:isTop? 1 : -1,
    baseY:isTop? 0.33 : 0.67,
    x:isTop? -W*0.20 : W*1.20,
    phase:Math.random()*10,
    spine:new Array(SEG),
    pal:isTop?palJade():palCrimson(),
    yaw:0,
    yawT:0
  };
}

const TOP = makeDragon(true);
const BOT = makeDragon(false);

function tangent(sp,i){
  const p0=sp[Math.max(0,i-1)];
  const p1=sp[Math.min(sp.length-1,i+1)];
  let dx=p1.x-p0.x, dy=p1.y-p0.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t=tangent(sp,i);
  return {x:-t.y,y:t.x};
}
function radiusAt(i){
  const u = i/(SEG-1);
  // slender celestial: strong head/neck then taper
  const body = (u<0.74)?1.00:lerp(1.00,0.14,(u-0.74)/0.26);
  const headBoost = (u<0.10)?lerp(1.16,1.00,u/0.10):1.00;
  return BODY_R * body * headBoost * DPR;
}

function build(dr, t, dt){
  const gap=GAP*DPR, amp=AMP*DPR, sw=SWIV*DPR;
  dr.x += dr.dir*SPEED*DPR*dt;

  const margin=W*0.45;
  if(dr.dir>0 && dr.x>W+margin) dr.x=-margin;
  if(dr.dir<0 && dr.x<-margin) dr.x=W+margin;

  const baseY = H*dr.baseY;
  const sign = dr.top ? 1 : -1;

  const headX = dr.x + Math.sin(t*0.92 + dr.phase*1.1)*sw*sign;
  const headY = baseY
    + Math.sin(t*1.45 + dr.phase)*amp*sign
    + Math.sin(t*0.62 + dr.phase*0.7)*(amp*0.45)*sign;

  dr.spine[0] = {x:headX,y:headY};

  for(let i=1;i<SEG;i++){
    const prev=dr.spine[i-1];
    const candX=prev.x - dr.dir*gap;
    const candY=baseY + Math.sin(t*1.45 + dr.phase - i*0.09)*amp*sign;

    let dx=prev.x-candX, dy=prev.y-candY, d=hypot(dx,dy);
    dr.spine[i]={x:prev.x-(dx/d)*gap, y:prev.y-(dy/d)*gap};
  }

  // head swivel target: curvature proxy + micro wander
  const t0=tangent(dr.spine,0);
  const t6=tangent(dr.spine,6);
  const curv=(t6.y*t0.x - t6.x*t0.y); // signed
  dr.yawT = clamp(curv*0.9 + Math.sin(t*0.85 + dr.phase)*0.12, -YAW_MAX, YAW_MAX);
  dr.yaw += (dr.yawT - dr.yaw) * clamp(YAW_RATE*dt, 0, 1);
}

/* Smooth stroke helper */
function smoothStroke(points){
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i=1;i<points.length-1;i++){
    const mx=(points[i].x+points[i+1].x)*0.5;
    const my=(points[i].y+points[i+1].y)*0.5;
    ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
  }
  ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
}

/* SILHOUETTE BODY */
function drawSilhouetteBody(dr){
  const sp=dr.spine;
  const left=new Array(sp.length);
  const right=new Array(sp.length);

  for(let i=0;i<sp.length;i++){
    const n=normal(sp,i);
    const r=radiusAt(i);
    left[i]={x:sp[i].x+n.x*r, y:sp[i].y+n.y*r};
    right[i]={x:sp[i].x-n.x*r, y:sp[i].y-n.y*r};
  }

  // fill gradient for volume
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.a);
  g.addColorStop(0.55, dr.pal.b);
  g.addColorStop(1.00, dr.pal.b);

  ctx.save();

  // silhouette path
  ctx.beginPath();
  ctx.moveTo(left[0].x,left[0].y);
  for(let i=1;i<left.length-1;i++){
    const mx=(left[i].x+left[i+1].x)*0.5;
    const my=(left[i].y+left[i+1].y)*0.5;
    ctx.quadraticCurveTo(left[i].x,left[i].y,mx,my);
  }
  ctx.lineTo(left[left.length-1].x,left[left.length-1].y);
  for(let i=right.length-1;i>0;i--){
    const p=right[i], prev=right[i-1];
    const mx=(p.x+prev.x)*0.5;
    const my=(p.y+prev.y)*0.5;
    ctx.quadraticCurveTo(p.x,p.y,mx,my);
  }
  ctx.closePath();

  ctx.fillStyle=g;
  ctx.fill();

  // hard black silhouette outline (this is what makes it read)
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=4.2*DPR;
  ctx.stroke();

  // rim highlight
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle=dr.pal.rim;
  ctx.lineWidth=1.6*DPR;
  smoothStroke(left);
  ctx.stroke();

  // belly shadow band to kill “tube”
  ctx.globalCompositeOperation="multiply";
  ctx.strokeStyle=dr.pal.belly;
  ctx.lineWidth=12*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i++){
    const n=normal(sp,i);
    const r=radiusAt(i);
    ctx.lineTo(sp[i].x - n.x*(r*0.34), sp[i].y - n.y*(r*0.34));
  }
  ctx.stroke();

  ctx.restore();

  return {left,right};
}

/* SCALES (large, visible) */
function drawScales(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.24)";
  ctx.lineWidth=1.2*DPR;

  for(let i=20;i<sp.length-58;i+=4){
    const p=sp[i];
    const t=tangent(sp,i);
    const n=normal(sp,i);
    const r=radiusAt(i);

    // 2 rows of diamond tiles
    for(let row=0; row<2; row++){
      const off = (row===0) ? 0.18 : -0.02;
      const cx = p.x + n.x*(r*off);
      const cy = p.y + n.y*(r*off);

      const s = Math.max(7.2*DPR, r*0.14);
      const ax=t.x*s, ay=t.y*s;
      const bx=n.x*s, by=n.y*s;

      ctx.beginPath();
      ctx.moveTo(cx + ax, cy + ay);
      ctx.lineTo(cx + bx, cy + by);
      ctx.lineTo(cx - ax, cy - ay);
      ctx.lineTo(cx - bx, cy - by);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // gold glints
  ctx.strokeStyle="rgba(212,175,55,0.18)";
  for(let i=26;i<sp.length-70;i+=10){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const x=p.x + n.x*(r*0.60);
    const y=p.y + n.y*(r*0.60);
    ctx.beginPath();
    ctx.arc(x,y,Math.max(1.5*DPR,r*0.06),0.1,2.1);
    ctx.stroke();
  }

  ctx.restore();
}

/* RIDGE + FIN (subtle, no spikes) */
function drawRidge(dr){
  const sp=dr.spine;

  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle=dr.pal.goldSoft;
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i++){
    const n=normal(sp,i);
    const r=radiusAt(i);
    ctx.lineTo(sp[i].x + n.x*(r*0.82), sp[i].y + n.y*(r*0.82));
  }
  ctx.stroke();
  ctx.restore();

  // mane along first third
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.13)";
  ctx.lineWidth=1.8*DPR;
  const end=Math.floor(sp.length*0.30);
  for(let i=8;i<end;i+=4){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const h=r*(0.55 + (i%6)*0.03);
    const sx=p.x + n.x*(r*0.94);
    const sy=p.y + n.y*(r*0.94);
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.quadraticCurveTo(sx - n.y*h*0.40, sy + n.x*h*0.40, sx - n.y*h, sy + n.x*h);
    ctx.stroke();
  }
  ctx.restore();
}

/* BELLY PLATES */
function drawBellyPlates(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.10)";
  ctx.lineWidth=1.3*DPR;
  for(let i=20;i<sp.length-64;i+=7){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const bx=p.x - n.x*(r*0.60);
    const by=p.y - n.y*(r*0.60);
    const w=Math.max(7*DPR,r*0.24);
    const h=Math.max(3*DPR,r*0.12);
    ctx.beginPath();
    ctx.ellipse(bx,by,w,h,0,0.15,Math.PI-0.15);
    ctx.stroke();
  }
  ctx.restore();
}

/* HEAD (REAL FACE + SWIVEL + CORRECT FACING) */
function drawHead(dr, t){
  const sp=dr.spine;
  const p=sp[0];
  const tv=tangent(sp,0);
  const baseAng=Math.atan2(tv.y,tv.x);
  const headAng=baseAng + dr.yaw;

  const s=radiusAt(0) * 1.10;

  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(headAng);

  // face direction: features always point into travel
  if(dr.dir < 0) ctx.scale(-1, 1);

  // skull (silhouette first)
  ctx.fillStyle="rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.18,s*0.78,0,0,Math.PI*2);
  ctx.fill();

  // skull color
  const hg=ctx.createLinearGradient(-s,0,s*2.2,0);
  hg.addColorStop(0.0, dr.pal.b);
  hg.addColorStop(0.6, dr.pal.a);
  hg.addColorStop(1.0, dr.pal.b);
  ctx.fillStyle=hg;
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.08,s*0.72,0,0,Math.PI*2);
  ctx.fill();

  // snout (tapered, jaw defined)
  ctx.beginPath();
  ctx.ellipse(s*1.05, s*0.04, s*1.30, s*0.38, 0.05, 0, Math.PI*2);
  ctx.fill();

  // jaw shadow
  ctx.fillStyle="rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(s*0.75, s*0.34, s*1.05, s*0.30, 0.10, 0, Math.PI*2);
  ctx.fill();

  // mouth line
  ctx.strokeStyle="rgba(0,0,0,0.35)";
  ctx.lineWidth=2.0*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.50, s*0.22);
  ctx.quadraticCurveTo(s*1.05, s*0.42, s*1.85, s*0.16);
  ctx.stroke();

  // outline hard (face reads)
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=3.0*DPR;
  ctx.stroke();

  // nostril
  ctx.fillStyle="rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.arc(s*1.70, s*0.06, s*0.10, 0, Math.PI*2);
  ctx.fill();

  // eye (traditional slit-ish)
  ctx.fillStyle=dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.26, -s*0.10, s*0.18, s*0.10, 0.15, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.60)";
  ctx.beginPath();
  ctx.ellipse(s*0.30, -s*0.10, s*0.06, s*0.12, 0.05, 0, Math.PI*2);
  ctx.fill();

  // horns (swept back)
  ctx.strokeStyle="rgba(212,175,55,0.76)";
  ctx.lineWidth=3.2*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(-s*0.12,-s*0.40);
  ctx.quadraticCurveTo(s*0.10,-s*1.10,s*0.72,-s*1.22);
  ctx.moveTo(-s*0.20,-s*0.32);
  ctx.quadraticCurveTo(s*0.00,-s*0.98,s*0.48,-s*1.10);
  ctx.stroke();

  // whiskers (anchored, long, trailing)
  // trailing in local -X direction, so curve backward
  ctx.strokeStyle="rgba(212,175,55,0.62)";
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.25, 0);
  ctx.quadraticCurveTo(s*2.10, -s*0.48, s*3.05, -s*0.70);
  ctx.moveTo(s*1.25, 0);
  ctx.quadraticCurveTo(s*2.00,  s*0.46, s*2.95,  s*0.66);
  ctx.stroke();

  // beard
  ctx.strokeStyle="rgba(255,255,255,0.16)";
  ctx.lineWidth=2.0*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.92, s*0.28);
  ctx.quadraticCurveTo(s*0.72, s*1.05, s*0.20, s*1.26);
  ctx.stroke();

  // mane at head
  ctx.strokeStyle="rgba(255,255,255,0.12)";
  ctx.lineWidth=1.9*DPR;
  for(let i=0;i<8;i++){
    const yy=-s*0.48 + i*(s*0.11);
    ctx.beginPath();
    ctx.moveTo(-s*0.32, yy);
    ctx.quadraticCurveTo(-s*1.10, yy + s*0.14, -s*1.72, yy + s*0.46);
    ctx.stroke();
  }

  ctx.restore();
}

function watermark(){
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(16*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_v8_SILHOUETTE", 12*DPR, (H-14*DPR));
  ctx.restore();
}

/* LOOP */
let last=0;
function frame(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;
  const t=ts/1000;

  ctx.clearRect(0,0,W,H);

  build(TOP,t,dt);
  drawSilhouetteBody(TOP);
  drawRidge(TOP);
  drawScales(TOP);
  drawBellyPlates(TOP);
  drawHead(TOP,t);

  build(BOT,t,dt);
  drawSilhouetteBody(BOT);
  drawRidge(BOT);
  drawScales(BOT);
  drawBellyPlates(BOT);
  drawHead(BOT,t);

  watermark();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
