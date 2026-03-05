/* TNT — /assets/dragon-engine.js
   BUILD: DRAGON_HEX4_RUNTIME
*/

(function(){

if(window.__DRAGON_ENGINE_RUNNING__) return;
window.__DRAGON_ENGINE_RUNNING__ = true;

const PIXEL = 4;

const canvas = document.createElement("canvas");
canvas.style.position="fixed";
canvas.style.inset="0";
canvas.style.pointerEvents="none";
canvas.style.zIndex="6";
document.getElementById("gd-dragon").appendChild(canvas);

const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

let t=0;

function hex(x,y,r){
const a=Math.PI/3;
ctx.beginPath();
for(let i=0;i<6;i++){
const px=x+r*Math.cos(a*i);
const py=y+r*Math.sin(a*i);
if(i===0) ctx.moveTo(px,py);
else ctx.lineTo(px,py);
}
ctx.closePath();
}

function dragon(cx,cy,dir,color){

const length = 120;
const thickness = 5;

for(let i=0;i<length;i++){

const x = cx + dir*i*PIXEL*1.4;

const y =
cy
+ Math.sin((i*0.35)+t)*PIXEL*thickness
+ Math.sin((i*0.12)+t)*PIXEL*3;

ctx.fillStyle=color;
hex(x,y,PIXEL);
ctx.fill();

}

}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const cx = canvas.width/2;
const cy = canvas.height/2;

t+=0.04;

dragon(cx-200,cy-120,1,"#0e7c3a");
dragon(cx+200,cy+120,-1,"#b32121");

requestAnimationFrame(frame);

}

frame();

})();
