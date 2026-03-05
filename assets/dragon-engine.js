/* TNT — /assets/dragon-engine.js
   BUILD: HEX_CHINESE_DRAGON_NOWING_v1_HEX4
   PURPOSE:
     - Chinese dragon (NO wings)
     - TRUE segmented proportions (head/neck/shoulder/torso/tail)
     - Continuous drift (no left-right bobbing)
     - iPad freeze guard (RAF + watchdog)
*/

(function(){

/* hard-kill any prior instance */
try{
  if(window.__GD_DRAGON_ENGINE__ && window.__GD_DRAGON_ENGINE__.stop){
    window.__GD_DRAGON_ENGINE__.stop();
  }
}catch(e){}

var ENGINE = { running:true, raf:0, canvas:null, lastDraw:0, kick:0 };
window.__GD_DRAGON_ENGINE__ = ENGINE;

/* host */
var host = document.getElementById("gd-dragon") || document.body;

/* canvas */
var cv = document.createElement("canvas");
cv.id = "gd_dragon_canvas";
cv.style.position = "absolute";
cv.style.inset = "0";
cv.style.width = "100%";
cv.style.height = "100%";
cv.style.pointerEvents = "none";
cv.style.zIndex = "6";
host.appendChild(cv);
ENGINE.canvas = cv;

var ctx = cv.getContext("2d", { alpha:true });
if(!ctx) return;

/* DPR + resize */
var DPR_CAP = 1.6;
var W=0,H=0,DPR=1;

function resize(){
  var dpr=1;
  try{ dpr = window.devicePixelRatio || 1; }catch(e){}
  DPR = Math.min(DPR_CAP, Math.max(1, dpr));
  W = Math.max(1, Math.floor((window.innerWidth||1) * DPR));
  H = Math.max(1, Math.floor((window.innerHeight||1) * DPR));
  cv.width = W;
  cv.height = H;
}
resize();
window.addEventListener("resize", resize, {passive:true});

/* ===== HEX (THIS IS THE PIXEL SIZE CONTROL) ===== */
var HEX_BASE = 4;               /* <-- you requested 4 */
var HEX = HEX_BASE * DPR;
var SQRT3 = Math.sqrt(3);

/* pointy-top axial -> pixel */
function axialToXY(q,r){
  return {
    x: HEX * SQRT3 * (q + r/2),
    y: HEX * 1.5 * r
  };
}

function drawHex(x,y){
  ctx.beginPath();
  for(var i=0;i<6;i++){
    var a = Math.PI/3*i - Math.PI/6;
    var px = x + Math.cos(a)*HEX;
    var py = y + Math.sin(a)*HEX;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fill();
}

/* ===== SEGMENTED DRAGON PROFILE (NO WINGS) ===== */
var HEAD_LEN     = 10;   /* thin pointed */
var NECK_LEN     = 18;   /* pinch */
var SHOULDER_LEN = 20;   /* max mass */
var TORSO_LEN    = 70;   /* long body */
var TAIL_LEN     = 46;   /* long taper */

var LEN = HEAD_LEN + NECK_LEN + SHOULDER_LEN + TORSO_LEN + TAIL_LEN;

/* radius per index (rings) */
function radiusAt(i){
  if(i < HEAD_LEN){
    /* pointed head: 2 -> 1 quickly */
    return (i < 3) ? 2 : 1;
  }

  if(i < HEAD_LEN + NECK_LEN){
    /* neck pinch: thin */
    return 1;
  }

  if(i < HEAD_LEN + NECK_LEN + SHOULDER_LEN){
    /* shoulder bulge: max */
    return 4;
  }

  if(i < HEAD_LEN + NECK_LEN + SHOULDER_LEN + TORSO_LEN){
    /* torso: slightly thinner */
    return 3;
  }

  /* tail taper: 2 -> 1 -> 0 */
  var t = (i - (LEN - TAIL_LEN)) / (TAIL_LEN - 1);
  if(t < 0.55) return 2;
  if(t < 0.88) return 1;
  return 0;
}

/* snout extension (adds a sharper tip) */
function snoutExtra(i){
  /* forward points only in head */
  if(i === 0) return 3;
  if(i === 1) return 2;
  if(i === 2) return 1;
  return 0;
}

/* continuous drift (never reverses direction) */
var xScroll = 0;                 /* pixels */
var SPEED_PX = 140 * DPR;        /* px/sec */
var WRAP_PX  = 1400 * DPR;       /* wrap span */
var LANE_DY  = 130 * DPR;        /* lane spacing */

/* dragon render */
function dragon(cx,cy,dir,color,time){
  ctx.fillStyle = color;

  /* drift converted to axial q-shift */
  var driftQ = (xScroll / (HEX * SQRT3));

  for(var i=0;i<LEN;i++){
    var rr = radiusAt(i);

    /* base forward direction along q axis */
    var q0 = (dir>0) ? (-100 + i) : (100 - i);
    var q = q0 + (dir>0 ? driftQ : -driftQ);

    /* slither (vertical only; does not reverse travel) */
    var r = Math.sin(i*0.12 + time)*2.6 + Math.sin(i*0.035 + time*0.7)*0.9;

    /* body fill */
    for(var dq=-rr; dq<=rr; dq++){
      for(var dr=-rr; dr<=rr; dr++){
        if(Math.abs(dq+dr) <= rr){
          var p = axialToXY(q+dq, r+dr);
          drawHex(cx + p.x, cy + p.y);
        }
      }
    }

    /* snout tip (thin pointed) */
    var sx = snoutExtra(i);
    if(sx>0){
      var p2 = axialToXY(q + (dir>0 ? sx : -sx), r);
      drawHex(cx + p2.x, cy + p2.y);
    }
  }
}

/* stop handle */
ENGINE.stop = function(){
  try{ ENGINE.running=false; }catch(e){}
  try{ cancelAnimationFrame(ENGINE.raf); }catch(e){}
  try{ clearInterval(ENGINE.kick); }catch(e){}
  try{
    if(ENGINE.canvas && ENGINE.canvas.parentNode){
      ENGINE.canvas.parentNode.removeChild(ENGINE.canvas);
    }
  }catch(e){}
};

/* RAF loop */
var last = performance.now();

function tick(){
  if(!ENGINE.running) return;

  var now = performance.now();
  var dt = (now - last)/1000;
  last = now;

  /* clamp dt */
  if(dt > 0.05) dt = 0.05;
  if(dt < 0) dt = 0;

  xScroll += SPEED_PX * dt;
  if(xScroll > WRAP_PX) xScroll -= WRAP_PX;

  ctx.clearRect(0,0,W,H);

  var cx = W*0.5;
  var cy = H*0.5;
  var t = now/1000;

  /* Love (jade) moves right; Fear (crimson) moves left */
  dragon(cx - 260*DPR, cy - LANE_DY, +1, "rgba(26,163,74,0.95)", t);
  dragon(cx + 260*DPR, cy + LANE_DY, -1, "rgba(201,37,37,0.92)", t+1.2);

  /* label proves motion */
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("HEX_CHINESE_DRAGON_NOWING_v1_HEX4  t=" + (now|0), 12*DPR, H - 14*DPR);

  ENGINE.lastDraw = now;
  ENGINE.raf = requestAnimationFrame(tick);
}

ENGINE.raf = requestAnimationFrame(tick);

/* iPad freeze watchdog */
ENGINE.kick = setInterval(function(){
  if(!ENGINE.running) return;
  var now = performance.now();
  if(now - ENGINE.lastDraw > 700){
    try{ last = now; }catch(e){}
    try{ requestAnimationFrame(tick); }catch(e){}
  }
}, 500);

})();
