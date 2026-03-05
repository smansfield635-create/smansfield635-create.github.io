/* TNT 2/2 — /assets/dragon-engine.js
   BUILD: DRAGON_ENGINE_MOTION_FIX_v1
   PURPOSE: guaranteed RAF loop + visible label + moving hex silhouettes
*/

(function(){

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* ===== canvas mount ===== */
var host=document.getElementById("gd-dragon") || document.body;

var cv=document.getElementById("gd_dragon_canvas");
if(!cv){
  cv=document.createElement("canvas");
  cv.id="gd_dragon_canvas";
  cv.style.position="absolute";
  cv.style.inset="0";
  cv.style.width="100%";
  cv.style.height="100%";
  cv.style.pointerEvents="none";
  cv.style.zIndex="6";
  host.appendChild(cv);
}

var ctx=cv.getContext("2d",{alpha:true,desynchronized:true});
if(!ctx) return;

function resize(){
  cv.width=Math.max(1,window.innerWidth|0);
  cv.height=Math.max(1,window.innerHeight|0);
}
resize();
window.addEventListener("resize",resize,{passive:true});

/* ===== hex draw ===== */
var HEX=3;
var SQRT3=Math.sqrt(3);

function hexXY(q,r){
  return {
    x: HEX*SQRT3*(q + r/2),
    y: HEX*1.5*r
  };
}

function drawHex(x,y){
  ctx.beginPath();
  for(var i=0;i<6;i++){
    var a=Math.PI/3*i - Math.PI/6; /* pointy-top */
    var px=x + HEX*Math.cos(a);
    var py=y + HEX*Math.sin(a);
    if(i===0) ctx.moveTo(px,py);
    else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fill();
}

/* ===== silhouette params ===== */
var LEN=120;

function radiusAt(i){
  var t=i/(LEN-1);
  if(t<0.08) return 2;        /* head */
  if(t<0.20) return 2;        /* neck */
  if(t<0.35) return 4;        /* shoulder */
  if(t<0.75) return 3;        /* torso */
  if(t<0.92) return 2;        /* tail base */
  return 1;                   /* tip */
}

function dragon(cx,cy,dir,color,time){
  ctx.fillStyle=color;

  for(var i=0;i<LEN;i++){
    var rr=radiusAt(i);

    /* spine (long + smooth) */
    var q = (dir>0) ? (-60 + i) : (60 - i);
    var r = Math.sin(i*0.18 + time)*2.2;

    for(var dq=-rr; dq<=rr; dq++){
      for(var dr=-rr; dr<=rr; dr++){
        if(Math.abs(dq+dr) <= rr){
          var p=hexXY(q+dq, r+dr);
          drawHex(cx + p.x, cy + p.y);
        }
      }
    }
  }
}

/* ===== guaranteed RAF loop ===== */
var t0=performance.now();

function loop(){
  var now=performance.now();
  var t=(now - t0)/1000;

  ctx.clearRect(0,0,cv.width,cv.height);

  var cx=cv.width*0.5;
  var cy=cv.height*0.5;

  /* motion: left/right glide + subtle vertical */
  var dx=Math.sin(t*0.8)*120;
  var dy=Math.sin(t*0.6)*22;

  dragon(cx + dx - 140, cy + dy - 90, +1, "#1aa34a", t*0.9);  /* love */
  dragon(cx + dx + 140, cy + dy + 90, -1, "#c92525", t*0.9+1.1); /* fear */

  /* visible label (proves loop is running) */
  ctx.fillStyle="rgba(255,255,255,0.55)";
  ctx.font="12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_ENGINE_MOTION_FIX_v1", 12, cv.height-14);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

})();
