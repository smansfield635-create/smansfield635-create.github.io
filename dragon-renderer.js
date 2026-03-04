/* TNT — /assets/dragon-renderer.js
   GEODIAMETRICS DRAGON RENDERER — HEXAGONAL STANDARD
   FILE: /assets/dragon-renderer.js
   VERSION: DRAGON_RENDERER_HEX_v1

   PURPOSE
   - Renderer-only module (no lifecycle, no gd_* keys)
   - Smooth slither (no violent wiggle)
   - Segmented body (stop vine/noodle)
   - HEXAGONAL SCALE LATTICE (honeycomb) — NOT diamonds
   - Dorsal ridge spikes
   - True head silhouette (basic but readable)

   NOTE
   - This is a standalone preview renderer. Later we wire it into dragon-engine.js.
===================================================== */

(function(){
"use strict";

/* ------------------------------------------
   Canvas
------------------------------------------ */
const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "9";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ------------------------------------------
   Dragon Config (HEX standard)
------------------------------------------ */
const DRAGON = {
  segments: 96,
  spacing: 16,
  speed: 0.85,

  yBase: () => window.innerHeight * 0.35,

  slitherAmp: 14,
  slitherFreq: 0.008,
  followEase: 0.38,

  bodyStart: 34,
  bodyEnd: 6,

  bodyColor: "rgba(8,58,26,0.96)",
  outlineGold: "rgba(212,175,55,0.62)",
  glowGold: "rgba(212,175,55,0.22)",

  /* HEX lattice */
  hexStroke: "rgba(255,255,255,0.14)",
  hexStrokeDark: "rgba(0,0,0,0.16)",
  hexGold: "rgba(212,175,55,0.16)",

  ridgeGold: "rgba(212,175,55,0.50)"
};

let t = Math.random()*1000;

/* ------------------------------------------
   Spine
------------------------------------------ */
function makeSpine(){
  const arr = [];
  const y0 = DRAGON.yBase();
  for(let i=0;i<DRAGON.segments;i++){
    arr.push({ x: -i*DRAGON.spacing, y: y0 });
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
   HEX cell (flat-top)
------------------------------------------ */
function hexPath(cx, cy, s){
  const a = Math.PI/3;
  ctx.beginPath();
  for(let k=0;k<6;k++){
    const x = cx + Math.cos(a*k)*s;
    const y = cy + Math.sin(a*k)*s;
    if(k===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.closePath();
}

/* ------------------------------------------
   Head (true silhouette)
------------------------------------------ */
function drawHead(p, dir){
  const x = p.x, y = p.y;

  // glow
  ctx.save();
  ctx.shadowColor = DRAGON.glowGold;
  ctx.shadowBlur = 18;

  // skull
  ctx.fillStyle = "rgba(6,44,20,0.98)";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 22, 0, 0, Math.PI*2);
  ctx.fill();

  // snout
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

  // whiskers
  ctx.strokeStyle = DRAGON.outlineGold;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + 26*dir, y + 2);
  ctx.lineTo(x + 62*dir, y - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 24*dir, y + 7);
  ctx.lineTo(x + 58*dir, y + 16);
  ctx.stroke();

  // horns
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
}

/* ------------------------------------------
   Body (segments) + HEX lattice + Ridge spikes
------------------------------------------ */
function drawBody(dir){

  for(let i = DRAGON.segments-1; i >= 0; i--){

    const p = spine[i];

    const r = lerp(DRAGON.bodyStart, DRAGON.bodyEnd, i/(DRAGON.segments-1));
    const rx = r;
    const ry = r*0.72;

    // main fill
    ctx.fillStyle = DRAGON.bodyColor;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI*2);
    ctx.fill();

    // gold outline
    ctx.strokeStyle = DRAGON.outlineGold;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI*2);
    ctx.stroke();

    // HEX lattice (two staggered rows on flank)
    if(i > 6){

      const s = clamp(rx*0.22, 3.6, 10);

      // row A (upper flank)
      ctx.strokeStyle = DRAGON.hexStroke;
      ctx.lineWidth = 1.0;

      const ax = p.x + (0.20*rx*dir);
      const ay = p.y - (0.18*ry);

      hexPath(ax, ay, s);
      ctx.stroke();

      // row B (lower flank) staggered
      ctx.strokeStyle = DRAGON.hexStrokeDark;
      const bx = p.x + (0.08*rx*dir);
      const by = p.y + (0.06*ry);

      hexPath(bx + ((i%2)?s*0.45:0), by, s*0.92);
      ctx.stroke();

      // gold glint occasionally
      if(i % 7 === 0){
        ctx.strokeStyle = DRAGON.hexGold;
        ctx.lineWidth = 1.2;
        hexPath(p.x, p.y - ry*0.35, s*0.85);
        ctx.stroke();
      }
    }

    // ridge spikes
    if(i > 6 && i % 3 === 0){
      const spikeH = clamp(rx*0.55, 6, 18);
      ctx.strokeStyle = DRAGON.ridgeGold;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - ry);
      ctx.lineTo(p.x - 4*dir, p.y - ry - spikeH);
      ctx.stroke();
    }
  }

  // specular highlight sweep
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  for(let i=0;i<DRAGON.segments;i+=2){
    const p = spine[i];
    const r = lerp(DRAGON.bodyStart, DRAGON.bodyEnd, i/(DRAGON.segments-1));
    const yy = p.y - r*0.35;
    if(i===0) ctx.moveTo(p.x, yy);
    else ctx.lineTo(p.x, yy);
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
  const slither = Math.sin(t*DRAGON.slitherFreq) * DRAGON.slitherAmp;

  head.x += DRAGON.speed;
  head.y = DRAGON.yBase() + slither;

  if(head.x > window.innerWidth + 240){
    head.x = -240;
  }

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
   Render loop
------------------------------------------ */
function render(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const dir = 1; // left → right for standalone renderer

  update();
  drawBody(dir);
  drawHead(spine[0], dir);

  requestAnimationFrame(render);
}

render();

})();
