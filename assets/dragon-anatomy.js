/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — VISIBILITY LOCK (LOOK FIRST)
   MODE: ALWAYS VISIBLE · TWO DRAGONS · OPTION A (CELESTIAL) · NO LEGS
   GOAL (THIS STEP ONLY): YOU CAN ALWAYS SEE THE DRAGONS. IMPROVE LOOK NOW.
   LATER: we tune where they go + cadence.

   FEATURES (LOOK)
   - Smooth serpentine body (not blocks)
   - Black silhouette outline
   - Gold dorsal ridge line + subtle fins (NOT bulky spikes)
   - Diamond scale tiling (visible)
   - Chinese head silhouette: horns + whiskers + mane + beard
   - Two dragons: TOP jade, BOTTOM crimson (both with black + gold accents)

   LOCKS (ENGINE)
   - Single canvas, single RAF loop, dt-based
   - Mounts into #gd-dragon if present
   - No gd_* keys, no background logic

   NOTE
   - Dragons are ALWAYS drawn (no off/pass logic).
*/

(function(){
"use strict";

if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = {
  version:"DRAGON_LOOKLOCK_v1",
  mount:function(){}
};

const DPR_CAP = 1.6;

/* ====== LOOK SCALE (fixed to your current spec) ====== */
const BODY_WIDTH_PX = 81;               // locked from your last size directive
const BODY_R = BODY_WIDTH_PX * 0.5;

/* ====== MOTION (kept simple; we are NOT tuning where yet) ====== */
const SEGMENTS = 140;
const GAP_PX   = 16;                    // spine segment spacing
const SPEED_PX = 70;                    // px/sec horizontal drift
const AMP_PX   = 16;                    // vertical weave amplitude
const SWIVEL_PX= 10;                    // lateral swivel component for depth feel (small)

/* ====== CANVAS ====== */
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
  let dpr = 1;
  try{ dpr = window.devicePixelRatio || 1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1, dpr));
  W = Math.floor((window.innerWidth||1) * DPR);
  H = Math.floor((window.innerHeight||1) * DPR);
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ====== UTIL ====== */
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
function hypot(x,y){ return Math.hypot(x,y) || 1; }

/* ====== DRAGON MODEL ====== */
function makeDragon(opts){
  return {
    id: opts.id,
    top: opts.top,
    dir: opts.dir, // +1 L→R, -1 R→L
    baseY: opts.baseY, // normalized
    hue: opts.hue,     // base color string
    pal: opts.pal,
    phase: Math.random()*10,
    x: (opts.dir>0 ? -W*0.25 : W*1.25),
    spine: new Array(SEGMENTS)
  };
}

function palJade(){
  return {
    bodyA: "rgba(0,120,70,0.92)",
    bodyB: "rgba(0,80,48,0.92)",
    outline: "rgba(0,0,0,0.55)",
    rim: "rgba(255,255,255,0.10)",
    gold: "rgba(212,175,55,0.90)",
    goldSoft: "rgba(212,175,55,0.18)"
  };
}
function palCrimson(){
  return {
    bodyA: "rgba(190,35,35,0.92)",
    bodyB: "rgba(120,18,20,0.92)",
    outline: "rgba(0,0,0,0.55)",
    rim: "rgba(255,255,255,0.10)",
    gold: "rgba(212,175,55,0.92)",
    goldSoft: "rgba(212,175,55,0.18)"
  };
}

const dragonTop = makeDragon({
  id:1, top:true, dir:+1, baseY:0.34, hue:"jade", pal: palJade()
});
const dragonBot = makeDragon({
  id:2, top:false, dir:-1, baseY:0.66, hue:"crimson", pal: palCrimson()
});

/* ====== SPINE BUILD ====== */
function buildSpine(dr, t, dt){
  const gap = GAP_PX * DPR;
  const amp = AMP_PX * DPR;
  const swivel = SWIVEL_PX * DPR;

  // advance head x
  dr.x += dr.dir * SPEED_PX * DPR * dt;

  // wrap so always visible
  const margin = W*0.35;
  if(dr.dir>0 && dr.x > W + margin) dr.x = -margin;
  if(dr.dir<0 && dr.x < -margin) dr.x = W + margin;

  const baseY = H * dr.baseY;

  // wave (mirrored but not identical)
  const w1 = 1.9;
  const w2 = 1.25;
  const sign = dr.top ? 1 : -1;

  const headY = baseY
    + Math.sin((t*0.9) + dr.phase) * amp
    + Math.sin((t*0.55) + dr.phase*0.7) * (amp*0.45) * sign;

  const headX = dr.x
    + Math.sin((t*0.85) + dr.phase*1.1) * swivel * sign;

  // head
  dr.spine[0] = {x: headX, y: headY};

  // trailing points
  for(let i=1;i<SEGMENTS;i++){
    const prev = dr.spine[i-1];

    // candidate (mostly behind)
    const candX = prev.x - dr.dir*gap;
    const candY = baseY
      + Math.sin((t*w1) + dr.phase - i*0.08) * amp * sign
      + Math.sin((t*w2) + dr.phase - i*0.12) * (amp*0.22) * sign;

    // enforce exact spacing
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
  let dx = p1.x - p0.x;
  let dy = p1.y - p0.y;
  let d = hypot(dx,dy);
  return {x: dx/d, y: dy/d};
}
function normal(sp,i){
  const t = tangent(sp,i);
  return {x: -t.y, y: t.x};
}

function radiusAt(i){
  // slender celestial taper
  const t = i/(SEGMENTS-1);
  // head slightly thicker, long slim mid, tapered tail
  const r = (t<0.12) ? lerp(1.05, 1.00, t/0.12)
          : (t<0.70) ? 1.00
          : lerp(1.00, 0.18, (t-0.70)/0.30);
  return BODY_R * r * DPR;
}

/* ====== PATH HELPERS ====== */
function smoothPolyline(points){
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i=1;i<points.length-1;i++){
    const mx = (points[i].x + points[i+1].x) * 0.5;
    const my = (points[i].y + points[i+1].y) * 0.5;
    ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
  }
  ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
}

/* ====== DRAW LOOK ====== */
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

  // fill gradient along vertical (simple but readable)
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.bodyA);
  g.addColorStop(0.60, dr.pal.bodyB);
  g.addColorStop(1.00, dr.pal.bodyB);

  ctx.save();

  // silhouette
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for(let i=1;i<left.length-1;i++){
    const mx = (left[i].x + left[i+1].x)*0.5;
    const my = (left[i].y + left[i+1].y)*0.5;
    ctx.quadraticCurveTo(left[i].x, left[i].y, mx, my);
  }
  ctx.lineTo(left[left.length-1].x, left[left.length-1].y);

  for(let i=right.length-1;i>0;i--){
    const p = right[i];
    const prev = right[i-1];
    const mx = (p.x + prev.x)*0.5;
    const my = (p.y + prev.y)*0.5;
    ctx.quadraticCurveTo(p.x, p.y, mx, my);
  }
  ctx.closePath();

  ctx.fillStyle = g;
  ctx.fill();

  // strong outline (definition)
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.strokeStyle = dr.pal.outline;
  ctx.lineWidth = 3.6*DPR;
  ctx.stroke();

  // rim highlight (thin)
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle = dr.pal.rim;
  ctx.lineWidth = 1.6*DPR;
  smoothPolyline(left);
  ctx.stroke();

  ctx.restore();

  return {left,right};
}

function drawRidge(dr){
  const sp = dr.spine;

  // gold ridge line
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle = dr.pal.goldSoft;
  ctx.lineWidth = 2.2*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i++){
    const n = normal(sp,i);
    const r = radiusAt(i);
    ctx.lineTo(sp[i].x + n.x*(r*0.82), sp[i].y + n.y*(r*0.82));
  }
  ctx.stroke();

  // subtle fins (small, frequent)
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  for(let i=14;i<sp.length-26;i+=6){
    const p = sp[i];
    const n = normal(sp,i);
    const r = radiusAt(i);
    const h = 8*DPR + (i%12)*0.3*DPR; // gentle variation
    const w = 5*DPR;

    const bx = p.x + n.x*(r*0.88);
    const by = p.y + n.y*(r*0.88);

    ctx.beginPath();
    ctx.moveTo(bx, by);
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
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.0*DPR;

  // diamond scales along flank (two rows)
  for(let i=18;i<sp.length-30;i+=3){
    const p = sp[i];
    const t = tangent(sp,i);
    const n = normal(sp,i);
    const r = radiusAt(i);

    // two offsets: upper flank + mid flank
    for(let row=0; row<2; row++){
      const off = (row===0) ? 0.18 : -0.05;
      const cx = p.x + n.x*(r*off);
      const cy = p.y + n.y*(r*off);

      const s = r*0.15;
      const ax = t.x*s, ay = t.y*s;
      const bx = n.x*s, by = n.y*s;

      ctx.beginPath();
      ctx.moveTo(cx + ax, cy + ay);
      ctx.lineTo(cx + bx, cy + by);
      ctx.lineTo(cx - ax, cy - ay);
      ctx.lineTo(cx - bx, cy - by);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // gold micro glints near ridge
  ctx.strokeStyle = "rgba(212,175,55,0.16)";
  for(let i=22;i<sp.length-34;i+=7){
    const p = sp[i];
    const n = normal(sp,i);
    const r = radiusAt(i);
    const x = p.x + n.x*(r*0.60);
    const y = p.y + n.y*(r*0.60);
    ctx.beginPath();
    ctx.arc(x,y,r*0.07,0.1,2.1);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHead(dr){
  const sp = dr.spine;
  const p = sp[0];
  const t = tangent(sp,0);
  const ang = Math.atan2(t.y, t.x);
  const s = radiusAt(0) * 1.15;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(ang);

  // skull
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.08,s*0.70,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle = dr.pal.bodyA;
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.00,s*0.66,0,0,Math.PI*2);
  ctx.fill();

  // snout (long)
  ctx.beginPath();
  ctx.ellipse(s*0.98, s*0.06, s*1.05, s*0.40, 0, 0, Math.PI*2);
  ctx.fill();

  // outline head
  ctx.strokeStyle = dr.pal.outline;
  ctx.lineWidth = 2.8*DPR;
  ctx.stroke();

  // eye (gold)
  ctx.fillStyle = dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.26,-s*0.10,s*0.15,s*0.10,0.25,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.ellipse(s*0.30,-s*0.10,s*0.06,s*0.10,0.05,0,Math.PI*2);
  ctx.fill();

  // horns (curved)
  ctx.strokeStyle = "rgba(212,175,55,0.70)";
  ctx.lineWidth = 3.0*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(-s*0.10,-s*0.34);
  ctx.quadraticCurveTo(s*0.10,-s*0.95,s*0.62,-s*1.08);
  ctx.moveTo(-s*0.18,-s*0.28);
  ctx.quadraticCurveTo(s*0.00,-s*0.86,s*0.44,-s*0.98);
  ctx.stroke();

  // whiskers (long, flowing)
  ctx.strokeStyle = "rgba(212,175,55,0.65)";
  ctx.lineWidth = 2.2*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.28, 0);
  ctx.quadraticCurveTo(s*2.10, -s*0.52, s*3.10, -s*0.72);
  ctx.moveTo(s*1.28, 0);
  ctx.quadraticCurveTo(s*2.00,  s*0.48, s*3.00,  s*0.66);
  ctx.stroke();

  // beard
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.8*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.92, s*0.26);
  ctx.quadraticCurveTo(s*0.68, s*0.96, s*0.18, s*1.22);
  ctx.stroke();

  // mane (soft strands back)
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1.6*DPR;
  for(let i=0;i<8;i++){
    const yy = -s*0.42 + i*(s*0.10);
    ctx.beginPath();
    ctx.moveTo(-s*0.30, yy);
    ctx.quadraticCurveTo(-s*1.05, yy + s*0.12, -s*1.60, yy + s*0.44);
    ctx.stroke();
  }

  ctx.restore();
}

/* ====== RENDER ====== */
let last = 0;

function frame(ts){
  if(!last) last = ts;
  const dt = (ts-last)/1000;
  last = ts;

  const t = ts/1000;

  ctx.clearRect(0,0,W,H);

  // build + draw top
  buildSpine(dragonTop, t, dt);
  drawBody(dragonTop);
  drawRidge(dragonTop);
  drawScales(dragonTop);
  drawHead(dragonTop);

  // build + draw bottom
  buildSpine(dragonBot, t, dt);
  drawBody(dragonBot);
  drawRidge(dragonBot);
  drawScales(dragonBot);
  drawHead(dragonBot);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

})();
