/* TNT — /assets/dragon-engine.js
   BUILD: HEX_DRAGON_ENGINE_v3_SCALE2
*/

(function(){

if(window.__HEX_DRAGON_RUNNING__) return;
window.__HEX_DRAGON_RUNNING__ = true;

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

/* HEX SETTINGS */

const HEX_SIZE = 3;
const SCALE = 2.0;        // ← dragon now 2× larger
const BODY_LENGTH = 36;

let t = 0;

function hex(x,y,c){

const s = HEX_SIZE * SCALE;
const h = Math.sqrt(3) * s / 2;

ctx.beginPath();
ctx.moveTo(x+s,y);
ctx.lineTo(x+s/2,y+h);
ctx.lineTo(x-s/2,y+h);
ctx.lineTo(x-s,y);
ctx.lineTo(x-s/2,y-h);
ctx.lineTo(x+s/2,y-h);
ctx.closePath();

ctx.fillStyle=c;
ctx.fill();

}

function dragon(cx,cy,color,dir){

for(let i=0;i<BODY_LENGTH;i++){

const bend=Math.sin(i*0.3+t)*10;

const x=cx + dir*(i*HEX_SIZE*3*SCALE);
const y=cy + bend;

const radius = Math.max(1,6 - i*0.15);

for(let q=-radius;q<=radius;q++){
for(let r=-radius;r<=radius;r++){

if(Math.abs(q+r)<=radius){

const hx=x+q*HEX_SIZE*2*SCALE;
const hy=y+r*HEX_SIZE*1.7*SCALE;

hex(hx,hy,color);

}

}

}

}

}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

t+=0.02;

const cx=canvas.width/2;
const cy=canvas.height/2;

dragon(cx-250,cy-30,"#27c46b",1);   // love dragon
dragon(cx+250,cy+30,"#ff3a3a",-1);  // fear dragon

requestAnimationFrame(frame);

}

frame();

})();
