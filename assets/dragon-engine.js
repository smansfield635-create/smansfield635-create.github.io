/* TNT — /assets/dragon-engine.js
   DRAGON SILHOUETTE ENGINE
   BUILD: DRAGON_SILHOUETTE_L1
*/

(function(){

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

const canvas=document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
document.body.appendChild(canvas);

const ctx=canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

let t=0;

function dragon(x,y,scale,flip,color){

ctx.save();
ctx.translate(x,y);
ctx.scale(scale*flip,scale);

ctx.fillStyle=color;

ctx.beginPath();

/* tail */
ctx.moveTo(-240,0);

/* back */
ctx.quadraticCurveTo(-160,-40,-100,-20);
ctx.quadraticCurveTo(-40,-5,40,-15);
ctx.quadraticCurveTo(120,-30,200,-10);

/* neck */
ctx.quadraticCurveTo(240,10,260,40);

/* head */
ctx.quadraticCurveTo(280,70,240,80);
ctx.quadraticCurveTo(200,90,180,60);

/* jaw */
ctx.quadraticCurveTo(160,40,120,50);

/* belly */
ctx.quadraticCurveTo(60,60,-40,50);
ctx.quadraticCurveTo(-120,40,-200,20);
ctx.quadraticCurveTo(-240,10,-240,0);

ctx.closePath();
ctx.fill();

ctx.restore();
}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const cx=canvas.width/2;
const cy=canvas.height/2;

t+=0.01;

/* top dragon */
dragon(
cx-320+Math.sin(t)*50,
cy-160,
1.4,
1,
"#0e7c3a"
);

/* bottom dragon */
dragon(
cx+320+Math.sin(t+1.5)*50,
cy+160,
1.4,
-1,
"#b32121"
);

requestAnimationFrame(frame);
}

frame();

})();
