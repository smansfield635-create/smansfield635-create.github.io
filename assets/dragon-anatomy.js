/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — HEAD DISTINCT (JAW vs SNOUT vs HORNS)
   VERSION: DRAGON_v12_HEAD_DISTINCT

   YOUR REQUEST:
   - You can’t distinguish jaw/snout from horns.
   - Make them DISTINCTIVE and DIRECTIVE.

   THIS DELIVERS:
   - Jaw is DARK + lower + hinged + has teeth
   - Snout is LIGHTER + upper + has nose ridge + nostrils
   - Horns are GOLD + rear/top + swept back (never overlaps snout lines)
   - Keeps the improved body direction: segmented silhouette + neck flare + hex scales + dorsal flame crest + belly plates
   - Two dragons, correct facing, head swivel, watermark proof

   NOTE:
   - No layout changes. Pure dragon upgrade.
*/
(function(){
"use strict";
if(window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

window.GD_DRAGON = { version:"DRAGON_v12_HEAD_DISTINCT", mount:function(){} };

const DPR_CAP=1.6;

/* SCALE */
const BODY_W=81;
const BODY_R=BODY_W*0.5;

/* MOTION */
const SEG=170;
const GAP=15;
const SPEED=92;
const AMP=12;
const SWIV=10;

/* HEAD SWIVEL */
const YAW_MAX=0.30;
const YAW_RATE=4.2;

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

/* PALETTES */
function palJade(){
  return {
    a:"rgba(0,165,92,0.95)",
    b:"rgba(0,82,50,0.95)",
    outline:"rgba(0,0,0,0.70)",
    rim:"rgba(255,255,255,0.14)",
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
    rim:"rgba(255,255,255,0.14)",
    gold:"rgba(212,175,55,0.99)",
    goldSoft:"rgba(212,175,55,0.26)",
    belly:"rgba(0,0,0,0.24)",
    scale:"rgba(255,255,255,0.18)",
    scaleDark:"rgba(0,0,0,0.16)"
  };
}

/* DRAGON */
function makeDragon(isTop){
  return {
    top:isTop,
    dir:isTop?1:-1,
    baseY:isTop?0.31:0.69,
    x:isTop?-W*0.22:W*1.22,
    phase:Math.random()*10,
    spine:new Array(SEG),
    pal:isTop?palJade():palCrimson(),
    yaw:0,
    yawT:0
  };
}
const TOP=makeDragon(true);
const BOT=makeDragon(false);

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

/* TAPER + NECK FLARE */
function radiusAt(i){
  const u=i/(SEG-1);
  const tail=(u<0.78)?1.0:lerp(1.0,0.10,(u-0.78)/0.22);

  let flare=1.0;
  if(u<0.22){
    const t=u/0.22;
    flare=1.0 + 0.55*Math.sin(Math.PI*t);
  }

  const head=(u<0.08)?lerp(1.18,1.0,u/0.08):1.0;
  return BODY_R*tail*flare*head*DPR;
}

/* BUILD SPINE */
function build(dr,t,dt){
  const gap=GAP*DPR, amp=AMP*DPR, sw=SWIV*DPR;

  dr.x += dr.dir*SPEED*DPR*dt;

  const margin=W*0.45;
  if(dr.dir>0 && dr.x>W+margin) dr.x=-margin;
  if(dr.dir<0 && dr.x<-margin) dr.x=W+margin;

  const sign=dr.top?1:-1;
  const baseY=H*dr.baseY;

  const headX=dr.x + Math.sin(t*0.90 + dr.phase)*sw*sign;
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
  const t6=tangent(dr.spine,6);
  const curv=(t6.y*t0.x - t6.x*t0.y);
  dr.yawT = clamp(curv*0.9 + Math.sin(t*0.75 + dr.phase)*0.10, -YAW_MAX, YAW_MAX);
  dr.yaw += (dr.yawT - dr.yaw) * clamp(YAW_RATE*dt, 0, 1);
}

/* BODY */
function drawSegmentedSilhouette(dr){
  const sp=dr.spine;

  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0.00, dr.pal.a);
  g.addColorStop(0.55, dr.pal.b);
  g.addColorStop(1.00, dr.pal.b);

  ctx.save();

  ctx.fillStyle=g;
  ctx.beginPath();
  const step=2;
  for(let i=0;i<sp.length;i+=step){
    const p=sp[i];
    const r=radiusAt(i);
    ctx.moveTo(p.x+r,p.y);
    ctx.arc(p.x,p.y,r,0,Math.PI*2);
  }
  ctx.fill("nonzero");

  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=3.8*DPR;
  ctx.lineJoin="round";
  ctx.lineCap="round";
  ctx.stroke();

  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.10)";
  ctx.lineWidth=10*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=3){
    const n=normal(sp,i);
    const r=radiusAt(i);
    ctx.lineTo(sp[i].x + n.x*(r*0.30), sp[i].y + n.y*(r*0.30));
  }
  ctx.stroke();

  ctx.globalCompositeOperation="multiply";
  ctx.strokeStyle=dr.pal.belly;
  ctx.lineWidth=12*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=3){
    const n=normal(sp,i);
    const r=radiusAt(i);
    ctx.lineTo(sp[i].x - n.x*(r*0.44), sp[i].y - n.y*(r*0.44));
  }
  ctx.stroke();

  ctx.restore();
}

function drawFlameCrest(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";

  ctx.strokeStyle=dr.pal.goldSoft;
  ctx.lineWidth=2.8*DPR;
  ctx.beginPath();
  for(let i=0;i<sp.length;i+=3){
    const n=normal(sp,i);
    const r=radiusAt(i);
    ctx.lineTo(sp[i].x + n.x*(r*0.82), sp[i].y + n.y*(r*0.82));
  }
  ctx.stroke();

  ctx.strokeStyle="rgba(255,255,255,0.16)";
  ctx.lineWidth=2.2*DPR;
  const end=Math.floor(sp.length*0.52);
  for(let i=6;i<end;i+=4){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    const h=r*(0.95 + (i%9)*0.05);
    const sx=p.x + n.x*(r*0.92);
    const sy=p.y + n.y*(r*0.92);
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.quadraticCurveTo(sx - n.y*h*0.45, sy + n.x*h*0.45, sx - n.y*h*1.15, sy + n.x*h*1.15);
    ctx.stroke();
  }

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

  for(let i=20;i<sp.length-80;i+=5){
    const p=sp[i];
    const t=tangent(sp,i);
    const n=normal(sp,i);
    const r=radiusAt(i);
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
  ctx.lineWidth=1.0*DPR;
  for(let i=26;i<sp.length-88;i+=9){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
    hex(p.x + n.x*(r*0.05), p.y + n.y*(r*0.05), Math.max(4.6*DPR,r*0.09));
  }

  ctx.restore();
}

function drawBellyPlates(dr){
  const sp=dr.spine;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.10)";
  ctx.lineWidth=1.4*DPR;
  for(let i=22;i<sp.length-80;i+=8){
    const p=sp[i];
    const n=normal(sp,i);
    const r=radiusAt(i);
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

/* DISTINCT HEAD PARTS:
   - HORNS (gold, rear/top, swept back)
   - SNOUT (upper, lighter, ridge line)
   - JAW (lower, darker, hinged, teeth)
*/
function drawHeadDistinct(dr, t){
  const sp=dr.spine;
  const p=sp[0];
  const tv=tangent(sp,0);

  const ang=Math.atan2(tv.y,tv.x) + dr.yaw;
  const s=radiusAt(0)*1.10;

  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(ang);

  if(dr.dir<0) ctx.scale(-1,1);

  // ---------- HORNS (TOP/REAR ONLY) ----------
  ctx.strokeStyle="rgba(212,175,55,0.92)";
  ctx.lineWidth=3.8*DPR;
  ctx.lineCap="round";
  ctx.beginPath();
  // horn 1
  ctx.moveTo(-s*0.40, -s*0.48);
  ctx.quadraticCurveTo(-s*0.15, -s*1.20, s*0.55, -s*1.42);
  // horn 2
  ctx.moveTo(-s*0.55, -s*0.38);
  ctx.quadraticCurveTo(-s*0.30, -s*1.05, s*0.30, -s*1.28);
  ctx.stroke();

  // ---------- SKULL BASE (neutral) ----------
  ctx.fillStyle="rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.05,s*0.70,0,0,Math.PI*2);
  ctx.fill();

  // ---------- SNOUT (UPPER, LIGHTER) ----------
  const snG=ctx.createLinearGradient(0,0,s*2.6,0);
  snG.addColorStop(0.0, dr.pal.a);
  snG.addColorStop(1.0, dr.pal.b);
  ctx.fillStyle=snG;
  ctx.beginPath();
  ctx.moveTo(s*0.10, -s*0.22);
  ctx.quadraticCurveTo(s*1.20, -s*0.46, s*2.15, -s*0.08);
  ctx.quadraticCurveTo(s*1.70,  0.08, s*0.20,  0.10);
  ctx.closePath();
  ctx.fill();

  // snout ridge line (directive)
  ctx.globalCompositeOperation="screen";
  ctx.strokeStyle="rgba(255,255,255,0.14)";
  ctx.lineWidth=2.0*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.25, -s*0.18);
  ctx.quadraticCurveTo(s*1.10, -s*0.36, s*2.00, -s*0.06);
  ctx.stroke();
  ctx.globalCompositeOperation="source-over";

  // nostrils (on snout tip)
  ctx.fillStyle="rgba(0,0,0,0.45)";
  ctx.beginPath(); ctx.arc(s*1.95, -s*0.02, s*0.10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*1.82,  s*0.08, s*0.08, 0, Math.PI*2); ctx.fill();

  // ---------- JAW (LOWER, DARKER) ----------
  ctx.fillStyle="rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.moveTo(s*0.40, s*0.18);
  ctx.quadraticCurveTo(s*1.10, s*0.62, s*2.05, s*0.18);
  ctx.quadraticCurveTo(s*1.25, s*0.78, s*0.45, s*0.46);
  ctx.closePath();
  ctx.fill();

  // mouth line (directive)
  ctx.strokeStyle="rgba(0,0,0,0.55)";
  ctx.lineWidth=2.6*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.45, s*0.16);
  ctx.quadraticCurveTo(s*1.15, s*0.52, s*2.05, s*0.16);
  ctx.stroke();

  // teeth (white hints, clearly jaw)
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=1.2*DPR;
  for(let i=0;i<5;i++){
    const tx=s*(1.10 + i*0.16);
    const ty=s*(0.22 + (i%2)*0.02);
    ctx.beginPath();
    ctx.moveTo(tx,ty);
    ctx.lineTo(tx+s*0.06, ty+s*0.14);
    ctx.stroke();
  }

  // ---------- EYE ----------
  ctx.fillStyle=dr.pal.gold;
  ctx.beginPath();
  ctx.ellipse(s*0.10, -s*0.08, s*0.18, s*0.10, 0.12, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.72)";
  ctx.beginPath();
  ctx.ellipse(s*0.16, -s*0.08, s*0.05, s*0.14, 0.00, 0, Math.PI*2);
  ctx.fill();

  // ---------- WHISKERS (anchored behind snout tip) ----------
  ctx.strokeStyle="rgba(212,175,55,0.66)";
  ctx.lineWidth=2.8*DPR;
  ctx.beginPath();
  ctx.moveTo(s*1.10, 0);
  ctx.quadraticCurveTo(s*2.05, -s*0.55, s*3.10, -s*0.86);
  ctx.moveTo(s*1.10, 0);
  ctx.quadraticCurveTo(s*1.90,  s*0.50, s*2.95,  s*0.70);
  ctx.stroke();

  // beard
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2.4*DPR;
  ctx.beginPath();
  ctx.moveTo(s*0.78, s*0.30);
  ctx.quadraticCurveTo(s*0.55, s*1.10, s*0.00, s*1.42);
  ctx.stroke();

  // head mane (kept)
  ctx.strokeStyle="rgba(255,255,255,0.14)";
  ctx.lineWidth=2.2*DPR;
  for(let i=0;i<9;i++){
    const yy=-s*0.52 + i*(s*0.12);
    ctx.beginPath();
    ctx.moveTo(-s*0.60, yy);
    ctx.quadraticCurveTo(-s*1.25, yy + s*0.18, -s*2.00, yy + s*0.60);
    ctx.stroke();
  }

  // final head outline (keeps it crisp)
  ctx.strokeStyle=dr.pal.outline;
  ctx.lineWidth=2.8*DPR;
  ctx.beginPath();
  ctx.ellipse(0,0,s*1.05,s*0.70,0,0,Math.PI*2);
  ctx.stroke();

  ctx.restore();
}

/* WATERMARK */
function watermark(){
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle="rgba(255,255,255,0.18)";
  ctx.font=(16*DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_v12_HEAD_DISTINCT", 12*DPR, (H-14*DPR));
  ctx.restore();
}

/* LOOP */
let last=0;
function frame(ts){
  if(!last) last=ts;
  const dt=(ts-last)/1000;
  last=ts;
  const t=ts/1000;

  ctx.clearRect(0,0,W,H);

  build(TOP,t,dt);
  drawSegmentedSilhouette(TOP);
  drawFlameCrest(TOP);
  drawHexScales(TOP);
  drawBellyPlates(TOP);
  drawHeadDistinct(TOP,t);

  build(BOT,t,dt);
  drawSegmentedSilhouette(BOT);
  drawFlameCrest(BOT);
  drawHexScales(BOT);
  drawBellyPlates(BOT);
  drawHeadDistinct(BOT,t);

  watermark();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
