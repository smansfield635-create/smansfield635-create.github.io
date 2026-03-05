/* TNT — /assets/dragon-engine.js
   DRAGON SILHOUETTE ENGINE
   BUILD: DRAGON_SILHOUETTE_L2
   PURPOSE: unmistakable dragon silhouette (head wedge + horns + whiskers + ridge + tail fin)
            mounts into #gd-dragon if present
*/

(function(){
"use strict";

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

/* mount canvas into gd-dragon layer if present */
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

const ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });

function resize(){
  canvas.width = Math.max(1, window.innerWidth|0);
  canvas.height = Math.max(1, window.innerHeight|0);
}
resize();
window.addEventListener("resize", resize, {passive:true});

let t = 0;

function drawDragon(x, y, s, flip, bodyColor, ridgeColor){

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s*flip, s);

  /* ---------------------------
     BODY SILHOUETTE (closed hull)
     --------------------------- */
  ctx.fillStyle = bodyColor;
  ctx.beginPath();

  // dorsal line (tail -> head)
  ctx.moveTo(-240, 0);
  ctx.bezierCurveTo(-170, -70, -70, -60, 40, -35);
  ctx.bezierCurveTo(120, -55, 185, -35, 225, -10);    // shoulder toward neck
  ctx.bezierCurveTo(255, 8, 275, 28, 290, 55);        // neck up into head

  // head top (skull)
  ctx.bezierCurveTo(305, 82, 285, 105, 250, 102);     // skull crest
  ctx.bezierCurveTo(230, 100, 215, 88, 205, 72);      // back of head

  // jaw + throat
  ctx.bezierCurveTo(195, 58, 185, 52, 165, 54);       // jaw hinge
  ctx.bezierCurveTo(120, 60, 78, 82, 40, 75);         // throat bulge

  // ventral line (head -> tail)
  ctx.bezierCurveTo(-10, 66, -80, 55, -140, 35);
  ctx.bezierCurveTo(-190, 20, -230, 12, -240, 0);

  ctx.closePath();
  ctx.fill();

  /* outline */
  ctx.strokeStyle = "rgba(0,0,0,0.70)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.stroke();

  /* ---------------------------
     DORSAL RIDGE (spikes)
     --------------------------- */
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = ridgeColor;
  ctx.lineWidth = 2;
  for(let i=0;i<10;i++){
    const px = lerp(-170, 165, i/9);
    const py = -40 - 10*Math.sin(i*0.7);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px-8, py-22);
    ctx.stroke();
  }
  ctx.restore();

  /* ---------------------------
     HEAD WEDGE (snout + jaw separation)
     --------------------------- */
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.beginPath();
  ctx.moveTo(315, 72);       // snout tip
  ctx.lineTo(255, 95);       // upper jaw base
  ctx.lineTo(248, 76);       // lower jaw base
  ctx.closePath();
  ctx.fill();

  /* ---------------------------
     HORNS (two distinct vectors)
     --------------------------- */
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.moveTo(250, 95);
  ctx.lineTo(232, 130);
  ctx.lineTo(258, 108);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(268, 92);
  ctx.lineTo(290, 128);
  ctx.lineTo(270, 108);
  ctx.closePath();
  ctx.fill();

  /* ---------------------------
     WHISKERS (filament curves)
     --------------------------- */
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(212,175,55,0.55)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(290, 78);
  ctx.quadraticCurveTo(340, 55, 392, 70);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(288, 84);
  ctx.quadraticCurveTo(336, 105, 392, 95);
  ctx.stroke();

  ctx.restore();

  /* ---------------------------
     TAIL FIN (prevents dot tail)
     --------------------------- */
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.moveTo(-240, 0);
  ctx.lineTo(-280, -22);
  ctx.lineTo(-270, 18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function lerp(a,b,t){ return a + (b-a)*t; }

function frame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  t += 0.01;

  // top dragon (jade) left->right
  drawDragon(
    cx - 320 + Math.sin(t)*50,
    cy - 170,
    1.15,
    1,
    "rgba(14,124,58,0.92)",
    "rgba(212,175,55,0.16)"
  );

  // bottom dragon (crimson) right->left
  drawDragon(
    cx + 320 + Math.sin(t+1.5)*50,
    cy + 170,
    1.15,
    -1,
    "rgba(179,33,33,0.90)",
    "rgba(212,175,55,0.12)"
  );

  // watermark (proof you’re running this build)
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("DRAGON_SILHOUETTE_L2", 12, canvas.height-14);

  requestAnimationFrame(frame);
}

frame();

})();
