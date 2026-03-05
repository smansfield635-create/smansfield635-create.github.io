/* TNT — /assets/dragon-engine.js
   HEX DRAGON ENGINE (FILLED HEX CELLS) — SILHOUETTE PROOF
   BUILD: HEX_DRAGON_ENGINE_v2_HEX4

   CHANGE:
   - HEX_PX: 6 → 4 (smaller cells)

   LOCKED CANON (from your packet):
   - POINTY-TOP, AXIAL (q,r)
   - D0=(+1,0) D1=(+1,-1) D2=(0,-1) D3=(-1,0) D4=(-1,+1) D5=(0,+1)
   - World map: E=D0, W=D3, N=D2, S=D5, NE=D1, SW=D4
   - Spine length: 36
   - Max shoulder radius: 6 rings
   - Tail tip radius: 0
   - Max bend per step: 1 neighbor (turn -1/0/+1)
   - Update: head moves, rest follow
   - Silhouette: FILLED HEX CELLS (no boundary polygon)

   DESIGN:
   - Two dragons: mirror opposition
   - Random but harmonized (shared seeded RNG)
   - LOVE (jade) vs FEAR (crimson)
   - Horns separate later (NOT included)

   IMPORTANT FIX:
   - Prevent “corner clusters” by bounding + resetting the spine when it drifts offscreen.
*/

(function(){
"use strict";
if(window.__HEX_DRAGON_ENGINE_RUNNING__) return;
window.__HEX_DRAGON_ENGINE_RUNNING__ = true;

/* ====== TUNABLE (TEST) ====== */
const HEX_PX = 4;           // 1 hex = 4 px (smaller)
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
  const x = HEX_PX * Math.sqrt(3) * (h.q + h.r/2);
  const y = HEX_PX * 1.5 * h.r;
  return {x,y};
}

/* Hex disk */
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

/* ====== Radius profiles (rings) ====== */
function clampR(r){
  r = r|0;
  if(r > SHOULDER_R) r = SHOULDER_R;
  if(r < TAIL_R) r = TAIL_R;
  return r;
}

function radiusLove(i){
  const u = i/(SPINE_LEN-1);
  let r;
  if(u < 0.10) r = 4;
  else if(u < 0.22) r = 3;
  else if(u < 0.34) r = 5;
  else if(u < 0.48) r = 6;
  else if(u < 0.68) r = 5;
  else if(u < 0.82) r = 3;
  else if(u < 0.92) r = 2;
  else if(u < 0.97) r = 1;
  else r = 0;
  if(u >= 0.10 && u < 0.34 && r < 2) r = 2; // neck floor
  return clampR(r);
}

function radiusFear(i){
  const u = i/(SPINE_LEN-1);
  let r;
  if(u < 0.08) r = 5;
  else if(u < 0.18) r = 3;
  else if(u < 0.28) r = 2;
  else if(u < 0.44) r = 6;
  else if(u < 0.64) r = 5;
  else if(u < 0.80) r = 4;
  else if(u < 0.92) r = 2;
  else if(u < 0.97) r = 1;
  else r = 0;
  if(u >= 0.12 && u < 0.32 && r < 2) r = 2; // neck floor
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
    const a = (Math.PI/180) * (60*i - 30);
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

/* ====== Motion (bend <= 1 neighbor) ====== */
function stepSpine(spine, heading, rnd){
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

/* ====== Build body ====== */
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

/* ====== Render body ====== */
function renderBody(set, fill){
  const cx = W*0.5;
  const cy = H*0.52;

  ctx.fillStyle = fill;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 1*DPR;

  const size = HEX_PX*DPR*0.98;

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

/* ====== Mirror opposition ====== */
function mirrorSpine(spine){
  const out = new Array(SPINE_LEN);
  for(let i=0;i<SPINE_LEN;i++){
    out[i] = {q:-spine[i].q, r:-spine[i].r};
  }
  return out;
}

/* ====== Offscreen drift guard (prevents corner-only clusters) ====== */
function headOnscreen(spine){
  const p = axialToPx(spine[0]);
  const cx = (window.innerWidth||1)*0.5;
  const cy = (window.innerHeight||1)*0.52;
  const x = cx + p.x;
  const y = cy + p.y;
  const margin = 80; // css px
  return (x > -margin && x < (window.innerWidth||1)+margin && y > -margin && y < (window.innerHeight||1)+margin);
}

/* ====== State ====== */
const rnd = mulberry32(0xC0FFEE);
let heading = 0;

// start near center so bodies are visible immediately
let spineTop = initSpine(heading, {q:-6, r:-2});

function resetSpines(){
  heading = 0;
  spineTop = initSpine(heading, {q:-6, r:-2});
}

/* ====== Loop ====== */
let last=0, acc=0;

function loop(ts){
  if(!last) last=ts;
  const dt = ts - last;
  last = ts;

  acc += dt;

  if(acc >= 83){
    acc = 0;
    heading = stepSpine(spineTop, heading, rnd);

    // if head drifted offscreen, reset (prevents disappearing/corner clustering)
    if(!headOnscreen(spineTop)) resetSpines();
  }

  const spineBot = mirrorSpine(spineTop);

  ctx.clearRect(0,0,W,H);

  const bodyTop = buildBody(spineTop, radiusLove);
  const bodyBot = buildBody(spineBot, radiusFear);

  renderBody(bodyTop, "rgba(14,124,58,0.82)");
  renderBody(bodyBot, "rgba(179,33,33,0.78)");

  ctx.fillStyle="rgba(255,255,255,0.80)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("HEX_DRAGON_ENGINE_v2_HEX4", 12*DPR, H-14*DPR);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

})();
