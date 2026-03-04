/* =====================================================
   GEODIAMETRICS DRAGON ANATOMY ENGINE — LAYER 10
   fixes "vine dragon" problem
   builds true head + spine + scales

   ENGLISH ONLY
   NO NEW gd_* KEYS
===================================================== */

(function(){

"use strict";

/* ------------------------------------------
   Canvas
------------------------------------------ */

const dragonCanvas = document.createElement("canvas");
dragonCanvas.id = "gd_dragon_canvas";
dragonCanvas.style.position = "fixed";
dragonCanvas.style.top = "0";
dragonCanvas.style.left = "0";
dragonCanvas.style.width = "100%";
dragonCanvas.style.height = "100%";
dragonCanvas.style.pointerEvents = "none";
dragonCanvas.style.zIndex = "9";

document.body.appendChild(dragonCanvas);

const ctx = dragonCanvas.getContext("2d", { alpha:true, desynchronized:true });

function resize(){
  const dpr = Math.min(1.6, (window.devicePixelRatio || 1));
  dragonCanvas.width = Math.floor(window.innerWidth * dpr);
  dragonCanvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ------------------------------------------
   Dragon Spine
------------------------------------------ */

const SEGMENTS = 90;          // more segments = smoother body
const TARGET_DIST = 16;       // tighter link distance = less “gaps”
const spineTop = [];
const spineBot = [];

function seedSpine(arr, y){
  arr.length = 0;
  for(let i=0;i<SEGMENTS;i++){
    arr.push({ x: -i*TARGET_DIST, y: y });
  }
}
seedSpine(spineTop, window.innerHeight*0.30);
seedSpine(spineBot, window.innerHeight*0.72);

let phase = 0;
let speed = 0.55;             // SLOWER (per your ask)
let amp = 14;                 // less violent “wiggle”

/* ------------------------------------------
   Draw Dragon Head (improved)
------------------------------------------ */

function drawHead(p, dir){
  const x = p.x;
  const y = p.y;

  // skull
  ctx.fillStyle = "rgba(6,38,20,0.96)";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 22, 0, 0, Math.PI*2);
  ctx.fill();

  // snout
  ctx.fillStyle = "rgba(8,44,24,0.96)";
  ctx.beginPath();
  ctx.ellipse(x + dir*18, y+3, 24, 14, 0, 0, Math.PI*2);
  ctx.fill();

  // eye
  ctx.fillStyle = "rgba(212,175,55,0.95)";
  ctx.beginPath();
  ctx.arc(x + dir*10, y-3, 4.2, 0, Math.PI*2);
  ctx.fill();

  // horns
  ctx.strokeStyle = "rgba(212,175,55,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - dir*2, y-14);
  ctx.lineTo(x - dir*14, y-34);
  ctx.moveTo(x + dir*6, y-14);
  ctx.lineTo(x + dir*2, y-38);
  ctx.stroke();

  // whiskers
  ctx.strokeStyle = "rgba(212,175,55,0.55)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + dir*26, y+2);
  ctx.quadraticCurveTo(x + dir*46, y-10, x + dir*64, y-6);
  ctx.moveTo(x + dir*26, y+6);
  ctx.quadraticCurveTo(x + dir*46, y+16, x + dir*64, y+10);
  ctx.stroke();
}

/* ------------------------------------------
   Draw Body (thicker + “scale band”)
------------------------------------------ */

function drawBody(arr){
  for(let i=0;i<arr.length;i++){
    const p = arr[i];

    // thickness profile (more girth)
    const t = i/(arr.length-1);
    const size = (26 * (1-t)) + 10; // head-thick to tail-thin

    // body segment
    ctx.fillStyle = "rgba(10,60,30,0.92)";
    ctx.strokeStyle = "rgba(0,0,0,0.30)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, size, size*0.72, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // scale “hex hint” (alternating highlights)
    if(i % 2 === 0){
      ctx.fillStyle = "rgba(212,175,55,0.12)";
      ctx.beginPath();
      ctx.ellipse(p.x - size*0.10, p.y - size*0.10, size*0.32, size*0.22, 0, 0, Math.PI*2);
      ctx.fill();
    }
  }
}

/* ------------------------------------------
   Update Motion (slither, not violent wiggle)
------------------------------------------ */

function updateSpine(arr, yBase, dir){
  phase += 0.012; // slower phase advance

  const head = arr[0];
  head.x += speed * dir;
  head.y = yBase + Math.sin(phase)*amp;

  const w = window.innerWidth;
  if(dir > 0 && head.x > w + 260) head.x = -260;
  if(dir < 0 && head.x < -260) head.x = w + 260;

  for(let i=1;i<arr.length;i++){
    const prev = arr[i-1];
    const cur = arr[i];

    const dx = prev.x - cur.x;
    const dy = prev.y - cur.y;
    const dist = Math.max(0.0001, Math.sqrt(dx*dx + dy*dy));

    cur.x = prev.x - (dx/dist) * TARGET_DIST;
    cur.y = prev.y - (dy/dist) * TARGET_DIST;
  }
}

/* ------------------------------------------
   Render
------------------------------------------ */

function render(){
  ctx.clearRect(0,0,dragonCanvas.width,dragonCanvas.height);

  // Top dragon: right -> left
  updateSpine(spineTop, window.innerHeight*0.30, -1);
  drawBody(spineTop);
  drawHead(spineTop[0], -1);

  // Bottom dragon: right -> left (can be opposite later if desired)
  updateSpine(spineBot, window.innerHeight*0.72, -1);
  drawBody(spineBot);
  drawHead(spineBot[0], -1);

  requestAnimationFrame(render);
}

render();

})();
