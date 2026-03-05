/* ============================================================
   TNT — /assets/dragon-engine.js
   BUILD: DRAGON_SILHOUETTE_CORE_v1
   PURPOSE: Clean dragon silhouette renderer (top + bottom)
   ============================================================ */

(function(){

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* ---------- canvas ---------- */

const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.inset = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "6";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize",resize);

/* ---------- dragon shape ---------- */

function drawDragon(x,y,scale,flip,color){

ctx.save();

ctx.translate(x,y);
ctx.scale(scale * flip, scale);

ctx.fillStyle = color;

ctx.beginPath();

/* tail */
ctx.moveTo(-260,0);

/* back */
ctx.quadraticCurveTo(-180,-40,-100,-30);
ctx.quadraticCurveTo(-40,-20,40,-25);
ctx.quadraticCurveTo(120,-30,200,-10);

/* neck */
ctx.quadraticCurveTo(240,10,270,40);

/* head */
ctx.quadraticCurveTo(290,70,250,80);
ctx.quadraticCurveTo(210,90,180,60);

/* jaw */
ctx.quadraticCurveTo(160,40,110,50);

/* belly */
ctx.quadraticCurveTo(40,70,-60,60);
ctx.quadraticCurveTo(-140,40,-220,20);
ctx.quadraticCurveTo(-260,10,-260,0);

ctx.closePath();
ctx.fill();

/* wing */

ctx.beginPath();
ctx.moveTo(40,-20);
ctx.lineTo(110,-120);
ctx.lineTo(180,-10);
ctx.closePath();
ctx.fill();

/* horn */

ctx.beginPath();
ctx.moveTo(210,80);
ctx.lineTo(240,120);
ctx.lineTo(190,100);
ctx.closePath();
ctx.fill();

ctx.restore();

}

/* ---------- animation ---------- */

let t = 0;

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const cx = canvas.width / 2;
const cy = canvas.height / 2;

t += 0.01;

/* top dragon */

drawDragon(
cx - 320 + Math.sin(t)*40,
cy - 160,
1.4,
1,
"#0f7a3b"
);

/* bottom dragon */

drawDragon(
cx + 320 + Math.sin(t + 1.5)*40,
cy + 160,
1.4,
-1,
"#b32020"
);

requestAnimationFrame(frame);

}

frame();

})();
