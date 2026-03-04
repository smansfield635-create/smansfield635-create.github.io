/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — v19 SKELETON RIG (NECK + JAW + HEAD SOLVER)
   VERSION: DRAGON_v19_SKELETON_RIG
   FULL FILE REPLACEMENT

   DELIVERS:
   - True neck chain (head/neck/body separation)
   - Head orientation solver (head points where neck points)
   - Jaw rig (open/close)
   - Whisker flow (trailing)
   - Horn dichotomy preserved:
       TOP = spiral horn (continuous curvature)
       BOTTOM = prong horn (directive)
   - Body mesh envelope (NOT circle stack): left/right edges → filled polygon
   - Hex scale lattice pass (lightweight, visible)
   - Wired lanes: consumes CSS vars --gd_laneTop/--gd_laneBot/--gd_noFlyTop/--gd_noFlyBot if present
   - Single canvas, single RAF, dt-based, mounts into #gd-dragon
   - Watermark proof on-canvas

   RULES:
   - NO new gd_* keys
   - NO external libs
*/
(function(){
"use strict";
if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = { version:"DRAGON_v19_SKELETON_RIG", mount:function(){} };

const DPR_CAP = 1.6;

/* ===== SIZE + MOTION ===== */
const SEG = 112;          // short body (≈40% shorter than earlier 170)
const GAP = 16;           // spacing between joints
const SPEED = 54;         // slow, weighty
const AMP = 9;            // calm slither
const WAVE = 1.20;        // wave frequency

/* rig landmarks (indices into spine) */
const I_HEAD = 0;
const I_NECK_END = 10;    // neck chain 0..10
const I_SHOULDER_END = 24;// shoulder region 10..24
const I_TAIL_START = 86;  // tail region

/* jaw */
const JAW_BASE = 0.06;    // radians
const JAW_SWING = 0.10;   // radians

/* ===== CANVAS ===== */
let canvas = document.getElementById("gd_dragon_canvas");
if(!canvas){
  canvas = document.createElement("canvas");
  canvas.id = "gd_dragon_canvas";
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  (document.getElementById("gd-dragon") || document.body).appendChild(canvas);
}
const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  let dpr=1; try{ dpr = window.devicePixelRatio || 1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1, dpr));
  W = Math.floor((window.innerWidth||1) * DPR);
  H = Math.floor((window.innerHeight||1) * DPR);
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ===== UTIL ===== */
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
function hypot(x,y){ return Math.hypot(x,y) || 1; }
function cssPx(name){
  try{
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    if(!v) return NaN;
    const n = parseFloat(String(v).trim());
    return Number.isFinite(n) ? n : NaN;
  }catch(e){ return NaN; }
}

/* ===== PALETTES ===== */
function palJade(){
  return {
    bodyA:"rgba(0,165,92,0.95)",
    bodyB:"rgba(0,82,50,0.95)",
    outline:"rgba(0,0,0,0.70)",
    gold:"rgba(212,175,55,0.99)",
    goldSoft:"rgba(212,175,55,0.26)",
    scale:"rgba(255,255,255,0.18)",
    scaleDark:"rgba(0,0,0,0.16)",
    belly:"rgba(0,0,0,0.22)"
  };
}
function palCrimson(){
  return {
    bodyA:"rgba(235,72,72,0.95)",
    bodyB:"rgba(120,18,22,0.95)",
    outline:"rgba(0,0,0,0.70)",
    gold:"rgba(212,175,55,0.99)",
    goldSoft:"rgba(212,175,55,0.26)",
    scale:"rgba(255,255,255,0.18)",
    scaleDark:"rgba(0,0,0,0.16)",
    belly:"rgba(0,0,0,0.22)"
  };
}

/* ===== DRAGONS ===== */
function makeDragon(isTop){
  const vh = window.innerHeight||1;
  const vw = window.innerWidth||1;
  return {
    top: isTop,
    dir: isTop ? 1 : -1,
    x: isTop ? -vw*0.18 : vw*1.18,     // CSS px
    yPx: (isTop ? 0.31 : 0.69) * vh,   // CSS px (wired)
    phase: Math.random()*10,
    pal: isTop ? palJade() : palCrimson(),
    spine: new Array(SEG)
  };
}
const TOP = makeDragon(true);
const BOT = makeDragon(false);

/* ===== WIRING (lanes) ===== */
function updateLanes(){
  const laneTop=cssPx("--gd_laneTop");
  const laneBot=cssPx("--gd_laneBot");
  const noFlyTop=cssPx("--gd_noFlyTop");
  const noFlyBot=cssPx("--gd_noFlyBot");

  const vh = window.innerHeight||1;
  let topPx = Number.isFinite(laneTop) ? laneTop : vh*0.31;
  let botPx = Number.isFinite(laneBot) ? laneBot : vh*0.69;

  if(Number.isFinite(noFlyTop)) topPx = Math.max(topPx, noFlyTop + 24);
  if(Number.isFinite(noFlyBot)) botPx = Math.min(botPx, noFlyBot - 24);

  topPx = clamp(topPx, vh*0.20, vh*0.48);
  botPx = clamp(botPx, vh*0.52, vh*0.88);

  TOP.yPx += (topPx - TOP.yPx) * 0.12;
  BOT.yPx += (botPx - BOT.yPx) * 0.12;
}

/* ===== SKELETON (spine) ===== */
function buildSpine(dr, t, dt){
  // x in CSS px (do NOT multiply by DPR); convert once for canvas
  dr.x += dr.dir * SPEED * dt;

  const vw = window.innerWidth||1;
  const margin = vw*0.40;
  if(dr.dir>0 && dr.x > vw + margin) dr.x = -margin;
  if(dr.dir<0 && dr.x < -margin) dr.x = vw + margin;

  const baseY = (dr.yPx || (window.innerHeight||1)*0.5) * DPR;
  const sign = dr.top ? 1 : -1;

  // head leads; body follows with phase delay
  const headX = (dr.x * DPR);
  const headY = baseY + Math.sin(t*WAVE + dr.phase) * (AMP*DPR) * sign;

  dr.spine[0] = {x: headX, y: headY};

  const gap = GAP * DPR;
  for(let i=1;i<SEG;i++){
    const prev = dr.spine[i-1];

    // smooth serpentine: introduce slight lagged vertical target
    const targetY = baseY + Math.sin(t*WAVE + dr.phase - i*0.12) * (AMP*DPR) * sign;

    // desired location behind prev
    const candX = prev.x - dr.dir*gap;
    const candY = targetY;

    let dx = prev.x - candX;
    let dy = prev.y - candY;
    let d = hypot(dx,dy);

    dr.spine[i] = {
      x: prev.x - (dx/d)*gap,
      y: prev.y - (dy/d)*gap
    };
  }
}

function tangent(sp,i){
  const a = sp[Math.max(0,i-1)];
  const b = sp[Math.min(sp.length-1,i+1)];
  let dx=b.x-a.x, dy=b.y-a.y, d=hypot(dx,dy);
  return {x:dx/d, y:dy/d};
}
function normal(sp,i){
  const t = tangent(sp,i);
  return {x:-t.y, y:t.x};
}

/* ===== BODY PROFILE (neck + shoulder) ===== */
function radiusAt(i){
  const u = i/(SEG-1);

  // tail taper
  const tail = (u < 0.78) ? 1.00 : lerp(1.00, 0.14, (u-0.78)/0.22);

  // head fullness
  const head = (u < 0.07) ? lerp(1.18, 1.00, u/0.07) : 1.00;

  // neck dip (narrow)
  let neck = 1.0;
  if(u>=0.07 && u<0.18){
    const t=(u-0.07)/0.11;
    neck = lerp(0.74, 0.60, t);
  }

  // shoulder expansion (wide)
  let shoulder = 1.06;
  if(u>=0.18 && u<0.34){
    const t=(u-0.18)/0.16;
    shoulder = 1.06 + 0.34*Math.sin(Math.PI*t); // peak around 1.40
  }

  const base = (BODY_W*0.5) * DPR;
  return base * tail * head * neck * shoulder;
}

/* ===== BODY MESH (envelope) ===== */
function drawBodyMesh(dr){
  const sp = dr.spine;
  const L = [];
  const R = [];

  for(let i=0;i<sp.length;i++){
    const n = normal(sp,i);
    const r = radiusAt(i);

    L.push({x: sp[i].x + n.x*r, y: sp[i].y + n.y*r});
    R.push({x: sp[i].x - n.x*r, y: sp[i].y - n.y*r});
  }

  // fill gradient
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.bodyA);
  g.addColorStop(0.55, dr.pal.bodyB);
  g.addColorStop(1.00, dr.pal.bodyB);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(L[0].x, L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x, L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x, R[i].y);
  ctx.closePath();

  ctx.fillStyle = g;
  ctx.fill();

  // outline
  ctx.strokeStyle = dr.pal.outline;
  ctx.lineWidth = 3.4*DPR;
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.stroke();

  // belly shading band
  ctx.globalCompositeOperation="multiply";
  ctx.strokeStyle = dr.pal.belly;
  ctx.lineWidth = 12*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=2){
    const n = normal(sp,i);
    const r = radiusAt(i);
    ctx.lineTo(sp[i].x - n.x*(r*0.42), sp[i].y - n.y*(r*0.42));
  }
  ctx.stroke();

  ctx.restore();
}

/* ===== HEX SCALES (lightweight) ===== */
function drawHexScales(dr){
  const sp = dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle = dr.pal.scale;
  ctx.lineWidth = 1.0*DPR;

  function hex(cx,cy,s){
    const a=Math.PI/3;
    ctx.beginPath();
    for(let k=0;k<6;k++){
      const x=cx + Math.cos(a*k)*s;
      const y=cy + Math.sin(a*k)*s;
      if(k===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  for(let i=10;i<sp.length-16;i+=5){
    const p=sp[i];
    const t=tangent(sp,i);
    const n=normal(sp,i);
    const r=radiusAt(i);

    const s=Math.max(5.6*DPR, r*0.12);
    const rows=[0.20,-0.04];

    for(let rr=0; rr<rows.length; rr++){
      const off=rows[rr];
      const cx=p.x + n.x*(r*off);
      const cy=p.y + n.y*(r*off);
      const jitter=((i+rr)%2===0)?(s*0.42):0;
      hex(cx + t.x*jitter, cy + t.y*jitter, s);
    }
  }

  // subtle dark lattice for depth
  ctx.strokeStyle = dr.pal.scaleDark;
  for(let i=14;i<sp.length-18;i+=9){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    hex(p.x + n.x*(r*0.05), p.y + n.y*(r*0.05), Math.max(4.4*DPR,r*0.09));
  }

  ctx.restore();
}

/* ===== HEAD SOLVER + RIG ===== */
function headPose(dr){
  const sp = dr.spine;
  const head = sp[I_HEAD];
  const neck = sp[Math.min(I_NECK_END, sp.length-1)];

  const dx = head.x - neck.x;
  const dy = head.y - neck.y;
  const ang = Math.atan2(dy, dx); // points from neck to head

  return {x: head.x, y: head.y, ang: ang};
}

/* horns */
function drawSpiralHorn(x,y,att){
  ctx.strokeStyle="rgba(212,175,55,0.92)";
  ctx.lineWidth=3.2*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  const loops=2.3, step=0.28;
  for(let a=0; a<loops*Math.PI*2; a+=step){
    const rr=(1.0 - a/(loops*Math.PI*2))*(14*DPR);
    const px=x + Math.cos(a)*rr;
    const py=y + Math.sin(a)*rr*att;
    if(a===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.stroke();
}
function drawProngHorn(x,y,att){
  ctx.strokeStyle="rgba(212,175,55,0.92)";
  ctx.lineWidth=3.2*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x + 22*DPR, y + 10*DPR*att);
  ctx.moveTo(x + 22*DPR, y + 10*DPR*att);
  ctx.lineTo(x + 28*DPR, y + 4*DPR*att);
  ctx.moveTo(x + 22*DPR, y + 10*DPR*att);
  ctx.lineTo(x + 28*DPR, y + 16*DPR*att);
  ctx.stroke();
}

/* head draw */
function drawHead(dr, t){
  const P = headPose(dr);
  const s = radiusAt(0) * 0.95;

  // mouth open/close
  const gape = JAW_BASE + JAW_SWING*Math.max(0, Math.sin(t*1.8 + dr.phase));

  // whisker lag (trailing)
  const wlag = 0.12*Math.sin(t*1.3 + dr.phase*0.7);

  ctx.save();
  ctx.translate(P.x, P.y);
  ctx.rotate(P.ang);
  if(dr.dir < 0) ctx.scale(-1,1);

  // horn attitude: top = up/toward, bottom = down/away
  const att = dr.top ? -1 : 1;

  // horns dichotomy
  if(dr.top){
    drawSpiralHorn(-s*0.85, -s*0.55, att);
  }else{
    drawProngHorn(-s*0.80, -s*0.45, att);
  }

  // skull
  ctx.fillStyle="rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.ellipse(-s*0.22, 0, s*1.00, s*0.62, 0, 0, Math.PI*2);
  ctx.fill();

  // snout wedge (not koi)
  const snG=ctx.createLinearGradient(0,0,s*2.8,0);
  snG.addColorStop(0.0, dr.pal.bodyA);
  snG.addColorStop(1.0, dr.pal.bodyB);
  ctx.fillStyle=snG;
  ctx.beginPath();
  ctx.moveTo(-s*0.10, -s*0.18);
  ctx.quadraticCurveTo(s*0.95, -s*0.32, s*2.35, -s*0.10);
  ctx.quadraticCurveTo(s*1.35,  s*0.04, s*0.05,  s*0.14);
  ctx.closePath();
  ctx.fill();

  // nostrils
  ctx.fillStyle="rgba(0,0,0,0.42)";
  ctx.beginPath(); ctx.arc(s*2.10, -s*0.03, s*0.10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*1.95,  s*0.08, s*0.08, 0, Math.PI*2); ctx.fill();

  // jaw rig (hinged)
  ctx.save();
  ctx.translate(s*0.30, s*0.16);
  ctx.rotate(gape);
  ctx.translate(-s*0.30, -s*0.16);
  ctx.fillStyle="rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.moveTo(s*0.10, s*0.18);
  ctx.quadraticCurveTo(s*0.92, s*0.64, s*2.20, s*0.18);
  ctx.quadraticCurveTo(s*1.05, s*0.80, s*0.18, s*0.48);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // eye (slit glow)
  ctx.fillStyle=dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.20, -s*0.10, s*0.16, s*0.10, 0.10, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.70)";
  ctx.beginPath();
  ctx.ellipse(s*0.26, -s*0.10, s*0.05, s*0.14, 0.0, 0, Math.PI*2);
  ctx.fill();

  // whiskers (uniform direction)
  ctx.strokeStyle="rgba(212,175,55,0.66)";
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.10, 0);
  ctx.quadraticCurveTo(s*2.00, -s*(0.52 + wlag), s*3.00, -s*(0.80 + wlag));
  ctx.stroke();

  // neck drop hint line (keeps “neck” visible)
  ctx.strokeStyle="rgba(0,0,0,0.28)";
  ctx.lineWidth=2.0*DPR;
  ctx.beginPath();
  ctx.moveTo(-s*0.42, s*0.10);
  ctx.quadraticCurveTo(-s*0.62, s*0.82, -s*0.18, s*1.12);
  ctx.stroke();

  // outline
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.ellipse(-s*0.22, 0, s*1.00, s*0.62, 0, 0, Math.PI*2);
  ctx.stroke();

  ctx.restore();
}

/* ===== WATERMARK ===== */
function watermark(){
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(16*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_v19_SKELETON_RIG", 12*DPR, (H-14*DPR));
  ctx.restore();
}

/* ===== LOOP ===== */
let last=0;
function frame(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;
  const t=ts/1000;

  updateLanes();

  ctx.clearRect(0,0,W,H);

  buildSpine(TOP,t,dt);
  drawBodyMesh(TOP);
  drawHexScales(TOP);
  drawHead(TOP,t);

  buildSpine(BOT,t,dt);
  drawBodyMesh(BOT);
  drawHexScales(BOT);
  drawHead(BOT,t);

  watermark();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
