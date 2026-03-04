/* =====================================================
   GEODIAMETRICS DRAGON ORBIT ENGINE
   LAYER 13 — MOTION ONLY (ENGLISH ONLY)
   GOALS
   • 4 dragons:
       - EAST + WEST dragons orbit the compass (infinity / circular)
       - NORTH + SOUTH dragons travel straight across (opposed directions)
   • Slither (forward glide) NOT violent wiggle
   • Above compass, below buttons (z-index controlled)
   • No text. No UI. No extra assets.
===================================================== */

(function(){
"use strict";

/* --------------------------------------
   Canvas (under buttons, over compass)
-------------------------------------- */

const c = document.createElement("canvas");
c.style.position = "fixed";
c.style.top = "0";
c.style.left = "0";
c.style.width = "100%";
c.style.height = "100%";
c.style.pointerEvents = "none";

/* Put this ABOVE compass face, BELOW gem buttons */
c.style.zIndex = "7";

document.body.appendChild(c);

const ctx = c.getContext("2d", { alpha:true });

function resize(){
  c.width = Math.floor(window.innerWidth * devicePixelRatio);
  c.height = Math.floor(window.innerHeight * devicePixelRatio);
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
resize();
window.addEventListener("resize", resize);

/* --------------------------------------
   Helpers
-------------------------------------- */

function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
function lerp(a,b,t){ return a + (b-a)*t; }
function smoothstep(t){ return t*t*(3-2*t); }

function mkBody(segments, x, y, spacing){
  const pts = [];
  for(let i=0;i<segments;i++){
    pts.push({ x: x - i*spacing, y: y });
  }
  return pts;
}

/* Follow-the-leader smoothing (slither, not wiggle) */
function stepSpine(body, headX, headY, spacing, followK){
  body[0].x = lerp(body[0].x, headX, followK);
  body[0].y = lerp(body[0].y, headY, followK);

  for(let i=1;i<body.length;i++){
    const prev = body[i-1];
    const cur  = body[i];
    let dx = prev.x - cur.x;
    let dy = prev.y - cur.y;
    const dist = Math.hypot(dx,dy) || 1;

    const targetX = prev.x - (dx/dist)*spacing;
    const targetY = prev.y - (dy/dist)*spacing;

    cur.x = lerp(cur.x, targetX, 0.55);
    cur.y = lerp(cur.y, targetY, 0.55);
  }
}

/* Simple “dragon body” render (not the final skin layer) */
function renderDragon(body, opts){
  const n = body.length;

  // body fill
  ctx.save();
  ctx.globalAlpha = opts.alpha;

  // draw tapered capsules
  for(let i=0;i<n;i++){
    const p = body[i];

    const t = i/(n-1);
    const size = lerp(opts.headSize, opts.tailSize, t);

    ctx.fillStyle = opts.fill;
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(p.x, p.y, size, size*0.78, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // dorsal ridge hints (small spikes) near head
    if(i>2 && i<18){
      const spike = lerp(10, 3, (i-2)/16);
      ctx.strokeStyle = opts.spike;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - size*0.85);
      ctx.lineTo(p.x + spike*0.25, p.y - size*0.85 - spike);
      ctx.stroke();
    }
  }

  // head (slightly larger, with “snout” direction)
  const h = body[0];
  const h2 = body[1] || body[0];
  const vx = h.x - h2.x;
  const vy = h.y - h2.y;
  const ang = Math.atan2(vy, vx);

  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.rotate(ang);

  ctx.globalAlpha = opts.alpha;

  // head base
  ctx.fillStyle = opts.fill;
  ctx.strokeStyle = opts.stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, opts.headSize*1.08, opts.headSize*0.92, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // snout
  ctx.beginPath();
  ctx.ellipse(opts.headSize*0.9, 0, opts.headSize*0.55, opts.headSize*0.35, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // horns
  ctx.strokeStyle = opts.spike;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(opts.headSize*0.15, -opts.headSize*0.95);
  ctx.lineTo(opts.headSize*0.55, -opts.headSize*1.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(opts.headSize*0.15, opts.headSize*0.95);
  ctx.lineTo(opts.headSize*0.55, opts.headSize*1.35);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

/* --------------------------------------
   Dragon set: 4 total
-------------------------------------- */

const SEG = 60;
const SPACING = 14;

function makeDragon(kind){
  const W = window.innerWidth;
  const H = window.innerHeight;

  const midX = W*0.5;
  const midY = H*0.46;

  const base = {
    kind,
    phase: Math.random()*1000,
    body: mkBody(SEG, -200, midY, SPACING),
    speed: 0.9 + Math.random()*0.25
  };

  return base;
}

const dragons = [
  makeDragon("N"), // top traveler (right->left or left->right depending below)
  makeDragon("S"), // bottom traveler
  makeDragon("E"), // orbit
  makeDragon("W")  // orbit
];

/* --------------------------------------
   Motion fields
-------------------------------------- */

function headPos(kind, t){
  const W = window.innerWidth;
  const H = window.innerHeight;

  const cx = W*0.5;
  const cy = H*0.46;

  // orbit radii (around compass)
  const rX = Math.min(W,H)*0.26;
  const rY = Math.min(W,H)*0.20;

  // travel lanes
  const yTop = H*0.30;
  const yBot = H*0.70;

  if(kind==="E"){
    // clockwise orbit
    const a = t*0.55;
    return {
      x: cx + Math.cos(a)*rX,
      y: cy + Math.sin(a)*rY
    };
  }

  if(kind==="W"){
    // counter-clockwise orbit (infinity feel by phase offset)
    const a = -t*0.55 + Math.PI*0.9;
    return {
      x: cx + Math.cos(a)*rX,
      y: cy + Math.sin(a)*rY
    };
  }

  if(kind==="N"){
    // left->right across top, gentle slither (small lateral drift)
    const period = 18.0;
    const u = (t/period) % 1;
    const x = lerp(-180, W+180, u);
    const drift = Math.sin(t*0.65)*6; // subtle
    return { x, y: yTop + drift };
  }

  // "S"
  // right->left across bottom, gentle slither (small lateral drift)
  const period = 20.0;
  const u = (t/period) % 1;
  const x = lerp(W+180, -180, u);
  const drift = Math.cos(t*0.62)*6; // subtle
  return { x, y: yBot + drift };
}

/* --------------------------------------
   Render loop
-------------------------------------- */

function render(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  const t = performance.now()/1000;

  // dragons are drawn ABOVE compass (z-index), BELOW buttons (by stacking)
  for(let i=0;i<dragons.length;i++){
    const d = dragons[i];
    const hp = headPos(d.kind, t + d.phase*0.001);

    // follow strength (higher for orbit, lower for travelers)
    const followK = (d.kind==="E"||d.kind==="W") ? 0.22 : 0.18;

    stepSpine(d.body, hp.x, hp.y, SPACING, followK);

    // color scheme: dark green body, gold stroke
    renderDragon(d.body, {
      alpha: (d.kind==="E"||d.kind==="W") ? 0.92 : 0.96,
      fill: "rgba(8,48,22,0.92)",
      stroke: "rgba(212,175,55,0.70)",
      spike: "rgba(212,175,55,0.55)",
      headSize: (d.kind==="E"||d.kind==="W") ? 22 : 24,
      tailSize: 6
    });
  }

  requestAnimationFrame(render);
}

render();

})();
