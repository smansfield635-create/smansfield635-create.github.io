/* TNT — /assets/dragon-engine.js
   HEX DRAGON ENGINE (FILLED HEX CELLS) — SILHOUETTE PROOF
   BUILD: HEX_DRAGON_ENGINE_v1

   LOCKED CANON (from your packet):
   - POINTY-TOP, AXIAL (q,r)
   - D0=(+1,0) D1=(+1,-1) D2=(0,-1) D3=(-1,0) D4=(-1,+1) D5=(0,+1)
   - World map: E=D0, W=D3, N=D2, S=D5, NE=D1, SW=D4
   - Spine length: 36
   - Max shoulder radius: 6 rings
   - Tail tip radius: 0
   - Max bend per step: 1 neighbor (turn -1/0/+1)
   - Update: head moves, rest follow
   - Silhouette: FILLED HEX CELLS (no boundary polygon yet)

   DESIGN (per your latest):
   - Two dragons: mirror opposition
   - Random but harmonized (shared seeded RNG)
   - One friendlier (LOVE/prosperity), one scarier (FEAR/collapse)
   - Horns separate later (NOT included)
*/

(function(){
"use strict";
if(window.__HEX_DRAGON_ENGINE_RUNNING__) return;
window.__HEX_DRAGON_ENGINE_RUNNING__ = true;

/* ====== TUNABLE (you asked to try 6) ====== */
const HEX_PX = 6;           // 1 hex = 6 px (smaller = smoother)
const DPR_CAP = 1.6;

/* ====== LOCKED BASELINE ====== */
const SPINE_LEN = 36;
const SHOULDER_R = 6;
const TAIL_R = 0;

/* Canon axial direction order */
const DIRS = [
  {q:+1,r: 0}, // D0
  {q:+1,r:-1}, // D1
  {q: 0,r:-1}, // D2
  {q:-1,r: 0}, // D3
  {q:-1,r:+1}, // D4
  {q: 0,r:+1}  // D5
];

function add(a,b){ return {q:a.q+b.q, r:a.r+b.r}; }
function key(h){ return h.q + "," + h.r; }

/* Pointy-top axial -> pixel */
function axialToPx(h){
  // x = size*sqrt(3)*(q + r/2), y = size*3/2*r
  const x = HEX_PX * Math.sqrt(3) * (h.q + h.r/2);
  const y = HEX_PX * 1.5 * h.r;
  return {x,y};
}

/* Hex disk (union cells within radius) */
function disk(center, radius){
  const r = radius|0;
  const out=[];
  for(let dq=-r; dq<=r; dq++){
    const r1 = Math.max(-r, -dq-r);
    const r2 = Math.min(r, -dq+r);
    for(let dr=r1; dr<=r2; dr++){
      out.push({q:center.q+dq, r:center.r+dr});
    }
  }
  return out;
}

/* Deterministic RNG */
function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ====== Two radius profiles (rings) ======
   LOVE: smoother/rounder mass distribution
   FEAR: sharper neck pinch + heavier shoulder
   Both respect max=6 and tail=0.
*/
function clampR(r){
  r = r|0;
  if(r > SHOULDER_R) r = SHOULDER_R;
  if(r < TAIL_R) r = TAIL_R;
  return r;
}

function radiusLove(i){
  const u = i/(SPINE_LEN-1);

  let r;
  if(u < 0.10) r = 4;          // head
  else if(u < 0.22) r = 3;     // neck
  else if(u < 0.34) r = 5;     // shoulder build
  else if(u < 0.48) r = 6;     // shoulder peak
  else if(u < 0.68) r = 5;     // torso
  else if(u < 0.82) r = 3;     // taper
  else if(u < 0.92) r = 2;     // tail base
  else if(u < 0.97) r = 1;     // tail
  else r = 0;                  // tip

  // neck floor ≥2 (per stability spec)
  if(u >= 0.10 && u < 0.34 && r < 2) r = 2;

  return clampR(r);
}

function radiusFear(i){
  const u = i/(SPINE_LEN-1);

  let r;
  if(u < 0.08) r = 5;          // heavier head
  else if(u < 0.18) r = 3;     // neck start
  else if(u < 0.28) r = 2;     // sharper pinch
  else if(u < 0.44) r = 6;     // shoulder peak sooner
  else if(u < 0.64) r = 5;     // torso
  else if(u < 0.80) r = 4;     // taper
  else if(u < 0.92) r = 2;     // tail base
  else if(u < 0.97) r = 1;     // tail
  else r = 0;                  // tip

  // neck floor ≥2
  if(u >= 0.12 && u < 0.32 && r < 2) r = 2;

  return clampR(r);
}

/* ====== Canvas mount ====== */
const host = document.getElementById("gd-dragon") || document.body;
const cv = document.createElement("canvas");
cv.id = "gd_hex_dragon_canvas";
cv.style.position = "absolute";
cv.style.inset = "0";
cv.style.width = "100%";
cv.style.height = "100%";
cv.style.pointerEvents = "none";
cv.style.zIndex = "6";
host.appendChild(cv);

const ctx = cv.getContext("2d", {alpha:true, desynchronized:true});
let W=0,H=0,DPR=1;

function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1,dpr));
  W = Math.floor((window.innerWidth||1)*DPR);
  H = Math.floor((window.innerHeight||1)*DPR);
  cv.width=W; cv.height=H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ====== Hex drawing ====== */
function drawHex(x,y,size){
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a = (Math.PI/180) * (60*i - 30); // pointy-top
    const px = x + Math.cos(a)*size;
    const py = y + Math.sin(a)*size;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();
}

/* ====== Spine init ====== */
function initSpine(heading, start){
  const spine = new Array(SPINE_LEN);
  spine[0] = {q:start.q, r:start.r};

  const back = (heading + 3) % 6;
  for(let i=1;i<SPINE_LEN;i++){
    spine[i] = add(spine[i-1], DIRS[back]);
  }
  return spine;
}

/* ====== Motion: head moves, body follows; bend <= 1 ====== */
function stepSpine(spine, heading, rnd){
  // turn in {-1,0,+1}, rare turns for smooth slither
  const roll = rnd();
  let turn = 0;
  if(roll < 0.06) turn = -1;
  else if(roll > 0.94) turn = +1;

  heading = (heading + turn + 6) % 6;

  const newHead = add(spine[0], DIRS[heading]);

  for(let i=SPINE_LEN-1;i>=1;i--){
    spine[i].q = spine[i-1].q;
    spine[i].r = spine[i-1].r;
  }
  spine[0].q = newHead.q;
  spine[0].r = newHead.r;

  return heading;
}

/* ====== Build body cell sets ====== */
function buildBody(spine, radiusFn){
  const set = new Map();
  for(let i=0;i<SPINE_LEN;i++){
    const r = radiusFn(i);
    const cells = (r>0) ? disk(spine[i], r) : [spine[i]];
    for(const c of cells){
      set.set(key(c), c);
    }
  }
  return set;
}

/* ====== Render ====== */
function renderBody(set, fill){
  const cx = W*0.5;
  const cy = H*0.52;

  ctx.fillStyle = fill;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 1*DPR;

  const size = HEX_PX*DPR*0.98;

  // deterministic order for stability
  const keys = Array.from(set.keys()).sort();
  for(const kk of keys){
    const h = set.get(kk);
    const p = axialToPx(h);
    const x = cx + p.x*DPR;
    const y = cy + p.y*DPR;

    drawHex(x,y,size);
    ctx.fill();
    ctx.stroke();
  }
}

/* ====== Mirror opposition + harmonized randomness ====== */
const rnd = mulberry32(0xC0FFEE);     // shared seed (harmonized)
let heading = 0;                      // top starts E (D0)
let spineTop = initSpine(heading, {q:-10,r:-10});

function mirrorSpine(spine){
  const out = new Array(SPINE_LEN);
  for(let i=0;i<SPINE_LEN;i++){
    out[i] = {q:-spine[i].q, r:-spine[i].r};
  }
  return out;
}

/* ====== Loop ====== */
let last=0, acc=0;

function loop(ts){
  if(!last) last=ts;
  const dt = ts - last;
  last = ts;

  acc += dt;

  // logic at ~12 fps (stable); draw each frame
  if(acc >= 83){
    acc = 0;
    heading = stepSpine(spineTop, heading, rnd);
  }

  const spineBot = mirrorSpine(spineTop);

  ctx.clearRect(0,0,W,H);

  // Top = LOVE (jade)
  const bodyTop = buildBody(spineTop, radiusLove);
  renderBody(bodyTop, "rgba(14,124,58,0.82)");

  // Bottom = FEAR (crimson), mirrored opposition
  const bodyBot = buildBody(spineBot, radiusFear);
  renderBody(bodyBot, "rgba(179,33,33,0.78)");

  // watermark
  ctx.fillStyle="rgba(255,255,255,0.80)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("HEX_DRAGON_ENGINE_v1 (HEX=6)", 12*DPR, H-14*DPR);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

})();
