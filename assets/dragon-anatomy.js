/* ============================================================
GEODIAMETRICS DRAGON ANATOMY ENGINE
FILE: /assets/dragon-anatomy.js
LAYER: DRAGONS (ABOVE COMPASS FACE, BELOW GEMS)

PURPOSE
• Two dragons (top + bottom), cinematic slither (NOT wiggle)
• Bigger GIRTH (not longer), clearer head, segmented body, scale texture
• Slow enough to read (default)
• Optional trailing banner text (English only in this build)
• New quote per full screen pass (enter → exit → restart)

CONSTRAINTS
• Canvas only, pointer-events none
• No new gd_* keys
• No storage
============================================================ */

(function(){
"use strict";

/* ------------------------------------
Canvas
------------------------------------ */

const canvas = document.createElement("canvas");
canvas.id = "gd_dragon_canvas";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "9"; // ABOVE compass face, BELOW gems/buttons
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });

let W=1,H=1,DPR=1;
function resize(){
  const ww = Math.max(1, window.innerWidth||1);
  const hh = Math.max(1, window.innerHeight||1);
  const dpr = Math.min(1.6, Math.max(1, window.devicePixelRatio||1));
  DPR = dpr;
  W = Math.floor(ww * DPR);
  H = Math.floor(hh * DPR);
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ------------------------------------
Tuning (edit here)
------------------------------------ */

const CFG = {
  fps: 30,

  // dragon placement
  yTop: 0.28,
  yBot: 0.74,

  // motion (SLOW + readable)
  speed: 0.010,         // fraction of screen per ms (lower = slower)
  slitherFreq: 2.1,     // lower = smoother, less violent
  slitherAmp: 0.030,    // fraction of H

  // anatomy
  segments: 44,
  spacing: 0.028,       // fraction of W between spine points
  girth: 0.060,         // fraction of min(W,H) (main thickness)
  taper: 0.55,          // tail taper strength

  // color
  body: "rgba(6,34,20,0.86)",           // onyx green-black
  belly: "rgba(110,24,18,0.34)",        // subtle red belly glow
  edge: "rgba(0,0,0,0.38)",             // outer shadow edge
  scaleGold: "rgba(212,175,55,0.20)",   // scale highlight
  eye: "rgba(255,214,90,0.95)",         // eye
  horn: "rgba(212,175,55,0.80)",        // horn/whisker
  text: "rgba(212,175,55,0.78)",        // banner text
  textGlow: "rgba(212,175,55,0.30)",

  // banner
  bannerOn: true,
  bannerFontPx: 15,      // CSS px, will be DPR-scaled
  bannerSpacing: 10,     // segment step for banner anchor points

  // quotes (EN-only in this build)
  quotes: [
    "SAY LESS. DO MORE.",
    "THE RIVER FLOWS. TIME PASSES.",
    "BOUND THEN SCALE.",
    "RECEIPTS > ARGUMENTS.",
    "CONTAIN FIRST.",
    "MEASURE THEN MOVE."
  ]
};

/* ------------------------------------
Helpers
------------------------------------ */

function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
function lerp(a,b,t){ return a + (b-a)*t; }

// seeded RNG (stable per load, no storage)
function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32((Date.now() ^ ((Math.random()*1e9)|0))>>>0);

/* ------------------------------------
Spline (Catmull-Rom)
------------------------------------ */

function catmullRom(p0,p1,p2,p3,t){
  const t2 = t*t;
  const t3 = t2*t;
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x + p2.x)*t + (2*p0.x - 5*p1.x + 4*p2.x - p3.x)*t2 + (-p0.x + 3*p1.x - 3*p2.x + p3.x)*t3),
    y: 0.5 * ((2*p1.y) + (-p0.y + p2.y)*t + (2*p0.y - 5*p1.y + 4*p2.y - p3.y)*t2 + (-p0.y + 3*p1.y - 3*p2.y + p3.y)*t3)
  };
}

function buildSmoothPath(points, samplesPerSeg){
  const out = [];
  const n = points.length;
  for(let i=0;i<n-1;i++){
    const p0 = points[Math.max(0,i-1)];
    const p1 = points[i];
    const p2 = points[i+1];
    const p3 = points[Math.min(n-1,i+2)];
    for(let s=0;s<samplesPerSeg;s++){
      const t = s / samplesPerSeg;
      out.push(catmullRom(p0,p1,p2,p3,t));
    }
  }
  out.push(points[n-1]);
  return out;
}

function tangent(a,b){
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.max(1e-6, Math.hypot(dx,dy));
  return {x: dx/d, y: dy/d};
}

function normal(tan){
  return {x: -tan.y, y: tan.x};
}

/* ------------------------------------
Dragon model
------------------------------------ */

function makeDragon(yFrac, direction){
  const segs = CFG.segments;
  const pts = [];
  for(let i=0;i<segs;i++){
    pts.push({x: 0, y: 0});
  }

  // start fully offscreen so it enters cleanly
  const margin = W * 0.28;
  const travel = W + margin*2;

  return {
    yFrac,
    direction, // -1 right->left, +1 left->right
    margin,
    travel,
    phase: rand()*1000,
    quoteIdx: (rand()*CFG.quotes.length)|0
  };
}

const dragons = [
  makeDragon(CFG.yTop, -1),
  makeDragon(CFG.yBot, -1)
];

/* ------------------------------------
Quote update: change when fully exits and restarts
------------------------------------ */

function updateQuoteIfRestart(d, headX){
  // when moving right->left, restart happens when headX < -margin
  if(d.direction < 0){
    if(headX < -d.margin){
      d.quoteIdx = (d.quoteIdx + 1 + ((rand()*3)|0)) % CFG.quotes.length;
      d.phase = rand()*1000;
      return true;
    }
  }else{
    if(headX > W + d.margin){
      d.quoteIdx = (d.quoteIdx + 1 + ((rand()*3)|0)) % CFG.quotes.length;
      d.phase = rand()*1000;
      return true;
    }
  }
  return false;
}

/* ------------------------------------
Render: body as a continuous ribbon + scale hex hints
------------------------------------ */

function drawRibbon(path, thickness){
  // Outer shadow edge
  ctx.strokeStyle = CFG.edge;
  ctx.lineWidth = thickness + 10*DPR;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for(let i=0;i<path.length;i++){
    const p = path[i];
    if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
  }
  ctx.stroke();

  // Main body
  ctx.strokeStyle = CFG.body;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  for(let i=0;i<path.length;i++){
    const p = path[i];
    if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
  }
  ctx.stroke();

  // Belly glow (subtle red underneath)
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = CFG.belly;
  ctx.lineWidth = Math.max(1, thickness*0.55);
  ctx.beginPath();
  for(let i=0;i<path.length;i++){
    const p = path[i];
    if(i===0) ctx.moveTo(p.x,p.y + thickness*0.22); else ctx.lineTo(p.x,p.y + thickness*0.22);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawHexScales(path, thickness){
  // Draw small hex outlines along the body, aligned to tangent.
  ctx.save();
  ctx.strokeStyle = CFG.scaleGold;
  ctx.lineWidth = 1.2*DPR;
  ctx.globalAlpha = 0.9;

  const step = Math.max(6, Math.floor(path.length / 36));
  for(let i=8;i<path.length-8;i+=step){
    const p = path[i];
    const t = tangent(path[i], path[i+1]);
    const n = normal(t);

    const sz = thickness * lerp(0.14, 0.06, i/(path.length-1)); // smaller toward tail
    const cx = p.x + n.x*(thickness*0.22);
    const cy = p.y + n.y*(thickness*0.22);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.atan2(t.y,t.x));

    // hex
    ctx.beginPath();
    for(let k=0;k<6;k++){
      const ang = (Math.PI/3)*k;
      const hx = Math.cos(ang)*sz;
      const hy = Math.sin(ang)*sz*0.86;
      if(k===0) ctx.moveTo(hx,hy); else ctx.lineTo(hx,hy);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawHead(path, thickness, dir, quote){
  // head at path[0], oriented along tangent
  const a = path[0];
  const b = path[2] || path[1] || path[0];
  const t = tangent(a,b);
  const ang = Math.atan2(t.y,t.x);

  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(ang);

  const sx = thickness*0.95;
  const sy = thickness*0.70;

  // skull
  ctx.fillStyle = "rgba(5,40,24,0.92)";
  ctx.beginPath();
  ctx.ellipse(0,0, sx, sy, 0, 0, Math.PI*2);
  ctx.fill();

  // snout / jaw
  ctx.fillStyle = "rgba(4,30,18,0.92)";
  ctx.beginPath();
  ctx.ellipse(sx*0.75, sy*0.15, sx*0.70, sy*0.45, 0, 0, Math.PI*2);
  ctx.fill();

  // nostril
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.arc(sx*1.05, sy*0.12, Math.max(1.2*DPR, sx*0.08), 0, Math.PI*2);
  ctx.fill();

  // eye
  ctx.fillStyle = CFG.eye;
  ctx.shadowColor = "rgba(255,220,120,0.35)";
  ctx.shadowBlur = 10*DPR;
  ctx.beginPath();
  ctx.arc(sx*0.35, -sy*0.15, Math.max(2.2*DPR, sx*0.10), 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // horns
  ctx.strokeStyle = CFG.horn;
  ctx.lineWidth = 2.2*DPR;
  ctx.beginPath();
  ctx.moveTo(-sx*0.15, -sy*0.45);
  ctx.lineTo(-sx*0.45, -sy*1.15);
  ctx.moveTo(sx*0.10, -sy*0.45);
  ctx.lineTo(-sx*0.05, -sy*1.25);
  ctx.stroke();

  // whiskers (curved)
  ctx.strokeStyle = "rgba(212,175,55,0.55)";
  ctx.lineWidth = 1.6*DPR;
  ctx.beginPath();
  ctx.moveTo(sx*1.05, sy*0.20);
  ctx.quadraticCurveTo(sx*1.55, sy*0.05, sx*2.05, -sy*0.20);
  ctx.stroke();

  // small arms hint (tiny spikes under head, NOT cartoony)
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 2*DPR;
  ctx.beginPath();
  ctx.moveTo(sx*0.20, sy*0.65);
  ctx.lineTo(sx*0.05, sy*1.05);
  ctx.moveTo(sx*0.55, sy*0.60);
  ctx.lineTo(sx*0.40, sy*1.00);
  ctx.stroke();

  ctx.restore();

  // Banner (optional) — anchored a bit behind head
  if(!CFG.bannerOn) return;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = CFG.text;
  ctx.shadowColor = CFG.textGlow;
  ctx.shadowBlur = 14*DPR;
  ctx.font = (CFG.bannerFontPx*DPR) + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  // Place banner along path behind head, with gentle curve
  const idx = Math.min(path.length-1, 10);
  const p = path[idx];
  const q = path[idx+2] || path[idx+1] || p;
  const tt = tangent(p,q);
  const aa = Math.atan2(tt.y, tt.x);

  ctx.translate(p.x, p.y - thickness*1.10);
  ctx.rotate(aa);

  // ribbon backing
  const tw = ctx.measureText(quote).width;
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(ctx, -tw*0.08, -CFG.bannerFontPx*DPR*0.95, tw*1.16, CFG.bannerFontPx*DPR*1.45, 10*DPR);
  ctx.fill();

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = CFG.text;
  ctx.fillText(quote, 0, 0);

  ctx.restore();
}

function roundRect(c, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  c.beginPath();
  c.moveTo(x+rr, y);
  c.arcTo(x+w, y, x+w, y+h, rr);
  c.arcTo(x+w, y+h, x, y+h, rr);
  c.arcTo(x, y+h, x, y, rr);
  c.arcTo(x, y, x+w, y, rr);
  c.closePath();
}

/* ------------------------------------
Compute dragon spine points (smooth slither)
------------------------------------ */

function buildDragonSpine(d, t){
  const segs = CFG.segments;
  const pts = new Array(segs);

  const margin = W * 0.30;
  const travel = W + margin*2;

  // progress 0..1 across full pass
  const pxPerMs = (CFG.speed * W); // W fraction per ms -> px/ms
  const u = (t * pxPerMs) % travel;

  const headX = (d.direction < 0) ? (W + margin - u) : (-margin + u);
  const headY = (H * d.yFrac);

  // smoother slither: low frequency + slow time factor
  const amp = (CFG.slitherAmp * H);
  const freq = CFG.slitherFreq;
  const timeF = (t * 0.00055) + d.phase;

  // spacing in pixels
  const gap = (CFG.spacing * W);

  for(let i=0;i<segs;i++){
    const s = i/(segs-1);
    const x = headX + (d.direction * gap * i); // tail extends opposite travel
    const y = headY + Math.sin(timeF + s*freq*Math.PI*2) * amp * (1 - s*0.18);
    pts[i] = {x:x, y:y};
  }

  // restart detection for quote cycling
  updateQuoteIfRestart(d, headX);

  return pts;
}

/* ------------------------------------
Main loop (30fps)
------------------------------------ */

let last=0;
let acc=0;
const frameMs = 1000/CFG.fps;

function frame(ts){
  if(!last) last = ts;
  const dt = ts - last;
  last = ts;

  acc += dt;
  if(acc < frameMs){
    requestAnimationFrame(frame);
    return;
  }
  acc = 0;

  ctx.clearRect(0,0,W,H);

  // Draw BOTH dragons
  for(let i=0;i<dragons.length;i++){
    const d = dragons[i];
    const spine = buildDragonSpine(d, ts);

    // build smooth path
    const smooth = buildSmoothPath(spine, 3);

    // thickness (girth) with taper
    const baseTh = (CFG.girth * Math.min(W,H));
    const th = baseTh;

    // ribbon first
    drawRibbon(smooth, th);

    // scales on top
    drawHexScales(smooth, th);

    // head + banner text
    const quote = CFG.quotes[d.quoteIdx] || CFG.quotes[0];
    drawHead(smooth, th, d.direction, quote);
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

})();
