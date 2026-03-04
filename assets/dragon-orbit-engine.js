/* =====================================================
   GEODIAMETRICS DRAGON ORBIT ENGINE
   LAYER 13 v2 — MOTION ONLY (ENGLISH ONLY)
   PURPOSE
   • Make the dragon read as a DRAGON (not vines):
     - thicker body, segmented scales, whiskers, horns, head shape
   • Slither = forward glide (low-frequency lateral drift)
   • Above compass face, below buttons (z-index)
   • No text. No UI. No assets.
===================================================== */

(function(){
"use strict";

/* ===============================
   Canvas: place between layers
   NOTE: Set zIndex below your buttons.
         If your buttons are ~260+, use 120 safely.
================================ */
const FX_Z = 120;

const c = document.createElement("canvas");
c.style.position = "fixed";
c.style.top = "0";
c.style.left = "0";
c.style.width = "100%";
c.style.height = "100%";
c.style.pointerEvents = "none";
c.style.zIndex = String(FX_Z);

document.body.appendChild(c);

const ctx = c.getContext("2d", { alpha:true });

function resize(){
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.floor(window.innerWidth * dpr);
  c.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resize();
window.addEventListener("resize", resize);

/* ===============================
   Helpers
================================ */
function lerp(a,b,t){ return a + (b-a)*t; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function hypot(dx,dy){ return Math.sqrt(dx*dx+dy*dy) || 1; }

function mkBody(n, x, y, spacing){
  const pts=[];
  for(let i=0;i<n;i++) pts.push({ x:x - i*spacing, y:y });
  return pts;
}

/* Follow-the-leader with spacing */
function stepSpine(body, headX, headY, spacing, followK){
  body[0].x = lerp(body[0].x, headX, followK);
  body[0].y = lerp(body[0].y, headY, followK);

  for(let i=1;i<body.length;i++){
    const p = body[i-1];
    const c = body[i];
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const d = hypot(dx,dy);

    const tx = p.x - (dx/d)*spacing;
    const ty = p.y - (dy/d)*spacing;

    c.x = lerp(c.x, tx, 0.58);
    c.y = lerp(c.y, ty, 0.58);
  }
}

/* ===============================
   Dragon render (thick + segmented)
================================ */
function drawScaleArc(x,y,r,ang,alpha){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(ang);

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(212,175,55,0.55)";
  ctx.lineWidth = 1;

  // small scallop arcs
  ctx.beginPath();
  ctx.arc(0, 0, r*0.62, Math.PI*0.20, Math.PI*0.80);
  ctx.stroke();

  ctx.restore();
}

function renderDragon(body, opts){
  const n = body.length;

  // compute heading from first two points
  const h0 = body[0], h1 = body[1] || body[0];
  const hx = h0.x - h1.x;
  const hy = h0.y - h1.y;
  const headAng = Math.atan2(hy, hx);

  // BODY: thick segmented capsules + scale hints
  for(let i=0;i<n;i++){
    const p = body[i];
    const t = i/(n-1);

    // thicker body, slower taper
    const size = lerp(opts.headSize, opts.tailSize, Math.pow(t, 0.72));

    // segment heading
    const pA = body[Math.max(0,i-1)];
    const pB = body[Math.min(n-1,i+1)];
    const ang = Math.atan2(pB.y - pA.y, pB.x - pA.x);

    // base fill
    ctx.save();
    ctx.globalAlpha = opts.alpha;

    ctx.fillStyle = opts.fill;
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    ctx.ellipse(p.x, p.y, size, size*0.78, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // dorsal ridge spikes (near head)
    if(i>1 && i<16){
      const k = 1 - (i-2)/14;
      const spike = lerp(14, 5, 1-k);
      ctx.strokeStyle = "rgba(212,175,55,0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - size*0.92);
      ctx.lineTo(p.x + Math.cos(ang+Math.PI/2)*spike*0.20, p.y - size*0.92 - spike);
      ctx.stroke();
    }

    // scale arcs (visible segmentation, not grid)
    if(i>2 && i<n-4 && (i%2===0)){
      drawScaleArc(p.x, p.y + size*0.10, size, ang, 0.55*opts.alpha);
    }

    ctx.restore();
  }

  // HEAD: horns + whiskers + snout + eye
  ctx.save();
  ctx.translate(h0.x, h0.y);
  ctx.rotate(headAng);
  ctx.globalAlpha = opts.alpha;

  // head base
  ctx.fillStyle = opts.fill;
  ctx.strokeStyle = opts.stroke;
  ctx.lineWidth = 2.2;

  ctx.beginPath();
  ctx.ellipse(0, 0, opts.headSize*1.22, opts.headSize*0.98, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // snout
  ctx.beginPath();
  ctx.ellipse(opts.headSize*1.00, 0, opts.headSize*0.70, opts.headSize*0.42, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // jaw line
  ctx.strokeStyle = "rgba(212,175,55,0.35)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(opts.headSize*0.35, opts.headSize*0.55);
  ctx.quadraticCurveTo(opts.headSize*0.95, opts.headSize*0.40, opts.headSize*1.35, opts.headSize*0.10);
  ctx.stroke();

  // horns
  ctx.strokeStyle = "rgba(212,175,55,0.65)";
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  ctx.moveTo(opts.headSize*0.10, -opts.headSize*0.95);
  ctx.lineTo(opts.headSize*0.55, -opts.headSize*1.55);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(opts.headSize*0.10, opts.headSize*0.95);
  ctx.lineTo(opts.headSize*0.55, opts.headSize*1.55);
  ctx.stroke();

  // whiskers (two)
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(opts.headSize*1.10, -opts.headSize*0.12);
  ctx.quadraticCurveTo(opts.headSize*1.90, -opts.headSize*0.50, opts.headSize*2.40, -opts.headSize*0.18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(opts.headSize*1.10, opts.headSize*0.12);
  ctx.quadraticCurveTo(opts.headSize*1.90, opts.headSize*0.50, opts.headSize*2.40, opts.headSize*0.18);
  ctx.stroke();

  // eye
  ctx.fillStyle = "rgba(212,175,55,0.80)";
  ctx.beginPath();
  ctx.arc(opts.headSize*0.25, -opts.headSize*0.20, 2.6, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

/* ===============================
   Motion fields (slither, not wiggle)
================================ */
function headPos(kind, t){
  const W = window.innerWidth;
  const H = window.innerHeight;

  const cx = W*0.5;
  const cy = H*0.48;

  const rX = Math.min(W,H)*0.27;
  const rY = Math.min(W,H)*0.21;

  const yTop = H*0.30;
  const yBot = H*0.72;

  if(kind==="E"){
    const a = t*0.36; // slower orbit
    return { x: cx + Math.cos(a)*rX, y: cy + Math.sin(a)*rY };
  }

  if(kind==="W"){
    const a = -t*0.36 + Math.PI*0.92;
    return { x: cx + Math.cos(a)*rX, y: cy + Math.sin(a)*rY };
  }

  if(kind==="N"){
    const period = 22.0;
    const u = (t/period) % 1;
    const x = lerp(-240, W+240, u);

    // low frequency slither (no violent wiggle)
    const drift = Math.sin(t*0.35)*10 + Math.sin(t*0.17)*6;
    return { x, y: yTop + drift*0.25 };
  }

  // S
  const period = 24.0;
  const u = (t/period) % 1;
  const x = lerp(W+240, -240, u);
  const drift = Math.cos(t*0.33)*10 + Math.cos(t*0.16)*6;
  return { x, y: yBot + drift*0.25 };
}

/* ===============================
   Dragon set: 4
================================ */
const SEG = 78;            // more segments = more “dragon”
const SPACING = 12;        // tighter spacing = more “body”
function makeDragon(kind){
  const W = window.innerWidth;
  const H = window.innerHeight;

  const startY = (kind==="N") ? H*0.30 : (kind==="S") ? H*0.72 : H*0.48;
  return {
    kind,
    phase: Math.random()*1000,
    speed: 1.0 + Math.random()*0.25,
    body: mkBody(SEG, -300, startY, SPACING)
  };
}

const dragons = [
  makeDragon("N"),
  makeDragon("S"),
  makeDragon("E"),
  makeDragon("W")
];

/* ===============================
   Loop
================================ */
function render(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  const t = performance.now()/1000;

  // draw order: orbit first, then travelers (readability)
  const order = ["E","W","N","S"];

  for(const k of order){
    const d = dragons.find(x=>x.kind===k);
    if(!d) continue;

    const hp = headPos(d.kind, t + d.phase*0.001);

    const followK = (d.kind==="E"||d.kind==="W") ? 0.20 : 0.17;
    stepSpine(d.body, hp.x, hp.y, SPACING, followK);

    renderDragon(d.body, {
      alpha: (d.kind==="E"||d.kind==="W") ? 0.90 : 0.96,
      fill: "rgba(6,52,24,0.92)",                 // dark green
      stroke: "rgba(212,175,55,0.72)",            // gold outline
      headSize: (d.kind==="N"||d.kind==="S") ? 28 : 26,
      tailSize: 7
    });
  }

  requestAnimationFrame(render);
}

render();

})();
