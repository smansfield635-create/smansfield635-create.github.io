/* TNT — /assets/dragon-engine.js
   DRAGON ENGINE — DIAGNOSTIC OVERLAY
   BUILD: DRAGON_DIAG_v1
*/
(function(){
"use strict";

function overlay(msg){
  try{
    var el=document.getElementById("__diag");
    if(!el){
      el=document.createElement("pre");
      el.id="__diag";
      el.style.position="fixed";
      el.style.left="10px";
      el.style.top="40px";
      el.style.right="10px";
      el.style.zIndex="999999";
      el.style.padding="10px 12px";
      el.style.whiteSpace="pre-wrap";
      el.style.font="700 12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
      el.style.color="rgba(255,255,255,0.92)";
      el.style.background="rgba(0,0,0,0.55)";
      el.style.border="1px solid rgba(255,255,255,0.18)";
      el.style.borderRadius="12px";
      el.style.pointerEvents="none";
      (document.body||document.documentElement).appendChild(el);
    }
    el.textContent=String(msg);
  }catch(e){}
}

window.addEventListener("error", function(e){
  overlay("JS ERROR:\\n" + (e && e.message ? e.message : "UNKNOWN") + "\\n" + (e && e.filename ? e.filename : "") + ":" + (e && e.lineno ? e.lineno : "") );
});

window.addEventListener("unhandledrejection", function(e){
  overlay("PROMISE REJECTION:\\n" + (e && e.reason ? String(e.reason) : "UNKNOWN"));
});

overlay("DRAGON_DIAG_v1: script loaded. building canvas…");

try{
  if(window.__DRAGON_ENGINE_RUNNING__) { overlay("DRAGON_DIAG_v1: already running"); return; }
  window.__DRAGON_ENGINE_RUNNING__ = true;

  var RESET_ID="RESET_20260304_2359";

  var host=document.getElementById("gd-dragon") || document.body;
  if(!host){ overlay("DRAGON_DIAG_v1: NO HOST"); return; }

  var canvas=document.createElement("canvas");
  canvas.id="gd_dragon_engine_canvas";
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.style.pointerEvents="none";
  canvas.style.zIndex="6";
  host.appendChild(canvas);

  var ctx=canvas.getContext("2d");
  if(!ctx){ overlay("DRAGON_DIAG_v1: NO 2D CONTEXT"); return; }

  function resize(){
    canvas.width = Math.max(1, window.innerWidth|0);
    canvas.height = Math.max(1, window.innerHeight|0);
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  var tt=0;

  function dragonSilhouette(x,y,s,flip,fill){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(s*flip,s);
    ctx.fillStyle=fill;

    ctx.beginPath();
    ctx.moveTo(-260,0);
    ctx.quadraticCurveTo(-210,-30,-170,-18);
    ctx.quadraticCurveTo(-110,-10,-70,-18);
    ctx.quadraticCurveTo(-10,-70,60,-48);
    ctx.quadraticCurveTo(120,-28,165,-22);
    ctx.quadraticCurveTo(215,8,240,62);
    ctx.quadraticCurveTo(260,92,225,108);
    ctx.lineTo(250,88); ctx.lineTo(292,86); ctx.lineTo(250,66);
    ctx.quadraticCurveTo(215,52,178,70);
    ctx.quadraticCurveTo(120,92,55,82);
    ctx.quadraticCurveTo(-10,72,-70,78);
    ctx.quadraticCurveTo(-145,62,-205,32);
    ctx.quadraticCurveTo(-245,18,-260,0);
    ctx.closePath();
    ctx.fill();

    // wing
    ctx.beginPath();
    ctx.moveTo(40,-30);
    ctx.lineTo(-70,-165);
    ctx.lineTo(100,-55);
    ctx.closePath();
    ctx.fill();

    // horns
    ctx.beginPath(); ctx.moveTo(225,102); ctx.lineTo(210,132); ctx.lineTo(238,112); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(245,98);  ctx.lineTo(268,130); ctx.lineTo(246,112); ctx.closePath(); ctx.fill();

    // tail fin
    ctx.beginPath();
    ctx.moveTo(-260,0);
    ctx.lineTo(-300,-20);
    ctx.lineTo(-292,18);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    var cx=canvas.width/2;
    var cy=canvas.height/2;

    tt += 0.012;

    dragonSilhouette(cx-320+Math.sin(tt)*55, cy-170, 1.1,  1, "rgba(14,124,58,0.92)");
    dragonSilhouette(cx+320+Math.sin(tt+1.4)*55, cy+170, 1.1, -1, "rgba(179,33,33,0.90)");

    ctx.fillStyle="rgba(255,255,255,0.92)";
    ctx.font="bold 14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
    ctx.fillText("RESET_ID: "+RESET_ID, 12, canvas.height-14);

    requestAnimationFrame(frame);
  }

  overlay("DRAGON_DIAG_v1: starting RAF…");
  requestAnimationFrame(frame);

}catch(err){
  overlay("FATAL:\\n" + String(err && err.stack ? err.stack : err));
}
})();
