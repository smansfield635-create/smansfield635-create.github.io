/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_CONTINUOUS_DRIFT_v3
   FIXES:
     - Motion is CONTINUOUS in one direction (no left-right bobbing)
     - iPad “freeze” gets a watchdog kick (RAF + interval fallback)
*/

(function(){

/* kill any prior engine instance */
try{
  if(window.__GD_DRAGON_ENGINE__ && window.__GD_DRAGON_ENGINE__.stop){
    window.__GD_DRAGON_ENGINE__.stop();
  }
}catch(e){}

var ENGINE = { running:true, raf:0, canvas:null, lastTick:0, lastDraw:0, kick:0 };
window.__GD_DRAGON_ENGINE__ = ENGINE;

/* mount canvas */
var host = document.getElementById("gd-dragon") || document.body;

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

var ctx = cv.getContext("2d", { alpha:true, desynchronized:true });
if(!ctx) return;

/* DPR resize */
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

/* hex raster (pointy-top) */
var HEX = 3 * DPR;
var SQRT3 = Math.sqrt(3);

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

/* dragon params */
var LEN = 170;

function radiusAt(i){
  var t = i/(LEN-1);
  if(t < 0.06) return 2;  /* head */
  if(t < 0.16) return 2;  /* neck */
  if(t < 0.30) return 4;  /* shoulder */
  if(t < 0.72) return 3;  /* torso */
  if(t < 0.90) return 2;  /* tail base */
  return 1;               /* tip */
}

/* continuous drift state (NO sin-based left/right) */
var xScroll = 0;                 /* pixels */
var SPEED_PX = 110 * DPR;        /* px/sec drift speed */
var LANE_DY  = 110 * DPR;        /* vertical separation */

/* dragon draw: q anchor shifts with xScroll */
function dragon(cx,cy,dir,color,time){
  ctx.fillStyle = color;

  for(var i=0;i<LEN;i++){
    var rr = radiusAt(i);

    /* spine uses q baseline + i, with continuous drift */
    var q0 = (dir>0) ? (-95 + i) : (95 - i);

    /* apply drift as an axial shift converted from pixels */
    var driftQ = (xScroll / (HEX*SQRT3)); /* approximate */
    var q = q0 + (dir>0 ? driftQ : -driftQ);

    /* small vertical slither ONLY (keeps life without reversing direction) */
    var r = Math.sin(i*0.14 + time)*2.3 + Math.sin(i*0.045 + time*0.7)*0.8;

    for(var dq=-rr; dq<=rr; dq++){
      for(var dr=-rr; dr<=rr; dr++){
        if(Math.abs(dq+dr) <= rr){
          var p = axialToXY(q+dq, r+dr);
          drawHex(cx + p.x, cy + p.y);
        }
      }
    }
  }
}

/* stop handle */
ENGINE.stop = function(){
  try{ ENGINE.running=false; }catch(e){}
  try{ cancelAnimationFrame(ENGINE.raf); }catch(e){}
  try{
    if(ENGINE.canvas && ENGINE.canvas.parentNode){
      ENGINE.canvas.parentNode.removeChild(ENGINE.canvas);
    }
  }catch(e){}
};

/* RAF loop */
ENGINE.lastTick = performance.now();

function tick(){
  if(!ENGINE.running) return;

  var now = performance.now();
  var dt = (now - ENGINE.lastTick)/1000;
  ENGINE.lastTick = now;

  /* clamp dt (prevents jump after tab sleep) */
  if(dt > 0.05) dt = 0.05;
  if(dt < 0) dt = 0;

  xScroll += SPEED_PX * dt;

  /* wrap drift so it never reverses */
  var wrapPx = 900 * DPR;
  if(xScroll > wrapPx) xScroll -= wrapPx;

  /* draw */
  ctx.clearRect(0,0,W,H);

  var cx = W*0.5;
  var cy = H*0.5;
  var t = now/1000;

  dragon(cx - 220*DPR, cy - LANE_DY, +1, "rgba(26,163,74,0.95)", t);
  dragon(cx + 220*DPR, cy + LANE_DY, -1, "rgba(201,37,37,0.92)", t+1.2);

  /* label proves motion + updates (frame timestamp changes) */
  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_ENGINE_CONTINUOUS_DRIFT_v3  t=" + (now|0), 12*DPR, H - 14*DPR);

  ENGINE.lastDraw = now;
  ENGINE.raf = requestAnimationFrame(tick);
}

ENGINE.raf = requestAnimationFrame(tick);

/* iPad freeze watchdog: if RAF stalls, kick it */
ENGINE.kick = setInterval(function(){
  if(!ENGINE.running) return;
  var now = performance.now();
  if(now - ENGINE.lastDraw > 700){
    try{ ENGINE.lastTick = now; }catch(e){}
    try{ requestAnimationFrame(tick); }catch(e){}
  }
}, 500);

})();
