/* TNT — /assets/dragon-engine.js
   DRAGON SILHOUETTE (HARD-PROOF RESET)
   RESET_ID: RESET_20260304_2359
   WHAT THIS DOES:
   - draws TWO obvious dragon silhouettes (not tubes)
   - prints RESET_ID bottom-left so you can prove the correct file is running
*/
(function(){
"use strict";

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

const RESET_ID = "RESET_20260304_2359";

/* mount into gd-dragon layer if it exists */
const host = document.getElementById("gd-dragon") || document.body;

const canvas = document.createElement("canvas");
canvas.id = "gd_dragon_engine_canvas";
canvas.style.position = "absolute";
canvas.style.inset = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "6";
host.appendChild(canvas);

const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});

function resize(){
  canvas.width = Math.max(1, window.innerWidth|0);
  canvas.height = Math.max(1, window.innerHeight|0);
}
resize();
window.addEventListener("resize", resize, {passive:true});

let tt = 0;

function dragonSilhouette(x,y,s,flip,fill){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(s*flip,s);

  ctx.fillStyle = fill;

  // BODY (closed hull) — distinct head/neck/torso/tail
  ctx.beginPath();

  // tail tip
  ctx.moveTo(-260, 0);

  // dorsal tail/body
  ctx.quadraticCurveTo(-210,-30,-170,-18);
  ctx.quadraticCurveTo(-110,-10,-70,-18);

  // shoulder/torso mass (this is what prevents “tube”)
  ctx.quadraticCurveTo(-10,-70, 60,-48);
  ctx.quadraticCurveTo(120,-28, 165,-22);

  // neck rise
  ctx.quadraticCurveTo(215,  8, 240,  62);

  // skull top
  ctx.quadraticCurveTo(260,  92, 225, 108);

  // snout wedge (hard head read)
  ctx.lineTo(250,  88);
  ctx.lineTo(292,  86);
  ctx.lineTo(250,  66);

  // jaw / throat
  ctx.quadraticCurveTo(215,  52, 178,  70);

  // belly return (torso underside)
  ctx.quadraticCurveTo(120,  92,  55,  82);
  ctx.quadraticCurveTo(-10,  72, -70,  78);
  ctx.quadraticCurveTo(-145, 62, -205, 32);

  // close at tail
  ctx.quadraticCurveTo(-245, 18, -260, 0);

  ctx.closePath();
  ctx.fill();

  // WING MASS (triangle) — immediate dragon-class read
  ctx.beginPath();
  ctx.moveTo(40,-30);
  ctx.lineTo(-70,-165);
  ctx.lineTo(100,-55);
  ctx.closePath();
  ctx.fill();

  // HORNS (two triangles)
  ctx.beginPath();
  ctx.moveTo(225,102);
  ctx.lineTo(210,132);
  ctx.lineTo(238,112);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(245,98);
  ctx.lineTo(268,130);
  ctx.lineTo(246,112);
  ctx.closePath();
  ctx.fill();

  // TAIL FIN (prevents dot tail)
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

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  tt += 0.012;

  // top dragon (jade)
  dragonSilhouette(
    cx - 320 + Math.sin(tt)*55,
    cy - 170,
    1.1,
    1,
    "rgba(14,124,58,0.92)"
  );

  // bottom dragon (crimson, mirrored)
  dragonSilhouette(
    cx + 320 + Math.sin(tt+1.4)*55,
