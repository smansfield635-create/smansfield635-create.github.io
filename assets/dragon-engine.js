/* TNT — /assets/dragon-engine.js
   DRAGON SILHOUETTE ENGINE
   BUILD: DRAGON_SILHOUETTE_TRUE_v1
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

function dragon(x,y,s,flip,color){

ctx.save();
ctx.translate(x,y);
ctx.scale(s*flip,s);

ctx.fillStyle=color;

ctx.beginPath();

/* tail */
ctx.moveTo(-260,0);

/* tail taper */
ctx.quadraticCurveTo(-200,-30,-160,-15);

/* back body */
ctx.quadraticCurveTo(-120,-10,-80,-15);

/* shoulder hump */
ctx.quadraticCurveTo(-30,-60,40,-40);

/* back to neck */
ctx.quadraticCurveTo(90,-20,140,-10);

/* neck rise */
ctx.quadraticCurveTo(200,30,230,80);

/* head top */
ctx.quadraticCurveTo(250,100,210,110);

/* snout */
ctx.lineTo(240,90);
ctx.lineTo(270,90);
ctx.lineTo(240,70);

/* jaw */
ctx.quadraticCurveTo(210,60,180,70);

/* chest */
ctx.quadraticCurveTo(150,90,90,80);

/* wing mass */
ctx.quadraticCurveTo(30,70,-40,80);

/* belly */
ctx.quadraticCurveTo(-120,70,-180,40);

/* tail bottom */
ctx.quadraticCurveTo(-230,20,-260,0);

ctx.closePath();
ctx.fill();

/* wing triangle silhouette */

ctx.beginPath();
ctx.moveTo(-10,-20);
ctx.lineTo(-90,-140);
ctx.lineTo(60,-40);
ctx.closePath();
ctx.fill();

/* horn */

ctx.beginPath();
ctx.moveTo(215,100);
ctx.lineTo(205,130);
ctx.lineTo(230,110);
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
cx-300+Math.sin(t)*60,
cy-160,
1.4,
1,
"#0e7c3a"
);

/* bottom dragon */

dragon(
cx+300+Math.sin(t+1.7)*60,
cy+160,
1.4,
-1,
"#b32121"
);

requestAnimationFrame(frame);

}

frame();

})();
