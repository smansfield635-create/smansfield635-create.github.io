/* TNT — /assets/dragon-engine.js
   DRAGON SILHOUETTE ENGINE v1
*/

(function(){

if(window.__DRAGON_RUNNING__) return;
window.__DRAGON_RUNNING__ = true;

const canvas = document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

let t = 0;

function drawDragon(x,y,scale,flip,color){

  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale*flip,scale);

  ctx.fillStyle=color;

  ctx.beginPath();

  ctx.moveTo(-200,0);      // tail
  ctx.quadraticCurveTo(-120,-40,-60,-20);
  ctx.quadraticCurveTo(-20,-10,40,-20);
  ctx.quadraticCurveTo(120,-40,180,-10);

  ctx.quadraticCurveTo(240,0,260,20);   // neck

  ctx.quadraticCurveTo(280,40,250,60);  // head
  ctx.quadraticCurveTo(220,70,200,40);

  ctx.quadraticCurveTo(180,20,120,30);  // body return
  ctx.quadraticCurveTo(40,40,-40,30);
  ctx.quadraticCurveTo(-120,20,-200,0);

  ctx.closePath();
  ctx.fill();

  ctx.restore();

}

function frame(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  t += 0.01;

  drawDragon(
    cx - 300 + Math.sin(t)*40,
    cy - 120,
    1.2,
    1,
    "#0e7c3a"
  );

  drawDragon(
    cx + 300 + Math.sin(t+1.3)*40,
    cy + 120,
    1.2,
    -1,
    "#b32121"
  );

  requestAnimationFrame(frame);

}

frame();

})();
