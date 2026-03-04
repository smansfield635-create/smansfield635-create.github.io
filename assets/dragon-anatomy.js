/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — LOOK DELIVERY (CELESTIAL · ALWAYS VISIBLE)
   VERSION: DRAGON_v6_0_LOOK
   LOCKS:
   - Two dragons always visible (no spawn/off cycling)
   - Option A only (celestial serpentine; NO bulky Option B tactics)
   - No legs
   - Jade/green top, crimson bottom, both with black outline + gold accents
   - Visible diamond scales + gold ridge + horns/whiskers/mane
   - Body width fixed: 81px
   - Single canvas, single RAF loop, dt-based
   - Mounts into #gd-dragon if present
*/

(function(){
"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = {
  version:"DRAGON_v6_0_LOOK",
  mount:function(){}
};

const DPR_CAP = 1.6;

/* LOOK SCALE */
const BODY_WIDTH = 81;
const BODY_R = BODY_WIDTH * 0.5;

/* MOTION (minimal; NOT tuning lanes/paths beyond always-visible) */
const SEG = 150;
const GAP = 16;                 // px
const SPEED = 82;               // px/sec
const AMP = 16;                 // px
const SWIVEL = 10;              // px

/* CANVAS */
let canvas = document.getElementById("gd_dragon_canvas");
if(!canvas){
  canvas = document.createElement("canvas");
  canvas.id = "gd_dragon_canvas";
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  (document.getElementById("gd-dragon") || document.body).appendChild(canvas);
}
const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1, dpr));
  W = Math.floor((window.innerWidth||1) * DPR);
  H = Math.floor((window.innerHeight||1) * DPR);
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* UTIL */
function lerp(a,b,t){ return a+(b-a)*t; }
function hypot(x,y){ return Math.hypot(x,y) || 1; }

/* DRAGON PRESETS (Option A only) */
function makeDragon(isTop){
  return {
    top: isTop,
    dir: isTop ? 1 : -1,
    baseY: isTop ? 0.32 : 0.68,
    x: isTop ? -W*0.15 : W*1.15,
    phase: Math.random()*10,
    spine: new Array(SEG),
    pal: isTop ? {
      a: "rgba(0,135,78,0.92)",
      b: "rgba(0,86,52,0.92)",
      outline: "rgba(0,0,0,0.56)",
      rim: "rgba(255,255,255,0.11)",
      gold: "rgba(212,175,55,0.90)",
      goldSoft: "rgba(212,175,55,0.20)"
    } : {
      a: "rgba(200,45,45,0.92)",
      b: "rgba(125,22,24,0.92)",
      outline: "rgba(0,0,0,0.56)",
      rim: "rgba(255,255,255,0.11)",
      gold: "rgba(212,175,55,0.92)",
      goldSoft: "rgba(212,175,55,0.20)"
    }
  };
}
const TOP = makeDragon(true);
const BOT = makeDragon(false);

/* SPINE BUILD (always visible) */
function build(dr, t, dt){
  const gap = GAP*DPR;
  const amp = AMP*DPR;
  const sw  = SWIVEL*DPR;

  dr.x += dr.dir * SPEED * DPR * dt;

  // wrap so always visible
  const margin = W*0.35;
  if(dr.dir>0 && dr.x > W + margin) dr.x = -margin;
  if(dr.dir<0 && dr.x < -margin) dr.x = W + margin;

  const baseY = H*dr.baseY;
  const sign = dr.top ? 1 : -1;

  const headX = dr.x + Math.sin(t*0.95 + dr.phase*1.1)*sw*sign;
  const headY = baseY
    + Math.sin(t*1.55 + dr.phase)*amp*sign
    + Math.sin(t*0.62 + dr.phase*0.7)*(amp*0.45)*sign;

  dr.spine[0] = {x: headX, y: headY};

  for(let i=1;i<SEG;i++){
    const prev = dr.spine[i-1];
    const candX = prev.x - dr.dir*gap;
    const candY = baseY + Math.sin(t*1.55 + dr.phase - i*0.09)*amp*sign;

    let dx = prev.x - candX;
    let dy = prev.y - candY;
    let d = hypot(dx,dy);

    dr.spine[i] = {
      x: prev.x - (dx/d)*gap,
      y: prev.y - (dy/d)*gap
    };
  }
}

function tangent(sp,i){
  const p0 = sp[Math.max(0,i-1)];
  const p1 = sp[Math.min(sp.length-1,i+1)];
  let dx=p1.x-p0.x, dy=p1.y-p0.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t = tangent(sp,i);
  return {x:-t.y,y:t.x};
}
function radiusAt(i){
  // slender celestial taper
  const u = i/(SEG-1);
  const r = (u<0.72) ? 1.00 : lerp(1.00, 0.18, (u-0.72)/0.28);
  // head slightly fuller
  const headBoost = (u<0.10) ? lerp(1.10, 1.00, u/0.10) : 1.00;
  return BODY_R * r * headBoost * DPR;
}

/* PATH HELPERS */
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

/* DRAW */
function drawBody(dr){
  const sp = dr.spine;
  const left = new Array(sp.length);
  const right= new Array(sp.length);

  for(let i=0;i<sp.length;i++){
    const n = normal(sp,i);
    const r = radiusAt(i);
    left[i]  = {x: sp[i].x + n.x*r, y: sp[i].y + n.y*r};
    right[i] = {x: sp[i].x - n.x*r, y: sp[i].y - n.y*r};
  }

  // gradient fill (gives volume)
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.a);
  g.addColorStop(0.60, dr.pal.b);
  g.addColorStop(1.00, dr.pal.b);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for(let i=1;i<left.length-1;i++){
    const mx=(left[i].x+left[i+1].x)*0.5;
    const my=(left[i].y+left[i+1].y)*0.5;
    ctx.quadraticCurveTo(left[i].x,left[i].y,mx,my);
  }
  ctx.lineTo(left[left.length-1].x, left[left.length-1].y);

  for(let i=right.length-1;i>0;i--){
    const p=right[i], prev=right[i-1];
    const mx=(p.x+prev.x)*0.5;
    const my=(p.y+prev.y)*0.5;
    ctx.quadraticCurveTo(p.x,p.y,mx,my);
  }
  ctx.closePath();

  ctx.fillStyle = g;
  ctx.fill();

  // strong silhouette
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.strokeStyle = dr.pal.outline;
  ctx.lineWidth = 3.6*DPR;
  ctx.stroke();

  // rim highlight (thin)
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle = dr.pal.rim;
  ctx.lineWidth = 1.5*DPR;
  smoothStroke(left);
  ctx.stroke();

  ctx.restore();

  return {left,right};
}

function drawRidge(dr){
  const sp = dr.spine;

  // gold ridge following surface normal (not a vertical offset)
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle = dr.pal.goldSoft;
  ctx.lineWidth = 2.2*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i++){
    const n = normal(sp,i);
    const r = radiusAt(i);
    ctx.lineTo(sp[i].x + n.x*(r*0.78), sp[i].y + n.y*(r*0.78));
  }
  ctx.stroke();
  ctx.restore();

  // very subtle fins (small, frequent; no triangles)
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(0,0,0,0.22)";
  for(let i=18;i<sp.length-30;i+=7){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const h=(7.5 + (i%9)*0.25)*DPR;
    const w=5.0*DPR;
    const bx=p.x + n.x*(r*0.88);
    const by=p.y + n.y*(r*0.88);
    ctx.beginPath();
    ctx.moveTo(bx,by);
    ctx.lineTo(bx + n.x*h, by + n.y*h);
    ctx.lineTo(bx + (-n.y)*w, by + (n.x)*w);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawScales(dr){
  const sp = dr.spine;

  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.22)";
  ctx.lineWidth=1.0*DPR;

  // bigger diamonds so they read on mobile
  for(let i=22;i<sp.length-34;i+=4){
    const p=sp[i];
    const t=tangent(sp,i);
    const n=normal(sp,i);
    const r=radiusAt(i);

    // 2 rows
    for(let row=0; row<2; row++){
      const off = (row===0) ? 0.16 : -0.02;
      const cx = p.x + n.x*(r*off);
      const cy = p.y + n.y*(r*off);

      const s = Math.max(5.5*DPR, r*0.14);
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

  // gold micro-glints near ridge
  ctx.strokeStyle="rgba(212,175,55,0.18)";
  for(let i=28;i<sp.length-42;i+=9){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const x=p.x + n.x*(r*0.58);
    const y=p.y + n.y*(r*0.58);
    ctx.beginPath();
    ctx.arc(x,y,Math.max(1.5*DPR,r*0.06),0.1,2.1);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHead(dr){
  const sp = dr.spine;
  const p = sp[0];
  const t = tangent(sp,0);
  const ang = Math.atan2(t.y,t.x);
  const s = radiusAt(0) * 1.12;

  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(ang);

  // skull
  ctx.fillStyle="rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.08,s*0.70,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle=dr.pal.a;
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.00,s*0.66,0,0,Math.PI*2);
  ctx.fill();

  // snout (long)
  ctx.beginPath();
  ctx.ellipse(s*0.98, s*0.05, s*1.08, s*0.40, 0, 0, Math.PI*2);
  ctx.fill();

  // outline
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=2.8*DPR;
  ctx.stroke();

  // eye
  ctx.fillStyle=dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.26, -s*0.10, s*0.15, s*0.10, 0.25, 0, Math.PI*2);
  ctx.fill();

  // horns (curved)
  ctx.strokeStyle="rgba(212,175,55,0.72)";
  ctx.lineWidth=2.9*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(-s*0.10, -s*0.34);
  ctx.quadraticCurveTo(s*0.10, -s*0.95, s*0.62, -s*1.08);
  ctx.moveTo(-s*0.18, -s*0.28);
  ctx.quadraticCurveTo(s*0.00, -s*0.86, s*0.44, -s*0.98);
  ctx.stroke();

  // whiskers
  ctx.strokeStyle="rgba(212,175,55,0.60)";
  ctx.lineWidth=2.2*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.22, 0);
  ctx.quadraticCurveTo(s*2.05, -s*0.52, s*3.00, -s*0.70);
  ctx.moveTo(s*1.22, 0);
  ctx.quadraticCurveTo(s*1.95,  s*0.48, s*2.90,  s*0.64);
  ctx.stroke();

  // mane strands
  ctx.strokeStyle="rgba(255,255,255,0.14)";
  ctx.lineWidth=1.8*DPR;
  for(let i=0;i<8;i++){
    const yy = -s*0.42 + i*(s*0.10);
    ctx.beginPath();
    ctx.moveTo(-s*0.30, yy);
    ctx.quadraticCurveTo(-s*1.05, yy + s*0.12, -s*1.60, yy + s*0.44);
    ctx.stroke();
  }

  ctx.restore();
}

/* VERSION WATERMARK (so you never get fooled again) */
function watermark(){
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(18*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_v6_0_LOOK", 12*DPR, (H-16*DPR));
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
  drawBody(TOP);
  drawRidge(TOP);
  drawScales(TOP);
  drawHead(TOP);

  build(BOT,t,dt);
  drawBody(BOT);
  drawRidge(BOT);
  drawScales(BOT);
  drawHead(BOT);

  watermark();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
