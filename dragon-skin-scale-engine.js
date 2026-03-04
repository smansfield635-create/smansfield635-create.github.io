/* =====================================================
   GEODIAMETRICS DRAGON SKIN + SCALE ENGINE — LAYER 11
   ENGLISH ONLY
   Goal:
     - stop "vine/noodle" look
     - true head + segmented body + scale plates + ridge spikes
     - SLITHER (not violent wiggle)
   Rules:
     - NO new gd_* keys
     - NO external libs
     - standalone (replaces Layer 10 script)
===================================================== */

(function(){
"use strict";

/* ------------------------------------------
   Canvas
------------------------------------------ */
const cv = document.createElement("canvas");
cv.style.position = "fixed";
cv.style.top = "0";
cv.style.left = "0";
cv.style.pointerEvents = "none";
cv.style.zIndex = "9";
document.body.appendChild(cv);

const ctx = cv.getContext("2d");

function resize(){
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ------------------------------------------
   Dragon Config
------------------------------------------ */
const DRAGON = {
  segments: 96,
  spacing: 16,            // distance between spine nodes
  speed: 0.85,            // horizontal travel speed
  yBase: () => window.innerHeight * 0.35,
  slitherAmp: 14,         // slither amplitude (smooth)
  slitherFreq: 0.008,     // slither speed (lower = calmer)
  followEase: 0.38,       // lower = smoother / less jitter
  bodyStart: 34,          // px body thickness near head
  bodyEnd: 6,             // px thickness near tail
  bodyColor: "rgba(8,58,26,0.96)",     // dark green
  edgeGold: "rgba(212,175,55,0.62)",   // gold outline
  glowGold: "rgba(212,175,55,0.22)",   // soft gold glow
  scaleGold: "rgba(212,175,55,0.20)",  // scale shimmer
  ridgeGold: "rgba(212,175,55,0.50)"   // ridge spikes
};

let t = Math.random()*1000;

function makeSpine(){
  const arr = [];
  const y0 = DRAGON.yBase();
  for(let i=0;i<DRAGON.segments;i++){
    arr.push({ x: -i*DRAGON.spacing, y: y0, vx:0, vy:0 });
  }
  return arr;
}

const spine = makeSpine();

/* ------------------------------------------
   Helpers
------------------------------------------ */
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function lerp(a,b,k){ return a + (b-a)*k; }

/* ------------------------------------------
   Head (true silhouette)
------------------------------------------ */
function drawHead(p, dir){

  const x = p.x, y = p.y;

  // shadow glow
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.shadowColor = DRAGON.glowGold;
  ctx.shadowBlur = 18;

  // skull
  ctx.fillStyle = "rgba(6,44,20,0.98)";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 22, 0, 0, Math.PI*2);
  ctx.fill();

  // snout/jaw
  ctx.fillStyle = "rgba(7,40,18,0.98)";
  ctx.beginPath();
  ctx.ellipse(x + 18*dir, y + 4, 22, 14, 0, 0, Math.PI*2);
  ctx.fill();

  // nose tip
  ctx.fillStyle = "rgba(7,36,16,0.98)";
  ctx.beginPath();
  ctx.ellipse(x + 34*dir, y + 4, 8, 6, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();

  // eye socket
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.ellipse(x + 8*dir, y - 4, 10, 7, 0, 0, Math.PI*2);
  ctx.fill();

  // eye
  ctx.fillStyle = "rgba(255,214,74,0.96)";
  ctx.beginPath();
  ctx.arc(x + 10*dir, y - 4, 4, 0, Math.PI*2);
  ctx.fill();

  // pupil
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.beginPath();
  ctx.arc(x + 11*dir, y - 4, 1.6, 0, Math.PI*2);
  ctx.fill();

  // whiskers (gold)
  ctx.strokeStyle = DRAGON.edgeGold;
  ctx.lineWidth = 1.6;

  ctx.beginPath();
  ctx.moveTo(x + 26*dir, y + 2);
  ctx.lineTo(x + 62*dir, y - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 24*dir, y + 7);
  ctx.lineTo(x + 58*dir, y + 16);
  ctx.stroke();

  // horns (gold)
  ctx.strokeStyle = "rgba(212,175,55,0.80)";
  ctx.lineWidth = 2.2;

  ctx.beginPath();
  ctx.moveTo(x - 2*dir, y - 12);
  ctx.lineTo(x - 16*dir, y - 34);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 8*dir, y - 12);
  ctx.lineTo(x + 2*dir, y - 38);
  ctx.stroke();

  // crest spikes near head
  ctx.strokeStyle = DRAGON.ridgeGold;
  ctx.lineWidth = 2;
  for(let k=0;k<5;k++){
    const px = x - k*10*dir;
    const py = y - 16 - k*1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - 6*dir, py - 14);
    ctx.stroke();
  }
}

/* ------------------------------------------
   Body Skin + Scales + Ridge
------------------------------------------ */
function drawBody(dir){

  // Body pass (thick → thin)
  for(let i=DRAGON.segments-1;i>=0;i--){

    const p = spine[i];

    const r = lerp(DRAGON.bodyStart, DRAGON.bodyEnd, i/(DRAGON.segments-1));
    const rx = r;
    const ry = r*0.72;

    // main fill
    ctx.fillStyle = DRAGON.bodyColor;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI*2);
    ctx.fill();

    // edge stroke (gold)
    ctx.strokeStyle = DRAGON.edgeGold;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI*2);
    ctx.stroke();

    // scale plates (segmented, not fuzzy)
    if(i % 2 === 0 && i > 6){
      ctx.fillStyle = DRAGON.scaleGold;
      ctx.beginPath();
      ctx.ellipse(p.x + 0.18*rx*dir, p.y - 0.12*ry, rx*0.35, ry*0.28, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.ellipse(p.x - 0.12*rx*dir, p.y + 0.10*ry, rx*0.22, ry*0.18, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // ridge spikes (top line), start after head region
    if(i > 6 && i % 3 === 0){
      const spikeH = clamp(rx*0.55, 6, 18);
      ctx.strokeStyle = DRAGON.ridgeGold;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - ry);
      ctx.lineTo(p.x - 4*dir, p.y - ry - spikeH);
      ctx.stroke();
    }

    // tail fin (last few segments)
    if(i > DRAGON.segments-10){
      ctx.fillStyle = "rgba(212,175,55,0.16)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, rx*0.85, ry*0.30, 0, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Specular highlight sweep (one clean pass)
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  for(let i=0;i<DRAGON.segments;i+=2){
    const p = spine[i];
    const r = lerp(DRAGON.bodyStart, DRAGON.bodyEnd, i/(DRAGON.segments-1));
    const y = p.y - r*0.35;
    if(i===0) ctx.moveTo(p.x, y);
    else ctx.lineTo(p.x, y);
  }
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------
   Motion (smooth slither)
------------------------------------------ */
function update(){

  t += 1;

  const head = spine[0];

  // Smooth slither path
  const slither = Math.sin(t*DRAGON.slitherFreq) * DRAGON.slitherAmp;

  head.x += DRAGON.speed;
  head.y = DRAGON.yBase() + slither;

  // wrap
  if(head.x > window.innerWidth + 240){
    head.x = -240;
  }

  // follow chain (ease)
  for(let i=1;i<spine.length;i++){
    const prev = spine[i-1];
    const cur  = spine[i];

    const dx = prev.x - cur.x;
    const dy = prev.y - cur.y;

    const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;

    const tx = prev.x - (dx/dist) * DRAGON.spacing;
    const ty = prev.y - (dy/dist) * DRAGON.spacing;

    cur.x = lerp(cur.x, tx, DRAGON.followEase);
    cur.y = lerp(cur.y, ty, DRAGON.followEase);
  }
}

/* ------------------------------------------
   Render
------------------------------------------ */
function render(){

  ctx.clearRect(0,0,cv.width,cv.height);

  // direction is always left->right for now (dir=+1)
  const dir = 1;

  update();

  // body first, head last
  drawBody(dir);
  drawHead(spine[0], dir);

  requestAnimationFrame(render);
}

render();

})();
