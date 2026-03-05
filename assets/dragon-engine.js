/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_MOTION_GUARANTEED_v2
   PURPOSE: ALWAYS MOVES (kills prior instances, guarantees RAF loop)
*/

(function(){

/* ===== hard-kill any prior instance ===== */
try{
  if(window.__GD_DRAGON_ENGINE__ && window.__GD_DRAGON_ENGINE__.stop){
    window.__GD_DRAGON_ENGINE__.stop();
  }
}catch(e){}

/* ===== create new instance handle ===== */
var ENGINE = { running:true, raf:0, canvas:null };
window.__GD_DRAGON_ENGINE__ = ENGINE;

/* ===== mount canvas ===== */
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

/* ===== DPR resize ===== */
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

/* ===== hex raster (pointy-top) ===== */
var HEX = 3 * DPR;   /* 3px base, scaled by DPR */
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
    var a = Math.PI/3*i - Math.PI/6; /* pointy-top */
    var px = x + Math.cos(a)*HEX;
    var py = y + Math.sin(a)*HEX;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fill();
}

/* ===== body profile ===== */
var LEN = 160;

function radiusAt(i){
  var t = i/(LEN-1);
  if(t < 0.06) return 2;      /* snout/head */
  if(t < 0.16) return 2;      /* neck */
  if(t < 0.30) return 4;      /* shoulder */
  if(t < 0.72) return 3;      /* torso */
  if(t < 0.90) return 2;      /* tail base */
  return 1;                   /* tip */
}

/* ===== dragon draw ===== */
function dragon(cx,cy,dir,color,time){
  ctx.fillStyle = color;

  for(var i=0;i<LEN;i++){
    var rr = radiusAt(i);

    /* axial spine: long serpentine */
    var q = (dir>0) ? (-80 + i) : (80 - i);
    var r = Math.sin(i*0.14 + time)*2.4 + Math.sin(i*0.045 + time*0.7)*0.8;

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

/* ===== stop handle ===== */
ENGINE.stop = function(){
  try{ ENGINE.running=false; }catch(e){}
  try{ cancelAnimationFrame(ENGINE.raf); }catch(e){}
  try{
    if(ENGINE.canvas && ENGINE.canvas.parentNode){
      ENGINE.canvas.parentNode.removeChild(ENGINE.canvas);
    }
  }catch(e){}
};

/* ===== RAF loop (GUARANTEED) ===== */
var t0 = performance.now();

function loop(){
  if(!ENGINE.running) return;

  var now = performance.now();
  var t = (now - t0)/1000;

  /* clear */
  ctx.clearRect(0,0,W,H);

  /* center + motion */
  var cx = W*0.5;
  var cy = H*0.5;

  var dx = Math.sin(t*0.65) * (140*DPR);
  var dy = Math.sin(t*0.42) * (26*DPR);

  dragon(cx + dx - 180*DPR, cy + dy - 110*DPR, +1, "rgba(26,163,74,0.95)", t*0.95);
  dragon(cx + dx + 180*DPR, cy + dy + 110*DPR, -1, "rgba(201,37,37,0.92)", t*0.95 + 1.2);

  /* visible label (proves loop is running) */
  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = (12*DPR) + "px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_ENGINE_MOTION_GUARANTEED_v2", 12*DPR, H - 14*DPR);

  ENGINE.raf = requestAnimationFrame(loop);
}

ENGINE.raf = requestAnimationFrame(loop);

})();
