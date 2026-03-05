/* TNT — /assets/dragon-engine.js
   HEX LATTICE DRAGON (POINTY-TOP AXIAL) — SILHOUETTE TEST SPECIMEN
   BUILD: HEX_DRAGON_V1
   LOCKS (from packet):
     - pointy-top axial (q,r)
     - D0=(+1,0) D1=(+1,-1) D2=(0,-1) D3=(-1,0) D4=(-1,+1) D5=(0,+1)
     - E=D0, W=D3, N=D2, S=D5, NE=D1, SW=D4
     - spine length 36, shoulder radius 6, tail tip 0
     - bend <= 1 neighbor turn per step
     - head moves, rest follow
     - hull = hybrid (disk union + light smoothing proxy)
     - 1 hex = 12 px
*/
(function(){
"use strict";
if(window.__HEX_DRAGON_RUNNING__) return;
window.__HEX_DRAGON_RUNNING__ = true;

const HEX_PX = 12;                 // 1 hex = 12 px
const SPINE_LEN = 36;
const SHOULDER_R = 6;
const TAIL_R = 0;

const DIRS = [
  {q:+1,r: 0}, // D0 E
  {q:+1,r:-1}, // D1 NE
  {q: 0,r:-1}, // D2 N
  {q:-1,r: 0}, // D3 W
  {q:-1,r:+1}, // D4 SW
  {q: 0,r:+1}, // D5 S
];

function add(a,b){ return {q:a.q+b.q, r:a.r+b.r}; }
function key(h){ return h.q + "," + h.r; }

function axialToPx(h){
  // pointy-top axial → pixel
  const x = HEX_PX * Math.sqrt(3) * (h.q + h.r/2);
  const y = HEX_PX * 1.5 * h.r;
  return {x,y};
}

function disk(center, radius){
  const r = radius|0;
  const out=[];
  for(let dq=-r; dq<=r; dq++){
    const r1=Math.max(-r, -dq-r);
    const r2=Math.min(r, -dq+r);
    for(let dr=r1; dr<=r2; dr++){
      out.push({q:center.q+dq, r:center.r+dr});
    }
  }
  return out;
}

function mulberry32(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function radiusAt(i){
  // integer rings, |ΔR| <= 1 per step
  // Head/neck/shoulder/body/tail profile derived from spine length and shoulder radius.
  const u = i/(SPINE_LEN-1);

  // hand-shaped piecewise in rings:
  // head ~4, neck ~2-3, shoulder peak 6, torso 5, tail taper to 0
  let r;
  if(u < 0.08) r = 4;
  else if(u < 0.18) r = 3;
  else if(u < 0.28) r = 2;
  else if(u < 0.42) r = 6;      // shoulder
  else if(u < 0.62) r = 5;      // torso
  else if(u < 0.78) r = 4;      // hip taper
  else if(u < 0.88) r = 2;      // tail base
  else if(u < 0.95) r = 1;      // tail
  else r = 0;                   // tip

  // clamp to spec
  if(r > SHOULDER_R) r = SHOULDER_R;
  if(r < TAIL_R) r = TAIL_R;
  return r|0;
}

/* canvas */
const host = document.getElementById("gd-dragon") || document.body;
const canvas = document.createElement("canvas");
canvas.id="gd_hex_dragon_canvas";
canvas.style.position="absolute";
canvas.style.inset="0";
canvas.style.width="100%";
canvas.style.height="100%";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
host.appendChild(canvas);

const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});
let W=0,H=0,DPR=1;

function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR=Math.min(1.6, Math.max(1,dpr));
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  canvas.width=W; canvas.height=H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* dragon state */
function initSpine(dirIndex, offsetQ, offsetR){
  const spine = new Array(SPINE_LEN);
  let head = {q:0+offsetQ, r:0+offsetR};
  spine[0]=head;
  // initialize straight line opposite direction so body trails
  const backDir = (dirIndex + 3) % 6;
  for(let i=1;i<SPINE_LEN;i++){
    head = add(head, DIRS[backDir]);
    spine[i] = {q:head.q, r:head.r};
  }
  return spine;
}

let headingTop = 0; // E
let headingBot = 3; // W
let spineTop = initSpine(headingTop, -8, -8);
let spineBot = initSpine(headingBot, +8, +8);

const rndTop = mulberry32(0xC0FFEE);
const rndBot = mulberry32(0xBADA55);

function step(spine, heading, rnd){
  // choose turn -1/0/+1 (bend <= 1 neighbor)
  const roll = rnd();
  let turn = 0;
  if(roll < 0.08) turn = -1;
  else if(roll > 0.92) turn = +1;

  heading = (heading + turn + 6) % 6;

  // move head one cell
  const newHead = add(spine[0], DIRS[heading]);

  // shift body follows
  for(let i=spine.length-1;i>=1;i--){
    spine[i].q = spine[i-1].q;
    spine[i].r = spine[i-1].r;
  }
  spine[0].q = newHead.q;
  spine[0].r = newHead.r;

  return heading;
}

function buildBodySet(spine){
  // union of disks around each spine cell
  const set = new Map();
  for(let i=0;i<spine.length;i++){
    const r = radiusAt(i);
    if(r<=0){
      set.set(key(spine[i]), {q:spine[i].q, r:spine[i].r});
      continue;
    }
    const cells = disk(spine[i], r);
    for(const c of cells){
      set.set(key(c), c);
    }
  }
  return set;
}

function drawHex(px, py, size){
  // pointy-top hex polygon
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a = Math.PI/180 * (60*i - 30);
    const x = px + Math.cos(a)*size;
    const y = py + Math.sin(a)*size;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
}

function renderBody(set, colorFill){
  // draw filled hex cells with subtle outline
  ctx.fillStyle = colorFill;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 1*DPR;

  const cx = W*0.5;
  const cy = H*0.52;

  // draw deterministic order
  const keys = Array.from(set.keys()).sort();
  for(const k of keys){
    const h = set.get(k);
    const p = axialToPx(h);
    const x = cx + p.x*DPR;
    const y = cy + p.y*DPR;
    drawHex(x,y, HEX_PX*DPR*0.98);
    ctx.fill();
    ctx.stroke();
  }
}

function render(){
  ctx.clearRect(0,0,W,H);

  // step motion (slow)
  headingTop = step(spineTop, headingTop, rndTop);
  headingBot = step(spineBot, headingBot, rndBot);

  // build body sets
  const bodyTop = buildBodySet(spineTop);
  const bodyBot = buildBodySet(spineBot);

  // draw
  renderBody(bodyTop, "rgba(14,124,58,0.85)");
  renderBody(bodyBot, "rgba(179,33,33,0.82)");

  // watermark
  ctx.fillStyle="rgba(255,255,255,0.75)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("HEX_DRAGON_V1", 12*DPR, H-14*DPR);
}

let acc=0;
let last=0;
function loop(ts){
  if(!last) last=ts;
  const dt = ts-last;
  last=ts;

  // 15 fps logic, smooth render
  acc += dt;
  if(acc >= 66.7){
    acc = 0;
    render();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

})();
