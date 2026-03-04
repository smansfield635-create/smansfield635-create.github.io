/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — NECK + DICHOTOMY HORNS (SPIRAL vs PRONG)
   VERSION: DRAGON_v18_NECK_DICHOTOMY

   DECISIONS (LOCKED IN THIS FILE):
   - Best geometry fit: SPIRAL horn (continuous curvature) → TOP dragon
   - Opposite dichotomy: PRONG horn (directive angular) → BOTTOM dragon
   - Uniform everything else: head profile, jaw, whiskers, neck/shoulder/body rules

   FIXES:
   - Adds a TRUE NECK: neck dip (narrow) then shoulder expansion (wide) before main body
   - Head silhouette matches your bottom doodle: wedge snout + skull + neck drop

   KEEPS:
   - Wired lanes from index CSS vars
   - Short body (~40% shorter)
   - Slower speed
   - Hex scale lattice + crest + belly plates
*/
(function(){
"use strict";
if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = { version:"DRAGON_v18_NECK_DICHOTOMY", mount:function(){} };

const DPR_CAP=1.6;

/* SCALE */
const BODY_W=81;
const BODY_R=BODY_W*0.5;

/* MOTION */
const SEG=104;      // short body
const GAP=16;
const SPEED=56;     // slow
const AMP=10;
const SWIV=8;

/* HEAD SWIVEL */
const YAW_MAX=0.24;
const YAW_RATE=4.0;

/* CANVAS */
let canvas=document.getElementById("gd_dragon_canvas");
if(!canvas){
  canvas=document.createElement("canvas");
  canvas.id="gd_dragon_canvas";
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.style.pointerEvents="none";
  (document.getElementById("gd-dragon")||document.body).appendChild(canvas);
}
const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});

let W=0,H=0,DPR=1;
function resize(){
  let dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
  DPR=Math.min(DPR_CAP,Math.max(1,dpr));
  W=Math.floor((window.innerWidth||1)*DPR);
  H=Math.floor((window.innerHeight||1)*DPR);
  canvas.width=W; canvas.height=H;
}
resize();
window.addEventListener("resize",resize,{passive:true});

/* UTIL */
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function hypot(x,y){return Math.hypot(x,y)||1;}
function cssPx(name){
  try{
    const v=getComputedStyle(document.documentElement).getPropertyValue(name);
    if(!v) return NaN;
    const n=parseFloat(String(v).trim());
    return Number.isFinite(n)?n:NaN;
  }catch(e){ return NaN; }
}

/* PALETTES */
function palJade(){
  return {
    a:"rgba(0,165,92,0.95)",
    b:"rgba(0,82,50,0.95)",
    outline:"rgba(0,0,0,0.70)",
    gold:"rgba(212,175,55,0.99)",
    goldSoft:"rgba(212,175,55,0.26)",
    belly:"rgba(0,0,0,0.24)",
    scale:"rgba(255,255,255,0.18)",
    scaleDark:"rgba(0,0,0,0.16)"
  };
}
function palCrimson(){
  return {
    a:"rgba(235,72,72,0.95)",
    b:"rgba(120,18,22,0.95)",
    outline:"rgba(0,0,0,0.70)",
    gold:"rgba(212,175,55,0.99)",
    goldSoft:"rgba(212,175,55,0.26)",
    belly:"rgba(0,0,0,0.24)",
    scale:"rgba(255,255,255,0.18)",
    scaleDark:"rgba(0,0,0,0.16)"
  };
}

/* DRAGON */
function makeDragon(isTop){
  const vh=window.innerHeight||1;
  const vw=window.innerWidth||1;
  return {
    top:isTop,
    dir:isTop?1:-1,
    yPx:(isTop?0.31:0.69)*vh,
    x:isTop?-vw*0.22:vw*1.22,
    phase:Math.random()*10,
    spine:new Array(SEG),
    pal:isTop?palJade():palCrimson(),
    yaw:0,
    yawT:0
  };
}
const TOP=makeDragon(true);   // spiral horn
const BOT=makeDragon(false);  // prong horn

/* GEOMETRY */
function tangent(sp,i){
  const p0=sp[Math.max(0,i-1)];
  const p1=sp[Math.min(sp.length-1,i+1)];
  let dx=p1.x-p0.x, dy=p1.y-p0.y, d=hypot(dx,dy);
  return {x:dx/d,y:dy/d};
}
function normal(sp,i){
  const t=tangent(sp,i);
  return {x:-t.y,y:t.x};
}

/* TRUE NECK PROFILE (fish-killer)
   u in [0,1]
   - head: fuller
   - neck dip: narrow
   - shoulder expansion: wide
   - main body: stable
   - tail: taper
*/
function radiusAt(i){
  const u=i/(SEG-1);

  // tail taper
  const tail=(u<0.78)?1.0:lerp(1.0,0.12,(u-0.78)/0.22);

  // head fullness
  const head=(u<0.07)?lerp(1.18,1.00,u/0.07):1.00;

  // neck dip (0.07 → 0.18)
  let neck=1.0;
  if(u>=0.07 && u<0.18){
    const t=(u-0.07)/0.11;
    neck = lerp(0.72, 0.60, t);     // narrow down
  }

  // shoulder expansion (0.18 → 0.34)
  let shoulder=1.0;
  if(u>=0.18 && u<0.34){
    const t=(u-0.18)/0.16;
    shoulder = lerp(1.10, 1.32, Math.sin(Math.PI*t)); // bulge then settle
  } else if(u>=0.34){
    shoulder = 1.06; // main body baseline
  }

  const mult = tail * head * neck * shoulder;
  return BODY_R * mult * DPR;
}

/* WIRED LANES */
function updateLanePx(){
  const laneTop=cssPx("--gd_laneTop");
  const laneBot=cssPx("--gd_laneBot");
  const noFlyTop=cssPx("--gd_noFlyTop");
  const noFlyBot=cssPx("--gd_noFlyBot");

  const vh=window.innerHeight||1;
  let topPx=Number.isFinite(laneTop)?laneTop:vh*0.31;
  let botPx=Number.isFinite(laneBot)?laneBot:vh*0.69;

  if(Number.isFinite(noFlyTop)) topPx=Math.max(topPx,noFlyTop+24);
  if(Number.isFinite(noFlyBot)) botPx=Math.min(botPx,noFlyBot-24);

  topPx=clamp(topPx,vh*0.20,vh*0.48);
  botPx=clamp(botPx,vh*0.52,vh*0.88);

  TOP.yPx = TOP.yPx + (topPx - TOP.yPx)*0.12;
  BOT.yPx = BOT.yPx + (botPx - BOT.yPx)*0.12;
}

/* BUILD SPINE (x in CSS px) */
function build(dr,t,dt){
  const gap=GAP*DPR, amp=AMP*DPR, sw=SWIV*DPR;

  dr.x += dr.dir*SPEED*dt;

  const vw=window.innerWidth||1;
  const margin=vw*0.45;
  if(dr.dir>0 && dr.x>vw+margin) dr.x=-margin;
  if(dr.dir<0 && dr.x<-margin) dr.x=vw+margin;

  const sign=dr.top?1:-1;
  const baseY=(dr.yPx||((dr.top?0.31:0.69)*(window.innerHeight||1))) * DPR;

  const headX=(dr.x*DPR) + Math.sin(t*0.90 + dr.phase)*sw*sign;
  const headY=baseY + Math.sin(t*1.35 + dr.phase)*amp*sign;

  dr.spine[0]={x:headX,y:headY};

  for(let i=1;i<SEG;i++){
    const prev=dr.spine[i-1];
    const candX=prev.x - dr.dir*gap;
    const candY=baseY + Math.sin(t*1.35 + dr.phase - i*0.095)*amp*sign;
    let dx=prev.x-candX, dy=prev.y-candY, d=hypot(dx,dy);
    dr.spine[i]={x:prev.x-(dx/d)*gap, y:prev.y-(dy/d)*gap};
  }

  const t0=tangent(dr.spine,0);
  const t6=tangent(dr.spine,Math.min(6,SEG-1));
  const curv=(t6.y*t0.x - t6.x*t0.y);
  dr.yawT = clamp(curv*0.9 + Math.sin(t*0.75 + dr.phase)*0.06, -YAW_MAX, YAW_MAX);
  dr.yaw += (dr.yawT - dr.yaw) * clamp(YAW_RATE*dt, 0, 1);
}

/* DRAW — BODY */
function drawSegmentedSilhouette(dr){
  const sp=dr.spine;
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.a);
  g.addColorStop(0.55, dr.pal.b);
  g.addColorStop(1.00, dr.pal.b);

  ctx.save();
  ctx.fillStyle=g;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=2){
    const p=sp[i], r=radiusAt(i);
    ctx.moveTo(p.x+r,p.y);
    ctx.arc(p.x,p.y,r,0,Math.PI*2);
  }
  ctx.fill("nonzero");

  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=3.6*DPR;
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.stroke();

  ctx.globalCompositeOperation="multiply";
  ctx.strokeStyle=dr.pal.belly;
  ctx.lineWidth=12*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=3){
    const n=normal(sp,i), r=radiusAt(i);
    ctx.lineTo(sp[i].x - n.x*(r*0.44), sp[i].y - n.y*(r*0.44));
  }
  ctx.stroke();

  ctx.restore();
}

function drawHexScales(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle=dr.pal.scale;
  ctx.lineWidth=1.0*DPR;

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

  for(let i=10;i<sp.length-18;i+=5){
    const p=sp[i], t=tangent(sp,i), n=normal(sp,i), r=radiusAt(i);
    const s=Math.max(6.0*DPR, r*0.12);
    const rows=[0.20,-0.05];
    for(let rr=0; rr<rows.length; rr++){
      const off=rows[rr];
      const cx=p.x + n.x*(r*off);
      const cy=p.y + n.y*(r*off);
      const jitter=((i+rr)%2===0)?(s*0.42):0;
      hex(cx + t.x*jitter, cy + t.y*jitter, s);
    }
  }

  ctx.strokeStyle=dr.pal.scaleDark;
  for(let i=14;i<sp.length-22;i+=9){
    const p=sp[i], n=normal(sp,i), r=radiusAt(i);
    hex(p.x + n.x*(r*0.05), p.y + n.y*(r*0.05), Math.max(4.6*DPR,r*0.09));
  }
  ctx.restore();
}

function drawBellyPlates(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.10)";
  ctx.lineWidth=1.3*DPR;
  for(let i=12;i<sp.length-18;i+=8){
    const p=sp[i], n=normal(sp,i), r=radiusAt(i);
    const bx=p.x - n.x*(r*0.62);
    const by=p.y - n.y*(r*0.62);
    const w=Math.max(7*DPR,r*0.26);
    const h=Math.max(3*DPR,r*0.12);
    ctx.beginPath();
    ctx.ellipse(bx,by,w,h,0,0.12,Math.PI-0.12);
    ctx.stroke();
  }
  ctx.restore();
}

/* HORNS */
function drawSpiralHorn(x,y,dir,att){
  ctx.strokeStyle="rgba(212,175,55,0.92)";
  ctx.lineWidth=3.2*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  const loops=2.3, step=0.28;
  for(let a=0; a<loops*Math.PI*2; a+=step){
    const rr=(1.0 - a/(loops*Math.PI*2))*(14*DPR);
    const px=x + Math.cos(a)*rr*dir;
    const py=y + Math.sin(a)*rr*att;
    if(a===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.stroke();
}
function drawProngHorn(x,y,dir,att){
  ctx.strokeStyle="rgba(212,175,55,0.92)";
  ctx.lineWidth=3.2*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x + 22*DPR*dir, y + 10*DPR*att);
  ctx.moveTo(x + 22*DPR*dir, y + 10*DPR*att);
  ctx.lineTo(x + 28*DPR*dir, y + 4*DPR*att);
  ctx.moveTo(x + 22*DPR*dir, y + 10*DPR*att);
  ctx.lineTo(x + 28*DPR*dir, y + 16*DPR*att);
  ctx.stroke();
}

/* HEAD — doodle silhouette: wedge snout + skull + neck drop */
function drawHeadDragon(dr, t){
  const sp=dr.spine;
  const p=sp[0];
  const tv=tangent(sp,0);
  const ang=Math.atan2(tv.y,tv.x) + dr.yaw;
  const s=radiusAt(0)*1.02;

  const gape=0.10 + 0.05*Math.sin(t*2.0 + dr.phase);
  const wlag=0.12*Math.sin(t*1.3 + dr.phase*0.7);

  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(ang);
  if(dr.dir<0) ctx.scale(-1,1);

  // Horn dichotomy
  if(dr.top){
    // TOP: spiral (best geometry)
    drawSpiralHorn(-s*0.75, -s*0.45, 1, -1);
  }else{
    // BOTTOM: prong (opposite)
    drawProngHorn(-s*0.65, -s*0.35, 1, 1);
  }

  // Skull (less oval, pushed back)
  ctx.fillStyle="rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.ellipse(-s*0.22, 0, s*0.95, s*0.58, 0, 0, Math.PI*2);
  ctx.fill();

  // Snout wedge (your doodle)
  const snG=ctx.createLinearGradient(0,0,s*2.8,0);
  snG.addColorStop(0.0, dr.pal.a);
  snG.addColorStop(1.0, dr.pal.b);
  ctx.fillStyle=snG;
  ctx.beginPath();
  ctx.moveTo(-s*0.10, -s*0.18);
  ctx.quadraticCurveTo(s*0.95, -s*0.28, s*2.35, -s*0.10);
  ctx.quadraticCurveTo(s*1.35,  s*0.04, s*0.05,  s*0.14);
  ctx.closePath();
  ctx.fill();

  // Neck drop line (forces “neck” visually)
  ctx.strokeStyle="rgba(0,0,0,0.35)";
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.moveTo(-s*0.38, s*0.10);
  ctx.quadraticCurveTo(-s*0.60, s*0.78, -s*0.22, s*1.08);
  ctx.stroke();

  // Jaw (hinged)
  ctx.save();
  ctx.translate(s*0.30, s*0.16);
  ctx.rotate(gape);
  ctx.translate(-s*0.30, -s*0.16);
  ctx.fillStyle="rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.moveTo(s*0.10, s*0.18);
  ctx.quadraticCurveTo(s*0.92, s*0.62, s*2.20, s*0.18);
  ctx.quadraticCurveTo(s*1.05, s*0.78, s*0.18, s*0.48);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Eye
  ctx.fillStyle=dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.20, -s*0.10, s*0.16, s*0.10, 0.10, 0, Math.PI*2);
  ctx.fill();

  // Whiskers uniform (trail)
  ctx.strokeStyle="rgba(212,175,55,0.66)";
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.10, 0);
  ctx.quadraticCurveTo(s*2.00, -s*(0.52 + wlag), s*3.00, -s*(0.80 + wlag));
  ctx.stroke();

  // Outline
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.ellipse(-s*0.22, 0, s*0.95, s*0.58, 0, 0, Math.PI*2);
  ctx.stroke();

  ctx.restore();
}

/* WATERMARK */
function watermark(){
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(16*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_v18_NECK_DICHOTOMY", 12*DPR, (H-14*DPR));
  ctx.restore();
}

/* LOOP */
let last=0;
function frame(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;
  const t=ts/1000;

  updateLanePx();
  ctx.clearRect(0,0,W,H);

  build(TOP,t,dt);
  drawSegmentedSilhouette(TOP);
  drawHexScales(TOP);
  drawBellyPlates(TOP);
  drawHeadDragon(TOP,t);

  build(BOT,t,dt);
  drawSegmentedSilhouette(BOT);
  drawHexScales(BOT);
  drawBellyPlates(BOT);
  drawHeadDragon(BOT,t);

  watermark();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
