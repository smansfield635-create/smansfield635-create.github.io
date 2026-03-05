/* TNT — /assets/dragon-engine.js
   HEX SILHOUETTE (FILLED HEX CELLS) — PROOF-FIRST
   BUILD: HEX_SILHOUETTE_PROOF_v1

   DOES:
   - Draws TWO dragons as FILLED POINTY-TOP HEX CELLS (no smoothing, no boundary)
   - Uses your canon axial directions and mapping
   - Head moves, body follows; bend <= 1 neighbor turn per step
   - Random-but-harmonized: same noise, mirrored opposition (top vs bottom)

   INPUTS LOCKED (from your packet):
   - Pointy-top axial (q,r)
   - D0=(+1,0) D1=(+1,-1) D2=(0,-1) D3=(-1,0) D4=(-1,+1) D5=(0,+1)
   - Spine length 36
   - Shoulder radius 6 (rings)
   - Tail tip radius 0
   - 1 hex = 6 px (per your latest request)
*/

(function(){
"use strict";
if(window.__HEX_SIL_RUNNING__) return;
window.__HEX_SIL_RUNNING__ = true;

/* ====== LOCKED PARAMS ====== */
const HEX = 6;                 // 1 hex = 6 px
const SPINE_LEN = 36;
const SHOULDER_R = 6;
const TAIL_R = 0;

// Canon directions (axial q,r)
const DIRS = [
  {q:+1,r: 0}, // D0
  {q:+1,r:-1}, // D1
  {q: 0,r:-1}, // D2
  {q:-1,r: 0}, // D3
  {q:-1,r:+1}, // D4
  {q: 0,r:+1}, // D5
];

function add(a,b){ return {q:a.q+b.q, r:a.r+b.r}; }
function k(a){ return a.q + "," + a.r; }

/* ====== Pointy-top axial -> pixel ====== */
function axialToPx(h){
  // pointy-top axial layout
  const x = HEX * Math.sqrt(3) * (h.q + h.r/2);
  const y = HEX * 1.5 * h.r;
  return {x,y};
}

/* ====== Hex disk (all cells within radius rings) ====== */
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

/* ====== Deterministic RNG ====== */
function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ====== Radius profile in integer rings (|ΔR| <= 1-ish) ====== */
function radiusAt(i){
  const u = i/(SPINE_LEN-1);

  // Simple dragon-ish mass profile in rings:
  // head 4, neck 2-3, shoulder 6, torso 5, tail to 0
  let r;
  if(u < 0.08) r = 4;                // head mass
  else if(u < 0.18) r = 3;           // neck
  else if(u < 0.28) r = 2;           // neck pinch
  else if(u < 0.42) r = 6;           // shoulder peak
  else if(u < 0.62) r = 5;           // torso
  else if(u < 0.78) r = 4;           // taper
  else if(u < 0.88) r = 2;           // tail base
  else if(u < 0.95) r = 1;           // tail
  else r = 0;                        // tip

  if(r > SHOULDER_R) r = SHOULDER_R;
  if(r < TAIL_R) r = TAIL_R;
  return r|0;
}

/* ====== Canvas ====== */
const host = document.getElementById("gd-dragon") || document.body;
const cv = document.createElement("canvas");
cv.id = "gd_hex_sil_canvas";
cv.style.position="absolute";
cv.style.inset="0";
cv.style.width="100%";
cv.style.height="100%";
cv.style.pointerEvents="none";
cv.style.zIndex="6";
host.appendChild(cv);

const ctx = cv.getContext("2d", {alpha:true, desynchronized:true});
let W=0,H=0,DPR=1;

function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR = Math.min(1.6, Math.max(1,dpr));
  W = Math.floor((window.innerWidth||1)*DPR);
  H = Math.floor((window.innerHeight||1)*DPR);
  cv.width=W; cv.height=H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ====== Spine init (continuous axial path) ====== */
function initSpine(heading, offset){
  const spine = new Array(SPINE_LEN);
  spine[0] = {q:offset.q, r:offset.r};
  const back = (heading + 3) % 6;
  for(let i=1;i<SPINE_LEN;i++){
    spine[i] = add(spine[i-1], DIRS[back]);
  }
  return spine;
}

/* ====== Motion (bend <= 1 neighbor turn; head moves; body follows) ====== */
function stepSpine(spine, heading, rnd){
  // turn ∈ {-1,0,+1}, rare turns for smoothness
  const roll = rnd();
  let turn = 0;
  if(roll < 0.06) turn = -1;
  else if(roll > 0.94) turn = +1;

  heading = (heading + turn + 6) % 6;

  const newHead = add(spine[0], DIRS[heading]);

  // follow
  for(let i=SPINE_LEN-1;i>=1;i--){
    spine[i].q = spine[i-1].q;
    spine[i].r = spine[i-1].r;
  }
  spine[0].q = newHead.q;
  spine[0].r = newHead.r;

  return heading;
}

/* ====== Body mass cells = union of disks ====== */
function buildBody(spine){
  const set = new Map();
  for(let i=0;i<SPINE_LEN;i++){
    const r = radiusAt(i);
    const cells = (r>0) ? disk(spine[i], r) : [spine[i]];
    for(const c of cells){
      set.set(k(c), c);
    }
  }
  return set;
}

/* ====== Draw hex ====== */
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

function renderBody(set, fill){
  const cx = (W*0.5);
  const cy = (H*0.52);

  ctx.fillStyle = fill;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 1*DPR;

  const keys = Array.from(set.keys()).sort();
  const size = HEX*DPR*0.98;

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
let headingTop = 0; // start E (D0)
let headingBot = 3; // start W (D3)
const rnd = mulberry32(0xC0FFEE); // one RNG shared (harmonized)

let spineTop = initSpine(headingTop, {q:-10,r:-10});
let spineBot = initSpine(headingBot, {q:+10,r:+10});

/* ====== Loop ====== */
let last=0, acc=0;
function loop(ts){
  if(!last) last = ts;
  const dt = ts - last;
  last = ts;

  acc += dt;

  // logic at ~12fps for stability; render every frame
  if(acc >= 83){
    acc = 0;

    // top moves with headingTop; bottom mirrors with opposite heading + mirrored turns (shared RNG)
    headingTop = stepSpine(spineTop, headingTop, rnd);

    // mirror: opposite heading, same magnitude turn implicitly by using same RNG and starting opposite
    headingBot = (headingTop + 3) % 6;
    // advance bottom one step in its own direction (body follows)
    const newHead = add(spineBot[0], DIRS[headingBot]);
    for(let i=SPINE_LEN-1;i>=1;i--){
      spineBot[i].q = spineBot[i-1].q;
      spineBot[i].r = spineBot[i-1].r;
    }
    spineBot[0].q = newHead.q;
    spineBot[0].r = newHead.r;
  }

  ctx.clearRect(0,0,W,H);

  const bodyTop = buildBody(spineTop);
  const bodyBot = buildBody(spineBot);

  renderBody(bodyTop, "rgba(14,124,58,0.82)");   // love/prosperity (jade)
  renderBody(bodyBot, "rgba(179,33,33,0.78)");   // fear/collapse (crimson)

  // watermark so you can confirm this build is running
  ctx.fillStyle="rgba(255,255,255,0.80)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("HEX_SILHOUETTE_PROOF_v1 (HEX=6)", 12*DPR, H-14*DPR);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

})();
